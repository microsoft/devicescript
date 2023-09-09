import * as ds from "@devicescript/core"
import {
    SensorServer,
    SensorServerOptions,
    startServer,
} from "@devicescript/server"
import { AccelerometerServerSpec } from "@devicescript/core"
import { AccelerometerConfig } from "@devicescript/servers"

// shake/gesture detection based on
// https://github.com/lancaster-university/codal-core/blob/master/source/driver-models/Accelerometer.cpp

/*
MakeCode accelerator position:
Laying flat: 0,0,-1000
Standing on left edge: -1000,0,0
Standing on bottom edge: 0,1000,0
*/

const ACCELEROMETER_SHAKE_TOLERANCE = 0.4

const ACCELEROMETER_REST_TOLERANCE = 0.2
const ACCELEROMETER_TILT_TOLERANCE = 0.2
const ACCELEROMETER_FREEFALL_TOLERANCE = 0.4
const ACCELEROMETER_SHAKE_COUNT_THRESHOLD = 4
const ACCELEROMETER_GESTURE_DAMPING = 5
const ACCELEROMETER_SHAKE_DAMPING = 10
const ACCELEROMETER_SHAKE_RTX = 30

const ACCELEROMETER_REST_THRESHOLD =
    ACCELEROMETER_REST_TOLERANCE * ACCELEROMETER_REST_TOLERANCE
const ACCELEROMETER_FREEFALL_THRESHOLD =
    ACCELEROMETER_FREEFALL_TOLERANCE * ACCELEROMETER_FREEFALL_TOLERANCE

export type Vector3D = [number, number, number]

export interface AccelerometerDriver {
    supportedRanges(): number[]
    readingError?(): number
    readingRange(): number
    setReadingRange(value: number): Promise<void>
    // this is expected to be called at around 50Hz
    subscribe(cb: (sample: Vector3D) => Promise<void>): void
}

export interface GyroscopeDriver {
    gyroSupportedRanges(): number[]
    gyroReadingError?(): number
    gyroReadingRange(): number
    gyroSetReadingRange(value: number): Promise<void>
    // this is expected to be called at around 50Hz
    gyroSubscribe(cb: (sample: Vector3D) => Promise<void>): void
}

export interface Sensor3DOptions
    extends Omit<AccelerometerConfig, "$service"> {}

export type AccelerometerOptions = Sensor3DOptions
export type GyroscopeOptions = Sensor3DOptions

class Sensor3D extends SensorServer {
    protected lastSample: Vector3D
    protected idxMap: [number, number, number]

    constructor(
        spec: ds.ServiceSpec,
        options: Sensor3DOptions & SensorServerOptions
    ) {
        super(spec, options)
        if (options.trX) {
            this.idxMap = [options.trX, options.trY, options.trZ]
        } else {
            this.idxMap = [1, 2, 3]
        }
    }

    protected async saveSample(s: Vector3D) {
        this.lastSample = [0, 0, 0]
        for (let i = 0; i < 3; ++i) {
            const idx = this.idxMap[i]
            let v = s[Math.abs(idx) - 1]
            if (idx < 0) v = -v
            this.lastSample[i] = v
        }
    }
}

class AccelerometerServer extends Sensor3D implements AccelerometerServerSpec {
    private shakeX = false
    private shakeY = false
    private shakeZ = false
    private shakeShaken = false
    private shakeCount = 0
    private shakeTimer = 0
    private impulseSigma = 0
    private forceEvents = 0
    private sigma = 0
    private currentGesture = 0
    private lastGesture = 0

    constructor(
        public driver: AccelerometerDriver,
        options: AccelerometerOptions & SensorServerOptions
    ) {
        super(ds.Accelerometer.spec, options)
        driver.subscribe(this.handleSample)
    }

    private async handleSample(s: Vector3D) {
        await this.saveSample(s)
        await this.processEvents()
    }

    private instantaneousPosture(force: number) {
        let shakeDetected = false

        const [x, y, z] = this.lastSample

        // Test for shake events.
        // We detect a shake by measuring zero crossings in each axis. In other words, if we see a
        // strong acceleration to the left followed by a strong acceleration to the right, then we can
        // infer a shake. Similarly, we can do this for each axis (left/right, up/down, in/out).
        //
        // If we see enough zero crossings in succession (ACCELEROMETER_SHAKE_COUNT_THRESHOLD), then we
        // decide that the device has been shaken.
        if (
            (x < -ACCELEROMETER_SHAKE_TOLERANCE && this.shakeX) ||
            (x > ACCELEROMETER_SHAKE_TOLERANCE && !this.shakeX)
        ) {
            shakeDetected = true
            this.shakeX = !this.shakeX
        }

        if (
            (y < -ACCELEROMETER_SHAKE_TOLERANCE && this.shakeY) ||
            (y > ACCELEROMETER_SHAKE_TOLERANCE && !this.shakeY)
        ) {
            shakeDetected = true
            this.shakeY = !this.shakeY
        }

        if (
            (z < -ACCELEROMETER_SHAKE_TOLERANCE && this.shakeZ) ||
            (z > ACCELEROMETER_SHAKE_TOLERANCE && !this.shakeZ)
        ) {
            shakeDetected = true
            this.shakeZ = !this.shakeZ
        }

        // If we detected a zero crossing in this sample period, count this.
        if (
            shakeDetected &&
            this.shakeCount < ACCELEROMETER_SHAKE_COUNT_THRESHOLD
        ) {
            this.shakeCount++

            if (this.shakeCount === 1) this.shakeTimer = 0

            if (this.shakeCount === ACCELEROMETER_SHAKE_COUNT_THRESHOLD) {
                this.shakeShaken = true
                this.shakeTimer = 0
                return ds.AccelerometerCodes.EventShake
            }
        }

        // measure how long we have been detecting a SHAKE event.
        if (this.shakeCount > 0) {
            this.shakeTimer++

            // If we've issued a SHAKE event already, and sufficient time has passed, allow another SHAKE
            // event to be issued.
            if (
                this.shakeShaken &&
                this.shakeTimer >= ACCELEROMETER_SHAKE_RTX
            ) {
                this.shakeShaken = false
                this.shakeTimer = 0
                this.shakeCount = 0
            }

            // Decay our count of zero crossings over time. We don't want them to accumulate if the user
            // performs slow moving motions.
            else if (
                !this.shakeShaken &&
                this.shakeTimer >= ACCELEROMETER_SHAKE_DAMPING
            ) {
                this.shakeTimer = 0
                if (this.shakeCount > 0) this.shakeCount--
            }
        }

        if (force < ACCELEROMETER_FREEFALL_THRESHOLD)
            return ds.AccelerometerCodes.EventFreefall

        // Determine our posture.
        if (x < -1 + ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventTiltLeft

        if (x > 1 - ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventTiltRight

        if (y < -1 + ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventTiltDown

        if (y > 1 - ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventTiltUp

        if (z < -1 + ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventFaceUp

        if (z > 1 - ACCELEROMETER_TILT_TOLERANCE)
            return ds.AccelerometerCodes.EventFaceDown

        return 0
    }

    private async emitForceEvent(ev: number) {
        if (this.forceEvents & (1 << ev)) return
        this.forceEvents |= 1 << ev
        await this.sendEventByCode(ev)
    }

    private async sendEventByCode(ev: number) {
        await this.sendEvent(ds.Accelerometer.spec.byCode(ev).encode(undefined))
    }

    private async processEvents() {
        const [x, y, z] = this.lastSample
        const force = x * x + y * y + z * z

        if (force > 2 * 2) {
            this.impulseSigma = 0
            if (force > 2 * 2)
                await this.emitForceEvent(ds.AccelerometerCodes.EventForce2g)
            if (force > 3 * 3)
                await this.emitForceEvent(ds.AccelerometerCodes.EventForce3g)
            if (force > 6 * 6)
                await this.emitForceEvent(ds.AccelerometerCodes.EventForce6g)
            if (force > 8 * 8)
                await this.emitForceEvent(ds.AccelerometerCodes.EventForce8g)
        }

        if (this.impulseSigma < 5) this.impulseSigma++
        else this.forceEvents = 0

        // Determine what it looks like we're doing based on the latest sample...
        const gesture = this.instantaneousPosture(force)

        if (gesture === ds.AccelerometerCodes.EventShake) {
            await this.sendEventByCode(ds.AccelerometerCodes.EventShake)
        } else {
            // Perform some low pass filtering to reduce jitter from any detected effects
            if (gesture === this.currentGesture) {
                if (this.sigma < ACCELEROMETER_GESTURE_DAMPING) this.sigma++
            } else {
                this.currentGesture = gesture
                this.sigma = 0
            }

            // If we've reached threshold, update our record and raise the relevant event...
            if (
                this.currentGesture !== this.lastGesture &&
                this.sigma >= ACCELEROMETER_GESTURE_DAMPING
            ) {
                this.lastGesture = this.currentGesture
                if (this.lastGesture)
                    await this.sendEventByCode(this.lastGesture)
            }
        }
    }

    reading() {
        return this.lastSample
    }
    readingError() {
        return this.driver?.readingError()
    }
    readingRange?(): ds.AsyncValue<number> {
        return this.driver.readingRange()
    }
    async set_readingRange(value: number) {
        await this.driver.setReadingRange(value)
    }
    supportedRanges() {
        return this.driver.supportedRanges()
    }
}

class GyroscopeServer extends Sensor3D implements ds.GyroscopeServerSpec {
    constructor(
        public driver: GyroscopeDriver,
        options: GyroscopeOptions & SensorServerOptions
    ) {
        super(ds.Gyroscope.spec, options)
        driver.gyroSubscribe(this.saveSample)
    }
    reading() {
        return this.lastSample
    }
    readingError() {
        return this.driver?.gyroReadingError()
    }
    readingRange?(): ds.AsyncValue<number> {
        return this.driver.gyroReadingRange()
    }
    async set_readingRange(value: number) {
        await this.driver.gyroSetReadingRange(value)
    }
    supportedRanges() {
        return this.driver.gyroSupportedRanges()
    }
}

/**
 * Start an accelerometer. See also startIMU().
 */
export async function startAccelerometer(
    driver: AccelerometerDriver,
    options: AccelerometerOptions & SensorServerOptions
): Promise<ds.Accelerometer> {
    const server = new AccelerometerServer(driver, options)
    const client = new ds.Accelerometer(startServer(server))
    return client
}

/**
 * Start a combined accelerometer+gyroscope.
 */
export async function startIMU(
    driver: AccelerometerDriver & GyroscopeDriver,
    options: AccelerometerOptions & GyroscopeOptions & SensorServerOptions
) {
    const accelerometer = new ds.Accelerometer(
        startServer(new AccelerometerServer(driver, options))
    )
    const gyroscope = new ds.Accelerometer(
        startServer(new GyroscopeServer(driver, options))
    )
    return { accelerometer, gyroscope }
}
