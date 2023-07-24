declare interface Math {
    /**
     * Returns the result of signed 32-bit integer division of two numbers.
     */
    idiv(x: number, y: number): number

    /**
     * Return an integer between 0 and `max` inclusive
     * @param max upper bound
     */
    randomInt(max: number): number
}
