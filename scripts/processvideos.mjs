#!/usr/bin/env zx

import "zx/globals"

await cd("website/static/videos")
const files = fs.readdirSync(".").filter(f => f.endsWith(".mp4"))
await Promise.all(files.map((file) => {
    const jpg = file.substring(0, file.length - 3) + "jpg"
    if (!fs.existsSync(jpg)) return $`ffmpeg -y -i ${file} -frames:v 1 ${jpg}`
}))
