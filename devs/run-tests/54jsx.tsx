/// <reference path="./jsxtypes.d.ts" />

import * as ds from "@devicescript/core"


export function Button(prop: { label: string }) {
    return <frame color={1}>{prop.label}</frame>
}

function mkButtons() {
    return <rows border="solid">
        <Button label="Go!"></Button>
        {" and "}
        <Button label="Stop!"/>
    </rows>
}

(ds as typeof ds)._jsx = (element, props) => {
    if (typeof element === "string")
        return {
            tag: element,
            ...props,
        } as JSX.ElementRepr<any>
    else
        return element(props)
}

export function render(elt: JSX.ChildElement): string {
    if (!elt || typeof elt !== "object") {
        return `(prim:${elt})`
    }

    const inner = Array.isArray(elt.children) ?
        elt.children.map(render).join(";") :
        elt.children ? render(elt.children) : "nil"

    if (elt.tag === "frame") {
        return `(frame c=${elt.color} ${inner})`
    } else if (elt.tag === "rows") {
        return `(rows b=${elt.border} ${inner})`
    }

    throw new Error(`unknown element: ${elt}`)
}

function main() {
    const b = mkButtons()
    console.log(b)
    const r = render(b)
    console.log(r)
    ds.assert(r === "(rows b=solid (frame c=1 (prim:Go!));(prim: and );(frame c=1 (prim:Stop!)))")
}

main()
