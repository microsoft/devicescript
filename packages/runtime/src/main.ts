import { describe, expect, test } from "@devicescript/test"
import { encodeURIComponent, pixelBuffer, rgb, schedule, setStatusLight, uptime, Map } from "."
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

describe("colorbuffer", () => {
    test("setpixelcolor", () => {
        const buf = pixelBuffer(3)
        buf.setColor(1, 0x123456)
        expect(buf.getColor(1)).toBe(0x123456)
    })
    test("setpixelcolor negative", () => {
        const buf = pixelBuffer(3)
        buf.setColor(-1, 0x123456)
        expect(buf.getColor(-1)).toBe(0x123456)
    })
    test("setbargraph", () => {
        const buf = pixelBuffer(4)
        buf.setBarGraph(5, 10)
        console.log(buf.buffer)
    })
    test("gradient", () => {
        const buf = pixelBuffer(4)
        buf.setGradient(0xff0000, 0x00ff00)
        console.log(buf.buffer)
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
describe('Test Es Map Class', () => {
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