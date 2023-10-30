import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

interface Testrec {
    str: string
    num: number
    bool: boolean
    str2: string
}

function testRec0(): Testrec {
    let testrec: Testrec = {} as any
    testrec.str2 = ds._id("Hello") + " world"
    testrec.str = testrec.str2
    testrec.num = 42
    assert(testrec.str === "Hello world", "recstr")
    assert(testrec.num === 42, "recnum")
    let testrec2 = <Testrec>null
    assert(testrec2 === null, "isinv")
    assert(testrec === testrec, "eq")
    assert(testrec !== null, "non inv")
    return testrec
}

function testReccoll(): void {
    let coll: Testrec[] = []
    let item = testRec0()
    coll.push(item)
}

testReccoll()
