import "test-case.jsx";
import "bit-vector.jsx";
import "console.jsx";

class _Test extends TestCase
{
    var src_values : int[];
    var bv0 : BitVector;
    var bv1 : BitVector;

    override function setUp () : void
    {
        this.bv0 = new BitVector();
        this.bv1 = new BitVector();

        this.src_values = [0, 511, 512, 1000, 2000, 3000] : int[];

        for (var i = 0; i <= this.src_values[this.src_values.length - 1]; i++)
        {
            this.bv0.set(i, true);
        }

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.bv1.set(v, true);
            this.bv0.set(v, false);
        }
        this.bv1.build();
        this.bv0.build();
    }

    function test_size () : void
    {
        this.expect(this.bv1.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv1.size(true)).toBe(this.src_values.length); // == 6
        this.expect(this.bv0.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv0.size(false)).toBe(this.src_values.length); // == 6
    }

    function test_get () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.get(v)).toBe(true);
            this.expect(this.bv0.get(v)).toBe(false);
        }
    }

    function test_rank () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.rank(v, true)).toBe(i);
            this.expect(this.bv0.rank(v, false)).toBe(i);
        }
    }

    function test_select () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.select(i, true)).toBe(v);
            this.expect(this.bv0.select(i, false)).toBe(v);
        }
    }

    function test_load_dump_and_size () : void
    {
        console.log('dump1');
        var dump1 = this.bv1.dump();
        console.log('dump0');
        var dump0 = this.bv0.dump();
        console.log('load1');
        this.bv1.load(dump1);
        console.log('load0');
        this.bv0.load(dump0);

        this.expect(this.bv1.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv1.size(true)).toBe(this.src_values.length); // == 6
        this.expect(this.bv0.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv0.size(false)).toBe(this.src_values.length); // == 6
    }

    function test_load_dump_and_get () : void
    {
        var dump1 = this.bv1.dump();
        var dump0 = this.bv0.dump();
        this.bv1.load(dump1);
        this.bv0.load(dump0);

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.get(v)).toBe(true);
            this.expect(this.bv0.get(v)).toBe(false);
        }
    }

    function test_load_dump_and_rank () : void
    {
        var dump1 = this.bv1.dump();
        var dump0 = this.bv0.dump();
        this.bv1.load(dump1);
        this.bv0.load(dump0);

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.rank(v, true)).toBe(i);
            this.expect(this.bv0.rank(v, false)).toBe(i);
        }
    }

    function test_load_dump_and_select () : void
    {
        var dump1 = this.bv1.dump();
        var dump0 = this.bv0.dump();
        this.bv1.load(dump1);
        this.bv0.load(dump0);
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.select(i, true)).toBe(v);
            this.expect(this.bv0.select(i, false)).toBe(v);
        }
    }
}
