import * as ts from "typescript"
import { Host } from "./format"

export function trace(...args: any) {
    console.debug("\u001b[32mTRACE:", ...args, "\u001b[0m")
}

class TsHost implements ts.CompilerHost {
    private fileCache: Record<string, string> = {}

    constructor(
        public host: Host,
        public prelude: Record<string, string>,
        public checkModule: (path: string, pkgJSON: string) => boolean
    ) {}

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

    realpath(path: string): string {
        return this.host.resolvePath(path)
    }

    getDefaultLibFileName(options: ts.CompilerOptions): string {
        return "corelib.d.ts"
    }
    getDefaultLibLocation?(): string {
        return "."
    }
    getCurrentDirectory(): string {
        return this.host.resolvePath(".")
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
        if (fileName.endsWith(".tsx")) return undefined
        if (this.fileCache.hasOwnProperty(fileName)) {
            text = this.fileCache[fileName]
        } else {
            if (this.prelude.hasOwnProperty(fileName)) {
                text = this.prelude[fileName]
            } else {
                try {
                    text = this.host.read(fileName)
                    if (this.host.getFlags?.()?.traceFiles)
                        trace(`read file: ${fileName} (size: ${text.length})`)
                    if (fileName.replace(/.*[\/\\]/, "") == "package.json") {
                        if (!this.checkModule(fileName.slice(0, -12), text)) {
                            if (this.host.getFlags?.()?.traceFiles)
                                trace(`invalid module at ${fileName}`)
                            text = null
                        }
                    }
                } catch (e) {
                    if (this.host.getFlags?.()?.traceAllFiles)
                        trace("file missing: " + fileName)
                    text = null
                }
                this.fileCache[fileName] = text
            }
        }
        if (text == null) return undefined
        return text
    }
    trace(s: string): void {
        console.log(s)
    }
    usedFiles() {
        return Object.entries(this.fileCache)
            .map(([fn, text]) => (text == null ? null : fn))
            .filter(Boolean)
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
    prelude: Record<string, string>,
    checkModule: (path: string, pkgJSON: string) => boolean
) {
    const tsHost = new TsHost(host, prelude, checkModule)

    const tsOptions: ts.CompilerOptions = {
        allowJs: false,
        allowUnreachableCode: true,
        allowUnusedLabels: true,
        alwaysStrict: false,
        checkJs: false,
        declaration: false,
        experimentalDecorators: true,
        forceConsistentCasingInFileNames: true,
        // lib: string[];
        module: ts.ModuleKind.ES2022,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
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
        typeRoots: [],
        types: [],
        noDtsResolution: true,
        // types?: string[];
    }
    const program = ts.createProgram({
        rootNames: Object.keys(prelude).concat([mainFn]),
        options: tsOptions,
        host: tsHost,
    })
    return { program, usedFiles: () => tsHost.usedFiles() }
}

const diagHost: ts.FormatDiagnosticsHost = {
    getCurrentDirectory: () => ".",
    getCanonicalFileName: fn => fn,
    getNewLine: () => "\n",
}

export function mkDiag(
    filename: string,
    messageText: string,
    category = ts.DiagnosticCategory.Error
): ts.Diagnostic {
    return {
        category,
        code: 9997,
        file: {
            text: "",
            fileName: filename,
        } as ts.SourceFile,
        start: 1,
        length: 100,
        messageText,
    }
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
