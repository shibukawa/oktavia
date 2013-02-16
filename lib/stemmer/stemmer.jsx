interface Stemmer
{
    function stemWord (word : string) : string;
    function stemWords (words : string[]) : string[];
}
