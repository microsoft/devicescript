import React from "react"
import { DevToolsProvider } from "../contexts/DevToolsContext"
// Default implementation, that you can customize
export default function Root(props) {
    return <DevToolsProvider {...props} />
}
