Oktavia
=======

.. image:: https://travis-ci.org/shibukawa/oktavia.png?branch=master

:version: 0.5

Oktavia is a full text search engine for JavaScript environment. It uses FM-Index.

Usage
-----

See following pages:

English Site: http://oktavia.info
Japanese Site: http://oktavia.info/ja/

Current Status
--------------

It can work as the search engine.

Now it is an alpha version. Not optimized yet.

I am planning to implement following features:

* Improve file size and speed, portability

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
* Python/Sphinx version

Development
-----------

Build
~~~~~

.. code-block:: bash

   $ make

Run test
~~~~~~~~

.. code-block:: bash

   $ prove

License
-------

This source code is released under MIT License.

.. include:: LICENSE.rst

Thanks
------

BitVector, WaveletMatrix, FM-Index included in this repository are ported from Shellinford
(developed by @echizen_tm). Thank you!

* https://code.google.com/p/shellinford/

