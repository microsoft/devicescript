const fs = require("fs")

interface OpCode {
    name: string
    args: string[]
    code: string
    description?: string
    comment?: string
    comment2?: string
    isFun?: boolean
    takesNumber?: boolean
}
interface SMap<T> {
    [name: string]: T
}
interface Spec {
    stmt: OpCode[]
    stmtProps?: string
    expr: OpCode[]
    exprProps?: string
    enums: SMap<OpCode[]>
}

const spec = processSpec(fs.readFileSync(process.argv[2], "utf-8"))
spec.stmtProps = serializeProps(spec.stmt, opcodeProps)
spec.exprProps = serializeProps(spec.expr, opcodeProps)
writeFile("bytecode.json", JSON.stringify(spec, null, 4))
writeFile("jacs_bytecode.h", genCode())
writeFile("bytecode.ts", genCode(true))

function processSpec(filecontent: string): Spec {
    let backticksType: string = null
    let lineNo = 0
    let currColl: OpCode[] = null
    let currObj: OpCode = null
    const res: Spec = {
        stmt: [],
        expr: [],
        enums: {
            BinFmt: [],
        },
    }

    try {
        for (const line of filecontent.split(/\n/)) {
            lineNo++
            processLine(line)
        }
    } catch (e) {
        error("exception: " + e.message)
    }

    finish()

    checkCont(res.stmt)
    checkCont(res.expr)

    return res

    function checkCont(lst: OpCode[]) {
        let nums = [1]
        for (const obj of lst) {
            const idx = +obj.code
            if (nums[idx]) error(`duplicate ${obj.name} ${idx}`)
            nums[idx] = 1
        }
        if (nums.length != lst.length + 1) error("non-cont")
    }

    function error(msg = "syntax error") {
        console.log(`error at ${lineNo}: ${msg}`)
    }

    function processLine(line: string) {
        if (backticksType) {
            if (line.trim() == "```") {
                const prev = backticksType
                backticksType = null
                if (prev == "default") return
            }
        } else {
            const m = /^```(.*)/.exec(line)
            if (m) {
                backticksType = m[1] || "default"
                // if we just switched into code section, don't interpret this line and don't add to any description
                if (backticksType == "default") return
            }
        }

        const interpret =
            backticksType == "default" ||
            (backticksType == null && line.slice(0, 4) == "    ")

        if (!interpret) {
            let m = /^(##+)\s*(.*)/.exec(line)
            if (m) {
                currObj = null
                const [, hd, cont] = m
                switch (cont) {
                    case "Statements":
                        currColl = res.stmt
                        break
                    case "Expressions":
                        currColl = res.expr
                        break
                    case "Format Constants":
                        currColl = res.enums.BinFmt
                        break
                    default:
                        m = /Enum: (\w+)/.exec(cont)
                        if (m) currColl = res.enums[m[1]] = []
                        else error("bad header")
                }
            }

            if (currObj) {
                if (line.trim() && !currObj.description)
                    currObj.description = ""
                if (currObj.description != null)
                    currObj.description += line + "\n"
            }
        } else {
            let lineTr = line.trim()
            let isFun = undefined
            if (lineTr.startsWith("fun ")) {
                isFun = true
                lineTr = lineTr.slice(4).trim()
            }
            let m =
                /^(\w+)(\s*\((.*)\))?\s*=\s*(\d+|0[Xx][a-fA-F0-9]+)\s*(\/\/\s*(.*))?$/.exec(
                    lineTr
                )
            if (!m) {
                error()
                return
            }
            if (!currColl) {
                error("no container")
                return
            }
            const [_line, name, _paren, args_str, code, _cmt, comment] = m
            let args: string[] = []
            if (args_str) args = args_str.split(/,\s*/).filter(s => !!s.trim())
            finish()
            currObj = {
                name,
                args,
                code,
                comment,
                isFun,
            }
            if (args[0] && args[0][0] == "*") {
                currObj.takesNumber = true
                args[0] = args[0].slice(1)
            }
            if (!comment && args.length > 0) {
                let c = args.join(", ")
                if (c != "x" && c != "x, y") {
                    if (currObj.takesNumber) c = "*" + c
                    currObj.comment2 = c
                }
            }
            currColl.push(currObj)
        }
    }

    function finish() {
        if (currObj?.description)
            currObj.description = currObj.description.trim()
    }
}

function writeFile(name: string, cont: string) {
    console.log(`write ${name}`)
    fs.writeFileSync("build/" + name, cont)
}

function sig(obj: OpCode) {
    const numargs = obj.args.length
    return obj.takesNumber
        ? "x" + (numargs - 1 ? numargs - 1 : "")
        : "" + numargs
}

function sortByCode(lst: OpCode[]) {
    lst = lst.slice()
    lst.sort((a, b) => +a.code - +b.code)
    return lst
}

function serializeProps(lst: OpCode[], fn: (o: OpCode) => number) {
    const nums = sortByCode(lst).map(fn)
    nums.unshift(0x7f)
    return (
        '"' +
        nums.map(n => "\\x" + ("00" + n.toString(16)).slice(-2)).join("") +
        '"'
    )
}

function genCode(isTS = false) {
    let r = "// Auto-generated from bytecode.md; do not edit.\n"
    if (isTS) r += "\n"
    else r += "#pragma once\n\n"

    startEnum("OpStmt")
    for (const obj of spec.stmt) {
        emitDefine(`STMT${sig(obj)}_`, obj)
    }
    emitDefine(`STMT_`, {
        name: "past_last",
        code: spec.stmt.length + 1 + "",
        args: [],
    })
    endEnum()
    emitConst("stmt_props", spec.stmtProps)

    startEnum("OpExpr")
    for (const obj of spec.expr) {
        emitDefine(`EXPR${sig(obj)}_`, obj)
    }
    emitDefine(`EXPR_`, {
        name: "past_last",
        code: spec.expr.length + 1 + "",
        args: [],
    })
    endEnum()
    emitConst("expr_props", spec.exprProps)

    for (const enName of Object.keys(spec.enums)) {
        const pref =
            isTS || enName == "BinFmt" ? "" : enName.toUpperCase() + "_"
        startEnum(enName)
        for (const obj of spec.enums[enName]) {
            emitDefine(pref, obj)
        }
        endEnum()
    }

    return r

    function addCmt(cmt: string) {
        if (!cmt) return ""
        return "  // " + cmt
    }

    function emitConst(name: string, val: string, comment?: string) {
        comment = addCmt(comment)
        if (isTS)
            r += `export const ${name.toUpperCase()} = ${val} ${comment}\n`
        else r += `#define JACS_${name.toUpperCase()} ${val} ${comment}\n`
    }

    function startEnum(name: string) {
        r += "\n"
        if (isTS) r += `export enum ${name} {\n`
    }
    function endEnum() {
        if (isTS) r += `}\n`
        r += "\n"
    }

    function emitDefine(pref: string, obj: OpCode) {
        const cmt = addCmt(obj.comment || obj.comment2)
        const val = obj.code
        const name = pref + obj.name.toUpperCase()
        if (isTS) r += `    ${name} = ${val}, ${cmt}\n`
        else r += `#define JACS_${name} ${val} ${cmt}\n`
    }
}

function lookupEnum(en: string, fld: string) {
    return +spec.enums[en].find(o => o.name == fld).code
}

function opcodeProps(obj: OpCode) {
    let r = obj.args.length
    if (obj.takesNumber) r |= lookupEnum("BytecodeFlag", "takes_number")
    if (obj.isFun) r |= lookupEnum("BytecodeFlag", "is_stateless")
    return r
}
