
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABrYKAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2ABfAF8YAV/fn5+fgBgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAF+AX9gA39+fwF+YAABfmABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgA39/fwF8YAl/f39/f39/f38AYAh/f39/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgB39/f39/f38AYAJ/fwF+YAJ/fQBgAn5+AXxgBH9/fn8BfmAEf35/fwF/AruFgIAAFQNlbnYFYWJvcnQABwNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgAAA2VudhFlbV9kZXBsb3lfaGFuZGxlcgAAA2VudhdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQACA2Vudg1lbV9zZW5kX2ZyYW1lAAADZW52EGVtX2NvbnNvbGVfZGVidWcAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA5uFgIAAmQUHAQAHBwgHAAAHBAAIBwcFBQAAAgMCAAcHAgQDAwMAEgcSBwcDBgcCBwcDCQUFBQUHAAgFFhwMDQUCBgMGAAACAgAAAAQDBAICAgMABgACBgAAAwICAgADAwMDBQAAAAIBAAUABQUDAgICAgMEAwMDBQIIAAEBAAAAAAAAAQAAAAAAAAAAAAAAAAABAAEBAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAwAAgIAAQEBAAEAAAEAAAwAAQIAAQIDBAUBAgAAAgAACAEDBgMFBgkGBQYFAwYGBgYJDQYDAwUFAwMDBgUGBgYGBgYDDg8CAgIEAQMBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGAQMCAgEGDAYBBgYBBAYCAAICBQAPDwICBg4DAwMDBQUDAwMEBQEDAAMDAAQFBQMBAQICAgICAgICAgICAgICAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAgQEAQwNAgIAAAcJAwEDBwEAAAgAAgYABwUDCAkEBAAAAgcAAwcHBAECAQAQAwkHAAAEAAIHBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQHBwcHBAcHBwgIAxIIAwAEAQAJAQMDAQMGBAkgCRcDAxAEAwUDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghEQUEBAQFCQQEAAAUCgoKEwoRBQgHIgoUFAoYExAQCiMkJSYKAwMDBAQXBAQZCxUnCygGFikqBg4EBAAIBAsVGhoLDysCAggIFQsLGQssAAgIAAQIBwgICC0NLgSHgICAAAFwAcEBwQEFhoCAgAABAYACgAIGz4CAgAAMfwFBgNQFC38BQQALfwFBAAt/AUEAC38AQci/AQt/AEHEwAELfwBBssEBC38AQYLCAQt/AEGjwgELfwBBqMQBC38AQci/AQt/AEGexQELB82FgIAAIQZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAVEF9fZXJybm9fbG9jYXRpb24AyAQZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABm1hbGxvYwCMBQRmcmVlAI0FGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACoaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKwpqZF9lbV9pbml0ACwNamRfZW1fcHJvY2VzcwAtFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBBxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwUaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDBhRfX2VtX2pzX19lbV90aW1lX25vdwMHIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwgZX19lbV9qc19fZW1fY29uc29sZV9kZWJ1ZwMJBmZmbHVzaADQBBVlbXNjcmlwdGVuX3N0YWNrX2luaXQApwUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQCoBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAKkFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZACqBQlzdGFja1NhdmUAowUMc3RhY2tSZXN0b3JlAKQFCnN0YWNrQWxsb2MApQUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudACmBQ1fX3N0YXJ0X2VtX2pzAwoMX19zdG9wX2VtX2pzAwsMZHluQ2FsbF9qaWppAKwFCfmCgIAAAQBBAQvAASk6QUJDRF1eYVZcYmPHAYoBiwGMAY0BjgGPAZABkQGSAZMBlAGVAZYBlwGYAZkBmgGbAZwBnQGeAZ8BoAGhAaIBowGkAaUBpgGnAagBqQGqAasBrAGtAa4BsAGxAbIBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcYByQHKAcsBzAHNAc4BzwHQAdEB0gHTAcACwgLEAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AoADgQOCA4MDhAOFA4YDhwOIA4kDigOLA4wDjQOOA48DkAORA5IDkwOUA5UDlgOXA5gDmQOaA5sDnAOdA54DnwOgA6EDogOjA6QDpQOmA6cDqAOpA6oDqwOsA60DrgOvA7ADsQOyA7MDtAO1A7YDtwO4A7kDugO7A7wDzwPSA9YD1wNI2APZA9wD3gPwA/EDuQTVBNQE0wQK9cSIgACZBQUAEKcFC9YBAQJ/AkACQAJAAkBBACgCoMUBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgCpMUBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtB58EAQc40QRRBpx4QqwQACwJAA0AgACADIgNqLQAAQf8BRw0BIANBAWoiBCEDIAQgAkYNBQwACwALQYAjQc40QRZBpx4QqwQAC0GdPEHONEEQQaceEKsEAAtB98EAQc40QRJBpx4QqwQAC0GDJEHONEETQaceEKsEAAsgACABIAIQywQaC3gBAX8CQAJAAkBBACgCoMUBIgFFDQAgACABayIBQQBIDQEgAUEAKAKkxQFBgHBqSw0BIAFB/w9xDQIgAEH/AUGAEBDNBBoPC0GdPEHONEEbQcomEKsEAAtB4DxBzjRBHUHKJhCrBAALQfDCAEHONEEeQcomEKsEAAsCAAsgAEEAQYCAAjYCpMUBQQBBgIACEB82AqDFAUGgxQEQYAsIAEHv6Jb/AwsFABAAAAsCAAsCAAsCAAscAQF/AkAgABCMBSIBDQAQAAALIAFBACAAEM0ECwcAIAAQjQULBABBAAsKAEGoxQEQ2gQaCwoAQajFARDbBBoLfQEDf0HExQEhAwJAA0ACQCADKAIAIgQNAEEAIQUMAgsgBCEDIAQhBSAEKAIEIAAQ+QQNAAsLAkAgBSIEDQBBfw8LQX8hAwJAIAQoAggiBUUNAAJAIAQoAgwiAyACIAMgAkkbIgNFDQAgASAFIAMQywQaCyAEKAIMIQMLIAMLtAEBA39BxMUBIQMCQAJAAkADQCADKAIAIgRFDQEgBCEDIAQhBSAEKAIEIAAQ+QQNAAwCCwALQRAQjAUiBEUNASAEQgA3AAAgBEEIakIANwAAIARBACgCxMUBNgIAIAQgABC0BDYCBEEAIAQ2AsTFASAEIQULIAUiBCgCCBCNBQJAAkAgAQ0AQQAhA0EAIQAMAQsgASACELcEIQMgAiEACyAEIAA2AgwgBCADNgIIQQAPCxAAAAsGACAAEAELBgAgABACCwgAIAAgARADCwgAIAEQBEEACxMAQQAgAK1CIIYgAayENwOouwELaAICfwF+IwBBEGsiASQAAkACQCAAEPoEQRBHDQAgAUEIaiAAEKoEQQhHDQAgASkDCCEDDAELIAAgABD6BCICEJ0ErUIghiAAQQFqIAJBf2oQnQSthCEDC0EAIAM3A6i7ASABQRBqJAALJQACQEEALQDIxQENAEEAQQE6AMjFAUHMygBBABA8ELsEEJMECwtlAQF/IwBBMGsiACQAAkBBAC0AyMUBQQFHDQBBAEECOgDIxQEgAEErahCeBBCwBCAAQRBqQai7AUEIEKkEIAAgAEErajYCBCAAIABBEGo2AgBBoRMgABAuCxCZBBA+IABBMGokAAtJAQF/IwBB4AFrIgIkAAJAAkAgAEElEPcEDQAgABAFDAELIAIgATYCDCACQRBqQccBIAAgARCtBBogAkEQahAFCyACQeABaiQACywAAkAgAEECaiAALQACQQpqEKAEIAAvAQBGDQBBuT1BABAuQX4PCyAAELwECwgAIAAgARBfCwkAIAAgARDbAgsIACAAIAEQOQsVAAJAIABFDQBBARDjAQ8LQQEQ5AELCQBBACkDqLsBCw4AQb4OQQAQLkEAEAYAC54BAgF8AX4CQEEAKQPQxQFCAFINAAJAAkAQB0QAAAAAAECPQKIiAEQAAAAAAADwQ2MgAEQAAAAAAAAAAGZxRQ0AIACxIQEMAQtCACEBC0EAIAFChX98NwPQxQELAkACQBAHRAAAAAAAQI9AoiIARAAAAAAAAPBDYyAARAAAAAAAAAAAZnFFDQAgALEhAQwBC0IAIQELIAFBACkD0MUBfQsCAAsXABDfAxAZENUDQZDjABBlQZDjABDGAgsdAEHYxQEgATYCBEEAIAA2AtjFAUECQQAQ5gNBAAvNBAEBfyMAQRBrIgQkAAJAAkACQAJAAkAgAUF/ag4QAwIEBAQEBAQEBAQEBAQEAQALIAFBMEcNA0HYxQEtAAxFDQMCQAJAQdjFASgCBEHYxQEoAggiAmsiAUHgASABQeABSBsiAQ0AQdjFAUEUahCCBCECDAELQdjFAUEUakEAKALYxQEgAmogARCBBCECCyACDQNB2MUBQdjFASgCCCABajYCCCABDQNBwidBABAuQdjFAUGAAjsBDEEAECcMAwsgAkUNAkEAKALYxQFFDQJB2MUBKAIQIAJHDQICQCADLQADQQFxDQAgAy8BDkGAAUcNAEGuJ0EAEC5B2MUBQRRqIAMQ/AMNAEHYxQFBAToADAtB2MUBLQAMRQ0CAkACQEHYxQEoAgRB2MUBKAIIIgJrIgFB4AEgAUHgAUgbIgENAEHYxQFBFGoQggQhAgwBC0HYxQFBFGpBACgC2MUBIAJqIAEQgQQhAgsgAg0CQdjFAUHYxQEoAgggAWo2AgggAQ0CQcInQQAQLkHYxQFBgAI7AQxBABAnDAILQdjFASgCECIBRQ0BIAFBACABLQAEa0EMbGpBXGogAkcNAUGOygBBE0EBQQAoAsC6ARDZBBpB2MUBQQA2AhAMAQtBACgC2MUBRQ0AQdjFASgCEA0AIAIpAwgQngRRDQBB2MUBIAJBq9TTiQEQ6gMiATYCECABRQ0AIARBC2ogAikDCBCwBCAEIARBC2o2AgBB0BQgBBAuQdjFASgCEEGAAUHYxQFBBGpBBBDrAxoLIARBEGokAAsuABA+EDcCQEH0xwFBiCcQpwRFDQBB3CdBACkD0M0BukQAAAAAAECPQKMQxwILCxcAQQAgADYC/McBQQAgATYC+McBEMIECwsAQQBBAToAgMgBC1cBAn8CQEEALQCAyAFFDQADQEEAQQA6AIDIAQJAEMUEIgBFDQACQEEAKAL8xwEiAUUNAEEAKAL4xwEgACABKAIMEQMAGgsgABDGBAtBAC0AgMgBDQALCwsgAQF/AkBBACgChMgBIgINAEF/DwsgAigCACAAIAEQCAvYAgEDfyMAQdAAayIEJAACQAJAAkACQBAJDQBBgixBABAuQX8hBQwBCwJAQQAoAoTIASIFRQ0AIAUoAgAiBkUNACAGQegHQaPKABAPGiAFQQA2AgQgBUEANgIAQQBBADYChMgBC0EAQQgQHyIFNgKEyAEgBSgCAA0BIABB4gsQ+QQhBiAEIAI2AiwgBCABNgIoIAQgADYCJCAEQdYQQdMQIAYbNgIgQYYTIARBIGoQsQQhAiAEQQE2AkggBCADNgJEIAQgAjYCQCAEQcAAahAKIgBBAEwNAiAAIAVBA0ECEAsaIAAgBUEEQQIQDBogACAFQQVBAhANGiAAIAVBBkECEA4aIAUgADYCACAEIAI2AgBByRMgBBAuIAIQIEEAIQULIARB0ABqJAAgBQ8LIARBl8AANgIwQZUVIARBMGoQLhAAAAsgBEGNPzYCEEGVFSAEQRBqEC4QAAALKgACQEEAKAKEyAEgAkcNAEG/LEEAEC4gAkEBNgIEQQFBAEEAEMoDC0EBCyQAAkBBACgChMgBIAJHDQBBgsoAQQAQLkEDQQBBABDKAwtBAQsqAAJAQQAoAoTIASACRw0AQbkmQQAQLiACQQA2AgRBAkEAQQAQygMLQQELVAEBfyMAQRBrIgMkAAJAQQAoAoTIASACRw0AIAEoAgQhAgJAIAEoAgxFDQAgAyACNgIAQd/JACADEC4MAQtBBCACIAEoAggQygMLIANBEGokAEEBC0ABAn8CQEEAKAKEyAEiAEUNACAAKAIAIgFFDQAgAUHoB0GjygAQDxogAEEANgIEIABBADYCAEEAQQA2AoTIAQsLMQEBf0EAQQwQHyIBNgKIyAEgASAANgIAIAEgACgCECIAQYAIIABBgAhJG0FYajsBCgu+BAELfyMAQRBrIgAkAEEAKAKIyAEhAQJAAkAQIQ0AQQAhAiABLwEIRQ0BAkAgASgCACgCDBEIAA0AQX8hAgwCCyABIAEvAQhBKGoiAjsBCCACQf//A3EQHyIDQcqIiZIFNgAAIANBACkD0M0BNwAEQQAoAtDNASEEIAFBBGoiBSECIANBKGohBgNAIAYhBwJAAkACQAJAIAIoAgAiAg0AIAcgA2sgAS8BCCICRg0BQb4kQbAzQf4AQc8gEKsEAAsgAigCBCEGIAcgBiAGEPoEQQFqIggQywQgCGoiBiACLQAIQRhsIglBgICA+AByNgAAIAZBBGohCkEAIQYgAi0ACCIIDQEMAgsgAyACIAEoAgAoAgQRAwAhBiAAIAEvAQg2AgBB8BFB1hEgBhsgABAuIAMQICAGIQIgBg0EIAFBADsBCAJAIAEoAgQiAkUNACACIQIDQCAFIAIiAigCADYCACACKAIEECAgAhAgIAUoAgAiBiECIAYNAAsLQQAhAgwECwNAIAIgBiIGQRhsakEMaiIHIAQgBygCAGs2AgAgBkEBaiIHIQYgByAIRw0ACwsgCiACQQxqIAkQywQhCkEAIQYCQCACLQAIIghFDQADQCACIAYiBkEYbGpBDGoiByAEIAcoAgBrNgIAIAZBAWoiByEGIAcgCEcNAAsLIAIhAiAKIAlqIgchBiAHIANrIAEvAQhMDQALQdkkQbAzQfsAQc8gEKsEAAtBsDNB0wBBzyAQpgQACyAAQRBqJAAgAgvsBgIJfwF8IwBBgAFrIgMkAEEAKAKIyAEhBAJAECENACAAQaPKACAAGyEFAkACQCABRQ0AIAFBACABLQAEIgZrQQxsakFcaiEHQQAhCAJAIAZBAkkNACABKAIAIQlBACEAQQEhCgNAIAAgByAKIgpBDGxqQSRqKAIAIAlGaiIAIQggACEAIApBAWoiCyEKIAsgBkcNAAsLIAghACADIAcpAwg3A3ggA0H4AGpBCBCyBCEKAkACQCABKAIAEL8CIgtFDQAgAyALKAIANgJ0IAMgCjYCcEGaEyADQfAAahCxBCEKAkAgAA0AIAohAAwCCyADIAo2AmAgAyAAQQFqNgJkQcAuIANB4ABqELEEIQAMAQsgAyABKAIANgJUIAMgCjYCUEHQCSADQdAAahCxBCEKAkAgAA0AIAohAAwBCyADIAo2AkAgAyAAQQFqNgJEQcYuIANBwABqELEEIQALIAAhAAJAIAUtAAANACAAIQAMAgsgAyAFNgI0IAMgADYCMEGTEyADQTBqELEEIQAMAQsgAxCeBDcDeCADQfgAakEIELIEIQAgAyAFNgIkIAMgADYCIEGaEyADQSBqELEEIQALIAIrAwghDCADQRBqIAMpA3gQswQ2AgAgAyAMOQMIIAMgACILNgIAQefFACADEC4gBEEEaiIIIQoCQANAIAooAgAiAEUNASAAIQogACgCBCALEPkEDQALCwJAAkACQCAELwEIQQAgCxD6BCIHQQVqIAAbakEYaiIGIAQvAQpKDQACQCAADQBBACEHIAYhBgwCCyAALQAIQQhPDQAgACEHIAYhBgwBCwJAAkAQRyIKRQ0AIAsQICAAIQAgBiEGDAELQQAhACAHQR1qIQYLIAAhByAGIQYgCiEAIAoNAQsgBiEKAkACQCAHIgBFDQAgCxAgIAAhAAwBC0HMARAfIgAgCzYCBCAAIAgoAgA2AgAgCCAANgIAIAAhAAsgACIAIAAtAAgiC0EBajoACCAAIAtBGGxqIgBBDGogAigCJCILNgIAIABBEGogAisDCLY4AgAgAEEUaiACKwMQtjgCACAAQRhqIAIrAxi2OAIAIABBHGogAigCADYCACAAQSBqIAsgAigCIGs2AgAgBCAKOwEIQQAhAAsgA0GAAWokACAADwtBsDNBowFB7C0QpgQAC84CAQJ/IwBBMGsiBiQAAkACQAJAAkAgAhD2Aw0AIAAgAUHBK0EAELoCDAELIAYgBCkDADcDGCABIAZBGGogBkEsahDSAiIHRQ0BAkBBASACQQNxdCADaiAGKAIsTQ0AAkAgBUUNACAAIAFBzShBABC6AgwCCyAAQgA3AwAMAQsgByADaiEDAkAgBUUNACAGIAQpAwA3AxAgASAGQRBqENACRQ0DIAYgBSkDADcDIAJAAkAgBigCJEF/Rw0AIAMgAiAGKAIgEPgDDAELIAYgBikDIDcDCCADIAIgASAGQQhqEMwCEPcDCyAAQgA3AwAMAQsCQCACQQdLDQAgAyACEPkDIgFBgYCAgHhqQQJJDQAgACABEMkCDAELIAAgAyACEPoDEMgCCyAGQTBqJAAPC0HCPEHJM0EVQZMaEKsEAAtBmcYAQckzQSJBkxoQqwQACyAAAkAgASACQQNxdg0ARAAAAAAAAPh/DwsgACACEPoDC+8DAQJ/IAMoAgAhBQJAAkACQAJAAkACQAJAAkACQAJAIAJBBHRBMHEgAkEEdnJBfyACQQxxQQxGG0EBag4IAQMEBwACCAgJCyAEQQBHIQICQCAEDQBBACEGIAIhBAwGCyAFLQAADQRBACEGIAIhBAwFCwJAIAIQ9gMNACAAIAFBwStBABC6Ag8LAkBBASACQQNxdCIBIARNDQAgAEIANwMADwsgAyADKAIAIAFqNgIAAkAgAkEHSw0AIAUgAhD5AyIEQYGAgIB4akECSQ0AIAAgBBDJAg8LIAAgBSACEPoDEMgCDwsCQCAEDQAgAEIANwMADwsgAyAFQQFqNgIAIABBoNsAQajbACAFLQAAGykDADcDAA8LIABCADcDAA8LAkAgASAEEIMBIgINACAAQgA3AwAPCyADIAMoAgAgBGo2AgAgAkEMaiAFIAQQywQaIAAgAUEIIAIQywIPC0EAIQYCQAJAA0AgBkEBaiICIARGDQEgAiEGIAUgAmotAAANAAsgAiEGDAELIAQhBgsgBiEGIAIgBEkhBAsgAyAFIAYiAmogBGo2AgAgACABQQggASAFIAIQhQEQywIPCyADIAUgBGo2AgAgACABQQggASAFIAQQhQEQywIPCyAAIAFBoBIQuwIPCyAAIAFB8g0QuwIL7AMBA38jAEHAAGsiBSQAIAFBBHRBMHEgAUEEdnJBfyABQQxxQQxGGyIGIQcCQAJAAkACQAJAAkAgBkEBag4IAAUCAgIBAwMECwJAIAEQ9gMNACAFQThqIABBwStBABC6AkEAIQcMBQsCQEEBIAFBA3F0IgcgA00NACAHIQcMBQsCQCAEKAIEQX9HDQAgAiABIAQoAgAQ+AMgByEHDAULIAUgBCkDADcDCCACIAEgACAFQQhqEMwCEPcDIAchBwwECwJAIAMNAEEBIQcMBAsgBSAEKQMANwMQIAJBACAAIAVBEGoQzgJrOgAAQQEhBwwDCyAFIAQpAwA3AyggACAFQShqIAVBNGoQ0gIiByEBAkACQCAHDQAgBSAEKQMANwMgIAVBOGogACAFQSBqEK8CIAQgBSkDODcDACAFIAQpAwA3AxggACAFQRhqIAVBNGoQ0gIiByEBIAcNAEEAIQEMAQsgASEHAkAgBSgCNCADTQ0AIAUgAzYCNAsgAiAHIAUoAjQiARDLBCEHAkAgBkEDRw0AIAEgA08NACAHIAFqQQA6AAAgBSABQQFqNgI0CyAFKAI0IQELIAEhBwwCCyAFQThqIABBoBIQuwJBACEHDAELIAVBOGogAEHyDRC7AkEAIQcLIAVBwABqJAAgBwtbAQF/AkAgAUHnAEsNAEHIHkEAEC5BAA8LIAAgARDbAiEDIAAQ2gJBACEBAkAgAw0AQcAHEB8iASACLQAAOgDcASABIAEvAQZBCHI7AQYgASAAEE4gASEBCyABC5QBACAAIAE2AqQBIAAQhwE2AtgBIAAgACAAKAKkAS8BDEEDdBB7NgIAIAAgACAAKACkAUE8aigCAEEDdkEMbBB7NgK0ASAAIAAQgQE2AqABAkAgAC8BCA0AIAAQcyAAENgBIAAQ4AEgAC8BCA0AIAAoAtgBIAAQhgEgAEEBOgBDIABCgICAgDA3A1AgAEEAQQEQcBoLCyoBAX8CQCAALQAGQQhxDQAgACgCyAEgACgCwAEiBEYNACAAIAQ2AsgBCwsZAAJAIAFFDQAgASAALwEKNgIACyAALwEIC5wCAQF/AkACQAJAIABFDQAgAC8BBiIEQQFxDQEgACAEQQFyOwEGAkACQCABQTBGDQAgABBzAkACQAJAAkAgAUFwag4DAAIBAwsCQCAALQAGQQhxDQAgACgCyAEgACgCwAEiAUYNACAAIAE2AsgBCyAAIAIgAxDeAQwECyAALQAGQQhxDQMgACgCyAEgACgCwAEiAUYNAyAAIAE2AsgBDAMLIAAtAAZBCHENAiAAKALIASAAKALAASIBRg0CIAAgATYCyAEMAgsgAUHAAEcNASAAIAMQ3wEMAQsgABB2CyAALwEGIgFBAXFFDQIgACABQf7/A3E7AQYLDwtBycAAQd4xQcQAQdkXEKsEAAtByMMAQd4xQckAQb8lEKsEAAtwAQF/IAAQ4QECQCAALwEGIgFBAXFFDQBBycAAQd4xQcQAQdkXEKsEAAsgACABQQFyOwEGIABB3ANqEJMCIAAQayAAKALYASAAKAIAEH0gACgC2AEgACgCtAEQfSAAKALYARCIASAAQQBBwAcQzQQaCxIAAkAgAEUNACAAEFIgABAgCwsrAQF/IwBBEGsiAiQAIAIgATYCAEGVxQAgAhAuIABB5NQDEHQgAkEQaiQACwwAIAAoAtgBIAEQfQvTAwEFfyMAQRBrIgEkAAJAIAAoAiwiAkEASA0AAkACQCAAKAIQKAIAIgMoAgBB0/qq7HhHDQAgAyEEIAMoAghBq5bxk3tGDQELQQAhBAsCQAJAIAQiBA0AQQAhAwwBCyAEKAIEIQMLAkAgAiADIgNIDQAgAEEwahCCBBogAEF/NgIsDAELAkACQCAAQTBqIgUgBCACakGAAWogA0HsASADQewBSBsiAhCBBA4CAAIBCyAAIAAoAiwgAmo2AiwMAQsgAEF/NgIsIAUQggQaCwJAIABBDGpBgICABBCoBEUNACAALQAHRQ0AIAAoAhQNACAAEFcLAkAgACgCFCICRQ0AIAIgAUEIahBQIgJFDQAgASABKAIINgIEIAFBACACIAJB4NQDRhs2AgAgAEGAASABQQgQugQgACgCFBBTIABBADYCFAJAAkAgACgCECgCACIDKAIAQdP6qux4Rw0AIAMhBCADKAIIQauW8ZN7Rg0BC0EAIQQLAkACQCAEIgNFDQBBAyEEIAMoAgQNAQtBBCEECyABIAQ2AgwgAEEAOgAGIABBBCABQQxqQQQQugQgAEEAKALAxQFBgIDAAEGAgMACIAJB4NQDRhtqNgIMCyABQRBqJAAL5wIBBH8jAEEQayIBJAACQAJAIAAoAhAoAgAiAigCAEHT+qrseEcNACACIQMgAigCCEGrlvGTe0YNAQtBACEDCwJAAkAgAyIDRQ0AIAMoAgQiAkUNACADQYABaiIEIAIQ2wINACADKAIEIQMCQCAAKAIUIgJFDQAgAhBTCyABIAAtAAQ6AAAgACAEIAMgARBNIgM2AhQgA0UNASADIAAtAAgQ4gEMAQsCQCAAKAIUIgNFDQAgAxBTCyABIAAtAAQ6AAggAEH8ygBBoAEgAUEIahBNIgM2AhQgA0UNACADIAAtAAgQ4gELQQAhAwJAIAAoAhQiAg0AAkACQCAAKAIQKAIAIgQoAgBB0/qq7HhHDQAgBCEDIAQoAghBq5bxk3tGDQELQQAhAwsCQCADIgRFDQBBAyEDIAQoAgQNAQtBBCEDCyABIAM2AgwgACACQQBHOgAGIABBBCABQQxqQQQQugQgAUEQaiQAC4wBAQN/IwBBEGsiASQAIAAoAhQQUyAAQQA2AhQCQAJAIAAoAhAoAgAiAigCAEHT+qrseEcNACACIQMgAigCCEGrlvGTe0YNAQtBACEDCwJAAkAgAyICRQ0AQQMhAyACKAIEDQELQQQhAwsgASADNgIMIABBADoABiAAQQQgAUEMakEEELoEIAFBEGokAAuOAwEEfyMAQZABayIBJAAgASAANgIAQQAoAozIASECQcE3IAEQLgJAAkAgAEEfcUUNAEF/IQMMAQtBfyEDIAIoAhAoAgRBgH9qIABNDQAgAigCFBBTIAJBADYCFAJAAkAgAigCECgCACIEKAIAQdP6qux4Rw0AIAQhAyAEKAIIQauW8ZN7Rg0BC0EAIQMLAkACQCADIgRFDQBBAyEDIAQoAgQNAQtBBCEDCyABIAM2AgggAkEAOgAGIAJBBCABQQhqQQQQugQgAigCECgCABAXQQAhAyAARQ0AIAEgADYCDCABQdP6qux4NgIIIAIoAhAoAgAgAUEIakEIEBYgAkGAATYCGEEAIQACQCACKAIUIgMNAAJAAkAgAigCECgCACIEKAIAQdP6qux4Rw0AIAQhACAEKAIIQauW8ZN7Rg0BC0EAIQALAkAgACIERQ0AQQMhACAEKAIEDQELQQQhAAsgASAANgKMASACIANBAEc6AAYgAkEEIAFBjAFqQQQQugRBACEDCyABQZABaiQAIAML9QMBBn8jAEGwAWsiAiQAAkACQEEAKAKMyAEiAygCGCIEDQBBfyEDDAELIAMoAhAoAgAhBQJAIAANACACQShqQQBBgAEQzQQaIAJBq5bxk3s2AjAgAiAFQYABaiAFKAIEEJ0ENgI0AkAgBSgCBCIBQYABaiIAIAMoAhgiBEYNACACIAE2AgQgAiAAIARrNgIAQYvIACACEC5BfyEDDAILIAVBCGogAkEoakEIakH4ABAWEBhB6B1BABAuIAMoAhQQUyADQQA2AhQCQAJAIAMoAhAoAgAiBSgCAEHT+qrseEcNACAFIQEgBSgCCEGrlvGTe0YNAQtBACEBCwJAAkAgASIFRQ0AQQMhASAFKAIEDQELQQQhAQsgAiABNgKsASADQQA6AAYgA0EEIAJBrAFqQQQQugQgA0EDQQBBABC6BCADQQAoAsDFATYCDEEAIQMMAQsgBSgCBEGAAWohBgJAAkACQCABQR9xDQAgAUH/D0sNACAEIAFqIgcgBk0NAQsgAiAGNgIYIAIgBDYCFCACIAE2AhBB5ccAIAJBEGoQLkEAIQFBfyEFDAELAkAgByAEc0GAEEkNACAFIAdBgHBxahAXCyAFIAMoAhhqIAAgARAWIAMoAhggAWohAUEAIQULIAMgATYCGCAFIQMLIAJBsAFqJAAgAwuFAQECfwJAAkBBACgCjMgBKAIQKAIAIgEoAgBB0/qq7HhHDQAgASECIAEoAghBq5bxk3tGDQELQQAhAgsCQCACIgJFDQAQoQIgAkGAAWogAigCBBCiAiAAEKMCQQAPCyAAQgA3AAAgAEEYakIANwAAIABBEGpCADcAACAAQQhqQgA3AABBfwuYBQECfyMAQSBrIgIkAAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBAECAwQACwJAAkAgA0GAf2oOAgABBgsgASgCEBBZDQYgASAAQRxqQQdBCBDzA0H//wNxEIgEGgwGCyAAQTBqIAEQ+wMNBSAAQQA2AiwMBQsCQAJAIAAoAhAoAgAiAygCAEHT+qrseEYNAEEAIQAMAQtBACEAIAMoAghBq5bxk3tHDQAgAygCBCEACyABIAAQiQQaDAQLAkACQCAAKAIQKAIAIgMoAgBB0/qq7HhGDQBBACEADAELQQAhACADKAIIQauW8ZN7Rw0AIAMoAgwhAAsgASAAEIkEGgwDCwJAAkBBACgCjMgBKAIQKAIAIgMoAgBB0/qq7HhHDQAgAyEAIAMoAghBq5bxk3tGDQELQQAhAAsCQAJAIAAiAEUNABChAiAAQYABaiAAKAIEEKICIAIQowIMAQsgAkEYakIANwMAIAJBEGpCADcDACACQgA3AwggAkIANwMACyABLQANIAEvAQ4gAkEgEMMEGgwCCyABQYCAkCAQiQQaDAELAkAgA0GDIkYNAAJAAkACQCAAIAFB4MoAEI0EQYB/ag4DAAECBAsCQCAALQAGIgFFDQACQCAAKAIUDQAgAEEAOgAGIAAQVwwFCyABDQQLIAAoAhRFDQMgABBYDAMLIAAtAAdFDQIgAEEAKALAxQE2AgwMAgsgACgCFCIBRQ0BIAEgAC0ACBDiAQwBC0EAIQMCQCAAKAIUDQACQAJAIAAoAhAoAgAiAygCAEHT+qrseEcNACADIQAgAygCCEGrlvGTe0YNAQtBACEACwJAIAAiAEUNAEEDIQMgACgCBA0BC0EEIQMLIAEgAxCJBBoLIAJBIGokAAs8AAJAIABBZGpBACgCjMgBRw0AAkAgAUEQaiABLQAMEFpFDQAgABD1AwsPC0H8JUH3MkH7AUGAGBCrBAALMwACQCAAQWRqQQAoAozIAUcNAAJAIAENAEEAQQAQWhoLDwtB/CVB9zJBgwJBjxgQqwQAC8EBAQN/QQAoAozIASECQX8hAwJAIAEQWQ0AAkAgAQ0AQX4PC0EAIQMCQAJAA0AgACADIgNqIAEgA2siBEGAASAEQYABSRsiBBBaDQEgBCADaiIEIQMgBCABTw0CDAALAAtBfQ8LQXwhA0EAQQAQWg0AAkACQCACKAIQKAIAIgEoAgBB0/qq7HhHDQAgASEDIAEoAghBq5bxk3tGDQELQQAhAwsCQCADIgMNAEF7DwsgA0GAAWogAygCBBDbAiEDCyADC2QBAX9B7MoAEJIEIgFBfzYCLCABIAA2AhAgAUGBAjsAByABQQAoAsDFAUGAgOAAajYCDAJAQfzKAEGgARDbAkUNAEGvwgBB9zJBjQNB/g0QqwQAC0EJIAEQ5gNBACABNgKMyAELGQACQCAAKAIUIgBFDQAgACABIAIgAxBRCwsCAAu/AgEDfwJAAkACQAJAAkACQAJAIAEvAQ4iAkGAf2oOBAABBAIDCwJAAkAgAS0ADCIDDQBBACECDAELQQAhAgNAAkAgASACIgJqQRBqLQAADQAgAiECDAILIAJBAWoiBCECIAQgA0cNAAsgAyECCyACQQFqIgIgA08NBCABQRBqIQEgASADIAJrIgRBA3YgBEF4cSIEQQFyEB8gASACaiAEEMsEIgIgACgCCCgCABEFACEBIAIQICABRQ0EQZouQQAQLg8LIAFBEGogAS0ADCAAKAIIKAIEEQMARQ0DQf0tQQAQLg8LIAEtAAwiAkEISQ0CIAEoAhAgAUEUaigCACACQQN2QX9qIAFBGGogACgCCCgCFBEJABoPCyACQYAjRg0CCyABEIsEGgsPCyABIAAoAggoAgwRCABB/wFxEIcEGgtWAQR/QQAoApDIASEEIAAQ+gQiBSACQQN0IgZqQQVqIgcQHyICIAE2AAAgAkEEaiAAIAVBAWoiARDLBCABaiADIAYQywQaIARBgQEgAiAHELoEIAIQIAsbAQF/QZzMABCSBCIBIAA2AghBACABNgKQyAELTAECfyMAQRBrIgEkAAJAIAAoAqgBIgJFDQAgAC0ABkEIcQ0AIAEgAi8BBDsBCCAAQccAIAFBCGpBAhBPCyAAQgA3A6gBIAFBEGokAAvqBQIHfwF+IwBBwABrIgIkAAJAAkACQCABQQFqIgMgACgCLCIELQBDRw0AIAIgBCkDUCIJNwM4IAIgCTcDIAJAAkAgBCACQSBqIARB0ABqIgUgAkE0ahD2ASIGQX9KDQAgAiACKQM4NwMIIAIgBCACQQhqEJ0CNgIAIAJBKGogBEH4LCACELgCQX8hBAwBCwJAIAZB0IYDSA0AIAZBsPl8aiIGQQAvAbC7AU4NAwJAQZDUACAGQQN0aiIHLQACIgMgAU0NACAEIAFBA3RqQdgAakEAIAMgAWtBA3QQzQQaCyAHLQADIgFBAXENBCAAQgA3AyACQCABQQhxRQ0AIAIgBSkDADcDEAJAAkAgBCACQRBqENMCIgANAEEAIQAMAQsgAC0AA0EPcSEACwJAIABBfGoOBgEAAAAAAQALIAJBKGogBEEIIARBABCAARDLAiAEIAIpAyg3A1ALIARBkNQAIAZBA3RqKAIEEQAAQQAhBAwBCwJAIARBCCAEKACkASIHIAcoAiBqIAZBBHRqIgYvAQhBA3QgBi0ADkEBdGpBGGoQeiIHDQBBfiEEDAELIAdBGGogBSAEQdgAaiAGLQALQQFxIggbIAMgASAIGyIBIAYtAAoiBSABIAVJG0EDdBDLBCEFIAcgBigCACIBOwEEIAcgAigCNDYCCCAHIAEgBigCBGoiAzsBBiAAKAIoIQEgByAGNgIQIAcgATYCDAJAAkAgAUUNACAAIAc2AiggACgCLCIALwEIDQEgACAHNgKoASADQf//A3ENAUHIP0GtMkEVQeglEKsEAAsgACAHNgIoCwJAIAYtAAtBAnFFDQAgBSkAAEIAUg0AIAIgAikDODcDGCACQShqIARBCCAEIAQgAkEYahD/ARCAARDLAiAFIAIpAyg3AwALQQAhBAsgAkHAAGokACAEDwtB7zBBrTJBHUHwGxCrBAALQZURQa0yQStB8BsQqwQAC0HVyABBrTJBMUHwGxCrBAALCQAgACABNgIYC18BAn8jAEEQayICJAAgACAAKAIsIgMoAsABIAFqNgIYAkAgAygCqAEiAEUNACADLQAGQQhxDQAgAiAALwEEOwEIIANBxwAgAkEIakECEE8LIANCADcDqAEgAkEQaiQAC9UCAQR/IwBBEGsiAiQAIAAoAiwhAyABQQA7AQYCQAJAAkAgASgCDEUNAAJAIAApACBCAFINACABKAIQLQALQQJxRQ0AIAAgASkDGDcDIAsgACABKAIMIgE2AiggAy8BCA0BIAMgATYCqAEgAS8BBg0BQcg/Qa0yQRVB6CUQqwQACwJAIAAtABAiBEEQcUUNACAAIARB7wFxOgAQIAEgASgCECgCADsBBAwBCwJAIAMoAqgBIgFFDQAgAy0ABkEIcQ0AIAIgAS8BBDsBCCADQccAIAJBCGpBAhBPCyADQgA3A6gBIAAQ1QECQAJAIAAoAiwiBSgCsAEiASAARw0AIAVBsAFqIQEMAQsgASEDA0AgAyIBRQ0DIAEoAgAiBCEDIAEhASAEIABHDQALCyABIAAoAgA2AgAgBSAAEFULIAJBEGokAA8LQZM8Qa0yQfwAQYQZEKsEAAs/AQJ/AkAgACgCsAEiAUUNACABIQEDQCAAIAEiASgCADYCsAEgARDVASAAIAEQVSAAKAKwASICIQEgAg0ACwsLngEBA38jAEEQayICJAACQAJAIAFB0IYDSQ0AQbw3IQMgAUGw+XxqIgFBAC8BsLsBTw0BQZDUACABQQN0ai8BABDeAiEDDAELQdE9IQMgACgCACIEQSRqKAIAQQR2IAFNDQAgBCAEKAIgaiABQQR0ai8BDCEBIAIgACgCADYCDCACQQxqIAFBABDfAiIBQdE9IAEbIQMLIAJBEGokACADC14BA38jAEEQayICJABB0T0hAwJAIAAoAgAiBEE8aigCAEEDdiABTQ0AIAQgBCgCOGogAUEDdGovAQQhASACIAAoAgA2AgwgAkEMaiABQQAQ3wIhAwsgAkEQaiQAIAMLLAEBfyAAQbABaiECAkADQCACKAIAIgBFDQEgACECIAAvARYgAUcNAAsLIAALLAEBfyAAQbABaiECAkADQCACKAIAIgBFDQEgACECIAAoAhwgAUcNAAsLIAAL0QICBH8BfiMAQTBrIgMkAEEAIQQCQCAALwEIDQAgAyAAKQNQIgc3AwggAyAHNwMYAkACQCAAIANBCGogA0EgaiADQSxqEPYBIgVBAE4NAEEAIQYMAQsCQCAFQdCGA0gNACADQRBqIABBlxxBABC4AkEAIQYMAQsCQCACQQFGDQAgAEGwAWohBgNAIAYoAgAiBEUNASAEIQYgBSAELwEWRw0ACyAERQ0AIAQhBgJAAkACQCACQX5qDgMEAAIBCyAEIAQtABBBEHI6ABAgBCEGDAMLQa0yQeMBQaYMEKYEAAsgBBBxC0EAIQYgAEE4EHsiBEUNACAEIAU7ARYgBCAANgIsIAAgACgC1AFBAWoiBjYC1AEgBCAGNgIcIAQgACgCsAE2AgAgACAENgKwASAEIAEQZxogBCAAKQPAAT4CGCAEIQYLIAYhBAsgA0EwaiQAIAQLzAEBBX8jAEEQayIBJAACQCAAKAIsIgIoAqwBIABHDQACQCACKAKoASIDRQ0AIAItAAZBCHENACABIAMvAQQ7AQggAkHHACABQQhqQQIQTwsgAkIANwOoAQsgABDVAQJAAkACQCAAKAIsIgQoArABIgIgAEcNACAEQbABaiECDAELIAIhAwNAIAMiAkUNAiACKAIAIgUhAyACIQIgBSAARw0ACwsgAiAAKAIANgIAIAQgABBVIAFBEGokAA8LQZM8Qa0yQfwAQYQZEKsEAAvfAQEEfyMAQRBrIgEkAAJAAkAgACgCLCICLwEIDQAQlAQgAkEAKQPQzQE3A8ABIAAQ3AFFDQAgABDVASAAQQA2AhggAEH//wM7ARIgAiAANgKsASAAKAIoIQMCQCAAKAIsIgQvAQgNACAEIAM2AqgBIAMvAQZFDQILAkAgAi0ABkEIcQ0AIAEgAy8BBDsBCCACQcYAIAFBCGpBAhBPCwJAIAAoAjAiA0UNACAAKAI0IQQgAEIANwMwIAIgBCADEQIACyACEN0CCyABQRBqJAAPC0HIP0GtMkEVQeglEKsEAAsSABCUBCAAQQApA9DNATcDwAEL1gMBB38jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgCqAEiBA0AQQAhBAwBCyAELwEEIQQLIAAgBCIEOwEKAkACQCADQeDUA0cNAEHwK0EAEC4MAQsgAiADNgIQIAIgBEH//wNxNgIUQd4uIAJBEGoQLgsgACADOwEIAkAgA0Hg1ANGDQAgACgCqAEiA0UNACADIQMDQCAAKACkASIEKAIgIQUgAyIDLwEEIQYgAygCECIHKAIAIQggAiAAKACkATYCGCAGIAhrIQggByAEIAVqayIGQQR1IQQCQAJAIAZB8ekwSQ0AQbw3IQUgBEGw+XxqIgZBAC8BsLsBTw0BQZDUACAGQQN0ai8BABDeAiEFDAELQdE9IQUgAigCGCIHQSRqKAIAQQR2IARNDQAgByAHKAIgaiAGai8BDCEFIAIgAigCGDYCDCACQQxqIAVBABDfAiIFQdE9IAUbIQULIAIgCDYCACACIAU2AgQgAiAENgIIQc0uIAIQLiADKAIMIgQhAyAEDQALCyABECYLAkAgACgCqAEiA0UNACAALQAGQQhxDQAgAiADLwEEOwEYIABBxwAgAkEYakECEE8LIABCADcDqAEgAkEgaiQACx4AIAEgAkHkACACQeQASxtB4NQDahB0IABCADcDAAtvAQR/EJQEIABBACkD0M0BNwPAASAAQbABaiEBA0BBACECAkAgAC8BCA0AIAApA8ABpyEDIAEhBAJAA0AgBCgCACICRQ0BIAIhBCACKAIYQX9qIANPDQALIAAQ2AEgAhByCyACQQBHIQILIAINAAsLmgQBCH8jAEEQayIDJAACQAJAAkAgAkGA4ANNDQBBACEEDAELIAFBgAJPDQEgACAAKAIIQQFqIgQ2AggCQAJAIARBIEkNACAEQR9xDQELEB4LAkAQ5QFBAXFFDQACQCAAKAIEIgRFDQAgBCEEA0ACQCAEIgUoAggiBkEYdiIEQc8ARg0AIAUoAgQhByAEIQQgBiEGIAVBCGohCAJAAkACQAJAA0AgBiEJIAQhBCAIIgggB08NAQJAIARBAUcNACAJQf///wdxIgZFDQNBACEEIAZBAnRBeGoiCkUNAANAIAggBCIEakEIai0AACIGQTdHDQUgBEEBaiIGIQQgBiAKRw0ACwsgCUH///8HcSIERQ0EIAggBEECdGoiCCgCACIGQRh2IgohBCAGIQYgCCEIIApBzwBGDQUMAAsAC0HpKkGFN0GmAkGzGhCrBAALQYY/QYU3QdgBQbMkEKsEAAsgAyAGNgIIIAMgCDYCACADIARBBGo2AgRBjwkgAxAuQYU3Qa4CQbMaEKYEAAtBhj9BhTdB2AFBsyQQqwQACyAFKAIAIgYhBCAGDQALCyAAEHgLIAAgAUEBIAJBA2oiBEECdiAEQQRJGyIIEHkiBCEGAkAgBA0AIAAQeCAAIAEgCBB5IQYLQQAhBCAGIgZFDQAgBkEEakEAIAIQzQQaIAYhBAsgA0EQaiQAIAQPC0GcI0GFN0HjAkHQHxCrBAALvAkBC38CQCAAKAIMIgFFDQACQCABKAKkAS8BDCICRQ0AIAEoAgAhA0EAIQQDQAJAIAMgBCIEQQN0aiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEIkBCyAEQQFqIgUhBCAFIAJHDQALCwJAIAEtAEMiAkUNACABQdAAaiEDQQAhBANAAkAgAyAEIgRBA3RqIgUoAARBiIDA/wdxQQhHDQAgASAFKAAAQQoQiQELIARBAWoiBSEEIAUgAkcNAAsLAkAgAS0AREUNAEEAIQQDQCABIAEoArgBIAQiBEECdGooAgBBChCJASAEQQFqIgUhBCAFIAEtAERJDQALCwJAIAEoAKQBQTxqKAIAQQhJDQBBACEEA0AgASABKAK0ASAEIgRBDGwiBWooAghBChCJASABIAEoArQBIAVqKAIEQQoQiQEgBEEBaiIFIQQgBSABKACkAUE8aigCAEEDdkkNAAsLIAEgASgCoAFBChCJAQJAIAEoADxBiIDA/wdxQQhHDQAgASABKAA4QQoQiQELAkAgASgANEGIgMD/B3FBCEcNACABIAEoADBBChCJAQsgASgCsAEiBEUNACAEIQQDQAJAIAQiAigAJEGIgMD/B3FBCEcNACABIAIoACBBChCJAQsCQCACLQAQQQ9xQQNHDQAgAigADEGIgMD/B3FBCEcNACABIAIoAAhBChCJAQsgAigCKCIFIQQCQCAFRQ0AA0AgASAEIgRBChCJASAEKAIMIgUhBCAFDQALCyACKAIAIgUhBCAFDQALCyAAQQA2AgBBACEEQQAhBQNAIAUhBiAEIQQCQAJAIAAoAgQiBQ0AQQAhAyAEIQcMAQsgBSEBIAQhBUEAIQQDQCABIghBCGohASAEIQQgBSEFAkACQAJAAkACQAJAA0AgBSEJIAQhCgJAAkACQCABIgMoAgAiB0GAgIB4cSIEQYCAgPgERiILDQAgAyAIKAIETw0EAkACQCAHQQBIDQAgB0GAgICABnEiBUGAgICABEcNAQsgBg0GIAAoAgwgA0EKEIkBQQEhBAwCCyAGRQ0AIAchASADIQICQAJAIARBgICACEYNACAHIQEgAyECIAMhBCAFDQELA0AgAiEEIAFB////B3EiBUUNCCAEIAVBAnRqIgQoAgAiBSEBIAQhAiAFQYCAgHhxQYCAgAhGDQAgBSEBIAQhAiAEIQQgBUGAgICABnFFDQALCwJAIAQiBCADRg0AIAMgBCADayIEQQJ1QYCAgAhyNgIAIARBBE0NCCADQQhqQTcgBEF4ahDNBBogCUEEaiAAIAkbIAM2AgAgA0EANgIEIAohBCADIQUMAwsgAyAHQf////99cTYCAAsgCiEECyAJIQULIAUhBSAEIQQgCw0GIAMoAgBB////B3EiAUUNBSADIAFBAnRqIQEgBCEEIAUhBQwACwALQekqQYU3QfMBQakaEKsEAAtBqBpBhTdB+wFBqRoQqwQAC0GGP0GFN0HYAUGzJBCrBAALQbg+QYU3QT5BxR8QqwQAC0GGP0GFN0HYAUGzJBCrBAALIAQhAyAFIQcgCCgCACICIQEgBSEFIAQhBCACDQALCyAHIQQgBkEARyADRXIhBSAGRQ0ACwu9AwELfwJAIAAoAgAiAw0AQQAPCyACQQFqIgQgAUEYdCIFciEGIARBAnRBeGohByADIQhBACEDAkACQAJAAkACQAJAA0AgAyEJIAohCiAIIgMoAgBB////B3EiCEUNAiAKIQoCQCAIIAJrIgtBAUgiDA0AAkACQCALQQNIDQAgAyAGNgIAAkAgAUEBRw0AIARBAU0NByADQQhqQTcgBxDNBBoLIAMoAgBB////B3EiCEUNByADKAIEIQ0gAyAIQQJ0aiIIIAtBf2oiCkGAgIAIcjYCACAIIA02AgQgCkEBTQ0IIAhBCGpBNyAKQQJ0QXhqEM0EGiAIIQgMAQsgAyAIIAVyNgIAAkAgAUEBRw0AIAhBAU0NCSADQQhqQTcgCEECdEF4ahDNBBoLIAMoAgQhCAsgCUEEaiAAIAkbIAg2AgAgAyEKCyAKIQogDEUNASADKAIEIgkhCCAKIQogAyEDIAkNAAtBAA8LIAoPC0GGP0GFN0HYAUGzJBCrBAALQbg+QYU3QT5BxR8QqwQAC0GGP0GFN0HYAUGzJBCrBAALQbg+QYU3QT5BxR8QqwQAC0G4PkGFN0E+QcUfEKsEAAsdAAJAIAAoAtgBIAEgAhB3IgENACAAIAIQVAsgAQsoAQF/AkAgACgC2AFBwgAgARB3IgINACAAIAEQVAsgAkEEakEAIAIbC4QBAQF/AkACQAJAAkAgAUUNACABQQNxDQEgAUF8aiICKAIAIgFBgICAeHFBgICAkARHDQIgAUH///8HcSIBRQ0DIAIgAUGAgIAQcjYCAAsPC0GXwwBBhTdBlANBhR0QqwQAC0GbyQBBhTdBlgNBhR0QqwQAC0GGP0GFN0HYAUGzJBCrBAALsAEBAn8CQAJAAkACQAJAIAFFDQAgAUEDcQ0BIAFBfGoiAigCACIDQYCAgHhxQYCAgJAERw0CIANB////B3EiA0UNAyACIANBgICACHI2AgAgA0EBRg0EIAFBBGpBNyADQQJ0QXhqEM0EGgsPC0GXwwBBhTdBlANBhR0QqwQAC0GbyQBBhTdBlgNBhR0QqwQAC0GGP0GFN0HYAUGzJBCrBAALQbg+QYU3QT5BxR8QqwQAC3YBAX8CQAJAAkAgASgCBCICQYCAwP8HcQ0AIAJBCHFFDQAgASgCACICKAIAIgFBgICAgARxDQEgAUGAgIDwAHFFDQIgAiABQYCAgIAEcjYCAAsPC0GNwQBBhTdBqwNBix0QqwQAC0HgOkGFN0GsA0GLHRCrBAALdwEBfwJAAkACQCABKAIEIgJBgIDA/wdxDQAgAkEIcUUNACABKAIAIgIoAgAiAUGAgICABHFFDQEgAUGAgIDwAHFFDQIgAiABQf////97cTYCAAsPC0HvwwBBhTdBtQNB+hwQqwQAC0HgOkGFN0G2A0H6HBCrBAALKQEBfwJAIAAoAtgBQQRBEBB3IgINACAAQRAQVCACDwsgAiABNgIEIAILHwEBfwJAIAAoAtgBQQtBEBB3IgENACAAQRAQVAsgAQvVAQEEfyMAQRBrIgIkAAJAAkACQCABQYDgA0sNACABQQN0IgNBgeADSQ0BCyACQQhqIABBDxC+AkEAIQEMAQsCQCAAKALYAUHDAEEQEHciBA0AIABBEBBUQQAhAQwBCwJAIAFFDQACQCAAKALYAUHCACADEHciBQ0AIAAgAxBUIARBADYCDCAEIAQoAgBBgICAgARzNgIAQQAhAQwCCyAEIAE7AQogBCABOwEIIAQgBUEEajYCDAsgBCAEKAIAQYCAgIAEczYCACAEIQELIAJBEGokACABC2UBA38jAEEQayICJAACQAJAIAFBgeADSQ0AIAJBCGogAEESEL4CQQAhAQwBCwJAAkAgACgC2AFBBSABQQxqIgMQdyIEDQAgACADEFQMAQsgBCABOwEECyAEIQELIAJBEGokACABC2YBA38jAEEQayICJAACQAJAIAFBgeADSQ0AIAJBCGogAEHCABC+AkEAIQEMAQsCQAJAIAAoAtgBQQYgAUEJaiIDEHciBA0AIAAgAxBUDAELIAQgATsBBAsgBCEBCyACQRBqJAAgAQt9AQN/IwBBEGsiAyQAAkACQCACQYHgA0kNACADQQhqIABBwgAQvgJBACEADAELAkACQCAAKALYAUEGIAJBCWoiBBB3IgUNACAAIAQQVAwBCyAFIAI7AQQLIAUhAAsCQCAAIgBFDQAgAEEGaiABIAIQywQaCyADQRBqJAAgAAsJACAAIAE2AgwLigEBA39BkIAEEB8iAEEUaiIBIABBkIAEakF8cUF8aiICNgIAIAJBgYCA+AQ2AgAgAEEYaiICIAEoAgAgAmsiAUECdUGAgIAIcjYCAAJAIAFBBEsNAEG4PkGFN0E+QcUfEKsEAAsgAEEgakE3IAFBeGoQzQQaIAAgACgCBDYCECAAIABBEGo2AgQgAAsNACAAQQA2AgQgABAgC5QHAQd/IAJBf2ohAyABIQECQANAIAEiBEUNAQJAAkAgBCgCACIBQRh2QQ9xIgVBAUYNACABQYCAgIACcQ0AAkAgAkEBSg0AIAQgAUGAgICAeHI2AgAMAQsgBCABQf////8FcUGAgICAAnI2AgBBACEBAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAVBfmoODgsBAAYLAwQAAgAFBQULBQsgBCEBDAoLAkAgBCgCDCIGRQ0AIAZBA3ENBiAGQXxqIgcoAgAiAUGAgICAAnENByABQYCAgPgAcUGAgIAQRw0IIAQvAQghCCAHIAFBgICAgAJyNgIAQQAhASAIRQ0AA0ACQCAGIAEiAUEDdGoiBygABEGIgMD/B3FBCEcNACAAIAcoAAAgAxCJAQsgAUEBaiIHIQEgByAIRw0ACwsgBCgCBCEBDAkLIAAgBCgCHCADEIkBIAQoAhghAQwICwJAIAQoAAxBiIDA/wdxQQhHDQAgACAEKAAIIAMQiQELQQAhASAEKAAUQYiAwP8HcUEIRw0HIAAgBCgAECADEIkBQQAhAQwHCyAAIAQoAgggAxCJASAEKAIQLwEIIgZFDQUgBEEYaiEIQQAhAQNAAkAgCCABIgFBA3RqIgcoAARBiIDA/wdxQQhHDQAgACAHKAAAIAMQiQELIAFBAWoiByEBIAcgBkcNAAtBACEBDAYLQYU3QaIBQeIfEKYEAAsgBCgCCCEBDAQLQZfDAEGFN0HiAEGxFhCrBAALQbLBAEGFN0HkAEGxFhCrBAALQY47QYU3QeUAQbEWEKsEAAtBACEBCwJAIAEiCEUNAAJAAkACQAJAIAgoAgwiB0UNACAHQQNxDQEgB0F8aiIGKAIAIgFBgICAgAJxDQIgAUGAgID4AHFBgICAEEcNAyAILwEIIQkgBiABQYCAgIACcjYCAEEAIQEgCSAFQQtHdCIGRQ0AA0ACQCAHIAEiAUEDdGoiBSgABEGIgMD/B3FBCEcNACAAIAUoAAAgAxCJAQsgAUEBaiIFIQEgBSAGRw0ACwsgCCgCBCIHRQ0DIAdBoNAAa0EMbUEhSQ0DIAQhAUEAIQUgACAHEOkBDQUgCCgCBCEBQQEhBQwFC0GXwwBBhTdB4gBBsRYQqwQAC0GywQBBhTdB5ABBsRYQqwQAC0GOO0GFN0HlAEGxFhCrBAALIAQhAUEAIQUMAQsgBCEBQQAhBQsgASEBIAUNAAsLC1QBAX8jAEEQayIDJAAgAyACKQMANwMIAkACQCABIANBCGoQ1AINACADIAIpAwA3AwAgACABQQ8gAxC8AgwBCyAAIAIoAgAvAQgQyQILIANBEGokAAuBAQICfwF+IwBBIGsiASQAIAEgACkDUCIDNwMIIAEgAzcDGAJAAkAgACABQQhqENQCRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARC8AkEAIQILAkAgAiICRQ0AIAAgAiAAQQAQiAIgAEEBEIgCEOwBGgsgAUEgaiQACzkCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwAgASACNwMIIAAgACABENQCEIwCIAFBEGokAAvRAQIFfwF+IwBBMGsiASQAIAEgACkDUCIGNwMQIAEgBjcDKAJAAkAgACABQRBqENQCRQ0AIAEoAighAgwBCyABIAEpAyg3AwggAUEgaiAAQQ8gAUEIahC8AkEAIQILAkAgAiIDRQ0AAkAgAC0AQ0ECSQ0AQQAhBANAIAMvAQghBSABIAAgBEEBaiICQQN0akHQAGopAwAiBjcDACABIAY3AxggACADIAUgARCHAiACIQQgAiAALQBDQX9qSA0ACwsgACADLwEIEIsCCyABQTBqJAALiQICBX8BfiMAQcAAayIBJAAgASAAKQNQIgY3AyggASAGNwM4AkACQCAAIAFBKGoQ1AJFDQAgASgCOCECDAELIAEgASkDODcDICABQTBqIABBDyABQSBqELwCQQAhAgsCQCACIgJFDQAgASAAQdgAaikDACIGNwMYIAEgBjcDOAJAIAAgAUEYahDUAg0AIAEgASkDODcDECABQTBqIABBDyABQRBqELwCDAELIAEgASkDODcDCAJAIAAgAUEIahDTAiIDLwEIIgRFDQAgACACIAIvAQgiBSAEEOwBDQAgAigCDCAFQQN0aiADKAIMIARBA3QQywQaCyAAIAIvAQgQiwILIAFBwABqJAALnAICBn8BfiMAQSBrIgEkACABIAApA1AiBzcDCCABIAc3AxgCQAJAIAAgAUEIahDUAkUNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQvAJBACECCyACIgMvAQghAkEAIQQCQCAALQBDQX9qIgVFDQAgAEEAEIgCIQQLIAQiBEEfdSACcSAEaiIEQQAgBEEAShshBCACIQYCQCAFQQJJDQAgAiEGIABB4ABqKQMAUA0AIABBARCIAiEGCwJAIAAgBiIGQR91IAJxIAZqIgYgAiAGIAJIGyICIAQgAiAEIAJIGyIEayIGEIIBIgJFDQAgAigCDCADKAIMIARBA3RqIAZBA3QQywQaCyAAIAIQjQIgAUEgaiQACxMAIAAgACAAQQAQiAIQgwEQjQILigECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AyACQAJAAkAgASADQRhqEM8CDQAgAyADKQMgNwMQIANBKGogAUESIANBEGoQvAIMAQsgAyADKQMgNwMIIAEgA0EIaiADQShqENECRQ0AIAAgAygCKBDJAgwBCyAAQgA3AwALIANBMGokAAudAQICfwF+IwBBMGsiASQAIAEgACkDUCIDNwMQIAEgAzcDIAJAAkAgACABQRBqEM8CDQAgASABKQMgNwMIIAFBKGogAEESIAFBCGoQvAJBACECDAELIAEgASkDIDcDACAAIAEgAUEoahDRAiECCwJAIAIiAkUNACABQRhqIAAgAiABKAIoEK4CIAAoAqwBIAEpAxg3AyALIAFBMGokAAvKAQIFfwF+IwBBMGsiASQAIAEgACkDUCIGNwMYIAEgBjcDIAJAAkAgACABQRhqENACDQAgASABKQMgNwMQIAFBKGogAEG7GCABQRBqEL0CQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQ0QIhAgsCQCACIgNFDQAgAEEAEIgCIQIgAEEBEIgCIQQgAEECEIgCIQAgASgCKCIFIAJNDQAgASAFIAJrIgU2AiggAyACaiAAIAUgBCAFIARJGxDNBBoLIAFBMGokAAumAwIHfwF+IwBB4ABrIgEkACABIAApA1AiCDcDOCABIAg3A1ACQAJAIAAgAUE4ahDQAg0AIAEgASkDUDcDMCABQdgAaiAAQbsYIAFBMGoQvQJBACECDAELIAEgASkDUDcDKCAAIAFBKGogAUHMAGoQ0QIhAgsCQCACIgNFDQAgAEEAEIgCIQQgASAAQeAAaikDACIINwMgIAEgCDcDQAJAAkAgACABQSBqEKgCRQ0AIAEgASkDQDcDACAAIAEgAUHYAGoQqgIhAgwBCyABIAEpA0AiCDcDUCABIAg3AxgCQAJAIAAgAUEYahDPAg0AIAEgASkDUDcDECABQdgAaiAAQRIgAUEQahC8AkEAIQIMAQsgASABKQNQNwMIIAAgAUEIaiABQdgAahDRAiECCyACIQILIAIiBUUNACAAQQIQiAIhAiAAQQMQiAIhACABKAJYIgYgAk0NACABIAYgAmsiBjYCWCABKAJMIgcgBE0NACABIAcgBGsiBzYCTCADIARqIAUgAmogByAGIAAgBiAASRsiACAHIABJGxDLBBoLIAFB4ABqJAALHwEBfwJAIABBABCIAiIBQQBIDQAgACgCrAEgARBpCwshAQF/IABB/wAgAEEAEIgCIgEgAUGAgHxqQYGAfEkbEHQLCAAgAEEAEHQLywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQqgIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABCnAiIFQX9qIgYQhAEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQpwIaDAELIAdBBmogAUEQaiAGEMsEGgsgACAHEI0CCyABQeAAaiQAC1YCAX8BfiMAQSBrIgEkACABIABB2ABqKQMAIgI3AxggASACNwMIIAFBEGogACABQQhqEK8CIAEgASkDECICNwMYIAEgAjcDACAAIAEQ2gEgAUEgaiQACw4AIAAgAEEAEIkCEIoCCw8AIAAgAEEAEIkCnRCKAgt7AgJ/AX4jAEEQayIBJAACQCAAEI4CIgJFDQACQCACKAIEDQAgAiAAQRwQ5wE2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEKsCCyABIAEpAwg3AwAgACACQfYAIAEQsQIgACACEI0CCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCOAiICRQ0AAkAgAigCBA0AIAIgAEEgEOcBNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABCrAgsgASABKQMINwMAIAAgAkH2ACABELECIAAgAhCNAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQjgIiAkUNAAJAIAIoAgQNACACIABBHhDnATYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQqwILIAEgASkDCDcDACAAIAJB9gAgARCxAiAAIAIQjQILIAFBEGokAAtiAQF/IwBBIGsiAyQAIAMgAikDADcDECADQRhqIAEgA0EQakH7ABD4AQJAAkAgAykDGEIAUg0AIABCADcDAAwBCyADIAMpAxg3AwggACABIANBCGpB4wAQ+AELIANBIGokAAupAQEDfyMAQRBrIgEkAAJAAkAgAC0AQ0EBSw0AIAFBCGogAEHCIUEAELoCDAELAkAgAEEAEIgCIgJBe2pBe0sNACABQQhqIABBsSFBABC6AgwBCyAAIAAtAENBf2oiAzoAQyAAQdgAaiAAQeAAaiADQf8BcUF/aiIDQQN0EMwEGiAAIAMgAhBwIgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvhAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahD2ASIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBiRwgA0EIahC9AgwBCyAAIAEgASgCoAEgBEH//wNxEO8BIAApAwBCAFINACADQdgAaiABQQggASABQQIQ5wEQgAEQywIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEH4gA0HQAGpB+wAQqwIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqEIUCIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahDtASADIAApAwA3AxAgASADQRBqEH8LIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQ9gEiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADELwCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BsLsBTg0CIABBkNQAIAFBA3RqLwEAEKsCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQZURQd8zQThBhCgQqwQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDMApsQigILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQzAKcEIoCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEMwCEPYEEIoCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEMkCCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahDMAiIERAAAAAAAAAAAY0UNACAAIASaEIoCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEJ8EuEQAAAAAAADwPaIQigILZAEFfwJAAkAgAEEAEIgCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQnwQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRCLAgsRACAAIABBABCJAhDhBBCKAgsYACAAIABBABCJAiAAQQEQiQIQ7QQQigILLgEDfyAAQQAQiAIhAUEAIQICQCAAQQEQiAIiA0UNACABIANtIQILIAAgAhCLAgsuAQN/IABBABCIAiEBQQAhAgJAIABBARCIAiIDRQ0AIAEgA28hAgsgACACEIsCCxYAIAAgAEEAEIgCIABBARCIAmwQiwILCQAgAEEBEK8BC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEM0CIQMgAiACKQMgNwMQIAAgAkEQahDNAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQzAIhBiACIAIpAyA3AwAgACACEMwCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDsFs3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQrwELqAECA38BfiMAQSBrIgEkACABIABB2ABqKQMANwMYIAEgAEHgAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahD6ASECIAEgASkDEDcDACAAIAEQ/QEiA0UNACACRQ0AAkAgAygCAEGAgID4AHFBgICAyABHDQAgACACIAMoAgQQ5gELIAAgAiADEOYBCyAAKAKsASABKQMYNwMgIAFBIGokAAsJACAAQQEQswELvgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEP0BIgNFDQAgAEEAEIIBIgRFDQAgAkEgaiAAQQggBBDLAiACIAIpAyA3AxAgACACQRBqEH4CQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAMoAgQgBCABEOsBCyAAIAMgBCABEOsBIAIgAikDIDcDCCAAIAJBCGoQfyAAKAKsASACKQMgNwMgCyACQTBqJAALCQAgAEEAELMBC+MBAgN/AX4jAEHAAGsiASQAIAEgAEHYAGopAwAiBDcDOCABIABB4ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqENMCIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQvAIMAQsgASABKQMwNwMYAkAgACABQRhqEP0BIgMNACABIAEpAzA3AxAgAUEoaiAAQTQgAUEQahC8AgwBCyACIAM2AgQgACgCrAEgASkDODcDIAsgAUHAAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQvAJBACECCwJAAkAgAiICDQAgAEIANwMADAELAkAgASACLwESEOECRQ0AIAAgAi8BEjYCACAAQQI2AgQMAQsgAEIANwMACyADQSBqJAALsAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADIAJBCGpBCBCyBDYCACAAIAFB3xIgAxCtAgsgA0EgaiQAC7gBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC8AkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgA0EYaiACKQMIELAEIAMgA0EYajYCACAAIAFBoRYgAxCtAgsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC8AkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAVEMkCCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARAQyQILIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQvAJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFBDJAgsgA0EgaiQAC6IBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC8AkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUQQFxEMoCCyADQSBqJAALowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXFFEMoCCyADQSBqJAALowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAFBCCACKAIcEMsCCyADQSBqJAALywEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAAkAgAi0AFEEBcUUNAEEAIQEMAQtBACEBIAItABVBMEsNACACLwEQQQ92IQELIAAgARDKAgsgA0EgaiQAC8kBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC8AkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLQAUQQFxDQAgAi0AFUEwSw0AIAIuARBBf0oNACAAIAItABAQyQIMAQsgAEIANwMACyADQSBqJAALqQEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARBBgOADcUGAwABGEMoCCyADQSBqJAALqAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARBBgOADcUGAIEYQygILIANBIGokAAu+AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQvAJBACECCwJAAkAgAiICDQAgAEIANwMADAELAkAgAi8BECICQQx2QX9qQQJJDQAgAEIANwMADAELIAAgAkH/H3EQyQILIANBIGokAAv+AgEKfyMAQSBrIgEkACABIAApA1A3AxACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECIDRQ0AIAMhAiADKAIAQYCAgPgAcUGAgIDQAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQvAJBACECCwJAAkAgAiIEDQBBACEFDAELAkAgACAELwESEPEBIgINAEEAIQUMAQtBACEFIAIvAQgiBkUNACAAKACkASIDIAMoAmBqIAIvAQpBAnRqIQcgBC8BECICQf8BcSEIIALBIgJB//8DcSEJIAJBf0ohCkEAIQIDQAJAIAcgAiIDQQN0aiIFLwECIgIgCUcNACAFIQUMAgsCQCAKDQAgAkGA4ANxQYCAAkcNACAFIQUgAkH/AXEgCEYNAgsgA0EBaiIDIQIgAyAGRw0AC0EAIQULAkAgBSICRQ0AIAFBCGogACACIAQoAhwiA0EMaiADLwEEEMUBIAAoAqwBIAEpAwg3AyALIAFBIGokAAvSAwEEfyMAQcAAayIFJAAgBSADNgI8AkACQCACLQAEQQFxRQ0AAkAgAUEAEIIBIgYNACAAQgA3AwAMAgsgAyAEaiEHIAAgAUEIIAYQywIgBSAAKQMANwMoIAEgBUEoahB+QQAhAyABKACkASIEIAQoAmBqIAIvAQZBAnRqIQIDQCACIQIgAyEDAkACQCAHIAUoAjwiCGsiBEEATg0AIAMhAyACIQJBAiEEDAELIAVBMGogASACLQACIAVBPGogBBBLAkACQAJAIAUpAzBQDQAgBSAFKQMwNwMgIAEgBUEgahB+IAYvAQghBCAFIAUpAzA3AxggASAGIAQgBUEYahCHAiAFIAUpAzA3AxAgASAFQRBqEH8gBSgCPCAIRg0AIAMhBAJAIAMNACACLQADQR50QR91IAJxIQQLIAQhAyACQQRqIQQCQAJAIAIvAQRFDQAgBCECDAELIAMhAiADDQBBACEDIAQhAgwCCyADIQMgAiECQQAhBAwCCyADIQMgAiECC0ECIQQLIAMhAyACIQIgBCEECyADIQMgAiECIARFDQALIAUgACkDADcDCCABIAVBCGoQfwwBCyAAIAEgAi8BBiAFQTxqIAQQSwsgBUHAAGokAAvdAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEPABIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQfgYIAFBEGoQvQJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQesYIAFBCGoQvQJBACEDCwJAIAMiA0UNACAAKAKsASECIAAgASgCJCADLwECQfQDQQAQ1AEgAkEOIAMQjwILIAFBwABqJAALPQEBfyMAQRBrIgIkACACQQhqIAAgASAAQfABaiAAQewBai0AABDFASAAKAKsASACKQMINwMgIAJBEGokAAu/BAEKfyMAQTBrIgIkACAAQdgAaiEDAkACQCAALQBDQX9qIgRBAUYNACADIQMgBCEEDAELIAIgAykDADcDIAJAIAAgAkEgahDUAg0AIAMhA0EBIQQMAQsgAiADKQMANwMYIAAgAkEYahDTAiIEKAIMIQMgBC8BCCEECyAEIQUgAyEGIABB8AFqIQcCQAJAIAEtAARBAXFFDQAgByEDIAVFDQEgAEHcA2ohCCAHIQRBACEJQQAhCiAAKACkASIDIAMoAmBqIAEvAQZBAnRqIQEDQCABIQMgCiEKIAkhCQJAAkAgCCAEIgRrIgFBAEgNACADLQACIQsgAiAGIAlBA3RqKQMANwMQIAAgCyAEIAEgAkEQahBMIgFFDQAgCiELAkAgCg0AIAMtAANBHnRBH3UgA3EhCwsgCyEKIAQgAWohBCADQQRqIQECQAJAAkAgAy8BBEUNACABIQMMAQsgCiEDIAoNACABIQFBACEKQQEhCwwBCyADIQEgCiEKQQAhCwsgBCEDDAELIAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABBxi8gAhC6AiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQTGohAwsgAEHsAWogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahDwASICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEH4GCABQRBqEL0CQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEHrGCABQQhqEL0CQQAhAwsCQCADIgNFDQAgACADEMgBIAAgASgCJCADLwECQf8fcUGAwAByENYBCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEPABIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQfgYIANBCGoQvQJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahDwASIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUH4GCADQQhqEL0CQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ8AEiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFB+BggA0EIahC9AkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDJAgsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQ8AEiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABB+BggAUEQahC9AkEAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABB6xggAUEIahC9AkEAIQMLAkAgAyIDRQ0AIAAgAxDIASAAIAEoAiQgAy8BAhDWAQsgAUHAAGokAAtvAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahC8AgwBCyAAIAEoArQBIAIoAgBBDGxqKAIAKAIQQQBHEMoCCyADQRBqJAALiQICBX8BfiMAQTBrIgEkACABIAApA1A3AygCQAJAAkAgASgCLCICQYCAwP8HcQ0AIAJBD3FBAkYNAQsgASABKQMoNwMQIAFBIGogAEHZACABQRBqELwCQf//ASECDAELIAEoAighAgsCQCACIgJB//8BRg0AIABBABCIAiEDIAEgAEHgAGopAwAiBjcDKCABIAY3AwggACABQQhqIAFBHGoQ0gIhBAJAIANBgIAESQ0AIAFBIGogAEHdABC+AgwBCwJAIAEoAhwiBUHtAUkNACABQSBqIABB3gAQvgIMAQsgAEHsAWogBToAACAAQfABaiAEIAUQywQaIAAgAiADENYBCyABQTBqJAALqAEBA38jAEEgayIBJAAgASAAKQNQNwMYAkACQAJAIAEoAhwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDGDcDCCABQRBqIABB2QAgAUEIahC8AkH//wEhAgwBCyABKAIYIQILAkAgAiICQf//AUYNACAAKAKsASIDIAMtABBB8AFxQQRyOgAQIAAoAqwBIgMgAjsBEiADQQAQaCAAEGYLIAFBIGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQqgJFDQAgACADKAIMEMkCDAELIABCADcDAAsgA0EQaiQAC3ICA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxACQCAAIAFBCGogAUEcahCqAiICRQ0AAkAgAEEAEIgCIgMgASgCHEkNACAAKAKsAUEAKQOwWzcDIAwBCyAAIAIgA2otAAAQiwILIAFBIGokAAtQAQJ/IwBBIGsiASQAIAEgACkDUDcDECAAQQAQiAIhAiABIAEpAxA3AwggAUEYaiAAIAFBCGogAhCDAiAAKAKsASABKQMYNwMgIAFBIGokAAvXAgEDfwJAAkAgAC8BCA0AAkACQCAAKAK0ASABQQxsaigCACgCECIFRQ0AIABB3ANqIgYgASACIAQQlgIiB0UNACAHKAIEQaD3NiADIANB34hJakHgiElJG2ogACgCwAFPDQEgBiAHEJICCyAAKAKsASIARQ0CIAAgAjsBFCAAIAE7ARIgAEEUOwEKIAAgBDsBCCAAIAAtABBB8AFxQQFyOgAQIABBABBpDwsgBiAHEJQCIQEgAEHoAWpCADcDACAAQgA3A+ABIABB7gFqIAEvAQI7AQAgAEHsAWogAS0AFDoAACAAQe0BaiAFLQAEOgAAIABB5AFqIAVBACAFLQAEa0EMbGpBZGopAwA3AgAgAEHwAWohACABQQhqIQQCQAJAIAEtABQiAUEKTw0AIAQhBAwBCyAEKAIAIQQLIAAgBCABEMsEGgsPC0G2PEHuNkEpQZQXEKsEAAszAAJAIAAtABBBD3FBAkcNACAAKAIsIAAoAggQVQsgAEIANwMIIAAgAC0AEEHwAXE6ABALlwIBAn8CQAJAIAAvAQgNAAJAIAJBgGBxQYDAAEcNACAAQdwDaiIDIAEgAkH/n39xQYAgckEAEJYCIgRFDQAgAyAEEJICCyAAKAKsASIDRQ0BAkAgACgApAEiBCAEKAI4aiABQQN0aigCAEHt8tmMAUcNACADQQAQaSAAQfgBakJ/NwMAIABB8AFqQn83AwAgAEHoAWpCfzcDACAAQn83A+ABIAAgARDXAQ8LIAMgAjsBFCADIAE7ARIgAEHsAWotAAAhASADIAMtABBB8AFxQQJyOgAQIAMgACABEHsiAjYCCAJAIAJFDQAgAyABOgAMIAIgAEHwAWogARDLBBoLIANBABBpCw8LQbY8Qe42QcwAQbArEKsEAAuVAgIDfwF+IwBBIGsiAiQAAkAgACgCsAEiA0UNACADIQMDQAJAIAMiAy8BEiABRw0AIAMgAy0AEEEgcjoAEAsgAygCACIEIQMgBA0ACwsgAiABNgIYIAJBAjYCHCACIAIpAxg3AwAgAkEQaiAAIAJB4QAQ+AECQCACKQMQIgVQDQAgACAFNwNQIABBAjoAQyAAQdgAaiIDQgA3AwAgAkEIaiAAIAEQ2QEgAyACKQMINwMAIABBAUEBEHAiA0UNACADIAMtABBBIHI6ABALIABBsAFqIgAhBAJAA0AgBCgCACIDRQ0BIAMhBCADLQAQIgFBIHFFDQAgAyABQd8BcToAECADEHIgACEEIAMNAAsLIAJBIGokAAsrACAAQn83A+ABIABB+AFqQn83AwAgAEHwAWpCfzcDACAAQegBakJ/NwMAC5cCAgN/AX4jAEEgayIDJAACQAJAIAFB7QFqLQAAQf8BRw0AIABCADcDAAwBCwJAIAFBCkEgEHoiBA0AIABCADcDAAwBCyADQRhqIAFBCCAEEMsCIAMgAykDGDcDECABIANBEGoQfiAEIAEgAUHsAWotAAAQgwEiBTYCHAJAAkAgBQ0AIAMgAykDGDcDACABIAMQf0IAIQYMAQsgBUEMaiABQfABaiAFLwEEEMsEGiAEIAFB5AFqKQIANwMIIAQgAS0A7QE6ABUgBCABQe4Bai8BADsBECABQeMBai0AACEFIAQgAjsBEiAEIAU6ABQgAyADKQMYNwMIIAEgA0EIahB/IAMpAxghBgsgACAGNwMACyADQSBqJAALpAEBAn8CQAJAIAAvAQgNACAAKAKsASICRQ0BIAJB//8DOwESIAIgAi0AEEHwAXFBA3I6ABAgAiAAKALMASIDOwEUIAAgA0EBajYCzAEgAiABKQMANwMIIAJBARDbAUUNAAJAIAItABBBD3FBAkcNACACKAIsIAIoAggQVQsgAkIANwMIIAIgAi0AEEHwAXE6ABALDwtBtjxB7jZB6ABBkyEQqwQAC+sCAQd/IwBBIGsiAiQAAkACQCAALwEUIgMgACgCLCIEKALQASIFQf//A3FGDQAgAQ0AIABBAxBpQQAhBAwBCyACIAApAwg3AxAgBCACQRBqIAJBHGoQqgIhBiAEQfEBakEAOgAAIARB8AFqIgcgAzoAAAJAIAIoAhxB6wFJDQAgAkHqATYCHAsgByAGIAIoAhwiCBDLBBogBEHuAWpBggE7AQAgBEHsAWoiByAIQQJqOgAAIARB7QFqIAQtANwBOgAAIARB5AFqEJ4ENwIAIARB4wFqQQA6AAAgBEHiAWogBy0AAEEHakH8AXE6AAACQCABRQ0AIAIgBjYCAEH+FSACEC4LQQEhAQJAIAQtAAZBAnFFDQACQCADIAVB//8DcUcNAAJAIARB4AFqEIwEDQAgBCAEKALQAUEBajYC0AFBASEBDAILIABBAxBpQQAhAQwBCyAAQQMQaUEAIQELIAEhBAsgAkEgaiQAIAQLsQYCB38BfiMAQRBrIgEkAAJAAkAgAC0AEEEPcSICDQBBASEADAELAkACQAJAAkACQAJAIAJBf2oOBAECAwAECyABIAAoAiwgAC8BEhDZASAAIAEpAwA3AyBBASEADAULAkAgACgCLCICKAK0ASAALwESIgNBDGxqKAIAKAIQIgQNACAAQQAQaEEAIQAMBQsCQCACQeMBai0AAEEBcQ0AIAJB7gFqLwEAIgVFDQAgBSAALwEURw0AIAQtAAQiBSACQe0Bai0AAEcNACAEQQAgBWtBDGxqQWRqKQMAIAJB5AFqKQIAUg0AIAIgAyAALwEIEN0BIgRFDQAgAkHcA2ogBBCUAhpBASEADAULAkAgACgCGCACKALAAUsNACABQQA2AgxBACEDAkAgAC8BCCIERQ0AIAIgBCABQQxqEOACIQMLIAJB4AFqIQUgAC8BFCEGIAAvARIhByABKAIMIQQgAkEBOgDjASACQeIBaiAEQQdqQfwBcToAACACKAK0ASAHQQxsaigCACgCECIHQQAgBy0ABCIHa0EMbGpBZGopAwAhCCACQe4BaiAGOwEAIAJB7QFqIAc6AAAgAkHsAWogBDoAACACQeQBaiAINwIAAkAgAyIDRQ0AIAJB8AFqIAMgBBDLBBoLIAUQjAQiAkUhBCACDQQCQCAALwEKIgNB5wdLDQAgACADQQF0OwEKCyAAIAAvAQoQaSAEIQAgAg0FC0EAIQAMBAsCQCAAKAIsIgIoArQBIAAvARJBDGxqKAIAKAIQIgMNACAAQQAQaEEAIQAMBAsgACgCCCEFIAAvARQhBiAALQAMIQQgAkHjAWpBAToAACACQeIBaiAEQQdqQfwBcToAACADQQAgAy0ABCIHa0EMbGpBZGopAwAhCCACQe4BaiAGOwEAIAJB7QFqIAc6AAAgAkHsAWogBDoAACACQeQBaiAINwIAAkAgBUUNACACQfABaiAFIAQQywQaCwJAIAJB4AFqEIwEIgINACACRSEADAQLIABBAxBpQQAhAAwDCyAAQQAQ2wEhAAwCC0HuNkH8AkGtGxCmBAALIABBAxBpIAQhAAsgAUEQaiQAIAAL0wIBBn8jAEEQayIDJAAgAEHwAWohBCAAQewBai0AACEFAkACQAJAAkAgAg0AIAUhBSAEIQQMAQsgACACIANBDGoQ4AIhBgJAAkAgAygCDCIHIAAtAOwBTg0AIAQgB2otAAANACAGIAQgBxDlBA0AIAdBAWohBwwBC0EAIQcLIAciB0UNASAFIAdrIQUgBCAHaiEECyAEIQcgBSEEAkACQCAAQdwDaiIIIAEgAEHuAWovAQAgAhCWAiIFRQ0AAkAgBCAFLQAURw0AIAUhBQwCCyAIIAUQkgILQQAhBQsgBSIGIQUCQCAGDQAgCCABIAAvAe4BIAQQlQIiASACOwEWIAEhBQsgBSICQQhqIQECQAJAIAItABRBCk8NACABIQEMAQsgASgCACEBCyABIAcgBBDLBBogAiAAKQPAAT4CBCACIQAMAQtBACEACyADQRBqJAAgAAvIAgEFfwJAIAAvAQgNACAAQeABaiACIAItAAxBEGoQywQaAkAgACgApAFBPGooAgAiAkEISQ0AIAJBA3YiAkEBIAJBAUsbIQMgAEHcA2oiBCEFQQAhAgNAAkAgACgCtAEgAiIGQQxsaigCACgCECICRQ0AAkACQCAALQDtASIHDQAgAC8B7gFFDQELIAItAAQgB0cNAQsgAkEAIAItAARrQQxsakFkaikDACAAKQLkAVINACAAEHMCQCAALQDjAUEBcQ0AAkAgAC0A7QFBMU8NACAALwHuAUH/gQJxQYOAAkcNACAEIAYgACgCwAFB8LF/ahCXAgwBC0EAIQcDQCAFIAYgAC8B7gEgBxCZAiICRQ0BIAIhByAAIAIvAQAgAi8BFhDdAUUNAAsLIAAgBhDXAQsgBkEBaiIGIQIgBiADRw0ACwsgABB2CwvOAQEEfwJAIAAvAQYiAkEEcQ0AAkAgAkEIcQ0AIAEQ2gMhAiAAQcUAIAEQ2wMgAhBPCwJAIAAoAKQBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoArQBIQRBACECA0ACQCAEIAIiAkEMbGooAgAgAUcNACAAQdwDaiACEJgCIABB+AFqQn83AwAgAEHwAWpCfzcDACAAQegBakJ/NwMAIABCfzcD4AEgACACENcBDAILIAJBAWoiBSECIAUgA0cNAAsLIAAQdgsL4gEBBn8jAEEQayIBJAAgACAALwEGQQRyOwEGEOIDIAAgAC8BBkH7/wNxOwEGAkAgACgApAFBPGooAgAiAkEISQ0AIABBpAFqIQMgAkEDdiICQQEgAkEBSxshBEEAIQIDQCAAKACkASIFKAI4IQYgASADKAIANgIMIAFBDGogAiICEG0gBSAGaiACQQN0aiIGKAIAEOEDIQUgACgCtAEgAkEMbGogBTYCAAJAIAYoAgBB7fLZjAFHDQAgBSAFLQAMQQFyOgAMCyACQQFqIgUhAiAFIARHDQALCxDjAyABQRBqJAALIQAgACAALwEGQQRyOwEGEOIDIAAgAC8BBkH7/wNxOwEGCzYBAX8gAC8BBiECAkAgAUUNACAAIAJBAnI7AQYPCyAAIAJB/f8DcTsBBiAAIAAoAswBNgLQAQsTAEEAQQAoApTIASAAcjYClMgBCxYAQQBBACgClMgBIABBf3NxNgKUyAELCQBBACgClMgBC9kDAQR/IwBBMGsiAyQAAkACQCACIAAoAKQBIgQgBCgCYGprIAQvAQ5BBHRJDQACQAJAIAJBoNAAa0EMbUEgSw0AIAIoAggiAi8BACIERQ0BIAQhBCACIQIDQCADQShqIARB//8DcRCrAiACIgIvAQIiBCEFAkACQCAEQSBLDQACQCAAIAUQ5wEiBUGg0ABrQQxtQSBLDQAgA0EANgIkIAMgBEHgAGo2AiAMAgsgA0EgaiAAQQggBRDLAgwBCyAEQc+GA00NBSADIAU2AiAgA0EDNgIkCyADIAMpAyg3AwggAyADKQMgNwMAIAAgASADQQhqIAMQ6AEgAi8BBCIFIQQgAkEEaiECIAUNAAwCCwALAkACQCACDQBBACEEDAELIAItAANBD3EhBAsCQAJAIARBfGoOBgEAAAAAAQALQaTIAEGWMkHMAEGOGxCrBAALIAIvAQgiBEUNACAEQQF0IQYgAigCDCECQQAhBANAIAMgAiAEIgRBA3QiBWopAwA3AxggAyACIAVBCHJqKQMANwMQIAAgASADQRhqIANBEGoQ6AEgBEECaiIFIQQgBSAGSQ0ACwsgA0EwaiQADwtBljJBwwBBjhsQpgQAC0HYO0GWMkE9Qc8lEKsEAAuqAgEEfwJAAkACQAJAAkAgAUEZSw0AAkBBrv3+CiABdkEBcSICDQAgAUGwzABqLQAAIQMCQCAAKAK4AQ0AIABBIBB7IQQgAEEIOgBEIAAgBDYCuAEgBA0AQQAhAwwBCyADQX9qIgRBCE8NAyAAKAK4ASAEQQJ0aigCACIFIQMgBQ0AAkAgAEEJQRAQeiIDDQBBACEDDAELIAAoArgBIARBAnRqIAM2AgAgAUEhTw0EIANBoNAAIAFBDGxqIgBBACAAKAIIGzYCBCADIQMLIAMhACACRQ0BCyABQSFPDQNBoNAAIAFBDGxqIgFBACABKAIIGyEACyAADwtBuDtBljJB/gFBqB0QqwQAC0HEOUGWMkHhAUHBHRCrBAALQcQ5QZYyQeEBQcEdEKsEAAu1AgEDfyMAQSBrIgQkACAEIAIpAwA3AxACQAJAAkAgACABIARBEGoQ6gEiBUUNACAFIAMpAwA3AwAMAQsgBCACKQMANwMIAkAgACAEQQhqEKgCDQAgBCACKQMANwMAIARBGGogAEHCACAEELwCDAELIAEvAQoiBSABLwEIIgZJDQECQCAFIAZHDQAgACAFQQpsQQN2IgVBBCAFQQRLGyIGQQR0EHsiBUUNASABIAY7AQoCQCABLwEIIgZFDQAgBSABKAIMIAZBBHQQywQaCyABIAU2AgwgACgC2AEgBRB8CyABKAIMIAEvAQhBBHRqIAIpAwA3AwAgASgCDCABLwEIQQR0akEIaiADKQMANwMAIAEgAS8BCEEBajsBCAsgBEEgaiQADwtBjiBBljJBjAFBiw8QqwQACxwAIAEgACgApAEiACAAKAJgamsgAC8BDkEEdEkL7AICCX8BfiMAQSBrIgMkACADIAIpAwA3AxBBACEEAkAgACADQRBqEKgCRQ0AIAEvAQgiBUEARyEEIAVBAXQhBiABKAIMIQcCQAJAIAUNACAEIQgMAQsgAigCACEJIAIpAwAhDCAEIQFBACEKA0AgASEIAkAgByAKIgRBA3RqIgEoAAAgCUcNACABKQMAIAxSDQAgCCEIIAcgBEEDdEEIcmohCwwCCyAEQQJqIgogBkkiBCEBIAohCiAEIQggBA0ACwsgCyEEIAhBAXENACADIAIpAwA3AwggACADQQhqIANBHGoQqgIhCAJAAkAgBQ0AQQAhBAwBC0EAIQQDQCADIAcgBCIEQQN0aikDADcDACAAIAMgA0EYahCqAiEBAkAgAygCGCADKAIcIgpHDQAgCCABIAoQ5QQNACAHIARBA3RBCHJqIQQMAgsgBEECaiIBIQQgASAGSQ0AC0EAIQQLIAQhBAsgA0EgaiQAIAQLpgQBBX8jAEEQayIEJAACQAJAIAEgACgApAEiBSAFKAJgamsgBS8BDkEEdEkNACACLwEIIQYCQAJAIAFBoNAAa0EMbUEgSw0AIAEoAggiByEFA0AgBSIIQQRqIQUgCC8BAA0ACyAAIAIgBiAIIAdrQQJ1EOwBDQEgASgCCCIFLwEARQ0BIAYhCCAFIQEDQCABIQUgAigCDCAIIghBA3RqIQECQAJAIANFDQAgBEEIaiAFLwEAEKsCIAEgBCkDCDcDAAwBCyAFLwECIgchBgJAAkAgB0EgSw0AAkAgACAGEOcBIgZBoNAAa0EMbUEgSw0AIARBADYCDCAEIAdB4ABqNgIIDAILIARBCGogAEEIIAYQywIMAQsgB0HPhgNNDQYgBCAGNgIIIARBAzYCDAsgASAEKQMINwMACyAIQQFqIQggBUEEaiEBIAUvAQQNAAwCCwALAkACQCABDQBBACEFDAELIAEtAANBD3EhBQsCQAJAIAVBfGoOBgEAAAAAAQALQaTIAEGWMkHtAEG+ERCrBAALIAEoAgwhByAAIAIgBiABLwEIIgUQ7AENACAFRQ0AIAVBAXQhACADQQFzIQNBACEFIAYhCANAIAIoAgwgCCIIQQN0aiAHIAUiBSADckEDdGopAwA3AwAgBUECaiIBIQUgCEEBaiEIIAEgAEkNAAsLIARBEGokAA8LQZYyQdoAQb4REKYEAAtB2DtBljJBPUHPJRCrBAAL4QIBBn8jAEEQayIEJAACQAJAIANBgTxIDQAgBEEIaiAAQQ8QvgJBfCEDDAELAkBBACABLwEIIgVrIAMgBSADaiIGQQBIGyIDRQ0AAkAgBkEAIAZBAEobIgZBgTxJDQAgBEEIaiAAQQ8QvgJBeiEDDAILAkAgBiABLwEKTQ0AAkAgACAGQQpsQQN2IgdBBCAHQQRLGyIIQQN0EHsiBw0AQXshAwwDCwJAIAEoAgwiCUUNACAHIAkgAS8BCEEDdBDLBBoLIAEgCDsBCiABIAc2AgwgACgC2AEgBxB8CyABLwEIIAUgAiAFIAJJGyIAayECAkACQCADQX9KDQAgASgCDCAAQQN0aiIAIAAgA0EDdGsgAiADahDMBBoMAQsgASgCDCAAQQN0IgBqIgUgA0EDdCIDaiAFIAIQzAQaIAEoAgwgAGpBACADEM0EGgsgASAGOwEIC0EAIQMLIARBEGokACADC94CAQZ/IAEvAQohBAJAAkAgAS8BCCIFDQBBACEGDAELIAEoAgwiByAEQQN0aiEIQQAhBgNAAkAgCCAGIgZBAXRqLwEAIAJHDQAgByAGQQN0aiEGDAILIAZBAWoiCSEGIAkgBUcNAAtBACEGCwJAIAYiBkUNACAGIAMpAwA3AwAPCwJAIAQgBUkNAAJAAkAgBCAFRw0AIAAgBEEKbEEDdiIGQQQgBkEESxsiCUEKbBB7IgZFDQEgAS8BCiEFIAEgCTsBCgJAIAEvAQgiCEUNACAGIAEoAgwiBCAIQQN0EMsEIAlBA3RqIAQgBUEDdGogAS8BCEEBdBDLBBoLIAEgBjYCDCAAKALYASAGEHwLIAEoAgwgAS8BCEEDdGogAykDADcDACABKAIMIAEvAQpBA3RqIAEvAQhBAXRqIAI7AQAgASABLwEIQQFqOwEICw8LQY4gQZYyQacBQfgOEKsEAAuAAQECfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAAgASADQQhqEOoBIgINAEF/IQEMAQsgASABLwEIIgBBf2o7AQgCQCAAIAJBeGoiBCABKAIMa0EDdUEBdkF/c2oiAUUNACAEIAJBCGogAUEEdBDMBBoLQQAhAQsgA0EQaiQAIAELiQECBH8BfgJAAkAgAi8BCCIEDQBBACECDAELIAIoAgwiBSACLwEKQQN0aiEGQQAhAgNAAkAgBiACIgJBAXRqLwEAIANHDQAgBSACQQN0aiECDAILIAJBAWoiByECIAcgBEcNAAtBACECCwJAAkAgAiICDQBCACEIDAELIAIpAwAhCAsgACAINwMAC3UBAn8CQCACRQ0AIAJB//8BNgIACwJAIAEoAgQiA0GAgMD/B3FFDQBBAA8LQQAhBAJAIANBD3FBBkcNACABKAIAIQECQCACRQ0AIAIgAUH//wFxNgIACyAAKACkASICIAIoAmBqIAFBDXZB/P8fcWohBAsgBAuXAQEEfwJAIAAoAKQBIgBBPGooAgBBA3YgAUsNAEEADwtBACECAkAgAC8BDiIDRQ0AIAAgACgCOGogAUEDdGooAgAhASAAIAAoAmBqIQRBACECAkADQCAEIAIiBUEEdGoiAiAAIAIoAgQiACABRhshAiAAIAFGDQEgAiEAIAVBAWoiBSECIAUgA0cNAAtBAA8LIAIhAgsgAguHBgELfyMAQSBrIgQkACABQaQBaiEFIAIhAgJAAkACQAJAAkACQANAIAIiBkUNASAGIAUoAAAiAiACKAJgaiIHayACLwEOQQR0Tw0DIAcgBi8BCkECdGohCCAGLwEIIQkCQAJAIAMoAgQiAkGAgMD/B3ENACACQQ9xQQRHDQAgCUEARyECAkACQCAJDQAgAiECQQAhCgwBC0EAIQogAiECIAghCwJAAkAgAygCACIMIAgvAQBGDQADQCAKQQFqIgIgCUYNAiACIQogDCAIIAJBA3RqIgsvAQBHDQALIAIgCUkhAiALIQsLIAIhAiALIAdrIgpBgIACTw0IIABBBjYCBCAAIApBDXRB//8BcjYCACACIQJBASEKDAELIAIgCUkhAkEAIQoLIAohCiACRQ0AIAohCSAGIQIMAQsgBCADKQMANwMQIAEgBEEQaiAEQRhqEKoCIQ0CQAJAAkACQAJAIAQoAhhFDQAgCUEARyICIQpBACEMIAkNASACIQIMAgsgAEIANwMAQQEhAiAGIQoMAwsDQCAKIQcgCCAMIgxBA3RqIg4vAQAhAiAEKAIYIQogBCAFKAIANgIMIARBDGogAiAEQRxqEN8CIQICQCAKIAQoAhwiC0cNACACIA0gCxDlBA0AIA4gBSgAACICIAIoAmBqayICQYCAAk8NCyAAQQY2AgQgACACQQ10Qf//AXI2AgAgByECQQEhCQwDCyAMQQFqIgIgCUkiCyEKIAIhDCACIAlHDQALIAshAgtBCSEJCyAJIQkCQCACQQFxRQ0AIAkhAiAGIQoMAQtBACECQQAhCiAGKAIEQfP///8BRg0AIAYvAQJBD3EiCUECTw0IQQAhAiAFKAAAIgogCigCYGogCUEEdGohCgsgAiEJIAohAgsgAiECIAlFDQAMAgsACyAAQgA3AwALIARBIGokAA8LQbXIAEGWMkHFAkG1GRCrBAALQYHJAEGWMkGcAkGWMRCrBAALQYHJAEGWMkGcAkGWMRCrBAALQbc6QZYyQb8CQaIxEKsEAAvzBAEFfyMAQRBrIgQkAAJAAkACQCACRQ0AIAIoAgBBgICA+ABxQYCAgPgARw0AIAIhAgJAAkADQCACIgVFDQEgBSgCCCECAkACQAJAAkAgAygCBCIGQYCAwP8HcQ0AIAZBD3FBBEcNACADKAIAIgZBgIB/cUGAgAFHDQAgAi8BACIHRQ0BIAZB//8AcSEIIAchBiACIQIDQCACIQICQCAIIAZB//8DcUcNACACLwECIgIhBgJAIAJBIEsNAAJAIAEgBhDnASIGQaDQAGtBDG1BIEsNACAAQQA2AgQgACACQeAAajYCACAFIQJBAA0IDAoLIAAgAUEIIAYQywIgBSECQQANBwwJCyACQc+GA00NCiAAIAY2AgAgAEEDNgIEIAUhAkEADQYMCAsgAi8BBCIHIQYgAkEEaiECIAcNAAwCCwALIAQgAykDADcDACABIAQgBEEMahCqAiEIIAQoAgwgCBD6BEcNASACLwEAIgchBiACIQIgB0UNAANAIAIhAgJAIAZB//8DcRDeAiAIEPkEDQAgAi8BAiICIQYCQCACQSBLDQACQCABIAYQ5wEiBkGg0ABrQQxtQSBLDQAgAEEANgIEIAAgAkHgAGo2AgAMBgsgACABQQggBhDLAgwFCyACQc+GA00NCiAAIAY2AgAgAEEDNgIEDAQLIAIvAQQiByEGIAJBBGohAiAHDQALCyAFKAIEIQJBAQ0CDAQLIABCADcDAAsgBSECQQANAAwCCwALIABCADcDAAsgBEEQaiQADwtB7cYAQZYyQeICQaMZEKsEAAtB2DtBljJBPUHPJRCrBAALQdg7QZYyQT1BzyUQqwQAC9cFAgV/An4jAEEQayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EgBUGAgMD/B3EbIgVBfWoOBwMCAgACAgECCwJAIAIoAgQiBkGAgMD/B3ENACAGQQ9xQQJHDQAgAigCACICQYCAAk8NBSADKAIAIQMgAEEGNgIEIAAgA0GAgH5xIAJyNgIADAQLIAVBfWoOBwIBAQEBAQABCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeiIDDQAgAEIANwMADAMLIAMgCjcDECADIAk3AwggACABQQggAxDLAgwCCyAAIAMpAwA3AwAMAQsgAygCACEGQQAhBQJAIAMoAgRBj4DA/wdxQQNHDQBBACEFIAZBsPl8aiIHQQBIDQAgB0EALwGwuwFODQNBACEFQZDUACAHQQN0aiIHLQADQQFxRQ0AIAchBSAHLQACDQQLAkAgBSIFRQ0AIAUoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCwJAIAZB//8DSw0AAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcSIHGyIIDgkAAAAAAAIAAgECCyAHDQYgAigCACIDQYCAgIABTw0HIAVB8P8/cQ0IIAAgAyAIQRx0cjYCACAAIAZBBHRBBXI2AgQMAgsgBUHw/z9xDQggACACKAIANgIAIAAgBkEEdEEKcjYCBAwBCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeiIDDQAgAEIANwMADAELIAMgCjcDECADIAk3AwggACABQQggAxDLAgsgBEEQaiQADwtBlyhBljJBqgNBzioQqwQAC0GVEUGWMkGWA0GCMBCrBAALQew/QZYyQZkDQYIwEKsEAAtBxhlBljJBxQNBzioQqwQAC0HwwABBljJBxgNBzioQqwQAC0GowABBljJBxwNBzioQqwQAC0GowABBljJBzQNBzioQqwQACy8AAkAgA0GAgARJDQBBqCNBljJB1gNB+yYQqwQACyAAIAEgA0EEdEEJciACEMsCCzIBAX8jAEEQayIEJAAgBCABKQMANwMIIAAgBEEIaiACIANBABD3ASEBIARBEGokACABC5oDAQN/IwBBIGsiBSQAIANBADYCACACQgA3AwACQAJAIARBAkwNAEF/IQYMAQsgASgCACEHAkACQAJAAkACQAJAQRAgASgCBCIGQQ9xIAZBgIDA/wdxG0F9ag4IAAUBBQUEAwIFCyACQgA3AwAgByEGDAULIAIgB0Ecdq1CIIYgB0H/////AHGthDcDACAGQQR2Qf//A3EhBgwECyACIAetQoCAgICAAYQ3AwAgBkEEdkH//wNxIQYMAwsgAyAHNgIAIAZBBHZB//8DcSEGDAILAkAgBw0AQX8hBgwCC0F/IQYgBygCAEGAgID4AHFBgICAOEcNASAFIAcpAxA3AxAgACAFQRBqIAIgAyAEQQFqEPcBIQMgAiAHKQMINwMAIAMhBgwBC0F/IQYgASkDAFANACAFIAEpAwA3AwggBUEYaiAAIAVBCGpB2AAQ+AECQAJAIAUpAxhQRQ0AQX8hAgwBCyAFIAUpAxg3AwAgACAFIAIgAyAEQQFqEPcBIQMgAiABKQMANwMAIAMhAgsgAiEGCyAFQSBqJAAgBgupAgICfwF+IwBBMGsiBCQAIARBIGogAxCrAiABIAQpAyA3AzAgBCACKQMAIgY3AxggBCAGNwMoIAEgBEEYakEAEPsBIQMgAUIANwMwIAQgBCkDIDcDECAEQShqIAEgAyAEQRBqEIACQQAhAwJAAkACQCAEKAIsQY+AwP8HcUEDRw0AQQAhAyAEKAIoQbD5fGoiBUEASA0AIAVBAC8BsLsBTg0BQQAhA0GQ1AAgBUEDdGoiBS0AA0EBcUUNACAFIQMgBS0AAg0CCwJAAkAgAyIDRQ0AIAMoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCyAAIAQpAyg3AwALIARBMGokAA8LQZURQZYyQZYDQYIwEKsEAAtB7D9BljJBmQNBgjAQqwQAC74CAQd/IAAoArQBIAFBDGxqKAIEIgIhAwJAIAINAAJAIABBCUEQEHoiBA0AQQAPC0EAIQMCQCAAKACkASICQTxqKAIAQQN2IAFNDQBBACEDIAIvAQ4iBUUNACACIAIoAjhqIAFBA3RqKAIAIQMgAiACKAJgaiEGQQAhBwJAA0AgBiAHIghBBHRqIgcgAiAHKAIEIgIgA0YbIQcgAiADRg0BIAchAiAIQQFqIgghByAIIAVHDQALQQAhAwwBCyAHIQMLIAQgAzYCBAJAIAAoAKQBQTxqKAIAQQhJDQAgACgCtAEiAiABQQxsaigCACgCCCEHQQAhAwNAAkAgAiADIgNBDGxqIgEoAgAoAgggB0cNACABIAQ2AgQLIANBAWoiASEDIAEgACgApAFBPGooAgBBA3ZJDQALCyAEIQMLIAMLYwEBfyMAQRBrIgIkACACIAEpAwA3AwgCQCAAIAJBCGpBARD7ASIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtBvsYAQZYyQcsFQZoKEKsEAAsgAEIANwMwIAJBEGokACABC+kGAgR/AX4jAEHQAGsiAyQAAkACQAJAAkAgASkDAEIAUg0AIAMgASkDACIHNwMwIAMgBzcDQEHUIUHcISACQQFxGyECIAAgA0EwahCdAhC0BCEBAkACQCAAKQAwQgBSDQAgAyACNgIAIAMgATYCBCADQcgAaiAAQZ4UIAMQuAIMAQsgAyAAQTBqKQMANwMoIAAgA0EoahCdAiEEIAMgAjYCECADIAQ2AhQgAyABNgIYIANByABqIABBrhQgA0EQahC4AgsgARAgQQAhAQwBCwJAAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F+ag4HAQICAgACAwILIAAoAKQBIgQgBCgCYGogASgCAEENdkH8/x9xai8BAiIBQYCgAk8NBEGHAiABQQx2IgF2QQFxRQ0EIAAgAUECdEHYzABqKAIAIAIQ/AEhAQwDCyAAKAK0ASABKAIAIgVBDGxqKAIIIQQCQCACQQJxRQ0AIAQhAQwDCyAEIQEgBA0CAkAgACAFEPkBIgENAEEAIQEMAwsCQCACQQFxDQAgASEBDAMLIAAgARCAASEBIAAoArQBIAVBDGxqIAE2AgggASEBDAILIAMgASkDADcDOAJAIAAgA0E4ahDVAiIEQQJHDQAgASgCBA0AAkAgASgCAEGgf2oiBkEgSw0AIAAgBiACQQRyEPwBIQULIAUhASAGQSFJDQILQQAhAQJAIARBC0oNACAEQcrMAGotAAAhAQsgASIBRQ0DIAAgASACEPwBIQEMAQsCQAJAIAEoAgAiBA0AQQAhBQwBCyAELQADQQ9xIQULIAQhAQJAAkACQAJAAkACQAJAIAVBfWoOCAAHBQIDBAcBBAsgBEEEaiEBQQQhBAwFCyAEQRhqIQFBFCEEDAQLIABBCCACEPwBIQEMBAsgAEEQIAIQ/AEhAQwDC0GWMkG3BUGfLRCmBAALIARBCGohAUEGIQQLIAQhBSABIgYoAgAiBCEBAkAgBA0AQQAhASACQQFxRQ0AIAYgACAAIAUQ5wEQgAEiBDYCACAEIQEgBA0AQQAhAQwBCyABIQQCQCACQQJxRQ0AIAQhAQwBCyAEIQEgBA0AIAAgBRDnASEBCyADQdAAaiQAIAEPC0GWMkH2BEGfLRCmBAALQcDDAEGWMkGXBUGfLRCrBAALrwMBAX8jAEHgAGsiAyQAAkACQCACQQZxQQJGDQAgACABEOcBIQECQCACQQFxDQAgASECDAILAkACQCACQQRxRQ0AAkAgAUGg0ABrQQxtQSBLDQBB+A8QtAQhAgJAIAApADBCAFINACADQdQhNgIwIAMgAjYCNCADQdgAaiAAQZ4UIANBMGoQuAIgAiECDAMLIAMgAEEwaikDADcDUCAAIANB0ABqEJ0CIQEgA0HUITYCQCADIAE2AkQgAyACNgJIIANB2ABqIABBrhQgA0HAAGoQuAIgAiECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsgASECAkAgAEF8ag4GBAAAAAAEAAtBy8YAQZYyQbEEQfgaEKsEAAtBsyUQtAQhAgJAAkAgACkAMEIAUg0AIANB1CE2AgAgAyACNgIEIANB2ABqIABBnhQgAxC4AgwBCyADIABBMGopAwA3AyggACADQShqEJ0CIQEgA0HUITYCECADIAE2AhQgAyACNgIYIANB2ABqIABBrhQgA0EQahC4AgsgAiECCyACECALQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEPsBIQEgAEIANwMwIAJBEGokACABC6cCAQJ/AkACQCABQaDQAGtBDG1BIEsNACABKAIEIQIMAQsCQAJAIAEgACgApAEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoArgBDQAgAEEgEHshAiAAQQg6AEQgACACNgK4ASACDQBBACECDAMLIAAoArgBKAIUIgMhAiADDQIgAEEJQRAQeiICDQFBACECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsCQAJAIABBfGoOBgEAAAAAAQALQYnHAEGWMkHkBUHiGhCrBAALIAEoAgQPCyAAKAK4ASACNgIUIAJBoNAAQagBakEAQaDQAEGwAWooAgAbNgIEIAIhAgtBACACIgBBoNAAQRhqQQBBoNAAQSBqKAIAGyAAGyIAIAAgAUYbC6IBAgF/AX4jAEEgayICJAAgAiABKQMANwMIIAJBEGogACACQQhqQTQQ+AECQAJAIAIpAxBCAFINAEEAIQEgAC0ARQ0BIAJBGGogAEGNJ0EAELgCQQAhAQwBCyACIAIpAxAiAzcDGCAC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vAILIARB0ABqJAALuwEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQQ8QvgIMAQsCQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQeyIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0EMsEGgsgASAHOwEKIAEgBjYCDCAAKALYASAGEHwLIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEM0CIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQdgAaikDACIDNwMAIAIgAzcDCCAAIAIQzAIhBCACQRBqJAAgBAssAQF/IwBBEGsiAiQAIAJBCGogARDIAiAAKAKsASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARDJAiAAKAKsASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARDKAiAAKAKsASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQywIgACgCrAEgAikDCDcDICACQRBqJAALegIDfwF+IwBBIGsiASQAIAEgACkDUCIENwMIIAEgBDcDGAJAAkAgACABQQhqENMCIgINAEEAIQMMAQsgAi0AA0EPcSEDCyACIQICQAJAIANBfGoOBgEAAAAAAQALIAFBEGogAEGgLEEAELgCQQAhAgsgAUEgaiQAIAILLAEBfwJAIAAoAiwiAygCrAENACAAIAI2AjQgACABNgIwDwsgAyACIAERAgALMgEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqENUCIQEgAkEQaiQAIAFBfmpBBEkLTQEBfwJAIAJBIUkNACAAQgA3AwAPCwJAIAEgAhDnASIDQaDQAGtBDG1BIEsNACAAQQA2AgQgACACQeAAajYCAA8LIAAgAUEIIAMQywILJAACQCABLQAUQQpJDQAgASgCCBAgCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECALIANBADoA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AyEICyABIQkgCCEIIAENAAwDCwALIAMvAQ5BgSJHDQEgAy0AA0EBcQ0BIAIoAgAhCkEAIQFBACgC3GZBf2ohCAJAA0AgCSELAkAgASIJIAgiAUwNAEEAIQsMAgsCQAJAQdDjACABIAlqQQJtIghBDGxqIgUoAgQiByAKTw0AIAhBAWohCSABIQggCyELQQEhBwwBCwJAIAcgCksNACAJIQkgASEIIAUhC0EAIQcMAQsgCSEJIAhBf2ohCCALIQtBASEHCyAJIQEgCCEIIAsiCyEJIAshCyAHDQALCyALIghFDQEgACgCJCIBRQ0BIANBEGohCyABIQEDQAJAIAEiASgCBCACRw0AAkAgAS0ACSIJRQ0AIAEgCUF/ajoACQsCQCALIAMtAAwgCC8BCBBKIgy9Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASAMOQMYIAFBADYCICABQThqIAw5AwAgAUEwaiAMOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEJIAFBACgC2M0BIgcgAUHEAGooAgAiCiAHIAprQQBIGyIHNgIUIAFBKGoiCiABKwMYIAcgCWu4oiAKKwMAoDkDAAJAIAFBOGorAwAgDGNFDQAgASAMOQM4CwJAIAFBMGorAwAgDGRFDQAgASAMOQMwCyABIAw5AxgLIAAoAggiCUUNACAAQQAoAtjNASAJajYCHAsgASgCACIJIQEgCQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNACABIQEDQAJAAkAgASIBKAIMIgkNAEEAIQgMAQsgCSADKAIEEPkERSEICyAIIQgCQAJAAkAgASgCBCACRw0AIAgNAiAJECAgAygCBBC0BCEJDAELIAhFDQEgCRAgQQAhCQsgASAJNgIMCyABKAIAIgkhASAJDQALCw8LQes+QYw1QZUCQecKEKsEAAvSAQEEf0HIABAfIgJB/wE6AAogAiABNgIEIAIgACgCJDYCACAAIAI2AiQgAkKAgICAgICA/P8ANwMYIAJBwABqQQAoAtjNASIDNgIAIAIoAhAiBCEFAkAgBA0AAkACQCAALQASRQ0AIABBKGohBQJAIAAoAihFDQAgBSEADAILIAVB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uJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAtjNASABajYCHAsLuQIBBX8gAkEBaiEDIAFB0z0gARshBAJAAkAgACgCJCIBDQAgASEFDAELIAEhBgNAAkAgBiIBKAIMIgZFDQAgBiAEIAMQ5QQNACABIQUMAgsgASgCACIBIQYgASEFIAENAAsLIAUiBiEBAkAgBg0AQcgAEB8iAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUHAAGpBACgC2M0BIgU2AgAgASgCECIHIQYCQCAHDQACQAJAIAAtABJFDQAgAEEoaiEGAkAgACgCKEUNACAGIQYMAgsgBkGIJzYCACAGIQYMAQsgAEEMaiEGCyAGKAIAIQYLIAFBxABqIAYgBWo2AgAgAUHmLBDDAiABIAMQHyIGNgIMIAYgBCACEMsEGiABIQELIAELOwEBf0EAQYDbABCSBCIBNgLAygEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQdQAIAEQ5gMLpQIBA38CQEEAKALAygEiAkUNACACIAAgABD6BBDFAiEAIAG9Qv///////////wCDQoCAgICAgID4/wBWDQACQCAAKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgACABOQMYIABBADYCICAAQThqIAE5AwAgAEEwaiABOQMAIABBKGpCADcDACAAIABBwABqKAIANgIUCyAAIAAoAiBBAWo2AiAgACgCFCECIABBACgC2M0BIgMgAEHEAGooAgAiBCADIARrQQBIGyIDNgIUIABBKGoiBCAAKwMYIAMgAmu4oiAEKwMAoDkDAAJAIABBOGorAwAgAWNFDQAgACABOQM4CwJAIABBMGorAwAgAWRFDQAgACABOQMwCyAAIAE5AxgLC8MCAgF+BH8CQAJAAkACQCABEMkEDgQAAQICAwsgAEICNwMADwsCQCABRAAAAAAAAAAAZEUNACAAQsIANwMADwsgAELDADcDAA8LIABCgICAgHA3AwAPCwJAIAG9IgJCIIinIgMgAqciBHINACAAQoCAgIBwNwMADwsCQCADQRR2Qf8PcSIFQf8HSQ0AAkACQCAFQZMISw0AIAQNAgJAIAVBkwhGDQAgA0H//z9xIAVBjXhqdA0DCyADQf//P3FB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BDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCCAgsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEL0DIAMgAykDIDcDKCACKAJIIQQgAyACKAKkATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBDZAhsiBEF/Sg0AIANBOGogAkH6ABB1IANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQggILIANBwABqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhC9AyADIAMpAyA3AyggAigCSCEEIAMgAigCpAE2AhwgBEGAgANyIQQCQAJAIARBfyADQRxqIAQQ2QIbIgRBf0oNACADQThqIAJB+gAQdSADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEIICCyADQcAAaiQAC4wBAQJ/IwBBIGsiAyQAIAIoAkghBCADIAIoAqQBNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEENkCGyIEQX9KDQAgA0EYaiACQfoAEHUgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDnASEEIAMgAykDEDcDACAAIAIgBCADEIACIANBIGokAAuMAQECfyMAQSBrIgMkACACKAJIIQQgAyACKAKkATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBDZAhsiBEF/Sg0AIANBGGogAkH6ABB1IANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQRUQ5wEhBCADIAMpAxA3AwAgACACIAQgAxCAAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEOcBEIABIgMNACABQRAQVAsgASgCrAEhBCACQQhqIAFBCCADEMsCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARC+AyIDEIIBIgQNACABIANBA3RBEGoQVAsgASgCrAEhAyACQQhqIAFBCCAE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AikDCDcDACABIAJBARC3AgsgAkEQaiQACwIAC4ICAQN/IwBBIGsiAyQAIANBGGogAhC9AyADIAMpAxg3AwACQAJAAkACQCACIAMgA0EQaiADQQxqEPYBIgRBf0oNACAAIAJByxxBABC4AgwBCwJAAkAgBEHQhgNIDQAgBEGw+XxqIgRBAC8BsLsBTg0DQZDUACAEQQN0ai0AA0EIcQ0BIAAgAkHQFkEAELgCDAILIAQgAigApAEiBUEkaigCAEEEdk4NAyAFIAUoAiBqIARBBHRqLQALQQJxDQAgACACQdgWQQAQuAIMAQsgACADKQMYNwMACyADQSBqJAAPC0GVEUHDMkHrAkHTChCrBAALQZrHAEHDMkHwAkHTChCrBAALVgECfyMAQSBrIgMkACADQRhqIAIQvQMgA0EQaiACEL0DIAMgAykDGDcDCCACIANBCGoQ/wEhBCADIAMpAxA3AwAgACACIAMgBBCBAhDKAiADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQvQMgA0EQaiACEL0DIAMgAykDGDcDCCADIAMpAxA3AwAgACACIANBCGogAxD0ASADQSBqJAALPgEBfwJAIAEtAEIiAg0AIAAgAUHsABB1DwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALagECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEHUMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQzQIhACABQRBqJAAgAAtqAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQdQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARDNAiEAIAFBEGokACAAC4gCAgJ/AX4jAEHAAGsiAyQAAkACQCABLQBCIgQNACADQThqIAFB7AAQdQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQzwINAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahCoAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahC8AkIAIQUM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IAJEAADA////30FkDQACQAJAIAJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELIAEhAQsgACADIAEQ+AML9wEAAkAgAUEISQ0AIAAgASACtxD3Aw8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQfoxQa4BQZE+EKYEAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALugMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhD5A7chAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0H6MUHKAUGlPhCmBAALQYCAgIB4IQELIAELoAECAX8BfAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhD5A7chAwsgAyEDAkAgAUEQTw0AIAMPCyAD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agsZAAJAIAENAEEBEB8PCyABEB8gACABEMsECxIAAkBBACgC5M0BRQ0AELkECwueAwEHfwJAQQAvAejNASIARQ0AIAAhAUEAKALgzQEiACICIQMgACEAIAIhAgNAIAAhBCACIgBBCGohBSABIQIgAyEBA0AgASEBIAIhAwJAAkACQCAALQAFIgJB/wFHDQAgACABRw0BQQAgAyABLQAEQQNqQfwDcUEIaiICayIDOwHozQEgASABIAJqIANB//8DcRCjBAwCC0EAKALAxQEgACgCAGtBAEgNACACQf8AcSAALwEGIAUgAC0ABBDDBA0EAkACQCAALAAFIgFBf0oNAAJAIABBACgC4M0BIgFGDQBB/wEhAQwCC0EAQQAvAejNASABLQAEQQNqQfwDcUEIaiICayIDOwHozQEgASABIAJqIANB//8DcRCjBAwDCyAAIAAoAgBB0IYDajYCACABQYB/ciEBCyAAIAE6AAULQQAvAejNASIEIQFBACgC4M0BIgUhAyAALQAEQQNqQfwDcSAAakEIaiIGIQAgBiECIAYgBWsgBEgNAgwDC0EALwHozQEiAyECQQAoAuDNASIGIQEgBCAGayADSA0ACwsLC+4CAQR/AkACQBAhDQAgAUGAAk8NAUEAQQAtAOrNAUEBaiIEOgDqzQEgAC0ABCAEQQh0IAFB/wFxckGAgH5yIgVB//8DcSACIAMQwwQaAkBBACgC4M0BDQBBgAEQHyEBQQBBvQE2AuTNAUEAIAE2AuDNAQsCQCADQQhqIgZBgAFKDQACQAJAQYABQQAvAejNASIBayAGSA0AIAEhBwwBCyABIQQDQEEAIARBACgC4M0BIgEtAARBA2pB/ANxQQhqIgRrIgc7AejNASABIAEgBGogB0H//wNxEKMEQQAvAejNASIBIQQgASEHQYABIAFrIAZIDQALC0EAKALgzQEgByIEaiIBIAU7AQYgASADOgAEIAEgAC0ABDoABSABQQhqIAIgAxDLBBogAUEAKALAxQFBoJwBajYCAEEAIANB/wFxQQNqQfwDcSAEakEIajsB6M0BCw8LQdw1Qd0AQdALEKYEAAtB3DVBI0GhKxCmBAALGwACQEEAKALszQENAEEAQYAEEIYENgLszQELCzsBAX8CQCAADQBBAA8LQQAhAQJAIAAQlwRFDQAgACAALQADQb8BcToA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AkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEMsEGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQ2AQhAAwBCyADEM4EIQUgACAEIAMQ2AQhACAFRQ0AIAMQzwQLAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEN8ERAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEOIEIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA7BoIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDgGmiIAhBACsD+GiiIABBACsD8GiiQQArA+hooKCgoiAIQQArA+BooiAAQQArA9hookEAKwPQaKCgoKIgCEEAKwPIaKIgAEEAKwPAaKJBACsDuGigoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQ3gQPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQ4AQPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsD+GeiIANCLYinQf8AcUEEdCIBQZDpAGorAwCgIgkgAUGI6QBqKwMAIAIgA0KAgICAgICAeIN9vyABQYj5AGorAwChIAFBkPkAaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwOoaKJBACsDoGigoiAAQQArA5hookEAKwOQaKCgoiAEQQArA4hooiAIQQArA4BooiAAIAkgBaGgoKCgoCEACyAACwkAIAC9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ACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABCcBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEJwFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQnAUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EJwFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhCcBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQkgVFDQAgAyAEEIIFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEJwFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQlAUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEJIFQQBKDQACQCABIAkgAyAKEJIFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEJwFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABCcBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQnAUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEJwFIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABCcBSAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDAwz8QnAUgBUHIAGopAwAhAiAFKQNAIQQMAQsgCkL///////8/gyAIIAZyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQACxwAIAAgAkL///////////8AgzcDCCAAIAE3AwALjgkCBn8DfiMAQTBrIgQkAEIAIQoCQAJAIAJBAksNACABQQRqIQUgAkECdCICQYy7AWooAgAhBiACQYC7AWooAgAhBwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ/QQhAgsgAhD+BA0AC0EBIQgCQAJAIAJBVWoOAwABAAELQX9BASACQS1GGyEIAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEP0EIQILQQAhCQJAAkACQANAIAJBIHIgCUGACGosAABHDQECQCAJQQZLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ/QQhAgsgCUEBaiIJQQhHDQAMAgsACwJAIAlBA0YNACAJQQhGDQEgA0UNAiAJQQRJDQIgCUEIRg0BCwJAIAEpA3AiCkIAUw0AIAUgBSgCAEF/ajYCAAsgA0UNACAJQQRJDQAgCkIAUyEBA0ACQCABDQAgBSAFKAIAQX9qNgIACyAJQX9qIglBA0sNAAsLIAQgCLJDAACAf5QQlgUgBEEIaikDACELIAQpAwAhCgwCCwJAAkACQCAJDQBBACEJA0AgAkEgciAJQZQeaiwAAEcNAQJAIAlBAUsNAAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARD9BCECCyAJQQFqIglBA0cNAAwCCwALAkACQCAJDgQAAQECAQsCQCACQTBHDQACQAJAIAEoAgQiCSABKAJoRg0AIAUgCUEBajYCACAJLQAAIQkMAQsgARD9BCEJCwJAIAlBX3FB2ABHDQAgBEEQaiABIAcgBiAIIAMQhgUgBEEYaikDACELIAQpAxAhCgwGCyABKQNwQgBTDQAgBSAFKAIAQX9qNgIACyAEQSBqIAEgAiAHIAYgCCADEIcFIARBKGopAwAhCyAEKQMgIQoMBAtCACEKAkAgASkDcEIAUw0AIAUgBSgCAEF/ajYCAAsQyARBHDYCAAwBCwJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEP0EIQILAkACQCACQShHDQBBASEJDAELQgAhCkKAgICAgIDg//8AIQsgASkDcEIAUw0DIAUgBSgCAEF/ajYCAAwDCwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ/QQhAgsgAkG/f2ohCAJAAkAgAkFQakEKSQ0AIAhBGkkNACACQZ9/aiEIIAJB3wBGDQAgCEEaTw0BCyAJQQFqIQkMAQsLQoCAgICAgOD//wAhCyACQSlGDQICQCABKQNwIgxCAFMNACAFIAUoAgBBf2o2AgALAkACQCADRQ0AIAkNAUIAIQoMBAsQyARBHDYCAEIAIQoMAQsDQCAJQX9qIQkCQCAMQgBTDQAgBSAFKAIAQX9qNgIAC0IAIQogCQ0ADAMLAAsgASAKEPwEC0IAIQsLIAAgCjcDACAAIAs3AwggBEEwaiQAC8IPAgh/B34jAEGwA2siBiQAAkACQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQ/QQhBwtBACEIQgAhDkEAIQkCQAJAAkADQAJAIAdBMEYNACAHQS5HDQQgASgCBCIHIAEoAmhGDQIgASAHQQFqNgIEIActAAAhBwwDCwJAIAEoAgQiByABKAJoRg0AQQEhCSABIAdBAWo2AgQgBy0AACEHDAELQQEhCSABEP0EIQcMAAsACyABEP0EIQcLQQEhCEIAIQ4gB0EwRw0AA0ACQAJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARD9BCEHCyAOQn98IQ4gB0EwRg0AC0EBIQhBASEJC0KAgICAgIDA/z8hD0EAIQpCACEQQgAhEUIAIRJBACELQgAhEwJAA0AgB0EgciEMAkACQCAHQVBqIg1BCkkNAAJAIAxBn39qQQZJDQAgB0EuRw0ECyAHQS5HDQAgCA0DQQEhCCATIQ4MAQsgDEGpf2ogDSAHQTlKGyEHAkACQCATQgdVDQAgByAKQQR0aiEKDAELAkAgE0IcVg0AIAZBMGogBxCXBSAGQSBqIBIgD0IAQoCAgICAgMD9PxCcBSAGQRBqIAYpAzAgBkEwakEIaikDACAGKQMgIhIgBkEgakEIaikDACIPEJwFIAYgBikDECAGQRBqQQhqKQMAIBAgERCQBSAGQQhqKQMAIREgBikDACEQDAELIAdFDQAgCw0AIAZB0ABqIBIgD0IAQoCAgICAgID/PxCcBSAGQcAAaiAGKQNQIAZB0ABqQQhqKQMAIBAgERCQBSAGQcAAakEIaikDACERQQEhCyAGKQNAIRALIBNCAXwhE0EBIQkLAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEP0EIQcMAAsACwJAAkAgCQ0AAkACQAJAIAEpA3BCAFMNACABIAEoAgQiB0F/ajYCBCAFRQ0BIAEgB0F+ajYCBCAIRQ0CIAEgB0F9ajYCBAwCCyAFDQELIAFCABD8BAsgBkHgAGogBLdEAAAAAAAAAACiEJUFIAZB6ABqKQMAIRMgBikDYCEQDAELAkAgE0IHVQ0AIBMhDwNAIApBBHQhCiAPQgF8Ig9CCFINAAsLAkACQAJAAkAgB0FfcUHQAEcNACABIAUQiAUiD0KAgICAgICAgIB/Ug0DAkAgBUUNACABKQNwQn9VDQIMAwtCACEQIAFCABD8BEIAIRMMBAtCACEPIAEpA3BCAFMNAgsgASABKAIEQX9qNgIEC0IAIQ8LAkAgCg0AIAZB8ABqIAS3RAAAAAAAAAAAohCVBSAGQfgAaikDACETIAYpA3AhEAwBCwJAIA4gEyAIG0IChiAPfEJgfCITQQAgA2utVw0AEMgEQcQANgIAIAZBoAFqIAQQlwUgBkGQAWogBikDoAEgBkGgAWpBCGopAwBCf0L///////+///8AEJwFIAZBgAFqIAYpA5ABIAZBkAFqQQhqKQMAQn9C////////v///ABCcBSAGQYABakEIaikDACETIAYpA4ABIRAMAQsCQCATIANBnn5qrFMNAAJAIApBf0wNAANAIAZBoANqIBAgEUIAQoCAgICAgMD/v38QkAUgECARQgBCgICAgICAgP8/EJMFIQcgBkGQA2ogECARIAYpA6ADIBAgB0F/SiIHGyAGQaADakEIaikDACARIAcbEJAFIBNCf3whEyAGQZADakEIaikDACERIAYpA5ADIRAgCkEBdCAHciIKQX9KDQALCwJAAkAgEyADrH1CIHwiDqciB0EAIAdBAEobIAIgDiACrVMbIgdB8QBIDQAgBkGAA2ogBBCXBSAGQYgDaikDACEOQgAhDyAGKQOAAyESQgAhFAwBCyAGQeACakQAAAAAAADwP0GQASAHaxD/BBCVBSAGQdACaiAEEJcFIAZB8AJqIAYpA+ACIAZB4AJqQQhqKQMAIAYpA9ACIhIgBkHQAmpBCGopAwAiDhCABSAGQfACakEIaikDACEUIAYpA/ACIQ8LIAZBwAJqIAogB0EgSCAQIBFCAEIAEJIFQQBHcSAKQQFxRXEiB2oQmAUgBkGwAmogEiAOIAYpA8ACIAZBwAJqQQhqKQMAEJwFIAZBkAJqIAYpA7ACIAZBsAJqQQhqKQMAIA8gFBCQBSAGQaACaiASIA5CACAQIAcbQgAgESAHGxCcBSAGQYACaiAGKQOgAiAGQaACakEIaikDACAGKQOQAiAGQZACakEIaikDABCQBSAGQfABaiAGKQOAAiAGQYACakEIaikDACAPIBQQnwUCQCAGKQPwASIQIAZB8AFqQQhqKQMAIhFCAEIAEJIFDQAQyARBxAA2AgALIAZB4AFqIBAgESATpxCBBSAGQeABakEIaikDACETIAYpA+ABIRAMAQsQyARBxAA2AgAgBkHQAWogBBCXBSAGQcABaiAGKQPQASAGQdABakEIaikDAEIAQoCAgICAgMAAEJwFIAZBsAFqIAYpA8ABIAZBwAFqQQhqKQMAQgBCgICAgICAwAAQnAUgBkGwAWpBCGopAwAhEyAGKQOwASEQCyAAIBA3AwAgACATNwMIIAZBsANqJAAL+h8DC38GfgF8IwBBkMYAayIHJABBACEIQQAgBGsiCSADayEKQgAhEkEAIQsCQAJAAkADQAJAIAJBMEYNACACQS5HDQQgASgCBCICIAEoAmhGDQIgASACQQFqNgIEIAItAAAhAgwDCwJAIAEoAgQiAiABKAJoRg0AQQEhCyABIAJBAWo2AgQgAi0AACECDAELQQEhCyABEP0EIQIMAAsACyABEP0EIQILQQEhCEIAIRIgAkEwRw0AA0ACQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARD9BCECCyASQn98IRIgAkEwRg0AC0EBIQtBASEIC0EAIQwgB0EANgKQBiACQVBqIQ0CQAJAAkACQAJAAkACQCACQS5GIg4NAEIAIRMgDUEJTQ0AQQAhD0EAIRAMAQtCACETQQAhEEEAIQ9BACEMA0ACQAJAIA5BAXFFDQACQCAIDQAgEyESQQEhCAwCCyALRSEODAQLIBNCAXwhEwJAIA9B/A9KDQAgAkEwRiELIBOnIREgB0GQBmogD0ECdGohDgJAIBBFDQAgAiAOKAIAQQpsakFQaiENCyAMIBEgCxshDCAOIA02AgBBASELQQAgEEEBaiICIAJBCUYiAhshECAPIAJqIQ8MAQsgAkEwRg0AIAcgBygCgEZBAXI2AoBGQdyPASEMCwJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABEP0EIQILIAJBUGohDSACQS5GIg4NACANQQpJDQALCyASIBMgCBshEgJAIAtFDQAgAkFfcUHFAEcNAAJAIAEgBhCIBSIUQoCAgICAgICAgH9SDQAgBkUNBEIAIRQgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgFCASfCESDAQLIAtFIQ4gAkEASA0BCyABKQNwQgBTDQAgASABKAIEQX9qNgIECyAORQ0BEMgEQRw2AgALQgAhEyABQgAQ/ARCACESDAELAkAgBygCkAYiAQ0AIAcgBbdEAAAAAAAAAACiEJUFIAdBCGopAwAhEiAHKQMAIRMMAQsCQCATQglVDQAgEiATUg0AAkAgA0EeSg0AIAEgA3YNAQsgB0EwaiAFEJcFIAdBIGogARCYBSAHQRBqIAcpAzAgB0EwakEIaikDACAHKQMgIAdBIGpBCGopAwAQnAUgB0EQakEIaikDACESIAcpAxAhEwwBCwJAIBIgCUEBdq1XDQAQyARBxAA2AgAgB0HgAGogBRCXBSAHQdAAaiAHKQNgIAdB4ABqQQhqKQMAQn9C////////v///ABCcBSAHQcAAaiAHKQNQIAdB0ABqQQhqKQMAQn9C////////v///ABCcBSAHQcAAakEIaikDACESIAcpA0AhEwwBCwJAIBIgBEGefmqsWQ0AEMgEQcQANgIAIAdBkAFqIAUQlwUgB0GAAWogBykDkAEgB0GQAWpBCGopAwBCAEKAgICAgIDAABCcBSAHQfAAaiAHKQOAASAHQYABakEIaikDAEIAQoCAgICAgMAAEJwFIAdB8ABqQQhqKQMAIRIgBykDcCETDAELAkAgEEUNAAJAIBBBCEoNACAHQZAGaiAPQQJ0aiICKAIAIQEDQCABQQpsIQEgEEEBaiIQQQlHDQALIAIgATYCAAsgD0EBaiEPCyASpyEIAkAgDEEJTg0AIAwgCEoNACAIQRFKDQACQCAIQQlHDQAgB0HAAWogBRCXBSAHQbABaiAHKAKQBhCYBSAHQaABaiAHKQPAASAHQcABakEIaikDACAHKQOwASAHQbABakEIaikDABCcBSAHQaABakEIaikDACESIAcpA6ABIRMMAgsCQCAIQQhKDQAgB0GQAmogBRCXBSAHQYACaiAHKAKQBhCYBSAHQfABaiAHKQOQAiAHQZACakEIaikDACAHKQOAAiAHQYACakEIaikDABCcBSAHQeABakEIIAhrQQJ0QeC6AWooAgAQlwUgB0HQAWogBykD8AEgB0HwAWpBCGopAwAgBykD4AEgB0HgAWpBCGopAwAQlAUgB0HQAWpBCGopAwAhEiAHKQPQASETDAILIAcoApAGIQECQCADIAhBfWxqQRtqIgJBHkoNACABIAJ2DQELIAdB4AJqIAUQlwUgB0HQAmogARCYBSAHQcACaiAHKQPgAiAHQeACakEIaikDACAHKQPQAiAHQdACakEIaikDABCcBSAHQbACaiAIQQJ0Qbi6AWooAgAQlwUgB0GgAmogBykDwAIgB0HAAmpBCGopAwAgBykDsAIgB0GwAmpB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NgIACwJAIABB/wFLDQAgAEF4cUG00AFqIQICQAJAQQAoAozQASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AozQASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBvNIBaiEEAkACQAJAAkBBACgCkNABIgZBASACdCIDcQ0AQQAgBiADcjYCkNABIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKs0AFBf2oiAUF/IAEbNgKs0AELCwcAPwBBEHQLVAECf0EAKALEvwEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQjgVNDQAgABATRQ0BC0EAIAA2AsS/ASABDwsQyARBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEJEFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahCRBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQkQUgBUEwaiAKIAEgBxCbBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEJEFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEJEFIAUgAiAEQQEgBmsQmwUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEJkFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEJoFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQkQVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCRBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABCdBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABCdBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABCdBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABCdBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABCdBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABCdBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABCdBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABCdBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABCdBSAFQZABaiADQg+GQgAgBEIAEJ0FIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQnQUgBUGAAWpCASACfUIAIARCABCdBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEJ0FIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEJ0FIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQmwUgBUEwaiAWIBMgBkHwAGoQkQUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8QnQUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABCdBSAFIAMgDkIFQgAQnQUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEJEFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEJEFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQkQUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQkQUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQkQVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQkQUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQkQUgBUEgaiACIAQgBhCRBSAFQRBqIBIgASAHEJsFIAUgAiAEIAcQmwUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEJAFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahCRBSACIAAgBEGB+AAgA2sQmwUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEGA1AUkA0GA1AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEREACyUBAX4gACABIAKtIAOtQiCGhCAEEKsFIQUgBUIgiKcQoQUgBacLEwAgACABpyABQiCIpyACIAMQFAsLr72BgAADAEGACAuYswFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4AGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4AG1ldGhvZDolZDoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAZG91YmxlIHRocm93AHBvdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRzYWdnX2NsaWVudF9ldgB0aHJvdzolZEAldQBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdABleHBlY3Rpbmcgc3RhY2ssIGdvdABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGV2aWNlc2NyaXB0bWdyX2luaXQAd2FpdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AG9uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AGEgYnVpbHRpbiBmcm96ZW4gb2JqZWN0AHBhcnNlRmxvYXQAZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAGRldnNfbWFwX2tleXNfb3JfdmFsdWVzAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGdldF90cnlmcmFtZXMAcGlwZXMgaW4gc3BlY3MAYWJzAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwAgICAgJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAdGFnIGVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAG1hcAB2YWxpZGF0ZV9oZWFwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGRldnNfb2JqZWN0X2dldF9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19tYXBfY29weV9pbnRvAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AYnV0dG9uAFVuaGFuZGxlZCBleGNlcHRpb24ARXhjZXB0aW9uAG1vdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAHdpbmREaXJlY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAG1haW4AZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luAGRldnNfb2JqZWN0X2dldF9zdGF0aWNfYnVpbHRfaW4AYXNzaWduAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bAB0aHJvd2luZyBudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAbG9nAHNldHRpbmcAZ2V0dGluZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAHByb3RvX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQBoZWFydFJhdGUAY2F1c2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAgIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfb2JqZWN0X2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAHVuZGVmaW5lZAAlcyBjYWxsZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkACUtcyVkACUtc18lZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkAERldmljZVNjcmlwdCBydW50aW1lIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdHJ5LmMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAG5ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0weCV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAgIHBjPSVkIEAgPz8/ACAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAZnJhbWUtPmZ1bmMtPm51bV90cnlfZnJhbWVzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAgIC4uLgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dD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KTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AAD25oCAAARuYW1lAYZmrgUABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAhFlbV9kZXBsb3lfaGFuZGxlcgMXZW1famRfY3J5cHRvX2dldF9yYW5kb20EDWVtX3NlbmRfZnJhbWUFEGVtX2NvbnNvbGVfZGVidWcGBGV4aXQHC2VtX3RpbWVfbm93CCBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQkhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkChhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcLMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQNM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA41ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQPGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFBpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxURX193YXNtX2NhbGxfY3RvcnMWDWZsYXNoX3Byb2dyYW0XC2ZsYXNoX2VyYXNlGApmbGFzaF9zeW5jGRlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGhRhcHBfZ2V0X2RldmljZV9jbGFzcxsIaHdfcGFuaWMcCGpkX2JsaW5rHQdqZF9nbG93HhRqZF9hbGxvY19zdGFja19jaGVjax8IamRfYWxsb2MgB2pkX2ZyZWUhDXRhcmdldF9pbl9pcnEiEnRhcmdldF9kaXNhYmxlX2lycSMRdGFyZ2V0X2VuYWJsZV9pcnEkE2pkX3NldHRpbmdzX2dldF9iaW4lE2pkX3NldHRpbmdzX3NldF9iaW4mEmRldnNfcGFuaWNfaGFuZGxlcicTZGV2c19kZXBsb3lfaGFuZGxlcigUamRfY3J5cHRvX2dldF9yYW5kb20pEGpkX2VtX3NlbmRfZnJhbWUqGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZywKamRfZW1faW5pdC0NamRfZW1fcHJvY2Vzcy4FZG1lc2cvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3EmpkX3RjcHNvY2tfcHJvY2VzczgRYXBwX2luaXRfc2VydmljZXM5EmRldnNfY2xpZW50X2RlcGxveToUY2xpZW50X2V2ZW50X2hhbmRsZXI7C2FwcF9wcm9jZXNzPAd0eF9pbml0PQ9qZF9wYWNrZXRfcmVhZHk+CnR4X3Byb2Nlc3M/F2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQA5qZF93ZWJzb2NrX25ld0EGb25vcGVuQgdvbmVycm9yQwdvbmNsb3NlRAlvbm1lc3NhZ2VFEGpkX3dlYnNvY2tfY2xvc2VGDmFnZ2J1ZmZlcl9pbml0Rw9hZ2didWZmZXJfZmx1c2hIEGFnZ2J1ZmZlcl91cGxvYWRJDmRldnNfYnVmZmVyX29wShBkZXZzX3JlYWRfbnVtYmVySxJkZXZzX2J1ZmZlcl9kZWNvZGVMEmRldnNfYnVmZmVyX2VuY29kZU0PZGV2c19jcmVhdGVfY3R4TglzZXR1cF9jdHhPCmRldnNfdHJhY2VQD2RldnNfZXJyb3JfY29kZVEZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclIJY2xlYXJfY3R4Uw1kZXZzX2ZyZWVfY3R4VAhkZXZzX29vbVUJZGV2c19mcmVlVhdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc1cHdHJ5X3J1blgMc3RvcF9wcm9ncmFtWRxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0WhxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3dyaXRlWxhkZXZpY2VzY3JpcHRtZ3JfZ2V0X2hhc2hcHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0XQ5kZXBsb3lfaGFuZGxlcl4TZGVwbG95X21ldGFfaGFuZGxlcl8WZGV2aWNlc2NyaXB0bWdyX2RlcGxveWAUZGV2aWNlc2NyaXB0bWdyX2luaXRhGWRldmljZXNjcmlwdG1ncl9jbGllbnRfZXZiEWRldnNjbG91ZF9wcm9jZXNzYxdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldGQTZGV2c2Nsb3VkX29uX21ldGhvZGUOZGV2c2Nsb3VkX2luaXRmEGRldnNfZmliZXJfeWllbGRnGGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbmgYZGV2c19maWJlcl9zZXRfd2FrZV90aW1laRBkZXZzX2ZpYmVyX3NsZWVwahtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGxrGmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzbBFkZXZzX2ltZ19mdW5fbmFtZW0SZGV2c19pbWdfcm9sZV9uYW1lbhJkZXZzX2ZpYmVyX2J5X2ZpZHhvEWRldnNfZmliZXJfYnlfdGFncBBkZXZzX2ZpYmVyX3N0YXJ0cRRkZXZzX2ZpYmVyX3Rlcm1pYW50ZXIOZGV2c19maWJlcl9ydW5zE2RldnNfZmliZXJfc3luY19ub3d0CmRldnNfcGFuaWN1FV9kZXZzX3J1bnRpbWVfZmFpbHVyZXYPZGV2c19maWJlcl9wb2tldxNqZF9nY19hbnlfdHJ5X2FsbG9jeAdkZXZzX2djeQ9maW5kX2ZyZWVfYmxvY2t6EmRldnNfYW55X3RyeV9hbGxvY3sOZGV2c190cnlfYWxsb2N8C2pkX2djX3VucGlufQpqZF9nY19mcmVlfg5kZXZzX3ZhbHVlX3Bpbn8QZGV2c192YWx1ZV91bnBpboABEmRldnNfbWFwX3RyeV9hbGxvY4EBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY4IBFGRldnNfYXJyYXlfdHJ5X2FsbG9jgwEVZGV2c19idWZmZXJfdHJ5X2FsbG9jhAEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jhQEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSGAQ9kZXZzX2djX3NldF9jdHiHAQ5kZXZzX2djX2NyZWF0ZYgBD2RldnNfZ2NfZGVzdHJveYkBC3NjYW5fZ2Nfb2JqigERcHJvcF9BcnJheV9sZW5ndGiLARJtZXRoMl9BcnJheV9pbnNlcnSMARJmdW4xX0FycmF5X2lzQXJyYXmNARBtZXRoWF9BcnJheV9wdXNojgEVbWV0aDFfQXJyYXlfcHVzaFJhbmdljwERbWV0aFhfQXJyYXlfc2xpY2WQARFmdW4xX0J1ZmZlcl9hbGxvY5EBEnByb3BfQnVmZmVyX2xlbmd0aJIBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ5MBE21ldGgzX0J1ZmZlcl9maWxsQXSUARNtZXRoNF9CdWZmZXJfYmxpdEF0lQEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc5YBF2Z1bjFfRGV2aWNlU2NyaXB0X3BhbmljlwEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290mAEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0mQEVZnVuMV9EZXZpY2VTY3JpcHRfbG9nmgEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdJsBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50nAEUbWV0aDFfRXJyb3JfX19jdG9yX1+dARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fngEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fnwEPcHJvcF9FcnJvcl9uYW1loAEUbWV0aFhfRnVuY3Rpb25fc3RhcnShARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZaIBEnByb3BfRnVuY3Rpb25fbmFtZaMBDmZ1bjFfTWF0aF9jZWlspAEPZnVuMV9NYXRoX2Zsb29ypQEPZnVuMV9NYXRoX3JvdW5kpgENZnVuMV9NYXRoX2Fic6cBEGZ1bjBfTWF0aF9yYW5kb22oARNmdW4xX01hdGhfcmFuZG9tSW50qQENZnVuMV9NYXRoX2xvZ6oBDWZ1bjJfTWF0aF9wb3erAQ5mdW4yX01hdGhfaWRpdqwBDmZ1bjJfTWF0aF9pbW9krQEOZnVuMl9NYXRoX2ltdWyuAQ1mdW4yX01hdGhfbWlurwELZnVuMl9taW5tYXiwAQ1mdW4yX01hdGhfbWF4sQESZnVuMl9PYmplY3RfYXNzaWdusgEQZnVuMV9PYmplY3Rfa2V5c7MBE2Z1bjFfa2V5c19vcl92YWx1ZXO0ARJmdW4xX09iamVjdF92YWx1ZXO1ARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZrYBEHByb3BfUGFja2V0X3JvbGW3ARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVyuAETcHJvcF9QYWNrZXRfc2hvcnRJZLkBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleLoBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5kuwERcHJvcF9QYWNrZXRfZmxhZ3O8ARVwcm9wX1BhY2tldF9pc0NvbW1hbmS9ARRwcm9wX1BhY2tldF9pc1JlcG9ydL4BE3Byb3BfUGFja2V0X3BheWxvYWS/ARNwcm9wX1BhY2tldF9pc0V2ZW50wAEVcHJvcF9QYWNrZXRfZXZlbnRDb2RlwQEUcHJvcF9QYWNrZXRfaXNSZWdTZXTCARRwcm9wX1BhY2tldF9pc1JlZ0dldMMBE3Byb3BfUGFja2V0X3JlZ0NvZGXEARNtZXRoMF9QYWNrZXRfZGVjb2RlxQESZGV2c19wYWNrZXRfZGVjb2RlxgEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkxwEURHNSZWdpc3Rlcl9yZWFkX2NvbnTIARJkZXZzX3BhY2tldF9lbmNvZGXJARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlygEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZcsBFnByb3BfRHNQYWNrZXRJbmZvX25hbWXMARZwcm9wX0RzUGFja2V0SW5mb19jb2RlzQEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fzgEXcHJvcF9Ec1JvbGVfaXNDb25uZWN0ZWTPARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTQARFtZXRoMF9Ec1JvbGVfd2FpdNEBEnByb3BfU3RyaW5nX2xlbmd0aNIBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF00wETbWV0aDFfU3RyaW5nX2NoYXJBdNQBFGRldnNfamRfZ2V0X3JlZ2lzdGVy1QEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZNYBEGRldnNfamRfc2VuZF9jbWTXARFkZXZzX2pkX3dha2Vfcm9sZdgBFGRldnNfamRfcmVzZXRfcGFja2V02QETZGV2c19qZF9wa3RfY2FwdHVyZdoBE2RldnNfamRfc2VuZF9sb2dtc2fbAQ1oYW5kbGVfbG9nbXNn3AESZGV2c19qZF9zaG91bGRfcnVu3QEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXeARNkZXZzX2pkX3Byb2Nlc3NfcGt03wEUZGV2c19qZF9yb2xlX2NoYW5nZWTgARJkZXZzX2pkX2luaXRfcm9sZXPhARJkZXZzX2pkX2ZyZWVfcm9sZXPiARBkZXZzX3NldF9sb2dnaW5n4wEVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz5AEXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3PlARVkZXZzX2dldF9nbG9iYWxfZmxhZ3PmARJkZXZzX21hcF9jb3B5X2ludG/nARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7oAQxkZXZzX21hcF9zZXTpARRkZXZzX2lzX3NlcnZpY2Vfc3BlY+oBBmxvb2t1cOsBF2RldnNfbWFwX2tleXNfb3JfdmFsdWVz7AERZGV2c19hcnJheV9pbnNlcnTtARJkZXZzX3Nob3J0X21hcF9zZXTuAQ9kZXZzX21hcF9kZWxldGXvARJkZXZzX3Nob3J0X21hcF9nZXTwARdkZXZzX2RlY29kZV9yb2xlX3BhY2tldPEBDmRldnNfcm9sZV9zcGVj8gEQZGV2c19zcGVjX2xvb2t1cPMBEWRldnNfcHJvdG9fbG9va3Vw9AESZGV2c19mdW5jdGlvbl9iaW5k9QERZGV2c19tYWtlX2Nsb3N1cmX2AQ5kZXZzX2dldF9mbmlkePcBE2RldnNfZ2V0X2ZuaWR4X2NvcmX4AR5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGT5ARNkZXZzX2dldF9yb2xlX3Byb3Rv+gEbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3+wEYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVk/AEVZGV2c19nZXRfc3RhdGljX3Byb3Rv/QEdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW3+ARVkZXZzX29iamVjdF9nZXRfcHJvdG//ARhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSAAhdkZXZzX29iamVjdF9nZXRfbm9fYmluZIECEGRldnNfaW5zdGFuY2Vfb2aCAg9kZXZzX29iamVjdF9nZXSDAgxkZXZzX3NlcV9nZXSEAgxkZXZzX2FueV9nZXSFAgxkZXZzX2FueV9zZXSGAgxkZXZzX3NlcV9zZXSHAg5kZXZzX2FycmF5X3NldIgCDGRldnNfYXJnX2ludIkCD2RldnNfYXJnX2RvdWJsZYoCD2RldnNfcmV0X2RvdWJsZYsCDGRldnNfcmV0X2ludIwCDWRldnNfcmV0X2Jvb2yNAg9kZXZzX3JldF9nY19wdHKOAhFkZXZzX2FyZ19zZWxmX21hcI8CEWRldnNfc2V0dXBfcmVzdW1lkAIPZGV2c19jYW5fYXR0YWNokQIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZZICEmRldnNfcmVnY2FjaGVfZnJlZZMCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGyUAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZJUCE2RldnNfcmVnY2FjaGVfYWxsb2OWAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cJcCEWRldnNfcmVnY2FjaGVfYWdlmAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWZAhJkZXZzX3JlZ2NhY2hlX25leHSaAg9qZF9zZXR0aW5nc19nZXSbAg9qZF9zZXR0aW5nc19zZXScAg5kZXZzX2xvZ192YWx1ZZ0CD2RldnNfc2hvd192YWx1ZZ4CEGRldnNfc2hvd192YWx1ZTCfAg1jb25zdW1lX2NodW5roAINc2hhXzI1Nl9jbG9zZaECD2pkX3NoYTI1Nl9zZXR1cKICEGpkX3NoYTI1Nl91cGRhdGWjAhBqZF9zaGEyNTZfZmluaXNopAIUamRfc2hhMjU2X2htYWNfc2V0dXClAhVqZF9zaGEyNTZfaG1hY19maW5pc2imAg5qZF9zaGEyNTZfaGtkZqcCDmRldnNfc3RyZm9ybWF0qAIOZGV2c19pc19zdHJpbmepAg5kZXZzX2lzX251bWJlcqoCFGRldnNfc3RyaW5nX2dldF91dGY4qwITZGV2c19idWlsdGluX3N0cmluZ6wCFGRldnNfc3RyaW5nX3ZzcHJpbnRmrQITZGV2c19zdHJpbmdfc3ByaW50Zq4CFWRldnNfc3RyaW5nX2Zyb21fdXRmOK8CFGRldnNfdmFsdWVfdG9fc3RyaW5nsAIQYnVmZmVyX3RvX3N0cmluZ7ECGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGSyAhJkZXZzX3N0cmluZ19jb25jYXSzAhJkZXZzX3B1c2hfdHJ5ZnJhbWW0AhFkZXZzX3BvcF90cnlmcmFtZbUCD2RldnNfZHVtcF9zdGFja7YCE2RldnNfZHVtcF9leGNlcHRpb263AgpkZXZzX3Rocm93uAIVZGV2c190aHJvd190eXBlX2Vycm9yuQIZZGV2c190aHJvd19pbnRlcm5hbF9lcnJvcroCFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3K7Ah5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3K8AhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcr0CHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dL4CGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcr8CHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2PAAg90c2FnZ19jbGllbnRfZXbBAgphZGRfc2VyaWVzwgINdHNhZ2dfcHJvY2Vzc8MCCmxvZ19zZXJpZXPEAhN0c2FnZ19oYW5kbGVfcGFja2V0xQIUbG9va3VwX29yX2FkZF9zZXJpZXPGAgp0c2FnZ19pbml0xwIMdHNhZ2dfdXBkYXRlyAIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZckCE2RldnNfdmFsdWVfZnJvbV9pbnTKAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbMsCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyzAIUZGV2c192YWx1ZV90b19kb3VibGXNAhFkZXZzX3ZhbHVlX3RvX2ludM4CEmRldnNfdmFsdWVfdG9fYm9vbM8CDmRldnNfaXNfYnVmZmVy0AIXZGV2c19idWZmZXJfaXNfd3JpdGFibGXRAhBkZXZzX2J1ZmZlcl9kYXRh0gITZGV2c19idWZmZXJpc2hfZGF0YdMCFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq1AINZGV2c19pc19hcnJhedUCEWRldnNfdmFsdWVfdHlwZW9m1gIPZGV2c19pc19udWxsaXNo1wISZGV2c192YWx1ZV9pZWVlX2Vx2AIeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj2QISZGV2c19pbWdfc3RyaWR4X29r2gISZGV2c19kdW1wX3ZlcnNpb25z2wILZGV2c192ZXJpZnncAhFkZXZzX2ZldGNoX29wY29kZd0CFGRldnNfdm1fZXhlY19vcGNvZGVz3gIaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHjfAhFkZXZzX2ltZ19nZXRfdXRmOOACFGRldnNfZ2V0X3N0YXRpY191dGY44QIPZGV2c192bV9yb2xlX29r4gIMZXhwcl9pbnZhbGlk4wIUZXhwcnhfYnVpbHRpbl9vYmplY3TkAgtzdG10MV9jYWxsMOUCC3N0bXQyX2NhbGwx5gILc3RtdDNfY2FsbDLnAgtzdG10NF9jYWxsM+gCC3N0bXQ1X2NhbGw06QILc3RtdDZfY2FsbDXqAgtzdG10N19jYWxsNusCC3N0bXQ4X2NhbGw37AILc3RtdDlfY2FsbDjtAhJzdG10Ml9pbmRleF9kZWxldGXuAgxzdG10MV9yZXR1cm7vAglzdG10eF9qbXDwAgxzdG10eDFfam1wX3rxAgtzdG10MV9wYW5pY/ICEmV4cHJ4X29iamVjdF9maWVsZPMCEnN0bXR4MV9zdG9yZV9sb2NhbPQCE3N0bXR4MV9zdG9yZV9nbG9iYWz1AhJzdG10NF9zdG9yZV9idWZmZXL2AglleHByMF9pbmb3AhBleHByeF9sb2FkX2xvY2Fs+AIRZXhwcnhfbG9hZF9nbG9iYWz5AgtleHByMV91cGx1c/oCC2V4cHIyX2luZGV4+wIPc3RtdDNfaW5kZXhfc2V0/AIUZXhwcngxX2J1aWx0aW5fZmllbGT9AhJleHByeDFfYXNjaWlfZmllbGT+AhFleHByeDFfdXRmOF9maWVsZP8CEGV4cHJ4X21hdGhfZmllbGSAAw5leHByeF9kc19maWVsZIEDD3N0bXQwX2FsbG9jX21hcIIDEXN0bXQxX2FsbG9jX2FycmF5gwMSc3RtdDFfYWxsb2NfYnVmZmVyhAMRZXhwcnhfc3RhdGljX3JvbGWFAxNleHByeF9zdGF0aWNfYnVmZmVyhgMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nhwMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ4gDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ4kDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbooDDWV4cHJ4X2xpdGVyYWyLAxFleHByeF9saXRlcmFsX2Y2NIwDEGV4cHJ4X3JvbGVfcHJvdG+NAxFleHByM19sb2FkX2J1ZmZlco4DDWV4cHIwX3JldF92YWyPAwxleHByMV90eXBlb2aQAwpleHByMF9udWxskQMNZXhwcjFfaXNfbnVsbJIDCmV4cHIwX3RydWWTAwtleHByMF9mYWxzZZQDDWV4cHIxX3RvX2Jvb2yVAwlleHByMF9uYW6WAwlleHByMV9hYnOXAw1leHByMV9iaXRfbm90mAMMZXhwcjFfaXNfbmFumQMJZXhwcjFfbmVnmgMJZXhwcjFfbm90mwMMZXhwcjFfdG9faW50nAMJZXhwcjJfYWRknQMJZXhwcjJfc3VingMJZXhwcjJfbXVsnwMJZXhwcjJfZGl2oAMNZXhwcjJfYml0X2FuZKEDDGV4cHIyX2JpdF9vcqIDDWV4cHIyX2JpdF94b3KjAxBleHByMl9zaGlmdF9sZWZ0pAMRZXhwcjJfc2hpZnRfcmlnaHSlAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZKYDCGV4cHIyX2VxpwMIZXhwcjJfbGWoAwhleHByMl9sdKkDCGV4cHIyX25lqgMVc3RtdDFfdGVybWluYXRlX2ZpYmVyqwMUc3RtdHgyX3N0b3JlX2Nsb3N1cmWsAxNleHByeDFfbG9hZF9jbG9zdXJlrQMSZXhwcnhfbWFrZV9jbG9zdXJlrgMQZXhwcjFfdHlwZW9mX3N0cq8DDGV4cHIwX25vd19tc7ADFmV4cHIxX2dldF9maWJlcl9oYW5kbGWxAxBzdG10Ml9jYWxsX2FycmF5sgMJc3RtdHhfdHJ5swMNc3RtdHhfZW5kX3RyebQDC3N0bXQwX2NhdGNotQMNc3RtdDBfZmluYWxsebYDC3N0bXQxX3Rocm93twMOc3RtdDFfcmVfdGhyb3e4AxBzdG10eDFfdGhyb3dfam1wuQMOc3RtdDBfZGVidWdnZXK6AwlleHByMV9uZXe7AxFleHByMl9pbnN0YW5jZV9vZrwDCmV4cHIyX2JpbmS9Aw9kZXZzX3ZtX3BvcF9hcme+AxNkZXZzX3ZtX3BvcF9hcmdfdTMyvwMTZGV2c192bV9wb3BfYXJnX2kzMsADFmRldnNfdm1fcG9wX2FyZ19idWZmZXLBAxJqZF9hZXNfY2NtX2VuY3J5cHTCAxJqZF9hZXNfY2NtX2RlY3J5cHTDAwxBRVNfaW5pdF9jdHjEAw9BRVNfRUNCX2VuY3J5cHTFAxBqZF9hZXNfc2V0dXBfa2V5xgMOamRfYWVzX2VuY3J5cHTHAxBqZF9hZXNfY2xlYXJfa2V5yAMLamRfd3Nza19uZXfJAxRqZF93c3NrX3NlbmRfbWVzc2FnZcoDE2pkX3dlYnNvY2tfb25fZXZlbnTLAwdkZWNyeXB0zAMNamRfd3Nza19jbG9zZc0DEGpkX3dzc2tfb25fZXZlbnTOAwpzZW5kX2VtcHR5zwMSd3Nza2hlYWx0aF9wcm9jZXNz0AMXamRfdGNwc29ja19pc19hdmFpbGFibGXRAxR3c3NraGVhbHRoX3JlY29ubmVjdNIDGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldNMDD3NldF9jb25uX3N0cmluZ9QDEWNsZWFyX2Nvbm5fc3RyaW5n1QMPd3Nza2hlYWx0aF9pbml01gMTd3Nza19wdWJsaXNoX3ZhbHVlc9cDEHdzc2tfcHVibGlzaF9iaW7YAxF3c3NrX2lzX2Nvbm5lY3RlZNkDE3dzc2tfcmVzcG9uZF9tZXRob2TaAxxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpl2wMWcm9sZW1ncl9zZXJpYWxpemVfcm9sZdwDD3JvbGVtZ3JfcHJvY2Vzc90DEHJvbGVtZ3JfYXV0b2JpbmTeAxVyb2xlbWdyX2hhbmRsZV9wYWNrZXTfAxRqZF9yb2xlX21hbmFnZXJfaW5pdOADGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZOEDDWpkX3JvbGVfYWxsb2PiAxBqZF9yb2xlX2ZyZWVfYWxs4wMWamRfcm9sZV9mb3JjZV9hdXRvYmluZOQDEmpkX3JvbGVfYnlfc2VydmljZeUDE2pkX2NsaWVudF9sb2dfZXZlbnTmAxNqZF9jbGllbnRfc3Vic2NyaWJl5wMUamRfY2xpZW50X2VtaXRfZXZlbnToAxRyb2xlbWdyX3JvbGVfY2hhbmdlZOkDEGpkX2RldmljZV9sb29rdXDqAxhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XrAxNqZF9zZXJ2aWNlX3NlbmRfY21k7AMRamRfY2xpZW50X3Byb2Nlc3PtAw5qZF9kZXZpY2VfZnJlZe4DF2pkX2NsaWVudF9oYW5kbGVfcGFja2V07wMPamRfZGV2aWNlX2FsbG9j8AMPamRfY3RybF9wcm9jZXNz8QMVamRfY3RybF9oYW5kbGVfcGFja2V08gMMamRfY3RybF9pbml08wMNamRfaXBpcGVfb3BlbvQDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXT1Aw5qZF9pcGlwZV9jbG9zZfYDEmpkX251bWZtdF9pc192YWxpZPcDFWpkX251bWZtdF93cml0ZV9mbG9hdPgDE2pkX251bWZtdF93cml0ZV9pMzL5AxJqZF9udW1mbXRfcmVhZF9pMzL6AxRqZF9udW1mbXRfcmVhZF9mbG9hdPsDEWpkX29waXBlX29wZW5fY21k/AMUamRfb3BpcGVfb3Blbl9yZXBvcnT9AxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0/gMRamRfb3BpcGVfd3JpdGVfZXj/AxBqZF9vcGlwZV9wcm9jZXNzgAQUamRfb3BpcGVfY2hlY2tfc3BhY2WBBA5qZF9vcGlwZV93cml0ZYIEDmpkX29waXBlX2Nsb3NlgwQNamRfcXVldWVfcHVzaIQEDmpkX3F1ZXVlX2Zyb250hQQOamRfcXVldWVfc2hpZnSGBA5qZF9xdWV1ZV9hbGxvY4cEDWpkX3Jlc3BvbmRfdTiIBA5qZF9yZXNwb25kX3UxNokEDmpkX3Jlc3BvbmRfdTMyigQRamRfcmVzcG9uZF9zdHJpbmeLBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZIwEC2pkX3NlbmRfcGt0jQQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyOBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlco8EGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSQBBRqZF9hcHBfaGFuZGxlX3BhY2tldJEEFWpkX2FwcF9oYW5kbGVfY29tbWFuZJIEE2pkX2FsbG9jYXRlX3NlcnZpY2WTBBBqZF9zZXJ2aWNlc19pbml0lAQOamRfcmVmcmVzaF9ub3eVBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVklgQUamRfc2VydmljZXNfYW5ub3VuY2WXBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZZgEEGpkX3NlcnZpY2VzX3RpY2uZBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeaBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZZsEEmFwcF9nZXRfZndfdmVyc2lvbpwEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWdBA1qZF9oYXNoX2ZudjFhngQMamRfZGV2aWNlX2lknwQJamRfcmFuZG9toAQIamRfY3JjMTahBA5qZF9jb21wdXRlX2NyY6IEDmpkX3NoaWZ0X2ZyYW1lowQMamRfd29yZF9tb3ZlpAQOamRfcmVzZXRfZnJhbWWlBBBqZF9wdXNoX2luX2ZyYW1lpgQNamRfcGFuaWNfY29yZacEE2pkX3Nob3VsZF9zYW1wbGVfbXOoBBBqZF9zaG91bGRfc2FtcGxlqQQJamRfdG9faGV4qgQLamRfZnJvbV9oZXirBA5qZF9hc3NlcnRfZmFpbKwEB2pkX2F0b2mtBAtqZF92c3ByaW50Zq4ED2pkX3ByaW50X2RvdWJsZa8ECmpkX3NwcmludGawBBJqZF9kZXZpY2Vfc2hvcnRfaWSxBAxqZF9zcHJpbnRmX2GyBAtqZF90b19oZXhfYbMEFGpkX2RldmljZV9zaG9ydF9pZF9htAQJamRfc3RyZHVwtQQOamRfanNvbl9lc2NhcGW2BBNqZF9qc29uX2VzY2FwZV9jb3JltwQJamRfbWVtZHVwuAQWamRfcHJvY2Vzc19ldmVudF9xdWV1ZbkEFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWW6BBFqZF9zZW5kX2V2ZW50X2V4dLsECmpkX3J4X2luaXS8BBRqZF9yeF9mcmFtZV9yZWNlaXZlZL0EHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrvgQPamRfcnhfZ2V0X2ZyYW1lvwQTamRfcnhfcmVsZWFzZV9mcmFtZcAEEWpkX3NlbmRfZnJhbWVfcmF3wQQNamRfc2VuZF9mcmFtZcIECmpkX3R4X2luaXTDBAdqZF9zZW5kxAQWamRfc2VuZF9mcmFtZV93aXRoX2NyY8UED2pkX3R4X2dldF9mcmFtZcYEEGpkX3R4X2ZyYW1lX3NlbnTHBAtqZF90eF9mbHVzaMgEEF9fZXJybm9fbG9jYXRpb27JBAxfX2ZwY2xhc3NpZnnKBAVkdW1tecsECF9fbWVtY3B5zAQHbWVtbW92Zc0EBm1lbXNldM4ECl9fbG9ja2ZpbGXPBAxfX3VubG9ja2ZpbGXQBAZmZmx1c2jRBARmbW9k0gQNX19ET1VCTEVfQklUU9MEDF9fc3RkaW9fc2Vla9QEDV9fc3RkaW9fd3JpdGXVBA1fX3N0ZGlvX2Nsb3Nl1gQIX190b3JlYWTXBAlfX3Rvd3JpdGXYBAlfX2Z3cml0ZXjZBAZmd3JpdGXaBBRfX3B0aHJlYWRfbXV0ZXhfbG9ja9sEFl9fcHRocmVhZF9tdXRleF91bmxvY2vcBAZfX2xvY2vdBAhfX3VubG9ja94EDl9fbWF0aF9kaXZ6ZXJv3wQKZnBfYmFycmllcuAEDl9fbWF0aF9pbnZhbGlk4QQDbG9n4gQFdG9wMTbjBAVsb2cxMOQEB19fbHNlZWvlBAZtZW1jbXDmBApfX29mbF9sb2Nr5wQMX19vZmxfdW5sb2Nr6AQMX19tYXRoX3hmbG936QQMZnBfYmFycmllci4x6gQMX19tYXRoX29mbG936wQMX19tYXRoX3VmbG937AQEZmFic+0EA3Bvd+4EBXRvcDEy7wQKemVyb2luZm5hbvAECGNoZWNraW508QQMZnBfYmFycmllci4y8gQKbG9nX2lubGluZfMECmV4cF9pbmxpbmX0BAtzcGVjaWFsY2FzZfUEDWZwX2ZvcmNlX2V2YWz2BAVyb3VuZPcEBnN0cmNocvgEC19fc3RyY2hybnVs+QQGc3RyY21w+gQGc3RybGVu+wQHX191Zmxvd/wEB19fc2hsaW39BAhfX3NoZ2V0Y/4EB2lzc3BhY2X/BAZzY2FsYm6ABQljb3B5c2lnbmyBBQdzY2FsYm5sggUNX19mcGNsYXNzaWZ5bIMFBWZtb2RshAUFZmFic2yFBQtfX2Zsb2F0c2NhboYFCGhleGZsb2F0hwUIZGVjZmxvYXSIBQdzY2FuZXhwiQUGc3RydG94igUGc3RydG9kiwUSX193YXNpX3N5c2NhbGxfcmV0jAUIZGxtYWxsb2ONBQZkbGZyZWWOBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemWPBQRzYnJrkAUIX19hZGR0ZjORBQlfX2FzaGx0aTOSBQdfX2xldGYykwUHX19nZXRmMpQFCF9fZGl2dGYzlQUNX19leHRlbmRkZnRmMpYFDV9fZXh0ZW5kc2Z0ZjKXBQtfX2Zsb2F0c2l0ZpgFDV9fZmxvYXR1bnNpdGaZBQ1fX2ZlX2dldHJvdW5kmgUSX19mZV9yYWlzZV9pbmV4YWN0mwUJX19sc2hydGkznAUIX19tdWx0ZjOdBQhfX211bHRpM54FCV9fcG93aWRmMp8FCF9fc3VidGYzoAUMX190cnVuY3RmZGYyoQULc2V0VGVtcFJldDCiBQtnZXRUZW1wUmV0MKMFCXN0YWNrU2F2ZaQFDHN0YWNrUmVzdG9yZaUFCnN0YWNrQWxsb2OmBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50pwUVZW1zY3JpcHRlbl9zdGFja19pbml0qAUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZakFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WqBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSrBQxkeW5DYWxsX2ppammsBRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpprQUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBqwUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 24520;
var ___stop_em_js = Module['___stop_em_js'] = 25246;



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
