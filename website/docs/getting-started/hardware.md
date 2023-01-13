---
sidebar_position: 10
hide_table_of_contents: true
---

# Hardware

For this part of the guide, we will be using the _real_ hardware components.


For the DeviceScript runtime,

-   a [Raspberry Pi Pico W](/devices/raspberry-pi-pico-w/) board

or

-   a [Adafruit QtPy ESP32 C3](/devices/adafruit-qt-py-esp32-c3-wifi-dev-board/) board

and for sensors,

-   a [Adafruit LPS25 Pressure Sensor](https://www.adafruit.com/product/4530)

## Connecting the pressure sensor

We use a Adafruit PiCowbell for convenience to easily connect
STEMMA sensors. Solders headers to your Pico and mount it
on the PiCowbell.

Connect the Adafruit pressure sensor and reset the Pico
so that it gets detected. When the DeviceScript VM starts,
it scans the I2C bus (STEMMA QT) for known sensors and automatically mount Jacdac servers for them. This is what
happens with the pressure sensor and it should now show up
in the developer tools window.

## Uploading DeviceScript bytecode

Click on the chip to start flashing the DeviceScript bytecode
to your Raspberry Pico. It will automatically reflash when it detects changes.
