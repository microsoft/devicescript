import * as ds from "@devicescript/core"

function expectError(t: any, f: () => void) {
    let ok = false
    try {
        f()
    } catch (e:any) {
        ds.assert(e instanceof t)
        ok = true
    }
    ds.assert(ok)
}

const r1 = new ds.Button("B1")
expectError(RangeError, () => {
    const r2 = new ds.Button("B1")
})
expectError(TypeError, () => {
    const r2 = new ds.Button(12 as any)
})
