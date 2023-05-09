import { describe, expect, test } from "@devicescript/test"
import { rgb } from "."

describe("rgb", () => {
    test("0,0,0", () => {
        expect(rgb(0, 0, 0)).toBe(0)
    })
})
