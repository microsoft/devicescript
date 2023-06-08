### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v2.10.9](https://github.com/microsoft/devicescript/compare/v2.10.8...v2.10.9)

> 7 June 2023

- disable auto-start when connected with vscode [`#451`](https://github.com/microsoft/devicescript/pull/451)
- updated error generation [`611ab5c`](https://github.com/microsoft/devicescript/commit/611ab5c6b192c3e9be1c314ddfa68964d2ae5090)
- keep GC heap around [`a7f9948`](https://github.com/microsoft/devicescript/commit/a7f9948463388c99345ac0d13f44481c968859ba)
- add special ds._panic(0xab04711) for low-level panic [`a53ea32`](https://github.com/microsoft/devicescript/commit/a53ea323cd5527874a4acfdf1436fd0382a68589)

#### [v2.10.8](https://github.com/microsoft/devicescript/compare/v2.10.7...v2.10.8)

> 7 June 2023

- adding error infrastructure [`2190501`](https://github.com/microsoft/devicescript/commit/21905013dd1fdb74b84ce40d99f07b002a670941)
- trap long settings at compile time [`4e3b710`](https://github.com/microsoft/devicescript/commit/4e3b71094c1ba89556b1f8867dce90e0a32570ba)
- more logging [`b4c77aa`](https://github.com/microsoft/devicescript/commit/b4c77aa90bb319a82b357805ebedb38c5ad457f5)

#### [v2.10.7](https://github.com/microsoft/devicescript/compare/v2.10.6...v2.10.7)

> 7 June 2023

- stop simulator when physical device connects [`5911164`](https://github.com/microsoft/devicescript/commit/5911164ba4ebceba3c320f3ce517cc2d52ab41cf)

#### [v2.10.6](https://github.com/microsoft/devicescript/compare/v2.10.5...v2.10.6)

> 7 June 2023

- don't use yarn [`#443`](https://github.com/microsoft/devicescript/pull/443)
- adding worksho info [`d7f0539`](https://github.com/microsoft/devicescript/commit/d7f0539be064afcf3f908c962bb361cbe70b1e3f)
- updated  workshop info [`be75cdb`](https://github.com/microsoft/devicescript/commit/be75cdb8df454dc811724d186a61a58fb52452e6)
- update buzzer docs [`0113838`](https://github.com/microsoft/devicescript/commit/0113838efc041ea694c76b34a97d70f8491b6e92)

#### [v2.10.5](https://github.com/microsoft/devicescript/compare/v2.10.4...v2.10.5)

> 6 June 2023

- throttle outgoing packets (50/s) [`6a3a631`](https://github.com/microsoft/devicescript/commit/6a3a631b61f6fd9bf7cb09a216fb556440467e06)
- tweak GC trigger heuristic [`f9ba2cf`](https://github.com/microsoft/devicescript/commit/f9ba2cf7198337e954d40d93a66a83cac9031bda)
- simplify gc trigger logic [`00b0b21`](https://github.com/microsoft/devicescript/commit/00b0b21b2dea0cf1d969d85d40970a11d70c61fe)

#### [v2.10.4](https://github.com/microsoft/devicescript/compare/v2.10.3...v2.10.4)

> 6 June 2023

- add clean option in UI [`ad1f4a1`](https://github.com/microsoft/devicescript/commit/ad1f4a19c50cac0d6826b787a3d0f78d39089c7f)
- better error reporting [`48c00b6`](https://github.com/microsoft/devicescript/commit/48c00b687a3b72abfa2860f8d5b25d57d08d069c)
- revert clean option [`ffcf189`](https://github.com/microsoft/devicescript/commit/ffcf1895a025f9b033c9689ac87a80cec68910da)

#### [v2.10.3](https://github.com/microsoft/devicescript/compare/v2.10.2...v2.10.3)

> 6 June 2023

- use python extension to resolve python path [`0e85940`](https://github.com/microsoft/devicescript/commit/0e859405b080cae3b62147f775e8a1a4833b3b3f)
- adding schedule function [`98ed647`](https://github.com/microsoft/devicescript/commit/98ed6473c4bee6e996288d285a530562ca593bd5)
- collect version number when reporting issue [`354b272`](https://github.com/microsoft/devicescript/commit/354b272d7e49580a0d36de6b44b117393ea3b6d4)

#### [v2.10.2](https://github.com/microsoft/devicescript/compare/v2.10.1...v2.10.2)

> 6 June 2023

- add 'devs flash --clean ...' [`c94fb79`](https://github.com/microsoft/devicescript/commit/c94fb7963d376377e6b0f233fffd35c52236fb1f)
- updated github build sample [`b4b9f00`](https://github.com/microsoft/devicescript/commit/b4b9f001d8f3fd78f9caaa74a6ccfc7029146e11)
- unicode trim(); info on ASCII toLowerCase() [`f337581`](https://github.com/microsoft/devicescript/commit/f337581b40994adceb2ce9c496ca26c1dd6e7d38)

#### [v2.10.1](https://github.com/microsoft/devicescript/compare/v2.10.0...v2.10.1)

> 5 June 2023

- auto install esptool on flash [`#437`](https://github.com/microsoft/devicescript/pull/437)
- sample using fetch [`#435`](https://github.com/microsoft/devicescript/pull/435)
- add option to add settings, tests in wand [`#436`](https://github.com/microsoft/devicescript/pull/436)
- tcp/tls sockets for wasm [`73b688e`](https://github.com/microsoft/devicescript/commit/73b688ef36e8dfa80912a5074723bf6452799ec2)
- add observable timestamp operator [`0f4bf61`](https://github.com/microsoft/devicescript/commit/0f4bf6195f2fed6593ee28bec107f6a74ecaf59a)
- add support for fetch body [`f80cf1e`](https://github.com/microsoft/devicescript/commit/f80cf1ea56e4a50f516b5fea3b85a9d489c18a3d)

#### [v2.10.0](https://github.com/microsoft/devicescript/compare/v2.9.16...v2.10.0)

> 5 June 2023

- 2.10.0: add net.Socket, net.fetch and more String/Buffer methods [`#433`](https://github.com/microsoft/devicescript/pull/433)
- Fix trivial typo in CLI docs [`#431`](https://github.com/microsoft/devicescript/pull/431)
- ROS [`#430`](https://github.com/microsoft/devicescript/pull/430)
- fix docs codegen for builtin packages [`22c688d`](https://github.com/microsoft/devicescript/commit/22c688d7545f7842f4ecfe27891c178d835b7315)
- fix new gcc warning: int foo() -&gt; int foo(void) [`615e1eb`](https://github.com/microsoft/devicescript/commit/615e1ebdee4566e57ca30dbcd54b9c8f3474e7e6)
- remove it support in tests [`a8bb583`](https://github.com/microsoft/devicescript/commit/a8bb583fcfa22ef1b41d87d5d297b65d897947af)

#### [v2.9.16](https://github.com/microsoft/devicescript/compare/v2.9.15...v2.9.16)

> 1 June 2023

- more docs on settings [`46f1633`](https://github.com/microsoft/devicescript/commit/46f16338aa34da4fa36e416328dd5e167a4272dc)
- more docs [`172645d`](https://github.com/microsoft/devicescript/commit/172645dd94286c8b2df860b698b89357c09669eb)
- add issue reporting [`5f57c62`](https://github.com/microsoft/devicescript/commit/5f57c621a2ef518ef1d9d4b586472a3775d006fc)

#### [v2.9.15](https://github.com/microsoft/devicescript/compare/v2.9.14...v2.9.15)

> 1 June 2023

- barebone docs on spi [`0f568ac`](https://github.com/microsoft/devicescript/commit/0f568ac607e9364017e34eadab8fae321ac278fc)
- add note about network support [`d5aac75`](https://github.com/microsoft/devicescript/commit/d5aac7525b7c3234665e503a697581f339a634f2)
- add settings clear menu item [`2188d0b`](https://github.com/microsoft/devicescript/commit/2188d0bc064faef5215b3434c8a741991f0809ad)

#### [v2.9.14](https://github.com/microsoft/devicescript/compare/v2.9.13...v2.9.14)

> 1 June 2023

- support for .env file [`#426`](https://github.com/microsoft/devicescript/pull/426)
- tsdoc attributes normalization [`#424`](https://github.com/microsoft/devicescript/pull/424)
- docs: fix broken HomeBridge hyperlink [`#422`](https://github.com/microsoft/devicescript/pull/422)
- Update index.mdx [`#417`](https://github.com/microsoft/devicescript/pull/417)
- Typo fix in CONTRIBUTING.md [`#416`](https://github.com/microsoft/devicescript/pull/416)
- Fix documentation typos [`#415`](https://github.com/microsoft/devicescript/pull/415)
- allow @ds-when-used attributes; fixes #332 [`#332`](https://github.com/microsoft/devicescript/issues/332)
- updated docs about status light [`ecb7c7b`](https://github.com/microsoft/devicescript/commit/ecb7c7be5ab9c882e6194880e63d4ba60932fd06)
- Update issue templates [`05fc469`](https://github.com/microsoft/devicescript/commit/05fc469c3f8d25781a18f1b8e37ca24e9f95f43e)
- Update issue templates [`509ce4f`](https://github.com/microsoft/devicescript/commit/509ce4fc77a5fa88ca5773e47ba66911b84f8c1f)

#### [v2.9.13](https://github.com/microsoft/devicescript/compare/v2.9.12...v2.9.13)

> 25 May 2023

- support for yarn 2.0 [`#406`](https://github.com/microsoft/devicescript/pull/406)
- Fix typo in events.md [`#399`](https://github.com/microsoft/devicescript/pull/399)
- Fix typo in add-board.mdx [`#400`](https://github.com/microsoft/devicescript/pull/400)
- Update json.mdx [`#398`](https://github.com/microsoft/devicescript/pull/398)
- add csv history [`48500b3`](https://github.com/microsoft/devicescript/commit/48500b38d465a24996430f6e8a78c9151b4d9002)
- simplify sample [`7ba4133`](https://github.com/microsoft/devicescript/commit/7ba4133371eef1be7985d72f304cebedacaae890)
- add @devicescript/spi module [`05feaaf`](https://github.com/microsoft/devicescript/commit/05feaaf3ff42a5161b788fc461b421aa1f491b4c)

#### [v2.9.12](https://github.com/microsoft/devicescript/compare/v2.9.11...v2.9.12)

> 18 May 2023

- more led runtime [`d49250b`](https://github.com/microsoft/devicescript/commit/d49250b1bba6c3804f01988a091fdde6ceec7037)
- allow address setting on BME680; defl to 0x76 (Seeed) [`6f5594a`](https://github.com/microsoft/devicescript/commit/6f5594a8d9ee91d3394be06c175552538777fc62)
- updated gateway docs [`2168e56`](https://github.com/microsoft/devicescript/commit/2168e56d166905dc0c6b7733e893611d2f50ef7f)

#### [v2.9.11](https://github.com/microsoft/devicescript/compare/v2.9.10...v2.9.11)

> 17 May 2023

- cleanup client commands [`99bd7d8`](https://github.com/microsoft/devicescript/commit/99bd7d89964a4ebd7c8ce6a2ce7d947f78a5f77c)
- support F shortcut in all videos [`f923ab9`](https://github.com/microsoft/devicescript/commit/f923ab95d0b1cfaacbab17131b3ed0666874dfe2)
- support F key for full screen [`b23be3e`](https://github.com/microsoft/devicescript/commit/b23be3ed6f9dae0ebcab661a2f69ada725278415)

#### [v2.9.10](https://github.com/microsoft/devicescript/compare/v2.9.9...v2.9.10)

> 15 May 2023

- fix crash in role mgr; bump jd-c [`3bb6e63`](https://github.com/microsoft/devicescript/commit/3bb6e6300487668f24b72dce4166790babd1f5ee)
- docs: statics supported [`3ef6df2`](https://github.com/microsoft/devicescript/commit/3ef6df29ee3b4d21fa253bec2a373667c210c8dc)

#### [v2.9.9](https://github.com/microsoft/devicescript/compare/v2.9.8...v2.9.9)

> 15 May 2023

- cleanout peripherical docs [`5f3340a`](https://github.com/microsoft/devicescript/commit/5f3340ad17a26ffde208ded7a11b4ce48b0bf572)
- updated role tree item [`488fc11`](https://github.com/microsoft/devicescript/commit/488fc110efa6593c8b1650f6112470c51ab2f20c)
- add rolemanager pretty render [`4f46198`](https://github.com/microsoft/devicescript/commit/4f4619894672e7c6960c895401d237068c0b9b1e)

#### [v2.9.8](https://github.com/microsoft/devicescript/compare/v2.9.7...v2.9.8)

> 10 May 2023

- document, cleanup some i2c drivers [`f2c21a7`](https://github.com/microsoft/devicescript/commit/f2c21a779a91f0528ec13889f80844b1e4153ce1)
- add switch docs [`9ac7615`](https://github.com/microsoft/devicescript/commit/9ac76154312b26fbca9779abfc35952b9b77ffa2)
- use named imports in docs [`dac3431`](https://github.com/microsoft/devicescript/commit/dac34315726b91eb8209e3d5105a52e49ca216de)

#### [v2.9.7](https://github.com/microsoft/devicescript/compare/v2.9.6...v2.9.7)

> 10 May 2023

- move rgb/hsl into runtime module [`#388`](https://github.com/microsoft/devicescript/pull/388)
- a couple more color helpers [`5268c7f`](https://github.com/microsoft/devicescript/commit/5268c7f4895b84fd6644e332f062a7a2d0c35f91)
- add color buffer [`11eb0da`](https://github.com/microsoft/devicescript/commit/11eb0da79b9456fee5db6ba2365f28a717390dbb)
- update docs [`fb192e7`](https://github.com/microsoft/devicescript/commit/fb192e7778f51c91c5fb9037bb568932634d2300)

#### [v2.9.6](https://github.com/microsoft/devicescript/compare/v2.9.5...v2.9.6)

> 9 May 2023

- updated docs [`1f77b35`](https://github.com/microsoft/devicescript/commit/1f77b35cc9420a73391ed66b9f5ee59c40f20ee4)
- standby [`603c81c`](https://github.com/microsoft/devicescript/commit/603c81cf5299301bcb233465c1b326f52d8324fa)
- fix snippets [`9374b2b`](https://github.com/microsoft/devicescript/commit/9374b2b1c6e1a97da8e65920f51ca75c2cec3779)

#### [v2.9.5](https://github.com/microsoft/devicescript/compare/v2.9.4...v2.9.5)

> 8 May 2023

- adding some led options [`#383`](https://github.com/microsoft/devicescript/pull/383)
- generate server-info.json for DS drivers; fixes #381 [`#381`](https://github.com/microsoft/devicescript/issues/381)
- updated samples [`76dcdda`](https://github.com/microsoft/devicescript/commit/76dcddad26701c0fc1035048fb416917c16b24af)
- search npm [`5b0c360`](https://github.com/microsoft/devicescript/commit/5b0c36022e6f32e3635d401b9ccdcd03d2736505)
- handle deploying to a device that is managed by a gateway [`6021672`](https://github.com/microsoft/devicescript/commit/6021672436e3111404d806f3276dfc08677063e2)

#### [v2.9.4](https://github.com/microsoft/devicescript/compare/v2.9.3...v2.9.4)

> 5 May 2023

- add disconnect [`34e810c`](https://github.com/microsoft/devicescript/commit/34e810c7bf59d1b8349e3adf0c76f4720d6e1278)
- handle missing data download [`164d01d`](https://github.com/microsoft/devicescript/commit/164d01d816eb344a147d8555487650fb8f74aa66)
- updated mqtt docs [`223330c`](https://github.com/microsoft/devicescript/commit/223330cc5f488f7531d1b916e5757d1c33c493cb)

#### [v2.9.3](https://github.com/microsoft/devicescript/compare/v2.9.2...v2.9.3)

> 4 May 2023

- add wifi config info [`d9f3ccd`](https://github.com/microsoft/devicescript/commit/d9f3ccdae7716c2e25fe91eac313e8b8a5ccb15d)
- environment docs [`5e5b32f`](https://github.com/microsoft/devicescript/commit/5e5b32f4e36233e4fd516deb057cfbdde9243ead)
- more gateweay docs [`3a3efe1`](https://github.com/microsoft/devicescript/commit/3a3efe1ee943c40dd44db7a5da8991820d86235f)

#### [v2.9.2](https://github.com/microsoft/devicescript/compare/v2.9.1...v2.9.2)

> 3 May 2023

- support for TLS [`ce21748`](https://github.com/microsoft/devicescript/commit/ce21748b3f343a5376e3d7e4e29a21e1ef0e2995)
- uploadMessage -&gt; publishMessage [`4bc8e3a`](https://github.com/microsoft/devicescript/commit/4bc8e3a567395df20232d314a3045f28f53eddfd)
- surface mqtt info in tooltips [`44418a7`](https://github.com/microsoft/devicescript/commit/44418a7845ea76eb6aaee9ef91691bb6b27e76cc)

#### [v2.9.1](https://github.com/microsoft/devicescript/compare/v2.9.0...v2.9.1)

> 29 April 2023

- refactor magic helpers [`#378`](https://github.com/microsoft/devicescript/pull/378)
- hardwareConfig -&gt; configureHardware ? [`#375`](https://github.com/microsoft/devicescript/pull/375)
- fix name resolution of entry when uploading scripts to gateway [`fdb6f65`](https://github.com/microsoft/devicescript/commit/fdb6f65f5d7f0cfc0cfe64a75cdc3a8a8b130c4e)
- expose self-control service (eg for standby()) [`abae36b`](https://github.com/microsoft/devicescript/commit/abae36b1ab9ed72fdb43e3b8195a9b67926cb058)
- add codesandbox info [`e16053e`](https://github.com/microsoft/devicescript/commit/e16053e73408ad6524482135cd9a360642f55095)

#### [v2.9.0](https://github.com/microsoft/devicescript/compare/v2.8.3...v2.9.0)

> 28 April 2023

- support for static class members; fixes #337; 2.9.0 [`#337`](https://github.com/microsoft/devicescript/issues/337)
- filter out more commits from changelog [`cf5883f`](https://github.com/microsoft/devicescript/commit/cf5883fc8307b3ad779cb9e24fc64b6b07518567)
- store list of services in device meta [`7ca544c`](https://github.com/microsoft/devicescript/commit/7ca544c77ee788333e92042503365ca61456b956)

#### [v2.8.3](https://github.com/microsoft/devicescript/compare/v2.8.2...v2.8.3)

> 28 April 2023

- automatic update of changelog [`705037b`](https://github.com/microsoft/devicescript/commit/705037bfac7518756cd277502106afebba82286c)
- updated docs [`b84256a`](https://github.com/microsoft/devicescript/commit/b84256ade132070330e49679dff7a23965cdb355)

#### [v2.8.2](https://github.com/microsoft/devicescript/compare/v2.8.1...v2.8.2)

> 28 April 2023

- fixes around frame sending [`81547c8`](https://github.com/microsoft/devicescript/commit/81547c8e5ed6bc861b15c9f4961b8de4c5241774)
- bump jd-c; 2.8.2 [`22a66ff`](https://github.com/microsoft/devicescript/commit/22a66fff6381a5ed8bf5deca5de723480b9ccfc5)
- use new jd_need_to_send() [`92620b0`](https://github.com/microsoft/devicescript/commit/92620b06e3f23b4b637b91c06d4dce6fb67491fa)

#### [v2.8.1](https://github.com/microsoft/devicescript/compare/v2.8.0...v2.8.1)

> 27 April 2023

- indicate what user program is run; also more debug logging [`4d7617b`](https://github.com/microsoft/devicescript/commit/4d7617b776b3987ae5998f30235b61b29de0aca7)
- update jd-c/ts [`7ccd32a`](https://github.com/microsoft/devicescript/commit/7ccd32a0a31eb0fe4d45af067831054d9b2ac212)
- use correct APIs for frame reception when hosted [`65b0c53`](https://github.com/microsoft/devicescript/commit/65b0c5302d5433422345f456a5988fbde4b287ff)

#### [v2.8.0](https://github.com/microsoft/devicescript/compare/v2.7.11...v2.8.0)

> 27 April 2023

- add devNetwork dcfg flag [`ef3036c`](https://github.com/microsoft/devicescript/commit/ef3036c1a26c362ba14eb9703c011f972b62387e)
- fix build [`5cc7a31`](https://github.com/microsoft/devicescript/commit/5cc7a31137cc99b9c78738f3678a77765cb80a0a)

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

- fix zx syntax [`6ff9b87`](https://github.com/microsoft/devicescript/commit/6ff9b87c18d7d4e7c78f1de5d4c3bf4028a165eb)
- other attempt using env var [`aff3283`](https://github.com/microsoft/devicescript/commit/aff328364a34481a07b298cb50b1aceffe47e635)

#### [v2.7.7](https://github.com/microsoft/devicescript/compare/v2.7.4...v2.7.7)

> 26 April 2023

- updatd support link [`adae14b`](https://github.com/microsoft/devicescript/commit/adae14bb78756ad9a92833c88f42778f17d8065e)
- check env before running build [`1bfb701`](https://github.com/microsoft/devicescript/commit/1bfb701aeeab6534f3ca7e857de574ac20dca3cd)
- use correct name [`ddd01ca`](https://github.com/microsoft/devicescript/commit/ddd01cab799da20635ba43c91497b7e45bd3f4fd)

#### [v2.7.4](https://github.com/microsoft/devicescript/compare/v2.7.3...v2.7.4)

> 26 April 2023

- add tags [`e7227fa`](https://github.com/microsoft/devicescript/commit/e7227fa20827ebdec4382112d16446507938bbe7)
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

#### [v2.5.0](https://github.com/microsoft/devicescript/compare/v2.4.4...v2.5.0)

> 14 April 2023

- initial work on UTF8 strings [`747d802`](https://github.com/microsoft/devicescript/commit/747d802196ff62d07bfae199fcfdb1865efaf4f6)
- Add String.join() [`487f1ee`](https://github.com/microsoft/devicescript/commit/487f1ee2f351d1de4620f963d360303a9e2f04e3)
- Add String.fromCharCode() [`6d427f0`](https://github.com/microsoft/devicescript/commit/6d427f07c80e99d518832c3f0d6e77fe8c3011be)

#### [v2.4.4](https://github.com/microsoft/devicescript/compare/v2.4.3...v2.4.4)

> 11 April 2023

- fixes for allocation sizes [`c2cafd4`](https://github.com/microsoft/devicescript/commit/c2cafd4722b2e237378aac1f35992d7acb7a4477)

#### [v2.4.3](https://github.com/microsoft/devicescript/compare/v2.4.2...v2.4.3)

> 11 April 2023

- implement assignment chaining; fixes #339 [`#339`](https://github.com/microsoft/devicescript/issues/339)
- add compiler-everything test; fix sources; fixes #268 [`#268`](https://github.com/microsoft/devicescript/issues/268)
- throttle setInterval() with async; fixes #289 [`#289`](https://github.com/microsoft/devicescript/issues/289)
- re-generate board files (new repo names) [`de6a906`](https://github.com/microsoft/devicescript/commit/de6a90631cbf6e28fb56d8f9bf85f12e7d4ffe42)
- add adafruit feather s2 [`4b9c909`](https://github.com/microsoft/devicescript/commit/4b9c90977e90b90b1046dd17f018dd3c40d9ce6b)
- limit call stack depth [`7319b6f`](https://github.com/microsoft/devicescript/commit/7319b6fb5116881162a79484ac2e8992282fcbdf)

#### [v2.4.2](https://github.com/microsoft/devicescript/compare/v2.4.1...v2.4.2)

> 11 April 2023

- add xiao c3 board [`c694cbc`](https://github.com/microsoft/devicescript/commit/c694cbccb6669555837e069250ee83c454da6149)
- add globals in debugger [`6ad0952`](https://github.com/microsoft/devicescript/commit/6ad095221c177470a86222bd03ad9b84c6ca78a9)
- add missing pull [`17a78f9`](https://github.com/microsoft/devicescript/commit/17a78f92e4c2f730d577b970722f67b8888cff04)

#### [v2.4.1](https://github.com/microsoft/devicescript/compare/v2.4.0...v2.4.1)

> 10 April 2023

- fix auto-imports and plugin; 2.4.1 [`e3ff69f`](https://github.com/microsoft/devicescript/commit/e3ff69f8f782037c80215762a48e18b99ccb6241)
- update jd-c [`04a8ef5`](https://github.com/microsoft/devicescript/commit/04a8ef58e23ff3680039634e9c2ff4060b582f01)

#### [v2.4.0](https://github.com/microsoft/devicescript/compare/v2.3.4...v2.4.0)

> 10 April 2023

- allow Jacdac servers implemented in TS [`#335`](https://github.com/microsoft/devicescript/pull/335)
- updated samples [`0a3244e`](https://github.com/microsoft/devicescript/commit/0a3244e9ff61e1ebe809a50b1a70c98ba36b5d41)
- updated gateway docs [`c2b57b9`](https://github.com/microsoft/devicescript/commit/c2b57b92b7a0ebb2fc0fce5547171c54f73c8d49)
- add sensor server; 2.4.0 [`7989afe`](https://github.com/microsoft/devicescript/commit/7989afe8eff16d1c0adb159bdd65e77d70ddee0a)

#### [v2.3.4](https://github.com/microsoft/devicescript/compare/v2.3.3...v2.3.4)

> 4 April 2023

- show watches in debug mode, cleanout context on unload [`3e5a42b`](https://github.com/microsoft/devicescript/commit/3e5a42b881209ddafa7966765a7ec996c002e8a1)
- handle "run" to open simulators view [`e56c704`](https://github.com/microsoft/devicescript/commit/e56c704ce9b2225f0e2e83719e70e3a0fc2695e6)
- add console data image [`5d3cba1`](https://github.com/microsoft/devicescript/commit/5d3cba1e2b1cf3f247c3381aea46717776634070)

#### [v2.3.3](https://github.com/microsoft/devicescript/compare/v2.3.2...v2.3.3)

> 4 April 2023

- updated generated notebook [`d3953a0`](https://github.com/microsoft/devicescript/commit/d3953a0487ee9cdbfd90ba41a63fade9b5fe027b)

#### [v2.3.2](https://github.com/microsoft/devicescript/compare/v2.3.1...v2.3.2)

> 4 April 2023

- add notebook [`0d769cd`](https://github.com/microsoft/devicescript/commit/0d769cdb7262288e8e6c1ff997587dfbd36ca95e)
- fix: support for generating note [`fbe4dd6`](https://github.com/microsoft/devicescript/commit/fbe4dd6c3f76c45b5edbfec40602f39a94604620)
- updated suggested extensions [`8d7e80f`](https://github.com/microsoft/devicescript/commit/8d7e80f44ea42cf846b42baef55e44f4c0198f52)

#### [v2.3.1](https://github.com/microsoft/devicescript/compare/v2.3.0...v2.3.1)

> 4 April 2023

- updated cloud docs [`424eb0e`](https://github.com/microsoft/devicescript/commit/424eb0e07c0b5261cb9a098e59f2baabea7eaea0)
- reorg data recorder [`86e4331`](https://github.com/microsoft/devicescript/commit/86e433169c7d12bd8a7b97eeedfc244b70014e51)
- add esp blinky [`d2bf9e0`](https://github.com/microsoft/devicescript/commit/d2bf9e01b48d862450f7678399efc640d89f0876)

#### [v2.3.0](https://github.com/microsoft/devicescript/compare/v2.2.29...v2.3.0)

> 1 April 2023

- copy-paste sample [`3a0a5cf`](https://github.com/microsoft/devicescript/commit/3a0a5cffe55443248bf2a772782007afc457212d)
- better insertion logic [`06ed399`](https://github.com/microsoft/devicescript/commit/06ed39932e9b2b84d5be16856307715745ff416a)
- add toggle on lightbulb [`bfd25a4`](https://github.com/microsoft/devicescript/commit/bfd25a43c7e45bbeacc544c7adc30f9c3a44305f)

#### [v2.2.29](https://github.com/microsoft/devicescript/compare/v2.2.28...v2.2.29)

> 1 April 2023

- organize peripherical docs [`405d77c`](https://github.com/microsoft/devicescript/commit/405d77ccd99e38780b7b3b30ed163eafbfd7a0ea)
- adding new hid keyboard sample [`9fc249e`](https://github.com/microsoft/devicescript/commit/9fc249e8037753b6284350804677cd61e7bf5d6a)
- add samples [`885e08e`](https://github.com/microsoft/devicescript/commit/885e08e47ea9d88d248060fa2ffb4ba423c98546)

#### [v2.2.28](https://github.com/microsoft/devicescript/compare/v2.2.27...v2.2.28)

> 31 March 2023

- missing legal stuff [`70d704a`](https://github.com/microsoft/devicescript/commit/70d704aed9b185cc4a71168c5af67f98168f0ad3)
- moving packages out of vscode [`f356fbb`](https://github.com/microsoft/devicescript/commit/f356fbb6cad680a947487bc513e1ec32d0626e59)
- updated link [`8b93bd9`](https://github.com/microsoft/devicescript/commit/8b93bd95871b5ec4b28fe44ddcc3cf4263e2883f)

#### [v2.2.27](https://github.com/microsoft/devicescript/compare/v2.2.26...v2.2.27)

> 31 March 2023

- attempt at fixing publshing [`a2db8e2`](https://github.com/microsoft/devicescript/commit/a2db8e2516e52e9be7530f1f50bf8ae025548d9b)

#### [v2.2.26](https://github.com/microsoft/devicescript/compare/v2.2.24...v2.2.26)

> 31 March 2023

- add video to home screen [`f655de2`](https://github.com/microsoft/devicescript/commit/f655de2533121e5b679b0b0b6184286704e2c11f)
- fix observables tests [`238de35`](https://github.com/microsoft/devicescript/commit/238de35cca343be5375f8924ce888dfc0463e01f)
- try yarn publish [`7a89f1e`](https://github.com/microsoft/devicescript/commit/7a89f1e5568c906014f07b5c94892a7cf1fc3760)

#### [v2.2.24](https://github.com/microsoft/devicescript/compare/v2.2.22...v2.2.24)

> 31 March 2023

- fix: package of depdencies in vscode extension [`4a38ede`](https://github.com/microsoft/devicescript/commit/4a38ede443367a1d45b7a19a8823db2c19bd16c7)
- fix bump.js [`916c820`](https://github.com/microsoft/devicescript/commit/916c820db2ac90430504140af5ab9328d7c4b974)

#### [v2.2.22](https://github.com/microsoft/devicescript/compare/v2.2.21...v2.2.22)

> 31 March 2023

- fix: build vsix after patching resources [`53ba99e`](https://github.com/microsoft/devicescript/commit/53ba99eeb516fd50067826abe28b71f37f17870a)
- updated output channel name [`0fd9cd3`](https://github.com/microsoft/devicescript/commit/0fd9cd3624ddf70f2b3a126f83b6b7d5fa19d59f)

#### [v2.2.21](https://github.com/microsoft/devicescript/compare/v2.2.20...v2.2.21)

> 31 March 2023

- fix: start devs when opening an entry point and not running [`538ddf4`](https://github.com/microsoft/devicescript/commit/538ddf409c0d7cd0a7f9ca5f83e7a55b15674b77)
- sort boards and hide protos in non-developer mode [`3402616`](https://github.com/microsoft/devicescript/commit/3402616406f35289b05b1b06a2871e9ea4f96d06)
- Update README.md [`ba16684`](https://github.com/microsoft/devicescript/commit/ba16684aa11d67bf9c8cb683a1aec6c94ba82575)

#### [v2.2.20](https://github.com/microsoft/devicescript/compare/v2.2.19...v2.2.20)

> 30 March 2023

- Developer mode [`#308`](https://github.com/microsoft/devicescript/pull/308)
- docs updates [`ed55aff`](https://github.com/microsoft/devicescript/commit/ed55aff5a6345f178567673ce40c1f5fa3d9f807)
- more server docs [`a73f1cf`](https://github.com/microsoft/devicescript/commit/a73f1cf2acd9e6bd6e4c3d127bd0dceaa7f57150)
- remove Condition (we now have Fiber.suspend etc) [`054cd29`](https://github.com/microsoft/devicescript/commit/054cd29355fe957248c503999b80346b798f2dc7)

#### [v2.2.19](https://github.com/microsoft/devicescript/compare/v2.2.18...v2.2.19)

> 29 March 2023

- sync subscribe in observables [`#298`](https://github.com/microsoft/devicescript/pull/298)
- gateway connection message [`685aaa2`](https://github.com/microsoft/devicescript/commit/685aaa28ede16a1c402c95528977abf008b6c6c2)

#### [v2.2.18](https://github.com/microsoft/devicescript/compare/v2.2.16...v2.2.18)

> 29 March 2023

- fix: @devicescript/cloud dependencies [`51dbf67`](https://github.com/microsoft/devicescript/commit/51dbf67c04f8e8a30eb0295863d6b3eb39cd6d96)
- observable docs [`77b4280`](https://github.com/microsoft/devicescript/commit/77b4280b480656ab45dfe935e5ae6bc00a373666)
- add test as a devdependency [`a5f8652`](https://github.com/microsoft/devicescript/commit/a5f865227f79ac739ec52ed7687586a857038780)

#### [v2.2.16](https://github.com/microsoft/devicescript/compare/v2.2.15...v2.2.16)

> 29 March 2023

- better handling of initial connection [`5f2e2e3`](https://github.com/microsoft/devicescript/commit/5f2e2e32097901d9e3c6331a5d3e2f3ed23255ce)
- clear token with api root [`9f11372`](https://github.com/microsoft/devicescript/commit/9f1137224150116f805a18f27d6e7bf0718746ff)
- duplicate copy button [`89f52e6`](https://github.com/microsoft/devicescript/commit/89f52e645120b772173c5ff22331ce32370da556)

#### [v2.2.15](https://github.com/microsoft/devicescript/compare/v2.2.14...v2.2.15)

> 29 March 2023

- vscode should not reference compiler [`d3ab38b`](https://github.com/microsoft/devicescript/commit/d3ab38b3bdfd5426a7930f638afaf9d1cf8f7bf3)
- fix jacdac-c? [`b1c5d32`](https://github.com/microsoft/devicescript/commit/b1c5d324ae9235cccce855311737b632f689175e)

#### [v2.2.14](https://github.com/microsoft/devicescript/compare/v2.2.13...v2.2.14)

> 29 March 2023

- introduce hash in dcfg; restart when it changes [`63937b7`](https://github.com/microsoft/devicescript/commit/63937b7b06733e10256d247e64c52ac399d5fb61)
- rename progName/Version fields to @name/@version [`8f37511`](https://github.com/microsoft/devicescript/commit/8f37511605d13b22f9c0747633be885412cf26ad)
- debug fixes; 2.2.14 [`11eeea6`](https://github.com/microsoft/devicescript/commit/11eeea627ba8e293a62fe6f504a102ecef6c1eba)

#### [v2.2.13](https://github.com/microsoft/devicescript/compare/v2.2.12...v2.2.13)

> 28 March 2023

- fix: add json5 [`#186`](https://github.com/microsoft/devicescript/pull/186)
- ds.reboot()-&gt;ds.restart(); ds.reboot() now reboots [`e43fd0a`](https://github.com/microsoft/devicescript/commit/e43fd0a2a0c08798879cb3f1a04eea71f0c8561b)
- corrrectly display data [`832aae0`](https://github.com/microsoft/devicescript/commit/832aae028933953bf43921f043e0144ea533224e)
- save file to 'data', normalize time to seconds [`0482692`](https://github.com/microsoft/devicescript/commit/0482692d707278c351bed7eead5e59511aae6fe0)

#### [v2.2.12](https://github.com/microsoft/devicescript/compare/v2.2.11...v2.2.12)

> 28 March 2023

- automtic data output parsing [`8843f24`](https://github.com/microsoft/devicescript/commit/8843f2424a72f0ee33e823f4e6bab8f3c51336ac)
- docs update [`961dbc5`](https://github.com/microsoft/devicescript/commit/961dbc543b7351a2a27f5557328a532d0fdacbdf)
- updated docs [`e141d74`](https://github.com/microsoft/devicescript/commit/e141d7413132f7d5afc0fc5e89ada842b01cf063)

#### [v2.2.11](https://github.com/microsoft/devicescript/compare/v2.2.10...v2.2.11)

> 28 March 2023

- use fspath in file context [`2b06715`](https://github.com/microsoft/devicescript/commit/2b06715ac9f26f5ff91ea9f2190a02de27dc602b)
- faster initial devtools connect [`dd31946`](https://github.com/microsoft/devicescript/commit/dd319467d9f304c63c2ff1ab7b6d535b04ee0339)
- updated jacdac-ts [`5db40ff`](https://github.com/microsoft/devicescript/commit/5db40ff7d9817ed7c9765afc79eb2d2f750bdf71)

#### [v2.2.10](https://github.com/microsoft/devicescript/compare/v2.2.9...v2.2.10)

> 27 March 2023

- cheesy homepage [`6da6dfa`](https://github.com/microsoft/devicescript/commit/6da6dfa364f0eb44afffd484457fbb44aca153c5)
- fix: don't ask for workspace folder if only one [`7d327ce`](https://github.com/microsoft/devicescript/commit/7d327cebc10c35ddc7f7a2dd9b6888e1f776e843)

#### [v2.2.8](https://github.com/microsoft/devicescript/compare/v2.2.6...v2.2.8)

> 27 March 2023

- add update-notifier library [`#244`](https://github.com/microsoft/devicescript/pull/244)
- add language docs [`11f0ce1`](https://github.com/microsoft/devicescript/commit/11f0ce113f6442baa3ed1e398da4c8e560d78433)
- level detector [`634edbc`](https://github.com/microsoft/devicescript/commit/634edbc36c4c475ae487ce9d73ed366be8eb7bb6)
- more on fibers [`fcd4459`](https://github.com/microsoft/devicescript/commit/fcd4459ad2a89c2dcc4b9e64e3ab23c31e42c698)

#### [v2.2.6](https://github.com/microsoft/devicescript/compare/v2.2.5...v2.2.6)

> 27 March 2023

- updated docs [`4347b04`](https://github.com/microsoft/devicescript/commit/4347b04c91569ed21da3d28b1c1853a97515b3a8)
- added some links [`39d51af`](https://github.com/microsoft/devicescript/commit/39d51afeb2b2fc685cc32b983ca229950dca039d)
- updated readme [`c7ac873`](https://github.com/microsoft/devicescript/commit/c7ac8732a43fc80d03dfd29fcc3e79ffd6bd51b6)

#### [v2.2.5](https://github.com/microsoft/devicescript/compare/v2.2.4...v2.2.5)

> 27 March 2023

- don't use activetexteditor [`#279`](https://github.com/microsoft/devicescript/pull/279)
- use observable streams instead [`#272`](https://github.com/microsoft/devicescript/pull/272)
- Configure hw [`#270`](https://github.com/microsoft/devicescript/pull/270)
- I2c package [`#267`](https://github.com/microsoft/devicescript/pull/267)
- I2c documentation [`#263`](https://github.com/microsoft/devicescript/pull/263)
- implement object inspection; fixes #275 [`#275`](https://github.com/microsoft/devicescript/issues/275)
- add startServer() wizard; fixes #258 [`#258`](https://github.com/microsoft/devicescript/issues/258)
- fix #277 (dbg crash) [`#277`](https://github.com/microsoft/devicescript/issues/277)
- add buzzer and dimmable light bulb [`4e37c9a`](https://github.com/microsoft/devicescript/commit/4e37c9a538b75c2f40ac7fcfcefa3be9cb5d9a88)
- catchError support [`83d63a1`](https://github.com/microsoft/devicescript/commit/83d63a164c1e459a6b431e8a600e63ecd1d51110)
- fix: start sim auto on debug if no debice connected [`116ead5`](https://github.com/microsoft/devicescript/commit/116ead56c17af38c404c30a60ff33f188407f149)

#### [v2.2.4](https://github.com/microsoft/devicescript/compare/v2.2.3...v2.2.4)

> 24 March 2023

- fix windows build [`#266`](https://github.com/microsoft/devicescript/pull/266)
- use telemetry for showError messages [`#264`](https://github.com/microsoft/devicescript/pull/264)
- I2c reg buf [`#254`](https://github.com/microsoft/devicescript/pull/254)
- add new functions [`#253`](https://github.com/microsoft/devicescript/pull/253)
- Register observable [`#252`](https://github.com/microsoft/devicescript/pull/252)
- fix #259 [`#259`](https://github.com/microsoft/devicescript/issues/259)
- add race observable [`df9a232`](https://github.com/microsoft/devicescript/commit/df9a232d9a5ffa39ecec5cba132c6526a1c4a643)
- fix new project [`9f8d99f`](https://github.com/microsoft/devicescript/commit/9f8d99f45578f838e3a619258acdc672959e1fe6)
- add logging on folder issue [`14f6749`](https://github.com/microsoft/devicescript/commit/14f6749c1a02f6414d1402f4ca9d87d50f3f1eff)

#### [v2.2.3](https://github.com/microsoft/devicescript/compare/v2.2.2...v2.2.3)

> 24 March 2023

- add lightbulb [`7d61ed0`](https://github.com/microsoft/devicescript/commit/7d61ed060ce3cb53279f4e09a3824f69265625cb)
- windows breakpoint fix [`60d9856`](https://github.com/microsoft/devicescript/commit/60d985626a589838ef9d3e108460c2b31278cba7)

#### [v2.2.2](https://github.com/microsoft/devicescript/compare/v2.2.1...v2.2.2)

> 24 March 2023

- added new sample [`9c9b829`](https://github.com/microsoft/devicescript/commit/9c9b82957fea0774a09982c2b25110cf4799d03d)
- work on sample [`f35e0b9`](https://github.com/microsoft/devicescript/commit/f35e0b95fbacbb864f994f8518bed47832b247f5)

#### [v2.2.1](https://github.com/microsoft/devicescript/compare/v2.2.0...v2.2.1)

> 23 March 2023

- try to fix debug paths [`31d7669`](https://github.com/microsoft/devicescript/commit/31d7669f6da6836b714112158ee51d2a08ee8ccb)
- more logging [`bb6ce05`](https://github.com/microsoft/devicescript/commit/bb6ce05898167c770e7d168df260c631a68ecb0c)

#### [v2.2.0](https://github.com/microsoft/devicescript/compare/v2.1.0...v2.2.0)

> 23 March 2023

- Settings [`#251`](https://github.com/microsoft/devicescript/pull/251)
- use fiber suspend in setTimeout(); v2.2.0 [`ba3b780`](https://github.com/microsoft/devicescript/commit/ba3b780c61f778ee2c69f8b76970e6efcb1deb80)
- don't run git commands if no .git folder [`830bceb`](https://github.com/microsoft/devicescript/commit/830bcebeaa7a3e371a247f661206cd4e1e478fe8)
- implement debug pause button [`4fbe25d`](https://github.com/microsoft/devicescript/commit/4fbe25d6403d63bac535f0957bdce8623c7b0c18)

#### [v2.1.0](https://github.com/microsoft/devicescript/compare/v2.0.9...v2.1.0)

> 23 March 2023

- add Buffer.from(); also hex toString(); v2.1.0 [`1203283`](https://github.com/microsoft/devicescript/commit/12032837b00407537b7f90e90d93ed48db2ee565)
- simplify bump [`0db3c27`](https://github.com/microsoft/devicescript/commit/0db3c27b7d1af95f904885dc6f5d30d0500f0dc9)

#### [v2.0.9](https://github.com/microsoft/devicescript/compare/v2.0.8...v2.0.9)

> 23 March 2023

- add native clear-settings; fixes #240 [`#240`](https://github.com/microsoft/devicescript/issues/240)
- feat: pir, rolling average [`b12290c`](https://github.com/microsoft/devicescript/commit/b12290cfa368cacce2f422d6f7518631938bd3bd)
- fix: added emwa [`be56296`](https://github.com/microsoft/devicescript/commit/be56296ee48df6e71f51d8d18369da1d099f98e5)
- set version in npms, publish extension [`e6a398d`](https://github.com/microsoft/devicescript/commit/e6a398dfaa9706cf0d396fabf7a6999bec959615)

#### [v2.0.8](https://github.com/microsoft/devicescript/compare/v2.0.7...v2.0.8)

> 22 March 2023

- add analog docs [`61d3c21`](https://github.com/microsoft/devicescript/commit/61d3c214e88c1b7133e893189157254ab78ef90b)
- bump jd-c [`c51e9aa`](https://github.com/microsoft/devicescript/commit/c51e9aa8e56e7d93b9da2447abc147d4d9b307c1)

#### [v2.0.7](https://github.com/microsoft/devicescript/compare/v2.0.6...v2.0.7)

> 22 March 2023

- build before publish [`e9e7ee3`](https://github.com/microsoft/devicescript/commit/e9e7ee34ced4cd0e57376d4ebd62c85c9dc5d9db)

#### [v2.0.6](https://github.com/microsoft/devicescript/compare/v2.0.5...v2.0.6)

> 22 March 2023

- improve esptool detection [`113a590`](https://github.com/microsoft/devicescript/commit/113a590d60f86490f52231228e3f32be76c9be13)
- fix 'devs flash esp32 --board xyz' [`f8d05c0`](https://github.com/microsoft/devicescript/commit/f8d05c09cc32e466eb825497e3e825858c666256)
- generate meta files with sizes [`4c9fa0b`](https://github.com/microsoft/devicescript/commit/4c9fa0b2121ac6dfcb40e4d930837674848fa1a4)

#### [v2.0.5](https://github.com/microsoft/devicescript/compare/v2.0.4...v2.0.5)

> 22 March 2023

- Clear flash UI [`#241`](https://github.com/microsoft/devicescript/pull/241)
- docs about vscode [`acccdbd`](https://github.com/microsoft/devicescript/commit/acccdbd36dc3494f06f0928f7aebd6b60ae6c277)
- initial i2c list [`d879979`](https://github.com/microsoft/devicescript/commit/d8799793b7de0b3443c04c52ebf43dd5cef16bf8)
- relative path generation [`d8c2026`](https://github.com/microsoft/devicescript/commit/d8c20269df08a081e80c53ecbc3330b9b59e9a38)

#### [v2.0.4](https://github.com/microsoft/devicescript/compare/v2.0.3...v2.0.4)

> 21 March 2023

- add Module.clearFlash(); fixes #240 [`#240`](https://github.com/microsoft/devicescript/issues/240)
- re-generate boards.json; bump jd-c [`807735a`](https://github.com/microsoft/devicescript/commit/807735a1b59eb880fd778c32c58a73494cc3f47d)
- fix no wifi build [`c632efc`](https://github.com/microsoft/devicescript/commit/c632efc4ab98f54a226d9d9d3c03daaa1dc39f7b)
- add hid sample [`2ace987`](https://github.com/microsoft/devicescript/commit/2ace98777370ca830b4e742027d061a8ff3aff06)

#### [v2.0.3](https://github.com/microsoft/devicescript/compare/v2.0.2...v2.0.3)

> 21 March 2023

- fix: beforeeach, aftereach in tests [`8a49c33`](https://github.com/microsoft/devicescript/commit/8a49c33e10db05fdd02025b27a23be9ca11bd1a3)
- try to fix npm 402 [`f1c9551`](https://github.com/microsoft/devicescript/commit/f1c9551a3c41e9ffd0809b40b84f1fed7c3240de)
- don't build C if tools not installed [`8dbeeae`](https://github.com/microsoft/devicescript/commit/8dbeeaead6f0bc7958a20bbe8aecc71f6d8e55a5)

#### [v2.0.2](https://github.com/microsoft/devicescript/compare/v2.0.1...v2.0.2)

> 21 March 2023

- try fixing npm publish [`15b4cf1`](https://github.com/microsoft/devicescript/commit/15b4cf1b69166127fc4db7b99d4bf92a9dda5fb1)

### [v2.0.1](https://github.com/microsoft/devicescript/compare/v0.0.1...v2.0.1)

> 21 March 2023

- synchronized bump script [`#238`](https://github.com/microsoft/devicescript/pull/238)
- fix: replace * with ^version in packaged files [`#236`](https://github.com/microsoft/devicescript/pull/236)
- fix: hide commands when no workspace [`9780b90`](https://github.com/microsoft/devicescript/commit/9780b90d6b07ed39f9bd7d0ff430ac3bf9a614f5)
- fixing server docs [`84d44cd`](https://github.com/microsoft/devicescript/commit/84d44cdae775f7ae78b80112d8074de521b019dd)
- docs [`7da487b`](https://github.com/microsoft/devicescript/commit/7da487b62cc1063644c3686abf78341e29583ab3)

#### v0.0.1

> 18 March 2023

- fix: ability to open socket streaming device logging [`#230`](https://github.com/microsoft/devicescript/pull/230)
- fix: update trackException [`#226`](https://github.com/microsoft/devicescript/pull/226)
- fix: cleaning out role.connected [`#195`](https://github.com/microsoft/devicescript/pull/195)
- feat: cloud api package [`#193`](https://github.com/microsoft/devicescript/pull/193)
- add marble rendering [`#190`](https://github.com/microsoft/devicescript/pull/190)
- cloud simplification [`#187`](https://github.com/microsoft/devicescript/pull/187)
- cleanup container experience [`#172`](https://github.com/microsoft/devicescript/pull/172)
- pass over doc [`#145`](https://github.com/microsoft/devicescript/pull/145)
- fix: use vscode built-in file system watcher [`#159`](https://github.com/microsoft/devicescript/pull/159)
- start building on load extension [`#157`](https://github.com/microsoft/devicescript/pull/157)
- fix: start build on start, update specs [`#155`](https://github.com/microsoft/devicescript/pull/155)
- feat: node.js simulation support [`#154`](https://github.com/microsoft/devicescript/pull/154)
- feat: add board command [`#152`](https://github.com/microsoft/devicescript/pull/152)
- flash device as palette command [`#146`](https://github.com/microsoft/devicescript/pull/146)
- feat: Custom service compilation [`#143`](https://github.com/microsoft/devicescript/pull/143)
- Catalog [`#144`](https://github.com/microsoft/devicescript/pull/144)
- feat: support --install flag in init [`#142`](https://github.com/microsoft/devicescript/pull/142)
- feat: no-colors mode [`#140`](https://github.com/microsoft/devicescript/pull/140)
- cloud tree items [`#135`](https://github.com/microsoft/devicescript/pull/135)
- fix: tree unsubscription [`#131`](https://github.com/microsoft/devicescript/pull/131)
- fix: nag user to start dashboard on debugger start + missing roles [`#123`](https://github.com/microsoft/devicescript/pull/123)
- trying to fix [`#120`](https://github.com/microsoft/devicescript/pull/120)
- fix: stop vm worker on debug session close [`#118`](https://github.com/microsoft/devicescript/pull/118)
- more aggressive about killing worker [`#114`](https://github.com/microsoft/devicescript/pull/114)
- fix: telemetry + windows [`#104`](https://github.com/microsoft/devicescript/pull/104)
- fix: better support for empty workspace, remote [`#102`](https://github.com/microsoft/devicescript/pull/102)
- Docusaurus2.3 [`#91`](https://github.com/microsoft/devicescript/pull/91)
- fix: update cli info about build --watch [`#90`](https://github.com/microsoft/devicescript/pull/90)
- support for cloud management of devices [`#88`](https://github.com/microsoft/devicescript/pull/88)
- contribute icons to vscode [`#87`](https://github.com/microsoft/devicescript/pull/87)
- actively check version numbers + debugger start fix [`#76`](https://github.com/microsoft/devicescript/pull/76)
- Device pick and remember [`#62`](https://github.com/microsoft/devicescript/pull/62)
- devtools cli refactor [`#61`](https://github.com/microsoft/devicescript/pull/61)
- Device Tree in VS Code [`#60`](https://github.com/microsoft/devicescript/pull/60)
- more tooling support through rise4fun [`#57`](https://github.com/microsoft/devicescript/pull/57)
- patch: document vm apis [`#52`](https://github.com/microsoft/devicescript/pull/52)
- patch: support for runtime_version [`#51`](https://github.com/microsoft/devicescript/pull/51)
- add runtime version reg [`#44`](https://github.com/microsoft/devicescript/pull/44)
- Api comments [`#50`](https://github.com/microsoft/devicescript/pull/50)
- patch: rename registernumber [`#49`](https://github.com/microsoft/devicescript/pull/49)
- patch: concurrent execution of compiles [`#42`](https://github.com/microsoft/devicescript/pull/42)
- Markdown docs: generate markdown files for DS services [`#38`](https://github.com/microsoft/devicescript/pull/38)
- test breaking build [`#37`](https://github.com/microsoft/devicescript/pull/37)
- patch: rename generate compiler files [`#30`](https://github.com/microsoft/devicescript/pull/30)
- fix: codesandbox support [`#29`](https://github.com/microsoft/devicescript/pull/29)
- patch: specify to embed built files in package [`#24`](https://github.com/microsoft/devicescript/pull/24)
- feat: support for init command [`#23`](https://github.com/microsoft/devicescript/pull/23)
- better control of simulator in docs [`#22`](https://github.com/microsoft/devicescript/pull/22)
- patch: add devtools options [`#21`](https://github.com/microsoft/devicescript/pull/21)
- patch: build --watch [`#20`](https://github.com/microsoft/devicescript/pull/20)
- add semantic release build files [`#19`](https://github.com/microsoft/devicescript/pull/19)
- Const samples [`#17`](https://github.com/microsoft/devicescript/pull/17)
- Removing monaco editor [`#14`](https://github.com/microsoft/devicescript/pull/14)
- show jacdac dasboard as split pane [`#13`](https://github.com/microsoft/devicescript/pull/13)
- cleaning up cli [`#12`](https://github.com/microsoft/devicescript/pull/12)
- export compile function [`#11`](https://github.com/microsoft/devicescript/pull/11)
- build compiler into web site [`#10`](https://github.com/microsoft/devicescript/pull/10)
- pre-compile samples in docs [`#5`](https://github.com/microsoft/devicescript/pull/5)
- support for mermaid for docs [`#3`](https://github.com/microsoft/devicescript/pull/3)
- creating docs web site [`#2`](https://github.com/microsoft/devicescript/pull/2)
- support ignored &&; fixes #184 [`#184`](https://github.com/microsoft/devicescript/issues/184)
- isConnected -&gt; isBound; fixes #196 [`#196`](https://github.com/microsoft/devicescript/issues/196)
- better start server docs; fixes #215 [`#215`](https://github.com/microsoft/devicescript/issues/215)
- sleepMs-&gt;sleep; fixes #214 [`#214`](https://github.com/microsoft/devicescript/issues/214)
- fix pointer checks; fixes #203 [`#203`](https://github.com/microsoft/devicescript/issues/203)
- add ds.isSimulator(); fixes #119 [`#119`](https://github.com/microsoft/devicescript/issues/119)
- support for program name/version; fixes #170 [`#170`](https://github.com/microsoft/devicescript/issues/170)
- fix #199 (super call) [`#199`](https://github.com/microsoft/devicescript/issues/199)
- disallow 'var'; fixes #4 [`#4`](https://github.com/microsoft/devicescript/issues/4)
- remove _onstart; fixes #183 [`#183`](https://github.com/microsoft/devicescript/issues/183)
- fix 'extends Error'; fixes #176 [`#176`](https://github.com/microsoft/devicescript/issues/176)
- don't mask exception from compilation process [`#171`](https://github.com/microsoft/devicescript/issues/171)
- add --quiet option, fix #166 [`#166`](https://github.com/microsoft/devicescript/issues/166)
- cut down devs init, add devs add sim/service; fixes #165 [`#165`](https://github.com/microsoft/devicescript/issues/165)
- always use fancy logging; fixes #103 [`#103`](https://github.com/microsoft/devicescript/issues/103)
- rename devices, fix #77 [`#77`](https://github.com/microsoft/devicescript/issues/77)
- try to fix cli deps; fixes #70 [`#70`](https://github.com/microsoft/devicescript/issues/70)
- better error object (fixes #15) [`#15`](https://github.com/microsoft/devicescript/issues/15)
- remove junk; fixes #16 [`#16`](https://github.com/microsoft/devicescript/issues/16)
- moving projects around [`2e25a9c`](https://github.com/microsoft/devicescript/commit/2e25a9c1ee5633c232a070dc2d2643d24f6ac783)
- more docs updates [`2b61362`](https://github.com/microsoft/devicescript/commit/2b61362b6d606b2a4f543c397f665df4492ea5dd)
- refactor and hide pipe for now [`dd04b26`](https://github.com/microsoft/devicescript/commit/dd04b265f78e1abca8d1cae8b80adee79bb54b96)
