test: 
	mocha

coverage:
	mocha -R html-cov > docs/coverage.html

documentation: 
	docco lib/*.js

clean:
	rm -rf docs
