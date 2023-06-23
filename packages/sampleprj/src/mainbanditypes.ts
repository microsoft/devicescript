// https://github.com/thoughtspile/banditypes
type Simplify<T> = T extends Object ? { [K in keyof T]: T[K] } : T
type WithOptionalProps<T> = Simplify<
    Partial<T> &
        Pick<
            T,
            {
                [K in keyof T]: T[K] extends Exclude<T[K], undefined>
                    ? K
                    : never
            }[keyof T]
        >
>

export type Cast<T, Source = unknown> = (data: Source) => T
export type Infer<Schema extends Cast<unknown>> = ReturnType<Schema>
// Chainable API
export interface Banditype<T> extends Cast<T> {
    map: <E>(extra: Cast<E, T>) => Banditype<E>
    or: <E>(extra: Cast<E>) => Banditype<E | T>
}

// Core
export const banditype = <T>(cast: Cast<T>): Banditype<T> => {
    ;(cast as Banditype<T>).map = extra => banditype(raw => extra(cast(raw)))
    ;(cast as Banditype<T>).or = extra =>
        banditype(raw => {
            try {
                return cast(raw)
            } catch (err) {
                return extra(raw)
            }
        })
    return cast as Banditype<T>
}

// Error helper
export const fail = () => ("bad banditype" as any)() as never

export const never = () => banditype(() => fail())
export const unknown = () => banditype(raw => raw)

// literals
// not sure why, but this signature prevents widening [90] -> number[]
type Primitive = string | number | null | undefined | boolean | symbol | object
export const enums = <U extends Primitive, T extends readonly U[]>(items: T) =>
    banditype(raw =>
        items.includes(raw as T[number]) ? (raw as T[number]) : fail()
    )

// Basic types
type Func = (...args: unknown[]) => unknown
export interface Like {
    (tag: string): Banditype<string>
    (tag: number): Banditype<number>
    (tag: boolean): Banditype<boolean>
    (tag: bigint): Banditype<bigint>
    (tag: Func): Banditype<Func>
    (tag: symbol): Banditype<symbol>
    (): Banditype<undefined>
}
export const like = ((tag: unknown) =>
    banditype(raw => (typeof raw === typeof tag ? raw : fail()))) as Like
export const string = () => like("")
export const number = () => like(0)
export const boolean = () => like(true)
export const func = () => like(fail)
export const optional = () => like()
export const nullable = () => banditype(raw => (raw === null ? raw : fail()))

// Classes
export const instance = <T>(proto: ObjectConstructor) =>
    banditype(raw => {
        //raw instanceof proto ? (raw as T) : fail()
        return raw
    })

// objects
export const record = <Item>(
    castValue: Cast<Item>
): Banditype<Record<string, Item>> =>
    instance(Object).map((raw: any) => {
        const res: Record<string, Item> = {}
        for (const key of Object.keys(raw)) {
            const f = castValue(raw[key])
            f !== undefined && (res[key] = f)
        }
        return res
    })

export const object = <T = Record<string, never>>(schema: {
    [K in keyof T]-?: Cast<T[K]>
}) =>
    instance(Object).map((raw: any) => {
        const res = {} as T
        for (const key of Object.keys(schema)) {
            const f = (schema as any)[key](raw[key])
            f !== undefined && ((res as any)[key] = f)
        }
        return res as WithOptionalProps<T>
    })
export const objectLoose = <
    T extends Record<string, unknown> = Record<string, never>
>(schema: {
    [K in keyof T]-?: Cast<T[K]>
}) =>
    instance(Object).map((raw: any) => {
        const res = { ...raw }
        for (const key of Object.keys(schema)) {
            const f = (schema as any)[key](raw[key])
            f !== undefined && (res[key] = f)
        }
        return res as WithOptionalProps<T>
    })

/*
// arrays
export const array = <Item>(castItem: Cast<Item>) =>
  instance(Array).map((arr) => arr.map(castItem));
export const tuple = <T extends readonly Cast<unknown>[]>(schema: T) =>
  instance(Array).map((arr) => {
    return schema.map((cast, i) => cast(arr[i])) as {
      -readonly [K in keyof T]: Infer<T[K]>;
    };
  });

export const set = <T>(castItem: Cast<T>) =>
  instance(Set).map((set) => new Set<T>([...set].map(castItem)));
export const map = <K, V>(castKey: Cast<K>, castValue: Cast<V>) =>
  instance(Map).map((map) => {
    return new Map<K, V>([...map].map(([k, v]) => [castKey(k), castValue(v)]));
  });
  */

export const lazy = <T>(cast: () => Cast<T>) => banditype(raw => cast()(raw))

const parseGunslinger = objectLoose({
    name: string(),
    kills: number(),
    //guns: array(string()),
    born: object({
        state: string().or(optional()),
        //year: number().map(n => (Number.isInteger(n) ? n : fail())),
    }),
})

// Explicit inference
type Gunslinger = Infer<typeof parseGunslinger>

const raw = JSON.parse(`{
    "name": "Dirty Bobby",
    "kills": 17,
    "born": {
      "state": "Idaho"
    }
  }`)
try {
    const data = parseGunslinger(raw)
    // fully type-safe access
    console.log(`${data.name} from ${data.born.state} is out to kill ya`)
} catch (err) {
    console.log("invalid JSON", err)
}
