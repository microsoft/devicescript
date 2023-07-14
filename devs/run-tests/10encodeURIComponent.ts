import { assert } from "@devicescript/core"
import {
    encodeURIComponent,
} from "@devicescript/core/src/encodeURIComponent"

function msg(s: string): void {
    console.log(s)
}

function testEncodeURIComponent(): void {
    msg("EncodeURIComponent tests begin")
    msg("Basic Encoding test")
    assert(
        encodeURIComponent("Hello World") === "Hello World",
        "Basic Encoding"
    )
    msg("Encoding Already Encoded Characters")
    assert(
        encodeURIComponent("Hello%20World") === "Hello%20World",
        "Encoding Already Encoded Characters"
    )
    msg("Encoding Slash")
    assert(
        encodeURIComponent("/path/to/resource") === "/path/to/resource",
        "Encoding Slash"
    )
    msg("Encoding Non-ASCII Character")
    assert(
        encodeURIComponent("😀") === "%E0%9F%98%80",
        "Encoding Non-ASCII Character"
    )
    msg("EncodeURIComponent tests success")
}

testEncodeURIComponent()
