import {
    delay,
    DeviceScriptManagerReg,
    JDService,
    versionTryParse,
} from "jacdac-ts"
import * as vscode from "vscode"
import { DeviceScriptExtensionState } from "./state"
import { showErrorMessage } from "./telemetry"

export async function readRuntimeVersion(srv: JDService) {
    const runtimeVersion = srv.register(DeviceScriptManagerReg.RuntimeVersion)

    let retry = 3
    while (retry-- >= 0 && runtimeVersion.data === undefined) {
        await runtimeVersion.refresh(true)
        await delay(50)
    }
    const v = runtimeVersion?.unpackedValue
    if (!v) return undefined
    return `v${v[2]}.${v[1]}.${v[0]}`
}

export async function checkRuntimeVersion(minVersion: string, srv: JDService) {
    if (shouldIgnoreRuntimeVersion()) return true

    const flashCommand = "Upgrade Firmware..."
    const depCommand = "Upgrade Dependencies..."
    const version = await readRuntimeVersion(srv)
    console.debug(`deploy: version min ${minVersion}, device ${version}`)
    if (version === undefined) {
        // might be in a broken state that prevents querying the runtime
        return false
    }

    const vmin = versionTryParse(minVersion)
    const vcurr = versionTryParse(version)

    if (
        vcurr.major < vmin.major ||
        (vcurr.major == vmin.major && vcurr.minor < vmin.minor)
    ) {
        showErrorMessage(
            "deploy.firmware.outdated",
            `Deploy cancelled. Your device firmware (${version}) is outdated (min ${minVersion}).`,
            flashCommand
        ).then(cmd => {
            if (cmd === flashCommand)
                vscode.commands.executeCommand(
                    "extension.devicescript.device.flash",
                    srv.device
                )
        })
        return false
    } else if (vcurr.major > vmin.major) {
        showErrorMessage(
            "deploy.firmware.ahead",
            `Deploy cancelled. Your device firmware (${version}) is ahead of the device script tools (${minVersion}). Upgrade your dependencies.`,
            depCommand
        ).then(cmd => {
            if (cmd === depCommand)
                vscode.commands.executeCommand(
                    "extension.devicescript.projet.upgrade"
                )
        })
        return false
    }
    return true
}

function shouldIgnoreRuntimeVersion() {
    const config = vscode.workspace.getConfiguration("devicescript.deploy")
    return !!config.get("ignoreRuntimeVersion")
}

/**
 * Check if runtime versions are compatible.
 * @param runtimeVersion
 * @param service
 * @returns
 */
export async function checkDeviceScriptManagerRuntimeVersion(
    runtimeVersion: string,
    service: JDService
) {
    if (!runtimeVersion) {
        showErrorMessage(
            "deploy.toolsnotstarted",
            "Deploy cancelled. Developer tools not started."
        )
        return false
    }
    if (!service) {
        showErrorMessage(
            "deploy.devicenotfound",
            "Deploy cancelled. No DeviceScript device found."
        )
        return false
    }
    return await checkRuntimeVersion(runtimeVersion, service)
}

export async function prepareForDeploy(
    extensionState: DeviceScriptExtensionState,
    service: JDService
) {
    // disable autostart (which is really auto-restart when the program stops)
    await service
        .register(DeviceScriptManagerReg.Autostart)
        .sendSetAsync(new Uint8Array([0]))
}
