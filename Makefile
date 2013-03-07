JSX=jsx

stemmers = danish dutch english finnish french german hungarian \
	   italian \
	   norwegian porter portuguese romanian \
	   russian spanish swedish turkish

build: bin/httpstatus bin/oktavia-mkindex bin/oktavia-search libs

.PHONY: test clean

bin/httpstatus: tool/httpstatus.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

bin/oktavia-mkindex: tool/oktavia-mkindex.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

bin/oktavia-search: tool/oktavia-search.jsx
	$(JSX) --executable node --add-search-path ./src --output $@ $<

libs: lib/oktavia-search.js $(stemmers:%=lib/oktavia-%-search.js)

lib/oktavia-search.js: tool/web/oktavia-search.jsx
	$(JSX) --executable web --add-search-path ./src --output $@ $<

lib/oktavia-%-search.js: tool/web/oktavia-%-search.jsx
	$(JSX) --executable web --add-search-path ./src --output $@ $<

test:
	prove

clean:
	rm bin/httpstatus || true
	rm bin/oktavia-mkindex || true
	rm bin/oktavia-search || true
	rm lib/*.js || true
