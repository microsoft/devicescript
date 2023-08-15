// https://github.com/microsoft/devicescript/issues/559
import { SSD1306Driver, startCharacterScreen } from "@devicescript/drivers";
import { configureHardware } from "@devicescript/servers";
// https://microsoft.github.io/devicescript/devices/esp32/esp32-devkit-c
import { pins } from "@dsboard/esp32_devkit_c";


configureHardware({
    i2c: {
        pinSDA: pins.P21,
        pinSCL: pins.P22
    }
})


const ssdDisplay = new SSD1306Driver({ height: 64, width: 128 })

const characterScreen = await startCharacterScreen(ssdDisplay)
await characterScreen.message.write("Hello world!")