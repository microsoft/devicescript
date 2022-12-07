import React, { useContext, useState } from "react"
import clsx from "clsx"
import { ThemeClassNames, usePrismTheme } from "@docusaurus/theme-common"
import useIsBrowser from "@docusaurus/useIsBrowser"
import Container from "@theme/CodeBlock/Container"
import CodeEditor from "./CodeBlock"
import codeBlockContainerStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Container/styles.module.css"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"
import styles from "./styles.module.css"
import Prism from "prism-react-renderer/prism"

import DevToolsContext from "@site/src/contexts/DevToolsContext"

interface CodeBlockProps {
    lang: string
    highlight: string
    statusCodes: Record<string, string>
    code: string
    result: { [key: string]: string }
    githubRepo: string | undefined
    editable: boolean
    showLineNumbers: boolean
    readonly: boolean
    langVersion?: string
    tool?: string
    sandbox?: {
        files: Record<string, { content: string }>
        main?: string
    }
}

function RunButton(props: {
    onClick: () => Promise<void>
    runFinished: boolean
}) {
    const { onClick, runFinished } = props
    const text = "Run"
    return (
        <button className="button button--primary" onClick={onClick}>
            {runFinished ? text : "Running..."}
        </button>
    )
}

function Output(props: {
    language: string
    result: { [key: string]: string | Array<string> }
    codeChanged: boolean
    statusCodes: { [key: string]: string }
}) {
    const { language, result, codeChanged, statusCodes } = props
    const success = result.status === statusCodes.success
    const timeout = result.status === statusCodes.timeout
    const emptyOutput = result.output === ""

    if (emptyOutput) return null

    const regularOutput = (
        <pre className={codeChanged ? styles.outdated : ""}>
            {success ? (
                ""
            ) : timeout ? (
                <span style={{ color: "red" }}>
                    {`--${language} timeout--`}
                </span>
            ) : (
                <span style={{ color: "red" }}>
                    <b>Script contains one or more errors: </b>
                    <br />
                </span>
            )}
            {success ? result.output : !timeout && result.error}
        </pre>
    )

    return (
        <div>
            <b>Output{codeChanged ? " (outdated)" : ""}:</b>
            <br />
            {regularOutput}
        </div>
    )
}

function CustomCodeEditor(props: {
    id: string
    input: string
    showLineNumbers?: boolean
    language?: string
    editable?: boolean
    onChange?: (code: string) => void
    githubRepo: string | undefined
    readonly: boolean
    sandbox?: {
        files: Record<string, { content: string }>
        main?: string
    }
}) {
    const {
        input,
        language,
        showLineNumbers,
        editable,
        githubRepo,
        onChange,
        readonly,
        sandbox,
    } = props
    const prismTheme = usePrismTheme()
    // console.log(prismTheme);
    // the line above shows that we are still using `plain` for syntax highlighting
    // despite that we have imported the language highlighting at the beginning
    const isBrowser = useIsBrowser()

    const component = (
        <Container
            as="div"
            className={clsx(
                editable ? styles.editable : "",
                codeBlockContainerStyles.codeBlockContainer,
                ThemeClassNames.common.codeBlock,
                language && `language-${language}`
            )}
        >
            <CodeEditor
                code={input}
                theme={prismTheme}
                disabled={!editable}
                key={String(isBrowser)}
                className={codeBlockContentStyles.codeBlockContent}
                onChange={onChange}
                language={language}
                prism={Prism}
                readonly={readonly}
                showLineNumbers={showLineNumbers}
                sandbox={sandbox}
            />
        </Container>
    )

    return <>{isBrowser ? component : <></>}</>
}

export default function CustomCodeBlock(props: { input: CodeBlockProps }) {
    const { input } = props
    const {
        lang,
        highlight,
        statusCodes,
        code,
        result,
        githubRepo,
        editable,
        showLineNumbers,
        readonly,
        sandbox,
    } = input
    const [currCode, setCurrCode] = useState(code)
    const [outputRendered, setOutputRendered] = useState(false)
    const [runFinished, setRunFinished] = useState(true)
    const [output, setOutput] = useState(result)
    const [lastSnippet, setLastSnippet] = useState(code)
    const codeChanged = lastSnippet !== currCode
    const { setSource } = useContext(DevToolsContext)
    const clientConfig = {
        ts: input => {
            setSource(input)
            return JSON.stringify({ output: "", error: "" })
        },
    }

    // bypassing server-side rendering
    const onDidClickRun = async () => {
        setRunFinished(false)
        const newResult = { ...result }
        let errorMsg: string

        const runProcess = clientConfig[lang]

        const input = currCode
        let process = runProcess(input, setSource)

        // `z3.interrupt` -- set the cancel status of an ongoing execution, potentially with a timeout (soft? hard? we should use hard)
        try {
            let res: string = await process
            const result = JSON.parse(res)
            if (result.output !== "") {
                const errRegex = /(\(error)|(unsupported)|([eE]rror:)/
                const hasError = errRegex.test(result.output)
                newResult.output = hasError ? "" : result.output
                newResult.error = hasError ? result.output : ""
                newResult.status = hasError
                    ? statusCodes.runtimeError
                    : statusCodes.success
            } else if (result.error !== "") {
                newResult.error = result.error
                if (/timeout/.test(result.error)) {
                    newResult.status = statusCodes.timeout
                } else {
                    newResult.status = statusCodes.runError
                }
            } else {
                // no output nor error
                newResult.output = ""
                newResult.error = ""
                newResult.status = statusCodes.success
            }
        } catch (error) {
            errorMsg = `${lang}-web failed with input:\n${currCode}\n\nerror:\n${error}`
            newResult.error = errorMsg
            newResult.status = `${lang}-web-failed`
            throw new Error(errorMsg)
        } finally {
            setLastSnippet(input)
            setOutput(newResult)
            setRunFinished(true)
            if (!outputRendered) {
                setOutputRendered(true) // hack for the playground editor
            }
        }
    }

    const onDidChangeCode = (code: string) => {
        setCurrCode(code)
    }

    return (
        <div>
            <CustomCodeEditor
                input={code}
                id={result.hash}
                showLineNumbers={showLineNumbers}
                onChange={onDidChangeCode}
                editable={editable || outputRendered}
                language={highlight}
                githubRepo={githubRepo}
                readonly={readonly}
                sandbox={sandbox}
            />
            <>
                <div className={styles.buttons}>
                    <RunButton
                        onClick={onDidClickRun}
                        runFinished={runFinished}
                    />
                </div>
                {outputRendered ? (
                    <Output
                        language={lang}
                        codeChanged={codeChanged}
                        result={output}
                        statusCodes={statusCodes}
                    />
                ) : (
                    <div />
                )}
            </>
        </div>
    )
}
