---
description: Mounts a motion detector
title: Motion Detector
---

# Motion detector

The `startMotion` function starts on-board server for Motion,
and returns a [client](/api/clients/motion) bound to the server.

This is typically used with a PIR-based motion detectors, that just output the debounced motion
reading as high-level on a given pin. Typical hardware includes: `AM312`, `SR602`.

```ts
import { gpio } from "@devicescript/core"
import { startMotion } from "@devicescript/servers"

const sensor = startMotion({
    pin: ds.gpio(3),
})
sensor.reading.subscribe(moving => console.data({ moving }))
```
