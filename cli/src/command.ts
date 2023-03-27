import { LoggerPriority } from "jacdac-ts"

export const GENDIR = ".devicescript"
export const LIBDIR = `${GENDIR}/lib`
export const BINDIR = `${GENDIR}/bin`
export const FLASHDIR = `${GENDIR}/flash`
export const FLASHFILE = `sim.bin`

export const log = console.log

export function debug(...args: any[]) {
    if (!isQuiet) console.debug(...wrapArgs(34, args))
}

export function error(...args: any[]) {
    console.error(...wrapArgs(91, args))
}

export function fatal(msg: string): never {
    error("fatal error: " + msg)
    process.exit(1)
}

export let consoleColors = true

export function setConsoleColors(enabled: boolean) {
    consoleColors = !!enabled
}

// https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit
export function wrapColor(n: number | string, message: string) {
    if (consoleColors) return `\x1B[${n}m${message}\x1B[0m`
    else return message
}

function wrapArgs(color: number, args: any[]) {
    if (
        consoleColors &&
        args.every(e => typeof e == "string" || typeof e == "number")
    ) {
        // if it's just strings & numbers use the coloring
        const msg = args.join(" ")
        return [wrapColor(color, msg)]
    } else {
        // otherwise use the console.log() etc built-in formatting
        return args
    }
}

export function logToConsole(priority: LoggerPriority, message: string) {
    switch (priority) {
        case LoggerPriority.Debug:
            if (!isQuiet) console.debug(wrapColor(34, message))
            break
        case LoggerPriority.Log:
            console.log(wrapColor(96, message))
            break
        case LoggerPriority.Warning:
            console.warn(wrapColor(93, message))
            break
        case LoggerPriority.Error:
            console.error(wrapColor(91, message))
            break
    }
}

export let isVerbose = 0
export let isQuiet = false

export function incVerbose() {
    isVerbose++
    verboseLog(`verbose level: ${isVerbose}`)
}

export function setQuiet(v: boolean) {
    isQuiet = v
}

export function verboseLog(msg: string) {
    if (isVerbose) console.debug(wrapColor(90, msg))
}
