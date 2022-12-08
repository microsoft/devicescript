CLI = ./cli/devicescript

all: em comp

comp: compiler/built/compiler/src/devicescript.js

compiler/built/compiler/src/devicescript.js: $(wildcard compiler/src/*.ts) $(wildcard compiler/lib/*.ts)
	yarn build

comp-fast:
	cd compiler && node build.js --fast

native em update-dist:
	$(MAKE) -C runtime $@

test-c: native comp
	$(CLI) crun -t jacs/run-tests/basic.ts

test-em: em comp
	yarn test

test: test-c test-em

clean:
	rm -rf built compiler/built compiler/src/prelude.ts cli/built
	$(MAKE) -C runtime clean

full-clean: clean
	rm -rf node_modules compiler/node_modules runtime/*/node_modules
