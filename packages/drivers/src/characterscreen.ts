import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    AsyncVoid,
    CharacterScreen,
    CharacterScreenTextDirection,
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
    background = 0
    color = 1

    constructor(
        options: {
            image: Image
            font: Font
            render: () => AsyncVoid
        } & CharacterScreenOptions &
            ServerOptions
    ) {
        super(CharacterScreen.spec, options)
        this._image = options.image
        this._font = options.font
        this._render = options.render
        this._columns = options.columns
        this._rows = options.rows
        this._message = ""
    }

    message() {
        return this._message
    }

    set_message(value: string) {
        this._message = value || ""
    }

    columns() {
        return this._columns
    }

    rows() {
        return this._rows
    }

    private async render() {
        // paint image
        const img = this._image
        const columns = this._columns
        const rows = this._rows
        const message = this._message
        const b = this.background
        const c = this.color
        const f = this._font

        img.fill(b)

        const cw = 8
        const ch = 10
        const m = 1
        const mo = 2

        let row = 0
        let column = 0
        for (const char of message) {
            if (char === "\n") {
                row += 1
                column = 0
            } else {
                if (column < columns)
                    img.print(
                        char,
                        column * (cw + m) + mo,
                        row * (ch + m) + mo,
                        c,
                        f
                    )
                column += 1
            }
            if (row >= rows) break
        }

        // flush buffer
        this._render()
    }
}

export interface CharacterScreenOptions {
    columns: number
    rows: number
}

/**
 * Starts a character screen server
 * on a SSD1306 display.
 */
export async function startSsd1306CharacterScreen(
    options: CharacterScreenOptions & SSD1306Options & ServerOptions
) {
    if (isSimulator()) return new CharacterScreen()

    const font = fontForText("")
    const ssd = new SSD1306Driver(options)
    await ssd.init()

    const server = new CharacterScreenServer({
        image: ssd.image,
        font,
        render: async () => await ssd.show(),
        ...options,
    })

    return new CharacterScreen(startServer(server))
}
