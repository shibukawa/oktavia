import "oktavia-search.jsx";
import "stemmer/finnish-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new FinnishStemmer);
    }
}
