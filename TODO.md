# TODO

### treat roles as "normal" objects
* `Condition` handling
* register delay computation
* `[a,b,c] = reg.read()`
* run handlers in background - some sort of object to keep track if it's running?

## Random stuff
* support `import` for user code (also for side-effects work)
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

## Big ticket
* Jacdac packet queue overflow when printing a lot

## General usability
* tree strings?
* introduce Fiber class (also Fiber.suspend() and Fiber.resume())
* drop `length` field from fun-descriptor
* automatically add `ds.reboot()` in tests

## Later
* multi-program
* hash-consing of strings? (esp. for JSON parsing)
* compacting GC
* have separate files for boards and make them real modules, no .d.ts - limit stuff to parse

## Older stuff?

* hang properties off roles - `high`, `lastHigh` for bar graph eg
* `role.control` -> control service of device that has this role ?
* role for control service of the brain (to set status light, reset, etc)
* add opcode to cache current packet (in onChanged())
* shift buffer opcode?
* somehow deal with events with legit args (button and barcode reader currently) - doesn't work so well in handler-pending model
* add `role.waitConnected()` or something?
* add `bg(() => { ... })`, also `bg1()` ?
* do fiber round-robin for yields?
* some testing framework? (depends on services?)

## Implementing services in DeviceScript

* this generally doesn't work with handler-pending model
* opcode to send current packet
* opcode to set the command
* opcode to set service number
* some way of building announce packets
* handler when a packet is received
* support 1 or more devices per VM instance?
* add `try_again` report in addition to `command_not_implemented` ?

## Cloud

* specific uploads: `hum.autoUpload(5, 1) // 5s, 1%`
* auto-upload of everything
