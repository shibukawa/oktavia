__export__ class JsonResultItem
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

__export__ class JsonProposalItem
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

__export__ class JsonResult
{
    var type : string;
    var queryString : string;
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

    function constructor (type : string, queryString : string)
    {
        this.type = type;
        this.queryString = queryString;
        this.errorMessage = '';
        this.results = [] : JsonResultItem[];
        this.proposals = [] : JsonProposalItem[];
        this.pageIndexes = [] : string[];
    }

    __noexport__ function constructor (type : string, queryString : string, errorMessage : string)
    {
        this.type = type;
        this.queryString = queryString;
        this.errorMessage = errorMessage;
        this.results = [] : JsonResultItem[];
        this.proposals = [] : JsonProposalItem[];
        this.pageIndexes = [] : string[];
    }

    static function fromJSON (json : variant) : JsonResult
    {
        var result = new JsonResult(json['type'] as string, json['queryString'] as string);
        return result;
    }
}
