
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9SFgIAA0gUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEABQAFBQMCAgMCAgMEAwMDBQIIAAMBAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAoAAgIAAQEBAAEAAAEAAAAKAAECAAEBBAUBAgAAAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGEQICBg4DAwMDBQUDAwMEBAUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAQECBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgEAAQEAAACBwADBwcBAgEAEgMJBwAABAACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAcoBygEFhoCAgAABAYACgAIG3YCAgAAOfwFB8OwFC38BQQALfwFBAAt/AUEAC38AQfDKAQt/AEHfywELfwBBqc0BC38AQaXOAQt/AEGhzwELfwBB8c8BC38AQZLQAQt/AEGX0gELfwBB8MoBC38AQY3TAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAMcFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCDBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDIBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAIsFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADiBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAOMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA5AUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAOUFCXN0YWNrU2F2ZQDeBQxzdGFja1Jlc3RvcmUA3wUKc3RhY2tBbGxvYwDgBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AOEFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA5wUJiYOAgAABAEEBC8kBKjtERUZH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JAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqELsEGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQtAQaIAMgACgCBC0ADjoACiADKAIQDwtBhccAQeM5QTFBlDQQ6QQAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ8AINACADIAEpAwA3AxgCQAJAIAAgA0EYahCbAiICDQAgAyABKQMANwMQIAAgA0EQahCaAiEBDAELAkAgACACEJwCIgENAEEAIQEMAQsCQCAAIAIQiAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDLAiADQShqIAAgBBCxAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQYwtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEIMCIAFqIQIMAQsgACACQQBBABCDAiABaiECCyADQcAAaiQAIAIL4wcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCTAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEOUCIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEF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AkACQAJAIAEgA0EYahDpAg0AIAMgAykDIDcDECADQShqIAFBEiADQRBqEN4CDAELIAMgAykDIDcDCCABIANBCGogA0EoahDrAkUNACAAIAMoAigQ4wIMAQsgAEIANwMACyADQTBqJAALnQECAn8BfiMAQTBrIgEkACABIAApA1AiAzcDECABIAM3AyACQAJAIAAgAUEQahDpAg0AIAEgASkDIDcDCCABQShqIABBEiABQQhqEN4CQQAhAgwBCyABIAEpAyA3AwAgACABIAFBKGoQ6wIhAgsCQCACIgJFDQAgAUEYaiAAIAIgASgCKBDOAiAAKAKsASABKQMYNwMgCyABQTBqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahDqAg0AIAEgASkDIDcDECABQShqIABBtBogAUEQahDfAkEAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEOsCIQILAkAgAiIDRQ0AIABBABCnAiECIABBARCnAiEEIABBAhCnAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQiAUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQ6gINACABIAEpA1A3AzAgAUHYAGogAEG0GiABQTBqEN8CQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEOsCIQILAkAgAiIDRQ0AIABBABCnAiEEIAEgAEHgAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDIAkUNACABIAEpA0A3AwAgACABIAFB2ABqEMoCIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQ6QINACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQ3gJBACECDAELIAEgASkDUDcDCCAAIAFBCGogAUHYAGoQ6wIhAgsgAiECCyACIgVFDQAgAEECEKcCIQIgAEEDEKcCIQAgASgCWCIGIAJNDQAgASAGIAJrIgY2AlggASgCTCIHIARNDQAgASAHIARrIgc2AkwgAyAEaiAFIAJqIAcgBiAAIAYgAEkbIgAgByAASRsQhgUaCyABQeAAaiQACx8BAX8CQCAAQQAQpwIiAUEASA0AIAAoAqwBIAEQdgsLIwEBfyAAQd/UAyAAQQAQpwIiASABQaCrfGpBoat8SRsQgQELCQAgAEEAEIEBC8sBAgd/AX4jAEHgAGsiASQAAkAgAC0AQ0ECSQ0AIAEgAEHYAGopAwAiCDcDWCABIAg3AwggACABQQhqIAFB1ABqEMoCIgJFDQAgACAAIAIgASgCVCABQRBqQcAAIABB4ABqIgMgAC0AQ0F+aiIEQQAQxwIiBUF/aiIGEJIBIgdFDQACQAJAIAVBwQBJDQAgACACIAEoAlQgB0EGaiAFIAMgBEEAEMcCGgwBCyAHQQZqIAFBEGogBhCGBRoLIAAgBxCsAgsgAUHgAGokAAtvAgJ/AX4jAEEgayIBJAAgAEEAEKcCIQIgASAAQeAAaikDACIDNwMYIAEgAzcDCCABQRBqIAAgAUEIahDPAiABIAEpAxAiAzcDGCABIAM3AwAgAEE+IAIgAkH/fmpBgH9JG8AgARDvASABQSBqJAALDgAgACAAQQAQqAIQqQILDwAgACAAQQAQqAKdEKkCC4ACAgJ/AX4jAEHwAGsiASQAIAEgAEHYAGopAwA3A2ggASAAQeAAaikDACIDNwNQIAEgAzcDYAJAAkAgAUHQAGoQ8AJFDQAgASABKQNoNwMQIAEgACABQRBqEL0CNgIAQboWIAEQPAwBCyABIAEpA2A3A0ggAUHYAGogACABQcgAahDPAiABIAEpA1giAzcDYCABIAM3A0AgACABQcAAahCMASABIAEpA2A3AzggACABQThqQQAQygIhAiABIAEpA2g3AzAgASAAIAFBMGoQvQI2AiQgASACNgIgQewWIAFBIGoQPCABIAEpA2A3AxggACABQRhqEI0BCyABQfAAaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQrQIiAkUNAAJAIAIoAgQNACACIABBHBCEAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8gAQywILIAEgASkDCDcDACAAIAJB9gAgARDRAiAAIAIQrAILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEK0CIgJFDQACQCACKAIEDQAgAiAAQSAQhAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfQAEMsCCyABIAEpAwg3AwAgACACQfYAIAEQ0QIgACACEKwCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCtAiICRQ0AAkAgAigCBA0AIAIgAEEeEIQCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHzABDLAgsgASABKQMINwMAIAAgAkH2ACABENECIAAgAhCsAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQrQIiAkUNAAJAIAIoAgQNACACIABBIhCEAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpBhAEQywILIAEgASkDCDcDACAAIAJB9gAgARDRAiAAIAIQrAILIAFBEGokAAtiAQF/IwBBIGsiAyQAIAMgAikDADcDECADQRhqIAEgA0EQakH7ABCVAgJAAkAgAykDGEIAUg0AIABCADcDAAwBCyADIAMpAxg3AwggACABIANBCGpB4wAQlQILIANBIGokAAs1AgF/AX4jAEEQayIBJAAgASAAKQNQIgI3AwAgASACNwMIIAAgARDXAiAAEP4DIAFBEGokAAupAQEDfyMAQRBrIgEkAAJAAkAgAC0AQ0EBSw0AIAFBCGogAEHbI0EAENwCDAELAkAgAEEAEKcCIgJBe2pBe0sNACABQQhqIABByiNBABDcAgwBCyAAIAAtAENBf2oiAzoAQyAAQdgAaiAAQeAAaiADQf8BcUF/aiIDQQN0EIcFGiAAIAMgAhB9IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCTAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB6R4gA0EIahDfAgwBCyAAIAEgASgCoAEgBEH//wNxEI4CIAApAwBCAFINACADQdgAaiABQQggASABQQIQhAIQjgEQ5QIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEIwBIANB0ABqQfsAEMsCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCjAiABKAKgASECIAMgACkD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EL8CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjZASABIAMgACADIABJGyIAEIYFGkEAQQAoAszZASIJIABrNgLM2QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU2QFBiNkBEL8CQQBBwAA2AszZAUEAQYjZATYCyNkBIAIhAyABIQEgAg0BDAILQQBBACgCyNkBIABqNgLI2QEgAiEDIAEhASACDQALCyAIEMUCIAhBIBDEAgJAIAVFDQBBAEEAKALQ2QEgBWo2AtDZASAFIQMgBCEBA0AgASEBIAMhAwJAQQAoAszZASIAQcAARw0AIANBwABJDQBB1NkBIAEQvwIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCyNkBIAEgAyAAIAMgAEkbIgAQhgUaQQBBACgCzNkBIgkgAGs2AszZASABIABqIQEgAyAAayECAkAgCSAARw0AQdTZAUGI2QEQvwJBAEHAADYCzNkBQQBBiNkBNgLI2QEgAiEDIAEhASACDQEMAgtBAEEAKALI2QEgAGo2AsjZASACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAtDZASAHajYC0NkBIAchAyAGIQEDQCABIQEgAyEDAkBBACgCzNkBIgBBwABHDQAgA0HAAEkNAEHU2QEgARC/AiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALI2QEgASADIAAgAyAASRsiABCGBRpBAEEAKALM2QEiCSAAazYCzNkBIAEgAGohASADIABrIQICQCAJIABHDQBB1NkBQYjZARC/AkEAQcAANgLM2QFBAEGI2QE2AsjZASACIQMgASEBIAINAQwCC0EAQQAoAsjZASAAajYCyNkBIAIhAyABIQEgAg0ACwtBAEEAKALQ2QFBAWo2AtDZAUEBIQNBvtUAIQECQANAIAEhASADIQMCQEEAKALM2QEiAEHAAEcNACADQcAASQ0AQdTZASABEL8CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjZASABIAMgACADIABJGyIAEIYFGkEAQQAoAszZASIJIABrNgLM2QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU2QFBiNkBEL8CQQBBwAA2AszZAUEAQYjZATYCyNkBIAIhAyABIQEgAg0BDAILQQBBACgCyNkBIABqNgLI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wAA3AwAMDQsgAEKEgIGAwAA3AwAMDAsgAEKBgIGAwAA3AwAMCwsCQCACQaB/aiIEQSNLDQAgAyAENgIQIAAgAUGHPiADQRBqEM0CDAsLAkAgAkGACEkNACADIAI2AiAgACABQeE8IANBIGoQzQIMCwtBlzlB/gBBoSQQ5AQACyADIAIoAgA2AjAgACABQe08IANBMGoQzQIMCQsgAigCACECIAMgASgCpAE2AkwgAyADQcwAaiACEHk2AkAgACABQZg9IANBwABqEM0CDAgLIAMgASgCpAE2AlwgAyADQdwAaiAEQQR2Qf//A3EQeTYCUCAAIAFBpz0gA0HQAGoQzQIMBwsgAyABKAKkATYCZCADIANB5ABqIARBBHZB//8DcRB5NgJgIAAgAUHAPSADQeAAahDNAgwGCwJAAkAgAigCACIEDQBBACEFDAELIAQtAANBD3EhBQsCQAJAAkACQAJAAkAgBUF9ag4JAAQCBQEFBAMEBQsgAEKPgIGAwAA3AwAMCgsgAEKcgIGAwAA3AwAMCQsgAyACKQMANwNoIAAgASADQegAahDQAgwICyAELwESIQIgAyABKAKkATYChAEgA0GEAWogAhB6IQIgBC8BECEFIAMgBCgCHC8BBDYCeCADIAU2AnQgAyACNgJwIAAgAUHrPSADQfAAahDNAgwHCyAAQqaAgYDAADcDAAwGC0GXOUGiAUGhJBDkBAALIAIoAgBBgIABTw0FIAMgAikDADcDiAEgACABIANBiAFqENACDAQLIAIoAgAhAiADIAEoAqQBNgKcASADIANBnAFqIAIQejYCkAEgACABQbU9IANBkAFqEM0CDAMLIAMgAikDADcDuAEgASADQbgBaiADQcABahCPAiECIAMgASgCpAE2ArQBIANBtAFqIAMoAsABEHohBCACLwEAIQIgAyABKAKkATYCsAEgAyADQbABaiACQQAQgQM2AqQBIAMgBDYCoAEgACABQYo9IANBoAFqEM0CDAILQZc5QbEBQaEkEOQEAAsgAyACKQMANwMIIANBwAFqIAEgA0EIahDmAkEHEOwEIAMgA0HAAWo2AgAgACABQfwXIAMQzQILIANBgAJqJAAPC0GSzgBBlzlBpQFBoSQQ6QQAC3oBAn8jAEEgayIDJAAgAyACKQMANwMQAkAgASADQRBqIANBHGoQ7AIiBA0AQf3CAEGXOUHTAEGQJBDpBAALIAMgBCADKAIcIgJBICACQSBJGxDwBDYCBCADIAI2AgAgACABQZg+Qfk8IAJBIEsbIAMQzQIgA0EgaiQAC7gCAQJ/IwBB0ABrIgQkACAEIAMpAwA3AzAgACAEQTBqEIwBIAQgAykDADcDSAJAAkACQAJAAkACQEEQIAQoAkwiBUEPcSAFQYCAwP8HcRtBfGoOBQEDAwMAAwsgBCgCSCIFRQ0CIAUoAgBBgICA+ABxQYCAgDBGIQUMAQsgBCgCSEH//wBLIQULIAUNAQsgBCAEKQNINwMoIARBwABqIAAgBEEoahDPAiAEIAQpA0A3AyAgACAEQSBqEIwBIAQgBCkDSDcDGCAAIARBGGoQjQEMAQsgBCAEKQNINwNACyADIAQpA0A3AwAgBEEENgI8IAQgAkGAgAFyNgI4IAQgBCkDODcDECAEIAMpAwA3AwggACABIARBEGogBEEIahCGAiAEIAMpAwA3AwAgACAEEI0BIARB0ABqJAALmAkCBn8CfiMAQYABayIEJAAgAykDACEKIAQgAikDACILNwNgIAEgBEHgAGoQjAECQAJAIAsgClEiBQ0AIAQgAykDADcDWCABIARB2ABqEIwBIAQgAikDADcDeAJAAkACQAJAAkACQEEQIAQoAnwiBkEPcSAGQYCAwP8HcRtBfGoOBQEDAwMAAwsgBCgCeCIGRQ0CIAYoAgBBgICA+ABxQYCAgDBGIQYMAQsgBCgCeEH//wBLIQYLIAYNAQsgBCAEKQN4NwNQIARB8ABqIAEgBEHQAGoQzwIgBCAEKQNwNwNIIAEgBEHIAGoQjAEgBCAEKQN4NwNAIAEgBEHAAGoQjQEMAQsgBCAEKQN4NwNwCyACIAQpA3A3AwAgBCADKQMANwN4AkACQAJAAkACQAJAQRAgBCgCfCIGQQ9xIAZBgIDA/wdxG0F8ag4FAQMDAwADCyAEKAJ4IgZFDQIgBigCAEGAgID4AHFBgICAMEYhBgwBCyAEKAJ4Qf//AEshBgsgBg0BCyAEIAQpA3g3AzggBEHwAGogASAEQThqEM8CIAQgBCkDcDcDMCABIARBMGoQjAEgBCAEKQN4NwMoIAEgBEEoahCNAQwBCyAEIAQpA3g3A3ALIAMgBCkDcDcDAAwBCyAEIAIpAwA3A3gCQAJAAkACQAJAAkBBECAEKAJ8IgZBD3EgBkGAgMD/B3EbQXxqDgUBAwMDAAMLIAQoAngiBkUNAiAGKAIAQYCAgPgAcUGAgIAwRiEGDAELIAQoAnhB//8ASyEGCyAGDQELIAQgBCkDeDcDICAEQfAAaiABIARBIGoQzwIgBCAEKQNwNwMYIAEgBEEYahCMASAEIAQpA3g3AxAgASAEQRBqEI0BDAELIAQgBCkDeDcDcAsgAiAEKQNwIgo3AwAgAyAKNwMACyACKAIAIQdBACEGAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACC0EAIQYgB0UNAUEAIQYgBygCAEGAgID4AHFBgICAMEcNASAEIAcvAQQ2AnAgB0EGaiEGDAELQQAhBiAHQYCAAUkNACABIAcgBEHwAGoQggMhBgsgBiEIIAMoAgAhB0EAIQYCQAJAAkBBECADKAIEIglBD3EgCUGAgMD/B3EbQXxqDgUBAgICAAILAkAgBw0AQQAhBgwCC0EAIQYgBygCAEGAgID4AHFBgICAMEcNASAEIAcvAQQ2AmwgB0EGaiEGDAELQQAhBiAHQYCAAUkNACABIAcgBEHsAGoQggMhBgsgBiEGAkACQAJAIAhFDQAgBg0BCyAEQfgAaiABQf4AEIIBIABCADcDAAwBCwJAIAQoAnAiBw0AIAAgAykDADcDAAwBCwJAIAQoAmwiCQ0AIAAgAikDADcDAAwBCwJAIAEgCSAHahCSASIHDQAgAEIANwMADAELIAQoAnAhCSAJIAdBBmogCCAJEIYFaiAGIAQoAmwQhgUaIAAgAUEIIAcQ5QILIAQgAikDADcDCCABIARBCGoQjQECQCAFDQAgBCADKQMANwMAIAEgBBCNAQsgBEGAAWokAAvCAgEEfyMAQRBrIgUkACACKAIAIQZBACEHAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACCwJAIAYNAEEAIQcMAgtBACEHIAYoAgBBgICA+ABxQYCAgDBHDQEgBSAGLwEENgIMIAZBBmohBwwBC0EAIQcgBkGAgAFJDQAgASAGIAVBDGoQggMhBwsCQAJAIAciCA0AIABCADcDAAwBCwJAIAUoAgwiByAEaiIGQQAgBkEAShsgBCAEQQBIGyIEIAcgBCAHSBsgByADaiIEQQAgBEEAShsgAyADQQBIGyIEIAcgBCAHSBsiBGsiA0EASg0AIABCgICBgMAANwMADAELAkAgBA0AIAMgB0cNACAAIAIpAwA3AwAMAQsgACABQQggASAIIARqIAMQkwEQ5QILIAVBEGokAAuTAQEEfyMAQRBrIgMkAAJAIAJFDQBBACEEAkAgACgCECIFLQAOIgZFDQAgACAFLwEIQQN0akEYaiEECyAEIQUCQCAGRQ0AQQAhAAJAA0AgBSAAIgBBAXRqIgQvAQBFDQEgAEEBaiIEIQAgBCAGRg0CDAALAAsgBCACOwEADAELIANBCGogAUH7ABCCAQsgA0EQaiQAC2IBA38CQCAAKAIQIgItAA4iAw0AQQAPCyAAIAIvAQhBA3RqQRhqIQQgAyEAA0ACQCAAIgBBAU4NAEEADwsgAEF/aiICIQAgBCACQQF0aiICLwEAIgNFDQALIAJBADsBACADC78DAQx/IwBBwABrIgIkACACIAEpAwA3AzACQAJAIAAgAkEwahDpAg0AIAIgASkDADcDKCAAQawOIAJBKGoQvAIMAQsgAiABKQMANwMgIAAgAkEgaiACQTxqEOsCIQMgAiACKAI8IgFBAXY2AjwgAUECSQ0AIABBpAFqIQRBACEAA0AgAyAAIgVBAXRqLwEAIQZBACEAAkAgBCgAACIHQSRqKAIAIgFBEEkNACABQQR2IgBBASAAQQFLGyEIIAcgBygCIGohCUEAIQECQANAIAAhCgJAAkAgCSABIgtBBHRqIgwoAgAiDSAGSw0AQQAhACAMIQEgDCgCBCANaiAGTw0BC0EBIQAgCiEBCyABIQEgAEUNASABIQAgC0EBaiIMIQEgDCAIRw0AC0EAIQAMAQsgASEACwJAAkAgACIARQ0AIAAoAgAhASAHKAIgIQwgAiAEKAIANgIcIAJBHGogACAHIAxqa0EEdSIAEHkhDCACIAA2AhggAiAMNgIUIAIgBiABazYCEEGnMSACQRBqEDwMAQsgAiAGNgIAQcTFACACEDwLIAVBAWoiASEAIAEgAigCPEkNAAsLIAJBwABqJAALywIBAn8jAEHgAGsiAiQAIAIgAEGCAmpBIBDwBDYCQEG0FCACQcAAahA8IAIgASkDADcDOEEAIQMCQCAAIAJBOGoQrwJFDQAgAiABKQMANwMwIAJB2ABqIAAgAkEwakHjABCVAgJAAkAgAikDWFBFDQBBACEDDAELIAIgAikDWDcDKCAAQcQeIAJBKGoQvAJBASEDCyADIQMgAiABKQMANwMgIAJB0ABqIAAgAkEgakH2ABCVAgJAAkAgAikDUFBFDQAgAyEDDAELIAIgAikDUDcDGCAAQY0rIAJBGGoQvAIgAiABKQMANwMQIAJByABqIAAgAkEQakHxABCVAgJAIAIpA0hQDQAgAiACKQNINwMIIAAgAkEIahDWAgsgA0EBaiEDCyADIQMLAkAgAw0AIAIgASkDADcDACAAQcQeIAIQvAILIAJB4ABqJAALiAQBBn8jAEHgAGsiAyQAAkACQCAALQBFRQ0AIAMgASkDADcDQCAAQfIKIANBwABqELwCDAELAkAgACgCqAENACADIAEpAwA3A1hBrh5BABA8IABBADoARSADIAMpA1g3AwAgACADENcCIABB5dQDEIEBDAELIABBAToARSAAIAEpAwA3AzggAyABKQMANwM4IAAgA0E4ahCvAiEEIAJBAXENACAERQ0AIAMgASkDADcDMCADQdgAaiAAIANBMGpB8QAQlQIgAykDWEIAUg0AAkACQCAAKAKoASICDQBBACEFDAELIAIhAkEAIQQDQCAEQQFqIgQhBSACKAIMIgYhAiAEIQQgBg0ACwsCQAJAIAAgBSICQRAgAkEQSRsiBUEBdBCRASIHRQ0AAkAgACgCqAEiAkUNACAFRQ0AIAdBDGohCCACIQJBACEEA0AgCCAEIgRBAXRqIAIiAi8BBDsBACACKAIMIgJFDQEgAiECIARBAWoiBiEEIAYgBUkNAAsLIANB0ABqIABBCCAHEOUCDAELIANCADcDUAsgAyADKQNQNwMoIAAgA0EoahCMASADQcgAakHxABDLAiADIAEpAwA3AyAgAyADKQNINwMYIAMgAykDUDcDECAAIANBIGogA0EYaiADQRBqEKMCIAMgAykDUDcDCCAAIANBCGoQjQELIANB4ABqJAAL0AcCDH8BfiMAQRBrIgEkACAAKQM4Ig2nIQICQAJAAkACQCANQiCIpyIDDQAgAkGACEkNACACQQ9xIQQgAkGAeGpBBHYhBQwBCwJAIAAtAEcNAEEAIQRBACEFDAELAkACQCAALQBIRQ0AQQEhBkEAIQcMAQtBASEGQQAhByAALQBJQQNxRQ0AIAAoAqgBIgdBAEchBAJAAkAgBw0AIAQhCAwBCyAEIQQgByEFA0AgBCEJQQAhBwJAIAUiBigCECIELQAOIgVFDQAgBiAELwEIQQN0akEYaiEHCyAHIQggBi8BBCEKAkAgBUUNAEEAIQQgBSEFA0AgBCELAkAgCCAFIgdBf2oiBUEBdGovAQAiBEUNACAGIAQ7AQQgBiAAEPgCQdIARw0AIAYgCjsBBCAJIQggC0EBcQ0CDAQLIAdBAkghBCAFIQUgB0EBSg0ACwsgBiAKOwEEIAYoAgwiB0EARyIGIQQgByEFIAYhCCAHDQALC0EAIQZBAiEHIAhBAXFFDQAgAC0ASSIHQQJxRSEGIAdBHnRBH3VBA3EhBwtBACEEQQAhBSAHIQcgBkUNAQtBAEEDIAUiChshCUF/QQAgChshDCAEIQcCQANAIAchCyAAKAKoASIIRQ0BAkACQCAKRQ0AIAsNACAIIAo7AQQgCyEHQQMhBAwBCwJAAkAgCCgCECIHLQAOIgQNAEEAIQcMAQsgCCAHLwEIQQN0akEYaiEFIAQhBwNAAkAgByIHQQFODQBBACEHDAILIAdBf2oiBCEHIAUgBEEBdGoiBC8BACIGRQ0ACyAEQQA7AQAgBiEHCwJAIAciBw0AAkAgCkUNACABQQhqIABB/AAQggEgCyEHQQMhBAwCCyAIKAIMIQcgACgCrAEgCBB3AkAgB0UNACALIQdBAiEEDAILIAEgAzYCDCABIAI2AghBrh5BABA8IABBADoARSABIAEpAwg3AwAgACABENcCIABB5dQDEIEBIAshB0EDIQQMAQsgCCAHOwEEAkACQAJAAkAgCCAAEPgCQa5/ag4CAAECCyALIAxqIQcgCSEEDAMLIApFDQEgAUEIaiAKIAtBf2oQ9AIgACABKQMINwM4IAAtAEdFDQEgACgC2AEgACgCqAFHDQEgAEEIEP0CDAELIAFBCGogAEH9ABCCASALIQdBAyEEDAELIAshB0EDIQQLIAchByAEQQNHDQALCyAAQQA6AEUgAEEAOgBCAkAgACgCrAEiB0UNACAHIAApAzg3AyALIABCADcDOEEIIQcgAC0AB0UNAQsgACAHEP0CCyABQRBqJAALigEBAX8jAEEgayIFJAACQAJAIAEgASACEIQCEI4BIgINACAAQgA3AwAMAQsgACABQQggAhDlAiAFIAApAwA3AxAgASAFQRBqEIwBIAVBGGogASADIAQQzAIgBSAFKQMYNwMIIAEgAkH2ACAFQQhqENECIAUgACkDADcDACABIAUQjQELIAVBIGokAAtTAQF/IwBBIGsiBCQAIAQgAzYCFCAEQRhqIAFBHiACIAMQ2gICQCAEKQMYUA0AIAQgBCkDGDcDCCABIARBCGpBAhDYAgsgAEIANwMAIARBIGokAAtTAQF/IwBBIGsiBCQAIAQgAzYCFCAEQRhqIAFBICACIAMQ2gICQCAEKQMYUA0AIAQgBCkDGDcDCCABIARBCGpBAhDYAgsgAEIANwMAIARBIGokAAsoAQF/IwBBEGsiAyQAIAMgAjYCACAAIAFBxc4AIAMQ2wIgA0EQaiQAC1ICAX8BfiMAQSBrIgQkACACEIADIQIgBCADKQMAIgU3AxAgBCAFNwMYIAQgASAEQRBqEL0CNgIEIAQgAjYCACAAIAFBhhUgBBDbAiAEQSBqJAALQAEBfyMAQRBrIgQkACAEIAMpAwA3AwggBCABIARBCGoQvQI2AgQgBCACNgIAIAAgAUGGFSAEENsCIARBEGokAAsqAQF/IwBBEGsiAyQAIAMgAhCAAzYCACAAIAFB6iQgAxDcAiADQRBqJAALUwEBfyMAQSBrIgQkACAEIAM2AhQgBEEYaiABQSIgAiADENoCAkAgBCkDGFANACAEIAQpAxg3AwggASAEQQhqQQIQ2AILIABCADcDACAEQSBqJAALwwICAX4EfwJAAkACQAJAIAEQhAUOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIgiKciAyACpyIEcg0AIABCgICAgHA3AwAPCwJAIANBFHZB/w9xIgVB/wdJDQACQAJAIAVBkwhLDQAgBA0CAkAgBUGTCEYNACADQf//P3EgBUGNeGp0DQMLIANB//8/cUGAgMAAckGTCCAFa3YhAwwBCwJAIAVBnghJDQAgBA0CIANBgICAj3xHDQIgAEKAgICAeDcDAA8LIAQgBUHtd2oiBnQNASADQf//P3FBgIDAAHIgBnQgBEGzCCAFa3ZyIQMLIABBfzYCBCAAQQAgAyIDayADIAJCAFMbNgIADwsgACABOQMACxAAIAAgATYCACAAQX82AgQLDwAgAELAAEIBIAEbNwMAC1oAAkAgAw0AIABCADcDAA8LAkACQCACQQhxRQ0AIAEgAxCXAUUNASAAIAM2AgAgACACNgIEDwtBytEAQfo5QdsAQcQZEOkEAAtB5s8AQfo5QdwAQcQZEOkEAAuVAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAIAMNAAJAAkACQAJAAkAgASgCACIBQUBqDgQBBAIDAAtEAAAAAAAAAAAhBCABQX9qDgMFAwUDC0QAAAAAAADwPyEEDAQLRAAAAAAAAPB/IQQMAwtEAAAAAAAA8P8hBAwCC0QAAAAAAAD4fyEEDAELIAIgASkDADcDEAJAIAAgAkEQahDIAkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQygIiASACQRhqEMUFIQQgASACKAIYRw0BC0QAAAAAAAD4fyEECyACQSBqJAAgBAvWAQIBfwF8IwBBEGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDCEEAIQEgACACQQhqEOYCIgO9Qv///////////wCDQoCAgICAgID4/wBWDQACQAJAIAOdRAAAAAAAAPBBEIwFIgNEAAAAAAAA8EGgIAMgA0QAAAAAAAAAAGMbIgNEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQuwAQEBfyMAQSBrIgIkAAJAAkACQAJAIAEoAgRBAWoOAgABAgsgASgCAEEARyEBDAILIAEoAgBBP0shAQwBCyACIAEpAwA3AxACQCAAIAJBEGoQyAJFDQAgAiABKQMANwMIIAAgAkEIaiACQRxqEMoCGiACKAIcQQBHIQEMAQsCQCABQQZqLwEAQfD/AXENAEEBIQEMAQsgASsDAEQAAAAAAAAAAGEhAQsgAkEgaiQAIAELYQECf0EAIQICQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbQXxqDgUBAgICAAILQQAhAiABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYPCyABKAIAQYCAAUkhAgsgAgtsAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiA0F8ag4FAQICAgACC0EAIQIgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgChGIQIMAQsgASgCAEGAgAFJIQILIANBBEcgAnELxAEBAn8CQAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiBEF8ag4FAQMDAwADCyABKAIAIgNFDQIgAygCAEGAgID4AHFBgICAKEYhAwwBCyABKAIAQYCAAUkhAwsgA0UNAAJAAkACQCAEQXxqDgUCAQEBAAELIAEoAgAhAQJAIAJFDQAgAiABLwEENgIACyABQQxqDwtB+jlB0QFBqzwQ5AQACyAAIAEoAgAgAhCCAw8LQa7OAEH6OUHDAUGrPBDpBAAL3QEBAn8jAEEgayIDJAACQAJAAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F8ag4FAQMDAwADCyABKAIAIgRFDQIgBCgCAEGAgID4AHFBgICAKEYhBAwBCyABKAIAQYCAAUkhBAsgBEUNACADIAEpAwA3AxggACADQRhqIAIQ6wIhAQwBCyADIAEpAwA3AxACQCAAIANBEGoQyAJFDQAgAyABKQMANwMIIAAgA0EIaiACEMoCIQEMAQsCQCACDQBBACEBDAELIAJBADYCAEEAIQELIANBIGokACABCyMAQQAgASgCAEEAIAEoAgQiAUEPcUEIRhsgAUGAgMD/B3EbC1IBAX8CQCABKAIEIgJBgIDA/wdxRQ0AQQAPCwJAIAJBD3FBCEYNAEEADwtBACECAkAgASgCACIBRQ0AIAEoAgBBgICA+ABxQYCAgBhGIQILIAILxAMBA38jAEEQayICJAACQAJAAkAgASgCBCIDQX9HDQBBASEEDAELQQEhBAJAAkACQAJAAkACQAJAAkACQEEQIANBD3EgAUEGai8BAEHw/wFxGw4RAAEGAgQCBQcDAgIHBwcHBwkHC0EMIQQCQAJAAkACQCABKAIAIgEORAABAgwDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMBAwICAwtBACEEDAsLQQYhBAwKC0EBIQQMCQtBAiEEIAFBoH9qQSRJDQhBCyEEIAFB/wdLDQhB+jlBiAJBmiUQ5AQAC0EHIQQMBwtBCCEEDAYLAkACQCABKAIAIgENAEF9IQEMAQsgAS0AA0EPcUF9aiEBCyABIgFBCUkNBAwGC0EEQQkgASgCAEGAgAFJGyEEDAQLIAIgASkDADcDCEEIQQIgACACQQhqQQAQjwIvAQJBgCBJGyEEDAMLQQUhBAwCC0H6OUGwAkGaJRDkBAALQd8DIAFB//8DcXZBAXFFDQEgAUECdEHY6QBqKAIAIQQLIAJBEGokACAEDwtB+jlBowJBmiUQ5AQACxEAIAAoAgRFIAAoAgBBBElxCyQBAX9BACEBAkAgACgCBA0AIAAoAgAiAEUgAEEDRnIhAQsgAQtrAQJ/IwBBEGsiAyQAAkACQCABKAIEDQACQCABKAIADgQAAQEAAQsgAigCBA0AQQEhBCACKAIADgQBAAABAAsgAyABKQMANwMIIAMgAikDADcDACAAIANBCGogAxDzAiEECyADQRBqJAAgBAuGAgICfwJ+IwBBwABrIgMkAAJAAkAgASgCBA0AIAEoAgBBAkcNACACKAIEDQBBACEEIAIoAgBBAkYNAQsgAyACKQMAIgU3AzAgAyABKQMAIgY3AyhBASEBAkAgBiAFUQ0AIAMgAykDKDcDIAJAIAAgA0EgahDIAg0AQQAhAQwBCyADIAMpAzA3AxhBACEBIAAgA0EYahDIAkUNACADIAMpAyg3AxAgACADQRBqIANBPGoQygIhAiADIAMpAzA3AwggACADQQhqIANBOGoQygIhBEEAIQECQCADKAI8IgAgAygCOEcNACACIAQgABCgBUUhAQsgASEBCyABIQQLIANBwABqJAAgBAtXAAJAAkAgAkEQTw0AIAFFDQEgAUGAgIAITg0BIABBADYCBCAAIAFBBHQgAnJBgAhqNgIADwtBzT5B+jlB9QJB4TMQ6QQAC0H1PkH6OUH2AkHhMxDpBAALjAEBAX9BACECAkAgAUH//wNLDQBBiAEhAgJAAkACQAJAAkACQCABQQ52DgQDBQABAgsgACgCAEHEAGohAkEBIQAMAwsgACgCAEHMAGohAkEDIQAMAgtBwTVBOUHhIRDkBAALIAAoAgBB1ABqIQJBAyEACyACKAIAIAB2IQILIAFB//8AcSACSSECCyACC20BAn8jAEEgayIBJAAgACgACCEAENUEIQIgAUEYaiAAQf//A3E2AgAgAUEQaiAAQRh2NgIAIAFBFGogAEEQdkH/AXE2AgAgAUEANgIMIAFChoCAgDA3AgQgASACNgIAQYYyIAEQPCABQSBqJAAL8iACDH8BfiMAQbAEayICJAACQAJAAkAgAEEDcQ0AAkAgAUHwAE0NACACIAA2AqgEAkACQCAAKAIAQcTK2ZsFRw0AIAAoAgRBivyp03lGDQELIAJC6Ac3A5AEQfgJIAJBkARqEDxBmHghAAwECwJAIAAoAghBgIBwcUGAgIAwRg0AQaUjQQAQPCAAKAAIIQAQ1QQhASACQfADakEYaiAAQf//A3E2AgAgAkHwA2pBEGogAEEYdjYCACACQYQEaiAAQRB2Qf8BcTYCACACQQA2AvwDIAJChoCAgDA3AvQDIAIgATYC8ANBhjIgAkHwA2oQPCACQpoINwPgA0H4CSACQeADahA8QeZ3IQAMBAtBACEDIABBIGohBEEAIQUDQCAFIQUgAyEGAkACQAJAIAQiBCgCACIDIAFNDQBB6QchBUGXeCEDDAELAkAgBCgCBCIHIANqIAFNDQBB6gchBUGWeCEDDAELAkAgA0EDcUUNAEHrByEFQZV4IQMMAQsCQCAHQQNxRQ0AQewHIQVBlHghAwwBCyAFRQ0BIARBeGoiB0EEaigCACAHKAIAaiADRg0BQfIHIQVBjnghAwsgAiAFNgLQAyACIAQgAGs2AtQDQfgJIAJB0ANqEDwgBiEHIAMhCAwECyAFQQhLIgchAyAEQQhqIQQgBUEBaiIGIQUgByEHIAZBCkcNAAwDCwALQdzOAEHBNUHHAEGTCBDpBAALQZLKAEHBNUHGAEGTCBDpBAALIAghBQJAIAdBAXENACAFIQAMAQsCQCAAQTRqLQAAQQdxRQ0AIAJC84eAgIAGNwPAA0H4CSACQcADahA8QY14IQAMAQsgACAAKAIwaiIEIAQgACgCNGoiA0khBwJAAkAgBCADSQ0AIAchAyAFIQcMAQsgByEGIAUhCCAEIQkDQCAIIQUgBiEDAkACQCAJIgYpAwAiDkL/////b1gNAEELIQQgBSEFDAELAkACQCAOQv///////////wCDQoCAgICAgID4/wBYDQBBkwghBUHtdyEHDAELIAJBoARqIA6/EOICQQAhBCAFIQUgAikDoAQgDlENAUGUCCEFQex3IQcLIAJBMDYCtAMgAiAFNgKwA0H4CSACQbADahA8QQEhBCAHIQULIAMhAyAFIgUhBwJAIAQODAACAgICAgICAgICAAILIAZBCGoiAyAAIAAoAjBqIAAoAjRqSSIEIQYgBSEIIAMhCSAEIQMgBSEHIAQNAAsLIAchBQJAIANBAXFFDQAgBSEADAELAkAgAEEkaigCAEGA6jBJDQAgAkKjiICAgAY3A6ADQfgJIAJBoANqEDxB3XchAAwBCyAAIAAoAiBqIgQgBCAAKAIkaiIDSSEHAkACQCAEIANJDQAgByEBQTAhBCAFIQUMAQsCQAJAAkACQCAELwEIIAQtAApPDQAgByEKQTAhCwwBCyAEQQpqIQggBCEEIAAoAighBiAFIQkgByEDA0AgAyEMIAkhDSAGIQYgCCEKIAQiBSAAayEJAkAgBSgCACIEIAFNDQAgAiAJNgL0ASACQekHNgLwAUH4CSACQfABahA8IAwhASAJIQRBl3ghBQwFCwJAIAUoAgQiAyAEaiIHIAFNDQAgAiAJNgKEAiACQeoHNgKAAkH4CSACQYACahA8IAwhASAJIQRBlnghBQwFCwJAIARBA3FFDQAgAiAJNgKUAyACQesHNgKQA0H4CSACQZADahA8IAwhASAJIQRBlXghBQwFCwJAIANBA3FFDQAgAiAJNgKEAyACQewHNgKAA0H4CSACQYADahA8IAwhASAJIQRBlHghBQwFCwJAAkAgACgCKCIIIARLDQAgBCAAKAIsIAhqIgtNDQELIAIgCTYClAIgAkH9BzYCkAJB+AkgAkGQAmoQPCAMIQEgCSEEQYN4IQUMBQsCQAJAIAggB0sNACAHIAtNDQELIAIgCTYCpAIgAkH9BzYCoAJB+AkgAkGgAmoQPCAMIQEgCSEEQYN4IQUMBQsCQCAEIAZGDQAgAiAJNgL0AiACQfwHNgLwAkH4CSACQfACahA8IAwhASAJIQRBhHghBQwFCwJAIAMgBmoiB0GAgARJDQAgAiAJNgLkAiACQZsINgLgAkH4CSACQeACahA8IAwhASAJIQRB5XchBQwFCyAFLwEMIQQgAiACKAKoBDYC3AICQCACQdwCaiAEEPUCDQAgAiAJNgLUAiACQZwINgLQAkH4CSACQdACahA8IAwhASAJIQRB5HchBQwFCwJAIAUtAAsiBEEDcUECRw0AIAIgCTYCtAIgAkGzCDYCsAJB+AkgAkGwAmoQPCAMIQEgCSEEQc13IQUMBQsgDSEDAkAgBEEFdMBBB3UgBEEBcWsgCi0AAGpBf0oiBA0AIAIgCTYCxAIgAkG0CDYCwAJB+AkgAkHAAmoQPEHMdyEDCyADIQ0gBEUNAiAFQRBqIgQgACAAKAIgaiAAKAIkaiIGSSEDAkAgBCAGSQ0AIAMhAQwECyADIQogCSELIAVBGmoiDCEIIAQhBCAHIQYgDSEJIAMhAyAFQRhqLwEAIAwtAABPDQALCyACIAsiBTYC5AEgAkGmCDYC4AFB+AkgAkHgAWoQPCAKIQEgBSEEQdp3IQUMAgsgDCEBCyAJIQQgDSEFCyAFIQcgBCEIAkAgAUEBcUUNACAHIQAMAQsCQCAAQdwAaigCACIBIAAgACgCWGoiBGpBf2otAABFDQAgAiAINgLUASACQaMINgLQAUH4CSACQdABahA8Qd13IQAMAQsCQCAAQcwAaigCACIFQQBMDQAgACAAKAJIaiIDIAVqIQYgAyEFA0ACQCAFIgUoAgAiAyABSQ0AIAIgCDYCxAEgAkGkCDYCwAFB+AkgAkHAAWoQPEHcdyEADAMLAkAgBSgCBCADaiIDIAFJDQAgAiAINgK0ASACQZ0INgKwAUH4CSACQbABahA8QeN3IQAMAwsCQCAEIANqLQAADQAgBUEIaiIDIQUgAyAGTw0CDAELCyACIAg2AqQBIAJBngg2AqABQfgJIAJBoAFqEDxB4nchAAwBCwJAIABB1ABqKAIAIgVBAEwNACAAIAAoAlBqIgMgBWohBiADIQUDQAJAIAUiBSgCACIDIAFJDQAgAiAINgKUASACQZ8INgKQAUH4CSACQZABahA8QeF3IQAMAwsCQCAFKAIEIANqIAFPDQAgBUEIaiIDIQUgAyAGTw0CDAELCyACIAg2AoQBIAJBoAg2AoABQfgJIAJBgAFqEDxB4HchAAwBCwJAAkAgACAAKAJAaiIBIAEgAEHEAGooAgBqSSIFDQAgBSENIAchAQwBCyAFIQMgByEHIAEhBgNAIAchDSADIQogBiIJLwEAIgMhAQJAIAAoAlwiBiADSw0AIAIgCDYCdCACQaEINgJwQfgJIAJB8ABqEDwgCiENQd93IQEMAgsCQANAAkAgASIBIANrQcgBSSIHDQAgAiAINgJkIAJBogg2AmBB+AkgAkHgAGoQPEHedyEBDAILAkAgBCABai0AAEUNACABQQFqIgUhASAFIAZJDQELCyANIQELIAEhAQJAIAdFDQAgCUECaiIFIAAgACgCQGogACgCRGoiCUkiDSEDIAEhByAFIQYgDSENIAEhASAFIAlPDQIMAQsLIAohDSABIQELIAEhAQJAIA1BAXFFDQAgASEADAELAkACQCAAIAAoAjhqIgUgBSAAQTxqKAIAakkiBA0AIAQhCSAIIQQgASEFDAELIAQhAyABIQcgBSEGA0AgByEFIAMhCCAGIgEgAGshBAJAAkACQCABKAIAQRx2QX9qQQFNDQBBkAghBUHwdyEHDAELIAEvAQQhByACIAIoAqgENgJcQQEhAyAFIQUgAkHcAGogBxD1Ag0BQZIIIQVB7nchBwsgAiAENgJUIAIgBTYCUEH4CSACQdAAahA8QQAhAyAHIQULIAUhBQJAIANFDQAgAUEIaiIBIAAgACgCOGogACgCPGoiCEkiCSEDIAUhByABIQYgCSEJIAQhBCAFIQUgASAITw0CDAELCyAIIQkgBCEEIAUhBQsgBSEBIAQhBQJAIAlBAXFFDQAgASEADAELIAAvAQ4iBEEARyEDAkACQCAEDQAgAyEJIAUhBiABIQEMAQsgACAAKAJgaiENIAMhBCABIQNBACEHA0AgAyEGIAQhCCANIAciBEEEdGoiASAAayEFAkACQAJAIAFBEGogACAAKAJgaiAAKAJkIgNqSQ0AQbIIIQFBznchBwwBCwJAAkACQCAEDgIAAQILAkAgASgCBEHz////AUYNAEGnCCEBQdl3IQcMAwsgBEEBRw0BCyABKAIEQfL///8BRg0AQagIIQFB2HchBwwBCwJAIAEvAQpBAnQiByADSQ0AQakIIQFB13chBwwBCwJAIAEvAQhBA3QgB2ogA00NAEGqCCEBQdZ3IQcMAQsgAS8BACEDIAIgAigCqAQ2AkwCQCACQcwAaiADEPUCDQBBqwghAUHVdyEHDAELAkAgAS0AAkEOcUUNAEGsCCEBQdR3IQcMAQsCQAJAIAEvAQhFDQAgDSAHaiEMIAYhCUEAIQoMAQtBASEDIAUhBSAGIQcMAgsDQCAJIQcgDCAKIgpBA3RqIgUvAQAhAyACIAIoAqgENgJIIAUgAGshBgJAAkAgAkHIAGogAxD1Ag0AIAIgBjYCRCACQa0INgJAQfgJIAJBwABqEDxBACEFQdN3IQMMAQsCQAJAIAUtAARBAXENACAHIQcMAQsCQAJAAkAgBS8BBkECdCIFQQRqIAAoAmRJDQBBrgghA0HSdyELDAELIA0gBWoiAyEFAkAgAyAAIAAoAmBqIAAoAmRqTw0AA0ACQCAFIgUvAQAiAw0AAkAgBS0AAkUNAEGvCCEDQdF3IQsMBAtBrwghA0HRdyELIAUtAAMNA0EBIQkgByEFDAQLIAIgAigCqAQ2AjwCQCACQTxqIAMQ9QINAEGwCCEDQdB3IQsMAwsgBUEEaiIDIQUgAyAAIAAoAmBqIAAoAmRqSQ0ACwtBsQghA0HPdyELCyACIAY2AjQgAiADNgIwQfgJIAJBMGoQPEEAIQkgCyEFCyAFIgMhB0EAIQUgAyEDIAlFDQELQQEhBSAHIQMLIAMhBwJAIAUiBUUNACAHIQkgCkEBaiILIQogBSEDIAYhBSAHIQcgCyABLwEITw0DDAELCyAFIQMgBiEFIAchBwwBCyACIAU2AiQgAiABNgIgQfgJIAJBIGoQPEEAIQMgBSEFIAchBwsgByEBIAUhBgJAIANFDQAgBEEBaiIFIAAvAQ4iCEkiCSEEIAEhAyAFIQcgCSEJIAYhBiABIQEgBSAITw0CDAELCyAIIQkgBiEGIAEhAQsgASEBIAYhBQJAIAlBAXFFDQAgASEADAELAkAgAEHsAGooAgAiBEUNAAJAAkAgACAAKAJoaiIDKAIIIARNDQAgAiAFNgIEIAJBtQg2AgBB+AkgAhA8QQAhBUHLdyEADAELAkAgAxCZBCIEDQBBASEFIAEhAAwBCyACIAAoAmg2AhQgAiAENgIQQfgJIAJBEGoQPEEAIQVBACAEayEACyAAIQAgBUUNAQtBACEACyACQbAEaiQAIAALXgECfyMAQRBrIgIkAAJAAkAgAC8BBCIDIAAvAQZPDQAgASgCpAEhASAAIANBAWo7AQQgASADai0AACEADAELIAJBCGogAUHkABCCAUEAIQALIAJBEGokACAAQf8BcQslAAJAIAAtAEYNAEF/DwsgAEEAOgBGIAAgAC0ABkEQcjoABkEACywAIAAgAToARwJAIAENACAALQBGRQ0AIABBADoARiAAIAAtAAZBEHI6AAYLCz4AIAAoAtwBECIgAEH6AWpCADcBACAAQfQBakIANwIAIABB7AFqQgA3AgAgAEHkAWpCADcCACAAQgA3AtwBC7ICAQR/AkAgAQ0AQQAPCwJAIAFBgIAETw0AAkAgAC8B4AEiAg0AIAJBAEcPCyAAKALcASEDQQAhBAJAA0ACQCADIAQiBEECdGoiBS8BACABRw0AIAUgBUEEaiACIARBf3NqQQJ0EIcFGiAALwHgASICQQJ0IAAoAtwBIgNqQXxqQQA7AQAgAEH6AWpCADcBACAAQfIBakIANwEAIABB6gFqQgA3AQAgAEIANwHiAQJAIAINAEEBDwtBACEEA0ACQCADIAQiBEECdGovAQAiBUUNACAAIAVBH3FqQeIBaiIFLQAADQAgBSAEQQFqOgAACyAEQQFqIgUhBEEBIQEgBSACRw0ADAMLAAsgBEEBaiIFIQQgBSACRw0AC0EAIQELIAEPC0GANEGDOEHUAEHgDhDpBAAL5AIBB38CQCAALQBHRQ0AAkAgAC0AB0ECcUUNACAAKALcASECIAAvAeABIgMhBEEAIQUCQCADRQ0AQQAhBkEAIQMDQCADIQMCQAJAIAIgBiIGQQJ0aiIHLQACQQFxRQ0AIAMhAwwBCyACIANBAnRqIAcoAQA2AQAgA0EBaiEDCyAALwHgASIHIQQgAyIDIQUgBkEBaiIIIQYgAyEDIAggB0kNAAsLIAIgBSIDQQJ0akEAIAQgA2tBAnQQiAUaIABB+gFqQgA3AQAgAEHyAWpCADcBACAAQeoBakIANwEAIABCADcB4gEgAC8B4AEiB0UNACAAKALcASEIQQAhAwNAAkAgCCADIgNBAnRqLwEAIgZFDQAgACAGQR9xakHiAWoiBi0AAA0AIAYgA0EBajoAAAsgA0EBaiIGIQMgBiAHRw0ACwsgAEEAOgAHIABBADYC2AEgAC0ARg0AIAAgAToARiAAEGELC88EAQp/AkAgAUGAgARPDQACQCABDQBBfg8LAkACQAJAIAAvAeABIgNFDQAgA0ECdCAAKALcASIEakF8ai8BAA0AIAQhBCADIQMMAQtBfyEFIANB7wFLDQEgA0EBdCIDQegBIANB6AFJG0EIaiIDQQJ0ECEgACgC3AEgAC8B4AFBAnQQhgUhBCAAKALcARAiIAAgAzsB4AEgACAENgLcASAEIQQgAyEDCyAEIQYgAyIHQQEgB0EBSxshCEEAIQNBACEEAkADQCAEIQQCQAJAAkAgBiADIgVBAnRqIgMvAQAiCUUNACAJIAFzQR9xIQoCQAJAIARBAXFFDQAgCg0BCwJAIApFDQBBASELQQAhDCAKRSEKDAQLQQEhC0EAIQxBASEKIAkgAUkNAwsCQCAJIAFHDQAgAy0AAiACRw0AQQAhC0EBIQwMAgsgA0EEaiADIAcgBUF/c2pBAnQQhwUaCyADIAE7AQAgAyACOgACQQAhC0EEIQwLIAQhCgsgCiEEIAwhAyALRQ0BIAVBAWoiBSEDIAQhBCAFIAhHDQALQQQhAwtBACEFIANBBEcNACAAQgA3AeIBIABB+gFqQgA3AQAgAEHyAWpCADcBACAAQeoBakIANwEAAkAgAC8B4AEiAQ0AQQEPCyAAKALcASEJQQAhAwNAAkAgCSADIgNBAnRqLwEAIgRFDQAgACAEQR9xakHiAWoiBC0AAA0AIAQgA0EBajoAAAsgA0EBaiIEIQNBASEFIAQgAUcNAAsLIAUPC0GANEGDOEH8AEHJDhDpBAALogcCC38BfiMAQRBrIgEkAAJAIAAoAqgBIgJFDQAgAiECQYCACCEDAkADQCACIQIgA0F/aiIERQ0BIAAtAEYNAgJAAkAgAC0AR0UNAAJAIAAtAEhFDQAgAEEAOgBIDAELIAAgAi8BBCIFQR9xakHiAWotAAAiA0UNACAAKALcASIGIANBf2oiA0ECdGovAQAiByEIIAMhAyAFIAdJDQADQCADIQMCQCAFIAhB//8DcUcNAAJAIAYgA0ECdGotAAJBAXFFDQAgACgC2AEgAkcNASAAQQgQ/QIMBAsgAEEBEP0CDAMLIAYgA0EBaiIDQQJ0ai8BACIHIQggAyEDIAUgB08NAAsLAkACQCACLwEEIgMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIIBQQAhAwsgAyIDQf8BcSEGAkAgA8BBf0oNACABIAZB8H5qEOMCAkAgAC0AQiICQQpJDQAgAUEIaiAAQeUAEIIBDAILIAEpAwAhDCAAIAJBAWo6AEIgACACQQN0akHQAGogDDcDAAwBCwJAIAZB3QBJDQAgAUEIaiAAQeYAEIIBDAELAkAgBkGg7gBqLQAAIglBIHFFDQAgACACLwEEIgNBf2o7AUACQAJAIAMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIIBQQAhAwsCQAJAIANB/wFxIgpB+AFPDQAgCiEDDAELIApBA3EhC0EAIQVBACEIA0AgCCEIIAUhAwJAAkAgAi8BBCIFIAIvAQZPDQAgACgCpAEhByACIAVBAWo7AQQgByAFai0AACEHDAELIAFBCGogAEHkABCCAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQeDGASAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCCAQwBCyABIAIgAEHgxgEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQggEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQ2QILIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQgQELIAFBEGokAAskAQF/QQAhAQJAIABBhwFLDQAgAEECdEGA6gBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARD1Ag0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBgOoAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRC1BTYCACAFIQEMAgtBgzhBrgJB48UAEOQEAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEIEDIgEhAgJAIAENACADQQhqIABB6AAQggFBv9UAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIIBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEPUCDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQggELDgAgACACIAIoAkwQsAILNQACQCABLQBCQQFGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEAQQAQdBoLNQACQCABLQBCQQJGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEBQQAQdBoLNQACQCABLQBCQQNGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUECQQAQdBoLNQACQCABLQBCQQRGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEDQQAQdBoLNQACQCABLQBCQQVGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEEQQAQdBoLNQACQCABLQBCQQZGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEFQQAQdBoLNQACQCABLQBCQQdGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEGQQAQdBoLNQACQCABLQBCQQhGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEHQQAQdBoLNQACQCABLQBCQQlGDQBB4sYAQbw2Qc0AQdPBABDpBAALIAFBADoAQiABKAKsAUEIQQAQdBoL9gECA38BfiMAQdAAayICJAAgAkHIAGogARDiAyACQcAAaiABEOIDIAEoAqwBQQApA7hpNwMgIAEgAikDSDcDMCACIAIpA0A3AzACQCABIAJBMGoQlwIiA0UNACACIAIpA0g3AygCQCABIAJBKGoQyAIiBA0AIAIgAikDSDcDICACQThqIAEgAkEgahDPAiACIAIpAzgiBTcDSCACIAU3AxggASACQRhqEIwBCyACIAIpA0g3AxACQCABIAMgAkEQahCNAg0AIAEoAqwBQQApA7BpNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahCNAQsgAkHQAGokAAteAQJ/IwBBEGsiAiQAIAEoAqwBIQMgAkEIaiABEOIDIAMgAikDCDcDICADIAAQdwJAIAEtAEdFDQAgASgC2AEgAEcNACABLQAHQQhxRQ0AIAFBCBD9AgsgAkEQaiQAC2IBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCCAUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4UBAQR/IwBBIGsiAiQAIAJBEGogARDiAyACIAIpAxA3AwggASACQQhqEOgCIQMCQAJAIAAoAhAoAgAgASgCTCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABCCAUEAIQULAkAgBSIBRSADcg0AIAAgATsBBAsgAkEgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOIDIANBEGogAhDiAyADIAMpAxg3AwggAyADKQMQNwMAIAAgAiADQQhqIAMQkQIgA0EgaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqQBNgIMAkACQCADQQxqIARBgIABciIEEPUCDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEIQCIQQgAyADKQMQNwMAIAAgAiAEIAMQngIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEOIDAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ4gMCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ4gMgARDjAyEDIAEQ4wMhBCACQRBqIAFBARDlAwJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA8hpNwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQ4gMgAyADKQMYNwMQAkACQAJAIANBEGoQyQINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEOYCEOICCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ4gMgA0EQaiACEOIDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCiAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ4gMgAkEgaiABEOIDIAJBGGogARDiAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEKMCIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EM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CEECRnEQ5AIgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACEOIDAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEOYCmhDiAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA6hpNwMADAELIABBACACaxDjAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEOIDIAMgAykDCDcDACAAIAIgAxDoAkEBcxDkAiADQRBqJAALDAAgACACEOQDEOMCC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhDiAyACQRhqIgQgAykDODcDACADQThqIAIQ4gMgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEOMCDAELIAMgBSkDADcDMAJAAkAgAiADQTBqEMgCDQAgAyAEKQMANwMoIAIgA0EoahDIAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqENICDAELIAMgBSkDADcDICACIAIgA0EgahDmAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQ5gIiCDkDACAAIAggAisDIKAQ4gILIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQ4gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhDjAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ5gI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOYCIgg5AwAgACACKwMgIAihEOICCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhDiAyACQRhqIgQgAykDGDcDACADQRhqIAIQ4gMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEOMCDAELIAMgBSkDADcDECACIAIgA0EQahDmAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ5gIiCDkDACAAIAggAisD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Axg3AwAgA0EYaiACEOIDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ8gJBAXMhAgsgACACEOQCIANBIGokAAs/AQF/AkAgAS0AQiICDQAgACABQewAEIIBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEOcCIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEOcCIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCCAQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQ6QINAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahDIAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahDeAkIAIQUMAQsCQCACQQFxRQ0AIAMgAykDODcDECABIANBEGoQ6gINACADIAMpAzg3AwggA0EwaiABQbQaIANBCGoQ3wJCACEFDAELIAMpAzghBQsgACAFNwMAIANBwABqJAALoAQBBX8CQCAEQfb/A08NACAAEOoDQQBBAToA4NoBQQAgASkAADcA4doBQQAgAUEFaiIFKQAANwDm2gFBACAEQQh0IARBgP4DcUEIdnI7Ae7aAUEAQQk6AODaAUHg2gEQ6wMCQCAERQ0AQQAhAANAAkAgBCAAIgZrIgBBECAAQRBJGyIHRQ0AIAMgBmohCEEAIQADQCAAIgBB4NoBaiIJIAktAAAgCCAAai0AAHM6AAAgAEEBaiIJIQAgCSAHRw0ACwtB4NoBEOsDIAZBEGoiCSEAIAkgBEkNAAsLIAJBACgC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CyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQsgS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtB8zVBygFBqsYAEOQEAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACELIEtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvjAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKAKA5gEiASAARw0AQYDmASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQiAUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKAKA5gE2AgBBACAANgKA5gFBACECCyACDwtB+TpBK0GqIBDkBAAL4wECA38BfgJAIAEtAAxBAk8NAEF+DwtBfiECAkACQCABKQIEIgVQDQAgAS8BECEDECMNAQJAIAAtAAZFDQACQAJAAkBBACgCgOYBIgEgAEcNAEGA5gEhAQwBCyABIQIDQCACIgFFDQIgASgCACIEIQIgASEBIAQgAEcN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ACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQtQVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQtQVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBDsBCABQQhqIQIMBwsgCygCACIBQYXRACABGyIDELUFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQhgUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBC1BSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQhgUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEJ4FIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ2QWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ2QWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDZBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDZBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQiAUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QaDyAGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEIgFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQtQVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxDrBCEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALSQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgACABEOsEIgEQISIDIAEgACACKAIIEOsEGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkHrJWotAAA6AAAgBUEBaiAGLQAAQQ9xQeslai0AADoAACAEQQFqIgUhBCAFIAFHDQAL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BgBB6OgBC08CAX4CfwJAAkAgAL0iAUI0iKdB/w9xIgJB/w9GDQBBBCEDIAINAUECQQMgAUL///////////8Ag1AbDwsgAUL/////////B4NQIQMLIAMLBAAgAAuOBAEDfwJAIAJBgARJDQAgACABIAIQEyAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEIYFDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgC7OgBRQ0AQQAoAuzoARCLBSEBCwJAQQAoAujKAUUNAEEAKALoygEQiwUgAXIhAQsCQBChBSgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQiQUhAgsCQCAAKAIUIAAoAhxGDQAgABCLBSABciEBCwJAIAJFDQAgABCKBQsgACgCOCIADQALCxCiBSABDwtBACECAkAgACgCTEEASA0AIAAQiQUhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBEPABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEIoFCyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEI0FIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACEJ8FC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBQQxgVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahAUEMYFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBCFBRASC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEJIFDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEIYFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQkwUhAAwBCyADEIkFIQUgACAEIAMQkwUhACAFRQ0AIAMQigULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEJoFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEJ0FIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA9BzIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDoHSiIAhBACsDmHSiIABBACsDkHSiQQArA4h0oKCgoiAIQQArA4B0oiAAQQArA/hzokEAKwPwc6CgoKIgCEEAKwPoc6IgAEEAKwPgc6JBACsD2HOgoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQmQUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQmwUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsDmHOiIANCLYinQf8AcUEEdCIBQbD0AGorAwCgIgkgAUGo9ABqKwMAIAIgA0KAgICAgICAeIN9vyABQaiEAWorAwChIAFBsIQBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwPIc6JBACsDwHOgoiAAQQArA7hzokEAKwOwc6CgoiAEQQArA6hzoiAIQQArA6BzoiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB4r4laiICQRR2arciBUQAYJ9QE0TTP6IiBiACQf//P3FBnsGa/wNqrUIghiABQv////8Pg4S/RAAAAAAAAPC/oCIAIAAgAEQAAAAAAADgP6KiIgehvUKAgICAcIO/IghEAAAgFXvL2z+iIgmgIgogCSAGIAqhoCAAIABEAAAAAAAAAECgoyIGIAcgBiAGoiIJIAmiIgYgBiAGRJ/GeNAJmsM/okSveI4dxXHMP6CiRAT6l5mZmdk/oKIgCSAGIAYgBkREUj7fEvHCP6JE3gPLlmRGxz+gokRZkyKUJEnSP6CiRJNVVVVVVeU/oKKgoKIgACAIoSAHoaAiAEQAACAVe8vbP6IgBUQ2K/ER8/5ZPaIgACAIoETVrZrKOJS7PaKgoKCgIQALIAALOQEBfyMAQRBrIgMkACAAIAEgAkH/AXEgA0EIahDoBRDGBSECIAMpAwghASADQRBqJABCfyABIAIbC4cBAQJ/AkACQAJAIAJBBEkNACABIAByQQNxDQEDQCAAKAIAIAEoAgBHDQIgAUEEaiEBIABBBGohACACQXxqIgJBA0sNAAsLIAJFDQELAkADQCAALQAAIgMgAS0AACIERw0BIAFBAWohASAAQQFqIQAgAkF/aiICRQ0CDAALAAsgAyAEaw8LQQALDQBB8OgBEJcFQfToAQsJAEHw6AEQmAULEAAgAZogASAAGxCkBSABogsVAQF/IwBBEGsiASAAOQMIIAErAwgLEAAgAEQAAAAAAAAAcBCjBQsQACAARAAAAAAAAAAQEKMFCwUAIACZC+YEAwZ/A34CfCMAQRBrIgIkACAAEKkFIQMgARCpBSIEQf8PcSIFQcJ3aiEGIAG9IQggAL0hCQJAAkACQCADQYFwakGCcEkNAEEAIQcgBkH/fksNAQsCQCAIEKoFRQ0ARAAAAAAAAPA/IQsgCUKAgICAgICA+D9RDQIgCEIBhiIKUA0CAkACQCAJQgGGIglCgICAgICAgHBWDQAgCkKBgICAgICAcFQNAQsgACABoCELDAMLIAlCgICAgICAgPD/AFENAkQAAAAAAAAAACABIAGiIAlC/////////+//AFYgCEJ/VXMbIQsMAgsCQCAJEKoFRQ0AIAAgAKIhCwJAIAlCf1UNACALmiALIAgQqwVBAUYbIQsLIAhCf1UNAkQAAAAAAADwPyALoxCsBSELDAILQQAhBwJAIAlCf1UNAAJAIAgQqwUiBw0AIAAQmwUhCwwDCyADQf8PcSEDIAlC////////////AIMhCSAHQQFGQRJ0IQcLAkAgBkH/fksNAEQAAAAAAADwPyELIAlCgICAgICAgPg/UQ0CAkAgBUG9B0sNACABIAGaIAlCgICAgICAgPg/VhtEAAAAAAAA8D+gIQsMAwsCQCAEQYAQSSAJQoGAgICAgID4P1RGDQBBABClBSELDAMLQQAQpgUhCwwCCyADDQAgAEQAAAAAAAAwQ6K9Qv///////////wCDQoCAgICAgIDgfHwhCQsgCEKAgIBAg78iCyAJIAJBCGoQrQUiDL1CgICAQIO/IgCiIAEgC6EgAKIgAisDCCAMIAChoCABoqAgBxCuBSELCyACQRBqJAAgCwsJACAAvUI0iKcLGwAgAEIBhkKAgICAgICAEHxCgYCAgICAgBBUC1UCAn8BfkEAIQECQCAAQjSIp0H/D3EiAkH/B0kNAEECIQEgAkGzCEsNAEEAIQFCAUGzCCACa62GIgNCf3wgAINCAFINAEECQQEgAyAAg1AbIQELIAELFQEBfyMAQRBrIgEgADkDCCABKwMIC7MCAwF+BnwBfyABIABCgICAgLDV2oxAfCICQjSHp7ciA0EAKwOgpQGiIAJCLYinQf8AcUEFdCIJQfilAWorAwCgIAAgAkKAgICAgICAeIN9IgBCgICAgAh8QoCAgIBwg78iBCAJQeClAWorAwAiBaJEAAAAAAAA8L+gIgYgAL8gBKEgBaIiBaAiBCADQQArA5ilAaIgCUHwpQFqKwMAoCIDIAQgA6AiA6GgoCAFIARBACsDqKUBIgeiIgggBiAHoiIHoKKgIAYgB6IiBiADIAMgBqAiBqGgoCAEIAQgCKIiA6IgAyADIARBACsD2KUBokEAKwPQpQGgoiAEQQArA8ilAaJBACsDwKUBoKCiIARBACsDuKUBokEAKwOwpQGgoKKgIgQgBiAGIASgIgShoDkDACAEC74CAwN/AnwCfgJAIAAQqQVB/w9xIgNEAAAAAAAAkDwQqQUiBGsiBUQAAAAAAACAQBCpBSAEa0kNAAJAIAVBf0oNACAARAAAAAAAAPA/oCIAmiAAIAIbDwsgA0QAAAAAAACQQBCpBUkhBEEAIQMgBA0AAkAgAL1Cf1UNACACEKYFDwsgAhClBQ8LQQArA6iUASAAokEAKwOwlAEiBqAiByAGoSIGQQArA8CUAaIgBkEAKwO4lAGiIACgoCABoCIAIACiIgEgAaIgAEEAKwPglAGiQQArA9iUAaCiIAEgAEEAKwPQlAGiQQArA8iUAaCiIAe9IginQQR0QfAPcSIEQZiVAWorAwAgAKCgoCEAIARBoJUBaikDACAIIAKtfEIthnwhCQJAIAMNACAAIAkgCBCvBQ8LIAm/IgEgAKIgAaAL5QEBBHwCQCACQoCAgIAIg0IAUg0AIAFCgICAgICAgPhAfL8iAyAAoiADoEQAAAAAAAAAf6IPCwJAIAFCgICAgICAgPA/fCICvyIDIACiIgQgA6AiABCnBUQAAAAAAADwP2NFDQBEAAAAAAAAEAAQrAVEAAAAAAAAEACiELAFIAJCgICAgICAgICAf4O/IABEAAAAAAAA8L9EAAAAAAAA8D8gAEQAAAAAAAAAAGMbIgWgIgYgBCADIAChoCAAIAUgBqGgoKAgBaEiACAARAAAAAAAAAAAYRshAAsgAEQAAAAAAAAQAKILDAAjAEEQayAAOQMIC7cBAwF+AX8BfAJAIAC9IgFCNIinQf8PcSICQbIISw0AAkAgAkH9B0sNACAARAAAAAAAAAAAog8LAkACQCAAIACaIAFCf1UbIgBEAAAAAAAAMEOgRAAAAAAAADDDoCAAoSIDRAAAAAAAAOA/ZEUNACAAIAOgRAAAAAAAAPC/oCEADAELIAAgA6AhACADRAAAAAAAAOC/ZUUNACAARAAAAAAAAPA/oCEACyAAIACaIAFCf1UbIQALIAALGgAgACABELMFIgBBACAALQAAIAFB/wFxRhsL5AEBAn8CQAJAIAFB/wFxIgJFDQACQCAAQQNxRQ0AA0AgAC0AACIDRQ0DIAMgAUH/AXFGDQMgAEEBaiIAQQNxDQALCwJAIAAoAgAiA0F/cyADQf/9+3dqcUGAgYKEeHENACACQYGChAhsIQIDQCADIAJzIgNBf3MgA0H//ft3anFBgIGChHhxDQEgACgCBCEDIABBBGohACADQX9zIANB//37d2pxQYCBgoR4cUUNAAsLAkADQCAAIgMtAAAiAkUNASADQQFqIQAgAiABQf8BcUcNAAsLIAMPCyAAIAAQtQVqDwsgAAtZAQJ/IAEtAAAhAgJAIAAtAAAiA0UNACADIAJB/wFxRw0AA0AgAS0AASECIAAtAAEiA0UNASABQQFqIQEgAEEBaiEAIAMgAkH/AXFGDQALCyADIAJB/wFxawtyAQN/IAAhAQJAAkAgAEEDcUUNACAAIQEDQCABLQAARQ0CIAFBAWoiAUEDcQ0ACwsDQCABIgJBBGohASACKAIAIgNBf3MgA0H//ft3anFBgIGChHhxRQ0ACwNAIAIiAUEBaiECIAEtAAANAAsLIAEgAGsLQQECfyMAQRBrIgEkAEF/IQICQCAAEJEFDQAgACABQQ9qQQEgACgCIBEFAEEBRw0AIAEtAA8hAgsgAUEQaiQAIAILRwECfyAAIAE3A3AgACAAKAIsIAAoAgQiAmusNwN4IAAoAgghAwJAIAFQDQAgAyACa6wgAVcNACACIAGnaiEDCyAAIAM2AmgL3QECA38CfiAAKQN4IAAoAgQiASAAKAIsIgJrrHwhBAJAAkACQCAAKQNwIgVQDQAgBCAFWQ0BCyAAELYFIgJBf0oNASAAKAIEIQEgACgCLCECCyAAQn83A3AgACABNgJoIAAgBCACIAFrrHw3A3hBfw8LIARCAXwhBCAAKAIEIQEgACgCCCEDAkAgACkDcCIFQgBRDQAgBSAEfSIFIAMgAWusWQ0AIAEgBadqIQMLIAAgAzYCaCAAIAQgACgCLCIDIAFrrHw3A3gCQCABIANLDQAgAUF/aiACOgAACyACCxAAIABBIEYgAEF3akEFSXILrgEAAkACQCABQYAISA0AIABEAAAAAAAA4H+iIQACQCABQf8PTw0AIAFBgXhqIQEMAgsgAEQAAAAAAADgf6IhACABQf0XIAFB/RdIG0GCcGohAQwBCyABQYF4Sg0AIABEAAAAAAAAYAOiIQACQCABQbhwTQ0AIAFByQdqIQEMAQsgAEQAAAAAAABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDXBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AENcFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ1wUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5ENcFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDXBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQzQVFDQAgAyAEEL0FIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEENcFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQzwUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEM0FQQBKDQACQCABIAkgAyAKEM0FRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAENcFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDXBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ1wUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAENcFIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABDXBSAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDAwz8Q1wUgBUHIAGopAwAhAiAFKQNAIQQMAQsgCkL///////8/gyAIIAZyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQACxwAIAAgAkL///////////8AgzcDCCAAIAE3AwALjgkCBn8DfiMAQTBrIgQkAEIAIQoCQAJAIAJBAksNACABQQRqIQUgAkECdCICQazGAWooAgAhBiACQaDGAWooAgAhBwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQuAUhAgsgAhC5BQ0AC0EBIQgCQAJAIAJBVWoOAwAB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EGohAiAGKAIQIgQNAAsgBUEANgIACyAHRQ0AAkACQCADIAMoAhwiBEECdEGw6wFqIgIoAgBHDQAgAiAGNgIAIAYNAUEAQQAoAoTpAUF+IAR3cTYChOkBDAILIAdBEEEUIAcoAhAgA0YbaiAGNgIAIAZFDQELIAYgBzYCGAJAIAMoAhAiAkUNACAGIAI2AhAgAiAGNgIYCyADKAIUIgJFDQAgBkEUaiACNgIAIAIgBjYCGAsgASAAQQFyNgIEIAEgAGogADYCACABQQAoApTpAUcNAUEAIAA2AojpAQ8LIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIACwJAIABB/wFLDQAgAEF4cUGo6QFqIQICQAJAQQAoAoDpASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AoDpASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBsOsBaiEEAkACQAJAAkBBACgChOkBIgZBASACdCIDcQ0AQQAgBiADcjYChOkBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKg6QFBf2oiAUF/IAEbNgKg6QELCwcAPwBBEHQLVAECf0EAKALsygEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQyQVNDQAgABAVRQ0BC0EAIAA2AuzKASABDwsQgwVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEMwFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDMBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQzAUgBUEwaiAKIAEgBxDWBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEMwFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEMwFIAUgAiAEQQEgBmsQ1gUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAENQFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELENUFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQzAVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDMBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDYBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDYBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDYBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDYBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDYBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDYBSAFQZABaiADQg+GQgAgBEIAENgFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ2AUgBUGAAWpCASACfUIAIARCABDYBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOENgFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOENgFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ1gUgBUEwaiAWIBMgBkHwAGoQzAUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q2AUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDYBSAFIAMgDkIFQgAQ2AUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEMwFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEMwFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQzAUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQzAUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQzAVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQzAUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQzAUgBUEgaiACIAQgBhDMBSAFQRBqIBIgASAHENYFIAUgAiAEIAcQ1gUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEMsFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDMBSACIAAgBEGB+AAgA2sQ1gUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHw7AUkA0Hw7AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEOYFIQUgBUIgiKcQ3AUgBacLEwAgACABpyABQiCIpyACIAMQFgsLnsuBgAADAEGACAu4vgFpbmZpbml0eQAtSW5maW5pdHkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAc2xlZXBNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAHNtYWxsIGhlbGxvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawB0b19nY19vYmoAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAGludmFsaWQgZmxhZyBhcmcAbmVlZCBmbGFnIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGdjcmVmX3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBkZXZzX2djX3RhZyhkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkgPT0gREVWU19HQ19UQUdfU1RSSU5HADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAKiAgcGM9JWQgQCA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19nY19vYmpfdmFsaWQoY3R4LCBwdHIpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19nY19vYmpfdmFsaWQoY3R4LCByKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQAlcyAoV1NTSykAZGV2c19nY19vYmpfdmFsaWQoY3R4LCBkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkAIXRhcmdldF9pbl9pcnEoKQBmc3RvcjogaW52YWxpZCBsYXJnZSBrZXk6ICclcycAZnN0b3I6IGludmFsaWQga2V5OiAnJXMnAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABADAuMC4wAAAA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c2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AANLvgIAABG5hbWUB4m7pBQANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZD2RldnNkYmdfcHJvY2Vzc1oRZGV2c2RiZ19yZXN0YXJ0ZWRbFWRldnNkYmdfaGFuZGxlX3BhY2tldFwLc2VuZF92YWx1ZXNdEXZhbHVlX2Zyb21fdGFnX3YwXhlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXw1vYmpfZ2V0X3Byb3BzYAxleHBhbmRfdmFsdWVhEmRldnNkYmdfc3VzcGVuZF9jYmIMZGV2c2RiZ19pbml0YxBleHBhbmRfa2V5X3ZhbHVlZAZrdl9hZGRlD2RldnNtZ3JfcHJvY2Vzc2YHdHJ5X3J1bmcMc3RvcF9wcm9ncmFtaA9kZXZzbWdyX3Jlc3RhcnRpFGRldnNtZ3JfZGVwbG95X3N0YXJ0ahRkZXZzbWdyX2RlcGxveV93cml0ZWsQZGV2c21ncl9nZXRfaGFzaGwVZGV2c21ncl9oYW5kbGVfcGFja2V0bQ5kZXBsb3lfaGFuZGxlcm4TZGVwbG95X21ldGFfaGFuZGxlcm8PZGV2c21ncl9nZXRfY3R4cA5kZXZzbWdyX2RlcGxveXEMZGV2c21ncl9pbml0chFkZXZzbWdyX2NsaWVudF9ldnMQZGV2c19maWJlcl95aWVsZHQYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udRhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV2EGRldnNfZmliZXJfc2xlZXB3G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHgaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN5EWRldnNfaW1nX2Z1bl9uYW1lehJkZXZzX2ltZ19yb2xlX25hbWV7EmRldnNfZmliZXJfYnlfZmlkeHwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBAQpkZXZzX3BhbmljggEVX2RldnNfaW52YWxpZF9wcm9ncmFtgwEPZGV2c19maWJlcl9wb2tlhAETamRfZ2NfYW55X3RyeV9hbGxvY4UBB2RldnNfZ2OGAQ9maW5kX2ZyZWVfYmxvY2uHARJkZXZzX2FueV90cnlfYWxsb2OIAQ5kZXZzX3RyeV9hbGxvY4kBC2pkX2djX3VucGluigEKamRfZ2NfZnJlZYsBFGRldnNfdmFsdWVfaXNfcGlubmVkjAEOZGV2c192YWx1ZV9waW6NARBkZXZzX3ZhbHVlX3VucGlujgESZGV2c19tYXBfdHJ5X2FsbG9jjwEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkAEUZGV2c19hcnJheV90cnlfYWxsb2ORARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OSARVkZXZzX3N0cmluZ190cnlfYWxsb2OTARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJQBD2RldnNfZ2Nfc2V0X2N0eJUBDmRldnNfZ2NfY3JlYXRllgEPZGV2c19nY19kZXN0cm95lwERZGV2c19nY19vYmpfdmFsaWSYAQtzY2FuX2djX29iapkBEXByb3BfQXJyYXlfbGVuZ3RomgESbWV0aDJfQXJyYXlfaW5zZXJ0mwESZnVuMV9BcnJheV9pc0FycmF5nAEQbWV0aFhfQXJyYXlfcHVzaJ0BFW1ldGgxX0FycmF5X3B1c2hSYW5nZZ4BEW1ldGhYX0FycmF5X3NsaWNlnwERZnVuMV9CdWZmZXJfYWxsb2OgARJwcm9wX0J1ZmZlcl9sZW5ndGihARVtZXRoMF9CdWZmZXJfdG9TdHJpbmeiARNtZXRoM19CdWZmZXJfZmlsbEF0owETbWV0aDRfQnVmZmVyX2JsaXRBdKQBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOlARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOmARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SnARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSoARdmdW4yX0RldmljZVNjcmlwdF9wcmludKkBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSqARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludKsBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByrAEUbWV0aDFfRXJyb3JfX19jdG9yX1+tARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9frgEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9frwEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+wAQ9wcm9wX0Vycm9yX25hbWWxARFtZXRoMF9FcnJvcl9wcmludLIBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0swEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGW0ARJwcm9wX0Z1bmN0aW9uX25hbWW1AQ9mdW4yX0pTT05fcGFyc2W2ARNmdW4zX0pTT05fc3RyaW5naWZ5twEOZnVuMV9NYXRoX2NlaWy4AQ9mdW4xX01hdGhfZmxvb3K5AQ9mdW4xX01hdGhfcm91bmS6AQ1mdW4xX01hdGhfYWJzuwEQZnVuMF9NYXRoX3JhbmRvbbwBE2Z1bjFfTWF0aF9yYW5kb21JbnS9AQ1mdW4xX01hdGhfbG9nvgENZnVuMl9NYXRoX3Bvd78BDmZ1bjJfTWF0aF9pZGl2wAEOZnVuMl9NYXRoX2ltb2TBAQ5mdW4yX01hdGhfaW11bMIBDWZ1bjJfTWF0aF9taW7DAQtmdW4yX21pbm1heMQBDWZ1bjJfTWF0aF9tYXjFARJmdW4yX09iamVjdF9hc3NpZ27GARBmdW4xX09iamVjdF9rZXlzxwETZnVuMV9rZXlzX29yX3ZhbHVlc8gBEmZ1bjFfT2JqZWN0X3ZhbHVlc8kBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9mygEQcHJvcF9QYWNrZXRfcm9sZcsBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLMARNwcm9wX1BhY2tldF9zaG9ydElkzQEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV4zgEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTPARFwcm9wX1BhY2tldF9mbGFnc9ABFXByb3BfUGFja2V0X2lzQ29tbWFuZNEBFHByb3BfUGFja2V0X2lzUmVwb3J00gETcHJvcF9QYWNrZXRfcGF5bG9hZNMBE3Byb3BfUGFja2V0X2lzRXZlbnTUARVwcm9wX1BhY2tldF9ldmVudENvZGXVARRwcm9wX1BhY2tldF9pc1JlZ1NldNYBFHByb3BfUGFja2V0X2lzUmVnR2V01wETcHJvcF9QYWNrZXRfcmVnQ29kZdgBE21ldGgwX1BhY2tldF9kZWNvZGXZARJkZXZzX3BhY2tldF9kZWNvZGXaARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTbARREc1JlZ2lzdGVyX3JlYWRfY29udNwBEmRldnNfcGFja2V0X2VuY29kZd0BFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXeARZwcm9wX0RzUGFja2V0SW5mb19yb2xl3wEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZeABFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXhARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/iARdwcm9wX0RzUm9sZV9pc0Nvbm5lY3RlZOMBGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZOQBEW1ldGgwX0RzUm9sZV93YWl05QEScHJvcF9TdHJpbmdfbGVuZ3Ro5gEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTnARNtZXRoMV9TdHJpbmdfY2hhckF06AESbWV0aDJfU3RyaW5nX3NsaWNl6QEUZGV2c19qZF9nZXRfcmVnaXN0ZXLqARZkZXZzX2pkX2NsZWFyX3BrdF9raW5k6wEQZGV2c19qZF9zZW5kX2NtZOwBEWRldnNfamRfd2FrZV9yb2xl7QEUZGV2c19qZF9yZXNldF9wYWNrZXTuARNkZXZzX2pkX3BrdF9jYXB0dXJl7wETZGV2c19qZF9zZW5kX2xvZ21zZ/ABEmRldnNfamRfc2hvdWxkX3J1bvEBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl8gETZGV2c19qZF9wcm9jZXNzX3BrdPMBFGRldnNfamRfcm9sZV9jaGFuZ2Vk9AESZGV2c19qZF9pbml0X3JvbGVz9QESZGV2c19qZF9mcmVlX3JvbGVz9gEVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz9wEXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3P4ARVkZXZzX2dldF9nbG9iYWxfZmxhZ3P5ARBkZXZzX2pzb25fZXNjYXBl+gEVZGV2c19qc29uX2VzY2FwZV9jb3Jl+wEPZGV2c19qc29uX3BhcnNl/AEKanNvbl92YWx1Zf0BDHBhcnNlX3N0cmluZ/4BDXN0cmluZ2lmeV9vYmr/AQphZGRfaW5kZW50gAIPc3RyaW5naWZ5X2ZpZWxkgQITZGV2c19qc29uX3N0cmluZ2lmeYICEXBhcnNlX3N0cmluZ19jb3JlgwIRZGV2c19tYXBsaWtlX2l0ZXKEAhdkZXZzX2dldF9idWlsdGluX29iamVjdIUCEmRldnNfbWFwX2NvcHlfaW50b4YCDGRldnNfbWFwX3NldIcCBmxvb2t1cIgCE2RldnNfbWFwbGlrZV9pc19tYXCJAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXOKAhFkZXZzX2FycmF5X2luc2VydIsCCGt2X2FkZC4xjAISZGV2c19zaG9ydF9tYXBfc2V0jQIPZGV2c19tYXBfZGVsZXRljgISZGV2c19zaG9ydF9tYXBfZ2V0jwIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXSQAg5kZXZzX3JvbGVfc3BlY5ECEmRldnNfZnVuY3Rpb25fYmluZJICEWRldnNfbWFrZV9jbG9zdXJlkwIOZGV2c19nZXRfZm5pZHiUAhNkZXZzX2dldF9mbmlkeF9jb3JllQIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxklgITZGV2c19nZXRfcm9sZV9wcm90b5cCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd5gCGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZJkCFWRldnNfZ2V0X3N0YXRpY19wcm90b5oCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb5sCHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtnAIWZGV2c19tYXBsaWtlX2dldF9wcm90b50CGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZJ4CGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZJ8CEGRldnNfaW5zdGFuY2Vfb2agAg9kZXZzX29iamVjdF9nZXShAgxkZXZzX3NlcV9nZXSiAgxkZXZzX2FueV9nZXSjAgxkZXZzX2FueV9zZXSkAgxkZXZzX3NlcV9zZXSlAg5kZXZzX2FycmF5X3NldKYCE2RldnNfYXJyYXlfcGluX3B1c2inAgxkZXZzX2FyZ19pbnSoAg9kZXZzX2FyZ19kb3VibGWpAg9kZXZzX3JldF9kb3VibGWqAgxkZXZzX3JldF9pbnSrAg1kZXZzX3JldF9ib29srAIPZGV2c19yZXRfZ2NfcHRyrQIRZGV2c19hcmdfc2VsZl9tYXCuAhFkZXZzX3NldHVwX3Jlc3VtZa8CD2RldnNfY2FuX2F0dGFjaLACGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWWxAhVkZXZzX21hcGxpa2VfdG9fdmFsdWWyAhJkZXZzX3JlZ2NhY2hlX2ZyZWWzAhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxstAIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWS1AhNkZXZzX3JlZ2NhY2hlX2FsbG9jtgIUZGV2c19yZWdjYWNoZV9sb29rdXC3AhFkZXZzX3JlZ2NhY2hlX2FnZbgCF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xluQISZGV2c19yZWdjYWNoZV9uZXh0ugIPamRfc2V0dGluZ3NfZ2V0uwIPamRfc2V0dGluZ3Nfc2V0vAIOZGV2c19sb2dfdmFsdWW9Ag9kZXZzX3Nob3dfdmFsdWW+AhBkZXZzX3Nob3dfdmFsdWUwvwINY29uc3VtZV9jaHVua8ACDXNoYV8yNTZfY2xvc2XBAg9qZF9zaGEyNTZfc2V0dXDCAhBqZF9zaGEyNTZfdXBkYXRlwwIQamRfc2hhMjU2X2ZpbmlzaMQCFGpkX3NoYTI1Nl9obWFjX3NldHVwxQIVamRfc2hhMjU2X2htYWNfZmluaXNoxgIOamRfc2hhMjU2X2hrZGbHAg5kZXZzX3N0cmZvcm1hdMgCDmRldnNfaXNfc3RyaW5nyQIOZGV2c19pc19udW1iZXLKAhRkZXZzX3N0cmluZ19nZXRfdXRmOMsCE2RldnNfYnVpbHRpbl9zdHJpbmfMAhRkZXZzX3N0cmluZ192c3ByaW50Zs0CE2RldnNfc3RyaW5nX3NwcmludGbOAhVkZXZzX3N0cmluZ19mcm9tX3V0ZjjPAhRkZXZzX3ZhbHVlX3RvX3N0cmluZ9ACEGJ1ZmZlcl90b19zdHJpbmfRAhlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxk0gISZGV2c19zdHJpbmdfY29uY2F00wIRZGV2c19zdHJpbmdfc2xpY2XUAhJkZXZzX3B1c2hfdHJ5ZnJhbWXVAhFkZXZzX3BvcF90cnlmcmFtZdYCD2RldnNfZHVtcF9zdGFja9cCE2RldnNfZHVtcF9leGNlcHRpb27YAgpkZXZzX3Rocm932QISZGV2c19wcm9jZXNzX3Rocm932gIQZGV2c19hbGxvY19lcnJvctsCFWRldnNfdGhyb3dfdHlwZV9lcnJvctwCFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LdAh5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LeAhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvct8CHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dOACGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcuECF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y4gIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZeMCE2RldnNfdmFsdWVfZnJvbV9pbnTkAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbOUCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy5gIUZGV2c192YWx1ZV90b19kb3VibGXnAhFkZXZzX3ZhbHVlX3RvX2ludOgCEmRldnNfdmFsdWVfdG9fYm9vbOkCDmRldnNfaXNfYnVmZmVy6gIXZGV2c19idWZmZXJfaXNfd3JpdGFibGXrAhBkZXZzX2J1ZmZlcl9kYXRh7AITZGV2c19idWZmZXJpc2hfZGF0Ye0CFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq7gINZGV2c19pc19hcnJhee8CEWRldnNfdmFsdWVfdHlwZW9m8AIPZGV2c19pc19udWxsaXNo8QIZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZPICFGRldnNfdmFsdWVfYXBwcm94X2Vx8wISZGV2c192YWx1ZV9pZWVlX2Vx9AIeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj9QISZGV2c19pbWdfc3RyaWR4X29r9gISZGV2c19kdW1wX3ZlcnNpb25z9wILZGV2c192ZXJpZnn4AhFkZXZzX2ZldGNoX29wY29kZfkCDmRldnNfdm1fcmVzdW1l+gIRZGV2c192bV9zZXRfZGVidWf7AhlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRz/AIYZGV2c192bV9jbGVhcl9icmVha3BvaW50/QIPZGV2c192bV9zdXNwZW5k/gIWZGV2c192bV9zZXRfYnJlYWtwb2ludP8CFGRldnNfdm1fZXhlY19vcGNvZGVzgAMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiBAxFkZXZzX2ltZ19nZXRfdXRmOIIDFGRldnNfZ2V0X3N0YXRpY191dGY4gwMPZGV2c192bV9yb2xlX29rhAMUZGV2c192YWx1ZV9idWZmZXJpc2iFAwxleHByX2ludmFsaWSGAxRleHByeF9idWlsdGluX29iamVjdIcDC3N0bXQxX2NhbGwwiAMLc3RtdDJfY2FsbDGJAwtzdG10M19jYWxsMooDC3N0bXQ0X2NhbGwziwMLc3RtdDVfY2FsbDSMAwtzdG10Nl9jYWxsNY0DC3N0bXQ3X2NhbGw2jgMLc3RtdDhfY2FsbDePAwtzdG10OV9jYWxsOJADEnN0bXQyX2luZGV4X2RlbGV0ZZEDDHN0bXQxX3JldHVybpIDCXN0bXR4X2ptcJMDDHN0bXR4MV9qbXBfepQDCmV4cHIyX2JpbmSVAxJleHByeF9vYmplY3RfZmllbGSWAxJzdG10eDFfc3RvcmVfbG9jYWyXAxNzdG10eDFfc3RvcmVfZ2xvYmFsmAMSc3RtdDRfc3RvcmVfYnVmZmVymQMJZXhwcjBfaW5mmgMQZXhwcnhfbG9hZF9sb2NhbJsDEWV4cHJ4X2xvYWRfZ2xvYmFsnAMLZXhwcjFfdXBsdXOdAwtleHByMl9pbmRleJ4DD3N0bXQzX2luZGV4X3NldJ8DFGV4cHJ4MV9idWlsdGluX2ZpZWxkoAMSZXhwcngxX2FzY2lpX2ZpZWxkoQMRZXhwcngxX3V0ZjhfZmllbGSiAxBleHByeF9tYXRoX2ZpZWxkowMOZXhwcnhfZHNfZmllbGSkAw9zdG10MF9hbGxvY19tYXClAxFzdG10MV9hbGxvY19hcnJheaYDEnN0bXQxX2FsbG9jX2J1ZmZlcqcDEWV4cHJ4X3N0YXRpY19yb2xlqAMTZXhwcnhfc3RhdGljX2J1ZmZlcqkDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ6oDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmerAxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmesAxVleHByeF9zdGF0aWNfZnVuY3Rpb26tAw1leHByeF9saXRlcmFsrgMRZXhwcnhfbGl0ZXJhbF9mNjSvAxBleHByeF9yb2xlX3Byb3RvsAMRZXhwcjNfbG9hZF9idWZmZXKxAw1leHByMF9yZXRfdmFssgMMZXhwcjFfdHlwZW9mswMPZXhwcjBfdW5kZWZpbmVktAMSZXhwcjFfaXNfdW5kZWZpbmVktQMKZXhwcjBfdHJ1ZbYDC2V4cHIwX2ZhbHNltwMNZXhwcjFfdG9fYm9vbLgDCWV4cHIwX25hbrkDCWV4cHIxX2Fic7oDDWV4cHIxX2JpdF9ub3S7AwxleHByMV9pc19uYW68AwlleHByMV9uZWe9AwlleHByMV9ub3S+AwxleHByMV90b19pbnS/AwlleHByMl9hZGTAAwlleHByMl9zdWLBAwlleHByMl9tdWzCAwlleHByMl9kaXbDAw1leHByMl9iaXRfYW5kxAMMZXhwcjJfYml0X29yxQMNZXhwcjJfYml0X3hvcsYDEGV4cHIyX3NoaWZ0X2xlZnTHAxFleHByMl9zaGlmdF9yaWdodMgDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkyQMIZXhwcjJfZXHKAwhleHByMl9sZcsDCGV4cHIyX2x0zAMIZXhwcjJfbmXNAxVzdG10MV90ZXJtaW5hdGVfZmliZXLOAxRzdG10eDJfc3RvcmVfY2xvc3VyZc8DE2V4cHJ4MV9sb2FkX2Nsb3N1cmXQAxJleHByeF9tYWtlX2Nsb3N1cmXRAxBleHByMV90eXBlb2Zfc3Ry0gMMZXhwcjBfbm93X21z0wMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZdQDEHN0bXQyX2NhbGxfYXJyYXnVAwlzdG10eF90cnnWAw1zdG10eF9lbmRfdHJ51wMLc3RtdDBfY2F0Y2jYAw1zdG10MF9maW5hbGx52QMLc3RtdDFfdGhyb3faAw5zdG10MV9yZV90aHJvd9sDEHN0bXR4MV90aHJvd19qbXDcAw5zdG10MF9kZWJ1Z2dlct0DCWV4cHIxX25ld94DEWV4cHIyX2luc3RhbmNlX29m3wMKZXhwcjBfbnVsbOADD2V4cHIyX2FwcHJveF9lceEDD2V4cHIyX2FwcHJveF9uZeIDD2RldnNfdm1fcG9wX2FyZ+MDE2RldnNfdm1fcG9wX2FyZ191MzLkAxNkZXZzX3ZtX3BvcF9hcmdfaTMy5QMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcuYDEmpkX2Flc19jY21fZW5jcnlwdOcDEmpkX2Flc19jY21fZGVjcnlwdOgDDEFFU19pbml0X2N0eOkDD0FFU19FQ0JfZW5jcnlwdOoDEGpkX2Flc19zZXR1cF9rZXnrAw5qZF9hZXNfZW5jcnlwdOwDEGpkX2Flc19jbGVhcl9rZXntAwtqZF93c3NrX25ld+4DFGpkX3dzc2tfc2VuZF9tZXNzYWdl7wMTamRfd2Vic29ja19vbl9ldmVudPADB2RlY3J5cHTxAw1qZF93c3NrX2Nsb3Nl8gMQamRfd3Nza19vbl9ldmVudPMDC3Jlc3Bfc3RhdHVz9AMSd3Nza2hlYWx0aF9wcm9jZXNz9QMXamRfdGNwc29ja19pc19hdmFpbGFibGX2AxR3c3NraGVhbHRoX3JlY29ubmVjdPcDGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldPgDD3NldF9jb25uX3N0cmluZ/kDEWNsZWFyX2Nvbm5fc3RyaW5n+gMPd3Nza2hlYWx0aF9pbml0+wMRd3Nza19zZW5kX21lc3NhZ2X8AxF3c3NrX2lzX2Nvbm5lY3RlZP0DEndzc2tfc2VydmljZV9xdWVyef4DFGRldnNfdHJhY2tfZXhjZXB0aW9u/wMccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZYAEFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWBBA9yb2xlbWdyX3Byb2Nlc3OCBBByb2xlbWdyX2F1dG9iaW5kgwQVcm9sZW1ncl9oYW5kbGVfcGFja2V0hAQUamRfcm9sZV9tYW5hZ2VyX2luaXSFBBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSGBA1qZF9yb2xlX2FsbG9jhwQQamRfcm9sZV9mcmVlX2FsbIgEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmSJBBNqZF9jbGllbnRfbG9nX2V2ZW50igQTamRfY2xpZW50X3N1YnNjcmliZYsEFGpkX2NsaWVudF9lbWl0X2V2ZW50jAQUcm9sZW1ncl9yb2xlX2NoYW5nZWSNBBBqZF9kZXZpY2VfbG9va3VwjgQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNljwQTamRfc2VydmljZV9zZW5kX2NtZJAEEWpkX2NsaWVudF9wcm9jZXNzkQQOamRfZGV2aWNlX2ZyZWWSBBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldJMED2pkX2RldmljZV9hbGxvY5QED2pkX2N0cmxfcHJvY2Vzc5UEFWpkX2N0cmxfaGFuZGxlX3BhY2tldJYEDGpkX2N0cmxfaW5pdJcEFGRjZmdfc2V0X3VzZXJfY29uZmlnmAQJZGNmZ19pbml0mQQNZGNmZ192YWxpZGF0ZZoEDmRjZmdfZ2V0X2VudHJ5mwQMZGNmZ19nZXRfaTMynAQMZGNmZ19nZXRfdTMynQQPZGNmZ19nZXRfc3RyaW5nngQMZGNmZ19pZHhfa2V5nwQJamRfdmRtZXNnoAQRamRfZG1lc2dfc3RhcnRwdHKhBA1qZF9kbWVzZ19yZWFkogQSamRfZG1lc2dfcmVhZF9saW5lowQTamRfc2V0dGluZ3NfZ2V0X2JpbqQEDWpkX2ZzdG9yX2luaXSlBBNqZF9zZXR0aW5nc19zZXRfYmlupgQLamRfZnN0b3JfZ2OnBA9yZWNvbXB1dGVfY2FjaGWoBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2WpBBZqZF9zZXR0aW5nc19wcmVwX2xhcmdlqgQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2WrBBZqZF9zZXR0aW5nc19zeW5jX2xhcmdlrAQNamRfaXBpcGVfb3Blbq0EFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXSuBA5qZF9pcGlwZV9jbG9zZa8EEmpkX251bWZtdF9pc192YWxpZLAEFWpkX251bWZtdF93cml0ZV9mbG9hdLEEE2pkX251bWZtdF93cml0ZV9pMzKyBBJqZF9udW1mbXRfcmVhZF9pMzKzBBRqZF9udW1mbXRfcmVhZF9mbG9hdLQEEWpkX29waXBlX29wZW5fY21ktQQUamRfb3BpcGVfb3Blbl9yZXBvcnS2BBZqZF9vcGlwZV9oYW5kbGVfcGFja2V0twQRamRfb3BpcGVfd3JpdGVfZXi4BBBqZF9vcGlwZV9wcm9jZXNzuQQUamRfb3BpcGVfY2hlY2tfc3BhY2W6BA5qZF9vcGlwZV93cml0ZbsEDmpkX29waXBlX2Nsb3NlvAQNamRfcXVldWVfcHVzaL0EDmpkX3F1ZXVlX2Zyb250vgQOamRfcXVldWVfc2hpZnS/BA5qZF9xdWV1ZV9hbGxvY8AEDWpkX3Jlc3BvbmRfdTjBBA5qZF9yZXNwb25kX3UxNsIEDmpkX3Jlc3BvbmRfdTMywwQRamRfcmVzcG9uZF9zdHJpbmfEBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZMUEC2pkX3NlbmRfcGt0xgQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzHBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcsgEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTJBBRqZF9hcHBfaGFuZGxlX3BhY2tldMoEFWpkX2FwcF9oYW5kbGVfY29tbWFuZMsEFWFwcF9nZXRfaW5zdGFuY2VfbmFtZcwEE2pkX2FsbG9jYXRlX3NlcnZpY2XNBBBqZF9zZXJ2aWNlc19pbml0zgQOamRfcmVmcmVzaF9ub3fPBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk0AQUamRfc2VydmljZXNfYW5ub3VuY2XRBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZdIEEGpkX3NlcnZpY2VzX3RpY2vTBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfUBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZdUEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXWBBRhcHBfZ2V0X2RldmljZV9jbGFzc9cEEmFwcF9nZXRfZndfdmVyc2lvbtgEDWpkX3NydmNmZ19ydW7ZBBdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZdoEEWpkX3NydmNmZ192YXJpYW502wQNamRfaGFzaF9mbnYxYdwEDGpkX2RldmljZV9pZN0ECWpkX3JhbmRvbd4ECGpkX2NyYzE23wQOamRfY29tcHV0ZV9jcmPgBA5qZF9zaGlmdF9mcmFtZeEEDGpkX3dvcmRfbW92ZeIEDmpkX3Jlc2V0X2ZyYW1l4wQQamRfcHVzaF9pbl9mcmFtZeQEDWpkX3BhbmljX2NvcmXlBBNqZF9zaG91bGRfc2FtcGxlX21z5gQQamRfc2hvdWxkX3NhbXBsZecECWpkX3RvX2hleOgEC2pkX2Zyb21faGV46QQOamRfYXNzZXJ0X2ZhaWzqBAdqZF9hdG9p6wQLamRfdnNwcmludGbsBA9qZF9wcmludF9kb3VibGXtBApqZF9zcHJpbnRm7gQSamRfZGV2aWNlX3Nob3J0X2lk7wQMamRfc3ByaW50Zl9h8AQLamRfdG9faGV4X2HxBAlqZF9zdHJkdXDyBAlqZF9tZW1kdXDzBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVl9AQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZfUEEWpkX3NlbmRfZXZlbnRfZXh09gQKamRfcnhfaW5pdPcEFGpkX3J4X2ZyYW1lX3JlY2VpdmVk+AQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2v5BA9qZF9yeF9nZXRfZnJhbWX6BBNqZF9yeF9yZWxlYXNlX2ZyYW1l+wQRamRfc2VuZF9mcmFtZV9yYXf8BA1qZF9zZW5kX2ZyYW1l/QQKamRfdHhfaW5pdP4EB2pkX3NlbmT/BBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjgAUPamRfdHhfZ2V0X2ZyYW1lgQUQamRfdHhfZnJhbWVfc2VudIIFC2pkX3R4X2ZsdXNogwUQX19lcnJub19sb2NhdGlvboQFDF9fZnBjbGFzc2lmeYUFBWR1bW15hgUIX19tZW1jcHmHBQdtZW1tb3ZliAUGbWVtc2V0iQUKX19sb2NrZmlsZYoFDF9fdW5sb2NrZmlsZYsFBmZmbHVzaIwFBGZtb2SNBQ1fX0RPVUJMRV9CSVRTjgUMX19zdGRpb19zZWVrjwUNX19zdGRpb193cml0ZZAFDV9fc3RkaW9fY2xvc2WRBQhfX3RvcmVhZJIFCV9fdG93cml0ZZMFCV9fZndyaXRleJQFBmZ3cml0ZZUFFF9fcHRocmVhZF9tdXRleF9sb2NrlgUWX19wdGhyZWFkX211dGV4X3VubG9ja5cFBl9fbG9ja5gFCF9fdW5sb2NrmQUOX19tYXRoX2Rpdnplcm+aBQpmcF9iYXJyaWVymwUOX19tYXRoX2ludmFsaWScBQNsb2edBQV0b3AxNp4FBWxvZzEwnwUHX19sc2Vla6AFBm1lbWNtcKEFCl9fb2ZsX2xvY2uiBQxfX29mbF91bmxvY2ujBQxfX21hdGhfeGZsb3ekBQxmcF9iYXJyaWVyLjGlBQxfX21hdGhfb2Zsb3emBQxfX21hdGhfdWZsb3enBQRmYWJzqAUDcG93qQUFdG9wMTKqBQp6ZXJvaW5mbmFuqwUIY2hlY2tpbnSsBQxmcF9iYXJyaWVyLjKtBQpsb2dfaW5saW5lrgUKZXhwX2lubGluZa8FC3NwZWNpYWxjYXNlsAUNZnBfZm9yY2VfZXZhbLEFBXJvdW5ksgUGc3RyY2hyswULX19zdHJjaHJudWy0BQZzdHJjbXC1BQZzdHJsZW62BQdfX3VmbG93twUHX19zaGxpbbgFCF9fc2hnZXRjuQUHaXNzcGFjZboFBnNjYWxibrsFCWNvcHlzaWdubLwFB3NjYWxibmy9BQ1fX2ZwY2xhc3NpZnlsvgUFZm1vZGy/BQVmYWJzbMAFC19fZmxvYXRzY2FuwQUIaGV4ZmxvYXTCBQhkZWNmbG9hdMMFB3NjYW5leHDEBQZzdHJ0b3jFBQZzdHJ0b2TGBRJfX3dhc2lfc3lzY2FsbF9yZXTHBQhkbG1hbGxvY8gFBmRsZnJlZckFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZcoFBHNicmvLBQhfX2FkZHRmM8wFCV9fYXNobHRpM80FB19fbGV0ZjLOBQdfX2dldGYyzwUIX19kaXZ0ZjPQBQ1fX2V4dGVuZGRmdGYy0QUNX19leHRlbmRzZnRmMtIFC19fZmxvYXRzaXRm0wUNX19mbG9hdHVuc2l0ZtQFDV9fZmVfZ2V0cm91bmTVBRJfX2ZlX3JhaXNlX2luZXhhY3TWBQlfX2xzaHJ0aTPXBQhfX211bHRmM9gFCF9fbXVsdGkz2QUJX19wb3dpZGYy2gUIX19zdWJ0ZjPbBQxfX3RydW5jdGZkZjLcBQtzZXRUZW1wUmV0MN0FC2dldFRlbXBSZXQw3gUJc3RhY2tTYXZl3wUMc3RhY2tSZXN0b3Jl4AUKc3RhY2tBbGxvY+EFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnTiBRVlbXNjcmlwdGVuX3N0YWNrX2luaXTjBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl5AUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZeUFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZOYFDGR5bkNhbGxfamlqaecFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnoBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHmBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 25968;
var ___stop_em_js = Module['___stop_em_js'] = 27021;



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
