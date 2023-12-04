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
        if (!radix) radix = 10
        if (radix < 2 || radix < 2) return NaN
        const validChars: string = (
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" as string
        ).slice(radix as number)

        const inputUpperCase: string = (string as string).toUpperCase()
        let result: number = 0
        for (const char of inputUpperCase) {
            const charValue = validChars.indexOf(char)
            if (charValue === -1) return NaN
            result = result * (radix as number) + charValue
        }
        return result
    }
}
