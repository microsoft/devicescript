import pkg from "../package.json"
import { runtimeVersion } from "@devicescript/compiler"
import updateNotifier from "update-notifier"

export function packageVersion() {
    return `v${pkg.version}`
}

export function cliVersion() {
    return `devs: ${packageVersion()}, runtime: ${runtimeVersion()}, node: ${
        process.version
    }`
}

export function notifyUpdates() {
    updateNotifier({ pkg }).notify()
}
