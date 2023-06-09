import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    AsyncVoid,
    CharacterScreen,
    CharacterScreenTextDirection,
    assert,
    isSimulator,
} from "@devicescript/core"
import { SSD1306Driver, SSD1306Options } from "./ssd1306"
import { Image, fontForText, Font } from "@devicescript/graphics"

class CharacterScreenServer extends Server {
    private _message: string

    private readonly _image: Image
    private readonly _font: Font
    private readonly _render: () => AsyncVoid
    private readonly _columns: number
    private readonly _rows: number
    /**
     * Background color (palete index)
     */
    background = 0
    /**
     * Foreground color (palete index)
     */
    color = 1
    // letter spacing
    letterSpacing = 1
    // line spacing
    lineSpacing = 1
    // outer margin
    margin = 2

    constructor(
        options: {
            image: Image
            font: Font
            render: () => AsyncVoid
        } & CharacterScreenOptions &
            ServerOptions
    ) {
        super(ds.CharacterScreen.spec, options)
        this._image = options.image
        this._font = options.font
        this._render = options.render
        this._columns = options.columns
        this._rows = options.rows

        if (this._columns === undefined)
            this._columns = Math.floor(
                (this._image.width - 2 * this.margin) /
                    (this._font.charWidth + this.letterSpacing)
            )
        if (this._rows === undefined)
            this._rows = Math.floor(
                (this._image.height - 2 * this.margin) /
                    (this._font.charHeight + this.lineSpacing)
            )

        if (this._rows === undefined || this._columns === undefined)
            throw new Error("rows or columns is missing")

        this._message = ""

        // clear screen
        if (this._image) this._image.fill(this.background)
    }

    message() {
        return this._message
    }

    set_message(value: string) {
        const old = this._message
        this._message = value || ""
        if (old !== this._message) this.refresh()
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
        const columns = this._columns
        const rows = this._rows
        const message = this._message
        const b = this.background
        const c = this.color
        const f = this._font

        const cw = this._font.charWidth
        const ch = this._font.charHeight
        const letterSpacing = this.letterSpacing
        const lineSpacing = this.lineSpacing
        const margin = this.margin

        img.fill(b)
        let row = 0
        let column = 0
        for (const char of message) {
            if (char === "\n") {
                row += 1
                column = 0
            } else {
                if (column < columns) {
                    img.print(
                        char,
                        column * (cw + letterSpacing) + margin,
                        row * (ch + lineSpacing) + margin,
                        c,
                        f
                    )
                }
                column += 1
            }
            if (row >= rows) break
        }

        // flush buffer
        await this._render()
    }
}

export interface CharacterScreenOptions {
    columns?: number
    rows?: number
}

/**
 * Starts a character screen server
 * on a SSD1306 display.
 */
export async function startSsd1306CharacterScreen(
    options: CharacterScreenOptions & SSD1306Options & ServerOptions
) {
    const font = fontForText("")
    let image: Image
    let render: () => AsyncVoid
    if (isSimulator()) {
        image = Image.alloc(options.width, options.height, 1)
    } else {
        const ssd = new SSD1306Driver(options)
        await ssd.init()
        image = ssd.image
        render = async () => await ssd.show()
    }
    const server = new CharacterScreenServer({
        image,
        font,
        render,
        ...options,
    })

    return new CharacterScreen(startServer(server))
}
