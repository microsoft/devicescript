import * as ds from "@devicescript/core"
import { Image, ImageContext } from "@devicescript/graphics"

export function renderChildren(props: JSX.BaseProps, ctx: ImageContext) {
    if (!props.children) return
    if (Array.isArray(props.children))
        for (const ch of props.children)
            ch.render(ctx)
    else
        props.children.render(ctx)

}

export function Translate(props: { x: number, y: number } & JSX.BaseProps): JSX.Element {
    return {
        render: ctx => {
            const { x, y } = props
            ctx.save()
            ctx.translate(x, y)
            renderChildren(props, ctx)
            ctx.restore()
        }
    }
}

export function Text(props: { children: string }): JSX.Element {
    return {
        render: ctx => {
            ctx.fillText(props.children, 0, 0)
        }
    }
}

export function Rect(props: { w: number, h: number }): JSX.Element {
    return {
        render: ctx => {
            const { w, h } = props
            ctx.strokeRect(0, 0, w, h)
        }
    }
}

export function FillRect(props: { w: number, h: number }): JSX.Element {
    return {
        render: ctx => {
            const { w, h } = props
            ctx.fillRect(0, 0, w, h)
        }
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
        return {
            render: ctx => {
                renderChildren(props, ctx)
            }
        }
    else if (typeof element === "string")
        throw new Error(`invalid ${element}`)
    else
        return element(props)
}


export function renderOnImage(elt: JSX.Element, image: Image) {
    image.fill(0)
    elt.render(image.allocContext())
}