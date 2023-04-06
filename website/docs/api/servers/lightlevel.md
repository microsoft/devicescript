---
description: Mounts a light level sensor
title: Light Level
---

# Soil Moisture

The [LightLevel](/api/clients/lightlevel) constructor takes a configuration to start a [light level server](https://microsoft.github.io/jacdac-docs/services/lightlevel) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, LightLevel } from "@devicescript/core"

const sensor = new LightLevel({
    pin: gpio(3),
})
sensor.lightLevel.subscribe(light => console.data({ light }))
```
