CC = gcc
INC = -Ijacdac-c/inc -Iinc -I. -Ijacdac-c
Q ?= @

CFLAGS = $(DEFINES) $(INC) \
	-O0 -g3 \
	-Wall -Wextra -Wno-unused-parameter -Wno-shift-negative-value -Wstrict-prototypes -Werror \
	-Wno-strict-aliasing -Wno-error=unused-function -Wno-error=cpp \
	-Wno-error=unused-variable

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
SRC = $(wildcard hf2/*.c) \
	$(wildcard jacdac-c/client/*.c) \
	$(wildcard jacdac-c/jacscript/*.c) \
	$(JDS)/jd_util.c \
	$(JDS)/jd_control.c \
	$(JDS)/jd_services.c \
	$(JDS)/jd_send_util.c \
	$(JDS)/jd_opipe.c \
	$(JDS)/jd_ipipe.c \
	$(JDS)/interfaces/event_queue.c \

OBJ = $(addprefix $(BUILT)/,$(SRC:.c=.o))

all:
	$(Q)$(MAKE) -j16 $(BUILT)/jdcli

$(BUILT)/jdcli: $(OBJ)
	@echo LD $@
	$(Q)$(CC) $(LDFLAGS) -o $@ $(OBJ) -lm -lpthread

$(BUILT)/%.o: %.c $(DEPS)
	@echo CC $<
	@mkdir -p $(dir $@)
	$(Q)$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -rf $(BUILT)
