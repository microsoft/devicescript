/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

// Adapted from TypeScript's lib.es5.d.ts

/// <reference no-default-lib="true"/>

declare var NaN: number
declare var Infinity: number

/**
 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number).
 * @param number A numeric value.
 */
declare function isNaN(number: number): boolean

interface Object {}

interface ObjectConstructor {
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source The source object from which to copy properties.
     */
    assign<T extends {}, U>(target: T, source: U): T & U

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys(o: {}): string[]

    /**
     * Returns an array of values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    values<T>(o: { [s: string]: T } | T[]): T[]

    /**
     * Returns an array of values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    values(o: {}): any[]
}

declare var Object: ObjectConstructor

interface Function {}
interface CallableFunction extends Function {}
interface NewableFunction extends Function {}

interface IArguments {
    [index: number]: any
    length: number
    callee: Function
}

interface String {
    /**
     * Returns the character at the specified index.
     * @param pos The zero-based index of the desired character.
     */
    charAt(pos: number): string

    /**
     * Returns the Unicode value of the character at the specified location.
     * @param index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.
     */
    charCodeAt(index: number): number

    /** Returns the length of a String object. */
    readonly length: number

    readonly [index: number]: string
}
interface Boolean {}
interface Number {}

interface RegExp {}
interface IterableIterator<T> {}

interface SymbolConstructor {
    readonly iterator: unique symbol
}
declare var Symbol: SymbolConstructor

interface Array<T> {
    /**
     * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
     */
    length: number
    [n: number]: T
    [Symbol.iterator](): IterableIterator<T>

    /**
     * Appends new elements to the end of an array, and returns the new length of the array.
     * @param items New elements to add to the array.
     */
    push(...items: T[]): number

    /**
     * Appends new elements to the end of an array, and returns the new length of the array.
     * @param items New elements to add to the array.
     */
    pushRange(items: T[]): number

    /**
     * Returns a copy of a section of an array.
     * For both start and end, a negative index can be used to indicate an offset from the end of the array.
     * For example, -2 refers to the second to last element of the array.
     * @param start The beginning index of the specified portion of the array.
     * If start is undefined, then the slice begins at index 0.
     * @param end The end index of the specified portion of the array. This is exclusive of the element at the index 'end'.
     * If end is undefined, then the slice extends to the end of the array.
     */
    slice(start?: number, end?: number): T[]

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     */
    every(predicate: (value: T, index: number, array: T[]) => unknown): boolean

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     */
    some(predicate: (value: T, index: number, array: T[]) => unknown): boolean

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     */
    forEach(callbackfn: (value: T, index: number, array: T[]) => void): void

    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[]

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     */
    filter<S extends T>(
        predicate: (value: T, index: number, array: T[]) => value is S
    ): S[]
}

interface ArrayConstructor {
    isArray(arg: any): arg is any[]
    readonly prototype: any[]
}
declare var Array: ArrayConstructor

declare namespace console {
    function log(...args: any[]): void
}

declare namespace Date {
    function now(): number
}

interface Math {
    /** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
    readonly E: number
    /** The natural logarithm of 10. */
    readonly LN10: number
    /** The natural logarithm of 2. */
    readonly LN2: number
    /** The base-2 logarithm of e. */
    readonly LOG2E: number
    /** The base-10 logarithm of e. */
    readonly LOG10E: number
    /** Pi. This is the ratio of the circumference of a circle to its diameter. */
    readonly PI: number
    /** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
    readonly SQRT1_2: number
    /** The square root of 2. */
    readonly SQRT2: number

    /**
     * Returns the absolute value of a number (the value without regard to whether it is positive or negative).
     * For example, the absolute value of -5 is the same as the absolute value of 5.
     * @param x A numeric expression for which the absolute value is needed.
     */
    abs(x: number): number
    /**
     * Returns the smallest integer greater than or equal to its numeric argument.
     * @param x A numeric expression.
     */
    ceil(x: number): number
    /**
     * Returns e (the base of natural logarithms) raised to a power.
     * @param x A numeric expression representing the power of e.
     */
    exp(x: number): number
    /**
     * Returns the greatest integer less than or equal to its numeric argument.
     * @param x A numeric expression.
     */
    floor(x: number): number
    /**
     * Returns the natural logarithm (base e) of a number.
     * @param x A numeric expression.
     */
    log(x: number): number
    /**
     * Returns the larger of a set of supplied numeric expressions.
     * @param values Numeric expressions to be evaluated.
     */
    max(...values: number[]): number
    /**
     * Returns the smaller of a set of supplied numeric expressions.
     * @param values Numeric expressions to be evaluated.
     */
    min(...values: number[]): number
    /**
     * Returns the value of a base expression taken to a specified power.
     * @param x The base value of the expression.
     * @param y The exponent value of the expression.
     */
    pow(x: number, y: number): number
    /** Returns a pseudorandom number between 0 and 1. */
    random(): number
    /**
     * Returns a supplied numeric expression rounded to the nearest integer.
     * @param x The value to be rounded to the nearest integer.
     */
    round(x: number): number
    /**
     * Returns the square root of a number.
     * @param x A numeric expression.
     */
    sqrt(x: number): number

    // ES2015:

    /**
     * Returns an implementation-dependent approximation to the cube root of number.
     * @param x A numeric expression.
     */
    cbrt(x: number): number

    /**
     * Returns the result of 32-bit multiplication of two numbers.
     * @param x First number
     * @param y Second number
     */
    imul(x: number, y: number): number

    /**
     * Returns the base 10 logarithm of a number.
     * @param x A numeric expression.
     */
    log10(x: number): number

    /**
     * Returns the base 2 logarithm of a number.
     * @param x A numeric expression.
     */
    log2(x: number): number
}
/** An intrinsic object that provides basic mathematics functionality and constants. */
declare var Math: Math

interface TemplateStringsArray {}

interface Error {
    name: string
    message: string
    stack?: string
}

interface ErrorConstructor {
    new (message?: string): Error
    (message?: string): Error
    readonly prototype: Error
}

declare var Error: ErrorConstructor

interface RangeError extends Error {}

interface RangeErrorConstructor extends ErrorConstructor {
    new (message?: string): RangeError
    (message?: string): RangeError
    readonly prototype: RangeError
}

declare var RangeError: RangeErrorConstructor

interface TypeError extends Error {}

interface TypeErrorConstructor extends ErrorConstructor {
    new (message?: string): TypeError
    (message?: string): TypeError
    readonly prototype: TypeError
}

declare var TypeError: TypeErrorConstructor
