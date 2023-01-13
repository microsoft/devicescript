---
sidebar_position: 1
hide_table_of_contents: true
---

# Registers

The register client classes allow to read, write and track changes of [service registers](https://microsoft.github.io/jacdac-docs/reference/protocol/#registers).

The register classes are specialized for the data type of the register:

- `boolean`: `RegisterBool`
- `number`: `RegisterNumber`
- `string`: `RegisterString`
- `Buffer`: `RegisterBuffer`
- `number[]`: `RegisterArray`

Aside from the data type, there are 3 different type of access control on registers:

- `read only`: the value can be read, but not written.
- `read write`: the value can be read and written.
- `const`: the value of the register is constant. It may change on the next reset but this is not a common scenario.

## read

The `read` method gets the current reported value stored in the register.

```ts
const sensor = new ds.Temperature()
ds.every(1 /* s */, () => {
    const t = sensor.temperature.read()
    console.log(t)
})
```

## write

The `write` method sets the current value of the register and only applies to `read-write` registers.

```ts
const led = new ds.Led()

led.brightness.write(0.5)
```

## onChange (number)

The `onChange` method on `RegisterNumber` registers a callback to run when the register value changes more than a given `threshold`.

```ts
const sensor = new ds.Temperature()
sensor.temperature.onChange(2 /* deg celsius */, () => {
    const t = sensor.temperature.read()
    console.log(t)
})
```

## onChange (others)

The `onChange` method on all register classes, expect `number`, registers a callback to run when the register value changes.

```ts
const relay = new ds.Relay()
// ...
relay.active.onChange(() => {
    const value = relay.active.read()
    console.log(value)
})
```
