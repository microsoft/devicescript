import { buildAST } from "./tsiface"
import * as ts from "typescript"
import { Host } from "./format"
import { preludeFiles } from "./specgen"
import { camelize, upperCamel } from "./util"
import { ServerInfoFile } from "@devicescript/interop"

export function serverInfo(host: Host) {
    const { program } = buildAST(
        "src/main.ts",
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
            }
        }
    }

    return info

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
            startName: n,
            classIdentifier: spec.classIdentifier,
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
