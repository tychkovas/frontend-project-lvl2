# Makefile gendiff
	
install:
	npm install

start:
	node dist/bin/gendiff.js -h

run:
	npx babel-node 'src/bin/gendiff.js' -h

publish:
	npm publish --dry-run

make lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test -- --watch

test-coverage:
	npm test -- --coverage

.PHONY: test
