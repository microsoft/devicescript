import * as ds from "@devicescript/core"
import { Observable, OperatorFunction, pipeFromArray } from "./observable"

declare module "@devicescript/core" {
    interface Register<T> {
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
        pipe(...operations: OperatorFunction<any, any>[]): Observable<any>
    }
}

ds.Register.prototype.pipe = function pipe<T>(
    ...operations: OperatorFunction<any, any>[]
): Observable<any> {
    const _this = this
    const obs = new Observable<T>(observer => {
        const { next } = observer
        return _this.subscribe(async v => await next(v))
    })
    return operations.length ? pipeFromArray(operations)(obs) : obs
}

declare module "@devicescript/core" {
    interface Event<T = void> {
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
        pipe(...operations: OperatorFunction<any, any>[]): Observable<any>
    }
}

ds.Event.prototype.pipe = function pipe<T>(
    ...operations: OperatorFunction<any, any>[]
): Observable<any> {
    const _this = this
    const obs = new Observable<T>(observer => {
        const { next } = observer
        return _this.subscribe(async v => await next(v))
    })
    return operations.length ? pipeFromArray(operations)(obs) : obs
}
