import "oktavia-search.jsx";
import "stemmer/german-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new GermanStemmer);
    }
}
