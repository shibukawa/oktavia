import "test-case.jsx";
import "search-result.jsx";


class _Test extends TestCase
{
    function test_simple_registration () : void
    {
        var result = new SingleResult();
        var section = result.getSearchUnit(0);
        section.addPosition('hello', 0, false);
        section.addPosition('world', 7, false);
        this.expect(section.size()).toBe(2);
    }

    function test_duplicate_longer_word_is_kept () : void
    {
        var result = new SingleResult();
        var section = result.getSearchUnit(0);
        section.addPosition('hello', 0, false);
        section.addPosition('hello world', 0, false);
        var position = section.get(0);

        this.expect(section.size()).toBe(1);
        this.expect(position.word).toBe('hello world');
    }

    function test_duplicate_no_stemmed_word_is_kept () : void
    {
        var result = new SingleResult();
        var section = result.getSearchUnit(0);
        section.addPosition('hello', 0, true);
        section.addPosition('hello', 0, false);
        var position = section.get(0);

        this.expect(section.size()).toBe(1);
        this.expect(position.stemmed).toBe(false);
    }

    function test_and_merge () : void
    {
        var result1 = new SingleResult();
        result1.getSearchUnit(0);
        result1.getSearchUnit(1);

        var result2 = new SingleResult();
        result2.getSearchUnit(0);

        var result3 = result1.merge(result2);

        this.expect(result3.size()).toBe(1);
    }

    function test_and_merge_2 () : void
    {
        var result1 = new SingleResult();
        result1.getSearchUnit(0);
        result1.getSearchUnit(1);

        var result2 = new SingleResult();
        result2.getSearchUnit(2);

        var result3 = result1.merge(result2);

        this.expect(result3.size()).toBe(0);
    }

    function test_or_merge () : void
    {
        var result1 = new SingleResult();
        result1.getSearchUnit(0);
        result1.getSearchUnit(1);

        var result2 = new SingleResult();
        result2.getSearchUnit(0);
        result2.getSearchUnit(2);
        result2.or = true;

        var result3 = result1.merge(result2);

        this.expect(result3.size()).toBe(3);
    }

    function test_not_merge () : void
    {
        var result1 = new SingleResult();
        result1.getSearchUnit(0);
        result1.getSearchUnit(1);
        result1.getSearchUnit(2);

        var result2 = new SingleResult();
        result2.getSearchUnit(0);
        result2.getSearchUnit(2);
        result2.not = true;

        var result3 = result1.merge(result2);

        this.expect(result3.size()).toBe(1);
    }

    function test_merge () : void
    {
        var summary = new SearchSummary();
        var singleresult1 = new SingleResult();
        singleresult1.getSearchUnit(0);
        singleresult1.getSearchUnit(1);

        var singleresult2 = new SingleResult();
        singleresult2.getSearchUnit(1);

        summary.add(singleresult1);
        summary.add(singleresult2);
        summary.mergeResult();

        this.expect(summary.size()).toBe(1);
    }

    function test_proposal () : void
    {
        var summary = new SearchSummary();
        var singleresult1 = new SingleResult();
        singleresult1.getSearchUnit(0);
        singleresult1.getSearchUnit(1);

        var singleresult2 = new SingleResult();
        singleresult2.getSearchUnit(2);

        summary.add(singleresult1);
        summary.add(singleresult2);

        var proposal = summary.getProposal();

        this.expect(proposal[0].omit).toBe(1);
        this.expect(proposal[0].expect).toBe(2);
        this.expect(proposal[1].omit).toBe(0);
        this.expect(proposal[1].expect).toBe(1);
    }

    function test_sort () : void
    {
        var summary = new SearchSummary();
        var singleresult = new SingleResult();
        var section1 = singleresult.getSearchUnit(0);
        var section2 = singleresult.getSearchUnit(1);
        var section3 = singleresult.getSearchUnit(2);

        summary.add(singleresult);
        summary.mergeResult();
        summary.result.getSearchUnit(0).score = 100;
        summary.result.getSearchUnit(1).score = 300;
        summary.result.getSearchUnit(2).score = 200;

        var result = summary.getSortedResult();
        this.expect(result.length).toBe(3);
        this.expect(result[0].id).toBe(1);
        this.expect(result[1].id).toBe(2);
        this.expect(result[2].id).toBe(0);
    }
}
