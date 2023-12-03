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
}
