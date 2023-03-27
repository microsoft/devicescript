---
description: Mounts a buzzer (sounder) server
title: Buzzer
---

# Buzzer

The `startBuzzer` function starts a [buzzer](https://microsoft.github.io/jacdac-docs/services/buzzer) server on the device
and returns a [client](/api/clients/buzzer).

```ts
import { gpio } from "@devicescript/core"
import { startBuzzer } from "@devicescript/servers"

const speaker = startBuzzer({
    pin: gpio(20)
})
```

## Options

### pin

The pin hardware identifier on which to mount the buzzer.

### activeLow

Indicates that the current flows through the speaker when the pin `0`.
That means that when the speaker is supposed to be silent, the pin will be set to `1`.
By default, the opposite is assumed.
