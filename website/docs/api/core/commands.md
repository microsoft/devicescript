---
sidebar_position: 4
description: Learn how to implement commands directly on role instances and
  create service-specific commands in DeviceScript.
keywords:
  - DeviceScript
  - commands
  - role instances
  - service-specific
  - Buzzer
---
# Commands

Commands are implemented directly on the role instance and are service specific.

```ts edit
import { Buzzer } from "@devicescript/core"

const buzzer = new Buzzer()

setInterval(async () => {
    await buzzer.playNote(440, 1, 100)
}, 1000)
```
