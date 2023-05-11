#!/usr/bin/env zx

import "zx/globals"

cd("./packages/sampleprj")
await $`pwd`

const mains = fs.readdirSync("./src").filter(f => /main.*\.ts$/.test(f))
for(const main of mains) {
    await $`yarn build:devicescript src/${main}`
}