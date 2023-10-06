import "@dsboard/seeed_xiao_esp32c3"
import * as ds from "@devicescript/core"
import { I2CDriver, startCharacterScreen } from "@devicescript/drivers"
import { delay } from "@devicescript/core"

// Device I2C Arress
const LCD_ADDRESS = 0x7c >> 1
const RGB_ADDRESS = 0xc4 >> 1
const RGB_ADDRESS_V5 = 0x30

// color define
const WHITE = 0
const RED = 1
const GREEN = 2
const BLUE = 3

const REG_MODE1 = 0x00
const REG_MODE2 = 0x01
const REG_OUTPUT = 0x08

// commands
const LCD_CLEARDISPLAY = 0x01
const LCD_RETURNHOME = 0x02
const LCD_ENTRYMODESET = 0x04
const LCD_DISPLAYCONTROL = 0x08
const LCD_CURSORSHIFT = 0x10
const LCD_FUNCTIONSET = 0x20
const LCD_SETCGRAMADDR = 0x40
const LCD_SETDDRAMADDR = 0x80

// flags for display entry mode
const LCD_ENTRYRIGHT = 0x00
const LCD_ENTRYLEFT = 0x02
const LCD_ENTRYSHIFTINCREMENT = 0x01
const LCD_ENTRYSHIFTDECREMENT = 0x00

// flags for display on/off control
const LCD_DISPLAYON = 0x04
const LCD_DISPLAYOFF = 0x00
const LCD_CURSORON = 0x02
const LCD_CURSOROFF = 0x00
const LCD_BLINKON = 0x01
const LCD_BLINKOFF = 0x00

// flags for display/cursor shift
const LCD_DISPLAYMOVE = 0x08
const LCD_CURSORMOVE = 0x00
const LCD_MOVERIGHT = 0x04
const LCD_MOVELEFT = 0x00

// flags for function set
const LCD_8BITMODE = 0x10
const LCD_4BITMODE = 0x00
const LCD_2LINE = 0x08
const LCD_1LINE = 0x00
const LCD_5x10DOTS = 0x04
const LCD_5x8DOTS = 0x00

// https://wiki.seeedstudio.com/Grove-16x2_LCD_Series/#specification
// converted from https://github.com/Seeed-Studio/Grove_LCD_RGB_Backlight/
export class GroveRGBLCD extends I2CDriver {
    readonly columns: number
    readonly lines: number
    readonly dotsize: number
    private _displayfunction: number = 0
    private _displaymode: number = 0
    private _displaycontrol: number = 0
    private _currline: number = 0

    constructor(
        readonly options: {
            columns: number
            rows: number
            dotsize: number
            devAddr?: number
        }
    ) {
        super(options.devAddr || LCD_ADDRESS)
        this.columns = options.columns
        this.lines = options.rows
        this.dotsize = options.dotsize
    }

    async initDriver(): Promise<void> {
        if (this.lines > 1) {
            this._displayfunction |= LCD_2LINE
        }
        this._currline = 0

        // for some 1 line displays you can select a 10 pixel high font
        if (this.dotsize !== 0 && this.lines === 1) {
            this._displayfunction |= LCD_5x10DOTS
        }

        // SEE PAGE 45/46 FOR INITIALIZATION SPECIFICATION!
        // according to datasheet, we need at least 40ms after power rises above 2.7V
        // before sending commands. Arduino can turn on way befer 4.5V so we'll wait 50
        // delayMicroseconds(50000);
        await delay(5)

        // this is according to the hitachi HD44780 datasheet
        // page 45 figure 23

        // Send function set command sequence
        await this.command(LCD_FUNCTIONSET | this._displayfunction)
        await delay(5) // wait more than 4.1ms

        // second try
        await this.command(LCD_FUNCTIONSET | this._displayfunction)
        await delay(1)

        // third go
        await this.command(LCD_FUNCTIONSET | this._displayfunction)

        // finally, set # lines, font size, etc.
        await this.command(LCD_FUNCTIONSET | this._displayfunction)

        // turn the display on with no cursor or blinking default
        this._displaycontrol = LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF
        await this.display()

        // clear it off
        await this.clear()

        // Initialize to default text direction (for romance languages)
        this._displaymode = LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT
        // set the entry mode
        await this.command(LCD_ENTRYMODESET | this._displaymode)
    }

    private async command(value: number): Promise<void> {
        await this.writeBuf(Buffer.from([0x80, value]))
    }

    private async display() {
        this._displaycontrol |= LCD_DISPLAYON
        await this.command(LCD_DISPLAYCONTROL | this._displaycontrol)
    }

    async clear() {
        await this.command(LCD_CLEARDISPLAY) // clear display, set cursor position to zero
        await delay(2) // this command takes a long time!
    }

    private async write(value: number) {
        await this.writeBuf(Buffer.from([0x40, value]))
    }

    async render(message: string) {
        await this.clear()
        if (message?.length > 0)
            for (let i = 0; i < message.length; ++i) {
                await this.write(message.charCodeAt(i))
            }
    }
}

/**
 * Driver for the Grove RGB LCD 16x2 display.
 * @devsParts Grove RGB LCD 16x2
 * @devsWhenUsed
 */
export async function startGroveRGBLCD16x2() {
    const columns = 16
    const rows = 2

    let render: (message: string) => ds.AsyncVoid = undefined
    if (!ds.isSimulator()) {
        const lcd = new GroveRGBLCD({
            columns,
            rows,
            dotsize: 0,
            devAddr: LCD_ADDRESS,
        })
        await lcd.init()
        render = async (message: string) => await lcd.render(message)
    }
    return await startCharacterScreen(render, {
        columns,
        rows,
    })
}
