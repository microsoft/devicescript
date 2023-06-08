import * as ds from "@devicescript/core"
import { describe, expect, test } from "@devicescript/test"
import { Image, font5, img, scaledFont } from "./index"

function printImg(img: Image) {
    console.log(img)
    for (let y = 0; y < img.height; y++) {
        let ln = ""
        for (let x = 0; x < img.width; ++x) {
            const c = img.get(x, y)
            const p = c === 0 ? "." : c
            ln += `${p} `
        }
        console.log(ln)
    }
}

describe("graphics", () => {
    test("pixels", () => {
        const tst = img`
    . . . 4 . . . . . .
    . 2 2 2 2 2 . . . .
    . 2 7 7 . 2 . . . .
    . 2 7 7 . 2 . . . .
    . 2 . . . 2 . . . .
    . 2 2 2 2 2 . . . .
    . . . . . . . . . .`

        const image = Image.alloc(10, 7, 4)
        image.fill(18)
        image.fillRect(0, 0, image.width, image.height, 0)
        image.fillRect(1, 1, 3, 3, 7)
        image.drawRect(1, 1, 5, 5, 2)
        image.set(3, 0, 4)
        ds.assert(tst.equals(tst))
        ds.assert(image.equals(image))
        ds.assert(image.equals(tst))
        ds.assert(tst.equals(image))
        printImg(image)
        printImg(tst)
    })

    test("text", () => {
        const image = Image.alloc(60, 15, 4)
        image.print("Hello world", 0, 0)
        image.print("Hello world", 0, 8, 2, font5())
        image.print("X", 30, 6, 3, scaledFont(font5(), 2))
        printImg(image)
        const txtTst = img`
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. 1 . . 1 . . . . . . . . 1 1 . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1 1 . . .
. 1 . . 1 . . . . . . . . . 1 . . . . . 1 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1 . . .
. 1 1 1 1 . . . 1 1 . . . . 1 . . . . . 1 . . . . . 1 1 . . . . . . . . 1 . . . 1 . . . 1 1 . . . 1 . 1 . . . . 1 . . .
. 1 . . 1 . . 1 . 1 1 . . . 1 . . . . . 1 . . . . 1 . . 1 . . . . . . . 1 . 1 . 1 . . 1 . . 1 . . 1 1 . 1 . . . 1 . . .
. 1 . . 1 . . 1 1 . . . . . 1 . . . . . 1 . . . . 1 . . 1 . . . . . . . 1 . 1 . 1 . . 1 . . 1 . . 1 . . . . . . 1 . . .
. 1 . . 1 . . . 1 1 1 . . 1 1 1 . . . 1 1 1 . . . . 1 1 . . 3 3 . . . . 3 3 . 1 . . . . 1 1 . . . 1 . . . . . 1 1 1 . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 3 . . . . 3 3 . . . . . . . . . . . . . . . . . . . . . .
2 . . 2 . . . 2 2 . . . . 2 . . . . . 2 . . . . . . . . . . 3 3 . . . . 3 3 . . . . . . . . . . . . . . . . . 2 . . . .
2 . . 2 . . 2 . . 2 . . . 2 . . . . . 2 . . . . . 2 2 . . . 3 3 . . . . 3 3 . . 2 . . 2 2 . . . . 2 2 2 . . . 2 . . . .
2 2 2 2 . . 2 2 2 . . . . 2 . . . . . 2 . . . . 2 . . 2 . . . . 3 3 3 3 2 . . . 2 . 2 . . 2 . . 2 . . . . . . 2 . . . .
2 . . 2 . . 2 . . . . . . 2 . . . . . 2 . . . . 2 . . 2 . . . . 3 3 3 3 2 . 2 . 2 . 2 . . 2 . . 2 . . . . . . 2 . . . .
2 . . 2 . . . 2 2 2 . . . . 2 2 . . . . 2 2 . . . 2 2 . . . 3 3 . . . . 3 3 . 2 2 . . 2 2 . . . 2 . . . . . . . 2 2 . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 3 . . . . 3 3 . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3 3 . . . . 3 3 . . . . . . . . . . . . . . . . . . . . . .
`
        ds.assert(txtTst.equals(image))
    })
})
