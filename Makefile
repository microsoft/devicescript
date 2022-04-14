CC = gcc
INC = -Ijacdac-c/inc -Iinc -I. -Ijacdac-c
Q ?= @

CFLAGS = $(DEFINES) $(INC) \
	-O0 -g3 \
	-Wall -Wextra -Wno-unused-parameter -Wno-shift-negative-value -Wstrict-prototypes -Werror \
	-Wno-strict-aliasing -Wno-error=unused-function -Wno-error=cpp \
	-Wno-error=unused-variable

_IGNORE1 := $(shell test -f jacdac-c/README.md || git submodule update --init --recursive 1>&2)

DEPS = $(wildcard \
	inc/*.h \
	jacdac/dist/c/*.h \
	jacdac-c/inc/*.h \
	jacdac-c/jacscript/*.h \
	jacdac-c/inc/interfaces/*.h \
	jacdac-c/services/*.h \
	jacdac-c/services/interfaces/*.h \
)
DEPS += Makefile
LDFLAGS = -flto -g3

BUILT = built
JDS = jacdac-c/source
SRC = $(wildcard posix/*.c) \
	$(wildcard jacdac-c/client/*.c) \
	$(wildcard jacdac-c/jacscript/*.c) \
	$(JDS)/jd_util.c \
	$(JDS)/jd_control.c \
	$(JDS)/jd_services.c \
	$(JDS)/jd_send_util.c \
	$(JDS)/jd_opipe.c \
	$(JDS)/jd_ipipe.c \
	$(JDS)/jd_queue.c \
	$(JDS)/interfaces/tx_queue.c \
	$(JDS)/interfaces/event_queue.c \

OBJ = $(addprefix $(BUILT)/,$(SRC:.c=.o))

all: native em comp

native:
	$(Q)$(MAKE) -j16 $(BUILT)/jdcli

$(BUILT)/jdcli: $(OBJ)
	@echo LD $@
	$(Q)$(CC) $(LDFLAGS) -o $@ $(OBJ) -lm -lpthread

$(BUILT)/%.o: %.c $(DEPS)
	@echo CC $<
	@mkdir -p $(dir $@)
	$(Q)$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -rf $(BUILT) vm/built compiler/built

gdb: native
	gdb -x scripts/gdbinit

vg: native
	valgrind --suppressions=scripts/valgrind.supp --show-reachable=yes  --leak-check=full --gen-suppressions=all ./built/jdcli samples/ex-test.jacs

EMCC_OPTS = $(DEFINES) $(INC) \
	-g2 -O2 \
	-s WASM=1 \
	-s MODULARIZE=1 \
	-s SINGLE_FILE=1 \
	-s EXPORTED_FUNCTIONS=_malloc,_free \
	-s ENVIRONMENT=web,webview,worker \
	--no-entry

vm/built/wasmpre.js: vm/wasmpre.ts vm/node_modules/typescript
	cd vm && yarn build

vm/node_modules/typescript:
	cd vm && yarn install

compiler/node_modules/typescript:
	cd compiler && yarn install

VM_FILE = vm/dist/jacscript-vm.js

$(VM_FILE): vm/built/wasmpre.js $(SRC) $(DEPS)
	@mkdir -p vm/dist
	grep -v '^export ' $< > $(BUILT)/pre.js
	emcc $(EMCC_OPTS) -o $@ --pre-js $(BUILT)/pre.js $(SRC)

em: $(VM_FILE)

comp: compiler/node_modules/typescript
	cd compiler && node build.js

test-c: all
	node run -c compiler/run-tests/basic.js

test-em: em comp
	node run test

test: test-c test-em

update-dist: $(VM_FILE)
	git add $(VM_FILE) vm/dist/wasmpre.d.ts
	if [ "X$$GITHUB_WORKFLOW" != "X" ] ; then git config user.email "<>" && git config user.name "GitHub Bot" ; fi
	if git commit -m "[skip ci] rebuild $(VM_FILE)" ; then git push ; fi
