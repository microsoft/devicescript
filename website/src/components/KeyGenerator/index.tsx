import React, { useState } from "react"

function toHex(bytes: Uint8Array) {
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

export default function KeyGenerator() {
    const compute = () => {
        const array = new Uint8Array(32) // Create a Uint8Array with 32 elements.
        window.crypto.getRandomValues(array) // Fill the array with cryptographically strong random values.
        return toHex(array)
    }

    const [value, setValue] = useState(compute())

    const handleRegenerate = () => {
        const v = compute()
        setValue(v)
    }
    const handleCopy = async () => {
        await navigator.clipboard.writeText(value)
    }
    const title = "Random Device Key (64hex)"
    return (
        <div>
            <label>{title}</label>
            <pre style={{ whiteSpace: "pre-wrap", maxWidth: "100%" }}>
                {value}
            </pre>
            <button
                style={{ marginRight: "0.5rem" }}
                aria-label="copy random number to clipboard"
                onClick={handleCopy}
            >
                Copy
            </button>
            <button
                aria-label="regenerate random number"
                color="primary"
                onClick={handleRegenerate}
            >
                Regenerate
            </button>
        </div>
    )
}
