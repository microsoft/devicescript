import { AssertionError } from "./core"

export function expect<T>(value: T) {
    return new Expect(value, false)
}
export class Expect<T> {
    constructor(readonly value: T, private readonly _not: boolean) {}

    private check(condition: boolean) {
        return this._not ? !condition : condition
    }

    not() {
        return new Expect<T>(this.value, !this._not)
    }

    toThrow() {
        if (typeof this.value !== "function")
            throw new AssertionError("toThrow", "Expected function")
        try {
            ;(this.value as any)()
        } catch (e) {
            return
        }
        throw new AssertionError("toThrow", "Expected to throw")
    }

    toBe(other: T): void {
        if (this.check(other !== this.value))
            throw new AssertionError(
                "toBe",
                `Expected ${other}, got ${this.value}`
            )
    }
}
