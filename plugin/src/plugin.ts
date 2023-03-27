function init(modules: {
    typescript: typeof import("typescript/lib/tsserverlibrary")
}) {
    const ts = modules.typescript
    let checker: ts.TypeChecker
    let tsDiag: ts.Diagnostic[]
    let file: ts.SourceFile

    const SK = ts.SyntaxKind

    function create(info: ts.server.PluginCreateInfo) {
        const service = info.languageService

        const proxy: ts.LanguageService = Object.create(null)
        for (let k of Object.keys(service) as Array<keyof ts.LanguageService>) {
            const origMember = service[k]
            proxy[k] = (...args: Array<{}>) => origMember.apply(service, args)
        }

        proxy.getSemanticDiagnostics = fileName => {
            tsDiag = service.getSemanticDiagnostics(fileName)
            const prog = service.getProgram()

            if (isDeviceScript(prog)) {
                checker = prog.getTypeChecker()
                file = prog.getSourceFile(fileName)
                checkNodeRec(file)
            }

            return tsDiag
        }

        return proxy
    }

    return { create }

    function typeAt(node: ts.Node) {
        if (!node) return undefined
        return checker.getTypeAtLocation(node)
    }

    function checkNodeRec(node: ts.Node) {
        checkNode(node)
        node.forEachChild(checkNodeRec)
    }

    function isDeviceScript(prog: ts.Program) {
        return prog
            ?.getRootFileNames()
            ?.some(fn => fn.includes(".devicescript"))
    }

    function checkNode(node: ts.Node) {
        if (
            ts.isCallExpression(node) &&
            isPromise(typeAt(node)) &&
            !ts.isAwaitExpression(node.parent)
        ) {
            complain(node, "'await' missing")
        }

        if (ts.isBinaryExpression(node)) {
            const op = node.operatorToken.kind
            if (op == SK.EqualsEqualsToken || op == SK.ExclamationEqualsToken) {
                if (
                    isNullOrUndefinedKw(node.left) ||
                    isNullOrUndefinedKw(node.right)
                ) {
                    // OK
                } else {
                    complain(
                        node,
                        `please use ${
                            op == SK.EqualsEqualsToken ? "===" : "!=="
                        }`
                    )
                }
            }
        }
    }

    function isNullOrUndefinedKw(node: ts.Node) {
        if (node.kind == SK.NullKeyword || node.kind == SK.UndefinedKeyword)
            return true
        return false
    }

    function complain(node: ts.Node, msg: string) {
        const d: ts.Diagnostic = {
            code: 9990,
            start: node.getStart(),
            length: node.getEnd() - node.getStart(),
            source: "@devicescript/plugin",
            category: ts.DiagnosticCategory.Error,
            messageText: msg,
            file,
        }
        tsDiag.push(d)
    }

    function symName(sym: ts.Symbol) {
        if (!sym) return "???"
        if (sym.flags & ts.SymbolFlags.Alias)
            sym = checker.getAliasedSymbol(sym)
        return checker.getFullyQualifiedName(sym)
    }

    function isPromise(tp: ts.Type): boolean {
        if (!tp) return false
        if (tp.flags & ts.TypeFlags.Object)
            return symName(tp.symbol) == "Promise"
        if (tp.isUnionOrIntersection()) return tp.types.some(isPromise)
        return false
    }
}

export = init
