import React, { useState, useCallback } from "react"

function toHex(bytes: Uint8Array) {
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

export default function KeyGenerator() {
    const compute = useCallback(() => {
        if (typeof window === "undefined")
            return "00000000000000000000000000000000"

        const array = new Uint8Array(32) // Create a Uint8Array with 32 elements.
        window.crypto.getRandomValues(array) // Fill the array with cryptographically strong random values.
        return toHex(array)
    }, [])

    const [value, setValue] = useState(compute())

    const handleRegenerate = () => {
        const v = compute()
        setValue(v)
    }
    const handleCopy = async () => {
        await navigator.clipboard.writeText(value)
    }
    return (
        <div>
            <pre
                className="item shadow--md"
                style={{ whiteSpace: "pre-wrap", maxWidth: "100%" }}
            >
                {value}
            </pre>
            <div>
                <button
                    className="button button--primary  margin--sm button-sm shadow--lw"
                    aria-label="copy random number to clipboard"
                    onClick={handleCopy}
                >
                    Copy
                </button>
                <button
                    className="button button--outline  button-sm button--secondary shadow--lw"
                    onClick={handleRegenerate}
                >
                    Regenerate
                </button>
            </div>
        </div>
    )
}
