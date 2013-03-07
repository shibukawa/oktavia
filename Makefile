JSX=jsx

build: bin/httpstatus bin/oktavia-mkindex bin/oktavia-search libs

.PHONY: test clean

bin/httpstatus:
	$(JSX) --executable node --add-search-path ./src --output $@ tool/httpstatus.jsx

bin/oktavia-mkindex:
	$(JSX) --executable node --add-search-path ./src --output $@ tool/oktavia-mkindex.jsx

bin/oktavia-search:
	$(JSX) --executable node --add-search-path ./src --output $@ tool/oktavia-search.jsx

libs: lib/search.js

lib/search.js:
	$(JSX) --executable web --add-search-path ./src --output $@ tool/web/search.jsx

test:
	prove

clean:
	rm bin/httpstatus || true
	rm bin/oktavia-mkindex || true
	rm bin/oktavia-search || true
	rm lib/search.js || true
