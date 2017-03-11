Oktavia
=======

.. image:: https://travis-ci.org/shibukawa/oktavia.png?branch=master

.. image:: https://david-dm.org/shibukawa/oktavia.png

.. image:: https://david-dm.org/shibukawa/oktavia/dev-status.png

:version: 1.0 

Synopsis
---------------

Oktavia is a full text search engine for JavaScript environment. It uses FM-Index.

Usage
-----

See following pages:

English Site: http://oktavia.info
Japanese Site: http://oktavia.info/ja/

Basic Structure
---------------

``oktavia`` command generates JavaScript file(``searchindex.js``) that includes index and search runtime.

HTML includes the following files:

* ``jquery.js`` : jQuery
* ``oktavia-jquery-ui.js`` : JS UI code. that loads ``searchindex.js`` and invokes runtime.
* ``searchstyle.css`` : Style file for JS UI.

When the web page is loaded, ``oktavia-jquery-ui.js`` reads ``searchindex.js`` asynchronously as WebWorker (because some index file is big to load synchronously). ``oktavia-jquery-ui.js`` calls search runtime and shows results.

Current Status
--------------

It can work as the search engine.

Now it is an alpha version. Not optimized yet.

I am planning to implement following features:

* Word Splitter option

  * Standard
  * CJK

* Index Generator

  * CSV (column, line)
  * reST (sections, paragraph, code-block, etc...)

* Custom schema support

Development
-----------

JSX
~~~

Don't be afraid `JSX <http://jsx.github.io>`_ If you have an experience of JavaScript,
you can learn JSX quickly.

* Static type system and unified class syntax.
* All variables and methods belong to class.
* JSX includes optimizer. You don't have to write tricky unreadalbe code for speed.
* You can use almost all JavaScript API as you know. Some functions become static class functions. See `reference <http://jsx.github.io/doc/stdlibref.html>`_.

Repository
~~~~~~~~~~

* Repository: git://github.com/shibukawa/oktavia.git
* Issues: https://github.com/shibukawa/oktavia/issues

Setup
~~~~~

To create development environment, call following command:

.. code-block:: bash

   $ npm install

Build
~~~~~

.. code-block:: bash

   $ npm run build

Run test
~~~~~~~~

.. code-block:: bash

   $ npm test 

Generate API reference
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   $ grunt doc

License
-------

This source code is released under MIT License.

.. include:: LICENSE.rst

Thanks
------

BitVector, WaveletMatrix, FM-Index included in this repository are ported from Shellinford
(developed by @echizen_tm). Thank you!

* https://code.google.com/p/shellinford/

