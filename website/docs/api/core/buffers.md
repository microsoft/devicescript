---
sidebar_position: 9
hide_table_of_contents: true
---

# Buffers

Buffers can be dynamically allocated, read and written.
This can be used to conserve memory (regular variables always take 8 bytes)
and create arrays (with fixed upper limit).

```ts
const mybuf = Buffer.alloc(12) // 12 byte buffer
mybuf.setAt(10, "u16", 123)
mybuf.setAt(3, "u22.10", 173.282)
const z = mybuf.getAt(3, "u22.10")
```

## hex

`hex` is a string literal template that converts data in hexadecimal form into a readonly `Buffer` in flash.

```ts
// Buffer in flash!
const data = hex`010203040506070809`
console.log(data)
```

## packet

There is a special buffer called `ds.packet` which represents a buffer to be passed to next
command or register write.
It supports `ds.packet.setLength()` function (unlike regular buffers),
and can be passed to any command or register write.
For example `lamp.brightness.write(0.7)` is equivalent to:

```ts skip
const lamp = new ds.Led()
ds.packet.setLength(2)
ds.packet.setAt(0, "u0.16", 0.7)
lamp.brightness.write(ds.packet)
```
