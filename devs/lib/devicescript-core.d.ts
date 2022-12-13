/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {
    export class Role {
        isConnected(): number
        onConnected(handler: () => void): void
        onDisconnected(handler: () => void): void
    }

    export class PacketInfo {}

    export class Register extends PacketInfo {}

    export class RegisterNum extends Register {
        read(): number
        write(v: number): void
        onChange(threshold: number, handler: (curr: number) => void): void
    }

    export class RegisterBuffer extends Register {
        read(): Buffer
        write(v: Buffer): void
        onChange(handler: (curr: number) => void): void
    }

    export class RegisterBool extends Register {
        read(): boolean
        write(v: boolean): void
        onChange(handler: (curr: number) => void): void
    }

    export class RegisterString extends Register {
        read(): string
        write(v: string): void
    }

    export class RegisterArray extends Register {
        read(): number[]
        write(v: number[]): void
    }

    export class Event extends PacketInfo {
        wait(): void
        subscribe(handler: () => void): void
    }

    export class Condition {
        signal(): void
        wait(): void
    }

    export class CloudConnector {
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
    export const cloud: CloudConnector

    export function print(fmt: string, ...args: number[]): void
    export function format(fmt: string, ...args: number[]): string
    export function wait(seconds: number): void
    export function every(seconds: number, callback: () => void): void
    export function panic(code: number): never
    export function reboot(): never
    export function onStart(handler: () => void): void

    export const packet: Buffer

    export { Buffer }

    global {
        function hex(lits: any, ...args: any[]): Buffer

        class Buffer {
            private constructor()

            static alloc(size: number): Buffer

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

            toString(): string
        }
    }
}
