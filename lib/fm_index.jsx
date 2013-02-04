/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "wavelet_matrix.jsx";
import "bit_vector.jsx";
import "burrows_wheeler_transform.jsx";
import "binary_util.jsx";
import "console.jsx";


class FMIndex
{
    var _substr : string;
    var _doctails : BitVector;
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
        this._doctails = new BitVector();
        this._sv = new WaveletMatrix();
        this._posdic = [] : int[];
        this._idic = [] : int[];
        this._rlt = [] : int[];
        this._rlt.length = 65536;
    }

    function clear () : void
    {
        this._sv.clear();
        this._doctails.clear();
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

    function docsize () : int
    {
        return this._doctails.size(true);
    }

    function get_rows (key : string) : int
    {
        var pos = [] : int[];
        return this.get_rows(key, pos);
    }
    function get_rows (key : string, pos : int[]) : int
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

    function get_position (i : int) : int
    {
        if (i >= this.size())
        {
            throw new Error("FMIndex.get_position() : range error");
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

    function get_substring (pos : int, len : int) : string
    {
        if (pos >= this.size())
        {
            throw new Error("FMIndex.get_substring() : range error");
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

    function get_document_id (pos : int) : int
    {
        if (pos >= this.size())
        {
            throw new Error("FMIndex.get_document_id() : range error");
        }
        return this._doctails.rank(pos);
    }

    function get_document (did : int) : string
    {
        if (did >= this.docsize())
        {
            throw new Error("FMIndex.get_document() : range error");
        }
        var pos = 0;
        if (did > 0)
        {
            pos = this._doctails.select(did - 1) + 1;
        }
        var len = this._doctails.select(did) - pos + 1;
        return this.get_substring(pos, len);
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
        this._doctails.build();
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
        this._doctails.set(this._doctails.size() + doc.length - 1);
    }

    function search (keyword : string) : int[][]
    {
        var result_map = {} : Map.<int>;
        var results = [] : int[][];
        var position = [] : int[];
        var rows = this.get_rows(keyword, position);
        if (rows > 0)
        {
            var first = position[0];
            var last = position[1];
            for (var i = first; i <= last; i++)
            {
                var pos = this.get_position(i);
                var did = this.get_document_id(pos) as string;
                if (result_map[did] == null)
                {
                    result_map[did] = results.length;
                    results.push([did as int, 1] : int[]);
                }
                else
                {
                    results[result_map[did]][1]++;
                }
            }
        }
        return results;
    }

    function dump () : string
    {
        var contents = [] : string[];
        contents.push(Binary.dump_64bit_number(this._ddic));
        contents.push(Binary.dump_64bit_number(this._head));
        for (var i = 0; i < 65536; i++)
        {
            contents.push(Binary.dump_64bit_number(this._rlt[i]));
        };
        contents.push(this._sv.dump());
        contents.push(this._doctails.dump());

        for (var i in this._posdic)
        {
            Binary.dump_64bit_number(this._posdic[i]);
        }
        for (var i in this._idic)
        {
            Binary.dump_64bit_number(this._idic[i]);
        }
        return contents.join("");
    }

    function load (data : string) : int
    {
        return this.load(data, 0);
    }

    function load (data : string, offset : int) : int
    {
        this._ddic = Binary.load_64bit_number(data, 0);
        this._head = Binary.load_64bit_number(data, 4);
        offset += 8;
        for (var i = 0; i < 65536; i++, offset += 4)
        {
            this._rlt[i] = Binary.load_64bit_number(data, offset);
        }
        offset = this._sv.load(data, offset);
        offset = this._doctails.load(data, offset);

        var size = Math.floor(this._sv.size() / this._ddic) + 1;
        for (var i = 0; i < size; i++, offset += 4)
        {
            this._posdic.push(Binary.load_64bit_number(data, offset));
        }
        for (var i = 0; i < size; i++, offset += 4)
        {
            this._idic.push(Binary.load_64bit_number(data, offset));
        }
        return offset;
    }
}
