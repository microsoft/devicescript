
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+KFgIAA4AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAABQICAgADAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEBBQMACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAQEBAQIEBAEKDQICAAAHCQkBAwcBAgAIAAIGAAcJCAQABAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXAB0wHTAQWGgICAAAEBgAKAAgbdgICAAA5/AUHw7gULfwFBAAt/AUEAC38BQQALfwBB8MwBC38AQd/NAQt/AEGpzwELfwBBpdABC38AQaHRAQt/AEHx0QELfwBBktIBC38AQZfUAQt/AEHwzAELfwBBjdUBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MA1QUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAJEFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlANYFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAmQUVZW1zY3JpcHRlbl9zdGFja19pbml0APAFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA8QUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQDyBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA8wUJc3RhY2tTYXZlAOwFDHN0YWNrUmVzdG9yZQDtBQpzdGFja0FsbG9jAO4FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA7wUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlqaQD1BQmbg4CA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QCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQyQQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDCBBogAyAAKAIELQAOOgAKIAMoAhAPC0G8yABBnDtBMUHNNRD3BAAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahD7Ag0AIAMgASkDADcDGAJAAkAgACADQRhqEKYCIgINACADIAEpAwA3AxAgACADQRBqEKUCIQEMAQsCQCAAIAIQpwIiAQ0AQQAhAQwBCwJAIAAgAhCTAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAENYCIANBKGogACAEELwCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBjC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQjgIgAWohAgwBCyAAIAJBAEEAEI4CIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEJ4CIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ8AIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNLDQIgASAFNgIAIAFBBToACgwDCwJAAkAgBA0AQQAhBQwBCyAELQADQQ9xIQULAkAgBUF8ag4GAAICAgIAAgsgASAENgIAIAFB0gA6AAogAyACKQMANwMo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AEEgayIBJAAgASAAKQNQIgc3AwggASAHNwMYAkACQCAAIAFBCGoQ+QJFDQAgASgCGCECDAELIAEgASkDGDcDACABQRBqIABBDyABEOkCQQAhAgsgAiIDLwEIIQJBACEEAkAgAC0AQ0F/aiIFRQ0AIABBABCyAiEECyAEIgRBH3UgAnEgBGoiBEEAIARBAEobIQQgAiEGAkAgBUECSQ0AIAIhBiAAQeAAaikDAFANACAAQQEQsgIhBgsCQCAAIAYiBkEfdSACcSAGaiIGIAIgBiACSBsiAiAEIAIgBCACSBsiBGsiBhCSASICRQ0AIAIoAgwgAygCDCAEQQN0aiAGQQN0EJQFGgsgACACELcCIAFBIGokAAsTACAAIAAgAEEAELICEJMBELcCC4oBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMgAkACQAJAIAEgA0EYahD0Ag0AIAMgAykDIDcDECADQShqIAFBEiADQRBqEOkCDAELIAMgAykDIDcDCCABIANBCGogA0EoahD2AkUNACAAIAMoAigQ7gIMAQsgAEIANwMACyADQTBqJAALnQECAn8BfiMAQTBrIgEkACABIAApA1AiAzcDECABIAM3AyACQAJAIAAgAUEQahD0Ag0AIAEgASkDIDcDCCABQShqIABBEiABQQhqEOkCQQAhAgwBCyABIAEpAyA3AwAgACABIAFBKGoQ9gIhAgsCQCACIgJFDQAgAUEYaiAAIAIgASgCKBDZAiAAKAKsASABKQMYNwMgCyABQTBqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahD1Ag0AIAEgASkDIDcDECABQShqIABByhogAUEQahDqAkEAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEPYCIQILAkAgAiIDRQ0AIABBABCyAiECIABBARCyAiEEIABBAhCyAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQlgUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQ9QINACABIAEpA1A3AzAgAUHYAGogAEHKGiABQTBqEOoCQQAhAgwBCyABIAEpA1A3Aygg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QShqIANBIGoQrgIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEJcCIAMgACkDADcDECABIANBEGoQjwELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQngIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEOkCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8B0MgBTg0CIABBkOMAIAFBA3RqLwEAENYCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQZ0TQZ85QTFB/SoQ9wQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ+wINACABQThqIABBmhkQ6AILIAEgASkDSDcDICABQThqIAAgAUEgahDaAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI4BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqENUCIgJFDQAgAUEwaiAAIAIgASgCOEEBEIYCIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjwEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECELICIQIgASABKQMgNwMIAkAgAUEIahD7Ag0AIAFBGGogAEH0GhDoAgsgASABKQMoNwMAIAFBEGogACABIAJBARCMAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ8QKbELQCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPECnBC0AgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDxAhC/BRC0AgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxDuAgsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQ8QIiBEQAAAAAAAAAAGNFDQAgACAEmhC0AgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABDrBLhEAAAAAAAA8D2iELQCC2QBBX8CQAJAIABBABCyAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEOsEIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQtQILEQAgACAAQQAQswIQqgUQtAILGAAgACAAQQAQswIgAEEBELMCELYFELQCCy4BA38gAEEAELICIQFBACECAkAgAEEBELICIgNFDQAgASADbSECCyAAIAIQtQILLgEDfyAAQQAQsgIhAUEAIQICQCAAQQEQsgIiA0UNACABIANvIQILIAAgAhC1AgsWACAAIABBABCyAiAAQQEQsgJsELUCCwkAIABBARDLAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahDyAiEDIAIgAikDIDcDECAAIAJBEGoQ8gIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEPECIQYgAiACKQMgNwMAIAAgAhDxAiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA/BqNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAEMsBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcD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ICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7gIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7wIgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEPACIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahD4AiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB4i9BABDmAkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahD6AiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSRJDQAgAEIANwMADwsCQCABIAIQjwIiA0HQ3gBrQQxtQSNLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEPACC/8BAQJ/IAIhAwNAAkAgAyICQdDeAGtBDG0iA0EjSw0AAkAgASADEI8CIgJB0N4Aa0EMbUEjSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhDwAg8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQY3SAEHIN0G8CEGeKBD3BAALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQdDeAGtBDG1BJEkNAQsLIAAgAUEIIAIQ8AILJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBq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zNsBIAEgAGohASADIABrIQICQCAJIABHDQBB1NsBQYjbARDKAkEAQcAANgLM2wFBAEGI2wE2AsjbASACIQMgASEBIAINAQwCC0EAQQAoAsjbASAAajYCyNsBIAIhAyABIQEgAg0ACwsgCBDQAiAIQSAQzwICQCAFRQ0AQQBBACgC0NsBIAVqNgLQ2wEgBSEDIAQhAQNAIAEhASADIQMCQEEAKALM2wEiAEHAAEcNACADQcAASQ0AQdTbASABEMoCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjbASABIAMgACADIABJGyIAEJQFGkEAQQAoAszbASIJIABrNgLM2wEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU2wFBiNsBEMoCQQBBwAA2AszbAUEAQYjbATYCyNsBIAIhAyABIQEgAg0BDAILQQBBACgCyNsBIABqNgLI2wEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALQ2wEgB2o2AtDbASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAszbASIAQcAARw0AIANBwABJDQBB1NsBIAEQygIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCyNsBIAEgAyAAIAMgAEkbIgAQlAUaQQBBACgCzNsBIgkgAGs2AszbASABIABqIQEgAyAAayECAkAgCSAARw0AQdTbAUGI2wEQygJBAEHAADYCzNsBQQBBiNsBNgLI2wEgAiEDIAEhASACDQEMAgtBAEEAKALI2wEgAGo2AsjbASACIQMgASEBIAINAAsLQQBBACgC0NsBQQFqNgLQ2wFBASEDQYnWACEBAkADQCABIQEgAyEDAkBBACgCzNsBIgBBwABHDQAgA0HAAEkNAEHU2wEgARDKAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALI2wEgASADIAAgAyAASRsiABCUBRpBAEEAKALM2wEiCSAAazYCzNsBIAEgAGohASADIABrIQICQCAJIABHDQBB1NsBQYjbARDKAkEAQcAANgLM2wFBAEGI2wE2AsjbASACIQMgASEBIAINAQwCC0EAQQAoAsjbASAAajYCyNsBIAIhAyABIQEgAg0ACwsgCBDQAguuBwIIfwF+IwBBgAFrIggkAAJAIARFDQAgA0EAOgAACyAHIQdBACEJQQAhCgNA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AwtBBSEEDAILQbM7QbACQfolEPIEAAtB3wMgAUH//wNxdkEBcUUNASABQQJ0QYjrAGooAgAhBAsgAkEQaiQAIAQPC0GzO0GjAkH6JRDyBAALEQAgACgCBEUgACgCAEEESXELJAEBf0EAIQECQCAAKAIEDQAgACgCACIARSAAQQNGciEBCyABC2sBAn8jAEEQayIDJAACQAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEP4CIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqENMCDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqENMCRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahDVAiECIAMgAykDMDcDCCAAIANBCGogA0E4ahDVAiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEK4FRSEBCyABIQELIAEhBAsgA0HAAGokACAEC1kAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0GEwABBsztB9QJBmjUQ9wQAC0GswABBsztB9gJBmjUQ9wQAC4wBAQF/QQAhAgJAIAFB//8DSw0AQZQBIQICQAJAAkACQAJAAkAgAUEOdg4EAwUAAQILIAAoAgBBxABqIQJBASEADAMLIAAoAgBBzABqIQJBAyEADAILQfo2QTlBxiIQ8gQACyAAKAIAQdQAaiECQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtuAQJ/IwBBIGsiASQAIAAoAAghABDjBCECIAFBGGogAEH//wNxNgIAIAFBEGogAEEYdjYCACABQRRqIABBEHZB/wFxNgIAIAFBADYCDCABQoaAgIDQADcCBCABIAI2AgBBvzMgARA8IAFBIGokAAuIIQIMfwF+IwBBsARrIgIkAAJAAkACQCAAQQNxDQACQCABQfAATQ0AIAIgADYCqAQC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AQZPDQAgACgCpAEhByACIAVBAWo7AQQgByAFai0AACEHDAELIAFBCGogAEHkABCDAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQeDIASAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCDAQwBCyABIAIgAEHgyAEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQgwEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQ5AILIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQggELIAFBEGokAAskAQF/QQAhAQJAIABBkwFLDQAgAEECdEGw6wBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARCAAw0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBsOsAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRDDBTYCACAFIQEMAgtBvDlBrgJBmscAEPIEAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEIwDIgEhAgJAIAENACADQQhqIABB6AAQgwFBitYAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIMBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEIADDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARB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aiACEO0DIAMgAykDGDcDEAJAAkACQCADQRBqENQCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDxAhDtAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEO0DIANBEGogAhDtAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQrQIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEO0DIAJBIGogARDtAyACQRhqIAEQ7QMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCuAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDtAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQgAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQqwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDtAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQgAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQqwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDtAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQgAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQqwILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgAMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQQAQjwIhBCADIAMpAxA3AwAgACACIAQgAxCpAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgAMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQRUQjwIhBCADIAMpAxA3AwAgACACIAQgAxCpAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEI8CEJABIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEPACIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDuAyIDEJIBIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPACIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDuAyIDEJMBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPACIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBCAAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEIADDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCDAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQgAMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIMBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBCAAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCDAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEO4CC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQgwELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACACQQggAiAEEKECEPACCyADQRBqJAALXwEDfyMAQRBrIgMkACACEO4DIQQgAhDuAyEFIANBCGogAkECEPADAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDtAyADIAMpAwg3AwAgACACIAMQ+gIQ7gIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDtAyAAQeDqAEHo6gAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA+BqNwMACw0AIABBACkD6Go3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ7QMgAyADKQMINwMAIAAgAiADEPMCEO8CIANBEGokAAsNACAAQQApA/BqNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEO0DAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEPECIgREAAAAAAAAAABjRQ0AIAAgBJoQ7QIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkD2Go3AwAMAgsgAEEAIAJrEO4CDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhDvA0F/cxDuAgsyAQF/IwBBEGsiAyQAIANBCGogAhDtAyAAIAMoAgxF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NgIEIAQgADYCAEHEFSAEEDwQHQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwv5CgELfyMAQcAAayIEJAAgACABaiEFIARBf2ohBiAEQQFyIQcgBEECciEIIABBAEchCSACIQEgAyEKIAIhAiAAIQMDQCADIQMgAiECIAohCyABIgpBAWohAQJAAkAgCi0AACIMQSVGDQAgDEUNACABIQEgCyEKIAIhAkEBIQwgAyEDDAELAkACQCACIAFHDQAgAyEDDAELIAJBf3MgAWohDQJAIAUgA2siDkEBSA0AIAMgAiANIA5Bf2ogDiANShsiDhCUBSAOakEAOgAACyADIA1qIQMLIAMhDQJAIAwNACABIQEgCyEKIAIhAkEAIQwgDSEDDAELAkACQCABLQAAQS1GDQAgASEBQQAhAgwBCyAKQQJqIAEgCi0AAkHzAEYiAhshASACIAlxIQILIAIhAiABIg4sAAAhASAEQQA6AAECQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCALKAIAOgAAIAtBBGohAgwMCyAEIQICQAJAIAsoAgAiAUF/TA0AIAEhASACIQIMAQsgBEEtOgAAQQAgAWshASAHIQILIAtBBGohCyACIgwhAiABIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAwgDBDDBWpBf2oiAyECIAwhASADIAxNDQoDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAsLAAsgBCECIAsoAgAhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgC0EEaiEMIAYgBBDDBWoiAyECIAQhASADIARNDQgDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAkLAAsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAkLIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwICyAEIAtBB2pBeHEiASsDAEEIEPoEIAFBCGohAgwHCyALKAIAIgFBhtIAIAEbIgMQwwUhAQJAIAUgDWsiCkEBSA0AIA0gAyABIApBf2ogCiABShsiChCUBSAKakEAOgAACyALQQRqIQogBEEAOgAAIA0gAWohASACRQ0DIAMQIgwDCyAEIAE6AAAMAQsgBEE/OgAACyALIQIMAwsgCiECIAEhAQwDCyAMIQIMAQsgCyECCyANIQELIAIhAiAEEMMFIQMCQCAFIAEiC2siAUEBSA0AIAsgBCADIAFBf2ogASADShsiARCUBSABakEAOgAACyAOQQFqIgwhASACIQogDCECQQEhDCALIANqIQMLIAEhASAKIQogAiECIAMiCyEDIAwNAAsgBEHAAGokACALIABrQQFqC+0IAwN+CH8BfAJAAkAgAUQAAAAAAAAAAGMNACABIQEgACEADAELIABBLToAACABmiEBIABBAWohAAsgACEAAkAgASIBvUL///////////8AgyIDQoGAgICAgID4/wBUDQAgAEHOwrkCNgAADwsCQCADQoCAgICAgID4/wBSDQAgAEHp3JkDNgAADwsCQCABRLDKbkftiRAAY0UNACAAQTA7AAAPCyACQQQgAkEEShsiAkEPSSEGIAFEje21oPfGsD5jIQcCQAJAIAEQrAUiDplEAAAAAAAA4EFjRQ0AIA6qIQgMAQtBgICAgHghCAsgCCEIIAJBDyAGGyECAkACQCAHDQAgAURQ7+LW5BpLRGQNACAIIQZBASEHIAEhAQwB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AyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQlAUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKALs6gFFDQBBACgC7OoBEJkFIQELAkBBACgC6MwBRQ0AQQAoAujMARCZBSABciEBCwJAEK8FKAIA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A0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQ5QUgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEOUFIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABDbBUUNACADIAQQywUhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQ5QUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxDdBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ2wVBAEoNAAJAIAEgCSADIAoQ2wVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ5QUgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEOUFIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABDlBSAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQ5QUgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEOUFIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAE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EGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAqDrAUF/aiIBQX8gARs2AqDrAQsLBwA/AEEQdAtUAQJ/QQAoAuzMASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDXBU0NACAAEBVFDQELQQAgADYC7MwBIAEPCxCRBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ2gVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqENoFQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxDaBSAFQTBqIAogASAHEOQFIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ2gUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ2gUgBSACIARBASAGaxDkBSAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQ4gUOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ4wUaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahDaBUEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqENoFIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEOYFIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEOYFIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEOYFIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEOYFIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEOYFIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEOYFIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEOYFIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEOYFIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEOYFIAVBkAFqIANCD4ZCACAEQgAQ5gUgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABDmBSAFQYABakIBIAJ9QgAgBEIAEOYFIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4Q5gUgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4Q5gUgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxDkBSAFQTBqIBYgEyAGQfAAahDaBSAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxDmBSAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEOYFIAUgAyAOQgVCABDmBSAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ2gUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ2gUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDaBSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDaBSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDaBUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDaBSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhDaBSAFQSBqIAIgBCAGENoFIAVBEGogEiABIAcQ5AUgBSACIAQgBxDkBSAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ2QUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qENoFIAIgACAEQYH4ACADaxDkBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQfDuBSQDQfDuAUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAARDwALJQEBfiAAIAEgAq0gA61CIIaEIAQQ9AUhBSAFQiCIpxDqBSAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwuezYGAAAMAQYAIC7jAAWluZmluaXR5AC1JbmZpbml0eQBkZXZzX3ZlcmlmeQBkZXZzX2pzb25fc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBpc0FycmF5AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAV1NTSy1IOiBzdHJlYW1pbmc6ICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdAB3YWl0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfZ2V0X2J1aWx0aW5fb2JqZWN0AGEgYnVpbHRpbiBmcm96ZW4gb2JqZWN0AHBhcnNlRmxvYXQAZGV2c2Nsb3VkOiBpbnZhbGlkIGNsb3VkIHVwbG9hZCBmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBwcm9nVmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBhc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mAHNlbGYAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAZGV2TmFtZQBwcm9nTmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAFJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABmaWJlciBub3Qgc3VzcGVuZGVkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAqICBwYz0lZCBAID8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19s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ZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAJHygIAABG5hbWUBoXH3BQANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZD2RldnNkYmdfcHJvY2Vzc1oRZGV2c2RiZ19yZXN0YXJ0ZWRbFWRldnNkYmdfaGFuZGxlX3BhY2tldFwLc2VuZF92YWx1ZXNdEXZhbHVlX2Zyb21fdGFnX3YwXhlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXw1vYmpfZ2V0X3Byb3BzYAxleHBhbmRfdmFsdWVhEmRldnNkYmdfc3VzcGVuZF9jYmIMZGV2c2RiZ19pbml0YxBleHBhbmRfa2V5X3ZhbHVlZAZrdl9hZGRlD2RldnNtZ3JfcHJvY2Vzc2YHdHJ5X3J1bmcMc3RvcF9wcm9ncmFtaA9kZXZzbWdyX3Jlc3RhcnRpFGRldnNtZ3JfZGVwbG95X3N0YXJ0ahRkZXZzbWdyX2RlcGxveV93cml0ZWsQZGV2c21ncl9nZXRfaGFzaGwVZGV2c21ncl9oYW5kbGVfcGFja2V0bQ5kZXBsb3lfaGFuZGxlcm4TZGVwbG95X21ldGFfaGFuZGxlcm8PZGV2c21ncl9nZXRfY3R4cA5kZXZzbWdyX2RlcGxveXEMZGV2c21ncl9pbml0chFkZXZzbWdyX2NsaWVudF9ldnMWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHQQZGV2c19maWJlcl95aWVsZHUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udhhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV3EGRldnNfZmliZXJfc2xlZXB4G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHkaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN6EWRldnNfaW1nX2Z1bl9uYW1lexJkZXZzX2ltZ19yb2xlX25hbWV8EmRldnNfZmliZXJfYnlfZmlkeH0RZGV2c19maWJlcl9ieV90YWd+EGRldnNfZmliZXJfc3RhcnR/FGRldnNfZmliZXJfdGVybWlhbnRlgAEOZGV2c19maWJlcl9ydW6BARNkZXZzX2ZpYmVyX3N5bmNfbm93ggEKZGV2c19wYW5pY4MBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYQBD2RldnNfZmliZXJfcG9rZYUBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEUZGV2c192YWx1ZV9pc19waW5uZWSOAQ5kZXZzX3ZhbHVlX3Bpbo8BEGRldnNfdmFsdWVfdW5waW6QARJkZXZzX21hcF90cnlfYWxsb2ORARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OSARRkZXZzX2FycmF5X3RyeV9hbGxvY5MBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5QBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5UBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lgEPZGV2c19nY19zZXRfY3R4lwEOZGV2c19nY19jcmVhdGWYAQ9kZXZzX2djX2Rlc3Ryb3mZARFkZXZzX2djX29ial9jaGVja5oBC3NjYW5fZ2Nfb2JqmwERcHJvcF9BcnJheV9sZW5ndGicARJtZXRoMl9BcnJheV9pbnNlcnSdARJmdW4xX0FycmF5X2lzQXJyYXmeARBtZXRoWF9BcnJheV9wdXNonwEVbWV0aDFfQXJyYXlfcHVzaFJhbmdloAERbWV0aFhfQXJyYXlfc2xpY2WhARFmdW4xX0J1ZmZlcl9hbGxvY6IBEnByb3BfQnVmZmVyX2xlbmd0aKMBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ6QBE21ldGgzX0J1ZmZlcl9maWxsQXSlARNtZXRoNF9CdWZmZXJfYmxpdEF0pgEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCnARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOoARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SpARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSqARdmdW4yX0RldmljZVNjcmlwdF9wcmludKsBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSsARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludK0BGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByrgEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbmevARRtZXRoMV9FcnJvcl9fX2N0b3JfX7ABGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+xARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+yARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7MBD3Byb3BfRXJyb3JfbmFtZbQBEW1ldGgwX0Vycm9yX3ByaW50tQEPcHJvcF9Ec0ZpYmVyX2lktgEUbWV0aDFfRHNGaWJlcl9yZXN1bWW3ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZbgBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmS5ARFmdW4wX0RzRmliZXJfc2VsZroBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0uwEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGW8ARJwcm9wX0Z1bmN0aW9uX25hbWW9AQ9mdW4yX0pTT05fcGFyc2W+ARNmdW4zX0pTT05fc3RyaW5naWZ5vwEOZnVuMV9NYXRoX2NlaWzAAQ9mdW4xX01hdGhfZmxvb3LBAQ9mdW4xX01hdGhfcm91bmTCAQ1mdW4xX01hdGhfYWJzwwEQZnVuMF9NYXRoX3JhbmRvbcQBE2Z1bjFfTWF0aF9yYW5kb21JbnTFAQ1mdW4xX01hdGhfbG9nxgENZnVuMl9NYXRoX3Bvd8cBDmZ1bjJfTWF0aF9pZGl2yAEOZnVuMl9NYXRoX2ltb2TJAQ5mdW4yX01hdGhfaW11bMoBDWZ1bjJfTWF0aF9taW7LAQtmdW4yX21pbm1heMwBDWZ1bjJfTWF0aF9tYXjNARJmdW4yX09iamVjdF9hc3NpZ27OARBmdW4xX09iamVjdF9rZXlzzwETZnVuMV9rZXlzX29yX3ZhbHVlc9ABEmZ1bjFfT2JqZWN0X3ZhbHVlc9EBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m0gEQcHJvcF9QYWNrZXRfcm9sZdMBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLUARNwcm9wX1BhY2tldF9zaG9ydElk1QEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV41gEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTXARFwcm9wX1BhY2tldF9mbGFnc9gBFXByb3BfUGFja2V0X2lzQ29tbWFuZNkBFHByb3BfUGFja2V0X2lzUmVwb3J02gETcHJvcF9QYWNrZXRfcGF5bG9hZNsBE3Byb3BfUGFja2V0X2lzRXZlbnTcARVwcm9wX1BhY2tldF9ldmVudENvZGXdARRwcm9wX1BhY2tldF9pc1JlZ1NldN4BFHByb3BfUGFja2V0X2lzUmVnR2V03wETcHJvcF9QYWNrZXRfcmVnQ29kZeABFHByb3BfUGFja2V0X2lzQWN0aW9u4QEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl4gESZGV2c19nZXRfc3BlY19jb2Rl4wETbWV0aDBfUGFja2V0X2RlY29kZeQBEmRldnNfcGFja2V0X2RlY29kZeUBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZOYBFERzUmVnaXN0ZXJfcmVhZF9jb2505wESZGV2c19wYWNrZXRfZW5jb2Rl6AEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZekBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXqARZwcm9wX0RzUGFja2V0SW5mb19uYW1l6wEWcHJvcF9Ec1BhY2tldEluZm9fY29kZewBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX+0BE3Byb3BfRHNSb2xlX2lzQm91bmTuARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTvARFtZXRoMF9Ec1JvbGVfd2FpdPABEnByb3BfU3RyaW5nX2xlbmd0aPEBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF08gETbWV0aDFfU3RyaW5nX2NoYXJBdPMBEm1ldGgyX1N0cmluZ19zbGljZfQBFGRldnNfamRfZ2V0X3JlZ2lzdGVy9QEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZPYBEGRldnNfamRfc2VuZF9jbWT3ARFkZXZzX2pkX3dha2Vfcm9sZfgBFGRldnNfamRfcmVzZXRfcGFja2V0+QETZGV2c19qZF9wa3RfY2FwdHVyZfoBE2RldnNfamRfc2VuZF9sb2dtc2f7ARJkZXZzX2pkX3Nob3VsZF9ydW78ARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZf0BE2RldnNfamRfcHJvY2Vzc19wa3T+ARRkZXZzX2pkX3JvbGVfY2hhbmdlZP8BEmRldnNfamRfaW5pdF9yb2xlc4ACEmRldnNfamRfZnJlZV9yb2xlc4ECFWRldnNfc2V0X2dsb2JhbF9mbGFnc4ICF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzgwIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzhAIQZGV2c19qc29uX2VzY2FwZYUCFWRldnNfanNvbl9lc2NhcGVfY29yZYYCD2RldnNfanNvbl9wYXJzZYcCCmpzb25fdmFsdWWIAgxwYXJzZV9zdHJpbmeJAg1zdHJpbmdpZnlfb2JqigIKYWRkX2luZGVudIsCD3N0cmluZ2lmeV9maWVsZIwCE2RldnNfanNvbl9zdHJpbmdpZnmNAhFwYXJzZV9zdHJpbmdfY29yZY4CEWRldnNfbWFwbGlrZV9pdGVyjwIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SQAhJkZXZzX21hcF9jb3B5X2ludG+RAgxkZXZzX21hcF9zZXSSAgZsb29rdXCTAhNkZXZzX21hcGxpa2VfaXNfbWFwlAIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzlQIRZGV2c19hcnJheV9pbnNlcnSWAghrdl9hZGQuMZcCEmRldnNfc2hvcnRfbWFwX3NldJgCD2RldnNfbWFwX2RlbGV0ZZkCEmRldnNfc2hvcnRfbWFwX2dldJoCF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0mwIOZGV2c19yb2xlX3NwZWOcAhJkZXZzX2Z1bmN0aW9uX2JpbmSdAhFkZXZzX21ha2VfY2xvc3VyZZ4CDmRldnNfZ2V0X2ZuaWR4nwITZGV2c19nZXRfZm5pZHhfY29yZaACHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZKECE2RldnNfZ2V0X3JvbGVfcHJvdG+iAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnejAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSkAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+lAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+mAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bacCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+oAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSpAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSqAhBkZXZzX2luc3RhbmNlX29mqwIPZGV2c19vYmplY3RfZ2V0rAIMZGV2c19zZXFfZ2V0rQIMZGV2c19hbnlfZ2V0rgIMZGV2c19hbnlfc2V0rwIMZGV2c19zZXFfc2V0sAIOZGV2c19hcnJheV9zZXSxAhNkZXZzX2FycmF5X3Bpbl9wdXNosgIMZGV2c19hcmdfaW50swIPZGV2c19hcmdfZG91YmxltAIPZGV2c19yZXRfZG91YmxltQIMZGV2c19yZXRfaW50tgINZGV2c19yZXRfYm9vbLcCD2RldnNfcmV0X2djX3B0crgCEWRldnNfYXJnX3NlbGZfbWFwuQIRZGV2c19zZXR1cF9yZXN1bWW6Ag9kZXZzX2Nhbl9hdHRhY2i7AhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlvAIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlvQISZGV2c19yZWdjYWNoZV9mcmVlvgIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbL8CF2RldnNfcmVnY2FjaGVfbWFya191c2VkwAITZGV2c19yZWdjYWNoZV9hbGxvY8ECFGRldnNfcmVnY2FjaGVfbG9va3VwwgIRZGV2c19yZWdjYWNoZV9hZ2XDAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZcQCEmRldnNfcmVnY2FjaGVfbmV4dMUCD2pkX3NldHRpbmdzX2dldMYCD2pkX3NldHRpbmdzX3NldMcCDmRldnNfbG9nX3ZhbHVlyAIPZGV2c19zaG93X3ZhbHVlyQIQZGV2c19zaG93X3ZhbHVlMMoCDWNvbnN1bWVfY2h1bmvLAg1zaGFfMjU2X2Nsb3NlzAIPamRfc2hhMjU2X3NldHVwzQIQamRfc2hhMjU2X3VwZGF0Zc4CEGpkX3NoYTI1Nl9maW5pc2jPAhRqZF9zaGEyNTZfaG1hY19zZXR1cNACFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaNECDmpkX3NoYTI1Nl9oa2Rm0gIOZGV2c19zdHJmb3JtYXTTAg5kZXZzX2lzX3N0cmluZ9QCDmRldnNfaXNfbnVtYmVy1QIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjWAhNkZXZzX2J1aWx0aW5fc3RyaW5n1wIUZGV2c19zdHJpbmdfdnNwcmludGbYAhNkZXZzX3N0cmluZ19zcHJpbnRm2QIVZGV2c19zdHJpbmdfZnJvbV91dGY42gIUZGV2c192YWx1ZV90b19zdHJpbmfbAhBidWZmZXJfdG9fc3RyaW5n3AIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZN0CEmRldnNfc3RyaW5nX2NvbmNhdN4CEWRldnNfc3RyaW5nX3NsaWNl3wISZGV2c19wdXNoX3RyeWZyYW1l4AIRZGV2c19wb3BfdHJ5ZnJhbWXhAg9kZXZzX2R1bXBfc3RhY2viAhNkZXZzX2R1bXBfZXhjZXB0aW9u4wIKZGV2c190aHJvd+QCEmRldnNfcHJvY2Vzc190aHJvd+UCEGRldnNfYWxsb2NfZXJyb3LmAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LnAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y6AIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y6QIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LqAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTrAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LsAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcu0CFmRldnNfdmFsdWVfZnJvbV9kb3VibGXuAhNkZXZzX3ZhbHVlX2Zyb21faW507wIUZGV2c192YWx1ZV9mcm9tX2Jvb2zwAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcvECFGRldnNfdmFsdWVfdG9fZG91Ymxl8gIRZGV2c192YWx1ZV90b19pbnTzAhJkZXZzX3ZhbHVlX3RvX2Jvb2z0Ag5kZXZzX2lzX2J1ZmZlcvUCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl9gIQZGV2c19idWZmZXJfZGF0YfcCE2RldnNfYnVmZmVyaXNoX2RhdGH4AhRkZXZzX3ZhbHVlX3RvX2djX29iavkCDWRldnNfaXNfYXJyYXn6AhFkZXZzX3ZhbHVlX3R5cGVvZvsCD2RldnNfaXNfbnVsbGlzaPwCGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWT9AhRkZXZzX3ZhbHVlX2FwcHJveF9lcf4CEmRldnNfdmFsdWVfaWVlZV9lcf8CHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY4ADEmRldnNfaW1nX3N0cmlkeF9va4EDEmRldnNfZHVtcF92ZXJzaW9uc4IDC2RldnNfdmVyaWZ5gwMRZGV2c19mZXRjaF9vcGNvZGWEAw5kZXZzX3ZtX3Jlc3VtZYUDEWRldnNfdm1fc2V0X2RlYnVnhgMZZGV2c192bV9jbGVhcl9icmVha3BvaW50c4cDGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludIgDD2RldnNfdm1fc3VzcGVuZIkDFmRldnNfdm1fc2V0X2JyZWFrcG9pbnSKAxRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc4sDGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4jAMRZGV2c19pbWdfZ2V0X3V0ZjiNAxRkZXZzX2dldF9zdGF0aWNfdXRmOI4DD2RldnNfdm1fcm9sZV9va48DFGRldnNfdmFsdWVfYnVmZmVyaXNokAMMZXhwcl9pbnZhbGlkkQMUZXhwcnhfYnVpbHRpbl9vYmplY3SSAwtzdG10MV9jYWxsMJMDC3N0bXQyX2NhbGwxlAMLc3RtdDNfY2FsbDKVAwtzdG10NF9jYWxsM5YDC3N0bXQ1X2NhbGw0lwMLc3RtdDZfY2FsbDWYAwtzdG10N19jYWxsNpkDC3N0bXQ4X2NhbGw3mgMLc3RtdDlfY2FsbDibAxJzdG10Ml9pbmRleF9kZWxldGWcAwxzdG10MV9yZXR1cm6dAwlzdG10eF9qbXCeAwxzdG10eDFfam1wX3qfAwpleHByMl9iaW5koAMSZXhwcnhfb2JqZWN0X2ZpZWxkoQMSc3RtdHgxX3N0b3JlX2xvY2FsogMTc3RtdHgxX3N0b3JlX2dsb2JhbKMDEnN0bXQ0X3N0b3JlX2J1ZmZlcqQDCWV4cHIwX2luZqUDEGV4cHJ4X2xvYWRfbG9jYWymAxFleHByeF9sb2FkX2dsb2JhbKcDC2V4cHIxX3VwbHVzqAMLZXhwcjJfaW5kZXipAw9zdG10M19pbmRleF9zZXSqAxRleHByeDFfYnVpbHRpbl9maWVsZKsDEmV4cHJ4MV9hc2NpaV9maWVsZKwDEWV4cHJ4MV91dGY4X2ZpZWxkrQMQZXhwcnhfbWF0aF9maWVsZK4DDmV4cHJ4X2RzX2ZpZWxkrwMPc3RtdDBfYWxsb2NfbWFwsAMRc3RtdDFfYWxsb2NfYXJyYXmxAxJzdG10MV9hbGxvY19idWZmZXKyAxFleHByeF9zdGF0aWNfcm9sZbMDE2V4cHJ4X3N0YXRpY19idWZmZXK0AxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbme1AxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5ntgMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5ntwMVZXhwcnhfc3RhdGljX2Z1bmN0aW9uuAMNZXhwcnhfbGl0ZXJhbLkDEWV4cHJ4X2xpdGVyYWxfZjY0ugMQZXhwcnhfcm9sZV9wcm90b7sDEWV4cHIzX2xvYWRfYnVmZmVyvAMNZXhwcjBfcmV0X3ZhbL0DDGV4cHIxX3R5cGVvZr4DD2V4cHIwX3VuZGVmaW5lZL8DEmV4cHIxX2lzX3VuZGVmaW5lZMADCmV4cHIwX3RydWXBAwtleHByMF9mYWxzZcIDDWV4cHIxX3RvX2Jvb2zDAwlleHByMF9uYW7EAwlleHByMV9hYnPFAw1leHByMV9iaXRfbm90xgMMZXhwcjFfaXNfbmFuxwMJZXhwcjFfbmVnyAMJZXhwcjFfbm90yQMMZXhwcjFfdG9faW50ygMJZXhwcjJfYWRkywMJZXhwcjJfc3VizAMJZXhwcjJfbXVszQMJZXhwcjJfZGl2zgMNZXhwcjJfYml0X2FuZM8DDGV4cHIyX2JpdF9vctADDWV4cHIyX2JpdF94b3LRAxBleHByMl9zaGlmdF9sZWZ00gMRZXhwcjJfc2hpZnRfcmlnaHTTAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZNQDCGV4cHIyX2Vx1QMIZXhwcjJfbGXWAwhleHByMl9sdNcDCGV4cHIyX25l2AMVc3RtdDFfdGVybWluYXRlX2ZpYmVy2QMUc3RtdHgyX3N0b3JlX2Nsb3N1cmXaAxNleHByeDFfbG9hZF9jbG9zdXJl2wMSZXhwcnhfbWFrZV9jbG9zdXJl3AMQZXhwcjFfdHlwZW9mX3N0ct0DDGV4cHIwX25vd19tc94DFmV4cHIxX2dldF9maWJlcl9oYW5kbGXfAxBzdG10Ml9jYWxsX2FycmF54AMJc3RtdHhfdHJ54QMNc3RtdHhfZW5kX3RyeeIDC3N0bXQwX2NhdGNo4wMNc3RtdDBfZmluYWxseeQDC3N0bXQxX3Rocm935QMOc3RtdDFfcmVfdGhyb3fmAxBzdG10eDFfdGhyb3dfam1w5wMOc3RtdDBfZGVidWdnZXLoAwlleHByMV9uZXfpAxFleHByMl9pbnN0YW5jZV9vZuoDCmV4cHIwX251bGzrAw9leHByMl9hcHByb3hfZXHsAw9leHByMl9hcHByb3hfbmXtAw9kZXZzX3ZtX3BvcF9hcmfuAxNkZXZzX3ZtX3BvcF9hcmdfdTMy7wMTZGV2c192bV9wb3BfYXJnX2kzMvADFmRldnNfdm1fcG9wX2FyZ19idWZmZXLxAxJqZF9hZXNfY2NtX2VuY3J5cHTyAxJqZF9hZXNfY2NtX2RlY3J5cHTzAwxBRVNfaW5pdF9jdHj0Aw9BRVNfRUNCX2VuY3J5cHT1AxBqZF9hZXNfc2V0dXBfa2V59gMOamRfYWVzX2VuY3J5cHT3AxBqZF9hZXNfY2xlYXJfa2V5+AMLamRfd3Nza19uZXf5AxRqZF93c3NrX3NlbmRfbWVzc2FnZfoDE2pkX3dlYnNvY2tfb25fZXZlbnT7AwdkZWNyeXB0/AMNamRfd3Nza19jbG9zZf0DEGpkX3dzc2tfb25fZXZlbnT+AwtyZXNwX3N0YXR1c/8DEndzc2toZWFsdGhfcHJvY2Vzc4AEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlgQQUd3Nza2hlYWx0aF9yZWNvbm5lY3SCBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSDBA9zZXRfY29ubl9zdHJpbmeEBBFjbGVhcl9jb25uX3N0cmluZ4UED3dzc2toZWFsdGhfaW5pdIYEEXdzc2tfc2VuZF9tZXNzYWdlhwQRd3Nza19pc19jb25uZWN0ZWSIBBJ3c3NrX3NlcnZpY2VfcXVlcnmJBBRkZXZzX3RyYWNrX2V4Y2VwdGlvbooEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWLBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xljAQPcm9sZW1ncl9wcm9jZXNzjQQQcm9sZW1ncl9hdXRvYmluZI4EFXJvbGVtZ3JfaGFuZGxlX3BhY2tldI8EFGpkX3JvbGVfbWFuYWdlcl9pbml0kAQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkkQQNamRfcm9sZV9hbGxvY5IEEGpkX3JvbGVfZnJlZV9hbGyTBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5klAQTamRfY2xpZW50X2xvZ19ldmVudJUEE2pkX2NsaWVudF9zdWJzY3JpYmWWBBRqZF9jbGllbnRfZW1pdF9ldmVudJcEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkmAQQamRfZGV2aWNlX2xvb2t1cJkEGGpkX2RldmljZV9sb29rdXBfc2VydmljZZoEE2pkX3NlcnZpY2Vfc2VuZF9jbWSbBBFqZF9jbGllbnRfcHJvY2Vzc5wEDmpkX2RldmljZV9mcmVlnQQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSeBA9qZF9kZXZpY2VfYWxsb2OfBBBzZXR0aW5nc19wcm9jZXNzoAQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKEEDXNldHRpbmdzX2luaXSiBA9qZF9jdHJsX3Byb2Nlc3OjBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSkBAxqZF9jdHJsX2luaXSlBBRkY2ZnX3NldF91c2VyX2NvbmZpZ6YECWRjZmdfaW5pdKcEDWRjZmdfdmFsaWRhdGWoBA5kY2ZnX2dldF9lbnRyeakEDGRjZmdfZ2V0X2kzMqoEDGRjZmdfZ2V0X3UzMqsED2RjZmdfZ2V0X3N0cmluZ6wEDGRjZmdfaWR4X2tlea0ECWpkX3ZkbWVzZ64EEWpkX2RtZXNnX3N0YXJ0cHRyrwQNamRfZG1lc2dfcmVhZLAEEmpkX2RtZXNnX3JlYWRfbGluZbEEE2pkX3NldHRpbmdzX2dldF9iaW6yBA1qZF9mc3Rvcl9pbml0swQTamRfc2V0dGluZ3Nfc2V0X2JpbrQEC2pkX2ZzdG9yX2djtQQPcmVjb21wdXRlX2NhY2hltgQVamRfc2V0dGluZ3NfZ2V0X2xhcmdltwQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZbgEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdluQQWamRfc2V0dGluZ3Nfc3luY19sYXJnZboEDWpkX2lwaXBlX29wZW67BBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0vAQOamRfaXBpcGVfY2xvc2W9BBJqZF9udW1mbXRfaXNfdmFsaWS+BBVqZF9udW1mbXRfd3JpdGVfZmxvYXS/BBNqZF9udW1mbXRfd3JpdGVfaTMywAQSamRfbnVtZm10X3JlYWRfaTMywQQUamRfbnVtZm10X3JlYWRfZmxvYXTCBBFqZF9vcGlwZV9vcGVuX2NtZMMEFGpkX29waXBlX29wZW5fcmVwb3J0xAQWamRfb3BpcGVfaGFuZGxlX3BhY2tldMUEEWpkX29waXBlX3dyaXRlX2V4xgQQamRfb3BpcGVfcHJvY2Vzc8cEFGpkX29waXBlX2NoZWNrX3NwYWNlyAQOamRfb3BpcGVfd3JpdGXJBA5qZF9vcGlwZV9jbG9zZcoEDWpkX3F1ZXVlX3B1c2jLBA5qZF9xdWV1ZV9mcm9udMwEDmpkX3F1ZXVlX3NoaWZ0zQQOamRfcXVldWVfYWxsb2POBA1qZF9yZXNwb25kX3U4zwQOamRfcmVzcG9uZF91MTbQBA5qZF9yZXNwb25kX3UzMtEEEWpkX3Jlc3BvbmRfc3RyaW5n0gQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTTBAtqZF9zZW5kX3BrdNQEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs1QQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLWBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V01wQUamRfYXBwX2hhbmRsZV9wYWNrZXTYBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTZBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXaBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl2wQQamRfc2VydmljZXNfaW5pdNwEDmpkX3JlZnJlc2hfbm933QQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZN4EFGpkX3NlcnZpY2VzX2Fubm91bmNl3wQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXgBBBqZF9zZXJ2aWNlc190aWNr4QQVamRfcHJvY2Vzc19ldmVyeXRoaW5n4gQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXjBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l5AQUYXBwX2dldF9kZXZpY2VfY2xhc3PlBBJhcHBfZ2V0X2Z3X3ZlcnNpb27mBA1qZF9zcnZjZmdfcnVu5wQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXoBBFqZF9zcnZjZmdfdmFyaWFudOkEDWpkX2hhc2hfZm52MWHqBAxqZF9kZXZpY2VfaWTrBAlqZF9yYW5kb23sBAhqZF9jcmMxNu0EDmpkX2NvbXB1dGVfY3Jj7gQOamRfc2hpZnRfZnJhbWXvBAxqZF93b3JkX21vdmXwBA5qZF9yZXNldF9mcmFtZfEEEGpkX3B1c2hfaW5fZnJhbWXyBA1qZF9wYW5pY19jb3Jl8wQTamRfc2hvdWxkX3NhbXBsZV9tc/QEEGpkX3Nob3VsZF9zYW1wbGX1BAlqZF90b19oZXj2BAtqZF9mcm9tX2hlePcEDmpkX2Fzc2VydF9mYWls+AQHamRfYXRvafkEC2pkX3ZzcHJpbnRm+gQPamRfcHJpbnRfZG91Ymxl+wQKamRfc3ByaW50ZvwEEmpkX2RldmljZV9zaG9ydF9pZP0EDGpkX3NwcmludGZfYf4EC2pkX3RvX2hleF9h/wQJamRfc3RyZHVwgAUJamRfbWVtZHVwgQUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYIFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWDBRFqZF9zZW5kX2V2ZW50X2V4dIQFCmpkX3J4X2luaXSFBRRqZF9yeF9mcmFtZV9yZWNlaXZlZIYFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrhwUPamRfcnhfZ2V0X2ZyYW1liAUTamRfcnhfcmVsZWFzZV9mcmFtZYkFEWpkX3NlbmRfZnJhbWVfcmF3igUNamRfc2VuZF9mcmFtZYsFCmpkX3R4X2luaXSMBQdqZF9zZW5kjQUWamRfc2VuZF9mcmFtZV93aXRoX2NyY44FD2pkX3R4X2dldF9mcmFtZY8FEGpkX3R4X2ZyYW1lX3NlbnSQBQtqZF90eF9mbHVzaJEFEF9fZXJybm9fbG9jYXRpb26SBQxfX2ZwY2xhc3NpZnmTBQVkdW1teZQFCF9fbWVtY3B5lQUHbWVtbW92ZZYFBm1lbXNldJcFCl9fbG9ja2ZpbGWYBQxfX3VubG9ja2ZpbGWZBQZmZmx1c2iaBQRmbW9kmwUNX19ET1VCTEVfQklUU5wFDF9fc3RkaW9fc2Vla50FDV9fc3RkaW9fd3JpdGWeBQ1fX3N0ZGlvX2Nsb3NlnwUIX190b3JlYWSgBQlfX3Rvd3JpdGWhBQlfX2Z3cml0ZXiiBQZmd3JpdGWjBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja6QFFl9fcHRocmVhZF9tdXRleF91bmxvY2ulBQZfX2xvY2umBQhfX3VubG9ja6cFDl9fbWF0aF9kaXZ6ZXJvqAUKZnBfYmFycmllcqkFDl9fbWF0aF9pbnZhbGlkqgUDbG9nqwUFdG9wMTasBQVsb2cxMK0FB19fbHNlZWuuBQZtZW1jbXCvBQpfX29mbF9sb2NrsAUMX19vZmxfdW5sb2NrsQUMX19tYXRoX3hmbG93sgUMZnBfYmFycmllci4xswUMX19tYXRoX29mbG93tAUMX19tYXRoX3VmbG93tQUEZmFic7YFA3Bvd7cFBXRvcDEyuAUKemVyb2luZm5hbrkFCGNoZWNraW50ugUMZnBfYmFycmllci4yuwUKbG9nX2lubGluZbwFCmV4cF9pbmxpbmW9BQtzcGVjaWFsY2FzZb4FDWZwX2ZvcmNlX2V2YWy/BQVyb3VuZMAFBnN0cmNocsEFC19fc3RyY2hybnVswgUGc3RyY21wwwUGc3RybGVuxAUHX191Zmxvd8UFB19fc2hsaW3GBQhfX3NoZ2V0Y8cFB2lzc3BhY2XIBQZzY2FsYm7JBQljb3B5c2lnbmzKBQdzY2FsYm5sywUNX19mcGNsYXNzaWZ5bMwFBWZtb2RszQUFZmFic2zOBQtfX2Zsb2F0c2Nhbs8FCGhleGZsb2F00AUIZGVjZmxvYXTRBQdzY2FuZXhw0gUGc3RydG940wUGc3RydG9k1AUSX193YXNpX3N5c2NhbGxfcmV01QUIZGxtYWxsb2PWBQZkbGZyZWXXBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXYBQRzYnJr2QUIX19hZGR0ZjPaBQlfX2FzaGx0aTPbBQdfX2xldGYy3AUHX19nZXRmMt0FCF9fZGl2dGYz3gUNX19leHRlbmRkZnRmMt8FDV9fZXh0ZW5kc2Z0ZjLgBQtfX2Zsb2F0c2l0ZuEFDV9fZmxvYXR1bnNpdGbiBQ1fX2ZlX2dldHJvdW5k4wUSX19mZV9yYWlzZV9pbmV4YWN05AUJX19sc2hydGkz5QUIX19tdWx0ZjPmBQhfX211bHRpM+cFCV9fcG93aWRmMugFCF9fc3VidGYz6QUMX190cnVuY3RmZGYy6gULc2V0VGVtcFJldDDrBQtnZXRUZW1wUmV0MOwFCXN0YWNrU2F2Ze0FDHN0YWNrUmVzdG9yZe4FCnN0YWNrQWxsb2PvBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW508AUVZW1zY3JpcHRlbl9zdGFja19pbml08QUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfIFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XzBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT0BQxkeW5DYWxsX2ppamn1BRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp9gUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB9AUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 26224;
var ___stop_em_js = Module['___stop_em_js'] = 27277;



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
