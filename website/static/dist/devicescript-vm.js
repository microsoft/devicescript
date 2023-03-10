
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9OFgIAA0QUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGBwIHBwMJBQUFBQcWCg0FAgYDBgAAAgIAAgEAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYABQICAgADAwMDBQAAAAIBAAUABQUDAgIDAgIDBAMDAwUCCAADAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQAKAAICAAEBAQABAAABAAAACgABAgABAQQFAQIAAAAACAMFCgICAgAGCgMJAwEGBQMGCQYGBQYFAwYGCQ0GAwMFBQMDAwMGBQYGBgYGBgEDDhECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBhECAgYOAwMDAwUFAwMDBAQFBQEDAAMDBAIAAwIFAAQFBQMGAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQEBAQICAgICAgICAgEBAQEBAgQEAQoNAgIAAAcJCQEDBwECAAgAAgYABwkIBAAEBAAAAgcAAwcHAQIBABIDCQcAAAQAAgcEBwQEAwMDBQICCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXABygHKAQWGgICAAAEBgAKAAgbdgICAAA5/AUHA7AULfwFBAAt/AUEAC38BQQALfwBBwMoBC38AQa/LAQt/AEH5zAELfwBB9c0BC38AQfHOAQt/AEHBzwELfwBB4s8BC38AQefRAQt/AEHAygELfwBB3dIBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MAxgUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAIIFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAMcFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAigUVZW1zY3JpcHRlbl9zdGFja19pbml0AOEFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA4gUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQDjBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA5AUJc3RhY2tTYXZlAN0FDHN0YWNrUmVzdG9yZQDeBQpzdGFja0FsbG9jAN8FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA4AUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlqaQDmBQmJg4CAAAEAQQELyQEqO0JDREVT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IAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQswQaIAMgACgCBC0ADjoACiADKAIQDwtB9MYAQdI5QTFBgzQQ6AQAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ7gINACADIAEpAwA3AxgCQAJAIAAgA0EYahCZAiICDQAgAyABKQMANwMQIAAgA0EQahCYAiEBDAELAkAgACACEJoCIgENAEEAIQEMAQsCQCAAIAIQhgINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDJAiADQShqIAAgBBCvAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQYQtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEIECIAFqIQIMAQsgACACQQBBABCBAiABaiECCyADQcAAaiQAIAIL4wcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCRAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEOMCIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEF02AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEO0CDg0BBAsF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C28CAn8BfiMAQSBrIgEkACAAQQAQpQIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEM0CIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEO0BIAFBIGokAAsOACAAIABBABCmAhCnAgsPACAAIABBABCmAp0QpwILggICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDuAkUNACABIAEpA2g3AxAgASAAIAFBEGoQuwI2AgBBqRYgARCeBAwBCyABIAEpA2A3A0ggAUHYAGogACABQcgAahDNAiABIAEpA1giAzcDYCABIAM3A0AgACABQcAAahCKASABIAEpA2A3AzggACABQThqQQAQyAIhAiABIAEpA2g3AzAgASAAIAFBMGoQuwI2AiQgASACNgIgQdsWIAFBIGoQngQgASABKQNgNwMYIAAgAUEYahCLAQsgAUHwAGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEKsCIgJFDQACQCACKAIEDQAgAiAAQRwQggI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEMkCCyABIAEpAwg3AwAgACACQfYAIAEQzwIgACACEKoCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCrAiICRQ0AAkAgAigCBA0AIAIgAEEgEIICNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABDJAgsgASABKQMINwMAIAAgAkH2ACABEM8CIAAgAhCqAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQqwIiAkUNAAJAIAIoAgQNACACIABBHhCCAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQyQILIAEgASkDCDcDACAAIAJB9gAgARDPAiAAIAIQqgILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEKsCIgJFDQACQCACKAIEDQAgAiAAQSIQggI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQYQBEMkCCyABIAEpAwg3AwAgACACQfYAIAEQzwIgACACEKoCCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQkwICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEJMCCyADQSBqJAALNQIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQ1QIgABD8AyABQRBqJAALqQEBA38jAEEQayIBJAACQAJAIAAtAENBAUsNACABQQhqIABByiNBABDaAgwBCwJAIABBABClAiICQXtqQXtLDQAgAUEIaiAAQbkjQQAQ2gIMAQsgACAALQBDQX9qIgM6AEMgAEHYAGogAEHgAGogA0H/AXFBf2oiA0EDdBCGBRogACADIAIQeyICRQ0AIAAoAqwBIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQkQIiBEHPhgNLDQAgASgApAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQdgeIANBCGoQ3QIMAQsgACABIAEoAqABIARB//8DcRCMAiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEIICEIwBEOMCIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCKASADQdAAakH7ABDJAiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQoQIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEIoCIAMgACkDADcDECABIANBEGoQiwELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQkQIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADENwCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BoMYBTg0CIABB4OEAIAFBA3RqLwEAEMkCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQZQTQdU3QThB9CkQ6AQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ7gINACABQThqIABB8xgQ2wILIAEgASkDSDcDICABQThqIAAgAUEgahDNAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEIoBIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEMgCIgJFDQAgAUEwaiAAIAIgASgCOEEBEPkBIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQiwEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECEKUCIQIgASABKQMgNwMIAkAgAUEIahDuAg0AIAFBGGogAEHNGhDbAgsgASABKQMoNwMAIAFBEGogACABIAJBARD/ASAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ5AKbEKcCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEOQCnBCnAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDkAhCwBRCnAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxDhAgsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQ5AIiBEQAAAAAAAAAAGNFDQAgACAEmhCnAgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABDcBLhEAAAAAAAA8D2iEKcCC2QBBX8CQAJAIABBABClAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEENwEIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQqAILEQAgACAAQQAQpgIQmwUQpwILGAAgACAAQQAQpgIgAEEBEKYCEKcFEKcCCy4BA38gAEEAEKUCIQFBACECAkAgAEEBEKUCIgNFDQAgASADbSECCyAAIAIQqAILLgEDfyAAQQAQpQIhAUEAIQICQCAAQQEQpQIiA0UNACABIANvIQILIAAgAhCoAgsWACAAIABBABClAiAAQQEQpQJsEKgCCwkAIABBARDBAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahDlAiEDIAIgAikDIDcDECAAIAJBEGoQ5QIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEOQCIQYgAiACKQMgNwMAIAAgAhDkAiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA5BpNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAEMEBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahDuAg0AIAEgASkDKDcDECAAIAFBEGoQlQIhAiABIAEpAyA3AwggACABQQhqEJkCIgNFDQAgAkUNACAAIAIgAxCDAgsgACgCrAEgASkDKDcDICABQTBqJAALCQAgAEEBEMUBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahCZAiIDRQ0AIABBABCOASIERQ0AIAJBIGogAEEIIAQQ4wIgAiACKQMgNwMQIAAgAkEQahCKASAAIAMgBCABEIcCIAIgAikDIDcDCCAAIAJBCGoQiwEgACgCrAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDFAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahDrAiICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqENwCDAELIAEgASkDMDcDGAJAIAAgAUEYahCZAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQ3AIMAQsgAiADNgIEIAAoAqwBIAEpAzg3AyALIAFBwABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENwCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAEgAi8BEhCBA0UNACAAIAIvARI2AgAgAEECNgIEDAELIABCADcDAAsgA0EgaiQAC7ABAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDcAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgAyACQQhqQQgQ7wQ2AgAgACABQbAUIAMQywILIANBIGokAAu4AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ3AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIANBGGogAikDCBDtBCADIANBGGo2AgAgACABQesXIAMQywILIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ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AUcNACABIAEpAyg3AwggAUE4aiAAQfgaIAFBCGoQ3QJBACEDCwJAIAMiA0UNACAAIAMQ2gEgACABKAIkIAMvAQJB/x9xQYDAAHIQ6QELIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQjQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBhRsgA0EIahDdAkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQAC4kBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEI0CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQYUbIANBCGoQ3QJBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BADYCACAAQQQ2AgQLIANBMGokAAuGAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCNAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGFGyADQQhqEN0CQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQJB/x9xEOECCyADQTBqJAALzgECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCNAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGFGyABQRBqEN0CQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEH4GiABQQhqEN0CQQAhAwsCQCADIgNFDQAgACADENoBIAAgASgCJCADLwECEOkBCyABQcAAaiQAC28BAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqENwCDAELIAAgASgCtAEgAigCAEEMbGooAgAoAhBBAEcQ4gILIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDUDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0B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IQcgAiADRg0BIAchAiAIQQFqIgghByAIIAVHDQALQQAhAwwBCyAHIQMLIAQgAzYCBAJAIAAoAKQBQTxqKAIAQQhJDQAgACgCtAEiAiABQQxsaigCACgCCCEHQQAhAwNAAkAgAiADIgNBDGxqIgEoAgAoAgggB0cNACABIAQ2AgQLIANBAWoiASEDIAEgACgApAFBPGooAgBBA3ZJDQALCyAEIQMLIAMLYwEBfyMAQRBrIgIkACACIAEpAwA3AwgCQCAAIAJBCGpBARCWAiIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB+s8AQf41QdgFQdYKEOgEAAsgAEIANwMwIAJBEGokACABC/QGAgR/AX4jAEHQAGsiAyQAIAMgASkDADcDOAJAAkACQAJAIANBOGoQ7wJFDQAgAyABKQMAIgc3AyggAyAHNwNAQeIjQeojIAJBAXEbIQIgACADQShqELsCEPAEIQECQAJAIAApADBCAFINACADIAI2AgAgAyABNgIEIANByABqIABB8RUgAxDZAgwBCyADIABBMGopAwA3AyAgACADQSBqELsCIQQgAyACNgIQIAMgBDYCFCADIAE2AhggA0HIAGogAEGBFiADQRBqENkCCyABECJBACEBDAELAkACQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQX5qDgcBAgICAAIDAgsgACgApAEiBCAEKAJgaiABKAIAQQ12Qfz/H3FqLwECIgFBgKACTw0EQYcCIAFBDHYiAXZBAXFFDQQgACABQQJ0QcjZAGooAgAgAhCXAiEBDAMLIAAoArQBIAEoAgAiBUEMbGooAgghBAJAIAJBAnFFDQAgBCEBDAMLIAQhASAEDQICQCAAIAUQlAIiAQ0AQQAhAQwDCwJAIAJBAXENACABIQEMAwsgACABEIwBIQEgACgCtAEgBUEMbGogATYCCCABIQEMAgsgAyABKQMANwMwAkAgACADQTBqEO0CIgRBAkcNACABKAIEDQACQCABKAIAQaB/aiIGQSNLDQAgACAGIAJBBHIQlwIhBQsgBSEBIAZBJEkNAgtBACEBAkAgBEELSg0AIARButkAai0AACEBCyABIgFFDQMgACABIAIQlwIhAQwBCwJAAkAgASgCACIEDQBBACEFDAELIAQtAANBD3EhBQsgBCEBAkACQAJAAkAC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QCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQtAVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQtAVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBDrBCABQQhqIQIMBwsgCygCACIBQdjQACABGyIDELQFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQhQUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBC0BSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQhQUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEK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Tw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEIUFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQkgUhAAwBCyADEIgFIQUgACAEIAMQkgUhACAFRQ0AIAMQiQULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEJkFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEJwFIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA6BzIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsD8HOiIAhBACsD6HOiIABBACsD4HOiQQArA9hzoKCgoiAIQQArA9BzoiAAQQArA8hzokEAKwPAc6CgoKIgCEEAKwO4c6IgAEEAKwOwc6JBACsDqHOgoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQmAUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQmgUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsD6HKiIANCLYinQf8AcUEEdCIBQYD0AGorAwCgIgkgAUH48wBqKwMAIAIgA0KAgICAgICAeIN9vyABQfiDAWorAwChIAFBgIQBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwOYc6JBACsDkHOgoiAAQQArA4hzokEAKwOAc6CgoiAEQQArA/hyoiAIQQArA/ByoiAA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yQdqIQEMAQsgAEQAAAAAAABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDWBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AENYFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ1gUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5ENYFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDWBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQzAVFDQAgAyAEELwFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEENYFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQzgUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEMwFQQBKDQACQCABIAkgAyAKEMwFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAENYFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDWBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICA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IAZB8ABqIAS3RAAAAAAAAAAAohDPBSAGQfgAaikDACETIAYpA3AhEAwBCwJAIA4gEyAIG0IChiAPfEJgfCITQQAgA2utVw0AEIIFQcQANgIAIAZBoAFqIAQQ0QUgBkGQAWogBikDoAEgBkGgAWpBCGopAwBCf0L///////+///8AENYFIAZBgAFqIAYpA5ABIAZBkAFqQQhqKQMAQn9C////////v///ABDWBSAGQYABakEIaikDACETIAYpA4ABIRAMAQsCQCATIANBnn5qrFMNAAJAIApBf0wNAANAIAZBoANqIBAgEUIAQoCAgICAgMD/v38QygUgECARQgBCgICAgICAgP8/EM0FIQcgBkGQA2ogECARIAYpA6ADIBAgB0F/SiIHGyAGQaADakEIaikDACARIAcbEMoFIBNCf3whEyAGQZADakEIaikDACERIAYpA5ADIRAgCkEBdCAHciIKQX9KDQALCwJAAkAgEyADrH1CIHwiDqciB0EAIAdBAEobIAIgDiACrVMbIgdB8QBIDQAgBkGAA2ogBBDRBSAGQYgDaikDACEOQgAhDyAGKQOAAyESQgAhFAwBCyAGQeACakQAAAAAAADwP0GQASAHaxC5BRDPBSAGQdACaiAEENEFIAZB8AJqIAYpA+ACIAZB4AJqQQhqKQMAIAYpA9ACIhIgBkHQAmpBCGopAwAiDhC6BSAGQfACakEIaikDACEUIAYpA/ACIQ8LIAZBwAJqIAogB0EgSCAQIBFCAEIAEMwFQQBHcSAKQQFxRXEiB2oQ0gUgBkGwAmogEiAOIAYpA8ACIAZBwAJqQQhqKQMAENYFIAZBkAJqIAYpA7ACIAZBsAJqQQhqKQMAIA8gFBDKBSAGQaACaiASIA5CACAQIAcbQgAgESAHGxDWBSAGQYACaiAGKQOgAiAGQaACakEIaikDACAGKQOQAiAGQZACakEIaikDABDKBSAGQfABaiAGKQOAAiAGQYACakEIaikDACAPIBQQ2QUCQCAGKQPwASIQIAZB8AFqQQhqKQMAIhFCAEIAEMwFDQAQggVBxAA2AgALIAZB4AFqIBAgESATpxC7BSAGQeABakEIaikDACETIAYpA+ABIRAMAQsQggVBxAA2AgAgBkHQAWogBBDRBSAGQcABaiAGKQPQASAGQdABakEIaikDAEIAQoCAgICAgMAAENYFIAZBsAFqIAYpA8ABIAZBwAFqQQhqKQMAQgBCgICAgICAwAAQ1gUgBkGwAWpBCGopAwAhEyAGKQOwASEQCyAAIBA3AwAgACATNwMIIAZBsANqJAAL+h8DC38GfgF8IwBBkMYAayIHJABBACEIQQAgBGsiCSADayEKQgAhEkEAIQsCQAJAAkADQAJAIAJBMEYNACACQS5HDQQgASgCBCICIAEoAmhGDQIgASACQQFqNgIEIAItAAAhAgwDCwJAIAEoAgQiAiABKAJoRg0AQQEhCyABIAJBAWo2AgQgAi0AACECDAELQQEhCyABELcFIQIMAAsACyABELcFIQILQQEhCEIAIRIgAkEwRw0AA0ACQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARC3BSECCyASQn98IRIgAkEwRg0AC0EBIQtBASEIC0EAIQwgB0EANgKQBiACQVBqIQ0CQAJAAkACQAJAAkACQCACQS5GIg4NAEIAIRMgDUEJTQ0AQQAhD0EAIRAMAQtCACETQQAhEEEAIQ9BACEMA0ACQAJAIA5BAXFFDQACQCAIDQAgEyESQQEhCAwCCyALRSEODAQLIBNCAXwhEwJAIA9B/A9KDQAgAkEwRiELIBOnIREgB0GQBmogD0ECdGohDgJAIBBFDQAgAiAOKAIAQQpsakFQaiENCyAMIBEgCxshDCAOIA02AgBBASELQQAgEEEBaiICIAJBCUYiAhshECAPIAJqIQ8MAQsgAkEwRg0AIAcgBygCgEZBAXI2AoBGQdyPASEMCwJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABELcFIQILIAJBUGohDSACQS5GIg4NACANQQpJDQALCyASIBMgCBshEgJAIAtFDQAgAkFfcUHFAEcNAAJAIAEgBhDCBSIUQoCAgICAgICAgH9SDQAgBkUNBEIAIRQgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgFCASfCESDAQLIAtFIQ4gAkEASA0BCyABKQNwQgBTDQAgASABKAIEQX9qNgIECyAORQ0BEIIFQRw2AgALQgAhEyABQgAQtgVCACESDAELAkAgBygCkAYiAQ0AIAcgBbdEAAAAAAAAAACiEM8FIAdBCGopAwAhEiAHKQMAIRMMAQsCQCATQglVDQAgEiATUg0AAkAgA0EeSg0AIAEgA3YNAQsgB0EwaiAFENEFIAdBIGogARDSBSAHQRBqIAcpAzAgB0EwakEIaikDACAHKQMgIAdBIGpBCGopAwAQ1gUgB0EQakEIaikDACESIAcpAxAhEwwBCwJAIBIgCUEBdq1XDQAQggVBxAA2AgAgB0HgAGogBRDRBSAHQdAAaiAHKQNgIAdB4ABqQQhqKQMAQn9C////////v///ABDWBSAHQcAAaiAHKQNQIAdB0ABqQQhqKQMAQn9C////////v///ABDWBSAHQcAAakEIaikDACESIAcpA0AhEwwBCwJAIBIgBEGefmqsWQ0AEIIFQcQANgIAIAdBkAFqIAUQ0QUgB0GAAWogBykDkAEgB0GQAWpBCGopAwBCAEKAgICAgIDAABDWBSAHQfAAaiAHKQOAASAHQYABakEIaikDAEIAQoCAgICAgMAAENYFIAdB8ABqQQhqKQMAIRIgBykDcCETDAELAkAgEEUNAAJAIBBBCEoNACAHQZAGaiAPQQJ0aiICKAIAIQEDQCABQQpsIQEgEEEBaiIQQQlHDQALIAIgATYCAAsgD0EBaiEPCyASpyEIAkAgDEEJTg0AIAwgCEoNACAIQRFKDQACQCAIQQlHDQAgB0HAAWogBRDRBSAHQbABaiAHKAKQBhDSBSAHQaABaiAHKQPAASAHQcABakEIaikDACAHKQOwASAHQbABakEIaikDABDWBSAHQaABakEIaikDACESIAcpA6ABIRMMAgsCQCAIQQhKDQAgB0GQAmogBRDRBSAHQYACaiAHKAKQBhDSBSAHQfABaiAHKQOQAiAHQZACakEIaikDACAHKQOAAiAHQYACakEIaikDABDWBSAHQeABakEIIAhrQQJ0QdDFAWooAgAQ0QUgB0HQAWogBykD8AEgB0HwAWpBCGopAwAgBykD4AEgB0HgAWpBCGopAwAQzgUgB0HQAWpBCGopAwAhEiAHKQPQASETDAILIAcoApAGIQECQCADIAhBfWxqQRtqIgJBHkoNACABIAJ2DQELIAdB4AJqIAUQ0QUgB0HQAmogARDSBSAHQcACaiAHKQPgAiAHQeACakEIaikDACAHKQPQAiAHQdACakEIaikDABDWBSAHQbACaiAIQQJ0QajFAWooAgAQ0QUgB0GgAmogBykDwAIgB0HA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cTYCBCABIABBAXI2AgQgASAAaiAANgIACwJAIABB/wFLDQAgAEF4cUH46AFqIQICQAJAQQAoAtDoASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AtDoASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBgOsBaiEEAkACQAJAAkBBACgC1OgBIgZBASACdCIDcQ0AQQAgBiADcjYC1OgBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKALw6AFBf2oiAUF/IAEbNgLw6AELCwcAPwBBEHQLVAECf0EAKAK8ygEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQyAVNDQAgABAVRQ0BC0EAIAA2ArzKASABDwsQggVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEMsFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDLBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQywUgBUEwaiAKIAEgBxDVBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEMsFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEMsFIAUgAiAEQQEgBmsQ1QUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAENMFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELENQFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQywVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDLBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDXBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDXBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDXBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDXBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDXBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDXBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDXBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDXBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDXBSAFQZABaiADQg+GQgAgBEIAENcFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ1wUgBUGAAWpCASACfUIAIARCABDXBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOENcFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOENcFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ1QUgBUEwaiAWIBMgBkHwAGoQywUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q1wUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDXBSAFIAMgDkIFQgAQ1wUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEMsFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEMsFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQywUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQywUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQywVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQywUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQywUgBUEgaiACIAQgBhDLBSAFQRBqIBIgASAHENUFIAUgAiAEIAcQ1QUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEMoFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDLBSACIAAgBEGB+AAgA2sQ1QUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHA7AUkA0HA7AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEOUFIQUgBUIgiKcQ2wUgBacLEwAgACABpyABQiCIpyACIAMQFgsL7sqBgAADAEGACAuIvgFpbmZpbml0eQAtSW5maW5pdHkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAc2xlZXBNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBhc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBnY3JlZl90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkACogIHBjPSVkIEAgJXNfRiVkACEgIHBjPSVkIEAgJXNfRiVkACEgUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDACogIHBjPSVkIEAgPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19nY19vYmpfdmFsaWQoY3R4LCBwdHIpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19nY19vYmpfdmFsaWQoY3R4LCByKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQAlcyAoV1NTSykAZGV2c19nY19vYmpfdmFsaWQoY3R4LCBkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkAIXRhcmdldF9pbl9pcnEoKQBmc3RvcjogaW52YWxpZCBsYXJnZSBrZXk6ICclcycAZnN0b3I6IGludmFsaWQga2V5OiAnJXMnAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABADAuMC4wAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAARENGRwqbtMr4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAgACAAIAAgADAAMAAwADAAMAAwADAAMAAwAEAAQABAAEAAQABAAEAGRldk5hbWUAAAAAAAAAAAA9Q3YA0AAAAGlkAAAAAAAAAAAAAAAAAADYXRIA7gAAAGFyY2hJZAAAAAAAAAAAAABmfRIA8wAAAHByb2R1Y3RJZAAAAAAAAACXwQEAb7TlPwD//////////////////////////////0RldmljZVNjcmlwdCBTaW11bGF0b3IgKFdBU00pAHdhc20Ad2FzbQCcbmAU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Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAMPvgIAABG5hbWUB027oBQANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAthcHBfcHJvY2Vzcz0HdHhfaW5pdD4PamRfcGFja2V0X3JlYWR5Pwp0eF9wcm9jZXNzQBdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUEOamRfd2Vic29ja19uZXdCBm9ub3BlbkMHb25lcnJvckQHb25jbG9zZUUJb25tZXNzYWdlRhBqZF93ZWJzb2NrX2Nsb3NlRw5kZXZzX2J1ZmZlcl9vcEgSZGV2c19idWZmZXJfZGVjb2RlSRJkZXZzX2J1ZmZlcl9lbmNvZGVKD2RldnNfY3JlYXRlX2N0eEsJc2V0dXBfY3R4TApkZXZzX3RyYWNlTQ9kZXZzX2Vycm9yX2NvZGVOGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJPCWNsZWFyX2N0eFANZGV2c19mcmVlX2N0eFEIZGV2c19vb21SCWRldnNfZnJlZVMRZGV2c2Nsb3VkX3Byb2Nlc3NUF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VRRkZXZzY2xvdWRfb25fbWVzc2FnZVYOZGV2c2Nsb3VkX2luaXRXD2RldnNkYmdfcHJvY2Vzc1gRZGV2c2RiZ19yZXN0YXJ0ZWRZFWRldnNkYmdfaGFuZGxlX3BhY2tldFoLc2VuZF92YWx1ZXNbEXZhbHVlX2Zyb21fdGFnX3YwXBlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXQ1vYmpfZ2V0X3Byb3BzXgxleHBhbmRfdmFsdWVfEmRldnNkYmdfc3VzcGVuZF9jYmAMZGV2c2RiZ19pbml0YRBleHBhbmRfa2V5X3ZhbHVlYgZrdl9hZGRjD2RldnNtZ3JfcHJvY2Vzc2QHdHJ5X3J1bmUMc3RvcF9wcm9ncmFtZg9kZXZzbWdyX3Jlc3RhcnRnFGRldnNtZ3JfZGVwbG95X3N0YXJ0aBRkZXZzbWdyX2RlcGxveV93cml0ZWkQZGV2c21ncl9nZXRfaGFzaGoVZGV2c21ncl9oYW5kbGVfcGFja2V0aw5kZXBsb3lfaGFuZGxlcmwTZGVwbG95X21ldGFfaGFuZGxlcm0PZGV2c21ncl9nZXRfY3R4bg5kZXZzbWdyX2RlcGxveW8MZGV2c21ncl9pbml0cBFkZXZzbWdyX2NsaWVudF9ldnEQZGV2c19maWJlcl95aWVsZHIYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9ucxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV0EGRldnNfZmliZXJfc2xlZXB1G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHYaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN3EWRldnNfaW1nX2Z1bl9uYW1leBJkZXZzX2ltZ19yb2xlX25hbWV5EmRldnNfZmliZXJfYnlfZmlkeHoRZGV2c19maWJlcl9ieV90YWd7EGRldnNfZmliZXJfc3RhcnR8FGRldnNfZmliZXJfdGVybWlhbnRlfQ5kZXZzX2ZpYmVyX3J1bn4TZGV2c19maWJlcl9zeW5jX25vd38KZGV2c19wYW5pY4ABFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYEBD2RldnNfZmliZXJfcG9rZYIBE2pkX2djX2FueV90cnlfYWxsb2ODAQdkZXZzX2djhAEPZmluZF9mcmVlX2Jsb2NrhQESZGV2c19hbnlfdHJ5X2FsbG9jhgEOZGV2c190cnlfYWxsb2OHAQtqZF9nY191bnBpbogBCmpkX2djX2ZyZWWJARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZIoBDmRldnNfdmFsdWVfcGluiwEQZGV2c192YWx1ZV91bnBpbowBEmRldnNfbWFwX3RyeV9hbGxvY40BGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY44BFGRldnNfYXJyYXlfdHJ5X2FsbG9jjwEVZGV2c19idWZmZXJfdHJ5X2FsbG9jkAEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jkQEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSSAQ9kZXZzX2djX3NldF9jdHiTAQ5kZXZzX2djX2NyZWF0ZZQBD2RldnNfZ2NfZGVzdHJveZUBEWRldnNfZ2Nfb2JqX3ZhbGlklgELc2Nhbl9nY19vYmqXARFwcm9wX0FycmF5X2xlbmd0aJgBEm1ldGgyX0FycmF5X2luc2VydJkBEmZ1bjFfQXJyYXlfaXNBcnJheZoBEG1ldGhYX0FycmF5X3B1c2ibARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WcARFtZXRoWF9BcnJheV9zbGljZZ0BEWZ1bjFfQnVmZmVyX2FsbG9jngEScHJvcF9CdWZmZXJfbGVuZ3RonwEVbWV0aDBfQnVmZmVyX3RvU3RyaW5noAETbWV0aDNfQnVmZmVyX2ZpbGxBdKEBE21ldGg0X0J1ZmZlcl9ibGl0QXSiARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zowEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljpAEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290pQEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0pgEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSnARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0qAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSpARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcqoBFG1ldGgxX0Vycm9yX19fY3Rvcl9fqwEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX6wBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX60BGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9frgEPcHJvcF9FcnJvcl9uYW1lrwERbWV0aDBfRXJyb3JfcHJpbnSwARRtZXRoWF9GdW5jdGlvbl9zdGFydLEBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlsgEScHJvcF9GdW5jdGlvbl9uYW1lswEPZnVuMl9KU09OX3BhcnNltAETZnVuM19KU09OX3N0cmluZ2lmebUBDmZ1bjFfTWF0aF9jZWlstgEPZnVuMV9NYXRoX2Zsb29ytwEPZnVuMV9NYXRoX3JvdW5kuAENZnVuMV9NYXRoX2Fic7kBEGZ1bjBfTWF0aF9yYW5kb226ARNmdW4xX01hdGhfcmFuZG9tSW50uwENZnVuMV9NYXRoX2xvZ7wBDWZ1bjJfTWF0aF9wb3e9AQ5mdW4yX01hdGhfaWRpdr4BDmZ1bjJfTWF0aF9pbW9kvwEOZnVuMl9NYXRoX2ltdWzAAQ1mdW4yX01hdGhfbWluwQELZnVuMl9taW5tYXjCAQ1mdW4yX01hdGhfbWF4wwESZnVuMl9PYmplY3RfYXNzaWduxAEQZnVuMV9PYmplY3Rfa2V5c8UBE2Z1bjFfa2V5c19vcl92YWx1ZXPGARJmdW4xX09iamVjdF92YWx1ZXPHARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZsgBEHByb3BfUGFja2V0X3JvbGXJARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVyygETcHJvcF9QYWNrZXRfc2hvcnRJZMsBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleMwBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5kzQERcHJvcF9QYWNrZXRfZmxhZ3POARVwcm9wX1BhY2tldF9pc0NvbW1hbmTPARRwcm9wX1BhY2tldF9pc1JlcG9ydNABE3Byb3BfUGFja2V0X3BheWxvYWTRARNwcm9wX1BhY2tldF9pc0V2ZW500gEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl0wEUcHJvcF9QYWNrZXRfaXNSZWdTZXTUARRwcm9wX1BhY2tldF9pc1JlZ0dldNUBE3Byb3BfUGFja2V0X3JlZ0NvZGXWARNtZXRoMF9QYWNrZXRfZGVjb2Rl1wESZGV2c19wYWNrZXRfZGVjb2Rl2AEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk2QEURHNSZWdpc3Rlcl9yZWFkX2NvbnTaARJkZXZzX3BhY2tldF9lbmNvZGXbARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl3AEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZd0BFnByb3BfRHNQYWNrZXRJbmZvX25hbWXeARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl3wEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f4AEXcHJvcF9Ec1JvbGVfaXNDb25uZWN0ZWThARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTiARFtZXRoMF9Ec1JvbGVfd2FpdOMBEnByb3BfU3RyaW5nX2xlbmd0aOQBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF05QETbWV0aDFfU3RyaW5nX2NoYXJBdOYBEm1ldGgyX1N0cmluZ19zbGljZecBFGRldnNfamRfZ2V0X3JlZ2lzdGVy6AEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZOkBEGRldnNfamRfc2VuZF9jbWTqARFkZXZzX2pkX3dha2Vfcm9sZesBFGRldnNfamRfcmVzZXRfcGFja2V07AETZGV2c19qZF9wa3RfY2FwdHVyZe0BE2RldnNfamRfc2VuZF9sb2dtc2fuARJkZXZzX2pkX3Nob3VsZF9ydW7vARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZfABE2RldnNfamRfcHJvY2Vzc19wa3TxARRkZXZzX2pkX3JvbGVfY2hhbmdlZPIBEmRldnNfamRfaW5pdF9yb2xlc/MBEmRldnNfamRfZnJlZV9yb2xlc/QBFWRldnNfc2V0X2dsb2JhbF9mbGFnc/UBF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdz9gEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz9wEQZGV2c19qc29uX2VzY2FwZfgBFWRldnNfanNvbl9lc2NhcGVfY29yZfkBD2RldnNfanNvbl9wYXJzZfoBCmpzb25fdmFsdWX7AQxwYXJzZV9zdHJpbmf8AQ1zdHJpbmdpZnlfb2Jq/QEKYWRkX2luZGVudP4BD3N0cmluZ2lmeV9maWVsZP8BE2RldnNfanNvbl9zdHJpbmdpZnmAAhFwYXJzZV9zdHJpbmdfY29yZYECEWRldnNfbWFwbGlrZV9pdGVyggIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SDAhJkZXZzX21hcF9jb3B5X2ludG+EAgxkZXZzX21hcF9zZXSFAgZsb29rdXCGAhNkZXZzX21hcGxpa2VfaXNfbWFwhwIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVziAIRZGV2c19hcnJheV9pbnNlcnSJAghrdl9hZGQuMYoCEmRldnNfc2hvcnRfbWFwX3NldIsCD2RldnNfbWFwX2RlbGV0ZYwCEmRldnNfc2hvcnRfbWFwX2dldI0CF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0jgIOZGV2c19yb2xlX3NwZWOPAhJkZXZzX2Z1bmN0aW9uX2JpbmSQAhFkZXZzX21ha2VfY2xvc3VyZZECDmRldnNfZ2V0X2ZuaWR4kgITZGV2c19nZXRfZm5pZHhfY29yZZMCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZJQCE2RldnNfZ2V0X3JvbGVfcHJvdG+VAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcneWAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSXAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+YAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+ZAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bZoCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+bAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGScAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSdAhBkZXZzX2luc3RhbmNlX29mngIPZGV2c19vYmplY3RfZ2V0nwIMZGV2c19zZXFfZ2V0oAIMZGV2c19hbnlfZ2V0oQIMZGV2c19hbnlfc2V0ogIMZGV2c19zZXFfc2V0owIOZGV2c19hcnJheV9zZXSkAhNkZXZzX2FycmF5X3Bpbl9wdXNopQIMZGV2c19hcmdfaW50pgIPZGV2c19hcmdfZG91YmxlpwIPZGV2c19yZXRfZG91YmxlqAIMZGV2c19yZXRfaW50qQINZGV2c19yZXRfYm9vbKoCD2RldnNfcmV0X2djX3B0cqsCEWRldnNfYXJnX3NlbGZfbWFwrAIRZGV2c19zZXR1cF9yZXN1bWWtAg9kZXZzX2Nhbl9hdHRhY2iuAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlrwIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlsAISZGV2c19yZWdjYWNoZV9mcmVlsQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbLICF2RldnNfcmVnY2FjaGVfbWFya191c2VkswITZGV2c19yZWdjYWNoZV9hbGxvY7QCFGRldnNfcmVnY2FjaGVfbG9va3VwtQIRZGV2c19yZWdjYWNoZV9hZ2W2AhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZbcCEmRldnNfcmVnY2FjaGVfbmV4dLgCD2pkX3NldHRpbmdzX2dldLkCD2pkX3NldHRpbmdzX3NldLoCDmRldnNfbG9nX3ZhbHVluwIPZGV2c19zaG93X3ZhbHVlvAIQZGV2c19zaG93X3ZhbHVlML0CDWNvbnN1bWVfY2h1bmu+Ag1zaGFfMjU2X2Nsb3NlvwIPamRfc2hhMjU2X3NldHVwwAIQamRfc2hhMjU2X3VwZGF0ZcECEGpkX3NoYTI1Nl9maW5pc2jCAhRqZF9zaGEyNTZfaG1hY19zZXR1cMMCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaMQCDmpkX3NoYTI1Nl9oa2RmxQIOZGV2c19zdHJmb3JtYXTGAg5kZXZzX2lzX3N0cmluZ8cCDmRldnNfaXNfbnVtYmVyyAIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjJAhNkZXZzX2J1aWx0aW5fc3RyaW5nygIUZGV2c19zdHJpbmdfdnNwcmludGbLAhNkZXZzX3N0cmluZ19zcHJpbnRmzAIVZGV2c19zdHJpbmdfZnJvbV91dGY4zQIUZGV2c192YWx1ZV90b19zdHJpbmfOAhBidWZmZXJfdG9fc3RyaW5nzwIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZNACEmRldnNfc3RyaW5nX2NvbmNhdNECEWRldnNfc3RyaW5nX3NsaWNl0gISZGV2c19wdXNoX3RyeWZyYW1l0wIRZGV2c19wb3BfdHJ5ZnJhbWXUAg9kZXZzX2R1bXBfc3RhY2vVAhNkZXZzX2R1bXBfZXhjZXB0aW9u1gIKZGV2c190aHJvd9cCEmRldnNfcHJvY2Vzc190aHJvd9gCEGRldnNfYWxsb2NfZXJyb3LZAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LaAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y2wIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y3AIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LdAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTeAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LfAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcuACFmRldnNfdmFsdWVfZnJvbV9kb3VibGXhAhNkZXZzX3ZhbHVlX2Zyb21faW504gIUZGV2c192YWx1ZV9mcm9tX2Jvb2zjAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcuQCFGRldnNfdmFsdWVfdG9fZG91Ymxl5QIRZGV2c192YWx1ZV90b19pbnTmAhJkZXZzX3ZhbHVlX3RvX2Jvb2znAg5kZXZzX2lzX2J1ZmZlcugCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl6QIQZGV2c19idWZmZXJfZGF0YeoCE2RldnNfYnVmZmVyaXNoX2RhdGHrAhRkZXZzX3ZhbHVlX3RvX2djX29iauwCDWRldnNfaXNfYXJyYXntAhFkZXZzX3ZhbHVlX3R5cGVvZu4CD2RldnNfaXNfbnVsbGlzaO8CGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWTwAhRkZXZzX3ZhbHVlX2FwcHJveF9lcfECEmRldnNfdmFsdWVfaWVlZV9lcfICHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY/MCEmRldnNfaW1nX3N0cmlkeF9va/QCEmRldnNfZHVtcF92ZXJzaW9uc/UCC2RldnNfdmVyaWZ59gIRZGV2c19mZXRjaF9vcGNvZGX3Ag5kZXZzX3ZtX3Jlc3VtZfgCEWRldnNfdm1fc2V0X2RlYnVn+QIZZGV2c192bV9jbGVhcl9icmVha3BvaW50c/oCGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludPsCD2RldnNfdm1fc3VzcGVuZPwCFmRldnNfdm1fc2V0X2JyZWFrcG9pbnT9AhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc/4CGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4/wIRZGV2c19pbWdfZ2V0X3V0ZjiAAxRkZXZzX2dldF9zdGF0aWNfdXRmOIEDD2RldnNfdm1fcm9sZV9va4IDFGRldnNfdmFsdWVfYnVmZmVyaXNogwMMZXhwcl9pbnZhbGlkhAMUZXhwcnhfYnVpbHRpbl9vYmplY3SFAwtzdG10MV9jYWxsMIYDC3N0bXQyX2NhbGwxhwMLc3RtdDNfY2FsbDKIAwtzdG10NF9jYWxsM4kDC3N0bXQ1X2NhbGw0igMLc3RtdDZfY2FsbDWLAwtzdG10N19jYWxsNowDC3N0bXQ4X2NhbGw3jQMLc3RtdDlfY2FsbDiOAxJzdG10Ml9pbmRleF9kZWxldGWPAwxzdG10MV9yZXR1cm6QAwlzdG10eF9qbXCRAwxzdG10eDFfam1wX3qSAwpleHByMl9iaW5kkwMSZXhwcnhfb2JqZWN0X2ZpZWxklAMSc3RtdHgxX3N0b3JlX2xvY2FslQMTc3RtdHgxX3N0b3JlX2dsb2JhbJYDEnN0bXQ0X3N0b3JlX2J1ZmZlcpcDCWV4cHIwX2luZpgDEGV4cHJ4X2xvYWRfbG9jYWyZAxFleHByeF9sb2FkX2dsb2JhbJoDC2V4cHIxX3VwbHVzmwMLZXhwcjJfaW5kZXicAw9zdG10M19pbmRleF9zZXSdAxRleHByeDFfYnVpbHRpbl9maWVsZJ4DEmV4cHJ4MV9hc2NpaV9maWVsZJ8DEWV4cHJ4MV91dGY4X2ZpZWxkoAMQZXhwcnhfbWF0aF9maWVsZKEDDmV4cHJ4X2RzX2ZpZWxkogMPc3RtdDBfYWxsb2NfbWFwowMRc3RtdDFfYWxsb2NfYXJyYXmkAxJzdG10MV9hbGxvY19idWZmZXKlAxFleHByeF9zdGF0aWNfcm9sZaYDE2V4cHJ4X3N0YXRpY19idWZmZXKnAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmeoAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nqQMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nqgMVZXhwcnhfc3RhdGljX2Z1bmN0aW9uqwMNZXhwcnhfbGl0ZXJhbKwDEWV4cHJ4X2xpdGVyYWxfZjY0rQMQZXhwcnhfcm9sZV9wcm90b64DEWV4cHIzX2xvYWRfYnVmZmVyrwMNZXhwcjBfcmV0X3ZhbLADDGV4cHIxX3R5cGVvZrEDD2V4cHIwX3VuZGVmaW5lZLIDEmV4cHIxX2lzX3VuZGVmaW5lZLMDCmV4cHIwX3RydWW0AwtleHByMF9mYWxzZbUDDWV4cHIxX3RvX2Jvb2y2AwlleHByMF9uYW63AwlleHByMV9hYnO4Aw1leHByMV9iaXRfbm90uQMMZXhwcjFfaXNfbmFuugMJZXhwcjFfbmVnuwMJZXhwcjFfbm90vAMMZXhwcjFfdG9faW50vQMJZXhwcjJfYWRkvgMJZXhwcjJfc3VivwMJZXhwcjJfbXVswAMJZXhwcjJfZGl2wQMNZXhwcjJfYml0X2FuZMIDDGV4cHIyX2JpdF9vcsMDDWV4cHIyX2JpdF94b3LEAxBleHByMl9zaGlmdF9sZWZ0xQMRZXhwcjJfc2hpZnRfcmlnaHTGAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZMcDCGV4cHIyX2VxyAMIZXhwcjJfbGXJAwhleHByMl9sdMoDCGV4cHIyX25lywMVc3RtdDFfdGVybWluYXRlX2ZpYmVyzAMUc3RtdHgyX3N0b3JlX2Nsb3N1cmXNAxNleHByeDFfbG9hZF9jbG9zdXJlzgMSZXhwcnhfbWFrZV9jbG9zdXJlzwMQZXhwcjFfdHlwZW9mX3N0ctADDGV4cHIwX25vd19tc9EDFmV4cHIxX2dldF9maWJlcl9oYW5kbGXSAxBzdG10Ml9jYWxsX2FycmF50wMJc3RtdHhfdHJ51AMNc3RtdHhfZW5kX3RyedUDC3N0bXQwX2NhdGNo1gMNc3RtdDBfZmluYWxsedcDC3N0bXQxX3Rocm932AMOc3RtdDFfcmVfdGhyb3fZAxBzdG10eDFfdGhyb3dfam1w2gMOc3RtdDBfZGVidWdnZXLbAwlleHByMV9uZXfcAxFleHByMl9pbnN0YW5jZV9vZt0DCmV4cHIwX251bGzeAw9leHByMl9hcHByb3hfZXHfAw9leHByMl9hcHByb3hfbmXgAw9kZXZzX3ZtX3BvcF9hcmfhAxNkZXZzX3ZtX3BvcF9hcmdfdTMy4gMTZGV2c192bV9wb3BfYXJnX2kzMuMDFmRldnNfdm1fcG9wX2FyZ19idWZmZXLkAxJqZF9hZXNfY2NtX2VuY3J5cHTlAxJqZF9hZXNfY2NtX2RlY3J5cHTmAwxBRVNfaW5pdF9jdHjnAw9BRVNfRUNCX2VuY3J5cHToAxBqZF9hZXNfc2V0dXBfa2V56QMOamRfYWVzX2VuY3J5cHTqAxBqZF9hZXNfY2xlYXJfa2V56wMLamRfd3Nza19uZXfsAxRqZF93c3NrX3NlbmRfbWVzc2FnZe0DE2pkX3dlYnNvY2tfb25fZXZlbnTuAwdkZWNyeXB07wMNamRfd3Nza19jbG9zZfADEGpkX3dzc2tfb25fZXZlbnTxAwtyZXNwX3N0YXR1c/IDEndzc2toZWFsdGhfcHJvY2Vzc/MDF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxl9AMUd3Nza2hlYWx0aF9yZWNvbm5lY3T1Axh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXT2Aw9zZXRfY29ubl9zdHJpbmf3AxFjbGVhcl9jb25uX3N0cmluZ/gDD3dzc2toZWFsdGhfaW5pdPkDEXdzc2tfc2VuZF9tZXNzYWdl+gMRd3Nza19pc19jb25uZWN0ZWT7AxJ3c3NrX3NlcnZpY2VfcXVlcnn8AxRkZXZzX3RyYWNrX2V4Y2VwdGlvbv0DHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemX+AxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xl/wMPcm9sZW1ncl9wcm9jZXNzgAQQcm9sZW1ncl9hdXRvYmluZIEEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldIIEFGpkX3JvbGVfbWFuYWdlcl9pbml0gwQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkhAQNamRfcm9sZV9hbGxvY4UEEGpkX3JvbGVfZnJlZV9hbGyGBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5khwQTamRfY2xpZW50X2xvZ19ldmVudIgEE2pkX2NsaWVudF9zdWJzY3JpYmWJBBRqZF9jbGllbnRfZW1pdF9ldmVudIoEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkiwQQamRfZGV2aWNlX2xvb2t1cIwEGGpkX2RldmljZV9sb29rdXBfc2VydmljZY0EE2pkX3NlcnZpY2Vfc2VuZF9jbWSOBBFqZF9jbGllbnRfcHJvY2Vzc48EDmpkX2RldmljZV9mcmVlkAQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSRBA9qZF9kZXZpY2VfYWxsb2OSBA9qZF9jdHJsX3Byb2Nlc3OTBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSUBAxqZF9jdHJsX2luaXSVBBRkY2ZnX3NldF91c2VyX2NvbmZpZ5YECWRjZmdfaW5pdJcEDWRjZmdfdmFsaWRhdGWYBA5kY2ZnX2dldF9lbnRyeZkEDGRjZmdfZ2V0X2kzMpoEDGRjZmdfZ2V0X3UzMpsED2RjZmdfZ2V0X3N0cmluZ5wEDGRjZmdfaWR4X2tleZ0ECWpkX3ZkbWVzZ54ECGpkX2RtZXNnnwQRamRfZG1lc2dfc3RhcnRwdHKgBA1qZF9kbWVzZ19yZWFkoQQSamRfZG1lc2dfcmVhZF9saW5logQTamRfc2V0dGluZ3NfZ2V0X2JpbqMEDWpkX2ZzdG9yX2luaXSkBBNqZF9zZXR0aW5nc19zZXRfYmlupQQLamRfZnN0b3JfZ2OmBA9yZWNvbXB1dGVfY2FjaGWnBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2WoBBZqZF9zZXR0aW5nc19wcmVwX2xhcmdlqQQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2WqBBZqZF9zZXR0aW5nc19zeW5jX2xhcmdlqwQNamRfaXBpcGVfb3BlbqwEFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXStBA5qZF9pcGlwZV9jbG9zZa4EEmpkX251bWZtdF9pc192YWxpZK8EFWpkX251bWZtdF93cml0ZV9mbG9hdLAEE2pkX251bWZtdF93cml0ZV9pMzKxBBJqZF9udW1mbXRfcmVhZF9pMzKyBBRqZF9udW1mbXRfcmVhZF9mbG9hdLMEEWpkX29waXBlX29wZW5fY21ktAQUamRfb3BpcGVfb3Blbl9yZXBvcnS1BBZqZF9vcGlwZV9oYW5kbGVfcGFja2V0tgQRamRfb3BpcGVfd3JpdGVfZXi3BBBqZF9vcGlwZV9wcm9jZXNzuAQUamRfb3BpcGVfY2hlY2tfc3BhY2W5BA5qZF9vcGlwZV93cml0ZboEDmpkX29waXBlX2Nsb3NluwQNamRfcXVldWVfcHVzaLwEDmpkX3F1ZXVlX2Zyb250vQQOamRfcXVldWVfc2hpZnS+BA5qZF9xdWV1ZV9hbGxvY78EDWpkX3Jlc3BvbmRfdTjABA5qZF9yZXNwb25kX3UxNsEEDmpkX3Jlc3BvbmRfdTMywgQRamRfcmVzcG9uZF9zdHJpbmfDBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZMQEC2pkX3NlbmRfcGt0xQQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzGBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcscEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTIBBRqZF9hcHBfaGFuZGxlX3BhY2tldMkEFWpkX2FwcF9oYW5kbGVfY29tbWFuZMoEFWFwcF9nZXRfaW5zdGFuY2VfbmFtZcsEE2pkX2FsbG9jYXRlX3NlcnZpY2XMBBBqZF9zZXJ2aWNlc19pbml0zQQOamRfcmVmcmVzaF9ub3fOBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkzwQUamRfc2VydmljZXNfYW5ub3VuY2XQBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZdEEEGpkX3NlcnZpY2VzX3RpY2vSBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfTBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZdQEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXVBBRhcHBfZ2V0X2RldmljZV9jbGFzc9YEEmFwcF9nZXRfZndfdmVyc2lvbtcEDWpkX3NydmNmZ19ydW7YBBdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZdkEEWpkX3NydmNmZ192YXJpYW502gQNamRfaGFzaF9mbnYxYdsEDGpkX2RldmljZV9pZNwECWpkX3JhbmRvbd0ECGpkX2NyYzE23gQOamRfY29tcHV0ZV9jcmPfBA5qZF9zaGlmdF9mcmFtZeAEDGpkX3dvcmRfbW92ZeEEDmpkX3Jlc2V0X2ZyYW1l4gQQamRfcHVzaF9pbl9mcmFtZeMEDWpkX3BhbmljX2NvcmXkBBNqZF9zaG91bGRfc2FtcGxlX21z5QQQamRfc2hvdWxkX3NhbXBsZeYECWpkX3RvX2hleOcEC2pkX2Zyb21faGV46AQOamRfYXNzZXJ0X2ZhaWzpBAdqZF9hdG9p6gQLamRfdnNwcmludGbrBA9qZF9wcmludF9kb3VibGXsBApqZF9zcHJpbnRm7QQSamRfZGV2aWNlX3Nob3J0X2lk7gQMamRfc3ByaW50Zl9h7wQLamRfdG9faGV4X2HwBAlqZF9zdHJkdXDxBAlqZF9tZW1kdXDyBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVl8wQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZfQEEWpkX3NlbmRfZXZlbnRfZXh09QQKamRfcnhfaW5pdPYEFGpkX3J4X2ZyYW1lX3JlY2VpdmVk9wQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2v4BA9qZF9yeF9nZXRfZnJhbWX5BBNqZF9yeF9yZWxlYXNlX2ZyYW1l+gQRamRfc2VuZF9mcmFtZV9yYXf7BA1qZF9zZW5kX2ZyYW1l/AQKamRfdHhfaW5pdP0EB2pkX3NlbmT+BBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3Jj/wQPamRfdHhfZ2V0X2ZyYW1lgAUQamRfdHhfZnJhbWVfc2VudIEFC2pkX3R4X2ZsdXNoggUQX19lcnJub19sb2NhdGlvboMFDF9fZnBjbGFzc2lmeYQFBWR1bW15hQUIX19tZW1jcHmGBQdtZW1tb3ZlhwUGbWVtc2V0iAUKX19sb2NrZmlsZYkFDF9fdW5sb2NrZmlsZYoFBmZmbHVzaIsFBGZtb2SMBQ1fX0RPVUJMRV9CSVRTjQUMX19zdGRpb19zZWVrjgUNX19zdGRpb193cml0ZY8FDV9fc3RkaW9fY2xvc2WQBQhfX3RvcmVhZJEFCV9fdG93cml0ZZIFCV9fZndyaXRleJMFBmZ3cml0ZZQFFF9fcHRocmVhZF9tdXRleF9sb2NrlQUWX19wdGhyZWFkX211dGV4X3VubG9ja5YFBl9fbG9ja5cFCF9fdW5sb2NrmAUOX19tYXRoX2Rpdnplcm+ZBQpmcF9iYXJyaWVymgUOX19tYXRoX2ludmFsaWSbBQNsb2ecBQV0b3AxNp0FBWxvZzEwngUHX19sc2Vla58FBm1lbWNtcKAFCl9fb2ZsX2xvY2uhBQxfX29mbF91bmxvY2uiBQxfX21hdGhfeGZsb3ejBQxmcF9iYXJyaWVyLjGkBQxfX21hdGhfb2Zsb3elBQxfX21hdGhfdWZsb3emBQRmYWJzpwUDcG93qAUFdG9wMTKpBQp6ZXJvaW5mbmFuqgUIY2hlY2tpbnSrBQxmcF9iYXJyaWVyLjKsBQpsb2dfaW5saW5lrQUKZXhwX2lubGluZa4FC3NwZWNpYWxjYXNlrwUNZnBfZm9yY2VfZXZhbLAFBXJvdW5ksQUGc3RyY2hysgULX19zdHJjaHJudWyzBQZzdHJjbXC0BQZzdHJsZW61BQdfX3VmbG93tgUHX19zaGxpbbcFCF9fc2hnZXRjuAUHaXNzcGFjZbkFBnNjYWxibroFCWNvcHlzaWdubLsFB3NjYWxibmy8BQ1fX2ZwY2xhc3NpZnlsvQUFZm1vZGy+BQVmYWJzbL8FC19fZmxvYXRzY2FuwAUIaGV4ZmxvYXTBBQhkZWNmbG9hdMIFB3NjYW5leHDDBQZzdHJ0b3jEBQZzdHJ0b2TFBRJfX3dhc2lfc3lzY2FsbF9yZXTGBQhkbG1hbGxvY8cFBmRsZnJlZcgFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZckFBHNicmvKBQhfX2FkZHRmM8sFCV9fYXNobHRpM8wFB19fbGV0ZjLNBQdfX2dldGYyzgUIX19kaXZ0ZjPPBQ1fX2V4dGVuZGRmdGYy0AUNX19leHRlbmRzZnRmMtEFC19fZmxvYXRzaXRm0gUNX19mbG9hdHVuc2l0ZtMFDV9fZmVfZ2V0cm91bmTUBRJfX2ZlX3JhaXNlX2luZXhhY3TVBQlfX2xzaHJ0aTPWBQhfX211bHRmM9cFCF9fbXVsdGkz2AUJX19wb3dpZGYy2QUIX19zdWJ0ZjPaBQxfX3RydW5jdGZkZjLbBQtzZXRUZW1wUmV0MNwFC2dldFRlbXBSZXQw3QUJc3RhY2tTYXZl3gUMc3RhY2tSZXN0b3Jl3wUKc3RhY2tBbGxvY+AFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnThBRVlbXNjcmlwdGVuX3N0YWNrX2luaXTiBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl4wUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZeQFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZOUFDGR5bkNhbGxfamlqaeYFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnnBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHlBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 25920;
var ___stop_em_js = Module['___stop_em_js'] = 26973;



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
