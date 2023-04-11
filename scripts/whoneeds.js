const fs = require("fs")

const what = process.argv[3]
if (!what) {
    console.log(`usage: node ${process.argv[0]} file.map symbol-substring`)
    process.exit(1)
}
const s = fs.readFileSync(process.argv[2], "utf-8")
let incl = false
const lst = {}
for (const ln of s.replace(/[^]*Cross Reference Table/).split(/\n/)) {
    const m = /^(\w+)\s*(\S+)/.exec(ln)
    if (m) {
        incl = m[2].includes(what)
    } else {
        if (incl) lst[ln.replace(/.*\/lib/, "lib")] = 1
    }
    if (incl) console.log(ln)
}

console.log(lst)
