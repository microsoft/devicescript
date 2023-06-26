import { Image } from "./image"
import { Palette } from "./palette"

export interface Display {
    /**
     * Palette for the display. For monochrome displays, this is a 2-color palette.
     */
    palette?: Palette
    image: Image
    show(): Promise<void>
    init(): Promise<void>
}
