export class Number {
    /**
     * Returns true if the value passed is an integer, false otherwise.
     * @param number A numeric value.
     */
    static isInteger(number: unknown): boolean {
        if (
            typeof number !== "number" ||
            isNaN(number) ||
            number === Infinity ||
            number === -Infinity
        )
            return false
        return number === Math.round(number)
    }
    /**
     * Returns true if the value passed is an NaN, false otherwise.
     * @param number A numeric value.
     */
    static isNaN(number: unknown): boolean {
        return isNaN(number as number)
    }
    static parseInt(string: unknown, radix?: unknown): number {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let result: number = 0
        let parse: string = (string as string).trim().toUpperCase()
        let base: number = radix as number
        let isNegative: boolean = false
        if (parse.charAt(0) === "-" || parse.charAt(0) === "+") {
            isNegative = parse.charAt(0) === "-"
            parse = parse.slice(1, parse.length)
        }
        if (
            !radix ||
            radix === 0 ||
            isNaN(base) ||
            radix === Infinity ||
            radix === -Infinity
        ) {
            base = parse.charAt(0) === "0" && parse.charAt(1) === "X" ? 16 : 10
        }
        if (base === 16 && parse.charAt(0) === "0" && parse.charAt(1) === "X")
            parse = parse.slice(2, parse.length)
        if (radix < 2 || radix > 32) return NaN
        const validChars = chars.slice(0, radix as number)
        const inputUpperCase: string = parse
        if (validChars.indexOf(parse.charAt(0)) === -1) return NaN
        for (const char of parse) {
            const charValue = validChars.indexOf(char)
            if (charValue === -1) break
            result = result * base + charValue
        }
        return isNegative ? 0 - result : result
    }
}
