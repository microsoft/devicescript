
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA96FgIAA3AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEAAgUABQUDAgIDAgIDBAMDAwUCCAACAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQEFAwAKAAICAAEBAQABAAABAAAACgABAgABAQQFAQIAAAAACAMFCgICAgAGCgMJAwEGBQMGCQYGBQYFAwYGCQ0GAwMFBQMDAwMGBQYGBgYGBgEDDhECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBhECAgYOAwMDAwUFAwMDBAQFBQEDAAMDBAIAAwIFAAQFBQMGAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQEBAQICAgICAgICAgEBAQEBAgQEAQoNAgIAAAcJCQEDBwECAAgAAgYABwkIBAAEBAAAAgcAAwcHAQIBABIDCQcAAAQAAgcEBwQEAwMDBQIIBQUFBwUHBwMDBQgFAAAEHwEDDgMDAAkHAwUEAwQABAMDAwMEBAUFAAAABAQHBwcHBAcHBwgICAcEBAMQCAMABAEACQEDAwEDBgQJIAkXAwMEAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIQ8FBAQEBQkEBAAAFAsLCxMLDwUIByILFBQLGBMSEgsjJCUmCwMDAwQEFwQEGQwVJwwoBhYpKgYOBAQACAQMFRoaDBErAgIICBUMDBkMLAAICAAECAcICAgtDS4Eh4CAgAABcAHRAdEBBYaAgIAAAQGAAoACBt2AgIAADn8BQdDuBQt/AUEAC38BQQALfwFBAAt/AEHQzAELfwBBv80BC38AQYnPAQt/AEGF0AELfwBBgdEBC38AQdHRAQt/AEHy0QELfwBB99MBC38AQdDMAQt/AEHt1AELB/2FgIAAIwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwDRBRZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AjQUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUA0gUaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQALxFqZF9lbV9kZXZzX2RlcGxveQAwEWpkX2VtX2RldnNfdmVyaWZ5ADEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADMWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMLBmZmbHVzaACVBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQA7AUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQDtBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAO4FGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZADvBQlzdGFja1NhdmUA6AUMc3RhY2tSZXN0b3JlAOkFCnN0YWNrQWxsb2MA6gUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudADrBQ1fX3N0YXJ0X2VtX2pzAwwMX19zdG9wX2VtX2pzAw0MZHluQ2FsbF9qaWppAPEFCZeDgIAAAQBBAQvQASo7REVGR1VWZFlbbW5yZWzlAYoCkAKVApoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcsBzAHNAc8B0AHRAdIB0wHUAdUB1gHXAdgB2QHaAdsB3AHdAd4B3wHiAeQB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIBjwOQA5EDkgOTA5QDlQOWA5cDmAOZA5oDmwOcA50DngOfA6ADoQOiA6MDpAOlA6YDpwOoA6kDqgOrA6wDrQOuA68DsAOxA7IDswO0A7UDtgO3A7gDuQO6A7sDvAO9A74DvwPAA8EDwgPDA8QDxQPGA8cDyAPJA8oDywPMA80DzgPPA9AD0QPSA9MD1APVA9YD1wPYA9kD2gPbA9wD3QPeA98D4APhA+ID4wPkA+UD5gPnA+gD6QPqA+sD/gOBBIUEhgSHBIsEjQSeBJ8E/gSaBZkFmAUKtO2JgADcBQUAEOwFCyQBAX8CQEEAKALw1AEiAA0AQZHEAEGkOkEZQckbEPMEAAsgAAvVAQECfwJAAkACQAJAQQAoAvDUASIDRQ0AIAFBA3ENASAAIANrIgNBAEgNAiADIAJqQYGACE8NAgJAAkAgA0EHcQ0AIAJFDQVBACEDDAELQZvLAEGkOkEiQd4hEPMEAAsCQANAIAAgAyIDai0AAEH/AUcNASADQQFqIgQhAyAEIAJGDQUMAAsAC0GRJkGkOkEkQd4hEPMEAAtBkcQAQaQ6QR5B3iEQ8wQAC0GrywBBpDpBIEHeIRDzBAALQfTFAEGkOkEhQd4hEPMEAAsgACABIAIQkAUaC2wBAX8CQAJAAkBBACgC8NQBIgFFDQAgACABayIBQYHgB08NASABQf8fcQ0CIABB/wFBgCAQkgUaDwtBkcQAQaQ6QSlB3CkQ8wQAC0GaxgBBpDpBK0HcKRDzBAALQfPNAEGkOkEsQdwpEPMEAAtBAQN/Qf41QQAQPEEAKALw1AEhAEH//wchAQNAAkAgACABIgJqLQAAQTdGDQAgACACEAAPCyACQX9qIQEgAg0ACwslAQF/QQBBgIAIENEFIgA2AvDUASAAQTdBgIAIEJIFQYCACBABCwUAEAIACwIACwIACwIACxwBAX8CQCAAENEFIgENABACAAsgAUEAIAAQkgULBwAgABDSBQsEAEEACwoAQfTUARCfBRoLCgBB9NQBEKAFGgthAgJ/AX4jAEEQayIBJAACQAJAIAAQvwVBEEcNACABQQhqIAAQ8gRBCEcNACABKQMIIQMMAQsgACAAEL8FIgIQ5QStQiCGIABBAWogAkF/ahDlBK2EIQMLIAFBEGokACADCwgAED0gABADCwYAIAAQBAsIACAAIAEQBQsIACABEAZBAAsTAEEAIACtQiCGIAGshDcDqMgBCw0AQQAgABAmNwOoyAELJQACQEEALQCQ1QENAEEAQQE6AJDVAUGQ1gBBABA/EIAFENcECwtlAQF/IwBBMGsiACQAAkBBAC0AkNUBQQFHDQBBAEECOgCQ1QEgAEErahDmBBD4BCAAQRBqQajIAUEIEPEEIAAgAEErajYCBCAAIABBEGo2AgBB9BQgABA8CxDdBBBBIABBMGokAAstAAJAIABBAmogAC0AAkEKahDoBCAALwEARg0AQenGAEEAEDxBfg8LIAAQgQULCAAgACABEHALCQAgACABEIEDCwgAIAAgARA6CxUAAkAgAEUNAEEBEIACDwtBARCBAgsJAEEAKQOoyAELDgBBtBBBABA8QQAQBwALngECAXwBfgJAQQApA5jVAUIAUg0AAkACQBAIRAAAAAAAQI9AoiIARAAAAAAAAPBDYyAARAAAAAAAAAAAZnFFDQAgALEhAQwBC0IAIQELQQAgAUKFf3w3A5jVAQsCQAJAEAhEAAAAAABAj0CiIgBEAAAAAAAA8ENjIABEAAAAAAAAAABmcUUNACAAsSEBDAELQgAhAQsgAUEAKQOY1QF9CwYAIAAQCQsCAAsWABAcEI4EQQAQcRBiEIQEQbDzABBYCx0AQaDVASABNgIEQQAgADYCoNUBQQJBABCUBEEAC80EAQF/IwBBEGsiBCQAAkACQAJAAkACQCABQX9qDhADAgQEBAQEBAQEBAQEBAQBAAsgAUEwRw0DQaDVAS0ADEUNAwJAAkBBoNUBKAIEQaDVASgCCCICayIBQeABIAFB4AFIGyIBDQBBoNUBQRRqEMUEIQIMAQtBoNUBQRRqQQAoAqDVASACaiABEMQEIQILIAINA0Gg1QFBoNUBKAIIIAFqNgIIIAENA0G1KkEAEDxBoNUBQYACOwEMQQAQKAwDCyACRQ0CQQAoAqDVAUUNAkGg1QEoAhAgAkcNAgJAIAMtAANBAXENACADLwEOQYABRw0AQZsqQQAQPEGg1QFBFGogAxC/BA0AQaDVAUEBOgAMC0Gg1QEtAAxFDQICQAJAQaDVASgCBEGg1QEoAggiAmsiAUHgASABQeABSBsiAQ0AQaDVAUEUahDFBCECDAELQaDVAUEUakEAKAKg1QEgAmogARDEBCECCyACDQJBoNUBQaDVASgCCCABajYCCCABDQJBtSpBABA8QaDVAUGAAjsBDEEAECgMAgtBoNUBKAIQIgFFDQEgAUEAIAEtAARrQQxsakFcaiACRw0BQfHVAEETQQFBACgCwMcBEJ4FGkGg1QFBADYCEAwBC0EAKAKg1QFFDQBBoNUBKAIQDQAgAikDCBDmBFENAEGg1QEgAkGr1NOJARCYBCIBNgIQIAFFDQAgBEELaiACKQMIEPgEIAQgBEELajYCAEHAFiAEEDxBoNUBKAIQQYABQaDVAUEEakEEEJkEGgsgBEEQaiQAC08BAX8jAEEQayICJAAgAiABNgIMIAAgARCpBAJAQcDXAUHAAkG81wEQrARFDQADQEHA1wEQN0HA1wFBwAJBvNcBEKwEDQALCyACQRBqJAALLwACQEHA1wFBwAJBvNcBEKwERQ0AA0BBwNcBEDdBwNcBQcACQbzXARCsBA0ACwsLMwAQQRA4AkBBwNcBQcACQbzXARCsBEUNAANAQcDXARA3QcDXAUHAAkG81wEQrAQNAAsLCxcAQQAgADYChNoBQQAgATYCgNoBEIcFCwsAQQBBAToAiNoBC1cBAn8CQEEALQCI2gFFDQADQEEAQQA6AIjaAQJAEIoFIgBFDQACQEEAKAKE2gEiAUUNAEEAKAKA2gEgACABKAIMEQMAGgsgABCLBQtBAC0AiNoBDQALCwsgAQF/AkBBACgCjNoBIgINAEF/DwsgAigCACAAIAEQCguJAwEDfyMAQeAAayIEJAACQAJAAkACQBALDQBBxC9BABA8QX8hBQwBCwJAQQAoAozaASIFRQ0AIAUoAgAiBkUNAAJAIAUoAgRFDQAgBkHoB0EAEBEaCyAFQQA2AgQgBUEANgIAQQBBADYCjNoBC0EAQQgQISIFNgKM2gEgBSgCAA0BAkACQAJAIABBgA0QvgVFDQAgAEH6xwAQvgUNAQsgBCACNgIoIAQgATYCJCAEIAA2AiBB5xQgBEEgahD5BCEADAELIAQgAjYCNCAEIAA2AjBBxhQgBEEwahD5BCEACyAEQQE2AlggBCADNgJUIAQgACIDNgJQIARB0ABqEAwiAEEATA0CIAAgBUEDQQIQDRogACAFQQRBAhAOGiAAIAVBBUECEA8aIAAgBUEGQQIQEBogBSAANgIAIAQgAzYCAEGcFSAEEDwgAxAiQQAhBQsgBEHgAGokACAFDwsgBEHzyQA2AkBBhhcgBEHAAGoQPBACAAsgBEHayAA2AhBBhhcgBEEQahA8EAIACyoAAkBBACgCjNoBIAJHDQBBgTBBABA8IAJBATYCBEEBQQBBABD5AwtBAQskAAJAQQAoAozaASACRw0AQeXVAEEAEDxBA0EAQQAQ+QMLQQELKgACQEEAKAKM2gEgAkcNAEG6KUEAEDwgAkEANgIEQQJBAEEAEPkDC0EBC1QBAX8jAEEQayIDJAACQEEAKAKM2gEgAkcNACABKAIEIQICQCABKAIMRQ0AIAMgAjYCAEHC1QAgAxA8DAELQQQgAiABKAIIEPkDCyADQRBqJABBAQtJAQJ/AkBBACgCjNoBIgBFDQAgACgCACIBRQ0AAkAgACgCBEUNACABQegHQQAQERoLIABBADYCBCAAQQA2AgBBAEEANgKM2gELC9ACAQJ/IwBBMGsiBiQAAkACQAJAAkAgAhC5BA0AIAAgAUH0LkEAEOYCDAELIAYgBCkDADcDGCABIAZBGGogBkEsahD2AiIHRQ0BAkBBASACQQNxdCADaiAGKAIsTQ0AAkAgBUUNACAGQSBqIAFB0StBABDmAgsgAEIANwMADAELIAcgA2ohAwJAIAVFDQAgBiAEKQMANwMQIAEgBkEQahD0AkUNAyAGIAUpAwA3AyACQAJAIAYoAiRBf0cNACADIAIgBigCIBC7BAwBCyAGIAYpAyA3AwggAyACIAEgBkEIahDwAhC6BAsgAEIANwMADAELAkAgAkEHSw0AIAMgAhC8BCIBQYGAgIB4akECSQ0AIAAgARDtAgwBCyAAIAMgAhC9BBDsAgsgBkEwaiQADwtBsMQAQfE4QRVB3RwQ8wQAC0GZ0QBB8ThBIUHdHBDzBAAL7wMBAn8gAygCACEFAkACQAJAAkACQAJAAkACQAJAAkAgAkEEdEEwcSACQQR2ckF/IAJBDHFBDEYbQQFqDggBAwQHAAIICAkLIARBAEchAgJAIAQNAEEAIQYgAiEEDAYLIAUtAAANBEEAIQYgAiEEDAULAkAgAhC5BA0AIAAgAUH0LkEAEOYCDwsCQEEBIAJBA3F0IgEgBE0NACAAQgA3AwAPCyADIAMoAgAgAWo2AgACQCACQQdLDQAgBSACELwEIgRBgYCAgHhqQQJJDQAgACAEEO0CDwsgACAFIAIQvQQQ7AIPCwJAIAQNACAAQgA3AwAPCyADIAVBAWo2AgAgAEHg6gBB6OoAIAUtAAAbKQMANwMADwsgAEIANwMADwsCQCABIAQQkgEiAg0AIABCADcDAA8LIAMgAygCACAEajYCACACQQxqIAUgBBCQBRogACABQQggAhDvAg8LQQAhBgJAAkADQCAGQQFqIgIgBEYNASACIQYgBSACai0AAA0ACyACIQYMAQsgBCEGCyAGIQYgAiAESSEECyADIAUgBiICaiAEajYCACAAIAFBCCABIAUgAhCUARDvAg8LIAMgBSAEajYCACAAIAFBCCABIAUgBBCUARDvAg8LIAAgAUH1ExDnAg8LIAAgAUHnDxDnAgvsAwEDfyMAQcAAayIFJAAgAUEEdEEwcSABQQR2ckF/IAFBDHFBDEYbIgYhBwJAAkACQAJAAkACQCAGQQFqDggABQICAgEDAwQLAkAgARC5BA0AIAVBOGogAEH0LkEAEOYCQQAhBwwFCwJAQQEgAUEDcXQiByADTQ0AIAchBwwFCwJAIAQoAgRBf0cNACACIAEgBCgCABC7BCAHIQcMBQsgBSAEKQMANwMIIAIgASAAIAVBCGoQ8AIQugQgByEHDAQLAkAgAw0AQQEhBwwECyAFIAQpAwA3AxAgAkEAIAAgBUEQahDyAms6AABBASEHDAMLIAUgBCkDADcDKCAAIAVBKGogBUE0ahD2AiIHIQECQAJAIAcNACAFIAQpAwA3AyAgBUE4aiAAIAVBIGoQ2QIgBCAFKQM4NwMAIAUgBCkDADcDGCAAIAVBGGogBUE0ahD2AiIHIQEgBw0AQQAhAQwBCyABIQcCQCAFKAI0IANNDQAgBSADNgI0CyACIAcgBSgCNCIBEJAFIQcCQCAGQQNHDQAgASADTw0AIAcgAWpBADoAACAFIAFBAWo2AjQLIAUoAjQhAQsgASEHDAILIAVBOGogAEH1ExDnAkEAIQcMAQsgBUE4aiAAQecPEOcCQQAhBwsgBUHAAGokACAHC24BAn8CQCABQe8ASw0AQfYhQQAQPEEADwsgACABEIEDIQMgABCAA0EAIQQCQCADDQBBiAgQISIEIAItAAA6ANQBIAQgBC0ABkEIcjoABhDLAiAAIAEQzAIgBEGCAmoQzQIgBCAAEE0gBCEECyAEC5cBACAAIAE2AqQBIAAQlgE2AtABIAAgACAAKAKkAS8BDEEDdBCJATYCACAAIAAgACgApAFBPGooAgBBA3ZBDGwQiQE2ArQBIAAgABCQATYCoAECQCAALwEIDQAgABCAASAAEPcBIAAQ/gEgAC8BCA0AIAAoAtABIAAQlQEgAEEBOgBDIABCgICAgDA3A1AgAEEAQQEQfRoLCyoBAX8CQCAALQAGQQhxDQAgACgCyAEgACgCwAEiBEYNACAAIAQ2AsgBCwsZAAJAIAFFDQAgASAALwEKNgIACyAALwEIC54DAQF/AkACQAJAIABFDQAgAC0ABiIEQQFxDQEgACAEQQFyOgAGAkAgAUEwRg0AIAAQgAELAkAgAC0ABiIEQRBxRQ0AIAAgBEEQczoABiAAKAKsAUUNACAAQQE6AEgCQCAALQBFRQ0AIAAQ4wILAkAgACgCrAEiBEUNACAEEH8LIABBADoASCAAEIMBCwJAAkACQAJAAkACQCABQXBqDjEAAgEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQQFBQUFBQUFBQUFBQUFBQUDBQsCQCAALQAGQQhxDQAgACgCyAEgACgCwAEiAUYNACAAIAE2AsgBCyAAIAIgAxD8AQwECyAALQAGQQhxDQMgACgCyAEgACgCwAEiAUYNAyAAIAE2AsgBDAMLIAAtAAZBCHENAiAAKALIASAAKALAASIBRg0CIAAgATYCyAEMAgsgACADEP0BDAELIAAQgwELIAAtAAYiAUEBcUUNAiAAIAFB/gFxOgAGCw8LQbLKAEGMN0HIAEHyGRDzBAALQcvOAEGMN0HNAEHxJxDzBAALdwEBfyAAEP8BIAAQhQMCQCAALQAGIgFBAXFFDQBBssoAQYw3QcgAQfIZEPMEAAsgACABQQFyOgAGIABBoARqEL0CIAAQeCAAKALQASAAKAIAEIsBIAAoAtABIAAoArQBEIsBIAAoAtABEJcBIABBAEGICBCSBRoLEgACQCAARQ0AIAAQUSAAECILCywBAX8jAEEQayICJAAgAiABNgIAQbDQACACEDwgAEHk1AMQgQEgAkEQaiQACw0AIAAoAtABIAEQiwELAgALkQMBBH8CQAJAAkACQAJAIAEvAQ4iAkGAf2oOAgABAgsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0GSEkEAEDwPC0ECIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAkGsMkEAEDwPCwJAAkAgAS0ADCIDRQ0AAkACQCABLQAQDQAgA0EARyECQQEhBAwBC0EAIQQDQCAEIgVBAWoiAiADRg0CIAIhBCABIAJqQRBqLQAADQALIAIgA0khAiAFQQJqIQQLIAQhBCACDQELQZISQQAQPA8LQQEgAUEQaiIBIAEgBGogAyAEayAAKAIIKAIAEQkARQ0BQawyQQAQPA8LIAJBgCNGDQECQCAAKAIIKAIMIgJFDQAgASACEQQAQQBKDQELIAEQzgQaCw8LIAEgACgCCCgCBBEIAEH/AXEQygQaCzUBAn9BACgCkNoBIQNBgAEhBAJAAkACQCAAQX9qDgIAAQILQYEBIQQLIAMgBCABIAIQ/wQLCxsBAX9BqNgAENYEIgEgADYCCEEAIAE2ApDaAQvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQxQQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsEMQEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQxQQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0ACwsLbQEDfwJAQQAoApTaASIBRQ0AAkAQbyICRQ0AIAIgAS0ABkEARxCEAyACQQA6AEkgAiABLQAIQQBHQQF0IgM6AEkgAS0AB0UNACACIANBAXI6AEkLAkAgAS0ABg0AIAFBADoACQsgAEEGEIcDCwuPFQIHfwF+IwBBgAFrIgIkACACEG8iAzYCWCACIAE2AlQgAiAANgJQAkACQAJAIANFDQAgAC0ACQ0BCwJAAkACQCABLwEOIgRB/35qDhIAAAABAwMDAwMDAwMDAwMCAgIDCwJAIAAtAApFDQAgAEEUahDFBBogAEEAOgAKIAAoAhAQIiAAQQA2AhALIABCADcCDCAAQQE6AAsgAEEUaiABEL4EGiAAIAEtAA46AAoMAwsgAkH4AGpBACgC4Fg2AgAgAkEAKQLYWDcDcCABLQANIAQgAkHwAGpBDBCIBRoMAQsgA0UNAQsCQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABLwEOQYB/ag4XAgMEBgcFDQ0NDQ0NDQ0NDQABCAoJCwwNCyABLQAMRQ0PIAFBEGohBUEAIQADQCADIAUgACIAaigCAEEAEIgDGiAAQQRqIgQhACAEIAEtAAxJDQAMEAsACyABLQAMRQ0OIAFBEGohBUEAIQADQCADIAUgACIAaigCABCGAxogAEEEaiIEIQAgBCABLQAMSQ0ADA8LAAtBACEBAkAgA0UNACADKAKwASEBCwJAIAEiAA0AQQAhBQwNC0EAIQEgACEAA0AgAUEBaiIBIQUgASEBIAAoAgAiBCEAIAQNAAwNCwALQQAhAAJAIAMgAUEcaigCABB8IgZFDQAgBigCKCEACwJAIAAiAQ0AQQAhBQwLCyABIQFBACEAA0AgAEEBaiIAIQUgASgCDCIEIQEgACEAIAQNAAwLCwALAkAgAS0AIEHwAXFB0ABHDQAgAUHQADoAIAsCQAJAIAEtACAiBEECRg0AIARB0ABHDQFBACEEAkAgAUEcaigCACIFRQ0AIAMgBRCYASAFIQQLQQAhBQJAIAQiA0UNACADLQADQQ9xIQULQQAhBAJAAkACQAJAIAVBfWoOBgEDAwMDAAMLIAMoAhBBCGohBAwBCyADQQhqIQQLIAQvAQAhBAsCQCAEQf//A3EiBA0AAkAgAC0ACkUNACAAQRRqEMUEGiAAQQA6AAogACgCEBAiIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQvgQaIAAgAS0ADjoACgwOCwJAAkAgAw0AQQAhAQwBCyADLQADQQ9xIQELAkACQAJAIAFBfWoOBgACAgICAQILIAJB0ABqIAQgAygCDBBcDA8LIAJB0ABqIAQgA0EYahBcDA4LQZg7QY0DQaMvEO4EAAsgAUEcaigCAEHkAEcNACACQdAAaiADKAKkAS8BDCADKAIAEFwMDAsCQCAALQAKRQ0AIABBFGoQxQQaIABBADoACiAAKAIQECIgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARC+BBogACABLQAOOgAKDAsLIAJB8ABqIAMgAS0AICABQRxqKAIAEF0gAkEANgJgIAIgAikDcDcDIAJAIAMgAkEgahD3AiIERQ0AIAQoAgBBgICA+ABxQYCAgNAARw0AIAJB6ABqIANBCCAEKAIcEO8CIAIgAikDaDcDcAsgAiACKQNwNwMYAkACQCADIAJBGGoQ8wINACACIAIpA3A3AxBBACEEIAMgAkEQahDSAkUNAQsgAiACKQNwNwMIIAMgAkEIaiACQeAAahD2AiEECyAEIQUCQCACKAJgIgQgAUEiai8BACIDSw0AAkAgAC0ACkUNACAAQRRqEMUEGiAAQQA6AAogACgCEBAiIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQvgQaIAAgAS0ADjoACgwLCyACIAQgA2siADYCYCACIAAgAUEkai8BACIBIAAgAUkbIgE2AmAgAkHQAGpBASABEF4iAUUNCiABIAUgA2ogAigCYBCQBRoMCgsgAkHwAGogAyABLQAgIAFBHGooAgAQXSACIAIpA3A3AzAgAkHQAGpBECADIAJBMGpBABBfIgEQXiIARQ0JIAIgAikDcDcDKCABIAMgAkEoaiAAEF9GDQlBqMcAQZg7QZIEQaMxEPMEAAsgAkHgAGogAyABQRRqLQAAIAEoAhAQXSACIAIpA2AiCTcDaCACIAk3AzggAyACQfAAaiACQThqEGAgAS0ADSABLwEOIAJB8ABqQQwQiAUaDAgLIAMQhQMMBwsgAEEBOgAGAkAQbyIBRQ0AIAEgAC0ABkEARxCEAyABQQA6AEkgASAALQAIQQBHQQF0IgQ6AEkgAC0AB0UNACABIARBAXI6AEkLAkAgAC0ABg0AIABBADoACQsgA0UNBiADQQQQhwMMBgsgAEEAOgAJIANFDQUgAxCDAxoMBQsgAEEBOgAGAkAQbyIDRQ0AIAMgAC0ABkEARxCEAyADQQA6AEkgAyAALQAIQQBHQQF0IgE6AEkgAC0AB0UNACADIAFBAXI6AEkLAkAgAC0ABg0AIABBADoACQsQaAwECwJAIANFDQACQAJAIAEoAhAiBA0AIAJCADcDcAwBCyACIAQ2AnAgAkEINgJ0IAMgBBCYAQsgAiACKQNwNwNIAkACQCADIAJByABqEPcCIgQNAEEAIQUMAQsgBCgCAEGAgID4AHFBgICAwABGIQULAkACQCAFIgcNACACIAEoAhA2AkBBmQogAkHAAGoQPAwBCyADQQFBAyABLQAMQXhqIgVBBEkbIgg6AAcCQCABQRRqLwEAIgZBAXFFDQAgAyAIQQhyOgAHCwJAIAZBAnFFDQAgAyADLQAHQQRyOgAHCyADIAQ2AtgBIAVBBEkNACAFQQJ2IgRBASAEQQFLGyEFIAFBGGohBkEAIQEDQCADIAYgASIBQQJ0aigCAEEBEIgDGiABQQFqIgQhASAEIAVHDQALCyAHRQ0EIABBADoACSADRQ0EIAMQgwMaDAQLIABBADoACQwDCwJAIAAgAUG42AAQ0AQiA0GAf2pBAkkNACADQQFHDQMLAkAQbyIDRQ0AIAMgAC0ABkEARxCEAyADQQA6AEkgAyAALQAIQQBHQQF0IgE6AEkgAC0AB0UNACADIAFBAXI6AEkLIAAtAAYNAiAAQQA6AAkMAgsgAkHQAGpBECAFEF4iB0UNAQJAAkAgBg0AQQAhAQwBCyAGKAIoIQELIAEiAUUNASABIQFBACEAA0AgAkHwAGogA0EIIAEiARDvAiAHIAAiBUEEdGoiACACKAJwNgIAIAAgAS8BBDYCBEEAIQQCQCABKAIIIgZFDQAgAkHwAGogA0EIIAYQ7wIgAigCcCEECyAAIAQ2AgggAEHPhn8gASgCECIEIAMoAKQBIgYgBigCIGoiBmtBBHYgBCAGRhs7AQwgASgCDCIEIQEgBUEBaiEAIAQNAAwCCwALIAJB0ABqQQggBRBeIgdFDQACQAJAIAMNAEEAIQEMAQsgAygCsAEhAQsgASIBRQ0AQQAhACABIQEDQCAHIAAiBUEDdGoiACABIgEoAhw2AgAgACABLwEWIgRBz4Z/IAQbOwEEQQAhBAJAIAEoAigiBkUNAEHPhn8gBigCECIEIAMoAKQBIgYgBigCIGoiBmtBBHYgBCAGRhshBAsgACAEOwEGIAVBAWohACABKAIAIgQhASAEDQALCyACQYABaiQAC5sCAQV/IwBBEGsiAyQAAkAgACgCBCIELwEOQYIBRw0AAkACQCAEQSJqLwEAIgUgAUkNAAJAIAAoAgAiAS0ACkUNACABQRRqEMUEGiABQQA6AAogASgCEBAiIAFBADYCEAsgAUIANwIMIAFBAToACyABQRRqIAAoAgQQvgQaIAEgACgCBC0ADjoACgwBCyAAQQwgASAFayIBIARBJGovAQAiBCABIARJGyIGEF4iB0UNACAGRQ0AIAIgBUEDdGohBUEAIQEDQCAAKAIIIQQgAyAFIAEiAUEDdGopAwA3AwggBCAHIAFBDGxqIANBCGoQYCABQQFqIgQhASAEIAZHDQALCyADQRBqJAAPC0GgwQBBmDtB5gJBxhMQ8wQAC8oEAgJ/AX4jAEEQayIEJAAgAyEFAkACQAJAAkACQAJAAkACQAJAAkACQAJAQdAAIAIgAkHwAXFB0ABGGyICQX9qDlAAAQIJAwkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBAQEBAkJCQkJCQkJCQkJCQYFCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBwkLIAAgAxDtAgwKCwJAAkACQAJAIAMOBAECAwAKCyAAQQApA4BrNwMADAwLIABCADcDAAwLCyAAQQApA+BqNwMADAoLIABBACkD6Go3AwAMCQsgACADNgIAIABBATYCBAwICyAAIAEgAxC6AgwHCyAAIAEgAkFgaiADEI4DDAYLAkBBACADIANBz4YDRhsiAyABKACkAUEkaigCAEEEdkkNAAJAIANB0IYDTw0AIAMhBQwFCyADQQAvAbDIAUHQhgNqSQ0AIAMhBQwECyAAIAM2AgAgAEEDNgIEDAULAkAgASgApAFBPGooAgBBA3YgA0sNACADIQUMAwsCQCABKAK0ASADQQxsaigCCCICRQ0AIAAgAUEIIAIQ7wIMBQsgACADNgIAIABBAjYCBAwECwJAIAMNACAAQgA3AwAMBAsgACADNgIAIABBCDYCBCABIAMQmAEMAwsgAyEFIANB5QBGDQELIAQgBTYCBCAEIAI2AgBB4gkgBBA8IABCADcDAAwBCwJAIAEpADgiBkIAUg0AIAEoAqwBIgNFDQAgACADKQMgNwMADAELIAAgBjcDAAsgBEEQaiQAC84BAQJ/AkACQCAAKAIAIgMtAAZFDQAgAiECIAMtAAkNAQtBACECCwJAIAIiAkHoB08NAAJAIAMtAApFDQAgA0EUahDFBBogA0EAOgAKIAMoAhAQIiADQQA2AhALIANBADsBDiADIAI7AQwgAyABOgALQQAhBAJAIAJFDQAgAiABbBAhIQQLIAMgBCICNgIQAkAgAg0AIANBADsBDAsgA0EUaiAAKAIEEL4EGiADIAAoAgQtAA46AAogAygCEA8LQbjIAEGYO0ExQck1EPMEAAvWAgECfyMAQcAAayIDJAAgAyACNgI8IAMgASkDADcDIEEAIQICQCADQSBqEPoCDQAgAyABKQMANwMYAkACQCAAIANBGGoQpQIiAg0AIAMgASkDADcDECAAIANBEGoQpAIhAQwBCwJAIAAgAhCmAiIBDQBBACEBDAELAkAgACACEJICDQAgASEBDAELQQAgASACKAIAQYCAgPgAcUGAgIDIAEYbIQELAkACQCABIgQNAEEAIQEMAQsCQCADKAI8IgFFDQAgAyABQRBqNgI8IANBMGpB/AAQ1QIgA0EoaiAAIAQQuwIgAyADKQMwNwMIIAMgAykDKDcDACAAIAEgA0EIaiADEGMLQQEhAQsgASEBAkAgAg0AIAEhAgwBCwJAIAMoAjxFDQAgACACIANBPGpBCRCNAiABaiECDAELIAAgAkEAQQAQjQIgAWohAgsgA0HAAGokACACC+QHAQN/IwBB0ABrIgMkACABQQhqQQA2AgAgAUIANwIAIAMgAikDADcDMAJAAkACQAJAAkACQCAAIANBMGogA0HIAGogA0HEAGoQnQIiBEEASA0AAkAgAygCRCIFRQ0AIAMpA0hQDQAgAigCBCIAQYCAwP8HcQ0DIABBCHFFDQMgAUHXADoACiABIAIoAgA2AgAMAgsCQAJAIAVFDQAgA0E4aiAAQQggBRDvAiACIAMpAzg3AwAMAQsgAiADKQNINwMACyABIARBz4Z/IAQbOwEICyACKAIAIQQCQAJAAkACQAJAQRAgAigCBCIFQQ9xIAVBgIDA/wdxGw4JAQQEBAAEAwQCBAsgASAEQf//AHE2AgAgASAEQQ52QSBqOgAKDAQLIARBoH9qIgVBI0sNAiABIAU2AgAgAUEFOgAKDAMLAkACQCAEDQBBACEFDAELIAQtAANBD3EhBQsCQCAFQXxqDgYAAgICAgACCyABIAQ2AgAgAUHSADoACiADIAIpAwA3AyggASAAIANBKGpBABBfNgIEDAILIAEgBDYCACABQTI6AAoMAQsgAyACKQMANwMgAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAgA0EgahD5Ag4NAQQLBQkGAwcLCAoCAAsLIAFBAzYCACABQQI6AAoMCwsgAUEANgIAIAFBAjoACgwKCyABQQY6AAogASACKQMANwIADAkLIAFBAjoACiADIAIpAwA3AwggAUEBQQIgACADQQhqEPICGzYCAAwICyABQQE6AAogAyACKQMANwMQIAEgACADQRBqEPACOQIADAcLIAFB0QA6AAogAigCACECIAEgBDYCACABIAIvAQhBgICAgHhyNgIEDAYLIAEgBDYCACABQTA6AAogAyACKQMANwMYIAEgACADQRhqQQAQXzYCBAwFCyABIAQ2AgAgAUEDOgAKDAQLIAIoAgAiAkUNBSACKAIAQYCAgPgAcUGAgIAwRw0FIAEgBDYCACABQdQAOgAKDAMLIAIoAgAiAkUNBSACKAIAQYCAgPgAcUGAgIAoRw0FIAEgBDYCACABQdMAOgAKIAEgAi8BBEGAgICAeHI2AgQMAgsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgNAARw0FIAEgBDYCACABQdYAOgAKIAEgAigCHC8BBEGAgICAeHI2AgQMAQsgAUEHOgAKIAEgAikDADcCAAsgA0HQAGokAA8LQa/PAEGYO0GTAUG/KBDzBAALQbPFAEGYO0H0AUG/KBDzBAALQdDCAEGYO0H7AUG/KBDzBAALQfvAAEGYO0GEAkG/KBDzBAALgwEBBH8jAEEQayIBJAAgASAALQBGNgIAQQAoApTaASECQdM0IAEQPCAAKAKsASIDIQQCQCADDQAgACgCsAEhBAtBACEDAkAgBCIERQ0AIAQoAhwhAwsgASADNgIIIAEgAC0ARjoADCACQQE6AAkgAkGAASABQQhqQQgQ/wQgAUEQaiQACxAAQQBByNgAENYENgKU2gELhAIBAn8jAEEgayIEJAAgBCACKQMANwMIIAAgBEEQaiAEQQhqEGACQAJAAkACQCAELQAaIgVBX2pBA0kNAEEAIQIgBUHUAEcNASAEKAIQIgUhAiAFQYGAgIB4cUGBgICAeEcNAUHCxABBmDtBogJBgSgQ8wQACyAFQRh0IgJBf0wNASAEKAIQQQF0IgVBgICACE8NAiACIAVyQYGAgIB4ciECCyABIAI2AgAgBCADKQMANwMAIAAgBEEQaiAEEGAgAUEMaiAEQRhqKAIANgAAIAEgBCkDEDcABCAEQSBqJAAPC0HjzABBmDtBnAJBgSgQ8wQAC0GkzABBmDtBnQJBgSgQ8wQAC0kBAn8jAEEQayIEJAAgASgCACEFIAQgAikDADcDCCAEIAMpAwA3AwAgACAFIARBCGogBBBjIAEgASgCAEEQajYCACAEQRBqJAAL8QMBBX8jAEEQayIBJAACQCAAKAIwIgJBAEgNAAJAAkAgACgCECIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEEIAMoAghBq5bxk3tGDQELQQAhBAsCQAJAIAQiAw0AQQAhBAwBCyADKAIEIQQLAkAgAiAEIgRIDQAgAEE0ahDFBBogAEF/NgIwDAELAkACQCAAQTRqIgUgAyACakGAAWogBEHsASAEQewBSBsiAhDEBA4CAAIBCyAAIAAoAjAgAmo2AjAMAQsgAEF/NgIwIAUQxQQaCwJAIABBDGpBgICABBDwBEUNAAJAIAAtAAgiAkEBcQ0AIAAtAAdFDQELIAAoAhgNACAAIAJB/gFxOgAIIAAQZgsCQCAAKAIYIgJFDQAgAiABQQhqEE8iAkUNACABIAEoAgg2AgQgAUEAIAIgAkHg1ANGGzYCACAAQYABIAFBCBD/BCAAKAIYEFIgAEEANgIYAkACQCAAKAIQIgNFDQAgAygCAEHT+qrseEcNACADIQQgAygCCEGrlvGTe0YNAQtBACEECwJAAkAgBCIERQ0AQQMhAyAEKAIEDQELQQQhAwsgASADNgIMIABBADoABiAAQQQgAUEMakEEEP8EIABBACgCjNUBQYCAwABBgIDAAiACQeDUA0YbajYCDAsgAUEQaiQAC90CAQR/IwBBEGsiASQAAkACQCAAKAIQIgJFDQAgAigCAEHT+qrseEcNACACIQMgAigCCEGrlvGTe0YNAQtBACEDCwJAAkAgAyICRQ0AIAIoAgQiA0UNACACQYABaiIEIAMQgQMNACACKAIEIQICQCAAKAIYIgNFDQAgAxBSCyABIAAtAAQ6AAAgACAEIAIgARBMIgI2AhggBEGA2QBGDQEgAkUNASACEFoMAQsCQCAAKAIYIgJFDQAgAhBSCyABIAAtAAQ6AAggAEGA2QBBoAEgAUEIahBMNgIYC0EAIQICQCAAKAIYIgMNAAJAAkAgACgCECICRQ0AIAIoAgBB0/qq7HhHDQAgAiEEIAIoAghBq5bxk3tGDQELQQAhBAsCQCAEIgRFDQBBAyECIAQoAgQNAQtBBCECCyABIAI2AgwgACADQQBHOgAGIABBBCABQQxqQQQQ/wQgAUEQaiQAC44BAQN/IwBBEGsiASQAIAAoAhgQUiAAQQA2AhgCQAJAIAAoAhAiAkUNACACKAIAQdP6qux4Rw0AIAIhAyACKAIIQauW8ZN7Rg0BC0EAIQMLAkACQCADIgNFDQBBAyECIAMoAgQNAQtBBCECCyABIAI2AgwgAEEAOgAGIABBBCABQQxqQQQQ/wQgAUEQaiQAC7MBAQR/IwBBEGsiACQAQQAoApjaASIBKAIYEFIgAUEANgIYAkACQCABKAIQIgJFDQAgAigCAEHT+qrseEcNACACIQMgAigCCEGrlvGTe0YNAQtBACEDCwJAAkAgAyIDRQ0AQQMhAiADKAIEDQELQQQhAgsgACACNgIMIAFBADoABiABQQQgAEEMakEEEP8EIAFBACgCjNUBQYCQA2o2AgwgASABLQAIQQFyOgAIIABBEGokAAuJAwEEfyMAQZABayIBJAAgASAANgIAQQAoApjaASECQc89IAEQPEF/IQMCQCAAQR9xDQAgAigCGBBSIAJBADYCGAJAAkAgAigCECIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEEIAMoAghBq5bxk3tGDQELQQAhBAsCQAJAIAQiBEUNAEEDIQMgBCgCBA0BC0EEIQMLIAEgAzYCCCACQQA6AAYgAkEEIAFBCGpBBBD/BCACQb0kIAAQswQiBDYCEAJAIAQNAEF+IQMMAQtBACEDIABFDQAgASAANgIMIAFB0/qq7Hg2AgggBCABQQhqQQgQtAQaELUEGiACQYABNgIcQQAhAAJAIAIoAhgiAw0AAkACQCACKAIQIgBFDQAgACgCAEHT+qrseEcNACAAIQQgACgCCEGrlvGTe0YNAQtBACEECwJAIAQiBEUNAEEDIQAgBCgCBA0BC0EEIQALIAEgADYCjAEgAiADQQBHOgAGIAJBBCABQYwBakEEEP8EQQAhAwsgAUGQAWokACADC+kDAQV/IwBBsAFrIgIkAAJAAkBBACgCmNoBIgMoAhwiBA0AQX8hAwwBCyADKAIQIQUCQCAADQAgAkEoakEAQYABEJIFGiACQauW8ZN7NgIwIAIgBUGAAWogBSgCBBDlBDYCNAJAIAUoAgQiAUGAAWoiACADKAIcIgRGDQAgAiABNgIEIAIgACAEazYCAEGZ0wAgAhA8QX8hAwwCCyAFQQhqIAJBKGpBCGpB+AAQtAQaELUEGkH6IEEAEDwgAygCGBBSIANBADYCGAJAAkAgAygCECIBRQ0AIAEoAgBB0/qq7HhHDQAgASEFIAEoAghBq5bxk3tGDQELQQAhBQsCQAJAIAUiBUUNAEEDIQEgBSgCBA0BC0EEIQELIAIgATYCrAEgA0EAOgAGIANBBCACQawBakEEEP8EIANBA0EAQQAQ/wQgA0EAKAKM1QE2AgwgAyADLQAIQQFyOgAIQQAhAwwBCyAFKAIEQYABaiEGAkACQAJAIAFBH3ENACABQf8fSw0AIAQgAWogBk0NAQsgAiAGNgIYIAIgBDYCFCACIAE2AhBB8dIAIAJBEGoQPEEAIQFBfyEFDAELIAUgBGogACABELQEGiADKAIcIAFqIQFBACEFCyADIAE2AhwgBSEDCyACQbABaiQAIAMLhwEBAn8CQAJAQQAoApjaASgCECIBRQ0AIAEoAgBB0/qq7HhHDQAgASECIAEoAghBq5bxk3tGDQELQQAhAgsCQCACIgFFDQAQywIgAUGAAWogASgCBBDMAiAAEM0CQQAPCyAAQgA3AAAgAEEYakIANwAAIABBEGpCADcAACAAQQhqQgA3AABBfwveBQECfyMAQSBrIgIkAAJAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBgECAwQHBQALAkACQCADQYB/ag4CAAEHCyABKAIQEGkNCSABIABBIGpBDEENELYEQf//A3EQywQaDAkLIABBNGogARC+BA0IIABBADYCMAwICwJAAkAgACgCECIDDQBBACEADAELAkAgAygCAEHT+qrseEYNAEEAIQAMAQtBACEAIAMoAghBq5bxk3tHDQAgAygCBCEACyABIAAQzAQaDAcLAkACQCAAKAIQIgMNAEEAIQAMAQsCQCADKAIAQdP6qux4Rg0AQQAhAAwBC0EAIQAgAygCCEGrlvGTe0cNACADKAIMIQALIAEgABDMBBoMBgsCQAJAQQAoApjaASgCECIARQ0AIAAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQAJAIAMiAEUNABDLAiAAQYABaiAAKAIEEMwCIAIQzQIMAQsgAkEYakIANwMAIAJBEGpCADcDACACQgA3AwggAkIANwMACyABLQANIAEvAQ4gAkEgEIgFGgwFCyABQYCAlDAQzAQaDAQLIAFBpSBBABCnBCIAQYbWACAAGxDNBBoMAwsgA0GDIkYNAQsCQCABLwEOQYQjRw0AIAFBmCtBABCnBCIAQYbWACAAGxDNBBoMAgsCQAJAIAAgAUHk2AAQ0ARBgH9qDgIAAQMLAkAgAC0ABiIBRQ0AAkAgACgCGA0AIABBADoABiAAEGYMBAsgAQ0DCyAAKAIYRQ0CIAAQZwwCCyAALQAHRQ0BIABBACgCjNUBNgIMDAELQQAhAwJAIAAoAhgNAAJAAkAgACgCECIARQ0AIAAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQCADIgBFDQBBAyEDIAAoAgQNAQtBBCEDCyABIAMQzAQaCyACQSBqJAAL2gEBBn8jAEEQayICJAACQCAAQWBqQQAoApjaASIDRw0AAkACQCADKAIcIgQNAEF/IQMMAQsgAygCECIFKAIEQYABaiEGAkACQAJAIAEtAAwiB0EfcQ0AIAQgB2ogBk0NAQsgAiAGNgIIIAIgBDYCBCACIAc2AgBB8dIAIAIQPEEAIQRBfyEHDAELIAUgBGogAUEQaiAHELQEGiADKAIcIAdqIQRBACEHCyADIAQ2AhwgByEDCwJAIANFDQAgABC4BAsgAkEQaiQADwtB7ShBwDhBqwJBjxoQ8wQACzMAAkAgAEFgakEAKAKY2gFHDQACQCABDQBBAEEAEGoaCw8LQe0oQcA4QbMCQZ4aEPMEAAsgAQJ/QQAhAAJAQQAoApjaASIBRQ0AIAEoAhghAAsgAAvDAQEDf0EAKAKY2gEhAkF/IQMCQCABEGkNAAJAIAENAEF+DwtBACEDAkACQANAIAAgAyIDaiABIANrIgRBgAEgBEGAAUkbIgQQag0BIAQgA2oiBCEDIAQgAU8NAgwACwALQX0PC0F8IQNBAEEAEGoNAAJAAkAgAigCECIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEBIAMoAghBq5bxk3tGDQELQQAhAQsCQCABIgMNAEF7DwsgA0GAAWogAygCBBCBAyEDCyADC9IBAQF/QfDYABDWBCIBIAA2AhRBvSRBABCyBCEAIAFBfzYCMCABIAA2AhAgAUEBOgAHIAFBACgCjNUBQYCA4ABqNgIMAkBBgNkAQaABEIEDDQBBDiABEJQEQQAgATYCmNoBAkACQCABKAIQIgFFDQAgASgCAEHT+qrseEcNACABIQAgASgCCEGrlvGTe0YNAQtBACEACwJAIAAiAUUNACABQewBaigCAEUNACABIAFB6AFqKAIAakGAAWoQoQQaCw8LQePLAEHAOEHOA0GBEBDzBAALGQACQCAAKAIYIgBFDQAgACABIAIgAxBQCwtMAQJ/IwBBEGsiASQAAkAgACgCqAEiAkUNACAALQAGQQhxDQAgASACLwEEOwEIIABBxwAgAUEIakECEE4LIABCADcDqAEgAUEQaiQAC9YIAgh/AX4jAEHAAGsiAyQAAkACQAJAIAFBAWogACgCLCIELQBDRw0AIAMgBCkDUCILNwM4IAMgCzcDIAJAAkAgBCADQSBqIARB0ABqIgUgA0E0ahCdAiIGQX9KDQAgAyADKQM4NwMIIAMgBCADQQhqEMcCNgIAIANBKGogBEGuMSADEOUCQX8hBAwBCwJAIAZB0IYDSA0AIAZBsPl8aiIGQQAvAbDIAU4NAyABIQECQCACRQ0AAkAgAi8BCCIBQQpJDQAgA0EoaiAEQcQIEOcCQX0hBAwDCyAEIAFBAWo6AEMgBEHYAGogAigCDCABQQN0EJAFGiABIQELAkAgASIBQZDjACAGQQN0aiICLQACIgdPDQAgBCABQQN0akHYAGpBACAHIAFrQQN0EJIFGgsgAi0AAyIBQQFxDQQgAEIANwMgAkAgAUEIcUUNACADIAUpAwA3AxACQAJAIAQgA0EQahD3AiIADQBBACEADAELIAAtAANBD3EhAAsCQCAAQXxqDgYBAAAAAAEACyADQShqIARBCCAEQQAQjwEQ7wIgBCADKQMoNwNQCyAEQZDjACAGQQN0aigCBBEAAEEAIQQMAQsCQCAEQQggBCgApAEiByAHKAIgaiAGQQR0aiIGLwEIQQN0IAYtAA5BAXRqQRhqEIgBIgcNAEF+IQQMAQsgByAGKAIAIgg7AQQgByADKAI0NgIIIAcgCCAGKAIEaiIJOwEGIAAoAighCCAHIAY2AhAgByAINgIMAkACQCAIRQ0AIAAgBzYCKCAAKAIsIgAtAEYNASAAIAc2AqgBIAlB//8DcQ0BQfXIAEHbN0EVQdkoEPMEAAsgACAHNgIoCyAHQRhqIQkgBi0ACiEAAkACQCAGLQALQQFxDQAgACEAIAkhBwwBCyAHIAUpAwA3AxggAEF/aiEAIAdBIGohBwsgByEKIAAhBwJAAkAgAkUNACACKAIMIQUgAi8BCCEADAELIARB2ABqIQUgASEACyAAIQAgBSEBAkACQCAGLQALQQRxRQ0AIAogASAHQX9qIgcgACAHIABJGyIFQQN0EJAFIQoCQAJAIAJFDQAgBCACQQBBACAFaxCUAhogAiEADAELAkAgBCAAIAVrIgIQkQEiAEUNACAAKAIMIAEgBUEDdGogAkEDdBCQBRoLIAAhAAsgA0EoaiAEQQggABDvAiAKIAdBA3RqIAMpAyg3AwAMAQsgCiABIAcgACAHIABJG0EDdBCQBRoLAkAgBi0AC0ECcUUNACAJKQAAQgBSDQAgAyADKQM4NwMYIANBKGogBEEIIAQgBCADQRhqEKcCEI8BEO8CIAkgAykDKDcDAAsCQCAELQBHRQ0AIAQoAtgBIAhHDQAgBC0AB0EEcUUNACAEQQgQhwMLQQAhBAsgA0HAAGokACAEDwtBpjZB2zdBHUGgHxDzBAALQZ0TQds3QStBoB8Q8wQAC0Hl0wBB2zdBO0GgHxDzBAALCQAgACABNgIYC18BAn8jAEEQayICJAAgACAAKAIsIgMoAsABIAFqNgIYAkAgAygCqAEiAEUNACADLQAGQQhxDQAgAiAALwEEOwEIIANBxwAgAkEIakECEE4LIANCADcDqAEgAkEQaiQAC+cCAQR/IwBBEGsiAiQAIAAoAiwhAwJAAkACQAJAIAEoAgxFDQACQCAAKQAgQgBSDQAgASgCEC0AC0ECcUUNACAAIAEpAxg3AyALIAAgASgCDCIENgIoAkAgAy0ARg0AIAMgBDYCqAEgBC8BBkUNAwsgAUEANgIMIAFBADsBBgwBCwJAIAAtABAiBEEQcUUNACAAIARB7wFxOgAQIAEgASgCECgCADsBBAwBCwJAIAMoAqgBIgFFDQAgAy0ABkEIcQ0AIAIgAS8BBDsBCCADQccAIAJBCGpBAhBOCyADQgA3A6gBIAAQ9AECQAJAIAAoAiwiBSgCsAEiASAARw0AIAVBsAFqIQEMAQsgASEDA0AgAyIBRQ0EIAEoAgAiBCEDIAEhASAEIABHDQALCyABIAAoAgA2AgAgBSAAEFQLIAJBEGokAA8LQfXIAEHbN0EVQdkoEPMEAAtBh8QAQds3QakBQbgbEPMEAAs/AQJ/AkAgACgCsAEiAUUNACABIQEDQCAAIAEiASgCADYCsAEgARD0ASAAIAEQVCAAKAKwASICIQEgAg0ACwsLoAEBA38jAEEQayICJAACQAJAIAFB0IYDSQ0AQco9IQMgAUGw+XxqIgFBAC8BsMgBTw0BQZDjACABQQN0ai8BABCKAyEDDAELQYLHACEDIAAoAgAiBEEkaigCAEEEdiABTQ0AIAQgBCgCIGogAUEEdGovAQwhASACIAAoAgA2AgwgAkEMaiABQQAQiwMiAUGCxwAgARshAwsgAkEQaiQAIAMLXwEDfyMAQRBrIgIkAEGCxwAhAwJAIAAoAgAiBEE8aigCAEEDdiABTQ0AIAQgBCgCOGogAUEDdGovAQQhASACIAAoAgA2AgwgAkEMaiABQQAQiwMhAwsgAkEQaiQAIAMLLAEBfyAAQbABaiECAkADQCACKAIAIgBFDQEgACECIAAvARYgAUcNAAsLIAALLAEBfyAAQbABaiECAkADQCACKAIAIgBFDQEgACECIAAoAhwgAUcNAAsLIAAL/AICBH8BfiMAQTBrIgMkAEEAIQQCQCAALwEIDQAgAyAAKQNQIgc3AwggAyAHNwMYAkACQCAAIANBCGogA0EgaiADQSxqEJ0CIgVBAE4NAEEAIQYMAQsCQCAFQdCGA0gNACADQRBqIABBxx9BABDlAkEAIQYMAQsCQCACQQFGDQAgAEGwAWohBgNAIAYoAgAiBEUNASAEIQYgBSAELwEWRw0ACyAERQ0AIAQhBgJAAkACQCACQX5qDgMEAAIBCyAEIAQtABBBEHI6ABAgBCEGDAMLQds3QZMCQcQNEO4EAAsgBBB+C0EAIQYgAEE4EIkBIgJFDQAgAiAFOwEWIAIgADYCLCAAIAAoAswBQQFqIgQ2AswBIAIgBDYCHAJAAkAgACgCsAEiBA0AIABBsAFqIQYMAQsgBCEEA0AgBCIGKAIAIgUhBCAGIQYgBQ0ACwsgBiACNgIAIAIgAUEAEHQaIAIgACkDwAE+AhggAiEGCyAGIQQLIANBMGokACAEC80BAQV/IwBBEGsiASQAAkAgACgCLCICKAKsASAARw0AAkAgAigCqAEiA0UNACACLQAGQQhxDQAgASADLwEEOwEIIAJBxwAgAUEIakECEE4LIAJCADcDqAELIAAQ9AECQAJAAkAgACgCLCIEKAKwASICIABHDQAgBEGwAWohAgwBCyACIQMDQCADIgJFDQIgAigCACIFIQMgAiECIAUgAEcNAAsLIAIgACgCADYCACAEIAAQVCABQRBqJAAPC0GHxABB2zdBqQFBuBsQ8wQAC+ABAQR/IwBBEGsiASQAAkACQCAAKAIsIgItAEYNABDYBCACQQApA4DoATcDwAEgABD6AUUNACAAEPQBIABBADYCGCAAQf//AzsBEiACIAA2AqwBIAAoAighAwJAIAAoAiwiBC0ARg0AIAQgAzYCqAEgAy8BBkUNAgsCQCACLQAGQQhxDQAgASADLwEEOwEIIAJBxgAgAUEIakECEE4LAkAgACgCMCIDRQ0AIAAoAjQhBCAAQgA3AzAgAiAEIAMRAgALIAIQiQMLIAFBEGokAA8LQfXIAEHbN0EVQdkoEPMEAAsSABDYBCAAQQApA4DoATcDwAEL/QMBCH8jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgCqAEiBA0AQQAhBAwBCyAELwEEIQQLIAAgBCIEOwEKAkACQCADQeDUA0cNAEGwL0EAEDwMAQsgAiADNgIQIAIgBEH//wNxNgIUQYAzIAJBEGoQPAsgACADOwEIAkAgA0Hg1ANGDQACQCAAKAKoASIERQ0AIAQhBANAIAAoAKQBIgUoAiAhBiAEIgQvAQQhByAEKAIQIggoAgAhCSACIAAoAKQBNgIYIAcgCWshCSAIIAUgBmprIgdBBHUhBQJAAkAgB0Hx6TBJDQBByj0hBiAFQbD5fGoiB0EALwGwyAFPDQFBkOMAIAdBA3RqLwEAEIoDIQYMAQtBgscAIQYgAigCGCIIQSRqKAIAQQR2IAVNDQAgCCAIKAIgaiAHai8BDCEGIAIgAigCGDYCDCACQQxqIAZBABCLAyIGQYLHACAGGyEGCyACIAk2AgAgAiAGNgIEIAIgBTYCCEHuMiACEDwgBCgCDCIFIQQgBQ0ACwsgAEEFEIcDIAEQJyADQeDUA0YNASAAEIgEDAELIABBBRCHAyABECcLAkAgACgCqAEiBEUNACAALQAGQQhxDQAgAiAELwEEOwEYIABBxwAgAkEYakECEE4LIABCADcDqAEgAkEgaiQACx8AIAEgAkHkACACQeQASxtB4NQDahCBASAAQgA3AwALbwEEfxDYBCAAQQApA4DoATcDwAEgAEGwAWohAQNAQQAhAgJAIAAtAEYNACAAKQPAAachAyABIQQCQANAIAQoAgAiAkUNASACIQQgAigCGEF/aiADTw0ACyAAEPcBIAIQfwsgAkEARyECCyACDQALC+UCAQR/IwBB0ABrIgIkAAJAAkACQAJAIAFFDQAgAUEDcQ0AIAAoAgQiAEUNAyAARSEDIAAhBAJAA0AgAyEDAkAgBCIAQQhqIAFLDQAgACgCBCIEIAFNDQAgASgCACIFQf///wdxIgBFDQQgASAAQQJ0aiAESw0FIAVBgICA+ABxDQIgAiAFNgIwQf0dIAJBMGoQPCACIAE2AiQgAkHtGjYCIEGhHSACQSBqEDxBkz1B4ARBjRgQ7gQACyAAKAIAIgBFIQMgACEEIAANAAwFCwALIANBAXENAyACQdAAaiQADwsgAiABNgJEIAJBzSg2AkBBoR0gAkHAAGoQPEGTPUHgBEGNGBDuBAALQdPIAEGTPUHiAUGbJxDzBAALIAIgATYCFCACQeAnNgIQQaEdIAJBEGoQPEGTPUHgBEGNGBDuBAALIAIgATYCBCACQdkiNgIAQaEdIAIQPEGTPUHgBEGNGBDuBAALoAQBCH8jAEEQayIDJAACQAJAAkAgAkGA4ANNDQBBACEEDAELIAFBgAJPDQEgACAAKAIIQQFqIgQ2AggCQAJAIARBIEkNACAEQR9xDQELECALAkAQggJBAXFFDQACQCAAKAIEIgRFDQAgBCEEA0ACQCAEIgUoAggiBkEYdiIEQc8ARg0AIAUoAgQhByAEIQQgBiEGIAVBCGohCAJAAkACQAJAA0AgBiEJIAQhBCAIIgggB08NAQJAIARBAUcNACAJQf///wdxIgZFDQNBACEEIAZBAnRBeGoiCkUNAANAIAggBCIEakEIai0AACIGQTdHDQUgBEEBaiIGIQQgBiAKRw0ACwsgCUH///8HcSIERQ0EIAggBEECdGoiCCgCACIGQRh2IgohBCAGIQYgCCEIIApBzwBGDQUMAAsAC0GcLkGTPUG6AkGTHRDzBAALQdPIAEGTPUHiAUGbJxDzBAALIAMgBjYCCCADIAg2AgAgAyAEQQRqNgIEQYYJIAMQPEGTPUHCAkGTHRDuBAALQdPIAEGTPUHiAUGbJxDzBAALIAUoAgAiBiEEIAYNAAsLIAAQhgELIAAgAUEBIAJBA2oiBEECdiAEQQRJGyIIEIcBIgQhBgJAIAQNACAAEIYBIAAgASAIEIcBIQYLQQAhBCAGIgZFDQAgBkEEakEAIAIQkgUaIAYhBAsgA0EQaiQAIAQPC0GtJkGTPUH3AkHqIhDzBAAL8QkBC38CQCAAKAIMIgFFDQACQCABKAKkAS8BDCICRQ0AIAEoAgAhA0EAIQQDQAJAIAMgBCIEQQN0aiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEJkBCyAEQQFqIgUhBCAFIAJHDQALCwJAIAEtAEMiAkUNACABQdAAaiEDQQAhBANAAkAgAyAEIgRBA3RqIgUoAARBiIDA/wdxQQhHDQAgASAFKAAAQQoQmQELIARBAWoiBSEEIAUgAkcNAAsLAkAgAS0AREUNAEEAIQQDQCABIAEoArgBIAQiBEECdGooAgBBChCZASAEQQFqIgUhBCAFIAEtAERJDQALCwJAIAEoAKQBQTxqKAIAQQhJDQBBACEEA0AgASABKAK0ASAEIgRBDGwiBWooAghBChCZASABIAEoArQBIAVqKAIEQQoQmQEgBEEBaiIFIQQgBSABKACkAUE8aigCAEEDdkkNAAsLIAEgASgCoAFBChCZAQJAIAEoADxBiIDA/wdxQQhHDQAgASABKAA4QQoQmQELAkAgASgANEGIgMD/B3FBCEcNACABIAEoADBBChCZAQsgASgCsAEiBEUNACAEIQQDQAJAIAQiAigAJEGIgMD/B3FBCEcNACABIAIoACBBChCZAQsgAigCKCIFIQQCQCAFRQ0AA0AgASAEIgRBChCZASAEKAIMIgUhBCAFDQALCyACKAIAIgUhBCAFDQALCyAAQQA2AgBBACEFQQAhBANAIAQhBiAFIQQCQAJAIAAoAgQiBQ0AQQAhAyAEIQcMAQsgBSEBIAQhBUEAIQQDQCABIghBCGohASAEIQQgBSEFAkACQAJAAkACQAJAA0AgBSEJIAQhCgJAAkACQCABIgMoAgAiB0GAgIB4cSIEQYCAgPgERiILDQAgAyAIKAIETw0EAkACQCAHQQBIDQAgB0GAgICABnEiBUGAgICABEcNAQsgBg0GIAAoAgwgA0EKEJkBQQEhBAwCCyAGRQ0AIAchASADIQICQAJAIARBgICACEYNACAHIQEgAyECIAMhBCAFDQELA0AgAiEEIAFB////B3EiBUUNCCAEIAVBAnRqIgQoAgAiBSEBIAQhAiAFQYCAgHhxQYCAgAhGDQAgBSEBIAQhAiAEIQQgBUGAgICABnFFDQALCwJAIAQiBCADRg0AIAMgBCADayIEQQJ1QYCAgAhyNgIAIARBBE0NCCADQQhqQTcgBEF4ahCSBRogACADEIQBIAlBBGogACAJGyADNgIAIANBADYCBCAKIQQgAyEFDAMLIAMgB0H/////fXE2AgALIAohBAsgCSEFCyAFIQUgBCEEIAsNBiADKAIAQf///wdxIgFFDQUgAyABQQJ0aiEBIAQhBCAFIQUMAAsAC0GcLkGTPUGFAkHzHBDzBAALQfIcQZM9QY0CQfMcEPMEAAtB08gAQZM9QeIBQZsnEPMEAAtB8McAQZM9QcYAQd8iEPMEAAtB08gAQZM9QeIBQZsnEPMEAAsgBCEDIAUhByAIKAIAIgIhASAFIQUgBCEEIAINAAsLIAchBSADIQECQAJAIAYNAEEAIQQgAQ0BIAAoAgwiBEUNACAEKALYASIBRQ0AAkAgASgCACIBQYCAgHhxQYCAgAhGDQAgAUGAgICABnENAQsgBEEANgLYAQtBASEECyAFIQUgBCEEIAZFDQALC9oDAQt/AkAgACgCACIDDQBBAA8LIAJBAWoiBCABQRh0IgVyIQYgBEECdEF4aiEHIAMhCEEAIQMCQAJAAkACQAJAAkADQCADIQkgCiEKIAgiAygCAEH///8HcSIIRQ0CIAohCgJAIAggAmsiC0EBSCIMDQACQAJAIAtBA0gNACADIAY2AgACQCABQQFHDQAgBEEBTQ0HIANBCGpBNyAHEJIFGgsgACADEIQBIAMoAgBB////B3EiCEUNByADKAIEIQ0gAyAIQQJ0aiIIIAtBf2oiCkGAgIAIcjYCACAIIA02AgQgCkEBTQ0IIAhBCGpBNyAKQQJ0QXhqEJIFGiAAIAgQhAEgCCEIDAELIAMgCCAFcjYCAAJAIAFBAUcNACAIQQFNDQkgA0EIakE3IAhBAnRBeGoQkgUaCyAAIAMQhAEgAygCBCEICyAJQQRqIAAgCRsgCDYCACADIQoLIAohCiAMRQ0BIAMoAgQiCSEIIAohCiADIQMgCQ0AC0EADwsgCg8LQdPIAEGTPUHiAUGbJxDzBAALQfDHAEGTPUHGAEHfIhDzBAALQdPIAEGTPUHiAUGbJxDzBAALQfDHAEGTPUHGAEHfIhDzBAALQfDHAEGTPUHGAEHfIhDzBAALHgACQCAAKALQASABIAIQhQEiAQ0AIAAgAhBTCyABCykBAX8CQCAAKALQAUHCACABEIUBIgINACAAIAEQUwsgAkEEakEAIAIbC4wBAQF/AkACQAJAAkAgAUUNACABQQNxDQEgAUF8aiIBKAIAIgJBgICAeHFBgICAkARHDQIgAkH///8HcSICRQ0DIAEgAkGAgIAQcjYCACAAIAEQhAELDwtBms4AQZM9QagDQbwgEPMEAAtBq9QAQZM9QaoDQbwgEPMEAAtB08gAQZM9QeIBQZsnEPMEAAu6AQECfwJAAkACQAJAAkAgAUUNACABQQNxDQEgAUF8aiICKAIAIgNBgICAeHFBgICAkARHDQIgA0H///8HcSIDRQ0DIAIgA0GAgIAIcjYCACADQQFGDQQgAUEEakE3IANBAnRBeGoQkgUaIAAgAhCEAQsPC0GazgBBkz1BqANBvCAQ8wQAC0Gr1ABBkz1BqgNBvCAQ8wQAC0HTyABBkz1B4gFBmycQ8wQAC0HwxwBBkz1BxgBB3yIQ8wQAC2MBAn8CQCABKAIEIgJBgIDA/wdxRQ0AQQAPC0EAIQMCQAJAIAJBCHFFDQAgASgCACgCACIBQYCAgPAAcUUNASABQYCAgIAEcUEediEDCyADDwtB4cEAQZM9Qb8DQfYwEPMEAAt3AQF/AkACQAJAIAEoAgQiAkGAgMD/B3ENACACQQhxRQ0AIAEoAgAiAigCACIBQYCAgIAEcQ0BIAFBgICA8ABxRQ0CIAIgAUGAgICABHI2AgALDwtB9soAQZM9QcgDQcIgEPMEAAtB4cEAQZM9QckDQcIgEPMEAAt4AQF/AkACQAJAIAEoAgQiAkGAgMD/B3ENACACQQhxRQ0AIAEoAgAiAigCACIBQYCAgIAEcUUNASABQYCAgPAAcUUNAiACIAFB/////3txNgIACw8LQfLOAEGTPUHSA0GxIBDzBAALQeHBAEGTPUHTA0GxIBDzBAALKgEBfwJAIAAoAtABQQRBEBCFASICDQAgAEEQEFMgAg8LIAIgATYCBCACCyABAX8CQCAAKALQAUELQRAQhQEiAQ0AIABBEBBTCyABC+YCAQR/IwBBEGsiAiQAAkACQAJAAkACQAJAIAFBgOADSw0AIAFBA3QiA0GB4ANJDQELIAJBCGogAEEPEOoCQQAhAQwBCwJAIAAoAtABQcMAQRAQhQEiBA0AIABBEBBTQQAhAQwBCwJAIAFFDQACQCAAKALQAUHCACADEIUBIgUNACAAIAMQUwsgBCAFQQRqQQAgBRsiAzYCDAJAIAUNACAEIAQoAgBBgICAgARzNgIAQQAhAQwCCyADQQNxDQIgA0F8aiIDKAIAIgVBgICAeHFBgICAkARHDQMgBUH///8HcSIFRQ0EIAAoAtABIQAgAyAFQYCAgBByNgIAIAAgAxCEASAEIAE7AQggBCABOwEKCyAEIAQoAgBBgICAgARzNgIAIAQhAQsgAkEQaiQAIAEPC0GazgBBkz1BqANBvCAQ8wQAC0Gr1ABBkz1BqgNBvCAQ8wQAC0HTyABBkz1B4gFBmycQ8wQAC2YBA38jAEEQayICJAACQAJAIAFBgeADSQ0AIAJBCGogAEESEOoCQQAhAQwBCwJAAkAgACgC0AFBBSABQQxqIgMQhQEiBA0AIAAgAxBTDAELIAQgATsBBAsgBCEBCyACQRBqJAAgAQtnAQN/IwBBEGsiAiQAAkACQCABQYHgA0kNACACQQhqIABBwgAQ6gJBACEBDAELAkACQCAAKALQAUEGIAFBCWoiAxCFASIEDQAgACADEFMMAQsgBCABOwEECyAEIQELIAJBEGokACABC34BA38jAEEQayIDJAACQAJAIAJBgeADSQ0AIANBCGogAEHCABDqAkEAIQAMAQsCQAJAIAAoAtABQQYgAkEJaiIEEIUBIgUNACAAIAQQUwwBCyAFIAI7AQQLIAUhAAsCQCAAIgBFDQAgAEEGaiABIAIQkAUaCyADQRBqJAAgAAsJACAAIAE2AgwLlwEBA39BkIAEECEiACgCBCEBIAAgAEEQajYCBCAAIAE2AhAgAEEUaiICIABBkIAEakF8cUF8aiIBNgIAIAFBgYCA+AQ2AgAgAEEYaiIBIAIoAgAgAWsiAkECdUGAgIAIcjYCAAJAIAJBBEsNAEHwxwBBkz1BxgBB3yIQ8wQACyAAQSBqQTcgAkF4ahCSBRogACABEIQBIAALDQAgAEEANgIEIAAQIgsNACAAKALQASABEIQBC6UHAQh/IwBBEGsiAyQAIAJBf2ohBCABIQECQANAIAEiBUUNAQJAAkAgBSgCACIBQRh2QQ9xIgZBAUYNACABQYCAgIACcQ0AAkAgAkEBSg0AIAUgAUGAgICAeHI2AgAMAQsgBSABQf////8FcUGAgICAAnI2AgBBACEHAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAZBfmoODgsBAAYLAwQAAgAFBQULBQsgBSEHDAoLAkAgBSgCDCIIRQ0AIAhBA3ENBiAIQXxqIgcoAgAiAUGAgICABnENByABQYCAgPgAcUGAgIAQRw0IIAUvAQghCSAHIAFBgICAgAJyNgIAQQAhASAJRQ0AA0ACQCAIIAEiAUEDdGoiBygABEGIgMD/B3FBCEcNACAAIAcoAAAgBBCZAQsgAUEBaiIHIQEgByAJRw0ACwsgBSgCBCEHDAkLIAAgBSgCHCAEEJkBIAUoAhghBwwICwJAIAUoAAxBiIDA/wdxQQhHDQAgACAFKAAIIAQQmQELQQAhByAFKAAUQYiAwP8HcUEIRw0HIAAgBSgAECAEEJkBQQAhBwwHCyAAIAUoAgggBBCZASAFKAIQLwEIIghFDQUgBUEYaiEJQQAhAQNAAkAgCSABIgFBA3RqIgcoAARBiIDA/wdxQQhHDQAgACAHKAAAIAQQmQELIAFBAWoiByEBIAcgCEcNAAtBACEHDAYLIAMgBTYCBCADIAE2AgBB5x0gAxA8QZM9Qa0BQfwiEO4EAAsgBSgCCCEHDAQLQZrOAEGTPUHrAEGWGBDzBAALQaLNAEGTPUHtAEGWGBDzBAALQY/CAEGTPUHuAEGWGBDzBAALQQAhBwsCQCAHIgkNACAFIQFBACEGDAILAkACQAJAAkAgCSgCDCIHRQ0AIAdBA3ENASAHQXxqIggoAgAiAUGAgICABnENAiABQYCAgPgAcUGAgIAQRw0DIAkvAQghCiAIIAFBgICAgAJyNgIAQQAhASAKIAZBC0d0IghFDQADQAJAIAcgASIBQQN0aiIGKAAEQYiAwP8HcUEIRw0AIAAgBigAACAEEJkBCyABQQFqIgYhASAGIAhHDQALCyAFIQFBACEGIAAgCSgCBBCSAkUNBCAJKAIEIQFBASEGDAQLQZrOAEGTPUHrAEGWGBDzBAALQaLNAEGTPUHtAEGWGBDzBAALQY/CAEGTPUHuAEGWGBDzBAALIAUhAUEAIQYLIAEhASAGDQALCyADQRBqJAALVAEBfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAEgA0EIahD4Ag0AIAMgAikDADcDACAAIAFBDyADEOgCDAELIAAgAigCAC8BCBDtAgsgA0EQaiQAC4EBAgJ/AX4jAEEgayIBJAAgASAAKQNQIgM3AwggASADNwMYAkACQCAAIAFBCGoQ+AJFDQAgASgCGCECDAELIAEgASkDGDcDACABQRBqIABBDyABEOgCQQAhAgsCQCACIgJFDQAgACACIABBABCxAiAAQQEQsQIQlAIaCyABQSBqJAALOQIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDACABIAI3AwggACAAIAEQ+AIQtQIgAUEQaiQAC9EBAgV/AX4jAEEwayIBJAAgASAAKQNQIgY3AxAgASAGNwMoAkACQCAAIAFBEGoQ+AJFDQAgASgCKCECDAELIAEgASkDKDcDCCABQSBqIABBDyABQQhqEOgCQQAhAgsCQCACIgNFDQACQCAALQBDQQJJDQBBACEEA0AgAy8BCCEFIAEgACAEQQFqIgJBA3RqQdAAaikDACIGNwMAIAEgBjcDGCAAIAMgBSABEK8CIAIhBCACIAAtAENBf2pIDQALCyAAIAMvAQgQtAILIAFBMGokAAuJAgIFfwF+IwBBwABrIgEkACABIAApA1AiBjcDKCABIAY3AzgCQAJAIAAgAUEoahD4AkUNACABKAI4IQIMAQsgASABKQM4NwMgIAFBMGogAEEPIAFBIGoQ6AJBACECCwJAIAIiAkUNACABIABB2ABqKQMAIgY3AxggASAGNwM4AkAgACABQRhqEPgCDQAgASABKQM4NwMQIAFBMGogAEEPIAFBEGoQ6AIMAQsgASABKQM4NwMIAkAgACABQQhqEPcCIgMvAQgiBEUNACAAIAIgAi8BCCIFIAQQlAINACACKAIMIAVBA3RqIAMoAgwgBEEDdBCQBRoLIAAgAi8BCBC0AgsgAUHAAGokAAucAgIGfwF+IwBBIGsiASQAIAEgACkDUCIHNwMIIAEgBzcDGAJAAkAgACABQQhqEPgCRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARDoAkEAIQILIAIiAy8BCCECQQAhBAJAIAAtAENBf2oiBUUNACAAQQAQsQIhBAsgBCIEQR91IAJxIARqIgRBACAEQQBKGyEEIAIhBgJAIAVBAkkNACACIQYgAEHgAGopAwBQDQAgAEEBELECIQYLAkAgACAGIgZBH3UgAnEgBmoiBiACIAYgAkgbIgIgBCACIAQgAkgbIgRrIgYQkQEiAkUNACACKAIMIAMoAgwgBEEDdGogBkEDdBCQBRoLIAAgAhC2AiABQSBqJAALEwAgACAAIABBABCxAhCSARC2AguKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ8wINACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDoAgwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ9QJFDQAgACADKAIoEO0CDAELIABCADcDAAsgA0EwaiQAC50BAgJ/AX4jAEEwayIBJAAgASAAKQNQIgM3AxAgASADNwMgAkACQCAAIAFBEGoQ8wINACABIAEpAyA3AwggAUEoaiAAQRIgAUEIahDoAkEAIQIMAQsgASABKQMgNwMAIAAgASABQShqEPUCIQILAkAgAiICRQ0AIAFBGGogACACIAEoAigQ2AIgACgCrAEgASkDGDcDIAsgAUEwaiQAC8oBAgV/AX4jAEEwayIBJAAgASAAKQNQIgY3AxggASAGNwMgAkACQCAAIAFBGGoQ9AINACABIAEpAyA3AxAgAUEoaiAAQcoaIAFBEGoQ6QJBACECDAELIAEgASkDIDcDCCAAIAFBCGogAUEoahD1AiECCwJAIAIiA0UNACAAQQAQsQIhAiAAQQEQsQIhBCAAQQIQsQIhACABKAIoIgUgAk0NACABIAUgAmsiBTYCKCADIAJqIAAgBSAEIAUgBEkbEJIFGgsgAUEwaiQAC6YDAgd/AX4jAEHgAGsiASQAIAEgACkDUCIINwM4IAEgCDcDUAJAAkAgACABQThqEPQCDQAgASABKQNQNwMwIAFB2ABqIABByhogAUEwahDpAkEAIQIMAQsgASABKQNQNwMoIAAgAUEoaiABQcwAahD1AiECCwJAIAIiA0UNACAAQQAQsQIhBCABIABB4ABqKQMAIgg3AyAgASAINwNAAkACQCAAIAFBIGoQ0gJFDQAgASABKQNANwMAIAAgASABQdgAahDUAiECDAELIAEgASkDQCIINwNQIAEgCDcDGAJAAkAgACABQRhqEPMCDQAgASABKQNQNwMQIAFB2ABqIABBEiABQRBqEOgCQQAhAgwBCyABIAEpA1A3AwggACABQQhqIAFB2ABqEPUCIQILIAIhAgsgAiIFRQ0AIABBAhCxAiECIABBAxCxAiEAIAEoAlgiBiACTQ0AIAEgBiACayIGNgJYIAEoAkwiByAETQ0AIAEgByAEayIHNgJMIAMgBGogBSACaiAHIAYgACAGIABJGyIAIAcgAEkbEJAFGgsgAUHgAGokAAsfAQF/AkAgAEEAELECIgFBAEgNACAAKAKsASABEHYLCyMBAX8gAEHf1AMgAEEAELECIgEgAUGgq3xqQaGrfEkbEIEBCwkAIABBABCBAQvLAQIHfwF+IwBB4ABrIgEkAAJAIAAtAENBAkkNACABIABB2ABqKQMAIgg3A1ggASAINwMIIAAgAUEIaiABQdQAahDUAiICRQ0AIAAgACACIAEoAlQgAUEQakHAACAAQeAAaiIDIAAtAENBfmoiBEEAENECIgVBf2oiBhCTASIHRQ0AAkACQCAFQcEASQ0AIAAgAiABKAJUIAdBBmogBSADIARBABDRAhoMAQsgB0EGaiABQRBqIAYQkAUaCyAAIAcQtgILIAFB4ABqJAALbwICfwF+IwBBIGsiASQAIABBABCxAiECIAEgAEHgAGopAwAiAzcDGCABIAM3AwggAUEQaiAAIAFBCGoQ2QIgASABKQMQIgM3AxggASADNwMAIABBPiACIAJB/35qQYB/SRvAIAEQ+QEgAUEgaiQACw4AIAAgAEEAELICELMCCw8AIAAgAEEAELICnRCzAguAAgICfwF+IwBB8ABrIgEkACABIABB2ABqKQMANwNoIAEgAEHgAGopAwAiAzcDUCABIAM3A2ACQAJAIAFB0ABqEPoCRQ0AIAEgASkDaDcDECABIAAgAUEQahDHAjYCAEG7FiABEDwMAQsgASABKQNgNwNIIAFB2ABqIAAgAUHIAGoQ2QIgASABKQNYIgM3A2AgASADNwNAIAAgAUHAAGoQjQEgASABKQNgNwM4IAAgAUE4akEAENQCIQIgASABKQNoNwMwIAEgACABQTBqEMcCNgIkIAEgAjYCIEHtFiABQSBqEDwgASABKQNgNwMYIAAgAUEYahCOAQsgAUHwAGokAAuYAQICfwF+IwBBMGsiASQAIAEgAEHYAGopAwAiAzcDKCABIAM3AxAgAUEgaiAAIAFBEGoQ2QIgASABKQMgIgM3AyggASADNwMIAkAgACABQQhqQQAQ1AIiAkUNACACIAFBIGoQpwQiAkUNACABQRhqIABBCCAAIAIgASgCIBCUARDvAiAAKAKsASABKQMYNwMgCyABQTBqJAALewICfwF+IwBBEGsiASQAAkAgABC3AiICRQ0AAkAgAigCBA0AIAIgAEEcEI4CNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABDVAgsgASABKQMINwMAIAAgAkH2ACABENsCIAAgAhC2AgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQtwIiAkUNAAJAIAIoAgQNACACIABBIBCOAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQ1QILIAEgASkDCDcDACAAIAJB9gAgARDbAiAAIAIQtgILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAELcCIgJFDQACQCACKAIEDQAgAiAAQR4QjgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAENUCCyABIAEpAwg3AwAgACACQfYAIAEQ2wIgACACELYCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC3AiICRQ0AAkAgAigCBA0AIAIgAEEiEI4CNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARDVAgsgASABKQMINwMAIAAgAkH2ACABENsCIAAgAhC2AgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEJ8CAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABCfAgsgA0EgaiQACzUCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEOECIAAQiAQgAUEQaiQAC1wBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAUYNAQsgAyACKQMANwMIIAAgAUGLASADQQhqEOgCDAELIAAgAigCABDtAgsgA0EQaiQAC8UBAQJ/IwBBIGsiASQAIAEgACkDUDcDGAJAAkACQCABKAIcIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxg3AwggAUEQaiAAQYsBIAFBCGoQ6AJBACECDAELAkAgACABKAIYEHwiAg0AIAFBEGogAEGrMEEAEOYCCyACIQILAkAgAiICRQ0AAkAgAi0AEEEPcUEERg0AIAFBGGogAEH1MUEAEOYCDAELIAIgAEHYAGopAwA3AyAgAkEBEHULIAFBIGokAAuUAQECfyMAQSBrIgEkACABIAApA1A3AxgCQAJAAkAgASgCHCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMYNwMIIAFBEGogAEGLASABQQhqEOgCQQAhAAwBCwJAIAAgASgCGBB8IgINACABQRBqIABBqzBBABDmAgsgAiEACwJAIAAiAEUNACAAEH4LIAFBIGokAAsyAQF/AkAgAEEAELECIgFBAEgNACAAKAKsASIAIAEQdiAAIAAtABBB8AFxQQRyOgAQCwsZACAAKAKsASIAIAA1AhxCgICAgBCENwMgC1kBAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEGrJEEAEOYCDAELIAAgAkF/akEBEH0iAkUNACAAKAKsASACNQIcQoCAgIAQhDcDIAsgAUEQaiQAC+MCAgN/AX4jAEHwAGsiAyQAIAMgAikDADcDQAJAAkACQCABIANBwABqIANB6ABqIANB5ABqEJ0CIgRBz4YDSw0AIAEoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENAQsgAyACKQMANwMIIAAgAUG5HyADQQhqEOkCDAELIAAgASABKAKgASAEQf//A3EQmAIgACkDAEIAUg0AIANB2ABqIAFBCCABIAFBAhCOAhCPARDvAiAAIAMpA1giBjcDACAGUA0AIAMgACkDADcDOCABIANBOGoQjQEgA0HQAGpB+wAQ1QIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqEK0CIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahCWAiADIAApAwA3AxAgASADQRBqEI4BCyADQfAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDCAJAAkACQCABIANBCGogA0EYaiADQRRqEJ0CIgRBf0oNACADIAIpAwA3AwAgACABQRwgAxDoAgwBCwJAIARB0IYDSA0AIARBsPl8aiIBQQAvAbDIAU4NAiAAQZDjACABQQN0ai8BABDVAgwBCyAAIAEoAKQBIgEgASgCIGogBEEEdGovAQw2AgAgAEEENgIECyADQSBqJAAPC0GdE0GbOUExQf0qEPMEAAvjAQICfwF+IwBB0ABrIgEkACABIABB2ABqKQMANwNIIAEgAEHgAGopAwAiAzcDKCABIAM3A0ACQCABQShqEPoCDQAgAUE4aiAAQZoZEOcCCyABIAEpA0g3AyAgAUE4aiAAIAFBIGoQ2QIgASABKQM4IgM3A0ggASADNwMYIAAgAUEYahCNASABIAEpA0g3AxACQCAAIAFBEGogAUE4ahDUAiICRQ0AIAFBMGogACACIAEoAjhBARCFAiAAKAKsASABKQMwNwMgCyABIAEpA0g3AwggACABQQhqEI4BIAFB0ABqJAALhQEBAn8jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMANwMgIABBAhCxAiECIAEgASkDIDcDCAJAIAFBCGoQ+gINACABQRhqIABB9BoQ5wILIAEgASkDKDcDACABQRBqIAAgASACQQEQiwIgACgCrAEgASkDEDcDICABQTBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPACmxCzAgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDwApwQswILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ8AIQuwUQswILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ7QILIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEPACIgREAAAAAAAAAABjRQ0AIAAgBJoQswIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQ5wS4RAAAAAAAAPA9ohCzAgtkAQV/AkACQCAAQQAQsQIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBDnBCACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFELQCCxEAIAAgAEEAELICEKYFELMCCxgAIAAgAEEAELICIABBARCyAhCyBRCzAgsuAQN/IABBABCxAiEBQQAhAgJAIABBARCxAiIDRQ0AIAEgA20hAgsgACACELQCCy4BA38gAEEAELECIQFBACECAkAgAEEBELECIgNFDQAgASADbyECCyAAIAIQtAILFgAgACAAQQAQsQIgAEEBELECbBC0AgsJACAAQQEQygEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ8QIhAyACIAIpAyA3AxAgACACQRBqEPECIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahDwAiEGIAIgAikDIDcDACAAIAIQ8AIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQPwajcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDKAQuTAQIDfwF+IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQ+gINACABIAEpAyg3AxAgACABQRBqEKECIQIgASABKQMgNwMIIAAgAUEIahClAiIDRQ0AIAJFDQAgACACIAMQjwILIAAoAqwBIAEpAyg3AyAgAUEwaiQACwkAIABBARDOAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQpQIiA0UNACAAQQAQkQEiBEUNACACQSBqIABBCCAEEO8CIAIgAikDIDcDECAAIAJBEGoQjQEgACADIAQgARCTAiACIAIpAyA3AwggACACQQhqEI4BIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQzgEL4wECA38BfiMAQcAAayIBJAAgASAAQdgAaikDACIENwM4IAEgAEHgAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ9wIiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDoAgwBCyABIAEpAzA3AxgCQCAAIAFBGGoQpQIiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqEOgCDAELIAIgAzYCBCAAKAKsASABKQM4NwMgCyABQcAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDoAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABIAIvARIQjQNFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuwAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ6AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAMgAkEIakEIEPoENgIAIAAgAUHCFCADENcCCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQ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IAMiA0UNACAAKAKsASECIAAgASgCJCADLwECQfQDQQAQ8wEgAkERIAMQuAILIAFBwABqJAALPQEBfyMAQRBrIgIkACACQQhqIAAgASAAQbQCaiAAQbACai0AABDjASAAKAKsASACKQMINwMgIAJBEGokAAu/BAEKfyMAQTBrIgIkACAAQdgAaiEDAkACQCAALQBDQX9qIgRBAUYNACADIQMgBCEEDAELIAIgAykDADcDIAJAIAAgAkEgahD4Ag0AIAMhA0EBIQQMAQsgAiADKQMANwMYIAAgAkEYahD3AiIEKAIMIQMgBC8BCCEECyAEIQUgAyEGIABBtAJqIQcCQAJAIAEtAARBAXFFDQAgByEDIAVFDQEgAEGgBGohCCAHIQRBACEJQQAhCiAAKACkASIDIAMoAmBqIAEvAQZBAnRqIQEDQCABIQMgCiEKIAkhCQJAAkAgCCAEIgRrIgFBAEgNACADLQACIQsgAiAGIAlBA3RqKQMANwMQIAAgCyAEIAEgAkEQahBLIgFFDQAgCiELAkAgCg0AIAMtAANBHnRBH3UgA3EhCwsgCyEKIAQgAWohBCADQQRqIQECQAJAAkAgAy8BBEUNACABIQMMAQsgCiEDIAoNACABIQFBACEKQQEhCwwBCyADIQEgCiEKQQAhCwsgBCEDDAELIAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABB2jMgAhDmAiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQS2ohAwsgAEGwAmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCZAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGsGyABQRBqEOkCQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGfGyABQQhqEOkCQQAhAwsCQCADIgNFDQAgACADEOYBIAAgASgCJCADLwECQf8fcUGAwAByEPUBCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEJkCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQawbIANBCGoQ6QJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCZAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGsGyADQQhqEOkCQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQmQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBrBsgA0EIahDpAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDtAgsgA0EwaiQAC80DAgN/AX4jAEHgAGsiASQAIAEgACkDUCIENwNIIAEgBDcDMCABIAQ3A1AgACABQTBqIAFBxABqEJkCIgIhAwJAIAINACABIAEpA1A3AyggAUHYAGogAEGsGyABQShqEOkCQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCREH//wFHDQAgASABKQNINwMgIAFB2ABqIABBnxsgAUEgahDpAkEAIQMLAkAgAyIDRQ0AIAAgAxDmAQJAIAAgACABKAJEEJoCQQAgAy8BAhDhARDgAUUNACAAQQM6AEMgAEHgAGogACgCrAE1AhxCgICAgBCENwMAIABB0ABqIgJBCGpCADcDACACQgA3AwAgAUECNgJcIAEgASgCRDYCWCABIAEpA1g3AxggAUE4aiAAIAFBGGpBkgEQnwIgASABKQNYNwMQIAEgASkDODcDCCABQdAAaiAAIAFBEGogAUEIahCbAiAAIAEpA1A3A1AgAEGxAmpBAToAACAAQbICaiADLwECOwEAIAFB0ABqIAAgASgCRBD4ASAAQdgAaiABKQNQNwMAIAAoAqwBQQJBABB0GgwBCyAAIAEoAkQgAy8BAhD1AQsg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ACACQQhqIAEQ7QIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7gIgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEO8CIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahD3AiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB4i9BABDlAkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahD5AiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSRJDQAgAEIANwMADwsCQCABIAIQjgIiA0HQ3gBrQQxtQSNLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEO8CC/8BAQJ/IAIhAwNAAkAgAyICQdDeAGtBDG0iA0EjSw0AAkAgASADEI4CIgJB0N4Aa0EMbUEjSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhDvAg8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQYnSAEHEN0G8CEGeKBDzBAALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQdDeAGtBDG1BJEkNAQsLIAAgAUEIIAIQ7wILJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFB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AAtB3wMgAUH//wNxdkEBcUUNASABQQJ0QYjrAGooAgAhBAsgAkEQaiQAIAQPC0GvO0GjAkH6JRDuBAALEQAgACgCBEUgACgCAEEESXELJAEBf0EAIQECQCAAKAIEDQAgACgCACIARSAAQQNGciEBCyABC2sBAn8jAEEQayIDJAACQAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEP0CIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqENICDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqENICRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahDUAiECIAMgAykDMDcDCCAAIANBCGogA0E4ahDUAiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEKoFRSEBCyABIQELIAEhBAsgA0HAAGokACAEC1kAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0GAwABBrztB9QJBljUQ8wQAC0GowABBrztB9gJBljUQ8wQAC4wBAQF/QQAhAgJAIAFB//8DSw0AQZQBIQICQAJAAkACQAJAAkAgAUEOdg4EAwUAAQILIAAoAgBBxABqIQJBASEADAMLIAAoAgBBzABqIQJBAyEADAILQfY2QTlBxiIQ7gQACyAAKAIAQdQAaiECQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtuAQJ/IwBBIGsiASQAIAAoAAghABDfBCECIAFBGGogAEH//wNxNgIAIAFBEGogAEEYdjYCACABQRRqIABBEHZB/wFxNgIAIAFBADYCDCABQoaAgIDQADcCBCABIAI2AgBBuzMgARA8IAFBIGokAAuIIQIMfwF+IwBBsARrIgIkAAJAAkACQCAAQQNxDQACQCABQfAATQ0AIAIgADYCqAQCQAJAIAAoAgBBxMrZmwVHDQAgACgC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AQQgByAFai0AACEHDAELIAFBCGogAEHkABCCAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQcDIASAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCCAQwBCyABIAIgAEHAyAEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQggEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQ4wILIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQgQELIAFBEGokAAskAQF/QQAhAQJAIABBkwFLDQAgAEECdEGw6wBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARD/Ag0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBsOsAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRC/BTYCACAFIQEMAgtBuDlBrgJBlscAEO4EAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEIsDIgEhAgJAIAENACADQQhqIABB6AAQggFBhtYAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIIBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEP8CDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQggELDgAg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QSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ7AMgA0EQaiACEOwDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCsAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ7AMgAkEgaiABEOwDIAJBGGogARDsAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEK0CIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOwDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBD/Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCqAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOwDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBD/Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCqAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOwDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBD/Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCqAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD/Ag0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBABCOAiEEIAMgAykDEDcDACAA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AkGAgICAeEcNACAAQQApA9hqNwMADAELIABBACACaxDtAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEOwDIAMgAykDCDcDACAAIAIgAxDyAkEBcxDuAiADQRBqJAALDAAgACACEO4DEO0CC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhDsAyACQRhqIgQgAykDODcDACADQThqIAIQ7AMgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEO0CDAELIAMgBSkDADcDMAJAAkAgAiADQTBqENICDQAgAyAEKQMANwMoIAIgA0EoahDSAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqENwCDAELIAMgBSkDADcDICACIAIgA0EgahDwAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQ8AIiCDkDACAAIAggAisDIKAQ7AILIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQ7AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOwDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhDtAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ8AI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPACIgg5AwAgACACKwMgIAihEOwCCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhDsAyACQRhqIgQgAykDGDcDACADQRhqIAIQ7AMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEO0CDAELIAMgBSkDADcDECACIAIgA0EQahDwAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ8AIiCDkDACAAIAggAisDIKIQ7AILIANBIGokAAvoAQIGfwF8IwBBIGsiAyQAIANBGGogAhDsAyACQRhqIgQgAykDGDcDACADQRhqIAIQ7AMgAiADKQMYNwMQIAJBEGohBQJAAkAg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CyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBqDdBygFB3ccAEO4EAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACELwEtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvjAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKALg5wEiASAARw0AQeDnASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQkgUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKALg5wE2AgBBACAANgLg5wFBACECCyACDwtBrjxBK0GPIRDuBAAL4wECA38BfgJAIAEtAAxBAk8NAEF+DwtBfiECAkACQCABKQIEIgVQDQAgAS8BECEDECMNAQJAIAAtAAZFDQACQAJAAkBBACgC4OcBIgEgAEcNAEHg5wEhAQwBCyABIQIDQCACIgFFDQIgASgCACIEIQIgASEBIAQgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEJIFGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAU3AgAgACADQQd0OwEEIABBACgC4OcBNgIAQQAgADYC4OcBQQAh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QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQvwVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQvwVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBD2BCABQQhqIQIMBwsgCygCACIBQYLSACABGyIDEL8FIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQkAUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBC/BSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQkAUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEKgFIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ4wWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ4wWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDjBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDjBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQkgUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QYD0AGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEJIFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQvwVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxD1BCEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALSQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgACABEPUEIgEQISIDIAEgACACKAIIEPUEGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkHQJmotAAA6AAAgBUEBaiAGLQAAQQ9xQdAmai0AADoAACAEQQFqIgUhBCAFIAFHDQALCyADIAJqQQA6AAAgAwvpAQEHfyMAQRBrIgEkACABQQA2AgwgAUIANwIEIAEgADYCAAJAAkAgAA0AQQEhAgwBCyAAIQJBACEDQQAhBANAIAIhBSABIARB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fyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEJwFDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEJAFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQnQUhAAwBCyADEJMFIQUgACAEIAMQnQUhACAFRQ0AIAMQlAULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEKQFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEKcFIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA7B1IgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDgHaiIAhBACsD+HWiIABBACsD8HWiQQArA+h1oKCgoiAIQQArA+B1oiAAQQArA9h1okEAKwPQdaCgoKIgCEEAKwPIdaIgAEEAKwPAdaJBACsDuHWgoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQowUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQpQUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsD+HSiIANCLYin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CyACCxAAIABBIEYgAEF3akEFSXILrgEAAkACQCABQYAISA0AIABEAAAAAAAA4H+iIQACQCABQf8PTw0AIAFBgXhqIQEMAgsgAEQAAAAAAADgf6IhACABQf0XIAFB/RdIG0GCcGohAQwBCyABQYF4Sg0AIABEAAAAAAAAYAOiIQACQCABQbhwTQ0AIAFByQdqIQEMAQsgAEQAAAAAAABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDhBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEOEFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ4QUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EOEFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDhBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ1wVFDQAgAyAEEMcFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOEFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ2QUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKENcFQQBKDQACQCABIAkgAyAKENcFRQ0AIAEhBAwCCyAFQfAA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DAILIAdBEEEUIAcoAhAgA0YbaiAGNgIAIAZFDQELIAYgBzYCGAJAIAMoAhAiAkUNACAGIAI2AhAgAiAGNgIYCyADKAIUIgJFDQAgBkEUaiACNgIAIAIgBjYCGAsgASAAQQFyNgIEIAEgAGogADYCACABQQAoAvTqAUcNAUEAIAA2AujqAQ8LIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIACwJAIABB/wFLDQAgAEF4cUGI6wFqIQICQAJAQQAoAuDqASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AuDqASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBkO0BaiEEAkACQAJAAkBBACgC5OoBIgZBASACdCIDcQ0AQQAgBiADcjYC5OoBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKA6wFBf2oiAUF/IAEbNgKA6wELCwcAPwBBEHQLVAECf0EAKALMzAEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ0wVNDQAgABAVRQ0BC0EAIAA2AszMASABDwsQjQVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqENYFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDWBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ1gUgBUEwaiAKIAEgBxDgBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHENYFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqENYFIAUgAiAEQQEgBmsQ4AUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEN4FDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEN8FGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ1gVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDWBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDiBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDiBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDiBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDiBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDiBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDiBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDiBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDiBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDiBSAFQZABaiADQg+GQgAgBEIAEOIFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ4gUgBUGAAWpCASACfUIAIARCABDiBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEOIFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEOIFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ4AUgBUEwaiAWIBMgBkHwAGoQ1gUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q4gUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDiBSAFIAMgDkIFQgAQ4gUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqENYFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqENYFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ1gUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ1gUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ1gVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ1gUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ1gUgBUEgaiACIAQgBhDWBSAFQRBqIBIgASAHEOAFIAUgAiAEIAcQ4AUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FENUFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDWBSACIAAgBEGB+AAgA2sQ4AUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHQ7gUkA0HQ7gFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEPAFIQUgBUIgiKcQ5gUgBacLEwAgACABpyABQiCIpyACIAMQFgsL/syBgAADAEGACAuYwAFpbmZpbml0eQAtSW5maW5pdHkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAERldlMtU0hBMjU2OiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AcHJvZ1ZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAcHJvZ05hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkACogIHBjPSVkIEAgJXNfRiVkACEgIHBjPSVkIEAgJXNfRiVkACEgUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAqICBwYz0lZCBAID8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpACVzIChXU1NLKQAhdGFyZ2V0X2luX2lycSgpAGZzdG9yOiBpbnZhbGlkIGxhcmdlIGtleTogJyVzJwBmc3RvcjogaW52YWxpZCBrZXk6ICclcycAV1NuOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXU246IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAEAMC4wLjAAAAAAAAAAAAAAAAAAAAAAAQAA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PDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAAvPGAgAAEbmFtZQHMcPMFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwxzdG9wX3Byb2dyYW1oD2RldnNtZ3JfcmVzdGFydGkUZGV2c21ncl9kZXBsb3lfc3RhcnRqFGRldnNtZ3JfZGVwbG95X3dyaXRlaxBkZXZzbWdyX2dldF9oYXNobBVkZXZzbWdyX2hhbmRsZV9wYWNrZXRtDmRlcGxveV9oYW5kbGVybhNkZXBsb3lfbWV0YV9oYW5kbGVybw9kZXZzbWdyX2dldF9jdHhwDmRldnNtZ3JfZGVwbG95cQxkZXZzbWdyX2luaXRyEWRldnNtZ3JfY2xpZW50X2V2cxBkZXZzX2ZpYmVyX3lpZWxkdBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb251GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXYQZGV2c19maWJlcl9zbGVlcHcbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3kRZGV2c19pbWdfZnVuX25hbWV6EmRldnNfaW1nX3JvbGVfbmFtZXsSZGV2c19maWJlcl9ieV9maWR4fBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBCmRldnNfcGFuaWOCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJUBD2RldnNfZ2Nfc2V0X2N0eJYBDmRldnNfZ2NfY3JlYXRllwEPZGV2c19nY19kZXN0cm95mAERZGV2c19nY19vYmpfY2hlY2uZAQtzY2FuX2djX29iapoBEXByb3BfQXJyYXlfbGVuZ3RomwESbWV0aDJfQXJyYXlfaW5zZXJ0nAESZnVuMV9BcnJheV9pc0FycmF5nQEQbWV0aFhfQXJyYXlfcHVzaJ4BFW1ldGgxX0FycmF5X3B1c2hSYW5nZZ8BEW1ldGhYX0FycmF5X3NsaWNloAERZnVuMV9CdWZmZXJfYWxsb2OhARJwcm9wX0J1ZmZlcl9sZW5ndGiiARVtZXRoMF9CdWZmZXJfdG9TdHJpbmejARNtZXRoM19CdWZmZXJfZmlsbEF0pAETbWV0aDRfQnVmZmVyX2JsaXRBdKUBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwpgEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljpwEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qAEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0qQEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSqARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0qwEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSsARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcq0BHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nrgEUbWV0aDFfRXJyb3JfX19jdG9yX1+vARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fsAEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fsQEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+yAQ9wcm9wX0Vycm9yX25hbWWzARFtZXRoMF9FcnJvcl9wcmludLQBD3Byb3BfRHNGaWJlcl9pZLUBFG1ldGgxX0RzRmliZXJfcmVzdW1ltgEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGW3ARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kuAERZnVuMF9Ec0ZpYmVyX3NlbGa5ARRtZXRoWF9GdW5jdGlvbl9zdGFydLoBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBluwEScHJvcF9GdW5jdGlvbl9uYW1lvAEPZnVuMl9KU09OX3BhcnNlvQETZnVuM19KU09OX3N0cmluZ2lmeb4BDmZ1bjFfTWF0aF9jZWlsvwEPZnVuMV9NYXRoX2Zsb29ywAEPZnVuMV9NYXRoX3JvdW5kwQENZnVuMV9NYXRoX2Fic8IBEGZ1bjBfTWF0aF9yYW5kb23DARNmdW4xX01hdGhfcmFuZG9tSW50xAENZnVuMV9NYXRoX2xvZ8UBDWZ1bjJfTWF0aF9wb3fGAQ5mdW4yX01hdGhfaWRpdscBDmZ1bjJfTWF0aF9pbW9kyAEOZnVuMl9NYXRoX2ltdWzJAQ1mdW4yX01hdGhfbWluygELZnVuMl9taW5tYXjLAQ1mdW4yX01hdGhfbWF4zAESZnVuMl9PYmplY3RfYXNzaWduzQEQZnVuMV9PYmplY3Rfa2V5c84BE2Z1bjFfa2V5c19vcl92YWx1ZXPPARJmdW4xX09iamVjdF92YWx1ZXPQARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtEBEHByb3BfUGFja2V0X3JvbGXSARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVy0wETcHJvcF9QYWNrZXRfc2hvcnRJZNQBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleNUBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5k1gERcHJvcF9QYWNrZXRfZmxhZ3PXARVwcm9wX1BhY2tldF9pc0NvbW1hbmTYARRwcm9wX1BhY2tldF9pc1JlcG9ydNkBE3Byb3BfUGFja2V0X3BheWxvYWTaARNwcm9wX1BhY2tldF9pc0V2ZW502wEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl3AEUcHJvcF9QYWNrZXRfaXNSZWdTZXTdARRwcm9wX1BhY2tldF9pc1JlZ0dldN4BE3Byb3BfUGFja2V0X3JlZ0NvZGXfARRwcm9wX1BhY2tldF9pc0FjdGlvbuABFWRldnNfcGt0X3NwZWNfYnlfY29kZeEBEmRldnNfZ2V0X3NwZWNfY29kZeIBE21ldGgwX1BhY2tldF9kZWNvZGXjARJkZXZzX3BhY2tldF9kZWNvZGXkARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTlARREc1JlZ2lzdGVyX3JlYWRfY29udOYBEmRldnNfcGFja2V0X2VuY29kZecBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXoARZwcm9wX0RzUGFja2V0SW5mb19yb2xl6QEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZeoBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXrARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/sARNwcm9wX0RzUm9sZV9pc0JvdW5k7QEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k7gERbWV0aDBfRHNSb2xlX3dhaXTvARJwcm9wX1N0cmluZ19sZW5ndGjwARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdPEBE21ldGgxX1N0cmluZ19jaGFyQXTyARJtZXRoMl9TdHJpbmdfc2xpY2XzARRkZXZzX2pkX2dldF9yZWdpc3RlcvQBFmRldnNfamRfY2xlYXJfcGt0X2tpbmT1ARBkZXZzX2pkX3NlbmRfY21k9gERZGV2c19qZF93YWtlX3JvbGX3ARRkZXZzX2pkX3Jlc2V0X3BhY2tldPgBE2RldnNfamRfcGt0X2NhcHR1cmX5ARNkZXZzX2pkX3NlbmRfbG9nbXNn+gESZGV2c19qZF9zaG91bGRfcnVu+wEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX8ARNkZXZzX2pkX3Byb2Nlc3NfcGt0/QEUZGV2c19qZF9yb2xlX2NoYW5nZWT+ARJkZXZzX2pkX2luaXRfcm9sZXP/ARJkZXZzX2pkX2ZyZWVfcm9sZXOAAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3OBAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc4ICFWRldnNfZ2V0X2dsb2JhbF9mbGFnc4MCEGRldnNfanNvbl9lc2NhcGWEAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWFAg9kZXZzX2pzb25fcGFyc2WGAgpqc29uX3ZhbHVlhwIMcGFyc2Vfc3RyaW5niAINc3RyaW5naWZ5X29iaokCCmFkZF9pbmRlbnSKAg9zdHJpbmdpZnlfZmllbGSLAhNkZXZzX2pzb25fc3RyaW5naWZ5jAIRcGFyc2Vfc3RyaW5nX2NvcmWNAhFkZXZzX21hcGxpa2VfaXRlco4CF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0jwISZGV2c19tYXBfY29weV9pbnRvkAIMZGV2c19tYXBfc2V0kQIGbG9va3VwkgITZGV2c19tYXBsaWtlX2lzX21hcJMCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc5QCEWRldnNfYXJyYXlfaW5zZXJ0lQIIa3ZfYWRkLjGWAhJkZXZzX3Nob3J0X21hcF9zZXSXAg9kZXZzX21hcF9kZWxldGWYAhJkZXZzX3Nob3J0X21hcF9nZXSZAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJoCDmRldnNfcm9sZV9zcGVjmwISZGV2c19mdW5jdGlvbl9iaW5knAIRZGV2c19tYWtlX2Nsb3N1cmWdAg5kZXZzX2dldF9mbmlkeJ4CE2RldnNfZ2V0X2ZuaWR4X2NvcmWfAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSgAhNkZXZzX2dldF9yb2xlX3Byb3RvoQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ogIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkowIVZGV2c19nZXRfc3RhdGljX3Byb3RvpAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvpQIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2mAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvpwIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkqAIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kqQIQZGV2c19pbnN0YW5jZV9vZqoCD2RldnNfb2JqZWN0X2dldKsCDGRldnNfc2VxX2dldKwCDGRldnNfYW55X2dldK0CDGRldnNfYW55X3NldK4CDGRldnNfc2VxX3NldK8CDmRldnNfYXJyYXlfc2V0sAITZGV2c19hcnJheV9waW5fcHVzaLECDGRldnNfYXJnX2ludLICD2RldnNfYXJnX2RvdWJsZbMCD2RldnNfcmV0X2RvdWJsZbQCDGRldnNfcmV0X2ludLUCDWRldnNfcmV0X2Jvb2y2Ag9kZXZzX3JldF9nY19wdHK3AhFkZXZzX2FyZ19zZWxmX21hcLgCEWRldnNfc2V0dXBfcmVzdW1luQIPZGV2c19jYW5fYXR0YWNougIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZbsCFWRldnNfbWFwbGlrZV90b192YWx1ZbwCEmRldnNfcmVnY2FjaGVfZnJlZb0CFmRldnNfcmVnY2FjaGVfZnJlZV9hbGy+AhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZL8CE2RldnNfcmVnY2FjaGVfYWxsb2PAAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cMECEWRldnNfcmVnY2FjaGVfYWdlwgIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXDAhJkZXZzX3JlZ2NhY2hlX25leHTEAg9qZF9zZXR0aW5nc19nZXTFAg9qZF9zZXR0aW5nc19zZXTGAg5kZXZzX2xvZ192YWx1ZccCD2RldnNfc2hvd192YWx1ZcgCEGRldnNfc2hvd192YWx1ZTDJAg1jb25zdW1lX2NodW5rygINc2hhXzI1Nl9jbG9zZcsCD2pkX3NoYTI1Nl9zZXR1cMwCEGpkX3NoYTI1Nl91cGRhdGXNAhBqZF9zaGEyNTZfZmluaXNozgIUamRfc2hhMjU2X2htYWNfc2V0dXDPAhVqZF9zaGEyNTZfaG1hY19maW5pc2jQAg5qZF9zaGEyNTZfaGtkZtECDmRldnNfc3RyZm9ybWF00gIOZGV2c19pc19zdHJpbmfTAg5kZXZzX2lzX251bWJlctQCFGRldnNfc3RyaW5nX2dldF91dGY41QITZGV2c19idWlsdGluX3N0cmluZ9YCFGRldnNfc3RyaW5nX3ZzcHJpbnRm1wITZGV2c19zdHJpbmdfc3ByaW50ZtgCFWRldnNfc3RyaW5nX2Zyb21fdXRmONkCFGRldnNfdmFsdWVfdG9fc3RyaW5n2gIQYnVmZmVyX3RvX3N0cmluZ9sCGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTcAhJkZXZzX3N0cmluZ19jb25jYXTdAhFkZXZzX3N0cmluZ19zbGljZd4CEmRldnNfcHVzaF90cnlmcmFtZd8CEWRldnNfcG9wX3RyeWZyYW1l4AIPZGV2c19kdW1wX3N0YWNr4QITZGV2c19kdW1wX2V4Y2VwdGlvbuICCmRldnNfdGhyb3fjAhJkZXZzX3Byb2Nlc3NfdGhyb3fkAhBkZXZzX2FsbG9jX2Vycm9y5QIVZGV2c190aHJvd190eXBlX2Vycm9y5gIWZGV2c190aHJvd19yYW5nZV9lcnJvcucCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcugCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y6QIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh06gIYZGV2c190aHJvd190b29fYmlnX2Vycm9y6wIXZGV2c190aHJvd19zeW50YXhfZXJyb3LsAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl7QITZGV2c192YWx1ZV9mcm9tX2ludO4CFGRldnNfdmFsdWVfZnJvbV9ib29s7wIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLwAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZfECEWRldnNfdmFsdWVfdG9faW508gISZGV2c192YWx1ZV90b19ib29s8wIOZGV2c19pc19idWZmZXL0AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfUCEGRldnNfYnVmZmVyX2RhdGH2AhNkZXZzX2J1ZmZlcmlzaF9kYXRh9wIUZGV2c192YWx1ZV90b19nY19vYmr4Ag1kZXZzX2lzX2FycmF5+QIRZGV2c192YWx1ZV90eXBlb2b6Ag9kZXZzX2lzX251bGxpc2j7AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk/AIUZGV2c192YWx1ZV9hcHByb3hfZXH9AhJkZXZzX3ZhbHVlX2llZWVfZXH+Ah5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP/AhJkZXZzX2ltZ19zdHJpZHhfb2uAAxJkZXZzX2R1bXBfdmVyc2lvbnOBAwtkZXZzX3ZlcmlmeYIDEWRldnNfZmV0Y2hfb3Bjb2RlgwMOZGV2c192bV9yZXN1bWWEAxFkZXZzX3ZtX3NldF9kZWJ1Z4UDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOGAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSHAw9kZXZzX3ZtX3N1c3BlbmSIAxZkZXZzX3ZtX3NldF9icmVha3BvaW50iQMUZGV2c192bV9leGVjX29wY29kZXOKAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIsDEWRldnNfaW1nX2dldF91dGY4jAMUZGV2c19nZXRfc3RhdGljX3V0ZjiNAw9kZXZzX3ZtX3JvbGVfb2uOAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaI8DDGV4cHJfaW52YWxpZJADFGV4cHJ4X2J1aWx0aW5fb2JqZWN0kQMLc3RtdDFfY2FsbDCSAwtzdG10Ml9jYWxsMZMDC3N0bXQzX2NhbGwylAMLc3RtdDRfY2FsbDOVAwtzdG10NV9jYWxsNJYDC3N0bXQ2X2NhbGw1lwMLc3RtdDdfY2FsbDaYAwtzdG10OF9jYWxsN5kDC3N0bXQ5X2NhbGw4mgMSc3RtdDJfaW5kZXhfZGVsZXRlmwMMc3RtdDFfcmV0dXJunAMJc3RtdHhfam1wnQMMc3RtdHgxX2ptcF96ngMKZXhwcjJfYmluZJ8DEmV4cHJ4X29iamVjdF9maWVsZKADEnN0bXR4MV9zdG9yZV9sb2NhbKEDE3N0bXR4MV9zdG9yZV9nbG9iYWyiAxJzdG10NF9zdG9yZV9idWZmZXKjAwlleHByMF9pbmakAxBleHByeF9sb2FkX2xvY2FspQMRZXhwcnhfbG9hZF9nbG9iYWymAwtleHByMV91cGx1c6cDC2V4cHIyX2luZGV4qAMPc3RtdDNfaW5kZXhfc2V0qQMUZXhwcngxX2J1aWx0aW5fZmllbGSqAxJleHByeDFfYXNjaWlfZmllbGSrAxFleHByeDFfdXRmOF9maWVsZKwDEGV4cHJ4X21hdGhfZmllbGStAw5leHByeF9kc19maWVsZK4DD3N0bXQwX2FsbG9jX21hcK8DEXN0bXQxX2FsbG9jX2FycmF5sAMSc3RtdDFfYWxsb2NfYnVmZmVysQMRZXhwcnhfc3RhdGljX3JvbGWyAxNleHByeF9zdGF0aWNfYnVmZmVyswMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5ntAMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7UDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7YDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrcDDWV4cHJ4X2xpdGVyYWy4AxFleHByeF9saXRlcmFsX2Y2NLkDEGV4cHJ4X3JvbGVfcHJvdG+6AxFleHByM19sb2FkX2J1ZmZlcrsDDWV4cHIwX3JldF92YWy8AwxleHByMV90eXBlb2a9Aw9leHByMF91bmRlZmluZWS+AxJleHByMV9pc191bmRlZmluZWS/AwpleHByMF90cnVlwAMLZXhwcjBfZmFsc2XBAw1leHByMV90b19ib29swgMJZXhwcjBfbmFuwwMJZXhwcjFfYWJzxAMNZXhwcjFfYml0X25vdMUDDGV4cHIxX2lzX25hbsYDCWV4cHIxX25lZ8cDCWV4cHIxX25vdMgDDGV4cHIxX3RvX2ludMkDCWV4cHIyX2FkZMoDCWV4cHIyX3N1YssDCWV4cHIyX211bMwDCWV4cHIyX2Rpds0DDWV4cHIyX2JpdF9hbmTOAwxleHByMl9iaXRfb3LPAw1leHByMl9iaXRfeG9y0AMQZXhwcjJfc2hpZnRfbGVmdNEDEWV4cHIyX3NoaWZ0X3JpZ2h00gMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTTAwhleHByMl9lcdQDCGV4cHIyX2xl1QMIZXhwcjJfbHTWAwhleHByMl9uZdcDFXN0bXQxX3Rlcm1pbmF0ZV9maWJlctgDFHN0bXR4Ml9zdG9yZV9jbG9zdXJl2QMTZXhwcngxX2xvYWRfY2xvc3VyZdoDEmV4cHJ4X21ha2VfY2xvc3VyZdsDEGV4cHIxX3R5cGVvZl9zdHLcAwxleHByMF9ub3dfbXPdAxZleHByMV9nZXRfZmliZXJfaGFuZGxl3gMQc3RtdDJfY2FsbF9hcnJhed8DCXN0bXR4X3RyeeADDXN0bXR4X2VuZF90cnnhAwtzdG10MF9jYXRjaOIDDXN0bXQwX2ZpbmFsbHnjAwtzdG10MV90aHJvd+QDDnN0bXQxX3JlX3Rocm935QMQc3RtdHgxX3Rocm93X2ptcOYDDnN0bXQwX2RlYnVnZ2Vy5wMJZXhwcjFfbmV36AMRZXhwcjJfaW5zdGFuY2Vfb2bpAwpleHByMF9udWxs6gMPZXhwcjJfYXBwcm94X2Vx6wMPZXhwcjJfYXBwcm94X25l7AMPZGV2c192bV9wb3BfYXJn7QMTZGV2c192bV9wb3BfYXJnX3UzMu4DE2RldnNfdm1fcG9wX2FyZ19pMzLvAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy8AMSamRfYWVzX2NjbV9lbmNyeXB08QMSamRfYWVzX2NjbV9kZWNyeXB08gMMQUVTX2luaXRfY3R48wMPQUVTX0VDQl9lbmNyeXB09AMQamRfYWVzX3NldHVwX2tlefUDDmpkX2Flc19lbmNyeXB09gMQamRfYWVzX2NsZWFyX2tlefcDC2pkX3dzc2tfbmV3+AMUamRfd3Nza19zZW5kX21lc3NhZ2X5AxNqZF93ZWJzb2NrX29uX2V2ZW50+gMHZGVjcnlwdPsDDWpkX3dzc2tfY2xvc2X8AxBqZF93c3NrX29uX2V2ZW50/QMLcmVzcF9zdGF0dXP+AxJ3c3NraGVhbHRoX3Byb2Nlc3P/AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZYAEFHdzc2toZWFsdGhfcmVjb25uZWN0gQQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0ggQPc2V0X2Nvbm5fc3RyaW5ngwQRY2xlYXJfY29ubl9zdHJpbmeEBA93c3NraGVhbHRoX2luaXSFBBF3c3NrX3NlbmRfbWVzc2FnZYYEEXdzc2tfaXNfY29ubmVjdGVkhwQSd3Nza19zZXJ2aWNlX3F1ZXJ5iAQUZGV2c190cmFja19leGNlcHRpb26JBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpligQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYsED3JvbGVtZ3JfcHJvY2Vzc4wEEHJvbGVtZ3JfYXV0b2JpbmSNBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSOBBRqZF9yb2xlX21hbmFnZXJfaW5pdI8EGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZJAEDWpkX3JvbGVfYWxsb2ORBBBqZF9yb2xlX2ZyZWVfYWxskgQWamRfcm9sZV9mb3JjZV9hdXRvYmluZJMEE2pkX2NsaWVudF9sb2dfZXZlbnSUBBNqZF9jbGllbnRfc3Vic2NyaWJllQQUamRfY2xpZW50X2VtaXRfZXZlbnSWBBRyb2xlbWdyX3JvbGVfY2hhbmdlZJcEEGpkX2RldmljZV9sb29rdXCYBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WZBBNqZF9zZXJ2aWNlX3NlbmRfY21kmgQRamRfY2xpZW50X3Byb2Nlc3ObBA5qZF9kZXZpY2VfZnJlZZwEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0nQQPamRfZGV2aWNlX2FsbG9jngQPamRfY3RybF9wcm9jZXNznwQVamRfY3RybF9oYW5kbGVfcGFja2V0oAQMamRfY3RybF9pbml0oQQUZGNmZ19zZXRfdXNlcl9jb25maWeiBAlkY2ZnX2luaXSjBA1kY2ZnX3ZhbGlkYXRlpAQOZGNmZ19nZXRfZW50cnmlBAxkY2ZnX2dldF9pMzKmBAxkY2ZnX2dldF91MzKnBA9kY2ZnX2dldF9zdHJpbmeoBAxkY2ZnX2lkeF9rZXmpBAlqZF92ZG1lc2eqBBFqZF9kbWVzZ19zdGFydHB0cqsEDWpkX2RtZXNnX3JlYWSsBBJqZF9kbWVzZ19yZWFkX2xpbmWtBBNqZF9zZXR0aW5nc19nZXRfYmlurgQNamRfZnN0b3JfaW5pdK8EE2pkX3NldHRpbmdzX3NldF9iaW6wBAtqZF9mc3Rvcl9nY7EED3JlY29tcHV0ZV9jYWNoZbIEFWpkX3NldHRpbmdzX2dldF9sYXJnZbMEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2W0BBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZbUEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2W2BA1qZF9pcGlwZV9vcGVutwQWamRfaXBpcGVfaGFuZGxlX3BhY2tldLgEDmpkX2lwaXBlX2Nsb3NluQQSamRfbnVtZm10X2lzX3ZhbGlkugQVamRfbnVtZm10X3dyaXRlX2Zsb2F0uwQTamRfbnVtZm10X3dyaXRlX2kzMrwEEmpkX251bWZtdF9yZWFkX2kzMr0EFGpkX251bWZtdF9yZWFkX2Zsb2F0vgQRamRfb3BpcGVfb3Blbl9jbWS/BBRqZF9vcGlwZV9vcGVuX3JlcG9ydMAEFmpkX29waXBlX2hhbmRsZV9wYWNrZXTBBBFqZF9vcGlwZV93cml0ZV9leMIEEGpkX29waXBlX3Byb2Nlc3PDBBRqZF9vcGlwZV9jaGVja19zcGFjZcQEDmpkX29waXBlX3dyaXRlxQQOamRfb3BpcGVfY2xvc2XGBA1qZF9xdWV1ZV9wdXNoxwQOamRfcXVldWVfZnJvbnTIBA5qZF9xdWV1ZV9zaGlmdMkEDmpkX3F1ZXVlX2FsbG9jygQNamRfcmVzcG9uZF91OMsEDmpkX3Jlc3BvbmRfdTE2zAQOamRfcmVzcG9uZF91MzLNBBFqZF9yZXNwb25kX3N0cmluZ84EF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkzwQLamRfc2VuZF9wa3TQBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbNEEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy0gQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldNMEFGpkX2FwcF9oYW5kbGVfcGFja2V01AQVamRfYXBwX2hhbmRsZV9jb21tYW5k1QQVYXBwX2dldF9pbnN0YW5jZV9uYW1l1gQTamRfYWxsb2NhdGVfc2VydmljZdcEEGpkX3NlcnZpY2VzX2luaXTYBA5qZF9yZWZyZXNoX25vd9kEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTaBBRqZF9zZXJ2aWNlc19hbm5vdW5jZdsEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l3AQQamRfc2VydmljZXNfdGlja90EFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ94EGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl3wQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZeAEFGFwcF9nZXRfZGV2aWNlX2NsYXNz4QQSYXBwX2dldF9md192ZXJzaW9u4gQNamRfc3J2Y2ZnX3J1buMEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l5AQRamRfc3J2Y2ZnX3ZhcmlhbnTlBA1qZF9oYXNoX2ZudjFh5gQMamRfZGV2aWNlX2lk5wQJamRfcmFuZG9t6AQIamRfY3JjMTbpBA5qZF9jb21wdXRlX2NyY+oEDmpkX3NoaWZ0X2ZyYW1l6wQMamRfd29yZF9tb3Zl7AQOamRfcmVzZXRfZnJhbWXtBBBqZF9wdXNoX2luX2ZyYW1l7gQNamRfcGFuaWNfY29yZe8EE2pkX3Nob3VsZF9zYW1wbGVfbXPwBBBqZF9zaG91bGRfc2FtcGxl8QQJamRfdG9faGV48gQLamRfZnJvbV9oZXjzBA5qZF9hc3NlcnRfZmFpbPQEB2pkX2F0b2n1BAtqZF92c3ByaW50ZvYED2pkX3ByaW50X2RvdWJsZfcECmpkX3NwcmludGb4BBJqZF9kZXZpY2Vfc2hvcnRfaWT5BAxqZF9zcHJpbnRmX2H6BAtqZF90b19oZXhfYfsECWpkX3N0cmR1cPwECWpkX21lbWR1cP0EFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWX+BBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVl/wQRamRfc2VuZF9ldmVudF9leHSABQpqZF9yeF9pbml0gQUUamRfcnhfZnJhbWVfcmVjZWl2ZWSCBR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4MFD2pkX3J4X2dldF9mcmFtZYQFE2pkX3J4X3JlbGVhc2VfZnJhbWWFBRFqZF9zZW5kX2ZyYW1lX3Jhd4YFDWpkX3NlbmRfZnJhbWWHBQpqZF90eF9pbml0iAUHamRfc2VuZIkFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOKBQ9qZF90eF9nZXRfZnJhbWWLBRBqZF90eF9mcmFtZV9zZW50jAULamRfdHhfZmx1c2iNBRBfX2Vycm5vX2xvY2F0aW9ujgUMX19mcGNsYXNzaWZ5jwUFZHVtbXmQBQhfX21lbWNweZEFB21lbW1vdmWSBQZtZW1zZXSTBQpfX2xvY2tmaWxllAUMX191bmxvY2tmaWxllQUGZmZsdXNolgUEZm1vZJcFDV9fRE9VQkxFX0JJVFOYBQxfX3N0ZGlvX3NlZWuZBQ1fX3N0ZGlvX3dyaXRlmgUNX19zdGRpb19jbG9zZZsFCF9fdG9yZWFknAUJX190b3dyaXRlnQUJX19md3JpdGV4ngUGZndyaXRlnwUUX19wdGhyZWFkX211dGV4X2xvY2ugBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NroQUGX19sb2NrogUIX191bmxvY2ujBQ5fX21hdGhfZGl2emVyb6QFCmZwX2JhcnJpZXKlBQ5fX21hdGhfaW52YWxpZKYFA2xvZ6cFBXRvcDE2qAUFbG9nMTCpBQdfX2xzZWVrqgUGbWVtY21wqwUKX19vZmxfbG9ja6wFDF9fb2ZsX3VubG9ja60FDF9fbWF0aF94Zmxvd64FDGZwX2JhcnJpZXIuMa8FDF9fbWF0aF9vZmxvd7AFDF9fbWF0aF91Zmxvd7EFBGZhYnOyBQNwb3ezBQV0b3AxMrQFCnplcm9pbmZuYW61BQhjaGVja2ludLYFDGZwX2JhcnJpZXIuMrcFCmxvZ19pbmxpbmW4BQpleHBfaW5saW5luQULc3BlY2lhbGNhc2W6BQ1mcF9mb3JjZV9ldmFsuwUFcm91bmS8BQZzdHJjaHK9BQtfX3N0cmNocm51bL4FBnN0cmNtcL8FBnN0cmxlbsAFB19fdWZsb3fBBQdfX3NobGltwgUIX19zaGdldGPDBQdpc3NwYWNlxAUGc2NhbGJuxQUJY29weXNpZ25sxgUHc2NhbGJubMcFDV9fZnBjbGFzc2lmeWzIBQVmbW9kbMkFBWZhYnNsygULX19mbG9hdHNjYW7LBQhoZXhmbG9hdMwFCGRlY2Zsb2F0zQUHc2NhbmV4cM4FBnN0cnRveM8FBnN0cnRvZNAFEl9fd2FzaV9zeXNjYWxsX3JldNEFCGRsbWFsbG9j0gUGZGxmcmVl0wUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl1AUEc2Jya9UFCF9fYWRkdGYz1gUJX19hc2hsdGkz1wUHX19sZXRmMtgFB19fZ2V0ZjLZBQhfX2RpdnRmM9oFDV9fZXh0ZW5kZGZ0ZjLbBQ1fX2V4dGVuZHNmdGYy3AULX19mbG9hdHNpdGbdBQ1fX2Zsb2F0dW5zaXRm3gUNX19mZV9nZXRyb3VuZN8FEl9fZmVfcmFpc2VfaW5leGFjdOAFCV9fbHNocnRpM+EFCF9fbXVsdGYz4gUIX19tdWx0aTPjBQlfX3Bvd2lkZjLkBQhfX3N1YnRmM+UFDF9fdHJ1bmN0ZmRmMuYFC3NldFRlbXBSZXQw5wULZ2V0VGVtcFJldDDoBQlzdGFja1NhdmXpBQxzdGFja1Jlc3RvcmXqBQpzdGFja0FsbG9j6wUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudOwFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdO0FGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXuBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl7wUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k8AUMZHluQ2FsbF9qaWpp8QUWbGVnYWxzdHViJGR5bkNhbGxfamlqafIFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfAFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 26192;
var ___stop_em_js = Module['___stop_em_js'] = 27245;



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
