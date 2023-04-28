### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v2.8.2](https://github.com/microsoft/devicescript/compare/v2.8.1...v2.8.2)

> 28 April 2023

- fixes around frame sending [`81547c8`](https://github.com/microsoft/devicescript/commit/81547c8e5ed6bc861b15c9f4961b8de4c5241774)
- bump jd-c; 2.8.2 [`22a66ff`](https://github.com/microsoft/devicescript/commit/22a66fff6381a5ed8bf5deca5de723480b9ccfc5)
- use new jd_need_to_send() [`92620b0`](https://github.com/microsoft/devicescript/commit/92620b06e3f23b4b637b91c06d4dce6fb67491fa)

#### [v2.8.1](https://github.com/microsoft/devicescript/compare/v2.8.0...v2.8.1)

> 27 April 2023

- indicate what user program is run; also more debug logging [`4d7617b`](https://github.com/microsoft/devicescript/commit/4d7617b776b3987ae5998f30235b61b29de0aca7)
- bump bytecode to v2.8.1 [`7242d2c`](https://github.com/microsoft/devicescript/commit/7242d2c8498762e2970d02b4f5c66e5f11f4f050)
- update jd-c/ts [`7ccd32a`](https://github.com/microsoft/devicescript/commit/7ccd32a0a31eb0fe4d45af067831054d9b2ac212)

#### [v2.8.0](https://github.com/microsoft/devicescript/compare/v2.7.11...v2.8.0)

> 27 April 2023

- add devNetwork dcfg flag [`ef3036c`](https://github.com/microsoft/devicescript/commit/ef3036c1a26c362ba14eb9703c011f972b62387e)
- fix build [`5cc7a31`](https://github.com/microsoft/devicescript/commit/5cc7a31137cc99b9c78738f3678a77765cb80a0a)
- bump to 2.8.0 [`4826b2b`](https://github.com/microsoft/devicescript/commit/4826b2b8fae528d2d6262427eb2e4aefeb8c20e4)

#### [v2.7.11](https://github.com/microsoft/devicescript/compare/v2.7.10...v2.7.11)

> 27 April 2023

- subscribeMessages -&gt; subscribeMessage [`abf685d`](https://github.com/microsoft/devicescript/commit/abf685d524dcd968d64cba982fa53977c0c1f271)
- better logic to generate device name [`2c63788`](https://github.com/microsoft/devicescript/commit/2c6378882293dc33abf2001d6875214a5c0af254)
- optionaly try to publish to vscode marketplace [`9aafc37`](https://github.com/microsoft/devicescript/commit/9aafc3749de288eaf0a7cad68c797bc7cea22c8d)

#### [v2.7.10](https://github.com/microsoft/devicescript/compare/v2.7.9...v2.7.10)

> 27 April 2023

- add BME680 driver [`eb39979`](https://github.com/microsoft/devicescript/commit/eb399791d0b13f306617c786c4849134c82f7a90)
- add Buffer.concat,set,slice [`f4328b7`](https://github.com/microsoft/devicescript/commit/f4328b7fb3bfc3c6956753df104909c7ebcda738)
- more gateway docs [`5fd5ee2`](https://github.com/microsoft/devicescript/commit/5fd5ee283e64bbb4a849353ad9ab3410563eedbd)

#### [v2.7.9](https://github.com/microsoft/devicescript/compare/v2.7.7...v2.7.9)

> 26 April 2023

- bump bytecode to v2.7.9 [`931ba70`](https://github.com/microsoft/devicescript/commit/931ba708510a3ceeb4db2de118d2d29f9058367c)
- fix zx syntax [`6ff9b87`](https://github.com/microsoft/devicescript/commit/6ff9b87c18d7d4e7c78f1de5d4c3bf4028a165eb)
- bump bytecode to v2.7.8 [`ec72172`](https://github.com/microsoft/devicescript/commit/ec7217242629b056b700f3cd0206207b967f81b0)

#### [v2.7.7](https://github.com/microsoft/devicescript/compare/v2.7.4...v2.7.7)

> 26 April 2023

- updatd support link [`adae14b`](https://github.com/microsoft/devicescript/commit/adae14bb78756ad9a92833c88f42778f17d8065e)
- check env before running build [`1bfb701`](https://github.com/microsoft/devicescript/commit/1bfb701aeeab6534f3ca7e857de574ac20dca3cd)
- use correct name [`ddd01ca`](https://github.com/microsoft/devicescript/commit/ddd01cab799da20635ba43c91497b7e45bd3f4fd)

#### [v2.7.4](https://github.com/microsoft/devicescript/compare/v2.7.3...v2.7.4)

> 26 April 2023

- add tags [`e7227fa`](https://github.com/microsoft/devicescript/commit/e7227fa20827ebdec4382112d16446507938bbe7)
- bump bytecode to v2.7.4 [`1ebcfa6`](https://github.com/microsoft/devicescript/commit/1ebcfa6aff3b431c415bb35c329b678057bb9acb)
- fix make release [`2914a72`](https://github.com/microsoft/devicescript/commit/2914a7214fe9fd2c25a2012a34d117f1ac14742e)

#### [v2.7.3](https://github.com/microsoft/devicescript/compare/v2.7.2...v2.7.3)

> 26 April 2023

- updated marketplace docs [`5ad3662`](https://github.com/microsoft/devicescript/commit/5ad36629755974bb906bbd59fe3528e905dc32b2)
- publish to marketplace [`9b066bb`](https://github.com/microsoft/devicescript/commit/9b066bb2a7385def0fc5996be378ca39e7d3fc92)
- ignore galleryBanner [`9396c4f`](https://github.com/microsoft/devicescript/commit/9396c4f474379418d150e407b2b260231eb5dac5)

#### [v2.7.2](https://github.com/microsoft/devicescript/compare/v2.7.1...v2.7.2)

> 26 April 2023

- Environment support in vscode [`#371`](https://github.com/microsoft/devicescript/pull/371)
- restart program on sha-matching deploy; fixes #372 [`#372`](https://github.com/microsoft/devicescript/issues/372)
- add motion service; fixes #364 [`#364`](https://github.com/microsoft/devicescript/issues/364)
- use common names for common registers [`714d920`](https://github.com/microsoft/devicescript/commit/714d920a8c6b863885e798728eae38b2122e95d8)
- don't compile .ts in docs [`9479a86`](https://github.com/microsoft/devicescript/commit/9479a865b38142a707aa080b1e9d884a581834a2)
- accessbiilty fixes [`7c4ea1b`](https://github.com/microsoft/devicescript/commit/7c4ea1b959b2d45950501229d0052b1c1d33ac4a)

#### [v2.7.1](https://github.com/microsoft/devicescript/compare/v2.7.0...v2.7.1)

> 24 April 2023

- i2c scan off by default; fixes #352 [`#352`](https://github.com/microsoft/devicescript/issues/352)
- add .toString() warning; fixes #345 [`#345`](https://github.com/microsoft/devicescript/issues/345)
- fix ctor arg refs; fixes #357 [`#357`](https://github.com/microsoft/devicescript/issues/357)
- Revert "only one copy of boards.json please" [`7fd5b3e`](https://github.com/microsoft/devicescript/commit/7fd5b3e57740d4572bdb7dd5ddcf20134ff9ec68)
- only one copy of boards.json please [`a345712`](https://github.com/microsoft/devicescript/commit/a34571217dec093fa8dabfa69f89612fdbf95d45)
- update boards.json (fixing doc-gen) [`e8bdd0c`](https://github.com/microsoft/devicescript/commit/e8bdd0cc4955813904dd5a6484830af87cfa36a1)

#### [v2.7.0](https://github.com/microsoft/devicescript/compare/v2.6.2...v2.7.0)

> 21 April 2023

- I2c driver [`#353`](https://github.com/microsoft/devicescript/pull/353)
- Minor server refactorings [`#350`](https://github.com/microsoft/devicescript/pull/350)
- treat roles as regular objects [`5acb1f4`](https://github.com/microsoft/devicescript/commit/5acb1f481443413f2fa348a13df34d448118a2c8)
- update boards [`718f718`](https://github.com/microsoft/devicescript/commit/718f718b010afb8760f1d87a278a77869e2b71b8)
- use board.startButtonBOOT() etc [`ff5582b`](https://github.com/microsoft/devicescript/commit/ff5582b4decfb649c562aaac68391fd4c57cf2c2)

#### [v2.6.2](https://github.com/microsoft/devicescript/compare/v2.6.1...v2.6.2)

> 19 April 2023

- add GPIO service; 2.6.2 [`c7da058`](https://github.com/microsoft/devicescript/commit/c7da058ad0fa7999e0b02e534492ae57a53e09a1)
- update rise4fun tools [`70399ca`](https://github.com/microsoft/devicescript/commit/70399caee5effe5d21e1c081960f3e907abadd91)

#### [v2.6.1](https://github.com/microsoft/devicescript/compare/v2.6.0...v2.6.1)

> 19 April 2023

- upgrade to docusaurus 2.4.0 [`#348`](https://github.com/microsoft/devicescript/pull/348)
- split clientcmds further [`85580ea`](https://github.com/microsoft/devicescript/commit/85580ea7c9735e7af2d9be03db800b6c8e02f025)
- more docs updates [`561f4ec`](https://github.com/microsoft/devicescript/commit/561f4eca915a353cd88c349dce710a1c88127b9a)
- add RotaryEncoder.asPotentiometer() [`5075297`](https://github.com/microsoft/devicescript/commit/50752976cbe0c575a6fcf5dd7b89bc6aae8358c5)

#### [v2.6.0](https://github.com/microsoft/devicescript/compare/v2.5.0...v2.6.0)

> 18 April 2023

- first draft of drivers package [`#346`](https://github.com/microsoft/devicescript/pull/346)
- add buffer decoding tests; fixes #40 [`#40`](https://github.com/microsoft/devicescript/issues/40)
- move code from clientcmds.ts to array.ts and i2c package [`f2eac1a`](https://github.com/microsoft/devicescript/commit/f2eac1a1bb9eb3c5bbffb318f390834361e3bf66)
- add ds.actionReport() for action responses [`4c8cbad`](https://github.com/microsoft/devicescript/commit/4c8cbad044349d936770df6238186c9dd1d834a1)
- add Role.report and utility functions around it [`d782aa8`](https://github.com/microsoft/devicescript/commit/d782aa8ab6d8f8e329063dcb25bdf2f7a0c7b3cf)
