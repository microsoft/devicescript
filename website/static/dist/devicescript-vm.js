
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA9aFgIAA1AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMABgAFAgICAAMDAwMFAAAAAgEAAgUABQUDAgIDAgIDBAMDAwUCCAACAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAEAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAQEBAQIEBAEKDQICAAAHCQkBAwcBAgAIAAIGAAcJCAQABAQAAAIHAAMHBwECAQASAwkHAAAEAAIHBAcEBAMDAwUCCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXABywHLAQWGgICAAAEBgAKAAgbdgICAAA5/AUHg7AULfwFBAAt/AUEAC38BQQALfwBB4MoBC38AQc/LAQt/AEGZzQELfwBBlc4BC38AQZHPAQt/AEHhzwELfwBBgtABC38AQYfSAQt/AEHgygELfwBB/dIBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MAyQUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAIUFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAMoFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAjQUVZW1zY3JpcHRlbl9zdGFja19pbml0AOQFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA5QUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQDmBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA5wUJc3RhY2tTYXZlAOAFDHN0YWNrUmVzdG9yZQDhBQpzdGFja0FsbG9jAOIFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA4wUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlqaQDpBQmLg4CAAAEAQQELygEqO0RF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LQAKRQ0AIANBFGoQvQQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBC2BBogAyAAKAIELQAOOgAKIAMoAhAPC0HWxwBBtDpBMUHlNBDrBAAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahDyAg0AIAMgASkDADcDGAJAAkAgACADQRhqEJ0CIgINACADIAEpAwA3AxAgACADQRBqEJwCIQEMAQsCQCAAIAIQngIiAQ0AQQAhAQwBCwJAIAAgAhCKAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAEM0CIANBKGogACAEELMCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBjC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQhQIgAWohAgwBCyAAIAJBAEEAEIUCIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEJUCIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ5wIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNLDQIgASAFNgIAIAFBBToACgwDCwJAAkAgBA0AQQAhBQwBCyAELQADQQ9xIQULAkAgBUF8ag4GAAICAgIAAgsgASAENgIAIAFB0gA6AAogAyACKQMANwMoIAEgACADQShqQQAQXzYC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QeAAaikDACIINwMgIAEgCDcDQAJAAkAgACABQSBqEMoCRQ0AIAEgASkDQDcDACAAIAEgAUHYAGoQzAIhAgwBCyABIAEpA0AiCDcDUCABIAg3AxgCQAJAIAAgAUEYahDrAg0AIAEgASkDUDcDECABQdgAaiAAQRIgAUEQahDgAkEAIQIMAQsgASABKQNQNwMIIAAgAUEIaiABQdgAahDtAiECCyACIQILIAIiBUUNACAAQQIQqQIhAiAAQQMQqQIhACABKAJYIgYgAk0NACABIAYgAmsiBjYCWCABKAJMIgcgBE0NACABIAcgBGsiBzYCTCADIARqIAUgAmogByAGIAAgBiAASRsiACAHIABJGxCIBRoLIAFB4ABqJAALHwEBfwJAIABBABCpAiIBQQBIDQAgACgCrAEgARB2CwsjAQF/IABB39QDIABBABCpAiIBIAFBoKt8akGhq3xJGxCBAQsJACAAQQAQgQELywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQzAIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDJAiIFQX9qIgYQkwEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQyQIaDAELIAdBBmogAUEQaiAGEIgFGgsgACAHEK4CCyABQeAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQqQIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqENECIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEPEBIAFBIGokAAsOACAAIABBABCqAhCrAgsPACAAIABBABCqAp0QqwILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDyAkUNACABIAEpA2g3AxAgASAAIAFBEGoQvwI2AgBBuhYgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqENECIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABDMAiECIAEgASkDaDcDMCABIAAgAUEwahC/AjYCJCABIAI2AiBB7BYgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqENECIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEMwCIgJFDQAgAiABQSBqEJ8EIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlAEQ5wIgACgCrAEgASkDGDcDIAsgAUEwaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQrwIiAkUNAAJAIAIoAgQNACACIABBHBCGAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8gAQzQILIAEgASkDCDcDACAAIAJB9gAgARDTAiAAIAIQrgILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEK8CIgJFDQACQCACKAIEDQAgAiAAQSAQhgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfQAEM0CCyABIAEpAwg3AwAgACACQfYAIAEQ0wIgACACEK4CCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCvAiICRQ0AAkAgAigCBA0AIAIgAEEeEIYCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHzABDNAgsgASABKQMINwMAIAAgAkH2ACABENMCIAAgAhCuAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQrwIiAkUNAAJAIAIoAgQNACACIABBIhCGAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpBhAEQzQILIAEgASkDCDcDACAAIAJB9gAgARDTAiAAIAIQrgILIAFBEGokAAtiAQF/IwBBIGsiAyQAIAMgAikDADcDECADQRhqIAEgA0EQakH7ABCXAgJAAkAgAykDGEIAUg0AIABCADcDAAwBCyADIAMpAxg3AwggACABIANBCGpB4wAQlwILIANBIGokAAs1AgF/AX4jAEEQayIBJAAgASAAKQNQIgI3AwAgASACNwMIIAAgARDZAiAAEIAEIAFBEGokAAupAQEDfyMAQRBrIgEkAAJAAkAgAC0AQ0EBSw0AIAFBCGogAEGmJEEAEN4CDAELAkAgAEEAEKkCIgJBe2pBe0sNACABQQhqIABBlSRBABDeAgwBCyAAIAAtAENBf2oiAzoAQyAAQdgAaiAAQeAAaiADQf8BcUF/aiIDQQN0EIkFGiAAIAMgAhB9IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCVAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBrB8gA0EIahDhAgwBCyAAIAEgASgCoAEgBEH//wNxEJACIAApAwBCAFINACADQdgAaiABQQggASABQQIQhgIQjwEQ5wIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEM0CIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahClAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQjgIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahCVAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ4AIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwHAxgFODQIgAEHw4QAgAUEDdGovAQAQzQIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtBlBNBtzhBOEHNKhDrBAAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahDyAg0AIAFBOGogAEGZGRDfAgsgASABKQNINwMgIAFBOGogACABQSBqENECIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjQEgASABKQNINwMQAkAgACABQRBqIAFBOGoQzAIiAkUNACABQTBqIAAgAiABKAI4QQEQ/QEgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCOASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQqQIhAiABIAEpAyA3AwgCQCABQQhqEPICDQAgAUEYaiAAQfMaEN8CCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEIMCIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDoApsQqwILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ6AKcEKsCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEOgCELMFEKsCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEOUCCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahDoAiIERAAAAAAAAAAAY0UNACAAIASaEKsCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEN8EuEQAAAAAAADwPaIQqwILZAEFfwJAAkAgAEEAEKkCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQ3wQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRCsAgsRACAAIABBABCqAhCeBRCrAgsYACAAIABBABCqAiAAQQEQqgIQqgUQqwILLgEDfyAAQQAQqQIhAUEAIQICQCAAQQEQqQIiA0UNACABIANtIQILIAAgAhCsAgsuAQN/IABBABCpAiEBQQAhAgJAIABBARCpAiIDRQ0AIAEgA28hAgsgACACEKwCCxYAIAAgAEEAEKkCIABBARCpAmwQrAILCQAgAEEBEMUBC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEOkCIQMgAiACKQMgNwMQIAAgAkEQahDpAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ6AIhBiACIAIpAyA3AwAgACACEOgCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDoGk3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQxQELkwECA38BfiMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwAiBDcDGCABIAQ3AyACQCABQRhqEPICDQAgASABKQMoNwMQIAAgAUEQahCZAiECIAEgASkDIDcDCCAAIAFBCGoQnQIiA0UNACACRQ0AIAAgAiADEIcCCyAAKAKsASABKQMoNwMgIAFBMGokAAsJACAAQQEQyQELmgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEJ0CIgNFDQAgAEEAEJEBIgRFDQAgAkEgaiAAQQggBBDnAiACIAIpAyA3AxAgACACQRBqEI0BIAAgAyAEIAEQiwIgAiACKQMgNwMIIAAgAkEIahCOASAAKAKsASACKQMgNwMgCyACQTBqJAALCQAgAEEAEMkBC+MBAgN/AX4jAEHAAGsiASQAIAEgAEHYAGopAwAiBDcDOCABIABB4ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqEO8CIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQ4AIMAQsgASABKQMwNwMYAkAgACABQRhqEJ0CIgMNACABIAEpAzA3AxAgAUEo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QAJAIAINACAAQgA3AwAMAQsCQCADKAIcIgJB//8BRw0AIABCADcDAAwBCyAAIAI2AgAgAEECNgIECyADQTBqJAALiQECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQkQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBqxsgA0EIahDhAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwEANgIAIABBBDYCBAsgA0EwaiQAC4YBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEJECIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQasbIANBCGoQ4QJBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BAkH/H3EQ5QILIANBMGokAAvOAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEJECIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQasbIAFBEGoQ4QJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQZ4bIAFBCGoQ4QJBACEDCwJAIAMiA0UNACAAIAMQ3gEgACABKAIkIAMvAQIQ7QELIAFBwABqJAALbwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQ4AIMAQsgACABKAK0ASACKAIAQQxsaigCACgCEEEARxDmAgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahDgAkH//wEhAgwBCyABKAIoIQILAkAgAiICQf//AUYNACAAQQAQqQIhAyABIABB4ABqKQMAIgY3AyggASAGNwMIIAAgAUEIaiABQRxqEO4CIQQCQCADQYCABEkNACABQSBqIABB3QAQ4gIMAQsCQCABKAIcIgVB7QFJDQAgAUEgaiAAQd4AEOICDAELIABBsAJqIAU6AAAgAEG0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DGogARD3Ag0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRB4OkAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRC3BTYCACAFIQEMAgtB1DhBrgJBtMYAEOYEAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEIMDIgEhAgJAIAENACADQQhqIABB6AAQggFBpNUAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIIBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEPcCDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQggELDgAgACACIAIoAkwQsgILNQACQCABLQBCQQFGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEAQQAQdBoLNQACQCABLQBCQQJGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEBQQAQdBoLNQACQCABLQBCQQNGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUECQQAQdBoLNQACQCABLQBCQQRGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEDQQAQdBoLNQACQCABLQBCQQVGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEEQQAQdBoLNQACQCABLQBCQQZGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEFQQAQdBoLNQACQCABLQBCQQdGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEGQQAQdBoLNQACQCABLQBCQQhGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEHQQAQdBoLNQACQCABLQBCQQlGDQBBs8cAQY03Qc0AQaTCABDrBAALIAFBADoAQiABKAKsAUEIQQAQdBoL9gECA38BfiMAQdAAayICJAAgAkHIAGogARDkAyACQcAAaiABEOQDIAEoAqwBQQApA5hpNwMgIAEgAikDSDcDMCACIAIpA0A3AzACQCABIAJBMGoQmQIiA0UNACACIAIpA0g3AygCQCABIAJBKGoQygIiBA0AIAIgAikDSDcDICACQThqIAEgAkEgahDRAiACIAIpAzgiBTcDSCACIAU3AxggASACQRhqEI0BCyACIAIpA0g3AxACQCABIAMgAkEQahCPAg0AIAEoAqwBQQApA5BpNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahCOAQsgAkHQAGokAAteAQJ/IwBBEGsiAiQAIAEoAqwBIQMgAkEIaiABEOQDIAMgAikDCDcDICADIAAQdwJAIAEtAEdFDQAgASgC2AEgAEcNACABLQAHQQhxRQ0AIAFBCBD/AgsgAkEQaiQAC2IBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCCAUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4UBAQR/IwBBIGsiAiQAIAJBEGogARDkAyACIAIpAxA3AwggASACQQhqEOoCIQMCQAJAIAAoAhAoAgAgASgCTCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABCCAUEAIQULAkAgBSIBRSADcg0AIAAgATsBBAsgAkEgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOQDIANBEGogAhDkAyADIAMpAxg3AwggAyADKQMQNwMAIAAgAiADQQhqIAMQkwIgA0EgaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqQBNgIMAkACQCADQQxqIARBgIABciIEEPcCDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEIYCIQQgAyADKQMQNwMAIAAgAiAEIAMQoAIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEOQDAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ5AMCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ5AMgARDlAyEDIAEQ5QMhBCACQRBqIAFBARDnAwJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA6hpNwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQ5AMgAyADKQMYNwMQAkACQAJAIANBEGoQywINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEOgCEOQCCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ5AMgA0EQaiACEOQDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCkAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ5AMgAkEgaiABEOQDIAJBGGogARDkAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEKUCIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOQDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBD3Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCiAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOQDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBD3Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCiAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOQDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBD3Ag0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCiAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD3Ag0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBABCGAiEEIAMgAykDEDcDACAAIAIgBCADEKACIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD3Ag0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBFRCGAiEEIAMgAykDEDcDACAAIAIgBCADEKACIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQhgIQjwEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQ5wIgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEOUDIgMQkQEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQ5wIgAyACKQMINwMgIAJBEGokAAtQAQN/IwBBEGsiAiQAAkAgASABEOUDIgMQkgEiBA0AIAEgA0EMahBTCyAB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AyIENgIQIAAgBCADKAIAdRDlAgtBAQJ/IAJBGGoiAyACEOYDNgIAIAIgAhDmAyIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBDkAg8LIAAgAhDlAgudAQEDfyMAQSBrIgMkACADQRhqIAIQ5AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOQDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9QIhAgsgACACEOYCIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhDkAyACQRhqIgQgAykDGDcDACADQRhqIAIQ5AMgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQ6AI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOgCIgY5AwAgAisDICAGZSECDAELIAUoAgAgBCgCAEwhAgsgACACEOYCIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhDkAyACQRhqIgQgAykDGDcDACADQRhqIAIQ5AMgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQ6AI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOgCIgY5AwAgAisDICAGYyECDAELIAUoAgAgBCgCAEghAgsgACACEOYCIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQ5AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOQDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9QJBAXMhAgsgACACEOYCIANBIGokAAucAQECfyMAQSBrIgIkACACQRhqIAEQ5AMgASgCrAFCADcDICACIAIpAxg3AwgCQCACQQhqEPICDQACQAJAIAIoAhwiA0GAgMD/B3ENACADQQ9xQQFGDQELIAIgAikDGDcDACACQRBqIAFBvBsg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wMYBTg0DQfDhACAEQQN0ai0AA0EIcQ0BIAAgAkG9GEEAEN0CDAILIAQgAigApAEiBUEkaigCAEEEdk4NAyAFIAUoAiBqIARBBHRqLQALQQJxDQAgACACQcUYQQAQ3QIMAQsgACADKQMYNwMACyADQSBqJAAPC0GUE0GNN0HiAkGnCxDrBAALQbjRAEGNN0HnAkGnCxDrBAALVgECfyMAQSBrIgMkACADQRhqIAIQ5AMgA0EQaiACEOQDIAMgAykDGDcDCCACIANBCGoQnwIhBCADIAMpAxA3AwAgACACIAMgBBChAhDmAiADQSBqJAALDQAgAEEAKQOwaTcDAAudAQEDfyMAQSBrIgMkACADQRhqIAIQ5AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOQDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9AIhAgsgACACEOYCIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQ5AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOQDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9AJBAXMhAgsgACACEOYCIANBIGokAAs/AQF/AkAgAS0AQiICDQAgACABQewAEIIBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEOkCIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEOkCIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCCAQwB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gICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQAJAIAJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELIAEhAQsgACADIAEQswQL+AEAAkAgAUEISQ0AIAAgASACtxCyBA8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQcQ2Qa4BQefGABDmBAALIAAgAkH/ASACQf8BSBsiAUEAIAFBAEobOgAAC7sDAwF/AXwBfgJAAkACQCABQQhJDQACQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQtAS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBxDZBygFB+8YAEOYEAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQL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DAELIAcgASAIcjoAACAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBBwxUgBBA8EB0AC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QiAUgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQtwVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQtwVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBDuBCABQQhqIQIMBwsgCygCACIBQaDRACABGyIDELcFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQiAUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBC3BSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQiAUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEKAFIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ2wWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ2wWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDbBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDbBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQigUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QZDyAGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEIoFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQtwVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6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AkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgC3OgBRQ0AQQAoAtzoARCNBSEBCwJAQQAoAtjKAUUNAEEAKALYygEQjQUgAXIhAQsCQBCjBSgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQiwUhAgsCQCAAKAIUIAAoAhxGDQAgABCNBSABciEBCwJAIAJFDQAgABCMBQsgACgCOCIADQALCxCkBSABDwtBACECAkAgACgCTEEASA0AIAAQiwUhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBEPABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEIwFCyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEI8FIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACEKEFC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBQQyAVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahAUEMgFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBCHBRASC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEJQFDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEIgFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQlQUhAAwBCyADEIsFIQUgACAEIAMQlQUhACAFRQ0AIAMQjAULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEJwFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEJ8FIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA8BzIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDkHSiIAhBACsDiHSiIABBACsDgHSiQQArA/hzoKCgoiAIQQArA/BzoiAAQQArA+hzokEAKwPgc6CgoKIgCEEAKwPYc6IgAEEAKwPQc6JBACsDyHOgoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQmwUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQnQUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsDiHOiIANCLYinQf8AcUEEdCIBQaD0AGorAwCgIgkgAUGY9ABqKwMAIAIgA0KAgICAgICAeIN9vyABQZiEAWorAwChIAFBoIQBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwO4c6JBACsDsHOgoiAAQQArA6hzokEAKwOgc6CgoiAEQQArA5hzoiAIQQArA5BzoiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB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//8AENkFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ2QUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5ENkFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDZBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQzwVFDQAgAyAEEL8FIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEENkFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ0QUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEM8FQQBKDQACQCABIAkgAyAKEM8FRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAENkFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDZBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ2QUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAENkFIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgL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cQ0AQQAgBiADcjYC9OgBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKQ6QFBf2oiAUF/IAEbNgKQ6QELCwcAPwBBEHQLVAECf0EAKALcygEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQywVNDQAgABAVRQ0BC0EAIAA2AtzKASABDwsQhQVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEM4FQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDOBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQzgUgBUEwaiAKIAEgBxDYBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEM4FIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEM4FIAUgAiAEQQEgBmsQ2AUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAENYFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELENcFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQzgVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDOBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDaBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDaBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDaBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDaBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDaBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDaBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDaBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDaBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDaBSAFQZABaiADQg+GQgAgBEIAENoFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ2gUgBUGAAWpCASACfUIAIARCABDaBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOENoFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOENoFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ2AUgBUEwaiAWIBMgBkHwAGoQzgUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q2gUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDaBSAFIAMgDkIFQgAQ2gUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEM4FIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEM4FIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQzgUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQzgUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQzgVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQzgUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQzgUgBUEgaiACIAQgBhDOBSAFQRBqIBIgASAHENgFIAUgAiAEIAcQ2AUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEM0FIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDOBSACIAAgBEGB+AAgA2sQ2AUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHg7AUkA0Hg7AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEOgFIQUgBUIgiKcQ3gUgBacLEwAgACABpyABQiCIpyACIAMQFgsLjsuBgAADAEGACAuovgFpbmZpbml0eQAtSW5maW5pdHkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAc2xlZXBNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBiYWQgdmVyc2lvbgBwcm9nVmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBhc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAGludmFsaWQgZmxhZyBhcmcAbmVlZCBmbGFnIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAcHJvZ05hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBkZXZzX2djX3RhZyhkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkgPT0gREVWU19HQ19UQUdfU1RSSU5HADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAKiAgcGM9JWQgQCA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFy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AAAAAAAAAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMkAAADKAAAAcHQAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMhkAABgdgEAAEHgygELnQgodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaFNhdmUpIE1vZHVsZS5mbGFzaFNhdmUoSEVBUFU4LnNsaWNlKHN0YXJ0LCBzdGFydCArIHNpemUpKTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAAi/CAgAAEbmFtZQGbb+sFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwxzdG9wX3Byb2dyYW1oD2RldnNtZ3JfcmVzdGFydGkUZGV2c21ncl9kZXBsb3lfc3RhcnRqFGRldnNtZ3JfZGVwbG95X3dyaXRlaxBkZXZzbWdyX2dldF9oYXNobBVkZXZzbWdyX2hhbmRsZV9wYWNrZXRtDmRlcGxveV9oYW5kbGVybhNkZXBsb3lfbWV0YV9oYW5kbGVybw9kZXZzbWdyX2dldF9jdHhwDmRldnNtZ3JfZGVwbG95cQxkZXZzbWdyX2luaXRyEWRldnNtZ3JfY2xpZW50X2V2cxBkZXZzX2ZpYmVyX3lpZWxkdBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb251GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXYQZGV2c19maWJlcl9zbGVlcHcbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3kRZGV2c19pbWdfZnVuX25hbWV6EmRldnNfaW1nX3JvbGVfbmFtZXsSZGV2c19maWJlcl9ieV9maWR4fBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBCmRldnNfcGFuaWOCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJUBD2RldnNfZ2Nfc2V0X2N0eJYBDmRldnNfZ2NfY3JlYXRllwEPZGV2c19nY19kZXN0cm95mAERZGV2c19nY19vYmpfY2hlY2uZAQtzY2FuX2djX29iapoBEXByb3BfQXJyYXlfbGVuZ3RomwESbWV0aDJfQXJyYXlfaW5zZXJ0nAESZnVuMV9BcnJheV9pc0FycmF5nQEQbWV0aFhfQXJyYXlfcHVzaJ4BFW1ldGgxX0FycmF5X3B1c2hSYW5nZZ8BEW1ldGhYX0FycmF5X3NsaWNloAERZnVuMV9CdWZmZXJfYWxsb2OhARJwcm9wX0J1ZmZlcl9sZW5ndGiiARVtZXRoMF9CdWZmZXJfdG9TdHJpbmejARNtZXRoM19CdWZmZXJfZmlsbEF0pAETbWV0aDRfQnVmZmVyX2JsaXRBdKUBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOmARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOnARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SoARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSpARdmdW4yX0RldmljZVNjcmlwdF9wcmludKoBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSrARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludKwBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByrQEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbmeuARRtZXRoMV9FcnJvcl9fX2N0b3JfX68BGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+wARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+xARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7IBD3Byb3BfRXJyb3JfbmFtZbMBEW1ldGgwX0Vycm9yX3ByaW50tAEUbWV0aFhfRnVuY3Rpb25fc3RhcnS1ARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbYBEnByb3BfRnVuY3Rpb25fbmFtZbcBD2Z1bjJfSlNPTl9wYXJzZbgBE2Z1bjNfSlNPTl9zdHJpbmdpZnm5AQ5mdW4xX01hdGhfY2VpbLoBD2Z1bjFfTWF0aF9mbG9vcrsBD2Z1bjFfTWF0aF9yb3VuZLwBDWZ1bjFfTWF0aF9hYnO9ARBmdW4wX01hdGhfcmFuZG9tvgETZnVuMV9NYXRoX3JhbmRvbUludL8BDWZ1bjFfTWF0aF9sb2fAAQ1mdW4yX01hdGhfcG93wQEOZnVuMl9NYXRoX2lkaXbCAQ5mdW4yX01hdGhfaW1vZMMBDmZ1bjJfTWF0aF9pbXVsxAENZnVuMl9NYXRoX21pbsUBC2Z1bjJfbWlubWF4xgENZnVuMl9NYXRoX21heMcBEmZ1bjJfT2JqZWN0X2Fzc2lnbsgBEGZ1bjFfT2JqZWN0X2tleXPJARNmdW4xX2tleXNfb3JfdmFsdWVzygESZnVuMV9PYmplY3RfdmFsdWVzywEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bMARBwcm9wX1BhY2tldF9yb2xlzQEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcs4BE3Byb3BfUGFja2V0X3Nob3J0SWTPARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjQARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZNEBEXByb3BfUGFja2V0X2ZsYWdz0gEVcHJvcF9QYWNrZXRfaXNDb21tYW5k0wEUcHJvcF9QYWNrZXRfaXNSZXBvcnTUARNwcm9wX1BhY2tldF9wYXlsb2Fk1QETcHJvcF9QYWNrZXRfaXNFdmVudNYBFXByb3BfUGFja2V0X2V2ZW50Q29kZdcBFHByb3BfUGFja2V0X2lzUmVnU2V02AEUcHJvcF9QYWNrZXRfaXNSZWdHZXTZARNwcm9wX1BhY2tldF9yZWdDb2Rl2gETbWV0aDBfUGFja2V0X2RlY29kZdsBEmRldnNfcGFja2V0X2RlY29kZdwBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZN0BFERzUmVnaXN0ZXJfcmVhZF9jb2503gESZGV2c19wYWNrZXRfZW5jb2Rl3wEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZeABFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXhARZwcm9wX0RzUGFja2V0SW5mb19uYW1l4gEWcHJvcF9Ec1BhY2tldEluZm9fY29kZeMBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX+QBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVk5QEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k5gERbWV0aDBfRHNSb2xlX3dhaXTnARJwcm9wX1N0cmluZ19sZW5ndGjoARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdOkBE21ldGgxX1N0cmluZ19jaGFyQXTqARJtZXRoMl9TdHJpbmdfc2xpY2XrARRkZXZzX2pkX2dldF9yZWdpc3RlcuwBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTtARBkZXZzX2pkX3NlbmRfY21k7gERZGV2c19qZF93YWtlX3JvbGXvARRkZXZzX2pkX3Jlc2V0X3BhY2tldPABE2RldnNfamRfcGt0X2NhcHR1cmXxARNkZXZzX2pkX3NlbmRfbG9nbXNn8gESZGV2c19qZF9zaG91bGRfcnVu8wEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX0ARNkZXZzX2pkX3Byb2Nlc3NfcGt09QEUZGV2c19qZF9yb2xlX2NoYW5nZWT2ARJkZXZzX2pkX2luaXRfcm9sZXP3ARJkZXZzX2pkX2ZyZWVfcm9sZXP4ARVkZXZzX3NldF9nbG9iYWxfZmxhZ3P5ARdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc/oBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc/sBEGRldnNfanNvbl9lc2NhcGX8ARVkZXZzX2pzb25fZXNjYXBlX2NvcmX9AQ9kZXZzX2pzb25fcGFyc2X+AQpqc29uX3ZhbHVl/wEMcGFyc2Vfc3RyaW5ngAINc3RyaW5naWZ5X29iaoECCmFkZF9pbmRlbnSCAg9zdHJpbmdpZnlfZmllbGSDAhNkZXZzX2pzb25fc3RyaW5naWZ5hAIRcGFyc2Vfc3RyaW5nX2NvcmWFAhFkZXZzX21hcGxpa2VfaXRlcoYCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0hwISZGV2c19tYXBfY29weV9pbnRviAIMZGV2c19tYXBfc2V0iQIGbG9va3VwigITZGV2c19tYXBsaWtlX2lzX21hcIsCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc4wCEWRldnNfYXJyYXlfaW5zZXJ0jQIIa3ZfYWRkLjGOAhJkZXZzX3Nob3J0X21hcF9zZXSPAg9kZXZzX21hcF9kZWxldGWQAhJkZXZzX3Nob3J0X21hcF9nZXSRAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJICDmRldnNfcm9sZV9zcGVjkwISZGV2c19mdW5jdGlvbl9iaW5klAIRZGV2c19tYWtlX2Nsb3N1cmWVAg5kZXZzX2dldF9mbmlkeJYCE2RldnNfZ2V0X2ZuaWR4X2NvcmWXAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSYAhNkZXZzX2dldF9yb2xlX3Byb3RvmQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3mgIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkmwIVZGV2c19nZXRfc3RhdGljX3Byb3RvnAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvnQIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2eAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvnwIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkoAIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5koQIQZGV2c19pbnN0YW5jZV9vZqICD2RldnNfb2JqZWN0X2dldKMCDGRldnNfc2VxX2dldKQCDGRldnNfYW55X2dldKUCDGRldnNfYW55X3NldKYCDGRldnNfc2VxX3NldKcCDmRldnNfYXJyYXlfc2V0qAITZGV2c19hcnJheV9waW5fcHVzaKkCDGRldnNfYXJnX2ludKoCD2RldnNfYXJnX2RvdWJsZasCD2RldnNfcmV0X2RvdWJsZawCDGRldnNfcmV0X2ludK0CDWRldnNfcmV0X2Jvb2yuAg9kZXZzX3JldF9nY19wdHKvAhFkZXZzX2FyZ19zZWxmX21hcLACEWRldnNfc2V0dXBfcmVzdW1lsQIPZGV2c19jYW5fYXR0YWNosgIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZbMCFWRldnNfbWFwbGlrZV90b192YWx1ZbQCEmRldnNfcmVnY2FjaGVfZnJlZbUCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGy2AhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZLcCE2RldnNfcmVnY2FjaGVfYWxsb2O4AhRkZXZzX3JlZ2NhY2hlX2xvb2t1cLkCEWRldnNfcmVnY2FjaGVfYWdlugIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGW7AhJkZXZzX3JlZ2NhY2hlX25leHS8Ag9qZF9zZXR0aW5nc19nZXS9Ag9qZF9zZXR0aW5nc19zZXS+Ag5kZXZzX2xvZ192YWx1Zb8CD2RldnNfc2hvd192YWx1ZcACEGRldnNfc2hvd192YWx1ZTDBAg1jb25zdW1lX2NodW5rwgINc2hhXzI1Nl9jbG9zZcMCD2pkX3NoYTI1Nl9zZXR1cMQCEGpkX3NoYTI1Nl91cGRhdGXFAhBqZF9zaGEyNTZfZmluaXNoxgIUamRfc2hhMjU2X2htYWNfc2V0dXDHAhVqZF9zaGEyNTZfaG1hY19maW5pc2jIAg5qZF9zaGEyNTZfaGtkZskCDmRldnNfc3RyZm9ybWF0ygIOZGV2c19pc19zdHJpbmfLAg5kZXZzX2lzX251bWJlcswCFGRldnNfc3RyaW5nX2dldF91dGY4zQITZGV2c19idWlsdGluX3N0cmluZ84CFGRldnNfc3RyaW5nX3ZzcHJpbnRmzwITZGV2c19zdHJpbmdfc3ByaW50ZtACFWRldnNfc3RyaW5nX2Zyb21fdXRmONECFGRldnNfdmFsdWVfdG9fc3RyaW5n0gIQYnVmZmVyX3RvX3N0cmluZ9MCGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTUAhJkZXZzX3N0cmluZ19jb25jYXTVAhFkZXZzX3N0cmluZ19zbGljZdYCEmRldnNfcHVzaF90cnlmcmFtZdcCEWRldnNfcG9wX3RyeWZyYW1l2AIPZGV2c19kdW1wX3N0YWNr2QITZGV2c19kdW1wX2V4Y2VwdGlvbtoCCmRldnNfdGhyb3fbAhJkZXZzX3Byb2Nlc3NfdGhyb3fcAhBkZXZzX2FsbG9jX2Vycm9y3QIVZGV2c190aHJvd190eXBlX2Vycm9y3gIWZGV2c190aHJvd19yYW5nZV9lcnJvct8CHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcuACGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y4QIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh04gIYZGV2c190aHJvd190b29fYmlnX2Vycm9y4wIXZGV2c190aHJvd19zeW50YXhfZXJyb3LkAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl5QITZGV2c192YWx1ZV9mcm9tX2ludOYCFGRldnNfdmFsdWVfZnJvbV9ib29s5wIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLoAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZekCEWRldnNfdmFsdWVfdG9faW506gISZGV2c192YWx1ZV90b19ib29s6wIOZGV2c19pc19idWZmZXLsAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZe0CEGRldnNfYnVmZmVyX2RhdGHuAhNkZXZzX2J1ZmZlcmlzaF9kYXRh7wIUZGV2c192YWx1ZV90b19nY19vYmrwAg1kZXZzX2lzX2FycmF58QIRZGV2c192YWx1ZV90eXBlb2byAg9kZXZzX2lzX251bGxpc2jzAhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk9AIUZGV2c192YWx1ZV9hcHByb3hfZXH1AhJkZXZzX3ZhbHVlX2llZWVfZXH2Ah5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP3AhJkZXZzX2ltZ19zdHJpZHhfb2v4AhJkZXZzX2R1bXBfdmVyc2lvbnP5AgtkZXZzX3ZlcmlmefoCEWRldnNfZmV0Y2hfb3Bjb2Rl+wIOZGV2c192bV9yZXN1bWX8AhFkZXZzX3ZtX3NldF9kZWJ1Z/0CGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHP+AhhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnT/Ag9kZXZzX3ZtX3N1c3BlbmSAAxZkZXZzX3ZtX3NldF9icmVha3BvaW50gQMUZGV2c192bV9leGVjX29wY29kZXOCAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIMDEWRldnNfaW1nX2dldF91dGY4hAMUZGV2c19nZXRfc3RhdGljX3V0ZjiFAw9kZXZzX3ZtX3JvbGVfb2uGAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIcDDGV4cHJfaW52YWxpZIgDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0iQMLc3RtdDFfY2FsbDCKAwtzdG10Ml9jYWxsMYsDC3N0bXQzX2NhbGwyjAMLc3RtdDRfY2FsbDONAwtzdG10NV9jYWxsNI4DC3N0bXQ2X2NhbGw1jwMLc3RtdDdfY2FsbDaQAwtzdG10OF9jYWxsN5EDC3N0bXQ5X2NhbGw4kgMSc3RtdDJfaW5kZXhfZGVsZXRlkwMMc3RtdDFfcmV0dXJulAMJc3RtdHhfam1wlQMMc3RtdHgxX2ptcF96lgMKZXhwcjJfYmluZJcDEmV4cHJ4X29iamVjdF9maWVsZJgDEnN0bXR4MV9zdG9yZV9sb2NhbJkDE3N0bXR4MV9zdG9yZV9nbG9iYWyaAxJzdG10NF9zdG9yZV9idWZmZXKbAwlleHByMF9pbmacAxBleHByeF9sb2FkX2xvY2FsnQMRZXhwcnhfbG9hZF9nbG9iYWyeAwtleHByMV91cGx1c58DC2V4cHIyX2luZGV4oAMPc3RtdDNfaW5kZXhfc2V0oQMUZXhwcngxX2J1aWx0aW5fZmllbGSiAxJleHByeDFfYXNjaWlfZmllbGSjAxFleHByeDFfdXRmOF9maWVsZKQDEGV4cHJ4X21hdGhfZmllbGSlAw5leHByeF9kc19maWVsZKYDD3N0bXQwX2FsbG9jX21hcKcDEXN0bXQxX2FsbG9jX2FycmF5qAMSc3RtdDFfYWxsb2NfYnVmZmVyqQMRZXhwcnhfc3RhdGljX3JvbGWqAxNleHByeF9zdGF0aWNfYnVmZmVyqwMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nrAMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ60DGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ64DFWV4cHJ4X3N0YXRpY19mdW5jdGlvbq8DDWV4cHJ4X2xpdGVyYWywAxFleHByeF9saXRlcmFsX2Y2NLEDEGV4cHJ4X3JvbGVfcHJvdG+yAxFleHByM19sb2FkX2J1ZmZlcrMDDWV4cHIwX3JldF92YWy0AwxleHByMV90eXBlb2a1Aw9leHByMF91bmRlZmluZWS2AxJleHByMV9pc191bmRlZmluZWS3AwpleHByMF90cnVluAMLZXhwcjBfZmFsc2W5Aw1leHByMV90b19ib29sugMJZXhwcjBfbmFuuwMJZXhwcjFfYWJzvAMNZXhwcjFfYml0X25vdL0DDGV4cHIxX2lzX25hbr4DCWV4cHIxX25lZ78DCWV4cHIxX25vdMADDGV4cHIxX3RvX2ludMEDCWV4cHIyX2FkZMIDCWV4cHIyX3N1YsMDCWV4cHIyX211bMQDCWV4cHIyX2RpdsUDDWV4cHIyX2JpdF9hbmTGAwxleHByMl9iaXRfb3LHAw1leHByMl9iaXRfeG9yyAMQZXhwcjJfc2hpZnRfbGVmdMkDEWV4cHIyX3NoaWZ0X3JpZ2h0ygMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTLAwhleHByMl9lccwDCGV4cHIyX2xlzQMIZXhwcjJfbHTOAwhleHByMl9uZc8DFXN0bXQxX3Rlcm1pbmF0ZV9maWJlctADFHN0bXR4Ml9zdG9yZV9jbG9zdXJl0QMTZXhwcngxX2xvYWRfY2xvc3VyZdIDEmV4cHJ4X21ha2VfY2xvc3VyZdMDEGV4cHIxX3R5cGVvZl9zdHLUAwxleHByMF9ub3dfbXPVAxZleHByMV9nZXRfZmliZXJfaGFuZGxl1gMQc3RtdDJfY2FsbF9hcnJhedcDCXN0bXR4X3RyedgDDXN0bXR4X2VuZF90cnnZAwtzdG10MF9jYXRjaNoDDXN0bXQwX2ZpbmFsbHnbAwtzdG10MV90aHJvd9wDDnN0bXQxX3JlX3Rocm933QMQc3RtdHgxX3Rocm93X2ptcN4DDnN0bXQwX2RlYnVnZ2Vy3wMJZXhwcjFfbmV34AMRZXhwcjJfaW5zdGFuY2Vfb2bhAwpleHByMF9udWxs4gMPZXhwcjJfYXBwcm94X2Vx4wMPZXhwcjJfYXBwcm94X25l5AMPZGV2c192bV9wb3BfYXJn5QMTZGV2c192bV9wb3BfYXJnX3UzMuYDE2RldnNfdm1fcG9wX2FyZ19pMzLnAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy6AMSamRfYWVzX2NjbV9lbmNyeXB06QMSamRfYWVzX2NjbV9kZWNyeXB06gMMQUVTX2luaXRfY3R46wMPQUVTX0VDQl9lbmNyeXB07AMQamRfYWVzX3NldHVwX2tlee0DDmpkX2Flc19lbmNyeXB07gMQamRfYWVzX2NsZWFyX2tlee8DC2pkX3dzc2tfbmV38AMUamRfd3Nza19zZW5kX21lc3NhZ2XxAxNqZF93ZWJzb2NrX29uX2V2ZW508gMHZGVjcnlwdPMDDWpkX3dzc2tfY2xvc2X0AxBqZF93c3NrX29uX2V2ZW509QMLcmVzcF9zdGF0dXP2AxJ3c3NraGVhbHRoX3Byb2Nlc3P3AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZfgDFHdzc2toZWFsdGhfcmVjb25uZWN0+QMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0+gMPc2V0X2Nvbm5fc3RyaW5n+wMRY2xlYXJfY29ubl9zdHJpbmf8Aw93c3NraGVhbHRoX2luaXT9AxF3c3NrX3NlbmRfbWVzc2FnZf4DEXdzc2tfaXNfY29ubmVjdGVk/wMSd3Nza19zZXJ2aWNlX3F1ZXJ5gAQUZGV2c190cmFja19leGNlcHRpb26BBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplggQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYMED3JvbGVtZ3JfcHJvY2Vzc4QEEHJvbGVtZ3JfYXV0b2JpbmSFBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSGBBRqZF9yb2xlX21hbmFnZXJfaW5pdIcEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZIgEDWpkX3JvbGVfYWxsb2OJBBBqZF9yb2xlX2ZyZWVfYWxsigQWamRfcm9sZV9mb3JjZV9hdXRvYmluZIsEE2pkX2NsaWVudF9sb2dfZXZlbnSMBBNqZF9jbGllbnRfc3Vic2NyaWJljQQUamRfY2xpZW50X2VtaXRfZXZlbnSOBBRyb2xlbWdyX3JvbGVfY2hhbmdlZI8EEGpkX2RldmljZV9sb29rdXCQBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WRBBNqZF9zZXJ2aWNlX3NlbmRfY21kkgQRamRfY2xpZW50X3Byb2Nlc3OTBA5qZF9kZXZpY2VfZnJlZZQEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0lQQPamRfZGV2aWNlX2FsbG9jlgQPamRfY3RybF9wcm9jZXNzlwQVamRfY3RybF9oYW5kbGVfcGFja2V0mAQMamRfY3RybF9pbml0mQQUZGNmZ19zZXRfdXNlcl9jb25maWeaBAlkY2ZnX2luaXSbBA1kY2ZnX3ZhbGlkYXRlnAQOZGNmZ19nZXRfZW50cnmdBAxkY2ZnX2dldF9pMzKeBAxkY2ZnX2dldF91MzKfBA9kY2ZnX2dldF9zdHJpbmegBAxkY2ZnX2lkeF9rZXmhBAlqZF92ZG1lc2eiBBFqZF9kbWVzZ19zdGFydHB0cqMEDWpkX2RtZXNnX3JlYWSkBBJqZF9kbWVzZ19yZWFkX2xpbmWlBBNqZF9zZXR0aW5nc19nZXRfYmlupgQNamRfZnN0b3JfaW5pdKcEE2pkX3NldHRpbmdzX3NldF9iaW6oBAtqZF9mc3Rvcl9nY6kED3JlY29tcHV0ZV9jYWNoZaoEFWpkX3NldHRpbmdzX2dldF9sYXJnZasEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2WsBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZa0EFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2WuBA1qZF9pcGlwZV9vcGVurwQWamRfaXBpcGVfaGFuZGxlX3BhY2tldLAEDmpkX2lwaXBlX2Nsb3NlsQQSamRfbnVtZm10X2lzX3ZhbGlksgQVamRfbnVtZm10X3dyaXRlX2Zsb2F0swQTamRfbnVtZm10X3dyaXRlX2kzMrQEEmpkX251bWZtdF9yZWFkX2kzMrUEFGpkX251bWZtdF9yZWFkX2Zsb2F0tgQRamRfb3BpcGVfb3Blbl9jbWS3BBRqZF9vcGlwZV9vcGVuX3JlcG9ydLgEFmpkX29waXBlX2hhbmRsZV9wYWNrZXS5BBFqZF9vcGlwZV93cml0ZV9leLoEEGpkX29waXBlX3Byb2Nlc3O7BBRqZF9vcGlwZV9jaGVja19zcGFjZbwEDmpkX29waXBlX3dyaXRlvQQOamRfb3BpcGVfY2xvc2W+BA1qZF9xdWV1ZV9wdXNovwQOamRfcXVldWVfZnJvbnTABA5qZF9xdWV1ZV9zaGlmdMEEDmpkX3F1ZXVlX2FsbG9jwgQNamRfcmVzcG9uZF91OMMEDmpkX3Jlc3BvbmRfdTE2xAQOamRfcmVzcG9uZF91MzLFBBFqZF9yZXNwb25kX3N0cmluZ8YEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkxwQLamRfc2VuZF9wa3TIBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbMkEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyygQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldMsEFGpkX2FwcF9oYW5kbGVfcGFja2V0zAQVamRfYXBwX2hhbmRsZV9jb21tYW5kzQQVYXBwX2dldF9pbnN0YW5jZV9uYW1lzgQTamRfYWxsb2NhdGVfc2VydmljZc8EEGpkX3NlcnZpY2VzX2luaXTQBA5qZF9yZWZyZXNoX25vd9EEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTSBBRqZF9zZXJ2aWNlc19hbm5vdW5jZdMEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l1AQQamRfc2VydmljZXNfdGlja9UEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ9YEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl1wQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZdgEFGFwcF9nZXRfZGV2aWNlX2NsYXNz2QQSYXBwX2dldF9md192ZXJzaW9u2gQNamRfc3J2Y2ZnX3J1btsEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l3AQRamRfc3J2Y2ZnX3ZhcmlhbnTdBA1qZF9oYXNoX2ZudjFh3gQMamRfZGV2aWNlX2lk3wQJamRfcmFuZG9t4AQIamRfY3JjMTbhBA5qZF9jb21wdXRlX2NyY+IEDmpkX3NoaWZ0X2ZyYW1l4wQMamRfd29yZF9tb3Zl5AQOamRfcmVzZXRfZnJhbWXlBBBqZF9wdXNoX2luX2ZyYW1l5gQNamRfcGFuaWNfY29yZecEE2pkX3Nob3VsZF9zYW1wbGVfbXPoBBBqZF9zaG91bGRfc2FtcGxl6QQJamRfdG9faGV46gQLamRfZnJvbV9oZXjrBA5qZF9hc3NlcnRfZmFpbOwEB2pkX2F0b2ntBAtqZF92c3ByaW50Zu4ED2pkX3ByaW50X2RvdWJsZe8ECmpkX3NwcmludGbwBBJqZF9kZXZpY2Vfc2hvcnRfaWTxBAxqZF9zcHJpbnRmX2HyBAtqZF90b19oZXhfYfMECWpkX3N0cmR1cPQECWpkX21lbWR1cPUEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWX2BBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVl9wQRamRfc2VuZF9ldmVudF9leHT4BApqZF9yeF9pbml0+QQUamRfcnhfZnJhbWVfcmVjZWl2ZWT6BB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja/sED2pkX3J4X2dldF9mcmFtZfwEE2pkX3J4X3JlbGVhc2VfZnJhbWX9BBFqZF9zZW5kX2ZyYW1lX3Jhd/4EDWpkX3NlbmRfZnJhbWX/BApqZF90eF9pbml0gAUHamRfc2VuZIEFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOCBQ9qZF90eF9nZXRfZnJhbWWDBRBqZF90eF9mcmFtZV9zZW50hAULamRfdHhfZmx1c2iFBRBfX2Vycm5vX2xvY2F0aW9uhgUMX19mcGNsYXNzaWZ5hwUFZHVtbXmIBQhfX21lbWNweYkFB21lbW1vdmWKBQZtZW1zZXSLBQpfX2xvY2tmaWxljAUMX191bmxvY2tmaWxljQUGZmZsdXNojgUEZm1vZI8FDV9fRE9VQkxFX0JJVFOQBQxfX3N0ZGlvX3NlZWuRBQ1fX3N0ZGlvX3dyaXRlkgUNX19zdGRpb19jbG9zZZMFCF9fdG9yZWFklAUJX190b3dyaXRllQUJX19md3JpdGV4lgUGZndyaXRllwUUX19wdGhyZWFkX211dGV4X2xvY2uYBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrmQUGX19sb2NrmgUIX191bmxvY2ubBQ5fX21hdGhfZGl2emVyb5wFCmZwX2JhcnJpZXKdBQ5fX21hdGhfaW52YWxpZJ4FA2xvZ58FBXRvcDE2oAUFbG9nMTChBQdfX2xzZWVrogUGbWVtY21wowUKX19vZmxfbG9ja6QFDF9fb2ZsX3VubG9ja6UFDF9fbWF0aF94Zmxvd6YFDGZwX2JhcnJpZXIuMacFDF9fbWF0aF9vZmxvd6gFDF9fbWF0aF91Zmxvd6kFBGZhYnOqBQNwb3erBQV0b3AxMqwFCnplcm9pbmZuYW6tBQhjaGVja2ludK4FDGZwX2JhcnJpZXIuMq8FCmxvZ19pbmxpbmWwBQpleHBfaW5saW5lsQULc3BlY2lhbGNhc2WyBQ1mcF9mb3JjZV9ldmFsswUFcm91bmS0BQZzdHJjaHK1BQtfX3N0cmNocm51bLYFBnN0cmNtcLcFBnN0cmxlbrgFB19fdWZsb3e5BQdfX3NobGltugUIX19zaGdldGO7BQdpc3NwYWNlvAUGc2NhbGJuvQUJY29weXNpZ25svgUHc2NhbGJubL8FDV9fZnBjbGFzc2lmeWzABQVmbW9kbMEFBWZhYnNswgULX19mbG9hdHNjYW7DBQhoZXhmbG9hdMQFCGRlY2Zsb2F0xQUHc2NhbmV4cMYFBnN0cnRveMcFBnN0cnRvZMgFEl9fd2FzaV9zeXNjYWxsX3JldMkFCGRsbWFsbG9jygUGZGxmcmVlywUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXplzAUEc2Jya80FCF9fYWRkdGYzzgUJX19hc2hsdGkzzwUHX19sZXRmMtAFB19fZ2V0ZjLRBQhfX2RpdnRmM9IFDV9fZXh0ZW5kZGZ0ZjLTBQ1fX2V4dGVuZHNmdGYy1AULX19mbG9hdHNpdGbVBQ1fX2Zsb2F0dW5zaXRm1gUNX19mZV9nZXRyb3VuZNcFEl9fZmVfcmFpc2VfaW5leGFjdNgFCV9fbHNocnRpM9kFCF9fbXVsdGYz2gUIX19tdWx0aTPbBQlfX3Bvd2lkZjLcBQhfX3N1YnRmM90FDF9fdHJ1bmN0ZmRmMt4FC3NldFRlbXBSZXQw3wULZ2V0VGVtcFJldDDgBQlzdGFja1NhdmXhBQxzdGFja1Jlc3RvcmXiBQpzdGFja0FsbG9j4wUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudOQFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOUFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXmBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl5wUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k6AUMZHluQ2FsbF9qaWpp6QUWbGVnYWxzdHViJGR5bkNhbGxfamlqaeoFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAegFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
