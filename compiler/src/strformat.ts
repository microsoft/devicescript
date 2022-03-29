function ord(c: string) {
    if (c) return c.charCodeAt(0)
    else return 0
}

function numvalue(c: number) {
    if (ord("0") <= c && c <= ord("9")) return c - ord("0")
    c |= 0x20
    if (ord("a") <= c && c <= ord("z")) return c - ord("a") + 10
    return -1
}

export function strformat(fmt: string, args: ArrayLike<number>) {
    const fmtlen = fmt.length
    let fp = 0
    let dst = ""
    while (fp < fmtlen) {
        let c = fmt[fp++]
        if (c != "{" || fp >= fmtlen) {
            dst += c
            // if we see "}}" we treat it as a single "}"
            if (c == "}" && fp < fmtlen && fmt[fp] == "}") fp++
            continue
        }

        c = fmt[fp++]
        if (c == "{") {
            dst += c
            continue
        }
        let pos = numvalue(ord(c))
        if (pos < 0) {
            dst += "!"
            continue
        }

        let nextp = fp
        while (nextp < fmtlen && fmt[nextp] != "}") nextp++

        let precision = -1
        if (fp < nextp) precision = numvalue(ord(fmt[fp++]))

        fp = nextp + 1

        if (pos >= args.length) {
            dst += "?"
            continue
        }

        if (precision < 0) precision = 6

        // TODO check if +1 needed?
        dst += args[pos].toPrecision(precision + 1)
    }
    return dst
}
