---
description: Mounts a HID joystick server
title: HID Joystick
---

# HID Joystick

The `startHidJoystick` function starts a [relay](https://microsoft.github.io/jacdac-docs/services/hidjoystick) server on the device
and returns a [client](/api/clients/hidjoystick).

```ts
import { startHidJoystick } from "@devicescript/servers"

const joystick = startHidJoystick({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `joystick`.

:::note

This feature is only available on [specific boards](/devices/peripherals/hid).

:::
