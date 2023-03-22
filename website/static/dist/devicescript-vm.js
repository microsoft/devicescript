
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
     * Clear settings.
     */
    function devsClearFlash() {
        if (Module.flashSave)
            Module.flashSave(new Uint8Array([0, 0, 0, 0]));
    }
    Exts.devsClearFlash = devsClearFlash;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+OFgIAA4QUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQABAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAQUDAAoAAgIAAQEBAAEAAAEAAAAKAAECAAEBBAUBAgAAAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGEQICBg4DAwMDBQUDAwMEBAUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQICBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgABAQEAAACBwADBwcBAgEAEgMJBwAABAACBwACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAdUB1QEFhoCAgAABAYACgAIG3YCAgAAOfwFB4O8FC38BQQALfwFBAAt/AUEAC38AQdjNAQt/AEHHzgELfwBBkdABC38AQY3RAQt/AEGJ0gELfwBB2dIBC38AQfrSAQt/AEH/1AELfwBB2M0BC38AQfXVAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jANYFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCSBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDXBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAJoFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADxBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAPIFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA8wUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPQFCXN0YWNrU2F2ZQDtBQxzdGFja1Jlc3RvcmUA7gUKc3RhY2tBbGxvYwDvBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50APAFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA9gUJn4OA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NwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEMoEGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQwwQaIAMgACgCBC0ADjoACiADKAIQDwtBs8gAQZ47QTFBzzUQ+AQAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ/AINACADIAEpAwA3AxgCQAJAIAAgA0EYahCnAiICDQAgAyABKQMANwMQIAAgA0EQahCmAiEBDAELAkAgACACEKgCIgENAEEAIQEMAQsCQCAAIAIQlAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDXAiADQShqIAAgBBC9AiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEI8CIAFqIQIMAQsgACACQQBBABCPAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCfAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEPECIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsg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QAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEKECCyADQSBqJAALNAIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQ4wIgABBZIAFBEGokAAtcAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQFGDQELIAMgAikDADcDCCAAIAFBiwEgA0EIahDqAgwBCyAAIAIoAgAQ7wILIANBEGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxgCQAJAAkAgASgCHCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMYNwMIIAFBEGogAEGLASABQQhqEOoCQQAhAgwBCwJAIAAgASgCGBB9IgINACABQRBqIABB5TBBABDoAgsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBrzJBABDoAgwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMYAkACQAJAIAEoAhwiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDGDcDCCABQRBqIABBiwEgAUEIahDqAkEAIQAMAQsCQCAAIAEoAhgQfSICDQAgAUEQaiAAQeUwQQAQ6AILIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALMgEBfwJAIABBABCzAiIBQQBIDQAgACgCrAEiACABEHggACAALQAQQfABcUEEcjoAEAsLGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABB5SRBABDoAgwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCfAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB8x8gA0EIahDrAgwBCyAAIAEgASgCoAEgBEH//wNxEJoCIAApAwBCAFINACADQdgAaiABQQggASABQQIQkAIQkAEQ8QIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI4BIANB0ABqQfsAENcCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCvAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQmAIgAyAAKQMANwMQIAEgA0EQahCPAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahCfAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ6gIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGwyQFODQIgAEHg4wAgAUEDdGovAQAQ1wIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtBthNBoTlBMUG3KxD4BAAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahD8Ag0AIAFBOGogAEG6GRDpAgsgASABKQNINwMgIAFBOGogACABQSBqENsCIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjgEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ1gIiAkUNACABQTBqIAAgAiABKAI4QQEQhwIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCPASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQswIhAiABIAEpAyA3AwgCQCABQQhqEPwCDQAgAUEYaiAAQZQbEOkCCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEI0CIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDyApsQtQILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ8gKcELUCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPICEMAFELUCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEO8CCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahDyAiIERAAAAAAAAAAAY0UNACAAIASaELUCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEOwEuEQAAAAAAADwPaIQtQILZAEFfwJAAkAgAEEAELMCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQ7AQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRC2AgsRACAAIABBABC0AhCrBRC1AgsYACAAIABBABC0AiAAQQEQtAIQtwUQtQILLgEDfyAAQQAQswIhAUEAIQICQCAAQQEQswIiA0UNACABIANtIQILIAAgAhC2AgsuAQN/IABBABCzAiEBQQAhAgJAIABBARCzAiIDRQ0AIAEgA28hAgsgACACELYCCxYAIAAgAEEAELMCIABBARCzAmwQtgILCQAgAEEBEMwBC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEPMCIQMgAiACKQMgNwMQIAAgAkEQahDzAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ8gIhBiACIAIpAyA3AwAgACACEPICIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDyGs3AyALAkACQAJAIAFFDQAgAkEo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AAEACwJAAkACQAJAAkAgA0F/ag4DAQIAAwsgASAAKAIsIAAvARIQ+gEgACABKQMANwMgQQEhAgwECwJAIAAoAiwiAigCtAEgAC8BEiIEQQxsaigCACgCECIDDQAgAEEAEHdBACECDAQLAkAgAkGnAmotAABBAXENACACQbICai8BACIFRQ0AIAUgAC8BFEcNACADLQAEIgUgAkGxAmotAABHDQAgA0EAIAVrQQxsakFkaikDACACQagCaikCAFINACACIAQgAC8BCBD9ASIDRQ0AIAJBoARqIAMQwAIaQQEhAgwECwJAIAAoAhggAigCwAFLDQAgAUEANgIMQQAhBAJAIAAvAQgiA0UNACACIAMgAUEMahCOAyEECyACQaQCaiEFIAAvARQhBiAALwESIQcgASgCDCEDIAJBAToApwIgAkGmAmogA0EHakH8AXE6AAAgAigCtAEgB0EMbGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAQiBEUNACACQbQCaiAEIAMQlQUaCyAFENQEIgNFIQIgAw0DAkAgAC8BCiIEQecHSw0AIAAgBEEBdDsBCgsgACAALwEKEHggAiECIAMNBAtBACECDAMLAkAgACgCLCICKAK0ASAALwESQQxsaigCACgCECIEDQAgAEEAEHdBACECDAMLIAAoAgghBSAALwEUIQYgAC0ADCEDIAJBpwJqQQE6AAAgAkGmAmogA0EHakH8AXE6AAAgBEEAIAQtAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAVFDQAgAkG0AmogBSADEJUFGgsCQCACQaQCahDUBCICDQAgAkUhAgwDCyAAQQMQeEEAIQIMAgtBgj1B1gJBoR8Q8wQACyAAQQMQeCACIQILIAFBEGokACACC9MCAQZ/IwBBEGsiAyQAIABBtAJqIQQgAEGwAmotAAAhBQJAAkACQAJAIAINACAFIQUgBCEEDAELIAAgAiADQQxqEI4DIQYCQAJAIAMoAgwiByAALQCwAk4NACAEIAdqLQAADQAgBiAEIAcQrwUNACAHQQFqIQcMAQtBACEHCyAHIgdF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QEEAKAK83AEiAEHAAEcNACADQcAASQ0AQcTcASABEMsCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjcASABIAMgACADIABJGyIAEJUFGkEAQQAoArzcASIJIABrNgK83AEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE3AFB+NsBEMsCQQBBwAA2ArzcAUEAQfjbATYCuNwBIAIhAyABIQEgAg0BDAILQQBBACgCuNwBIABqNgK43AEgAiEDIAEhASACDQALCyAIENECIAhBIBDQAgJAIAVFDQBBAEEAKALA3AEgBWo2AsDcASAFIQMgBCEBA0AgASEBIAMhAwJAQQAoArzcASIAQcAARw0AIANBwABJDQBBxNwBIAEQywIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuNwBIAEgAyAAIAMgAEkbIgAQlQUaQQBBACgCvNwBIgkgAGs2ArzcASABIABqIQEgAyAAayECAkAgCSAARw0AQcTcAUH42wEQywJBAEHAADYCvNwBQQBB+NsBNgK43AEgAiEDIAEhASACDQEMAgtBAEEAKAK43AEgAGo2ArjcASACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAsDcASAHajYCwNwBIAchAyAGIQEDQCABIQEgAyEDAkBBACgCvNwBIgBBwABHDQAgA0HAAEkNAEHE3AEgARDLAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK43AEgASADIAAgAyAASRsiABCVBRpBAEEAKAK83AEiCSAAazYCvNwBIAEgAGohASADIABrIQICQCAJIABHDQBBxNwBQfjbARDLAkEAQcAANgK83AFBAEH42wE2ArjcASACIQMgASEBIAINAQwCC0EAQQAoArjcASAAajYCuNwBIAIhAyABIQEgAg0ACwtBAEEAKALA3AFBAWo2AsDcAUEBIQNB49YAIQECQANAIAEhASADIQMCQEEAKAK83AEiAEHAAEcNACADQcAASQ0AQcTcASABEMsCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjcASABIAMgACADIABJGyIAEJUFGkEAQQAoArzcASIJIABrNgK83AEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE3AFB+NsBEMsCQQBBwAA2ArzcAUEAQfjbATYCuNwB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QCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIMBC3EBAX8jAEEgayIDJAAgA0EYaiACEO4DIAMgAykDGDcDEAJAAkACQCADQRBqENUCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDyAhDuAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEO4DIANBEGogAhDuAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQrgIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEO4DIAJBIGogARDuAyACQRhqIAEQ7gMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCvAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDuAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQgQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrAILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDuAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQgQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrAILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDuAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQgQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrAILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQQAQkAIhBCADIAMpAxA3AwAgACACIAQgAxCqAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQRUQkAIhBCADIAMpAxA3AwAgACACIAQgAxCqAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEJACEJABIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEPECIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDvAyIDEJIBIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPECIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDvAyIDEJMBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPECIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBCBAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEIEDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCDAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQgQMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIMBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBCBAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCDAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEO8CC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQgwELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACACQQggAiAEEKICEPECCyADQRBqJAALXwEDfyMAQRBrIgMkACACEO8DIQQgAhDvAyEFIANBCGogAkECEPEDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDuAyADIAMpAwg3AwAgACACIAMQ+wIQ7wIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDuAyAAQbjrAEHA6wAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA7hrNwMACw0AIABBACkDwGs3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ7gMgAyADKQMINwMAIAAgAiADEPQCEPACIANBEGokAAsNACAAQQApA8hrNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEO4DAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEPICIgREAAAAAAAAAABjRQ0AIAAgBJoQ7gIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkDsGs3AwAMAgsgAEEAIAJrEO8CDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhDwA0F/cxDvAgsyAQF/IwBBEGsiAyQAIANBCGogAhDuAyAAIAMoAgxFIAMoAghBAkZxEPACIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhDuAwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxDyApoQ7gIMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQOwazcDAAwBCyAAQQAgAmsQ7wILIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhDuAyADIAMpAwg3AwAgACACIAMQ9AJBAXMQ8AIgA0EQaiQACwwAIAAgAhDwAxDvAgupAgIFfwF8IwBBwABrIgMkACADQThqIAIQ7gMgAkEYaiIEIAMpAzg3AwAgA0E4aiACEO4DIAIgAykDODcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBIIAUoAgAiByAGaiIGIAdIcw0AIAAgBhDvAgwBCyADIAUpAwA3AzACQAJAIAIgA0EwahDUAg0AIAMgBCkDADcDKCACIANBKGoQ1AJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahDeAgwBCyADIAUpAwA3AyAgAiACIANBIGoQ8gI5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEPICIgg5AwAgACAIIAIrAyCgEO4CCyADQcAAaiQAC80BAgV/AXwjAEEgayIDJAAgA0EYaiACEO4DIAJBGGoiBCADKQMYNwMAIANBGGogAhDuAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASiAFKAIAIgcgBmsiBiAHSHMNACAAIAYQ7wIMAQsgAyAFKQMANwMQIAIgAiADQRBqEPICOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDyAiIIOQMAIAAgAisDICAIoRDuAgsgA0EgaiQAC88BAwR/AX4BfCMAQSBrIgMkACADQRhqIAIQ7gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO4DIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBTQCACAENAIAfiIHQiCIpyAHpyIGQR91Rw0AIAAgBhDvAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ8gI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPICIgg5AwAgACAIIAIrAyCiEO4CCyADQSBqJAAL6AECBn8BfCMAQSBrIgMkACADQRhqIAIQ7gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO4DIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQACQAJAIAQoAgAiBkEBag4CAAIBCyAFKAIAQYCAgIB4Rg0BCyAFKAIAIgcgBm0iCCAGbCAHRw0AIAAgCBDvAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ8gI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPICIgk5AwAgACACKwMgIAmjEO4CCyADQSBqJAALLAECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCECAAIAQgAygCAHEQ7wILLAECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCECAAIAQgAygCAHIQ7wILLAECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCECAAIAQgAygCAHMQ7wILLAECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCECAAIAQgAygCAHQQ7wILLAECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCECAAIAQgAygCAHUQ7wILQQECfyACQRhqIgMgAhDwAzYCACACIAIQ8AMiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQ7gIPCyAAIAIQ7wILnQEBA38jAEEgayIDJAAgA0EYaiACEO4DIAJBGGoiBCADKQMYNwMAIANBGGogAhDuAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEP8CIQILIAAgAhDwAiADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ7gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO4DIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEPICOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDyAiIGOQMAIAIrAyAgBmUhAgwBCyAFKAIAIAQoAgBMIQILIAAgAhDwAiADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ7gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO4DIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEPICOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDyAiIGOQMAIAIrAyAgBmMhAgwBCyAFKAIAIAQoAgBIIQILIAAgAhDwAiADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEO4DIAJBGGoiBCADKQMYNwMAIANBGGogAhDuAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEP8CQQFzIQILIAAgAhDwAiADQSBqJAALPgEBfyMAQRBrIgMkACADQQhqIAIQ7gMgAyADKQMINwMAIABBuOsAQcDrACADEP0CGykDADcDACADQRBqJAAL4gEBBX8jAEEQayICJAAgAkEIaiABEO4DAkACQCABEPADIgNBAU4NAEEAIQMMAQsCQAJAIAANACAAIQMgAEEARyEEDAELIAAhBSADIQYDQCAGIQAgBSgCCCIDQQBHIQQCQCADDQAgAyEDIAQhBAwCCyADIQUgAEF/aiEGIAMhAyAEIQQgAEEBSg0ACwsgAyEAQQAhAyAERQ0AIAAgASgCTCIDQQN0akEYakEAIAMgACgCEC8BCEkbIQMLAkACQCADIgMNACACIAFB8AAQgwEMAQsgAyACKQMINwMACyACQRBqJAALxAEBBH8CQAJAIAIQ8AMiA0EBTg0AQQAhAwwBCwJAAkAgAQ0AIAEhAyABQQBHIQQMAQsgASEFIAMhBgNAIAYhASAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSABQX9qIQYgAyEDIAQhBCABQQFKDQALCyADIQFBACEDIARFDQAgASACKAJMIgNBA3RqQRhqQQAgAyABKAIQLwEISRshAwsCQCADIgMNACAAIAJB9AAQgwEPCyAAIAMpAwA3AwALNgEBfwJAIAIoAkwiAyACKACkAUEkaigCAEEEdkkNACAAIAJB9QAQgwEPCyAAIAIgASADEJ4CC7oBAQN/IwBBIGsiAyQAIANBEGogAhDuAyADIAMpAxA3AwhBACEEAkAgAiADQQhqEPsCIgVBDEsNACAFQcPxAGotAAAhBAsCQAJAIAQiBA0AIABCADcDAAwBCyACIAQ2AkwgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAAXIiBBCBAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyAAKQMAQgBSDQAgA0EYaiACQfoAEIMBCyADQSBqJAALgwEBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCDAUEAIQQLAkAgBCIERQ0AIAIgASgCrAEpAyA3AwAgAhD9AkUNACABKAKsAUIANwMgIAAgBDsBBAsgAkEQaiQAC6QBAQJ/IwBBMGsiAiQAIAJBKGogARDuAyACQSBqIAEQ7gMgAiACKQMoNwMQAkACQAJAIAEgAkEQahD6Ag0AIAIgAikDKDcDCCACQRhqIAFBDyACQQhqEOoCDAELIAEtAEINASABQQE6AEMgASgCrAEhAyACIAIpAyg3AwAgA0EAIAEgAhD5AhB2GgsgAkEwaiQADwtByckAQfc3QeoAQcwIEPgEAAtaAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQgwFBACEECyAAIAEgBBDgAiACQRBqJAALewEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIMBQQAhBAsCQCAEIgRFDQAgACAEOwEECwJAIAAgARDhAg0AIAJBCGogAUHqABCDAQsgAkEQaiQACyEBAX8jAEEQayICJAAgAkEIaiABQesAEIMBIAJBEGokAAtGAQF/IwBBEGsiAiQAAkACQCAAIAEQ4QIgAC8BBEF/akcNACABKAKsAUIANwMgDAELIAJBCGogAUHtABCDAQsgAkEQaiQAC10BAX8jAEEgayICJAAgAkEYaiABEO4DIAIgAikDGDcDCAJAAkAgAkEIahD9AkUNACACQRBqIAFBxTFBABDnAgwBCyACIAIpAxg3AwAgASACQQAQ5AILIAJBIGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARDuAwJAIAIpAwhQDQAgAiACKQMINwMAIAEgAkEBEOQCCyACQRBqJAALmAEBBH8jAEEQayICJAACQAJAIAEQ8AMiA0EQSQ0AIAJBCGogAUHuABCDAQwBCwJAAkAgACgCECgCACABKAJMIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEIaiABQekAEIMBQQAhBQsgBSIARQ0AIAJBCGogACADEIADIAIgAikDCDcDACABIAJBARDkAgsgAkEQaiQACwkAIAFBBxCJAwuCAgEDfyMAQSBrIgMkACADQRhqIAIQ7gMgAyADKQMYNwMAAkACQAJAAkAgAiADIANBEGogA0EMahCfAiIEQX9KDQAgACACQbAgQQAQ5wIMAQsCQAJAIARB0IYDSA0AIARBsPl8aiIEQQAvAbDJAU4NA0Hg4wAgBEEDdGotAANBCHENASAAIAJB3hhBABDnAgwCCyAEIAIoAKQBIgVBJGooAgBBBHZODQMgBSAFKAIgaiAEQQR0ai0AC0ECcQ0AIAAgAkHmGEEAEOcCDAELIAAgAykDGDcDAAsgA0EgaiQADwtBthNB9zdBzQJBwAsQ+AQAC0GV0gBB9zdB0gJBwAsQ+AQAC1YBAn8jAEEgayIDJAAgA0EYaiACEO4DIANBEGogAhDuAyADIAMpAxg3AwggAiADQQhqEKkCIQQgAyADKQMQNwMAIAAgAiADIAQQqwIQ8AIgA0EgaiQACw0AIABBACkD2Gs3AwALnQEBA38jAEEgayIDJAAgA0EYaiACEO4DIAJBGGoiBCADKQMYNwMAIANBGGogAhDuAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEP4CIQILIAAgAhDwAiADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEO4DIAJBGGoiBCADKQMYNwMAIANBGGogAhDuAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEP4CQQFzIQILIAAgAhDwAiADQSBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ7gMgASgCrAEgAikDCDcDICACQRBqJAALPwEBfwJAIAEtAEIiAg0AIAAgAUHsABCDAQ8LIAEgAkF/aiICOgBCIAAgASACQf8BcUEDdGpB0ABqKQMANwMAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCDAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARDzAiEAIAFBEGokACAAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCDAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARDzAiEAIAFBEGokACAAC4kCAgJ/AX4jAEHAAGsiAyQAAkACQCABLQBCIgQNACADQThqIAFB7AAQgwEMAQsgASAEQX9qIgQ6AEIgAyABIARB/wFxQQN0akHQAGopAwA3AzgLIAMgAykDODcDKAJAAkAgASADQShqEPUCDQACQCACQQJxRQ0AIAMgAykDODcDICABIANBIGoQ1AINAQsgAyADKQM4NwMYIANBMGogAUESIANBGGoQ6gJCACEFDAELAkAgAkEBcUUNACADIAMpAzg3AxAgASADQRBqEPYCDQAgAyADKQM4NwMIIANBMGogAUHqGiADQQhqEOsCQgAhBQwBCyADKQM4IQULIAAgBTcDACADQcAAaiQAC6AEAQV/AkAgBEH2/wNPDQAgABD2A0EAQQE6ANDdAUEAIAEpAAA3ANHdAUEAIAFBBWoiBSkAADcA1t0BQQAgBEEIdCAEQYD+A3FBCHZyOwHe3QFBAEEJOgDQ3QFB0N0BEPcDAkAgBEUNAEEAIQADQAJAIAQgACIGayIAQRAgAEEQSRsiB0UNACADIAZqIQhBACEAA0AgACIAQdDdAWoiCSAJLQAAIAggAGotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLQdDdARD3AyAGQRBqIgkhACAJIARJDQALCyACQQAoAtDdATYAAEEAQQE6ANDdAUEAIAEpAAA3ANHdAUEAIAUpAAA3ANbdAUEAQQA7Ad7dAUHQ3QEQ9wNBACEAA0AgAiAAIgBqIgkgCS0AACAAQdDdAWotAABzOgAAIABBAWoiCSEAIAlBBEcNAAsCQCAERQ0AIAFBBWohBUEAIQBBASEJA0BBAEEBOgDQ3QFBACABKQAANwDR3QFBACAFKQAANwDW3QFBACAJIgZBCHQgBkGA/gNxQQh2cjsB3t0BQdDdARD3AwJAIAQgACICayIAQRAgAEEQSRsiB0UNACADIAJqIQhBACEAA0AgCCAAIgBqIgkgCS0AACAAQdDdAWotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLIAJBEGoiByEAIAZBAWohCSAHIARJDQALCxD4Aw8LQdU5QTJBng4Q8wQAC78FAQZ/QX8hBQJAIARB9f8DSw0AIAAQ9gMCQAJAIARFDQAgAUEFaiEGQQAhAEEBIQcDQEEAQQE6ANDdAUEAIAEpAAA3ANHdAUEAIAYpAAA3ANbdAUEAIAciCEEIdCAIQYD+A3FBCHZyOwHe3QFB0N0BEPcDAkAgBCAAIglrIgBBECAAQRBJGyIFRQ0AIAMgCWohCkEAIQADQCAKIAAiAGoiByAHLQAAIABB0N0Bai0AAHM6AAAgAEEBaiIHIQAgByAFRw0ACwsgCUEQaiIFIQAgCEEBaiEHIAUgBEkNAAtBAEEBOgDQ3QFBACABKQAANwDR3QFBACABQQVqKQAANwDW3QFBAEEJOgDQ3QFBACAEQQh0IARBgP4DcUEIdnI7Ad7dAUHQ3QEQ9wMgBEUNAUEAIQADQAJAIAQgACIIayIAQRAgAEEQSRsiBUUNACADIAhqIQpBACEAA0AgACIAQdDdAWoiByAHLQAAIAogAGotAABzOgAAIABBAWoiByEAIAcgBUcNAAsLQdDdARD3AyAIQRBqIgchACAHIARJDQAMAgsAC0EAQQE6ANDdAUEAIAEpAAA3ANHdAUEAIAFBBWopAAA3ANbdAUEAQQk6ANDdAUEAIARBCHQgBEGA/gNxQQh2cjsB3t0BQdDdARD3AwtBACEAA0AgAiAAIgBqIgcgBy0AACAAQdDdAWotAABzOgAAIABBAWoiByEAIAdBBEcNAAtBAEEBOgDQ3QFBACABKQAANwDR3QFBACABQQVqKQAANwDW3QFBAEEAOwHe3QFB0N0BEPcDQQAhAANAIAIgACIAaiIHIActAAAgAEHQ3QFqLQAAczoAACAAQQFqIgchACAHQQRHDQALEPgDQQAhAEEAIQcDQCAAIgVBAWoiCiEAIAcgAiAFai0AAGoiBSEHIAUhBSAKQQRHDQALCyAFC90DAQh/QQAhAgNAIAAgAiIDQQJ0IgJqIAEgAmotAAA6AAAgACACQQFyIgRqIAEgBGotAAA6AAAgACACQQJyIgRqIAEgBGotAAA6AAAgACACQQNyIgJqIAEgAmotAAA6AAAgA0EBaiIDIQIgA0EIRw0AC0EIIQIDQCACIgNBAnQiASAAaiICQX9qLQAAIQUgAkF+ai0AACEGIAJBfWotAAAhByACQXxqLQAAIQgCQAJAIANBB3EiBEUNACAFIQkgBiEFIAchBiAIIQcMAQsgCEHQ8QBqLQAAIQkgBUHQ8QBqLQAAIQUgBkHQ8QBqLQAAIQYgA0EDdkHQ8wBqLQAAIAdB0PEAai0AAHMhBwsgByEHIAYhBiAFIQUgCSEIAkACQCAEQQRGDQAgCCEEIAUhBSAGIQYgByEHDAELIAhB/wFxQdDxAGotAAAhBCAFQf8BcUHQ8QBqLQAAIQUgBkH/AXFB0PEAai0AACEGIAdB/wFxQdDxAGotAAAhBwsgAiACQWBqLQAAIAdzOgAAIAAgAUEBcmogAkFhai0AACAGczoAACAAIAFBAnJqIAJBYmotAAAgBXM6AAAgACABQQNyaiACQWNqLQAAIARzOgAAIANBAWoiASECIAFBPEcNAAsLzAUBCX9BACECA0AgAiIDQQJ0IQRBACECA0AgASAEaiACIgJqIgUgBS0AACAAIAIgBGpqLQAAczoAACACQQFqIgUhAiAFQQRHDQALIANBAWoiBCECIARBBEcNAAtBASECA0AgAiEGQQAhAgNAIAIhBUEAIQIDQCABIAIiAkECdGogBWoiBCAELQAAQdDxAGotAAA6AAAgAkEBaiIEIQIgBEEERw0ACyAFQQFqIgQhAiAEQQRHDQALIAEtAAEhAiABIAEtAAU6AAEgAS0ACSEEIAEgAS0ADToACSABIAQ6AAUgASACOgANIAEtAAIhAiABIAEtAAo6AAIgASACOgAKIAEtAAYhAiABIAEtAA46AAYgASACOgAOIAEtAAMhAiABIAEtAA86AAMgASABLQALOgAPIAEgAS0ABzoACyABIAI6AAcCQCAGQQ5GDQBBACECA0AgASACIgdBAnRqIgIgAi0AAyIEIAItAAAiBXMiA0EBdCADwEEHdkEbcXMgBHMgBCACLQACIgNzIgggAi0AASIJIAVzIgpzIgRzOgADIAIgAyAIQQF0IAjAQQd2QRtxc3MgBHM6AAIgAiAJIAMgCXMiA0EBdCADwEEHdkEbcXNzIARzOgABIAIgBSAKQQF0IArAQQd2QRtxc3MgBHM6AAAgB0EBaiIEIQIgBEEERw0ACyAGQQR0IQlBACECA0AgAiIIQQJ0IgUgCWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACyAGQQFqIQIMAQsLQQAhAgNAIAIiCEECdCIFQeABaiEDQQAhAgNAIAEgBWogAiICaiIEIAQtAAAgACADIAJqai0AAHM6AAAgAkEBaiIEIQIgBEEERw0ACyAIQQFqIgQhAiAEQQRHDQALCwsAQeDdASAAEPQDCwsAQeDdASAAEPUDCw8AQeDdAUEAQfABEJcFGgvNAQEFfyMAQRBrIgQkAEEAIQVBACEGA0AgBSADIAYiBmotAABqIgchBSAGQQFqIgghBiAIQSBHDQALAkAgBw0AQbnWAEEAEDxBjjpBMEG0CxDzBAALQQAgAykAADcA0N8BQQAgA0EYaikAADcA6N8BQQAgA0EQaikAADcA4N8BQQAgA0EIaikAADcA2N8BQQBBAToAkOABQfDfAUEQECkgBEHw3wFBEBD/BDYCACAAIAEgAkGwFCAEEP4EIgUQQyEGIAUQIiAEQRBqJAAgBgvXAgEEfyMAQRBrIgQkAAJAAkACQBAjDQACQCAADQAgAkUNAEF/IQUMAwsCQCAAQQBHQQAtAJDgASIGQQJGcUUNAEF/IQUMAwtBfyEFIABFIAZBA0ZxDQIgAyABaiIGQQRqIgcQISEFAkAgAEUNACAFIAAgARCVBRoLAkAgAkUNACAFIAFqIAIgAxCVBRoLQdDfAUHw3wEgBSAGaiAFIAYQ8gMgBSAHEEIhACAFECIgAA0BQQwhAgNAAkAgAiIAQfDfAWoiBS0AACICQf8BRg0AIABB8N8BaiACQQFqOgAAQQAhBQwECyAFQQA6AAAgAEF/aiECQQAhBSAADQAMAwsAC0GOOkGnAUG4LBDzBAALIARBvxg2AgBBlhcgBBA8AkBBAC0AkOABQf8BRw0AIAAhBQwBC0EAQf8BOgCQ4AFBA0G/GEEJEP4DEEggACEFCyAEQRBqJAAgBQvdBgICfwF+IwBBkAFrIgMkAAJAECMNAAJAAkACQAJAIABBfmoOAwECAAMLAkACQAJAQQAtAJDgAUF/ag4DAAECBQsgAyACNgJAQcDQACADQcAAahA8AkAgAkEXSw0AIANBhx82AgBBlhcgAxA8QQAtAJDgAUH/AUYNBUEAQf8BOgCQ4AFBA0GHH0ELEP4DEEgMBQsgA0H4AGpBEGogAUEQaikAADcDACADQfgAakEIaiABQQhqKQAANwMAIAMgASkAACIFNwN4AkAgBadBytGQ93xGDQAgA0GWNjYCMEGWFyADQTBqEDxBAC0AkOABQf8BRg0FQQBB/wE6AJDgAUEDQZY2QQkQ/gMQSAwFCwJAIAMoAnxBAkYNACADQdMgNgIgQZYXIANBIGoQPEEALQCQ4AFB/wFGDQVBAEH/AToAkOABQQNB0yBBCxD+AxBIDAULQQBBAEHQ3wFBIEHw3wFBECADQYABakEQQdDfARDSAkEAQgA3APDfAUEAQgA3AIDgAUEAQgA3APjfAUEAQgA3AIjgAUEAQQI6AJDgAUEAQQE6APDfAUEAQQI6AIDgAQJAQQBBIEEAQQAQ+gNFDQAgA0HSIzYCEEGWFyADQRBqEDxBAC0AkOABQf8BRg0FQQBB/wE6AJDgAUEDQdIjQQ8Q/gMQSAwFC0HCI0EAEDwMBAsgAyACNgJwQd/QACADQfAAahA8AkAgAkEjSw0AIANBuw02AlBBlhcgA0HQAGoQPEEALQCQ4AFB/wFGDQRBAEH/AToAkOABQQNBuw1BDhD+AxBIDAQLIAEgAhD8Aw0DQQAhAAJAAkAgAS0AAA0AQQAhAgNAIAIiBEEBaiIAQSBGDQIgACECIAEgAGotAABFDQALIARBHkshAAsgACEAIANBw8gANgJgQZYXIANB4ABqEDwCQEEALQCQ4AFB/wFGDQBBAEH/AToAkOABQQNBw8gAQQoQ/gMQSAsgAEUNBAtBAEEDOgCQ4AFBAUEAQQAQ/gMMAwsgASACEPwDDQJBBCABIAJBfGoQ/gMMAgsCQEEALQCQ4AFB/wFGDQBBAEEEOgCQ4AELQQIgASACEP4DDAELQQBB/wE6AJDgARBIQQMgASACEP4DCyADQZABaiQADwtBjjpBwAFBpw8Q8wQAC/4BAQN/IwBBIGsiAiQAAkACQAJAIAFBBEsNACACQdskNgIAQZYXIAIQPEHbJCEBQQAtAJDgAUH/AUcNAUF/IQEMAgtB0N8BQYDgASAAIAFBfGoiAWogACABEPMDIQNBDCEAAkADQAJAIAAiAUGA4AFqIgAtAAAiBEH/AUYNACABQYDgAWogBEEBajoAAAwCCyAAQQA6AAAgAUF/aiEAIAENAAsLAkAgAw0AQQAhAQwCCyACQYkZNgIQQZYXIAJBEGoQPEGJGSEBQQAtAJDgAUH/AUcNAEF/IQEMAQtBAEH/AToAkOABQQMgAUEJEP4DEEhBfyEBCyACQSBqJAAgAQs0AQF/AkAQIw0AAkBBAC0AkOABIgBBBEYNACAAQf8BRg0AEEgLDwtBjjpB2gFB1ykQ8wQAC/kIAQR/IwBBgAJrIgMkAEEAKAKU4AEhBAJAAkACQAJAAkAgAEF/ag4EAAIDAQQLIAMgBCgCODYCEEHSFSADQRBqEDwgBEGAAjsBECAEQQAoApzWASIAQYCAgAhqNgI0IAQgAEGAgIAQajYCKCAELwEGQQFGDQMgA0HlxgA2AgQgA0EBNgIAQf3QACADEDwgBEEBOwEGIARBAyAEQQZqQQIQhAUMAwsgBEEAKAKc1gEiAEGAgIAIajYCNCAEIABBgICAEGo2AigCQCACRQ0AIAMgAS0AACIAOgD/ASACQX9qIQUgAUEBaiEGAkACQAJAAkACQAJAAkACQAJAIABB8H5qDgoCAwwEBQYHAQgACAsgAS0AA0EMaiIEIAVLDQggBiAEEIEFIgQQigUaIAQQIgwLCyAFRQ0HIAEtAAEgAUECaiACQX5qEFcMCgsgBC8BECECIAQgAS0AAkEIdCABLQABIgByOwEQAkAgAEEBcUUNACAEKAJkDQAgBEGACBDOBDYCZAsCQCAELQAQQQJxRQ0AIAJBAnENACAEEK8ENgIYCyAEQQAoApzWAUGAgIAIajYCFCADIAQvARA2AmBB2QogA0HgAGoQPAwJCyADIAA6ANABIAQvAQZBAUcNCAJAIABB5QBqQf8BcUH9AUsNACADIAA2AnBB2gkgA0HwAGoQPAsgA0HQAWpBAUEAQQAQ+gMNCCAEKAIMIgBFDQggBEEAKAKY6QEgAGo2AjAMCAsgA0HQAWoQbBpBACgClOABIgQvAQZBAUcNBwJAIAMtAP8BIgBB5QBqQf8BcUH9AUsNACADIAA2AoABQdoJIANBgAFqEDwLIANB/wFqQQEgA0HQAWpBIBD6Aw0HIAQoAgwiAEUNByAEQQAoApjpASAAajYCMAwHCyAAIAEgBiAFEJYFKAIAEGoQ/wMMBgsgACABIAYgBRCWBSAFEGsQ/wMMBQtBlgFBAEEAEGsQ/wMMBAsgAyAANgJQQcIKIANB0ABqEDwgA0H/AToA0AFBACgClOABIgQvAQZBAUcNAyADQf8BNgJAQdoJIANBwABqEDwgA0HQAWpBAUEAQQAQ+gMNAyAEKAIMIgBFDQMgBEEAKAKY6QEgAGo2AjAMAwsgAyACNgIwQek0IANBMGoQPCADQf8BOgDQAUEAKAKU4AEiBC8BBkEBRw0CIANB/wE2AiBB2gkgA0EgahA8IANB0AFqQQFBAEEAEPoDDQIgBCgCDCIARQ0CIARBACgCmOkBIABqNgIwDAILIAMgBCgCODYCoAFB/DAgA0GgAWoQPCAEIARBEWotAABBCHQ7ARAgBC8BBkECRg0BIANB4sYANgKUASADQQI2ApABQf3QACADQZABahA8IARBAjsBBiAEQQMgBEEGakECEIQFDAELIAMgASACEIUCNgLAAUG9FCADQcABahA8IAQvAQZBAkYNACADQeLGADYCtAEgA0ECNgKwAUH90AAgA0GwAWoQPCAEQQI7AQYgBEEDIARBBmpBAhCEBQsgA0GAAmokAAvrAQEBfyMAQTBrIgIkAAJAAkAgAQ0AIAIgADoALkEAKAKU4AEiAS8BBkEBRw0BAkAgAEHlAGpB/wFxQf0BSw0AIAIgAEH/AXE2AgBB2gkgAhA8CyACQS5qQQFBAEEAEPoDDQEgASgCDCIARQ0BIAFBACgCmOkBIABqNgIwDAELIAIgADYCIEHCCSACQSBqEDwgAkH/AToAL0EAKAKU4AEiAC8BBkEBRw0AIAJB/wE2AhBB2gkgAkEQahA8IAJBL2pBAUEAQQAQ+gMNACAAKAIMIgFFDQAgAEEAKAKY6QEgAWo2AjALIAJBMGokAAvJBQEHfyMAQRBrIgEkAAJAAkAgACgCDEUNAEEAKAKY6QEgACgCMGtBAE4NAQsCQCAAQRRqQYCAgAgQ9QRFDQAgAC0AEEUNAEGWMUEAEDwgACAAQRFqLQAAQQh0OwEQCwJAIAAtABBBAnFFDQBBACgC1OABIAAoAhxGDQAgASAAKAIYNgIIAkAgACgCIA0AIABBgAIQITYCIAsgACgCIEGAAiABQQhqELAEIQJBACgC1OABIQMgAkUNACABKAIIIQQgACgCICEFIAFBmgE6AA1BnH8hBgJAQQAoApTgASIHLwEGQQFHDQAgAUENakEBIAUgAhD6AyICIQYgAg0AAkAgBygCDCICDQBBACEGDAELIAdBACgCmOkBIAJqNgIwQQAhBgsgBg0AIAAgASgCCDYCGCADIARHDQAgAEEAKALU4AE2AhwLAkAgACgCZEUNACAAKAJkEMwEIgJFDQAgAiECA0AgAiECAkAgAC0AEEEBcUUNACACLQACIQMgAUGZAToADkGcfyEGAkBBACgClOABIgUvAQZBAUcNACABQQ5qQQEgAiADQQxqEPoDIgIhBiACDQACQCAFKAIMIgINAEEAIQYMAQsgBUEAKAKY6QEgAmo2AjBBACEGCyAGDQILIAAoAmQQzQQgACgCZBDMBCIGIQIgBg0ACwsCQCAAQTRqQYCAgAIQ9QRFDQAgAUGSAToAD0EAKAKU4AEiAi8BBkEBRw0AIAFBkgE2AgBB2gkgARA8IAFBD2pBAUEAQQAQ+gMNACACKAIMIgZFDQAgAkEAKAKY6QEgBmo2AjALAkAgAEEkakGAgCAQ9QRFDQBBmwQhAgJAEIEERQ0AIAAvAQZBAnRB4PMAaigCACECCyACEB8LAkAgAEEoakGAgCAQ9QRFDQAgABCCBAsgAEEsaiAAKAIIEPQEGiABQRBqJAAPC0HaEEEAEDwQNQALBABBAQuVAgEEfyMAQTBrIgEkACAAQQZqIQICQAJAAkAgAC8BBkF+ag4DAgABAAsgAUGrxQA2AiQgAUEENgIgQf3QACABQSBqEDwgAEEEOwEGIABBAyACQQIQhAULEP0DCwJAIAAoAjhFDQAQgQRFDQAgACgCOCEDIAAvAWAhBCABIAAoAjw2AhggASAENgIUIAEgAzYCEEHxFCABQRBqEDwgACgCOCAALwFgIAAoAjwgAEHAAGoQ+QMNAAJAIAIvAQBBA0YNACABQa7FADYCBCABQQM2AgBB/dAAIAEQPCAAQQM7AQYgAEEDIAJBAhCEBQsgAEEAKAKc1gEiAkGAgIAIajYCNCAAIAJBgICAEGo2AigLIAFBMGokAAv9AgECfyMAQRBrIgIkAAJAAkACQAJAAkACQAJAAkACQCABLwEOIgNB/35qDgYCAwcHBwEACyADQYBdag4EAwUGBAYLIAAgAUEQaiABLQAMQQEQhAQMBgsgABCCBAwFCwJAAkAgAC8BBkF+ag4DBgABAAsgAkGrxQA2AgQgAkEENgIAQf3QACACEDwgAEEEOwEGIABBAyAAQQZqQQIQhAULEP0DDAQLIAEgACgCOBDSBBoMAwsgAUHDxAAQ0gQaDAILAkACQCAAKAI8IgANAEEAIQAMAQsgAEEAQQYgAEGSzwBBBhCvBRtqIQALIAEgABDSBBoMAQsgACABQfTzABDVBEF+cUGAAUcNAAJAIAAoAghB5wdLDQAgAEHoBzYCCAsCQCAAKAIIQYG4mSlJDQAgAEGAuJkpNgIICyAAKAIMIgFFDQACQCABIAAoAghBA2wiA08NACAAIAM2AgwLIAAoAgwiAUUNACAAQQAoApjpASABajYCMAsgAkEQaiQAC6cEAQd/IwBBMGsiBCQAAkACQCACDQBBxCVBABA8IAAoAjgQIiAAKAI8ECIgAEIANwI4IABB0AA7AWAgAEHAAGpCADcCACAAQcgAakIANwIAIABB0ABqQgA3AgAgAEHYAGpCADcCAAJAIANFDQBBoBhBABDHAhoLIAAQggQMAQsCQAJAIAJBAWoQISABIAIQlQUiBRDEBUHGAEkNACAFQZnPAEEFEK8FDQAgBUEFaiIGQcAAEMEFIQcgBkE6EMEFIQggB0E6EMEFIQkgB0EvEMEFIQogB0UNACAKRQ0AAkAgCUUNACAHIAlPDQEgCSAKTw0BCwJAAkBBACAIIAggB0sbIggNACAGIQYMAQsgBkGLxwBBBRCvBQ0BIAhBAWohBgsgByAGIgZrQcAARw0AIAdBADoAACAEQRBqIAYQ9wRBIEcNAEHQACEGAkAgCUUNACAJQQA6AAAgCUEBahD5BCIJIQYgCUGAgHxqQYKAfEkNAQsgCkEAOgAAIAdBAWoQgAUhByAKQS86AAAgChCABSEJIAAQhQQgACAGOwFgIAAgCTYCPCAAIAc2AjggACAEKQMQNwJAIABByABqIAQpAxg3AgAgAEHQAGogBEEgaikDADcCACAAQdgAaiAEQShqKQMANwIAAkAgA0UNAEGgGCAFIAEgAhCVBRDHAhoLIAAQggQMAQsgBCABNgIAQa8XIAQQPEEAECJBABAiCyAFECILIARBMGokAAtLACAAKAI4ECIgACgCPBAiIABCADcCOCAAQdAAOwFgIABBwABqQgA3AgAgAEHIAGpCADcCACAAQdAAakIANwIAIABB2ABqQgA3AgALQwECf0GA9AAQ2wQiAEGIJzYCCCAAQQI7AQYCQEGgGBDGAiIBRQ0AIAAgASABEMQFQQAQhAQgARAiC0EAIAA2ApTgAQukAQEEfyMAQRBrIgQkACABEMQFIgVBA2oiBhAhIgcgADoAASAHQZgBOgAAIAdBAmogASAFEJUFGkGcfyEBAkBBACgClOABIgAvAQZBAUcNACAEQZgBNgIAQdoJIAQQPCAHIAYgAiADEPoDIgUhASAFDQACQCAAKAIMIgENAEEAIQEMAQsgAEEAKAKY6QEgAWo2AjBBACEBCyAHECIgBEEQaiQAIAELDwBBACgClOABLwEGQQFGC5UCAQh/IwBBEGsiASQAAkBBACgClOABIgJFDQAgAkERai0AAEEBcUUNACACLwEGQQFHDQAgARCvBDYCCAJAIAIoAiANACACQYACECE2AiALA0AgAigCIEGAAiABQQhqELAEIQNBACgC1OABIQRBAiEFAkAgA0UNACABKAIIIQYgAigCICEHIAFBmwE6AA9BnH8hBQJAQQAoApTgASIILwEGQQFHDQAgAUGbATYCAEHaCSABEDwgAUEPakEBIAcgAxD6AyIDIQUgAw0AAkAgCCgCDCIFDQBBACEFDAELIAhBACgCmOkBIAVqNgIwQQAhBQtBAiAEIAZGQQF0IAUbIQULIAVFDQALQcMyQQAQPAsgAUEQaiQAC1ABAn8jAEEQayIBJABBACECAkAgAC8BDkGBI0cNACABQQAoApTgASgCODYCACAAQc3VACABEP4EIgIQ0gQaIAIQIkEBIQILIAFBEGokACACCw0AIAAoAgQQxAVBDWoLawIDfwF+IAAoAgQQxAVBDWoQISEBAkAgACgCECICRQ0AIAJBACACLQAEIgNrQQxsakFkaikDACEEIAEgAzoADCABIAQ3AwALIAEgACgCCDYCCCAAKAIEIQAgAUENaiAAIAAQxAUQlQUaIAELggMCBn8BfgJAAkAgACgCoAIiAUUNACAAQRhqIQIgASEBA0ACQCACIAEiAygCBBDEBUENaiIEEMgEIgFFDQAgAUEBRg0CIABBADYCoAIgAhDKBBoMAgsgAygCBBDEBUENahAhIQECQCADKAIQIgVFDQAgBUEAIAUtAAQiBmtBDGxqQWRqKQMAIQcgASAGOgAMIAEgBzcDAAsgASADKAIINgIIIAMoAgQhBSABQQ1qIAUgBRDEBRCVBRogAiABIAQQyQQNAiABECIgAygCACIBIQMgASEFAkAgAUUNAANAAkAgAyIBLQAMQQFxDQAgASEFDAILIAEoAgAiASEDIAEhBSABDQALCyAAIAUiATYCoAICQCABDQAgAhDKBBoLIAAoAqACIgMhASADDQALCwJAIABBEGpBoOg7EPUERQ0AIAAQjgQLAkAgAEEUakHQhgMQ9QRFDQAgAC0ACEUNACAAQQA6AAggAEEDQQBBABCEBQsPC0HAyQBB3ThBkgFBlRMQ+AQAC+4DAQl/IwBBIGsiASQAAkACQAJAIAAtAAZFDQAgAC0ACQ0BIABBAToACQJAIAAoAgwiAkUNACACIQIDQAJAIAIiAygCEA0AQaTgASECAkADQAJAIAIoAgAiAg0AQQkhBAwCC0EBIQUCQAJAIAItABBBAUsNAEEMIQQMAQsDQAJAAkAgAiAFIgZBDGxqIgdBJGoiCCgCACADKAIIRg0AQQEhBUEAIQQMAQtBASEFQQAhBCAHQSlqIgktAABBAXENAAJAAkAgAygCECIFIAhHDQBBACEFDAELAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAJIAktAABBAXI6AAAgAUEbaiAIQQAgB0EoaiIFLQAAa0EMbGpBZGopAwAQ/QQgAygCBCEEIAEgBS0AADYCCCABIAQ2AgAgASABQRtqNgIEQZYzIAEQPCADIAg2AhAgAEEBOgAIIAMQmARBACEFC0EPIQQLIAQhBCAFRQ0BIAZBAWoiBCEFIAQgAi0AEEkNAAtBDCEECyACIQIgBCIFIQQgBUEMRg0ACwsgBEF3ag4HAAICAgICAAILIAMoAgAiBSECIAUNAAsLIAAtAAlFDQIgAEEAOgAJCyABQSBqJAAPC0HyMUHdOEHOAEGJLhD4BAALQfMxQd04QeAAQYkuEPgEAAukBQIGfwF+IwBBwABrIgIkAAJAIAAtAAkNAAJAAkACQAJAAkAgAS8BDkH/fmoOBAEDAgADCyAAKAIMIgNFDQMgAyEDA0ACQCADIgMoAhAiBEUNACAEIAQtAAVB/gFxOgAFIAIgAygCBDYCAEHHFiACEDwgA0EANgIQIABBAToACCADEJgECyADKAIAIgQhAyAEDQAMBAsACyABQRlqIQUgAS0ADEFwaiEGIABBDGohBANAIAQoAgAiA0UNAyADIQQgAygCBCIHIAUgBhCvBQ0ACwJAIAEpAxAiCEIAUg0AIAMoAhAiBEUNAyAEIAQtAAVB/gFxOgAFIAIgBzYCEEHHFiACQRBqEDwgA0EANgIQIABBAToACCADEJgEDAMLAkACQCAIEJkEIgUNAEEAIQQMAQtBACEEIAUtABAgAS0AGCIGTQ0AIAUgBkEMbGpBJGohBAsgBCIERQ0CIAMoAhAiBSAERg0CAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAEIAQtAAVBAXI6AAUgAkE7aiAEQQAgBC0ABGtBDGxqQWRqKQMAEP0EIAMoAgQhBSACIAQtAAQ2AiggAiAFNgIgIAIgAkE7ajYCJEGWMyACQSBqEDwgAyAENgIQIABBAToACCADEJgEDAILIABBGGoiBiABEMMEDQECQAJAIAAoAgwiAw0AIAMhBQwBCyADIQQDQAJAIAQiAy0ADEEBcQ0AIAMhBQwCCyADKAIAIgMhBCADIQUgAw0ACwsgACAFIgM2AqACIAMNASAGEMoEGgwBCyAAQQE6AAcgAEEMaiEEAkADQCAEKAIAIgNFDQEgAyEEIAMoAhANAAsgAEEAOgAHCyAAIAFBpPQAENUEGgsgAkHAAGokAA8LQfIxQd04QbgBQacREPgEAAssAQF/QQBBsPQAENsEIgA2ApjgASAAQQE6AAYgAEEAKAKc1gFBoOg7ajYCEAvXAQEEfyMAQRBrIgEkAAJAAkBBACgCmOABIgItAAkNACACQQE6AAkCQCACKAIMIgNFDQAgAyEDA0ACQCADIgQoAhAiA0UNACADQQAgAy0ABGtBDGxqQVxqIABHDQAgAyADLQAFQf4BcToABSABIAQoAgQ2AgBBxxYgARA8IARBADYCECACQQE6AAggBBCYBAsgBCgCACIEIQMgBA0ACwsgAi0ACUUNASACQQA6AAkgAUEQaiQADwtB8jFB3ThB4QFBxC8Q+AQAC0HzMUHdOEHnAUHELxD4BAALqgIBBn8CQAJAAkACQAJAQQAoApjgASICRQ0AIAAQxAUhAyACQQxqIgQhBQJAA0AgBSgCACIGRQ0BIAYhBSAGKAIEIAAgAxCvBQ0ACyAGDQILIAItAAkNAgJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahDKBBoLQRQQISIHIAE2AgggByAANgIEIAQoAgAiBkUNAyAAIAYoAgQQwwVBAEgNAyAGIQUDQAJAIAUiAygCACIGDQAgBiEBIAMhAwwGCyAGIQUgBiEBIAMhAyAAIAYoAgQQwwVBf0oNAAwFCwALQd04QfUBQeI1EPMEAAtB3ThB+AFB4jUQ8wQAC0HyMUHdOEHrAUGjDRD4BAALIAYhASAEIQMLIAcgATYCACADIAc2AgAgAkEBOgAIIAcL0gIBBH8jAEEQayIAJAACQAJAAkBBACgCmOABIgEtAAkNAAJAIAEoAqACRQ0AIAFBADYCoAIgAUEYahDKBBoLIAEtAAkNASABQQE6AAkCQCABKAIMIgJFDQAgAiECA0ACQCACIgIoAhAiA0UNACADIAMtAAVB/gFxOgAFIAAgAigCBDYCAEHHFiAAEDwgAkEANgIQIAFBAToACCACEJgECyACKAIAIgMhAiADDQALCyABLQAJRQ0CIAFBADoACQJAIAEoAgwiAkUNACACIQIDQAJAIAIiAigCECIDRQ0AIAMgAy0ABUH+AXE6AAULIAEgAigCADYCDCACQQA2AgQgAhAiIAEoAgwiAyECIAMNAAsLIAFBAToACCAAQRBqJAAPC0HyMUHdOEHrAUGjDRD4BAALQfIxQd04QbICQcAiEPgEAAtB8zFB3ThBtQJBwCIQ+AQACwwAQQAoApjgARCOBAvPAQECfyMAQcAAayIDJAACQAJAAkACQAJAIABBf2oOIAABAgQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQDBAsgAyABQRRqNgIQQYQYIANBEGoQPAwDCyADIAFBFGo2AiBB7xcgA0EgahA8DAILIAMgAUEUajYCMEH8FiADQTBqEDwMAQsgAS0ABCEAIAIvAQQhBCADIAItAAc2AgwgAyAENgIIIAMgADYCBCADIAFBACAAa0EMbGpBcGo2AgBBiD8gAxA8CyADQcAAaiQACzEBAn9BDBAhIQJBACgCnOABIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgKc4AELkwEBAn8CQAJAQQAtAKDgAUUNAEEAQQA6AKDgASAAIAEgAhCVBAJAQQAoApzgASIDRQ0AIAMhAwNAIAMiAygCCCAAIAEgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtAKDgAQ0BQQBBAToAoOABDwtB/8cAQbg6QeMAQZIPEPgEAAtB3ckAQbg6QekAQZIPEPgEAAuaAQEDfwJAAkBBAC0AoOABDQBBAEEBOgCg4AEgACgCECEBQQBBADoAoOABAkBBACgCnOABIgJFDQAgAiECA0AgAiICKAIIQcAAIAEgACACKAIEEQYAIAIoAgAiAyECIAMNAAsLQQAtAKDgAQ0BQQBBADoAoOABDwtB3ckAQbg6Qe0AQZoyEPgEAAtB3ckAQbg6QekAQZIPEPgEAAswAQN/QaTgASEBA0ACQCABKAIAIgINAEEADwsgAiEBIAIhAyACKQMIIABSDQALIAMLWQEEfwJAIAAtABAiAg0AQQAPCyAAQSRqIQNBACEEA0ACQCADIAQiBEEMbGooAgAgAUcNACAAIARBDGxqQSRqQQAgABsPCyAEQQFqIgUhBCAFIAJHDQALQQALYgICfwF+IANBEGoQISIEQQE6AAMgAEEAIAAtAAQiBWtBDGxqQWRqKQMAIQYgBCABOwEOIAQgBToADSAEIAY3AgQgBCADOgAMIARBEGogAiADEJUFGiAEENQEIQMgBBAiIAML2wIBAn8CQAJAAkBBAC0AoOABDQBBAEEBOgCg4AECQEGo4AFB4KcSEPUERQ0AAkBBACgCpOABIgBFDQAgACEAA0BBACgCnNYBIAAiACgCHGtBAEgNAUEAIAAoAgA2AqTgASAAEJ0EQQAoAqTgASIBIQAgAQ0ACwtBACgCpOABIgBFDQAgACEAA0AgACIBKAIAIgBFDQECQEEAKAKc1gEgACgCHGtBAEgNACABIAAoAgA2AgAgABCdBAsgASgCACIBIQAgAQ0ACwtBAC0AoOABRQ0BQQBBADoAoOABAkBBACgCnOABIgBFDQAgACEAA0AgACIAKAIIQTBBAEEAIAAoAgQRBgAgACgCACIBIQAgAQ0ACwtBAC0AoOABDQJBAEEAOgCg4AEPC0HdyQBBuDpBlAJBgxMQ+AQAC0H/xwBBuDpB4wBBkg8Q+AQAC0HdyQBBuDpB6QBBkg8Q+AQAC5wCAQN/IwBBEGsiASQAAkACQAJAQQAtAKDgAUUNAEEAQQA6AKDgASAAEJEEQQAtAKDgAQ0BIAEgAEEUajYCAEEAQQA6AKDgAUHvFyABEDwCQEEAKAKc4AEiAkUNACACIQIDQCACIgIoAghBAiAAQQAgAigCBBEGACACKAIAIgMhAiADDQALC0EALQCg4AENAkEAQQE6AKDgAQJAIAAoAgQiAkUNACACIQIDQCAAIAIiAigCACIDNgIEAkAgAi0AB0EFSQ0AIAIoAgwQIgsgAhAiIAMhAiADDQALCyAAECIgAUEQaiQADwtB/8cAQbg6QbABQdgsEPgEAAtB3ckAQbg6QbIBQdgsEPgEAAtB3ckAQbg6QekAQZIPEPgEAAuUDgIKfwF+IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEALQCg4AENAEEAQQE6AKDgAQJAIAAtAAMiAkEEcUUNAEEAQQA6AKDgAQJAQQAoApzgASIDRQ0AIAMhAwNAIAMiAygCCEESQQAgACADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtAKDgAUUNCEHdyQBBuDpB6QBBkg8Q+AQACyAAKQIEIQtBpOABIQQCQANAAkAgBCgCACIDDQBBACEFDAILIAMhBCADIQUgAykDCCALUg0ACwtBACEEAkAgBSIDRQ0AIAMgAC0ADUE/cSIEQQxsakEkakEAIAQgAy0AEEkbIQQLIAQhBQJAIAJBAXFFDQBBECEEIAUhAiADIQMMBwsgAC0ADQ0EIAAvAQ4NBCADIQQCQCADDQAgABCfBCEECwJAIAQiAy8BEiIFIAAvARAiBEYNAAJAIAVBD3EgBEEPcU0NAEEDIAMgABCXBEEAKAKk4AEiBCADRg0DIAQhBANAIAQiBUUNBSAFKAIAIgIhBCACIANHDQALIAUgAygCADYCAAwECyADIAQ7ARILIAMhAwwDC0HdyQBBuDpBvgJBjxEQ+AQAC0EAIAMoAgA2AqTgAQsgAxCdBCAAEJ8EIQMLIAMiA0EAKAKc1gFBgIn6AGo2AhwgA0EkaiEEIAMhAwwBCyAFIQQgAyEDCyADIQYCQAJAIAQiBQ0AQRAhBEEAIQIMAQsCQAJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgRBf2ogBi0AESIDIANB/wFGG0EBaiIDa0H/AHEiAkUNAAJAIAMgBGtB/ABxQTxPDQBBEyEDDAMLQRMhAyACQQVJDQILIAYgBDoAEQtBECEDCyADIQcCQAJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiA0GA4ANxQYAgRw0CAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAiACLAAGIgNBAEgNAiACIANBgAFyOgAGQQAtAKDgAUUNBkEAQQA6AKDgAQJAQQAoApzgASIDRQ0AIAMhAwNAIAMiAygCCEEhIAUgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtAKDgAUUNAUHdyQBBuDpB6QBBkg8Q+AQACyAALwEOIgNBgOADcUGAIEcNAQJAAkAgBUEAIAUtAAQiCWtBDGxqQWBqKAIAIgRFDQAgA0H/H3EhAiAEIQMDQAJAIAIgAyIDLwEERw0AIAMtAAZBP3EgCUcNACADIQMMAwsgAygCACIEIQMgBA0ACwtBACEDCyADIgJFDQECQAJAIAItAAciAyAIRw0AIAMhBCACQQxqIQkgAEEQaiEKAkACQCADQQVPDQAgCSEJDAELIAkoAgAhCQsgCiAJIAQQrwUNAEEBIQQMAQtBACEECyAEIQQCQCAIQQVJDQAgAyAIRg0AAkAgA0EFSQ0AIAIoAgwQIgsgAiAALQAMECE2AgwLIAIgAC0ADCIDOgAHIAJBDGohCQJAAkAgA0EFTw0AIAkhCQwBCyAJKAIAIQkLIAkgAEEQaiADEJUFGiAEDQFBAC0AoOABRQ0GQQBBADoAoOABIAUtAAQhAyACLwEEIQQgASACLQAHNgIMIAEgBDYCCCABIAM2AgQgASAFQQAgA2tBDGxqQXBqNgIAQYg/IAEQPAJAQQAoApzgASIDRQ0AIAMhAwNAIAMiAygCCEEgIAUgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtAKDgAQ0HC0EAQQE6AKDgAQsgByEEIAUhAgsgBiEDCyADIQYgBCEFQQAtAKDgASEDAkAgAiICRQ0AIANBAXFFDQVBAEEAOgCg4AEgBSACIAAQlQQCQEEAKAKc4AEiA0UNACADIQMDQCADIgMoAgggBSACIAAgAygCBBEGACADKAIAIgQhAyAEDQALC0EALQCg4AFFDQFB3ckAQbg6QekAQZIPEPgEAAsgA0EBcUUNBUEAQQA6AKDgAQJAQQAoApzgASIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtAKDgAQ0GC0EAQQA6AKDgASABQRBqJAAPC0H/xwBBuDpB4wBBkg8Q+AQAC0H/xwBBuDpB4wBBkg8Q+AQAC0HdyQBBuDpB6QBBkg8Q+AQAC0H/xwBBuDpB4wBBkg8Q+AQAC0H/xwBBuDpB4wBBkg8Q+AQAC0HdyQBBuDpB6QBBkg8Q+AQAC5EEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQISIEIAM6ABAgBCAAKQIEIgk3AwhBACgCnNYBIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQ/QQgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKAKk4AEiA0UNACAEQQhqIgIpAwAQ6wRRDQAgAiADQQhqQQgQrwVBAEgNAEGk4AEhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEOsEUQ0AIAMhBSACIAhBCGpBCBCvBUF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoAqTgATYCAEEAIAQ2AqTgAQsCQAJAQQAtAKDgAUUNACABIAY2AgBBAEEAOgCg4AFBhBggARA8AkBBACgCnOABIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBgAgAygCACICIQMgAg0ACwtBAC0AoOABDQFBAEEBOgCg4AEgAUEQaiQAIAQPC0H/xwBBuDpB4wBBkg8Q+AQAC0HdyQBBuDpB6QBBkg8Q+AQACwIAC5kCAQV/IwBBIGsiAiQAAkACQCABLwEOIgNBgH9qIgRBBEsNAEEBIAR0QRNxRQ0AIAJBAXIgAUEQaiIFIAEtAAwiBEEPIARBD0kbIgYQlQUhACACQTo6AAAgBiACckEBakEAOgAAIAAQxAUiBkEOSg0BAkACQAJAIANBgH9qDgUAAgQEAQQLIAZBAWohBCACIAQgBCACQQBBABCyBCIDQQAgA0EAShsiA2oiBRAhIAAgBhCVBSIAaiADELIEGiABLQANIAEvAQ4gACAFEI0FGiAAECIMAwsgAkEAQQAQtAQaDAILIAIgBSAGakEBaiAGQX9zIARqIgFBACABQQBKGxC0BBoMAQsgACABQcD0ABDVBBoLIAJBIGokAAsKAEHI9AAQ2wQaCwIAC6cBAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkAgAS8BDiIDQYBdag4HAQMFBQMCBAALAkACQAJAIANB/35qDgIBAgALIAMNBhDfBAwHC0H8ABAeDAYLEDUACyABEOQEENIEGgwECyABEOYEENIEGgwDCyABEOUEENEEGgwCCyACEDY3AwhBACABLwEOIAJBCGpBCBCNBRoMAQsgARDTBBoLIAJBEGokAAsKAEHY9AAQ2wQaCycBAX8QpwRBAEEANgKs4AECQCAAEKgEIgENAEEAIAA2AqzgAQsgAQuVAQECfyMAQSBrIgAkAAJAAkBBAC0A0OABDQBBAEEBOgDQ4AEQIw0BAkBBgNcAEKgEIgENAEEAQYDXADYCsOABIABBgNcALwEMNgIAIABBgNcAKAIINgIEQfITIAAQPAwBCyAAIAE2AhQgAEGA1wA2AhBBgDQgAEEQahA8CyAAQSBqJAAPC0HX1QBBhDtBHUGnEBD4BAALqwUBCn8CQCAADQBB0A8PC0HRDyEBAkAgAEEDcQ0AQdIPIQEgACgCAEHEhpm6BEcNAEHTDyEBIAAoAgRBirbS1XxHDQBB1A8hASAAKAIIIgJB//8HSw0AQd4PIQEgAC8BDCIDQRhsQfAAaiIEIAJLDQBB3w8hASAAQdgAaiIFIANBGGxqIgYvARBB//8DRw0AQeAPIQEgBi8BEkH//wNHDQBBACEGQQAhAQNAIAghByAGIQgCQAJAIAAgASIBQQF0akEYai8BACIGIANNDQBBACEGQeEPIQkMAQsCQCABIAUgBkEYbGoiCi8BEEELdk0NAEEAIQZB4g8hCQwBCwJAIAZFDQBBACEGQeMPIQkgASAKQXhqLwEAQQt2TQ0BC0EBIQYgByEJCyAJIQcgCCEJAkAgBkUNACABQR5LIgkhBiAHIQggAUEBaiIKIQEgCSEJIApBIEcNAQsLAkAgCUEBcQ0AIAcPCwJAIAMNAEEADwsgByEJQQAhBgNAIAkhCAJAAkAgBSAGIgZBGGxqIgEQxAUiCUEPTQ0AQQAhAUHWDyEJDAELIAEgCRDqBCEJAkAgAS8BECIHIAkgCUEQdnNB//8DcUYNAEEAIQFB1w8hCQwBCwJAIAZFDQAgAUF4ai8BACAHTQ0AQQAhAUHYDyEJDAELAkACQCABLwESIgdBAnENAEEAIQFB2Q8hCSAHQQRJDQEMAgsCQCABKAIUIgEgBE8NAEEAIQFB2g8hCQwCCwJAIAEgAkkNAEEAIQFB2w8hCQwCCwJAIAEgB0ECdmoiByACSQ0AQQAhAUHcDyEJDAILQQAhAUHdDyEJIAAgB2otAAANAQtBASEBIAghCQsgCSEJAkAgAUUNACAJIQkgBkEBaiIIIQZBACEBIAggA0YNAgwBCwsgCSEBCyABC+sCAQd/EKcEAkACQCAARQ0AQQAoAqzgASIBRQ0AIAAQxAUiAkEPSw0AIAEgACACEOoEIgNBEHYgA3MiA0EKdkE+cWpBGGovAQAiBCABLwEMIgVPDQAgAUHYAGohBiADQf//A3EhASAEIQMDQCAGIAMiB0EYbGoiBC8BECIDIAFLDQECQCADIAFHDQAgBCEDIAQgACACEK8FRQ0DCyAHQQFqIgQhAyAEIAVHDQALC0EAIQMLIAMiAyEBAkAgAw0AAkAgAEUNAEEAKAKw4AEiAUUNACAAEMQFIgJBD0sNACABIAAgAhDqBCIDQRB2IANzIgNBCnZBPnFqQRhqLwEAIgRBgNcALwEMIgVPDQAgAUHYAGohBiADQf//A3EhAyAEIQEDQCAGIAEiB0EYbGoiBC8BECIBIANLDQECQCABIANHDQAgBCEBIAQgACACEK8FRQ0DCyAHQQFqIgQhASAEIAVHDQALC0EAIQELIAELUQECfwJAAkAgABCpBCIADQBB/wEhAgwBCyAALwESQQNxIQILIAEhAwJAAkACQCACDgIAAQILIAEgACgCFCIAIABBAEgbDwsgACgCFCEDCyADC1EBAn8CQAJAIAAQqQQiAA0AQf8BIQIMAQsgAC8BEkEDcSECCyABIQMCQAJAAkAgAg4CAQACCyABIAAoAhQiACAAQQBIGw8LIAAoAhQhAwsgAwvEAwEIfxCnBEEAKAKw4AEhAgJAAkAgAEUNACACRQ0AIAAQxAUiA0EPSw0AIAIgACADEOoEIgRBEHYgBHMiBEEKdkE+cWpBGGovAQAiBUGA1wAvAQwiBk8NACACQdgAaiEHIARB//8DcSEEIAUhBQNAIAcgBSIIQRhsaiIJLwEQIgUgBEsNAQJAIAUgBEcNACAJIQUgCSAAIAMQrwVFDQMLIAhBAWoiCSEFIAkgBkcNAAsLQQAhBQsgAiEEIAUiCSEFAkAgCQ0AQQAoAqzgASEEAkAgAEUNACAERQ0AIAAQxAUiA0EPSw0AIAQgACADEOoEIgVBEHYgBXMiBUEKdkE+cWpBGGovAQAiCSAELwEMIgZPDQAgBEHYAGohByAFQf//A3EhBSAJIQkDQCAHIAkiCEEYbGoiAi8BECIJIAVLDQECQCAJIAVHDQAgAiAAIAMQrwUNACAEIQQgAiEFDAMLIAhBAWoiCCEJIAggBkcNAAsLIAQhBEEAIQULIAQhBAJAIAUiAEUNACAALQASQQJxRQ0AAkAgAUUNACABIAAvARJBAnY2AgALIAQgACgCFGoPCwJAIAENAEEADwsgAUEANgIAQQALtAEBAn9BACEDAkACQCAARQ0AQQAhAyAAEMQFIgRBDksNAQJAIABBwOABRg0AQcDgASAAIAQQlQUaCyAEIQMLIAMhAAJAIAFB5ABNDQBBAA8LIABBwOABaiABQYABczoAACAAQQFqIQACQAJAIAINACAAIQAMAQtBACEDIAIQxAUiASAAaiIEQQ9LDQEgAEHA4AFqIAIgARCVBRogBCEACyAAQcDgAWpBADoAAEHA4AEhAwsgAwujAgEDfyMAQbACayICJAAgAkGrAiAAIAEQ+gQaAkACQCACEMQFIgENACABIQAMAQsgASEAA0AgACIBIQACQCACIAFBf2oiAWotAABBdmoOBAACAgACCyABIQAgAQ0AC0EAIQALIAIgACIBakEKOgAAECQgAUEBaiEDIAIhBAJAAkBBgAhBACgC1OABayIAIAFBAmpJDQAgAyEDIAQhAAwBC0HU4AFBACgC1OABakEEaiACIAAQlQUaQQBBADYC1OABQQEgAyAAayIBIAFBgXhqQf93SRshAyACIABqIQALQdTgAUEEaiIBQQAoAtTgAWogACADIgAQlQUaQQBBACgC1OABIABqNgLU4AEgAUEAKALU4AFqQQA6AAAQJSACQbACaiQACzkBAn8QJAJAAkBBACgC1OABQQFqIgBB/wdLDQAgACEBQdTgASAAakEEai0AAA0BC0EAIQELECUgAQt2AQN/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBgAhBACgC1OABIgQgBCACKAIAIgVJGyIEIAVGDQAgAEHU4AEgBWpBBGogBCAFayIFIAEgBSABSRsiBRCVBRogAiACKAIAIAVqNgIAIAUhAwsQJSADC/gBAQd/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBACgC1OABIgQgAigCACIFRg0AIAAgAWpBf2ohBiAAIQEgBSEDAkADQCADIQMCQCABIgEgBkkNACABIQUgAyEHDAILIAEhBSADQQFqIgghB0EDIQkCQAJAQdTgASADakEEai0AACIDDgsBAAAAAAAAAAAAAQALIAEgAzoAACABQQFqIQVBACAIIAhBgAhGGyIDIQdBA0EAIAMgBEYbIQkLIAUiBSEBIAciByEDIAUhBSAHIQcgCUUNAAsLIAIgBzYCACAFIgNBADoAACADIABrIQMLECUgAwvVAQEEfyMAQRBrIgMkAAJAAkACQCAARQ0AIAAQxAVBD0sNACAALQAAQSpHDQELIAMgADYCAEGH1gAgAxA8QX8hAAwBCxCzBAJAAkBBACgC4OgBIgRBACgC5OgBQRBqIgVJDQAgBCEEA0ACQCAEIgQgABDDBQ0AIAQhAAwDCyAEQWhqIgYhBCAGIAVPDQALC0EAIQALAkAgACIADQBBfiEADAELAkAgACgCFCACSw0AIAFBACgC2OgBIAAoAhBqIAIQlQUaCyAAKAIUIQALIANBEGokACAAC/sCAQR/IwBBIGsiACQAAkACQEEAKALk6AENAEEAEBgiATYC2OgBIAFBgCBqIQICQAJAIAEoAgBBxqbRkgVHDQAgASEDIAEoAgRBiozV+QVGDQELQQAhAwsgAyEDAkACQCACKAIAQcam0ZIFRw0AIAIhAiABKAKEIEGKjNX5BUYNAQtBACECCyACIQECQAJAAkAgA0UNACABRQ0AIAMgASADKAIIIAEoAghLGyEBDAELIAMgAXJFDQEgAyABIAMbIQELQQAgATYC5OgBCwJAQQAoAuToAUUNABC2BAsCQEEAKALk6AENAEGeC0EAEDxBAEEAKALY6AEiATYC5OgBIAEQGiAAQgE3AxggAELGptGSpcHRmt8ANwMQQQAoAuToASAAQRBqQRAQGRAbELYEQQAoAuToAUUNAgsgAEEAKALc6AFBACgC4OgBa0FQaiIBQQAgAUEAShs2AgBB7SwgABA8CyAAQSBqJAAPC0HwwwBBqzhBxQFBjBAQ+AQAC7AEAQV/IwBBwABrIgMkAAJAAkACQAJAIABFDQAgABDEBUEPSw0AIAAtAABBKkcNAQsgAyAANgIAQYfWACADEDxBfyEEDAELAkAgAkG5HkkNACADIAI2AhBBuAwgA0EQahA8QX4hBAwBCxCzBAJAAkBBACgC4OgBIgVBACgC5OgBQRBqIgZJDQAgBSEEA0ACQCAEIgQgABDDBQ0AIAQhBAwDCyAEQWhqIgchBCAHIAZPDQALC0EAIQQLAkAgBCIHRQ0AIAcoAhQgAkcNAEEAIQRBACgC2OgBIAcoAhBqIAEgAhCvBUUNAQsCQEEAKALc6AEgBWtBUGoiBEEAIARBAEobIAJBB2pBeHFBCCACGyIEQRhqIgdPDQAQtQRBACgC3OgBQQAoAuDoAWtBUGoiBkEAIAZBAEobIAdPDQAgAyACNgIgQfwLIANBIGoQPEF9IQQMAQtBAEEAKALc6AEgBGsiBzYC3OgBAkACQCABQQAgAhsiBEEDcUUNACAEIAIQgQUhBEEAKALc6AEgBCACEBkgBBAiDAELIAcgBCACEBkLIANBMGpCADcDACADQgA3AyggAyACNgI8IANBACgC3OgBQQAoAtjoAWs2AjggA0EoaiAAIAAQxAUQlQUaQQBBACgC4OgBQRhqIgA2AuDoASAAIANBKGpBGBAZEBtBACgC4OgBQRhqQQAoAtzoAUsNAUEAIQQLIANBwABqJAAgBA8LQe4NQas4QakCQZQhEPgEAAusBAINfwF+IwBBIGsiACQAQdM2QQAQPEEAKALY6AEiASABQQAoAuToAUZBDHRqIgIQGgJAQQAoAuToAUEQaiIDQQAoAuDoASIBSw0AIAEhASADIQMgAkGAIGohBCACQRBqIQUDQCAFIQYgBCEHIAEhBCAAQQhqQRBqIgggAyIJQRBqIgopAgA3AwAgAEEIakEIaiILIAlBCGoiDCkCADcDACAAIAkpAgA3AwggCSEDAkACQANAIANBGGoiASAESyIFDQEgASEDIAEgAEEIahDDBQ0ACyAFDQAgBiEFIAchBAwBCyAIIAopAgA3AwAgCyAMKQIANwMAIAAgCSkCACINNwMIAkACQCANp0H/AXFBKkcNACAHIQEMAQsgByAAKAIcIgFBB2pBeHFBCCABG2siA0EAKALY6AEgACgCGGogARAZIAAgA0EAKALY6AFrNgIYIAMhAQsgBiAAQQhqQRgQGSAGQRhqIQUgASEEC0EAKALg6AEiBiEBIAlBGGoiCSEDIAQhBCAFIQUgCSAGTQ0ACwtBACgC5OgBKAIIIQFBACACNgLk6AEgAEEANgIUIAAgAUEBaiIBNgIQIABCxqbRkqXB0ZrfADcDCCACIABBCGpBEBAZEBsQtgQCQEEAKALk6AENAEHwwwBBqzhB5gFBoDYQ+AQACyAAIAE2AgQgAEEAKALc6AFBACgC4OgBa0FQaiIBQQAgAUEAShs2AgBB5SEgABA8IABBIGokAAuBBAEIfyMAQSBrIgAkAEEAKALk6AEiAUEAKALY6AEiAmtBgCBqIQMgAUEQaiIEIQECQAJAAkADQCADIQMgASIFKAIQIgFBf0YNASABIAMgASADSRsiBiEDIAVBGGoiBSEBIAUgAiAGak0NAAtB3A8hAwwBC0EAIAIgA2oiAjYC3OgBQQAgBUFoaiIGNgLg6AEgBSEBAkADQCABIgMgAk8NASADQQFqIQEgAy0AAEH/AUYNAAtBgychAwwBC0EAQQA2AujoASAEIAZLDQEgBCEDAkADQAJAIAMiBy0AAEEqRw0AIABBCGpBEGogB0EQaikCADcDACAAQQhqQQhqIAdBCGopAgA3AwAgACAHKQIANwMIIAchAQJAA0AgAUEYaiIDIAZLIgUNASADIQEgAyAAQQhqEMMFDQALIAVFDQELIAcoAhQiA0H/H2pBDHZBASADGyICRQ0AIAcoAhBBDHZBfmohBEEAIQMDQCAEIAMiAWoiA0EeTw0DAkBBACgC6OgBQQEgA3QiBXENACADQQN2Qfz///8BcUHo6AFqIgMgAygCACAFczYCAAsgAUEBaiIBIQMgASACRw0ACwsgB0EYaiIBIQMgASAGTQ0ADAMLAAtBv8IAQas4Qc8AQdYwEPgEAAsgACADNgIAQdYXIAAQPEEAQQA2AuToAQsgAEEgaiQAC8oBAQR/IwBBEGsiAiQAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQxAVBEEkNAQsgAiAANgIAQejVACACEDxBACEADAELELMEQQAhAwJAQQAoAuDoASIEQQAoAuToAUEQaiIFSQ0AIAQhAwNAAkAgAyIDIAAQwwUNACADIQMMAgsgA0FoaiIEIQMgBCAFTw0AC0EAIQMLQQAhACADIgNFDQACQCABRQ0AIAEgAygCFDYCAAtBACgC2OgBIAMoAhBqIQALIAJBEGokACAAC9YJAQx/IwBBMGsiAiQAAkACQAJAAkACQAJAAkACQAJAAkAgAEUNACAALQAAQSpHDQAgABDEBUEQSQ0BCyACIAA2AgBB6NUAIAIQPEEAIQMMAQsQswQCQAJAQQAoAuDoASIEQQAoAuToAUEQaiIFSQ0AIAQhAwNAAkAgAyIDIAAQwwUNACADIQMMAwsgA0FoaiIGIQMgBiAFTw0ACwtBACEDCwJAIAMiB0UNACAHLQAAQSpHDQIgBygCFCIDQf8fakEMdkEBIAMbIghFDQAgBygCEEEMdkF+aiEJQQAhAwNAIAkgAyIGaiIDQR5PDQQCQEEAKALo6AFBASADdCIFcUUNACADQQN2Qfz///8BcUHo6AFqIgMgAygCACAFczYCAAsgBkEBaiIGIQMgBiAIRw0ACwsgAkEgakIANwMAIAJCADcDGCABQf8fakEMdkEBIAEbIgpBf2ohC0EeIAprIQxBACgC6OgBIQhBACEGAkADQCADIQ0CQCAGIgUgDEkNAEEAIQkMAgsCQAJAIAoNACANIQMgBSEGQQEhBQwBCyAFQR1LDQZBAEEeIAVrIgMgA0EeSxshCUEAIQMDQAJAIAggAyIDIAVqIgZ2QQFxRQ0AIA0hAyAGQQFqIQZBASEFDAILAkAgAyALRg0AIANBAWoiBiEDIAYgCUYNCAwBCwsgBUEMdEGAwABqIQMgBSEGQQAhBQsgAyIJIQMgBiEGIAkhCSAFDQALCyACIAE2AiwgAiAJIgM2AigCQAJAIAMNACACIAE2AhBB4AsgAkEQahA8AkAgBw0AQQAhAwwCCyAHLQAAQSpHDQYCQCAHKAIUIgNB/x9qQQx2QQEgAxsiCA0AQQAhAwwCCyAHKAIQQQx2QX5qIQlBACEDA0AgCSADIgZqIgNBHk8NCAJAQQAoAujoAUEBIAN0IgVxDQAgA0EDdkH8////AXFB6OgBaiIDIAMoAgAgBXM2AgALIAZBAWoiBiEDIAYgCEcNAAtBACEDDAELIAJBGGogACAAEMQFEJUFGgJAQQAoAtzoASAEa0FQaiIDQQAgA0EAShtBF0sNABC1BEEAKALc6AFBACgC4OgBa0FQaiIDQQAgA0EAShtBF0sNAEH5GkEAEDxBACEDDAELQQBBACgC4OgBQRhqNgLg6AECQCAKRQ0AQQAoAtjoASACKAIoaiEFQQAhAwNAIAUgAyIDQQx0ahAaIANBAWoiBiEDIAYgCkcNAAsLQQAoAuDoASACQRhqQRgQGRAbIAItABhBKkcNByACKAIoIQsCQCACKAIsIgNB/x9qQQx2QQEgAxsiCEUNACALQQx2QX5qIQlBACEDA0AgCSADIgZqIgNBHk8NCgJAQQAoAujoAUEBIAN0IgVxDQAgA0EDdkH8////AXFB6OgBaiIDIAMoAgAgBXM2AgALIAZBAWoiBiEDIAYgCEcNAAsLQQAoAtjoASALaiEDCyADIQMLIAJBMGokACADDwtB4NIAQas4QeUAQYAsEPgEAAtBv8IAQas4Qc8AQdYwEPgEAAtBv8IAQas4Qc8AQdYwEPgEAAtB4NIAQas4QeUAQYAsEPgEAAtBv8IAQas4Qc8AQdYwEPgEAAtB4NIAQas4QeUAQYAsEPgEAAtBv8IAQas4Qc8AQdYwEPgEAAsMACAAIAEgAhAZQQALBgAQG0EAC5YCAQN/AkAQIw0AAkACQAJAQQAoAuzoASIDIABHDQBB7OgBIQMMAQsgAyEDA0AgAyIERQ0CIAQoAggiBSEDIAUgAEcNAAsgBEEIaiEDCyADIAAoAgg2AgALIAAgAjYCBCAAIAE2AgAgAEEAOwEMA0AQ7AQiAUH/A3EiAkUNAEEAKALs6AEiA0UhBQJAAkAgAw0AIAUhBQwBCyADIQQgBSEFIAIgAy8BDEEHdkYNAANAIAQoAggiA0UhBQJAIAMNACAFIQUMAgsgAyEEIAUhBSACIAMvAQxBB3ZHDQALCyAFRQ0ACyAAIAFBB3Q7AQwgAEEAKALs6AE2AghBACAANgLs6AEgAUH/A3EPC0HPPEEnQdchEPMEAAuIAgEEfwJAIAAtAA1BPkcNACAALQADQQFxRQ0AIAApAgQQ6wRSDQBBACgC7OgBIgFFDQAgAC8BDiECIAEhAQNAAkAgASIBLwEMIgMgAnMiBEH//wNxQf8ASw0AIARBH3ENAiABIANBAWpBH3EgA0Hg/wNxcjsBDCABIAAgAUEEaiABIAJBwABxGygCABECACACQSBxRQ0CIAFBACABKAIEEQIAAkACQAJAQQAoAuzoASIAIAFHDQBB7OgBIQAMAQsgACEAA0AgACIERQ0CIAQoAggiAiEAIAIgAUcNAAsgBEEIaiEACyAAIAEoAgg2AgALIAFBADsBDA8LIAEoAggiBCEBIAQNAAsLC1kBA38CQAJAAkBBACgC7OgBIgEgAEcNAEHs6AEhAQwBCyABIQEDQCABIgJFDQIgAigCCCIDIQEgAyAARw0ACyACQQhqIQELIAEgACgCCDYCAAsgAEEAOwEMCzcBAX8CQCAAQQ5xQQhHDQBBAA8LQQAhAQJAIABBDHFBDEYNACAAQQR2QQggAEEDcXRNIQELIAELkwQCAX8BfiABQQ9xIQMCQAJAIAFBEE8NACACIQIMAQsgAUEQdEGAgMD/A2pBgIDA/wdxrUIghr8gAqIhAgsgAiECAkACQAJAAkACQAJAIANBfmoOCgABBQUFAgUFAwQFC0EAIQECQCACRAAAAAAAAAAAYw0AQX8hASACRAAA4P///+9BZA0AAkACQCACRAAAAAAAAOA/oCICRAAAAAAAAPBBYyACRAAAAAAAAAAAZnFFDQAgAqshAQwBC0EAIQELIAEhAQsgACABNgAADwtCACEEAkAgAkQAAAAAAAAAAGMNACACRAAAAAAAAPBDZA0AAkACQCACRAAAAAAAAOA/oCICRAAAAAAAAPBDYyACRAAAAAAAAAAAZnFFDQAgArEhBAwBC0IAIQQLIAQhBAsgACAENwAADwsCQEQAAAAAAADgQyACRAAAAAAAAOA/oCACRAAAAAAAAOBDZCACRAAAAAAAAOBDY3IbIgKZRAAAAAAAAOBDY0UNACAAIAKwNwAADwsgAEKAgICAgICAgIB/NwAADwsgACACtjgAAA8LIAAgAjkAAA8LQYCAgIB4IQECQCACRAAAAAAAAODBYw0AQf////8HIQEgAkQAAMD////fQWQNAAJAAkAgAkQAAAAAAADgP6AiAplEAAAAAAAA4EFjRQ0AIAKqIQEMAQtBgICAgHghAQsgASEBCyAAIAMgARDABAv4AQACQCABQQhJDQAgACABIAK3EL8EDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4ICAABAgMEBQYHCyAAIAJB//8DIAJB//8DSBsiAUEAIAFBAEobOwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBrjdBrgFBxMcAEPMEAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALuwMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDBBLchAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0GuN0HKAUHYxwAQ8wQAC0GAgICAeCEBCyABC6ABAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQwQS3IQMLIAMhAwJAIAFBEE8NACADDwsgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iC+MBAgN/AX4CQCABLQAMQQxPDQBBfg8LQX4hAgJAAkAgASkCECIFUA0AIAEvARghAxAjDQECQCAALQAGRQ0AAkACQAJAQQAoAvDoASIBIABHDQBB8OgBIQEMAQsgASECA0AgAiIBRQ0CIAEoAgAiBCECIAEhASAEIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCXBRoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAFNwIAIAAgA0EHdDsBBCAAQQAoAvDoATYCAEEAIAA2AvDoAUEAIQILIAIPC0G0PEErQckhEPMEAAvjAQIDfwF+AkAgAS0ADEECTw0AQX4PC0F+IQICQAJAIAEpAgQiBVANACABLwEQIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKALw6AEiASAARw0AQfDoASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQlwUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKALw6AE2AgBBACAANgLw6AFBACECCyACDwtBtDxBK0HJIRDzBAAL1QIBBH8CQAJAAkAgAC0ADUE/Rw0AIAAtAANBAXENABAjDQFBACgC8OgBIgFFDQAgASEBA0ACQCABIgEtAAdFDQAgAC8BDiABLwEMRw0AIAFBEGopAgAgACkCBFINACABQQA6AAcgAUEMaiICEPEEAkACQCABLQAGQYB/ag4DAQIAAgtBACgC8OgBIgIhAwJAAkACQCACIAFHDQBB8OgBIQIMAQsDQCADIgJFDQIgAigCACIEIQMgAiECIAQgAUcNAAsLIAIgASgCADYCAAsgAUEAQYgCEJcFGgwBCyABQQE6AAYCQCABQQBBAEHgABDGBA0AIAFBggE6AAYgAS0ABw0FIAIQ7gQgAUEBOgAHIAFBACgCnNYBNgIIDAELIAFBgAE6AAYLIAEoAgAiAiEBIAINAAsLDwtBtDxByQBBvREQ8wQAC0GHyQBBtDxB8QBBtyQQ+AQAC+kBAQJ/QQAhBEF/IQUCQAJAAkAgAC0ABkF/ag4IAQAAAAAAAAIAC0EAIQRBfiEFDAELQQAhBEEBIQUgAC0ABw0AAkAgAiAAQQ5qLQAAakEEakHtAU8NAEEBIQRBACEFDAELIABBDGoQ7gQgAEEBOgAHIABBACgCnNYBNgIIQQAhBEEBIQULIAUhBQJAAkAgBEUNACAAQQxqQT4gAC8BBCADciACEPIEIgRFDQEgBCABIAIQlQUaIAAgAC8BBCIEQQFqQR9xIARB4P8DcXI7AQRBACEFCyAFDwtBgcQAQbQ8QYwBQYkJEPgEAAvZAQEDfwJAECMNAAJAQQAoAvDoASIARQ0AIAAhAANAAkAgACIALQAHIgFFDQBBACgCnNYBIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqEIsFIQFBACgCnNYBIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgEhACABDQALCw8LQbQ8QdoAQaUTEPMEAAtrAQF/QX8hAgJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQX4PC0EBIQIgAC0ABw0AQQAhAiABIABBDmotAABqQQRqQe0BSQ0AIABBDGoQ7gQgAEEBOgAHIABBACgCnNYBNgIIQQEhAgsgAgsNACAAIAEgAkEAEMYEC4wCAQN/IAAtAAYiASECAkACQAJAAkACQAJAAkAgAQ4JBQIDAwMDAwMBAAsgAUGAf2oOAwECAwILAkACQAJAQQAoAvDoASIBIABHDQBB8OgBIQEMAQsgASECA0AgAiIBRQ0CIAEoAgAiAyECIAEhASADIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCXBRpBAA8LIABBAToABgJAIABBAEEAQeAAEMYEIgENACAAQYIBOgAGIAAtAAcNBCAAQQxqEO4EIABBAToAByAAQQAoApzWATYCCEEBDwsgAEGAAToABiABDwtBtDxBvAFB5SkQ8wQAC0EBIQILIAIPC0GHyQBBtDxB8QBBtyQQ+AQAC5sCAQV/AkACQAJAAkAgAS0AAkUNABAkIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCEGIAQgAC8BBE0NAiACIAVJDQFBACEEQX8hAwwDCyAEIQYgBCAFSQ0BQQAhBEF+IQMMAgsgACADOwEGIAIhBgsgACAGOwECQQEhBEEAIQMLIAMhAwJAIARFDQAgACAALwECaiACa0EIaiABIAIQlQUaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECUgAw8LQZk8QR1BnSQQ8wQAC0HgJ0GZPEE2QZ0kEPgEAAtB9CdBmTxBN0GdJBD4BAALQYcoQZk8QThBnSQQ+AQACzEBAn9BACEBAkAgAC8BACICIAAvAQJGDQAgACACQQAgAiAALwEGSRtqQQhqIQELIAELpAEBA38QJEEAIQECQCAALwEAIgIgAC8BAkYNACAAIAJBACACIAAvAQZJG2pBCGohAQsCQAJAIAEiAUUNACABLQACQQ9qQfwDcSEBAkAgAiAALwEGIgNJDQAgAiADRw0CIAAgATsBACAAIAAvAQQ7AQYQJQ8LIAAgAiABajsBABAlDwtB5MMAQZk8Qc4AQb4QEPgEAAtBvCdBmTxB0QBBvhAQ+AQACyIBAX8gAEEIahAhIgEgADsBBCABIAA7AQYgAUEANgEAIAELMwEBfyMAQRBrIgIkACACIAE6AA8gAC0ADSAALwEOIAJBD2pBARCNBSEAIAJBEGokACAACzMBAX8jAEEQayICJAAgAiABOwEOIAAtAA0gAC8BDiACQQ5qQQIQjQUhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATYCDCAALQANIAAvAQ4gAkEMakEEEI0FIQAgAkEQaiQAIAALPAACQAJAIAFFDQAgAS0AAA0BCyAALQANIAAvAQ5B5NYAQQAQjQUPCyAALQANIAAvAQ4gASABEMQFEI0FC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBCNBSECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABDuBCAAEIsFCxoAAkAgACABIAIQ1gQiAg0AIAEQ0wQaCyACC4AHARB/IwBBEGsiAyQAAkACQCABLwEOIgRBDHYiBUF/akEBTQ0AQQAhBAwBCwJAIAVBAkcNACABLQAMDQBBACEEDAELAkAgBEH/H3EiBkH/HU0NAEEAIQQMAQsCQCAFQQJHDQAgBEGAHnFBgAJHDQBBACEEDAELQQAhBCACLwEAIgdB8R9GDQBBACAGayEIIAFBEGoiCSEKIAchB0EAIgQhC0EAIQwgBCENA0AgDSENIAwhDiALIQsgECEPAkACQCAHQf//A3EiDEEMdiIEQQlGDQAgDSEHIARB8PQAai0AACEQDAELIA1BAWoiECEHIAIgEEEBdGovAQAhEAsgByERAkACQAJAAkAgECIHRQ0AAkACQCAEQXZqQX1NDQAgDiENIAshEAwBC0EAIQ0gCyAOQf8BcUEAR2pBAyAHQX9qIAdBA0sbIhBqIBBBf3NxIRALIBAhECANIQsCQCAMQf8fcSAGRyISDQAgACAQaiEPAkAgBUEBRw0AAkACQCAEQQhHDQAgAyAPLQAAIAtB/wFxdkEBcToADyABLQANIAEvAQ4gA0EPakEBEI0FGgwBCyAPIQ0gByEOAkAgDEGAwAJJDQADQCANIQQgDiIMRQ0HIARBAWohDSAMQX9qIQ4gBC0AAEUNAAsgDEUNBgsgAS0ADSABLwEOIA8gBxCNBRoLIAshCyAQIQcgCCEEDAULAkAgBEEIRw0AQQEgC0H/AXF0IQQgDy0AACEHAkAgAS0AEEUNACAPIAcgBHI6AAAMBAsgDyAHIARBf3NxOgAADAMLAkAgByABLQAMIgRLDQAgDyAKIAcQlQUaDAMLIA8gCSAEEJUFIQ0CQAJAIAxB/58BTQ0AQQAhBAwBC0EAIQQgDEGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQQLIA0gAS0ADCIMaiAEIAcgDGsQlwUaDAILAkACQCAEQQhHDQBBACALQQFqIgQgBEH/AXFBCEYiBBshCyAQIARqIQcMAQsgCyELIBAgB2ohBwsgDyEEDAMLQY04QdsAQeIZEPMEAAsgCyELIBAhByAGIQQMAQsgCyELIBAhB0EAIQQLIAQhBCAHIQ0gCyEMAkAgEkUNACACIBFBAWoiDkEBdGovAQAiEiEHIAQhECANIQsgDCEMIA4hDUEAIQQgEkHxH0YNAgwBCwsgBCEECyADQRBqJAAgBAv+AgEEfyAAENgEIAAQxQQgABC8BCAAEJ4EAkACQCAALQADQQFxDQAgAC0ADQ0BIAAvAQ4NASAALQAMQQRJDQEgAC0AEUEIcUUNAUEAQQAoApzWATYC/OgBQYACEB9BAC0AoMkBEB4PCwJAIAApAgQQ6wRSDQAgABDZBCAALQANIgFBAC0A+OgBTw0BQQAoAvToASABQQJ0aigCACECAkACQAJAIAAvAQ5B+V1qDgMBAgACCyABENoEIgMhAQJAIAMNACACEOgEIQELAkAgASIBDQAgABDTBBoPCyAAIAEQ0gQaDwsgAhDpBCIBQX9GDQAgACABQf8BcRDPBBoPCyACIAAgAigCACgCDBECAA8LIAAtAANBBHFFDQBBAC0A+OgBRQ0AIAAoAgQhBEEAIQEDQAJAQQAoAvToASABIgFBAnRqKAIAIgIoAgAiAygCACAERw0AIAAgAToADSACIAAgAygCDBECAAsgAUEBaiICIQEgAkEALQD46AFJDQALCwsCAAsCAAsEAEEAC2YBAX8CQEEALQD46AFBIEkNAEGNOEGwAUGlLRDzBAALIAAvAQQQISIBIAA2AgAgAUEALQD46AEiADoABEEAQf8BOgD56AFBACAAQQFqOgD46AFBACgC9OgBIABBAnRqIAE2AgAgAQuxAgIFfwF+IwBBgAFrIgAkAEEAQQA6APjoAUEAIAA2AvToAUEAEDanIgE2ApzWAQJAAkACQAJAIAFBACgCiOkBIgJrIgNB//8ASw0AQQApA5DpASEFIANB6AdLDQEgBSEFIAMhAwwCC0EAQQApA5DpASADQegHbiICrXw3A5DpASADIAJB6AdsayEDDAILIAUgASACa0GXeGoiA0HoB24iBEEBaq18IQUgASACIANqayADIARB6Adsa2pBmHhqIQMLQQAgBTcDkOkBIAMhAwtBACABIANrNgKI6QFBAEEAKQOQ6QE+ApjpARClBBA5EOcEQQBBADoA+egBQQBBAC0A+OgBQQJ0ECEiATYC9OgBIAEgAEEALQD46AFBAnQQlQUaQQAQNj4C/OgBIABBgAFqJAALwgECA38BfkEAEDanIgA2ApzWAQJAAkACQAJAIABBACgCiOkBIgFrIgJB//8ASw0AQQApA5DpASEDIAJB6AdLDQEgAyEDIAIhAgwCC0EAQQApA5DpASACQegHbiIBrXw3A5DpASACIAFB6AdsayECDAILIAMgACABa0GXeGoiAkHoB24iAa18QgF8IQMgAiABQegHbGtBAWohAgtBACADNwOQ6QEgAiECC0EAIAAgAms2AojpAUEAQQApA5DpAT4CmOkBCxMAQQBBAC0AgOkBQQFqOgCA6QELxAEBBn8jACIAIQEQICAAQQAtAPjoASICQQJ0QQ9qQfAPcWsiAyQAAkAgAkUNAEEAKAL06AEhBEEAIQADQCADIAAiAEECdCIF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HQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwv5CgELfyMAQcAAayIEJAAgACABaiEFIARBf2ohBiAEQQFyIQcgBEECciEIIABBAEchCSACIQEgAyEKIAIhAiAAIQMDQCADIQMgAiECIAohCyABIgpBAWohAQJAAkAgCi0AACIMQSVGDQAgDEUNACABIQEgCyEKIAIhAkEBIQwgAyEDDAELAkACQCACIAFHDQAgAyEDDAELIAJBf3MgAWohDQJAIAUgA2siDkEBSA0AIAMgAiANIA5Bf2ogDiANShsiDhCVBSAOakEAOgAACyADIA1qIQMLIAMhDQJAIAwNACABIQEgCyEKIAIhAkEAIQwgDSEDDAELAkACQCABLQAAQS1GDQAgASEBQQAhAgwBCyAKQQJqIAEgCi0AAkHzAEYiAhshASACIAlxIQILIAIhAiABIg4sAAAhASAEQQA6AAECQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCALKAIAOgAAIAtBBGohAgwMCyAEIQICQAJAIAsoAgAiAUF/TA0AIAEhASACIQIMAQsgBEEtOgAAQQAgAWshASAHIQILIAtBBGohCyACIgwhAiABIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAwgDBDEBWpBf2oiAyECIAwhASADIAxNDQoDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAsLAAsgBCECIAsoAgAhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgC0EEaiEMIAYgBBDEBWoiAyECIAQhASADIARNDQgDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAkLAAsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAkLIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwICyAEIAtBB2pBeHEiASsDAEEIEPsEIAFBCGohAgwHCyALKAIAIgFB/dEAIAEbIgMQxAUhAQJAIAUgDWsiCkEBSA0AIA0gAyABIApBf2ogCiABShsiChCVBSAKakEAOgAACyALQQRqIQogBEEAOgAAIA0gAWohASACRQ0DIAMQIgwDCyAEIAE6AAAMAQsgBEE/OgAACyALIQIMAwsgCiECIAEhAQwDCyAMIQIMAQsgCyECCyANIQELIAIhAiAEEMQFIQMCQCAFIAEiC2siAUEBSA0AIAsgBCADIAFBf2ogASADShsiARCVBSABakEAOgAACyAOQQFqIgwhASACIQogDCECQQEhDCALIANqIQMLIAEhASAKIQogAiECIAMiCyEDIAwNAAsgBEHAAGokACALIABrQQFqC+0IAwN+CH8BfAJAAkAgAUQAAAAAAAAAAGMNACABIQEgACEADAELIABBLToAACABmiEBIABBAWohAAsgACEAAkAgASIBvUL///////////8AgyIDQoGAgICAgID4/wBUDQAgAEHOwrkCNgAADwsCQCADQoCAgICAgID4/wBSDQAgAEHp3JkDNgAADwsCQCABRLDKbkftiRAAY0UNACAAQTA7AAAPCyACQQQgAkEEShsiAkEPSSEGIAFEje21oPfGsD5jIQcCQAJAIAEQrQUiDplEAAAAAAAA4EFjRQ0AIA6qIQgMAQtBgICAgHghCAsgCCEIIAJBDyAGGyECAkACQCAHDQAgAURQ7+LW5BpLRGQNACAIIQZBASEHIAEhAQwBCwJAIAhBf0oNAEEAIQYgCCEH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DQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQlQUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKALc6wFFDQBBACgC3OsBEJoFIQELAkBBACgC0M0BRQ0AQQAoAtDNARCaBSABciEBCwJAELAFKAIAIgBFDQADQEEAIQICQCAAKAJM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jf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQ5gUgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEOYFIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABDcBUUNACADIAQQzAUhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQ5gUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxDeBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ3AVBAEoNAAJAIAEgCSADIAoQ3AVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ5gUgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEOYFIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABDmBSAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQ5gUgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEOYFIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYh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ACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoApDsAUF/aiIBQX8gARs2ApDsAQsLBwA/AEEQdAtUAQJ/QQAoAtTNASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDYBU0NACAAEBVFDQELQQAgADYC1M0BIAEPCxCSBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ2wVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqENsFQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxDbBSAFQTBqIAogASAHEOUFIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ2wUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ2wUgBSACIARBASAGaxDlBSAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQ4wUOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ5AUaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahDbBUEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqENsFIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEOcFIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEOcFIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEOcFIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEOcFIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEOcFIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEOcFIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEOcFIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEOcFIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEOcFIAVBkAFqIANCD4ZCACAEQgAQ5wUgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABDnBSAFQYABakIBIAJ9QgAgBEIAEOcFIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4Q5wUgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4Q5wUgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxDlBSAFQTBqIBYgEyAGQfAAahDbBSAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxDnBSAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEOcFIAUgAyAOQgVCABDnBSAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ2wUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ2wUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDbBSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDbBSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDbBUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDbBSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhDbBSAFQSBqIAIgBCAGENsFIAVBEGogEiABIAcQ5QUgBSACIAQgBxDlBSAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ2gUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qENsFIAIgACAEQYH4ACADaxDlBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQeDvBSQDQeDvAUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAARDwALJQEBfiAAIAEgAq0gA61CIIaEIAQQ9QUhBSAFQiCIpxDrBSAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwuGzoGAAAMAQYAIC5jBAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AcHJvZ1ZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAcHJvZ05hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6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SUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAArfKAgAAEbmFtZQG9cfgFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkUZGV2c190cmFja19leGNlcHRpb25aD2RldnNkYmdfcHJvY2Vzc1sRZGV2c2RiZ19yZXN0YXJ0ZWRcFWRldnNkYmdfaGFuZGxlX3BhY2tldF0Lc2VuZF92YWx1ZXNeEXZhbHVlX2Zyb21fdGFnX3YwXxlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYA1vYmpfZ2V0X3Byb3BzYQxleHBhbmRfdmFsdWViEmRldnNkYmdfc3VzcGVuZF9jYmMMZGV2c2RiZ19pbml0ZBBleHBhbmRfa2V5X3ZhbHVlZQZrdl9hZGRmD2RldnNtZ3JfcHJvY2Vzc2cHdHJ5X3J1bmgMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUQZGV2c19maWJlcl95aWVsZHYYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EWRldnNfZmliZXJfYnlfdGFnfhBkZXZzX2ZpYmVyX3N0YXJ0fxRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYABDmRldnNfZmliZXJfcnVugQETZGV2c19maWJlcl9zeW5jX25vd4IBCmRldnNfcGFuaWODARVfZGV2c19pbnZhbGlkX3Byb2dyYW2EAQ9kZXZzX2ZpYmVyX3Bva2WFARZkZXZzX2djX29ial9jaGVja19jb3JlhgETamRfZ2NfYW55X3RyeV9hbGxvY4cBB2RldnNfZ2OIAQ9maW5kX2ZyZWVfYmxvY2uJARJkZXZzX2FueV90cnlfYWxsb2OKAQ5kZXZzX3RyeV9hbGxvY4sBC2pkX2djX3VucGlujAEKamRfZ2NfZnJlZY0BFGRldnNfdmFsdWVfaXNfcGlubmVkjgEOZGV2c192YWx1ZV9waW6PARBkZXZzX3ZhbHVlX3VucGlukAESZGV2c19tYXBfdHJ5X2FsbG9jkQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkgEUZGV2c19hcnJheV90cnlfYWxsb2OTARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OUARVkZXZzX3N0cmluZ190cnlfYWxsb2OVARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJYBD2RldnNfZ2Nfc2V0X2N0eJcBDmRldnNfZ2NfY3JlYXRlmAEPZGV2c19nY19kZXN0cm95mQERZGV2c19nY19vYmpfY2hlY2uaAQtzY2FuX2djX29iapsBEXByb3BfQXJyYXlfbGVuZ3RonAESbWV0aDJfQXJyYXlfaW5zZXJ0nQESZnVuMV9BcnJheV9pc0FycmF5ngEQbWV0aFhfQXJyYXlfcHVzaJ8BFW1ldGgxX0FycmF5X3B1c2hSYW5nZaABEW1ldGhYX0FycmF5X3NsaWNloQERZnVuMV9CdWZmZXJfYWxsb2OiARJwcm9wX0J1ZmZlcl9sZW5ndGijARVtZXRoMF9CdWZmZXJfdG9TdHJpbmekARNtZXRoM19CdWZmZXJfZmlsbEF0pQETbWV0aDRfQnVmZmVyX2JsaXRBdKYBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwpwEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljqAEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qQEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0qgEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSrARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnStARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcq4BHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nrwEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlzsAEUbWV0aDFfRXJyb3JfX19jdG9yX1+xARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fsgEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fswEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+0AQ9wcm9wX0Vycm9yX25hbWW1ARFtZXRoMF9FcnJvcl9wcmludLYBD3Byb3BfRHNGaWJlcl9pZLcBFG1ldGgxX0RzRmliZXJfcmVzdW1luAEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGW5ARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kugERZnVuMF9Ec0ZpYmVyX3NlbGa7ARRtZXRoWF9GdW5jdGlvbl9zdGFydLwBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlvQEScHJvcF9GdW5jdGlvbl9uYW1lvgEPZnVuMl9KU09OX3BhcnNlvwETZnVuM19KU09OX3N0cmluZ2lmecABDmZ1bjFfTWF0aF9jZWlswQEPZnVuMV9NYXRoX2Zsb29ywgEPZnVuMV9NYXRoX3JvdW5kwwENZnVuMV9NYXRoX2Fic8QBEGZ1bjBfTWF0aF9yYW5kb23FARNmdW4xX01hdGhfcmFuZG9tSW50xgENZnVuMV9NYXRoX2xvZ8cBDWZ1bjJfTWF0aF9wb3fIAQ5mdW4yX01hdGhfaWRpdskBDmZ1bjJfTWF0aF9pbW9kygEOZnVuMl9NYXRoX2ltdWzLAQ1mdW4yX01hdGhfbWluzAELZnVuMl9taW5tYXjNAQ1mdW4yX01hdGhfbWF4zgESZnVuMl9PYmplY3RfYXNzaWduzwEQZnVuMV9PYmplY3Rfa2V5c9ABE2Z1bjFfa2V5c19vcl92YWx1ZXPRARJmdW4xX09iamVjdF92YWx1ZXPSARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtMBEHByb3BfUGFja2V0X3JvbGXUARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVy1QETcHJvcF9QYWNrZXRfc2hvcnRJZNYBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleNcBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5k2AERcHJvcF9QYWNrZXRfZmxhZ3PZARVwcm9wX1BhY2tldF9pc0NvbW1hbmTaARRwcm9wX1BhY2tldF9pc1JlcG9ydNsBE3Byb3BfUGFja2V0X3BheWxvYWTcARNwcm9wX1BhY2tldF9pc0V2ZW503QEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl3gEUcHJvcF9QYWNrZXRfaXNSZWdTZXTfARRwcm9wX1BhY2tldF9pc1JlZ0dldOABE3Byb3BfUGFja2V0X3JlZ0NvZGXhARRwcm9wX1BhY2tldF9pc0FjdGlvbuIBFWRldnNfcGt0X3NwZWNfYnlfY29kZeMBEmRldnNfZ2V0X3NwZWNfY29kZeQBE21ldGgwX1BhY2tldF9kZWNvZGXlARJkZXZzX3BhY2tldF9kZWNvZGXmARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTnARREc1JlZ2lzdGVyX3JlYWRfY29udOgBEmRldnNfcGFja2V0X2VuY29kZekBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXqARZwcm9wX0RzUGFja2V0SW5mb19yb2xl6wEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZewBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXtARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/uARNwcm9wX0RzUm9sZV9pc0JvdW5k7wEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k8AERbWV0aDBfRHNSb2xlX3dhaXTxARJwcm9wX1N0cmluZ19sZW5ndGjyARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdPMBE21ldGgxX1N0cmluZ19jaGFyQXT0ARJtZXRoMl9TdHJpbmdfc2xpY2X1ARRkZXZzX2pkX2dldF9yZWdpc3RlcvYBFmRldnNfamRfY2xlYXJfcGt0X2tpbmT3ARBkZXZzX2pkX3NlbmRfY21k+AERZGV2c19qZF93YWtlX3JvbGX5ARRkZXZzX2pkX3Jlc2V0X3BhY2tldPoBE2RldnNfamRfcGt0X2NhcHR1cmX7ARNkZXZzX2pkX3NlbmRfbG9nbXNn/AESZGV2c19qZF9zaG91bGRfcnVu/QEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX+ARNkZXZzX2pkX3Byb2Nlc3NfcGt0/wEUZGV2c19qZF9yb2xlX2NoYW5nZWSAAhJkZXZzX2pkX2luaXRfcm9sZXOBAhJkZXZzX2pkX2ZyZWVfcm9sZXOCAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3ODAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc4QCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc4UCEGRldnNfanNvbl9lc2NhcGWGAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWHAg9kZXZzX2pzb25fcGFyc2WIAgpqc29uX3ZhbHVliQIMcGFyc2Vfc3RyaW5nigINc3RyaW5naWZ5X29iaosCCmFkZF9pbmRlbnSMAg9zdHJpbmdpZnlfZmllbGSNAhNkZXZzX2pzb25fc3RyaW5naWZ5jgIRcGFyc2Vfc3RyaW5nX2NvcmWPAhFkZXZzX21hcGxpa2VfaXRlcpACF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0kQISZGV2c19tYXBfY29weV9pbnRvkgIMZGV2c19tYXBfc2V0kwIGbG9va3VwlAITZGV2c19tYXBsaWtlX2lzX21hcJUCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc5YCEWRldnNfYXJyYXlfaW5zZXJ0lwIIa3ZfYWRkLjGYAhJkZXZzX3Nob3J0X21hcF9zZXSZAg9kZXZzX21hcF9kZWxldGWaAhJkZXZzX3Nob3J0X21hcF9nZXSbAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJwCDmRldnNfcm9sZV9zcGVjnQISZGV2c19mdW5jdGlvbl9iaW5kngIRZGV2c19tYWtlX2Nsb3N1cmWfAg5kZXZzX2dldF9mbmlkeKACE2RldnNfZ2V0X2ZuaWR4X2NvcmWhAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSiAhNkZXZzX2dldF9yb2xlX3Byb3RvowIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3pAIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkpQIVZGV2c19nZXRfc3RhdGljX3Byb3RvpgIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvpwIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2oAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvqQIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkqgIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kqwIQZGV2c19pbnN0YW5jZV9vZqwCD2RldnNfb2JqZWN0X2dldK0CDGRldnNfc2VxX2dldK4CDGRldnNfYW55X2dldK8CDGRldnNfYW55X3NldLACDGRldnNfc2VxX3NldLECDmRldnNfYXJyYXlfc2V0sgITZGV2c19hcnJheV9waW5fcHVzaLMCDGRldnNfYXJnX2ludLQCD2RldnNfYXJnX2RvdWJsZbUCD2RldnNfcmV0X2RvdWJsZbYCDGRldnNfcmV0X2ludLcCDWRldnNfcmV0X2Jvb2y4Ag9kZXZzX3JldF9nY19wdHK5AhFkZXZzX2FyZ19zZWxmX21hcLoCEWRldnNfc2V0dXBfcmVzdW1luwIPZGV2c19jYW5fYXR0YWNovAIZZGV2c19idWlsdGluX29iamVjdF92YWx1Zb0CFWRldnNfbWFwbGlrZV90b192YWx1Zb4CEmRldnNfcmVnY2FjaGVfZnJlZb8CFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzAAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZMECE2RldnNfcmVnY2FjaGVfYWxsb2PCAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cMMCEWRldnNfcmVnY2FjaGVfYWdlxAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXFAhJkZXZzX3JlZ2NhY2hlX25leHTGAg9qZF9zZXR0aW5nc19nZXTHAg9qZF9zZXR0aW5nc19zZXTIAg5kZXZzX2xvZ192YWx1ZckCD2RldnNfc2hvd192YWx1ZcoCEGRldnNfc2hvd192YWx1ZTDLAg1jb25zdW1lX2NodW5rzAINc2hhXzI1Nl9jbG9zZc0CD2pkX3NoYTI1Nl9zZXR1cM4CEGpkX3NoYTI1Nl91cGRhdGXPAhBqZF9zaGEyNTZfZmluaXNo0AIUamRfc2hhMjU2X2htYWNfc2V0dXDRAhVqZF9zaGEyNTZfaG1hY19maW5pc2jSAg5qZF9zaGEyNTZfaGtkZtMCDmRldnNfc3RyZm9ybWF01AIOZGV2c19pc19zdHJpbmfVAg5kZXZzX2lzX251bWJlctYCFGRldnNfc3RyaW5nX2dldF91dGY41wITZGV2c19idWlsdGluX3N0cmluZ9gCFGRldnNfc3RyaW5nX3ZzcHJpbnRm2QITZGV2c19zdHJpbmdfc3ByaW50ZtoCFWRldnNfc3RyaW5nX2Zyb21fdXRmONsCFGRldnNfdmFsdWVfdG9fc3RyaW5n3AIQYnVmZmVyX3RvX3N0cmluZ90CGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTeAhJkZXZzX3N0cmluZ19jb25jYXTfAhFkZXZzX3N0cmluZ19zbGljZeACEmRldnNfcHVzaF90cnlmcmFtZeECEWRldnNfcG9wX3RyeWZyYW1l4gIPZGV2c19kdW1wX3N0YWNr4wITZGV2c19kdW1wX2V4Y2VwdGlvbuQCCmRldnNfdGhyb3flAhJkZXZzX3Byb2Nlc3NfdGhyb3fmAhBkZXZzX2FsbG9jX2Vycm9y5wIVZGV2c190aHJvd190eXBlX2Vycm9y6AIWZGV2c190aHJvd19yYW5nZV9lcnJvcukCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcuoCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y6wIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh07AIYZGV2c190aHJvd190b29fYmlnX2Vycm9y7QIXZGV2c190aHJvd19zeW50YXhfZXJyb3LuAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl7wITZGV2c192YWx1ZV9mcm9tX2ludPACFGRldnNfdmFsdWVfZnJvbV9ib29s8QIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLyAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZfMCEWRldnNfdmFsdWVfdG9faW509AISZGV2c192YWx1ZV90b19ib29s9QIOZGV2c19pc19idWZmZXL2AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfcCEGRldnNfYnVmZmVyX2RhdGH4AhNkZXZzX2J1ZmZlcmlzaF9kYXRh+QIUZGV2c192YWx1ZV90b19nY19vYmr6Ag1kZXZzX2lzX2FycmF5+wIRZGV2c192YWx1ZV90eXBlb2b8Ag9kZXZzX2lzX251bGxpc2j9AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk/gIUZGV2c192YWx1ZV9hcHByb3hfZXH/AhJkZXZzX3ZhbHVlX2llZWVfZXGAAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOBAxJkZXZzX2ltZ19zdHJpZHhfb2uCAxJkZXZzX2R1bXBfdmVyc2lvbnODAwtkZXZzX3ZlcmlmeYQDEWRldnNfZmV0Y2hfb3Bjb2RlhQMOZGV2c192bV9yZXN1bWWGAxFkZXZzX3ZtX3NldF9kZWJ1Z4cDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOIAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSJAw9kZXZzX3ZtX3N1c3BlbmSKAxZkZXZzX3ZtX3NldF9icmVha3BvaW50iwMUZGV2c192bV9leGVjX29wY29kZXOMAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeI0DEWRldnNfaW1nX2dldF91dGY4jgMUZGV2c19nZXRfc3RhdGljX3V0ZjiPAw9kZXZzX3ZtX3JvbGVfb2uQAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaJEDDGV4cHJfaW52YWxpZJIDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0kwMLc3RtdDFfY2FsbDCUAwtzdG10Ml9jYWxsMZUDC3N0bXQzX2NhbGwylgMLc3RtdDRfY2FsbDOXAwtzdG10NV9jYWxsNJgDC3N0bXQ2X2NhbGw1mQMLc3RtdDdfY2FsbDaaAwtzdG10OF9jYWxsN5sDC3N0bXQ5X2NhbGw4nAMSc3RtdDJfaW5kZXhfZGVsZXRlnQMMc3RtdDFfcmV0dXJungMJc3RtdHhfam1wnwMMc3RtdHgxX2ptcF96oAMKZXhwcjJfYmluZKEDEmV4cHJ4X29iamVjdF9maWVsZKIDEnN0bXR4MV9zdG9yZV9sb2NhbKMDE3N0bXR4MV9zdG9yZV9nbG9iYWykAxJzdG10NF9zdG9yZV9idWZmZXKlAwlleHByMF9pbmamAxBleHByeF9sb2FkX2xvY2FspwMRZXhwcnhfbG9hZF9nbG9iYWyoAwtleHByMV91cGx1c6kDC2V4cHIyX2luZGV4qgMPc3RtdDNfaW5kZXhfc2V0qwMUZXhwcngxX2J1aWx0aW5fZmllbGSsAxJleHByeDFfYXNjaWlfZmllbGStAxFleHByeDFfdXRmOF9maWVsZK4DEGV4cHJ4X21hdGhfZmllbGSvAw5leHByeF9kc19maWVsZLADD3N0bXQwX2FsbG9jX21hcLEDEXN0bXQxX2FsbG9jX2FycmF5sgMSc3RtdDFfYWxsb2NfYnVmZmVyswMRZXhwcnhfc3RhdGljX3JvbGW0AxNleHByeF9zdGF0aWNfYnVmZmVytQMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5ntgMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7cDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7gDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrkDDWV4cHJ4X2xpdGVyYWy6AxFleHByeF9saXRlcmFsX2Y2NLsDEGV4cHJ4X3JvbGVfcHJvdG+8AxFleHByM19sb2FkX2J1ZmZlcr0DDWV4cHIwX3JldF92YWy+AwxleHByMV90eXBlb2a/Aw9leHByMF91bmRlZmluZWTAAxJleHByMV9pc191bmRlZmluZWTBAwpleHByMF90cnVlwgMLZXhwcjBfZmFsc2XDAw1leHByMV90b19ib29sxAMJZXhwcjBfbmFuxQMJZXhwcjFfYWJzxgMNZXhwcjFfYml0X25vdMcDDGV4cHIxX2lzX25hbsgDCWV4cHIxX25lZ8kDCWV4cHIxX25vdMoDDGV4cHIxX3RvX2ludMsDCWV4cHIyX2FkZMwDCWV4cHIyX3N1Ys0DCWV4cHIyX211bM4DCWV4cHIyX2Rpds8DDWV4cHIyX2JpdF9hbmTQAwxleHByMl9iaXRfb3LRAw1leHByMl9iaXRfeG9y0gMQZXhwcjJfc2hpZnRfbGVmdNMDEWV4cHIyX3NoaWZ0X3JpZ2h01AMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTVAwhleHByMl9lcdYDCGV4cHIyX2xl1wMIZXhwcjJfbHTYAwhleHByMl9uZdkDEGV4cHIxX2lzX251bGxpc2jaAxRzdG10eDJfc3RvcmVfY2xvc3VyZdsDE2V4cHJ4MV9sb2FkX2Nsb3N1cmXcAxJleHByeF9tYWtlX2Nsb3N1cmXdAxBleHByMV90eXBlb2Zfc3Ry3gMTc3RtdHhfam1wX3JldF92YWxfet8DEHN0bXQyX2NhbGxfYXJyYXngAwlzdG10eF90cnnhAw1zdG10eF9lbmRfdHJ54gMLc3RtdDBfY2F0Y2jjAw1zdG10MF9maW5hbGx55AMLc3RtdDFfdGhyb3flAw5zdG10MV9yZV90aHJvd+YDEHN0bXR4MV90aHJvd19qbXDnAw5zdG10MF9kZWJ1Z2dlcugDCWV4cHIxX25ld+kDEWV4cHIyX2luc3RhbmNlX29m6gMKZXhwcjBfbnVsbOsDD2V4cHIyX2FwcHJveF9lcewDD2V4cHIyX2FwcHJveF9uZe0DE3N0bXQxX3N0b3JlX3JldF92YWzuAw9kZXZzX3ZtX3BvcF9hcmfvAxNkZXZzX3ZtX3BvcF9hcmdfdTMy8AMTZGV2c192bV9wb3BfYXJnX2kzMvEDFmRldnNfdm1fcG9wX2FyZ19idWZmZXLyAxJqZF9hZXNfY2NtX2VuY3J5cHTzAxJqZF9hZXNfY2NtX2RlY3J5cHT0AwxBRVNfaW5pdF9jdHj1Aw9BRVNfRUNCX2VuY3J5cHT2AxBqZF9hZXNfc2V0dXBfa2V59wMOamRfYWVzX2VuY3J5cHT4AxBqZF9hZXNfY2xlYXJfa2V5+QMLamRfd3Nza19uZXf6AxRqZF93c3NrX3NlbmRfbWVzc2FnZfsDE2pkX3dlYnNvY2tfb25fZXZlbnT8AwdkZWNyeXB0/QMNamRfd3Nza19jbG9zZf4DEGpkX3dzc2tfb25fZXZlbnT/AwtyZXNwX3N0YXR1c4AEEndzc2toZWFsdGhfcHJvY2Vzc4EEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlggQUd3Nza2hlYWx0aF9yZWNvbm5lY3SDBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSEBA9zZXRfY29ubl9zdHJpbmeFBBFjbGVhcl9jb25uX3N0cmluZ4YED3dzc2toZWFsdGhfaW5pdIcEEXdzc2tfc2VuZF9tZXNzYWdliAQRd3Nza19pc19jb25uZWN0ZWSJBBR3c3NrX3RyYWNrX2V4Y2VwdGlvbooEEndzc2tfc2VydmljZV9xdWVyeYsEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWMBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xljQQPcm9sZW1ncl9wcm9jZXNzjgQQcm9sZW1ncl9hdXRvYmluZI8EFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJAEFGpkX3JvbGVfbWFuYWdlcl9pbml0kQQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkkgQNamRfcm9sZV9hbGxvY5MEEGpkX3JvbGVfZnJlZV9hbGyUBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5klQQTamRfY2xpZW50X2xvZ19ldmVudJYEE2pkX2NsaWVudF9zdWJzY3JpYmWXBBRqZF9jbGllbnRfZW1pdF9ldmVudJgEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkmQQQamRfZGV2aWNlX2xvb2t1cJoEGGpkX2RldmljZV9sb29rdXBfc2VydmljZZsEE2pkX3NlcnZpY2Vfc2VuZF9jbWScBBFqZF9jbGllbnRfcHJvY2Vzc50EDmpkX2RldmljZV9mcmVlngQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSfBA9qZF9kZXZpY2VfYWxsb2OgBBBzZXR0aW5nc19wcm9jZXNzoQQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKIEDXNldHRpbmdzX2luaXSjBA9qZF9jdHJsX3Byb2Nlc3OkBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSlBAxqZF9jdHJsX2luaXSmBBRkY2ZnX3NldF91c2VyX2NvbmZpZ6cECWRjZmdfaW5pdKgEDWRjZmdfdmFsaWRhdGWpBA5kY2ZnX2dldF9lbnRyeaoEDGRjZmdfZ2V0X2kzMqsEDGRjZmdfZ2V0X3UzMqwED2RjZmdfZ2V0X3N0cmluZ60EDGRjZmdfaWR4X2tlea4ECWpkX3ZkbWVzZ68EEWpkX2RtZXNnX3N0YXJ0cHRysAQNamRfZG1lc2dfcmVhZLEEEmpkX2RtZXNnX3JlYWRfbGluZbIEE2pkX3NldHRpbmdzX2dldF9iaW6zBA1qZF9mc3Rvcl9pbml0tAQTamRfc2V0dGluZ3Nfc2V0X2JpbrUEC2pkX2ZzdG9yX2djtgQPcmVjb21wdXRlX2NhY2hltwQVamRfc2V0dGluZ3NfZ2V0X2xhcmdluAQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZbkEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdlugQWamRfc2V0dGluZ3Nfc3luY19sYXJnZbsEDWpkX2lwaXBlX29wZW68BBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0vQQOamRfaXBpcGVfY2xvc2W+BBJqZF9udW1mbXRfaXNfdmFsaWS/BBVqZF9udW1mbXRfd3JpdGVfZmxvYXTABBNqZF9udW1mbXRfd3JpdGVfaTMywQQSamRfbnVtZm10X3JlYWRfaTMywgQUamRfbnVtZm10X3JlYWRfZmxvYXTDBBFqZF9vcGlwZV9vcGVuX2NtZMQEFGpkX29waXBlX29wZW5fcmVwb3J0xQQWamRfb3BpcGVfaGFuZGxlX3BhY2tldMYEEWpkX29waXBlX3dyaXRlX2V4xwQQamRfb3BpcGVfcHJvY2Vzc8gEFGpkX29waXBlX2NoZWNrX3NwYWNlyQQOamRfb3BpcGVfd3JpdGXKBA5qZF9vcGlwZV9jbG9zZcsEDWpkX3F1ZXVlX3B1c2jMBA5qZF9xdWV1ZV9mcm9udM0EDmpkX3F1ZXVlX3NoaWZ0zgQOamRfcXVldWVfYWxsb2PPBA1qZF9yZXNwb25kX3U40AQOamRfcmVzcG9uZF91MTbRBA5qZF9yZXNwb25kX3UzMtIEEWpkX3Jlc3BvbmRfc3RyaW5n0wQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTUBAtqZF9zZW5kX3BrdNUEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs1gQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLXBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V02AQUamRfYXBwX2hhbmRsZV9wYWNrZXTZBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTaBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXbBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl3AQQamRfc2VydmljZXNfaW5pdN0EDmpkX3JlZnJlc2hfbm933gQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZN8EFGpkX3NlcnZpY2VzX2Fubm91bmNl4AQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXhBBBqZF9zZXJ2aWNlc190aWNr4gQVamRfcHJvY2Vzc19ldmVyeXRoaW5n4wQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXkBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l5QQUYXBwX2dldF9kZXZpY2VfY2xhc3PmBBJhcHBfZ2V0X2Z3X3ZlcnNpb27nBA1qZF9zcnZjZmdfcnVu6AQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXpBBFqZF9zcnZjZmdfdmFyaWFudOoEDWpkX2hhc2hfZm52MWHrBAxqZF9kZXZpY2VfaWTsBAlqZF9yYW5kb23tBAhqZF9jcmMxNu4EDmpkX2NvbXB1dGVfY3Jj7wQOamRfc2hpZnRfZnJhbWXwBAxqZF93b3JkX21vdmXxBA5qZF9yZXNldF9mcmFtZfIEEGpkX3B1c2hfaW5fZnJhbWXzBA1qZF9wYW5pY19jb3Jl9AQTamRfc2hvdWxkX3NhbXBsZV9tc/UEEGpkX3Nob3VsZF9zYW1wbGX2BAlqZF90b19oZXj3BAtqZF9mcm9tX2hlePgEDmpkX2Fzc2VydF9mYWls+QQHamRfYXRvafoEC2pkX3ZzcHJpbnRm+wQPamRfcHJpbnRfZG91Ymxl/AQKamRfc3ByaW50Zv0EEmpkX2RldmljZV9zaG9ydF9pZP4EDGpkX3NwcmludGZfYf8EC2pkX3RvX2hleF9hgAUJamRfc3RyZHVwgQUJamRfbWVtZHVwggUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYMFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWEBRFqZF9zZW5kX2V2ZW50X2V4dIUFCmpkX3J4X2luaXSGBRRqZF9yeF9mcmFtZV9yZWNlaXZlZIcFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNriAUPamRfcnhfZ2V0X2ZyYW1liQUTamRfcnhfcmVsZWFzZV9mcmFtZYoFEWpkX3NlbmRfZnJhbWVfcmF3iwUNamRfc2VuZF9mcmFtZYwFCmpkX3R4X2luaXSNBQdqZF9zZW5kjgUWamRfc2VuZF9mcmFtZV93aXRoX2NyY48FD2pkX3R4X2dldF9mcmFtZZAFEGpkX3R4X2ZyYW1lX3NlbnSRBQtqZF90eF9mbHVzaJIFEF9fZXJybm9fbG9jYXRpb26TBQxfX2ZwY2xhc3NpZnmUBQVkdW1teZUFCF9fbWVtY3B5lgUHbWVtbW92ZZcFBm1lbXNldJgFCl9fbG9ja2ZpbGWZBQxfX3VubG9ja2ZpbGWaBQZmZmx1c2ibBQRmbW9knAUNX19ET1VCTEVfQklUU50FDF9fc3RkaW9fc2Vla54FDV9fc3RkaW9fd3JpdGWfBQ1fX3N0ZGlvX2Nsb3NloAUIX190b3JlYWShBQlfX3Rvd3JpdGWiBQlfX2Z3cml0ZXijBQZmd3JpdGWkBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja6UFFl9fcHRocmVhZF9tdXRleF91bmxvY2umBQZfX2xvY2unBQhfX3VubG9ja6gFDl9fbWF0aF9kaXZ6ZXJvqQUKZnBfYmFycmllcqoFDl9fbWF0aF9pbnZhbGlkqwUDbG9nrAUFdG9wMTatBQVsb2cxMK4FB19fbHNlZWuvBQZtZW1jbXCwBQpfX29mbF9sb2NrsQUMX19vZmxfdW5sb2NrsgUMX19tYXRoX3hmbG93swUMZnBfYmFycmllci4xtAUMX19tYXRoX29mbG93tQUMX19tYXRoX3VmbG93tgUEZmFic7cFA3Bvd7gFBXRvcDEyuQUKemVyb2luZm5hbroFCGNoZWNraW50uwUMZnBfYmFycmllci4yvAUKbG9nX2lubGluZb0FCmV4cF9pbmxpbmW+BQtzcGVjaWFsY2FzZb8FDWZwX2ZvcmNlX2V2YWzABQVyb3VuZMEFBnN0cmNocsIFC19fc3RyY2hybnVswwUGc3RyY21wxAUGc3RybGVuxQUHX191Zmxvd8YFB19fc2hsaW3HBQhfX3NoZ2V0Y8gFB2lzc3BhY2XJBQZzY2FsYm7KBQljb3B5c2lnbmzLBQdzY2FsYm5szAUNX19mcGNsYXNzaWZ5bM0FBWZtb2RszgUFZmFic2zPBQtfX2Zsb2F0c2NhbtAFCGhleGZsb2F00QUIZGVjZmxvYXTSBQdzY2FuZXhw0wUGc3RydG941AUGc3RydG9k1QUSX193YXNpX3N5c2NhbGxfcmV01gUIZGxtYWxsb2PXBQZkbGZyZWXYBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXZBQRzYnJr2gUIX19hZGR0ZjPbBQlfX2FzaGx0aTPcBQdfX2xldGYy3QUHX19nZXRmMt4FCF9fZGl2dGYz3wUNX19leHRlbmRkZnRmMuAFDV9fZXh0ZW5kc2Z0ZjLhBQtfX2Zsb2F0c2l0ZuIFDV9fZmxvYXR1bnNpdGbjBQ1fX2ZlX2dldHJvdW5k5AUSX19mZV9yYWlzZV9pbmV4YWN05QUJX19sc2hydGkz5gUIX19tdWx0ZjPnBQhfX211bHRpM+gFCV9fcG93aWRmMukFCF9fc3VidGYz6gUMX190cnVuY3RmZGYy6wULc2V0VGVtcFJldDDsBQtnZXRUZW1wUmV0MO0FCXN0YWNrU2F2Ze4FDHN0YWNrUmVzdG9yZe8FCnN0YWNrQWxsb2PwBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW508QUVZW1zY3JpcHRlbl9zdGFja19pbml08gUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2X0BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT1BQxkeW5DYWxsX2ppamn2BRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp9wUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB9QUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 26328;
var ___stop_em_js = Module['___stop_em_js'] = 27381;



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
