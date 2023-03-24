import * as ds from "@devicescript/core"
import { cloud, startSyncEnv, uploadMessage } from "@devicescript/cloud"
import { env, subscribeEnv } from "@devicescript/settings"
import { filter, interval, map } from "@devicescript/observables"

/**
 * A partial port of
 * https://github.com/blues/app-accelerators/blob/main/01-indoor-floor-level-tracker/firmware/src/main.cpp/
 */

const NO_MOVEMENT_THRESHOLD_SCALE_MS = 1000
const FLOOR_SAMPLE_PERIOD = 250
const FLOOR_FILTER_ORDER = 10
const FLOOR_OFFSET = 0.3
const LIVE_UPDATE_PERIOD = 1000 * 60

interface Environment {
    baselineFloor: number
    floorHeight: number
}

// devices:
// humidity sensor
const tmp = new ds.Temperature()
const bmp = new ds.Humidity()
const pre = new ds.AirPressure()

// display
const display = new ds.CharacterScreen()

// sync env with cloud
await startSyncEnv()
let _env = await env()
await subscribeEnv(v => {
    _env = v
    console.log(`env updated`)
})

interface Reading {
    time: number
    humidity: number
    temp: number
    pressure: number
    altitude: number
    floor: number
    currentFloor: number
}

// reading observer
const readings = ds.clientRegisterFrom<Partial<Reading>>({})

// reading samples and injecting into readings
interval(FLOOR_SAMPLE_PERIOD).pipe(
    filter(() => !!_env),
    map(async _ => {
        const humidity = await bmp.humidity.read()
        const temp = await tmp.temperature.read()
        const pressure = (await pre.pressure.read()) / 100
        const altitude = 100 // todo
        const { floorHeight, baselineFloor } = _env
        const floor = 10 // TODO filter
        const currentFloor = Math.round(floor + FLOOR_OFFSET)

        readings.emit({
            time: ds.millis(),
            humidity,
            temp,
            pressure,
            altitude,
            floor,
        })
    })
)

// periodic upload
await interval(LIVE_UPDATE_PERIOD)
    .pipe(filter(async () => await cloud.connected.read()))
    .subscribe(
        async () => await uploadMessage("readings", await readings.read())
    )

// update display
readings.subscribe(async () => {
    await display.message.write("...")
})
