import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(s: string): void {
    console.log(s)
}

function defaultArgs(x: number, y = 3, z = 7) {
    return x + y + z
}

function testDefaultArgs() {
    msg("testDefaultArgs")
    assert(defaultArgs(1) === 11, "defl0")
    assert(defaultArgs(1, 4) === 12, "defl1")
    assert(defaultArgs(1, 4, 8) === 13, "defl2")

    assert(optargs(1) === 1, "opt0")
    assert(optargs(1, 2) === 3, "opt1")
    assert(optargs(1, 2, 3) === 3, "opt2")

    assert(optstring(3) === 6, "os0")
    assert(optstring(3, "7") === 10, "os1")
    assert(optstring2(3) === 6, "os0")
    assert(optstring2(3, "7") === 10, "os1")
}

function optargs(x: number, y?: number, z?: number) {
    if (y === undefined) y = 0
    return x + y
}

function optstring(x: number, s?: string) {
    if (s !== undefined) {
        return parseInt(s) + x
    }
    return x * 2
}

function optstring2(x: number, s: string = null) {
    if (s !== null) {
        return parseInt(s) + x
    }
    return x * 2
}

testDefaultArgs()
