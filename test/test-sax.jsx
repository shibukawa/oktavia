import "sax.jsx";
import "test-case.jsx";


class TestHandler extends SAXHandler
{
    var events : string[];
    var param1 : string[];
    var param2 : string[];

    function constructor (events : string[], param1 : string[], param2 : string[])
    {
        this.events = events;
        this.param1 = param1;
        this.param2 = param2;
    }
    override function ontext (text : string) : void
    {
        this.events.push("ontext");
        this.param1.push(text);
        this.param2.push(null);
    }
    override function ondoctype (doctype : string) : void
    {
        this.events.push("ondoctype");
        this.param1.push(doctype);
        this.param2.push(null);
    }
    override function onopentag (tagname : string, attributes : Map.<string>) : void
    {
        this.events.push("onopentag");
        this.param1.push(tagname);
        this.param2.push(null);
    }
    override function onclosetag (tagname : string) : void
    {
        this.events.push("onclosetag");
        this.param1.push(tagname);
        this.param2.push(null);
    }
    override function onattribute (name : string, value : string) : void
    {
        this.events.push("onattribute");
        this.param1.push(name);
        this.param2.push(value);
    }
    override function oncomment (comment : string) : void
    {
        this.events.push("oncomment");
        this.param1.push(comment);
        this.param2.push(null);
    }
    override function onend () : void
    {
        this.events.push("onend");
        this.param1.push(null);
        this.param2.push(null);
    }
    override function onready () : void
    {
        this.events.push("onready");
        this.param1.push(null);
        this.param2.push(null);
    }
    override function onscript (script : string) : void
    {
        this.events.push("onscript");
        this.param1.push(script);
        this.param2.push(null);
    }
}

class _Test extends TestCase
{
    var handler : TestHandler;
    var parser : SAXParser;

    var events : string[];
    var param1 : string[];
    var param2 : string[];

    override function setUp () : void
    {
        this.events = [] : string[];
        this.param1 = [] : string[];
        this.param2 = [] : string[];
        this.handler = new TestHandler(this.events, this.param1, this.param2);
        this.parser = new SAXParser(this.handler);
    }

    function test_empty_input () : void
    {
        this.parser.parse('');
        this.expect(this.events[0]).toBe('onready');
        this.expect(this.events[1]).toBe('onend');
    }

    function test_doctype () : void
    {
        this.parser.parse('<!DOCTYPE html>');
        this.expect(this.events[1]).toBe('ondoctype');
        this.expect(this.param1[1]).toBe('html');
    }

    function test_tag1 () : void
    {
        this.parser.parse('<html></html>');
        this.expect(this.events[1]).toBe('onopentag');
        this.expect(this.param1[1]).toBe('html');
        this.expect(this.events[2]).toBe('onclosetag');
        this.expect(this.param1[2]).toBe('html');
    }

    function test_tag2 () : void
    {
        this.parser.parse('<html/>');
        this.expect(this.events[1]).toBe('onopentag');
        this.expect(this.param1[1]).toBe('html');
        this.expect(this.events[2]).toBe('onclosetag');
        this.expect(this.param1[2]).toBe('html');
    }

    function test_attribute () : void
    {
        this.parser.parse('<html lang="ja"></html>');
        this.expect(this.events[1]).toBe('onattribute');
        this.expect(this.param1[1]).toBe('lang');
        this.expect(this.param2[1]).toBe('ja');
        this.expect(this.events[2]).toBe('onopentag');
        this.expect(this.param1[2]).toBe('html');
    }

    function test_text () : void
    {
        this.parser.parse('<html><body>hello world</body></html>');
        this.expect(this.events[3]).toBe('ontext');
        this.expect(this.param1[3]).toBe('hello world');
    }

    function test_comment () : void
    {
        this.parser.parse('<html><body><!-- comment --></body></html>');
        this.expect(this.events[3]).toBe('oncomment');
        this.expect(this.param1[3]).toBe('comment');
    }
}

