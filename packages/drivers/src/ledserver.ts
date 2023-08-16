import * as ds from "@devicescript/core"
import { PixelBuffer, fillFade } from "@devicescript/runtime"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import { SPI } from "@devicescript/spi"

export interface LedHwConfigWS2812B {
    type: ds.LedStripLightType.WS2812B_GRB

    /**
     * Pin where the strip is connected.
     */
    pin: ds.OutputPin
}

export interface LedHwConfigAPALike {
    type: ds.LedStripLightType.APA102 | ds.LedStripLightType.SK9822

    /**
     * The SPI instance to use.
     */
    spi: SPI

    /**
     * D-pin.
     */
    pinData: ds.OutputPin

    /**
     * C-pin.
     */
    pinClk: ds.OutputPin
}

export type LedHwConfig = LedHwConfigWS2812B | LedHwConfigAPALike

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
     * Specifies the hardware configuration of the light strip.
     */
    hwConfig: LedHwConfig
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
    private _hwConfig: LedHwConfig

    readonly buffer: PixelBuffer

    constructor(options: LedServerOptions & ServerOptions) {
        super(ds.Led.spec, options)
        this.buffer = PixelBuffer.alloc(options.length)
        this._intensity = options.intensity ?? 1
        this._columns = options.columns
        this._ledPerPixels = options.ledsPerPixel
        this._waveLength = options.waveLength
        this._luminousIntensity = options.luminousIntensity
        this._variant = options.variant
        this._gamma = options.gamma
        this._maxPower = options.maxPower
        this._hwConfig = options.hwConfig
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

        if (ds.isSimulator()) return

        const hw = this._hwConfig
        if (hw.type === ds.LedStripLightType.WS2812B_GRB) {
            if (b === this.buffer) b = b.allocClone()
            const buf = b.buffer
            const len = buf.length
            for (let i = 0; i < len; i += 3) {
                const r = buf[i]
                const g = buf[i + 1]
                buf[i] = g
                buf[i + 1] = r
            }
            await ledStripSend(hw.pin, buf)
        } else {
            // 32+0.5*numPixels bits of zeroes at the end
            const numPixels = b.length
            const paddingWords = (32 + (numPixels >> 1) + 31) >> 5
            const txbuf = Buffer.alloc(4 * (1 + numPixels + paddingWords))
            let dst = 4
            let off = b.start * 3
            const buf = b.buffer
            for (let i = 0; i < numPixels; ++i) {
                // IBGR
                txbuf[dst] = 0xff
                txbuf[dst + 1] = buf[off + 2]
                txbuf[dst + 2] = buf[off + 1]
                txbuf[dst + 3] = buf[off]
                dst += 4
                off += 3
            }

            hw.spi.configure({
                mosi: hw.pinData,
                sck: hw.pinClk,
                hz:
                    hw.type === ds.LedStripLightType.SK9822
                        ? 30_000_000
                        : 15_000_000,
            })
            await hw.spi.write(txbuf)
        }
    }

    private render() {
        let b = this.buffer
        const brightness = this.actualBrightness()

        // apply fade if needed
        if (brightness < 1) {
            if (b === this.buffer) b = b.allocClone()
            fillFade(b, this._intensity)
        }

        // apply gamma
        const g = this._gamma
        if (g && g !== 1) {
            if (b === this.buffer) b = b.allocClone()
            b.correctGamma(this._gamma)
        }
        return b
    }

    private capPower(b: PixelBuffer): PixelBuffer {
        if (!(this._maxPower > 0)) return b

        const power = 0 // TODO
        // if power maxed out, cap and recompute
        if (power > this._maxPower) {
            // compute 80% of max brightness
            // gamma?
            this._actualBrightness =
                ((this._intensity * this._maxPower) / power) * 0.8
            this.render()
            // power is not maxed, but residual brightness
        } else if (this._actualBrightness) {
            // update actualbrightness
            const alpha = 0.1
            const threshold = 0.05
            // towards actual brightness
            this._actualBrightness =
                (1 - alpha) * this._actualBrightness + alpha * this._intensity
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
    const client = new ds.Led(startServer(server))

    ;(client as any)._buffer = server.buffer
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

type DsLedStrip = typeof ds & {
    ledStripSend(pin: number, data: Buffer): Promise<void>
}

export async function ledStripSend(pin: ds.OutputPin, data: Buffer) {
    await (ds as DsLedStrip).ledStripSend(pin.gpio, data)
}
