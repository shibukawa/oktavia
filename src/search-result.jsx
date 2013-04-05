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

class SearchUnit
{
    var positions : Map.<Position>;
    var id : int;
    var _size : int;
    var score : int;
    var startPosition : int;

    function constructor (id : int)
    {
        this.positions = {} : Map.<Position>;
        this.id = id;
        this._size = 0;
        this.score = 0;
        this.startPosition = -1;
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

    function merge (rhs : SearchUnit) : void
    {
        for (var position in rhs.positions)
        {
            var pos = rhs.positions[position];
            this.addPosition(pos.word, pos.position, pos.stemmed);
        }
    }

    function getPositions () : Position[]
    {
        var result = [] : Position[];
        for (var pos in this.positions)
        {
            result.push(this.positions[pos]);
        }
        result.sort((a : Position, b : Position) -> ((a.position - b.position) as number));
        return result;
    }
}

class SingleResult
{
    var units : SearchUnit[];
    var unitIds : int[];
    var or : boolean;
    var not : boolean;
    var searchWord : string;

    function constructor ()
    {
        this.units = [] : SearchUnit[];
        this.unitIds = [] : int[];
        this.or = false;
        this.not = false;
        this.searchWord = '';
    }

    function constructor (searchWord : string, or : boolean, not : boolean)
    {
        this.units = [] : SearchUnit[];
        this.unitIds = [] : int[];
        this.or = or;
        this.not = not;
        this.searchWord = searchWord;
    }

    function getSearchUnit (unitId : int) : SearchUnit
    {
        var existing = this.unitIds.indexOf(unitId);
        var result : SearchUnit;
        if (existing == -1)
        {
            result = new SearchUnit(unitId);
            this.units.push(result);
            this.unitIds.push(unitId);
        }
        else
        {
            result = this.units[existing];
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
        return this.units.length;
    }

    function _andMerge (result : SingleResult, rhs : SingleResult) : void
    {
        for (var i = 0; i < this.unitIds.length; i++)
        {
            var id = this.unitIds[i];
            if (rhs.unitIds.indexOf(id) != -1)
            {
                var lhsSection = this.units[i];
                result.unitIds.push(id);
                result.units.push(lhsSection);
            }
        }
    }

    function _orMerge (result : SingleResult, rhs : SingleResult) : void
    {
        result.unitIds = this.unitIds.slice(0, this.unitIds.length);
        result.units = this.units.slice(0, this.units.length);

        for (var i = 0; i < rhs.unitIds.length; i++)
        {
            var id = rhs.unitIds[i];
            var rhsSection = rhs.units[i];
            if (result.unitIds.indexOf(id) != -1)
            {
                var lhsSection = result.units[result.unitIds.indexOf(id)];
                lhsSection.merge(rhsSection);
            }
            else
            {
                result.unitIds.push(id);
                result.units.push(rhsSection);
            }
        }
    }

    function _notMerge (result : SingleResult, rhs : SingleResult) : void
    {
        for (var i = 0; i < this.unitIds.length; i++)
        {
            var id = this.unitIds[i];
            if (rhs.unitIds.indexOf(id) == -1)
            {
                var lhsSection = this.units[i];
                result.unitIds.push(id);
                result.units.push(lhsSection);
            }
        }
    }
}

class SearchSummary
{
    var sourceResults : SingleResult[];
    var result : Nullable.<SingleResult>;
    var oktavia : Nullable.<Oktavia>;

    function constructor()
    {
        this.sourceResults = [] : SingleResult[];
        this.result = null;
        this.oktavia = null;
    }

    function constructor (oktavia : Oktavia)
    {
        this.sourceResults = [] : SingleResult[];
        this.result = null;
        this.oktavia = oktavia;
    }

    function addQuery(result : SingleResult) : void
    {
        this.sourceResults.push(result);
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

    function getProposal () : Proposal[]
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
        proposals.sort((a : Proposal, b : Proposal) -> ((b.expect - a.expect) as number));
        return proposals;
    }

    function getSortedResult () : SearchUnit[]
    {
        var result = this.result.units.slice(0, this.result.units.length);
        result.sort((a : SearchUnit, b : SearchUnit) -> ((b.score - a.score) as number));
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

