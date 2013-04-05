import "query.jsx";


class QueryParser
{
    var queries : Query[];
    function constructor()
    {
        this.queries = [] : Query[];
    }

    function parse (queryStrings : string[]) : Query[]
    {
        var nextOr = false;
        for (var i = 0; i < queryStrings.length; i++)
        {
            var word = queryStrings[i];
            if (word == 'OR')
            {
                nextOr = true;
            }
            else
            {
                var query = new Query();
                if (nextOr)
                {
                    query.or = true;
                    nextOr = false;
                }
                if (word.slice(0, 1) == '-')
                {
                    query.not = true;
                    word = word.slice(1);
                }
                if (word.slice(0, 1) == '"' && word.slice(word.length -1) == '"')
                {
                    query.raw = true;
                    word = word.slice(1, word.length -1);
                }
                query.word = word;
                this.queries.push(query);
            }
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
