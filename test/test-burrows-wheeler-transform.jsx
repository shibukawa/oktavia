/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "test-case.jsx";
import "burrows-wheeler-transform.jsx";

class _Test extends TestCase
{
    var bwt : BurrowsWheelerTransform;
    override function setUp() : void
    {
        this.bwt = new BurrowsWheelerTransform();
        this.bwt.build('abracadabra' + BurrowsWheelerTransform.END_MARKER);
    }

    function test_get() : void
    {
        this.expect(this.bwt.get("$")).toBe("ard$rcaaaabb");
    }
}
