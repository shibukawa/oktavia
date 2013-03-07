import "oktavia-search.jsx";
import "stemmer/romanian-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new RomanianStemmer);
    }
}
