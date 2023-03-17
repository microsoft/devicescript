import {
    bufferEq,
    DeviceScriptManagerCmd,
    DeviceScriptManagerReg,
    JDBus,
    JDService,
    OutPipe,
    prettySize,
    sha256,
    SRV_DEVICE_SCRIPT_MANAGER,
    toHex,
} from "jacdac-ts"
import { devsStartWithNetwork } from "./build"
import { error } from "./command"
import { readCompiled } from "./run"
import { BuildOptions } from "./sideprotocol"

export interface RunOptions {
    tcp?: boolean
}

export async function deployScript(
    fn: string,
    options: RunOptions & BuildOptions
) {
    const inst = await devsStartWithNetwork(options)
    inst.deployHandler = code => {
        if (code) error(`deploy error ${code}`)
        process.exit(code)
    }

    const prog = await readCompiled(fn, options)
    const r = inst.devsClientDeploy(prog.binary)
    if (r) throw new Error("deploy error: " + r)
    console.log(`remote-deployed ${fn}`)
}

export async function deployToService(
    service: JDService,
    bytecode: Uint8Array
) {
    console.log(`deploy to ${service.device}`)

    const sha = service.register(DeviceScriptManagerReg.ProgramSha256)
    await sha.refresh()
    if (sha.data?.length == 32) {
        const exp = await sha256([bytecode])
        if (bufferEq(exp, sha.data)) {
            console.log(`  sha256 match ${toHex(exp)}, skip`)
            return
        }
    }

    await OutPipe.sendBytes(
        service,
        DeviceScriptManagerCmd.DeployBytecode,
        bytecode,
        p => {
            // console.debug(`  prog: ${(p * 100).toFixed(1)}%`)
        }
    )
    console.log(`  --> done, ${prettySize(bytecode.length)}`)
}

export async function deployToBus(bus: JDBus, bytecode: Uint8Array) {
    let num = 0
    for (const service of bus.services({
        serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
    })) {
        await deployToService(service, bytecode)
        num++
    }
    return num
}
