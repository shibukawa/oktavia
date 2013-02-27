JSX=jsx

build: httpstatus oktavia-mkindex oktavia-search

.PHONY: test clean

httpstatus:
	$(JSX) --executable node --add-search-path ./lib --output httpstatus tool/httpstatus.jsx

oktavia-mkindex:
	$(JSX) --executable node --add-search-path ./lib --output oktavia-mkindex tool/oktavia-mkindex.jsx

oktavia-search:
	$(JSX) --executable node --add-search-path ./lib --output oktavia-search tool/oktavia-search.jsx

test:
	prove

clean:
	rm httpstatus
	rm oktavia-mkindex
	rm oktavia-search
