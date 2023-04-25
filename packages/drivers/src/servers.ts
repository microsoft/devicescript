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
    variant?(): () => number
    errorFraction?: number
    errorValue?: number
    min?: number
    max?: number
    name?: string
}

export interface SimpleSensorOptions extends SimpleSensorBaseOptions {
    spec: ds.ServiceSpec
}

let simRoles: any

function simRole(pref: string) {
    for (let i = 0; ; i++) {
        const k = pref + "_" + i
        if (!simRoles[k]) {
            simRoles[k] = true
            return k
        }
    }
}

export function startSimpleServer(options: SimpleSensorOptions) {
    if (ds.isSimulator()) {
        if (!simRoles) simRoles = {}
        let name = options.name
        if (!name) name = simRole(options.spec.name)
        else simRoles[name] = true
        const keys: (keyof SimpleSensorOptions)[] = ["min", "max", "errorValue"]
        let num = 0
        for (const key of keys) {
            if (options[key] !== undefined) addkv(key, options[key])
        }
        if (options.variant) addkv("variant", options.variant())
        console.debug(`request sim: ${name}`)
        return name

        function addkv(key: string, value: any) {
            name += (num === 0 ? "?" : "&") + key + "=" + value
            num++
        }
    }
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
