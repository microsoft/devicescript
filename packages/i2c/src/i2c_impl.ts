import * as ds from "@devicescript/core"

export class I2CError extends Error {
    readonly status: ds.I2CStatus
    constructor(message: string, status: ds.I2CStatus) {
        super(message)
        this.name = "I2CError"
        this.status = status
    }
}

type DsI2C = typeof ds & {
    _i2cTransaction(
        addr: number,
        wrbuf: Buffer,
        rdbuf?: Buffer
    ): Promise<number>
}

export class I2C {
    /**
     * Execute I2C transaction
     * @param devAddr a 7 bit i2c address
     * @param writeBuf the value to write
     * @param numRead number of bytes to read afterwards
     * @returns a buffer `numRead` bytes long
     */
    async xfer(
        devAddr: number,
        writeBuf: Buffer,
        numRead?: number
    ): Promise<Buffer> {
        const rdbuf = numRead ? Buffer.alloc(numRead) : undefined
        const rc = await (ds as DsI2C)._i2cTransaction(devAddr, writeBuf, rdbuf)
        if (rc !== 0)
            throw new I2CError(
                `I2C error dev=${devAddr}: write ${writeBuf}, read ${numRead} B`,
                rc
            )
        return rdbuf || hex``
    }

    /**
     * Write a byte to a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param byte the value to write
     * @throws I2CError
     */
    async writeReg(
        devAddr: number,
        regAddr: number,
        byte: number
    ): Promise<void> {
        await this.xfer(devAddr, Buffer.from([regAddr, byte]))
    }

    /**
     * read a byte from a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @returns a byte
     * @throws I2CError
     */
    async readReg(devAddr: number, regAddr: number): Promise<number> {
        return (await this.xfer(devAddr, Buffer.from([regAddr]), 1))[0]
    }

    /**
     * write a buffer to a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param b a byte buffer
     * @throws I2CError
     */
    async writeRegBuf(
        devAddr: number,
        regAddr: number,
        b: Buffer
    ): Promise<void> {
        const nb = Buffer.alloc(1 + b.length)
        nb[0] = regAddr
        nb.blitAt(1, b, 0, b.length)
        await this.xfer(devAddr, nb)
    }

    /**
     * read a buffer from a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param size the number of bytes to request
     * @returns a byte buffer
     * @throws I2CError
     */
    async readRegBuf(
        devAddr: number,
        regAddr: number,
        size: number
    ): Promise<Buffer> {
        return await this.xfer(devAddr, Buffer.from([regAddr]), size)
    }

    /**
     * read a raw buffer
     * @param devAddr a 7 bit i2c address
     * @param size the number of bytes to request
     * @returns a byte buffer
     * @throws I2CError
     */
    async readBuf(devAddr: number, size: number): Promise<Buffer> {
        return await this.xfer(devAddr, hex``, size)
    }

    /**
     * write a raw buffer
     * @param devAddr a 7 bit i2c address
     * @param b a byte buffer
     * @throws I2CError
     */
    async writeBuf(devAddr: number, b: Buffer): Promise<void> {
        await this.xfer(devAddr, b)
    }
}
