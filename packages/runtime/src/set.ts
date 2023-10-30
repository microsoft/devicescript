/**
 * Represents a set of values.
 * @interface Map
 * @template T The type of elements in the Set.
 */
export class Set<T> {
    private elements: T[] = []

    /**
     * The number of (unique) elements in Set.
     */
    public size: number

    constructor(elements?: readonly T[] | null) {
        if (elements) {
            this.elements = elements
        }
        this.size = this.elements.length
    }

    /**
     * Appends a new element with a specified value to the end of the Set.
     */
    add(value: T): this {
        if (!this.elements.includes(value)) {
            this.elements.push(value)
            this.size++
        }
        return this
    }

    clear(): void {
        this.elements = []
        this.size = 0
    }

    /**
     * Removes a specified value from the Set.
     * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
     */
    delete(value: T): boolean {
        if (this.elements.includes(value)) {
            this.elements = this.elements.filter(e => e !== value)
            this.size = this.elements.length
            return true
        }
        return false
    }

    /**
     * Executes a provided function once per each value in the Set object, in insertion order.
     */
    forEach(
        callbackfn: (value: T, value2: T, set: Set<T>) => void,
        thisArg?: any
    ): void {
        for (let i = 0; i < this.elements.length; i++) {
            callbackfn(this.elements[i], this.elements[i], this)
        }
    }

    /**
     * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
     */
    has(value: T): boolean {
        return this.elements.includes(value)
    }

    /**
     * @returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries(): IterableIterator<[T, T]> {
        return this.elements.map(e => [e, e])
    }

    /**
     * @returns an iterable of values in the set.
     */
    values(): IterableIterator<T> {
        return this.elements
    }

    /**
     * @returns Despite its name, returns an iterable of the values in the set.
     */
    keys(): IterableIterator<T> {
        return this.values()
    }
}
