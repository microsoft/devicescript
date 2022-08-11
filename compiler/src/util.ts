import { toUTF8 } from "./jdutil"

export function oops(msg: string): never {
    throw new Error(msg)
}

export function assert(cond: boolean, msg = "") {
    if (!cond) oops("assertion failed" + (msg ? ": " + msg : ""))
}

export function assertRange(
    min: number,
    v: number,
    max: number,
    desc = "value"
) {
    if (min <= v && v <= max) return
    oops(`${desc}=${v} out of range [${min}, ${max}]`)
}

export function strlen(s: string) {
    return toUTF8(s).length
}

// inverse of camelize()
// setAll -> set_all
export function snakify(s: string) {
    const up = s.toUpperCase()
    const lo = s.toLowerCase()

    // if the name is all lowercase or all upper case don't do anything
    if (s == up || s == lo) return s

    // if the name already has underscores (not as first character), leave it alone
    if (s.lastIndexOf("_") > 0) return s

    const isUpper = (i: number) => s[i] != lo[i]
    const isLower = (i: number) => s[i] != up[i]
    //const isDigit = (i: number) => /\d/.test(s[i])

    let r = ""
    let i = 0
    while (i < s.length) {
        let upperMode = isUpper(i)
        let j = i
        while (j < s.length) {
            if (upperMode && isLower(j)) {
                // ABCd -> AB_Cd
                if (j - i > 2) {
                    j--
                    break
                } else {
                    // ABdefQ -> ABdef_Q
                    upperMode = false
                }
            }
            // abcdE -> abcd_E
            if (!upperMode && isUpper(j)) {
                break
            }
            j++
        }
        if (r) r += "_"
        r += s.slice(i, j)
        i = j
    }

    // If the name is is all caps (like a constant), preserve it
    if (r.toUpperCase() === r) {
        return r
    }
    return r.toLowerCase()
}

export function camelize(name: string) {
    if (!name) return name
    return (
        name[0].toLowerCase() +
        name
            .slice(1)
            .replace(/\s+/g, "_")
            .replace(/_([a-z0-9])/gi, (_, l) => l.toUpperCase())
    )
}

export function upperCamel(name: string) {
    name = camelize(name)
    if (!name?.length) return name
    return name[0].toUpperCase() + name.slice(1)
}

export function addUnique<T>(arr: T[], v: T) {
    let idx = arr.indexOf(v)
    if (idx < 0) {
        idx = arr.length
        arr.push(v)
    }
    return idx
}

export function numSetBits(n: number) {
    let r = 0
    for (let i = 0; i < 32; ++i) if (n & (1 << i)) r++
    return r
}
