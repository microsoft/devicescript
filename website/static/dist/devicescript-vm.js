
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+eFgIAA5QUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEBBQMACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUFAQMAAwMEAgADAAIFAAQFBQMGAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAgQEAQoNAgIAAAcJCQEDBwECAAgAAgYABwkIAAQEBAAAAgcAAwcHAQIBABIDCQcAAAQAAgcAAgcEBwQEAwMDBQIIBQUFBwUHBwMDBQgFAAAEHwEDDgMDAAkHAwUEAwQABAMDAwMEBAUFAAAABAQHBwcHBAcHBwgICAcEBAMQCAMABAEACQEDAwEDBgQJIAkXAwMEAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIQ8FBAQEBQkEBAAAFAsLCxMLDwUIByILFBQLGBMSEgsjJCUmCwMDAwQEFwQEGQwVJwwoBhYpKgYOBAQACAQMFRoaDBErAgIICBUMDBkMLAAICAAECAcICAgtDS4Eh4CAgAABcAHXAdcBBYaAgIAAAQGAAoACBt2AgIAADn8BQfDwBQt/AUEAC38BQQALfwFBAAt/AEHozgELfwBB188BC38AQaHRAQt/AEGd0gELfwBBmdMBC38AQenTAQt/AEGK1AELfwBBj9YBC38AQejOAQt/AEGF1wELB/2FgIAAIwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwDaBRZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AlgUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUA2wUaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQALxFqZF9lbV9kZXZzX2RlcGxveQAwEWpkX2VtX2RldnNfdmVyaWZ5ADEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADMWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMLBmZmbHVzaACeBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQA9QUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQD2BRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAPcFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZAD4BQlzdGFja1NhdmUA8QUMc3RhY2tSZXN0b3JlAPIFCnN0YWNrQWxsb2MA8wUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudAD0BQ1fX3N0YXJ0X2VtX2pzAwwMX19zdG9wX2VtX2pzAw0MZHluQ2FsbF9qaWppAPoF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ASgCrAEiA0UNACAAIAMpAyA3AwAMAQsgACAGNwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEM4EGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQxwQaIAMgACgCBC0ADjoACiADKAIQDwtBiMkAQe07QTFBnjYQ/AQAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ/gINACADIAEpAwA3AxgCQAJAIAAgA0EYahCpAiICDQAgAyABKQMANwMQIAAgA0EQahCoAiEBDAELAkAgACACEKoCIgENAEEAIQEMAQsCQCAAIAIQlgINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDZAiADQShqIAAgBBC/AiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEJECIAFqIQIMAQsgACACQQBBABCRAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahChAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEPMCIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEGA2AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEP0CDg0BBAsFCQYDBwsICgIACwsgAUEDNgIAIAFBAjoACgwLCyABQQA2AgAgAUECOgAKDAoLIAFBBjoACiABIAIpAwA3AgAMCQsgAUECOgAKIAMgAikDADcDCCABQQFBAiAAIANBCGoQ9gIbNgIADAgLIAFBAToACiADIAIpAwA3AxAgASAAIANBEGoQ9AI5AgAMBwsgAUHRADoACiACKAIAIQIgASAENgIAIAEgAi8BCEGAgICAeHI2AgQMBgsgASAENgIAIAFBMDoACiADIAIpAwA3AxggASAAIANBGGpBABBgNgIEDAULIAEgBDYCACABQQM6AAoMBAsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgDBHDQUgASAENgIAIAFB1AA6AAoMAwsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgChHDQUgASAENgIAIAFB0wA6AAogASACLwEEQYCAgIB4cjYCBAwCCyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICA0ABHDQUgASAENgIAIAFB1gA6AAogASACKAIcLwEEQYCAgIB4cjYCBAwBCyABQQc6AAogASACKQMANwIACyADQdAAaiQADwtB/88AQe07QZMBQcMpEPwEAAtBiMYAQe07QfQBQcMpEPwEAAtBpcMAQe07QfsBQcMpEPwEAAtB0MEAQe07QYQCQcMpEPwEAAuDAQEEfyMAQRBrIgEkACABIAAtAEY2AgBBACgCtNwBIQJBqDUgARA8IAAoAqwBIgMhBAJAIAMNACAAKAKwASEEC0EAIQMCQCAEIgRFDQAgBCgCHCEDCyABIAM2AgggASAALQBGOgAMIAJBAToACSACQYABIAFBCGpBCBCIBSABQRBqJAALEABBAEH42QAQ3wQ2ArTcAQuEAgECfyMAQSBrIgQkACAEIAIpAwA3AwggACAEQRBqIARBCGoQYQJAAkACQAJAIAQtABoiBUFfakEDSQ0A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QgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEOwCQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFBtDFBABDqAgsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhDyAgwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEOwCQQAhAgwBCwJAIAAgASgCEBB9IgINACABQRhqIABBtDFBABDqAgsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABB/jJBABDqAgwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDsAkEAIQAMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQbQxQQAQ6gILIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALMgEBfwJAIABBABC1AiIBQQBIDQAgACgCrAEiACABEHggACAALQAQQfABcUEEcjoAEAsLGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABBryVBABDqAgwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahChAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBuCAgA0EIahDtAgwBCyAAIAEgASgCoAEgBEH//wNxEJwCIAApAwBCAFINACADQdgAaiABQQggASABQQIQkgIQkAEQ8wIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI4BIANB0ABqQfsAENkCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCxAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQmgIgAyAAKQMANwMQIAEgA0EQahCPAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahChAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ7AIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwHAygFODQIgAEHA5AAgAUEDdGovAQAQ2QIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtB5hNB8DlBMUGGLBD8BAAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahD+Ag0AIAFBOGogAEH/GRDrAgsgASABKQNINwMgIAFBOGogACABQSBqEN0CIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjgEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ2AIiAkUNACABQTBqIAAgAiABKAI4QQEQiQIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCPASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQtQIhAiABIAEpAyA3AwgCQCABQQhqEP4CDQAgAUEYaiAAQdkbEOsCCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEI8CIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD0ApsQtwILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ9AKcELcCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPQCEMQFELcCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEPECCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahD0AiIERAAAAAAAAAAAY0UNACAAIASaELcCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEPAEuEQAAAAAAADwPaIQtwILZAEFfwJAAkAgAEEAELUCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQ8AQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRC4AgsRACAAIABBABC2AhCvBRC3AgsYACAAIABBABC2AiAAQQEQtgIQuwUQtwILLgEDfyAAQQAQtQIhAUEAIQICQCAAQQEQtQIiA0UNACABIANtIQILIAAgAhC4AgsuAQN/IABBABC1AiEBQQAhAgJAIABBARC1AiIDRQ0AIAEgA28hAgsgACACELgCCxYAIAAgAEEAELUCIABBARC1AmwQuAILCQAgAEEBEM4BC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEPUCIQMgAiACKQMgNwMQIAAgAkEQahD1AiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ9AIhBiACIAIpAyA3AwAgACACEPQCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDuGw3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsg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A0F/ag4DAQIAAwsgASAAKAIsIAAvARIQ/AEgACABKQMANwMgQQEhAgwECwJAIAAoAiwiAigCtAEgAC8BEiIEQQxsaigCACgCECIDDQAgAEEAEHdBACECDAQLAkAgAkGnAmotAABBAXENACACQbICai8BACIFRQ0AIAUgAC8BFEcNACADLQAEIgUgAkGxAmotAABHDQAgA0EAIAVrQQxsakFkaikDACACQagCaikCAFINACACIAQgAC8BCBD/ASIDRQ0AIAJBoARqIAMQwgIaQQEhAgwECwJAIAAoAhggAigCwAFLDQAgAUEANgIMQQAhBAJAIAAvAQgiA0UNACACIAMgAUEMahCSAyEECyACQaQCaiEFIAAvARQhBiAALwESIQcgASgCDCEDIAJBAToApwIgAkGmAmogA0EHakH8AXE6AAAgAigCtAEgB0EMbGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAQiBEUNACACQbQCaiAEIAMQmQUaCyAFENgEIgNFIQIgAw0DAkAgAC8BCiIEQecHSw0AIAAgBEEBdDsBCgsgACAALwEKEHggAiECIAMNBAtBACECDAMLAkAgACgCLCICKAK0ASAALwESQQxsaigCACgCECIEDQAgAEEAEHdBACECDAMLIAAoAgghBSAALwEUIQYgAC0ADCEDIAJBpwJqQQE6AAAgAkGmAmogA0EHakH8AXE6AAAgBEEAIAQtAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAVFDQAgAkG0AmogBSADEJkFGgsCQCACQaQCahDYBCICDQAgAkUhAgwDCyAAQQMQeEEAIQIMAgtB0T1B1gJB5h8Q9wQACyAAQQMQeCACIQILIAFBEGokACACC9MCAQZ/IwBBEGsiAyQAIABBtAJqIQQgAEGwAmotAAAhBQJAAkACQAJAIAINACAFIQUgBCEEDAELIAAgAiADQQxqEJIDIQYCQAJAIAMoAgwiByAALQCwAk4NACAEIAdqLQAADQAgBiAEIAcQswUNACAHQQFqIQcMAQtBACEHCyAHIgdFDQEgBSAHayEFIAQgB2oh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SQ0AQdTdASABEM0CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjdASABIAMgACADIABJGyIAEJkFGkEAQQAoAszdASIJIABrNgLM3QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU3QFBiN0BEM0CQQBBwAA2AszdAUEAQYjdATYCyN0BIAIhAyABIQEgAg0BDAILQQBBACgCyN0BIABqNgLI3QEgAiEDIAEhASACDQALCyAIENMCIAhBIBDSAgJAIAVFDQBBAEEAKALQ3QEgBWo2AtDdASAFIQMgBCEBA0AgASEBIAMhAwJAQQAoAszdASIAQcAARw0AIANBwABJDQBB1N0BIAEQzQIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCyN0BIAEgAyAAIAMgAEkbIgAQmQUaQQBBACgCzN0BIgkgAGs2AszdASABIABqIQEgAyAAayECAkAgCSAARw0AQdTdAUGI3QEQzQJBAEHAADYCzN0BQQBBiN0BNgLI3QEgAiEDIAEhASACDQEMAgtBAEEAKALI3QEgAGo2AsjdASACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAtDdASAHajYC0N0BIAchAyAGIQEDQCABIQEgAyEDAkBBACgCzN0BIgBBwABHDQAgA0HAAEkNAEHU3QEgARDNAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALI3QEgASADIAAgAyAASRsiABCZBRpBAEEAKALM3QEiCSAAazYCzN0BIAEgAGohASADIABrIQICQCAJIABHDQBB1N0BQYjdARDNAkEAQcAANgLM3QFBAEGI3QE2AsjdASACIQMgASEBIAINAQwCC0EAQQAoAsjdASAAajYCyN0BIAIhAyABIQEgAg0ACwtBAEEAKALQ3QFBAWo2AtDdAUEBIQNBuNcAIQECQANAIAEhASADIQMCQEEAKALM3QEiAEHAAEcNACADQcAASQ0AQdTdASABEM0CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAsjdASABIAMgACADIABJGyIAEJkFGkEAQQAoAszdASIJIABrNgLM3QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHU3QFBiN0BEM0CQQBBwAA2AszdAUEAQYjdATYCyN0BIAIhAyABIQEgAg0BDAILQQBBACgC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ABCjAgJAAkAgAikDWFBFDQBBACEDDAELIAIgAikDWDcDKCAAQZMgIAJBKGoQygJBASEDCyADIQMgAiABKQMANwMgIAJB0ABqIAAgAkEgakH2ABCjAgJAAkAgAikDUFBFDQAgAyEDDAELIAIgAikDUDcDGCAAQZwtIAJBGGoQygIgAiABKQMANwMQIAJByABqIAAgAkEQakHxABCjAgJAIAIpA0hQDQAgAiACKQNINwMIIAAgAkEIahDkAgsgA0EBaiEDCyADIQMLAkAgAw0AIAIgASkDADcDACAAQZMgIAIQygILIAJB4ABqJAALiAQBBn8jAEHgAGsiAyQAAkACQCAALQBFRQ0AIAMgASkDADcDQCAAQbELIANBwABqEMoCDAELAkAgACgCqAENACADIAEpAwA3A1hB/R9BABA8IABBADoARSADIAMpA1g3AwAgACADEOUCIABB5dQDEIIBDAELIABBAToARSAAIAEpAwA3AzggAyABKQMANwM4IAAgA0E4ahC9AiEEIAJBAXENACAERQ0AIAMgASkDADcDMCADQdgAaiAAIANBMGpB8QAQowIgAykDWEIAUg0AAkACQCAAKAKoASICDQBBACEFDAELIAIhAkEAIQQDQCAEQQFqIgQhBSACKAIMIgYhAiAEIQQgBg0ACwsCQAJAIAAgBSICQRAgAkEQSRsiBUEBdBCTASIHRQ0AAkAgACgCqAEiAkUNACAFRQ0AIAdBDGohCCACIQJBACEEA0AgCCAEIgRBAXRqIAIiAi8BBDsBACACKAIMIgJFDQEgAiECIARBAWoiBiEEIAYgBUkNAAsLIANB0ABqIABBCCAHEPMCDAELIANCADcDUAsgAyADKQNQNwMoIAAgA0EoahCOASADQcgAakHxABDZAiADIAEpAwA3AyAgAyADKQNINwMYIAMgAykDUDcDECAAIANBIGogA0EYaiADQRBqELECIAMgAykDUDcDCCAAIANBCGoQjwELIANB4ABqJAAL0AcCDH8BfiMAQRBrIgEkACAAKQM4Ig2nIQICQAJAAkACQCANQiCIpyIDDQAgAkGACEkNACACQQ9xIQQgAkGAeGpBBHYhBQwBCwJAIAAtAEcNAEEAIQRBACEFDAELAkACQCAALQBIRQ0AQQEhBkEAIQcMAQtBASEGQQAhByAALQBJQQNxRQ0AIAAoAqgBIgdBAEchBAJAAkAgBw0AIAQhCAwBCyAEIQQgByEFA0AgBCEJQQAhBwJAIAUiBigCECIELQAOIgVFDQAgBiAELwEIQQN0akEYaiEHCyAHIQggBi8BBCEKAkAgBUUNAEEAIQQgBSEFA0AgBCELAkAgCCAFIgdBf2oiBUEBdGovAQAiBEUNACAGIAQ7AQQgBiAAEIcDQdIARw0AIAYgCjsBBCAJIQggC0EBcQ0CDAQLIAdBAkghBCAFIQUgB0EBSg0ACwsgBiAKOwEEIAYoAgwiB0EARyIGIQQgByEFIAYhCCAHDQALC0EAIQZBAiEHIAhBAXFFDQAgAC0ASSIHQQJxRSEGIAdBHnRBH3VBA3EhBwtBACEEQQAhBSAHIQcgBkUNAQtBAEEDIAUiChshCUF/QQAgChshDCAEIQcCQANAIAchCyAAKAKoASIIRQ0BAkACQCAKRQ0AIAsNACAIIAo7AQQgCyEHQQMhBAwBCwJAAkAgCCgCECIHLQAOIgQNAEEAIQcMAQsgCCAHLwEIQQN0akEYaiEFIAQhBwNAAkAgByIHQQFODQBBACEHDAILIAdBf2oiBCEHIAUgBEEBdGoiBC8BACIGRQ0ACyAEQQA7AQAgBiEHCwJAIAciBw0AAkAgCkUNACABQQhqIABB/AAQgwEgCyEHQQMhBAwCCyAIKAIMIQcgACgCrAEgCBB5AkAgB0UNACALIQdBAiEEDAILIAEgAzYCDCABIAI2AghB/R9BABA8IABBADoARSABIAEpAwg3AwAgACABEOUCIABB5dQDEIIBIAshB0EDIQQMAQsgCCAHOwEEAkACQAJAAkAgCCAAEIcDQa5/ag4CAAECCyALIAxqIQcgCSEEDAMLIApFDQEgAUEIaiAKIAtBf2oQgwMgACABKQMINwM4IAAtAEdFDQEgACgC2AEgACgCqAFHDQEgAEEIEI0DDAELIAFBCGogAEH9ABCDASALIQdBAyEEDAELIAshB0EDIQQLIAchByAEQQNHDQALCyAAQQA6AEUgAEEAOgBCAkAgACgCrAEiB0UNACAHIAApAzg3AyALIABCADcDOEEIIQcgAC0AB0UNAQsgACAHEI0DCyABQRBqJAALigEBAX8jAEEgayIFJAACQAJAIAEgASACEJICEJABIgINACAAQgA3AwAMAQsgACABQQggAhDzAiAFIAApAwA3AxAgASAFQRBqEI4BIAVBGGogASADIAQQ2gIgBSAFKQMYNwMIIAEgAkH2ACAFQQhqEN8CIAUgACkDADcDACABIAUQjwELIAVBIGokAAtTAQF/IwBBIGsiBCQAIAQgAzYCFCAEQRhqIAFBHiACIAMQ6AICQCAEKQMYUA0AIAQgBCkDGDcDCCABIARBCGpBAhDmAgsgAEIANwMAIARBIGokAAtTAQF/IwBBIGsiBCQAIAQgAzYCFCAEQRhqIAFBICACIAMQ6AICQCAEKQMYUA0AIAQgBCkDGDcDCCABIARBCGpBAhDmAgsgAEIANwMAIARBIGokAAsoAQF/IwBBEGsiAyQAIAMgAjYCACAAIAFByNAAIAMQ6QIgA0EQaiQAC1ICAX8BfiMAQSBrIgQkACACEJADIQIgBCADKQMAIgU3AxAgBCAFNwMYIAQgASAEQRBqEMsCNgIEIAQgAjYCACAAIAFB1xUgBBDpAiAEQSBqJAALQAEBfyMAQRBrIgQkACAEIAMpAwA3AwggBCABIARBCGoQywI2AgQgBCACNgIAIAAgAUHXFSAEEOkCIARBEGokAAsqAQF/IwBBEGsiAyQAIAMgAhCQAzYCACAAIAFBziYgAxDqAiADQRBqJAALUwEBfyMAQSBrIgQkACAEIAM2AhQgBEEYaiABQSIgAiADEOgCAkAgBCkDGFANACAEIAQpAxg3AwggASAEQQhqQQIQ5gILIABCADcDACAEQSBqJAALwwICAX4EfwJAAkACQAJAIAEQlwUOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIgiKciAyACpyIEcg0AIABCgICAgHA3AwAPCwJAIANBFHZB/w9xIgVB/wdJDQACQAJAIAVBkwhLDQAgBA0CAkAgBUGTCEYNACADQf//P3EgBUGNeGp0DQMLIANB//8/cUGAgMAAckGTCCAFa3YhAwwBCwJAIAVBnghJDQAgBA0CIANBgICAj3xHDQIgAEKAgICAeDcDAA8LIAQgBUHtd2oiBnQNASADQf//P3FBgIDAAHIgBnQgBEGzCCAFa3ZyIQMLIABBfzYCBCAAQQAgAyIDayADIAJCAFMbNgIADwsgACABOQMACxAAIAAgATYCACAAQX82AgQLDwAgAELAAEIBIAEbNwMAC0MAAkAgAw0AIABCADcDAA8LAkAgAkEIcUUNACABIAMQmQEgACADNgIAIAAgAjYCBA8LQZfTAEGEPEHbAEG/GhD8BAALlQICAn8BfCMAQSBrIgIkAAJAAkAgASgCBCIDQX9HDQAgASgCALchBAwBCwJAIAFBBmovAQBB8P8BcUUNACABKwMAIQQMAQsCQCADDQACQAJAAkACQAJAIAEoAgAiAUFAag4EAQQCAwALRAAAAAAAAAAAIQQgAUF/ag4DBQMFAwtEAAAAAAAA8D8hBAwEC0QAAAAAAADwfyEEDAMLRAAAAAAAAPD/IQQMAgtEAAAAAAAA+H8hBAwBCyACIAEpAwA3AxACQCAAIAJBEGoQ1gJFDQAgAiABKQMANwMIIAAgAkEIaiACQRxqENgCIgEgAkEYahDYBSEEIAEgAigCGEcNAQtEAAAAAAAA+H8hBAsgAkEgaiQAIAQL1gECAX8BfCMAQRBrIgIkAAJAAkACQAJAIAEoAgRBAWoOAgABAgsgASgCACEBDAILIAEoAgBBP0shAQwBCyACIAEpAwA3AwhBACEBIAAgAkEIahD0AiIDvUL///////////8Ag0KAgICAgICA+P8AVg0AAkACQCADnUQAAAAAAADwQRCfBSIDRAAAAAAAAPBBoCADIANEAAAAAAAAAABjGyIDRAAAAAAAAPBBYyADRAAAAAAAAAAAZnFFDQAgA6shAQwBC0EAIQELIAEhAQsgAkEQaiQAIAELsAEBAX8jAEEgayICJAACQAJAAkACQCABKAIEQQFqDgIAAQILIAEoAgBBAEchAQwCCyABKAIAQT9LIQEMAQsgAiABKQMANwMQAkAgACACQRBqENYCRQ0AIAIgASkDADcDCCAAIAJBCGogAkEcahDYAhogAigCHEEARyEBDAELAkAgAUEGai8BAEHw/wFxDQBBASEBDAELIAErAwBEAAAAAAAAAABhIQELIAJBIGokACABC2EBAn9BACECAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxG0F8ag4FAQICAgACC0EAIQIgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgChGDwsgASgCAEGAgAFJIQILIAILbAECf0EAIQICQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbIgNBfGoOBQECAgIAAgtBACECIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAoRiECDAELIAEoAgBBgIABSSECCyADQQRHIAJxC8QBAQJ/AkACQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbIgRBfGoOBQEDAwMAAwsgASgCACIDRQ0CIAMoAgBBgICA+ABxQYCAgChGIQMMAQsgASgCAEGAgAFJIQMLIANFDQACQAJAAkAgBEF8ag4FAgEBAQABCyABKAIAIQECQCACRQ0AIAIgAS8BBDYCAAsgAUEMag8LQYQ8QdEBQbU+EPcEAAsgACABKAIAIAIQkgMPC0Gx0ABBhDxBwwFBtT4Q/AQAC90BAQJ/IwBBIGsiAyQAAkACQAJAAkACQEEQIAEoAgQiBEEPcSAEQYCAwP8HcRtBfGoOBQEDAwMAAwsgASgCACIERQ0CIAQoAgBBgICA+ABxQYCAgChGIQQMAQsgASgCAEGAgAFJIQQLIARFDQAgAyABKQMANwMYIAAgA0EYaiACEPkCIQEMAQsgAyABKQMANwMQAkAgACADQRBqENYCRQ0AIAMgASkDADcDCCAAIANBCGogAhDYAiEBDAELAkAgAg0AQQAhAQwBCyACQQA2AgBBACEBCyADQSBqJAAgAQsjAEEAIAEoAgBBACABKAIEIgFBD3FBCEYbIAFBgIDA/wdxGwtSAQF/AkAgASgCBCICQYCAwP8HcUUNAEEADwsCQCACQQ9xQQhGDQBBAA8LQQAhAgJAIAEoAgAiAUUNACABKAIAQYCAgPgAcUGAgIAYRiECCyACC60DAQN/IwBBEGsiAiQAAkACQCABKAIEIgNBf0cNAEEBIQQMAQtBASEEAkACQAJAAkACQAJAAkACQAJAQRAgA0EPcSABQQZqLwEAQfD/AXEbDhEAAQYCBAIFBwMCAgcHBwcHCQcLQQwhBAJAAkACQAJAIAEoAgAiAQ5EAAECDAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwEDAgIDC0EAIQQMCwtBBiEEDAoLQQEhBAwJC0ECIQQgAUGgf2pBJEkNCEELIQQgAUH/B0sNCEGEPEGIAkH+JhD3BAALQQchBAwHC0EIIQQMBgsCQAJAIAEoAgAiAQ0AQX0hAQwBCyABLQADQQ9xQX1qIQELIAEiAUEJSQ0EQYQ8QaUCQf4mEPcEAAtBBEEJIAEoAgBBgIABSRshBAwECyACIAEpAwA3AwhBCEECIAAgAkEIakEAEJ0CLwECQYAgSRshBAwDC0EFIQQMAgtBhDxBsgJB/iYQ9wQACyABQQJ0QdDsAGooAgAhBAsgAkEQaiQAIAQLEQAgACgCBEUgACgCAEEESXELJAEBf0EAIQECQCAAKAIEDQAgACgCACIARSAAQQNGciEBCyABC2sBAn8jAEEQayIDJAACQAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEIEDIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqENYCDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqENYCRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahDYAiECIAMgAykDMDcDCCAAIANBCGogA0E4ahDYAiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAELMFRSEBCyABIQELIAEhBAsgA0HAAGokACAEC8ABAQJ/IwBBMGsiAyQAQQEhBAJAIAEpAwAgAikDAFENACADIAEpAwA3AyACQCAAIANBIGoQ1gINAEEAIQQMAQsgAyACKQMANwMYQQAhBCAAIANBGGoQ1gJFDQAgAyABKQMANwMQIAAgA0EQaiADQSxqENgCIQQgAyACKQMANwMIIAAgA0EIaiADQShqENgCIQJBACEBAkAgAygCLCIAIAMoAihHDQAgBCACIAAQswVFIQELIAEhBAsgA0EwaiQAIAQLWQACQAJAIAJBEE8NACABRQ0BIAFBgICACE4NASAAQQA2AgQgACABQQR0IAJyQYAIajYCAA8LQdXAAEGEPEH3AkHrNRD8BAALQf3AAEGEPEH4AkHrNRD8BAALjAEBAX9BACECAkAgAUH//wNLDQBBmgEhAgJAAkACQAJAAkACQCABQQ52DgQDBQABAgsgACgCAEHEAGohAkEBIQAMAwsgACgCAEHMAGohAkEDIQAMAgtByzdBOUHKIxD3BAALIAAoAgBB1ABqIQJBAyEACyACKAIAIAB2IQILIAFB//8AcSACSSECCyACC20BAn8jAEEgayIBJAAgACgACCEAEOgEIQIgAUEYaiAAQf//A3E2AgAgAUEQaiAAQRh2NgIAIAFBFGogAEEQdkH/AXE2AgAgAUEENgIMIAFCgoCAgCA3AgQgASACNgIAQZA0IAEQPCABQSBqJAALhyECDH8BfiMAQbAEayICJAACQAJAAkAgAEEDcQ0AAkAgAUHwAE0NACACIAA2AqgEAkACQCAAKAIAQcTK2ZsFRw0AIAAoAgRBityliX9GDQELIAJC6Ac3A5AEQbcKIAJBkARqEDxBmHghAAwECwJAAkAgACgCCCIDQYCAgHhxQYCAgBBHDQAgA0GAgPwHcUGAgAxJDQELQYolQQAQPCAAKAAIIQAQ6AQhASACQfADakEYaiAAQf//A3E2AgAgAkHwA2pBEGogAEEYdjYCACACQYQEaiAAQRB2Qf8BcTYCACACQQQ2AvwDIAJCgoCAgCA3AvQDIAIgATYC8ANBkDQgAkHwA2oQPCACQpoINwPgA0G3CiACQeADahA8QeZ3IQAMBAtBACEEIABBIGohBUEAIQMDQCADIQMgBCEGAkACQAJAIAUiBSgCACIEIAFNDQBB6QchA0GXeCEEDAELAkAgBSgCBCIHIARqIAFNDQBB6gchA0GWeCEEDAELAkAgBEEDcUUNAEHrByEDQZV4IQQMAQsCQCAHQQNxRQ0AQewHIQNBlHghBAwBCyADRQ0BIAVBeGoiB0EEaigCACAHKAIAaiAERg0BQfIHIQNBjnghBAsgAiADNgLQAyACIAUgAGs2AtQDQbcKIAJB0ANqEDwgBiEHIAQhCAwECyADQQhLIgchBCAFQQhqIQUgA0EBaiIGIQMgByEHIAZBCkcNAAwDCwALQd/QAEHLN0HHAEGsCBD8BAALQZXMAEHLN0HGAEGsCBD8BAALIAghAwJAIAdBAXENACADIQAMAQsCQCAAQTRqLQAAQQdxRQ0AIAJC84eAgIAGNwPAA0G3CiACQcADahA8QY14IQAMAQsgACAAKAIwaiIFIAUgACgCNGoiBEkhBwJAAkAgBSAESQ0AIAchBCADIQcMAQsgByEGIAMhCCAFIQkDQCAIIQMgBiEEAkACQCAJIgYpAwAiDkL/////b1gNAEELIQUgAyEDDAELAkACQCAOQv///////////wCDQoCAgICAgID4/wBYDQBBkwghA0HtdyEHDAELIAJBoARqIA6/EPACQQAhBSADIQMgAikDoAQgDlENAUGUCCEDQex3IQcLIAJBMDYCtAMgAiADNgKwA0G3CiACQbADahA8QQEhBSAHIQMLIAQhBCADIgMhBwJAIAUODAACAgICAgICAgICAAILIAZBCGoiBCAAIAAoAjBqIAAoAjRqSSIFIQYgAyEIIAQhCSAFIQQgAyEHIAUNAAsLIAchAwJAIARBAXFFDQAgAyEADAELAkAgAEEkaigCAEGA6jBJDQAgAkKjiICAgAY3A6ADQbcKIAJBoANqEDxB3XchAAwBCyAAIAAoAiBqIgUgBSAAKAIkaiIESSEHAkACQCAFIARJDQAgByEBQTAhBSADIQMMAQsCQAJAAkACQCAFLwEIIAUtAApPDQAgByEKQTAhCwwBCyAFQQpqIQggBSEFIAAoAighBiADIQkgByEEA0AgBCEMIAkhDSAGIQYgCCEKIAUiAyAAayEJAkAgAygCACIFIAFNDQAgAiAJNgL0ASACQekHNgLwAUG3CiACQfABahA8IAwhASAJIQVBl3ghAwwFCwJAIAMoAgQiBCAFaiIHIAFNDQAgAiAJNgKEAiACQeoHNgKAAkG3CiACQYACahA8IAwhASAJIQVBlnghAwwFCwJAIAVBA3FFDQAgAiAJNgKUAyACQesHNgKQA0G3CiACQZADahA8IAwhASAJIQVBlXghAwwFCwJAIARBA3FFDQAgAiAJNgKEAyACQewHNgKAA0G3CiACQYADahA8IAwhASAJIQVBlHghAwwFCwJAAkAgACgCKCIIIAVLDQAgBSAAKAIsIAhqIgtNDQELIAIgCTYClAIgAkH9BzYCkAJBtwogAkGQAmoQPCAMIQEgCSEFQYN4IQMMBQsCQAJAIAggB0sNACAHIAtNDQELIAIgCTYCpAIgAkH9BzYCoAJBtwogAkGgAmoQPCAMIQEgCSEFQYN4IQMMBQsCQCAFIAZGDQAgAiAJNgL0AiACQfwHNgLwAkG3CiACQfACahA8IAwhASAJIQVBhHghAwwFCwJAIAQgBmoiB0GAgARJDQAgAiAJNgLkAiACQZsINgLgAkG3CiACQeACahA8IAwhASAJIQVB5XchAwwFCyADLwEMIQUgAiACKAKoBDYC3AICQCACQdwCaiAFEIQDDQAgAiAJNgLUAiACQZwINgLQAkG3CiACQdACahA8IAwhASAJIQVB5HchAwwFCwJAIAMtAAsiBUEDcUECRw0AIAIgCTYCtAIgAkGzCDYCsAJBtwogAkGwAmoQPCAMIQEgCSEFQc13IQMMBQsgDSEEAkAgBUEFdMBBB3UgBUEBcWsgCi0AAGpBf0oiBQ0AIAIgCTYCxAIgAkG0CDYCwAJBtwogAkHAAmoQPEHMdyEECyAEIQ0gBUUNAiADQRBqIgUgACAAKAIgaiAAKAIkaiIGSSEEAkAgBSAGSQ0AIAQhAQwECyAEIQogCSELIANBGmoiDCEIIAUhBSAHIQYgDSEJIAQhBCADQRhqLwEAIAwtAABPDQALCyACIAsiAzYC5AEgAkGmCDYC4AFBtwogAkHgAWoQPCAKIQEgAyEFQdp3IQMMAgsgDCEBCyAJIQUgDSEDCyADIQcgBSEIAkAgAUEBcUUNACAHIQAMAQsCQCAAQdwAaigCACIBIAAgACgCWGoiBWpBf2otAABFDQAgAiAINgLUASACQaMINgLQAUG3CiACQdABahA8Qd13IQAMAQsCQCAAQcwAaigCACIDQQBMDQAgACAAKAJIaiIEIANqIQYgBCEDA0ACQCADIgMoAgAiBCABSQ0AIAIgCDYCxAEgAkGkCDYCwAFBtwogAkHAAWoQPEHcdyEADAMLAkAgAygCBCAEaiIEIAFJDQAgAiAINgK0ASACQZ0INgKwAUG3CiACQbABahA8QeN3IQAMAwsCQCAFIARqLQAADQAgA0EIaiIEIQMgBCAGTw0CDAELCyACIAg2AqQBIAJBngg2AqABQbcKIAJBoAFqEDxB4nchAAwBCwJAIABB1ABqKAIAIgNBAEwNACAAIAAoAlBqIgQgA2ohBiAEIQMDQAJAIAMiAygCACIEIAFJDQAgAiAINgKUASACQZ8INgKQAUG3CiACQZABahA8QeF3IQAMAwsCQCADKAIEIARqIAFPDQAgA0EIaiIEIQMgBCAGTw0CDAELCyACIAg2AoQBIAJBoAg2AoABQbcKIAJBgAFqEDxB4HchAAwBCwJAAkAgACAAKAJAaiIBIAEgAEHEAGooAgBqSSIDDQAgAyENIAchAQwBCyADIQQgByEHIAEhBgNAIAchDSAEIQogBiIJLwEAIgQhAQJAIAAoAlwiBiAESw0AIAIgCDYCdCACQaEINgJwQbcKIAJB8ABqEDwgCiENQd93IQEMAgsCQANAAkAgASIBIARrQcgBSSIHDQAgAiAINgJkIAJBogg2AmBBtwogAkHgAGoQPEHedyEBDAILAkAgBSABai0AAEUNACABQQFqIgMhASADIAZJDQELCyANIQELIAEhAQJAIAdFDQAgCUECaiIDIAAgACgCQGogACgCRGoiCUkiDSEEIAEhByADIQYgDSENIAEhASADIAlPDQIMAQsLIAohDSABIQELIAEhAQJAIA1BAXFFDQAgASEADAELAkACQCAAIAAoAjhqIgMgAyAAQTxqKAIAakkiBQ0AIAUhCSAIIQUgASEDDAELIAUhBCABIQcgAyEGA0AgByEDIAQhCCAGIgEgAGshBQJAAkACQCABKAIAQRx2QX9qQQFNDQBBkAghA0HwdyEHDAELIAEvAQQhByACIAIoAqgENgJcQQEhBCADIQMgAkHcAGogBxCEAw0BQZIIIQNB7nchBwsgAiAFNgJUIAIgAzYCUEG3CiACQdAAahA8QQAhBCAHIQMLIAMhAwJAIARFDQAgAUEIaiIBIAAgACgCOGogACgCPGoiCEkiCSEEIAMhByABIQYgCSEJIAUhBSADIQMgASAITw0CDAELCyAIIQkgBSEFIAMhAwsgAyEBIAUhAwJAIAlBAXFFDQAgASEADAELIAAvAQ4iBUEARyEEAkACQCAFDQAgBCEJIAMhBiABIQEMAQsgACAAKAJgaiENIAQhBSABIQRBACEHA0AgBCEGIAUhCCANIAciBUEEdGoiASAAayEDAkACQAJAIAFBEGogACAAKAJgaiAAKAJkIgRqSQ0AQbIIIQFBznchBwwBCwJAAkACQCAFDgIAAQILAkAgASgCBEHz////AUYNAEGnCCEBQdl3IQcMAwsgBUEBRw0BCyABKAIEQfL///8BRg0AQagIIQFB2HchBwwBCwJAIAEvAQpBAnQiByAESQ0AQakIIQFB13chBwwBCwJAIAEvAQhBA3QgB2ogBE0NAEGqCCEBQdZ3IQcMAQsgAS8BACEEIAIgAigCqAQ2AkwCQCACQcwAaiAEEIQDDQBBqwghAUHVdyEHDAELAkAgAS0AAkEOcUUNAEGsCCEBQdR3IQcMAQsCQAJAIAEvAQhFDQAgDSAHaiEMIAYhCUEAIQoMAQtBASEEIAMhAyAGIQcMAgsDQCAJIQcgDCAKIgpBA3RqIgMvAQAhBCACIAIoAqgENgJIIAMgAGshBgJAAkAgAkHIAGogBBCEAw0AIAIgBjYCRCACQa0INgJAQbcKIAJBwABqEDxBACEDQdN3IQQMAQsCQAJAIAMtAARBAXENACAHIQcMAQsCQAJAAkAgAy8BBkECdCIDQQRqIAAoAmRJDQBBrgghBEHSdyELDAELIA0gA2oiBCEDAkAgBCAAIAAoAmBqIAAoAmRqTw0AA0ACQCADIgMvAQAiBA0AAkAgAy0AAkUNAEGvCCEEQdF3IQsMBAtBrwghBEHRdyELIAMtAAMNA0EBIQkgByEDDAQLIAIgAigCqAQ2AjwCQCACQTxqIAQQhAMNAEGwCCEEQdB3IQsMAwsgA0EEaiIEIQMgBCAAIAAoAmBqIAAoAmRqSQ0ACwtBsQghBEHPdyELCyACIAY2AjQgAiAENgIwQbcKIAJBMGoQPEEAIQkgCyEDCyADIgQhB0EAIQMgBCEEIAlFDQELQQEhAyAHIQQLIAQhBwJAIAMiA0UNACAHIQkgCkEBaiILIQogAyEEIAYhAyAHIQcgCyABLwEITw0DDAELCyADIQQgBiEDIAchBwwBCyACIAM2AiQgAiABNgIgQbcKIAJBIGoQPEEAIQQgAyEDIAchBwsgByEBIAMhBgJAIARFDQAgBUEBaiIDIAAvAQ4iCEkiCSEFIAEhBCADIQcgCSEJIAYhBiABIQEgAyAITw0CDAELCyAIIQkgBiEGIAEhAQsgASEBIAYhAwJAIAlBAXFFDQAgASEADAELAkAgAEHsAGooAgAiBUUNAAJAAkAgACAAKAJoaiIEKAIIIAVNDQAgAiADNgIEIAJBtQg2AgBBtwogAhA8QQAhA0HLdyEADAELAkAgBBCsBCIFDQBBASEDIAEhAAwBCyACIAAoAmg2AhQgAiAFNgIQQbcKIAJBEGoQPEEAIQNBACAFayEACyAAIQAgA0UNAQtBACEACyACQbAEaiQAIAALXgECfyMAQRBrIgIkAAJAAkAgAC8BBCIDIAAvAQZPDQAgASgCpAEhASAAIANBAWo7AQQgASADai0AACEADAELIAJBCGogAUHkABCDAUEAIQALIAJBEGokACAAQf8BcQslAAJAIAAtAEYNAEF/DwsgAEEAOgBGIAAgAC0ABkEQcjoABkEACywAIAAgAToARwJAIAENACAALQBGRQ0AIABBADoARiAAIAAtAAZBEHI6AAYLCz4AIAAoAtwBECIgAEH6AWpCADcBACAAQfQBakIANwIAIABB7AFqQgA3AgAgAEHkAWpCADcCACAAQgA3AtwBC7ICAQR/AkAgAQ0AQQAPCwJAIAFBgIAETw0AAkAgAC8B4AEiAg0AIAJBAEcPCyAAKALcASEDQQAhBAJAA0ACQCADIAQiBEECdGoiBS8BACABRw0AIAUgBUEEaiACIARBf3NqQQJ0EJoFGiAALwHgASICQQJ0IAAoAtwBIgNqQXxqQQA7AQAgAEH6AWpCADcBACAAQfIBakIANwEAIABB6gFqQgA3AQAgAEIANwHiAQJAIAINAEEBDwtBACEEA0ACQCADIAQiBEECdGovAQAiBUUNACAAIAVBH3FqQeIBaiIFLQAADQAgBSAEQQFqOgAACyAEQQFqIgUhBEEBIQEgBSACRw0ADAMLAAsgBEEBaiIFIQQgBSACRw0AC0EAIQELIAEPC0GKNkGNOkHUAEGfDxD8BAALJAACQCAAKAKoAUUNACAAQQQQjQMPCyAAIAAtAAdBgAFyOgAHC+QCAQd/AkAgAC0AR0UNAAJAIAAtAAdBAnFFDQAgACgC3AEhAiAALwHgASIDIQRBACEFAkAgA0UNAEEAIQZBACEDA0AgAyEDAkACQCACIAYiBkECdGoiBy0AAkEBcUUNACADIQMMAQsgAiADQQJ0aiAHKAEANgEAIANBAWohAwsgAC8B4AEiByEEIAMiAyEFIAZBAWoiCCEGIAMhAyAIIAdJDQALCyACIAUiA0ECdGpBACAEIANrQQJ0EJsFGiAAQfoBakIANwEAIABB8gFqQgA3AQAgAEHqAWpCADcBACAAQgA3AeIBIAAvAeABIgdFDQAgACgC3AEhCEEAIQMDQAJAIAggAyIDQQJ0ai8BACIGRQ0AIAAgBkEfcWpB4gFqIgYtAAANACAGIANBAWo6AAALIANBAWoiBiEDIAYgB0cNAAsLIABBADoAByAAQQA2AtgBIAAtAEYNACAAIAE6AEYgABBiCwvPBAEKfwJAIAFBgIAETw0AAkAgAQ0AQX4PCwJAAkACQCAALwHgASIDRQ0AIANBAnQgACgC3AEiBGpBfGovAQANACAEIQQgAyEDDAELQX8hBSADQe8BSw0BIANBAXQiA0HoASADQegBSRtBCGoiA0ECdBAhIAAoAtwBIAAvAeABQQJ0EJkFIQQgACgC3AEQIiAAIAM7AeABIAAgBDYC3AEgBCEEIAMhAwsgBCEGIAMiB0EBIAdBAUsbIQhBACEDQQAhBAJAA0AgBCEEAkACQAJAIAYgAyIFQQJ0aiIDLwEAIglFDQAgCSABc0EfcSEKAkACQCAEQQFxRQ0AIAoNAQsCQCAKRQ0AQQEhC0EAIQwgCkUhCgwEC0EBIQtBACEMQQEhCiAJIAFJDQMLAkAgCSABRw0AIAMtAAIgAkcNAEEAIQtBASEMDAILIANBBGogAyAHIAVBf3NqQQJ0EJoFGgsgAyABOwEAIAMgAjoAAkEAIQtBBCEMCyAEIQoLIAohBCAMIQMgC0UNASAFQQFqIgUhAyAEIQQgBSAIRw0AC0EEIQMLQQAhBSADQQRHDQAgAEIANwHiASAAQfoBakIANwEAIABB8gFqQgA3AQAgAEHqAWpCADcBAAJAIAAvAeABIgENAEEBDwsgACgC3AEhCUEAIQMDQAJAIAkgAyIDQQJ0ai8BACIERQ0AIAAgBEEfcWpB4gFqIgQtAAANACAEIANBAWo6AAALIANBAWoiBCEDQQEhBSAEIAFHDQALCyAFDwtBijZBjTpBgwFBiA8Q/AQAC7YHAgt/AX4jAEEQayIBJAACQCAALAAHQX9KDQAgAEEEEI0DCwJAIAAoAqgBIgJFDQAgAiECQYCACCEDAkADQCACIQIgA0F/aiIERQ0BIAAtAEYNAgJAAkAgAC0AR0UNAAJAIAAtAEhFDQAgAEEAOgBIDAELIAAgAi8BBCIFQR9xakHiAWotAAAiA0UNACAAKALcASIGIANBf2oiA0ECdGovAQAiByEIIAMhAyAFIAdJDQADQCADIQMCQCAFIAhB//8DcUcNAAJAIAYgA0ECdGotAAJBAXFFDQAgACgC2AEgAkcNASAAQQgQjQMMBAsgAEEBEI0DDAMLIAYgA0EBaiIDQQJ0ai8BACIHIQggAyEDIAUgB08NAAsLAkACQCACLwEEIgMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIMBQQAhAwsgAyIDQf8BcSEGAkAgA8BBf0oNACABIAZB8H5qEPECAkAgAC0AQiICQQpJDQAgAUEIaiAAQeUAEIMBDAILIAEpAwAhDCAAIAJBAWo6AEIgACACQQN0akHQAGogDDcDAAwBCwJAIAZB3gBJDQAgAUEIaiAAQeYAEIMBDAELAkAgBkHo8QBqLQAAIglBIHFFDQAgACACLwEEIgNBf2o7AUACQAJAIAMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIMBQQAhAwsCQAJAIANB/wFxIgpB+AFPDQAgCiEDDAELIApBA3EhC0EAIQVBACEIA0AgCCEIIAUhAwJAAkAgAi8BBCIFIAIvAQZPDQAgACgCpAEhByACIAVBAWo7AQQgByAFai0AACEHDAELIAFBCGogAEHkABCDAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQdDKASAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCDAQwBCyABIAIgAEHQygEgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQgwEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQ5wILIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQggELIAFBEGokAAskAQF/QQAhAQJAIABBmQFLDQAgAEECdEGA7QBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARCEAw0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBgO0AaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRDIBTYCACAFIQEMAgtBjTpBuQJB4McAEPcEAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEJEDIgEhAgJAIAENACADQQhqIABB6AAQgwFBudcAIQILIANBEGokACACCzwBAX8jAEEQayICJAACQCAAKACkAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQfkAEIMBCyACQRBqJAAgAQtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEIQDDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQgwELDgAgACACIAIoAkwQvgILNQACQCABLQBCQQFGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEAQQAQdhoLNQACQCABLQBCQQJGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEBQQAQdhoLNQACQCABLQBCQQNGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUECQQAQdhoLNQACQCABLQBCQQRGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEDQQAQdhoLNQACQCABLQBCQQVGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEEQQAQdhoLNQACQCABLQBCQQZGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEFQQAQdhoLNQACQCABLQBCQQdGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEGQQAQdhoLNQACQCABLQBCQQhGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEHQQAQdhoLNQACQCABLQBCQQlGDQBB5cgAQcY4Qc0AQdvDABD8BAALIAFBADoAQiABKAKsAUEIQQAQdhoL9gECA38BfiMAQdAAayICJAAgAkHIAGogARDyAyACQcAAaiABEPIDIAEoAqwBQQApA7BsNwMgIAEgAikDSDcDMCACIAIpA0A3AzACQCABIAJBMGoQpQIiA0UNACACIAIpA0g3AygCQCABIAJBKGoQ1gIiBA0AIAIgAikDSDcDICACQThqIAEgAkEgahDdAiACIAIpAzgiBTcDSCACIAU3AxggASACQRhqEI4BCyACIAIpA0g3AxACQCABIAMgAkEQahCbAg0AIAEoAqwBQQApA6hsNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahCPAQsgAkHQAGokAAteAQJ/IwBBEGsiAiQAIAEoAqwBIQMgAkEIaiABEPIDIAMgAikDCDcDICADIAAQeQJAIAEtAEdFDQAgASgC2AEgAEcNACABLQAHQQhxRQ0AIAFBCBCNAwsgAkEQaiQAC2IBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCDAUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4UBAQR/IwBBIGsiAiQAIAJBEGogARDyAyACIAIpAxA3AwggASACQQhqEPYCIQMCQAJAIAAoAhAoAgAgASgCTCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABCDAUEAIQULAkAgBSIBRSADcg0AIAAgATsBBAsgAkEgaiQAC48BAQF/IwBBMGsiAyQAIANBKGogAhDyAyADQSBqIAIQ8gMCQCADKAIkQY+AwP8HcQ0AIAMoAiBBoH9qQSNLDQAgAyADKQMgNwMQIANBGGogAiADQRBqQdgAEKMCIAMgAykDGDcDIAsgAyADKQMoNwMIIAMgAykDIDcDACAAIAIgA0EIaiADEJ8CIANBMGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCEAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwELIAJBARCSAiEEIAMgAykDEDcDACAAIAIgBCADEKwCIANBIGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARDyAwJAAkAgASgCTCIDIAAoAhAvAQhJDQAgAiABQe8AEIMBDAELIAAgA0EDdGpBGGogAikDCDcDAAsgAkEQaiQAC1YBAn8jAEEQayICJAAgAkEIaiABEPIDAkACQCABKAJMIgMgASgCpAEvAQxJDQAgAiABQfEAEIMBDAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC2EBA38jAEEgayICJAAgAkEYaiABEPIDIAEQ8wMhAyABEPMDIQQgAkEQaiABQQEQ9QMCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBJCyACQSBqJAALDQAgAEEAKQPAbDcDAAs3AQF/AkAgAigCTCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIMBCzgBAX8CQCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIMBC3EBAX8jAEEgayIDJAAgA0EYaiACEPIDIAMgAykDGDcDEAJAAkACQCADQRBqENcCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahD0AhDwAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEPIDIANBEGogAhDyAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQsAIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEPIDIAJBIGogARDyAyACQRhqIAEQ8gMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCxAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDyAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQhAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDyAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQhAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDyAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQhAMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIMBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQrgILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQhAMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQQAQkgIhBCADIAMpAxA3AwAgACACIAQgAxCsAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQhAMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIMBCyACQRUQkgIhBCADIAMpAxA3AwAgACACIAQgAxCsAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEJICEJABIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEPMCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDzAyIDEJIBIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPMCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDzAyIDEJMBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEPMCIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBCEAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEIQDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCDAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQhAMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIMBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBCEAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCDAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEPECC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQgwELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCDASAAQgA3AwAMAQsgACACQQggAiAEEKQCEPMCCyADQRBqJAALXwEDfyMAQRBrIgMkACACEPMDIQQgAhDzAyEFIANBCGogAkECEPUDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDyAyADIAMpAwg3AwAgACACIAMQ/QIQ8QIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDyAyAAQajsAEGw7AAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA6hsNwMACw0AIABBACkDsGw3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ8gMgAyADKQMINwMAIAAgAiADEPYCEPICIANBEGokAAsNACAAQQApA7hsNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEPIDAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEPQCIgREAAAAAAAAAABjRQ0AIAAgBJoQ8AIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkDoGw3AwAMAgsgAEEAIAJrEPECDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhD0A0F/cxDxAgsyAQF/IwBBEGsiAyQAIANBCGogAhDyAyAAIAMoAgxFIAMoAghBAkZxEPICIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhDyAwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxD0ApoQ8AIMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQOgbDcDAAwBCyAAQQAgAmsQ8QILIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhDyAyADIAMpAwg3AwAgACACIAMQ9gJBAXMQ8gIgA0EQaiQACwwAIAAgAhD0AxDxAgupAgIFfwF8IwBBwABrIgMkACADQThqIAIQ8gMgAkEYaiIEIAMpAzg3AwAgA0E4aiACEPIDIAIgAykDODcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBIIAUoAgAiByAGaiIGIAdIcw0AIAAgBhDxAgwBCyADIAUpAwA3AzACQAJAIAIgA0EwahDWAg0AIAMgBCkDADcDKCACIANBKGoQ1gJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahDgAgwBCyADIAUpAwA3AyAgAiACIANBIGoQ9AI5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEPQCIgg5AwAgACAIIAIrAyCgEPACCyADQcAAaiQAC80BAgV/AXwjAEEgayIDJAAgA0EYaiACEPIDIAJBGGoiBCADKQMYNwMAIANBGGogAhDyAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASiAFKAIAIgcgBmsiBiAHSHMNACAAIAYQ8QIMAQsgAyAFKQMANwMQIAIgAiADQRBqEPQCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahD0AiIIOQMAIAAgAisDICAIoRDwAgsgA0EgaiQAC88BAwR/AX4BfCMAQSBrIgMkACADQRhqIAIQ8gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPIDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBTQCACAENAIAfiIHQiCIpyAHpyIGQR91Rw0AIAAgBhDxAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ9AI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPQCIgg5AwAgACAIIAIrAyCiEPACCyADQSBqJAAL6AECBn8BfCMAQSBrIgMkACADQRhqIAIQ8gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPIDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQACQAJAIAQoAgAiBkEBag4CAAIBCyAFKAIAQYCAgIB4Rg0BCyAFKAIAIgcgBm0iCCAGbCAHRw0AIAAgCBDxAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ9AI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPQCIgk5AwAgACACKwMgIAmjEPACCyADQSBqJAALLAECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCECAAIAQgAygCAHEQ8QILLAECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCECAAIAQgAygCAHIQ8QILLAECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCECAAIAQgAygCAHMQ8QILLAECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCECAAIAQgAygCAHQQ8QILLAECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCECAAIAQgAygCAHUQ8QILQQECfyACQRhqIgMgAhD0AzYCACACIAIQ9AMiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQ8AIPCyAAIAIQ8QILnQEBA38jAEEgayIDJAAgA0EYaiACEPIDIAJBGGoiBCADKQMYNwMAIANBGGogAhDyAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEIEDIQILIAAgAhDyAiADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ8gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPIDIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEPQCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahD0AiIGOQMAIAIrAyAgBmUhAgwBCyAFKAIAIAQoAgBMIQILIAAgAhDyAiADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ8gMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPIDIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEPQCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahD0AiIGOQMAIAIrAyAgBmMhAgwBCyAFKAIAIAQoAgBIIQILIAAgAhDyAiADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEPIDIAJBGGoiBCADKQMYNwMAIANBGGogAhDyAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEIEDQQFzIQILIAAgAhDyAiADQSBqJAALPgEBfyMAQRBrIgMkACADQQhqIAIQ8gMgAyADKQMINwMAIABBqOwAQbDsACADEP8CGykDADcDACADQRBqJAAL4gEBBX8jAEEQayICJAAgAkEIaiABEPIDAkACQCABEPQDIgNBAU4NAEEAIQMMAQsCQAJAIAANACAAIQMgAEEARyEEDAELIAAhBSADIQYDQCAGIQAgBSgCCCIDQQBHIQQCQCADDQAgAyEDIAQhBAwCCyADIQUgAEF/aiEGIAMhAyAEIQQgAEEBSg0ACwsgAyEAQQAhAyAERQ0AIAAgASgCTCIDQQN0akEYakEAIAMgACgCEC8BCEkbIQMLAkACQCADIgMNACACIAFB8AAQgwEMAQsgAyACKQMINwMACyACQRBqJAALxAEBBH8CQAJAIAIQ9AMiA0EBTg0AQQAhAwwBCwJAAkAgAQ0AIAEhAyABQQBHIQQMAQsgASEFIAMhBgNAIAYhASAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSABQX9qIQYgAyEDIAQhBCABQQFKDQALCyADIQFBACEDIARFDQAgASACKAJMIgNBA3RqQRhqQQAgAyABKAIQLwEISRshAwsCQCADIgMNACAAIAJB9AAQgwEPCyAAIAMpAwA3AwALNgEBfwJAIAIoAkwiAyACKACkAUEkaigCAEEEdkkNACAAIAJB9QAQgwEPCyAAIAIgASADEKACC7oBAQN/IwBBIGsiAyQAIANBEGogAhDyAyADIAMpAxA3AwhBACEEAkAgAiADQQhqEP0CIgVBDEsNACAFQcfyAGotAAAhBAsCQAJAIAQiBA0AIABCADcDAAwBCyACIAQ2AkwgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAAXIiBBCEAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyAAKQMAQgBSDQAgA0EYaiACQfoAEIMBCyADQSBqJAALgwEBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCDAUEAIQQLAkAgBCIERQ0AIAIgASgCrAEpAyA3AwAgAhD/AkUNACABKAKsAUIANwMgIAAgBDsBBAsgAkEQaiQAC6QBAQJ/IwBBMGsiAiQAIAJBKGogARDyAyACQSBqIAEQ8gMgAiACKQMoNwMQAkACQAJAIAEgAkEQahD8Ag0AIAIgAikDKDcDCCACQRhqIAFBDyACQQhqEOwCDAELIAEtAEINASABQQE6AEMgASgCrAEhAyACIAIpAyg3AwAgA0EAIAEgAhD7AhB2GgsgAkEwaiQADwtBnsoAQcY4QeoAQcwIEPwEAAtaAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQgwFBACEECyAAIAEgBBDiAiACQRBqJAALewEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIMBQQAhBAsCQCAEIgRFDQAgACAEOwEECwJAIAAgARDjAg0AIAJBCGogAUHqABCDAQsgAkEQaiQACyEBAX8jAEEQayICJAAgAkEIaiABQesAEIMBIAJBEGokAAtGAQF/IwBBEGsiAiQAAkACQCAAIAEQ4wIgAC8BBEF/akcNACABKAKsAUIANwMgDAELIAJBCGogAUHtABCDAQsgAkEQaiQAC10BAX8jAEEgayICJAAgAkEYaiABEPIDIAIgAikDGDcDCAJAAkAgAkEIahD/AkUNACACQRBqIAFBlDJBABDpAgwBCyACIAIpAxg3AwAgASACQQAQ5gILIAJBIGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARDyAwJAIAIpAwhQDQAgAiACKQMINwMAIAEgAkEBEOYCCyACQRBqJAALmAEBBH8jAEEQayICJAACQAJAIAEQ9AMiA0EQSQ0AIAJBCGogAUHuABCDAQwBCwJAAkAgACgCECgCACABKAJMIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEIaiABQekAEIMBQQAhBQsgBSIARQ0AIAJBCGogACADEIMDIAIgAikDCDcDACABIAJBARDmAgsgAkEQaiQACwkAIAFBBxCNAwuCAgEDfyMAQSBrIgMkACADQRhqIAIQ8gMgAyADKQMYNwMAAkACQAJAAkAgAiADIANBEGogA0EMahChAiIEQX9KDQAgACACQfUgQQAQ6QIMAQsCQAJAIARB0IYDSA0AIARBsPl8aiIEQQAvAcDKAU4NA0HA5AAgBEEDdGotAANBCHENASAAIAJBoxlBABDpAgwCCyAEIAIoAKQBIgVBJGooAgBBBHZODQMgBSAFKAIgaiAEQQR0ai0AC0ECcQ0AIAAgAkGrGUEAEOkCDAELIAAgAykDGDcDAAsgA0EgaiQADwtB5hNBxjhBzQJB5gsQ/AQAC0Hq0gBBxjhB0gJB5gsQ/AQAC1YBAn8jAEEgayIDJAAgA0EYaiACEPIDIANBEGogAhDyAyADIAMpAxg3AwggAiADQQhqEKsCIQQgAyADKQMQNwMAIAAgAiADIAQQrQIQ8gIgA0EgaiQACw0AIABBACkDyGw3AwALnQEBA38jAEEgayIDJAAgA0EYaiACEPIDIAJBGGoiBCADKQMYNwMAIANBGGogAhDyAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEIADIQILIAAgAhDyAiADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEPIDIAJBGGoiBCADKQMYNwMAIANBGGogAhDyAyACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEIADQQFzIQILIAAgAhDyAiADQSBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQ8gMgASgCrAEgAikDCDcDICACQRBqJAALPwEBfwJAIAEtAEIiAg0AIAAgAUHsABCDAQ8LIAEgAkF/aiICOgBCIAAgASACQf8BcUEDdGpB0ABqKQMANwMAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCDAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARD1AiEAIAFBEGokACAAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCDAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARD1AiEAIAFBEGokACAAC4kCAgJ/AX4jAEHAAGsiAyQAAkACQCABLQBCIgQNACADQThqIAFB7AAQgwEMAQsgASAEQX9qIgQ6AEIgAyABIARB/wFxQQN0akHQAGopAwA3AzgLIAMgAykDODcDKAJAAkAgASADQShqEPcCDQACQCACQQJxRQ0AIAMgAykDODcDICABIANBIGoQ1gINAQsgAyADKQM4NwMYIANBMGogAUESIANBGGoQ7AJCACEFDAELAkAgAkEBcUUNACADIAMpAzg3AxAgASADQRBqEPgCDQAgAyADKQM4NwMIIANBMGogAUGvGyADQQhqEO0CQgAhBQwBCyADKQM4IQULIAAgBTcDACADQcAAaiQAC6AEAQV/AkAgBEH2/wNPDQAgABD6A0EAQQE6AODeAUEAIAEpAAA3AOHeAUEAIAFBBWoiBSkAADcA5t4BQQAgBEEIdCAEQYD+A3FBCHZyOwHu3gFBAEEJOgDg3gFB4N4BEPsDAkAgBEUNAEEAIQADQAJAIAQgACIGayIAQRAgAEEQSRsiB0UNACADIAZqIQhBACEAA0AgACIAQeDeAWoiCSAJLQAAIAggAGotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLQeDeARD7AyAGQRBqIgkhACAJIARJDQALCyACQQAoAuDeATYAAEEAQQE6AODeAUEAIAEpAAA3AOHeAUEAIAUpAAA3AObeAUEAQQA7Ae7eAUHg3gEQ+wNBACEAA0AgAiAAIgBqIgkgCS0AACAAQeDeAWotAABzOgAAIABBAWoiCSEAIAlBBEcNAAsCQCAERQ0AIAFBBWohBUEAIQBBASEJA0BBAEEBOgDg3gFBACABKQAANwDh3gFBACAFKQAANwDm3gFBACAJIgZBCHQgBkGA/gNxQQh2cjsB7t4BQeDeARD7AwJAIAQgACICayIAQRAgAEEQSRsiB0UNACADIAJqIQhBACEAA0AgCCAAIgBqIgkgCS0AACAAQeDeAWotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLIAJBEGoiByEAIAZBAWohCSAHIARJDQALCxD8Aw8LQaQ6QTJBxA4Q9wQAC78FAQZ/QX8hBQJAIARB9f8DSw0AIAAQ+gMCQAJAIARFDQAgAUEFaiEGQQAhAEEBIQcDQEEAQQE6AODeAUEAIAEpAAA3AOHeAUEAIAYpAAA3AObeAUEAIAciCEEIdCAIQYD+A3FBCHZyOwHu3gFB4N4BEPsDAkAgBCAAIglrIgBBECAAQRBJGyIFRQ0AIAMgCWohCkEAIQADQCAKIAAiAGoiByAHLQAAIABB4N4Bai0AAHM6AAAgAEEBaiIHIQAgByAFRw0ACwsgCUEQaiIFIQAgCEEBaiEHIAUgBEkNAAtBAEEBOgDg3gFBACABKQAANwDh3gFBACABQQVqKQAANwDm3gFBAEEJOgDg3gFBACAEQQh0IARBgP4DcUEIdnI7Ae7eAUHg3gEQ+wMgBEUNAUEAIQADQAJAIAQgACIIayIAQRAgAEEQSRsiBUUNACADIAhqIQpBACEAA0AgACIAQeDeAWoiByAHLQAAIAogAGotAABzOgAAIABBAWoiByEAIAcgBUcNAAsLQeDeARD7AyAIQRBqIgchACAHIARJDQAMAgsAC0EAQQE6AODeAUEAIAEpAAA3AOHeAUEAIAFBBWopAAA3AObeAUEAQQk6AODeAUEAIARBCHQgBEGA/gNxQQh2cjsB7t4BQeDeARD7AwtBACEAA0AgAiAAIgBqIgcgBy0AACAAQeDeAWotAABzOgAAIABBAWoiByEAIAdBBEcNAAtBAEEBOgDg3gFBACABKQAANwDh3gFBACABQQVqKQAANwDm3gFBAEEAOwHu3gFB4N4BEPsDQQAhAANAIAIgACIAaiIHIActAAAgAEHg3gFqLQAAczoAACAAQQFqIgchACAHQQRHDQALEPwDQQAhAEEAIQcDQCAAIgVBAWoiCiEAIAcgAiAFai0AAGoiBSEHIAUhBSAKQQRHDQALCyAFC90DAQh/QQAhAgNAIAAgAiIDQQJ0IgJqIAEgAmotAAA6AAAgACACQQFyIgRqIAEgBGotAAA6AAAgACACQQJyIgRqIAEgBGotAAA6AAAgACACQQNyIgJqIAEgAmotAAA6AAAgA0EBaiIDIQIgA0EIRw0AC0EIIQIDQCACIgNBAnQiASAAaiICQX9qLQAAIQUgAkF+ai0AACEGIAJBfWotAAAhByACQXxqLQAAIQgCQAJAIANBB3EiBEUNACAFIQkgBiEFIAchBiAIIQcMAQsgCEHg8gBqLQAAIQkgBUHg8gBqLQAAIQUgBkHg8gBqLQAAIQYgA0EDdkHg9ABqLQAAIAdB4PIAai0AAHMhBwsgByEHIAYhBiAFIQUgCSEIAkACQCAEQQRGDQAgCCEEIAUhBSAGIQYgByEHDAELIAhB/wFxQeDyAGotAAAhBCAFQf8BcUHg8gBqLQAAIQUgBkH/AXFB4PIAai0AACEGIAdB/wFxQeDyAGotAAAhBwsgAiACQWBqLQAAIAdzOgAAIAAgAUEBcmogAkFhai0AACAGczoAACAAIAFBAnJqIAJBYmotAAAgBXM6AAAgACABQQNyaiACQWNqLQAAIARzOgAAIANBAWoiASECIAFBPEcNAAsLzAUBCX9BACECA0AgAiIDQQJ0IQRBACECA0AgASAEaiACIgJqIgUgBS0AACAAIAIgBGpqLQAAczoAACACQQFqIgUhAiAFQQRHDQALIANBAWoiBCECIARBBEcNAAtBASECA0AgAiEGQQAhAgNAIAIhBUEAIQIDQCABIAIiAkECdGogBWoiBCAELQAAQeDyAGotAAA6AAAgAkEBaiIEIQIgBEEERw0ACyAFQQFqIgQhAiAEQQRHDQALIAEtAAEhAiABIAEtAAU6AAEgAS0ACSEEIAEgAS0ADToACSABIAQ6AAUgASACOgANIAEtAAIhAiABIAEtAAo6AAIgASACOgAKIAEtAAYhAiABIAEtAA46AAYgASACOgAOIAEtAAMhAiABIAEtAA86AAMgASABLQALOgAPIAEgAS0ABzoACyABIAI6AAcCQCAGQQ5GDQBBACECA0AgASACIgdBAnRqIgIgAi0AAyIEIAItAAAiBXMiA0EBdCADwEEHdkEbcXMgBHMgBCACLQACIgNzIgggAi0AASIJIAVzIgpzIgRzOgADIAIgAyAIQQF0IAjAQQd2QRtxc3MgBHM6AAIgAiAJIAMgCXMiA0EBdCADwEEHdkEbcXNzIARzOgABIAIgBSAKQQF0IArAQQd2QRtxc3MgBHM6AAAgB0EBaiIEIQIgBEEERw0ACyAGQQR0IQlBACECA0AgAiIIQQJ0IgUgCWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACyAGQQFqIQIMAQsLQQAhAgNAIAIiCEECdCIFQeABaiEDQQAhAgNAIAEgBWogAiICaiIEIAQtAAAgACADIAJqai0AAHM6AAAgAkEBaiIEIQIgBEEERw0ACyAIQQFqIgQhAiAEQQRHDQALCwsAQfDeASAAEPgDCwsAQfDeASAAEPkDCw8AQfDeAUEAQfABEJsFGgvNAQEFfyMAQRBrIgQkAEEAIQVBACEGA0AgBSADIAYiBmotAABqIgchBSAGQQFqIgghBiAIQSBHDQALAkAgBw0AQY7XAEEAEDxB3TpBMEHaCxD3BAALQQAgAykAADcA4OABQQAgA0EYaikAADcA+OABQQAgA0EQaikAADcA8OABQQAgA0EIaikAADcA6OABQQBBAToAoOEBQYDhAUEQECkgBEGA4QFBEBCDBTYCACAAIAEgAkHgFCAEEIIFIgUQQyEGIAUQIiAEQRBqJAAgBgvXAgEEfyMAQRBrIgQkAAJAAkACQBAjDQACQCAADQAgAkUNAEF/IQUMAwsCQCAAQQBHQQAtAKDhASIGQQJGcUUNAEF/IQUMAwtBfyEFIABFIAZBA0ZxDQIgAyABaiIGQQRqIgcQISEFAkAgAEUNACAFIAAgARCZBRoLAkAgAkUNACAFIAFqIAIgAxCZBRoLQeDgAUGA4QEgBSAGaiAFIAYQ9gMgBSAHEEIhACAFECIgAA0BQQwhAgNAAkAgAiIAQYDhAWoiBS0AACICQf8BRg0AIABBgOEBaiACQQFqOgAAQQAhBQwECyAFQQA6AAAgAEF/aiECQQAhBSAADQAMAwsAC0HdOkGnAUGHLRD3BAALIARBhBk2AgBBxhcgBBA8AkBBAC0AoOEBQf8BRw0AIAAhBQwBC0EAQf8BOgCg4QFBA0GEGUEJEIIEEEggACEFCyAEQRBqJAAgBQvdBgICfwF+IwBBkAFrIgMkAAJAECMNAAJAAkACQAJAIABBfmoOAwECAAMLAkACQAJAQQAtAKDhAUF/ag4DAAECBQsgAyACNgJAQZXRACADQcAAahA8AkAgAkEXSw0AIANBzB82AgBBxhcgAxA8QQAtAKDhAUH/AUYNBUEAQf8BOgCg4QFBA0HMH0ELEIIEEEgMBQsgA0H4AGpBEGogAUEQaikAADcDACADQfgAakEIaiABQQhqKQAANwMAIAMgASkAACIFNwN4AkAgBadBytGQ93xGDQAgA0HlNjYCMEHGFyADQTBqEDxBAC0AoOEBQf8BRg0FQQBB/wE6AKDhAUEDQeU2QQkQggQQSAwFCwJAIAMoAnxBAkYNACADQZghNgIgQcYXIANBIGoQPEEALQCg4QFB/wFGDQVBAEH/AToAoOEBQQNBmCFBCxCCBBBIDAULQQBBAEHg4AFBIEGA4QFBECADQYABakEQQeDgARDUAkEAQgA3AIDhAUEAQgA3AJDhAUEAQgA3AIjhAUEAQgA3AJjhAUEAQQI6AKDhAUEAQQE6AIDhAUEAQQI6AJDhAQJAQQBBIEEAQQAQ/gNFDQAgA0GcJDYCEEHGFyADQRBqEDxBAC0AoOEBQf8BRg0FQQBB/wE6AKDhAUEDQZwkQQ8QggQQSAwFC0GMJEEAEDwMBAsgAyACNgJwQbTRACADQfAAahA8AkAgAkEjSw0AIANB4Q02AlBBxhcgA0HQAGoQPEEALQCg4QFB/wFGDQRBAEH/AToAoOEBQQNB4Q1BDhCCBBBIDAQLIAEgAhCABA0DQQAhAAJAAkAgAS0AAA0AQQAhAgNAIAIiBEEBaiIAQSBGDQIgACECIAEgAGotAABFDQALIARBHkshAAsgACEAIANBmMkANgJgQcYXIANB4ABqEDwCQEEALQCg4QFB/wFGDQBBAEH/AToAoOEBQQNBmMkAQQoQggQQSAsgAEUNBAtBAEEDOgCg4QFBAUEAQQAQggQMAwsgASACEIAEDQJBBCABIAJBfGoQggQMAgsCQEEALQCg4QFB/wFGDQBBAEEEOgCg4QELQQIgASACEIIEDAELQQBB/wE6AKDhARBIQQMgASACEIIECyADQZABaiQADwtB3TpBwAFBzQ8Q9wQAC/4BAQN/IwBBIGsiAiQAAkACQAJAIAFBBEsNACACQaUlNgIAQcYXIAIQPEGlJSEBQQAtAKDhAUH/AUcNAUF/IQEMAgtB4OABQZDhASAAIAFBfGoiAWogACABEPcDIQNBDCEAAkADQAJAIAAiAUGQ4QFqIgAtAAAiBEH/AUYNACABQZDhAWogBEEBajoAAAwCCyAAQQA6AAAgAUF/aiEAIAENAAsLAkAgAw0AQQAhAQwCCyACQc4ZNgIQQcYXIAJBEGoQPEHOGSEBQQAtAKDhAUH/AUcNAEF/IQEMAQtBAEH/AToAoOEBQQMgAUEJEIIEEEhBfyEBCyACQSBqJAAgAQs0AQF/AkAQIw0AAkBBAC0AoOEBIgBBBEYNACAAQf8BRg0AEEgLDwtB3TpB2gFBoSoQ9wQAC/kIAQR/IwBBgAJrIgMkAEEAKAKk4QEhBAJAAkACQAJAAkAgAEF/ag4EAAIDAQQLIAMgBCgCODYCEEGCFiADQRBqEDwgBEGAAjsBECAEQQAoAqzXASIAQYCAgAhqNgI0IAQgAEGAgIAQajYCKCAELwEGQQFGDQMgA0G0xwA2AgQgA0EBNgIAQdLRACADEDwgBEEBOwEGIARBAyAEQQZqQQIQiAUMAwsgBEEAKAKs1wEiAEGAgIAIajYCNCAEIABBgICAEGo2AigCQCACRQ0AIAMgAS0AACIAOgD/ASACQX9qIQUgAUEBaiEGAkACQAJAAkACQAJAAkACQAJAIABB8H5qDgoCAwwEBQYHAQgACAsgAS0AA0EMaiIEIAVLDQggBiAEEIUFIgQQjgUaIAQQIgwLCyAFRQ0HIAEtAAEgAUECaiACQX5qEFcMCgsgBC8BECECIAQgAS0AAkEIdCABLQABIgByOwEQAkAgAEEBcUUNACAEKAJkDQAgBEGACBDSBDYCZAsCQCAELQAQQQJxRQ0AIAJBAnENACAEELMENgIYCyAEQQAoAqzXAUGAgIAIajYCFCADIAQvARA2AmBB/wogA0HgAGoQPAwJCyADIAA6ANABIAQvAQZBAUcNCAJAIABB5QBqQf8BcUH9AUsNACADIAA2AnBBgAogA0HwAGoQPAsgA0HQAWpBAUEAQQAQ/gMNCCAEKAIMIgBFDQggBEEAKAKo6gEgAGo2AjAMCAsgA0HQAWoQbBpBACgCpOEBIgQvAQZBAUcNBwJAIAMtAP8BIgBB5QBqQf8BcUH9AUsNACADIAA2AoABQYAKIANBgAFqEDwLIANB/wFqQQEgA0HQAWpBIBD+Aw0HIAQoAgwiAEUNByAEQQAoAqjqASAAajYCMAwHCyAAIAEgBiAFEJoFKAIAEGoQgwQMBgsgACABIAYgBRCaBSAFEGsQgwQMBQtBlgFBAEEAEGsQgwQMBAsgAyAANgJQQegKIANB0ABqEDwgA0H/AToA0AFBACgCpOEBIgQvAQZBAUcNAyADQf8BNgJAQYAKIANBwABqEDwgA0HQAWpBAUEAQQAQ/gMNAyAEKAIMIgBFDQMgBEEAKAKo6gEgAGo2AjAMAwsgAyACNgIwQbg1IANBMGoQPCADQf8BOgDQAUEAKAKk4QEiBC8BBkEBRw0CIANB/wE2AiBBgAogA0EgahA8IANB0AFqQQFBAEEAEP4DDQIgBCgCDCIARQ0CIARBACgCqOoBIABqNgIwDAILIAMgBCgCODYCoAFByzEgA0GgAWoQPCAEIARBEWotAABBCHQ7ARAgBC8BBkECRg0BIANBsccANgKUASADQQI2ApABQdLRACADQZABahA8IARBAjsBBiAEQQMgBEEGakECEIgFDAELIAMgASACEIcCNgLAAUHtFCADQcABahA8IAQvAQZBAkYNACADQbHHADYCtAEgA0ECNgKwAUHS0QAgA0GwAWoQPCAEQQI7AQYgBEEDIARBBmpBAhCIBQsgA0GAAmokAAvrAQEBfyMAQTBrIgIkAAJAAkAgAQ0AIAIgADoALkEAKAKk4QEiAS8BBkEBRw0BAkAgAEHlAGpB/wFxQf0BSw0AIAIgAEH/AXE2AgBBgAogAhA8CyACQS5qQQFBAEEAEP4DDQEgASgCDCIARQ0BIAFBACgCqOoBIABqNgIwDAELIAIgADYCIEHoCSACQSBqEDwgAkH/AToAL0EAKAKk4QEiAC8BBkEBRw0AIAJB/wE2AhBBgAogAkEQahA8IAJBL2pBAUEAQQAQ/gMNACAAKAIMIgFFDQAgAEEAKAKo6gEgAWo2AjALIAJBMGokAAvJBQEHfyMAQRBrIgEkAAJAAkAgACgCDEUNAEEAKAKo6gEgACgCMGtBAE4NAQsCQCAAQRRqQYCAgAgQ+QRFDQAgAC0AEEUNAEHlMUEAEDwgACAAQRFqLQAAQQh0OwEQCwJAIAAtABBBAnFFDQBBACgC5OEBIAAoAhxGDQAgASAAKAIYNgIIAkAgACgCIA0AIABBgAIQITYCIAsgACgCIEGAAiABQQhqELQEIQJBACgC5OEBIQMgAkUNACABKAIIIQQgACgCICEFIAFBmgE6AA1BnH8hBgJAQQAoAqThASIHLwEGQQFHDQAgAUENakEBIAUgAhD+AyICIQYgAg0AAkAgBygCDCICDQBBACEGDAELIAdBACgCqOoBIAJqNgIwQQAhBgsgBg0AIAAgASgCCDYCGCADIARHDQAgAEEAKALk4QE2AhwLAkAgACgCZEUNACAAKAJkENAEIgJFDQAgAiECA0AgAiECAkAgAC0AEEEBcUUNACACLQACIQMgAUGZAToADkGcfyEGAkBBACgCpOEBIgUvAQZBAUcNACABQQ5qQQEgAiADQQxqEP4DIgIhBiACDQACQCAFKAIMIgINAEEAIQYMAQsgBUEAKAKo6gEgAmo2AjBBACEGCyAGDQILIAAoAmQQ0QQgACgCZBDQBCIGIQIgBg0ACwsCQCAAQTRqQYCAgAIQ+QRFDQAgAUGSAToAD0EAKAKk4QEiAi8BBkEBRw0AIAFBkgE2AgBBgAogARA8IAFBD2pBAUEAQQAQ/gMNACACKAIMIgZFDQAgAkEAKAKo6gEgBmo2AjALAkAgAEEkakGAgCAQ+QRFDQBBmwQhAgJAEIUERQ0AIAAvAQZBAnRB8PQAaigCACECCyACEB8LAkAgAEEoakGAgCAQ+QRFDQAgABCGBAsgAEEsaiAAKAIIEPgEGiABQRBqJAAPC0GKEUEAEDwQNQALBABBAQuVAgEEfyMAQTBrIgEkACAAQQZqIQICQAJAAkAgAC8BBkF+ag4DAgABAAsgAUH6xQA2AiQgAUEENgIgQdLRACABQSBqEDwgAEEEOwEGIABBAyACQQIQiAULEIEECwJAIAAoAjhFDQAQhQRFDQAgACgCOCEDIAAvAWAhBCABIAAoAjw2AhggASAENgIUIAEgAzYCEEGhFSABQRBqEDwgACgCOCAALwFgIAAoAjwgAEHAAGoQ/QMNAAJAIAIvAQBBA0YNACABQf3FADYCBCABQQM2AgBB0tEAIAEQPCAAQQM7AQYgAEEDIAJBAhCIBQsgAEEAKAKs1wEiAkGAgIAIajYCNCAAIAJBgICAEGo2AigLIAFBMGokAAv9AgECfyMAQRBrIgIkAAJAAkACQAJAAkACQAJAAkACQCABLwEOIgNB/35qDgYCAwcHBwEACyADQYBdag4EAwUGBAYLIAAgAUEQaiABLQAMQQEQiAQMBgsgABCGBAwFCwJAAkAgAC8BBkF+ag4DBgABAAsgAkH6xQA2AgQgAkEENgIAQdLRACACEDwgAEEEOwEGIABBAyAAQQZqQQIQiAULEIEEDAQLIAEgACgCOBDWBBoMAwsgAUGSxQAQ1gQaDAILAkACQCAAKAI8IgANAEEAIQAMAQsgAEEAQQYgAEHnzwBBBhCzBRtqIQALIAEgABDWBBoMAQsgACABQYT1ABDZBEF+cUGAAUcNAAJAIAAoAghB5wdLDQAgAEHoBzYCCAsCQCAAKAIIQYG4mSlJDQAgAEGAuJkpNgIICyAAKAIMIgFFDQACQCABIAAoAghBA2wiA08NACAAIAM2AgwLIAAoAgwiAUUNACAAQQAoAqjqASABajYCMAsgAkEQaiQAC6cEAQd/IwBBMGsiBCQAAkACQCACDQBBjiZBABA8IAAoAjgQIiAAKAI8ECIgAEIANwI4IABB0AA7AWAgAEHAAGpCADcCACAAQcgAakIANwIAIABB0ABqQgA3AgAgAEHYAGpCADcCAAJAIANFDQBB5RhBABDJAhoLIAAQhgQMAQsCQAJAIAJBAWoQISABIAIQmQUiBRDIBUHGAEkNACAFQe7PAEEFELMFDQAgBUEFaiIGQcAAEMUFIQcgBkE6EMUFIQggB0E6EMUFIQkgB0EvEMUFIQogB0UNACAKRQ0AAkAgCUUNACAHIAlPDQEgCSAKTw0BCwJAAkBBACAIIAggB0sbIggNACAGIQYMAQsgBkHaxwBBBRCzBQ0BIAhBAWohBgsgByAGIgZrQcAARw0AIAdBADoAACAEQRBqIAYQ+wRBIEcNAEHQACEGAkAgCUUNACAJQQA6AAAgCUEBahD9BCIJIQYgCUGAgHxqQYKAfEkNAQsgCkEAOgAAIAdBAWoQhAUhByAKQS86AAAgChCEBSEJIAAQiQQgACAGOwFgIAAgCTYCPCAAIAc2AjggACAEKQMQNwJAIABByABqIAQpAxg3AgAgAEHQAGogBEEgaikDADcCACAAQdgAaiAEQShqKQMANwIAAkAgA0UNAEHlGCAFIAEgAhCZBRDJAhoLIAAQhgQMAQsgBCABNgIAQd8XIAQQPEEAECJBABAiCyAFECILIARBMGokAAtLACAAKAI4ECIgACgCPBAiIABCADcCOCAAQdAAOwFgIABBwABqQgA3AgAgAEHIAGpCADcCACAAQdAAakIANwIAIABB2ABqQgA3AgALQwECf0GQ9QAQ3wQiAEGIJzYCCCAAQQI7AQYCQEHlGBDIAiIBRQ0AIAAgASABEMgFQQAQiAQgARAiC0EAIAA2AqThAQukAQEEfyMAQRBrIgQkACABEMgFIgVBA2oiBhAhIgcgADoAASAHQZgBOgAAIAdBAmogASAFEJkFGkGcfyEBAkBBACgCpOEBIgAvAQZBAUcNACAEQZgBNgIAQYAKIAQQPCAHIAYgAiADEP4DIgUhASAFDQACQCAAKAIMIgENAEEAIQEMAQsgAEEAKAKo6gEgAWo2AjBBACEBCyAHECIgBEEQaiQAIAELDwBBACgCpOEBLwEGQQFGC5UCAQh/IwBBEGsiASQAAkBBACgCpOEBIgJFDQAgAkERai0AAEEBcUUNACACLwEGQQFHDQAgARCzBDYCCAJAIAIoAiANACACQYACECE2AiALA0AgAigCIEGAAiABQQhqELQEIQNBACgC5OEBIQRBAiEFAkAgA0UNACABKAIIIQYgAigCICEHIAFBmwE6AA9BnH8hBQJAQQAoAqThASIILwEGQQFHDQAgAUGbATYCAEGACiABEDwgAUEPakEBIAcgAxD+AyIDIQUgAw0AAkAgCCgCDCIFDQBBACEFDAELIAhBACgCqOoBIAVqNgIwQQAhBQtBAiAEIAZGQQF0IAUbIQULIAVFDQALQZIzQQAQPAsgAUEQaiQAC1ABAn8jAEEQayIBJABBACECAkAgAC8BDkGBI0cNACABQQAoAqThASgCODYCACAAQaLWACABEIIFIgIQ1gQaIAIQIkEBIQILIAFBEGokACACCw0AIAAoAgQQyAVBDWoLawIDfwF+IAAoAgQQyAVBDWoQISEBAkAgACgCECICRQ0AIAJBACACLQAEIgNrQQxsakFkaikDACEEIAEgAzoADCABIAQ3AwALIAEgACgCCDYCCCAAKAIEIQAgAUENaiAAIAAQyAUQmQUaIAELggMCBn8BfgJAAkAgACgCoAIiAUUNACAAQRhqIQIgASEBA0ACQCACIAEiAygCBBDIBUENaiIEEMwEIgFFDQAgAUEBRg0CIABBADYCoAIgAhDOBBoMAgsgAygCBBDIBUENahAhIQECQCADKAIQIgVFDQAgBUEAIAUtAAQiBmtBDGxqQWRqKQMAIQcgASAGOgAMIAEgBzcDAAsgASADKAIINgIIIAMoAgQhBSABQQ1qIAUgBRDIBRCZBRogAiABIAQQzQQNAiABECIgAygCACIBIQMgASEFAkAgAUUNAANAAkAgAyIBLQAMQQFxDQAgASEFDAILIAEoAgAiASEDIAEhBSABDQALCyAAIAUiATYCoAICQCABDQAgAhDOBBoLIAAoAqACIgMhASADDQALCwJAIABBEGpBoOg7EPkERQ0AIAAQkgQLAkAgAEEUakHQhgMQ+QRFDQAgAC0ACEUNACAAQQA6AAggAEEDQQBBABCIBQsPC0GVygBBrDlBkgFBxRMQ/AQAC+4DAQl/IwBBIGsiASQAAkACQAJAIAAtAAZFDQAgAC0ACQ0BIABBAToACQJAIAAoAgwiAkUNACACIQIDQAJAIAIiAygCEA0AQbThASECAkADQAJAIAIoAgAiAg0AQQkhBAwCC0EBIQUCQAJAIAItABBBAUsNAEEMIQQMAQsDQAJAAkAgAiAFIgZBDGxqIgdBJGoiCCgCACADKAIIRg0AQQEhBUEAIQQMAQtBASEFQQAhBCAHQSlqIgktAABBAXENAAJAAkAgAygCECIFIAhHDQBBACEFDAELAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAJIAktAABBAXI6AAAgAUEbaiAIQQAgB0EoaiIFLQAAa0EMbGpBZGopAwAQgQUgAygCBCEEIAEgBS0AADYCCCABIAQ2AgAgASABQRtqNgIEQeUzIAEQPCADIAg2AhAgAEEBOgAIIAMQnARBACEFC0EPIQQLIAQhBCAFRQ0BIAZBAWoiBCEFIAQgAi0AEEkNAAtBDCEECyACIQIgBCIFIQQgBUEMRg0ACwsgBEF3ag4HAAICAgICAAILIAMoAgAiBSECIAUNAAsLIAAtAAlFDQIgAEEAOgAJCyABQSBqJAAPC0HBMkGsOUHOAEHYLhD8BAALQcIyQaw5QeAAQdguEPwEAAukBQIGfwF+IwBBwABrIgIkAAJAIAAtAAkNAAJAAkACQAJAAkAgAS8BDkH/fmoOBAEDAgADCyAAKAIMIgNFDQMgAyEDA0ACQCADIgMoAhAiBEUNACAEIAQtAAVB/gFxOgAFIAIgAygCBDYCAEH3FiACEDwgA0EANgIQIABBAToACCADEJwECyADKAIAIgQhAyAEDQAMBAsACyABQRlqIQUgAS0ADEFwaiEGIABBDGohBANAIAQoAgAiA0UNAyADIQQgAygCBCIHIAUgBhCzBQ0ACwJAIAEpAxAiCEIAUg0AIAMoAhAiBEUNAyAEIAQtAAVB/gFxOgAFIAIgBzYCEEH3FiACQRBqEDwgA0EANgIQIABBAToACCADEJwEDAMLAkACQCAIEJ0EIgUNAEEAIQQMAQtBACEEIAUtABAgAS0AGCIGTQ0AIAUgBkEMbGpBJGohBAsgBCIERQ0CIAMoAhAiBSAERg0CAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAEIAQtAAVBAXI6AAUgAkE7aiAEQQAgBC0ABGtBDGxqQWRqKQMAEIEFIAMoAgQhBSACIAQtAAQ2AiggAiAFNgIgIAIgAkE7ajYCJEHlMyACQSBqEDwgAyAENgIQIABBAToACCADEJwEDAILIABBGGoiBiABEMcEDQECQAJAIAAoAgwiAw0AIAMhBQwBCyADIQQDQAJAIAQiAy0ADEEBcQ0AIAMhBQwCCyADKAIAIgMhBCADIQUgAw0ACwsgACAFIgM2AqACIAMNASAGEM4EGgwBCyAAQQE6AAcgAEEMaiEEAkADQCAEKAIAIgNFDQEgAyEEIAMoAhANAAsgAEEAOgAHCyAAIAFBtPUAENkEGgsgAkHAAGokAA8LQcEyQaw5QbgBQdcREPwEAAssAQF/QQBBwPUAEN8EIgA2AqjhASAAQQE6AAYgAEEAKAKs1wFBoOg7ajYCEAvXAQEEfyMAQRBrIgEkAAJAAkBBACgCqOEBIgItAAkNACACQQE6AAkCQCACKAIMIgNFDQAgAyEDA0ACQCADIgQoAhAiA0UNACADQQAgAy0ABGtBDGxqQVxqIABHDQAgAyADLQAFQf4BcToABSABIAQoAgQ2AgBB9xYgARA8IARBADYCECACQQE6AAggBBCcBAsgBCgCACIEIQMgBA0ACwsgAi0ACUUNASACQQA6AAkgAUEQaiQADwtBwTJBrDlB4QFBkzAQ/AQAC0HCMkGsOUHnAUGTMBD8BAALqgIBBn8CQAJAAkACQAJAQQAoAqjhASICRQ0AIAAQyAUhAyACQQxqIgQhBQJAA0AgBSgCACIGRQ0BIAYhBSAGKAIEIAAgAxCzBQ0ACyAGDQILIAItAAkNAgJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahDOBBoLQRQQISIHIAE2AgggByAANgIEIAQoAgAiBkUNAyAAIAYoAgQQxwVBAEgNAyAGIQUDQAJAIAUiAygCACIGDQAgBiEBIAMhAwwGCyAGIQUgBiEBIAMhAyAAIAYoAgQQxwVBf0oNAAwFCwALQaw5QfUBQbE2EPcEAAtBrDlB+AFBsTYQ9wQAC0HBMkGsOUHrAUHJDRD8BAALIAYhASAEIQMLIAcgATYCACADIAc2AgAgAkEBOgAIIAcL0gIBBH8jAEEQayIAJAACQAJAAkBBACgCqOEBIgEtAAkNAAJAIAEoAqACRQ0AIAFBADYCoAIgAUEYahDOBBoLIAEtAAkNASABQQE6AAkCQCABKAIMIgJFDQAgAiECA0ACQCACIgIoAhAiA0UNACADIAMtAAVB/gFxOgAFIAAgAigCBDYCAEH3FiAAEDwgAkEANgIQIAFBAToACCACEJwECyACKAIAIgMhAiADDQALCyABLQAJRQ0CIAFBADoACQJAIAEoAgwiAkUNACACIQIDQAJAIAIiAigCECIDRQ0AIAMgAy0ABUH+AXE6AAULIAEgAigCADYCDCACQQA2AgQgAhAiIAEoAgwiAyECIAMNAAsLIAFBAToACCAAQRBqJAAPC0HBMkGsOUHrAUHJDRD8BAALQcEyQaw5QbICQYojEPwEAAtBwjJBrDlBtQJBiiMQ/AQACwwAQQAoAqjhARCSBAvPAQECfyMAQcAAayIDJAACQAJAAkACQAJAIABBf2oOIAABAgQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQDBAsgAyABQRRqNgIQQckYIANBEGoQPAwDCyADIAFBFGo2AiBBtBggA0EgahA8DAILIAMgAUEUajYCMEGsFyADQTBqEDwMAQsgAS0ABCEAIAIvAQQhBCADIAItAAc2AgwgAyAENgIIIAMgADYCBCADIAFBACAAa0EMbGpBcGo2AgBB1z8gAxA8CyADQcAAaiQACzEBAn9BDBAhIQJBACgCrOEBIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgKs4QELkwEBAn8CQAJAQQAtALDhAUUNAEEAQQA6ALDhASAAIAEgAhCZBAJAQQAoAqzhASIDRQ0AIAMhAwNAIAMiAygCCCAAIAEgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtALDhAQ0BQQBBAToAsOEBDwtB1MgAQYc7QeMAQbgPEPwEAAtBssoAQYc7QekAQbgPEPwEAAuaAQEDfwJAAkBBAC0AsOEBDQBBAEEBOgCw4QEgACgCECEBQQBBADoAsOEBAkBBACgCrOEBIgJFDQAgAiECA0AgAiICKAIIQcAAIAEgACACKAIEEQYAIAIoAgAiAyECIAMNAAsLQQAtALDhAQ0BQQBBADoAsOEBDwtBssoAQYc7Qe0AQekyEPwEAAtBssoAQYc7QekAQbgPEPwEAAswAQN/QbThASEBA0ACQCABKAIAIgINAEEADwsgAiEBIAIhAyACKQMIIABSDQALIAMLWQEEfwJAIAAtABAiAg0AQQAPCyAAQSRqIQNBACEEA0ACQCADIAQiBEEMbGooAgAgAUcNACAAIARBDGxqQSRqQQAgABsPCyAEQQFqIgUhBCAFIAJHDQALQQALYgICfwF+IANBEGoQISIEQQE6AAMgAEEAIAAtAAQiBWtBDGxqQWRqKQMAIQYgBCABOwEOIAQgBToADSAEIAY3AgQgBCADOgAMIARBEGogAiADEJkFGiAEENgEIQMgBBAiIAML2wIBAn8CQAJAAkBBAC0AsOEBDQBBAEEBOgCw4QECQEG44QFB4KcSEPkERQ0AAkBBACgCtOEBIgBFDQAgACEAA0BBACgCrNcBIAAiACgCHGtBAEgNAUEAIAAoAgA2ArThASAAEKEEQQAoArThASIBIQAgAQ0ACwtBACgCtOEBIgBFDQAgACEAA0AgACIBKAIAIgBFDQECQEEAKAKs1wEgACgCHGtBAEgNACABIAAoAgA2AgAgABChBAsgASgCACIBIQAgAQ0ACwtBAC0AsOEBRQ0BQQBBADoAsOEBAkBBACgCrOEBIgBFDQAgACEAA0AgACIAKAIIQTBBAEEAIAAoAgQRBgAgACgCACIBIQAgAQ0ACwtBAC0AsOEBDQJBAEEAOgCw4QEPC0GyygBBhztBlAJBsxMQ/AQAC0HUyABBhztB4wBBuA8Q/AQAC0GyygBBhztB6QBBuA8Q/AQAC5wCAQN/IwBBEGsiASQAAkACQAJAQQAtALDhAUUNAEEAQQA6ALDhASAAEJUEQQAtALDhAQ0BIAEgAEEUajYCAEEAQQA6ALDhAUG0GCABEDwCQEEAKAKs4QEiAkUNACACIQIDQCACIgIoAghBAiAAQQAgAigCBBEGACACKAIAIgMhAiADDQALC0EALQCw4QENAkEAQQE6ALDhAQJAIAAoAgQiAkUNACACIQIDQCAAIAIiAigCACIDNgIEAkAgAi0AB0EFSQ0AIAIoAgwQIgsgAhAiIAMhAiADDQALCyAAECIgAUEQaiQADwtB1MgAQYc7QbABQactEPwEAAtBssoAQYc7QbIBQactEPwEAAtBssoAQYc7QekAQbgPEPwEAAuUDgIKfwF+IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEALQCw4QENAEEAQQE6ALDhAQJAIAAtAAMiAkEEcUUNAEEAQQA6ALDhAQJAQQAoAqzhASIDRQ0AIAMhAwNAIAMiAygCCEESQQAgACADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtALDhAUUNCEGyygBBhztB6QBBuA8Q/AQACyAAKQIEIQtBtOEBIQQCQANAAkAgBCgCACIDDQBBACEFDAILIAMhBCADIQUgAykDCCALUg0ACwtBACEEAkAgBSIDRQ0AIAMgAC0ADUE/cSIEQQxsakEkakEAIAQgAy0AEEkbIQQLIAQhBQJAIAJBAXFFDQBBECEEIAUhAiADIQMMBwsgAC0ADQ0EIAAvAQ4NBCADIQQCQCADDQAgABCjBCEECwJAIAQiAy8BEiIFIAAvARAiBEYNAAJAIAVBD3EgBEEPcU0NAEEDIAMgABCbBEEAKAK04QEiBCADRg0DIAQhBANAIAQiBUUNBSAFKAIAIgIhBCACIANHDQALIAUgAygCADYCAAwECyADIAQ7ARILIAMhAwwDC0GyygBBhztBvgJBvxEQ/AQAC0EAIAMoAgA2ArThAQsgAxChBCAAEKMEIQMLIAMiA0EAKAKs1wFBgIn6AGo2AhwgA0EkaiEEIAMhAwwBCyAFIQQgAyEDCyADIQYCQAJAIAQiBQ0AQRAhBEEAIQIMAQsCQAJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgRBf2ogBi0AESIDIANB/wFGG0EBaiIDa0H/AHEiAkUNAAJAIAMgBGtB/ABxQTxPDQBBEyEDDAMLQRMhAyACQQVJDQILIAYgBDoAEQtBECEDCyADIQcCQAJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiA0GA4ANxQYAgRw0CAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAiACLAAGIgNBAEgNAiACIANBgAFyOgAGQQAtALDhAUUNBkEAQQA6ALDhAQJAQQAoAqzhASIDRQ0AIAMhAwNAIAMiAygCCEEhIAUgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtALDhAUUNAUGyygBBhztB6QBBuA8Q/AQACyAALwEOIgNBgOADcUGAIEcNAQJAAkAgBUEAIAUtAAQiCWtBDGxqQWBqKAIAIgRFDQAgA0H/H3EhAiAEIQMDQAJAIAIgAyIDLwEERw0AIAMtAAZBP3EgCUcNACADIQMMAwsgAygCACIEIQMgBA0ACwtBACEDCyADIgJFDQECQAJAIAItAAciAyAIRw0AIAMhBCACQQxqIQkgAEEQaiEKAkACQCADQQVPDQAgCSEJDAELIAkoAgAhCQsgCiAJIAQQswUNAEEBIQQMAQtBACEECyAEIQQCQCAIQQVJDQAgAyAIRg0AAkAgA0EFSQ0AIAIoAgwQIgsgAiAALQAMECE2AgwLIAIgAC0ADCIDOgAHIAJBDGohCQJAAkAgA0EFTw0AIAkhCQwBCyAJKAIAIQkLIAkgAEEQaiADEJkFGiAEDQFBAC0AsOEBRQ0GQQBBADoAsOEBIAUtAAQhAyACLwEEIQQgASACLQAHNgIMIAEgBDYCCCABIAM2AgQgASAFQQAgA2tBDGxqQXBqNgIAQdc/IAEQPAJAQQAoAqzhASIDRQ0AIAMhAwNAIAMiAygCCEEgIAUgAiADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtALDhAQ0HC0EAQQE6ALDhAQsgByEEIAUhAgsgBiEDCyADIQYgBCEFQQAtALDhASEDAkAgAiICRQ0AIANBAXFFDQVBAEEAOgCw4QEgBSACIAAQmQQCQEEAKAKs4QEiA0UNACADIQMDQCADIgMoAgggBSACIAAgAygCBBEGACADKAIAIgQhAyAEDQALC0EALQCw4QFFDQFBssoAQYc7QekAQbgPEPwEAAsgA0EBcUUNBUEAQQA6ALDhAQJAQQAoAqzhASIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQYAIAMoAgAiBCEDIAQNAAsLQQAtALDhAQ0GC0EAQQA6ALDhASABQRBqJAAPC0HUyABBhztB4wBBuA8Q/AQAC0HUyABBhztB4wBBuA8Q/AQAC0GyygBBhztB6QBBuA8Q/AQAC0HUyABBhztB4wBBuA8Q/AQAC0HUyABBhztB4wBBuA8Q/AQAC0GyygBBhztB6QBBuA8Q/AQAC5EEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQISIEIAM6ABAgBCAAKQIEIgk3AwhBACgCrNcBIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQgQUgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKAK04QEiA0UNACAEQQhqIgIpAwAQ7wRRDQAgAiADQQhqQQgQswVBAEgNAEG04QEhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEO8EUQ0AIAMhBSACIAhBCGpBCBCzBUF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoArThATYCAEEAIAQ2ArThAQsCQAJAQQAtALDhAUUNACABIAY2AgBBAEEAOgCw4QFByRggARA8AkBBACgCrOEBIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBgAgAygCACICIQMgAg0ACwtBAC0AsOEBDQFBAEEBOgCw4QEgAUEQaiQAIAQPC0HUyABBhztB4wBBuA8Q/AQAC0GyygBBhztB6QBBuA8Q/AQACwIAC5kCAQV/IwBBIGsiAiQAAkACQCABLwEOIgNBgH9qIgRBBEsNAEEBIAR0QRNxRQ0AIAJBAXIgAUEQaiIFIAEtAAwiBEEPIARBD0kbIgYQmQUhACACQTo6AAAgBiACckEBakEAOgAAIAAQyAUiBkEOSg0BAkACQAJAIANBgH9qDgUAAgQEAQQLIAZBAWohBCACIAQgBCACQQBBABC2BCIDQQAgA0EAShsiA2oiBRAhIAAgBhCZBSIAaiADELYEGiABLQANIAEvAQ4gACAFEJEFGiAAECIMAwsgAkEAQQAQuAQaDAILIAIgBSAGakEBaiAGQX9zIARqIgFBACABQQBKGxC4BBoMAQsgACABQdD1ABDZBBoLIAJBIGokAAsKAEHY9QAQ3wQaCwIAC6cBAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkAgAS8BDiIDQYBdag4HAQMFBQMCBAALAkACQAJAIANB/35qDgIBAgALIAMNBhDjBAwHC0H8ABAeDAYLEDUACyABEOgEENYEGgwECyABEOoEENYEGgwDCyABEOkEENUEGgwCCyACEDY3AwhBACABLwEOIAJBCGpBCBCRBRoMAQsgARDXBBoLIAJBEGokAAsKAEHo9QAQ3wQaCycBAX8QqwRBAEEANgK84QECQCAAEKwEIgENAEEAIAA2ArzhAQsgAQuVAQECfyMAQSBrIgAkAAJAAkBBAC0A4OEBDQBBAEEBOgDg4QEQIw0BAkBB4NcAEKwEIgENAEEAQeDXADYCwOEBIABB4NcALwEMNgIAIABB4NcAKAIINgIEQaIUIAAQPAwBCyAAIAE2AhQgAEHg1wA2AhBBzzQgAEEQahA8CyAAQSBqJAAPC0Gs1gBB0ztBHUHXEBD8BAALqwUBCn8CQCAADQBB0A8PC0HRDyEBAkAgAEEDcQ0AQdIPIQEgACgCAEHEhpm6BEcNAEHTDyEBIAAoAgRBirbS1XxHDQBB1A8hASAAKAIIIgJB//8HSw0AQd4PIQEgAC8BDCIDQRhsQfAAaiIEIAJLDQBB3w8hASAAQdgAaiIFIANBGGxqIgYvARBB//8DRw0AQeAPIQEgBi8BEkH//wNHDQBBACEGQQAhAQNAIAghByAGIQgCQAJAIAAgASIBQQF0akEYai8BACIGIANNDQBBACEGQeEPIQkMAQsCQCABIAUgBkEYbGoiCi8BEEELdk0NAEEAIQZB4g8hCQwBCwJAIAZFDQBBACEGQeMPIQkgASAKQXhqLwEAQQt2TQ0BC0EBIQYgByEJCyAJIQcgCCEJAkAgBkUNACABQR5LIgkhBiAHIQggAUEBaiIKIQEgCSEJIApBIEcNAQsLAkAgCUEBcQ0AIAcPCwJAIAMNAEEADwsgByEJQQAhBgNAIAkhCAJAAkAgBSAGIgZBGGxqIgEQyAUiCUEPTQ0AQQAhAUHWDyEJDAELIAEgCRDuBCEJAkAgAS8BECIHIAkgCUEQdnNB//8DcUYNAEEAIQFB1w8hCQwBCwJAIAZFDQAgAUF4ai8BACAHTQ0AQQAhAUHYDyEJDAELAkACQCABLwESIgdBAnENAEEAIQFB2Q8hCSAHQQRJDQEMAgsCQCABKAIUIgEgBE8NAEEAIQFB2g8hCQwCCwJAIAEgAkkNAEEAIQFB2w8hCQwCCwJAIAEgB0ECdmoiByACSQ0AQQAhAUHcDyEJDAILQQAhAUHdDyEJIAAgB2otAAANAQtBASEBIAghCQsgCSEJAkAgAUUNACAJIQkgBkEBaiIIIQZBACEBIAggA0YNAgwBCwsgCSEBCyABC+sCAQd/EKsEAkACQCAARQ0AQQAoArzhASIBRQ0AIAAQyAUiAkEPSw0AIAEgACACEO4EIgNBEHYgA3MiA0EKdkE+cWpBGGovAQAiBCABLwEMIgVPDQAgAUHYAGohBiADQf//A3EhASAEIQMDQCAGIAMiB0EYbGoiBC8BECIDIAFLDQECQCADIAFHDQAgBCEDIAQgACACELMFRQ0DCyAHQQFqIgQhAyAEIAVHDQALC0EAIQMLIAMiAyEBAkAgAw0AAkAgAEUNAEEAKALA4QEiAUUNACAAEMgFIgJBD0sNACABIAAgAhDuBCIDQRB2IANzIgNBCnZBPnFqQRhqLwEAIgRB4NcALwEMIgVPDQAgAUHYAGohBiADQf//A3EhAyAEIQEDQCAGIAEiB0EYbGoiBC8BECIBIANLDQECQCABIANHDQAgBCEBIAQgACACELMFRQ0DCyAHQQFqIgQhASAEIAVHDQALC0EAIQELIAELUQECfwJAAkAgABCtBCIADQBB/wEhAgwBCyAALwESQQNxIQILIAEhAwJAAkACQCACDgIAAQILIAEgACgCFCIAIABBAEgbDwsgACgCFCEDCyADC1EBAn8CQAJAIAAQrQQiAA0AQf8BIQIMAQsgAC8BEkEDcSECCyABIQMCQAJAAkAgAg4CAQACCyABIAAoAhQiACAAQQBIGw8LIAAoAhQhAwsgAwvEAwEIfxCrBEEAKALA4QEhAgJAAkAgAEUNACACRQ0AIAAQyAUiA0EPSw0AIAIgACADEO4EIgRBEHYgBHMiBEEKdkE+cWpBGGovAQAiBUHg1wAvAQwiBk8NACACQdgAaiEHIARB//8DcSEEIAUhBQNAIAcgBSIIQRhsaiIJLwEQIgUgBEsNAQJAIAUgBEcNACAJIQUgCSAAIAMQswVFDQMLIAhBAWoiCSEFIAkgBkcNAAsLQQAhBQsgAiEEIAUiCSEFAkAgCQ0AQQAoArzhASEEAkAgAEUNACAERQ0AIAAQyAUiA0EPSw0AIAQgACADEO4EIgVBEHYgBXMiBUEKdkE+cWpBGGovAQAiCSAELwEMIgZPDQAgBEHYAGohByAFQf//A3EhBSAJIQkDQCAHIAkiCEEYbGoiAi8BECIJIAVLDQECQCAJIAVHDQAgAiAAIAMQswUNACAEIQQgAiEFDAMLIAhBAWoiCCEJIAggBkcNAAsLIAQhBEEAIQULIAQhBAJAIAUiAEUNACAALQASQQJxRQ0AAkAgAUUNACABIAAvARJBAnY2AgALIAQgACgCFGoPCwJAIAENAEEADwsgAUEANgIAQQALtAEBAn9BACEDAkACQCAARQ0AQQAhAyAAEMgFIgRBDksNAQJAIABB0OEBRg0AQdDhASAAIAQQmQUaCyAEIQMLIAMhAAJAIAFB5ABNDQBBAA8LIABB0OEBaiABQYABczoAACAAQQFqIQACQAJAIAINACAAIQAMAQtBACEDIAIQyAUiASAAaiIEQQ9LDQEgAEHQ4QFqIAIgARCZBRogBCEACyAAQdDhAWpBADoAAEHQ4QEhAwsgAwujAgEDfyMAQbACayICJAAgAkGrAiAAIAEQ/gQaAkACQCACEMgFIgENACABIQAMAQsgASEAA0AgACIBIQACQCACIAFBf2oiAWotAABBdmoOBAACAgACCyABIQAgAQ0AC0EAIQALIAIgACIBakEKOgAAECQgAUEBaiEDIAIhBAJAAkBBgAhBACgC5OEBayIAIAFBAmpJDQAgAyEDIAQhAAwBC0Hk4QFBACgC5OEBakEEaiACIAAQmQUaQQBBADYC5OEBQQEgAyAAayIBIAFBgXhqQf93SRshAyACIABqIQALQeThAUEEaiIBQQAoAuThAWogACADIgAQmQUaQQBBACgC5OEBIABqNgLk4QEgAUEAKALk4QFqQQA6AAAQJSACQbACaiQACzkBAn8QJAJAAkBBACgC5OEBQQFqIgBB/wdLDQAgACEBQeThASAAakEEai0AAA0BC0EAIQELECUgAQt2AQN/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBgAhBACgC5OEBIgQgBCACKAIAIgVJGyIEIAVGDQAgAEHk4QEgBWpBBGogBCAFayIFIAEgBSABSRsiBRCZBRogAiACKAIAIAVqNgIAIAUhAwsQJSADC/gBAQd/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBACgC5OEBIgQgAigCACIFRg0AIAAgAWpBf2ohBiAAIQEgBSEDAkADQCADIQMCQCABIgEgBkkNACABIQUgAyEHDAILIAEhBSADQQFqIgghB0EDIQkCQAJAQeThASADakEEai0AACIDDgsBAAAAAAAAAAAAAQALIAEgAzoAACABQQFqIQVBACAIIAhBgAhGGyIDIQdBA0EAIAMgBEYbIQkLIAUiBSEBIAciByEDIAUhBSAHIQcgCUUNAAsLIAIgBzYCACAFIgNBADoAACADIABrIQMLECUgAwvVAQEEfyMAQRBrIgMkAAJAAkACQCAARQ0AIAAQyAVBD0sNACAALQAAQSpHDQELIAMgADYCAEHc1gAgAxA8QX8hAAwBCxC3BAJAAkBBACgC8OkBIgRBACgC9OkBQRBqIgVJDQAgBCEEA0ACQCAEIgQgABDHBQ0AIAQhAAwDCyAEQWhqIgYhBCAGIAVPDQALC0EAIQALAkAgACIADQBBfiEADAELAkAgACgCFCACSw0AIAFBACgC6OkBIAAoAhBqIAIQmQUaCyAAKAIUIQALIANBEGokACAAC/sCAQR/IwBBIGsiACQAAkACQEEAKAL06QENAEEAEBgiATYC6OkBIAFBgCBqIQICQAJAIAEoAgBBxqbRkgVHDQAgASEDIAEoAgRBiozV+QVGDQELQQAhAwsgAyEDAkACQCACKAIAQcam0ZIFRw0AIAIhAiABKAKEIEGKjNX5BUYNAQtBACECCyACIQECQAJAAkAgA0UNACABRQ0AIAMgASADKAIIIAEoAghLGyEBDAELIAMgAXJFDQEgAyABIAMbIQELQQAgATYC9OkBCwJAQQAoAvTpAUUNABC6BAsCQEEAKAL06QENAEHEC0EAEDxBAEEAKALo6QEiATYC9OkBIAEQGiAAQgE3AxggAELGptGSpcHRmt8ANwMQQQAoAvTpASAAQRBqQRAQGRAbELoEQQAoAvTpAUUNAgsgAEEAKALs6QFBACgC8OkBa0FQaiIBQQAgAUEAShs2AgBBvC0gABA8CyAAQSBqJAAPC0G/xABB+jhBxQFBvBAQ/AQAC7AEAQV/IwBBwABrIgMkAAJAAkACQAJAIABFDQAgABDIBUEPSw0AIAAtAABBKkcNAQsgAyAANgIAQdzWACADEDxBfyEEDAELAkAgAkG5HkkNACADIAI2AhBB3gwgA0EQahA8QX4hBAwBCxC3BAJAAkBBACgC8OkBIgVBACgC9OkBQRBqIgZJDQAgBSEEA0ACQCAEIgQgABDHBQ0AIAQhBAwDCyAEQWhqIgchBCAHIAZPDQALC0EAIQQLAkAgBCIHRQ0AIAcoAhQgAkcNAEEAIQRBACgC6OkBIAcoAhBqIAEgAhCzBUUNAQsCQEEAKALs6QEgBWtBUGoiBEEAIARBAEobIAJBB2pBeHFBCCACGyIEQRhqIgdPDQAQuQRBACgC7OkBQQAoAvDpAWtBUGoiBkEAIAZBAEobIAdPDQAgAyACNgIgQaIMIANBIGoQPEF9IQQMAQtBAEEAKALs6QEgBGsiBzYC7OkBAkACQCABQQAgAhsiBEEDcUUNACAEIAIQhQUhBEEAKALs6QEgBCACEBkgBBAiDAELIAcgBCACEBkLIANBMGpCADcDACADQgA3AyggAyACNgI8IANBACgC7OkBQQAoAujpAWs2AjggA0EoaiAAIAAQyAUQmQUaQQBBACgC8OkBQRhqIgA2AvDpASAAIANBKGpBGBAZEBtBACgC8OkBQRhqQQAoAuzpAUsNAUEAIQQLIANBwABqJAAgBA8LQZQOQfo4QakCQdkhEPwEAAusBAINfwF+IwBBIGsiACQAQaI3QQAQPEEAKALo6QEiASABQQAoAvTpAUZBDHRqIgIQGgJAQQAoAvTpAUEQaiIDQQAoAvDpASIBSw0AIAEhASADIQMgAkGAIGohBCACQRBqIQUDQCAFIQYgBCEHIAEhBCAAQQhqQRBqIgggAyIJQRBqIgopAgA3AwAgAEEIakEIaiILIAlBCGoiDCkCADcDACAAIAkpAgA3AwggCSEDAkACQANAIANBGGoiASAESyIFDQEgASEDIAEgAEEIahDHBQ0ACyAFDQAgBiEFIAchBAwBCyAIIAopAgA3AwAgCyAMKQIANwMAIAAgCSkCACINNwMIAkACQCANp0H/AXFBKkcNACAHIQEMAQsgByAAKAIcIgFBB2pBeHFBCCABG2siA0EAKALo6QEgACgCGGogARAZIAAgA0EAKALo6QFrNgIYIAMhAQsgBiAAQQhqQRgQGSAGQRhqIQUgASEEC0EAKALw6QEiBiEBIAlBGGoiCSEDIAQhBCAFIQUgCSAGTQ0ACwtBACgC9OkBKAIIIQFBACACNgL06QEgAEEANgIUIAAgAUEBaiIBNgIQIABCxqbRkqXB0ZrfADcDCCACIABBCGpBEBAZEBsQugQCQEEAKAL06QENAEG/xABB+jhB5gFB7zYQ/AQACyAAIAE2AgQgAEEAKALs6QFBACgC8OkBa0FQaiIBQQAgAUEAShs2AgBBqiIgABA8IABBIGokAAuBBAEIfyMAQSBrIgAkAEEAKAL06QEiAUEAKALo6QEiAmtBgCBqIQMgAUEQaiIEIQECQAJAAkADQCADIQMgASIFKAIQIgFBf0YNASABIAMgASADSRsiBiEDIAVBGGoiBSEBIAUgAiAGak0NAAtBghAhAwwBC0EAIAIgA2oiAjYC7OkBQQAgBUFoaiIGNgLw6QEgBSEBAkADQCABIgMgAk8NASADQQFqIQEgAy0AAEH/AUYNAAtBzSchAwwBC0EAQQA2AvjpASAEIAZLDQEgBCEDAkADQAJAIAMiBy0AAEEqRw0AIABBCGpBEGogB0EQaikCADcDACAAQQhqQQhqIAdBCGopAgA3AwAgACAHKQIANwMIIAchAQJAA0AgAUEYaiIDIAZLIgUNASADIQEgAyAAQQhqEMcFDQALIAVFDQELIAcoAhQiA0H/H2pBDHZBASADGyICRQ0AIAcoAhBBDHZBfmohBEEAIQMDQCAEIAMiAWoiA0EeTw0DAkBBACgC+OkBQQEgA3QiBXENACADQQN2Qfz///8BcUH46QFqIgMgAygCACAFczYCAAsgAUEBaiIBIQMgASACRw0ACwsgB0EYaiIBIQMgASAGTQ0ADAMLAAtBjsMAQfo4Qc8AQaUxEPwEAAsgACADNgIAQZsYIAAQPEEAQQA2AvTpAQsgAEEgaiQAC8oBAQR/IwBBEGsiAiQAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQyAVBEEkNAQsgAiAANgIAQb3WACACEDxBACEADAELELcEQQAhAwJAQQAoAvDpASIEQQAoAvTpAUEQaiIFSQ0AIAQhAwNAAkAgAyIDIAAQxwUNACADIQMMAgsgA0FoaiIEIQMgBCAFTw0AC0EAIQMLQQAhACADIgNFDQACQCABRQ0AIAEgAygCFDYCAAtBACgC6OkBIAMoAhBqIQALIAJBEGokACAAC9YJAQx/IwBBMGsiAiQAAkACQAJAAkACQAJAAkACQAJAAkAgAEUNACAALQAAQSpHDQAgABDIBUEQSQ0BCyACIAA2AgBBvdYAIAIQPEEAIQMMAQsQtwQCQAJAQQAoAvDpASIEQQAoAvTpAUEQaiIFSQ0AIAQhAwNAAkAgAyIDIAAQxwUNACADIQMMAwsgA0FoaiIGIQMgBiAFTw0ACwtBACEDCwJAIAMiB0UNACAHLQAAQSpHDQIgBygCFCIDQf8fakEMdkEBIAMbIghFDQAgBygCEEEMdkF+aiEJQQAhAwNAIAkgAyIGaiIDQR5PDQQCQEEAKAL46QFBASADdCIFcUUNACADQQN2Qfz///8BcUH46QFqIgMgAygCACAFczYCAAsgBkEBaiIGIQMgBiAIRw0ACwsgAkEgakIANwMAIAJCADcDGCABQf8fakEMdkEBIAEbIgpBf2ohC0EeIAprIQxBACgC+OkBIQhBACEGAkADQCADIQ0CQCAGIgUgDEkNAEEAIQkMAgsCQAJAIAoNACANIQMgBSEGQQEhBQwBCyAFQR1LDQZBAEEeIAVrIgMgA0EeSxshCUEAIQMDQAJAIAggAyIDIAVqIgZ2QQFxRQ0AIA0hAyAGQQFqIQZBASEFDAILAkAgAyALRg0AIANBAWoiBiEDIAYgCUYNCAwBCwsgBUEMdEGAwABqIQMgBSEGQQAhBQsgAyIJIQMgBiEGIAkhCSAFDQALCyACIAE2AiwgAiAJIgM2AigCQAJAIAMNACACIAE2AhBBhgwgAkEQahA8AkAgBw0AQQAhAwwCCyAHLQAAQSpHDQYCQCAHKAIUIgNB/x9qQQx2QQEgAxsiCA0AQQAhAwwCCyAHKAIQQQx2QX5qIQlBACEDA0AgCSADIgZqIgNBHk8NCAJAQQAoAvjpAUEBIAN0IgVxDQAgA0EDdkH8////AXFB+OkBaiIDIAMoAgAgBXM2AgALIAZBAWoiBiEDIAYgCEcNAAtBACEDDAELIAJBGGogACAAEMgFEJkFGgJAQQAoAuzpASAEa0FQaiIDQQAgA0EAShtBF0sNABC5BEEAKALs6QFBACgC8OkBa0FQaiIDQQAgA0EAShtBF0sNAEG+G0EAEDxBACEDDAELQQBBACgC8OkBQRhqNgLw6QECQCAKRQ0AQQAoAujpASACKAIoaiEFQQAhAwNAIAUgAyIDQQx0ahAaIANBAWoiBiEDIAYgCkcNAAsLQQAoAvDpASACQRhqQRgQGRAbIAItABhBKkcNByACKAIoIQsCQCACKAIsIgNB/x9qQQx2QQEgAxsiCEUNACALQQx2QX5qIQlBACEDA0AgCSADIgZqIgNBHk8NCgJAQQAoAvjpAUEBIAN0IgVxDQAgA0EDdkH8////AXFB+OkBaiIDIAMoAgAgBXM2AgALIAZBAWoiBiEDIAYgCEcNAAsLQQAoAujpASALaiEDCyADIQMLIAJBMGokACADDwtBtdMAQfo4QeUAQc8sEPwEAAtBjsMAQfo4Qc8AQaUxEPwEAAtBjsMAQfo4Qc8AQaUxEPwEAAtBtdMAQfo4QeUAQc8sEPwEAAtBjsMAQfo4Qc8AQaUxEPwEAAtBtdMAQfo4QeUAQc8sEPwEAAtBjsMAQfo4Qc8AQaUxEPwEAAsMACAAIAEgAhAZQQALBgAQG0EAC5YCAQN/AkAQIw0AAkACQAJAQQAoAvzpASIDIABHDQBB/OkBIQMMAQsgAyEDA0AgAyIERQ0CIAQoAggiBSEDIAUgAEcNAAsgBEEIaiEDCyADIAAoAgg2AgALIAAgAjYCBCAAIAE2AgAgAEEAOwEMA0AQ8AQiAUH/A3EiAkUNAEEAKAL86QEiA0UhBQJAAkAgAw0AIAUhBQwBCyADIQQgBSEFIAIgAy8BDEEHdkYNAANAIAQoAggiA0UhBQJAIAMNACAFIQUMAgsgAyEEIAUhBSACIAMvAQxBB3ZHDQALCyAFRQ0ACyAAIAFBB3Q7AQwgAEEAKAL86QE2AghBACAANgL86QEgAUH/A3EPC0GePUEnQZwiEPcEAAuIAgEEfwJAIAAtAA1BPkcNACAALQADQQFxRQ0AIAApAgQQ7wRSDQBBACgC/OkBIgFFDQAgAC8BDiECIAEhAQNAAkAgASIBLwEMIgMgAnMiBEH//wNxQf8ASw0AIARBH3ENAiABIANBAWpBH3EgA0Hg/wNxcjsBDCABIAAgAUEEaiABIAJBwABxGygCABECACACQSBxRQ0CIAFBACABKAIEEQIAAkACQAJAQQAoAvzpASIAIAFHDQBB/OkBIQAMAQsgACEAA0AgACIERQ0CIAQoAggiAiEAIAIgAUcNAAsgBEEIaiEACyAAIAEoAgg2AgALIAFBADsBDA8LIAEoAggiBCEBIAQNAAsLC1kBA38CQAJAAkBBACgC/OkBIgEgAEcNAEH86QEhAQwBCyABIQEDQCABIgJFDQIgAigCCCIDIQEgAyAARw0ACyACQQhqIQELIAEgACgCCDYCAAsgAEEAOwEMCzcBAX8CQCAAQQ5xQQhHDQBBAA8LQQAhAQJAIABBDHFBDEYNACAAQQR2QQggAEEDcXRNIQELIAELkwQCAX8BfiABQQ9xIQMCQAJAIAFBEE8NACACIQIMAQsgAUEQdEGAgMD/A2pBgIDA/wdxrUIghr8gAqIhAgsgAiECAkACQAJAAkACQAJAIANBfmoOCgABBQUFAgUFAwQFC0EAIQECQCACRAAAAAAAAAAAYw0AQX8hASACRAAA4P///+9BZA0AAkACQCACRAAAAAAAAOA/oCICRAAAAAAAAPBBYyACRAAAAAAAAAAAZnFFDQAgAqshAQwBC0EAIQELIAEhAQsgACABNgAADwtCACEEAkAgAkQAAAAAAAAAAGMNACACRAAAAAAAAPBDZA0AAkACQCACRAAAAAAAAOA/oCICRAAAAAAAAPBDYyACRAAAAAAAAAAAZnFFDQAgArEhBAwBC0IAIQQLIAQhBAsgACAENwAADwsCQEQAAAAAAADgQyACRAAAAAAAAOA/oCACRAAAAAAAAOBDZCACRAAAAAAAAOBDY3IbIgKZRAAAAAAAAOBDY0UNACAAIAKwNwAADwsgAEKAgICAgICAgIB/NwAADwsgACACtjgAAA8LIAAgAjkAAA8LQYCAgIB4IQECQCACRAAAAAAAAODBYw0AQf////8HIQEgAkQAAMD////fQWQNAAJAAkAgAkQAAAAAAADgP6AiAplEAAAAAAAA4EFjRQ0AIAKqIQEMAQtBgICAgHghAQsgASEBCyAAIAMgARDEBAv4AQACQCABQQhJDQAgACABIAK3EMMEDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4ICAABAgMEBQYHCyAAIAJB//8DIAJB//8DSBsiAUEAIAFBAEobOwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtB/TdBrgFBmcgAEPcEAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALuwMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDFBLchAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICA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aiECIAENAAsgByECDAILAkAgBUEBcUUNACAHIQIMAgsCQAJAIAMNACAEwEFQaiEBDAELQX8hASAEQSByIgRBn39qQf8BcUEFSw0AIATAQal/aiEBCyABIQEgAkEBaiECAkACQCAIDQAgByEGIAFBBHRBgAJyIQUMAQsgByABIAhyOgAAIAdBAWohBkEAIQULIAItAAAiB0UhBCAHIQMgAiEBIAUhBSAGIgIhBiACIQIgBw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGUFiAEEDwQHQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwv5CgELfyMAQcAAayIEJAAgACABaiEFIARBf2ohBiAEQQFyIQcgBEECciEIIABBAEchCSACIQEgAyEKIAIhAiAAIQMDQCADIQMgAiECIAohCyABIgpBAWohAQJAAkAgCi0AACIMQSVGDQAgDEUNACABIQEgCyEKIAIhAkEBIQwgAyEDDAELAkACQCACIAFHDQAgAyEDDAELIAJBf3MgAWohDQJAIAUgA2siDkEBSA0AIAMgAiANIA5Bf2ogDiANShsiDhCZBSAOakEAOgAACyADIA1qIQMLIAMhDQJAIAwNACABIQEgCyEKIAIhAkEAIQwgDSEDDAELAkACQCABLQAAQS1GDQAgASEBQQAhAgwBCyAKQQJqIAEgCi0AAkHzAEYiAhshASACIAlxIQILIAIhAiABIg4sAAAhASAEQQA6AAECQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCALKAIAOgAAIAtBBGohAgwMCyAEIQICQAJAIAsoAgAiAUF/TA0AIAEhASACIQIMAQsgBEEtOgAAQQAgAWshASAHIQILIAtBBGohCyACIgwhAiABIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyED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ICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQmQUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2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NwMIC+cCAQF/IwBB0ABrIgQkAAJAAkAgA0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEOoFIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQ6gUgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORDqBSAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQ6gUgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEOoFIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABDgBUUNACADIAQQ0AUhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQ6gUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxDiBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ4AVBAEoNAAJAIAEgCSADIAoQ4AVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ6gUgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEOoFIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABDqBSAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQg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CCAAIAE2AgwgASACNgIMIAEgADYCCA8LQR8hAgJAIABB////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEGw7wFqIQQCQAJAAkACQEEAKAKE7QEiBkEBIAJ0IgNxDQBBACAGIANyNgKE7QEgBCABNgIAIAEgBDYCGAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAqDtAUF/aiIBQX8gARs2AqDtAQsLBwA/AEEQdAtUAQJ/QQAoAuTOASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDcBU0NACAAEBVFDQELQQAgADYC5M4BIAEPCxCWBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ3wVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEN8FQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxDfBSAFQTBqIAogASAHEOkFIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ3wUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ3wUgBSACIARBASAGaxDpBSAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQ5wUOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ6AUaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahDfBUEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEN8FIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEOsFIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEOsFIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEOsFIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEOsFIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEOsFIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEOsFIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEOsFIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEOsFIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEOsFIAVBkAFqIANCD4ZCACAEQgAQ6wUgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABDrBSAFQYABakIBIAJ9QgAgBEIAEOsFIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4Q6wUgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4Q6wUgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxDpBSAFQTBqIBYgEyAGQfAAahDfBSAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxDrBSAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEOsFIAUgAyAOQgVCABDrBSAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ3wUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ3wUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDfBSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDfBSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDfBUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDfBSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhDfBSAFQSBqIAIgBCAGEN8FIAVBEGogEiABIAcQ6QUgBSACIAQgBxDpBSAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ3gUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEN8FIAIgACAEQYH4ACADaxDpBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQfDwBSQDQfDwAUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAARDwALJQEBfiAAIAEgAq0gA61CIIaEIAQQ+QUhBSAFQiCIpxDvBSAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwuWz4GAAAMAQYAIC6jCAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAV1NTSy1IOiBzdHJlYW1pbmc6ICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AcHJvZ1ZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAGZyb20AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mAHNlbGYAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAHByb2dOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgRXhjZXB0aW9uOiBQYW5pY18lZCBhdCAoZ3BjOiVkKQAqICBhdCB1bmtub3duIChncGM6JWQpACogIGF0ICVzX0YlZCAocGM6JWQpACEgIGF0ICVzX0YlZCAocGM6JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQAlcyAoV1NTSykAIXRhcmdldF9pbl9pcnEoKQBmc3RvcjogaW52YWxpZCBsYXJnZSBrZXk6ICclcycAZnN0b3I6IGludmFsaWQga2V5OiAnJXMnAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABADAuMC4wAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAARENGRwqbtMr4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAgACAAIA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KTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAA+PKAgAAEbmFtZQGIcvwFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkUZGV2c190cmFja19leGNlcHRpb25aD2RldnNkYmdfcHJvY2Vzc1sRZGV2c2RiZ19yZXN0YXJ0ZWRcFWRldnNkYmdfaGFuZGxlX3BhY2tldF0Lc2VuZF92YWx1ZXNeEXZhbHVlX2Zyb21fdGFnX3YwXxlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYA1vYmpfZ2V0X3Byb3BzYQxleHBhbmRfdmFsdWViEmRldnNkYmdfc3VzcGVuZF9jYmMMZGV2c2RiZ19pbml0ZBBleHBhbmRfa2V5X3ZhbHVlZQZrdl9hZGRmD2RldnNtZ3JfcHJvY2Vzc2cHdHJ5X3J1bmgMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUQZGV2c19maWJlcl95aWVsZHYYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EWRldnNfZmliZXJfYnlfdGFnfhBkZXZzX2ZpYmVyX3N0YXJ0fxRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYABDmRldnNfZmliZXJfcnVugQETZGV2c19maWJlcl9zeW5jX25vd4IBCmRldnNfcGFuaWODARVfZGV2c19pbnZhbGlkX3Byb2dyYW2EAQ9kZXZzX2ZpYmVyX3Bva2WFARZkZXZzX2djX29ial9jaGVja19jb3JlhgETamRfZ2NfYW55X3RyeV9hbGxvY4cBB2RldnNfZ2OIAQ9maW5kX2ZyZWVfYmxvY2uJARJkZXZzX2FueV90cnlfYWxsb2OKAQ5kZXZzX3RyeV9hbGxvY4sBC2pkX2djX3VucGlujAEKamRfZ2NfZnJlZY0BFGRldnNfdmFsdWVfaXNfcGlubmVkjgEOZGV2c192YWx1ZV9waW6PARBkZXZzX3ZhbHVlX3VucGlukAESZGV2c19tYXBfdHJ5X2FsbG9jkQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkgEUZGV2c19hcnJheV90cnlfYWxsb2OTARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OUARVkZXZzX3N0cmluZ190cnlfYWxsb2OVARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJYBD2RldnNfZ2Nfc2V0X2N0eJcBDmRldnNfZ2NfY3JlYXRlmAEPZGV2c19nY19kZXN0cm95mQERZGV2c19nY19vYmpfY2hlY2uaAQtzY2FuX2djX29iapsBEXByb3BfQXJyYXlfbGVuZ3RonAESbWV0aDJfQXJyYXlfaW5zZXJ0nQESZnVuMV9BcnJheV9pc0FycmF5ngEQbWV0aFhfQXJyYXlfcHVzaJ8BFW1ldGgxX0FycmF5X3B1c2hSYW5nZaABEW1ldGhYX0FycmF5X3NsaWNloQERZnVuMV9CdWZmZXJfYWxsb2OiARBmdW4xX0J1ZmZlcl9mcm9towEScHJvcF9CdWZmZXJfbGVuZ3RopAEVbWV0aDFfQnVmZmVyX3RvU3RyaW5npQETbWV0aDNfQnVmZmVyX2ZpbGxBdKYBE21ldGg0X0J1ZmZlcl9ibGl0QXSnARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKgBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6kBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKoBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKsBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50rAEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdK0BGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50rgEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKvAR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7ABGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7EBFG1ldGgxX0Vycm9yX19fY3Rvcl9fsgEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7MBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7QBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9ftQEPcHJvcF9FcnJvcl9uYW1ltgERbWV0aDBfRXJyb3JfcHJpbnS3AQ9wcm9wX0RzRmliZXJfaWS4ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkuQEUbWV0aDFfRHNGaWJlcl9yZXN1bWW6ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZbsBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmS8ARFmdW4wX0RzRmliZXJfc2VsZr0BFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0vgEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGW/ARJwcm9wX0Z1bmN0aW9uX25hbWXAAQ9mdW4yX0pTT05fcGFyc2XBARNmdW4zX0pTT05fc3RyaW5naWZ5wgEOZnVuMV9NYXRoX2NlaWzDAQ9mdW4xX01hdGhfZmxvb3LEAQ9mdW4xX01hdGhfcm91bmTFAQ1mdW4xX01hdGhfYWJzxgEQZnVuMF9NYXRoX3JhbmRvbccBE2Z1bjFfTWF0aF9yYW5kb21JbnTIAQ1mdW4xX01hdGhfbG9nyQENZnVuMl9NYXRoX3Bvd8oBDmZ1bjJfTWF0aF9pZGl2ywEOZnVuMl9NYXRoX2ltb2TMAQ5mdW4yX01hdGhfaW11bM0BDWZ1bjJfTWF0aF9taW7OAQtmdW4yX21pbm1heM8BDWZ1bjJfTWF0aF9tYXjQARJmdW4yX09iamVjdF9hc3NpZ27RARBmdW4xX09iamVjdF9rZXlz0gETZnVuMV9rZXlzX29yX3ZhbHVlc9MBEmZ1bjFfT2JqZWN0X3ZhbHVlc9QBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m1QEQcHJvcF9QYWNrZXRfcm9sZdYBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLXARNwcm9wX1BhY2tldF9zaG9ydElk2AEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV42QEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTaARFwcm9wX1BhY2tldF9mbGFnc9sBFXByb3BfUGFja2V0X2lzQ29tbWFuZNwBFHByb3BfUGFja2V0X2lzUmVwb3J03QETcHJvcF9QYWNrZXRfcGF5bG9hZN4BE3Byb3BfUGFja2V0X2lzRXZlbnTfARVwcm9wX1BhY2tldF9ldmVudENvZGXgARRwcm9wX1BhY2tldF9pc1JlZ1NldOEBFHByb3BfUGFja2V0X2lzUmVnR2V04gETcHJvcF9QYWNrZXRfcmVnQ29kZeMBFHByb3BfUGFja2V0X2lzQWN0aW9u5AEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl5QESZGV2c19nZXRfc3BlY19jb2Rl5gETbWV0aDBfUGFja2V0X2RlY29kZecBEmRldnNfcGFja2V0X2RlY29kZegBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZOkBFERzUmVnaXN0ZXJfcmVhZF9jb2506gESZGV2c19wYWNrZXRfZW5jb2Rl6wEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZewBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXtARZwcm9wX0RzUGFja2V0SW5mb19uYW1l7gEWcHJvcF9Ec1BhY2tldEluZm9fY29kZe8BGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX/ABE3Byb3BfRHNSb2xlX2lzQm91bmTxARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTyARFtZXRoMF9Ec1JvbGVfd2FpdPMBEnByb3BfU3RyaW5nX2xlbmd0aPQBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF09QETbWV0aDFfU3RyaW5nX2NoYXJBdPYBEm1ldGgyX1N0cmluZ19zbGljZfcBFGRldnNfamRfZ2V0X3JlZ2lzdGVy+AEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZPkBEGRldnNfamRfc2VuZF9jbWT6ARFkZXZzX2pkX3dha2Vfcm9sZfsBFGRldnNfamRfcmVzZXRfcGFja2V0/AETZGV2c19qZF9wa3RfY2FwdHVyZf0BE2RldnNfamRfc2VuZF9sb2dtc2f+ARJkZXZzX2pkX3Nob3VsZF9ydW7/ARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZYACE2RldnNfamRfcHJvY2Vzc19wa3SBAhRkZXZzX2pkX3JvbGVfY2hhbmdlZIICEmRldnNfamRfaW5pdF9yb2xlc4MCEmRldnNfamRfZnJlZV9yb2xlc4QCFWRldnNfc2V0X2dsb2JhbF9mbGFnc4UCF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzhgIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzhwIQZGV2c19qc29uX2VzY2FwZYgCFWRldnNfanNvbl9lc2NhcGVfY29yZYkCD2RldnNfanNvbl9wYXJzZYoCCmpzb25fdmFsdWWLAgxwYXJzZV9zdHJpbmeMAg1zdHJpbmdpZnlfb2JqjQIKYWRkX2luZGVudI4CD3N0cmluZ2lmeV9maWVsZI8CE2RldnNfanNvbl9zdHJpbmdpZnmQAhFwYXJzZV9zdHJpbmdfY29yZZECEWRldnNfbWFwbGlrZV9pdGVykgIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3STAhJkZXZzX21hcF9jb3B5X2ludG+UAgxkZXZzX21hcF9zZXSVAgZsb29rdXCWAhNkZXZzX21hcGxpa2VfaXNfbWFwlwIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzmAIRZGV2c19hcnJheV9pbnNlcnSZAghrdl9hZGQuMZoCEmRldnNfc2hvcnRfbWFwX3NldJsCD2RldnNfbWFwX2RlbGV0ZZwCEmRldnNfc2hvcnRfbWFwX2dldJ0CF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0ngIOZGV2c19yb2xlX3NwZWOfAhJkZXZzX2Z1bmN0aW9uX2JpbmSgAhFkZXZzX21ha2VfY2xvc3VyZaECDmRldnNfZ2V0X2ZuaWR4ogITZGV2c19nZXRfZm5pZHhfY29yZaMCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZKQCE2RldnNfZ2V0X3JvbGVfcHJvdG+lAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnemAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSnAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+oAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+pAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51baoCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+rAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSsAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmStAhBkZXZzX2luc3RhbmNlX29mrgIPZGV2c19vYmplY3RfZ2V0rwIMZGV2c19zZXFfZ2V0sAIMZGV2c19hbnlfZ2V0sQIMZGV2c19hbnlfc2V0sgIMZGV2c19zZXFfc2V0swIOZGV2c19hcnJheV9zZXS0AhNkZXZzX2FycmF5X3Bpbl9wdXNotQIMZGV2c19hcmdfaW50tgIPZGV2c19hcmdfZG91YmxltwIPZGV2c19yZXRfZG91YmxluAIMZGV2c19yZXRfaW50uQINZGV2c19yZXRfYm9vbLoCD2RldnNfcmV0X2djX3B0crsCEWRldnNfYXJnX3NlbGZfbWFwvAIRZGV2c19zZXR1cF9yZXN1bWW9Ag9kZXZzX2Nhbl9hdHRhY2i+AhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlvwIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlwAISZGV2c19yZWdjYWNoZV9mcmVlwQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbMICF2RldnNfcmVnY2FjaGVfbWFya191c2VkwwITZGV2c19yZWdjYWNoZV9hbGxvY8QCFGRldnNfcmVnY2FjaGVfbG9va3VwxQIRZGV2c19yZWdjYWNoZV9hZ2XGAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZccCEmRldnNfcmVnY2FjaGVfbmV4dMgCD2pkX3NldHRpbmdzX2dldMkCD2pkX3NldHRpbmdzX3NldMoCDmRldnNfbG9nX3ZhbHVlywIPZGV2c19zaG93X3ZhbHVlzAIQZGV2c19zaG93X3ZhbHVlMM0CDWNvbnN1bWVfY2h1bmvOAg1zaGFfMjU2X2Nsb3NlzwIPamRfc2hhMjU2X3NldHVw0AIQamRfc2hhMjU2X3VwZGF0ZdECEGpkX3NoYTI1Nl9maW5pc2jSAhRqZF9zaGEyNTZfaG1hY19zZXR1cNMCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaNQCDmpkX3NoYTI1Nl9oa2Rm1QIOZGV2c19zdHJmb3JtYXTWAg5kZXZzX2lzX3N0cmluZ9cCDmRldnNfaXNfbnVtYmVy2AIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjZAhNkZXZzX2J1aWx0aW5fc3RyaW5n2gIUZGV2c19zdHJpbmdfdnNwcmludGbbAhNkZXZzX3N0cmluZ19zcHJpbnRm3AIVZGV2c19zdHJpbmdfZnJvbV91dGY43QIUZGV2c192YWx1ZV90b19zdHJpbmfeAhBidWZmZXJfdG9fc3RyaW5n3wIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZOACEmRldnNfc3RyaW5nX2NvbmNhdOECEWRldnNfc3RyaW5nX3NsaWNl4gISZGV2c19wdXNoX3RyeWZyYW1l4wIRZGV2c19wb3BfdHJ5ZnJhbWXkAg9kZXZzX2R1bXBfc3RhY2vlAhNkZXZzX2R1bXBfZXhjZXB0aW9u5gIKZGV2c190aHJvd+cCEmRldnNfcHJvY2Vzc190aHJvd+gCEGRldnNfYWxsb2NfZXJyb3LpAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LqAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y6wIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y7AIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LtAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTuAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LvAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcvACFmRldnNfdmFsdWVfZnJvbV9kb3VibGXxAhNkZXZzX3ZhbHVlX2Zyb21faW508gIUZGV2c192YWx1ZV9mcm9tX2Jvb2zzAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcvQCFGRldnNfdmFsdWVfdG9fZG91Ymxl9QIRZGV2c192YWx1ZV90b19pbnT2AhJkZXZzX3ZhbHVlX3RvX2Jvb2z3Ag5kZXZzX2lzX2J1ZmZlcvgCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl+QIQZGV2c19idWZmZXJfZGF0YfoCE2RldnNfYnVmZmVyaXNoX2RhdGH7AhRkZXZzX3ZhbHVlX3RvX2djX29iavwCDWRldnNfaXNfYXJyYXn9AhFkZXZzX3ZhbHVlX3R5cGVvZv4CD2RldnNfaXNfbnVsbGlzaP8CGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSAAxRkZXZzX3ZhbHVlX2FwcHJveF9lcYEDEmRldnNfdmFsdWVfaWVlZV9lcYIDDWRldnNfdmFsdWVfZXGDAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOEAxJkZXZzX2ltZ19zdHJpZHhfb2uFAxJkZXZzX2R1bXBfdmVyc2lvbnOGAwtkZXZzX3ZlcmlmeYcDEWRldnNfZmV0Y2hfb3Bjb2RliAMOZGV2c192bV9yZXN1bWWJAxFkZXZzX3ZtX3NldF9kZWJ1Z4oDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOLAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSMAwxkZXZzX3ZtX2hhbHSNAw9kZXZzX3ZtX3N1c3BlbmSOAxZkZXZzX3ZtX3NldF9icmVha3BvaW50jwMUZGV2c192bV9leGVjX29wY29kZXOQAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeJEDEWRldnNfaW1nX2dldF91dGY4kgMUZGV2c19nZXRfc3RhdGljX3V0ZjiTAw9kZXZzX3ZtX3JvbGVfb2uUAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaJUDDGV4cHJfaW52YWxpZJYDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0lwMLc3RtdDFfY2FsbDCYAwtzdG10Ml9jYWxsMZkDC3N0bXQzX2NhbGwymgMLc3RtdDRfY2FsbDObAwtzdG10NV9jYWxsNJwDC3N0bXQ2X2NhbGw1nQMLc3RtdDdfY2FsbDaeAwtzdG10OF9jYWxsN58DC3N0bXQ5X2NhbGw4oAMSc3RtdDJfaW5kZXhfZGVsZXRloQMMc3RtdDFfcmV0dXJuogMJc3RtdHhfam1wowMMc3RtdHgxX2ptcF96pAMKZXhwcjJfYmluZKUDEmV4cHJ4X29iamVjdF9maWVsZKYDEnN0bXR4MV9zdG9yZV9sb2NhbKcDE3N0bXR4MV9zdG9yZV9nbG9iYWyoAxJzdG10NF9zdG9yZV9idWZmZXKpAwlleHByMF9pbmaqAxBleHByeF9sb2FkX2xvY2FsqwMRZXhwcnhfbG9hZF9nbG9iYWysAwtleHByMV91cGx1c60DC2V4cHIyX2luZGV4rgMPc3RtdDNfaW5kZXhfc2V0rwMUZXhwcngxX2J1aWx0aW5fZmllbGSwAxJleHByeDFfYXNjaWlfZmllbGSxAxFleHByeDFfdXRmOF9maWVsZLIDEGV4cHJ4X21hdGhfZmllbGSzAw5leHByeF9kc19maWVsZLQDD3N0bXQwX2FsbG9jX21hcLUDEXN0bXQxX2FsbG9jX2FycmF5tgMSc3RtdDFfYWxsb2NfYnVmZmVytwMRZXhwcnhfc3RhdGljX3JvbGW4AxNleHByeF9zdGF0aWNfYnVmZmVyuQMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nugMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7sDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7wDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbr0DDWV4cHJ4X2xpdGVyYWy+AxFleHByeF9saXRlcmFsX2Y2NL8DEGV4cHJ4X3JvbGVfcHJvdG/AAxFleHByM19sb2FkX2J1ZmZlcsEDDWV4cHIwX3JldF92YWzCAwxleHByMV90eXBlb2bDAw9leHByMF91bmRlZmluZWTEAxJleHByMV9pc191bmRlZmluZWTFAwpleHByMF90cnVlxgMLZXhwcjBfZmFsc2XHAw1leHByMV90b19ib29syAMJZXhwcjBfbmFuyQMJZXhwcjFfYWJzygMNZXhwcjFfYml0X25vdMsDDGV4cHIxX2lzX25hbswDCWV4cHIxX25lZ80DCWV4cHIxX25vdM4DDGV4cHIxX3RvX2ludM8DCWV4cHIyX2FkZNADCWV4cHIyX3N1YtEDCWV4cHIyX211bNIDCWV4cHIyX2RpdtMDDWV4cHIyX2JpdF9hbmTUAwxleHByMl9iaXRfb3LVAw1leHByMl9iaXRfeG9y1gMQZXhwcjJfc2hpZnRfbGVmdNcDEWV4cHIyX3NoaWZ0X3JpZ2h02AMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTZAwhleHByMl9lcdoDCGV4cHIyX2xl2wMIZXhwcjJfbHTcAwhleHByMl9uZd0DEGV4cHIxX2lzX251bGxpc2jeAxRzdG10eDJfc3RvcmVfY2xvc3VyZd8DE2V4cHJ4MV9sb2FkX2Nsb3N1cmXgAxJleHByeF9tYWtlX2Nsb3N1cmXhAxBleHByMV90eXBlb2Zfc3Ry4gMTc3RtdHhfam1wX3JldF92YWxfeuMDEHN0bXQyX2NhbGxfYXJyYXnkAwlzdG10eF90cnnlAw1zdG10eF9lbmRfdHJ55gMLc3RtdDBfY2F0Y2jnAw1zdG10MF9maW5hbGx56AMLc3RtdDFfdGhyb3fpAw5zdG10MV9yZV90aHJvd+oDEHN0bXR4MV90aHJvd19qbXDrAw5zdG10MF9kZWJ1Z2dlcuwDCWV4cHIxX25ld+0DEWV4cHIyX2luc3RhbmNlX29m7gMKZXhwcjBfbnVsbO8DD2V4cHIyX2FwcHJveF9lcfADD2V4cHIyX2FwcHJveF9uZfEDE3N0bXQxX3N0b3JlX3JldF92YWzyAw9kZXZzX3ZtX3BvcF9hcmfzAxNkZXZzX3ZtX3BvcF9hcmdfdTMy9AMTZGV2c192bV9wb3BfYXJnX2kzMvUDFmRldnNfdm1fcG9wX2FyZ19idWZmZXL2AxJqZF9hZXNfY2NtX2VuY3J5cHT3AxJqZF9hZXNfY2NtX2RlY3J5cHT4AwxBRVNfaW5pdF9jdHj5Aw9BRVNfRUNCX2VuY3J5cHT6AxBqZF9hZXNfc2V0dXBfa2V5+wMOamRfYWVzX2VuY3J5cHT8AxBqZF9hZXNfY2xlYXJfa2V5/QMLamRfd3Nza19uZXf+AxRqZF93c3NrX3NlbmRfbWVzc2FnZf8DE2pkX3dlYnNvY2tfb25fZXZlbnSABAdkZWNyeXB0gQQNamRfd3Nza19jbG9zZYIEEGpkX3dzc2tfb25fZXZlbnSDBAtyZXNwX3N0YXR1c4QEEndzc2toZWFsdGhfcHJvY2Vzc4UEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlhgQUd3Nza2hlYWx0aF9yZWNvbm5lY3SHBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSIBA9zZXRfY29ubl9zdHJpbmeJBBFjbGVhcl9jb25uX3N0cmluZ4oED3dzc2toZWFsdGhfaW5pdIsEEXdzc2tfc2VuZF9tZXNzYWdljAQRd3Nza19pc19jb25uZWN0ZWSNBBR3c3NrX3RyYWNrX2V4Y2VwdGlvbo4EEndzc2tfc2VydmljZV9xdWVyeY8EHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWQBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlkQQPcm9sZW1ncl9wcm9jZXNzkgQQcm9sZW1ncl9hdXRvYmluZJMEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJQEFGpkX3JvbGVfbWFuYWdlcl9pbml0lQQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVklgQNamRfcm9sZV9hbGxvY5cEEGpkX3JvbGVfZnJlZV9hbGyYBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kmQQTamRfY2xpZW50X2xvZ19ldmVudJoEE2pkX2NsaWVudF9zdWJzY3JpYmWbBBRqZF9jbGllbnRfZW1pdF9ldmVudJwEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VknQQQamRfZGV2aWNlX2xvb2t1cJ4EGGpkX2RldmljZV9sb29rdXBfc2VydmljZZ8EE2pkX3NlcnZpY2Vfc2VuZF9jbWSgBBFqZF9jbGllbnRfcHJvY2Vzc6EEDmpkX2RldmljZV9mcmVlogQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSjBA9qZF9kZXZpY2VfYWxsb2OkBBBzZXR0aW5nc19wcm9jZXNzpQQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKYEDXNldHRpbmdzX2luaXSnBA9qZF9jdHJsX3Byb2Nlc3OoBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSpBAxqZF9jdHJsX2luaXSqBBRkY2ZnX3NldF91c2VyX2NvbmZpZ6sECWRjZmdfaW5pdKwEDWRjZmdfdmFsaWRhdGWtBA5kY2ZnX2dldF9lbnRyea4EDGRjZmdfZ2V0X2kzMq8EDGRjZmdfZ2V0X3UzMrAED2RjZmdfZ2V0X3N0cmluZ7EEDGRjZmdfaWR4X2tlebIECWpkX3ZkbWVzZ7MEEWpkX2RtZXNnX3N0YXJ0cHRytAQNamRfZG1lc2dfcmVhZLUEEmpkX2RtZXNnX3JlYWRfbGluZbYEE2pkX3NldHRpbmdzX2dldF9iaW63BA1qZF9mc3Rvcl9pbml0uAQTamRfc2V0dGluZ3Nfc2V0X2JpbrkEC2pkX2ZzdG9yX2djugQPcmVjb21wdXRlX2NhY2hluwQVamRfc2V0dGluZ3NfZ2V0X2xhcmdlvAQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZb0EF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdlvgQWamRfc2V0dGluZ3Nfc3luY19sYXJnZb8EDWpkX2lwaXBlX29wZW7ABBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0wQQOamRfaXBpcGVfY2xvc2XCBBJqZF9udW1mbXRfaXNfdmFsaWTDBBVqZF9udW1mbXRfd3JpdGVfZmxvYXTEBBNqZF9udW1mbXRfd3JpdGVfaTMyxQQSamRfbnVtZm10X3JlYWRfaTMyxgQUamRfbnVtZm10X3JlYWRfZmxvYXTHBBFqZF9vcGlwZV9vcGVuX2NtZMgEFGpkX29waXBlX29wZW5fcmVwb3J0yQQWamRfb3BpcGVfaGFuZGxlX3BhY2tldMoEEWpkX29waXBlX3dyaXRlX2V4ywQQamRfb3BpcGVfcHJvY2Vzc8wEFGpkX29waXBlX2NoZWNrX3NwYWNlzQQOamRfb3BpcGVfd3JpdGXOBA5qZF9vcGlwZV9jbG9zZc8EDWpkX3F1ZXVlX3B1c2jQBA5qZF9xdWV1ZV9mcm9udNEEDmpkX3F1ZXVlX3NoaWZ00gQOamRfcXVldWVfYWxsb2PTBA1qZF9yZXNwb25kX3U41AQOamRfcmVzcG9uZF91MTbVBA5qZF9yZXNwb25kX3UzMtYEEWpkX3Jlc3BvbmRfc3RyaW5n1wQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTYBAtqZF9zZW5kX3BrdNkEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs2gQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLbBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V03AQUamRfYXBwX2hhbmRsZV9wYWNrZXTdBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTeBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXfBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl4AQQamRfc2VydmljZXNfaW5pdOEEDmpkX3JlZnJlc2hfbm934gQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOMEFGpkX3NlcnZpY2VzX2Fubm91bmNl5AQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXlBBBqZF9zZXJ2aWNlc190aWNr5gQVamRfcHJvY2Vzc19ldmVyeXRoaW5n5wQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXoBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l6QQUYXBwX2dldF9kZXZpY2VfY2xhc3PqBBJhcHBfZ2V0X2Z3X3ZlcnNpb27rBA1qZF9zcnZjZmdfcnVu7AQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXtBBFqZF9zcnZjZmdfdmFyaWFudO4EDWpkX2hhc2hfZm52MWHvBAxqZF9kZXZpY2VfaWTwBAlqZF9yYW5kb23xBAhqZF9jcmMxNvIEDmpkX2NvbXB1dGVfY3Jj8wQOamRfc2hpZnRfZnJhbWX0BAxqZF93b3JkX21vdmX1BA5qZF9yZXNldF9mcmFtZfYEEGpkX3B1c2hfaW5fZnJhbWX3BA1qZF9wYW5pY19jb3Jl+AQTamRfc2hvdWxkX3NhbXBsZV9tc/kEEGpkX3Nob3VsZF9zYW1wbGX6BAlqZF90b19oZXj7BAtqZF9mcm9tX2hlePwEDmpkX2Fzc2VydF9mYWls/QQHamRfYXRvaf4EC2pkX3ZzcHJpbnRm/wQPamRfcHJpbnRfZG91YmxlgAUKamRfc3ByaW50ZoEFEmpkX2RldmljZV9zaG9ydF9pZIIFDGpkX3NwcmludGZfYYMFC2pkX3RvX2hleF9hhAUJamRfc3RyZHVwhQUJamRfbWVtZHVwhgUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYcFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWIBRFqZF9zZW5kX2V2ZW50X2V4dIkFCmpkX3J4X2luaXSKBRRqZF9yeF9mcmFtZV9yZWNlaXZlZIsFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrjAUPamRfcnhfZ2V0X2ZyYW1ljQUTamRfcnhfcmVsZWFzZV9mcmFtZY4FEWpkX3NlbmRfZnJhbWVfcmF3jwUNamRfc2VuZF9mcmFtZZAFCmpkX3R4X2luaXSRBQdqZF9zZW5kkgUWamRfc2VuZF9mcmFtZV93aXRoX2NyY5MFD2pkX3R4X2dldF9mcmFtZZQFEGpkX3R4X2ZyYW1lX3NlbnSVBQtqZF90eF9mbHVzaJYFEF9fZXJybm9fbG9jYXRpb26XBQxfX2ZwY2xhc3NpZnmYBQVkdW1teZkFCF9fbWVtY3B5mgUHbWVtbW92ZZsFBm1lbXNldJwFCl9fbG9ja2ZpbGWdBQxfX3VubG9ja2ZpbGWeBQZmZmx1c2ifBQRmbW9koAUNX19ET1VCTEVfQklUU6EFDF9fc3RkaW9fc2Vla6IFDV9fc3RkaW9fd3JpdGWjBQ1fX3N0ZGlvX2Nsb3NlpAUIX190b3JlYWSlBQlfX3Rvd3JpdGWmBQlfX2Z3cml0ZXinBQZmd3JpdGWoBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja6kFFl9fcHRocmVhZF9tdXRleF91bmxvY2uqBQZfX2xvY2urBQhfX3VubG9ja6wFDl9fbWF0aF9kaXZ6ZXJvrQUKZnBfYmFycmllcq4FDl9fbWF0aF9pbnZhbGlkrwUDbG9nsAUFdG9wMTaxBQVsb2cxMLIFB19fbHNlZWuzBQZtZW1jbXC0BQpfX29mbF9sb2NrtQUMX19vZmxfdW5sb2NrtgUMX19tYXRoX3hmbG93twUMZnBfYmFycmllci4xuAUMX19tYXRoX29mbG93uQUMX19tYXRoX3VmbG93ugUEZmFic7sFA3Bvd7wFBXRvcDEyvQUKemVyb2luZm5hbr4FCGNoZWNraW50vwUMZnBfYmFycmllci4ywAUKbG9nX2lubGluZcEFCmV4cF9pbmxpbmXCBQtzcGVjaWFsY2FzZcMFDWZwX2ZvcmNlX2V2YWzEBQVyb3VuZMUFBnN0cmNocsYFC19fc3RyY2hybnVsxwUGc3RyY21wyAUGc3RybGVuyQUHX191Zmxvd8oFB19fc2hsaW3LBQhfX3NoZ2V0Y8wFB2lzc3BhY2XNBQZzY2FsYm7OBQljb3B5c2lnbmzPBQdzY2FsYm5s0AUNX19mcGNsYXNzaWZ5bNEFBWZtb2Rs0gUFZmFic2zTBQtfX2Zsb2F0c2NhbtQFCGhleGZsb2F01QUIZGVjZmxvYXTWBQdzY2FuZXhw1wUGc3RydG942AUGc3RydG9k2QUSX193YXNpX3N5c2NhbGxfcmV02gUIZGxtYWxsb2PbBQZkbGZyZWXcBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXdBQRzYnJr3gUIX19hZGR0ZjPfBQlfX2FzaGx0aTPgBQdfX2xldGYy4QUHX19nZXRmMuIFCF9fZGl2dGYz4wUNX19leHRlbmRkZnRmMuQFDV9fZXh0ZW5kc2Z0ZjLlBQtfX2Zsb2F0c2l0ZuYFDV9fZmxvYXR1bnNpdGbnBQ1fX2ZlX2dldHJvdW5k6AUSX19mZV9yYWlzZV9pbmV4YWN06QUJX19sc2hydGkz6gUIX19tdWx0ZjPrBQhfX211bHRpM+wFCV9fcG93aWRmMu0FCF9fc3VidGYz7gUMX190cnVuY3RmZGYy7wULc2V0VGVtcFJldDDwBQtnZXRUZW1wUmV0MPEFCXN0YWNrU2F2ZfIFDHN0YWNrUmVzdG9yZfMFCnN0YWNrQWxsb2P0BRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW509QUVZW1zY3JpcHRlbl9zdGFja19pbml09gUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfcFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2X4BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT5BQxkeW5DYWxsX2ppamn6BRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp+wUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB+QUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 26472;
var ___stop_em_js = Module['___stop_em_js'] = 27525;



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
