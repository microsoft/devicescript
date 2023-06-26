import { Image } from "./image"
import { Palette } from "./palette"

export interface Display {
    palette: Palette
    image: Image
    show(): Promise<void>
    init(): Promise<void>
}
