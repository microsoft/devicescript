#!/usr/bin/env node

const esbuild = require("esbuild")
const childProcess = require("child_process")
const path = require("path")
const fs = require("fs-extra")
const { dirname, join, resolve } = require("path")

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
    const to = "website/static/dist/devicescript-compiler.js"
    const from = "compiler/built/devicescript-compiler.js"
    distCopy(from, to)
}

function copyVM() {
    const dist = "website/static/dist/devicescript-vm.js"
    const builtDir = "runtime/devicescript-vm/built"
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
    console.log("Usage: ./build.js [--watch] [--fast]")
    process.exit(1)
}

function runTSC(args) {
    return new Promise((resolve, reject) => {
        let invoked = false
        if (watch) args.push("--watch", "--preserveWatchOutput")
        console.log("run tsc " + args.join(" "))
        let tscPath = "node_modules/typescript/lib/tsc.js"
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
    "interop/built/devicescript-interop.mjs": "interop/src/interop.ts",
    "interop/built/devicescript-interop.node.cjs": "interop/src/interop.ts",

    "compiler/built/devicescript-compiler.js": "compiler/src/devicescript.ts",
    "compiler/built/devicescript-compiler.node.cjs":
        "compiler/src/devicescript.ts",

    "plugin/built/devicescript-plugin.cjs": "plugin/src/plugin.ts",

    "dap/built/devicescript-dap.cjs": "dap/src/dsdap.ts",

    "cli/built/devicescript-cli.cjs": "cli/src/cli.ts",

    "vscode/built/devicescript-vscode.js": "vscode/src/extension.ts",
    "vscode/built/devicescript-vscode-web.js": "vscode/src/web-extension.ts",
}

const genspecs = ["devicescript-spec.d.ts", "devicescript-boards.d.ts"]
const serversname = "devicescript-servers.d.ts"
function buildPrelude(folder, outp) {
    let srvcfg = fs.readFileSync("runtime/jacdac-c/dcfg/srvcfg.d.ts", "utf-8")
    // no reason to encode hex number as strings in full TS syntax
    srvcfg = srvcfg
        .replace("type HexInt = integer | string", "type HexInt = integer")
        .replace(/type \w*Pin = .*/g, "")
        .replace("/srvcfg", "/core")
        .replace(
            /(interface BaseServiceConfig[^}]* name)(: string)/,
            (_, a, b) => a + "?" + b
        )
        .replace(/service: /g, `service?: `)
    srvcfg = "// auto-generated! do not edit here\n" + srvcfg

    fs.writeFileSync(join(folder, serversname), srvcfg)

    const files = fs.readdirSync(folder)
    files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

    const filecont = {}
    for (const fn of files) {
        if (genspecs.includes(fn)) continue
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
    const rootdir = __dirname
    try {
        process.chdir(rootdir)
        copyVM()
        buildPrelude("devs/lib", "compiler/src/prelude.ts")
        for (const outfile of Object.keys(files)) {
            const src = files[outfile]
            const folder = resolve(rootdir, dirname(src))
            const isVSCode = outfile.includes("vscode")
            const cjs = outfile.endsWith(".cjs") || isVSCode
            const mjs = outfile.endsWith(".mjs")
            const t0 = Date.now()
            let platform = cjs ? "node" : "browser"
            if (outfile.endsWith("-web.js")) platform = "browser"
            const inj = join(folder, "inject.js")
            const inject = []
            if (fs.existsSync(inj)) inject.push(inj)
            const ctx = await esbuild.context({
                entryPoints: [rootdir + "/" + src],
                bundle: true,
                sourcemap: true,
                sourcesContent: false,
                outfile: rootdir + "/" + outfile,
                logLevel: "warning",
                inject,
                external: [
                    "@devicescript/compiler",
                    "serialport",
                    "vscode",
                    "crypto",
                    "update-notifier",
                ],
                platform,
                metafile: true,
                target: "es2019",
                format: mjs ? "esm" : cjs ? "cjs" : "iife",
            })
            if (watch) await ctx.watch()
            else {
                const res = await ctx.rebuild()
                if (res.metafile)
                    fs.writeFileSync(
                        outfile + "-meta.json",
                        JSON.stringify(res.metafile)
                    )
                await ctx.dispose()
            }
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
            const t0 = Date.now()
            await runTSC([
                "-b",
                "interop/src",
                "compiler/src",
                "dap/src",
                "cli/src",
                "plugin/src",
                "vscode/src",
            ])
            if (!watch) console.log(`   -> ${Date.now() - t0}ms`)
        }
        const ds = require(rootdir +
            "/compiler/built/devicescript-compiler.node.cjs")
        for (const specname of genspecs)
            fs.writeFileSync(
                "devs/lib/" + specname,
                ds.preludeFiles()[".devicescript/lib/" + specname]
            )
        {
            // clients
            const mds = ds.clientsMarkdownFiles()
            const mdo = "website/docs/api/clients"
            fs.emptyDirSync(mdo)
            fs.writeJSONSync(path.join(mdo, "_category_.json"), {
                label: "Clients",
                position: 1,
                collapsible: true,
            })
            Object.keys(mds).forEach(fn =>
                fs.writeFileSync(path.join(mdo, fn), mds[fn])
            )
        }
        {
            // devices
            const mds = ds.boardMarkdownFiles()
            const mdo = "website/docs/devices"
            Object.keys(mds).forEach(fn => {
                fs.ensureDirSync(join(mdo, dirname(fn)))
                fs.writeFileSync(path.join(mdo, fn), mds[fn], {
                    encoding: "utf-8",
                })
            })
        }
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main()
