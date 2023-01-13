---
sidebar_position: 3
hide_table_of_contents: true
---

# Register changes

The `sensor` client exposes `pressure` register object.
We can read the register value to retrieve the air pressure
sensor last reading. As mentioned in the Jacdac docs,
the reading is in `hPa` and should be around 1000.

To track pressure changes, we register a callback that triggers when the pressure reading changes by `10` hPa.

```ts
console.log("starting...")
const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    console.log("pressure changed")
})
```

:::note
If you run this code in the developer tools and modify
the air pressure, you should see the callback being invoked
in the console output.
:::
