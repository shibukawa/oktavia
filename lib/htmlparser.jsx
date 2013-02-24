import "console.jsx";
import "js/nodejs.jsx";
import "oktavia.jsx";
import "metadata.jsx";
import "sax.jsx";
import "stemmer/stemmer.jsx";

class _HTMLHandler extends SAXHandler
{
    var startParse : boolean;
    var startTag : string;
    var stack : string [];
    var oktavia : Oktavia;
    var section : Section;
    var tag : Block;
    var tagfilter : string[];
    var idfilter : string[];
    var filepath : string;
    var unit : int;
    var currentHeading : int;
    var currentLink : string;
    var sectionCount : int;
    var inCode : boolean;

    function constructor (oktavia : Oktavia, filepath : string, unit : int, tagfilter : string[], idfilter : string[])
    {
        super();
        this.startParse = false;
        this.stack = [] : string[];
        this.oktavia = oktavia;
        this.section = this.oktavia.getSection('section');
        this.tag = this.oktavia.getBlock('tag');
        this.unit = unit;
        this.tagfilter = tagfilter;
        this.idfilter = idfilter;
        this.filepath = filepath;
    }

    override function onready () : void
    {
        this.currentHeading = 0;
        this.currentLink = this.filepath;
        this.inCode = false;
    }

    override function onopentag (tagname : string, attributes : Map.<string>) : void
    {
        var headingId = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (this.startParse)
        {
            this.stack.push(tagname);
            switch (tagname)
            {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                this.currentHeading = headingId.indexOf(tagname);
                if (this.currentHeading < this.unit)
                {
                    this.section.setTail(this.currentLink);
                }
                this.oktavia.addEndOfBlock();
                this.tag.startBlock(tagname);
                break;
            case 'pre':
                this.tag.startBlock('pre');
                this.oktavia.addEndOfBlock();
                this.inCode = true;
                break;
            case 'p':
            case 'div':
            case 'blockquote':
                this.oktavia.addEndOfBlock();
                break;
            case 'a':
                if (attributes['name'] && this.currentHeading < this.unit)
                {
                    this.currentLink = this.filepath + attributes['name'];
                }
                break;
            }
        }
        else
        {
            if (this.tagfilter.indexOf(tagname) != -1)
            {
                this.startParse = true;
                this.startTag = tagname;
                this.stack.push(tagname);
            }
            else if (attributes['id'] && this.idfilter.indexOf('#' + attributes['id']) != -1)
            {
                this.startParse = true;
                this.startTag = tagname;
                this.stack.push(tagname);
            }
        }
    }
    override function onclosetag (tagname : string) : void
    {
        if (this.startParse)
        {
            switch (tagname)
            {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                this.tag.endBlock();
                break;
            case 'pre':
                this.inCode = false;
                this.tag.endBlock();
                break;
            }
            if (this.stack.length == 0)
            {
                this.startParse = false;
            }
        }
    }
    override function ontext (text : string) : void
    {
        if (this.startParse)
        {
            this.oktavia.addWord(text, !this.inCode);
        }
    }
    override function onend () : void
    {
        this.section.setTail(this.currentLink);
    }
}

class HTMLParser
{
    var oktavia : Oktavia;
    var unit : int;
    var root : string;
    var prefix : string;
    var tagfilter : string[];
    var idfilter : string[];

    function constructor (unit : int, root : string, prefix : string, tags : string[], ids : string[], stemmer : Nullable.<Stemmer>)
    {
        this.unit = unit;
        this.root = root;
        this.prefix = prefix;
        this.tagfilter = tags;
        this.idfilter = ids;

        this.oktavia = new Oktavia();
        this.oktavia.addSection('section');
        this.oktavia.addBlock('tag');
        if (stemmer)
        {
            this.oktavia.setStemmer(stemmer);
        }
    }

    function parse (filepath : string) : void
    {
        var relative = this.prefix + node.path.relative(this.root, filepath);
        console.log('reading: ' + relative);
        var lines = node.fs.readFileSync(filepath, 'utf8');
        var handler = new _HTMLHandler(this.oktavia, relative, this.unit, this.tagfilter, this.idfilter);
        var parser = new SAXParser(handler);
        parser.parse(lines);
    }

    function dump (filepath : string, sizeOptimize : boolean) : void
    {
        console.log('building...');
        this.oktavia.build(true);
        console.log('writinging: ' + filepath);
        var dump = this.oktavia.dump(true, sizeOptimize);
        node.fs.writeFileSync(filepath, dump, "utf16le");
    }
}
