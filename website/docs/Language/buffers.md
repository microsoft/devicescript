---
sidebar_position: 6
---
# Buffers

Buffers can be statically allocated, read and written.
This can be used to conserve memory (regular variables always take 8 bytes)
and create arrays (with fixed upper limit).

```ts
var mybuf = buffer(12) // 12 byte buffer
mybuf.setAt(10, "u16", 123)
mybuf.setAt(3, "u22.10", 173.282)
var z = mybuf.getAt(3, "u22.10")
```

There is a special buffer called `packet` which represents a buffer to be passed to next
command or register write.
It supports `packets.setLength()` function (unlike regular buffers),
and can be passed to any command or register write.
For example `lamp.brightness.write(0.7)` is equivalent to:

```js
packet.setLength(2)
packet.setAt(0, "u0.16", 0.7)
lamp.brightness.write(packet)
```
