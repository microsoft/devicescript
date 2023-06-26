import { Display } from "./display"
import { Image } from "./image"
import { Palette } from "./palette"
import * as ds from "@devicescript/core"

class TwinDisplay implements Display {
    constructor(
        readonly topic: string,
        readonly image: Image,
        readonly palette: Palette
    ) {}

    async show(): Promise<void> {
        await ds._twinMessage(`${this.topic}/palette`, this.palette.buffer)
        await ds._twinMessage(`${this.topic}/image`, this.image.buffer)
    }

    async init() {
        // nothing to do
    }
}

/**
 * Creates a simulator twin display
 * @param topic screen model name and address model/address
 * @param image image to display
 * @param palette palette to use
 * @returns
 */
export function startTwinDisplay(
    idOrAddress: string,
    image: Image,
    palette: Palette
): Display {
    const topic = `display/${idOrAddress}`
    return new TwinDisplay(topic, image, palette)
}
