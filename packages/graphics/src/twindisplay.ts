import { Display } from "./display"
import { Image } from "./image"
import { Palette } from "./palette"
import * as ds from "@devicescript/core"

class TwinDisplay implements Display {
    constructor(
        readonly topic: string,
        readonly image: Image,
        readonly palette?: Palette
    ) {}

    async show(): Promise<void> {
        if (this.palette)
            await ds._twinMessage(`${this.topic}/palette`, this.palette.buffer)
        await ds._twinMessage(`${this.topic}/image`, this.image.buffer)
    }

    async init() {
        // nothing to do
    }
}

/**
 * Creates a simulator twin display
 * @param topic
 * @param image
 * @param palette
 * @returns
 */
export function createTwinDisplay(
    idOrAddress: string,
    width: number,
    height: number,
    image: Image,
    palette?: Palette
): Display {
    const topic = `display/${idOrAddress}/${width}x${height}`
    return new TwinDisplay(topic, image, palette)
}
