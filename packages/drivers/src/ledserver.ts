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
    /**
     * LED power consumption model
     */
    powerModel?: LedPowerModel
}

export interface LedPowerModel {
    /**
     * Estimate wattage from the red channel
     * @param c 
     * @returns 
     */
    red: (c: number) => number
    /**
     * Estimate wattage from the green channel
     * @param c 
     * @returns 
     */
    green: (c: number) => number
    /**
     * Estimate wattage from the blue channel
     * @param c 
     * @returns 
     */
    blue: (c: number) => number
}

export function ws2812bPowerModel(): LedPowerModel {
    return {
        red: c => c >> 4,
        green: c => c >> 4,
        blue: c => c >> 4,
    }
}

class LedServer extends Server implements ds.LedServerSpec {
    private _intensity: number
    private _actualBrightness: number
    private _columns: number
    private _ledPerPixels: number
    private _waveLength: number
    private _luminousIntensity: number
    private _variant: ds.LedVariant
    private _gamma: number
    private _maxPower: number
    private _powerModel: LedPowerModel

    readonly buffer: PixelBuffer

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
        this._powerModel = options.powerModel
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
        return this._actualBrightness ?? this._intensity
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
        // ignore
    }

    /**
     * Display buffer on hardware
     */
    async show(): Promise<void> {
        let b = this.render()
        b = this.capPower(b)

        // TODO: render b to hardware
    }

    private render() {
        let b = this.buffer
        const brightness = this.actualBrightness()

        // apply fade if needed
        if (brightness < 1) {
            if (b === this.buffer)
                b = b.allocClone()
            fillFade(b, this._intensity)
        }

        // apply gamma
        const g = this._gamma
        if (g && g !== 1) {
            if (b === this.buffer)
                b = b.allocClone()
            b.correctGamma(this._gamma)
        }
        return b
    }

    private capPower(b: PixelBuffer): PixelBuffer {
        if (!this._powerModel || !(this._maxPower > 0)) return b

        const power = estimatePower(b, this._powerModel)
        // if power maxed out, cap and recompute
        if (power > this._maxPower) {
            // compute 80% of max brightness
            // gamma?
            this._actualBrightness = (this._intensity * this._maxPower / power) * 0.8
            this.render()
            // power is not maxed, but residual brightness
        } else if (this._actualBrightness) {
            // update actualbrightness 
            const alpha = 0.1
            const threshold = 0.05
            // towards actual brightness
            this._actualBrightness = (1 - alpha) * this._actualBrightness + alpha * this._intensity
            // when within 10% of brightness, clear flag
            if (Math.abs(this._actualBrightness - this._intensity) < threshold)
                this._actualBrightness = undefined
        }
        return b
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
    const client = new ds.Led(startServer(server));

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