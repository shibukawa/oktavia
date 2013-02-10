interface Stemmer
{
    function stem (input : string) : string;
    function stem (input : string, repeat : int) : string;
}
