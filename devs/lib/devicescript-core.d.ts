/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {
    export type Handler = () => void
    export type PktHandler = (pkt: Packet) => void

    export type SMap<T> = {
        [idx: string]: T
    }

    /**
     * A base class for service clients
     */
    // TODO: rename to serviceclient?
    export class Role {
        isConnected: boolean
        // TODO: is there a way to unregister an event?
        onConnected(handler: () => void): void
        onDisconnected(handler: () => void): void

        /**
         * Wait for the next packet to arrive from the device.
         * When device has just disconnected this returns null.
         */
        wait(): Packet | null

        /**
         * @internal
         */
        sendCommand(serviceCommand: number, payload?: Buffer): void

        /**
         * @internal
         */
        onPacket: PktHandler

        _changeHandlers: any

        _wasConnected: boolean
        _connHandlers: Handler[]
        _disconHandlers: Handler[]

        _eventHandlers: SMap<PktHandler[]>
    }

    export class Packet {
        role: Role
        deviceIdentifier: string
        shortId: string
        serviceIndex: number
        serviceCommand: number
        payload: Buffer
        decode(): any

        flags: number
        isReport: boolean
        isCommand: boolean

        isEvent: boolean
        eventCode: number

        isRegSet: boolean
        isRegGet: boolean
        regCode: number
    }

    /**
     * A base class for registers, events.
     */
    export class PacketInfo {
        name: string
        code: number
        role: Role
    }

    /**
     * A base class for register clients.
     */
    // TODO: support for "isImplemented?"
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

    /**
     * A client for a register that holds a numerical value.
     */
    export class RegisterBool extends Register {
        /**
         * Gets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
        read(): boolean
        /**
         * Sets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
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
        read(): any[]
        write(value: any[]): void
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
        // TODO: consider something like "onReceived" to match other events
        subscribe(handler: (pkt: Packet) => void): void
    }

    // TODO: maybe a better name, is this some kind of internal data structure?
    export class Condition {
        signal(): void
        wait(): void
    }

    export interface CloudAdapter {
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
        _cloudHandlers: any
    }
    export const cloud: CloudAdapter

    /**
     * Format string. Best use backtick templates instead.
     */
    export function format(fmt: string, ...args: number[]): string

    /**
     * Run a callback every given number of milliseconds.
     */
    export function everyMs(milliseconds: number, callback: () => void): void

    /**
     * Wait for specified number of milliseconds.
     */
    export function sleepMs(milliseconds: number): void

    /**
     * Restart current script.
     */
    export function reboot(): never

    /**
     * Throw an exception if the condition is not met.
     */
    export function assert(cond: boolean, msg?: string): void

    /**
     * Best use `throw new Error(...)` instead.
     */
    export function _panic(code: number): never

    /**
     * Mark method as used but do not call it.
     */
    export function _use(method: any): void

    /**
     * Moved by the compiler to the beginning of execution.
     */
    export function _onStart(handler: () => void): void

    /**
     * Print out internal representation of a given value, possibly prefixed by label.
     */
    export function _logRepr(v: any, label?: string): void

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

        /**
         * Converts a string to an integer.
         * @param string A string to convert into a number.
         */
        function parseInt(string: string): number

        /**
         * Converts a string to a floating-point number.
         * @param string A string that contains a floating-point number.
         */
        function parseFloat(string: string): number
    }
}
