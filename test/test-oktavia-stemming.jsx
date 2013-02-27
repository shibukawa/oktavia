import "test-case.jsx";
import "oktavia.jsx";
import "metadata.jsx";
import "stemmer/english-stemmer.jsx";
import "console.jsx";

class _Test extends TestCase
{
    var oktavia : Oktavia;
    var section : Section;

    override function setUp () : void
    {
        this.oktavia = new Oktavia();
        this.oktavia.setStemmer(new EnglishStemmer());
        this.section = this.oktavia.addSection('document');
        this.oktavia.addWord("stemming skiing", true);
        this.section.setTail("doc1");
        this.oktavia.addWord("stemmed skied", true);
        this.section.setTail("doc2");
        this.oktavia.build();

        console.log(this.oktavia._stemmingResult);
    }

    function test_search_without_stemming () : void
    {
        var results = this.oktavia.rawSearch('skied', false);
        this.expect(results.length).toBe(1);
    }

    function test_search_with_stemming () : void
    {
        var results = this.oktavia.rawSearch('skied', true);
        this.expect(results.length).toBe(1);
    }
}
