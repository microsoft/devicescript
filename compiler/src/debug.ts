import { DebugInfo, FunctionDebugInfo } from "./info"

function warn(msg: string) {
    console.warn(msg)
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
            if (fnName && fnName != fn.name)
                warn(`fn mismatch ${fnName} vs ${fn.name}`)
            for (let i = 0; i < fn.srcmap.length; i += 3) {
                const [line, start, len] = fn.srcmap.slice(i, i + 3)
                if (start <= pc && pc <= start + len) {
                    frames.push({
                        line,
                        fn,
                    })
                    return `\u001b[36m${fn.location?.file}(${line})\u001b[0m ${full}`
                }
            }
            warn(`can't find location ${pc} in ${fn.name}`)
            return full
        }
    )
    return { markedLine, frames }
}
