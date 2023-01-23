import {
    DebugInfo,
    FunctionDebugInfo,
    SrcLocation,
    srcMapEntrySize,
} from "./info"
import { assert, strcmp } from "./jdutil"
import { TODO } from "./util"

function warn(msg: string) {
    return `\u001b[36m${msg}\u001b[0m`
}

export interface StackFrame {
    srcpos: SrcLocation
    fn: FunctionDebugInfo
}

export function parseStackFrame(dbgInfo: DebugInfo, line: string) {
    const resolver = SrcMapResolver.from(dbgInfo)
    const frames: StackFrame[] = []
    const markedLine = line.replace(
        /\bpc=(\d+) \@ (\w*)_F(\d+)/g,
        (full, pcStr, fnName, fnIdxStr) => {
            let pc = parseInt(pcStr)
            if (pc) pc-- // the pc is always one-past
            const fnidx = parseInt(fnIdxStr)
            const fn = dbgInfo.functions[fnidx]
            if (!fn) return full
            pc += fn.startpc
            let info = ""
            if (fnName && fnName != fn.name)
                info = ` fn mismatch ${fnName} vs ${fn.name}`

            const srcpos = resolver.resolvePc(pc)
            const posstr = resolver.posToString(srcpos[0])

            frames.push({
                srcpos,
                fn,
            })
            return `\u001b[36m${posstr}${info}\u001b[0m ${full}`
        }
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
    private pcPos: Uint32Array

    static from(dbg: DebugInfo): SrcMapResolver {
        if (!dbg._resolverCache) {
            Object.defineProperty(dbg, "_resolverCache", {
                value: new SrcMapResolver(dbg),
                enumerable: false,
            })
        }
        return dbg._resolverCache
    }

    private constructor(public dbg: DebugInfo) {}

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
            if (false)
                console.log({
                    pos,
                    lineIdx,
                    at: c[lineIdx],
                    at1: c[lineIdx + 1],
                    t: this.dbg.sources[srcIdx].text.slice(pos, pos + 10),
                })
            if (0 <= lineIdx && lineIdx < c.length)
                return {
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

    posToPc(pos: number) {
        this.initPc()
        TODO()
    }

    posToString(pos: number) {
        const t = this.resolvePos(pos)
        if (t) return `${t.src.path}(${t.line},${t.col})`
        return `(pos=${pos})`
    }

    private initPc() {
        if (this.pcOff) return

        const srcmap = this.dbg.srcmap
        const pcs: number[] = []
        const poss: number[] = []

        let prevPc = 0
        let prevPos = 0

        for (let i = 0; i < srcmap.length; i += srcMapEntrySize) {
            let pos = srcmap[i]
            const len = srcmap[i + 1]
            let pc = srcmap[i + 2]
            assert(pc >= 0 && len >= 0)

            pc += prevPc
            pos += prevPos

            pcs.push(pc)
            poss.push(pos, len)

            prevPc = pc
            prevPos = pos
        }

        this.pcOff = new Uint32Array(pcs)
        this.pcPos = new Uint32Array(poss)
    }

    resolvePc(pc: number): SrcLocation {
        this.initPc()
        let idx = findSmaller(this.pcOff, pc)
        if (idx < 0) idx = 0
        return [this.pcPos[idx * 2], this.pcPos[idx * 2 + 1]]
    }
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
