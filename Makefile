CLI = ./cli/devicescript

all: em comp

comp: compiler/built/compiler/src/devicescript.js

compiler/built/compiler/src/devicescript.js: $(wildcard compiler/src/*.ts) $(wildcard compiler/lib/*.ts)
	yarn build

comp-fast:
	cd compiler && node build.js --fast

native native1 em update-dist:
	$(MAKE) -C runtime $@

test-c: native comp
	$(CLI) crun devs/run-tests/basic.ts

test-em: em comp
	yarn test

test: test-c test-em

clean:
	rm -rf built compiler/built compiler/src/prelude.ts cli/built
	$(MAKE) -C runtime clean

full-clean: clean
	rm -rf node_modules compiler/node_modules runtime/*/node_modules

check:
	$(MAKE) clean
	$(MAKE) all
	$(MAKE) test

regen:
	node runtime/jacdac-c/scripts/ds-builtin-proto.js \
		runtime/jacdac-c/devicescript/devs_bytecode.h \
		runtime/jacdac-c/devicescript/impl_*.c
	clang-format -i runtime/jacdac-c/devicescript/protogen.c
