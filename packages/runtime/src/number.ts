export class Number {
    /**
     * Returns true if the value passed is an integer, false otherwise.
     * @param number A numeric value.
     */
    static isInteger(number: unknown): boolean {
        if (typeof number !== "number" || isNaN(number)) return false
        return number === (number | 0)
    }
}