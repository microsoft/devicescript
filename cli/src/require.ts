import { isInteractive } from "./command"
import { askForPackageInstallation } from "./packageinstaller"

export class RequireError extends Error {
    constructor(readonly packageName: string) {
        super(`failed to require package "${packageName}"`)
    }
}

export async function tryRequire(name: string) {
    try {
        return require(name)
    } catch (e) {
        console.log(`failed to require package "${name}"`)
        console.debug(e.stderr?.toString())
        if (isInteractive) {
            await askForPackageInstallation(name)
            return require(name)
        }
        throw new RequireError(name)
    }
}
