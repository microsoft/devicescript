import * as ds from "@devicescript/core"

console.log("crashing in 5s...")
await ds.delay(5000)
ds._panic(0xab04711)
