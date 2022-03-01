## TODO

* role mgr pipes

```js
lock {
    ...
}
==>
while (_locked)
  await _cond
_locked = 1
...
_locked = 0
signal _cond
```

```js
_log_cnt = 0
function logmsg(id, a, b, c, d, e, f) {
  lock {
    fmt(id, a, b, c, d, e, f)
    pkt[0] = _log_cnt++
    send()
  }
}
```

### General purpose?

* simply `[A|B|C|D] := Rn` ?
  -> verify is tricky - make sure assumptions all right?

* extensibility? in C (possibly via services) or in compiler?

* add integer registers
* integer arithmetic
* integer variables?

* what about analysis?
* integer vs float regs; good idea? maybe only one set of regs - operations decide how to interpret