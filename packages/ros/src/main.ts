import { describe, expect, test } from "@devicescript/test"
import { rosSubscribe, rosPublish, rosConfigure } from "./index"
import { delay } from "@devicescript/core"

describe("ros", () => {})
    /*
describe("ros", () => {
    test("configure", async () => {
        await rosConfigure("mynode")
        await delay(1000)
    })
    test("subscribe", async () => {
        await rosSubscribe("/foo", msg => {
            console.log(msg)
        })
        await delay(1000)
    })
    test("publish", async () => {
        await rosPublish("/foo", 42)
    })
})
*/