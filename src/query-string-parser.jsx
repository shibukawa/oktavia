import "query.jsx";


class QueryStringParser
{
    var queries : Query[]; 
    function constructor()
    {
        this.queries = [] : Query[];
    }

    function parse (queryString : string) : Query[]
    {
        var nextOr = false;
        var nextNot = false;
        var currentWordStart = 0;
        var status = 0;
        // 0: free
        // 1: in unquoted word
        // 2: in quote
        var isSpace = /[\s\u3000]/;
        for (var i = 0; i < queryString.length; i++)
        {
            var ch = queryString.charAt(i);
            switch (status)
            {
            case 0: // free
                if (!isSpace.test(ch))
                {
                    if (ch == '-')
                    {
                        nextNot = true;
                    }
                    else if (ch == '"')
                    {
                        currentWordStart = i + 1;
                        status = 2;
                    }
                    else
                    {
                        currentWordStart = i;
                        status = 1;
                    }
                }
                else
                {
                    nextNot = false;
                }
                break;
            case 1: // unquoted word
                if (isSpace.test(ch))
                {
                    var word = queryString.slice(currentWordStart, i);
                    if (word == 'OR')
                    {
                        nextOr = true;    
                    }
                    else
                    {
                        var query = new Query();
                        query.word = word;
                        query.or = nextOr;
                        query.not = nextNot;
                        this.queries.push(query);
                        nextOr = false;
                        nextNot = false;
                    }
                    status = 0;
                }
                break;
            case 2: // in quote
                if (ch == '"')
                {
                    var word = queryString.slice(currentWordStart, i);
                    var query = new Query();
                    query.word = word;
                    query.or = nextOr;
                    query.not = nextNot;
                    query.raw = true;
                    this.queries.push(query);
                    nextOr = false;
                    nextNot = false;
                    status = 0;
                }
                break;
            }
        }
        switch (status)
        {
        case 0:
            break;
        case 1:
            var query = new Query();
            var word = queryString.slice(currentWordStart, queryString.length);
            if (word != 'OR')
            {
                query.word = word;
                query.or = nextOr;
                query.not = nextNot;
                this.queries.push(query);
            }
            break;
        case 2:
            var query = new Query();
            query.word = queryString.slice(currentWordStart, queryString.length);
            query.or = nextOr;
            query.not = nextNot;
            query.raw = true;
            this.queries.push(query);
            break;
        }
        return this.queries;
    }

    function highlight () : string
    {
        var result = [] : string[];
        for (var i = 0; i < this.queries.length; i++)
        {
            var query = this.queries[i];
            if (!query.not)
            {
                result.push("highlight=" + String.encodeURIComponent(query.word));
            }
        }
        return '?' + result.join('&');
    }
}
