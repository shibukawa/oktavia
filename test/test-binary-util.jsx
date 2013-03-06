import "test-case.jsx";
import "binary-util.jsx";

class _Test extends TestCase
{
    function test_16bit_number() : void
    {
        this.expect(Binary.load16bitNumber(Binary.dump16bitNumber(0), 0)).toBe(0);
        this.expect(Binary.load16bitNumber(Binary.dump16bitNumber(65535), 0)).toBe(65535);
        this.expect(Binary.load16bitNumber(Binary.dump16bitNumber(65536), 0)).notToBe(65536);
    }

    function test_32bit_number() : void
    {
        this.expect(Binary.load32bitNumber(Binary.dump32bitNumber(0), 0)).toBe(0);
        this.expect(Binary.load32bitNumber(Binary.dump32bitNumber(4294967295), 0)).toBe(4294967295);
        this.expect(Binary.load32bitNumber(Binary.dump32bitNumber(4294967296), 0)).notToBe(4294967296);
    }

    function test_string() : void
    {
        var str = Binary.loadString(Binary.dumpString('hello world'), 0);
        this.expect(str.result).toBe('hello world');

        // 7bit safe charactes will be compressed
        this.expect(Binary.dumpString('hello world').length).toBeLE('hello world'.length);
        this.expect(Binary.dumpString('').length).toBe(''.length + 1);

        // 7bit unsafe charactes will not be compressed
        this.expect(Binary.dumpString('\u1111\u1111').length).toBe('\u1111\u1111'.length + 1);
    }

    function test_string_list() : void
    {
        var list = Binary.loadStringList(Binary.dumpStringList(['hello', 'world']), 0);
        this.expect(list.result[0]).toBe('hello');
        this.expect(list.result[1]).toBe('world');

        var list = Binary.loadStringList(Binary.dumpStringList(['\u1111', '\u2222']), 0);
        this.expect(list.result[0]).toBe('\u1111');
        this.expect(list.result[1]).toBe('\u2222');
    }

    function test_string_list_map() : void
    {
        var src = {'hello': ['HELLO'], 'world': ['WORLD']};
        var list = Binary.loadStringListMap(Binary.dumpStringListMap(src), 0);
        this.expect(list.result['hello'][0]).toBe('HELLO');
        this.expect(list.result['world'][0]).toBe('WORLD');
    }

    function test_32bit_number_list_blank() : void
    {
        var list = [0, 0, 0, 0, 0, 0];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(6);
        this.expect(loaded.result[0]).toBe(0);
        this.expect(loaded.result[5]).toBe(0);
        this.expect(loaded.offset).toBe(2 + 1);
    }

    function test_32bit_number_list_non_blank() : void
    {
        var list = [1, 1, 1, 1, 1, 1];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 * 6 + 2 + 1);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(6);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[5]).toBe(1);
        this.expect(loaded.offset).toBe(2 * 6 + 2 + 1);
    }

    function test_32bit_number_list_zebra() : void
    {
        var list = [1, 0, 1, 0, 1, 0];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 * 3 + 2 + 1);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(6);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[1]).toBe(0);
        this.expect(loaded.result[2]).toBe(1);
        this.expect(loaded.result[3]).toBe(0);
        this.expect(loaded.result[4]).toBe(1);
        this.expect(loaded.result[5]).toBe(0);
        this.expect(loaded.offset).toBe(2 * 3 + 2 + 1);
    }

    function test_32bit_number_list_combo1() : void
    {
        // non-blank + blank
        var list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 2 * 17 + 1);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(list.length);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[15]).toBe(1);
        this.expect(loaded.result[17]).toBe(0);
        this.expect(loaded.result[19]).toBe(0);
        this.expect(loaded.offset).toBe(2 + 1 + 2 * 17 + 1);
    }

    function test_32bit_number_list_combo2() : void
    {
        // blank + non-blank
        var list = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 1 + 2 * 17);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(list.length);
        this.expect(loaded.result[0]).toBe(0);
        this.expect(loaded.result[2]).toBe(0);
        this.expect(loaded.result[3]).toBe(1);
        this.expect(loaded.result[19]).toBe(1);
        this.expect(loaded.offset).toBe(2 + 1 + 1 + 2 * 17);
    }

    function test_32bit_number_list_combo3() : void
    {
        // non-blank + zebra
        var list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 2 * 16 + 1 + 1 + 2 * 3);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(list.length);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[9]).toBe(1);
        this.expect(loaded.result[16]).toBe(0);
        this.expect(loaded.result[18]).toBe(1);
        this.expect(loaded.offset).toBe(2 + 1 + 2 * 16 + 1 + 1 + 2 * 3);
    }

    function test_32bit_number_list_combo4() : void
    {
        // zebra + non-block
        var list = [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 2 * 11 + 1 + 2 * 16);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(list.length);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[14]).toBe(0);
        this.expect(loaded.result[15]).toBe(1);
        this.expect(loaded.result[30]).toBe(2);
        this.expect(loaded.offset).toBe(2 + 1 + 2 * 11 + 1 + 2 * 16);
    }

    function test_32bit_number_list_combo5() : void
    {
        // zero + zebra
        var list = [0, 0, 0, 0, 0, 0, 1];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 1 + 2);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(7);
        this.expect(loaded.result[0]).toBe(0);
        this.expect(loaded.result[6]).toBe(1);
        this.expect(loaded.offset).toBe(2 + 1 + 1 + 2);
    }

    function test_32bit_number_list_combo6() : void
    {
        // zebra + zero
        var list = [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var dumped = Binary.dump32bitNumberList(list);
        this.expect(dumped.length).toBe(2 + 1 + 2 * 12 + 1);
        var loaded = Binary.load32bitNumberList(dumped, 0);
        this.expect(loaded.result.length).toBe(list.length);
        this.expect(loaded.result[0]).toBe(1);
        this.expect(loaded.result[14]).toBe(1);
        this.expect(loaded.result[15]).toBe(0);
        this.expect(loaded.result[23]).toBe(0);
        this.expect(loaded.offset).toBe(2 + 1 + 2 * 12 + 1);
    }

    function test_base64_encode_decode() : void
    {
        var allChars = [] : string[];
        for (var i = 256; i < 65536; i++)
        {
            allChars.push(String.fromCharCode(i));
        }
        var allCharSource = allChars.join('');
        this.expect(Binary.base64decode(Binary.base64encode(allCharSource))).toBe(allCharSource);
    }
}
