import {
    BuildStatus,
    SideBuildRequest,
    SideBuildResponse,
    SideWatchEvent,
} from "../../cli/src/sideprotocol"
import { sideRequest, subSideEvent } from "./jacdac"
import * as vscode from "vscode"
import { groupBy } from "jacdac-ts"

// let outputCh: vscode.OutputChannel
let diagColl: vscode.DiagnosticCollection
let lastBuildFn = "???.ts"

export function initBuild() {
    // outputCh = vscode.window.createOutputChannel("DevS Build")
    diagColl = vscode.languages.createDiagnosticCollection("DeviceScript")

    subSideEvent("watch", (msg: SideWatchEvent) => {
        showBuildResults(msg.data)
    })

    // clear errors when file edited
    vscode.workspace.onDidChangeTextDocument(ev => {
        diagColl.set(ev.document.uri, [])
    })
}

export function showBuildResults(st: BuildStatus) {
    diagColl.clear()

    const severities = [
        vscode.DiagnosticSeverity.Warning,
        vscode.DiagnosticSeverity.Error,
        vscode.DiagnosticSeverity.Hint,
        vscode.DiagnosticSeverity.Information,
    ]

    const byFile = groupBy(st.diagnostics, s => s.filename)
    for (const fn of Object.keys(byFile)) {
        const diags = byFile[fn].map(d => {
            const p0 = new vscode.Position(d.line - 1, d.column - 1)
            const p1 = new vscode.Position(d.endLine - 1, d.endColumn - 1)
            const msg =
                typeof d.messageText == "string"
                    ? d.messageText
                    : d.messageText.messageText
            const sev =
                severities[d.category] ?? vscode.DiagnosticSeverity.Error
            const vd = new vscode.Diagnostic(new vscode.Range(p0, p1), msg, sev)
            vd.source = "DeviceScript"
            vd.code = d.code
            return vd
        })
        diagColl.set(vscode.Uri.file(fn), diags)
    }

    if (st.deployStatus) vscode.window.showWarningMessage(st.deployStatus)
}

export async function build(fn: string) {
    lastBuildFn = fn
    try {
        const msg: SideBuildRequest = {
            type: "build",
            data: {
                filename: fn,
                watch: true,
                deployTo: "*",
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
