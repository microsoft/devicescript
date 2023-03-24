// SparkFun Triple Axis Accelerometer Breakout - MMA8452Q (Qwiic)
// https://www.nxp.com/docs/en/data-sheet/MMA8452Q.pdf

import * as devs from "@devicescript/core"

const i2c = new devs.I2C()
const addr = 0x1d
console.log("start")

class MMA8452Q {
    private addr: number = 0x1d
    private scale: number = 2
    private convert(high: number, low: number) {
        const raw = ((high << 24) | (low << 16)) >> 20
        return (raw / (1 << 11)) * this.scale
    }
    async init() {
        await i2c.writeReg(this.addr, 0x2a, 1) // CTRL_REG1
    }
    async read() {
        const data = await i2c.readRegBuf(addr, 1, 6)
        const x = this.convert(data[0], data[1])
        const y = this.convert(data[2], data[3])
        const z = this.convert(data[4], data[5])
        return { x, y, z }
    }
}

const accel = new MMA8452Q()
await accel.init()
while (true) {
    const r = await accel.read()
    console.log(`${r.x} ${r.y} ${r.z}`)
    await devs.sleep(500)
}
