import React, { useState, useRef, useEffect } from "react"
import SplitPane from "react-split-pane"

export default function SplitDevTools(props) {
    const { children, source, sourceId, darkMode = "" } = props
    const [dragging, setDragging] = useState(false)
    const handleDragStart = () => setDragging(true)
    const handleDragEnd = () => setDragging(false)
    const iframeRef = useRef(undefined)
    const url = `https://microsoft.github.io/jacdac-docs/editors/devicescript/?devicescriptvm=1&embed=1&footer=0&${darkMode}=1`

    const postSource = force => {
        const iframe = iframeRef.current
        const parent = iframe?.contentWindow
        if (!parent) return

        const msg = {
            channel: "devicescript",
            type: "source",
            source,
            force,
        }
        parent.postMessage(msg, "https://microsoft.github.io/jacdac-docs/")
    }

    // when source changes
    useEffect(() => postSource(true), [source, sourceId])
    // when a frame goes live
    useEffect(() => {
        const iframe = iframeRef.current
        const parent = iframe?.contentWindow
        if (!parent) return

        const handleMessage = ev => {
            const { data } = ev
            if (data?.channel === "jacdac") {
                window.removeEventListener("message", handleMessage)
                postSource(false)
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [source, dragging, url])

    return (
        <SplitPane
            split="vertical"
            defaultSize={"min(60%, 55rem)"}
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
                        sandbox="allow-scripts allow-downloads allow-same-origin"
                        src={url}
                        frameBorder="0"
                    />
                )}
            </div>
        </SplitPane>
    )
}
