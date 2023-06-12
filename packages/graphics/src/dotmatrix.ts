import * as ds from "@devicescript/core"
import { Image } from "./image"

declare module "@devicescript/core" {
    interface DotMatrix {
        /**
         * Allocates an image of the dot matrix.
         */
        allocImage(): Promise<Image>
        /**
         * Gets a 1bpp image of the dot matrix.
         */
        readImage(): Promise<Image>

        /**
         * Writes an image to the dots
         * @param img
         */
        writeImage(img: Image): Promise<void>
    }
}

ds.DotMatrix.prototype.allocImage = async function () {
    const columns = await this.columns.read()
    const rows = await this.rows.read()

    if (isNaN(columns) || isNaN(rows)) return undefined

    const img = Image.alloc(columns, rows, 1)
    return img
}

ds.DotMatrix.prototype.readImage = async function () {
    const img = await this.allocImage()
    if (!img) return undefined
    const data = await this.dots.read()
    if (!data) return undefined

    const rows = img.height
    const columns = img.width
    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
            const pixel = img.get(col, row)
            const columnspadded = columns + (8 - (columns % 8))
            const bitindex = row * columnspadded + col
            const dot = data.getBit(bitindex)
            img.set(col, row, dot ? 1 : 0)
        }
    }

    return img
}

ds.DotMatrix.prototype.writeImage = async function (img: Image) {
    const data = await this.dots.read()
    const columns = await this.columns.read()
    const rows = await this.rows.read()

    if (!data || isNaN(columns) || isNaN(rows)) return

    const n = data.length
    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
            const pixel = img.get(col, row)
            const columnspadded = columns + (8 - (columns % 8))
            const bitindex = row * columnspadded + col
            console.log({ n, bitindex })
            data.setBit(bitindex, !!pixel)
        }
    }

    await this.dots.write(data)
}
