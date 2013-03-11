What is Oktavia?
================

Oktavia is a full text search engine in JavaScript. It can run on browser and node.js.

The goal of this project is creating an alternative search engine for `Sphinx <http://sphinx-doc.org>`_'s HTML outputs.

Sphinx is an excellent document generator written in Python. It reads simple formatted (reStructuredText) text and converts int into several formats like HTML, PDF and so on.
It is a very popular tool for writing documents for programming language reference manual, software instruction, library, API etc.

Sphinx's HTML generator has a simple built-in search engine. An HTML document written by Sphinx has a search window and the user can search whole documents.
It is written in JavaScript and it downloads an index file and searches on the client browser. A document provider doesn't have to set up search engines on his/her server.
Just deploying ``html`` folder on his/her hosting server, then it is available.

There are many simple HTML hosting service now, like bitbucket.org, github.com, `PyPI <http://pypi.python.org/pypi>`_, Google Drive and more. Also, HTML5 provides an application cache feature.
Static HTML documents (like Sphinx's outputs) without a search engine server will increase more and more.
It is very good timing to create on browser search engine. This search engine provides good experience to readers of these contents.

FM-index
--------

This engine uses the `FM-index <http://en.wikipedia.org/wiki/Fm_index>`_  algorithm. FM-index was invented Paolo Ferragina and Giovanni Manzini.
Compared to "inverted index", FM-index has the following advantages:

* It doesn't need word splitting before a search

  Some eastern Asian languages don't have space between words. To split words, it needs language information (it is called a "dictionary") For example, the famous Japanese word splitter,
  MeCab, needs a big dictionary file (> 10MB). I don't know Chinese and Korean well. Supporting many languages by "inverted index" is difficult.

* It can recreate original document from index file

  "Inverted index" only has word positions in documents. To show document samples on the search result page, it needs the original documents in addition to the index file.
  FM-index needs only an index file to search words and show document samples. Sphinx uses the original document source file for this purpose. But it is not good
  with translation feature because source files are written in different languages. And a user should enable the source exporting option.

* It is the fastest full text search algorithm using a compressed index file

  The book "World of high-speed text analysis" said this. 13 years ago, FM-index was not fast, but during these 13 years, this algorithm have been optimized.

Because of these reason, this is the best algorithm for search engines on browsers. More detail information is written in :doc:`../inside_oktavia`.

This search engine is based on FM-index library `Shellinford <https://code.google.com/p/shellinford/>`_ that was written in C++ by `@echizen_tm <https://twitter.com/echizen_tm>`_.
This library is a very simple and a good implementation to understand FM-index.

* `FM-index paper (Paolo Ferragina and Giovanni Manzini, Opportunistic Data Structures with Applications, Proceedings of the 41st Annual IEEE Symposium on Foundations of Computer Science, pp. 390-398, 2000.) <http://people.unipmn.it/manzini/papers/focs00draft.pdf>`_
