---
sidebar_position: 7
hide_table_of_contents: true
---

# User-defined functions

User-defined functions are allowed at the top-level, using `function foo(x, y) { ... }` syntax.
They are also allowed as event handlers using arrow syntax (see above).
Nested functions and real first-class functions are not supported.

Functions can return values.
A plain `return` is equivalent to `return NaN`.

Unused function are not compiled (and not checked for errors).

Function parameters are numbers by default.
A role can be also passed using syntax:

```ts
function beep(bz: BuzzerRole, len: number) {
    bz.playNote(440, 0.7, len)
}

const b = roles.buzzer()
beep(b, 10)
```

## Implementations of client commands

Commands can be marked as `client` in the spec.
These need to be implemented by assigning to properties of the `prototype` of the role.
For example:

```js
BuzzerRole.prototype.playNote = function (
    frequency: number,
    volume: number,
    duration: number
) {
    const p = 1000000 / frequency
    volume = clamp(0, volume, 1)
    this.playTone(p, p * volume * 0.5, duration)
}
```
