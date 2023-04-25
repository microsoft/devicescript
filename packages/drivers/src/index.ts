import { hardwareConfig } from "@devicescript/servers"

export * from "./driver"
export * from "./shtc3"
export * from "./sht30"
export * from "./aht20"
export * from "./ltr390"

hardwareConfig({ scanI2C: false })
