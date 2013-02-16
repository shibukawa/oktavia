Oktavia
=======

Oktavia is a full text search engine for JavaScript environment. It uses FM-Index.

Current Status
--------------

Now it is early alpha version. FM-Index engine works fine, but there are no useful index generator, search client so on.

I am planning to implement following features:

* Basic schemas:

  * HTML (sections, paragraph, pre, anchor)
  * CSV (column, line break)
  * reST (sections, paragraph, code-block, etc...)

  I hate markdown.

* Custom schema support
* Index file generator tool
* Search client

  * Browser
  * node.js (command line and API)

* Stemmers
* Python version

Todo:

* Commit license files for third party modules (Shellinford, sax-js)

Command (plannning)
-------------------

Generate JS code
~~~~~~~~~~~~~~~~

.. code-block:: bash

   # for web envrionment
   $ make release_web

   # for node.js
   $ make release_node

Run Sample (simple FM-Index)
----------------------------

* Create Index File

  .. code-block:: bash

     $ jsx --add-search-path ./lib --run tool/make_index_simple.jsx index.db testdata/jsx_tutorial.txt testdata/jsx_primitive_type.txt testdata/jsx_literal.txt

Run test
~~~~~~~~

.. code-block:: bash

   $ make test

License
-------

This source code is released under MIT License.

.. include:: LICENSE.rst

Thanks
------

BitVector, WaveletMatrix, FM-Index included in this repository are ported from Shellinford
(developed by @echizen_tm). Thank you!

* https://code.google.com/p/shellinford/

SAXParser/SAXHandler are based on isaacs' sax-js. Thank you!

* https://github.com/isaacs/sax-js

