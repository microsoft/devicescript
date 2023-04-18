---
sidebar_position: 4
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
