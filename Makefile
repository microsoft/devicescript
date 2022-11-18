comp: compiler/built/compiler/src/jacscript.js

compiler/built/compiler/src/jacscript.js: $(wildcard compiler/src/*.ts) $(wildcard compiler/lib/*.ts)
	cd compiler && node build.js

comp-fast:
	@mkdir -p built
	cd compiler && node build.js --fast

native em:
	$(MAKE) -C runtime $@

test-c: native comp
	@mkdir -p built
	node run -c -t compiler/run-tests/basic.ts

test-em: em comp
	node run test

test: test-c test-em
