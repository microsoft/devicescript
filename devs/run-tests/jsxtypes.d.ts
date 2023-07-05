// this is just a sample, but some types in the JSX namespace are required by the compiler

declare namespace JSX {
    type ChildElement = Element | string | number | boolean | null | undefined

    interface BaseProps {
        children?: ChildElement | ChildElement[]
    }

    interface IntrinsicElements {
        frame: { color?: number } & BaseProps
        rows: { border?: string } & BaseProps
    }

    type ElementRepr<S extends keyof IntrinsicElements> =
        IntrinsicElements[S] & {
            tag: S
        }

    // type Element = ElementRepr<keyof IntrinsicElements> // doesn't work
    type Element = {
        [K in keyof IntrinsicElements]: ElementRepr<K>
    }[keyof IntrinsicElements]

    interface ElementAttributesProperty {
        props: {} // specify the property name to use
    }
    interface ElementChildrenAttribute {
        children: {} // specify children name to use
    }
    type FunctionComponent<Props extends BaseProps> = (
        props: Props
    ) => JSX.Element
}

declare module "@devicescript/core" {
    // ds._jsx is hardcoded as equivalent of React _jsx() function
    function _jsx<Props extends JSX.BaseProps>(
        element: string | JSX.FunctionComponent<Props>,
        props: Props
    ): JSX.Element
}
