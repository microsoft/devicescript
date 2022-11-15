---
sidebar_position: 9
---

# Top level functions

## Time

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

## Math

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
* `Math.idiv` (integer division)
* `Math.imul` (integer multiplication)
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

## Misc functions

The `panic()` function takes a numeric error code and terminates or restarts the program.
`reboot()` is similar, but doesn't print error message.

```js
panic(348)
reboot()
```
