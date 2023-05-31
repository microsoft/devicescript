import {
    startAirQualityIndex,
    startAirPressure,
    startHumidity,
    startTemperature,
} from "./servers"
import { delay } from "@devicescript/core"
import { I2CSensorDriver, I2CDriverError } from "@devicescript/i2c"

// based on https://github.com/adafruit/Adafruit_CircuitPython_BME680/blob/main/adafruit_bme680.py

const BME680_THROTTLE = 100

const BME680_CHIPID = 0x61

const BME680_REG_CHIPID = 0xd0
const BME680_REG_VARIANT = 0xf0
const BME680_COEFF_ADDR1 = 0x89
const BME680_COEFF_ADDR2 = 0xe1
const BME680_RES_HEAT_0 = 0x5a
const BME680_GAS_WAIT_0 = 0x64
const BME680_REG_SOFTRESET = 0xe0
const BME680_REG_CTRL_GAS = 0x71
const BME680_REG_CTRL_HUM = 0x72
const BME680_REG_STATUS = 0x73
const BME680_REG_CTRL_MEAS = 0x74
const BME680_REG_CONFIG = 0x75
const BME680_REG_MEAS_STATUS = 0x1d
const BME680_REG_PDATA = 0x1f
const BME680_REG_TDATA = 0x22
const BME680_REG_HDATA = 0x25

const BME680_RUNGAS = 0x10

function read16(arr: Buffer, off = 0) {
    return (arr[off] << 8) | arr[off + 1]
}

function read24(arr: Buffer, off = 0) {
    return (arr[off + 0] << 16) | read16(arr, off + 1)
}

function unpack(fmt: string, buf: Buffer) {
    let off = 0
    let res: number[] = []
    for (let i = 0; i < fmt.length; ++i) {
        switch (fmt[i]) {
            case "<":
                break
            case "h":
                res.push(buf.getAt(off, "i16"))
                off += 2
                break
            case "H":
                res.push(buf.getAt(off, "u16"))
                off += 2
                break
            case "B":
                res.push(buf.getAt(off, "u8"))
                off += 1
                break
            case "b":
                res.push(buf.getAt(off, "i8"))
                off += 1
                break
            default:
                throw new Error("bad fmt " + fmt[i])
        }
    }
    return res
}

class BME680Driver extends I2CSensorDriver<{
    humidity: number
    temperature: number
    pressure: number
    gas: number
}> {
    private chipVariant: number
    private _pressure_oversample: number
    private _temp_oversample: number
    private _humidity_oversample: number
    private _filter: number

    private _adc_pres: number
    private _adc_temp: number
    private _adc_hum: number
    private _adc_gas: number
    private _gas_range: number
    private _t_fine: number

    private _pressure_calibration: Array<number>
    private _humidity_calibration: Array<number>
    private _temp_calibration: Array<number>
    private _gas_calibration: Array<number>

    private _heat_range: number
    private _heat_val: number
    private _sw_err: number

    private _LOOKUP_TABLE_1: number[]
    private _LOOKUP_TABLE_2: number[]

    constructor(addr: 0x77 | 0x76) {
        super(addr, { readCacheTime: BME680_THROTTLE })
    }

    override async initDriver(): Promise<void> {
        await this.writeReg(BME680_REG_SOFTRESET, 0xb6)
        await delay(5)
        const id = await this.readReg(BME680_REG_CHIPID)
        console.debug(`BME680 id=${id}`)
        if (id !== BME680_CHIPID)
            throw new I2CDriverError(`BME680: wrong chip id`)
        this.chipVariant = await this.readReg(BME680_REG_VARIANT)
        await this.readCalibration()

        // set up heater
        await this.writeReg(BME680_RES_HEAT_0, 0x73)
        await this.writeReg(BME680_GAS_WAIT_0, 0x65)

        //Default oversampling and filter register values.
        this._pressure_oversample = 0b011
        this._temp_oversample = 0b100
        this._humidity_oversample = 0b010
        this._filter = 0b010
    }

    private async readCalibration() {
        const b0 = await this.readRegBuf(BME680_COEFF_ADDR1, 25)
        const b1 = await this.readRegBuf(BME680_COEFF_ADDR2, 16)
        const coeff = unpack(
            "<hbBHhbBhhbbHhhBBBHbbbBbHhbb",
            b0.concat(b1).slice(1, 39)
        )
        const getIdx = (idx: number[]) => idx.map(i => coeff[i])

        this._temp_calibration = getIdx([23, 0, 1])
        this._pressure_calibration = getIdx([3, 4, 5, 7, 8, 10, 9, 12, 13, 14])
        this._humidity_calibration = getIdx([17, 16, 18, 19, 20, 21, 22])
        this._gas_calibration = getIdx([25, 24, 26])

        // flip around H1 & H2
        this._humidity_calibration[1] *= 16
        this._humidity_calibration[1] += this._humidity_calibration[0] % 16
        this._humidity_calibration[0] /= 16

        this._heat_range = ((await this.readReg(0x02)) & 0x30) / 16
        this._heat_val = await this.readReg(0x00)
        this._sw_err = ((await this.readReg(0x04)) & 0xf0) / 16
    }

    private async performReading() {
        // Perform a single-shot reading from the sensor and fill internal data structure for    calculations

        // set filter
        await this.writeReg(BME680_REG_CONFIG, this._filter << 2)
        // turn on temp oversample & pressure oversample
        await this.writeReg(
            BME680_REG_CTRL_MEAS,
            (this._temp_oversample << 5) | (this._pressure_oversample << 2)
        )
        // turn on humidity oversample
        await this.writeReg(BME680_REG_CTRL_HUM, this._humidity_oversample)
        // gas measurements enabled
        if (this.chipVariant === 0x01)
            await this.writeReg(BME680_REG_CTRL_GAS, BME680_RUNGAS << 1)
        else await this.writeReg(BME680_REG_CTRL_GAS, BME680_RUNGAS)
        let ctrl = await this.readReg(BME680_REG_CTRL_MEAS)
        ctrl = (ctrl & 0xfc) | 0x01 // enable single shot!
        await this.writeReg(BME680_REG_CTRL_MEAS, ctrl)
        let new_data = false
        let data: Buffer
        while (!new_data) {
            data = await this.readRegBuf(BME680_REG_MEAS_STATUS, 17)
            new_data = (data[0] & 0x80) !== 0
            await delay(5)
        }

        this._adc_pres = read24(data, 2) / 16
        this._adc_temp = read24(data, 5) / 16

        this._adc_hum = read16(data, 8)
        if (this.chipVariant === 0x01) {
            this._adc_gas = read16(data, 15) >> 6
            this._gas_range = data[16] & 0x0f
        } else {
            this._adc_gas = read16(data, 13) >> 6
            this._gas_range = data[14] & 0x0f
        }

        const var1 = this._adc_temp / 8 - this._temp_calibration[0] * 2
        const var2 = (var1 * this._temp_calibration[1]) / 2048
        let var3 = ((var1 / 2) * (var1 / 2)) / 4096
        var3 = (var3 * this._temp_calibration[2] * 16) / 16384
        this._t_fine = Math.floor(var2 + var3)
    }

    private pressure() {
        let var1 = this._t_fine / 2 - 64000
        let var2 = ((var1 / 4) * (var1 / 4)) / 2048
        var2 = (var2 * this._pressure_calibration[5]) / 4
        var2 = var2 + var1 * this._pressure_calibration[4] * 2
        var2 = var2 / 4 + this._pressure_calibration[3] * 65536
        var1 =
            ((((var1 / 4) * (var1 / 4)) / 8192) *
                (this._pressure_calibration[2] * 32)) /
                8 +
            (this._pressure_calibration[1] * var1) / 2
        var1 = var1 / 262144
        var1 = ((32768 + var1) * this._pressure_calibration[0]) / 32768
        let calc_pres = 1048576 - this._adc_pres
        calc_pres = (calc_pres - var2 / 4096) * 3125
        calc_pres = (calc_pres / var1) * 2
        var1 =
            (this._pressure_calibration[8] *
                (((calc_pres / 8) * (calc_pres / 8)) / 8192)) /
            4096
        var2 = ((calc_pres / 4) * this._pressure_calibration[7]) / 8192
        let var3 =
            ((calc_pres / 256) ** 3 * this._pressure_calibration[9]) / 131072
        calc_pres +=
            (var1 + var2 + var3 + this._pressure_calibration[6] * 128) / 16
        return calc_pres / 100
    }

    private temperature() {
        const calc_temp = (this._t_fine * 5 + 128) / 256
        return calc_temp / 100
    }

    private humidity() {
        let temp_scaled = (this._t_fine * 5 + 128) / 256
        let var1 =
            this._adc_hum -
            this._humidity_calibration[0] * 16 -
            (temp_scaled * this._humidity_calibration[2]) / 200
        let var2 =
            (this._humidity_calibration[1] *
                ((temp_scaled * this._humidity_calibration[3]) / 100 +
                    (temp_scaled *
                        ((temp_scaled * this._humidity_calibration[4]) / 100)) /
                        64 /
                        100 +
                    16384)) /
            1024
        let var3 = var1 * var2
        let var4 = this._humidity_calibration[5] * 128
        var4 = (var4 + (temp_scaled * this._humidity_calibration[6]) / 100) / 16
        let var5 = ((var3 / 16384) * (var3 / 16384)) / 1024
        let var6 = (var4 * var5) / 2
        let calc_hum = (((var3 + var6) / 1024) * 1000) / 4096
        calc_hum /= 1000 // get back to RH
        return Math.clamp(0, calc_hum, 100)
    }

    private fillTables() {
        if (this._LOOKUP_TABLE_1) return
        this._LOOKUP_TABLE_1 = [
            2147483647.0, 2147483647.0, 2147483647.0, 2147483647.0,
            2147483647.0, 2126008810.0, 2147483647.0, 2130303777.0,
            2147483647.0, 2147483647.0, 2143188679.0, 2136746228.0,
            2147483647.0, 2126008810.0, 2147483647.0, 2147483647.0,
        ]
        this._LOOKUP_TABLE_2 = [
            4096000000.0, 2048000000.0, 1024000000.0, 512000000.0, 255744255.0,
            127110228.0, 64000000.0, 32258064.0, 16016016.0, 8000000.0,
            4000000.0, 2000000.0, 1000000.0, 500000.0, 250000.0, 125000.0,
        ]
    }

    private gas() {
        let calc_gas_res = 0
        if (this.chipVariant === 0x01) {
            // taken from https://github.com/BoschSensortec/BME68x-Sensor-API
            let var1 = 262144 >> this._gas_range
            let var2 = this._adc_gas - 512
            var2 *= 3
            var2 = 4096 + var2
            calc_gas_res = (1000 * var1) / var2
            calc_gas_res = calc_gas_res * 100
        } else {
            this.fillTables()
            let var1 =
                ((1340 + 5 * this._sw_err) *
                    this._LOOKUP_TABLE_1[this._gas_range]) /
                65536
            let var2 = this._adc_gas * 32768 - 16777216 + var1
            let var3 = (this._LOOKUP_TABLE_2[this._gas_range] * var1) / 512
            calc_gas_res = (var3 + var2 / 2) / var2
        }
        return Math.floor(calc_gas_res)
    }

    override async readData() {
        await this.performReading()
        const gas = this.gas()
        const humidity = this.humidity()
        const temperature = this.temperature()
        const pressure = this.pressure()
        const r = {
            temperature,
            humidity,
            gas,
            pressure,
        }
        // console.log(r)
        return r
    }
}

/**
 * Start driver for Bosch BME680 temperature/humidity/pressure/gas sensor at I2C `0x76` (default) or `0x77`.
 * @see {@link https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf | Datasheet}
 * @see {@link https://www.adafruit.com/product/3660 | Adafruit}
 * @devsPart Bosch BME68
 * @devsServices temperature, humidity, airPressure, airQualityIndex
 * @throws DriverError
 */
export async function startBME680(options?: {
    address?: 0x77 | 0x76
    temperatureName?: string
    humidityName?: string
    pressureName?: string
    airQualityIndexName?: string
    baseName?: string
}) {
    const {
        baseName,
        temperatureName,
        humidityName,
        pressureName,
        airQualityIndexName,
        address,
    } = options || {}
    const driver = new BME680Driver(address || 0x76)
    await driver.init()
    return {
        temperature: startTemperature({
            min: -40,
            max: 85,
            errorValue: 1,
            reading: async () => (await driver.read()).temperature,
            name: temperatureName,
            baseName,
        }),
        humidity: startHumidity({
            errorValue: 3,
            reading: async () => (await driver.read()).humidity,
            name: humidityName,
            baseName,
        }),
        pressure: startAirPressure({
            min: 300,
            max: 1100,
            errorValue: 0.12,
            reading: async () => (await driver.read()).pressure,
            name: pressureName,
            baseName,
        }),
        // TODO this is not really AQI
        airQualityIndex: startAirQualityIndex({
            min: 1,
            max: 100000,
            reading: async () => (await driver.read()).gas,
            name: airQualityIndexName,
            baseName,
        }),
    }
}
