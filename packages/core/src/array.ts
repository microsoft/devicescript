Array.prototype.at = function (index) {
    if (index < 0) {
        const length = this.length
        return this[length + index]
    }
    return this[index]
}

Array.prototype.map = function (f) {
    const res: any[] = []
    const length = this.length
    for (let i = 0; i < length; ++i) {
        res.push(f(this[i], i, this))
    }
    return res
}

Array.prototype.forEach = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        f(this[i], i, this)
    }
}

Array.prototype.find = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) return this[i]
    }
    return undefined
}

Array.prototype.findIndex = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) return i
    }
    return -1
}

Array.prototype.findLast = function (f) {
    const length = this.length
    for (let i = length - 1; i >= 0; i--) {
        if (f(this[i], i, this)) return this[i]
    }
    return undefined
}

Array.prototype.findLastIndex = function (f) {
    const length = this.length
    for (let i = length - 1; i >= 0; i--) {
        if (f(this[i], i, this)) return i
    }
    return -1
}

Array.prototype.with = function <T>(index: number, value: T): T[] {
    if (isNaN(index) || typeof index !== "number") {
        throw new TypeError("Index must be a number")
    }

    if (index < -this.length || index >= this.length) {
        throw new RangeError("Index out of bounds")
    }

    if (index < 0) {
        index = this.length + index
    }

    const newArray = [...this]
    newArray[index] = value

    return newArray
}

Array.prototype.filter = function (f) {
    const res: any[] = []
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) res.push(this[i])
    }
    return res
}

Array.prototype.every = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (!f(this[i], i, this)) return false
    }
    return true
}

Array.prototype.fill = function (value, start, end) {
    const length = this.length
    let startIndex = start ?? 0
    if (startIndex < -length) {
        startIndex = 0
    }

    if (startIndex < 0) {
        startIndex = startIndex + length
    }

    let endIndex = end ?? length
    if (endIndex >= length) {
        endIndex = length
    }

    if (endIndex < 0) {
        endIndex = endIndex + length
    }

    if (endIndex < -length) {
        endIndex = 0
    }

    for (let i = startIndex; i < endIndex; ++i) {
        this[i] = value
    }

    return this
}

Array.prototype.some = function (f) {
    const length = this.length
    for (let i = 0; i < length; ++i) {
        if (f(this[i], i, this)) return true
    }
    return false
}

Array.prototype.includes = function (el, fromIndex) {
    const length = this.length
    const start = fromIndex || 0
    for (let i = start; i < length; ++i) {
        if (el === this[i]) return true
    }
    return false
}

Array.prototype.pop = function () {
    const length = this.length - 1
    if (length < 0) return undefined
    const r = this[length]
    this.insert(length, -1)
    return r
}

Array.prototype.shift = function () {
    if (this.length === 0) return undefined
    const r = this[0]
    this.insert(0, -1)
    return r
}

Array.prototype.unshift = function (...elts: any[]) {
    this.insert(0, elts.length)
    for (let i = 0; i < elts.length; ++i) this[i] = elts[i]
    return this.length
}

Array.prototype.indexOf = function (elt, from) {
    const length = this.length
    if (from == undefined) from = 0
    while (from < length) {
        if (this[from] === elt) return from
        from++
    }
    return -1
}

Array.prototype.lastIndexOf = function (elt, from) {
    if (from == undefined) from = this.length - 1
    while (from >= 0) {
        if (this[from] === elt) return from
        from--
    }
    return -1
}

Array.prototype.reduce = function (callbackfn: any, initialValue: any) {
    const len = this.length
    for (let i = 0; i < len; ++i) {
        initialValue = callbackfn(initialValue, this[i], i)
    }
    return initialValue
}

Array.prototype.sort = function <T>(compareFn?: (a: T, b: T) => number) {
    if (!compareFn) {
        compareFn = (a: any, b: any) => {
            a = a + ""
            b = b + ""
            if (a < b) return -1
            else if (a > b) return 1
            else return 0
        }
    }

    for (let i = 1; i < this.length; i++) {
        const current = this[i]
        let j = i - 1
        while (j >= 0 && compareFn(this[j], current) > 0) {
            this[j + 1] = this[j]
            j--
        }
        this[j + 1] = current
    }

    return this
}

Array.prototype.keys = function () {
    console.log ('KEYS', this.length);
    return Array(this.length).fill(0).map((_, i) => i);
}

Buffer.prototype.set = function (other: Buffer, trgOff?: number) {
    if (!trgOff) trgOff = 0
    this.blitAt(trgOff, other, 0, other.length)
}

Buffer.prototype.concat = function (other: Buffer) {
    const r = Buffer.alloc(this.length + other.length)
    r.set(this)
    r.set(other, this.length)
    return r
}

Buffer.prototype.slice = function (start?: number, end?: number) {
    if (end === undefined) end = this.length
    if (start === undefined) start = 0
    const len = end - start
    if (len <= 0 || start >= this.length) return Buffer.alloc(0)
    const r = Buffer.alloc(len)
    r.blitAt(0, this, start, len)
    return r
}

Buffer.concat = function (...buffers: Buffer[]) {
    let size = 0
    for (const b of buffers) {
        size += b.length
    }
    const r = Buffer.alloc(size)
    size = 0
    for (const b of buffers) {
        r.blitAt(size, b, 0, b.length)
        size += b.length
    }
    return r
}

Buffer.prototype.lastIndexOf = function (byte, startOffset, endOffset) {
    if (endOffset == undefined) endOffset = this.length
    return this.indexOf(byte, startOffset, -endOffset)
}
