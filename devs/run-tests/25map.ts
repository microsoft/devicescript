import { assert } from "@devicescript/core"
import { Map } from "@devicescript/core/src/map"

function msg(m: string) {
    console.log(m)
}

function testMap() {
    msg("Running map tests...")
    let map = new Map()
    map.set("one", 1)
    map.set("two", 2)
    map.set("three", 3)

    msg("map test set")
    assert(map.size() === 3)

    msg("map test get")
    assert(map.get("one") === 1)

    msg("map test delete")
    map.delete("two")
    assert(map.size() === 2)

    msg("map test clear")
    map.clear()
    assert(map.size() === 0)

    msg("Map tests completed.")
}

// Run the map tests
testMap()