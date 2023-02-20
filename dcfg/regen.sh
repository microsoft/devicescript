#!/bin/sh

set -e
set -x

npx typescript-json-schema --noExtraProps --required --defaultNumberType integer \
		../compiler/src/archconfig.ts DeviceConfig --out deviceconfig.schema.json
npx typescript-json-schema --noExtraProps --required --defaultNumberType integer \
		../compiler/src/archconfig.ts ArchConfig --out archconfig.schema.json
