# Jacscript

Jacscript is a programming language for scripting [Jacdac](https://aka.ms/jacdac) services.

It has JavaScript-like syntax and is compiled to a custom VM bytecode, which can run in very constrained
environments (VM itself compiles to 10kB of code, with the floating point library and Jacdac SDK adding further 30kB).
The langauge is typically edited using [Block-based drag-and-drop interface](https://microsoft.github.io/jacdac-docs/editors/jacscript/).

This repository contains:
* [jacdac-c submodule](https://github.com/microsoft/jacdac-c), including sources for Jacdac client libraries and Jacscript VM
* `compiler/` - sources for Jacscript compiler
* `vm/` - glue files to build Jacscript VM as WASM module using [emscripten](https://emscripten.org/); `vm/dist/` contain pre-built files
* `samples/` - sample Jacscript programs
* `posix/` - implementation of Jacdac SDK HAL for grown-up POSIX-like operating systems (as opposed to embedded platforms)

## Usage

You can just use the devcontainer to build.

If you want to build locally, you need to [install emscripten](https://emscripten.org/docs/getting_started/downloads.html),
as well node.js, GNU Make and C compiler.

* start `jacdac devtools` (the npm version) and let is running
* open this folder in VSCode; use "Reopen in Container" if needed
* start Terminal in VSCode
* run `make` in terminal
* run `./built/jdcli 8082`

## Design goals for Jacscript VM

* secure - can predictably execute untrusted code (random bytes)
* easy to analyze - should be possible to statically determine the set of APIs used
* small memory (RAM) footprint
* small code (flash) footprint
* leave space for extensions in future

## JavaScript subset

Global and local variables are supported (only `var`, no `const` or `let`).

All variables are numbers (64-bit IEEE floating point).
Numeric binary and unary expressions are supported.
Comparisons return `0.0` or `1.0` (in particular comparing anything to `NaN` returns `0.0`).
`0.0` and `NaN` are considered falsy.
TODO should compare with NaN return NaN?

```js
var x, y
x = pot.reading.read()
if (x < 0.3) {
    y = x * 3
} else {
    y = -x / 7
}
```

Some builtin functions only take literal arguments (especially strings, and time values).

The only jump statement supported is currently `return`. There are no loops.

## Logging and format strings

The `console.log()` function takes a literal string, and optionally format arguments.

```js
console.log("Hello world")
console.log("X is {0} and Y is {1}", x, y)
```

Arguments are `{0}`, `{1}`, ..., `{9}`, `{A}`, `{B}`, ..., `{F}`.
A second digit can be supplied to specify precision (though this doesn't work so well yet):

```js
console.log("X = {04}", x)
```

Some functions that take string literals also accept `format()` function, using the same formatting strings as `console.log()`,
for example:

```js
charDisplay.message.write(format("X is {0}", x))
```

## Roles

Roles are defined by referencing a service name (in `roles` namespace).
The same role can be referenced multiple times, and runtime makes sure not to assign
multiple roles to the same service instance.

```js
var btnA = roles.button()
var btnB = roles.button()
var pot = roles.potentiometer()
var lamp = roles.lightBulb()
```

You can check if role is currently assigned, and react to it being assigned or unassigned:

```js
if (heater.isConnected())
    heater.active.write(1)
heater.onConnected(() => {
    // ...
})
heater.onDisconnected(() => {
    // ...
})
```

## Events

Events are referenced as `myRole.eventName`. They currently have two member functions, `.wait()` and `.subscribe()`.

```js
btnA.down.subscribe(() => {
    console.log("button down!")
})

// ...
btnA.up.wait()
// ...
```

## Handlers and Fibers

While handler registration (for events, register changes, device connect, etc.)
looks dynamic, it is implemented statically.
Thus handlers can be only registered at the top-level and un-conditionally.

Every handler runs in its own fiber (lightweight thread).
The scheduler is non-preemptive, meaning
a fiber executes without interruption until it returns or hits an asynchronous operation,
upon which point it's suspended.
Example async operations are `wait()` and register read.
Only one fiber executes at a time, while the other fibers are suspended.
This is similar to modern JavaScript, but there's no `await` keyword.

When the executor is woken up (typically due to an incoming packet or a timer expiring),
it will execute all viable fibers until they become suspended.
Executing a fiber may start another viable fiber, which would be also executed until suspension,
before any more packets are processed.

### Handler-pending model

At any given time, there is at most one fiber (which could be suspended) executing a given handler.
If this is not desired, `bg(() => { ... })` syntax can be used to queue code execution
in background, without limits of how many instances of it are running (TODO not impl yet).
If a handler is triggered again, while it is still executing, a boolean flag is set on it,
so that it starts again (once) after the current execution finishes.

## Registers

Registers are referenced as `myRole.regName`, where `regName` can also be the system-wide name,
so both `pot.position` and `pot.reading` will work.
TODO should we drop this, and only leave `pot.position` ?

Registers have following methods - `.onChange()`, `.read()` and `.write()`.
If register contains multiple fields, a tuple (array) is returned.

```js
var x
x = pot.position.read()
x = pot.reading.read() // equivalent

lamp.brightness.write(0.7)

var r, g, b
[r, g, b] = colorSensor.color.read()

myLed.color.write(0.3, 1, 0.7)
```

The `.onChange()` handler can be registered to execute whenever the value of the register changes
by at least the specified value.
It is executed once when the value is first determined, and then whenever the current value
is different by at least the specified value from the value at previous handler execution.

```js
pot.position.onChange(0.02, () => {
    lamp.brightness.write(pot.position.read())
})
```

## Cloud

Send a label + 0 or more numeric values.

```js
cloud.upload("potval", pot.reading.read())
cloud.upload("color", r * 256, g * 256, b * 256)
```

Respond to a request from the cloud.
Normally, status code 200 is returned to the cloud once the handler finishes.
If the method is not found, 404 is returned.
If the method is already running 429 is returned.

```js
cloud.onMethod("set_lights", (a, b) => {
    lightA.brightness.write(a)
    lightB.brightness.write(a)
})
cloud.onMethod("get_temp_hum", () => {
    return [temp.temperature.read(), hum.humidity.read()]
})
```

Get value of a twin field (has to be numeric):

```js
var speed = cloud.twin("speed")
var lightA = cloud.twin("lights.a")
```

Respond to changes in twin values:

```js
cloud.onTwinChange(() => {
    lightA.brightness.write(cloud.twin("lights.a"))
    lightB.brightness.write(cloud.twin("lights.b"))
})
```

## Top-level functions

### Time

Run a function periodically (`0.3s` in the example below; `20ms` minimum):
```js
every(0.3, () => {
    // ...
})
```

Wait given number of seconds:
```js
wait(0.3)
```

### Math

Arithmetic operators are supported: `+`, `-`, `*`, `/`, `**`, as well as unary `-` and `+`.

Comparison operators `<`, `<=`, `>`, `>=`, `==`, `===`, `!=`, `!==` are supported (and return doubles).

The operators `&&` and `||` are supported, and are properly lazy.
The boolean negation `!` is supported (returning `0` or `1`).

The bitwise operators are now supported: `|`, `&`, `^`, `~`, `<<`, `>>`, `>>>`.

The following math functions and constants are supported:
* `Math.floor`
* `Math.round`
* `Math.ceil`
* `Math.log`
* `Math.random`
* `Math.max`
* `Math.min`
* `Math.pow`
* `Math.sqrt`
* `Math.cbrt`
* `Math.exp`
* `Math.log10`
* `Math.log2`
* `Math.E`
* `Math.PI`
* `Math.LN10`
* `Math.LN2`
* `Math.LOG2E`
* `Math.LOG10E`
* `Math.SQRT1_2`
* `Math.SQRT2`
* `isNaN`
* `NaN`

All of the above should have the same semantics as JavaScript.

### Misc functions

The `panic()` function takes a numeric error code and terminates or restarts the program.
`reboot()` is similar, but doesn't print error message.

```js
panic(348)
reboot()
```

### User-defined functions

User-defined functions are allowed at the top-level, using `function foo(x, y) { ... }` syntax.
They are also allowed as event handlers using arrow syntax (see above).
Nested functions and real first-class functions are not supported.

Functions can return values.
A plain `return` is equivalent to `return NaN`.

## Random notes

### Memory usage analysis

Main dynamic memory usage - function activation records (and fibers).
* `BG_MAX1` call frames can be only allocated once
* whatever they call may need additional frames
* can collect all register gets and estimate memory for them (do we need a size limit on these?)


## TODO

* disallow top-level code?
* add opcode to cache current packet (in onChanged())
* extend format strings to include numfmt
* shift buffer opcode?
* somehow deal with events with legit args (button and barcode reader currently) - doesn't work so well in handler-pending model
* add `role.waitConnected()` or something?
* add `bg(() => { ... })`, also `bg1()` ?
* do fiber round-robin for yields?
* some testing framework? (depends on services?)

### Implementing services in jacscript

* this generally doesn't work with handler-pending model
* opcode to send current packet
* opcode to set the command
* opcode to set service number
* some way of building announce packets
* handler when a packet is received
* support 1 or more devices per VM instance?
* add `try_again` report in addition to `command_not_implemented` ?

### Cloud

* specific uploads: `hum.autoUpload(5, 1) // 5s, 1%`
* auto-upload of everything

### Debugger interface

* fiber list, locals, globals
* setting breakpoints - breakpoint instruction? (based on source code location)
* more "debug" info in compiled program - role names, etc for error messages?


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
