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
        this.oktavia.addWord("stemming baby", true);
        this.section.setTail("doc1");
        this.oktavia.addWord("stemmed babies", true);
        this.section.setTail("doc2");
        this.oktavia.build();
    }

    function test_search_without_stemming () : void
    {
        var results = this.oktavia.rawSearch('baby', false);
        this.expect(results.length).toBe(1);
    }

    function test_search_with_stemming () : void
    {
        var results = this.oktavia.rawSearch('baby', true);
        this.expect(results.length).toBe(1);
    }

    function test_load_dump_and_search_without_stemming () : void
    {
        var dump = this.oktavia.dump();
        var oktavia = new Oktavia();
        oktavia.setStemmer(new EnglishStemmer());
        oktavia.load(dump);
        var results = oktavia.rawSearch('baby', false);
        this.expect(results.length).toBe(1);
    }

    function test_load_dump_and_search_with_stemming () : void
    {
        var dump = this.oktavia.dump();
        var oktavia = new Oktavia();
        oktavia.setStemmer(new EnglishStemmer());
        oktavia.load(dump);
        var results = oktavia.rawSearch('baby', true);
        this.expect(results.length).toBe(1);
    }
}
