#!/usr/bin/env zx

import "zx/globals"

await cd("website/static/videos")
const files = fs.readdirSync(".").filter(f => f.endsWith(".mp4"))
for (const file of files) {
    const jpg = file.substring(0, file.length - 3) + "jpg"
    if (!fs.existsSync(jpg)) await $`ffmpeg -y -i ${file} -frames:v 1 ${jpg}`
}
