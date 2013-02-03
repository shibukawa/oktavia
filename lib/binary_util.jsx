class Binary
{
    static function dump_64bit_number (num : int) : string
    {
        var result = [String.fromCharCode(Math.floor(num / 281474976710656))];
        var remain = num % 281474976710656;
        result.push(String.fromCharCode(Math.floor(num / 4294967296)));
        remain = remain % 4294967296;
        result.push(String.fromCharCode(Math.floor(num / 65536)));
        result.push(String.fromCharCode(remain % 65536));
        return result.join("");
    }

    static function load_64bit_number (buffer : string, offset : int) : int
    {
        var result = buffer.charCodeAt(offset) * 281474976710656;
        result += buffer.charCodeAt(offset + 1) * 4294967296;
        result += buffer.charCodeAt(offset + 2) * 65536;
        result += buffer.charCodeAt(offset + 3);
        return result;
    }

    static function dump_32bit_number (num : int) : string
    {
        var result = [String.fromCharCode(Math.floor(num / 65536))];
        result.push(String.fromCharCode(num % 65536));
        return result.join("");
    }

    static function load_32bit_number (buffer : string, offset : int) : int
    {
        var result = buffer.charCodeAt(offset) * 65536;
        result += buffer.charCodeAt(offset + 1);
        return result;
    }

    static function dump_16bit_number (num : int) : string
    {
        return String.fromCharCode(num % 65536);
    }

    static function load_16bit_number (buffer : string, offset : int) : int
    {
        return buffer.charCodeAt(offset);
    }
}
