import * as ds from "@devicescript/core"

const cloud = new ds.CloudAdapter()
console.log(await cloud.connectionName.read())

await ds.sleepMs(500)
await cloud.trackEvent("started")
await cloud.uploadJson(JSON.stringify({ foo: 1, bar: { baz: "foo" } }))
await cloud.uploadBinary(hex`00 11 22 33`)

cloud.onJson.subscribe(val => {
    console.log("got JSON", val)
})
cloud.onBinary.subscribe(val => {
    console.log("got bin", val)
})

setInterval(async () => {
    await cloud.trackEvent("alive")
}, 30000)
