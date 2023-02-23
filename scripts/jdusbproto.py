import struct
import time
import serial
import serial.threaded
import socket
import typing
import threading
import sys

def read16(arr:bytes, off = 0) -> int:
    return struct.unpack_from("<H", arr, offset=off)[0]

def read32(arr:bytes, off = 0) -> int:
    return struct.unpack_from("<I", arr, offset=off)[0]

def debug(m:str):
    print(m)

JD_DEVICE_IDENTIFIER_BROADCAST_HIGH_MARK = 0xaaaaaaaa
JD_FRAME_FLAG_IDENTIFIER_IS_SERVICE_CLASS = 0x04
JD_FRAME_FLAG_LOOPBACK = 0x40
JD_SERVICE_INDEX_BROADCAST = 0x3d
SRV_USB_BRIDGE = 0x18f61a4a
JD_FRAME_FLAG_COMMAND = 0x01

def const(x): return x

class UsbBridgeQByte:
    MAGIC = const(0xfe)
    LITERAL_MAGIC = const(0xf8)
    RESERVED = const(0xf9)
    SERIAL_GAP = const(0xfa)
    FRAME_GAP = const(0xfb)
    FRAME_START = const(0xfc)
    FRAME_END = const(0xfd)

JD_USB_BRIDGE_CMD_DISABLE_PACKETS = const(0x80)
JD_USB_BRIDGE_CMD_ENABLE_PACKETS = const(0x81)
JD_USB_BRIDGE_CMD_DISABLE_LOG = const(0x82)
JD_USB_BRIDGE_CMD_ENABLE_LOG = const(0x83)

def crc(buf: bytes, start: int = 0, end: int = 100000):
    if end > len(buf):
        end = len(buf)
    crc = 0xffff
    while start < end:
        data = buf[start]
        start += 1
        x = (crc >> 8) ^ data
        x ^= x >> 4
        crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff
    return crc


class JdUsbProto(serial.threaded.Protocol):
    def __init__(self, ser):
        self.usb_rx_was_magic = 0
        self.usb_rx_state = 0
        self.usb_rx_ptr = 0
        self.rxbuf = bytearray(256)
        self.numFrames = 0
        self.socket: typing.Optional[socket.socket] = None
        self.ser = ser
    
    def __call__(self):
        return self

    def connection_made(self, transport):
        def connect():
            for i in range(100):
                self.send_frame(
                    self.processingPkt(JD_USB_BRIDGE_CMD_ENABLE_PACKETS)
                )
                self.send_frame(
                    self.processingPkt(JD_USB_BRIDGE_CMD_ENABLE_LOG)
                )
                time.sleep(0.3)
                if self.numFrames > 0: break
                self.log("waiting for response %d..." % i)
            self.log("connected")
        self.th = threading.Thread(target=connect)
        self.th.start()

    def data_received(self, data):
        self.decodeFrame(data)

    def connection_lost(self, exc):
        print("conn lost")
        if isinstance(exc, Exception):
            raise exc

    def logError(self, msg: str):
        print("JDUSB Error: " + msg)
    
    def log(self, msg: str):
        print("log: " + msg)

    def handleProcessingFrame(self, fr: bytes):
        cmd = read16(fr, 14)
        self.log("processing frame: 0x%x" % cmd)
    
    def frameHandler(self, fr: bytes):
        if self.socket is not None:
            self.socket.sendall(bytes([len(fr)]) + fr)

    def handleFrame(self, fr: bytes):
        self.numFrames += 1
        sz = fr[2] + 12
        if len(fr) < 4 or len(fr) < sz:
            self.logError("short frm")
            return
        fr = fr[0:sz]
        c = crc(fr[2:])
        if read16(fr, 0) != c:
            self.logError("crc err")
            return

        if (fr[3] & JD_FRAME_FLAG_IDENTIFIER_IS_SERVICE_CLASS) != 0 and \
            read32(fr, 4) == SRV_USB_BRIDGE:
            self.handleProcessingFrame(fr)
        else:
            self.frameHandler(fr)

    def decodeFrame(self, buf: bytes):
        serialBuf: list[int] = []

        def jd_usb_serial_cb(c: int):
            serialBuf.append(c)

        def frame_error():
            # break out of frame state
            self.usb_rx_state = 0
            # pass on accumulated data as serial
            for j in range(self.usb_rx_ptr):
                jd_usb_serial_cb(self.rxbuf[j])
            self.usb_rx_ptr = 0

        for i in range(len(buf)):
            c = buf[i]
            if self.usb_rx_was_magic:
                if c == UsbBridgeQByte.MAGIC:
                    if self.usb_rx_state:
                        self.logError("dual magic")
                        frame_error()
                        continue
                    # 'c' will be passed to jd_usb_serial_cb() below
                else:
                    self.usb_rx_was_magic = 0
                    if (c == UsbBridgeQByte.LITERAL_MAGIC):
                        c = UsbBridgeQByte.MAGIC
                    elif c == UsbBridgeQByte.FRAME_START:
                        if (self.usb_rx_ptr):
                            self.logError("second begin")
                            frame_error()
                        self.usb_rx_state = c
                        continue
                    elif c == UsbBridgeQByte.FRAME_END:
                        if self.usb_rx_state:
                            self.usb_rx_state = 0
                            fr = self.rxbuf[0: self.usb_rx_ptr]
                            self.handleFrame(fr)
                            self.usb_rx_ptr = 0
                        else:
                            self.logError("mismatched stop")
                        continue
                    elif c == UsbBridgeQByte.SERIAL_GAP:
                        if len(serialBuf) > 0:
                            self.onSerial(bytes(serialBuf), False)
                        serialBuf = []
                        self.onSerialGap()
                        continue
                    elif c == UsbBridgeQByte.FRAME_GAP:
                        self.onFrameGap()
                        continue
                    elif c == UsbBridgeQByte.RESERVED:
                        continue # ignore
                    else:
                        if self.usb_rx_state:
                            self.logError("invalid quote")
                            frame_error()
                        # either way, pass on directly
                        jd_usb_serial_cb(UsbBridgeQByte.MAGIC)
                        # c = c;
            elif c == UsbBridgeQByte.MAGIC:
                self.usb_rx_was_magic = 1
                continue

            if self.usb_rx_state:
                if self.usb_rx_ptr >= len(self.rxbuf):
                    self.logError("frame ovf")
                    frame_error()
                else:
                    self.rxbuf[self.usb_rx_ptr] = c
                    self.usb_rx_ptr += 1
            else:
                jd_usb_serial_cb(c)

        if len(serialBuf) > 0:
            self.onSerial(bytes(serialBuf), False)

    def error(self, m: str):
        raise ValueError(m)

    def processingPkt(self, serviceCommand: int):
        f = bytearray( struct.pack("<HBBIIBBH",
            0, # crc
            4, # _size
            JD_FRAME_FLAG_IDENTIFIER_IS_SERVICE_CLASS |
                JD_FRAME_FLAG_COMMAND |
                JD_FRAME_FLAG_LOOPBACK,
            SRV_USB_BRIDGE,
            JD_DEVICE_IDENTIFIER_BROADCAST_HIGH_MARK,
            0, # service size
            JD_SERVICE_INDEX_BROADCAST,
            serviceCommand,
        ))
        c = crc(f[2:])
        f[0] = c & 0xff
        f[1] = c >> 8
        return f

    def encodeFrame(self, buf: bytes):
        c = crc(buf[2:])
        if buf[0] + (buf[1] << 8) != c:
            raise ValueError("bad crc")

        outp: list[int] = []

        outp.append(UsbBridgeQByte.MAGIC)
        outp.append(UsbBridgeQByte.FRAME_START)

        for ptr in range(len(buf)):
            b = buf[ptr]
            outp.append(b)
            if b == UsbBridgeQByte.MAGIC:
                outp.append(UsbBridgeQByte.LITERAL_MAGIC)

        outp.append(UsbBridgeQByte.MAGIC)
        outp.append(UsbBridgeQByte.FRAME_END)

        return bytes(outp)

    def send_frame(self, fr: bytes):
        buf = self.encodeFrame(fr)
        self.ser.write(buf)

    def flushSerial(self):
        pass

    def onSerialGap(self):
        self.flushSerial()
        debug("DEV-S: [...some serial output skipped...]")

    def onFrameGap(self):
        debug("DEV-S: [...some Jacdac packets skipped...]")

    def onSerial(self, data: bytes, iserr: bool):
        sys.stdout.buffer.write(data)
        sys.stdout.buffer.flush()

    def postConnectAsync(self):
        pass

    def disconnectAsync(self):
        pass 
