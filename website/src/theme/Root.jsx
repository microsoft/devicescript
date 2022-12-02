import React, { useMemo, useState } from "react"
import SplitPane from "react-split-pane"

// Default implementation, that you can customize
export default function Root({ children }) {
    const [dragging, setDragging] = useState(false)
    const handleDragStart = () => setDragging(true)
    const handleDragEnd = () => setDragging(false)
    return (
        <SplitPane
            split="vertical"
            defaultSize={"min(75%, 65rem)"}
            minSize={400}
            onDragStarted={handleDragStart}
            onDragFinished={handleDragEnd}
        >
            <div className="pane left">{children}</div>
            <div>
                {!dragging && (
                    <iframe
                        id="jacdac-dashboard"
                        className="pane right"
                        alt="jacdac dashboard and simulators"
                        allow="usb;serial;bluetooth"
                        src={`https://microsoft.github.io/jacdac-docs/editors/devicescript/?devicescriptvm=1&embed=1&footer=0`}
                        frameBorder="0"
                    />
                )}
            </div>
        </SplitPane>
    )
}
