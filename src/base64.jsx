// JSX
import "js.jsx";


class Base64 {
    static var _indexToChar =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    static var _charToIndex = {
                A:  0, B:  1, C:  2, D:  3, E:  4, F:  5, G:  6, H:  7, I:  8, J:  9,
                K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
                U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
                a: 26, b: 27, c: 28, d: 29, e: 30, f: 31, g: 32, h: 33, i: 34, j: 35,
                k: 36, l: 37, m: 38, n: 39, o: 40, p: 41, q: 42, r: 43, s: 44, t: 45,
                u: 46, v: 47, w: 48, x: 49, y: 50, z: 51,
                0: 52, 1: 53, 2: 54, 3: 55, 4: 56, 5: 57, 6: 58, 7: 59, 8: 60, 9: 61,
                "+": 62, "-": 62, // URLSafe64 chars
                "/": 63, "_": 63, // URLSafe64 chars
                "=": 0            // padding
            }:Map.<int>;

    static function btoa(binary:string,
                         normalize:boolean = false):string {
        var window = js.global["window"];
        var self = js.global["self"];
        var btoa : Nullable.<(string)->string> = null;
        if (window && window['btoa']) {
            window['btoa'] as __noconvert__ (string)->string;
        }
        else if (self && self['btoa']) {
            self['btoa'] as __noconvert__ (string)->string;
        }
        if (btoa) {
            if (!normalize) {
                try {
                    return btoa(binary); // Base64 to Base64String
                } catch (o_o:Error) {
                    // maybe. xhr response data has non ascii values.
                }
            }
            return btoa( Base64.normalize(binary, 0xff) );
        }
        return Base64.encode( Base64.toArray(binary, 0xff) );
    }
    static function atob(base64:string):string {
        var window = js.global["window"];
        var self = js.global["self"];
        var atob : Nullable.<(string)->string> = null;

        if (window && window['atob']) {
            atob = window['atob'] as __noconvert__ (string)->string;
        }
        else if (self && self['atob']) {
             atob = self['atob'] as __noconvert__ (string)->string;
        }
        if (atob) {
            try {
                return atob(base64);
            } catch (o_o:Error) {
                // maybe. broken base64 data
            }
        }
        return Base64.fromArray( Base64.decode(base64) );
    }
    static function encode(ary:Array.<int>,
                           safe:boolean = false):string {
        var rv = []:Array.<string>;
        var c = 0;
        var i = -1;
        var iz = ary.length;
        var pad = [0, 2, 1][iz % 3];
        var chars = Base64._indexToChar;

        // 24bit binary string -> 32bit base64 binary string
        --iz;
        while (i < iz) {
            c =  ((ary[++i] & 0xff) << 16) |
                 ((ary[++i] & 0xff) <<  8) |
                  (ary[++i] & 0xff); // 24bit

            rv.push(chars[(c >> 18) & 0x3f],
                    chars[(c >> 12) & 0x3f],
                    chars[(c >>  6) & 0x3f],
                    chars[ c        & 0x3f]);
        }
        pad > 1 && (rv[rv.length - 2] = "=");
        pad > 0 && (rv[rv.length - 1] = "=");
        if (safe) {
            return rv.join("").replace(/\=+$/g, "").replace(/\+/g, "-").
                                                    replace(/\//g, "_");
        }
        return rv.join("");
    }
    static function decode(str:string):Array.<int> {
        var rv = []:Array.<int>;
        var c = 0;
        var i = 0;
        var ary = str.split("");
        var iz = str.length - 1;
        var codes = Base64._charToIndex;

        // 32bit base64 binary string -> 24bit binary string
        while (i < iz) {                // 00000000|00000000|00000000 (24bit)
            c = (codes[ary[i++]] << 18) // 111111  |        |
              | (codes[ary[i++]] << 12) //       11|1111    |
              | (codes[ary[i++]] <<  6) //         |    1111|11
              |  codes[ary[i++]];       //         |        |  111111
                                        //    v        v        v
            rv.push((c >> 16) & 0xff,   // --------
                    (c >>  8) & 0xff,   //          --------
                     c        & 0xff);  //                   --------
        }
        rv.length -= [0, 0, 2, 1][str.replace(/\=+$/, "").length % 4]; // cut tail

        return rv;
    }

    static function toArray(binary:string,
                            filter:int = 0xffff):Array.<int> {
        var i = 0, iz = binary.length, rv = new Array.<int>(iz);

        for (; i < iz; ++i) {
            rv[i] = binary.charCodeAt(i) & filter;
        }
        return rv;
    }
    static function fromArray(ary:Array.<int>):string {
        var rv = []:Array.<string>, i = 0, iz = ary.length, bulkSize = 32000;

        // Avoid String.fromCharCode.apply(null, BigArray) exception
        if (iz < bulkSize) {
          //return String.fromCharCode.apply(null, ary);
            return js.invoke(String, "fromCharCode", ary as __noconvert__ Array.<variant>) as string;
        }
        for (; i < iz; i += bulkSize) {
          //rv.push( String.fromCharCode.apply(null, ary.slice(i, i + bulkSize)) );
            rv.push(
                     js.invoke(String, "fromCharCode",
                               ary.slice(i, i + bulkSize) as __noconvert__ Array.<variant>) as string );

        }
        return rv.join("");
    }
    static function normalize(binary:string,
                              filter:int = 0xffff):string {
        return Base64.fromArray( Base64.toArray(binary, filter) );
    }
}
