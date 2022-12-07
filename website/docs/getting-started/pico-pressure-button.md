# Pico Pressure Button

In this guide, you'll use a Raspberry Pi Pico and a pressure sensor to create a mouse button actionable with the mouse.

## Try DeviceScript

You do not need hardware or install any tools to try out DeviceScript. Try editing this sandbox and press `Run`!

```ts
every(1, () => {
    console.log(`hello`)
})
```

## Roles

In DeviceScript, all access to sensors, actuators or other hardware components is abstracted through [Jacdac](https://aka.ms/jacdac) services.
To interact with Jacdac services, you define **roles** for each service you need.

In this scenario, we will need to measure air pressure and send HID mouse commands. Therefore, we declare a `airPressure` role and a `hidMouse` role.

```ts
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
```