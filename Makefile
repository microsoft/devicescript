CLI = ./cli/devicescript

all: em comp

comp:
	yarn build

comp-fast:
	yarn build-fast

native native1 em update-dist:
	$(MAKE) -C runtime $@

test-c: native comp-fast
	set -e ; for f in devs/run-tests/*.ts ; do \
	  echo "*** $$f" ; \
	  $(CLI) crun $$f ; done

test-em: em comp-fast
	yarn test

test: test-c test-em

vscode-pkg:
	cd vscode && yarn package

clean:
	rm -rf built compiler/built compiler/src/prelude.ts cli/built dap/built vscode/built
	$(MAKE) -C runtime clean

full-clean: clean
	rm -rf node_modules compiler/node_modules runtime/*/node_modules

check:
	$(MAKE) clean
	$(MAKE) docker
	$(MAKE) all
	$(MAKE) test

bc:
	cd bytecode && ./run.sh
	node runtime/scripts/ds-builtin-proto.js \
		runtime/devicescript/devs_bytecode.h \
		runtime/devicescript/impl_*.c
	clang-format -i runtime/devicescript/protogen.c
	$(CLI) dcfg runtime/boards/native/native.board.json --update runtime/posix/native_cfg.c
	clang-format -i runtime/posix/native_cfg.c
	$(CLI) dcfg runtime/boards/wasm/wasm.board.json --update runtime/posix/wasm_cfg.c
	clang-format -i runtime/posix/wasm_cfg.c

regen: bc
	cd ./dcfg && ./regen.sh
	yarn boards

specs spec:
	$(MAKE) -C runtime/jacdac-c/jacdac

docker:
	$(MAKE) clean
	docker run -v `pwd`:/src -w /src  library/gcc make native
	$(MAKE) clean
