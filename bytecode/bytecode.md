# DeviceScript bytecode spec

Expressions do not modify the state. They may throw exceptions though.

## TODO
* try/catch
* drop seconds, use milliseconds everywhere
* multi-program LATER

### Decisions
* hash-consing of strings? (esp. for JSON parsing) LATER

### Dynamic methods
* role.packet -> (roleidx, spec-offset)
* led.active.__proto__.foo = ... ? nope. frozen.

## Ops

### Control flow

    call0(func) = 2                                   // CALL func()
    call1(func, v0) = 3                               // CALL func(v0)
    call2(func, v0, v1) = 4                           // CALL func(v0, v1)
    call3(func, v0, v1, v2) = 5                       // CALL func(v0, v1, v2)
    call4(func, v0, v1, v2, v3) = 6                   // CALL func(v0, v1, v2, v3)
    call5(func, v0, v1, v2, v3, v4) = 7               // CALL func(v0, v1, v2, v3, v4)
    call6(func, v0, v1, v2, v3, v4, v5) = 8           // CALL func(v0, v1, v2, v3, v4, v5)
    call7(func, v0, v1, v2, v3, v4, v5, v6) = 9       // CALL func(v0, v1, v2, v3, v4, v5, v6)
    call8(func, v0, v1, v2, v3, v4, v5, v6, v7) = 10  // CALL func(v0, v1, v2, v3, v4, v5, v6, v7)

Call a function with given number of parameters.

    return(value) = 12

    jmp(*jmpoffset) = 13               // JMP jmpoffset

    jmp_z(*jmpoffset, x) = 14          // JMP jmpoffset IF NOT x

Jump if condition is false.

    panic(error_code) = 15

### Variables

    store_local(*local_idx, value) = 17      // local_idx := value

    store_global(*global_idx, value) = 18    // global_idx := value

    store_buffer(buffer, numfmt, offset, value) = 19

    load_local(*local_idx): any = 21

    load_global(*global_idx): any = 22

    store_closure(*local_clo_idx, levels, value) = 83

    load_closure(*local_clo_idx, levels): any = 84

    make_closure(*func_idx): function = 85    // CLOSURE(func_idx)

### Field access

    index(object, idx): any = 24              // object[idx]

Read named field or sequence member (depending on type of idx).

    index_set(object, index, value) = 25         // object[index] := value

Write named field or sequence member (depending on type of idx).

    index_delete(object, index) = 90              // delete object[index]

Remove a named field from an object.

    builtin_field(*builtin_idx, obj): any = 26  // [builtin_idx]obj

Shorthand to `index(obj, static_builtin_string(builtin_idx))`
 
    ascii_field(*ascii_idx, obj): any = 27      // [ascii_idx]obj

Shorthand to `index(obj, static_ascii_string(ascii_idx))`

    utf8_field(*utf8_idx, obj): any = 28        // [utf8_idx]obj

Shorthand to `index(obj, static_utf8_string(utf8_idx))`

    fun math_field(*builtin_idx): any = 29      // Math.builtin_idx

    fun ds_field(*builtin_idx): any = 30        // ds.builtin_idx

    fun object_field(*builtin_idx): any = 89      // Object.builtin_idx

### Objects

    alloc_map() = 31

    alloc_array(initial_size) = 32

    alloc_buffer(size) = 33

### Statics

    fun static_role(*role_idx): role = 34

    fun static_buffer(*buffer_idx): buffer = 35

    fun static_builtin_string(*builtin_idx): string = 36

    fun static_ascii_string(*ascii_idx): string = 37

    fun static_utf8_string(*utf8_idx): string = 38

    fun static_function(*func_idx): function = 39

    fun literal(*value): number = 40

    fun literal_f64(*f64_idx): number = 41

    fun builtin_object(*builtin_object): number = 1

### Misc

    load_buffer(buffer, numfmt, offset): number = 43

    ret_val: any = 44

Return value of query register, call, etc.

    fun typeof(object): number = 45

Returns `Object_Type` enum.

    fun typeof_str(object): number = 86

Returns JS-compatible string.

    fun null(): null = 46

Returns `null` value.

    fun is_null(x): bool = 47

Check if object is exactly `null`.

### Booleans

    fun true(): bool = 48

    fun false(): bool = 49

    fun to_bool(x): bool = 50   // !!x

### Math operations

    fun nan(): number = 51

    fun inf(): number = 87

    fun abs(x): number = 52

    fun bit_not(x): number = 53   // ~x

    fun is_nan(x): bool = 54

    fun neg(x): number = 55   // -x

    fun uplus(x): number = 88  // +x

    fun not(x): bool = 56   // !x

    fun to_int(x): number = 57

Same as `x | 0`.

    fun add(x, y): number = 58     // x + y

    fun sub(x, y): number = 59     // x - y
  
    fun mul(x, y): number = 60     // x * y

    fun div(x, y): number = 61     // x / y

    fun bit_and(x, y): number = 62 // x & y

    fun bit_or(x, y): number = 63  // x | y

    fun bit_xor(x, y): number = 64 // x ^ y

    fun shift_left(x, y): number = 65      // x << y

    fun shift_right(x, y): number = 66      // x >> y

    fun shift_right_unsigned(x, y): number = 67      // x >>> y

    fun eq(x, y): bool = 68      // x == y

    fun le(x, y): bool = 69      // x <= y

    fun lt(x, y): bool = 70      // x < y

    fun ne(x, y): bool = 71      // x != y

### To be removed (mostly)

    terminate_fiber(fiber_handle) = 72

Returns nan (fiber doesn't exists) or 0 (terminated).

    wait_role(role) = 73

Wait until any packet arrives from specified role.

    query_reg(role, code, timeout) = 74

    send_cmd(role, code) = 75

    query_idx_reg(role, code, string, timeout) = 76

    setup_pkt_buffer(size) = 77

    set_pkt(buffer, offset) = 78

Copy given string to packet buffer at given `offset`.
Same as `blit(pkt_buffer, offset, buffer, 0, null)`.

    now_ms: number = 79

Time since device restart in ms; time only advances when sleeping.

    str0eq(buffer, offset): bool = 11

    get_fiber_handle(func): fiber = 80

If `func == null` returns self-handle.
Otherwise, returns a handle or `null` if fiber with given function at the bottom is not currently running.

    pkt_size(): number = 81

    pkt_ev_code(): number = 82

    pkt_reg_get_code(): number = 20

    pkt_report_code(): number = 23

    pkt_command_code(): number = 16

    fun pkt_buffer(): buffer = 42

Return reference to "buffer" with the packet data.


## Format Constants

    img_version = 0x01_04_0000
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
    first_builtin_function = 50000
    max_args_short_call = 8

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

## Enum: FunctionFlag

    needs_this = 0x01

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

## Enum: BuiltIn_Object

    Math = 0
    Object = 1
    Object_prototype = 2
    Array = 3
    Array_prototype = 3
    Buffer = 4
    Buffer_prototype = 5
    String = 6
    String_prototype = 7
    Number = 8
    Number_prototype = 9
    Fiber = 10
    Fiber_prototype = 11
    Role = 12
    Role_prototype = 13
    Function = 14
    Function_prototype = 15
    Boolean = 16
    Boolean_prototype = 17
    DeviceScript = 18

## Enum: BuiltIn_String

    _empty = 0
    MInfinity = 1 // -Infinity
    DeviceScript = 2
    E = 3
    Infinity = 4
    LN10 = 5
    LN2 = 6
    LOG10E = 7
    LOG2E = 8
    NaN = 9
    PI = 10
    SQRT1_2 = 11
    SQRT2 = 12
    abs = 13
    alloc = 14
    array = 15
    blitAt = 16
    boolean = 17
    buffer = 18
    cbrt = 19
    ceil = 20
    charCodeAt = 21
    clamp = 22
    exp = 23
    false = 24
    fillAt = 25
    floor = 26
    forEach = 27
    function = 28
    getAt = 29
    idiv = 30
    imul = 31
    isConnected = 32
    join = 33
    length = 34
    log = 35
    log10 = 36
    log2 = 37
    map = 38
    max = 39
    min = 40
    next = 41
    null = 42
    number = 43
    onChange = 44
    onConnected = 45
    onDisconnected = 46
    packet = 47
    panic = 48
    pop = 49
    pow = 50
    prev = 51
    prototype = 52
    push = 53
    random = 54
    randomInt = 55
    read = 56
    reboot = 57
    round = 58
    setAt = 59
    setLength = 60
    shift = 61
    signal = 62
    slice = 63
    splice = 64
    sqrt = 65
    string = 66
    subscribe = 67
    toString = 68
    true = 69
    undefined = 70
    unshift = 71
    wait = 72
    write = 73

    sleepMs = 74
    imod = 75
    format = 76
    insert = 77
    start = 78
    cloud = 79
    main = 80
    charAt = 81
    object = 82
    parseInt = 83
    parseFloat = 84
    assign = 85
    keys = 86
    values = 87