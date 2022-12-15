# DeviceScript bytecode spec

## TODO
* object prototypes
* object property lookup by string, not index
* closures - just keep pointer to parent stack frame - in parent clear pointer variables on last use or exit
* try/catch
* drop seconds, use milliseconds everywhere
* multi-program LATER

### Tree-shaking
* in ES tree shaking typically only applies to functions, not class/object methods
* should people even use classes?


### Decisions
* utf16 vs utf8 strings - UTF8
* null vs undefined
* hash-consing of strings? (esp. for JSON parsing) LATER
* call method identified by string -> eg. charCodeAt YES
* prototype property access via string lookup?

### Philosophy
* static vs dynamic
* use types in compilation?
* built-in methods vs opcodes

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

    log_format(*local_idx, numargs, string) = 68

    setup_pkt_buffer(size) = 70

    set_pkt(buffer, offset) = 71

Copy given string to packet buffer at given `offset`.
Same as `blit(pkt_buffer, offset, buffer, 0, null)`.

    blit(dst, dst_offset, src, src_offset, length) = 72

Copy bytes `src[src_offset .. src_offset + length]` to `dst[dst_offset .. ]`.
Both `src` and `dst` are buffers.

    memset(dst, offset, length, value) = 51

Set bytes `dst[offset .. offset + length]` to `value`.

    decode_utf8(buffer) = 97

Convert buffer to string using UTF-8 encoding.

    call(*local_idx, numargs, func) = 73

Regular, sync call. Passes `numargs` arguments, starting from local variable number `local_idx`

    call_bg(*local_idx, numargs, func, opcall) = 74

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

    load_local(*local_idx): any = 1

    load_global(*global_idx): any = 2

    load_param(*param_idx): any = 45

    fun static_role(*role_idx): role = 50

    fun static_buffer(*buffer_idx): buffer = 93

    fun static_builtin_string(*builtin_idx): string = 94

    fun static_ascii_string(*ascii_idx): string = 95

    fun static_utf8_string(*utf8_idx): string = 96

    fun static_function(*func_idx): function = 90

    fun format(*local_idx, numargs, string): string = 69

    fun literal(*value): number = 4

    fun literal_f64(*f64_idx): number = 5

    load_buffer(buffer, numfmt, offset): number = 3

    str0eq(buffer, offset): bool = 7

    role_is_connected(role): bool = 8

    get_fiber_handle(func): fiber = 47

If `func == null` returns self-handle.
Otherwise, returns a handle or `null` if fiber with given function at the bottom is not currently running.

    ret_val: any = 6

Return value of query register, call, etc.

    now_ms: number = 46

Time since device restart in ms; time only advances when sleeping.

### Object handling

    get_field(*field_idx, object): any = 52   // object.field_idx

    index(object, idx): any = 53              // object[idx]

Works on arrays and buffers.

    object_length(object): number = 54

Number of entries array or buffer, that can be accessed with `index()`; `0` otherwise.

    keys_length(object): number = 55

Number of keys (properties) attached to an object (directly in map or hanging off array/buffer/...).

    fun typeof(object): number = 56

Returns `Object_Type` enum.

    fun null(): null = 57

Returns `null` value.

    fun is_null(x): bool = 58

Check if object is exactly `null`.

### Current packet accessors

    pkt_size(): number = 9

    pkt_ev_code(): number = 10

    pkt_reg_get_code(): number = 11

    pkt_report_code(): number = 48

    pkt_command_code(): number = 49

    fun pkt_buffer(): buffer = 59

Return reference to "buffer" with the packet data.

### Booleans

    fun true(): bool = 60

    fun false(): bool = 61

    fun to_bool(x): bool = 25   // !!x

### Math operations

    fun nan(): number = 12

    fun abs(x): number = 13

    fun bit_not(x): number = 14   // ~x

    fun round(x): number = 24

    fun ceil(x): number = 15

    fun floor(x): number = 16

    fun id(x): any = 17

    fun is_nan(x): bool = 18

    fun log_e(x): number = 19

    fun neg(x): number = 20   // -x

    fun not(x): bool = 21   // !x

    fun to_int(x): number = 92

Same as `x | 0`.

    random(x): number = 22

Returns value between 0 and `x`.

    random_int(x): number = 23

Returns an int between 0 and `x` inclusive.

    fun add(x, y): number = 26     // x + y

    fun sub(x, y): number = 44     // x - y
  
    fun mul(x, y): number = 38     // x * y

    fun div(x, y): number = 30     // x / y
  
    fun pow(x, y): number = 40


    fun idiv(x, y): number = 32

    fun imul(x, y): number = 33

    fun imod(x, y): number = 91


    fun bit_and(x, y): number = 27 // x & y

    fun bit_or(x, y): number = 28  // x | y

    fun bit_xor(x, y): number = 29 // x ^ y

    fun shift_left(x, y): number = 41      // x << y

    fun shift_right(x, y): number = 42      // x >> y

    fun shift_right_unsigned(x, y): number = 43      // x >>> y


    fun eq(x, y): bool = 31      // x == y

    fun le(x, y): bool = 34      // x <= y

    fun lt(x, y): bool = 35      // x < y

    fun ne(x, y): bool = 39      // x != y

    fun max(x, y): number = 36

    fun min(x, y): number = 37



## Format Constants

    img_version = 0x00010000
    magic0 = 0x53766544 // "DevS"
    magic1 = 0x9a6a7e0a
    num_img_sections = 8
    fix_header_size = 32
    section_header_size = 8
    function_header_size = 16
    role_header_size = 8
    ascii_header_size = 2
    binary_size_align = 32
    max_stack_depth = 10
    direct_const_op = 0x80
    direct_const_offset = 16
    first_multibyte_int = 0xf8
    first_non_opcode = 0x10000

## Enum: StrIdx

    buffer = 0
    builtin = 1
    ascii = 2
    utf8 = 3
    _shift = 14

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

    bg_max1_replace = 4

Start new fiber. If it's already running, replace it.

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

    bool = 6

Only `true` and `false` values.

    fiber = 7

    function = 8

    string = 9


### Object_Types only used in static type info

    any = 10

    void = 11

## Enum: BuiltIn_String

    _empty = 0
    null = 18
    undefined = 1
    string = 2
    number = 3
    boolean = 4
    function = 5
    toString = 6
    charCodeAt = 7
    next = 8
    prev = 9
    length = 10
    pop = 11
    push = 12
    shift = 13
    unshift = 14
    splice = 15
    slice = 16
    join = 17
    true = 19
    false = 20
    packet = 21
    NaN = 22
    array = 23
    buffer = 24
    map = 25
