import { useEffect } from "react"

function getVisibleVideos(): HTMLVideoElement[] {
    const videos = document.getElementsByTagName("video")
    const visibleVideos = Array.from(videos)
        .filter(
            video =>
                video.offsetWidth > 0 ||
                video.offsetHeight > 0 ||
                video.getClientRects().length > 0
        )
        .sort(
            (l: HTMLVideoElement, r: HTMLVideoElement) =>
                Math.abs(l.getClientRects()[0].top) -
                Math.abs(r.getClientRects()[0].top)
        )
    return visibleVideos
}

export default function useVideoFullscreenShortcut() {
    useEffect(() => {
        if (typeof document === "undefined") return

        const handler = async (ev: KeyboardEvent) => {
            if (ev.code !== "KeyF") return

            if (document.fullscreenElement) {
                await document.exitFullscreen?.()
            } else {
                const videos = getVisibleVideos()
                const video = videos[0]
                await video?.requestFullscreen?.({ navigationUI: "show" })
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])
}
