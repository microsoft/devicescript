import * as ds from "@devicescript/core"
import {
    PixelBuffer,
    fillFade,
    pixelBuffer,
} from "@devicescript/runtime"
import { Server, ServerOptions, startServer } from "@devicescript/server"

export interface LedServerOptions {
    /**
     * Number of LEDs
     */
    length: number
    /**
     * Brightness applied to pixels before being rendered.
     * This allocate twice the memory if less than 1 as an additional buffer is needed to compute the color.
     * @default 1
     */
    intensity?: number
    /**
     * Number of columns of a LED matrix
     */
    columns?: number
    ledsPerPixel?: number
    /**
     * For monochrome LEDs, the LED wavelength
     */
    waveLength?: number
    /**
     * The luminous power of the LEDs, is it very bright?
     */
    luminousIntensity?: number
    /**
     * The shape and topology of the LEDs
     */
    variant?: ds.LedVariant
    /**
     * Specify the amount of gamma correction. Default is 2.8, set to 1 to cancel correction.
     * @see {@link https://cdn-learn.adafruit.com/downloads/pdf/led-tricks-gamma-correction.pdf}
     */
    gamma?: number
    /**
     * Maximum supported power for LED strip
     */
    maxPower?: number
}

interface LedPowerModel {
    red: (c: number) => number
    green: (c: number) => number
    blue: (c: number) => number
}

class LedServer extends Server implements ds.LedServerSpec {
    private _intensity: number
    private _columns: number
    private _ledPerPixels: number
    private _waveLength: number
    private _luminousIntensity: number
    private _variant: ds.LedVariant
    private _gamma: number
    private _maxPower: number
    private _power: number

    readonly buffer: PixelBuffer
    powerModel: LedPowerModel

    constructor(options: LedServerOptions & ServerOptions) {
        super(ds.Led.spec, options)
        this.buffer = pixelBuffer(options.length)
        this._intensity = options.intensity ?? 1
        this._columns = options.columns
        this._ledPerPixels = options.ledsPerPixel
        this._waveLength = options.waveLength
        this._luminousIntensity = options.luminousIntensity
        this._variant = options.variant
        this._gamma = options.gamma
        this._maxPower = options.maxPower
        this.powerModel = {
            red: c => c >> 4,
            green: c => c >> 4,
            blue: c => c >> 4,
        }
        this._power = -1
    }

    pixels(): ds.Buffer {
        if (this.buffer.length < 64) return this.buffer.buffer
        else return Buffer.alloc(0)
    }
    set_pixels(value: ds.Buffer): void {
        this.buffer.buffer.blitAt(0, value, 0, value.length)
    }
    intensity(): number {
        return this._intensity
    }
    set_intensity(value: number): void {
        this._intensity = Math.constrain(value, 0, 1)
    }
    actualBrightness(): number {
        return this._intensity
    }
    numPixels(): number {
        return this.buffer.length
    }
    numColumns(): number {
        return this._columns
    }
    ledsPerPixel(): number {
        return this._ledPerPixels
    }
    waveLength(): number {
        return this._waveLength || 0
    }
    luminousIntensity(): number {
        return this._luminousIntensity
    }
    variant(): ds.LedVariant {
        return this._variant
    }
    maxPower(): number {
        return this._maxPower
    }
    set_maxPower(value: number): void {
        this._maxPower = value
    }

    power(): number {
        return this._power
    }

    /**
     * Display buffer on hardware
     */
    async show(): Promise<void> {
        let b = this.buffer
        // full brightness so we can use the buffer as is
        const g = this._gamma
        if (this._intensity < 1 || (g && g !== 1)) {
            const r = b.allocClone()
            if (this._intensity < 1) fillFade(r, this._intensity)
            if (g && g !== 1) r.correctGamma(this._gamma)
            b = r
        }

        if (this._maxPower > 0) {
            this._power = estimatePower(b, this.powerModel)
            if (this._maxPower > this._power) {
                if (b === this.buffer)
                    b = b.allocClone()
                fillFade(b, this._maxPower / this._power)
                this._power = estimatePower(b, this.powerModel)
            }
        }

        // TODO: render b to hardware
    }
}

/**
 * Starts a programmable LED server.
 * Simulation is supported for up to 64 LEDs; otherwise only the simulator
 * will reflect the state of LEDs.
 * @param options
 * @returns
 */
export async function startLed(
    options: LedServerOptions & ServerOptions
): Promise<ds.Led> {
    const { length } = options
    const server = new LedServer(options)
    const client = new ds.Led(startServer(server))

        ; (client as any)._buffer = server.buffer
    client.show = async function () {
        await server.show()
        if (length <= 64) await client.pixels.write(server.buffer.buffer)
        else if (ds.isSimulator()) {
            // the simulator handles brightness separately
            const topic = `jd/${server.serviceIndex}/leds`
            await ds._twinMessage(topic, server.buffer.buffer)
        }
    }

    return client
}

function estimatePower(pixels: PixelBuffer, model: LedPowerModel) {
    let wr = 0;
    let wg = 0;
    let wb = 0
    const s = pixels.start
    const n = pixels.length
    const b = pixels.buffer
    const { red, green, blue } = model
    for (let i = 0; i < n; ++i) {
        const k = (s + i) * 3

        wr += red(b[k])
        wg += green(b[k + 1])
        wb += blue(b[k + 2])
    }
    const w = wr + wg + wb
    return w
}