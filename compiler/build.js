#!/usr/bin/env node
const esbuild = require("esbuild")
const childProcess = require("child_process")
const path = require("path")
const fs = require("fs-extra")

let watch = false
let fast = false

function getMTime(path) {
    try {
        const st = fs.statSync(path)
        return st.mtimeMs
    } catch {
        return undefined
    }
}

function copyCompiler() {
    const to = "../website/static/dist/devicescript-compiler.js"
    const from = "built/devicescript-compiler.js"
    distCopy(from, to)
}

function copyVM() {
    const dist = "../website/static/dist/devicescript-vm.js"
    const builtDir = "../runtime/devicescript-vm/built"
    const built = builtDir + "/devicescript-vm.js"
    distCopy(dist, built)
}

function distCopy(from, to) {
    const toT = getMTime(to)
    const fromT = getMTime(from)
    if (toT === undefined || fromT > toT + 1) {
        console.debug(`cp ${from} ${to}`)
        try {
            fs.mkdirSync(path.dirname(to))
        } catch {}
        fs.copyFileSync(from, to)
        fs.utimesSync(to, new Date(), new Date(fromT))
    }
}

const args = process.argv.slice(2)
if (args[0] == "--watch" || args[0] == "-watch" || args[0] == "-w") {
    args.shift()
    watch = true
}

if (args[0] == "--fast" || args[0] == "-fast" || args[0] == "-f") {
    args.shift()
    fast = true
}

if (args.length) {
    console.log("Usage: ./build.js [--watch]")
    process.exit(1)
}

function runTSC(args) {
    return new Promise((resolve, reject) => {
        let invoked = false
        if (watch) args.push("--watch", "--preserveWatchOutput")
        console.log("run tsc " + args.join(" "))
        let tscPath = "node_modules/typescript/lib/tsc.js"
        if (!fs.existsSync(tscPath)) tscPath = "../" + tscPath
        if (!fs.existsSync(tscPath)) tscPath = "../" + tscPath
        const process = childProcess.fork(tscPath, args)
        process.on("error", err => {
            if (invoked) return
            invoked = true
            reject(err)
        })

        process.on("exit", code => {
            if (invoked) return
            invoked = true
            if (code == 0) resolve()
            else reject(new Error("exit " + code))
        })

        // in watch mode "go in background"
        if (watch)
            setTimeout(() => {
                if (invoked) return
                invoked = true
                resolve()
            }, 500)
    })
}

const files = {
    "built/devicescript-compiler.js": "src/devicescript.ts",
    "built/devicescript-compiler.node.cjs": "src/devicescript.ts",
    "../cli/built/devicescript-cli.cjs": "../cli/src/cli.ts",
    "../dap/built/devicescript-dap.cjs": "../dap/src/dsdap.ts",
    "../vscode/built/devicescript-vscode.cjs": "../vscode/src/extension.ts",
    "../vscode/built/devicescript-vscode-web.cjs":
        "../vscode/src/web-extension.ts",
}

const specname = "devicescript-spec.d.ts"
function buildPrelude(folder, outp) {
    const files = fs.readdirSync(folder)
    files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

    const filecont = {}
    for (const fn of files) {
        if (fn == specname) continue
        filecont[fn] = fs.readFileSync(folder + "/" + fn, "utf-8")
    }

    let r = "export const prelude: Record<string, string> = {\n"
    for (const fn of Object.keys(filecont)) {
        r += `    "${fn}":\n\``
        const lines = filecont[fn].split(/\r?\n/)
        while (lines[lines.length - 1] == "") lines.pop()
        for (const ln of lines) {
            r += ln.replace(/[$`\\]/g, x => "\\" + x) + "\n"
        }
        r += "`,\n"
    }
    r += "}\n"
    let curr = ""
    try {
        curr = fs.readFileSync(outp, "utf-8")
    } catch {}
    if (curr != r) {
        console.log("updating " + outp)
        fs.writeFileSync(outp, r)
    }
}

async function main() {
    try {
        copyVM()
        buildPrelude("../devs/lib", "src/prelude.ts")
        for (const outfile of Object.keys(files)) {
            const src = files[outfile]
            const cjs = outfile.endsWith(".cjs")
            const mjs = outfile.endsWith(".mjs")
            const t0 = Date.now()
            let platform = cjs ? "node" : "browser"
            if (outfile.endsWith("-web.cjs")) platform = "browser"
            await esbuild.build({
                entryPoints: [src],
                bundle: true,
                sourcemap: true,
                outfile,
                logLevel: "warning",
                external: [
                    "websocket-polyfill",
                    "@devicescript/compiler",
                    "vscode",
                ],
                platform,
                target: "es2019",
                format: mjs ? "esm" : cjs ? "cjs" : "iife",
                watch,
            })
            let size = 0
            try {
                const st = fs.statSync(outfile)
                size = st.size
            } catch {}
            const sizeStr = (size / 1024).toFixed(1)
            console.log(`build ${outfile}: ${sizeStr}kB ${Date.now() - t0}ms`)
        }
        console.log("bundle done")
        copyCompiler()
        if (!fast) {
            await runTSC(["-b", "src", "../dap/src", "../cli/src"])
        }
        const ds = require("./built/devicescript-compiler.node.cjs")
        fs.writeFileSync("../devs/lib/" + specname, ds.preludeFiles()[specname])
        const mds = ds.markdownFiles()
        const mdo = "../website/docs/api/clients"
        fs.emptyDirSync(mdo)
        fs.writeJSONSync(path.join(mdo, "_category_.json"), {
            label: "Clients",
            position: 1,
            collapsible: true,
        })
        Object.keys(mds).forEach(fn =>
            fs.writeFileSync(path.join(mdo, `${fn}.md`), mds[fn])
        )
    } catch (e) {
        console.error(e)
    }
}

main()
