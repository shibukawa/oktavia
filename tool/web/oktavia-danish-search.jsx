import "oktavia-search.jsx";
import "stemmer/danish-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new DanishStemmer);
    }
}
