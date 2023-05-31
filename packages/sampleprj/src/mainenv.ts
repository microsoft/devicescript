import { readSetting } from "@devicescript/settings"

for (const key of ["SECRET_NUMBER", "SECRET_STRING", "SECRET_I"]) {
    const value = await readSetting(key)
    console.log(`key: ${key}, value: ${value}, typeof value: ${typeof value}`)
}
