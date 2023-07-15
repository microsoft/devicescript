#!/bin/sh

set -e
set -x
npx typescript-json-schema --ignoreErrors --noExtraProps --required --defaultNumberType integer \
		generic.d.ts GenericDeviceConfig --out deviceconfig.schema.json
npx typescript-json-schema --ignoreErrors --noExtraProps --required --defaultNumberType integer \
		generic.d.ts GenericArchConfig --out archconfig.schema.json
