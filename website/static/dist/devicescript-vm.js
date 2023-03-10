
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9SFgIAA0gUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEABQAFBQMCAgMCAgMEAwMDBQIIAAMBAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAoAAgIAAQEBAAEAAAEAAAAKAAECAAEBBAUBAgAAAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGEQICBg4DAwMDBQUDAwMEBAUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAQECBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgEAAQEAAACBwADBwcBAgEAEgMJBwAABAACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAcoBygEFhoCAgAABAYACgAIG3YCAgAAOfwFB4OwFC38BQQALfwFBAAt/AUEAC38AQeDKAQt/AEHPywELfwBBmc0BC38AQZXOAQt/AEGRzwELfwBB4c8BC38AQYLQAQt/AEGH0gELfwBB4MoBC38AQf3SAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAMcFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCDBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDIBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAIsFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADiBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAOMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA5AUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAOUFCXN0YWNrU2F2ZQDeBQxzdGFja1Jlc3RvcmUA3wUKc3RhY2tBbGxvYwDgBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AOEFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA5wUJiYOAgAABAEEBC8kBKjtERUZH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ARB2CwsjAQF/IABB39QDIABBABCnAiIBIAFBoKt8akGhq3xJGxCBAQsJACAAQQAQgQELywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQygIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDHAiIFQX9qIgYQkgEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQxwIaDAELIAdBBmogAUEQaiAGEIYFGgsgACAHEKwCCyABQeAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQpwIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEM8CIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEO8BIAFBIGokAAsOACAAIABBABCoAhCpAgsPACAAIABBABCoAp0QqQILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDwAkUNACABIAEpA2g3AxAgASAAIAFBEGoQvQI2AgBBqRYgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEM8CIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEIwBIAEgASkDYDcDOCAAIAFBOGpBABDKAiECIAEgASkDaDcDMCABIAAgAUEwahC9AjYCJCABIAI2AiBB2xYgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjQELIAFB8ABqJAALewICfwF+IwBBEGsiASQAAkAgABCtAiICRQ0AAkAgAigCBA0AIAIgAEEcEIQCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABDLAgsgASABKQMINwMAIAAgAkH2ACABENECIAAgAhCsAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQrQIiAkUNAAJAIAIoAgQNACACIABBIBCEAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQywILIAEgASkDCDcDACAAIAJB9gAgARDRAiAAIAIQrAILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEK0CIgJFDQACQCACKAIEDQAgAiAAQR4QhAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEMsCCyABIAEpAwg3AwAgACACQfYAIAEQ0QIgACACEKwCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCtAiICRQ0AAkAgAigCBA0AIAIgAEEiEIQCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARDLAgsgASABKQMINwMAIAAgAkH2ACABENECIAAgAhCsAgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEJUCAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABCVAgsgA0EgaiQACzUCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABENcCIAAQ/gMgAUEQaiQAC6kBAQN/IwBBEGsiASQAAkACQCAALQBDQQFLDQAgAUEIaiAAQcojQQAQ3AIMAQsCQCAAQQAQpwIiAkF7akF7Sw0AIAFBCGogAEG5I0EAENwCDAELIAAgAC0AQ0F/aiIDOgBDIABB2ABqIABB4ABqIANB/wFxQX9qIgNBA3QQhwUaIAAgAyACEH0iAkUNACAAKAKsASACNQIcQoCAgIAQhDcDIAsgAUEQaiQAC+MCAgN/AX4jAEHwAGsiAyQAIAMgAikDADcDQAJAAkACQCABIANBwABqIANB6ABqIANB5ABqEJMCIgRBz4YDSw0AIAEoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENAQsgAyACKQMANwMIIAAgAUHYHiADQQhqEN8CDAELIAAgASABKAKgASAEQf//A3EQjgIgACkDAEIAUg0AIANB2ABqIAFBCCABIAFBAhCEAhCOARDlAiAAIAMpA1giBjcDACAGUA0AIAMgACkDADcDOCABIANBOGoQjAEgA0HQAGpB+wAQywIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqEKMCIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahCMAiADIAApAwA3AxAgASADQRBqEI0BCyADQfAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDCAJAAkACQCABIANBCGogA0EYaiADQRRqEJMCIgRBf0oNACADIAIpAwA3AwAgACABQRwgAxDeAgwBCwJAIARB0IYDSA0AIARBsPl8aiIBQQAvAcDGAU4NAiAAQYDiACABQQN0ai8BABDLAgwBCyAAIAEoAKQBIgEgASgCIGogBEEEdGovAQw2AgAgAEEENgIECyADQSBqJAAPC0GUE0HVN0E4QfQpEOkEAAvjAQICfwF+IwBB0ABrIgEkACABIABB2ABqKQMANwNIIAEgAEHgAGopAwAiAzcDKCABIAM3A0ACQCABQShqEPACDQAgAUE4aiAAQfMYEN0CCyABIAEpA0g3AyAgAUE4aiAAIAFBIGoQzwIgASABKQM4IgM3A0ggASADNwMYIAAgAUEYahCMASABIAEpA0g3AxACQCAAIAFBEGogAUE4ahDKAiICRQ0AIAFBMGogACACIAEoAjhBARD7ASAAKAKsASABKQMwNwMgCyABIAEpA0g3AwggACABQQhqEI0BIAFB0ABqJAALhQEBAn8jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMANwMgIABBAhCnAiECIAEgASkDIDcDCAJAIAFBCGoQ8AINACABQRhqIABBzRoQ3QILIAEgASkDKDcDACABQRBqIAAgASACQQEQgQIgACgCrAEgASkDEDcDICABQTBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEOYCmxCpAgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDmApwQqQILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ5gIQsQUQqQILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ4wILIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEOYCIgREAAAAAAAAAABjRQ0AIAAgBJoQqQIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQ3QS4RAAAAAAAAPA9ohCpAgtkAQV/AkACQCAAQQAQpwIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBDdBCACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFEKoCCxEAIAAgAEEAEKgCEJwFEKkCCxgAIAAgAEEAEKgCIABBARCoAhCoBRCpAgsuAQN/IABBABCnAiEBQQAhAgJAIABBARCnAiIDRQ0AIAEgA20hAgsgACACEKoCCy4BA38gAEEAEKcCIQFBACECAkAgAEEBEKcCIgNFDQAgASADbyECCyAAIAIQqgILFgAgACAAQQAQpwIgAEEBEKcCbBCqAgsJACAAQQEQwwEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ5wIhAyACIAIpAyA3AxAgACACQRBqEOcCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahDmAiEGIAIgAikDIDcDACAAIAIQ5gIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQOwaTcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDDAQuTAQIDfwF+IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQ8AINACABIAEpAyg3AxAgACABQRBqEJcCIQIgASABKQMgNwMIIAAgAUEIahCbAiIDRQ0AIAJFDQAgACACIAMQhQILIAAoAqwBIAEpAyg3AyAgAUEwaiQACwkAIABBARDHAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQmwIiA0UNACAAQQAQkAEiBEUNACACQSBqIABBCCAEEOUCIAIgAikDIDcDECAAIAJBEGoQjAEgACADIAQgARCJAiACIAIpAyA3AwggACACQQhqEI0BIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQxwEL4wECA38BfiMAQcAAayIBJAAgASAAQdgAaikDACIENwM4IAEgAEHgAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ7QIiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDeAgwBCyABIAEpAzA3AxgCQCAAIAFBGGoQmwIiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqEN4CDAELIAIgAzYCBCAAKAKsASABKQM4NwMgCyABQcAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDeAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABIAIvARIQgwNFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuwAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ3gJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAMgAkEIakEIEPAENgIAIAAgAUGwFCADEM0CCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEP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ASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABBlDIgAhDcAiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQS2ohAwsgAEGQAmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCPAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGFGyABQRBqEN8CQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEH4GiABQQhqEN8CQQAhAwsCQCADIgNFDQAgACADENwBIAAgASgCJCADLwECQf8fcUGAwAByEOsBCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEI8CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQYUbIANBCGoQ3wJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCPAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGFGyADQQhqEN8CQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQjwIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBhRsgA0EIahDfAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDjAgsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQjwIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBhRsgAUEQahDfAkEAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEo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ASAADQEMAgtBACgCuNkBIAEgAyAAIAMgAEkbIgAQhgUaQQBBACgCvNkBIgkgAGs2ArzZASABIABqIQEgAyAAayECAkAgCSAARw0AQcTZAUH42AEQvwJBAEHAADYCvNkBQQBB+NgBNgK42QEgAiEDIAEhASACDQEMAgtBAEEAKAK42QEgAGo2ArjZASACIQMgASEBIAINAAsLIAgQxQIgCEEgEMQCAkAgBUUNAEEAQQAoAsDZASAFajYCwNkBIAUhAyAEIQEDQCABIQEgAyEDAkBBACgCvNkBIgBBwABHDQAgA0HAAEkNAEHE2QEgARC/AiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK42QEgASADIAAgAyAASRsiABCGBRpBAEEAKAK82QEiCSAAazYCvNkBIAEgAGohASADIABrIQICQCAJIABHDQBBxNkBQfjYARC/AkEAQcAANgK82QFBAEH42AE2ArjZASACIQMgASEBIAINAQwCC0EAQQAoArjZASAAajYCuNkBIAIhAyABIQEgAg0ACwsCQCAHRQ0AQQBBACgCwNkBIAdqNgLA2QEgByEDIAYhAQNAIAEhASADIQMCQEEAKAK82QEiAEHAAEcNACADQcAASQ0AQcTZASABEL8CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjZASABIAMgACADIABJGyIAEIYFGkEAQQAoArzZASIJIABrNgK82QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE2QFB+NgBEL8CQQBBwAA2ArzZAUEAQfjYATYCuNkBIAIhAyABIQEgAg0BDAILQQBBACgCuNkBIABqNgK42QEgAiEDIAEhASACDQALC0EAQQAoAsDZAUEBajYCwNkBQQEhA0Gt1QAhAQJAA0AgASEBIAMhAwJAQQAoArzZASIAQcAARw0AIANBwABJDQBBxNkBIAEQvwIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuNkBIAEgAyAAIAMgAEkbIgAQhgUaQQBBACgCvNkBIgkgAGs2ArzZASABIABqIQEgAyAAayECAkAgCSAARw0AQcTZAUH42AEQvwJBAEHAADYCvNkBQQBB+NgBNgK42QEgAiEDIAEhASACDQEMAgtBAEEAKAK42QEgAGo2ArjZASACIQMgASEBIAINAAsLIAgQ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NwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQggELDgAgACACIAIoAkwQsAILNQACQCABLQBCQQFGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEAQQAQdBoLNQACQCABLQBCQQJGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEBQQAQdBoLNQACQCABLQBCQQNGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUECQQAQdBoLNQACQCABLQBCQQRGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEDQQAQdBoLNQACQCABLQBCQQVGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEEQQAQdBoLNQACQCABLQBCQQZGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEFQQAQdBoLNQACQCABLQBCQQdGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEGQQAQdBoLNQACQCABLQBCQQhGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEHQQAQdBoLNQACQCABLQBCQQlGDQBB0cYAQas2Qc0AQcLBABDpBAALIAFBADoAQiABKAKsAUEIQQAQdBoL9gECA38BfiMAQdAAayICJAAgAkHIAGogARDiAyACQcAAaiABEOIDIAEoAqwBQQApA6hpNwMgIAEgAikDSDcDMCACIAIpA0A3AzACQCABIAJBMGoQlwIiA0UNACACIAIpA0g3AygCQCABIAJBKGoQyAIiBA0AIAIgAikDSDcDICACQThqIAEgAkEgahDPAiACIAIpAzgiBTcDSCACIAU3AxggASACQRhqEIwBCyACIAIpA0g3AxACQCABIAMgAkEQahCNAg0AIAEoAqwBQQApA6BpNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahCNAQsgAkHQAGokAAteAQJ/IwBBEGsiAiQAIAEoAqwBIQMgAkEIaiABEOIDIAMgAikDCDcDICADIAAQdwJAIAEtAEdFDQAgASgC2AEgAEcNACABLQAHQQhxRQ0AIAFBCBD9AgsgAkEQaiQAC2IBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCCAUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4UBAQR/IwBBIGsiAiQAIAJBEGogARDiAyACIAIpAxA3AwggASACQQhqEOgCIQMCQAJAIAAoAhAoAgAgASgCTCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABCCAUEAIQULAkAgBSIBRSADcg0AIAAgATsBBAsgAkEgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOIDIANBEGogAhDiAyADIAMpAxg3AwggAyADKQMQNwMAIAAgAiADQQhqIAMQkQIgA0EgaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqQBNgIMAkACQCADQQxqIARBgIABciIEEPUCDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEIQCIQQgAyADKQMQNwMAIAAgAiAEIAMQngIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEOIDAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ4gMCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ4gMgARDjAyEDIAEQ4wMhBCACQRBqIAFBARDlAwJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA7hpNwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQ4gMgAyADKQMYNwMQAkACQAJAIANBEGoQyQINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEOYCEOICCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ4gMgA0EQaiACEOIDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCiAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ4gMgAkEgaiABEOIDIAJBGGogARDiAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEKMCIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBD1Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCgAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD1Ag0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJA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QCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEOYCmhDiAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA5hpNwMADAELIABBACACaxDjAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEOIDIAMgAykDCDcDACAAIAIgAxDoAkEBcxDkAiADQRBqJAALDAAgACACEOQDEOMCC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhDiAyACQRhqIgQgAykDODcDACADQThqIAIQ4gMgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEOMCDAELIAMgBSkDADcDMAJAAkAgAiADQTBqEMgCDQAgAyAEKQMANwMoIAIgA0EoahDIAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqENICDAELIAMgBSkDADcDICACIAIgA0EgahDmAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQ5gIiCDkDACAAIAggAisDIKAQ4gILIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQ4gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhDjAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ5gI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOYCIgg5AwAgACACKwMgIAihEOICCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhDiAyACQRhqIgQgAykDGDcDACADQRhqIAIQ4gMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEOMCDAELIAMgBSkDADcDECACIAIgA0EQahDmAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ5gIiCDkDACAAIAggAisDIKIQ4gILIANBIGokAAvoAQIGfwF8IwBBIGsiAyQAIANBGGogAhDiAyAC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DAILIAArAAAhAwwBCyAAIAIQsgS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtB4jVBygFBmcYAEOQEAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACELIEtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvjAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKALw5QEiASAARw0AQfDlASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQiAUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKALw5QE2AgBBACAANgLw5QFBACECCyACDwtB6DpBK0GZIBDkBAAL4wECA38BfgJAIAEtAAxBAk8NAEF+DwtBfiECAkACQCABKQIEIgVQDQAgAS8BECEDECMNAQJAIAAtAAZFDQACQAJAAkBBACgC8OUBIgEgAEcNAEHw5QEhAQwBCyABIQIDQCACIgFFDQIgASgCACIEIQIgASEBIAQgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEIgFGgsgAEEBOwEGIABBD2pBAzoA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IAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQtQVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQtQVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBDsBCABQQhqIQIMBwsgCygCACIBQfTQACABGyIDELUFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQhgUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBC1BSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQhgUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEJ4FIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ2QWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ2QWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDZBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDZBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQiAUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QZDyAGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEIgFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQtQVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxDrBCEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALSQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgACABEOsEIgEQISIDIAEgACACKAIIEOsEGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkHaJWotAAA6AAAgBUEBaiAGLQAAQQ9xQdolai0AADoAACAEQQFqIgUhBCAFIAFHDQALCyADIAJqQQA6AAAgAwvpAQEHfyMAQRBrIgEkACABQQA2AgwgAUIANwIE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IAINAUECQQMgAUL///////////8Ag1AbDwsgAUL/////////B4NQIQMLIAMLBAAgAAuOBAEDfwJAIAJBgARJDQAgACABIAIQEyAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEIYFDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgC3OgBRQ0AQQAoAtzoARCLBSEBCwJAQQAoAtjKAUUNAEEAKALYygEQiwUgAXIhAQsCQBChBSgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQiQUhAgsCQCAAKAIUIAAoAhxGDQAgABCLBSABciEBCwJAIAJFDQAgABCKBQsgACgCOCIADQALCxCiBSABDwtBACECAkAgACgCTEEASA0AIAAQiQUhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBEPABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEIoFCyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEI0FIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACEJ8FC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBQQxgVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahAUEMYFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBCFBRASC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEJIFDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEIYFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQkwUhAAwBCyADEIkFIQUgACAEIAMQkwUhACAFRQ0AIAMQigULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEJoFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEJ0FIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA8BzIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDkHSiIAhBACsDiHSiIABBACsDgHSiQQArA/hzoKCgoiAIQQArA/BzoiAAQQArA+hzokEAKwPgc6CgoKIgCEEAKwPYc6IgAEEAKwPQc6JBACsDyHOgoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQmQUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQmwUPCyAARAAAAAAAADBDor1CgICA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IAAgAzYCaCAAIAQgACgCLCIDIAFrrHw3A3gCQCABIANLDQAgAUF/aiACOgAACyACCxAAIABBIEYgAEF3akEFSXILrgEAAkACQCABQYAISA0AIABEAAAAAAAA4H+iIQACQCABQf8PTw0AIAFBgXhqIQEMAgsgAEQAAAAAAADgf6IhACABQf0XIAFB/RdIG0GCcGohAQwBCyABQYF4Sg0AIABEAAAAAAAAYAOiIQACQCABQbhwTQ0AIAFByQdqIQEMAQsgAEQAAAAAAABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDXBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AENcFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ1wUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5ENcFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDXBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQzQVFDQAgAyAEEL0FIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEENcFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQzwUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL/////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IIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEMwFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDMBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQzAUgBUEwaiAKIAEgBxDWBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEMwFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEMwFIAUgAiAEQQEgBmsQ1gUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAENQFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELENUFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQzAVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDMBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDYBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDYBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDYBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDYBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDYBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDYBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDYBSAFQZABaiADQg+GQgAgBEIAENgFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ2AUgBUGAAWpCASACfUIAIARCABDYBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOENgFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOENgFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ1gUgBUEwaiAWIBMgBkHwAGoQzAUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q2AUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDYBSAFIAMgDkIFQgAQ2AUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEMwFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEMwFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQzAUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQzAUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQzAVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQzAUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQzAUgBUEgaiACIAQgBhDMBSAFQRBqIBIgASAHENYFIAUgAiAEIAcQ1gUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEMsFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDMBSACIAAgBEGB+AAgA2sQ1gUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHg7AUkA0Hg7AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEOYFIQUgBUIgiKcQ3AUgBacLEwAgACABpyABQiCIpyACIAMQFgsLjsuBgAADAEGACAuovgFpbmZpbml0eQAtSW5maW5pdHkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAc2xlZXBNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBhc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBnY3JlZl90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkACogIHBjPSVkIEAgJXNfRiVkACEgIHBjPSVkIEAgJXNfRiVkACEgUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDACogIHBjPSVkIEAgPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcHRyKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQAhIG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRFUykAJXMgKFdTU0spAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpACF0YXJnZXRfaW5faXJxKCkAZnN0b3I6IGludmFsaWQgbGFyZ2Uga2V5OiAnJXMnAGZzdG9yOiBpbnZhbGlkIGtleTogJyVzJwBXU246IHRleHQgbWVzc2FnZT8hICclcycAemVybyBrZXkhAFdTbjogZXJyb3IhAGRlcGxveSBkZXZpY2UgbG9zdAoAAQAwLjAuMAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAABEQ0ZHCpu0yvgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQACAAIAAgACAAMAAwADAAMAAwADAAMAAwADAAQABAAEAAQABAAEAAQAZGV2TmFtZQAAAAAAAAAAAD1DdgDQAAAAaWQAAAAAAAAAAAAAAAAAANhdEgDuAAAAYXJjaElkAAAAAAAAAAAAAGZ9EgDzAAAAcHJvZHVjdElkAAAAAAAAAJfBAQBvtOU/AP//////////////////////////////RGV2aWNlU2NyaXB0IFNpbXVsYXRvciAoV0FTTSkAd2FzbQB3YXNtAJxuYBQMAAAABwAAAAgAAADwnwYAARCAEIEQgBHxDwAAQFtbFRwBAAAKAAAACwAAAAAAAAAAAAAAAAAHAPCfBgCAEIEQ8Q8AACvqNBE8AQAADwAAABAAAABEZXZTCn5qmgAAAAYBAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAgAAAAkAAAAAwAAACcAAAAAAAAAJwAAAAAAAAAnAAAAAAAAACcAAAAAAAAAJwAAAAAAAAAnAAAAAQAAACgAAAAAAAAAKAAAAAAAAAAkAAAAAgAAAAAAAAAUEAAAJgAAAAEAAAAAAAAADRAAAAnAQKQDAAAAC4MAAAAAAAAAQAAAAMAAgAEAAAAAAAGAAAAAAAACAAFAAcACgAABg4SDBAIAAIAABgAAAAXAAAAGgAAABcAAAAXAAAAFwAAABcAAAAXAAAAGQAAAAAAAAAUAG7DGgBvwzoAcMMNAHHDNgBywzcAc8MjAHTDMgB1wx4AdsNLAHfDHwB4wygAecMnAHrDAAAAAAAAAAAAAAAAVQB7w1YAfMNXAH3DeQB+wzQAAgAAAAAAAAAAAGwAUsM0AAQAAAAAAAAAAAAAAAAAIgBQw00AUcM1AFPDbwBUwz8AVcMAAAAADgBWwzQABgAAAAAAAAAAAAAAAAAAAAAAIgBXw0QAWMMZAFnDEABawwAAAAA0AAgAAAAAAAAAAAAiAJfDFQCYw1EAmcM/AJrDAAAAADQACgAAAAAANAAMAAAAAAA0AA4AAAAAAAAAAAAgAJTDcACVw0gAlsMAAAAANAAQAAAAAAAAAAAAAAAAAE4AacM0AGrDYwBrwwAAAAA0ABIAAAAAADQAFAAAAAAAWQB/w1oAgMNbAIHDXACCw10Ag8NpAITDawCFw2oAhsNeAIfDZACIw2UAicNmAIrDZwCLw2gAjMNfAI3DAAAAAEoAW8MwAFzDOQBdw0wAXsN+AF/DVABgw1MAYcN9AGLDAAAAAAAAAAAAAAAAAAAAAFkAkMNjAJHDYgCSwwAAAAADAAAPAAAAABAtAAADAAAPAAAAAFAtAAADAAAPAAAAAGgtAAADAAAPAAAAAGwtAAADAAAPAAAAAIAtAAADAAAPAAAAAJgtAAADAAAPAAAAALAtAAADAAAPAAAAAMQtAAADAAAPAAAAANAtAAADAAAPAAAAAOQtAAADAAAPAAAAAGgtAAADAAAPAAAAAOwtAAADAAAPAAAAAGgtAAADAAAPAAAAAPQtAAADAAAPAAAAAAAuAAADAAAPAAAAABAuAAADAAAPAAAAACAuAAADAAAPAAAAADAuAAADAAAPAAAAAGgtAAADAAAPAAAAADguAAADAAAPAAAAAEAuAAADAAAPAAAAAIAuAAADAAAPAAAAALAuAAADAAAPyC8AAHAwAAADAAAPyC8AAHwwAAADAAAPyC8AAIQwAAADAAAPAAAAAGgtAAADAAAPAAAAAIgwAAADAAAPAAAAAKAwAAADAAAPAAAAALAwAAADAAAPEDAAALwwAAADAAAPAAAAAMQwAAADAAAPEDAAANAwAAADAAAPAAAAANgwAAADAAAPAAAAAOQwAAADAAAPAAAAAOwwAAA4AI7DSQCPwwAAAABYAJPDAAAAAAAAAABYAGPDNAAcAAAAAAAAAAAAAAAAAAAAAAB7AGPDYwBnw34AaMMAAAAAWABlwzQAHgAAAAAAewBlwwAAAABYAGTDNAAgAAAAAAB7AGTDAAAAAFgAZsM0ACIAAAAAAHsAZsMAAAAAhgBsw4cAbcMAAAAAAAAAAAAAAAAiAAABFQAAAE0AAgAWAAAAbAABBBcAAAA1AAAAGAAAAG8AAQAZAAAAPwAAABoAAAAOAAEEGwAAACIAAAEcAAAARAAAAB0AAAAZAAMAHgAAABAABAAfAAAASgABBCAAAAAwAAEEIQAAADkAAAQiAAAATAAABCMAAAB+AAIEJAAAAFQAAQQlAAAAUwABBCYAAAB9AAIEJwAAAHIAAQgoAAAAdAABCCkAAABzAAEIKgAAAIQAAQgrAAAAYwAAASwAAAB+AAAALQAAAE4AAAAuAAAANAAAAS8AAABjAAABMAAAAIYAAgQxAAAAhwADBDIAAAAUAAEEMwAAABoAAQQ0AAAAOgABBDUAAAANAAEENgAAADYAAAQ3AAAANwABBDgAAAAjAAEEOQAAADIAAgQ6AAAAHgACBDsAAABLAAIEPAAAAB8AAgQ9AAAAKAACBD4AAAAnAAIEPwAAAFUAAgRAAAAAVgABBEEAAABXAAEEQgAAAHkAAgRDAAAAWQAAAUQAAABaAAABRQAAAFsAAAFGAAAAXAAAAUcAAABdAAABSAAAAGkAAAFJAAAAawAAAUoAAABqAAABSwAAAF4AAAFMAAAAZAAAAU0AAABlAAABTgAAAGYAAAFPAAAAZwAAAVAAAABoAAABUQAAAF8AAABSAAAAOAAAAFMAAABJAAAAVAAAAFkAAAFVAAAAYwAAAVYAAABiAAABVwAAAFgAAABYAAAAIAAAAVkAAABwAAIAWgAAAEgAAABbAAAAIgAAAVwAAAAVAAEAXQAAAFEAAQBeAAAAPwACAF8AAACWFQAA5gkAAFUEAABcDgAAHA0AAD4SAAAqFgAAviIAAFwOAACsCAAAXA4AAAAAAAAAAAAAAAAAAJgvikKRRDdxz/vAtaXbtelbwlY58RHxWaSCP5LVXhyrmKoH2AFbgxK+hTEkw30MVXRdvnL+sd6Apwbcm3Txm8HBaZvkhke+78adwQ/MoQwkbyzpLaqEdErcqbBc2oj5dlJRPphtxjGoyCcDsMd/Wb/zC+DGR5Gn1VFjygZnKSkUhQq3JzghGy78bSxNEw04U1RzCmW7Cmp2LsnCgYUscpKh6L+iS2YaqHCLS8KjUWzHGeiS0SQGmdaFNQ70cKBqEBbBpBkIbDceTHdIJ7W8sDSzDBw5SqrYTk/KnFvzby5o7oKPdG9jpXgUeMiECALHjPr/vpDrbFCk96P5vvJ4ccYAAAAA/////wAAAAAAAOBBQAAAAAAAAAABAAAAAAAAAAIAAAAAAAAAQgAAAAAAAAADAAAAAAAAAAMAAAACAAAABAAAAAkAAAAIAAAACQAAAAIAAAAKAAAAAgAAAAAAAACuKgAACQQAABgHAACWIgAACgQAAG8jAAABIwAAkSIAAIsiAADNIAAA3iEAAPMiAAD7IgAA+wkAADIaAABVBAAAMAkAAFkQAAAcDQAAvwYAAKEQAABRCQAAPw4AAKwNAABUFAAASgkAAG0MAACnEQAAgw8AAD0JAACxBQAAdhAAAGkXAADbDwAAYBEAAN4RAABpIwAA7iIAAFwOAACCBAAA4A8AADQGAAB7EAAAZQ0AAFQVAAB1FwAASxcAAKwIAABDGgAALA4AAIEFAAC2BQAAjxQAAHoRAABhEAAAzAcAAH8YAAAlBwAAChYAADcJAABnEQAAJggAAMAQAADoFQAA7hUAAJQGAAA+EgAA9RUAAEUSAACGEwAA5xcAABUIAAAQCAAA7BMAAAcKAAAFFgAAKQkAALgGAAD/BgAA/xUAAPgPAABDCQAA9wgAANYHAAD+CAAA/Q8AAFwJAADCCQAARx4AACoVAAALDQAAhBgAAGMEAACSFgAAXhgAALsVAAC0FQAAswgAAL0VAAACFQAAogcAAMIVAAC8CAAAxQgAAMwVAAC3CQAAmQYAAIgWAABbBAAAzBQAALEGAABdFQAAoRYAAD0eAABnDAAAWAwAAGIMAAD6EAAAfxUAABYUAAArHgAA6xIAAPoSAAAXDAAAMx4AAA4MAABDBwAA/wkAAKYQAABoBgAAshAAAHMGAABMDAAA8iAAACYUAAApBAAAf2AREhMUFRYXGBkSUXAxQmAxMRRAICBBAhMhISFgYBAREWBgYGBgYGBgIAMAQUBBQEBBQEFBQUFBQUJCQkJCQkJCQkJCQkJCETIhIEEAARIwcBAQUVFxEEFCQEJCAEYrUlJSUhFSHEJSUlIAAAAAAGN8d3vya2/FMAFnK/7Xq3bKgsl9+llH8K3Uoq+cpHLAt/2TJjY/98w0peXxcdgxFQTHI8MYlgWaBxKA4usnsnUJgywaG25aoFI71rMp4y+EU9EA7SD8sVtqy745SkxYz9DvqvtDTTOFRfkCf1A8n6hRo0CPkp049by22iEQ//PSzQwT7F+XRBfEp349ZF0Zc2CBT9wiKpCIRu64FN5eC9vgMjoKSQYkXMLTrGKRleR558g3bY3VTqlsVvTqZXquCLp4JS4cprTG6N10H0u9i4pwPrVmSAP2DmE1V7mGwR2e4fiYEWnZjpSbHofpzlUo34yhiQ2/5kJoQZktD7BUuxaNAQIECBAgQIAbNgAAAAAAAAAAACwCAAApAgAAIwIAACkCAADwnwYAgjGAUIFQ8Q/87mIUaAAAAL0AAAC+AAAAvwAAAMAAAAAABAAAwQAAAPCfBgCAEIER8Q8AAGZ+Sx4kAQAAwgAAAMMAAAAAAAAACAAAAMQAAADFAAAAAAAAAAEBAgIEBAQIAQABAgQEAAABAAAAAAAAAAoAAAAAAAAAZAAAAAAAAADoAwAAAAAAABAnAAAAAAAAoIYBAAAAAABAQg8AAAAAAICWmAAAAAAAAOH1BQAAAAAAypo7AAAAAADkC1QCAAAAAOh2SBcAAAAAEKXU6AAAAACgck4YCQAAAEB6EPNaAAAAOPr+Qi7mPzBnx5NX8y49AQAAAAAA4L9bMFFVVVXVP5BF6////8+/EQHxJLOZyT+fyAbldVXFvwAAAAAAAOC/d1VVVVVV1T/L/f/////PvwzdlZmZmck/p0VnVVVVxb8w3kSjJEnCP2U9QqT//7+/ytYqKIRxvD//aLBD65m5v4XQr/eCgbc/zUXRdRNStb+f3uDD8DT3PwCQ5nl/zNe/H+ksangT9z8AAA3C7m/Xv6C1+ghg8vY/AOBRE+MT1799jBMfptH2PwB4KDhbuNa/0bTFC0mx9j8AeICQVV3Wv7oMLzNHkfY/AAAYdtAC1r8jQiIYn3H2PwCQkIbKqNW/2R6lmU9S9j8AUANWQ0/Vv8Qkj6pWM/Y/AEBrwzf21L8U3J1rsxT2PwBQqP2nndS/TFzGUmT29T8AqIk5kkXUv08skbVn2PU/ALiwOfTt07/ekFvLvLr1PwBwj0TOltO/eBrZ8mGd9T8AoL0XHkDTv4dWRhJWgPU/AIBG7+Lp0r/Ta+fOl2P1PwDgMDgblNK/k3+n4iVH9T8AiNqMxT7Sv4NFBkL/KvU/AJAnKeHp0b/fvbLbIg/1PwD4SCttldG/1940R4/z9D8A+LmaZ0HRv0Ao3s9D2PQ/AJjvlNDt0L/Io3jAPr30PwAQ2xilmtC/iiXgw3+i9D8AuGNS5kfQvzSE1CQFiPQ/APCGRSLrz78LLRkbzm30PwCwF3VKR8+/VBg509lT9D8AMBA9RKTOv1qEtEQnOvQ/ALDpRA0Czr/7+BVBtSD0PwDwdymiYM2/sfQ+2oIH9D8AkJUEAcDMv4/+V12P7vM/ABCJVikgzL/pTAug2dXzPwAQgY0Xgcu/K8EQwGC98z8A0NPMyeLKv7jadSskpfM/AJASLkBFyr8C0J/NIo3zPwDwHWh3qMm/HHqExVt18z8AMEhpbQzJv+I2rUnOXfM/AMBFpiBxyL9A1E2YeUbzPwAwFLSP1se/JMv/zlwv8z8AcGI8uDzHv0kNoXV3GPM/AGA3m5qjxr+QOT43yAHzPwCgt1QxC8a/QfiVu07r8j8AMCR2fXPFv9GpGQIK1fI/ADDCj3vcxL8q/beo+b7yPwAA0lEsRsS/qxsMehyp8j8AAIO8irDDvzC1FGByk/I/AABJa5kbw7/1oVdX+n3yPwBApJBUh8K/vzsdm7No8j8AoHn4ufPBv731j4OdU/I/AKAsJchgwb87CMmqtz7yPwAg91d/zsC/tkCpKwEq8j8AoP5J3DzAvzJBzJZ5FfI/AIBLvL1Xv7+b/NIdIAHyPwBAQJYIN76/C0hNSfTs8T8AQPk+mBe9v2llj1L12PE/AKDYTmf5u798flcRI8XxPwBgLyB53Lq/6SbLdHyx8T8AgCjnw8C5v7YaLAwBnvE/AMBys0amuL+9cLZ7sIrxPwAArLMBjbe/trzvJYp38T8AADhF8XS2v9oxTDWNZPE/AICHbQ5etb/dXyeQuVHxPwDgod5cSLS/TNIypA4/8T8AoGpN2TOzv9r5EHKLLPE/AGDF+Hkgsr8xtewoMBrxPwAgYphGDrG/rzSE2vsH8T8AANJqbPqvv7NrTg/u9fA/AEB3So3arb/OnypdBuTwPwAAheTsvKu/IaUsY0TS8D8AwBJAiaGpvxqY4nynwPA/AMACM1iIp7/RNsaDL6/wPwCA1mdecaW/OROgmNud8D8AgGVJilyjv9/nUq+rjPA/AEAVZONJob/7KE4vn3vwPwCA64LAcp6/GY81jLVq8D8AgFJS8VWavyz57KXuWfA/AICBz2I9lr+QLNHNSUnwPwAAqoz7KJK/qa3wxsY48D8AAPkgezGMv6kyeRNlKPA/AACqXTUZhL9Ic+onJBjwPwAA7MIDEni/lbEUBgQI8D8AACR5CQRgvxr6Jvcf4O8/AACQhPPvbz906mHCHKHvPwAAPTVB3Ic/LpmBsBBj7z8AgMLEo86TP82t7jz2Je8/AACJFMGfmz/nE5EDyOnuPwAAEc7YsKE/q7HLeICu7j8AwAHQW4qlP5sMnaIadO4/AIDYQINcqT+1mQqDkTruPwCAV+9qJ60/VppgCeAB7j8AwJjlmHWwP5i7d+UByu0/ACAN4/VTsj8DkXwL8pLtPwAAOIvdLrQ/zlz7Zqxc7T8AwFeHWQa2P53eXqosJ+0/AABqNXbatz/NLGs+bvLsPwBgHE5Dq7k/Anmnom2+7D8AYA27x3i7P20IN20mi+w/ACDnMhNDvT8EWF29lFjsPwBg3nExCr8/jJ+7M7Um7D8AQJErFWfAPz/n7O6D9es/ALCSgoVHwT/Bltt1/cTrPwAwys1uJsI/KEqGDB6V6z8AUMWm1wPDPyw+78XiZes/ABAzPMPfwz+LiMlnSDfrPwCAems2usQ/SjAdIUsJ6z8A8NEoOZPFP37v8oXo2+o/APAYJM1qxj+iPWAxHa/qPwCQZuz4QMc/p1jTP+aC6j8A8Br1wBXIP4tzCe9AV+o/AID2VCnpyD8nS6uQKizqPwBA+AI2u8k/0fKTE6AB6j8AACwc7YvKPxs82ySf1+k/ANABXFFbyz+QsccFJa7pPwDAvMxnKcw/L86X8i6F6T8AYEjVNfbMP3VLpO66XOk/AMBGNL3BzT84SOedxjTpPwDgz7gBjM4/5lJnL08N6T8AkBfACVXPP53X/45S5ug/ALgfEmwO0D98AMyfzr/oPwDQkw64cdA/DsO+2sCZ6D8AcIaea9TQP/sXI6ondOg/ANBLM4c20T8ImrOsAE/oPwBII2cNmNE/VT5l6Ekq6D8AgMzg//jRP2AC9JUBBug/AGhj119Z0j8po+BjJeLnPwCoFAkwudI/rbXcd7O+5z8AYEMQchjTP8Ill2eqm+c/ABjsbSZ30z9XBhfyB3nnPwAwr/tP1dM/DBPW28pW5z8A4C/j7jLUP2u2TwEAEOY/PFtCkWwCfjyVtE0DADDmP0FdAEjqv408eNSUDQBQ5j+3pdaGp3+OPK1vTgcAcOY/TCVUa+r8YTyuD9/+/4/mP/0OWUwnfny8vMVjBwCw5j8B2txIaMGKvPbBXB4A0OY/EZNJnRw/gzw+9gXr/+/mP1Mt4hoEgH68gJeGDgAQ5z9SeQlxZv97PBLpZ/z/L+c/JIe9JuIAjDxqEYHf/0/nP9IB8W6RAm68kJxnDwBw5z90nFTNcfxnvDXIfvr/j+c/gwT1nsG+gTzmwiD+/6/nP2VkzCkXfnC8AMk/7f/P5z8ci3sIcoCAvHYaJun/7+c/rvmdbSjAjTzoo5wEABDoPzNM5VHSf4k8jyyTFwAw6D+B8zC26f6KvJxzMwYAUOg/vDVla7+/iTzGiUIgAHDoP3V7EfNlv4u8BHn16/+P6D9Xyz2ibgCJvN8EvCIAsOg/CkvgON8AfbyKGwzl/8/oPwWf/0ZxAIi8Q46R/P/v6D84cHrQe4GDPMdf+h4AEOk/A7TfdpE+iTy5e0YTADDpP3YCmEtOgH88bwfu5v9P6T8uYv/Z8H6PvNESPN7/b+k/ujgmlqqCcLwNikX0/4/pP++oZJEbgIe8Pi6Y3f+v6T83k1qK4ECHvGb7Se3/z+k/AOCbwQjOPzxRnPEgAPDpPwpbiCeqP4q8BrBFEQAQ6j9W2liZSP90PPr2uwcAMOo/GG0riqu+jDx5HZcQAFDqPzB5eN3K/og8SC71HQBw6j/bq9g9dkGPvFIzWRwAkOo/EnbChAK/jrxLPk8qALDqP18//zwE/Wm80R6u1//P6j+0cJAS5z6CvHgEUe7/7+o/o94O4D4GajxbDWXb/w/rP7kKHzjIBlo8V8qq/v8v6z8dPCN0HgF5vNy6ldn/T+s/nyqGaBD/ebycZZ4kAHDrPz5PhtBF/4o8QBaH+f+P6z/5w8KWd/58PE/LBNL/r+s/xCvy7if/Y7xFXEHS/8/rPyHqO+63/2y83wlj+P/v6z9cCy6XA0GBvFN2teH/D+w/GWq3lGTBizzjV/rx/y/sP+3GMI3v/mS8JOS/3P9P7D91R+y8aD+EvPe5VO3/b+w/7OBT8KN+hDzVj5nr/4/sP/GS+Y0Gg3M8miElIQCw7D8EDhhkjv1ovJxGlN3/z+w/curHHL5+jjx2xP3q/+/sP/6In605vo48K/iaFgAQ7T9xWrmokX11PB33Dw0AMO0/2sdwaZDBiTzED3nq/0/tPwz+WMU3Dli85YfcLgBw7T9ED8FN1oB/vKqC3CEAkO0/XFz9lI98dLyDAmvY/6/tP35hIcUdf4w8OUdsKQDQ7T9Tsf+yngGIPPWQROX/7+0/icxSxtIAbjyU9qvN/w/uP9JpLSBAg3+83chS2/8v7j9kCBvKwQB7PO8WQvL/T+4/UauUsKj/cjwRXoro/2/uP1m+77Fz9le8Df+eEQCQ7j8ByAtejYCEvEQXpd//r+4/tSBD1QYAeDyhfxIaANDuP5JcVmD4AlC8xLy6BwDw7j8R5jVdRECFvAKNevX/D+8/BZHvOTH7T7zHiuUeADDvP1URc/KsgYo8lDSC9f9P7z9Dx9fUQT+KPGtMqfz/b+8/dXiYHPQCYrxBxPnh/4/vP0vnd/TRfXc8fuPg0v+v7z8xo3yaGQFvvJ7kdxwA0O8/sazOS+6BcTwxw+D3/+/vP1qHcAE3BW68bmBl9P8P8D/aChxJrX6KvFh6hvP/L/A/4LL8w2l/l7wXDfz9/0/wP1uUyzT+v5c8gk3NAwBw8D/LVuTAgwCCPOjL8vn/j/A/GnU3vt//bbxl2gwBALDwP+sm5q5/P5G8ONOkAQDQ8D/3n0h5+n2APP392vr/7/A/wGvWcAUEd7yW/boLABDxP2ILbYTUgI48XfTl+v8v8T/vNv1k+r+dPNma1Q0AUPE/rlAScHcAmjyaVSEPAHDxP+7e4+L5/Y08JlQn/P+P8T9zcjvcMACRPFk8PRIAsPE/iAEDgHl/mTy3nin4/8/xP2eMn6sy+WW8ANSK9P/v8T/rW6edv3+TPKSGiwwAEPI/Ilv9kWuAnzwDQ4UDADDyPzO/n+vC/5M8hPa8//9P8j9yLi5+5wF2PNkhKfX/b/I/YQx/drv8fzw8OpMUAJDyPytBAjzKAnK8E2NVFACw8j8CH/IzgoCSvDtS/uv/z/I/8txPOH7/iLyWrbgLAPDyP8VBMFBR/4W8r+J6+/8P8z+dKF6IcQCBvH9frP7/L/M/Fbe3P13/kbxWZ6YMAFDzP72CiyKCf5U8Iff7EQBw8z/M1Q3EugCAPLkvWfn/j/M/UaeyLZ0/lLxC0t0EALDzP+E4dnBrf4U8V8my9f/P8z8xEr8QOgJ6PBi0sOr/7/M/sFKxZm1/mDz0rzIVABD0PySFGV83+Gc8KYtHFwAw9D9DUdxy5gGDPGO0lef/T/Q/WomyuGn/iTzgdQTo/2/0P1TywpuxwJW858Fv7/+P9D9yKjryCUCbPASnvuX/r/Q/RX0Nv7f/lLzeJxAXAND0Pz1q3HFkwJm84j7wDwDw9D8cU4ULiX+XPNFL3BIAEPU/NqRmcWUEYDx6JwUWADD1PwkyI87Ov5a8THDb7P9P9T/XoQUFcgKJvKlUX+//b/U/EmTJDua/mzwSEOYXAJD1P5Dvr4HFfog8kj7JAwCw9T/ADL8KCEGfvLwZSR0A0PU/KUcl+yqBmLyJerjn/+/1PwRp7YC3fpS8/oIrZUcVZ0AAAAAAAAA4QwAA+v5CLna/OjuevJr3DL29/f/////fPzxUVVVVVcU/kSsXz1VVpT8X0KRnERGBPwAAAAAAAMhC7zn6/kIu5j8kxIL/vb/OP7X0DNcIa6w/zFBG0quygz+EOk6b4NdVPwAAAAAAAAAAAAAAAAAA8D9uv4gaTzubPDUz+6k99u8/XdzYnBNgcbxhgHc+muzvP9FmhxB6XpC8hX9u6BXj7z8T9mc1UtKMPHSFFdOw2e8/+o75I4DOi7ze9t0pa9DvP2HI5mFO92A8yJt1GEXH7z+Z0zNb5KOQPIPzxso+vu8/bXuDXaaalzwPiflsWLXvP/zv/ZIatY4890dyK5Ks7z/RnC9wPb4+PKLR0zLso+8/C26QiTQDarwb0/6vZpvvPw69LypSVpW8UVsS0AGT7z9V6k6M74BQvMwxbMC9iu8/FvTVuSPJkbzgLamumoLvP69VXOnj04A8UY6lyJh67z9Ik6XqFRuAvHtRfTy4cu8/PTLeVfAfj7zqjYw4+WrvP79TEz+MiYs8dctv61tj7z8m6xF2nNmWvNRcBITgW+8/YC86PvfsmjyquWgxh1TvP504hsuC54+8Hdn8IlBN7z+Nw6ZEQW+KPNaMYog7Ru8/fQTksAV6gDyW3H2RST/vP5SoqOP9jpY8OGJ1bno47z99SHTyGF6HPD+msk/OMe8/8ucfmCtHgDzdfOJlRSvvP14IcT97uJa8gWP14d8k7z8xqwlt4feCPOHeH/WdHu8/+r9vGpshPbyQ2drQfxjvP7QKDHKCN4s8CwPkpoUS7z+Py86JkhRuPFYvPqmvDO8/tquwTXVNgzwVtzEK/gbvP0x0rOIBQoY8MdhM/HAB7z9K+NNdOd2PPP8WZLII/O4/BFuOO4Cjhrzxn5JfxfbuP2hQS8ztSpK8y6k6N6fx7j+OLVEb+AeZvGbYBW2u7O4/0jaUPujRcbz3n+U02+fuPxUbzrMZGZm85agTwy3j7j9tTCqnSJ+FPCI0Ekym3u4/imkoemASk7wcgKwERdruP1uJF0iPp1i8Ki73IQrW7j8bmklnmyx8vJeoUNn10e4/EazCYO1jQzwtiWFgCM7uP+9kBjsJZpY8VwAd7UHK7j95A6Ha4cxuPNA8wbWixu4/MBIPP47/kzze09fwKsPuP7CvervOkHY8Jyo21dq/7j934FTrvR2TPA3d/ZmyvO4/jqNxADSUj7ynLJ12srnuP0mjk9zM3oe8QmbPotq27j9fOA+9xt54vIJPnVYrtO4/9lx77EYShrwPkl3KpLHuP47X/RgFNZM82ie1Nkev7j8Fm4ovt5h7PP3Hl9QSre4/CVQc4uFjkDwpVEjdB6vuP+rGGVCFxzQ8t0ZZiiap7j81wGQr5jKUPEghrRVvp+4/n3aZYUrkjLwJ3Ha54aXuP6hN7zvFM4y8hVU6sH6k7j+u6SuJeFOEvCDDzDRGo+4/WFhWeN3Ok7wlIlWCOKLuP2QZfoCqEFc8c6lM1FWh7j8oIl6/77OTvM07f2aeoO4/grk0h60Sary/2gt1EqDuP+6pbbjvZ2O8LxplPLKf7j9RiOBUPdyAvISUUfl9n+4/zz5afmQfeLx0X+zodZ/uP7B9i8BK7oa8dIGlSJqf7j+K5lUeMhmGvMlnQlbrn+4/09QJXsuckDw/Xd5PaaDuPx2lTbncMnu8hwHrcxSh7j9rwGdU/eyUPDLBMAHtoe4/VWzWq+HrZTxiTs8286LuP0LPsy/FoYi8Eho+VCek7j80NzvxtmmTvBPOTJmJpe4/Hv8ZOoRegLytxyNGGqfuP25XcthQ1JS87ZJEm9mo7j8Aig5bZ62QPJlmitnHqu4/tOrwwS+3jTzboCpC5azuP//nxZxgtmW8jES1FjKv7j9EX/NZg/Z7PDZ3FZmuse4/gz0epx8Jk7zG/5ELW7TuPykebIu4qV285cXNsDe37j9ZuZB8+SNsvA9SyMtEuu4/qvn0IkNDkrxQTt6fgr3uP0uOZtdsyoW8ugfKcPHA7j8nzpEr/K9xPJDwo4KRxO4/u3MK4TXSbTwjI+MZY8juP2MiYiIExYe8ZeVde2bM7j/VMeLjhhyLPDMtSuyb0O4/Fbu809G7kbxdJT6yA9XuP9Ix7pwxzJA8WLMwE57Z7j+zWnNuhGmEPL/9eVVr3u4/tJ2Ol83fgrx689O/a+PuP4czy5J3Gow8rdNamZ/o7j/62dFKj3uQvGa2jSkH7u4/uq7cVtnDVbz7FU+4ovPuP0D2pj0OpJC8OlnljXL57j80k6049NZovEde+/J2/+4/NYpYa+LukbxKBqEwsAXvP83dXwrX/3Q80sFLkB4M7z+smJL6+72RvAke11vCEu8/swyvMK5uczycUoXdmxnvP5T9n1wy4448etD/X6sg7z+sWQnRj+CEPEvRVy7xJ+8/ZxpOOK/NYzy15waUbS/vP2gZkmwsa2c8aZDv3CA37z/StcyDGIqAvPrDXVULP+8/b/r/P12tj7x8iQdKLUfvP0mpdTiuDZC88okNCIdP7z+nBz2mhaN0PIek+9wYWO8/DyJAIJ6RgryYg8kW42DvP6ySwdVQWo48hTLbA+Zp7z9LawGsWTqEPGC0AfMhc+8/Hz60ByHVgrxfm3szl3zvP8kNRzu5Kom8KaH1FEaG7z/TiDpgBLZ0PPY/i+cukO8/cXKdUezFgzyDTMf7UZrvP/CR048S94+82pCkoq+k7z99dCPimK6NvPFnji1Ir+8/CCCqQbzDjjwnWmHuG7rvPzLrqcOUK4Q8l7prNyvF7z/uhdExqWSKPEBFblt20O8/7eM75Lo3jrwUvpyt/dvvP53NkU07iXc82JCegcHn7z+JzGBBwQVTPPFxjyvC8+8/ADj6/kIu5j8wZ8eTV/MuPQAAAAAAAOC/YFVVVVVV5b8GAAAAAADgP05VWZmZmek/eqQpVVVV5b/pRUibW0nyv8M/JosrAPA/AAAAAACg9j8AAAAAAAAAAADIufKCLNa/gFY3KCS0+jwAAAAAAID2PwAAAAAAAAAAAAhYv73R1b8g9+DYCKUcvQAAAAAAYPY/AAAAAAAAAAAAWEUXd3bVv21QttWkYiO9AAAAAABA9j8AAAAAAAAAAAD4LYetGtW/1WewnuSE5rwAAAAAACD2PwAAAAAAAAAAAHh3lV++1L/gPimTaRsEvQAAAAAAAPY/AAAAAAAAAAAAYBzCi2HUv8yETEgv2BM9AAAAAADg9T8AAAAAAAAAAACohoYwBNS/OguC7fNC3DwAAAAAAMD1PwAAAAAAAAAAAEhpVUym079glFGGxrEgPQAAAAAAoPU/AAAAAAAAAAAAgJia3UfTv5KAxdRNWSU9AAAAAACA9T8AAAAAAAAAAAAg4bri6NK/2Cu3mR57Jj0AAAAAAGD1PwAAAAAAAAAAAIjeE1qJ0r8/sM+2FMoVPQAAAAAAYPU/AAAAAAAAAAAAiN4TWonSvz+wz7YUyhU9AAAAAABA9T8AAAAAAAAAAAB4z/tBKdK/dtpTKCRaFr0AAAAAACD1PwAAAAAAAAAAAJhpwZjI0b8EVOdovK8fvQAAAAAAAPU/AAAAAAAAAAAAqKurXGfRv/CogjPGHx89AAAAAADg9D8AAAAAAAAAAABIrvmLBdG/ZloF/cSoJr0AAAAAAMD0PwAAAAAAAAAAAJBz4iSj0L8OA/R+7msMvQAAAAAAoPQ/AAAAAAAAAAAA0LSUJUDQv38t9J64NvC8AAAAAACg9D8AAAAAAAAAAADQtJQlQNC/fy30nrg28LwAAAAAAID0PwAAAAAAAAAAAEBebRi5z7+HPJmrKlcNPQAAAAAAYPQ/AAAAAAAAAAAAYNzLrfDOvySvhpy3Jis9AAAAAABA9D8AAAAAAAAAAADwKm4HJ86/EP8/VE8vF70AAAAAACD0PwAAAAAAAAAAAMBPayFczb8baMq7kbohPQAAAAAAAPQ/AAAAAAAAAAAAoJrH94/MvzSEn2hPeSc9AAAAAAAA9D8AAAAAAAAAAACgmsf3j8y/NISfaE95Jz0AAAAAAODzPwAAAAAAAAAAAJAtdIbCy7+Pt4sxsE4ZPQAAAAAAwPM/AAAAAAAAAAAAwIBOyfPKv2aQzT9jTro8AAAAAACg8z8AAAAAAAAAAACw4h+8I8q/6sFG3GSMJb0AAAAAAKDzPwAAAAAAAAAAALDiH7wjyr/qwUbcZIwlvQAAAAAAgPM/AAAAAAAAAAAAUPScWlLJv+PUwQTZ0Sq9AAAAAABg8z8AAAAAAAAAAADQIGWgf8i/Cfrbf7+9Kz0AAAAAAEDzPwAAAAAAAAAAAOAQAomrx79YSlNykNsrPQAAAAAAQPM/AAAAAAAAAAAA4BACiavHv1hKU3KQ2ys9AAAAAAAg8z8AAAAAAAAAAADQGecP1sa/ZuKyo2rkEL0AAAAAAADzPwAAAAAAAAAAAJCncDD/xb85UBCfQ54evQAAAAAAAPM/AAAAAAAAAAAAkKdwMP/FvzlQEJ9Dnh69AAAAAADg8j8AAAAAAAAAAACwoePlJsW/j1sHkIveIL0AAAAAAMDyPwAAAAAAAAAAAIDLbCtNxL88eDVhwQwXPQAAAAAAwPI/AAAAAAAAAAAAgMtsK03Evzx4NWHBDBc9AAAAAACg8j8AAAAAAAAAAACQHiD8ccO/OlQnTYZ48TwAAAAAAIDyPwAAAAAAAAAAAPAf+FKVwr8IxHEXMI0kvQAAAAAAYPI/AAAAAAAAAAAAYC/VKrfBv5ajERikgC69AAAAAABg8j8AAAAAAAAAAABgL9Uqt8G/lqMRGKSALr0AAAAAAEDyPwAAAAAAAAAAAJDQfH7XwL/0W+iIlmkKPQAAAAAAQPI/AAAAAAAAAAAAkNB8ftfAv/Rb6IiWaQo9AAAAAAAg8j8AAAAAAAAAAADg2zGR7L+/8jOjXFR1Jb0AAAAAAADyPwAAAAAAAAAAAAArbgcnvr88APAqLDQqPQAAAAAAAPI/AAAAAAAAAAAAACtuBye+vzwA8CosNCo9AAAAAADg8T8AAAAAAAAAAADAW49UXry/Br5fWFcMHb0AAAAAAMDxPwAAAAAAAAAAAOBKOm2Sur/IqlvoNTklPQAAAAAAwPE/AAAAAAAAAAAA4Eo6bZK6v8iqW+g1OSU9AAAAAACg8T8AAAAAAAAAAACgMdZFw7i/aFYvTSl8Ez0AAAAAAKDxPwAAAAAAAAAAAKAx1kXDuL9oVi9NKXwTPQAAAAAAgPE/AAAAAAAAAAAAYOWK0vC2v9pzM8k3lya9AAAAAABg8T8AAAAAAAAAAAAgBj8HG7W/V17GYVsCHz0AAAAAAGDxPwAAAAAAAAAAACAGPwcbtb9XXsZhWwIfPQAAAAAAQPE/AAAAAAAAAAAA4BuW10Gzv98T+czaXiw9AAAAAABA8T8AAAAAAAAAAADgG5bXQbO/3xP5zNpeLD0AAAAAACDxPwAAAAAAAAAAAICj7jZlsb8Jo492XnwUPQAAAAAAAPE/AAAAAAAAAAAAgBHAMAqvv5GONoOeWS09AAAAAAAA8T8AAAAAAAAAAACAEcAwCq+/kY42g55ZLT0AAAAAAODwPwAAAAAAAAAAAIAZcd1Cq79McNbleoIcPQAAAAAA4PA/AAAAAAAAAAAAgBlx3UKrv0xw1uV6ghw9AAAAAADA8D8AAAAAAAAAAADAMvZYdKe/7qHyNEb8LL0AAAAAAMDwPwAAAAAAAAAAAMAy9lh0p7/uofI0RvwsvQAAAAAAoPA/AAAAAAAAAAAAwP65h56jv6r+JvW3AvU8AAAAAACg8D8AAAAAAAAAAADA/rmHnqO/qv4m9bcC9TwAAAAAAIDwPwAAAAAAAAAAAAB4DpuCn7/kCX58JoApvQAAAAAAgPA/AAAAAAAAAAAAAHgOm4Kfv+QJfnwmgCm9AAAAAABg8D8AAAAAAAAAAACA1QcbuZe/Oab6k1SNKL0AAAAAAEDwPwAAAAAAAAAAAAD8sKjAj7+cptP2fB7fvAAAAAAAQPA/AAAAAAAAAAAAAPywqMCPv5ym0/Z8Ht+8AAAAAAAg8D8AAAAAAAAAAAAAEGsq4H+/5EDaDT/iGb0AAAAAACDwPwAAAAAAAAAAAAAQayrgf7/kQNoNP+IZvQAAAAAAAPA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDvPwAAAAAAAAAAAACJdRUQgD/oK52Za8cQvQAAAAAAgO8/AAAAAAAAAAAAgJNYViCQP9L34gZb3CO9AAAAAABA7z8AAAAAAAAAAAAAySglSZg/NAxaMrqgKr0AAAAAAADvPwAAAAAAAAAAAEDniV1BoD9T1/FcwBEBPQAAAAAAwO4/AAAAAAAAAAAAAC7UrmakPyj9vXVzFiy9AAAAAACA7j8AAAAAAAAAAADAnxSqlKg/fSZa0JV5Gb0AAAAAAEDuPwAAAAAAAAAAAMDdzXPLrD8HKNhH8mgavQAAAAAAIO4/AAAAAAAAAAAAwAbAMequP3s7yU8+EQ69AAAAAADg7T8AAAAAAAAAAABgRtE7l7E/m54NVl0yJb0AAAAAAKDtPwAAAAAAAAAAAODRp/W9sz/XTtulXsgsPQAAAAAAYO0/AAAAAAAAAAAAoJdNWum1Px4dXTwGaSy9AAAAAABA7T8AAAAAAAAAAADA6grTALc/Mu2dqY0e7DwAAAAAAADtPwAAAAAAAAAAAEBZXV4zuT/aR706XBEjPQAAAAAAwOw/AAAAAAAAAAAAYK2NyGq7P+Vo9yuAkBO9AAAAAACg7D8AAAAAAAAAAABAvAFYiLw/06xaxtFGJj0AAAAAAGDsPwAAAAAAAAAAACAKgznHvj/gReavaMAtvQAAAAAAQOw/AAAAAAAAAAAA4Ns5kei/P/0KoU/WNCW9AAAAAAAA7D8AAAAAAAAAAADgJ4KOF8E/8gctznjvIT0AAAAAAODrPwAAAAAAAAAAAPAjfiuqwT80mThEjqcsPQAAAAAAoOs/AAAAAAAAAAAAgIYMYdHCP6G0gctsnQM9AAAAAACA6z8AAAAAAAAAAACQFbD8ZcM/iXJLI6gvxjwAAAAAAEDrPwAAAAAAAAAAALAzgz2RxD94tv1UeYMlPQAAAAAAIOs/AAAAAAAAAAAAsKHk5SfFP8d9aeXoMyY9AAAAAADg6j8AAAAAAAAAAAAQjL5OV8Y/eC48LIvPGT0AAAAAAMDqPwAAAAAAAAAAAHB1ixLwxj/hIZzljRElvQAAAAAAoOo/AAAAAAAAAAAAUESFjYnHPwVDkXAQZhy9AAAAAABg6j8AAAAAAAAAAAAAOeuvvsg/0SzpqlQ9B70AAAAAAEDqPwAAAAAAAAAAAAD33FpayT9v/6BYKPIHPQAAAAAAAOo/AAAAAAAAAAAA4Io87ZPKP2khVlBDcii9AAAAAADg6T8AAAAAAAAAAADQW1fYMcs/quGsTo01DL0AAAAAAMDpPwAAAAAAAAAAAOA7OIfQyz+2ElRZxEstvQAAAAAAoOk/AAAAAAAAAAAAEPDG+2/MP9IrlsVy7PG8AAAAAABg6T8AAAAAAAAAAACQ1LA9sc0/NbAV9yr/Kr0AAAAAAEDpPwAAAAAAAAAAABDn/w5Tzj8w9EFgJxLCPAAAAAAAIOk/AAAAAAAAAAAAAN3krfXOPxGOu2UVIcq8AAAAAAAA6T8AAAAAAAAAAACws2wcmc8/MN8MyuzLGz0AAAAAAMDoPwAAAAAAAAAAAFhNYDhx0D+RTu0W25z4PAAAAAAAoOg/AAAAAAAAAAAAYGFnLcTQP+nqPBaLGCc9AAAAAACA6D8AAAAAAAAAAADoJ4KOF9E/HPClYw4hLL0AAAAAAGDoPwAAAAAAAAAAAPisy1xr0T+BFqX3zZorPQAAAAAAQOg/AAAAAAAAAAAAaFpjmb/RP7e9R1Htpiw9AAAAAAAg6D8AAAAAAAAAAAC4Dm1FFNI/6rpGut6HCj0AAAAAAODnPwAAAAAAAAAAAJDcfPC+0j/0BFBK+pwqPQAAAAAAwOc/AAAAAAAAAAAAYNPh8RTTP7g8IdN64ii9AAAAAACg5z8AAAAAAAAAAAAQvnZna9M/yHfxsM1uET0AAAAAAIDnPwAAAAAAAAAAADAzd1LC0z9cvQa2VDsYPQAAAAAAYOc/AAAAAAAAAAAA6NUjtBnUP53gkOw25Ag9AAAAAABA5z8AAAAAAAAAAADIccKNcdQ/ddZnCc4nL70AAAAAACDnPwAAAAAAAAAAADAXnuDJ1D+k2AobiSAuvQAAAAAAAOc/AAAAAAAAAAAAoDgHriLVP1nHZIFwvi49AAAAAADg5j8AAAAAAAAAAADQyFP3e9U/70Bd7u2tHz0AAAAAAMDmPwAAAAAAAAAAAGBZ373V1T/cZaQIKgsKvchkAAAAAAAAAAAAAAAAAADRdJ4AV529KoBwUg///z4nCgAAAGQAAADoAwAAECcAAKCGAQBAQg8AgJaYAADh9QUYAAAANQAAAHEAAABr////zvv//5K///8AQbDGAQuwBAoAAAAAAAAAGYn07jBq1AFLAAAAAAAAAAAAAAAAAAAAYAAAAGEAAABiAAAAYwAAAGQAAABlAAAAZgAAAGcAAABoAAAAaQAAAGoAAABrAAAAbAAAAG0AAABuAAAAbwAAAHAAAABxAAAAcgAAAHMAAAB0AAAAdQAAAHYAAAB3AAAAeAAAAHkAAAB6AAAAewAAAHwAAAB9AAAAfgAAAH8AAACAAAAAgQAAAIIAAACDAAAAhAAAAIUAAACGAAAAhwAAAIgAAACJAAAAigAAAIsAAACMAAAAjQAAAI4AAACPAAAAkAAAAJEAAACSAAAAkwAAAJQAAACVAAAAlgAAAJcAAACYAAAAmQAAAJoAAACbAAAAnAAAAJ0AAACeAAAAnwAAAKAAAAChAAAAogAAAKMAAACkAAAApQAAAKYAAACnAAAAqAAAAKkAAACqAAAAqwAAAKwAAACtAAAArgAAAK8AAACwAAAAsQAAALIAAACzAAAAtAAAALUAAAC2AAAAtwAAALgAAAC5AAAAugAAALsAAAC8AAAAYAAAAAUAAAAAAAAAAAAAAMcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMgAAADJAAAAcHQAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMhkAABgdgEAAEHgygELnQgodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaFNhdmUpIE1vZHVsZS5mbGFzaFNhdmUoSEVBUFU4LnNsaWNlKHN0YXJ0LCBzdGFydCArIHNpemUpKTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAA0u+AgAAEbmFtZQHibukFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwxzdG9wX3Byb2dyYW1oD2RldnNtZ3JfcmVzdGFydGkUZGV2c21ncl9kZXBsb3lfc3RhcnRqFGRldnNtZ3JfZGVwbG95X3dyaXRlaxBkZXZzbWdyX2dldF9oYXNobBVkZXZzbWdyX2hhbmRsZV9wYWNrZXRtDmRlcGxveV9oYW5kbGVybhNkZXBsb3lfbWV0YV9oYW5kbGVybw9kZXZzbWdyX2dldF9jdHhwDmRldnNtZ3JfZGVwbG95cQxkZXZzbWdyX2luaXRyEWRldnNtZ3JfY2xpZW50X2V2cxBkZXZzX2ZpYmVyX3lpZWxkdBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb251GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXYQZGV2c19maWJlcl9zbGVlcHcbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3kRZGV2c19pbWdfZnVuX25hbWV6EmRldnNfaW1nX3JvbGVfbmFtZXsSZGV2c19maWJlcl9ieV9maWR4fBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBCmRldnNfcGFuaWOCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARNqZF9nY19hbnlfdHJ5X2FsbG9jhQEHZGV2c19nY4YBD2ZpbmRfZnJlZV9ibG9ja4cBEmRldnNfYW55X3RyeV9hbGxvY4gBDmRldnNfdHJ5X2FsbG9jiQELamRfZ2NfdW5waW6KAQpqZF9nY19mcmVliwEUZGV2c192YWx1ZV9pc19waW5uZWSMAQ5kZXZzX3ZhbHVlX3Bpbo0BEGRldnNfdmFsdWVfdW5waW6OARJkZXZzX21hcF90cnlfYWxsb2OPARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OQARRkZXZzX2FycmF5X3RyeV9hbGxvY5EBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5IBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5MBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lAEPZGV2c19nY19zZXRfY3R4lQEOZGV2c19nY19jcmVhdGWWAQ9kZXZzX2djX2Rlc3Ryb3mXARFkZXZzX2djX29ial92YWxpZJgBC3NjYW5fZ2Nfb2JqmQERcHJvcF9BcnJheV9sZW5ndGiaARJtZXRoMl9BcnJheV9pbnNlcnSbARJmdW4xX0FycmF5X2lzQXJyYXmcARBtZXRoWF9BcnJheV9wdXNonQEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlngERbWV0aFhfQXJyYXlfc2xpY2WfARFmdW4xX0J1ZmZlcl9hbGxvY6ABEnByb3BfQnVmZmVyX2xlbmd0aKEBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ6IBE21ldGgzX0J1ZmZlcl9maWxsQXSjARNtZXRoNF9CdWZmZXJfYmxpdEF0pAEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc6UBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6YBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKcBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKgBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50qQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdKoBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50qwEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKsARRtZXRoMV9FcnJvcl9fX2N0b3JfX60BGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+uARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+vARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7ABD3Byb3BfRXJyb3JfbmFtZbEBEW1ldGgwX0Vycm9yX3ByaW50sgEUbWV0aFhfRnVuY3Rpb25fc3RhcnSzARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbQBEnByb3BfRnVuY3Rpb25fbmFtZbUBD2Z1bjJfSlNPTl9wYXJzZbYBE2Z1bjNfSlNPTl9zdHJpbmdpZnm3AQ5mdW4xX01hdGhfY2VpbLgBD2Z1bjFfTWF0aF9mbG9vcrkBD2Z1bjFfTWF0aF9yb3VuZLoBDWZ1bjFfTWF0aF9hYnO7ARBmdW4wX01hdGhfcmFuZG9tvAETZnVuMV9NYXRoX3JhbmRvbUludL0BDWZ1bjFfTWF0aF9sb2e+AQ1mdW4yX01hdGhfcG93vwEOZnVuMl9NYXRoX2lkaXbAAQ5mdW4yX01hdGhfaW1vZMEBDmZ1bjJfTWF0aF9pbXVswgENZnVuMl9NYXRoX21pbsMBC2Z1bjJfbWlubWF4xAENZnVuMl9NYXRoX21heMUBEmZ1bjJfT2JqZWN0X2Fzc2lnbsYBEGZ1bjFfT2JqZWN0X2tleXPHARNmdW4xX2tleXNfb3JfdmFsdWVzyAESZnVuMV9PYmplY3RfdmFsdWVzyQEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bKARBwcm9wX1BhY2tldF9yb2xlywEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcswBE3Byb3BfUGFja2V0X3Nob3J0SWTNARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjOARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZM8BEXByb3BfUGFja2V0X2ZsYWdz0AEVcHJvcF9QYWNrZXRfaXNDb21tYW5k0QEUcHJvcF9QYWNrZXRfaXNSZXBvcnTSARNwcm9wX1BhY2tldF9wYXlsb2Fk0wETcHJvcF9QYWNrZXRfaXNFdmVudNQBFXByb3BfUGFja2V0X2V2ZW50Q29kZdUBFHByb3BfUGFja2V0X2lzUmVnU2V01gEUcHJvcF9QYWNrZXRfaXNSZWdHZXTXARNwcm9wX1BhY2tldF9yZWdDb2Rl2AETbWV0aDBfUGFja2V0X2RlY29kZdkBEmRldnNfcGFja2V0X2RlY29kZdoBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZNsBFERzUmVnaXN0ZXJfcmVhZF9jb2503AESZGV2c19wYWNrZXRfZW5jb2Rl3QEWbWV0aFhfRHNSZWdpc3Rlcl93cml0Zd4BFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXfARZwcm9wX0RzUGFja2V0SW5mb19uYW1l4AEWcHJvcF9Ec1BhY2tldEluZm9fY29kZeEBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX+IBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVk4wEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k5AERbWV0aDBfRHNSb2xlX3dhaXTlARJwcm9wX1N0cmluZ19sZW5ndGjmARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdOcBE21ldGgxX1N0cmluZ19jaGFyQXToARJtZXRoMl9TdHJpbmdfc2xpY2XpARRkZXZzX2pkX2dldF9yZWdpc3RlcuoBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTrARBkZXZzX2pkX3NlbmRfY21k7AERZGV2c19qZF93YWtlX3JvbGXtARRkZXZzX2pkX3Jlc2V0X3BhY2tldO4BE2RldnNfamRfcGt0X2NhcHR1cmXvARNkZXZzX2pkX3NlbmRfbG9nbXNn8AESZGV2c19qZF9zaG91bGRfcnVu8QEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXyARNkZXZzX2pkX3Byb2Nlc3NfcGt08wEUZGV2c19qZF9yb2xlX2NoYW5nZWT0ARJkZXZzX2pkX2luaXRfcm9sZXP1ARJkZXZzX2pkX2ZyZWVfcm9sZXP2ARVkZXZzX3NldF9nbG9iYWxfZmxhZ3P3ARdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc/gBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc/kBEGRldnNfanNvbl9lc2NhcGX6ARVkZXZzX2pzb25fZXNjYXBlX2NvcmX7AQ9kZXZzX2pzb25fcGFyc2X8AQpqc29uX3ZhbHVl/QEMcGFyc2Vfc3RyaW5n/gENc3RyaW5naWZ5X29iav8BCmFkZF9pbmRlbnSAAg9zdHJpbmdpZnlfZmllbGSBAhNkZXZzX2pzb25fc3RyaW5naWZ5ggIRcGFyc2Vfc3RyaW5nX2NvcmWDAhFkZXZzX21hcGxpa2VfaXRlcoQCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0hQISZGV2c19tYXBfY29weV9pbnRvhgIMZGV2c19tYXBfc2V0hwIGbG9va3VwiAITZGV2c19tYXBsaWtlX2lzX21hcIkCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc4oCEWRldnNfYXJyYXlfaW5zZXJ0iwIIa3ZfYWRkLjGMAhJkZXZzX3Nob3J0X21hcF9zZXSNAg9kZXZzX21hcF9kZWxldGWOAhJkZXZzX3Nob3J0X21hcF9nZXSPAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJACDmRldnNfcm9sZV9zcGVjkQISZGV2c19mdW5jdGlvbl9iaW5kkgIRZGV2c19tYWtlX2Nsb3N1cmWTAg5kZXZzX2dldF9mbmlkeJQCE2RldnNfZ2V0X2ZuaWR4X2NvcmWVAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSWAhNkZXZzX2dldF9yb2xlX3Byb3RvlwIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3mAIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkmQIVZGV2c19nZXRfc3RhdGljX3Byb3RvmgIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvmwIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2cAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvnQIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkngIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5knwIQZGV2c19pbnN0YW5jZV9vZqACD2RldnNfb2JqZWN0X2dldKECDGRldnNfc2VxX2dldKICDGRldnNfYW55X2dldKMCDGRldnNfYW55X3NldKQCDGRldnNfc2VxX3NldKUCDmRldnNfYXJyYXlfc2V0pgITZGV2c19hcnJheV9waW5fcHVzaKcCDGRldnNfYXJnX2ludKgCD2RldnNfYXJnX2RvdWJsZakCD2RldnNfcmV0X2RvdWJsZaoCDGRldnNfcmV0X2ludKsCDWRldnNfcmV0X2Jvb2ysAg9kZXZzX3JldF9nY19wdHKtAhFkZXZzX2FyZ19zZWxmX21hcK4CEWRldnNfc2V0dXBfcmVzdW1lrwIPZGV2c19jYW5fYXR0YWNosAIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZbECFWRldnNfbWFwbGlrZV90b192YWx1ZbICEmRldnNfcmVnY2FjaGVfZnJlZbMCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGy0AhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZLUCE2RldnNfcmVnY2FjaGVfYWxsb2O2AhRkZXZzX3JlZ2NhY2hlX2xvb2t1cLcCEWRldnNfcmVnY2FjaGVfYWdluAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGW5AhJkZXZzX3JlZ2NhY2hlX25leHS6Ag9qZF9zZXR0aW5nc19nZXS7Ag9qZF9zZXR0aW5nc19zZXS8Ag5kZXZzX2xvZ192YWx1Zb0CD2RldnNfc2hvd192YWx1Zb4CEGRldnNfc2hvd192YWx1ZTC/Ag1jb25zdW1lX2NodW5rwAINc2hhXzI1Nl9jbG9zZcECD2pkX3NoYTI1Nl9zZXR1cMICEGpkX3NoYTI1Nl91cGRhdGXDAhBqZF9zaGEyNTZfZmluaXNoxAIUamRfc2hhMjU2X2htYWNfc2V0dXDFAhVqZF9zaGEyNTZfaG1hY19maW5pc2jGAg5qZF9zaGEyNTZfaGtkZscCDmRldnNfc3RyZm9ybWF0yAIOZGV2c19pc19zdHJpbmfJAg5kZXZzX2lzX251bWJlcsoCFGRldnNfc3RyaW5nX2dldF91dGY4ywITZGV2c19idWlsdGluX3N0cmluZ8wCFGRldnNfc3RyaW5nX3ZzcHJpbnRmzQITZGV2c19zdHJpbmdfc3ByaW50Zs4CFWRldnNfc3RyaW5nX2Zyb21fdXRmOM8CFGRldnNfdmFsdWVfdG9fc3RyaW5n0AIQYnVmZmVyX3RvX3N0cmluZ9ECGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTSAhJkZXZzX3N0cmluZ19jb25jYXTTAhFkZXZzX3N0cmluZ19zbGljZdQCEmRldnNfcHVzaF90cnlmcmFtZdUCEWRldnNfcG9wX3RyeWZyYW1l1gIPZGV2c19kdW1wX3N0YWNr1wITZGV2c19kdW1wX2V4Y2VwdGlvbtgCCmRldnNfdGhyb3fZAhJkZXZzX3Byb2Nlc3NfdGhyb3faAhBkZXZzX2FsbG9jX2Vycm9y2wIVZGV2c190aHJvd190eXBlX2Vycm9y3AIWZGV2c190aHJvd19yYW5nZV9lcnJvct0CHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvct4CGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y3wIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh04AIYZGV2c190aHJvd190b29fYmlnX2Vycm9y4QIXZGV2c190aHJvd19zeW50YXhfZXJyb3LiAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl4wITZGV2c192YWx1ZV9mcm9tX2ludOQCFGRldnNfdmFsdWVfZnJvbV9ib29s5QIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLmAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZecCEWRldnNfdmFsdWVfdG9faW506AISZGV2c192YWx1ZV90b19ib29s6QIOZGV2c19pc19idWZmZXLqAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZesCEGRldnNfYnVmZmVyX2RhdGHsAhNkZXZzX2J1ZmZlcmlzaF9kYXRh7QIUZGV2c192YWx1ZV90b19nY19vYmruAg1kZXZzX2lzX2FycmF57wIRZGV2c192YWx1ZV90eXBlb2bwAg9kZXZzX2lzX251bGxpc2jxAhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk8gIUZGV2c192YWx1ZV9hcHByb3hfZXHzAhJkZXZzX3ZhbHVlX2llZWVfZXH0Ah5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP1AhJkZXZzX2ltZ19zdHJpZHhfb2v2AhJkZXZzX2R1bXBfdmVyc2lvbnP3AgtkZXZzX3ZlcmlmefgCEWRldnNfZmV0Y2hfb3Bjb2Rl+QIOZGV2c192bV9yZXN1bWX6AhFkZXZzX3ZtX3NldF9kZWJ1Z/sCGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHP8AhhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnT9Ag9kZXZzX3ZtX3N1c3BlbmT+AhZkZXZzX3ZtX3NldF9icmVha3BvaW50/wIUZGV2c192bV9leGVjX29wY29kZXOAAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIEDEWRldnNfaW1nX2dldF91dGY4ggMUZGV2c19nZXRfc3RhdGljX3V0ZjiDAw9kZXZzX3ZtX3JvbGVfb2uEAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIUDDGV4cHJfaW52YWxpZIYDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0hwMLc3RtdDFfY2FsbDCIAwtzdG10Ml9jYWxsMYkDC3N0bXQzX2NhbGwyigMLc3RtdDRfY2FsbDOLAwtzdG10NV9jYWxsNIwDC3N0bXQ2X2NhbGw1jQMLc3RtdDdfY2FsbDaOAwtzdG10OF9jYWxsN48DC3N0bXQ5X2NhbGw4kAMSc3RtdDJfaW5kZXhfZGVsZXRlkQMMc3RtdDFfcmV0dXJukgMJc3RtdHhfam1wkwMMc3RtdHgxX2ptcF96lAMKZXhwcjJfYmluZJUDEmV4cHJ4X29iamVjdF9maWVsZJYDEnN0bXR4MV9zdG9yZV9sb2NhbJcDE3N0bXR4MV9zdG9yZV9nbG9iYWyYAxJzdG10NF9zdG9yZV9idWZmZXKZAwlleHByMF9pbmaaAxBleHByeF9sb2FkX2xvY2FsmwMRZXhwcnhfbG9hZF9nbG9iYWycAwtleHByMV91cGx1c50DC2V4cHIyX2luZGV4ngMPc3RtdDNfaW5kZXhfc2V0nwMUZXhwcngxX2J1aWx0aW5fZmllbGSgAxJleHByeDFfYXNjaWlfZmllbGShAxFleHByeDFfdXRmOF9maWVsZKIDEGV4cHJ4X21hdGhfZmllbGSjAw5leHByeF9kc19maWVsZKQDD3N0bXQwX2FsbG9jX21hcKUDEXN0bXQxX2FsbG9jX2FycmF5pgMSc3RtdDFfYWxsb2NfYnVmZmVypwMRZXhwcnhfc3RhdGljX3JvbGWoAxNleHByeF9zdGF0aWNfYnVmZmVyqQMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nqgMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ6sDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ6wDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbq0DDWV4cHJ4X2xpdGVyYWyuAxFleHByeF9saXRlcmFsX2Y2NK8DEGV4cHJ4X3JvbGVfcHJvdG+wAxFleHByM19sb2FkX2J1ZmZlcrEDDWV4cHIwX3JldF92YWyyAwxleHByMV90eXBlb2azAw9leHByMF91bmRlZmluZWS0AxJleHByMV9pc191bmRlZmluZWS1AwpleHByMF90cnVltgMLZXhwcjBfZmFsc2W3Aw1leHByMV90b19ib29suAMJZXhwcjBfbmFuuQMJZXhwcjFfYWJzugMNZXhwcjFfYml0X25vdLsDDGV4cHIxX2lzX25hbrwDCWV4cHIxX25lZ70DCWV4cHIxX25vdL4DDGV4cHIxX3RvX2ludL8DCWV4cHIyX2FkZMADCWV4cHIyX3N1YsEDCWV4cHIyX211bMIDCWV4cHIyX2RpdsMDDWV4cHIyX2JpdF9hbmTEAwxleHByMl9iaXRfb3LFAw1leHByMl9iaXRfeG9yxgMQZXhwcjJfc2hpZnRfbGVmdMcDEWV4cHIyX3NoaWZ0X3JpZ2h0yAMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTJAwhleHByMl9lccoDCGV4cHIyX2xlywMIZXhwcjJfbHTMAwhleHByMl9uZc0DFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcs4DFHN0bXR4Ml9zdG9yZV9jbG9zdXJlzwMTZXhwcngxX2xvYWRfY2xvc3VyZdADEmV4cHJ4X21ha2VfY2xvc3VyZdEDEGV4cHIxX3R5cGVvZl9zdHLSAwxleHByMF9ub3dfbXPTAxZleHByMV9nZXRfZmliZXJfaGFuZGxl1AMQc3RtdDJfY2FsbF9hcnJhedUDCXN0bXR4X3RyedYDDXN0bXR4X2VuZF90cnnXAwtzdG10MF9jYXRjaNgDDXN0bXQwX2ZpbmFsbHnZAwtzdG10MV90aHJvd9oDDnN0bXQxX3JlX3Rocm932wMQc3RtdHgxX3Rocm93X2ptcNwDDnN0bXQwX2RlYnVnZ2Vy3QMJZXhwcjFfbmV33gMRZXhwcjJfaW5zdGFuY2Vfb2bfAwpleHByMF9udWxs4AMPZXhwcjJfYXBwcm94X2Vx4QMPZXhwcjJfYXBwcm94X25l4gMPZGV2c192bV9wb3BfYXJn4wMTZGV2c192bV9wb3BfYXJnX3UzMuQDE2RldnNfdm1fcG9wX2FyZ19pMzLlAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy5gMSamRfYWVzX2NjbV9lbmNyeXB05wMSamRfYWVzX2NjbV9kZWNyeXB06AMMQUVTX2luaXRfY3R46QMPQUVTX0VDQl9lbmNyeXB06gMQamRfYWVzX3NldHVwX2tleesDDmpkX2Flc19lbmNyeXB07AMQamRfYWVzX2NsZWFyX2tlee0DC2pkX3dzc2tfbmV37gMUamRfd3Nza19zZW5kX21lc3NhZ2XvAxNqZF93ZWJzb2NrX29uX2V2ZW508AMHZGVjcnlwdPEDDWpkX3dzc2tfY2xvc2XyAxBqZF93c3NrX29uX2V2ZW508wMLcmVzcF9zdGF0dXP0AxJ3c3NraGVhbHRoX3Byb2Nlc3P1AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZfYDFHdzc2toZWFsdGhfcmVjb25uZWN09wMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0+AMPc2V0X2Nvbm5fc3RyaW5n+QMRY2xlYXJfY29ubl9zdHJpbmf6Aw93c3NraGVhbHRoX2luaXT7AxF3c3NrX3NlbmRfbWVzc2FnZfwDEXdzc2tfaXNfY29ubmVjdGVk/QMSd3Nza19zZXJ2aWNlX3F1ZXJ5/gMUZGV2c190cmFja19leGNlcHRpb27/Axxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplgAQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYEED3JvbGVtZ3JfcHJvY2Vzc4IEEHJvbGVtZ3JfYXV0b2JpbmSDBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSEBBRqZF9yb2xlX21hbmFnZXJfaW5pdIUEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZIYEDWpkX3JvbGVfYWxsb2OHBBBqZF9yb2xlX2ZyZWVfYWxsiAQWamRfcm9sZV9mb3JjZV9hdXRvYmluZIkEE2pkX2NsaWVudF9sb2dfZXZlbnSKBBNqZF9jbGllbnRfc3Vic2NyaWJliwQUamRfY2xpZW50X2VtaXRfZXZlbnSMBBRyb2xlbWdyX3JvbGVfY2hhbmdlZI0EEGpkX2RldmljZV9sb29rdXCOBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WPBBNqZF9zZXJ2aWNlX3NlbmRfY21kkAQRamRfY2xpZW50X3Byb2Nlc3ORBA5qZF9kZXZpY2VfZnJlZZIEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0kwQPamRfZGV2aWNlX2FsbG9jlAQPamRfY3RybF9wcm9jZXNzlQQVamRfY3RybF9oYW5kbGVfcGFja2V0lgQMamRfY3RybF9pbml0lwQUZGNmZ19zZXRfdXNlcl9jb25maWeYBAlkY2ZnX2luaXSZBA1kY2ZnX3ZhbGlkYXRlmgQOZGNmZ19nZXRfZW50cnmbBAxkY2ZnX2dldF9pMzKcBAxkY2ZnX2dldF91MzKdBA9kY2ZnX2dldF9zdHJpbmeeBAxkY2ZnX2lkeF9rZXmfBAlqZF92ZG1lc2egBBFqZF9kbWVzZ19zdGFydHB0cqEEDWpkX2RtZXNnX3JlYWSiBBJqZF9kbWVzZ19yZWFkX2xpbmWjBBNqZF9zZXR0aW5nc19nZXRfYmlupAQNamRfZnN0b3JfaW5pdKUEE2pkX3NldHRpbmdzX3NldF9iaW6mBAtqZF9mc3Rvcl9nY6cED3JlY29tcHV0ZV9jYWNoZagEFWpkX3NldHRpbmdzX2dldF9sYXJnZakEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2WqBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZasEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2WsBA1qZF9pcGlwZV9vcGVurQQWamRfaXBpcGVfaGFuZGxlX3BhY2tldK4EDmpkX2lwaXBlX2Nsb3NlrwQSamRfbnVtZm10X2lzX3ZhbGlksAQVamRfbnVtZm10X3dyaXRlX2Zsb2F0sQQTamRfbnVtZm10X3dyaXRlX2kzMrIEEmpkX251bWZtdF9yZWFkX2kzMrMEFGpkX251bWZtdF9yZWFkX2Zsb2F0tAQRamRfb3BpcGVfb3Blbl9jbWS1BBRqZF9vcGlwZV9vcGVuX3JlcG9ydLYEFmpkX29waXBlX2hhbmRsZV9wYWNrZXS3BBFqZF9vcGlwZV93cml0ZV9leLgEEGpkX29waXBlX3Byb2Nlc3O5BBRqZF9vcGlwZV9jaGVja19zcGFjZboEDmpkX29waXBlX3dyaXRluwQOamRfb3BpcGVfY2xvc2W8BA1qZF9xdWV1ZV9wdXNovQQOamRfcXVldWVfZnJvbnS+BA5qZF9xdWV1ZV9zaGlmdL8EDmpkX3F1ZXVlX2FsbG9jwAQNamRfcmVzcG9uZF91OMEEDmpkX3Jlc3BvbmRfdTE2wgQOamRfcmVzcG9uZF91MzLDBBFqZF9yZXNwb25kX3N0cmluZ8QEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkxQQLamRfc2VuZF9wa3TGBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbMcEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyyAQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldMkEFGpkX2FwcF9oYW5kbGVfcGFja2V0ygQVamRfYXBwX2hhbmRsZV9jb21tYW5kywQVYXBwX2dldF9pbnN0YW5jZV9uYW1lzAQTamRfYWxsb2NhdGVfc2VydmljZc0EEGpkX3NlcnZpY2VzX2luaXTOBA5qZF9yZWZyZXNoX25vd88EGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTQBBRqZF9zZXJ2aWNlc19hbm5vdW5jZdEEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l0gQQamRfc2VydmljZXNfdGlja9MEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ9QEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl1QQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZdYEFGFwcF9nZXRfZGV2aWNlX2NsYXNz1wQSYXBwX2dldF9md192ZXJzaW9u2AQNamRfc3J2Y2ZnX3J1btkEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l2gQRamRfc3J2Y2ZnX3ZhcmlhbnTbBA1qZF9oYXNoX2ZudjFh3AQMamRfZGV2aWNlX2lk3QQJamRfcmFuZG9t3gQIamRfY3JjMTbfBA5qZF9jb21wdXRlX2NyY+AEDmpkX3NoaWZ0X2ZyYW1l4QQMamRfd29yZF9tb3Zl4gQOamRfcmVzZXRfZnJhbWXjBBBqZF9wdXNoX2luX2ZyYW1l5AQNamRfcGFuaWNfY29yZeUEE2pkX3Nob3VsZF9zYW1wbGVfbXPmBBBqZF9zaG91bGRfc2FtcGxl5wQJamRfdG9faGV46AQLamRfZnJvbV9oZXjpBA5qZF9hc3NlcnRfZmFpbOoEB2pkX2F0b2nrBAtqZF92c3ByaW50ZuwED2pkX3ByaW50X2RvdWJsZe0ECmpkX3NwcmludGbuBBJqZF9kZXZpY2Vfc2hvcnRfaWTvBAxqZF9zcHJpbnRmX2HwBAtqZF90b19oZXhfYfEECWpkX3N0cmR1cPIECWpkX21lbWR1cPMEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWX0BBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVl9QQRamRfc2VuZF9ldmVudF9leHT2BApqZF9yeF9pbml09wQUamRfcnhfZnJhbWVfcmVjZWl2ZWT4BB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja/kED2pkX3J4X2dldF9mcmFtZfoEE2pkX3J4X3JlbGVhc2VfZnJhbWX7BBFqZF9zZW5kX2ZyYW1lX3Jhd/wEDWpkX3NlbmRfZnJhbWX9BApqZF90eF9pbml0/gQHamRfc2VuZP8EFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOABQ9qZF90eF9nZXRfZnJhbWWBBRBqZF90eF9mcmFtZV9zZW50ggULamRfdHhfZmx1c2iDBRBfX2Vycm5vX2xvY2F0aW9uhAUMX19mcGNsYXNzaWZ5hQUFZHVtbXmGBQhfX21lbWNweYcFB21lbW1vdmWIBQZtZW1zZXSJBQpfX2xvY2tmaWxligUMX191bmxvY2tmaWxliwUGZmZsdXNojAUEZm1vZI0FDV9fRE9VQkxFX0JJVFOOBQxfX3N0ZGlvX3NlZWuPBQ1fX3N0ZGlvX3dyaXRlkAUNX19zdGRpb19jbG9zZZEFCF9fdG9yZWFkkgUJX190b3dyaXRlkwUJX19md3JpdGV4lAUGZndyaXRllQUUX19wdGhyZWFkX211dGV4X2xvY2uWBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrlwUGX19sb2NrmAUIX191bmxvY2uZBQ5fX21hdGhfZGl2emVyb5oFCmZwX2JhcnJpZXKbBQ5fX21hdGhfaW52YWxpZJwFA2xvZ50FBXRvcDE2ngUFbG9nMTCfBQdfX2xzZWVroAUGbWVtY21woQUKX19vZmxfbG9ja6IFDF9fb2ZsX3VubG9ja6MFDF9fbWF0aF94Zmxvd6QFDGZwX2JhcnJpZXIuMaUFDF9fbWF0aF9vZmxvd6YFDF9fbWF0aF91Zmxvd6cFBGZhYnOoBQNwb3epBQV0b3AxMqoFCnplcm9pbmZuYW6rBQhjaGVja2ludKwFDGZwX2JhcnJpZXIuMq0FCmxvZ19pbmxpbmWuBQpleHBfaW5saW5lrwULc3BlY2lhbGNhc2WwBQ1mcF9mb3JjZV9ldmFssQUFcm91bmSyBQZzdHJjaHKzBQtfX3N0cmNocm51bLQFBnN0cmNtcLUFBnN0cmxlbrYFB19fdWZsb3e3BQdfX3NobGltuAUIX19zaGdldGO5BQdpc3NwYWNlugUGc2NhbGJuuwUJY29weXNpZ25svAUHc2NhbGJubL0FDV9fZnBjbGFzc2lmeWy+BQVmbW9kbL8FBWZhYnNswAULX19mbG9hdHNjYW7BBQhoZXhmbG9hdMIFCGRlY2Zsb2F0wwUHc2NhbmV4cMQFBnN0cnRveMUFBnN0cnRvZMYFEl9fd2FzaV9zeXNjYWxsX3JldMcFCGRsbWFsbG9jyAUGZGxmcmVlyQUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXplygUEc2Jya8sFCF9fYWRkdGYzzAUJX19hc2hsdGkzzQUHX19sZXRmMs4FB19fZ2V0ZjLPBQhfX2RpdnRmM9AFDV9fZXh0ZW5kZGZ0ZjLRBQ1fX2V4dGVuZHNmdGYy0gULX19mbG9hdHNpdGbTBQ1fX2Zsb2F0dW5zaXRm1AUNX19mZV9nZXRyb3VuZNUFEl9fZmVfcmFpc2VfaW5leGFjdNYFCV9fbHNocnRpM9cFCF9fbXVsdGYz2AUIX19tdWx0aTPZBQlfX3Bvd2lkZjLaBQhfX3N1YnRmM9sFDF9fdHJ1bmN0ZmRmMtwFC3NldFRlbXBSZXQw3QULZ2V0VGVtcFJldDDeBQlzdGFja1NhdmXfBQxzdGFja1Jlc3RvcmXgBQpzdGFja0FsbG9j4QUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudOIFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXkBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl5QUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k5gUMZHluQ2FsbF9qaWpp5wUWbGVnYWxzdHViJGR5bkNhbGxfamlqaegFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAeYFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 25952;
var ___stop_em_js = Module['___stop_em_js'] = 27005;



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
