// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../jacdac-ts/jacdac-spec/spectool/jdspec.d.ts" />
/// <reference path="../../runtime/jacdac-c/dcfg/srvcfg.d.ts" />

import {
    DeviceHardwareInfo,
    HexInt,
    JsonComment,
    ServiceConfig,
} from "@devicescript/srvcfg"

// BEGIN-DS-SERVERS
export interface DeviceScriptConfig extends DeviceHardwareInfo {
    /**
     * Don't start internal cloud adapter service (including the WiFi adapter) and instead use one running
     * on the computer connected via USB.
     */
    devNetwork?: boolean
}

export type UserHardwareInfo = Partial<
    Exclude<DeviceScriptConfig, "pins" | "sPins">
>
// END-DS-SERVERS

export interface DeviceProps {
    /**
     * Name of the program, derived from package.json. Exposed as `program_name` register.
     */
    "@name"?: string

    /**
     * Version number of the program, derived from package.json and git. Exposed as `program_version` register.
     */
    "@version"?: string
}

export type ProgramConfig = Partial<DeviceProps> & Partial<DeviceScriptConfig>

export interface FstorConfig {
    /**
     * Size of a flash page, typically 4096.
     */
    flashPageSize: number

    /**
     * Total number of pages in FSTOR.
     * Often 32 (for 128k) or 64 (for 256k).
     */
    fstorPages: number

    /**
     * Offset where FSTOR sits in total flash space.
     */
    fstorOffset: HexInt
}

export interface DeviceConfig
    extends DeviceProps,
        DeviceScriptConfig,
        Partial<FstorConfig>,
        JsonComment {
    $schema?: string

    /**
     * A short ID of the board.
     * This is auto-populated from file name.
     *
     * @examples ["adafruit_qt_py_c3", "esp32_devkit_c"]
     * @TJS-ignore
     */
    id?: string

    /**
     * Architecture for the board.
     * This is auto-populated from arch.json file.
     *
     * @examples ["esp32c3", "rp2040w"]
     */
    archId?: string

    /**
     * Where to download BIN/UF2 file from.
     *
     * @TJS-ignore
     */
    $fwUrl?: string

    /**
     * Short description of the board.
     */
    $description?: string

    /**
     * Where to buy/read more.
     */
    url?: string

    /**
     * Is it a user-defined board.
     *
     * @TJS-ignore
     */
    $custom?: boolean

    /**
     * Services to mount. Each starts with { "service": "..." }
     * This should not be present in .board.json files.
     */
    services?: ServiceConfig[]

    /**
     * Services to expose via `startXYZ()` API. Each starts with { "service": "..." }
     */
    $services?: ServiceConfig[]
}

export function parseAnyInt(s: string | number) {
    if (s === null || s === undefined) return undefined
    if (typeof s == "number") return s
    s = s.replace(/_/g, "")
    let m = 1
    if (s[0] == "-") {
        s = s.slice(1)
        m = -1
    } else if (s[0] == "+") s = s.slice(1)

    if (/^0o[0-7]+$/i.test(s)) return m * parseInt(s.slice(2), 8)
    if (/^0x[0-9a-f]+$/i.test(s)) return m * parseInt(s.slice(2), 16)
    if (/^[0-9]+$/i.test(s)) return m * parseInt(s.slice(2), 16)
    return undefined
}

export function normalizeDeviceConfig(
    board: DeviceConfig,
    options?: { ignoreFirmwareUrl?: boolean; ignoreId?: boolean }
) {
    const { ignoreFirmwareUrl, ignoreId } = options || {}
    const {
        $schema,
        id,
        devName,
        productId,
        $description,
        archId,
        url,
        $fwUrl,
        ...rest
    } = board

    const res = {
        $schema,
        id,
        devName,
        productId,
        $description,
        archId,
        url,
        $fwUrl,
        ...rest,
    }
    if (ignoreId) delete res.id
    if (ignoreFirmwareUrl) delete res.$fwUrl
    return res
}

export interface ProgramBuildConfig {
    name?: string
    version?: string
}

export interface PkgJson {
    name?: string
    version?: string
    devicescript?: {
        library?: boolean
        bundle?: boolean
    }
}

export interface LocalBuildConfig {
    hwInfo: ProgramConfig
    pkgJson?: PkgJson
    addBoards?: DeviceConfig[]
    addArchs?: ArchConfig[]
    addServices?: jdspec.ServiceSpec[]
}

export interface ResolvedBuildConfig extends LocalBuildConfig {
    boards: Record<string, DeviceConfig>
    archs: Record<string, ArchConfig>
    services: jdspec.ServiceSpec[]
}

export interface RepoInfo {
    boards: { [id: string]: DeviceConfig }
    archs: { [id: string]: ArchConfig }

    /**
     * @example "https://github.com/microsoft/devicescript-esp32"
     */
    repoUrl?: string
}

export interface PinFunctionInfo {
    /**
     * Pins with both input and output capability.
     */
    io: string

    /**
     * Pins capable of general purpose input.
     * `io` pins are automatically added here.
     */
    input?: string

    /**
     * Pins capable of general purpose output.
     * `io` pins are automatically added here.
     */
    output?: string

    /**
     * Pins capable of analog input (ADC).
     */
    analogIn?: string

    /**
     * Pins used in boot process.
     */
    boot?: string

    /**
     * Pins used by hardware UART during boot.
     */
    bootUart?: string

    /**
     * Pins used by JTAG or SWD debugger interface.
     */
    debug?: string

    /**
     * Pins capable of true analog output (DAC, not PWM).
     */
    analogOut?: string

    /**
     * Pins capable of touch input.
     */
    touch?: string

    /**
     * Pins used by the SPI flash interface.
     */
    flash?: string

    /**
     * Pins used by PSRAM interface.
     */
    psram?: string

    /**
     * Pins used by USB interface.
     */
    usb?: string
}

export type PinFunction = keyof PinFunctionInfo

export interface ArchConfig extends JsonComment, FstorConfig {
    $schema?: string

    /**
     * Short identification of architecture.
     *
     * @examples ["rp2040", "rp2040w", "esp32c3"]
     */
    id: string

    /**
     * Full name of architecture.
     *
     * @examples ["RP2040 + CYW43 WiFi", "ESP32-C3"]
     */
    name: string

    /**
     * Where to find a generic (without DCFG) UF2 or BIN file.
     */
    genericUrl?: string

    /**
     * Where to find a UF2 or BIN file with minimal DCFG.
     * Can be auto-populated.
     */
    bareUrl?: string

    /**
     * Source repo, boards are assumed to sit in `boards/<arch-id>/<board-id>.board.json`
     * Auto-populated.
     */
    repoUrl?: string

    /**
     * Where should DCFG be embedded in generic file.
     */
    dcfgOffset: HexInt

    /**
     * Force alignment of the last page in the patched UF2 file.
     * Set to 4096 on RP2040 because of RP2040-E14.
     */
    uf2Align?: HexInt

    /**
     * If specified, will be used as part of output file name.
     */
    binFlashOffset?: HexInt

    /**
     * If specified, this shows where the generic part of BIN file starts.
     */
    binGenericFlashOffset?: HexInt

    /**
     * Defines a mapping from a pin function
     */
    pins?: PinFunctionInfo & JsonComment
}
