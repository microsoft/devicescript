import { describe, expect, test } from "."

describe("this is a test suite", function () {
    test("should do something", () => {
        console.log(`hi`)
    })

    test("should do something async", async () => {
        console.log(`hi (async)`)
    })

    test("expect.toBe", () => {
        expect(() => {
            throw new Error("boom")
        }).toThrow()
    })
})
