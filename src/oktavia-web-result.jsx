class JsonResultItem
{
    var title : string;
    var url : string;
    var content : string;
    var score : int;
    function constructor (title : string, url : string, content : string, score : int)
    {
        this.title = title;
        this.url = url;
        this.content = content;
        this.score = score;
    }
}

class JsonProposalItem
{
    var options : string;
    var label : string;
    var count : int;
    function constructor (options : string, label : string, count : int)
    {
        this.options = options;
        this.label = label;
        this.count = count;
    }
}

class JsonResult
{
    var type : string;
    var totalCount : int;
    var currentPage : int;
    var totalPage : int;
    var hasPrevPage : boolean;
    var hasNextPage : boolean;
    var results : JsonResultItem[];
    var proposals : JsonProposalItem[];
    var pageIndexes: string[];
    var highlight: string;
    var errorMessage : string;

    function constructor (type : string, errorMessage : string = '')
    {
        this.type = type;
        this.errorMessage = errorMessage;
        this.results = [] : JsonResultItem[];
        this.proposals = [] : JsonProposalItem[];
        this.pageIndexes = [] : string[];
    }

    static function fromJSON (json : variant) : JsonResult
    {
        var result = new JsonResult(json['type'] as string);
        return result;
    }
}
