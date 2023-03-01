import * as ds from "@devicescript/core"

const dotmatrix = new ds.DotMatrix()
await dotmatrix.dots.write(hex`00 ab 12 2f 00`)
const tmp = await dotmatrix.dots.read() // read buffer

const dc = new ds.DcCurrentMeasurement()
const nm = await dc.measurementName.read() // read string

const sw = new ds.Switch()
const curr = await sw.active.read() // active matches something in _system
sw.active.onChange(() => {})

const wifi = new ds.Wifi()
const theip = await wifi.ipAddress.read()
const themac = await wifi.eui48.read()
wifi.eui48.onChange(() => {})

const dig = new ds.SevenSegmentDisplay()
await dig.digits.write(hex`00 11`)
const d = await dig.digits.read()
