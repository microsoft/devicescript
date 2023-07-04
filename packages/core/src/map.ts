export class Map<K, V> {
    private map: { key: K; value: V }[] = []

    size(): number {
        return this.map.length
    }

    set(key: K, value: V): void {
        const entry = this.getEntryByKey(key)
        if (entry) {
            entry.value = value
        } else {
            this.map.push({ key, value })
        }
    }

    get(key: K): V | undefined {
        const entry = this.getEntryByKey(key)
        return entry ? entry.value : undefined
    }

    has(key: K): boolean {
        return this.getEntryByKey(key) !== undefined
    }

    delete(key: K): boolean {
        const entryIndex = this.findIndexByKey(key)
        if (entryIndex !== -1) {
            const newArray: { key: K; value: V }[] = []
            for (let i = 0; i < this.map.length; i++) {
                if (i !== entryIndex) {
                    newArray.push(this.map[i])
                }
            }
            this.map = newArray
            return true
        }
        return false
    }

    clear(): void {
        this.map = []
    }

    private getEntryByKey(key: K): { key: K; value: V } | undefined {
        for (let i = 0; i < this.map.length; i++) {
            const entry = this.map[i]
            if (this.areKeysEqual(entry.key, key)) {
                return entry
            }
        }
        return undefined
    }

    private findIndexByKey(key: K): number {
        for (let i = 0; i < this.map.length; i++) {
            const entry = this.map[i]
            if (this.areKeysEqual(entry.key, key)) {
                return i
            }
        }
        return -1
    }

    private areKeysEqual(key1: K, key2: K): boolean {
        return key1 === key2
    }
}

