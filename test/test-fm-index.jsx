/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "test-case.jsx";
import "fm-index.jsx";

class Pair
{
    var first : string;
    var second : int;
    function constructor (_first : string, _second : int)
    {
        this.first = _first;
        this.second = _second;
    }
}

class _Test extends TestCase
{
    var str : string;
    var rd : Map.<int>;
    var pd : int[];
    var sd : string[];
    var didd : int[];
    var docd : string[];
    var fm : FMIndex;
    var end_marker : string;

    override function setUp () : void
    {
        this.str = "";
        this.sd = [] : string[];
        this.rd = {} : Map.<int>;
        this.pd = [] : int[];
        this.didd = [] : int[];
        this.docd = [] : string[];
        this.fm = new FMIndex();
        this.end_marker = String.fromCharCode(1);

        this.docd.push("abracadabra");
        this.docd.push("mississippi");
        this.docd.push("abracadabra mississippi");

        var did = 0;
        for (var i in this.docd)
        {
            var doc = this.docd[i];
            this.str += doc;
            for (var j = 0; j < doc.length; j++){
                this.didd.push(did);
            }
            this.fm.push(doc);
            did++;
        }

        this.didd.push(did);
        this.str += this.end_marker;
        this.fm.build(this.end_marker, 3);

        for (var i = 0; i < this.str.length; i++)
        {
            for (var j = 1; j <= (this.str.length - i); j++)
            {
                var s = this.str.slice(i, i + j);
                if (this.rd[s] == null)
                {
                    this.rd[s] = 1;
                }
                else
                {
                    this.rd[s]++;
                }
            }
        }

        var v = [] : Pair[];
        for (var i = 0; i < this.str.length; i++)
        {
            var s = this.str.slice(i) + this.str.slice(0, i);
            v.push(new Pair(s, i));
        }
        v.sort(function (a: Pair, b: Pair) : number {
            if (a.first < b.first)
            {
                return -1;
            }
            else if (a.first > b.first)
            {
                return 1;
            }
            return a.second - b.second;
        });
        for (var i in v)
        {
            this.pd.push(v[i].second);
        }
        for (var i = 0; i < this.str.length; i++)
        {
            this.sd.push(this.str.slice(i));
        }
    }

    function test_size () : void
    {
        this.expect(this.fm.size()).toBe(this.str.length);
    }

    function test_docsize () : void
    {
        this.expect(this.fm.docsize()).toBe(this.docd.length);
    }

    function test_get_rows () : void
    {
        for (var i = 0; i < this.fm.size(); i++)
        {
            for (var j = i + 1; j < this.fm.size(); j++)
            {
                var s = this.str.slice(i, j);
                this.expect(this.fm.get_rows(s)).toBe(this.rd[s]);
            }
        }
    }

    function test_get_position () : void
    {
        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_position(i)).toBe(this.pd[i]);
        }
    }

    function test_get_substring () : void
    {
        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_substring(i, this.fm.size())).toBe(this.sd[i]);
        }
    }

    function test_get_document_id () : void
    {
        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_document_id(i)).toBe(this.didd[i]);
        }
    }

    function test_get_document () : void
    {
        for (var i = 0; i < this.fm.docsize(); i++)
        {
            this.expect(this.fm.get_document(i)).toBe(this.docd[i]);
        }
    }

    function test_get_position_boundary () : void
    {
        try
        {
            this.fm.get_position(this.fm.size());
            this.fail("fm.get_position()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_substring_boundary () : void
    {
        try
        {
            this.fm.get_substring(this.fm.size(), 0);
            this.fail("fm.get_substring()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_document_id_boundary () : void
    {
        try
        {
            this.fm.get_document_id(this.fm.size());
            this.fail("fm.get_document_id()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_document_boundary () : void
    {
        try
        {
            this.fm.get_document(this.fm.docsize());
            this.fail("fm.get_document()");
        }
        catch (e : Error)
        {
        }
    }

    function test_dump_load_and_size () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        this.expect(this.fm.size()).toBe(this.str.length);
    }

    function test_dump_load_and_docsize () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        this.expect(this.fm.docsize()).toBe(this.docd.length);
    }

    function test_dump_load_and_get_rows () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        for (var i = 0; i < this.fm.size(); i++)
        {
            for (var j = i + 1; j < this.fm.size(); j++)
            {
                var s = this.str.slice(i, j);
                this.expect(this.fm.get_rows(s)).toBe(this.rd[s]);
            }
        }
    }

    function test_dump_load_and_get_position () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_position(i)).toBe(this.pd[i]);
        }
    }

    function test_dump_load_and_get_substring () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_substring(i, this.fm.size())).toBe(this.sd[i]);
        }
    }

    function test_dump_load_and_get_document_id () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        for (var i = 0; i < this.fm.size(); i++)
        {
            this.expect(this.fm.get_document_id(i)).toBe(this.didd[i]);
        }
    }

    function test_dump_load_and_get_document () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        for (var i = 0; i < this.fm.docsize(); i++)
        {
            this.expect(this.fm.get_document(i)).toBe(this.docd[i]);
        }
    }

    function test_dump_load_and_get_position_boundary () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        try
        {
            this.fm.get_position(this.fm.size());
            this.fail("fm.get_position()");
        }
        catch (e : Error)
        {
        }
    }

    function test_dump_load_and_get_substring_boundary () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        try
        {
            this.fm.get_substring(this.fm.size(), 0);
            this.fail("fm.get_substring()");
        }
        catch (e : Error)
        {
        }
    }

    function test_dump_load_and_get_document_id_boundary () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        try
        {
            this.fm.get_document_id(this.fm.size());
            this.fail("fm.get_document_id()");
        }
        catch (e : Error)
        {
        }
    }

    function test_dump_load_and_get_document_boundary () : void
    {
        var dump = this.fm.dump();
        this.fm.load(dump);

        try
        {
            this.fm.get_document(this.fm.docsize());
            this.fail("fm.get_document()");
        }
        catch (e : Error)
        {
        }
    }
}
