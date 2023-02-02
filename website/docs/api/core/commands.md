---
sidebar_position: 4
hide_table_of_contents: true
---

# Commands

Commands are implemented directly on the role instance and are service specific.

```ts edit
const buzzer = new ds.Buzzer()

ds.everyMs(1000, () => {
    buzzer.playNote(440, 1, 100)
})
```
