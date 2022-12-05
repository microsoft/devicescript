import React, { useState } from "react"
import clsx from "clsx"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"

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
            console.log({ body })
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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 256"
            >
                <rect width="256" height="256" fill="none" />
                <path
                    d="M224,177.3V78.7a8.1,8.1,0,0,0-4.1-7l-88-49.5a7.8,7.8,0,0,0-7.8,0l-88,49.5a8.1,8.1,0,0,0-4.1,7v98.6a8.1,8.1,0,0,0,4.1,7l88,49.5a7.8,7.8,0,0,0,7.8,0l88-49.5A8.1,8.1,0,0,0,224,177.3Z"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
                <polyline
                    points="222.9 74.6 128.9 128 33.1 74.6"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
                <line
                    x1="128.9"
                    y1="128"
                    x2="128"
                    y2="234.8"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
                <polyline
                    points="177 47.5 128 75.1 79 47.5"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
                <polyline
                    points="176 209 176 153.9 224 126.9"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
                <polyline
                    points="80 209 80 153.9 32 126.9"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="12"
                />
            </svg>
        </button>
    )
}
