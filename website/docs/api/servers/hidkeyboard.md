---
description: Mounts a HID keyboard server
title: HID Keyboard
---

# HID Keyboard

The [HIDKeyboard](/api/clients/hidkeyboard) constructor takes a configuration to start a [HID keyboard server](https://microsoft.github.io/jacdac-docs/services/hidkeyboard) on the device.

The server emulates a keyboard and can be used to send keystrokes to a computer.

```ts
import { HidKeyboard } from "@devicescript/core"

const keyboard = new HidKeyboard({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `keyboard`.

:::note

This feature is only available on [specific boards](/devices/periphericals/hid).

:::
