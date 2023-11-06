import {
    JDBus,
    Packet,
    PACKET_REPORT,
    LoggerPriority,
    SRV_LOGGER,
    LoggerCmd,
} from "jacdac-ts"
import { logToConsole } from "./command"

function prefixMsg(shortId: string, content: string) {
    const prefix = content.startsWith(shortId) ? "" : `${shortId}> `
    return `${prefix}${content.trimEnd()}`
}

export function enableLogging(bus: JDBus, logFn = logToConsole) {
    bus.minLoggerPriority = LoggerPriority.Debug
    bus.subscribe(PACKET_REPORT, (pkt: Packet) => {
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
