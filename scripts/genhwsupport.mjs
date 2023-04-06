#!/usr/bin/env zx

import "zx/globals"

function fail(msg) {
    console.error(`Error: ${msg}`)
    process.exit(1)
}

const drivers = `runtime/jacdac-c/drivers/`
const driversURL = `https://github.com/microsoft/jacdac-c/blob/main/drivers`
const servicesURL = `/api/clients`
const serversURL = `/api/servers`

const srvNames = {
    accelerometers: "accelerometer",
    pressure: "airpressure",
    gyro: "gyroscope",
    co2: "eco2",
    captouch: "capacitivebutton",
}

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
        const serv = s.services
            .map(srv => srvNames[srv] || srv)
            .map(srv => `[${srv}](/api/clients/${srv})`)
            .join(", ")
        r += `| **${id}** | ${s.name} | ${serv} | [${id}.c](${driversURL}/${id}.c) |\n`
    }

    return { services: [], md: r }
}

function collectAnalog() {
    const services = []
    const fn = `runtime/jacdac-c/dcfg/srvcfg.d.ts`
    let analog = ""
    let servers = ""
    let hid = ""
    for (let line of fs.readFileSync(fn, "utf-8").split(/\n/)) {
        let m = /interface (\w+)Config extends AnalogConfig/.exec(line)
        if (m) {
            const serv = m[1]
            analog += `* [${serv}](${servicesURL}/${serv.toLowerCase()})\n`
            services.push(serv)
        }

        m = /interface (\w+)Config extends BaseServiceConfig/.exec(line)
        if (m) {
            const serv = m[1]
            services.push(serv)
            if (serv.startsWith("Hid")) {
                hid += `* [HID ${serv.slice(
                    3
                )}](/api/servers/${serv.toLowerCase()})\n`
            } else if (serv != "Analog") {
                servers += `* [${serv}](${serversURL}/${serv.toLowerCase()})\n`
            }
        }
    }

    return {
        services,
        md: {
            HID: hid,
            SERVERS: servers,
            ANALOG: analog,
        },
    }
}

const analog = collectAnalog()
const i2c = collectI2C()
const sections = {
    ...analog.md,
    I2C: i2c.md,
}

fs.writeFileSync(
    "devs/lib/srvcfg.json",
    JSON.stringify({ analog: [...analog.services] }, null, 2),
    {
        encoding: "utf8",
    }
)
Object.keys(sections).map(id => {
    const fn = `website/docs/devices/${id.toLowerCase()}.mdp`
    fs.writeFileSync(fn, sections[id]?.trim(), "utf-8")
})
