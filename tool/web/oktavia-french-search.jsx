import "oktavia-search.jsx";
import "stemmer/french-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new FrenchStemmer);
    }
}
