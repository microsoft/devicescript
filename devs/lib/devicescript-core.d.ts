/// <reference path="devicescript-spec.d.ts" />

declare module "@devicescript/core" {
    export type AsyncValue<T> = T | Promise<T>
    export type AsyncVoid = AsyncValue<void>
    export type AsyncBoolean = AsyncValue<boolean>
    export type Callback = () => AsyncVoid
    export type PktHandler = (pkt: Packet) => AsyncVoid
    export type Unsubscribe = () => void

    /**
     * A register like structure
     */
    export interface ClientRegister<T> {
        /**
         * Reads the current value
         */
        read(): Promise<T>

        /**
         * Subscribe a change handler to value changes
         * @param next
         * @return unsubscribe
         */
        subscribe(next: (v: T, reg: this) => AsyncVoid): Unsubscribe

        /**
         * Sends the new value to subscriptions
         * @param newValue
         */
        emit(newValue: T): Promise<void>
    }

    /**
     * A base class for service clients
     */
    // TODO: rename to serviceclient?
    export class Role {
        /**
         * @internal
         * @deprecated internal field for runtime support
         */
        isBound: boolean

        /**
         * Gets the state of the binding with a jacdac server
         */
        binding(): ClientRegister<boolean>

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
         * @deprecated internal field for runtime support
         */
        _onPacket(pkt: Packet): Promise<void>

        /**
         * @internal
         * @deprecated internal field for runtime support
         */
        _commandResponse(cmdpkt: Packet, fiber: Fiber): Promise<any>
    }

    export class Packet {
        role: Role

        /**
         * 16 character lowercase hex-encoding of 8 byte device identifier.
         */
        deviceIdentifier: string

        /**
         * 4 character hash of `deviceIdentifier`
         */
        shortId: string

        serviceIndex: number
        serviceCommand: number
        payload: Buffer

        decode(): any

        /**
         * Frame flags.
         */
        flags: number

        /**
         * Check whether is `command` flag on frame is cleared
         */
        isReport: boolean

        /**
         * Check whether is `command` flag on frame is set
         */
        isCommand: boolean

        /**
         * Check if report and it is an event
         */
        isEvent: boolean

        /**
         * `undefined` if not `isEvent`
         */
        eventCode: number

        /**
         * Is it register set command.
         */
        isRegSet: boolean

        /**
         * Is it register get command or report.
         */
        isRegGet: boolean

        /**
         * `undefined` is neither `isRegSet` nor `isRegGet`
         */
        regCode: number

        /**
         * True for plain `command`/`report` (not register and not event)
         */
        isAction: boolean
    }

    export class Fiber {
        /**
         * Unique number identifying the fiber.
         */
        id: number

        /**
         * Check if fiber is currently suspended.
         */
        suspended: boolean

        /**
         * If the fiber is currently suspended, mark it for resumption, passing the specified value.
         * Otherwise, throw a `RangeError`.
         */
        resume(v: any): void

        /**
         * Stop given fiber (which can be current fiber).
         */
        terminate(): void

        /**
         * Get reference to the current fiber.
         */
        static self(): Fiber
    }

    global {
        interface Function {
            /**
             * Start function in background passing given arguments.
             */
            start(...args: any[]): Fiber
        }
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
    export class Register<T> extends PacketInfo {
        /**
         * Gets the current value of the register as a number.
         * TODO: missing value behavior (optional regs)
         */
        read(): Promise<T>

        /**
         * Sets the current value of the register.
         * @param value value to assign to the register
         * TODO: is it guaranteed, does it throw when it fails?
         */
        write(value: T): Promise<void>

        /**
         * Registers a callback to execute when a register value is received
         * @param handler callback to execute
         */
        subscribe(handler: (curr: T, reg: this) => AsyncVoid): Unsubscribe
    }

    export class Event<T = void> extends PacketInfo {
        /**
         * Blocks the current thread under the event is received.
         */
        wait(): Promise<void>
        /**
         * Registers a callback to execute when an event is received
         * @param next callback to execute
         */
        subscribe(next: (curr: T, reg: this) => AsyncVoid): Unsubscribe
    }

    // TODO: maybe a better name, is this some kind of internal data structure?
    export class Condition {
        signal(): void
        wait(): Promise<void>
    }

    /**
     * Format string. Best use backtick templates instead.
     */
    export function format(fmt: string, ...args: number[]): string

    /**
     * Wait for specified number of milliseconds.
     */
    export function sleep(milliseconds: number): Promise<void>

    /**
     * Wait for resumption from other fiber. If the timeout expires, `undefined` is returned,
     * otherwise the value passed from the resuming fiber.
     */
    export function suspend<T>(milliseconds: number): Promise<T | undefined>

    /**
     * Restart current script.
     */
    export function restart(): never

    /**
     * Reboot the device.
     */
    export function reboot(): never

    /**
     * Throw an exception if the condition is not met.
     */
    export function assert(cond: boolean, msg?: string): void

    /**
     * Best use `throw new Error(...)` instead.
     * @internal
     * @deprecated internal field for runtime support
     */
    export function _panic(code: number): never

    /**
     * Mark method as used but do not call it.
     */
    export function keep(method: any): void

    /**
     * Print out internal representation of a given value, possibly prefixed by label.
     * @internal
     * @deprecated internal field for runtime support
     */
    export function _logRepr(v: any, label?: string): void

    /**
     * Identity function, used to prevent constant folding.
     * @internal
     * @deprecated internal field for runtime support
     */
    export function _id<T>(a: T): T

    /**
     * Return number of milliseconds since device boot or program start.
     * Note that it only changes upon `await`.
     */
    export function millis(): number

    /**
     * Get value of a device configuration setting (typically from .board.json file).
     */
    export function _dcfgString(
        id: "archId" | "url" | "devName" | "@name" | "@version"
    ): string

    /**
     * Check if running inside a simulator.
     */
    export function isSimulator(): boolean

    /*
     * Print out message. Used by console.log, etc.
     */
    // don't expose for now as we may want to change it
    // export function print(prefixCharCode: number, msg: string): void

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
            static from(data: string | Buffer | number[]): Buffer

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

            toString(encoding?: "hex" | "utf-8" | "utf8"): string
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
