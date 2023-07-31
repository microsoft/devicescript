import { Image } from "./image"
import { Palette } from "@devicescript/runtime"

/**
 * A display driver
 */
export interface Display {
    /**
     * Color palette supported by the display
     */
    palette: Palette
    /**
     * Buffered image rendered when show is called
     */
    image: Image
    /**
     * Renders the image to hardware
     */
    show(): Promise<void>
    /**
     * Initializes the display. Should be callable multiple timews.
     */
    init(): Promise<void>
}
