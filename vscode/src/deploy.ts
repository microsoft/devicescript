import { DeviceScriptManagerReg, JDService, semverCmp } from "jacdac-ts"
import * as vscode from "vscode"

export async function readRuntimeVersion(srv: JDService) {
    const runtimeVersion = srv.register(DeviceScriptManagerReg.RuntimeVersion)
    await runtimeVersion.refresh(true)
    const v = runtimeVersion.unpackedValue
    if (!v) return undefined
    
    const [patch, minor, major] = v as [number, number, number]
    return `v${major}.${minor}.${patch}`
}

export async function checkRuntimeVersion(minVersion: string, srv: JDService) {
    const version = await readRuntimeVersion(srv)
    if (!version) {
        console.debug(`unknown version for ${srv}`)
        return undefined
    }

    console.debug(`compare ${minVersion} vs ${version}`)
    const c = semverCmp(minVersion, version)
    if (c < 0) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware (${version}) is outdated (min ${minVersion}). Update your firmware.`
        )
        return false
    } else if (c > 0) {
        await vscode.window.showErrorMessage(
            `Deploy cancelled. Your device firmware (${version}) is ahead of the device script tools (${minVersion}). Update your dependencies.`
        )
        return false
    }
    return true
}

export function ignoreRuntimeVersion() {
    const config = vscode.workspace.getConfiguration("devicescript.deploy")
    return !!config.get("ignoreRuntimeVersion")
}

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
