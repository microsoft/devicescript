import * as ds from "@devicescript/core"
import { i2c } from "@devicescript/i2c"
import { DriverError } from "./core"

export function shtCRC8(b: Buffer, len?: number) {
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

export function shtCmd(cmd: number) {
    return Buffer.from([cmd >> 8, cmd & 0xff])
}

export async function shtReadU16(devAddr: number, regAddr: number, wait = 0) {
    await shtSendCmd(devAddr, regAddr)
    if (wait) await ds.delay(wait)
    const buf = await i2c.readBuf(devAddr, 3)
    if (shtCRC8(buf, 2) !== buf[2]) throw new DriverError("SHT CRC error")
    return (buf[0] << 8) | buf[1]
}

export async function shtSendCmd(devAddr: number, cmd: number) {
    await i2c.writeBuf(devAddr, shtCmd(cmd))
}
