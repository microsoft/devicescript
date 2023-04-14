---
description: Mounts a light level sensor
title: Light Level
---

# Light Level

The `startLightLevel` starts a simple analog sensor server that models a light level sensor
and returns a [client](/api/clients/lightlevel) bound to the server.

- Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startLightLevel } from "@devicescript/servers"

const sensor = startLightLevel({
    pin: ds.gpio(3),
})
sensor.lightLevel.subscribe(light => console.data({ light }))
```
