class Binary
{
    static function dump64bitNumber (num : int) : string
    {
        var result = [String.fromCharCode(Math.floor(num / 281474976710656))];
        var remain = num % 281474976710656;
        result.push(String.fromCharCode(Math.floor(num / 4294967296)));
        remain = remain % 4294967296;
        result.push(String.fromCharCode(Math.floor(num / 65536)));
        result.push(String.fromCharCode(remain % 65536));
        return result.join("");
    }

    static function load64bitNumber (buffer : string, offset : int) : int
    {
        var result = buffer.charCodeAt(offset) * 281474976710656;
        result += buffer.charCodeAt(offset + 1) * 4294967296;
        result += buffer.charCodeAt(offset + 2) * 65536;
        result += buffer.charCodeAt(offset + 3);
        return result;
    }

    static function dump32bitNumber (num : int) : string
    {
        var result = [String.fromCharCode(Math.floor(num / 65536))];
        result.push(String.fromCharCode(num % 65536));
        return result.join("");
    }

    static function load32bitNumber (buffer : string, offset : int) : int
    {
        var result = buffer.charCodeAt(offset) * 65536;
        result += buffer.charCodeAt(offset + 1);
        return result;
    }

    static function dump16bitNumber (num : int) : string
    {
        return String.fromCharCode(num % 65536);
    }

    static function load16bitNumber (buffer : string, offset : int) : int
    {
        return buffer.charCodeAt(offset);
    }

    static function dumpString (str : string) : string
    {
        if (str.length > 65536)
        {
            str = str.slice(0, 65536);
        }
        var result = [Binary.dump16bitNumber(str.length), str];
        return result.join('');
    }

    static function loadString (buffer : string, offset : int) : LoadedStringResult
    {
        return new LoadedStringResult(buffer, offset);
    }

    static function dumpStringList (strList : string[]) : string
    {
        var result = [Binary.dump16bitNumber(strList.length)];
        for (var i in strList)
        {
            var str = strList[i];
            if (str.length > 65536)
            {
                str = str.slice(0, 65536);
            }
            result.push(Binary.dump16bitNumber(str.length), str);
        }
        return result.join('');
    }

    static function loadStringList (buffer : string, offset : int) : LoadedStringListResult
    {
        return new LoadedStringListResult(buffer, offset);
    }
}

class LoadedStringResult
{
    var result : string;
    var offset : int;

    function constructor (data : string, offset : int)
    {
        var length = Binary.load16bitNumber(data, offset++);
        this.result = data.slice(offset, offset + length);
        this.offset = offset + length;
    }
}

class LoadedStringListResult
{
    var result : string[];
    var offset : int;

    function constructor (data : string, offset : int)
    {
        this.result = [] : string[];

        var length = Binary.load16bitNumber(data, offset++);
        for (var i = 0; i < length; i++)
        {
            var strLength = Binary.load16bitNumber(data, offset++);
            this.result.push(data.slice(offset, offset + strLength));
            offset += strLength;
        }
        this.offset = offset;
    }
}


