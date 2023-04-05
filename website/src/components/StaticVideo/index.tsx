import React, { CSSProperties } from "react"

const defaultStyle: CSSProperties = {
    borderRadius: "0.5rem",
    marginTop: "1rem",
    marginBottom: "1rem",
    maxHeight: "40rem",
    maxWidth: "40rem",
}

export default function StaticVideo(props: {
    name: string
    style?: CSSProperties
    webm?: boolean
}) {
    const { name, style = defaultStyle, webm } = props

    return (
        <video
            style={style}
            poster={`/devicescript/videos/${name}.jpg`}
            playsInline
            controls
            preload="metadata"
        >
            <source src={`/devicescript/videos/${name}.mp4`} type="video/mp4" />
            <p>
                Your browser doesn't support HTML video. Here is a
                <a href={`/devicescript/videos/${name}.mp4`}>
                    link to the video
                </a>{" "}
                instead.
            </p>
        </video>
    )
}
