import "oktavia-search.jsx";
import "stemmer/dutch-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new DutchStemmer);
    }
}
