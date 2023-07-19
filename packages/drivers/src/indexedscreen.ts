import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    IndexedScreen,
    IndexedScreenServerSpec,
    LightBulb,
} from "@devicescript/core"
import { Display, Image, Palette } from "@devicescript/graphics"

export interface IndexedScreenOptions {}

class IndexedScreenServer extends Server implements IndexedScreenServerSpec {
    readonly display: Display
    readonly brightness?: LightBulb

    constructor(
        options: {
            display: Display
            brightness?: LightBulb
        } & IndexedScreenOptions &
            ServerOptions
    ) {
        super(ds.IndexedScreen.spec, options)
        this.display = options.display
    }
    startUpdate(
        x: number,
        y: number,
        width: number,
        height: number
    ): ds.AsyncValue<void> {
        // ignored
    }
    setPixels(pixels: ds.Buffer): ds.AsyncValue<void> {
        // ignored
    }
    async intensity(): Promise<number> {
        if (this.brightness) return await this.brightness.intensity.read()
        else return 1
    }
    async set_intensity(value: number) {
        if (this.brightness) await this.brightness.intensity.write(value)
    }
    palette(): Buffer {
        return this.display.palette.packed()
    }
    set_palette(value: Buffer): void {
        this.display.palette.unpack(value)
    }
    bitsPerPixel(): ds.AsyncValue<number> {
        return this.display.image.bpp
    }
    width(): ds.AsyncValue<number> {
        return this.display.image.width
    }
    height(): ds.AsyncValue<number> {
        return this.display.image.height
    }
    widthMajor(): ds.AsyncValue<boolean> {
        return false
    }
    upSampling(): ds.AsyncValue<number> {
        return 1
    }
    rotation(): ds.AsyncValue<number> {
        return 0
    }

    /**
     * Renders the current image on the display.
     * On the device simulator, sends the image to simulator dashboard.
     */
    async show() {
        await this.display.show()
        if (ds.isSimulator()) {
            const topic = `jd/${this.serviceIndex}/pixels`
            await ds._twinMessage(topic, this.display.image.buffer)
        }
    }
}

/**
 * A pseudo-client indexed screen client
 */
export interface IndexScreenClient {
    palette: Palette
    image: Image
    show: () => Promise<void>
}

/**
 * Starts an indexed color screen server on a display.
 * Due to bandwidth limitation, simulation of the screen is only supported
 * for the simulated device.
 */
export async function startIndexedScreen(
    display: Display,
    options: IndexedScreenOptions & ServerOptions = {}
): Promise<IndexScreenClient> {
    await display.init()
    const server = new IndexedScreenServer({
        display,
        ...options,
    })
    // start client that expose it on the bus
    const client = new IndexedScreen(startServer(server))

    return {
        palette: display.palette,
        image: display.image,
        show: async () => await server.show(),
    }
}
