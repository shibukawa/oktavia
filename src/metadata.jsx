import "bit-vector.jsx";
import "binary-io.jsx";
import "./oktavia.jsx";
import "./search-result.jsx";
import "console.jsx";

__export__ abstract class Metadata
{
    var _parent : Oktavia;
    var _bitVector : BitVector;
    var _name : string;

    __noexport__ function constructor (parent : Oktavia, name : string)
    {
        this._parent = parent;
        this._bitVector = new ArrayBitVector();
        this._name = name;
    }

    function _size () : int
    {
        return this._bitVector.rank1(this._bitVector.size());
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
            startPosition = this._bitVector.select1(index - 1) + 1;
        }
        var length = this._bitVector.select1(index) - startPosition + 1;
        return this._parent._getSubstring(startPosition, length);
    }

    function getContentWithEOB (index : int) : string
    {
        if (index < 0 || this._size() <= index)
        {
            throw new Error("Section.getContent() : range error " + index as string);
        }
        var startPosition = 0;
        if (index > 0)
        {
            startPosition = this._bitVector.select1(index - 1) + 1;
        }
        var length = this._bitVector.select1(index) - startPosition + 1;
        return this._parent._getSubstringWithEOB(startPosition, length);
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
            startPosition = this._bitVector.select1(index - 1) + 1;
        }
        return startPosition;
    }

    __noexport__ abstract function grouping (result : SingleResult, positions : int [], word : string, stemmed : boolean) : void;

    __noexport__ abstract function getInformation(index : int) : string;

    function _build () : void
    {
        this._bitVector.build();
    }

    function _load (input : BinaryInput) : void
    {
        this._bitVector.load(input);
        this._parent._metadataLabels.push(this._name);
        this._parent._metadatas[this._name] = this;
    }

    function _dump (output : BinaryOutput) : void
    {
        output.dumpString(this._name);
        this._bitVector.dump(output);
    }
}

__export__ class Section extends Metadata
{
    static const TypeID : int = 0;

    var _names : string[];

    function constructor (parent : Oktavia, name : string)
    {
        super(parent, name);
        this._names = [] : string[];
    }

    __noexport__ function setTail (name : string) : void
    {
        this.setTail(name, null);
    }

    function setTail (name : string, index : Nullable.<int>) : void
    {
        if (index == null)
        {
            index = this._parent.contentSize() - 1;
        }
        if (this._parent._isLastEob)
        {
            throw new Error("Tail should not be 'eof' or 'eob'");
        }
        this._names.push(name);
        this._bitVector.set1(index);
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
        return this._bitVector.rank1(position);
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

    static function _load (parent : Oktavia, input : BinaryInput) : void
    {
        var name = input.loadString();
        var section = new Section(parent, name);
        section._load(input);
        section._names = input.loadStringList();
    }

    override function _dump (output : BinaryOutput) : void
    {
        output.dump16bitNumber(Section.TypeID);
        super._dump(output);
        output.dumpStringList(this._names);
    }
}

__export__ class Splitter extends Metadata
{
    static const TypeID : int = 1;

    function constructor (parent : Oktavia, name : string)
    {
        super(parent, name);
    }

    function size () : int
    {
        return this._size();
    }

    __noexport__ function split () : void
    {
        this.split(null);
    }

    function split (index : Nullable.<int>) : void
    {
        if (index == null)
        {
            index = this._parent.contentSize() - 1;
        }
        if (this._parent._isLastEob)
        {
            throw new Error("Tail should not be 'eof' or 'eob'");
        }
        this._bitVector.set1(index);
    }

    function getIndex (position : int) : int
    {
        if (position < 0 || this._bitVector.size() <= position)
        {
            throw new Error("Section.getSectionIndex() : range error");
        }
        return this._bitVector.rank1(position);
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
        return this._name + ((index + 1) as string);
    }

    static function _load (parent : Oktavia, input : BinaryInput) :void
    {
        var name = input.loadString();
        var section = new Splitter(parent, name);
        section._load(input);
    }

    override function _dump (output : BinaryOutput) : void
    {
        output.dump16bitNumber(Splitter.TypeID);
        super._dump(output);
    }
}

__export__ class Table extends Metadata
{
    static const TypeID : int = 2;

    var _headers : string[];
    var _columnTails : BitVector;

    function constructor (parent : Oktavia, name : string, headers : string[])
    {
        super(parent, name);
        this._headers = headers;
        this._columnTails = new ArrayBitVector();
    }

    __noexport__ function constructor (parent : Oktavia, name : string)
    {
        super(parent, name);
        this._columnTails = new ArrayBitVector();
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
        if (this._parent._isLastEob)
        {
            throw new Error("Tail should not be 'eof' or 'eob'");
        }
        this._columnTails.set1(index);
    }

    function setColumnTailAndEOB () : void
    {
        this.setColumnTail();
        this._parent.addEndOfBlock();
    }

    function setRowTail () : void
    {
        var index = this._parent.contentSize() - 1;
        this._bitVector.set1(index);
    }

    function getCell (position : int) : int[]
    {
        if (position < 0 || this._bitVector.size() <= position)
        {
            throw new Error("Section.getSectionIndex() : range error " + position as string);
        }
        var row = this._bitVector.rank1(position);
        var currentColumn = this._columnTails.rank1(position);

        var lastRowColumn = 0;
        if (row > 0)
        {
            var startPosition = this._bitVector.select1(row - 1) + 1;
            lastRowColumn = this._columnTails.rank1(startPosition);
        }
        var result = [row, currentColumn - lastRowColumn] : int[];
        return result;
    }

    function getRowContent (rowIndex : int) : Map.<string>
    {
        var content = this.getContentWithEOB(rowIndex);
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

    static function _load (parent : Oktavia, input : BinaryInput) :void
    {
        var name = input.loadString();
        var table = new Table(parent, name);
        table._load(input);
        table._headers = input.loadStringList();
        table._columnTails.load(input);
    }

    override function _dump (output : BinaryOutput) : void
    {
        output.dump16bitNumber(Table.TypeID);
        super._dump(output);
        output.dumpStringList(this._headers);
        this._columnTails.dump(output);
    }
}

__export__ class Block extends Metadata
{
    static const TypeID : int = 3;

    var _names : string[];
    var _start : boolean;

    function constructor (parent : Oktavia, name : string)
    {
        super(parent, name);
        this._names = [] : string[];
        this._start = false;
    }

    __noexport__ function startBlock (blockName : string) : void
    {
        this.startBlock(blockName, null);
    }

    function startBlock (blockName : string, index : Nullable.<int>) : void
    {
        if (index == null)
        {
            index = this._parent.contentSize() - 1;
        }
        if (this._start)
        {
            throw new Error('Splitter `' + this._names[this._names.length - 1] + '` is not closed');
        }
        this._start = true;
        this._names.push(blockName);
        this._bitVector.set1(index);
    }

    __noexport__ function endBlock () : void
    {
        this.endBlock(null);
    }

    function endBlock (index : Nullable.<int>) : void
    {
        if (index == null)
        {
            index = this._parent.contentSize() - 1;
        }
        if (this._parent._isLastEob)
        {
            throw new Error("Block end should not be 'eof' or 'eob'");
        }
        if (!this._start)
        {
            throw new Error('Splitter is not started');
        }
        this._start = false;
        this._bitVector.set1(index);
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
        if (position >= this._bitVector.size())
        {
            position = this._bitVector.size() - 1;
            var result = this._bitVector.rank1(position) + 1;
        }
        else
        {
            var result = this._bitVector.rank1(position);
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

    static function _load (parent : Oktavia, input : BinaryInput) :void
    {
        var name = input.loadString();
        var block = new Block(parent, name);
        block._load(input);
        block._names = input.loadStringList();
    }

    override function _dump (output : BinaryOutput) : void
    {
        output.dump16bitNumber(Block.TypeID);
        super._dump(output);
        output.dumpStringList(this._names);
    }
}

