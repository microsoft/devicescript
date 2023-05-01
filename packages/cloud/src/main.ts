import * as ds from "@devicescript/core"
import {
    createMetric,
    environment,
    trackEvent,
    trackException,
    trackMetric,
    publishMessage,
} from "."
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
describe("trackException", () => {
    test("throw", () => {
        try {
            throw new Error("ouch")
        } catch (e) {
            trackException(e as Error)
        }
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
        await trackMetric("test.stddev", { value: 1, variance: 4 })
    })
    test("count", async () => {
        await trackMetric("test.count", { value: 1, count: 5 })
    })
})
describe("metric", () => {
    test("upload.array", async () => {
        const m = createMetric("test.metric")
        m.add([0, 1, 2])
        await m.upload()
    })
    test("upload.array", async () => {
        const m = createMetric("test.metric.array")
        m.add(1)
        m.add(2)
        await m.upload()
    })
})
describe("upload message", () => {
    test("upload", async () => {
        await publishMessage("cloud/tests", {
            t: ds.millis(),
        })
    })
    test("upload2", async () => {
        await publishMessage("cloud/tests", {
            t: ds.millis(),
        })
        await publishMessage("cloud/tests", {
            t: ds.millis(),
        })
    })
})
describe("environment", () => { 
    test("env", async () => {
        const env = await environment()
        await ds.delay(1500)
        const value = await env.read()
        console.log(value)
    })
})

await trackMetric("end", { value: ds.millis() })
