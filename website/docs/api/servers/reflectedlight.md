---
description: Mounts a reflected light sensor
title: Reflected Light
---

# Reflected Light

The `startReflectedLight` starts a simple analog sensor server that models a reflected light sensor
and returns a [client](/api/clients/reflectedlight) bound to the server.

-   Please refer to the **[analog documentation](/developer/drivers/analog/)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startReflectedLight } from "@devicescript/servers"

const sensor = startReflectedLight({
    pin: ds.gpio(3),
})
sensor.reading.subscribe(brightness => console.data({ brightness }))
```
