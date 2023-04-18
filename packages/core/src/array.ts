
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
