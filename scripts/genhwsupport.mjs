#!/usr/bin/env zx

import "zx/globals"

function fail(msg) {
    console.error(`Error: ${msg}`)
    process.exit(1)
}

const drivers = `runtime/jacdac-c/drivers/`
const driversURL = `https://github.com/microsoft/jacdac-c/blob/main/drivers`
const servicesURL = `https://microsoft.github.io/devicescript/api/clients`
const serversURL = `https://microsoft.github.io/devicescript/api/servers`

function strcmp(a, b) {
    if (a == b) return 0
    if (a < b) return -1
    else return 1
}

function collectI2C() {
    const sensors = {}
    const fn = `${drivers}/i2c_scan.c`
    let stype = ""
    for (let line of fs.readFileSync(fn, "utf-8").split(/\n/)) {
        let m = /^const (\w+)_api_t \*i2c_(\w+)/.exec(line)
        if (m) {
            stype = m[2]
            continue
        }
        if (line.startsWith("}")) stype = ""
        if (!stype) continue
        line = line.trim()
        if (line == "NULL" || line == "NULL,") continue
        m = /^\&(\w+)_(\w+),?\s*(\/\/ (.*))?/.exec(line)
        if (!m) echo(`bad line: ${line}`)
        const id = m[2]
        let comm = m[4] ?? ""
        let s = sensors[id]
        if (!s) {
            s = sensors[id] = {
                id,
                services: [],
            }
        }
        if (!s.name || s.name.length > comm.length) s.name = comm
        s.services.push(stype)
        if (!fs.existsSync(drivers + "/" + id + ".c"))
            echo(`file missing: ${id}.c`)
    }
    const ids = Object.keys(sensors)
    ids.sort((a, b) => strcmp(sensors[a].name, sensors[b].name))
    let r = `
| ID | Sensor | Services | Source |
|:---|:-------|:---------|:-------|
`
    for (const id of ids) {
        const s = sensors[id]
        const serv = s.services.join(", ")
        r += `| **${id}** | ${s.name} | ${serv} | [${id}.c](${driversURL}/${id}.c) |\n`
    }

    return r
}

function collectAnalog() {
    const fn = `runtime/jacdac-c/dcfg/srvcfg.d.ts`
    let analog = ""
    let servers = ""
    let hid = ""
    for (let line of fs.readFileSync(fn, "utf-8").split(/\n/)) {
        let m = /interface (\w+)Config extends AnalogConfig/.exec(line)
        if (m) {
            const serv = m[1]
            analog += `* [${serv}](${servicesURL}/${serv.toLowerCase()})\n`
        }

        m = /interface (\w+)Config extends BaseServiceConfig/.exec(line)
        if (m) {
            const serv = m[1]
            if (serv.startsWith("Hid")) {
                hid += `* HID ${serv.slice(3)}\n`
            } else if (serv != "Analog") {
                servers += `* [${serv}](${serversURL}/${serv.toLowerCase()})\n`
            }
        }
    }

    return {
        HID: hid,
        SERVERS: servers,
        ANALOG: analog,
    }
}

const sections = {
    ...collectAnalog(),
    I2C: collectI2C(),
}

const dst = `website/docs/devices/hw.mdx`
fs.writeFileSync(
    dst,
    fs
        .readFileSync(dst, "utf-8")
        .replace(
            /(<!--\s*(\w+)-START\s*-->)[^]*?(<!--\s*(\w+)-END\s*-->)/gm,
            (_, beg, id, end, id2) => {
                return beg + "\n" + (sections[id]?.trim() ?? "") + "\n" + end
            }
        )
)
