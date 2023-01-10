import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

let glb1 = 0

function testArrIncr() {
    let arr = [1]
    glb1 = 0
    function getarr() {
        glb1++
        return arr
    }
    getarr()[0]++
    assert(glb1 == 1)
    assert(arr[0] == 2, "t")
    function getarr2() {
        return [1]
    }
    getarr2()[0]++ // make sure it doesn't crash
}

function testNumCollection(): void {
    console.log("test num coll")
    let collXYZ: number[] = []
    assert(collXYZ.length == 0)
    collXYZ.push(42)
    assert(collXYZ.length == 1)
    collXYZ.push(22)
    assert(collXYZ[1] == 22)
    collXYZ.insert(0, -1)
    assert(collXYZ[0] == 22)
    // collXYZ.removeElement(22)
    assert(collXYZ.pop() == 22)
    assert(collXYZ.length == 0)
    assert(collXYZ.pop() == undefined)
    assert(collXYZ.length == 0)
    for (let i = 0; i < 100; i++) {
        collXYZ.push(i)
    }
    assert(collXYZ.length == 100)

    collXYZ = [1, 2, 3]
    assert(collXYZ.length == 3, "cons")
    assert(collXYZ[0] == 1, "cons0")
    assert(collXYZ[1] == 2, "cons1")
    assert(collXYZ[2] == 3, "cons2")
}

testNumCollection()
testArrIncr()

ds.reboot()