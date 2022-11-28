import React, { useState } from "react"
import SplitPane from "react-split-pane"

// Default implementation, that you can customize
export default function Root({ children }) {
    const [dragging, setDragging] = useState(false)
    const handleDragStart = () => setDragging(true)
    const handleDragEnd = () => setDragging(false)
    return (
        <SplitPane
            split="vertical"
            defaultSize={800}
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
                        src={`https://microsoft.github.io/jacdac-docs/dashboard?jacscriptvm=1&embed=1&light=1`}
                        frameBorder="0"
                    />
                )}
            </div>
        </SplitPane>
    )
}
