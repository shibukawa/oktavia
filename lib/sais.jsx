/* Original source code:
 * G. Nong, S. Zhang and W. H. Chan, Two Efficient Algorithms for Linear Time Suffix Array Construction, IEEE Transactions on Computers, To Appear
 * http://www.cs.sysu.edu.cn/nong/index.files/Two%20Efficient%20Algorithms%20for%20Linear%20Suffix%20Array%20Construction.pdf
 */

import "bit-vector.jsx";

class OArray
{
    var offset : int;
    var array : int[];

    function constructor (array : int[])
    {
        this.array = array;
        this.offset = 0;
    }

    function constructor (array : int[], offset : int)
    {
        this.array = array;
        this.offset = offset;
    }

    function get (index : int) : int
    {
        return this.array[index + this.offset];
    }

    function set (index : int, value : int) : void
    {
        this.array[index + this.offset] = value;
    }

    function isS (index : int) : boolean
    {
        return this.array[index + this.offset] < this.array[index + this.offset + 1];
    }

    function compare (index1 : int, index2 : int) : boolean
    {
        return this.array[index1 + this.offset] == this.array[index2 + this.offset];
    }
}


class SAIS
{
    static function _isLMS (t : BitVector, i : int) : boolean
    {
        return i > 0 && t.get(i) && !t.get(i - 1);
    }

    // find the start or end of each bucket
    static function _getBuckets(s : OArray, bkt : int[], n : int, K : int, end : boolean) : void
    {
        var sum = 0;
        for (var i = 0; i <= K; i++)
        {
            bkt[i] = 0; // clear all buckets
        }
        for (var i = 0; i < n; i++)
        {
            bkt[s.get(i)]++; // compute the size of each bucket
        }
        for (var i = 0; i <= K; i++)
        {
            sum += bkt[i];
            bkt[i] = end ? sum : sum - bkt[i];
        }
    }

    // compute SAl
    static function _induceSAl(t : BitVector, SA : int[], s : OArray, bkt : int[], n : int, K : int, end : boolean) : void
    {
        SAIS._getBuckets(s, bkt, n, K, end); // find starts of buckets
        for (var i = 0; i < n; i++)
        {
            var j = SA[i] - 1;
            if (j >= 0 && !t.get(j))
            {
                SA[bkt[s.get(j)]++] = j;
            }
        }
   } 

    // compute SAs
    static function _induceSAs(t : BitVector, SA : int[], s : OArray, bkt : int[], n : int, K : int, end : boolean) : void
    {
        SAIS._getBuckets(s, bkt, n, K, end); // find ends of buckets
        for (var i = n - 1; i >= 0; i--)
        {
            var j = SA[i] - 1;
            if (j >=0 && t.get(j))
            {
                SA[--bkt[s.get(j)]] = j;
            }
        }
    }

    // find the suffix array SA of s[0..n-1] in {1..K}^n
    // require s[n-1]=0 (the sentinel!), n>=2
    // use a working space (excluding s and SA) of at most 2.25n+O(1) for a constant alphabet

    static function make(source : string) : int[]
    {
        var charCodes = [] : int[];
        charCodes.length = source.length;
        var maxCode = 0;
        for (var i = 0; i < source.length; i++)
        {
            var code = source.charCodeAt(i);
            charCodes[i] = code;
            maxCode = (code > maxCode) ? code : maxCode;
        }
        var SA = [] : int[];
        SA.length = source.length;
        var s = new OArray(charCodes);
        SAIS._make(s, SA, source.length, maxCode);
        return SA;
    }

    static function _make(s : OArray, SA : int[], n : int, K : int) : void
    {
        // Classify the type of each character
        var t = new BitVector();
        t.set(n - 2, false);
        t.set(n - 1, true); // the sentinel must be in s1, important!!!
        for (var i = n - 3; i >= 0; i--)
        {
            t.set(i, (s.isS(i) || (s.compare(i, i + 1) && t.get(i + 1))));
        }

        // stage 1: reduce the problem by at least 1/2
        // sort all the S-substrings
        var bkt = [] : int[];
        bkt.length = K + 1;
        SAIS._getBuckets(s, bkt, n, K, true); // find ends of buckets
        for (var i = 0; i < n; i++)
        {
            SA[i] = -1;
        }
        for (var i = 1; i < n; i++)
        {
            if (SAIS._isLMS(t, i))
            {
                SA[--bkt[s.get(i)]] = i;
            }
        }
        SAIS._induceSAl(t, SA, s, bkt, n, K, false);
        SAIS._induceSAs(t, SA, s, bkt, n, K, true);
        // compact all the sorted substrings into the first n1 items of SA
        // 2*n1 must be not larger than n (proveable)
        var n1 = 0;
        for (var i = 0; i < n; i++)
        {
            if (SAIS._isLMS(t, SA[i]))
            {
                SA[n1++] = SA[i];
            }
        }

        // find the lexicographic names of all substrings
        for (var i = n1; i < n; i++)
        {
            SA[i]=-1; // init the name array buffer
        }
        var name = 0;
        var prev = -1;
        for (i = 0; i < n1; i++)
        {
            var pos = SA[i];
            var diff = false;
            for (var d = 0; d < n; d++)
            {
                if (prev == -1 || !s.compare(pos + d, prev + d) || t.get(pos + d) != t.get(prev + d))
                {
                    diff = true;
                    break;
                }
                else if (d > 0 && (SAIS._isLMS(t, pos+d) || SAIS._isLMS(t, prev + d)))
                {
                    break;
                }
            }
            if (diff)
            {
                name++;
                prev = pos;
            }
            pos = (pos % 2 == 0) ? pos / 2 : (pos - 1) / 2;
            SA[n1 + pos] = name - 1;
        }
        for (var i = n - 1, j = n - 1; i >= n1; i--)
        {
            if (SA[i] >= 0)
            {
                SA[j--] = SA[i];
            }
        }

        // stage 2: solve the reduced problem
        // recurse if names are not yet unique
        var SA1 = SA;
        var s1 = new OArray(SA, n - n1);

        if (name < n1)
        {
            SAIS._make(s1, SA1, n1, name - 1);
        }
        else
        {
            // generate the suffix array of s1 directly
            for (i = 0; i < n1; i++)
            {
                SA1[s1.get(i)] = i;
            }
        }

        // stage 3: induce the result for the original problem

        bkt = [] : int[];
        bkt.length = K + 1;
        // put all left-most S characters into their buckets
        SAIS._getBuckets(s, bkt, n, K, true); // find ends of buckets
        for (i = 1, j = 0; i < n; i++)
        {
            if (SAIS._isLMS(t, i))
            {
                s1.set(j++, i); // get p1
            }
        }
        for (i = 0; i < n1; i++)
        {
            SA1[i] = s1.get(SA1[i]); // get index in s
        }
        for (i = n1; i < n; i++)
        {
            SA[i] = -1; // init SA[n1..n-1]
        }
        for (i = n1 - 1; i >= 0; i--)
        {
            j = SA[i];
            SA[i] = -1;
            SA[--bkt[s.get(j)]] = j;
        }
        SAIS._induceSAl(t, SA, s, bkt, n, K, false);
        SAIS._induceSAs(t, SA, s, bkt, n, K, true);
    }
}
