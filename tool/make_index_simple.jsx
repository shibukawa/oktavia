import "nodejs.jsx";
import "fm_index.jsx";

class _Main
{
    static function usage () : void
    {
        log "Simple FM-Index Search Engine: Oktavia";
        log "";
        log "[usage]";
        log "    make_index_simple [output db file name] [import text files...]";
    }

    static function main(args : string[]) : void
    {
        if (args.length <2)
        {
            _Main.usage();
        }
        else
        {
            var indexFileName = args.shift();
            log "index file name: ", indexFileName;
            //var searchEngine = new SearchEngine();
            var fm_index = new FMIndex();
            for (var i in args)
            {
                log "reading... ", args[i];
                var lines = node.fs.readFileSync(args[i], "utf8");
                fm_index.push(lines);
            }
            fm_index.build(String.fromCharCode(1), 64, true);
            var dump = fm_index.dump();
            node.fs.writeFileSync(indexFileName, dump, "utf16le");
        }
    }
}
