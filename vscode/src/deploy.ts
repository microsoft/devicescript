import {
    DeviceScriptManagerReg,
    JDService,
    semverCmp,
    Version,
} from "jacdac-ts"
import * as vscode from "vscode"

export async function readRuntimeVersion(srv: JDService): Promise<Version> {
    const runtimeVersion = srv.register(DeviceScriptManagerReg.RuntimeVersion)
    await runtimeVersion.refresh()
    const v = runtimeVersion.unpackedValue
    if (!v) return undefined
    return v as Version
}

export async function checkRuntimeVersion(minVersion: Version, srv: JDService) {
    const version = await readRuntimeVersion(srv)
    console.debug(`deploy: version min ${minVersion}, device ${version}`)
    if (version === undefined) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware does not have a runtime version. Update your firmware.`
        )
        return false
    }

    const minMajor = minVersion[2]
    const major = version[2]
    const minMinor = minVersion[1]
    const minor = version[1]
    if (major < minMajor || (major == minMajor && minor < minMinor)) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware (${version}) is outdated (min ${minVersion}). Update your firmware.`
        )
        return false
    } else if (major > minMajor) {
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
export function checkDeploy(runtimeVersion: Version, service: JDService) {
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
