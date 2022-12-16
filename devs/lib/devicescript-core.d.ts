/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {

    /**
     * A base class for service clients
     */
    // TODO: rename to serviceclient?
    export class Role {
        // TODO: convert to `get connected() { ... }`
        isConnected(): number
        // TODO: is there a way to unregister an event?
        onConnected(handler: () => void): void
        onDisconnected(handler: () => void): void
    }

    /**
     * A base class for registers, events.
     */
    export class PacketInfo {}

    /**
     * A base class for register clients.
     */
    export class Register extends PacketInfo {}

    /**
     * A client for a register that holds a numerical value.
     */
    export class RegisterNumber extends Register {
        /**
         * Gets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
        read(): number

        /**
         * Sets the current value of the register.
         * @param value value to assign to the register
         * TODO: is it guaranteed, does it throw when it fails?
         */
        write(value: number): void

        /**
         * Registers a callback to execute when the register value changes by the given threshold
         * @param threshold minimum value change required to trigger the handler
         * @param handler callback to execute
         * TODO: can we unregister?
         */
        onChange(threshold: number, handler: (curr: number) => void): void
    }

    /**
     * A client for a register that holds a Buffer (byte[]).
     */
    export class RegisterBuffer extends Register {
        /**
         * Gets the current value of the register.
         */
        read(): Buffer

        /**
         * Sets the current value of the register.
         * @param value value to assign to the register
         * TODO: is the buffer copied or owned?
         * TODO: is Buffer = null same as buffer[0]
         */
        write(value: Buffer): void

        /**
         * Registers a callback to execute when the register value changes
         * @param handler callback to execute
         */
        onChange(handler: (curr: number) => void): void
    }

    export class RegisterBool extends Register {
        read(): boolean
        write(value: boolean): void
        onChange(handler: (curr: number) => void): void
    }

    /**
     * A client for a register that holds a string value.
     */
    export class RegisterString extends Register {
        read(): string
        write(value: string): void
    }

    export class RegisterArray extends Register {
        read(): number[]
        write(value: number[]): void
    }

    export class Event extends PacketInfo {
        /**
         * Blocks the current thread under the event is received.
         */
        wait(): void
        /**
         * Register a callback that will be raised when the event is raised.
         * @handler callback to execute
         */
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
        // TODO: delete?
        twin(path: string): number
        // TODO: delete?
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

    /**
     * @internal
     * TODO: move to submodule?
     */
    export const packet: Buffer

    export { Buffer }

    global {
        /**
         * Compiles hex-encoded data as a buffer in flash
         * @param lits hex-encoded string literal
         * @param args 
         */
        function hex(lits: any, ...args: any[]): Buffer

        class Buffer {
            private constructor()

            static alloc(size: number): Buffer

            /**
             * Gets the length in bytes of the buffer
             */
            length: number
            setLength(len: number): void
            getAt(offset: number, format: string): number
            setAt(offset: number, format: string, value: number): void
            blitAt(
                offset: number,
                src: Buffer | string,
                srcOffset: number,
                len: number
            ): void
            fillAt(offset: number, length: number, value: number): void
            [idx: number]: number

            toString(): string
        }
    }
}
