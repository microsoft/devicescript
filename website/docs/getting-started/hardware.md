---
sidebar_position: 10
hide_table_of_contents: true
---

# Hardware

For this part of the guide, we will be using the _real_ hardware components:

-   a [Raspberry Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) board,
-   a [Adafruit PiCowbell Proto for Pico](https://www.adafruit.com/product/5200)
-   a [Adafruit LPS25 Pressure Sensor](https://www.adafruit.com/product/4530)

## Updating the Pico

The first step is to upload the DeviceScript Virtual Macine
firmware on the Raspberry Pi Pico.
Navigate to https://github.com/microsoft/jacdac-pico/releases and drop the `.uf2` on your Pico bootloader drive.

## Connecting the Pico

Once the UF2 is copied and the Pico restarted,

-   open the DeviceScript developer tools (click `Run`)
-   click `Connect`
-   click `Connect USB`
-   select `Raspberry Pico` in the system menu listing devices

After connecting, you should see a new chip under the `DeviceScript` section with the image of the Raspberry Pico.

## Connecting the pressure sensor

We use a Adafruit PiCowbell for convinience to easily connect
STEMMA sensors. Solders headers to your Pico and mount it
on the PiCowbell.

Connect the Adafruit pressure sensor and reset the Pico
so that it gets detected. When the DeviceScript VM starts,
it scans the I2C bus (STEMMA QT) for known sensors and automatically mount Jacdac servers for them. This is what
happens with the pressure sensor and it should now show up
in the developer tools window.

## Uploading DeviceScript bytecode

Click on the chip to start flasing the DeviceScript bytecode
to your Raspberry Pico. It will automatically reflash when it detects changes.
