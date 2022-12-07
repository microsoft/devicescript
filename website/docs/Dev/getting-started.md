---
sidebar_position: 2
hide_table_of_contents: true
---

# Getting Started

In this guide, you'll use a Raspberry Pi Pico and a pressure sensor to create a mouse button actionable with the mouse.

'''hint
Tag along this guide even if you do not have hardware
available, DeviceScript provides 
web-based simulators and editors.
'''

## Defining Roles

In DeviceScript, all access to sensors, actuators or other hardware components is abstracted through [Jacdac](https://aka.ms/jacdac) services.
To interact with Jacdac services, you define **roles** for each service you need.

In this scenario, we will need to measure air pressure and send HID mouse commands. Therefore, we declare a `airPressure` role and a `hidMouse` role.

```ts
const sensor = roles.airPressure()
const mouse = roles.hidMouse()
```

