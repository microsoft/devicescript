import { sleep, assert, AsyncVoid } from "@devicescript/core"

let glb1 = 0
let x = 0

async function immediate(k: number) {
    try {
        await sleep(1)
        if (k > 0) throw "hl" + k
        await sleep(1)
        glb1++
    } catch (e) {
        assert(e === "hl" + k)
        glb1 += 10
        if (k >= 10) throw e
    } finally {
        x += glb1
    }
}

async function throwVal(n: number) {
    await sleep(1)
    if (n > 0) throw "hel" + n
    await sleep(1)
}

function higherorder(k: number) {
    try {
        ;[1].map(async () => await throwVal(k))
        glb1++
    } catch (e) {
        assert(e === "hel" + k)
        glb1 += 10
        if (k >= 10) throw e
    } finally {
        x += glb1
    }
}

async function lambda(k: number) {
    async function inner() {
        try {
            await throwVal(k)
            glb1++
        } catch (e) {
            assert(e === "hel" + k)
            glb1 += 10
            if (k >= 10) throw e
        } finally {
            x += glb1
        }
    }
    await inner()
}

async function callingThrowVal(k: number) {
    try {
        await sleep(1)
        await throwVal(k)
        await sleep(1)
        glb1++
    } catch (e) {
        assert(e === "hel" + k)
        glb1 += 10
        if (k >= 10) throw e
    } finally {
        x += glb1
    }
}

async function nested() {
    try {
        try {
            await callingThrowVal(10)
        } catch (e) {
            assert(glb1 === 10 && x === 10)
            glb1++
            throw e
        }
    } catch (ee) {
        assert(glb1 === 11)
    }
}

async function test3(fn: (k: number) => AsyncVoid) {
    glb1 = 0
    x = 0
    await fn(1)
    assert(glb1 === 10 && x === 10)
    await fn(0)
    assert(glb1 === 11 && x === 21)
    await fn(3)
    assert(glb1 === 21 && x === 42)
}

function test4(fn: () => void) {
    try {
        fn()
        return 10
    } catch {
        return 20
    } finally {
        glb1++
    }
}

function test5() {
    let n = 0
    for (let k of [0, 1, 2]) {
        try {
            n++
            try {
                if (k === 1) break
            } catch {
                n += 1000
            }
        } catch {
            n += 100
        }
    }
    assert(n === 2)
}

function test6() {
    let n = 0
    let kk = 0
    for (let k of [0, 1, 2]) {
        try {
            n++
            try {
                if (k === 1) break
            } catch {
                n += 1000
            } finally {
                kk++
            }
        } catch {
            n += 100
        } finally {
            kk += 100
        }
    }
    assert(n === 2)
    assert(kk === 202)
}

async function run() {
    console.log("test exn")
    glb1 = 0
    x = 0
    await callingThrowVal(1)
    assert(glb1 === 10 && x === 10)
    await callingThrowVal(0)
    assert(glb1 === 11 && x === 21)
    await callingThrowVal(3)
    assert(glb1 === 21 && x === 42)

    await test3(callingThrowVal)
    await test3(immediate)
    await test3(higherorder)
    await test3(lambda)

    glb1 = 0
    x = 0
    await nested()
    assert(glb1 === 11)

    assert(test4(() => {}) === 10)
    assert(
        test4(() => {
            throw "foo"
        }) === 20
    )
    assert(glb1 === 13)

    test5()
    test6()

    console.log("test exn done")
}

await run()
