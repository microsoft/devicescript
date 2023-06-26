import { fetch, Response } from "@devicescript/net"
import { readSetting } from "@devicescript/settings"

/**
 * Write data to ThingSpeak channel
 * @param fields
 * @param options
 * @see {@link https://www.mathworks.com/help/thingspeak/writedata.html write data}
 * @see {@link https://www.mathworks.com/help/thingspeak/error-codes.html error codes}
 */
export async function writeData(
    // field values
    fields?: Record<string, number>,
    options?: {
        // Latitude in degrees, specified as a value between -90 and 90.
        lat?: number
        // Longitude in degrees, specified as a value between -180 and 180.
        long?: number
        // Elevation in meters
        elevation?: number
        // Status update message.
        status?: string
    }
) {
    const url = "https://api.thingspeak.com/update.json"
    // the secret key should be in .env.local
    const key = await readSetting("TS_KEY")

    // construct payload
    const payload: any = {}
    // field values
    Object.keys(fields).forEach(k => {
        const v = fields[k]
        if (v !== undefined && v !== null) payload[`field${k}`] = v
    })
    // additional options
    if (options) Object.assign(payload, options)

    // send request and return http response
    let resp: Response
    try {
        resp = await fetch(url, {
            method: "POST",
            headers: {
                THINGSPEAKAPIKEY: key,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        return resp.status
    } finally {
        await resp?.close()
    }
}