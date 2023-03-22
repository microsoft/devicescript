---
description: Mounts a power server
title: Power
---

# Power

The `startPower` function starts a [power](https://microsoft.github.io/jacdac-docs/services/power) server on the device
and returns a [client](/api/clients/power).

```ts
import { gpio } from "@devicescript/core"
import { startPower } from "@devicescript/servers"

const power = startPower({
    pinFault: gpio(2),
    pinEn: gpio(3),
})
```
