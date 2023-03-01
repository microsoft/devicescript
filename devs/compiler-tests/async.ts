function foo(f: () => void) {}
foo(async () => {}) //! async function
foo((async () => {}) as any) // OK
foo((async () => {}) as () => void) //! async function
const aa = [1, 2, 3]
aa.forEach(async () => {}) //! async function
async function noop() {}
aa.some(noop) //! async function

async function testAwait() {
    await noop() // OK
    noop() //! 'await' missing
}
await testAwait() // OK
testAwait() //! 'await' missing

export {}
