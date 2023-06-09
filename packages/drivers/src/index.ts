import { configureHardware } from "@devicescript/servers"

export * from "./driver"
export * from "./shtc3"
export * from "./sht30"
export * from "./aht20"
export * from "./ltr390"
export * from "./bme680"
export * from "./ssd1306"
export * from "./characterscreen"

configureHardware({ scanI2C: false })
