import pkg from "../package.json"
import { runtimeVersion } from "@devicescript/compiler"
import { NotifyOptions } from "update-notifier"

export function packageVersion() {
    return `v${pkg.version}`
}

export function cliVersion() {
    return `devs: ${packageVersion()}, runtime: ${runtimeVersion()}, node: ${
        process.version
    }`
}

export async function notifyUpdates(options?: NotifyOptions) {
    try {
        const updateNotifier = await (await import("update-notifier")).default
        const notifier = updateNotifier({ pkg })
        if (notifier?.update) notifier.notify(options)
    } catch (e) {
        console.debug(e)
    }
}
