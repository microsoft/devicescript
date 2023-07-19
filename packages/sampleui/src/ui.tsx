/// <reference path="./jsxtypes.d.ts" />

import * as ds from "@devicescript/core"
import { Image, ImageContext } from "@devicescript/graphics"

/**
 * Type-safe wrapper for Object.assign()
 */
function setup<T, S extends T>(self: S, props: T) {
    Object.assign(self, props)
}

export abstract class BaseElement implements JSX.Element {
    abstract render(ctx: ImageContext): void
}

export abstract class PositionElement extends BaseElement {
    x: number
    y: number
}

export abstract class ParentElement extends BaseElement {
    children?: JSX.Element | JSX.Element[]

    renderChildren(ctx: ImageContext) {
        if (!this.children) return
        if (Array.isArray(this.children))
            for (const ch of this.children) ch.render(ctx)
        else this.children.render(ctx)
    }
}

export interface PositionProps {
    x?: number
    y?: number
}

export class Translate extends ParentElement {
    x: number
    y: number

    constructor(props: PositionProps & JSX.BaseProps) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        if (this.x || this.y) {
            ctx.save()
            ctx.translate(this.x ?? 0, this.y ?? 0)
            this.renderChildren(ctx)
            ctx.restore()
        } else this.renderChildren(ctx)
    }
}

export class Text extends PositionElement {
    children: string

    constructor(props: PositionProps & { children: string }) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        ctx.fillText(this.children, this.x ?? 0, this.y ?? 0)
    }
}

export class Rect extends PositionElement {
    width: number
    height: number

    constructor(props: PositionProps & { width: number; height: number }) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        ctx.strokeRect(this.x ?? 0, this.y ?? 0, this.width, this.height)
    }
}

export class FillRect extends Rect {
    override render(ctx: ImageContext): void {
        ctx.fillRect(this.x ?? 0, this.y ?? 0, this.width, this.height)
    }
}

export class Fragment extends ParentElement {
    constructor(props: JSX.BaseProps) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        this.renderChildren(ctx)
    }
}

export function HorizontalGauge(props: {
    x?: number
    y?: number
    width: number
    height: number
    value: number
    showPercent?: boolean
}): JSX.Element {
    const { x, y, width, height, value, showPercent } = props
    return (
        <Translate x={x} y={y}>
            <Rect width={width} height={height}></Rect>
            <FillRect
                x={2}
                y={2}
                width={Math.round((width - 4) * value)}
                height={height - 4}
            ></FillRect>
            {!!showPercent && (
                <Text x={width + 2} y={2}>
                    {Math.round(value * 100) + "%"}
                </Text>
            )}
        </Translate>
    )
}

;(ds as typeof ds)._jsx = (element, props) => {
    if (element === "") element = Fragment

    if (typeof element === "string") throw new Error(`invalid ${element}`)
    // in DeviceScript class ctors can be called with or without new
    else return (element as JSX.FunctionComponent<JSX.BaseProps>)(props)
}

export function renderOnImage(elt: JSX.Element, image: Image) {
    image.fill(0)
    elt.render(image.allocContext())
}
