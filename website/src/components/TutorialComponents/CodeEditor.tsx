import React, { useRef, useState } from "react";
import clsx from "clsx";
import Editor, { useMonaco } from "@monaco-editor/react";
import codeBlockContentStyles from '@docusaurus/theme-classic/src/theme/CodeBlock/Content/styles.module.css';
import CopyButton from '@theme/CodeBlock/CopyButton';
import { useEffect } from "react";

export function ResetBtn(props: { resetCode: () => void }) {
    const { resetCode } = props;
    return (
        <button
            type="button"
            aria-label="Reset code"
            title="Reset code"
            className={clsx(
                'clean-btn',
                codeBlockContentStyles.codeButton
            )}
            onClick={resetCode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
            </svg>
        </button>
    );
}

export function UndoBtn(props: { undoCode: () => void }) {
    const { undoCode } = props;
    return (
        <button
            type="button"
            aria-label="Undo the reset"
            title="Undo the reset"
            className={clsx(
                'clean-btn',
                codeBlockContentStyles.codeButton,
            )}
            style={{ borderColor: "var(--custom-editor-reset-color)" }}
            onClick={undoCode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--custom-editor-reset-color)" strokeWidth="3" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
        </button>
    );
}


export function CodeEditor(props: {
    lang: string;
    code: string;
    disabled: boolean;
    readonly: boolean;
    className: string;
    style?: React.CSSProperties;
    onChange: (code: string) => void;
    githubRepo: string;
}) {

    const [code, setCode] = useState(props.code);
    const [allowUndo, setAllowUndo] = useState(false);
    const [tmpCode, setTmpCode] = useState("");
    const disabled = props.disabled;

    const handleEditorChange = (value: string) => {
        setCode(value);
    }

    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
            });
        }
    }, [monaco]);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(code);
        }
    }, [code]);

    const onClickReset = () => {
        setTmpCode(code.slice()); // use copy not reference
        setCode(props.code);
        setAllowUndo(true);
        setTimeout(() => {
            setAllowUndo(false);
        }, 3000);
    }

    const onClickUndo = () => {
        setCode(tmpCode);
    }

    const options = {
        readOnly: disabled,
        minimap: { enabled: false },
        fontSize: '15px'
    };

    const numLines = code.split('\n').length;
    const height = `${numLines + 4}em`;

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
                <CopyButton className={codeBlockContentStyles.codeButton} code={code} />
                {!props.readonly && !allowUndo && <ResetBtn resetCode={onClickReset} />}
                {!props.readonly && allowUndo && <UndoBtn undoCode={onClickUndo} />}
            </div>
        </div>
    );
}
