import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

function msg(m: string) {
    console.log(m)
}
function testArrayMap() {
    msg("testArrayMap")
    let strs = [1, 2, 3].map(x => "X" + x)
    let r = "A"
    for (let s of strs) {
        r += s
    }
    assert(r == "AX1X2X3", "map")

    let flt = [17, 8, 2, 3, 100].filter((x, i) => x == i)
    assert(flt.length == 2, "flt")
    assert(flt[1] == 3, "flt")

    let sum = [1, 2, 3].reduce((s, v) => s + v, 0)
    assert(sum == 6, "red")

    let x = [ds._id("A") + "12", ds._id("B") + "3"]
        .map((k, i) => k.length + i)
        .reduce((c, n) => c * n, 1)
    assert(x == 9, "9")
}

function testArrayForEach() {
    msg("testArrayFoEach")
    let strs: string[] = []
    ;[1, 2, 3].forEach(x => strs.push("X" + x))
    let r = "A"
    for (let s of strs) {
        r += s
    }
    assert(r == "AX1X2X3", "forEach")
}

function testArrayEvery() {
    let str = [1, 2, 3]
    assert(!str.every(x => x == 2), "everyfalse")
    assert(
        str.every(x => x > 0),
        "everytrue"
    )
}
function testArraySome() {
    let str = [1, 2, 3]
    assert(
        str.some(x => x == 2),
        "sometrue"
    )
    assert(!str.some(x => x < 0), "somefalse")
}

function swap<T>(arr: T[], i: number, j: number): void {
    let temp: T = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

function sortHelper<T>(
    arr: T[],
    callbackfn?: (value1: T, value2: T) => number
): T[] {
    if (arr.length <= 0 || !callbackfn) {
        return arr
    }
    let len = arr.length
    // simple selection sort.
    for (let i = 0; i < len - 1; ++i) {
        for (let j = i + 1; j < len; ++j) {
            if (callbackfn(arr[i], arr[j]) > 0) {
                swap(arr, i, j)
            }
        }
    }
    return arr
}

function arraySort<T>(
    arr: T[],
    callbackfn?: (value1: T, value2: T) => number
): T[] {
    return sortHelper(arr, callbackfn)
}

function testGenerics() {
    msg("testGenerics")
    let inArray = [4, 3, 4593, 23, 43, -1]
    arraySort(inArray, (x: number, y: number) => {
        return x - y
    })
    let expectedArray = [-1, 3, 4, 23, 43, 4593]
    for (let i = 0; i < expectedArray.length; i++) {
        assert(inArray[i] == expectedArray[i])
    }
}

testArraySome()
testArrayEvery()
testArrayForEach()
testArrayMap()
testGenerics()


