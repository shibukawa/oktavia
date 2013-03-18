Troubleshooting
===============

A Search form is not working...
-------------------------------

See JavaScript's error console. Almost all cases it fails to download an index file.

* Did you add ``-t js`` option?
* Check your an index file name and a document root.

A search result window shifts right...
--------------------------------------

You can fix it by using CSS.

Add ``position`` style to a search form tag.

.. code-block:: html

   <div id="oktavia_search_form" style="position: relative;"/>

Change styles of ``.oktavia_searchresult_box`` in ``searchstyle.css`` like following:

.. code-block:: css

   div.oktavia_searchresult_box {
       display: none;
       position: absolute; // change here
       right: 10px;        // change here
       width: 500px;
       padding: 10px;
       background-color: #ffffff;
       -moz-border-radius: 8px;
       border-radius: 8px;
       -moz-box-shadow: 3px 3px 5px 5px #b5b2b2;
       box-shadow: 3px 3px 5px 5px #b5b2b2;
       opacity: 0.95;
       z-index: 100000;
   }
