import { JSON5TryParse, parseJSON5 } from "@devicescript/compiler"
import {
    Flags,
    FRAME_PROCESS,
    I2CCmd,
    I2CCmdPack,
    I2CStatus,
    JDFrameBuffer,
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
        const { from, lines } = msg.data
        if (from === "verbose") return

        lines
            .map(l => l.trimStart())
            .forEach(l => {
                const fn =
                    (/err/.test(from) && channel.error) ||
                    {
                        ">": channel.info,
                        "!": channel.error,
                        "*": channel.warn,
                        "?": channel.debug,
                        "#": channel.debug,
                    }[l[0]]
                if (fn) fn(from + ":", l.substring(1))
            })
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
    const channel = vscode.window.createOutputChannel("DeviceScript - Data")
    subSideEvent<SideOutputEvent>("output", msg => {
        const { from, lines } = msg.data
        lines
            .map(l => l.trimStart())
            .filter(l => l[0] === "#")
            .map(l => l.substring(1))
            .forEach(line => {
                channel.appendLine(`${from}: ${line}`)
            })
    })

    vscode.debug.onDidStartDebugSession(
        () => {
            channel.clear()
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
