import { Image } from "@devicescript/graphics"
import { STLikeDisplayOptions, STLikeDisplayDriver } from "./stlikedisplay"

export interface ST7789Options extends STLikeDisplayOptions {}

export class ST7789Driver extends STLikeDisplayDriver {
    constructor(image: Image, options: ST7789Options) {
        super(
            image,
            options,
            hex`
01 80 78 // SWRESET + 120ms
11 80 78 // SLPOUT + 120ms
21 00    // INVON
3A 01 55 // COLMOD 16bit 16bit
13 80 0A // NORON + 10ms
29 80 0A // DISPON + 10ms
`
        )
    }
}
