## TODO

### General purpose?

* simply `[A|B|C|D] := Rn` ?
  -> verify is tricky - make sure assumptions all right?
  -> some opcode have some bits inlined

* extensibility via services and compiler
* allow copying between buffers

What needs to be passed as arguments?
* global address
* function
* role
* register/command code

Use cases:
* LED display client with double-buffering
* display number (two digits) on dot matrix screen
* scroll text on dot matrix screen (compile-in font?)
* compute median of measurements

* parametrize number of roles?

