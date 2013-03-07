import "oktavia-search.jsx";
import "stemmer/porter-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new PorterStemmer);
    }
}
