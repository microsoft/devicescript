import http from "http"
import https from "https"

const dasboardPath = "tools/devicescript-devtools"

let proxyHtmlPromise: Promise<string>

export function fetchDevToolsProxy(localhost: boolean): Promise<string> {
    if (!proxyHtmlPromise)
        proxyHtmlPromise = uncachedFetchDevToolsProxy(localhost)
    return proxyHtmlPromise
}

function uncachedFetchDevToolsProxy(localhost: boolean): Promise<string> {
    const protocol = localhost ? http : https
    const url = localhost
        ? "http://localhost:8000/devtools/proxy.html"
        : "https://microsoft.github.io/jacdac-docs/devtools/proxy"
    //debug(`fetch jacdac devtools proxy at ${url}`)
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
                            /https:\/\/microsoft.github.io\/jacdac-docs\/dashboard/g,
                            localhost
                                ? `http://localhost:8000/${dasboardPath}/`
                                : `https://microsoft.github.io/jacdac-docs/${dasboardPath}/`
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
        proxyHtmlPromise = Promise.resolve(body)
        return body
    })
}
