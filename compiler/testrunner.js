const fs = require("fs")
const path = require("path")
const jacscript = require(".")

const ctest = "compiler-tests"
const samples = "samples"
const rtest = "run-tests"
const distPath = "dist"
let verbose = false
let deploy = false
let bus = null

function runProgram(fn, real) {
    console.log(`*** run ${fn}`)

    try {
        fs.mkdirSync(distPath)
    } catch { }

    const res = jacscript.compile(
        {
            write: (fn, cont) =>
                fs.writeFileSync(path.join(distPath, fn), cont),
            log: msg => { if (verbose) console.log(msg) },
        },
        fs.readFileSync(fn, "utf8")
    )

    if (!res.success) process.exit(1)

    if (!bus) bus = jacscript.nodeBus()

    if (deploy) {
        return jacscript.deployBytecode(bus, res.binary, { once: true, logging: true })
    }

    return new Promise(resolve => {
        const r = new jacscript.Runner(bus, res.binary, res.dbg)
        if (!real) {
            r.options.disableCloud = true
            r.startDelay = 1
        }
        r.on("error", () => process.exit(1))
        r.on("panic", code => {
            if (code == 0)
                resolve()
            else
                process.exit(2)
        })
        r.run()
    })
}

function readdir(folder) {
    return fs.readdirSync(folder).map(bn => path.join(folder, bn))
}

async function main() {
    global.WebSocket = require("ws")

    const args = process.argv.slice(2)
    if (args[0] == "-v") {
        args.shift()
        verbose = true
    }

    if (args[0] == "-d") {
        args.shift()
        deploy = true
    }

    try {
        if (args.length) {
            verbose = true
            await runProgram(args[0], true)
        } else {
            for (const fn of readdir(ctest).concat(readdir(samples))) {
                console.log(`*** test ${fn}`)
                jacscript.testCompiler(fs.readFileSync(fn, "utf8"))
            }

            for (const fn of readdir(rtest)) {
                await runProgram(fn)
            }
        }
    } catch (e) {
        console.error(e.stack)
        process.exit(2)
    }

    process.exit(0)
}

main()
