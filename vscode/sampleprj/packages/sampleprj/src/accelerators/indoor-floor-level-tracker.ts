import * as ds from "@devicescript/core"
import { cloud, startSyncEnv, uploadMessage } from "@devicescript/cloud"
import { subscribeEnv } from "@devicescript/settings"
import {
    collectTime,
    debounceTime,
    filter,
    interval,
    map,
    rollingAverage,
    throttleTime,
} from "@devicescript/observables"

/**
 * A partial port of
 * https://github.com/blues/app-accelerators/blob/main/01-indoor-floor-level-tracker/firmware/src/main.cpp/
 */

const NO_MOVEMENT_THRESHOLD_SCALE_MS = 1000
const FLOOR_SAMPLE_PERIOD = 250
const FLOOR_FILTER_ORDER = 10
const FLOOR_OFFSET = 0.3
const LIVE_UPDATE_PERIOD = 1000 * 60

// devices:
// humidity sensor
const tmp = new ds.Temperature()
const bmp = new ds.Humidity()
const pre = new ds.AirPressure()

// display
const display = new ds.CharacterScreen()

// sync env with cloud
await startSyncEnv()

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
    map(async _ => {
        const humidity = await bmp.humidity.read()
        const temp = await tmp.temperature.read()
        const pressure = (await pre.pressure.read()) / 100
        const altitude = 100 // todo
        const floor = 10 // TODO
        const currentFloor = Math.round(floor + FLOOR_OFFSET) // todo filter.

        readings.emit({
            time: ds.millis(),
            humidity,
            temp,
            pressure,
            altitude,
            floor,
            currentFloor,
        })
    })
)

// periodic upload
interval(LIVE_UPDATE_PERIOD)
    .pipe(filter(async () => await cloud.connected().read()))
    .subscribe(async () => {
        const reading = await readings.read()
        uploadMessage("readings", reading)
    })
