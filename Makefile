build: httpstatus

.PHONY: test clean

httpstatus:
	jsx --executable node --add-search-path ./lib --output httpstatus tool/httpstatus.jsx

test:
	prove

clean:
	rm httpstatus
