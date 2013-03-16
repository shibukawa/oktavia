/**
 * @fileOverview
 * A UI script that creates search form, loads an index files and show search results.
 * It needs jQuery and <tt>oktavia-search.js</tt> or <tt>oktavia-*-search.js</tt>
 * (stemming library supported versions).
 * @author Yoshiki Shibukawa, yoshiki@shibu.jp
 */

(function ($)
{
    /**
     * @name SearchView
     * @class
     * Provides searching feature to your website.
     * @constructor
     * @param {jQeury} node Target node it has a search form and a search result window.
     * @param {string} documentRoot Document root folder like '.', '../', '/'
     * @param {string} index Index file path.
     */
    function SearchView(node, documentRoot, index)
    {
        var OktaviaSearch = JSX.require("tool/web/oktavia-search.jsx").OktaviaSearch$I;

        /**
         * Target node it contains a search form and a search result window.
         * @type jQuery
         */
        this.node = node;
        /**
         * Search engine core
         * @type OktaviaSearch
         */
        this.engine = new OktaviaSearch(5);
        if (documentRoot === '')
        {
            /**
             * Document root path
             * @type string[]
             */
            this.documentRoot = [];
        }
        else if (documentRoot.slice(-1) === '/')
        {
            this.documentRoot = documentRoot.slice(0, -1).split(/\//g);
        }
        else
        {
            this.documentRoot = documentRoot.split(/\//g);
        }

        /**
         * It is true if an index file is loaded.
         * @type boolean
         */
        this.initialized = false;
        /**
         * It is true if an user search before loading an index.
         * @type boolean
         */
        this.reserveSearch = false;

        var indexURL;
        switch (index.charAt(0))
        {
        case '.':
        case '/':
            indexURL = index;
            break;
        default:
            indexURL = this.getDocumentPath(index);
            break;
        }
        var self = this;
        this.loadJavaScript(indexURL, function ()
        {
            self.engine.loadIndex$S(window.searchIndex);
            self.initialized = true;
            window.searchIndex = null;
            if (self.reserveSearch)
            {
                self.search();
            }
            self.reserveSearch = false;
        });
    }

    /**
     * Changes result page.
     * @param {integer} page Page number
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.changePage = function (page)
    {
        this.engine.setCurrentPage$I(page);
        this.updateResult();
    };

    /**
     * Clears a search form and a reult window.
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.clearResult = function ()
    {
        $('.oktavia_search', this.node).val('');
        $('.oktavia_searchresult_box', this.node).hide();
    };

    /**
     * Loads an external JavaScript file.
     *
     * This code is based on: http://os0x.hatenablog.com/entry/20080827/1219815828
     * @param {string} src A JavaScript source file path
     * @param {function} callback It is called when the target JavaScript file is loaded
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.loadJavaScript = function (src, callback)
    {
        var sc = document.createElement('script');
        sc.type = 'text/javascript';
        if (window.ActiveXObject)
        {
            sc.onreadystatechange = function ()
            {
                if (sc.readyState === 'complete' || sc.readyState === 'loaded')
                {
                    callback(sc.readyState);
                }
            };
        }
        else
        {
            sc.onload = function ()
            {
                callback('onload');
            };
        }
        sc.src = src;
        document.body.appendChild(sc);
    };

    /**
     * Updates page navigation list.
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.updatePageList = function ()
    {
        var self = this;
        function createCallback(i)
        {
            return function () {
                self.changePage(i);
            };
        }

        var currentPage = String(this.engine.currentPage$());
        var nav = $('.oktavia_searchresult_nav', this.node);
        nav.empty();
        var pages = this.engine.pageIndexes$();
        for (var i = 0; i < pages.length; i++)
        {
            var pageItem = $('<span/>').text(pages[i]);
            if (pages[i] === '...')
            {
                pageItem.addClass('leader');
            }
            else
            {
                pageItem.addClass('page');
                if (pages[i] !== currentPage)
                {
                    pageItem.bind('click', createCallback(Number(pages[i])));
                }
                else
                {
                    pageItem.addClass('selected');
                }
            }
            nav.append(pageItem);
        }
    };

    /**
     * Updates result list in a result window.
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.updateResult = function ()
    {
        var totalPages = this.engine.totalPages$();
        var resultslot = $('.oktavia_searchresult', this.node);
        resultslot.empty();
        var self = this;
        function clearCallback()
        {
            self.clearResult();
        }
        var results = this.engine.getResult$();
        for (var i = 0; i < results.length; i++)
        {
            var result = results[i];
            var url = this.getDocumentPath(result.url.slice(1));
            var entry = $('<div/>', { "class": "entry" });
            var link = $('<a/>', { "href": url }).text(result.title);
            link.bind('click', clearCallback);
            entry.append($('<div/>', { "class": "title" }).append(link));
            entry.append($('<div/>', { "class": "url" }).text(url));
            entry.append($('<div/>', { "class": "resultcontent" }).html(result.content));
            resultslot.append(entry);
        }
        this.updatePageList();
    };

    /**
     * Searchs again by using proposal search words.
     * @param {string} option Proposal search words
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.searchProposal = function (option)
    {
        $('.oktavia_search', this.node).val(option);
        this.search();
    };

    /**
     * Shows proposals when no result.
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.updateProposal = function ()
    {
        var nav = $('.oktavia_searchresult_nav', this.node);
        var resultslot = $('.oktavia_searchresult', this.node);
        nav.empty();
        resultslot.empty();
        var proposals = this.engine.getProposals$();
        var self = this;
        function createCallback(option)
        {
            return function ()
            {
                self.searchProposal(option);
            };
        }
        for (var i = 0; i < proposals.length; i++)
        {
            var proposal = proposals[i];
            var listitem = $('<div/>', {"class": "proposal"});
            listitem.append('<span>Search with:&nbsp;</span>');
            var option = $('<span/>', {"class": "option"});
            option.html(proposal.label);
            option.bind('click', createCallback(proposal.options));
            listitem.append(option);
            listitem.append('<span>&nbsp;&#x2192;&nbsp;' + proposal.count + ' results.</span>');
            resultslot.append(listitem);
        }
    };

    /**
     * Performs search and shows results.
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.search = function ()
    {
        if (!this.initialized)
        {
            this.reserveSearch = true;
            return;
        }
        var searchInput = $('.oktavia_search', this.node);
        var queryWord = searchInput.val();
        searchInput.blur();
        var self = this;
        this.engine.search$SF$IIV$(queryWord, function (total, pages)
        {
            $('.oktavia_searchresult_box', self.node).fadeIn();
            var summaryNode = $('.oktavia_searchresult_summary', self.node);
            if (total === 0)
            {
                summaryNode.text("No result.");
                self.updateProposal();
            }
            else
            {
                summaryNode.text(total + ' results.');
                self.updateResult();
            }
        });
    };

    /**
     * Converts file path in index.
     * @param {string} filePath Source filepath
     * @returns {string} Result filepath
     * @memberOf SearchView.prototype
     * @method
     */
    SearchView.prototype.getDocumentPath = function (filePath)
    {
        var resultFilePath;
        if (filePath.charAt(0) === '/')
        {
            resultFilePath = filePath;
        }
        else
        {
            var elements = filePath.split(/\//g);
            var result = this.documentRoot.slice();
            for (var i = 0; i < elements.length; i++)
            {
                var element = elements[i];
                switch (element)
                {
                case '.':
                    break;
                case '..':
                    result = result.slice(0, -1);
                    break;
                default:
                    result.push(element);
                    break;
                }
            }
            resultFilePath = result.join('/');
        }
        return resultFilePath;
    };

    /**
     * Hides all result windows.
     * @function
     */
    function eraseResultWindow()
    {
        $('.oktavia_searchresult_box:visible').hide();
    }

    /**
     * jQuery plug-in to create search form and window.
     * It can receive options from data attributes or an <tt>option</tt> parameter.
     * @param {object} [option] Option
     * @param {string} [option.index='search/searchindex.js'] Index file path.
     * @param {string} [option.documentRoot='.'] Document root folder.
     * @param {string} [option.logo='true'] Show logo in result windows. <tt>'false'</tt> or <tt>'disable'</tt> or falsy value disable logo.
     * @name oktaviaSearch
     * @function
     */
    jQuery.fn.oktaviaSearch = function (option)
    {
        var data = {
            'index': 'search/searchindex.js',
            'documentRoot': '.',
            'logo': 'true'
        };
        if (window.DOCUMENTATION_OPTIONS) // Sphinx
        {
            if (window.DOCUMENTATION_OPTIONS.URL_ROOT === '#')
            {
                data.documentRoot = '';
            }
            else
            {
                data.documentRoot = window.DOCUMENTATION_OPTIONS.URL_ROOT;
            }
        }
        var userData = this.data();
        var key;
        for (key in userData)
        {
            if (userData.hasOwnProperty(key))
            {
                data[key] = userData[key];
            }
        }
        for (key in option)
        {
            if (option.hasOwnProperty(key))
            {
                data[key] = option[key];
            }
        }
        if (data.logo === 'false' || data.logo === 'disable' || !data.logo)
        {
            data.logo = false;
        }
        else
        {
            data.logo = true;
        }
        var view = new SearchView(this, data.documentRoot, data.index);

        var form = $('<form class="oktavia_form"><input class="oktavia_search" result="10" type="search" name="search" value="" placeholder="Search" /></form>');
        form.submit(function (event) {
            event.stopPropagation();
            setTimeout(function () {
                view.search();
            }, 10);
            return false;
        });
        this.append(form);
        var resultForm = $([
            '<div class="oktavia_searchresult_box">',
            '<div class="oktavia_close_search_box">&times;</div>',
            '<div class="oktavia_searchresult_summary"></div>',
            '<div class="oktavia_searchresult"></div>',
            '<div class="oktavia_searchresult_nav"></div>',
            '</div>'
        ].join(''));
        if (data.logo)
        {
            resultForm.append($('<span class="pr">Powered by <a href="http://oktavia.info">Oktavia</a></span>'));
        }
        this.append(resultForm);
        $('.oktavia_close_search_box', this.node).bind('click', function (event) {
            view.clearResult();
        });

        // Click outside of the result window, close it
        resultForm.bind('click', function (event) {
            event.stopPropagation();
        });
    };

    /**
     * Global initailization.
     * It add some event handlers.
     * @name initialize
     * @function
     */
    function initialize()
    {

        function onClick() {
            eraseResultWindow();
            return true;
        }
        function onKeyDown(event)
        {
            switch (event.keyCode)
            {
            case 191: // / : focus form
                eraseResultWindow();
                var form = $('form.oktavia_form:first input.search');
                if ($(':focus', form).size() === 0)
                {
                    form.focus();
                }
                break;
            case 74: // j : down
            case 75: // k : up
            case 72: // h : before page
            case 76: // l : next page
            case 13: // enter : select
                var result = $('.oktavia_searchresult_box:visible:first');
                if (result.size() === 1)
                {
                    switch (event.keyCode)
                    {
                    case 74: // j : down
                        console.log('down');
                        break;
                    case 75: // k : up
                        console.log('up');
                        break;
                    case 72: // h : before page
                        console.log('before');
                        break;
                    case 76: // l : next page
                        console.log('next');
                        break;
                    case 13: // enter : select
                        console.log('select');
                        break;
                    }
                }
                break;
            }
            return true;
        }
        var version = $.fn.jquery.split(/\./g);
        var major = Number(version[0]);
        var minor = Number(version[1]);
        if (major === 1 && minor < 7)
        {
            $(document).live('click', onClick);
            $(document).live('keydown', onKeyDown);
        }
        else
        {
            $(document).on('click', onClick);
            $(document).on('keydown', onKeyDown);
        }
    }
    initialize();
})(jQuery);

jQuery(document).ready(function () {
    var form = jQuery('#oktavia_search_form');
    if (form.size() > 0)
    {
        form.oktaviaSearch();
    }
});
