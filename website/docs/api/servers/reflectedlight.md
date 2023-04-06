---
description: Mounts a reflected light sensor
title: Reflected Light
---

# Reflected Light

The [ReflectedLight](/api/clients/reflectedlight) constructor takes a configuration to start a [reflected light server](https://microsoft.github.io/jacdac-docs/services/reflectedlight) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, ReflectedLight } from "@devicescript/core"

const sensor = new ReflectedLight({
    pin: gpio(3),
})
sensor.brightness.subscribe(brightness => console.data({ brightness }))
```
