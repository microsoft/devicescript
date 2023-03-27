#!/bin/sh

echo "compile..."
node ../node_modules/typescript/bin/tsc || exit 1
echo "process..."
node build/process.js bytecode.md
R=$?
if [ $R = 10 ] ; then
  diff -u bytecode.md bytecode.md.new
  printf "Apply changes? Enter - yes, Ctrl-C to stop: "
  read LINE
  mv bytecode.md.new bytecode.md
  node build/process.js bytecode.md
  R=$?
fi

if [ $R != 0 ] ; then
  echo "exit $R"
  exit $R
fi
set -x
set -e
cp build/bytecode.ts ../compiler/src/
cp build/devs_bytecode.h ../runtime/devicescript/devs_bytecode.h
clang-format -i ../runtime/devicescript/devs_bytecode.h
../node_modules/.bin/prettier -w ../compiler/src/bytecode.ts
MC=../../../microcode
if test -d $MC ; then
  cp build/devs_bytecode.ts $MC
  ../node_modules/.bin/prettier -w $MC/devs_bytecode.ts
fi
