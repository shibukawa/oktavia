/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "binary-util.jsx";

class BitVector
{
    static const SMALL_BLOCK_SIZE : int =  32;
    static const LARGE_BLOCK_SIZE : int = 256;
    static const BLOCK_RATE       : int =   8;

    var _v : number[];
    var _r : number[];
    var _size : int;
    var _size1 : int;

    function constructor ()
    {
        this._r = [] : number[];
        this._v = [] : number[];
        this.clear();
    }

    function build () : void
    {
        this._size1 = 0;
        for (var i = 0; i < this._v.length; i++)
        {
            if (i % BitVector.BLOCK_RATE == 0)
            {
                this._r.push(this.size(true));
            }
            this._size1 += this._rank32(this._v[i], BitVector.SMALL_BLOCK_SIZE, true);
        }
    }

    function clear () : void
    {
        this._v.length = 0;
        this._r.length = 0;
        this._size = 0;
        this._size1 = 0;
    }

    function size () : int
    {
        return this._size;
    }

    function size (b : boolean) : int
    {
        return b ? (this._size1) : (this._size - this._size1);
    }

    function set (value : int) : void
    {
        this.set(value, true);
    }

    function set (value : int, flag : boolean) : void
    {
        if (value >= this.size())
        {
            this._size = value + 1;
        }
        var q : int = value / BitVector.SMALL_BLOCK_SIZE;
        var r : int = value % BitVector.SMALL_BLOCK_SIZE;
        while (q >= this._v.length)
        {
            this._v.push(0);
        }
        var m : int = 0x1 << r;
        if (flag)
        {
            this._v[q] |=  m;
        }
        else
        {
            this._v[q] &= ~m;
        }
    }

    function get (value : int) : boolean
    {
        if (value >= this.size())
        {
            throw new Error("BitVector.get() : range error");
        }
        var q : int = value / BitVector.SMALL_BLOCK_SIZE;
        var r : int = value % BitVector.SMALL_BLOCK_SIZE;
        var m : int = 0x1 << r;
        return (this._v[q] & m) as boolean;
    }

    function rank (i : int) : int
    {
        return this.rank(i, true);
    }

    function rank (i : int, b : boolean) : int
    {
        if (i > this.size())
        {
            throw new Error("BitVector.rank() : range error");
        }
        if (i == 0)
        {
            return 0;
        }
        i--;
        var q_large : int = Math.floor(i / BitVector.LARGE_BLOCK_SIZE);
        var q_small : int = Math.floor(i / BitVector.SMALL_BLOCK_SIZE);
        var r       : int = Math.floor(i % BitVector.SMALL_BLOCK_SIZE);
        var rank : int = this._r[q_large];
        if (!b)
        {
            rank = q_large * BitVector.LARGE_BLOCK_SIZE - rank;
        }
        var begin = q_large * BitVector.BLOCK_RATE;
        for (var j = begin; j < q_small; j++)
        {
            rank += this._rank32(this._v[j], BitVector.SMALL_BLOCK_SIZE, b);
        }
        rank += this._rank32(this._v[q_small], r + 1, b);
        return rank;
    }

    function select(i : int) : int
    {
        return this.select(i, true);
    }

    function select(i : int, b : boolean) : int
    {
        if (i >= this.size(b))
        {
            throw new Error("BitVector.select() : range error");
        }

        var left  = 0;
        var right = this._r.length;
        while (left < right)
        {
            var pivot = Math.floor((left + right) / 2);
            var rank  = this._r[pivot];
            if (!b)
            {
                rank = pivot * BitVector.LARGE_BLOCK_SIZE - rank;
            }
            if (i < rank)
            {
                right = pivot;
            }
            else
            {
                left = pivot + 1;
            }
        }
        right--;

        if (b)
        {
            i -= this._r[right];
        }
        else
        {
            i -= right * BitVector.LARGE_BLOCK_SIZE - this._r[right];
        }
        var j = right * BitVector.BLOCK_RATE;
        while (1)
        {
            var rank = this._rank32(this._v[j], BitVector.SMALL_BLOCK_SIZE, b);
            if (i < rank)
            {
                break;
            }
            j++;
            i -= rank;
        }
        return j * BitVector.SMALL_BLOCK_SIZE + this._select32(this._v[j], i, b);
    }

    function _rank32 (x : int, i : int, b : boolean) : int
    {
        if (!b)
        {
            x = ~x;
        }
        x <<= (BitVector.SMALL_BLOCK_SIZE - i);
        x = ((x & 0xaaaaaaaa) >>>  1)
          +  (x & 0x55555555);
        x = ((x & 0xcccccccc) >>>  2)
          +  (x & 0x33333333);
        x = ((x & 0xf0f0f0f0) >>>  4)
          +  (x & 0x0f0f0f0f);
        x = ((x & 0xff00ff00) >>>  8)
          +  (x & 0x00ff00ff);
        x = ((x & 0xffff0000) >>> 16)
          +  (x & 0x0000ffff);
        return x;
    }

    function _select32(x : int, i : int, b : boolean) : int
    {
        if (!b)
        {
            x = ~x;
        }
        var x1 = ((x  & 0xaaaaaaaa) >>>  1)
               +  (x  & 0x55555555);
        var x2 = ((x1 & 0xcccccccc) >>>  2)
               +  (x1 & 0x33333333);
        var x3 = ((x2 & 0xf0f0f0f0) >>>  4)
               +  (x2 & 0x0f0f0f0f);
        var x4 = ((x3 & 0xff00ff00) >>>  8)
               +  (x3 & 0x00ff00ff);
        var x5 = ((x4 & 0xffff0000) >>> 16)
               +  (x4 & 0x0000ffff);
        i++;
        var pos = 0;
        var v5 = x5 & 0xffffffff;
        if (i > v5)
        {
            i -= v5;
            pos += 32;
        }
        var v4 = (x4 >>> pos) & 0x0000ffff;
        if (i > v4)
        {
            i -= v4;
            pos += 16;
        }
        var v3 = (x3 >>> pos) & 0x000000ff;
        if (i > v3)
        {
            i -= v3;
            pos += 8;
        }
        var v2 = (x2 >>> pos) & 0x0000000f;
        if (i > v2)
        {
            i -= v2;
            pos += 4;
        }
        var v1 = (x1 >>> pos) & 0x00000003;
        if (i > v1)
        {
            i -= v1;
            pos += 2;
        }
        var v0 = (x >>> pos) & 0x00000001;
        if (i > v0)
        {
            i -= v0;
            pos += 1;
        }
        return pos;
    }

    function dump () : string
    {
        var contents = [] : string[];
        contents.push(Binary.dump32bitNumber(this._size));
        contents.push(Binary.dump32bitNumberList(this._v));
        return contents.join('');
    }

    function dump (report : CompressionReport) : string
    {
        var contents = [] : string[];
        contents.push(Binary.dump32bitNumber(this._size));
        report.add(2, 2);
        contents.push(Binary.dump32bitNumberList(this._v, report));
        return contents.join('');
    }

    function load (data : string) : int
    {
        return this.load(data, 0);
    }

    function load (data : string, offset : int) : int
    {
        this.clear();
        this._size = Binary.load32bitNumber(data, offset);
        var result = Binary.load32bitNumberList(data, offset + 2);
        this._v = result.result;
        this.build();
        return result.offset;
    }
}
