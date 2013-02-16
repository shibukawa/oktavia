/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "test-case.jsx";
import "wavelet-matrix.jsx";

class _Test extends TestCase
{
    var test_src : string;
    var wm : WaveletMatrix;
    var rd : int[][];
    var sd : int[][];
    var td : int[][];

    override function setUp () : void
    {
        this.test_src = "abracadabra mississippi";
        this.wm = new WaveletMatrix();
        this.wm.build(this.test_src);
        this.rd = [] : int[][];
        this.sd = [] : int[][];
        this.td = [] : int[][];

        for (var i = 0; i < 256; i++)
        {
            this.rd.push([0] : int[]);
            this.td.push([0] : int[]);
            this.sd.push([] : int[]);
        }

        for (var i = 0; i < this.test_src.length; i++)
        {
            for (var c = 0; c < 256; c++)
            {
                this.rd[c].push(this.rd[c][i]);
                this.td[c].push(this.td[c][i]);
                if (this.test_src.charCodeAt(i) == c)
                {
                    this.rd[c][i + 1]++;
                    this.sd[c].push(i);
                }
                if (this.test_src.charCodeAt(i) < c)
                {
                    this.td[c][i + 1]++;
                }
            }
        }
    }

    function test_size () : void
    {
        this.expect(this.wm.size()).toBe(this.test_src.length);
        for (var c = 0; c < 256; c++)
        {
            this.expect(this.wm.size(c)).toBe(this.rd[c][this.wm.size()]);
        }
    }

    function test_get() : void
    {
        for (var i = 0; i < this.wm.size(); i++)
        {
            this.expect(this.wm.get(i)).toBe(this.test_src.charCodeAt((i)));
        }
    }

    function test_rank() : void
    {
        for (var c = 0; c < 256; c++)
        {
            for (var i = 0; i <= this.wm.size(); i++)
            {
                this.expect(this.wm.rank(i, c)).toBe(this.rd[c][i]);
            }
        }
    }

    function test_rank_less_than() : void
    {
        for (var c = 0; c < 256; c++)
        {
            for (var i = 0; i <= this.wm.size(); i++)
            {
                this.expect(this.wm.rank_less_than(i, c)).toBe(this.td[c][i]);
            }
        }
    }

    function test_load_dump_and_size () : void
    {
        var dump = this.wm.dump();
        this.wm.load(dump);

        this.expect(this.wm.size()).toBe(this.test_src.length);
        for (var c = 0; c < 256; c++)
        {
            this.expect(this.wm.size(c)).toBe(this.rd[c][this.wm.size()]);
        }
    }

    function test_load_dump_and_get() : void
    {
        var dump = this.wm.dump();
        this.wm.load(dump);

        for (var i = 0; i < this.wm.size(); i++)
        {
            this.expect(this.wm.get(i)).toBe(this.test_src.charCodeAt((i)));
        }
    }

    function test_load_dump_and_rank() : void
    {
        var dump = this.wm.dump();
        this.wm.load(dump);

        for (var c = 0; c < 256; c++)
        {
            for (var i = 0; i <= this.wm.size(); i++)
            {
                this.expect(this.wm.rank(i, c)).toBe(this.rd[c][i]);
            }
        }
    }

    function test_load_dump_and_rank_less_than() : void
    {
        var dump = this.wm.dump();
        this.wm.load(dump);

        for (var c = 0; c < 256; c++)
        {
            for (var i = 0; i <= this.wm.size(); i++)
            {
                this.expect(this.wm.rank_less_than(i, c)).toBe(this.td[c][i]);
            }
        }
    }
}
