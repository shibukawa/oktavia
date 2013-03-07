class Query
{
    var word : string;
    var or : boolean;
    var not : boolean;
    var raw : boolean;

    function constructor ()
    {
        this.word = '';
        this.or = false;
        this.not = false;
        this.raw = false;
    }

    override function toString () : string
    {
        var result = [] : string[];
        if (this.or)
        {
            result.push("OR ");
        }
        if (this.not)
        {
            result.push("-");
        }
        if (this.raw)
        {
            result.push('"', this.word, '"');
        }
        else
        {
            result.push(this.word);
        }
        return result.join('');
    }
}
