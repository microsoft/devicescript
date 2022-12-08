CC = gcc
INC = -Ijacdac-c/inc -Iinc -I. -Ijacdac-c -Ijacdac-c/devicescript
Q ?= @

CFLAGS = $(DEFINES) $(INC) \
	-O0 -g3 \
	-Wall -Wextra -Wno-unused-parameter -Wno-shift-negative-value -Wstrict-prototypes -Werror \
	-Wno-strict-aliasing -Wno-error=unused-function -Wno-error=cpp \
	-Wno-error=unused-variable

_IGNORE1 := $(shell test -f jacdac-c/README.md || git submodule update --init --recursive 1>&2)
_IGNORE2 := $(shell test -f jacdac-c/devicescript/sha-2/README.md || (cd jacdac-c && git submodule update --init --recursive 1>&2))

DEPS = $(wildcard \
	inc/*.h \
	jacdac-c/jacdac/dist/c/*.h \
	jacdac-c/inc/*.h \
	jacdac-c/devicescript/*.h \
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
	$(wildcard jacdac-c/devicescript/*.c) \
	$(wildcard jacdac-c/network/*.c) \
	jacdac-c/jacdac/dist/c/jd_spec_pack.c \
	$(wildcard $(JDS)/*.c) \
	$(wildcard $(JDS)/interfaces/*.c) \
	jacdac-c/storage/crc32.c \
	jacdac-c/storage/lstore.c \

OBJ = $(addprefix $(BUILT)/,$(SRC:.c=.o))

all: native em

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
	rm -rf $(BUILT) devicescript-vm/built

gdb: native
	gdb -x scripts/gdbinit

vg: native
	valgrind --suppressions=scripts/valgrind.supp --show-reachable=yes  --leak-check=full --gen-suppressions=all ./built/jdcli samples/ex-test.devs

EMCC_OPTS = $(DEFINES) $(INC) \
	-g2 -O1 \
	-s WASM=1 \
	-s MODULARIZE=1 \
	-s SINGLE_FILE=1 \
	-s ASSERTIONS=1 \
	-s EXPORTED_FUNCTIONS=_malloc,_free \
	-s ENVIRONMENT=web,webview,worker,node \
	--no-entry

devicescript-vm/built/wasmpre.js: devicescript-vm/wasmpre.ts Makefile
	cd devicescript-vm && yarn build
	cat devicescript-vm/built/wasmpre.d.ts > devicescript-vm/dist/types.d.ts

VM_TMP_FILE = devicescript-vm/built/devicescript-vm.js
VM_FILE = ../website/static/dist/devicescript-vm.js

$(VM_TMP_FILE): devicescript-vm/built/wasmpre.js $(SRC) $(DEPS)
	@mkdir -p $(BUILT)
	sed -e 's/^export var/var/' $< | grep -v '^export ' > $(BUILT)/pre.js
	emcc $(EMCC_OPTS) -o $@ --pre-js $(BUILT)/pre.js $(SRC) -lwebsocket.js

$(VM_FILE): $(VM_TMP_FILE)
	cp -a $(VM_TMP_FILE) $(VM_FILE)

em: $(VM_TMP_FILE)

update-dist: $(VM_FILE)
	git add $(VM_FILE) devicescript-vm/dist/types.d.ts
	if [ "X$$GITHUB_WORKFLOW" != "X" ] ; then git config user.email "<>" && git config user.name "GitHub Bot" ; fi
	if git commit -m "[skip ci] rebuild $(VM_FILE)" ; then git push ; fi

test test-c test-em:
	$(MAKE) -C .. $@
