import * as ds from "@devicescript/core"
import { trackEvent, uploadMessage } from "."
import { describe, test } from "@devicescript/test"

console.log("start test")
await trackEvent("cloud.test.start")

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
