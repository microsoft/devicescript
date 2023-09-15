import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    AsyncVoid,
    DotMatrix,
    DotMatrixServerSpec,
    assert,
} from "@devicescript/core"
import { Image, Display } from "@devicescript/graphics"
import { JD_SERIAL_MAX_PAYLOAD_SIZE } from "@devicescript/core/src/jacdac"

class DotMatrixServer extends Server implements DotMatrixServerSpec {
    private _dots: Buffer

    private readonly _image: Image
    private readonly _render: () => AsyncVoid
    private readonly _columns: number
    private readonly _rows: number
    /**
     * Foreground color (palete index)
     */
    color = 1
    marginX = 0
    marginY = 0
    marginCell = 1
    cellWidth

    constructor(
        options: {
            display: Display
            columns: number
            rows: number
        } & DotMatrixOptions &
            ServerOptions
    ) {
        super(ds.DotMatrix.spec, options)
        this._image = options.display.image
        this._render = options.display.show
        this._columns = options.columns
        this._rows = options.rows
        this.cellWidth = options.cellWidth
        if (this.cellWidth === undefined) {
            const cw = Math.floor(
                Math.min(
                    this._image.width / this._columns,
                    this._image.height / this._rows
                )
            )
            this.cellWidth = Math.max(1, cw - this.marginCell)
        }

        const column_size = (this._rows + 7) >> 3
        if (this._columns * column_size > JD_SERIAL_MAX_PAYLOAD_SIZE)
            throw new RangeError("too many dots to fit in a packet")
        this._dots = Buffer.alloc(this._columns * column_size)

        this.marginX =
            (this._image.width -
                (this._columns * (this.cellWidth + this.marginCell) -
                    this.marginCell)) >>
            1
        this.marginY =
            (this._image.height -
                (this._rows * (this.cellWidth + this.marginCell) -
                    this.marginCell)) >>
            1

        // clear screen
        if (this._image) this._image.fill(0)
    }

    dots() {
        return this._dots
    }

    set_dots(value: Buffer) {
        this._dots = value
        this.refresh()
    }

    columns() {
        return this._columns
    }

    rows() {
        return this._rows
    }

    private refresh() {
        if (this._render) this.render.start()
    }

    private async render() {
        assert(!!this._render)

        // paint image
        const img = this._image
        const ctx = img.allocContext()

        const columns = this._columns
        const rows = this._rows
        const dots = this._dots
        const c = this.cellWidth
        const m = this.marginCell
        const cm = c + m
        const column_size = (rows + 7) >> 3

        ctx.fillColor = this.color
        ctx.clear()
        ctx.translate(this.marginX, this.marginY)
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const v =
                    dots[column * column_size + (row >> 3)] & (1 << (row & 7))
                if (v) {
                    ctx.fillRect(column * cm, row * cm, c, c)
                }
            }
        }

        // flush buffer
        await this._render()
    }
}

export interface DotMatrixOptions {
    columns: number
    rows: number
    cellWidth?: number
}

/**
 * Starts a dot matrix server on a display.
 */
export async function startDotMatrix(
    display: Display,
    options: DotMatrixOptions & ServerOptions
) {
    const server = new DotMatrixServer({
        display,
        ...options,
    })

    return new DotMatrix(startServer(server, options))
}
