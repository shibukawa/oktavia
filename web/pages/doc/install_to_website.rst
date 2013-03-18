Install Oktavia to Website
==========================

This search engine provides a basic web interface and a style sheet it is based on jQuery. This document describes how to install this interface to your websites.

.. note::

   There are many styles of HTML all over the world. This search engine is very early version and have tried to install few cases.
   If your HTML files are not matched with its assumption, you should have to modify the interface script.

Basic Folder Structure
----------------------

This is a basic structure:

.. code-block:: none

   [document root]
     + index.html
     + search/
     |  + oktavia-search.js or oktavia-*-search.js
     |  + oktavia-jquery-ui.js
     |  + jquery.js
     |  + searchindex.js
     + searchstyle.css
     + [other contents]

You can use both a domain root and directory as a document root:

* Domain Root: ``http://example.com/``
* Sub domain Root: ``http://doc.example.com/``
* Directory: ``http://example.com/doc/``

You should add five files to your folder:

* ``oktavia-search.js`` or ``oktavia-*-search.js``

  This is a core component of this search engine. They are in ``lib`` folder of the package. ``oktavia-search.js`` is a standard version. Others includes stemming library to a standard version.
  For example ``oktavia-german-search.js`` has German stemmer.

* ``oktavia-jquery-ui.js``

  This is a web user interface of the search engine. It reads search words from form and converts search result into DOM. This is a standard browser side JavaScript file. You can customize it easily.

* ``jquery.js``

  ``oktavia-jquery-ui.js`` needs jQuery library to manipulate DOM. It is tested with 1.9.1.

* ``searchstyle.css``

  This is a default style of a search form and search result. You should modify it to match your website.

* ``searchindex.js``

  This is an index file of the document. It is as same as the index described in :doc:`tutorial`.
  In addition to the description of the tutorial, you should add ``-t js`` or ``--type js`` option and generate as JavaScript source code.
  It contains a base64 encoded binary search index.


Add Files
---------

Add following lines in your HTML files that you want to add a search form:

.. code-block:: html

   <link rel="stylesheet" href="searchstyle.css" type="text/css" />
   <script src="search/jquery-1.9.1.min.js"></script>
   <script src="search/oktavia-jquery-ui.js"></script>
   <script src="search/oktavia-english-search.js"></script>

.. note::

   This code sample uses jQuery 1.9.1 minified version. You can use older version of jQuery. jQuery 1.4 was confirmed to work with Oktavia.

Tags to your HTML and Specify an Index File Location
----------------------------------------------------

In above instruction, there are five need files and four of them are already specified in your HTML files. Only an index file is remained.

This search engine reads index file asynchronously to support big index files (for example, the index file of Python document become more than 6.7MB),
so should specify an index file location.

There are two ways to specify the position to create a search form.

* Using the tag it has a predefined ID.

  ``#oktavia_search_form`` is a special name. If there is a tag it has this ID, jQuery UI code convert it to a search form.

  .. code-block:: html

     <div id="oktavia_search_form"></div>

  This tag can have parameters to specify a, document root, an index file path, a flag to show logo:

  .. code-block:: html

     <div id="oktavia_search_form" data-document-root="." data-index="./scripts/searchindex.js" data-logo="enabled"></div>

* Using the jQuery plug-in.

  ``oktavia-jquery-ui.js`` provides jQuery plug-in too. You can convert any tag into a search form:

  .. code-block:: javascript

     $('#search').oktaviaSearch({
         documentRoot: '..',
         index: '../search/searchindex.js',
         logo: false
     });

Parameters are omitted, following values are used:

.. list-table::
   :header-rows: 1
   :widths: 5 5 15

   - * Parameter
     * Default Value
     * Comment
   - * ``documentRoot``
     * ``"."``
     * It is used for resolving an index file location and search result URLs.
   - * ``index``
     * ``"search/searchindex.js"``
     * An index file path. If it is not started with ``"."`` or ``"/"``, it is searched from a document root.
   - * ``logo``
     * ``true``
     * If it is not ``"false"`` or ``"disabled"`` or falsy value, the search engine name and a home page link are printed on a search result window.

Only ``documentRoot`` has two extra methods to specify the value:

* ``<base>`` tag

  If your website already use ``<base>`` tag, you don't have to do anything. An index file is searched from this location.

* ``DOCUMENTATION_OPTIONS.URL_ROOT``

  Documentation tool `Sphinx <http://sphinx-doc.org>`_ injects following tag into generated HTML files.
  If there is the ``DOCUMENTATION_OPTIONS`` the global variable, web interface reads an index file from ``DOCUMENTATION_OPTIONS + 'search/searchindex.js'``.

  .. code-block:: html

     <script type="text/javascript">
     var DOCUMENTATION_OPTIONS = {
         URL_ROOT:    '#',
         VERSION:     '1.0',
         COLLAPSE_MODINDEX: false,
         FILE_SUFFIX: '.html',
         HAS_SOURCE:  true
     };
     </script>

``oktavia-jquery-ui.js`` add following contents into the target tag into following tags.

.. code-block:: html

   <form id="oktavia_form">
       <input class="oktavia_search" type="search" name="search" value="" placeholder="Search" />
   </form>
   <div class="oktavia_searchresult_box">
       <div class="oktavia_close_search_box">&times;</div>
       <div class="oktavia_searchresult_summary"></div>
       <div class="oktavia_searchresult"></div>
       <div class="oktavia_searchresult_nav"></div>
       <span class="pr">Powered by <a href="http://oktavia.info">Oktavia</a></span>
   </div>

