JSX=jsx

build: bin/httpstatus bin/oktavia-mkindex bin/oktavia-search

.PHONY: test clean

bin/httpstatus:
	$(JSX) --executable node --add-search-path ./lib --output bin/httpstatus tool/httpstatus.jsx

bin/oktavia-mkindex:
	$(JSX) --executable node --add-search-path ./lib --output bin/oktavia-mkindex tool/oktavia-mkindex.jsx

bin/oktavia-search:
	$(JSX) --executable node --add-search-path ./lib --output bin/oktavia-search tool/oktavia-search.jsx

test:
	prove

clean:
	rm bin/httpstatus
	rm bin/oktavia-mkindex
	rm bin/oktavia-search
