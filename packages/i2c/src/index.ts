export * from "./client"
export { I2CError } from "./i2c_impl"

declare module "@devicescript/core" {
    interface I2C {
        /**
         * Execute I2C transaction
         * @param devAddr a 7 bit i2c address
         * @param writeBuf the value to write
         * @param numRead number of bytes to read afterwards
         * @returns a buffer `numRead` bytes long
         */
        xfer(
            devAddr: number,
            writeBuf: Buffer,
            numRead: number
        ): Promise<Buffer>

        /**
         * Write a byte to a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param byte the value to write
         * @throws I2CError
         */
        writeReg(devAddr: number, regAddr: number, byte: number): Promise<void>
        /**
         * read a byte from a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @returns a byte
         * @throws I2CError
         */
        readReg(devAddr: number, regAddr: number): Promise<number>
        /**
         * write a buffer to a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param b a byte buffer
         * @throws I2CError
         */
        writeRegBuf(devAddr: number, regAddr: number, b: Buffer): Promise<void>
        /**
         * read a buffer from a register
         * @param devAddr a 7 bit i2c address
         * @param regAddr an 8 bit register address
         * @param size the number of bytes to request
         * @returns a byte buffer
         * @throws I2CError
         */
        readRegBuf(
            devAddr: number,
            regAddr: number,
            size: number
        ): Promise<Buffer>
        /**
         * read a raw buffer
         * @param devAddr a 7 bit i2c address
         * @param size the number of bytes to request
         * @returns a byte buffer
         * @throws I2CError
         */
        readBuf(devAddr: number, size: number): Promise<Buffer>
        /**
         * write a raw buffer
         * @param devAddr a 7 bit i2c address
         * @param b a byte buffer
         * @throws I2CError
         */
        writeBuf(devAddr: number, b: Buffer): Promise<void>
    }
}
