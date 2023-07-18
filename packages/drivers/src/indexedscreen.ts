import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import { IndexedScreen, IndexedScreenServerSpec } from "@devicescript/core"
import { Display, Image, Palette } from "@devicescript/graphics"

export interface IndexedScreenOptions {}

class IndexedScreenServer extends Server implements IndexedScreenServerSpec {
    readonly display: Display

    constructor(
        options: {
            display: Display
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
    intensity(): ds.AsyncValue<number> {
        // TODO: add to display interface?
        return 1
    }
    set_intensity(value: number): ds.AsyncValue<void> {
        // TODO: add to display interface?
    }
    palette(): ds.AsyncValue<number[]> {
        // fix codegen
        return this.display.palette.packed() as number[]
    }
    set_palette(
        blue: number,
        green: number,
        red: number,
        padding: number
    ): ds.AsyncValue<void> {
        // TODO: wrong signature, fix codegen
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
        // TODO: add to display interface?
        return false
    }
    set_widthMajor(value: boolean): ds.AsyncValue<void> {
        // TODO: add to display interface?
    }
    upSampling(): ds.AsyncValue<number> {
        // TODO: add to display interface?
        return 1
    }
    set_upSampling(value: number): ds.AsyncValue<void> {
        // TODO: add to display interface?
    }
    rotation(): ds.AsyncValue<number> {
        // TODO: add to display interface?
        return 0
    }
    set_rotation(value: number): ds.AsyncValue<void> {
        // TODO: add to display interface?
    }

    async show() {
        await this.display.show()
        if (ds.isSimulator()) {
            const topic = `${this.serviceIndex}/pixels`
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
