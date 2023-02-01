---
sidebar_position: 6
hide_table_of_contents: true
---

# Commands

Let's assume that `1400` hPa is a threshold high enough
to detect a user blowing on the sensor; then we
can add code to generate a mouse click.

`1400` is rater arbitrary and this is the kind of constants
that you will want to tune using the actual hardware sensors,
not just a simulator.

```ts skip no-run
if (pressure > 1400) {
    mouse.setButton(ds.HidMouseButton.Left, ds.HidMouseButtonEvent.Click)
}
```

The full sample looks like this.

```ts edit
console.log("starting...")
const sensor = new ds.AirPressure()
const mouse = new ds.HidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    // read sensor reading
    const pressure = sensor.pressure.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
        console.log(`click!`)
        mouse.setButton(ds.HidMouseButton.Left, ds.HidMouseButtonEvent.Click)
        // debouncing
        ds.sleepMs(50)
    }
})
```

We could do a much better job with debouncing but this
is not really the point of this sample.

:::note
Click `Edit` and try sliding the air pressure simulator left
and right to trigger clicks in the mouse simulator.
:::

