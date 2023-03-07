import { AssertionError } from "./core"

/**
 * Starts a BDD assertion chain
 * @param value root value
 * @returns
 */
export function expect<T>(value: T) {
    return new Expect(value, false)
}

export class Expect<T> {
    constructor(readonly value: T, private readonly _not: boolean) {}

    private check(condition: boolean) {
        return this._not ? !condition : condition
    }

    /**
     * Negates the current assertion
     * @returns
     */
    not() {
        return new Expect<T>(this.value, !this._not)
    }

    /**
     * Asserts that the value throws
     */
    toThrow() {
        try {
            ;(this.value as any)()
            throw new AssertionError("toThrow", "Expected to throw")
        } catch (e) {}
    }

    /**
     * Asserts strict equality (===) with the value
     * @param other
     */
    toBe(other: T): void {
        if (this.check(other !== this.value))
            throw new AssertionError(
                "toBe",
                `Expected ${this.value}, got ${other}`
            )
    }
}
