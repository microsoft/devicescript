import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"
import { Set } from "@devicescript/core/src/set"

function msg(m: string) {
    console.log(m)
}

function testSetAdd() {
    msg("testSetAdd")

    let elements = new Set<number>();
    assert(elements === elements.add(1));
    assert(elements.size() === 1, "add");

    assert(elements === elements.add(2));
    assert(elements.size() === 2, "add");

    assert(elements === elements.add(1));
    assert(elements === elements.add(2));
    assert(elements.size() === 2, "add");

    assert(elements === elements.add(3));
    assert(elements.size() === 3, "add");
}

function testSetClear() {
    msg("testSetClear")

    let elements = new Set<number>();
    [1, 3, 1, 4, 5, 3].forEach(element => {
        elements.add(element)
    })
    assert(elements.size() === 4, "add")

    elements.clear();
    assert(elements.size() === 0, "clear")
}

function testSetDelete() {
    msg("testSetDelete")

    let elements = new Set<string>();
    ["a", "b", "e", "b", "d", "c", "a"].forEach(element => {
        elements.add(element)
    })

    assert(elements.size() === 5, "add")

    assert(!elements.delete("f"), "delete")
    assert(elements.size() === 5, "delete")

    assert(elements.delete("a"), "delete")
    assert(elements.size() === 4, "delete")

    assert(!elements.delete("a"), "delete")
    assert(elements.size() === 4, "delete")
}

function testSetHas() {
    msg("testSetHas")

    let elements = new Set<string>();
    ["a", "d", "f", "d", "d", "a", "g"].forEach(element => {
        elements.add(element)
    })

    assert(elements.has("g"), "has")
    assert(elements.has("d"), "has")
    assert(elements.has("f"), "has")

    assert(!elements.has("e"), "has")
}



testSetAdd()
testSetClear()
testSetDelete()
testSetHas()
