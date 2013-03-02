/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "test-case.jsx";
import "oktavia.jsx";
import "metadata.jsx";

class _Test extends TestCase
{
    var oktavia : Oktavia;
    var splitter : Splitter;

    override function setUp () : void
    {
        this.oktavia = new Oktavia();
        this.splitter = this.oktavia.addSplitter('document');
        this.oktavia.addWord("abracadabra");
        this.splitter.split();
        this.oktavia.addWord("mississippi");
        this.splitter.split();
        this.oktavia.addWord("abracadabra mississippi");
        this.splitter.split();
        this.oktavia.build(25, false);
    }

    function test_count () : void
    {
        this.expect(this.splitter.size()).toBe(3);
    }

    function test_get_splitter_index () : void
    {
        this.expect(this.splitter.getIndex(0)).toBe(0);
        this.expect(this.splitter.getIndex(10)).toBe(0);
        this.expect(this.splitter.getIndex(11)).toBe(1);
        this.expect(this.splitter.getIndex(21)).toBe(1);
        this.expect(this.splitter.getIndex(22)).toBe(2);
        this.expect(this.splitter.getIndex(44)).toBe(2);
    }

    function test_get_splitter_index_boundary () : void
    {
        try
        {
            this.splitter.getIndex(-1);
            this.fail("fm.getIndex()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.splitter.getIndex(45);
            this.fail("fm.getIndex()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_splitter_content () : void
    {
        this.expect(this.splitter.getContent(2)).toBe("abracadabra mississippi");
        this.expect(this.splitter.getContent(1)).toBe("mississippi");
        this.expect(this.splitter.getContent(0)).toBe("abracadabra");
    }

    function test_get_splitter_content_boundary () : void
    {
        try
        {
            this.splitter.getContent(3);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.splitter.getContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_count () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.splitter = this.oktavia.getSplitter('document');

        this.expect(this.splitter.size()).toBe(3);
    }

    function test_load_dump_and_get_splitter_index () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.splitter = this.oktavia.getSplitter('document');

        this.expect(this.splitter.getIndex(0)).toBe(0);
        this.expect(this.splitter.getIndex(10)).toBe(0);
        this.expect(this.splitter.getIndex(11)).toBe(1);
        this.expect(this.splitter.getIndex(21)).toBe(1);
        this.expect(this.splitter.getIndex(22)).toBe(2);
        this.expect(this.splitter.getIndex(44)).toBe(2);
    }

    function test_load_dump_and_get_splitter_index_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.splitter = this.oktavia.getSplitter('document');

        try
        {
            this.splitter.getIndex(-1);
            this.fail("fm.getIndex()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.splitter.getIndex(45);
            this.fail("fm.getIndex()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_get_splitter_content () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.splitter = this.oktavia.getSplitter('document');

        this.expect(this.splitter.getContent(2)).toBe("abracadabra mississippi");
        this.expect(this.splitter.getContent(1)).toBe("mississippi");
        this.expect(this.splitter.getContent(0)).toBe("abracadabra");
    }

    function test_load_dump_and_get_splitter_content_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.splitter = this.oktavia.getSplitter('document');

        try
        {
            this.splitter.getContent(3);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.splitter.getContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }
}
