/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "wavelet-matrix.jsx";
import "bit-vector.jsx";
import "burrows-wheeler-transform.jsx";
import "binary-util.jsx";
import "console.jsx";


class FMIndex
{
    var _substr : string;
    var _ddic : int;
    var _head : int;
    var _sv : WaveletMatrix;
    var _posdic : int[];
    var _idic : int[];
    var _rlt : int[];

    function constructor ()
    {
        this._ddic = 0,
        this._head = 0;
        this._substr = "";
        this._sv = new WaveletMatrix();
        this._posdic = [] : int[];
        this._idic = [] : int[];
        this._rlt = [] : int[];
        this._rlt.length = 65536;
    }

    function clear () : void
    {
        this._sv.clear();
        this._posdic.length = 0;
        this._idic.length = 0;
        this._ddic = 0;
        this._head = 0;
        this._substr = "";
    }

    function size () : int
    {
        return this._sv.size();
    }

    function contentSize () : int
    {
        return this._substr.length;
    }

    function getRows (key : string) : int
    {
        var pos = [] : int[];
        return this.getRows(key, pos);
    }
    function getRows (key : string, pos : int[]) : int
    {
        var i = key.length - 1;
        var code = key.charCodeAt(i);
        var first = this._rlt[code] + 1;
        var last  = this._rlt[code + 1];
        while (first <= last)
        {
            if (i == 0)
            {
                pos[0] = --first;
                pos[1] = --last;
                return (last - first  + 1);
            }
            i--;
            var c = key.charCodeAt(i);
            first = this._rlt[c] + this._sv.rank(first - 1, c) + 1;
            last  = this._rlt[c] + this._sv.rank(last,      c);
        }
        return 0;
    }

    function getPosition (i : int) : int
    {
        if (i >= this.size())
        {
            throw new Error("FMIndex.getPosition() : range error");
        }
        var pos = 0;
        while (i != this._head)
        {
            if ((i % this._ddic) == 0)
            {
                pos += (this._posdic[i / this._ddic] + 1);
                break;
            }
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            pos++;
        }
        return pos % this.size();
    }

    function getSubstring (pos : int, len : int) : string
    {
        if (pos >= this.size())
        {
            throw new Error("FMIndex.getSubstring() : range error");
        }
        var pos_end  = Math.min(pos + len, this.size());
        var pos_tmp  = this.size() - 1;
        var i        = this._head;
        var pos_idic = Math.floor((pos_end + this._ddic - 2) / this._ddic);
        if (pos_idic < this._idic.length)
        {
            pos_tmp = pos_idic * this._ddic;
            i       = this._idic[pos_idic];
        }

        var substr = "";
        while (pos_tmp >= pos)
        {
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            if (pos_tmp < pos_end)
            {
                substr = String.fromCharCode(c) + substr;
            }
            if (pos_tmp == 0)
            {
                break;
            }
            pos_tmp--;
        }
        return substr;
    }

    function build () : void
    {
        this.build(String.fromCharCode(1), 64, false);
    }

    function build (end_marker : string, num : int) : void
    {
        this.build(end_marker, num, false);
    }

    function build(end_marker : string, ddic : int, is_msg : boolean) : void
    {
        if (is_msg)
        {
            console.time("building burrows-wheeler transform.");
        }
        this._substr += end_marker;
        var b = new BurrowsWheelerTransform();
        b.build(this._substr);
        var s = b.get();
        this._head = b.head();
        b.clear();
        this._substr = "";
        if (is_msg)
        {
            console.timeEnd("building burrows-wheeler transform.");
        }
        if (is_msg)
        {
            console.time("building wavelet matrix.");
        }
        this._sv.build(s);
        if (is_msg)
        {
            console.timeEnd("building wavelet matrix.");
        }

        if (is_msg)
        {
            console.time("caching rank less than.");
        }
        for (var c = 0; c < 65536; c++)
        {
            this._rlt[c] = this._sv.rank_less_than(this._sv.size(), c);
        }
        if (is_msg)
        {
            console.timeEnd("caching rank less than.");
        }
        if (is_msg)
        {
            console.time("building dictionaries.");
        }
        this._ddic = ddic;
        for (var i = 0; i < (s.length / this._ddic + 1); i++)
        {
            this._posdic.push(0);
            this._idic.push(0);
        }
        var i = this._head;
        var pos = this.size() - 1;
        do {
            if ((i % this._ddic) == 0)
            {
                this._posdic[i / this._ddic] = pos;
            }
            if ((pos % this._ddic) == 0)
            {
                this._idic[pos / this._ddic] = i;
            }
            var c = this._sv.get(i);
            i = this._rlt[c] + this._sv.rank(i, c); //LF
            pos--;
        } while (i != this._head);
        if (is_msg)
        {
            console.timeEnd("building dictionaries.");
        }
    }

    function push (doc : string) : void
    {
        if (doc.length <= 0)
        {
            throw new Error("FMIndex::push(): empty string");
        }
        this._substr += doc;
    }

    function search (keyword : string) : int[]
    {
        var result_map = {} : Map.<int>;
        var result = [] : int[];
        var position = [] : int[];
        var rows = this.getRows(keyword, position);
        if (rows > 0)
        {
            var first = position[0];
            var last = position[1];
            for (var i = first; i <= last; i++)
            {
                result.push(this.getPosition(i));
            }
        }
        return result;
    }

    function dump () : string
    {
        var contents = [] : string[];
        contents.push(Binary.dump64bitNumber(this._ddic));
        contents.push(Binary.dump64bitNumber(this._head));
        contents.push(this._sv.dump());
        var wmsize = this._sv.size();
        var rlt_cache = [] : string[];
        for (var i = 0; i < 65536; i++)
        {
            var pos = this._rlt[i];
            if (pos != wmsize)
            {
                rlt_cache.push(Binary.dump16bitNumber(i) + Binary.dump64bitNumber(pos));
            }
        };
        contents.push(Binary.dump16bitNumber(rlt_cache.length));
        contents.push(rlt_cache.join(""));
        contents.push(Binary.dump64bitNumber(this._posdic.length));
        for (var i in this._posdic)
        {
            contents.push(Binary.dump64bitNumber(this._posdic[i]));
        }
        contents.push(Binary.dump64bitNumber(this._idic.length));
        for (var i in this._idic)
        {
            contents.push(Binary.dump64bitNumber(this._idic[i]));
        }
        return contents.join("");
    }

    function load (data : string) : int
    {
        return this.load(data, 0);
    }

    function load (data : string, offset : int) : int
    {
        this._ddic = Binary.load64bitNumber(data, offset);
        this._head = Binary.load64bitNumber(data, offset + 4);
        offset = this._sv.load(data, offset + 8);
        var wmsize = this._sv.size();
        var rlt_cache_size = Binary.load16bitNumber(data, offset++);
        for (var i = 0; i < rlt_cache_size; i++, offset += 5)
        {
            var index = Binary.load16bitNumber(data, offset);
            var pos = Binary.load64bitNumber(data, offset + 1);
            this._rlt[index] = pos;
        }
        for (var i = 0; i < 65536; i++)
        {
            if (this._rlt[i] == null)
            {
                this._rlt[i] = wmsize;
            }
        }
        var size = Binary.load64bitNumber(data, offset);
        offset += 4;
        for (var i = 0; i < size; i++, offset += 4)
        {
            this._posdic.push(Binary.load64bitNumber(data, offset));
        }
        var size = Binary.load64bitNumber(data, offset);
        offset += 4;
        for (var i = 0; i < size; i++, offset += 4)
        {
            this._idic.push(Binary.load64bitNumber(data, offset));
        }
        return offset;
    }
}
