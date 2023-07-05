export class Map<K, V> {
    private keys: K[] = []
    private values: V[] = []

    size(): number {
        return this.keys.length
    }

    set(key: K, value: V): void {
        const index = this.keys.indexOf(key)
        if (index !== -1) {
            this.values[index] = value
        } else {
            this.keys.push(key)
            this.values.push(value)
        }
    }

    get(key: K): V | undefined {
        const index = this.keys.indexOf(key)
        return index !== -1 ? this.values[index] : undefined
    }

    has(key: K): boolean {
        return this.keys.indexOf(key) !== -1
    }

    delete(key: K): boolean {
        const index = this.keys.indexOf(key)
        if (index !== -1) {
            this.keys.insert(index, -1)
            this.values.insert(index, -1)
            return true
        }
        return false
    }
    
    clear(): void {
        this.keys = []
        this.values = []
    }
}
