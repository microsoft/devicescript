import { Font, Image } from "./image"
import { fontForText } from "./text"

/**
 * Partial implementation of CanvasRenderingContext2D
 * { @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D }
 */
export class ImageRenderingContext {
    private states: {
        font: Font
        transformX: number
        transformY: number
        fillColor: number
        strokeColor: number
    }[] = []
    private transformX: number
    private transformY: number

    font: Font
    fillColor: number = 1
    strokeColor: number = 1

    constructor(public readonly image: Image) {
        this.font = fontForText("")
        this.transformX = 0
        this.transformY = 0
    }

    drawImage(image: Image, dx: number, dy: number): void {
        const x = this.transformX + dx
        const y = this.transformY + dy
        this.image.drawTransparentImage(image, x, y)
    }
    clearRect(x: number, y: number, w: number, h: number): void {
        this.fillRectC(x, y, w, h, 0)
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        this.fillRectC(x, y, w, h, this.fillColor)
    }
    private fillRectC(x: number, y: number, w: number, h: number, c: number) {
        const tx = this.transformX + x
        const ty = this.transformY + y
        this.image.fillRect(tx, ty, w, h, c)
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        this.image.drawRect(x, y, w, h, this.strokeColor)
    }

    restore(): void {
        const state = this.states.pop()
        if (state) {
            this.font = state.font
            this.fillColor = state.fillColor
            this.strokeColor = state.strokeColor
            this.transformX = state.transformX
            this.transformY = state.transformY
        }
    }

    save(): void {
        this.states.push({
            font: this.font,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            transformX: this.transformX,
            transformY: this.transformY,
        })
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.printTextC(text, x, y, this.fillColor, maxWidth)
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.printTextC(text, x, y, this.strokeColor, maxWidth)
    }
    private printTextC(
        text: string,
        x: number,
        y: number,
        c: number,
        maxWidth?: number
    ) {
        if (!text) return
        if (maxWidth !== undefined) {
            const l = Math.floor(maxWidth / this.font.charWidth)
            if (l < text.length) text = text.slice(0, l)
        }
        this.image.print(text, x, y, c, this.font)
    }

    resetTransform(): void {
        this.transformX = 0
        this.transformY = 0
    }
    translate(x: number, y: number): void {
        this.transformX += x
        this.transformY += y
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.image.fill(0)
    }

    /**
     * Fills the canvas with the current fill color
     */
    fill() {
        this.image.fill(this.fillColor)
    }

    /**
     * Fill a circle
     * @param cx center x coordinate
     * @param cy center y coordinate
     * @param r radius
     */
    fillCircle(cx: number, cy: number, r: number) {
        const x = this.transformX + cx
        const y = this.transformY + cy
        this.image.drawCircle(x, y, r, this.fillColor)
    }

    /**
     * Renders a circle outline
     * @param cx x coordinate of the center
     * @param cy y coordinate of the center
     * @param r radius
     */
    strokeCircle(cx: number, cy: number, r: number) {
        const x = this.transformX + cx
        const y = this.transformY + cy
        this.image.drawCircle(x, y, r, this.strokeColor)
    }

    /**
     * Renders a line from (x1, y1) to (x2, y2)
     * @param x1 coordinate of the first point
     * @param y1 coordinate of the first point
     * @param x2 coordinate of the second point
     * @param y2 coordinate of the second point
     */
    strokeLine(x1: number, y1: number, x2: number, y2: number) {
        const tx1 = this.transformX + x1
        const ty1 = this.transformY + y1
        const tx2 = this.transformX + x2
        const ty2 = this.transformY + y2
        this.image.drawLine(tx1, ty1, tx2, ty2, this.strokeColor)
    }

    /**
     * Resets the state of the canvas context
     */
    reset() {
        this.resetTransform()
        this.fillColor = 1
        this.strokeColor = 1
    }
}
