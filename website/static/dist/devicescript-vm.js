
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+KFgIAA4AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAABQICAgADAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEBBQMACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAQEBAQIEBAEKDQICAAAHCQkBAwcBAgAIAAIGAAcJCAQABAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXAB0wHTAQWGgICAAAEBgAKAAgbdgICAAA5/AUHw7gULfwFBAAt/AUEAC38BQQALfwBB8MwBC38AQd/NAQt/AEGpzwELfwBBpdABC38AQaHRAQt/AEHx0QELfwBBktIBC38AQZfUAQt/AEHwzAELfwBBjdUBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MA1QUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAJEFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlANYFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAmQUVZW1zY3JpcHRlbl9zdGFja19pbml0APAFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA8QUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQDyBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA8wUJc3RhY2tTYXZlAOwFDHN0YWNrUmVzdG9yZQDtBQpzdGFja0FsbG9jAO4FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA7wUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlqaQD1BQmbg4CA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QCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQyQQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDCBBogAyAAKAIELQAOOgAKIAMoAhAPC0G4yABBmDtBMUHJNRD3BAAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahD7Ag0AIAMgASkDADcDGAJAAkAgACADQRhqEKYCIgINACADIAEpAwA3AxAgACADQRBqEKUCIQEMAQsCQCAAIAIQpwIiAQ0AQQAhAQwBCwJAIAAgAhCTAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAENYCIANBKGogACAEELwCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBjC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQjgIgAWohAgwBCyAAIAJBAEEAEI4CIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEJ4CIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ8AIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNLDQIgASAFNgIAIAFBBToACgwDCwJAAkAgBA0AQQAhBQwBCyAELQADQQ9xIQULAkAgBUF8ag4GAAICAgIAAgsgASAENgIAIAFB0gA6AAogAyACKQMANwMo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AEEgayIBJAAgASAAKQNQIgc3AwggASAHNwMYAkACQCAAIAFBCGoQ+QJFDQAgASgCGCECDAELIAEgASkDGDcDACABQRBqIABBDyABEOkCQQAhAgsgAiIDLwEIIQJBACEEAkAgAC0AQ0F/aiIFRQ0AIABBABCyAiEECyAEIgRBH3UgAnEgBGoiBEEAIARBAEobIQQgAiEGAkAgBUECSQ0AIAIhBiAAQeAAaikDAFANACAAQQEQsgIhBgsCQCAAIAYiBkEfdSACcSAGaiIGIAIgBiACSBsiAiAEIAIgBCACSBsiBGsiBhCSASICRQ0AIAIoAgwgAygCDCAEQQN0aiAGQQN0EJQFGgsgACACELcCIAFBIGokAAsTACAAIAAgAEEAELICEJMBELcCC4oBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMgAkACQAJAIAEgA0EYahD0Ag0AIAMgAykDIDcDECADQShqIAFBEiADQRBqEOkCDAELIAMgAykDIDcDCCABIANBCGogA0EoahD2AkUNACAAIAMoAigQ7gIMAQsgAEIANwMACyADQTBqJAALnQECAn8BfiMAQTBrIgEkACABIAApA1AiAzcDECABIAM3AyACQAJAIAAgAUEQahD0Ag0AIAEgASkDIDcDCCABQShqIABBEiABQQhqEOkCQQAhAgwBCyABIAEpAyA3AwAgACABIAFBKGoQ9gIhAgsCQCACIgJFDQAgAUEYaiAAIAIgASgCKBDZAiAAKAKsASABKQMYNwMgCyABQTBqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahD1Ag0AIAEgASkDIDcDECABQShqIABByhogAUEQahDqAkEAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEPYCIQILAkAgAiIDRQ0AIABBABCyAiECIABBARCyAiEEIABBAhCyAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQlgUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQ9QINACABIAEpA1A3AzAgAUHYAGogAEHKGiABQTBqEOoCQQAhAgwBCyABIAEpA1A3Aygg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QShqIANBIGoQrgIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEJcCIAMgACkDADcDECABIANBEGoQjwELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQngIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEOkCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8B0MgBTg0CIABBkOMAIAFBA3RqLwEAENYCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQZ0TQZs5QTFB/SoQ9wQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ+wINACABQThqIABBmhkQ6AILIAEgASkDSDcDICABQThqIAAgAUEgahDaAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI4BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqENUCIgJFDQAgAUEwaiAAIAIgASgCOEEBEIYCIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjwEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECELICIQIgASABKQMgNwMIAkAgAUEIahD7Ag0AIAFBGGogAEH0GhDoAgsgASABKQMoNwMAIAFBEGogACABIAJBARCMAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ8QKbELQCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPECnBC0AgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDxAhC/BRC0AgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxDuAgsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQ8QIiBEQAAAAAAAAAAGNFDQAgACAEmhC0AgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABDrBLhEAAAAAAAA8D2iELQCC2QBBX8CQAJAIABBABCyAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEOsEIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQtQILEQAgACAAQQAQswIQqgUQtAILGAAgACAAQQAQswIgAEEBELMCELYFELQCCy4BA38gAEEAELICIQFBACECAkAgAEEBELICIgNFDQAgASADbSECCyAAIAIQtQILLgEDfyAAQQAQsgIhAUEAIQICQCAAQQEQsgIiA0UNACABIANvIQILIAAgAhC1AgsWACAAIABBABCyAiAAQQEQsgJsELUCCwkAIABBARDLAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahDyAiEDIAIgAikDIDcDECAAIAJBEGoQ8gIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEPECIQYgAiACKQMgNwMAIAAgAhDxAiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA/BqNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAEMsBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcD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ICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7gIgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7wIgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEPACIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahD4AiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB4i9BABDmAkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahD6AiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSRJDQAgAEIANwMADwsCQCABIAIQjwIiA0HQ3gBrQQxtQSNLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEPACC/8BAQJ/IAIhAwNAAkAgAyICQdDeAGtBDG0iA0EjSw0AAkAgASADEI8CIgJB0N4Aa0EMbUEjSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhDwAg8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQYnSAEHEN0G8CEGeKBD3BAALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQdDeAGtBDG1BJEkNAQsLIAAgAUEIIAIQ8AILJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBq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zNsBIAEgAGohASADIABrIQICQCAJIABHDQBB1NsBQYjbARDKAkEAQcAANgLM2wFBAEGI2wE2AsjbASACIQMgASEBIAINAQwCC0EAQQAoAsjbASAAajYCyNsBIAIhAyABIQEgAg0ACwsgCBDQAiAIQSAQzwICQCAFRQ0AQQBBACgC0NsBIAVqNgLQ2wEgBSEDIAQhAQNAIAEhASADIQMCQEEAKALM2wEiAEHAAEcNACADQcAASQ0AQdTbASABEMoCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjbASABIAMgACADIABJGyIAEJQFGkEAQQAoAszbASIJIABrNgLM2wEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU2wFBiNsBEMoCQQBBwAA2AszbAUEAQYjbATYCyNsBIAIhAyABIQEgAg0BDAILQQBBACgCyNsBIABqNgLI2wEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALQ2wEgB2o2AtDbASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAszbASIAQcAARw0AIANBwABJDQBB1NsBIAEQygIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCyNsBIAEgAyAAIAMgAEkbIgAQlAUaQQBBACgCzNsBIgkgAGs2AszbASABIABqIQEgAyAAayECAkAgCSAARw0AQdTbAUGI2wEQygJBAEHAADYCzNsBQQBBiNsBNgLI2wEgAiEDIAEhASACDQEMAgtBAEEAKALI2wEgAGo2AsjbASACIQMgASEBIAINAAsLQQBBACgC0NsBQQFqNgLQ2wFBASEDQYXWACEBAkADQCABIQEgAyEDAkBBACgCzNsBIgBBwABHDQAgA0HAAEkNAEHU2wEgARDKAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALI2wEgASADIAAgAyAASRsiABCUBRpBAEEAKALM2wEiCSAAazYCzNsBIAEgAGohASADIABrIQICQCAJIABHDQBB1NsBQYjbARDKAkEAQcAANgLM2wFBAEGI2wE2AsjbASACIQMgASEBIAINAQwCC0EAQQAoAsjbASAAajYCyNsBIAIhAyABIQEgAg0ACwsgCBDQAguuBwIIfwF+IwBBgAFrIggkAAJAIARFDQAgA0EAOgAACyAHIQdBACEJQQAhCgNA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AwtBBSEEDAILQa87QbACQfolEPIEAAtB3wMgAUH//wNxdkEBcUUNASABQQJ0QYjrAGooAgAhBAsgAkEQaiQAIAQPC0GvO0GjAkH6JRDyBAALEQAgACgCBEUgACgCAEEESXELJAEBf0EAIQECQCAAKAIEDQAgACgCACIARSAAQQNGciEBCyABC2sBAn8jAEEQayIDJAACQAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEP4CIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqENMCDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqENMCRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahDVAiECIAMgAykDMDcDCCAAIANBCGogA0E4ahDVAiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEK4FRSEBCyABIQELIAEhBAsgA0HAAGokACAEC1kAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0GAwABBrztB9QJBljUQ9wQAC0GowABBrztB9gJBljUQ9wQAC4wBAQF/QQAhAgJAIAFB//8DSw0AQZQBIQICQAJAAkACQAJAAkAgAUEOdg4EAwUAAQILIAAoAgBBxABqIQJBASEADAMLIAAoAgBBzABqIQJBAyEADAILQfY2QTlBxiIQ8gQACyAAKAIAQdQAaiECQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtuAQJ/IwBBIGsiASQAIAAoAAghABDjBCECIAFBGGogAEH//wNxNgIAIAFBEGogAEEYdjYCACABQRRqIABBEHZB/wFxNgIAIAFBADYCDCABQoaAgIDQADcCBCABIAI2AgBBuzMgARA8IAFBIGokAAuIIQIMfwF+IwBBsARrIgIkAAJAAkACQCAAQQNxDQACQCABQfAATQ0AIAIgADYCqAQC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AQZPDQAgACgCpAEhByACIAVBAWo7AQQgByAFai0AACEHDAELIAFBCGogAEHkABCDAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQeDIASAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCDAQwBCyABIAIgAEHgyAEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQgwEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQ5AILIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQggELIAFBEGokAAskAQF/QQAhAQJAIABBkwFLDQAgAEECdEGw6wBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARCAAw0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBsOsAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRDDBTYCACAFIQEMAgtBuDlBrgJBlscAEPIEAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEIwDIgEhAgJAIAENACADQQhqIABB6AAQgwFBhtYAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIMBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEIADDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARB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NwMIIAAgAiADQQhqEPECEO0CCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ7QMgA0EQaiACEO0DIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCtAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ7QMgAkEgaiABEO0DIAJBGGogARDtAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEK4CIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEO0DIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBCAAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCrAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEO0DIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBCAAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCrAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEO0DIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBCAAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCrAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCAAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwEL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AiADEPECmhDtAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA9hqNwMADAELIABBACACaxDuAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEO0DIAMgAykDCDcDACAAIAIgAxDzAkEBcxDvAiADQRBqJAALDAAgACACEO8DEO4CC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhDtAyACQRhqIgQgAykDODcDACADQThqIAIQ7QMgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEO4CDAELIAMgBSkDADcDMAJAAkAgAiADQTBqENMCDQAgAyAEKQMANwMoIAIgA0EoahDTAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqEN0CDAELIAMgBSkDADcDICACIAIgA0EgahDxAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQ8QIiCDkDACAAIAggAisDIKAQ7QILIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQ7QMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO0DIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhDuAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ8QI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPECIgg5AwAgACACKwMgIAihEO0CCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhDtAyACQRhqIgQgAykDGDcDACADQRhqIAIQ7QMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEO4CDAELIAMgBSkDADcDECACIAIgA0EQahDxAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ8QIiCDkDACAAIAggAisDIKIQ7QILIANBIGokAAvoAQIGfwF8IwBBIGsiAyQAIANBGGogAhDtAyACQRhqIgQgAykDGDcDACADQRhqIAIQ7QMg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RyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ/QJBAXMhAgsgACACEO8CIANBIGokAAs/AQF/AkAgAS0AQiICDQAgACABQewAEIMBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIMBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEPICIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIMBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEPICIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCDAQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQ9AINAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahDTAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahDpAkIAIQUMAQsCQCACQQFxRQ0AIAMgAykDODcDECABIANBEGoQ9QINACADIAMpAzg3AwggA0EwaiABQcoaIANBCGoQ6gJCACEFDAELIAMpAzghBQsgACAFNwMAIANBwABqJAALoAQBBX8CQCAEQfb/A08NACAAEPUDQQBBAToA4NwBQQAgASkAADcA4dwBQQAgAUEFaiIFKQAANwDm3AFBACAEQQh0IARBgP4DcUEIdnI7Ae7cAUEAQQk6AODcAUHg3AEQ9gMCQCAERQ0AQQAhAANAAkAgBCAAIgZrIgBBECAAQRBJGyIHRQ0AIAMgBmohCEEAIQADQCAAIgBB4NwBaiIJIAktAAAgCCAAai0AAHM6AAAgAEEBaiIJIQAgCSAHRw0ACwtB4NwBEPYDIAZBEGoiCSEAIAkgBEkNAAsLIAJBACgC4NwBNgAAQQBBAToA4NwBQQAgASkAADcA4dwBQQAgBSkAADcA5twBQQBBADsB7twBQeDcARD2A0EAIQADQCACIAAi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CmxqIAIgA0H/AXFBCkkiAxsiBCECIAMNAAtBACAEayAEIAFBLUYbC/kKAQt/IwBBwABrIgQkACAAIAFqIQUgBEF/aiEGIARBAXIhByAEQQJyIQggAEEARyEJIAIhASADIQogAiECIAAhAwNAIAMhAyACIQIgCiELIAEiCkEBaiEBAkACQCAKLQAAIgxBJUYNACAMRQ0AIAEhASALIQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEJQFIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEMMFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEEMMFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJA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CyABIABrC0EBAn8jAEEQayIBJABBfyECAkAgABCfBQ0AIAAgAUEPakEBIAAoAiARBQBBAUcNACABLQAPIQILIAFBEGokACACC0cBAn8gACABNwNwIAAgACgCLCAAKAIEIgJrrDcDeCAAKAIIIQMCQCABUA0AIAMgAmusIAFXDQAgAiABp2ohAwsgACADNgJoC90BAgN/An4gACkDeCAAKAIEIgEgACgCLCICa6x8IQQCQAJAAkAgACkDcCIFUA0AIAQgBVkNAQsgABDEBSICQX9KDQEgACgCBCEBIAAoAiwhAgsgAEJ/NwNwIAAgATYCaCAAIAQgAiABa6x8NwN4QX8PCyAEQgF8IQQgACgCBCEBIAAoAgghAwJAIAApA3AiBUIAUQ0AIAUgBH0iBSADIAFrrFkNACABIAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ5QUgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDlBSADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOUFIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDlBSADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ5QUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAENsFRQ0AIAMgBBDLBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDlBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEN0FIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDbBUEASg0AAkAgASAJIAMgChDbBUUNACABIQQMAgsgBUHwAGogASACQgBCABDlBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ5QUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOUFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDlBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ5QUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQg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IAEgBDYCDCABIAA2AggLQQBBACgCoOsBQX9qIgFBfyABGzYCoOsBCwsHAD8AQRB0C1QBAn9BACgC7MwBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAENcFTQ0AIAAQFUUNAQtBACAANgLszAEgAQ8LEJEFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDaBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ2gVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrENoFIAVBMGogCiABIAcQ5AUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDaBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDaBSAFIAIgBEEBIAZrEOQFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDiBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDjBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqENoFQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ2gUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCIC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////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDaBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqENoFIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqENoFIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqENoFQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqENoFIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGENoFIAVBIGogAiAEIAYQ2gUgBUEQaiASIAEgBxDkBSAFIAIgBCAHEOQFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDZBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ2gUgAiAAIARBgfgAIANrEOQFIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABB8O4FJANB8O4BQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEPAAslAQF+IAAgASACrSADrUIghoQgBBD0BSEFIAVCIIinEOoFIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC57NgYAAAwBBgAgLuMABaW5maW5pdHkALUluZmluaXR5AGRldnNfdmVyaWZ5AGRldnNfanNvbl9zdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAHNtYWxsIGhlbGxvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBpc0FjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAHByb2dWZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAY2h1bmsAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAHN6IC0gMSA9PSBzLT5sZW5ndGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaAAhIHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAX2NvbW1hbmRSZXNwb25zZQBmYWxzZQBmbGFzaF9lcmFzZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAHByb2dOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZAAqICBwYz0lZCBAICVzX0YlZAAhICBwYz0lZCBAICVzX0YlZAAhIFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkACogJXMgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkACEgY2FuJ3QgdmFsaWRhdGUgbWZyIGNvbmZpZyBhdCAlcCwgZXJyb3IgJWQAVW5leHBlY3RlZCB0b2tlbiAnJWMnIGluIEpTT04gYXQgcG9zaXRpb24gJWQAZGJnOiBzdXNwZW5kICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNkYmdfcGlwZV9hbGxvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAZmxhc2ggc3luYwBfcGFuaWMAYmFkIG1hZ2ljAGpkX2ZzdG9yX2djAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGZzdG9yOiBnYwBwYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0leCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBkZXZzX2djX3RhZyhkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkgPT0gREVWU19HQ19UQUdfU1RSSU5HADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAKiAgcGM9JWQgQCA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQp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b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAAkfKAgAAEbmFtZQGhcfcFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwxzdG9wX3Byb2dyYW1oD2RldnNtZ3JfcmVzdGFydGkUZGV2c21ncl9kZXBsb3lfc3RhcnRqFGRldnNtZ3JfZGVwbG95X3dyaXRlaxBkZXZzbWdyX2dldF9oYXNobBVkZXZzbWdyX2hhbmRsZV9wYWNrZXRtDmRlcGxveV9oYW5kbGVybhNkZXBsb3lfbWV0YV9oYW5kbGVybw9kZXZzbWdyX2dldF9jdHhwDmRldnNtZ3JfZGVwbG95cQxkZXZzbWdyX2luaXRyEWRldnNtZ3JfY2xpZW50X2V2cxZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dBBkZXZzX2ZpYmVyX3lpZWxkdRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb252GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXcQZGV2c19maWJlcl9zbGVlcHgbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseRpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3oRZGV2c19pbWdfZnVuX25hbWV7EmRldnNfaW1nX3JvbGVfbmFtZXwSZGV2c19maWJlcl9ieV9maWR4fRFkZXZzX2ZpYmVyX2J5X3RhZ34QZGV2c19maWJlcl9zdGFydH8UZGV2c19maWJlcl90ZXJtaWFudGWAAQ5kZXZzX2ZpYmVyX3J1boEBE2RldnNfZmliZXJfc3luY19ub3eCAQpkZXZzX3BhbmljgwEVX2RldnNfaW52YWxpZF9wcm9ncmFthAEPZGV2c19maWJlcl9wb2tlhQEWZGV2c19nY19vYmpfY2hlY2tfY29yZYYBE2pkX2djX2FueV90cnlfYWxsb2OHAQdkZXZzX2djiAEPZmluZF9mcmVlX2Jsb2NriQESZGV2c19hbnlfdHJ5X2FsbG9jigEOZGV2c190cnlfYWxsb2OLAQtqZF9nY191bnBpbowBCmpkX2djX2ZyZWWNARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZI4BDmRldnNfdmFsdWVfcGlujwEQZGV2c192YWx1ZV91bnBpbpABEmRldnNfbWFwX3RyeV9hbGxvY5EBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5IBFGRldnNfYXJyYXlfdHJ5X2FsbG9jkwEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlAEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlQEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSWAQ9kZXZzX2djX3NldF9jdHiXAQ5kZXZzX2djX2NyZWF0ZZgBD2RldnNfZ2NfZGVzdHJveZkBEWRldnNfZ2Nfb2JqX2NoZWNrmgELc2Nhbl9nY19vYmqbARFwcm9wX0FycmF5X2xlbmd0aJwBEm1ldGgyX0FycmF5X2luc2VydJ0BEmZ1bjFfQXJyYXlfaXNBcnJheZ4BEG1ldGhYX0FycmF5X3B1c2ifARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WgARFtZXRoWF9BcnJheV9zbGljZaEBEWZ1bjFfQnVmZmVyX2FsbG9jogEScHJvcF9CdWZmZXJfbGVuZ3RoowEVbWV0aDBfQnVmZmVyX3RvU3RyaW5npAETbWV0aDNfQnVmZmVyX2ZpbGxBdKUBE21ldGg0X0J1ZmZlcl9ibGl0QXSmARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKcBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6gBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKkBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKoBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50qwEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdKwBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50rQEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKuAR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ68BFG1ldGgxX0Vycm9yX19fY3Rvcl9fsAEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7EBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7IBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fswEPcHJvcF9FcnJvcl9uYW1ltAERbWV0aDBfRXJyb3JfcHJpbnS1AQ9wcm9wX0RzRmliZXJfaWS2ARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZbcBF21ldGgwX0RzRmliZXJfdGVybWluYXRluAEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZLkBEWZ1bjBfRHNGaWJlcl9zZWxmugEUbWV0aFhfRnVuY3Rpb25fc3RhcnS7ARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbwBEnByb3BfRnVuY3Rpb25fbmFtZb0BD2Z1bjJfSlNPTl9wYXJzZb4BE2Z1bjNfSlNPTl9zdHJpbmdpZnm/AQ5mdW4xX01hdGhfY2VpbMABD2Z1bjFfTWF0aF9mbG9vcsEBD2Z1bjFfTWF0aF9yb3VuZMIBDWZ1bjFfTWF0aF9hYnPDARBmdW4wX01hdGhfcmFuZG9txAETZnVuMV9NYXRoX3JhbmRvbUludMUBDWZ1bjFfTWF0aF9sb2fGAQ1mdW4yX01hdGhfcG93xwEOZnVuMl9NYXRoX2lkaXbIAQ5mdW4yX01hdGhfaW1vZMkBDmZ1bjJfTWF0aF9pbXVsygENZnVuMl9NYXRoX21pbssBC2Z1bjJfbWlubWF4zAENZnVuMl9NYXRoX21heM0BEmZ1bjJfT2JqZWN0X2Fzc2lnbs4BEGZ1bjFfT2JqZWN0X2tleXPPARNmdW4xX2tleXNfb3JfdmFsdWVz0AESZnVuMV9PYmplY3RfdmFsdWVz0QEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bSARBwcm9wX1BhY2tldF9yb2xl0wEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllctQBE3Byb3BfUGFja2V0X3Nob3J0SWTVARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjWARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZNcBEXByb3BfUGFja2V0X2ZsYWdz2AEVcHJvcF9QYWNrZXRfaXNDb21tYW5k2QEUcHJvcF9QYWNrZXRfaXNSZXBvcnTaARNwcm9wX1BhY2tldF9wYXlsb2Fk2wETcHJvcF9QYWNrZXRfaXNFdmVudNwBFXByb3BfUGFja2V0X2V2ZW50Q29kZd0BFHByb3BfUGFja2V0X2lzUmVnU2V03gEUcHJvcF9QYWNrZXRfaXNSZWdHZXTfARNwcm9wX1BhY2tldF9yZWdDb2Rl4AEUcHJvcF9QYWNrZXRfaXNBY3Rpb27hARVkZXZzX3BrdF9zcGVjX2J5X2NvZGXiARJkZXZzX2dldF9zcGVjX2NvZGXjARNtZXRoMF9QYWNrZXRfZGVjb2Rl5AESZGV2c19wYWNrZXRfZGVjb2Rl5QEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk5gEURHNSZWdpc3Rlcl9yZWFkX2NvbnTnARJkZXZzX3BhY2tldF9lbmNvZGXoARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl6QEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZeoBFnByb3BfRHNQYWNrZXRJbmZvX25hbWXrARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl7AEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f7QETcHJvcF9Ec1JvbGVfaXNCb3VuZO4BGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZO8BEW1ldGgwX0RzUm9sZV93YWl08AEScHJvcF9TdHJpbmdfbGVuZ3Ro8QEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTyARNtZXRoMV9TdHJpbmdfY2hhckF08wESbWV0aDJfU3RyaW5nX3NsaWNl9AEUZGV2c19qZF9nZXRfcmVnaXN0ZXL1ARZkZXZzX2pkX2NsZWFyX3BrdF9raW5k9gEQZGV2c19qZF9zZW5kX2NtZPcBEWRldnNfamRfd2FrZV9yb2xl+AEUZGV2c19qZF9yZXNldF9wYWNrZXT5ARNkZXZzX2pkX3BrdF9jYXB0dXJl+gETZGV2c19qZF9zZW5kX2xvZ21zZ/sBEmRldnNfamRfc2hvdWxkX3J1bvwBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl/QETZGV2c19qZF9wcm9jZXNzX3BrdP4BFGRldnNfamRfcm9sZV9jaGFuZ2Vk/wESZGV2c19qZF9pbml0X3JvbGVzgAISZGV2c19qZF9mcmVlX3JvbGVzgQIVZGV2c19zZXRfZ2xvYmFsX2ZsYWdzggIXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3ODAhVkZXZzX2dldF9nbG9iYWxfZmxhZ3OEAhBkZXZzX2pzb25fZXNjYXBlhQIVZGV2c19qc29uX2VzY2FwZV9jb3JlhgIPZGV2c19qc29uX3BhcnNlhwIKanNvbl92YWx1ZYgCDHBhcnNlX3N0cmluZ4kCDXN0cmluZ2lmeV9vYmqKAgphZGRfaW5kZW50iwIPc3RyaW5naWZ5X2ZpZWxkjAITZGV2c19qc29uX3N0cmluZ2lmeY0CEXBhcnNlX3N0cmluZ19jb3JljgIRZGV2c19tYXBsaWtlX2l0ZXKPAhdkZXZzX2dldF9idWlsdGluX29iamVjdJACEmRldnNfbWFwX2NvcHlfaW50b5ECDGRldnNfbWFwX3NldJICBmxvb2t1cJMCE2RldnNfbWFwbGlrZV9pc19tYXCUAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXOVAhFkZXZzX2FycmF5X2luc2VydJYCCGt2X2FkZC4xlwISZGV2c19zaG9ydF9tYXBfc2V0mAIPZGV2c19tYXBfZGVsZXRlmQISZGV2c19zaG9ydF9tYXBfZ2V0mgIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXSbAg5kZXZzX3JvbGVfc3BlY5wCEmRldnNfZnVuY3Rpb25fYmluZJ0CEWRldnNfbWFrZV9jbG9zdXJlngIOZGV2c19nZXRfZm5pZHifAhNkZXZzX2dldF9mbmlkeF9jb3JloAIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxkoQITZGV2c19nZXRfcm9sZV9wcm90b6ICG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd6MCGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZKQCFWRldnNfZ2V0X3N0YXRpY19wcm90b6UCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb6YCHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtpwIWZGV2c19tYXBsaWtlX2dldF9wcm90b6gCGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZKkCGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZKoCEGRldnNfaW5zdGFuY2Vfb2arAg9kZXZzX29iamVjdF9nZXSsAgxkZXZzX3NlcV9nZXStAgxkZXZzX2FueV9nZXSuAgxkZXZzX2FueV9zZXSvAgxkZXZzX3NlcV9zZXSwAg5kZXZzX2FycmF5X3NldLECE2RldnNfYXJyYXlfcGluX3B1c2iyAgxkZXZzX2FyZ19pbnSzAg9kZXZzX2FyZ19kb3VibGW0Ag9kZXZzX3JldF9kb3VibGW1AgxkZXZzX3JldF9pbnS2Ag1kZXZzX3JldF9ib29stwIPZGV2c19yZXRfZ2NfcHRyuAIRZGV2c19hcmdfc2VsZl9tYXC5AhFkZXZzX3NldHVwX3Jlc3VtZboCD2RldnNfY2FuX2F0dGFjaLsCGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWW8AhVkZXZzX21hcGxpa2VfdG9fdmFsdWW9AhJkZXZzX3JlZ2NhY2hlX2ZyZWW+AhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsvwIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTAAhNkZXZzX3JlZ2NhY2hlX2FsbG9jwQIUZGV2c19yZWdjYWNoZV9sb29rdXDCAhFkZXZzX3JlZ2NhY2hlX2FnZcMCF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlxAISZGV2c19yZWdjYWNoZV9uZXh0xQIPamRfc2V0dGluZ3NfZ2V0xgIPamRfc2V0dGluZ3Nfc2V0xwIOZGV2c19sb2dfdmFsdWXIAg9kZXZzX3Nob3dfdmFsdWXJAhBkZXZzX3Nob3dfdmFsdWUwygINY29uc3VtZV9jaHVua8sCDXNoYV8yNTZfY2xvc2XMAg9qZF9zaGEyNTZfc2V0dXDNAhBqZF9zaGEyNTZfdXBkYXRlzgIQamRfc2hhMjU2X2ZpbmlzaM8CFGpkX3NoYTI1Nl9obWFjX3NldHVw0AIVamRfc2hhMjU2X2htYWNfZmluaXNo0QIOamRfc2hhMjU2X2hrZGbSAg5kZXZzX3N0cmZvcm1hdNMCDmRldnNfaXNfc3RyaW5n1AIOZGV2c19pc19udW1iZXLVAhRkZXZzX3N0cmluZ19nZXRfdXRmONYCE2RldnNfYnVpbHRpbl9zdHJpbmfXAhRkZXZzX3N0cmluZ192c3ByaW50ZtgCE2RldnNfc3RyaW5nX3NwcmludGbZAhVkZXZzX3N0cmluZ19mcm9tX3V0ZjjaAhRkZXZzX3ZhbHVlX3RvX3N0cmluZ9sCEGJ1ZmZlcl90b19zdHJpbmfcAhlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxk3QISZGV2c19zdHJpbmdfY29uY2F03gIRZGV2c19zdHJpbmdfc2xpY2XfAhJkZXZzX3B1c2hfdHJ5ZnJhbWXgAhFkZXZzX3BvcF90cnlmcmFtZeECD2RldnNfZHVtcF9zdGFja+ICE2RldnNfZHVtcF9leGNlcHRpb27jAgpkZXZzX3Rocm935AISZGV2c19wcm9jZXNzX3Rocm935QIQZGV2c19hbGxvY19lcnJvcuYCFWRldnNfdGhyb3dfdHlwZV9lcnJvcucCFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LoAh5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LpAhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcuoCHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dOsCGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcuwCF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y7QIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZe4CE2RldnNfdmFsdWVfZnJvbV9pbnTvAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbPACF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy8QIUZGV2c192YWx1ZV90b19kb3VibGXyAhFkZXZzX3ZhbHVlX3RvX2ludPMCEmRldnNfdmFsdWVfdG9fYm9vbPQCDmRldnNfaXNfYnVmZmVy9QIXZGV2c19idWZmZXJfaXNfd3JpdGFibGX2AhBkZXZzX2J1ZmZlcl9kYXRh9wITZGV2c19idWZmZXJpc2hfZGF0YfgCFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq+QINZGV2c19pc19hcnJhefoCEWRldnNfdmFsdWVfdHlwZW9m+wIPZGV2c19pc19udWxsaXNo/AIZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZP0CFGRldnNfdmFsdWVfYXBwcm94X2Vx/gISZGV2c192YWx1ZV9pZWVlX2Vx/wIeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjgAMSZGV2c19pbWdfc3RyaWR4X29rgQMSZGV2c19kdW1wX3ZlcnNpb25zggMLZGV2c192ZXJpZnmDAxFkZXZzX2ZldGNoX29wY29kZYQDDmRldnNfdm1fcmVzdW1lhQMRZGV2c192bV9zZXRfZGVidWeGAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzhwMYZGV2c192bV9jbGVhcl9icmVha3BvaW50iAMPZGV2c192bV9zdXNwZW5kiQMWZGV2c192bV9zZXRfYnJlYWtwb2ludIoDFGRldnNfdm1fZXhlY19vcGNvZGVziwMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiMAxFkZXZzX2ltZ19nZXRfdXRmOI0DFGRldnNfZ2V0X3N0YXRpY191dGY4jgMPZGV2c192bV9yb2xlX29rjwMUZGV2c192YWx1ZV9idWZmZXJpc2iQAwxleHByX2ludmFsaWSRAxRleHByeF9idWlsdGluX29iamVjdJIDC3N0bXQxX2NhbGwwkwMLc3RtdDJfY2FsbDGUAwtzdG10M19jYWxsMpUDC3N0bXQ0X2NhbGwzlgMLc3RtdDVfY2FsbDSXAwtzdG10Nl9jYWxsNZgDC3N0bXQ3X2NhbGw2mQMLc3RtdDhfY2FsbDeaAwtzdG10OV9jYWxsOJsDEnN0bXQyX2luZGV4X2RlbGV0ZZwDDHN0bXQxX3JldHVybp0DCXN0bXR4X2ptcJ4DDHN0bXR4MV9qbXBfep8DCmV4cHIyX2JpbmSgAxJleHByeF9vYmplY3RfZmllbGShAxJzdG10eDFfc3RvcmVfbG9jYWyiAxNzdG10eDFfc3RvcmVfZ2xvYmFsowMSc3RtdDRfc3RvcmVfYnVmZmVypAMJZXhwcjBfaW5mpQMQZXhwcnhfbG9hZF9sb2NhbKYDEWV4cHJ4X2xvYWRfZ2xvYmFspwMLZXhwcjFfdXBsdXOoAwtleHByMl9pbmRleKkDD3N0bXQzX2luZGV4X3NldKoDFGV4cHJ4MV9idWlsdGluX2ZpZWxkqwMSZXhwcngxX2FzY2lpX2ZpZWxkrAMRZXhwcngxX3V0ZjhfZmllbGStAxBleHByeF9tYXRoX2ZpZWxkrgMOZXhwcnhfZHNfZmllbGSvAw9zdG10MF9hbGxvY19tYXCwAxFzdG10MV9hbGxvY19hcnJhebEDEnN0bXQxX2FsbG9jX2J1ZmZlcrIDEWV4cHJ4X3N0YXRpY19yb2xlswMTZXhwcnhfc3RhdGljX2J1ZmZlcrQDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ7UDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbme2AxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbme3AxVleHByeF9zdGF0aWNfZnVuY3Rpb264Aw1leHByeF9saXRlcmFsuQMRZXhwcnhfbGl0ZXJhbF9mNjS6AxBleHByeF9yb2xlX3Byb3RvuwMRZXhwcjNfbG9hZF9idWZmZXK8Aw1leHByMF9yZXRfdmFsvQMMZXhwcjFfdHlwZW9mvgMPZXhwcjBfdW5kZWZpbmVkvwMSZXhwcjFfaXNfdW5kZWZpbmVkwAMKZXhwcjBfdHJ1ZcEDC2V4cHIwX2ZhbHNlwgMNZXhwcjFfdG9fYm9vbMMDCWV4cHIwX25hbsQDCWV4cHIxX2Fic8UDDWV4cHIxX2JpdF9ub3TGAwxleHByMV9pc19uYW7HAwlleHByMV9uZWfIAwlleHByMV9ub3TJAwxleHByMV90b19pbnTKAwlleHByMl9hZGTLAwlleHByMl9zdWLMAwlleHByMl9tdWzNAwlleHByMl9kaXbOAw1leHByMl9iaXRfYW5kzwMMZXhwcjJfYml0X29y0AMNZXhwcjJfYml0X3hvctEDEGV4cHIyX3NoaWZ0X2xlZnTSAxFleHByMl9zaGlmdF9yaWdodNMDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk1AMIZXhwcjJfZXHVAwhleHByMl9sZdYDCGV4cHIyX2x01wMIZXhwcjJfbmXYAxVzdG10MV90ZXJtaW5hdGVfZmliZXLZAxRzdG10eDJfc3RvcmVfY2xvc3VyZdoDE2V4cHJ4MV9sb2FkX2Nsb3N1cmXbAxJleHByeF9tYWtlX2Nsb3N1cmXcAxBleHByMV90eXBlb2Zfc3Ry3QMMZXhwcjBfbm93X21z3gMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZd8DEHN0bXQyX2NhbGxfYXJyYXngAwlzdG10eF90cnnhAw1zdG10eF9lbmRfdHJ54gMLc3RtdDBfY2F0Y2jjAw1zdG10MF9maW5hbGx55AMLc3RtdDFfdGhyb3flAw5zdG10MV9yZV90aHJvd+YDEHN0bXR4MV90aHJvd19qbXDnAw5zdG10MF9kZWJ1Z2dlcugDCWV4cHIxX25ld+kDEWV4cHIyX2luc3RhbmNlX29m6gMKZXhwcjBfbnVsbOsDD2V4cHIyX2FwcHJveF9lcewDD2V4cHIyX2FwcHJveF9uZe0DD2RldnNfdm1fcG9wX2FyZ+4DE2RldnNfdm1fcG9wX2FyZ191MzLvAxNkZXZzX3ZtX3BvcF9hcmdfaTMy8AMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcvEDEmpkX2Flc19jY21fZW5jcnlwdPIDEmpkX2Flc19jY21fZGVjcnlwdPMDDEFFU19pbml0X2N0ePQDD0FFU19FQ0JfZW5jcnlwdPUDEGpkX2Flc19zZXR1cF9rZXn2Aw5qZF9hZXNfZW5jcnlwdPcDEGpkX2Flc19jbGVhcl9rZXn4AwtqZF93c3NrX25ld/kDFGpkX3dzc2tfc2VuZF9tZXNzYWdl+gMTamRfd2Vic29ja19vbl9ldmVudPsDB2RlY3J5cHT8Aw1qZF93c3NrX2Nsb3Nl/QMQamRfd3Nza19vbl9ldmVudP4DC3Jlc3Bfc3RhdHVz/wMSd3Nza2hlYWx0aF9wcm9jZXNzgAQXamRfdGNwc29ja19pc19hdmFpbGFibGWBBBR3c3NraGVhbHRoX3JlY29ubmVjdIIEGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldIMED3NldF9jb25uX3N0cmluZ4QEEWNsZWFyX2Nvbm5fc3RyaW5nhQQPd3Nza2hlYWx0aF9pbml0hgQRd3Nza19zZW5kX21lc3NhZ2WHBBF3c3NrX2lzX2Nvbm5lY3RlZIgEEndzc2tfc2VydmljZV9xdWVyeYkEFGRldnNfdHJhY2tfZXhjZXB0aW9uigQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZYsEFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWMBA9yb2xlbWdyX3Byb2Nlc3ONBBByb2xlbWdyX2F1dG9iaW5kjgQVcm9sZW1ncl9oYW5kbGVfcGFja2V0jwQUamRfcm9sZV9tYW5hZ2VyX2luaXSQBBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSRBA1qZF9yb2xlX2FsbG9jkgQQamRfcm9sZV9mcmVlX2FsbJMEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmSUBBNqZF9jbGllbnRfbG9nX2V2ZW50lQQTamRfY2xpZW50X3N1YnNjcmliZZYEFGpkX2NsaWVudF9lbWl0X2V2ZW50lwQUcm9sZW1ncl9yb2xlX2NoYW5nZWSYBBBqZF9kZXZpY2VfbG9va3VwmQQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlmgQTamRfc2VydmljZV9zZW5kX2NtZJsEEWpkX2NsaWVudF9wcm9jZXNznAQOamRfZGV2aWNlX2ZyZWWdBBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldJ4ED2pkX2RldmljZV9hbGxvY58EEHNldHRpbmdzX3Byb2Nlc3OgBBZzZXR0aW5nc19oYW5kbGVfcGFja2V0oQQNc2V0dGluZ3NfaW5pdKIED2pkX2N0cmxfcHJvY2Vzc6MEFWpkX2N0cmxfaGFuZGxlX3BhY2tldKQEDGpkX2N0cmxfaW5pdKUEFGRjZmdfc2V0X3VzZXJfY29uZmlnpgQJZGNmZ19pbml0pwQNZGNmZ192YWxpZGF0ZagEDmRjZmdfZ2V0X2VudHJ5qQQMZGNmZ19nZXRfaTMyqgQMZGNmZ19nZXRfdTMyqwQPZGNmZ19nZXRfc3RyaW5nrAQMZGNmZ19pZHhfa2V5rQQJamRfdmRtZXNnrgQRamRfZG1lc2dfc3RhcnRwdHKvBA1qZF9kbWVzZ19yZWFksAQSamRfZG1lc2dfcmVhZF9saW5lsQQTamRfc2V0dGluZ3NfZ2V0X2JpbrIEDWpkX2ZzdG9yX2luaXSzBBNqZF9zZXR0aW5nc19zZXRfYmlutAQLamRfZnN0b3JfZ2O1BA9yZWNvbXB1dGVfY2FjaGW2BBVqZF9zZXR0aW5nc19nZXRfbGFyZ2W3BBZqZF9zZXR0aW5nc19wcmVwX2xhcmdluAQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2W5BBZqZF9zZXR0aW5nc19zeW5jX2xhcmdlugQNamRfaXBpcGVfb3BlbrsEFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXS8BA5qZF9pcGlwZV9jbG9zZb0EEmpkX251bWZtdF9pc192YWxpZL4EFWpkX251bWZtdF93cml0ZV9mbG9hdL8EE2pkX251bWZtdF93cml0ZV9pMzLABBJqZF9udW1mbXRfcmVhZF9pMzLBBBRqZF9udW1mbXRfcmVhZF9mbG9hdMIEEWpkX29waXBlX29wZW5fY21kwwQUamRfb3BpcGVfb3Blbl9yZXBvcnTEBBZqZF9vcGlwZV9oYW5kbGVfcGFja2V0xQQRamRfb3BpcGVfd3JpdGVfZXjGBBBqZF9vcGlwZV9wcm9jZXNzxwQUamRfb3BpcGVfY2hlY2tfc3BhY2XIBA5qZF9vcGlwZV93cml0ZckEDmpkX29waXBlX2Nsb3NlygQNamRfcXVldWVfcHVzaMsEDmpkX3F1ZXVlX2Zyb250zAQOamRfcXVldWVfc2hpZnTNBA5qZF9xdWV1ZV9hbGxvY84EDWpkX3Jlc3BvbmRfdTjPBA5qZF9yZXNwb25kX3UxNtAEDmpkX3Jlc3BvbmRfdTMy0QQRamRfcmVzcG9uZF9zdHJpbmfSBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZNMEC2pkX3NlbmRfcGt01AQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzVBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlctYEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTXBBRqZF9hcHBfaGFuZGxlX3BhY2tldNgEFWpkX2FwcF9oYW5kbGVfY29tbWFuZNkEFWFwcF9nZXRfaW5zdGFuY2VfbmFtZdoEE2pkX2FsbG9jYXRlX3NlcnZpY2XbBBBqZF9zZXJ2aWNlc19pbml03AQOamRfcmVmcmVzaF9ub3fdBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk3gQUamRfc2VydmljZXNfYW5ub3VuY2XfBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZeAEEGpkX3NlcnZpY2VzX3RpY2vhBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfiBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZeMEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXkBBRhcHBfZ2V0X2RldmljZV9jbGFzc+UEEmFwcF9nZXRfZndfdmVyc2lvbuYEDWpkX3NydmNmZ19ydW7nBBdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZegEEWpkX3NydmNmZ192YXJpYW506QQNamRfaGFzaF9mbnYxYeoEDGpkX2RldmljZV9pZOsECWpkX3JhbmRvbewECGpkX2NyYzE27QQOamRfY29tcHV0ZV9jcmPuBA5qZF9zaGlmdF9mcmFtZe8EDGpkX3dvcmRfbW92ZfAEDmpkX3Jlc2V0X2ZyYW1l8QQQamRfcHVzaF9pbl9mcmFtZfIEDWpkX3BhbmljX2NvcmXzBBNqZF9zaG91bGRfc2FtcGxlX21z9AQQamRfc2hvdWxkX3NhbXBsZfUECWpkX3RvX2hlePYEC2pkX2Zyb21faGV49wQOamRfYXNzZXJ0X2ZhaWz4BAdqZF9hdG9p+QQLamRfdnNwcmludGb6BA9qZF9wcmludF9kb3VibGX7BApqZF9zcHJpbnRm/AQSamRfZGV2aWNlX3Nob3J0X2lk/QQMamRfc3ByaW50Zl9h/gQLamRfdG9faGV4X2H/BAlqZF9zdHJkdXCABQlqZF9tZW1kdXCBBRZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlggUWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZYMFEWpkX3NlbmRfZXZlbnRfZXh0hAUKamRfcnhfaW5pdIUFFGpkX3J4X2ZyYW1lX3JlY2VpdmVkhgUdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uHBQ9qZF9yeF9nZXRfZnJhbWWIBRNqZF9yeF9yZWxlYXNlX2ZyYW1liQURamRfc2VuZF9mcmFtZV9yYXeKBQ1qZF9zZW5kX2ZyYW1liwUKamRfdHhfaW5pdIwFB2pkX3NlbmSNBRZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjjgUPamRfdHhfZ2V0X2ZyYW1ljwUQamRfdHhfZnJhbWVfc2VudJAFC2pkX3R4X2ZsdXNokQUQX19lcnJub19sb2NhdGlvbpIFDF9fZnBjbGFzc2lmeZMFBWR1bW15lAUIX19tZW1jcHmVBQdtZW1tb3ZllgUGbWVtc2V0lwUKX19sb2NrZmlsZZgFDF9fdW5sb2NrZmlsZZkFBmZmbHVzaJoFBGZtb2SbBQ1fX0RPVUJMRV9CSVRTnAUMX19zdGRpb19zZWVrnQUNX19zdGRpb193cml0ZZ4FDV9fc3RkaW9fY2xvc2WfBQhfX3RvcmVhZKAFCV9fdG93cml0ZaEFCV9fZndyaXRleKIFBmZ3cml0ZaMFFF9fcHRocmVhZF9tdXRleF9sb2NrpAUWX19wdGhyZWFkX211dGV4X3VubG9ja6UFBl9fbG9ja6YFCF9fdW5sb2NrpwUOX19tYXRoX2Rpdnplcm+oBQpmcF9iYXJyaWVyqQUOX19tYXRoX2ludmFsaWSqBQNsb2erBQV0b3AxNqwFBWxvZzEwrQUHX19sc2Vla64FBm1lbWNtcK8FCl9fb2ZsX2xvY2uwBQxfX29mbF91bmxvY2uxBQxfX21hdGhfeGZsb3eyBQxmcF9iYXJyaWVyLjGzBQxfX21hdGhfb2Zsb3e0BQxfX21hdGhfdWZsb3e1BQRmYWJztgUDcG93twUFdG9wMTK4BQp6ZXJvaW5mbmFuuQUIY2hlY2tpbnS6BQxmcF9iYXJyaWVyLjK7BQpsb2dfaW5saW5lvAUKZXhwX2lubGluZb0FC3NwZWNpYWxjYXNlvgUNZnBfZm9yY2VfZXZhbL8FBXJvdW5kwAUGc3RyY2hywQULX19zdHJjaHJudWzCBQZzdHJjbXDDBQZzdHJsZW7EBQdfX3VmbG93xQUHX19zaGxpbcYFCF9fc2hnZXRjxwUHaXNzcGFjZcgFBnNjYWxibskFCWNvcHlzaWdubMoFB3NjYWxibmzLBQ1fX2ZwY2xhc3NpZnlszAUFZm1vZGzNBQVmYWJzbM4FC19fZmxvYXRzY2FuzwUIaGV4ZmxvYXTQBQhkZWNmbG9hdNEFB3NjYW5leHDSBQZzdHJ0b3jTBQZzdHJ0b2TUBRJfX3dhc2lfc3lzY2FsbF9yZXTVBQhkbG1hbGxvY9YFBmRsZnJlZdcFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdgFBHNicmvZBQhfX2FkZHRmM9oFCV9fYXNobHRpM9sFB19fbGV0ZjLcBQdfX2dldGYy3QUIX19kaXZ0ZjPeBQ1fX2V4dGVuZGRmdGYy3wUNX19leHRlbmRzZnRmMuAFC19fZmxvYXRzaXRm4QUNX19mbG9hdHVuc2l0ZuIFDV9fZmVfZ2V0cm91bmTjBRJfX2ZlX3JhaXNlX2luZXhhY3TkBQlfX2xzaHJ0aTPlBQhfX211bHRmM+YFCF9fbXVsdGkz5wUJX19wb3dpZGYy6AUIX19zdWJ0ZjPpBQxfX3RydW5jdGZkZjLqBQtzZXRUZW1wUmV0MOsFC2dldFRlbXBSZXQw7AUJc3RhY2tTYXZl7QUMc3RhY2tSZXN0b3Jl7gUKc3RhY2tBbGxvY+8FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnTwBRVlbXNjcmlwdGVuX3N0YWNrX2luaXTxBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl8gUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZfMFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZPQFDGR5bkNhbGxfamlqafUFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamn2BRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwH0BQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
