---
sidebar_position: 1
---

# Registers

The register client classe (`Register<T>`) allow to read, write and track changes of [service registers](https://microsoft.github.io/jacdac-docs/reference/protocol/#registers).

Aside from the data type, there are 3 different type of access control on registers:

-   `read only`: the value can be read, but not written.
-   `read write`: the value can be read and written.
-   `const`: the value of the register is constant. It may change on the next reset but this is not a common scenario.

## read

The `read` method gets the current reported value stored in the register.

```ts
const sensor = new ds.Temperature()
setInterval(async () => {
    const t = await sensor.reading.read()
    console.log(t)
}, 1000)
```

## write

The `write` method sets the current value of the register and only applies to `read-write` registers.

```ts
const led = new ds.Led()

await led.intensity.write(0.5)
```

## subscribe

The `subscribe` method registers a callback that gets raised whenever a value update arrives.

```ts
const sensor = new ds.Temperature()
sensor.reading.subscribe(value => {
    console.log(value)
})
```

The `subscribe` method returns an **unsubscribe** function that allows to remove the callback.

```ts
const sensor = new ds.Temperature()
const unsubscribe = sensor.reading.subscribe(value => {
    console.log(value)
})

// later on
unsubscribe()
```
