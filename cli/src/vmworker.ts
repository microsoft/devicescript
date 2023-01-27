import { ChildProcess, fork, spawn } from "node:child_process"
import { addReqHandler, DevToolsClient, sendOutput } from "./sidedata"
import {
    SideStartVmReq,
    SideStartVmResp,
    SideStopVmReq,
    SideStopVmResp,
} from "./sideprotocol"

let worker: ChildProcess

export function waitForEvent<T>(
    ms: number,
    f: (cb: (v?: T) => void) => void
): Promise<T | undefined> {
    let done = false
    return new Promise<T>(resolve => {
        const resolveWrapped = (v: T) => {
            if (!done) {
                done = true
                resolve(v)
            }
        }
        f(resolveWrapped)
        setTimeout(() => resolveWrapped(undefined), ms)
    })
}

export function lineBuffer(cb: (lines: string[]) => void) {
    let acc = ""
    let to: any
    const flush = () => {
        to = null
        if (acc) {
            const lines = [acc]
            acc = ""
            cb(lines)
        }
    }
    return (str: string) => {
        if (str.includes("\r")) str = str.replace(/\r/g, "")
        if (acc) str = acc + str
        if (str.includes("\n")) {
            const lines = str.split("\n")
            acc = lines.pop()
            cb(lines)
        } else {
            acc = str
        }
        if (to) clearTimeout(to)
        if (acc) to = setTimeout(flush, 200)
    }
}

export async function stopVmWorker() {
    if (worker) {
        try {
            if (worker.exitCode === null && worker.signalCode === null) {
                worker.kill()
                await waitForEvent(500, f => worker.on("exit", f))
            }
            worker.kill("SIGKILL")
        } catch {}
        worker = null
    }
}

export async function startVmWorker(
    req: SideStartVmReq,
    sender: DevToolsClient
) {
    const args = req.data
    await stopVmWorker()

    if (args.nativePath)
        worker = spawn(args.nativePath, ["-n", "-w", "8082"], {
            shell: false,
        })
    else worker = fork(__filename, ["vm", "--devtools"], { silent: true })

    worker.stdin.end()
    worker.stdout.setEncoding("utf-8")
    worker.stderr.setEncoding("utf-8")

    worker.on("exit", (code, signal) => {
        sendOutput(sender, "vm-err", [`Exit code: ${code} ${signal ?? ""}`])
    })

    worker.stdout.on(
        "data",
        lineBuffer(lines => sendOutput(sender, "vm", lines))
    )
    worker.stderr.on(
        "data",
        lineBuffer(lines => sendOutput(sender, "vm-err", lines))
    )
    return {}
}

export function initVMCmds() {
    addReqHandler<SideStartVmReq, SideStartVmResp>("startVM", startVmWorker)
    addReqHandler<SideStopVmReq, SideStopVmResp>("stopVM", stopVmWorker)
}
