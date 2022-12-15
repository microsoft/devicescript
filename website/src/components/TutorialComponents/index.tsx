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
    showLineNumbers: boolean
    langVersion?: string
    tool?: string
    prefix?: string
    noRun?: boolean
    sandbox?: {
        files: Record<string, { content: string }>
        main?: string
    }
}

function RunButton(props: { onClick: () => Promise<void> }) {
    const { onClick } = props
    return (
        <button className="button button--primary" onClick={onClick}>
            Run
        </button>
    )
}

function CustomCodeEditor(props: {
    id: string
    input: string
    showLineNumbers?: boolean
    language?: string
    onChange?: (code: string) => void
    githubRepo: string | undefined
    prefix?: string
    sandbox?: {
        files: Record<string, { content: string }>
        main?: string
    }
}) {
    const {
        input,
        language,
        showLineNumbers,
        githubRepo,
        onChange,
        sandbox,
        prefix,
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
                codeBlockContainerStyles.codeBlockContainer,
                ThemeClassNames.common.codeBlock,
                language && `language-${language}`
            )}
        >
            <CodeEditor
                code={input}
                theme={prismTheme}
                disabled={false}
                key={String(isBrowser)}
                className={codeBlockContentStyles.codeBlockContent}
                onChange={onChange}
                language={language}
                prism={Prism}
                readonly={true}
                showLineNumbers={showLineNumbers}
                sandbox={sandbox}
                prefix={prefix}
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
        showLineNumbers,
        sandbox,
        prefix,
        noRun,
    } = input
    const currCode = code
    const [outputRendered, setOutputRendered] = useState(false)
    const { setSource } = useContext(DevToolsContext)
    const clientConfig = {
        ts: input => {
            setSource(input)
            return JSON.stringify({ output: "", error: "" })
        },
    }

    // bypassing server-side rendering
    const onDidClickRun = async () => {
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
            if (!outputRendered) {
                setOutputRendered(true) // hack for the playground editor
            }
        }
    }

    return (
        <div>
            <CustomCodeEditor
                input={code}
                id={result.hash}
                showLineNumbers={showLineNumbers}
                language={highlight}
                githubRepo={githubRepo}
                sandbox={sandbox}
                prefix={prefix}
            />
            {!noRun && (
                <div className={styles.buttons}>
                    <RunButton onClick={onDidClickRun} />
                </div>
            )}
        </div>
    )
}
