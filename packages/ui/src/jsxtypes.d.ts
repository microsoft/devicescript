// this is just a sample, but some types in the JSX namespace are required by the compiler

import type { ImageContext } from "@devicescript/graphics"

declare global {
    namespace JSX {
        type ChildElement =
            | Element
            | string
            | number
            | boolean
            | null
            | undefined

        interface BaseProps {
            children?: Element | Element[]
        }

        interface IntrinsicElements {
            // none
        }

        interface Element {
            render(ctx: ImageContext): void
        }

        // do not define ElementAttributesProperty - use ctor type
        interface ElementChildrenAttribute {
            children: {} // specify children name to use
        }
        type FunctionComponent<Props extends BaseProps> = (
            props: Props
        ) => Element
    }
}

declare module "@devicescript/core" {
    // ds._jsx is hardcoded as equivalent of React _jsx() function
    function _jsx<Props extends JSX.BaseProps>(
        element:
            | string
            | JSX.FunctionComponent<Props>
            | (new (props: Props) => JSX.Element),
        props: Props
    ): JSX.Element
}
