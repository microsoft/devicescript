import {
    bufferEq,
    delay,
    DeviceScriptManagerCmd,
    DeviceScriptManagerReg,
    JDBus,
    JDService,
    OutPipe,
    prettySize,
    SettingsClient,
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

export async function deploySettingsToService(
    settingsService: JDService,
    settings: Record<string, Uint8Array>
) {
    console.log(`deploying settings...`)
    const client = new SettingsClient(settingsService)
    await client.clear()
    if (settings)
        for (const key in settings) {
            const value = settings[key]
            await client.setValue(key, value)
        }
}

export async function deployToService(
    service: JDService,
    bytecode: Uint8Array,
    settingsService?: JDService,
    settings?: Record<string, Uint8Array>
) {
    console.log(`deploy to ${service.device}`)

    const autostart = service.register(DeviceScriptManagerReg.Autostart)
    const sha = service.register(DeviceScriptManagerReg.ProgramSha256)

    await sha.refresh()
    if (sha.data?.length == 32) {
        const exp = await sha256([bytecode])
        if (bufferEq(exp, sha.data)) {
            console.log(`  sha256 match ${toHex(exp)}, skip`)
            await restartService(service, settingsService, settings)
            return
        }
    }

    // disable autostart to write settings
    if (settingsService) await autostart.sendSetBoolAsync(false)
    await OutPipe.sendBytes(
        service,
        DeviceScriptManagerCmd.DeployBytecode,
        bytecode,
        p => {
            // console.debug(`  prog: ${(p * 100).toFixed(1)}%`)
        }
    )
    await restartService(service, settingsService, settings)
    // restore autostart
    if (settingsService) await autostart.sendSetBoolAsync(false)
    console.log(`  --> done, ${prettySize(bytecode.length)}`)
}

async function restartService(
    service: JDService,
    settingsService?: JDService,
    settings?: Record<string, Uint8Array>
) {
    const running = service.register(DeviceScriptManagerReg.Running)

    // stop running
    await running.sendSetBoolAsync(false)
    await delay(10)

    // deploy settings if needed
    if (settingsService) {
        await deploySettingsToService(settingsService, settings)
        await delay(10)
    }

    // restart engine
    await running.sendSetBoolAsync(true)
}

/*
export async function deployToBus(bus: JDBus, bytecode: Uint8Array) {
    let num = 0
    for (const service of bus.services({
        serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        lost: false,
    })) {
        await deployToService(service, bytecode)
        num++
    }
    return num
}
*/
