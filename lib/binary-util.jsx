class Binary
{
    static function dump32bitNumber (num : number) : string
    {
        var result = [String.fromCharCode(Math.floor(num / 65536))];
        result.push(String.fromCharCode(num % 65536));
        return result.join("");
    }

    static function load32bitNumber (buffer : string, offset : int) : number
    {
        var result = buffer.charCodeAt(offset) * 65536 + buffer.charCodeAt(offset + 1);
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
        if (str.length > 32768)
        {
            str = str.slice(0, 32768);
        }
        var length = str.length;
        var compress = true;
        var charCodes = [] : int[];
        for (var i = 0; i < length; i++)
        {
            var charCode = str.charCodeAt(i);
            if (charCode > 255)
            {
                compress = false;
                break;
            }
            charCodes.push(charCode);
        }
        if (compress)
        {
            var result = [Binary.dump16bitNumber(length + 32768)];
            for (var i = 0; i < length; i += 2)
            {
                var bytes = charCodes[i];
                if (i != length - 1)
                {
                    bytes += charCodes[i + 1] << 8;
                }
                result.push(Binary.dump16bitNumber(bytes));
            }
        }
        else
        {
            var result = [Binary.dump16bitNumber(length), str];
        }
        return result.join('');
    }

    static function loadString (buffer : string, offset : int) : LoadedStringResult
    {
        return new LoadedStringResult(buffer, offset);
    }

    static function dumpStringList (strList : string[]) : string
    {
        var result = [Binary.dump16bitNumber(strList.length)];
        for (var i = 0; i < strList.length; i++)
        {
            result.push(Binary.dumpString(strList[i]));
        }
        return result.join('');
    }

    static function loadStringList (buffer : string, offset : int) : LoadedStringListResult
    {
        return new LoadedStringListResult(buffer, offset);
    }

    static function dump32bitNumberList (array : number[]) : string
    {
        var result = [Binary.dump32bitNumber(array.length)] : string[];
        var index = 0;
        var inputLength = array.length;
        while (index < inputLength)
        {
            if (array[index] == 0)
            {
                var length = Binary._countZero(array, index);
                result.push(Binary._zeroBlock(length));
                index += length;
            }
            else if (Binary._shouldZebraCode(array, index))
            {
                result.push(Binary._createZebraCode(array, index));
                index = Math.min(array.length, index + 15);
            }
            else
            {
                var length = Binary._searchDoubleZero(array, index);
                result.push(Binary._nonZeroBlock(array, index, length));
                if (length == 0)
                {
                    throw new Error('');
                }
                index += length;
            }
        }
        return result.join('');
    }

    static function load32bitNumberList (buffer :string, offset : int) : LoadedNumberListResult
    {
        return new LoadedNumberListResult(buffer, offset);
    }

    static function _countZero (array : number[], offset : int) : int
    {
        for (var i = offset; i < array.length; i++)
        {
            if (array[i] != 0)
            {
                return i - offset;
            }
        }
        return array.length - offset;
    }

    static function _zeroBlock (length : int) : string
    {
        var result = [] : string[];
        while (length > 0)
        {
            if (length > 16384)
            {
                result.push(Binary.dump16bitNumber(16384 - 1));
                length -= 16384;
            }
            else
            {
                result.push(Binary.dump16bitNumber(length - 1));
                length = 0;
            }
        }
        return result.join('');
    }

    static function _shouldZebraCode(array : number[], offset : int) : boolean
    {
        if (array.length - offset < 16)
        {
            return true;
        }
        var change = 0;
        var isLastZero = false;
        for (var i = offset; i < offset + 15; i++)
        {
            if (array[i] == 0)
            {
                if (!isLastZero)
                {
                    isLastZero = true;
                    change++;
                }
            }
            else
            {
                if (isLastZero)
                {
                    isLastZero = false;
                    change++;
                }
            }
        }
        return change > 2;
    }

    static function _searchDoubleZero (array : number[], offset : int) : int
    {
        var isLastZero = false;
        for (var i = offset; i < array.length; i++)
        {
            if (array[i] == 0)
            {
                if (isLastZero)
                {
                    return i - offset - 1;
                }
                isLastZero = true;
            }
            else
            {
                isLastZero = false;
            }
        }
        return array.length - offset;
    }

    static function _nonZeroBlock (array : number[], offset : int, length : int) : string
    {
        var result = [] : string[];
        while (length > 0)
        {
            var blockLength : int;
            if (length > 16384)
            {
                blockLength = 16384;
                result.push(Binary.dump16bitNumber((length - 1) + 0x4000));
                length -= 16384;
            }
            else
            {
                blockLength = length;
                result.push(Binary.dump16bitNumber((length - 1) + 0x4000));
                length = 0;
            }
            for (var i = offset; i < offset + blockLength; i++)
            {
                result.push(Binary.dump32bitNumber(array[i]));
            }
            offset += blockLength;
        }
        return result.join('');
    }

    static function _createZebraCode(array : number[], offset : int) : string
    {
        var last = Math.min(offset + 15, array.length);
        var code = 0x8000;
        var result = [] : string[];
        for (var i = offset; i < last; i++)
        {
            if (array[i] != 0)
            {
                result.push(Binary.dump32bitNumber(array[i]));
                code = code + (0x1 << (i - offset));
            }
        }
        return String.fromCharCode(code) + result.join('');
    }
}

class LoadedStringResult
{
    var result : string;
    var offset : int;

    function constructor (data : string, offset : int)
    {
        var strLength = Binary.load16bitNumber(data, offset++);
        if (strLength > 32767)
        {
            strLength = strLength - 32768;
            var bytes = [] : string[];

            for (var i = 0; i < strLength; i += 2)
            {
                var code = data.charCodeAt(offset);
                bytes.push(String.fromCharCode(code & 0x00ff));
                if (i != strLength - 1)
                {
                    bytes.push(String.fromCharCode(code >>> 8));
                }
                offset++;
            }
            this.result = bytes.join('');
            this.offset = offset;
        }
        else
        {
            this.result = data.slice(offset, offset + strLength);
            this.offset = offset + strLength;
        }
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
            var resultStr : string;
            if (strLength > 32767)
            {
                var strLength = strLength - 32768;
                var bytes = [] : string[];

                for (var j = 0; j < strLength; j += 2)
                {
                    var code = data.charCodeAt(offset);
                    bytes.push(String.fromCharCode(code & 0x00ff));
                    if (j != strLength - 1)
                    {
                        bytes.push(String.fromCharCode(code >>> 8));
                    }
                    offset++;
                }
                resultStr = bytes.join('');
            }
            else
            {
                resultStr = data.slice(offset, offset + strLength);
                offset = offset + strLength;
            }
            this.result.push(resultStr);
        }
        this.offset = offset;
    }
}

class LoadedNumberListResult
{
    var result : number[];
    var offset : int;

    function constructor(data : string, offset : int)
    {
        var resultLength = Binary.load32bitNumber(data, offset);
        offset += 2;
        var result = [] : number[];
        while (result.length < resultLength)
        {
            var tag = data.charCodeAt(offset++);
            if (tag & 0x8000) // zebra
            {
                var length = Math.min(resultLength - result.length, 15);
                for (var i = 0; i < length; i++)
                {
                    if ((tag >>> i) & 0x1)
                    {
                        result.push(Binary.load32bitNumber(data, offset));
                        offset += 2;
                    }
                    else
                    {
                        result.push(0);
                    }
                }
            }
            else if (tag & 0x4000) // non-zero
            {
                var length = (tag & 0x3fff) + 1;
                for (var i = 0; i < length; i++)
                {
                    result.push(Binary.load32bitNumber(data, offset));
                    offset += 2;
                }
            }
            else // zero
            {
                var length = tag + 1;
                for (var i = 0; i < length; i++)
                {
                    result.push(0);
                }
            }
        }
        this.result = result;
        this.offset = offset;
    }
}
