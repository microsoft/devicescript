import React from "react"
import SplitPane from "react-split-pane"

// Default implementation, that you can customize
export default function Root({ children }) {
    const dragging = useRef(false)
    const handleDragStart = () => (dragging.current = true)
    const handleDragEnd = () => (dragging.current = false)
    const handleMouse = ev => {
        if (dragging.current) {
            ev.preventDefault()
            ev.stopPropagation()
        }
    }
    return (
        <SplitPane
            split="vertical"
            defaultSize={800}
            minSize={400}
            onDragStarted={handleDragStart}
            onDragFinished={handleDragEnd}
        >
            <div>{children}</div>
            <iframe
                id="jacdac-dashboard"
                onMouseMove={handleMouse}
                alt="jacdac dashboard and simulators"
                allow="usb;serial;bluetooth"
                src="https://microsoft.github.io/jacdac-docs/dashboard?jacscriptvm=1&embed=1&light=0"
                frameBorder="0"
            />
        </SplitPane>
    )
}
