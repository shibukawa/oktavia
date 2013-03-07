import "oktavia-search.jsx";
import "stemmer/spanish-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new SpanishStemmer);
    }
}
