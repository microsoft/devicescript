const fs = require("fs")
const path = require("path")

const scriptArgs = process.argv.slice(2)
let numerr = 0

const byObj = {}
const allfuns = []

const firstFun = 50000

let r = `// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF

#define N(n) (DEVS_BUILTIN_STRING_ ## n)

`

const bytecodedef = fs.readFileSync(scriptArgs.shift(), "utf-8")

const deriveMap = {}

let maxParms = 0
for (const fn of scriptArgs) {
    let lineNo = 0
    r += `// ${path.basename(fn)}\n`

    let isMeth = false
    let argmap = null
    for (const ln of fs.readFileSync(fn, "utf-8").split(/\r?\n/)) {
        ++lineNo

        ln.replace(/^\s*DEVS_DERIVE\((\w+), (\w+)\)/, (_, cl, base) => {
            deriveMap[cl] = base
            if (!byObj[cl])
                byObj[cl] = []
            return ""
        })

        if (ln[0] == '}') {
            checkArgmap()
            continue
        }

        if (argmap) {
            ln.replace(/\bdevs_arg(\w*)\(ctx, (\d+)[\),]/g, (_1, _2, n) => {
                accessArg(+n)
            })


            ln.replace(/\b(fun|meth)(\d+)_\w/g, (_1, fm, n) => {
                for (let i = 0; i < +n; ++i) accessArg(i)
                if (fm == "meth") accessArg(-1)
            })

            if (/\bdevs_arg_self\w*\(/.test(ln))
                accessArg(-1)
        }

        const m = /^(static\s+)?(\w+) ((fun|prop|meth)(X|\d*)_(\w+))\((.*)\)/.exec(ln)
        if (!m)
            continue
        const [full, isStatic, retTp, fnName, funProp, numArgsStr, suffName, argString] = m
        const flags = []


        checkArgmap()
        let numArgs = parseInt(numArgsStr) || 0
        argmap = []
        argmap[numArgs] = undefined
        isMeth = funProp != 'fun'

        if (isStatic)
            continue

        const m2 = /^([a-zA-Z0-9]+)_(\w+)$/.exec(suffName)
        const [_x, className, methodName] = m2
        let objId = className

        r += `${full};\n`

        const argWords = argString.split(/,\s*/).map(s => s.trim())
        if (argWords[0] != "devs_ctx_t *ctx")
            error("first arg should be ctx")

        const params = argWords.slice(1)
        let fld = ".meth"
        if (funProp == "prop") {
            if (numArgsStr != "" && numArgsStr != "0")
                error("props don't take args")
            flags.push("PROP")
            if (retTp == "value_t") {
                // OK
            } else {
                error("only value_t supported as return")
            }
            if (params.length != 1 || params[0] != "value_t self")
                error("only a single self param supported in props")
            fld = ".prop"
            argmap = null
        } else {
            if (retTp == "void") {
                // OK
            } else {
                error("only void supported as return")
            }
            if (numArgsStr == "")
                error("fun/prop need number of args")
            else if (numArgsStr == "X")
                argmap = null
            if (params.length)
                error(`params not supported`)
        }
        if (funProp == 'fun') {
            flags.push("NO_SELF")
        } else {
            objId += "_prototype"
        }

        maxParms = Math.max(numArgs, maxParms)

        const fl = flags.length == 0 ? "0" : flags.join("|")

        if (!byObj[objId])
            byObj[objId] = []
        byObj[objId].push(`{ N(${methodName.toUpperCase()}), ${firstFun + allfuns.length} }`)

        allfuns.push(`{ N(${methodName.toUpperCase()}), ${numArgs}, ${fl}, { ${fld} = ${fnName} } }`)
    }

    function error(msg) {
        console.error(`${fn}:${lineNo}: ${msg}`)
        numerr++
    }

    function checkArgmap() {
        if (!argmap)
            return
        if (isMeth && !argmap[0])
            error("self not accessed")
        for (let i = 1; i < argmap.length; ++i)
            if (!argmap[i])
                error(`arg #${i - 1} not accessed`)
        argmap = null
    }

    function accessArg(n) {
        if (n == -1) {
            if (!isMeth)
                error(`accessing self in non-method`)
        }
        n++
        if (argmap.length <= n) {
            error(`accessing arg #${n - 1} out of ${argmap.length - 1}`)
        }
        argmap[n] = true
    }
}

if (numerr)
    process.exit(1)

r += "\n"
byObj["empty"] = []
for (const k of Object.keys(byObj)) {
    r += `static const devs_builtin_proto_entry_t ${k}_entries[] = { //\n`
    r += byObj[k].map(s => s + ", //\n").join("")
    r += "{ 0, 0 }};\n\n"
}
delete byObj["empty"]

r += `const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {\n`
const filledKeys = {}
for (const k of Object.keys(byObj)) {
    const base = deriveMap[k] ? `&devs_builtin_protos[DEVS_BUILTIN_OBJECT_${deriveMap[k].toUpperCase()}]` : `NULL`
    delete deriveMap[k]
    const key = `DEVS_BUILTIN_OBJECT_${k.toUpperCase()}`
    filledKeys[key] = 1
    r += `[${key}] = { DEVS_BUILTIN_PROTO_INIT, ${base}, ${k}_entries },\n`
}

filledKeys["DEVS_BUILTIN_OBJECT___MAX"] = 1
filledKeys["DEVS_BUILTIN_OBJECT__VAL"] = 1

bytecodedef.replace(/^#define (DEVS_BUILTIN_OBJECT_\w+)/mg, (_, key) => {
    if (filledKeys[key])
        return ""
    r += `[${key}] = { DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries },\n`
    return ""
})

r += "};\n\n"


r += `uint16_t devs_num_builtin_functions = ${allfuns.length};\n`
r += `const devs_builtin_function_t devs_builtin_functions[${allfuns.length}] = {\n`
r += allfuns.join(",\n")
r += "};\n\n"

r += `STATIC_ASSERT(${maxParms} <= DEVS_BUILTIN_MAX_ARGS);\n`
r += `STATIC_ASSERT(${firstFun} == DEVS_FIRST_BUILTIN_FUNCTION);\n`

fs.writeFileSync(path.dirname(scriptArgs[0]) + "/protogen.c", r)