
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9uFgIAA2QUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEAAgUABQUDAgIDAgIDBAMDAwUCCAACAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQAKAAICAAEBAQABAAABAAAACgABAgABAQQFAQIAAAAACAMFCgICAgAGCgMJAwEGBQMGCQYGBQYFAwYGCQ0GAwMFBQMDAwMGBQYGBgYGBgEDDhECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBhECAgYOAwMDAwUFAwMDBAQFBQEDAAMDBAIAAwIFAAQFBQMGAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQEBAQICAgICAgICAgEBAQEBAgQEAQoNAgIAAAcJCQEDBwECAAgAAgYABwkIBAAEBAAAAgcAAwcHAQIBABIDCQcAAAQAAgcEBwQEAwMDBQIIBQUFBwUHBwMDBQgFAAAEHwEDDgMDAAkHAwUEAwQABAMDAwMEBAUFAAAABAQHBwcHBAcHBwgICAcEBAMQCAMABAEACQEDAwEDBgQJIAkXAwMEAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIQ8FBAQEBQkEBAAAFAsLCxMLDwUIByILFBQLGBMSEgsjJCUmCwMDAwQEFwQEGQwVJwwoBhYpKgYOBAQACAQMFRoaDBErAgIICBUMDBkMLAAICAAECAcICAgtDS4Eh4CAgAABcAHQAdABBYaAgIAAAQGAAoACBt2AgIAADn8BQbDuBQt/AUEAC38BQQALfwFBAAt/AEGwzAELfwBBn80BC38AQenOAQt/AEHlzwELfwBB4dABC38AQbHRAQt/AEHS0QELfwBB19MBC38AQbDMAQt/AEHN1AELB/2FgIAAIwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwDOBRZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AigUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUAzwUaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQALxFqZF9lbV9kZXZzX2RlcGxveQAwEWpkX2VtX2RldnNfdmVyaWZ5ADEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADMWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMLBmZmbHVzaACSBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQA6QUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQDqBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAOsFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZADsBQlzdGFja1NhdmUA5QUMc3RhY2tSZXN0b3JlAOYFCnN0YWNrQWxsb2MA5wUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudADoBQ1fX3N0YXJ0X2VtX2pzAwwMX19zdG9wX2VtX2pzAw0MZHluQ2FsbF9qaWppAO4FCZWDgIAAAQBBAQvP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QCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQwgQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBC7BBogAyAAKAIELQAOOgAKIAMoAhAPC0GsyABBijtBMUG7NRDwBAAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahD3Ag0AIAMgASkDADcDGAJAAkAgACADQRhqEKICIgINACADIAEpAwA3AxAgACADQRBqEKECIQEMAQsCQCAAIAIQowIiAQ0AQQAhAQwBCwJAIAAgAhCPAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAENICIANBKGogACAEELgCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBjC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQigIgAWohAgwBCyAAIAJBAEEAEIoCIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEJoCIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ7AIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNLDQIgASAFNgIAIAFBBToACgwDCwJAAkAgBA0AQQAhBQwBCyAELQADQQ9xIQULAkAgBUF8ag4GAAICAgIAAgsgASAENgIAIAFB0gA6AAogAyACKQMANwMo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DQAgAEEAEK4CIQQgASAAQeAAaikDACIINwMgIAEgCDcDQAJAAkAgACABQSBqEM8CRQ0AIAEgASkDQDcDACAAIAEgAUHYAGoQ0QIhAgwBCyABIAEpA0AiCDcDUCABIAg3AxgCQAJAIAAgAUEYahDwAg0AIAEgASkDUDcDECABQdgAaiAAQRIgAUEQahDlAkEAIQIMAQsgASABKQNQNwMIIAAgAUEIaiABQdgAahDyAiECCyACIQILIAIiBUUNACAAQQIQrgIhAiAAQQMQrgIhACABKAJYIgYgAk0NACABIAYgAmsiBjYCWCABKAJMIgcgBE0NACABIAcgBGsiBzYCTCADIARqIAUgAmogByAGIAAgBiAASRsiACAHIABJGxCNBRoLIAFB4ABqJAALHwEBfwJAIABBABCuAiIBQQBIDQAgACgCrAEgARB2CwsjAQF/IABB39QDIABBABCuAiIBIAFBoKt8akGhq3xJGxCBAQsJACAAQQAQgQELywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQ0QIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDOAiIFQX9qIgYQkwEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQzgIaDAELIAdBBmogAUEQaiAGEI0FGgsgACAHELMCCyABQeAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQrgIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqENYCIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEPYBIAFBIGokAAsOACAAIABBABCvAhCwAgsPACAAIABBABCvAp0QsAILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahD3AkUNACABIAEpA2g3AxAgASAAIAFBEGoQxAI2AgBBuhYgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqENYCIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABDRAiECIAEgASkDaDcDMCABIAAgAUEwahDEAjYCJCABIAI2AiBB7BYgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqENYCIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAENECIgJFDQAgAiABQSBqEKQEIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlAEQ7AIgACgCrAEgASkDGDcDIAsgAUEwaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQtAIiAkUNAAJAIAIoAgQNACACIABBHBCLAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8gAQ0gILIAEgASkDCDcDACAAIAJB9gAgARDYAiAAIAIQswILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAELQCIgJFDQACQCACKAIEDQAgAiAAQSAQiwI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfQAENICCyABIAEpAwg3AwAgACACQfYAIAEQ2AIgACACELMCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC0AiICRQ0AAkAgAigCBA0AIAIgAEEeEIsCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHzABDSAgsgASABKQMINwMAIAAgAkH2ACABENgCIAAgAhCzAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQtAIiAkUNAAJAIAIoAgQNACACIABBIhCLAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpBhAEQ0gILIAEgASkDCDcDACAAIAJB9gAgARDYAiAAIAIQswILIAFBEGokAAtiAQF/IwBBIGsiAyQAIAMgAikDADcDECADQRhqIAEgA0EQakH7ABCcAgJAAkAgAykDGEIAUg0AIABCADcDAAwBCyADIAMpAxg3AwggACABIANBCGpB4wAQnAILIANBIGokAAs1AgF/AX4jAEEQayIBJAAgASAAKQNQIgI3AwAgASACNwMIIAAgARDeAiAAEIUEIAFBEGokAAtcAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQFGDQELIAMgAikDADcDCCAAIAFBiwEgA0EIahDlAgwBCyAAIAIoAgAQ6gILIANBEGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxgCQAJAAkAgASgCHCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMYNwMIIAFBEGogAEGLASABQQhqEOUCQQAhAgwBCwJAIAAgASgCGBB8IgINACABQRBqIABBnTBBABDjAgsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABB5zFBABDjAgwBCyACIABB2ABqKQMANwMgIAJBARB1CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMYAkACQAJAIAEoAhwiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDGDcDCCABQRBqIABBiwEgAUEIahDlAkEAIQAMAQsCQCAAIAEoAhgQfCICDQAgAUEQaiAAQZ0wQQAQ4wILIAIhAAsCQCAAIgBFDQAgABB+CyABQSBqJAALMgEBfwJAIABBABCuAiIBQQBIDQAgACgCrAEiACABEHYgACAALQAQQfABcUEEcjoAEAsLGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAupAQEDfyMAQRBrIgEkAAJAAkAgAC0AQ0EBSw0AIAFBCGogAEGyJEEAEOMCDAELAkAgAEEAEK4CIgJBe2pBe0sNACABQQhqIABBoSRBABDjAgwBCyAAIAAtAENBf2oiAzoAQyAAQdgAaiAAQeAAaiADQf8BcUF/aiIDQQN0EI4FGiAAIAMgAhB9IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCaAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBuB8gA0EIahDmAgwBCyAAIAEgASgCoAEgBEH//wNxEJUCIAApAwBCAFINACADQdgAaiABQQggASABQQIQiwIQjwEQ7AIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAENICIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCqAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQkwIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahCaAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ5QIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGQyAFODQIgAEHw4gAgAUEDdGovAQAQ0gIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtBnBNBjTlBOEHvKhDwBAAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahD3Ag0AIAFBOGogAEGZGRDkAgsgASABKQNINwMgIAFBOGogACABQSBqENYCIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjQEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ0QIiAkUNACABQTBqIAAgAiABKAI4QQEQggIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCOASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQrgIhAiABIAEpAyA3AwgCQCABQQhqEPcCDQAgAUEYaiAAQfMaEOQCCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEIgCIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDtApsQsAILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ7QKcELACCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAi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SA0AIAMtAAIhCyACIAYgCUEDdGopAwA3AxAgACALIAQgASACQRBqEEsiAUUNACAKIQsCQCAKDQAgAy0AA0EedEEfdSADcSELCyALIQogBCABaiEEIANBBGohAQJAAkACQCADLwEERQ0AIAEhAwwBCyAKIQMgCg0AIAEhAUEAIQpBASELDAELIAMhASAKIQpBACELCyAEIQMMAQsgAyEBIAohCkEBIQsgBCEDCyADIQMgCiEKIAEhAQJAIAtFDQAgAyEDDAMLIAMhBCAJQQFqIgshCSAKIQogASEBIAMhAyALIAVHDQAMAgsACyAHIQMCQAJAIAUOAgIBAAsgAiAFNgIAIAJBKGogAEHMMyACEOMCIAchAwwBCyABLwEGIQMgAiAGKQMANwMIIAcgACADIAdB7AEgAkEIahBLaiEDCyAAQbACaiADIAdrOgAAIAJBMGokAAvXAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEJYCIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQasbIAFBEGoQ5gJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQZ4bIAFBCGoQ5gJBACEDCwJAIAMiA0UNACAAIAMQ4wEgACABKAIkIAMvAQJB/x9xQYDAAHIQ8gELIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQlgIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBqxsgA0EIahDmAkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQAC4kBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEJYCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQasbIANBCGoQ5gJBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BADYCACAAQQQ2AgQLIANBMGokAAuGAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGog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IAxqa0EEdSIAEHkhDCACIAA2AhggAiAMNgIUIAIgBiABazYCEEHOMiACQRBqEDwMAQsgAiAGNgIAQevGACACEDwLIAVBAWoiASEAIAEgAigCPEkNAAsLIAJBwABqJAALywIBAn8jAEHgAGsiAiQAIAIgAEGCAmpBIBD3BDYCQEG0FCACQcAAahA8IAIgASkDADcDOEEAIQMCQCAAIAJBOGoQtgJFDQAgAiABKQMANwMwIAJB2ABqIAAgAkEwakHjABCcAgJAAkAgAikDWFBFDQBBACEDDAELIAIgAikDWDcDKCAAQZMfIAJBKGoQwwJBASEDCyADIQMgAiABKQMANwMgIAJB0ABqIAAgAkEgakH2ABCcAgJAAkAgAikDUFBFDQAgAyEDDAELIAIgAikDUDcDGCAAQYUsIAJBGGoQwwIgAiABKQMANwMQIAJByABqIAAgAkEQakHxABCcAgJAIAIpA0hQDQAgAiACKQNINwMIIAAgAkEIahDdAgsgA0EBaiEDCyADIQMLAkAgAw0AIAIgASkDADcDACAAQZMfIAIQwwILIAJB4ABqJAALiAQBBn8jAEHgAGsiAyQAAkACQCAALQBFRQ0AIAMgASkDADcDQCAAQfIKIANBwABqEMMCDAELAkAgACgCqAENACADIAEpAwA3A1hB/R5BABA8IABBADoARSADIAMpA1g3AwAgACADEN4CIABB5dQDEIEBDAELIABBAToARSAAIAEpAwA3AzggAyABKQMANwM4IAAgA0E4ahC2AiEEIAJBAXENACAERQ0AIAMgASkDADcDMCADQdgAaiAAIANBMGpB8QAQnAIgAykDWEIAUg0AAkACQCAAKAKoASICDQBBACEFDAELIAIhAkEAIQQDQCAEQQFqIgQhBSACKAIMIgYhAiAEIQQgBg0ACwsCQAJAIAAgBSICQRAgAkEQSRsiBUEBdBCSASIHRQ0AAkAgACgCqAEiAkUNACAFRQ0AIAdBDGohCCACIQJBACEEA0AgCCAEIgRBAXRqIAIiAi8BBDsBACACKAIMIgJFDQEgAiECIARBAWoiBiEEIAYgBUkNAAsLIANB0ABqIABBCCAHEOwCDAELIANCADcDUAsgAyADKQNQNwMoIAAgA0EoahCNASADQcgAakHxABDSAiADIAEpAwA3AyAgAyADKQNINwMYIAMgAykDUDcD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aiABQQEQ7AMCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBJCyACQSBqJAALDQAgAEEAKQPYajcDAAs3AQF/AkAgAigCTCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIIBCzgBAX8CQCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIIBC3EBAX8jAEEgayIDJAAgA0EYaiACEOkDIAMgAykDGDcDEAJAAkACQCADQRBqENACDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDtAhDpAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOkDIANBEGogAhDpAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQqQIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEOkDIAJBIGogARDpAyACQRhqIAEQ6QMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCqAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDpAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQ/AINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDpAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQ/AINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDpAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQ/AINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpwILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ/AINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQQAQiwIhBCADIAMpAxA3AwAgACACIAQgAxClAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ/AINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQRUQiwIhBCADIAMpAxA3AwAgACACIAQgAxClAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEIsCEI8BIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEOwCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDqAyIDEJEBIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEOwCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDqAyIDEJIBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEOwCIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCCASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBD8Ag0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQggELIANBEGokAAtwAQJ/IwBBEGsi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AXIhByAEQQJyIQggAEEARyEJIAIhASADIQogAiECIAAhAwNAIAMhAyACIQIgCiELIAEiCkEBaiEBAkACQCAKLQAAIgxBJUYNACAMRQ0AIAEhASALIQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEI0FIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMELwFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEELwFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFB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aiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAENQFRQ0AIAMgBBDEBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDeBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADENYFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDUBUEASg0AAkAgASAJIAMgChDUBUUNACABIQQMAgsgBUHwAGogASACQgBCABDeBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ3gUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEN4FIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDeBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ3gUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EN4FIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4Mg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aiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAENAFTQ0AIAAQFUUNAQtBACAANgKszAEgAQ8LEIoFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDTBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ0wVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrENMFIAVBMGogCiABIAcQ3QUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDTBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDTBSAFIAIgBEEBIAZrEN0FIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDbBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDcBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqENMFQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ0wUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ3wUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ3wUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ3wUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ3wUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ3wUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ3wUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ3wUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ3wUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ3wUgBUGQAWogA0IPhkIAIARCABDfBSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEN8FIAVBgAFqQgEgAn1CACAEQgAQ3wUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhDfBSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDfBSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEN0FIAVBMGogFiATIAZB8ABqENMFIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEN8FIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ3wUgBSADIA5CBUIAEN8FIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDTBSACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDTBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqENMFIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqENMFIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqENMFQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqENMFIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGENMFIAVBIGogAiAEIAYQ0wUgBUEQaiASIAEgBxDdBSAFIAIgBCAHEN0FIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDSBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ0wUgAiAAIARBgfgAIANrEN0FIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBsO4FJANBsO4BQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEPAAslAQF+IAAgASACrSADrUIghoQgBBDtBSEFIAVCIIinEOMFIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC97MgYAAAwBBgAgL+L8BaW5maW5pdHkALUluZmluaXR5AGRldnNfdmVyaWZ5AGRldnNfanNvbl9zdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAERldlMtU0hBMjU2OiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AcHJvZ1ZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAZGV2TmFtZQBwcm9nTmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAFJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABmaWJlciBub3Qgc3VzcGVuZGVkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBkZXZzX2djX3RhZyhkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkgPT0gREVWU19HQ19UQUdfU1RSSU5HADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAKiAgcGM9JWQgQCA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNf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AM8AAABAdQAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmGUAADB3AQAAQbDMAQudCCh2b2lkICpzdGFydCwgdW5zaWduZWQgc2l6ZSk8Ojo+eyBpZiAoTW9kdWxlLmZsYXNoU2F2ZSkgTW9kdWxlLmZsYXNoU2F2ZShIRUFQVTguc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgc2l6ZSkpOyB9ACh2b2lkICpzdGFydCwgdW5zaWduZWQgc2l6ZSk8Ojo+eyBpZiAoTW9kdWxlLmZsYXNoTG9hZCkgeyBjb25zdCBkYXRhID0gTW9kdWxlLmZsYXNoTG9hZCgpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2coImZsYXNoIGxvYWQsIHNpemU9IiArIGRhdGEubGVuZ3RoKTsgSEVBUFU4LnNldChkYXRhLnNsaWNlKDAsIHNpemUpLCBzdGFydCk7IH0gfQAodm9pZCAqZnJhbWUpPDo6PnsgY29uc3Qgc3ogPSAxMiArIEhFQVBVOFtmcmFtZSArIDJdOyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoZXhpdGNvZGUpIGNvbnNvbGUubG9nKCJQQU5JQyIsIGV4aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AAD48ICAAARuYW1lAYhw8AUADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNfZGV2c19wYW5pY19oYW5kbGVyBBFlbV9kZXBsb3lfaGFuZGxlcgUXZW1famRfY3J5cHRvX2dldF9yYW5kb20GDWVtX3NlbmRfZnJhbWUHBGV4aXQIC2VtX3RpbWVfbm93CQ5lbV9wcmludF9kbWVzZwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3D2FwcF9wcmludF9kbWVzZzgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwJYXBwX2RtZXNnPQtmbHVzaF9kbWVzZz4LYXBwX3Byb2Nlc3M/B3R4X2luaXRAD2pkX3BhY2tldF9yZWFkeUEKdHhfcHJvY2Vzc0IXamRfd2Vic29ja19zZW5kX21lc3NhZ2VDDmpkX3dlYnNvY2tfbmV3RAZvbm9wZW5FB29uZXJyb3JGB29uY2xvc2VHCW9ubWVzc2FnZUgQamRfd2Vic29ja19jbG9zZUkOZGV2c19idWZmZXJfb3BKEmRldnNfYnVmZmVyX2RlY29kZUsSZGV2c19idWZmZXJfZW5jb2RlTA9kZXZzX2NyZWF0ZV9jdHhNCXNldHVwX2N0eE4KZGV2c190cmFjZU8PZGV2c19lcnJvcl9jb2RlUBlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUQljbGVhcl9jdHhSDWRldnNfZnJlZV9jdHhTCGRldnNfb29tVAlkZXZzX2ZyZWVVEWRldnNjbG91ZF9wcm9jZXNzVhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFcUZGV2c2Nsb3VkX29uX21lc3NhZ2VYDmRldnNjbG91ZF9pbml0WQ9kZXZzZGJnX3Byb2Nlc3NaEWRldnNkYmdfcmVzdGFydGVkWxVkZXZzZGJnX2hhbmRsZV9wYWNrZXRcC3NlbmRfdmFsdWVzXRF2YWx1ZV9mcm9tX3RhZ192MF4ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZV8Nb2JqX2dldF9wcm9wc2AMZXhwYW5kX3ZhbHVlYRJkZXZzZGJnX3N1c3BlbmRfY2JiDGRldnNkYmdfaW5pdGMQZXhwYW5kX2tleV92YWx1ZWQGa3ZfYWRkZQ9kZXZzbWdyX3Byb2Nlc3NmB3RyeV9ydW5nDHN0b3BfcHJvZ3JhbWgPZGV2c21ncl9yZXN0YXJ0aRRkZXZzbWdyX2RlcGxveV9zdGFydGoUZGV2c21ncl9kZXBsb3lfd3JpdGVrEGRldnNtZ3JfZ2V0X2hhc2hsFWRldnNtZ3JfaGFuZGxlX3BhY2tldG0OZGVwbG95X2hhbmRsZXJuE2RlcGxveV9tZXRhX2hhbmRsZXJvD2RldnNtZ3JfZ2V0X2N0eHAOZGV2c21ncl9kZXBsb3lxDGRldnNtZ3JfaW5pdHIRZGV2c21ncl9jbGllbnRfZXZzEGRldnNfZmliZXJfeWllbGR0GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnUYZGV2c19maWJlcl9zZXRfd2FrZV90aW1ldhBkZXZzX2ZpYmVyX3NsZWVwdxtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx4GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzeRFkZXZzX2ltZ19mdW5fbmFtZXoSZGV2c19pbWdfcm9sZV9uYW1lexJkZXZzX2ZpYmVyX2J5X2ZpZHh8EWRldnNfZmliZXJfYnlfdGFnfRBkZXZzX2ZpYmVyX3N0YXJ0fhRkZXZzX2ZpYmVyX3Rlcm1pYW50ZX8OZGV2c19maWJlcl9ydW6AARNkZXZzX2ZpYmVyX3N5bmNfbm93gQEKZGV2c19wYW5pY4IBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYMBD2RldnNfZmliZXJfcG9rZYQBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWFARNqZF9nY19hbnlfdHJ5X2FsbG9jhgEHZGV2c19nY4cBD2ZpbmRfZnJlZV9ibG9ja4gBEmRldnNfYW55X3RyeV9hbGxvY4kBDmRldnNfdHJ5X2FsbG9jigELamRfZ2NfdW5waW6LAQpqZF9nY19mcmVljAEUZGV2c192YWx1ZV9pc19waW5uZWSNAQ5kZXZzX3ZhbHVlX3Bpbo4BEGRldnNfdmFsdWVfdW5waW6PARJkZXZzX21hcF90cnlfYWxsb2OQARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2ORARRkZXZzX2FycmF5X3RyeV9hbGxvY5IBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5MBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5QBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lQEPZGV2c19nY19zZXRfY3R4lgEOZGV2c19nY19jcmVhdGWXAQ9kZXZzX2djX2Rlc3Ryb3mYARFkZXZzX2djX29ial9jaGVja5kBC3NjYW5fZ2Nfb2JqmgERcHJvcF9BcnJheV9sZW5ndGibARJtZXRoMl9BcnJheV9pbnNlcnScARJmdW4xX0FycmF5X2lzQXJyYXmdARBtZXRoWF9BcnJheV9wdXNongEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlnwERbWV0aFhfQXJyYXlfc2xpY2WgARFmdW4xX0J1ZmZlcl9hbGxvY6EBEnByb3BfQnVmZmVyX2xlbmd0aKIBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ6MBE21ldGgzX0J1ZmZlcl9maWxsQXSkARNtZXRoNF9CdWZmZXJfYmxpdEF0pQEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCmARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOnARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SoARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSpARdmdW4yX0RldmljZVNjcmlwdF9wcmludKoBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSrARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludKwBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByrQEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbmeuARRtZXRoMV9FcnJvcl9fX2N0b3JfX68BGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+wARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+xARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7IBD3Byb3BfRXJyb3JfbmFtZbMBEW1ldGgwX0Vycm9yX3ByaW50tAEPcHJvcF9Ec0ZpYmVyX2lktQEUbWV0aDFfRHNGaWJlcl9yZXN1bWW2ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZbcBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmS4ARFmdW4wX0RzRmliZXJfc2VsZrkBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0ugEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGW7ARJwcm9wX0Z1bmN0aW9uX25hbWW8AQ9mdW4yX0pTT05fcGFyc2W9ARNmdW4zX0pTT05fc3RyaW5naWZ5vgEOZnVuMV9NYXRoX2NlaWy/AQ9mdW4xX01hdGhfZmxvb3LAAQ9mdW4xX01hdGhfcm91bmTBAQ1mdW4xX01hdGhfYWJzwgEQZnVuMF9NYXRoX3JhbmRvbcMBE2Z1bjFfTWF0aF9yYW5kb21JbnTEAQ1mdW4xX01hdGhfbG9nxQENZnVuMl9NYXRoX3Bvd8YBDmZ1bjJfTWF0aF9pZGl2xwEOZnVuMl9NYXRoX2ltb2TIAQ5mdW4yX01hdGhfaW11bMkBDWZ1bjJfTWF0aF9taW7KAQtmdW4yX21pbm1heMsBDWZ1bjJfTWF0aF9tYXjMARJmdW4yX09iamVjdF9hc3NpZ27NARBmdW4xX09iamVjdF9rZXlzzgETZnVuMV9rZXlzX29yX3ZhbHVlc88BEmZ1bjFfT2JqZWN0X3ZhbHVlc9ABGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m0QEQcHJvcF9QYWNrZXRfcm9sZdIBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLTARNwcm9wX1BhY2tldF9zaG9ydElk1AEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV41QEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTWARFwcm9wX1BhY2tldF9mbGFnc9cBFXByb3BfUGFja2V0X2lzQ29tbWFuZNgBFHByb3BfUGFja2V0X2lzUmVwb3J02QETcHJvcF9QYWNrZXRfcGF5bG9hZNoBE3Byb3BfUGFja2V0X2lzRXZlbnTbARVwcm9wX1BhY2tldF9ldmVudENvZGXcARRwcm9wX1BhY2tldF9pc1JlZ1NldN0BFHByb3BfUGFja2V0X2lzUmVnR2V03gETcHJvcF9QYWNrZXRfcmVnQ29kZd8BE21ldGgwX1BhY2tldF9kZWNvZGXgARJkZXZzX3BhY2tldF9kZWNvZGXhARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTiARREc1JlZ2lzdGVyX3JlYWRfY29udOMBEmRldnNfcGFja2V0X2VuY29kZeQBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXlARZwcm9wX0RzUGFja2V0SW5mb19yb2xl5gEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZecBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXoARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/pARNwcm9wX0RzUm9sZV9pc0JvdW5k6gEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k6wERbWV0aDBfRHNSb2xlX3dhaXTsARJwcm9wX1N0cmluZ19sZW5ndGjtARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdO4BE21ldGgxX1N0cmluZ19jaGFyQXTvARJtZXRoMl9TdHJpbmdfc2xpY2XwARRkZXZzX2pkX2dldF9yZWdpc3RlcvEBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTyARBkZXZzX2pkX3NlbmRfY21k8wERZGV2c19qZF93YWtlX3JvbGX0ARRkZXZzX2pkX3Jlc2V0X3BhY2tldPUBE2RldnNfamRfcGt0X2NhcHR1cmX2ARNkZXZzX2pkX3NlbmRfbG9nbXNn9wESZGV2c19qZF9zaG91bGRfcnVu+AEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX5ARNkZXZzX2pkX3Byb2Nlc3NfcGt0+gEUZGV2c19qZF9yb2xlX2NoYW5nZWT7ARJkZXZzX2pkX2luaXRfcm9sZXP8ARJkZXZzX2pkX2ZyZWVfcm9sZXP9ARVkZXZzX3NldF9nbG9iYWxfZmxhZ3P+ARdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc/8BFWRldnNfZ2V0X2dsb2JhbF9mbGFnc4ACEGRldnNfanNvbl9lc2NhcGWBAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWCAg9kZXZzX2pzb25fcGFyc2WDAgpqc29uX3ZhbHVlhAIMcGFyc2Vfc3RyaW5nhQINc3RyaW5naWZ5X29iaoYCCmFkZF9pbmRlbnSHAg9zdHJpbmdpZnlfZmllbGSIAhNkZXZzX2pzb25fc3RyaW5naWZ5iQIRcGFyc2Vfc3RyaW5nX2NvcmWKAhFkZXZzX21hcGxpa2VfaXRlcosCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0jAISZGV2c19tYXBfY29weV9pbnRvjQIMZGV2c19tYXBfc2V0jgIGbG9va3VwjwITZGV2c19tYXBsaWtlX2lzX21hcJACG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc5ECEWRldnNfYXJyYXlfaW5zZXJ0kgIIa3ZfYWRkLjGTAhJkZXZzX3Nob3J0X21hcF9zZXSUAg9kZXZzX21hcF9kZWxldGWVAhJkZXZzX3Nob3J0X21hcF9nZXSWAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJcCDmRldnNfcm9sZV9zcGVjmAISZGV2c19mdW5jdGlvbl9iaW5kmQIRZGV2c19tYWtlX2Nsb3N1cmWaAg5kZXZzX2dldF9mbmlkeJsCE2RldnNfZ2V0X2ZuaWR4X2NvcmWcAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSdAhNkZXZzX2dldF9yb2xlX3Byb3RvngIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3nwIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkoAIVZGV2c19nZXRfc3RhdGljX3Byb3RvoQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvogIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2jAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvpAIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkpQIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kpgIQZGV2c19pbnN0YW5jZV9vZqcCD2RldnNfb2JqZWN0X2dldKgCDGRldnNfc2VxX2dldKkCDGRldnNfYW55X2dldKoCDGRldnNfYW55X3NldKsCDGRldnNfc2VxX3NldKwCDmRldnNfYXJyYXlfc2V0rQITZGV2c19hcnJheV9waW5fcHVzaK4CDGRldnNfYXJnX2ludK8CD2RldnNfYXJnX2RvdWJsZbACD2RldnNfcmV0X2RvdWJsZbECDGRldnNfcmV0X2ludLICDWRldnNfcmV0X2Jvb2yzAg9kZXZzX3JldF9nY19wdHK0AhFkZXZzX2FyZ19zZWxmX21hcLUCEWRldnNfc2V0dXBfcmVzdW1ltgIPZGV2c19jYW5fYXR0YWNotwIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZbgCFWRldnNfbWFwbGlrZV90b192YWx1ZbkCEmRldnNfcmVnY2FjaGVfZnJlZboCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGy7AhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZLwCE2RldnNfcmVnY2FjaGVfYWxsb2O9AhRkZXZzX3JlZ2NhY2hlX2xvb2t1cL4CEWRldnNfcmVnY2FjaGVfYWdlvwIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXAAhJkZXZzX3JlZ2NhY2hlX25leHTBAg9qZF9zZXR0aW5nc19nZXTCAg9qZF9zZXR0aW5nc19zZXTDAg5kZXZzX2xvZ192YWx1ZcQCD2RldnNfc2hvd192YWx1ZcUCEGRldnNfc2hvd192YWx1ZTDGAg1jb25zdW1lX2NodW5rxwINc2hhXzI1Nl9jbG9zZcgCD2pkX3NoYTI1Nl9zZXR1cMkCEGpkX3NoYTI1Nl91cGRhdGXKAhBqZF9zaGEyNTZfZmluaXNoywIUamRfc2hhMjU2X2htYWNfc2V0dXDMAhVqZF9zaGEyNTZfaG1hY19maW5pc2jNAg5qZF9zaGEyNTZfaGtkZs4CDmRldnNfc3RyZm9ybWF0zwIOZGV2c19pc19zdHJpbmfQAg5kZXZzX2lzX251bWJlctECFGRldnNfc3RyaW5nX2dldF91dGY40gITZGV2c19idWlsdGluX3N0cmluZ9MCFGRldnNfc3RyaW5nX3ZzcHJpbnRm1AITZGV2c19zdHJpbmdfc3ByaW50ZtUCFWRldnNfc3RyaW5nX2Zyb21fdXRmONYCFGRldnNfdmFsdWVfdG9fc3RyaW5n1wIQYnVmZmVyX3RvX3N0cmluZ9gCGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTZAhJkZXZzX3N0cmluZ19jb25jYXTaAhFkZXZzX3N0cmluZ19zbGljZdsCEmRldnNfcHVzaF90cnlmcmFtZdwCEWRldnNfcG9wX3RyeWZyYW1l3QIPZGV2c19kdW1wX3N0YWNr3gITZGV2c19kdW1wX2V4Y2VwdGlvbt8CCmRldnNfdGhyb3fgAhJkZXZzX3Byb2Nlc3NfdGhyb3fhAhBkZXZzX2FsbG9jX2Vycm9y4gIVZGV2c190aHJvd190eXBlX2Vycm9y4wIWZGV2c190aHJvd19yYW5nZV9lcnJvcuQCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcuUCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y5gIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh05wIYZGV2c190aHJvd190b29fYmlnX2Vycm9y6AIXZGV2c190aHJvd19zeW50YXhfZXJyb3LpAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl6gITZGV2c192YWx1ZV9mcm9tX2ludOsCFGRldnNfdmFsdWVfZnJvbV9ib29s7AIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLtAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZe4CEWRldnNfdmFsdWVfdG9faW507wISZGV2c192YWx1ZV90b19ib29s8AIOZGV2c19pc19idWZmZXLxAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfICEGRldnNfYnVmZmVyX2RhdGHzAhNkZXZzX2J1ZmZlcmlzaF9kYXRh9AIUZGV2c192YWx1ZV90b19nY19vYmr1Ag1kZXZzX2lzX2FycmF59gIRZGV2c192YWx1ZV90eXBlb2b3Ag9kZXZzX2lzX251bGxpc2j4AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk+QIUZGV2c192YWx1ZV9hcHByb3hfZXH6AhJkZXZzX3ZhbHVlX2llZWVfZXH7Ah5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP8AhJkZXZzX2ltZ19zdHJpZHhfb2v9AhJkZXZzX2R1bXBfdmVyc2lvbnP+AgtkZXZzX3Zlcmlmef8CEWRldnNfZmV0Y2hfb3Bjb2RlgAMOZGV2c192bV9yZXN1bWWBAxFkZXZzX3ZtX3NldF9kZWJ1Z4IDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHODAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSEAw9kZXZzX3ZtX3N1c3BlbmSFAxZkZXZzX3ZtX3NldF9icmVha3BvaW50hgMUZGV2c192bV9leGVjX29wY29kZXOHAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIgDEWRldnNfaW1nX2dldF91dGY4iQMUZGV2c19nZXRfc3RhdGljX3V0ZjiKAw9kZXZzX3ZtX3JvbGVfb2uLAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIwDDGV4cHJfaW52YWxpZI0DFGV4cHJ4X2J1aWx0aW5fb2JqZWN0jgMLc3RtdDFfY2FsbDCPAwtzdG10Ml9jYWxsMZADC3N0bXQzX2NhbGwykQMLc3RtdDRfY2FsbDOSAwtzdG10NV9jYWxsNJMDC3N0bXQ2X2NhbGw1lAMLc3RtdDdfY2FsbDaVAwtzdG10OF9jYWxsN5YDC3N0bXQ5X2NhbGw4lwMSc3RtdDJfaW5kZXhfZGVsZXRlmAMMc3RtdDFfcmV0dXJumQMJc3RtdHhfam1wmgMMc3RtdHgxX2ptcF96mwMKZXhwcjJfYmluZJwDEmV4cHJ4X29iamVjdF9maWVsZJ0DEnN0bXR4MV9zdG9yZV9sb2NhbJ4DE3N0bXR4MV9zdG9yZV9nbG9iYWyfAxJzdG10NF9zdG9yZV9idWZmZXKgAwlleHByMF9pbmahAxBleHByeF9sb2FkX2xvY2FsogMRZXhwcnhfbG9hZF9nbG9iYWyjAwtleHByMV91cGx1c6QDC2V4cHIyX2luZGV4pQMPc3RtdDNfaW5kZXhfc2V0pgMUZXhwcngxX2J1aWx0aW5fZmllbGSnAxJleHByeDFfYXNjaWlfZmllbGSoAxFleHByeDFfdXRmOF9maWVsZKkDEGV4cHJ4X21hdGhfZmllbGSqAw5leHByeF9kc19maWVsZKsDD3N0bXQwX2FsbG9jX21hcKwDEXN0bXQxX2FsbG9jX2FycmF5rQMSc3RtdDFfYWxsb2NfYnVmZmVyrgMRZXhwcnhfc3RhdGljX3JvbGWvAxNleHByeF9zdGF0aWNfYnVmZmVysAMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nsQMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7IDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7MDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrQDDWV4cHJ4X2xpdGVyYWy1AxFleHByeF9saXRlcmFsX2Y2NLYDEGV4cHJ4X3JvbGVfcHJvdG+3AxFleHByM19sb2FkX2J1ZmZlcrgDDWV4cHIwX3JldF92YWy5AwxleHByMV90eXBlb2a6Aw9leHByMF91bmRlZmluZWS7AxJleHByMV9pc191bmRlZmluZWS8AwpleHByMF90cnVlvQMLZXhwcjBfZmFsc2W+Aw1leHByMV90b19ib29svwMJZXhwcjBfbmFuwAMJZXhwcjFfYWJzwQMNZXhwcjFfYml0X25vdMIDDGV4cHIxX2lzX25hbsMDCWV4cHIxX25lZ8QDCWV4cHIxX25vdMUDDGV4cHIxX3RvX2ludMYDCWV4cHIyX2FkZMcDCWV4cHIyX3N1YsgDCWV4cHIyX211bMkDCWV4cHIyX2RpdsoDDWV4cHIyX2JpdF9hbmTLAwxleHByMl9iaXRfb3LMAw1leHByMl9iaXRfeG9yzQMQZXhwcjJfc2hpZnRfbGVmdM4DEWV4cHIyX3NoaWZ0X3JpZ2h0zwMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTQAwhleHByMl9lcdEDCGV4cHIyX2xl0gMIZXhwcjJfbHTTAwhleHByMl9uZdQDFXN0bXQxX3Rlcm1pbmF0ZV9maWJlctUDFHN0bXR4Ml9zdG9yZV9jbG9zdXJl1gMTZXhwcngxX2xvYWRfY2xvc3VyZdcDEmV4cHJ4X21ha2VfY2xvc3VyZdgDEGV4cHIxX3R5cGVvZl9zdHLZAwxleHByMF9ub3dfbXPaAxZleHByMV9nZXRfZmliZXJfaGFuZGxl2wMQc3RtdDJfY2FsbF9hcnJhedwDCXN0bXR4X3Ryed0DDXN0bXR4X2VuZF90cnneAwtzdG10MF9jYXRjaN8DDXN0bXQwX2ZpbmFsbHngAwtzdG10MV90aHJvd+EDDnN0bXQxX3JlX3Rocm934gMQc3RtdHgxX3Rocm93X2ptcOMDDnN0bXQwX2RlYnVnZ2Vy5AMJZXhwcjFfbmV35QMRZXhwcjJfaW5zdGFuY2Vfb2bmAwpleHByMF9udWxs5wMPZXhwcjJfYXBwcm94X2Vx6AMPZXhwcjJfYXBwcm94X25l6QMPZGV2c192bV9wb3BfYXJn6gMTZGV2c192bV9wb3BfYXJnX3UzMusDE2RldnNfdm1fcG9wX2FyZ19pMzLsAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy7QMSamRfYWVzX2NjbV9lbmNyeXB07gMSamRfYWVzX2NjbV9kZWNyeXB07wMMQUVTX2luaXRfY3R48AMPQUVTX0VDQl9lbmNyeXB08QMQamRfYWVzX3NldHVwX2tlefIDDmpkX2Flc19lbmNyeXB08wMQamRfYWVzX2NsZWFyX2tlefQDC2pkX3dzc2tfbmV39QMUamRfd3Nza19zZW5kX21lc3NhZ2X2AxNqZF93ZWJzb2NrX29uX2V2ZW509wMHZGVjcnlwdPgDDWpkX3dzc2tfY2xvc2X5AxBqZF93c3NrX29uX2V2ZW50+gMLcmVzcF9zdGF0dXP7AxJ3c3NraGVhbHRoX3Byb2Nlc3P8AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZf0DFHdzc2toZWFsdGhfcmVjb25uZWN0/gMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0/wMPc2V0X2Nvbm5fc3RyaW5ngAQRY2xlYXJfY29ubl9zdHJpbmeBBA93c3NraGVhbHRoX2luaXSCBBF3c3NrX3NlbmRfbWVzc2FnZYMEEXdzc2tfaXNfY29ubmVjdGVkhAQSd3Nza19zZXJ2aWNlX3F1ZXJ5hQQUZGV2c190cmFja19leGNlcHRpb26GBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplhwQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYgED3JvbGVtZ3JfcHJvY2Vzc4kEEHJvbGVtZ3JfYXV0b2JpbmSKBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSLBBRqZF9yb2xlX21hbmFnZXJfaW5pdIwEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZI0EDWpkX3JvbGVfYWxsb2OOBBBqZF9yb2xlX2ZyZWVfYWxsjwQWamRfcm9sZV9mb3JjZV9hdXRvYmluZJAEE2pkX2NsaWVudF9sb2dfZXZlbnSRBBNqZF9jbGllbnRfc3Vic2NyaWJlkgQUamRfY2xpZW50X2VtaXRfZXZlbnSTBBRyb2xlbWdyX3JvbGVfY2hhbmdlZJQEEGpkX2RldmljZV9sb29rdXCVBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WWBBNqZF9zZXJ2aWNlX3NlbmRfY21klwQRamRfY2xpZW50X3Byb2Nlc3OYBA5qZF9kZXZpY2VfZnJlZZkEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0mgQPamRfZGV2aWNlX2FsbG9jmwQPamRfY3RybF9wcm9jZXNznAQVamRfY3RybF9oYW5kbGVfcGFja2V0nQQMamRfY3RybF9pbml0ngQUZGNmZ19zZXRfdXNlcl9jb25maWefBAlkY2ZnX2luaXSgBA1kY2ZnX3ZhbGlkYXRloQQOZGNmZ19nZXRfZW50cnmiBAxkY2ZnX2dldF9pMzKjBAxkY2ZnX2dldF91MzKkBA9kY2ZnX2dldF9zdHJpbmelBAxkY2ZnX2lkeF9rZXmmBAlqZF92ZG1lc2enBBFqZF9kbWVzZ19zdGFydHB0cqgEDWpkX2RtZXNnX3JlYWSpBBJqZF9kbWVzZ19yZWFkX2xpbmWqBBNqZF9zZXR0aW5nc19nZXRfYmluqwQNamRfZnN0b3JfaW5pdKwEE2pkX3NldHRpbmdzX3NldF9iaW6tBAtqZF9mc3Rvcl9nY64ED3JlY29tcHV0ZV9jYWNoZa8EFWpkX3NldHRpbmdzX2dldF9sYXJnZbAEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2WxBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZbIEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2WzBA1qZF9pcGlwZV9vcGVutAQWamRfaXBpcGVfaGFuZGxlX3BhY2tldLUEDmpkX2lwaXBlX2Nsb3NltgQSamRfbnVtZm10X2lzX3ZhbGlktwQVamRfbnVtZm10X3dyaXRlX2Zsb2F0uAQTamRfbnVtZm10X3dyaXRlX2kzMrkEEmpkX251bWZtdF9yZWFkX2kzMroEFGpkX251bWZtdF9yZWFkX2Zsb2F0uwQRamRfb3BpcGVfb3Blbl9jbWS8BBRqZF9vcGlwZV9vcGVuX3JlcG9ydL0EFmpkX29waXBlX2hhbmRsZV9wYWNrZXS+BBFqZF9vcGlwZV93cml0ZV9leL8EEGpkX29waXBlX3Byb2Nlc3PABBRqZF9vcGlwZV9jaGVja19zcGFjZcEEDmpkX29waXBlX3dyaXRlwgQOamRfb3BpcGVfY2xvc2XDBA1qZF9xdWV1ZV9wdXNoxAQOamRfcXVldWVfZnJvbnTFBA5qZF9xdWV1ZV9zaGlmdMYEDmpkX3F1ZXVlX2FsbG9jxwQNamRfcmVzcG9uZF91OMgEDmpkX3Jlc3BvbmRfdTE2yQQOamRfcmVzcG9uZF91MzLKBBFqZF9yZXNwb25kX3N0cmluZ8sEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkzAQLamRfc2VuZF9wa3TNBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbM4EF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyzwQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldNAEFGpkX2FwcF9oYW5kbGVfcGFja2V00QQVamRfYXBwX2hhbmRsZV9jb21tYW5k0gQVYXBwX2dldF9pbnN0YW5jZV9uYW1l0wQTamRfYWxsb2NhdGVfc2VydmljZdQEEGpkX3NlcnZpY2VzX2luaXTVBA5qZF9yZWZyZXNoX25vd9YEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTXBBRqZF9zZXJ2aWNlc19hbm5vdW5jZdgEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l2QQQamRfc2VydmljZXNfdGlja9oEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ9sEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl3AQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZd0EFGFwcF9nZXRfZGV2aWNlX2NsYXNz3gQSYXBwX2dldF9md192ZXJzaW9u3wQNamRfc3J2Y2ZnX3J1buAEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l4QQRamRfc3J2Y2ZnX3ZhcmlhbnTiBA1qZF9oYXNoX2ZudjFh4wQMamRfZGV2aWNlX2lk5AQJamRfcmFuZG9t5QQIamRfY3JjMTbmBA5qZF9jb21wdXRlX2NyY+cEDmpkX3NoaWZ0X2ZyYW1l6AQMamRfd29yZF9tb3Zl6QQOamRfcmVzZXRfZnJhbWXqBBBqZF9wdXNoX2luX2ZyYW1l6wQNamRfcGFuaWNfY29yZewEE2pkX3Nob3VsZF9zYW1wbGVfbXPtBBBqZF9zaG91bGRfc2FtcGxl7gQJamRfdG9faGV47wQLamRfZnJvbV9oZXjwBA5qZF9hc3NlcnRfZmFpbPEEB2pkX2F0b2nyBAtqZF92c3ByaW50ZvMED2pkX3ByaW50X2RvdWJsZfQECmpkX3NwcmludGb1BBJqZF9kZXZpY2Vfc2hvcnRfaWT2BAxqZF9zcHJpbnRmX2H3BAtqZF90b19oZXhfYfgECWpkX3N0cmR1cPkECWpkX21lbWR1cPoEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWX7BBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVl/AQRamRfc2VuZF9ldmVudF9leHT9BApqZF9yeF9pbml0/gQUamRfcnhfZnJhbWVfcmVjZWl2ZWT/BB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4AFD2pkX3J4X2dldF9mcmFtZYEFE2pkX3J4X3JlbGVhc2VfZnJhbWWCBRFqZF9zZW5kX2ZyYW1lX3Jhd4MFDWpkX3NlbmRfZnJhbWWEBQpqZF90eF9pbml0hQUHamRfc2VuZIYFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOHBQ9qZF90eF9nZXRfZnJhbWWIBRBqZF90eF9mcmFtZV9zZW50iQULamRfdHhfZmx1c2iKBRBfX2Vycm5vX2xvY2F0aW9uiwUMX19mcGNsYXNzaWZ5jAUFZHVtbXmNBQhfX21lbWNweY4FB21lbW1vdmWPBQZtZW1zZXSQBQpfX2xvY2tmaWxlkQUMX191bmxvY2tmaWxlkgUGZmZsdXNokwUEZm1vZJQFDV9fRE9VQkxFX0JJVFOVBQxfX3N0ZGlvX3NlZWuWBQ1fX3N0ZGlvX3dyaXRllwUNX19zdGRpb19jbG9zZZgFCF9fdG9yZWFkmQUJX190b3dyaXRlmgUJX19md3JpdGV4mwUGZndyaXRlnAUUX19wdGhyZWFkX211dGV4X2xvY2udBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrngUGX19sb2NrnwUIX191bmxvY2ugBQ5fX21hdGhfZGl2emVyb6EFCmZwX2JhcnJpZXKiBQ5fX21hdGhfaW52YWxpZKMFA2xvZ6QFBXRvcDE2pQUFbG9nMTCmBQdfX2xzZWVrpwUGbWVtY21wqAUKX19vZmxfbG9ja6kFDF9fb2ZsX3VubG9ja6oFDF9fbWF0aF94Zmxvd6sFDGZwX2JhcnJpZXIuMawFDF9fbWF0aF9vZmxvd60FDF9fbWF0aF91Zmxvd64FBGZhYnOvBQNwb3ewBQV0b3AxMrEFCnplcm9pbmZuYW6yBQhjaGVja2ludLMFDGZwX2JhcnJpZXIuMrQFCmxvZ19pbmxpbmW1BQpleHBfaW5saW5ltgULc3BlY2lhbGNhc2W3BQ1mcF9mb3JjZV9ldmFsuAUFcm91bmS5BQZzdHJjaHK6BQtfX3N0cmNocm51bLsFBnN0cmNtcLwFBnN0cmxlbr0FB19fdWZsb3e+BQdfX3NobGltvwUIX19zaGdldGPABQdpc3NwYWNlwQUGc2NhbGJuwgUJY29weXNpZ25swwUHc2NhbGJubMQFDV9fZnBjbGFzc2lmeWzFBQVmbW9kbMYFBWZhYnNsxwULX19mbG9hdHNjYW7IBQhoZXhmbG9hdMkFCGRlY2Zsb2F0ygUHc2NhbmV4cMsFBnN0cnRveMwFBnN0cnRvZM0FEl9fd2FzaV9zeXNjYWxsX3JldM4FCGRsbWFsbG9jzwUGZGxmcmVl0AUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl0QUEc2Jya9IFCF9fYWRkdGYz0wUJX19hc2hsdGkz1AUHX19sZXRmMtUFB19fZ2V0ZjLWBQhfX2RpdnRmM9cFDV9fZXh0ZW5kZGZ0ZjLYBQ1fX2V4dGVuZHNmdGYy2QULX19mbG9hdHNpdGbaBQ1fX2Zsb2F0dW5zaXRm2wUNX19mZV9nZXRyb3VuZNwFEl9fZmVfcmFpc2VfaW5leGFjdN0FCV9fbHNocnRpM94FCF9fbXVsdGYz3wUIX19tdWx0aTPgBQlfX3Bvd2lkZjLhBQhfX3N1YnRmM+IFDF9fdHJ1bmN0ZmRmMuMFC3NldFRlbXBSZXQw5AULZ2V0VGVtcFJldDDlBQlzdGFja1NhdmXmBQxzdGFja1Jlc3RvcmXnBQpzdGFja0FsbG9j6AUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudOkFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOoFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXrBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl7AUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k7QUMZHluQ2FsbF9qaWpp7gUWbGVnYWxzdHViJGR5bkNhbGxfamlqae8FGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAe0FBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 26160;
var ___stop_em_js = Module['___stop_em_js'] = 27213;



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
