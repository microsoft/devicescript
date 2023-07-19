import { pins } from "@dsboard/pico_w"
import "@devicescript/drivers"
import { configureHardware } from "@devicescript/servers"
import { startPotentiometerGauge } from "./potentiometergauge"

// picobricks configuration
configureHardware({
    scanI2C: false,
    i2c: {
        pinSDA: pins.GP4,
        pinSCL: pins.GP5,
    },
})

await startPotentiometerGauge()
