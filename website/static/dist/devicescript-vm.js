
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
    Exts.dmesg = (s) => console.debug("    " + s);
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
                Module.log(`connected to ${host}:${port}`);
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
            if (sock.binaryType != "arraybuffer")
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9SFgIAA0gUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEABQAFBQMCAgMCAgMEAwMDBQIIAAMBAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAoAAgIAAQEBAAEAAAEAAAAKAAECAAEBBAUBAgAAAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGEQICBg4DAwMDBQUDAwMEBAUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAQECBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgEAAQEAAACBwADBwcBAgEAEgMJBwAABAACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAcoBygEFhoCAgAABAYACgAIG3YCAgAAOfwFBgO0FC38BQQALfwFBAAt/AUEAC38AQYDLAQt/AEHvywELfwBBuc0BC38AQbXOAQt/AEGxzwELfwBBgdABC38AQaLQAQt/AEGn0gELfwBBgMsBC38AQZ3TAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAMcFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCDBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDIBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAIsFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADiBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAOMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA5AUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAOUFCXN0YWNrU2F2ZQDeBQxzdGFja1Jlc3RvcmUA3wUKc3RhY2tBbGxvYwDgBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AOEFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA5wUJiYOAgAABAEEBC8kBKjtERUZH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BRoLIAAgAhCsAiABQSBqJAALEwAgACAAIABBABCnAhCRARCsAguKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ6QINACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDeAgwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ6wJFDQAgACADKAIoEOMCDAELIABCADcDAAsgA0EwaiQAC50BAgJ/AX4jAEEwayIBJAAgASAAKQNQIgM3AxAgASADNwMgAkACQCAAIAFBEGoQ6QINACABIAEpAyA3AwggAUEoaiAAQRIgAUEIahDeAkEAIQIMAQsgASABKQMgNwMAIAAgASABQShqEOsCIQILAkAgAiICRQ0AIAFBGGogACACIAEoAigQzgIgACgCrAEgASkDGDcDIAsgAUEwaiQAC8oBAgV/AX4jAEEwayIBJAAgASAAKQNQIgY3AxggASAGNwMgAkACQCAAIAFBGGoQ6gINACABIAEpAyA3AxAgAUEoaiAAQbQaIAFBEGoQ3wJBACECDAELIAEgASkDIDcDCCAAIAFBCGogAUEoahDrAiECCwJAIAIiA0UNACAAQQAQpwIhAiAAQQEQpwIhBCAAQQIQpwIhACABKAIoIgUgAk0NACABIAUgAmsiBTYCKCADIAJqIAAgBSAEIAUgBEkbEIgFGgsgAUEwaiQAC6YDAgd/AX4jAEHgAGsiASQAIAEgACkDUCIINwM4IAEgCDcDUAJAAkAgACABQThqEOoCDQAgASABKQNQNwMwIAFB2ABqIABBtBogAUEwahDfAkEAIQIMAQsgASABKQNQNwMoIAAgAUEoaiABQcwAahDrAiECCwJAIAIiA0UNACAAQQAQpwIhBCABIABB4ABqKQMAIgg3AyAgASAINwNAAkACQCAAIAFBIGoQyAJFDQAgASABKQNANwMAIAAgASABQdgAahDKAiECDAELIAEgASkDQCIINwNQIAEgCDcDGAJAAkAgACABQRhqEOkCDQAgASABKQNQNwMQIAFB2ABqIABBEiABQRBqEN4CQQAhAgwBCyABIAEpA1A3AwggACABQQhqIAFB2ABqEOsCIQILIAIhAgsgAiIFRQ0AIABBAhCnAiECIABBAxCnAiEAIAEoAlgiBiACTQ0AIAEgBiACayIGNgJYIAEo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AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQowIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEIwCIAMgACkDADcDECABIANBEGoQjQELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQkwIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEN4CDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8B4MYBTg0CIABBoOIAIAFBA3RqLwEAEMsCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQZQTQfs3QThBkSoQ6QQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ8AINACABQThqIABBhBkQ3QILIAEgASkDSDcDICABQThqIAAgAUEgahDPAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEIwBIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEMoCIgJFDQAgAUEwaiAAIAIgASgCOEEBEPsBIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjQEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECEKcCIQIgASABKQMgNwMIAkAgAUEIahDwAg0AIAFBGGogAEHeGhDdAgsgASABKQMoNwMAIAFBEGogACABIAJBARCBAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ5gKbEKkCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEOYCnBCpAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJA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Ug0AIANB/yM2AgAgAyACNgIEIANB2ABqIABBghYgAxDbAgwBCyADIABBMGopAwA3AyggACADQShqEL0CIQEgA0H/IzYCECADIAE2AhQgAyACNgIYIANB2ABqIABBkhYgA0EQahDbAgsgAiECCyACECILQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakEAEJgCIQEgAEIANwMwIAJBEGokACABCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEJgCIQEgAEIANwMwIAJBEGokACABC6kCAQJ/AkACQCABQeDdAGtBDG1BI0sNACABKAIEIQIMAQsCQAJAIAEgACgApAEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoArgBDQAgAEEgEIgBIQIgAEEIOgBEIAAgAjYCuAEgAg0AQQAhAgwDCyAAKAK4ASgCFCIDIQIgAw0CIABBCUEQEIcBIgINAUEAIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACwJAAkAgAEF8ag4GAQAAAAABAAtBodEAQaQ2QfEFQbYdEOkEAAsgASgCBA8LIAAoArgBIAI2AhQgAkHg3QBBqAFqQQBB4N0AQbABaigCABs2AgQgAiECC0EAIAIiAEHg3QBBGGpBAEHg3QBBIGooAgAbIAAbIgAgACABRhsLogECAX8BfiMAQSBrIgIkACACIAEpAwA3AwggAkEQaiAAIAJBCGpBNBCVAgJAAkAgAikDEEIAUg0AQQAhASAALQBFDQEgAkEYaiAAQZUpQQAQ2wJBACEBDAELIAIgAikDECIDNwMYIAIgAzcDACAAIAJBAhCYAiEBIABCADcDMAJAIAENACACQRhqIABBoylBABDbAgsgASEBCyACQSBqJAAgAQvAEAIQfwF+IwBBwABrIgQkAEHg3QBBqAFqQQBB4N0AQbABaigCABshBSABQaQBaiEGQQAhByACIQICQANAIAchCCAKIQkgDCELAkAgAiINDQAgCCEODAILAkACQAJAAkACQAJAIA1B4N0Aa0EMbUEjSw0AIAQgAykDADcDMCANIQwgDSgCAEGAgID4AHFBgICA+ABHDQMCQAJAA0AgDCIORQ0BIA4oAgghDAJAAkACQAJAIAQoAjQiCkGAgMD/B3ENACAKQQ9xQQRHDQAgBCgCMCIKQYCAf3FBgIABRw0AIAwvAQAiB0UNASAKQf//AHEhAiAHIQogDCEMA0AgDCEMAkAgAiAKQf//A3FHDQAgDC8BAiIMIQoCQCAMQSNLDQACQCABIAoQhAIiCkHg3QBrQQxtQSNLDQAgBEEANgIkIAQgDEHgAGo2AiAgDiEMQQANCAwKCyAEQSBqIAFBCCAKEOUCIA4hDEEADQcMCQsgDEHPhgNNDQsgBCAKNgIgIARBAzYCJCAOIQxBAA0GDAgLIAwvAQQiByEKIAxBBGohDCAHDQAMAgsACyAEIAQpAzA3AwAgASAEIARBPGoQygIhAiAEKAI8IAIQtQVHDQEgDC8BACIHIQogDCEMIAdFDQADQCAMIQwCQCAKQf//A3EQgAMgAhC0BQ0AIAwvAQIiDCEKAkAgDEEjSw0AAkAgASAKEIQCIgpB4N0Aa0EMbUEjSw0AIARBADYCJCAEIAxB4ABqNgIgDAYLIARBIGogAUEIIAoQ5QIMBQsgDEHPhgNNDQkgBCAKNgIgIARBAzYCJAwECyAMLwEEIgchCiAMQQRqIQwgBw0ACwsgDigCBCEMQQENAgwECyAEQgA3AyALIA4hDEEADQAMAgsACyAEQgA3AyALIAQgBCkDIDcDKCALIQwgCSEKIARBKGohByANIQJBASEJDAULIA0gBigAACIMIAwoAmBqayAMLwEOQQR0Tw0DIAQgAykDADcDMCALIQwgCSEKIA0hBwJAAkACQANAIAohDyAMIRACQCAHIhENAEEAIQ5BACEJDAILAkACQAJAAkACQCARIAYoAAAiDCAMKAJgaiILayAMLwEOQQR0Tw0AIAsgES8BCkECdGohDiARLwEIIQogBCgCNCIMQYCAwP8HcQ0CIAxBD3FBBEcNAiAKQQBHIQwCQAJAIAoNACAQIQcgDyECIAwhCUEAIQwMAQtBACEHIAwhDCAOIQkCQAJAIAQoAjAiAiAOLwEARg0AA0AgB0EBaiIMIApGDQIgDCEHIAIgDiAMQQN0aiIJLwEARw0ACyAMIApJIQwgCSEJCyAMIQwgCSALayICQYCAAk8NA0EGIQcgAkENdEH//wFyIQIgDCEJQQEhDAwBCyAQIQcgDyECIAwgCkkhCUEAIQwLIAwhCyAHIg8hDCACIgIhByAJRQ0DIA8hDCACIQogCyECIBEhBwwEC0Hd0gBBpDZB1AJB4xsQ6QQAC0Gp0wBBpDZBqwJBtzUQ6QQACyAQIQwgDyEHCyAHIRIgDCETIAQgBCkDMDcDECABIARBEGogBEE8ahDKAiEQAkACQCAEKAI8DQBBACEMQQAhCkEBIQcgESEODAELIApBAEciDCEHQQAhAgJAAkACQCAKDQAgEyEKIBIhByAMIQIMAQsDQCAHIQsgDiACIgJBA3RqIg8vAQAhDCAEKAI8IQcgBCAGKAIANgIMIARBDGogDCAEQSBqEIEDIQwCQCAHIAQoAiAiCUcNACAMIBAgCRCgBQ0AIA8gBigAACIMIAwoAmBqayIMQYCAAk8NCEEGIQogDEENdEH//wFyIQcgCyECQQEhDAwDCyACQQFqIgwgCkkiCSEHIAwhAiAMIApHDQALIBMhCiASIQcgCSECC0EJIQwLIAwhDiAHIQcgCiEMAkAgAkEBcUUNACAMIQwgByEKIA4hByARIQ4MAQtBACECAkAgESgCBEHz////AUcNACAMIQwgByEKIAIhB0EAIQ4MAQsgES8BAkEPcSICQQJPDQUgDCEMIAchCkEAIQcgBigAACIOIA4oAmBqIAJBBHRqIQ4LIAwhDCAKIQogByECIA4hBwsgDCIOIQwgCiIJIQogByEHIA4hDiAJIQkgAkUNAAsLIAQgDiIMrUIghiAJIgqthCIUNwMoAkAgFEIAUQ0AIAwhDCAKIQogBEEoaiEHIA0hAkEBIQkMBwsCQCABKAK4AQ0AIAFBIBCIASEHIAFBCDoARCABIAc2ArgBIAcNACAMIQwgCiEKIAghB0EAIQJBACEJDAcLAkAgASgCuAEoAhQiAkUNACAMIQwgCiEKIAghByACIQJBACEJDAcLAkAgAUEJQRAQhwEiAg0AIAwhDCAKIQogCCEHQQAhAkEAIQkMBwsgASgCuAEgAjYCFCACIAU2AgQgDCEMIAohCiAIIQcgAiECQQAhCQwGC0Gp0wBBpDZBqwJBtzUQ6QQAC0G0P0GkNkHOAkHDNRDpBAALQZ3CAEGkNkE9QbknEOkEAAtBncIAQaQ2QT1BuScQ6QQAC0GF0QBBpDZB8QJB0RsQ6QQACwJAAkAgDS0AA0EPcUF8ag4GAQAAAAABAAtB8tAAQaQ2QbIGQecsEOkEAAsgBCADKQMANwMYAkAgASANIARBGGoQhwIiB0UNACALIQwgCSEKIAchByANIQJBASEJDAELIAshDCAJIQpBACEHIA0oAgQhAkEAIQkLIAwhDCAKIQogByIOIQcgAiECIA4hDiAJRQ0ACwsCQAJAIA4iDA0AQgAhFAwBCyAMKQMAIRQLIAAgFDcDACAEQcAAaiQAC+wBAgN/AX4jAEEgayIDJAACQAJAIAINAEEAIQQMAQsgAyABKQMANwMQQQAhBCADQRBqEPACDQAgAyABKQMAIgY3AwggAyAGNwMYIAAgA0EIakEAEJgCIQQgAEIANwMwIAMgASkDACIGNwMAIAMgBjcDGCAAIANBAhCYAiEFIABCADcDMEEAIQECQCAERQ0AAkAgBCAFRg0AIAQhAQwBCyAAIAQQnAIhAQtBACEEIAEiAUUNACABIQEDQAJAIAEiASACRiIERQ0AIAQhBAwCCyAAIAEQnAIiBSEBIAQhBCAFDQALCyADQSBqJAAgBAuIAQICfwF+IwBBMGsiBCQAIAEgAykDADcDMCAEIAIpAwAiBjcDICAEIAY3AyggASAEQSBqQQAQmAIhBSABQgA3AzAgBCADKQMANwMYIARBKGogASAFIARBGGoQngIgBCACKQMANwMQIAQgBCkDKDcDCCAAIAEgBEEQaiAEQQhqEJECIARBMGokAAvrAQECfyMAQSBrIgQkAAJAAkAgA0GB4ANJDQAgAEIANwMADAELIAQgAikDADcDEAJAIAEgBEEQaiAEQRxqEOwCIgVFDQAgBCgCHCADTQ0AIAQgAikDADcDACAFIANqIQMCQCABIAQQyAJFDQAgACABQQggASADQQEQkwEQ5QIMAgsgACADLQAAEOMCDAELIAQgAikDADcDCAJAIAEgBEEIahDtAiIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBIGokAAu+BAIBfwJ+IwBBsAFrIgQkACAEIAMpAwA3A5ABAkACQCAEQZABahDJAkUNACAEIAIpAwAiBTcDiAEgBCAFNwOoAQJAIAEgBEGIAWoQ7gINACAEIAQpA6gBNwOAASABIARBgAFqEOkCDQAgBCAEKQOoATcDeCABIARB+ABqEMgCRQ0BCyAEIAMpAwA3AxAgASAEQRBqEOcCIQMgBCACKQMANwMIIAAgASAEQQhqIAMQoQIMAQsgBCADKQMANwNwAkAgASAEQfAAahDIAkUNACAEIAMpAwAiBjcDoAEgBCACKQMAIgU3A5gBIAEgBjcDMCAEIAU3AzAgBCAFNwOoASABIARBMGpBABCYAiEDIAFCADcDMCAEIAQpA6ABNwMoIARBqAFqIAEgAyAEQShqEJ4CIAQgBCkDmAE3AyAgBCAEKQOoATcDGCAAIAEgBEEgaiAEQRhqEJECDAELIAQgAykDADcDaCAEQagBaiABIARB6ABqEM8CIAMgBCkDqAE3AwAgBCADKQMANwNgIAEgBEHgAGoQjAEgBCADKQMAIgY3A6ABIAQgAikDACIFNwOYASABIAY3AzAgBCAFNwNYIAQgBTcDqAEgASAEQdgAakEAEJgCIQIgAUIANwMwIAQgBCkDoAE3A1AgBEGoAWogASACIARB0ABqEJ4CIAQgBCkDmAE3A0ggBCAEKQOoATcDQCAAIAEgBEHIAGogBEHAAGoQkQIgBCADKQMANwM4IAEgBEE4ahCNAQsgBEGwAWokAAvxAwIBfwF+IwBBkAFrIgQkACAEIAIpAwA3A4ABAkACQCAEQYABahDJAkUNACAEIAEpAwAiBTcDeCAEIAU3A4gBAkAgACAEQfgAahDuAg0AIAQgBCkDiAE3A3AgACAEQfAAahDpAg0AIAQgBCkDiAE3A2ggACAEQegAahDIAkUNAQsgBCACKQMANwMYIAAgBEEYahDnAiECIAQgASkDADcDECAEIAMpAwA3AwggACAEQRBqIAIgBEEIahCkAgwBCyAAIAIpAwA3AzAgBCABKQMAIgU3A2AgBCAFNwOIAQJAIAAgBEHgAGpBARCYAiIBRQ0AAkACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0G80ABBpDZB2AVB1goQ6QQACyAAQgA3AzAgAUUNASAEIAIpAwA3A1gCQCAAIARB2ABqEMgCRQ0AIAQgAikDADcDKCAEIAMpAwA3AyAgACABIARBKGogBEEgahCGAgwCCyAEIAIpAwA3A1AgBEGIAWogACAEQdAAahDPAiACIAQpA4gBNwMAIAQgAikDADcDSCAAIARByABqEIwBIAQgAikDADcDQCAEIAMpAwA3AzggACABIARBwABqIARBOGoQhgIgBCACKQMANwMwIAAgBEEwahCNAQwBCyAAQgA3AzALIARBkAFqJAALtQMCBH8BfiMAQdAAayIEJAACQAJAIAJBgeADSQ0AIARByABqIABBDxDgAgwBCyAEIAEpAwA3AzgCQCAAIARBOGoQ6gJFDQAgBCABKQMANwMgIAAgBEEgaiAEQcQAahDrAiEBAkAgBCgCRCIFIAJNDQAgBCADKQMANwMIIAEgAmogACAEQQhqEOcCOgAADAILIAQgAjYCECAEIAU2AhQgBEHIAGogAEH+CyAEQRBqENwCDAELIAQgASkDADcDMAJAIAAgBEEwahDtAiIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQACQCACQYE8SQ0AIARByABqIABBDxDgAgwCCyADKQMAIQgCQCACQQFqIgEgBS8BCk0NACAAIAFBCmxBA3YiA0EEIANBBEsbIgZBA3QQiAEiA0UNAgJAIAUoAgwiB0UNACADIAcgBS8BCEEDdBCGBRoLIAUgBjsBCiAFIAM2AgwgACgC0AEgAxCJAQsgBSgCDCACQQN0aiAINwMAIAUvAQggAksNASAFIAE7AQgMAQsgBCABKQMANwMoIARByABqIABBDyAEQShqEN4CCyAEQdAAaiQAC70BAQV/IwBBEGsiBCQAAkACQCACQYE8SQ0AIARBCGogAEEPEOACDAELAkAgAkEBaiIFIAEvAQpNDQAgACAFQQpsQQN2IgZBBCAGQQRLGyIHQQN0EIgBIgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQhgUaCyABIAc7AQogASAGNgIMIAAoAtABIAYQiQELIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAAL8gECBn8BfiMAQSBrIgMkACADIAIpAwA3AxAgACADQRBqEIwBAkACQCABLwEIIgRBgTxJDQAgA0EYaiAAQQ8Q4AIMAQsgAikDACEJIARBAWohBQJAIAQgAS8BCkkNACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQiAEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBCGBRoLIAEgBzsBCiABIAY2AgwgACgC0AEgBhCJAQsgASgCDCAEQQN0aiAJNwMAIAEvAQggBEsNACABIAU7AQgLIAMgAikDADcDCCAAIANBCGoQjQEgA0EgaiQACz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB2ABqKQMAIgM3AwAgAiADNwMIIAAgAhDnAiEAIAJBEGokACAAC0ADAX8BfgF8IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEOYCIQQgAkEQaiQAIAQLLAEBfyMAQRBrIgIkACACQQhqIAEQ4gIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ4wIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ5AIgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEOUCIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahDtAiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB4S5BABDbAkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahDvAiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSRJDQAgAEIANwMADwsCQCABIAIQhAIiA0Hg3QBrQQxtQSNLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEOUCC/8BAQJ/IAIhAwNAAkAgAyICQeDdAGtBDG0iA0EjSw0AAkAgASADEIQCIgJB4N0Aa0EMbUEjSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhDlAg8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQaHRAEGkNkG8CEHUJxDpBAALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQeDdAGtBDG1BJEkNAQsLIAAgAUEIIAIQ5QILJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyACKQMINwIACyAAIAQ7AeADIAMLvwMBBn8jAEEgayIEJAACQCACRQ0AQQAhBQJAA0ACQCAAIAUiBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIGIQUgBkEURw0AC0EAIQULIAUiBiEFAkAgBg0AIABBACAALwHgAyIFQQFqIAVBEksbQRhsIgZqIgVBFGohBwJAIAUtABRBCkkNACAAIAZqKAIIECILIAdBADoAACAAIAZqQQA7AQIgBSEFCyAFIgVBADsBFiAFIAI7AQIgBSABOwEAIAUgAzoAFAJAIANBCkkNACAFIAMQITYCCAsCQAJAIAAgAC8B4AMiBkEYbGogBUcNACAFIQUMAQsCQCAAQQAgBkEBaiAGQRJLGyIDQRhsaiIGIAVGDQAgBEEIakEQaiICIAVBEGoiASkCADcDACAEQQhqQQhqIgcgBUEIaiIIKQIANwMAIAQgBSkCADcDCCABIAZBEGoiCSkCADcCACAIIAZBCGoiASkCADcCACAFIAYpAgA3AgAgCSACKQMANwIAIAEgBykDADcCACAGIAQpAwg3AgALIAAgAzsB4AMgBiEFCyAEQSBqJAAgBQ8LQcPHAEHEO0ElQco0EOkEAAt5AQV/QQAhBAJAA0AgBiEFAkACQCAAIAQiB0EYbCIGaiIELwEAIAFHDQAgACAGaiIILwECIAJHDQBBACEGIAQhBCAILwEWIANGDQELQQEhBiAFIQQLIAQhBCAGRQ0BIAQhBiAHQQFqIgchBCAHQRRHDQALQQAPCyAEC0YBAn9BACEDA0ACQCAAIAMiA0EYbGoiBC8BACABRw0AIAQoAgQgAk0NACAEQQRqIAI2AgALIANBAWoiBCEDIARBFEcNAAsLWwEDf0EAIQIDQAJAIAAgAiIDQRhsaiICLwEAIAFHDQAgAkEUaiEEAkAgAi0AFEEKSQ0AIAIoAggQIgsgBEEAOgAAIAJBADsBAgsgA0EBaiIDIQIgA0EURw0ACwtVAQF/AkAgAkUNACADIAAgAxsiAyAAQeADaiIETw0AIAMhAwNAAkAgAyIDLwECIAJHDQAgAy8BACABRw0AIAMPCyADQRhqIgAhAyAAIARJDQALC0EAC10BA38jAEEgayIBJABBACECAkAgACABQSAQowQiA0EASA0AIANBAWoQISECAkACQCADQSBKDQAgAiABIAMQhgUaDAELIAAgAiADEKMEGgsgAiECCyABQSBqJAAgAgskAQF/AkACQCABDQBBACECDAELIAEQtQUhAgsgACABIAIQpQQL0AIBA38jAEHQAGsiAyQAIAMgAikDADcDSCADIAAgA0HIAGoQvQI2AkQgAyABNgJAQe4WIANBwABqEDwgAS0AACEBIAMgAikDADcDOAJAAkAgACADQThqEO0CIgINAEEAIQQMAQsgAi0AA0EPcSEECwJAAkAgBEF8ag4GAAEBAQEAAQsgAi8BCEUNAEEgIAEgAUEqRxsgASABQSFHGyABIAFBPkcbwCEEQQAhAQNAAkAgASIBQQtHDQAgAyAENgIAQYnOACADEDwMAgsgAyACKAIMIAFBBHQiBWopAwA3AzAgAyAAIANBMGoQvQI2AiQgAyAENgIgQejFACADQSBqEDwgAyACKAIMIAVqQQhqKQMANwMYIAMgACADQRhqEL0CNgIUIAMgBDYCEEH2FyADQRBqEDwgAUEBaiIFIQEgBSACLwEISQ0ACwsgA0HQAGokAAvlAwEDfyMAQeAAayICJAACQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbIgNBCksNAEEBIAN0QagMcQ0BIANBCEcNACABKAIAIgNFDQAgAygCAEGAgID4AHFBgICAOEYNAQsgAiABKQMANwMIIAAgAkEIakEAEMoCIgQhAyAEDQEgAiABKQMANwMAIAAgAhC+AiEDDAELIAIgASkDADcDQCAAIAJBwABqIAJB2ABqIAJB1ABqEJMCIQMCQAJAIAIpA1hQRQ0AQQAhAQwBCyACIAIpA1g3AzgCQCAAIAJBOGoQvgIiAUHQ2AFGDQAgAiABNgIwQdDYAUHAAEH8FyACQTBqEO0EGgsCQEHQ2AEQtQUiAUEnSQ0AQQBBAC0AiE46ANLYAUEAQQAvAIZOOwHQ2AFBAiEBDAELIAFB0NgBakEuOgAAIAFBAWohAQsgASEBAkACQCACKAJUIgQNACABIQEMAQsgAkHIAGogAEEIIAQQ5QIgAiACKAJINgIgIAFB0NgBakHAACABa0HTCiACQSBqEO0EGkHQ2AEQtQUiAUHQ2AFqQcAAOgAAIAFBAWohAQsgAiADNgIQIAEiAUHQ2AFqQcAAIAFrQYkyIAJBEGoQ7QQaQdDYASEDCyACQeAAaiQAIAMLzgYBA38jAEGQAWsiAiQAAkACQCABKAIEIgNBf0cNACACIAEoAgA2AgBB0NgBQcAAQdwzIAIQ7QQaQdDYASEDDAELQQAhBAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEQIANBD3EgAUEGai8BAEHw/wFxGw4RAQoEAgMGBQsJCAcLCwsLCwALCyACIAEpAwA3AyggAiAAIAJBKGoQ5gI5AyBB0NgBQcAAQaYmIAJBIGoQ7QQaQdDYASEDDAsLQZghIQMCQAJAAkACQAJAAkACQCABKAIAIgEORAABBREGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCBgMEBgtBjTAhAwwQC0HxKCEDDA8LQaMnIQMMDgtBigghAwwNC0GJCCEDDAwLQfPBACEDDAsLAkAgAUGgf2oiA0EjSw0AIAIgAzYCMEHQ2AFBwABBkDIgAkEwahDtBBpB0NgBIQMMCwtB5CEhAyABQYAISQ0KIAIgAUEPcTYCRCACIAFBgHhqQQR2NgJAQdDYAUHAAEG7CyACQcAAahDtBBpB0NgBIQMMCgtBqh4hBAwIC0GiJUGIGCABKAIAQYCAAUkbIQQMBwtB0CohBAwGC0H9GiEEDAULIAIgASgCADYCVCACIANBBHZB//8DcTYCUEHQ2AFBwABB1QkgAkHQAGoQ7QQaQdDYASEDDAULIAIgASgCADYCZCACIANBBHZB//8DcTYCYEHQ2AFBwABBkx0gAkHgAGoQ7QQaQdDYASEDDAQLIAIgASgCADYCdCACIANBBHZB//8DcTYCcEHQ2AFBwABBhR0gAkHwAGoQ7QQaQdDYASEDDAMLAkACQCABKAIAIgENAEF/IQQMAQsgAS0AA0EPcUF/aiEEC0HkxQAhAwJAIAQiBEEKSw0AIARBAnRB+OYAaigCACEDCyACIAE2AoQBIAIgAzYCgAFB0NgBQcAAQf8cIAJBgAFqEO0EGkHQ2AEhAwwCC0GmPCEECwJAIAQiAw0AQYIoIQMMAQsgAiABKAIANgIUIAIgAzYCEEHQ2AFBwABBmQwgAkEQahDtBBpB0NgBIQMLIAJBkAFqJAAgAwvgBQIWfwR+IwBB4ABrIgJBwABqQRhqIABBGGopAgAiGDcDACACQcAAakEQaiAAQRBqKQIAIhk3AwAgAiAAKQIAIho3A0AgAiAAQQhqKQIAIhs3A0ggASEDQQAhBCACKAJcIQUgGKchBiACKAJUIQEgGachByACKAJMIQggG6chCSACKAJEIQogGqchCwNAIAQiDEEEdCENIAMhBEEAIQMgByEHIAEhDiAGIQ8gBSEQIAshCyAKIREgCSESIAghEwNAIBMhEyASIQggESEJIAshCiAQIRAgDyEFIA4hBiAHIQEgAyEDIAQhBAJAAkAgDA0AIAIgA0ECdGogBCgAACIHQRh0IAdBgP4DcUEIdHIgB0EIdkGA/gNxIAdBGHZycjYCACAEQQRqIQcMAQsgAiADQQJ0aiIOIAIgA0EBakEPcUECdGooAgAiB0EZdyAHQQ53cyAHQQN2cyAOKAIAaiACIANBCWpBD3FBAnRqKAIAaiACIANBDmpBD3FBAnRqKAIAIgdBD3cgB0ENd3MgB0EKdnNqNgIAIAQhBwsgAiABNgJUIAIgBjYCWCACIAU2AlwgAiATIAFBGncgAUEVd3MgAUEHd3MgBiABcWogEGogBSABQX9zcWogAyANckECdEGw5wBqKAIAaiACIANBAnRqKAIAaiIEaiIUNgJQIAIgCjYCRCACIAk2AkggAiAINgJMIAIgCkEedyAKQRN3cyAKQQp3cyAEaiAIIAlzIApxIAggCXFzaiIVNgJAIAciFiEEIANBAWoiFyEDIBQhByABIQ4gBiEPIAUhECAVIQsgCiERIAkhEiAIIRMgF0EQRw0ACyAWIQMgDEEBaiIOIQQgBSEFIAYhBiABIQEgFCEHIAghCCAJIQkgCiEKIBUhCyAOQQRHDQALQQAhAQNAIAAgASIBQQJ0IgpqIgMgAygCACACQcAAaiAKaigCAGo2AgAgAUEBaiIKIQEgCkEIRw0ACwu0AgEFfyAAKAJIIQEgACgCRCICQYABOgAAIABB0ABqIQMgAkEBaiECAkACQCABQX9qIgFBB00NACABIQEgAiECDAELIAJBACABEIgFGiADIABBBGoiAhC/AkHAACEBIAIhAgsgAkEAIAFBeGoiARCIBSABaiIEIAAoAkwiAUEDdDoAB0EGIQIgAUEFdiEFA0AgBCACIgFqIAUiBToAACABQX9qIQIgBUEIdiEFIAENAAsgAyAAQQRqEL8CIAAoAgAhAkEAIQFBACEFA0AgAiABIgFqIAMgBSIEQQJ0aiIFLQADOgAAIAIgAUEBcmogBS8BAjoAACACIAFBAnJqIAUoAgBBCHY6AAAgAiABQQNyaiAFKAIAOgAAIAFBBGohASAEQQFqIgQhBSAEQQhHDQALIAAoAgALkAEAECQCQEEALQCQ2QFFDQBBizxBDkHBGxDkBAALQQBBAToAkNkBECVBAEKrs4/8kaOz8NsANwL82QFBAEL/pLmIxZHagpt/NwL02QFBAELy5rvjo6f9p6V/NwLs2QFBAELnzKfQ1tDrs7t/NwLk2QFBAELAADcC3NkBQQBBmNkBNgLY2QFBAEGQ2gE2ApTZAQv5AQEDfwJAIAFFDQBBAEEAKALg2QEgAWo2AuDZASABIQEgACEAA0AgACEAIAEhAQJAQQAoAtzZASICQcAARw0AIAFBwABJDQBB5NkBIAAQvwIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgC2NkBIAAgASACIAEgAkkbIgIQhgUaQQBBACgC3NkBIgMgAms2AtzZASAAIAJqIQAgASACayEEAkAgAyACRw0AQeTZAUGY2QEQvwJBAEHAADYC3NkBQQBBmNkBNgLY2QEgBCEBIAAhACAEDQEMAgtBAEEAKALY2QEgAmo2AtjZASAEIQEgACEAIAQNAAsLC0wAQZTZARDAAhogAEEYakEAKQOo2gE3AAAgAEEQakEAKQOg2gE3AAAgAEEIakEAKQOY2gE3AAAgAEEAKQOQ2gE3AABBAEEAOgCQ2QEL2QcBA39BAEIANwPo2gFBAEIANwPg2gFBAEIANwPY2gFBAEIANwPQ2gFBAEIANwPI2gFBAEIANwPA2gFBAEIANwO42gFBAEIANwOw2gECQAJAAkACQCABQcEASQ0AECRBAC0AkNkBDQJBAEEBOgCQ2QEQJUEAIAE2AuDZAUEAQcAANgLc2QFBAEGY2QE2AtjZAUEAQZDaATYClNkBQQBCq7OP/JGjs/DbADcC/NkBQQBC/6S5iMWR2oKbfzcC9NkBQQBC8ua746On/aelfzcC7NkBQQBC58yn0NbQ67O7fzcC5NkBIAEhASAAIQACQANAIAAhACABIQECQEEAKALc2QEiAkHAAEcNACABQcAASQ0AQeTZASAAEL8CIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAtjZASAAIAEgAiABIAJJGyICEIYFGkEAQQAoAtzZASIDIAJrNgLc2QEgACACaiEAIAEgAmshBAJAIAMgAkcNAEHk2QFBmNkBEL8CQQBBwAA2AtzZAUEAQZjZATYC2NkBIAQhASAAIQAgBA0BDAILQQBBACgC2NkBIAJqNgLY2QEgBCEBIAAhACAEDQALC0GU2QEQwAIaQQBBACkDqNoBNwPI2gFBAEEAKQOg2gE3A8DaAUEAQQApA5jaATcDuNoBQQBBACkDkNoBNwOw2gFBAEEAOgCQ2QFBACEBDAELQbDaASAAIAEQhgUaQQAhAQsDQCABIgFBsNoBaiIAIAAtAABBNnM6AAAgAUEBaiIAIQEgAEHAAEcNAAwCCwALQYs8QQ5BwRsQ5AQACxAkAkBBAC0AkNkBDQBBAEEBOgCQ2QEQJUEAQsCAgIDwzPmE6gA3AuDZAUEAQcAANgLc2QFBAEGY2QE2AtjZAUEAQZDaATYClNkBQQBBmZqD3wU2AoDaAUEAQozRldi5tfbBHzcC+NkBQQBCuuq/qvrPlIfRADcC8NkBQQBChd2e26vuvLc8NwLo2QFBwAAhAUGw2gEhAAJAA0AgACEAIAEhAQJAQQAoAtzZASICQcAARw0AIAFBwABJDQBB5NkBIAAQvwIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgC2NkBIAAgASACIAEgAkkbIgIQhgUaQQBBACgC3NkBIgMgAms2AtzZASAAIAJqIQAgASACayEEAkAgAyACRw0AQeTZAUGY2QEQvwJBAEHAADYC3NkBQQBBmNkBNgLY2QEgBCEBIAAhACAEDQEMAgtBAEEAKALY2QEgAmo2AtjZASAEIQEgACEAIAQNAAsLDwtBizxBDkHBGxDkBAAL+QYBBX9BlNkBEMACGiAAQRhqQQApA6jaATcAACAAQRBqQQApA6DaATcAACAAQQhqQQApA5jaATcAACAAQQApA5DaATcAAEEAQQA6AJDZARAkAkBBAC0AkNkBDQBBAEEBOgCQ2QEQJUEAQquzj/yRo7Pw2wA3AvzZAUEAQv+kuYjFkdqCm383AvTZAUEAQvLmu+Ojp/2npX83AuzZAUEAQufMp9DW0Ouzu383AuTZAUEAQsAANwLc2QFBAEGY2QE2AtjZAUEAQZDaATYClNkBQQAhAQNAIAEiAUGw2gFqIgIgAi0AAEHqAHM6AAAgAUEBaiICIQEgAkHAAEcNAAtBAEHAADYC4NkBQcAAIQFBsNoBIQICQANAIAIhAiABIQECQEEAKALc2QEiA0HAAEcNACABQcAASQ0AQeTZASACEL8CIAFBQGoiAyEBIAJBwABqIQIgAw0BDAILQQAoAtjZASACIAEgAyABIANJGyIDEIYFGkEAQQAoAtzZASIEIANrNgLc2QEgAiADaiECIAEgA2shBQJAIAQgA0cNAEHk2QFBmNkBEL8CQQBBwAA2AtzZAUEAQZjZATYC2NkBIAUhASACIQIgBQ0BDAILQQBBACgC2NkBIANqNgLY2QEgBSEBIAIhAiAFDQALC0EAQQAoAuDZAUEgajYC4NkBQSAhASAAIQICQANAIAIhAiABIQECQEEAKALc2QEiA0HAAEcNACABQcAASQ0AQeTZASACEL8CIAFBQGoiAyEBIAJBwABqIQIgAw0BDAILQQAoAtjZASACIAEgAyABIANJGyIDEIYFGkEAQQAoAtzZASIEIANrNgLc2QEgAiADaiECIAEgA2shBQJAIAQgA0cNAEHk2QFBmNkBEL8CQQBBwAA2AtzZAUEAQZjZATYC2NkBIAUhASACIQIgBQ0BDAILQQBBACgC2NkBIANqNgLY2QEgBSEBIAIhAiAFDQALC0GU2QEQwAIaIABBGGpBACkDqNoBNwAAIABBEGpBACkDoNoBNwAAIABBCGpBACkDmNoBNwAAIABBACkDkNoBNwAAQQBCADcDsNoBQQBCADcDuNoBQQBCADcDwNoBQQBCADcDyNoBQQBCADcD0NoBQQBCADcD2NoBQQBCADcD4NoBQQBCADcD6NoBQQBBADoAkNkBDwtBizxBDkHBGxDkBAAL7QcBAX8gACABEMQCAkAgA0UNAEEAQQAoAuDZASADajYC4NkBIAMhAyACIQEDQCABIQEgAyEDAkBBACgC3NkBIgBBwABHDQAgA0HAAEkNAEHk2QEgARC/AiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALY2QEgASADIAAgAyAASRsiABCGBRpBAEEAKALc2QEiCSAAazYC3NkBIAEgAGohASADIABrIQICQCAJIABHDQBB5NkBQZjZARC/AkEAQcAANgLc2QFBAEGY2QE2AtjZASACIQMgASEBIAINAQwCC0EAQQAoAtjZASAAajYC2NkBIAIhAyABIQEgAg0ACwsgCBDFAiAIQSAQxAICQCAFRQ0AQQBBACgC4NkBIAVqNgLg2QEgBSEDIAQhAQNAIAEhASADIQMCQEEAKALc2QEiAEHAAEcNACADQcAASQ0AQeTZASABEL8CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAtjZASABIAMgACADIABJGyIAEIYFGkEAQQAoAtzZASIJIABrNgLc2QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHk2QFBmNkBEL8CQQBBwAA2AtzZAUEAQZjZATYC2NkBIAIhAyABIQEgAg0BDAILQQBBACgC2NkBIABqNgLY2QEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALg2QEgB2o2AuDZASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAtzZASIAQcAARw0AIANBwABJDQBB5NkBIAEQvwIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgC2NkBIAEgAyAAIAMgAEkbIgAQhgUaQQBBACgC3NkBIgkgAGs2AtzZASABIABqIQEgAyAAayECAkAgCSAARw0AQeTZAUGY2QEQvwJBAEHAADYC3NkBQQBBmNkBNgLY2QEgAiEDIAEhASACDQEMAgtBAEEAKALY2QEgAGo2AtjZASACIQMgASEBIAINAAsLQQBBACgC4NkBQQFqNgLg2QFBASEDQdPVACEBAkADQCABIQEgAyEDAkBBACgC3NkBIgBBwABHDQAgA0HAAEkNAEHk2QEgARC/AiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALY2QEgASADIAAgAyAASRsiABCGBRpBAEEAKALc2QEiCSAAazYC3NkBIAEgAGohASADIABr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QCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIIBC3EBAX8jAEEgayIDJAAgA0EYaiACEOIDIAMgAykDGDcDEAJAAkACQCADQRBqEMkCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDmAhDiAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOIDIANBEGogAhDiAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQogIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEOIDIAJBIGogARDiAyACQRhqIAEQ4gMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCjAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDiAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQ9QINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQoAILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDiAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQ9QINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQoAILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDiAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQ9QINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQoAILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ9QINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQQAQhAIhBCADIAMpAxA3AwAgACACIAQgAxCeAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ9QINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQRUQhAIhBCADIAMpAxA3AwAgACACIAQgAxCeAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEIQCEI4BIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEOUCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDjAyIDEJABIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEOUCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDjAyIDEJEBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEOUCIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCCASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBD1Ag0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQggELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEPUCDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCCAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQ9QINACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIIBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBD1Ag0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQggELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCCAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEOMCC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQggELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCCASAAQgA3AwAMAQsgACACQQggAiAEEJYCEOUCCyADQRBqJAALXwEDfyMAQRBrIgMkACACEOMDIQQgAhDjAyEFIANBCGogAkECEOUDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDiAyADIAMpAwg3AwAgACACIAMQ7wIQ4wIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDiAyAAQcDpAEHI6QAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA8BpNwMACw0AIABBACkDyGk3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ4gMgAyADKQMINwMAIAAgAiADEOgCEOQCIANBEGokAAsNACAAQQApA9BpNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEOIDAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEOYCIgREAAAAAAAAAABjRQ0AIAAgBJoQ4gIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkDuGk3AwAMAgsgAEEAIAJrEOMC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BSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEIYFIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMELUFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEELUFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCQsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiAB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IAC9IgVCNIinQf8PcSIGQf8PRg0AIARC////////////AINCgYCAgICAgPj/AFQNAQsgACABoiIBIAGjDwsCQCAFQgGGIgQgA1YNACAARAAAAAAAAAAAoiAAIAQgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAFQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIAVBASAGa62GIQMMAQsgBUL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIEQgBTDQADQCAHQX9qIQcgBEIBhiIEQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LIANCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCwJAAkAgA0L/////////B1gNACADIQQMAQsDQCAGQX9qIQYgA0KAgICAgICABFQhByADQgGGIgQhAyAHDQALCyAFQoCAgICAgICAgH+DIQMCQAJAIAZBAUgNACAEQoCAgICAgIB4fCAGrUI0hoQhBAwBCyAEQQEgBmutiCEECyAEIAOEvwsFACAAvQsOACAAKAI8IAEgAhCfBQvlAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQYgA0EQaiEEQQIhBwJAAkACQAJAAkAgACgCPCADQRBqQQIgA0EMahAUEMYFRQ0AIAQhBQwBCwNAIAYgAygCDCIBRg0CAkAgAUF/Sg0AIAQhBQwECyAEIAEgBCgCBCIISyIJQQN0aiIFIAUoAgAgASAIQQAgCRtrIghqNgIAIARBDEEEIAkbaiIEIAQoAgAgCGs2AgAgBiABayEGIAUhBCAAKAI8IAUgByAJayIHIANBDGoQFBDGBUUNAAsLIAZBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACIQEMAQtBACEBIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAIAdBAkYNACACIAUoAgRr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IgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDXBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEM8FIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDNBUEASg0AAkAgASAJIAMgChDNBUUNACABIQQMAgsgBUHwAGogASACQgBCABDXBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ1wUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAENcFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDXBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ1wUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/ENcFIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkG8xgFqKAIAIQYgAkGwxgFqKAIAIQcD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f3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDMBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQzAVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEMwFIAVBMGogCiABIAcQ1gUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDMBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDMBSAFIAIgBEEBIAZrENYFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDUBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDVBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEMwFQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQzAUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ2AUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ2AUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ2AUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ2AUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ2AUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ2AUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ2AUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ2AUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ2AUgBUGQAWogA0IPhkIAIARCABDYBSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAENgFIAVBgAFqQgEgAn1CACAEQgAQ2AUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhDYBSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDYBSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrENYFIAVBMGogFiATIAZB8ABqEMwFIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPENgFIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ2AUgBSADIA5CBUIAENgFIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDMBSACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDMBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEMwFIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEMwFIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEMwFQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEMwFIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEMwFIAVBIGogAiAEIAYQzAUgBUEQaiASIAEgBxDWBSAFIAIgBCAHENYFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDLBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQzAUgAiAAIARBgfgAIANrENYFIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBgO0FJANBgO0BQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEPAAslAQF+IAAgASACrSADrUIghoQgBBDmBSEFIAVCIIinENwFIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC67LgYAAAwBBgAgLyL4BaW5maW5pdHkALUluZmluaXR5AGRldnNfdmVyaWZ5AGRldnNfanNvbl9zdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdAB3YWl0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAHNsZWVwTXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAERldlMtU0hBMjU2OiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBwcm9nVmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBhc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBnY3JlZl90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAHByb2dOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkACogIHBjPSVkIEAgJXNfRiVkACEgIHBjPSVkIEAgJXNfRiVkACEgUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDACogIHBjPSVkIEAgPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcHRyKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQAhIG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRFUykAJXMgKFdTU0spAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpACF0YXJnZXRfaW5faXJxKCkAZnN0b3I6IGludmFsaWQgbGFyZ2Uga2V5OiAnJXMnAGZzdG9yOiBp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ZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAA0u+AgAAEbmFtZQHibukFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwxzdG9wX3Byb2dyYW1oD2RldnNtZ3JfcmVzdGFydGkUZGV2c21ncl9kZXBsb3lfc3RhcnRqFGRldnNtZ3JfZGVwbG95X3dyaXRlaxBkZXZzbWdyX2dldF9oYXNobBVkZXZzbWdyX2hhbmRsZV9wYWNrZXRtDmRlcGxveV9oYW5kbGVybhNkZXBsb3lfbWV0YV9oYW5kbGVybw9kZXZzbWdyX2dldF9jdHhwDmRldnNtZ3JfZGVwbG95cQxkZXZzbWdyX2luaXRyEWRldnNtZ3JfY2xpZW50X2V2cxBkZXZzX2ZpYmVyX3lpZWxkdBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb251GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXYQZGV2c19maWJlcl9zbGVlcHcbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3kRZGV2c19pbWdfZnVuX25hbWV6EmRldnNfaW1nX3JvbGVfbmFtZXsSZGV2c19maWJlcl9ieV9maWR4fBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBCmRldnNfcGFuaWOCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARNqZF9nY19hbnlfdHJ5X2FsbG9jhQEHZGV2c19nY4YBD2ZpbmRfZnJlZV9ibG9ja4cBEmRldnNfYW55X3RyeV9hbGxvY4gBDmRldnNfdHJ5X2FsbG9jiQELamRfZ2NfdW5waW6KAQpqZF9nY19mcmVliwEUZGV2c192YWx1ZV9pc19waW5uZWSMAQ5kZXZzX3ZhbHVlX3Bpbo0BEGRldnNfdmFsdWVfdW5waW6OARJkZXZzX21hcF90cnlfYWxsb2OPARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OQARRkZXZzX2FycmF5X3RyeV9hbGxvY5EBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5IBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5MBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lAEPZGV2c19nY19zZXRfY3R4lQEOZGV2c19nY19jcmVhdGWWAQ9kZXZzX2djX2Rlc3Ryb3mXARFkZXZzX2djX29ial92YWxpZJgBC3NjYW5fZ2Nfb2JqmQERcHJvcF9BcnJheV9sZW5ndGiaARJtZXRoMl9BcnJheV9pbnNlcnSbARJmdW4xX0FycmF5X2lzQXJyYXmcARBtZXRoWF9BcnJheV9wdXNonQEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlngERbWV0aFhfQXJyYXlfc2xpY2WfARFmdW4xX0J1ZmZlcl9hbGxvY6ABEnByb3BfQnVmZmVyX2xlbmd0aKEBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ6IBE21ldGgzX0J1ZmZlcl9maWxsQXSjARNtZXRoNF9CdWZmZXJfYmxpdEF0pAEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc6UBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6YBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKcBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKgBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50qQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdKoBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50qwEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKsARRtZXRoMV9FcnJvcl9fX2N0b3JfX60BGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+uARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+vARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7ABD3Byb3BfRXJyb3JfbmFtZbEBEW1ldGgwX0Vycm9yX3ByaW50sgEUbWV0aFhfRnVuY3Rpb25fc3RhcnSzARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbQBEnByb3BfRnVuY3Rpb25fbmFtZbUBD2Z1bjJfSlNPTl9wYXJzZbYBE2Z1bjNfSlNPTl9zdHJpbmdpZnm3AQ5mdW4xX01hdGhfY2VpbLgBD2Z1bjFfTWF0aF9mbG9vcrkBD2Z1bjFfTWF0aF9yb3VuZLoBDWZ1bjFfTWF0aF9hYnO7ARBmdW4wX01hdGhfcmFuZG9tvAETZnVuMV9NYXRoX3JhbmRvbUludL0BDWZ1bjFfTWF0aF9sb2e+AQ1mdW4yX01hdGhfcG93vwEOZnVuMl9NYXRoX2lkaXbAAQ5mdW4yX01hdGhfaW1vZMEBDmZ1bjJfTWF0aF9pbXVswgENZnVuMl9NYXRoX21pbsMBC2Z1bjJfbWlubWF4xAENZnVuMl9NYXRoX21heMUBEmZ1bjJfT2JqZWN0X2Fzc2lnbsYBEGZ1bjFfT2JqZWN0X2tleXPHARNmdW4xX2tleXNfb3JfdmFsdWVzyAESZnVuMV9PYmplY3RfdmFsdWVzyQEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bKARBwcm9wX1BhY2tldF9yb2xlywEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcswBE3Byb3BfUGFja2V0X3Nob3J0SWTNARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjOARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZM8BEXByb3BfUGFja2V0X2ZsYWdz0AEVcHJvcF9QYWNrZXRfaXNDb21tYW5k0QEUcHJvcF9QYWNrZXRfaXNSZXBvcnTSARNwcm9wX1BhY2tldF9wYXlsb2Fk0wETcHJvcF9QYWNrZXRfaXNFdmVudNQBFXByb3BfUGFja2V0X2V2ZW50Q29kZdUBFHByb3BfUGFja2V0X2lzUmVnU2V01gEUcHJvcF9QYWNrZXRfaXNSZWdHZXTXARNwcm9wX1BhY2tldF9yZWdDb2Rl2AETbWV0aDBfUGFja2V0X2RlY29kZdkBEmRldnNfcGFja2V0X2RlY29kZdoBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZNsBFERzUmVnaXN0ZXJfcmVhZF9jb2503AESZGV2c19wYWNrZXRfZW5jb2Rl3QEWbWV0aFhfRHNSZWdpc3Rlcl93cml0Zd4BFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXfARZwcm9wX0RzUGFja2V0SW5mb19uYW1l4AEWcHJvcF9Ec1BhY2tldEluZm9fY29kZeEBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX+IBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVk4wEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k5AERbWV0aDBfRHNSb2xlX3dhaXTlARJwcm9wX1N0cmluZ19sZW5ndGjmARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdOcBE21ldGgxX1N0cmluZ19jaGFyQXToARJtZXRoMl9TdHJpbmdfc2xpY2XpARRkZXZzX2pkX2dldF9yZWdpc3RlcuoBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTrARBkZXZzX2pkX3NlbmRfY21k7AERZGV2c19qZF93YWtlX3JvbGXtARRkZXZzX2pkX3Jlc2V0X3BhY2tldO4BE2RldnNfamRfcGt0X2NhcHR1cmXvARNkZXZzX2pkX3NlbmRfbG9nbXNn8AESZGV2c19qZF9zaG91bGRfcnVu8QEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXyARNkZXZzX2pkX3Byb2Nlc3NfcGt08wEUZGV2c19qZF9yb2xlX2NoYW5nZWT0ARJkZXZzX2pkX2luaXRfcm9sZXP1ARJkZXZzX2pkX2ZyZWVfcm9sZXP2ARVkZXZzX3NldF9nbG9iYWxfZmxhZ3P3ARdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc/gBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc/kBEGRldnNfanNvbl9lc2NhcGX6ARVkZXZzX2pzb25fZXNjYXBlX2NvcmX7AQ9kZXZzX2pzb25fcGFyc2X8AQpqc29uX3ZhbHVl/QEMcGFyc2Vfc3RyaW5n/gENc3RyaW5naWZ5X29iav8BCmFkZF9pbmRlbnSAAg9zdHJpbmdpZnlfZmllbGSBAhNkZXZzX2pzb25fc3RyaW5naWZ5ggIRcGFyc2Vfc3RyaW5nX2NvcmWDAhFkZXZzX21hcGxpa2VfaXRlcoQCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0hQISZGV2c19tYXBfY29weV9pbnRvhgIMZGV2c19tYXBfc2V0hwIGbG9va3VwiAITZGV2c19tYXBsaWtlX2lzX21hcIkCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc4oCEWRldnNfYXJyYXlfaW5zZXJ0iwIIa3ZfYWRkLjGMAhJkZXZzX3Nob3J0X21hcF9zZXSNAg9kZXZzX21hcF9kZWxldGWOAhJkZXZzX3Nob3J0X21hcF9nZXSPAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJACDmRldnNfcm9sZV9zcGVjkQISZGV2c19mdW5jdGlvbl9iaW5kkgIRZGV2c19tYWtlX2Nsb3N1cmWTAg5kZXZzX2dldF9mbmlkeJQCE2RldnNfZ2V0X2ZuaWR4X2NvcmWVAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSWAhNkZXZzX2dldF9yb2xlX3Byb3RvlwIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3mAIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkmQIVZGV2c19nZXRfc3RhdGljX3Byb3RvmgIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvmwIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2cAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvnQIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkngIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5knwIQZGV2c19pbnN0YW5jZV9vZqACD2RldnNfb2JqZWN0X2dldKECDGRldnNfc2VxX2dldKICDGRldnNfYW55X2dldKMCDGRldnNfYW55X3NldKQCDGRldnNfc2VxX3NldKUCDmRldnNfYXJyYXlfc2V0pgITZGV2c19hcnJheV9waW5fcHVzaKcCDGRldnNfYXJnX2ludKgCD2RldnNfYXJnX2RvdWJsZakCD2RldnNfcmV0X2RvdWJsZaoCDGRldnNfcmV0X2ludKsCDWRldnNfcmV0X2Jvb2ysAg9kZXZzX3JldF9nY19wdHKtAhFkZXZzX2FyZ19zZWxmX21hcK4CEWRldnNfc2V0dXBfcmVzdW1lrwIPZGV2c19jYW5fYXR0YWNosAIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZbECFWRldnNfbWFwbGlrZV90b192YWx1ZbICEmRldnNfcmVnY2FjaGVfZnJlZbMCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGy0AhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZLUCE2RldnNfcmVnY2FjaGVfYWxsb2O2AhRkZXZzX3JlZ2NhY2hlX2xvb2t1cLcCEWRldnNfcmVnY2FjaGVfYWdluAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGW5AhJkZXZzX3JlZ2NhY2hlX25leHS6Ag9qZF9zZXR0aW5nc19nZXS7Ag9qZF9zZXR0aW5nc19zZXS8Ag5kZXZzX2xvZ192YWx1Zb0CD2RldnNfc2hvd192YWx1Zb4CEGRldnNfc2hvd192YWx1ZTC/Ag1jb25zdW1lX2NodW5rwAINc2hhXzI1Nl9jbG9zZcECD2pkX3NoYTI1Nl9zZXR1cMICEGpkX3NoYTI1Nl91cGRhdGXDAhBqZF9zaGEyNTZfZmluaXNoxAIUamRfc2hhMjU2X2htYWNfc2V0dXDFAhVqZF9zaGEyNTZfaG1hY19maW5pc2jGAg5qZF9zaGEyNTZfaGtkZscCDmRldnNfc3RyZm9ybWF0yAIOZGV2c19pc19zdHJpbmfJAg5kZXZzX2lzX251bWJlcsoCFGRldnNfc3RyaW5nX2dldF91dGY4ywITZGV2c19idWlsdGluX3N0cmluZ8wCFGRldnNfc3RyaW5nX3ZzcHJpbnRmzQITZGV2c19zdHJpbmdfc3ByaW50Zs4CFWRldnNfc3RyaW5nX2Zyb21fdXRmOM8CFGRldnNfdmFsdWVfdG9fc3RyaW5n0AIQYnVmZmVyX3RvX3N0cmluZ9ECGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTSAhJkZXZzX3N0cmluZ19jb25jYXTTAhFkZXZzX3N0cmluZ19zbGljZdQCEmRldnNfcHVzaF90cnlmcmFtZdUCEWRldnNfcG9wX3RyeWZyYW1l1gIPZGV2c19kdW1wX3N0YWNr1wITZGV2c19kdW1wX2V4Y2VwdGlvbtgCCmRldnNfdGhyb3fZAhJkZXZzX3Byb2Nlc3NfdGhyb3faAhBkZXZzX2FsbG9jX2Vycm9y2wIVZGV2c190aHJvd190eXBlX2Vycm9y3AIWZGV2c190aHJvd19yYW5nZV9lcnJvct0CHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvct4CGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y3wIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh04AIYZGV2c190aHJvd190b29fYmlnX2Vycm9y4QIXZGV2c190aHJvd19zeW50YXhfZXJyb3LiAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl4wITZGV2c192YWx1ZV9mcm9tX2ludOQCFGRldnNfdmFsdWVfZnJvbV9ib29s5QIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLmAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZecCEWRldnNfdmFsdWVfdG9faW506AISZGV2c192YWx1ZV90b19ib29s6QIOZGV2c19pc19idWZmZXLqAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZesCEGRldnNfYnVmZmVyX2RhdGHsAhNkZXZzX2J1ZmZlcmlzaF9kYXRh7QIUZGV2c192YWx1ZV90b19nY19vYmruAg1kZXZzX2lzX2FycmF57wIRZGV2c192YWx1ZV90eXBlb2bwAg9kZXZzX2lzX251bGxpc2jxAhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk8gIUZGV2c192YWx1ZV9hcHByb3hfZXHzAhJkZXZzX3ZhbHVlX2llZWVfZXH0Ah5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP1AhJkZXZzX2ltZ19zdHJpZHhfb2v2AhJkZXZzX2R1bXBfdmVyc2lvbnP3AgtkZXZzX3ZlcmlmefgCEWRldnNfZmV0Y2hfb3Bjb2Rl+QIOZGV2c192bV9yZXN1bWX6AhFkZXZzX3ZtX3NldF9kZWJ1Z/sCGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHP8AhhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnT9Ag9kZXZzX3ZtX3N1c3BlbmT+AhZkZXZzX3ZtX3NldF9icmVha3BvaW50/wIUZGV2c192bV9leGVjX29wY29kZXOAAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIEDEWRldnNfaW1nX2dldF91dGY4ggMUZGV2c19nZXRfc3RhdGljX3V0ZjiDAw9kZXZzX3ZtX3JvbGVfb2uEAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIUDDGV4cHJfaW52YWxpZIYDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0hwMLc3RtdDFfY2FsbDCIAwtzdG10Ml9jYWxsMYkDC3N0bXQzX2NhbGwyigMLc3RtdDRfY2FsbDOLAwtzdG10NV9jYWxsNIwDC3N0bXQ2X2NhbGw1jQMLc3RtdDdfY2FsbDaOAwtzdG10OF9jYWxsN48DC3N0bXQ5X2NhbGw4kAMSc3RtdDJfaW5kZXhfZGVsZXRlkQMMc3RtdDFfcmV0dXJukgMJc3RtdHhfam1wkwMMc3RtdHgxX2ptcF96lAMKZXhwcjJfYmluZJUDEmV4cHJ4X29iamVjdF9maWVsZJYDEnN0bXR4MV9zdG9yZV9sb2NhbJcDE3N0bXR4MV9zdG9yZV9nbG9iYWyYAxJzdG10NF9zdG9yZV9idWZmZXKZAwlleHByMF9pbmaaAxBleHByeF9sb2FkX2xvY2FsmwMRZXhwcnhfbG9hZF9nbG9iYWycAwtleHByMV91cGx1c50DC2V4cHIyX2luZGV4ngMPc3RtdDNfaW5kZXhfc2V0nwMUZXhwcngxX2J1aWx0aW5fZmllbGSgAxJleHByeDFfYXNjaWlfZmllbGShAxFleHByeDFfdXRmOF9maWVsZKIDEGV4cHJ4X21hdGhfZmllbGSjAw5leHByeF9kc19maWVsZKQDD3N0bXQwX2FsbG9jX21hcKUDEXN0bXQxX2FsbG9jX2FycmF5pgMSc3RtdDFfYWxsb2NfYnVmZmVypwMRZXhwcnhfc3RhdGljX3JvbGWoAxNleHByeF9zdGF0aWNfYnVmZmVyqQMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nqgMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ6sDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ6wDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbq0DDWV4cHJ4X2xpdGVyYWyuAxFleHByeF9saXRlcmFsX2Y2NK8DEGV4cHJ4X3JvbGVfcHJvdG+wAxFleHByM19sb2FkX2J1ZmZlcrEDDWV4cHIwX3JldF92YWyyAwxleHByMV90eXBlb2azAw9leHByMF91bmRlZmluZWS0AxJleHByMV9pc191bmRlZmluZWS1AwpleHByMF90cnVltgMLZXhwcjBfZmFsc2W3Aw1leHByMV90b19ib29suAMJZXhwcjBfbmFuuQMJZXhwcjFfYWJzugMNZXhwcjFfYml0X25vdLsDDGV4cHIxX2lzX25hbrwDCWV4cHIxX25lZ70DCWV4cHIxX25vdL4DDGV4cHIxX3RvX2ludL8DCWV4cHIyX2FkZMADCWV4cHIyX3N1YsEDCWV4cHIyX211bMIDCWV4cHIyX2RpdsMDDWV4cHIyX2JpdF9hbmTEAwxleHByMl9iaXRfb3LFAw1leHByMl9iaXRfeG9yxgMQZXhwcjJfc2hpZnRfbGVmdMcDEWV4cHIyX3NoaWZ0X3JpZ2h0yAMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTJAwhleHByMl9lccoDCGV4cHIyX2xlywMIZXhwcjJfbHTMAwhleHByMl9uZc0DFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcs4DFHN0bXR4Ml9zdG9yZV9jbG9zdXJlzwMTZXhwcngxX2xvYWRfY2xvc3VyZdADEmV4cHJ4X21ha2VfY2xvc3VyZdEDEGV4cHIxX3R5cGVvZl9zdHLSAwxleHByMF9ub3dfbXPTAxZleHByMV9nZXRfZmliZXJfaGFuZGxl1AMQc3RtdDJfY2FsbF9hcnJhedUDCXN0bXR4X3RyedYDDXN0bXR4X2VuZF90cnnXAwtzdG10MF9jYXRjaNgDDXN0bXQwX2ZpbmFsbHnZAwtzdG10MV90aHJvd9oDDnN0bXQxX3JlX3Rocm932wMQc3RtdHgxX3Rocm93X2ptcNwDDnN0bXQwX2RlYnVnZ2Vy3QMJZXhwcjFfbmV33gMRZXhwcjJfaW5zdGFuY2Vfb2bfAwpleHByMF9udWxs4AMPZXhwcjJfYXBwcm94X2Vx4QMPZXhwcjJfYXBwcm94X25l4gMPZGV2c192bV9wb3BfYXJn4wMTZGV2c192bV9wb3BfYXJnX3UzMuQDE2RldnNfdm1fcG9wX2FyZ19pMzLlAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy5gMSamRfYWVzX2NjbV9lbmNyeXB05wMSamRfYWVzX2NjbV9kZWNyeXB06AMMQUVTX2luaXRfY3R46QMPQUVTX0VDQl9lbmNyeXB06gMQamRfYWVzX3NldHVwX2tleesDDmpkX2Flc19lbmNyeXB07AMQamRfYWVzX2NsZWFyX2tlee0DC2pkX3dzc2tfbmV37gMUamRfd3Nza19zZW5kX21lc3NhZ2XvAxNqZF93ZWJzb2NrX29uX2V2ZW508AMHZGVjcnlwdPEDDWpkX3dzc2tfY2xvc2XyAxBqZF93c3NrX29uX2V2ZW508wMLcmVzcF9zdGF0dXP0AxJ3c3NraGVhbHRoX3Byb2Nlc3P1AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZfYDFHdzc2toZWFsdGhfcmVjb25uZWN09wMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0+AMPc2V0X2Nvbm5fc3RyaW5n+QMRY2xlYXJfY29ubl9zdHJpbmf6Aw93c3NraGVhbHRoX2luaXT7AxF3c3NrX3NlbmRfbWVzc2FnZfwDEXdzc2tfaXNfY29ubmVjdGVk/QMSd3Nza19zZXJ2aWNlX3F1ZXJ5/gMUZGV2c190cmFja19leGNlcHRpb27/Axxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplgAQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYEED3JvbGVtZ3JfcHJvY2Vzc4IEEHJvbGVtZ3JfYXV0b2JpbmSDBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSEBBRqZF9yb2xlX21hbmFnZXJfaW5pdIUEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZIYEDWpkX3JvbGVfYWxsb2OHBBBqZF9yb2xlX2ZyZWVfYWxsiAQWamRfcm9sZV9mb3JjZV9hdXRvYmluZIkEE2pkX2NsaWVudF9sb2dfZXZlbnSKBBNqZF9jbGllbnRfc3Vic2NyaWJliwQUamRfY2xpZW50X2VtaXRfZXZlbnSMBBRyb2xlbWdyX3JvbGVfY2hhbmdlZI0EEGpkX2RldmljZV9sb29rdXCOBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WPBBNqZF9zZXJ2aWNlX3NlbmRfY21kkAQRamRfY2xpZW50X3Byb2Nlc3ORBA5qZF9kZXZpY2VfZnJlZZIEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0kwQPamRfZGV2aWNlX2FsbG9jlAQPamRfY3RybF9wcm9jZXNzlQQVamRfY3RybF9oYW5kbGVfcGFja2V0lgQMamRfY3RybF9pbml0lwQUZGNmZ19zZXRfdXNlcl9jb25maWeYBAlkY2ZnX2luaXSZBA1kY2ZnX3ZhbGlkYXRlmgQOZGNmZ19nZXRfZW50cnmbBAxkY2ZnX2dldF9pMzKcBAxkY2ZnX2dldF91MzKdBA9kY2ZnX2dldF9zdHJpbmeeBAxkY2ZnX2lkeF9rZXmfBAlqZF92ZG1lc2egBBFqZF9kbWVzZ19zdGFydHB0cqEEDWpkX2RtZXNnX3JlYWSiBBJqZF9kbWVzZ19yZWFkX2xpbmWjBBNqZF9zZXR0aW5nc19nZXRfYmlupAQNamRfZnN0b3JfaW5pdKUEE2pkX3NldHRpbmdzX3NldF9iaW6mBAtqZF9mc3Rvcl9nY6cED3JlY29tcHV0ZV9jYWNoZagEFWpkX3NldHRpbmdzX2dldF9sYXJnZakEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2WqBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZasEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2WsBA1qZF9pcGlwZV9vcGVurQQWamRfaXBpcGVfaGFuZGxlX3BhY2tldK4EDmpkX2lwaXBlX2Nsb3NlrwQSamRfbnVtZm10X2lzX3ZhbGlksAQVamRfbnVtZm10X3dyaXRlX2Zsb2F0sQQTamRfbnVtZm10X3dyaXRlX2kzMrIEEmpkX251bWZtdF9yZWFkX2kzMrMEFGpkX251bWZtdF9yZWFkX2Zsb2F0tAQRamRfb3BpcGVfb3Blbl9jbWS1BBRqZF9vcGlwZV9vcGVuX3JlcG9ydLYEFmpkX29waXBlX2hhbmRsZV9wYWNrZXS3BBFqZF9vcGlwZV93cml0ZV9leLgEEGpkX29waXBlX3Byb2Nlc3O5BBRqZF9vcGlwZV9jaGVja19zcGFjZboEDmpkX29waXBlX3dyaXRluwQOamRfb3BpcGVfY2xvc2W8BA1qZF9xdWV1ZV9wdXNovQQOamRfcXVldWVfZnJvbnS+BA5qZF9xdWV1ZV9zaGlmdL8EDmpkX3F1ZXVlX2FsbG9jwAQNamRfcmVzcG9uZF91OMEEDmpkX3Jlc3BvbmRfdTE2wgQOamRfcmVzcG9uZF91MzLDBBFqZF9yZXNwb25kX3N0cmluZ8QEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkxQQLamRfc2VuZF9wa3TGBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbMcEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyyAQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldMkEFGpkX2FwcF9oYW5kbGVfcGFja2V0ygQVamRfYXBwX2hhbmRsZV9jb21tYW5kywQVYXBwX2dldF9pbnN0YW5jZV9uYW1lzAQTamRfYWxsb2NhdGVfc2VydmljZc0EEGpkX3NlcnZpY2VzX2luaXTOBA5qZF9yZWZyZXNoX25vd88EGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTQBBRqZF9zZXJ2aWNlc19hbm5vdW5jZdEEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l0gQQamRfc2VydmljZXNfdGlja9MEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ9QEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl1QQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZdYEFGFwcF9nZXRfZGV2aWNlX2NsYXNz1wQSYXBwX2dldF9md192ZXJzaW9u2AQNamRfc3J2Y2ZnX3J1btkEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l2gQRamRfc3J2Y2ZnX3ZhcmlhbnTbBA1qZF9oYXNoX2ZudjFh3AQMamRfZGV2aWNlX2lk3QQJamRfcmFuZG9t3gQIamRfY3JjMTbfBA5qZF9jb21wdXRlX2NyY+AEDmpkX3NoaWZ0X2ZyYW1l4QQMamRfd29yZF9tb3Zl4gQOamRfcmVzZXRfZnJhbWXjBBBqZF9wdXNoX2luX2ZyYW1l5AQNamRfcGFuaWNfY29yZeUEE2pkX3Nob3VsZF9zYW1wbGVfbXPmBBBqZF9zaG91bGRfc2FtcGxl5wQJamRfdG9faGV46AQLamRfZnJvbV9oZXjpBA5qZF9hc3NlcnRfZmFpbOoEB2pkX2F0b2nrBAtqZF92c3ByaW50ZuwED2pkX3ByaW50X2RvdWJsZe0ECmpkX3NwcmludGbuBBJqZF9kZXZpY2Vfc2hvcnRfaWTvBAxqZF9zcHJpbnRmX2HwBAtqZF90b19oZXhfYfEECWpkX3N0cmR1cPIECWpkX21lbWR1cPMEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWX0BBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVl9QQRamRfc2VuZF9ldmVudF9leHT2BApqZF9yeF9pbml09wQUamRfcnhfZnJhbWVfcmVjZWl2ZWT4BB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja/kED2pkX3J4X2dldF9mcmFtZfoEE2pkX3J4X3JlbGVhc2VfZnJhbWX7BBFqZF9zZW5kX2ZyYW1lX3Jhd/wEDWpkX3NlbmRfZnJhbWX9BApqZF90eF9pbml0/gQHamRfc2VuZP8EFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOABQ9qZF90eF9nZXRfZnJhbWWBBRBqZF90eF9mcmFtZV9zZW50ggULamRfdHhfZmx1c2iDBRBfX2Vycm5vX2xvY2F0aW9uhAUMX19mcGNsYXNzaWZ5hQUFZHVtbXmGBQhfX21lbWNweYcFB21lbW1vdmWIBQZtZW1zZXSJBQpfX2xvY2tmaWxligUMX191bmxvY2tmaWxliwUGZmZsdXNojAUEZm1vZI0FDV9fRE9VQkxFX0JJVFOOBQxfX3N0ZGlvX3NlZWuPBQ1fX3N0ZGlvX3dyaXRlkAUNX19zdGRpb19jbG9zZZEFCF9fdG9yZWFkkgUJX190b3dyaXRlkwUJX19md3JpdGV4lAUGZndyaXRllQUUX19wdGhyZWFkX211dGV4X2xvY2uWBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrlwUGX19sb2NrmAUIX191bmxvY2uZBQ5fX21hdGhfZGl2emVyb5oFCmZwX2JhcnJpZXKbBQ5fX21hdGhfaW52YWxpZJwFA2xvZ50FBXRvcDE2ngUFbG9nMTCfBQdfX2xzZWVroAUGbWVtY21woQUKX19vZmxfbG9ja6IFDF9fb2ZsX3VubG9ja6MFDF9fbWF0aF94Zmxvd6QFDGZwX2JhcnJpZXIuMaUFDF9fbWF0aF9vZmxvd6YFDF9fbWF0aF91Zmxvd6cFBGZhYnOoBQNwb3epBQV0b3AxMqoFCnplcm9pbmZuYW6rBQhjaGVja2ludKwFDGZwX2JhcnJpZXIuMq0FCmxvZ19pbmxpbmWuBQpleHBfaW5saW5lrwULc3BlY2lhbGNhc2WwBQ1mcF9mb3JjZV9ldmFssQUFcm91bmSyBQZzdHJjaHKzBQtfX3N0cmNocm51bLQFBnN0cmNtcLUFBnN0cmxlbrYFB19fdWZsb3e3BQdfX3NobGltuAUIX19zaGdldGO5BQdpc3NwYWNlugUGc2NhbGJuuwUJY29weXNpZ25svAUHc2NhbGJubL0FDV9fZnBjbGFzc2lmeWy+BQVmbW9kbL8FBWZhYnNswAULX19mbG9hdHNjYW7BBQhoZXhmbG9hdMIFCGRlY2Zsb2F0wwUHc2NhbmV4cMQFBnN0cnRveMUFBnN0cnRvZMYFEl9fd2FzaV9zeXNjYWxsX3JldMcFCGRsbWFsbG9jyAUGZGxmcmVlyQUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXplygUEc2Jya8sFCF9fYWRkdGYzzAUJX19hc2hsdGkzzQUHX19sZXRmMs4FB19fZ2V0ZjLPBQhfX2RpdnRmM9AFDV9fZXh0ZW5kZGZ0ZjLRBQ1fX2V4dGVuZHNmdGYy0gULX19mbG9hdHNpdGbTBQ1fX2Zsb2F0dW5zaXRm1AUNX19mZV9nZXRyb3VuZNUFEl9fZmVfcmFpc2VfaW5leGFjdNYFCV9fbHNocnRpM9cFCF9fbXVsdGYz2AUIX19tdWx0aTPZBQlfX3Bvd2lkZjLaBQhfX3N1YnRmM9sFDF9fdHJ1bmN0ZmRmMtwFC3NldFRlbXBSZXQw3QULZ2V0VGVtcFJldDDeBQlzdGFja1NhdmXfBQxzdGFja1Jlc3RvcmXgBQpzdGFja0FsbG9j4QUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudOIFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXkBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl5QUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k5gUMZHluQ2FsbF9qaWpp5wUWbGVnYWxzdHViJGR5bkNhbGxfamlqaegFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAeYFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
function em_flash_save(start,size) { if (Module.flashSave) Module.flashSave(HEAPU8.slice(start, start + size)); }
function em_flash_load(start,size) { if (Module.flashLoad) { const data = Module.flashLoad(); if (Module.dmesg) Module.dmesg("flash load, size=" + data.length); HEAPU8.set(data.slice(0, size), start); } }
function em_send_frame(frame) { const sz = 12 + HEAPU8[frame + 2]; const pkt = HEAPU8.slice(frame, frame + sz); Module.sendPacket(pkt) }
function _devs_panic_handler(exitcode) { if (exitcode) console.log("PANIC", exitcode); if (Module.panicHandler) Module.panicHandler(exitcode); }
function em_deploy_handler(exitcode) { if (Module.deployHandler) Module.deployHandler(exitcode); }
function em_time_now() { return Date.now(); }
function em_jd_crypto_get_random(trg,size) { let buf = new Uint8Array(size); if (typeof window == "object" && window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf); else { buf = require("crypto").randomBytes(size); } HEAPU8.set(buf, trg); }
function em_print_dmesg(ptr) { const s = UTF8ToString(ptr, 1024); if (Module.dmesg) Module.dmesg(s); else console.debug(s); }




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
  "em_deploy_handler": em_deploy_handler,
  "em_flash_load": em_flash_load,
  "em_flash_save": em_flash_save,
  "em_jd_crypto_get_random": em_jd_crypto_get_random,
  "em_print_dmesg": em_print_dmesg,
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
var _malloc = Module["_malloc"] = createExportWrapper("malloc");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

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

var ___start_em_js = Module['___start_em_js'] = 25984;
var ___stop_em_js = Module['___stop_em_js'] = 27037;



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
