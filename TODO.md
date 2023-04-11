# TODO

* `[a,b,c] = reg.read()`
* run handlers in background - some sort of object to keep track if it's running?
* add "Internal exception" break category (ones with .internal property; normally we would not break on these if caught)
* have event_breakpoints 32 bit flags enum register - unhandled exns, handled exns, debugger stmts, internal exns, ...
* TODO in `13actions.ts` - fiber ordering

## Later
* multi-program
* have separate files for boards and make them real modules, no .d.ts - limit stuff to parse

## Older stuff?

* `role.control` -> control service of device that has this role ?
* role for control service of the brain (to set status light, reset, etc)
* shift buffer opcode?
* do fiber round-robin for yields?

