import React, { createContext, ReactNode, useState, useEffect } from "react"
import SplitDevTools from "./SplitDevTools"
export interface DevToolsProps {
    setSource: (source: string) => void
}

const DevToolsContext = createContext<DevToolsProps>({
    setSource: () => {},
})
DevToolsContext.displayName = "devtools"

export default DevToolsContext

export function DevToolsProvider(props: { children: ReactNode }) {
    const { children } = props
    const [source, setSource_] = useState<string>(undefined)
    const [sourceId, setSourceId] = useState(0)

    const setSource = (value: string) => {
        setSource_(value)
        setSourceId(id => id + 1)
    }

    return (
        <DevToolsContext.Provider value={{ setSource }}>
            {source ? (
                <SplitDevTools {...props} source={source} sourceId={sourceId} />
            ) : (
                <>{children}</>
            )}
        </DevToolsContext.Provider>
    )
}
