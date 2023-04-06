---
description: Mounts a sound level sensor
title: Sound Level
---

# Sound Level

The [SoundLevel](/api/clients/soundlevel) constructor takes a configuration to start a [sound level server](https://microsoft.github.io/jacdac-docs/services/soundlevel) on the device.

-   Please refer to the **[analog documentation](./analog)** for details.

```ts
import { gpio, SoundLevel } from "@devicescript/core"

const sensor = new SoundLevel({
    pin: gpio(3),
})
sensor.soundLevel.subscribe(level => console.data({ level }))
```
