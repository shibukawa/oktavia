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
    var section : Section;

    override function setUp () : void
    {
        this.oktavia = new Oktavia();
        this.section = this.oktavia.addSection('document');
        this.oktavia.addWord("abracadabra");
        this.section.setTail("doc1");
        this.oktavia.addWord("mississippi");
        this.section.setTail("doc2");
        this.oktavia.addWord("abracadabra mississippi");
        this.section.setTail("doc3");
        this.oktavia.build(25, false);
    }

    function test_doc_sizes () : void
    {
        this.expect(this.section.size()).toBe(3);
    }

    function test_get_section_index () : void
    {
        this.expect(this.section.getSectionIndex(0)).toBe(0);
        this.expect(this.section.getSectionIndex(10)).toBe(0);
        this.expect(this.section.getSectionIndex(11)).toBe(1);
        this.expect(this.section.getSectionIndex(21)).toBe(1);
        this.expect(this.section.getSectionIndex(22)).toBe(2);
        this.expect(this.section.getSectionIndex(44)).toBe(2);
    }

    function test_get_section_index_boundary () : void
    {
        try
        {
            this.section.getSectionIndex(-1);
            this.fail("fm.getSectionIndex()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getSectionIndex(45);
            this.fail("fm.getSectionIndex()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_section_content () : void
    {
        this.expect(this.section.getContent(0)).toBe("abracadabra");
        this.expect(this.section.getContent(1)).toBe("mississippi");
        this.expect(this.section.getContent(2)).toBe("abracadabra mississippi");
    }

    function test_get_section_content_boundary () : void
    {
        try
        {
            this.section.getContent(3);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_section_name () : void
    {
        this.expect(this.section.getName(0)).toBe("doc1");
        this.expect(this.section.getName(1)).toBe("doc2");
        this.expect(this.section.getName(2)).toBe("doc3");
    }

    function test_get_section_name_boundary () : void
    {
        try
        {
            this.section.getName(3);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getName(-1);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_doc_sizes () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        this.expect(this.section.size()).toBe(3);
    }

    function test_load_dump_and_get_section_index () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        this.expect(this.section.getSectionIndex(0)).toBe(0);
        this.expect(this.section.getSectionIndex(10)).toBe(0);
        this.expect(this.section.getSectionIndex(11)).toBe(1);
        this.expect(this.section.getSectionIndex(21)).toBe(1);
        this.expect(this.section.getSectionIndex(22)).toBe(2);
        this.expect(this.section.getSectionIndex(44)).toBe(2);
    }

    function test_load_dump_and_get_section_index_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        try
        {
            this.section.getSectionIndex(-1);
            this.fail("fm.getSectionIndex()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getSectionIndex(45);
            this.fail("fm.getSectionIndex()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_get_section_content () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        this.expect(this.section.getContent(0)).toBe("abracadabra");
        this.expect(this.section.getContent(1)).toBe("mississippi");
        this.expect(this.section.getContent(2)).toBe("abracadabra mississippi");
    }

    function test_load_dump_and_get_section_content_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        try
        {
            this.section.getContent(3);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_get_section_name () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        this.expect(this.section.getName(0)).toBe("doc1");
        this.expect(this.section.getName(1)).toBe("doc2");
        this.expect(this.section.getName(2)).toBe("doc3");
    }

    function test_load_dump_and_get_section_name_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.section = this.oktavia.getSection('document');

        try
        {
            this.section.getName(3);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.section.getName(-1);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
    }
}
