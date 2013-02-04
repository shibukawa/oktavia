Oktavia
=======

Oktavia is a full text search engine for JavaScript environment. It uses FM-Index.

Command
-------

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
