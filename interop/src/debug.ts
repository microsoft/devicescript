import {
    DebugInfo,
    FunctionDebugInfo,
    SrcLocation,
    srcMapEntrySize,
} from "./info"

function warn(msg: string) {
    return `\u001b[36m${msg}\u001b[0m`
}

function strcmp(a: string, b: string) {
    if (a == b) return 0
    if (a < b) return -1
    else return 1
}

export interface StackFrame {
    srcpos: SrcLocation
    fn: FunctionDebugInfo
}

export function parseStackFrame(dbgInfo: DebugInfo, line: string) {
    const resolver = dbgInfo ? SrcMapResolver.from(dbgInfo) : undefined
    const frames: StackFrame[] = []

    function expand(pcStr: string, fnName: string, fnIdxStr: string) {
        let pc = parseInt(pcStr)
        if (pc) pc-- // the pc is always one-past
        const fnidx = parseInt(fnIdxStr)
        const fn = dbgInfo?.functions[fnidx]
        let pcInfo = `as F${fnIdxStr}_pc${pcStr}`
        if (!fn) {
            if (fnName == "inline") fnName = `inline_F${fnIdxStr}`
            return `at ${fnName} [${pcInfo}] (<anonymous>)`
        }
        pc += fn.startpc
        if (fnName && fnName != fn.name) pcInfo += "_mismatch_" + fn.name

        const srcpos = resolver.resolvePc(pc)
        const posstr = resolver.posToString(srcpos[0])

        frames.push({
            srcpos,
            fn,
        })
        return `at ${fnName} [${pcInfo}] \u001b[36m(${posstr})\u001b[0m`
    }

    const markedLine = line
        .replace(/\bpc=(\d+) \@ (\w*)_F(\d+)/g, (_, pc, fnName, fnIdx) =>
            expand(pc, fnName, fnIdx)
        )
        .replace(/at\s+(\w*)_F(\d+)\s+\(pc:(\d+)\)/g, (_, fnName, fnIdx, pc) =>
            expand(pc, fnName, fnIdx)
        )
    return { markedLine, frames }
}

function findSmaller(arr: Uint32Array, v: number) {
    let l = 0
    let r = arr.length - 1
    while (l <= r) {
        const m = (l + r) >> 1
        if (arr[m] < v) l = m + 1
        else r = m - 1
    }
    r--
    if (r < 0) r = 0
    while (r < arr.length && v >= arr[r]) r++
    return r - 1
}

export class SrcMapResolver {
    private fileOff: Uint32Array
    private fileCache: Uint32Array[]
    private pcOff: Uint32Array
    private pcPos: SrcMapEntry[]

    static from(dbg: DebugInfo): SrcMapResolver {
        if (!dbg._resolverCache) {
            Object.defineProperty(dbg, "_resolverCache", {
                value: new SrcMapResolver(dbg),
                enumerable: false,
            })
        }
        return dbg._resolverCache
    }

    private constructor(public dbg: DebugInfo) {
        dbg.sources.forEach((s, idx) => {
            s.index = idx
        })
    }

    private initPos() {
        if (this.fileCache) return
        this.fileCache = []
        let off = 0
        this.fileOff = new Uint32Array(
            this.dbg.sources.map(src => {
                const lineoff = [0]
                const text = src.text
                for (let pos = 0; pos < text.length; ++pos) {
                    if (text.charCodeAt(pos) == 10) lineoff.push(pos + 1)
                }
                this.fileCache.push(new Uint32Array(lineoff))
                const o = off
                off += src.length
                return o
            })
        )
    }

    resolvePos(pos: number) {
        this.initPos()
        const srcIdx = findSmaller(this.fileOff, pos)
        const c = this.fileCache[srcIdx]
        if (c) {
            pos -= this.fileOff[srcIdx]
            const lineIdx = findSmaller(c, pos)
            if (0 <= lineIdx && lineIdx < c.length)
                return {
                    fileOff: this.fileOff[srcIdx],
                    lineOff: c[lineIdx],
                    filepos: pos,
                    line: lineIdx + 1,
                    col: pos - c[lineIdx] + 1,
                    src: this.dbg.sources[srcIdx],
                }
        }
        return null
    }

    locationToPos(srcIdx: number, line: number, column: number) {
        this.initPos()
        const s = this.dbg.sources[srcIdx]
        return (
            this.fileOff[srcIdx] + this.fileCache[srcIdx][line - 1] + column - 1
        )
    }

    posToString(pos: number) {
        const t = this.resolvePos(pos)
        if (t) return `${t.src.path}:${t.line}:${t.col}`
        return `(pos=${pos})`
    }

    private initPc() {
        if (this.pcOff) return

        const srcmap = this.dbg.srcmap
        const pcs: number[] = []
        this.pcPos = []

        let prevPc = 0
        let prevPos = 0

        for (let i = 0; i < srcmap.length; i += srcMapEntrySize) {
            let pos = srcmap[i]
            const len = srcmap[i + 1]
            let pc = srcmap[i + 2]
            if (pc < 0 || len < 0) throw new Error("invalid srcmap entry")

            pc += prevPc
            pos += prevPos

            pcs.push(pc)

            this.pcPos.push({
                pos,
                end: pos + len,
                pc,
            })

            prevPc = pc
            prevPos = pos
        }

        this.pcOff = new Uint32Array(pcs)
    }

    filePos(srcIdx: number): SrcLocation {
        this.initPos()
        const s = this.dbg.sources[srcIdx]
        return s ? [this.fileOff[srcIdx], s.length] : undefined
    }

    srcMapForPos(loc: SrcLocation) {
        this.initPc()
        return filterOverlapping(this.pcPos, loc)
    }

    resolvePc(pc: number): SrcLocation {
        this.initPc()
        let idx = findSmaller(this.pcOff, pc)
        if (idx < 0) idx = 0
        const e = this.pcPos[idx]
        return [e.pos, e.end - e.pos]
    }
}

export function srcLocOverlaps(a: SrcLocation, b: SrcLocation) {
    if (a[0] <= b[0]) return b[0] <= a[0] + a[1]
    else return a[0] <= b[0] + b[1]
}

export interface SrcMapEntry {
    pos: number
    end: number
    pc: number
}

export function filterOverlapping(arr: SrcMapEntry[], loc: SrcLocation) {
    if (!loc) return []
    return arr.filter(e => srcLocOverlaps(loc, [e.pos, e.end - e.pos]))
}

export function toTable(header: string[], rows: (string | number)[][]) {
    rows = rows.slice()
    rows.unshift(header)
    const maxlen: number[] = []
    const isnum: boolean[] = []
    for (const row of rows) {
        for (let i = 0; i < row.length; ++i) {
            maxlen[i] = Math.min(
                Math.max(maxlen[i] ?? 2, toStr(row[i]).length),
                30
            )
            isnum[i] ||= typeof row[i] == "number"
        }
    }
    let hd = true
    let res = ""
    for (const row of rows) {
        for (let i = 0; i < maxlen.length; ++i) {
            let w = toStr(row[i])
            const missing = maxlen[i] - w.length
            if (missing > 0) {
                const pref = " ".repeat(missing)
                if (isnum[i]) w = pref + w
                else w = w + pref
            }
            res += w
            if (i != maxlen.length - 1) res += " | "
        }
        res += "\n"
        if (hd) {
            hd = false
            for (let i = 0; i < maxlen.length; ++i) {
                let w = isnum[i]
                    ? "-".repeat(maxlen[i] - 1) + ":"
                    : "-".repeat(maxlen[i])
                res += w
                if (i != maxlen.length - 1) res += " | "
            }
            res += "\n"
        }
    }

    return res.replace(/\s+\n/gm, "\n")

    function toStr(n: string | number | null) {
        return (n ?? "") + ""
    }
}

export function computeSizes(dbg: DebugInfo) {
    const funs = dbg.functions.slice()
    funs.sort((a, b) => a.size - b.size || strcmp(a.name, b.name))
    let ftotal = 0
    for (const f of funs) {
        ftotal += f.size
    }
    let dtotal = 0
    for (const v of Object.values(dbg.sizes)) dtotal += v
    const loc = SrcMapResolver.from(dbg)
    return (
        "## Data\n\n" +
        toTable(
            ["Size", "Name"],
            Object.keys(dbg.sizes)
                .map(k => [dbg.sizes[k], k])
                .concat([[dtotal, "Data TOTAL"]])
        ) +
        "\n## Functions\n\n" +
        toTable(
            ["Size", "Name", "Users"],
            funs
                .map(f => [f.size, "`" + f.name + "`", locs2str(f.users)])
                .concat([
                    [ftotal, "Function TOTAL"],
                    [dtotal + ftotal, "TOTAL"],
                ])
        )
    )

    function loc2str(l: SrcLocation) {
        return loc.posToString(l[0])
    }

    function locs2str(ls: SrcLocation[]) {
        const maxlen = 10
        let r = ls.slice(0, maxlen).map(loc2str).join(", ")
        if (ls.length > maxlen) r += "..."
        return r
    }
}
