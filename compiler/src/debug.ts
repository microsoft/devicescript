import { DebugInfo, FunctionDebugInfo } from "./info"

function warn(msg: string) {
    return `\u001b[36m${msg}\u001b[0m`
}

export interface StackFrame {
    line: number
    fn: FunctionDebugInfo
}

export function parseStackFrame(dbgInfo: DebugInfo, line: string) {
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
            for (let i = 0; i < fn.srcmap.length; i += 3) {
                const [line, start, len] = fn.srcmap.slice(i, i + 3)
                if (pc <= start + len) {
                    frames.push({
                        line,
                        fn,
                    })
                    return `\u001b[36m${fn.location?.file}(${line})${info}\u001b[0m ${full}`
                }
            }
            return warn(`can't find location ${pc} in ${fn.name}`) + " " + full
        }
    )
    return { markedLine, frames }
}
