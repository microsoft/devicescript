import { afterEach, beforeEach, describe, expect, test } from "."

describe("pass", function () {
    test("console.log", () => {
        console.log(`hi`)
    })
    test("console.log async", async () => {
        console.log(`hi (async)`)
    })
})

describe("error", function () {
    test(
        "throw",
        () => {
            throw new Error("expected fail")
        },
        { expectedError: true }
    )
    test(
        "undefined",
        () => {
            const s: { f: () => void } = undefined
            s.f()
        },
        { expectedError: true }
    )
})
describe("expect", function () {
    test("toBe.pass", () => {
        expect(1).toBe(1)
    })
    test(
        "toBe.error",
        () => {
            expect(1).toBe(0)
        },
        { expectedError: true }
    )
    test("toThrow", () => {
        expect(() => {
            throw new Error("boom")
        }).toThrow()
    })
})

let beforeCounter = 0
describe("beforeEach", function () {
    beforeEach(() => {
        beforeCounter++
    })
    test("increment", () => {
        expect(beforeCounter).toBe(1)
    })
    test("increment2", () => {
        expect(beforeCounter).toBe(2)
    })
})

let afterCounter = 0
describe("afterEach", function () {
    afterEach(() => {
        afterCounter++
    })
    test("increment", () => {
        expect(afterCounter).toBe(0)
    })
    test("increment2", () => {
        expect(afterCounter).toBe(1)
    })
})
