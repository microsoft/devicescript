---
sidebar_position: 2
hide_table_of_contents: true
---

# Getting Started

In this guide, you'll use a Raspberry Pi Pico and a pressure sensor to create a mouse button actionable with the mouse.

At a high level, we want the script to generate a mouse click whenever we detect a peak in air pressure.

:::hint
Tag along this guide even if you do not have hardware
available, DeviceScript provides web-based simulators and editors.
:::

## Console output

DeviceScript supports basic `console` functionality
which allows you to add logging to your script.

```ts
console.log(`starting...`)
```

:::note
Click on `Run` to load code snippets into the DeviceScript
developer tools.
:::

## Defining Roles

In DeviceScript, all access to sensors, actuators or other hardware components is abstracted through [Jacdac](https://aka.ms/jacdac) services.
To interact with Jacdac services, you define **roles** for each service you need.

In this scenario, we will need to measure air pressure and send HID mouse commands. Therefore, we declare a `airPressure` role and a `hidMouse` role.

```ts
console.log(`starting...`)
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
```

:::note
After click the `Run` button, click on the
`Start simulators` icon to create a virtual air pressure
and HID mouse service.
:::

## Tracking pressure changes

To track pressure changes, we register a callback

```ts
console.log("starting...")
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
sensor.pressure.onChange(10, () => {
    console.log("pressure changed")
})
```

:::note
If you run this code in the developer tools and modify
the air pressure, you should see the callback being invoked
in the console output.
:::

## Reading the pressure

The `sensor` client exposes `pressure` register object.
We can read the register value to retreive the air pressure
sensor last reading. As mentionned in the Jacdac docs,
the reading is in `hPa` and should be around 1000.

We can modify the snippet to print the `pressure` reading
to the console.

```ts
console.log("starting...")
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
sensor.pressure.onChange(10, () => {
    const pressure = sensor.pressure.read()
    console.log(pressure)
})
```

## Testing for high pressure

Let's assume that `1400` hPa is a thresold high enough
to detect a user blowing on the sensor; then we
can add code in the `onChange` handler to generate a mouse click.

`1400` is rater arbitrary and this is the kind of constants
that you will want to tune using the actual hardware sensors,
not just a simulator.

```ts
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
sensor.pressure.onChange(10, () => {
    const pressure = sensor.pressure.read()
    console.log(pressure)
    if (pressure > 1400) {
        mouse.setButton(HidMouseButton.Left, HidMouseButtonEvent.Click)
        // debouncing
        wait(0.05)
    }
})
```

We could do a much better job with debouncing but this
is not really the point of this sample.

:::note
Click `Run` and try sliding the air pressure simulator left
and right to trigger clicks in the mouse simulator.
:::
