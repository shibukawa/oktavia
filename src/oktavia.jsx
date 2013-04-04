import "metadata.jsx";
import "fm-index.jsx";
import "binary-util.jsx";
import "query.jsx";
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
        this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this._utf162compressCode.length = 65536;
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

    function addWord (words : string, stemming : boolean) : void
    {
        this.addWord(words);
        var wordList = words.split(/\s+/);
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
                if (!stemmedList)
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
        return resultChars.join('');
    }

    function rawSearch (keyword : string, stemming : boolean) : int[]
    {
        var result : int[];
        if (stemming)
        {
            result = [] : int[];
            if (this._stemmer)
            {
                var baseWord = this._stemmer.stemWord(keyword.toLowerCase());
                var stemmedList = this._stemmingResult[baseWord];
                if (stemmedList)
                {
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
        var maxChar = this._compressCode2utf16.length;
        this._fmindex.build(Oktavia.eof, maxChar, cacheRange, verbose);
    }

    function dump () : string
    {
        return this.dump(false);
    }

    function dump (verbose : boolean) : string
    {
        var headerSource = "oktavia-01";
        var header = Binary.dumpString(headerSource).slice(1);
        if (verbose)
        {
            console.log("Source text size: " + (this._fmindex.size() * 2) as string + ' bytes');
        }
        var fmdata = this._fmindex.dump(verbose);
        var result = [
            header,
            fmdata
        ];

        result.push(Binary.dump16bitNumber(this._compressCode2utf16.length));
        for (var i = 3; i < this._compressCode2utf16.length; i++)
        {
            result.push(this._compressCode2utf16[i]);
        }
        if (verbose)
        {
            console.log('Char Code Map: ' + (this._compressCode2utf16.length * 2 - 2) as string + ' bytes');
        }

        var report = new CompressionReport();
        result.push(Binary.dumpStringListMap(this._stemmingResult, report));
        if (verbose)
        {
            console.log('Stemmed Word Table: ' + (result[result.length - 1].length) as string + ' bytes (' + report.rate() as string + '%)');
        }

        result.push(Binary.dump16bitNumber(this._metadataLabels.length));
        for (var i = 0; i < this._metadataLabels.length; i++)
        {
            var report = new CompressionReport();
            var name = this._metadataLabels[i];
            var data = this._metadatas[name]._dump(report);
            result.push(Binary.dumpString(name, report), data);
            if (verbose)
            {
                console.log('Meta Data ' + name + ': ' + (data.length * 2) as string + ' bytes (' + report.rate() as string + '%)');
            }
        }
        return result.join('');
    }

    function load (data : string) : void
    {
        var headerSource = "oktavia-01";
        var header = Binary.dumpString(headerSource).slice(1);
        if (data.slice(0, 5) != header)
        {
            throw new Error('Invalid data file');
        }
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];

        var offset = 5;
        offset = this._fmindex.load(data, offset);
        var charCodeCount = Binary.load16bitNumber(data, offset++);
        this._compressCode2utf16 = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        this._utf162compressCode = [Oktavia.eof, Oktavia.eob, Oktavia.unknown];
        for (var i = 3; i < charCodeCount; i++)
        {
            var charCode = Binary.load16bitNumber(data, offset++);
            this._compressCode2utf16.push(String.fromCharCode(charCode));
            this._utf162compressCode[charCode] = String.fromCharCode(i);
        }

        var stemmedWords = Binary.loadStringListMap(data, offset);
        this._stemmingResult = stemmedWords.result;
        offset = stemmedWords.offset;

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
        var str = [] : string[];
        for (var i = 0; i < result.length; i++)
        {
            str.push(this._compressCode2utf16[result.charCodeAt(i)]);
        }
        return str.join('');
    }
}
