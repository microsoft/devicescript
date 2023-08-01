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
         * @param image
         */
        writeImage(image: Image): Promise<void>
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
    const columns_size = rows <= 8 ? 1 : (rows + 7) >> 3
    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < columns; ++col) {
            const bit = ((col * columns_size + (row >> 3)) << 3) + (row % 8)
            const dot = data.getBit(bit)
            img.set(col, row, dot ? 1 : 0)
        }
    }

    return img
}

ds.DotMatrix.prototype.writeImage = async function (image: Image) {
    const data = await this.dots.read()
    const columns = await this.columns.read()
    const rows = await this.rows.read()

    if (!data || isNaN(columns) || isNaN(rows)) return

    const w = Math.min(image.width, columns)
    const h = Math.min(image.height, rows)
    const n = data.length
    const columns_size = rows <= 8 ? 1 : (rows + 7) >> 3
    for (let row = 0; row < h; ++row) {
        for (let col = 0; col < w; ++col) {
            const dot = !!image.get(col, row)
            const bit = ((col * columns_size + (row >> 3)) << 3) + (row % 8)
            data.setBit(bit, dot)
        }
    }

    await this.dots.write(data)
}
