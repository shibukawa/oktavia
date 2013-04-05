/**
 * @fileOverview
 * A UI script helper that provides search word highlight.
 * Almost all code came from Sphinx
 * @author Yoshiki Shibukawa, yoshiki@shibu.jp
 */

(function ($)
{
    /**
     * small helper function to urldecode strings
     */
    function urldecode(x)
    {
        return decodeURIComponent(x).replace(/\+/g, ' ');
    }

    /**
     * This function returns the parsed url parameters of the
     * current request. Multiple values per key are supported,
     * it will always return arrays of strings for the value parts.
     */
    function getQueryParameters(s)
    {
        if (typeof s == 'undefined')
        s = document.location.search;
        var parts = s.substr(s.indexOf('?') + 1).split('&');
        var result = {};
        for (var i = 0; i < parts.length; i++)
        {
            var tmp = parts[i].split('=', 2);
            var key = urldecode(tmp[0]);
            var value = urldecode(tmp[1]);
            if (key in result)
            {
                result[key].push(value);
            }
            else
            {
                result[key] = [value];
            }
        }
        return result;
    }

    /**
     * highlight a given string on a jquery object by wrapping it in
     * span elements with the given class name.
     */
    jQuery.fn.highlightText = function(text, className)
    {
        function highlight(node)
        {
            if (node.nodeType == 3)
            {
                var val = node.nodeValue;
                var pos = val.toLowerCase().indexOf(text);
                if (pos >= 0 && !jQuery(node.parentNode).hasClass(className))
                {
                    var span = document.createElement("span");
                    span.className = className;
                    span.appendChild(document.createTextNode(val.substr(pos, text.length)));
                    node.parentNode.insertBefore(span, node.parentNode.insertBefore(
                        document.createTextNode(val.substr(pos + text.length)),
                        node.nextSibling));
                    node.nodeValue = val.substr(0, pos);
                }
            }
            else if (!jQuery(node).is("button, select, textarea"))
            {
                jQuery.each(node.childNodes, function() {
                    highlight(this);
                });
            }
        }
        return this.each(function() {
            highlight(this);
        });
    };

    /**
     * highlight the search words provided in the url in the text
     */
    function highlightSearchWords(selector)
    {
        var params = getQueryParameters();
        var terms = (params.highlight) ? params.highlight[0].split(/\s+/) : [];
        if (terms.length)
        {
            var body = $(selector);
            window.setTimeout(function()
            {
                $.each(terms, function()
                {
                    body.highlightText(this.toLowerCase(), 'highlighted');
                });
            }, 10);
        }
    }

    jQuery(document).ready(function () {
        highlightSearchWords('body');
    });
})(jQuery);

