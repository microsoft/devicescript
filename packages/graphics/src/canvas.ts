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
        CanvasText
{
    private states: ({ font: Font } & CanvasFillStrokeStyles)[] = []
    fillColor: number = 1
    strokeColor: number = 1
    font: Font

    constructor(readonly image: Image) {
        this.font = fontForText("")
    }

    drawImage(image: Image, dx: number, dy: number): void {
        this.image.drawImage(image, dx, dy)
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.image.fillRect(x, y, w, h, 0)
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        this.image.fillRect(x, y, w, h, this.fillColor)
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        this.image.fillRect(x, y, w, h, this.strokeColor)
    }

    restore(): void {
        const state = this.states.pop()
        if (state) {
            this.font = state.font
            this.fillColor = state.fillColor
            this.strokeColor = state.strokeColor
        }
    }

    save(): void {
        this.states.push({
            font: this.font,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
        })
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.image.print(text, x, y, this.fillColor, this.font)
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.image.print(text, x, y, this.strokeColor, this.font)
    }
}
