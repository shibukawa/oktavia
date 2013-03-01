import "metadata.jsx";
import "fm-index.jsx";
import "binary-util.jsx";
import "query-parser.jsx";
import "search-result.jsx";
import "stemmer/stemmer.jsx";
import "console.jsx";


class Oktavia
{
    var _fmindex : FMIndex;
    var _metadatas : Map.<Metadata>;
    var _metadataLabels : string[];
    var _stemmer : Nullable.<Stemmer>;
    var _stemmingResult : Map.<string[]>;

    var sizeOptimize : boolean;

    // char code remap tables
    var _utf162compressCode : string[];
    var _compressCode2utf16 : string[];

    // sentinels
    static const eof = String.fromCharCode(0);
    static const eob = String.fromCharCode(1);
    static const unknown = String.fromCharCode(3);

    function constructor ()
    {
        this._fmindex = new FMIndex();
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];
        this._stemmer = null;
        this._stemmingResult = {} : Map.<string[]>;
        this.sizeOptimize = false;
    }

    function constructor (sizeOptimize : boolean)
    {
        this._fmindex = new FMIndex();
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];
        this._stemmer = null;
        this._stemmingResult = {} : Map.<string[]>;
        this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this._utf162compressCode.length = 65536;
        this._compressCode2utf16 = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this.sizeOptimize = sizeOptimize;
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
        var section = new Section(this);
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
        var splitter = new Splitter(this);
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
        var table = new Table(this, headers);
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
        var block = new Block(this);
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

    function addWord (words : string) : void
    {
        if (this.sizeOptimize)
        {
            var str = [] : string[];
            str.length = words.length;
            for (var i = 0; i < words.length; i++)
            {
                var charCode = words.charCodeAt(i);
                var newCharCode = this._utf162compressCode[charCode];
                if (newCharCode == null)
                {
                    newCharCode = String.fromCharCode(this._compressCode2utf16.length);
                    this._utf162compressCode[charCode] = newCharCode;
                    this._compressCode2utf16.push(String.fromCharCode(charCode));
                }
                str.push(newCharCode);
            }
            this._fmindex.push(str.join(''));
        }
        else
        {
            this._fmindex.push(words);
        }
    }

    function addWord (words : string, stemming : boolean) : void
    {
        this.addWord(words);
        if (stemming && this._stemmer)
        {
            var wordList = words.split(/\s+/);
            for (var i = 0; i < wordList.length; i++)
            {
                var originalWord = wordList[i];
                var headSmall = originalWord.slice(0, 1).toLowerCase() + originalWord.slice(1);
                var baseWord = this._stemmer.stemWord(originalWord.toLowerCase());
                if (originalWord.indexOf(baseWord) == -1 && headSmall.indexOf(baseWord) == -1)
                {
                    var stemmedList = this._stemmingResult[baseWord];
                    if (!stemmedList)
                    {
                        stemmedList = [originalWord];
                        this._stemmingResult[baseWord] = stemmedList;
                    }
                    else if (stemmedList.indexOf(originalWord) == -1)
                    {
                        stemmedList.push(originalWord);
                    }
                }
            }
        }
    }

    function _convertToCompressionCode (keyword : string) : string
    {
        var result = keyword;
        if (this.sizeOptimize)
        {
            var resultChars = [] : string[];
            for (var i = 0; i < keyword.length; i++)
            {
                var chr = this._utf162compressCode[keyword.charCodeAt(i)];
                if (chr == null)
                {
                    resultChars.push(Oktavia.unknown);
                }
                else
                {
                    resultChars.push(chr);
                }
            }
            result = resultChars.join('');
        }
        return result;
    }

    function rawSearch (keyword : string, stemming : boolean) : int[]
    {
        var result : int[];
        if (stemming && this._stemmer)
        {
            result = [] : int[];
            var baseWord = this._stemmer.stemWord(keyword.toLowerCase());
            var stemmedList = this._stemmingResult[baseWord];
            if (stemmedList)
            {
                for (var i = 0; i < stemmedList.length; i++)
                {
                    var word = this._convertToCompressionCode(stemmedList[i]);
                    result = result.concat(this._fmindex.search(word));
                }
            }
            else
            {
                result = this._fmindex.search(this._convertToCompressionCode(keyword));
            }
        }
        else
        {
            result = this._fmindex.search(this._convertToCompressionCode(keyword));
        }
        return result;
    }

    function search (queryWords : string []) : SearchSummary
    {
        var parser = new QueryParser();
        var summary = new SearchSummary(this);
        parser.parse(queryWords);
        for (var i = 0; i < parser.queries.length; i++)
        {
            summary.addQuery(this._searchQuery(parser.queries[i]));
        }
        summary.mergeResult();
        return summary;
    }

    function _searchQuery (query : Query) : SingleResult
    {
        var result = new SingleResult(query.word, query.or, query.not);
        var positions = this.rawSearch(query.word, query.raw);
        //log 'result', result;
        //log 'position', positions;
        this.getPrimaryMetadata().grouping(result, positions, query.word, !query.raw);
        return result;
    }

    function build () : void
    {
        this.build(5, false);
    }

    function build (cacheDensity : int, verbose : boolean) : void
    {
        for (var key in this._metadatas)
        {
            this._metadatas[key]._build();
        }
        var cacheRange = Math.round(Math.max(1, (100 / Math.min(100, Math.max(0.01, cacheDensity)))));
        if (this.sizeOptimize)
        {
            var maxChar = this._compressCode2utf16.length;
            this._fmindex.build(Oktavia.eof, maxChar, cacheRange, verbose);
        }
        else
        {
            this._fmindex.build(Oktavia.eof, cacheRange, verbose);
        }
    }

    function dump () : string
    {
        return this.dump(false, false);
    }

    function dump (verbose : boolean, sizeOptimize : boolean) : string
    {
        var header = "oktavia01";
        if (verbose)
        {
            console.log("Source text size: " + (this._fmindex.size() * 2) as string + ' bytes');
        }
        var fmdata = this._fmindex.dump(sizeOptimize, verbose);
        var result = [
            header,
            fmdata
        ];
        if (this.sizeOptimize)
        {
            result.push(Binary.dump16bitNumber(this._compressCode2utf16.length));
            for (var i = 3; i < this._compressCode2utf16.length; i++)
            {
                result.push(this._compressCode2utf16[i]);
            }
            if (verbose)
            {
                console.log('Char Code Map: ' + (this._compressCode2utf16.length * 2 - 2) as string + ' bytes');
            }
        }
        else
        {
            result.push(Binary.dump16bitNumber(0));
        }

        result.push(Binary.dump16bitNumber(this._metadataLabels.length));
        for (var i = 0; i < this._metadataLabels.length; i++)
        {
            var name = this._metadataLabels[i];
            var data = this._metadatas[name]._dump();
            result.push(Binary.dumpString(name), data);
            if (verbose)
            {
                console.log('Meta Data ' + name + ': ' + (data.length * 2) as string + ' bytes');
            }
        }
        return result.join('');
    }

    function load (data : string) : void
    {
        if (data.slice(0, 9) != "oktavia01")
        {
            throw new Error('Invalid data file');
        }
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];

        var offset = 9;
        offset = this._fmindex.load(data, offset);
        var charCodeCount = Binary.load16bitNumber(data, offset++);
        if (charCodeCount == 0)
        {
            this.sizeOptimize = false;
        }
        else
        {
            this.sizeOptimize = true;
            this._compressCode2utf16 = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
            this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
            for (var i = 3; i < charCodeCount; i++)
            {
                var charCode = Binary.load16bitNumber(data, offset++);
                this._compressCode2utf16.push(String.fromCharCode(charCode));
                this._utf162compressCode[charCode] = String.fromCharCode(i);
            }
        }
        var metadataCount = Binary.load16bitNumber(data, offset++);
        for (var i = 0; i < metadataCount; i++)
        {
            var nameResult = Binary.loadString(data, offset);
            var name = nameResult.result;
            var offset = nameResult.offset;
            var type = Binary.load16bitNumber(data, offset++);
            switch (type)
            {
            case 0:
                offset = Section._load(this, name, data, offset);
                break;
            case 1:
                offset = Splitter._load(this, name, data, offset);
                break;
            case 2:
                offset = Table._load(this, name, data, offset);
                break;
            case 3:
                offset = Block._load(this, name, data, offset);
                break;
            }
        }
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
        if (this.sizeOptimize)
        {
            var str = [] : string[];
            for (var i = 0; i < result.length; i++)
            {
                str.push(this._compressCode2utf16[result.charCodeAt(i)]);
            }
            result = str.join('');
        }
        return result;
    }
}
