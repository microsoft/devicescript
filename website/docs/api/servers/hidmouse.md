---
description: Mounts a HID mouse server
title: HID Mouse
---

# HID Mouse

The [HIDMouse](/api/clients/hidmouse) constructor takes a configuration to start a [HID mouse server](https://microsoft.github.io/jacdac-docs/services/hidmouse) on the device.

The server emulates a mouse and can be used to send mouse movement, wheel or clicksF to a computer.

```ts
import { HidMouse } from "@devicescript/core"

const mouse = new HidMouse({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `mouse`.

:::note

This feature is only available on [specific boards](/devices/periphericals/hid).

:::
