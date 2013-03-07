/*
 * getopt.js: node.js implementation of POSIX getopt() (and then some)
 *
 * Copyright 2011 David Pacheco. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import "console.jsx";

class CommandOption
{
    var option : string;
    var optarg : Nullable.<string>;
    var error : boolean;

    function constructor (option : string)
    {
        this.option = option;
        this.optarg = null;
        this.error = false;
    }

    function constructor (option : string, optarg : string)
    {
        this.option = option;
        this.optarg = optarg;
        this.error = false;
    }

    function constructor (option : string, optarg : string, error : boolean)
    {
        this.option = option;
        this.optarg = optarg;
        this.error = error;
    }
}


/*
 * The BasicParser is our primary interface to the outside world.  The
 * documentation for this object and its public methods is contained in
 * the included README.md.
 */
class BasicParser
{
    var _argv : string[];
    var _options : Map.<boolean>;
    var _aliases : Map.<string>;
    var _optind : int;
    var _subind : int;
    var _silent : boolean;
    var _extraoptions : boolean;

    function constructor (optstring : string, argv : string[])
    {
        this._argv = argv;
        this._options = {} : Map.<boolean>;
        this._aliases = {} : Map.<string>;
        this._optind = 0;
        this._subind = 0;
        this._extraoptions = false;

        this._parseOptstr(optstring);
    }

    static function _makeError (msg : string) : Error
    {
        return (new Error('getopt: ' + msg));
    }

    /*
     * Parse the option string and update the following fields:
     *
     *  _silent  Whether to log errors to stderr.  Silent mode is
     *          indicated by a leading ':' in the option string.
     *
     *  _options Maps valid single-letter-options to booleans indicating
     *          whether each option is required.
     *
     *  _aliases Maps valid long options to the corresponding
     *          single-letter short option.
     */
    function _parseOptstr (optstr : string) : void
    {
        var i = 0;

        if (optstr.length > 0 && optstr.slice(0, 1) == ':')
        {
            this._silent = true;
            i++;
        }
        else
        {
            this._silent = false;
        }
        while (i < optstr.length)
        {
            var chr = optstr.slice(i, i + 1);
            var arg = false;

            if (!/^[\w\d]$/.test(chr))
            {
                throw new Error('invalid optstring: only alphanumeric ' +
                    'characters may be used as options: ' + chr);
            }

            if (i + 1 < optstr.length && optstr.slice(i + 1, i + 2) == ':')
            {
                arg = true;
                i++;
            }

            this._options[chr] = arg;

            while (i + 1 < optstr.length && optstr.slice(i + 1, i + 2) == '(')
            {
                i++;
                var cp = optstr.indexOf(')', i + 1);
                if (cp == -1)
                {
                    throw new Error('invalid optstring: missing ' +
                        '")" to match "(" at char ' + i as string);
                }
                var alias = optstr.substring(i + 1, cp);
                this._aliases[alias] = chr;
                i = cp;
            }
            i++;
        }
    }

    function optind () : int
    {
        return this._optind;
    }

    /*
     * For documentation on what getopt() does, see README.md.  The following
     * implementation invariants are maintained by getopt() and its helper methods:
     *
     *  this._optind     Refers to the element of _argv that contains
     *              the next argument to be processed.  This may
     *              exceed _argv, in which case the end of input
     *              has been reached.
     *
     *  this._subind     Refers to the character inside
     *              this._options[this._optind] which begins
     *              the next option to be processed.  This may never
     *              exceed the length of _argv[_optind], so
     *              when incrementing this value we must always
     *              check if we should instead increment optind and
     *              reset subind to 0.
     *
     * That is, when any of these functions is entered, the above indices' values
     * are as described above.  getopt() itself and getoptArgument() may both be
     * called at the end of the input, so they check whether optind exceeds
     * argv.length.  getoptShort() and getoptLong() are called only when the indices
     * already point to a valid short or long option, respectively.
     *
     * getopt() processes the next option as follows:
     *
     *  o If _optind > _argv.length, then we already parsed all arguments.
     *
     *  o If _subind == 0, then we're looking at the start of an argument:
     *
     *      o Check for special cases like '-', '--', and non-option arguments.
     *        If present, update the indices and return the appropriate value.
     *
     *      o Check for a long-form option (beginning with '--').  If present,
     *        delegate to getoptLong() and return the result.
     *
     *      o Otherwise, advance subind past the argument's leading '-' and
     *        continue as though _subind != 0 (since that's now the case).
     *
     *  o Delegate to getoptShort() and return the result.
     */
    function getopt () : Nullable.<CommandOption>
    {
        if (this._optind >= this._argv.length)
        {
            /* end of input */
            return null;
        }

        var arg = this._argv[this._optind];
        if (this._extraoptions)
        {
            this._optind++;
            return new CommandOption(arg);
        }

        if (this._subind == 0)
        {
            if (arg == '-' || arg == '')
            {
                return null;
            }

            if (arg.charAt(0) != '-')
            {
                this._extraoptions = true;
                this._optind++;
                return new CommandOption(arg);
            }

            if (arg == '--')
            {
                this._optind++;
                this._subind = 0;
                return null;
            }

            if (arg.slice(1, 2) == '-')
            {
                return this._getoptLong();
            }
            this._subind++;
        }

        return this._getoptShort();
    }

    /*
     * Implements getopt() for the case where optind/subind point to a short option.
     */
    function _getoptShort () : CommandOption
    {
        var arg = this._argv[this._optind];
        var chr = arg.slice(this._subind, this._subind + 1);

        if (++this._subind >= arg.length)
        {
            this._optind++;
            this._subind = 0;
        }

        if (!(chr in this._options))
        {
            return this._errInvalidOption(chr);
        }

        if (!this._options[chr])
        {
            return new CommandOption(chr);
        }
        return this._getoptArgument(chr);
    }

    /*
     * Implements getopt() for the case where optind/subind point to a long option.
     */
    function _getoptLong () : CommandOption
    {
        var arg = this._argv[this._optind];
        var eq = arg.indexOf('=');
        var alias = arg.substring(2, eq == -1 ? arg.length : eq);
        if (!(alias in this._aliases))
        {
            return this._errInvalidOption(alias);
        }

        var chr = this._aliases[alias];
        if (!this._options[chr])
        {
            if (eq != -1)
            {
                return this._errExtraArg(alias);
            }
            this._optind++; /* eat this argument */
            return new CommandOption(chr);
        }

        /*
         * Advance optind/subind for the argument value and retrieve it.
         */
        if (eq == -1)
        {
            this._optind++;
        }
        else
        {
            this._subind = eq + 1;
        }
        return this._getoptArgument(chr);
    }

    /*
     * For the given option letter 'chr' that takes an argument, assumes that
     * optind/subind point to the argument (or denote the end of input) and return
     * the appropriate getopt() return value for this option and argument (or return
     * the appropriate error).
     */
    function _getoptArgument (chr : string) : CommandOption
    {
        if (this._optind >= this._argv.length)
        {
            return this._errMissingArg(chr);
        }

        var arg = this._argv[this._optind].substring(this._subind);
        this._optind++;
        this._subind = 0;
        return new CommandOption(chr, arg);
    }

    function _errMissingArg (chr : string) : CommandOption
    {
        if (this._silent)
        {
            return new CommandOption(':', chr);
        }
        console.error('option requires an argument -- ' + chr + '\n');
        return new CommandOption('?', chr, true);
    }

    function _errInvalidOption (chr : string) : CommandOption
    {
        if (!this._silent)
        {
            console.error('illegal option -- ' + chr + '\n');
        }
        return new CommandOption('?', chr, true);
    }

    /*
     * This error is not specified by POSIX, but neither is the notion of specifying
     * long option arguments using "=" in the same argv-argument, but it's common
     * practice and pretty convenient.
     */
    function _errExtraArg (chr : string) : CommandOption
    {
        if (!this._silent)
        {
            console.error('option expects no argument -- ' +
                chr + '\n');
        }
        return new CommandOption('?', chr, true);
    }
}
