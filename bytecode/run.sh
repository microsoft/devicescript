#!/bin/sh

set -x
set -e
node ../compiler/node_modules/typescript/bin/tsc
node build/process.js bytecode.md
cp build/bytecode.ts ../compiler/src/
cp build/devs_bytecode.h ../jacdac-c/devicescript/
clang-format -i ../jacdac-c/devicescript/devs_bytecode.h
prettier -w ../compiler/src/bytecode.ts
MC=../../../microcode
if test -d $MC ; then
  cp build/devs_bytecode.ts $MC
  prettier -w $MC/devs_bytecode.ts
fi
