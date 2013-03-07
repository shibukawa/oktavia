import "oktavia-search.jsx";
import "stemmer/italian-stemmer.jsx";

class _Main
{
    static function main(args : string[]) : void
    {
        OktaviaSearch.setStemmer(new ItalianStemmer);
    }
}
