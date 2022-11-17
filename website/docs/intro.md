---
sidebar_position: 1
---

# Jacscript

Jacscript is a programming language for scripting [Jacdac](https://aka.ms/jacdac) services.

It has JavaScript-like syntax and is compiled to a custom VM bytecode, which can run in very constrained
environments (VM itself compiles to 10kB of code, with the floating point library and Jacdac SDK adding further 30kB).

## Design goals for Jacscript VM

* secure - can predictably execute untrusted code (random bytes)
* easy to analyze - should be possible to statically determine the set of APIs used
* small memory (RAM) footprint
* small code (flash) footprint
* leave space for extensions in future
