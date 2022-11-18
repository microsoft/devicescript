export default async function runJacscript(input: string): Promise<string> {
    let output = `todo: ${input}`
    let error = ""
    // we are guaranteed to have non-undefined output and error
    return JSON.stringify({ output: String(output), error: error })
}
