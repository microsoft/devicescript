import React, { CSSProperties, useEffect, useRef } from "react"

const defaultStyle: CSSProperties = {
    borderRadius: "0.5rem",
    marginTop: "1rem",
    marginBottom: "1rem",
    maxHeight: "40rem",
    maxWidth: "40rem",
}

function getVisibleVideos(): HTMLVideoElement[] {
    const videos = document.getElementsByTagName("video")
    const visibleVideos = Array.from(videos)
        .filter(
            video =>
                video.offsetWidth > 0 ||
                video.offsetHeight > 0 ||
                video.getClientRects().length > 0
        )
        .sort((l: HTMLVideoElement, r: HTMLVideoElement) => {
            const lr = l.getClientRects()[0]
            const rr = r.getClientRects()[0]
            return (
                Math.abs(lr.top + (lr.height << 1)) -
                Math.abs(rr.top + (rr.height << 1))
            )
        })
    return visibleVideos
}

export default function StaticVideo(props: {
    name: string
    style?: CSSProperties
    webm?: boolean
}) {
    const { name, style = defaultStyle, webm } = props
    const videoRef = useRef<HTMLVideoElement>(null)

    return (
        <video
            ref={videoRef}
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
