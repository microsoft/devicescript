# JacScript bytecode spec

## TODO

* strings vs buffers
* null vs undefined
* slices vs dest offsets

## Statements

    wait_role(role) = 62

Wait until any packet arrives from specified role.

    sleep_s(x) = 63

Wait given number of seconds.

    sleep_ms(x) = 64

Wait given number of milliseconds.

    query_reg(role, code, timeout) = 65

    send_cmd(role, code) = 66

    query_idx_reg(role, code, string, timeout) = 67

    log_format(string, local_idx, numargs) = 68

    format(string, local_idx, numargs, offset) = 69

    setup_pkt_buffer(size) = 70

    set_pkt(buffer, offset) = 71

Copy given string to packet buffer at given `offset`.
Same as `blit(pkt_buffer, offset, buffer, 0, null)`.

    blit(dst, dst_offset, src, src_offset, length) = 72

Copy bytes `src[src_offset .. src_offset + length]` to `dst[dst_offset .. ]`.
Both `src` and `dst` are buffers.

    call(func_idx, local_idx, numargs) = 73

Regular, sync call. Passes `numargs` arguments, starting from local variable number `local_idx`

    call_bg(func_idx, local_idx, numargs, opcall) = 74

Starts new fiber (depending on `call_type`). Returns fiber handle (existing or new).

    return(value) = 75

    jmp(*jmpoffset) = 76               // JMP jmpoffset

    jmp_z(*jmpoffset, x) = 77          // JMP jmpoffset IF NOT x

Jump if condition is false.

    panic(error_code) = 78

    store_local(*local_idx, value) = 79      // local_idx := value

    store_global(*global_idx, value) = 80    // global_idx := value

    store_buffer(buffer, numfmt, offset, value) = 81

    store_param(*param_idx, value) = 82      // param_idx := value

    terminate_fiber(fiber_handle) = 83

Returns nan (fiber doesn't exists) or 0 (terminated).

### Object handling

    alloc_map() = 84

    alloc_array(initial_size) = 85

    alloc_buffer(size) = 86

    set_field(*field_idx, object, value) = 87   // object.field_idx := value

    array_set(array, index, value) = 88         // array[index] := value

    array_insert(array, index, count) = 89

Inserts `count` values (`undefined`) at `index`. If `count` is negative, removes values.

## Expressions

    load_local(*local_idx) = 1

    load_global(*global_idx) = 2

    load_param(*param_idx) = 45

    fun static_role(*role_idx) = 50

    fun static_buffer(*string_idx) = 51

    fun literal(*value) = 4

    fun literal_f64(*f64_idx) = 5

    load_buffer(buffer, numfmt, offset) = 3

    str0eq(buffer, offset) = 7

    role_is_connected(role) = 8

    get_fiber_handle(func_idx) = 47

If `func_idx < 0` returns self-handle.
Otherwise, returns a handle or `nan` if fiber with given function at the bottom is not currently running.

    ret_val = 6

Return value of query register, call, etc.

    now_ms = 46

Time since device restart in ms; time only advances when sleeping.

### Object handling

    get_field(*field_idx, object) = 52   // object.field_idx

    index(object, idx) = 53              // object[idx]

Works on arrays and buffers.

    object_length(object) = 54

Number of entries array or buffer, that can be accessed with `index()`; `0` otherwise.

    keys_length(object) = 55

Number of keys (properties) attached to an object (directly in map or hanging off array/buffer/...).

    fun typeof(object) = 56

Returns `Object_Type` enum.

    fun null() = 57

Returns `null` value.

    fun is_null(x) = 58

Check if object is exactly `null`.

### Current packet accessors

    pkt_size = 9

    pkt_ev_code = 10

    pkt_reg_get_code = 11

    pkt_report_code = 48

    pkt_command_code = 49

    fun pkt_buffer() = 59

Return reference to "buffer" with the packet data.

### Booleans

    fun true() = 60

    fun false() = 61

    fun to_bool(x) = 25   // !!x

### Math operations

    fun nan = 12

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

    img_version = 0x00030001
    magic0 = 0x5363614a // "JacS"
    magic1 = 0x9a6a7e0a
    num_img_sections = 6
    fix_header_size = 64
    section_header_size = 8
    function_header_size = 16
    role_header_size = 8
    binary_size_align = 32
    max_stack_depth = 10
    direct_const_op = 0x80
    direct_const_offset = 16

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
    is_stmt = 0x10
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

## Enum: Object_Type

    null = 0

Only the `null` value.

    number = 1

Integers, doubles, infinity, nan.

    map = 2

    array = 3

    buffer = 4

    role = 5

    boolean = 6

    fiber = 7

Only `true` and `false` values.
