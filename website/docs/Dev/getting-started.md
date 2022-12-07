---
sidebar_position: 2
hide_table_of_contents: true
---

# Getting Started

In this guide, you'll use a Raspberry Pi Pico and a pressure sensor to create a mouse button actionable with the mouse.

## Part 1: Creating the firmware

At a high level, we want the script to generate a mouse click whenever we detect a peak in air pressure.

You can tag along in this documentation page and use the interactive code snippets; or you can use the [command line interface](/dev/cli) to get a local development setup within minutes.

:::tip
Tag along this part of the guide even if you do not have hardware
available, DeviceScript provides web-based simulators and editors.
:::

### Console output

DeviceScript supports basic `console` functionality
which allows you to add logging to your script.

```ts
console.log(`starting...`)
```

:::note
Click on `Run` to load code snippets into the DeviceScript
developer tools.
By default, the snippet will run in a virtual DeviceScript virtual machine (running in the browser), we'll see later how to run on hardware.
:::

### Defining Roles

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

### Tracking pressure changes

To track pressure changes, we register a callback

```ts
console.log("starting...")
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
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

### Reading the pressure

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
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    const pressure = sensor.pressure.read()
    console.log(pressure)
})
```

### Testing for high pressure

Let's assume that `1400` hPa is a thresold high enough
to detect a user blowing on the sensor; then we
can add code in the `onChange` handler to generate a mouse click.

`1400` is rater arbitrary and this is the kind of constants
that you will want to tune using the actual hardware sensors,
not just a simulator.

```ts
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
// listen for pressure changes
sensor.pressure.onChange(10, () => {
    const pressure = sensor.pressure.read()
    console.log(pressure)
    // user blows in straw
    if (pressure > 1400) {
        // click!
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

## Part 2: Working with hardware

For this part of the guide, we will be using the following components:

-   a [Raspberry Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) board,
-   a [Adafruit PiCowbell Proto for Pico](https://www.adafruit.com/product/5200)
-   a [Adafruit LPS25 Pressure Sensor](https://www.adafruit.com/product/4530)

### Updating the Pico

The first step is to upload the DeviceScript Virtual Macine
firmware on the Raspberry Pi Pico.
Navigate to https://github.com/microsoft/jacdac-pico/releases and drop the `.uf2` on your Pico bootloader drive.

### Connecting the Pico

Once the UF2 is copied and the Pico restarted,

-   open the DeviceScript developer tools (click `Run`)
-   click `Connect`
-   click `Connect USB`
-   select `Raspberry Pico` in the system menu listing devices

After connecting, you should see a new chip under the `DeviceScript` section with the image of the Raspberry Pico.

### Connecting the pressure sensor

We use a Adafruit PiCowbell for convinience to easily connect
STEMMA sensors. Solders headers to your Pico and mount it
on the PiCowbell.

Connect the Adafruit pressure sensor and reset the Pico
so that it gets detected. When the DeviceScript VM starts,
it scans the I2C bus (STEMMA QT) for known sensors and automatically mount Jacdac servers for them. This is what
happens with the pressure sensor and it should now show up
in the developer tools window.

### Uploading DeviceScript bytecode

Click on the chip to start flasing the DeviceScript bytecode
to your Raspberry Pico. It will automatically reflash when it detects changes.
