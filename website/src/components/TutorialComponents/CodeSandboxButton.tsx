import React, { useState } from "react"
import clsx from "clsx"

export default function CodeSandboxButton(props: {
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files: Record<string, any>
    startFile: string
}) {
    const { className, files, startFile } = props
    const [error, setError] = useState<any>(undefined)
    const [importing, setImporting] = useState(false)

    const handleClick = async () => {
        const f = files
        const body = JSON.stringify({
            files: f,
        })
        try {
            setImporting(true)
            const x = await fetch(
                "https://codesandbox.io/api/v1/sandboxes/define?json=1",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body,
                }
            )
            const data = await x.json()
            const { sandbox_id } = data
            if (sandbox_id === undefined)
                throw new Error("failed to create new sandbox")
            const url = `https://codesandbox.io/s/${data.sandbox_id}?file=/${startFile}`
            window.open(url, "_blank", "noreferrer")
        } catch (error) {
            console.error(error)
            setError(error)
        } finally {
            setImporting(false)
        }
    }

    return (
        <button
            type="button"
            aria-label="Open code in CodeSandbox"
            title="Open in CodeSandbox"
            className={clsx("clean-btn", className)}
            onClick={handleClick}
            disabled={importing}
        >
            Fork
        </button>
    )
}
