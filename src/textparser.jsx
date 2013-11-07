import "js/nodejs.jsx";
import "console.jsx";
import "stemmer.jsx";
import "./oktavia.jsx";
import "./metadata.jsx";

class TextParser
{
    var oktavia : Oktavia;
    var unit : string;
    var root : string;
    var section : Section;
    var splitter : Splitter;

    function constructor (unit : string, root : string, stemmer : Nullable.<Stemmer>)
    {
        this.oktavia = new Oktavia();
        this.unit = unit;
        this.root = root;
        if (stemmer)
        {
            this.oktavia.setStemmer(stemmer);
        }
        if (unit == 'file')
        {
            this.section = this.oktavia.addSection('section');
        }
        else
        {
            this.splitter = this.oktavia.addSplitter(unit);
        }
    }

    function parse (filepath : string) : void
    {
        var relative = node.path.relative(this.root, filepath);
        var lines = node.fs.readFileSync(filepath, 'utf8').split('\n');
        console.log('reading: ' + relative);
        var empty = false;
        for (var i = 0; i < lines.length; i++)
        {
            var text = lines[i];
            if (text)
            {
                if (this.unit == 'block')
                {
                    if (empty)
                    {
                        this.splitter.split();
                        this.oktavia.addEndOfBlock();
                        empty = false;
                    }
                    this.oktavia.addWord(text);
                }
                else if (this.unit == 'line')
                {
                    this.oktavia.addWord(text);
                    this.splitter.split();
                    this.oktavia.addEndOfBlock();
                }
                else
                {
                    this.oktavia.addWord(text);
                }
            }
            else
            {
                empty = true;
            }
        }
        if (this.unit == 'file')
        {
            this.section.setTail(relative);
        }
    }

    function dump (cacheDensity : int, verbose : boolean) : string
    {
        console.log('\nbuilding...\n');
        this.oktavia.build(cacheDensity);
        return this.oktavia.dump(verbose);
    }
}
