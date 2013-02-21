import "metadata.jsx";
import "fm-index.jsx";
import "binary-util.jsx";
import "stemmer/stemmer.jsx";

class Oktavia
{
    var _fmindex : FMIndex;
    var _metadatas : Map.<Metadata>;
    var _metadataLabels : string[];
    var _stemmer : Nullable.<Stemmer>;
    var _stemmingResult : Map.<string[]>;

    function constructor ()
    {
        this._fmindex = new FMIndex();
        this._metadatas = {} : Map.<Metadata>;
        this._metadataLabels = [] : string[];
        this._stemmer = null;
        this._stemmingResult = {} : Map.<string[]>;
    }

    function setStemmer (stemmer : Stemmer) : void
    {
        this._stemmer = stemmer;
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

    function addWord (words : string) : void
    {
        this._fmindex.push(words);
    }

    function addWord (words : string, stemming : boolean) : void
    {
        this._fmindex.push(words);
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
                    result = result.concat(this._fmindex.search(stemmedList[i]));
                }
            }
            else
            {
                result = this._fmindex.search(keyword);
            }
        }
        else
        {
            result = this._fmindex.search(keyword);
        }
        return result;
    }

    function build () : void
    {
        for (var key in this._metadatas)
        {
            this._metadatas[key]._build();
        }
        this._fmindex.build(String.fromCharCode(1), 4, false);
    }

    function dump () : string
    {
        var header = "oktavia01";
        var result = [
            header,
            this._fmindex.dump(),
            Binary.dump16bitNumber(this._metadataLabels.length)
        ];
        for (var i = 0; i < this._metadataLabels.length; i++)
        {
            var name = this._metadataLabels[i];
            result.push(Binary.dumpString(name), this._metadatas[name]._dump());
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

    function _contentSize () : int
    {
        return this._fmindex.contentSize();
    }

    function _getSubstring (position : int, length : int) : string
    {
        return this._fmindex.getSubstring(position, length);
    }
}
