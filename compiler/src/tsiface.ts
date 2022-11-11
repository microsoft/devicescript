import * as ts from "typescript"
import { Host } from "./format"
import { prelude } from "./prelude"

class MyHost implements ts.CompilerHost {
    constructor(public fileText: Record<string, string>) {}

    getSourceFile(
        fileName: string,
        languageVersion: ts.ScriptTarget,
        onError?: (message: string) => void,
        shouldCreateNewSourceFile?: boolean
    ): ts.SourceFile {
        let text = ""
        if (this.fileText.hasOwnProperty(fileName)) {
            text = this.fileText[fileName]
        } else {
            if (onError) onError("File not found: " + fileName)
        }
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

    writeFile: ts.WriteFileCallback

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
        return this.fileText.hasOwnProperty(fileName)
    }
    readFile(fileName: string): string {
        if (!this.fileExists(fileName)) return undefined
        return this.fileText[fileName]
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

export function buildAST(host: Host, source: string) {
    const mainFn = host?.mainFileName() || "main.ts"
    const tsHost = new MyHost({
        [mainFn]: source,
        ...prelude,
    })
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
    diagnostics: readonly ts.Diagnostic[]
): string {
    return ts.formatDiagnostics(diagnostics, diagHost).trim()
}
