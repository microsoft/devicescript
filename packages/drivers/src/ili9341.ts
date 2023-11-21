import { Image } from "@devicescript/graphics"
import { STLikeDisplayOptions, STLikeDisplayDriver } from "./stlikedisplay"

export interface ILI9341Options extends STLikeDisplayOptions {}

export class ILI9341Driver extends STLikeDisplayDriver {
    constructor(image: Image, options: ILI9341Options) {
        super(
            image,
            options,
            hex`
01 80 80 // software reset
ED 04 64 03 12 81 //power on sequence control
3A 01 55 // pixel format
B1 02 00 18 // FRMCTR1
B6 03 08 A2 27 // display function control
11 80 78
29 80 78
`
        )
    }
}
