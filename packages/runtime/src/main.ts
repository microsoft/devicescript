import { describe, expect, test } from "@devicescript/test"
import { colorBuffer, rgb } from "."

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
        const buf = colorBuffer(3)
        buf.setPixelColor(1, 0x123456)
        expect(buf.getPixelColor(1)).toBe(0x123456)
    })
    test("setpixelcolor negative", () => {
        const buf = colorBuffer(3)
        buf.setPixelColor(-1, 0x123456)
        expect(buf.getPixelColor(-1)).toBe(0x123456)
    })
    test("setbargraph", () => {
        const buf = colorBuffer(4)
        buf.setBarGraph(5, 10)
        console.log(buf.buffer)
    })
})
