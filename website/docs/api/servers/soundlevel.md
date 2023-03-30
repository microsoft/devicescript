---
description: Mounts a sound level sensor
title: Sound Level
---

# Soil Moisture

The `startSoundLevel` starts a simple analog sensor server that models a sound level sensor
and returns a [client](/api/clients/soundlevel) bound to the server.

- Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio } from "@devicescript/core"
import { startSoundLevel } from "@devicescript/servers"

const sensor = startSoundLevel({
    pin: ds.gpio(3),
})
sensor.soundLevel.subscribe(level => console.data({ level }))
```
