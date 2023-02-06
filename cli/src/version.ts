import pkg from "../package.json"
import { runtimeVersion } from "@devicescript/compiler"

export function cliVersion() {
    return `devsc: v${pkg.version}, runtime: ${runtimeVersion()}, node: ${
        process.version
    }`
}
