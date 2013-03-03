/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "bit-vector.jsx";
import "binary-util.jsx";
import "console.jsx";


class WaveletMatrix
{
    var _bv : BitVector[];
    var _seps : int[];
    var _range : Map.<int>;
    var _bitsize : int;
    var _size : int;

    function constructor ()
    {
        this._range = {} : Map.<int>;
        this._bv = [] : BitVector[];
        this._seps = [] : int[];
        this._bitsize = 16;
        this.clear();
    }

    function bitsize () : int
    {
        return this._bitsize;
    }

    function setMaxCharCode (charCode : int) : void
    {
        this._bitsize = Math.ceil(Math.log(charCode) / Math.LN2);
    }

    function clear () : void
    {
        this._bv.length = 0;
        this._seps.length = 0;
        this._size = 0;
    }

    function build (v : string) : void
    {
        this.clear();
        var size = v.length;
        var bitsize = this.bitsize();
        for (var i = 0; i < bitsize; i++)
        {
            this._bv.push(new BitVector);
            this._seps.push(0);
        }
        this._size = size;
        for (var i = 0; i < size; i++)
        {
            this._bv[0].set(i, this._uint2bit(v.charCodeAt(i), 0));
        }
        this._bv[0].build();
        this._seps[0] = this._bv[0].size(false);
        this._range[0 as string] = 0;
        this._range[1 as string] = this._seps[0];

        var depth : int = 1;
        while (depth < bitsize)
        {
            var range_tmp = WaveletMatrix._shallow_copy(this._range); // copy
            for (var i = 0; i < size; i++)
            {
                var code = v.charCodeAt(i);
                var bit = this._uint2bit(code, depth);
                var key = code >>> (bitsize - depth);
                this._bv[depth].set(range_tmp[key as string], bit);
                range_tmp[key as string]++;
            }
            this._bv[depth].build();
            this._seps[depth] = this._bv[depth].size(false);

            var range_rev = {} : Map.<int>;
            for (var range_key in this._range)
            {
                var value : int = this._range[range_key];
                if (value != range_tmp[range_key])
                {
                    range_rev[value as string] = range_key as int;
                }
            }
            this._range = {} : Map.<int>;
            var pos0 = 0;
            var pos1 = this._seps[depth];
            for (var range_rev_key in range_rev)
            {
                var begin = range_rev_key as int;
                var value = range_rev[range_rev_key];
                var end = range_tmp[value as string];
                var num0  = this._bv[depth].rank(end  , false) -
                            this._bv[depth].rank(begin, false);
                var num1  = end - begin - num0;
                if (num0 > 0)
                {
                    this._range[(value << 1) as string] = pos0;
                    pos0 += num0;
                }
                if (num1 > 0)
                {
                    this._range[((value << 1) + 1) as string] = pos1;
                    pos1 += num1;
                }
            }
            depth++;
        }
    }

    function size () : int
    {
        return this._size;
    }

    function size (c : int) : int
    {
        return this.rank(this.size(), c);
    }

    function get (i : int) : int
    {
        if (i >= this.size())
        {
            throw new Error("WaveletMatrix.get() : range error");
        }
        var value = 0;
        var depth = 0;
        while (depth < this.bitsize())
        {
            var bit = this._bv[depth].get(i);
            i = this._bv[depth].rank(i, bit);
            value <<= 1;
            if (bit)
            {
                i += this._seps[depth];
                value += 1;
            }
            depth++;
        }
        return value;
    }

    function rank (i : int, c : int) : int
    {
        if (i > this.size())
        {
            throw new Error("WaveletMatrix.rank(): range error");
        }
        if (i == 0)
        {
            return 0;
        }

        var begin = this._range[c as string];
        if (begin == null)
        {
            return 0;
        }
        var end   = i;
        var depth = 0;
        while (depth < this.bitsize())
        {
            var bit = this._uint2bit(c, depth);
            end = this._bv[depth].rank(end, bit);
            if (bit)
            {
                end += this._seps[depth];
            }
            depth++;
        }
        return end - begin;
    }

    function rank_less_than (i : int, c : int) : int
    {
        if (i > this.size())
        {
            throw new Error("WaveletMatrix.rank_less_than(): range error");
        }
        if (i == 0)
        {
            return 0;
        }

        var begin = 0;
        var end   = i;
        var depth = 0;
        var rlt   = 0;
        while (depth < this.bitsize())
        {
            var rank0_begin = this._bv[depth].rank(begin, false);
            var rank0_end   = this._bv[depth].rank(end  , false);
            if (this._uint2bit(c, depth))
            {
                rlt += (rank0_end - rank0_begin);
                begin += (this._seps[depth] - rank0_begin);
                end   += (this._seps[depth] - rank0_end);
            }
            else
            {
                begin = rank0_begin;
                end   = rank0_end;
            }
            depth++;
        }
        return rlt;
    }

    function dump () : string
    {
        var contents = [
            Binary.dump16bitNumber(this._bitsize),
            Binary.dump32bitNumber(this._size)
        ];
        for (var i = 0; i < this.bitsize(); i++)
        {
            contents.push(this._bv[i].dump());
        }
        for (var i = 0; i < this.bitsize(); i++)
        {
            contents.push(Binary.dump32bitNumber(this._seps[i]));
        }
        var range_contents = [] : string[];
        var counter = 0;
        for (var key in this._range)
        {
            range_contents.push(Binary.dump32bitNumber(key as int));
            range_contents.push(Binary.dump32bitNumber(this._range[key]));
            counter++;
        }
        contents.push(Binary.dump32bitNumber(counter));
        return contents.join('') + range_contents.join('');
    }

    function dump (report : CompressionReport) : string
    {
        var contents = [
            Binary.dump16bitNumber(this._bitsize),
            Binary.dump32bitNumber(this._size)
        ];
        report.add(3, 3);
        for (var i = 0; i < this.bitsize(); i++)
        {
            contents.push(this._bv[i].dump(report));
        }
        for (var i = 0; i < this.bitsize(); i++)
        {
            contents.push(Binary.dump32bitNumber(this._seps[i]));
            report.add(2, 2);
        }
        var range_contents = [] : string[];
        var counter = 0;
        for (var key in this._range)
        {
            range_contents.push(Binary.dump32bitNumber(key as int));
            range_contents.push(Binary.dump32bitNumber(this._range[key]));
            report.add(4, 4);
            counter++;
        }
        report.add(2, 2);
        contents.push(Binary.dump32bitNumber(counter));
        return contents.join('') + range_contents.join('');
    }

    function load (data : string) : int
    {
        return this.load(data, 0);
    }

    function load (data : string, offset : int) : int
    {
        this.clear();
        this._bitsize = Binary.load16bitNumber(data, offset++);
        this._size = Binary.load32bitNumber(data, offset);
        offset += 2; 
        for (var i = 0; i < this.bitsize(); i++)
        {
            var bit_vector = new BitVector();
            offset = bit_vector.load(data, offset);
            this._bv.push(bit_vector);
        }
        var sep = 0;
        for (var i = 0; i < this.bitsize(); i++, offset += 2)
        {
            this._seps.push(Binary.load32bitNumber(data, offset));
        }

        var range_size = Binary.load32bitNumber(data, offset);
        offset += 2;
        for (var i = 0; i < range_size; i++, offset += 4)
        {
            var key = Binary.load32bitNumber(data, offset);
            var value = Binary.load32bitNumber(data, offset + 2);
            this._range[key as string] = value;
        }
        return offset;
    }

    static function _shallow_copy (input : Map.<int>) : Map.<int>
    {
        var result = {} : Map.<int>;
        for (var key in input)
        {
            result[key] = input[key];
        }
        return result;
    }

    function _uint2bit (c : int, i : int) : boolean
    {
        return ((c >>> (this._bitsize - 1 - i)) & 0x1) == 0x1;
    }
}

