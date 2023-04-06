---
description: Mounts a water level sensor
title: Water Level
---

# Water Level

The [WaterLevel](/api/clients/waterlevel) constructor takes a configuration to start a [water level server](https://microsoft.github.io/jacdac-docs/services/waterlevel) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, WaterLevel } from "@devicescript/core"

const sensor = new WaterLevel({
    pin: gpio(3),
})
sensor.level.subscribe(level => console.data({ level }))
```
