---
description: Mounts a servo
title: Servo
---

# Servo

The `startServo` function starts on-board server for servo,
and returns a [client](/api/clients/servo) bound to the server.

```ts
import { gpio, delay } from "@devicescript/core"
import { startServo } from "@devicescript/servers"

const sensor = startServo({
    pin: ds.gpio(3),
})
setInterval(async () => {
    await sensor.angle.write(-45)
    await delay(1000)
    await sensor.angle.write(45)
}, 1000)
```
