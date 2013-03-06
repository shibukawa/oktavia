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
    var filter : TagFilter;
    var filepath : string;
    var unit : int;
    var currentLink : string;
    var currentTitle : string;
    var lastId : string;
    var waitTitle : boolean;
    var sectionCount : int;
    var inCode : boolean;
    var addText : boolean;

    function constructor (oktavia : Oktavia, filepath : string, unit : int, filter : TagFilter)
    {
        super();
        this.startParse = false;
        this.stack = [] : string[];
        this.oktavia = oktavia;
        this.section = this.oktavia.getSection('section');
        this.tag = this.oktavia.getBlock('tag');
        this.unit = unit;
        this.filter = filter;
        this.filepath = filepath;
        this.currentTitle = '';
        this.lastId = '';
        this.waitTitle = false;
        this.addText = false;
    }

    override function onready () : void
    {
        this.currentLink = this.filepath;
        this.inCode = false;
    }

    override function onopentag (tagname : string, attributes : Map.<string>) : void
    {
        var headingId = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (this.startParse)
        {
            this.stack.push(tagname);
            if ('id' in attributes)
            {
                this.lastId = attributes['id'];
            }
            switch (tagname)
            {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                if (headingId.indexOf(tagname) < this.unit)
                {
                    if (this.oktavia.contentSize() > 0)
                    {
                        this.section.setTail(this.currentTitle + Oktavia.eob + this.currentLink);
                    }
                    this.currentLink = this.filepath + '#' + this.lastId;
                    this.currentTitle = '';
                    this.waitTitle = true;
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
            }
        }
        else
        {
            if (this.filter.match(tagname, attributes))
            {
                this.startParse = true;
                this.startTag = tagname;
                this.stack.push(tagname);
            }
        }
        if (tagname == 'title')
        {
            this.waitTitle = true;
            this.currentTitle = '';
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
                if (this.addText)
                {
                    this.oktavia.addWord('\n');
                    this.addText = false;
                }
                this.waitTitle = false;
                break;
            case 'pre':
                this.inCode = false;
                this.tag.endBlock();
                if (this.addText)
                {
                    this.oktavia.addWord('\n');
                    this.addText = false;
                }
                break;
            case 'div':
            case 'p':
            case 'blockquote':
                if (this.addText)
                {
                    this.oktavia.addWord('\n');
                    this.addText = false;
                }
                break;
            }
            if (this.stack.length == 0)
            {
                this.startParse = false;
            }
        }
        if (tagname == 'title')
        {
            this.waitTitle = false;
        }
    }

    override function ontext (text : string) : void
    {
        if (this.startParse)
        {
            this.oktavia.addWord(text, !this.inCode);
            this.addText = true;
        }
        if (this.waitTitle)
        {
            this.currentTitle += text;
        }
    }

    override function onend () : void
    {
        this.section.setTail(this.currentTitle + Oktavia.eob + this.currentLink);
    }
}

class TagFilter
{
    var tags : string[];
    var ids : string[];
    var classes : string[];
    var tagAndClasses : string[];

    function constructor (filters : string[])
    {
        this.tags = [] : string[];
        this.ids = [] : string[];
        this.classes = [] : string[];
        this.tagAndClasses = [] : string[];
        
        for (var i = 0; i < filters.length; i++)
        {
            var filter = filters[i];
            switch (filter.charAt(0))
            {
            case '#':
                this.ids.push(filter.slice(1));
                break;
            case '.':
                this.classes.push(filter.slice(1));
                break;
            default:
                if (filter.indexOf('.') != -1)
                {
                    this.tags.push(filter);
                }
                else
                {
                    this.tagAndClasses.push(filter);
                }
            }
        }
    }

    function match (tagname : string, attributes : Map.<string>) : boolean
    {
        var result = false;
        if (this.tags.indexOf(tagname) != -1)
        {
            result = true;
        }
        else if (attributes['id'] && this.ids.indexOf(attributes['id']) != -1)
        {
            result = true;
        }
        else if (attributes['class'])
        {
            var classname = attributes['class'];
            if (this.classes.indexOf(classname) != -1 ||
                this.tagAndClasses.indexOf(tagname + '.' + classname) != -1)
            {
                result = true;
            }
        }
        return result;
    }
}

class HTMLParser
{
    var oktavia : Oktavia;
    var unit : int;
    var root : string;
    var prefix : string;
    var filter : TagFilter;

    function constructor (unit : int, root : string, prefix : string, filter : string[], stemmer : Nullable.<Stemmer>)
    {
        this.unit = unit;
        this.root = root;
        this.prefix = prefix;
        this.filter = new TagFilter(filter);
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
        var handler = new _HTMLHandler(this.oktavia, relative, this.unit, this.filter);
        var parser = new SAXParser(handler);
        parser.parse(lines);
    }

    function dump (cacheDensity : int, verbose : boolean) : string
    {
        console.log('\nbuilding...\n');
        this.oktavia.build(cacheDensity, verbose);
        return this.oktavia.dump(verbose);
    }
}
