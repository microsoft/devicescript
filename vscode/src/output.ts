import {
    Flags,
    FRAME_PROCESS,
    I2CCmd,
    I2CCmdPack,
    I2CStatus,
    JDFrameBuffer,
    JSONTryParse,
    Packet,
    PACKET_RECEIVE,
    serializeToTrace,
    SRV_I2C,
    toHex,
} from "jacdac-ts"
import * as vscode from "vscode"
import type { SideOutputEvent } from "../../cli/src/sideprotocol"
import { subSideEvent } from "./jacdac"
import { DeviceScriptExtensionState } from "./state"

export function activateJacdacOutputChannel(state: DeviceScriptExtensionState) {
    const { context, bus } = state
    const { subscriptions } = context
    const jacdacConfig = vscode.workspace.getConfiguration(
        "devicescript.jacdac"
    )
    let channel: vscode.OutputChannel = undefined
    const logFrame = (frame: JDFrameBuffer) => {
        const output = channel
        if (!output) return
        const msg = serializeToTrace(frame, 0, bus, {})
        if (msg) output.appendLine(msg)
    }
    // apply settings
    const configure = () => {
        Flags.diagnostics = !!jacdacConfig.get("diagnostics")
        const tracePackets = !!jacdacConfig.get("tracePackets")
        if (tracePackets) {
            if (!channel)
                channel = vscode.window.createOutputChannel(
                    "DeviceScript - Packets"
                )
            bus.on(FRAME_PROCESS, logFrame)
        } else if (!tracePackets && channel) {
            bus.off(FRAME_PROCESS, logFrame)
        }
    }

    vscode.workspace.onDidChangeConfiguration(
        configure,
        undefined,
        subscriptions
    )
    configure()
    vscode.debug.onDidStartDebugSession(
        () => {
            channel?.clear()
        },
        undefined,
        subscriptions
    )
}

export function activateDeviceScriptOutputChannel(
    context: vscode.ExtensionContext
) {
    const { subscriptions, extensionMode } = context
    const channel = vscode.window.createOutputChannel("DeviceScript - Output", {
        log: true,
    })
    subSideEvent<SideOutputEvent>("output", msg => {
        const tag = msg.data.from
        let fn = channel.info
        if (tag.endsWith("err")) fn = channel.error
        for (const l of msg.data.lines) {
            fn(tag + ":", l)
        }
    })
    const redirectConsoleOutput =
        extensionMode == vscode.ExtensionMode.Production
    if (redirectConsoleOutput) {
        // note that this is local to this extension - see inject.js
        console.debug = channel.debug
        console.log = channel.info
        console.warn = channel.warn
        console.error = channel.error
        console.info = console.log
    }

    vscode.debug.onDidStartDebugSession(
        () => {
            channel.clear()
        },
        undefined,
        subscriptions
    )
}

export function activateDeviceScriptDataChannel(
    context: vscode.ExtensionContext
) {
    const { subscriptions, extensionMode } = context
    const channel = vscode.window.createOutputChannel("DeviceScript - Data", {        
        log: true,
    })

    const splitPair = (kv: string): [string, string] => {
        const i = kv.indexOf(":")
        if (i < 0) return [kv, ""]
        else return [kv.slice(0, i), kv.slice(i + 1)]
    }

    const parseLine = (line: string) => {
        // json entry
        const { source, entries } =
            /^(.*>)?\s*(?<source>\{\s*(?<entries>[^}]+)\})\s*$/.exec(line)
                ?.groups || {}
        if (!source) return

        // proper formatted json
        let json: any = JSONTryParse(source)
        if (json === undefined && entries) {
            json = {}
            entries
                .split(/\s*,\s*/g)
                .map(splitPair)
                .forEach(([key, value]) => {
                    json[key] = JSONTryParse(value) ?? value
                })
        }

        // serialize
        if (json !== undefined) {
            json["_t"] = Date.now()
            channel.appendLine(JSON.stringify(json) + ",")
        }
    }

    subSideEvent<SideOutputEvent>("output", msg =>
        msg.data.lines.forEach(parseLine)
    )

    vscode.debug.onDidStartDebugSession(
        () => {
            channel.clear()
            channel.appendLine("[")
        },
        undefined,
        subscriptions
    )
}

export function activateDeviceScriptI2COutputChannel(
    state: DeviceScriptExtensionState
) {
    const { bus } = state
    let channel: vscode.OutputChannel

    const statuses = {
        [I2CStatus.OK]: "ok",
        [I2CStatus.NAckAddr]: "nack addr",
        [I2CStatus.NoI2C]: "no i2c",
        [I2CStatus.NAckData]: "nack data",
    }

    bus.subscribe(PACKET_RECEIVE, (pkt: Packet) => {
        if (
            pkt.serviceClass === SRV_I2C &&
            (pkt.isCommand || pkt.isReport) &&
            pkt.serviceCommand === I2CCmd.Transaction
        ) {
            if (!channel) {
                channel =
                    vscode.window.createOutputChannel("DeviceScript - I2C")
            }

            if (pkt.isReport) {
                const [status, data] = pkt.jdunpack(
                    I2CCmdPack.TransactionReport
                ) as [I2CStatus, Uint8Array]
                channel.appendLine(`${toHex(data)}\t--> ${statuses[status]}`)
            } else if (pkt.isCommand) {
                const [address, numRead, writeBuf] = pkt.jdunpack(
                    I2CCmdPack.Transaction
                ) as [number, number, Uint8Array]
                channel.appendLine(
                    `${toHex([address])} ${numRead} ${toHex(writeBuf)}\t<--`
                )
            }
        }
    })
}
