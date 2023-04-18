import * as ds from "@devicescript/core"

export class I2CError extends Error {
    readonly status: ds.I2CStatus
    constructor(message: string, status: ds.I2CStatus) {
        super(message)
        this.name = "I2CError"
        this.status = status
    }
}

ds.I2C.prototype.xfer = async function (
    this: ds.I2C,
    address: number,
    writeBuf: Buffer,
    numRead: number
): Promise<Buffer> {
    const self = this
    const pkt = await ds.actionReport(
        self,
        "transaction",
        async () => await self.transaction(address, numRead, writeBuf)
    )
    const [status, buffer] = pkt.decode()

    if (status !== ds.I2CStatus.OK)
        throw new I2CError(
            `I2C error dev=${address}: write ${writeBuf}, read ${numRead} B`,
            status
        )

    return buffer
}

ds.I2C.prototype.writeReg = async function (devAddr, regAddr, byte) {
    await this.xfer(devAddr, Buffer.from([regAddr, byte]), 0)
}

ds.I2C.prototype.readReg = async function (devAddr, regAddr) {
    return (await this.xfer(devAddr, Buffer.from([regAddr]), 1))[0]
}

ds.I2C.prototype.writeRegBuf = async function (devAddr, regAddr, b) {
    const nb = Buffer.alloc(1 + b.length)
    nb[0] = regAddr
    nb.blitAt(1, b, 0, b.length)
    await this.xfer(devAddr, nb, 0)
}

ds.I2C.prototype.readRegBuf = async function (devAddr, regAddr, size) {
    return await this.xfer(devAddr, Buffer.from([regAddr]), size)
}

ds.I2C.prototype.readBuf = async function (devAddr, size) {
    return await this.xfer(devAddr, hex``, size)
}

ds.I2C.prototype.writeBuf = async function (devAddr, b) {
    return await this.xfer(devAddr, b, 0)
}
