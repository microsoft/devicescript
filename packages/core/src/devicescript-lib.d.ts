declare interface Math {
    /**
     * Returns the result of signed 32-bit integer division of two numbers.
     */
    idiv(x: number, y: number): number

    /**
     * Clamp `v` to between `low` and `high` inclusive.
     * @param low lower bound
     * @param v value to clamp
     * @param hi upper bound
     */
    clamp(low: number, v: number, hi: number): number

    /**
     * Return an integer between 0 and `max` inclusive
     * @param max upper bound
     */
    randomInt(max: number): number
}
