# Pico Pressure Button

In this guide, you'll use a Raspberry Pi Pico and a pressure sensor to create a mouse button actionable with the mouse.

:::tip
Don't worry about the necessary hardware yet, you can use DeviceScript simulator get started without it.
:::

## Roles

In DeviceScript, all access to sensors, actuators or other hardware components is abstracted through [Jacdac](https://aka.ms/jacdac) services.
To interact with Jacdac services, you define **roles** for each service you need.

In this scenario, we will need to measure air pressure and send HID mouse commands. Therefore, we declare a `airPressure` role and a `hidMouse` role.

```ts
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
```