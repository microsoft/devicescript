#!/bin/sh

echo "compile..."
node ../node_modules/typescript/bin/tsc || exit 1
echo "process..."
node build/process.js bytecode.md
if [ $? = 10 ] ; then
  diff -u bytecode.md bytecode.md.new
  read -p "apply changes [y/n]? " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
    exit 1
  fi
  mv bytecode.md.new bytecode.md
elif [ $? != 0 ] ; then
  exit 1
fi
set -x
set -e
cp build/bytecode.ts ../compiler/src/
cp build/devs_bytecode.h ../runtime/jacdac-c/devicescript/devs_bytecode.h
clang-format -i ../runtime/jacdac-c/devicescript/devs_bytecode.h
prettier -w ../compiler/src/bytecode.ts
MC=../../../microcode
if test -d $MC ; then
  cp build/devs_bytecode.ts $MC
  prettier -w $MC/devs_bytecode.ts
fi
