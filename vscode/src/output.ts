import { JSON5TryParse } from "@devicescript/interop"
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
import { Utils } from "vscode-uri"
import type { SideOutputEvent } from "../../cli/src/sideprotocol"
import { readFileText, writeFile } from "./fs"
import { subSideEvent } from "./jacdac"
import { DeviceScriptExtensionState } from "./state"
import { DataRecorder } from "./datarecorder"

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
    state: DeviceScriptExtensionState
) {
    const { context } = state
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
    state: DeviceScriptExtensionState
) {
    const { context } = state
    const { subscriptions, extensionUri } = context
    const channel = vscode.window.createOutputChannel("DeviceScript - Data")
    const recorder = new DataRecorder()

    const parseLine = (line: string): { millis: number; json: any } => {
        const { millis, json } =
            /\s*(?<millis>\d+)\s+(?<json>.*)\s*$/.exec(line)?.groups || {}
        const r = {
            millis: parseInt(millis),
            json: JSON5TryParse(json),
        }
        return r
    }

    subSideEvent<SideOutputEvent>("output", msg => {
        const { from, lines } = msg.data
        lines
            .map(l => l.trimStart())
            .filter(l => l[0] === "#")
            .map(l => l.substring(1))
            .forEach(line => {
                let { millis, json } = parseLine(line)
                channel.appendLine(`${from}: ${line}`)
                if (!recorder.addEntry(millis, json)) {
                    channel.appendLine("  --> invalid format")
                    return
                }
            })
    })

    const clear = () => {
        channel.clear()
        recorder.clear()
    }

    vscode.debug.onDidStartDebugSession(clear, undefined, subscriptions)

    function padZero(n: number): string {
        return n < 10 ? "0" + n : n.toString()
    }

    function formatSortableHumanReadableDate(date: Date): string {
        const year = date.getFullYear()
        const month = padZero(date.getMonth() + 1) // Months are zero-based
        const day = padZero(date.getDate())
        const hours = padZero(date.getHours())
        const minutes = padZero(date.getMinutes())

        return `${year}-${month}-${day}-${hours}-${minutes}`
    }

    subscriptions.push(
        vscode.commands.registerCommand(
            "extension.devicescript.data.download",
            async () => {
                const content = recorder.toCSV()
                clear()
                const { projectFolder } = state.devtools
                if (!projectFolder)
                    await vscode.workspace.openTextDocument({
                        content,
                        language: "json",
                    })
                else {
                    const folder = "data"
                    await vscode.workspace.fs.createDirectory(
                        Utils.joinPath(projectFolder, folder)
                    )
                    const fileName = `${formatSortableHumanReadableDate(
                        new Date()
                    )}`
                    await writeFile(
                        projectFolder,
                        `${folder}/${fileName}.csv`,
                        content
                    )
                    const notebook = (
                        await readFileText(extensionUri, "notebooks/data.ipynb")
                    ).replace(/file\s*=\s*'[^']+\.csv'/, `file='${fileName}.csv'`)
                    const notebookFile = await writeFile(
                        projectFolder,
                        `${folder}/${fileName}.ipynb`,
                        notebook
                    )
                    await vscode.commands.executeCommand(
                        "vscode.openWith",
                        notebookFile,
                        "jupyter-notebook"
                    )
                }
            }
        )
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
