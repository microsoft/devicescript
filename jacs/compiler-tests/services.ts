import * as ds from "@devicescript/core"

const r1 = new ds.NoSuchService() //! does not exist on type
const r2 = new ds.Button(1) //! Expected 0 arguments
const r3 = new ds.Lightbulb() //! does not exist on type
const r4 = new ds.LightBulb() // OK

const btn = new ds.Button()
const clr = new ds.Color()
function test1() {
    let a, b, c, d

    [a, b] = btn.pressure.read(); //! method that returns an iterator
    [a] = btn.pressure.read(); //! method that returns an iterator

    [a, b] = clr.color.read(); // OK
    [a, b, c, d] = clr.color.read() //! not enough fields in color

    a = clr.color.read() //! cannot convert multi-field value color.color to number

    a[b] = btn.pressure.read() //! unhandled indexing

    if (false)
        a[b] = btn.pressure.read() // OK - if false
}

test1()