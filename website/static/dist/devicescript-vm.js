
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(config) {
  var Module = config || {};



// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != 'undefined' ? Module : {};

// See https://caniuse.com/mdn-javascript_builtins_object_assign

// See https://caniuse.com/mdn-javascript_builtins_bigint64array

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});
["_malloc","_free","_jd_em_set_device_id_2x_i32","_jd_em_set_device_id_string","_jd_em_init","_jd_em_process","_jd_em_frame_received","_jd_em_devs_deploy","_jd_em_devs_verify","_jd_em_devs_client_deploy","_jd_em_devs_enable_gc_stress","_fflush","onRuntimeInitialized"].forEach((prop) => {
  if (!Object.getOwnPropertyDescriptor(Module['ready'], prop)) {
    Object.defineProperty(Module['ready'], prop, {
      get: () => abort('You are getting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
      set: () => abort('You are setting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
    });
  }
});

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
var devs_interval;
function copyToHeap(buf, fn) {
    const ptr = Module._malloc(buf.length);
    Module.HEAPU8.set(buf, ptr);
    const r = fn(ptr);
    Module._free(ptr);
    return r;
}
function bufferConcat(a, b) {
    const r = new Uint8Array(a.length + b.length);
    r.set(a, 0);
    r.set(b, a.length);
    return r;
}
var Exts;
(function (Exts) {
    /**
     * Debug output and stack traces are sent here.
     */
    Exts.dmesg = (s) => console.debug(s);
    /**
     * Logging function
     */
    Exts.log = console.log;
    /**
     * Error logging function
     */
    Exts.error = console.error;
    /**
     * Callback to invoke when a packet needs to be handled by the virtual machine
     * TODO: frame or packet?
     * @param pkt a Jacdac frame
     */
    function handlePacket(pkt) {
        copyToHeap(pkt, Module._jd_em_frame_received);
        Module._jd_em_process();
    }
    Exts.handlePacket = handlePacket;
    /**
     * Starts a packet transport over a TCP socket in a node.js application
     * @param require module resolution function, requires "net" package
     * @param host socket url host
     * @param port socket port
     */
    function setupNodeTcpSocketTransport(require, host, port) {
        return new Promise((resolve, reject) => {
            const net = require("net");
            let sock = null;
            const send = (data) => {
                const buf = new Uint8Array(1 + data.length);
                buf[0] = data.length;
                buf.set(data, 1);
                if (sock)
                    sock.write(buf);
            };
            const disconnect = (err) => {
                Module.log("disconnect", err === null || err === void 0 ? void 0 : err.message);
                if (sock)
                    try {
                        sock.end();
                    }
                    catch (_a) {
                    }
                    finally {
                        sock = undefined;
                    }
                if (resolve) {
                    resolve = null;
                    reject(new Error(`can't connect to ${host}:${port}`));
                }
            };
            const close = () => disconnect(undefined);
            Module["sendPacket"] = send;
            sock = net.createConnection(port, host, () => {
                Module.log(`connected to ${port}:${host}`);
                const f = resolve;
                if (f) {
                    resolve = null;
                    reject = null;
                    f({ close });
                }
            });
            sock.on("error", disconnect);
            sock.on("end", disconnect);
            sock.setNoDelay();
            let acc = null;
            sock.on("data", (buf) => {
                if (acc) {
                    buf = bufferConcat(acc, buf);
                    acc = null;
                }
                else {
                    buf = new Uint8Array(buf);
                }
                while (buf) {
                    const endp = buf[0] + 1;
                    if (buf.length >= endp) {
                        const pkt = buf.slice(1, endp);
                        if (buf.length > endp)
                            buf = buf.slice(endp);
                        else
                            buf = null;
                        Module.handlePacket(pkt);
                    }
                    else {
                        acc = buf;
                        buf = null;
                    }
                }
            });
        });
    }
    Exts.setupNodeTcpSocketTransport = setupNodeTcpSocketTransport;
    /**
     * Starts a packet transport over a WebSocket using arraybuffer binary type.
     * @param url socket url
     * @param port socket port
     */
    function setupWebsocketTransport(url, protocols) {
        return new Promise((resolve, reject) => {
            let sock = new WebSocket(url, protocols);
            sock.binaryType = "arraybuffer";
            const send = (data) => {
                if (sock && sock.readyState == WebSocket.OPEN) {
                    sock.send(data);
                    return 0;
                }
                else {
                    return -1;
                }
            };
            const disconnect = (err) => {
                Module.log("disconnect", err === null || err === void 0 ? void 0 : err.message);
                if (sock)
                    try {
                        sock.close();
                    }
                    catch (_a) {
                    }
                    finally {
                        sock = undefined;
                    }
                if (resolve) {
                    resolve = null;
                    reject(new Error(`can't connect to ${url}; ${err === null || err === void 0 ? void 0 : err.message}`));
                }
            };
            const close = () => disconnect(undefined);
            Module["sendPacket"] = send;
            sock.onopen = () => {
                Module.log(`connected to ${url}`);
                const f = resolve;
                if (f) {
                    resolve = null;
                    reject = null;
                    f({ close });
                }
            };
            sock.onerror = disconnect;
            sock.onclose = disconnect;
            sock.onmessage = ev => {
                const data = ev.data;
                if (typeof data == "string") {
                    Module.error("got string msg");
                    return;
                }
                else {
                    const pkt = new Uint8Array(ev.data);
                    Module.handlePacket(pkt);
                }
            };
        });
    }
    Exts.setupWebsocketTransport = setupWebsocketTransport;
    /**
     * Utility that converts a base64-encoded buffer into a Uint8Array
     * TODO: nobody is using this?
     * @param s
     * @returns
     */
    function b64ToBin(s) {
        s = atob(s);
        const r = new Uint8Array(s.length);
        for (let i = 0; i < s.length; ++i)
            r[i] = s.charCodeAt(i);
        return r;
    }
    Exts.b64ToBin = b64ToBin;
    /**
     * Deploys a DeviceScript bytecode to the virtual machine
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    function devsDeploy(binary) {
        return copyToHeap(binary, ptr => Module._jd_em_devs_deploy(ptr, binary.length));
    }
    Exts.devsDeploy = devsDeploy;
    /**
     * Verifies the format and version of the bytecode
     * @param binary DeviceScript bytecode
     * @returns error code, 0 if verification is successful
     */
    function devsVerify(binary) {
        return copyToHeap(binary, ptr => Module._jd_em_devs_verify(ptr, binary.length));
    }
    Exts.devsVerify = devsVerify;
    /**
     * Deploys to the first virtual machine on Jacdac stack (experimental)
     * @internal
     * @alpha
     * @param binary
     * @returns error code, 0 if deployment is successful
     */
    function devsClientDeploy(binary) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length);
        Module.HEAPU8.set(binary, ptr);
        return Module._jd_em_devs_client_deploy(ptr, binary.length);
    }
    Exts.devsClientDeploy = devsClientDeploy;
    /**
     * Initalises the virtual machine data structure.
     */
    function devsInit() {
        Module._jd_em_init();
    }
    Exts.devsInit = devsInit;
    /**
     * Enables/disables GC stress testing.
     */
    function devsGcStress(en) {
        Module._jd_em_devs_enable_gc_stress(en ? 1 : 0);
    }
    Exts.devsGcStress = devsGcStress;
    /**
     * Initializes and start the virtual machine (calls init).
     */
    function devsStart() {
        if (devs_interval)
            return;
        Module.devsInit();
        devs_interval = setInterval(() => {
            try {
                Module._jd_em_process();
            }
            catch (e) {
                Module.error(e);
                devsStop();
            }
        }, 10);
    }
    Exts.devsStart = devsStart;
    /**
     * Stops the virtual machine
     */
    function devsStop() {
        if (devs_interval) {
            clearInterval(devs_interval);
            devs_interval = undefined;
        }
    }
    Exts.devsStop = devsStop;
    /**
     * Indicates if the virtual machine is running
     * @returns true if the virtual machine is started.
     */
    function devsIsRunning() {
        return !!devs_interval;
    }
    Exts.devsIsRunning = devsIsRunning;
    /**
     * Specifices the virtual macine device id.
     * @remarks
     *
     * Must be called before `devsStart`.
     *
     * @param id0 a hex-encoded device id string or the first 32bit of the device id
     * @param id1 the second 32 bits of the device id, undefined if id0 is a string
     */
    function devsSetDeviceId(id0, id1) {
        if (devsIsRunning())
            throw new Error("cannot change deviceid while running");
        Module.devsInit();
        if (typeof id0 == "string") {
            if (id1 !== undefined)
                throw new Error("invalid arguments");
            const s = allocateUTF8(id0);
            Module._jd_em_set_device_id_string(s);
            Module._free(s);
        }
        else if (typeof id0 == "number" && typeof id1 == "number") {
            Module._jd_em_set_device_id_2x_i32(id0, id1);
        }
        else {
            throw new Error("invalid arguments");
        }
    }
    Exts.devsSetDeviceId = devsSetDeviceId;
})(Exts || (Exts = {}));
for (const kn of Object.keys(Exts)) {
    ;
    Module[kn] = Exts[kn];
}
function factory() {
    return null;
}
//# sourceMappingURL=wasmpre.js.map


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

// Normally we don't log exceptions but instead let them bubble out the top
// level where the embedding environment (e.g. the browser) can handle
// them.
// However under v8 and node we sometimes exit the process direcly in which case
// its up to use us to log the exception before exiting.
// If we fix https://github.com/emscripten-core/emscripten/issues/15080
// this may no longer be needed under node.
function logExceptionOnExit(e) {
  if (e instanceof ExitStatus) return;
  let toLog = e;
  if (e && typeof e == 'object' && e.stack) {
    toLog = [e, e.stack];
  }
  err('exiting due to exception: ' + toLog);
}

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');
  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js


read_ = (filename, binary) => {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    return binary ? ret : ret.toString();
  }
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return fs.readFileSync(filename, binary ? undefined : 'utf8');
};

readBinary = (filename) => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, onload, onerror) => {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    onload(ret);
  }
  // See the comment in the `read_` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  fs.readFile(filename, function(err, data) {
    if (err) onerror(err);
    else onload(data.buffer);
  });
};

// end include: node_shell_read.js
  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  // Without this older versions of node (< v15) will log unhandled rejections
  // but return 0, which is not normally the desired behaviour.  This is
  // not be needed with node v15 and about because it is now the default
  // behaviour:
  // See https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode
  process['on']('unhandledRejection', function(reason) { throw reason; });

  quit_ = (status, toThrow) => {
    if (keepRuntimeAlive()) {
      process['exitCode'] = status;
      throw toThrow;
    }
    logExceptionOnExit(toThrow);
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      const data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    let data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer == 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data == 'object');
    return data;
  };

  readAsync = function readAsync(f, onload, onerror) {
    setTimeout(() => onload(readBinary(f)), 0);
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit == 'function') {
    quit_ = (status, toThrow) => {
      logExceptionOnExit(toThrow);
      quit(status);
    };
  }

  if (typeof print != 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console == 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != 'undefined' ? printErr : print);
  }

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js


  read_ = (url) => {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }

  setWindowTitle = (title) => document.title = title;
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

if (Module['quit']) quit_ = Module['quit'];legacyModuleProp('quit', 'quit_');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('read', 'read_');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");

// include: support.js


var STACK_ALIGN = 16;
var POINTER_SIZE = 4;

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': case 'u8': return 1;
    case 'i16': case 'u16': return 2;
    case 'i32': case 'u32': return 4;
    case 'i64': case 'u64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return POINTER_SIZE;
      }
      if (type[0] === 'i') {
        const bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      }
      return 0;
    }
  }
}

// include: runtime_debug.js


function legacyModuleProp(prop, newName) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get: function() {
        abort('Module.' + prop + ' has been replaced with plain ' + newName + ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)');
      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort('`Module.' + prop + '` was supplied but `' + prop + '` not included in INCOMING_MODULE_JS_API');
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  Object.defineProperty(globalThis, sym, {
    configurable: true,
    get: function() {
      warnOnce('`' + sym + '` is not longer defined by emscripten. ' + msg);
      return undefined;
    }
  });
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');

function missingLibrarySymbol(sym) {
  if (typeof globalThis !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get: function() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = '`' + sym + '` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line';
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE=" + librarySymbol + ")";
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get: function() {
        var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// end include: runtime_debug.js
// end include: support.js



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');
var noExitRuntime = Module['noExitRuntime'] || true;legacyModuleProp('noExitRuntime', 'noExitRuntime');

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

// include: runtime_strings.js


// runtime_strings.js: String related runtime functions that are part of both
// MINIMAL_RUNTIME and regular runtime.

var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
 * array that contains uint8 values, returns a copy of that string as a
 * Javascript String object.
 * heapOrArray is either a regular array, or a JavaScript typed array view.
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = '';
  // If building with TextDecoder, we have already computed the string length
  // above, so test loop end condition against that
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 0xF0) == 0xE0) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }

    if (u0 < 0x10000) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    }
  }
  return str;
}

/**
 * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
 * emscripten HEAP, returns a copy of that string as a Javascript String object.
 *
 * @param {number} ptr
 * @param {number=} maxBytesToRead - An optional length that specifies the
 *   maximum number of bytes to read. You can omit this parameter to scan the
 *   string until the first \0 byte. If maxBytesToRead is passed, and the string
 *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
 *   string will cut short at that byte index (i.e. maxBytesToRead will not
 *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
 *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
 *   JS JIT optimizations off, so it is worth to consider consistently using one
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

/**
 * Copies the given Javascript String object 'str' to the given byte array at
 * address 'outIdx', encoded in UTF8 form and null-terminated. The copy will
 * require at most str.length*4+1 bytes of space in the HEAP.  Use the function
 * lengthBytesUTF8 to compute the exact number of bytes (excluding null
 * terminator) that this function will write.
 *
 * @param {string} str - The Javascript string to copy.
 * @param {ArrayBufferView|Array<number>} heap - The array to copy to. Each
 *                                               index in this array is assumed
 *                                               to be one 8-byte element.
 * @param {number} outIdx - The starting offset in the array to begin the copying.
 * @param {number} maxBytesToWrite - The maximum number of bytes this function
 *                                   can write to the array.  This count should
 *                                   include the null terminator, i.e. if
 *                                   maxBytesToWrite=1, only the null terminator
 *                                   will be written and nothing else.
 *                                   maxBytesToWrite=0 does not write any bytes
 *                                   to the output, not even the null
 *                                   terminator.
 * @return {number} The number of bytes written, EXCLUDING the null terminator.
 */
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0))
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

/**
 * Copies the given Javascript String object 'str' to the emscripten HEAP at
 * address 'outPtr', null-terminated and encoded in UTF8 form. The copy will
 * require at most str.length*4+1 bytes of space in the HEAP.
 * Use the function lengthBytesUTF8 to compute the exact number of bytes
 * (excluding null terminator) that this function will write.
 *
 * @return {number} The number of bytes written, EXCLUDING the null terminator.
 */
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

/**
 * Returns the number of bytes the given Javascript string takes if encoded as a
 * UTF8 byte array, EXCLUDING the null terminator byte.
 *
 * @param {string} str - JavaScript string to operator on
 * @return {number} Length, in bytes, of the UTF8 encoded string.
 */
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i); // possibly a lead surrogate
    if (c <= 0x7F) {
      len++;
    } else if (c <= 0x7FF) {
      len += 2;
    } else if (c >= 0xD800 && c <= 0xDFFF) {
      len += 4; ++i;
    } else {
      len += 3;
    }
  }
  return len;
}

// end include: runtime_strings.js
// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

var STACK_SIZE = 65536;
if (Module['STACK_SIZE']) assert(STACK_SIZE === Module['STACK_SIZE'], 'the stack size can no longer be determined at runtime')

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;legacyModuleProp('INITIAL_MEMORY', 'INITIAL_MEMORY');

assert(INITIAL_MEMORY >= STACK_SIZE, 'INITIAL_MEMORY should be larger than STACK_SIZE, was ' + INITIAL_MEMORY + '! (STACK_SIZE=' + STACK_SIZE + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it.
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(INITIAL_MEMORY == 16777216, 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;

// end include: runtime_init_table.js
// include: runtime_stack_check.js


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with the (separate) address-zero check
  // below.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x2135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten at ' + ptrToString(max) + ', expected hex dwords 0x89BACDFE and 0x2135467, but received ' + ptrToString(cookie2) + ' ' + ptrToString(cookie1));
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[0] !== 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}

// end include: runtime_stack_check.js
// include: runtime_assertions.js


// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function keepRuntimeAlive() {
  return noExitRuntime;
}

function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// {{MEM_INITIALIZER}}

// include: memoryprofiler.js


// end include: memoryprofiler.js
// show errors on likely calls to FS when it was not included
var FS = {
  error: function() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init: function() { FS.error() },
  createDataFile: function() { FS.error() },
  createPreloadedFile: function() { FS.error() },
  createLazyFile: function() { FS.error() },
  open: function() { FS.error() },
  mkdev: function() { FS.error() },
  registerDevice: function() { FS.error() },
  analyzePath: function() { FS.error() },
  loadFilesFromDB: function() { FS.error() },

  ErrnoError: function ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

// include: URIUtils.js


// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  return filename.startsWith(dataURIPrefix);
}

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return filename.startsWith('file://');
}

// end include: URIUtils.js
/** @param {boolean=} fixedasm */
function createExportWrapper(name, fixedasm) {
  return function() {
    var displayName = name;
    var asm = fixedasm;
    if (!fixedasm) {
      asm = Module['asm'];
    }
    assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

var wasmBinaryFile;
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABrYKAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2ABfAF8YAV/fn5+fgBgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAF+AX9gA39+fwF+YAABfmABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgA39/fwF8YAl/f39/f39/f38AYAh/f39/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgB39/f39/f38AYAJ/fwF+YAJ/fQBgAn5+AXxgBH9/fn8BfmAEf35/fwF/AruFgIAAFQNlbnYFYWJvcnQABwNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgAAA2VudhFlbV9kZXBsb3lfaGFuZGxlcgAAA2VudhdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQACA2Vudg1lbV9zZW5kX2ZyYW1lAAADZW52EGVtX2NvbnNvbGVfZGVidWcAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA5mFgIAAlwUHAQAHBwgHAAAHBAAIBwcFBQAAAgMCAAcHAgQDAwMAEgcSBwcDBgcCBwcDCQUFBQUHAAgFFhwMDQUCBgMGAAACAgAAAAQDBAICAgMABgACBgAAAwICAgADAwMDBQAAAAIBAAUABQUDAgICAgMEAwMDBQIIAAEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQAMAAICAAEBAQABAAABAAAMAAECAAECAwQFAQIAAAIAAAgBAwYDBQYJBgUGBQMGBgYGCQ0FBgMDBQMDAwYFBgYGBgYGAw4PAgICBAEDAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAUCBgYGAQEGBgEDAgIBBgwGAQYGAQQGAgACAgUADw8CAgYOAwMDAwUFAwMDBAUBAwADAwAEBQUDAQECAgICAgICAgICAgICAgECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQEBAQICAgICAgICAgEBAQIEBAEMDQICAAAHCQMBAwcBAAAIAAIGAAcFAwgJBAQAAAIHAAMHBwQBAgEAEAMJBwAABAACBwUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBwcHBwQHBwcICAMSCAMABAEACQEDAwEDBgQJIAkXAwMQBAMFAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIREFBAQEBQkEBAAAFAoKChMKEQUIByIKFBQKGBMQEAojJCUmCgMDAwQEFwQEGQsVJwsoBhYpKgYOBAQACAQLFRoaCw8rAgIICBULCxkLLAAICAAECAcICAgtDS4Eh4CAgAABcAG/Ab8BBYaAgIAAAQGAAoACBs+AgIAADH8BQYDTBQt/AUEAC38BQQALfwFBAAt/AEHIvgELfwBBxL8BC38AQbLAAQt/AEGCwQELfwBBo8EBC38AQajDAQt/AEHIvgELfwBBnsQBCwfNhYCAACEGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFRBfX2Vycm5vX2xvY2F0aW9uAMYEGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAZtYWxsb2MAigUEZnJlZQCLBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgAqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACsKamRfZW1faW5pdAAsDWpkX2VtX3Byb2Nlc3MALRRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwQcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMFGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwYUX19lbV9qc19fZW1fdGltZV9ub3cDByBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMIGV9fZW1fanNfX2VtX2NvbnNvbGVfZGVidWcDCQZmZmx1c2gAzgQVZW1zY3JpcHRlbl9zdGFja19pbml0AKUFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUApgUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCnBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAqAUJc3RhY2tTYXZlAKEFDHN0YWNrUmVzdG9yZQCiBQpzdGFja0FsbG9jAKMFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQApAUNX19zdGFydF9lbV9qcwMKDF9fc3RvcF9lbV9qcwMLDGR5bkNhbGxfamlqaQCqBQn1goCAAAEAQQELvgEpOkFCQ0RdXmFWXGJjxQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrgGvAbABsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcQBxwHIAckBygHLAcwBzQHOAc8B0AHRAb4CwALCAuAC4QLiAuMC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AAuBAQICfwF+IwBBIGsiASQAIAEgACkDUCIDNwMIIAEgAzcDGAJAAkAgACABQQhqENICRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARC6AkEAIQILAkAgAiICRQ0AIAAgAiAAQQAQhgIgAEEBEIYCEOoBGgsgAUEgaiQACzkCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwAgASACNwMIIAAgACABENICEIoCIAFBEGokAAvRAQIFfwF+IwBBMGsiASQAIAEgACkDUCIGNwMQIAEgBjcDKAJAAkAgACABQRBqENICRQ0AIAEoAighAgwBCyABIAEpAyg3AwggAUEgaiAAQQ8gAUEIahC6AkEAIQILAkAgAiIDRQ0AAkAgAC0AQ0ECSQ0AQQAhBANAIAMvAQghBSABIAAgBEEBaiICQQN0akHQAGopAwAiBjcDACABIAY3AxggACADIAUgARCFAiACIQQgAiAALQBDQX9qSA0ACwsgACADLwEIEIkCCyABQTBqJAALiQICBX8BfiMAQcAAayIBJAAgASAAKQNQIgY3AyggASAGNwM4AkACQCAAIAFBKGoQ0gJFDQAgASgCOCECDAELIAEgASkDODcDICABQTBqIABBDyABQSBqELoCQQAhAgsCQCACIgJFDQAgASAAQdgAaikDACIGNwMYIAEgBjcDOAJAIAAgAUEYahDSAg0AIAEgASkDODcDECABQTBqIABBDyABQRBqELoCDAELIAEgASkDODcDCAJAIAAgAUEIahDRAiIDLwEIIgRFDQAgACACIAIvAQgiBSAEEOoBDQAgAigCDCAFQQN0aiADKAIMIARBA3QQyQQaCyAAIAIvAQgQiQILIAFBwABqJAALnAICBn8BfiMAQSBrIgEkACABIAApA1AiBzcDCCABIAc3AxgCQAJAIAAgAUEIahDSAkUNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQugJBACECCyACIgMvAQghAkEAIQQCQCAALQBDQX9qIgVFDQAgAEEAEIYCIQQLIAQiBEEfdSACcSAEaiIEQQAgBEEAShshBCACIQYCQCAFQQJJDQAgAiEGIABB4ABqKQMAUA0AIABBARCGAiEGCwJAIAAgBiIGQR91IAJxIAZqIgYgAiAGIAJIGyICIAQgAiAEIAJI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EIYCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQnQQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRCJAgsRACAAIABBABCHAhDfBBCIAgsYACAAIABBABCHAiAAQQEQhwIQ6wQQiAILLgEDfyAAQQAQhgIhAUEAIQICQCAAQQEQhgIiA0UNACABIANtIQILIAAgAhCJAgsuAQN/IABBABCGAiEBQQAhAgJAIABBARCGAiIDRQ0AIAEgA28hAgsgACACEIkCCxYAIAAgAEEAEIYCIABBARCGAmwQiQILCQAgAEEBEK0BC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEMsCIQMgAiACKQMgNwMQIAAgAkEQahDLAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQygIhBiACIAIpAyA3AwAgACACEMoCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDwFo3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQrQELqAECA38BfiMAQSBrIgEkACABIABB2ABqKQMANwMYIAEgAEHgAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahD5ASECIAEgASkDEDcDACAAIAEQ+wEiA0UNACACRQ0AAkAgAygCAEGAgID4AHFBgICAyABHDQAgACACIAMoAgQQ5AELIAAgAiADEOQBCyAAKAKsASABKQMYNwMgIAFBIGokAAsJACAAQQEQsQELvgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEPsBIgNFDQAgAEEAEIIBIgRFDQAgAkEgaiAAQQggBBDJ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AyAHQewBIAJBCGoQTGohAwsgAEHsAWogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahDuASICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEHsGCABQRBqELsCQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEHfGCABQQhqELsCQQAhAwsCQCADIgNFDQAgACADEMYBIAAgASgCJCADLwECQf8fcUGAwAByENQBCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEO4BIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQewYIANBCGoQuwJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahDuASIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUHsGCADQQhqELsCQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ7gEiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFB7BggA0EIahC7AkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDHAgsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQ7gEiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABB7BggAUEQahC7AkEAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABB3xggAUEIahC7AkEAIQMLAkAgAyIDRQ0AIAAgAxDGASAAIAEoAiQgAy8BAhDUAQsgAUHAAGokAAtv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QQJGDQAgACABEOUBIQECQCACQQFxDQAgASECDAILAkACQCACQQRxRQ0AAkAgAUHgzwBrQQxtQSBLDQBB+A8QsgQhAgJAIAApADBCAFINACADQcghNgIwIAMgAjYCNCADQdgAaiAAQZ4UIANBMGoQtgIgAiECDAMLIAMgAEEwaikDADcDUCAAIANB0ABqEJsCIQEgA0HIITYCQCADIAE2AkQgAyACNgJIIANB2ABqIABBrhQgA0HAAGoQtgIgAiECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsgASECAkAgAEF8ag4GBAAAAAAEAAtB5MUAQcwxQawEQewaEKkEAAtBmCUQsgQhAgJAAkAgACkAMEIAUg0AIANByCE2AgAgAyACNgIEIANB2ABqIABBnhQgAxC2AgwBCyADIABBMGopAwA3AyggACADQShqEJsCIQEgA0HIITYCECADIAE2AhQgAyACNgIYIANB2ABqIABBrhQgA0EQahC2AgsgAiECCyACECALQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEPYBIQEgAEIANwMwIAJBEGokACABC6cCAQJ/AkACQCABQeDPAGtBDG1BIEsNACABKAIEIQIMAQsCQAJAIAEgACgApAEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoArgBDQAgAEEgEHshAiAAQQg6AEQgACACNgK4ASACDQBBACECDAMLIAAoArgBKAIUIgMhAiADDQIgAEEJQRAQeiICDQFBACECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsCQAJAIABBfGoOBgEAAAAAAQALQaLGAEHMMUHfBUHWGhCpBAALIAEoAgQPCyAAKAK4ASACNgIUIAJB4M8AQagBakEAQeDPAEGwAWooAgAbNgIEIAIhAgtBACACIgBB4M8AQRhqQQBB4M8AQSBqKAIAGyAAGyIAIAAgAUYbC50CAgF/An4jAEHQAGsiAiQAIAEpAwAhAyACQTBqQTQQqQIgAiADNwM4IAIgAikDMCIENwNAIAAgBDcDMCACIAM3AyAgAiADNwNIIAAgAkEgakEAEPYBIQEgAEIANwMwIAIgAikDQDcDGCACQcgAaiAAIAEgAkEYahD3ASACIAIpAzg3AxAgAiACKQNI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akHYAGopAwAiAzcDACACIAM3AwggACACEMoCIQQgAkEQaiQAIAQLLAEBfyMAQRBrIgIkACACQQhqIAEQxgIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQxwIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQyAIgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEMkCIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahDRAiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB7StBABC2AkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahDTAiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSFJDQAgAEIANwMADwsCQCABIAIQ5QEiA0HgzwBrQQxtQSBLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEMkCCyQAAkAgAS0AFEEKSQ0AIAEoAggQIAsgAUEAOwECIAFBADoAFAtOAQN/QQAhAQNAIAAgASICQRhsaiIBQRRqIQMCQCABLQAUQQpJDQAgASgCCBAgCyADQQA6AAAgAUEAOwECIAJBAWoiAiEBIAJBFEcNAAsLywEBCH8jAEEgayECAkAgACAALwHgAyIDQRhsaiABRw0AIAEPCwJAIABBACADQQFqIANBEksbIgRBGGxqIgMgAUYNACACQQhqQRBqIgUgAUEQaiIGKQIANwMAIAJBCGpBCGoiByABQQhqIggpAgA3AwAgAiABKQIANwMIIAYgA0EQaiIJKQIANwIAIAggA0EIaiIGKQIANwIAIAEgAykCADcCACAJIAUpAwA3AgAgBiAHKQMANwIAIAMgAikDCDcCAAsgACAEOwHgAyADC74DAQZ/IwBBIGsiBCQAAkAgAkUNAEEAIQUCQANAAkAgACAFIgVBGGxqLwECDQAgACAFQRhsaiEFDAIL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ACABIgEoAgAiAjYCJCABKAIMECAgARAgIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDDAiECCyACIgJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhASACQQAoAtjMASIAIAJBxABqKAIAIgMgACADa0EASBsiADYCFCACQShqIgMgAisDGCAAIAFruKIgAysDAKA5AwACQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQwwIhAgsgAiICRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDDAiECCyACIgJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUGA2gAQiwRB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgC2MwBIAFqNgIcCwu5AgEFfyACQQFqIQMgAUHsPCABGyEEAkACQCAAKAIkIgENACABIQUMAQsgASEGA0ACQCAGIgEoAgwiBkUNACAGIAQgAxDjBA0AIAEhBQwCCyABKAIAIgEhBiABIQUgAQ0ACwsgBSIGIQECQCAGDQBByAAQHyIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQcAAakEAKALYzAEiBTYCACABKAIQIgchBgJAIAcNAAJAAkAgAC0AEkUNACAAQShqIQYCQCAAKAIoRQ0AIAYhBgwCCyAGQYgnNgIAIAYhBgwBCyAAQQxqIQYLIAYoAgAhBgsgAUHEAGogBiAFajYCACABQbMsEMECIAEgAxAfIgY2AgwgBiAEIAIQyQQaIAEhAQsgAQs7AQF/QQBBkNoAEJAEIgE2AsDJASABQQE6ABIgASAANgIgIAFB4NQDNgIMIAFBgQI7ARBB0gAgARDkAwulAgEDfwJAQQAoAsDJASICRQ0AIAIgACAAEPgEEMMCIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQIgAEEAKALYzAEiAyAAQcQAaigCACIEIAMgBGtBAEgbIgM2AhQgAEEoaiIEIAArAxggAyACa7iiIAQrAwCgOQMAAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLwwICAX4EfwJAAkACQAJAIAEQxwQOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIgiKciAyACpyIEcg0AIABCgICAgHA3AwAPCwJAIANBFHZB/w9xIgVB/wdJDQACQAJAIAVBkwhLDQAgBA0CAkAgBUGTCEYNACADQf//P3EgBUGNeGp0DQMLIANB//8/cUGAgMAAckGTCCAFa3YhAwwBCwJAIAVBnghJDQAgBA0CIANBgICAj3xHDQIgAEKAgICAeDcDAA8LIAQgBUHtd2oiBnQNASADQf//P3FBgIDAAHIgBnQgBEGzCCAFa3ZyIQMLIABBfzYCBCAAQQAgAyIDayADIAJCAFMbNgIADwsgACABOQMACxAAIAAgATYCACAAQX82AgQLDwAgAELAAEIBIAEbNwMACzwAAkAgAw0AIABCADcDAA8LAkAgAkEIcUUNACAAIAM2AgAgACACNgIEDwtBiMcAQbo0QdoAQbUXEKkEAAuRAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAIAMNAAJAAkACQAJAAkAgASgCACIBQUBqDgQABAECAwtEAAAAAAAA8D8hBAwFC0QAAAAAAADwfyEEDAQLRAAAAAAAAPD/IQQMAwtEAAAAAAAAAAAhBCABQQJJDQILRAAAAAAAAPh/IQQMAQsgAiABKQMANwMQAkAgACACQRBqEKYCRQ0AIAIgASkDADcDCCAAIAJBCGogAkEcahCoAiIBIAJBGGoQiAUhBCABIAIoAhhHDQELRAAAAAAAAPh/IQQLIAJBIGokACAEC9YBAgF/AXwjAEEQayICJAACQAJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAhAQwCCyABKAIAQT9LIQEMAQsgAiABKQMANwMIQQAhASAAIAJBCGoQygIiA71C////////////AINCgICAgICAgPj/AFYNAAJAAkAgA51EAAAAAAAA8EEQzwQiA0QAAAAAAADwQaAgAyADRAAAAAAAAAAAYxsiA0QAAAAAAADwQWMgA0QAAAAAAAAAAGZxRQ0AIAOrIQEMAQtBACEBCyABIQELIAJBEGokACABC7ABAQF/IwBBIGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAQQBHIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDEAJAIAAgAkEQahCmAkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQqAIaIAIoAhxBAEchAQwBCwJAIAFBBmovAQBB8P8BcQ0AQQEhAQwBCyABKwMARAAAAAAAAAAAYSEBCyACQSBqJAAgAQthAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRtBfGoOBQECAgIAAgtBACECIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAoRg8LIAEoAgBBgIABSSECCyACC2wBAn9BACECAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDQXxqDgUBAgICAAILQQAhAiABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYhAgwBCyABKAIAQYCAAUkhAgsgA0EERyACcQvEAQECfwJAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIEQXxqDgUBAwMDAAMLIAEoAgAiA0UNAiADKAIAQYCAgPgAcUGAgIAoRiEDDAELIAEoAgBBgIABSSEDCyADRQ0AAkACQAJAIARBfGoOBQIBAQEAAQsgASgCACEBAkAgAkUNACACIAEvAQQ2AgALIAFBDGoPC0G6NEHOAUHmNhCkBAALIAAgASgCACACEN4CDwtB38MAQbo0QcABQeY2EKkEAAvdAQECfyMAQSBrIgMkAAJAAkACQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQXxqDgUBAwMDAAMLIAEoAgAiBEUNAiAEKAIAQYCAgPgAcUGAgIAoRiEEDAELIAEoAgBBgIABSSEECyAERQ0AIAMgASkDADcDGCAAIANBGGogAhDPAiEBDAELIAMgASkDADcDEAJAIAAgA0EQahCmAkUNACADIAEpAwA3AwggACADQQhqIAIQqAIhAQwBCwJAIAINAEEAIQEMAQsgAkEANgIAQQAhAQsgA0EgaiQAIAELIwBBACABKAIAQQAgASgCBCIBQQ9xQQhGGyABQYCAwP8HcRsLUgEBfwJAIAEoAgQiAkGAgMD/B3FFDQBBAA8LAkAgAkEPcUEIRg0AQQAPC0EAIQICQCABKAIAIgFFDQAgASgCAEGAgID4AHFBgICAGEYhAgsgAguJAwEDfyMAQRBrIgIkAAJAAkACQCABKAIEIgNBf0cNAEEBIQQMAQtBASEEAkACQAJAAkACQAJAAkACQAJAQRAgA0EPcSABQQZqLwEAQfD/AXEbDhEAAQYCBAIFBwMCAgcHBwcHCQcLIAEoAgAiASEEAkACQAJAAkAgAQ4DDAECAAsgAUFAag4EAAIBAQILQQYhBAwKC0EBIQQMCQtBAiEEIAFBoH9qQSFJDQhBCyEEIAFB/wdLDQhBujRBgwJB4iIQpAQAC0EHIQQMBwtBCCEEDAYLAkACQCABKAIAIgENAEF9IQEMAQsgAS0AA0EPcUF9aiEBCyABIgFBCUkNBAwGC0EEQQkgASgCAEGAgAFJGyEEDAQLIAIgASkDADcDCEEIQQIgACACQQhqQQAQ7gEvAQJBgCBJGyEEDAMLQQUhBAwCC0G6NEGrAkHiIhCkBAALQd8DIAFB//8DcXZBAXFFDQEgAUECdEHQ2gBqKAIAIQQLIAJBEGokACAEDwtBujRBngJB4iIQpAQACxEAIAAoAgRFIAAoAgBBA0lxC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqEKYCDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqEKYCRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahCoAiECIAMgAykDMDcDCCAAIANBCGogA0E4ahCoAiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEOMERSEBCyABIQELIAEhBAsgA0HAAGokACAEC1cAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0H+OEG6NEHcAkHPLxCpBAALQaY5Qbo0Qd0CQc8vEKkEAAuMAQEBf0EAIQICQCABQf//A0sNAEH6ACECAkACQAJAAkACQAJAIAFBDnYOBAMFAAECCyAAKAIAQcQAaiECQQEhAAwDCyAAKAIAQcwAaiECQQMhAAwCC0H+MEE5QaYfEKQEAAsgACgCAEHUAGohAkEDIQALIAIoAgAgAHYhAgsgAUH//wBxIAJJIQILIAILXAEBfyMAQSBrIgEkACABQRRqIAAoAAgiAEH//wNxNgIAIAFBEGogAEEQdkH/AXE2AgAgAUEANgIIIAFChICAgDA3AwAgASAAQRh2NgIMQeQuIAEQLiABQSBqJAALyR4CC38BfiMAQZAEayICJAACQAJAAkAgAEEDcQ0AAkAgAUHoAE0NACACIAA2AogEAkACQCAAKAIAQcTK2ZsFRw0AIAAoAgRBivyp03lGDQELIAJC6Ac3A/ADQeQJIAJB8ANqEC5BmHghAQwECwJAIAAoAghBgIBwcUGAgIAgRg0AQe4gQQAQLiACQeQDaiAAKAAIIgBB//8DcTYCACACQdADakEQaiAAQRB2Qf8BcTYCACACQQA2AtgDIAJChICAgDA3A9ADIAIgAEEYdjYC3ANB5C4gAkHQA2oQLiACQpoINwPAA0HkCSACQcADahAuQeZ3IQEMBAtBACEDIABBIGohBEEAIQUDQCAFIQUgAyEGAkACQAJAIAQiBCgCACIDIAFNDQBB6QchBUGXeCEDDAELAkAgBCgCBCIHIANqIAFNDQBB6gchBUGWeCEDDAELAkAgA0EDcUUNAEHrByEFQZV4IQMMAQsCQCAHQQNxRQ0AQewHIQVBlHghAwwBCyAFRQ0BIARBeGoiB0EEaigCACAHKAIAaiADRg0BQfIHIQVBjnghAwsgAiAFNgKwAyACIAQgAGs2ArQDQeQJIAJBsANqEC4gBiEHIAMhCAwECyAFQQdLIgchAyAEQQhqIQQgBUEBaiIGIQUgByEHIAZBCUcNAAwDCwALQY3EAEH+MEHHAEGkCBCpBAALQarBAEH+MEHGAEGkCBCpBAALIAghBQJAIAdBAXENACAFIQEMAQsCQCAAQTRqLQAAQQdxRQ0AIAJC84eAgIAGNwOgA0HkCSACQaADahAuQY14IQEMAQsgACAAKAIwaiIEIAQgACgCNGoiA0khBwJAAkAgBCADSQ0AIAchAyAFIQcMAQsgByEGIAUhCCAEIQkDQCAIIQUgBiEDAkACQCAJIgYpAwAiDUL/////b1gNAEELIQQgBSEFDAELAkACQCANQv///////////wCDQoCAgICAgID4/wBYDQBBkwghBUHtdyEHDAELIAJBgARqIA2/EMYCQQAhBCAFIQUgAikDgAQgDVENAUGUCCEFQex3IQcLIAJBMDYClAMgAiAFNgKQA0HkCSACQZADahAuQQEhBCAHIQULIAMhAyAFIgUhBwJAIAQODAACAgICAgICAgICAAILIAZBCGoiAyAAIAAoAjBqIAAoAjRqSSIEIQYgBSEIIAMhCSAEIQMgBSEHIAQNAAsLIAchBQJAIANBAXFFDQAgBSEBDAELAkAgAEEkaigCAEGA6jBJDQAgAkKjiICAgAY3A4ADQeQJIAJBgANqEC5B3XchAQwBCyAAIAAoAiBqIgQgBCAAKAIkaiIDSSEHAkACQAJAIAQgA0kNACAHIQFBMCEEDAELAkACQAJAIAQvAQggBC0ACk8NACAHIQFBMCEFDAELIARBCmohAyAEIQYgACgCKCEIIAchBwNAIAchCiAIIQggAyELAkAgBiIEKAIAIgMgAU0NACACQekHNgLQASACIAQgAGsiBTYC1AFB5AkgAkHQAWoQLiAKIQEgBSEEQZd4IQUMBQsCQCAEKAIEIgcgA2oiBiABTQ0AIAJB6gc2AuABIAIgBCAAayIFNgLkAUHkCSACQeABahAuIAohASAFIQRBlnghBQwFCwJAIANBA3FFDQAgAkHrBzYC8AIgAiAEIABrIgU2AvQCQeQJIAJB8AJqEC4gCiEBIAUhBEGVeCEFDAULAkAgB0EDcUUNACACQewHNgLgAiACIAQgAGsiBTYC5AJB5AkgAkHgAmoQLiAKIQEgBSEEQZR4IQUMBQsCQAJAIAAoAigiCSADSw0AIAMgACgCLCAJaiIMTQ0BCyACQf0HNgLwASACIAQgAGsiBTYC9AFB5AkgAkHwAWoQLiAKIQEgBSEEQYN4IQUMBQsCQAJAIAkgBksNACAGIAxNDQELIAJB/Qc2AoACIAIgBCAAayIFNgKEAkHkCSACQYACahAuIAohASAFIQRBg3ghBQwFCwJAIAMgCEYNACACQfwHNgLQAiACIAQgAGsiBTYC1AJB5AkgAkHQAmoQLiAKIQEgBSEEQYR4IQUMBQsCQCAHIAhqIgdBgIAESQ0AIAJBmwg2AsACIAIgBCAAayIFNgLEAkHkCSACQcACahAuIAohASAFIQRB5XchBQwFCyAELwEMIQMgAiACKAKIBDYCvAICQCACQbwCaiADENcCDQAgAkGcCDYCsAIgAiAEIABrIgU2ArQCQeQJIAJBsAJqEC4gCiEBIAUhBEHkdyEFDAULAkAgBC0ACyIDQQNxQQJHDQAgAkGzCDYCkAIgAiAEIABrIgU2ApQCQeQJIAJBkAJqEC4gCiEBIAUhBEHNdyEFDAULAkAgA0EBcUUNACALLQAADQAgAkG0CDYCoAIgAiAEIABrIgU2AqQCQeQJIAJBoAJqEC4gCiEBIAUhBEHMdyEFDAULIARBEGoiBiAAIAAoAiBqIAAoAiRqSSIJRQ0CIARBGmoiDCEDIAYhBiAHIQggCSEHIARBGGovAQAgDC0AAE8NAAsgCSEBIAQgAGshBQsgAiAFIgU2AsQBIAJBpgg2AsABQeQJIAJBwAFqEC4gASEBIAUhBEHadyEFDAILIAkhASAEIABrIQQLIAUhBQsgBSEHIAQhCAJAIAFBAXFFDQAgByEBDAELAkAgAEHcAGooAgAiASAAIAAoAlhqIgRqQX9qLQAARQ0AIAIgCDYCtAEgAkGjCDYCsAFB5AkgAkGwAWoQLkHddyEBDAELAkAgAEHMAGooAgAiBUEATA0AIAAgACgCSGoiAyAFaiEGIAMhBQNAAkAgBSIFKAIAIgMgAUkNACACIAg2AqQBIAJBpAg2AqABQeQJIAJBoAFqEC5B3HchAQwDCwJAIAUoAgQgA2oiAyABSQ0AIAIgCDYClAEgAkGdCDYCkAFB5AkgAkGQAWoQLkHjdyEBDAMLAkAgBCADai0AAA0AIAVBCGoiAyEFIAMgBk8NAgwBCwsgAiAINgKEASACQZ4INgKAAUHkCSACQYABahAuQeJ3IQEMAQsCQCAAQdQAaigCACIFQQBMDQAgACAAKAJQaiIDIAVqIQYgAyEFA0ACQCAFIgUoAgAiAyABSQ0AIAIgCDYCdCACQZ8INgJwQeQJIAJB8ABqEC5B4XchAQwDCwJAIAUoAgQgA2ogAU8NACAFQQhqIgMhBSADIAZPDQIMAQsLIAIgCDYCZCACQaAINgJgQeQJIAJB4ABqEC5B4HchAQwBCwJAAkAgACAAKAJAaiIBIAEgAEHEAGooAgBqSSIFDQAgBSEMIAchAQwBCyAFIQMgByEHIAEhBgNAIAchDCADIQsgBiIJLwEAIgMhAQJAIAAoAlwiBiADSw0AIAIgCDYCVCACQaEINgJQQeQJIAJB0ABqEC4gCyEMQd93IQEMAgsCQANAAkAgASIBIANrQcgBSSIHDQAgAiAINgJEIAJBogg2AkBB5AkgAkHAAGoQLkHedyEBDAILAkAgBCABai0AAEUNACABQQFqIgUhASAFIAZJDQELCyAMIQELIAEhAQJAIAdFDQAgCUECaiIFIAAgACgCQGogACgCRGoiCUkiDCEDIAEhByAFIQYgDCEMIAEhASAFIAlPDQIMAQsLIAshDCABIQELIAEhAQJAIAxBAXFFDQAgASEBDAELAkACQCAAIAAoAjhqIgUgBSAAQTxqKAIAakkiBA0AIAQhCCABIQUMAQsgBCEEIAEhAyAFIQcDQCADIQUgBCEGAkACQAJAIAciASgCAEEcdkF/akEBTQ0AQZAIIQVB8HchAwwBCyABLwEEIQMgAiACKAKIBDYCPEEBIQQgBSEFIAJBPGogAxDXAg0BQZIIIQVB7nchAwsgAiABIABrNgI0IAIgBTYCMEHkCSACQTBqEC5BACEEIAMhBQsgBSEFAkAgBEUNACABQQhqIgEgACAAKAI4aiAAKAI8aiIGSSIIIQQgBSEDIAEhByAIIQggBSEFIAEgBk8NAgwBCwsgBiEIIAUhBQsgBSEBAkAgCEEBcUUNACABIQEMAQsCQCAALwEODQBBACEBDAELIAAgACgCYGohByABIQRBACEFA0AgBCEDAkACQAJAIAcgBSIFQQR0aiIBQRBqIAAgACgCYGogACgCZCIEakkNAEGyCCEEQc53IQMMAQsCQAJAAkAgBQ4CAAECCwJAIAEoAgRB8////wFGDQBBpwghBEHZdyEDDAMLIAVBAUcNAQsgASgCBEHy////AUYNAEGoCCEEQdh3IQMMAQsCQCABLwEKQQJ0IgYgBEkNAEGpCCEEQdd3IQMMAQsCQCABLwEIQQN0IAZqIARNDQBBqgghBEHWdyEDDAELIAEvAQAhBCACIAIoAogENgIsAkAgAkEsaiAEENcCDQBBqwghBEHVdyEDDAELAkAgAS0AAkEOcUUNAEGsCCEEQdR3IQMMAQsCQAJAIAEvAQhFDQAgByAGaiEMIAMhBkEAIQgMAQtBASEEIAMhAwwCCwNAIAYhCSAMIAgiCEEDdGoiBC8BACEDIAIgAigCiAQ2AiggBCAAayEGAkACQCACQShqIAMQ1wINACACIAY2AiQgAkGtCDYCIEHkCSACQSBqEC5BACEEQdN3IQMMAQsCQAJAIAQtAARBAXENACAJIQYMAQsCQAJAAkAgBC8BBkECdCIEQQRqIAAoAmRJDQBBrgghA0HSdyEKDAELIAcgBGoiAyEEAkAgAyAAIAAoAmBqIAAoAmRqTw0AA0ACQCAEIgQvAQAiAw0AAkAgBC0AAkUNAEGvCCEDQdF3IQoMBAtBrwghA0HRdyEKIAQtAAMNA0EBIQsgCSEEDAQLIAIgAigCiAQ2AhwCQCACQRxqIAMQ1wINAEGwCCEDQdB3IQoMAwsgBEEEaiIDIQQgAyAAIAAoAmBqIAAoAmRqSQ0ACwtBsQghA0HPdyEKCyACIAY2AhQgAiADNgIQQeQJIAJBEGoQLkEAIQsgCiEECyAEIgMhBkEAIQQgAyEDIAtFDQELQQEhBCAGIQMLIAMhAwJAIAQiBEUNACADIQYgCEEBaiIJIQggBCEEIAMhAyAJIAEvAQhPDQMMAQsLIAQhBCADIQMMAQsgAiABIABrNgIEIAIgBDYCAEHkCSACEC5BACEEIAMhAwsgAyEBAkAgBEUNACABIQQgBUEBaiIDIQVBACEBIAMgAC8BDk8NAgwBCwsgASEBCyACQZAEaiQAIAELXQECfyMAQRBrIgIkAAJAAkAgAC8BBCIDIAAvAQZPDQAgASgCpAEhASAAIANBAWo7AQQgASADai0AACEADAELIAJBCGogAUHkABB1QQAhAAsgAkEQaiQAIABB/wFxC/gFAgt/AX4jAEEQayIBJAACQCAAKAKoASICRQ0AIAIhAkGAgAghAwJAA0AgAiECIANBf2oiBEUNAQJAAkAgAi8BBCIDIAIvAQZPDQAgACgCpAEhBSACIANBAWo7AQQgBSADai0AACEDDAELIAFBCGogAEHkABB1QQAhAwsgAyIDQf8BcSEGAkACQCADwEF/Sg0AIAEgBkHwfmoQxwICQCAALQBCIgJBCkkNACABQQhqIABB5QAQdQwCCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB0ABqIAw3AwAMAQsCQCAGQdsASQ0AIAFBCGogAEHmABB1DAELAkAgBkHo3gBqLQAAIgdBIHFFDQAgACACLwEEIgNBf2o7AUACQAJAIAMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEHVBACEDCwJAAkAgA0H/AXEiCEH4AU8NACAIIQMMAQsgCEEDcSEJQQAhBUEAIQoDQCAKIQogBSEDAkACQCACLwEEIgUgAi8BBk8NACAAKAKkASELIAIgBUEBajsBBCALIAVqLQAAIQsMAQsgAUEIaiAAQeQAEHVBACELCyADQQFqIQUgCkEIdCALQf8BcXIiCyEKIAMgCUcNAAtBACALayALIAhBBHEbIQMLIAAgAzYCSAsgACAALQBCOgBDAkACQCAHQRBxRQ0AIAIgAEHAugEgBkECdGooAgARAgAgAC0AQkUNASABQQhqIABB5wAQdQwBCyABIAIgAEHAugEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQdQwBCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB0ABqIAw3AwALIAAtAEVFDQAgAEEAOgBFIABBADoAQgJAIAAoAqwBIgJFDQAgAiAAKQM4NwMgCyAAQgA3AzgLIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQdAsgAUEQaiQACyQBAX9BACEBAkAgAEH5AEsNACAAQQJ0QYDbAGooAgAhAQsgAQvKAgEDfyMAQRBrIgMkACADIAAoAgA2AgwCQAJAAkAgA0EMaiABENcCDQAgAg0BQQAhAQwCCyABQf//AHEhBAJAAkACQAJAAkAgAUEOdkEDcQ4EAQIDAAELQQAhASAAKAIAIgUgBSgCSGogBEEDdGohBAwDC0EAIQEgACgCACIFIAUoAlBqIARBA3RqIQQMAgsgBEECdEGA2wBqKAIAIQFBACEEDAELIAAoAgAiASABKAJYaiABIAEoAkBqIARBAXRqLwEAaiEBQQAhBAsgASEFAkAgBCIBRQ0AAkAgAkUNACACIAEoAgQ2AgALIAAoAgAiACAAKAJYaiABKAIAaiEBDAILAkAgBUUNAAJAIAINACAFIQEMAwsgAiAFEPgENgIAIAUhAQwCC0GVM0GVAUH8PBCkBAALIAJBADYCAEEAIQELIANBEGokACABC0oBAX8jAEEQayIDJAAgAyAAKAKkATYCBCADQQRqIAEgAhDdAiIBIQICQCABDQAgA0EIaiAAQegAEHVB5MkAIQILIANBEGokACACCzsBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEHULIAJBEGokACABCwsAIAAgAkHyABB1Cw4AIAAgAiACKAJIEI8CCzEAAkAgAS0AQkEBRg0AQew9QfkxQc4AQeI6EKkEAAsgAUEAOgBCIAEoAqwBQQAQZxoLMQACQCABLQBCQQJGDQBB7D1B+TFBzgBB4joQqQQACyABQQA6AEIgASgCrAFBARBnGgsxAAJAIAEtAEJBA0YNAEHsPUH5MUHOAEHiOhCpBAALIAFBADoAQiABKAKsAUECEGcaCzEAAkAgAS0AQkEERg0AQew9QfkxQc4AQeI6EKkEAAsgAUEAOgBCIAEoAqwBQQMQZxoLMQACQCABLQBCQQVGDQBB7D1B+TFBzgBB4joQqQQACyABQQA6AEIgASgCrAFBBBBnGgsxAAJAIAEtAEJBBkYNAEHsPUH5MUHOAEHiOhCpBAALIAFBADoAQiABKAKsAUEFEGcaCzEAAkAgAS0AQkEHRg0AQew9QfkxQc4AQeI6EKkEAAsgAUEAOgBCIAEoAqwBQQYQZxoLMQACQCABLQBCQQhGDQBB7D1B+TFBzgBB4joQqQQACyABQQA6AEIgASgCrAFBBxBnGgsxAAJAIAEtAEJBCUYNAEHsPUH5MUHOAEHiOhCpBAALIAFBADoAQiABKAKsAUEIEGcaC/QBAgN/AX4jAEHQAGsiAiQAIAJByABqIAEQuwMgAkHAAGogARC7AyABKAKsAUEAKQO4WjcDICABIAIpA0g3AzAgAiACKQNANwMwAkAgASACQTBqEPkBIgNFDQAgAiACKQNINwMoAkAgASACQShqEKYCIgQNACACIAIpA0g3AyAgAkE4aiABIAJBIGoQrQIgAiACKQM4IgU3A0ggAiAFNwMYIAEgAkEYahB+CyACIAIpA0g3AxACQCABIAMgAkEQahDsAQ0AIAEoAqwBQQApA7BaNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahB/CyACQdAAaiQACzYBAn8jAEEQayICJAAgASgCrAEhAyACQQhqIAEQuwMgAyACKQMINwMgIAMgABBqIAJBEGokAAthAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkggAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQdUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4QBAQR/IwBBIGsiAiQAIAJBEGogARC7AyACIAIpAxA3AwggASACQQhqEMwCIQMCQAJAIAAoAhAoAgAgASgCSCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABB1QQAhBQsCQCAFIgFFIANyDQAgACABOwEECyACQSBqJAALCwAgASABELwDEHQLjAEBAn8jAEEgayIDJAAgAigCSCEEIAMgAigCpAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQ1wIbIgRBf0oNACADQRhqIAJB+gAQdSADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsgAkEBEOUBIQQgAyADKQMQNwMAIAAgAiAEIAMQ9wEgA0EgaiQAC1QBAn8jAEEQayICJAAgAkEIaiABELsDAkACQCABKAJIIgMgACgCEC8BCEkNACACIAFB7wAQdQwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARC7AwJAAkAgASgCSCIDIAEoAqQBLwEMSQ0AIAIgAUHxABB1DAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC2EBA38jAEEgayICJAAgAkEYaiABELsDIAEQvAMhAyABELwDIQQgAkEQaiABQQEQvgMCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBJCyACQSBqJAALDQAgAEEAKQPIWjcDAAs2AQF/AkAgAigCSCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEHULNwEBfwJAIAIoAkgiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQdQtxAQF/IwBBIGsiAyQAIANBGGogAhC7AyADIAMpAxg3AxACQAJAAkAgA0EQahCnAg0AIAMoAhwNASADKAIYQQJHDQELIAAgAykDGDcDAAwBCyADIAMpAxg3AwggACACIANBCGoQygIQxgILIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhC7AyADQRBqIAIQuwMgAyADKQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADEIICIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARC7AyACQSBqIAEQuwMgAkEYaiABELsDIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQgwIgAkEwaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQuwMgAyADKQMgNwMoIAIoAkghBCADIAIoAqQBNgIcIARBgIABciEEAkACQCAEQX8gA0EcaiAEENcCGyIEQX9KDQAgA0E4aiACQfoAEHUgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCAAgsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACELsDIAMgAykDIDcDKCACKAJIIQQgAyACKAKkATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBDXAhsiBEF/Sg0AIANBOGogAkH6ABB1IANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQgAILIANBwABqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhC7AyADIAMpAyA3AyggAigCSCEEIAMgAigCpAE2AhwgBEGAgANyIQQCQAJAIARBfyADQRxqIAQQ1wIbIgRBf0oNACADQThqIAJB+gAQdSADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEIACCyADQcAAaiQAC4wBAQJ/IwBBIGsiAyQAIAIoAkghBCADIAIoAqQBNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEENcCGyIEQX9KDQAgA0EYaiACQfoAEHUgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDlASEEIAMgAykDEDcDACAAIAIgBCADEPcBIANBIGokAAuMAQECfyMAQSBrIgMkACACKAJIIQQgAyACKAKkATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBDXAhsiBEF/Sg0AIANBGGogAkH6ABB1IANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQRUQ5QEhBCADIAMpAxA3AwAgACACIAQgAxD3ASADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEOUBEIABIgMNACABQRAQVAsgASgCrAEhBCACQQhqIAFBCCADEMkCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARC8AyIDEIIBIgQNACABIANBA3RBEGoQVAsgASgCrAEhAyACQQhqIAFBCCAEEMkCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARC8AyIDEIMBIgQNACABIANBDGoQVAsgASgCrAEhAyACQQhqIAFBCCAEEMkCIAMgAikDCDcDICACQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCSCIESw0AIANBCGogAkH5ABB1IABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALZQECfyMAQRBrIgMkACACKAJIIQQgAyACKAKkATYCBAJAAkAgBEF/IANBBGogBBDXAhsiBEF/Sg0AIANBCGogAkH6ABB1IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJIIQQgAyACKAKkATYCBCAEQYCAAXIhBAJAAkAgBEF/IANBBGogBBDXAhsiBEF/Sg0AIANBCGogAkH6ABB1IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJIIQQgAyACKAKkATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBDXAhsiBEF/Sg0AIANBCGogAkH6ABB1IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJIIQQgAyACKAKkATYCBCAEQYCAA3IhBAJAAkAgBEF/IANBBGogBBDXAhsiBEF/Sg0AIANBCGogAkH6ABB1IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigCSCIEIAIoAKQBQSRqKAIAQQR2SQ0AIANBCGogAkH4ABB1IABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAJIEMcCC0IBAn8CQCACKAJIIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQdQtYAQJ/IwBBEGsiAyQAAkACQCACKACkAUE8aigCAEEDdiACKAJIIgRLDQAgA0EIaiACQfkAEHUgAEIANwMADAELIAAgAkEIIAIgBBD4ARDJAgsgA0EQaiQAC18BA38jAEEQayIDJAAgAhC8AyEEIAIQvAMhBSADQQhqIAJBAhC+AwJAAkAgAykDCEIAUg0AIABCADcDAAwBCyADIAMpAwg3AwAgACACIAUgBCADQQAQSQsgA0EQaiQACxAAIAAgAigCrAEpAyA3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQuwMgAyADKQMINwMAIAAgAiADENMCEMcCIANBEGokAAsJACAAQgA3AwALNQEBfyMAQRBrIgMkACADQQhqIAIQuwMgAEGw2gBBuNoAIAMpAwhQGykDADcDACADQRBqJAALDQAgAEEAKQOwWjcDAAsNACAAQQApA7haNwMACzQBAX8jAEEQayIDJAAgA0EIaiACELsDIAMgAykDCDcDACAAIAIgAxDMAhDIAiADQRBqJAALDQAgAEEAKQPAWjcDAAupAQIBfwF8IwBBEGsiAyQAIANBCGogAhC7AwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDAAJAIAIgAxDKAiIERAAAAAAAAAAAY0UNACAAIASaEMYCDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA6haNwMADAILIABBACACaxDHAgwBCyAAIAMpAwg3AwALIANBEGokAAsPACAAIAIQvQNBf3MQxwILMgEBfyMAQRBrIgMkACADQQhqIAIQuwMgACADKAIMRSADKAIIQQJGcRDIAiADQRBqJAALcQEBfyMAQRBrIgMkACADQQhqIAIQuwMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwAgACACIAMQygKaEMYCDAELAkAgAygCCCICQYCAgIB4Rw0AIABBACkDqFo3AwAMAQsgAEEAIAJrEMcCCyADQRBqJAALNwEBfyMAQRBrIgMkACADQQhqIAIQuwMgAyADKQMINwMAIAAgAiADEMwCQQFzEMgCIANBEGokAAsMACAAIAIQvQMQxwILqQICBX8BfCMAQcAAayIDJAAgA0E4aiACELsDIAJBGGoiBCADKQM4NwMAIANBOGogAhC7AyACIAMpAzg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASCAFKAIAIgcgBmoiBiAHSHMNACAAIAYQxwIMAQsgAyAFKQMANwMwAkACQCACIANBMGoQpgINACADIAQpAwA3AyggAiADQShqEKYCRQ0BCyADIAUpAwA3AxAgAyAEKQMANwMIIAAgAiADQRBqIANBCGoQsAIMAQsgAyAFKQMANwMgIAIgAiADQSBqEMoCOQMgIAMgBCkDADcDGCACQShqIAIgA0EYahDKAiIIOQMAIAAgCCACKwMgoBDGAgsgA0HAAGokAAvNAQIFfwF8IwBBIGsiAyQAIANBGGogAhC7AyACQRhqIgQgAykDGDcDACADQRhqIAIQuwMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEogBSgCACIHIAZrIgYgB0hzDQAgACAGEMcCDAELIAMgBSkDADcDECACIAIgA0EQahDKAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQygIiCDkDACAAIAIrAyAgCKEQxgILIANBIGokAAvPAQMEfwF+AXwjAEEgayIDJAAgA0EYaiACELsDIAJBGGoiBCADKQMYNwMA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LQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBB3xMgBBAuEBsAC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QyQQgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQ+ARqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQ+ARqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBCsBCABQQhqIQIMBwsgCygCACIBQZvGACABGyIDEPgEIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQyQQgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECAMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBD4BCEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQyQQgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEOEEIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQnAWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQnAWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBCcBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahCcBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQywQaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QYDmAGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEMsEIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQ+ARqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEA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AQ8LQQAhAgJAIAAoAkxBAEgNACAAEMwEIQILAkACQAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQUAGiAAKAIUDQBBfyEBIAINAQwCCwJAIAAoAgQiASAAKAIIIgNGDQAgACABIANrrEEBIAAoAigREQAaC0EAIQEgAEEANgIcIABCADcDECAAQgA3AgQgAkUNAQsgABDNBAsgAQuyBAIEfgJ/AkACQCABvSICQgGGIgNQDQAgARDQBCEEIAC9IgVCNIinQf8PcSIGQf8PRg0AIARC////////////AINCgYCAgICAgPj/AFQNAQsgACABoiIBIAGjDwsCQCAFQgGGIgQgA1YNACAARAAAAAAAAAAAoiAAIAQgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAFQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIAVBASAGa62GIQMMAQsgBUL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIEQgBTDQADQCAHQX9qIQcgBEIBhiIEQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LIANCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCwJAAkAgA0L/////////B1gNACADIQQMAQsDQCAGQX9qIQYgA0KAgICAgICABFQhByADQgGGIgQhAyAHDQALCyAFQoCAgICAgICAgH+DIQMCQAJAIAZBAUgNACAEQoCAgICAgIB4fCAGrUI0hoQhBAwBCyAEQQEgBmutiCEECyAEIAOEvwsFACAAvQsOACAAKAI8IAEgAhDiBAvlAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQYgA0EQaiEEQQIhBwJAAkACQAJAAkAgACgCPCADQRBqQQIgA0EMahASEIkFRQ0AIAQhBQwBCwNAIAYgAygCDCIBRg0CAkAgAUF/Sg0AIAQhBQwECyAEIAEgBCgC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ayIBJABBfyECAkAgABDUBA0AIAAgAUEPakEBIAAoAiARBQBBAUcNACABLQAPIQILIAFBEGokACACC0cBAn8gACABNwNwIAAgACgCLCAAKAIEIgJrrDcDeCAAKAIIIQMCQCABUA0AIAMgAmusIAFXDQAgAiABp2ohAwsgACADNgJoC90BAgN/An4gACkDeCAAKAIEIgEgACgCLCICa6x8IQQCQAJAAkAgACkDcCIFUA0AIAQgBVkNAQsgABD5BCICQX9KDQEgACgCBCEBIAAoAiwhAgsgAEJ/NwNwIAAgATYCaCAAIAQgAiABa6x8NwN4QX8PCyAEQgF8IQQgACgCBCEBIAAoAgghAwJAIAApA3AiBUIAUQ0AIAUgBH0iBSADIAFrrFkNACABIAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQmgUgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABCaBSADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EJoFIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORCaBSADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQmgUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEJAFRQ0AIAMgBBCABSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBCaBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEJIFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChCQBUEASg0AAkAgASAJIAMgChCQBUUNACABIQQMAgsgBUHwAGogASACQgBCABCaBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQmgUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEJoFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABCaBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQmgUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EJoFIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkGMugFqKAIAIQYgAkGAugFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEPsEIQILIAIQ/AQNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARD7BCECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEPsEIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAEIAiyQwAAgH+UEJQFIARBCGopAwAhCyAEKQMAIQoMAgsCQAJAAkAgCQ0AQQAhCQNAIAJBIHIgCUGIHmosAABHDQECQCAJQQFLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ+wQhAgsgCUEBaiIJQQNHDQAMAgsACwJAAkAgCQ4EAAEBAgELAkAgAkEwRw0AAkACQCABKAIEIgkgASgCaEYNACAFIAlBAWo2AgAgCS0AACEJDAELIAEQ+wQhCQsCQCAJQV9xQdgARw0AIARBEGogASAHIAYgCCADEIQFIARBGGopAwAhCyAEKQMQIQoMBgsgASkDcEIAUw0AIAUgBSgCAEF/ajYCAAsgBEEgaiABIAIgByAGIAggAxCFBSAEQShqKQMAIQsgBCkDICEKDAQLQgAhCgJAIAEpA3BCAFMNACAFIAUoAgBBf2o2AgALEMYEQRw2AgAMAQsCQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARD7BCECCwJAAkAgAkEoRw0AQQEhCQwBC0IAIQpCgICAgICA4P//ACELIAEpA3BCAFMNAyAFIAUoAgBBf2o2AgAMAwsDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEPsEIQILIAJBv39qIQgCQAJAIAJBUGpBCkkNACAIQRpJDQAgAkGff2ohCCACQd8ARg0AIAhBGk8NAQsgCUEBaiEJDAELC0KAgICAgIDg//8AIQsgAkEpRg0CAkAgASkDcCIMQgBTDQAgBSAFKAIAQX9qNgIACwJAAkAgA0UNACAJDQFCACEKDAQLEMYEQRw2AgBCACEKDAELA0AgCUF/aiEJAkAgDEIAUw0AIAUgBSgCAEF/ajYCAAtCACEKIAkNAAwDCwALIAEgChD6BAtCACELCyAAIAo3AwAgACALNwMIIARBMGokAAvCDwIIfwd+IwBBsANrIgYkAAJAAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEPsEIQcLQQAhCEIAIQ5BACEJAkACQAJAA0ACQCAHQTBGDQAgB0EuRw0EIAEoAgQiByABKAJoRg0CIAEgB0EBajYCBCAHLQAAIQcMAwsCQCABKAIEIgcgASgCaEYNAEEBIQkgASAHQQFqNgIEIActAAAhBwwBC0EBIQkgARD7BCEHDAALAAsgARD7BCEHC0EBIQhCACEOIAdBMEcNAANAAkACQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQ+wQhBwsgDkJ/fCEOIAdBMEYNAAtBASEIQQEhCQtCgICAgICAwP8/IQ9BACEKQgAhEEIAIRFCACESQQAhC0IAIRMCQANAIAdBIHIhDAJAAkAgB0FQaiINQQpJDQACQCAMQZ9/akEGSQ0AIAdBLkcNBAsgB0EuRw0AIAgNA0EBIQggEyEODAELIAxBqX9qIA0gB0E5ShshBwJAAkAgE0IHVQ0AIAcgCkEEdGohCgwBCwJAIBNCHFYNACAGQTBqIAcQlQUgBkEgaiASIA9CAEKAgICAgIDA/T8QmgUgBkEQaiAGKQMwIAZBMGpBCGopAwAgBikDICISIAZBIGpBCGopAwAiDxCaBSAGIAYpAxAgBkEQakEIaikDACAQIBEQjgUgBkEIaikDACERIAYpAwAhEAwBCyAHRQ0AIAsNACAGQdAAaiASIA9CAEKAgICAgICA/z8QmgUgBkHAAGogBikDUCAGQdAAakEIaikDACAQIBEQjgUgBkHAAGpBCGopAwAhEUEBIQsgBikDQCEQCyATQgF8IRNBASEJCwJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARD7BCEHDAALAAsCQAJAIAkNAAJAAkACQCABKQNwQgBTDQAgASABKAIEIgdBf2o2AgQgBUUNASABIAdBfmo2AgQgCEUNAiABIAdBfWo2AgQMAgsgBQ0BCyABQgAQ+gQLIAZB4ABqIAS3RAAAAAAAAAAAohCTBSAGQegAaikDACETIAYpA2AhEAwBCwJAIBNCB1UNACATIQ8DQCAKQQR0IQogD0IBfCIPQghSDQALCwJAAkACQAJAIAdBX3FB0ABHDQAgASAFEIYFIg9CgICAgICAgICAf1INAwJAIAVFDQAgASkDcEJ/VQ0CDAMLQgAhECABQgAQ+gRCACETDAQLQgAhDyABKQNwQgBTDQILIAEgASgCBEF/ajYCBAtCACEPCwJAIAoNACAGQfAAaiAEt0QAAAAAAAAAAKIQkwUgBkH4AGopAwAhEyAGKQNwIRAMAQsCQCAOIBMgCBtCAoYgD3xCYHwiE0EAIANrrVcNABDGBEHEADYCACAGQaABaiAEEJUFIAZBkAFqIAYpA6ABIAZBoAFqQQhqKQMAQn9C////////v///ABCaBSAGQYABaiAGKQOQASAGQZABakEIaikDAEJ/Qv///////7///wAQmgUgBkGAAWpBCGopAwAhEyAGKQOAASEQDAELAkAgEyADQZ5+aqxTDQACQCAKQX9MDQADQCAGQaADaiAQIBFCAEKAgICAgIDA/79/EI4FIBAgEUIAQoCAgICAgID/PxCRBSEHIAZBkANqIBAgESAGKQOgAyAQIAdBf0oiBxsgBkGgA2pBCGopAwAgESAHGxCOBSATQn98IRMgBkGQA2pBCGopAwAhESAGKQOQAyEQIApBAXQgB3IiCkF/Sg0ACwsCQAJAIBMgA6x9QiB8Ig6nIgdBACAHQQBKGyACIA4gAq1TGyIHQfEASA0AIAZBgANqIAQQlQUgBkGIA2opAwAhDkIAIQ8gBikDgAMhEkIAIRQMAQsgBkHgAmpEAAAAAAAA8D9BkAEgB2sQ/QQQkwUgBkHQAmogBBCVBSAGQfACaiAGKQPgAiAGQeACakEIaikDACAGKQPQAiISIAZB0AJqQQhqKQMAIg4Q/gQgBkHwAmpBCGopAwAhFCAGKQPwAiEPCyAGQcACaiAKIAdBIEggECARQgBCABCQBUEAR3EgCkEBcUVxIgdqEJYFIAZBsAJqIBIgDiAGKQPAAiAGQcACakEIaikDABCaBSAGQZACaiAGKQOwAiAGQbACakEIaikDACAPIBQQjgUgBkGgAmogEiAOQgAgECAHG0IAIBEgBxsQmgUgBkGAAmogBikDoAIgBkGgAmpBCGopAwAgBikDkAIgBkGQAmpBCGopAwAQjgUgBkHwAWogBikDgAIgBkGAAmpBCGopAwAgDyAUEJ0FAkAgBikD8AEiECAGQfABakEIaikDACIRQgBCABCQBQ0AEMYEQcQANgIACyAGQeABaiAQIBEgE6cQ/wQgBkHgAWpBCGopAwAhEyAGKQPgASEQDAELEMYEQcQANgIAIAZB0AFqIAQQlQUgBkHAAWogBikD0AEgBkHQAWpBCGopAwBCAEKAgICAgIDAABCaBSAGQbABaiAGKQPAASAGQcABakEIaikDAEIAQoCAgICAgMAAEJoFIAZBsAFqQQhqKQMAIRMgBikDsAEhEAsgACAQNwMAIAAgEzcDCCAGQbADaiQAC/ofAwt/Bn4BfCMAQZDGAGsiByQAQQAhCEEAIARrIgkgA2shCkIAIRJBACELAkACQAJAA0ACQCACQTBGDQAgAkEuRw0EIAEoAgQiAiABKAJoRg0CIAEgAkEBajYCBCACLQAAIQIMAwsCQCABKAIEIgIgASgCaEYNAEEBIQsgASACQQFqNgIEIAItAAAhAgwBC0EBIQsgARD7BCECDAALAAsgARD7BCECC0EBIQhCACESIAJBMEcNAANAAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQ+wQhAgsgEkJ/fCESIAJBMEYNAAtBASELQQEhCAtBACEMIAdBADYCkAYgAkFQaiENAkACQAJAAkACQAJAAkAgAkEuRiIODQBCACETIA1BCU0NAEEAIQ9BACEQDAELQgAhE0EAIRBBACEPQQAhDANAAkACQCAOQQFxRQ0AAkAgCA0AIBMhEkEBIQgMAgsgC0UhDgwECyATQgF8IRMCQCAPQfwPSg0AIAJBMEYhCyATpyERIAdBkAZqIA9BAnRqIQ4CQCAQRQ0AIAIgDigCAEEKbGpBUGohDQsgDCARIAsbIQwgDiANNgIAQQEhC0EAIBBBAWoiAiACQQlGIgIbIRAgDyACaiEPDAELIAJBMEYNACAHIAcoAoBGQQFyNgKARkHcjwEhDAsCQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARD7BCECCyACQVBqIQ0gAkEuRiIODQAgDUEKSQ0ACwsgEiATIAgbIRICQCALRQ0AIAJBX3FBxQBHDQACQCABIAYQhgUiFEKAgICAgICAgIB/Ug0AIAZFDQRCACEUIAEpA3BCAFMNACABIAEoAgRBf2o2AgQLIBQgEnwhEgwECyALRSEOIAJBAEgNAQsgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgDkUNARDGBEEcNgIAC0IAIRMgAUIAEPoEQgAhEgwBCwJAIAcoApAGIgENACAHIAW3RAAAAAAAAAAAohCTBSAHQQhqKQMAIRIgBykDACETDAELAkAgE0IJVQ0AIBIgE1INAAJAIANBHkoNACABIAN2DQELIAdBMGogBRCVBSAHQSBqIAEQlgUgB0EQaiAHKQMwIAdBMGpBCGopAwAgBykDICAHQSBqQQhqKQMAEJoFIAdBEGpBCGopAwAhEiAHKQMQIRMMAQsCQCASIAlBAXatVw0AEMYEQcQANgIAIAdB4ABqIAUQlQUgB0HQAGogBykDYCAHQeAAakEIaikDAEJ/Qv///////7///wAQmgUgB0HAAGogBykDUCAHQdAAakEIaikDAEJ/Qv///////7///wAQmgUgB0HAAGpBCGopAwAhEiAHKQNAIRMMAQsCQCASIARBnn5qrFkNABDGBEHEADYCACAHQZABaiAFEJUFIAdBgAFqIAcpA5ABIAdBkAFqQQhqKQMAQgBCgICAgICAwAAQmgUgB0HwAGogBykDgAEgB0GAAWpBCGopAwBCAEKAgICAgIDAABCaBSAHQfAAakEIaikDACESIAcpA3AhEwwBCwJAIBBFDQACQCAQQQhKDQAgB0GQBmogD0ECdGoiAigCACEBA0AgAUEKbCEBIBBBAWoiEEEJRw0ACyACIAE2AgALIA9BAWohDwsgEqchCAJAIAxBCU4NACAMIAhKDQAgCEERSg0AAkAgCEEJRw0AIAdBwAFqIAUQlQUgB0GwAWogBygCkAYQlgUgB0GgAWogBykDwAEgB0HAAWpBCGopAwAgBykDsAEgB0GwAWpBCGopAwAQmgUgB0GgAWpBCGopAwAhEiAHKQOgASETDAILAkAgCEEISg0AIAdBkAJqIAUQlQUgB0GAAmogBygCkAYQlgUgB0HwAWogBykDkAIgB0GQAmpBCGopAwAgBykDgAIgB0GAAmpBCGopAwAQmgUgB0HgAWpBCCAIa0ECdEHguQFqKAIAEJUFIAdB0AFqIAcpA/ABIAdB8AFqQQhqKQMAIAcpA+ABIAdB4AFqQQhqKQMAEJIFIAdB0AFqQQhqKQMAIRIgBykD0AEhEwwCCyAHKAKQBiEBAkAgAyAIQX1sakEbaiICQR5KDQAgASACdg0BCyAHQeACaiAFEJUFIAdB0AJqIAEQlgUgB0HAAmogBykD4AIgB0HgAmpBCGopAwAgBykD0AIgB0HQAmpBCGopAwAQmgUgB0GwAmogCEECdEG4uQFqKAIAEJUFIAdBoAJqIAcpA8ACIAdBwAJqQQhqKQMAIAcpA7ACIAdBsAJqQQhqKQMAEJoFIAdBoAJqQQhqKQMAIRIgBykDoAIhEwwBCwNAIAdBkAZqIA8iAkF/aiIPQQJ0aigCAEUNAAtBACEQAkACQCAIQQlvIgENAEEAIQ4MAQtBACEOIAFBCWogASAIQQBIGyEGAkACQCACDQBBACECDAELQYCU69wDQQggBmtBAnRB4LkBaigCACILbSERQQAhDUEAIQFBACEOA0AgB0GQBmogAUECdGoiDyAPKAIAIg8gC24iDCANaiINNgIAIA5BAWpB/w9xIA4gASAORiANRXEiDRshDiAIQXdqIAggDRshCCARIA8gDCALbGtsIQ0gAUEBaiIBIAJHDQALIA1FDQAgB0GQBmogAkECdGogDTYCACACQQFqIQILIAggBmtBCWohCAsDQCAHQZAGaiAOQQJ0aiEMAkADQAJAIAhBJEgNACAIQSRHDQIgDCgCAEHR6fkETw0CCyACQf8PaiEPQQAhDSACIQsDQCALIQICQAJAIAdBkAZqIA9B/w9xIgFBAnRqIgs1AgBCHYYgDa18IhJCgZTr3ANaDQBBACENDAELIBIgEkKAlOvcA4AiE0KAlOvcA359IRIgE6chDQsgCyASpyIPNgIAIAIgAiACIAEgDxsgASAORhsgASACQX9qQf8PcUcbIQsgAUF/aiEPIAEgDkcNAAsgEEFjaiEQIA1FDQALAkAgDkF/akH/D3EiDiALRw0AIAdBkAZqIAtB/g9qQf8PcUECdGoiASABKAIAIAdBkAZqIAtBf2pB/w9xIgJBAnRqKAIAcjYCAAsgCEEJaiEIIAdBkAZqIA5BAnRqIA02AgAMAQsLAkADQCACQQFqQf8PcSEJIAdBkAZqIAJBf2pB/w9xQQJ0aiEGA0BBCUEBIAhBLUobIQ8CQANAIA4hC0EAIQECQAJAA0AgASALakH/D3EiDiACRg0BIAdBkAZqIA5BAnRqKAIAIg4gAUECdEHQuQFqKAIAIg1JDQEgDiANSw0CIAFBAWoiAUEERw0ACwsgCEEkRw0AQgAhEkEAIQFCACETA0ACQCABIAtqQf8PcSIOIAJHDQAgAkEBakH/D3EiAkECdCAHQZAGampBfGpBADYCAAsgB0GABmogB0GQBmogDkECdGooAgAQlgUgB0HwBWogEiATQgBCgICAgOWat47AABCaBSAHQeAFaiAHKQPwBSAHQfAFakEIaikDACAHKQOABiAHQYAGakEIaikDABCOBSAHQeAFakEIaikDACETIAcpA+AFIRIgAUEBaiIBQQRHDQALIAdB0AVqIAUQlQUgB0HABWogEiATIAcpA9AFIAdB0AVqQQhqKQMAEJoFIAdBwAVqQQhqKQMAIRNCACESIAcpA8AFIRQgEEHxAGoiDSAEayIBQQAgAUEAShsgAyABIANIIg8bIg5B8ABMDQJCACEVQgAhFkIAIRcMBQsgDyAQaiEQIAIhDiALIAJGDQALQYCU69wDIA92IQxBfyAPdEF/cyERQQAhASALIQ4DQCAHQZAGaiALQQJ0aiINIA0oAgAiDSAPdiABaiIBNgIAIA5BAWpB/w9xIA4gCyAORiABRXEiARshDiAIQXdqIAggARshCCANIBFxIAxsIQEgC0EBakH/D3EiCyACRw0ACyABRQ0BAkAgCSAORg0AIAdBkAZqIAJBAnRqIAE2AgAgCSECDAMLIAYgBigCAEEBcjYCAAwBCwsLIAdBkAVqRAAAAAAAAPA/QeEBIA5rEP0EEJMFIAdBsAVqIAcpA5AFIAdBkAVqQQhqKQMAIBQgExD+BCAHQbAFakEIaikDACEXIAcpA7AFIRYgB0GABWpEAAAAAAAA8D9B8QAgDmsQ/QQQkwUgB0GgBWogFCATIAcpA4AFIAdBgAVqQQhqKQMAEIEFIAdB8ARqIBQgEyAHKQOgBSISIAdBoAVqQQhqKQMAIhUQnQUgB0HgBGogFiAXIAcpA/AEIAdB8ARqQQhqKQMAEI4FIAdB4ARqQQhqKQMAIRMgBykD4AQhFAsCQCALQQRqQf8PcSIIIAJGDQACQAJAIAdBkAZqIAhBAnRqKAIAIghB/8m17gFLDQACQCAIDQAgC0EFakH/D3EgAkYNAgsgB0HwA2ogBbdEAAAAAAAA0D+iEJMFIAdB4ANqIBIgFSAHKQPwAyAHQfADakEIaikDABCOBSAHQeADakEIaikDACEVIAcpA+ADIRIMAQsCQCAIQYDKte4BRg0AIAdB0ARqIAW3RAAAAAAAAOg/ohCTBSAHQcAEaiASIBUgBykD0AQgB0HQBGpBCGopAwAQjgUgB0HABGpBCGopAwAhFSAHKQPABCESDAELIAW3IRgCQCALQQVqQf8PcSACRw0AIAdBkARqIBhEAAAAAAAA4D+iEJMFIAdBgARqIBIgFSAHKQOQBCAHQZAEakEIaikDABCOBSAHQYAEakEIaikDACEVIAcpA4AEIRIMAQsgB0GwBGogGEQAAAAAAADoP6IQkwUgB0GgBGogEiAVIAcpA7AEIAdBsARqQQhqKQMAEI4FIAdBoARqQQhqKQMAIRUgBykDoAQhEgsgDkHvAEoNACAHQdADaiASIBVCAEKAgICAgIDA/z8QgQUgBykD0AMgB0HQA2pBCGopAwBCAEIAEJAFDQAgB0HAA2ogEiAVQgBCgICAgICAwP8/EI4FIAdBwANqQQhqKQMAIRUgBykDwAMhEgsgB0GwA2ogFCATIBIgFRCOBSAHQaADaiAHKQOwAyAHQbADakEIaikDACAWIBcQnQUgB0GgA2pBCGopAwAhEyAHKQOgAyEUAkAgDUH/////B3EgCkF+akwNACAHQZADaiAUIBMQggUgB0GAA2ogFCATQgBCgICAgICAgP8/EJoFIAcpA5ADIAdBkANqQQhqKQMAQgBCgICAgICAgLjAABCRBSECIAdBgANqQQhqKQMAIBMgAkF/SiICGyETIAcpA4ADIBQgAhshFCASIBVCAEIAEJAFIQ0CQCAQIAJqIhBB7gBqIApKDQAgDyAOIAFHcSAPIAIbIA1BAEdxRQ0BCxDGBEHEADYCAAsgB0HwAmogFCATIBAQ/wQgB0HwAmpBCGopAwAhEiAHKQPwAiETCyAAIBI3AwggACATNwMAIAdBkMYAaiQAC8kEAgR/AX4CQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQMMAQsgABD7BCEDCwJAAkACQAJAAkAgA0FVag4DAAEAAQsCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABD7BCECCyADQS1GIQQgAkFGaiEFIAFFDQEgBUF1Sw0BIAApA3BCAFMNAiAAIAAoAgRBf2o2AgQMAgsgA0FGaiEFQQAhBCADIQILIAVBdkkNAEIAIQYCQCACQVBqIgVBCk8NAEEAIQMDQCACIANBCmxqIQMCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABD7BCECCyADQVBqIQMCQCACQVBqIgVBCUsNACADQcyZs+YASA0BCwsgA6whBgsCQCAFQQpPDQADQCACrSAGQgp+fCEGAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQ+wQhAgsgBkJQfCEGIAJBUGoiBUEJSw0BIAZCro+F18fC66MBUw0ACwsCQCAFQQpPDQADQAJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEPsEIQILIAJBUGpBCkkNAAsLAkAgACkDcEIAUw0AIAAgACgCBEF/ajYCBAtCACAGfSAGIAQbIQYMAQtCgICAgICAgICAfyEGIAApA3BCAFMNACAAIAAoAgRBf2o2AgRCgICAgICAgICAfw8LIAYLhgECAX8CfiMAQaABayIEJAAgBCABNgI8IAQgATYCFCAEQX82AhggBEEQakIAEPoEIAQgBEEQaiADQQEQgwUgBEEIaikDACEFIAQpAwAhBgJAIAJFDQAgAiABIAQoAhQgBCgCiAFqIAQoAjxrajYCAAsgACAFNwMIIAAgBjcDACAEQaABaiQACzUCAX8BfCMAQRBrIgIkACACIAAgAUEBEIcFIAIpAwAgAkEIaikDABCeBSEDIAJBEGokACADCxYAAkAgAA0AQQAPCxDGBCAANgIAQX8LpSsBC38jAEEQayIBJAACQAJAAkACQAJAAkACQAJAAkACQCAAQfQBSw0AAkBBACgCjM8BIgJBECAAQQtqQXhxIABBC0kbIgNBA3YiBHYiAEEDcUUNAAJAAkAgAEF/c0EBcSAEaiIFQQN0IgRBtM8BaiIAIARBvM8BaigCACIEKAIIIgNHDQBBACACQX4gBXdxNgKMzwEMAQsgAyAANgIMIAAgAzYCCAsgBEEIaiEAIAQgBUEDdCIFQQNyNgIEIAQgBWoiBCAEKAIEQQFyNgIEDAoLIANBACgClM8BIgZNDQECQCAARQ0AAkACQCAAIAR0QQIgBHQiAEEAIABrcnEiAEEAIABrcWgiBEEDdCIAQbTPAWoiBSAAQbzPAWooAgAiACgCCCIHRw0AQQAgAkF+IAR3cSICNgKMzwEMAQsgByAFNgIMIAUgBzYCCAsgACADQQNyNgIEIAAgA2oiByAEQQN0IgQgA2siBUEBcjYCBCAAIARqIAU2AgACQCAGRQ0AIAZBeHFBtM8BaiEDQQAoAqDPASEEAkACQCACQQEgBkEDdnQiCHENAEEAIAIgCHI2AozPASADIQgMAQsgAygCCCEICyADIAQ2AgggCCAENgIMIAQgAzYCDCAEIAg2AggLIABBCGohAEEAIAc2AqDPAUEAIAU2ApTPAQwKC0EAKAKQzwEiCUUNASAJQQAgCWtxaEECdEG80QFqKAIAIgcoAgRBeHEgA2shBCAHIQUCQANAAkAgBSgCECIADQAgBUEUaigCACIARQ0CCyAAKAIEQXhxIANrIgUgBCAFIARJIgUbIQQgACAHIAUbIQcgACEFDAALAAsgBygCGCEKAkAgBygCDCIIIAdGDQAgBygCCCIAQQAoApzPAUkaIAAgCDYCDCAIIAA2AggMCQsCQCAHQRRqIgUoAgAiAA0AIAcoAhAiAEUNAyAHQRBqIQULA0AgBSELIAAiCEEUaiIFKAIAIgANACAIQRBqIQUgCCgCECIADQALIAtBADYCAAwIC0F/IQMgAEG/f0sNACAAQQtqIgBBeHEhA0EAKAKQzwEiBkUNAEEAIQsCQCADQYACSQ0AQR8hCyADQf///wdLDQAgA0EmIABBCHZnIgBrdkEBcSAAQQF0a0E+aiELC0EAIANrIQQCQAJAAkACQCALQQJ0QbzRAWooAgAiBQ0AQQAhAEEAIQgMAQtBACEAIANBAEEZIAtBAXZrIAtBH0YbdCEHQQAhCANAAkAgBSgCBEF4cSADayICIARPDQAgAiEEIAUhCCACDQBBACEEIAUhCCAFIQAMAwsgACAFQRRqKAIAIgIgAiAFIAdBHXZBBHFqQRBqKAIAIgVGGyAAIAIbIQAgB0EBdCEHIAUNAAsLAkAgACAIcg0AQQAhCEECIAt0IgBBACAAa3IgBnEiAEUNAyAAQQAgAGtxaEECdEG80QFqKAIAIQALIABFDQELA0AgACgCBEF4cSADayICIARJIQcCQCAAKAIQIgUNACAAQRRqKAIAIQULIAIgBCAHGyEEIAAgCCAHGyEIIAUhACAFDQALCyAIRQ0AIARBACgClM8BIANrTw0AIAgoAhghCwJAIAgoAgwiByAIRg0AIAgoAggiAEEAKAKczwFJGiAAIAc2AgwgByAANgIIDAcLAkAgCEEUaiIFKAIAIgANACAIKAIQIgBFDQMgCEEQaiEFCwNAIAUhAiAAIgdBFGoiBSgCACIADQAgB0EQaiEFIAcoAhAiAA0ACyACQQA2AgAMBgsCQEEAKAKUzwEiACADSQ0AQQAoAqDPASEEAkACQCAAIANrIgVBEEkNACAEIANqIgcgBUEBcjYCBCAEIABqIAU2AgAgBCADQQNyNgIEDAELIAQgAEEDcjYCBCAEIABqIgAgACgCBEEBcjYCBEEAIQdBACEFC0EAIAU2ApTPAUEAIAc2AqDPASAEQQhqIQAMCAsCQEEAKAKYzwEiByADTQ0AQQAgByADayIENgKYzwFBAEEAKAKkzwEiACADaiIFNgKkzwEgBSAEQQFyNgIEIAAgA0EDcjYCBCAAQQhqIQAMCAsCQAJAQQAoAuTSAUUNAEEAKALs0gEhBAwBC0EAQn83AvDSAUEAQoCggICAgAQ3AujSAUEAIAFBDGpBcHFB2KrVqgVzNgLk0gFBAEEANgL40gFBAEEANgLI0gFBgCAhBAtBACEAIAQgA0EvaiIGaiICQQAgBGsiC3EiCCADTQ0HQQAhAAJAQQAoAsTSASIERQ0AQQAoArzSASIFIAhqIgkgBU0NCCAJIARLDQgLAkACQEEALQDI0gFBBHENAAJAAkACQAJAAkBBACgCpM8BIgRFDQBBzNIBIQADQAJAIAAoAgAiBSAESw0AIAUgACgCBGogBEsNAwsgACgCCCIADQALC0EAEI0FIgdBf0YNAyAIIQICQEEAKALo0gEiAEF/aiIEIAdxRQ0AIAggB2sgBCAHakEAIABrcWohAgsgAiADTQ0DAkBBACgCxNIBIgBFDQBBACgCvNIBIgQgAmoiBSAETQ0EIAUgAEsNBAsgAhCNBSIAIAdHDQEMBQsgAiAHayALcSICEI0FIgcgACgCACAAKAIEakYNASAHIQALIABBf0YNAQJAIANBMGogAksNACAAIQcMBAsgBiACa0EAKALs0gEiBGpBACAEa3EiBBCNBUF/Rg0BIAQgAmohAiAAIQcMAwsgB0F/Rw0CC0EAQQAoAsjSAUEEcjYCyNIBCyAIEI0FIQdBABCNBSEAIAdBf0YNBSAAQX9GDQUgByAATw0FIAAgB2siAiADQShqTQ0FC0EAQQAoArzSASACaiIANgK80gECQCAAQQAoAsDSAU0NAEEAIAA2AsDSAQsCQAJAQQAoAqTPASIERQ0AQczSASEAA0AgByAAKAIAIgUgACgCBCIIakYNAiAAKAIIIgANAAwFCwALAkACQEEAKAKczwEiAEUNACAHIABPDQELQQAgBzYCnM8BC0EAIQBBACACNgLQ0gFBACAHNgLM0gFBAEF/NgKszwFBAEEAKALk0gE2ArDPAUEAQQA2AtjSAQNAIABBA3QiBEG8zwFqIARBtM8BaiIFNgIAIARBwM8BaiAFNgIAIABBAWoiAEEgRw0AC0EAIAJBWGoiAEF4IAdrQQdxQQAgB0EIakEHcRsiBGsiBTYCmM8BQQAgByAEaiIENgKkzwEgBCAFQQFyNgIEIAcgAGpBKDYCBEEAQQAoAvTSATYCqM8BDAQLIAAtAAxBCHENAiAEIAVJDQIgBCAHTw0CIAAgCCACajYCBEEAIARBeCAEa0EHcUEAIARBCGpBB3EbIgBqIgU2AqTPAUEAQQAoApjPASACaiIHIABrIgA2ApjPASAFIABBAXI2AgQgBCAHakEoNgIEQQBBACgC9NIBNgKozwEMAwtBACEIDAULQQAhBwwDCwJAIAdBACgCnM8BIghPDQBBACAHNgKczwEgByEICyAHIAJqIQVBzNIBIQACQAJAAkACQAJAAkACQANAIAAoAgAgBUYNASAAKAIIIgANAAwCCwALIAAtAAxBCHFFDQELQczSASEAA0ACQCAAKAIAIgUgBEsNACAFIAAoAgRqIgUgBEsNAwsgACgCCCEADAALAAsgACAHNgIAIAAgACgCBCACajYCBCAHQXggB2tBB3FBACAHQQhqQQdxG2oiCyADQQNyNgIEIAVBeCAFa0EHcUEAIAVBCGpBB3EbaiICIAsgA2oiA2shAAJAIAIgBEcNAEEAIAM2AqTPAUEAQQAoApjPASAAaiIANgKYzwEgAyAAQQFyNgIEDAMLAkAgAkEAKAKgzwFHDQBBACADNgKgzwFBAEEAKAKUzwEgAGoiADYClM8BIAMgAEEBcjYCBCADIABqIAA2AgAMAwsCQCACKAIEIgRBA3FBAUcNACAEQXhxIQYCQAJAIARB/wFLDQAgAigCCCIFIARBA3YiCEEDdEG0zwFqIgdGGgJAIAIoAgwiBCAFRw0AQQBBACgCjM8BQX4gCHdxNgKMzwEMAgsgBCAHRhogBSAENgIMIAQgBTYCCAwBCyACKAIYIQkCQAJAIAIoAgwiByACRg0AIAIoAggiBCAISRogBCAHNgIMIAcgBDYCCAwBCwJAIAJBFGoiBCgCACIFDQAgAkEQaiIEKAIAIgUNAEEAIQcMAQsDQCAEIQggBSIHQRRqIgQoAgAiBQ0AIAdBEGohBCAHKAIQIgUNAAsgCEEANgIACyAJRQ0AAkACQCACIAIoAhwiBUECdEG80QFqIgQoAgBHDQAgBCAHNgIAIAcNAUEAQQAoApDPAUF+IAV3cTYCkM8BDAILIAlBEEEUIAkoAhAgAkYbaiAHNgIAIAdFDQELIAcgCTYCGAJAIAIoAhAiBEUNACAHIAQ2AhAgBCAHNgIYCyACKAIUIgRFDQAgB0EUaiAENgIAIAQgBzYCGAsgBiAAaiEAIAIgBmoiAigCBCEECyACIARBfnE2AgQgAyAAQQFyNgIEIAMgAGogADYCAAJAIABB/wFLDQAgAEF4cUG0zwFqIQQCQAJAQQAoAozPASIFQQEgAEEDdnQiAHENAEEAIAUgAHI2AozPASAEIQAMAQsgBCgCCCEACyAEIAM2AgggACADNgIMIAMgBDYCDCADIAA2AggMAwtBHyEEAkAgAEH///8HSw0AIABBJiAAQQh2ZyIEa3ZBAXEgBEEBdGtBPmohBAsgAyAENgIcIANCADcCECAEQQJ0QbzRAWohBQJAAkBBACgCkM8BIgdBASAEdCIIcQ0AQQAgByAIcjYCkM8BIAUgAzYCACADIAU2AhgMAQsgAEEAQRkgBEEBdmsgBEEfRht0IQQgBSgCACEHA0AgByIFKAIEQXhxIABGDQMgBEEddiEHIARBAXQhBCAFIAdBBHFqQRBqIggoAgAiBw0ACyAIIAM2AgAgAyAFNgIYCyADIAM2AgwgAyADNgIIDAILQQAgAkFYaiIAQXggB2tBB3FBACAHQQhqQQdxGyIIayILNgKYzwFBACAHIAhqIgg2AqTPASAIIAtBAXI2AgQgByAAakEoNgIEQQBBACgC9NIBNgKozwEgBCAFQScgBWtBB3FBACAFQVlqQQdxG2pBUWoiACAAIARBEGpJGyIIQRs2AgQgCEEQakEAKQLU0gE3AgAgCEEAKQLM0gE3AghBACAIQQhqNgLU0gFBACACNgLQ0gFBACAHNgLM0gFBAEEANgLY0gEgCEEYaiEAA0AgAEEHNgIEIABBCGohByAAQQRqIQAgByAFSQ0ACyAIIARGDQMgCCAIKAIEQX5xNgIEIAQgCCAEayIHQQFyNgIEIAggBzYCAAJAIAdB/wFLDQAgB0F4cUG0zwFqIQACQAJAQQAoAozPASIFQQEgB0EDdnQiB3ENAEEAIAUgB3I2AozPASAAIQUMAQsgACgCCCEFCyAAIAQ2AgggBSAENgIMIAQgADYCDCAEIAU2AggMBAtBHyEAAkAgB0H///8HSw0AIAdBJiAHQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgBCAANgIcIARCADcCECAAQQJ0QbzRAWohBQJAAkBBACgCkM8BIghBASAAdCICcQ0AQQAgCCACcjYCkM8BIAUgBDYCACAEIAU2AhgMAQsgB0EAQRkgAEEBdmsgAEEfRht0IQAgBSgCACEIA0AgCCIFKAIEQXhxIAdGDQQgAEEddiEIIABBAXQhACAFIAhBBHFqQRBqIgIoAgAiCA0ACyACIAQ2AgAgBCAFNgIYCyAEIAQ2AgwgBCAENgIIDAMLIAUoAggiACADNgIMIAUgAzYCCCADQQA2AhggAyAFNgIMIAMgADYCCAsgC0EIaiEADAULIAUoAggiACAENgIMIAUgBDYCCCAEQQA2AhggBCAFNgIMIAQgADYCCAtBACgCmM8BIgAgA00NAEEAIAAgA2siBDYCmM8BQQBBACgCpM8BIgAgA2oiBTYCpM8BIAUgBEEBcjYCBCAAIANBA3I2AgQgAEEIaiEADAMLEMYEQTA2AgBBACEADAILAkAgC0UNAAJAAkAgCCAIKAIcIgVBAnRBvNEBaiIAKAIARw0AIAAgBzYCACAHDQFBACAGQX4gBXdxIgY2ApDPAQwCCyALQRBBFCALKAIQIAhGG2ogBzYCACAHRQ0BCyAHIAs2AhgCQCAIKAIQIgBFDQAgByAANgIQIAAgBzYCGAsgCEEUaigCACIARQ0AIAdBFGogADYCACAAIAc2AhgLAkACQCAEQQ9LDQAgCCAEIANqIgBBA3I2AgQgCCAAaiIAIAAoAgRBAXI2AgQMAQsgCCADQQNyNgIEIAggA2oiByAEQQFyNgIEIAcgBGogBDYCAAJAIARB/wFLDQAgBEF4cUG0zwFqIQACQAJAQQAoAozPASIFQQEgBEEDdnQiBHENAEEAIAUgBHI2AozPASAAIQQMAQsgACgCCCEECyAAIAc2AgggBCAHNgIMIAcgADYCDCAHIAQ2AggMAQtBHyEAAkAgBEH///8HSw0AIARBJiAEQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgByAANgIcIAdCADcCECAAQQJ0QbzRAWohBQJAAkACQCAGQQEgAHQiA3ENAEEAIAYgA3I2ApDPASAFIAc2AgAgByAFNgIYDAELIARBAEEZIABBAXZrIABBH0YbdCEAIAUoAgAhAwNAIAMiBSgCBEF4cSAERg0CIABBHXYhAyAAQQF0IQAgBSADQQRxakEQaiICKAIAIgMNAAsgAiAHNgIAIAcgBTYCGAsgByAHNgIMIAcgBzYCCAwBCyAFKAIIIgAgBzYCDCAFIAc2AgggB0EANgIYIAcgBTYCDCAHIAA2AggLIAhBCGohAAwBCwJAIApFDQACQAJAIAcgBygCHCIFQQJ0QbzRAWoiACgCAEcNACAAIAg2AgAgCA0BQQAgCUF+IAV3cTYCkM8BDAILIApBEEEUIAooAhAgB0YbaiAINgIAIAhFDQELIAggCjYCGAJAIAcoAhAiAEUNACAIIAA2AhAgACAINgIYCyAHQRRqKAIAIgBFDQAgCEEUaiAANgIAIAAgCDYCGAsCQAJAIARBD0sNACAHIAQgA2oiAEEDcjYCBCAHIABqIgAgACgCBEEBcjYCBAwBCyAHIANBA3I2AgQgByADaiIFIARBAXI2AgQgBSAEaiAENgIAAkAgBkUNACAGQXhxQbTPAWohA0EAKAKgzwEhAAJAAkBBASAGQQN2dCIIIAJxDQBBACAIIAJyNgKMzwEgAyEIDAELIAMoAgghCAsgAyAANgIIIAggADYCDCAAIAM2AgwgACAINgIIC0EAIAU2AqDPAUEAIAQ2ApTPAQsgB0EIaiEACyABQRBqJAAgAAvMDAEHfwJAIABFDQAgAEF4aiIBIABBfGooAgAiAkF4cSIAaiEDAkAgAkEBcQ0AIAJBA3FFDQEgASABKAIAIgJrIgFBACgCnM8BIgRJDQEgAiAAaiEAAkAgAUEAKAKgzwFGDQACQCACQf8BSw0AIAEoAggiBCACQQN2IgVBA3RBtM8BaiIGRhoCQCABKAIMIgIgBEcNAEEAQQAoAozPAUF+IAV3cTYCjM8BDAMLIAIgBkYaIAQgAjYCDCACIAQ2AggMAgsgASgCGCEHAkACQCABKAIMIgYgAUYNACABKAIIIgIgBEkaIAIgBjYCDCAGIAI2AggMAQsCQCABQRRqIgIoAgAiBA0AIAFBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAQJAAkAgASABKAIcIgRBAnRBvNEBaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKAKQzwFBfiAEd3E2ApDPAQwDCyAHQRBBFCAHKAIQIAFGG2ogBjYCACAGRQ0CCyAGIAc2AhgCQCABKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgASgCFCICRQ0BIAZBFGogAjYCACACIAY2AhgMAQsgAygCBCICQQNxQQNHDQBBACAANgKUzwEgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgAPCyABIANPDQAgAygCBCICQQFxRQ0AAkACQCACQQJxDQACQCADQQAoAqTPAUcNAEEAIAE2AqTPAUEAQQAoApjPASAAaiIANgKYzwEgASAAQQFyNgIEIAFBACgCoM8BRw0DQQBBADYClM8BQQBBADYCoM8BDwsCQCADQQAoAqDPAUcNAEEAIAE2AqDPAUEAQQAoApTPASAAaiIANgKUzwEgASAAQQFyNgIEIAEgAGogADYCAA8LIAJBeHEgAGohAAJAAkAgAkH/AUsNACADKAIIIgQgAkEDdiIFQQN0QbTPAWoiBkYaAkAgAygCDCICIARHDQBBAEEAKAKMzwFBfiAFd3E2AozPAQwCCyACIAZGGiAEIAI2AgwgAiAENgIIDAELIAMoAhghBwJAAkAgAygCDCIGIANGDQAgAygCCCICQQAoApzPAUkaIAIgBjYCDCAGIAI2AggMAQsCQCADQRRqIgIoAgAiBA0AIANBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAAJAAkAgAyADKAIcIgRBAnRBvNEBaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKAKQzwFBfiAEd3E2ApDPAQwCCyAHQRBBFCAHKAIQIANGG2ogBjYCACAGRQ0BCyAGIAc2AhgCQCADKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKAKgzwFHDQFBACAANgKUzwEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBeHFBtM8BaiECAkACQEEAKAKMzwEiBEEBIABBA3Z0IgBxDQBBACAEIAByNgKMzwEgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QbzRAWohBAJAAkACQAJAQQAoApDPASIGQQEgAnQiA3ENAEEAIAYgA3I2ApDPASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCrM8BQX9qIgFBfyABGzYCrM8BCwsHAD8AQRB0C1QBAn9BACgCxL4BIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEIwFTQ0AIAAQE0UNAQtBACAANgLEvgEgAQ8LEMYEQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahCPBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQjwVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEI8FIAVBMGogCiABIAcQmQUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxCPBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahCPBSAFIAIgBEEBIAZrEJkFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBCXBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCYBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEI8FQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQjwUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACAC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///3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCPBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEI8FIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEI8FIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEI8FQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEI8FIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEI8FIAVBIGogAiAEIAYQjwUgBUEQaiASIAEgBxCZBSAFIAIgBCAHEJkFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCOBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQjwUgAiAAIARBgfgAIANrEJkFIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBgNMFJANBgNMBQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABERAAslAQF+IAAgASACrSADrUIghoQgBBCpBSEFIAVCIIinEJ8FIAWnCxMAIAAgAacgAUIgiKcgAiADEBQLC6+8gYAAAwBBgAgLmLIBaW5maW5pdHkALUluZmluaXR5AGh1bWlkaXR5AGFjaWRpdHkAZGV2c192ZXJpZnkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBpc0FycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heABibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AGRvdWJsZSB0aHJvdwBwb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0c2FnZ19jbGllbnRfZXYAdGhyb3c6JWRAJXUAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAZXhwZWN0aW5nIHN0YWNrLCBnb3QAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRldmljZXNjcmlwdG1ncl9pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBkZXZzX21hcF9rZXlzX29yX3ZhbHVlcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBnZXRfdHJ5ZnJhbWVzAHBpcGVzIGluIHNwZWNzAGFicwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwBKU0NSOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAICAgICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAHRhZyBlcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAHJvdGFyeUVuY29kZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAdmFsaWRhdGVfaGVhcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABkZXZzX29iamVjdF9nZXRfcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfbWFwX2NvcHlfaW50bwBzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuAGJ1dHRvbgBVbmhhbmRsZWQgZXhjZXB0aW9uAEV4Y2VwdGlvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgB3aW5kRGlyZWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAdGhyb3dpbmcgbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAaW52YWxpZCBmbGFnIGFyZwBuZWVkIGZsYWcgYXJnAGxvZwBzZXR0aW5nAGdldHRpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBwcm90b192YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAaGVhcnRSYXRlAGNhdXNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBuYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAYm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX29iamVjdF9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAJXMgY2FsbGVkAHVwbG9hZCBmYWlsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAHdpbmRTcGVlZABtYXRyaXhLZXlwYWQAcGF5bG9hZABhZ2didWZmZXJfdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZAAlLXMlZAAlLXNfJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZABEZXZpY2VTY3JpcHQgcnVudGltZSB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBwYW5pYwBiYWQgbWFnaWMAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC90cnkuYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAG5ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0weCV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAgIHBjPSVkIEAgPz8/ACAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAZnJhbWUtPmZ1bmMtPm51bV90cnlfZnJhbWVzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAgIC4uLgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVm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LmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAM/mgIAABG5hbWUB32WsBQAFYWJvcnQBE19kZXZzX3BhbmljX2hhbmRsZXICEWVtX2RlcGxveV9oYW5kbGVyAxdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQQNZW1fc2VuZF9mcmFtZQUQZW1fY29uc29sZV9kZWJ1ZwYEZXhpdAcLZW1fdGltZV9ub3cIIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CSFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQKGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwsyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQMM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA0zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA8aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UQD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFRFfX3dhc21fY2FsbF9jdG9ycxYNZmxhc2hfcHJvZ3JhbRcLZmxhc2hfZXJhc2UYCmZsYXNoX3N5bmMZGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIaFGFwcF9nZXRfZGV2aWNlX2NsYXNzGwhod19wYW5pYxwIamRfYmxpbmsdB2pkX2dsb3ceFGpkX2FsbG9jX3N0YWNrX2NoZWNrHwhqZF9hbGxvYyAHamRfZnJlZSENdGFyZ2V0X2luX2lycSISdGFyZ2V0X2Rpc2FibGVfaXJxIxF0YXJnZXRfZW5hYmxlX2lycSQTamRfc2V0dGluZ3NfZ2V0X2JpbiUTamRfc2V0dGluZ3Nfc2V0X2JpbiYSZGV2c19wYW5pY19oYW5kbGVyJxNkZXZzX2RlcGxveV9oYW5kbGVyKBRqZF9jcnlwdG9fZ2V0X3JhbmRvbSkQamRfZW1fc2VuZF9mcmFtZSoaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIrGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLApqZF9lbV9pbml0LQ1qZF9lbV9wcm9jZXNzLgVkbWVzZy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcSamRfdGNwc29ja19wcm9jZXNzOBFhcHBfaW5pdF9zZXJ2aWNlczkSZGV2c19jbGllbnRfZGVwbG95OhRjbGllbnRfZXZlbnRfaGFuZGxlcjsLYXBwX3Byb2Nlc3M8B3R4X2luaXQ9D2pkX3BhY2tldF9yZWFkeT4KdHhfcHJvY2Vzcz8XamRfd2Vic29ja19zZW5kX21lc3NhZ2VADmpkX3dlYnNvY2tfbmV3QQZvbm9wZW5CB29uZXJyb3JDB29uY2xvc2VECW9ubWVzc2FnZUUQamRfd2Vic29ja19jbG9zZUYOYWdnYnVmZmVyX2luaXRHD2FnZ2J1ZmZlcl9mbHVzaEgQYWdnYnVmZmVyX3VwbG9hZEkOZGV2c19idWZmZXJfb3BKEGRldnNfcmVhZF9udW1iZXJLEmRldnNfYnVmZmVyX2RlY29kZUwSZGV2c19idWZmZXJfZW5jb2RlTQ9kZXZzX2NyZWF0ZV9jdHhOCXNldHVwX2N0eE8KZGV2c190cmFjZVAPZGV2c19lcnJvcl9jb2RlURlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUgljbGVhcl9jdHhTDWRldnNfZnJlZV9jdHhUCGRldnNfb29tVQlkZXZzX2ZyZWVWF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzVwd0cnlfcnVuWAxzdG9wX3Byb2dyYW1ZHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRaHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVbGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaFwdZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRdDmRlcGxveV9oYW5kbGVyXhNkZXBsb3lfbWV0YV9oYW5kbGVyXxZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95YBRkZXZpY2VzY3JpcHRtZ3JfaW5pdGEZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldmIRZGV2c2Nsb3VkX3Byb2Nlc3NjF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0ZBNkZXZzY2xvdWRfb25fbWV0aG9kZQ5kZXZzY2xvdWRfaW5pdGYQZGV2c19maWJlcl95aWVsZGcYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uaBhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWVpEGRldnNfZmliZXJfc2xlZXBqG2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbGsaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnNsEWRldnNfaW1nX2Z1bl9uYW1lbRJkZXZzX2ltZ19yb2xlX25hbWVuEmRldnNfZmliZXJfYnlfZmlkeG8RZGV2c19maWJlcl9ieV90YWdwEGRldnNfZmliZXJfc3RhcnRxFGRldnNfZmliZXJfdGVybWlhbnRlcg5kZXZzX2ZpYmVyX3J1bnMTZGV2c19maWJlcl9zeW5jX25vd3QKZGV2c19wYW5pY3UVX2RldnNfcnVudGltZV9mYWlsdXJldg9kZXZzX2ZpYmVyX3Bva2V3E2pkX2djX2FueV90cnlfYWxsb2N4B2RldnNfZ2N5D2ZpbmRfZnJlZV9ibG9ja3oSZGV2c19hbnlfdHJ5X2FsbG9jew5kZXZzX3RyeV9hbGxvY3wLamRfZ2NfdW5waW59CmpkX2djX2ZyZWV+DmRldnNfdmFsdWVfcGlufxBkZXZzX3ZhbHVlX3VucGlugAESZGV2c19tYXBfdHJ5X2FsbG9jgQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jggEUZGV2c19hcnJheV90cnlfYWxsb2ODARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OEARVkZXZzX3N0cmluZ190cnlfYWxsb2OFARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdIYBD2RldnNfZ2Nfc2V0X2N0eIcBDmRldnNfZ2NfY3JlYXRliAEPZGV2c19nY19kZXN0cm95iQELc2Nhbl9nY19vYmqKARFwcm9wX0FycmF5X2xlbmd0aIsBEm1ldGgyX0FycmF5X2luc2VydIwBEmZ1bjFfQXJyYXlfaXNBcnJheY0BEG1ldGhYX0FycmF5X3B1c2iOARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WPARFtZXRoWF9BcnJheV9zbGljZZABEWZ1bjFfQnVmZmVyX2FsbG9jkQEScHJvcF9CdWZmZXJfbGVuZ3RokgEVbWV0aDBfQnVmZmVyX3RvU3RyaW5nkwETbWV0aDNfQnVmZmVyX2ZpbGxBdJQBE21ldGg0X0J1ZmZlcl9ibGl0QXSVARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zlgEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOXARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SYARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSZARVmdW4xX0RldmljZVNjcmlwdF9sb2eaARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0mwEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnScARRtZXRoMV9FcnJvcl9fX2N0b3JfX50BGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+eARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+fARRtZXRoWF9GdW5jdGlvbl9zdGFydKABF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBloQEOZnVuMV9NYXRoX2NlaWyiAQ9mdW4xX01hdGhfZmxvb3KjAQ9mdW4xX01hdGhfcm91bmSkAQ1mdW4xX01hdGhfYWJzpQEQZnVuMF9NYXRoX3JhbmRvbaYBE2Z1bjFfTWF0aF9yYW5kb21JbnSnAQ1mdW4xX01hdGhfbG9nqAENZnVuMl9NYXRoX3Bvd6kBDmZ1bjJfTWF0aF9pZGl2qgEOZnVuMl9NYXRoX2ltb2SrAQ5mdW4yX01hdGhfaW11bKwBDWZ1bjJfTWF0aF9taW6tAQtmdW4yX21pbm1heK4BDWZ1bjJfTWF0aF9tYXivARJmdW4yX09iamVjdF9hc3NpZ26wARBmdW4xX09iamVjdF9rZXlzsQETZnVuMV9rZXlzX29yX3ZhbHVlc7IBEmZ1bjFfT2JqZWN0X3ZhbHVlc7MBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9mtAEQcHJvcF9QYWNrZXRfcm9sZbUBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXK2ARNwcm9wX1BhY2tldF9zaG9ydElktwEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV4uAEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmS5ARFwcm9wX1BhY2tldF9mbGFnc7oBFXByb3BfUGFja2V0X2lzQ29tbWFuZLsBFHByb3BfUGFja2V0X2lzUmVwb3J0vAETcHJvcF9QYWNrZXRfcGF5bG9hZL0BE3Byb3BfUGFja2V0X2lzRXZlbnS+ARVwcm9wX1BhY2tldF9ldmVudENvZGW/ARRwcm9wX1BhY2tldF9pc1JlZ1NldMABFHByb3BfUGFja2V0X2lzUmVnR2V0wQETcHJvcF9QYWNrZXRfcmVnQ29kZcIBE21ldGgwX1BhY2tldF9kZWNvZGXDARJkZXZzX3BhY2tldF9kZWNvZGXEARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTFARREc1JlZ2lzdGVyX3JlYWRfY29udMYBEmRldnNfcGFja2V0X2VuY29kZccBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXIARZwcm9wX0RzUGFja2V0SW5mb19yb2xlyQEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZcoBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXLARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/MARdwcm9wX0RzUm9sZV9pc0Nvbm5lY3RlZM0BGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZM4BEW1ldGgwX0RzUm9sZV93YWl0zwEScHJvcF9TdHJpbmdfbGVuZ3Ro0AEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTRARNtZXRoMV9TdHJpbmdfY2hhckF00gEUZGV2c19qZF9nZXRfcmVnaXN0ZXLTARZkZXZzX2pkX2NsZWFyX3BrdF9raW5k1AEQZGV2c19qZF9zZW5kX2NtZNUBEWRldnNfamRfd2FrZV9yb2xl1gEUZGV2c19qZF9yZXNldF9wYWNrZXTXARNkZXZzX2pkX3BrdF9jYXB0dXJl2AETZGV2c19qZF9zZW5kX2xvZ21zZ9kBDWhhbmRsZV9sb2dtc2faARJkZXZzX2pkX3Nob3VsZF9ydW7bARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdwBE2RldnNfamRfcHJvY2Vzc19wa3TdARRkZXZzX2pkX3JvbGVfY2hhbmdlZN4BEmRldnNfamRfaW5pdF9yb2xlc98BEmRldnNfamRfZnJlZV9yb2xlc+ABEGRldnNfc2V0X2xvZ2dpbmfhARVkZXZzX3NldF9nbG9iYWxfZmxhZ3PiARdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc+MBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc+QBEmRldnNfbWFwX2NvcHlfaW50b+UBGGRldnNfb2JqZWN0X2dldF9idWlsdF9pbuYBDGRldnNfbWFwX3NldOcBFGRldnNfaXNfc2VydmljZV9zcGVj6AEGbG9va3Vw6QEXZGV2c19tYXBfa2V5c19vcl92YWx1ZXPqARFkZXZzX2FycmF5X2luc2VydOsBEmRldnNfc2hvcnRfbWFwX3NldOwBD2RldnNfbWFwX2RlbGV0Ze0BEmRldnNfc2hvcnRfbWFwX2dldO4BF2RldnNfZGVjb2RlX3JvbGVfcGFja2V07wEOZGV2c19yb2xlX3NwZWPwARBkZXZzX3NwZWNfbG9va3Vw8QERZGV2c19wcm90b19sb29rdXDyARJkZXZzX2Z1bmN0aW9uX2JpbmTzARFkZXZzX21ha2VfY2xvc3VyZfQBDmRldnNfZ2V0X2ZuaWR49QETZGV2c19nZXRfZm5pZHhfY29yZfYBGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZPcBF2RldnNfb2JqZWN0X2dldF9ub19iaW5k+AETZGV2c19nZXRfcm9sZV9wcm90b/kBG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd/oBFWRldnNfZ2V0X3N0YXRpY19wcm90b/sBHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVt/AEVZGV2c19vYmplY3RfZ2V0X3Byb3Rv/QEYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxk/gEeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxk/wEQZGV2c19pbnN0YW5jZV9vZoACD2RldnNfb2JqZWN0X2dldIECDGRldnNfc2VxX2dldIICDGRldnNfYW55X2dldIMCDGRldnNfYW55X3NldIQCDGRldnNfc2VxX3NldIUCDmRldnNfYXJyYXlfc2V0hgIMZGV2c19hcmdfaW50hwIPZGV2c19hcmdfZG91YmxliAIPZGV2c19yZXRfZG91YmxliQIMZGV2c19yZXRfaW50igINZGV2c19yZXRfYm9vbIsCD2RldnNfcmV0X2djX3B0cowCEWRldnNfYXJnX3NlbGZfbWFwjQIRZGV2c19zZXR1cF9yZXN1bWWOAg9kZXZzX2Nhbl9hdHRhY2iPAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlkAISZGV2c19yZWdjYWNoZV9mcmVlkQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbJICF2RldnNfcmVnY2FjaGVfbWFya191c2VkkwITZGV2c19yZWdjYWNoZV9hbGxvY5QCFGRldnNfcmVnY2FjaGVfbG9va3VwlQIRZGV2c19yZWdjYWNoZV9hZ2WWAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZZcCEmRldnNfcmVnY2FjaGVfbmV4dJgCD2pkX3NldHRpbmdzX2dldJkCD2pkX3NldHRpbmdzX3NldJoCDmRldnNfbG9nX3ZhbHVlmwIPZGV2c19zaG93X3ZhbHVlnAIQZGV2c19zaG93X3ZhbHVlMJ0CDWNvbnN1bWVfY2h1bmueAg1zaGFfMjU2X2Nsb3NlnwIPamRfc2hhMjU2X3NldHVwoAIQamRfc2hhMjU2X3VwZGF0ZaECEGpkX3NoYTI1Nl9maW5pc2iiAhRqZF9zaGEyNTZfaG1hY19zZXR1cKMCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaKQCDmpkX3NoYTI1Nl9oa2RmpQIOZGV2c19zdHJmb3JtYXSmAg5kZXZzX2lzX3N0cmluZ6cCDmRldnNfaXNfbnVtYmVyqAIUZGV2c19zdHJpbmdfZ2V0X3V0ZjipAhNkZXZzX2J1aWx0aW5fc3RyaW5nqgIUZGV2c19zdHJpbmdfdnNwcmludGarAhNkZXZzX3N0cmluZ19zcHJpbnRmrAIVZGV2c19zdHJpbmdfZnJvbV91dGY4rQIUZGV2c192YWx1ZV90b19zdHJpbmeuAhBidWZmZXJfdG9fc3RyaW5nrwIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZLACEmRldnNfc3RyaW5nX2NvbmNhdLECEmRldnNfcHVzaF90cnlmcmFtZbICEWRldnNfcG9wX3RyeWZyYW1lswIPZGV2c19kdW1wX3N0YWNrtAITZGV2c19kdW1wX2V4Y2VwdGlvbrUCCmRldnNfdGhyb3e2AhVkZXZzX3Rocm93X3R5cGVfZXJyb3K3AhlkZXZzX3Rocm93X2ludGVybmFsX2Vycm9yuAIWZGV2c190aHJvd19yYW5nZV9lcnJvcrkCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcroCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yuwIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh0vAIYZGV2c190aHJvd190b29fYmlnX2Vycm9yvQIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY74CD3RzYWdnX2NsaWVudF9ldr8CCmFkZF9zZXJpZXPAAg10c2FnZ19wcm9jZXNzwQIKbG9nX3Nlcmllc8ICE3RzYWdnX2hhbmRsZV9wYWNrZXTDAhRsb29rdXBfb3JfYWRkX3Nlcmllc8QCCnRzYWdnX2luaXTFAgx0c2FnZ191cGRhdGXGAhZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlxwITZGV2c192YWx1ZV9mcm9tX2ludMgCFGRldnNfdmFsdWVfZnJvbV9ib29syQIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLKAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZcsCEWRldnNfdmFsdWVfdG9faW50zAISZGV2c192YWx1ZV90b19ib29szQIOZGV2c19pc19idWZmZXLOAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZc8CEGRldnNfYnVmZmVyX2RhdGHQAhNkZXZzX2J1ZmZlcmlzaF9kYXRh0QIUZGV2c192YWx1ZV90b19nY19vYmrSAg1kZXZzX2lzX2FycmF50wIRZGV2c192YWx1ZV90eXBlb2bUAg9kZXZzX2lzX251bGxpc2jVAhJkZXZzX3ZhbHVlX2llZWVfZXHWAh5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGPXAhJkZXZzX2ltZ19zdHJpZHhfb2vYAhJkZXZzX2R1bXBfdmVyc2lvbnPZAgtkZXZzX3ZlcmlmedoCEWRldnNfZmV0Y2hfb3Bjb2Rl2wIUZGV2c192bV9leGVjX29wY29kZXPcAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeN0CEWRldnNfaW1nX2dldF91dGY43gIUZGV2c19nZXRfc3RhdGljX3V0ZjjfAg9kZXZzX3ZtX3JvbGVfb2vgAgxleHByX2ludmFsaWThAhRleHByeF9idWlsdGluX29iamVjdOICC3N0bXQxX2NhbGww4wILc3RtdDJfY2FsbDHkAgtzdG10M19jYWxsMuUCC3N0bXQ0X2NhbGwz5gILc3RtdDVfY2FsbDTnAgtzdG10Nl9jYWxsNegCC3N0bXQ3X2NhbGw26QILc3RtdDhfY2FsbDfqAgtzdG10OV9jYWxsOOsCEnN0bXQyX2luZGV4X2RlbGV0ZewCDHN0bXQxX3JldHVybu0CCXN0bXR4X2ptcO4CDHN0bXR4MV9qbXBfeu8CC3N0bXQxX3Bhbmlj8AISZXhwcnhfb2JqZWN0X2ZpZWxk8QISc3RtdHgxX3N0b3JlX2xvY2Fs8gITc3RtdHgxX3N0b3JlX2dsb2JhbPMCEnN0bXQ0X3N0b3JlX2J1ZmZlcvQCCWV4cHIwX2luZvUCEGV4cHJ4X2xvYWRfbG9jYWz2AhFleHByeF9sb2FkX2dsb2JhbPcCC2V4cHIxX3VwbHVz+AILZXhwcjJfaW5kZXj5Ag9zdG10M19pbmRleF9zZXT6AhRleHByeDFfYnVpbHRpbl9maWVsZPsCEmV4cHJ4MV9hc2NpaV9maWVsZPwCEWV4cHJ4MV91dGY4X2ZpZWxk/QIQZXhwcnhfbWF0aF9maWVsZP4CDmV4cHJ4X2RzX2ZpZWxk/wIPc3RtdDBfYWxsb2NfbWFwgAMRc3RtdDFfYWxsb2NfYXJyYXmBAxJzdG10MV9hbGxvY19idWZmZXKCAxFleHByeF9zdGF0aWNfcm9sZYMDE2V4cHJ4X3N0YXRpY19idWZmZXKEAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmeFAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nhgMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nhwMVZXhwcnhfc3RhdGljX2Z1bmN0aW9uiAMNZXhwcnhfbGl0ZXJhbIkDEWV4cHJ4X2xpdGVyYWxfZjY0igMQZXhwcnhfcm9sZV9wcm90b4sDEWV4cHIzX2xvYWRfYnVmZmVyjAMNZXhwcjBfcmV0X3ZhbI0DDGV4cHIxX3R5cGVvZo4DCmV4cHIwX251bGyPAw1leHByMV9pc19udWxskAMKZXhwcjBfdHJ1ZZEDC2V4cHIwX2ZhbHNlkgMNZXhwcjFfdG9fYm9vbJMDCWV4cHIwX25hbpQDCWV4cHIxX2Fic5UDDWV4cHIxX2JpdF9ub3SWAwxleHByMV9pc19uYW6XAwlleHByMV9uZWeYAwlleHByMV9ub3SZAwxleHByMV90b19pbnSaAwlleHByMl9hZGSbAwlleHByMl9zdWKcAwlleHByMl9tdWydAwlleHByMl9kaXaeAw1leHByMl9iaXRfYW5knwMMZXhwcjJfYml0X29yoAMNZXhwcjJfYml0X3hvcqEDEGV4cHIyX3NoaWZ0X2xlZnSiAxFleHByMl9zaGlmdF9yaWdodKMDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkpAMIZXhwcjJfZXGlAwhleHByMl9sZaYDCGV4cHIyX2x0pwMIZXhwcjJfbmWoAxVzdG10MV90ZXJtaW5hdGVfZmliZXKpAxRzdG10eDJfc3RvcmVfY2xvc3VyZaoDE2V4cHJ4MV9sb2FkX2Nsb3N1cmWrAxJleHByeF9tYWtlX2Nsb3N1cmWsAxBleHByMV90eXBlb2Zfc3RyrQMMZXhwcjBfbm93X21zrgMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZa8DEHN0bXQyX2NhbGxfYXJyYXmwAwlzdG10eF90cnmxAw1zdG10eF9lbmRfdHJ5sgMLc3RtdDBfY2F0Y2izAw1zdG10MF9maW5hbGx5tAMLc3RtdDFfdGhyb3e1Aw5zdG10MV9yZV90aHJvd7YDEHN0bXR4MV90aHJvd19qbXC3Aw5zdG10MF9kZWJ1Z2dlcrgDCWV4cHIxX25ld7kDEWV4cHIyX2luc3RhbmNlX29mugMKZXhwcjJfYmluZLsDD2RldnNfdm1fcG9wX2FyZ7wDE2RldnNfdm1fcG9wX2FyZ191MzK9AxNkZXZzX3ZtX3BvcF9hcmdfaTMyvgMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcr8DEmpkX2Flc19jY21fZW5jcnlwdMADEmpkX2Flc19jY21fZGVjcnlwdMEDDEFFU19pbml0X2N0eMIDD0FFU19FQ0JfZW5jcnlwdMMDEGpkX2Flc19zZXR1cF9rZXnEAw5qZF9hZXNfZW5jcnlwdMUDEGpkX2Flc19jbGVhcl9rZXnGAwtqZF93c3NrX25ld8cDFGpkX3dzc2tfc2VuZF9tZXNzYWdlyAMTamRfd2Vic29ja19vbl9ldmVudMkDB2RlY3J5cHTKAw1qZF93c3NrX2Nsb3NlywMQamRfd3Nza19vbl9ldmVudMwDCnNlbmRfZW1wdHnNAxJ3c3NraGVhbHRoX3Byb2Nlc3POAxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZc8DFHdzc2toZWFsdGhfcmVjb25uZWN00AMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V00QMPc2V0X2Nvbm5fc3RyaW5n0gMRY2xlYXJfY29ubl9zdHJpbmfTAw93c3NraGVhbHRoX2luaXTUAxN3c3NrX3B1Ymxpc2hfdmFsdWVz1QMQd3Nza19wdWJsaXNoX2JpbtYDEXdzc2tfaXNfY29ubmVjdGVk1wMTd3Nza19yZXNwb25kX21ldGhvZNgDHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemXZAxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xl2gMPcm9sZW1ncl9wcm9jZXNz2wMQcm9sZW1ncl9hdXRvYmluZNwDFXJvbGVtZ3JfaGFuZGxlX3BhY2tldN0DFGpkX3JvbGVfbWFuYWdlcl9pbml03gMYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVk3wMNamRfcm9sZV9hbGxvY+ADEGpkX3JvbGVfZnJlZV9hbGzhAxZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5k4gMSamRfcm9sZV9ieV9zZXJ2aWNl4wMTamRfY2xpZW50X2xvZ19ldmVudOQDE2pkX2NsaWVudF9zdWJzY3JpYmXlAxRqZF9jbGllbnRfZW1pdF9ldmVudOYDFHJvbGVtZ3Jfcm9sZV9jaGFuZ2Vk5wMQamRfZGV2aWNlX2xvb2t1cOgDGGpkX2RldmljZV9sb29rdXBfc2VydmljZekDE2pkX3NlcnZpY2Vfc2VuZF9jbWTqAxFqZF9jbGllbnRfcHJvY2Vzc+sDDmpkX2RldmljZV9mcmVl7AMXamRfY2xpZW50X2hhbmRsZV9wYWNrZXTtAw9qZF9kZXZpY2VfYWxsb2PuAw9qZF9jdHJsX3Byb2Nlc3PvAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXTwAwxqZF9jdHJsX2luaXTxAw1qZF9pcGlwZV9vcGVu8gMWamRfaXBpcGVfaGFuZGxlX3BhY2tldPMDDmpkX2lwaXBlX2Nsb3Nl9AMSamRfbnVtZm10X2lzX3ZhbGlk9QMVamRfbnVtZm10X3dyaXRlX2Zsb2F09gMTamRfbnVtZm10X3dyaXRlX2kzMvcDEmpkX251bWZtdF9yZWFkX2kzMvgDFGpkX251bWZtdF9yZWFkX2Zsb2F0+QMRamRfb3BpcGVfb3Blbl9jbWT6AxRqZF9vcGlwZV9vcGVuX3JlcG9ydPsDFmpkX29waXBlX2hhbmRsZV9wYWNrZXT8AxFqZF9vcGlwZV93cml0ZV9leP0DEGpkX29waXBlX3Byb2Nlc3P+AxRqZF9vcGlwZV9jaGVja19zcGFjZf8DDmpkX29waXBlX3dyaXRlgAQOamRfb3BpcGVfY2xvc2WBBA1qZF9xdWV1ZV9wdXNoggQOamRfcXVldWVfZnJvbnSDBA5qZF9xdWV1ZV9zaGlmdIQEDmpkX3F1ZXVlX2FsbG9jhQQNamRfcmVzcG9uZF91OIYEDmpkX3Jlc3BvbmRfdTE2hwQOamRfcmVzcG9uZF91MzKIBBFqZF9yZXNwb25kX3N0cmluZ4kEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkigQLamRfc2VuZF9wa3SLBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbIwEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyjQQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldI4EFGpkX2FwcF9oYW5kbGVfcGFja2V0jwQVamRfYXBwX2hhbmRsZV9jb21tYW5kkAQTamRfYWxsb2NhdGVfc2VydmljZZEEEGpkX3NlcnZpY2VzX2luaXSSBA5qZF9yZWZyZXNoX25vd5MEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSUBBRqZF9zZXJ2aWNlc19hbm5vdW5jZZUEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1llgQQamRfc2VydmljZXNfdGlja5cEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ5gEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlmQQSYXBwX2dldF9md192ZXJzaW9umgQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZZsEDWpkX2hhc2hfZm52MWGcBAxqZF9kZXZpY2VfaWSdBAlqZF9yYW5kb22eBAhqZF9jcmMxNp8EDmpkX2NvbXB1dGVfY3JjoAQOamRfc2hpZnRfZnJhbWWhBAxqZF93b3JkX21vdmWiBA5qZF9yZXNldF9mcmFtZaMEEGpkX3B1c2hfaW5fZnJhbWWkBA1qZF9wYW5pY19jb3JlpQQTamRfc2hvdWxkX3NhbXBsZV9tc6YEEGpkX3Nob3VsZF9zYW1wbGWnBAlqZF90b19oZXioBAtqZF9mcm9tX2hleKkEDmpkX2Fzc2VydF9mYWlsqgQHamRfYXRvaasEC2pkX3ZzcHJpbnRmrAQPamRfcHJpbnRfZG91YmxlrQQKamRfc3ByaW50Zq4EEmpkX2RldmljZV9zaG9ydF9pZK8EDGpkX3NwcmludGZfYbAEC2pkX3RvX2hleF9hsQQUamRfZGV2aWNlX3Nob3J0X2lkX2GyBAlqZF9zdHJkdXCzBA5qZF9qc29uX2VzY2FwZbQEE2pkX2pzb25fZXNjYXBlX2NvcmW1BAlqZF9tZW1kdXC2BBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVltwQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZbgEEWpkX3NlbmRfZXZlbnRfZXh0uQQKamRfcnhfaW5pdLoEFGpkX3J4X2ZyYW1lX3JlY2VpdmVkuwQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2u8BA9qZF9yeF9nZXRfZnJhbWW9BBNqZF9yeF9yZWxlYXNlX2ZyYW1lvgQRamRfc2VuZF9mcmFtZV9yYXe/BA1qZF9zZW5kX2ZyYW1lwAQKamRfdHhfaW5pdMEEB2pkX3NlbmTCBBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjwwQPamRfdHhfZ2V0X2ZyYW1lxAQQamRfdHhfZnJhbWVfc2VudMUEC2pkX3R4X2ZsdXNoxgQQX19lcnJub19sb2NhdGlvbscEDF9fZnBjbGFzc2lmecgEBWR1bW15yQQIX19tZW1jcHnKBAdtZW1tb3ZlywQGbWVtc2V0zAQKX19sb2NrZmlsZc0EDF9fdW5sb2NrZmlsZc4EBmZmbHVzaM8EBGZtb2TQBA1fX0RPVUJMRV9CSVRT0QQMX19zdGRpb19zZWVr0gQNX19zdGRpb193cml0ZdMEDV9fc3RkaW9fY2xvc2XUBAhfX3RvcmVhZNUECV9fdG93cml0ZdYECV9fZndyaXRleNcEBmZ3cml0ZdgEFF9fcHRocmVhZF9tdXRleF9sb2Nr2QQWX19wdGhyZWFkX211dGV4X3VubG9ja9oEBl9fbG9ja9sECF9fdW5sb2Nr3AQOX19tYXRoX2Rpdnplcm/dBApmcF9iYXJyaWVy3gQOX19tYXRoX2ludmFsaWTfBANsb2fgBAV0b3AxNuEEBWxvZzEw4gQHX19sc2Vla+MEBm1lbWNtcOQECl9fb2ZsX2xvY2vlBAxfX29mbF91bmxvY2vmBAxfX21hdGhfeGZsb3fnBAxmcF9iYXJyaWVyLjHoBAxfX21hdGhfb2Zsb3fpBAxfX21hdGhfdWZsb3fqBARmYWJz6wQDcG937AQFdG9wMTLtBAp6ZXJvaW5mbmFu7gQIY2hlY2tpbnTvBAxmcF9iYXJyaWVyLjLwBApsb2dfaW5saW5l8QQKZXhwX2lubGluZfIEC3NwZWNpYWxjYXNl8wQNZnBfZm9yY2VfZXZhbPQEBXJvdW5k9QQGc3RyY2hy9gQLX19zdHJjaHJudWz3BAZzdHJjbXD4BAZzdHJsZW75BAdfX3VmbG93+gQHX19zaGxpbfsECF9fc2hnZXRj/AQHaXNzcGFjZf0EBnNjYWxibv4ECWNvcHlzaWdubP8EB3NjYWxibmyABQ1fX2ZwY2xhc3NpZnlsgQUFZm1vZGyCBQVmYWJzbIMFC19fZmxvYXRzY2FuhAUIaGV4ZmxvYXSFBQhkZWNmbG9hdIYFB3NjYW5leHCHBQZzdHJ0b3iIBQZzdHJ0b2SJBRJfX3dhc2lfc3lzY2FsbF9yZXSKBQhkbG1hbGxvY4sFBmRsZnJlZYwFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZY0FBHNicmuOBQhfX2FkZHRmM48FCV9fYXNobHRpM5AFB19fbGV0ZjKRBQdfX2dldGYykgUIX19kaXZ0ZjOTBQ1fX2V4dGVuZGRmdGYylAUNX19leHRlbmRzZnRmMpUFC19fZmxvYXRzaXRmlgUNX19mbG9hdHVuc2l0ZpcFDV9fZmVfZ2V0cm91bmSYBRJfX2ZlX3JhaXNlX2luZXhhY3SZBQlfX2xzaHJ0aTOaBQhfX211bHRmM5sFCF9fbXVsdGkznAUJX19wb3dpZGYynQUIX19zdWJ0ZjOeBQxfX3RydW5jdGZkZjKfBQtzZXRUZW1wUmV0MKAFC2dldFRlbXBSZXQwoQUJc3RhY2tTYXZlogUMc3RhY2tSZXN0b3JlowUKc3RhY2tBbGxvY6QFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSlBRVlbXNjcmlwdGVuX3N0YWNrX2luaXSmBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlpwUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZagFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZKkFDGR5bkNhbGxfamlqaaoFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammrBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGpBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(file);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // If we don't have the binary yet, try to to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
      && !isFileURI(wasmBinaryFile)
    ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
          return getBinary(wasmBinaryFile);
      });
    }
    else {
      if (readAsync) {
        // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
        return new Promise(function(resolve, reject) {
          readAsync(wasmBinaryFile, function(response) { resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))) }, reject)
        });
      }
    }
  }

  // Otherwise, getBinary should be able to get it synchronously
  return Promise.resolve().then(function() { return getBinary(wasmBinaryFile); });
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmMemory = Module['asm']['memory'];
    assert(wasmMemory, "memory not found in wasm exports");
    // This assertion doesn't hold when emscripten is run in --post-link
    // mode.
    // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
    //assert(wasmMemory.buffer.byteLength === 16777216);
    updateMemoryViews();

    wasmTable = Module['asm']['__indirect_function_table'];
    assert(wasmTable, "table not found in wasm exports");

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');

  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(function (instance) {
      return instance;
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);

      // Warn on some common problems.
      if (isFileURI(wasmBinaryFile)) {
        err('warning: Loading from a file URI (' + wasmBinaryFile + ') is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing');
      }
      abort(reason);
    });
  }

  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(wasmBinaryFile) &&
        // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
        !isFileURI(wasmBinaryFile) &&
        // Avoid instantiateStreaming() on Node.js environment for now, as while
        // Node.js v18.1.0 implements it, it does not have a full fetch()
        // implementation yet.
        //
        // Reference:
        //   https://github.com/emscripten-core/emscripten/pull/16917
        !ENVIRONMENT_IS_NODE &&
        typeof fetch == 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        // Suppress closure warning here since the upstream definition for
        // instantiateStreaming only allows Promise<Repsponse> rather than
        // an actual Response.
        // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
        /** @suppress {checkTypes} */
        var result = WebAssembly.instantiateStreaming(response, info);

        return result.then(
          receiveInstantiationResult,
          function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiationResult);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  // Also pthreads and wasm workers initialize the wasm instance through this path.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  // If instantiation fails, reject the module ready promise.
  instantiateAsync().catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  
};
function em_send_frame(frame) { const sz = 12 + HEAPU8[frame + 2]; const pkt = HEAPU8.slice(frame, frame + sz); Module.sendPacket(pkt) }
function _devs_panic_handler(exitcode) { console.log("PANIC", exitcode); if (Module.panicHandler) Module.panicHandler(exitcode); }
function em_deploy_handler(exitcode) { if (Module.deployHandler) Module.deployHandler(exitcode); }
function em_time_now() { return Date.now(); }
function em_jd_crypto_get_random(trg,size) { let buf = new Uint8Array(size); if (typeof window == "object" && window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf); else { buf = require("crypto").randomBytes(size); } HEAPU8.set(buf, trg); }
function em_console_debug(ptr) { const s = UTF8ToString(ptr, 1024); if (Module.dmesg) Module.dmesg(s); else console.debug(s); }




  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = 'Program terminated with exit(' + status + ')';
      this.status = status;
    }

  function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }

  function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    }

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': return HEAP8[((ptr)>>0)];
        case 'i8': return HEAP8[((ptr)>>0)];
        case 'i16': return HEAP16[((ptr)>>1)];
        case 'i32': return HEAP32[((ptr)>>2)];
        case 'i64': return HEAP32[((ptr)>>2)];
        case 'float': return HEAPF32[((ptr)>>2)];
        case 'double': return HEAPF64[((ptr)>>3)];
        case '*': return HEAPU32[((ptr)>>2)];
        default: abort('invalid type for getValue: ' + type);
      }
      return null;
    }

  function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      var chr = array[i];
      if (chr > 0xFF) {
        if (ASSERTIONS) {
          assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
        }
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }

  function ptrToString(ptr) {
      assert(typeof ptr === 'number');
      return '0x' + ptr.toString(16).padStart(8, '0');
    }

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': HEAP8[((ptr)>>0)] = value; break;
        case 'i8': HEAP8[((ptr)>>0)] = value; break;
        case 'i16': HEAP16[((ptr)>>1)] = value; break;
        case 'i32': HEAP32[((ptr)>>2)] = value; break;
        case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)] = tempI64[0],HEAP32[(((ptr)+(4))>>2)] = tempI64[1]); break;
        case 'float': HEAPF32[((ptr)>>2)] = value; break;
        case 'double': HEAPF64[((ptr)>>3)] = value; break;
        case '*': HEAPU32[((ptr)>>2)] = value; break;
        default: abort('invalid type for setValue: ' + type);
      }
    }

  function warnOnce(text) {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    }

  function _abort() {
      abort('native code called abort()');
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  function getHeapMax() {
      return HEAPU8.length;
    }
  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ' + HEAP8.length + ', (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0');
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      abortOnCannotGrowMemory(requestedSize);
    }

  var WS = {sockets:[null],socketEvent:null};
  function _emscripten_websocket_close(socketId, code, reason) {
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      var reasonStr = reason ? UTF8ToString(reason) : undefined;
      // According to WebSocket specification, only close codes that are recognized have integer values
      // 1000-4999, with 3000-3999 and 4000-4999 denoting user-specified close codes:
      // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
      // Therefore be careful to call the .close() function with exact number and types of parameters.
      // Coerce code==0 to undefined, since Wasm->JS call can only marshal integers, and 0 is not allowed.
      if (reason) socket.close(code || undefined, UTF8ToString(reason));
      else if (code) socket.close(code);
      else socket.close();
      return 0;
    }

  function _emscripten_websocket_is_supported() {
      return typeof WebSocket != 'undefined';
    }

  function _emscripten_websocket_new(createAttributes) {
      if (typeof WebSocket == 'undefined') {
        return -1;
      }
      if (!createAttributes) {
        return -5;
      }
  
      var createAttrs = createAttributes>>2;
      var url = UTF8ToString(HEAP32[createAttrs]);
      var protocols = HEAP32[createAttrs+1];
      // TODO: Add support for createOnMainThread==false; currently all WebSocket connections are created on the main thread.
      // var createOnMainThread = HEAP32[createAttrs+2];
  
      var socket = protocols ? new WebSocket(url, UTF8ToString(protocols).split(',')) : new WebSocket(url);
      // We always marshal received WebSocket data back to Wasm, so enable receiving the data as arraybuffers for easy marshalling.
      socket.binaryType = 'arraybuffer';
      // TODO: While strictly not necessary, this ID would be good to be unique across all threads to avoid confusion.
      var socketId = WS.sockets.length;
      WS.sockets[socketId] = socket;
  
      return socketId;
    }

  function _emscripten_websocket_send_binary(socketId, binaryData, dataLength) {
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      socket.send(HEAPU8.subarray((binaryData), (binaryData+dataLength)));
      return 0;
    }

  
  var wasmTableMirror = [];
  
  function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
      return func;
    }
  function _emscripten_websocket_set_onclose_callback_on_thread(socketId, userData, callbackFunc, thread) {
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024); // TODO: sizeof(EmscriptenWebSocketCloseEvent), which is the largest event struct
  
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      socket.onclose = function(e) {
        HEAPU32[WS.socketEvent>>2] = socketId;
        HEAPU32[(WS.socketEvent+4)>>2] = e.wasClean;
        HEAPU32[(WS.socketEvent+8)>>2] = e.code;
        stringToUTF8(e.reason, WS.socketEvent+10, 512);
        getWasmTableEntry(callbackFunc)(0/*TODO*/, WS.socketEvent, userData);
      }
      return 0;
    }

  
  function _emscripten_websocket_set_onerror_callback_on_thread(socketId, userData, callbackFunc, thread) {
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024); // TODO: sizeof(EmscriptenWebSocketCloseEvent), which is the largest event struct
  
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      socket.onerror = function(e) {
        HEAPU32[WS.socketEvent>>2] = socketId;
        getWasmTableEntry(callbackFunc)(0/*TODO*/, WS.socketEvent, userData);
      }
      return 0;
    }

  
  function _emscripten_websocket_set_onmessage_callback_on_thread(socketId, userData, callbackFunc, thread) {
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024); // TODO: sizeof(EmscriptenWebSocketCloseEvent), which is the largest event struct
  
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      socket.onmessage = function(e) {
        HEAPU32[WS.socketEvent>>2] = socketId;
        if (typeof e.data == 'string') {
          var len = lengthBytesUTF8(e.data)+1;
          var buf = _malloc(len);
          stringToUTF8(e.data, buf, len);
          HEAPU32[(WS.socketEvent+12)>>2] = 1; // text data
        } else {
          var len = e.data.byteLength;
          var buf = _malloc(len);
          HEAP8.set(new Uint8Array(e.data), buf);
          HEAPU32[(WS.socketEvent+12)>>2] = 0; // binary data
        }
        HEAPU32[(WS.socketEvent+4)>>2] = buf;
        HEAPU32[(WS.socketEvent+8)>>2] = len;
        getWasmTableEntry(callbackFunc)(0/*TODO*/, WS.socketEvent, userData);
        _free(buf);
      }
      return 0;
    }

  
  function _emscripten_websocket_set_onopen_callback_on_thread(socketId, userData, callbackFunc, thread) {
  // TODO:
  //    if (thread == 2 ||
  //      (thread == _pthread_self()) return emscripten_websocket_set_onopen_callback_on_calling_thread(socketId, userData, callbackFunc);
  
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024); // TODO: sizeof(EmscriptenWebSocketCloseEvent), which is the largest event struct
  
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
  
      socket.onopen = function(e) {
        HEAPU32[WS.socketEvent>>2] = socketId;
        getWasmTableEntry(callbackFunc)(0/*TODO*/, WS.socketEvent, userData);
      }
      return 0;
    }

  
  var SYSCALLS = {varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      }};
  function _proc_exit(code) {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module['onExit']) Module['onExit'](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    }
  /** @param {boolean|number=} implicit */
  function exitJS(status, implicit) {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
        readyPromiseReject(msg);
        err(msg);
      }
  
      _proc_exit(status);
    }
  var _exit = exitJS;

  function _fd_close(fd) {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    }

  function convertI32PairToI53Checked(lo, hi) {
      assert(lo == (lo >>> 0) || lo == (lo|0)); // lo should either be a i32 or a u32
      assert(hi === (hi|0));                    // hi should be a i32
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    }
  
  
  
  
  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      return 70;
    }

  var printCharBuffers = [null,[],[]];
  function printChar(stream, curr) {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    }
  
  function flush_NO_FILESYSTEM() {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    }
  
  
  function _fd_write(fd, iov, iovcnt, pnum) {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    }
var ASSERTIONS = true;

// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {string} input The string to decode.
 */
var decodeBase64 = typeof atob == 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE == 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf['buffer'], buf['byteOffset'], buf['byteLength']);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var asmLibraryArg = {
  "_devs_panic_handler": _devs_panic_handler,
  "abort": _abort,
  "em_console_debug": em_console_debug,
  "em_deploy_handler": em_deploy_handler,
  "em_jd_crypto_get_random": em_jd_crypto_get_random,
  "em_send_frame": em_send_frame,
  "em_time_now": em_time_now,
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "emscripten_websocket_close": _emscripten_websocket_close,
  "emscripten_websocket_is_supported": _emscripten_websocket_is_supported,
  "emscripten_websocket_new": _emscripten_websocket_new,
  "emscripten_websocket_send_binary": _emscripten_websocket_send_binary,
  "emscripten_websocket_set_onclose_callback_on_thread": _emscripten_websocket_set_onclose_callback_on_thread,
  "emscripten_websocket_set_onerror_callback_on_thread": _emscripten_websocket_set_onerror_callback_on_thread,
  "emscripten_websocket_set_onmessage_callback_on_thread": _emscripten_websocket_set_onmessage_callback_on_thread,
  "emscripten_websocket_set_onopen_callback_on_thread": _emscripten_websocket_set_onopen_callback_on_thread,
  "exit": _exit,
  "fd_close": _fd_close,
  "fd_seek": _fd_seek,
  "fd_write": _fd_write
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = createExportWrapper("malloc");

/** @type {function(...*):?} */
var _free = Module["_free"] = createExportWrapper("free");

/** @type {function(...*):?} */
var _jd_em_set_device_id_2x_i32 = Module["_jd_em_set_device_id_2x_i32"] = createExportWrapper("jd_em_set_device_id_2x_i32");

/** @type {function(...*):?} */
var _jd_em_set_device_id_string = Module["_jd_em_set_device_id_string"] = createExportWrapper("jd_em_set_device_id_string");

/** @type {function(...*):?} */
var _jd_em_init = Module["_jd_em_init"] = createExportWrapper("jd_em_init");

/** @type {function(...*):?} */
var _jd_em_process = Module["_jd_em_process"] = createExportWrapper("jd_em_process");

/** @type {function(...*):?} */
var _jd_em_frame_received = Module["_jd_em_frame_received"] = createExportWrapper("jd_em_frame_received");

/** @type {function(...*):?} */
var _jd_em_devs_deploy = Module["_jd_em_devs_deploy"] = createExportWrapper("jd_em_devs_deploy");

/** @type {function(...*):?} */
var _jd_em_devs_verify = Module["_jd_em_devs_verify"] = createExportWrapper("jd_em_devs_verify");

/** @type {function(...*):?} */
var _jd_em_devs_client_deploy = Module["_jd_em_devs_client_deploy"] = createExportWrapper("jd_em_devs_client_deploy");

/** @type {function(...*):?} */
var _jd_em_devs_enable_gc_stress = Module["_jd_em_devs_enable_gc_stress"] = createExportWrapper("jd_em_devs_enable_gc_stress");

/** @type {function(...*):?} */
var _fflush = Module["_fflush"] = createExportWrapper("fflush");

/** @type {function(...*):?} */
var _emscripten_stack_init = Module["_emscripten_stack_init"] = function() {
  return (_emscripten_stack_init = Module["_emscripten_stack_init"] = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = function() {
  return (_emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = function() {
  return (_emscripten_stack_get_base = Module["_emscripten_stack_get_base"] = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = function() {
  return (_emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

/** @type {function(...*):?} */
var _emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = function() {
  return (_emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = Module["asm"]["emscripten_stack_get_current"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

var ___start_em_js = Module['___start_em_js'] = 24392;
var ___stop_em_js = Module['___stop_em_js'] = 25118;



// === Auto-generated postamble setup entry stuff ===


var unexportedRuntimeSymbols = [
  'run',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'FS_createFolder',
  'FS_createPath',
  'FS_createDataFile',
  'FS_createPreloadedFile',
  'FS_createLazyFile',
  'FS_createLink',
  'FS_createDevice',
  'FS_unlink',
  'getLEB',
  'getFunctionTables',
  'alignFunctionTables',
  'registerFunctions',
  'prettyPrint',
  'getCompilerSetting',
  'out',
  'err',
  'callMain',
  'abort',
  'keepRuntimeAlive',
  'wasmMemory',
  'stackAlloc',
  'stackSave',
  'stackRestore',
  'getTempRet0',
  'setTempRet0',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'ptrToString',
  'zeroMemory',
  'stringToNewUTF8',
  'exitJS',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'emscripten_realloc_buffer',
  'ENV',
  'ERRNO_CODES',
  'ERRNO_MESSAGES',
  'setErrNo',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'DNS',
  'getHostByName',
  'Protocols',
  'Sockets',
  'getRandomDevice',
  'warnOnce',
  'traverseStack',
  'UNWIND_CACHE',
  'convertPCtoSourceLocation',
  'readEmAsmArgsArray',
  'readEmAsmArgs',
  'runEmAsmFunction',
  'runMainThreadEmAsm',
  'jstoi_q',
  'jstoi_s',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'handleException',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'safeSetTimeout',
  'asmjsMangle',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'handleAllocator',
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'getCFunc',
  'ccall',
  'cwrap',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'freeTableIndexes',
  'functionsInTableMap',
  'getEmptyTableSlot',
  'updateTableMap',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16Decoder',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'writeStringToMemory',
  'writeArrayToMemory',
  'writeAsciiToMemory',
  'SYSCALLS',
  'getSocketFromFD',
  'getSocketAddress',
  'JSEvents',
  'registerKeyEventCallback',
  'specialHTMLTargets',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'demangle',
  'demangleAll',
  'jsStackTrace',
  'stackTrace',
  'ExitStatus',
  'getEnvStrings',
  'checkWasiClock',
  'flush_NO_FILESYSTEM',
  'dlopenMissingError',
  'createDyncallWrapper',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'promiseMap',
  'newNativePromise',
  'getPromise',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'ExceptionInfo',
  'exception_addRef',
  'exception_decRef',
  'Browser',
  'setMainLoop',
  'wget',
  'FS',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  '_setNetworkCallback',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'heapObjectForWebGLType',
  'heapAccessShiftForWebGLHeap',
  'GL',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  'writeGLArray',
  'AL',
  'SDL_unicode',
  'SDL_ttfContext',
  'SDL_audio',
  'SDL',
  'SDL_gfx',
  'GLUT',
  'EGL',
  'GLFW_Window',
  'GLFW',
  'GLEW',
  'IDBStore',
  'runAndAbortIfError',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'WS',
];
unexportedRuntimeSymbols.forEach(unexportedRuntimeSymbol);
var missingLibrarySymbols = [
  'zeroMemory',
  'stringToNewUTF8',
  'emscripten_realloc_buffer',
  'setErrNo',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'getHostByName',
  'getRandomDevice',
  'traverseStack',
  'convertPCtoSourceLocation',
  'readEmAsmArgs',
  'runEmAsmFunction',
  'runMainThreadEmAsm',
  'jstoi_q',
  'jstoi_s',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'handleException',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'safeSetTimeout',
  'asmjsMangle',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'handleAllocator',
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertU32PairToI53',
  'getCFunc',
  'ccall',
  'cwrap',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'intArrayFromString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'allocateUTF8OnStack',
  'writeStringToMemory',
  'writeArrayToMemory',
  'writeAsciiToMemory',
  'getSocketFromFD',
  'getSocketAddress',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'demangle',
  'demangleAll',
  'jsStackTrace',
  'stackTrace',
  'getEnvStrings',
  'checkWasiClock',
  'createDyncallWrapper',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'newNativePromise',
  'getPromise',
  'ExceptionInfo',
  'exception_addRef',
  'exception_decRef',
  'setMainLoop',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'heapAccessShiftForWebGLHeap',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  'writeGLArray',
  'SDL_unicode',
  'SDL_ttfContext',
  'SDL_audio',
  'GLFW_Window',
  'runAndAbortIfError',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)


var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();





  return Module.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;
