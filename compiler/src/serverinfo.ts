import { buildAST } from "./tsiface"
import * as ts from "typescript"
import { Host } from "./format"
import { preludeFiles } from "./specgen"
import { camelize, upperCamel } from "./util"
import { ServerInfoFile } from "@devicescript/interop"
import { getSymTags } from "./compiler"

export function serverInfo(host: Host) {
    const { program } = buildAST(
        "node_modules/@devicescript/drivers/src/index.ts",
        host,
        preludeFiles(host.getConfig()),
        () => true
    )

    const checker = program.getTypeChecker()
    const info: ServerInfoFile = { servers: [] }

    for (const file of program.getSourceFiles()) {
        for (const stmt of file.statements) {
            if (
                ts.isModuleDeclaration(stmt) &&
                ts.isStringLiteral(stmt.name) &&
                stmt.name.text == "@devicescript/servers"
            ) {
                if (stmt.body && ts.isModuleBlock(stmt.body)) {
                    stmt.body.statements.forEach(serverStmt)
                }
            } else if (
                ts.isFunctionDeclaration(stmt) &&
                ts.isIdentifier(stmt.name) &&
                stmt.name.text.startsWith("start")
            ) {
                customServer(stmt)
            }
        }
    }

    return info

    function customServer(stmt: ts.FunctionDeclaration) {
        const sym = checker.getSymbolAtLocation(stmt.name)
        const tags = getSymTags(sym, "")
        if (!tags["ds-part"]) return

        const serv = (tags?.["ds-services"] ?? "")
            .split(/[,;\s]+/)
            .filter(Boolean)
            .map(servName => {
                const spec = host
                    .getConfig()
                    .services.find(
                        s => s.camelName.toLowerCase() == servName.toLowerCase()
                    )
                if (!spec) oops(`no service ${servName}`)
                return spec
            })

        const detail = stmt
            .getFullText()
            .replace(/\s*\/\*\*\s+(\*\s*)*/, "")
            .replace(/\n[^]*/, "")

        let tp = checker
            .getTypeAtLocation(stmt.name)
            .getCallSignatures()?.[0]
            ?.getReturnType()

        if (!tp) oops(`unknown return type for ${sym.name}`)

        let isAwait = ""

        if (tp.getSymbol()?.name === "Promise") {
            isAwait = "await "
            tp = (tp as ts.GenericType).typeArguments?.[0]
        }

        let varName = sym.name.slice("start".length).toLowerCase()

        if (!tp.isClass()) {
            varName =
                "{ " +
                tp
                    .getProperties()
                    .map(p => p.name)
                    .join(", ") +
                " }"
        }

        const snippet = `const ${varName} = ${isAwait}${sym.name}()\n`

        info.servers.push({
            label: tags["ds-part"] ?? sym.name.slice("start".length),
            detail,
            startName: sym.name,
            classIdentifiers: serv.length
                ? serv.map(s => s.classIdentifier)
                : undefined,
            imports: {
                [sym.name]: "@devicescript/drivers",
            },
            snippet,
        })
    }

    function serverStmt(stmt: ts.Statement) {
        if (!ts.isFunctionDeclaration(stmt)) return
        const n = stmt.name?.text
        if (!n || !n.startsWith("start")) return
        const servName = n.slice(5)
        if (servName == "Power") return
        const spec = host
            .getConfig()
            .services.find(s => upperCamel(s.camelName) == servName)
        if (!spec) oops(`no service ${servName}`)
        let snippet = `const ${camelize(servName)} = ${n}({\n`
        const argTp = checker.getTypeAtLocation(stmt.parameters[0])
        let idx = 1
        for (const prop of argTp.getProperties()) {
            if (prop.flags & ts.SymbolFlags.Optional) continue
            const init = prop.name.startsWith("pin")
                ? `pins.\${${idx++}}`
                : `\${${idx++}}`
            snippet += `    ${prop.name}: ${init},\n`
        }
        snippet += "})\n"
        info.servers.push({
            label: spec.name,
            detail: (spec.notes["short"] ?? "").replace(/\n[^]*/, ""),
            startName: n,
            classIdentifiers: [spec.classIdentifier],
            imports: {
                [n]: "@devicescript/servers",
            },
            snippet,
        })
    }

    function oops(msg: string): never {
        throw new Error("server-info.json generation problem: " + msg)
    }
}
