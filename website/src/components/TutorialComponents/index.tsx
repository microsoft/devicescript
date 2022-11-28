import React, { useState } from "react"
import clsx from "clsx"
import { ThemeClassNames, usePrismTheme } from "@docusaurus/theme-common"
import useIsBrowser from "@docusaurus/useIsBrowser"
import Container from "@theme/CodeBlock/Container"
import CodeEditor from "./CodeBlock"
import { CodeEditor as MonacoEditor } from "./CodeEditor"
import codeBlockContainerStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Container/styles.module.css"
import codeBlockContentStyles from "@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css"
import styles from "./styles.module.css"
import Prism from "prism-react-renderer/prism"

import runJacscript from "./runJacscript"
const clientConfig = {
    ts: runJacscript,
}

interface CodeBlockProps {
    lang: string
    highlight: string
    statusCodes: { [key: string]: string }
    code: string
    result: { [key: string]: string }
    githubRepo: string | undefined
    editable: boolean
    showLineNumbers: boolean
    readonly: boolean
    langVersion?: string
    tool?: string
}

function OutputToggle(props: {
    onClick: () => void
    disabled?: boolean
    version?: string
    tool?: string
}) {
    const { onClick } = props

    return (
        <button className="button button--primary" onClick={onClick}>
            Run
        </button>
    )
}

function RunButton(props: {
    onClick: () => Promise<void>
    runFinished: boolean
}) {
    const { onClick, runFinished } = props
    const text = "Run"
    return (
        <button
            className="button button--primary"
            onClick={async () => await onClick()}
        >
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

    const icon = (b: boolean) => {
        return b ? "✅" : "❌"
    }

    const buildOutput = (
        model1: string,
        res1: { [key: string]: boolean },
        model2?: string,
        res2?: { [key: string]: boolean }
    ) => {
        const secondRow =
            model2 && res2 ? (
                <tr>
                    <td>
                        <pre>{model2}</pre>
                    </td>
                    <td className={styles.TableCellIcon}>{icon(res2.user)}</td>
                    <td className={styles.TableCellIcon}>
                        {icon(res2.secret)}
                    </td>
                </tr>
            ) : (
                <></>
            )

        return (
            <table>
                <tr>
                    <th className={styles.FirstCol}>Model</th>
                    <th>Satisfies your formula?</th>
                    <th>Satisfies the secret formula?</th>
                </tr>
                <tr>
                    <td>
                        <pre>{model1}</pre>
                    </td>
                    <td className={styles.TableCellIcon}>{icon(res1.user)}</td>
                    <td className={styles.TableCellIcon}>
                        {icon(res1.secret)}
                    </td>
                </tr>
                {secondRow}
            </table>
        )
    }

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
            {success
                ? emptyOutput
                    ? "--Output is empty--"
                    : result.output
                : !timeout && result.error}
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
}) {
    const {
        input,
        language,
        showLineNumbers,
        editable,
        githubRepo,
        onChange,
        readonly,
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
            {editable ? (
                <MonacoEditor
                    lang={language}
                    code={input}
                    disabled={!editable}
                    onChange={onChange}
                    readonly={readonly}
                    githubRepo={githubRepo}
                    className={codeBlockContentStyles.codeBlockContent}
                />
            ) : (
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
                />
            )}
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
    } = input
    const [currCode, setCurrCode] = useState(code)
    const [outputRendered, setOutputRendered] = useState(false)
    const [runFinished, setRunFinished] = useState(true)
    const [output, setOutput] = useState(result)
    const [lastSnippet, setLastSnippet] = useState(code)
    const codeChanged = lastSnippet !== currCode

    const onDidClickOutputToggle = () => {
        setOutputRendered(!outputRendered)
    }

    // bypassing server-side rendering
    const onDidClickRun = async () => {
        setRunFinished(false)
        const newResult = { ...result }
        let errorMsg: string

        const runProcess = clientConfig[lang]

        let input = currCode
        let process = runProcess(input)

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
            />
            <>
                <div className={styles.buttons}>
                    {!readonly && !editable && !outputRendered && (
                        <OutputToggle onClick={onDidClickOutputToggle} />
                    )}
                    {!readonly && (editable || outputRendered) && (
                        <RunButton
                            onClick={onDidClickRun}
                            runFinished={runFinished}
                        />
                    )}
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
