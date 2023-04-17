import { hardwareConfig } from "@devicescript/servers"

export * from "./shtc3"
export * from "./sht30"
export * from "./aht20"

hardwareConfig({ noScanI2C: true })
