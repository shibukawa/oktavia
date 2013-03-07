import "oktavia-search.jsx";
import "stemmer/norwegian-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new NorwegianStemmer);
    }
}
