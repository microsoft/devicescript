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

interface Object {
    /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
    constructor: Function
}

interface ObjectConstructor {
    (): any

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

    /**
     * Returns the prototype of an object.
     * @param o The object that references the prototype.
     */
    // getPrototypeOf(o: any): any

    /**
     * Sets the prototype of a specified object o to object proto or null. Returns the object o.
     * @param o The object to change its prototype.
     * @param proto The value of the new prototype or null.
     */
    setPrototypeOf(o: any, proto: object | null): any
}

declare var Object: ObjectConstructor

interface Function {
    /**
     * Start function in background passing given arguments.
     */
    start(flag: number, ...args: any[]): void

    /**
     * Returns the name of the function. Function names are read-only and can not be changed.
     */
    readonly name: string
}
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

    /**
     * Returns a section of a string.
     * @param start The index to the beginning of the specified portion of stringObj.
     * @param end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
     * If this value is not specified, the substring continues to the end of stringObj.
     */
    slice(start?: number, end?: number): string

    /** Returns the length of a String object. */
    readonly length: number

    [Symbol.iterator](): IterableIterator<string>
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
     * Insert `count` `undefined` elements at `index`.
     * If `count` is negative, remove elements.
     */
    insert(index: number, count: number): void

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
     * Removes the last element from an array and returns it.
     * If the array is empty, undefined is returned and the array is not modified.
     */
    pop(): T | undefined

    /**
     * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement: T, fromIndex?: number): number

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
    filter(predicate: (value: T, index: number, array: T[]) => unknown): T[]

    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce(
        callbackfn: (
            previousValue: T,
            currentValue: T,
            currentIndex: number,
            array: T[]
        ) => T,
        initialValue?: T
    ): T

    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U>(
        callbackfn: (
            previousValue: U,
            currentValue: T,
            currentIndex: number,
            array: T[]
        ) => U,
        initialValue: U
    ): U

    /**
     * Removes the first element from an array and returns it.
     * If the array is empty, undefined is returned and the array is not modified.
     */
    shift(): T | undefined

    /**
     * Inserts new elements at the start of an array, and returns the new length of the array.
     * @param items Elements to insert at the start of the array.
     */
    unshift(...items: T[]): number
}

interface ArrayConstructor {
    isArray(arg: any): arg is any[]
    readonly prototype: any[]
}
declare var Array: ArrayConstructor

declare namespace console {
    /**
     * Same as `console.log`.
     */
    function info(...args: any[]): void

    /**
     * Print out message at INFO logging level (prefix: `> `).
     */
    function log(...args: any[]): void

    /**
     * Print out message at DEBUG logging level (prefix: `? `).
     */
    function debug(...args: any[]): void

    /**
     * Print out message at WARNING logging level (prefix: `* `).
     */
    function warn(...args: any[]): void

    /**
     * Print out message at ERROR logging level (prefix: `! `).
     */
    function error(...args: any[]): void
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
    /**
     * "Error", "TypeError" etc.
     */
    name: string
    /**
     * Reason for error.
     */
    message: string
    /**
     * Logs the exception message and stack.
     */
    print(): void

    // stack not impl. yet
    // stack?: string

    /**
     * Binary-encoded stack-dump.
     */
    __stack__: Buffer
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

interface SyntaxError extends Error {}
interface SyntaxErrorConstructor extends ErrorConstructor {
    new (message?: string): SyntaxError
    (message?: string): SyntaxError
    readonly prototype: SyntaxError
}
declare var SyntaxError: SyntaxErrorConstructor

interface JSON {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     */
    parse(text: string): any
    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer Replacer is not supported.
     * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    stringify(value: any, replacer?: null, space?: number): string
}
/**
 * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
 */
declare var JSON: JSON

/**
 * Value returned from async functions, needs to be awaited.
 */
interface Promise<T> {
    _useAwaitPlease(): void
}

interface PromiseLike<T> {
    _useAwaitPlease(): void
}

interface PromiseConstructor {
    /**
     * Do not use.
     */
    new <T>(): Promise<T>
}

declare var Promise: PromiseConstructor

/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> = T extends null | undefined
    ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
    : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
    ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
        ? Awaited<V> // recursively unwrap the value
        : never // the argument to `then` was not callable
    : T // non-object or non-thenable

// utility types

/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P]
}

/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P]
}

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}

/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T
}

/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T & {}

/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
) => any
    ? P
    : never

/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: infer P) => any ? P : never

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => infer R
    ? R
    : any

/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends abstract new (...args: any) => any> =
    T extends abstract new (...args: any) => infer R ? R : any

/**
 * Convert string literal type to uppercase
 */
type Uppercase<S extends string> = intrinsic

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic

/**
 * Convert first character of string literal type to uppercase
 */
type Capitalize<S extends string> = intrinsic

/**
 * Convert first character of string literal type to lowercase
 */
type Uncapitalize<S extends string> = intrinsic
