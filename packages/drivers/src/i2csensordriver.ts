import { AsyncValue, isSimulator, millis, sleep } from "@devicescript/core"
import { I2CDriver, I2CDriverOptions } from "./i2cdriver"

export interface I2CSensorDriverOptions extends I2CDriverOptions {
    /**
     * Data read throttle time in milliseconds
     */
    readCacheTime?: number
}

/**
 * A helper class to implement I2C sensor drivers
 */
export abstract class I2CSensorDriver<TData> extends I2CDriver {
    _data: TData
    _dataTime = 0
    _dataCacheTime: number

    /**
     * Instantiate a driver
     * @param devAddr a 7 bit i2c address
     * @param options
     */
    constructor(devAddr: number, options?: I2CSensorDriverOptions) {
        super(devAddr, options)
        const { readCacheTime } = options || {}
        this._dataCacheTime = readCacheTime || 50
    }

    /**
     * Throttled read of the sensor data
     * @returns
     */
    async read(): Promise<TData> {
        if (isSimulator()) return {} as any

        // lock on reading data
        while (this._dataTime === -1) await sleep(5)

        // cache hit
        if (millis() - this._dataTime < this._dataCacheTime) return this._data

        // query sensor again, read data is throttled
        this._dataTime = -1
        this._data = await this.readData()
        this._dataTime = millis()
        return this._data
    }

    /**
     * Perform the I2C transaction to read the sensor data
     */
    protected abstract readData(): AsyncValue<TData>
}
