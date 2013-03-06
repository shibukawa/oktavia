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
}
