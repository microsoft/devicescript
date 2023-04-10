
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2AAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA4OGgIAAgQYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDQYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgADAwMGAAAAAgEAAgYABgYDAgIDAgIDBAMDAwYCCAACAQEAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAwEDAAABAQEBAAoAAgIAAQEBAAEAAQEAAAEAAAACAgUFCgABAAEBAgQGAQ4CAAAAAAAIAwYKAgICAAUKAwkDAQUGAwUJBQUGBQEBAwMGAwMFBQUJDQUDAwYGAwMDAwUGBQUFBQUFAQMPEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBgIFBQUBAQUFCgEDAgIBAAoFBQEFBQEFEQICBQ8DAwMDBgYDAwMEBAYGBgEDAAMDBAIAAwACBgAEBgYFAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKDQICAAAHCQkBAwcBAgAIAAIFAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwYCCAYGBgQHBgcDAwYIBgAABB8BAw8DAwAJBwMGBAMEAAQDAwMDBAQGBgAAAAQEBwcHBwQHBwcICAgHBAQDDggDAAQBAAkBAwMBAwUECSAJFwMDBAMHBwUHBAQIAAQEBwkHCAAHCBMEBgYGBAAEGCEQBgQEBAYJBAQAABQLCwsTCxAGCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAUWKSoFDwQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXAB5wHnAQWGgICAAAEBgAKAAgbdgICAAA5/AUGw9gULfwFBAAt/AUEAC38BQQALfwBBqNQBC38AQZfVAQt/AEHh1gELfwBB3dcBC38AQdnYAQt/AEGp2QELfwBBytkBC38AQc/bAQt/AEGo1AELfwBBxdwBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MA9gUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uALIFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAPcFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAugUVZW1zY3JpcHRlbl9zdGFja19pbml0AJEGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAkgYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCTBhhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAlAYJc3RhY2tTYXZlAI0GDHN0YWNrUmVzdG9yZQCOBgpzdGFja0FsbG9jAI8GHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQAkAYNX19zdGFydF9lbV9qcwMMDF9f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RQ0AQcHOAEHxOUHIAEG6GxCYBQALIAAgAUEBcjoABiAAQaAEahDdAiAAEHkgACgC0AEgACgCABCLASAAKALQASAAKAK0ARCLASAAKALQARCXASAAQQBBiAgQtwUaCxIAAkAgAEUNACAAEFEgABAiCwssAQF/IwBBEGsiAiQAIAIgATYCAEG/1AAgAhA8IABB5NQDEIEBIAJBEGokAAsNACAAKALQASABEIsBCwIAC5EDAQR/AkACQAJAAkACQCABLwEOIgJBgH9qDgIAAQILAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtBrxNBABA8DwtBAiABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQJBnjVBABA8DwsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0GvE0EAEDwPC0EBIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAUGeNUEAEDwPCyACQYAjRg0BAkAgACgCCCgCDCICRQ0AIAEgAhEEAEEASg0BCyABEPMEGgsPCyABIAAoAggoAgQRCABB/wFxEO8EGgs1AQJ/QQAoAvDhASEDQYABIQQCQAJAAkAgAEF/ag4CAAECC0GBASEECyADIAQgASACEKQFCwsbAQF/QZjdABD7BCIBIAA2AghBACABNgLw4QELLgEBfwJAQQAoAvDhASIBRQ0AIAEoAggiAUUNACABKAIQIgFFDQAgACABEQAACwvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQ6gQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsEOkEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQ6gQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0A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AgQgASADEJgBDAMLIAMhBSADQeUARg0BCyAEIAU2AgQgBCACNgIAQacKIAQQPCAAQgA3AwAMAQsCQCABKQA4IgZCAFINACABKAKsASIDRQ0AIAAgAykDIDcDAAwBCyAAIAY3AwALIARBEGokAAvOAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQ6gQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDjBBogAyAAKAIELQAOOgAKIAMoAhAPC0G+zABBlD5BMUGHOBCYBQAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahCaAw0AIAMgASkDADcDGAJAAkAgACADQRhqEMUCIgINACADIAEpAwA3AxAgACADQRBqEMQCIQEMAQsCQCAAIAIQxgIiAQ0AQQAhAQwBCwJAIAAgAhCsAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAEPUCIANBKGogACAEENsCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBkC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQpwIgAWohAgwBCyAAIAJBAEEAEKcCIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEL0CIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQjwMgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEP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A0EAIQILAkAgAiIDRQ0AAkAgAC0AQ0ECSQ0AQQAhBANAIAMvAQghBSABIAAgBEEBaiICQQN0akHQAGopAwAiBjcDACABIAY3AxggACADIAUgARDPAiACIQQgAiAALQBDQX9qSA0ACwsgACADLwEIENQCCyABQTBqJAALiQICBX8BfiMAQcAAayIBJAAgASAAKQNQIgY3AyggASAGNwM4AkACQCAAIAFBKGoQmANFDQAgASgCOCECDAELIAEgASkDODcDICABQTBqIABBDyABQSBqEIgDQQAhAgsCQCACIgJFDQAgASAAQdgAaikDACIGNwMYIAEgBjcDOAJAIAAgAUEYahCYAw0AIAEgASkDODcDECABQTBqIABBDyABQRBqEIgDDAELIAEgASkDODcDCAJAIAAgAUEIahCXAyIDLwEIIgRFDQAgACACIAIvAQgiBSAEEK4CDQAgAigCDCAFQQN0aiADKAIMIARBA3QQtQUaCyAAIAIvAQgQ1AILIAFBwABqJAALnAICBn8BfiMAQSBrIgEkACABIAApA1AiBzcDCCABIAc3AxgCQAJAIAAgAUEIahCYA0UNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQiANBACECCyACIgMvAQghAkEAIQQCQCAALQBDQX9qIgVFDQAgAEEAENECIQQLIAQiBEEfdSACcSAEaiIEQQAgBEEAShshBCACIQYCQCAFQQJJDQAgAiEGIABB4ABqKQMAUA0AIABBARDRAiEGCwJAIAAgBiIGQR91IAJxIAZqIgYgAiAGIAJIGyICIAQgAiAEIAJIGyIEayIGEJEBIgJFDQAgAigCDCADKAIMIARBA3RqIAZBA3QQtQUaCyAAIAIQ1gIgAUEgaiQACxMAIAAgACAAQQAQ0QIQkgEQ1gILrwICBX8BfiMAQcAAayIBJAAgASAAQdgAaikDACIGNwM4IAEgBjcDIAJAAkAgACABQSBqIAFBNGoQlgMiAkUNAAJAIAAgASgCNBCSASIDDQBBACEDDAILIANBDGogAiABKAI0ELUFGiADIQMMAQsgASABKQM4NwMYAkAgACABQRhqEJgDRQ0AIAEgASkDODcDEAJAIAAgACABQRBqEJcDIgIvAQgQkgEiBA0AIAQhAwwCCwJAIAIvAQgNACAEIQMMAgtBACEDA0AgASAC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ACACQQBKGyECDAILIAEoAhhBwgBHDQBBfyECDAELIAEgASkDGDcDCEF/IQIgACABQQhqEJADIgREAADg////70FkDQBBACECIAREAAAAAAAAAABjDQACQAJAIAREAAAAAAAA8EFjIAREAAAAAAAAAABmcUUNACAEqyECDAELQQAhAgsgAiECCyAAKAKsASACEHcgAUEgaiQACyMBAX8gAEHf1AMgAEEAENECIgEgAUGgq3xqQaGrfEkbEIEBCwUAEDUACwkAIABBABCBAQv+AQIHfwF+IwBB8ABrIgEkAAJAIAAtAENBAkkNACABIABB2ABqKQMAIgg3A2ggASAINwMQIAAgAUEQaiABQeQAahD0AiICRQ0AIAAgACACIAEoAmQgAUEgakHAACAAQeAAaiIDIAAtAENBfmoiBEEAEPECIgVBf2oiBhCTASIHRQ0AAkACQCAFQcEASQ0AIAFBGGogAEEIIAcQjwMgASABKQMYNwMIIAAgAUEIahCNASAAIAIgASgCZCAHQQZqIAUgAyAEQQAQ8QIaIAEgASkDGDcDACAAIAEQjgEMAQsgB0EGaiABQSBqIAYQtQUaCyAAIAcQ1gILIAFB8ABqJAALbwICfwF+IwBBIGsiASQAIABBABDRAiECIAEgAEHgAGopAwAiAzcDGCABIAM3AwggAUEQaiAAIAFBCGoQ+QIgASABKQMQIgM3AxggASADNwMAIABBPiACIAJB/35qQYB/SRvAIAEQjwIgAUEgaiQACw4AIAAgAEEAENICENMCCw8AIAAgAEEAENICnRDTAguAAgICfwF+IwBB8ABrIgEkACABIABB2ABqKQMANwNoIAEgAEHgAGopAwAiAzcDUCABIAM3A2ACQAJAIAFB0ABqEJoDRQ0AIAEgASkDaDcDECABIAAgAUEQahDnAjYCAEHnFyABEDwMAQsgASABKQNgNwNIIAFB2ABqIAAgAUHIAGoQ+QIgASABKQNYIgM3A2AgASADNwNAIAAgAUHAAGoQjQEgASABKQNgNwM4IAAgAUE4akEAEPQCIQIgASABKQNoNwMwIAEgACABQTBqEOcCNgIkIAEgAjYCIEGZGCABQSBqEDwgASABKQNgNwMYIAAgAUEYahCOAQsgAUHwAGokAAuYAQICfwF+IwBBMGsiASQAIAEgAEHYAGopAwAiAzcDKCABIAM3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AQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEIgDQQAhAAwBCwJAIAAgASgCEBB8IgINACABQRhqIABBnTNBABCGAwsgAiEACwJAIAAiAEUNACAAEH4LIAFBIGokAAtZAgN/AX4jAEEQayIBJAAgACgCrAEhAiABIABB2ABqKQMAIgQ3AwAgASAENwMIIAAgARCmASEDIAAoAqwBIAMQdyACIAItABBB8AFxQQRyOgAQIAFBEGokAAsZACAAKAKsASIAIAA1AhxCgICAgBCENwMgC1kBAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEHDJkEAEIYDDAELIAAgAkF/akEBEH0iAkUNACAAKAKsASACNQIcQoCAgIAQhDcDIAsgAUEQaiQAC+MCAgN/AX4jAEHwAGsiAyQAIAMgAikDADcDQAJAAkACQCABIANBwABqIANB6ABqIANB5ABqEL0CIgRBz4YDSw0AIAEoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENAQsgAyACKQMANwMIIAAgAUG7ISADQQhqEIkDDAELIAAgASABKAKgASAEQf//A3EQsgIgACkDAEIAUg0AIANB2ABqIAFBCCABIAFBAhCoAhCPARCPAyAAIAMpA1giBjcDACAGUA0AIAMgACkDADcDOCABIANBOGoQjQEgA0HQAGpB+wAQ9QIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqEM0CIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahCwAiADIAApAwA3AxAgASADQRBqEI4BCyADQfAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDCAJAAkACQCABIANBCGogA0EYaiADQRRqEL0CIgRBf0oNACADIAIpAwA3AwAgACABQRwgAxCIAwwBCwJAIARB0IYDSA0AIARBsPl8aiIBQQAvAYjTAU4NAiAAQfDoACABQQN0ai8BABD1AgwBCyAAIAEoAKQBIgEgASgCIGogBEEEdGovAQw2AgAgAEEENgIECyADQSBqJAAPC0G6FEGXPEExQbQtEJgFAAvjAQICfwF+IwBB0ABrIgEkACABIABB2ABqKQMANwNIIAEgAEHgAGopAwAiAzcDKCABIAM3A0ACQCABQShqEJoDDQAgAUE4aiAAQeIaEIcDCyABIAEpA0g3AyAgAUE4aiAAIAFBIGoQ+QIgASABKQM4IgM3A0ggASADNwMYIAAgAUEYahCNASABIAEpA0g3AxACQCAAIAFBEGogAUE4ahD0AiICRQ0AIAFBMGogACACIAEoAjhBARCfAiAAKAKsASABKQMwNwMgCyABIAEpA0g3AwggACABQQhqEI4BIAFB0ABqJAALhQEBAn8jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMANwMgIABBAhDRAiECIAEgASkDIDcDCAJAIAFBCGoQmgMNACABQRhqIABBzBwQhwMLIAEgASkDKDcDACABQRBqIAAgASACQQEQpQIgACgCrAEgASkDEDcDICABQTBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEJADmxDTAgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCQA5wQ0wILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQkAMQ4AUQ0wILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQjQMLIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEJADIgREAAAAAAAAAABjRQ0AIAAgBJoQ0wIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQjAW4RAAAAAAAAPA9ohDTAgtkAQV/AkACQCAAQQAQ0QIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBCMBSACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFENQCCxEAIAAgAEEAENICEMsFENMCCxgAIAAgAEEAENICIABBARDSAhDXBRDTAgsuAQN/IABBABDRAiEBQQAhAgJAIABBARDRAiIDRQ0AIAEgA20hAgsgACACENQCCy4BA38gAEEAENECIQFBACECAkAgAEEBENECIgNFDQAgASADbyECCyAAIAIQ1AILFgAgACAAQQAQ0QIgAEEBENECbBDUAgsJACAAQQEQ0gEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQkQMhAyACIAIpAyA3AxAgACACQRBqEJEDIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahCQAyEGIAIgAikDIDcDACAAIAIQkAMhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQPYcTcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDSAQuTAQIDfwF+IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQmgMNACABIAEpAyg3AxAgACABQRBqEMECIQIgASABKQMgNwMIIAAgAUEIahDFAiIDRQ0AIAJFDQAgACACIAMQqQILIAAoAqwBIAEpAyg3AyAgAUEwaiQACwkAIABBARDWAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQxQIiA0UNACAAQQAQkQEiBEUNACACQSBqIABBCCAEEI8DIAIgAikDIDcDECAAIAJBEGoQjQEgACADIAQgARCtAiACIAIpAyA3AwggACACQQhqEI4BIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQ1gEL4wECA38BfiMAQcAAayIBJAAgASAAQdgA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AEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiANBACECCwJAAkAgAiICDQAgAEIANwMADAELAkAgAi8BECICQQx2QX9qQQJJDQAgAEIANwMADAELIAAgAkH/H3EQjQMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiANBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGAIEkQjgMLIANBIGokAAtyAQJ/AkAgAkH//wNHDQBBAA8LAkAgAS8BCCIDDQBBAA8LIAAoAKQBIgAgACgCYGogAS8BCkECdGohBEEAIQEDQAJAIAQgASIBQQN0ai8BAiACRw0AIAQgAUEDdGoPCyABQQFqIgAhASAAIANHDQALQQALnQEBAX8gAUGA4ANxIQICQAJAAkAgAEEBcUUNAAJAIAINACABIQEMAwsCQCACQYDAAEYNACACQYAgRw0CCyABQf8fcUGAIHIhAQwCCwJAIAHBQX9KDQAgAUH/AXFBgIB+ciEBDAILAkAgAkUNACACQYAgRw0BIAFB/x9xQYAgciEBDAILIAFBgMAAciEBDAELQf//AyEBCyABQf//A3ELowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEIgDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAEgASACEOwBELQCCyADQSBqJAALyQIBA38CQCABDQBBAA8LAkAgACABLwESELkCIgINAEEADwsgAS4BECIDQYBgcSEEAkACQAJAIAEtABRBAXFFDQACQCAEDQAgAyEBDAMLAkAgBEH//wNxIgFBgMAARg0AIAFBgCBHDQILIANB/x9xQYAgciEBDAILAkAgA0F/Sg0AIANB/wFxQYCAfnIhAQwCCwJAIARFDQAgBEH//wNxQYAgRw0BIANB/x9xQYAgciEBDAILIANBgMAAciEB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ACABIAEpA0g3AyAgAUHYAGogAEH3HCABQSBqEIkDQQAhAwsCQCADIgNFDQAgACADEPcBAkAgACAAIAEoAkQQuQJBACADLwECEOoBEOkBRQ0AIABBAzoAQyAAQeAAaiAAKAKsATUCHEKAgICAEIQ3AwAgAEHQAGoiAkEIakIANwMAIAJCADcDACABQQI2AlwgASABKAJENgJYIAEgASkDWDcDGCABQThqIAAgAUEYakGSARC/AiABIAEpA1g3AxAgASABKQM4NwMIIAFB0ABqIAAgAUEQaiABQQhqELsCIAAgASkDUDcDUCAAQbECakEBOgAAIABBsgJqIAMvAQI7AQAgAUHQAGogACABKAJEEJACIABB2ABqIAEpA1A3AwAgACgCrAFBAkEAEHUaDAELIAAgASgCRCADLwECEI0CCyABQeAAaiQAC28BAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqEIgDDAELIAAgASgCtAEgAigCAEEMbGooAgAoAhBBAEcQjgMLIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDUDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQiANB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAENECIQMgASAAQeAAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahCWAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AEIoDDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABCKAwwBCyAAQbACaiAFOgAAIABBtAJqIAQgBRC1BRogACACIAMQjQILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQtgIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxCIAyAAQgA3AwAMAQsgACACKAIEEI0DCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqELYCIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQiAMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuTAQICfwF+IwBBwABrIgEkACABIAApA1AiAzcDGCABIAM3AzACQAJAIAAgAUEYahC2AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqEIgDDAELIAEgAEHYAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahC6AiAAKAKsASABKQMoNwMgCyABQcAAaiQAC8MBAgJ/AX4jAEHAAGsiASQAIAEgACkDUCIDNwMYIAEgAzcDMAJAAkACQCAAIAFBGGoQtgINACABIAEpAzA3AwAgAUE4aiAAQZ0BIAEQiAMMAQsgASAAQdgAaikDACIDNwMQIAEgAzcDKCAAIAFBEGoQ2QEiAkUNACABIAApA1AiAzcDCCABIAM3AyAgACABQQhqELUCIgBBf0wNASACIABBgIACczsBEgsgAUHAAGokAA8LQZLNAEHGwABBKUHyIhCYBQALRgEBfyMAQRBrIgMkACADIAIpAwA3AwACQAJAIAEgAyADQQxqEPQCRQ0AIAAgAygCDBCNAwwBCyAAQgA3AwALIANBEGokAAtyAgN/AX4jAEEgayIBJAAgASAAKQNQIgQ3AwggASAENwMQAkAgACABQQhqIAFBHGoQ9AIiAkUNAAJAIABBABDRAiIDIAEoAhxJDQAgACgCrAFBACkD2HE3AyAMAQsgACACIANqLQAAENQCCyABQSBqJAALUAECfyMAQSBrIgEkACABIAApA1A3AxAgAEEAENECIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQywIgACgCrAEgASkDGDcDICABQSBqJAALjwECA38BfiMAQTBrIgEkACAAQQAQ0QIhAiABIABB4ABqKQMAIgQ3AygCQAJAIARQRQ0AQf////8HIQMMAQsgASABKQMoNwMQIAAgAUEQahCRAyEDCyABIAApA1AiBDcDCCABIAQ3AxggAUEgaiAAIAFBCGogAiADEP0CIAAoAqwBIAEpAyA3AyAgAUEwaiQAC6QHAQh/IwBB4ABrIgIkAAJAIAAtABANACAAKAIAIQMgAiABKQMANwNQAkAgAyACQdAAahCMAUUNACAALQAQDQFBCiEBAkAgACgCCCAAKAIEIgNrIgRBCUsNACAAQQE6ABAgBCEBCyABIQECQCAAKAIMIgRF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AgwgACIAampBIDoAACAAQQFqIgYhACAGIAVHDQALCyABIAEoAgwgBWo2AgwLIAQgAikDADcDCCABIARBCGoQogICQCABKAIQRQ0AIAEoAhAgASgCDGpBOjoAAAsgASABKAIMQQFqNgIMAkAgASgCCEUNAAJAIAEoAhBFDQAgASgCECABKAIMakEgOgAACyABIAEoAgxBAWo2AgwLIAQgAykDADcDACABIAQQogICQCABKAIQRQ0AIAEoAhAgASgCDGpBLDoAAAsgASABKAIMQQFqNgIMCyAEQSBqJAAL0QICA38BfiMAQcAAayIFJAAgBSACKQMAIgg3AyAgBSAINwMYIAVCADcCNCAFIAM2AiwgBSABNgIoIAVBADYCPCAFIANBAEciBjYCMCAFQShqIAVBGGoQogICQAJAAkACQCAFKAI8DQAgBSgCNCIHQX5HDQELAkAgBEUNACAFQShqIAFBgccAQQAQhQMLIABCADcDAAwBCyAAIAFBCCABIAcQkwEiBBCPAyAFIAApAwA3AxAgASAFQRBqEI0BAkAgBEUNACAFIAIpAwAiCDcDICAFIAg3AwggBUEANgI8IAUgBEEGajYCOCAFQQA2AjQgBSAGNgIwIAUgAzYCLCAFIAE2AiggBUEoaiAFQQhqEKICIAUoAjwNAiAFKAI0IAQvAQRHDQILIAUgACkDADcDACABIAUQjgELIAVBwABqJAAPC0HAJUGDPEGBBEG4CBCYBQALzAUBCH8jAEEQayICJAAgASEBQQAhAwNAIAMhBCABIQECQAJAIAAtABIiBUUNAEF/IQMMAQsCQCAAKAIMIgMNACAAQf//AzsBEEF/IQMMAQsgACADQX9qNgIMIAAgACgCCCIDQQFqNgIIIAAgAywAACIDOwEQIAMhAwsCQAJAIAMiA0F/Rg0AAkACQCADQdwARg0AIAMhBiADQSJHDQEgASEDIAQhB0ECIQgMAwsCQAJAIAVFDQBBfyEDDAELAkAgACgCDCIDDQAgAEH//wM7ARBBfyEDDAELIAAgA0F/ajYCDCAAIAAoAggiA0EBajYCCCAAIAMsAAAiAzsBECADIQMLIAMiCSEGIAEhAyAEIQdBASEIAkACQAJAAkACQAJAIAlBXmoOVAYICAgICAgICAgICAgGCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI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AEHgAGsiAyQAAkACQCACQQZxQQJGDQAgACABEKgCIQECQCACQQFxDQAgASECDAILAkACQCACQQRxRQ0AAkAgAUHA4wBrQQxtQSdLDQBBjBMQoAUhAgJAIAApADBCAFINACADQd8mNgIwIAMgAjYCNCADQdgAaiAAQa8XIANBMGoQhQMgAiECDAMLIAMgAEEwaikDADcDUCAAIANB0ABqEOcCIQEgA0HfJjYCQCADIAE2AkQgAyACNgJIIANB2ABqIABBvxcgA0HAAGoQhQMgAiECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsgASECAkAgAEF8ag4GBAAAAAAEAAtB2tUAQcA6Qe4EQakgEJgFAAtBjioQoAUhAgJAAkAgACkAMEIAUg0AIANB3yY2AgAgAyACNgIEIANB2ABqIABBrxcgAxCFAwwBCyADIABBMGopAwA3AyggACADQShqEOcCIQEgA0HfJjYCECADIAE2AhQgAyACNgIYIANB2ABqIABBvxcgA0EQahCFAwsgAiECCyACECILQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakEAEMICIQEgAEIANwMwIAJBEGokACABCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEMICIQEgAEIANwMwIAJBEGokACABC6kCAQJ/AkACQCABQcDjAGtBDG1BJ0sNACABKAIEIQIMAQsCQAJAIAEgACgApAEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoArgBDQAgAEEgEIkBIQIgAEEIOgBEIAAgAjYCuAEgAg0AQQAhAgwDCyAAKAK4ASgCFCIDIQIgAw0CIABBCUEQEIgBIgINAUEAIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACwJAAkAgAEF8ag4GAQAAAAABAAtBmNYAQcA6QaQGQfgfEJgFAAsgASgCBA8LIAAoArgBIAI2AhQgAkHA4wBBqAFqQQBBwOMAQbABaigCABs2AgQgAiECC0EAIAIiAEHA4wBBGGpBAEHA4wBBIGooAgAbIAAbIgAgACABRhsLogECAX8BfiMAQSBrIgIkACACIAEpAwA3AwggAkEQaiAAIAJBCGpBNBC/AgJAAkAgAikDEEIAUg0AQQAhASAALQBF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AABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEOQFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEEOQFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCQsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAgLIAQgC0EHakF4cSIBKwMAQQgQmwUgAUEIaiECDAcLIAsoAgAiAUGR1gAgARsiAxDkBSEBAkAgBSANayIK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IAC9IgFCNIinQf8PcSICQf8PRg0AQQQhAyACDQFBAkEDIAFC////////////AINQGw8LIAFC/////////weDUCEDCyADCwQAIAALjgQBA38CQCACQYAESQ0AIAAgASACEBMgAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCADQXxqIgQgAE8NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL9wIBAn8CQCAAIAFGDQACQCABIAAgAmoiA2tBACACQQF0a0sNACAAIAEgAhC1BQ8LIAEgAHNBA3EhBAJAAkACQCAAIAFPDQACQCAERQ0AIAAhAwwDCwJAIABBA3ENACAAIQMMAgsgACEDA0AgAkUNBCADIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiADQQFqIgNBA3FFDQIMAAsACwJAIAQNAAJAIANBA3FFDQADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMg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BSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ/AVBAEoNAAJAIAEgCSADIAoQ/AVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQhgYgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEIYGIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCGBiAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQhgYgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEIYGIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxCGBiAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAggBnKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuOCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAFBBGohBSACQQJ0IgJB7NIBaigCACEGIAJB4NIBaigCACEHA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDnBSECCyACEOgFDQALQQEhCAJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQgCQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ5wUhAgtBACEJAkACQAJAA0AgAkEgciAJQYAIaiwAAEcNAQJAIAlBBksNAAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDnBSECCyAJQQFqIglBCEcNAAwCCwALAkAgCUEDRg0AIAlBCEYNASADRQ0CIAlBBEkNAiAJQQhGDQELAkAgASkDcCIKQgBTDQAgBSAFKAIAQX9qNgIACyADRQ0AIAlBBEkNACAKQgBTIQEDQAJAIAENACAFIAUoAgBBf2o2AgALIAlBf2oiCUEDSw0ACwsgBCAIskMAAIB/lBCABiAEQQhqKQMAIQsgBCkDACEKDAILAkACQAJAIAkNAEEAIQkDQCACQSByIAlB3iNqLAAARw0BAkAgCUEBSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEOcFIQILIAlBAWoiCUEDRw0ADAILAAsCQAJAIAkOBAABAQIBCwJAIAJBMEcNAAJAAkAgASgCBCIJIAEoAmhGDQAgBSAJQQFqNgIAIAktAAAhCQwBCyABEOcFIQkLAkAgCUFfcUHYAEcNACAEQRBqIAEgByAGIAggAxDwBSAEQRhqKQMAIQsgBCkDECEKDAYLIAEpA3BCAFMNACAFIAUoAgBBf2o2AgALIARBIGogASACIAcgBiAIIAMQ8QUgBEEoaikDACELIAQpAyAhCgwEC0IAIQoCQCABKQNwQgBTDQAgBSAFKAIAQX9qNgIACxCyBUEcNgIADAELAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ5wUhAgsCQAJAIAJBKEcNAEEBIQkMAQtCACEKQoCAgICAgOD//wAhCyABKQNwQgBTDQMgBSAFKAIAQX9qNgIADAMLA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDnBSECCyACQb9/aiEIAkACQCACQVBqQQpJDQAgCEEaSQ0AIAJBn39qIQggAkHfAEYNACAIQRpPDQELIAlBAWohCQwBCwtCgICAgICA4P//ACELIAJBKUYNAgJAIAEpA3AiDEIAUw0AIAUgBSgCAEF/ajYCAAsCQAJAIANFDQAgCQ0BQgAhCgwECxCyBUEcNgIAQgAhCgwBCwNAIAlBf2ohCQJAIAxCAFMNACAFIAUoAgBBf2o2AgALQgAhCiAJDQAMAwsACyABIAoQ5gULQgAhCwsgACAKNwMAIAAgCzcDCCAEQTBqJAALwg8CCH8HfiMAQbADayIGJAACQAJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARDnBSEHC0EAIQhCACEOQQAhCQJAAkACQANAAkAgB0EwRg0AIAdBLkcNBCABKAIEIgcgASgCaEYNAiABIAdBAWo2AgQgBy0AACEHDAMLAkAgASgCBCIHIAEoAmhGDQBBASEJIAEgB0EBajYCBCAHLQAAIQcMAQtBASEJIAEQ5wUhBwwACwALIAEQ5wUhBwtBASEIQgAhDiAHQTBHDQADQAJAAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEOcFIQcLIA5Cf3whDiAHQTBGDQALQQEhCEEBIQkLQoCAgICAgMD/PyEPQQAhCkIAIRBCACERQgAhEkEAIQtCACETAkADQCAHQSByIQwCQAJAIAdBUGoiDUEKSQ0AAkAgDEGff2pBBkkNACAHQS5HDQQLIAdBLkcNACAIDQNBASEIIBMhDgwBCyAMQal/aiANIAdBOUobIQcCQAJAIBNCB1UNACAHIApBBHRqIQoMAQsCQCATQhxWDQAgBkEwaiAHEIEGIAZBIGogEiAPQgBCgICAgICAwP0/EIYGIAZBEGogBikDMCAGQTBqQQhqKQMAIAYpAyAiEiAGQSBqQQhqKQMAIg8QhgYgBiAGKQMQIAZBEGpBCGopAwAgECAREPoFIAZBCGopAwAhESAGKQMAIRAMAQsgB0UNACALDQAgBkHQAGogEiAPQgBCgICAgICAgP8/EIYGIAZBwABqIAYpA1AgBkHQAGpBCGopAwAgECAREPoFIAZBwABqQQhqKQMAIRFBASELIAYpA0AhEAsgE0IBfCETQQEhCQsCQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQ5wUhBwwACwALAkACQCAJDQACQAJAAkAgASkDcEIAUw0AIAEgASgCBCIHQX9qNgIEIAVFDQEgASAHQX5qNgIEIAhFDQIgASAHQX1qNgIEDAILIAUNAQsgAUIAEOYFCyAGQeAAaiAEt0QAAAAAAAAAAKIQ/wUgBkHoAGopAwAhEyAGKQNgIRAMAQsCQCATQgdVDQAgEyEPA0AgCkEEdCEKIA9CAXwiD0IIUg0ACwsCQAJAAkACQCAHQV9xQdAARw0AIAEgBRDyBSIPQoCAgICAgICAgH9SDQMCQCAFRQ0AIAEpA3BCf1UNAgwDC0IAIRAgAUIAEOYFQgAhEwwEC0IAIQ8gASkDcEIAUw0CCyABIAEoAgRBf2o2AgQLQgAhDwsCQCAKDQAgBkHwAGogBLdEAAAAAAAAAACiEP8FIAZB+ABqKQMAIRMgBikDcCEQDAELAkAgDiATIAgbQgKGIA98QmB8IhNBACADa61XDQAQsgVBxAA2AgAgBkGgAWogBBCBBiAGQZABaiAGKQOgASAGQaABakEIaikDAEJ/Qv///////7///wAQhgYgBkGAAWogBikDkAEgBkGQAWpBCGopAwBCf0L///////+///8AEIYGIAZBgAFqQQhqKQMAIRMgBikDgAEhEAwBCwJAIBMgA0GefmqsUw0AAkAgCkF/TA0AA0AgBkGgA2ogECARQgBCgICAgICAwP+/fxD6BSAQIBFCAEKAgICAgICA/z8Q/QUhByAGQZADaiAQIBEgBikDoAMgECAHQX9KIgcbIAZBoANqQQhqKQMAIBEgBxsQ+gUgE0J/fCETIAZBkANqQQhqKQMAIREgBikDkAMhECAKQQF0IAdyIgpBf0oNAAsLAkACQCATIAOsfUIgfCIOpyIHQQAgB0EAShsgAiAOIAKtUxsiB0HxAEgNACAGQYADaiAEEIEGIAZBiANqKQMAIQ5CACEPIAYpA4ADIRJCACEUDAELIAZB4AJqRAAAAAAAAPA/QZABIAdrEOkFEP8FIAZB0AJqIAQQgQYgBkHwAmogBikD4AIgBkHgAmpBCGopAwAgBikD0AIiEiAGQdACakEIaikDACIOEOoFIAZB8AJqQQhqKQMAIRQgBikD8AIhDwsgBkHAAmogCiAHQSBIIBAgEUIAQgAQ/AVBAEdxIApBAXFFcSIHahCCBiAGQbACaiASIA4gBikDwAIgBkHAAmpBCGopAwAQhgYgBkGQAmogBikDsAIgBkGwAmpBCGopAwAgDyAUEPoFIAZBoAJqIBIgDkIAIBAgBxtCACARIAcbEIYGIAZBgAJqIAYpA6ACIAZBoAJqQQhqKQMAIAYpA5ACIAZBkAJqQQhqKQMAEPoFIAZB8AFqIAYpA4ACIAZBgAJqQQhqKQMAIA8gFBCJBgJAIAYpA/ABIhAgBkHwAWpBCGopAwAiEUIAQgAQ/AUNABCyBUHEADYCAAsgBkHgAWogECARIBOnEOsFIAZB4AFqQQhqKQMAIRMgBikD4AEhEAwBCxCyBUHEADYCACAGQdABaiAEEIEGIAZBwAFqIAYpA9ABIAZB0AFqQQhqKQMAQgBCgICAgICAwAAQhgYgBkGwAWogBikDwAEgBkHAAWpBCGopAwBCAEKAgICAgIDAABCGBiAGQbABakEIaikDACETIAYpA7ABIRALIAAgEDcDACAAIBM3AwggBkGwA2okAAv6HwMLfwZ+AXwjAEGQxgBrIgckAEEAIQhBACAEayIJIANrIQpCACESQQAhCwJAAkACQANAAkAgAkEwRg0AIAJBLkcNBCABKAIEIgIgASgCaEYNAiABIAJBAWo2AgQgAi0AACECDAMLAkAgASgCBCICIAEoAmhGDQBBASELIAEgAkEBajYCBCACLQAAIQIMAQtBASELIAEQ5wUhAgwACwALIAEQ5wUhAgtBASEIQgAhEiACQTBHDQADQAJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABEOcFIQILIBJCf3whEiACQTBGDQALQQEhC0EBIQgLQQAhDCAHQQA2ApAGIAJBUGohDQJAAkACQAJAAkACQAJAIAJBLkYiDg0AQgAhEyANQQlNDQBBACEPQQAhEAwBC0IAIRNBACEQQQAhD0EAIQwDQAJAAkAgDkEBcUUNAAJAIAgNACATIRJBASEIDAILIAtFIQ4MBAsgE0IBfCETAkAgD0H8D0oNACACQTBGIQsgE6chESAHQZAGaiAPQQJ0aiEOAkAgEEUNACACIA4oAgBBCmxqQVBqIQ0LIAwgESALGyEMIA4gDTYCAEEBIQtBACAQQQFqIgIgAkEJRiICGyEQIA8gAmohDwwBCyACQTBGDQAgByAHKAKARkEBcjYCgEZB3I8BIQwLAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQ5wUhAgsgAkFQaiENIAJBLkYiDg0AIA1BCkkNAAsLIBIgEyAIGyESAkAgC0UNACACQV9xQcUARw0AAkAgASAGEPIFIhRCgICAgICAgICAf1INACAGRQ0EQgAhFCABKQNwQgBTDQAgASABKAIEQX9qNgIECyAUIBJ8IRIMBAsgC0UhDiACQQBIDQELIAEpA3BCAFMNACABIAEoAgRBf2o2AgQLIA5FDQEQsgVBHDYCAAtCACETIAFCABDmBUIAIRIMAQsCQCAHKAKQBiIBDQAgByAFt0QAAAAAAAAAAKIQ/wUgB0EIaikDACESIAcpAwAhEwwBCwJAIBNCCVUNACASIBNSDQACQCADQR5KDQAgASADdg0BCyAHQTBqIAUQgQYgB0EgaiABEIIGIAdBEGogBykDMCAHQTBqQQhqKQMAIAcpAyAgB0EgakEIaikDABCGBiAHQRBqQQhqKQMAIRIgBykDECETDAELAkAgEiAJQQF2rVcNABCyBUHEADYCACAHQeAAaiAFEIEGIAdB0ABqIAcpA2AgB0HgAGpBCGopAwBCf0L///////+///8AEIYGIAdBwABqIAcpA1AgB0HQAGpBCGopAwBCf0L///////+///8AEIYGIAdBwABqQQhqKQMAIRIgBykDQCETDAELAkAgEiAEQZ5+aqxZDQAQsgVBxAA2AgAgB0GQAWogBRCBBiAHQYABaiAHKQOQASAHQZABakEIaikDAEIAQoCAgICAgMAAEIYGIAdB8ABqIAcpA4ABIAdBgAFqQQhqKQMAQgBCgICAgICAwAAQhgYgB0HwAGpBCGopAwAhEiAHKQNwIRMMAQsCQCAQRQ0AAkAgEEEISg0AIAdBkAZqIA9BAnRqIgIoAgAhAQNAIAFBCmwhASAQQQFqIhBBCUcNAAsgAiABNgIACyAPQQFqIQ8LIBKnIQgCQCAMQQlODQAgDCAISg0AIAhBEUoNAAJAIAhBCUcNACAHQcABaiAFEIEGIAdBsAFqIAcoApAGEIIGIAdBoAFqIAcpA8ABIAdBwAFqQQhqKQMAIAcpA7ABIAdBsAFqQQhqKQMAEIYGIAdBoAFqQQhqKQMAIRIgBykDoAEhEwwCCwJAIAhBCEoNACAHQZACaiAFEIEGIAdBgAJqIAcoApAGEIIGIAdB8AFqIAcpA5ACIAdBkAJqQQhqKQMAIAcpA4ACIAdBgAJqQQhqKQMAEIYGIAdB4AFqQQggCGtBAnRBwNIBaigCABCBBiAHQdABaiAHKQPwASAHQfABakEIaikDACAHKQPgASAHQeABakEIaikDABD+BSAHQdABakEIaikDACESIAcpA9ABIRMMAgsgBygCkAYhAQJAIAMgCEF9bGpBG2oiAkEeSg0AIAEgAnYNAQsgB0HgAmogBRCBBiAHQdACaiABEIIGIAdBwAJqIAcpA+ACIAdB4AJqQQhqKQMAIAcpA9ACIAdB0AJqQQhqKQMAEIYGIAdBsAJqIAhBAnRBmNIBaigCABCBBiAHQaACaiAHKQPAAiAHQcACakEIaikDACAHKQOwAiAHQbACakEIaikDABCGBiAHQaACakEIaikDACESIAcpA6ACIRMMAQsDQCAHQZAGaiAPIgJBf2oiD0ECdGooAgBFDQALQQAhEAJAAkAgCEEJbyIBDQBBACEODAELQQAhDiABQQlqIAEgCEEASBshBgJAAkAgAg0AQQAhAgwBC0GAlOvcA0EIIAZrQQJ0QcDSAWooAgAiC20hEUEAIQ1BACEBQQAhDgNAIAdBkAZqIAFBAnRqIg8gDygCACIPIAtuIgwgDWoiDTYCACAOQQFqQf8PcSAOIAEgDkYgDUVxIg0bIQ4gCEF3aiAIIA0bIQggESAPIAwgC2xrbCENIAFBAWoiASACRw0ACyANRQ0AIAdBkAZqIAJBAnRqIA02AgAgAkEBaiECCyAIIAZrQQlqIQgLA0AgB0GQBmogDkECdGohDAJAA0ACQCAIQSRIDQAgCEEkRw0CIAwoAgBB0en5BE8NAgsgAkH/D2ohD0EAIQ0gAiELA0AgCyECAkACQCAHQZAGaiAPQf8PcSIBQQJ0aiILNQIAQh2GIA2tfCISQoGU69wDWg0AQQAhDQwBCyASIBJCgJTr3AOAIhNCgJTr3AN+fSESIBOnIQ0LIAsgEqciDzYCACACIAIgAiABIA8bIAEgDkYbIAEgAkF/akH/D3FHGyELIAFBf2ohDyABIA5HDQALIBBBY2ohECANRQ0ACwJAIA5Bf2pB/w9xIg4gC0cNACAHQZAGaiALQf4PakH/D3FBAnRqIgEgASgCACAHQZAGaiALQX9qQf8PcSICQQJ0aigCAHI2AgALIAhBCWohCCAHQZAGaiAOQQJ0aiANNgIADAELCwJAA0AgAkEBakH/D3EhCSAHQZAGaiACQX9qQf8PcUECdGohBgNAQQlBASAIQS1KGyEPAkADQCAOIQtBACEBAkACQANAIAEgC2pB/w9xIg4gAkYNASAHQZAGaiAOQQJ0aigCACIOIAFBAnRBsNIBaigCACINSQ0BIA4gDUsNAiABQQFqIgFBBEcNAAsLIAhBJEcNAEIAIRJBACEBQgAhEwNAAkAgASALakH/D3EiDiACRw0AIAJBAWpB/w9xIgJBAnQgB0GQBmpqQXxqQQA2AgALIAdBgAZqIAdBkAZqIA5BAnRqKAIAEIIGIAdB8AVqIBIgE0IAQoCAgIDlmreOwAAQhgYgB0HgBWogBykD8AUgB0HwBWpBCGopAwAgBykDgAYgB0GABmpBCGopAwAQ+gUgB0HgBWpBCGopAwAhEyAHKQPgBSESIAFBAWoiAUEERw0ACyAHQdAFaiAFEIEGIAdBwAVqIBIgEyAHKQPQBSAHQdAFakEIaikDABCGBiAHQcAFakEIaikDACETQgAhEiAHKQPABSEUIBBB8QBqIg0gBGsiAUEAIAFBAEobIAMgASADSCIPGyIOQfAATA0CQgAhFUIAIRZCACEXDAULIA8gEGohECACIQ4gCyACRg0AC0GAlOvcAyAPdiEMQX8gD3RBf3MhEUEAIQEgCyEOA0AgB0GQBmogC0ECdGoiDSANKAIAIg0gD3YgAWoiATYCACAOQQFqQf8PcSAOIAsgDkYgAUVxIgEbIQ4gCEF3aiAIIAEbIQggDSARcSAMbCEBIAtBAWpB/w9xIgsgAkcNAAsgAUUNAQJAIAkgDkYNACAHQZAGaiACQQJ0aiABNgIAIAkhAgwDCyAGIAYoAgBBAXI2AgAMAQsLCyAHQZAFakQAAAAAAADwP0HhASAOaxDpBRD/BSAHQbAFaiAHKQOQBSAHQZAFakEIaikDACAUIBMQ6gUgB0GwBWpBCGopAwAhFyAHKQOwBSEWIAdBgAVqRAAAAAAAAPA/QfEAIA5rEOkFEP8FIAdBoAVqIBQgEyAHKQOABSAHQYAFakEIaikDABDtBSAHQfAEaiAUIBMgBykDoAUiEiAHQaAFakEIaikDACIVEIkGIAdB4ARqIBYgFyAHKQPwBCAHQfAEakEIaikDABD6BSAHQeAEakEIaikDACETIAcpA+AEIRQLAkAgC0EEakH/D3EiCCACRg0AAkACQCAHQZAGaiAIQQJ0aigCACIIQf/Jte4BSw0AAkAgCA0AIAtBBWpB/w9xIAJGDQILIAdB8ANqIAW3RAAAAAAAANA/ohD/BSAHQeADaiASIBUgBykD8AMgB0HwA2pBCGopAwAQ+gUgB0HgA2pBCGopAwAhFSAHKQPgAyESDAELAkAgCEGAyrXuAUYNACAHQdAEaiAFt0QAAAAAAADoP6IQ/wUgB0HABGogEiAVIAcpA9AEIAdB0ARqQQhqKQMAEPoFIAdBwARqQQhqKQMAIRUgBykDwAQhEgwBCyAFtyEYAkAgC0EFakH/D3EgAkcNACAHQZAEaiAYRAAAAAAAAOA/ohD/BSAHQYAEaiASIBUgBykDkAQgB0GQBGpBCGopAwAQ+gUgB0GABGpBCGopAwAhFSAHKQOABCESDAELIAdBsARqIBhEAAAAAAAA6D+iEP8FIAdBoARqIBIgFSAHKQOwBCAHQbAEakEIaikDABD6BSAHQaAEakEIaikDACEVIAcpA6AEIRILIA5B7wBKDQAgB0HQA2ogEiAVQgBCgICAgICAwP8/EO0FIAcpA9ADIAdB0ANqQQhqKQMAQgBCABD8BQ0AIAdBwANqIBIgFUIAQoCAgICAgMD/PxD6BSAHQcADakEIaikDACEVIAcpA8ADIRILIAdBsANqIBQgEyASIBUQ+gUgB0GgA2ogBykDsAMgB0GwA2pBCGopAwAgFiAXEIkGIAdBoANqQQhqKQMAIRMgBykDoAMhFAJAIA1B/////wdxIApBfmpMDQAgB0GQA2ogFCATEO4FIAdBgANqIBQgE0IAQoCAgICAgID/PxCGBiAHKQOQAyAHQZADakEIaikDAEIAQoCAgICAgIC4wAAQ/QUhAiAHQYADakEIaikDACATIAJBf0oiAhshEyAHKQOAAyAUIAIbIRQgEiAVQgBCABD8BSENAkAgECACaiIQQe4AaiAKSg0AIA8gDiABR3EgDyACGyANQQBHcUUNAQsQsgVBxAA2AgALIAdB8AJqIBQgEyAQEOsFIAdB8AJqQQhqKQMAIRIgBykD8AIhEwsgACASNwMIIAAgEzcDACAHQZDGAGokAAvJBAIEfwF+AkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACEDDAELIAAQ5wUhAwsCQAJAAkACQAJAIANBVWoOAwABAAELAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQ5wUhAgsgA0EtRiEEIAJBRmohBSABRQ0BIAVBdUsNASAAKQNwQgBTDQIgACAAKAIEQX9qNgIEDAILIANBRmohBUEAIQQgAyECCyAFQXZJDQBCACEGAkAgAkFQaiIFQQpPDQBBACEDA0AgAiADQQpsaiEDAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQ5wUhAgsgA0FQaiEDAkAgAkFQaiIFQQlLDQAgA0HMmbPmAEgNAQsLIAOsIQYLAkAgBUEKTw0AA0AgAq0gBkIKfnwhBgJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEOcFIQILIAZCUHwhBiACQVBqIgVBCUsNASAGQq6PhdfHwuujAVMNAAsLAkAgBUEKTw0AA0ACQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABDnBSECCyACQVBqQQpJDQALCwJAIAApA3BCAFMNACAAIAAoAgRBf2o2AgQLQgAgBn0gBiAEGyEGDAELQoCAgICAgICAgH8hBiAAKQNwQgBTDQAgACAAKAIEQX9qNgIEQoCAgICAgICAgH8PCyAGC4YBAgF/An4jAEGgAWsiBCQAIAQgATYCPCAEIAE2AhQgBEF/NgIYIARBEGpCABDmBSAEIARBEGogA0EBEO8FIARBCGopAwAhBSAEKQMAIQYCQCACRQ0AIAIgASAEKAIUIAQoAogBaiAEKAI8a2o2AgALIAAgBTcDCCAAIAY3AwAgBEGgAWokAAs1AgF/AXwjAEEQayICJAAgAiAAIAFBARDzBSACKQMAIAJBCGopAwAQigYhAyACQRBqJAAgAwsWAAJAIAANAEEADwsQsgUgADYCAEF/C6UrAQt/IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkAgAEH0AUsNAAJAQQAoAsDyASICQRAgAEELakF4cSAAQQtJGyIDQQN2IgR2IgBBA3FFDQACQAJAIABBf3NBAXEgBGoiBUEDdCIEQejyAWoiACAEQfDyAWooAgAiBCgCCCIDRw0AQQAgAkF+IAV3cTYCwPIBDAELIAMgADYCDCAAIAM2AggLIARBCGohACAEIAVBA3QiBUEDcjYCBCAEIAVqIgQgBCgCBEEBcjYCBAwKCyADQQAoAsjyASIGTQ0BAkAgAEUNAAJAAkAgACAEdEECIAR0IgBBACAAa3JxIgBBACAAa3FoIgRBA3QiAEHo8gFqIgUgAEHw8gFqKAIAIgAoAggiB0cNAEEAIAJBfiAEd3EiAjYCwPIBDAELIAcgBTYCDCAFIAc2AggLIAAgA0EDcjYCBCAAIANqIgcgBEEDdCIEIANrIgVBAXI2AgQgACAEaiAFNgIAAkAgBkUNACAGQXhxQejyAWohA0EAKALU8gEhBAJAAkAgAkEBIAZBA3Z0IghxDQBBACACIAhyNgLA8gEgAyEIDAELIAMoAgghCAsgAyAENgIIIAggBDYCDCAEIAM2AgwgBCAINgIICyAAQQhqIQBBACAHNgLU8gFBACAFNgLI8gEMCgtBACgCxPIBIglFDQEgCUEAIAlrcWhBAnRB8PQBaigCACIHKAIEQXhxIANrIQQgByEFAkADQAJAIAUoAhAiAA0AIAVBFGooAgAiAEUNAgsgACgCBEF4cSADayIFIAQgBSAESSIFGyEEIAAgByAFGyEHIAAhBQwACwALIAcoAhghCgJAIAcoAgwiCCAHRg0AIAcoAggiAEEAKALQ8gFJGiAAIAg2AgwgCCAANgIIDAkLAkAgB0EUaiIFKAIAIgANACAHKAIQIgBFDQMgB0EQaiEFCwNAIAUhCyAAIghBFGoiBSgCACIADQAgCEEQaiEFIAgoAhAiAA0ACyALQQA2AgAMCAtBfyEDIABBv39LDQAgAEELaiIAQXhxIQNBACgCxPIBIgZFDQBBACELAkAgA0GAAkkNAEEfIQsgA0H///8HSw0AIANBJiAAQQh2ZyIAa3ZBAXEgAEEBdGtBPmohCwtBACADayEEAkACQAJAAkAgC0ECdEHw9AFqKAIAIgUNAEEAIQBBACEIDAELQQAhACADQQBBGSALQQF2ayALQR9GG3QhB0EAIQgDQAJAIAUoAgRBeHEgA2siAiAETw0AIAIhBCAFIQggAg0AQQAhBCAFIQggBSEADAMLIAAgBUEUaigCACICIAIgBSAHQR12QQRxakEQaigCACIFRhsgACACGyEAIAdBAXQhByAFDQALCwJAIAAgCHINAEEAIQhBAiALdCIAQQAgAGtyIAZxIgBFDQMgAEEAIABrcWhBAnRB8PQBaigCACEACyAARQ0BCwNAIAAoAgRBeHEgA2siAiAESSEHAkAgACgCECIFDQAgAEEUaigCACEFCyACIAQgBxshBCAAIAggBxshCCAFIQAgBQ0ACwsgCEUNACAEQQAoAsjyASADa08NACAIKAIYIQsCQCAIKAIMIgcgCEYNACAIKAIIIgBBACgC0PIBSRogACAHNgIMIAcgADYCCAwHCwJAIAhBFGoiBSgCACIADQAgCCgCECIARQ0DIAhBEGohBQsDQCAFIQIgACIHQRRqIgUoAgAiAA0AIAdBEGohBSAHKAIQIgANAAsgAkEANgIADAYLAkBBACgCyPIBIgAgA0kNAEEAKALU8gEhBAJAAkAgACADayIFQRBJDQAgBCADaiIHIAVBAXI2AgQgBCAAaiAFNgIAIAQgA0EDcjYCBAwBCyAEIABBA3I2AgQgBCAAaiIAIAAoAgRBAXI2AgRBACEHQQAhBQtBACAFNgLI8gFBACAHNgLU8gEgBEEIaiEADAgLAkBBACgCzPIBIgcgA00NAEEAIAcgA2siBDYCzPIBQQBBACgC2PIBIgAgA2oiBTYC2PIBIAUgBEEBcjYCBCAAIANBA3I2AgQgAEEIaiEADAgLAkACQEEAKAKY9gFFDQBBACgCoPYBIQQMAQtBAEJ/NwKk9gFBAEKAoICAgIAENwKc9gFBACABQQxqQXBxQdiq1aoFczYCmPYBQQBBADYCrPYBQQBBADYC/PUBQYAgIQQLQQAhACAEIANBL2oiBmoiAkEAIARrIgtxIgggA00NB0EAIQACQEEAKAL49QEiBEUNAEEAKALw9QEiBSAIaiIJIAVNDQggCSAESw0ICwJAAkBBAC0A/PUBQQRxDQACQAJAAkACQAJAQQAoAtjyASIERQ0AQYD2ASEAA0ACQCAAKAIAIgUgBEsNACAFIAAoAgRqIARLDQMLIAAoAggiAA0ACwtBABD5BSIHQX9GDQMgCCECAkBBACgCnPYBIgBBf2oiBCAHcUUNACAIIAdrIAQgB2pBACAAa3FqIQILIAIgA00NAwJAQQAoAvj1ASIARQ0AQQAoAvD1ASIEIAJqIgUgBE0NBCAFIABLDQQLIAIQ+QUiACAHRw0BDAULIAIgB2sgC3EiAhD5BSIHIAAoAgAgACgCBGpGDQEgByEACyAAQX9GDQECQCADQTBqIAJLDQAgACEHDAQLIAYgAmtBACgCoPYBIgRqQQAgBGtxIgQQ+QVBf0YNASAEIAJqIQIgACEHDAMLIAdBf0cNAgtBAEEAKAL89QFBBHI2Avz1AQsgCBD5BSEHQQAQ+QUhACAHQX9GDQUgAEF/Rg0FIAcgAE8NBSAAIAdrIgIgA0Eoak0NBQtBAEEAKALw9QEgAmoiADYC8PUBAkAgAEEAKAL09QFNDQBBACAANgL09QELAkACQEEAKALY8gEiBEUNAEGA9gEhAANAIAcgACgCACIFIAAoAgQiCGpGDQIgACgCCCIADQAMBQsACwJAAkBBACgC0PIBIgBFDQAgByAATw0BC0EAIAc2AtDyAQtBACEAQQAgAjYChPYBQQAgBzYCgPYBQQBBfzYC4PIBQQBBACgCmPYBNgLk8gFBAEEANgKM9gEDQCAAQQN0IgRB8PIBaiAEQejyAWoiBTYCACAEQfTyAWogBTYCACAAQQFqIgBBIEcNAAtBACACQVhqIgBBeCAHa0EHcUEAIAdBCGpBB3EbIgRrIgU2AszyAUEAIAcgBGoiBDYC2PIBIAQgBUEBcjYCBCAHIABqQSg2AgRBAEEAKAKo9gE2AtzyAQwECyAALQAMQQhxDQIgBCAFSQ0CIAQgB08NAiAAIAggAmo2AgRBACAEQXggBGtBB3FBACAEQQhqQQdxGyIAaiIFNgLY8gFBAEEAKALM8gEgAmoiByAAayIANgLM8gEgBSAAQQFyNgIEIAQgB2pBKDYCBEEAQQAoAqj2ATYC3PIBDAMLQQAhCAwFC0EAIQcMAwsCQCAHQQAoAtDyASIITw0AQQAgBzYC0PIBIAchCAsgByACaiEFQYD2ASEAAkACQAJAAkACQAJAAkADQCAAKAIAIAVGDQEgACgCCCIADQAMAgsACyAALQAMQQhxRQ0BC0GA9gEhAANAAkAgACgCACIFIARLDQAgBSAAKAIEaiIFIARLDQMLIAAoAgghAAwACwALIAAgBzYCACAAIAAoAgQgAmo2AgQgB0F4IAdrQQdxQQAgB0EIakEHcRtqIgsgA0EDcjYCBCAFQXggBWtBB3FBACAFQQhqQQdxG2oiAiALIANqIgNrIQACQCACIARHDQBBACADNgLY8gFBAEEAKALM8gEgAGoiADYCzPIBIAMgAEEBcjYCBAwDCwJAIAJBACgC1PIBRw0AQQAgAzYC1PIBQQBBACgCyPIBIABqIgA2AsjyASADIABBAXI2AgQgAyAAaiAANgIADAMLAkAgAigCBCIEQQNxQQFHDQAgBEF4cSEGAkACQCAEQf8BSw0AIAIoAggiBSAEQQN2IghBA3RB6PIBaiIHRhoCQCACKAIMIgQgBUcNAEEAQQAoAsDyAUF+IAh3cTYCwPIBDAILIAQgB0YaIAUgBDYCDCAEIAU2AggMAQsgAigCGCEJAkACQCACKAIMIgcgAkYNACACKAIIIgQgCEkaIAQgBzYCDCAHIAQ2AggMAQsCQCACQRRqIgQoAgAiBQ0AIAJBEGoiBCgCACIFDQBBACEHDAELA0AgBCEIIAUiB0EUaiIEKAIAIgUNACAHQRBqIQQgBygCECIFDQALIAhBADYCAAsgCUUNAAJAAkAgAiACKAIcIgVBAnRB8PQBaiIEKAIARw0AIAQgBzYCACAHDQFBAEEAKALE8gFBfiAFd3E2AsTyAQwCCyAJQRBBFCAJKAIQIAJGG2ogBzYCACAHRQ0BCyAHIAk2AhgCQCACKAIQIgRFDQAgByAENgIQIAQgBzYCGAsgAigCFCIERQ0AIAdBFGogBDYCACAEIAc2AhgLIAYgAGohACACIAZqIgIoAgQhBAsgAiAEQX5xNgIEIAMgAEEBcjYCBCADIABqIAA2AgACQCAAQf8BSw0AIABBeHFB6PIBaiEEAkACQEEAKALA8gEiBUEBIABBA3Z0IgBxDQBBACAFIAByNgLA8gEgBCEADAELIAQoAgghAAsgBCADNgIIIAAgAzYCDCADIAQ2AgwgAyAANgIIDAMLQR8hBAJAIABB////B0sNACAAQSYgAEEIdmciBGt2QQFxIARBAXRrQT5qIQQLIAMgBDYCHCADQgA3AhAgBEECdEHw9AFqIQUCQAJAQQAoAsTyASIHQQEgBHQiCHENAEEAIAcgCHI2AsTyASAFIAM2AgAgAyAFNgIYDAELIABBAEEZIARBAXZrIARBH0YbdCEEIAUoAgAhBwNAIAciBSgCBEF4cSAARg0DIARBHXYhByAEQQF0IQQgBSAHQQRxakEQaiIIKAIAIgcNAAsgCCADNgIAIAMgBTYCGAsgAyADNgIMIAMgAzYCCAwCC0EAIAJBWGoiAEF4IAdrQQdxQQAgB0EIakEHcRsiCGsiCzYCzPIBQQAgByAIaiIINgLY8gEgCCALQQFyNgIEIAcgAGpBKDYCBEEAQQAoAqj2ATYC3PIBIAQgBUEnIAVrQQdxQQAgBUFZakEHcRtqQVFqIgAgACAEQRBqSRsiCEEbNgIEIAhBEGpBACkCiPYBNwIAIAhBACkCgPYBNwIIQQAgCEEIajYCiPYBQQAgAjYChPYBQQAgBzYCgPYBQQBBADYCjPYBIAhBGGohAANAIABBBzYCBCAAQQhqIQcgAEEEaiEAIAcgBUkNAAsgCCAERg0DIAggCCgCBEF+cTYCBCAEIAggBGsiB0EBcjYCBCAIIAc2AgACQCAHQf8BSw0AIAdBeHFB6PIBaiEAAkACQEEAKALA8gEiBUEBIAdBA3Z0IgdxDQBBACAFIAdyNgLA8gEgACEFDAELIAAoAgghBQsgACAENgIIIAUgBDYCDCAEIAA2AgwgBCAFNgIIDAQLQR8hAAJAIAdB////B0sNACAHQSYgB0EIdmciAGt2QQFxIABBAXRrQT5qIQALIAQgADYCHCAEQgA3AhAgAEECdEHw9AFqIQUCQAJAQQAoAsTyASIIQQEgAHQiAnENAEEAIAggAnI2AsTyASAFIAQ2AgAgBCAFNgIYDAELIAdBAEEZIABBAXZrIABBH0YbdCEAIAUoAgAhCANAIAgiBSgCBEF4cSAHRg0EIABBHXYhCCAAQQF0IQAgBSAIQQRxakEQaiICKAIAIggNAAsgAiAENgIAIAQgBTYCGAsgBCAENgIMIAQgBDYCCAwDCyAFKAIIIgAgAzYCDCAFIAM2AgggA0EANgIYIAMgBTYCDCADIAA2AggLIAtBCGohAAwFCyAFKAIIIgAgBDYCDCAFIAQ2AgggBEEANgIYIAQgBTYCDCAEIAA2AggLQQAoAszyASIAIANNDQBBACAAIANrIgQ2AszyAUEAQQAoAtjyASIAIANqIgU2AtjyASAFIARBAXI2AgQgACADQQNyNgIEIABBCGohAAwDCxCyBUEwNgIAQQAhAAwCCwJAIAtFDQACQAJAIAggCCgCHCIFQQJ0QfD0AWoiACgCAEcNACAAIAc2AgAgBw0BQQAgBkF+IAV3cSIGNgLE8gEMAgsgC0EQQRQgCygCECAIRhtqIAc2AgAgB0UNAQsgByALNgIYAkAgCCgCECIARQ0AIAcgADYCECAAIAc2AhgLIAhBFGooAgAiAEUNACAHQRRqIAA2AgAgACAHNgIYCwJAAkAgBEEPSw0AIAggBCADaiIAQQNyNgIEIAggAGoiACAAKAIEQQFyNgIEDAELIAggA0EDcjYCBCAIIANqIgcgBEEBcjYCBCAHIARqIAQ2AgACQCAEQf8BSw0AIARBeHFB6PIBaiEAAkACQEEAKALA8gEiBUEBIARBA3Z0IgRxDQBBACAFIARyNgLA8gEgACEEDAELIAAoAgghBAsgACAHNgIIIAQgBzYCDCAHIAA2AgwgByAENgIIDAELQR8hAAJAIARB////B0sNACAEQSYgBEEIdmciAGt2QQFxIABBAXRrQT5qIQALIAcgADYCHCAHQgA3AhAgAEECdEHw9AFqIQUCQAJAAkAgBkEBIAB0IgNxDQBBACAGIANyNgLE8gEgBSAHNgIAIAcgBTYCGAwBCyAEQQBBGSAAQQF2ayAAQR9GG3QhACAFKAIAIQMDQCADIgUoAgRBeHEgBEYNAiAAQR12IQMgAEEBdCEAIAUgA0EEcWpBEGoiAigCACIDDQALIAIgBzYCACAHIAU2AhgLIAcgBzYCDCAHIAc2AggMAQsgBSgCCCIAIAc2AgwgBSAHNgIIIAdBADYCGCAHIAU2AgwgByAANgIICyAIQQhqIQAMAQsCQCAKRQ0AAkACQCAHIAcoAhwiBUECdEHw9AFqIgAoAgBHDQAgACAINgIAIAgNAUEAIAlBfiAFd3E2AsTyAQwCCyAKQRBBFCAKKAIQIAdGG2ogCDYCACAIRQ0BCyAIIAo2AhgCQCAHKAIQIgBFDQAgCCAANgIQIAAgCDYCGAsgB0EUaigCACIARQ0AIAhBFGogADYCACAAIAg2AhgLAkACQCAEQQ9LDQAgByAEIANqIgBBA3I2AgQgByAAaiIAIAAoAgRBAXI2AgQMAQsgByADQQNyNgIEIAcgA2oiBSAEQQFyNgIEIAUgBGogBDYCAAJAIAZFDQAgBkF4cUHo8gFqIQNBACgC1PIBIQACQAJAQQEgBkEDdnQiCCACcQ0AQQAgCCACcjYCwPIBIAMhCAwBCyADKAIIIQgLIAMgADYCCCAIIAA2AgwgACADNgIMIAAgCDYCCAtBACAFNgLU8gFBACAENgLI8gELIAdBCGohAAsgAUEQaiQAIAALzAwBB38CQCAARQ0AIABBeGoiASAAQXxqKAIAIgJBeHEiAGohAwJAIAJBAXENACACQQNxRQ0BIAEgASgCACICayIBQQAoAtDyASIESQ0BIAIgAGohAAJAIAFBACgC1PIBRg0AAkAgAkH/AUsNACABKAIIIgQgAkEDdiIFQQN0QejyAWoiBkYaAkAgASgCDCICIARHDQBBAEEAKALA8gFBfiAFd3E2AsDyAQwDCyACIAZGGiAEIAI2AgwgAiAENgIIDAILIAEoAhghBwJAAkAgASgCDCIGIAFGDQAgASgCCCICIARJGiACIAY2AgwgBiACNgIIDAELAkAgAUEUaiICKAIAIgQNACABQRBqIgIoAgAiBA0AQQAhBgwBCwNAIAIhBSAEIgZBFGoiAigCACIEDQAgBkEQaiECIAYoAhAiBA0ACyAFQQA2AgALIAdFDQECQAJAIAEgASgCHCIEQQJ0QfD0AWoiAigCAEcNACACIAY2AgAgBg0BQQBBACgCxPIBQX4gBHdxNgLE8gEMAwsgB0EQQRQgBygCECABRhtqIAY2AgAgBkUNAgsgBiAHNgIYAkAgASgCECICRQ0AIAYgAjYCECACIAY2AhgLIAEoAhQiAkUNASAGQRRqIAI2AgAgAiAGNgIYDAELIAMoAgQiAkEDcUEDRw0AQQAgADYCyPIBIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIADwsgASADTw0AIAMoAgQiAkEBcUUNAAJAAkAgAkECcQ0AAkAgA0EAKALY8gFHDQBBACABNgLY8gFBAEEAKALM8gEgAGoiADYCzPIBIAEgAEEBcjYCBCABQQAoAtTyAUcNA0EAQQA2AsjyAUEAQQA2AtTyAQ8LAkAgA0EAKALU8gFHDQBBACABNgLU8gFBAEEAKALI8gEgAGoiADYCyPIBIAEgAEEBcjYCBCABIABqIAA2AgAPCyACQXhxIABqIQACQAJAIAJB/wFLDQAgAygCCCIEIAJBA3YiBUEDdEHo8gFqIgZGGgJAIAMoAgwiAiAERw0AQQBBACgCwPIBQX4gBXdxNgLA8gEMAgsgAiAGRhogBCACNgIMIAIgBDYCCAwBCyADKAIYIQcCQAJAIAMoAgwiBiADRg0AIAMoAggiAkEAKALQ8gFJGiACIAY2AgwgBiACNgIIDAELAkAgA0EUaiICKAIAIgQNACADQRBqIgIoAgAiBA0AQQAhBgwBCwNAIAIhBSAEIgZBFGoiAigCACIEDQAgBkEQaiECIAYoAhAiBA0ACyAFQQA2AgALIAdFDQACQAJAIAMgAygCHCIEQQJ0QfD0AWoiAigCAEcNACACIAY2AgAgBg0BQQBBACgCxPIBQX4gBHdxNgLE8gEMAgsgB0EQQRQgBygCECADRhtqIAY2AgAgBkUNAQsgBiAHNgIYAkAgAygCECICRQ0AIAYgAjYCECACIAY2AhgLIAMoAhQiAkUNACAGQRRqIAI2AgAgAiAGNgIYCyABIABBAXI2AgQgASAAaiAANgIAIAFBACgC1PIBRw0BQQAgADYCyPIBDwsgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgALAkAgAEH/AUsNACAAQXhxQejyAWohAgJAAkBBACgCwPIBIgRBASAAQQN2dCIAcQ0AQQAgBCAAcjYCwPIBIAIhAAwBCyACKAIIIQALIAIgATYCCCAAIAE2AgwgASACNgIMIAEgADYCCA8LQR8hAgJAIABB////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEHw9AFqIQQCQAJAAkACQEEAKALE8gEiBkEBIAJ0IgNxDQBBACAGIANyNgLE8gEgBCABNgIAIAEgBDYCGAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAuDyAUF/aiIBQX8gARs2AuDyAQsLBwA/AEEQdAtUAQJ/QQAoAqTUASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABD4BU0NACAAEBVFDQELQQAgADYCpNQBIAEPCxCyBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ+wVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEPsFQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxD7BSAFQTBqIAogASAHEIUGIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ+wUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ+wUgBSACIARBASAGaxCFBiAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQgwYOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQhAYaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahD7BUEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEPsFIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEIcGIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEIcGIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEIcGIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEIcGIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEIcGIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEIcGIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEIcGIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEIcGIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEIcGIAVBkAFqIANCD4ZCACAEQgAQhwYgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABCHBiAFQYABakIBIAJ9QgAgBEIAEIcGIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4QhwYgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4QhwYgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxCFBiAFQTBqIBYgEyAGQfAAahD7BSAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxCHBiAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEIcGIAUgAyAOQgVCABCHBiAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ+wUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ+wUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahD7BSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahD7BSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahD7BUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahD7BSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhD7BSAFQSBqIAIgBCAGEPsFIAVBEGogEiABIAcQhQYgBSACIAQgBxCFBiAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ+gUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEPsFIAIgACAEQYH4ACADaxCFBiACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQbD2BSQDQbD2AUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAAREAALJQEBfiAAIAEgAq0gA61CIIaEIAQQlQYhBSAFQiCIpxCLBiAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwve1IGAAAMAQYAIC/jKAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAZGVsYXkAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAV1NTSy1IOiBzdHJlYW1pbmc6ICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBkZXZzX2pkX3NlbmRfcmF3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAcmVzdGFydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABkZXZzX3BhY2tldF9zcGVjX3BhcmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABkYmc6IGhhbHQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25TZXJ2ZXJQYWNrZXQAX29uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfaW5zcGVjdABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAIyAldSAlcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBjbGFzc0lkZW50aWZpZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3RhdGUub2ZmIDwgc2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAHJlc3BvbnNlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAU2VydmVySW50ZXJmYWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAF9zZXJ2ZXJTZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG5vdEltcGxlbWVudGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIp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AAAAAAAAAAAAAAAAAAAAAAAAAACQaQAAMHsBAABBqNQBC50IKHZvaWQgKnN0YXJ0LCB1bnNpZ25lZCBzaXplKTw6Oj57IGlmIChNb2R1bGUuZmxhc2hTYXZlKSBNb2R1bGUuZmxhc2hTYXZlKEhFQVBVOC5zbGljZShzdGFydCwgc3RhcnQgKyBzaXplKSk7IH0AKHZvaWQgKnN0YXJ0LCB1bnNpZ25lZCBzaXplKTw6Oj57IGlmIChNb2R1bGUuZmxhc2hMb2FkKSB7IGNvbnN0IGRhdGEgPSBNb2R1bGUuZmxhc2hMb2FkKCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZygiZmxhc2ggbG9hZCwgc2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAIn5gIAABG5hbWUBmXiYBgANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYYZGV2c19maWJlcl9zZXRfd2FrZV90aW1ldxBkZXZzX2ZpYmVyX3NsZWVweBtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx5GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzehFkZXZzX2ltZ19mdW5fbmFtZXsSZGV2c19pbWdfcm9sZV9uYW1lfBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBCmRldnNfcGFuaWOCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJUBD2RldnNfZ2Nfc2V0X2N0eJYBDmRldnNfZ2NfY3JlYXRllwEPZGV2c19nY19kZXN0cm95mAERZGV2c19nY19vYmpfY2hlY2uZAQtzY2FuX2djX29iapoBEXByb3BfQXJyYXlfbGVuZ3RomwESbWV0aDJfQXJyYXlfaW5zZXJ0nAESZnVuMV9BcnJheV9pc0FycmF5nQEQbWV0aFhfQXJyYXlfcHVzaJ4BFW1ldGgxX0FycmF5X3B1c2hSYW5nZZ8BEW1ldGhYX0FycmF5X3NsaWNloAERZnVuMV9CdWZmZXJfYWxsb2OhARBmdW4xX0J1ZmZlcl9mcm9togEScHJvcF9CdWZmZXJfbGVuZ3RoowEVbWV0aDFfQnVmZmVyX3RvU3RyaW5npAETbWV0aDNfQnVmZmVyX2ZpbGxBdKUBE21ldGg0X0J1ZmZlcl9ibGl0QXSmARRkZXZzX2NvbXB1dGVfdGltZW91dKcBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwqAEXZnVuMV9EZXZpY2VTY3JpcHRfZGVsYXmpARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOqARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SrARlmdW4wX0RldmljZVNjcmlwdF9yZXN0YXJ0rAEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0rQEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSuARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rwEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSwARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcrEBHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nsgEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlzswEiZnVuMV9EZXZpY2VTY3JpcHRfZGV2aWNlSWRlbnRpZmllcrQBHWZ1bjJfRGV2aWNlU2NyaXB0X19zZXJ2ZXJTZW5ktQEUbWV0aDFfRXJyb3JfX19jdG9yX1+2ARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9ftwEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fuAEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+5AQ9wcm9wX0Vycm9yX25hbWW6ARFtZXRoMF9FcnJvcl9wcmludLsBD3Byb3BfRHNGaWJlcl9pZLwBFnByb3BfRHNGaWJlcl9zdXNwZW5kZWS9ARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZb4BF21ldGgwX0RzRmliZXJfdGVybWluYXRlvwEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZMABEWZ1bjBfRHNGaWJlcl9zZWxmwQEUbWV0aFhfRnVuY3Rpb25fc3RhcnTCARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZcMBEnByb3BfRnVuY3Rpb25fbmFtZcQBD2Z1bjJfSlNPTl9wYXJzZcUBE2Z1bjNfSlNPTl9zdHJpbmdpZnnGAQ5mdW4xX01hdGhfY2VpbMcBD2Z1bjFfTWF0aF9mbG9vcsgBD2Z1bjFfTWF0aF9yb3VuZMkBDWZ1bjFfTWF0aF9hYnPKARBmdW4wX01hdGhfcmFuZG9tywETZnVuMV9NYXRoX3JhbmRvbUludMwBDWZ1bjFfTWF0aF9sb2fNAQ1mdW4yX01hdGhfcG93zgEOZnVuMl9NYXRoX2lkaXbPAQ5mdW4yX01hdGhfaW1vZNABDmZ1bjJfTWF0aF9pbXVs0QENZnVuMl9NYXRoX21pbtIBC2Z1bjJfbWlubWF40wENZnVuMl9NYXRoX21heNQBEmZ1bjJfT2JqZWN0X2Fzc2lnbtUBEGZ1bjFfT2JqZWN0X2tleXPWARNmdW4xX2tleXNfb3JfdmFsdWVz1wESZnVuMV9PYmplY3RfdmFsdWVz2AEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bZAR1kZXZzX3ZhbHVlX3RvX3BhY2tldF9vcl90aHJvd9oBEnByb3BfRHNQYWNrZXRfcm9sZdsBHnByb3BfRHNQYWNrZXRfZGV2aWNlSWRlbnRpZmllctwBFXByb3BfRHNQYWNrZXRfc2hvcnRJZN0BGnByb3BfRHNQYWNrZXRfc2VydmljZUluZGV43gEccHJvcF9Ec1BhY2tldF9zZXJ2aWNlQ29tbWFuZN8BE3Byb3BfRHNQYWNrZXRfZmxhZ3PgARdwcm9wX0RzUGFja2V0X2lzQ29tbWFuZOEBFnByb3BfRHNQYWNrZXRfaXNSZXBvcnTiARVwcm9wX0RzUGFja2V0X3BheWxvYWTjARVwcm9wX0RzUGFja2V0X2lzRXZlbnTkARdwcm9wX0RzUGFja2V0X2V2ZW50Q29kZeUBFnByb3BfRHNQYWNrZXRfaXNSZWdTZXTmARZwcm9wX0RzUGFja2V0X2lzUmVnR2V05wEVcHJvcF9Ec1BhY2tldF9yZWdDb2Rl6AEWcHJvcF9Ec1BhY2tldF9pc0FjdGlvbukBFWRldnNfcGt0X3NwZWNfYnlfY29kZeoBEmRldnNfZ2V0X3NwZWNfY29kZesBEnByb3BfRHNQYWNrZXRfc3BlY+wBEWRldnNfcGt0X2dldF9zcGVj7QEVbWV0aDBfRHNQYWNrZXRfZGVjb2Rl7gEdbWV0aDBfRHNQYWNrZXRfbm90SW1wbGVtZW50ZWTvARhwcm9wX0RzUGFja2V0U3BlY19wYXJlbnTwARZwcm9wX0RzUGFja2V0U3BlY19uYW1l8QEWcHJvcF9Ec1BhY2tldFNwZWNfY29kZfIBGnByb3BfRHNQYWNrZXRTcGVjX3Jlc3BvbnNl8wEZbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZfQBEmRldnNfcGFja2V0X2RlY29kZfUBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZPYBFERzUmVnaXN0ZXJfcmVhZF9jb2509wESZGV2c19wYWNrZXRfZW5jb2Rl+AEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZfkBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGX6ARZwcm9wX0RzUGFja2V0SW5mb19uYW1l+wEWcHJvcF9Ec1BhY2tldEluZm9fY29kZfwBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX/0BE3Byb3BfRHNSb2xlX2lzQm91bmT+ARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmT/ASJwcm9wX0RzU2VydmljZVNwZWNfY2xhc3NJZGVudGlmaWVygAIXcHJvcF9Ec1NlcnZpY2VTcGVjX25hbWWBAhptZXRoMV9Ec1NlcnZpY2VTcGVjX2xvb2t1cIICGm1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWdugwIScHJvcF9TdHJpbmdfbGVuZ3RohAIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXSFAhNtZXRoMV9TdHJpbmdfY2hhckF0hgISbWV0aDJfU3RyaW5nX3NsaWNlhwILaW5zcGVjdF9vYmqIAgZhZGRfY2iJAg1pbnNwZWN0X2ZpZWxkigIMZGV2c19pbnNwZWN0iwIUZGV2c19qZF9nZXRfcmVnaXN0ZXKMAhZkZXZzX2pkX2NsZWFyX3BrdF9raW5kjQIQZGV2c19qZF9zZW5kX2NtZI4CEGRldnNfamRfc2VuZF9yYXePAhNkZXZzX2pkX3NlbmRfbG9nbXNnkAITZGV2c19qZF9wa3RfY2FwdHVyZZECEWRldnNfamRfd2FrZV9yb2xlkgISZGV2c19qZF9zaG91bGRfcnVukwIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWUAhNkZXZzX2pkX3Byb2Nlc3NfcGt0lQIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lklgIUZGV2c19qZF9yb2xlX2NoYW5nZWSXAhRkZXZzX2pkX3Jlc2V0X3BhY2tldJgCEmRldnNfamRfaW5pdF9yb2xlc5kCEmRldnNfamRfZnJlZV9yb2xlc5oCFWRldnNfc2V0X2dsb2JhbF9mbGFnc5sCF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdznAIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdznQIQZGV2c19qc29uX2VzY2FwZZ4CFWRldnNfanNvbl9lc2NhcGVfY29yZZ8CD2RldnNfanNvbl9wYXJzZaACCmpzb25fdmFsdWWhAgxwYXJzZV9zdHJpbmeiAg1zdHJpbmdpZnlfb2JqowIKYWRkX2luZGVudKQCD3N0cmluZ2lmeV9maWVsZKUCE2RldnNfanNvbl9zdHJpbmdpZnmmAhFwYXJzZV9zdHJpbmdfY29yZacCEWRldnNfbWFwbGlrZV9pdGVyqAIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SpAhJkZXZzX21hcF9jb3B5X2ludG+qAgxkZXZzX21hcF9zZXSrAgZsb29rdXCsAhNkZXZzX21hcGxpa2VfaXNfbWFwrQIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzrgIRZGV2c19hcnJheV9pbnNlcnSvAghrdl9hZGQuMbACEmRldnNfc2hvcnRfbWFwX3NldLECD2RldnNfbWFwX2RlbGV0ZbICEmRldnNfc2hvcnRfbWFwX2dldLMCIGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWNfaWR4tAIbZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjtQIeZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWNfaWR4tgIaZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWO3AhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldLgCF2RldnNfcGFja2V0X3NwZWNfcGFyZW50uQIOZGV2c19yb2xlX3NwZWO6AhBkZXZzX3NwZWNfbG9va3VwuwISZGV2c19mdW5jdGlvbl9iaW5kvAIRZGV2c19tYWtlX2Nsb3N1cmW9Ag5kZXZzX2dldF9mbmlkeL4CE2RldnNfZ2V0X2ZuaWR4X2NvcmW/Ah5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGTAAhNkZXZzX2dldF9yb2xlX3Byb3RvwQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3wgIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkwwIVZGV2c19nZXRfc3RhdGljX3Byb3RvxAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvxQIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW3GAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvxwIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkyAIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kyQIQZGV2c19pbnN0YW5jZV9vZsoCD2RldnNfb2JqZWN0X2dldMsCDGRldnNfc2VxX2dldMwCDGRldnNfYW55X2dldM0CDGRldnNfYW55X3NldM4CDGRldnNfc2VxX3NldM8CDmRldnNfYXJyYXlfc2V00AITZGV2c19hcnJheV9waW5fcHVzaNECDGRldnNfYXJnX2ludNICD2RldnNfYXJnX2RvdWJsZdMCD2RldnNfcmV0X2RvdWJsZdQCDGRldnNfcmV0X2ludNUCDWRldnNfcmV0X2Jvb2zWAg9kZXZzX3JldF9nY19wdHLXAhFkZXZzX2FyZ19zZWxmX21hcNgCEWRldnNfc2V0dXBfcmVzdW1l2QIPZGV2c19jYW5fYXR0YWNo2gIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZdsCFWRldnNfbWFwbGlrZV90b192YWx1ZdwCEmRldnNfcmVnY2FjaGVfZnJlZd0CFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzeAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZN8CE2RldnNfcmVnY2FjaGVfYWxsb2PgAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cOECEWRldnNfcmVnY2FjaGVfYWdl4gIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXjAhJkZXZzX3JlZ2NhY2hlX25leHTkAg9qZF9zZXR0aW5nc19nZXTlAg9qZF9zZXR0aW5nc19zZXTmAg5kZXZzX2xvZ192YWx1ZecCD2RldnNfc2hvd192YWx1ZegCEGRldnNfc2hvd192YWx1ZTDpAg1jb25zdW1lX2NodW5r6gINc2hhXzI1Nl9jbG9zZesCD2pkX3NoYTI1Nl9zZXR1cOwCEGpkX3NoYTI1Nl91cGRhdGXtAhBqZF9zaGEyNTZfZmluaXNo7gIUamRfc2hhMjU2X2htYWNfc2V0dXDvAhVqZF9zaGEyNTZfaG1hY19maW5pc2jwAg5qZF9zaGEyNTZfaGtkZvECDmRldnNfc3RyZm9ybWF08gIOZGV2c19pc19zdHJpbmfzAg5kZXZzX2lzX251bWJlcvQCFGRldnNfc3RyaW5nX2dldF91dGY49QITZGV2c19idWlsdGluX3N0cmluZ/YCFGRldnNfc3RyaW5nX3ZzcHJpbnRm9wITZGV2c19zdHJpbmdfc3ByaW50ZvgCFWRldnNfc3RyaW5nX2Zyb21fdXRmOPkCFGRldnNfdmFsdWVfdG9fc3RyaW5n+gIQYnVmZmVyX3RvX3N0cmluZ/sCGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGT8AhJkZXZzX3N0cmluZ19jb25jYXT9AhFkZXZzX3N0cmluZ19zbGljZf4CEmRldnNfcHVzaF90cnlmcmFtZf8CEWRldnNfcG9wX3RyeWZyYW1lgAMPZGV2c19kdW1wX3N0YWNrgQMTZGV2c19kdW1wX2V4Y2VwdGlvboIDCmRldnNfdGhyb3eDAxJkZXZzX3Byb2Nlc3NfdGhyb3eEAxBkZXZzX2FsbG9jX2Vycm9yhQMVZGV2c190aHJvd190eXBlX2Vycm9yhgMWZGV2c190aHJvd19yYW5nZV9lcnJvcocDHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcogDGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yiQMeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh0igMYZGV2c190aHJvd190b29fYmlnX2Vycm9yiwMXZGV2c190aHJvd19zeW50YXhfZXJyb3KMAxZkZXZzX3ZhbHVlX2Zyb21fZG91YmxljQMTZGV2c192YWx1ZV9mcm9tX2ludI4DFGRldnNfdmFsdWVfZnJvbV9ib29sjwMXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXKQAxRkZXZzX3ZhbHVlX3RvX2RvdWJsZZEDEWRldnNfdmFsdWVfdG9faW50kgMSZGV2c192YWx1ZV90b19ib29skwMOZGV2c19pc19idWZmZXKUAxdkZXZzX2J1ZmZlcl9pc193cml0YWJsZZUDEGRldnNfYnVmZmVyX2RhdGGWAxNkZXZzX2J1ZmZlcmlzaF9kYXRhlwMUZGV2c192YWx1ZV90b19nY19vYmqYAw1kZXZzX2lzX2FycmF5mQMRZGV2c192YWx1ZV90eXBlb2aaAw9kZXZzX2lzX251bGxpc2ibAxlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVknAMUZGV2c192YWx1ZV9hcHByb3hfZXGdAxJkZXZzX3ZhbHVlX2llZWVfZXGeAxxkZXZzX3ZhbHVlX2VxX2J1aWx0aW5fc3RyaW5nnwMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjoAMSZGV2c19pbWdfc3RyaWR4X29roQMSZGV2c19kdW1wX3ZlcnNpb25zogMLZGV2c192ZXJpZnmjAxFkZXZzX2ZldGNoX29wY29kZaQDDmRldnNfdm1fcmVzdW1lpQMRZGV2c192bV9zZXRfZGVidWemAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzpwMYZGV2c192bV9jbGVhcl9icmVha3BvaW50qAMMZGV2c192bV9oYWx0qQMPZGV2c192bV9zdXNwZW5kqgMWZGV2c192bV9zZXRfYnJlYWtwb2ludKsDFGRldnNfdm1fZXhlY19vcGNvZGVzrAMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHitAxFkZXZzX2ltZ19nZXRfdXRmOK4DFGRldnNfZ2V0X3N0YXRpY191dGY4rwMUZGV2c192YWx1ZV9idWZmZXJpc2iwAwxleHByX2ludmFsaWSxAxRleHByeF9idWlsdGluX29iamVjdLIDC3N0bXQxX2NhbGwwswMLc3RtdDJfY2FsbDG0AwtzdG10M19jYWxsMrUDC3N0bXQ0X2NhbGwztgMLc3RtdDVfY2FsbDS3AwtzdG10Nl9jYWxsNbgDC3N0bXQ3X2NhbGw2uQMLc3RtdDhfY2FsbDe6AwtzdG10OV9jYWxsOLsDEnN0bXQyX2luZGV4X2RlbGV0ZbwDDHN0bXQxX3JldHVybr0DCXN0bXR4X2ptcL4DDHN0bXR4MV9qbXBfer8DCmV4cHIyX2JpbmTAAxJleHByeF9vYmplY3RfZmllbGTBAxJzdG10eDFfc3RvcmVfbG9jYWzCAxNzdG10eDFfc3RvcmVfZ2xvYmFswwMSc3RtdDRfc3RvcmVfYnVmZmVyxAMJZXhwcjBfaW5mxQMQZXhwcnhfbG9hZF9sb2NhbMYDEWV4cHJ4X2xvYWRfZ2xvYmFsxwMLZXhwcjFfdXBsdXPIAwtleHByMl9pbmRleMkDD3N0bXQzX2luZGV4X3NldMoDFGV4cHJ4MV9idWlsdGluX2ZpZWxkywMSZXhwcngxX2FzY2lpX2ZpZWxkzAMRZXhwcngxX3V0ZjhfZmllbGTNAxBleHByeF9tYXRoX2ZpZWxkzgMOZXhwcnhfZHNfZmllbGTPAw9zdG10MF9hbGxvY19tYXDQAxFzdG10MV9hbGxvY19hcnJhedEDEnN0bXQxX2FsbG9jX2J1ZmZlctIDEWV4cHJ4X3N0YXRpY19yb2xl0wMTZXhwcnhfc3RhdGljX2J1ZmZlctQDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ9UDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfWAxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfXAxVleHByeF9zdGF0aWNfZnVuY3Rpb27YAw1leHByeF9saXRlcmFs2QMRZXhwcnhfbGl0ZXJhbF9mNjTaAxBleHByeF9yb2xlX3Byb3Rv2wMRZXhwcjNfbG9hZF9idWZmZXLcAw1leHByMF9yZXRfdmFs3QMMZXhwcjFfdHlwZW9m3gMPZXhwcjBfdW5kZWZpbmVk3wMSZXhwcjFfaXNfdW5kZWZpbmVk4AMKZXhwcjBfdHJ1ZeEDC2V4cHIwX2ZhbHNl4gMNZXhwcjFfdG9fYm9vbOMDCWV4cHIwX25hbuQDCWV4cHIxX2Fic+UDDWV4cHIxX2JpdF9ub3TmAwxleHByMV9pc19uYW7nAwlleHByMV9uZWfoAwlleHByMV9ub3TpAwxleHByMV90b19pbnTqAwlleHByMl9hZGTrAwlleHByMl9zdWLsAwlleHByMl9tdWztAwlleHByMl9kaXbuAw1leHByMl9iaXRfYW5k7wMMZXhwcjJfYml0X29y8AMNZXhwcjJfYml0X3hvcvEDEGV4cHIyX3NoaWZ0X2xlZnTyAxFleHByMl9zaGlmdF9yaWdodPMDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk9AMIZXhwcjJfZXH1AwhleHByMl9sZfYDCGV4cHIyX2x09wMIZXhwcjJfbmX4AxBleHByMV9pc19udWxsaXNo+QMUc3RtdHgyX3N0b3JlX2Nsb3N1cmX6AxNleHByeDFfbG9hZF9jbG9zdXJl+wMSZXhwcnhfbWFrZV9jbG9zdXJl/AMQZXhwcjFfdHlwZW9mX3N0cv0DE3N0bXR4X2ptcF9yZXRfdmFsX3r+AxBzdG10Ml9jYWxsX2FycmF5/wMJc3RtdHhfdHJ5gAQNc3RtdHhfZW5kX3RyeYEEC3N0bXQwX2NhdGNoggQNc3RtdDBfZmluYWxseYMEC3N0bXQxX3Rocm93hAQOc3RtdDFfcmVfdGhyb3eFBBBzdG10eDFfdGhyb3dfam1whgQOc3RtdDBfZGVidWdnZXKHBAlleHByMV9uZXeIBBFleHByMl9pbnN0YW5jZV9vZokECmV4cHIwX251bGyKBA9leHByMl9hcHByb3hfZXGLBA9leHByMl9hcHByb3hfbmWMBBNzdG10MV9zdG9yZV9yZXRfdmFsjQQRZXhwcnhfc3RhdGljX3NwZWOOBA9kZXZzX3ZtX3BvcF9hcmePBBNkZXZzX3ZtX3BvcF9hcmdfdTMykAQTZGV2c192bV9wb3BfYXJnX2kzMpEEFmRldnNfdm1fcG9wX2FyZ19idWZmZXKSBBJqZF9hZXNfY2NtX2VuY3J5cHSTBBJqZF9hZXNfY2NtX2RlY3J5cHSUBAxBRVNfaW5pdF9jdHiVBA9BRVNfRUNCX2VuY3J5cHSWBBBqZF9hZXNfc2V0dXBfa2V5lwQOamRfYWVzX2VuY3J5cHSYBBBqZF9hZXNfY2xlYXJfa2V5mQQLamRfd3Nza19uZXeaBBRqZF93c3NrX3NlbmRfbWVzc2FnZZsEE2pkX3dlYnNvY2tfb25fZXZlbnScBAdkZWNyeXB0nQQNamRfd3Nza19jbG9zZZ4EEGpkX3dzc2tfb25fZXZlbnSfBAtyZXNwX3N0YXR1c6AEEndzc2toZWFsdGhfcHJvY2Vzc6EEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlogQUd3Nza2hlYWx0aF9yZWNvbm5lY3SjBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSkBA9zZXRfY29ubl9zdHJpbmelBBFjbGVhcl9jb25uX3N0cmluZ6YED3dzc2toZWFsdGhfaW5pdKcEEXdzc2tfc2VuZF9tZXNzYWdlqAQRd3Nza19pc19jb25uZWN0ZWSpBBR3c3NrX3RyYWNrX2V4Y2VwdGlvbqoEEndzc2tfc2VydmljZV9xdWVyeasEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWsBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlrQQPcm9sZW1ncl9wcm9jZXNzrgQQcm9sZW1ncl9hdXRvYmluZK8EFXJvbGVtZ3JfaGFuZGxlX3BhY2tldLAEFGpkX3JvbGVfbWFuYWdlcl9pbml0sQQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVksgQNamRfcm9sZV9hbGxvY7MEEGpkX3JvbGVfZnJlZV9hbGy0BBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5ktQQTamRfY2xpZW50X2xvZ19ldmVudLYEE2pkX2NsaWVudF9zdWJzY3JpYmW3BBRqZF9jbGllbnRfZW1pdF9ldmVudLgEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkuQQQamRfZGV2aWNlX2xvb2t1cLoEGGpkX2RldmljZV9sb29rdXBfc2VydmljZbsEE2pkX3NlcnZpY2Vfc2VuZF9jbWS8BBFqZF9jbGllbnRfcHJvY2Vzc70EDmpkX2RldmljZV9mcmVlvgQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXS/BA9qZF9kZXZpY2VfYWxsb2PABBBzZXR0aW5nc19wcm9jZXNzwQQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldMIEDXNldHRpbmdzX2luaXTDBA9qZF9jdHJsX3Byb2Nlc3PEBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXTFBAxqZF9jdHJsX2luaXTGBBRkY2ZnX3NldF91c2VyX2NvbmZpZ8cECWRjZmdfaW5pdMgEDWRjZmdfdmFsaWRhdGXJBA5kY2ZnX2dldF9lbnRyecoEDGRjZmdfZ2V0X2kzMssEDGRjZmdfZ2V0X3UzMswED2RjZmdfZ2V0X3N0cmluZ80EDGRjZmdfaWR4X2tlec4ECWpkX3ZkbWVzZ88EEWpkX2RtZXNnX3N0YXJ0cHRy0AQNamRfZG1lc2dfcmVhZNEEEmpkX2RtZXNnX3JlYWRfbGluZdIEE2pkX3NldHRpbmdzX2dldF9iaW7TBApmaW5kX2VudHJ51AQPcmVjb21wdXRlX2NhY2hl1QQTamRfc2V0dGluZ3Nfc2V0X2JpbtYEC2pkX2ZzdG9yX2dj1wQVamRfc2V0dGluZ3NfZ2V0X2xhcmdl2AQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZdkEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdl2gQWamRfc2V0dGluZ3Nfc3luY19sYXJnZdsEDWpkX2lwaXBlX29wZW7cBBZqZF9pcGlwZV9oYW5kbGVfcGFja2V03QQOamRfaXBpcGVfY2xvc2XeBBJqZF9udW1mbXRfaXNfdmFsaWTfBBVqZF9udW1mbXRfd3JpdGVfZmxvYXTgBBNqZF9udW1mbXRfd3JpdGVfaTMy4QQSamRfbnVtZm10X3JlYWRfaTMy4gQUamRfbnVtZm10X3JlYWRfZmxvYXTjBBFqZF9vcGlwZV9vcGVuX2NtZOQEFGpkX29waXBlX29wZW5fcmVwb3J05QQWamRfb3BpcGVfaGFuZGxlX3BhY2tldOYEEWpkX29waXBlX3dyaXRlX2V45wQQamRfb3BpcGVfcHJvY2Vzc+gEFGpkX29waXBlX2NoZWNrX3NwYWNl6QQOamRfb3BpcGVfd3JpdGXqBA5qZF9vcGlwZV9jbG9zZesEDWpkX3F1ZXVlX3B1c2jsBA5qZF9xdWV1ZV9mcm9udO0EDmpkX3F1ZXVlX3NoaWZ07gQOamRfcXVldWVfYWxsb2PvBA1qZF9yZXNwb25kX3U48AQOamRfcmVzcG9uZF91MTbxBA5qZF9yZXNwb25kX3UzMvIEEWpkX3Jlc3BvbmRfc3RyaW5n8wQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWT0BAtqZF9zZW5kX3BrdPUEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs9gQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXL3BBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0+AQUamRfYXBwX2hhbmRsZV9wYWNrZXT5BBVqZF9hcHBfaGFuZGxlX2NvbW1hbmT6BBVhcHBfZ2V0X2luc3RhbmNlX25hbWX7BBNqZF9hbGxvY2F0ZV9zZXJ2aWNl/AQQamRfc2VydmljZXNfaW5pdP0EDmpkX3JlZnJlc2hfbm93/gQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZP8EFGpkX3NlcnZpY2VzX2Fubm91bmNlgAUXamRfc2VydmljZXNfbmVlZHNfZnJhbWWBBRBqZF9zZXJ2aWNlc190aWNrggUVamRfcHJvY2Vzc19ldmVyeXRoaW5ngwUaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWEBRZhcHBfZ2V0X2Rldl9jbGFzc19uYW1lhQUUYXBwX2dldF9kZXZpY2VfY2xhc3OGBRJhcHBfZ2V0X2Z3X3ZlcnNpb26HBQ1qZF9zcnZjZmdfcnVuiAUXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWWJBRFqZF9zcnZjZmdfdmFyaWFudIoFDWpkX2hhc2hfZm52MWGLBQxqZF9kZXZpY2VfaWSMBQlqZF9yYW5kb22NBQhqZF9jcmMxNo4FDmpkX2NvbXB1dGVfY3JjjwUOamRfc2hpZnRfZnJhbWWQBQxqZF93b3JkX21vdmWRBQ5qZF9yZXNldF9mcmFtZZIFEGpkX3B1c2hfaW5fZnJhbWWTBQ1qZF9wYW5pY19jb3JllAUTamRfc2hvdWxkX3NhbXBsZV9tc5UFEGpkX3Nob3VsZF9zYW1wbGWWBQlqZF90b19oZXiXBQtqZF9mcm9tX2hleJgFDmpkX2Fzc2VydF9mYWlsmQUHamRfYXRvaZoFC2pkX3ZzcHJpbnRmmwUPamRfcHJpbnRfZG91YmxlnAUKamRfc3ByaW50Zp0FEmpkX2RldmljZV9zaG9ydF9pZJ4FDGpkX3NwcmludGZfYZ8FC2pkX3RvX2hleF9hoAUJamRfc3RyZHVwoQUJamRfbWVtZHVwogUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZaMFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWkBRFqZF9zZW5kX2V2ZW50X2V4dKUFCmpkX3J4X2luaXSmBRRqZF9yeF9mcmFtZV9yZWNlaXZlZKcFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrqAUPamRfcnhfZ2V0X2ZyYW1lqQUTamRfcnhfcmVsZWFzZV9mcmFtZaoFEWpkX3NlbmRfZnJhbWVfcmF3qwUNamRfc2VuZF9mcmFtZawFCmpkX3R4X2luaXStBQdqZF9zZW5krgUWamRfc2VuZF9mcmFtZV93aXRoX2NyY68FD2pkX3R4X2dldF9mcmFtZbAFEGpkX3R4X2ZyYW1lX3NlbnSxBQtqZF90eF9mbHVzaLIFEF9fZXJybm9fbG9jYXRpb26zBQxfX2ZwY2xhc3NpZnm0BQVkdW1tebUFCF9fbWVtY3B5tgUHbWVtbW92ZbcFBm1lbXNldLgFCl9fbG9ja2ZpbGW5BQxfX3VubG9ja2ZpbGW6BQZmZmx1c2i7BQRmbW9kvAUNX19ET1VCTEVfQklUU70FDF9fc3RkaW9fc2Vla74FDV9fc3RkaW9fd3JpdGW/BQ1fX3N0ZGlvX2Nsb3NlwAUIX190b3JlYWTBBQlfX3Rvd3JpdGXCBQlfX2Z3cml0ZXjDBQZmd3JpdGXEBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja8UFFl9fcHRocmVhZF9tdXRleF91bmxvY2vGBQZfX2xvY2vHBQhfX3VubG9ja8gFDl9fbWF0aF9kaXZ6ZXJvyQUKZnBfYmFycmllcsoFDl9fbWF0aF9pbnZhbGlkywUDbG9nzAUFdG9wMTbNBQVsb2cxMM4FB19fbHNlZWvPBQZtZW1jbXDQBQpfX29mbF9sb2Nr0QUMX19vZmxfdW5sb2Nr0gUMX19tYXRoX3hmbG930wUMZnBfYmFycmllci4x1AUMX19tYXRoX29mbG931QUMX19tYXRoX3VmbG931gUEZmFic9cFA3Bvd9gFBXRvcDEy2QUKemVyb2luZm5hbtoFCGNoZWNraW502wUMZnBfYmFycmllci4y3AUKbG9nX2lubGluZd0FCmV4cF9pbmxpbmXeBQtzcGVjaWFsY2FzZd8FDWZwX2ZvcmNlX2V2YWzgBQVyb3VuZOEFBnN0cmNocuIFC19fc3RyY2hybnVs4wUGc3RyY21w5AUGc3RybGVu5QUHX191Zmxvd+YFB19fc2hsaW3nBQhfX3NoZ2V0Y+gFB2lzc3BhY2XpBQZzY2FsYm7qBQljb3B5c2lnbmzrBQdzY2FsYm5s7AUNX19mcGNsYXNzaWZ5bO0FBWZtb2Rs7gUFZmFic2zvBQtfX2Zsb2F0c2NhbvAFCGhleGZsb2F08QUIZGVjZmxvYXTyBQdzY2FuZXhw8wUGc3RydG949AUGc3RydG9k9QUSX193YXNpX3N5c2NhbGxfcmV09gUIZGxtYWxsb2P3BQZkbGZyZWX4BRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemX5BQRzYnJr+gUIX19hZGR0ZjP7BQlfX2FzaGx0aTP8BQdfX2xldGYy/QUHX19nZXRmMv4FCF9fZGl2dGYz/wUNX19leHRlbmRkZnRmMoAGDV9fZXh0ZW5kc2Z0ZjKBBgtfX2Zsb2F0c2l0ZoIGDV9fZmxvYXR1bnNpdGaDBg1fX2ZlX2dldHJvdW5khAYSX19mZV9yYWlzZV9pbmV4YWN0hQYJX19sc2hydGkzhgYIX19tdWx0ZjOHBghfX211bHRpM4gGCV9fcG93aWRmMokGCF9fc3VidGYzigYMX190cnVuY3RmZGYyiwYLc2V0VGVtcFJldDCMBgtnZXRUZW1wUmV0MI0GCXN0YWNrU2F2ZY4GDHN0YWNrUmVzdG9yZY8GCnN0YWNrQWxsb2OQBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50kQYVZW1zY3JpcHRlbl9zdGFja19pbml0kgYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZZMGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WUBhhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSVBgxkeW5DYWxsX2ppammWBhZsZWdhbHN0dWIkZHluQ2FsbF9qaWpplwYYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBlQYEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 27176;
var ___stop_em_js = Module['___stop_em_js'] = 28229;



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
