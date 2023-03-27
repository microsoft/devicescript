import pkg from "../package.json"

export function extensionVersion() {
    return `v${pkg.version}`
}
