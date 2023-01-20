import { DebugInfoResolver } from "./compiler"
import { DebugInfo, FunctionDebugInfo, SrcLocation } from "./info"

function warn(msg: string) {
    return `\u001b[36m${msg}\u001b[0m`
}

export interface StackFrame {
    srcpos: SrcLocation
    fn: FunctionDebugInfo
}

export function parseStackFrame(dbgInfo: DebugInfo, line: string) {
    const resolver = DebugInfoResolver.from(dbgInfo)
    const frames: StackFrame[] = []
    const markedLine = line.replace(
        /\bpc=(\d+) \@ (\w*)_F(\d+)/g,
        (full, pcStr, fnName, fnIdxStr) => {
            let pc = parseInt(pcStr)
            if (pc) pc-- // the pc is always one-past
            const fnidx = parseInt(fnIdxStr)
            const fn = dbgInfo.functions[fnidx]
            if (!fn) return full
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
