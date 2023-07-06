import * as ds from "@devicescript/core"
import { Image, ImageContext } from "@devicescript/graphics"

export abstract class BaseElement<T> implements JSX.Element {
    constructor(props: T) {
        Object.assign(this, props)
    }
    abstract render(ctx: ImageContext): void
}

export abstract class ParentElement<T> extends BaseElement<T> {
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

export class Translate extends ParentElement<{ x: number, y: number } & JSX.BaseProps> {
    x: number
    y: number

    render(ctx: ImageContext): void {
        ctx.save()
        ctx.translate(this.x, this.y)
        this.renderChildren(ctx)
        ctx.restore()
    }
}

export class Text extends BaseElement<{ children: string }> {
    children: string

    render(ctx: ImageContext): void {
        ctx.fillText(this.children, 0, 0)
    }
}

export class Rect extends BaseElement<{ w: number, h: number }> {
    w: number
    h: number

    render(ctx: ImageContext): void {
        ctx.strokeRect(0, 0, this.w, this.h)
    }
}

export class FillRect extends Rect {
    override render(ctx: ImageContext): void {
        ctx.fillRect(0, 0, this.w, this.h)
    }
}

export class Fragment extends ParentElement<JSX.BaseProps> {
    render(ctx: ImageContext): void {
        this.renderChildren(ctx)
    }
}


export function HorizontalGauge(props: { w: number, h: number, used: number }): JSX.Element {
    const { w, h, used } = props
    return <>
        <Rect w={w} h={h}></Rect>
        <Translate x={2} y={2}>
            <FillRect w={Math.round((w - 4) * used)} h={h - 4}></FillRect>
        </Translate>
    </>
}

export function PercHorizontalGauge(props: { w: number, h: number, used: number }): JSX.Element {
    const { w, h, used } = props
    return <>
        <HorizontalGauge {...props} />
        <Translate x={w + 2} y={0}>
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