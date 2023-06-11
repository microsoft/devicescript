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
    private font: Font
    private transformX: number
    private transformY: number

    fillColor: number = 1
    strokeColor: number = 1

    constructor(public readonly image: Image) {
        this.font = fontForText("")
        this.transformX = 0
        this.transformY = 0
    }

    drawImage(
        image: Image,
        dx: number,
        dy: number,
        dw?: number,
        dh?: number
    ): void {
        const x = this.transformX + dx
        const y = this.transformY + dy
        if (dw === undefined || dh === undefined)
            this.image.drawTransparentImage(image, x, y)
        else
            this.image.blit(
                x,
                y,
                dw,
                dh,
                image,
                0,
                0,
                image.width,
                image.height,
                true,
                true
            )
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
        this.image.print(text, x, y, this.fillColor, this.font)
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.image.print(text, x, y, this.strokeColor, this.font)
    }

    resetTransform(): void {
        this.transformX = 0
        this.transformY = 0
    }
    translate(x: number, y: number): void {
        this.transformX += x
        this.transformY += y
    }

    // extras
    clear() {
        this.image.fill(0)
    }
    fill() {
        this.image.fill(this.fillColor)
    }
    fillCircle(cx: number, cy: number, r: number) {
        const x = this.transformX + cx
        const y = this.transformY + cy
        this.image.drawCircle(x, y, r, this.fillColor)
    }
    strokeCircle(cx: number, cy: number, r: number) {
        const x = this.transformX + cx
        const y = this.transformY + cy
        this.image.drawCircle(x, y, r, this.strokeColor)
    }
    strokeLine(x1: number, y1: number, x2: number, y2: number) {
        const tx1 = this.transformX + x1
        const ty1 = this.transformY + y1
        const tx2 = this.transformX + x2
        const ty2 = this.transformY + y2
        this.image.drawLine(tx1, ty1, tx2, ty2, this.strokeColor)
    }
}
