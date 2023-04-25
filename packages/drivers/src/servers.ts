import * as ds from "@devicescript/core"
import {
    SensorServer,
    SensorServerOptions,
    startServer,
} from "@devicescript/server"

export interface TemperatureOptions extends SensorServerOptions {
    min: number
    max: number
    error: number
    read: () => Promise<number>
}

export class TemperatureServer
    extends SensorServer<ds.TemperatureServerSpec>
    implements ds.TemperatureServerSpec
{
    options: TemperatureOptions

    constructor(options: TemperatureOptions) {
        super(ds.Temperature.spec, "temperature", options)
        this.options = options
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

export function startTemperature(options: TemperatureOptions, name?: string) {
    const id = startServer(new TemperatureServer(options))
    return new ds.Temperature(id)
}

export interface HumidityOptions extends SensorServerOptions {
    error: number
    read: () => Promise<number>
}

export class HumidityServer
    extends SensorServer<ds.HumidityServerSpec>
    implements ds.HumidityServerSpec
{
    options: HumidityOptions

    constructor(options: HumidityOptions) {
        super(ds.Humidity.spec, "humidity", options)
        this.options = options
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
    const id = startServer(new HumidityServer(options))
    return new ds.Humidity(id)
}

export function startTempHumidity(
    topt: TemperatureOptions,
    hopt: HumidityOptions,
    name?: string
) {
    let humName: string = undefined
    if(name) 
        humName=name + "_hum"
    const temperature = startTemperature(topt)
    const humidity = startHumidity(hopt)
    return { temperature, humidity }
}
