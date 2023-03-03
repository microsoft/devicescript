# TODO

* `Condition` handling
* register delay computation
* `[a,b,c] = reg.read()`
* run handlers in background - some sort of object to keep track if it's running?
* add "Internal exception" break category (ones with .internal property; normally we would not break on these if caught)
* have event_breakpoints 32 bit flags enum register - unhandled exns, handled exns, debugger stmts, internal exns, ...
* change `ALLOC_*` opcodes to expressions
* `Object.keys(spec_object)` ?
* validate UTF8 on input
* fix charAt() etc to decode UTF8
* limit call stack depth
* drop code alignment requirement
* add LED service
* add switch service (simple GPIO out)
* implement matching of instance name to role name
* TODO in `13actions.ts` - fiber ordering
* Jacdac packet queue overflow when printing a lot
* tree strings?
* introduce Fiber class (also Fiber.suspend() and Fiber.resume())
* drop `length` field from fun-descriptor

## Later
* multi-program
* hash-consing of strings? (esp. for JSON parsing)
* compacting GC
* have separate files for boards and make them real modules, no .d.ts - limit stuff to parse
* allow control of auto-upload from DS

## Older stuff?

* `role.control` -> control service of device that has this role ?
* role for control service of the brain (to set status light, reset, etc)
* add opcode to cache current packet (in onChanged())
* shift buffer opcode?
* add `role.waitConnected()` or something?
* add `bg(() => { ... })`, also `bg1()` ?
* do fiber round-robin for yields?
* some testing framework? (depends on services?)

