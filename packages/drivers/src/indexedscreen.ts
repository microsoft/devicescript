import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    AsyncVoid,
    IndexedScreen,
    IndexedScreenServerSpec,
    assert,
} from "@devicescript/core"
import { Image, fontForText, Font, Display } from "@devicescript/graphics"

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
        return this.display.palette.packed() as any as number[]
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
}

/**
 * Starts an indexed color screen server on a display.
 */
export async function startIndexedScreen(
    display: Display,
    options: IndexedScreenOptions & ServerOptions = {}
) {
    await display.init()
    const server = new IndexedScreenServer({
        display,
        ...options,
    })
    return new IndexedScreen(startServer(server))
}
