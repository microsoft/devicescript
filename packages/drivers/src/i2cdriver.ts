import { isSimulator } from "@devicescript/core"
import { i2c, I2C } from "@devicescript/i2c"
import { DriverError } from "./core"

export interface I2CDriverOptions {
    /**
     * I2c client, default is `i2c`
     */
    client?: I2C
}

/**
 * A helper class to implement I2C drivers
 */
export abstract class I2CDriver {
    readonly devAddr: number
    readonly client: I2C

    /**
     * Instantiate a driver
     * @param devAddr a 7 bit i2c address
     * @param options
     */
    constructor(devAddr: number, options?: I2CDriverOptions) {
        const { client } = options || {}

        this.devAddr = devAddr
        this.client = client || i2c
    }

    /**
     * Initializes the I2C device
     * @throws DriverError
     */
    async init(): Promise<void> {
        if (isSimulator()) return
        try {
            await this.initDriver()
        } catch (e: any) {
            if (e instanceof DriverError) throw e
            throw new DriverError(
                "I2C device not found or malfunctioning: " + e.message
            )
        }
    }

    /**
     * Initializes the I2C device
     * @throws I2CError
     */
    protected abstract initDriver(): Promise<void>

    /**
     * Execute I2C transaction
     * @param devAddr a 7 bit i2c address
     * @param writeBuf the value to write
     * @param numRead number of bytes to read afterwards
     * @returns a buffer `numRead` bytes long
     */
    async xfer(writeBuf: Buffer, numRead: number): Promise<Buffer> {
        return await this.client.xfer(this.devAddr, writeBuf, numRead)
    }

    /**
     * Write a byte to a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param byte the value to write
     * @throws I2CError
     */
    async writeReg(regAddr: number, byte: number): Promise<void> {
        return await this.client.writeReg(this.devAddr, regAddr, byte)
    }
    /**
     * read a byte from a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @returns a byte
     * @throws I2CError
     */
    async readReg(regAddr: number): Promise<number> {
        return await this.client.readReg(this.devAddr, regAddr)
    }
    /**
     * write a buffer to a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param b a byte buffer
     * @throws I2CError
     */
    async writeRegBuf(regAddr: number, b: Buffer): Promise<void> {
        return await this.client.writeRegBuf(this.devAddr, regAddr, b)
    }
    /**
     * read a buffer from a register
     * @param devAddr a 7 bit i2c address
     * @param regAddr an 8 bit register address
     * @param size the number of bytes to request
     * @returns a byte buffer
     * @throws I2CError
     */
    async readRegBuf(regAddr: number, size: number): Promise<Buffer> {
        return await this.client.readRegBuf(this.devAddr, regAddr, size)
    }
    /**
     * read a raw buffer
     * @param devAddr a 7 bit i2c address
     * @param size the number of bytes to request
     * @returns a byte buffer
     * @throws I2CError
     */
    async readBuf(size: number): Promise<Buffer> {
        return await this.client.readBuf(this.devAddr, size)
    }
    /**
     * write a raw buffer
     * @param devAddr a 7 bit i2c address
     * @param b a byte buffer
     * @throws I2CError
     */
    async writeBuf(b: Buffer): Promise<void> {
        return await this.client.writeBuf(this.devAddr, b)
    }
}
