// generatedy by JSX compiler 0.9.24 (2013-04-05 13:45:00 +0900; 1b229cc6a411f674f0f7cf7a79b7a8b3f8eb7414)
var JSX = {};
(function (JSX) {
/**
 * copies the implementations from source interface to target
 */
function $__jsx_merge_interface(target, source) {
	for (var k in source.prototype)
		if (source.prototype.hasOwnProperty(k))
			target.prototype[k] = source.prototype[k];
}

/**
 * defers the initialization of the property
 */
function $__jsx_lazy_init(obj, prop, func) {
	function reset(obj, prop, value) {
		delete obj[prop];
		obj[prop] = value;
		return value;
	}

	Object.defineProperty(obj, prop, {
		get: function () {
			return reset(obj, prop, func());
		},
		set: function (v) {
			reset(obj, prop, v);
		},
		enumerable: true,
		configurable: true
	});
}

/**
 * sideeffect().a /= b
 */
function $__jsx_div_assign(obj, prop, divisor) {
	return obj[prop] = (obj[prop] / divisor) | 0;
}

/*
 * global functions, renamed to avoid conflict with local variable names
 */
var $__jsx_parseInt = parseInt;
var $__jsx_parseFloat = parseFloat;
var $__jsx_isNaN = isNaN;
var $__jsx_isFinite = isFinite;

var $__jsx_encodeURIComponent = encodeURIComponent;
var $__jsx_decodeURIComponent = decodeURIComponent;
var $__jsx_encodeURI = encodeURI;
var $__jsx_decodeURI = decodeURI;

var $__jsx_ObjectToString = Object.prototype.toString;
var $__jsx_ObjectHasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * profiler object, initialized afterwards
 */
function $__jsx_profiler() {
}

/*
 * public interface to JSX code
 */
JSX.require = function (path) {
	var m = $__jsx_classMap[path];
	return m !== undefined ? m : null;
};

JSX.profilerIsRunning = function () {
	return $__jsx_profiler.getResults != null;
};

JSX.getProfileResults = function () {
	return ($__jsx_profiler.getResults || function () { return {}; })();
};

JSX.postProfileResults = function (url, cb) {
	if ($__jsx_profiler.postResults == null)
		throw new Error("profiler has not been turned on");
	return $__jsx_profiler.postResults(url, cb);
};

JSX.resetProfileResults = function () {
	if ($__jsx_profiler.resetResults == null)
		throw new Error("profiler has not been turned on");
	return $__jsx_profiler.resetResults();
};
JSX.DEBUG = false;
/**
 * class _Main extends Object
 * @constructor
 */
function _Main() {
}

/**
 * @constructor
 */
function _Main$() {
};

_Main$.prototype = new _Main;

/**
 * @param {Array.<undefined|!string>} args
 */
_Main.main$AS = function (args) {
	OktaviaSearch$setStemmer$LStemmer$(new PortugueseStemmer$());
};

var _Main$main$AS = _Main.main$AS;

/**
 * class _Result extends Object
 * @constructor
 */
function _Result() {
}

/**
 * @constructor
 * @param {!string} title
 * @param {!string} url
 * @param {!string} content
 * @param {!number} score
 */
function _Result$SSSI(title, url, content, score) {
	this.title = title;
	this.url = url;
	this.content = content;
	this.score = score;
};

_Result$SSSI.prototype = new _Result;

/**
 * class _Proposal extends Object
 * @constructor
 */
function _Proposal() {
}

/**
 * @constructor
 * @param {!string} options
 * @param {!string} label
 * @param {!number} count
 */
function _Proposal$SSI(options, label, count) {
	this.options = options;
	this.label = label;
	this.count = count;
};

_Proposal$SSI.prototype = new _Proposal;

/**
 * class OktaviaSearch extends Object
 * @constructor
 */
function OktaviaSearch() {
}

/**
 * @constructor
 * @param {!number} entriesPerPage
 */
function OktaviaSearch$I(entriesPerPage) {
	this._queries = null;
	this._highlight = "";
	this._result = null;
	this._proposals = null;
	this._currentFolderDepth = 0;
	this._oktavia = new Oktavia$();
	this._entriesPerPage = entriesPerPage;
	this._currentPage = 1;
	this._queryString = null;
	this._callback = null;
	OktaviaSearch._instance = this;
};

OktaviaSearch$I.prototype = new OktaviaSearch;

/**
 * @param {Stemmer} stemmer
 */
OktaviaSearch.setStemmer$LStemmer$ = function (stemmer) {
	/** @type {Oktavia} */
	var this$0;
	if (OktaviaSearch._instance) {
		this$0 = OktaviaSearch._instance._oktavia;
		this$0._stemmer = stemmer;
	} else {
		OktaviaSearch._stemmer = stemmer;
	}
};

var OktaviaSearch$setStemmer$LStemmer$ = OktaviaSearch.setStemmer$LStemmer$;

/**
 * @param {!string} index
 */
OktaviaSearch.prototype.loadIndex$S = function (index) {
	/** @type {Oktavia} */
	var this$0;
	/** @type {Stemmer} */
	var stemmer$0;
	if (OktaviaSearch._stemmer) {
		this$0 = this._oktavia;
		stemmer$0 = OktaviaSearch._stemmer;
		this$0._stemmer = stemmer$0;
	}
	this._oktavia.load$S(Binary$base64decode$S(index));
	if (this._queryString) {
		this.search$SF$IIV$(this._queryString, this._callback);
		this._queryString = null;
		this._callback = null;
	}
};

/**
 * @param {!string} queryString
 * @param {*} callback
 */
OktaviaSearch.prototype.search$SF$IIV$ = function (queryString, callback) {
	/** @type {QueryStringParser} */
	var queryParser;
	/** @type {SearchSummary} */
	var summary;
	/** @type {Array.<undefined|SearchUnit>} */
	var _result$0;
	if (this._oktavia) {
		queryParser = ({queries: [  ]});
		this._queries = QueryStringParser$parse$LQueryStringParser$S(queryParser, queryString);
		this._highlight = QueryStringParser$highlight$LQueryStringParser$(queryParser);
		summary = this._oktavia.search$ALQuery$(this._queries);
		if (SearchSummary$size$LSearchSummary$(summary) > 0) {
			this._result = this._sortResult$LSearchSummary$(summary);
			this._proposals = [  ];
			this._currentPage = 1;
		} else {
			this._result = [  ];
			if (this._queries.length > 1) {
				this._proposals = SearchSummary$getProposal$LSearchSummary$(summary);
			} else {
				this._proposals = [  ];
			}
			this._currentPage = 1;
		}
		callback((_result$0 = this._result).length, Math.ceil(_result$0.length / this._entriesPerPage));
	} else {
		this._queryString = queryString;
		this._callback = callback;
	}
};

/**
 * @return {!number}
 */
OktaviaSearch.prototype.resultSize$ = function () {
	return (this._result.length | 0);
};

/**
 * @return {!number}
 */
OktaviaSearch.prototype.totalPages$ = function () {
	return (Math.ceil(this._result.length / this._entriesPerPage) | 0);
};

/**
 * @return {!number}
 */
OktaviaSearch.prototype.currentPage$ = function () {
	return this._currentPage;
};

/**
 * @param {!number} page
 */
OktaviaSearch.prototype.setCurrentPage$I = function (page) {
	this._currentPage = page;
};

/**
 * @return {!boolean}
 */
OktaviaSearch.prototype.hasPrevPage$ = function () {
	return this._currentPage !== 1;
};

/**
 * @return {!boolean}
 */
OktaviaSearch.prototype.hasNextPage$ = function () {
	return this._currentPage !== Math.ceil(this._result.length / this._entriesPerPage);
};

/**
 * @return {Array.<undefined|!string>}
 */
OktaviaSearch.prototype.pageIndexes$ = function () {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var total;
	/** @type {!number} */
	var i;
	result = [  ];
	total = Math.ceil(this._result.length / this._entriesPerPage);
	if (total < 10) {
		for (i = 1; i <= total; i++) {
			result.push(i + "");
		}
	} else {
		if (this._currentPage <= 5) {
			for (i = 1; i <= 7; i++) {
				result.push(i + "");
			}
			result.push('...', total + "");
		} else {
			if (total - 5 <= this._currentPage) {
				result.push('1', '...');
				for (i = total - 8; i <= total; i++) {
					result.push(i + "");
				}
			} else {
				result.push('1', '...');
				for (i = this._currentPage - 3; i <= this._currentPage + 3; i++) {
					result.push(i + "");
				}
				result.push('...', total + "");
			}
		}
	}
	return result;
};

/**
 * @return {Array.<undefined|_Result>}
 */
OktaviaSearch.prototype.getResult$ = function () {
	/** @type {Style} */
	var style;
	/** @type {!number} */
	var start;
	/** @type {!number} */
	var last;
	/** @type {Metadata} */
	var metadata;
	/** @type {!number} */
	var num;
	/** @type {Array.<undefined|_Result>} */
	var results;
	/** @type {!number} */
	var i;
	/** @type {SearchUnit} */
	var unit;
	/** @type {Array.<undefined|!string>} */
	var info;
	/** @type {!string} */
	var content;
	/** @type {Array.<undefined|Position>} */
	var positions;
	/** @type {!number} */
	var end;
	/** @type {!boolean} */
	var split;
	/** @type {!number} */
	var j;
	/** @type {Position} */
	var pos;
	/** @type {!string} */
	var text;
	/** @type {Oktavia} */
	var this$0;
	/** @type {!number} */
	var position$0;
	/** @type {!number} */
	var _currentPage$0;
	/** @type {!number} */
	var _entriesPerPage$0;
	style = new Style$S('html');
	start = ((_currentPage$0 = this._currentPage) - 1) * (_entriesPerPage$0 = this._entriesPerPage);
	last = Math.min(_currentPage$0 * _entriesPerPage$0, this._result.length);
	this$0 = this._oktavia;
	metadata = this$0._metadatas[this$0._metadataLabels[0]];
	num = 250;
	results = [  ];
	for (i = start; i < last; i++) {
		unit = this._result[i];
		info = metadata.getInformation$I(unit.id).split(Oktavia.eob);
		content = metadata.getContent$I(unit.id);
		start = 0;
		positions = SearchUnit$getPositions$LSearchUnit$(unit);
		if (content.indexOf(info[0]) === 1) {
			content = content.slice(info[0].length + 2, content.length);
			start += info[0].length + 2;
		}
		end = start + num;
		split = false;
		if (positions[0].position > end - positions[0].word.length) {
			end = positions[0].position + Math.floor(num / 2);
			split = true;
		}
		for (j = positions.length - 1; j > -1; j--) {
			pos = positions[j];
			if (pos.position + pos.word.length < end) {
				content = [ content.slice(0, pos.position - start), style.convert$S('<hit>*</hit>').replace('*', content.slice((position$0 = pos.position) - start, position$0 + pos.word.length - start)), content.slice(pos.position + pos.word.length - start, content.length) ].join('');
			}
		}
		if (split) {
			text = [ content.slice(0, Math.floor(num / 2)) + ' ...', content.slice(- Math.floor(num / 2), end - start) ].join('<br/>');
		} else {
			text = content.slice(0, end - start) + ' ...<br/>';
		}
		text = text.replace(Oktavia.eob, ' ').replace(/(<br\/>)(<br\/>)+/, '<br/><br/>');
		results.push(({title: info[0], url: info[1], content: text, score: unit.score}));
	}
	return results;
};

/**
 * @return {!string}
 */
OktaviaSearch.prototype.getHighlight$ = function () {
	return this._highlight;
};

/**
 * @return {Array.<undefined|_Proposal>}
 */
OktaviaSearch.prototype.getProposals$ = function () {
	/** @type {Style} */
	var style;
	/** @type {Array.<undefined|_Proposal>} */
	var results;
	/** @type {!number} */
	var i;
	/** @type {Proposal} */
	var proposal;
	/** @type {Array.<undefined|!string>} */
	var label;
	/** @type {Array.<undefined|!string>} */
	var option;
	/** @type {!number} */
	var j;
	style = new Style$S('html');
	results = [  ];
	if (this._queries.length > 1) {
		for (i = 0; i < this._proposals.length; i++) {
			proposal = this._proposals[i];
			if (proposal.expect > 0) {
				label = [  ];
				option = [  ];
				for (j = 0; j < this._queries.length; j++) {
					if (j !== proposal.omit) {
						label.push(style.convert$S('<hit>' + this._queries[j].toString() + '</hit>'));
						option.push(this._queries[j].toString());
					} else {
						label.push(style.convert$S('<del>' + this._queries[j].toString() + '</del>'));
					}
				}
				results.push(({options: option.join(' '), label: label.join('&nbsp;'), count: proposal.expect}));
			}
		}
	}
	return results;
};

/**
 * @param {SearchSummary} summary
 * @return {Array.<undefined|SearchUnit>}
 */
OktaviaSearch.prototype._sortResult$LSearchSummary$ = function (summary) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var score;
	/** @type {SearchUnit} */
	var unit;
	/** @type {!string} */
	var pos;
	/** @type {Position} */
	var position;
	for (i = 0; i < summary.result.units.length; i++) {
		score = 0;
		unit = summary.result.units[i];
		for (pos in unit.positions) {
			position = unit.positions[pos];
			if (this._oktavia.wordPositionType$I(position.position)) {
				score += 10;
			} else {
				score += 1;
			}
			if (! position.stemmed) {
				score += 2;
			}
		}
		unit.score = (score | 0);
	}
	return SearchSummary$getSortedResult$LSearchSummary$(summary);
};

/**
 * class _Main$0 extends Object
 * @constructor
 */
function _Main$0() {
}

/**
 * @constructor
 */
function _Main$0$() {
};

_Main$0$.prototype = new _Main$0;

/**
 * @param {Array.<undefined|!string>} args
 */
_Main$0.main$AS = function (args) {
};

var _Main$0$main$AS = _Main$0.main$AS;

/**
 * class Oktavia extends Object
 * @constructor
 */
function Oktavia() {
}

/**
 * @constructor
 */
function Oktavia$() {
	/** @type {Array.<undefined|!string>} */
	var _utf162compressCode$0;
	this._compressCode2utf16 = null;
	this._fmindex = new FMIndex$();
	this._metadatas = ({  });
	this._metadataLabels = [  ];
	this._stemmer = null;
	this._stemmingResult = ({  });
	_utf162compressCode$0 = this._utf162compressCode = [ Oktavia.eof, Oktavia.eob, Oktavia.unknown ];
	_utf162compressCode$0.length = 65536;
	this._compressCode2utf16 = [ Oktavia.eof, Oktavia.eob, Oktavia.unknown ];
};

Oktavia$.prototype = new Oktavia;

/**
 * @param {Stemmer} stemmer
 */
Oktavia.prototype.setStemmer$LStemmer$ = function (stemmer) {
	this._stemmer = stemmer;
};

/**
 * @return {Metadata}
 */
Oktavia.prototype.getPrimaryMetadata$ = function () {
	return this._metadatas[this._metadataLabels[0]];
};

/**
 * @param {!string} key
 * @return {Section}
 */
Oktavia.prototype.addSection$S = function (key) {
	/** @type {Section} */
	var section;
	if (this._metadataLabels.indexOf(key) !== -1) {
		throw new Error('Metadata name ' + key + ' is already exists');
	}
	this._metadataLabels.push(key);
	section = new Section$LOktavia$(this);
	this._metadatas[key] = section;
	return section;
};

/**
 * @param {!string} key
 * @return {Section}
 */
Oktavia.prototype.getSection$S = function (key) {
	if (this._metadataLabels.indexOf(key) === -1) {
		throw new Error('Metadata name ' + key + " does't exists");
	}
	return this._metadatas[key];
};

/**
 * @param {!string} key
 * @return {Splitter}
 */
Oktavia.prototype.addSplitter$S = function (key) {
	/** @type {Splitter} */
	var splitter;
	if (this._metadataLabels.indexOf(key) !== -1) {
		throw new Error('Metadata name ' + key + ' is already exists');
	}
	this._metadataLabels.push(key);
	splitter = new Splitter$LOktavia$(this);
	this._metadatas[key] = splitter;
	return splitter;
};

/**
 * @param {!string} key
 * @return {Splitter}
 */
Oktavia.prototype.getSplitter$S = function (key) {
	if (this._metadataLabels.indexOf(key) === -1) {
		throw new Error('Metadata name ' + key + " does't exists");
	}
	return this._metadatas[key];
};

/**
 * @param {!string} key
 * @param {Array.<undefined|!string>} headers
 * @return {Table}
 */
Oktavia.prototype.addTable$SAS = function (key, headers) {
	/** @type {Table} */
	var table;
	if (this._metadataLabels.indexOf(key) !== -1) {
		throw new Error('Metadata name ' + key + ' is already exists');
	}
	this._metadataLabels.push(key);
	table = new Table$LOktavia$AS(this, headers);
	this._metadatas[key] = table;
	return table;
};

/**
 * @param {!string} key
 * @return {Table}
 */
Oktavia.prototype.getTable$S = function (key) {
	if (this._metadataLabels.indexOf(key) === -1) {
		throw new Error('Metadata name ' + key + " does't exists");
	}
	return this._metadatas[key];
};

/**
 * @param {!string} key
 * @return {Block}
 */
Oktavia.prototype.addBlock$S = function (key) {
	/** @type {Block} */
	var block;
	if (this._metadataLabels.indexOf(key) !== -1) {
		throw new Error('Metadata name ' + key + ' is already exists');
	}
	this._metadataLabels.push(key);
	block = new Block$LOktavia$(this);
	this._metadatas[key] = block;
	return block;
};

/**
 * @param {!string} key
 * @return {Block}
 */
Oktavia.prototype.getBlock$S = function (key) {
	if (this._metadataLabels.indexOf(key) === -1) {
		throw new Error('Metadata name ' + key + " does't exists");
	}
	return this._metadatas[key];
};

/**
 */
Oktavia.prototype.addEndOfBlock$ = function () {
	this._fmindex.push$S(Oktavia.eob);
};

/**
 * @param {!string} words
 */
Oktavia.prototype.addWord$S = function (words) {
	/** @type {Array.<undefined|!string>} */
	var str;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var charCode;
	/** @type {undefined|!string} */
	var newCharCode;
	str = [  ];
	str.length = words.length;
	for (i = 0; i < words.length; i++) {
		charCode = words.charCodeAt(i);
		newCharCode = this._utf162compressCode[charCode];
		if (newCharCode == null) {
			newCharCode = String.fromCharCode(this._compressCode2utf16.length);
			this._utf162compressCode[charCode] = newCharCode;
			this._compressCode2utf16.push(String.fromCharCode(charCode));
		}
		str.push(newCharCode);
	}
	this._fmindex.push$S(str.join(''));
};

/**
 * @param {!string} words
 * @param {!boolean} stemming
 */
Oktavia.prototype.addWord$SB = function (words, stemming) {
	/** @type {Array.<undefined|!string>} */
	var wordList;
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var originalWord;
	/** @type {!string} */
	var smallWord;
	/** @type {undefined|!string} */
	var registerWord;
	/** @type {!string} */
	var baseWord;
	/** @type {!string} */
	var compressedCodeWord;
	/** @type {Array.<undefined|!string>} */
	var stemmedList;
	this.addWord$S(words);
	wordList = words.split(/\s+/);
	for (i = 0; i < wordList.length; i++) {
		originalWord = wordList[i];
		smallWord = originalWord.slice(0, 1).toLowerCase() + originalWord.slice(1);
		registerWord = null;
		if (stemming && this._stemmer) {
			baseWord = this._stemmer.stemWord$S(originalWord.toLowerCase());
			if (originalWord.indexOf(baseWord) === -1) {
				registerWord = baseWord;
			}
		} else {
			if (originalWord != smallWord) {
				registerWord = smallWord;
			}
		}
		if (registerWord) {
			compressedCodeWord = this._convertToCompressionCode$S(originalWord);
			stemmedList = this._stemmingResult[registerWord];
			if (! stemmedList) {
				stemmedList = [ compressedCodeWord ];
				this._stemmingResult[registerWord] = stemmedList;
			} else {
				if (stemmedList.indexOf(compressedCodeWord) === -1) {
					stemmedList.push(compressedCodeWord);
				}
			}
		}
	}
};

/**
 * @param {!string} keyword
 * @return {!string}
 */
Oktavia.prototype._convertToCompressionCode$S = function (keyword) {
	/** @type {Array.<undefined|!string>} */
	var resultChars;
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var chr;
	resultChars = [  ];
	for (i = 0; i < keyword.length; i++) {
		chr = this._utf162compressCode[keyword.charCodeAt(i)];
		if (chr == null) {
			resultChars.push(Oktavia.unknown);
		} else {
			resultChars.push(chr);
		}
	}
	return resultChars.join('');
};

/**
 * @param {!string} keyword
 * @param {!boolean} stemming
 * @return {Array.<undefined|!number>}
 */
Oktavia.prototype.rawSearch$SB = function (keyword, stemming) {
	/** @type {Array.<undefined|!number>} */
	var result;
	/** @type {!string} */
	var baseWord;
	/** @type {Array.<undefined|!string>} */
	var stemmedList;
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var word;
	if (stemming) {
		result = [  ];
		if (this._stemmer) {
			baseWord = this._stemmer.stemWord$S(keyword.toLowerCase());
			stemmedList = this._stemmingResult[baseWord];
			if (stemmedList) {
				for (i = 0; i < stemmedList.length; i++) {
					word = stemmedList[i];
					result = result.concat(this._fmindex.search$S(word));
				}
			}
		}
	} else {
		result = this._fmindex.search$S(this._convertToCompressionCode$S(keyword));
	}
	return result;
};

/**
 * @param {Array.<undefined|Query>} queries
 * @return {SearchSummary}
 */
Oktavia.prototype.search$ALQuery$ = function (queries) {
	/** @type {SearchSummary} */
	var summary;
	/** @type {!number} */
	var i;
	/** @type {SingleResult} */
	var result$0;
	summary = ({sourceResults: [  ], result: null, oktavia: this});
	for (i = 0; i < queries.length; i++) {
		result$0 = this._searchQuery$LQuery$(queries[i]);
		summary.sourceResults.push(result$0);
	}
	summary.result = SearchSummary$mergeResult$LSearchSummary$ALSingleResult$(summary, summary.sourceResults);
	return summary;
};

/**
 * @param {Query} query
 * @return {SingleResult}
 */
Oktavia.prototype._searchQuery$LQuery$ = function (query) {
	/** @type {SingleResult} */
	var result;
	/** @type {Array.<undefined|!number>} */
	var positions;
	result = new SingleResult$SBB(query.word, query.or, query.not);
	if (query.raw) {
		positions = this.rawSearch$SB(query.word, false);
	} else {
		positions = this.rawSearch$SB(query.word, false).concat(this.rawSearch$SB(query.word, true));
	}
	this._metadatas[this._metadataLabels[0]].grouping$LSingleResult$AISB(result, positions, query.word, ! query.raw);
	return result;
};

/**
 */
Oktavia.prototype.build$ = function () {
	this.build$IB(5, false);
};

/**
 * @param {!number} cacheDensity
 * @param {!boolean} verbose
 */
Oktavia.prototype.build$IB = function (cacheDensity, verbose) {
	/** @type {!string} */
	var key;
	/** @type {!number} */
	var cacheRange;
	/** @type {!number} */
	var maxChar;
	for (key in this._metadatas) {
		this._metadatas[key]._build$();
	}
	cacheRange = Math.round(Math.max(1, 100 / Math.min(100, Math.max(0.01, cacheDensity))));
	maxChar = this._compressCode2utf16.length;
	this._fmindex.build$SIIB(Oktavia.eof, maxChar, cacheRange, verbose);
};

/**
 * @return {!string}
 */
Oktavia.prototype.dump$ = function () {
	return this.dump$B(false);
};

/**
 * @param {!boolean} verbose
 * @return {!string}
 */
Oktavia.prototype.dump$B = function (verbose) {
	/** @type {!string} */
	var header;
	/** @type {!string} */
	var fmdata;
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	/** @type {CompressionReport} */
	var report;
	/** @type {undefined|!string} */
	var name;
	/** @type {!string} */
	var data;
	header = Binary$dumpString$SLCompressionReport$("oktavia-01", null).slice(1);
	if (verbose) {
		console.log("Source text size: " + (this._fmindex.size$() * 2 + "") + ' bytes');
	}
	fmdata = this._fmindex.dump$B(verbose);
	result = [ header, fmdata ];
	result.push(Binary$dump16bitNumber$I(this._compressCode2utf16.length));
	for (i = 3; i < this._compressCode2utf16.length; i++) {
		result.push(this._compressCode2utf16[i]);
	}
	if (verbose) {
		console.log('Char Code Map: ' + (this._compressCode2utf16.length * 2 - 2 + "") + ' bytes');
	}
	report = ({source: 0, result: 0});
	result.push(Binary$dumpStringListMap$HASLCompressionReport$(this._stemmingResult, report));
	if (verbose) {
		console.log('Stemmed Word Table: ' + (result[result.length - 1].length + "") + ' bytes (' + (Math.round(report.result * 100.0 / report.source) + "") + '%)');
	}
	result.push(Binary$dump16bitNumber$I(this._metadataLabels.length));
	for (i = 0; i < this._metadataLabels.length; i++) {
		report = ({source: 0, result: 0});
		name = this._metadataLabels[i];
		data = this._metadatas[name]._dump$LCompressionReport$(report);
		result.push(Binary$dumpString$SLCompressionReport$(name, report), data);
		if (verbose) {
			console.log('Meta Data ' + name + ': ' + (data.length * 2 + "") + ' bytes (' + (Math.round(report.result * 100.0 / report.source) + "") + '%)');
		}
	}
	return result.join('');
};

/**
 * @param {!string} data
 */
Oktavia.prototype.load$S = function (data) {
	/** @type {!string} */
	var header;
	/** @type {!number} */
	var offset;
	/** @type {!number} */
	var charCodeCount;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var charCode;
	/** @type {LoadedStringListMapResult} */
	var stemmedWords;
	/** @type {!number} */
	var metadataCount;
	/** @type {LoadedStringResult} */
	var nameResult;
	/** @type {!string} */
	var name;
	/** @type {!number} */
	var type;
	header = Binary$dumpString$SLCompressionReport$("oktavia-01", null).slice(1);
	if (data.slice(0, 5) !== header) {
		throw new Error('Invalid data file');
	}
	this._metadatas = ({  });
	this._metadataLabels = [  ];
	offset = 5;
	offset = this._fmindex.load$SI(data, offset);
	charCodeCount = Binary$load16bitNumber$SI(data, offset++);
	this._compressCode2utf16 = [ Oktavia.eof, Oktavia.eob, Oktavia.unknown ];
	this._utf162compressCode = [ Oktavia.eof, Oktavia.eob, Oktavia.unknown ];
	for (i = 3; i < charCodeCount; i++) {
		charCode = Binary$load16bitNumber$SI(data, offset++);
		this._compressCode2utf16.push(String.fromCharCode(charCode));
		this._utf162compressCode[charCode] = String.fromCharCode(i);
	}
	stemmedWords = Binary$loadStringListMap$SI(data, offset);
	this._stemmingResult = stemmedWords.result;
	offset = stemmedWords.offset;
	metadataCount = Binary$load16bitNumber$SI(data, offset++);
	for (i = 0; i < metadataCount; i++) {
		nameResult = Binary$loadString$SI(data, offset);
		name = nameResult.result;
		offset = nameResult.offset;
		type = Binary$load16bitNumber$SI(data, offset++);
		switch (type) {
		case 0:
			offset = Section$_load$LOktavia$SSI(this, name, data, offset);
			break;
		case 1:
			offset = Splitter$_load$LOktavia$SSI(this, name, data, offset);
			break;
		case 2:
			offset = Table$_load$LOktavia$SSI(this, name, data, offset);
			break;
		case 3:
			offset = Block$_load$LOktavia$SSI(this, name, data, offset);
			break;
		}
	}
};

/**
 * @return {!number}
 */
Oktavia.prototype.contentSize$ = function () {
	/** @type {FMIndex} */
	var this$0;
	this$0 = this._fmindex;
	return this$0._substr.length;
};

/**
 * @param {!number} position
 * @return {!number}
 */
Oktavia.prototype.wordPositionType$I = function (position) {
	/** @type {!number} */
	var result;
	/** @type {!string} */
	var ahead;
	result = 0;
	if (position === 0) {
		result = 4;
	} else {
		ahead = this._fmindex.getSubstring$II(position - 1, 1);
		if (/\s/.test(ahead)) {
			result = 2;
		} else {
			if (/\W/.test(ahead)) {
				result = 1;
			} else {
				if (Oktavia.eob === ahead) {
					result = 3;
				}
			}
		}
	}
	return (result | 0);
};

/**
 * @param {!number} position
 * @param {!number} length
 * @return {!string}
 */
Oktavia.prototype._getSubstring$II = function (position, length) {
	/** @type {!string} */
	var result;
	/** @type {Array.<undefined|!string>} */
	var str;
	/** @type {!number} */
	var i;
	result = this._fmindex.getSubstring$II(position, length);
	str = [  ];
	for (i = 0; i < result.length; i++) {
		str.push(this._compressCode2utf16[result.charCodeAt(i)]);
	}
	return str.join('');
};

/**
 * class Binary extends Object
 * @constructor
 */
function Binary() {
}

/**
 * @constructor
 */
function Binary$() {
};

Binary$.prototype = new Binary;

/**
 * @param {!number} num
 * @return {!string}
 */
Binary.dump32bitNumber$N = function (num) {
	/** @type {Array.<undefined|!string>} */
	var result;
	result = [ String.fromCharCode(Math.floor(num / 65536)) ];
	result.push(String.fromCharCode(num % 65536));
	return result.join("");
};

var Binary$dump32bitNumber$N = Binary.dump32bitNumber$N;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {!number}
 */
Binary.load32bitNumber$SI = function (buffer, offset) {
	/** @type {!number} */
	var result;
	result = buffer.charCodeAt(offset) * 65536 + buffer.charCodeAt(offset + 1);
	return result;
};

var Binary$load32bitNumber$SI = Binary.load32bitNumber$SI;

/**
 * @param {!number} num
 * @return {!string}
 */
Binary.dump16bitNumber$I = function (num) {
	return String.fromCharCode(num % 65536);
};

var Binary$dump16bitNumber$I = Binary.dump16bitNumber$I;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {!number}
 */
Binary.load16bitNumber$SI = function (buffer, offset) {
	return (buffer.charCodeAt(offset) | 0);
};

var Binary$load16bitNumber$SI = Binary.load16bitNumber$SI;

/**
 * @param {!string} str
 * @return {!string}
 */
Binary.dumpString$S = function (str) {
	return Binary$dumpString$SLCompressionReport$(str, null);
};

var Binary$dumpString$S = Binary.dumpString$S;

/**
 * @param {!string} str
 * @param {CompressionReport} report
 * @return {!string}
 */
Binary.dumpString$SLCompressionReport$ = function (str, report) {
	/** @type {!number} */
	var length;
	/** @type {!boolean} */
	var compress;
	/** @type {Array.<undefined|!number>} */
	var charCodes;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var charCode;
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {undefined|!number} */
	var bytes;
	if (str.length > 32768) {
		str = str.slice(0, 32768);
	}
	length = str.length;
	compress = true;
	charCodes = [  ];
	for (i = 0; i < length; i++) {
		charCode = str.charCodeAt(i);
		if (charCode > 255) {
			compress = false;
			break;
		}
		charCodes.push(charCode);
	}
	if (compress) {
		result = [ Binary$dump16bitNumber$I(length + 32768) ];
		for (i = 0; i < length; i += 2) {
			bytes = charCodes[i];
			if (i !== length - 1) {
				bytes += charCodes[i + 1] << 8;
			}
			result.push(String.fromCharCode(bytes % 65536));
		}
		if (report) {
			CompressionReport$add$LCompressionReport$II(report, length, Math.ceil(length / 2));
		}
	} else {
		result = [ Binary$dump16bitNumber$I(length), str ];
		if (report) {
			CompressionReport$add$LCompressionReport$II(report, length, length);
		}
	}
	return result.join('');
};

var Binary$dumpString$SLCompressionReport$ = Binary.dumpString$SLCompressionReport$;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {LoadedStringResult}
 */
Binary.loadString$SI = function (buffer, offset) {
	return new LoadedStringResult$SI(buffer, offset);
};

var Binary$loadString$SI = Binary.loadString$SI;

/**
 * @param {Array.<undefined|!string>} strList
 * @return {!string}
 */
Binary.dumpStringList$AS = function (strList) {
	return Binary$dumpStringList$ASLCompressionReport$(strList, null);
};

var Binary$dumpStringList$AS = Binary.dumpStringList$AS;

/**
 * @param {Array.<undefined|!string>} strList
 * @param {CompressionReport} report
 * @return {!string}
 */
Binary.dumpStringList$ASLCompressionReport$ = function (strList, report) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	result = [ Binary$dump32bitNumber$N(strList.length) ];
	for (i = 0; i < strList.length; i++) {
		result.push(Binary$dumpString$SLCompressionReport$(strList[i], report));
	}
	return result.join('');
};

var Binary$dumpStringList$ASLCompressionReport$ = Binary.dumpStringList$ASLCompressionReport$;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {LoadedStringListResult}
 */
Binary.loadStringList$SI = function (buffer, offset) {
	return new LoadedStringListResult$SI(buffer, offset);
};

var Binary$loadStringList$SI = Binary.loadStringList$SI;

/**
 * @param {Object.<string, undefined|Array.<undefined|!string>>} strMap
 * @return {!string}
 */
Binary.dumpStringListMap$HAS = function (strMap) {
	return Binary$dumpStringListMap$HASLCompressionReport$(strMap, null);
};

var Binary$dumpStringListMap$HAS = Binary.dumpStringListMap$HAS;

/**
 * @param {Object.<string, undefined|Array.<undefined|!string>>} strMap
 * @param {CompressionReport} report
 * @return {!string}
 */
Binary.dumpStringListMap$HASLCompressionReport$ = function (strMap, report) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var counter;
	/** @type {!string} */
	var key;
	result = [  ];
	counter = 0;
	for (key in strMap) {
		result.push(Binary$dumpString$SLCompressionReport$(key, report));
		result.push(Binary$dumpStringList$ASLCompressionReport$(strMap[key], report));
		counter++;
	}
	return Binary$dump32bitNumber$N(counter) + result.join('');
};

var Binary$dumpStringListMap$HASLCompressionReport$ = Binary.dumpStringListMap$HASLCompressionReport$;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {LoadedStringListMapResult}
 */
Binary.loadStringListMap$SI = function (buffer, offset) {
	return new LoadedStringListMapResult$SI(buffer, offset);
};

var Binary$loadStringListMap$SI = Binary.loadStringListMap$SI;

/**
 * @param {Array.<undefined|!number>} array
 * @return {!string}
 */
Binary.dump32bitNumberList$AN = function (array) {
	return Binary$dump32bitNumberList$ANLCompressionReport$(array, null);
};

var Binary$dump32bitNumberList$AN = Binary.dump32bitNumberList$AN;

/**
 * @param {Array.<undefined|!number>} array
 * @param {CompressionReport} report
 * @return {!string}
 */
Binary.dump32bitNumberList$ANLCompressionReport$ = function (array, report) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var index;
	/** @type {!number} */
	var inputLength;
	/** @type {!number} */
	var length;
	/** @type {!string} */
	var resultString;
	/** @type {!number} */
	var value1$0;
	/** @type {!number} */
	var value2$0;
	result = [ Binary$dump32bitNumber$N(array.length) ];
	index = 0;
	inputLength = array.length;
	while (index < inputLength) {
		if (array[index] == 0) {
			length = Binary$_countZero$ANI(array, index);
			result.push(Binary$_zeroBlock$I(length));
			index += length;
		} else {
			if (Binary$_shouldZebraCode$ANI(array, index)) {
				result.push(Binary$_createZebraCode$ANI(array, index));
				value1$0 = array.length;
				value2$0 = index + 15;
				index = (value1$0 <= value2$0 ? value1$0 : value2$0);
			} else {
				length = Binary$_searchDoubleZero$ANI(array, index);
				result.push(Binary$_nonZeroBlock$ANII(array, index, length));
				if (length === 0) {
					throw new Error('');
				}
				index += length;
			}
		}
	}
	resultString = result.join('');
	if (report) {
		CompressionReport$add$LCompressionReport$II(report, array.length * 2 + 2, resultString.length);
	}
	return resultString;
};

var Binary$dump32bitNumberList$ANLCompressionReport$ = Binary.dump32bitNumberList$ANLCompressionReport$;

/**
 * @param {!string} buffer
 * @param {!number} offset
 * @return {LoadedNumberListResult}
 */
Binary.load32bitNumberList$SI = function (buffer, offset) {
	return new LoadedNumberListResult$SI(buffer, offset);
};

var Binary$load32bitNumberList$SI = Binary.load32bitNumberList$SI;

/**
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 * @return {!number}
 */
Binary._countZero$ANI = function (array, offset) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var array$len$0;
	for ((i = offset, array$len$0 = array.length); i < array$len$0; i++) {
		if (array[i] != 0) {
			return (i - offset | 0);
		}
	}
	return (array.length - offset | 0);
};

var Binary$_countZero$ANI = Binary._countZero$ANI;

/**
 * @param {!number} length
 * @return {!string}
 */
Binary._zeroBlock$I = function (length) {
	/** @type {Array.<undefined|!string>} */
	var result;
	result = [  ];
	while (length > 0) {
		if (length > 16384) {
			result.push(Binary$dump16bitNumber$I(16383));
			length -= 16384;
		} else {
			result.push(Binary$dump16bitNumber$I(length - 1));
			length = 0;
		}
	}
	return result.join('');
};

var Binary$_zeroBlock$I = Binary._zeroBlock$I;

/**
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 * @return {!boolean}
 */
Binary._shouldZebraCode$ANI = function (array, offset) {
	/** @type {!number} */
	var change;
	/** @type {!boolean} */
	var isLastZero;
	/** @type {!number} */
	var i;
	if (array.length - offset < 16) {
		return true;
	}
	change = 0;
	isLastZero = false;
	for (i = offset; i < offset + 15; i++) {
		if (array[i] == 0) {
			if (! isLastZero) {
				isLastZero = true;
				change++;
			}
		} else {
			if (isLastZero) {
				isLastZero = false;
				change++;
			}
		}
	}
	return change > 2;
};

var Binary$_shouldZebraCode$ANI = Binary._shouldZebraCode$ANI;

/**
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 * @return {!number}
 */
Binary._searchDoubleZero$ANI = function (array, offset) {
	/** @type {!boolean} */
	var isLastZero;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var array$len$0;
	isLastZero = false;
	for ((i = offset, array$len$0 = array.length); i < array$len$0; i++) {
		if (array[i] == 0) {
			if (isLastZero) {
				return (i - offset - 1 | 0);
			}
			isLastZero = true;
		} else {
			isLastZero = false;
		}
	}
	return (array.length - offset | 0);
};

var Binary$_searchDoubleZero$ANI = Binary._searchDoubleZero$ANI;

/**
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 * @param {!number} length
 * @return {!string}
 */
Binary._nonZeroBlock$ANII = function (array, offset, length) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var blockLength;
	/** @type {!number} */
	var i;
	result = [  ];
	while (length > 0) {
		if (length > 16384) {
			blockLength = 16384;
			length -= 16384;
		} else {
			blockLength = length;
			length = 0;
		}
		result.push(Binary$dump16bitNumber$I(blockLength - 1 + 0x4000));
		for (i = offset; i < offset + blockLength; i++) {
			result.push(Binary$dump32bitNumber$N(array[i]));
		}
		offset += blockLength;
	}
	return result.join('');
};

var Binary$_nonZeroBlock$ANII = Binary._nonZeroBlock$ANII;

/**
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 * @return {!string}
 */
Binary._createZebraCode$ANI = function (array, offset) {
	/** @type {!number} */
	var last;
	/** @type {!number} */
	var code;
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var value1$0;
	/** @type {!number} */
	var value2$0;
	value1$0 = offset + 15;
	value2$0 = array.length;
	last = (value1$0 <= value2$0 ? value1$0 : value2$0);
	code = 0x8000;
	result = [  ];
	for (i = offset; i < last; i++) {
		if (array[i] != 0) {
			result.push(Binary$dump32bitNumber$N(array[i]));
			code = code + (0x1 << i - offset);
		}
	}
	return String.fromCharCode(code) + result.join('');
};

var Binary$_createZebraCode$ANI = Binary._createZebraCode$ANI;

/**
 * @param {!string} str
 * @return {!string}
 */
Binary.base64encode$S = function (str) {
	/** @type {Array.<undefined|!string>} */
	var out;
	/** @type {Array.<undefined|!number>} */
	var source;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var code;
	/** @type {!number} */
	var len;
	/** @type {!number} */
	var c1;
	/** @type {undefined|!number} */
	var c2;
	/** @type {undefined|!number} */
	var c3;
	out = [  ];
	source = [  ];
	for (i = 0; i < str.length; i++) {
		code = str.charCodeAt(i);
		source.push(code & 0x00ff, code >>> 8);
	}
	len = str.length * 2;
	i = 0;
	while (i < len) {
		c1 = source[i++] & 0xff;
		if (i === len) {
			out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c1 >> 2));
			out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c1 & 0x3) << 4));
			out.push("==");
			break;
		}
		c2 = source[i++];
		if (i === len) {
			out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c1 >> 2));
			out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4));
			out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c2 & 0xF) << 2));
			out.push("=");
			break;
		}
		c3 = source[i++];
		out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c1 >> 2));
		out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4));
		out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6));
		out.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c3 & 0x3F));
	}
	return out.join('');
};

var Binary$base64encode$S = Binary.base64encode$S;

/**
 * @param {Array.<undefined|!number>} source
 * @return {!string}
 */
Binary._mergeCharCode$AI = function (source) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	result = [  ];
	for (i = 0; i < source.length; i += 2) {
		result.push(String.fromCharCode(source[i] + (source[i + 1] << 8)));
	}
	return result.join('');
};

var Binary$_mergeCharCode$AI = Binary._mergeCharCode$AI;

/**
 * @param {!string} str
 * @return {!string}
 */
Binary.base64decode$S = function (str) {
	/** @type {!number} */
	var len;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|!number>} */
	var out;
	/** @type {undefined|!number} */
	var c1;
	/** @type {undefined|!number} */
	var c2;
	/** @type {!number} */
	var c3;
	/** @type {!number} */
	var c4;
	len = str.length;
	i = 0;
	out = [  ];
	while (i < len) {
		do {
			c1 = Binary._base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c1 == -1);
		if (c1 == -1) {
			break;
		}
		do {
			c2 = Binary._base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c2 == -1);
		if (c2 == -1) {
			break;
		}
		out.push(c1 << 2 | (c2 & 0x30) >> 4);
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 === 61) {
				return Binary$_mergeCharCode$AI(out);
			}
			c3 = Binary._base64DecodeChars[c3];
		} while (i < len && c3 === -1);
		if (c3 === -1) {
			break;
		}
		out.push((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 === 61) {
				return Binary$_mergeCharCode$AI(out);
			}
			c4 = (Binary._base64DecodeChars[c4] | 0);
		} while (i < len && c4 === -1);
		if (c4 === -1) {
			break;
		}
		out.push((c3 & 0x03) << 6 | c4);
	}
	return Binary$_mergeCharCode$AI(out);
};

var Binary$base64decode$S = Binary.base64decode$S;

/**
 * class LoadedStringResult extends Object
 * @constructor
 */
function LoadedStringResult() {
}

/**
 * @constructor
 * @param {!string} data
 * @param {!number} offset
 */
function LoadedStringResult$SI(data, offset) {
	/** @type {!number} */
	var strLength;
	/** @type {Array.<undefined|!string>} */
	var bytes;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var code;
	/** @type {!number} */
	var offset$0;
	this.result = "";
	this.offset = 0;
	offset$0 = offset++;
	strLength = data.charCodeAt(offset$0);
	if (strLength > 32767) {
		strLength = strLength - 32768;
		bytes = [  ];
		for (i = 0; i < strLength; i += 2) {
			code = data.charCodeAt(offset);
			bytes.push(String.fromCharCode(code & 0x00ff));
			if (i !== strLength - 1) {
				bytes.push(String.fromCharCode(code >>> 8));
			}
			offset++;
		}
		this.result = bytes.join('');
		this.offset = offset;
	} else {
		this.result = data.slice(offset, offset + strLength);
		this.offset = (offset + strLength | 0);
	}
};

LoadedStringResult$SI.prototype = new LoadedStringResult;

/**
 * class LoadedStringListResult extends Object
 * @constructor
 */
function LoadedStringListResult() {
}

/**
 * @constructor
 * @param {!string} data
 * @param {!number} offset
 */
function LoadedStringListResult$SI(data, offset) {
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var strLength;
	/** @type {!string} */
	var resultStr;
	/** @type {Array.<undefined|!string>} */
	var bytes;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var code;
	/** @type {!number} */
	var result$0;
	/** @type {!number} */
	var offset$0;
	this.offset = 0;
	this.result = [  ];
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	length = result$0;
	offset += 2;
	for (i = 0; i < length; i++) {
		offset$0 = offset++;
		strLength = data.charCodeAt(offset$0);
		if (strLength > 32767) {
			strLength = strLength - 32768;
			bytes = [  ];
			for (j = 0; j < strLength; j += 2) {
				code = data.charCodeAt(offset);
				bytes.push(String.fromCharCode(code & 0x00ff));
				if (j !== strLength - 1) {
					bytes.push(String.fromCharCode(code >>> 8));
				}
				offset++;
			}
			resultStr = bytes.join('');
		} else {
			resultStr = data.slice(offset, offset + strLength);
			offset = (offset + strLength | 0);
		}
		this.result.push(resultStr);
	}
	this.offset = offset;
};

LoadedStringListResult$SI.prototype = new LoadedStringListResult;

/**
 * class LoadedStringListMapResult extends Object
 * @constructor
 */
function LoadedStringListMapResult() {
}

/**
 * @constructor
 * @param {!string} data
 * @param {!number} offset
 */
function LoadedStringListMapResult$SI(data, offset) {
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var i;
	/** @type {LoadedStringResult} */
	var keyResult;
	/** @type {LoadedStringListResult} */
	var valueResult;
	/** @type {!number} */
	var result$0;
	/** @type {!number} */
	var offset$0;
	this.offset = 0;
	this.result = ({  });
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	length = result$0;
	offset += 2;
	for (i = 0; i < length; i++) {
		keyResult = new LoadedStringResult$SI(data, offset);
		offset$0 = keyResult.offset;
		valueResult = new LoadedStringListResult$SI(data, offset$0);
		this.result[keyResult.result] = valueResult.result;
		offset = valueResult.offset;
	}
	this.offset = offset;
};

LoadedStringListMapResult$SI.prototype = new LoadedStringListMapResult;

/**
 * class LoadedNumberListResult extends Object
 * @constructor
 */
function LoadedNumberListResult() {
}

/**
 * @constructor
 * @param {!string} data
 * @param {!number} offset
 */
function LoadedNumberListResult$SI(data, offset) {
	/** @type {!number} */
	var resultLength;
	/** @type {!number} */
	var originalOffset;
	/** @type {Array.<undefined|!number>} */
	var result;
	/** @type {!number} */
	var tag;
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var result$0;
	/** @type {!number} */
	var value1$0;
	this.result = null;
	this.offset = 0;
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	resultLength = result$0;
	originalOffset = offset;
	offset += 2;
	result = [  ];
	while (result.length < resultLength) {
		tag = data.charCodeAt(offset++);
		if (tag >>> 15 === 1) {
			value1$0 = resultLength - result.length;
			length = (value1$0 <= 15 ? value1$0 : 15);
			for (i = 0; i < length; i++) {
				if (tag >>> i & 0x1) {
					result.push(Binary$load32bitNumber$SI(data, offset));
					offset += 2;
				} else {
					result.push(0);
				}
			}
		} else {
			if (tag >>> 14 === 1) {
				length = tag - 0x4000 + 1;
				for (i = 0; i < length; i++) {
					result.push(Binary$load32bitNumber$SI(data, offset));
					offset += 2;
				}
			} else {
				length = tag + 1;
				for (i = 0; i < length; i++) {
					result.push(0);
				}
			}
		}
	}
	this.result = result;
	this.offset = offset;
};

LoadedNumberListResult$SI.prototype = new LoadedNumberListResult;

/**
 * class CompressionReport extends Object
 * @constructor
 */
function CompressionReport() {
}

/**
 * @constructor
 */
function CompressionReport$() {
	this.source = 0;
	this.result = 0;
};

CompressionReport$.prototype = new CompressionReport;

/**
 * @param {CompressionReport} $this
 * @param {!number} source
 * @param {!number} result
 */
CompressionReport.add$LCompressionReport$II = function ($this, source, result) {
	$this.source += source;
	$this.result += result;
};

var CompressionReport$add$LCompressionReport$II = CompressionReport.add$LCompressionReport$II;

/**
 * @param {CompressionReport} $this
 * @return {!number}
 */
CompressionReport.rate$LCompressionReport$ = function ($this) {
	return (Math.round($this.result * 100.0 / $this.source) | 0);
};

var CompressionReport$rate$LCompressionReport$ = CompressionReport.rate$LCompressionReport$;

/**
 * class Query extends Object
 * @constructor
 */
function Query() {
}

/**
 * @constructor
 */
function Query$() {
	this.word = '';
	this.or = false;
	this.not = false;
	this.raw = false;
};

Query$.prototype = new Query;

/**
 * @return {!string}
 */
Query.prototype.toString = function () {
	/** @type {Array.<undefined|!string>} */
	var result;
	result = [  ];
	if (this.or) {
		result.push("OR ");
	}
	if (this.not) {
		result.push("-");
	}
	if (this.raw) {
		result.push('"', this.word, '"');
	} else {
		result.push(this.word);
	}
	return result.join('');
};

/**
 * class QueryStringParser extends Object
 * @constructor
 */
function QueryStringParser() {
}

/**
 * @constructor
 */
function QueryStringParser$() {
	this.queries = [  ];
};

QueryStringParser$.prototype = new QueryStringParser;

/**
 * @param {QueryStringParser} $this
 * @param {!string} queryString
 * @return {Array.<undefined|Query>}
 */
QueryStringParser.parse$LQueryStringParser$S = function ($this, queryString) {
	/** @type {!boolean} */
	var nextOr;
	/** @type {!boolean} */
	var nextNot;
	/** @type {!number} */
	var currentWordStart;
	/** @type {!number} */
	var status;
	/** @type {RegExp} */
	var isSpace;
	/** @type {!number} */
	var i;
	/** @type {!string} */
	var ch;
	/** @type {!string} */
	var word;
	/** @type {Query} */
	var query;
	nextOr = false;
	nextNot = false;
	currentWordStart = 0;
	status = 0;
	isSpace = /[\s\u3000]/;
	for (i = 0; i < queryString.length; i++) {
		ch = queryString.charAt(i);
		switch (status) {
		case 0:
			if (! isSpace.test(ch)) {
				if (ch === '-') {
					nextNot = true;
				} else {
					if (ch === '"') {
						currentWordStart = i + 1;
						status = 2;
					} else {
						currentWordStart = i;
						status = 1;
					}
				}
			} else {
				nextNot = false;
			}
			break;
		case 1:
			if (isSpace.test(ch)) {
				word = queryString.slice(currentWordStart, i);
				if (word === 'OR') {
					nextOr = true;
				} else {
					query = new Query$();
					query.word = word;
					query.or = nextOr;
					query.not = nextNot;
					$this.queries.push(query);
					nextOr = false;
					nextNot = false;
				}
				status = 0;
			}
			break;
		case 2:
			if (ch === '"') {
				word = queryString.slice(currentWordStart, i);
				query = new Query$();
				query.word = word;
				query.or = nextOr;
				query.not = nextNot;
				query.raw = true;
				$this.queries.push(query);
				nextOr = false;
				nextNot = false;
				status = 0;
			}
			break;
		}
	}
	switch (status) {
	case 0:
		break;
	case 1:
		query = new Query$();
		word = queryString.slice(currentWordStart, queryString.length);
		if (word !== 'OR') {
			query.word = word;
			query.or = nextOr;
			query.not = nextNot;
			$this.queries.push(query);
		}
		break;
	case 2:
		query = new Query$();
		query.word = queryString.slice(currentWordStart, queryString.length);
		query.or = nextOr;
		query.not = nextNot;
		query.raw = true;
		$this.queries.push(query);
		break;
	}
	return $this.queries;
};

var QueryStringParser$parse$LQueryStringParser$S = QueryStringParser.parse$LQueryStringParser$S;

/**
 * @param {QueryStringParser} $this
 * @return {!string}
 */
QueryStringParser.highlight$LQueryStringParser$ = function ($this) {
	/** @type {Array.<undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	/** @type {Query} */
	var query;
	result = [  ];
	for (i = 0; i < $this.queries.length; i++) {
		query = $this.queries[i];
		if (! query.not) {
			result.push("highlight=" + $__jsx_encodeURIComponent(query.word));
		}
	}
	return '?' + result.join('&');
};

var QueryStringParser$highlight$LQueryStringParser$ = QueryStringParser.highlight$LQueryStringParser$;

/**
 * class Proposal extends Object
 * @constructor
 */
function Proposal() {
}

/**
 * @constructor
 * @param {!number} omit
 * @param {!number} expect
 */
function Proposal$II(omit, expect) {
	this.omit = omit;
	this.expect = expect;
};

Proposal$II.prototype = new Proposal;

/**
 * class Position extends Object
 * @constructor
 */
function Position() {
}

/**
 * @constructor
 * @param {!string} word
 * @param {!number} position
 * @param {!boolean} stemmed
 */
function Position$SIB(word, position, stemmed) {
	this.word = word;
	this.position = position;
	this.stemmed = stemmed;
};

Position$SIB.prototype = new Position;

/**
 * class SearchUnit extends Object
 * @constructor
 */
function SearchUnit() {
}

/**
 * @constructor
 * @param {!number} id
 */
function SearchUnit$I(id) {
	this.positions = ({  });
	this.id = id;
	this._size = 0;
	this.score = 0;
	this.startPosition = -1;
};

SearchUnit$I.prototype = new SearchUnit;

/**
 * @param {SearchUnit} $this
 * @param {!string} word
 * @param {!number} position
 * @param {!boolean} stemmed
 */
SearchUnit.addPosition$LSearchUnit$SIB = function ($this, word, position, stemmed) {
	/** @type {Position} */
	var positionObj;
	positionObj = $this.positions[position + ""];
	if (! positionObj) {
		$this._size++;
		$this.positions[position + ""] = ({word: word, position: position, stemmed: stemmed});
	} else {
		if (positionObj.word.length < word.length) {
			positionObj.word = word;
		}
		positionObj.stemmed = positionObj.stemmed && stemmed;
	}
};

var SearchUnit$addPosition$LSearchUnit$SIB = SearchUnit.addPosition$LSearchUnit$SIB;

/**
 * @param {SearchUnit} $this
 * @param {!number} position
 * @return {Position}
 */
SearchUnit.get$LSearchUnit$I = function ($this, position) {
	return $this.positions[position + ""];
};

var SearchUnit$get$LSearchUnit$I = SearchUnit.get$LSearchUnit$I;

/**
 * @param {SearchUnit} $this
 * @return {!number}
 */
SearchUnit.size$LSearchUnit$ = function ($this) {
	return $this._size;
};

var SearchUnit$size$LSearchUnit$ = SearchUnit.size$LSearchUnit$;

/**
 * @param {SearchUnit} $this
 * @param {SearchUnit} rhs
 */
SearchUnit.merge$LSearchUnit$LSearchUnit$ = function ($this, rhs) {
	/** @type {!string} */
	var position;
	/** @type {Position} */
	var pos;
	for (position in rhs.positions) {
		pos = rhs.positions[position];
		SearchUnit$addPosition$LSearchUnit$SIB($this, pos.word, pos.position, pos.stemmed);
	}
};

var SearchUnit$merge$LSearchUnit$LSearchUnit$ = SearchUnit.merge$LSearchUnit$LSearchUnit$;

/**
 * @param {SearchUnit} $this
 * @return {Array.<undefined|Position>}
 */
SearchUnit.getPositions$LSearchUnit$ = function ($this) {
	/** @type {Array.<undefined|Position>} */
	var result;
	/** @type {!string} */
	var pos;
	result = [  ];
	for (pos in $this.positions) {
		result.push($this.positions[pos]);
	}
	result.sort((function (a, b) {
		return a.position - b.position;
	}));
	return result;
};

var SearchUnit$getPositions$LSearchUnit$ = SearchUnit.getPositions$LSearchUnit$;

/**
 * class SingleResult extends Object
 * @constructor
 */
function SingleResult() {
}

/**
 * @constructor
 */
function SingleResult$() {
	this.units = [  ];
	this.unitIds = [  ];
	this.or = false;
	this.not = false;
	this.searchWord = '';
};

SingleResult$.prototype = new SingleResult;

/**
 * @constructor
 * @param {!string} searchWord
 * @param {!boolean} or
 * @param {!boolean} not
 */
function SingleResult$SBB(searchWord, or, not) {
	this.units = [  ];
	this.unitIds = [  ];
	this.or = or;
	this.not = not;
	this.searchWord = searchWord;
};

SingleResult$SBB.prototype = new SingleResult;

/**
 * @param {SingleResult} $this
 * @param {!number} unitId
 * @return {SearchUnit}
 */
SingleResult.getSearchUnit$LSingleResult$I = function ($this, unitId) {
	/** @type {!number} */
	var existing;
	/** @type {SearchUnit} */
	var result;
	existing = $this.unitIds.indexOf(unitId);
	if (existing === -1) {
		result = ({positions: ({  }), id: unitId, _size: 0, score: 0, startPosition: -1});
		$this.units.push(result);
		$this.unitIds.push(unitId);
	} else {
		result = $this.units[existing];
	}
	return result;
};

var SingleResult$getSearchUnit$LSingleResult$I = SingleResult.getSearchUnit$LSingleResult$I;

/**
 * @param {SingleResult} $this
 * @param {SingleResult} rhs
 * @return {SingleResult}
 */
SingleResult.merge$LSingleResult$LSingleResult$ = function ($this, rhs) {
	/** @type {SingleResult} */
	var result;
	result = ({units: [  ], unitIds: [  ], or: false, not: false, searchWord: ''});
	if (rhs.or) {
		SingleResult$_orMerge$LSingleResult$LSingleResult$LSingleResult$($this, result, rhs);
	} else {
		if (rhs.not) {
			SingleResult$_notMerge$LSingleResult$LSingleResult$LSingleResult$($this, result, rhs);
		} else {
			SingleResult$_andMerge$LSingleResult$LSingleResult$LSingleResult$($this, result, rhs);
		}
	}
	return result;
};

var SingleResult$merge$LSingleResult$LSingleResult$ = SingleResult.merge$LSingleResult$LSingleResult$;

/**
 * @param {SingleResult} $this
 * @return {!number}
 */
SingleResult.size$LSingleResult$ = function ($this) {
	return ($this.units.length | 0);
};

var SingleResult$size$LSingleResult$ = SingleResult.size$LSingleResult$;

/**
 * @param {SingleResult} $this
 * @param {SingleResult} result
 * @param {SingleResult} rhs
 */
SingleResult._andMerge$LSingleResult$LSingleResult$LSingleResult$ = function ($this, result, rhs) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!number} */
	var id;
	/** @type {SearchUnit} */
	var lhsSection;
	for (i = 0; i < $this.unitIds.length; i++) {
		id = $this.unitIds[i];
		if (rhs.unitIds.indexOf(id) !== -1) {
			lhsSection = $this.units[i];
			result.unitIds.push(id);
			result.units.push(lhsSection);
		}
	}
};

var SingleResult$_andMerge$LSingleResult$LSingleResult$LSingleResult$ = SingleResult._andMerge$LSingleResult$LSingleResult$LSingleResult$;

/**
 * @param {SingleResult} $this
 * @param {SingleResult} result
 * @param {SingleResult} rhs
 */
SingleResult._orMerge$LSingleResult$LSingleResult$LSingleResult$ = function ($this, result, rhs) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!number} */
	var id;
	/** @type {SearchUnit} */
	var rhsSection;
	/** @type {SearchUnit} */
	var lhsSection;
	/** @type {Array.<undefined|!number>} */
	var unitIds$0;
	/** @type {Array.<undefined|SearchUnit>} */
	var units$0;
	result.unitIds = (unitIds$0 = $this.unitIds).slice(0, unitIds$0.length);
	result.units = (units$0 = $this.units).slice(0, units$0.length);
	for (i = 0; i < rhs.unitIds.length; i++) {
		id = rhs.unitIds[i];
		rhsSection = rhs.units[i];
		if (result.unitIds.indexOf(id) !== -1) {
			lhsSection = result.units[result.unitIds.indexOf(id)];
			SearchUnit$merge$LSearchUnit$LSearchUnit$(lhsSection, rhsSection);
		} else {
			result.unitIds.push(id);
			result.units.push(rhsSection);
		}
	}
};

var SingleResult$_orMerge$LSingleResult$LSingleResult$LSingleResult$ = SingleResult._orMerge$LSingleResult$LSingleResult$LSingleResult$;

/**
 * @param {SingleResult} $this
 * @param {SingleResult} result
 * @param {SingleResult} rhs
 */
SingleResult._notMerge$LSingleResult$LSingleResult$LSingleResult$ = function ($this, result, rhs) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!number} */
	var id;
	/** @type {SearchUnit} */
	var lhsSection;
	for (i = 0; i < $this.unitIds.length; i++) {
		id = $this.unitIds[i];
		if (rhs.unitIds.indexOf(id) === -1) {
			lhsSection = $this.units[i];
			result.unitIds.push(id);
			result.units.push(lhsSection);
		}
	}
};

var SingleResult$_notMerge$LSingleResult$LSingleResult$LSingleResult$ = SingleResult._notMerge$LSingleResult$LSingleResult$LSingleResult$;

/**
 * class SearchSummary extends Object
 * @constructor
 */
function SearchSummary() {
}

/**
 * @constructor
 */
function SearchSummary$() {
	this.sourceResults = [  ];
	this.result = null;
	this.oktavia = null;
};

SearchSummary$.prototype = new SearchSummary;

/**
 * @constructor
 * @param {Oktavia} oktavia
 */
function SearchSummary$LOktavia$(oktavia) {
	this.sourceResults = [  ];
	this.result = null;
	this.oktavia = oktavia;
};

SearchSummary$LOktavia$.prototype = new SearchSummary;

/**
 * @param {SearchSummary} $this
 * @param {SingleResult} result
 */
SearchSummary.addQuery$LSearchSummary$LSingleResult$ = function ($this, result) {
	$this.sourceResults.push(result);
};

var SearchSummary$addQuery$LSearchSummary$LSingleResult$ = SearchSummary.addQuery$LSearchSummary$LSingleResult$;

/**
 * @param {SearchSummary} $this
 */
SearchSummary.mergeResult$LSearchSummary$ = function ($this) {
	$this.result = SearchSummary$mergeResult$LSearchSummary$ALSingleResult$($this, $this.sourceResults);
};

var SearchSummary$mergeResult$LSearchSummary$ = SearchSummary.mergeResult$LSearchSummary$;

/**
 * @param {SearchSummary} $this
 * @param {Array.<undefined|SingleResult>} results
 * @return {SingleResult}
 */
SearchSummary.mergeResult$LSearchSummary$ALSingleResult$ = function ($this, results) {
	/** @type {SingleResult} */
	var rhs;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var results$len$0;
	rhs = results[0];
	for ((i = 1, results$len$0 = results.length); i < results$len$0; i++) {
		rhs = SingleResult$merge$LSingleResult$LSingleResult$(rhs, results[i]);
	}
	return rhs;
};

var SearchSummary$mergeResult$LSearchSummary$ALSingleResult$ = SearchSummary.mergeResult$LSearchSummary$ALSingleResult$;

/**
 * @param {SearchSummary} $this
 * @return {Array.<undefined|Proposal>}
 */
SearchSummary.getProposal$LSearchSummary$ = function ($this) {
	/** @type {Array.<undefined|Proposal>} */
	var proposals;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|SingleResult>} */
	var tmpSource;
	/** @type {!number} */
	var j;
	/** @type {SingleResult} */
	var result;
	proposals = [  ];
	for (i = 0; i < $this.sourceResults.length; i++) {
		tmpSource = [  ];
		for (j = 0; j < $this.sourceResults.length; j++) {
			if (i !== j) {
				tmpSource.push($this.sourceResults[j]);
			}
		}
		result = SearchSummary$mergeResult$LSearchSummary$ALSingleResult$($this, tmpSource);
		proposals.push(({omit: i, expect: result.units.length}));
	}
	proposals.sort((function (a, b) {
		return b.expect - a.expect;
	}));
	return proposals;
};

var SearchSummary$getProposal$LSearchSummary$ = SearchSummary.getProposal$LSearchSummary$;

/**
 * @param {SearchSummary} $this
 * @return {Array.<undefined|SearchUnit>}
 */
SearchSummary.getSortedResult$LSearchSummary$ = function ($this) {
	/** @type {Array.<undefined|SearchUnit>} */
	var result;
	/** @type {Array.<undefined|SearchUnit>} */
	var units$0;
	result = (units$0 = $this.result.units).slice(0, units$0.length);
	result.sort((function (a, b) {
		return b.score - a.score;
	}));
	return result;
};

var SearchSummary$getSortedResult$LSearchSummary$ = SearchSummary.getSortedResult$LSearchSummary$;

/**
 * @param {SearchSummary} $this
 * @return {!number}
 */
SearchSummary.size$LSearchSummary$ = function ($this) {
	/** @type {SingleResult} */
	var this$0;
	this$0 = $this.result;
	return (this$0.units.length | 0);
};

var SearchSummary$size$LSearchSummary$ = SearchSummary.size$LSearchSummary$;

/**
 * @param {SearchSummary} $this
 * @param {SingleResult} result
 */
SearchSummary.add$LSearchSummary$LSingleResult$ = function ($this, result) {
	$this.sourceResults.push(result);
};

var SearchSummary$add$LSearchSummary$LSingleResult$ = SearchSummary.add$LSearchSummary$LSingleResult$;

/**
 * class Style extends Object
 * @constructor
 */
function Style() {
}

/**
 * @constructor
 * @param {!string} mode
 */
function Style$S(mode) {
	this.styles = null;
	this.escapeHTML = false;
	switch (mode) {
	case 'console':
		this.styles = Style.console;
		break;
	case 'html':
		this.styles = Style.html;
		break;
	case 'ignore':
		this.styles = Style.ignore;
		break;
	default:
		this.styles = Style.ignore;
		break;
	}
	this.escapeHTML = mode === 'html';
};

Style$S.prototype = new Style;

/**
 * @param {!string} source
 * @return {!string}
 */
Style.prototype.convert$S = function (source) {
	/** @type {_HTMLHandler} */
	var handler;
	/** @type {SAXParser} */
	var parser;
	handler = new _HTMLHandler$HASB(this.styles, this.escapeHTML);
	parser = new SAXParser$LSAXHandler$(handler);
	parser.parse$S(source);
	return handler.text.join('');
};

/**
 * class Stemmer
 * @constructor
 */
function Stemmer() {
}

Stemmer.prototype.$__jsx_implements_Stemmer = true;

/**
 * @constructor
 */
function Stemmer$() {
};

Stemmer$.prototype = new Stemmer;

/**
 * class BaseStemmer extends Object
 * @constructor
 */
function BaseStemmer() {
}

$__jsx_merge_interface(BaseStemmer, Stemmer);

/**
 * @constructor
 */
function BaseStemmer$() {
	/** @type {!string} */
	var current$0;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var limit$0;
	this.cache = ({  });
	current$0 = this.current = "";
	cursor$0 = this.cursor = 0;
	limit$0 = this.limit = current$0.length;
	this.limit_backward = 0;
	this.bra = cursor$0;
	this.ket = limit$0;
};

BaseStemmer$.prototype = new BaseStemmer;

/**
 * @param {!string} value
 */
BaseStemmer.prototype.setCurrent$S = function (value) {
	/** @type {!string} */
	var current$0;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var limit$0;
	current$0 = this.current = value;
	cursor$0 = this.cursor = 0;
	limit$0 = this.limit = current$0.length;
	this.limit_backward = 0;
	this.bra = cursor$0;
	this.ket = limit$0;
};

/**
 * @return {!string}
 */
BaseStemmer.prototype.getCurrent$ = function () {
	return this.current;
};

/**
 * @param {BaseStemmer} other
 */
BaseStemmer.prototype.copy_from$LBaseStemmer$ = function (other) {
	this.current = other.current;
	this.cursor = other.cursor;
	this.limit = other.limit;
	this.limit_backward = other.limit_backward;
	this.bra = other.bra;
	this.ket = other.ket;
};

/**
 * @param {Array.<undefined|!number>} s
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.in_grouping$AIII = function (s, min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor >= this.limit) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor);
	if (ch > max || ch < min) {
		return false;
	}
	ch -= min;
	if ((s[ch >>> 3] & 0x1 << (ch & 0x7)) === 0) {
		return false;
	}
	this.cursor++;
	return true;
};

/**
 * @param {Array.<undefined|!number>} s
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.in_grouping_b$AIII = function (s, min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor <= this.limit_backward) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor - 1);
	if (ch > max || ch < min) {
		return false;
	}
	ch -= min;
	if ((s[ch >>> 3] & 0x1 << (ch & 0x7)) === 0) {
		return false;
	}
	this.cursor--;
	return true;
};

/**
 * @param {Array.<undefined|!number>} s
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.out_grouping$AIII = function (s, min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor >= this.limit) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor);
	if (ch > max || ch < min) {
		this.cursor++;
		return true;
	}
	ch -= min;
	if ((s[ch >>> 3] & 0X1 << (ch & 0x7)) === 0) {
		this.cursor++;
		return true;
	}
	return false;
};

/**
 * @param {Array.<undefined|!number>} s
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.out_grouping_b$AIII = function (s, min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor <= this.limit_backward) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor - 1);
	if (ch > max || ch < min) {
		this.cursor--;
		return true;
	}
	ch -= min;
	if ((s[ch >>> 3] & 0x1 << (ch & 0x7)) === 0) {
		this.cursor--;
		return true;
	}
	return false;
};

/**
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.in_range$II = function (min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor >= this.limit) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor);
	if (ch > max || ch < min) {
		return false;
	}
	this.cursor++;
	return true;
};

/**
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.in_range_b$II = function (min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor <= this.limit_backward) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor - 1);
	if (ch > max || ch < min) {
		return false;
	}
	this.cursor--;
	return true;
};

/**
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.out_range$II = function (min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor >= this.limit) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor);
	if (! (ch > max || ch < min)) {
		return false;
	}
	this.cursor++;
	return true;
};

/**
 * @param {!number} min
 * @param {!number} max
 * @return {!boolean}
 */
BaseStemmer.prototype.out_range_b$II = function (min, max) {
	/** @type {!number} */
	var ch;
	if (this.cursor <= this.limit_backward) {
		return false;
	}
	ch = this.current.charCodeAt(this.cursor - 1);
	if (! (ch > max || ch < min)) {
		return false;
	}
	this.cursor--;
	return true;
};

/**
 * @param {!number} s_size
 * @param {!string} s
 * @return {!boolean}
 */
BaseStemmer.prototype.eq_s$IS = function (s_size, s) {
	/** @type {!number} */
	var cursor$0;
	if (this.limit - this.cursor < s_size) {
		return false;
	}
	if (this.current.slice(cursor$0 = this.cursor, cursor$0 + s_size) !== s) {
		return false;
	}
	this.cursor += s_size;
	return true;
};

/**
 * @param {!number} s_size
 * @param {!string} s
 * @return {!boolean}
 */
BaseStemmer.prototype.eq_s_b$IS = function (s_size, s) {
	/** @type {!number} */
	var cursor$0;
	if (this.cursor - this.limit_backward < s_size) {
		return false;
	}
	if (this.current.slice((cursor$0 = this.cursor) - s_size, cursor$0) !== s) {
		return false;
	}
	this.cursor -= s_size;
	return true;
};

/**
 * @param {!string} s
 * @return {!boolean}
 */
BaseStemmer.prototype.eq_v$S = function (s) {
	return this.eq_s$IS(s.length, s);
};

/**
 * @param {!string} s
 * @return {!boolean}
 */
BaseStemmer.prototype.eq_v_b$S = function (s) {
	return this.eq_s_b$IS(s.length, s);
};

/**
 * @param {Array.<undefined|Among>} v
 * @param {!number} v_size
 * @return {!number}
 */
BaseStemmer.prototype.find_among$ALAmong$I = function (v, v_size) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var l;
	/** @type {!number} */
	var common_i;
	/** @type {!number} */
	var common_j;
	/** @type {!boolean} */
	var first_key_inspected;
	/** @type {!number} */
	var k;
	/** @type {!number} */
	var diff;
	/** @type {!number} */
	var common;
	/** @type {Among} */
	var w;
	/** @type {!number} */
	var i2;
	/** @type {!boolean} */
	var res;
	i = 0;
	j = v_size;
	c = this.cursor;
	l = this.limit;
	common_i = 0;
	common_j = 0;
	first_key_inspected = false;
	while (true) {
		k = i + (j - i >>> 1);
		diff = 0;
		common = (common_i < common_j ? common_i : common_j);
		w = v[k];
		for (i2 = common; i2 < w.s_size; i2++) {
			if (c + common === l) {
				diff = -1;
				break;
			}
			diff = this.current.charCodeAt(c + common) - w.s.charCodeAt(i2);
			if (diff !== 0) {
				break;
			}
			common++;
		}
		if (diff < 0) {
			j = k;
			common_j = common;
		} else {
			i = k;
			common_i = common;
		}
		if (j - i <= 1) {
			if (i > 0) {
				break;
			}
			if (j === i) {
				break;
			}
			if (first_key_inspected) {
				break;
			}
			first_key_inspected = true;
		}
	}
	while (true) {
		w = v[i];
		if (common_i >= w.s_size) {
			this.cursor = (c + w.s_size | 0);
			if (w.method == null) {
				return w.result;
			}
			res = w.method(w.instance);
			this.cursor = (c + w.s_size | 0);
			if (res) {
				return w.result;
			}
		}
		i = w.substring_i;
		if (i < 0) {
			return 0;
		}
	}
	return -1;
};

/**
 * @param {Array.<undefined|Among>} v
 * @param {!number} v_size
 * @return {!number}
 */
BaseStemmer.prototype.find_among_b$ALAmong$I = function (v, v_size) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var lb;
	/** @type {!number} */
	var common_i;
	/** @type {!number} */
	var common_j;
	/** @type {!boolean} */
	var first_key_inspected;
	/** @type {!number} */
	var k;
	/** @type {!number} */
	var diff;
	/** @type {!number} */
	var common;
	/** @type {Among} */
	var w;
	/** @type {!number} */
	var i2;
	/** @type {!boolean} */
	var res;
	i = 0;
	j = v_size;
	c = this.cursor;
	lb = this.limit_backward;
	common_i = 0;
	common_j = 0;
	first_key_inspected = false;
	while (true) {
		k = i + (j - i >> 1);
		diff = 0;
		common = (common_i < common_j ? common_i : common_j);
		w = v[k];
		for (i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
			if (c - common === lb) {
				diff = -1;
				break;
			}
			diff = this.current.charCodeAt(c - 1 - common) - w.s.charCodeAt(i2);
			if (diff !== 0) {
				break;
			}
			common++;
		}
		if (diff < 0) {
			j = k;
			common_j = common;
		} else {
			i = k;
			common_i = common;
		}
		if (j - i <= 1) {
			if (i > 0) {
				break;
			}
			if (j === i) {
				break;
			}
			if (first_key_inspected) {
				break;
			}
			first_key_inspected = true;
		}
	}
	while (true) {
		w = v[i];
		if (common_i >= w.s_size) {
			this.cursor = (c - w.s_size | 0);
			if (w.method == null) {
				return w.result;
			}
			res = w.method(this);
			this.cursor = (c - w.s_size | 0);
			if (res) {
				return w.result;
			}
		}
		i = w.substring_i;
		if (i < 0) {
			return 0;
		}
	}
	return -1;
};

/**
 * @param {!number} c_bra
 * @param {!number} c_ket
 * @param {!string} s
 * @return {!number}
 */
BaseStemmer.prototype.replace_s$IIS = function (c_bra, c_ket, s) {
	/** @type {!number} */
	var adjustment;
	adjustment = s.length - (c_ket - c_bra);
	this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket);
	this.limit += (adjustment | 0);
	if (this.cursor >= c_ket) {
		this.cursor += (adjustment | 0);
	} else {
		if (this.cursor > c_bra) {
			this.cursor = c_bra;
		}
	}
	return (adjustment | 0);
};

/**
 * @return {!boolean}
 */
BaseStemmer.prototype.slice_check$ = function () {
	/** @type {!number} */
	var bra$0;
	/** @type {!number} */
	var ket$0;
	/** @type {!number} */
	var limit$0;
	return ((bra$0 = this.bra) < 0 || bra$0 > (ket$0 = this.ket) || ket$0 > (limit$0 = this.limit) || limit$0 > this.current.length ? false : true);
};

/**
 * @param {!string} s
 * @return {!boolean}
 */
BaseStemmer.prototype.slice_from$S = function (s) {
	/** @type {!boolean} */
	var result;
	/** @type {!number} */
	var bra$0;
	/** @type {!number} */
	var ket$0;
	/** @type {!number} */
	var limit$0;
	result = false;
	if ((bra$0 = this.bra) < 0 || bra$0 > (ket$0 = this.ket) || ket$0 > (limit$0 = this.limit) || limit$0 > this.current.length ? false : true) {
		this.replace_s$IIS(this.bra, this.ket, s);
		result = true;
	}
	return result;
};

/**
 * @return {!boolean}
 */
BaseStemmer.prototype.slice_del$ = function () {
	return this.slice_from$S("");
};

/**
 * @param {!number} c_bra
 * @param {!number} c_ket
 * @param {!string} s
 */
BaseStemmer.prototype.insert$IIS = function (c_bra, c_ket, s) {
	/** @type {!number} */
	var adjustment;
	adjustment = this.replace_s$IIS(c_bra, c_ket, s);
	if (c_bra <= this.bra) {
		this.bra += (adjustment | 0);
	}
	if (c_bra <= this.ket) {
		this.ket += (adjustment | 0);
	}
};

/**
 * @param {!string} s
 * @return {!string}
 */
BaseStemmer.prototype.slice_to$S = function (s) {
	/** @type {!string} */
	var result;
	/** @type {!number} */
	var bra$0;
	/** @type {!number} */
	var ket$0;
	/** @type {!number} */
	var limit$0;
	result = '';
	if ((bra$0 = this.bra) < 0 || bra$0 > (ket$0 = this.ket) || ket$0 > (limit$0 = this.limit) || limit$0 > this.current.length ? false : true) {
		result = this.current.slice(this.bra, this.ket);
	}
	return result;
};

/**
 * @param {!string} s
 * @return {!string}
 */
BaseStemmer.prototype.assign_to$S = function (s) {
	return this.current.slice(0, this.limit);
};

/**
 * @return {!boolean}
 */
BaseStemmer.prototype.stem$ = function () {
	return false;
};

/**
 * @param {!string} word
 * @return {!string}
 */
BaseStemmer.prototype.stemWord$S = function (word) {
	/** @type {undefined|!string} */
	var result;
	/** @type {!string} */
	var current$0;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var limit$0;
	result = this.cache['.' + word];
	if (result == null) {
		current$0 = this.current = word;
		cursor$0 = this.cursor = 0;
		limit$0 = this.limit = current$0.length;
		this.limit_backward = 0;
		this.bra = cursor$0;
		this.ket = limit$0;
		this.stem$();
		result = this.current;
		this.cache['.' + word] = result;
	}
	return result;
};

/**
 * @param {Array.<undefined|!string>} words
 * @return {Array.<undefined|!string>}
 */
BaseStemmer.prototype.stemWords$AS = function (words) {
	/** @type {Array.<undefined|!string>} */
	var results;
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var word;
	/** @type {undefined|!string} */
	var result;
	/** @type {!string} */
	var current$0;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var limit$0;
	results = [  ];
	for (i = 0; i < words.length; i++) {
		word = words[i];
		result = this.cache['.' + word];
		if (result == null) {
			current$0 = this.current = word;
			cursor$0 = this.cursor = 0;
			limit$0 = this.limit = current$0.length;
			this.limit_backward = 0;
			this.bra = cursor$0;
			this.ket = limit$0;
			this.stem$();
			result = this.current;
			this.cache['.' + word] = result;
		}
		results.push(result);
	}
	return results;
};

/**
 * class PortugueseStemmer extends BaseStemmer
 * @constructor
 */
function PortugueseStemmer() {
}

PortugueseStemmer.prototype = new BaseStemmer;
/**
 * @constructor
 */
function PortugueseStemmer$() {
	BaseStemmer$.call(this);
	this.I_p2 = 0;
	this.I_p1 = 0;
	this.I_pV = 0;
};

PortugueseStemmer$.prototype = new PortugueseStemmer;

/**
 * @param {PortugueseStemmer} other
 */
PortugueseStemmer.prototype.copy_from$LPortugueseStemmer$ = function (other) {
	this.I_p2 = other.I_p2;
	this.I_p1 = other.I_p1;
	this.I_pV = other.I_pV;
	BaseStemmer.prototype.copy_from$LBaseStemmer$.call(this, other);
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_prelude$ = function () {
	/** @type {!number} */
	var among_var;
	/** @type {!number} */
	var v_1;
	/** @type {!boolean} */
	var lab1;
replab0:
	while (true) {
		v_1 = this.cursor;
		lab1 = true;
	lab1:
		while (lab1 === true) {
			lab1 = false;
			this.bra = this.cursor;
			among_var = this.find_among$ALAmong$I(PortugueseStemmer.a_0, 3);
			if (among_var === 0) {
				break lab1;
			}
			this.ket = this.cursor;
			switch (among_var) {
			case 0:
				break lab1;
			case 1:
				if (! this.slice_from$S("a~")) {
					return false;
				}
				break;
			case 2:
				if (! this.slice_from$S("o~")) {
					return false;
				}
				break;
			case 3:
				if (this.cursor >= this.limit) {
					break lab1;
				}
				this.cursor++;
				break;
			}
			continue replab0;
		}
		this.cursor = v_1;
		break replab0;
	}
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_mark_regions$ = function () {
	/** @type {!number} */
	var v_1;
	/** @type {!number} */
	var v_2;
	/** @type {!number} */
	var v_3;
	/** @type {!number} */
	var v_6;
	/** @type {!number} */
	var v_8;
	/** @type {!boolean} */
	var lab0;
	/** @type {!boolean} */
	var lab1;
	/** @type {!boolean} */
	var lab2;
	/** @type {!boolean} */
	var lab3;
	/** @type {!boolean} */
	var lab4;
	/** @type {!boolean} */
	var lab6;
	/** @type {!boolean} */
	var lab8;
	/** @type {!boolean} */
	var lab9;
	/** @type {!boolean} */
	var lab10;
	/** @type {!boolean} */
	var lab12;
	/** @type {!boolean} */
	var lab13;
	/** @type {!boolean} */
	var lab15;
	/** @type {!boolean} */
	var lab17;
	/** @type {!boolean} */
	var lab19;
	/** @type {!boolean} */
	var lab21;
	/** @type {!number} */
	var limit$0;
	/** @type {!number} */
	var cursor$0;
	this.I_pV = limit$0 = this.limit;
	this.I_p1 = limit$0;
	this.I_p2 = limit$0;
	v_1 = this.cursor;
	lab0 = true;
lab0:
	while (lab0 === true) {
		lab0 = false;
		lab1 = true;
	lab1:
		while (lab1 === true) {
			lab1 = false;
			v_2 = this.cursor;
			lab2 = true;
		lab2:
			while (lab2 === true) {
				lab2 = false;
				if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab2;
				}
				lab3 = true;
			lab3:
				while (lab3 === true) {
					lab3 = false;
					v_3 = this.cursor;
					lab4 = true;
				lab4:
					while (lab4 === true) {
						lab4 = false;
						if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
							break lab4;
						}
					golab5:
						while (true) {
							lab6 = true;
						lab6:
							while (lab6 === true) {
								lab6 = false;
								if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
									break lab6;
								}
								break golab5;
							}
							if (this.cursor >= this.limit) {
								break lab4;
							}
							this.cursor++;
						}
						break lab3;
					}
					this.cursor = v_3;
					if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
						break lab2;
					}
				golab7:
					while (true) {
						lab8 = true;
					lab8:
						while (lab8 === true) {
							lab8 = false;
							if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
								break lab8;
							}
							break golab7;
						}
						if (this.cursor >= this.limit) {
							break lab2;
						}
						this.cursor++;
					}
				}
				break lab1;
			}
			this.cursor = v_2;
			if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
				break lab0;
			}
			lab9 = true;
		lab9:
			while (lab9 === true) {
				lab9 = false;
				v_6 = this.cursor;
				lab10 = true;
			lab10:
				while (lab10 === true) {
					lab10 = false;
					if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
						break lab10;
					}
				golab11:
					while (true) {
						lab12 = true;
					lab12:
						while (lab12 === true) {
							lab12 = false;
							if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
								break lab12;
							}
							break golab11;
						}
						if (this.cursor >= this.limit) {
							break lab10;
						}
						this.cursor++;
					}
					break lab9;
				}
				this.cursor = v_6;
				if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab0;
				}
				if (this.cursor >= this.limit) {
					break lab0;
				}
				this.cursor++;
			}
		}
		this.I_pV = this.cursor;
	}
	cursor$0 = this.cursor = v_1;
	v_8 = cursor$0;
	lab13 = true;
lab13:
	while (lab13 === true) {
		lab13 = false;
	golab14:
		while (true) {
			lab15 = true;
		lab15:
			while (lab15 === true) {
				lab15 = false;
				if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab15;
				}
				break golab14;
			}
			if (this.cursor >= this.limit) {
				break lab13;
			}
			this.cursor++;
		}
	golab16:
		while (true) {
			lab17 = true;
		lab17:
			while (lab17 === true) {
				lab17 = false;
				if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab17;
				}
				break golab16;
			}
			if (this.cursor >= this.limit) {
				break lab13;
			}
			this.cursor++;
		}
		this.I_p1 = this.cursor;
	golab18:
		while (true) {
			lab19 = true;
		lab19:
			while (lab19 === true) {
				lab19 = false;
				if (! this.in_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab19;
				}
				break golab18;
			}
			if (this.cursor >= this.limit) {
				break lab13;
			}
			this.cursor++;
		}
	golab20:
		while (true) {
			lab21 = true;
		lab21:
			while (lab21 === true) {
				lab21 = false;
				if (! this.out_grouping$AIII(PortugueseStemmer.g_v, 97, 250)) {
					break lab21;
				}
				break golab20;
			}
			if (this.cursor >= this.limit) {
				break lab13;
			}
			this.cursor++;
		}
		this.I_p2 = this.cursor;
	}
	this.cursor = v_8;
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_postlude$ = function () {
	/** @type {!number} */
	var among_var;
	/** @type {!number} */
	var v_1;
	/** @type {!boolean} */
	var lab1;
replab0:
	while (true) {
		v_1 = this.cursor;
		lab1 = true;
	lab1:
		while (lab1 === true) {
			lab1 = false;
			this.bra = this.cursor;
			among_var = this.find_among$ALAmong$I(PortugueseStemmer.a_1, 3);
			if (among_var === 0) {
				break lab1;
			}
			this.ket = this.cursor;
			switch (among_var) {
			case 0:
				break lab1;
			case 1:
				if (! this.slice_from$S("\u00E3")) {
					return false;
				}
				break;
			case 2:
				if (! this.slice_from$S("\u00F5")) {
					return false;
				}
				break;
			case 3:
				if (this.cursor >= this.limit) {
					break lab1;
				}
				this.cursor++;
				break;
			}
			continue replab0;
		}
		this.cursor = v_1;
		break replab0;
	}
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_RV$ = function () {
	return (! (this.I_pV <= this.cursor) ? false : true);
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_R1$ = function () {
	return (! (this.I_p1 <= this.cursor) ? false : true);
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_R2$ = function () {
	return (! (this.I_p2 <= this.cursor) ? false : true);
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_standard_suffix$ = function () {
	/** @type {!number} */
	var among_var;
	/** @type {!number} */
	var v_1;
	/** @type {!number} */
	var v_2;
	/** @type {!number} */
	var v_3;
	/** @type {!number} */
	var v_4;
	/** @type {!boolean} */
	var lab0;
	/** @type {!boolean} */
	var lab1;
	/** @type {!boolean} */
	var lab2;
	/** @type {!boolean} */
	var lab3;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var cursor$1;
	/** @type {!number} */
	var cursor$2;
	this.ket = this.cursor;
	among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_5, 45);
	if (among_var === 0) {
		return false;
	}
	this.bra = this.cursor;
	switch (among_var) {
	case 0:
		return false;
	case 1:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		break;
	case 2:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("log")) {
			return false;
		}
		break;
	case 3:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("u")) {
			return false;
		}
		break;
	case 4:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("ente")) {
			return false;
		}
		break;
	case 5:
		if (! (! (this.I_p1 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		v_1 = this.limit - this.cursor;
		lab0 = true;
	lab0:
		while (lab0 === true) {
			lab0 = false;
			this.ket = this.cursor;
			among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_2, 4);
			if (among_var === 0) {
				this.cursor = this.limit - v_1;
				break lab0;
			}
			this.bra = cursor$0 = this.cursor;
			if (! (! (this.I_p2 <= cursor$0) ? false : true)) {
				this.cursor = this.limit - v_1;
				break lab0;
			}
			if (! this.slice_from$S("")) {
				return false;
			}
			switch (among_var) {
			case 0:
				this.cursor = this.limit - v_1;
				break lab0;
			case 1:
				this.ket = this.cursor;
				if (! this.eq_s_b$IS(2, "at")) {
					this.cursor = this.limit - v_1;
					break lab0;
				}
				this.bra = cursor$1 = this.cursor;
				if (! (! (this.I_p2 <= cursor$1) ? false : true)) {
					this.cursor = this.limit - v_1;
					break lab0;
				}
				if (! this.slice_from$S("")) {
					return false;
				}
				break;
			}
		}
		break;
	case 6:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		v_2 = this.limit - this.cursor;
		lab1 = true;
	lab1:
		while (lab1 === true) {
			lab1 = false;
			this.ket = this.cursor;
			among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_3, 3);
			if (among_var === 0) {
				this.cursor = this.limit - v_2;
				break lab1;
			}
			this.bra = this.cursor;
			switch (among_var) {
			case 0:
				this.cursor = this.limit - v_2;
				break lab1;
			case 1:
				if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
					this.cursor = this.limit - v_2;
					break lab1;
				}
				if (! this.slice_from$S("")) {
					return false;
				}
				break;
			}
		}
		break;
	case 7:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		v_3 = this.limit - this.cursor;
		lab2 = true;
	lab2:
		while (lab2 === true) {
			lab2 = false;
			this.ket = this.cursor;
			among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_4, 3);
			if (among_var === 0) {
				this.cursor = this.limit - v_3;
				break lab2;
			}
			this.bra = this.cursor;
			switch (among_var) {
			case 0:
				this.cursor = this.limit - v_3;
				break lab2;
			case 1:
				if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
					this.cursor = this.limit - v_3;
					break lab2;
				}
				if (! this.slice_from$S("")) {
					return false;
				}
				break;
			}
		}
		break;
	case 8:
		if (! (! (this.I_p2 <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		v_4 = this.limit - this.cursor;
		lab3 = true;
	lab3:
		while (lab3 === true) {
			lab3 = false;
			this.ket = this.cursor;
			if (! this.eq_s_b$IS(2, "at")) {
				this.cursor = this.limit - v_4;
				break lab3;
			}
			this.bra = cursor$2 = this.cursor;
			if (! (! (this.I_p2 <= cursor$2) ? false : true)) {
				this.cursor = this.limit - v_4;
				break lab3;
			}
			if (! this.slice_from$S("")) {
				return false;
			}
		}
		break;
	case 9:
		if (! (! (this.I_pV <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.eq_s_b$IS(1, "e")) {
			return false;
		}
		if (! this.slice_from$S("ir")) {
			return false;
		}
		break;
	}
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_verb_suffix$ = function () {
	/** @type {!number} */
	var among_var;
	/** @type {!number} */
	var v_1;
	/** @type {!number} */
	var v_2;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var cursor$1;
	/** @type {!number} */
	var cursor$2;
	v_1 = this.limit - (cursor$0 = this.cursor);
	if (cursor$0 < this.I_pV) {
		return false;
	}
	cursor$1 = this.cursor = this.I_pV;
	v_2 = this.limit_backward;
	this.limit_backward = cursor$1;
	cursor$2 = this.cursor = this.limit - v_1;
	this.ket = cursor$2;
	among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_6, 120);
	if (among_var === 0) {
		this.limit_backward = v_2;
		return false;
	}
	this.bra = this.cursor;
	switch (among_var) {
	case 0:
		this.limit_backward = v_2;
		return false;
	case 1:
		if (! this.slice_from$S("")) {
			return false;
		}
		break;
	}
	this.limit_backward = v_2;
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_residual_suffix$ = function () {
	/** @type {!number} */
	var among_var;
	this.ket = this.cursor;
	among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_7, 7);
	if (among_var === 0) {
		return false;
	}
	this.bra = this.cursor;
	switch (among_var) {
	case 0:
		return false;
	case 1:
		if (! (! (this.I_pV <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		break;
	}
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.r_residual_form$ = function () {
	/** @type {!number} */
	var among_var;
	/** @type {!number} */
	var v_1;
	/** @type {!number} */
	var v_2;
	/** @type {!number} */
	var v_3;
	/** @type {!boolean} */
	var lab0;
	/** @type {!boolean} */
	var lab1;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var cursor$1;
	this.ket = this.cursor;
	among_var = this.find_among_b$ALAmong$I(PortugueseStemmer.a_8, 4);
	if (among_var === 0) {
		return false;
	}
	this.bra = this.cursor;
	switch (among_var) {
	case 0:
		return false;
	case 1:
		if (! (! (this.I_pV <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		this.ket = this.cursor;
		lab0 = true;
	lab0:
		while (lab0 === true) {
			lab0 = false;
			v_1 = this.limit - this.cursor;
			lab1 = true;
		lab1:
			while (lab1 === true) {
				lab1 = false;
				if (! this.eq_s_b$IS(1, "u")) {
					break lab1;
				}
				this.bra = cursor$0 = this.cursor;
				v_2 = this.limit - cursor$0;
				if (! this.eq_s_b$IS(1, "g")) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				break lab0;
			}
			this.cursor = this.limit - v_1;
			if (! this.eq_s_b$IS(1, "i")) {
				return false;
			}
			this.bra = cursor$1 = this.cursor;
			v_3 = this.limit - cursor$1;
			if (! this.eq_s_b$IS(1, "c")) {
				return false;
			}
			this.cursor = this.limit - v_3;
		}
		if (! (! (this.I_pV <= this.cursor) ? false : true)) {
			return false;
		}
		if (! this.slice_from$S("")) {
			return false;
		}
		break;
	case 2:
		if (! this.slice_from$S("c")) {
			return false;
		}
		break;
	}
	return true;
};

/**
 * @return {!boolean}
 */
PortugueseStemmer.prototype.stem$ = function () {
	/** @type {!number} */
	var v_1;
	/** @type {!number} */
	var v_2;
	/** @type {!number} */
	var v_3;
	/** @type {!number} */
	var v_4;
	/** @type {!number} */
	var v_5;
	/** @type {!number} */
	var v_6;
	/** @type {!number} */
	var v_7;
	/** @type {!number} */
	var v_8;
	/** @type {!number} */
	var v_10;
	/** @type {!boolean} */
	var lab0;
	/** @type {!boolean} */
	var lab1;
	/** @type {!boolean} */
	var lab2;
	/** @type {!boolean} */
	var lab3;
	/** @type {!boolean} */
	var lab4;
	/** @type {!boolean} */
	var lab5;
	/** @type {!boolean} */
	var lab6;
	/** @type {!boolean} */
	var lab7;
	/** @type {!boolean} */
	var lab8;
	/** @type {!boolean} */
	var lab9;
	/** @type {!number} */
	var cursor$0;
	/** @type {!number} */
	var cursor$1;
	/** @type {!number} */
	var cursor$2;
	/** @type {!number} */
	var limit$0;
	/** @type {!number} */
	var cursor$3;
	/** @type {!number} */
	var cursor$4;
	/** @type {!number} */
	var limit$1;
	/** @type {!number} */
	var cursor$5;
	/** @type {!number} */
	var cursor$6;
	v_1 = this.cursor;
	lab0 = true;
lab0:
	while (lab0 === true) {
		lab0 = false;
		if (! this.r_prelude$()) {
			break lab0;
		}
	}
	cursor$0 = this.cursor = v_1;
	v_2 = cursor$0;
	lab1 = true;
lab1:
	while (lab1 === true) {
		lab1 = false;
		if (! this.r_mark_regions$()) {
			break lab1;
		}
	}
	cursor$4 = this.cursor = v_2;
	this.limit_backward = cursor$4;
	cursor$5 = this.cursor = limit$1 = this.limit;
	v_3 = limit$1 - cursor$5;
	lab2 = true;
lab2:
	while (lab2 === true) {
		lab2 = false;
		lab3 = true;
	lab3:
		while (lab3 === true) {
			lab3 = false;
			v_4 = this.limit - this.cursor;
			lab4 = true;
		lab4:
			while (lab4 === true) {
				lab4 = false;
				v_5 = this.limit - this.cursor;
				lab5 = true;
			lab5:
				while (lab5 === true) {
					lab5 = false;
					v_6 = this.limit - this.cursor;
					lab6 = true;
				lab6:
					while (lab6 === true) {
						lab6 = false;
						if (! this.r_standard_suffix$()) {
							break lab6;
						}
						break lab5;
					}
					this.cursor = this.limit - v_6;
					if (! this.r_verb_suffix$()) {
						break lab4;
					}
				}
				cursor$3 = this.cursor = (limit$0 = this.limit) - v_5;
				v_7 = limit$0 - cursor$3;
				lab7 = true;
			lab7:
				while (lab7 === true) {
					lab7 = false;
					this.ket = this.cursor;
					if (! this.eq_s_b$IS(1, "i")) {
						break lab7;
					}
					this.bra = cursor$1 = this.cursor;
					v_8 = this.limit - cursor$1;
					if (! this.eq_s_b$IS(1, "c")) {
						break lab7;
					}
					cursor$2 = this.cursor = this.limit - v_8;
					if (! (! (this.I_pV <= cursor$2) ? false : true)) {
						break lab7;
					}
					if (! this.slice_from$S("")) {
						return false;
					}
				}
				this.cursor = this.limit - v_7;
				break lab3;
			}
			this.cursor = this.limit - v_4;
			if (! this.r_residual_suffix$()) {
				break lab2;
			}
		}
	}
	this.cursor = this.limit - v_3;
	lab8 = true;
lab8:
	while (lab8 === true) {
		lab8 = false;
		if (! this.r_residual_form$()) {
			break lab8;
		}
	}
	cursor$6 = this.cursor = this.limit_backward;
	v_10 = cursor$6;
	lab9 = true;
lab9:
	while (lab9 === true) {
		lab9 = false;
		if (! this.r_postlude$()) {
			break lab9;
		}
	}
	this.cursor = v_10;
	return true;
};

/**
 * @param {*} o
 * @return {!boolean}
 */
PortugueseStemmer.prototype.equals$X = function (o) {
	return o instanceof PortugueseStemmer;
};

/**
 * @return {!number}
 */
PortugueseStemmer.prototype.hashCode$ = function () {
	/** @type {!string} */
	var classname;
	/** @type {!number} */
	var hash;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var char;
	classname = "PortugueseStemmer";
	hash = 0;
	if ("PortugueseStemmer".length === 0) {
		return (hash | 0);
	}
	for (i = 0; i < classname.length; i++) {
		char = classname.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return (hash | 0);
};

/**
 * class Among extends Object
 * @constructor
 */
function Among() {
}

/**
 * @constructor
 * @param {!string} s
 * @param {!number} substring_i
 * @param {!number} result
 */
function Among$SII(s, substring_i, result) {
	this.s_size = s.length;
	this.s = s;
	this.substring_i = substring_i;
	this.result = result;
	this.method = null;
	this.instance = null;
};

Among$SII.prototype = new Among;

/**
 * @constructor
 * @param {!string} s
 * @param {!number} substring_i
 * @param {!number} result
 * @param {*} method
 * @param {BaseStemmer} instance
 */
function Among$SIIF$LBaseStemmer$B$LBaseStemmer$(s, substring_i, result, method, instance) {
	this.s_size = s.length;
	this.s = s;
	this.substring_i = substring_i;
	this.result = result;
	this.method = method;
	this.instance = instance;
};

Among$SIIF$LBaseStemmer$B$LBaseStemmer$.prototype = new Among;

/**
 * class Metadata extends Object
 * @constructor
 */
function Metadata() {
}

/**
 * @constructor
 * @param {Oktavia} parent
 */
function Metadata$LOktavia$(parent) {
	this._parent = parent;
	this._bitVector = new BitVector$();
};

Metadata$LOktavia$.prototype = new Metadata;

/**
 * @return {!number}
 */
Metadata.prototype._size$ = function () {
	/** @type {BitVector} */
	var this$0;
	/** @type {!number} */
	var i$0;
	/** @type {BitVector} */
	var _bitVector$0;
	this$0 = _bitVector$0 = this._bitVector;
	i$0 = _bitVector$0._size;
	return this$0.rank$IB(i$0, true);
};

/**
 * @param {!number} index
 * @return {!string}
 */
Metadata.prototype.getContent$I = function (index) {
	/** @type {!number} */
	var startPosition;
	/** @type {!number} */
	var length;
	if (index < 0 || this._size$() <= index) {
		throw new Error("Section.getContent() : range error " + (index + ""));
	}
	startPosition = 0;
	if (index > 0) {
		startPosition = this._bitVector.select$I(index - 1) + 1;
	}
	length = this._bitVector.select$I(index) - startPosition + 1;
	return this._parent._getSubstring$II(startPosition, length);
};

/**
 * @param {!number} index
 * @return {!number}
 */
Metadata.prototype.getStartPosition$I = function (index) {
	/** @type {!number} */
	var startPosition;
	if (index < 0 || this._size$() <= index) {
		throw new Error("Section.getContent() : range error " + (index + ""));
	}
	startPosition = 0;
	if (index > 0) {
		startPosition = this._bitVector.select$I(index - 1) + 1;
	}
	return (startPosition | 0);
};

/**
 * @param {SingleResult} result
 * @param {Array.<undefined|!number>} positions
 * @param {!string} word
 * @param {!boolean} stemmed
 */
Metadata.prototype.grouping$LSingleResult$AISB = function (result, positions, word, stemmed) {
};

/**
 * @param {!number} index
 * @return {!string}
 */
Metadata.prototype.getInformation$I = function (index) {
	return '';
};

/**
 */
Metadata.prototype._build$ = function () {
	this._bitVector.build$();
};

/**
 * @param {!string} name
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
Metadata.prototype._load$SSI = function (name, data, offset) {
	offset = this._bitVector.load$SI(data, offset);
	this._parent._metadataLabels.push(name);
	this._parent._metadatas[name] = this;
	return offset;
};

/**
 * @return {!string}
 */
Metadata.prototype._dump$ = function () {
	/** @type {BitVector} */
	var this$0;
	/** @type {Array.<undefined|!string>} */
	var contents$0;
	this$0 = this._bitVector;
	contents$0 = [  ];
	contents$0.push(Binary$dump32bitNumber$N(this$0._size));
	contents$0.push(Binary$dump32bitNumberList$AN(this$0._v));
	return contents$0.join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
Metadata.prototype._dump$LCompressionReport$ = function (report) {
	/** @type {BitVector} */
	var this$0;
	/** @type {Array.<undefined|!string>} */
	var contents$0;
	this$0 = this._bitVector;
	contents$0 = [  ];
	contents$0.push(Binary$dump32bitNumber$N(this$0._size));
	CompressionReport$add$LCompressionReport$II(report, 2, 2);
	contents$0.push(Binary$dump32bitNumberList$ANLCompressionReport$(this$0._v, report));
	return contents$0.join('');
};

/**
 * class Section extends Metadata
 * @constructor
 */
function Section() {
}

Section.prototype = new Metadata;
/**
 * @constructor
 * @param {Oktavia} parent
 */
function Section$LOktavia$(parent) {
	this._parent = parent;
	this._bitVector = new BitVector$();
	this._names = [  ];
};

Section$LOktavia$.prototype = new Section;

/**
 * @param {!string} name
 */
Section.prototype.setTail$S = function (name) {
	/** @type {!number} */
	var index$0;
	/** @type {Oktavia} */
	var this$0;
	/** @type {FMIndex} */
	var this$0$0;
	this$0 = this._parent;
	this$0$0 = this$0._fmindex;
	index$0 = this$0$0._substr.length;
	this._names.push(name);
	this._bitVector.set$I(index$0 - 1);
};

/**
 * @param {!string} name
 * @param {!number} index
 */
Section.prototype.setTail$SI = function (name, index) {
	this._names.push(name);
	this._bitVector.set$I(index - 1);
};

/**
 * @return {!number}
 */
Section.prototype.size$ = function () {
	return (this._names.length | 0);
};

/**
 * @param {!number} position
 * @return {!number}
 */
Section.prototype.getSectionIndex$I = function (position) {
	/** @type {BitVector} */
	var this$0;
	if (position < 0 || this._bitVector.size$() <= position) {
		throw new Error("Section.getSectionIndex() : range error " + (position + ""));
	}
	this$0 = this._bitVector;
	return this$0.rank$IB(position, true);
};

/**
 * @param {!number} index
 * @return {!string}
 */
Section.prototype.getName$I = function (index) {
	if (index < 0 || this._names.length <= index) {
		throw new Error("Section.getName() : range error");
	}
	return this._names[index];
};

/**
 * @param {SingleResult} result
 * @param {Array.<undefined|!number>} positions
 * @param {!string} word
 * @param {!boolean} stemmed
 */
Section.prototype.grouping$LSingleResult$AISB = function (result, positions, word, stemmed) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!number} */
	var position;
	/** @type {!number} */
	var index;
	/** @type {SearchUnit} */
	var unit;
	for (i = 0; i < positions.length; i++) {
		position = positions[i];
		index = this.getSectionIndex$I(position);
		unit = SingleResult$getSearchUnit$LSingleResult$I(result, index);
		if (unit.startPosition < 0) {
			unit.startPosition = this.getStartPosition$I(index);
		}
		SearchUnit$addPosition$LSearchUnit$SIB(unit, word, position - unit.startPosition, stemmed);
	}
};

/**
 * @param {!number} index
 * @return {!string}
 */
Section.prototype.getInformation$I = function (index) {
	return this.getName$I(index);
};

/**
 * @param {Oktavia} parent
 * @param {!string} name
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
Section._load$LOktavia$SSI = function (parent, name, data, offset) {
	/** @type {LoadedStringListResult} */
	var strs;
	/** @type {Section} */
	var section;
	/** @type {!number} */
	var offset$0;
	strs = new LoadedStringListResult$SI(data, offset);
	section = new Section$LOktavia$(parent);
	section._names = strs.result;
	offset$0 = strs.offset;
	offset$0 = section._bitVector.load$SI(data, offset$0);
	section._parent._metadataLabels.push(name);
	section._parent._metadatas[name] = section;
	return offset$0;
};

var Section$_load$LOktavia$SSI = Section._load$LOktavia$SSI;

/**
 * @return {!string}
 */
Section.prototype._dump$ = function () {
	return [ Binary$dump16bitNumber$I(0), Binary$dumpStringList$AS(this._names), Metadata.prototype._dump$.call(this) ].join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
Section.prototype._dump$LCompressionReport$ = function (report) {
	CompressionReport$add$LCompressionReport$II(report, 1, 1);
	return [ Binary$dump16bitNumber$I(0), Binary$dumpStringList$ASLCompressionReport$(this._names, report), Metadata.prototype._dump$LCompressionReport$.call(this, report) ].join('');
};

/**
 * class Splitter extends Metadata
 * @constructor
 */
function Splitter() {
}

Splitter.prototype = new Metadata;
/**
 * @constructor
 * @param {Oktavia} parent
 */
function Splitter$LOktavia$(parent) {
	this._parent = parent;
	this._bitVector = new BitVector$();
	this.name = null;
};

Splitter$LOktavia$.prototype = new Splitter;

/**
 * @constructor
 * @param {Oktavia} parent
 * @param {!string} name
 */
function Splitter$LOktavia$S(parent, name) {
	this._parent = parent;
	this._bitVector = new BitVector$();
	this.name = name;
};

Splitter$LOktavia$S.prototype = new Splitter;

/**
 * @return {!number}
 */
Splitter.prototype.size$ = function () {
	/** @type {BitVector} */
	var this$0$0;
	/** @type {!number} */
	var i$0$0;
	/** @type {BitVector} */
	var _bitVector$0;
	this$0$0 = _bitVector$0 = this._bitVector;
	i$0$0 = _bitVector$0._size;
	return this$0$0.rank$IB(i$0$0, true);
};

/**
 */
Splitter.prototype.split$ = function () {
	/** @type {!number} */
	var index$0;
	/** @type {Oktavia} */
	var this$0;
	/** @type {FMIndex} */
	var this$0$0;
	this$0 = this._parent;
	this$0$0 = this$0._fmindex;
	index$0 = this$0$0._substr.length;
	this._bitVector.set$I(index$0 - 1);
};

/**
 * @param {!number} index
 */
Splitter.prototype.split$I = function (index) {
	this._bitVector.set$I(index - 1);
};

/**
 * @param {!number} position
 * @return {!number}
 */
Splitter.prototype.getIndex$I = function (position) {
	/** @type {BitVector} */
	var this$0;
	if (position < 0 || this._bitVector.size$() <= position) {
		throw new Error("Section.getSectionIndex() : range error");
	}
	this$0 = this._bitVector;
	return this$0.rank$IB(position, true);
};

/**
 * @param {SingleResult} result
 * @param {Array.<undefined|!number>} positions
 * @param {!string} word
 * @param {!boolean} stemmed
 */
Splitter.prototype.grouping$LSingleResult$AISB = function (result, positions, word, stemmed) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!number} */
	var position;
	/** @type {!number} */
	var index;
	/** @type {SearchUnit} */
	var unit;
	for (i = 0; i < positions.length; i++) {
		position = positions[i];
		index = this.getIndex$I(position);
		unit = SingleResult$getSearchUnit$LSingleResult$I(result, index);
		if (unit.startPosition < 0) {
			unit.startPosition = this.getStartPosition$I(index);
		}
		SearchUnit$addPosition$LSearchUnit$SIB(unit, word, position - unit.startPosition, stemmed);
	}
};

/**
 * @param {!number} index
 * @return {!string}
 */
Splitter.prototype.getInformation$I = function (index) {
	return (this.name != null ? this.name + (index + 1 + "") : '');
};

/**
 * @param {Oktavia} parent
 * @param {!string} name
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
Splitter._load$LOktavia$SSI = function (parent, name, data, offset) {
	/** @type {Splitter} */
	var section;
	section = new Splitter$LOktavia$(parent);
	offset = section._bitVector.load$SI(data, offset);
	section._parent._metadataLabels.push(name);
	section._parent._metadatas[name] = section;
	return offset;
};

var Splitter$_load$LOktavia$SSI = Splitter._load$LOktavia$SSI;

/**
 * @return {!string}
 */
Splitter.prototype._dump$ = function () {
	return [ Binary$dump16bitNumber$I(1), Metadata.prototype._dump$.call(this) ].join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
Splitter.prototype._dump$LCompressionReport$ = function (report) {
	CompressionReport$add$LCompressionReport$II(report, 1, 1);
	return [ Binary$dump16bitNumber$I(1), Metadata.prototype._dump$LCompressionReport$.call(this, report) ].join('');
};

/**
 * class Table extends Metadata
 * @constructor
 */
function Table() {
}

Table.prototype = new Metadata;
/**
 * @constructor
 * @param {Oktavia} parent
 * @param {Array.<undefined|!string>} headers
 */
function Table$LOktavia$AS(parent, headers) {
	this._parent = parent;
	this._bitVector = new BitVector$();
	this._headers = headers;
	this._columnTails = new BitVector$();
};

Table$LOktavia$AS.prototype = new Table;

/**
 * @return {!number}
 */
Table.prototype.rowSize$ = function () {
	/** @type {BitVector} */
	var this$0$0;
	/** @type {!number} */
	var i$0$0;
	/** @type {BitVector} */
	var _bitVector$0;
	this$0$0 = _bitVector$0 = this._bitVector;
	i$0$0 = _bitVector$0._size;
	return this$0$0.rank$IB(i$0$0, true);
};

/**
 * @return {!number}
 */
Table.prototype.columnSize$ = function () {
	return (this._headers.length | 0);
};

/**
 */
Table.prototype.setColumnTail$ = function () {
	/** @type {!number} */
	var index;
	/** @type {Oktavia} */
	var this$0;
	/** @type {FMIndex} */
	var this$0$0;
	/** @type {Oktavia} */
	var _parent$0;
	this$0 = _parent$0 = this._parent;
	this$0$0 = this$0._fmindex;
	index = this$0$0._substr.length;
	_parent$0._fmindex.push$S(Oktavia.eob);
	this._columnTails.set$I(index - 1);
};

/**
 */
Table.prototype.setRowTail$ = function () {
	/** @type {!number} */
	var index;
	/** @type {Oktavia} */
	var this$0;
	/** @type {FMIndex} */
	var this$0$0;
	this$0 = this._parent;
	this$0$0 = this$0._fmindex;
	index = this$0$0._substr.length;
	this._bitVector.set$I(index - 1);
};

/**
 * @param {!number} position
 * @return {Array.<undefined|!number>}
 */
Table.prototype.getCell$I = function (position) {
	/** @type {!number} */
	var row;
	/** @type {!number} */
	var currentColumn;
	/** @type {!number} */
	var lastRowColumn;
	/** @type {!number} */
	var startPosition;
	/** @type {Array.<undefined|!number>} */
	var result;
	/** @type {BitVector} */
	var this$0;
	/** @type {BitVector} */
	var this$1;
	if (position < 0 || this._bitVector.size$() <= position) {
		throw new Error("Section.getSectionIndex() : range error " + (position + ""));
	}
	this$0 = this._bitVector;
	row = this$0.rank$IB(position, true);
	this$1 = this._columnTails;
	currentColumn = this$1.rank$IB(position, true);
	lastRowColumn = 0;
	if (row > 0) {
		startPosition = this._bitVector.select$I(row - 1) + 1;
		lastRowColumn = this._columnTails.rank$I(startPosition);
	}
	result = [ row, currentColumn - lastRowColumn ];
	return result;
};

/**
 * @param {!number} rowIndex
 * @return {Object.<string, undefined|!string>}
 */
Table.prototype.getRowContent$I = function (rowIndex) {
	/** @type {!string} */
	var content;
	/** @type {Array.<undefined|!string>} */
	var values;
	/** @type {Object.<string, undefined|!string>} */
	var result;
	/** @type {!number} */
	var i;
	content = this.getContent$I(rowIndex);
	values = content.split(Oktavia.eob, this._headers.length);
	result = ({  });
	for (i in this._headers) {
		if (i < values.length) {
			result[this._headers[i]] = values[i];
		} else {
			result[this._headers[i]] = '';
		}
	}
	return result;
};

/**
 * @param {SingleResult} result
 * @param {Array.<undefined|!number>} positions
 * @param {!string} word
 * @param {!boolean} stemmed
 */
Table.prototype.grouping$LSingleResult$AISB = function (result, positions, word, stemmed) {
};

/**
 * @param {!number} index
 * @return {!string}
 */
Table.prototype.getInformation$I = function (index) {
	return '';
};

/**
 */
Table.prototype._build$ = function () {
	this._bitVector.build$();
	this._columnTails.build$();
};

/**
 * @param {Oktavia} parent
 * @param {!string} name
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
Table._load$LOktavia$SSI = function (parent, name, data, offset) {
	/** @type {LoadedStringListResult} */
	var strs;
	/** @type {Table} */
	var table;
	/** @type {!number} */
	var offset$0;
	strs = new LoadedStringListResult$SI(data, offset);
	table = new Table$LOktavia$AS(parent, strs.result);
	offset$0 = strs.offset;
	offset$0 = table._bitVector.load$SI(data, offset$0);
	table._parent._metadataLabels.push(name);
	table._parent._metadatas[name] = table;
	offset = offset$0;
	return table._columnTails.load$SI(data, offset$0);
};

var Table$_load$LOktavia$SSI = Table._load$LOktavia$SSI;

/**
 * @return {!string}
 */
Table.prototype._dump$ = function () {
	return [ Binary$dump16bitNumber$I(2), Binary$dumpStringList$AS(this._headers), Metadata.prototype._dump$.call(this), this._columnTails.dump$() ].join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
Table.prototype._dump$LCompressionReport$ = function (report) {
	CompressionReport$add$LCompressionReport$II(report, 1, 1);
	return [ Binary$dump16bitNumber$I(2), Binary$dumpStringList$ASLCompressionReport$(this._headers, report), Metadata.prototype._dump$LCompressionReport$.call(this, report), this._columnTails.dump$LCompressionReport$(report) ].join('');
};

/**
 * class Block extends Metadata
 * @constructor
 */
function Block() {
}

Block.prototype = new Metadata;
/**
 * @constructor
 * @param {Oktavia} parent
 */
function Block$LOktavia$(parent) {
	this._parent = parent;
	this._bitVector = new BitVector$();
	this._names = [  ];
	this._start = false;
};

Block$LOktavia$.prototype = new Block;

/**
 * @param {!string} blockName
 */
Block.prototype.startBlock$S = function (blockName) {
	this.startBlock$SI(blockName, this._parent.contentSize$());
};

/**
 * @param {!string} blockName
 * @param {!number} index
 */
Block.prototype.startBlock$SI = function (blockName, index) {
	if (this._start) {
		throw new Error('Splitter `' + this._names[this._names.length - 1] + '` is not closed');
	}
	this._start = true;
	this._names.push(blockName);
	this._bitVector.set$I(index - 1);
};

/**
 */
Block.prototype.endBlock$ = function () {
	this.endBlock$I(this._parent.contentSize$());
};

/**
 * @param {!number} index
 */
Block.prototype.endBlock$I = function (index) {
	if (! this._start) {
		throw new Error('Splitter is not started');
	}
	this._start = false;
	this._bitVector.set$I(index - 1);
};

/**
 * @return {!number}
 */
Block.prototype.size$ = function () {
	return (this._names.length | 0);
};

/**
 * @param {!number} position
 * @return {!number}
 */
Block.prototype.blockIndex$I = function (position) {
	/** @type {!number} */
	var result;
	/** @type {BitVector} */
	var this$0;
	if (position < 0 || this._parent._fmindex.size$() - 1 <= position) {
		throw new Error("Block.blockIndex() : range error " + (position + ""));
	}
	if (position >= this._bitVector.size$()) {
		position = (this._bitVector.size$() - 1 | 0);
		result = (this._bitVector.rank$I(position) + 1 | 0);
	} else {
		this$0 = this._bitVector;
		result = this$0.rank$IB(position, true);
	}
	return result;
};

/**
 * @param {!number} position
 * @return {!boolean}
 */
Block.prototype.inBlock$I = function (position) {
	/** @type {!number} */
	var blockIndex;
	blockIndex = this.blockIndex$I(position);
	return blockIndex % 2 !== 0;
};

/**
 * @param {!number} position
 * @return {!string}
 */
Block.prototype.getBlockContent$I = function (position) {
	/** @type {!number} */
	var blockIndex;
	/** @type {!string} */
	var result;
	blockIndex = this.blockIndex$I(position);
	if (blockIndex % 2 !== 0) {
		result = this.getContent$I(blockIndex);
	} else {
		result = '';
	}
	return result;
};

/**
 * @param {!number} position
 * @return {!string}
 */
Block.prototype.getBlockName$I = function (position) {
	/** @type {!number} */
	var blockIndex;
	/** @type {!string} */
	var result;
	blockIndex = this.blockIndex$I(position);
	if (blockIndex % 2 !== 0) {
		result = this._names[blockIndex >>> 1];
	} else {
		result = '';
	}
	return result;
};

/**
 * @param {SingleResult} result
 * @param {Array.<undefined|!number>} positions
 * @param {!string} word
 * @param {!boolean} stemmed
 */
Block.prototype.grouping$LSingleResult$AISB = function (result, positions, word, stemmed) {
};

/**
 * @param {!number} index
 * @return {!string}
 */
Block.prototype.getInformation$I = function (index) {
	return '';
};

/**
 * @param {Oktavia} parent
 * @param {!string} name
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
Block._load$LOktavia$SSI = function (parent, name, data, offset) {
	/** @type {LoadedStringListResult} */
	var strs;
	/** @type {Block} */
	var block;
	/** @type {!number} */
	var offset$0;
	strs = new LoadedStringListResult$SI(data, offset);
	block = new Block$LOktavia$(parent);
	block._names = strs.result;
	offset$0 = strs.offset;
	offset$0 = block._bitVector.load$SI(data, offset$0);
	block._parent._metadataLabels.push(name);
	block._parent._metadatas[name] = block;
	return offset$0;
};

var Block$_load$LOktavia$SSI = Block._load$LOktavia$SSI;

/**
 * @return {!string}
 */
Block.prototype._dump$ = function () {
	return [ Binary$dump16bitNumber$I(3), Binary$dumpStringList$AS(this._names), Metadata.prototype._dump$.call(this) ].join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
Block.prototype._dump$LCompressionReport$ = function (report) {
	CompressionReport$add$LCompressionReport$II(report, 1, 1);
	return [ Binary$dump16bitNumber$I(3), Binary$dumpStringList$ASLCompressionReport$(this._names, report), Metadata.prototype._dump$LCompressionReport$.call(this, report) ].join('');
};

/**
 * class FMIndex extends Object
 * @constructor
 */
function FMIndex() {
}

/**
 * @constructor
 */
function FMIndex$() {
	/** @type {Array.<undefined|!number>} */
	var _rlt$0;
	this._ssize = 0;
	(this._ddic = 0, this._head = 0);
	this._substr = "";
	this._sv = new WaveletMatrix$();
	this._posdic = [  ];
	this._idic = [  ];
	_rlt$0 = this._rlt = [  ];
	_rlt$0.length = 65536;
};

FMIndex$.prototype = new FMIndex;

/**
 */
FMIndex.prototype.clear$ = function () {
	/** @type {WaveletMatrix} */
	var this$0;
	this$0 = this._sv;
	this$0._bv.length = 0;
	this$0._seps.length = 0;
	this$0._size = 0;
	this._posdic.length = 0;
	this._idic.length = 0;
	this._ddic = 0;
	this._head = 0;
	this._substr = "";
};

/**
 * @return {!number}
 */
FMIndex.prototype.size$ = function () {
	/** @type {WaveletMatrix} */
	var this$0;
	this$0 = this._sv;
	return this$0._size;
};

/**
 * @return {!number}
 */
FMIndex.prototype.contentSize$ = function () {
	return this._substr.length;
};

/**
 * @param {!string} key
 * @return {!number}
 */
FMIndex.prototype.getRows$S = function (key) {
	/** @type {Array.<undefined|!number>} */
	var pos;
	pos = [  ];
	return this.getRows$SAI(key, pos);
};

/**
 * @param {!string} key
 * @param {Array.<undefined|!number>} pos
 * @return {!number}
 */
FMIndex.prototype.getRows$SAI = function (key, pos) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var code;
	/** @type {!number} */
	var first;
	/** @type {undefined|!number} */
	var last;
	/** @type {!number} */
	var c;
	/** @type {Array.<undefined|!number>} */
	var _rlt$0;
	i = key.length - 1;
	code = key.charCodeAt(i);
	first = (_rlt$0 = this._rlt)[code] + 1;
	last = _rlt$0[code + 1];
	while (first <= last) {
		if (i === 0) {
			pos[0] = (-- first | 0);
			pos[1] = -- last;
			return (last - first + 1 | 0);
		}
		i--;
		c = key.charCodeAt(i);
		first = this._rlt[c] + this._sv.rank$II(first - 1, c) + 1;
		last = this._rlt[c] + this._sv.rank$II(last, c);
	}
	return 0;
};

/**
 * @param {!number} i
 * @return {!number}
 */
FMIndex.prototype.getPosition$I = function (i) {
	/** @type {!number} */
	var pos;
	/** @type {!number} */
	var c;
	if (i >= this.size$()) {
		throw new Error("FMIndex.getPosition() : range error");
	}
	pos = 0;
	while (i !== this._head) {
		if (i % this._ddic === 0) {
			pos += this._posdic[i / this._ddic] + 1;
			break;
		}
		c = this._sv.get$I(i);
		i = this._rlt[c] + this._sv.rank$II(i, c);
		pos++;
	}
	return (pos % this.size$() | 0);
};

/**
 * @param {!number} pos
 * @param {!number} len
 * @return {!string}
 */
FMIndex.prototype.getSubstring$II = function (pos, len) {
	/** @type {!number} */
	var pos_end;
	/** @type {!number} */
	var pos_tmp;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var pos_idic;
	/** @type {!string} */
	var substr;
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var _ddic$0;
	if (pos >= this.size$()) {
		throw new Error("FMIndex.getSubstring() : range error");
	}
	pos_end = Math.min(pos + len, this.size$());
	pos_tmp = this.size$() - 1;
	i = this._head;
	pos_idic = Math.floor((pos_end + (_ddic$0 = this._ddic) - 2) / _ddic$0);
	if (pos_idic < this._idic.length) {
		pos_tmp = pos_idic * this._ddic;
		i = this._idic[pos_idic];
	}
	substr = "";
	while (pos_tmp >= pos) {
		c = this._sv.get$I(i);
		i = this._rlt[c] + this._sv.rank$II(i, c);
		if (pos_tmp < pos_end) {
			substr = String.fromCharCode(c) + substr;
		}
		if (pos_tmp === 0) {
			break;
		}
		pos_tmp--;
	}
	return substr;
};

/**
 */
FMIndex.prototype.build$ = function () {
	this.build$SIIB(String.fromCharCode(0), 65535, 20, false);
};

/**
 * @param {!string} end_marker
 * @param {!number} ddic
 * @param {!boolean} verbose
 */
FMIndex.prototype.build$SIB = function (end_marker, ddic, verbose) {
	this.build$SIIB(end_marker, 65535, ddic, verbose);
};

/**
 * @param {!string} end_marker
 * @param {!number} maxChar
 * @param {!number} ddic
 * @param {!boolean} verbose
 */
FMIndex.prototype.build$SIIB = function (end_marker, maxChar, ddic, verbose) {
	/** @type {BurrowsWheelerTransform} */
	var b;
	/** @type {!string} */
	var s;
	/** @type {!number} */
	var c;
	/** @type {!string} */
	var str$0;
	/** @type {WaveletMatrix} */
	var this$0;
	/** @type {!string} */
	var _str$0;
	/** @type {Array.<undefined|!number>} */
	var _suffixarray$0;
	if (verbose) {
		console.time("building burrows-wheeler transform");
	}
	this._substr += end_marker;
	b = ({_str: "", _size: 0, _head: 0, _suffixarray: [  ]});
	str$0 = this._substr;
	_str$0 = b._str = str$0;
	b._size = _str$0.length;
	_suffixarray$0 = b._suffixarray = SAIS$make$S(str$0);
	b._head = (_suffixarray$0.indexOf(0) | 0);
	s = BurrowsWheelerTransform$get$LBurrowsWheelerTransform$(b);
	this._ssize = s.length;
	this._head = b._head;
	b._str = "";
	b._size = 0;
	b._head = 0;
	b._suffixarray.length = 0;
	this._substr = "";
	if (verbose) {
		console.timeEnd("building burrows-wheeler transform");
	}
	if (verbose) {
		console.time("building wavelet matrix");
	}
	this$0 = this._sv;
	this$0._bitsize = (Math.ceil(Math.log(maxChar) / 0.6931471805599453) | 0);
	if (verbose) {
		console.log("  maxCharCode: ", maxChar);
		console.log("  bitSize: ", this._sv.bitsize$());
	}
	this._sv.build$S(s);
	if (verbose) {
		console.timeEnd("building wavelet matrix");
	}
	if (verbose) {
		console.time("caching rank less than");
	}
	for (c = 0; c < maxChar; c++) {
		this._rlt[c] = this._sv.rank_less_than$II(this._sv.size$(), c);
	}
	if (verbose) {
		console.timeEnd("caching rank less than");
	}
	this._ddic = ddic;
	if (verbose) {
		console.time("building dictionaries");
	}
	this._buildDictionaries$();
	if (verbose) {
		console.timeEnd("building dictionaries");
		console.log('');
	}
};

/**
 */
FMIndex.prototype._buildDictionaries$ = function () {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var pos;
	/** @type {!number} */
	var c;
	for (i = 0; i < this._ssize / this._ddic + 1; i++) {
		this._posdic.push(0);
		this._idic.push(0);
	}
	i = this._head;
	pos = this.size$() - 1;
	do {
		if (i % this._ddic === 0) {
			this._posdic[Math.floor(i / this._ddic)] = (pos | 0);
		}
		if (pos % this._ddic === 0) {
			this._idic[Math.floor(pos / this._ddic)] = (i | 0);
		}
		c = this._sv.get$I(i);
		i = this._rlt[c] + this._sv.rank$II(i, c);
		pos--;
	} while (i !== this._head);
};

/**
 * @param {!string} doc
 */
FMIndex.prototype.push$S = function (doc) {
	if (doc.length <= 0) {
		throw new Error("FMIndex::push(): empty string");
	}
	this._substr += doc;
};

/**
 * @param {!string} keyword
 * @return {Array.<undefined|!number>}
 */
FMIndex.prototype.search$S = function (keyword) {
	/** @type {Array.<undefined|!number>} */
	var result;
	/** @type {Array.<undefined|!number>} */
	var position;
	/** @type {!number} */
	var rows;
	/** @type {undefined|!number} */
	var first;
	/** @type {undefined|!number} */
	var last;
	/** @type {undefined|!number} */
	var i;
	result = [  ];
	position = [  ];
	rows = this.getRows$SAI(keyword, position);
	if (rows > 0) {
		first = position[0];
		last = position[1];
		for (i = first; i <= last; i++) {
			result.push(this.getPosition$I(i));
		}
	}
	return result;
};

/**
 * @return {!string}
 */
FMIndex.prototype.dump$ = function () {
	return this.dump$B(false);
};

/**
 * @param {!boolean} verbose
 * @return {!string}
 */
FMIndex.prototype.dump$B = function (verbose) {
	/** @type {Array.<undefined|!string>} */
	var contents;
	/** @type {CompressionReport} */
	var report;
	/** @type {!number} */
	var i;
	contents = [  ];
	report = ({source: 0, result: 0});
	contents.push(Binary$dump32bitNumber$N(this._ddic));
	contents.push(Binary$dump32bitNumber$N(this._ssize));
	contents.push(Binary$dump32bitNumber$N(this._head));
	CompressionReport$add$LCompressionReport$II(report, 6, 6);
	contents.push(this._sv.dump$LCompressionReport$(report));
	if (verbose) {
		console.log("Serializing FM-index");
		console.log('    Wavelet Matrix: ' + (contents[3].length * 2 + "") + ' bytes (' + (Math.round(report.result * 100.0 / report.source) + "") + '%)');
	}
	contents.push(Binary$dump32bitNumber$N(this._posdic.length));
	for (i in this._posdic) {
		contents.push(Binary$dump32bitNumber$N(this._posdic[i]));
	}
	for (i in this._idic) {
		contents.push(Binary$dump32bitNumber$N(this._idic[i]));
	}
	if (verbose) {
		console.log('    Dictionary Cache: ' + (this._idic.length * 16 + "") + ' bytes');
	}
	return contents.join("");
};

/**
 * @param {!string} data
 * @return {!number}
 */
FMIndex.prototype.load$S = function (data) {
	return this.load$SI(data, 0);
};

/**
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
FMIndex.prototype.load$SI = function (data, offset) {
	/** @type {!number} */
	var maxChar;
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var size;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var result$0;
	/** @type {!number} */
	var result$1;
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	this._ddic = (result$0 | 0);
	this._ssize = (Binary$load32bitNumber$SI(data, offset + 2) | 0);
	this._head = (Binary$load32bitNumber$SI(data, offset + 4) | 0);
	offset = this._sv.load$SI(data, offset + 6);
	maxChar = Math.pow(2, this._sv.bitsize$());
	for (c = 0; c < maxChar; c++) {
		this._rlt[c] = this._sv.rank_less_than$II(this._sv.size$(), c);
	}
	result$1 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	size = result$1;
	offset += 2;
	for (i = 0; i < size; (i++, offset += 2)) {
		this._posdic.push(Binary$load32bitNumber$SI(data, offset));
	}
	for (i = 0; i < size; (i++, offset += 2)) {
		this._idic.push(Binary$load32bitNumber$SI(data, offset));
	}
	return offset;
};

/**
 * class Tag extends Object
 * @constructor
 */
function Tag() {
}

/**
 * @constructor
 * @param {!string} name
 */
function Tag$S(name) {
	this.name = name;
	this.attributes = ({  });
	this.isSelfClosing = false;
};

Tag$S.prototype = new Tag;

/**
 * class _Common extends Object
 * @constructor
 */
function _Common() {
}

/**
 * @constructor
 */
function _Common$() {
};

_Common$.prototype = new _Common;

/**
 * class _State extends Object
 * @constructor
 */
function _State() {
}

/**
 * @constructor
 */
function _State$() {
};

_State$.prototype = new _State;

/**
 * class SAXHandler extends Object
 * @constructor
 */
function SAXHandler() {
}

/**
 * @constructor
 */
function SAXHandler$() {
	this.position = 0;
	this.column = 0;
	this.line = 0;
};

SAXHandler$.prototype = new SAXHandler;

/**
 * @param {Error} error
 */
SAXHandler.prototype.onerror$LError$ = function (error) {
};

/**
 * @param {!string} text
 */
SAXHandler.prototype.ontext$S = function (text) {
};

/**
 * @param {!string} doctype
 */
SAXHandler.prototype.ondoctype$S = function (doctype) {
};

/**
 * @param {!string} name
 * @param {!string} body
 */
SAXHandler.prototype.onprocessinginstruction$SS = function (name, body) {
};

/**
 * @param {!string} sgmlDecl
 */
SAXHandler.prototype.onsgmldeclaration$S = function (sgmlDecl) {
};

/**
 * @param {!string} tagname
 * @param {Object.<string, undefined|!string>} attributes
 */
SAXHandler.prototype.onopentag$SHS = function (tagname, attributes) {
};

/**
 * @param {!string} tagname
 */
SAXHandler.prototype.onclosetag$S = function (tagname) {
};

/**
 * @param {!string} name
 * @param {!string} value
 */
SAXHandler.prototype.onattribute$SS = function (name, value) {
};

/**
 * @param {!string} comment
 */
SAXHandler.prototype.oncomment$S = function (comment) {
};

/**
 */
SAXHandler.prototype.onopencdata$ = function () {
};

/**
 * @param {!string} cdata
 */
SAXHandler.prototype.oncdata$S = function (cdata) {
};

/**
 */
SAXHandler.prototype.onclosecdata$ = function () {
};

/**
 */
SAXHandler.prototype.onend$ = function () {
};

/**
 */
SAXHandler.prototype.onready$ = function () {
};

/**
 * @param {!string} script
 */
SAXHandler.prototype.onscript$S = function (script) {
};

/**
 * class _HTMLHandler extends SAXHandler
 * @constructor
 */
function _HTMLHandler() {
}

_HTMLHandler.prototype = new SAXHandler;
/**
 * @constructor
 * @param {Object.<string, undefined|Array.<undefined|!string>>} styles
 * @param {!boolean} escape
 */
function _HTMLHandler$HASB(styles, escape) {
	this.position = 0;
	this.column = 0;
	this.line = 0;
	this.text = [  ];
	this.escape = escape;
	this.styles = styles;
};

_HTMLHandler$HASB.prototype = new _HTMLHandler;

/**
 * @param {!string} str
 * @return {!string}
 */
_HTMLHandler.escapeHTML$S = function (str) {
	return str.replace(/\n/g, "<br/>").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

var _HTMLHandler$escapeHTML$S = _HTMLHandler.escapeHTML$S;

/**
 * @param {!string} tagname
 * @param {Object.<string, undefined|!string>} attributes
 */
_HTMLHandler.prototype.onopentag$SHS = function (tagname, attributes) {
	this.text.push(this.styles[tagname][0]);
};

/**
 * @param {!string} tagname
 */
_HTMLHandler.prototype.onclosetag$S = function (tagname) {
	this.text.push(this.styles[tagname][1]);
};

/**
 * @param {!string} text
 */
_HTMLHandler.prototype.ontext$S = function (text) {
	if (this.escape) {
		this.text.push(text.replace(/\n/g, "<br/>").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
	} else {
		this.text.push(text);
	}
};

/**
 * @return {!string}
 */
_HTMLHandler.prototype.result$ = function () {
	return this.text.join('');
};

/**
 * class SAXParser extends Object
 * @constructor
 */
function SAXParser() {
}

/**
 * @constructor
 * @param {SAXHandler} handler
 */
function SAXParser$LSAXHandler$(handler) {
	this.q = "";
	this.c = "";
	this.bufferCheckPosition = 0;
	this.looseCase = "";
	this.tags = [  ];
	this.closed = false;
	this.closedRoot = false;
	this.sawRoot = false;
	this.tag = null;
	this.error = null;
	this.handler = null;
	this.ENTITIES = null;
	this.strict = false;
	this.tagName = "";
	this.state = 0;
	this.line = 0;
	this.column = 0;
	this.position = 0;
	this.startTagPosition = 0;
	this.attribName = "";
	this.attribValue = "";
	this.script = "";
	this.textNode = "";
	this.attribList = null;
	this.noscript = false;
	this.cdata = "";
	this.procInstBody = "";
	this.procInstName = "";
	this.doctype = "";
	this.entity = "";
	this.sgmlDecl = "";
	this.comment = "";
	this.preTags = 0;
	this._init$LSAXHandler$B(handler, false);
};

SAXParser$LSAXHandler$.prototype = new SAXParser;

/**
 * @constructor
 * @param {SAXHandler} handler
 * @param {!boolean} strict
 */
function SAXParser$LSAXHandler$B(handler, strict) {
	this.q = "";
	this.c = "";
	this.bufferCheckPosition = 0;
	this.looseCase = "";
	this.tags = [  ];
	this.closed = false;
	this.closedRoot = false;
	this.sawRoot = false;
	this.tag = null;
	this.error = null;
	this.handler = null;
	this.ENTITIES = null;
	this.strict = false;
	this.tagName = "";
	this.state = 0;
	this.line = 0;
	this.column = 0;
	this.position = 0;
	this.startTagPosition = 0;
	this.attribName = "";
	this.attribValue = "";
	this.script = "";
	this.textNode = "";
	this.attribList = null;
	this.noscript = false;
	this.cdata = "";
	this.procInstBody = "";
	this.procInstName = "";
	this.doctype = "";
	this.entity = "";
	this.sgmlDecl = "";
	this.comment = "";
	this.preTags = 0;
	this._init$LSAXHandler$B(handler, strict);
};

SAXParser$LSAXHandler$B.prototype = new SAXParser;

/**
 * @param {SAXHandler} handler
 * @param {!boolean} strict
 */
SAXParser.prototype._init$LSAXHandler$B = function (handler, strict) {
	this.handler = handler;
	this.clearBuffers$();
	this.q = "";
	this.bufferCheckPosition = 65536;
	this.looseCase = 'toLowerCase';
	this.tags = [  ];
	this.closed = this.closedRoot = this.sawRoot = false;
	this.tag = null;
	this.error = null;
	this.strict = strict;
	this.noscript = strict;
	this.state = 1;
	this.ENTITIES = _Entities$entity_list$();
	this.attribList = [  ];
	this.noscript = false;
	this.preTags = 0;
};

/**
 * @param {!boolean} flag
 */
SAXParser.prototype.set_noscript$B = function (flag) {
	this.noscript = flag;
};

/**
 * @return {SAXParser}
 */
SAXParser.prototype.resume$ = function () {
	this.error = null;
	return this;
};

/**
 * @return {SAXParser}
 */
SAXParser.prototype.close$ = function () {
	return this.parse$S('');
};

/**
 * @param {!string} chunk
 * @return {SAXParser}
 */
SAXParser.prototype.parse$S = function (chunk) {
	/** @type {Char} */
	var _;
	/** @type {!number} */
	var i;
	/** @type {!string} */
	var c;
	/** @type {!number} */
	var starti;
	/** @type {!number} */
	var pad;
	/** @type {!number} */
	var returnState;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$0;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$1;
	/** @type {RegExp} */
	var charclass$2;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$3;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$4;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$5;
	/** @type {!string} */
	var text$0;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$6;
	/** @type {RegExp} */
	var charclass$7;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$8;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$9;
	/** @type {RegExp} */
	var charclass$10;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$11;
	/** @type {RegExp} */
	var charclass$12;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$13;
	/** @type {RegExp} */
	var charclass$14;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$15;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$16;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$17;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$18;
	/** @type {RegExp} */
	var charclass$19;
	/** @type {RegExp} */
	var charclass$20;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$21;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$22;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$23;
	/** @type {Object.<string, undefined|!boolean>} */
	var charclass$24;
	/** @type {!string} */
	var comment$0;
	_ = new Char$();
	if (this.error) {
		throw this.error;
	}
	if (this.closed) {
		return this.emiterror$S("Cannot write after close. Assign an onready handler.");
	}
	(i = 0, c = "");
	while (this.c = c = chunk.charAt(i++)) {
		this.position++;
		if (c === "\n") {
			this.handler.line++;
			this.handler.column = 0;
		} else {
			this.handler.column++;
		}
		switch (this.state) {
		case 1:
			if (c === "<") {
				this.state = 4;
				this.startTagPosition = this.position;
			} else {
				charclass$0 = _.whitespace;
				if (! $__jsx_ObjectHasOwnProperty.call(charclass$0, c)) {
					this.strictFail$S("Non-whitespace before first tag.");
					this.textNode = c;
					this.state = 2;
				}
			}
			continue;
		case 2:
			if (this.sawRoot && ! this.closedRoot) {
				starti = i - 1;
				while (c && c !== "<" && c !== "&") {
					c = chunk.charAt(i++);
					if (c) {
						this.position++;
						if (c === "\n") {
							this.handler.line++;
							this.handler.column = 0;
						} else {
							this.handler.column++;
						}
					}
				}
				this.textNode += chunk.substring(starti, i - 1);
			}
			if (c === "<") {
				this.state = 4;
				this.startTagPosition = this.position;
			} else {
				if (_.not$HBS(_.whitespace, c) && (! this.sawRoot || this.closedRoot)) {
					this.strictFail$S("Text data outside of root node.");
				}
				if (c === "&") {
					this.state = 3;
				} else {
					this.textNode += c;
				}
			}
			continue;
		case 33:
			if (c === "<") {
				this.state = 34;
			} else {
				this.script += c;
			}
			continue;
		case 34:
			if (c === "/") {
				this.state = 31;
			} else {
				this.script += "<" + c;
				this.state = 33;
			}
			continue;
		case 4:
			if (c === "!") {
				this.state = 5;
				this.sgmlDecl = "";
			} else {
				charclass$1 = _.whitespace;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$1, c)) {
				} else {
					charclass$2 = _.nameStart;
					if (charclass$2.test(c)) {
						this.state = 21;
						this.tagName = c;
					} else {
						if (c === "/") {
							this.state = 31;
							this.tagName = "";
						} else {
							if (c === "?") {
								this.state = 18;
								this.procInstName = this.procInstBody = "";
							} else {
								this.strictFail$S("Unencoded <");
								if (this.startTagPosition + 1 < this.position) {
									pad = this.position - this.startTagPosition;
									for (i = 0; i < pad; i++) {
										c = " " + c;
									}
								}
								this.textNode += "<" + c;
								this.state = 2;
							}
						}
					}
				}
			}
			continue;
		case 5:
			if ((this.sgmlDecl + c).toUpperCase() === _.CDATA) {
				this.closetext_if_exist$();
				this.state = 15;
				this.sgmlDecl = "";
				this.cdata = "";
			} else {
				if (this.sgmlDecl + c === "--") {
					this.state = 12;
					this.comment = "";
					this.sgmlDecl = "";
				} else {
					if ((this.sgmlDecl + c).toUpperCase() === _.DOCTYPE) {
						this.state = 7;
						if (this.doctype || this.sawRoot) {
							this.strictFail$S("Inappropriately located doctype declaration");
						}
						this.doctype = "";
						this.sgmlDecl = "";
					} else {
						if (c === ">") {
							this.closetext_if_exist$();
							this.sgmlDecl = "";
							this.state = 2;
						} else {
							charclass$3 = _.quote;
							if ($__jsx_ObjectHasOwnProperty.call(charclass$3, c)) {
								this.state = 6;
								this.sgmlDecl += c;
							} else {
								this.sgmlDecl += c;
							}
						}
					}
				}
			}
			continue;
		case 6:
			if (c === this.q) {
				this.state = 5;
				this.q = "";
			}
			this.sgmlDecl += c;
			continue;
		case 7:
			if (c === ">") {
				this.state = 2;
				this.closetext_if_exist$();
				this.doctype.trim();
			} else {
				this.doctype += c;
				if (c === "[") {
					this.state = 9;
				} else {
					charclass$4 = _.quote;
					if ($__jsx_ObjectHasOwnProperty.call(charclass$4, c)) {
						this.state = 8;
						this.q = c;
					}
				}
			}
			continue;
		case 8:
			this.doctype += c;
			if (c === this.q) {
				this.q = "";
				this.state = 7;
			}
			continue;
		case 9:
			this.doctype += c;
			if (c === "]") {
				this.state = 7;
			} else {
				charclass$5 = _.quote;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$5, c)) {
					this.state = 10;
					this.q = c;
				}
			}
			continue;
		case 10:
			this.doctype += c;
			if (c === this.q) {
				this.state = 9;
				this.q = "";
			}
			continue;
		case 12:
			if (c === "-") {
				this.state = 13;
			} else {
				this.comment += c;
			}
			continue;
		case 13:
			if (c === "-") {
				this.state = 14;
				text$0 = this.comment;
				text$0 = text$0.replace(/[\n\t]/g, ' ');
				text$0 = text$0.replace(/\s\s+/g, " ");
				comment$0 = this.comment = text$0;
				if (comment$0) {
					this.closetext_if_exist$();
					this.comment.trim();
				}
				this.comment = "";
			} else {
				this.comment += "-" + c;
				this.state = 12;
			}
			continue;
		case 14:
			if (c !== ">") {
				this.strictFail$S("Malformed comment");
				this.comment += "--" + c;
				this.state = 12;
			} else {
				this.state = 2;
			}
			continue;
		case 15:
			if (c === "]") {
				this.state = 16;
			} else {
				this.cdata += c;
			}
			continue;
		case 16:
			if (c === "]") {
				this.state = 17;
			} else {
				this.cdata += "]" + c;
				this.state = 15;
			}
			continue;
		case 17:
			if (c === ">") {
				if (this.cdata) {
					this.closetext_if_exist$();
				}
				this.cdata = "";
				this.state = 2;
			} else {
				if (c === "]") {
					this.cdata += "]";
				} else {
					this.cdata += "]]" + c;
					this.state = 15;
				}
			}
			continue;
		case 18:
			if (c === "?") {
				this.state = 20;
			} else {
				charclass$6 = _.whitespace;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$6, c)) {
					this.state = 19;
				} else {
					this.procInstName += c;
				}
			}
			continue;
		case 19:
			if (! this.procInstBody && _.is$HBS(_.whitespace, c)) {
				continue;
			} else {
				if (c === "?") {
					this.state = 20;
				} else {
					this.procInstBody += c;
				}
			}
			continue;
		case 20:
			if (c === ">") {
				this.closetext_if_exist$();
				this.procInstName = this.procInstBody = "";
				this.state = 2;
			} else {
				this.procInstBody += "?" + c;
				this.state = 19;
			}
			continue;
		case 21:
			charclass$7 = _.nameBody;
			if (charclass$7.test(c)) {
				this.tagName += c;
			} else {
				this.newTag$();
				if (c === ">") {
					this.openTag$B(false);
				} else {
					if (c === "/") {
						this.state = 22;
					} else {
						charclass$8 = _.whitespace;
						if (! $__jsx_ObjectHasOwnProperty.call(charclass$8, c)) {
							this.strictFail$S("Invalid character in tag name");
						}
						this.state = 23;
					}
				}
			}
			continue;
		case 22:
			if (c === ">") {
				this.openTag$B(true);
				this.closeTag$();
			} else {
				this.strictFail$S("Forward-slash in opening tag not followed by >");
				this.state = 23;
			}
			continue;
		case 23:
			charclass$9 = _.whitespace;
			if ($__jsx_ObjectHasOwnProperty.call(charclass$9, c)) {
				continue;
			} else {
				if (c === ">") {
					this.openTag$B(false);
				} else {
					if (c === "/") {
						this.state = 22;
					} else {
						charclass$10 = _.nameStart;
						if (charclass$10.test(c)) {
							this.attribName = c;
							this.attribValue = "";
							this.state = 24;
						} else {
							this.strictFail$S("Invalid attribute name");
						}
					}
				}
			}
			continue;
		case 24:
			if (c === "=") {
				this.state = 26;
			} else {
				if (c === ">") {
					this.strictFail$S("Attribute without value");
					this.attribValue = this.attribName;
					this.attrib$();
					this.openTag$B(false);
				} else {
					charclass$11 = _.whitespace;
					if ($__jsx_ObjectHasOwnProperty.call(charclass$11, c)) {
						this.state = 25;
					} else {
						charclass$12 = _.nameBody;
						if (charclass$12.test(c)) {
							this.attribName += c;
						} else {
							this.strictFail$S("Invalid attribute name");
						}
					}
				}
			}
			continue;
		case 25:
			if (c === "=") {
				this.state = 26;
			} else {
				charclass$13 = _.whitespace;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$13, c)) {
					continue;
				} else {
					this.strictFail$S("Attribute without value");
					this.tag.attributes[this.attribName] = "";
					this.attribValue = "";
					this.closetext_if_exist$();
					this.attribName = "";
					if (c === ">") {
						this.openTag$B(false);
					} else {
						charclass$14 = _.nameStart;
						if (charclass$14.test(c)) {
							this.attribName = c;
							this.state = 24;
						} else {
							this.strictFail$S("Invalid attribute name");
							this.state = 23;
						}
					}
				}
			}
			continue;
		case 26:
			charclass$15 = _.whitespace;
			if ($__jsx_ObjectHasOwnProperty.call(charclass$15, c)) {
				continue;
			} else {
				charclass$16 = _.quote;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$16, c)) {
					this.q = c;
					this.state = 27;
				} else {
					this.strictFail$S("Unquoted attribute value");
					this.state = 28;
					this.attribValue = c;
				}
			}
			continue;
		case 27:
			if (c !== this.q) {
				if (c === "&") {
					this.state = 29;
				} else {
					this.attribValue += c;
				}
				continue;
			}
			this.attrib$();
			this.q = "";
			this.state = 23;
			continue;
		case 28:
			charclass$17 = _.attribEnd;
			if (! $__jsx_ObjectHasOwnProperty.call(charclass$17, c)) {
				if (c === "&") {
					this.state = 30;
				} else {
					this.attribValue += c;
				}
				continue;
			}
			this.attrib$();
			if (c === ">") {
				this.openTag$B(false);
			} else {
				this.state = 23;
			}
			continue;
		case 31:
			if (! this.tagName) {
				charclass$18 = _.whitespace;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$18, c)) {
					continue;
				} else {
					charclass$19 = _.nameStart;
					if (! charclass$19.test(c)) {
						if (this.script) {
							this.script += "</" + c;
							this.state = 33;
						} else {
							this.strictFail$S("Invalid tagname in closing tag.");
						}
					} else {
						this.tagName = c;
					}
				}
			} else {
				if (c === ">") {
					this.closeTag$();
				} else {
					charclass$20 = _.nameBody;
					if (charclass$20.test(c)) {
						this.tagName += c;
					} else {
						if (this.script) {
							this.script += "</" + this.tagName;
							this.tagName = "";
							this.state = 33;
						} else {
							charclass$21 = _.whitespace;
							if (! $__jsx_ObjectHasOwnProperty.call(charclass$21, c)) {
								this.strictFail$S("Invalid tagname in closing tag");
							}
							this.state = 32;
						}
					}
				}
			}
			continue;
		case 32:
			charclass$22 = _.whitespace;
			if ($__jsx_ObjectHasOwnProperty.call(charclass$22, c)) {
				continue;
			}
			if (c === ">") {
				this.closeTag$();
			} else {
				this.strictFail$S("Invalid characters in closing tag");
			}
			continue;
		case 3:
			if (c === ";") {
				this.textNode += this.parseEntity$();
				this.entity = "";
				this.state = 2;
			} else {
				charclass$23 = _.entity;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$23, c)) {
					this.entity += c;
				} else {
					this.strictFail$S("Invalid character entity");
					this.textNode += "&" + this.entity + c;
					this.entity = "";
					this.state = 2;
				}
			}
			continue;
		case 29:
		case 30:
			if (this.state === 29) {
				returnState = 27;
			} else {
				returnState = 28;
			}
			if (c === ";") {
				this.attribValue += this.parseEntity$();
				this.entity = "";
				this.state = (returnState | 0);
			} else {
				charclass$24 = _.entity;
				if ($__jsx_ObjectHasOwnProperty.call(charclass$24, c)) {
					this.entity += c;
				} else {
					this.strictFail$S("Invalid character entity");
					this.attribValue += "&" + this.entity + c;
					this.entity = "";
					this.state = (returnState | 0);
				}
			}
			continue;
		default:
			throw new Error("Unknown state: " + (this.state + ""));
		}
	}
	this.end$();
	return this;
};

/**
 */
SAXParser.prototype.clearBuffers$ = function () {
	this.comment = '';
	this.sgmlDecl = '';
	this.textNode = '';
	this.tagName = '';
	this.doctype = '';
	this.procInstName = '';
	this.procInstBody = '';
	this.entity = '';
	this.attribName = '';
	this.attribValue = '';
	this.cdata = '';
	this.script = '';
};

/**
 */
SAXParser.prototype.closetext_if_exist$ = function () {
	if (this.textNode !== '') {
		this.closetext$();
	}
};

/**
 */
SAXParser.prototype.closetext$ = function () {
	/** @type {!string} */
	var text;
	/** @type {!string} */
	var text$0;
	if (this.preTags === 0) {
		text$0 = this.textNode;
		text$0 = text$0.replace(/[\n\t]/g, ' ');
		text$0 = text$0.replace(/\s\s+/g, " ");
		text = text$0;
		if (text$0) {
			this.handler.ontext$S(text);
		}
	} else {
		if (this.textNode) {
			this.handler.ontext$S(this.textNode);
		}
	}
	this.textNode = "";
};

/**
 * @param {!string} text
 * @return {!string}
 */
SAXParser.prototype.textopts$S = function (text) {
	text = text.replace(/[\n\t]/g, ' ');
	text = text.replace(/\s\s+/g, " ");
	return text;
};

/**
 * @param {!string} er
 * @return {SAXParser}
 */
SAXParser.prototype.emiterror$S = function (er) {
	/** @type {Error} */
	var error;
	this.closetext$();
	er += "\nLine: " + (this.line + "") + "\nColumn: " + (this.column + "") + "\nChar: " + this.c;
	error = new Error(er);
	this.error = error;
	return this;
};

/**
 */
SAXParser.prototype.end$ = function () {
	if (! this.closedRoot) {
		this.strictFail$S("Unclosed root tag");
	}
	if (this.state !== 2) {
		this.emiterror$S("Unexpected end");
	}
	this.closetext$();
	this.c = "";
	this.closed = true;
};

/**
 * @param {!string} message
 */
SAXParser.prototype.strictFail$S = function (message) {
	if (this.strict) {
		this.emiterror$S(message);
	}
};

/**
 */
SAXParser.prototype.newTag$ = function () {
	if (! this.strict) {
		this.tagName = this.tagName.toLowerCase();
	}
	this.tag = ({name: this.tagName, attributes: ({  }), isSelfClosing: false});
	this.attribList.length = 0;
};

/**
 */
SAXParser.prototype.attrib$ = function () {
	if (! this.strict) {
		this.attribName = this.attribName.toLowerCase();
	}
	if ($__jsx_ObjectHasOwnProperty.call(this.tag.attributes, this.attribName)) {
		this.attribName = this.attribValue = "";
		return;
	}
	this.tag.attributes[this.attribName] = this.attribValue;
	this.closetext_if_exist$();
	this.attribName = this.attribValue = "";
};

/**
 */
SAXParser.prototype.openTag$ = function () {
	this.openTag$B(false);
};

/**
 * @param {!boolean} selfClosing
 */
SAXParser.prototype.openTag$B = function (selfClosing) {
	/** @type {Tag} */
	var tag$0;
	/** @type {Tag} */
	var tag$1;
	(tag$0 = this.tag).isSelfClosing = selfClosing;
	this.sawRoot = true;
	this.tags.push(tag$0);
	this.closetext_if_exist$();
	this.handler.onopentag$SHS((tag$1 = this.tag).name, tag$1.attributes);
	if (this.tag.name === 'pre') {
		this.preTags++;
	}
	if (! selfClosing) {
		if (! this.noscript && this.tagName.toLowerCase() === "script") {
			this.state = 33;
		} else {
			this.state = 2;
		}
		this.tag = null;
		this.tagName = "";
	}
	this.attribName = this.attribValue = "";
	this.attribList.length = 0;
};

/**
 */
SAXParser.prototype.closeTag$ = function () {
	/** @type {!number} */
	var t;
	/** @type {!string} */
	var tagName;
	/** @type {!string} */
	var closeTo;
	/** @type {Tag} */
	var close;
	/** @type {!number} */
	var s;
	/** @type {Tag} */
	var tag$0;
	if (! this.tagName) {
		this.strictFail$S("Weird empty close tag.");
		this.textNode += "</>";
		this.state = 2;
		return;
	}
	if (this.script) {
		if (this.tagName !== "script") {
			this.script += "</" + this.tagName + ">";
			this.tagName = "";
			this.state = 33;
			return;
		}
		this.closetext_if_exist$();
		this.script = "";
	}
	t = this.tags.length;
	tagName = this.tagName;
	if (! this.strict) {
		tagName = tagName.toLowerCase();
	}
	closeTo = tagName;
	while (t--) {
		close = this.tags[t];
		if (close.name !== closeTo) {
			this.strictFail$S("Unexpected close tag");
		} else {
			break;
		}
	}
	if (t < 0) {
		this.strictFail$S("Unmatched closing tag: " + this.tagName);
		this.textNode += "</" + this.tagName + ">";
		this.state = 2;
		return;
	}
	this.tagName = tagName;
	s = this.tags.length;
	while (s-- > t) {
		tag$0 = this.tag = this.tags.pop();
		this.tagName = tag$0.name;
		this.closetext_if_exist$();
		this.handler.onclosetag$S(this.tagName);
		if (this.tagName === 'pre') {
			this.preTags--;
		}
	}
	if (t === 0) {
		this.closedRoot = true;
	}
	this.tagName = this.attribValue = this.attribName = "";
	this.attribList.length = 0;
	this.state = 2;
};

/**
 * @return {!string}
 */
SAXParser.prototype.parseEntity$ = function () {
	/** @type {!string} */
	var entity;
	/** @type {!string} */
	var entityLC;
	/** @type {!number} */
	var num;
	/** @type {!string} */
	var numStr;
	entity = this.entity;
	entityLC = entity.toLowerCase();
	num = 0;
	numStr = "";
	if (this.ENTITIES[entity]) {
		return this.ENTITIES[entity];
	}
	if (this.ENTITIES[entityLC]) {
		return this.ENTITIES[entityLC];
	}
	entity = entityLC;
	if (entityLC.charAt(0) === "#") {
		if (entity.charAt(1) === "x") {
			entity = entity.slice(2);
			num = $__jsx_parseInt(entity, 16);
			numStr = num.toString(16);
		} else {
			entity = entity.slice(1);
			num = $__jsx_parseInt(entity, 10);
			numStr = num.toString(10);
		}
	}
	entity = entity.replace(/^0+/, "");
	if (numStr.toLowerCase() !== entity) {
		this.strictFail$S("Invalid character entity");
		return "&" + this.entity + ";";
	}
	return String.fromCharCode(num);
};

/**
 * class Char extends Object
 * @constructor
 */
function Char() {
}

/**
 * @constructor
 */
function Char$() {
	this.CDATA = "[CDATA[";
	this.DOCTYPE = "DOCTYPE";
	this.XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
	this.whitespace = this._charClass$S("\r\n\t ");
	this.number = this._charClass$S("0124356789");
	this.letter = this._charClass$S("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	this.quote = this._charClass$S("'\"");
	this.entity = this._charClass$S("0124356789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#");
	this.attribEnd = this._charClass$S("\r\n\t >");
	this.nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
	this.nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040\.\d-]/;
};

Char$.prototype = new Char;

/**
 * @param {!string} str
 * @return {Object.<string, undefined|!boolean>}
 */
Char.prototype._charClass$S = function (str) {
	/** @type {Object.<string, undefined|!boolean>} */
	var result;
	/** @type {!number} */
	var i;
	result = ({  });
	for (i = 0; i < str.length; i++) {
		result[str.slice(i, i + 1)] = true;
	}
	return result;
};

/**
 * @param {RegExp} charclass
 * @param {!string} c
 * @return {!boolean}
 */
Char.prototype.is$LRegExp$S = function (charclass, c) {
	return charclass.test(c);
};

/**
 * @param {Object.<string, undefined|!boolean>} charclass
 * @param {!string} c
 * @return {!boolean}
 */
Char.prototype.is$HBS = function (charclass, c) {
	return $__jsx_ObjectHasOwnProperty.call(charclass, c);
};

/**
 * @param {RegExp} charclass
 * @param {!string} c
 * @return {!boolean}
 */
Char.prototype.not$LRegExp$S = function (charclass, c) {
	return ! charclass.test(c);
};

/**
 * @param {Object.<string, undefined|!boolean>} charclass
 * @param {!string} c
 * @return {!boolean}
 */
Char.prototype.not$HBS = function (charclass, c) {
	return ! $__jsx_ObjectHasOwnProperty.call(charclass, c);
};

/**
 * class _Entities extends Object
 * @constructor
 */
function _Entities() {
}

/**
 * @constructor
 */
function _Entities$() {
};

_Entities$.prototype = new _Entities;

/**
 * @return {Object.<string, undefined|!string>}
 */
_Entities.entity_list$ = function () {
	/** @type {Object.<string, undefined|!string>} */
	var result;
	/** @type {!string} */
	var key;
	/** @type {*} */
	var value;
	result = ({  });
	for (key in _Entities._entities) {
		value = _Entities._entities[key];
		if (typeof value === 'string') {
			result[key] = value + "";
		} else {
			if (typeof value === 'number') {
				result[key] = String.fromCharCode(value | 0);
			}
		}
	}
	return result;
};

var _Entities$entity_list$ = _Entities.entity_list$;

/**
 * class BitVector extends Object
 * @constructor
 */
function BitVector() {
}

/**
 * @constructor
 */
function BitVector$() {
	/** @type {Array.<undefined|!number>} */
	var _v$0;
	/** @type {Array.<undefined|!number>} */
	var _r$0;
	_r$0 = this._r = [  ];
	_v$0 = this._v = [  ];
	_v$0.length = 0;
	_r$0.length = 0;
	this._size = 0;
	this._size1 = 0;
};

BitVector$.prototype = new BitVector;

/**
 */
BitVector.prototype.build$ = function () {
	/** @type {!number} */
	var i;
	this._size1 = 0;
	for (i = 0; i < this._v.length; i++) {
		if (i % 8 === 0) {
			this._r.push(true ? this._size1 : this._size - this._size1);
		}
		this._size1 += this._rank32$IIB(this._v[i], 32, true);
	}
};

/**
 */
BitVector.prototype.clear$ = function () {
	this._v.length = 0;
	this._r.length = 0;
	this._size = 0;
	this._size1 = 0;
};

/**
 * @return {!number}
 */
BitVector.prototype.size$ = function () {
	return this._size;
};

/**
 * @param {!boolean} b
 * @return {!number}
 */
BitVector.prototype.size$B = function (b) {
	return (b ? this._size1 : this._size - this._size1);
};

/**
 * @param {!number} value
 */
BitVector.prototype.set$I = function (value) {
	this.set$IB(value, true);
};

/**
 * @param {!number} value
 * @param {!boolean} flag
 */
BitVector.prototype.set$IB = function (value, flag) {
	/** @type {!number} */
	var q;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var m;
	if (value >= this._size) {
		this._size = (value + 1 | 0);
	}
	q = (value / 32 | 0);
	r = (value % 32 | 0);
	while (q >= this._v.length) {
		this._v.push(0);
	}
	m = 0x1 << r;
	if (flag) {
		this._v[q] |= m;
	} else {
		this._v[q] &= ~ m;
	}
};

/**
 * @param {!number} value
 * @return {!boolean}
 */
BitVector.prototype.get$I = function (value) {
	/** @type {!number} */
	var q;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var m;
	if (value >= this._size) {
		throw new Error("BitVector.get() : range error");
	}
	q = (value / 32 | 0);
	r = (value % 32 | 0);
	m = 0x1 << r;
	return !! (this._v[q] & m);
};

/**
 * @param {!number} i
 * @return {!number}
 */
BitVector.prototype.rank$I = function (i) {
	return this.rank$IB(i, true);
};

/**
 * @param {!number} i
 * @param {!boolean} b
 * @return {!number}
 */
BitVector.prototype.rank$IB = function (i, b) {
	/** @type {!number} */
	var q_large;
	/** @type {!number} */
	var q_small;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var rank;
	/** @type {!number} */
	var begin;
	/** @type {!number} */
	var j;
	if (i > this._size) {
		throw new Error("BitVector.rank() : range error");
	}
	if (i === 0) {
		return 0;
	}
	i--;
	q_large = (Math.floor(i / 256) | 0);
	q_small = (Math.floor(i / 32) | 0);
	r = (Math.floor(i % 32) | 0);
	rank = (this._r[q_large] | 0);
	if (! b) {
		rank = q_large * 256 - rank;
	}
	begin = q_large * 8;
	for (j = begin; j < q_small; j++) {
		rank += this._rank32$IIB(this._v[j], 32, b);
	}
	rank += this._rank32$IIB(this._v[q_small], r + 1, b);
	return rank;
};

/**
 * @param {!number} i
 * @return {!number}
 */
BitVector.prototype.select$I = function (i) {
	return this.select$IB(i, true);
};

/**
 * @param {!number} i
 * @param {!boolean} b
 * @return {!number}
 */
BitVector.prototype.select$IB = function (i, b) {
	/** @type {!number} */
	var left;
	/** @type {!number} */
	var right;
	/** @type {!number} */
	var pivot;
	/** @type {undefined|!number} */
	var rank;
	/** @type {!number} */
	var j;
	if (i >= (b ? this._size1 : this._size - this._size1)) {
		throw new Error("BitVector.select() : range error");
	}
	left = 0;
	right = this._r.length;
	while (left < right) {
		pivot = Math.floor((left + right) / 2);
		rank = this._r[pivot];
		if (! b) {
			rank = pivot * 256 - rank;
		}
		if (i < rank) {
			right = pivot;
		} else {
			left = pivot + 1;
		}
	}
	right--;
	if (b) {
		i -= (this._r[right] | 0);
	} else {
		i -= (right * 256 - this._r[right] | 0);
	}
	j = right * 8;
	while (1) {
		rank = this._rank32$IIB(this._v[j], 32, b);
		if (i < rank) {
			break;
		}
		j++;
		i -= (rank | 0);
	}
	return (j * 32 + this._select32$IIB(this._v[j], i, b) | 0);
};

/**
 * @param {!number} x
 * @param {!number} i
 * @param {!boolean} b
 * @return {!number}
 */
BitVector.prototype._rank32$IIB = function (x, i, b) {
	if (! b) {
		x = ~ x;
	}
	x <<= 32 - i;
	x = ((x & 0xaaaaaaaa) >>> 1) + (x & 0x55555555);
	x = ((x & 0xcccccccc) >>> 2) + (x & 0x33333333);
	x = ((x & 0xf0f0f0f0) >>> 4) + (x & 0x0f0f0f0f);
	x = ((x & 0xff00ff00) >>> 8) + (x & 0x00ff00ff);
	x = ((x & 0xffff0000) >>> 16) + (x & 0x0000ffff);
	return x;
};

/**
 * @param {!number} x
 * @param {!number} i
 * @param {!boolean} b
 * @return {!number}
 */
BitVector.prototype._select32$IIB = function (x, i, b) {
	/** @type {!number} */
	var x1;
	/** @type {!number} */
	var x2;
	/** @type {!number} */
	var x3;
	/** @type {!number} */
	var x4;
	/** @type {!number} */
	var x5;
	/** @type {!number} */
	var pos;
	/** @type {!number} */
	var v5;
	/** @type {!number} */
	var v4;
	/** @type {!number} */
	var v3;
	/** @type {!number} */
	var v2;
	/** @type {!number} */
	var v1;
	/** @type {!number} */
	var v0;
	if (! b) {
		x = ~ x;
	}
	x1 = ((x & 0xaaaaaaaa) >>> 1) + (x & 0x55555555);
	x2 = ((x1 & 0xcccccccc) >>> 2) + (x1 & 0x33333333);
	x3 = ((x2 & 0xf0f0f0f0) >>> 4) + (x2 & 0x0f0f0f0f);
	x4 = ((x3 & 0xff00ff00) >>> 8) + (x3 & 0x00ff00ff);
	x5 = ((x4 & 0xffff0000) >>> 16) + (x4 & 0x0000ffff);
	i++;
	pos = 0;
	v5 = x5 & 0xffffffff;
	if (i > v5) {
		i -= (v5 | 0);
		pos += 32;
	}
	v4 = x4 >>> pos & 0x0000ffff;
	if (i > v4) {
		i -= (v4 | 0);
		pos += 16;
	}
	v3 = x3 >>> pos & 0x000000ff;
	if (i > v3) {
		i -= (v3 | 0);
		pos += 8;
	}
	v2 = x2 >>> pos & 0x0000000f;
	if (i > v2) {
		i -= (v2 | 0);
		pos += 4;
	}
	v1 = x1 >>> pos & 0x00000003;
	if (i > v1) {
		i -= (v1 | 0);
		pos += 2;
	}
	v0 = x >>> pos & 0x00000001;
	if (i > v0) {
		i -= (v0 | 0);
		pos += 1;
	}
	return (pos | 0);
};

/**
 * @return {!string}
 */
BitVector.prototype.dump$ = function () {
	/** @type {Array.<undefined|!string>} */
	var contents;
	contents = [  ];
	contents.push(Binary$dump32bitNumber$N(this._size));
	contents.push(Binary$dump32bitNumberList$AN(this._v));
	return contents.join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
BitVector.prototype.dump$LCompressionReport$ = function (report) {
	/** @type {Array.<undefined|!string>} */
	var contents;
	contents = [  ];
	contents.push(Binary$dump32bitNumber$N(this._size));
	CompressionReport$add$LCompressionReport$II(report, 2, 2);
	contents.push(Binary$dump32bitNumberList$ANLCompressionReport$(this._v, report));
	return contents.join('');
};

/**
 * @param {!string} data
 * @return {!number}
 */
BitVector.prototype.load$S = function (data) {
	return this.load$SI(data, 0);
};

/**
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
BitVector.prototype.load$SI = function (data, offset) {
	/** @type {LoadedNumberListResult} */
	var result;
	/** @type {!number} */
	var result$0;
	this._v.length = 0;
	this._r.length = 0;
	this._size = 0;
	this._size1 = 0;
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	this._size = (result$0 | 0);
	result = Binary$load32bitNumberList$SI(data, offset + 2);
	this._v = result.result;
	this.build$();
	return result.offset;
};

/**
 * class WaveletMatrix extends Object
 * @constructor
 */
function WaveletMatrix() {
}

/**
 * @constructor
 */
function WaveletMatrix$() {
	/** @type {Array.<undefined|BitVector>} */
	var _bv$0;
	/** @type {Array.<undefined|!number>} */
	var _seps$0;
	this._range = ({  });
	_bv$0 = this._bv = [  ];
	_seps$0 = this._seps = [  ];
	this._bitsize = 16;
	_bv$0.length = 0;
	_seps$0.length = 0;
	this._size = 0;
};

WaveletMatrix$.prototype = new WaveletMatrix;

/**
 * @return {!number}
 */
WaveletMatrix.prototype.bitsize$ = function () {
	return this._bitsize;
};

/**
 * @param {!number} charCode
 */
WaveletMatrix.prototype.setMaxCharCode$I = function (charCode) {
	this._bitsize = (Math.ceil(Math.log(charCode) / 0.6931471805599453) | 0);
};

/**
 */
WaveletMatrix.prototype.clear$ = function () {
	this._bv.length = 0;
	this._seps.length = 0;
	this._size = 0;
};

/**
 * @param {!string} v
 */
WaveletMatrix.prototype.build$S = function (v) {
	/** @type {!number} */
	var size;
	/** @type {!number} */
	var bitsize;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var depth;
	/** @type {Object.<string, undefined|!number>} */
	var range_tmp;
	/** @type {!number} */
	var code;
	/** @type {!boolean} */
	var bit;
	/** @type {!number} */
	var key;
	/** @type {Object.<string, undefined|!number>} */
	var range_rev;
	/** @type {!string} */
	var range_key;
	/** @type {!number} */
	var value;
	/** @type {!number} */
	var pos0;
	/** @type {undefined|!number} */
	var pos1;
	/** @type {!string} */
	var range_rev_key;
	/** @type {!number} */
	var begin;
	/** @type {undefined|!number} */
	var end;
	/** @type {!number} */
	var num0;
	/** @type {!number} */
	var num1;
	this._bv.length = 0;
	this._seps.length = 0;
	this._size = 0;
	size = v.length;
	bitsize = this._bitsize;
	for (i = 0; i < bitsize; i++) {
		this._bv.push(new BitVector$());
		this._seps.push(0);
	}
	this._size = (size | 0);
	for (i = 0; i < size; i++) {
		this._bv[0].set$IB(i, this._uint2bit$II(v.charCodeAt(i), 0));
	}
	this._bv[0].build$();
	this._seps[0] = this._bv[0].size$B(false);
	this._range["0"] = 0;
	this._range["1"] = this._seps[0];
	depth = 1;
	while (depth < bitsize) {
		range_tmp = WaveletMatrix$_shallow_copy$HI(this._range);
		for (i = 0; i < size; i++) {
			code = v.charCodeAt(i);
			bit = this._uint2bit$II(code, depth);
			key = code >>> bitsize - depth;
			this._bv[depth].set$IB(range_tmp[key + ""], bit);
			range_tmp[key + ""]++;
		}
		this._bv[depth].build$();
		this._seps[depth] = this._bv[depth].size$B(false);
		range_rev = ({  });
		for (range_key in this._range) {
			value = this._range[range_key];
			if (value != range_tmp[range_key]) {
				range_rev[value + ""] = range_key | 0;
			}
		}
		this._range = ({  });
		pos0 = 0;
		pos1 = this._seps[depth];
		for (range_rev_key in range_rev) {
			begin = range_rev_key | 0;
			value = range_rev[range_rev_key];
			end = range_tmp[value + ""];
			num0 = this._bv[depth].rank$IB(end, false) - this._bv[depth].rank$IB(begin, false);
			num1 = end - begin - num0;
			if (num0 > 0) {
				this._range[(value << 1) + ""] = (pos0 | 0);
				pos0 += num0;
			}
			if (num1 > 0) {
				this._range[(value << 1) + 1 + ""] = pos1;
				pos1 += (num1 | 0);
			}
		}
		depth++;
	}
};

/**
 * @return {!number}
 */
WaveletMatrix.prototype.size$ = function () {
	return this._size;
};

/**
 * @param {!number} c
 * @return {!number}
 */
WaveletMatrix.prototype.size$I = function (c) {
	return this.rank$II(this._size, c);
};

/**
 * @param {!number} i
 * @return {!number}
 */
WaveletMatrix.prototype.get$I = function (i) {
	/** @type {!number} */
	var value;
	/** @type {!number} */
	var depth;
	/** @type {!boolean} */
	var bit;
	if (i >= this._size) {
		throw new Error("WaveletMatrix.get() : range error");
	}
	value = 0;
	depth = 0;
	while (depth < this._bitsize) {
		bit = this._bv[depth].get$I(i);
		i = this._bv[depth].rank$IB(i, bit);
		value <<= 1;
		if (bit) {
			i += this._seps[depth];
			value += 1;
		}
		depth++;
	}
	return (value | 0);
};

/**
 * @param {!number} i
 * @param {!number} c
 * @return {!number}
 */
WaveletMatrix.prototype.rank$II = function (i, c) {
	/** @type {undefined|!number} */
	var begin;
	/** @type {!number} */
	var end;
	/** @type {!number} */
	var depth;
	/** @type {!boolean} */
	var bit;
	if (i > this._size) {
		throw new Error("WaveletMatrix.rank(): range error");
	}
	if (i === 0) {
		return 0;
	}
	begin = this._range[c + ""];
	if (begin == null) {
		return 0;
	}
	end = i;
	depth = 0;
	while (depth < this._bitsize) {
		bit = this._uint2bit$II(c, depth);
		end = this._bv[depth].rank$IB(end, bit);
		if (bit) {
			end += this._seps[depth];
		}
		depth++;
	}
	return (end - begin | 0);
};

/**
 * @param {!number} i
 * @param {!number} c
 * @return {!number}
 */
WaveletMatrix.prototype.rank_less_than$II = function (i, c) {
	/** @type {!number} */
	var begin;
	/** @type {!number} */
	var end;
	/** @type {!number} */
	var depth;
	/** @type {!number} */
	var rlt;
	/** @type {!number} */
	var rank0_begin;
	/** @type {!number} */
	var rank0_end;
	/** @type {Array.<undefined|!number>} */
	var _seps$0;
	if (i > this._size) {
		throw new Error("WaveletMatrix.rank_less_than(): range error");
	}
	if (i === 0) {
		return 0;
	}
	begin = 0;
	end = i;
	depth = 0;
	rlt = 0;
	while (depth < this._bitsize) {
		rank0_begin = this._bv[depth].rank$IB(begin, false);
		rank0_end = this._bv[depth].rank$IB(end, false);
		if (this._uint2bit$II(c, depth)) {
			rlt += rank0_end - rank0_begin;
			begin += (_seps$0 = this._seps)[depth] - rank0_begin;
			end += _seps$0[depth] - rank0_end;
		} else {
			begin = rank0_begin;
			end = rank0_end;
		}
		depth++;
	}
	return (rlt | 0);
};

/**
 * @return {!string}
 */
WaveletMatrix.prototype.dump$ = function () {
	/** @type {Array.<undefined|!string>} */
	var contents;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|!string>} */
	var range_contents;
	/** @type {!number} */
	var counter;
	/** @type {!string} */
	var key;
	contents = [ Binary$dump16bitNumber$I(this._bitsize), Binary$dump32bitNumber$N(this._size) ];
	for (i = 0; i < this._bitsize; i++) {
		contents.push(this._bv[i].dump$());
	}
	for (i = 0; i < this._bitsize; i++) {
		contents.push(Binary$dump32bitNumber$N(this._seps[i]));
	}
	range_contents = [  ];
	counter = 0;
	for (key in this._range) {
		range_contents.push(Binary$dump32bitNumber$N(key | 0));
		range_contents.push(Binary$dump32bitNumber$N(this._range[key]));
		counter++;
	}
	contents.push(Binary$dump32bitNumber$N(counter));
	return contents.join('') + range_contents.join('');
};

/**
 * @param {CompressionReport} report
 * @return {!string}
 */
WaveletMatrix.prototype.dump$LCompressionReport$ = function (report) {
	/** @type {Array.<undefined|!string>} */
	var contents;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|!string>} */
	var range_contents;
	/** @type {!number} */
	var counter;
	/** @type {!string} */
	var key;
	contents = [ Binary$dump16bitNumber$I(this._bitsize), Binary$dump32bitNumber$N(this._size) ];
	CompressionReport$add$LCompressionReport$II(report, 3, 3);
	for (i = 0; i < this._bitsize; i++) {
		contents.push(this._bv[i].dump$LCompressionReport$(report));
	}
	for (i = 0; i < this._bitsize; i++) {
		contents.push(Binary$dump32bitNumber$N(this._seps[i]));
		CompressionReport$add$LCompressionReport$II(report, 2, 2);
	}
	range_contents = [  ];
	counter = 0;
	for (key in this._range) {
		range_contents.push(Binary$dump32bitNumber$N(key | 0));
		range_contents.push(Binary$dump32bitNumber$N(this._range[key]));
		CompressionReport$add$LCompressionReport$II(report, 4, 4);
		counter++;
	}
	CompressionReport$add$LCompressionReport$II(report, 2, 2);
	contents.push(Binary$dump32bitNumber$N(counter));
	return contents.join('') + range_contents.join('');
};

/**
 * @param {!string} data
 * @return {!number}
 */
WaveletMatrix.prototype.load$S = function (data) {
	return this.load$SI(data, 0);
};

/**
 * @param {!string} data
 * @param {!number} offset
 * @return {!number}
 */
WaveletMatrix.prototype.load$SI = function (data, offset) {
	/** @type {!number} */
	var i;
	/** @type {BitVector} */
	var bit_vector;
	/** @type {!number} */
	var range_size;
	/** @type {!number} */
	var value;
	/** @type {!number} */
	var offset$0;
	/** @type {!number} */
	var result$0;
	/** @type {!number} */
	var result$1;
	/** @type {!number} */
	var result$2;
	this._bv.length = 0;
	this._seps.length = 0;
	this._size = 0;
	offset$0 = offset++;
	this._bitsize = (data.charCodeAt(offset$0) | 0);
	result$0 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	this._size = (result$0 | 0);
	offset += 2;
	for (i = 0; i < this._bitsize; i++) {
		bit_vector = new BitVector$();
		offset = bit_vector.load$SI(data, offset);
		this._bv.push(bit_vector);
	}
	for (i = 0; i < this._bitsize; (i++, offset += 2)) {
		this._seps.push(Binary$load32bitNumber$SI(data, offset));
	}
	result$1 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
	range_size = result$1;
	offset += 2;
	for (i = 0; i < range_size; (i++, offset += 4)) {
		result$2 = data.charCodeAt(offset) * 65536 + data.charCodeAt(offset + 1);
		value = Binary$load32bitNumber$SI(data, offset + 2);
		this._range[result$2 + ""] = (value | 0);
	}
	return offset;
};

/**
 * @param {Object.<string, undefined|!number>} input
 * @return {Object.<string, undefined|!number>}
 */
WaveletMatrix._shallow_copy$HI = function (input) {
	/** @type {Object.<string, undefined|!number>} */
	var result;
	/** @type {!string} */
	var key;
	result = ({  });
	for (key in input) {
		result[key] = input[key];
	}
	return result;
};

var WaveletMatrix$_shallow_copy$HI = WaveletMatrix._shallow_copy$HI;

/**
 * @param {!number} c
 * @param {!number} i
 * @return {!boolean}
 */
WaveletMatrix.prototype._uint2bit$II = function (c, i) {
	return (c >>> this._bitsize - 1 - i & 0x1) === 0x1;
};

/**
 * class BurrowsWheelerTransform extends Object
 * @constructor
 */
function BurrowsWheelerTransform() {
}

/**
 * @constructor
 */
function BurrowsWheelerTransform$() {
	this._str = "";
	this._size = 0;
	this._head = 0;
	this._suffixarray = [  ];
};

BurrowsWheelerTransform$.prototype = new BurrowsWheelerTransform;

/**
 * @param {BurrowsWheelerTransform} $this
 * @return {!number}
 */
BurrowsWheelerTransform.size$LBurrowsWheelerTransform$ = function ($this) {
	return $this._size;
};

var BurrowsWheelerTransform$size$LBurrowsWheelerTransform$ = BurrowsWheelerTransform.size$LBurrowsWheelerTransform$;

/**
 * @param {BurrowsWheelerTransform} $this
 * @return {!number}
 */
BurrowsWheelerTransform.head$LBurrowsWheelerTransform$ = function ($this) {
	return $this._head;
};

var BurrowsWheelerTransform$head$LBurrowsWheelerTransform$ = BurrowsWheelerTransform.head$LBurrowsWheelerTransform$;

/**
 * @param {BurrowsWheelerTransform} $this
 */
BurrowsWheelerTransform.clear$LBurrowsWheelerTransform$ = function ($this) {
	$this._str = "";
	$this._size = 0;
	$this._head = 0;
	$this._suffixarray.length = 0;
};

var BurrowsWheelerTransform$clear$LBurrowsWheelerTransform$ = BurrowsWheelerTransform.clear$LBurrowsWheelerTransform$;

/**
 * @param {BurrowsWheelerTransform} $this
 * @param {!string} str
 */
BurrowsWheelerTransform.build$LBurrowsWheelerTransform$S = function ($this, str) {
	/** @type {!string} */
	var _str$0;
	/** @type {Array.<undefined|!number>} */
	var _suffixarray$0;
	_str$0 = $this._str = str;
	$this._size = _str$0.length;
	_suffixarray$0 = $this._suffixarray = SAIS$make$S(str);
	$this._head = (_suffixarray$0.indexOf(0) | 0);
};

var BurrowsWheelerTransform$build$LBurrowsWheelerTransform$S = BurrowsWheelerTransform.build$LBurrowsWheelerTransform$S;

/**
 * @param {BurrowsWheelerTransform} $this
 * @param {!number} i
 * @return {!string}
 */
BurrowsWheelerTransform.get$LBurrowsWheelerTransform$I = function ($this, i) {
	/** @type {!number} */
	var size;
	/** @type {!number} */
	var index;
	size = $this._size;
	if (i >= size) {
		throw new Error("BurrowsWheelerTransform.get() : range error");
	}
	index = ($this._suffixarray[i] + size - 1) % size;
	return $this._str.charAt(index);
};

var BurrowsWheelerTransform$get$LBurrowsWheelerTransform$I = BurrowsWheelerTransform.get$LBurrowsWheelerTransform$I;

/**
 * @param {BurrowsWheelerTransform} $this
 * @return {!string}
 */
BurrowsWheelerTransform.get$LBurrowsWheelerTransform$ = function ($this) {
	/** @type {Array.<undefined|!string>} */
	var str;
	/** @type {!number} */
	var size;
	/** @type {!number} */
	var i;
	str = [  ];
	size = $this._size;
	for (i = 0; i < size; i++) {
		str.push(BurrowsWheelerTransform$get$LBurrowsWheelerTransform$I($this, i));
	}
	return str.join("");
};

var BurrowsWheelerTransform$get$LBurrowsWheelerTransform$ = BurrowsWheelerTransform.get$LBurrowsWheelerTransform$;

/**
 * @param {BurrowsWheelerTransform} $this
 * @param {!string} replace
 * @return {!string}
 */
BurrowsWheelerTransform.get$LBurrowsWheelerTransform$S = function ($this, replace) {
	/** @type {!string} */
	var result;
	result = BurrowsWheelerTransform$get$LBurrowsWheelerTransform$($this);
	return result.replace(BurrowsWheelerTransform.END_MARKER, replace);
};

var BurrowsWheelerTransform$get$LBurrowsWheelerTransform$S = BurrowsWheelerTransform.get$LBurrowsWheelerTransform$S;

/**
 * class OArray extends Object
 * @constructor
 */
function OArray() {
}

/**
 * @constructor
 * @param {Array.<undefined|!number>} array
 */
function OArray$AI(array) {
	this.array = array;
	this.offset = 0;
};

OArray$AI.prototype = new OArray;

/**
 * @constructor
 * @param {Array.<undefined|!number>} array
 * @param {!number} offset
 */
function OArray$AII(array, offset) {
	this.array = array;
	this.offset = offset;
};

OArray$AII.prototype = new OArray;

/**
 * @param {OArray} $this
 * @param {!number} index
 * @return {!number}
 */
OArray.get$LOArray$I = function ($this, index) {
	return $this.array[index + $this.offset];
};

var OArray$get$LOArray$I = OArray.get$LOArray$I;

/**
 * @param {OArray} $this
 * @param {!number} index
 * @param {!number} value
 */
OArray.set$LOArray$II = function ($this, index, value) {
	$this.array[index + $this.offset] = value;
};

var OArray$set$LOArray$II = OArray.set$LOArray$II;

/**
 * @param {OArray} $this
 * @param {!number} index
 * @return {!boolean}
 */
OArray.isS$LOArray$I = function ($this, index) {
	/** @type {Array.<undefined|!number>} */
	var array$0;
	/** @type {!number} */
	var offset$0;
	return (array$0 = $this.array)[index + (offset$0 = $this.offset)] < array$0[index + offset$0 + 1];
};

var OArray$isS$LOArray$I = OArray.isS$LOArray$I;

/**
 * @param {OArray} $this
 * @param {!number} index1
 * @param {!number} index2
 * @return {!boolean}
 */
OArray.compare$LOArray$II = function ($this, index1, index2) {
	/** @type {Array.<undefined|!number>} */
	var array$0;
	/** @type {!number} */
	var offset$0;
	return (array$0 = $this.array)[index1 + (offset$0 = $this.offset)] == array$0[index2 + offset$0];
};

var OArray$compare$LOArray$II = OArray.compare$LOArray$II;

/**
 * class SAIS extends Object
 * @constructor
 */
function SAIS() {
}

/**
 * @constructor
 */
function SAIS$() {
};

SAIS$.prototype = new SAIS;

/**
 * @param {BitVector} t
 * @param {!number} i
 * @return {!boolean}
 */
SAIS._isLMS$LBitVector$I = function (t, i) {
	return i > 0 && t.get$I(i) && ! t.get$I(i - 1);
};

var SAIS$_isLMS$LBitVector$I = SAIS._isLMS$LBitVector$I;

/**
 * @param {OArray} s
 * @param {Array.<undefined|!number>} bkt
 * @param {!number} n
 * @param {!number} K
 * @param {!boolean} end
 */
SAIS._getBuckets$LOArray$AIIIB = function (s, bkt, n, K, end) {
	/** @type {!number} */
	var sum;
	/** @type {!number} */
	var i;
	sum = 0;
	for (i = 0; i <= K; i++) {
		bkt[i] = 0;
	}
	for (i = 0; i < n; i++) {
		bkt[OArray$get$LOArray$I(s, i)]++;
	}
	for (i = 0; i <= K; i++) {
		sum += bkt[i];
		bkt[i] = ((end ? sum : sum - bkt[i]) | 0);
	}
};

var SAIS$_getBuckets$LOArray$AIIIB = SAIS._getBuckets$LOArray$AIIIB;

/**
 * @param {BitVector} t
 * @param {Array.<undefined|!number>} SA
 * @param {OArray} s
 * @param {Array.<undefined|!number>} bkt
 * @param {!number} n
 * @param {!number} K
 * @param {!boolean} end
 */
SAIS._induceSAl$LBitVector$AILOArray$AIIIB = function (t, SA, s, bkt, n, K, end) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	SAIS$_getBuckets$LOArray$AIIIB(s, bkt, n, K, end);
	for (i = 0; i < n; i++) {
		j = SA[i] - 1;
		if (j >= 0 && ! t.get$I(j)) {
			SA[bkt[OArray$get$LOArray$I(s, j)]++] = (j | 0);
		}
	}
};

var SAIS$_induceSAl$LBitVector$AILOArray$AIIIB = SAIS._induceSAl$LBitVector$AILOArray$AIIIB;

/**
 * @param {BitVector} t
 * @param {Array.<undefined|!number>} SA
 * @param {OArray} s
 * @param {Array.<undefined|!number>} bkt
 * @param {!number} n
 * @param {!number} K
 * @param {!boolean} end
 */
SAIS._induceSAs$LBitVector$AILOArray$AIIIB = function (t, SA, s, bkt, n, K, end) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	SAIS$_getBuckets$LOArray$AIIIB(s, bkt, n, K, end);
	for (i = n - 1; i >= 0; i--) {
		j = SA[i] - 1;
		if (j >= 0 && t.get$I(j)) {
			SA[-- bkt[OArray$get$LOArray$I(s, j)]] = (j | 0);
		}
	}
};

var SAIS$_induceSAs$LBitVector$AILOArray$AIIIB = SAIS._induceSAs$LBitVector$AILOArray$AIIIB;

/**
 * @param {!string} source
 * @return {Array.<undefined|!number>}
 */
SAIS.make$S = function (source) {
	/** @type {Array.<undefined|!number>} */
	var charCodes;
	/** @type {!number} */
	var maxCode;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var code;
	/** @type {Array.<undefined|!number>} */
	var SA;
	/** @type {OArray} */
	var s;
	charCodes = [  ];
	charCodes.length = source.length;
	maxCode = 0;
	for (i = 0; i < source.length; i++) {
		code = source.charCodeAt(i);
		charCodes[i] = (code | 0);
		maxCode = (code > maxCode ? code : maxCode);
	}
	SA = [  ];
	SA.length = source.length;
	s = ({offset: 0, array: charCodes});
	SAIS$_make$LOArray$AIII(s, SA, source.length, maxCode);
	return SA;
};

var SAIS$make$S = SAIS.make$S;

/**
 * @param {OArray} s
 * @param {Array.<undefined|!number>} SA
 * @param {!number} n
 * @param {!number} K
 */
SAIS._make$LOArray$AIII = function (s, SA, n, K) {
	/** @type {BitVector} */
	var t;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|!number>} */
	var bkt;
	/** @type {!number} */
	var n1;
	/** @type {!number} */
	var name;
	/** @type {!number} */
	var prev;
	/** @type {undefined|!number} */
	var pos;
	/** @type {!boolean} */
	var diff;
	/** @type {!number} */
	var d;
	/** @type {!number} */
	var j;
	/** @type {Array.<undefined|!number>} */
	var SA1;
	/** @type {OArray} */
	var s1;
	/** @type {!number} */
	var i$0;
	/** @type {!number} */
	var index$0;
	t = new BitVector$();
	t.set$IB(n - 2, false);
	t.set$IB(n - 1, true);
	for (i = n - 3; i >= 0; i--) {
		t.set$IB(i, OArray$isS$LOArray$I(s, i) || OArray$compare$LOArray$II(s, i, i + 1) && t.get$I(i + 1));
	}
	bkt = [  ];
	bkt.length = K + 1;
	SAIS$_getBuckets$LOArray$AIIIB(s, bkt, n, K, true);
	for (i = 0; i < n; i++) {
		SA[i] = -1;
	}
	for (i = 1; i < n; i++) {
		if (SAIS$_isLMS$LBitVector$I(t, i)) {
			SA[-- bkt[OArray$get$LOArray$I(s, i)]] = (i | 0);
		}
	}
	SAIS$_induceSAl$LBitVector$AILOArray$AIIIB(t, SA, s, bkt, n, K, false);
	SAIS$_induceSAs$LBitVector$AILOArray$AIIIB(t, SA, s, bkt, n, K, true);
	n1 = 0;
	for (i = 0; i < n; i++) {
		i$0 = SA[i];
		if (i$0 > 0 && t.get$I(i$0) && ! t.get$I(i$0 - 1)) {
			SA[n1++] = SA[i];
		}
	}
	for (i = n1; i < n; i++) {
		SA[i] = -1;
	}
	name = 0;
	prev = -1;
	for (i = 0; i < n1; i++) {
		pos = SA[i];
		diff = false;
		for (d = 0; d < n; d++) {
			if (prev === -1 || ! OArray$compare$LOArray$II(s, pos + d, prev + d) || t.get$I(pos + d) !== t.get$I(prev + d)) {
				diff = true;
				break;
			} else {
				if (d > 0 && (SAIS$_isLMS$LBitVector$I(t, pos + d) || SAIS$_isLMS$LBitVector$I(t, prev + d))) {
					break;
				}
			}
		}
		if (diff) {
			name++;
			prev = pos;
		}
		pos = ((pos % 2 === 0 ? pos / 2 : (pos - 1) / 2) | 0);
		SA[n1 + pos] = (name - 1 | 0);
	}
	for ((i = n - 1, j = n - 1); i >= n1; i--) {
		if (SA[i] >= 0) {
			SA[j--] = SA[i];
		}
	}
	SA1 = SA;
	s1 = ({offset: n - n1, array: SA});
	if (name < n1) {
		SAIS$_make$LOArray$AIII(s1, SA1, n1, name - 1);
	} else {
		for (i = 0; i < n1; i++) {
			SA1[OArray$get$LOArray$I(s1, i)] = (i | 0);
		}
	}
	bkt = [  ];
	bkt.length = K + 1;
	SAIS$_getBuckets$LOArray$AIIIB(s, bkt, n, K, true);
	for ((i = 1, j = 0); i < n; i++) {
		if (SAIS$_isLMS$LBitVector$I(t, i)) {
			OArray$set$LOArray$II(s1, j++, i);
		}
	}
	for (i = 0; i < n1; i++) {
		index$0 = SA1[i];
		SA1[i] = s1.array[index$0 + s1.offset];
	}
	for (i = n1; i < n; i++) {
		SA[i] = -1;
	}
	for (i = n1 - 1; i >= 0; i--) {
		j = SA[i];
		SA[i] = -1;
		SA[-- bkt[OArray$get$LOArray$I(s, j)]] = (j | 0);
	}
	SAIS$_induceSAl$LBitVector$AILOArray$AIIIB(t, SA, s, bkt, n, K, false);
	SAIS$_induceSAs$LBitVector$AILOArray$AIIIB(t, SA, s, bkt, n, K, true);
};

var SAIS$_make$LOArray$AIII = SAIS._make$LOArray$AIII;

OktaviaSearch._stemmer = null;
OktaviaSearch._instance = null;
$__jsx_lazy_init(Oktavia, "eof", function () {
	return String.fromCharCode(0);
});
$__jsx_lazy_init(Oktavia, "eob", function () {
	return String.fromCharCode(1);
});
$__jsx_lazy_init(Oktavia, "unknown", function () {
	return String.fromCharCode(3);
});
Binary._base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
$__jsx_lazy_init(Binary, "_base64DecodeChars", function () {
	return [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ];
});
$__jsx_lazy_init(Style, "console", function () {
	return ({ 'title': [ '\x1B[32m\x1b[4m', '\x1B[39m\x1b[0m' ], 'url': [ '\x1B[34m', '\x1B[39m' ], 'hit': [ '\x1B[4m', '\x1B[0m' ], 'del': [ '\x1B[9m', '\x1B[0m' ], 'summary': [ '\x1B[90m', '\x1B[39m' ] });
});
$__jsx_lazy_init(Style, "html", function () {
	return ({ 'title': [ '<span class="title">', '</span>' ], 'url': [ '<span class="url">', '</span>' ], 'hit': [ '<span class="hit">', '</span>' ], 'del': [ '<del>', '</del>' ], 'summary': [ '<span class="reuslt">', '</span>' ] });
});
$__jsx_lazy_init(Style, "ignore", function () {
	return ({ 'tilte': [ '', '' ], 'url': [ '', '' ], 'hit': [ '', '' ], 'del': [ '', '' ], 'summary': [ '', '' ] });
});
PortugueseStemmer.serialVersionUID = 1;
$__jsx_lazy_init(PortugueseStemmer, "methodObject", function () {
	return new PortugueseStemmer$();
});
$__jsx_lazy_init(PortugueseStemmer, "a_0", function () {
	return [ new Among$SII("", -1, 3), new Among$SII("\u00E3", 0, 1), new Among$SII("\u00F5", 0, 2) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_1", function () {
	return [ new Among$SII("", -1, 3), new Among$SII("a~", 0, 1), new Among$SII("o~", 0, 2) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_2", function () {
	return [ new Among$SII("ic", -1, -1), new Among$SII("ad", -1, -1), new Among$SII("os", -1, -1), new Among$SII("iv", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_3", function () {
	return [ new Among$SII("ante", -1, 1), new Among$SII("avel", -1, 1), new Among$SII("\u00EDvel", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_4", function () {
	return [ new Among$SII("ic", -1, 1), new Among$SII("abil", -1, 1), new Among$SII("iv", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_5", function () {
	return [ new Among$SII("ica", -1, 1), new Among$SII("\u00E2ncia", -1, 1), new Among$SII("\u00EAncia", -1, 4), new Among$SII("ira", -1, 9), new Among$SII("adora", -1, 1), new Among$SII("osa", -1, 1), new Among$SII("ista", -1, 1), new Among$SII("iva", -1, 8), new Among$SII("eza", -1, 1), new Among$SII("log\u00EDa", -1, 2), new Among$SII("idade", -1, 7), new Among$SII("ante", -1, 1), new Among$SII("mente", -1, 6), new Among$SII("amente", 12, 5), new Among$SII("\u00E1vel", -1, 1), new Among$SII("\u00EDvel", -1, 1), new Among$SII("uci\u00F3n", -1, 3), new Among$SII("ico", -1, 1), new Among$SII("ismo", -1, 1), new Among$SII("oso", -1, 1), new Among$SII("amento", -1, 1), new Among$SII("imento", -1, 1), new Among$SII("ivo", -1, 8), new Among$SII("a\u00E7a~o", -1, 1), new Among$SII("ador", -1, 1), new Among$SII("icas", -1, 1), new Among$SII("\u00EAncias", -1, 4), new Among$SII("iras", -1, 9), new Among$SII("adoras", -1, 1), new Among$SII("osas", -1, 1), new Among$SII("istas", -1, 1), new Among$SII("ivas", -1, 8), new Among$SII("ezas", -1, 1), new Among$SII("log\u00EDas", -1, 2), new Among$SII("idades", -1, 7), new Among$SII("uciones", -1, 3), new Among$SII("adores", -1, 1), new Among$SII("antes", -1, 1), new Among$SII("a\u00E7o~es", -1, 1), new Among$SII("icos", -1, 1), new Among$SII("ismos", -1, 1), new Among$SII("osos", -1, 1), new Among$SII("amentos", -1, 1), new Among$SII("imentos", -1, 1), new Among$SII("ivos", -1, 8) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_6", function () {
	return [ new Among$SII("ada", -1, 1), new Among$SII("ida", -1, 1), new Among$SII("ia", -1, 1), new Among$SII("aria", 2, 1), new Among$SII("eria", 2, 1), new Among$SII("iria", 2, 1), new Among$SII("ara", -1, 1), new Among$SII("era", -1, 1), new Among$SII("ira", -1, 1), new Among$SII("ava", -1, 1), new Among$SII("asse", -1, 1), new Among$SII("esse", -1, 1), new Among$SII("isse", -1, 1), new Among$SII("aste", -1, 1), new Among$SII("este", -1, 1), new Among$SII("iste", -1, 1), new Among$SII("ei", -1, 1), new Among$SII("arei", 16, 1), new Among$SII("erei", 16, 1), new Among$SII("irei", 16, 1), new Among$SII("am", -1, 1), new Among$SII("iam", 20, 1), new Among$SII("ariam", 21, 1), new Among$SII("eriam", 21, 1), new Among$SII("iriam", 21, 1), new Among$SII("aram", 20, 1), new Among$SII("eram", 20, 1), new Among$SII("iram", 20, 1), new Among$SII("avam", 20, 1), new Among$SII("em", -1, 1), new Among$SII("arem", 29, 1), new Among$SII("erem", 29, 1), new Among$SII("irem", 29, 1), new Among$SII("assem", 29, 1), new Among$SII("essem", 29, 1), new Among$SII("issem", 29, 1), new Among$SII("ado", -1, 1), new Among$SII("ido", -1, 1), new Among$SII("ando", -1, 1), new Among$SII("endo", -1, 1), new Among$SII("indo", -1, 1), new Among$SII("ara~o", -1, 1), new Among$SII("era~o", -1, 1), new Among$SII("ira~o", -1, 1), new Among$SII("ar", -1, 1), new Among$SII("er", -1, 1), new Among$SII("ir", -1, 1), new Among$SII("as", -1, 1), new Among$SII("adas", 47, 1), new Among$SII("idas", 47, 1), new Among$SII("ias", 47, 1), new Among$SII("arias", 50, 1), new Among$SII("erias", 50, 1), new Among$SII("irias", 50, 1), new Among$SII("aras", 47, 1), new Among$SII("eras", 47, 1), new Among$SII("iras", 47, 1), new Among$SII("avas", 47, 1), new Among$SII("es", -1, 1), new Among$SII("ardes", 58, 1), new Among$SII("erdes", 58, 1), new Among$SII("irdes", 58, 1), new Among$SII("ares", 58, 1), new Among$SII("eres", 58, 1), new Among$SII("ires", 58, 1), new Among$SII("asses", 58, 1), new Among$SII("esses", 58, 1), new Among$SII("isses", 58, 1), new Among$SII("astes", 58, 1), new Among$SII("estes", 58, 1), new Among$SII("istes", 58, 1), new Among$SII("is", -1, 1), new Among$SII("ais", 71, 1), new Among$SII("eis", 71, 1), new Among$SII("areis", 73, 1), new Among$SII("ereis", 73, 1), new Among$SII("ireis", 73, 1), new Among$SII("\u00E1reis", 73, 1), new Among$SII("\u00E9reis", 73, 1), new Among$SII("\u00EDreis", 73, 1), new Among$SII("\u00E1sseis", 73, 1), new Among$SII("\u00E9sseis", 73, 1), new Among$SII("\u00EDsseis", 73, 1), new Among$SII("\u00E1veis", 73, 1), new Among$SII("\u00EDeis", 73, 1), new Among$SII("ar\u00EDeis", 84, 1), new Among$SII("er\u00EDeis", 84, 1), new Among$SII("ir\u00EDeis", 84, 1), new Among$SII("ados", -1, 1), new Among$SII("idos", -1, 1), new Among$SII("amos", -1, 1), new Among$SII("\u00E1ramos", 90, 1), new Among$SII("\u00E9ramos", 90, 1), new Among$SII("\u00EDramos", 90, 1), new Among$SII("\u00E1vamos", 90, 1), new Among$SII("\u00EDamos", 90, 1), new Among$SII("ar\u00EDamos", 95, 1), new Among$SII("er\u00EDamos", 95, 1), new Among$SII("ir\u00EDamos", 95, 1), new Among$SII("emos", -1, 1), new Among$SII("aremos", 99, 1), new Among$SII("eremos", 99, 1), new Among$SII("iremos", 99, 1), new Among$SII("\u00E1ssemos", 99, 1), new Among$SII("\u00EAssemos", 99, 1), new Among$SII("\u00EDssemos", 99, 1), new Among$SII("imos", -1, 1), new Among$SII("armos", -1, 1), new Among$SII("ermos", -1, 1), new Among$SII("irmos", -1, 1), new Among$SII("\u00E1mos", -1, 1), new Among$SII("ar\u00E1s", -1, 1), new Among$SII("er\u00E1s", -1, 1), new Among$SII("ir\u00E1s", -1, 1), new Among$SII("eu", -1, 1), new Among$SII("iu", -1, 1), new Among$SII("ou", -1, 1), new Among$SII("ar\u00E1", -1, 1), new Among$SII("er\u00E1", -1, 1), new Among$SII("ir\u00E1", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_7", function () {
	return [ new Among$SII("a", -1, 1), new Among$SII("i", -1, 1), new Among$SII("o", -1, 1), new Among$SII("os", -1, 1), new Among$SII("\u00E1", -1, 1), new Among$SII("\u00ED", -1, 1), new Among$SII("\u00F3", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "a_8", function () {
	return [ new Among$SII("e", -1, 1), new Among$SII("\u00E7", -1, 2), new Among$SII("\u00E9", -1, 1), new Among$SII("\u00EA", -1, 1) ];
});
$__jsx_lazy_init(PortugueseStemmer, "g_v", function () {
	return [ 17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 19, 12, 2 ];
});
$__jsx_lazy_init(_Common, "buffers", function () {
	return [ "comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script" ];
});
$__jsx_lazy_init(_Common, "EVENTS", function () {
	return [ "text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "attribute", "opentag", "closetag", "opencdata", "cdata", "clo_State.CDATA", "error", "end", "ready", "script", "opennamespace", "closenamespace" ];
});
_Common.MAX_BUFFER_LENGTH = 65536;
_State.BEGIN = 1;
_State.TEXT = 2;
_State.TEXT_ENTITY = 3;
_State.OPEN_WAKA = 4;
_State.SGML_DECL = 5;
_State.SGML_DECL_QUOTED = 6;
_State.DOCTYPE = 7;
_State.DOCTYPE_QUOTED = 8;
_State.DOCTYPE_DTD = 9;
_State.DOCTYPE_DTD_QUOTED = 10;
_State.COMMENT_STARTING = 11;
_State.COMMENT = 12;
_State.COMMENT_ENDING = 13;
_State.COMMENT_ENDED = 14;
_State.CDATA = 15;
_State.CDATA_ENDING = 16;
_State.CDATA_ENDING_2 = 17;
_State.PROC_INST = 18;
_State.PROC_INST_BODY = 19;
_State.PROC_INST_ENDING = 20;
_State.OPEN_TAG = 21;
_State.OPEN_TAG_SLASH = 22;
_State.ATTRIB = 23;
_State.ATTRIB_NAME = 24;
_State.ATTRIB_NAME_SAW_WHITE = 25;
_State.ATTRIB_VALUE = 26;
_State.ATTRIB_VALUE_QUOTED = 27;
_State.ATTRIB_VALUE_UNQUOTED = 28;
_State.ATTRIB_VALUE_ENTITY_Q = 29;
_State.ATTRIB_VALUE_ENTITY_U = 30;
_State.CLOSE_TAG = 31;
_State.CLOSE_TAG_SAW_WHITE = 32;
_State.SCRIPT = 33;
_State.SCRIPT_ENDING = 34;
$__jsx_lazy_init(_Entities, "_entities", function () {
	return ({ "amp": "&", "gt": ">", "lt": "<", "quot": "\"", "apos": "'", "AElig": 198, "Aacute": 193, "Acirc": 194, "Agrave": 192, "Aring": 197, "Atilde": 195, "Auml": 196, "Ccedil": 199, "ETH": 208, "Eacute": 201, "Ecirc": 202, "Egrave": 200, "Euml": 203, "Iacute": 205, "Icirc": 206, "Igrave": 204, "Iuml": 207, "Ntilde": 209, "Oacute": 211, "Ocirc": 212, "Ograve": 210, "Oslash": 216, "Otilde": 213, "Ouml": 214, "THORN": 222, "Uacute": 218, "Ucirc": 219, "Ugrave": 217, "Uuml": 220, "Yacute": 221, "aacute": 225, "acirc": 226, "aelig": 230, "agrave": 224, "aring": 229, "atilde": 227, "auml": 228, "ccedil": 231, "eacute": 233, "ecirc": 234, "egrave": 232, "eth": 240, "euml": 235, "iacute": 237, "icirc": 238, "igrave": 236, "iuml": 239, "ntilde": 241, "oacute": 243, "ocirc": 244, "ograve": 242, "oslash": 248, "otilde": 245, "ouml": 246, "szlig": 223, "thorn": 254, "uacute": 250, "ucirc": 251, "ugrave": 249, "uuml": 252, "yacute": 253, "yuml": 255, "copy": 169, "reg": 174, "nbsp": 160, "iexcl": 161, "cent": 162, "pound": 163, "curren": 164, "yen": 165, "brvbar": 166, "sect": 167, "uml": 168, "ordf": 170, "laquo": 171, "not": 172, "shy": 173, "macr": 175, "deg": 176, "plusmn": 177, "sup1": 185, "sup2": 178, "sup3": 179, "acute": 180, "micro": 181, "para": 182, "middot": 183, "cedil": 184, "ordm": 186, "raquo": 187, "frac14": 188, "frac12": 189, "frac34": 190, "iquest": 191, "times": 215, "divide": 247, "OElig": 338, "oelig": 339, "Scaron": 352, "scaron": 353, "Yuml": 376, "fnof": 402, "circ": 710, "tilde": 732, "Alpha": 913, "Beta": 914, "Gamma": 915, "Delta": 916, "Epsilon": 917, "Zeta": 918, "Eta": 919, "Theta": 920, "Iota": 921, "Kappa": 922, "Lambda": 923, "Mu": 924, "Nu": 925, "Xi": 926, "Omicron": 927, "Pi": 928, "Rho": 929, "Sigma": 931, "Tau": 932, "Upsilon": 933, "Phi": 934, "Chi": 935, "Psi": 936, "Omega": 937, "alpha": 945, "beta": 946, "gamma": 947, "delta": 948, "epsilon": 949, "zeta": 950, "eta": 951, "theta": 952, "iota": 953, "kappa": 954, "lambda": 955, "mu": 956, "nu": 957, "xi": 958, "omicron": 959, "pi": 960, "rho": 961, "sigmaf": 962, "sigma": 963, "tau": 964, "upsilon": 965, "phi": 966, "chi": 967, "psi": 968, "omega": 969, "thetasym": 977, "upsih": 978, "piv": 982, "ensp": 8194, "emsp": 8195, "thinsp": 8201, "zwnj": 8204, "zwj": 8205, "lrm": 8206, "rlm": 8207, "ndash": 8211, "mdash": 8212, "lsquo": 8216, "rsquo": 8217, "sbquo": 8218, "ldquo": 8220, "rdquo": 8221, "bdquo": 8222, "dagger": 8224, "Dagger": 8225, "bull": 8226, "hellip": 8230, "permil": 8240, "prime": 8242, "Prime": 8243, "lsaquo": 8249, "rsaquo": 8250, "oline": 8254, "frasl": 8260, "euro": 8364, "image": 8465, "weierp": 8472, "real": 8476, "trade": 8482, "alefsym": 8501, "larr": 8592, "uarr": 8593, "rarr": 8594, "darr": 8595, "harr": 8596, "crarr": 8629, "lArr": 8656, "uArr": 8657, "rArr": 8658, "dArr": 8659, "hArr": 8660, "forall": 8704, "part": 8706, "exist": 8707, "empty": 8709, "nabla": 8711, "isin": 8712, "notin": 8713, "ni": 8715, "prod": 8719, "sum": 8721, "minus": 8722, "lowast": 8727, "radic": 8730, "prop": 8733, "infin": 8734, "ang": 8736, "and": 8743, "or": 8744, "cap": 8745, "cup": 8746, "int": 8747, "there4": 8756, "sim": 8764, "cong": 8773, "asymp": 8776, "ne": 8800, "equiv": 8801, "le": 8804, "ge": 8805, "sub": 8834, "sup": 8835, "nsub": 8836, "sube": 8838, "supe": 8839, "oplus": 8853, "otimes": 8855, "perp": 8869, "sdot": 8901, "lceil": 8968, "rceil": 8969, "lfloor": 8970, "rfloor": 8971, "lang": 9001, "rang": 9002, "loz": 9674, "spades": 9824, "clubs": 9827, "hearts": 9829, "diams": 9830 });
});
BitVector.SMALL_BLOCK_SIZE = 32;
BitVector.LARGE_BLOCK_SIZE = 256;
BitVector.BLOCK_RATE = 8;
$__jsx_lazy_init(BurrowsWheelerTransform, "END_MARKER", function () {
	return String.fromCharCode(0);
});
var $__jsx_classMap = {
	"tool/web/oktavia-portuguese-search.jsx": {
		_Main: _Main,
		_Main$: _Main$
	},
	"tool/web/oktavia-search.jsx": {
		_Result: _Result,
		_Result$SSSI: _Result$SSSI,
		_Proposal: _Proposal,
		_Proposal$SSI: _Proposal$SSI,
		OktaviaSearch: OktaviaSearch,
		OktaviaSearch$I: OktaviaSearch$I,
		_Main: _Main$0,
		_Main$: _Main$0$
	},
	"src/oktavia.jsx": {
		Oktavia: Oktavia,
		Oktavia$: Oktavia$
	},
	"src/binary-util.jsx": {
		Binary: Binary,
		Binary$: Binary$,
		LoadedStringResult: LoadedStringResult,
		LoadedStringResult$SI: LoadedStringResult$SI,
		LoadedStringListResult: LoadedStringListResult,
		LoadedStringListResult$SI: LoadedStringListResult$SI,
		LoadedStringListMapResult: LoadedStringListMapResult,
		LoadedStringListMapResult$SI: LoadedStringListMapResult$SI,
		LoadedNumberListResult: LoadedNumberListResult,
		LoadedNumberListResult$SI: LoadedNumberListResult$SI,
		CompressionReport: CompressionReport,
		CompressionReport$: CompressionReport$
	},
	"src/query.jsx": {
		Query: Query,
		Query$: Query$
	},
	"src/query-string-parser.jsx": {
		QueryStringParser: QueryStringParser,
		QueryStringParser$: QueryStringParser$
	},
	"src/search-result.jsx": {
		Proposal: Proposal,
		Proposal$II: Proposal$II,
		Position: Position,
		Position$SIB: Position$SIB,
		SearchUnit: SearchUnit,
		SearchUnit$I: SearchUnit$I,
		SingleResult: SingleResult,
		SingleResult$: SingleResult$,
		SingleResult$SBB: SingleResult$SBB,
		SearchSummary: SearchSummary,
		SearchSummary$: SearchSummary$,
		SearchSummary$LOktavia$: SearchSummary$LOktavia$
	},
	"src/style.jsx": {
		Style: Style,
		Style$S: Style$S,
		_HTMLHandler: _HTMLHandler,
		_HTMLHandler$HASB: _HTMLHandler$HASB
	},
	"src/stemmer/stemmer.jsx": {
		Stemmer: Stemmer,
		Stemmer$: Stemmer$
	},
	"src/stemmer/base-stemmer.jsx": {
		BaseStemmer: BaseStemmer,
		BaseStemmer$: BaseStemmer$
	},
	"src/stemmer/portuguese-stemmer.jsx": {
		PortugueseStemmer: PortugueseStemmer,
		PortugueseStemmer$: PortugueseStemmer$
	},
	"src/stemmer/among.jsx": {
		Among: Among,
		Among$SII: Among$SII,
		Among$SIIF$LBaseStemmer$B$LBaseStemmer$: Among$SIIF$LBaseStemmer$B$LBaseStemmer$
	},
	"src/metadata.jsx": {
		Metadata: Metadata,
		Metadata$LOktavia$: Metadata$LOktavia$,
		Section: Section,
		Section$LOktavia$: Section$LOktavia$,
		Splitter: Splitter,
		Splitter$LOktavia$: Splitter$LOktavia$,
		Splitter$LOktavia$S: Splitter$LOktavia$S,
		Table: Table,
		Table$LOktavia$AS: Table$LOktavia$AS,
		Block: Block,
		Block$LOktavia$: Block$LOktavia$
	},
	"src/fm-index.jsx": {
		FMIndex: FMIndex,
		FMIndex$: FMIndex$
	},
	"src/sax.jsx": {
		Tag: Tag,
		Tag$S: Tag$S,
		_Common: _Common,
		_Common$: _Common$,
		_State: _State,
		_State$: _State$,
		SAXHandler: SAXHandler,
		SAXHandler$: SAXHandler$,
		SAXParser: SAXParser,
		SAXParser$LSAXHandler$: SAXParser$LSAXHandler$,
		SAXParser$LSAXHandler$B: SAXParser$LSAXHandler$B,
		Char: Char,
		Char$: Char$,
		_Entities: _Entities,
		_Entities$: _Entities$
	},
	"src/bit-vector.jsx": {
		BitVector: BitVector,
		BitVector$: BitVector$
	},
	"src/wavelet-matrix.jsx": {
		WaveletMatrix: WaveletMatrix,
		WaveletMatrix$: WaveletMatrix$
	},
	"src/burrows-wheeler-transform.jsx": {
		BurrowsWheelerTransform: BurrowsWheelerTransform,
		BurrowsWheelerTransform$: BurrowsWheelerTransform$
	},
	"src/sais.jsx": {
		OArray: OArray,
		OArray$AI: OArray$AI,
		OArray$AII: OArray$AII,
		SAIS: SAIS,
		SAIS$: SAIS$
	}
};


/**
 * launches _Main.main(:string[]):void invoked by jsx --run|--executable
 */
JSX.runMain = function (sourceFile, args) {
	var module = JSX.require(sourceFile);
	if (! module) {
		throw new ReferenceError("entry point module not found in " + sourceFile);
	}
	if (! module._Main) {
		throw new ReferenceError("entry point _Main not found in " + sourceFile);
	}
	if (! module._Main.main$AS) {
		throw new ReferenceError("entry point _Main.main(:string[]):void not found in " + sourceFile);
	}
	module._Main.main$AS(args);
};

/**
 * launches _Test#test*():void invoked by jsx --test
 */
JSX.runTests = function (sourceFile, tests) {
	var module = JSX.require(sourceFile);
	var testClass = module._Test$;

	if (!testClass) return; // skip if there's no test class

	if(tests.length === 0) {
		var p = testClass.prototype;
		for (var m in p) {
			if (p[m] instanceof Function
				&& /^test.*[$]$/.test(m)) {
				tests.push(m);
			}
		}
	}
	else { // set as process arguments
		tests = tests.map(function (name) {
			return name + "$"; // mangle for function test*():void
		});
	}

	var testCase = new testClass();

	if (testCase.beforeClass$AS != null)
		testCase.beforeClass$AS(tests);

	for (var i = 0; i < tests.length; ++i) {
		(function (method) {
			if (method in testCase) {
				testCase.run$SF$V$(method, function() { testCase[method](); });
			}
			else {
				throw new ReferenceError("No such test method: " + method);
			}
		}(tests[i]));
	}

	if (testCase.afterClass$ != null)
		testCase.afterClass$();
};
/**
 * call a function on load/DOMContentLoaded
 */
function $__jsx_onload (event) {
	window.removeEventListener("load", $__jsx_onload);
	document.removeEventListener("DOMContentLoaded", $__jsx_onload);
	JSX.runMain("tool/web/oktavia-portuguese-search.jsx", [])
}

window.addEventListener("load", $__jsx_onload);
document.addEventListener("DOMContentLoaded", $__jsx_onload);

})(JSX);
