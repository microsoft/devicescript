---
description: Mounts a water level sensor
title: Water Level
---

# Water

The `startWaterLevel` starts a simple analog sensor server that models a water level sensor
and returns a [client](/api/clients/waterlevel) bound to the server.

-   Please refer to the **[analog documentation](/developer/servers/analog/)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startWaterLevel } from "@devicescript/servers"

const sensor = startWaterLevel({
    pin: ds.gpio(3),
})
sensor.reading.subscribe(level => console.data({ level }))
```
