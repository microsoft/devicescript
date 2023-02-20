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
     * Where to download BIN/UF2 file.
     * Auto-populated.
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
     * Services to mount.
     */
    _?: ServiceConfig[]
}

export interface RepoInfo {
    boards: { [id: string]: DeviceConfig }
    archs: { [id: string]: ArchConfig }

    /**
     * @example "https://github.com/microsoft/devicescript-esp32"
     */
    repoUrl?: string
}

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
}
