import {
    JDBus,
    Packet,
    PACKET_REPORT,
    SRV_DEVICE_SCRIPT_MANAGER,
    DeviceScriptManagerCmd,
    LoggerPriority,
    SRV_LOGGER,
    LoggerCmd,
} from "jacdac-ts"

function prefixMsg(shortId: string, content: string) {
    const prefix = content.startsWith(shortId) ? "" : `${shortId}> `
    return `${prefix}${content.trimEnd()}`
}

// https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit
export function wrapColor(n: number | string, message: string) {
    return `\u001B[${n}m${message}\u001B[0m`
}

export function logToConsole(priority: LoggerPriority, message: string) {
    switch (priority) {
        case LoggerPriority.Debug:
            console.debug(wrapColor(34, message))
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

export function enableLogging(bus: JDBus, logFn = logToConsole) {
    bus.minLoggerPriority = LoggerPriority.Debug
    bus.subscribe(PACKET_REPORT, (pkt: Packet) => {
        if (
            pkt.serviceClass === SRV_DEVICE_SCRIPT_MANAGER &&
            pkt.serviceCommand === DeviceScriptManagerCmd.LogMessage
        ) {
            const [counter, flags, content] =
                pkt.jdunpack<[number, number, string]>("u8 u8 s")
            logFn(LoggerPriority.Log, prefixMsg(pkt.device.shortId, content))
        }

        if (
            pkt.serviceClass === SRV_LOGGER &&
            LoggerCmd.Debug <= pkt.serviceCommand &&
            pkt.serviceCommand <= LoggerCmd.Error
        ) {
            const priority =
                LoggerPriority.Debug + (pkt.serviceCommand - LoggerCmd.Debug)
            const content = pkt.jdunpack<[string]>("s")[0]
            logFn(priority, prefixMsg(pkt.device.shortId, content))
        }
    })
}
