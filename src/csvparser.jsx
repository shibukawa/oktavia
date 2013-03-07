import "oktavia.jsx";
import "stemmer/stemmer.jsx";


class CSVParser
{
    var oktavia : Oktavia;
    var root : string;
    var stemmer : Nullable.<Stemmer>;

    function constructor (root : string, stemmer : Stemmer)
    {
        this.oktavia = new Oktavia();
        this.root = root;
        this.stemmer = stemmer;
    }

    function parse (filepath : string) : void
    {
        log (filepath);
    }
}
