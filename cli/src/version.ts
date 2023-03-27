import pkg from "../package.json"
import { runtimeVersion } from "@devicescript/compiler"

export function packageVersion() {
    return `v${pkg.version}`
}

export function cliVersion() {
    return `devs: ${packageVersion()}, runtime: ${runtimeVersion()}, node: ${
        process.version
    }`
}

export async function notifyUpdates() {
    try {
        const updateNotifier = await (await import("update-notifier")).default
        const notifier = updateNotifier({ pkg })
        if (notifier?.update) notifier.notify()
    } catch (e) {
        console.debug(e)
    }
}
