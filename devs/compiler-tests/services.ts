import * as ds from "@devicescript/core"

const r1 = new ds.NoSuchService() //! does not exist on type
const r2 = new ds.Button(1) //! Expected 0 arguments
const r3 = new ds.Lightbulb() //! does not exist on type
const r4 = new ds.LightBulb() // OK

const btn = new ds.Button()
const clr = new ds.Color()
async function test1() {
    {
        let [a, b] = await btn.pressure.read() //! method that returns an iterator
        let [aa] = await btn.pressure.read() //! method that returns an iterator
    }

    {
        let [a, b] = await clr.color.read() // OK
    }
}

await test1()
