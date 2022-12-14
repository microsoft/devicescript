---
sidebar_position: 4
hide_table_of_contents: true
---

# Register read

We can modify the snippet by `read()ing` the `pressure` reading
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