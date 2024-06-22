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
    assert(r === "AX1X2X3", "map")

    let flt = [17, 8, 2, 3, 100].filter((x, i) => x === i)
    assert(flt.length === 2, "flt")
    assert(flt[1] === 3, "flt")

    let sum = [1, 2, 3].reduce((s, v) => s + v, 0)
    assert(sum === 6, "red")

    let x = [ds._id("A") + "12", ds._id("B") + "3"]
        .map((k, i) => k.length + i)
        .reduce((c, n) => c * n, 1)
    assert(x === 9, "9")
}

function testArrayForEach() {
    msg("testArrayFoEach")
    let strs: string[] = []
    ;[1, 2, 3].forEach(x => strs.push("X" + x))
    let r = "A"
    for (let s of strs) {
        r += s
    }
    assert(r === "AX1X2X3", "forEach")
}

function testArrayEvery() {
    let str = [1, 2, 3]
    assert(!str.every(x => x === 2), "everyfalse")
    assert(
        str.every(x => x > 0),
        "everytrue"
    )
}

function testArrayFill() {
    assert([1, 2, 3].fill(4).join() === "4,4,4")
    assert([1, 2, 3].fill(4, 1).join() === "1,4,4")
    assert([1, 2, 3].fill(4, 1, 2).join() === "1,4,3")
    assert([1, 2, 3].fill(4, 1, 1).join() === "1,2,3")
    assert([1, 2, 3].fill(4, 3, 3).join() === "1,2,3")
    assert([1, 2, 3].fill(4, -3, -2).join() === "4,2,3")
    assert([1, 2, 3].fill(4, NaN, NaN).join() === "1,2,3")
    assert([1, 2, 3].fill(4, 3, 5).join() === "1,2,3")
    assert(Array(3).fill(4).join() === "4,4,4")
}
function testArrayIndexOf() {
    let str = [1, 2, 2, 3]
    assert(str.indexOf(2) === 1, "indexOf")
    assert(str.lastIndexOf(2) === 2, "lastIndexOf")
}
function testArraySome() {
    let str = [1, 2, 3]
    assert(
        str.some(x => x === 2),
        "sometrue"
    )
    assert(!str.some(x => x < 0), "somefalse")
}
function testArrayIncludes() {
    let str = [1, 2, 3]
    assert(str.includes(2), "includestrue")
    assert(!str.includes(7), "includesfalse")
}
function testArrayFind() {
    let str = [0, 1, 2, 3]
    assert(str.find(x => x === 2) === 2, "sometrue")
    assert(str.find(x => x < 0) === undefined, "somefalse")
}

function testArrayFindLast() {
    let str = [0, 1, 2, 3]
    assert(str.findLast(x => x < 3) === 2, "findLastTrue")
    assert(str.findLast(x => x < 0) === undefined, "findLastFalse")
}
function testArrayFindIndex() {
    let str = ["a", "b", "c", "d"]
    assert(str.findIndex(x => x === "c") === 2, "sometrue")
    assert(str.findIndex(x => x === "z") === -1, "somefalse")
}

function testArrayFindLastIndex() {
    let str = ["a", "b", "c", "cee", "d"]
    assert(str.findLastIndex(x => x.startsWith("c")) === 3, "findLastIndexTrue")
    assert(str.findLastIndex(x => x === "z") === -1, "findLastIndexFalse")
}

function testArrayWith() {
    const arr = [1, 2, 3]
    const newArr = arr.with(1, 42)
    assert(newArr !== arr, "with creates a new array")
    assert(newArr[1] === 42, "with replaces element at index")
    assert(newArr[0] === 1 && newArr[2] === 3, "with preserves other elements")
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
        assert(inArray[i] === expectedArray[i])
    }
}

function testArrayAt() {
    msg("testArrayAt")
    let str = [1, 2, 3]
    assert(str.at(2) === 3, "arrayAtTrue")
    assert(str.at(0) === 1, "arrayAtTrue")
    assert(str.at(-0) === 1, "arrayAtTrue")
    assert(str.at(-3) === 1, "arrayAtTrue")
    assert(str.at(7) === undefined, "arrayAtUndefined")
    assert(str.at(-6) === undefined, "arrayAtUndefined")
}

function localeCompareHelper(a: string, b: string) {
    if (a < b) return -1
    else if (a > b) return 1
    else return 0
}

function testArraySort() {
    msg("testArraySort")
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
    arr.sort()
    assert(arr.join() === "1,1,2,3,3,4,5,5,5,6,9", "sort1")

    const numbers = [9, 3, 7, 1, 5]
    numbers.sort((a, b) => a - b)
    assert(numbers.join() === "1,3,5,7,9", "sort2")

    const words = ["apple", "banana", "cherry", "date"]
    words.sort()
    assert(words.join() === "apple,banana,cherry,date", "sort3")

    const people = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
        { name: "Charlie", age: 35 },
    ]
    people.sort((a, b) => a.age - b.age)
    assert(people.map(p => p.name).join() === "Bob,Alice,Charlie", "sort4")

    const mixed = [5, "apple", 2, "banana", 9, "cherry"]
    mixed.sort((a, b) => {
        if (typeof a === "string" && typeof b === "string") {
            return localeCompareHelper(a, b)
        } else if (typeof a === "string") {
            return 1 // Strings come after numbers
        } else if (typeof b === "string") {
            return -1 // Numbers come before strings
        } else {
            return a - b // Compare numbers
        }
    })
    assert(mixed.join() === "2,5,9,apple,banana,cherry", "sort5")
}

function testArrayKeys() {
    const sparseArray = ['a', undefined , 'c']
    const array = ["a", "b", "c"]

    assert(joinIterable(array.keys()) === '0,1,2', "arrayKeys")
    assert(joinIterable(sparseArray.keys()) === '0,1,2', "sparseArrayKeys")

    function joinIterable(iterator: IterableIterator<number>): string {
        const values:number[] = [];
        for (const key of iterator) {
            values.push(key)
        }
        return values.join();
    }
}

function testArrayReverse() {
    const array = ['one', 'two', 'three'];

    const reversed = array.reverse();
    assert(reversed.join() === 'three,two,one', "reversed");
    assert(array.join() === 'three,two,one', "reversedDestructive");
}

testArraySome()
testArrayEvery()
testArrayFill()
testArrayIndexOf()
testArrayForEach()
testArrayMap()
testArrayFind()
testArrayFindLast()
testArrayFindIndex()
testArrayFindLastIndex()
testGenerics()
testArrayIncludes()
testArrayAt()
testArrayWith()
testArraySort()
testArrayKeys()
testArrayReverse()
