import * as ds from "@devicescript/core"

const r1 = new ds.NoSuchService() //! does not exist on type
const r2 = new ds.Button(1) //! Expected 0 arguments
const r3 = new ds.Lightbulb() //! does not exist on type
const r4 = new ds.LightBulb() // OK

const btn = new ds.Button()
const clr = new ds.Color()
function test1() {
    {
        let [a, b] = btn.pressure.read() //! method that returns an iterator
        let [aa] = btn.pressure.read() //! method that returns an iterator
    }

    {
        let [a, b] = clr.color.read() // OK
    }
}

test1()
