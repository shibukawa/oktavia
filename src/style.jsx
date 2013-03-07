import "sax.jsx";

class _HTMLHandler extends SAXHandler
{
    var text : string[];
    var styles : Map.<string[]>;
    var escape : boolean;

    static function escapeHTML (str : string) : string
    {
        return str.replace(/\n/g, "<br/>").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function constructor (styles : Map.<string[]>, escape : boolean)
    {
        this.text = [] : string[];
        this.escape = escape;
        this.styles = styles;
    }

    override function onopentag (tagname : string, attributes : Map.<string>) : void
    {
        this.text.push(this.styles[tagname][0]);
    }

    override function onclosetag (tagname : string) : void
    {
        this.text.push(this.styles[tagname][1]);
    }

    override function ontext (text : string) : void
    {
        if (this.escape)
        {
            this.text.push(_HTMLHandler.escapeHTML(text));
        }
        else
        {
            this.text.push(text);
        }
    }

    function result () : string
    {
        return this.text.join('');
    }
}

class Style
{
    var styles : Map.<string[]>;
    var escapeHTML : boolean;

    static const console = {
      'title'   : ['\x1B[32m\x1b[4m', '\x1B[39m\x1b[0m'],
      'url'     : ['\x1B[34m', '\x1B[39m'],
      'hit'     : ['\x1B[4m', '\x1B[0m'],
      'del'     : ['\x1B[9m', '\x1B[0m'],
      'summary' : ['\x1B[90m', '\x1B[39m']
    };

    static const html = {
      'title'   : ['<span class="title">', '</span>'],
      'url'     : ['<span class="url">', '</span>'],
      'hit'     : ['<span class="hit">', '</span>'],
      'del'     : ['<del>', '</del>'],
      'summary' : ['<span class="reuslt">', '</span>']
    };

    static const ignore = {
      'tilte'   : ['', ''],
      'url'     : ['', ''],
      'hit'     : ['', ''],
      'del'     : ['', ''],
      'summary' : ['', '']
    };

    function constructor (mode : string)
    {
        switch (mode)
        {
        case 'console':
            this.styles = Style.console;
            break;
        case 'html':
            this.styles = Style.html;
            break;
        case 'ignore':
            this.styles = Style.ignore;
            break;
        default:
            this.styles = Style.ignore;
            break;
        }
        this.escapeHTML = (mode == 'html');
    }

    function convert (source : string) : string
    {
        var handler = new _HTMLHandler(this.styles, this.escapeHTML);
        var parser = new SAXParser(handler);
        parser.parse(source);
        return handler.result();
    }
}
