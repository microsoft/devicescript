import { Font, Image } from "./image"
import { fontForText } from "./text"

export interface CanvasDrawImage {
    drawImage(image: Image, dx: number, dy: number): void
}

export interface CanvasFillStrokeStyles {
    fillColor: number
    strokeColor: number
}

export interface CanvasRect {
    clearRect(x: number, y: number, w: number, h: number): void
    fillRect(x: number, y: number, w: number, h: number): void
    strokeRect(x: number, y: number, w: number, h: number): void
}

export interface CanvasState {
    restore(): void
    save(): void
}

export interface CanvasText {
    fillText(text: string, x: number, y: number, maxWidth?: number): void
    strokeText(text: string, x: number, y: number, maxWidth?: number): void
    //measureText(text: string): TextMetrics;
}

export interface CanvasTransform {
    resetTransform(): void
    translate(x: number, y: number): void
}

interface Point {
    x: number
    y: number
}

/**
 * Partial implementation of CanvasRenderingContext2D
 * { @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D }
 */
export class CanvasRenderingContext2D
    implements
        CanvasDrawImage,
        CanvasFillStrokeStyles,
        CanvasRect,
        CanvasState,
        CanvasText,
        CanvasTransform
{
    private states: ({
        font: Font
        transform: Point
    } & CanvasFillStrokeStyles)[] = []
    fillColor: number = 1
    strokeColor: number = 1
    font: Font
    transform: Point

    constructor(readonly image: Image) {
        this.font = fontForText("")
        this.transform = { x: 0, y: 0 }
    }

    drawImage(image: Image, dx: number, dy: number): void {
        const x = this.transform.x + dx
        const y = this.transform.y + dy
        this.image.drawImage(image, x, y)
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.fillRectC(x, y, w, h, 0)
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        this.fillRectC(x, y, w, h, this.fillColor)
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        this.fillRectC(x, y, w, h, this.strokeColor)
    }

    private fillRectC(x: number, y: number, w: number, h: number, c: number) {
        const tx = this.transform.x + x
        const ty = this.transform.y + y
        this.image.fillRect(tx, ty, w, h, c)
    }

    restore(): void {
        const state = this.states.pop()
        if (state) {
            this.font = state.font
            this.fillColor = state.fillColor
            this.strokeColor = state.strokeColor
            this.transform = state.transform
        }
    }

    save(): void {
        this.states.push({
            font: this.font,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            transform: { ...this.transform },
        })
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.image.print(text, x, y, this.fillColor, this.font)
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.image.print(text, x, y, this.strokeColor, this.font)
    }

    resetTransform(): void {
        this.transform = { x: 0, y: 0 }
    }
    translate(x: number, y: number): void {
        this.transform.x += x
        this.transform.y += y
    }
}
