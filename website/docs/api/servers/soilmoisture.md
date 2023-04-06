---
description: Mounts a soil moisture sensor
title: Soil Moisture
---

# Soil Moisture

The [SoilMoisture](/api/clients/soilmoisture) constructor takes a configuration to start a [soil moisture server](https://microsoft.github.io/jacdac-docs/services/soilmoisture) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, SoilMoisture } from "@devicescript/core"

const sensor = new SoilMoisture({
    pin: gpio(3),
})
sensor.moisture.subscribe(moisture => console.data({ moisture }))
```
