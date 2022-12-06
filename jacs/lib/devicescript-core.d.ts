/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {
    class Role {
        isConnected(): number
        onConnected(handler: () => void): void
        onDisconnected(handler: () => void): void
    }

    class PacketInfo {}

    class Register extends PacketInfo {}

    class RegisterNum extends Register {
        read(): number
        write(v: number | boolean | Buffer): void
        onChange(threshold: number, handler: (curr: number) => void): void
    }

    class RegisterString extends Register {
        read(): string
        write(v: string): void
    }

    class RegisterArray extends Register {
        read(): number[]
        write(v: number[]): void
    }

    class Event extends PacketInfo {
        wait(): void
        subscribe(handler: () => void): void
    }

    class Condition {
        signal(): void
        wait(): void
    }

    class CloudAdapter {
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
    const cloud: CloudAdapter

    function print(fmt: string, ...args: number[]): void
    function format(fmt: string, ...args: number[]): string
    function wait(seconds: number): void
    function every(seconds: number, callback: () => void): void
    function panic(code: number): never
    function reboot(): never
    function onStart(handler: () => void): void

    function buffer(size: number): Buffer
    class Buffer {
        length: number
        setLength(len: number): void
        getAt(offset: number, format: string): number
        setAt(offset: number, format: string, value: number): void
        blitAt(
            offset: number,
            src: Buffer,
            srcOffset: number,
            len: number
        ): void
        fillAt(offset: number, length: number, value: number): void
        [idx: number]: number
    }

    const packet: Buffer
}
