---
sidebar_position: 1
---

# JavaScript subset


Global and local variables are supported (only `const` or `let`, no `var`).

All variables are numbers (64-bit IEEE floating point).
Numeric binary and unary expressions are supported.
Comparisons return `0.0` or `1.0` (in particular comparing anything to `NaN` returns `0.0`).
`0.0` and `NaN` are considered falsy.
TODO should compare with NaN return NaN?

```ts
const pot = roles.potentiometer()
let x, y
x = pot.reading.read()
if (x < 0.3) {
    y = x * 3
} else {
    y = -x / 7
}
```


Some builtin functions only take literal arguments (especially strings, and time values).

The only jump statement supported is currently `return`.
Only `while` loop is supported.

## Logging and format strings

The `console.log()` takes zero or more arguments, each of which is a string or a number.
Compiler internally constructs a format string (see below).

```ts
console.log("Hello world")
console.log("X is", x, "and Y is", y)
console.log("X=", x, "Y=", y)
```

The compiler is smart about adding spaces (the second and third examples will print `X is 7 and Y is 12`
and `X=7 Y=12`).

You can also use the `format()` function directly, either with `console.log()` or
when setting string registers.
Arguments are `{0}`, `{1}`, ..., `{9}`, `{A}`, `{B}`, ..., `{F}`.
A second digit can be supplied to specify precision (though this doesn't work so well yet):

```ts
console.log(format("X is {0} and Y is {1}", x, y))
console.log(format("X = {04}", x))
charDisplay.message.write(format("X is {0}", x))
```