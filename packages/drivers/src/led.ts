import * as ds from "@devicescript/core"
import { PixelBuffer, pixelBuffer } from "@devicescript/runtime"
import { Server, ServerOptions, startServer } from "@devicescript/server"

export interface LedServerOptions {
    length: number
    columns?: number
    maxPower?: number
    ledsPerPixel?: number
    waveLength?: number
    luminousIntensity?: number
    variant?: ds.LedVariant
    // TODO configure pins?
}

class LedServer extends Server implements ds.LedServerSpec {
    private _intensity: number
    private _columns: number
    private _maxPower: number
    private _ledPerPixels: number
    private _waveLength: number
    private _luminousIntensity: number
    private _variant: ds.LedVariant

    readonly buffer: PixelBuffer

    constructor(options: LedServerOptions & ServerOptions) {
        super(ds.Led.spec, options)
        this.buffer = pixelBuffer(options.length)
        this._columns = options.columns
        this._maxPower = options.maxPower
        this._ledPerPixels = options.ledsPerPixel
        this._waveLength = options.waveLength
        this._luminousIntensity = options.luminousIntensity
        this._variant = options.variant
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
        this._intensity = Math.clamp(0, value, 1)
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
    maxPower(): number {
        return this._maxPower
    }
    set_maxPower(value: number): void {
        this._maxPower = value
    }
    ledsPerPixel(): number {
        return this._ledPerPixels
    }
    waveLength(): number {
        return this._waveLength
    }
    luminousIntensity(): number {
        return this._luminousIntensity
    }
    variant(): ds.LedVariant {
        return this._variant
    }
}

/**
 * Starts a programmable LED server.
 * Simulation is supported for up to 64 LEDs; otherwise only the simulator
 * will reflect the state of LEDs.
 * @param options
 * @returns
 */
export async function startLedServer(
    options: LedServerOptions & ServerOptions
) {
    const { length } = options
    const server = new LedServer(options)
    const buffer = server.buffer
    const client = new ds.Led(startServer(server))

    ;(client as any as LedWithBuffer)._buffer = buffer

    client.show = async function () {
        // TODO send buffer to hardware

        // send to register
        if (length <= 64) await client.pixels.write(buffer.buffer)
        else if (ds.isSimulator()) {
            const topic = `jd/${server.serviceIndex}/pixels`
            ds._twinMessage(topic, buffer.buffer)
        }
    }

    return client
}

interface LedWithBuffer {
    _buffer: PixelBuffer
}

declare module "@devicescript/core" {
    interface Led {
        /**
         * Gets the pixel buffer to perform coloring operations.
         * Call `show` to send the buffer to the LED strip.
         */
        buffer(): Promise<PixelBuffer>
        /**
         * Sends the pixel buffer to the LED driver
         */
        show(): Promise<void>
    }
}

ds.Led.prototype.buffer = async function () {
    let b = (this as any as LedWithBuffer)._buffer
    if (!b) {
        const n = await this.numPixels.read()
        ;(this as any as LedWithBuffer)._buffer = b = pixelBuffer(n)
    }
    return b
}

ds.Led.prototype.show = async function () {
    const b = (this as any as LedWithBuffer)._buffer
    if (b && b.length <= 64) await this.pixels.write(b.buffer)
}
