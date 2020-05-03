# Makefile gendiff

install:
	npm install

start:
	node bin/gendiff.js

publish:
	npm publish --dry-run

make lint:
	npx eslint .

make fix:
	npx eslint . --fix
