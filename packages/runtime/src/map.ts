/**
 * Represents a collection of key-value pairs.
 * @interface Map
 * @template K The type of keys in the Map.
 * @template V The type of values in the Map.
 */

export class Map<K, V> {
    private keys: K[] = []
    private values: V[] = []

    /**
     * Creates a new Map object.
     * @param entries An optional array or iterable containing key-value pairs to initialize the Map.
     */
    constructor(entries?: Array<readonly [K, V]> | null) {
        if (entries) {
            for (let i = 0; i < entries.length; i++) {
                const [key, value] = entries[i]
                this.set(key, value)
            }
        }
    }

    /**
     * Gets the number of key-value pairs in the Map.
     * @readonly
     */
    size(): number {
        return this.keys.length
    }
    /**
     * Returns the iterator for the key-value pairs of the Map, in insertion order.
     * @returns The iterator for the key-value pairs of the Map.
     */

    /**
     * Sets the value for the specified key in the Map.
     * @param key The key to set.
     * @param value The value to set for the key.
     * @returns The updated Map object.
     */
    set(key: K, value: V): void {
        const index = this.keys.indexOf(key)
        if (index !== -1) {
            this.values[index] = value
        } else {
            this.keys.push(key)
            this.values.push(value)
        }
    }

    /**
     * Gets the value associated with the specified key in the Map.
     * @param key The key to retrieve the value for.
     * @returns The value associated with the key, or undefined if the key doesn't exist in the Map.
     */
    get(key: K): V | undefined {
        const index = this.keys.indexOf(key)
        return index !== -1 ? this.values[index] : undefined
    }

    /**
     * Checks if the specified key exists in the Map.
     * @param key The key to check for existence.
     * @returns A boolean indicating whether the key exists in the Map.
     */
    has(key: K): boolean {
        return this.keys.indexOf(key) !== -1
    }

    /**
     * Deletes the specified key and its associated value from the Map.
     * @param key The key to delete.
     * @returns A boolean indicating whether the key was successfully deleted.
     */
    delete(key: K): boolean {
        const index = this.keys.indexOf(key)
        if (index !== -1) {
            this.keys.insert(index, -1)
            this.values.insert(index, -1)
            return true
        }
        return false
    }

    /**
     * Removes all key-value pairs from the Map.
     */
    clear(): void {
        this.keys = []
        this.values = []
    }

    /**
     * Executes a provided function once for each key-value pair in the Map.
     * @param callbackFn The function to execute for each key-value pair.
     * @param thisArg The value to use as "this" when executing the callback function.
     */
    forEach(
        callbackFn: (value: V, key: K, map: Map<K, V>) => void,
        thisArg?: any
    ): void {
        for (let i = 0; i < this.keys.length; i++) {
            callbackFn(this.values[i], this.keys[i], this)
        }
    }

    /**
     * Returns an iterator for the keys of the Map, in insertion order.
     * @returns An iterator for the keys of the Map.
     */
    keysIterator(): IterableIterator<K> {
        return this.keys
    }

    /**
     * Returns an iterator for the values of the Map, in insertion order.
     * @returns An iterator for the values of the Map.
     */
    valuesIterator(): IterableIterator<V> {
        return this.values
    }

    /**
     * Returns an iterator for the key-value pairs of the Map, in insertion order.
     * @returns An iterator for the key-value pairs of the Map.
     */
    entries(): IterableIterator<[K, V]> {
        const entries: [K, V][] = []
        for (let i = 0; i < this.keys.length; i++) {
            entries.push([this.keys[i], this.values[i]])
        }
        return entries
    }
}
