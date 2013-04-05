import "bit-vector.jsx";
import "oktavia.jsx";
import "binary-util.jsx";
import "search-result.jsx";


class Metadata
{
    var _parent : Oktavia;
    var _bitVector : BitVector;

    function constructor (parent : Oktavia)
    {
        this._parent = parent;
        this._bitVector = new BitVector();
    }

    function _size () : int
    {
        return this._bitVector.rank(this._bitVector.size());
    }

    function getContent (index : int) : string
    {
        if (index < 0 || this._size() <= index)
        {
            throw new Error("Section.getContent() : range error " + index as string);
        }
        var startPosition = 0;
        if (index > 0)
        {
            startPosition = this._bitVector.select(index - 1) + 1;
        }
        var length = this._bitVector.select(index) - startPosition + 1;
        return this._parent._getSubstring(startPosition, length);
    }

    function getStartPosition (index : int) : int
    {
        if (index < 0 || this._size() <= index)
        {
            throw new Error("Section.getContent() : range error " + index as string);
        }
        var startPosition = 0;
        if (index > 0)
        {
            startPosition = this._bitVector.select(index - 1) + 1;
        }
        return startPosition;
    }

    function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void
    {
    }

    function getInformation(index : int) : string
    {
        return '';
    }

    function _build () : void
    {
        this._bitVector.build();
    }

    function _load (name : string, data : string, offset : int) : int
    {
        offset = this._bitVector.load(data, offset);
        this._parent._metadataLabels.push(name);
        this._parent._metadatas[name] = this;
        return offset;
    }

    function _dump () : string
    {
        return this._bitVector.dump();
    }

    function _dump (report : CompressionReport) : string
    {
        return this._bitVector.dump(report);
    }
}

class Section extends Metadata
{
    var _names : string[];

    function constructor (parent : Oktavia)
    {
        super(parent);
        this._names = [] : string[];
    }

    function setTail (name : string) : void
    {
        this.setTail(name, this._parent.contentSize());
    }

    function setTail (name : string, index : int) : void
    {
        this._names.push(name);
        this._bitVector.set(index - 1);
    }

    function size () : int
    {
        return this._names.length;
    }

    function getSectionIndex (position : int) : int
    {
        if (position < 0 || this._bitVector.size() <= position)
        {
            throw new Error("Section.getSectionIndex() : range error " + position as string);
        }
        return this._bitVector.rank(position);
    }

    function getName (index : int) : string
    {
        if (index < 0 || this.size() <= index)
        {
            throw new Error("Section.getName() : range error");
        }
        return this._names[index];
    }

    override function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void
    {
        for (var i = 0; i < positions.length; i++)
        {
            var position = positions[i];
            var index = this.getSectionIndex(position);
            var unit = result.getSearchUnit(index);
            if (unit.startPosition < 0)
            {
                unit.startPosition = this.getStartPosition(index);
            }
            unit.addPosition(word, position - unit.startPosition, stemmed);
        }
    }

    override function getInformation(index : int) : string
    {
        return this.getName(index);
    }

    static function _load (parent : Oktavia, name : string, data : string, offset : int) : int
    {
        var strs = Binary.loadStringList(data, offset);
        var section = new Section(parent);
        section._names = strs.result;
        return section._load(name, data, strs.offset);
    }

    override function _dump () : string
    {
        return [Binary.dump16bitNumber(0), Binary.dumpStringList(this._names), super._dump()].join('');
    }

    override function _dump (report : CompressionReport) : string
    {
        report.add(1, 1);
        return [Binary.dump16bitNumber(0), Binary.dumpStringList(this._names, report), super._dump(report)].join('');
    }
}

class Splitter extends Metadata
{
    var name : Nullable.<string>;

    function constructor (parent : Oktavia)
    {
        super(parent);
        this.name = null;
    }

    function constructor (parent : Oktavia, name : string)
    {
        super(parent);
        this.name = name;
    }

    function size () : int
    {
        return this._size(); 
    }

    function split () : void
    {
        this.split(this._parent.contentSize());
    }

    function split (index : int) : void
    {
        this._bitVector.set(index - 1);
    }

    function getIndex (position : int) : int
    {
        if (position < 0 || this._bitVector.size() <= position)
        {
            throw new Error("Section.getSectionIndex() : range error");
        }
        return this._bitVector.rank(position);
    }

    override function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void
    {
        for (var i = 0; i < positions.length; i++)
        {
            var position = positions[i];
            var index = this.getIndex(position);
            var unit = result.getSearchUnit(index);
            if (unit.startPosition < 0)
            {
                unit.startPosition = this.getStartPosition(index);
            }
            unit.addPosition(word, position - unit.startPosition, stemmed);
        }
    }

    override function getInformation(index : int) : string
    {
        if (this.name != null)
        {
            return this.name + ((index + 1) as string);
        }
        return '';
    }

    static function _load (parent : Oktavia, name : string, data : string, offset : int) : int
    {
        var section = new Splitter(parent);
        return section._load(name, data, offset);
    }

    override function _dump () : string
    {
        return [Binary.dump16bitNumber(1), super._dump()].join('');
    }

    override function _dump (report : CompressionReport) : string
    {
        report.add(1, 1);
        return [Binary.dump16bitNumber(1), super._dump(report)].join('');
    }
}

class Table extends Metadata
{
    var _headers : string[];
    var _columnTails : BitVector;

    function constructor (parent : Oktavia, headers : string[])
    {
        super(parent);
        this._headers = headers;
        this._columnTails = new BitVector();
    }

    function rowSize () : int
    {
        return this._size();
    }

    function columnSize () : int
    {
        return this._headers.length;
    }

    function setColumnTail () : void
    {
        var index = this._parent.contentSize();
        this._parent.addEndOfBlock();
        this._columnTails.set(index - 1);
    }

    function setRowTail () : void
    {
        var index = this._parent.contentSize();
        this._bitVector.set(index - 1);
    }

    function getCell (position : int) : int[]
    {
        if (position < 0 || this._bitVector.size() <= position)
        {
            throw new Error("Section.getSectionIndex() : range error " + position as string);
        }
        var row = this._bitVector.rank(position);
        var currentColumn = this._columnTails.rank(position);

        var lastRowColumn = 0;
        if (row > 0)
        {
            var startPosition = this._bitVector.select(row - 1) + 1;
            lastRowColumn = this._columnTails.rank(startPosition);
        }
        var result = [row, currentColumn - lastRowColumn] : int[];
        return result;
    }

    function getRowContent (rowIndex : int) : Map.<string>
    {
        var content = this.getContent(rowIndex);
        var values = content.split(Oktavia.eob, this._headers.length);
        var result = {} : Map.<string>;
        for (var i in this._headers)
        {
            if (i < values.length)
            {
                result[this._headers[i]] = values[i];
            }
            else
            {
                result[this._headers[i]] = '';
            }
        }
        return result;
    }

    override function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void
    {
        // TODO implement
    }

    override function getInformation(index : int) : string
    {
        return '';
    }

    override function _build () : void
    {
        this._bitVector.build();
        this._columnTails.build();
    }

    static function _load (parent : Oktavia, name : string, data : string, offset : int) : int
    {
        var strs = Binary.loadStringList(data, offset);
        var table = new Table(parent, strs.result);
        offset = table._load(name, data, strs.offset);
        return table._columnTails.load(data, offset);
    }

    override function _dump () : string
    {
        return [
            Binary.dump16bitNumber(2), Binary.dumpStringList(this._headers),
            super._dump(), this._columnTails.dump()
        ].join('');
    }

    override function _dump (report : CompressionReport) : string
    {
        report.add(1, 1);
        return [
            Binary.dump16bitNumber(2), Binary.dumpStringList(this._headers, report),
            super._dump(report), this._columnTails.dump(report)
        ].join('');
    }
}

class Block extends Metadata
{
    var _names : string[];
    var _start : boolean;

    function constructor (parent : Oktavia)
    {
        super(parent);
        this._names = [] : string[];
        this._start = false;
    }

    function startBlock (blockName : string) : void
    {
        this.startBlock(blockName, this._parent.contentSize());
    }

    function startBlock (blockName : string, index : int) : void
    {
        if (this._start)
        {
            throw new Error('Splitter `' + this._names[this._names.length - 1] + '` is not closed');
        }
        this._start = true;
        this._names.push(blockName);
        this._bitVector.set(index - 1);
    }

    function endBlock () : void
    {
        this.endBlock(this._parent.contentSize());
    }

    function endBlock (index : int) : void
    {
        if (!this._start)
        {
            throw new Error('Splitter is not started');
        }
        this._start = false;
        this._bitVector.set(index - 1);
    }

    function size () : int
    {
        return this._names.length;
    }

    function blockIndex (position : int) : int
    {
        if (position < 0 || (this._parent._fmindex.size() - 1) <= position)
        {
            throw new Error("Block.blockIndex() : range error " + position as string);
        }
        var result : int;
        if (position >= this._bitVector.size())
        {
            position = this._bitVector.size() - 1;
            result = this._bitVector.rank(position) + 1;
        }
        else
        {
            result = this._bitVector.rank(position);
        }
        return result;
    }

    function inBlock (position : int) : boolean
    {
        var blockIndex = this.blockIndex(position);
        return (blockIndex % 2) != 0;
    }

    function getBlockContent (position : int) : string
    {
        var blockIndex = this.blockIndex(position);
        var result : string;
        if ((blockIndex % 2) != 0)
        {
            result = this.getContent(blockIndex);
        }
        else
        {
            result = '';
        }
        return result;
    }

    function getBlockName (position : int) : string
    {
        var blockIndex = this.blockIndex(position);
        var result : string;
        if ((blockIndex % 2) != 0)
        {
            result = this._names[blockIndex >>> 1];
        }
        else
        {
            result = '';
        }
        return result;
    }

    override function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void
    {
        // TODO implement
    }

    override function getInformation(index : int) : string
    {
        return '';
    }

    static function _load (parent : Oktavia, name : string, data : string, offset : int) : int
    {
        var strs = Binary.loadStringList(data, offset);
        var block = new Block(parent);
        block._names = strs.result;
        return block._load(name, data, strs.offset);
    }

    override function _dump () : string
    {
        return [Binary.dump16bitNumber(3), Binary.dumpStringList(this._names), super._dump()].join('');
    }

    override function _dump (report : CompressionReport) : string
    {
        report.add(1, 1);
        return [Binary.dump16bitNumber(3), Binary.dumpStringList(this._names, report), super._dump(report)].join('');
    }
}

