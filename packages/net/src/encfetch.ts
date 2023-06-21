import { decrypt, encrypt, getRandom, ivSize } from "@devicescript/crypto"
import { fetch } from "./fetch"

const algo = "aes-256-ccm"
const tagLength = 4

export interface EncFetchOptions {
    /**
     * JSON object to send.
     */
    data: any

    /**
     * Where to send the request. This should be the same for all requests as it's send unencrypted.
     */
    url: string

    /**
     * 32 byte key.
     */
    key: Buffer

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
    const rid = getRandom(8).toString("hex")

    // we select both IVs so that MIM attacker cannot reply old server responses
    const iv = getRandom(ivSize(algo))
    const respIv = getRandom(ivSize(algo))

    const data = Buffer.from(
        JSON.stringify({
            $rid: rid,
            // response IV is encrypted and authenticated, so the two IVs are tied together
            $iv: respIv.toString("hex"),
            ...options.data,
        })
    )
    const key = options.key
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
            "x-devs-enc-fetch-info": `${algo}/tag=${tagLength}`,
            "x-devs-enc-fetch-iv": iv.toString("hex"),
            "content-type": "application/x-devs-enc-fetch",
            ...(options.headers || {}),
        },
    })

    if (!resp.ok)
        throw new Error(`invalid response ${resp.status} ${resp.statusText}`)

    const data2 = await resp.buffer()
    const respData = decrypt({
        data: data2,
        algo,
        key,
        iv: respIv,
        tagLength,
    })

    return JSON.parse(respData.toString("utf-8"))
}
