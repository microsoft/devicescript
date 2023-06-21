import * as ds from "@devicescript/core"

export type SymmetricAlgorithm = "aes-256-ccm"
export type HashAlgorithm = "sha256"

export interface CipherOptions {
    /**
     * Data to be encrypted or decrypted.
     */
    data: Buffer

    /**
     * Algorithm to use.
     */
    algo: SymmetricAlgorithm

    /**
     * Key, has to be of the right size for the algorithm.
     * For AES256 key length is 256 bits, so 32 bytes.
     * @see keySize()
     */
    key: Buffer

    /**
     * Nonce/initialization vector - use a random one for every message!
     * For AES-CCM this is 13 bytes.
     * @see ivSize()
     */
    iv: Buffer

    /**
     * For authenticated encryption, the length of the tag that is appended at the end of the cipher-text.
     */
    tagLength: 0 | 4 | 8 | 16
}

/**
 * Return the expected key buffer size for a given algorithm.
 */
export function keySize(algo: SymmetricAlgorithm) {
    if (algo === "aes-256-ccm") return 32
    return undefined
}

/**
 * Return the expected IV (nonce) buffer size for a given algorithm.
 */
export function ivSize(algo: SymmetricAlgorithm) {
    if (algo === "aes-256-ccm") return 13
    return undefined
}

function expectBuffer(v: Buffer, lbl: string, len?: number) {
    if (!(v instanceof Buffer))
        throw new TypeError(`expecting ${lbl} buffer, got ${v}`)
    if (len !== undefined && v.length !== len)
        throw new TypeError(
            `expecting ${lbl} buffer to be ${len}, not ${v.length}`
        )
}

function validateOptions(options: CipherOptions) {
    const { algo } = options
    if (algo !== "aes-256-ccm")
        throw new TypeError(`invalid symm algo: ${options.algo}`)
    expectBuffer(options.data, "data")
    expectBuffer(options.key, "key", keySize(algo))
    expectBuffer(options.iv, "iv", ivSize(algo))
    switch (options.tagLength) {
        case 0:
        case 4:
        case 8:
        case 16:
            break
        default:
            throw new TypeError(`invalid tagLength ${options.tagLength}`)
    }
}

/**
 * Encrypt a plain text buffer.
 */
export function encrypt(options: CipherOptions): Buffer {
    validateOptions(options)
    return (options.data as any).encrypt(
        options.algo,
        options.key,
        options.iv,
        options.tagLength
    )
}

/**
 * Decrypt a cipher-text buffer.
 */
export function decrypt(options: CipherOptions): Buffer {
    validateOptions(options)
    return (options.data as any).encrypt(
        options.algo,
        options.key,
        options.iv,
        0x1000 + options.tagLength
    )
}

/**
 * Fill buffer with cryptographically strong random values
 */
export function getRandom(size: number): Buffer {
    const r = Buffer.alloc(size)
    ;(r as any).fillRandom()
    return r
}

function validateHash(algo: HashAlgorithm) {
    if (algo !== "sha256") throw new TypeError(`invalid hash: ${algo}`)
}

/**
 * Compute digest (hash) of the concatenation of the specified buffers.
 */
export function digest(algo: HashAlgorithm, ...data: Buffer[]): Buffer {
    validateHash(algo)
    return (Buffer as any).digest(undefined, algo, data)
}

/**
 * Compute HMAC digest (authenticated hash) of the concatenation of the specified buffers.
 */
export function hmac(
    key: Buffer,
    algo: HashAlgorithm,
    ...data: Buffer[]
): Buffer {
    validateHash(algo)
    expectBuffer(key, "key")
    return (Buffer as any).digest(key, algo, data)
}

/**
 * Generate a derived key using HKDF function from RFC 5869.
 * 
 * @param key input key material of any length
 * @param info typically describes type of key generated
 * @param salt optional
 * @returns 32 bytes of key
 */
export function sha256Hkdf(
    key: Buffer | string,
    info: Buffer | string,
    salt: Buffer = hex``
) {
    if (typeof key === "string") key = Buffer.from(key)
    const outkey = hmac(salt, "sha256", key)
    if (typeof info === "string") info = Buffer.from(info)
    return hmac(outkey, "sha256", info, hex`01`)
}
