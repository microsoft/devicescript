import http from "http"
import https from "https"

const DASHBOARD_PATH = "tools/devicescript-devtools"
const VSCODE_DASHBOARD_PATH = "tools/devicescript-devtools-vscode"
const CONNECT_PATH = "tools/devicescript-connect"

export function fetchDevToolsProxy(
    localhost: boolean,
    path: "vscode" | "connect" | "dashboard"
): Promise<string> {
    const protocol = localhost ? http : https
    const url = localhost
        ? "http://127.0.0.1:8000/devtools/proxy.html"
        : "https://microsoft.github.io/jacdac-docs/devtools/proxy"
    const dashboardPath =
        path === "vscode"
            ? VSCODE_DASHBOARD_PATH
            : path === "connect"
            ? CONNECT_PATH
            : DASHBOARD_PATH
    const root = localhost
        ? "http://127.0.0.1:8000"
        : "https://microsoft.github.io/jacdac-docs"
    return new Promise<string>((resolve, reject) => {
        protocol
            .get(url, res => {
                if (res.statusCode != 200)
                    reject(
                        new Error(`proxy download failed (${res.statusCode})`)
                    )
                res.setEncoding("utf8")
                let body = ""
                res.on("data", data => (body += data))
                res.on("end", () => {
                    body = body
                        .replace(
                            /https:\/\/microsoft.github.io\/jacdac-docs\/dashboard\//g,
                            `${root}/${dashboardPath}/`
                        )
                        .replace("Jacdac DevTools", "DeviceScript DevTools")
                        .replace(
                            "https://microsoft.github.io/jacdac-docs/favicon.svg",
                            "https://microsoft.github.io/devicescript/img/favicon.svg"
                        )
                    resolve(body)
                })
                res.on("error", reject)
            })
            .on("error", reject)
    }).then(body => {
        return body
    })
}
