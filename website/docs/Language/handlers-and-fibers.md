---
sidebar_position: 3
hide_table_of_contents: true
---
# Handlers and Fibers

While handler registration (for events, register changes, device connect, etc.)
looks dynamic, it is implemented statically.
Thus handlers can be only registered at the top-level and un-conditionally.

Every handler runs in its own fiber (lightweight thread).
The scheduler is non-preemptive, meaning
a fiber executes without interruption until it returns or hits an asynchronous operation,
upon which point it's suspended.
Example async operations are `ds.wait()` and a register read.
Only one fiber executes at a time, while the other fibers are suspended.
This is similar to modern JavaScript, but there's no `await` keyword.

When the executor is woken up (typically due to an incoming packet or a timer expiring),
it will execute all viable fibers until they become suspended.
Executing a fiber may start another viable fiber, which would be also executed until suspension,
before any more packets are processed.

## Handler-pending model

At any given time, there is at most one fiber (which could be suspended) executing a given handler.
If this is not desired, `bg(() => { ... })` syntax can be used to queue code execution
in background, without limits of how many instances of it are running (TODO not impl yet).
If a handler is triggered again, while it is still executing, a boolean flag is set on it,
so that it starts again (once) after the current execution finishes.