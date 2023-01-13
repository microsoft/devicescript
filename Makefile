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
	set -e ; for f in devs/run-tests/*.ts ; do \
	  echo "*** $$f" ; \
	  $(CLI) crun $$f ; done

test-em: em comp-fast
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
	cd bytecode && ./run.sh
	node runtime/scripts/ds-builtin-proto.js \
		runtime/devicescript/devs_bytecode.h \
		runtime/devicescript/impl_*.c
	clang-format -i runtime/devicescript/protogen.c
