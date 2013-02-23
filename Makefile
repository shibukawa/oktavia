build: httpstatus oktavia-mkindex

.PHONY: test clean

httpstatus:
	jsx --executable node --add-search-path ./lib --output httpstatus tool/httpstatus.jsx

oktavia-mkindex:
	jsx --executable node --add-search-path ./lib --output oktavia-mkindex tool/oktavia-mkindex.jsx

test:
	prove

clean:
	rm httpstatus
	rm oktavia-mkindex
