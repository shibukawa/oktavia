import "nodejs.jsx";
import "search_engine.jsx"
import "fm_index.jsx";

class _Main
{
    static function usage () : void
    {
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
            log indexFileName;
            //var searchEngine = new SearchEngine();
            var fm_index = new FMIndex();
            for (var i in args)
            {
                log "reading... ", args[i];
                var lines = node.fs.readFileSync(args[i], "utf8");
                //searchEngine.register_file_content(args[i], lines);
                fm_index.push(lines);
            }
            //searchEngine.build();
            //var dump = searchengine.dump();
            fm_index.build();
            var dump = fm_index.dump();
            node.fs.writeFileSync(indexFileName, dump, "utf16");
        }
    }
}
