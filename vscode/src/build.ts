import {
    BuildStatus,
    SideBuildRequest,
    SideBuildResponse,
    SideWatchEvent,
} from "../../cli/src/sideprotocol"
import { sideRequest, subSideEvent } from "./jacdac"
import * as vscode from "vscode"

let outputCh: vscode.OutputChannel
let lastBuildFn = "???.ts"

export function initBuild() {
    outputCh = vscode.window.createOutputChannel("DevS Build")

    subSideEvent("watch", (msg: SideWatchEvent) => {
        showBuildResults(msg.data)
    })
}

export function showBuildResults(st: BuildStatus) {
    // TODO use right APIs
    outputCh.appendLine(`build ${lastBuildFn} ${st.success ? "OK" : "Failed"}`)
    for (const msg of st.diagnostics) outputCh.appendLine(msg.formatted)
    if (st.deployStatus) {
        outputCh.appendLine(`deploy status: ${st.deployStatus}`)
    }
}

export async function build(fn: string) {
    lastBuildFn = fn
    try {
        const msg: SideBuildRequest = {
            type: "build",
            data: {
                filename: fn,
                watch: true,
            },
        }
        const res: SideBuildResponse = await sideRequest(msg)
        showBuildResults(res.data)
        return true
    } catch (err) {
        console.error(err) // TODO
        return false
    }
}
