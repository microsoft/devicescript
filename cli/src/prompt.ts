export function consoleBooleanAsk(
    question: string,
    defValue = true
): Promise<boolean> {
    return new Promise(resolve => {
        const ask = (q: string) =>
            process.stdout.write(`${q} ${defValue ? "(Y/n)" : "(y/N)"}?`)
        const handler = (data: Buffer) => {
            const response = data.toString().trim().toLowerCase()
            if (response === "y") {
                process.stdin.removeListener("data", handler)
                resolve(true)
            } else if (response === "n") {
                process.stdin.removeListener("data", handler)
                process.stdin.end()
                resolve(false)
            } else if (response === "") {
                process.stdin.removeListener("data", handler)
                resolve(defValue)
            } else {
                ask(
                    `Unknown option: ${response}. Use y/n and try again \n${question}`
                )
            }
        }
        process.stdin.addListener("data", handler)
        ask(question)
    })
}
