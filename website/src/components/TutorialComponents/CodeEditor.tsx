import React, { useState } from "react"
import Editor, { useMonaco } from "@monaco-editor/react"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"
import CopyButton from "@theme/CodeBlock/CopyButton"
import { useEffect } from "react"
import UndoButton from "./UndoButton"
import ResetButton from "./ResetButton"

export function CodeEditor(props: {
    lang: string
    code: string
    disabled: boolean
    readonly: boolean
    className: string
    style?: React.CSSProperties
    onChange: (code: string) => void
    githubRepo: string
}) {
    const [code, setCode] = useState(props.code)
    const [allowUndo, setAllowUndo] = useState(false)
    const [tmpCode, setTmpCode] = useState("")
    const disabled = props.disabled

    const handleEditorChange = (value: string) => {
        setCode(value)
    }

    const monaco = useMonaco()

    useEffect(() => {
        if (monaco) {
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                {
                    noSemanticValidation: true,
                }
            )
        }
    }, [monaco])

    useEffect(() => {
        if (props.onChange) {
            props.onChange(code)
        }
    }, [code])

    const onClickReset = () => {
        setTmpCode(code.slice()) // use copy not reference
        setCode(props.code)
        setAllowUndo(true)
        setTimeout(() => {
            setAllowUndo(false)
        }, 3000)
    }

    const onClickUndo = () => {
        setCode(tmpCode)
    }

    const options = {
        readOnly: disabled,
        minimap: { enabled: false },
        fontSize: "15px",
    }

    const numLines = code.split("\n").length
    const height = `${numLines + 4}em`

    return (
        <div className={props.className} style={props.style}>
            <Editor
                height={height}
                language={props.lang}
                value={code}
                onChange={handleEditorChange}
                options={options}
            />
            <div className={codeBlockContentStyles.buttonGroup}>
                <CopyButton
                    className={codeBlockContentStyles.codeButton}
                    code={code}
                />
                {!props.readonly && !allowUndo && (
                    <ResetButton resetCode={onClickReset} />
                )}
                {!props.readonly && allowUndo && (
                    <UndoButton undoCode={onClickUndo} />
                )}
            </div>
        </div>
    )
}
