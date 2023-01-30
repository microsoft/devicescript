import { DeviceScriptManagerReg, JDService, versionTryParse } from "jacdac-ts"
import * as vscode from "vscode"

export async function readRuntimeVersion(srv: JDService) {
    const runtimeVersion = srv.register(DeviceScriptManagerReg.RuntimeVersion)
    await runtimeVersion.refresh()
    const v = runtimeVersion.unpackedValue
    if (!v) return undefined
    return `v${v[2]}.${v[1]}.${v[0]}`
}

export async function checkRuntimeVersion(minVersion: string, srv: JDService) {
    const version = await readRuntimeVersion(srv)
    console.debug(`deploy: version min ${minVersion}, device ${version}`)
    if (version === undefined) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware does not have a runtime version. Update your firmware.`
        )
        return false
    }

    const vmin = versionTryParse(minVersion)
    const vcurr = versionTryParse(version)

    if (
        vcurr.major < vmin.major ||
        (vcurr.major == vmin.major && vcurr.minor < vmin.minor)
    ) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware (${version}) is outdated (min ${minVersion}). Update your firmware.`
        )
        return false
    } else if (vcurr.major > vmin.major) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware (${version}) is ahead of the device script tools (${minVersion}). Update your dependencies.`
        )
        return false
    }
    return true
}

export function shouldIgnoreRuntimeVersion() {
    const config = vscode.workspace.getConfiguration("devicescript.deploy")
    return !!config.get("ignoreRuntimeVersion")
}

/**
 * Check if runtime versions are compatible.
 * @param runtimeVersion
 * @param service
 * @returns
 */
export function checkDeploy(runtimeVersion: string, service: JDService) {
    if (!runtimeVersion) {
        vscode.window.showErrorMessage(
            "Deploy cancelled. Developer tools not started."
        )
        return false
    }
    if (!service) {
        vscode.window.showWarningMessage(
            "Deploy cancelled. No DeviceScript device found."
        )
        return false
    }
    return checkRuntimeVersion(runtimeVersion, service)
}
