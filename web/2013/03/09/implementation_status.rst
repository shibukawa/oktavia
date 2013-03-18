Implementation Status
=====================

This project was started January, 2013. Following items are already implemented:

.. more::

* Search engine core

  * Bit Vector
  * Wavelet Matrix
  * SAIS(Suffix Array - Induced Sorting)
  * FM-Index

* Index file generator

  * Binary read/write utility
  * SAX/HTML parser
  * Option parser

* Search engine utilities

  * `Stemmer <https://github.com/shibukawa/snowball>`_ (Add JSX/Python generator to `Snowball <http://snowball.tartarus.org/>`_)
  * Query parser
  * Japanese word splitter (`TinySegmenter <http://chasen.org/~taku/software/TinySegmenter/>`_)

* Index generator tool

  * node.js client

* Search client

  * node.js client
  * jQuery web client

Next Implementation Plan
------------------------

* Plain text/CSV file support.
* Add word splitter option.
* Change a search index format to `MessagePack <http://msgpack.org/>`_ for portability.
* Index generator in Python for `Sphinx <http://sphinx-doc.org>`_ (documentation tool).

.. author:: default
.. categories:: development
.. tags:: status
.. comments::
