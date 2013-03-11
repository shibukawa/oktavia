Command Reference
=================

oktavia-mkindex
---------------

Usage
~~~~~

.. code-block:: bash

   $ oktavia_mkindex [options]

Common Options
~~~~~~~~~~~~~~

* ``-i``, ``--input`` [input folder/file]:

  Target files to search. .html, .csv, .txt are available.

* ``-t``, ``--type`` [type]:

  Export type. ``index`` (default), ``base64``, ``cmd``, ``js``, ``commonjs`` are available. 'index' is a just index file. 'cmd' is a base64 code with search program. Others are base64 source code style output.

* ``-m``, ``--mode`` [mode]:

  Mode type. 'html', 'csv', 'text' are available.

* ``-c``, ``--cache-density`` [percent]:

  Cache data density. It effects file size and search speed. 100% become four times of base index file size. Default value is 5%. Valid value is 0.1% - 100%.

* ``-n``, ``--name`` [function]:

  A variable name for 'js' output or property name for 'js' and 'commonjs'. Default value is 'searchIndex'.

* ``-q``, ``--quiet``:

  Hide detail information.

* ``-h``, ``--help``:

  Display help message.

HTML Mode Options
~~~~~~~~~~~~~~~~~

* ``-r``, ``--root`` [document root]:

  Document root folder. Default is current. Indexer creates result file path from this folder.

* ``-p``, ``--prefix`` [directory prefix]:

  Directory prefix for a document root from a server root. If your domain is example.com and 'manual' is passed, document root become http://example.com/manual/. It effects search result URL. Default value is '/'.

* ``-o``, ``--output`` [outputfolder]:

  Directory that will store output files. This is a relative path from root. Default value is '/search'.

* ``-u``, ``--unit`` [search unit]:

  'file', 'h1'-'h6'. Default value is 'file'.

* ``-f``, ``--filter`` [target tag]:

  Only contents inside this tag is indexed. Default value is "article,#content,#main,div.body".

* ``-s``, ``--stemmer`` [algorithm]:

  Select stemming algorithm.

..
   :-w, --word-splitter [splitter]: Use optional word splitter. 'ts' (TinySegmenter for Japanese) is available

..
   Text Mode Options
   :-s, --stemmer [algorithm]: Select stemming algorithm.
   :-w, --word-splitter [splitter]: Use optional word splitter. 'ts' (TinySegmenter for Japanese) is available
   :-u, --unit [search unit]: file, block, line. Default value is 'file'.
   CSV Mode Options

Supported Stemmer Algorithms
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* danish
* dutch
* english
* finnish
* french
* german
* hungarian
* italian
* norwegian
* porter
* portuguese
* romanian
* russian
* spanish
* swedish
* turkish

oktavia-search
---------------

Usage
~~~~~

.. code-block:: bash

   $ oktavia_search index_file [options] query

Options
~~~~~~~

* ``-m``, ``--mono``:

  Don't use color.

* ``-s``, ``--stemmer`` [algorithm]:

  Select stemming algorithm.

* ``-n``, ``--number`` [char number]:

  Result display number. Default value = 250

* ``-h``, ``--help``:

  Display help message.

Search Query Syntax
~~~~~~~~~~~~~~~~~~~

* ``word1 word2``:

  All words.

* ``"word1 word2"``:

  Exact words or phrase.

* ``word1 OR word2``:

  Any of these words.

* ``word1 -word2``:

  None of these words.

