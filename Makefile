JSX=jsx
NPM=npm

stemmers = danish dutch english finnish french german hungarian \
	   italian \
	   norwegian porter portuguese romanian \
	   russian spanish swedish turkish

build: node_modules/uglify-js/bin/uglifyjs bin/httpstatus bin/oktavia-mkindex bin/oktavia-search libs

.PHONY: test clean

node_modules/uglify-js/bin/uglifyjs:
	$(NPM) install uglify-js

bin/httpstatus: tool/httpstatus.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

bin/oktavia-mkindex: tool/oktavia-mkindex.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

bin/oktavia-search: tool/oktavia-search.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

libs: lib/oktavia-search.js lib/oktavia-search.min.js $(stemmers:%=lib/oktavia-%-search.js) $(stemmers:%=lib/oktavia-%-search.min.js)

lib/oktavia-search.js: tool/web/oktavia-search.jsx
	$(JSX) --executable web --add-search-path ./src --output $@ $<

lib/oktavia-%-search.js: tool/web/oktavia-%-search.jsx
	$(JSX) --executable web --add-search-path ./src --output $@ $<

lib/oktavia-search.min.js: lib/oktavia-search.js
	node_modules/uglify-js/bin/uglifyjs --output $@ $<

lib/oktavia-%-search.min.js: lib/oktavia-%-search.js
	node_modules/uglify-js/bin/uglifyjs --output $@ $<

test:
	prove

clean:
	rm bin/httpstatus || true
	rm bin/oktavia-mkindex || true
	rm bin/oktavia-search || true
	rm lib/*.js || true
