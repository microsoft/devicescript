import * as ds from "@devicescript/core"
import { createMetric, trackEvent, trackMetric, uploadMessage } from "."
import { describe, test } from "@devicescript/test"

console.log("start test")
await trackEvent("cloud.test.start")
await trackMetric("start", { value: ds.millis() })

describe("trackEvent", () => {
    test("call", async () => {
        await trackEvent("test.cloud")
    })
    test("properties", async () => {
        await trackEvent("test.props", { properties: { a: "a" } })
    })
    test("measurements", async () => {
        await trackEvent("test.mes", { measurements: { a: 1 } })
    })
})
describe("trackMetric", () => {
    test("ctor", async () => {
        const m = createMetric("test.metric", 1)
        await m.upload()
    })
    test("value", async () => {
        const m = createMetric("test.metric")
        m.add(1)
        await m.upload()
    })
    test("array", async () => {
        const m = createMetric("test.metric.array")
        m.add([1, 2, 3])
        await m.upload()
    })
})
describe("trackMetric", () => {
    test("value", async () => {
        await trackMetric("test.metric", { value: 1 })
    })
    test("min", async () => {
        await trackMetric("test.min", { value: 1, min: 2 })
    })
    test("max", async () => {
        await trackMetric("test.max", { value: 1, max: 3 })
    })
    test("stddev", async () => {
        await trackMetric("test.stddev", { value: 1, stdDev: 4 })
    })
    test("count", async () => {
        await trackMetric("test.count", { value: 1, count: 5 })
    })
})
describe("upload message", () => {
    test("upload", async () => {
        await uploadMessage("cloud/tests", {
            t: ds.millis(),
        })
    })
    test("upload2", async () => {
        await uploadMessage("cloud/tests", {
            t: ds.millis(),
        })
        await uploadMessage("cloud/tests", {
            t: ds.millis(),
        })
    })
})

await trackMetric("end", { value: ds.millis() })
