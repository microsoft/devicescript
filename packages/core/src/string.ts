function isSpace(s: string) {
    return (
        " \t\n\r\u000B\u000C\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff".indexOf(
            s
        ) >= 0
    )
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
    if (position === undefined) position = this.length
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

String.prototype.split = function (
    this: string,
    separator?: string,
    limit?: number
): string[] {
    const S = this
    // https://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype.split
    const A: string[] = []
    let lim = 0
    if (limit === undefined) lim = (1 << 29) - 1
    // spec says 1 << 53, leaving it at 29 for constant folding
    else if (limit < 0) lim = 0
    else lim = limit | 0
    const s = S.length
    let p = 0
    const R = separator
    if (lim === 0) return A
    if (separator === undefined) {
        A[0] = S
        return A
    }
    if (s === 0) {
        let z = splitMatch(S, 0, R)
        if (z > -1) return A
        A[0] = S
        return A
    }
    let T: string
    let q = p
    while (q !== s) {
        let e = splitMatch(S, q, R)
        if (e < 0) q++
        else {
            if (e === p) q++
            else {
                T = S.slice(p, q)
                A.push(T)
                if (A.length === lim) return A
                p = e
                q = p
            }
        }
    }
    T = S.slice(p, q)
    A.push(T)
    return A
}

String.prototype.replace = function (
    this: string,
    searchValue: string,
    replaceValue: string
): string {
    const match = this.indexOf(searchValue)
    if (match === -1) return this
    return (
        this.slice(0, match) +
        replaceValue +
        this.slice(match + searchValue.length)
    )
}

String.prototype.replaceAll = function (
    this: string,
    searchValue: string,
    replaceValue: string
): string {
    let resultString = this
    let match = this.indexOf(searchValue)
    while (match !== -1) {
        resultString =
            resultString.slice(0, match) +
            replaceValue +
            resultString.slice(match + searchValue.length)
        match = resultString.indexOf(searchValue)
    }
    return resultString
}
function splitMatch(S: string, q: number, R: string): number {
    return S.indexOf(R, q, q + 1) === q ? q + R.length : -1
}
