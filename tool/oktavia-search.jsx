import "console.jsx";
import "js/nodejs.jsx";

import "oktavia.jsx";
import "getopt.jsx";
import "query-parser.jsx";
import "search-result.jsx";
import "style.jsx";
import "binary-util.jsx";

import "stemmer/stemmer.jsx";
import "stemmer/danish-stemmer.jsx";
import "stemmer/dutch-stemmer.jsx";
import "stemmer/english-stemmer.jsx";
import "stemmer/finnish-stemmer.jsx";
import "stemmer/french-stemmer.jsx";
import "stemmer/german-stemmer.jsx";
import "stemmer/hungarian-stemmer.jsx";
import "stemmer/italian-stemmer.jsx";
import "stemmer/norwegian-stemmer.jsx";
import "stemmer/porter-stemmer.jsx";
import "stemmer/portuguese-stemmer.jsx";
import "stemmer/romanian-stemmer.jsx";
import "stemmer/russian-stemmer.jsx";
import "stemmer/spanish-stemmer.jsx";
import "stemmer/swedish-stemmer.jsx";
import "stemmer/turkish-stemmer.jsx";


class Search
{
    var style : Style;

    function search (indexFile : string, queryStrings : string[], num : int, style : Style, algorithm : Nullable.<string>) : void
    {
        this.style = style;
        var oktavia = new Oktavia();
        if (algorithm != null)
        {
            oktavia.setStemmer(this.createStemmer(algorithm));
        }
        if (!this.loadIndex(oktavia, indexFile))
        {
            return;
        }
        console.time('searching');
        var queryParser = new QueryParser();
        queryParser.parse(queryStrings);
        var summary = oktavia.search(queryParser.queries);
        console.timeEnd('searching');
        if (summary.size() == 0)
        {
            this.notFound(summary, queryStrings);
        }
        else
        {
            this.showResult(oktavia, summary, num);
        }
    }

    function loadIndex (oktavia : Oktavia, filepath : string) : boolean
    {
        var ext = node.path.extname(filepath);
        var content : string;
        var result = true;
        switch (ext)
        {
        case ".okt":
            content = node.fs.readFileSync(filepath, "utf16le");
            oktavia.load(content);
            break;
        case ".b64":
            content = node.fs.readFileSync(filepath, "utf8");
            oktavia.load(Binary.base64decode(content));
            break;
        case ".js":
            content = node.fs.readFileSync(filepath, "utf8");
            var index = content.indexOf('"');
            var lastIndex = content.lastIndexOf('"');
            oktavia.load(Binary.base64decode(content.slice(index, lastIndex)));
            break;
        default:
            console.log("unknown file extension: " + ext);
            result = false;
            break;
        }
        return result;
    }

    function sortResult (oktavia : Oktavia, summary : SearchSummary) : SearchUnit[]
    {
        for (var i = 0; i < summary.result.units.length; i++)
        {
            var score = 0;
            var unit = summary.result.units[i];
            for (var pos in unit.positions)
            {
                var position = unit.positions[pos];
                if (oktavia.wordPositionType(position.position))
                {
                    score += 10;
                }
                else
                {
                    score += 1;
                }
                if (!position.stemmed)
                {
                    score += 2;
                }
            }
            unit.score = score;
        }
        return summary.getSortedResult();
    }

    function showResult (oktavia : Oktavia, summary : SearchSummary, num : int) : void
    {
        var results = this.sortResult(oktavia, summary);
        var style = this.style;
        var metadata = oktavia.getPrimaryMetadata();
        for (var i = 0; i < results.length; i++)
        {
            var unit = results[i];
            var info = metadata.getInformation(unit.id).split(Oktavia.eob);
            /*console.log(info.replace(Oktavia.eob, ' -- ') + '\n');
                    + ' ----------------------------------------------- '
                    + unit.score as string + ' pt');*/
            console.log(style.convert('<title>' + info[0] + '</title>') + ' ' + style.convert('<url>' + info[1] + '</url>'));
            var offset = info[0].length + 1;
            var content = metadata.getContent(unit.id);
            var start = 0;
            var positions = unit.getPositions();
            if (content.indexOf(info[0]) == 1)
            {
                content = content.slice(info[0].length + 2, content.length);
                start += (info[0].length + 2);
            }
            var end = start + num;
            var split = false;
            if (positions[0].position > end - positions[0].word.length)
            {
                end = positions[0].position + Math.floor(num / 2);
                split = true;
            }
            for (var j = positions.length - 1; j > -1; j--)
            {
                var pos = positions[j];
                if (pos.position + pos.word.length < end)
                {
                    /*log('--------------begin : ' + (pos.position - start) as string);
                    log(content.slice(0, pos.position - start));
                    log('--------------match : ' + pos.word.length as string);
                    .log(content.slice(pos.position - start, pos.position + pos.word.length - start));
                    log('--------------match : ' + (content.length - pos.position + pos.word.length - start) as string);
                    log(content.slice(pos.position + pos.word.length - start, content.length));
                    log('--------------end');*/
                    content = [
                        content.slice(0, pos.position - start),
                        style.convert('<hit>*</hit>').replace('*', content.slice(pos.position - start, pos.position + pos.word.length - start)),
                        content.slice(pos.position + pos.word.length - start, content.length)
                    ].join('');
                }
            }
            var text : string;
            if (split)
            {
                text = [
                    content.slice(0, Math.floor(num / 2)) + ' ...',
                    content.slice(-Math.floor(num / 2), end - start)].join('\n');
            }
            else
            {
                text = content.slice(0, end - start) + ' ...\n';
            }
            text = text.replace(Oktavia.eob, ' ').replace(/\n\n+/, '\n\n');
            console.log(text);
        }
        console.log(style.convert('<summary>' + (summary.size() as string) + " results.</summary>\n"));
    }

    function notFound (summary : SearchSummary, query : string[]) : void
    {
        var style = this.style;
        if (query.length > 1)
        {
            console.log("Suggestions:");
            var proposals = summary.getProposal();
            for (var i = 0; i < proposals.length; i++)
            {
                var proposal = proposals[i];
                var querywords = [] : string[];
                for (var j = 0; j < query.length; j++)
                {
                    if (j != proposal.omit)
                    {
                        querywords.push(style.convert('<hit>' + query[j] + '</hit>'));
                    }
                    else
                    {
                        //querywords.push(style.convert('<del>' + query[j] + '</del>'));
                    }
                }
                console.log("* Expected result: " + querywords.join(" ") + " - " + (proposal.expect as string) + " hit");
            }
        }
        else
        {
            console.log(style.convert("Your search - <hit>" + query[0] + "</hit> - didn't match any documents."));
        }
    }

    function createStemmer (algorithm : string) : Stemmer
    {
        var stemmer : Stemmer;
        switch (algorithm.toLowerCase())
        {
        case "danish":
            stemmer = new DanishStemmer();
            break;
        case "dutch":
            stemmer = new DutchStemmer();
            break;
        case "english":
            stemmer = new EnglishStemmer();
            break;
        case "finnish":
            stemmer = new FinnishStemmer();
            break;
        case "french":
            stemmer = new FrenchStemmer();
            break;
        case "german":
            stemmer = new GermanStemmer();
            break;
        case "hungarian":
            stemmer = new HungarianStemmer();
            break;
        case "italian":
            stemmer = new ItalianStemmer();
            break;
        case "norwegian":
            stemmer = new NorwegianStemmer();
            break;
        case "porter":
            stemmer = new PorterStemmer();
            break;
        case "portuguese":
            stemmer = new PortugueseStemmer();
            break;
        case "romanian":
            stemmer = new RomanianStemmer();
            break;
        case "russian":
            stemmer = new RussianStemmer();
            break;
        case "spanish":
            stemmer = new SpanishStemmer();
            break;
        case "swedish":
            stemmer = new SwedishStemmer();
            break;
        case "turkish":
            stemmer = new TurkishStemmer();
            break;
        default:
            stemmer = new EnglishStemmer();
            break;
        }
        return stemmer;
    }
}

class _Main {
    static function usage () : void
    {
        console.log([
            "usage: oktavia_search index_file [options] query...",
            "",
            "Options:",
            "   -m, --mono                    : Don't use color.",
            "   -s, --stemmer [algorithm]     : Select stemming algorithm.",
            "   -n, --number [char number]    : Result display number. Default value = 250",
            "   -h, --help                    : Display this message.",
            "",
            "Search Query Syntax:",
            "   word1 word2                   : All words.",
            '   "word1 word2"                 : Exact words or phrase.',
            "   word1 OR word2                : Any of these words.",
            "   word1 -word2                  : None of these words."
        ].join('\n'));
    }

    static function main(args : string[]) : void
    {
        console.log("Search Engine Oktavia - Command-line Search Client\n");

        var indexFile : Nullable.<string> = null;
        var showhelp = false;
        var notrun = false;
        var styleType = 'console';
        var num : int = 250;
        var queryStrings = [] : string[];
        var algorithm : Nullable.<string> = null;

        var validStemmers = [
            'danish', 'dutch', 'english', 'finnish', 'french', 'german', 'hungarian',
            'italian', 'norwegian', 'porter', 'portuguese', 'romanian', 'russian',
            'spanish', 'swedish', 'turkish'
        ];

        if (args.length == 0)
        {
            showhelp = true;
        }
        else if (!node.fs.existsSync(args[0]))
        {
            console.error("Index file '" + args[0] + "' doesn't exist.");
            notrun = true;
        }
        else
        {
            indexFile = args[0];
        }

        var optstring = "m(mono)s:(stemmer)n:(number)h(help)";
        var parser = new BasicParser(optstring, args.slice(1));
        var opt = parser.getopt();
        while (opt)
        {
            switch (opt.option)
            {
            case "s":
                if (validStemmers.indexOf(opt.optarg) == -1)
                {
                    console.error('Option s/stemmer is invalid.');
                    notrun = true;
                }
                else
                {
                    algorithm = opt.optarg;
                }
                break;
            case "m":
                styleType = 'ignore';
                break;
            case "n":
                num = opt.optarg as int;
                break;
            case "h":
                showhelp = true;
                break;
            default:
                queryStrings.push(opt.option);
                break;
            }
            opt = parser.getopt();
        }
        if (showhelp || queryStrings.length == 0)
        {
            _Main.usage();
        }
        else if (!notrun)
        {
            var style = new Style(styleType);
            var search = new Search();
            search.search(indexFile, queryStrings, num, style, algorithm);
        }
    }
}
