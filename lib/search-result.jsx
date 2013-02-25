import "oktavia.jsx";

class Proposal
{
    var omit : int;
    var expect : int;
    function constructor (omit : int, expect : int)
    {
        this.omit = omit;
        this.expect = expect;
    }
}

class Position
{
    var word : string;
    var position : int;
    var stemmed : boolean;
    function constructor (word : string, position : int, stemmed : boolean)
    {
        this.word = word;
        this.position = position;
        this.stemmed = stemmed;
    }
}

class SectionResult
{
    var positions : Map.<Position>;
    var id : int;
    var _size : int;
    var score : int;

    function constructor (id : int)
    {
        this.positions = {} : Map.<Position>;
        this.id = id;
        this._size = 0;
        this.score = 0;
    }

    function addPosition (word : string, position : int, stemmed : boolean) : void
    {
        var positionObj = this.positions[position as string];
        if (!positionObj)
        {
            this._size++;
            this.positions[position as string] = new Position(word, position, stemmed);
        }
        else
        {
            if (positionObj.word.length < word.length)
            {
                positionObj.word = word;
            }
            positionObj.stemmed = positionObj.stemmed && stemmed;
        }
    }

    function get (position : int) : Nullable.<Position>
    {
        return this.positions[position as string];
    }

    function size () : int
    {
        return this._size;
    }

    function merge (rhs : SectionResult) : void
    {
        for (var position in rhs.positions)
        {
            var pos = rhs.positions[position];
            this.addPosition(pos.word, pos.position, pos.stemmed);
        }
    }
}

class SingleResult
{
    var sections : SectionResult[];
    var sectionIds : int[];
    var or : boolean;
    var not : boolean;
    var searchWord : string;

    function constructor ()
    {
        this.sections = [] : SectionResult[];
        this.sectionIds = [] : int[];
        this.or = false;
        this.not = false;
        this.searchWord = '';
    }

    function getSection (sectionId : int) : SectionResult
    {
        var existing = this.sectionIds.indexOf(sectionId);
        var result : SectionResult;
        if (existing == -1)
        {
            result = new SectionResult(sectionId);
            this.sections.push(result);
            this.sectionIds.push(sectionId);
        }
        else
        {
            var index = this.sectionIds[existing];
            result = this.sections[index];
        }
        return result;
    }

    function merge (rhs : SingleResult) : SingleResult
    {
        var result = new SingleResult();
        if (rhs.or)
        {
            this._orMerge(result, rhs);
        }
        else if (rhs.not)
        {
            this._notMerge(result, rhs);
        }
        else
        {
            this._andMerge(result, rhs);
        }
        return result;
    }

    function size () : int
    {
        return this.sections.length;
    }

    function _andMerge (result : SingleResult, rhs : SingleResult) : void
    {
        for (var i = 0; i < this.sectionIds.length; i++)
        {
            var id = this.sectionIds[i];
            if (rhs.sectionIds.indexOf(id) != -1)
            {
                var lhsSection = this.sections[i];
                result.sectionIds.push(id);
                result.sections.push(lhsSection);
            }
        }
    }

    function _orMerge (result : SingleResult, rhs : SingleResult) : void
    {
        result.sectionIds = this.sectionIds.slice(0, this.sectionIds.length);
        result.sections = this.sections.slice(0, this.sections.length);

        for (var i = 0; i < rhs.sectionIds.length; i++)
        {
            var id = rhs.sectionIds[i];
            var rhsSection = rhs.sections[i];
            if (result.sectionIds.indexOf(id) != -1)
            {
                var lhsSection = result.sections[result.sectionIds.indexOf(id)];
                lhsSection.merge(rhsSection);
            }
            else
            {
                result.sectionIds.push(id);
                result.sections.push(rhsSection);
            }
        }
    }

    function _notMerge (result : SingleResult, rhs : SingleResult) : void
    {
        for (var i = 0; i < this.sectionIds.length; i++)
        {
            var id = this.sectionIds[i];
            if (rhs.sectionIds.indexOf(id) == -1)
            {
                var lhsSection = this.sections[i];
                result.sectionIds.push(id);
                result.sections.push(lhsSection);
            }
        }
    }
}

class SearchSummary
{
    var sourceResults : SingleResult[];
    var result : SingleResult;
    var oktavia : Nullable.<Oktavia>;

    function constructor()
    {
        this.sourceResults = [] : SingleResult[];
        this.oktavia = null;
    }

    function constructor (oktavia : Oktavia)
    {
        this.sourceResults = [] : SingleResult[];
        this.oktavia = oktavia;
    }

    function mergeResult () : void
    {
        this.result = this.mergeResult(this.sourceResults);
    }

    function mergeResult (results : SingleResult[]) : SingleResult
    {
        var rhs = results[0];
        for (var i = 1; i < results.length; i++)
        {
            rhs = rhs.merge(results[i]);
        }
        return rhs;
    }

    function proposal () : Proposal[]
    {
        var proposals = [] : Proposal[];
        for (var i = 0; i < this.sourceResults.length; i++)
        {
            var tmpSource = [] : SingleResult[];
            for (var j = 0; j < this.sourceResults.length; j++)
            {
                if (i != j)
                {
                    tmpSource.push(this.sourceResults[j]);
                }
            }
            var result = this.mergeResult(tmpSource);
            proposals.push(new Proposal(i, result.size()));
        }
        proposals.sort((a : Proposal, b : Proposal) -> (b.expect - a.expect));
        return proposals;
    }

    function sortByScore () : SectionResult[]
    {
        var result = this.result.sections.slice(0, this.result.sections.length);
        result.sort((a : SectionResult, b : SectionResult) -> (b.score - a.score));
        return result;
    }

    function size () : int
    {
        return this.result.size();
    }

    function add (result : SingleResult) : void
    {
        this.sourceResults.push(result);
    }
}

