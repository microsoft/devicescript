import * as ds from "@devicescript/core"

export class I2CError extends Error {
    readonly status: ds.I2CStatus
    constructor(message: string, status: ds.I2CStatus) {
        super(message)
        this.name = "I2CError"
        this.status = status
    }
}

ds.I2C.prototype.writeReg = async function (devAddr, regAddr, byte) {
    const b = Buffer.alloc(2)
    b[0] = regAddr
    b[1] = byte
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing dev=${devAddr} at reg=${regAddr}`,
            status
        )
}

ds.I2C.prototype.readReg = async function (devAddr, regAddr) {
    const b = Buffer.alloc(1)
    b[0] = regAddr
    const [status, buffer] = await this.transaction(devAddr, 1, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error reading dev=${devAddr} at reg=${regAddr}`,
            status
        )
    return buffer[0]
}

ds.I2C.prototype.writeRegBuf = async function (devAddr, regAddr, b) {
    const nb = Buffer.alloc(1 + b.length)
    nb[0] = regAddr
    nb.blitAt(1, b, 0, b.length)
    const [status, buffer] = await this.transaction(devAddr, 0, nb)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing dev=${devAddr} at reg=${regAddr}`,
            status
        )
}

ds.I2C.prototype.readRegBuf = async function (devAddr, regAddr, size) {
    const b = Buffer.alloc(1)
    b[0] = regAddr
    const [status, buffer] = await this.transaction(devAddr, size, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error reading dev=${devAddr} at reg=${regAddr}`,
            status
        )
    return buffer
}

ds.I2C.prototype.readBuf = async function (devAddr, size) {
    const [status, buffer] = await this.transaction(
        devAddr,
        size,
        Buffer.alloc(0)
    )
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(`error reading buffer dev=${devAddr}`, status)
    return buffer
}

ds.I2C.prototype.writeBuf = async function (devAddr, b) {
    const [status, buffer] = await this.transaction(devAddr, 0, b)
    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `error writing buffer ${b} to dev=${devAddr}`,
            status
        )
}
