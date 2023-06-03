String.prototype.toLowerCase = function (this: string) {
    return this // TODO
}

String.prototype.toUpperCase = function (this: string) {
    return this // TODO
}

function isSpace(s: string) {
    return " \t\r\n".includes(s)
}

String.prototype.trim = function (this: string) {
    let beg = 0
    while (beg < this.length) {
        if (!isSpace(this[beg])) break
        beg++
    }
    let end = this.length - 1
    while (end >= beg) {
        if (!isSpace(this[end])) break
        end--
    }
    return this.slice(beg, end + 1)
}

String.prototype.indexOf = function (
    this: string,
    searchString: string,
    position?: number
): number {
    const endP = this.length - searchString.length + 1
    if (!(position > 0)) position = 0
    if (searchString === "") return position
    const p0 = searchString.charCodeAt(0)
    for (let i = position; i < endP; ++i) {
        if (
            this.charCodeAt(i) === p0 &&
            this.slice(i, i + searchString.length) === searchString
        )
            return i
    }
    return -1
}

String.prototype.lastIndexOf = function (
    this: string,
    searchString: string,
    position?: number
): number {
    const endP = this.length - searchString.length + 1
    if (!(position > 0)) position = 0
    if (searchString === "") return endP - 1
    const p0 = searchString.charCodeAt(0)
    for (let i = endP - 1; i >= position; i--) {
        if (
            this.charCodeAt(i) === p0 &&
            this.slice(i, i + searchString.length) === searchString
        )
            return i
    }
    return -1
}

String.prototype.includes = function (
    this: string,
    searchString: string,
    position?: number
): boolean {
    return this.indexOf(searchString, position) >= 0
}

String.prototype.endsWith = function (
    this: string,
    searchString: string,
    endPosition?: number
): boolean {
    if (!(endPosition < this.length)) endPosition = this.length
    return (
        this.slice(endPosition - searchString.length, endPosition) ===
        searchString
    )
}

String.prototype.startsWith = function (
    this: string,
    searchString: string,
    position?: number
): boolean {
    if (!(position > 0)) position = 0
    return this.slice(position, position + searchString.length) === searchString
}
