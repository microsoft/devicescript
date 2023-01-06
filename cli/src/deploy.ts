import { BuildOptions, devsFactory } from "./build"
import { CmdOptions, error } from "./command"
import { readCompiled } from "./run"

export interface RunOptions {
    tcp?: boolean
}

export async function deployScript(
    fn: string,
    options: RunOptions & CmdOptions & BuildOptions
) {
    const inst = await devsFactory()
    if (options.tcp)
        await inst.setupNodeTcpSocketTransport(require, "127.0.0.1", 8082)
    else await inst.setupWebsocketTransport("ws://127.0.0.1:8081")
    inst.devsStart()
    inst.deployHandler = code => {
        if (code) error(`deploy error ${code}`)
        process.exit(code)
    }

    const prog = await readCompiled(fn, options)
    const r = inst.devsClientDeploy(prog)
    if (r) throw new Error("deploy error: " + r)
    console.log(`remote-deployed ${fn}`)
}
