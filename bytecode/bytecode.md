# DeviceScript bytecode spec

This file documents bytecode format for DeviceScript.
A [C header file](https://github.com/microsoft/devicescript/blob/main/runtime/devicescript/devs_bytecode.h)
and a [TypeScript file](https://github.com/microsoft/devicescript/blob/main/compiler/src/bytecode.ts) are generated from it.
Additional structures are defined in [devs_format.h](https://github.com/microsoft/devicescript/blob/main/runtime/devicescript/devs_format.h).

A DeviceScript bytecode file contains magic and version numbers followed by a number of binary sections
defining functions, various literals (floats, ASCII strings, Unicode strings, buffers),
Jacdac service specifications, and runtime configuration (`configureHardware()` and built-in servers).

Functions are sequences of opcodes defined below.
Opcodes are divided into expressions (with return type) which do not modify state,
and statements (no return type; `ret_val()` expression is used to retrieve the logical
result of a last statement).
Many opcodes (both expressions and statements) can also throw an exception.

For a more highlevel description of runtime and bytecode, see [Runtime implementation page](/language/runtime).

## Format Constants

    img_version_major = 2
    img_version_minor = 16
    img_version_patch = 3
    img_version = $version
    magic0 = 0x53766544 // "DevS"
    magic1 = 0xf1296e0a
    num_img_sections = 10
    fix_header_size = 32
    section_header_size = 8
    function_header_size = 16
    ascii_header_size = 2
    utf8_header_size = 4
    utf8_table_shift = 4
    binary_size_align = 32
    max_stack_depth = 16
    max_call_depth = 100
    direct_const_op = 0x80
    direct_const_offset = 16
    first_multibyte_int = 0xf8
    first_non_opcode = 0x10000
    first_builtin_function = 50000
    max_args_short_call = 8
    service_spec_header_size = 16
    service_spec_packet_size = 8
    service_spec_field_size = 4
    role_bits = 15

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

    call_array(func, args) = 79                        // CALL func(...args)

Passes arguments to a function as an array. The array can be at most `max_stack_depth - 1` elements long.

    final return(value) = 12

    final jmp(*jmpoffset) = 13                // JMP jmpoffset

    jmp_z(*jmpoffset, x) = 14                 // JMP jmpoffset IF NOT x

Jump if condition is false.

    jmp_ret_val_z(*jmpoffset) = 78            // JMP jmpoffset IF ret_val is nullish

Used in compilation of `?.`.

    try(*jmpoffset) = 80                // TRY jmpoffset

Start try-catch block - catch/finally handler is at the jmpoffset.

    final end_try(*jmpoffset) = 81

Try block has to end with this. jmpoffset is for continuation code.

    catch() = 82

Has to be the first opcode in the catch handler. Causes error elsewhere.
If value throw is JMP rethrows immediately.

    finally() = 83

Has to be the first opcode in the finally handler.
Finally block should be followed by storing exception value in a local
and finish with `re_throw` of the exception.
`retval` set to `null` when block executed not due to an exception.

    final throw(value) = 84

Throw an exception.

    final re_throw(value) = 85

Throw an exception without setting the `__stack__` field.
Does nothing if `value` is `null`.

    final throw_jmp(*jmpoffset, level) = 86

Jump to given offset popping `level` try blocks, activating the finally blocks on the way.

    debugger() = 87

Trigger breakpoint when debugger connected. No-op otherwise.

### Variables

    store_local(*local_idx, value) = 17      // local_idx := value

    store_global(*global_idx, value) = 18    // global_idx := value

    store_buffer(buffer, numfmt, offset, value) = 19

    load_local(*local_idx): any = 21

    load_global(*global_idx): any = 22

    store_closure(*local_clo_idx, levels, value) = 73

    load_closure(*local_clo_idx, levels): any = 74

    make_closure(*func_idx): function = 75    // CLOSURE(func_idx)

    store_ret_val(x) = 93                     // ret_val := x

### Field access

    index(object, idx): any = 24              // object[idx]

Read named field or sequence member (depending on type of idx).

    index_set(object, index, value) = 25         // object[index] := value

Write named field or sequence member (depending on type of idx).

    index_delete(object, index) = 11              // delete object[index]

Remove a named field from an object.

    builtin_field(*builtin_idx, obj): any = 26  // {swap}obj.builtin_idx

Shorthand to `index(obj, static_builtin_string(builtin_idx))`

    ascii_field(*ascii_idx, obj): any = 27      // {swap}obj.ascii_idx

Shorthand to `index(obj, static_ascii_string(ascii_idx))`

    utf8_field(*utf8_idx, obj): any = 28        // {swap}obj.utf8_idx

Shorthand to `index(obj, static_utf8_string(utf8_idx))`

    fun math_field(*builtin_idx): any = 29      // Math.builtin_idx

    fun ds_field(*builtin_idx): any = 30        // ds.builtin_idx

    fun object_field(*builtin_idx): any = 16    // Object.builtin_idx

    fun new(func): function = 88                // new func

    fun bind(func, obj): function = 15          // func.bind(obj)

### Objects

    alloc_map() = 31

    alloc_array(initial_size) = 32

    alloc_buffer(size) = 33

### Statics

    fun static_spec_proto(*spec_idx): any = 34  // spec_idx.prototype

    fun static_buffer(*buffer_idx): buffer = 35

    fun static_builtin_string(*builtin_idx): string = 36

    fun static_ascii_string(*ascii_idx): string = 37

    fun static_utf8_string(*utf8_idx): string = 38

    fun static_function(*func_idx): function = 39

    fun static_spec(*spec_idx): any = 94

    fun literal(*value): number = 40

    fun literal_f64(*f64_idx): number = 41

    fun builtin_object(*builtin_object): number = 1

### Misc

    removed_42() = 42

    load_buffer(buffer, numfmt, offset): number = 43

    ret_val(): any = 44

Return value of query register, call, etc.

    fun typeof(object): number = 45

Returns `Object_Type` enum.

    fun typeof_str(object): number = 76

Returns JS-compatible string.

    fun undefined(): null = 46  // undefined

Returns `undefined` value.

    fun null(): null = 90        // null

Returns `null` value.

    fun is_undefined(x): bool = 47

Check if object is exactly `undefined`.

    fun instance_of(obj, cls): bool = 89

Check if `obj` has `cls.prototype` in its prototype chain.

    fun is_nullish(x): bool = 72

Check if value is precisely `null` or `undefined`.

### Booleans

    fun true(): bool = 48

    fun false(): bool = 49

    fun to_bool(x): bool = 50   // !!x

### Math operations

    fun nan(): number = 51

    fun inf(): number = 20

    fun abs(x): number = 52

    fun bit_not(x): number = 53   // ~x

    fun is_nan(x): bool = 54

    fun neg(x): number = 55   // -x

    fun uplus(x): number = 23  // +x

    fun not(x): bool = 56   // !x

    fun to_int(x): number = 57

Same as `x | 0`.

    fun add(x, y): number = 58     // x + y

Note that this also works on strings, etc.

    fun sub(x, y): number = 59     // x - y

    fun mul(x, y): number = 60     // x * y

    fun div(x, y): number = 61     // x / y

    fun bit_and(x, y): number = 62 // x & y

    fun bit_or(x, y): number = 63  // x | y

    fun bit_xor(x, y): number = 64 // x ^ y

    fun shift_left(x, y): number = 65      // x << y

    fun shift_right(x, y): number = 66      // x >> y

    fun shift_right_unsigned(x, y): number = 67      // x >>> y

    fun eq(x, y): bool = 68      // x === y

    fun le(x, y): bool = 69      // x <= y

    fun lt(x, y): bool = 70      // x < y

    fun ne(x, y): bool = 71      // x !== y

    fun approx_eq(x, y): bool = 91  // x == y

    fun approx_ne(x, y): bool = 92  // x != y

### To be removed (soon)

    removed_77() = 77

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
    is_stateless = 0x40  // fun modifier - only valid when !is_stmt
    is_final_stmt = 0x40 // final modifier - only valid when is_stmt

## Enum: FunctionFlag

    needs_this = 0x01
    is_ctor = 0x02
    has_rest_arg = 0x04

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
    Special = 0b1100

## Enum: NumFmt_Special

    empty = 0
    bytes = 1
    string = 2
    string0 = 3
    bool = 4
    pipe = 5
    pipe_port = 6

## Enum: PacketSpec_Code

    register = 0x1000
    event = 0x8000
    command = 0x0000
    report = 0x2000
    MASK = 0xf000

## Enum: ServiceSpec_Flag

    derive_mask = 0x000f
    derive_base = 0x0000
    derive_sensor = 0x0001
    derive_last = 0x0001

## Enum: PacketSpec_Flag

    multi_field = 0x01

## Enum: FieldSpec_Flag

    is_bytes = 0x01
    starts_repeats = 0x02

## Enum: Object_Type

    undefined = 0

Only the `undefined` value.

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

    packet = 10

    exotic = 11

    null = 12

    image = 13

### Object_Types only used in static type info

    any = 14

    void = 15

## Enum: BuiltIn_Object

    Math = 0
    Object = 1
    Object_prototype = 2
    Array = 3
    Array_prototype = 4
    Buffer = 5
    Buffer_prototype = 6
    String = 7
    String_prototype = 8
    Number = 9
    Number_prototype = 10
    DsFiber = 11
    DsFiber_prototype = 12
    DsRole = 13
    DsRole_prototype = 14
    Function = 15
    Function_prototype = 16
    Boolean = 17
    Boolean_prototype = 18
    DsPacket = 19
    DsPacket_prototype = 20
    DeviceScript = 21
    DsPacketInfo_prototype = 22
    DsRegister_prototype = 23
    DsCommand_prototype = 24
    DsEvent_prototype = 25
    DsReport_prototype = 26
    Error = 27
    Error_prototype = 28
    TypeError = 29
    TypeError_prototype = 30
    RangeError = 31
    RangeError_prototype = 32
    SyntaxError = 33
    SyntaxError_prototype = 34
    JSON = 35
    DsServiceSpec = 36
    DsServiceSpec_prototype = 37
    DsPacketSpec = 38
    DsPacketSpec_prototype = 39
    Image = 40
    Image_prototype = 41
    GPIO = 42
    GPIO_prototype = 43

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
    isBound = 32
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
    _panic = 48
    pop = 49
    pow = 50
    prev = 51
    prototype = 52
    push = 53
    random = 54
    randomInt = 55
    read = 56
    restart = 57
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

    sleep = 74
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
    __func__ = 88
    role = 89
    deviceIdentifier = 90
    shortId = 91
    serviceIndex = 92
    serviceCommand = 93
    payload = 94
    decode = 95
    encode = 96
    _onPacket = 97
    code = 98
    name = 99
    isEvent = 100
    eventCode = 101
    isRegSet = 102
    isRegGet = 103
    regCode = 104
    flags = 105
    isReport = 106
    isCommand = 107
    isArray = 108
    inline = 109
    assert = 110
    pushRange = 111
    sendCommand = 112
    __stack__ = 113
    Error = 114
    TypeError = 115
    RangeError = 116
    stack = 117
    message = 118
    cause = 119
    __new__ = 120
    setPrototypeOf = 121
    getPrototypeOf = 122
    constructor = 123
    __proto__ = 124
    _logRepr = 125
    print = 126
    everyMs = 127
    setInterval = 128
    setTimeout = 129
    clearInterval = 130
    clearTimeout = 131
    SyntaxError = 132
    JSON = 133
    parse = 134
    stringify = 135
    _dcfgString = 136
    isSimulator = 137
    _Role = 138 // Role
    Fiber = 139
    suspend = 140
    resume = 141
    terminate = 142
    self = 143
    current = 144
    id = 145
    _commandResponse = 146
    isAction = 147
    millis = 148
    from = 149
    hex = 150
    utf8 = 151
    utf_8 = 152 // utf-8
    suspended = 153
    reboot = 154
    server = 155
    spec = 156
    ServiceSpec = 157
    classIdentifier = 158
    lookup = 159
    PacketSpec = 160
    parent = 161
    response = 162
    ServerInterface = 163
    _onServerPacket = 164
    _serverSend = 165
    notImplemented = 166
    delay = 167
    fromCharCode = 168
    _allocRole = 169
    spiConfigure = 170
    spiXfer = 171
    _socketOpen = 172
    _socketClose = 173
    _socketWrite = 174
    _socketOnEvent = 175
    open = 176
    close = 177
    error_ = 178 // error
    data = 179
    toUpperCase = 180
    toLowerCase = 181
    indexOf = 182
    byteLength = 183
    Image = 184
    width = 185
    height = 186
    bpp = 187
    get = 188
    clone = 189
    set = 190
    fill = 191
    flipX = 192
    flipY = 193
    transposed = 194
    drawImage = 195
    drawTransparentImage = 196
    overlapsWith = 197
    fillRect = 198
    drawLine = 199
    equals = 200
    isReadOnly = 201
    fillCircle = 202
    blitRow = 203
    blit = 204
    _i2cTransaction = 205
    _twinMessage = 206
    spiSendImage = 207
    gpio = 208
    label = 209
    mode = 210
    capabilities = 211
    value = 212
    setMode = 213
    fillRandom = 214
    encrypt = 215
    decrypt = 216
    digest = 217
    ledStripSend = 218
    rotate = 219
    register = 220
    event = 221
    action = 222
    report = 223
    type = 224
    byCode = 225