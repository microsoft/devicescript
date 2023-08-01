import * as ds from "@devicescript/core"
import { Display, Image, Palette } from "@devicescript/graphics"

/**
 * Mounts a Display interface over a LED matrix to make it act as a screen.
 * This function allocates one image.
 * @param led
 * @param palette
 * @returns
 */
export async function startLedDisplay(
    led: ds.Led,
    palette?: Palette
): Promise<Display> {
    if (!palette) {
        const waveLength = await led.waveLength.read()
        if (waveLength) palette = Palette.monochrome()
        else palette = Palette.arcade()
    }

    const buffer = await led.buffer()

    const width = (await led.numColumns.read()) || 1
    const height = (buffer.length / width) | 0

    const bpp = palette.length === 2 ? 1 : 4

    const image = Image.alloc(width, height, bpp)

    const init = async () => { }

    const show = async () => {
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const ci = image.get(x, y)
                const c = palette.at(ci)
                if (c !== undefined)
                    buffer.setAt(y * width + x, c)
            }
        }
        await led.show()
    }

    return {
        image,
        palette,
        init,
        show,
    }
}
