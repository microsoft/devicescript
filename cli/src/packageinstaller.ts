import { readFile, constants } from "node:fs/promises"
import { accessSync } from "node:fs"
import { join } from "node:path"
import { spawn } from "node:child_process"
import { isInteractive, verboseLog } from "./command"
import { PkgJson } from "@devicescript/compiler"
import { consoleBooleanAsk } from "./prompt"

function isYarnRepo(): boolean {
    try {
        accessSync(join(process.cwd(), "yarn.lock"), constants.R_OK)
        return true
    } catch {
        return false
    }
}

function getPackageInstallerCommand(
    packageName?: string
): string[] {
    if (isYarnRepo()) {
        if (!packageName) return ["yarn", "install"]

        return ["yarn", "add", packageName]
    }

    if (!packageName) return ["npm", "install"]

    return ["npm", "install", "--save", "--no-workspaces", packageName]
}

async function isPackageInstalledLocally(pkgName: string): Promise<boolean> {
    const pkgJsonString = await readFile(join(process.cwd(), "package.json"), {
        encoding: "utf-8",
    })
    const pkgJson = JSON.parse(pkgJsonString) as PkgJson

    return Object.keys(pkgJson.dependencies).includes(pkgName)
}

async function spawnAsyncInstaller(packageName: string) {
    let resolve: () => void
    let reject: () => void

    const [rootCmd, ...cmdArgs] = getPackageInstallerCommand(packageName)

    const installProcess = spawn(rootCmd, cmdArgs, {
        cwd: process.cwd(),
        env: process.env,
    })

    installProcess.stderr.on("data", data => {
        verboseLog(`package installer process: ${data}`)
    })

    installProcess.on("close", code => {
        verboseLog(`install process exit with code ${code}`)

        if (code === 0) resolve()
        else reject()
    })

    return new Promise((res, rej) => {
        // @ts-ignore
        resolve = res
        reject = rej
    })
}

export async function askForPackageInstallation(
    pkgName: string,
    installByDefault = true
) {
    if (!isInteractive) return

    if (await isPackageInstalledLocally(pkgName)) return

    const shouldInstallPackage = await consoleBooleanAsk(
        `Install package "${pkgName}"`,
        installByDefault
    )

    if (shouldInstallPackage) {
        try {
            console.log(`Installing package "${pkgName}" ...`)
            await spawnAsyncInstaller(pkgName)
            console.log(`Package "${pkgName}" installed!`)
        } catch (e) {
            const installCmd = getPackageInstallerCommand(pkgName).join(" ")
            console.log(
                `Automatic package installation failed :( You can try to install it manually by running "${installCmd}"`
            )
        }
    }
}
