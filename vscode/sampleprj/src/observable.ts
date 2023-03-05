import * as ds from "@devicescript/core"
import { AsyncVoid } from "@devicescript/core"

const btn = new ds.Button()
const temp = new ds.Temperature()

// https://steveholgado.com/understanding-observables/#assumptions
type AsyncBool = boolean | Promise<boolean>
type Subscription = {
    unsubscribe: () => AsyncVoid
}
type SubscriptionVoid = Subscription | Promise<Subscription>
type Observer<T> = UnaryFunction<T, AsyncVoid>
type UnaryFunction<T, R> = (source: T) => R
type OperatorFunction<T, R> = UnaryFunction<Observable<T>, Observable<R>>
class Observable<T> {
    constructor(
        private readonly _producer: (
            observer: Observer<T>
        ) => AsyncVoid | SubscriptionVoid
    ) {}
    async subscribe(observer: Observer<T>): Promise<Subscription> {
        return (await this._producer(observer)) || undefined
    }

    pipe<A>(op1: OperatorFunction<T, A>): Observable<A>
    pipe<A, B>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>
    ): Observable<B>
    pipe<A, B, C>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>
    ): Observable<C>
    pipe<A, B, C, D>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>
    ): Observable<D>
    pipe<A, B, C, D, E>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>
    ): Observable<E>
    pipe<A, B, C, D, E, F>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>
    ): Observable<F>
    pipe<A, B, C, D, E, F, G>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>
    ): Observable<G>
    pipe<A, B, C, D, E, F, G, H>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>
    ): Observable<H>
    pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>
    ): Observable<I>
    pipe<A, B, C, D, E, F, G, H, I>(
        op1: OperatorFunction<T, A>,
        op2: OperatorFunction<A, B>,
        op3: OperatorFunction<B, C>,
        op4: OperatorFunction<C, D>,
        op5: OperatorFunction<D, E>,
        op6: OperatorFunction<E, F>,
        op7: OperatorFunction<F, G>,
        op8: OperatorFunction<G, H>,
        op9: OperatorFunction<H, I>,
        ...operations: OperatorFunction<any, any>[]
    ): Observable<unknown>

    pipe(...operations: OperatorFunction<any, any>[]): Observable<any> {
        return operations.length ? pipeFromArray(operations)(this) : this
    }
}

{
    // simple example
    const obs$ = new Observable<string>(observer => {
        observer("HELLO")
        observer("WORLD")
    })
    await obs$.subscribe(v => console.log(v))
}

function fromArray<T>(values: T[]) {
    return new Observable<T>(async observer => {
        for (const value of values) await observer(value)
    })
}

{
    const obs$ = fromArray([1, 2, 3, 4, 5])
    obs$.subscribe(v => console.log(v))
}

function fromEvent<TEvent extends ds.Event>(event: TEvent) {
    return new Observable<TEvent>(observer => {
        event.subscribe(pkt => observer(event))
        return {
            unsubscribe() {
                console.log(`todo: event.unsubscribe`)
            },
        }
    })
}

{
    // turn events into observables
    const obs$ = fromEvent(btn.down)
    const unsub = await obs$.subscribe(ev => console.log(ev.code)) // todo: value

    await unsub?.unsubscribe()
}

function fromRegisterNumber(register: ds.RegisterNumber, threshold: number) {
    return new Observable<ds.RegisterNumber>(observer => {
        register.onChange(threshold, () => observer(register))
        return {
            unsubscribe() {
                console.log(`todo: reg.unsubscribe`)
            },
        }
    })
}

{
    const obs$ = fromRegisterNumber(temp.temperature, 1)
    obs$.subscribe(async reg => console.log(await reg.read()))
}

function identity<T>(x: T): T {
    return x
}
function pipeFromArray<T, R>(
    fns: Array<UnaryFunction<T, R>>
): UnaryFunction<T, R> {
    if (fns.length === 0) {
        return identity as UnaryFunction<any, any>
    }
    if (fns.length === 1) {
        return fns[0]
    }
    return function piped(input: T): R {
        return fns.reduce(
            (prev: any, fn: UnaryFunction<T, R>) => fn(prev),
            input as any
        )
    }
}

function map<T, R>(converter: (value: T) => R | Promise<R>) {
    return function operator(source: Observable<T>) {
        return new Observable<R>(observer => {
            const subscription = source.subscribe(async v => {
                const r = await converter(v)
                observer(r)
            })
            return subscription
        })
    }
}

{
    const obs$ = fromRegisterNumber(temp.temperature, 1)
    obs$.pipe(map(async reg => await reg.read())).subscribe(t => console.log(t))
}

function filter<T>(condition: (value: T) => AsyncBool) {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const subscription = source.subscribe(async v => {
                const test = await condition(v)
                if (test) {
                    await observer(v)
                }
            })
            return subscription
        })
    }
}
{
    const obs = fromRegisterNumber(temp.temperature, 1)
    obs.pipe(
        map(async reg => await reg.read()),
        filter(t => t > 30)
    ).subscribe(t => console.log("too hot!"))
}

function setTimeout(fn: () => void, timeout: number): void {}

function delay<T>(duration: number) {
    return function operator(source: Observable<T>) {
        return new Observable<T>(observer => {
            const subscription = source.subscribe(async v => {
                setTimeout(() => {
                    observer(v)
                }, duration)
            })
            return subscription
        })
    }
}

{
    const obs = fromRegisterNumber(temp.temperature, 1)
    obs.pipe(
        map(async reg => await reg.read()),
        delay(100),
        filter(t => t > 30)
    ).subscribe(t => console.log("too hot!"))
}
