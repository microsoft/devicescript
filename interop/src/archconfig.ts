// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../jacdac-ts/jacdac-spec/spectool/jdspec.d.ts" />
/// <reference path="../../runtime/jacdac-c/dcfg/srvcfg.d.ts" />

import {
    DeviceHardwareInfo,
    HexInt,
    JsonComment,
    ServiceConfig,
} from "@devicescript/srvcfg"

export interface DeviceConfig extends DeviceHardwareInfo, JsonComment {
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
     */
    services?: ServiceConfig[]
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

export interface LocalBuildConfig {
    addBoards?: DeviceConfig[]
    addArchs?: ArchConfig[]
    addServices?: jdspec.ServiceSpec[]
}

export interface ResolvedBuildConfig {
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

export interface ArchConfig extends JsonComment {
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
     * Set to 4096 on RP2040 because wof RP2040-E14.
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
