JSX=jsx
NPM=npm

stemmers = danish dutch english finnish french german hungarian \
	   italian \
	   norwegian porter portuguese romanian \
	   russian spanish swedish turkish

build: bin/httpstatus bin/oktavia-mkindex bin/oktavia-search libs

.PHONY: test clean

bin/%: tool/%.jsx
	$(JSX) --release --executable node --add-search-path ./src --output $@ $<

libs: lib/oktavia-search.js $(stemmers:%=lib/oktavia-%-search.js)

lib/oktavia-search.js: tool/web/oktavia-search.jsx
	$(JSX) --release --executable web --add-search-path ./src --output $@ $<

lib/oktavia-%-search.js: tool/web/oktavia-%-search.jsx
	$(JSX) --release --executable web --add-search-path ./src --output $@ $<

test:
	prove

clean:
	rm bin/httpstatus || true
	rm bin/oktavia-mkindex || true
	rm bin/oktavia-search || true
	rm lib/*.js || true
