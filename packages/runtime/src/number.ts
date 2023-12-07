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
    /**
     * Return integer parsed from the given string.
     * If the radix is smaller than 2 or bigger than 36, or the first non-whitespace character cannot be converted to a number, NaN is returned.
     * @param string The value to parse, coerced to a string. Leading whitespace in this argument is ignored.
     * @param radix An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the string. If radix is undefined or 0, it is assumed to be 10 except when the number begins with the code unit pairs 0x or 0X, in which case a radix of 16 is assumed.
     */
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
    /** Returns floating point number parsed from the given string, or NaN when the first non-whitespace character cannot be converted to a number.
     * @param string The value to parse, coerced to a string. Leading whitespace in this argument is ignored.
     */
    static parseFloat(string: unknown): number {
        return parseFloat(string as string)
    }
    /** Returns tru if the passed value is finite number, false otherwise.
     * @param number A numeric value
     */
    static isFinite(number: unknown): boolean {
        return (
            number !== Infinity &&
            number !== -Infinity &&
            typeof number === "number" &&
            !isNaN(number)
        )
    }
    /*
     * The boolean value true if the given value is a number that is a safe integer. Otherwise false.
     * @param The value to be tested for being a safe integer.
     */
    static isSafeInteger(number: unknown): boolean {
        return (
            number >= -(2 ** 53 - 1) &&
            number <= 2 ** 53 - 1 &&
            typeof number === "number" &&
            number === Math.round(number)
        )
    }
}
