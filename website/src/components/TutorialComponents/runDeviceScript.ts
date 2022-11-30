export default async function runDeviceScript(input: string): Promise<string> {
    const iframe = document.getElementById(
        "jacdac-dashboard"
    ) as HTMLIFrameElement
    const msg = {
        channel: "jacscript",
        type: "source",
        source: input,
        force: true,
    }
    console.log({ msg })
    iframe.contentWindow.postMessage(
        JSON.stringify(msg),
        "https://microsoft.github.io/jacdac-docs/"
    )
    return JSON.stringify({ output: "", error: "" })
}
