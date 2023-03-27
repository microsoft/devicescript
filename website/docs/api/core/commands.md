---
sidebar_position: 4
---

# Commands

Commands are implemented directly on the role instance and are service specific.

```ts edit
const buzzer = new ds.Buzzer()

setInterval(() => {
    buzzer.playNote(440, 1, 100)
}, 1000)
```
