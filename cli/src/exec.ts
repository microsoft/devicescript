import { execSync } from "node:child_process"

export function execCmd(cmd: string) {
    try {
        return execSync(cmd, { encoding: "utf-8" }).trim()
    } catch {
        return ""
    }
}
