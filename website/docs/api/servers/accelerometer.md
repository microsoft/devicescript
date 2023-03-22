---
description: Mounts an accelerometer server
title: Accelerometer
---

# Accelerometer

The `startAccelerometer` function starts a [accelerometer](https://microsoft.github.io/jacdac-docs/services/accelerometer) server on the device
and returns a [client](/api/clients/accelerometer).

```ts
import { gpio } from "@devicescript/core"
import { startAccelerometer } from "@devicescript/servers"

const acc = startAccelerometer({})
```
