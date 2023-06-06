import { readSetting } from "@devicescript/settings"
import { fetch } from "@devicescript/net"
import { setStatusLight } from "@devicescript/runtime"

// read configuration from ./env.defaults
const owner = await readSetting("GITHUB_OWNER")
const repo = await readSetting("GITHUB_REPO")
const ref = await readSetting("GITHUB_REF", "main")
// read secret from ./env.local
const token = await readSetting("GITHUB_TOKEN", "")

console.log({ owner, repo, ref })
if (!owner || !repo) throw new Error("missing configuration")

// track state of last fetch
let state: "failure" | "pending" | "success" | "error" | "" = "success"
let blinki = 0

// update status light
setInterval(async () => {
    blinki++
    let c = 0x000000
    if (state === "failure")
        c = blinki % 2 === 0 ? 0x100000 : 0x000000 // blink fast red
    else if (state === "pending")
        c = (blinki >> 1) % 2 === 0 ? 0x100500 : 0x000000 // blink slow orange
    else if (state === "success") c = 0x000a00 // solid green
    else c = 0x000000 // dark if any error
    await setStatusLight(c)
}, 500)

// query github every minute
setInterval(async () => {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${ref}/status`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: token ? `Bearer ${token}` : undefined,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    )
    console.log({ status: res.status })
    if (res.status === 200) {
        const json = await res.json()
        state = json.state
        console.log({ state })
    } else state = "error"
}, 60000)
