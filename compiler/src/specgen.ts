import {
    cStorage,
    addComment,
    wrapComment,
} from "../../runtime/jacdac-c/jacdac/spectool/jdspec"
import { jacdacDefaultSpecifications } from "./embedspecs"
import { prelude } from "./prelude"
import { camelize, upperCamel } from "./util"

function isRegister(k: jdspec.PacketKind) {
    return k == "ro" || k == "rw" || k == "const"
}

function toHex(n: number): string {
    if (n === undefined) return ""
    if (n < 0) return "-" + toHex(n)
    return "0x" + n.toString(16)
}

export function specToDeviceScript(info: jdspec.ServiceSpec): string {
    if (info.status === "deprecated") return ""

    let r = ""

    for (const en of Object.values(info.enums)) {
        const enPref = enumName(en.name)
        r += `enum ${enPref} { // ${cStorage(en.storage)}\n`
        for (const k of Object.keys(en.members)) {
            r += "    " + k + " = " + toHex(en.members[k]) + ",\n"
        }
        r += "}\n\n"
    }

    const clname = upperCamel(info.camelName)
    const baseclass = info.extends.indexOf("_sensor") >= 0 ? "Sensor" : "Role"

    // emit stats as attributes
    {
        let cmt = `${info.name}\n`
        const descr = info.notes["long"] || info.notes["short"]
        if (descr) cmt += `${descr}\n\n`
        if (!info.status || info.status === "experimental")
            cmt += "@experimental\n"
        if (info.group) cmt += `@group ${info.group}\n`
        if (info.tags?.length) cmt += `@category ${info.tags[0]}\n`
        r += wrapComment("devs", cmt)
    }
    // emit class
    r += `class ${clname} extends ${baseclass} {\n`

    for (const pkt of info.packets) {
        if (pkt.derived) continue // ???
        const cmt = addComment(pkt)

        let tp = ""

        // if there's a startRepeats before last field, we don't put ... before it
        const earlyRepeats = pkt.fields
            .slice(0, pkt.fields.length - 1)
            .some(f => f.startRepeats)

        const fields = pkt.fields
            .map(f => {
                const tp =
                    f.type == "string" || f.type == "string0"
                        ? "string"
                        : info.enums[f.type]
                        ? enumName(f.type)
                        : "number"
                if (f.startRepeats && !earlyRepeats)
                    return `...${f.name}: ${tp}[]`
                else return `${f.name}: ${tp}`
            })
            .join(", ")

        if (isRegister(pkt.kind)) {
            if (cmt.needsStruct) {
                tp = `RegisterArray`
                if (pkt.fields.length > 1) tp += ` & { ${fields} }`
            } else {
                if (pkt.fields.length == 1 && pkt.fields[0].type == "string")
                    tp = "RegisterString"
                else if (pkt.fields.length == 1 && pkt.fields[0].type == "bytes")
                    tp = "RegisterBuffer"
                else tp = "RegisterNum"
            }
        } else if (pkt.kind == "event") {
            tp = "Event"
        } else if (pkt.kind == "command") {
            r += wrapComment("devs", cmt.comment)
            r += `    ${camelize(pkt.name)}(${fields}): void\n`
        }

        if (tp) {
            r += wrapComment("devs", cmt.comment)
            r += `    ${camelize(pkt.name)}: ${tp}\n`
        }
    }

    r += "}\n"

    return r.replace(/ *$/gm, "")

    function enumName(n: string) {
        return upperCamel(info.camelName) + upperCamel(n)
    }
}

export function preludeFiles(specs?: jdspec.ServiceSpec[]) {
    if (!specs) specs = jacdacDefaultSpecifications
    const r = { ...prelude }
    const thespecs = specs.map(specToDeviceScript).join("\n")
    const withmodule = `declare module "@devicescript/core" {\n${thespecs}\n}\n`
    r["devicescript-spec.d.ts"] = withmodule
    return r
}
