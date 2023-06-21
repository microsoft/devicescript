import * as ds from "@devicescript/core"
import { describe, expect, test } from "@devicescript/test"
import { decrypt, digest, encrypt, hmac, sha256Hkdf } from "./crypto"

function bufferEq(b: Buffer, expected: Buffer) {
    ds.assert(b.length === expected.length)
    ds.assert(b.toString("hex") === expected.toString("hex"))
}
function testHMAC(key: Buffer, msg: Buffer, expected: Buffer) {
    const b = hmac(key, "sha256", msg)
    bufferEq(b, expected)
}

function expSHA(buf: Buffer | string, exp: Buffer) {
    if (typeof buf === "string") buf = Buffer.from(buf)
    bufferEq(digest("sha256", buf), exp)
}

describe("aes-ccm", () => {
    test("simple", () => {
        const key = hex`c0c1c2c3c4c5c6c7c8c9cacbcccdcecfc0c1c2c3c4c5c6c7c8c9cacbcccdcecf`
        const iv = hex`00000003020100a0a1a2a3a4a5`
        const plain = hex`616c61206d61206b6f74612c206b6f74206d6120616c652c20616e64206576657279
                        6f6e65206973206861707079`

        const enc = encrypt({
            data: plain,
            algo: `aes-256-ccm`,
            key,
            iv,
            tagLength: 4,
        })

        bufferEq(
            enc,
            hex`480408f5ae18ce68d46125c071b3de7427d1edec7207ea189248b911d2bb5eb67853a4a47e9e9570f884ccd460b853e034df`
        )

        const dec = decrypt({
            data: enc,
            algo: `aes-256-ccm`,
            key,
            iv,
            tagLength: 4,
        })

        bufferEq(dec, plain)
    })
})

describe("sha256", () => {
    test("simple", () => {
        expSHA(
            "abc",
            hex`ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad`
        )
        expSHA(
            "",
            hex`e3b0c442 98fc1c14 9afbf4c8 996fb924 27ae41e4 649b934c a495991b 7852b855`
        )
        expSHA(
            "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
            hex`248d6a61 d20638b8 e5c02693 0c3e6039 a33ce459 64ff2167 f6ecedd4 19db06c1`
        )
        expSHA(
            "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",
            hex`cf5b16a7 78af8380 036ce59e 7b049237 0b249b11 e8f07a51 afac4503 7afee9d1`
        )
    })

    test("hmac", () => {
        testHMAC(
            hex`0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b`,
            hex`4869205468657265`,
            hex`b0344c61d8db38535ca8afceaf0bf12b 881dc200c9833da726e9376c2e32cff7`
        )
        testHMAC(
            hex`4a656665`,
            hex`7768617420646f2079612077616e7420 666f72206e6f7468696e673f`,
            hex`5bdcc146bf60754e6a042426089575c7 5a003f089d2739839dec58b964ec3843`
        )
        testHMAC(
            hex`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaa`,
            hex`dddddddddddddddddddddddddddddddd dddddddddddddddddddddddddddddddd 
        dddddddddddddddddddddddddddddddd dddd`,
            hex`773ea91e36800e46854db8ebd09181a7 2959098b3ef8c122d9635514ced565fe`
        )
        testHMAC(
            hex`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaa`,
            hex`54657374205573696e67204c61726765
        72205468616e20426c6f636b2d53697a
        65204b6579202d2048617368204b6579
        204669727374`,
            hex`60e431591ee0b67f0d8a26aacbf5b77f 8e0bc6213728c5140546040f0ee37f54 `
        )
    })

    test("hkdf", () => {
        const h = sha256Hkdf(
            hex`60e431591ee0b67f0d8a26aacbf5b77f 8e0bc6213728c5140546040f0ee37f54`,
            "Hello"
        )
        bufferEq(
            h,
            hex`765c02ce44dc89b569157316c33e8a296117c6c17efeec2e976e480825cfdcde`
        )
    })
})
