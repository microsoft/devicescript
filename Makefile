comp: compiler/built/compiler/src/jacscript.js

compiler/built/compiler/src/jacscript.js: $(wildcard compiler/src/*.ts) $(wildcard compiler/lib/*.ts)
	yarn build

comp-fast:
	yarn build-fast

native em update-dist:
	$(MAKE) -C runtime $@

test-c: native comp
	node run -c -t jacs/run-tests/basic.ts

test-em: em comp
	yarn test

test: test-c test-em

clean:
	rm -rf built compiler/built compiler/src/prelude.ts
	$(MAKE) -C runtime clean

full-clean: clean
	rm -rf node_modules compiler/node_modules runtime/*/node_modules
