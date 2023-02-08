import pkg from "../package.json"
import { runtimeVersion } from "@devicescript/compiler"

export function packageVersion() {
    return `v${pkg.version}`
}

export function cliVersion() {
    return `devsc: ${packageVersion()}, runtime: ${runtimeVersion()}, node: ${
        process.version
    }`
}
