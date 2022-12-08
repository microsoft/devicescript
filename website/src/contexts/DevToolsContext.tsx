import React, { createContext, ReactNode, useState, useEffect } from "react"
import SplitDevTools from "./SplitDevTools"
export interface DevToolsProps {
    setSource: (source: string) => void
    setDarkMode: (darkMode: "light" | "dark") => void
}

const DevToolsContext = createContext<DevToolsProps>({
    setSource: () => {},
    setDarkMode: () => {},
})
DevToolsContext.displayName = "devtools"

export default DevToolsContext

export function DevToolsProvider(props: { children: ReactNode }) {
    const { children } = props
    const [source, setSource_] = useState<string>(undefined)
    const [sourceId, setSourceId] = useState(0)
    const [darkMode, setDarkMode] = useState("")

    const setSource = (value: string) => {
        setSource_(value)
        setSourceId(id => id + 1)
    }

    return (
        <DevToolsContext.Provider value={{ setSource, setDarkMode }}>
            {source !== undefined ? (
                <SplitDevTools
                    {...props}
                    source={source}
                    sourceId={sourceId}
                    darkMode={darkMode}
                />
            ) : (
                <>{children}</>
            )}
        </DevToolsContext.Provider>
    )
}
