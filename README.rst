Oktavia
=======

Oktavia is a full text search engine for JavaScript environment. It uses FM-Index.

Current Status
--------------

It can work as the search engine.

Now it is an alpha version. Not optimized yet.

I am planning to implement following features:

* Improve file size and speed, portability

  * Character code remapping
  * Zip compression
  * Use MessagePack as a container format

* Word Splitter option

  * Standard
  * CJK

* Index Generator

  * Standart Text (file, block, line)
  * CSV (column, line)
  * reST (sections, paragraph, code-block, etc...)

  I hate markdown.

* Custom schema support
* Search client

  * Browser

* Python/Sphinx version

* Cool logo

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

.. code-block:: bash

   $ make

* Create Index File

  .. code-block:: bash

     $ ./oktavia-mkindex -i test/doc/folder -r test/doc/folder -m html

* Run Search

  .. code-block:: bash

     $ ./oktavia-search test/doc/folder/search/index.okt search_word

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

