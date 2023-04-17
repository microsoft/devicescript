import * as ds from "@devicescript/core"
import { SensorServer, startServer } from "@devicescript/server"

export interface TemperatureOptions {
    min: number
    max: number
    error: number
    read: () => Promise<number>
}

export class TemperatureServer
    extends SensorServer<ds.TemperatureServerSpec>
    implements ds.TemperatureServerSpec
{
    constructor(public options: TemperatureOptions) {
        super(ds.Temperature.spec, "temperature")
    }

    async temperature() {
        return await this.options.read()
    }
    minTemperature() {
        return this.options.min
    }
    maxTemperature() {
        return this.options.max
    }
    temperatureError() {
        return this.options.error
    }
}

export function startTemperature(options: TemperatureOptions) {
    startServer(new TemperatureServer(options))
}

export interface HumidityOptions {
    error: number
    read: () => Promise<number>
}

export class HumidityServer
    extends SensorServer<ds.HumidityServerSpec>
    implements ds.HumidityServerSpec
{
    constructor(public options: HumidityOptions) {
        super(ds.Humidity.spec, "humidity")
    }

    async humidity() {
        return await this.options.read()
    }
    humidityError() {
        return this.options.error
    }
    minHumidity() {
        return 0
    }
    maxHumidity() {
        return 100
    }
}

export function startHumidity(options: HumidityOptions) {
    startServer(new HumidityServer(options))
}
