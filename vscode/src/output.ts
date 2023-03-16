import {
    Flags,
    FRAME_PROCESS,
    I2CCmd,
    I2CCmdPack,
    I2CStatus,
    JDFrameBuffer,
    Packet,
    PACKET_RECEIVE,
    PACKET_REPORT,
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
                channel = vscode.window.createOutputChannel("DeviceScript - Packets")
            bus.on(FRAME_PROCESS, logFrame)
        } else if (!tracePackets && channel) {
            bus.off(FRAME_PROCESS, logFrame)
        }
    }

    vscode.workspace.onDidChangeConfiguration(
        configure,
        undefined,
        context.subscriptions
    )
    configure()
}

export function activateDeviceScriptOutputChannel(
    extensionMode: vscode.ExtensionMode
) {
    const channel = vscode.window.createOutputChannel("DeviceScript", {
        log: true,
    })
    subSideEvent<SideOutputEvent>("output", msg => {
        const tag = msg.data.from
        let fn = channel.info
        if (tag.endsWith("err")) fn = channel.error
        for (const l of msg.data.lines) fn(tag + ":", l)
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

    bus.subscribe([PACKET_RECEIVE, PACKET_REPORT], (pkt: Packet) => {
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
                channel.appendLine(
                    `> ${toHex(data)} # ${statuses[status]} from ${
                        pkt.friendlyServiceName
                    }`
                )
            } else if (pkt.isCommand) {
                const [address, numRead, writeBuf] = pkt.jdunpack(
                    I2CCmdPack.Transaction
                ) as [number, number, Uint8Array]
                channel.appendLine(
                    `< ${toHex([address])} ${numRead} ${toHex(writeBuf)} # to ${
                        pkt.friendlyServiceName
                    }`
                )
            }
        }
    })
}
