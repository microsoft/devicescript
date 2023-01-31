
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABsoKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/fn5+fgBgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAF+AX9gA39+fwF+YAABfmABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBfmACf3wBfGACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8Cu4WAgAAVA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABsDZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAYDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAGFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQdmZF9zZWVrAA0DtIWAgACyBQcBAAcHBwAABwQACAcHBgYcCAAAAgMCAAcHAgQDAwMAEgcSBwcDBQcCBwcDCQYGBgYHAAgGFh0MDQYCBQMFAAACAgACBQAAAAIBBQYGAQAHBQUAAAAHBAMEAgICCAMABQADAgICAAMDAwMGAAAAAgEABgAGBgMCAgICAwQDAwMGAggAAwEBAAAAAAAAAQAAAAAAAAAAAAAAAAABAAEBAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAwAAgIAAQEBAAEAAAEAAAwAAQIAAQIDBAYBAgAAAgAACAkDAQUGAwUJBQUGBQYDBQUJDQUDAwYGAwMDAwUGBQUFBQUFAw4PAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB4fAwQGAgUFBQEBBQUBAwICAQUMBQEFBQEEBQIAAgIGAA8PAgIFDgMDAwMGBgMDAwQGAQMAAwMEAgADAgYABAYGAwUBAQICAgICAgICAgICAgICAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAgQEAQwNAgIAAAcJAwEDBwEAAAgAAgUABwYDCAkEBAAAAgcAAwcHBAECAQAQAwkHAAAEAAIHBgAABCABAw4DAwAJBwMGBAMEAAQDAwMDBAQGBgAAAAQHBwcHBAcHBwgIAxIIAwAEAQAJAQMDAQMFBAkhCRcDAxAEAwYDBwcFBwQECAAEBAcJBwgABwgTBAYGBgQABBgiEQYEBAQGCQQEAAAUCgoKEwoRBggHIwoUFAoYExAQCiQlJicKAwMDBAQXBAQZCxUoCykFFiorBQ4EBAAIBAsVGhoLDywCAggIFQsLGQstAAgIAAQIBwgICC4NLwSHgICAAAFwAcYBxgEFhoCAgAABAYACgAIGz4CAgAAMfwFBwNsFC38BQQALfwFBAAt/AUEAC38AQYjHAQt/AEGEyAELfwBB8sgBC38AQcLJAQt/AEHjyQELfwBB6MsBC38AQYjHAQt/AEHezAELB82FgIAAIQZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAVEF9fZXJybm9fbG9jYXRpb24A4QQZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABm1hbGxvYwClBQRmcmVlAKYFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkADARamRfZW1fZGV2c19kZXBsb3kAMRFqZF9lbV9kZXZzX3ZlcmlmeQAyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwA0Fl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBBxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwUaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDBhRfX2VtX2pzX19lbV90aW1lX25vdwMHIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwgZX19lbV9qc19fZW1fY29uc29sZV9kZWJ1ZwMJBmZmbHVzaADpBBVlbXNjcmlwdGVuX3N0YWNrX2luaXQAwAUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQDBBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAMIFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZADDBQlzdGFja1NhdmUAvAUMc3RhY2tSZXN0b3JlAL0FCnN0YWNrQWxsb2MAvgUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudAC/BQ1fX3N0YXJ0X2VtX2pzAwoMX19zdG9wX2VtX2pzAwsMZHluQ2FsbF9qaWppAMUFCYCDgIAAAQBBAQvFASo7QkNERVdYZltdb3B0Z27XAfkB/gGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+AcABwQHCAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHS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AUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQnwIiAkUNAAJAIAIoAgQNACACIABBIBD3ATYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQvQILIAEgASkDCDcDACAAIAJB9gAgARDDAiAAIAIQngILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEJ8CIgJFDQACQCACKAIEDQAgAiAAQR4Q9wE2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEL0CCyABIAEpAwg3AwAgACACQfYAIAEQwwIgACACEJ4CCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQiAICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEIgCCyADQSBqJAALqQEBA38jAEEQayIBJAACQAJAIAAtAENBAUsNACABQQhqIABBqSJBABDMAgwBCwJAIABBABCZAiICQXtqQXtLDQAgAUEIaiAAQZgiQQAQzAIMAQsgACAALQBDQX9qIgM6AEMgAEHYAGogAEHgAGogA0H/AXFBf2oiA0EDdBDlBBogACADIAIQfyICRQ0AIAAoAqwBIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQhgIiBEHPhgNLDQAgASgApAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQZ0dIANBCGoQzwIMAQsgACABIAEoAqABIARB//8DcRCBAiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEPcBEI8BEN0CIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCNASADQdAAakH7ABC9AiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQlgIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEP8BIAMgACkDADcDECABIANBEGoQjgELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQhgIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEM4CDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8B8MIBTg0CIABB0NsAIAFBA3RqLwEAEL0CDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQYMSQec1QThBuikQxAQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDeApsQmwILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ3gKcEJsCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEN4CEI8FEJsCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrENsCCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahDeAiIERAAAAAAAAAAAY0UNACAAIASaEJsCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAELgEuEQAAAAAAADwPaIQmwILZAEFfwJAAkAgAEEAEJkCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQuAQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRCcAgsRACAAIABBABCaAhD6BBCbAgsYACAAIABBABCaAiAAQQEQmgIQhgUQmwILLgEDfyAAQQAQmQIhAUEAIQICQCAAQQEQmQIiA0UNACABIANtIQILIAAgAhCcAgsuAQN/IABBABCZAiEBQQAhAgJAIABBARCZAiIDRQ0AIAEgA28hAgsgACACEJwCCxYAIAAgAEEAEJkCIABBARCZAmwQnAILCQAgAEEBEL8BC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEN8CIQMgAiACKQMgNwMQIAAgAkEQahDfAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ3gIhBiACIAIpAyA3AwAgACACEN4CIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkD8GI3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQvwELhAECA38BfiMAQSBrIgEkACABIABB2ABqKQMANwMYIAEgAEHgAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahCKAiECIAEgASkDEDcDACAAIAEQjgIiA0UNACACRQ0AIAAgAiADEPgBCyAAKAKsASABKQMYNwMgIAFBIGokAAsJACAAQQEQwwELmgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEI4CIgNFDQAgAEEAEJEBIgRFDQAgAkEgaiAAQQggBBDdAiACIAIpAyA3AxAgACACQRBqEI0BIAAgAyAEIAEQ/AEgAiACKQMgNwMIIAAgAkEIahCOASAAKAKsASACKQMgNwMgCyACQTBqJAALCQAgAEEAEMMBC+MBAgN/AX4jAEHAAGsiASQAIAEgAEHYAGopAwAiBDcDOCABIABB4ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqEOUCIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQzgIMAQsgASABKQMwNwMYAkAgACABQRhqEI4CIgMNACABIAEpAzA3AxAg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EGogA0EcahCCAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUHwGSADQQhqEM8CQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCADKAIcIgJB//8BRw0AIABCADcDAAwBCyAAIAI2AgAgAEECNgIECyADQTBqJAALiQECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQggIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFB8BkgA0EIahDPAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwEANgIAIABBBDYCBAsgA0EwaiQAC4YBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEIICIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQfAZIANBCGoQzwJBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BAkH/H3EQ2wILIANBMGokAAvOAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEIICIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQfAZIAFBEGoQzwJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQeMZIAFBCGoQzwJBACEDCwJAIAMiA0UNACAAIAMQ2AEgACABKAIkIAMvAQIQ5gELIAFBwABqJAALbwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQzgIMAQsgACABKAK0ASACKAIAQQxsaigCACgCEEEARxDcAgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahDOAkH//wEhAgwBCyABKAIoIQILAkAgAiICQf//AUYNACAAQQAQmQIhAyABIABB4ABqKQMAIgY3AyggASAGNwMIIAAgAUEIaiABQRxqEOQCIQQCQCADQYCABEkNACABQSBqIABB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0AFBAELAADcC7NABQQBBqNABNgLo0AFBAEGg0QE2AqTQAQv5AQEDfwJAIAFFDQBBAEEAKALw0AEgAWo2AvDQASABIQEgACEAA0AgACEAIAEhAQJAQQAoAuzQASICQcAARw0AIAFBwABJDQBB9NABIAAQsQIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgC6NABIAAgASACIAEgAkkbIgIQ5AQaQQBBACgC7NABIgMgAms2AuzQASAAIAJqIQAgASACayEEAkAgAyACRw0AQfTQAUGo0AEQsQJBAEHAADYC7NABQQBBqNABNgLo0AEgBCEBIAAhACAEDQEMAgtBAEEAKALo0AEgAmo2AujQASAEIQEgACEAIAQNAAsLC0wAQaTQARCyAhogAEEYakEAKQO40QE3AAAgAEEQakEAKQOw0QE3AAAgAEEIakEAKQOo0QE3AAAgAEEAKQOg0QE3AABBAEEAOgCg0AEL2QcBA39BAEIANwP40QFBAEIANwPw0QFBAEIANwPo0QFBAEIANwPg0QFBAEIANwPY0QFBAEIANwPQ0QFBAEIANwPI0QFBAEIANwPA0QECQAJAAkACQCABQcEASQ0AECFBAC0AoNABDQJBAEEBOgCg0AEQIkEAIAE2AvDQAUEAQcAANgLs0AFBAEGo0AE2AujQAUEAQaDRATYCpNABQQBCq7OP/JGjs/DbADcCjNEBQQBC/6S5iMWR2oKbfzcChNEBQQBC8ua746On/aelfzcC/NABQQBC58yn0NbQ67O7fzcC9NABIAEhASAAIQACQANAIAAhACABIQECQEEAKALs0AEiAkHAAEcNACABQcAASQ0AQfTQASAAELECIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAujQASAAIAEgAiABIAJJGyICEOQEGkEAQQAoAuzQASIDIAJrNgLs0AEgACACaiEAIAEgAmshBAJAIAMgAkcNAEH00AFBqNABELECQQBBwAA2AuzQAUEAQajQATYC6NABIAQhASAAIQAgBA0BDAILQQBBACgC6NABIAJqNgLo0AEgBCEBIAAhACAEDQALC0Gk0AEQsgIaQQBBACkDuNEBNwPY0QFBAEEAKQOw0QE3A9DRAUEAQQApA6jRATcDyNEBQQBBACkDoNEBNwPA0QFBAEEAOgCg0AFBACEBDAELQcDRASAAIAEQ5AQaQQAhAQsDQCABIgFBwNEBaiIAIAAtAABBNnM6AAAgAUEBaiIAIQEgAEHAAEcNAAwCCwALQdY5QQ5BixoQvwQACxAhAkBBAC0AoNABDQBBAEEBOgCg0AEQIkEAQsCAgIDwzPmE6gA3AvDQAUEAQcAANgLs0AFBAEGo0AE2AujQAUEAQaDRATYCpNABQQBBmZqD3wU2ApDRAUEAQozRldi5tfbBHzcCiNEBQQBCuuq/qvrPlIfRADcCgNEBQQBChd2e26vuvLc8NwL40AFBwAAhAUHA0QEhAAJAA0AgACEAIAEhAQJAQQAoAuzQASICQcAARw0AIAFBwABJDQBB9NABIAAQsQIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgC6NABIAAgASACIAEgAkkbIgIQ5AQaQQBBACgC7NABIgMgAms2AuzQASAAIAJqIQAgASACayEEAkAgAyACRw0AQfTQAUGo0AEQsQJBAEHAADYC7NABQQBBqNABNgLo0AEgBCEBIAAhACAEDQEMAgtBAEEAKALo0AEgAmo2AujQASAEIQEgACEAIAQNAAsLDwtB1jlBDkGLGhC/BAAL+QYBBX9BpNABELICGiAAQRhqQQApA7jRATcAACAAQRBqQQApA7DRATcAACAAQQhqQQApA6jRATcAACAAQQApA6DRATcAAEEAQQA6AKDQARAhAkBBAC0AoNABDQBBAEEBOgCg0AEQIkEAQquzj/yRo7Pw2wA3AozRAUEAQv+kuYjFkdqCm383AoTRAUEAQvLmu+Ojp/2npX83AvzQAUEAQufMp9DW0Ouzu383AvTQAUEAQsAANwLs0AFBAEGo0AE2AujQAUEAQaDRATYCpNABQQAhAQNAIAEiAUHA0QFqIgIgAi0AAEHqAHM6AAAgAUEBaiICIQEgAkHAAEcNAAtBAEHAADYC8NABQcAAIQFBwNEBIQICQANAIAIhAiABIQECQEEAKALs0AEiA0HAAEcNACABQcAASQ0AQfTQASACELECIAFBQGoiAyEBIAJBwABqIQIgAw0BDAILQQAoAujQASACIAEgAyABIANJGyIDEOQEGkEAQQAoAuzQASIEIANrNgLs0AEgAiADaiECIAEgA2shBQJAIAQgA0cNAEH00AFBqNABELECQQBBwAA2AuzQAUEAQajQATYC6NABIAUhASACIQIgBQ0BDAILQQBBACgC6NABIANqNgLo0AEgBSEBIAIhAiAFDQALC0EAQQAoAvDQAUEgajYC8NABQSAhASAAIQICQANAIAIhAiABIQECQEEAKALs0AEiA0HAAEcNACABQcAASQ0AQfTQASACELECIAFBQGoiAyEBIAJBwABqIQIgAw0BDAILQQAoAujQASACIAEgAyABIANJGyIDEOQEGkEAQQAoAuzQASIEIANrNgLs0AEgAiADaiECIAEgA2shBQJAIAQgA0cNAEH00AFBqNABELECQQBBwAA2AuzQAUEAQajQATYC6NABIAUhASACIQIgBQ0BDAILQQBBACgC6NABIANqNgLo0AEgBSEBIAIhAiAFDQALC0Gk0AEQsgIaIABBGGpBACkDuNEBNwAAIABBEGpBACkDsNEBNwAAIABBCGpBACkDqNEBNwAAIABBACkDoNEBNwAAQQBCADcDwNEBQQBCADcDyNEBQQBCADcD0NEBQQBCADcD2NEBQQBCADcD4NEBQQBCADcD6NEBQQBCADcD8NEBQQBCADcD+NEBQQBBADoAoNABDwtB1jlBDkGLGhC/BAAL7QcBAX8gACABELYCAkAgA0UNAEEAQQAoAvDQASADajYC8NABIAMhAyACIQEDQCABIQEgAyEDAkBBACgC7NABIgBBwABHDQAgA0HAAEkNAEH00AEgARCxAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALo0AEgASADIAAgAyAASRsiABDkBBpBAEEAKALs0AEiCSAAazYC7NABIAEgAGohASADIABrIQICQCAJIABHDQBB9NABQajQARCxAkEAQcAANgLs0AFBAEGo0AE2AujQASACIQMgASEBIAINAQwCC0EAQQAoAujQASAAajYC6NABIAIhAyABIQEgAg0ACwsgCBC3AiAIQSAQtgICQCAFRQ0AQQBBACgC8NABIAVqNgLw0AEgBSEDIAQhAQNAIAEhASADIQMCQEEAKALs0AEiAEHAAEcNACADQcAASQ0AQfTQASABELECIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAujQASABIAMgACADIABJGyIAEOQEGkEAQQAoAuzQASIJIABrNgLs0AEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEH00AFBqNABELECQQBBwAA2AuzQAUEAQajQATYC6NABIAIhAyABIQEgAg0BDAILQQBBACgC6NABIABqNgLo0AEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALw0AEgB2o2AvDQASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAuzQASIAQcAARw0AIANBwABJDQBB9NABIAEQsQIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgC6NABIAEgAyAAIAMgAEkbIgAQ5AQaQQBBACgC7NABIgkgAGs2AuzQASABIABqIQEgAyAAayECAkAgCSAARw0AQfTQAUGo0AEQsQJBAEHAADYC7NABQQBBqNABNgLo0AEgAiEDIAEhASACDQEMAgtBAEEAKALo0AEgAGo2AujQASACIQMgASEBIAINAAsLQQBBACgC8NABQQFqNgLw0AFBASEDQbDRACEBAkADQCABIQEgAyEDAkBBACgC7NABIgBBwABHDQAgA0HAAEkNAEH00AEgARCxAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALo0AEgASADIAAgAyAASRsiABDkBBpBAEEAKALs0AEiCSAAazYC7NABIAEgAGohASADIABrIQICQCAJIABHDQBB9NABQajQARCxAkEAQcAANgLs0AFBAEGo0AE2AujQASACIQMgASEBIAINAQwCC0EAQQAoAujQASAAajYC6NABIAIhAyABIQEgAg0ACwsgCBC3AguuBwIIfwF+IwBBgAFrIggkAAJAIARFDQAgA0EAOgAACyAHIQdBACEJQQAhCgNAIAohCyAHIQxBACEKAkAgCSIJIAJGDQAgASAJai0AACEKCyAJQQFqIQcCQAJAAkACQAJAIAoiCkH/AXEiDUH7AEcNACAHIAJJDQELIA1B/QBHDQEgByACTw0BIAohCiAJQQJqIAcgASAHai0AAEH9AEYbIQcMAgsgCUECaiENAkAgASAHai0AACIHQfsARw0AIAchCiANIQcMAgsCQAJAIAdBUGpB/wFxQQlLDQAgB8BBUGohCQwBC0F/IQkgB0EgciIHQZ9/akH/AXFBGUsNACAHwEGpf2ohCQsCQCAJIgpBAE4NAEEhIQogDSEHDAILIA0hByANIQkCQCANIAJPDQADQAJAIAEgByIHai0AAEH9AEcNACAHIQkMAgsgB0EBaiIJIQcgCSACRw0ACyACIQkL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IAJBEGoQLwwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEHkFSACEC8LIAJBwABqJAALggUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQAgASEBA0AgACABIgEoAgAiAjYCJCABKAIMEB8gARAfIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDXAiECCyACIgJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhASACQQAoApjVASIAIAJBxABqKAIAIgMgACADa0EASBsiADYCFCACQShqIgMgAisDGCAAIAFruKIgAysDAKA5AwACQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQ1wIhAgsgAiICRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDXAiECCyACIgJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUGw4gAQpgRB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgCmNUBIAFqNgIcCwu6AgEFfyACQQFqIQMgAUHDwgAgARshBAJAAkAgACgCJCIBDQAgASEFDAELIAEhBgNAAkAgBiIBKAIMIgZFDQAgBiAEIAMQ/gQNACABIQUMAgsgASgCACIBIQYgASEFIAENAAsLIAUiBiEBAkAgBg0AQcgAEB4iAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUHAAGpBACgCmNUBIgU2AgAgASgCECIHIQYCQCAHDQACQAJAIAAtABJF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ENYDIAEQ1wMhAyABENcDIQQgAkEQaiABQQEQ2QMCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBKCyACQSBqJAALDQAgAEEAKQP4YjcDAAs3AQF/AkAgAigCTCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIQBCzgBAX8CQCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIQBC3EBAX8jAEEgayIDJAAgA0EYaiACENYDIAMgAykDGDcDEAJAAkACQCADQRBqELsCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDeAhDaAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACENYDIANBEGogAhDWAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQlQIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABENYDIAJBIGogARDWAyACQRhqIAEQ1gMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCWAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDWAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQ6wINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIQBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQkwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDWAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQ6wINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIQBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQkwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDWAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQ6wINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIQBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQkwILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ6wINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIQBCyACQQAQ9wEhBCADIAMpAxA3AwAgACACIAQgAxCRAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ6wINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIQBCyACQRUQ9wEhBCADIAMpAxA3AwAgACACIAQgAxCRAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEPcBEI8BIgMNACABQRAQVQsgASgCrAEhBCACQQhqIAFBCCADEN0CIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDXAyIDEJEBIgQNACABIANBA3RBEGoQVQsgASgCrAEhAyACQQhqIAFBCCAEEN0CIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDXAyIDEJIBIgQNACABIANBDGoQVQsgASgCrAEhAyACQQhqIAFBCCAEEN0CIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCEASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBDrAg0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhAELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEOsCDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCEAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQ6wINACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIQBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBDrAg0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhAELIANBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKAJMIgQgAigApAFBJGooAgBBBHZJDQAgA0EIaiACQfgAEIQBIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAJMENsCC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQhAELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCEASAAQgA3AwAMAQsgACACQQggAiAEEIkCEN0CCyADQRBqJAALXwEDfyMAQRBrIgMkACACENcDIQQgAhDXAyEFIANBCGogAkECENkDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBKCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDWAyADIAMpAwg3AwAgACACIAMQ5wIQ2wIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDWAyAAQeDiAEHo4gAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA+BiNwMACw0AIABBACkD6GI3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ1gMgAyADKQMINwMA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Qal/aiEBCyABQX9HDQEgAi0AASIBRSEEIAEhAyACQQFqIQIgAQ0ACyAHIQIMAgsCQCAFQQFxRQ0AIAchAgwCCwJAAkAgAw0AIATAQVBqIQEMAQtBfyEBIARBIHIiBEGff2pB/wFxQQVLDQAgBMBBqX9qIQELIAEhASACQQFqIQICQAJAIAgNACAHIQYgAUEEdEGAAnIhBQwBCyAHIAEgCHI6AAAgB0EBaiEGQQAhBQsgAi0AACIHRSEEIAchAyACIQEgBSEFIAYiAiEGIAIhAiAHDQALCyACIABrCzMBAX8jAEEQayIEJAAgBCADNgIMIAQgAjYCCCAEIAE2AgQgBCAANgIAQcEUIAQQLxAaAAtYAQR/IAAgAC0AACIBQS1GaiEAQQAhAgNAIAAiA0EBaiEAIAMsAABBUGoiAyACIgJBCmxqIAIgA0H/AXFBCkkiAxsiBCECIAMNAAtBACAEayAEIAFBLUYbC/kKAQt/IwBBwABrIgQkACAAIAFqIQUgBEF/aiEGIARBAXIhByAEQQJyIQggAEEARyEJIAIhASADIQogAiECIAAhAwNAIAMhAyACIQIgCiELIAEiCkEBaiEBAkACQCAKLQAAIgxBJUYNACAMRQ0AIAEhASALIQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEOQEIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEJMFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEEJMFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCQsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAgLIAQgC0EHakF4cSIBKwMAQQgQxwQgAUEIaiECDAcLIAsoAgAiAUHazQAgARsiAxCTBSEBAkAgBSANayIKQQFIDQAgDSADIAEgCkF/aiAKIAFKGyIKEOQEIApqQQA6AAALIAtBBGohCiAEQQA6AAAgDSABaiEBIAJFDQMgAxAfDAMLIAQgAToAAAwBCyAEQT86AAALIAshAgwDCyAKIQIgASEBDAMLIAwhAgwBCyALIQILIA0hAQsgAiECIAQQkwUhAwJAIAUgASILayIBQQFIDQAgCyAEIAMgAUF/aiABIANKGyIBEOQEIAFqQQA6AAALIA5BAWoiDCEBIAIhCiAMIQJBASEMIAsgA2ohAwsgASEBIAohCiACIQIgAyILIQMgDA0ACyAEQcAAaiQAIAsgAGtBAWoL7QgDA34IfwF8AkACQCABRAAAAAAAAAAAYw0AIAEhASAAIQAMAQsgAEEtOgAAIAGaIQEgAEEBaiEACyAAIQACQCABIgG9Qv///////////wCDIgNCgYCAgICAgPj/AFQNACAAQc7CuQI2AAAPCwJAIANCgICAgICAgPj/AFINACAAQencmQM2AAAPCwJAIAFEsMpuR+2JEABjRQ0AIABBMDsAAA8LIAJBBCACQQRKGyICQQ9JIQYgAUSN7bWg98awPmMhBwJAAkAgARD8BCIOmUQAAAAAAADgQWNFDQAgDqohCAwBC0GAgICAeCEICyAIIQggAkEPIAYbIQICQAJAIAcNACABRFDv4tbkGktEZA0AIAghBkEBIQcgASEBDAELAkAgCEF/Sg0AQQAhBiAIIQcgAUQAAAAAAAAkQEEAIAhrELcFoiEBDAELQQAhBiAIIQcgAUQAAAAAAAAkQCAIELcFoyEBCyABIQEgByEJIAIgBiIKQQFqIgtBDyAKQQ9IIgYbIAogAkgiCBshDAJAAkAgCA0AIAYNACAKIAxrQQFqIgghAiABRAAAAAAAACRAIAgQtwWjRAAAAAAAAOA/oCEBDAELQQAhAiABRAAAAAAAACRAIAwgCkF/c2oQtwWiRAAAAAAAAOA/oCEBCyACIQ0gCkF/SiECAkACQCABIgFEAAAAAAAA8ENjIAFEAAAAAAAAAABmcUUNACABsSEDDAELQgAhAwsgAyEDAkACQCACRQ0AIAAhAAwBCyAAQbDcADsAACAAQQJqIQICQCAKQX9HDQAgAiEADAELIAJBMCAKQX9zEOYEGiAAIAprQQFqIQALIAMhAyAMIQggACEAAkADQCAAIQIgAyEEAkAgCCIIQQFODQAgAiECDAILQTAhACAEIQMCQCAEIAhBf2oiCEEDdEHA7gBqKQMAIgVUDQADQCAAQQFqIQAgAyAFfSIEIQMgBCAFWg0ACwsgAiAAOgAAIAJBAWohAAJAAkAgAyIDQgBSIAwgCGsiByAKTHIiBkEBRg0AIAAhAAwBCyAAIQAgByALRw0AIAJBLjoAASACQQJqIQALIAMhAyAIIQggACICIQAgAiECIAYNAAsLIAIhAAJAAkAgDUEBTg0AIAAhAAwBCyAAQTAgDRDmBCANaiEACyAAIQACQAJAIAlBAUYNACAAQeUAOgAAAkACQCAJQQFODQAgAEEBaiEADAELIABBKzoAASAAQQJqIQALIAAhAAJAAkAgCUF/TA0AIAkhCCAAIQAMAQsgAEEtOgAAQQAgCWshCCAAQQFqIQALIAAiByECIAghCANAIAIiAiAIIgAgAEEKbiIIQQpsa0EwcjoAACACQQFqIgYhAiAIIQggAEEJSw0ACyAGQQA6AAAgByAHEJMFakF/aiIAIAdNDQEgACECIAchAANAIAAiAC0AACEIIAAgAiICLQAAOgAAIAIgCDoAACACQX9qIgghAiAAQQFqIgYhACAGIAhJDQAMAgsACyAAQQA6AAALCyoBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQxgQhAyAEQRBqJAAgAwuuAQEGfyMAQRBrIgIgATcDCEHFu/KIeCEDIAJBCGohAkEIIQQDQCADQZODgAhsIgUgAiICLQAAcyIGIQMgAkEBaiECIARBf2oiByEEIAcNAAsgAEEAOgAEIAAgBkH/////A3EiA0HoNG5BCnBBMHI6AAMgACADQaQFbkEKcEEwcjoAAiAAIAMgBUEednMiA0EabiICQRpwQcEAajoAASAAIAMgAkEabGtBwQBqOgAAC0kBAn8jAEEQayICJAAgAiABNgIEIAIgATYCDCACIAE2AghBAEEAIAAgARDGBCIBEB4iAyABIAAgAigCCBDGBBogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQHiEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZBnyRqLQAAOgAAIAVBAWogBi0AAEEPcUGfJGotAAA6AAAgBEEBaiIFIQQgBSABRw0ACwsgAyACakEAOgAAIAMLwQEBCH8jAEEQayIBJABBBRAeIQIgASAANwMIQcW78oh4IQMgAUEIaiEEQQghBQNAIANBk4OACGwiBiAEIgQtAABzIgchAyAEQQFqIQQgBUF/aiIIIQUgCA0ACyACQQA6AAQgAiAHQf////8DcSIDQeg0bkEKcEEwcjoAAyACIANBpAVuQQpwQTByOgACIAIgAyAGQR52cyIDQRpuIgRBGnBBwQBqOgABIAIgAyAEQRpsa0HBAGo6AAAgAUEQaiQAIAIL6QEBB38jAEEQayIBJAAgAUEANgIMIAFCADcCBCABIAA2AgACQAJAIAANAEEBIQIMAQsgACECQQAhA0EAIQQDQCACIQUgASAEQQFqIgRBAnRqKAIAIgYhAiAFEJMFIANqIgUhAyAEIQQgBg0ACyAFQQFqIQILIAIQHiEHQQAhBQJAIABFDQAgACECQQAhA0EAIQQDQCACIQIgByADIgNqIAIgAhCTBSIFEOQEGiABIARBAWoiBEECdGooAgAiBiECIAUgA2oiBSEDIAQhBCAFIQUgBg0ACwsgByAFakEAOgAAIAFBEGokACAHCxsBAX8gACABIAAgAUEAEM8EEB4iAhDPBBogAguHBAEIf0EAIQMCQCACRQ0AIAJBIjoAACACQQFqIQMLIAMhBAJAAkAgAQ0AIAQhBUEBIQYMAQtBACECQQEhAyAEIQQDQCAAIAIiB2otAAAiCMAiBSEJIAQiBiECIAMiCiEDQQEhBAJAAkACQAJAAkACQAJAIAVBd2oOGgMBBAQCBAQEBAQEBAQEBAQEBAQEBAQEBAQGAAsgBUHcAEcNAyAFIQkMBAtB7gAhCQwDC0HyACEJDAILQfQAIQkMAQsCQAJAIAVBIEgNACAKQQFqIQMCQCAGDQAgBSEJQQAhAgwCCyAGIAU6AAAgBSEJIAZBAWohAgwBCyAKQQZqIQMCQCAGDQAgBSEJQQAhAiADIQNBACEEDAMLIAZBADoABiAGQdzqwYEDNgAAIAYgCEEPcUGfJGotAAA6AAUgBiAIQQR2QZ8kai0AADoABCAFIQkgBkEGaiECIAMhA0EAIQQMAgsgAyEDQQAhBAwBCyAGIQIgCiEDQQEhBAsgAyEDIAIhAiAJIQkCQAJAIAQNACACIQQgAyECDAELIANBAmohAwJAAkAgAg0AQQAhBAwBCyACIAk6AAEgAkHcADoAACACQQJqIQQLIAMhAgsgBCIEIQUgAiIDIQYgB0EBaiIJIQIgAyEDIAQhBCAJIAFHDQALCyAGIQICQCAFIgNFDQAgA0EiOwAACyACQQJqCxkAAkAgAQ0AQQEQHg8LIAEQHiAAIAEQ5AQLEgACQEEAKAKk1QFFDQAQ0gQLC54DAQd/AkBBAC8BqNUBIgBFDQAgACEBQQAoAqDVASIAIgIhAyAAIQAgAiECA0AgACEEIAIiAEEIaiEFIAEhAiADIQEDQCABIQEgAiEDAkACQAJAIAAtAAUiAkH/AUcNACAAIAFHDQFBACADIAEtAARBA2pB/ANxQQhqIgJrIgM7AajVASABIAEgAmogA0H//wNxELwEDAILQQAoAoDNASAAKAIAa0EASA0AIAJB/wBxIAAvAQYgBSAALQAEENwEDQQCQAJAIAAsAAUiAUF/Sg0AAkAgAEEAKAKg1QEiAUYNAEH/ASEBDAILQQBBAC8BqNUBIAEtAARBA2pB/ANxQQhqIgJrIgM7AajVASABIAEgAmogA0H//wNxELwEDAMLIAAgACgCAEHQhgNqNgIAIAFBgH9yIQELIAAgAToABQtBAC8BqNUBIgQhAUEAKAKg1QEiBSEDIAAtAARBA2pB/ANxIABqQQhqIgYhACAGIQIgBiAFayAESA0CDAMLQQAvAajVASIDIQJBACgCoNUBIgYhASAEIAZrIANIDQALCwsL7gIBBH8CQAJAECANACABQYACTw0BQQBBAC0AqtUBQQFqIgQ6AKrVASAALQAEIARBCHQgAUH/AXFyQYCAfnIiBUH//wNxIAIgAxDcBBoCQEEAKAKg1QENAEGAARAeIQFBAEHCATYCpNUBQQAgATYCoNUBCwJAIANBCGoiBkGAAUoNAAJAAkBBgAFBAC8BqNUBIgFrIAZIDQAgASEHDAELIAEhBANAQQAgBEEAKAKg1QEiAS0ABEEDakH8A3FBCGoiBGsiBzsBqNUBIAEgASAEaiAHQf//A3EQvARBAC8BqNUBIgEhBCABIQdBgAEgAWsgBkgNAAsLQQAoAqDVASAHIgRqIgEgBTsBBiABIAM6AAQgASAALQAEOgAFIAFBCGogAiADEOQEGiABQQAoAoDNAUGgnAFqNgIAQQAgA0H/AXFBA2pB/ANxIARqQQhqOwGo1QELDwtBlThB3QBB/AsQvwQAC0GVOEEjQdksEL8EAAsbAAJAQQAoAqzVAQ0AQQBBgAQQnwQ2AqzVAQsLOwEBfwJAIAANAEEADwtBACEBAkAgABCwBEUNACAAIAAtAANBvwFxOgADQQAoAqzVASAAEJwEIQELIAELOwEBfwJAIAANAEEADwtBACEBAkAgABCwBEUNACAAIAAtAANBwAByOgADQQAoAqzVASAAEJwEIQELIAELDABBACgCrNUBEJ0ECwwAQQAoAqzVARCeBAs1AQF/AkBBACgCsNUBIAAQnAQiAUUNAEHCI0EAEC8LAkAgABDWBEUNAEGwI0EAEC8LED4gAQs1AQF/AkBBACgCsNUBIAAQnAQiAUUNAEHCI0EAEC8LAkAgABDWBEUNAEGwI0EAEC8LED4gAQsbAAJAQQAoArDVAQ0AQQBBgAQQnwQ2ArDVAQsLlQEBAn8CQAJAAkAQIA0AQbjVASAAIAEgAxC+BCIEIQUCQCAEDQAQ3QRBuNUBEL0EQbjVASAAIAEgAxC+BCIBIQUgAUUNAgsgBSEBAkAgA0UNACACRQ0DIAEgAiADEOQEGgtBAA8LQe83QdIAQZksEL8EAAtB1T9B7zdB2gBBmSwQxAQAC0GQwABB7zdB4gBBmSwQxAQAC0QAQQAQtwQ3ArzVAUG41QEQugQCQEEAKAKw1QFBuNUBEJwERQ0AQcIjQQAQLwsCQEG41QEQ1gRFDQBBsCNBABAvCxA+C0YBAn8CQEEALQC01QENAEEAIQACQEEAKAKw1QEQnQQiAUUNAEEAQQE6ALTVASABIQALIAAPC0GaI0HvN0H0AEGZKRDEBAALRQACQEEALQC01QFFDQBBACgCsNUBEJ4EQQBBADoAtNUBAkBBACgCsNUBEJ0ERQ0AED4LDwtBmyNB7zdBnAFBgg4QxAQACzEAAkAQIA0AAkBBAC0AutUBRQ0AEN0EEK4EQbjVARC9BAsPC0HvN0GpAUGoIRC/BAALBgBBtNcBC08CAX4CfwJAAkAgAL0iAUI0iKdB/w9xIgJB/w9GDQBBBCEDIAINAUECQQMgAUL///////////8Ag1AbDwsgAUL/////////B4NQIQMLIAMLBAAgAAuOBAEDfwJAIAJBgARJDQAgACABIAIQESAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEOQEDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgCuNcBRQ0AQQAoArjXARDpBCEBCwJAQQAoAoDHAUUNAEEAKAKAxwEQ6QQgAXIhAQsCQBD/BCgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQ5wQhAgsCQCAAKAIUIAAoAhxGDQAgABDpBCABciEBCwJAIAJFDQAgABDoBAsgACgCOCIADQALCxCABSABDwtBACECAkAgACgCTEEASA0AIAAQ5wQhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBgAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBERABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEOgECyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEOsEIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACEP0EC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBIQpAVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahASEKQFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBDjBBAQC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBgAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEPAEDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBgAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEGACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEOQEGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQ8QQhAAwBCyADEOcEIQUgACAEIAMQ8QQhACAFRQ0AIAMQ6AQLAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEPgERAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEPsEIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA/BvIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDwHCiIAhBACsDuHCiIABBACsDsHCiQQArA6hwoKCgoiAIQQArA6BwoiAAQQArA5hwokEAKwOQcKCgoKIgCEEAKwOIcKIgAEEAKwOAcKJBACsD+G+goKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQ9wQPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQ+QQPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsDuG+iIANCLYinQf8AcUEEdCIBQdDwAGorAwCgIgkgAUHI8ABqKwMAIAIgA0KAgICAgICAeIN9vyABQciAAWorAwChIAFB0IABaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwPob6JBACsD4G+goiAAQQArA9hvokEAKwPQb6CgoiAEQQArA8hvoiAIQQArA8BvoiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB4r4laiIC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IANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQtQUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5ELUFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhC1BSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQqwVFDQAgAyAEEJsFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEELUFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQrQUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEKsFQQBKDQACQCABIAkgAyAKEKsFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAELUFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABC1BSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQtQUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAELUFIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJ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BiADcjYC0NcBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKALs1wFBf2oiAUF/IAEbNgLs1wELCwcAPwBBEHQLVAECf0EAKAKExwEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQpwVNDQAgABATRQ0BC0EAIAA2AoTHASABDwsQ4QRBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEKoFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahCqBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQqgUgBUEwaiAKIAEgBxC0BSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEKoFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEKoFIAUgAiAEQQEgBmsQtAUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAELIFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELELMFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQqgVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCqBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABC2BSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABC2BSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABC2BSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABC2BSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABC2BSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABC2BSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABC2BSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABC2BSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABC2BSAFQZABaiADQg+GQgAgBEIAELYFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQtgUgBUGAAWpCASACfUIAIARCABC2BSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOELYFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOELYFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQtAUgBUEwaiAWIBMgBkHwAGoQqgUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8QtgUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABC2BSAFIAMgDkIFQgAQtgUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEKoFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEKoFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQqgUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQqgUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQqgVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQqgUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQqgUgBUEgaiACIAQgBhCqBSAFQRBqIBIgASAHELQFIAUgAiAEIAcQtAUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEKkFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahCqBSACIAAgBEGB+AAgA2sQtAUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHA2wUkA0HA2wFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEREACyUBAX4gACABIAKtIAOtQiCGhCAEEMQFIQUgBUIgiKcQugUgBacLEwAgACABpyABQiCIpyACIAMQFAsL78SBgAADAEGACAvYugFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AHRocm93OiVkQCV1AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRldnNtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAc2VuZF92YWx1ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZ2V0X3RyeWZyYW1lcwBwaXBlcyBpbiBzcGVjcwBhYnMAc2xlZXBNcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAdGFnIGVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AYnV0dG9uACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgB3aW5kRGlyZWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAdGhyb3dpbmcgbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAaW52YWxpZCBmbGFnIGFyZwBuZWVkIGZsYWcgYXJnAGxvZwBzZXR0aW5nAGdldHRpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGdjcmVmX3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGhlYXJ0UmF0ZQBjYXVzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAISBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkACUtcyVkACUtc18lZAAqICBwYz0lZCBAICVzX0YlZAAhICBwYz0lZCBAICVzX0YlZAAhIFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkACogRGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAHR2b2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBwYW5pYwBiYWQgbWFnaWMAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC90cnkuYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGRldmljZXNjcmlwdC90c2FnZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTAAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDACogIHBjPSVkIEAgPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAGZyYW1lLT5mdW5jLT5udW1fdHJ5X2ZyYW1lcyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2djX29ial92YWxpZChjdHgsIHB0cikAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2djX29ial92YWxpZChjdHgsIHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpAG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRFUykAZGV2c19nY19vYmpfdmFsaWQoY3R4LCBkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkAV1NuOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXU246IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAEAMC4wLjAAAAAAAAAAAABEZXZpY2VTY3JpcHQgU2ltdWxhdG9yIChXQVNNKQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAnG5gFAwAAAAHAAAACAAAAPCfBgABEIAQgRCA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PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AAC06oCAAARuYW1lAcRpxwUABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAhFlbV9kZXBsb3lfaGFuZGxlcgMXZW1famRfY3J5cHRvX2dldF9yYW5kb20EDWVtX3NlbmRfZnJhbWUFEGVtX2NvbnNvbGVfZGVidWcGBGV4aXQHC2VtX3RpbWVfbm93CCBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQkhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkChhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcLMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQNM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA41ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQPGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFBpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxURX193YXNtX2NhbGxfY3RvcnMWDWZsYXNoX3Byb2dyYW0XC2ZsYXNoX2VyYXNlGApmbGFzaF9zeW5jGRlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGghod19wYW5pYxsIamRfYmxpbmscB2pkX2dsb3cdFGpkX2FsbG9jX3N0YWNrX2NoZWNrHghqZF9hbGxvYx8HamRfZnJlZSANdGFyZ2V0X2luX2lycSESdGFyZ2V0X2Rpc2FibGVfaXJxIhF0YXJnZXRfZW5hYmxlX2lycSMTamRfc2V0dGluZ3NfZ2V0X2JpbiQTamRfc2V0dGluZ3Nfc2V0X2JpbiUYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJhRhcHBfZ2V0X2RldmljZV9jbGFzcycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLwVkbWVzZzAUamRfZW1fZnJhbWVfcmVjZWl2ZWQxEWpkX2VtX2RldnNfZGVwbG95MhFqZF9lbV9kZXZzX3ZlcmlmeTMYamRfZW1fZGV2c19jbGllbnRfZGVwbG95NBtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M1DGh3X2RldmljZV9pZDYMdGFyZ2V0X3Jlc2V0Nw50aW1fZ2V0X21pY3JvczgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwLYXBwX3Byb2Nlc3M9B3R4X2luaXQ+D2pkX3BhY2tldF9yZWFkeT8KdHhfcHJvY2Vzc0AXamRfd2Vic29ja19zZW5kX21lc3NhZ2VBDmpkX3dlYnNvY2tfbmV3QgZvbm9wZW5DB29uZXJyb3JEB29uY2xvc2VFCW9ubWVzc2FnZUYQamRfd2Vic29ja19jbG9zZUcOYWdnYnVmZmVyX2luaXRID2FnZ2J1ZmZlcl9mbHVzaEkQYWdnYnVmZmVyX3VwbG9hZEoOZGV2c19idWZmZXJfb3BLEGRldnNfcmVhZF9udW1iZXJMEmRldnNfYnVmZmVyX2RlY29kZU0SZGV2c19idWZmZXJfZW5jb2RlTg9kZXZzX2NyZWF0ZV9jdHhPCXNldHVwX2N0eFAKZGV2c190cmFjZVEPZGV2c19lcnJvcl9jb2RlUhlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUwljbGVhcl9jdHhUDWRldnNfZnJlZV9jdHhVCGRldnNfb29tVglkZXZzX2ZyZWVXEWRldnNjbG91ZF9wcm9jZXNzWBdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFkTZGV2c2Nsb3VkX29uX21ldGhvZFoOZGV2c2Nsb3VkX2luaXRbD2RldnNkYmdfcHJvY2Vzc1wRZGV2c2RiZ19yZXN0YXJ0ZWRdFWRldnNkYmdfaGFuZGxlX3BhY2tldF4Lc2VuZF92YWx1ZXNfEXZhbHVlX2Zyb21fdGFnX3YwYBlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYQ1vYmpfZ2V0X3Byb3BzYgxleHBhbmRfdmFsdWVjEmRldnNkYmdfc3VzcGVuZF9jYmQMZGV2c2RiZ19pbml0ZRBleHBhbmRfa2V5X3ZhbHVlZgZrdl9hZGRnD2RldnNtZ3JfcHJvY2Vzc2gHdHJ5X3J1bmkMc3RvcF9wcm9ncmFtag9kZXZzbWdyX3Jlc3RhcnRrFGRldnNtZ3JfZGVwbG95X3N0YXJ0bBRkZXZzbWdyX2RlcGxveV93cml0ZW0QZGV2c21ncl9nZXRfaGFzaG4VZGV2c21ncl9oYW5kbGVfcGFja2V0bw5kZXBsb3lfaGFuZGxlcnATZGVwbG95X21ldGFfaGFuZGxlcnEPZGV2c21ncl9nZXRfY3R4cg5kZXZzbWdyX2RlcGxveXMMZGV2c21ncl9pbml0dBFkZXZzbWdyX2NsaWVudF9ldnUQZGV2c19maWJlcl95aWVsZHYYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EmRldnNfZmliZXJfYnlfZmlkeH4RZGV2c19maWJlcl9ieV90YWd/EGRldnNfZmliZXJfc3RhcnSAARRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYEBDmRldnNfZmliZXJfcnVuggETZGV2c19maWJlcl9zeW5jX25vd4MBCmRldnNfcGFuaWOEARVfZGV2c19ydW50aW1lX2ZhaWx1cmWFAQ9kZXZzX2ZpYmVyX3Bva2WGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJUBD2RldnNfZ2Nfc2V0X2N0eJYBDmRldnNfZ2NfY3JlYXRllwEPZGV2c19nY19kZXN0cm95mAERZGV2c19nY19vYmpfdmFsaWSZAQtzY2FuX2djX29iapoBEXByb3BfQXJyYXlfbGVuZ3RomwESbWV0aDJfQXJyYXlfaW5zZXJ0nAESZnVuMV9BcnJheV9pc0FycmF5nQEQbWV0aFhfQXJyYXlfcHVzaJ4BFW1ldGgxX0FycmF5X3B1c2hSYW5nZZ8BEW1ldGhYX0FycmF5X3NsaWNloAERZnVuMV9CdWZmZXJfYWxsb2OhARJwcm9wX0J1ZmZlcl9sZW5ndGiiARVtZXRoMF9CdWZmZXJfdG9TdHJpbmejARNtZXRoM19CdWZmZXJfZmlsbEF0pAETbWV0aDRfQnVmZmVyX2JsaXRBdKUBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOmARdmdW4xX0RldmljZVNjcmlwdF9wYW5pY6cBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKgBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKkBFWZ1bjFfRGV2aWNlU2NyaXB0X2xvZ6oBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSrARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludKwBFG1ldGgxX0Vycm9yX19fY3Rvcl9frQEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX64BGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX68BD3Byb3BfRXJyb3JfbmFtZbABFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0sQEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGWyARJwcm9wX0Z1bmN0aW9uX25hbWWzAQ5mdW4xX01hdGhfY2VpbLQBD2Z1bjFfTWF0aF9mbG9vcrUBD2Z1bjFfTWF0aF9yb3VuZLYBDWZ1bjFfTWF0aF9hYnO3ARBmdW4wX01hdGhfcmFuZG9tuAETZnVuMV9NYXRoX3JhbmRvbUludLkBDWZ1bjFfTWF0aF9sb2e6AQ1mdW4yX01hdGhfcG93uwEOZnVuMl9NYXRoX2lkaXa8AQ5mdW4yX01hdGhfaW1vZL0BDmZ1bjJfTWF0aF9pbXVsvgENZnVuMl9NYXRoX21pbr8BC2Z1bjJfbWlubWF4wAENZnVuMl9NYXRoX21heMEBEmZ1bjJfT2JqZWN0X2Fzc2lnbsIBEGZ1bjFfT2JqZWN0X2tleXPDARNmdW4xX2tleXNfb3JfdmFsdWVzxAESZnVuMV9PYmplY3RfdmFsdWVzxQEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bGARBwcm9wX1BhY2tldF9yb2xlxwEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcsgBE3Byb3BfUGFja2V0X3Nob3J0SWTJARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjKARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZMsBEXByb3BfUGFja2V0X2ZsYWdzzAEVcHJvcF9QYWNrZXRfaXNDb21tYW5kzQEUcHJvcF9QYWNrZXRfaXNSZXBvcnTOARNwcm9wX1BhY2tldF9wYXlsb2FkzwETcHJvcF9QYWNrZXRfaXNFdmVudNABFXByb3BfUGFja2V0X2V2ZW50Q29kZdEBFHByb3BfUGFja2V0X2lzUmVnU2V00gEUcHJvcF9QYWNrZXRfaXNSZWdHZXTTARNwcm9wX1BhY2tldF9yZWdDb2Rl1AETbWV0aDBfUGFja2V0X2RlY29kZdUBEmRldnNfcGFja2V0X2RlY29kZdYBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZNcBFERzUmVnaXN0ZXJfcmVhZF9jb2502AESZGV2c19wYWNrZXRfZW5jb2Rl2QEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZdoBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXbARZwcm9wX0RzUGFja2V0SW5mb19uYW1l3AEWcHJvcF9Ec1BhY2tldEluZm9fY29kZd0BGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX94BF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVk3wEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k4AERbWV0aDBfRHNSb2xlX3dhaXThARJwcm9wX1N0cmluZ19sZW5ndGjiARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdOMBE21ldGgxX1N0cmluZ19jaGFyQXTkARRkZXZzX2pkX2dldF9yZWdpc3RlcuUBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTmARBkZXZzX2pkX3NlbmRfY21k5wERZGV2c19qZF93YWtlX3JvbGXoARRkZXZzX2pkX3Jlc2V0X3BhY2tldOkBE2RldnNfamRfcGt0X2NhcHR1cmXqARNkZXZzX2pkX3NlbmRfbG9nbXNn6wENaGFuZGxlX2xvZ21zZ+wBEmRldnNfamRfc2hvdWxkX3J1bu0BF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl7gETZGV2c19qZF9wcm9jZXNzX3BrdO8BFGRldnNfamRfcm9sZV9jaGFuZ2Vk8AESZGV2c19qZF9pbml0X3JvbGVz8QESZGV2c19qZF9mcmVlX3JvbGVz8gEQZGV2c19zZXRfbG9nZ2luZ/MBFWRldnNfc2V0X2dsb2JhbF9mbGFnc/QBF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdz9QEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz9gERZGV2c19tYXBsaWtlX2l0ZXL3ARdkZXZzX2dldF9idWlsdGluX29iamVjdPgBEmRldnNfbWFwX2NvcHlfaW50b/kBDGRldnNfbWFwX3NldPoBBmxvb2t1cPsBE2RldnNfbWFwbGlrZV9pc19tYXD8ARtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXP9ARFkZXZzX2FycmF5X2luc2VydP4BCGt2X2FkZC4x/wESZGV2c19zaG9ydF9tYXBfc2V0gAIPZGV2c19tYXBfZGVsZXRlgQISZGV2c19zaG9ydF9tYXBfZ2V0ggIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXSDAg5kZXZzX3JvbGVfc3BlY4QCEmRldnNfZnVuY3Rpb25fYmluZIUCEWRldnNfbWFrZV9jbG9zdXJlhgIOZGV2c19nZXRfZm5pZHiHAhNkZXZzX2dldF9mbmlkeF9jb3JliAIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxkiQITZGV2c19nZXRfcm9sZV9wcm90b4oCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd4sCGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZIwCFWRldnNfZ2V0X3N0YXRpY19wcm90b40CG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb44CHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtjwIWZGV2c19tYXBsaWtlX2dldF9wcm90b5ACGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZJECGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZJICEGRldnNfaW5zdGFuY2Vfb2aTAg9kZXZzX29iamVjdF9nZXSUAgxkZXZzX3NlcV9nZXSVAgxkZXZzX2FueV9nZXSWAgxkZXZzX2FueV9zZXSXAgxkZXZzX3NlcV9zZXSYAg5kZXZzX2FycmF5X3NldJkCDGRldnNfYXJnX2ludJoCD2RldnNfYXJnX2RvdWJsZZsCD2RldnNfcmV0X2RvdWJsZZwCDGRldnNfcmV0X2ludJ0CDWRldnNfcmV0X2Jvb2yeAg9kZXZzX3JldF9nY19wdHKfAhFkZXZzX2FyZ19zZWxmX21hcKACEWRldnNfc2V0dXBfcmVzdW1loQIPZGV2c19jYW5fYXR0YWNoogIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZaMCFWRldnNfbWFwbGlrZV90b192YWx1ZaQCEmRldnNfcmVnY2FjaGVfZnJlZaUCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGymAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZKcCE2RldnNfcmVnY2FjaGVfYWxsb2OoAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cKkCEWRldnNfcmVnY2FjaGVfYWdlqgIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWrAhJkZXZzX3JlZ2NhY2hlX25leHSsAg9qZF9zZXR0aW5nc19nZXStAg9qZF9zZXR0aW5nc19zZXSuAg5kZXZzX2xvZ192YWx1Za8CD2RldnNfc2hvd192YWx1ZbACEGRldnNfc2hvd192YWx1ZTCxAg1jb25zdW1lX2NodW5rsgINc2hhXzI1Nl9jbG9zZbMCD2pkX3NoYTI1Nl9zZXR1cLQCEGpkX3NoYTI1Nl91cGRhdGW1AhBqZF9zaGEyNTZfZmluaXNotgIUamRfc2hhMjU2X2htYWNfc2V0dXC3AhVqZF9zaGEyNTZfaG1hY19maW5pc2i4Ag5qZF9zaGEyNTZfaGtkZrkCDmRldnNfc3RyZm9ybWF0ugIOZGV2c19pc19zdHJpbme7Ag5kZXZzX2lzX251bWJlcrwCFGRldnNfc3RyaW5nX2dldF91dGY4vQITZGV2c19idWlsdGluX3N0cmluZ74CFGRldnNfc3RyaW5nX3ZzcHJpbnRmvwITZGV2c19zdHJpbmdfc3ByaW50ZsACFWRldnNfc3RyaW5nX2Zyb21fdXRmOMECFGRldnNfdmFsdWVfdG9fc3RyaW5nwgIQYnVmZmVyX3RvX3N0cmluZ8MCGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTEAhJkZXZzX3N0cmluZ19jb25jYXTFAhJkZXZzX3B1c2hfdHJ5ZnJhbWXGAhFkZXZzX3BvcF90cnlmcmFtZccCD2RldnNfZHVtcF9zdGFja8gCE2RldnNfZHVtcF9leGNlcHRpb27JAgpkZXZzX3Rocm93ygIVZGV2c190aHJvd190eXBlX2Vycm9yywIZZGV2c190aHJvd19pbnRlcm5hbF9lcnJvcswCFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LNAh5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LOAhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcs8CHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dNACGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvctECHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2PSAg90c2FnZ19jbGllbnRfZXbTAgphZGRfc2VyaWVz1AINdHNhZ2dfcHJvY2Vzc9UCCmxvZ19zZXJpZXPWAhN0c2FnZ19oYW5kbGVfcGFja2V01wIUbG9va3VwX29yX2FkZF9zZXJpZXPYAgp0c2FnZ19pbml02QIMdHNhZ2dfdXBkYXRl2gIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZdsCE2RldnNfdmFsdWVfZnJvbV9pbnTcAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbN0CF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy3gIUZGV2c192YWx1ZV90b19kb3VibGXfAhFkZXZzX3ZhbHVlX3RvX2ludOACEmRldnNfdmFsdWVfdG9fYm9vbOECDmRldnNfaXNfYnVmZmVy4gIXZGV2c19idWZmZXJfaXNfd3JpdGFibGXjAhBkZXZzX2J1ZmZlcl9kYXRh5AITZGV2c19idWZmZXJpc2hfZGF0YeUCFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq5gINZGV2c19pc19hcnJheecCEWRldnNfdmFsdWVfdHlwZW9m6AIPZGV2c19pc19udWxsaXNo6QISZGV2c192YWx1ZV9pZWVlX2Vx6gIeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj6wISZGV2c19pbWdfc3RyaWR4X29r7AISZGV2c19kdW1wX3ZlcnNpb25z7QILZGV2c192ZXJpZnnuAhFkZXZzX2ZldGNoX29wY29kZe8CDmRldnNfdm1fcmVzdW1l8AIRZGV2c192bV9zZXRfZGVidWfxAhlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRz8gIYZGV2c192bV9jbGVhcl9icmVha3BvaW508wIPZGV2c192bV9zdXNwZW5k9AIWZGV2c192bV9zZXRfYnJlYWtwb2ludPUCFGRldnNfdm1fZXhlY19vcGNvZGVz9gIaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHj3AhFkZXZzX2ltZ19nZXRfdXRmOPgCFGRldnNfZ2V0X3N0YXRpY191dGY4+QIPZGV2c192bV9yb2xlX29r+gIUZGV2c192YWx1ZV9idWZmZXJpc2j7AgxleHByX2ludmFsaWT8AhRleHByeF9idWlsdGluX29iamVjdP0CC3N0bXQxX2NhbGww/gILc3RtdDJfY2FsbDH/AgtzdG10M19jYWxsMoADC3N0bXQ0X2NhbGwzgQMLc3RtdDVfY2FsbDSCAwtzdG10Nl9jYWxsNYMDC3N0bXQ3X2NhbGw2hAMLc3RtdDhfY2FsbDeFAwtzdG10OV9jYWxsOIYDEnN0bXQyX2luZGV4X2RlbGV0ZYcDDHN0bXQxX3JldHVybogDCXN0bXR4X2ptcIkDDHN0bXR4MV9qbXBfeooDC3N0bXQxX3BhbmljiwMSZXhwcnhfb2JqZWN0X2ZpZWxkjAMSc3RtdHgxX3N0b3JlX2xvY2FsjQMTc3RtdHgxX3N0b3JlX2dsb2JhbI4DEnN0bXQ0X3N0b3JlX2J1ZmZlco8DCWV4cHIwX2luZpADEGV4cHJ4X2xvYWRfbG9jYWyRAxFleHByeF9sb2FkX2dsb2JhbJIDC2V4cHIxX3VwbHVzkwMLZXhwcjJfaW5kZXiUAw9zdG10M19pbmRleF9zZXSVAxRleHByeDFfYnVpbHRpbl9maWVsZJYDEmV4cHJ4MV9hc2NpaV9maWVsZJcDEWV4cHJ4MV91dGY4X2ZpZWxkmAMQZXhwcnhfbWF0aF9maWVsZJkDDmV4cHJ4X2RzX2ZpZWxkmgMPc3RtdDBfYWxsb2NfbWFwmwMRc3RtdDFfYWxsb2NfYXJyYXmcAxJzdG10MV9hbGxvY19idWZmZXKdAxFleHByeF9zdGF0aWNfcm9sZZ4DE2V4cHJ4X3N0YXRpY19idWZmZXKfAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmegAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5noQMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nogMVZXhwcnhfc3RhdGljX2Z1bmN0aW9uowMNZXhwcnhfbGl0ZXJhbKQDEWV4cHJ4X2xpdGVyYWxfZjY0pQMQZXhwcnhfcm9sZV9wcm90b6YDEWV4cHIzX2xvYWRfYnVmZmVypwMNZXhwcjBfcmV0X3ZhbKgDDGV4cHIxX3R5cGVvZqkDCmV4cHIwX251bGyqAw1leHByMV9pc19udWxsqwMKZXhwcjBfdHJ1ZawDC2V4cHIwX2ZhbHNlrQMNZXhwcjFfdG9fYm9vbK4DCWV4cHIwX25hbq8DCWV4cHIxX2Fic7ADDWV4cHIxX2JpdF9ub3SxAwxleHByMV9pc19uYW6yAwlleHByMV9uZWezAwlleHByMV9ub3S0AwxleHByMV90b19pbnS1AwlleHByMl9hZGS2AwlleHByMl9zdWK3AwlleHByMl9tdWy4AwlleHByMl9kaXa5Aw1leHByMl9iaXRfYW5kugMMZXhwcjJfYml0X29yuwMNZXhwcjJfYml0X3hvcrwDEGV4cHIyX3NoaWZ0X2xlZnS9AxFleHByMl9zaGlmdF9yaWdodL4DGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkvwMIZXhwcjJfZXHAAwhleHByMl9sZcEDCGV4cHIyX2x0wgMIZXhwcjJfbmXDAxVzdG10MV90ZXJtaW5hdGVfZmliZXLEAxRzdG10eDJfc3RvcmVfY2xvc3VyZcUDE2V4cHJ4MV9sb2FkX2Nsb3N1cmXGAxJleHByeF9tYWtlX2Nsb3N1cmXHAxBleHByMV90eXBlb2Zfc3RyyAMMZXhwcjBfbm93X21zyQMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZcoDEHN0bXQyX2NhbGxfYXJyYXnLAwlzdG10eF90cnnMAw1zdG10eF9lbmRfdHJ5zQMLc3RtdDBfY2F0Y2jOAw1zdG10MF9maW5hbGx5zwMLc3RtdDFfdGhyb3fQAw5zdG10MV9yZV90aHJvd9EDEHN0bXR4MV90aHJvd19qbXDSAw5zdG10MF9kZWJ1Z2dlctMDCWV4cHIxX25ld9QDEWV4cHIyX2luc3RhbmNlX29m1QMKZXhwcjJfYmluZNYDD2RldnNfdm1fcG9wX2FyZ9cDE2RldnNfdm1fcG9wX2FyZ191MzLYAxNkZXZzX3ZtX3BvcF9hcmdfaTMy2QMWZGV2c192bV9wb3BfYXJnX2J1ZmZlctoDEmpkX2Flc19jY21fZW5jcnlwdNsDEmpkX2Flc19jY21fZGVjcnlwdNwDDEFFU19pbml0X2N0eN0DD0FFU19FQ0JfZW5jcnlwdN4DEGpkX2Flc19zZXR1cF9rZXnfAw5qZF9hZXNfZW5jcnlwdOADEGpkX2Flc19jbGVhcl9rZXnhAwtqZF93c3NrX25ld+IDFGpkX3dzc2tfc2VuZF9tZXNzYWdl4wMTamRfd2Vic29ja19vbl9ldmVudOQDB2RlY3J5cHTlAw1qZF93c3NrX2Nsb3Nl5gMQamRfd3Nza19vbl9ldmVudOcDCnNlbmRfZW1wdHnoAxJ3c3NraGVhbHRoX3Byb2Nlc3PpAxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZeoDFHdzc2toZWFsdGhfcmVjb25uZWN06wMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V07AMPc2V0X2Nvbm5fc3RyaW5n7QMRY2xlYXJfY29ubl9zdHJpbmfuAw93c3NraGVhbHRoX2luaXTvAxN3c3NrX3B1Ymxpc2hfdmFsdWVz8AMQd3Nza19wdWJsaXNoX2JpbvEDEXdzc2tfaXNfY29ubmVjdGVk8gMTd3Nza19yZXNwb25kX21ldGhvZPMDHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemX0AxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xl9QMPcm9sZW1ncl9wcm9jZXNz9gMQcm9sZW1ncl9hdXRvYmluZPcDFXJvbGVtZ3JfaGFuZGxlX3BhY2tldPgDFGpkX3JvbGVfbWFuYWdlcl9pbml0+QMYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVk+gMNamRfcm9sZV9hbGxvY/sDEGpkX3JvbGVfZnJlZV9hbGz8AxZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5k/QMSamRfcm9sZV9ieV9zZXJ2aWNl/gMTamRfY2xpZW50X2xvZ19ldmVudP8DE2pkX2NsaWVudF9zdWJzY3JpYmWABBRqZF9jbGllbnRfZW1pdF9ldmVudIEEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkggQQamRfZGV2aWNlX2xvb2t1cIMEGGpkX2RldmljZV9sb29rdXBfc2VydmljZYQEE2pkX3NlcnZpY2Vfc2VuZF9jbWSFBBFqZF9jbGllbnRfcHJvY2Vzc4YEDmpkX2RldmljZV9mcmVlhwQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSIBA9qZF9kZXZpY2VfYWxsb2OJBA9qZF9jdHJsX3Byb2Nlc3OKBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSLBAxqZF9jdHJsX2luaXSMBA1qZF9pcGlwZV9vcGVujQQWamRfaXBpcGVfaGFuZGxlX3BhY2tldI4EDmpkX2lwaXBlX2Nsb3NljwQSamRfbnVtZm10X2lzX3ZhbGlkkAQVamRfbnVtZm10X3dyaXRlX2Zsb2F0kQQTamRfbnVtZm10X3dyaXRlX2kzMpIEEmpkX251bWZtdF9yZWFkX2kzMpMEFGpkX251bWZtdF9yZWFkX2Zsb2F0lAQRamRfb3BpcGVfb3Blbl9jbWSVBBRqZF9vcGlwZV9vcGVuX3JlcG9ydJYEFmpkX29waXBlX2hhbmRsZV9wYWNrZXSXBBFqZF9vcGlwZV93cml0ZV9leJgEEGpkX29waXBlX3Byb2Nlc3OZBBRqZF9vcGlwZV9jaGVja19zcGFjZZoEDmpkX29waXBlX3dyaXRlmwQOamRfb3BpcGVfY2xvc2WcBA1qZF9xdWV1ZV9wdXNonQQOamRfcXVldWVfZnJvbnSeBA5qZF9xdWV1ZV9zaGlmdJ8EDmpkX3F1ZXVlX2FsbG9joAQNamRfcmVzcG9uZF91OKEEDmpkX3Jlc3BvbmRfdTE2ogQOamRfcmVzcG9uZF91MzKjBBFqZF9yZXNwb25kX3N0cmluZ6QEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkpQQLamRfc2VuZF9wa3SmBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbKcEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyqAQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldKkEFGpkX2FwcF9oYW5kbGVfcGFja2V0qgQVamRfYXBwX2hhbmRsZV9jb21tYW5kqwQTamRfYWxsb2NhdGVfc2VydmljZawEEGpkX3NlcnZpY2VzX2luaXStBA5qZF9yZWZyZXNoX25vd64EGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSvBBRqZF9zZXJ2aWNlc19hbm5vdW5jZbAEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1lsQQQamRfc2VydmljZXNfdGlja7IEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ7MEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JltAQSYXBwX2dldF9md192ZXJzaW9utQQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZbYEDWpkX2hhc2hfZm52MWG3BAxqZF9kZXZpY2VfaWS4BAlqZF9yYW5kb225BAhqZF9jcmMxNroEDmpkX2NvbXB1dGVfY3JjuwQOamRfc2hpZnRfZnJhbWW8BAxqZF93b3JkX21vdmW9BA5qZF9yZXNldF9mcmFtZb4EEGpkX3B1c2hfaW5fZnJhbWW/BA1qZF9wYW5pY19jb3JlwAQTamRfc2hvdWxkX3NhbXBsZV9tc8EEEGpkX3Nob3VsZF9zYW1wbGXCBAlqZF90b19oZXjDBAtqZF9mcm9tX2hleMQEDmpkX2Fzc2VydF9mYWlsxQQHamRfYXRvacYEC2pkX3ZzcHJpbnRmxwQPamRfcHJpbnRfZG91YmxlyAQKamRfc3ByaW50ZskEEmpkX2RldmljZV9zaG9ydF9pZMoEDGpkX3NwcmludGZfYcsEC2pkX3RvX2hleF9hzAQUamRfZGV2aWNlX3Nob3J0X2lkX2HNBAlqZF9zdHJkdXDOBA5qZF9qc29uX2VzY2FwZc8EE2pkX2pzb25fZXNjYXBlX2NvcmXQBAlqZF9tZW1kdXDRBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVl0gQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZdMEEWpkX3NlbmRfZXZlbnRfZXh01AQKamRfcnhfaW5pdNUEFGpkX3J4X2ZyYW1lX3JlY2VpdmVk1gQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2vXBA9qZF9yeF9nZXRfZnJhbWXYBBNqZF9yeF9yZWxlYXNlX2ZyYW1l2QQRamRfc2VuZF9mcmFtZV9yYXfaBA1qZF9zZW5kX2ZyYW1l2wQKamRfdHhfaW5pdNwEB2pkX3NlbmTdBBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3Jj3gQPamRfdHhfZ2V0X2ZyYW1l3wQQamRfdHhfZnJhbWVfc2VudOAEC2pkX3R4X2ZsdXNo4QQQX19lcnJub19sb2NhdGlvbuIEDF9fZnBjbGFzc2lmeeMEBWR1bW155AQIX19tZW1jcHnlBAdtZW1tb3Zl5gQGbWVtc2V05wQKX19sb2NrZmlsZegEDF9fdW5sb2NrZmlsZekEBmZmbHVzaOoEBGZtb2TrBA1fX0RPVUJMRV9CSVRT7AQMX19zdGRpb19zZWVr7QQNX19zdGRpb193cml0Ze4EDV9fc3RkaW9fY2xvc2XvBAhfX3RvcmVhZPAECV9fdG93cml0ZfEECV9fZndyaXRlePIEBmZ3cml0ZfMEFF9fcHRocmVhZF9tdXRleF9sb2Nr9AQWX19wdGhyZWFkX211dGV4X3VubG9ja/UEBl9fbG9ja/YECF9fdW5sb2Nr9wQOX19tYXRoX2Rpdnplcm/4BApmcF9iYXJyaWVy+QQOX19tYXRoX2ludmFsaWT6BANsb2f7BAV0b3AxNvwEBWxvZzEw/QQHX19sc2Vla/4EBm1lbWNtcP8ECl9fb2ZsX2xvY2uABQxfX29mbF91bmxvY2uBBQxfX21hdGhfeGZsb3eCBQxmcF9iYXJyaWVyLjGDBQxfX21hdGhfb2Zsb3eEBQxfX21hdGhfdWZsb3eFBQRmYWJzhgUDcG93hwUFdG9wMTKIBQp6ZXJvaW5mbmFuiQUIY2hlY2tpbnSKBQxmcF9iYXJyaWVyLjKLBQpsb2dfaW5saW5ljAUKZXhwX2lubGluZY0FC3NwZWNpYWxjYXNljgUNZnBfZm9yY2VfZXZhbI8FBXJvdW5kkAUGc3RyY2hykQULX19zdHJjaHJudWySBQZzdHJjbXCTBQZzdHJsZW6UBQdfX3VmbG93lQUHX19zaGxpbZYFCF9fc2hnZXRjlwUHaXNzcGFjZZgFBnNjYWxibpkFCWNvcHlzaWdubJoFB3NjYWxibmybBQ1fX2ZwY2xhc3NpZnlsnAUFZm1vZGydBQVmYWJzbJ4FC19fZmxvYXRzY2FunwUIaGV4ZmxvYXSgBQhkZWNmbG9hdKEFB3NjYW5leHCiBQZzdHJ0b3ijBQZzdHJ0b2SkBRJfX3dhc2lfc3lzY2FsbF9yZXSlBQhkbG1hbGxvY6YFBmRsZnJlZacFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZagFBHNicmupBQhfX2FkZHRmM6oFCV9fYXNobHRpM6sFB19fbGV0ZjKsBQdfX2dldGYyrQUIX19kaXZ0ZjOuBQ1fX2V4dGVuZGRmdGYyrwUNX19leHRlbmRzZnRmMrAFC19fZmxvYXRzaXRmsQUNX19mbG9hdHVuc2l0ZrIFDV9fZmVfZ2V0cm91bmSzBRJfX2ZlX3JhaXNlX2luZXhhY3S0BQlfX2xzaHJ0aTO1BQhfX211bHRmM7YFCF9fbXVsdGkztwUJX19wb3dpZGYyuAUIX19zdWJ0ZjO5BQxfX3RydW5jdGZkZjK6BQtzZXRUZW1wUmV0MLsFC2dldFRlbXBSZXQwvAUJc3RhY2tTYXZlvQUMc3RhY2tSZXN0b3JlvgUKc3RhY2tBbGxvY78FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnTABRVlbXNjcmlwdGVuX3N0YWNrX2luaXTBBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlwgUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZcMFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZMQFDGR5bkNhbGxfamlqacUFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnGBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHEBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 25480;
var ___stop_em_js = Module['___stop_em_js'] = 26206;



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
