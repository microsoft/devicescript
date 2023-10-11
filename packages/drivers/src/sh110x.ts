import { Display, Image, Palette } from "@devicescript/graphics"
import { I2CDriver, I2CDriverOptions } from "./i2cdriver"
import { delay, isSimulator } from "@devicescript/core"

// inspired by https://github.com/adafruit/Adafruit_SH110x
// Datasheet: https://www.pololu.com/file/0J1813/SH1106.pdf

const DEFAULT_ADDRESS = 0x3C
const SH110X_MEMORYMODE = 0x20               
const SH110X_SETCONTRAST = 0x81         
const SH110X_SEGREMAP = 0xA0            
const SH110X_DISPLAYALLON_RESUME = 0xA4 
const SH110X_NORMALDISPLAY = 0xA6       
const SH110X_SETMULTIPLEX = 0xA8        
const SH110X_DCDC = 0xAD                
const SH110X_DISPLAYOFF = 0xAE          
const SH110X_DISPLAYON = 0xAF           
const SH110X_SETPAGEADDR = 0xB0         
const SH110X_COM_SCAN_DIR = 0xC0        
const SH110X_COMSCANDEC = 0xC8          
const SH110X_SETDISPLAYOFFSET = 0xD3    
const SH110X_SETDISPLAYCLOCKDIV = 0xD5  
const SH110X_SETPRECHARGE = 0xD9        
const SH110X_SETCOMPINS = 0xDA          
const SH110X_SETVCOMDETECT = 0xDB       

const SH110X_SETHIGHCOLUMN = 0x10 //< Column address, higher 4 bits
const SH110X_SETLOWCOLUMN = 0x02  //< Column address, lower 4 bits, offset by 2 px
const SH110X_SETSTARTLINE = 0x40  

export interface SH110XOptions extends I2CDriverOptions {
    devAddr?: 0x3D | 0x3C,
    externalVCC?: boolean,
    width: 128 | 96 | 64,
    height: 128 | 64 | 48 | 32 | 16 // SH1107 has a height of 128 px
}

/**
 * Driver for SH1106 and SH1107 OLED displays.
 *
 * @example
 * const sh = new SH110XDriver({ width: 128, height: 64 })
 * await sh.init()
 * sh.image.print("Hello world!", 3, 10)
 * await sh.show()
 */
export class SH110XDriver extends I2CDriver implements Display {
    externalVCC: boolean
    palette: Palette
    image: Image

    constructor(options: SH110XOptions) {
        super(options.devAddr || DEFAULT_ADDRESS, options)
        this.palette = Palette.monochrome()
        const framebuffer = Buffer.alloc(options.width * (options.height >> 3)) // Right shift height 3x as each page uses a byte per column to represent it's 8 pixels in height. See datasheet P16
        this.image = Image.alloc(options.width, options.height, 1, framebuffer);
        if (options.externalVCC) {
            this.externalVCC = true;
        }
    }

    private async writeCmd(c: number) {
        await this.writeReg(0x00, c);//  0x00: data byte(s) to follow, interpret as command(s). Datasheet P14, Co and D/C bits.
    }

    private async writeCmdList(c: number[]) {
        await this.writeRegBuf(0x00, Buffer.from(c));
    }

    async reInit() {
        if (isSimulator()) return;

        await this.writeCmdList([
            SH110X_DISPLAYOFF,
            SH110X_SETDISPLAYCLOCKDIV, 0x80,
            SH110X_SETMULTIPLEX, 0x3F,   
            SH110X_SETDISPLAYOFFSET, 0x00,
            SH110X_SETSTARTLINE,
            SH110X_DCDC, 0x8B,
            SH110X_SEGREMAP + 1,
            SH110X_COM_SCAN_DIR | (1 << 3),
            SH110X_COMSCANDEC,               
            SH110X_SETCOMPINS, 0x12,         
            SH110X_SETCONTRAST, 0xFF,       
            SH110X_SETPRECHARGE, 0x1F,       
            SH110X_SETVCOMDETECT, 0x40,     
            0x33,                            
            SH110X_NORMALDISPLAY,
            SH110X_MEMORYMODE, 0x10,        
            SH110X_DISPLAYALLON_RESUME,
        ]);
        await delay(100);
        await this.writeCmd(SH110X_DISPLAYON);
    }

    protected async initDriver() {
        await this.reInit();
    }

    async powerOff() {
        await this.writeCmd(SH110X_DISPLAYOFF)
    }

    /**
     * 
     * @param contrast 0 to 255
     */
    async setContrast(contrast: number) {
        await this.writeCmdList([
            SH110X_SETCONTRAST, contrast,
        ])
    }

    /**
     * @description Invert light and dark pixels
     *  
     */
    async invert(invert: boolean) {
        const i = invert ? 1 : 0
        await this.writeCmd(SH110X_NORMALDISPLAY | i)
    }

    /**
     * @description Rotate screen content by 180 degrees. Fully effective on next show()
     * 
     */
    async rotate(rotate: boolean) {
        const r = rotate ? 0 : 1
        await this.writeCmdList([
            SH110X_SEGREMAP | r, // in effect on next show()
            SH110X_COM_SCAN_DIR | (r << 3) // immediate effect once received
        ])
    }


    /**
     *  @description Show changes made to the image buffer on the screen.
     */
    async show() {
        if (isSimulator()) return

        for (let p = 0; p < 8; p++) {
            await this.writeCmdList(
                [
                    SH110X_SETPAGEADDR + p,
                    SH110X_SETHIGHCOLUMN,
                    SH110X_SETLOWCOLUMN
                ]
            )

            // Remap Vertical Addressing Mode used by the image buffer (and the SSD1306), to Page Addressing Mode used by SH110X
            // Vertical addressing explanation on page 34: https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf
            // Page Addressing explanation on page 35: https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf
            let pageBytes: number[] = []
            for (let i = 0; i < 128; i++) {
                pageBytes.push(this.image.buffer[(i * 8) + p])
            }
            await this.writeRegBuf(0x40, Buffer.from(pageBytes)) // 0x40: Last control byte, only data bytes to follow. Interpret data bytes as RAM operations
        }
    }
}