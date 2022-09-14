# JacScript bytecode spec

## Statements

    wait_role(role) = 1

Wait until any packet arrives from specified role.

    sleep_s(time_in_s) = 2

Wait given number of seconds.

    sleep_ms(time_in_ms) = 3

Wait given number of milliseconds.

    query_reg(role, code, timeout) = 4

    send_cmd(role, code) = 5

    query_idx_reg(role, code, string_idx, timeout) = 6

    log_format(string_idx, local_idx, numargs) = 7

    format(string_idx, local_idx, numargs, offset) = 8

    setup_buffer(size, buffer_idx) = 9

    memcpy(string_idx, offset) = 10

Copy given string to packet buffer at given `offset`.

    call(func_idx, local_idx, numargs) = 11

Regular, sync call. Passes `numargs` arguments, starting from local variable number `local_idx`

    call_bg(func_idx, local_idx, numargs, opcall) = 12

Starts new fiber (depending on `call_type`). Returns fiber handle (existing or new).

    return(value) = 13

    jmp(*offset) = 14

    jmp_z(*offset, condition) = 15

Jump if condition is false.

    panic(error_code) = 16

    store_local(*local_idx, value) = 17

    store_global(*global_idx, value) = 18

    store_buffer(numfmt, offset, buffer_idx, value) = 19

    store_param(*param_idx, value) = 20

    terminate_fiber(fiber_handle) = 21

Returns nan (fiber doesn't exists) or 0 (terminated).

## Expressions

    load_local(*local_idx) = 1

    load_global(*global_idx) = 2

    load_param(*param_idx) = 45

    fun literal(*value) = 4

    fun literal_f64(*f64_idx) = 5

    load_buffer(numfmt, offset, buffer_idx) = 3

    str0eq(string_idx, offset) = 7

    role_is_connected(role) = 8

    get_fiber_handle(func_idx) = 47

If `func_idx < 0` returns self-handle.
Otherwise, returns a handle or `nan` if fiber with given function at the bottom is not currently running.

    ret_val = 6

Return value of query register, call, etc.

    pkt_size = 9

    pkt_ev_code = 10

    pkt_reg_get_code = 11

    fun nan = 12

    now_ms = 46

Time since device restart in ms; time only advances when sleeping.

    fun abs(x) = 13

    fun bit_not(x) = 14   // ~x

    fun ceil(x) = 15

    fun floor(x) = 16

    fun id(x) = 17

    fun is_nan(x) = 18

    fun log_e(x) = 19

    fun neg(x) = 20   // -x

    fun not(x) = 21   // !x

    random(x) = 22

Returns value between 0 and `x`.

    random_int(x) = 23

Returns an int between 0 and `x` inclusive.

    fun round(x) = 24

    fun to_bool(x) = 25   // !!x

    fun add(x, y) = 26     // x + y

    fun bit_and(x, y) = 27 // x & y

    fun bit_or(x, y) = 28  // x | y

    fun bit_xor(x, y) = 29 // x ^ y

    fun div(x, y) = 30     // x / y

    fun eq(x, y) = 31      // x == y

    fun idiv(x, y) = 32

    fun imul(x, y) = 33

    fun le(x, y) = 34      // x <= y

    fun lt(x, y) = 35      // x < y

    fun max(x, y) = 36

    fun min(x, y) = 37

    fun mul(x, y) = 38     // x * y

    fun ne(x, y) = 39      // x != y

    fun pow(x, y) = 40

    fun shift_left(x, y) = 41      // x << y

    fun shift_right(x, y) = 42      // x >> y

    fun shift_right_unsigned(x, y) = 43      // x >>> y

    fun sub(x, y) = 44     // x - y

## Format Constants

    img_version = 0x00020001
    magic0 = 0x5363614a // "JacS"
    magic1 = 0x9a6a7e0a
    num_img_sections = 7
    fix_header_size = 64
    section_header_size = 8
    function_header_size = 16
    role_header_size = 8
    buffer_header_size = 8
    binary_size_align = 32
    max_expr_depth = 10

## Enum: OpCall

    sync = 0

Regular call. Unused.

    bg = 1

Always start new fiber.

    bg_max1 = 2

Start new fiber unless one is already running.

    bg_max1_pend1 = 3

If fiber is already running, set a flag for it to be restarted when it finishes.
Otherwise, start new fiber.

## Enum: BytecodeFlag

    num_args_mask = 0xf
    takes_number = 0x20
    is_stateless = 0x40 // fun modifier

## Enum: NumFmt

Size in bits is: `8 << (fmt & 0b11)`.
Format is `["u", "i", "f", "reserved"](fmt >> 2)`

    U8 = 0b0000
    U16 = 0b0001
    U32 = 0b0010
    U64 = 0b0011
    I8 = 0b0100
    I16 = 0b0101
    I32 = 0b0110
    I64 = 0b0111
    F8 = 0b1000 // not supported
    F16 = 0b1001 // not supported
    F32 = 0b1010
    F64 = 0b1011
