import "oktavia-search.jsx";
import "stemmer/turkish-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new TurkishStemmer);
    }
}
