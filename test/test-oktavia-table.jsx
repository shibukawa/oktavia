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
    var table : Table;

    override function setUp () : void
    {
        this.oktavia = new Oktavia();
        this.table = this.oktavia.addTable('address book', ['zip', 'city', 'area code']);

        this.oktavia.addWord("94101"); // 5
        this.table.setColumnTail();
        this.oktavia.addWord("San Francisco"); // 13
        this.table.setColumnTail();
        this.oktavia.addWord("415"); // 3
        this.table.setColumnTail();
        this.table.setRowTail();

        this.oktavia.addWord("94607"); // 5
        this.table.setColumnTail();
        this.oktavia.addWord("Oakland"); // 7
        this.table.setColumnTail();
        this.oktavia.addWord("510"); // 3
        this.table.setColumnTail();
        this.table.setRowTail();

        this.oktavia.addWord("94401"); // 5
        this.table.setColumnTail();
        this.oktavia.addWord("San Mateo"); // 9
        this.table.setColumnTail();
        this.oktavia.addWord("650"); // 3
        this.table.setColumnTail();
        this.table.setRowTail();

        this.oktavia.build();
    }

    function test_row_sizes () : void
    {
        this.expect(this.table.rowSize()).toBe(3);
    }

    function test_column_sizes () : void
    {
        this.expect(this.table.columnSize()).toBe(3);
    }

    function test_get_cell () : void
    {
        this.expect(this.table.getCell(0)[0]).toBe(0);
        this.expect(this.table.getCell(0)[1]).toBe(0);
        this.expect(this.table.getCell(22)[0]).toBe(0);
        this.expect(this.table.getCell(22)[1]).toBe(2);
        this.expect(this.table.getCell(24)[0]).toBe(1);
        this.expect(this.table.getCell(24)[1]).toBe(0);
        this.expect(this.table.getCell(40)[0]).toBe(1);
        this.expect(this.table.getCell(40)[1]).toBe(2);
        this.expect(this.table.getCell(42)[0]).toBe(2);
        this.expect(this.table.getCell(42)[1]).toBe(0);
        this.expect(this.table.getCell(60)[0]).toBe(2);
        this.expect(this.table.getCell(60)[1]).toBe(2);
    }

    function test_get_table_index_boundary () : void
    {
        try
        {
            this.table.getCell(-1);
            this.fail("fm.gettableIndex()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.table.getCell(62);
            this.fail("fm.gettableIndex()");
        }
        catch (e : Error)
        {
        }
    }

    function test_get_table_content () : void
    {
        var row = this.table.getRowContent(0);
        this.expect(row['zip']).toBe('94101');
        this.expect(row['city']).toBe('San Francisco');
        this.expect(row['area code']).toBe('415');
    }

    function test_get_table_content_boundary () : void
    {
        try
        {
            this.table.getContent(3);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
        try
        {
            this.table.getContent(-1);
            this.fail("fm.getContent()");
        }
        catch (e : Error)
        {
        }
    }
}
