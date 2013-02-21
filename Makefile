build: httpstatus

.PHONY: test

httpstatus:
	jsx --executable node --add-search-path ./lib --output httpstatus tool/httpstatus.jsx

test:
	prove
