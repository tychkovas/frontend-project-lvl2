# Makefile gendiff

install:
	npm install

start:
	node bin/gendiff.js -h

publish:
	npm publish --dry-run

make lint:
	npx eslint .
