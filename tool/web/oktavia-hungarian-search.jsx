import "oktavia-search.jsx";
import "stemmer/hungarian-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new HungarianStemmer);
    }
}
