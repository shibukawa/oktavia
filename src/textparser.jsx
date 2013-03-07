import "js/nodejs.jsx";
import "oktavia.jsx";
import "stemmer/stemmer.jsx";


class TextParser
{
    var oktavia : Oktavia;
    var unit : string;
    var root : string;
    var stemmer : Nullable.<Stemmer>;

    function constructor (unit : string, root : string, stemmer : Stemmer)
    {
        this.oktavia = new Oktavia();
        this.unit = unit;
        this.root = root;
        this.stemmer = stemmer;
    }

    function parse (filepath : string) : void
    {
        var lines = node.fs.readFileSync(filepath, 'utf8');
    }
}
