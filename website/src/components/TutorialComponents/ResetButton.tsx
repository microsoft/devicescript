import React from "react"
import clsx from "clsx"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"

export default function ResetButton(props: { resetCode: () => void }) {
    const { resetCode } = props
    return (
        <button
            type="button"
            aria-label="Reset code"
            title="Reset code"
            className={clsx("clean-btn", codeBlockContentStyles.codeButton)}
            onClick={resetCode}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-counterclockwise"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
            </svg>
        </button>
    )
}
