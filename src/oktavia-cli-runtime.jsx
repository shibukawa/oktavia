import "console.jsx";
import "js/nodejs.jsx";
import "js.jsx";

import "./oktavia.jsx";
import "./metadata.jsx";
import "./search-result.jsx";
import "./style.jsx";
import "./base64.jsx";

import "getopt.jsx";
import "query-list-parser.jsx";

import "stemmer.jsx";
//import "danish-stemmer.jsx";
//import "dutch-stemmer.jsx";
//import "english-stemmer.jsx";
//import "finnish-stemmer.jsx";
//import "french-stemmer.jsx";
//import "german-stemmer.jsx";
//import "hungarian-stemmer.jsx";
//import "italian-stemmer.jsx";
//import "norwegian-stemmer.jsx";
//import "porter-stemmer.jsx";
//import "portuguese-stemmer.jsx";
//import "romanian-stemmer.jsx";
//import "russian-stemmer.jsx";
//import "spanish-stemmer.jsx";
//import "swedish-stemmer.jsx";
//import "turkish-stemmer.jsx";


class Search
{
    var style : Style;

    function search (queryStrings : string[], num : int, style : Style) : void
    {
        this.style = style;
        var oktavia = new Oktavia();
        //oktavia.setStemmer(new DanishStemmer());
        //oktavia.setStemmer(new DutchStemmer());
        //oktavia.setStemmer(new EnglishStemmer());
        //oktavia.setStemmer(new FinnishStemmer());
        //oktavia.setStemmer(new FrenchStemmer());
        //oktavia.setStemmer(new GermanStemmer());
        //oktavia.setStemmer(new HungarianStemmer());
        //oktavia.setStemmer(new ItalianStemmer());
        //oktavia.setStemmer(new NorwegianStemmer());
        //oktavia.setStemmer(new PorterStemmer());
        //oktavia.setStemmer(new PortugueseStemmer());
        //oktavia.setStemmer(new RomanianStemmer());
        //oktavia.setStemmer(new RussianStemmer());
        //oktavia.setStemmer(new SpanishStemmer());
        //oktavia.setStemmer(new SwedishStemmer());
        //oktavia.setStemmer(new TurkishStemmer());

        var latinString = Base64.atob(js.global['searchIndex'] as string);
        var indexBinary = Base64.to16bitString(latinString);
        oktavia.load(indexBinary);
        console.time('searching');
        var queryParser = new QueryListParser();
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
            if (info.length == 2)
            {
                console.log(style.convert('<title>' + info[0] + '</title>') + '  ' + style.convert('<url>' + info[1] + '</url>'));
            }
            else
            {
                console.log(style.convert('<title>' + info[0] + '</title>'));
            }
            var content = metadata.getContent(unit.id);
            var start = 0;
            var positions = unit.getPositions();
            if (content.indexOf(info[0]) == 0)
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
                    content = [
                        content.slice(0, pos.position - start - 1),
                        style.convert('<hit>*</hit>').replace('*', content.slice(pos.position - start - 1, pos.position + pos.word.length - start - 1)),
                        content.slice(pos.position + pos.word.length - start - 1, content.length)
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
            var proposals = summary.getProposals();
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
}

class _Main {
    static function usage () : void
    {
        console.log([
            "usage: %s index_file [options] query...",
            "",
            "Options:",
            "   -m, --mono                    : Don't use color.",
            "   -n, --number [char number]    : Result display number. Default value = 250",
            "   -h, --help                    : Display this message.",
            "",
            "Search Query Syntax:",
            "   word1 word2                   : All words.",
            '   "word1 word2"                 : Exact words or phrase.',
            "   word1 OR word2                : Any of these words.",
            "   word1 -word2                  : None of these words."
        ].join('\n').replace('%s', process.argv[1]));
    }

    static function main(args : string[]) : void
    {
        var showhelp = false;
        var notrun = false;
        var styleType = 'console';
        var num : int = 250;
        var queryStrings = [] : string[];

        if (args.length == 0)
        {
            showhelp = true;
        }

        var optstring = "m(mono)n:(number)h(help)";
        var parser = new BasicParser(optstring, args);
        var opt = parser.getopt();
        while (opt)
        {
            switch (opt.option)
            {
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
            search.search(queryStrings, num, style);
        }
    }
}
