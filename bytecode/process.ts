const fs = require("fs")

interface OpCode {
    name: string
    args: string[]
    code: string
    rettype: string
    printFmt?: string
    description?: string
    comment?: string
    comment2?: string
    isExpr?: boolean
    isFun?: boolean
    takesNumber?: boolean
}
interface SMap<T> {
    [name: string]: T
}
interface Spec {
    ops: OpCode[]
    opProps?: string
    opTypes?: string
    enums: SMap<OpCode[]>
}

const _spec = processSpec(fs.readFileSync(process.argv[2], "utf-8"))
_spec.opProps = serializeProps(_spec.ops, opcodeProps)
_spec.opTypes = serializeProps(_spec.ops, opcodeType)
writeFile("bytecode.json", JSON.stringify(_spec, null, 4))
writeFile("jacs_bytecode.h", genCode(_spec, false))
writeFile("bytecode.ts", genCode(_spec, true))
writeFile("jacs_bytecode.ts", genCode(_spec, true, true))

function processSpec(filecontent: string): Spec {
    const argCodes: SMap<string> = {
        x: "e",
        y: "e",
        value: "e",
        object: "e",
        buffer: "e",
        role: "e",

        numfmt: "n",
        opcall: "o",
        jmpoffset: "j",

        role_idx: "R",
        string_idx: "S",
        local_idx: "L",
        func_idx: "F",
        global_idx: "G",
        param_idx: "P",
        f64_idx: "D",
    }

    let backticksType: string = null
    let lineNo = 0
    let currColl: OpCode[] = null
    let currObj: OpCode = null
    let hasErrors = false
    let isExpr = false
    const res: Spec = {
        ops: [],
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

    checkCont(res.ops)

    if (hasErrors) throw new Error()

    return res

    function computePrintFmt(obj: OpCode) {
        if (obj.comment) {
            const args = obj.args.slice()
            let fmt = obj.comment.replace(/\w+/g, f => {
                const idx = args.indexOf(f)
                if (idx >= 0) {
                    args[idx] = null
                    return bareArgCode(f)
                }
                return f
            })
            const missing = args.find(a => a != null)
            if (missing) error("missing arg in comment: " + missing)
            if (obj.isExpr && fmt.indexOf(" ") >= 0) fmt = `(${fmt})`
            obj.printFmt = fmt
        } else if (obj.args.length == 1 && obj.takesNumber && obj.isExpr) {
            obj.printFmt = argCode(obj.args[0])
        } else if (obj.isExpr) {
            obj.printFmt =
                obj.name + "(" + obj.args.map(argCode).join(", ") + ")"
        } else {
            obj.printFmt =
                obj.name.toUpperCase() + " " + obj.args.map(argCode).join(" ")
        }

        function bareArgCode(a: string) {
            if (argCodes[a]) return "%" + argCodes[a]
            return `%e`
        }

        function argCode(a: string) {
            if (argCodes[a]) return "%" + argCodes[a]
            return `${a}=%e`
        }
    }

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
        hasErrors = true
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
                finish()
                currObj = null
                const [, hd, cont] = m
                if (hd.length >= 3)
                    // sub-headers
                    return
                switch (cont) {
                    case "Statements":
                        currColl = res.ops
                        isExpr = false
                        break
                    case "Expressions":
                        currColl = res.ops
                        isExpr = true
                        break
                    case "Format Constants":
                        isExpr = false
                        currColl = res.enums.BinFmt
                        break
                    default:
                        isExpr = false
                        m = /Enum: (\w+)/.exec(cont)
                        if (m) currColl = res.enums[m[1]] = []
                        else {
                            if (currColl == null) return // initial sections
                            error("bad header")
                        }
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
                /^(\w+)(\s*\((.*)\))?\s*(:\s*(\w+))?\s*=\s*(\d+|0[bB][01]+|0[Xx][a-fA-F0-9]+)\s*(\/\/\s*(.*))?$/.exec(
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
            const [
                _line,
                name,
                _paren,
                args_str,
                _rettype,
                rettype,
                code,
                _cmt,
                comment,
            ] = m
            let args: string[] = []
            if (args_str) args = args_str.split(/,\s*/).filter(s => !!s.trim())
            finish()
            currObj = {
                name,
                args,
                code,
                comment,
                rettype: rettype || "void",
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
            if (isExpr) {
                currObj.isExpr = true
                if (!rettype) error("return type not specified")
            }
            currColl.push(currObj)
        }
    }

    function finish() {
        if (currObj?.description)
            currObj.description = currObj.description.trim()
        if (currObj) computePrintFmt(currObj)
    }
}

function writeFile(name: string, cont: string) {
    console.log(`write ${name}`)
    fs.writeFileSync("build/" + name, cont)
}

function sig(obj: OpCode) {
    const numargs = obj.args.length
    return (
        (obj.isExpr ? "EXPR" : "STMT") +
        (obj.takesNumber
            ? "x" + (numargs - 1 ? numargs - 1 : "")
            : "" + numargs)
    )
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

function genJmpTables(spec: Spec) {
    let r = "\n#define JACS_OP_HANDLERS expr_invalid, \\\n"
    for (const obj of sortByCode(spec.ops)) {
        r += `${sig(obj).toLowerCase()}_${obj.name}, \\\n`
    }
    r += "expr_invalid\n\n"

    return r
}

function genCode(spec: Spec, isTS = false, isSTS = false) {
    let r = "// Auto-generated from bytecode.md; do not edit.\n"
    if (isSTS) r += "\nnamespace jacs {\n"
    else if (isTS) r += "\n"
    else r += "#pragma once\n\n"

    startEnum("Op")
    for (const obj of spec.ops) {
        emitDefine(`${sig(obj)}_`, obj)
    }
    emitDefine(`OP_`, {
        name: "past_last",
        code: spec.ops.length + 1 + "",
        rettype: "number",
        args: [],
    })
    endEnum()
    emitConst("op_props", spec.opProps)
    emitConst("op_types", spec.opTypes)

    for (const enName of Object.keys(spec.enums)) {
        const pref =
            isTS || enName == "BinFmt" ? "" : enName.toUpperCase() + "_"
        startEnum(enName)
        for (const obj of spec.enums[enName]) {
            emitDefine(pref, obj)
        }
        endEnum()
    }

    emitFmts("op", spec.ops)

    if (isTS)
        for (const en of ["Object_Type"])
            emitConst(
                en,
                JSON.stringify(enumNames(spec.enums[en]))
            )

    if (isSTS) r += "} // jacs\n"

    if (!isTS) r += genJmpTables(spec)

    return r

    function emitFmts(id: string, lst: OpCode[]) {
        if (!isTS) return
        lst = sortByCode(lst)
        emitConst(
            id + "_print_fmts",
            "[ null, " +
                lst.map(o => JSON.stringify(o.printFmt)).join(", ") +
                " ]"
        )
    }

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
        if (isTS) r += `export enum ${name.replace(/_/g, "")} {\n`
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
    const ent = _spec.enums[en].find(o => o.name == fld)
    if (!ent) return undefined
    return +ent.code
}

function opcodeProps(obj: OpCode) {
    let r = obj.args.length
    if (obj.takesNumber) {
        r -= 1
        r |= lookupEnum("BytecodeFlag", "takes_number")
    }
    if (obj.isFun) r |= lookupEnum("BytecodeFlag", "is_stateless")
    if (!obj.isExpr) r |= lookupEnum("BytecodeFlag", "is_stmt")
    if (r == undefined) throw new Error()
    return r
}

function opcodeType(obj: OpCode) {
    const tp = lookupEnum("Object_Type", obj.rettype)
    if (tp == undefined) throw new Error("invalid type: " + obj.rettype)
    return tp
}

function enumNames(lst: OpCode[]) {
    const names: string[] = []
    for (const obj of sortByCode(lst)) {
        names[+obj.code] = obj.name
    }
    return names
}
