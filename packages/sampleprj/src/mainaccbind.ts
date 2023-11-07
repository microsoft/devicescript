import { DA213BDriver, startAccelerometer } from "@devicescript/drivers"

export class Board {
    constructor() {}
    /**
     * Starts the accelerometer
     * @returns accelerometer client
     */
    async startAccelerometer() {
        const driver = new DA213BDriver()
        const acc = await startAccelerometer(driver, {})
        return acc
    }
}

async function start() {
    const driver = new DA213BDriver()
    const acc = await startAccelerometer(driver, {})
    return acc
}

// this client does not bind
const acc = await new Board().startAccelerometer()
// this one binds
//const acc = await start()

acc.reading.subscribe(v => console.data(v))
