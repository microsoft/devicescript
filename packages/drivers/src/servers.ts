import * as ds from "@devicescript/core"
import { SensorServer, ServerOptions, startServer } from "@devicescript/server"

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
    variant?: () => number
    errorFraction?: number
    errorValue?: number
    min?: number
    max?: number
    name?: string
    baseName?: string
    simOk?: boolean
}

export interface SimpleSensorOptions extends SimpleSensorBaseOptions {
    spec: ds.ServiceSpec
}

let _simRoles: any
function simRole(pref: string) {
    for (let i = 0; ; i++) {
        const k = pref + "_" + i
        if (!_simRoles[k]) {
            _simRoles[k] = true
            return k
        }
    }
}

export interface SimulatorServerOptions {
    errorValue?: number
    min?: number
    max?: number

    baseName?: string
    name?: string
    variant?: () => number
    spec: ds.ServiceSpec
}

export function startSimulatorServer(options: SimulatorServerOptions) {
    if (!_simRoles) _simRoles = {}
    let name = options.name
    if (!name) {
        if (options.baseName) name = options.baseName + "_" + options.spec.name
        else name = simRole(options.spec.name)
    } else _simRoles[name] = true
    const keys: (keyof SimulatorServerOptions)[] = ["min", "max", "errorValue"]
    let num = 0
    for (const key of keys) {
        if (options[key] !== undefined) addkv(key, options[key])
    }
    const variant = options.variant?.()
    if (variant !== undefined) addkv("variant", variant)
    console.debug(`request sim: ${name}`)
    return name

    function addkv(key: string, value: any) {
        name += (num === 0 ? "?" : "&") + key + "=" + value
        num++
    }
}

export function startSimpleServer(
    options: SimpleSensorOptions & ServerOptions
) {
    if (ds.isSimulator() && !options.simOk) return startSimulatorServer(options)
    return startServer(new SimpleSensorServer(options), options)
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

export function startTemperatureHumidity(
    topt: SimpleSensorBaseOptions,
    hopt: SimpleSensorBaseOptions
) {
    const temperature = startTemperature(topt)
    const humidity = startHumidity(hopt)
    return { temperature, humidity }
}

export function startAirPressure(options: SimpleSensorBaseOptions) {
    return new ds.AirPressure(
        startSimpleServer({
            ...options,
            spec: ds.AirPressure.spec,
        })
    )
}

export function startAirQualityIndex(options: SimpleSensorBaseOptions) {
    return new ds.AirQualityIndex(
        startSimpleServer({
            ...options,
            spec: ds.AirQualityIndex.spec,
        })
    )
}
