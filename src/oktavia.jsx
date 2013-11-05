import "console.jsx";
import "fm-index.jsx";
import "binary-io.jsx";
import "query.jsx";
import "stemmer.jsx";
import "./search-result.jsx";
import "./metadata.jsx";


class Oktavia
{
    var _fmindex : FMIndex;
    var _metadatas : Map.<Metadata>;
    var _metadataLabels : string[];
    var _stemmer : Nullable.<Stemmer>;
    var _stemmingResult : Map.<string[]>;
    var _build : boolean;

    // char code remap tables
    var _utf162compressCode : string[];
    var _compressCode2utf16 : string[];

    // sentinels
    static const eof = String.fromCharCode(0);
    static const eob = String.fromCharCode(1);
    static const unknown = String.fromCharCode(2);

    // Enum
    static const USE_STEMMING = true;

    function constructor ()
    {
        this._fmindex = new FMIndex();
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];
        this._stemmer = null;
        this._stemmingResult = {} : Map.<string[]>;
        this._build = false;
        this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this._compressCode2utf16 = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
    }

    function setStemmer (stemmer : Stemmer) : void
    {
        this._stemmer = stemmer;
    }

    function getPrimaryMetadata () : Metadata
    {
        return this._metadatas[this._metadataLabels[0]];
    }

    function addSection (key : string) : Section
    {
        if (this._metadataLabels.indexOf(key) != -1)
        {
            throw new Error('Metadata name ' + key + ' is already exists');
        }
        this._metadataLabels.push(key);
        var section = new Section(this, key);
        this._metadatas[key] = section;
        return section;
    }

    function getSection (key : string) : Section
    {
        if (this._metadataLabels.indexOf(key) == -1)
        {
            throw new Error('Metadata name ' + key + " does't exists");
        }
        return this._metadatas[key] as Section;
    }

    function addSplitter (key : string) : Splitter
    {
        if (this._metadataLabels.indexOf(key) != -1)
        {
            throw new Error('Metadata name ' + key + ' is already exists');
        }
        this._metadataLabels.push(key);
        var splitter = new Splitter(this, key);
        this._metadatas[key] = splitter;
        return splitter;
    }

    function getSplitter (key : string) : Splitter
    {
        if (this._metadataLabels.indexOf(key) == -1)
        {
            throw new Error('Metadata name ' + key + " does't exists");
        }
        return this._metadatas[key] as Splitter;
    }

    function addTable (key : string, headers : string[]) : Table
    {
        if (this._metadataLabels.indexOf(key) != -1)
        {
            throw new Error('Metadata name ' + key + ' is already exists');
        }
        this._metadataLabels.push(key);
        var table = new Table(this, key, headers);
        this._metadatas[key] = table;
        return table;
    }

    function getTable (key : string) : Table
    {
        if (this._metadataLabels.indexOf(key) == -1)
        {
            throw new Error('Metadata name ' + key + " does't exists");
        }
        return this._metadatas[key] as Table;
    }

    function addBlock (key : string) : Block
    {
        if (this._metadataLabels.indexOf(key) != -1)
        {
            throw new Error('Metadata name ' + key + ' is already exists');
        }
        this._metadataLabels.push(key);
        var block = new Block(this, key);
        this._metadatas[key] = block;
        return block;
    }

    function getBlock (key : string) : Block
    {
        if (this._metadataLabels.indexOf(key) == -1)
        {
            throw new Error('Metadata name ' + key + " does't exists");
        }
        return this._metadatas[key] as Block;
    }

    function addEndOfBlock () : void
    {
        this._fmindex.push(Oktavia.eob);
    }

    function addWord (word : string) : void
    {
        var str = '';
        for (var i = 0; i < word.length; i++)
        {
            var charCode = word.charCodeAt(i);
            var convertedChar = this._utf162compressCode[charCode];
            if (convertedChar == null)
            {
                convertedChar = String.fromCharCode(this._compressCode2utf16.length);
                this._utf162compressCode[charCode] = convertedChar;
                this._compressCode2utf16.push(String.fromCharCode(charCode));
            }
            str += convertedChar;
        }
        this._fmindex.push(str);
    }

    function addWord (word : string, stemming : boolean) : void
    {
        this.addWord(word);
        var wordList = word.split(/\s+/);
        for (var i = 0; i < wordList.length; i++)
        {
            var originalWord = wordList[i];
            var smallWord = originalWord.slice(0, 1).toLowerCase() + originalWord.slice(1);
            var registerWord : Nullable.<string> = null;
            if (stemming && this._stemmer)
            {
                var baseWord = this._stemmer.stemWord(originalWord.toLowerCase());
                if (originalWord.indexOf(baseWord) == -1)
                {
                    registerWord = baseWord;
                }
            }
            else if (originalWord != smallWord)
            {
                registerWord = smallWord;
            }
            if (registerWord)
            {
                var compressedCodeWord = this._convertToCompressionCode(originalWord);
                var stemmedList = this._stemmingResult[registerWord];
                if (!this._stemmingResult.hasOwnProperty(registerWord))
                {
                    stemmedList = [compressedCodeWord];
                    this._stemmingResult[registerWord] = stemmedList;
                }
                else if (stemmedList.indexOf(compressedCodeWord) == -1)
                {
                    stemmedList.push(compressedCodeWord);
                }
            }
        }
    }

    function _convertToCompressionCode (keyword : string) : string
    {
        var resultChars = '';
        for (var i = 0; i < keyword.length; i++)
        {
            var chr = this._utf162compressCode[keyword.charCodeAt(i)];
            if (chr == null)
            {
                resultChars += Oktavia.unknown;
            }
            else
            {
                resultChars += chr;
            }
        }
        return resultChars;
    }

    function rawSearch (keyword : string, stemming : boolean) : int[]
    {
        if (!this._build)
        {
            throw new Error("Oktavia.build() is not called yet");
        }
        var result : int[];
        if (stemming)
        {
            result = [] : int[];
            if (this._stemmer)
            {
                var baseWord = this._stemmer.stemWord(keyword.toLowerCase());
                if (this._stemmingResult.hasOwnProperty(baseWord))
                {
                    var stemmedList = this._stemmingResult[baseWord];
                    for (var i = 0; i < stemmedList.length; i++)
                    {
                        var word = stemmedList[i];
                        result = result.concat(this._fmindex.search(word));
                    }
                }
            }
        }
        else
        {
            result = this._fmindex.search(this._convertToCompressionCode(keyword));
        }
        return result;
    }

    function search (queries : Query[]) : SearchSummary
    {
        if (!this._build)
        {
            throw new Error("Oktavia.build() is not called yet");
        }
        var summary = new SearchSummary(this);
        for (var i = 0; i < queries.length; i++)
        {
            summary.addQuery(this._searchQuery(queries[i]));
        }
        summary.mergeResult();
        return summary;
    }

    function _searchQuery (query : Query) : SingleResult
    {
        var result = new SingleResult(query.word, query.or, query.not);
        var positions : int[];
        if (query.raw)
        {
            positions = this.rawSearch(query.word, false);
        }
        else
        {
            positions = this.rawSearch(query.word, false).concat(this.rawSearch(query.word, true));
        }
        this.getPrimaryMetadata().grouping(result, positions, query.word, !query.raw);
        return result;
    }

    __noexport__ function build () : void
    {
        this.build(5);
    }

    function build (cacheDensity : Nullable.<int>) : void
    {
        if (this._build)
        {
            throw new Error("Oktavia.build() is already called");
        }
        if (cacheDensity == null)
        {
            cacheDensity = 5;
        }
        for (var key in this._metadatas)
        {
            this._metadatas[key]._build();
        }
        var maxCharCode = this._compressCode2utf16.length;
        var cacheRange = Math.round(Math.max(1, (100 / Math.min(100, Math.max(0.01, cacheDensity)))));
        this._fmindex.build(cacheRange, maxCharCode);
        this._build = true;
    }

    __noexport__ function dump () : string
    {
        return this.dump(false);
    }

    function dump (verbose : boolean) : string
    {
        if (!this._build)
        {
            throw new Error("Oktavia.build() is not called yet");
        }
        var output = new BinaryOutput();
        var headerSource = "oktavia-02";
        output.dumpRawString(BinaryOutput.convertString(headerSource).slice(1));
        if (verbose)
        {
            console.log("Source text size: " + (this._fmindex.size() * 2) as string + ' bytes');
        }
        this._fmindex.dump(output);
        output.dumpString(this._compressCode2utf16.slice(3).join(''));
        if (verbose)
        {
            console.log('Char Code Map: ' + (this._compressCode2utf16.length * 2 - 2) as string + ' bytes');
        }
        var size = output._output.length;
        output.dumpStringListMap(this._stemmingResult);
        if (verbose)
        {
            console.log('Stemmed Word Table: ' + ((output._output.length - size) * 2) as string + ' bytes');
        }

        output.dump16bitNumber(this._metadataLabels.length);
        for (var i = 0; i < this._metadataLabels.length; i++)
        {
            var size = output._output.length;
            var name = this._metadataLabels[i];
            this._metadatas[name]._dump(output);
            if (verbose)
            {
                console.log('Meta Data ' + name + ': ' + ((output._output.length - size) * 2) as string + ' bytes');
            }
        }
        return output.result();
    }

    function load (data : string) : void
    {
        var headerSource = "oktavia-02";
        var header = BinaryOutput.convertString(headerSource).slice(1);
        if (data.slice(0, 5) != header)
        {
            throw new Error('Invalid data file');
        }
        var input = new BinaryInput(data, 5);
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];

        this._fmindex.load(input);
        var charCodes = input.loadString();
        this._compressCode2utf16 = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];

        for (var i = 0; i < charCodes.length; i++)
        {
            var charCode = charCodes.charCodeAt(i);
            this._compressCode2utf16.push(charCodes.charAt(i));
            this._utf162compressCode[charCode] = String.fromCharCode(i + 3);
        }

        this._stemmingResult = input.loadStringListMap();

        var metadataCount = input.load16bitNumber();
        for (var i = 0; i < metadataCount; i++)
        {
            var type = input.load16bitNumber();
            switch (type)
            {
            case Section.TypeID:
                Section._load(this, input);
                break;
            case Splitter.TypeID:
                Splitter._load(this, input);
                break;
            case Table.TypeID:
                Table._load(this, input);
                break;
            case Block.TypeID:
                Block._load(this, input);
                break;
            default:
                throw new Error("Metadata TypeError:" + type as string);
            }
        }
        this._build = true;
    }

    function contentSize () : int
    {
        return this._fmindex.contentSize();
    }

    function wordPositionType (position : int) : int
    {
        var result = 0;
        if (position == 0)
        {
            result = 4;
        }
        else
        {
            var ahead = this._fmindex.getSubstring(position - 1, 1);
            if (/\s/.test(ahead))
            {
                result = 2;
            }
            else if (/\W/.test(ahead))
            {
                result = 1;
            }
            else if (Oktavia.eob == ahead)
            {
                result = 3;
            }
        }
        return result;
    }

    function _getSubstring (position : int, length : int) : string
    {
        var result = this._fmindex.getSubstring(position, length);
        var str = '';
        for (var i = 0; i < result.length; i++)
        {
            var code = result.charCodeAt(i);
            if (code > 2)
            {
                str += this._compressCode2utf16[code];
            }
        }
        return str;
    }

    function _getSubstringWithEOB (position : int, length : int) : string
    {
        var result = this._fmindex.getSubstring(position, length);
        var str = '';
        for (var i = 0; i < result.length; i++)
        {
            var code = result.charCodeAt(i);
            if (code > 2)
            {
                str += this._compressCode2utf16[code];
            }
            else if (code == 1)
            {
                str += result.charAt(i);
            }
        }
        return str;
    }
}
