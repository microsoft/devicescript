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
export type EventListener = (ev: Event) => AsyncVoid

export interface AddEventListenerOptions {
    /** When `true`, the listener is automatically removed when it is first invoked. Default: `false`. */
    once?: boolean
}

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
    async dispatchEvent(event: Event): Promise<boolean> {
        const ls = this.listeners.filter(l => l.type === event.type)
        for (const l of ls) {
            await l.listener(event)
        }
        return true
    }
}
