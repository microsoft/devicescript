import {
    decrypt,
    encrypt,
    randomBuffer,
    ivSize,
    randomString,
    sha256Hkdf,
} from "@devicescript/crypto"
import { fetch } from "./fetch"
import { URL } from "./url"

const algo = "aes-256-ccm"
const tagLength = 8

export interface EncFetchOptions {
    /**
     * JSON object to send.
     */
    data: any

    /**
     * Where to send the request. This should be the same for all requests from this device as it's send unencrypted.
     */
    url: string | URL

    /**
     * A long-ish random string.
     */
    password: string

    /**
     * Additional headers.
     */
    headers?: Record<string, string>

    /**
     * HTTP method (defaults to POST)
     */
    method?: string
}

/**
 * Send an encrypted HTTP request.
 *
 * @param obj JSON object
 * @returns JSON response
 */
export async function encryptedFetch(options: EncFetchOptions) {
    // we add a random request ID - the server is supposed to ignore duplicate requests to prevent reply attacks
    const rid = randomBuffer(8).toString("hex")

    const data = Buffer.from(
        JSON.stringify({
            $rid: rid,
            ...options.data,
        })
    )

    if (!options.password) throw new TypeError(`password not specified`)

    const salt = randomString(20)
    const key = sha256Hkdf(options.password, "", salt)
    const iv = Buffer.alloc(ivSize(algo)) // zero IV
    const encrypted = encrypt({
        data,
        algo,
        key,
        iv,
        tagLength,
    })

    const resp = await fetch(options.url, {
        method: options.method || "POST",
        body: encrypted,
        headers: {
            "x-devs-enc-fetch-algo": `${algo}/tag=${tagLength}`,
            "x-devs-enc-fetch-salt": salt,
            "content-type": "application/x-devs-enc-fetch",
            ...(options.headers || {}),
        },
    })

    if (!resp.ok)
        throw new Error(`invalid response ${resp.status} ${resp.statusText}`)

    const serverSalt = resp.headers.get("x-devs-enc-fetch-info")
    if (!serverSalt)
        throw new Error(`x-devs-enc-fetch-info missing in response`)

    const data2 = await resp.buffer()
    const key2 = sha256Hkdf(options.password, serverSalt, salt)
    const respData = decrypt({
        data: data2,
        algo,
        key: key2,
        iv,
        tagLength,
    })

    return JSON.parse(respData.toString("utf-8"))
}
