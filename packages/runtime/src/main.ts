import { describe, expect, test } from "@devicescript/test"
import {
    encodeURIComponent,
    rgb,
    schedule,
    setStatusLight,
    uptime,
    Map,
    Set,
    fillGradient,
    fillBarGraph,
    Number,
    PixelBuffer,
} from "."
import { delay } from "@devicescript/core"

describe("rgb", () => {
    test("0,0,0", () => {
        expect(rgb(0, 0, 0)).toBe(0)
    })
    test("ff,0,0", () => {
        expect(rgb(0xff, 0, 0)).toBe(0xff0000)
    })
    test("0,ff,0", () => {
        expect(rgb(0, 0xff, 0)).toBe(0x00ff00)
    })
    test("0,00,ff", () => {
        expect(rgb(0, 0, 0xff)).toBe(0x0000ff)
    })
})

describe("pixelbuffer", () => {
    test("setpixelcolor", () => {
        const buf = PixelBuffer.alloc(3)
        buf.setAt(1, 0x123456)
        expect(buf.at(1)).toBe(0x123456)
    })
    test("setpixelcolor negative", () => {
        const buf = PixelBuffer.alloc(3)
        buf.setAt(-1, 0x123456)
        expect(buf.at(-1)).toBe(0x123456)
    })
    test("setbargraph", () => {
        const buf = PixelBuffer.alloc(4)
        fillBarGraph(buf, 5, 10)
        console.log(buf.buffer)
    })
    test("gradient", () => {
        const buf = PixelBuffer.alloc(4)
        fillGradient(buf, 0xff0000, 0x00ff00)
        console.log(buf.buffer)
    })
    test("rotate", () => {
        const buf = PixelBuffer.alloc(3)
        buf.setAt(1, 0x123456)
        console.log(buf)
        buf.rotate(-1)
        console.log(buf)
        expect(buf.at(2)).toBe(0x123456)
        buf.rotate(-1)
        console.log(buf)
        expect(buf.at(0)).toBe(0x123456)
        buf.rotate(1)
        console.log(buf)
        expect(buf.at(2)).toBe(0x123456)
    })
})

describe("control", () => {
    test("uptime", async () => {
        console.log({ uptime: await uptime() })
    })
    test("setStatusLight", async () => {
        await setStatusLight(0xff0000)
        await delay(100)
        await setStatusLight(0x00ff00)
    })
})

describe("schedule", () => {
    test("timeout", async () => {
        let called = 0
        schedule(
            () => {
                called++
            },
            { timeout: 50 }
        )
        await delay(100)
        console.log({ called })
        expect(called).toBe(1)
    })
    test("interval", async () => {
        let called = 0
        schedule(
            () => {
                called++
            },
            { interval: 40 }
        )
        await delay(100)
        console.log({ called })
        expect(called === 2).toBe(true)
    })
    test("timeout+interval", async () => {
        let called = 0
        schedule(
            () => {
                called++
            },
            { interval: 50, timeout: 20 }
        )
        await delay(100)
        console.log({ called })
        expect(called === 2).toBe(true)
    })
})

describe("encodeURIComponent tests", () => {
    test("Basic Encoding Test", async () => {
        let encoded = encodeURIComponent("Hello World")
        expect(encoded === "Hello World").toBe(true)
    })
    test("Encoding Already Encoded Characters", async () => {
        let encoded = encodeURIComponent("Hello%20World")
        expect(encoded === "Hello%20World").toBe(true)
    })
    test("Encoding Slash", async () => {
        let encoded = encodeURIComponent("/path/to/resource")
        expect(encoded === "/path/to/resource").toBe(true)
    })
    test("Encoding Non-ASCII Character", async () => {
        let encoded = encodeURIComponent("😀")
        expect(encoded === "%E0%9F%98%80").toBe(true)
    })
})

describe("Test Es Map Class", () => {
    function msg(m: string) {
        console.log(m)
    }

    test("map+methods", () => {
        let map = new Map()
        map.set("one", 1)
        map.set("two", 2)
        map.set("three", 3)

        msg("map test set")
        expect(map.size() === 3).toBe(true)

        msg("map test get")
        expect(map.get("one") === 1).toBe(true)
        map.delete("two")

        msg("map test delete")
        expect(map.size() === 2).toBe(true)

        map.clear()

        msg("map test clear")
        expect(map.size() === 0).toBe(true)
    })

    test("map+constructor", () => {
        const map = new Map<string, number>([
            ["one", 1],
            ["two", 2],
            ["three", 3],
        ])
        msg("map test constructor")
        expect(map.size() === 3).toBe(true)
    })
    msg("Map tests completed")
})

describe("Test Es Set Class", () => {
    test("add", () => {
        let elements = new Set<number>()
        expect(elements === elements.add(1)).toBe(true)
        expect(elements.size === 1).toBe(true)

        expect(elements === elements.add(2)).toBe(true)
        expect(elements.size === 2).toBe(true)

        expect(elements === elements.add(1)).toBe(true)
        expect(elements === elements.add(2)).toBe(true)

        expect(elements === elements.add(3)).toBe(true)
        expect(elements.size === 3).toBe(true)
    })

    test("clear", () => {
        let elements = new Set<number>()
        ;[1, 3, 1, 4, 5, 3].forEach(element => {
            elements.add(element)
        })
        expect(elements.size === 4).toBe(true)

        elements.clear()
        expect(elements.size === 0).toBe(true)
    })

    test("delete", () => {
        let elements = new Set<string>()
        ;["a", "b", "e", "b", "d", "c", "a"].forEach(element => {
            elements.add(element)
        })

        expect(elements.size === 5).toBe(true)

        expect(!elements.delete("f")).toBe(true)
        expect(elements.size === 5).toBe(true)

        expect(elements.delete("a")).toBe(true)
        expect(elements.size === 4).toBe(true)

        expect(!elements.delete("a")).toBe(true)
        expect(elements.size === 4).toBe(true)
    })

    test("has", () => {
        let elements = new Set<string>()
        ;["a", "d", "f", "d", "d", "a", "g"].forEach(element => {
            elements.add(element)
        })

        expect(elements.has("g")).toBe(true)
        expect(elements.has("d")).toBe(true)
        expect(elements.has("f")).toBe(true)
        expect(!elements.has("e")).toBe(true)
    })
})

describe("number", () => {
    test("isInteger", () => {
        const check = (v: unknown) => expect(Number.isInteger(v)).toBe(true)
        const checkNot = (v: unknown) => expect(Number.isInteger(v)).toBe(false)

        check(0) // true
        check(1) // true
        check(-100000) // true
        check(99999999999999999999999) // true

        checkNot(0.1) // false
        checkNot(Math.PI) // false

        checkNot(NaN) // false
        checkNot(Infinity) // false
        checkNot(-Infinity) // false
        checkNot("10") // false
        checkNot(true) // false
        checkNot(false) // false
        checkNot([1]) // false

        check(5.0) // true
        checkNot(5.000000000000001) // false
        check(5.0000000000000001) // true, because of loss of precision
        check(4500000000000000.1) // true, because of loss of precision
    })
    test("isNaN", () => {
        const check = (v: unknown) => expect(Number.isNaN(v)).toBe(true)
        const checkNot = (v: unknown) => expect(Number.isNaN(v)).toBe(false)

        check(NaN)

        checkNot("NaN")
        checkNot(Infinity)
        checkNot(-Infinity)
        checkNot("5")
        checkNot(5)
        checkNot(true)
        checkNot(false)
        checkNot([NaN])
    })
    test("parseFloat", () => {
        const check = (v: unknown) => expect(Number.parseFloat(v)).toBe(3.14)
        const checkNaN = (v: unknown) =>
            expect(isNaN(Number.parseFloat(v))).toBe(isNaN(NaN))

        const checkInfinity = (v: unknown) =>
            expect(Number.parseFloat(v)).toBe(Infinity)

        const checkMinusInfinity = (v: unknown) =>
            expect(Number.parseFloat(v)).toBe(-Infinity)
        check(3.14)
        check("3.14")
        check("  3.14  ")
        check("314e-2")
        check("0.0314E+2")
        check("3.14some non-digit characters")
        checkNaN("FF2")
        checkNaN("NaN")
        checkInfinity("1.7976931348623159e+308")
        checkMinusInfinity("-1.7976931348623159e+308")
        checkInfinity("Infinity")
        checkMinusInfinity("-Infinity")
    })
})
