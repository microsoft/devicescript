Map.prototype.set = function <K, V>(
    this: Map<K, V>,
    key: K,
    value: V
): Map<K, V> {
    this.set(key, value)
    return this
}

Map.prototype.get = function <K, V>(this: Map<K, V>, key: K): V | undefined {
    return this.get(key)
}

Map.prototype.has = function <K, V>(this: Map<K, V>, key: K): boolean {
    return this.has(key)
}

Map.prototype.delete = function <K, V>(this: Map<K, V>, key: K): boolean {
    return this.delete(key)
}

Map.prototype.clear = function <K, V>(this: Map<K, V>): void {
    this.clear()
}

Map.prototype.forEach = function <K, V>(
    this: Map<K, V>,
    callbackFn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
): void {
    this.forEach(callbackFn, thisArg)
}

Map.prototype.keys = function <K, V>(this: Map<K, V>): IterableIterator<K> {
    return this.keys()
}

Map.prototype.values = function <K, V>(this: Map<K, V>): IterableIterator<V> {
    return this.values()
}

Map.prototype.entries = function <K, V>(
    this: Map<K, V>
): IterableIterator<[K, V]> {
    return this.entries()
}
