import React, { useState, useRef, useEffect } from "react"
import SplitPane from "react-split-pane"
import { nodeModuleNameResolver } from "typescript"

export default function SplitDevTools(props) {
    const { children, source, sourceId } = props
    const [dragging, setDragging] = useState(false)
    const handleDragStart = () => setDragging(true)
    const handleDragEnd = () => setDragging(false)
    const iframeRef = useRef(undefined)

    useEffect(() => {
        const iframe = iframeRef.current
        const parent = iframe?.contentWindow
        if (!parent) return

        const msg = {
            channel: "devicescript",
            type: "source",
            source,
            force: true,
        }
        parent.postMessage(msg, "https://microsoft.github.io/jacdac-docs/")
    }, [source, sourceId])

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
                        ref={iframeRef}
                        id="jacdac-dashboard"
                        className="pane right"
                        allow="usb;serial;bluetooth"
                        src={`https://microsoft.github.io/jacdac-docs/editors/devicescript/?devicescriptvm=1&embed=1&footer=0`}
                        frameBorder="0"
                    />
                )}
            </div>
        </SplitPane>
    )
}
