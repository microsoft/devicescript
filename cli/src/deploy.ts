import {
    bufferEq,
    delay,
    DeviceScriptManagerCmd,
    DeviceScriptManagerReg,
    JDService,
    OutPipe,
    prettySize,
    SettingsClient,
    sha256,
    SRV_WIFI,
    toHex,
    WifiCmd,
} from "jacdac-ts"
import { devsStartWithNetwork } from "./build"
import { error } from "./command"
import { readCompiled } from "./run"
import { BuildOptions } from "./sideprotocol"
import { DISABLE_AUTO_START_KEY } from "./devtools"

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
    if (!settings) return

    // handle special settings
    const { WIFI_SSID, WIFI_PWD, ...rest } = settings

    // apply generic settings
    if (Object.keys(rest)) {
        const client = new SettingsClient(settingsService)
        for (const key in rest) {
            console.debug(`deploying setting ${key}...`)
            const value = settings[key]
            await client.setValue(key, value)
        }
    }

    // wifi settings
    if (WIFI_SSID) {
        const wifis = settingsService.device.services({
            serviceClass: SRV_WIFI,
        })
        const ssid = JSON.parse(Buffer.from(WIFI_SSID).toString("utf-8"))
        const pwd = JSON.parse(
            WIFI_PWD ? Buffer.from(WIFI_PWD).toString("utf-8") : '""'
        )
        for (const wifi of wifis) {
            console.debug(`deploying wifi credentials`)
            await wifi.sendCmdPackedAsync(WifiCmd.AddNetwork, [ssid, pwd], true)
        }
    }
}

export interface DeployOptions {
    settingsService?: JDService
    settings?: Record<string, Uint8Array>
    noRun?: boolean
}

export async function deployToService(
    service: JDService,
    bytecode: Uint8Array,
    options: DeployOptions = {}
) {
    console.log(`deploy to ${service.device}`)

    const { settingsService, settings, noRun } = options

    const autostart = service.register(DeviceScriptManagerReg.Autostart)
    const running = service.register(DeviceScriptManagerReg.Running)
    const sha = service.register(DeviceScriptManagerReg.ProgramSha256)

    await sha.refresh()
    await autostart.refresh()
    const oldAutoStart = autostart.boolValue

    // disable autostart
    await autostart.sendSetBoolAsync(false)
    await running.sendSetBoolAsync(false)
    await delay(10)

    if (sha.data?.length == 32) {
        const exp = await sha256([bytecode])
        if (bufferEq(exp, sha.data)) {
            console.log(`  sha256 match ${toHex(exp)}, skip`)
            // stop running
            await running.sendSetBoolAsync(false)
            await delay(10)

            // deploy settings if needed
            if (settingsService)
                await deploySettingsToService(settingsService, settings)

            await startAgain()
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
    if (settingsService)
        await deploySettingsToService(settingsService, settings)

    await startAgain()

    console.log(`  --> done, ${prettySize(bytecode.length)}`)

    async function startAgain() {
        if (noRun) return
        if (
            !service.device.bus.nodeData[DISABLE_AUTO_START_KEY] &&
            oldAutoStart !== undefined
        )
            await autostart.sendSetBoolAsync(oldAutoStart)
        await running.sendSetBoolAsync(true)
    }
}
