import { readFile, access, constants } from "node:fs/promises"
import { accessSync } from "node:fs"
import { join } from "node:path"
import { spawn } from "node:child_process"
import { isInteractiveMode, verboseLog } from "./command"

interface PkgJson {
    dependencies: Record<string, string>
}

export const isYarnRepo = (): boolean => {
    try {
        accessSync(join(process.cwd(), "yarn.lock"), constants.R_OK)
        return true;
    }
    catch {
        return false;
    }
}

export const getPackageInstallerCommand = (packageName?: string): string[] => {
    if (isYarnRepo()) {
        if (!packageName)
            return ['yarn', 'install'];

        return ['yarn', 'add', packageName]
    }

    if (!packageName)
        return ['npm', 'install'];

    return ['npm', 'install', '--save', '--no-workspaces', packageName]
};

export const isPackageInstalledLocally = async (pkgName: string): Promise<boolean> => {
    const pkgJsonString = await readFile(join(process.cwd(), "package.json"), { encoding: "utf-8" })
    const pkgJson = JSON.parse(pkgJsonString) as PkgJson

    return Object.keys(pkgJson.dependencies).includes(pkgName)
}

const booleanAsk = async (question: string, defValue = true): Promise<boolean> => {
    let resolve: (val: boolean) => void
    const defValueString = defValue ? "(Y/n)" : "(y/N)"

    const ask = (q: string) => {
        process.stdout.write(`${q} ${defValueString}?`)
    }

    process.stdin.on("data", (data) => {
        const response = data.toString().trim().toLowerCase()

        if (response === "y") {
            resolve(true)
        } else if (response === "n") {
            process.stdin.end()
            resolve(false)
        } else if (response === '') {
            if (defValue)
                resolve(true)
            else
                resolve(false)
        }
        else {
            ask(`Unknown option: ${response}. Use y/n and try again \n${question}`);
        }
    })

    ask(question);

    return new Promise((res) => {
        resolve = res
    });
}

export const spawnAsyncInstaller = (packageName: string) => {
    let resolve: () => void
    let reject: () => void

    const [rootCmd, ...cmdArgs] = getPackageInstallerCommand(packageName);

    const installProcess = spawn(rootCmd, cmdArgs, {
        cwd: process.cwd(),
        env: process.env,
    });

    installProcess.stderr.on('data', (data) => {
        verboseLog(`package installer process: ${data}`);
    });

    installProcess.on('close', (code) => {
        verboseLog(`install process exit with code ${code}`);

        if (code === 0)
            resolve();
        else
            reject();
    });

    return new Promise((res, rej) => {
        // @ts-ignore
        resolve = res
        reject = rej
    });
};

export const askForPackageInstallation = async (pkgName: string, installByDefault = true) => {
    if (!isInteractiveMode)
        console.log(`Interactive mode disabled, package "${pkgName}" must be installed manually`)

    if (await isPackageInstalledLocally(pkgName))
        return

    let shouldInstallPackage = await booleanAsk(
        `Install package "${pkgName}"`,
        installByDefault
    );

    if (shouldInstallPackage) {
        try {
            console.log(`Installing package "${pkgName}" ...`)
            await spawnAsyncInstaller(pkgName);
            console.log(`Package "${pkgName}" installed!`)
        }
        catch {
            const installCmd = getPackageInstallerCommand(pkgName).join(' ');

            console.log(`Automatic package installation failed :( You can try to install it manually by running "${installCmd}"`)
        }
    }
}