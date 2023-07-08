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
    /**
     * Unit of measurement of the value
     */
    unit?: string
    /**
     * Number of significant digits to display
     */
    digits?: number
    /**
     * Prescaling before displaing
     */
    scale?: number
}

/**
 * Renders a set of name, values on a character display.
 */
export class ValueDashboard<T extends Record<string, ValueDomain>> {
    /**
     * Map of name, values
     */
    values: Partial<Record<keyof T, string | number | boolean>> = {}

    /**
     * Map of name to number domains
     */
    domains: T

    /**
     * Line offset value
     */
    public offset = 0

    constructor(readonly screen: CharacterScreen, domains: T) {
        this.domains = domains
    }

    private renderNumber(name: string, value: number) {
        const domain = this.domains[name] || {}
        if (domain.scale) value = value * domain.scale
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

        const names = Object.keys(this.domains)
        let lines: string[] = []
        for (let i = 0; i < rows; ++i) {
            const name = names[i + this.offset]
            if (!name) break
            const value = this.values[name] ?? ""
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
            // start with name and trim as neede
            let line = name.slice(
                0,
                Math.min(name.length, Math.max(4, columns - sv.length - 1))
            )
            while (line.length + sv.length + 1 <= columns) line += " "
            line += sv
            lines.push(line)
        }
        const msg = lines.join("\n")
        await this.screen.message.write(msg)
    }
}
