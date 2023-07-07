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

export abstract class ParentElement extends BaseElement {
    children?: JSX.Element | JSX.Element[]

    renderChildren(ctx: ImageContext) {
        if (!this.children) return
        if (Array.isArray(this.children))
            for (const ch of this.children)
                ch.render(ctx)
        else
            this.children.render(ctx)
    }
}

export class Translate extends ParentElement {
    x: number
    y: number

    constructor(props: { x?: number, y?: number } & JSX.BaseProps) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        ctx.save()
        ctx.translate(this.x ?? 0, this.y ?? 0)
        this.renderChildren(ctx)
        ctx.restore()
    }
}

export class Text extends BaseElement {
    children: string

    constructor(props: { children: string }) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        ctx.fillText(this.children, 0, 0)
    }
}

export class Rect extends BaseElement {
    width: number
    height: number

    constructor(props: { width: number, height: number }) {
        super()
        setup(this, props)
    }

    render(ctx: ImageContext): void {
        ctx.strokeRect(0, 0, this.width, this.height)
    }
}

export class FillRect extends Rect {
    override render(ctx: ImageContext): void {
        ctx.fillRect(0, 0, this.width, this.height)
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


export function HorizontalGauge(props: { width: number, height: number, used: number }): JSX.Element {
    const { width, height, used } = props
    return <>
        <Rect width={width} height={height}></Rect>
        <Translate x={2} y={2}>
            <FillRect width={Math.round((width - 4) * used)} height={height - 4}></FillRect>
        </Translate>
    </>
}

export function PercHorizontalGauge(props: { width: number, height: number, used: number }): JSX.Element {
    const { width, used } = props
    return <>
        <HorizontalGauge {...props} />
        <Translate x={width + 2} y={0}>
            <Text>{Math.round(used * 100) + "%"}</Text>
        </Translate>
    </>

}

(ds as typeof ds)._jsx = (element, props) => {
    if (element === "")
        element = Fragment

    if (typeof element === "string")
        throw new Error(`invalid ${element}`)
    else
        // in DeviceScript class ctors can be called with or without new
        return (element as JSX.FunctionComponent<JSX.BaseProps>)(props)
}


export function renderOnImage(elt: JSX.Element, image: Image) {
    image.fill(0)
    elt.render(image.allocContext())
}