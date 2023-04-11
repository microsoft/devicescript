---
description: Mounts a HID mouse server
title: HID Mouse
---

# HID Mouse

The `startHidMouse` function starts a [relay](https://microsoft.github.io/jacdac-docs/services/hidmouse) server on the device
and returns a [client](/api/clients/hidmouse).

The server emulates a mouse and can be used to send mouse movement, wheel or clicksF to a computer.

```ts
import { startHidMouse } from "@devicescript/servers"

const mouse = startHidMouse({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `mouse`.

:::note

This feature is only available on [specific boards](/devices/peripherals/hid).

:::
