/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "wavelet-matrix.jsx";
import "bit-vector.jsx";
import "burrows-wheeler-transform.jsx";
import "binary-util.jsx";
import "console.jsx";


class FMIndex
{
    var _substr : string;
    var _ddic : int;
    var _ssize : int;
    var _head : int;
    var _sv : WaveletMatrix;
    var _posdic : int[];
    var _idic : int[];
    var _rlt : int[];

    function constructor ()
    {
        this._ddic = 0,
        this._head = 0;
        this._substr = "";
        this._sv = new WaveletMatrix();
        this._posdic = [] : int[];
        this._idic = [] : int[];
        this._rlt = [] : int[];
        this._rlt.length = 65536;
    }

    function clear () : void
    {
        this._sv.clear();
        this._posdic.length = 0;
        this._idic.length = 0;
        this._ddic = 0;
        this._head = 0;
        this._substr = "";
    }

    function size () : int
    {
        return this._sv.size();
    }

    function contentSize () : int
    {
        return this._substr.length;
    }

    function getRows (key : string) : int
    {
        var pos = [] : int[];
        return this.getRows(key, pos);
    }
    function getRows (key : string, pos : int[]) : int
    {
        var i = key.length - 1;
        var code = key.charCodeAt(i);
        var first = this._rlt[code] + 1;
        var last  = this._rlt[code + 1];
        while (first <= last)
        {
            if (i == 0)
            {
                pos[0] = --first;
                pos[1] = --last;
                return (last - first  + 1);
            }
            i--;
            var c = key.charCodeAt(i);
            first = this._rlt[c] + this._sv.rank(first - 1, c) + 1;
            last  = this._rlt[c] + this._sv.rank(last,      c);
        }
        return 0;
    }

    function getPosition (i : int) : int
    {
        if (i >= this.size())
        {
            throw new Error("FMIndex.getPosition() : range error");
        }
        var pos = 0;
        while (i != this._head)
        {
            if ((i % this._ddic) == 0)
            {
                pos += (this._posdic[i / this._ddic] + 1);
                break;
            }
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            pos++;
        }
        return pos % this.size();
    }

    function getSubstring (pos : int, len : int) : string
    {
        if (pos >= this.size())
        {
            throw new Error("FMIndex.getSubstring() : range error");
        }
        var pos_end  = Math.min(pos + len, this.size());
        var pos_tmp  = this.size() - 1;
        var i        = this._head;
        var pos_idic = Math.floor((pos_end + this._ddic - 2) / this._ddic);
        if (pos_idic < this._idic.length)
        {
            pos_tmp = pos_idic * this._ddic;
            i       = this._idic[pos_idic];
        }

        var substr = "";
        while (pos_tmp >= pos)
        {
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            if (pos_tmp < pos_end)
            {
                substr = String.fromCharCode(c) + substr;
            }
            if (pos_tmp == 0)
            {
                break;
            }
            pos_tmp--;
        }
        return substr;
    }

    function build () : void
    {
        this.build(String.fromCharCode(0), 65535, 20, false);
    }

    function build(end_marker : string, ddic : int, verbose : boolean) : void
    {
        this.build(end_marker, 65535, ddic, verbose);
    }

    function build(end_marker : string, maxChar : int, ddic : int, verbose : boolean) : void
    {
        if (verbose)
        {
            console.time("building burrows-wheeler transform");
        }
        this._substr += end_marker;
        var b = new BurrowsWheelerTransform();
        b.build(this._substr);
        var s = b.get();
        this._ssize = s.length;
        this._head = b.head();
        b.clear();
        this._substr = "";
        if (verbose)
        {
            console.timeEnd("building burrows-wheeler transform");
        }
        if (verbose)
        {
            console.time("building wavelet matrix");
        }
        this._sv.setMaxCharCode(maxChar);
        if (verbose)
        {
            console.log("  maxCharCode: ", maxChar);
            console.log("  bitSize: ", this._sv.bitsize());
        }
        this._sv.build(s);
        if (verbose)
        {
            console.timeEnd("building wavelet matrix");
        }

        if (verbose)
        {
            console.time("caching rank less than");
        }
        for (var c = 0; c < maxChar; c++)
        {
            this._rlt[c] = this._sv.rank_less_than(this._sv.size(), c);
        }
        if (verbose)
        {
            console.timeEnd("caching rank less than");
        }
        this._ddic = ddic;
        if (verbose)
        {
            console.time("building dictionaries");
        }
        this._buildDictionaries();
        if (verbose)
        {
            console.timeEnd("building dictionaries");
            console.log('');
        }
    }

    function _buildDictionaries () : void
    {
        for (var i = 0; i < (this._ssize / this._ddic + 1); i++)
        {
            this._posdic.push(0);
            this._idic.push(0);
        }
        var i = this._head;
        var pos = this.size() - 1;
        do {
            if ((i % this._ddic) == 0)
            {
                this._posdic[Math.floor(i / this._ddic)] = pos;
            }
            if ((pos % this._ddic) == 0)
            {
                this._idic[Math.floor(pos / this._ddic)] = i;
            }
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            pos--;
        } while (i != this._head);
    }

    function push (doc : string) : void
    {
        if (doc.length <= 0)
        {
            throw new Error("FMIndex::push(): empty string");
        }
        this._substr += doc;
    }

    function search (keyword : string) : int[]
    {
        var result_map = {} : Map.<int>;
        var result = [] : int[];
        var position = [] : int[];
        var rows = this.getRows(keyword, position);
        if (rows > 0)
        {
            var first = position[0];
            var last = position[1];
            for (var i = first; i <= last; i++)
            {
                result.push(this.getPosition(i));
            }
        }
        return result;
    }

    function dump () : string
    {
        return this.dump(false);
    }

    function dump (verbose : boolean) : string
    {
        var contents = [] : string[];
        var report = new CompressionReport();
        contents.push(Binary.dump32bitNumber(this._ddic));
        contents.push(Binary.dump32bitNumber(this._ssize));
        contents.push(Binary.dump32bitNumber(this._head));
        report.add(6, 6);
        contents.push(this._sv.dump(report));
        if (verbose)
        {
            console.log("Serializing FM-index");
            console.log('    Wavelet Matrix: ' + (contents[3].length * 2) as string + ' bytes (' + report.rate() as string + '%)');
        }
        contents.push(Binary.dump32bitNumber(this._posdic.length));
        for (var i in this._posdic)
        {
            contents.push(Binary.dump32bitNumber(this._posdic[i]));
        }
        for (var i in this._idic)
        {
            contents.push(Binary.dump32bitNumber(this._idic[i]));
        }
        if (verbose)
        {
            console.log('    Dictionary Cache: ' + (this._idic.length * 16) as string + ' bytes');
        }
        return contents.join("");
    }

    function load (data : string) : int
    {
        return this.load(data, 0);
    }

    function load (data : string, offset : int) : int
    {
        this._ddic = Binary.load32bitNumber(data, offset);
        this._ssize = Binary.load32bitNumber(data, offset + 2);
        this._head = Binary.load32bitNumber(data, offset + 4);
        offset = this._sv.load(data, offset + 6);
        var maxChar = Math.pow(2, this._sv.bitsize());
        for (var c = 0; c < maxChar; c++)
        {
            this._rlt[c] = this._sv.rank_less_than(this._sv.size(), c);
        }
        var size = Binary.load32bitNumber(data, offset);
        offset += 2;
        for (var i = 0; i < size; i++, offset += 2)
        {
            this._posdic.push(Binary.load32bitNumber(data, offset));
        }
        for (var i = 0; i < size; i++, offset += 2)
        {
            this._idic.push(Binary.load32bitNumber(data, offset));
        }
        return offset;
    }
}
