import * as ds from "@devicescript/core"
import { Server, ServerOptions, startServer } from "@devicescript/server"
import {
    AsyncVoid,
    CharacterScreen,
    CharacterScreenServerSpec,
    assert,
} from "@devicescript/core"
import { fontForText, Display } from "@devicescript/graphics"

class CharacterScreenServer
    extends Server
    implements CharacterScreenServerSpec
{
    private _message: string
    private readonly _render: (message: string) => AsyncVoid
    private readonly _columns: number
    private readonly _rows: number

    constructor(
        render: (message: string) => AsyncVoid,
        options: CharacterScreenOptions & ServerOptions
    ) {
        super(ds.CharacterScreen.spec, options)
        this._render = render
        this._columns = options.columns
        this._rows = options.rows

        if (this._rows === undefined || this._columns === undefined)
            throw new Error("rows or columns is missing")

        this._message = ""
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
        await this._render(this._message)
    }
}

export interface CharacterScreenOptions {
    columns?: number
    rows?: number
}

/**
 * Starts a character screen server.
 */
export async function startCharacterScreen(
    render: (message: string) => AsyncVoid,
    options: CharacterScreenOptions & ServerOptions = {}
) {
    const server = new CharacterScreenServer(render, options)
    return new CharacterScreen(startServer(server, options))
}

/**
 * Starts a character screen server on a display.
 */
export async function startCharacterScreenDisplay(
    display: Display,
    options: CharacterScreenOptions & ServerOptions = {}
) {
    const color = 1
    // letter spacing
    const letterSpacing = 1
    // line spacing
    const lineSpacing = 1
    // outer margin
    const margin = 0

    const font = fontForText("")
    await display.init()
    const image = display.image
    await display.image.fill(0)

    let columns = options.columns
    if (columns === undefined)
        columns = Math.floor(
            (image.width - 2 * margin) / (font.charWidth + letterSpacing)
        )
    let rows = options.rows
    if (rows === undefined)
        rows = Math.floor(
            (image.height - 2 * margin) / (font.charHeight + lineSpacing)
        )

    const render = async (message: string) => {
        // paint image
        const img = image
        const ctx = img.allocContext()

        const cw = font.charWidth
        const ch = font.charHeight

        ctx.font = font
        ctx.fillColor = color
        ctx.strokeColor = color
        ctx.clear()
        ctx.translate(margin, margin)

        let row = 0
        let column = 0
        for (const char of message) {
            if (char === "\n") {
                ctx.translate(0, ch + lineSpacing)
                row += 1
                column = 0
            } else {
                if (column < columns) {
                    ctx.fillText(char, column * (cw + letterSpacing), 0)
                }
                column += 1
            }
            if (row >= rows) break
        }

        // flush buffer
        await display.show()
    }

    return await startCharacterScreen(render, options)
}
