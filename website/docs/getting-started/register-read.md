---
sidebar_position: 4
hide_table_of_contents: true
---

# Register read

You can retrieve the current value of a register by calling `read`.
Internally, the client will handle all the necessary syncronization and communication with the sensor.

```ts no-build no-run
const pressure = sensor.pressure.read()
```

Let's modify the snippet by `read()ing` the `pressure` reading
and logging it to the console.

```ts
console.log("starting...")
const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    // read sensor reading
    const pressure = sensor.pressure.read()
    console.log(pressure)
})
```
