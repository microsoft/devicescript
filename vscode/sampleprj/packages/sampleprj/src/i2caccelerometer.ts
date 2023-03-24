// See https://www.nxp.com/docs/en/data-sheet/MMA8452Q.pdf for details

import * as devs from "@devicescript/core"

const i2c = new devs.I2C()
console.log("start")

const addr = 0x1d
const scale = 2

// convert signed 12-bit quantity from two I2C bytes into floating point
function convert(high: number, low: number) {
    const raw = ((high << 24) | (low << 16)) >> 20
    return (raw / (1 << 11)) * scale
}

// set up the device to be active
async function init() {
    await i2c.writeReg(addr, 0x2a, 1) // CTRL_REG1 = 0x2a
}

// get the X, Y, Z accelerometer values in a single call
async function read() {
    const data = await i2c.readRegBuf(addr, 1, 6) 
    const x = convert(data[0], data[1])
    const y = convert(data[2], data[3])
    const z = convert(data[4], data[5])
    return { x, y, z }
}

await init()
while (true) {
    const r = await read()
    console.log(`${r.x} ${r.y} ${r.z}`)
    await devs.sleep(500)
}