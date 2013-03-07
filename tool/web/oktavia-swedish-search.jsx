import "oktavia-search.jsx";
import "stemmer/swedish-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new SwedishStemmer);
    }
}
