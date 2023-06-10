import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(s: string): void {
    console.log(s)
}

function testMap(): void {
    const r = Math.map(5, 0, 10, 0, 100)
    assert(r === 50, "map 5 -> 50")
}

testMap()