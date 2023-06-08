import { describe, expect, test } from "@devicescript/test"
import { pixelBuffer, rgb, schedule, setStatusLight, uptime } from "."
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
