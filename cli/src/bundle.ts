import { writeFileSync } from "fs"
import { compileFile, devsFactory } from "./build"
import { BINDIR, fatal, log, verboseLog } from "./command"
import { SRV_DEVICE_SCRIPT_MANAGER, SRV_SETTINGS, delay } from "jacdac-ts"
import { devtools } from "./devtools"
import { devtoolsIface } from "./sidedata"
import { deployToService } from "./deploy"
import { BuildOptions } from "./sideprotocol"
import { FlashOptions, fetchFW, resolveBoard } from "./flash"
import { patchFstorToBoard } from "./binpatch"
import { writeFile } from "fs/promises"

export interface BundleOptions {
    flashSize?: string
    flashFile?: string
}

export async function bundle(
    filename: string | undefined,
    options: BundleOptions & BuildOptions & FlashOptions
) {
    const { board, arch } = await resolveBoard("", options)

    await devtools(undefined, { })

    const inst = await devsFactory()
    await inst.setupWebsocketTransport("ws://127.0.0.1:8081")

    const pageSize = board.flashPageSize ?? arch.flashPageSize ?? 4096

    if (options.flashSize) {
        inst.flashSize = +options.flashSize * 1024
    } else {
        const pages = board.fstorPages ?? arch.fstorPages
        if (!pages)
            fatal(`fstorPages not specified for ${board.id} nor ${arch.id}`)
        inst.flashSize = pages * pageSize
    }

    const flashKB = inst.flashSize / 1024
    verboseLog(`board:${board.id}, arch:${arch.id}, flashSize:${flashKB}kB`)

    if (inst.flashSize < pageSize * 2 || (inst.flashSize & (pageSize - 1)) != 0)
        fatal("invalid flash size")

    let fstor = new Uint8Array(0)
    inst.flashLoad = () => {
        return fstor.slice()
    }
    inst.flashSave = buf => {
        verboseLog(`flash save ${buf.length}`)
        fstor = new Uint8Array(buf)
    }

    inst.devsStart()

    const res = await compileFile(filename, options)
    if (!res.success) process.exit(1)

    const bus = devtoolsIface.bus
    for (let i = 0; i < 20; i++) {
        const service = bus.services({
            serviceClass: SRV_DEVICE_SCRIPT_MANAGER,
        })[0]

        if (service) {
            const settingsService = service?.device?.services({
                serviceClass: SRV_SETTINGS,
            })?.[0]
            await deployToService(service, res.binary, {
                noRun: true,
                settingsService,
                settings: res.settings,
            })
            await delay(300)

            const fwPath = await fetchFW(board, options)
            const buf = await patchFstorToBoard(fwPath, board, arch, fstor)

            const bn = fwPath.replace(/.*[\/\\]/, "")
            const fn =
                options.flashFile ||
                (options.outDir || BINDIR) + "/bundle-" + bn
            log(`writing ${buf.length} bytes to ${fn}`)
            await writeFile(fn, buf)

            process.exit(0)
        }
        await delay(100)
    }

    throw new Error("no service")
}
