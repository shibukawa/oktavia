import "test-case.jsx";
import "getopt.jsx";

class _Test extends TestCase
{
    function test_empty () : void
    {
        var parser = new BasicParser('', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_silent () : void
    {
        var parser = new BasicParser(':', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_args_without_param_01 () : void
    {
        var parser = new BasicParser(':l', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_args_without_param_02 () : void
    {
        var parser = new BasicParser(':l:', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }
    
    function test_args_without_param_03 () : void
    {
        var parser = new BasicParser(':las', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }
    
    function test_args_without_param_04 () : void
    {
        var parser = new BasicParser(':l:a:s:', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }
    
    function test_long_args_without_param () : void
    {
        var parser = new BasicParser(':l:(long)', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_args () : void
    {
        var parser = new BasicParser(':l:(long)', ['-l', 'arg1', '--long=q', 'b', '--long', 'foo']);
        var opt = parser.getopt();
        this.expect(opt.option).toBe('l');
        this.expect(opt.optarg).toBe('arg1');
        opt = parser.getopt();
        this.expect(opt.option).toBe('l');
        this.expect(opt.optarg).toBe('q');
        opt = parser.getopt();
        this.expect(opt.option).toBe('b');
        opt = parser.getopt();
        this.expect(opt.option).toBe('--long');
        opt = parser.getopt();
        this.expect(opt.option).toBe('foo');
    }

    function test_aliased_long_args_without_param_01 () : void
    {
        var parser = new BasicParser(':l:(long)(longer)', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_aliased_long_args_without_param_02 () : void
    {
        var parser = new BasicParser(':la:r(recurse)(recur)f:(file)(filename)q', [] : string[]);
        this.expect(parser.getopt()).toBe(null);
    }

    function test_extra_options () : void
    {
        var parser = new BasicParser('la:r(recurse)(recur)f:(file)(filename)q', ['extra1', 'extra2']);
        this.expect(parser.getopt().option).toBe('extra1');
        this.expect(parser.getopt().option).toBe('extra2');
        this.expect(parser.getopt()).toBe(null);
    }
}
