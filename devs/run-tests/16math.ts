import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(s: string): void {
    console.log(s)
}

function testMap(): void {
    const r = Math.map(5, 0, 10, 0, 100)
    assert(r === 50, "map 5 -> 50")
}

function testConstrain(): void {
    assert(Math.constrain(-0.1, 0, 1) === 0)
    assert(Math.constrain(1.1, 0, 1) === 1)
    assert(Math.constrain(0.5, 0, 1) === 0.5)
}

testMap()
testConstrain()
