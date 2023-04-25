import * as ds from "@devicescript/core"
import { SensorServer, startServer } from "@devicescript/server"

class SimpleSensorServer extends SensorServer {
    errorFraction: number
    errorValue: number
    min: number
    max: number
    name: string

    constructor(options: SimpleSensorOptions) {
        super(options.spec)
        Object.assign(this, options)
    }

    async reading() {
        return 0
    }

    async readingError() {
        if (typeof this.errorFraction === "number")
            return this.errorFraction * (await this.reading())
        else if (typeof this.errorValue === "number") return this.errorValue
        else return undefined
    }

    async instanceName() {
        return this.name
    }

    async minReading() {
        return this.min
    }

    async maxReading() {
        return this.max
    }
}

export interface SimpleSensorBaseOptions {
    reading(): ds.AsyncValue<number>
    minReading?(): ds.AsyncValue<number>
    maxReading?(): ds.AsyncValue<number>
    readingError?(): ds.AsyncValue<number>
    variant?(): ds.AsyncValue<number>
    errorFraction?: number
    errorValue?: number
    min?: number
    max?: number
    name?: string
}

export interface SimpleSensorOptions extends SimpleSensorBaseOptions {
    spec: ds.ServiceSpec
}

export function startSimpleServer(options: SimpleSensorOptions) {
    return startServer(new SimpleSensorServer(options), options.name)
}

export function startTemperature(options: SimpleSensorBaseOptions) {
    return new ds.Temperature(
        startSimpleServer({
            ...options,
            spec: ds.Temperature.spec,
        })
    )
}

export function startHumidity(options: SimpleSensorBaseOptions) {
    if (options.min === undefined) options.min = 0
    if (options.max === undefined) options.max = 100
    return new ds.Humidity(
        startSimpleServer({
            ...options,
            spec: ds.Humidity.spec,
        })
    )
}

export function startTempHumidity(
    topt: SimpleSensorBaseOptions,
    hopt: SimpleSensorBaseOptions,
    name?: string
) {
    let humName: string = undefined
    if (name) humName = name + "_hum"
    if (!topt.name) topt.name = name
    if (!hopt.name) hopt.name = humName
    const temperature = startTemperature(topt)
    const humidity = startHumidity(hopt)
    return { temperature, humidity }
}
