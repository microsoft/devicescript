---
description: Mounts a buzzer (sounder) server
title: Buzzer
---

# Buzzer

The [Buzzer](/api/clients/buzzer) constructor takes a configuration to start a [buzzer server](https://microsoft.github.io/jacdac-docs/services/buzzer) on the device.

```ts
import { gpio, Buzzer } from "@devicescript/core"

const speaker = new Buzzer({
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
