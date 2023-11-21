import { Image } from "@devicescript/graphics"
import "@devicescript/gpio"
import { STLikeDisplayDriver, STLikeDisplayOptions } from "./stlikedisplay"

export interface ST7735Options extends STLikeDisplayOptions {}

export class ST7735Driver extends STLikeDisplayDriver {
    constructor(image: Image, options: ST7735Options) {
        super(
            image,
            options,
            hex`
01 80 78 // SWRESET + 120ms
11 80 78 // SLPOUT + 120ms
20 00    // INVOFF
3A 01 05 // COLMOD 16bit
13 80 0A // NORON + 10ms
29 80 0A // DISPON + 10ms
`
        )
    }
}
