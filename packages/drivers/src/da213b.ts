import { AccelerometerDriver, Vector3D, I2CDriver } from "@devicescript/drivers"

// datasheet: https://semic-boutique.com/wp-content/uploads/2021/01/da213B.pdf
// ref: https://github.com/alibaba/AliOS-Things/blob/master/components/sensor/drv/drv_acc_mir3_da213B.c

const DA213B_ADDRESS = 0x27
const DA213B_RANGE = 0x0f
const DA213B_ODRAXIS = 0x10
const DA213B_MODE = 0x11
const DA213B_INTMAP1 = 0x1a
const DA213B_INTCFG = 0x20

function read16(buf: Buffer, pos = 0) {
    let value = buf[pos] | (buf[pos + 1] << 8)
    if (value & 0x8000) value -= 0x10000
    return value >> 2
}

export class DA213BDriver extends I2CDriver implements AccelerometerDriver {
    constructor(addr: number = DA213B_ADDRESS) {
        super(addr)
    }

    override async initDriver(): Promise<void> {
        await this.writeReg(0x7f, 0x83)
        await this.writeReg(0x7f, 0x69)
        await this.writeReg(0x7f, 0xbd)
        let v = await this.readReg(0x8e)
        if (v === 0) {
            await this.writeReg(0x80, 0x50)
        }
        // await this.writeReg(DA213B_RANGE, 0x40);
        // await this.writeReg(DA213B_RANGE, 0x03); // acc range
        await this.writeReg(DA213B_RANGE, 0x00)
        await this.writeReg(DA213B_INTCFG, 0x00)
        // await this.writeReg(DA213B_MODE, 0x34); // power on
        await this.writeReg(DA213B_MODE, 0x01) // power on
        await this.writeReg(DA213B_ODRAXIS, 0x09)
        await this.writeReg(DA213B_INTMAP1, 0x04)
        await this.writeReg(0x15, 0x04)
    }
    supportedRanges(): number[] {
        return undefined
    }
    readingRange(): number {
        return undefined
    }
    async setReadingRange(value: number) {
        await this.writeReg(0x0f, value)
    }
    async readSample() {
        const buff: Buffer = await this.readRegBuf(0x02, 6)
        const x: number = read16(buff, 0)
        const y: number = read16(buff, 2)
        const z: number = read16(buff, 4)
        return [x, y, z]
    }

    subscribe(cb: (sample: Vector3D) => Promise<void>): void {
        const _this = this
        setInterval(async () => {
            const s = await this.readSample()
            await cb(s as Vector3D)
        }, 50)
    }
}
