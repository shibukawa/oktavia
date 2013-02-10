import "snowball-stemmer.jsx";

class Among
{
    var s_size : int;           /* search string */
    var s : string;             /* search string */
    var substring_i : int;      /* index to longest matching substring */
    var result : int;           /* result of the lookup */
    var instance : Nullable.<SnowballStemmer> ;
                                /* object to invoke method on. It is a SnowballStemmer */
    var method : Nullable.<(SnowballStemmer) -> boolean>;
                                /* method to use if substring matches */

    function constructor (s : string, substring_i : int, result : int,
                          method : Nullable.<(SnowballStemmer) -> boolean>,
                          instance : Nullable.<SnowballStemmer>)
    {
        this.s_size = s.length;
        this.s = s;
        this.substring_i = substring_i;
	this.result = result;
        this.method = method;
	this.instance = instance;
    }
}
