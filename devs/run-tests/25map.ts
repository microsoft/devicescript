import * as ds from "@devicescript/core"
import { assert } from "@devicescript/core"

class Map<K, V> {
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

function msg(m: string) {
    console.log(m)
}

function testMap() {
    msg("Running map tests...")
    let map = new Map()
    map.set("one", 1)
    map.set("two", 2)
    map.set("three", 3)

    msg("map test set")
    assert(map.size() === 3)

    msg("map test get")
    assert(map.get("one") === 1)

    msg("map test delete")
    map.delete("two")
    assert(map.size() === 2)

    msg("map test clear")
    map.clear()
    assert(map.size() === 0)

    msg("Map tests completed.")
}

// Run the map tests
testMap()