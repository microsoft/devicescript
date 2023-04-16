import { hardwareConfig } from "@devicescript/servers"

export * from "./shtc3"

hardwareConfig({ noScanI2C: true })
