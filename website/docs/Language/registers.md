---
sidebar_position: 4
hide_table_of_contents: true
---

# Registers

Registers are referenced as `myRole.regName`, where `regName` can also be the system-wide name,
so both `pot.position` and `pot.reading` will work.
TODO should we drop this, and only leave `pot.position` ?

Registers have following methods - `.onChange()`, `.read()` and `.write()`.
If register contains multiple fields, a tuple (array) is returned.

```ts ignore-errors
const pot = new ds.Potentiometer()
const lamp = new ds.Led()
const colorSensor = new ds.Color()
let x = pot.position.read()

lamp.brightness.write(0.7)

const [r, g, b] = colorSensor.color.read()

// myLed.color.write(0.3, 1, 0.7)
```

The `.onChange()` handler can be registered to execute whenever the value of the register changes
by at least the specified value.
It is executed once when the value is first determined, and then whenever the current value
is different by at least the specified value from the value at previous handler execution.

```ts
const lamp = new ds.Led()
const pot = new ds.Potentiometer()
pot.position.onChange(0.02, () => {
    lamp.brightness.write(pot.position.read())
})
```