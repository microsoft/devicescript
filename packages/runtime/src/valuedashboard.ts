import { CharacterScreen } from "@devicescript/core"

/**
 * Renders a set of name, values on a character display
 */
export class ValueDashbaord {
    /**
     * Map of name, values
     */
    readonly values: Record<string, string | number | boolean> = {}
    /**
     * Line offset value
     */
    public offset = 0

    constructor(readonly screen: CharacterScreen) {}

    /**
     * Renders the current values to the character display
     */
    async show() {
        const rows = await this.screen.rows.read()
        const columns = await this.screen.columns.read()

        const names = Object.keys(this.values)
        let lines: string[] = []
        for (let i = 0; i < rows; ++i) {
            const name = names[i + this.offset]
            if (!name) break
            const value = this.values[name]
            if (value === undefined) break
            // max value length
            const mvl = columns - name.length - 1
            const sv =
                typeof value === "string"
                    ? value
                    : typeof value === "boolean"
                    ? "v"
                    : value + ""
            const msv = sv.slice(0, mvl)
            let line = name
            while (line.length - sv.length > 1) line += " "
            line += msv
        }
        const msg = lines.join("\n")
        await this.screen.message.write(msg)
    }
}
