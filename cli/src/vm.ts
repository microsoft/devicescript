import { devsStartWithNetwork } from "./build"

export interface VmOptions {
    tcp?: boolean
    deviceId?: string
    gcStress?: boolean
    devtools?: boolean
}

export async function startVm(options: VmOptions) {
    if (options.devtools) options.tcp = true
    const inst = await devsStartWithNetwork(options)
    // disable stack parsing, since it's likely out of date
    if (options.devtools) inst.dmesg = s => console.debug("    " + s)
}
