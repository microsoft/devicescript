import React from "react"
import clsx from "clsx"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"

export default function UndoButton(props: { undoCode: () => void }) {
    const { undoCode } = props
    return (
        <button
            type="button"
            aria-label="Undo the reset"
            title="Undo the reset"
            className={clsx("clean-btn", codeBlockContentStyles.codeButton)}
            style={{ borderColor: "var(--custom-editor-reset-color)" }}
            onClick={undoCode}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="var(--custom-editor-reset-color)"
                strokeWidth="3"
                className="bi bi-arrow-clockwise"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
        </button>
    )
}
