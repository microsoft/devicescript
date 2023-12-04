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
     * Returns floating point number parsed from the given string, or NaN when the first non-whitespace character cannot be converted to a number.
     * @param string The value to parse, coerced to a string. Leading whitespace in this argument is ignored.
     */
    static parseFloat(string: unknown): number {
        return parseFloat(string as string)
    }
     * Returns tru if the passed value is finite number, false otherwise.
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
