---
description: Mounts a HID joystick server
title: HID Joystick
---

# HID Joystick

The [HIDJoystick](/api/clients/hidjoystick) constructor takes a configuration to start a [HID joystick server](https://microsoft.github.io/jacdac-docs/services/hidjoystick) on the device.

```ts
import { HidJoystick } from "@devicescript/core"

const joystick = new HidJoystick({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `joystick`.

:::note

This feature is only available on [specific boards](/devices/periphericals/hid).

:::
