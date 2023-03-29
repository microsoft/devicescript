
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+uFgIAA6QUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAQUDAAoAAgIAAQEBAAEAAAEAAAACBgYKAAECAAEBBAUBAgAAAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGEQICBg4DAwMDBQUDAwMEBAUFBQEDAAMDBAIAAwACBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgIEBAEKDQICAAAHCQkBAwcBAgAIAAIGAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXAB2QHZAQWGgICAAAEBgAKAAgbdgICAAA5/AUHw8QULfwFBAAt/AUEAC38BQQALfwBB6M8BC38AQdfQAQt/AEGh0gELfwBBndMBC38AQZnUAQt/AEHp1AELfwBBitUBC38AQY/XAQt/AEHozwELfwBBhdgBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MA3gUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAJoFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAN8FGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAogUVZW1zY3JpcHRlbl9zdGFja19pbml0APkFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA+gUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQD7BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA/AUJc3RhY2tTYXZlAPUFDHN0YWNrUmVzdG9yZQD2BQpzdGFja0FsbG9jAPcFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA+AUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlq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ASAAKAK0ARCMASAAKALQARCYASAAQQBBiAgQnwUaCxIAAkAgAEUNACAAEFEgABAiCwssAQF/IwBBEGsiAiQAIAIgATYCAEH50QAgAhA8IABB5NQDEIIBIAJBEGokAAsNACAAKALQASABEIwBCwIAC5EDAQR/AkACQAJAAkACQCABLwEOIgJBgH9qDgIAAQILAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtB8BJBABA8DwtBAiABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQJB7TNBABA8DwsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0HwEkEAEDwPC0EBIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAUHtM0EAEDwPCyACQYAjRg0BAkAgACgCCCgCDCICRQ0AIAEgAhEEAEEASg0BCyABENsEGgsPCyABIAAoAggoAgQRCABB/wFxENcEGgs1AQJ/QQAoArDdASEDQYABIQQCQAJAAkAgAEF/ag4CAAECC0GBASEECyADIAQgASACEIwFCwsbAQF/QcjaABDjBCIBIAA2AghBACABNgKw3QELLgEBfwJAQQAoArDdASIBRQ0AIAEoAggiAUUNACABKAIQIgFFDQAgACABEQAACwvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQ0gQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsENEEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQ0gQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0ACwsLbQEDfwJAQQAoArTdASIBRQ0AAkAQcCICRQ0AIAIgAS0ABkEARxCNAyACQQA6AEkgAiABLQAIQQBHQQF0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IgZCAFINACABKAKsASIDRQ0AIAAgAykDIDcDAAwBCyAAIAY3AwALIARBEGokAAvOAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQ0gQaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDLBBogAyAAKAIELQAOOgAKIAMoAhAPC0GBygBBvDxBMUHWNhCABQAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahCCAw0AIAMgASkDADcDGAJAAkAgACADQRhqEK0CIgINACADIAEpAwA3AxAgACADQRBqEKwCIQEMAQsCQCAAIAIQrgIiAQ0AQQAhAQwBCwJAIAAgAhCaAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAEN0CIANBKGogACAEEMMCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBkC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQlQIgAWohAgwBCyAAIAJBAEEAEJUCIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEKUCIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ9wIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNL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CEEAEO0CQQAhAwsgACADEL4CIAFBwABqJAALigECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AyACQAJAAkAgASADQRhqEPsCDQAgAyADKQMgNwMQIANBKGogAUESIANBEGoQ8AIMAQsgAyADKQMgNwMIIAEgA0EIaiADQShqEP0CRQ0AIAAgAygCKBD1AgwBCyAAQgA3AwALIANBMGokAAvNAwIDfwF+IwBBoAFrIgEkACABIABB2ABqKQMANwOAASABIAApA1AiBDcDWCABIAQ3A5ABAkACQCAAIAFB2ABqEPsCDQAgASABKQOQATcDUCABQZgBaiAAQRIgAUHQAGoQ8AJBACECDAELIAEgASkDkAE3A0ggACABQcgAaiABQYwBahD9AiECCwJAIAIiAkUNACABQfgAakGWARDdAiABIAEpA4ABNwNAIAEgASkDeDcDOAJAIAAgAUHAAGogAUE4ahCGA0UNAAJAIAAgASgCjAFBAXQQlAEiA0UNACADQQZqIAIgASgCjAEQ/gQLIAAgAxC+AgwBCyABIAEpA4ABNwMwAkACQCABQTBqEIMDDQAgAUHwAGpBlwEQ3QIgASABKQOAATcDKCABIAEpA3A3AyAgACABQShqIAFBIGoQhgMNACABQegAakGYARDdAiABIAEpA4ABNwMYIAEgASkDaDcDECAAIAFBGGogAUEQahCGA0UNAQsgAUHgAGogACACIAEoAowBEOACIAAoAqwBIAEpA2A3AyAMAQsgASABKQOAATcDCCABIAAgAUEIahDPAjYCACABQZgBaiAAQaMYIAEQ7QILIAFBoAFqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahD8Ag0AIAEgASkDIDcDECABQShqIABBzBsgAUEQahDxAkEAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEP0CIQILAkAgAiIDRQ0AIABBABC5AiECIABBARC5AiEEIABBAhC5AiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQnwUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQ/AINACABIAEpA1A3AzAgAUHY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ASIAIAA1AhxCgICAgBCENwMgC1kBAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEHZJUEAEO4CDAELIAAgAkF/akEBEH4iAkUNACAAKAKsASACNQIcQoCAgIAQhDcDIAsgAUEQaiQAC+MCAgN/AX4jAEHwAGsiAyQAIAMgAikDADcDQAJAAkACQCABIANBwABqIANB6ABqIANB5ABqEKUCIgRBz4YDSw0AIAEoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENAQsgAyACKQMANwMIIAAgAUHlICADQQhqEPECDAELIAAgASABKAKgASAEQf//A3EQoAIgACkDAEIAUg0AIANB2ABqIAFBCCABIAFBAhCWAhCQARD3AiAAIAMpA1giBjcDACAGUA0AIAMgACkDADcDOCABIANBOGoQjgEgA0HQAGpB+wAQ3QIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqELUCIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahCeAiADIAApAwA3AxAgASADQRBqEI8BCyADQfAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDCAJAAkACQCABIANBCGogA0EYaiADQRRqEKUCIgRBf0oNACADIAIpAwA3AwAgACABQRwgAxDwAgwBCwJAIARB0IYDSA0AIARBsPl8aiIBQQAvAcDLAU4NAiAAQcDlACABQQN0ai8BABDdAgwBCyAAIAEoAKQBIgEgASgCIGogBEEEdGovAQw2AgAgAEEENgIECyADQSBqJAAPC0H7E0G/OkExQcEsEIAFAAvjAQICfwF+IwBB0ABrIgEkACABIABB2ABqKQMANwNIIAEgAEHgAGopAwAiAzcDKCABIAM3A0ACQCABQShqEIIDDQAgAUE4aiAAQZwaEO8CCyABIAEpA0g3AyAgAUE4aiAAIAFBIGoQ4QIgASABKQM4IgM3A0ggASADNwMYIAAgAUEYahCOASABIAEpA0g3AxACQCAAIAFBEGogAUE4ahDcAiICRQ0AIAFBMGogACACIAEoAjhBARCNAiAAKAKsASABKQMwNwMgCyABIAEpA0g3AwggACABQQhqEI8BIAFB0ABqJAALhQEBAn8jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMANwMgIABBAhC5AiECIAEgASkDIDcDCAJAIAFBCGoQggMNACABQRhqIABB9hsQ7wILIAEgASkDKDcDACABQRBqIAAgASACQQEQkwIgACgCrAEgASkDEDcDICABQTBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPgCmxC7AgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD4ApwQuwILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ+AIQyAUQuwILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ9QILIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEPgCIgREAAAAAAAAAABjRQ0AIAAgBJoQuwIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQ9AS4RAAAAAAAAPA9ohC7AgtkAQV/AkACQCAAQQAQuQIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBD0BCACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFELwCCxEAIAAgAEEAELoCELMFELsCCxgAIAAgAEEAELoCIABBARC6AhC/BRC7AgsuAQN/IABBABC5AiEBQQAhAgJAIABBARC5AiIDRQ0AIAEgA20hAgsgACACELwCCy4BA38gAEEAELkCIQFBACECAkAgAEEBELkCIgNFDQAgASADbyECCyAAIAIQvAILFgAgACAAQQAQuQIgAEEBELkCbBC8AgsJACAAQQEQzwEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ+QIhAyACIAIpAyA3AxAgACACQRBqEPkCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahD4AiEGIAIgAikDIDcDACAAIAIQ+AIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQO4bTcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDPAQuTAQIDfwF+IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQggMNACABIAEpAyg3AxAgACABQRBqEKkCIQIgASABKQMgNwMIIAAgAUEIahCtAiIDRQ0AIAJFDQAgACACIAMQlwILIAAoAqwBIAEpAyg3AyAgAUEwaiQACwkAIABBARDTAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQrQIiA0UNACAAQQAQkgEiBEUNACACQSBqIABBCCAEEPcCIAIgAikDIDcDECAAIAJBEGoQjgEgACADIAQgARCbAiACIAIpAyA3AwggACACQQhqEI8BIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQ0wEL4wECA38BfiMAQcAAayIBJAAgASAAQdgAaikDACIENwM4IAEgAEHgAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ/wIiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDwAgwBCyABIAEpAzA3AxgCQCAAIAFBGGoQrQIiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqEPACDAELIAIgAzYCBCAAKAKsASABKQM4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CiEKQQAhCwsgBCEDDAELIAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABB5zQgAhDuAiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQS2ohAwsgAEGwAmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahChAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGuHCABQRBqEPECQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGhHCABQQhqEPECQQAhAwsCQCADIgNFDQAgACADEOsBIAAgASgCJCADLwECQf8fcUGAwAByEP0BCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEKECIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQa4cIANBCGoQ8QJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahChAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGuHCADQQhqEPECQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQoQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBrhwgA0EIahDxAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRD1AgsgA0EwaiQAC80DAgN/AX4jAEHgAGsiASQAIAEgACkDUCIENwNIIAEgBDcDMCABIAQ3A1AgACAB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fiMAQRBrIgEkAEEBIQICQAJAIAAtABBBD3EiAw4FAQAAAAEACwJAAkACQAJAAkAgA0F/ag4DAQIAAwsgASAAKAIsIAAvARIQgAIgACABKQMANwMgQQEhAgwECwJAIAAoAiwiAigCtAEgAC8BEiIEQQxsaigCACgCECIDDQAgAEEAEHdBACECDAQLAkAgAkGnAmotAABBAXENACACQbICai8BACIFRQ0AIAUgAC8BFEcNACADLQAEIgUgAkGxAmotAABHDQAgA0EAIAVrQQxsakFkaikDACACQagCaikCAFINACACIAQgAC8BCBCDAiIDRQ0AIAJBoARqIAMQxgIaQQEhAgwECwJAIAAoAhggAigCwAFLDQAgAUEANgIMQQAhBAJAIAAvAQgiA0UNACACIAMgAUEMahCWAyEECyACQaQCaiEFIAAvARQhBiAALwESIQcgASgCDCEDIAJBAToApwIgAkGmAmogA0EHakH8AXE6AAAgAigCtAEgB0EMbGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAQiBEUNACACQbQCaiAEIAMQnQUaCyAFENwEIgNFIQIgAw0DAkAgAC8BCiIEQecHSw0AIAAgBEEBdDsBCgsgACAALwEKEHggAiECIAMNBAtBACECDAMLAkAgACgCLCICKAK0ASAALwESQQxsaigCACgCECIEDQAgAEEAEHdBACECDAMLIAAoAgghBSAALwEUIQYgAC0ADCEDIAJBpwJqQQE6AAAgAkGmAmogA0EHakH8AXE6AAAgBEEAIAQtAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAVFDQAgAkG0AmogBSADEJ0FGgsCQCACQaQCahDcBCICDQAgAkUhAgwDCyAAQQMQeEEAIQIMAgtBoD5B2QJBkyAQ+wQACyAAQQMQeCACIQILIAFBEGokACACC9MCAQZ/IwBBEGsiAyQAIABBtAJqIQQgAEGwAmotAAAhBQJAAkACQAJAIAINACAFIQUgBCEEDAELIAAgAiADQQxqEJYDIQYCQAJAIAMoAgwiByAALQCwAk4NACAEIAdqLQAADQAgBiAEIAcQtwUNACAHQQFqIQcMAQtBACEHCyAHIgdFDQEgBSAHayEFIAQgB2ohBAsgBCEHIAUhBAJAAkAgAEGgBGoiCCABIABBsgJqLwEAIAIQyAIiBUUNAAJAIAQgBS0AFEcNACAFIQUMAgsgCCAFEMQCC0EAIQULIAUiBiEFAkAgBg0AIAggASAALwGyAiAEEMcCIgEgAjsBFiABIQULIAUiAkEIaiEBAkACQCACLQAUQQpPDQAgASEBDAELIAEoAgAhAQsgASAHIAQQnQUaIAIgACkDwAE+AgQgAiEADAELQQAhAAsgA0EQaiQAIAALygIBBX8CQCAALQBGDQAgAEGkAmogAiACLQAMQRBqEJ0FGgJAIAAoAKQBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIABBoARqIgQhBUEAIQIDQAJAIAAoArQBIAIiBkEMbGooAgAoAhAiAkUNAAJAAkAgAC0AsQIiBw0AIAAvAbICRQ0BCyACLQAEIAdHDQELIAJBACACLQAEa0EMbGpBZGopAwAgACkCqAJSDQAgABCBAQJAIAAtAKcCQQFxDQACQCAALQCxAkExTw0AIAAvAbICQf+BAnFBg4ACRw0AIAQgBiAAKALAAUHwsX9qEMkCDAELQQAhBwNAIAUgBiAALwGyAiAHEMsCIgJFDQEgAiEHIAAgAi8BACACLwEWEIMCRQ0ACwsgACAGEP4BCyAGQQFqIgYhAiAGIANHDQALCyAAEIQBCwvPAQEEfwJAIAAtAAYiAkEEcQ0AAkAgAkEIcQ0AIAEQkwQhAiAAQcUAIAEQlAQgAhBOCwJAIAAoAKQBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoArQBIQRBACECA0ACQCAEIAIiAkEMbGooAgAgAUcNACAAQaAEaiACEMoCIABBvAJqQn83AgAgAEG0AmpCfzcCACAAQawCakJ/NwIAIABCfzcCpAIgACACEP4BDAILIAJBAWoiBSECIAUgA0cNAAsLIAAQhAELC+EBAQZ/IwBBEGsiASQAIAAgAC0ABkEEcjoABhCbBCAAIAAtAAZB+wFxOgAGAkAgACgApAFBPGooAgAiAkEISQ0AIABBpAFqIQMgAkEDdiICQQEgAkEBSxshBEEAIQIDQCAAKACkASIFKAI4IQYgASADKAIANgIMIAFBDGogAiICEHwgBSAGaiACQQN0aiIGKAIAEJoEIQUgACgCtAEgAkEMbGogBTYCAAJAIAYoAgBB7fLZjAFHDQAgBSAFLQAMQQFyOgAMCyACQQFqIgUhAiAFIARHDQALCxCcBCABQRBqJAALIAAgACAALQAGQQRyOgAGEJsEIAAgAC0ABkH7AXE6AAYLEwBBAEEAKAK83QEgAHI2ArzdAQsWAEEAQQAoArzdASAAQX9zcTYCvN0BCwkAQQAoArzdAQsbAQF/IAAgASAAIAFBABCMAhAhIgIQjAIaIAIL7AMBB38jAEEQayIDJABBACEEAkAgAkUNACACQSI6AAAgAkEBaiEECyAEIQUCQAJAIAENACAFIQZBASEHDAELQQAhAkEBIQQgBSEFA0AgAyAAIAIiCGosAAAiCToADyAFIgYhAiAEIgchBEEBIQUCQAJAAkACQAJAAkACQCAJQXdqDhoDAQQEAgQEBAQEBAQEBAQEBAQEBAQEBAQEBgALIAlB3ABHDQMMBAsgA0HuADoADwwDCyADQfIAOgAPDAILIANB9AA6AA8MAQsCQAJAIAlBIEgNACAHQQFqIQQCQCAGDQBBACECDAILIAYgCToAACAGQQFqIQIMAQsgB0EGaiEEAkACQCAGDQBBACECDAELIAZB3OrBgQM2AAAgBkEEaiADQQ9qQQEQ/gQgBkEGaiECCyAEIQRBACEFDAILIAQhBEEAIQUMAQsgBiECIAchBEEBIQULIAQhBCACIQICQAJAIAUNACACIQUgBCECDAELIARBAmohBAJAAkAgAg0AQQAhBQwBCyACQdwAOgAAIAIgAy0ADzoAASACQQJqIQULIAQhAgsgBSIFIQYgAiIEIQcgCEEBaiIJIQIgBCEEIAUhBSAJIAFHDQALCyAHIQICQCAGIgRFDQAgBEEiOwAACyADQRBqJAAgAkECagu9AwIFfwF+IwBBMGsiBSQAAkAgAiADai0AAA0AIAVBADoAKiAFQQA7ASggBSADNgIkIAUgAjYCICAFIAI2AhwgBSABNgIYIAVBEGogBUEYahCOAgJAIAUtACoNACAFKAIgIQEgBSgCJCEGA0AgAiEHIAEhAgJAAkAgBiIDDQAgBUH//wM7ASggAiECIAMhA0F/IQEMAQsgBSACQQFqIgE2AiAgBSADQX9qIgM2AiQgBSACLAAAIgY7ASggASECIAMhAyAGIQELIAMhBiACIQgCQAJAIAEiCUF3aiIBQRdLDQAgByECQQEhA0EBIAF0QZOAgARxDQELIAkhAkEAIQMLIAghASAGIQYgAiIIIQIgAw0ACyAIQX9GDQAgBUEBOgAqCwJAAkAgBS0AKkUNAAJAIAQNAEIAIQoMAgsCQCAFLgEoIgJBf0cNACAFQQhqIAUoAhhBig1BABDzAkIAIQoMAgsgBSACNgIAIAUgBSgCHEF/cyAFKAIgajYCBCAFQQhqIAUoAhhBszUgBRDzAkIAIQoMAQsgBSkDECEKCyAAIAo3AwAgBUEwaiQADwtBzcsAQas6QcwCQcwqEIAFAAu+EgMJfwF+AXwjAEGAAWsiAiQAAkACQCABLQASRQ0AIABCADcDAAwBCyABKAIMIQMDQCAFIQQCQAJAIAMiBQ0AIAFB//8DOwEQIAUhBUF/IQYMAQsgASAFQX9qIgU2AgwgASABKAIIIgZBAWo2AgggASAGLAAAIgY7ARAgBSEFIAYhBgsgBSEDAkACQCAGIgdBd2oiCEEXSw0AIAQhBUEBIQZBASAIdEGTgIAEcQ0BCyAHIQVBACEGCyADIQMgBSIEIQUgBg0ACwJAAkACQAJAAkACQAJAIARBIkYNAAJAIARB2wBGDQAgBEH7AEcNAgJAIAEoAgAiCUEAEJABIgoNACAAQgA3AwAMCQsgAkH4AGogCUEIIAoQ9wIgAS0AEkH/AXEhCANAIAUhBkF/IQUCQCAIDQACQCABKAIMIgUNACABQf//AzsBEEF/IQUMAQsgASAFQX9qNgIMIAEgASgCCCIFQQFqNgIIIAEgBSwAACIFOwEQIAUhBQsCQAJAIAUiBEF3aiIDQRdLDQAgBiEFQQEhBkEBIAN0QZOAgARxDQELIAQhBUEAIQYLIAUiAyEFIAYNAAsCQCADQX9GDQAgA0H9AEYNBCABIAEoAghBf2o2AgggASABKAIMQQFqNgIMCyACIAIpA3g3A0AgCSACQcAAahCOAQJAA0AgAS0AEiEIA0AgBSEGAkACQCAIQf8BcUUNAEF/IQUMAQsCQCABKAIMIgUNACABQf//AzsBEEF/IQUMAQsgASAFQX9qNgIMIAEgASgCCCIFQQFqNgIIIAEgBSwAACIFOwEQIAUhBQsCQAJAIAUiBEF3aiIDQRdLDQAgBiEFQQEhBkEBIAN0QZOAgARxDQELIAQhBUEAIQYLIAUiAyEFIAYNAAsgA0EiRw0BIAJB8ABqIAEQjwICQAJAIAEtABJFDQBBBCEFDAELIAEoAgwhAwNAIAUhBAJAAkAgAyIFDQAgAUH//wM7ARAgBSEFQX8hBgwBCyABIAVBf2oiBTYCDCABIAEoAggiBkEBajYCCCABIAYsAAAiBjsBECAFIQUgBiEGCyAFIQMCQAJAIAYiB0F3aiIIQRdLDQAgBCEFQQEhBkEBIAh0QZOAgARxDQELIAchBUEAIQYLIAMhAyAFIgQhBSAGDQALQQQhBSAEQTpHDQAgAiACKQNwNwM4IAkgAkE4ahCOASACQegAaiABEI4CAkAgAS0AEg0AIAIgAikDaDcDMCAJIAJBMGoQjgEgAiACKQNwNwMoIAIgAikDaDcDICAJIAogAkEoaiACQSBqEJgCIAIgAikDaDcDGCAJIAJBGGoQjwELIAIgAikDcDcDECAJIAJBEGoQjwFBBCEFAkAgAS0AEg0AIAEoAgwhAwNAIAUhBAJAAkAgAyIFDQAgAUH//wM7ARAgBSEFQX8hBgwBCyABIAVBf2oiBTYCDCABIAEoAggiBkEBajYCCCABIAYsAAAiBjsBECAFIQUgBiEGCyAFIQMCQAJAIAYiB0F3aiIIQRdLDQAgBCEFQQEhBkEBIAh0QZOAgARxDQELIAchBUEAIQYLIAMhAyAFIgQhBSAGDQALQQNBAkEEIARB/QBGGyAEQSxGGyEFCyAFIQULIAUiBUEDRg0ACwJAIAVBfmoOAwAKAQoLIAIgAikDeDcDACAJIAIQjwEgAikDeCELDAgLIAIgAikDeDcDCCAJIAJBCGoQjwEgAUEBOgASQgAhCwwHCwJAIAEoAgAiB0EAEJIBIgkNACAAQgA3AwAMCAsgAkH4AGogB0EIIAkQ9wIgAS0AEkH/AXEhCANAIAUhBkF/IQUCQCAIDQACQCABKAIMIgUNACABQf//AzsBEEF/IQUMAQsgASAFQX9qNgIMIAEgASgCCCIFQQFqNgIIIAEgBSwAACIFOwEQIAUhBQsCQAJAIAUiBEF3aiIDQRdLDQAgBiEFQQEhBkEBIAN0QZOAgARxDQELIAQhBUEAIQYLIAUiAyEFIAYNAAsCQCADQX9GDQAgA0HdAEYNBCABIAEoAghBf2o2AgggASABKAIMQQFqNgIMCyACIAIpA3g3A2AgByACQeAAahCOAQNAIAJB8ABqIAEQjgJBBCEFAkAgAS0AEg0AIAIgAikDcDcDWCAHIAkgAkHYAGoQuAIgAS0AEiEIA0AgBSEGAkACQCAIQf8BcUUNAEF/IQUMAQsCQCABKAIMIgUNACABQf//AzsBEEF/IQUMAQsgASAFQX9qNgIMIAEgASgCCCIFQQFqNgIIIAEgBSwAACIFOwEQIAUhBQsCQAJAIAUiBEF3aiIDQRdLDQAgBiEFQQEhBkEBIAN0QZOAgARxDQELIAQhBUEAIQYLIAUiAyEFIAYNAAtBA0ECQQQgA0HdAEYbIANBLEYbIQULIAUiBUEDRg0ACwJAAkAgBUF+ag4DAAkBCQsgAiACKQN4NwNIIAcgAkHIAGoQjwEgAikDeCELDAYLIAIgAikDeDcDUCAHIAJB0ABqEI8BIAFBAToAEkIAIQsMBQsgACABEI8CDAYLAkACQAJAAkAgAS8BECIFQZp/ag4PAgMDAwMDAwMAAwMDAwMBAwsCQCABKAIMIgZBA0kNACABKAIIIgNBoCNBAxC3BQ0AIAEgBkF9ajYCDCABIANBA2o2AgggAEEAKQPIbTcDAAwJCyAFQZp/ag4PAQICAgICAgICAgICAgIAAgsCQCABKAIMIgZBA0kNACABKAIIIgNBvClBAxC3BQ0AIAEgBkF9ajYCDCABIANBA2o2AgggAEEAKQOobTcDAAwICyAFQeYARw0BCyABKAIMIgVBBEkNACABKAIIIgYoAABB4djNqwZHDQAgASAFQXxqNgIMIAEgBkEEajYCCCAAQQApA7BtNwMADAYLAkACQCAEQS1GDQAgBEFQakEJSw0BCyABKAIIQX9qIAJB+ABqENwFIQwCQCACKAJ4IgUgASgCCCIGQX9qRw0AIAFBAToAEiAAQgA3AwAMBwsgASgCDCAGIAVraiIGQX9MDQMgASAFNgIIIAEgBjYCDCAAIAwQ9AIMBgsgAUEBOgASIABCADcDAAwFCyACKQN4IQsMAwsgAikDeCELDAELQc3KAEGrOkG8AkHzKRCABQALIAAgCzcDAAwBCyAAIAs3AwALIAJBgAFqJAALfAEDfyABKAIMIQIgASgCCCEDAkACQAJAIAFBABCUAiIEQQFqDgIAAQILIAFBAToAEiAAQgA3AwAPCyAAQQAQ3QIPCyABIAI2AgwgASADNgIIAkAgASgCACAEEJQBIgJFDQAgASACQQZqEJQCGgsgACABKAIAQQggAhD3AguWCAEIfyMAQeAAayICJAAgACgCACEDIAIgASkDADcDUAJAAkAgAyACQdAAahCNAUUNACAAQQE2AhQMAQsgACgCFA0AAkACQCAAKAIQIgQNAEEAIQQMAQsgBCAAKAIMaiEECyAEIQQgAiABKQMANwNIAkACQAJAAkAgAyACQcgAahCBAw4NAQADAwMDAQMDAgMDAQMLIAEoAgRBj4DA/wdxDQACQCABKAIAIgVBvn9qQQJJDQAgBUECRw0BCyABQQApA8htNwMACyACIAEpAwA3AzggAkHYAGogAyACQThqEOECIAEgAikDWDcDACACIAEpAwA3AzAgAyACQTBqIAJB2ABqENwCIQECQCAERQ0AIAQgASACKAJYEJ0FGgsgACAAKAIMIAIoAlhqNgIMDAILIAIgASkDADcDQCAAIAMgAkHAAGogAkHYAGoQ3AIgAigCWCAEEIwCIAAoAgxqQX9qNgIMDAELIAIgASkDADcDKCADIAJBKGoQjgEgAiABKQMANwMgAkACQAJAIAMgAkEgahCAA0UNACACIAEpAwA3AxAgAyACQRBqEP8CIQYCQCAAKAIQRQ0AIAAoAhAgACgCDGpB2wA6AAALIAAgACgCDEEBajYCDCAAIAAoAgggACgCBGo2AgggAEEMaiEHAkAgBi8BCEUNAEEAIQQDQCAEIQgCQCAAKAIIRQ0AAkAgACgCECIERQ0AIAQgBygCAGpBCjoAAAsgACAAKAIMQQFqNgIMIAAoAghBf2ohCQJAIAAoAhBFDQBBACEEIAlFDQADQCAAKAIQIAAoAgwgBCIEampBIDoAACAEQQFqIgUhBCAFIAlHDQALCyAHIAcoAgAgCWo2AgALIAIgBigCDCAIQQN0aikDADcDCCAAIAJBCGoQkAIgACgCFA0BAkAgCCAGLwEIQX9qRg0AAkAgACgCEEUNACAAKAIQIAAoAgxqQSw6AAALIAcgBygCAEEBajYCAAsgCEEBaiIFIQQgBSAGLwEISQ0ACwsgACAAKAIIIAAoAgRrNgIIAkAgBi8BCEUNACAAEJECCyAHIQVB3QAhCSAHIQQgACgCEA0BDAILIAIgASkDADcDGCADIAJBGGoQrQIhBAJAIAAoAhBFDQAgACgCECAAKAIMakH7ADoAAAsgACAAKAIMQQFqIgU2AgwCQCAERQ0AIAAgACgCCCAAKAIEajYCCCADIAQgAEETEJUCGiAAIAAoAgggACgCBGs2AgggBSAAKAIMIgRGDQAgACAEQX9qNgIMIAAQkQILIABBDGoiBCEFQf0AIQkgBCEEIAAoAhBFDQELIAAoAhAgACgCDGogCToAACAFIQQLIAQiACAAKAIAQQFqNgIAIAIgASkDADcDACADIAIQjwELIAJB4ABqJAALigEBA38CQCAAKAIIRQ0AAkAgACgCEEUNACAAKAIQIAAoAgxqQQo6AAALIAAgACgCDEEBajYCDCAAKAIIQX9qIQECQCAAKAIQRQ0AIAFFDQBBACECA0AgACgCECAAKAIMIAIiAmpqQSA6AAAgAkEBaiIDIQIgAyABRw0ACwsgACAAKAIMIAFqNgIMCwuEAwEDfyMAQSBrIgQkACAEIAIpAwA3AxgCQCAAIARBGGoQ2gJFDQAgBCADKQMANwMQAkAgACAEQRBqEIEDIgBBC0sNAEEBIAB0QYEScQ0BCwJAIAEoAghFDQACQCABKAIQIgBFDQAgACABKAIMakEKOgAACyABIAEoAgxBAWo2AgwgASgCCEF/aiEFAkAgASgCEEUNACAFRQ0AQQAhAANAIAEoAhAgASgCDCAAIgBqakEgOgAAIABBAWoiBiEAIAYgBUcNAAsLIAEgASgCDCAFajYCDAsgBCACKQMANwMIIAEgBEEIahCQAgJAIAEoAhBFDQAgASgCECABKAIMakE6OgAACyABIAEoAgxBAWo2AgwCQCABKAIIRQ0AAkAgASgCEEUNACABKAIQIAEoAgxqQSA6AAALIAEgASgCDEEBajYCDAsgBCADKQMANwMAIAEgBBCQAgJAIAEoAhBFDQAgASgCECABKAIMakEsOgAACyABIAEoAgxBAWo2AgwLIARBIGokAAvRAgIDfwF+IwBBwABrIgUkACAFIAIpAwAiCDcDICAFIAg3AxggBUIANwI0IAUgAzYCLCAFIAE2AiggBUEANgI8IAUgA0EARyIGNgIwIAVBKGogBUEYahCQAgJAAkACQAJAIAUoAjwNACAFKAI0IgdBfkcNAQsCQCAERQ0AIAVBKGogAUHExABBABDtAgsgAEIANwMADAELIAAgAUEIIAEgBxCUASIEEPcCIAUgACkDADcDECABIAVBEGoQjgECQCAERQ0AIAUgAikDACIINwMgIAUgCDcDCCAFQQA2AjwgBSAEQQZqNgI4IAVBADYCNCAFIAY2AjAgBSADNgIsIAUgATYCKCAFQShqIAVBCGoQkAIgBSgCPA0CIAUoAjQgBC8BBEcNAgsgBSAAKQMANwMAIAEgBRCPAQsgBUHAAGokAA8LQdYkQas6QYEEQbgIEIAFAAvMBQEIfyMAQRBrIgIkACABIQFBACEDA0AgAyEEIAEhAQJAAkAgAC0AEiIFRQ0AQX8hAwwBCwJAIAAoAgwiAw0AIABB//8DOwEQQX8hAwwBCyAAIANBf2o2AgwgACAAKAIIIgNBAWo2AgggACADLAAAIgM7ARAgAyEDCwJAAkAgAyIDQX9GDQACQAJAIANB3ABGDQAgAyEGIANBIkcNASABIQMgBCEHQQIhCAwDCwJAAkAgBUUNAEF/IQMMAQsCQCAAKAIMIgMNACAAQf//AzsBEEF/IQMMAQsgACADQX9qNgIMIAAgACgCCCIDQQFqNgIIIAAgAywAACIDOwEQIAMhAwsgAyIJIQYgASEDIAQhB0EBIQgCQAJAAkACQAJAAkAgCUFeag5UBggICAgICAgICAgICAYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAYICAgICAIICAgDCAgICAgICAUICAgBCAAECAtBCSEGDAULQQ0hBgwEC0EIIQYMAwtBDCEGDAILQQAhAwJAA0AgAyEDQX8hBwJAIAUNAAJAIAAoAgwiBw0AIABB//8DOwEQQX8hBwwBCyAAIAdBf2o2AgwgACAAKAIIIgdBAWo2AgggACAHLAAAIgc7ARAgByEHC0F/IQggByIHQX9GDQEgAkELaiADaiAHOgAAIANBAWoiByEDIAdBBEcNAAsgAkEAOgAPIAJBCWogAkELahD/BCEDIAItAAlBCHQgAi0ACnJBfyADQQJGGyEICyAIIgMhBiADQX9GDQIMAQtBCiEGCyAGIQdBACEDAkAgAUUNACABIAc6AAAgAUEBaiEDCyADIQMgBEEBaiEHQQAhCAwBCyABIQMgBCEHQQEhCAsgAyEBIAciByEDIAgiBEUNAAtBfyEAAkAgBEECRw0AIAchAAsgAkEQaiQAIAAL2wQBB38jAEEwayIEJABBACEFIAEhAQJAA0AgBSEGAkAgASIHIAAoAKQBIgUgBSgCYGprIAUvAQ5BBHRPDQBBACEFDAILAkACQCAHQYDhAGtBDG1BI0sNAAJAAkAgBygCCCIFLwEAIgENACAFIQgMAQsgASEBIAUhBQNAIAUhBSABIQECQCADRQ0AIARBKGogAUH//wNxEN0CIAUvAQIiASEJAkACQCABQSNLDQACQCAAIAkQlgIiCUGA4QBrQQxtQSNLDQAgBEEANgIkIAQgAUHgAGo2AiAMAgsgBEEgaiAAQQggCRD3AgwBCyABQc+GA00NBSAEIAk2AiAgBEEDNgIkCyAEIAQpAyg3AwggBCAEKQMgNwMAIAAgAiAEQQhqIAQgAxEGAAsgBS8BBCIJIQEgBUEEaiIIIQUgCCEIIAkNAAsLIAggBygCCGtBAnUhBQwDCwJAAkAgBw0AQQAhBQwBCyAHLQADQQ9xIQULAkACQCAFQXxqDgYBAAAAAAEAC0Hg1QBB6DhB0QBB/xoQgAUACyAHLwEIIQoCQCADRQ0AIApFDQAgCkEBdCEIIAcoAgwhBUEAIQEDQCAEIAUgASIBQQN0IglqKQMANwMYIAQgBSAJQQhyaikDADcDECAAIAIgBEEYaiAEQRBqIAMRBgAgAUECaiIJIQEgCSAISQ0ACwsgCiEFAkAgBw0AIAUhBQwDCyAFIQUgBygCAEGAgID4AHFBgICAyABHDQIgBiAKaiEFIAcoAgQhAQwBCwtB6sQAQeg4QT1B0SkQgAUACyAEQTBqJAAgBiAFaguvAgEEfwJAAkACQAJAAkAgAUEZSw0AAkBBrv3+CiABdkEBcSICDQAgAUHA3ABqLQAAIQMCQCAAKAK4AQ0AIABBIBCKASEEIABBCDoARCAAIAQ2ArgBIAQNAEEAIQMMAQsgA0F/aiIEQQhPDQMgACgCuAEgBEECdGooAgAiBSEDIAUNAAJAIABBCUEQEIkBIgMNAEEAIQMMAQsgACgCuAEgBEECdGogAzYCACABQSRPDQQgA0GA4QAgAUEMbGoiAEEAIAAoAggbNgIEIAMhAwsgAyEAIAJFDQELIAFBJE8NA0GA4QAgAUEMbGoiAUEAIAEoAggbIQALIAAPC0GkxABB6DhBjwJBtRIQgAUAC0GOwQBB6DhB8gFBuR8QgAUAC0GOwQBB6DhB8gFBuR8QgAUACw4AIAAgAiABQRQQlQIaC7cCAQN/IwBBIGsiBCQAIAQgAikDADcDEAJAAkACQCAAIAEgBEEQahCZAiIFRQ0AIAUgAykDADcDAAwBCyAEIAIpAwA3AwgCQCAAIARBCGoQ2gINACAEIAIpAwA3AwAgBEEYaiAAQcIAIAQQ8AIMAQsgAS8BCiIFIAEvAQgiBkkNAQJAIAUgBkcNACAAIAVBCmxBA3YiBUEEIAVBBEsbIgZBBHQQigEiBUUNASABIAY7AQoCQCABLwEIIgZFDQAgBSABKAIMIAZBBHQQnQUaCyABIAU2AgwgACgC0AEgBRCLAQsgASgCDCABLwEIQQR0aiACKQMANwMAIAEoAgwgAS8BCEEEdGpBCGogAykDADcDACABIAEvAQhBAWo7AQgLIARBIGokAA8LQeokQeg4QZ0BQboREIAFAAvsAgIJfwF+IwBBIGsiAyQAIAMgAikDADcDEEEAIQQCQCAAIANBEGoQ2gJFDQAgAS8BCCIFQQBHIQQgBUEBdCEGIAEoAgwhBwJAAkAgBQ0AIAQhCAwBCyACKAIAIQkgAikDACEMIAQhAUEAIQoDQCABIQgCQCAHIAoiBEEDdGoiASgAACAJRw0AIAEpAwAgDFINACAIIQggByAEQQN0QQhyaiELDAILIARBAmoiCiAGSSIEIQEgCiEKIAQhCCAEDQALCyALIQQgCEEBcQ0AIAMgAikDADcDCCAAIANBCGogA0EcahDcAiEIAkACQCAFDQBBACEEDAELQQAhBANAIAMgByAEIgRBA3RqKQMANwMAIAAgAyADQRhqENwCIQECQCADKAIYIAMoAhwiCkcNACAIIAEgChC3BQ0AIAcgBEEDdEEIcmohBAwCCyAEQQJqIgEhBCABIAZJDQALQQAhBAsgBCEECyADQSBqJAAgBAtwAQF/AkACQCABRQ0AIAFBgOEAa0EMbUEkSQ0AQQAhAiABIAAoAKQBIgAgACgCYGprIAAvAQ5BBHRJDQFBASECAkAgAS0AA0EPcUF8ag4GAgAAAAACAAtB4NUAQeg4QfYAQZseEIAFAAtBACECCyACC1wBAn8jAEEQayIEJAAgAi8BCCEFIAQgAjYCCCAEIAM6AAQgBCAFNgIAIAAgAUEAQQAQlQIhAwJAIAAgAiAEKAIAIAMQnAINACAAIAEgBEEVEJUCGgsgBEEQaiQAC+kCAQZ/IwBBEGsiBCQAAkACQCADQYE8SA0AIARBCGogAEEPEPICQXwhAwwBCwJAQQAgAS8BCCIFayADIAUgA2oiBkEASBsiA0UNAAJAIAZBACAGQQBKGyIGQYE8SQ0AIARBCGogAEEPEPICQXohAwwCCwJAIAYgAS8BCk0NAAJAIAAgBkEKbEEDdiIHQQQgB0EESxsiCEEDdBCKASIHDQBBeyEDDAMLAkAgASgCDCIJRQ0AIAcgCSABLwEIQQN0EJ0FGgsgASAIOwEKIAEgBzYCDCAAKALQASAHEIsBCyABLwEIIAUgAiAFIAJJGyIAayECAkACQCADQX9KDQAgASgCDCAAQQN0aiIAIAAgA0EDdGsgAiADakEDdBCeBRoMAQsgASgCDCAAQQN0IgBqIgUgA0EDdCIDaiAFIAJBA3QQngUaIAEoAgwgAGpBACADEJ8FGgsgASAGOwEIC0EAIQMLIARBEGokACADCzUBAn8gASgCCCgCDCEEIAEgASgCACIFQQFqNgIAIAQgBUEDdGogAiADIAEtAAQbKQMANwMAC+ACAQZ/IAEvAQohBAJAAkAgAS8BCCIFDQBBACEGDAELIAEoAgwiByAEQQN0aiEIQQAhBgNAAkAgCCAGIgZBAXRqLwEAIAJHDQAgByAGQQN0aiEGDAILIAZBAWoiCSEGIAkgBUcNAAtBACEGCwJAIAYiBkUNACAGIAMpAwA3AwAPCwJAIAQgBUkNAAJAAkAgBCAFRw0AIAAgBEEKbEEDdiIGQQQgBkEESxsiCUEKbBCKASIGRQ0BIAEvAQohBSABIAk7AQoCQCABLwEIIghFDQAgBiABKAIMIgQgCEEDdBCdBSAJQQN0aiAEIAVBA3RqIAEvAQhBAXQQnQUaCyABIAY2AgwgACgC0AEgBhCLAQsgASgCDCABLwEIQQN0aiADKQMANwMAIAEoAgwgAS8BCkEDdGogAS8BCEEBdGogAjsBACABIAEvAQhBAWo7AQgLDwtB6iRB6DhBuAFBpxEQgAUAC4ABAQJ/IwBBEGsiAyQAIAMgAikDADcDCAJAAkAgACABIANBCGoQmQIiAg0AQX8hAQwBCyABIAEvAQgiAEF/ajsBCAJAIAAgAkF4aiIEIAEoAgxrQQN1QQF2QX9zaiIBRQ0AIAQgAkEIaiABQQR0EJ4FGgtBACEBCyADQRBqJAAgAQuJAQIEfwF+AkACQCACLwEIIgQNAEEAIQIMAQsgAigCDCIFIAIvAQpBA3RqIQZBACECA0ACQCAGIAIiAkEBdGovAQAgA0cNACAFIAJBA3RqIQIMAgsgAkEBaiIHIQIgByAERw0AC0EAIQILAkACQCACIgINAEIAIQgMAQsgAikDACEICyAAIAg3AwALdQECfwJAIAJFDQAgAkH//wE2AgALAkAgASgCBCIDQYCAwP8HcUUNAEEADwtBACEEAkAgA0EPcUEGRw0AIAEoAgAhAQJAIAJFDQAgAiABQf//AXE2AgALIAAoAKQBIgIgAigCYGogAUENdkH8/x9xaiEECyAEC5cBAQR/AkAgACgApAEiAEE8aigCAEEDdiABSw0AQQAPC0EAIQICQCAALwEOIgNFDQAgACAAKAI4aiABQQN0aigCACEBIAAgACgCYGohBEEAIQICQANAIAQgAiIFQQR0aiICIAAgAigCBCIAIAFGGyECIAAgAUYNASACIQAgBUEBaiIFIQIgBSADRw0AC0EADwsgAiECCyACC9oFAgV/An4jAEEQayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EgBUGAgMD/B3EbIgVBfWoOBwMCAgACAgECCwJAIAIoAgQiBkGAgMD/B3ENACAGQQ9xQQJHDQAgAigCACICQYCAAk8NBSADKAIAIQMgAEEGNgIEIAAgA0GAgH5xIAJyNgIADAQLIAVBfWoOBwIBAQEBAQABCyACKQMAIQkgAykDACEKAkAgAUEHQRgQiQEiAw0AIABCADcDAAwDCyADIAo3AxAgAyAJNwMIIAAgAUEIIAMQ9wIMAgsgACADKQMANwMADAELIAMoAgAhBkEAIQUCQCADKAIEQY+AwP8HcUEDRw0AQQAhBSAGQbD5fGoiB0EASA0AIAdBAC8BwMsBTg0DQQAhBUHA5QAgB0EDdGoiBy0AA0EBcUUNACAHIQUgBy0AAg0ECwJAIAUiBUUNACAFKAIEIQMgBCACKQMANwMIIAAgASAEQQhqIAMRAQAMAQsCQCAGQf//A0sNAAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EiBxsiCA4JAAAAAAACAAIBAgsgBw0GIAIoAgAiA0GAgICAAU8NByAFQfD/P3ENCCAAIAMgCEEcdHI2AgAgACAGQQR0QQVyNgIEDAILIAVB8P8/cQ0IIAAgAigCADYCACAAIAZBBHRBCnI2AgQMAQsgAikDACEJIAMpAwAhCgJAIAFBB0EYEIkBIgMNACAAQgA3AwAMAQsgAyAKNwMQIAMgCTcDCCAAIAFBCCADEPcCCyAEQRBqJAAPC0HiLEHoOEG6A0G6LxCABQALQfsTQeg4QaYDQYw2EIAFAAtB/coAQeg4QakDQYw2EIAFAAtBkh1B6DhB1QNBui8QgAUAC0GizABB6DhB1gNBui8QgAUAC0HaywBB6DhB1wNBui8QgAUAC0HaywBB6DhB3QNBui8QgAUACy8AAkAgA0GAgARJDQBB5ydB6DhB5gNBpysQgAUACyAAIAEgA0EEdEEJciACEPcCCzIBAX8jAEEQayIEJAAgBCABKQMANwMIIAAgBEEIaiACIANBABCmAiEBIARBEGokACABC6kDAQN/IwBBMGsiBSQAIANBADYCACACQgA3AwACQAJAIARBAkwNAEF/IQYMAQsgASgCACEHAkACQAJAAkACQAJAQRAgASgCBCIGQQ9xIAZBgIDA/wdxG0F9ag4IAAUBBQUEAwIFCyACQgA3AwAgByEGDAULIAIgB0Ecdq1CIIYgB0H/////AHGthDcDACAGQQR2Qf//A3EhBgwECyACIAetQoCAgICAAYQ3AwAgBkEEdkH//wNxIQYMAwsgAyAHNgIAIAZBBHZB//8DcSEGDAILAkAgBw0AQX8hBgwCC0F/IQYgBygCAEGAgID4AHFBgICAOEcNASAFIAcpAxA3AyAgACAFQSBqIAIgAyAEQQFqEKYCIQMgAiAHKQMINwMAIAMhBgwBCyAFIAEpAwA3AxhBfyEGIAVBGGoQggMNACAFIAEpAwA3AxAgBUEoaiAAIAVBEGpB2AAQpwICQAJAIAUpAyhQRQ0AQX8hAgwBCyAFIAUpAyg3AwggACAFQQhqIAIgAyAEQQFqEKYCIQMgAiABKQMANwMAIAMhAgsgAiEGCyAFQTBqJAAgBguqAgICfwF+IwBBMGsiBCQAIARBIGogAxDdAiABIAQpAyA3AzAgBCACKQMAIgY3AxggBCAGNwMoIAEgBEEYakEAEKoCIQMgAUIANwMwIAQgBCkDIDcDECAEQShqIAEgAyAEQRBqELACQQAhAwJAAkACQCAEKAIsQY+AwP8HcUEDRw0AQQAhAyAEKAIoQbD5fGoiBUEASA0AIAVBAC8BwMsBTg0BQQAhA0HA5QAgBUEDdGoiBS0AA0EBcUUNACAFIQMgBS0AAg0CCwJAAkAgAyIDRQ0AIAMoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCyAAIAQpAyg3AwALIARBMGokAA8LQfsTQeg4QaYDQYw2EIAFAAtB/coAQeg4QakDQYw2EIAFAAu/AgEHfyAAKAK0ASABQQxsaigCBCICIQMCQCACDQACQCAAQQlBEBCJASIEDQBBAA8LQQAhAwJAIAAoAKQBIgJBPGooAgBBA3YgAU0NAEEAIQMgAi8BDiIFRQ0AIAIgAigCOGogAUEDdGooAgAhAyACIAIoAmBqIQZBACEHAkADQCAGIAciCEEEdGoiByACIAcoAgQiAiADRhshByACIANGDQEgByECIAhBAWoiCCEHIAggBUcNAAtBACEDDAELIAchAwsgBCADNgIEAkAgACgApAFBPGooAgBBCEkNACAAKAK0ASICIAFBDGxqKAIAKAIIIQdBACEDA0ACQCACIAMiA0EMbGoiASgCACgCCCAHRw0AIAEgBDYCBAsgA0EBaiIBIQMgASAAKACkAUE8aigCAEEDdkkNAAsLIAQhAwsgAwtjAQF/IwBBEGsiAiQAIAIgASkDADcDCAJAIAAgAkEIakEBEKoCIgFFDQACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0GH0wBB6DhB2QVBlQsQgAUACyAAQgA3AzAgAkEQaiQAIAEL9AYCBH8BfiMAQdAAayIDJAAgAyABKQMANwM4AkACQAJAAkAgA0E4ahCDA0UNACADIAEpAwAiBzcDKCADIAc3A0BB9SVB/SUgAkEBcRshAiAAIANBKGoQzwIQiAUhAQJAAkAgACkAMEIAUg0AIAMgAjYCACADIAE2AgQgA0HIAGogAEHwFiADEO0CDAELIAMgAEEwaikDADcDICAAIANBIGoQzwIhBCADIAI2AhAgAyAENgIUIAMgATYCGCADQcgAaiAAQYAXIANBEGoQ7QILIAEQIkEAIQEMAQsCQAJAAkACQEEQIAEoAgQiBEEPcSAEQYCAwP8HcRtBfmoOBwECAgIAAgMCCyAAKACkASIEIAQoAmBqIAEoAgBBDXZB/P8fcWovAQIiAUGAoAJPDQRBhwIgAUEMdiIBdkEBcUUNBCAAIAFBAnRB6NwAaigCACACEKsCIQEMAwsgACgCtAEgASgCACIFQQxsaigCCCEEAkAgAkECcUUNACAEIQEMAwsgBCEBIAQNAgJAIAAgBRCoAiIBDQBBACEBDAMLAkAgAkEBcQ0AIAEhAQwDCyAAIAEQkAEhASAAKAK0ASAFQQxsaiABNgIIIAEhAQwCCyADIAEpAwA3AzACQCAAIANBMGoQgQMiBEECRw0AIAEoAgQNAAJAIAEoAgBBoH9qIgZBI0sNACAAIAYgAkEEchCrAiEFCyAFIQEgBkEkSQ0CC0EAIQECQCAEQQtKDQAgBEHa3ABqLQAAIQELIAEiAUUNAyAAIAEgAhCrAiEBDAELAkACQCABKAIAIgQNAEEAIQUMAQsgBC0AA0EPcSEFCyAEIQECQAJAAkACQAJAAkACQCAFQX1qDggABwUCAwQHAQQLIARBBGohAUEEIQQMBQsgBEEYaiEBQRQhBAwECyAAQQggAhCrAiEBDAQLIABBECACEKsCIQEMAwtB6DhBxQVBiDMQ+wQACyAEQQhqIQFBBiEECyAEIQUgASIGKAIAIgQhAQJAIAQNAEEAIQEgAkEBcUUNACAGIAAgACAFEJYCEJABIgQ2AgAgBCEBIAQNAEEAIQEMAQsgASEEAkAgAkECcUUNACAEIQEMAQsgBCEBIAQNACAAIAUQlgIhAQsgA0HQAGokACABDwtB6DhBhAVBiDMQ+wQAC0GM0ABB6DhBpQVBiDMQgAUAC68DAQF/IwBB4ABrIgMkAAJAAkAgAkEGcUECRg0AIAAgARCWAiEBAkAgAkEBcQ0AIAEhAgwCCwJAAkAgAkEEcUUNAAJAIAFBgOEAa0EMbUEjSw0AQc0SEIgFIQICQCAAKQAwQgBSDQAgA0H1JTYCMCADIAI2AjQgA0HYAGogAEHwFiADQTBqEO0CIAIhAgwDCyADIABBMGopAwA3A1AgACADQdAAahDPAiEBIANB9SU2AkAgAyABNgJEIAMgAjYCSCADQdgAaiAAQYAXIANBwABqEO0CIAIhAgwCCwJAAkAgAQ0AQQAhAAwBCyABLQADQQ9xIQALIAEhAgJAIABBfGoOBgQAAAAABAALQZTTAEHoOEHABEHTHxCABQALQaQpEIgFIQICQAJAIAApADBCAFINACADQfUlNgIAIAMgAjYCBCADQdgAaiAAQfAWIAMQ7QIMAQsgAyAAQTBqKQMANwMoIAAgA0EoahDPAiEBIANB9SU2AhAgAyABNgIUIAMgAjYCGCADQdgAaiAAQYAXIANBEGoQ7QILIAIhAgsgAhAiC0EAIQILIANB4ABqJAAgAgs1AQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGpBABCqAiEBIABCADcDMCACQRBqJAAgAQs1AQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGpBAhCqAiEBIABCADcDMCACQRBqJAAgAQupAgECfwJAAkAgAUGA4QBrQQxtQSNLDQAgASgCBCECDAELAkACQCABIAAoAKQBIgIgAigCYGprIAIvAQ5BBHRPDQACQCAAKAK4AQ0AIABBIBCKASECIABBCDoARCAAIAI2ArgBIAINAEEAIQIMAwsgACgCuAEoAhQiAyECIAMNAiAAQQlBEBCJASICDQFBACECDAILAkACQCABDQBBACEADAELIAEtAANBD3EhAAsCQAJAIABBfGoOBgEAAAAAAQALQdLTAEHoOEHyBUGiHxCABQALIAEoAgQPCyAAKAK4ASACNgIUIAJBgOEAQagBakEAQYDhAEGwAWooAgAbNgIEIAIhAgtBACACIgBBgOEAQRhqQQBBgOEAQSBqKAIAGyAAGyIAIAAgAUYbC6IBAgF/AX4jAEEgayICJAAgAiABKQMANwMIIAJBEGogACACQQhqQTQQpwICQAJAIAIpAxBCAFINAEEAIQEgAC0ARQ0BIAJBGGogAEG5K0EAEO0CQQAhAQwBCyACIAIpAxAiAzcDGCACIAM3AwAgACACQQIQqgIhASAAQgA3AzACQCABDQAgAkEYaiAAQccrQQAQ7QILIAEhAQsgAkEgaiQAIAELwRACEH8BfiMAQcAAayIEJABBgOEAQagBakEAQYDhAEGwAWooAgAbIQUgAUGkAWohBkEAIQcgAiECAkADQCAHIQggCiEJIAwhCwJAIAIiDQ0AIAghDgwCCwJAAkACQAJAAkACQCANQYDhAGtBDG1BI0sNACAEIAMpAwA3AzAgDSEMIA0oAgBBgICA+ABxQYCAgPgARw0DAkACQANAIAwiDkUNASAOKAIIIQwCQAJAAkACQCAEKAI0IgpBgIDA/wdxDQAgCkEPcUEERw0AIAQoAjAiCkGAgH9xQYCAAUcNACAMLwEAIgdFDQEgCkH//wBxIQIgByEKIAwhDANAIAwhDAJAIAIgCkH//wNxRw0AIAwvAQIiDCEKAkAgDEEjSw0AAkAgASAKEJYCIgpBgOEAa0EMbUEjSw0AIARBADYCJCAEIAxB4ABqNgIgIA4hDEEADQgMCgsgBEEgaiABQQggChD3AiAOIQxBAA0HDAkLIAxBz4YDTQ0LIAQgCjYCICAEQQM2AiQgDiEMQQANBgwICyAMLwEEIgchCiAMQQRqIQwgBw0ADAILAAsgBCAEKQMwNwMAIAEgBCAEQTxqENwCIQIgBCgCPCACEMwFRw0BIAwvAQAiByEKIAwhDCAHRQ0AA0AgDCEMAkAgCkH//wNxEJQDIAIQywUNACAMLwECIgwhCgJAIAxBI0sNAAJAIAEgChCWAiIKQYDhAGtBDG1BI0sNACAEQQA2AiQgBCAMQeAAajYCIAwGCyAEQSBqIAFBCCAKEPcCDAULIAxBz4YDTQ0JIAQgCjYCICAEQQM2AiQMBAsgDC8BBCIHIQogDEEEaiEMIAcNAAsLIA4oAgQhDEEBDQIMBAsgBEIANwMgCyAOIQxBAA0ADAILAAsgBEIANwMgCyAEIAQpAyA3AyggCyEMIAkhCiAEQShqIQcgDSECQQEhCQwFCyANIAYoAAAiDCAMKAJgamsgDC8BDkEEdE8NAyAEIAMpAwA3AzAgCyEMIAkhCiANIQcCQAJAAkADQCAKIQ8gDCEQAkAgByIRDQBBACEOQQAhCQwCCwJAAkACQAJAAkAgESAGKAAAIgwgDCgCYGoiC2sgDC8BDkEEdE8NACALIBEvAQpBAnRqIQ4gES8BCCEKIAQoAjQiDEGAgMD/B3ENAiAMQQ9xQQRHDQIgCkEARyEMAkACQCAKDQAgECEHIA8hAiAMIQlBACEMDAELQQAhByAMIQwgDiEJAkACQCAEKAIwIgIgDi8BAEYNAANAIAdBAWoiDCAKRg0CIAwhByACIA4gDEEDdGoiCS8BAEcNAAsgDCAKSSEMIAkhCQsgDCEMIAkgC2siAkGAgAJPDQNBBiEHIAJBDXRB//8BciECIAwhCUEBIQwMAQsgECEHIA8hAiAMIApJIQlBACEMCyAMIQsgByIPIQwgAiICIQcgCUUNAyAPIQwgAiEKIAshAiARIQcMBAtB8dUAQeg4QdUCQYEdEIAFAAtBvdYAQeg4QawCQeQ3EIAFAAsgECEMIA8hBwsgByESIAwhEyAEIAQpAzA3AxAgASAEQRBqIARBPGoQ3AIhEAJAAkAgBCgCPA0AQQAhDEEAIQpBASEHIBEhDgwBCyAKQQBHIgwhB0EAIQICQAJAAkAgCg0AIBMhCiASIQcgDCECDAELA0AgByELIA4gAiICQQN0aiIPLwEAIQwgBCgCPCEHIAQgBigCADYCDCAEQQxqIAwgBEEgahCVAyEMAkAgByAEKAIgIglHDQAgDCAQIAkQtwUNACAPIAYoAAAiDCAMKAJgamsiDEGAgAJPDQhBBiEKIAxBDXRB//8BciEHIAshAkEBIQwMAwsgAkEBaiIMIApJIgkhByAMIQIgDCAKRw0ACyATIQogEiEHIAkhAgtBCSEMCyAMIQ4gByEHIAohDAJAIAJBAXFFDQAgDCEMIAchCiAOIQcgESEODAELQQAhAgJAIBEoAgRB8////wFHDQAgDCEMIAchCiACIQdBACEODAELIBEvAQJBD3EiAkECTw0FIAwhDCAHIQpBACEHIAYoAAAiDiAOKAJgaiACQQR0aiEOCyAMIQwgCiEKIAchAiAOIQcLIAwiDiEMIAoiCSEKIAchByAOIQ4gCSEJIAJFDQALCyAEIA4iDK1CIIYgCSIKrYQiFDcDKAJAIBRCAFENACAMIQwgCiEKIARBKGohByANIQJBASEJDAcLAkAgASgCuAENACABQSAQigEhByABQQg6AEQgASAHNgK4ASAHDQAgDCEMIAohCiAIIQdBACECQQAhCQwHCwJAIAEoArgBKAIUIgJFDQAgDCEMIAohCiAIIQcgAiECQQAhCQwHCwJAIAFBCUEQEIkBIgINACAMIQwgCiEKIAghB0EAIQJBACEJDAcLIAEoArgBIAI2AhQgAiAFNgIEIAwhDCAKIQogCCEHIAIhAkEAIQkMBgtBvdYAQeg4QawCQeQ3EIAFAAtBgcIAQeg4Qc8CQfA3EIAFAAtB6sQAQeg4QT1B0SkQgAUAC0HqxABB6DhBPUHRKRCABQALQbbTAEHoOEHyAkHvHBCABQALAkACQCANLQADQQ9xQXxqDgYBAAAAAAEAC0Gj0wBB6DhBswZBoS8QgAUACyAEIAMpAwA3AxgCQCABIA0gBEEYahCZAiIHRQ0AIAshDCAJIQogByEHIA0hAkEBIQkMAQsgCyEMIAkhCkEAIQcgDSgCBCECQQAhCQsgDCEMIAohCiAHIg4hByACIQIgDiEOIAlFDQALCwJAAkAgDiIMDQBCACEUDAELIAwpAwAhFAsgACAUNwMAIARBwABqJAAL7AECA38BfiMAQSBrIgMkAAJAAkAgAg0AQQAhBAwBCyADIAEpAwA3AxBBACEEIANBEGoQggMNACADIAEpAwAiBjcDCCADIAY3AxggACADQQhqQQAQqgIhBCAAQgA3AzAgAyABKQMAIgY3AwAgAyAGNwMYIAAgA0ECEKoCIQUgAEIANwMwQQAhAQJAIARFDQACQCAEIAVGDQAgBCEBDAELIAAgBBCuAiEBC0EAIQQgASIBRQ0AIAEhAQNAAkAgASIBIAJGIgRFDQAgBCEEDAILIAAgARCuAiIFIQEgBCEEIAUNAAsLIANBIGokACAEC4gBAgJ/AX4jAEEwayIEJAAgASADKQMANwMwIAQgAikDACIGNwMgIAQgBjcDKCABIARBIGpBABCqAiEFIAFCADcDMCAEIAMpAwA3AxggBEEoaiABIAUgBEEYahCwAiAEIAIpAwA3AxAgBCAEKQMoNwMIIAAgASAEQRBqIARBCGoQowIgBEEwaiQAC+sBAQJ/IwBBIGsiBCQAAkACQCADQYHgA0kNACAAQgA3AwAMAQsgBCACKQMANwMQAkAgASAEQRBqIARBHGoQ/gIiBUUNACAEKAIcIANNDQAgBCACKQMANwMAIAUgA2ohAwJAIAEgBBDaAkUNACAAIAFBCCABIANBARCVARD3AgwCCyAAIAMtAAAQ9QIMAQsgBCACKQMANwMIAkAgASAEQQhqEP8CIgFFDQAgASgCAEGAgID4AHFBgICAGEcNACABLwEIIANNDQAgACABKAIMIANBA3RqKQMANwMADAELIABCADcDAAsgBEEgaiQAC74EAgF/An4jAEGwAWsiBCQAIAQgAykDADcDkAECQAJAIARBkAFqENsCRQ0AIAQgAikDACIFNwOIASAEIAU3A6gBAkAgASAEQYgBahCAAw0AIAQgBCkDqAE3A4ABIAEgBEGAAWoQ+wINACAEIAQpA6gBNwN4IAEgBEH4AGoQ2gJFDQELIAQgAykDADcDECABIARBEGoQ+QIhAyAEIAIpAwA3AwggACABIARBCGogAxCzAgwBCyAEIAMpAwA3A3ACQCABIARB8ABqENoCRQ0AIAQgAykDACIGNwOgASAEIAIpAwAiBTcDmAEgASAGNwMwIAQgBTcDMCAEIAU3A6gBIAEgBEEwakEAEKoCIQMgAUIANwMwIAQgBCkDoAE3AyggBEGoAWogASADIARBKGoQsAIgBCAEKQOYATcDICAEIAQpA6gBNwMYIAAgASAEQSBqIARBGGoQowIMAQsgBCADKQMANwNoIARBqAFqIAEgBEHoAGoQ4QIgAyAEKQOoATcDACAEIAMpAwA3A2AgASAEQeAAahCOASAEIAMpAwAiBjcDoAEgBCACKQMAIgU3A5gBIAEgBjcDMCAEIAU3A1ggBCAFNwOoASABIARB2ABqQQAQqgIhAiABQgA3AzAgBCAEKQOgATcDUCAEQagBaiABIAIgBEHQAGoQsAIgBCAEKQOYATcDSCAEIAQpA6gBNwNAIAAgASAEQcgAaiAEQcAAahCjAiAEIAMpAwA3AzggASAEQThqEI8BCyAEQbABaiQAC/EDAgF/AX4jAEGQAWsiBCQAIAQgAikDADcDgAECQAJAIARBgAFqENsCRQ0AIAQgASkDACIFNwN4IAQgBTcDiAECQCAAIARB+ABqEIADDQAgBCAEKQOIATcDcCAAIARB8ABqEPsCDQAgBCAEKQOIATcDaCAAIARB6ABqENoCRQ0BCyAEIAIpAwA3AxggACAEQRhqEPkCIQIgBCABKQMANwMQIAQgAykDADcDCCAAIARBEGogAiAEQQhqELYCDAELIAAgAikDADcDMCAEIAEpAwAiBTcDYCAEIAU3A4gBAkAgACAEQeAAakEBEKoCIgFFDQACQAJAIAEtAANBD3FBfGoOBgEAAAAAAQALQYfTAEHoOEHZBUGVCxCABQALIABCADcDMCABRQ0BIAQgAikDADcDWAJAIAAgBEHYAGoQ2gJFDQAgBCACKQMANwMoIAQgAykDADcDICAAIAEgBEEoaiAEQSBqEJgCDAILIAQgAikDADcDUCAEQYgBaiAAIARB0ABqEOECIAIgBCkDiAE3AwAgBCACKQMANwNIIAAgBEHIAGoQjgEgBCACKQMANwNAIAQgAykDADcDOCAAIAEgBEHAAGogBEE4ahCYAiAEIAIpAwA3AzAgACAEQTBqEI8BDAELIABCADcDMAsgBEGQAWokAAu1AwIEfwF+IwBB0ABrIgQkAAJAAkAgAkGB4ANJDQAgBEHIAGogAEEPEPICDAELIAQgASkDADcDOAJAIAAgBEE4ahD8AkUNACAEIAEpAwA3AyAgACAEQSBqIARBxABqEP0CIQECQCAEKAJEIgUgAk0NACAEIAMpAwA3AwggASACaiAAIARBCGoQ+QI6AAAMAgsgBCACNgIQIAQgBTYCFCAEQcgAaiAAQb0MIARBEGoQ7gIMAQsgBCABKQMANwMwAkAgACAEQTBqEP8CIgVFDQAgBSgCAEGAgID4AHFBgICAGEcNAAJAIAJBgTxJDQAgBEHIAGogAEEPEPICDAILIAMpAwAhCAJAIAJBAWoiASAFLwEKTQ0AIAAgAUEKbEEDdiIDQQQgA0EESxsiBkEDdBCKASIDRQ0CAkAgBSgCDCIHRQ0AIAMgByAFLwEIQQN0EJ0FGgsgBSAGOwEKIAUgAzYCDCAAKALQASADEIsBCyAFKAIMIAJBA3RqIAg3AwAgBS8BCCACSw0BIAUgATsBCAwBCyAEIAEpAwA3AyggBEHIAGogAEEPIARBKGoQ8AILIARB0ABqJAALvQEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQQ8Q8gIMAQsCQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQigEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBCdBRoLIAEgBzsBCiABIAY2AgwgACgC0AEgBhCLAQsgASgCDCACQQN0aiADKQMANwMAIAEvAQggAksNACABIAU7AQgLIARBEGokAAvyAQIGfwF+IwBBIGsiAyQAIAMgAikDADcDECAAIANBEGoQjgECQAJAIAEvAQgiBEGBPEkNACADQRhqIABBDxDyAgwBCyACKQMAIQkgBEEBaiEFAkAgBCABLwEKSQ0AIAAgBUEKbEEDdiIGQQQgBkEESxsiB0EDdBCKASIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0EJ0FGgsgASAHOwEKIAEgBjYCDCAAKALQASAGEIsBCyABKAIMIARBA3RqIAk3AwAgAS8BCCAESw0AIAEgBTsBCAsgAyACKQMANwMIIAAgA0EIahCPASADQSBqJAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEPkCIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQdgAaikDACIDNwMAIAIgAzcDCCAAIAIQ+AIhBCACQRBqJAAgBAssAQF/IwBBEGsiAiQAIAJBCGogARD0AiAAKAKsASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARD1AiAAKAKsASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARD2AiAAKAKsASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQ9wIgACgCrAEgAikDCDcDICACQRBqJAALegIDfwF+IwBBIGsiASQAIAEgACkDUCIENwMIIAEgBDcDGAJAAkAgACABQQhqEP8CIgINAEEAIQMMAQsgAi0AA0EPcSEDCyACIQICQAJAIANBfGoOBgEAAAAAAQALIAFBEGogAEGjMUEAEO0CQQAhAgsgAUEgaiQAIAILLAEBfwJAIAAoAiwiAygCrAENACAAIAI2AjQgACABNgIwDwsgAyACIAERAgALMgEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqEIEDIQEgAkEQaiQAIAFBfmpBBEkLTQEBfwJAIAJBJEkNACAAQgA3AwAPCwJAIAEgAhCWAiIDQYDhAGtBDG1BI0sNACAAQQA2AgQgACACQeAAajYCAA8LIAAgAUEIIAMQ9wIL/wEBAn8gAiEDA0ACQCADIgJBgOEAa0EMbSIDQSNLDQACQCABIAMQlgIiAkGA4QBrQQxtQSNLDQAgAEEANgIEIAAgA0HgAGo2AgAPCyAAIAFBCCACEPcCDwsCQCACIAEoAKQBIgMgAygCYGprIAMvAQ5BBHRPDQAgAEIANwMADwsCQAJAIAINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkAgA0F8ag4GAQAAAAABAAtB0tMAQeg4Qb0IQd0pEIAFAAsCQCACRQ0AIAIoAgBBgICA+ABxQYCAgMgARw0AIAIoAgQiBCEDIARBgOEAa0EMbUEkSQ0BCwsgACABQQggAhD3AgskAAJAIAEtABRBCkkNACABKAIIECILIAFBADsBAiABQQA6ABQLTgEDf0EAIQEDQCAAIAEiAkEYbGoiAUEUaiEDAkAgAS0AFEEKSQ0AIAEoAggQIgsgA0EAOgAAIAFBADsBAiACQQFqIgIhASACQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwu/AwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBSIFQRhsai8BAg0AIAAgBUEYbGohBQwCCyAFQQFqIgYhBSAGQRRHDQALQQAhBQsgBSIGIQUCQCAGDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQIgsgB0EAOgAAIAAgBmpBADsBAiAFIQULIAUiBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAhNgIICwJAAkAgACAALwHgAyIGQRhsaiAFRw0AIAUhBQwBCwJAIABBACAGQQFqIAZBEksbIgNBGGxqIgYgBUYNACAEQQhqQRBqIgIgBUEQaiIBKQIANwMAIARBCGpBCGoiByAFQQhqIggpAgA3AwAgBCAFKQIANwMIIAEgBkEQaiIJKQIANwIAIAggBkEIaiIBKQIANwIAIAUgBikCADcCACAJIAIpAwA3AgAgASAHKQMANwIAIAYgBCkDCDcCAAsgACADOwHgAyAGIQULIARBIGokACAFDwtBqsoAQYg+QSVB9zYQgAUAC3kBBX9BACEEAkADQCAGIQUCQAJAIAAgBCIHQRhsIgZqIgQvAQAgAUcNACAAIAZqIggvAQIgAkcNAEEAIQYgBCEEIAgvARYgA0YNAQtBASEGIAUhBAsgBCEEIAZFDQEgBCEGIAdBAWoiByEEIAdBFEcNAAtBAA8LIAQLRgECf0EAIQMDQAJAIAAgAyIDQRhsaiIELwEAIAFHDQAgBCgCBCACTQ0AIARBBGogAjYCAAsgA0EBaiIEIQMgBEEURw0ACwtbAQN/QQAhAgNAAkAgACACIgNBGGxqIgIvAQAgAUcNACACQRRqIQQCQCACLQAUQQpJDQAgAigCCBAiCyAEQQA6AAAgAkEAOwECCyADQQFqIgMhAiADQRRHDQALC1UBAX8CQCACRQ0AIAMgACADGyIDIABB4ANqIgRPDQAgAyEDA0ACQCADIgMvAQIgAkcNACADLwEAIAFHDQAgAw8LIANBGGoiACEDIAAgBEkNAAsLQQALXQEDfyMAQSBrIgEkAEEAIQICQCAAIAFBIBC6BCIDQQBIDQAgA0EBahAhIQICQAJAIANBIEoNACACIAEgAxCdBRoMAQsgACACIAMQugQaCyACIQILIAFBIGokACACCyQBAX8CQAJAIAENAEEAIQIMAQsgARDMBSECCyAAIAEgAhC8BAvQAgEDfyMAQdAAayIDJAAgAyACKQMANwNIIAMgACADQcgAahDPAjYCRCADIAE2AkBB3BcgA0HAAGoQPCABLQAAIQEgAyACKQMANwM4AkACQCAAIANBOGoQ/wIiAg0AQQAhBAwBCyACLQADQQ9xIQQLAkACQCAEQXxqDgYAAQEBAQABCyACLwEIRQ0AQSAgASABQSpHGyABIAFBIUcbIAEgAUE+RxvAIQRBACEBA0ACQCABIgFBC0cNACADIAQ2AgBB8NAAIAMQPAwCCyADIAIoAgwgAUEEdCIFaikDADcDMCADIAAgA0EwahDPAjYCJCADIAQ2AiBBycgAIANBIGoQPCADIAIoAgwgBWpBCGopAwA3AxggAyAAIANBGGoQzwI2AhQgAyAENgIQQfkYIANBEGoQPCABQQFqIgUhASAFIAIvAQhJDQALCyADQdAAaiQAC+UDAQN/IwBB4ABrIgIkAAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiA0EKSw0AQQEgA3RBqAxxDQEgA0EIRw0AIAEoAgAiA0UNACADKAIAQYCAgPgAcUGAgIA4Rg0BCyACIAEpAwA3AwggACACQQhqQQAQ3AIiBCEDIAQNASACIAEpAwA3AwAgACACENACIQMMAQsgAiABKQMANwNAIAAgAkHAAGogAkHYAGogAkHUAGoQpQIhAwJAAkAgAikDWFBFDQBBACEBDAELIAIgAikDWDcDOAJAIAAgAkE4ahDQAiIBQcDdAUYNACACIAE2AjBBwN0BQcAAQf8YIAJBMGoQhAUaCwJAQcDdARDMBSIBQSdJDQBBAEEALQDvUDoAwt0BQQBBAC8A7VA7AcDdAUECIQEMAQsgAUHA3QFqQS46AAAgAUEBaiEBCyABIQECQAJAIAIoAlQiBA0AIAEhAQwBCyACQcgAaiAAQQggBBD3AiACIAIoAkg2AiAgAUHA3QFqQcAAIAFrQZILIAJBIGoQhAUaQcDdARDMBSIBQcDdAWpBwAA6AAAgAUEBaiEBCyACIAM2AhAgASIBQcDdAWpBwAAgAWtBsjQgAkEQahCEBRpBwN0BIQMLIAJB4ABqJAAgAwvOBgEDfyMAQZABayICJAACQAJAIAEoAgQiA0F/Rw0AIAIgASgCADYCAEHA3QFBwABBiTYgAhCEBRpBwN0BIQMMAQtBACEEAkACQAJAAkACQAJAAkACQAJAAkACQAJAQRAgA0EPcSABQQZqLwEAQfD/AXEbDhEBCgQCAwYFCwkIBwsLCwsLAAsLIAIgASkDADcDKCACIAAgAkEoahD4AjkDIEHA3QFBwABBrSggAkEgahCEBRpBwN0BIQMMCwtBnyMhAwJAAkACQAJAAkACQAJAIAEoAgAiAQ5EAAEFEQYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgIGAwQGC0HaMiEDDBALQZUrIQMMDwtBuykhAwwOC0GKCCEDDA0LQYkIIQMMDAtBwMQAIQMMCwsCQCABQaB/aiIDQSNLDQAgAiADNgIwQcDdAUHAAEG5NCACQTBqEIQFGkHA3QEhAwwLC0HrIyEDIAFBgAhJDQogAiABQQ9xNgJEIAIgAUGAeGpBBHY2AkBBwN0BQcAAQfoLIAJBwABqEIQFGkHA3QEhAwwKC0GmICEEDAgLQaQnQYsZIAEoAgBBgIABSRshBAwHC0H9LCEEDAYLQZUcIQQMBQsgAiABKAIANgJUIAIgA0EEdkH//wNxNgJQQcDdAUHAAEGUCiACQdAAahCEBRpBwN0BIQMMBQsgAiABKAIANgJkIAIgA0EEdkH//wNxNgJgQcDdAUHAAEH2HiACQeAAahCEBRpBwN0BIQMMBAsgAiABKAIANgJ0IAIgA0EEdkH//wNxNgJwQcDdAUHAAEHoHiACQfAAahCEBRpBwN0BIQMMAwsCQAJAIAEoAgAiAQ0AQX8hBAwBCyABLQADQQ9xQX9qIQQLQcXIACEDAkAgBCIEQQpLDQAgBEECdEHw6gBqKAIAIQMLIAIgATYChAEgAiADNgKAAUHA3QFBwABB4h4gAkGAAWoQhAUaQcDdASEDDAILQeo+IQQLAkAgBCIDDQBBiyohAwwBCyACIAEoAgA2AhQgAiADNgIQQcDdAUHAAEHYDCACQRBqEIQFGkHA3QEhAwsgAkGQAWokACADC+AFAhZ/BH4jAEHgAGsiAkHAAGpBGGogAEEYaikCACIYNwMAIAJBwABqQRBqIABBEGopAgAiGTcDACACIAApAgAiGjcDQCACIABBCGopAgAiGzcDSCABIQNBACEEIAIoAlwhBSAYpyEGIAIoAlQhASAZpyEHIAIoAkwhCCAbpyEJIAIoAkQhCiAapyELA0AgBCIMQQR0IQ0gAyEEQQAhAyAHIQcgASEOIAYhDyAFIRAgCyELIAohESAJIRIgCCETA0AgEyETIBIhCCARIQkgCyEKIBAhECAPIQUgDiEGIAchASADIQMgBCEEAkACQCAMDQAgAiADQQJ0aiAEKAAAIgdBGHQgB0GA/gNxQQh0ciAHQQh2QYD+A3EgB0EYdnJyNgIAIARBBGohBwwBCyACIANBAnRqIg4gAiADQQFqQQ9xQQJ0aigCACIHQRl3IAdBDndzIAdBA3ZzIA4oAgBqIAIgA0EJakEPcUECdGooAgBqIAIgA0EOakEPcUECdGooAgAiB0EPdyAHQQ13cyAHQQp2c2o2AgAgBCEHCyACIAE2AlQgAiAGNgJYIAIgBTYCXCACIBMgAUEadyABQRV3cyABQQd3cyAGIAFxaiAQaiAFIAFBf3NxaiADIA1yQQJ0QaDrAGooAgBqIAIgA0ECdGooAgBqIgRqIhQ2AlAgAiAKNgJEIAIgCTYCSCACIAg2AkwgAiAKQR53IApBE3dzIApBCndzIARqIAggCXMgCnEgCCAJcXNqIhU2AkAgByIWIQQgA0EBaiIXIQMgFCEHIAEhDiAGIQ8gBSEQIBUhCyAKIREgCSESIAghEyAXQRBHDQALIBYhAyAMQQFqIg4hBCAFIQUgBiEGIAEhASAUIQcgCCEIIAkhCSAKIQogFSELIA5BBEcNAAtBACEBA0AgACABIgFBAnQiCmoiAyADKAIAIAJBwABqIApqKAIAajYCACABQQFqIgohASAKQQhHDQALC7QCAQV/IAAoAkghASAAKAJEIgJBgAE6AAAgAEHQAGohAyACQQFqIQICQAJAIAFBf2oiAUEHTQ0AIAEhASACIQIMAQsgAkEAIAEQnwUaIAMgAEEEaiICENECQcAAIQEgAiECCyACQQAgAUF4aiIBEJ8FIAFqIgQgACgCTCIBQQN0OgAHQQYhAiABQQV2IQUDQCAEIAIiAWogBSIFOgAAIAFBf2ohAiAFQQh2IQUgAQ0ACyADIABBBGoQ0QIgACgCACECQQAhAUEAIQUDQCACIAEiAWogAyAFIgRBAnRqIgUtAAM6AAAgAiABQQFyaiAFLwECOgAAIAIgAUECcmogBSgCAEEIdjoAACACIAFBA3JqIAUoAgA6AAAgAUEEaiEBIARBAWoiBCEFIARBCEcNAAsgACgCAAuQAQAQJAJAQQAtAIDeAUUNAEHPPkEOQd8cEPsEAAtBAEEBOgCA3gEQJUEAQquzj/yRo7Pw2wA3AuzeAUEAQv+kuYjFkdqCm383AuTeAUEAQvLmu+Ojp/2npX83AtzeAUEAQufMp9DW0Ouzu383AtTeAUEAQsAANwLM3gFBAEGI3gE2AsjeAUEAQYDfATYChN4BC/kBAQN/AkAgAUUNAEEAQQAoAtDeASABajYC0N4BIAEhASAAIQADQCAAIQAgASEBAkBBACgCzN4BIgJBwABHDQAgAUHAAEkNAEHU3gEgABDRAiABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKALI3gEgACABIAIgASACSRsiAhCdBRpBAEEAKALM3gEiAyACazYCzN4BIAAgAmohACABIAJrIQQCQCADIAJHDQBB1N4BQYjeARDRAkEAQcAANgLM3gFBAEGI3gE2AsjeASAEIQEgACEAIAQNAQwCC0EAQQAoAsjeASACajYCyN4BIAQhASAAIQAgBA0ACwsLTABBhN4BENICGiAAQRhqQQApA5jfATcAACAAQRBqQQApA5DfATcAACAAQQhqQQApA4jfATcAACAAQQApA4DfATcAAEEAQQA6AIDeAQvZBwEDf0EAQgA3A9jfAUEAQgA3A9DfAUEAQgA3A8jfAUEAQgA3A8DfAUEAQgA3A7jfAUEAQgA3A7DfAUEAQgA3A6jfAUEAQgA3A6DfAQJAAkACQAJAIAFBwQBJDQAQJEEALQCA3gENAkEAQQE6AIDeARAlQQAgATYC0N4BQQBBwAA2AszeAUEAQYjeATYCyN4BQQBBgN8BNgKE3gFBAEKrs4/8kaOz8NsANwLs3gFBAEL/pLmIxZHagpt/NwLk3gFBAELy5rvjo6f9p6V/NwLc3gFBAELnzKfQ1tDrs7t/NwLU3gEgASEBIAAhAAJAA0AgACEAIAEhAQJAQQAoAszeASICQcAARw0AIAFBwABJDQBB1N4BIAAQ0QIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgCyN4BIAAgASACIAEgAkkbIgIQnQUaQQBBACgCzN4BIgMgAms2AszeASAAIAJqIQAgASACayEEAkAgAyACRw0AQdTeAUGI3gEQ0QJBAEHAADYCzN4BQQBBiN4BNgLI3gEgBCEBIAAhACAEDQEMAgtBAEEAKALI3gEgAmo2AsjeASAEIQEgACEAIAQNAAsLQYTeARDSAhpBAEEAKQOY3wE3A7jfAUEAQQApA5DfATcDsN8BQQBBACkDiN8BNwOo3wFBAEEAKQOA3wE3A6DfAUEAQQA6AIDeAUEAIQEMAQtBoN8BIAAgARCdBRpBACEBCwNAIAEiAUGg3wFqIgAgAC0AAEE2czoAACABQQFqIgAhASAAQcAARw0ADAILAAtBzz5BDkHfHBD7BAALECQCQEEALQCA3gENAEEAQQE6AIDeARAlQQBCwICAgPDM+YTqADcC0N4BQQBBwAA2AszeAUEAQYjeATYCyN4BQQBBgN8BNgKE3gFBAEGZmoPfBTYC8N4BQQBCjNGV2Lm19sEfNwLo3gFBAEK66r+q+s+Uh9EANwLg3gFBAEKF3Z7bq+68tzw3AtjeAUHAACEBQaDfASEAAkADQCAAIQAgASEBAkBBACgCzN4BIgJBwABHDQAgAUHAAEkNAEHU3gEgABDRAiABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKALI3gEgACABIAIgASACSRsiAhCdBRpBAEEAKALM3gEiAyACazYCzN4BIAAgAmohACABIAJrIQQCQCADIAJHDQBB1N4BQYjeARDRAkEAQcAANgLM3gFBAEGI3gE2AsjeASAEIQEgACEAIAQNAQwCC0EAQQAoAsjeASACajYCyN4BIAQhASAAIQAgBA0ACwsPC0HPPkEOQd8cEPsEAAv5BgEFf0GE3gEQ0gIaIABBGGpBACkDmN8BNwAAIABBEGpBACkDkN8BNwAAIABBCGpBACkDiN8BNwAAIABBACkDgN8BNwAAQQBBADoAgN4BECQCQEEALQCA3gENAEEAQQE6AIDeARAlQQBCq7OP/JGjs/DbADcC7N4BQQBC/6S5iMWR2oKbfzcC5N4BQQBC8ua746On/aelfzcC3N4BQQBC58yn0NbQ67O7fzcC1N4BQQBCwAA3AszeAUEAQYjeATYCyN4BQQBBgN8BNgKE3gFBACEBA0AgASIBQaDfAWoiAiACLQAAQeoAczoAACABQQFqIgIhASACQcAARw0AC0EAQcAANgLQ3gFBwAAhAUGg3wEhAgJAA0AgAiECIAEhAQJAQQAoAszeASIDQcAARw0AIAFBwABJDQBB1N4BIAIQ0QIgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCyN4BIAIgASADIAEgA0kbIgMQnQUaQQBBACgCzN4BIgQgA2s2AszeASACIANqIQIgASADayEFAkAgBCADRw0AQdTeAUGI3gEQ0QJBAEHAADYCzN4BQQBBiN4BNgLI3gEgBSEBIAIhAiAFDQEMAgtBAEEAKALI3gEgA2o2AsjeASAFIQEgAiECIAUNAAsLQQBBACgC0N4BQSBqNgLQ3gFBICEBIAAhAgJAA0AgAiECIAEhAQJAQQAoAszeASIDQcAARw0AIAFBwABJDQBB1N4BIAIQ0QIgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCyN4BIAIgASADIAEgA0kbIgMQnQUaQQBBACgCzN4BIgQgA2s2AszeASACIANqIQIgASADayEFAkAgBCADRw0AQdTeAUGI3gEQ0QJBAEHAADYCzN4BQQBBiN4BNgLI3gEgBSEBIAIhAiAFDQEMAgtBAEEAKALI3gEgA2o2AsjeASAFIQEgAiECIAUNAAsLQYTeARDSAhogAEEYakEAKQOY3wE3AAAgAEEQakEAKQOQ3wE3AAAgAEEIakEAKQOI3wE3AAAgAEEAKQOA3wE3AABBAEIANwOg3wFBAEIANwOo3wFBAEIANwOw3wFBAEIANwO43wFBAEIANwPA3wFBAEIANwPI3wFBAEIANwPQ3wFBAEIANwPY3wFBAEEAOgCA3gEPC0HPPkEOQd8cEPsEAAvtBwEBfyAAIAEQ1gICQCADRQ0AQQBBACgC0N4BIANqNgLQ3gEgAyEDIAIhAQNAIAEhASADIQMCQEEAKALM3gEiAEHAAEcNACADQcAASQ0AQdTeASABENECIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjeASABIAMgACADIABJGyIAEJ0FGkEAQQAoAszeASIJIABrNgLM3gEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU3gFBiN4BENECQQBBwAA2AszeAUEAQYjeATYCyN4BIAIhAyABIQEgAg0BDAILQQBBACgCyN4BIABqNgLI3gEgAiEDIAEhASACDQALCyAIENcCIAhBIBDWAgJAIAVFDQBBAEEAKALQ3gEgBWo2AtDeASAFIQMgBCEBA0AgASEBIAMhAwJAQQAoAszeASIAQcAARw0AIANBwABJDQBB1N4BIAEQ0QIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCyN4BIAEgAyAAIAMgAEkbIgAQnQUaQQBBACgCzN4BIgkgAGs2AszeASABIABqIQEgAyAAayECAkAgCSAARw0AQdTeAUGI3gEQ0QJBAEHAADYCzN4BQQBBiN4BNgLI3gEgAiEDIAEhASACDQEMAgtBAEEAKALI3gEgAGo2AsjeASACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAtDeASAHajYC0N4BIAchAyAGIQEDQCABIQEgAyEDAkBBACgCzN4BIgBBwABHDQAgA0HAAEkNAEHU3gEgARDRAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALI3gEgASADIAAgAyAASRsiABCdBRpBAEEAKALM3gEiCSAAazYCzN4BIAEgAGohASADIABrIQICQCAJIABHDQBB1N4BQYjeARDRAkEAQcAANgLM3gFBAEGI3gE2AsjeASACIQMgASEBIAINAQwCC0EAQQAoAsjeASAAajYCyN4BIAIhAyABIQEgAg0ACwtBAEEAKALQ3gFBAWo2AtDeAUEBIQNBsdgAIQECQANAIAEhASADIQMCQEEAKALM3gEiAEHAAEcNACADQcAASQ0AQdTeASABENECIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjeASABIAMgACADIABJGyIAEJ0FGkEAQQAoAszeASIJIABrNgLM3gEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU3gFB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IQEgBEEgciIGQZ9/akH/AXFBBUsNACAGwEGpf2ohAQsgAUF/Rw0BIAItAAEiAUUhBCABIQMgAkEBaiECIAENAAsgByECDAILAkAgBUEBcUUNACAHIQIMAgsCQAJAIAMNACAEwEFQaiEBDAELQX8hASAEQSByIgRBn39qQf8BcUEFSw0AIATAQal/aiEBCyABIQEgAkEBaiECAkACQCAIDQAgByEGIAFBBHRBgAJyIQUMAQsgByABIAhyOgAAIAdBAWohBkEAIQULIAItAAAiB0UhBCAHIQMgAiEBIAUhBSAGIgIhBiACIQIgBw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGxFiAEEDwQHQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwv5CgELfyMAQcAAayIEJAAgACABaiEFIARBf2ohBiAEQQFyIQcgBEECciEIIABBAEchCSACIQEgAyEKIAIhAiAAIQMDQCADIQMgAiECIAohCyABIgpBAWohAQJAAkAgCi0AACIMQSVGDQAgDEUNACABIQEgCyEKIAIhAkEBIQwgAyEDDAELAkACQCACIAFHDQAgAyEDDAELIAJBf3MgAWohDQJAIAUgA2siDkEBSA0AIAMgAiANIA5Bf2ogDiANShsiDhCdBSAOakEAOgAACyADIA1qIQMLIAMhDQJAIAwNACABIQEgCyEKIAIhAkEAIQwgDSEDDAELAkACQCABLQAAQS1GDQAgASEBQQAhAgwBCyAKQQJqIAEgCi0AAkHzAEYiAhshASACIAlxIQILIAIhAiABIg4sAAAhASAEQQA6AAECQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCALKAIAOgAAIAtBBGohAgwMCyAEIQICQAJAIAsoAgAiAUF/TA0AIAEhASACIQIMAQsgBEEtOgAAQQAgAWshASAHIQIL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IAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQnQUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKALs7QFFDQBBACgC7O0BEKIFIQELAkBBACgC4M8BRQ0AQQAoAuDPARCiBSABciEBCwJAELgFKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABCgBSECCwJAIAAoAhQgACgCHEYNACAAEKIFIAFyIQELAkAgAkUNACAAEKEFCyAAKAI4IgANAAsLELkFIAEPC0EAIQICQCAAKAJMQQBIDQAgABCgBSECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEFABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoEQ8AGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQoQULIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQpAUhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBUIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAFQQEgBmuthiEDDAELIAVC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBEIAUw0AA0AgB0F/aiEHIARCAYYiBEJ/VQ0ACwsgAkEBIAdrrYYhAgwBCyACQv////////8Hg0KAgICAgICACIQhAgsCQCAGIAdMDQADQAJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCyADQgGGIQMgBkF/aiIG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rUI0hr+iCzUAIAAgATcDACAAIARCMIinQYCAAnEgAkIwiKdB//8BcXKtQjCGIAJC////////P4OENwMIC+cCAQF/IwBB0ABrIgQkAAJAAkAgA0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEO4FIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQ7gUgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORDuBSAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQ7gUgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEO4FIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABDkBUUNACADIAQQ1AUhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQ7gUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxDmBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ5AVBAEoNAAJAIAEgCSADIAoQ5AVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ7gUgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEO4FIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABDuBSAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQ7gUgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEO4FIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxDuBSAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAggBnKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuOCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAFBBGohBSACQQJ0IgJBnMsBaigCACEGIAJBkMsBaigCACEHA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDPBSECCyACENAFDQALQQEhCAJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQgCQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQzwUhAgtBACEJAkACQAJAA0AgAkEgciAJQYAIaiwAAEcNAQJAIAlBBksNAAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDPBSECCyAJQQFqIglBCEcNAAwCCwALAkAgCUEDRg0AIAlBCEYNASADRQ0CIAlBBEkNAiAJQQhGDQELAkAgASkDcCIKQgBTDQAgBSAFKAIAQX9qNgIACyADRQ0AIAlBBEkNACAKQgBTIQEDQAJAIAENACAFIAUoAgBBf2o2AgALIAlBf2oiCUEDSw0A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AkBBACgCgO4BIgRBASAAQQN2dCIAcQ0AQQAgBCAAcjYCgO4BIAIhAAwBCyACKAIIIQALIAIgATYCCCAAIAE2AgwgASACNgIMIAEgADYCCA8LQR8hAgJAIABB////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEGw8AFqIQQCQAJAAkACQEEAKAKE7gEiBkEBIAJ0IgNxDQBBACAGIANyNgKE7gEgBCABNgIAIAEgBDYCGAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAqDuAUF/aiIBQX8gARs2AqDuAQsLBwA/AEEQdAtUAQJ/QQAoAuTPASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDgBU0NACAAEBVFDQELQQAgADYC5M8BIAEPCxCaBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ4wVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEOMFQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxDjBSAFQTBqIAogASAHEO0FIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ4wUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ4wUgBSACIARBASAGaxDtBSAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQ6wUOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ7AUaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBF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BFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ4wUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ4wUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDjBSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDjBSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDjBUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDjBSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhDjBSAFQSBqIAIgBCAGEOMFIAVBEGogEiABIAcQ7QUgBSACIAQgBxDtBSAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ4gUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEOMFIAIgACAEQYH4ACADaxDtBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQfDxBSQDQfDxAUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAARDwALJQEBfiAAIAEgAq0gA61CIIaEIAQQ/QUhBSAFQiCIpxDzBSAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwuW0IGAAAMAQYAIC6jDAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAV1NTSy1IOiBzdHJlYW1pbmc6ICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdAB3YWl0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfaW5zcGVjdABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAIyAldSAlcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX2luc3BlY3RfdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AQHZlcnNpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAGZyb20AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mAHNlbGYAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBzdGF0ZS5vZmYgPCBzaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAX2NvbW1hbmRSZXNwb25zZQBmYWxzZQBmbGFzaF9lcmFzZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAZGJnOiByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAEBuYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtDaXJjdWxhcl0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOAB1dGYtOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQAhIG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRFUykAJXMgKFdTU0spACF0YXJnZXRfaW5faXJxKCkAZnN0b3I6IGludmFsaWQgbGFyZ2Uga2V5OiAnJXMnAGZzdG9yOiBp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////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGcAAPB4AQAAQejPAQudCCh2b2lkICpzdGFydCwgdW5zaWduZWQgc2l6ZSk8Ojo+eyBpZiAoTW9kdWxlLmZsYXNoU2F2ZSkgTW9kdWxlLmZsYXNoU2F2ZShIRUFQVTguc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgc2l6ZSkpOyB9ACh2b2lkICpzdGFydCwgdW5zaWduZWQgc2l6ZSk8Ojo+eyBpZiAoTW9kdWxlLmZsYXNoTG9hZCkgeyBjb25zdCBkYXRhID0gTW9kdWxlLmZsYXNoTG9hZCgpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2coImZsYXNoIGxvYWQsIHNpemU9IiArIGRhdGEubGVuZ3RoKTsgSEVBUFU4LnNldChkYXRhLnNsaWNlKDAsIHNpemUpLCBzdGFydCk7IH0gfQAodm9pZCAqZnJhbWUpPDo6PnsgY29uc3Qgc3ogPSAxMiArIEhFQVBVOFtmcmFtZSArIDJdOyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoZXhpdGNvZGUpIGNvbnNvbGUubG9nKCJQQU5JQyIsIGV4aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AADB84CAAARuYW1lAdFygAYADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNfZGV2c19wYW5pY19oYW5kbGVyBBFlbV9kZXBsb3lfaGFuZGxlcgUXZW1famRfY3J5cHRvX2dldF9yYW5kb20GDWVtX3NlbmRfZnJhbWUHBGV4aXQIC2VtX3RpbWVfbm93CQ5lbV9wcmludF9kbWVzZwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3D2FwcF9wcmludF9kbWVzZzgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwJYXBwX2RtZXNnPQtmbHVzaF9kbWVzZz4LYXBwX3Byb2Nlc3M/B3R4X2luaXRAD2pkX3BhY2tldF9yZWFkeUEKdHhfcHJvY2Vzc0IXamRfd2Vic29ja19zZW5kX21lc3NhZ2VDDmpkX3dlYnNvY2tfbmV3RAZvbm9wZW5FB29uZXJyb3JGB29uY2xvc2VHCW9ubWVzc2FnZUgQamRfd2Vic29ja19jbG9zZUkOZGV2c19idWZmZXJfb3BKEmRldnNfYnVmZmVyX2RlY29kZUsSZGV2c19idWZmZXJfZW5jb2RlTA9kZXZzX2NyZWF0ZV9jdHhNCXNldHVwX2N0eE4KZGV2c190cmFjZU8PZGV2c19lcnJvcl9jb2RlUBlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUQljbGVhcl9jdHhSDWRldnNfZnJlZV9jdHhTCGRldnNfb29tVAlkZXZzX2ZyZWVVEWRldnNjbG91ZF9wcm9jZXNzVhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFcUZGV2c2Nsb3VkX29uX21lc3NhZ2VYDmRldnNjbG91ZF9pbml0WRRkZXZzX3RyYWNrX2V4Y2VwdGlvbloPZGV2c2RiZ19wcm9jZXNzWxFkZXZzZGJnX3Jlc3RhcnRlZFwVZGV2c2RiZ19oYW5kbGVfcGFja2V0XQtzZW5kX3ZhbHVlc14RdmFsdWVfZnJvbV90YWdfdjBfGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVgDW9ial9nZXRfcHJvcHNhDGV4cGFuZF92YWx1ZWISZGV2c2RiZ19zdXNwZW5kX2NiYwxkZXZzZGJnX2luaXRkEGV4cGFuZF9rZXlfdmFsdWVlBmt2X2FkZGYPZGV2c21ncl9wcm9jZXNzZwd0cnlfcnVuaAxzdG9wX3Byb2dyYW1pD2RldnNtZ3JfcmVzdGFydGoUZGV2c21ncl9kZXBsb3lfc3RhcnRrFGRldnNtZ3JfZGVwbG95X3dyaXRlbBBkZXZzbWdyX2dldF9oYXNobRVkZXZzbWdyX2hhbmRsZV9wYWNrZXRuDmRlcGxveV9oYW5kbGVybxNkZXBsb3lfbWV0YV9oYW5kbGVycA9kZXZzbWdyX2dldF9jdHhxDmRldnNtZ3JfZGVwbG95cgxkZXZzbWdyX2luaXRzEWRldnNtZ3JfY2xpZW50X2V2dBZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dRBkZXZzX2ZpYmVyX3lpZWxkdhhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb253GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXgQZGV2c19maWJlcl9zbGVlcHkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsehpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3sRZGV2c19pbWdfZnVuX25hbWV8EmRldnNfaW1nX3JvbGVfbmFtZX0RZGV2c19maWJlcl9ieV90YWd+EGRldnNfZmliZXJfc3RhcnR/FGRldnNfZmliZXJfdGVybWlhbnRlgAEOZGV2c19maWJlcl9ydW6BARNkZXZzX2ZpYmVyX3N5bmNfbm93ggEKZGV2c19wYW5pY4MBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYQBD2RldnNfZmliZXJfcG9rZYUBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEUZGV2c192YWx1ZV9pc19waW5uZWSOAQ5kZXZzX3ZhbHVlX3Bpbo8BEGRldnNfdmFsdWVfdW5waW6QARJkZXZzX21hcF90cnlfYWxsb2ORARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OSARRkZXZzX2FycmF5X3RyeV9hbGxvY5MBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5QBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5UBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lgEPZGV2c19nY19zZXRfY3R4lwEOZGV2c19nY19jcmVhdGWYAQ9kZXZzX2djX2Rlc3Ryb3mZARFkZXZzX2djX29ial9jaGVja5oBC3NjYW5fZ2Nfb2JqmwERcHJvcF9BcnJheV9sZW5ndGicARJtZXRoMl9BcnJheV9pbnNlcnSdARJmdW4xX0FycmF5X2lzQXJyYXmeARBtZXRoWF9BcnJheV9wdXNonwEVbWV0aDFfQXJyYXlfcHVzaFJhbmdloAERbWV0aFhfQXJyYXlfc2xpY2WhARFmdW4xX0J1ZmZlcl9hbGxvY6IBEGZ1bjFfQnVmZmVyX2Zyb22jARJwcm9wX0J1ZmZlcl9sZW5ndGikARVtZXRoMV9CdWZmZXJfdG9TdHJpbmelARNtZXRoM19CdWZmZXJfZmlsbEF0pgETbWV0aDRfQnVmZmVyX2JsaXRBdKcBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwqAEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljqQEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qgEZZnVuMF9EZXZpY2VTY3JpcHRfcmVzdGFydKsBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKwBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50rQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdK4BGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50rwEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKwAR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7EBGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7IBFG1ldGgxX0Vycm9yX19fY3Rvcl9fswEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7QBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7UBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9ftgEPcHJvcF9FcnJvcl9uYW1ltwERbWV0aDBfRXJyb3JfcHJpbnS4AQ9wcm9wX0RzRmliZXJfaWS5ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkugEUbWV0aDFfRHNGaWJlcl9yZXN1bWW7ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZbwBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmS9ARFmdW4wX0RzRmliZXJfc2VsZr4BFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0vwEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXAARJwcm9wX0Z1bmN0aW9uX25hbWXBAQ9mdW4yX0pTT05fcGFyc2XCARNmdW4zX0pTT05fc3RyaW5naWZ5wwEOZnVuMV9NYXRoX2NlaWzEAQ9mdW4xX01hdGhfZmxvb3LFAQ9mdW4xX01hdGhfcm91bmTGAQ1mdW4xX01hdGhfYWJzxwEQZnVuMF9NYXRoX3JhbmRvbcgBE2Z1bjFfTWF0aF9yYW5kb21JbnTJAQ1mdW4xX01hdGhfbG9nygENZnVuMl9NYXRoX3Bvd8sBDmZ1bjJfTWF0aF9pZGl2zAEOZnVuMl9NYXRoX2ltb2TNAQ5mdW4yX01hdGhfaW11bM4BDWZ1bjJfTWF0aF9taW7PAQtmdW4yX21pbm1heNABDWZ1bjJfTWF0aF9tYXjRARJmdW4yX09iamVjdF9hc3NpZ27SARBmdW4xX09iamVjdF9rZXlz0wETZnVuMV9rZXlzX29yX3ZhbHVlc9QBEmZ1bjFfT2JqZWN0X3ZhbHVlc9UBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m1gEQcHJvcF9QYWNrZXRfcm9sZdcBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLYARNwcm9wX1BhY2tldF9zaG9ydElk2QEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV42gEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTbARFwcm9wX1BhY2tldF9mbGFnc9wBFXByb3BfUGFja2V0X2lzQ29tbWFuZN0BFHByb3BfUGFja2V0X2lzUmVwb3J03gETcHJvcF9QYWNrZXRfcGF5bG9hZN8BE3Byb3BfUGFja2V0X2lzRXZlbnTgARVwcm9wX1BhY2tldF9ldmVudENvZGXhARRwcm9wX1BhY2tldF9pc1JlZ1NldOIBFHByb3BfUGFja2V0X2lzUmVnR2V04wETcHJvcF9QYWNrZXRfcmVnQ29kZeQBFHByb3BfUGFja2V0X2lzQWN0aW9u5QEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl5gESZGV2c19nZXRfc3BlY19jb2Rl5wETbWV0aDBfUGFja2V0X2RlY29kZegBEmRldnNfcGFja2V0X2RlY29kZekBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZOoBFERzUmVnaXN0ZXJfcmVhZF9jb2506wESZGV2c19wYWNrZXRfZW5jb2Rl7AEWbWV0aFhfRHNSZWdpc3Rlcl93cml0Ze0BFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXuARZwcm9wX0RzUGFja2V0SW5mb19uYW1l7wEWcHJvcF9Ec1BhY2tldEluZm9fY29kZfABGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX/EBE3Byb3BfRHNSb2xlX2lzQm91bmTyARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTzARFtZXRoMF9Ec1JvbGVfd2FpdPQBEnByb3BfU3RyaW5nX2xlbmd0aPUBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF09gETbWV0aDFfU3RyaW5nX2NoYXJBdPcBEm1ldGgyX1N0cmluZ19zbGljZfgBC2luc3BlY3Rfb2Jq+QENaW5zcGVjdF9maWVsZPoBDGRldnNfaW5zcGVjdPsBFGRldnNfamRfZ2V0X3JlZ2lzdGVy/AEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZP0BEGRldnNfamRfc2VuZF9jbWT+ARFkZXZzX2pkX3dha2Vfcm9sZf8BFGRldnNfamRfcmVzZXRfcGFja2V0gAITZGV2c19qZF9wa3RfY2FwdHVyZYECE2RldnNfamRfc2VuZF9sb2dtc2eCAhJkZXZzX2pkX3Nob3VsZF9ydW6DAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZYQCE2RldnNfamRfcHJvY2Vzc19wa3SFAhRkZXZzX2pkX3JvbGVfY2hhbmdlZIYCEmRldnNfamRfaW5pdF9yb2xlc4cCEmRldnNfamRfZnJlZV9yb2xlc4gCFWRldnNfc2V0X2dsb2JhbF9mbGFnc4kCF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzigIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdziwIQZGV2c19qc29uX2VzY2FwZYwCFWRldnNfanNvbl9lc2NhcGVfY29yZY0CD2RldnNfanNvbl9wYXJzZY4CCmpzb25fdmFsdWWPAgxwYXJzZV9zdHJpbmeQAg1zdHJpbmdpZnlfb2JqkQIKYWRkX2luZGVudJICD3N0cmluZ2lmeV9maWVsZJMCE2RldnNfanNvbl9zdHJpbmdpZnmUAhFwYXJzZV9zdHJpbmdfY29yZZUCEWRldnNfbWFwbGlrZV9pdGVylgIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SXAhJkZXZzX21hcF9jb3B5X2ludG+YAgxkZXZzX21hcF9zZXSZAgZsb29rdXCaAhNkZXZzX21hcGxpa2VfaXNfbWFwmwIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVznAIRZGV2c19hcnJheV9pbnNlcnSdAghrdl9hZGQuMZ4CEmRldnNfc2hvcnRfbWFwX3NldJ8CD2RldnNfbWFwX2RlbGV0ZaACEmRldnNfc2hvcnRfbWFwX2dldKECF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0ogIOZGV2c19yb2xlX3NwZWOjAhJkZXZzX2Z1bmN0aW9uX2JpbmSkAhFkZXZzX21ha2VfY2xvc3VyZaUCDmRldnNfZ2V0X2ZuaWR4pgITZGV2c19nZXRfZm5pZHhfY29yZacCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZKgCE2RldnNfZ2V0X3JvbGVfcHJvdG+pAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcneqAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSrAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+sAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+tAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51ba4CFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+vAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSwAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSxAhBkZXZzX2luc3RhbmNlX29msgIPZGV2c19vYmplY3RfZ2V0swIMZGV2c19zZXFfZ2V0tAIMZGV2c19hbnlfZ2V0tQIMZGV2c19hbnlfc2V0tgIMZGV2c19zZXFfc2V0twIOZGV2c19hcnJheV9zZXS4AhNkZXZzX2FycmF5X3Bpbl9wdXNouQIMZGV2c19hcmdfaW50ugIPZGV2c19hcmdfZG91YmxluwIPZGV2c19yZXRfZG91YmxlvAIMZGV2c19yZXRfaW50vQINZGV2c19yZXRfYm9vbL4CD2RldnNfcmV0X2djX3B0cr8CEWRldnNfYXJnX3NlbGZfbWFwwAIRZGV2c19zZXR1cF9yZXN1bWXBAg9kZXZzX2Nhbl9hdHRhY2jCAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlwwIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlxAISZGV2c19yZWdjYWNoZV9mcmVlxQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbMYCF2RldnNfcmVnY2FjaGVfbWFya191c2VkxwITZGV2c19yZWdjYWNoZV9hbGxvY8gCFGRldnNfcmVnY2FjaGVfbG9va3VwyQIRZGV2c19yZWdjYWNoZV9hZ2XKAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZcsCEmRldnNfcmVnY2FjaGVfbmV4dMwCD2pkX3NldHRpbmdzX2dldM0CD2pkX3NldHRpbmdzX3NldM4CDmRldnNfbG9nX3ZhbHVlzwIPZGV2c19zaG93X3ZhbHVl0AIQZGV2c19zaG93X3ZhbHVlMNECDWNvbnN1bWVfY2h1bmvSAg1zaGFfMjU2X2Nsb3Nl0wIPamRfc2hhMjU2X3NldHVw1AIQamRfc2hhMjU2X3VwZGF0ZdUCEGpkX3NoYTI1Nl9maW5pc2jWAhRqZF9zaGEyNTZfaG1hY19zZXR1cNcCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaNgCDmpkX3NoYTI1Nl9oa2Rm2QIOZGV2c19zdHJmb3JtYXTaAg5kZXZzX2lzX3N0cmluZ9sCDmRldnNfaXNfbnVtYmVy3AIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjdAhNkZXZzX2J1aWx0aW5fc3RyaW5n3gIUZGV2c19zdHJpbmdfdnNwcmludGbfAhNkZXZzX3N0cmluZ19zcHJpbnRm4AIVZGV2c19zdHJpbmdfZnJvbV91dGY44QIUZGV2c192YWx1ZV90b19zdHJpbmfiAhBidWZmZXJfdG9fc3RyaW5n4wIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZOQCEmRldnNfc3RyaW5nX2NvbmNhdOUCEWRldnNfc3RyaW5nX3NsaWNl5gISZGV2c19wdXNoX3RyeWZyYW1l5wIRZGV2c19wb3BfdHJ5ZnJhbWXoAg9kZXZzX2R1bXBfc3RhY2vpAhNkZXZzX2R1bXBfZXhjZXB0aW9u6gIKZGV2c190aHJvd+sCEmRldnNfcHJvY2Vzc190aHJvd+wCEGRldnNfYWxsb2NfZXJyb3LtAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LuAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y7wIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y8AIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LxAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTyAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LzAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcvQCFmRldnNfdmFsdWVfZnJvbV9kb3VibGX1AhNkZXZzX3ZhbHVlX2Zyb21faW509gIUZGV2c192YWx1ZV9mcm9tX2Jvb2z3AhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcvgCFGRldnNfdmFsdWVfdG9fZG91Ymxl+QIRZGV2c192YWx1ZV90b19pbnT6AhJkZXZzX3ZhbHVlX3RvX2Jvb2z7Ag5kZXZzX2lzX2J1ZmZlcvwCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl/QIQZGV2c19idWZmZXJfZGF0Yf4CE2RldnNfYnVmZmVyaXNoX2RhdGH/AhRkZXZzX3ZhbHVlX3RvX2djX29iaoADDWRldnNfaXNfYXJyYXmBAxFkZXZzX3ZhbHVlX3R5cGVvZoIDD2RldnNfaXNfbnVsbGlzaIMDGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSEAxRkZXZzX3ZhbHVlX2FwcHJveF9lcYUDEmRldnNfdmFsdWVfaWVlZV9lcYYDDWRldnNfdmFsdWVfZXGHAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOIAxJkZXZzX2ltZ19zdHJpZHhfb2uJAxJkZXZzX2R1bXBfdmVyc2lvbnOKAwtkZXZzX3ZlcmlmeYsDEWRldnNfZmV0Y2hfb3Bjb2RljAMOZGV2c192bV9yZXN1bWWNAxFkZXZzX3ZtX3NldF9kZWJ1Z44DGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOPAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSQAwxkZXZzX3ZtX2hhbHSRAw9kZXZzX3ZtX3N1c3BlbmSSAxZkZXZzX3ZtX3NldF9icmVha3BvaW50kwMUZGV2c192bV9leGVjX29wY29kZXOUAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeJUDEWRldnNfaW1nX2dldF91dGY4lgMUZGV2c19nZXRfc3RhdGljX3V0ZjiXAw9kZXZzX3ZtX3JvbGVfb2uYAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaJkDDGV4cHJfaW52YWxpZJoDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0mwMLc3RtdDFfY2FsbDCcAwtzdG10Ml9jYWxsMZ0DC3N0bXQzX2NhbGwyngMLc3RtdDRfY2FsbDOfAwtzdG10NV9jYWxsNKADC3N0bXQ2X2NhbGw1oQMLc3RtdDdfY2FsbDaiAwtzdG10OF9jYWxsN6MDC3N0bXQ5X2NhbGw4pAMSc3RtdDJfaW5kZXhfZGVsZXRlpQMMc3RtdDFfcmV0dXJupgMJc3RtdHhfam1wpwMMc3RtdHgxX2ptcF96qAMKZXhwcjJfYmluZKkDEmV4cHJ4X29iamVjdF9maWVsZKoDEnN0bXR4MV9zdG9yZV9sb2NhbKsDE3N0bXR4MV9zdG9yZV9nbG9iYWysAxJzdG10NF9zdG9yZV9idWZmZXKtAwlleHByMF9pbmauAxBleHByeF9sb2FkX2xvY2FsrwMRZXhwcnhfbG9hZF9nbG9iYWywAwtleHByMV91cGx1c7EDC2V4cHIyX2luZGV4sgMPc3RtdDNfaW5kZXhfc2V0swMUZXhwcngxX2J1aWx0aW5fZmllbGS0AxJleHByeDFfYXNjaWlfZmllbGS1AxFleHByeDFfdXRmOF9maWVsZLYDEGV4cHJ4X21hdGhfZmllbGS3Aw5leHByeF9kc19maWVsZLgDD3N0bXQwX2FsbG9jX21hcLkDEXN0bXQxX2FsbG9jX2FycmF5ugMSc3RtdDFfYWxsb2NfYnVmZmVyuwMRZXhwcnhfc3RhdGljX3JvbGW8AxNleHByeF9zdGF0aWNfYnVmZmVyvQMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nvgMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ78DGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ8ADFWV4cHJ4X3N0YXRpY19mdW5jdGlvbsEDDWV4cHJ4X2xpdGVyYWzCAxFleHByeF9saXRlcmFsX2Y2NMMDEGV4cHJ4X3JvbGVfcHJvdG/EAxFleHByM19sb2FkX2J1ZmZlcsUDDWV4cHIwX3JldF92YWzGAwxleHByMV90eXBlb2bHAw9leHByMF91bmRlZmluZWTIAxJleHByMV9pc191bmRlZmluZWTJAwpleHByMF90cnVlygMLZXhwcjBfZmFsc2XLAw1leHByMV90b19ib29szAMJZXhwcjBfbmFuzQMJZXhwcjFfYWJzzgMNZXhwcjFfYml0X25vdM8DDGV4cHIxX2lzX25hbtADCWV4cHIxX25lZ9EDCWV4cHIxX25vdNIDDGV4cHIxX3RvX2ludNMDCWV4cHIyX2FkZNQDCWV4cHIyX3N1YtUDCWV4cHIyX211bNYDCWV4cHIyX2RpdtcDDWV4cHIyX2JpdF9hbmTYAwxleHByMl9iaXRfb3LZAw1leHByMl9iaXRfeG9y2gMQZXhwcjJfc2hpZnRfbGVmdNsDEWV4cHIyX3NoaWZ0X3JpZ2h03AMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTdAwhleHByMl9lcd4DCGV4cHIyX2xl3wMIZXhwcjJfbHTgAwhleHByMl9uZeEDEGV4cHIxX2lzX251bGxpc2jiAxRzdG10eDJfc3RvcmVfY2xvc3VyZeMDE2V4cHJ4MV9sb2FkX2Nsb3N1cmXkAxJleHByeF9tYWtlX2Nsb3N1cmXlAxBleHByMV90eXBlb2Zfc3Ry5gMTc3RtdHhfam1wX3JldF92YWxfeucDEHN0bXQyX2NhbGxfYXJyYXnoAwlzdG10eF90cnnpAw1zdG10eF9lbmRfdHJ56gMLc3RtdDBfY2F0Y2jrAw1zdG10MF9maW5hbGx57AMLc3RtdDFfdGhyb3ftAw5zdG10MV9yZV90aHJvd+4DEHN0bXR4MV90aHJvd19qbXDvAw5zdG10MF9kZWJ1Z2dlcvADCWV4cHIxX25ld/EDEWV4cHIyX2luc3RhbmNlX29m8gMKZXhwcjBfbnVsbPMDD2V4cHIyX2FwcHJveF9lcfQDD2V4cHIyX2FwcHJveF9uZfUDE3N0bXQxX3N0b3JlX3JldF92YWz2Aw9kZXZzX3ZtX3BvcF9hcmf3AxNkZXZzX3ZtX3BvcF9hcmdfdTMy+AMTZGV2c192bV9wb3BfYXJnX2kzMvkDFmRldnNfdm1fcG9wX2FyZ19idWZmZXL6AxJqZF9hZXNfY2NtX2VuY3J5cHT7AxJqZF9hZXNfY2NtX2RlY3J5cHT8AwxBRVNfaW5pdF9jdHj9Aw9BRVNfRUNCX2VuY3J5cHT+AxBqZF9hZXNfc2V0dXBfa2V5/wMOamRfYWVzX2VuY3J5cHSABBBqZF9hZXNfY2xlYXJfa2V5gQQLamRfd3Nza19uZXeCBBRqZF93c3NrX3NlbmRfbWVzc2FnZYMEE2pkX3dlYnNvY2tfb25fZXZlbnSEBAdkZWNyeXB0hQQNamRfd3Nza19jbG9zZYYEEGpkX3dzc2tfb25fZXZlbnSHBAtyZXNwX3N0YXR1c4gEEndzc2toZWFsdGhfcHJvY2Vzc4kEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxligQUd3Nza2hlYWx0aF9yZWNvbm5lY3SLBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSMBA9zZXRfY29ubl9zdHJpbmeNBBFjbGVhcl9jb25uX3N0cmluZ44ED3dzc2toZWFsdGhfaW5pdI8EEXdzc2tfc2VuZF9tZXNzYWdlkAQRd3Nza19pc19jb25uZWN0ZWSRBBR3c3NrX3RyYWNrX2V4Y2VwdGlvbpIEEndzc2tfc2VydmljZV9xdWVyeZMEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWUBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xllQQPcm9sZW1ncl9wcm9jZXNzlgQQcm9sZW1ncl9hdXRvYmluZJcEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJgEFGpkX3JvbGVfbWFuYWdlcl9pbml0mQQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkmgQNamRfcm9sZV9hbGxvY5sEEGpkX3JvbGVfZnJlZV9hbGycBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5knQQTamRfY2xpZW50X2xvZ19ldmVudJ4EE2pkX2NsaWVudF9zdWJzY3JpYmWfBBRqZF9jbGllbnRfZW1pdF9ldmVudKAEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkoQQQamRfZGV2aWNlX2xvb2t1cKIEGGpkX2RldmljZV9sb29rdXBfc2VydmljZaMEE2pkX3NlcnZpY2Vfc2VuZF9jbWSkBBFqZF9jbGllbnRfcHJvY2Vzc6UEDmpkX2RldmljZV9mcmVlpgQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSnBA9qZF9kZXZpY2VfYWxsb2OoBBBzZXR0aW5nc19wcm9jZXNzqQQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKoEDXNldHRpbmdzX2luaXSrBA9qZF9jdHJsX3Byb2Nlc3OsBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXStBAxqZF9jdHJsX2luaXSuBBRkY2ZnX3NldF91c2VyX2NvbmZpZ68ECWRjZmdfaW5pdLAEDWRjZmdfdmFsaWRhdGWxBA5kY2ZnX2dldF9lbnRyebIEDGRjZmdfZ2V0X2kzMrMEDGRjZmdfZ2V0X3UzMrQED2RjZmdfZ2V0X3N0cmluZ7UEDGRjZmdfaWR4X2tlebYECWpkX3ZkbWVzZ7cEEWpkX2RtZXNnX3N0YXJ0cHRyuAQNamRfZG1lc2dfcmVhZLkEEmpkX2RtZXNnX3JlYWRfbGluZboEE2pkX3NldHRpbmdzX2dldF9iaW67BA1qZF9mc3Rvcl9pbml0vAQTamRfc2V0dGluZ3Nfc2V0X2Jpbr0EC2pkX2ZzdG9yX2djvgQPcmVjb21wdXRlX2NhY2hlvwQVamRfc2V0dGluZ3NfZ2V0X2xhcmdlwAQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZcEEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdlwgQWamRfc2V0dGluZ3Nfc3luY19sYXJnZcMEDWpkX2lwaXBlX29wZW7EBBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0xQQOamRfaXBpcGVfY2xvc2XGBBJqZF9udW1mbXRfaXNfdmFsaWTHBBVqZF9udW1mbXRfd3JpdGVfZmxvYXTIBBNqZF9udW1mbXRfd3JpdGVfaTMyyQQSamRfbnVtZm10X3JlYWRfaTMyygQUamRfbnVtZm10X3JlYWRfZmxvYXTLBBFqZF9vcGlwZV9vcGVuX2NtZMwEFGpkX29waXBlX29wZW5fcmVwb3J0zQQWamRfb3BpcGVfaGFuZGxlX3BhY2tldM4EEWpkX29waXBlX3dyaXRlX2V4zwQQamRfb3BpcGVfcHJvY2Vzc9AEFGpkX29waXBlX2NoZWNrX3NwYWNl0QQOamRfb3BpcGVfd3JpdGXSBA5qZF9vcGlwZV9jbG9zZdMEDWpkX3F1ZXVlX3B1c2jUBA5qZF9xdWV1ZV9mcm9udNUEDmpkX3F1ZXVlX3NoaWZ01gQOamRfcXVldWVfYWxsb2PXBA1qZF9yZXNwb25kX3U42AQOamRfcmVzcG9uZF91MTbZBA5qZF9yZXNwb25kX3UzMtoEEWpkX3Jlc3BvbmRfc3RyaW5n2wQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTcBAtqZF9zZW5kX3BrdN0EHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs3gQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLfBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V04AQUamRfYXBwX2hhbmRsZV9wYWNrZXThBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTiBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXjBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl5AQQamRfc2VydmljZXNfaW5pdOUEDmpkX3JlZnJlc2hfbm935gQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOcEFGpkX3NlcnZpY2VzX2Fubm91bmNl6AQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXpBBBqZF9zZXJ2aWNlc190aWNr6gQVamRfcHJvY2Vzc19ldmVyeXRoaW5n6wQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXsBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l7QQUYXBwX2dldF9kZXZpY2VfY2xhc3PuBBJhcHBfZ2V0X2Z3X3ZlcnNpb27vBA1qZF9zcnZjZmdfcnVu8AQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXxBBFqZF9zcnZjZmdfdmFyaWFudPIEDWpkX2hhc2hfZm52MWHzBAxqZF9kZXZpY2VfaWT0BAlqZF9yYW5kb231BAhqZF9jcmMxNvYEDmpkX2NvbXB1dGVfY3Jj9wQOamRfc2hpZnRfZnJhbWX4BAxqZF93b3JkX21vdmX5BA5qZF9yZXNldF9mcmFtZfoEEGpkX3B1c2hfaW5fZnJhbWX7BA1qZF9wYW5pY19jb3Jl/AQTamRfc2hvdWxkX3NhbXBsZV9tc/0EEGpkX3Nob3VsZF9zYW1wbGX+BAlqZF90b19oZXj/BAtqZF9mcm9tX2hleIAFDmpkX2Fzc2VydF9mYWlsgQUHamRfYXRvaYIFC2pkX3ZzcHJpbnRmgwUPamRfcHJpbnRfZG91YmxlhAUKamRfc3ByaW50ZoUFEmpkX2RldmljZV9zaG9ydF9pZIYFDGpkX3NwcmludGZfYYcFC2pkX3RvX2hleF9hiAUJamRfc3RyZHVwiQUJamRfbWVtZHVwigUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYsFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWMBRFqZF9zZW5kX2V2ZW50X2V4dI0FCmpkX3J4X2luaXSOBRRqZF9yeF9mcmFtZV9yZWNlaXZlZI8FHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrkAUPamRfcnhfZ2V0X2ZyYW1lkQUTamRfcnhfcmVsZWFzZV9mcmFtZZIFEWpkX3NlbmRfZnJhbWVfcmF3kwUNamRfc2VuZF9mcmFtZZQFCmpkX3R4X2luaXSVBQdqZF9zZW5klgUWamRfc2VuZF9mcmFtZV93aXRoX2NyY5cFD2pkX3R4X2dldF9mcmFtZZgFEGpkX3R4X2ZyYW1lX3NlbnSZBQtqZF90eF9mbHVzaJoFEF9fZXJybm9fbG9jYXRpb26bBQxfX2ZwY2xhc3NpZnmcBQVkdW1teZ0FCF9fbWVtY3B5ngUHbWVtbW92ZZ8FBm1lbXNldKAFCl9fbG9ja2ZpbGWhBQxfX3VubG9ja2ZpbGWiBQZmZmx1c2ijBQRmbW9kpAUNX19ET1VCTEVfQklUU6UFDF9fc3RkaW9fc2Vla6YFDV9fc3RkaW9fd3JpdGWnBQ1fX3N0ZGlvX2Nsb3NlqAUIX190b3JlYWSpBQlfX3Rvd3JpdGWqBQlfX2Z3cml0ZXirBQZmd3JpdGWsBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja60FFl9fcHRocmVhZF9tdXRleF91bmxvY2uuBQZfX2xvY2uvBQhfX3VubG9ja7AFDl9fbWF0aF9kaXZ6ZXJvsQUKZnBfYmFycmllcrIFDl9fbWF0aF9pbnZhbGlkswUDbG9ntAUFdG9wMTa1BQVsb2cxMLYFB19fbHNlZWu3BQZtZW1jbXC4BQpfX29mbF9sb2NruQUMX19vZmxfdW5sb2NrugUMX19tYXRoX3hmbG93uwUMZnBfYmFycmllci4xvAUMX19tYXRoX29mbG93vQUMX19tYXRoX3VmbG93vgUEZmFic78FA3Bvd8AFBXRvcDEywQUKemVyb2luZm5hbsIFCGNoZWNraW50wwUMZnBfYmFycmllci4yxAUKbG9nX2lubGluZcUFCmV4cF9pbmxpbmXGBQtzcGVjaWFsY2FzZccFDWZwX2ZvcmNlX2V2YWzIBQVyb3VuZMkFBnN0cmNocsoFC19fc3RyY2hybnVsywUGc3RyY21wzAUGc3RybGVuzQUHX191Zmxvd84FB19fc2hsaW3PBQhfX3NoZ2V0Y9AFB2lzc3BhY2XRBQZzY2FsYm7SBQljb3B5c2lnbmzTBQdzY2FsYm5s1AUNX19mcGNsYXNzaWZ5bNUFBWZtb2Rs1gUFZmFic2zXBQtfX2Zsb2F0c2NhbtgFCGhleGZsb2F02QUIZGVjZmxvYXTaBQdzY2FuZXhw2wUGc3RydG943AUGc3RydG9k3QUSX193YXNpX3N5c2NhbGxfcmV03gUIZGxtYWxsb2PfBQZkbGZyZWXgBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXhBQRzYnJr4gUIX19hZGR0ZjPjBQlfX2FzaGx0aTPkBQdfX2xldGYy5QUHX19nZXRmMuYFCF9fZGl2dGYz5wUNX19leHRlbmRkZnRmMugFDV9fZXh0ZW5kc2Z0ZjLpBQtfX2Zsb2F0c2l0ZuoFDV9fZmxvYXR1bnNpdGbrBQ1fX2ZlX2dldHJvdW5k7AUSX19mZV9yYWlzZV9pbmV4YWN07QUJX19sc2hydGkz7gUIX19tdWx0ZjPvBQhfX211bHRpM/AFCV9fcG93aWRmMvEFCF9fc3VidGYz8gUMX190cnVuY3RmZGYy8wULc2V0VGVtcFJldDD0BQtnZXRUZW1wUmV0MPUFCXN0YWNrU2F2ZfYFDHN0YWNrUmVzdG9yZfcFCnN0YWNrQWxsb2P4BRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50+QUVZW1zY3JpcHRlbl9zdGFja19pbml0+gUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfsFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2X8BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT9BQxkeW5DYWxsX2ppamn+BRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp/wUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB/QUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 26600;
var ___stop_em_js = Module['___stop_em_js'] = 27653;



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
