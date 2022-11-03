/// <reference no-default-lib="true"/>

declare var NaN: number
declare var Infinity: number

/**
 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number).
 * @param number A numeric value.
 */
declare function isNaN(number: number): boolean

interface Object {}

interface Function {}

interface CallableFunction extends Function {}

interface NewableFunction extends Function {}

interface IArguments {
    [index: number]: any
    length: number
    callee: Function
}

interface String {}

interface Boolean {}

interface Number {}

interface RegExp {}

interface Array<T> {
    /**
     * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
     */
    length: number
    [n: number]: T
}

declare namespace console {
    function log(...args: any[]): void
}

declare namespace Date {
    function now(): number
}