import * as ds from "@devicescript/core"

const cloud = new ds.CloudAdapter()
console.log(await cloud.connectionName.read())

await ds.sleep(500)
await cloud.uploadJson(
    "topic1",
    JSON.stringify({ foo: 1, bar: { baz: "foo" } })
)
await cloud.uploadBinary("topic2", hex`00 11 22 33`)

cloud.onJson.subscribe(val => {
    console.log("got JSON", val[0], val[1])
})
cloud.onBinary.subscribe(val => {
    console.log("got bin", val[0], val[1])
})

await ds.sleep(500)
