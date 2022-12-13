---
sidebar_position: 100
---

# Differences with JavaScript

This document lists differences in semantics between DeviceScript and JavaScript/TypeScript.

## Strings

The method `String.charCodeAt()` returns a Unicode code point (up to 21 bits), not UTF-16 character.
See [discussion](https://github.com/microsoft/devicescript/discussions/34).

String encoding is currently UTF-8 which make [indexing slow](https://github.com/microsoft/devicescript/issues/40),
and [construction by concatnation quadratic](https://github.com/microsoft/devicescript/issues/39).
This may be fixed in future, see linked issues.

## Prototypes

Property lookup with index operator (`obj[some_expression]`) will not go up the prototype chain.
This is to allow more efficient tree-shaking for classes.
See [discussion](https://github.com/microsoft/devicescript/discussions/36).
Field access (`obj.field`) does the usual prototype lookup.

In JavaScript assigning properties on strings is a no-op. It is an error in DeviceScript.
In both reading these properties returns `undefined`.
