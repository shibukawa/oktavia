html_files := $(shell find . -name "*.html" -print)
js_files := $(shell find . -name "*.js" -print)
css_files := $(shell find . -name "*.css" -print)

all: htmlcomp jscomp csscomp

htmlcomp: $(html_files:.html=.html.gz)
jscomp: $(js_files:.js=.js.gz)
csscomp: $(css_files:.css=.css.gz)

clean:
	find . -name '*.html.gz' -exec rm {} \;
	find . -name '*.js.gz' -exec rm {} \;
	find . -name '*.css.gz' -exec rm {} \;
	rm -rf blog || true

.SUFFIXES: .html .js .css .gz
.PHONY: main jscomp csscomp clean

%.html.gz: %.html
	gzip -c $< > $<.gz
%.js.gz: %.js
	gzip -c $< > $<.gz
%.css.gz: %.css
	gzip -c $< > $<.gz

