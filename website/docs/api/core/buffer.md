---
sidebar_position: 3
hide_table_of_contents: true
---

# Buffer

A binary data buffer that allows efficient byte manipulation.

## hex

`hex` is a string literal template that converts data in hexadecimal form into a readonly `Buffer` in flash.

```ts
// Buffer in flash!
const data = hex`010203040506070809`
console.log(data)
```