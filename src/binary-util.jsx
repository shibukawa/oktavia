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
        return Binary.dumpString(str, null);
    }

    static function dumpString (str : string, report : Nullable.<CompressionReport>) : string
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
            if (report)
            {
                report.add(length, Math.ceil(length / 2));
            }
        }
        else
        {
            var result = [Binary.dump16bitNumber(length), str];
            if (report)
            {
                report.add(length, length);
            }
        }
        return result.join('');
    }

    static function loadString (buffer : string, offset : int) : LoadedStringResult
    {
        return new LoadedStringResult(buffer, offset);
    }

    static function dumpStringList (strList : string[]) : string
    {
        return Binary.dumpStringList(strList, null);
    }

    static function dumpStringList (strList : string[], report : Nullable.<CompressionReport>) : string
    {
        var result = [Binary.dump32bitNumber(strList.length)];
        for (var i = 0; i < strList.length; i++)
        {
            result.push(Binary.dumpString(strList[i], report));
        }
        return result.join('');
    }

    static function loadStringList (buffer : string, offset : int) : LoadedStringListResult
    {
        return new LoadedStringListResult(buffer, offset);
    }

    static function dumpStringListMap (strMap : Map.<string[]>) : string
    {
        return Binary.dumpStringListMap(strMap, null);
    }

    static function dumpStringListMap (strMap : Map.<string[]>, report : Nullable.<CompressionReport>) : string
    {
        var result = [] : string[];
        var counter = 0;
        for (var key in strMap)
        {
            result.push(Binary.dumpString(key, report));
            result.push(Binary.dumpStringList(strMap[key], report));
            counter++;
        }
        return Binary.dump32bitNumber(counter) + result.join('');
    }

    static function loadStringListMap (buffer : string, offset : int) : LoadedStringListMapResult
    {
        return new LoadedStringListMapResult(buffer, offset);
    }

    static function dump32bitNumberList (array : number[]) : string
    {
        return Binary.dump32bitNumberList(array, null);
    }

    static function dump32bitNumberList (array : number[], report : Nullable.<CompressionReport>) : string
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
        var resultString = result.join('');
        if (report)
        {
            report.add(array.length * 2 + 2, resultString.length);
        }
        return resultString;
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
                length -= 16384;
            }
            else
            {
                blockLength = length;
                length = 0;
            }
            result.push(Binary.dump16bitNumber((blockLength - 1) + 0x4000));
            for (var i = offset; i < offset + blockLength; i++)
            {
                result.push(Binary.dump32bitNumber(array[i]));
            }
            offset += blockLength;
        }
        return result.join('');
    }

    static function _createZebraCode (array : number[], offset : int) : string
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

    /* These base64 functions are based on http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt
     * original license:
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    static const _base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    static function base64encode (str : string) : string
    {
        var out = [] : string[];
        var source = [] : int[];
        for (var i = 0; i < str.length; i++)
        {
            var code = str.charCodeAt(i);
            source.push(code & 0x00ff, code >>> 8);
        }
        var len = str.length * 2;
        var i = 0;
        while (i < len)
        {
	    var c1 = source[i++] & 0xff;
	    if (i == len)
	    {
	        out.push(Binary._base64EncodeChars.charAt(c1 >> 2));
	        out.push(Binary._base64EncodeChars.charAt((c1 & 0x3) << 4));
	        out.push("==");
	        break;
	    }
	    var c2 = source[i++];
	    if (i == len)
	    {
	        out.push(Binary._base64EncodeChars.charAt(c1 >> 2));
	        out.push(Binary._base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4)));
	        out.push(Binary._base64EncodeChars.charAt((c2 & 0xF) << 2));
	        out.push("=");
	        break;
	    }
	    var c3 = source[i++];
	    out.push(Binary._base64EncodeChars.charAt(c1 >> 2));
	    out.push(Binary._base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4)));
	    out.push(Binary._base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6)));
	    out.push(Binary._base64EncodeChars.charAt(c3 & 0x3F));
        }
        return out.join('');
    }

    static const _base64DecodeChars = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

    static function _mergeCharCode (source : int[]) : string
    {
        var result = [] : string[];
        for (var i = 0; i < source.length; i += 2)
        {
            result.push(String.fromCharCode(source[i] + (source[i + 1] << 8)));
        }
        return result.join('');
    }

    static function base64decode (str : string) : string
    {
        var len = str.length;
        var i = 0;
        var out = [] : int[];

        while (i < len)
        {
            var c1, c2, c3, c4 : int;

	    /* c1 */
	    do {
	        c1 = Binary._base64DecodeChars[str.charCodeAt(i++) & 0xff];
	    } while(i < len && c1 == -1);
	    if (c1 == -1)
            {
	        break;
            }
	    /* c2 */
	    do {
	        c2 = Binary._base64DecodeChars[str.charCodeAt(i++) & 0xff];
	    } while(i < len && c2 == -1);
	    if (c2 == -1)
            {
	        break;
            }
	    out.push((c1 << 2) | ((c2 & 0x30) >> 4));
	    /* c3 */
	    do {
	        c3 = str.charCodeAt(i++) & 0xff;
	        if (c3 == 61)
                {
                    return Binary._mergeCharCode(out);
                }
	        c3 = Binary._base64DecodeChars[c3];
	    } while(i < len && c3 == -1);
	    if (c3 == -1)
            {
                break;
            }
	    out.push(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

	    /* c4 */
	    do {
	        c4 = str.charCodeAt(i++) & 0xff;
	        if (c4 == 61)
                {
                    return Binary._mergeCharCode(out);
                }
	        c4 = Binary._base64DecodeChars[c4];
	    } while(i < len && c4 == -1);
	    if (c4 == -1)
            {
	        break;
            }
	    out.push(((c3 & 0x03) << 6) | c4);
        }
        return Binary._mergeCharCode(out);
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

        var length = Binary.load32bitNumber(data, offset);
        offset += 2;
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

class LoadedStringListMapResult
{
    var result : Map.<string[]>;
    var offset : int;

    function constructor (data : string, offset : int)
    {
        this.result = {} : Map.<string[]>;

        var length = Binary.load32bitNumber(data, offset);
        offset += 2;
        for (var i = 0; i < length; i++)
        {
            var keyResult = Binary.loadString(data, offset);
            var valueResult = Binary.loadStringList(data, keyResult.offset);
            this.result[keyResult.result] = valueResult.result;
            offset = valueResult.offset;
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
        var originalOffset = offset;
        offset += 2;
        var result = [] : number[];
        while (result.length < resultLength)
        {
            var tag = data.charCodeAt(offset++);
            if ((tag >>> 15) == 1) // zebra
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
            else if ((tag >>> 14) == 1) // non-zero
            {
                var length = tag - 0x4000 + 1;
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

class CompressionReport
{
    var source : int;
    var result : int;
    function constructor ()
    {
        this.source = 0;
        this.result = 0;
    }

    function add (source : int, result : int) : void
    {
        this.source += source;
        this.result += result;
    }

    function rate () : int
    {
        return Math.round(this.result * 100.0 / this.source);
    }
}
