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

String.prototype.lastIndexOf = function (
    this: string,
    searchString: string,
    position?: number
): number {
    if (position == undefined) position = this.length
    return this.indexOf(searchString, 0, -position)
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
        this.indexOf(
            searchString,
            endPosition - searchString.length,
            endPosition
        ) >= 0
    )
}

String.prototype.startsWith = function (
    this: string,
    searchString: string,
    position?: number
): boolean {
    if (!(position > 0)) position = 0
    return this.indexOf(searchString, position, position + 1) >= 0
}
