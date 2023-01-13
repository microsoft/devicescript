---
sidebar_position: 100
---

# Differences with JavaScript

This document lists differences in semantics between DeviceScript and EcmaScript/JavaScript/TypeScript
(referred to as JS in this document).

## Strings

The method `String.charCodeAt()` returns a Unicode code point (up to 21 bits), not UTF-16 character.
See [discussion](https://github.com/microsoft/devicescript/discussions/34).

String encoding is currently UTF-8 which make [indexing slow](https://github.com/microsoft/devicescript/issues/40),
and [construction by concatenation quadratic](https://github.com/microsoft/devicescript/issues/39).
This may be fixed in future, see linked issues.

## Prototypes

Property lookup with index operator (`obj[some_expression]`) will not go up the prototype chain.
This is to allow more efficient tree-shaking for classes.
See [discussion](https://github.com/microsoft/devicescript/discussions/36).
Field access (`obj.field`) does the usual prototype lookup.

In JavaScript assigning properties on strings is a no-op. It is an error in DeviceScript.
In both reading these properties returns `undefined`.

## Numbers

DeviceScript doesn't support subnormals, that is numbers is range around -5e−324 to 5e-324 are rounded to zero
(this includes negative zero).
Subnormals are [not required by the JS specs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE).

The comparisons with `NaN` behave as in JS (and IEEE standard), in particular `NaN !== NaN`.

## "Attached" properties

JS lets you attach properties to arrays, buffers, functions, etc. in addition to regular map objects.
In DeviceScript properties cannot be attached to functions and statically allocated buffers.
Properties can be attached to roles, dynamic buffers, and of course regular map objects.

## Objects

`typeof null == "null"` instead of `typeof null == "object"` as in JS.

## Expressions

Assignments do not return value (i.e., you cannot say `x = y = 1` or `if (x = foo()) { ... }`).
