import * as ds from "@devicescript/core"

declare module "@devicescript/core" {
    interface LedStrip {
        /**
         * Runs an encoded program.
         */
        runEncoded(
            program: string,
            ...args: (number | number[])[]
        ): Promise<void>
    }
}

function cmdCode(cmd: string) {
    switch (cmd) {
        case "setall":
            return 0xd0
        case "fade":
            return 0xd1
        case "fadehsv":
            return 0xd2
        case "rotfwd":
            return 0xd3
        case "rotback":
            return 0xd4
        case "show":
        case "wait":
            return 0xd5
        case "range":
            return 0xd6
        case "mode":
            return 0xd7
        case "tmpmode":
            return 0xd8
        case "set1":
        case "setone":
            return 0xcf
        case "mult":
            return 0x100
        default:
            return undefined
    }
}

function isWhiteSpace(code: number) {
    return code == 32 || code == 13 || code == 10 || code == 9
}

/*
    Syntax: the input is split at spaces. The following tokens are supported:
        - a command name (see below)
        - a decimal number (0-16383)
        - a color, in HTML syntax '#ff0000' for red, etc
        - a single '#' which will take color (24-bit number) from list of arguments;
        the list of arguments has an array or colors it will encode all elements of the array
        - a single '%' which takes a number (0-16383) from the list of arguments
    
    Commands:
        - `setall C+` - set all pixels in current range to given color pattern
        - `fade C+` - set pixels in current range to colors between colors in sequence
        - `fadehsv C+` - similar to `fade()`, but colors are specified and faded in HSV
        - `rotfwd K` - rotate (shift) pixels by `K` positions away from the connector
        - `rotback K` - same, but towards the connector
        - `show M=50` - send buffer to strip and wait `M` milliseconds
        - `range P=0 N=length W=1 S=0` - range from pixel `P`, `N` pixels long (currently unsupported: every `W` pixels skip `S` pixels)
        - `mode K=0` - set update mode
        - `tmpmode K=0` - set update mode for next command only
        - `setone P C` - set one pixel at `P` (in current range) to given color
        - `mult V` - macro to multiply current range by given value (float)
    
    C+ means one or more colors
    V is a floating point number
    Other letters (K, M, N, P, W, S) represent integers, with their default values if omitted

    Examples:
        lightEncode("setall #000000", []) - turn off all lights
        lightEncode("setall #", [0]) - the same
        lightEncode("fade # #", [0xff0000, 0x0000ff]) - set first pixel to red, last to blue, and interpolate the ones in between
        lightEncode("fade #", [[0xff0000, 0x0000ff]]) - the same; note double [[]]
        lightEncode("range 2 5 setall #ffffff", []) - set pixels 2-7 to white
        lightEncode("range % % setall #", [2, 5, 0xffffff]) - the same
*/
export function lightEncode(format: string, args: (number | number[])[]) {
    const outarr: number[] = []
    let colors: number[] = []
    let pos = 0
    let currcmd = 0

    function pushNumber(n: number) {
        if (n == null || (n | 0) != n || n < 0 || n >= 16383)
            throw new RangeError("number out of range: " + n)
        if (n < 128) outarr.push(n)
        else {
            outarr.push(0x80 | (n >> 8))
            outarr.push(n & 0xff)
        }
    }

    function flush() {
        if (currcmd == 0xcf) {
            if (colors.length != 1)
                throw new RangeError("setone requires 1 color")
        } else {
            if (colors.length == 0) return
            if (colors.length <= 3) outarr.push(0xc0 | colors.length)
            else {
                outarr.push(0xc0)
                outarr.push(colors.length)
            }
        }
        for (let c of colors) {
            outarr.push((c >> 16) & 0xff)
            outarr.push((c >> 8) & 0xff)
            outarr.push((c >> 0) & 0xff)
        }
        colors = []
    }

    function nextToken() {
        while (isWhiteSpace(format.charCodeAt(pos))) pos++
        const beg = pos
        while (pos < format.length && !isWhiteSpace(format.charCodeAt(pos)))
            pos++
        return format.slice(beg, pos)
    }

    while (pos < format.length) {
        const token = nextToken()
        const t0 = token.charCodeAt(0)
        if (97 <= t0 && t0 <= 122) {
            // a-z
            flush()
            currcmd = cmdCode(token)
            if (currcmd == undefined)
                throw new RangeError("Unknown light command: " + token)
            if (currcmd == 0x100) {
                const f = parseFloat(nextToken())
                if (isNaN(f) || f < 0 || f > 2) throw "expecting scale"
                outarr.push(0xd8) // tmpmode
                outarr.push(3) // mult
                outarr.push(0xd0) // setall
                const mm = Math.clamp(0, 255, Math.round(128 * f))
                outarr.push(0xc1)
                outarr.push(mm)
                outarr.push(mm)
                outarr.push(mm)
            } else {
                outarr.push(currcmd)
            }
        } else if (48 <= t0 && t0 <= 57) {
            // 0-9
            pushNumber(parseInt(token))
        } else if (t0 == 37) {
            // %
            if (args.length == 0) throw new RangeError("Out of args, %")
            const v = args.shift()
            if (typeof v != "number") throw new RangeError("Expecting number")
            pushNumber(v)
        } else if (t0 == 35) {
            // #
            if (token.length == 1) {
                if (args.length == 0) throw new RangeError("Out of args, #")
                const v = args.shift()
                if (typeof v == "number") colors.push(v)
                else for (let vv of v) colors.push(vv)
            } else {
                if (token.length == 7) {
                    const b = Buffer.from("00" + token.slice(1), "hex")
                    colors.push(b.readUInt32BE(0))
                } else {
                    throw new RangeError("Invalid color: " + token)
                }
            }
        }
    }
    flush()

    return Buffer.from(outarr)
}

ds.LedStrip.prototype.runEncoded = async function (
    program: string,
    ...args: (number | number[])[]
) {
    const buf = lightEncode(program, args)
    await this.run(buf)
}
