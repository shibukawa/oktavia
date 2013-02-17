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
    var block : Block;

    override function setUp () : void
    {
        this.oktavia = new Oktavia();
        this.block = this.oktavia.addBlock('document');
        this.oktavia.addWord("abracadabra");
        this.block.startBlock("river");
        this.oktavia.addWord("mississippi");
        this.block.endBlock();
        this.oktavia.addWord("abracadabra mississippi");
        this.oktavia.build();
    }

    function test_doc_sizes () : void
    {
        this.expect(this.block.size()).toBe(1);
    }

    function test_in_block () : void
    {
        this.expect(this.block.inBlock(0)).toBe(false);
        this.expect(this.block.inBlock(10)).toBe(false);
        this.expect(this.block.inBlock(11)).toBe(true);
        this.expect(this.block.inBlock(21)).toBe(true);
        this.expect(this.block.inBlock(22)).toBe(false);
        this.expect(this.block.inBlock(44)).toBe(false);
    }

    function test_in_block_boundary () : void
    {
        try
        {
            this.block.inBlock(-1);
            this.fail("fm.inBlock() 1");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.inBlock(45);
            this.fail("fm.inBlock() 2");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_block_content () : void
    {
        this.expect(this.block.getBlockContent(11)).toBe("mississippi");
    }

    function test_get_block_content_boundary () : void
    {
        try
        {
            this.block.getBlockContent(45);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.getBlockContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_block_name () : void
    {
        this.expect(this.block.getBlockName(11)).toBe("river");
    }

    function test_get_block_name_boundary () : void
    {
        try
        {
            this.block.getBlockName(45);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.getBlockName(-1);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
    }

    function test_dump_load_and_doc_sizes () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        this.expect(this.block.size()).toBe(1);
    }

    function test_load_dump_and_in_block () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        this.expect(this.block.inBlock(0)).toBe(false);
        this.expect(this.block.inBlock(10)).toBe(false);
        this.expect(this.block.inBlock(11)).toBe(true);
        this.expect(this.block.inBlock(21)).toBe(true);
        this.expect(this.block.inBlock(22)).toBe(false);
        this.expect(this.block.inBlock(44)).toBe(false);
    }

    function test_load_dump_and_in_block_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        try
        {
            this.block.inBlock(-1);
            this.fail("fm.inBlock() 1");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.inBlock(45);
            this.fail("fm.inBlock() 2");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_get_block_content () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        this.expect(this.block.getBlockContent(11)).toBe("mississippi");
    }

    function test_load_dump_and_get_block_content_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        try
        {
            this.block.getBlockContent(45);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.getBlockContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }

    function test_load_dump_and_get_block_name () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        this.expect(this.block.getBlockName(11)).toBe("river");
    }

    function test_load_dump_and_get_block_name_boundary () : void
    {
        var dump = this.oktavia.dump();
        this.oktavia.load(dump);
        this.block = this.oktavia.getBlock('document');

        try
        {
            this.block.getBlockName(45);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.block.getBlockName(-1);
            this.fail("fm.getName()");
        }
        catch (e : Error)
        {
        }
    }
}
