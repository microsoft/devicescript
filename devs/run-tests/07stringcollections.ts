import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function testStringCollection(): void {
    let coll = <string[]>[]
    coll.push("foobar")
    coll.push(ds._id("") + 12)
    coll.push(coll[0] + "xx")
    assert(coll.indexOf("12") == 1, "idx")
    coll = [ds._id("a") + "b", coll[2]]
    assert(coll[0] == "ab", "")
    assert(coll[1] == ds._id("foob") + "arxx", "")
    assert(coll.length == 2, "")
}

function testUnionIndexer(): void {
    type SmallNumber = (0 | 1) | (1 | 2) | 2
    const arr: string[] = ["foo", "bar", "baz"]

    let index: SmallNumber = 0
    assert(arr[index] === arr[0])

    index = 1
    assert(arr[index] === arr[1])

    // need to cast to get past typescript narrowing without randomness
    index = 2 as SmallNumber
    if (index === 0) {
        return
    }

    assert(arr[index] === arr[2])
}

testStringCollection()
testUnionIndexer()

ds.reboot()
