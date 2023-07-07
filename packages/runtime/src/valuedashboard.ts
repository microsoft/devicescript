import { CharacterScreen } from "@devicescript/core"

function roundWithPrecision(x: number, digits: number): number {
    const EPSILON = 2.220446049250313e-16
    digits = digits | 0
    if (digits <= 0) return Math.round(x)
    if (x === 0) return 0
    let r = 0
    while (r === 0 && digits < 21) {
        const d = Math.pow(10, digits++)
        r = Math.round(x * d + EPSILON) / d
    }
    return r
}

export interface ValueDomain {
    unit?: string
    digits?: number
}

/**
 * Renders a set of name, values on a character display
 */
export class ValueDashboard<T extends Record<string, ValueDomain>> {
    /**
     * Map of name, values
     */
    values: Record<string, string | number | boolean> = {}

    /**
     * Map of name to number domains
     */
    domains: Record<string, ValueDomain> = {}

    /**
     * Line offset value
     */
    public offset = 0

    constructor(
        readonly screen: CharacterScreen,
        domains: Record<string, ValueDomain>
    ) {
        this.domains = domains || {}
    }

    private renderNumber(name: string, value: number) {
        const domain = this.domains[name] || {}
        if (domain.digits !== undefined)
            value = roundWithPrecision(value, domain.digits)
        let r = value + ""
        if (domain.unit) r += domain.unit
        return r
    }

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
                    : typeof value === "number"
                    ? this.renderNumber(name, value)
                    : typeof value === "boolean"
                    ? value
                        ? "v"
                        : "x"
                    : value + ""
            const msv = sv.slice(0, mvl)
            let line = name
            while (line.length + msv.length + 1 <= columns) line += " "
            line += msv
            lines.push(line)
        }
        const msg = lines.join("\n")
        await this.screen.message.write(msg)
    }
}
