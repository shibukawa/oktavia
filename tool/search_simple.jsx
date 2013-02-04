import "nodejs.jsx";
import "fm_index.jsx";

class _Main
{
    static function usage () : void
    {
        log "Simple FM-Index Search Engine: Oktavia";
        log "";
        log "[usage]";
        log "    search [input db file name] keyword";
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
            var fm_index = new FMIndex();
            fm_index.load(node.fs.readFileSync(indexFileName, "utf16le"));
            for (var i in args)
            {
                log "[search world]", args[i];
                var results = fm_index.search(args[i]);
                for (var j in results)
                {
                    var result = results[j];
                    log "[", result[0], "]: ", "(", result[1], ")";
                }
                log results.length, " hits";
            }
        }
    }
}
