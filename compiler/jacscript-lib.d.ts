/// <reference path="../jacdac-c/jacdac/dist/jacscript-spec.d.ts" />

declare class Role {
    isConnected(): number
    onConnected(handler: () => void): void
    onDisconnected(handler: () => void): void
}

declare class JDPacketInfo { }

declare class JDRegister extends JDPacketInfo { }

declare class JDRegisterNum extends JDRegister {
    read(): number
    write(v: number | boolean | JDBuffer): void
    onChange(threshold: number, handler: (curr: number) => void): void
}

declare class JDRegisterString extends JDRegister {
    read(): string
    write(v: string): void
}

declare class JDRegisterArray extends JDRegister {
    read(): number[]
    write(v: number[]): void
}

declare class JDEvent extends JDPacketInfo {
    wait(): void
    subscribe(handler: () => void): void
}

declare class Condition {
    signal(): void
    wait(): void
}
declare function condition(): Condition

declare class JacscriptCloud {
    upload(label: string, ...value: number[]): void
    onMethod(
        name: string,
        handler: (
            v0: number,
            v1: number,
            v2: number,
            v3: number,
            v4: number,
            v5: number,
            v6: number,
            v7: number
        ) => void
    ): void
    twin(path: string): number
    onTwinChange(handler: () => void): void
}
declare var cloud: JacscriptCloud

declare function print(fmt: string, ...args: number[]): void
declare function format(fmt: string, ...args: number[]): string
declare function wait(seconds: number): void
declare function every(seconds: number, callback: () => void): void
declare function panic(code: number): never
declare function reboot(): never
declare function onStart(handler: () => void): void

declare function buffer(size: number): JDBuffer
declare class JDBuffer {
    length: number
    setLength(len: number): void
    getAt(offset: number, format: string): number
    setAt(offset: number, format: string, value: number): void
}

declare var packet: JDBuffer

interface Math {
    /**
    * Returns the result of signed 32-bit integer division of two numbers.
    */
    idiv(x: number, y: number): number;
}