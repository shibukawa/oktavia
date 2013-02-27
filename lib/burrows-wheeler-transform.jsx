class BurrowsWheelerTransform
{
    static var END_MARKER = String.fromCharCode(1);

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
        this._suffixarray.length = 0;
        this._size = this._str.length;
        for (var i = 0; i < this.size(); i++)
        {
            this._suffixarray.push(i);
        }
        this.sort(0, this.size() - 1, 0);
        for (var i = 0; i < this.size(); i++)
        {
            if (this._suffixarray[i] == 0)
            {
                this._head = i;
                break;
            }
        }
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

    function sort (begin : int, end : int, depth : int) : void
    {
        var a = begin;
        var b = begin;
        var c = end;
        var d = end;
        var size = end - begin + 1;
        if (size <= 1)
        {
            return;
        }

        var pivot = this.sa2char(Math.floor(begin + Math.random() * size), depth);

        while (1)
        {
            var b_ch = this.sa2char(b, depth);
            while ((b <= c) && (b_ch <= pivot))
            {
                if (b_ch == pivot)
                {
                    this._swap(a, b);
                    a++;
                }
                b++;
                if (b >= this.size())
                {
                    break;
                }
                b_ch = this.sa2char(b, depth);
            }

            var c_ch = this.sa2char(c, depth);
            while ((b <= c) && (c_ch >= pivot))
            {
                if (c_ch == pivot)
                {
                    this._swap(c, d);
                    d--;
                }
                c--;
                if (c < 0)
                {
                    break;
                }
                c_ch = this.sa2char(c, depth);
            }
            if (b > c)
            {
                break;
            }
            this._swap(b, c);
            b++;
            c--;
        }

        var eq_size = 0;
        eq_size = (((a - begin) < (b - a)) ? (a - begin) : (b - a));
        for (var i = 0; i < eq_size; i++)
        {
            this._swap(begin + i, b - eq_size + i);
        }
        eq_size = (((d - c) < (end - d)) ? (d - c) : (end - d));
        for (var i = 0; i < eq_size; i++)
        {
            this._swap(b + i, end - eq_size + i + 1);
        }

        this.sort(begin,             begin + b - a - 1, depth    );
        this.sort(begin + b - a,     end   - d + c,     depth + 1);
        this.sort(end   - d + c + 1, end,               depth    );
    }

    function sa2char (i : int, depth : int) : string
    {
        var offset = (this._suffixarray[i] + depth) % this.size();
        return this._str.slice(offset, offset + 1);
    }

    function _swap (a : int, b : int) : void
    {
        var value = this._suffixarray[a];
        this._suffixarray[a] = this._suffixarray[b];
        this._suffixarray[b] = value;
    }
}

