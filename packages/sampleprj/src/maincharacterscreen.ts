import { pins, board } from "@dsboard/pico_w"
import { SSD1306Driver, startCharacterScreen } from "@devicescript/drivers"
import { configureHardware } from "@devicescript/servers"
import { delay } from "@devicescript/core"

configureHardware({
    scanI2C: false,
    i2c: {
        pinSCL: pins.GP5,
        pinSDA: pins.GP4,
        kHz: 400,
    },
})
const screen = await startCharacterScreen(
    new SSD1306Driver({
        width: 128,
        height: 64,
        devAddr: 0x3c,
    })
)
await screen.message.write("")
await delay(500)
await screen.message.write(
    `°( )° 
( O ) 
°( )° 
  |   
  |/  
  |   
~~~~~ `
)
