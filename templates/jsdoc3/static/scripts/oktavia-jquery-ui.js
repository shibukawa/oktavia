/**
 * @fileOverview
 * A UI script that creates search form, loads an index files and show search results.
 * It needs jQuery and <tt>oktavia-search.js</tt> or <tt>oktavia-*-search.js</tt>
 * (stemming library supported versions).
 * @author Yoshiki Shibukawa, yoshiki@shibu.jp
 */

(function ($)
{
    var logosrc;
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
        function loadIndex()
        {
            self.engine.loadIndex$S(window.searchIndex);
            self.initialized = true;
            window.searchIndex = null;
            if (self.reserveSearch)
            {
                self.search();
            }
            self.reserveSearch = false;
        }
        if (window.searchIndex)
        {
            loadIndex()
        }
        else
        {
            this.loadJavaScript(indexURL, loadIndex);
        }
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
        var searchInput = $('.oktavia_search', this.node);
        var queryWord = searchInput.val()
        for (var i = 0; i < results.length; i++)
        {
            var result = results[i];
            var url = this.getDocumentPath(result.url.slice(1))
            var entry = $('<div/>', { "class": "entry" });
            var link = $('<a/>', { "href": url + this.engine.getHighlight$() }).text(result.title);
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
            resultForm.append($('<span class="pr">Powered by <a href="http://oktavia.info"><img src="' + logosrc + '" width="86px" height="25px" alt="Oktavia"></img></a></span>'));
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

    var logosrc = "data:image/jpeg;base64, /9j/4AAQSkZJRgABAQEASABIAAD/4ge4SUNDX1BST0ZJTEUAAQEAAAeoYXBwbAIgAABtbnRyUkdCIFhZWiAH2QACABkACwAaAAthY3NwQVBQTAAAAABhcHBsAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAG9kc2NtAAABeAAABWxjcHJ0AAAG5AAAADh3dHB0AAAHHAAAABRyWFlaAAAHMAAAABRnWFlaAAAHRAAAABRiWFlaAAAHWAAAABRyVFJDAAAHbAAAAA5jaGFkAAAHfAAAACxiVFJDAAAHbAAAAA5nVFJDAAAHbAAAAA5kZXNjAAAAAAAAABRHZW5lcmljIFJHQiBQcm9maWxlAAAAAAAAAAAAAAAUR2VuZXJpYyBSR0IgUHJvZmlsZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAeAAAADHNrU0sAAAAoAAABeGhySFIAAAAoAAABoGNhRVMAAAAkAAAByHB0QlIAAAAmAAAB7HVrVUEAAAAqAAACEmZyRlUAAAAoAAACPHpoVFcAAAAWAAACZGl0SVQAAAAoAAACem5iTk8AAAAmAAAComtvS1IAAAAWAAACyGNzQ1oAAAAiAAAC3mhlSUwAAAAeAAADAGRlREUAAAAsAAADHmh1SFUAAAAoAAADSnN2U0UAAAAmAAAConpoQ04AAAAWAAADcmphSlAAAAAaAAADiHJvUk8AAAAkAAADomVsR1IAAAAiAAADxnB0UE8AAAAmAAAD6G5sTkwAAAAoAAAEDmVzRVMAAAAmAAAD6HRoVEgAAAAkAAAENnRyVFIAAAAiAAAEWmZpRkkAAAAoAAAEfHBsUEwAAAAsAAAEpHJ1UlUAAAAiAAAE0GFyRUcAAAAmAAAE8mVuVVMAAAAmAAAFGGRhREsAAAAuAAAFPgBWAWEAZQBvAGIAZQBjAG4A/QAgAFIARwBCACAAcAByAG8AZgBpAGwARwBlAG4AZQByAGkBDQBrAGkAIABSAEcAQgAgAHAAcgBvAGYAaQBsAFAAZQByAGYAaQBsACAAUgBHAEIAIABnAGUAbgDoAHIAaQBjAFAAZQByAGYAaQBsACAAUgBHAEIAIABHAGUAbgDpAHIAaQBjAG8EFwQwBDMEMAQ7BEwEPQQ4BDkAIAQ/BEAEPgREBDAEOQQ7ACAAUgBHAEIAUAByAG8AZgBpAGwAIABnAOkAbgDpAHIAaQBxAHUAZQAgAFIAVgBCkBp1KAAgAFIARwBCACCCcl9pY8+P8ABQAHIAbwBmAGkAbABvACAAUgBHAEIAIABnAGUAbgBlAHIAaQBjAG8ARwBlAG4AZQByAGkAcwBrACAAUgBHAEIALQBwAHIAbwBmAGkAbMd8vBgAIABSAEcAQgAg1QS4XNMMx3wATwBiAGUAYwBuAP0AIABSAEcAQgAgAHAAcgBvAGYAaQBsBeQF6AXVBeQF2QXcACAAUgBHAEIAIAXbBdwF3AXZAEEAbABsAGcAZQBtAGUAaQBuAGUAcwAgAFIARwBCAC0AUAByAG8AZgBpAGwAwQBsAHQAYQBsAOEAbgBvAHMAIABSAEcAQgAgAHAAcgBvAGYAaQBsZm6QGgAgAFIARwBCACBjz4/wZYdO9k4AgiwAIABSAEcAQgAgMNcw7TDVMKEwpDDrAFAAcgBvAGYAaQBsACAAUgBHAEIAIABnAGUAbgBlAHIAaQBjA5MDtQO9A7kDugPMACADwAPBA78DxgOvA7sAIABSAEcAQgBQAGUAcgBmAGkAbAAgAFIARwBCACAAZwBlAG4A6QByAGkAYwBvAEEAbABnAGUAbQBlAGUAbgAgAFIARwBCAC0AcAByAG8AZgBpAGUAbA5CDhsOIw5EDh8OJQ5MACAAUgBHAEIAIA4XDjEOSA4nDkQOGwBHAGUAbgBlAGwAIABSAEcAQgAgAFAAcgBvAGYAaQBsAGkAWQBsAGUAaQBuAGUAbgAgAFIARwBCAC0AcAByAG8AZgBpAGkAbABpAFUAbgBpAHcAZQByAHMAYQBsAG4AeQAgAHAAcgBvAGYAaQBsACAAUgBHAEIEHgQxBEkEOAQ5ACAEPwRABD4ERAQ4BDsETAAgAFIARwBCBkUGRAZBACAGKgY5BjEGSgZBACAAUgBHAEIAIAYnBkQGOQYnBkUARwBlAG4AZQByAGkAYwAgAFIARwBCACAAUAByAG8AZgBpAGwAZQBHAGUAbgBlAHIAZQBsACAAUgBHAEIALQBiAGUAcwBrAHIAaQB2AGUAbABzAGV0ZXh0AAAAAENvcHlyaWdodCAyMDA3IEFwcGxlIEluYy4sIGFsbCByaWdodHMgcmVzZXJ2ZWQuAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAHRNAAA97gAAA9BYWVogAAAAAAAAWnUAAKxzAAAXNFhZWiAAAAAAAAAoGgAAFZ8AALg2Y3VydgAAAAAAAAABAc0AAHNmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBs/+EAgEV4aWYAAE1NACoAAAAIAAUBEgADAAAAAQABAAABGgAFAAAAAQAAAEoBGwAFAAAAAQAAAFIBKAADAAAAAQACAACHaQAEAAAAAQAAAFoAAAAAAAAASAAAAAEAAABIAAAAAQACoAIABAAAAAEAAABWoAMABAAAAAEAAAAYAAAAAP/bAEMAAgICAgIBAgICAgICAgMDBgQDAwMDBwUFBAYIBwgICAcICAkKDQsJCQwKCAgLDwsMDQ4ODg4JCxARDw4RDQ4ODv/bAEMBAgICAwMDBgQEBg4JCAkODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODv/AABEIABgAVgMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP3571+dfjn4ofEz4+/tjeJPg38JPE+peAfh/wCE9Q/szxJ4g0namo6xqCoss9tBM6sLe2gRlEkqqXLNtXnFfooa/Lj9jvU7PwH+3T+0D8J/E00Vt4usvHOs3MfmsAbqDUbmO+tp1J6qyN5ZPZkCnqBTQG7pnwW1VP2lde8FfB74qfF3R/E3hrT459f8Val4xutRsIryVd8Nq1ncGRZlYD5zlSoPHTBufD39oH4y+F9H8Xaj8Ur2w8SxeCvES6P4+0tLBIbzSklI8m/t5IwFmt2BBwVB/PI9Z+DOtWfhn/goR+0p8P8AxDcw6f4j1XV7bxLo0dw4U3+nyWwQvHk/MI3RlbH3a+SvG/jnRdbi/bY+JOkyJc+HvF0mm+BvBoiGf+Eh1OGPy3a2H/LUBnHzLkYXNfa0KNGnmlDCxpKVOpGmndXb5knKSb1i7t2cbWtrfW/w+IjiK2WVsRKu41ISm42dlGzajFpWUlZK6le921bS36G+GPHWq61+2r4+8I/2jFdeGdO8N6Xf6fEkKja1wZdz7wNzBgq8E4Fcr8T/ANpDwX4U0bw63hzxb4P1S5vPE8Gm3zveCRLW2WULdzDacHyhwxzhSwJz0Pxp430f4ww/H74qeEvABimudH+FHhxvFdvFcvDqGoW8KSCSztJFB2STBZlL9QFwOWr2L4k+IPh1r/7Fn7MuufDG00638E3XxJ8Pw6dbQQqPsymdlkgcdQ6uCrg8lgc5r1P7EwEcVhqk1zRlyK0bJL92neWm8nqu9m7nl1MzzN4PE0oS5Jpzd5Xb1ntHXaK0v00SXU+s9e+M/wAKfDGg6NqevfEDwrpljq9st1pckt8v+lwtyssYGSyH+8Bj3rQ0v4o/DrW7Hw/daR408OajBrl09ppElveowu50Xc0SY6yBeSvXHavmb/hIr7Uv22vivD8EvhJoXirxTpP2LTPFfibxX4ke0s7aRYQ8VpawiKVgqo4ZtiopJzyea+e7PQfFGteEv2tLyxh8Op8QPAXjrTfE+nW3htX+xLfWtos00UO7DfPGJImJAJYtx2rzcNw5g6tP35ODtF6uL+NpK8VrFJyTu3qleyvp6tfPsxp1PdhGSvJaKS+FNu0no20mrJWTduZ21/Rf4l6/d6N8PWtNC8UeF/C/jLU3Nv4cfXojLb3NyqmTyjGrKzAqrZKnKj5sHGD5j4L8W6fZfC6y+M3xg+IHguN9UQjSxY6iP7G0qFiR5Fs7HNxM2DvmILNgqoVBg+X6B4vsPj9+14vjbQ5xdeB/AXgBbq0kVt0b6tq1uZCPTfDbAA9wZe1eNfCXxXp9x8Ev2UdE8N/DhfiX8Xl8F3uq6PFqet/YdL0qzM5iluZiVcNIWwi7Y2Yc4IzzyUuFaLSlVlLnjbmjdJK8aklrKyWkY3b25no2kj13xhjIUKlCjThySb5Z8rcnZwi0mtWm3L3Vvy7pSlf9C/BnxO+H3xE+2f8ACEeMNB8TPaAG6isboPJCD0LJ94A+uMUV8JaxqPjex/4KWaZ/wmlh4A8NeJrr4bXUslp4Su5pdsI1C1VPtErpGXcndtwgAAPWisswyGlTlB0p6SSfR2+asntvZHDg+Iq/LKNan7ybV1dX+Tu16XZyPjX4k/tYftcfF/xR8Kvgh4b1/wDZ7+EOkanc6R4p8f8AiK2e31O6khkMcsVqqsGUHBwIW3FWy00BG1vWrX/gnT8EtJ+DfhvS/Dmq+NfDPxL0dnmT4m6dfKuvXs8mDI10zKY54jhQIXUqiqoXGM0UV8wfXC6h+xb418baxpK/Fv8Aad+IHjrRtOt5LSOKy8PadpV9PbyAeZDJexRmYI+BuCFc4x0yD6x8Lv2Pfgl8J/GOleINE0rX9e1jSQ40WfxHrM2oJpW8kubWJz5ULMScuqBj60UV00sdiKUXGE2k1Z2fTt6eRhPC0Zu8op9fn39dD2fTfhx4Y0r9oPxP8TrOG9XxXr+mWmnajK92zRNDamQwhYz8qkGR8kcnPPQV5ZqX7Kvwh1L4deMfCbWHiGx0HxF4lTxJLaWOuTwLp+pK277TZ7WH2Zi3JVMKTnjk0UVdLMsXTlzQqNPTq/s/D93TsKeEozVpRT3/AB3+8zT+yX8OIfEY1nSPEvxc8N6xPpdvp+sX2keOL22n1tIF2JJeOrZmn28GbIkOBluK9C+G/wADPhv8Jtc8WXngTR7nR4vEa2/9qWbX0s9vI0KMgkCSFsSOGYyPnMjEsxJ5ooq62bY2rBwnVk09GrvW21/Syt2M45fhozU1BXXWxL8MPgl8Pfg98LtY8H+A9KuNM0TU7+e9vElu3mkaSZQrYdiSFVQqqvRQABXAT/snfCj/AIQX4daNpD+NfC134GspLHw5rmh+JLi01O3tpGLPA86nMsbE5KuGFFFEc1xiqSqKrLmk7t3ers1r30bXo2U8Fh3BQ5FZdLfMS3/ZL+Elp4qtvEUA8aHxWtrPbXmvz+JrqfUNRSWSJ2+0zSMxlwYUCZ4RQVUKCRRRRTnm+Nl8VVv1ZCy3CramvuP/2Q==";
    initialize();
})(jQuery);

jQuery(document).ready(function () {
    var form = jQuery('#oktavia_search_form');
    if (form.size() > 0)
    {
        form.oktaviaSearch();
    }
});
