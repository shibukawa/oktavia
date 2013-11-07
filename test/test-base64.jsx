import "test-case.jsx";
import "base64.jsx";

class _Test extends TestCase
{
    function test_atob_btoa () : void
    {
        var testdata = "test string";
        this.expect(Base64.atob(Base64.btoa(testdata))).toBe(testdata);
    }

    function test_atob_btoa_with_16bit_char () : void
    {
        var testdata = "test string\ufff0";
        this.expect(Base64.atob(Base64.btoa(testdata))).notToBe(testdata);
    }

    function test_atob_btoa_with_16bit_char_with_cleaning () : void
    {
        var testdata = "test string\ufff0\u0000\uffff";
        var result = Base64.to16bitString(Base64.atob(Base64.btoa(Base64.to8bitString(testdata))));
        this.expect(result).notToBe(testdata);
    }
}
