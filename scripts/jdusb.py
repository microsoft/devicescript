#!/usr/bin/env python
#
# Command line driver based on:
# (C) 2002-2020 Chris Liechti <cliechti@gmx.net>
# SPDX-License-Identifier:    BSD-3-Clause

import sys
import socket
import serial
import serial.threaded
import time

import jdusbproto

if __name__ == '__main__':  # noqa
    import argparse

    parser = argparse.ArgumentParser(
        description='JDUSB/serial to tcp:// connector')

    parser.add_argument(
        'SERIALPORT',
        help="serial port name")

    parser.add_argument(
        'BAUDRATE',
        type=int,
        nargs='?',
        help='set baud rate, default: %(default)s',
        default=1500000)

    parser.add_argument(
        '--develop',
        action='store_true',
        help='Development mode, prints Python internals on errors',
        default=False)

    parser.add_argument(
        '-c', '--client',
        metavar='HOST:PORT',
        help='connect to devtools, default: %(default)s',
        default='localhost:8082')

    args = parser.parse_args()

    # connect to serial port
    ser = serial.serial_for_url(args.SERIALPORT, do_not_open=True)
    ser.baudrate = args.BAUDRATE

    sys.stderr.write(
        '--- TCP/IP to Serial redirect on {p.name}  {p.baudrate},{p.bytesize},{p.parity},{p.stopbits} ---\n'
        '--- type Ctrl-C / BREAK to quit\n'.format(p=ser))

    try:
        ser.open()
    except serial.SerialException as e:
        sys.stderr.write('Could not open serial port {}: {}\n'.format(ser.name, e))
        sys.exit(1)

    ser_to_net = jdusbproto.JdUsbProto(ser)
    serial_worker = serial.threaded.ReaderThread(ser, ser_to_net)
    serial_worker.start()

    sleep_time = 0

    try:
        while True:
            time.sleep(sleep_time)
            host, port = args.client.split(':')
            sys.stderr.write("connecting to {}:{}...\n".format(host, port))
            sleep_time = 5
            client_socket = socket.socket()
            try:
                client_socket.connect((host, int(port)))
            except socket.error as msg:
                sys.stderr.write('WARNING: {}\n'.format(msg))
                continue
            sys.stderr.write('Connected\n')
            client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            #~ client_socket.settimeout(5)
            try:
                ser_to_net.socket = client_socket
                # enter network <-> serial loop
                prev_data = b''
                while True:
                    try:
                        data = client_socket.recv(1024)
                        if not data:
                            break
                        prev_data += data
                        while len(prev_data) > 0:
                            ln = prev_data[0]
                            if len(prev_data) <= ln:
                                break
                            ser_to_net.send_frame(prev_data[1:ln+1])
                            prev_data = prev_data[ln+1:]
                    except socket.error as msg:
                        if args.develop:
                            raise
                        sys.stderr.write('ERROR: {}\n'.format(msg))
                        # probably got disconnected
                        break
            except socket.error as msg:
                if args.develop:
                    raise
                sys.stderr.write('ERROR: {}\n'.format(msg))
            finally:
                ser_to_net.socket = None
                sys.stderr.write('Disconnected\n')
                client_socket.close()
    except KeyboardInterrupt:
        pass

    sys.stderr.write('\n--- exit ---\n')
    serial_worker.stop()