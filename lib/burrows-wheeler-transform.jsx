import "sais.jsx";

class BurrowsWheelerTransform
{
    static var END_MARKER = String.fromCharCode(0);

    var _str : string;
    var _size : int;
    var _head : int;
    var _suffixarray : int[];

    function constructor ()
    {
        this._size = 0;
        this._head = 0;
        this._suffixarray = [] : int[];
    }

    function size () : int
    {
        return this._size;
    }

    function head () : int
    {
        return this._head;
    }

    function clear () : void
    {
        this._str = "";
        this._size = 0;
        this._head = 0;
        this._suffixarray.length = 0;
    }

    function build (str : string) : void
    {
        this._str = str;
        this._size = this._str.length;
        this._suffixarray = SAIS.make(str);
        this._head = this._suffixarray.indexOf(0);
    }

    function get (i : int) : string
    {
        var size = this.size();
        if (i >= size)
        {
            throw new Error("BurrowsWheelerTransform.get() : range error");
        }
        var index = (this._suffixarray[i] + size - 1) % size;
        return this._str.charAt(index);
    }

    function get () : string
    {
        var str = [] : string [];
        var size = this.size();
        for (var i = 0; i < size; i++)
        {
            str.push(this.get(i));
        }
        return str.join("");
    }

    function get (replace : string) : string
    {
        var result = this.get();
        return result.replace(BurrowsWheelerTransform.END_MARKER, replace);
    }
}

