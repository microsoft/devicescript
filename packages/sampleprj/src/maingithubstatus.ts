import { fetch } from "@devicescript/net"

const res = await fetch(
    `https://api.github.com/repos/microsoft/devicescript/commits/main/status`,
    {
        headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    }
)
const body = await res.json()
console.log({ state: body.state })
