---
description: Mounts a soil moisture sensor
title: Soil Moisture
---

# Soil Moisture

The `startSoilMoisture` starts a simple analog sensor server that models a soil moisture sensor
and returns a [client](/api/clients/soilmoisture) bound to the server.

-   Please refer to the **[analog documentation](/developer/servers/analog/)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startSoilMoisture } from "@devicescript/servers"

const sensor = startSoilMoisture({
    pin: ds.gpio(3),
})
sensor.moisture.subscribe(moisture => console.data({ moisture }))
```
