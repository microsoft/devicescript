import * as ds from "@devicescript/core"
import { DriverError } from "./core"
import { I2CSensorDriver, I2CSensorDriverOptions } from "./i2csensordriver"

export abstract class SHTDriver extends I2CSensorDriver<{
    humidity: number
    temperature: number
}> {
    constructor(devAddress: number, options?: I2CSensorDriverOptions) {
        super(devAddress, options)
    }

    protected async readU16(regAddr: number, wait = 0) {
        await this.sendCmd(regAddr)
        if (wait) await ds.delay(wait)
        const buf = await this.readBuf(3)
        if (shtCRC8(buf, 2) !== buf[2]) throw new DriverError("SHT CRC error")
        return (buf[0] << 8) | buf[1]
    }

    protected async sendCmd(cmd: number) {
        await this.writeBuf(shtCmd(cmd))
    }
}

function shtCmd(cmd: number) {
    return Buffer.from([cmd >> 8, cmd & 0xff])
}

function shtCRC8(b: Buffer, len?: number) {
    if (len === undefined) len = b.length
    let res = 0xff
    for (let i = 0; i < len; ++i) {
        res ^= b[i]
        for (let j = 0; j < 8; ++j)
            if (res & 0x80) res = (res << 1) ^ 0x31
            else res = res << 1
        res &= 0xff
    }
    return res
}
