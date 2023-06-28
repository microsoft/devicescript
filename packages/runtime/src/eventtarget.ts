import { AsyncVoid, millis } from "@devicescript/core"

/** An event. */
export class Event {
    /** The millisecond timestamp when the Event object was created. */
    readonly timeStamp: number
    /** Returns the type of event, e.g. "click", "hashchange", or "submit". */
    readonly type: string

    constructor(type: string) {
        this.type = type
        this.timeStamp = millis()
    }
}

export class ErrorEvent extends Event {
    readonly error: string | Error

    constructor(type: string, error: string | Error) {
        super(type)
        this.error = error
    }
}

export class MessageEvent<T = any> extends Event {
    readonly data: T

    constructor(type: string, data: T) {
        super(type)
        this.data = data
    }
}

export type EventListener = (ev: Event) => void

/**
 * EventTarget is a DOM interface implemented by objects that can
 * receive events and may have listeners for them.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget MDN docs}
 */
export class EventTarget {
    private listeners: { type: string; listener: EventListener }[] = []
    /**
     * Adds a new handler for the `type` event.
     */
    addEventListener(type: string, listener: EventListener): void {
        if (
            !this.listeners.find(
                l => l.type === type && l.listener === listener
            )
        )
            this.listeners.push({ type, listener })
    }

    /**
     * Removes the event listener in target's event listener list with the same type,
     * callback, and options.
     **/
    removeEventListener(type: string, listener: EventListener): void {
        this.listeners = this.listeners.filter(
            l => l.type !== type && l.listener !== listener
        )
    }

    /**
     * Dispatches a synthetic event event to target and returns true
     * if either event's cancelable attribute value is false
     * or its preventDefault() method was not invoked, and false otherwise.
     **/
    dispatchEvent(event: Event): boolean {
        const ls = this.listeners.filter(l => l.type === event.type)
        for (const l of ls) l.listener(event)
        return true
    }
}
