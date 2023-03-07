/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {
    export type AsyncVoid = void | Promise<void>
    export type Callback = () => AsyncVoid
    export type PktHandler = (pkt: Packet) => AsyncVoid

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
        onConnected(handler: Callback): void
        onDisconnected(handler: Callback): void

        /**
         * Wait for the next packet to arrive from the device.
         * When device has just disconnected this returns null.
         */
        wait(): Promise<Packet | null>

        /**
         * @internal
         */
        sendCommand(serviceCommand: number, payload?: Buffer): Promise<void>

        /**
         * @internal
         */
        onPacket: PktHandler

        _changeHandlers: any

        _wasConnected: boolean
        _connHandlers: Callback[]
        _disconHandlers: Callback[]

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
        read(): Promise<number>

        /**
         * Sets the current value of the register.
         * @param value value to assign to the register
         * TODO: is it guaranteed, does it throw when it fails?
         */
        write(value: number): Promise<void>

        /**
         * Registers a callback to execute when the register value changes by the given threshold
         * @param threshold minimum value change required to trigger the handler
         * @param handler callback to execute
         * TODO: can we unregister?
         */
        onChange(threshold: number, handler: (curr: number) => AsyncVoid): void
    }

    /**
     * A client for a register that holds a Buffer (byte[]).
     */
    export class RegisterBuffer extends Register {
        /**
         * Gets the current value of the register.
         */
        read(): Promise<Buffer>

        /**
         * Sets the current value of the register.
         * @param value value to assign to the register
         * TODO: is the buffer copied or owned?
         * TODO: is Buffer = null same as buffer[0]
         */
        write(value: Buffer): Promise<void>

        /**
         * Registers a callback to execute when the register value changes
         * @param handler callback to execute
         */
        onChange(handler: (curr: Buffer) => AsyncVoid): void
    }

    /**
     * A client for a register that holds a numerical value.
     */
    export class RegisterBool extends Register {
        /**
         * Gets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
        read(): Promise<boolean>
        /**
         * Sets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
        write(value: boolean): Promise<void>
        onChange(handler: (curr: boolean) => AsyncVoid): void
    }

    /**
     * A client for a register that holds a string value.
     */
    export class RegisterString extends Register {
        read(): Promise<string>
        write(value: string): Promise<void>
    }

    export class RegisterArray extends Register {
        read(): Promise<any[]>
        write(value: any[]): Promise<void>
    }

    export class Event extends PacketInfo {
        /**
         * Blocks the current thread under the event is received.
         */
        wait(): Promise<void>
        /**
         * Register a callback that will be raised when the event is raised.
         * @handler callback to execute
         */
        // TODO: consider something like "onReceived" to match other events
        subscribe(handler: (pkt: Packet) => AsyncVoid): void
    }

    // TODO: maybe a better name, is this some kind of internal data structure?
    export class Condition {
        signal(): void
        wait(): Promise<void>
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
            ) => AsyncVoid
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
    export function everyMs(milliseconds: number, callback: Callback): void

    /**
     * Wait for specified number of milliseconds.
     */
    export function sleepMs(milliseconds: number): Promise<void>

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
    export function keep(method: any): void

    /**
     * Moved by the compiler to the beginning of execution.
     */
    export function _onStart(handler: Callback): void

    /**
     * Print out internal representation of a given value, possibly prefixed by label.
     */
    export function _logRepr(v: any, label?: string): void

    /**
     * Identity function, used to prevent constant folding.
     */
    export function _id<T>(a: T): T

    /**
     * Return number of milliseconds since device boot or program start.
     * Note that it only changes upon `await`.
     */
    export function millis(): number

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

    //
    // Timeouts
    //

    export { setTimeout, setInterval, clearTimeout, clearInterval }
    global {
        /**
         * Schedule a function to be called after specified number of milliseconds.
         */
        function setTimeout(
            callback: () => void | Promise<void>,
            ms?: number
        ): number

        /**
         * Cancel previously scheduled function.
         * @param id value returned from setTimeout()
         */
        function clearTimeout(id: number): void

        /**
         * Schedule a function to be called periodically, every `ms` milliseconds.
         */
        function setInterval(
            callback: () => void | Promise<void>,
            ms?: number
        ): number

        /**
         * Cancel previously scheduled periodic callback.
         * @param id value returned from setInterval()
         */
        function clearInterval(id: number): void
    }

    //
    // Pins
    //

    /**
     * Represents pin capable of digital output.
     */
    export interface InputPin {
        _inputPinBrand: unknown
    }

    /**
     * Represents pin capable of digital input.
     */
    export interface OutputPin {
        _outputPinBrand: unknown
    }

    /**
     * Represents pin capable of digital input and output.
     */
    export type IOPin = InputPin & OutputPin

    /**
     * Represents pin capable of analog input (ADC).
     */
    export interface AnalogInPin {
        _analogInPinBranch: unknown
    }

    /**
     * Represents pin capable of analog output (DAC, not PWM).
     */
    export interface AnalogOutPin {
        _analogOutPinBranch: unknown
    }

    /**
     * Unspecified type of pin.
     */
    export type Pin = InputPin | OutputPin | AnalogInPin | AnalogOutPin

    /**
     * Direct access to pin by hardware id. Best to use `pins.name` instead.
     *
     * @param hwPinIndex hardware pin number
     */
    export function gpio(hwPinIndex: number): IOPin & AnalogInPin & AnalogOutPin
}
