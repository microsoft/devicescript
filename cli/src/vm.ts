import { devsStartWithNetwork } from "./build"

export interface VmOptions {
    tcp?: boolean
    deviceId?: string
    gcStress?: boolean
    devtools?: boolean
}

export async function startVm(options: VmOptions) {
    if (options.devtools) options.tcp = true
    await devsStartWithNetwork(options)
}
