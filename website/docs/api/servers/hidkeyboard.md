---
description: Mounts a HID keyboard server
title: HID Keyboard
---

# HID Keyboard

The `startHidKeyboard` function starts a [relay](https://microsoft.github.io/jacdac-docs/services/hidkeyboard) server on the device
and returns a [client](/api/clients/hidkeyboard).

The server emulates a keyboard and can be used to send keystrokes to a computer.

```ts
import { startHidKeyboard } from "@devicescript/servers"

const keyboard = startHidKeyboard({})
```

The [service instance name](https://microsoft.github.io/jacdac-docs/services/_base/) is automatically set to the variable name. In this example, it is set to `keyboard`.

:::note

This feature is only available on [specific boards](/devices/hw).

:::
