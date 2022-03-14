set print elements 10000
set history save on
set history filename ~/.gdb_history
set print pretty on

define hook-quit
    set confirm off
end
set startup-with-shell off

file built/jdcli
set args 8082 tmp/prog.jacs
