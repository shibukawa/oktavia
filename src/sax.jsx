// When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
// When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
// since that's the earliest that a buffer overrun could occur.  This way, checks are
// as rare as required, but as often as necessary to ensure never crossing this bound.
// Furthermore, buffers are only tested at most once per write(), so passing a very
// large string into write() might have undesirable effects, but this is manageable by
// the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
// edge case, result in creating at most one complete copy of the string passed in.
// Set to Infinity to have unlimited buffers.


class Tag
{
    var name : string;
    var attributes : Map.<string>;
    var isSelfClosing : boolean;
    function constructor (name : string)
    {
        this.name = name;
        this.attributes = {} : Map.<string>;
        this.isSelfClosing = false;
    }
}

class _Common
{
    static const buffers = [
        "comment", "sgmlDecl", "textNode", "tagName", "doctype",
        "procInstName", "procInstBody", "entity", "attribName",
        "attribValue", "cdata", "script"
    ];

    static const EVENTS = // for discoverability.
    [ "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "clo_State.CDATA",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];

    static const MAX_BUFFER_LENGTH = 64 * 1024;
}

class _State
{
    static const BEGIN                     = 1;
    static const TEXT                      = 2;  // general stuff
    static const TEXT_ENTITY               = 3;  // &amp and such.
    static const OPEN_WAKA                 = 4;  // <
    static const SGML_DECL                 = 5;  // <!BLARG
    static const SGML_DECL_QUOTED          = 6;  // <!BLARG foo "bar
    static const DOCTYPE                   = 7;  // <!DOCTYPE
    static const DOCTYPE_QUOTED            = 8;  // <!DOCTYPE "//blah
    static const DOCTYPE_DTD               = 9;  // <!DOCTYPE "//blah" [ ...
    static const DOCTYPE_DTD_QUOTED        = 10; // <!DOCTYPE "//blah" [ "foo
    static const COMMENT_STARTING          = 11; // <!-
    static const COMMENT                   = 12; // <!--
    static const COMMENT_ENDING            = 13; // <!-- blah -
    static const COMMENT_ENDED             = 14; // <!-- blah --
    static const CDATA                     = 15; // <![CDATA[ something
    static const CDATA_ENDING              = 16; // ]
    static const CDATA_ENDING_2            = 17; // ]]
    static const PROC_INST                 = 18; // <?hi
    static const PROC_INST_BODY            = 19; // <?hi there
    static const PROC_INST_ENDING          = 20; // <?hi "there" ?
    static const OPEN_TAG                  = 21; // <strong
    static const OPEN_TAG_SLASH            = 22; // <strong /
    static const ATTRIB                    = 23; // <a
    static const ATTRIB_NAME               = 24; // <a foo
    static const ATTRIB_NAME_SAW_WHITE     = 25; // <a foo _
    static const ATTRIB_VALUE              = 26; // <a foo=
    static const ATTRIB_VALUE_QUOTED       = 27; // <a foo="bar
    static const ATTRIB_VALUE_UNQUOTED     = 28; // <a foo=bar
    static const ATTRIB_VALUE_ENTITY_Q     = 29; // <foo bar="&quot;"
    static const ATTRIB_VALUE_ENTITY_U     = 30; // <foo bar=&quot;
    static const CLOSE_TAG                 = 31; // </a
    static const CLOSE_TAG_SAW_WHITE       = 32; // </a   >
    static const SCRIPT                    = 33; // <script> ...
    static const SCRIPT_ENDING             = 34; // <script> ... <
}


class SAXHandler
{
    var position : int;
    var column : int;
    var line : int;
    function constructor ()
    {
        this.position = 0;
        this.column = 0;
        this.line = 0;
    }
    function onerror (error : Error) : void
    {
    }
    function ontext (text : string) : void
    {
    }
    function ondoctype (doctype : string) : void
    {
    }
    function onprocessinginstruction (name : string, body : string) : void
    {
    }
    function onsgmldeclaration (sgmlDecl : string) : void
    {
    }
    function onopentag (tagname : string, attributes : Map.<string>) : void
    {
    }
    function onclosetag (tagname : string) : void
    {
    }
    function onattribute (name : string, value : string) : void
    {
    }
    function oncomment (comment : string) : void
    {
    }
    function onopencdata () : void
    {
    }
    function oncdata (cdata : string) : void
    {
    }
    function onclosecdata () : void
    {
    }
    function onend () : void
    {
    }
    function onready () : void
    {
    }
    function onscript (script : string) : void
    {
    }
}

class SAXParser
{
    var q : string;
    var c : string;
    var bufferCheckPosition : int;
    var looseCase : string;
    var tags = [] : Tag[];
    var closed : boolean;
    var closedRoot : boolean;
    var sawRoot : boolean;
    var tag : Nullable.<Tag>;
    var error : Nullable.<Error>;
    var handler : SAXHandler;
    var ENTITIES : Map.<string>;
    var strict : boolean;
    var tagName : string;
    var state : int;
    var line : int;
    var column : int;
    var position : int;
    var startTagPosition : int;
    var attribName : string;
    var attribValue : string;
    var script : string;
    var textNode : string;
    var attribList : string[][];
    var noscript : boolean;
    var cdata : string;
    var procInstBody : string;
    var procInstName : string;
    var doctype : string;
    var entity : string;
    var sgmlDecl : string;
    var comment : string;
    var preTags : int;

    function constructor(handler : SAXHandler)
    {
        this._init(handler, false);
    }

    function constructor(handler : SAXHandler, strict : boolean)
    {
        this._init(handler, strict);
    }

    function _init (handler : SAXHandler, strict : boolean) : void
    {
        this.handler = handler;
        this.clearBuffers();
        this.q = "";
        this.bufferCheckPosition = _Common.MAX_BUFFER_LENGTH;
        //this.opt = opt || {}
        //this.opt.lowercase = this.opt.lowercase || this.opt.lowercasetags
        this.looseCase = 'toLowerCase'; // this.opt.lowercase ? "toLowerCase" : "toUpperCase"
        this.tags = [] : Tag[];
        this.closed = this.closedRoot = this.sawRoot = false;
        this.tag = null;
        this.error = null;
        this.strict = strict;
        this.noscript = strict; //!!(strict || this.opt.noscript);
        this.state = _State.BEGIN;
        this.ENTITIES = _Entities.entity_list();
        this.attribList = [] : string[][];
        this.noscript = false;
        this.preTags = 0;

        this.handler.onready();
    }

    function set_noscript (flag : boolean) : void
    {
        this.noscript = flag;
    }

    function resume () : SAXParser
    {
        this.error = null;
        return this;
    }

    function close () : SAXParser
    {
        return this.parse('');
    }

    function parse (chunk : string) : SAXParser
    {
        var _ = new Char();
        if (this.error)
        {
            throw this.error;
        }
        if (this.closed)
        {
            return this.emiterror("Cannot write after close. Assign an onready handler.");
        }
        var i = 0, c = "";
        while (this.c = c = chunk.charAt(i++))
        {
            this.position++;
            if (c == "\n")
            {
                this.handler.line++;
                this.handler.column = 0;
            }
            else
            {
                this.handler.column++;
            }
            switch (this.state)
            {
            case _State.BEGIN:
                //log "BEGIN";
                if (c == "<")
                {
                    this.state = _State.OPEN_WAKA;
                    this.startTagPosition = this.position;
                }
                else if (_.not(_.whitespace, c))
                {
                    // have to process this as a text node.
                    // weird, but happens.
                    this.strictFail("Non-whitespace before first tag.");
                    this.textNode = c;
                    this.state = _State.TEXT;
                }
                continue;

            case _State.TEXT:
                //log "TEXT";
                if (this.sawRoot && !this.closedRoot)
                {
                    var starti = i - 1;
                    while (c && c != "<" && c != "&")
                    {
                        c = chunk.charAt(i++);
                        if (c)
                        {
                            this.position++;
                            if (c == "\n")
                            {
                                this.handler.line++;
                                this.handler.column = 0;
                            }
                            else
                            {
                                this.handler.column++;
                            }
                        }
                    }
                    this.textNode += chunk.substring(starti, i - 1);
                }
                if (c == "<")
                {
                    this.state = _State.OPEN_WAKA;
                    this.startTagPosition = this.position;
                }
                else
                {
                    if (_.not(_.whitespace, c) && (!this.sawRoot || this.closedRoot))
                        this.strictFail("Text data outside of root node.");
                    if (c == "&") this.state = _State.TEXT_ENTITY;
                    else this.textNode += c;
                }
                continue;

            case _State.SCRIPT:
                //log "SCRIPT";
                // only non-strict
                if (c == "<") {
                    this.state = _State.SCRIPT_ENDING;
                } else this.script += c;
                continue;

            case _State.SCRIPT_ENDING:
                //log "SCRIPT END";
                if (c == "/") {
                    this.state = _State.CLOSE_TAG;
                } else {
                    this.script += "<" + c;
                    this.state = _State.SCRIPT;
                }
                continue;

            case _State.OPEN_WAKA:
                //log "OPEN_WAKA";
                // either a /, ?, !, or text is coming next.
                if (c == "!") {
                    this.state = _State.SGML_DECL;
                    this.sgmlDecl = "";
                } else if (_.is(_.whitespace, c)) {
                    // wait for it...
                } else if (_.is(_.nameStart,c)) {
                    this.state = _State.OPEN_TAG;
                    this.tagName = c;
                } else if (c == "/") {
                    this.state = _State.CLOSE_TAG;
                    this.tagName = "";
                } else if (c == "?") {
                    this.state = _State.PROC_INST;
                    this.procInstName = this.procInstBody = "";
                } else {
                    this.strictFail("Unencoded <");
                    // if there was some whitespace, then add that in.
                    if (this.startTagPosition + 1 < this.position) {
                        var pad = this.position - this.startTagPosition;
                        for (var i = 0; i < pad; i++)
                        {
                            c = " " + c;
                        }
                    }
                    this.textNode += "<" + c;
                    this.state = _State.TEXT;
                }
                continue;

            case _State.SGML_DECL:
                //log "SGML_DECL";
                if ((this.sgmlDecl+c).toUpperCase() == _.CDATA) {
                    this.closetext_if_exist();
                    this.handler.onopencdata();
                    this.state = _State.CDATA;
                    this.sgmlDecl = "";
                    this.cdata = "";
                } else if (this.sgmlDecl+c == "--") {
                    this.state = _State.COMMENT;
                    this.comment = "";
                    this.sgmlDecl = "";
                } else if ((this.sgmlDecl+c).toUpperCase() == _.DOCTYPE) {
                    this.state = _State.DOCTYPE;
                    if (this.doctype || this.sawRoot)
                    {
                        this.strictFail("Inappropriately located doctype declaration");
                    }
                    this.doctype = "";
                    this.sgmlDecl = "";
                } else if (c == ">") {
                    this.closetext_if_exist();
                    this.handler.onsgmldeclaration(this.sgmlDecl);
                    this.sgmlDecl = "";
                    this.state = _State.TEXT;
                } else if (_.is(_.quote, c)) {
                    this.state = _State.SGML_DECL_QUOTED;
                    this.sgmlDecl += c;
                } else this.sgmlDecl += c;
                continue;

            case _State.SGML_DECL_QUOTED:
                //log "SGML_DECL_QUOTED";
                if (c == this.q) {
                    this.state = _State.SGML_DECL;
                    this.q = "";
                }
                this.sgmlDecl += c;
                continue;

            case _State.DOCTYPE:
                //log "DOCTYPE";
                if (c == ">") {
                    this.state = _State.TEXT;
                    this.closetext_if_exist();
                    this.handler.ondoctype(this.doctype.trim());
                } else {
                    this.doctype += c;
                    if (c == "[") this.state = _State.DOCTYPE_DTD;
                    else if (_.is(_.quote, c)) {
                      this.state = _State.DOCTYPE_QUOTED;
                      this.q = c;
                    }
                }
                continue;

            case _State.DOCTYPE_QUOTED:
                //log "DOCTYPE_QUOTED";
                this.doctype += c;
                if (c == this.q) {
                    this.q = "";
                    this.state = _State.DOCTYPE;
                }
                continue;

            case _State.DOCTYPE_DTD:
                //log "DOCTYPE_DTD";
                this.doctype += c;
                if (c == "]") this.state = _State.DOCTYPE;
                else if (_.is(_.quote,c)) {
                    this.state = _State.DOCTYPE_DTD_QUOTED;
                    this.q = c;
                }
                continue;

            case _State.DOCTYPE_DTD_QUOTED:
                //log "DOCTYPE_DTD_QUOTED";
                this.doctype += c;
                if (c == this.q) {
                    this.state = _State.DOCTYPE_DTD;
                    this.q = "";
                }
                continue;

            case _State.COMMENT:
                //log "COMMENT";
                if (c == "-") this.state = _State.COMMENT_ENDING;
                else this.comment += c;
                continue;

            case _State.COMMENT_ENDING:
                //log "COMMENT_ENDING";
                if (c == "-") {
                    this.state = _State.COMMENT_ENDED;
                    this.comment = this.textopts(this.comment);
                    if (this.comment)
                    {
                        this.closetext_if_exist();
                        this.handler.oncomment(this.comment.trim());
                    }
                    this.comment = "";
                } else {
                    this.comment += "-" + c;
                    this.state = _State.COMMENT;
                }
                continue;

            case _State.COMMENT_ENDED:
                //log "COMMENT_ENDED";
                if (c != ">") {
                    this.strictFail("Malformed comment");
                    // allow <!-- blah -- bloo --> in non-strict mode,
                    // which is a comment of " blah -- bloo "
                    this.comment += "--" + c;
                    this.state = _State.COMMENT;
                } else this.state = _State.TEXT;
                continue;

            case _State.CDATA:
                //log "CDATA";
                if (c == "]") this.state = _State.CDATA_ENDING;
                else this.cdata += c;
                continue;

            case _State.CDATA_ENDING:
                //log "CDATA_ENDING";
                if (c == "]") this.state = _State.CDATA_ENDING_2;
                else {
                    this.cdata += "]" + c;
                    this.state = _State.CDATA;
                }
                continue;

            case _State.CDATA_ENDING_2:
                //log "CDATA_ENDING 2";
                if (c == ">") {
                    if (this.cdata)
                    {
                        this.closetext_if_exist();
                    }
                    this.handler.oncdata(this.cdata);
                    this.handler.onclosecdata();
                    this.cdata = "";
                    this.state = _State.TEXT;
                } else if (c == "]") {
                    this.cdata += "]";
                } else {
                    this.cdata += "]]" + c;
                    this.state = _State.CDATA;
                }
                continue;

            case _State.PROC_INST:
                if (c == "?") this.state = _State.PROC_INST_ENDING;
                else if (_.is(_.whitespace, c)) this.state = _State.PROC_INST_BODY;
                else this.procInstName += c;
                continue;

            case _State.PROC_INST_BODY:
                if (!this.procInstBody && _.is(_.whitespace, c)) continue;
                else if (c == "?") this.state = _State.PROC_INST_ENDING;
                else this.procInstBody += c;
                continue;

            case _State.PROC_INST_ENDING:
                if (c == ">") {
                    this.closetext_if_exist();
                    this.handler.onprocessinginstruction(this.procInstName, this.procInstBody);
                    this.procInstName = this.procInstBody = "";
                    this.state = _State.TEXT;
                } else {
                    this.procInstBody += "?" + c;
                    this.state = _State.PROC_INST_BODY;
                }
                continue;

            case _State.OPEN_TAG:
                //log "OPEN TAG";
                if (_.is(_.nameBody, c)) this.tagName += c;
                else {
                    this.newTag();
                    if (c == ">") this.openTag();
                    else if (c == "/") this.state = _State.OPEN_TAG_SLASH;
                    else {
                        if (_.not(_.whitespace, c)) this.strictFail("Invalid character in tag name");
                        this.state = _State.ATTRIB;
                    }
                }
                continue;

            case _State.OPEN_TAG_SLASH:
                //log "OPEN TAG SLASH";
                if (c == ">") {
                    this.openTag(true);
                    this.closeTag();
                } else {
                    this.strictFail("Forward-slash in opening tag not followed by >");
                    this.state = _State.ATTRIB;
                }
                continue;

            case _State.ATTRIB:
                //log "ATTRIB";
                // haven't read the attribute name yet.
                if (_.is(_.whitespace, c)) continue;
                else if (c == ">") this.openTag();
                else if (c == "/") this.state = _State.OPEN_TAG_SLASH;
                else if (_.is(_.nameStart, c)) {
                    this.attribName = c;
                    this.attribValue = "";
                    this.state = _State.ATTRIB_NAME;
                } else this.strictFail("Invalid attribute name");
                continue;

            case _State.ATTRIB_NAME:
                //log "ATTRIB_NAME";
                if (c == "=") this.state = _State.ATTRIB_VALUE;
                else if (c == ">") {
                    this.strictFail("Attribute without value");
                    this.attribValue = this.attribName;
                    this.attrib();
                    this.openTag();
                }
                else if (_.is(_.whitespace, c)) this.state = _State.ATTRIB_NAME_SAW_WHITE;
                else if (_.is(_.nameBody, c)) this.attribName += c;
                else this.strictFail("Invalid attribute name");
                continue;

            case _State.ATTRIB_NAME_SAW_WHITE:
                if (c == "=") this.state = _State.ATTRIB_VALUE;
                else if (_.is(_.whitespace, c)) continue;
                else {
                    this.strictFail( "Attribute without value");
                    this.tag.attributes[this.attribName] = "";
                    this.attribValue = "";
                    this.closetext_if_exist();
                    this.handler.onattribute(this.attribName, "");
                    this.attribName = "";
                    if (c == ">") this.openTag();
                    else if (_.is(_.nameStart, c)) {
                        this.attribName = c;
                        this.state = _State.ATTRIB_NAME;
                    } else {
                        this.strictFail("Invalid attribute name");
                        this.state = _State.ATTRIB;
                    }
                }
                continue;

            case _State.ATTRIB_VALUE:
                if (_.is(_.whitespace, c)) continue;
                else if (_.is(_.quote, c)) {
                    this.q = c;
                    this.state = _State.ATTRIB_VALUE_QUOTED;
                } else {
                    this.strictFail("Unquoted attribute value");
                    this.state = _State.ATTRIB_VALUE_UNQUOTED;
                    this.attribValue = c;
                }
                continue;

            case _State.ATTRIB_VALUE_QUOTED:
                if (c != this.q) {
                    if (c == "&") this.state = _State.ATTRIB_VALUE_ENTITY_Q;
                    else this.attribValue += c;
                    continue;
                }
                this.attrib();
                this.q = "";
                this.state = _State.ATTRIB;
                continue;

            case _State.ATTRIB_VALUE_UNQUOTED:
                if (_.not(_.attribEnd,c)) {
                    if (c == "&") this.state = _State.ATTRIB_VALUE_ENTITY_U;
                    else this.attribValue += c;
                    continue;
                }
                this.attrib();
                if (c == ">") this.openTag();
                else this.state = _State.ATTRIB;
                continue;

            case _State.CLOSE_TAG:
                //log "CLOSE_TAG", c;
                if (!this.tagName)
                {
                    if (_.is(_.whitespace, c))
                    {
                        continue;
                    }
                    else if (_.not(_.nameStart, c))
                    {
                        if (this.script)
                        {
                            this.script += "</" + c;
                            this.state = _State.SCRIPT;
                        }
                        else
                        {
                            this.strictFail("Invalid tagname in closing tag.");
                        }
                    }
                    else
                    {
                        this.tagName = c;
                    }
                }
                else if (c == ">")
                {
                    this.closeTag();
                }
                else if (_.is(_.nameBody, c))
                {
                    this.tagName += c;
                }
                else if (this.script)
                {
                    this.script += "</" + this.tagName;
                    this.tagName = "";
                    this.state = _State.SCRIPT;
                }
                else
                {
                    if (_.not(_.whitespace, c))
                    {
                        this.strictFail("Invalid tagname in closing tag");
                    }
                    this.state = _State.CLOSE_TAG_SAW_WHITE;
                }
                continue;

            case _State.CLOSE_TAG_SAW_WHITE:
                if (_.is(_.whitespace, c)) continue;
                if (c == ">") this.closeTag();
                else this.strictFail("Invalid characters in closing tag");
                continue;

            case _State.TEXT_ENTITY:
                //log "TEXT_ENTITY";
                if (c == ";") {
                    this.textNode += this.parseEntity();
                    this.entity = "";
                    this.state = _State.TEXT;
                }
                else if (_.is(_.entity, c)) this.entity += c;
                else {
                    this.strictFail("Invalid character entity");
                    this.textNode += "&" + this.entity + c;
                    this.entity = "";
                    this.state = _State.TEXT;
                }
                continue;

            case _State.ATTRIB_VALUE_ENTITY_Q:
            case _State.ATTRIB_VALUE_ENTITY_U:
                var returnState;
                if (this.state == _State.ATTRIB_VALUE_ENTITY_Q)
                {
                    returnState = _State.ATTRIB_VALUE_QUOTED;
                }
                else
                {
                    returnState = _State.ATTRIB_VALUE_UNQUOTED;
                }
                if (c == ";") {
                    this.attribValue += this.parseEntity();
                    this.entity = "";
                    this.state = returnState;
                }
                else if (_.is(_.entity, c)) this.entity += c;
                else {
                    this.strictFail("Invalid character entity");
                    this.attribValue += "&" + this.entity + c;
                    this.entity = "";
                    this.state = returnState;
                }
                continue;

            default:
                throw new Error("Unknown state: " + (this.state as string));
            }
        }
        this.end();
        return this;
    }

    function clearBuffers () : void
    {
        this.comment = '';
        this.sgmlDecl = '';
        this.textNode = '';
        this.tagName = '';
        this.doctype = '';
        this.procInstName = '';
        this.procInstBody = '';
        this.entity = '';
        this.attribName = '';
        this.attribValue = '';
        this.cdata = '';
        this.script = '';
    }

    function closetext_if_exist() : void
    {
        if (this.textNode != '')
        {
            this.closetext();
        }
    }

    function closetext () : void
    {
        if (this.preTags == 0)
        {
            var text = this.textopts(this.textNode);
            if (text)
            {
                this.handler.ontext(text);
            }
        }
        else if (this.textNode)
        {
            this.handler.ontext(this.textNode);
        }
        this.textNode = "";
    }

    function textopts (text : string) : string
    {
        text = text.replace(/[\n\t]/g, ' ');
        text = text.replace(/\s\s+/g, " ");
        return text;
    }

    function emiterror (er : string) : SAXParser
    {
        this.closetext();
        er += "\nLine: " + (this.line as string) +
              "\nColumn: " + (this.column as string) +
              "\nChar: " + this.c;
        var error = new Error(er);
        this.error = error;
        this.handler.onerror(error);
        return this;
    }

    function end () : void
    {
        if (!this.closedRoot)
        {
            this.strictFail("Unclosed root tag");
        }
        if (this.state != _State.TEXT)
        {
            this.emiterror("Unexpected end");
        }
        this.closetext();
        this.c = "";
        this.closed = true;
        this.handler.onend();
    }

    function strictFail (message : string) : void
    {
        if (this.strict)
        {
            this.emiterror(message);
        }
    }

    function newTag () : void
    {
        if (!this.strict) this.tagName = this.tagName.toLowerCase();
        var parent = this.tags[this.tags.length - 1] || this;
        var tag = this.tag = new Tag(this.tagName);
        this.attribList.length = 0;
    }

    function attrib () : void
    {
        if (!this.strict) this.attribName = this.attribName.toLowerCase();

        if (this.tag.attributes.hasOwnProperty(this.attribName)) {
            this.attribName = this.attribValue = "";
            return;
        }

        this.tag.attributes[this.attribName] = this.attribValue;
        this.closetext_if_exist();
        this.handler.onattribute(this.attribName, this.attribValue);
        this.attribName = this.attribValue = "";
    }

    function openTag () : void
    {
        this.openTag(false);
    }

    function openTag (selfClosing : boolean) : void
    {
        this.tag.isSelfClosing = selfClosing;

        // process the tag
        this.sawRoot = true;
        this.tags.push(this.tag);
        this.closetext_if_exist();
        this.handler.onopentag(this.tag.name, this.tag.attributes);
        if (this.tag.name == 'pre')
        {
            this.preTags++;
        }
        if (!selfClosing)
        {
            // special case for <script> in non-strict mode.
            if (!this.noscript && this.tagName.toLowerCase() == "script")
            {
                this.state = _State.SCRIPT;
            }
            else
            {
                this.state = _State.TEXT;
            }
            this.tag = null;
            this.tagName = "";
        }
        this.attribName = this.attribValue = "";
        this.attribList.length = 0;
    }

    function closeTag () : void
    {
        if (!this.tagName)
        {
            this.strictFail("Weird empty close tag.");
            this.textNode += "</>";
            this.state = _State.TEXT;
            return;
        }

        if (this.script)
        {
            if (this.tagName != "script")
            {
                this.script += "</" + this.tagName + ">";
                this.tagName = "";
                this.state = _State.SCRIPT;
                return;
            }
            this.closetext_if_exist();
            this.handler.onscript(this.script);
            this.script = "";
        }

        // first make sure that the closing tag actually exists.
        // <a><b></c></b></a> will close everything, otherwise.
        var t = this.tags.length;
        var tagName = this.tagName;
        if (!this.strict) tagName = tagName.toLowerCase();
        var closeTo = tagName;
        while (t --) {
            var close = this.tags[t];
            if (close.name != closeTo) {
                // fail the first time in strict mode
                this.strictFail("Unexpected close tag");
            } else break;
        }

        // didn't find it.  we already failed for strict, so just abort.
        if (t < 0)
        {
            this.strictFail("Unmatched closing tag: "+this.tagName);
            this.textNode += "</" + this.tagName + ">";
            this.state = _State.TEXT;
            return;
        }
        this.tagName = tagName;
        var s = this.tags.length;
        while (s --> t)
        {
            var tag = this.tag = this.tags.pop();
            this.tagName = this.tag.name;
            this.closetext_if_exist();
            this.handler.onclosetag(this.tagName);
            var parent = this.tags[this.tags.length - 1];
            if (this.tagName == 'pre')
            {
                this.preTags--;
            }
        }
        if (t == 0)
        {
            this.closedRoot = true;
        }
        this.tagName = this.attribValue = this.attribName = "";
        this.attribList.length = 0;
        this.state = _State.TEXT;
    }

    function parseEntity () : string
    {
        var entity = this.entity;
        var entityLC = entity.toLowerCase();
        var num = 0;
        var numStr = "";
        if (this.ENTITIES[entity])
        {
            return this.ENTITIES[entity];
        }
        if (this.ENTITIES[entityLC])
        {
            return this.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) == "#")
        {
            if (entity.charAt(1) == "x")
            {
                entity = entity.slice(2);
                num = Number.parseInt(entity, 16);
                numStr = num.toString(16);
            }
            else
            {
                entity = entity.slice(1);
                num = Number.parseInt(entity, 10);
                numStr = num.toString(10);
            }
        }
        entity = entity.replace(/^0+/, "");
        if (numStr.toLowerCase() != entity) {
            this.strictFail("Invalid character entity");
            return "&"+this.entity + ";";
        }
        return String.fromCharCode(num);
    }
}

class Char
{
    var whitespace : Map.<boolean>;
    var number : Map.<boolean>;
    var letter : Map.<boolean>;
    var quote : Map.<boolean>;
    var entity : Map.<boolean>;
    var attribEnd : Map.<boolean>;
    var nameStart : RegExp;
    var nameBody : RegExp;
    var CDATA : string;
    var DOCTYPE : string;
    var XML_NAMESPACE : string;

    function constructor()
    {
        // character classes and tokens
        var whitespace = "\r\n\t ";
        // this really needs to be replaced with character classes.
        // XML allows all manner of ridiculous numbers and digits.
        var number = "0124356789";
        var letter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // (Letter | "_" | ":")
        var quote = "'\"";
        var entity = number+letter+"#";
        var attribEnd = whitespace + ">";
        this.CDATA = "[CDATA[";
        this.DOCTYPE = "DOCTYPE";
        this.XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";

        // turn all the string character sets into character class objects.
        this.whitespace = this._charClass(whitespace);
        this.number = this._charClass(number);
        this.letter = this._charClass(letter);
        this.quote = this._charClass(quote);
        this.entity = this._charClass(entity);
        this.attribEnd = this._charClass(attribEnd);
        this.nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;

        this.nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/;
    }

    function _charClass (str : string) : Map.<boolean>
    {
        var result = {} : Map.<boolean>;
        for (var i = 0; i < str.length; i++)
        {
            result[str.slice(i, i + 1)] = true;
        }
        return result;
    }

    function is (charclass : RegExp, c : string) : boolean
    {
        return charclass.test(c);
    }

    function is (charclass : Map.<boolean>, c : string) : boolean
    {
        return charclass.hasOwnProperty(c);
    }

    function not (charclass : RegExp, c : string) : boolean {
        return !this.is(charclass, c);
    }

    function not (charclass : Map.<boolean>, c : string) : boolean {
        return !this.is(charclass, c);
    }
}


class _Entities
{
    static const _entities = {
       "amp" : "&",
       "gt" : ">",
       "lt" : "<",
       "quot" : "\"",
       "apos" : "'",
       "AElig" : 198,
       "Aacute" : 193,
       "Acirc" : 194,
       "Agrave" : 192,
       "Aring" : 197,
       "Atilde" : 195,
       "Auml" : 196,
       "Ccedil" : 199,
       "ETH" : 208,
       "Eacute" : 201,
       "Ecirc" : 202,
       "Egrave" : 200,
       "Euml" : 203,
       "Iacute" : 205,
       "Icirc" : 206,
       "Igrave" : 204,
       "Iuml" : 207,
       "Ntilde" : 209,
       "Oacute" : 211,
       "Ocirc" : 212,
       "Ograve" : 210,
       "Oslash" : 216,
       "Otilde" : 213,
       "Ouml" : 214,
       "THORN" : 222,
       "Uacute" : 218,
       "Ucirc" : 219,
       "Ugrave" : 217,
       "Uuml" : 220,
       "Yacute" : 221,
       "aacute" : 225,
       "acirc" : 226,
       "aelig" : 230,
       "agrave" : 224,
       "aring" : 229,
       "atilde" : 227,
       "auml" : 228,
       "ccedil" : 231,
       "eacute" : 233,
       "ecirc" : 234,
       "egrave" : 232,
       "eth" : 240,
       "euml" : 235,
       "iacute" : 237,
       "icirc" : 238,
       "igrave" : 236,
       "iuml" : 239,
       "ntilde" : 241,
       "oacute" : 243,
       "ocirc" : 244,
       "ograve" : 242,
       "oslash" : 248,
       "otilde" : 245,
       "ouml" : 246,
       "szlig" : 223,
       "thorn" : 254,
       "uacute" : 250,
       "ucirc" : 251,
       "ugrave" : 249,
       "uuml" : 252,
       "yacute" : 253,
       "yuml" : 255,
       "copy" : 169,
       "reg" : 174,
       "nbsp" : 160,
       "iexcl" : 161,
       "cent" : 162,
       "pound" : 163,
       "curren" : 164,
       "yen" : 165,
       "brvbar" : 166,
       "sect" : 167,
       "uml" : 168,
       "ordf" : 170,
       "laquo" : 171,
       "not" : 172,
       "shy" : 173,
       "macr" : 175,
       "deg" : 176,
       "plusmn" : 177,
       "sup1" : 185,
       "sup2" : 178,
       "sup3" : 179,
       "acute" : 180,
       "micro" : 181,
       "para" : 182,
       "middot" : 183,
       "cedil" : 184,
       "ordm" : 186,
       "raquo" : 187,
       "frac14" : 188,
       "frac12" : 189,
       "frac34" : 190,
       "iquest" : 191,
       "times" : 215,
       "divide" : 247,
       "OElig" : 338,
       "oelig" : 339,
       "Scaron" : 352,
       "scaron" : 353,
       "Yuml" : 376,
       "fnof" : 402,
       "circ" : 710,
       "tilde" : 732,
       "Alpha" : 913,
       "Beta" : 914,
       "Gamma" : 915,
       "Delta" : 916,
       "Epsilon" : 917,
       "Zeta" : 918,
       "Eta" : 919,
       "Theta" : 920,
       "Iota" : 921,
       "Kappa" : 922,
       "Lambda" : 923,
       "Mu" : 924,
       "Nu" : 925,
       "Xi" : 926,
       "Omicron" : 927,
       "Pi" : 928,
       "Rho" : 929,
       "Sigma" : 931,
       "Tau" : 932,
       "Upsilon" : 933,
       "Phi" : 934,
       "Chi" : 935,
       "Psi" : 936,
       "Omega" : 937,
       "alpha" : 945,
       "beta" : 946,
       "gamma" : 947,
       "delta" : 948,
       "epsilon" : 949,
       "zeta" : 950,
       "eta" : 951,
       "theta" : 952,
       "iota" : 953,
       "kappa" : 954,
       "lambda" : 955,
       "mu" : 956,
       "nu" : 957,
       "xi" : 958,
       "omicron" : 959,
       "pi" : 960,
       "rho" : 961,
       "sigmaf" : 962,
       "sigma" : 963,
       "tau" : 964,
       "upsilon" : 965,
       "phi" : 966,
       "chi" : 967,
       "psi" : 968,
       "omega" : 969,
       "thetasym" : 977,
       "upsih" : 978,
       "piv" : 982,
       "ensp" : 8194,
       "emsp" : 8195,
       "thinsp" : 8201,
       "zwnj" : 8204,
       "zwj" : 8205,
       "lrm" : 8206,
       "rlm" : 8207,
       "ndash" : 8211,
       "mdash" : 8212,
       "lsquo" : 8216,
       "rsquo" : 8217,
       "sbquo" : 8218,
       "ldquo" : 8220,
       "rdquo" : 8221,
       "bdquo" : 8222,
       "dagger" : 8224,
       "Dagger" : 8225,
       "bull" : 8226,
       "hellip" : 8230,
       "permil" : 8240,
       "prime" : 8242,
       "Prime" : 8243,
       "lsaquo" : 8249,
       "rsaquo" : 8250,
       "oline" : 8254,
       "frasl" : 8260,
       "euro" : 8364,
       "image" : 8465,
       "weierp" : 8472,
       "real" : 8476,
       "trade" : 8482,
       "alefsym" : 8501,
       "larr" : 8592,
       "uarr" : 8593,
       "rarr" : 8594,
       "darr" : 8595,
       "harr" : 8596,
       "crarr" : 8629,
       "lArr" : 8656,
       "uArr" : 8657,
       "rArr" : 8658,
       "dArr" : 8659,
       "hArr" : 8660,
       "forall" : 8704,
       "part" : 8706,
       "exist" : 8707,
       "empty" : 8709,
       "nabla" : 8711,
       "isin" : 8712,
       "notin" : 8713,
       "ni" : 8715,
       "prod" : 8719,
       "sum" : 8721,
       "minus" : 8722,
       "lowast" : 8727,
       "radic" : 8730,
       "prop" : 8733,
       "infin" : 8734,
       "ang" : 8736,
       "and" : 8743,
       "or" : 8744,
       "cap" : 8745,
       "cup" : 8746,
       "int" : 8747,
       "there4" : 8756,
       "sim" : 8764,
       "cong" : 8773,
       "asymp" : 8776,
       "ne" : 8800,
       "equiv" : 8801,
       "le" : 8804,
       "ge" : 8805,
       "sub" : 8834,
       "sup" : 8835,
       "nsub" : 8836,
       "sube" : 8838,
       "supe" : 8839,
       "oplus" : 8853,
       "otimes" : 8855,
       "perp" : 8869,
       "sdot" : 8901,
       "lceil" : 8968,
       "rceil" : 8969,
       "lfloor" : 8970,
       "rfloor" : 8971,
       "lang" : 9001,
       "rang" : 9002,
       "loz" : 9674,
       "spades" : 9824,
       "clubs" : 9827,
       "hearts" : 9829,
       "diams" : 9830
    } : Map.<variant>;

    static function entity_list () : Map.<string>
    {
        var result = {} : Map.<string>;
        for (var key in _Entities._entities)
        {
            var value : variant = _Entities._entities[key];
            if (typeof(value) == 'string')
            {
                result[key] = value as string;
            }
            else if (typeof(value) == 'number')
            {
                result[key] = String.fromCharCode(value as int);
            }
        }
        return result;
    }
}

