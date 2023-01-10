import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

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
ds.reboot()