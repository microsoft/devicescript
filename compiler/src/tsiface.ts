import * as ts from "typescript"
import { Host } from "./format"

class TsHost implements ts.CompilerHost {
    constructor(public host: Host, public prelude: Record<string, string>) {}

    getSourceFile(
        fileName: string,
        languageVersion: ts.ScriptTarget,
        onError?: (message: string) => void,
        shouldCreateNewSourceFile?: boolean
    ): ts.SourceFile {
        let text = this.readFile(fileName)
        if (text == null) {
            onError("File not found: " + fileName)
            text = ""
        }
        const setParentNodes = true
        return ts.createSourceFile(
            fileName,
            text,
            languageVersion,
            setParentNodes
        )
    }

    writeFile(
        fileName: string,
        text: string,
        writeByteOrderMark: boolean,
        onError?: (message: string) => void
    ) {
        this.host.write(fileName, text)
    }

    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return "corelib.d.ts"
    }
    getDefaultLibLocation?(): string {
        return "."
    }
    getCurrentDirectory(): string {
        return "."
    }
    getCanonicalFileName(fileName: string): string {
        return fileName
    }
    useCaseSensitiveFileNames(): boolean {
        return true
    }
    getNewLine(): string {
        return "\n"
    }
    fileExists(fileName: string): boolean {
        return this.readFile(fileName) != undefined
    }
    readFile(fileName: string): string {
        let text = ""
        if (this.prelude.hasOwnProperty(fileName)) {
            text = this.prelude[fileName]
        } else {
            try {
                text = this.host.read(fileName)
            } catch (e) {
                text = undefined
            }
        }
        if (text == null) return undefined
        return text
    }
    trace?(s: string): void {
        console.log(s)
    }
}

export function getProgramDiagnostics(program: ts.Program): ts.Diagnostic[] {
    let diagnostics = program.getConfigFileParsingDiagnostics()
    addDiags(() => program.getOptionsDiagnostics())
    addDiags(() => program.getSyntacticDiagnostics())
    addDiags(() => program.getGlobalDiagnostics())
    addDiags(() => program.getSemanticDiagnostics())
    return diagnostics.slice(0)

    function addDiags(f: () => readonly ts.Diagnostic[]) {
        if (!diagnostics.some(d => d.category == ts.DiagnosticCategory.Error))
            diagnostics = diagnostics.concat(f())
    }
}

export function buildAST(
    mainFn: string,
    host: Host,
    prelude: Record<string, string>
) {
    const tsHost = new TsHost(host, prelude)
    tsHost.writeFile = (fileName, data, writeBOM, onError) => {
        host.write(fileName, data)
    }

    const tsOptions: ts.CompilerOptions = {
        allowJs: true,
        allowUnreachableCode: true,
        allowUnusedLabels: true,
        alwaysStrict: false,
        checkJs: true,
        declaration: false,
        experimentalDecorators: true,
        forceConsistentCasingInFileNames: true,
        // lib: string[];
        module: ts.ModuleKind.ES2022,
        newLine: ts.NewLineKind.LineFeed,
        noEmit: true,
        noFallthroughCasesInSwitch: true,
        noImplicitAny: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        // noStrictGenericChecks: true,
        noPropertyAccessFromIndexSignature: true,
        // noLib: true,
        noImplicitOverride: true,
        // skipLibCheck: true,
        // skipDefaultLibCheck: true,
        sourceMap: false,
        strict: true,
        // strictFunctionTypes: false,
        // strictBindCallApply: false,
        strictNullChecks: false,
        // strictPropertyInitialization: false,
        // suppressExcessPropertyErrors: true,
        // suppressImplicitAnyIndexErrors: true,
        target: ts.ScriptTarget.ES2022,
        useUnknownInCatchVariables: true,
        // types?: string[];
    }
    const program = ts.createProgram({
        rootNames: Object.keys(prelude).concat([mainFn]),
        options: tsOptions,
        host: tsHost,
    })
    return program
}

const diagHost: ts.FormatDiagnosticsHost = {
    getCurrentDirectory: () => ".",
    getCanonicalFileName: fn => fn,
    getNewLine: () => "\n",
}

export function formatDiagnostics(
    diagnostics: readonly ts.Diagnostic[],
    basic = false
): string {
    const diag = basic
        ? ts.formatDiagnostics(diagnostics, diagHost)
        : ts.formatDiagnosticsWithColorAndContext(diagnostics, diagHost)
    return diag.trim()
}
