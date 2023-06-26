import * as ds from "@devicescript/core"
import { Image } from "@devicescript/graphics"

export class DriverError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "DriverError"
    }
}

export function throttle<T>(
    ms: number,
    f: () => ds.AsyncValue<T>
): () => ds.AsyncValue<T> {
    let last = 0
    let lastV: T = undefined
    let reading = false
    return async () => {
        while (reading) await ds.sleep(10)
        const n = ds.millis()
        if (n - last < ms) return lastV
        reading = true
        try {
            lastV = await f()
            last = n
        } finally {
            reading = false
        }
        return lastV
    }
}
