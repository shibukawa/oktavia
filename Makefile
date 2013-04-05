JSX=jsx
NPM=npm

stemmers = danish dutch english finnish french german hungarian \
	   italian \
	   norwegian porter portuguese romanian \
	   russian spanish swedish turkish

build: bin/httpstatus bin/oktavia-mkindex bin/oktavia-search libs template-files

.PHONY: test clean

bin/%: tool/%.jsx
	$(JSX) --release --executable node --add-search-path ./src --output $@ $<

libs: lib/oktavia-search.js $(stemmers:%=lib/oktavia-%-search.js) template-files

lib/oktavia-search.js: tool/web/oktavia-search.jsx
	$(JSX) --release --executable web --add-search-path ./src --output $@ $<

lib/oktavia-%-search.js: tool/web/oktavia-%-search.jsx
	$(JSX) --release --executable web --add-search-path ./src --output $@ $<

template-files: templates/jsdoc3/static/scripts/oktavia-search.js templates/sphinx/_static/oktavia-search.js templates/tinkerer/_static/oktavia-search.js

templates/jsdoc3/static/scripts/oktavia-search.js: lib/oktavia-english-search.js
	cp lib/oktavia-english-search.js templates/jsdoc3/static/scripts/
	cp lib/oktavia-jquery-ui.js templates/jsdoc3/static/scripts/
	cp lib/oktavia-jquery-highlight.js templates/jsdoc3/static/scripts/
	cp lib/searchstyle.css templates/jsdoc3/static/styles/

templates/sphinx/_static/oktavia-search.js: lib/oktavia-search.js
	cp lib/oktavia-search.js templates/sphinx/_static/
	cp lib/oktavia-jquery-ui.js templates/sphinx/_static/
	cp lib/searchstyle.css templates/sphinx/_static/

templates/tinkerer/_static/oktavia-search.js: lib/oktavia-search.js
	cp lib/oktavia-search.js templates/tinkerer/_static/
	cp lib/oktavia-jquery-ui.js templates/tinkerer/_static/
	cp lib/searchstyle.css templates/tinkerer/_static/

test:
	prove

test-jsdoc:
	rm -rf out;./node_modules/jsdoc/jsdoc -t templates/jsdoc3 --verbose lib/oktavia-jquery-ui.js
	bin/oktavia-mkindex -i out -m html -c 5 -o scripts -f "#main" -t js -r out

clean:
	rm bin/httpstatus || true
	rm bin/oktavia-mkindex || true
	rm bin/oktavia-search || true
	rm $(stemmers:%=lib/oktavia-%-search.js) || true
	rm lib/oktavia-search.js || true
