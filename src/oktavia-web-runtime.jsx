import "console.jsx";
import "binary-io.jsx";
import "query.jsx";
import "query-string-parser.jsx";
import "stemmer.jsx";
import "js.jsx";
import "js/web.jsx";
import "./search-result.jsx";
import "./style.jsx";
import "./oktavia.jsx";
import "./base64.jsx";
import "./webworker.jsx";
import "./oktavia-web-result.jsx";

// import "danish-stemmer.jsx";
// import "dutch-stemmer.jsx";
// import "english-stemmer.jsx";
// import "finnish-stemmer.jsx";
// import "french-stemmer.jsx";
// import "german-stemmer.jsx";
// import "hungarian-stemmer.jsx";
// import "italian-stemmer.jsx";
// import "norwegian-stemmer.jsx";
// import "porter-stemmer.jsx";
// import "portuguese-stemmer.jsx";
// import "romanian-stemmer.jsx";
// import "russian-stemmer.jsx";
// import "spanish-stemmer.jsx";
// import "swedish-stemmer.jsx";
// import "turkish-stemmer.jsx";


class OktaviaSearchResultCache
{
    var queryString : string;
    var queries : Query[];
    var highlight : string;
    var currentPage : int;
    var results : SearchUnit[];
    var renderedResults : JsonResultItem[];
    var renderedProposals : JsonProposalItem[];

    function constructor (queryString : string)
    {
        this.queryString = queryString;
        var queryParser = new QueryStringParser();
        this.queries = queryParser.parse(queryString);
        this.highlight = queryParser.highlight();
        this.results = [] : SearchUnit[];
        this.renderedResults = [] : JsonResultItem[];
        this.renderedProposals = [] : JsonProposalItem[];
        this.currentPage = 1;
    }

    function generateJSON (entriesPerPage : int, results : JsonResultItem[] = []) : JsonResult
    {
        var result = new JsonResult('result');
        result.totalCount = this.results.length;
        result.totalPage = Math.ceil(this.results.length / entriesPerPage);
        result.currentPage = this.currentPage;
        result.hasPrevPage = (this.currentPage != 1);
        result.hasNextPage = (this.currentPage != result.totalPage);

        if (result.totalCount == 0)
        {
            result.proposals = this.renderedProposals;
        }
        result.results = results;

        result.pageIndexes = OktaviaSearchResultCache._pageIndexes(result.totalPage, this.currentPage);
        result.highlight = this.highlight;
        return result;
    }

    static function _pageIndexes (totalPage : int, currentPage : int) : string[]
    {
        var result = [] : string[];
        if (totalPage < 10)
        {
            for (var i = 1; i <= totalPage; i++)
            {
                result.push(i as string);
            }
        }
        else if (currentPage <= 5)
        {
            for (var i = 1; i <= 7; i++)
            {
                result.push(i as string);
            }
            result.push('...', totalPage as string);
        }
        else if (totalPage - 5 <= currentPage)
        {
            result.push('1', '...');
            for (var i = totalPage - 8; i <= totalPage; i++)
            {
                result.push(i as string);
            }
        }
        else
        {
            result.push('1', '...');
            for (var i = currentPage - 3; i <= currentPage + 3; i++)
            {
                result.push(i as string);
            }
            result.push('...', totalPage as string);
        }
        return result;
    }

    function renderProposals (proposals : Proposal[]) : void
    {
        var style = new Style('html');

        if (this.queries.length > 1)
        {
            for (var i = 0; i < proposals.length; i++)
            {
                var proposal = proposals[i];
                if (proposal.expect > 0)
                {
                    var label = [] : string[];
                    var option = [] : string[];
                    for (var j = 0; j < this.queries.length; j++)
                    {
                        if (j != proposal.omit)
                        {
                            label.push(style.convert('<hit>' + this.queries[j].toString() + '</hit>'));
                            option.push(this.queries[j].toString());
                        }
                        else
                        {
                            label.push(style.convert('<del>' + this.queries[j].toString() + '</del>'));
                        }
                    }
                    this.renderedProposals.push(new JsonProposalItem(option.join(' '), label.join('&nbsp;'), proposal.expect));
                }
            }
        }
    }
}

class OktaviaSearchRuntime
{
    var _oktavia : Oktavia;
    var _resultCaches : Map.<OktaviaSearchResultCache>;
    var _entriesPerPage : int;

    function constructor (entriesPerPage : int)
    {
        this._oktavia = new Oktavia();
        this._entriesPerPage = entriesPerPage;
        this._resultCaches = {} : Map.<OktaviaSearchResultCache>;
    }

    function loadIndex () : void
    {
        var index = js.global["searchIndex"] as string;
        this._oktavia.load(Base64.atob(index));
    }

    function search (queryString : string) : JsonResult
    {
        if (this._resultCaches.hasOwnProperty(queryString))
        {
            var cache = this._resultCaches[queryString];
            cache.currentPage = 1;
            var resultItems = this._renderResultItem(cache);
            var result = cache.generateJSON(this._entriesPerPage, resultItems);
        }
        else
        {
            var cache = new OktaviaSearchResultCache(queryString);
            var summary = this._oktavia.search(cache.queries);
            if (summary.size() > 0)
            {
                cache.results = this._sortResult(summary);
                var resultItems = this._renderResultItem(cache);
                var result = cache.generateJSON(this._entriesPerPage, resultItems);
            }
            else
            {
                var result = cache.generateJSON(this._entriesPerPage);
                if (cache.queries.length > 1)
                {
                    cache.renderProposals(summary.getProposals());
                }
            }
        }
        return result;
    }

    function getPage(queryString : string, page : int) : JsonResult
    {
        if (this._resultCaches.hasOwnProperty(queryString))
        {
            var cache = this._resultCaches[queryString];
            cache.currentPage = page;
            var resultItems = this._renderResultItem(cache);
            var result = cache.generateJSON(this._entriesPerPage, resultItems);
        }
        else
        {
            var result = this.search(queryString);
        }
        return result;
    }

    function _renderResultItem (cache : OktaviaSearchResultCache) : JsonResultItem[]
    {
        var results = [] : JsonResultItem[];
        var style = new Style('html');
        var start = (cache.currentPage - 1) * this._entriesPerPage;
        var last = Math.min(cache.currentPage * this._entriesPerPage, cache.results.length);
        var metadata = this._oktavia.getPrimaryMetadata();
        var num = 250;

        for (var i = start; i < last; i++)
        {
            if (cache.renderedResults[i])
            {
                results.push(cache.renderedResults[i]);
            }
            var unit = cache.results[i];
            var info = metadata.getInformation(unit.id).split(Oktavia.eob);

            //var offset = info[0].length + 1;
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
                text = content.slice(0, Math.floor(num / 2))
                    + ' ...<br/>' + content.slice(-Math.floor(num / 2), end - start);
            }
            else
            {
                text = content.slice(0, end - start) + ' ...<br/>';
            }
            text = text.replace(Oktavia.eob, ' ').replace(/(<br\/>)(<br\/>)+/, '<br/><br/>');
            var resultItem = new JsonResultItem(info[0], info[1], text, unit.score);
            cache.renderedResults[i] = resultItem;
            results.push(resultItem);
        }
        return results;
    }


    function _sortResult (summary : SearchSummary) : SearchUnit[]
    {
        for (var i = 0; i < summary.result.units.length; i++)
        {
            var score = 0;
            var unit = summary.result.units[i];
            for (var pos in unit.positions)
            {
                var position = unit.positions[pos];
                if (this._oktavia.wordPositionType(position.position))
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
}

class _Main
{
    static var instance : OktaviaSearchRuntime;
    static function isWebWorker() : boolean
    {
        return js.global['WorkerLocation'] != null;
    }

    static function main(args : string[]) : void
    {
        _Main.instance = new OktaviaSearchRuntime(10);
        // _Main.instance.setStemmer(new DanishStemmer);
        // _Main.instance.setStemmer(new DutchStemmer);
        // _Main.instance.setStemmer(new EnglishStemmer);
        // _Main.instance.setStemmer(new FinnishStemmer);
        // _Main.instance.setStemmer(new FrenchStemmer);
        // _Main.instance.setStemmer(new GermanStemmer);
        // _Main.instance.setStemmer(new HungarianStemmer);
        // _Main.instance.setStemmer(new ItalianStemmer);
        // _Main.instance.setStemmer(new NorwegianStemmer);
        // _Main.instance.setStemmer(new PorterStemmer);
        // _Main.instance.setStemmer(new PortugueseStemmer);
        // _Main.instance.setStemmer(new RomanianStemmer);
        // _Main.instance.setStemmer(new RussianStemmer);
        // _Main.instance.setStemmer(new SpanishStemmer);
        // _Main.instance.setStemmer(new SwedishStemmer);
        // _Main.instance.setStemmer(new TurkishStemmer);
        _Main.instance.loadIndex();
        if (_Main.isWebWorker())
        {
            self.postMessage({type: "ready"});
        }
    }

    static function onmessage(event : MessageEvent) : void
    {
        var type = event.data['type'] as string;
        switch (type) {
        case 'search':
            var word = event.data['word'] as string;
            self.postMessage(_Main.instance.search(word));
            break;
        case 'getpage':
            var word = event.data['word'] as string;
            var page = event.data['page'] as int;
            self.postMessage(_Main.instance.getPage(word, page));
            break;
        case 'close':
            self.close();
            break;
        }
    }
}
