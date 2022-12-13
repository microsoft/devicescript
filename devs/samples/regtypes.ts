import * as ds from "@devicescript/core"

const dotmatrix = new ds.DotMatrix()
dotmatrix.dots.write(hex`00 ab 12 2f 00`)
const tmp = dotmatrix.dots.read() // read buffer

const dc = new ds.DcCurrentMeasurement()
const nm = dc.measurementName.read() // read string

const sw = new ds.Switch()
const curr = sw.active.read() // active matches something in _system
sw.active.onChange(() => {})

const wifi = new ds.Wifi()
const theip = wifi.ipAddress.read()
const themac = wifi.eui48.read()
wifi.eui48.onChange(() => {})
