import { describe, expect, test } from "@devicescript/test"
import { rosSubscribe, rosPublish } from "./index"
import { delay } from "@devicescript/core"

describe("ros", () => {
    test("subscribe", async () => {
        const unsubscribe = rosSubscribe("/foo", msg => {
            console.log(msg)
        })
        await delay(1000)
        unsubscribe()
    })
    test("publish", async () => {
        await rosPublish("/foo", 42)
    })
})
