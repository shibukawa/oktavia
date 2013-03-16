Install to Sphinx
=================

.. image:: sphinx.png

Using this search engine with `Sphinx <http://sphinx-doc.org>`_ is easy.

There is a template in `the github repository <https://github.com/shibukawa/oktavia/tree/master/templates/sphinx>`_.

What you have to do is the following:

1. After creating a project folder (by using ``sphinx-quickstart``), copy needed files into a ``_static`` folder.

   * ``oktavia-search.js`` or ``oktavia-*-search.js``
   * ``oktavia-jquery-ui.js``
   * ``searchstyle.css``

2. Add a search form entry point to a HTML template.

   Add following contents into your ``_templates/layout.html`` or copy the file in the template.

   .. code-block:: jinja

      {% extends "!layout.html" %}

      {% block sidebarlogo %}
      {{ super() }}
      <div class="sidebarRow">
         <script type="text/javascript" src="{{ pathto("_static/oktavia-search.js", 1) }}"></script>
         <script type="text/javascript" src="{{ pathto("_static/oktavia-jquery-ui.js", 1) }}"></script>
         <link rel="stylesheet" href="{{ pathto("_static/searchstyle.css", 1) }}" type="text/css" />
         <h3>Search by Oktavia</h3>
         <div id="oktavia_search_form" data-index="search/searchindex.js"/>
      </div>
      {% endblock %}

   If you override ``sidebarsearch`` block, it is appear the bottom of a sidebar. Above case shows the top of a sidebar.

3. Suppress an existing search form.

   Add an empty ``_templates/searchbox.html`` file or add following lines to ``_templates/layout.html``:

   .. code-block:: jinja

      {% extends "!layout.html" %}

      {% block sidebarlogo %}
      {% endblock %}

4. Add a line to run the index generator into ``html`` section.

   .. code-block:: make

      html:
              $(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)/html
              ../bin/oktavia-mkindex -i _build/html -r _build/html -m html -f .body -t js -c 5 -u file
              @echo
              @echo "Build finished. The HTML pages are in $(BUILDDIR)/html."

