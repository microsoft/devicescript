import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    CSSProperties,
} from "react"
import clsx from "clsx"
import { useEditable } from "use-editable"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"
import CopyButton from "@theme/CodeBlock/CopyButton"
import Highlight, { Prism, Language, PrismTheme } from "prism-react-renderer"
import styles from "./styles.module.css"
import ResetButton from "./ResetButton"
import UndoButton from "./UndoButton"

// source code of LiveEditor that allows for code editing
// a good starting point for customizing our own code editor

function CodeEditor(props: {
    className: string
    code: string
    disabled: boolean
    language: string
    onChange: (code: string) => void
    prism: typeof Prism
    style?: CSSProperties
    theme: PrismTheme
    showLineNumbers: boolean
    readonly: boolean
}) {
    const editorRef = useRef(null)
    const [code, setCode] = useState(props.code || "")
    // const [disabled, setDisabled] = useState(props.disabled);
    const [allowUndo, setAllowUndo] = useState(false)
    const [tmpCode, setTmpCode] = useState("")
    const [hasFocus, setHasFocus] = useState(false)

    useEffect(() => {
        setCode(props.code)
    }, [props.code])

    const onEditableChange = useCallback(_code => {
        setCode(_code.slice(0, -1))
    }, [])

    const disabled = props.disabled || !hasFocus
    // we might use `editObj` later for fixing cursor position
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editObj = useEditable(editorRef, onEditableChange, {
        disabled: disabled,
        indentation: 2,
    })

    useEffect(() => {
        if (props.onChange) {
            props.onChange(code)
        }
    }, [code])

    const onClickReset = () => {
        setTmpCode(code.slice()) // use copy not reference
        setCode(props.code)
        // setDisabled(true);
        setHasFocus(false)
        setAllowUndo(true)
        setTimeout(() => {
            // setDisabled(props.disabled);
            setHasFocus(true)
            setAllowUndo(false)
        }, 3000)
    }

    const onClickUndo = () => {
        setCode(tmpCode)
    }

    const handleFocus = () => {
        const selectObj = window.getSelection()
        if (selectObj.rangeCount === 0) {
            // when focusing on the editor without using the mouse,
            // merely from the Tab key
            const range = new Range()
            range.collapse(true)
            selectObj.addRange(range)
        }
        setHasFocus(true)
    }

    const handleBlur = () => {
        setHasFocus(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const editor = editorRef.current
        if (e.key === "Escape" && !props.disabled) {
            if (e.target === editor) {
                e.stopImmediatePropagation()
                e.stopPropagation()
                e.preventDefault()
                editor.focus() // sometimes blur won't fire without focus first
                editor.blur()
            }
        }
    }

    const handleKeyDownIfEnabled = useCallback(
        (_e: KeyboardEvent) => {
            if (!disabled) {
                handleKeyDown(_e)
            }
        },
        [disabled]
    )

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownIfEnabled, {
            capture: true,
        })
        return () => {
            document.removeEventListener("keydown", handleKeyDownIfEnabled)
        }
    }, [handleKeyDownIfEnabled])

    return (
        <div className={props.className} style={props.style}>
            <Highlight
                Prism={props.prism || Prism}
                code={code}
                theme={props.theme}
                language={props.language as Language}
            >
                {({
                    className: _className,
                    tokens,
                    getLineProps,
                    getTokenProps,
                    style: _style,
                }) => (
                    <div
                        className={clsx(
                            styles.CustomCodeEditorContent,
                            codeBlockContentStyles.codeBlockContent
                        )}
                    >
                        {props.showLineNumbers && (
                            <span
                                className={clsx(
                                    styles.LineNumber,
                                    // codeBlockLineNumberStyles.codeLineNumber,
                                    codeBlockContentStyles.codeBlockLines
                                )}
                            >
                                {tokens.map((line, i) => (
                                    <>
                                        {i + 1}
                                        <br />
                                    </>
                                ))}
                            </span>
                        )}
                        <pre
                            tabIndex={0}
                            className={clsx(
                                _className,
                                styles.codeBlock,
                                "thin-scrollbar"
                            )}
                            style={{
                                padding: "0",
                                ...(!props.className || !props.theme
                                    ? {}
                                    : _style),
                            }}
                            ref={editorRef}
                            spellCheck="false"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        >
                            <code
                                className={clsx(
                                    codeBlockContentStyles.codeBlockLines
                                )}
                            >
                                {tokens.map((line, lineIndex) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <div
                                        {...getLineProps({
                                            line,
                                            key: `line-${lineIndex}`,
                                        })}
                                    >
                                        {line
                                            .filter(token => !token.empty)
                                            .map((token, tokenIndex) => (
                                                // eslint-disable-next-line react/jsx-key
                                                <span
                                                    {...getTokenProps({
                                                        token,
                                                        key: `token-${tokenIndex}`,
                                                    })}
                                                />
                                            ))}
                                        {"\n"}
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>
                )}
            </Highlight>
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

export default CodeEditor
