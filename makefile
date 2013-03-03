test: 
	node_modules/.bin/mocha

coverage:
	node_modules/.bin/mocha -R html-cov > docs/coverage.html

docco: 
	docco lib/*.js

test-doc:
	mocha -R doc > docs/doc.html

jshint:
	jshint {lib,test}/*.js

clean:
	rm -rf docs
