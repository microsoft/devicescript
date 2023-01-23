import React from "react"
import RootTheme from "@theme-original/Root"
import { DevToolsProvider } from "../contexts/DevToolsContext"
// Default implementation, that you can customize
export default function Root(props) {
    return (
        <RootTheme>
            <DevToolsProvider {...props} />
        </RootTheme>
    )
}
