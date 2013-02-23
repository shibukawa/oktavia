import "console.jsx";
import "oktavia.jsx";
import "metadata.jsx";
import "query-parser.jsx";
import "stemmer/english-stemmer.jsx";


class HTTPStatus
{
    var oktavia : Oktavia;
    var splitter : Splitter;
    var httpstatus : string[];

    function constructor ()
    {
        this.oktavia = new Oktavia;
        this.oktavia.setStemmer(new EnglishStemmer());
        this.splitter = this.oktavia.addSplitter('line break');
        this.makeIndex();
    }

    function makeIndex () : void
    {
        this.httpstatus = [
            "100: Continue",
            "101: Switching Protocols",
            "102: Processing",
            "200: OK",
            "201: Created",
            "202: Accepted",
            "203: Non-Authoritative Information",
            "204: No Content",
            "205: Reset Content",
            "206: Partial Content",
            "207: Multi-Status",
            "208: Already Reported",
            "300: Multiple Choices",
            "301: Moved Permanently",
            "302: Found",
            "303: See Other",
            "304: Not Modified",
            "305: Use Proxy",
            "307: Temporary Redirect",
            "400: Bad Request",
            "401: Unauthorized",
            "402: Payment Required",
            "403: Forbidden",
            "404: Not Found",
            "405: Method Not Allowed",
            "406: Not Acceptable",
            "407: Proxy Authentication Required",
            "408: Request Timeout",
            "409: Conflict",
            "410: Gone",
            "411: Length Required",
            "412: Precondition Failed",
            "413: Request Entity Too Large",
            "414: Request-URI Too Large",
            "415: Unsupported Media Type",
            "416: Request Range Not Satisfiable",
            "417: Expectation Failed",
            "418: I'm a teapot",
            "422: Unprocessable Entity",
            "423: Locked",
            "424: Failed Dependency",
            "425: No code",
            "426: Upgrade Required",
            "428: Precondition Required",
            "429: Too Many Requests",
            "431: Request Header Fields Too Large",
            "449: Retry with",
            "500: Internal Server Error",
            "501: Not Implemented",
            "502: Bad Gateway",
            "503: Service Unavailable",
            "504: Gateway Timeout",
            "505: HTTP Version Not Supported",
            "506: Variant Also Negotiates",
            "507: Insufficient Storage",
            "509: Bandwidth Limit Exceeded",
            "510: Not Extended"
        ];
        for (var i in this.httpstatus)
        {
            this.oktavia.addWord(this.httpstatus[i], true);
            this.splitter.split();
        }
        this.oktavia.build();
    }

    function search (words : string[]) : string
    {
        var queryParser = new QueryParser();
        queryParser.parse(words);
        if (queryParser.queries.length == 0)
        {
            var result = this.httpstatus.join('\n');
            result = result + "\n\nToday's status: " + this.random();
            return result;
        }
        else
        {
            var resultIndexes = [] : int[];
            for (var i = 0; i < queryParser.queries.length; i++)
            {
                var query = queryParser.queries[i];
                var newResultIndexes = this.search(query.word, !query.raw);
                if (i == 0)
                {
                    if (!query.not)
                    {
                        resultIndexes = newResultIndexes;
                    }
                }
                else
                {
                    if (query.or)
                    {
                        resultIndexes = this.sum(resultIndexes, newResultIndexes);
                    }
                    else if (query.not)
                    {
                        resultIndexes = this.sub(resultIndexes, newResultIndexes);
                    }
                    else
                    {
                        resultIndexes = this.multiply(resultIndexes, newResultIndexes);
                    }
                }
            }
            if (resultIndexes.length == 0)
            {
                return "not found";
            }
            var resultWords = [] : string[];
            for (var i in resultIndexes)
            {
                resultWords.push(this.splitter.getContent(resultIndexes[i]));
            }
            return resultWords.join('\n');
        }
    }

    function search (word : string, raw : boolean) : int []
    {
        var result = [] : int[];
        var another = word.slice(0, 1).toUpperCase() + word.slice(1);
        var searchWords = [word, another];
        for (var i = 0; i < searchWords.length; i++)
        {
            var positions = this.oktavia.rawSearch(searchWords[i], !raw);
            for (var j = 0; j < positions.length; j++)
            {
                var index = this.splitter.getIndex(positions[j]);
                if (result.indexOf(index) == -1)
                {
                    result.push(index);
                }
            }
        }
        return result;
    }

    function sum (a : int[], b : int[]) : int[]
    {
        var result = a.slice(0, a.length);
        for (var i = 0; i < b.length; i++)
        {
            var item = b[i];
            if (result.indexOf(item) == -1)
            {
                result.push(item); 
            }
        }
        return result;
    }

    function sub (a : int[], b : int[]) : int[]
    {
        var result = a.slice(0, a.length);
        for (var i = 0; i < b.length; i++)
        {
            var item = b[i];
            if (result.indexOf(item) != -1)
            {
                result.splice(result.indexOf(item), 1); 
            }
        }
        return result;
    }

    function multiply (a : int[], b : int[]) : int[]
    {
        var result = [] : int[];
        for (var i = 0; i < b.length; i++)
        {
            var item = b[i];
            if (a.indexOf(item) != -1)
            {
                result.push(item); 
            }
        }
        return result;
    }

    function random () : string
    {
        return this.httpstatus[Math.round(Math.random() * this.httpstatus.length)];
    }
}

class _Main
{
    static function main (argv : string []) : void
    {
        var httpstatus = new HTTPStatus();
        console.log(httpstatus.search(argv));
    }
}
