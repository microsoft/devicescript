
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+aFgIAA5AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEBBQMACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQICBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgABAQEAAACBwADBwcBAgEAEgMJBwAABAACBwACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAdcB1wEFhoCAgAABAYACgAIG3YCAgAAOfwFB4PAFC38BQQALfwFBAAt/AUEAC38AQdjOAQt/AEHHzwELfwBBkdEBC38AQY3SAQt/AEGJ0wELfwBB2dMBC38AQfrTAQt/AEH/1QELfwBB2M4BC38AQfXWAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jANkFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCVBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDaBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAJ0FFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdAD0BRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAPUFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA9gUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPcFCXN0YWNrU2F2ZQDwBQxzdGFja1Jlc3RvcmUA8QUKc3RhY2tBbGxvYwDyBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50APMFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA+QUJ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ASAAKALQARCYASAAQQBBiAgQmgUaCxIAAkAgAEUNACAAEFEgABAiCwssAQF/IwBBEGsiAiQAIAIgATYCAEH20AAgAhA8IABB5NQDEIIBIAJBEGokAAsNACAAKALQASABEIwBCwIAC5EDAQR/AkACQAJAAkACQCABLwEOIgJBgH9qDgIAAQILAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtB0RJBABA8DwtBAiABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQJBqzNBABA8DwsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0HREkEAEDwPC0EBIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAUGrM0EAEDwPCyACQYAjRg0BAkAgACgCCCgCDCICRQ0AIAEgAhEEAEEASg0BCyABENYEGgsPCyABIAAoAggoAgQRCABB/wFxENIEGgs1AQJ/QQAoAqDcASEDQYABIQQCQAJAAkAgAEF/ag4CAAECC0GBASEECyADIAQgASACEIcFCwsbAQF/QcjZABDeBCIBIAA2AghBACABNgKg3AELLgEBfwJAQQAoAqDcASIBRQ0AIAEoAggiAUUNACABKAIQIgFFDQAgACABEQAACwvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQzQQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsEMwEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQzQQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0ACwsLbQEDfwJAQQAoAqTcASIBRQ0AAkAQcCICRQ0AIAIgAS0ABkEARxCJAyACQQA6AEkgAiABLQAIQQBHQQF0IgM6AEkgAS0A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A0UNACAAIAMpAyA3AwAMAQsgACAGNwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEM0EGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQxgQaIAMgACgCBC0ADjoACiADKAIQDwtB/sgAQeM7QTFBlDYQ+wQAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ/gINACADIAEpAwA3AxgCQAJAIAAgA0EYahCpAiICDQAgAyABKQMANwMQIAAgA0EQahCoAiEBDAELAkAgACACEKoCIgENAEEAIQEMAQsCQCAAIAIQlgINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDZAiADQShqIAAgBBC/AiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEJECIAFqIQIMAQsgACACQQBBABCRAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahChAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEPMCIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6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IANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEOwCQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFBqjFBABDqAgsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhDyAgwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEOwCQQAhAgwBCwJAIAAgASgCEBB9IgINACABQRhqIABBqjFBABDqAgsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABB9DJBABDqAgwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDsAkEAIQAMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQaoxQQAQ6gILIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALMgEBfwJAIABBABC1AiIBQQBIDQAgACgCrAEiACABEHggACAALQAQQfABcUEEcjoAEAsLGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABBpSVBABDqAgwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahChAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBriAgA0EIahDtAgwBCyAAIAEgASgCoAEgBEH//wNxEJwCIAApAwBCAFINACADQdgAaiABQQggASABQQIQkgIQkAEQ8wIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI4BIANB0ABqQfsAENkCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCxAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQmgIgAyAAKQMANwMQIAEgA0EQahCPAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahChAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ7AIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGwygFODQIgAEGw5AAgAUEDdGovAQAQ2QIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtB3BNB5jlBMUH8KxD7BAAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahD+Ag0AIAFBOGogAEH1GRDrAgsgASABKQNINwMgIAFBOGogACABQSBqEN0CIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjgEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ2AIiAkUNACABQTBqIAAgAiABKAI4QQEQiQIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCPASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQtQIhAiABIAEpAyA3AwgCQCABQQhqEP4CDQAgAUEYaiAAQc8bEOsCCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEI8CIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD0ApsQtwILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ9AKcELcCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPQCEMMFELcCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEPECCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahD0AiIERAAAAAAAAAAAY0UNACAAIASaELcCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEO8EuEQAAAAAAADwPaIQtwILZAEFfwJAAkAgAEEAELUCIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQ7wQgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRC4AgsRACAAIABBABC2AhCuBRC3AgsYACAAIABBABC2AiAAQQEQtgIQugUQtwILLgEDfyAAQQAQtQIhAUEAIQICQCAAQQEQtQIiA0UNACABIANtIQILIAAgAhC4AgsuAQN/IABBABC1AiEBQQAhAgJAIABBARC1AiIDRQ0AIAEgA28hAgsgACACELgCCxYAIAAgAEEAELUCIABBARC1AmwQuAILCQAgAEEBEM4BC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEPUCIQMgAiACKQMgNwMQIAAgAkEQahD1AiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ9AIhBiACIAIpAyA3AwAgACACEPQCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDqGw3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEB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AQIAAwsgASAAKAIsIAAvARIQ/AEgACABKQMANwMgQQEhAgwECwJAIAAoAiwiAigCtAEgAC8BEiIEQQxsaigCACgCECIDDQAgAEEAEHdBACECDAQLAkAgAkGnAmotAABBAXENACACQbICai8BACIFRQ0AIAUgAC8BFEcNACADLQAEIgUgAkGxAmotAABHDQAgA0EAIAVrQQxsakFkaikDACACQagCaikCAFINACACIAQgAC8BCBD/ASIDRQ0AIAJBoARqIAMQwgIaQQEhAgwECwJAIAAoAhggAigCwAFLDQAgAUEANgIMQQAhBAJAIAAvAQgiA0UNACACIAMgAUEMahCRAyEECyACQaQCaiEFIAAvARQhBiAALwESIQcgASgCDCEDIAJBAToApwIgAkGmAmogA0EHakH8AXE6AAAgAigCtAEgB0EMbGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAQiBEUNACACQbQCaiAEIAMQmAUaCyAFENcEIgNFIQIgAw0DAkAgAC8BCiIEQecHSw0AIAAgBEEBdDsBCgsgACAALwEKEHggAiECIAMNBAtBACECDAMLAkAgACgCLCICKAK0ASAALwESQQxsaigCACgCECIEDQAgAEEAEHdBACECDAMLIAAoAgghBSAALwEUIQYgAC0ADCEDIAJBpwJqQQE6AAAgAkGmAmogA0EHakH8AXE6AAAgBEEAIAQtAAQiB2tBDGxqQWRqKQMAIQggAkGyAmogBjsBACACQbECaiAHOgAAIAJBsAJqIAM6AAAgAkGoAmogCDcCAAJAIAVFDQAgAkG0AmogBSADEJgFGgsCQCACQaQCahDXBCICDQAgAkUhAgwDCyAAQQMQeEEAIQIMAgtBxz1B1gJB3B8Q9gQACyAAQQMQeCACIQILIAFBEGokACACC9MCAQZ/IwBBEGsiAyQAIABBtAJqIQQgAEGwAmotAAAhBQJAAkACQAJAIAINACAFIQUgBCEEDAELIAAgAiADQQxqEJEDIQYCQAJAIAMoAgwiByAALQCwAk4NACAEIAdqLQAADQAgBiAEIAcQsgUNACAHQQFqIQcMAQtBACEHCyAHIgdFDQEgBSAHayEFIAQgB2ohBAsgBCEH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wABJDQBBxN0BIAEQzQIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuN0BIAEgAyAAIAMgAEkbIgAQmAUaQQBBACgCvN0BIgkgAGs2ArzdASABIABqIQEgAyAAayECAkAgCSAARw0AQcTdAUH43AEQzQJBAEHAADYCvN0BQQBB+NwBNgK43QEgAiEDIAEhASACDQEMAgtBAEEAKAK43QEgAGo2ArjdASACIQMgASEBIAINAAsLIAgQ0wIgCEEgENICAkAgBUUNAEEAQQAoAsDdASAFajYCwN0BIAUhAyAEIQEDQCABIQEgAyEDAkBBACgCvN0BIgBBwABHDQAgA0HAAEkNAEHE3QEgARDNAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK43QEgASADIAAgAyAASRsiABCYBRpBAEEAKAK83QEiCSAAazYCvN0BIAEgAGohASADIABrIQICQCAJIABHDQBBxN0BQfjcARDNAkEAQcAANgK83QFBAEH43AE2ArjdASACIQMgASEBIAINAQwCC0EAQQAoArjdASAAajYCuN0BIAIhAyABIQEgAg0ACwsCQCAHRQ0AQQBBACgCwN0BIAdqNgLA3QEgByEDIAYhAQNAIAEhASADIQMCQEEAKAK83QEiAEHAAEcNACADQcAASQ0AQcTdASABEM0CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjdASABIAMgACADIABJGyIAEJgFGkEAQQAoArzdASIJIABrNgK83QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE3QFB+NwBEM0CQQBBwAA2ArzdAUEAQfjcATYCuN0BIAIhAyABIQEgAg0BDAILQQBBACgCuN0BIABqNgK43QEgAiEDIAEhASACDQALC0EAQQAoAsDdAUEBajYCwN0BQQEhA0Gu1wAhAQJAA0AgASEBIAMhAwJAQQAoArzdASIAQcAARw0AIANBwABJDQBBxN0BIAEQzQIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuN0BIAEgAyAAIAMgAEkbIgAQmAUaQQBBACgCvN0BIgkgAGs2ArzdASABIABqIQEgAyAAayECAkAgCSAARw0AQcTdAUH43AEQzQJBAEHAADYCvN0BQQBB+NwBNgK43QEgAiEDIAEhASACDQEMAgtBAEEA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AAwOCyAAQomAgYDAADcDAAwNCyAAQoSAgYDAADcDAAwMCyAAQoGAgYDAADcDAAwLCwJAIAJBoH9qIgRBI0sNACADIAQ2AhAgACABQYXAACADQRBqENsCDAsLAkAgAkGACEkNACADIAI2AiAgACABQeE+IANBIGoQ2wIMCwtBlztB/gBB7yUQ9gQACyADIAIoAgA2AjAgACABQe0+IANBMGoQ2wIMCQsgAigCACECIAMgASgCpAE2AkwgAyADQcwAaiACEHs2AkAgACABQZg/IANBwABqENsCDAgLIAMgASgCpAE2AlwgAyADQdwAaiAEQQR2Qf//A3EQezYCUCAAIAFBpz8gA0HQAGoQ2wIMBwsgAyABKAKkATYCZCADIANB5ABqIARBBHZB//8DcRB7NgJgIAAgAUHAPyADQeAAahDbAgwGCwJAAkAgAigCACIEDQBBACEFDAELIAQtAANBD3EhBQsCQAJAAkACQAJAAkAgBUF9ag4JAAQCBQEFBAMEBQsgAEKPgIGAwAA3AwAMCgsgAEKcgIGAwAA3AwAMCQsgAyACKQMANwNoIAAgASADQegAahDeAgwICyAELwESIQIgAyABKAKkATYChAEgA0GEAWogAhB8IQIgBC8BECEFIAMgBCgCHC8BBDYCeCADIAU2AnQgAyACNgJwIAAgAUHrPyADQfAAahDbAgwHCyAAQqaAgYDAADcDAAwGC0GXO0GiAUHvJRD2BAALIAIoAgBBgIABTw0FIAMgAikDADcDiAEgACABIANBiAFqEN4CDAQLIAIoAgAhAiADIAEoAqQBNgKcASADIANBnAFqIAIQfDYCkAEgACABQbU/IANBkAFqENsCDAMLIAMgAikDADcDuAEgASADQbgBaiADQcABahCdAiECIAMgASgCpAE2ArQBIANBtAFqIAMoAsABEHwhBCACLwEAIQIgAyABKAKkATYCsAEgAyADQbABaiACQQAQkAM2AqQBIAMgBDYCoAEgACABQYo/IANBoAFqENsCDAILQZc7QbEBQe8lEPYEAAsgAyACKQMANwMIIANBwAFqIAEgA0EIahD0AkEHEP4EIAMgA0HAAWo2AgAgACABQdgYIAMQ2wILIANBgAJqJAAPC0GL0ABBlztBpQFB7yUQ+wQAC3sBAn8jAEEgayIDJAAgAyACKQMANwMQAkAgASADQRBq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AA8LAkBEAAAAAAAA4EMgAkQAAAAAAADgP6AgAkQAAAAAAADgQ2QgAkQAAAAAAADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQAJAIAJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELIAEhAQsgACADIAEQwwQL+AEAAkAgAUEISQ0AIAAgASACtxDCBA8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQfM3Qa4BQY/IABD2BAALIAAgAkH/ASACQf8BSBsiAUEAIAFBAEobOgAAC7sDAwF/AXwBfgJAAkACQCABQQhJDQACQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQxAS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtB8zdBygFB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AkACQCADDQAgBMBBUGohAQwBC0F/IQEgBEEgciIEQZ9/akH/AXFBBUsNACAEwEGpf2ohAQsgASEBIAJBAWohAgJAAkAgCA0AIAchBiABQQR0QYACciEFDAELIAcgASAIcjoAACAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBBihYgBBA8EB0AC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QmAUgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQxwVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQxwVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBD+BCABQQhqIQIMBwsgCygCACIBQcjSACABGyIDEMcFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQmAUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBDHBSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQmAUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABELAFIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ6wWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ6wWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDrBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDrBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQmgUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QYD2AGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEJoFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQxwVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxD9BCEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALSQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgACABEP0EIgEQISIDIAEgACACKAIIEP0EGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkHKJ2otAAA6AAAgBUEBaiAGLQAAQQ9xQconai0AADoAACAEQQFqIgUhBCAFIAFHDQALCyADIAJqQQA6AAAgAwvpAQEHfyMAQRBrIgEkACABQQA2AgwgAUIANwIEIAEgADYCAAJAAkAgAA0AQQEhAgwBCyAAIQJBACEDQQAhBANAIAIhBSABIARBAWoiBEECdGooAgAiBiECIAUQxwUgA2oiBSEDIAQhBCAGDQALIAVBAWohAgsgAhAhIQdBACEFAkAgAEUNACAAIQJBACEDQQAhBANAIAIhAiAHIAMiA2ogAiACEMcFIgUQmAUaIAEgBEEBaiIEQQJ0aigCACIGIQIgBSADaiIFIQMgBCEEIAUhBSAGDQALCyAHIAVqQQA6AAAgAUEQaiQAIAcLGQACQCABDQBBARAhDwsgARAhIAAgARCYBQsSAAJAQQAoAsjqAUUNABCGBQsLngMBB38CQEEALwHM6gEiAEUNACAAIQFBACgCxOoBIgAiAiEDIAAhACACIQIDQCAAIQQgAiIAQQhqIQUgASECIAMhAQNAIAEhASACIQMCQAJAAkAgAC0ABSICQf8BRw0AIAAgAUcNAUEAIAMgAS0ABEEDakH8A3FBCGoiAmsiAzsBzOoBIAEgASACaiADQf//A3EQ8wQMAgtBACgCnNcBIAAoAgBrQQBIDQAgAkH/AHEgAC8BBiAFIAAtAAQQkAUNBAJAAkAgACwABSIBQX9KDQACQCAAQQAoAsTqASIBRg0AQf8BIQEMAgtBAEEALwHM6gEgAS0ABEEDakH8A3FBCGoiAmsiAzsBzOoBIAEgASACaiADQf//A3EQ8wQMAwsgACAAKAIAQdCGA2o2AgAgAUGAf3IhAQsgACABOgAFC0EALwHM6gEiBCEBQQAoAsTqASIFIQMgAC0ABEEDakH8A3EgAGpBCGoiBiEAIAYhAiAGIAVrIARIDQIMAwtBAC8BzOoBIgMhAkEAKALE6gEiBiEBIAQgBmsgA0gNAAsLCwvuAgEEfwJAAkAQIw0AIAFBgAJPDQFBAEEALQDO6gFBAWoiBDoAzuoBIAAtAAQgBEEIdCABQf8BcXJBgIB+ciIFQf//A3EgAiADEJAFGgJAQQAoAsTqAQ0AQYABECEhAUEAQdMBNgLI6gFBACABNgLE6gELAkAgA0EIaiIGQYABSg0AAkACQEGAAUEALwHM6gEiAWsgBkgNACABIQcMAQsgASEEA0BBACAEQQAoAsTqASIBLQAEQQNqQfwDcUEIaiIEayIHOwHM6gEgASABIARqIAdB//8DcRDzBEEALwHM6gEiASEEIAEhB0GAASABayAGSA0ACwtBACgCxOoBIAciBGoiASAFOwEGIAEgAzoABCABIAAtAAQ6AAUgAUEIaiACIAMQmAUaIAFBACgCnNcBQaCcAWo2AgBBACADQf8BcUEDakH8A3EgBGpBCGo7AczqAQsPC0G1PEHdAEH4DBD2BAALQbU8QSNB0y8Q9gQACxsAAkBBACgC0OoBDQBBAEGABBDRBDYC0OoBCws7AQF/AkAgAA0AQQAPC0EAIQECQCAAEOMERQ0AIAAgAC0AA0G/AXE6AANBACgC0OoBIAAQzgQhAQsgAQs7AQF/AkAgAA0AQQAPC0EAIQECQCAAEOMERQ0AIAAgAC0AA0HAAHI6AANBACgC0OoBIAAQzgQhAQsgAQsMAEEAKALQ6gEQzwQLDABBACgC0OoBENAECzUBAX8CQEEAKALU6gEgABDOBCIBRQ0AQeEmQQAQPAsCQCAAEIoFRQ0AQc8mQQAQPAsQQCABCzUBAX8CQEEAKALU6gEgABDOBCIBRQ0AQeEmQQAQPAsCQCAAEIoFRQ0AQc8mQQAQPAsQQCABCxsAAkBBACgC1OoBDQBBAEGABBDRBDYC1OoBCwuWAQECfwJAAkACQBAjDQBB3OoBIAAgASADEPUEIgQhBQJAIAQNABCRBUHc6gEQ9ARB3OoBIAAgASADEPUEIgEhBSABRQ0CCyAFIQECQCADRQ0AIAJFDQMgASACIAMQmAUaC0EADwtBjzxB0gBBiy8Q9gQAC0HGxABBjzxB2gBBiy8Q+wQAC0H7xABBjzxB4gBBiy8Q+wQAC0QAQQAQ7gQ3AuDqAUHc6gEQ8QQCQEEAKALU6gFB3OoBEM4ERQ0AQeEmQQAQPAsCQEHc6gEQigVFDQBBzyZBABA8CxBAC0YBAn8CQEEALQDY6gENAEEAIQACQEEAKALU6gEQzwQiAUUNAEEAQQE6ANjqASABIQALIAAPC0G5JkGPPEH0AEHbKxD7BAALRQACQEEALQDY6gFFDQBBACgC1OoBENAEQQBBADoA2OoBAkBBACgC1OoBEM8ERQ0AEEALDwtBuiZBjzxBnAFB6Q8Q+wQACzEAAkAQIw0AAkBBAC0A3uoBRQ0AEJEFEOEEQdzqARD0BAsPC0GPPEGpAUHrJBD2BAALBgBB2OwBC08CAX4CfwJAAkAgAL0iAUI0iKdB/w9xIgJB/w9GDQBBBCEDIAINAUECQQMgAUL///////////8Ag1AbDwsgAUL/////////B4NQIQMLIAMLBAAgAAuOBAEDfwJAIAJBgARJDQAgACABIAIQEyAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEJgFDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgC3OwBRQ0AQQAoAtzsARCdBSEBCwJAQQAoAtDOAUUNAEEAKALQzgEQnQUgAXIhAQsCQBCzBSgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQmwUhAgsCQCAAKAIUIAAoAhxGDQAgABCdBSABciEBCwJAIAJFDQAgABCcBQsgACgCOCIADQALCxC0BSABDwtBACECAkAgACgCTEEASA0AIAAQmwUhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBEPABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEJwFCyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEJ8FIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACELEFC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBQQ2AVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahAUENgFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBCXBRASC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEKQFDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEJgFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQpQUhAAwBCyADEJsFIQUgACAEIAMQpQUhACAFRQ0AIAMQnAULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEKwFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEK8FIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA7B3IgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDgHiiIAhBACsD+HeiIABBACsD8HeiQQArA+h3oKCgoiAIQQArA+B3oiAAQQArA9h3okEAKwPQd6CgoKIgCEEAKwPId6IgAEEAKwPAd6JBACsDuHegoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQqwUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQrQUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsD+HaiIANCLYinQf8AcUEEdCIBQZD4AGorAwCgIgkgAUGI+ABqKwMAIAIgA0KAgICAgICAeIN9vyABQYiIAWorAwChIAFBkIgBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwOod6JBACsDoHegoiAAQQArA5h3okEAKwOQd6CgoiAEQQArA4h3oiAIQQArA4B3oiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//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IARBIGogASACQgBCgICAgICAgP//ABDpBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEOkFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ6QUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EOkFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDpBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ3wVFDQAgAyAEEM8FIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOkFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ4QUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEN8FQQBKDQACQCABIAkgAyAKEN8FRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEOkFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDpBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ6QUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEg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Qf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBoO8BaiEEAkACQAJAAkBBACgC9OwBIgZBASACdCIDcQ0AQQAgBiADcjYC9OwBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKQ7QFBf2oiAUF/IAEbNgKQ7QELCwcAPwBBEHQLVAECf0EAKALUzgEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ2wVNDQAgABAVRQ0BC0EAIAA2AtTOASABDwsQlQVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEN4FQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDeBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ3gUgBUEwaiAKIAEgBxDoBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEN4FIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEN4FIAUgAiAEQQEgBmsQ6AUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEOYFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEOcFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ3gVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDeBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDqBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDqBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDqBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDqBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDqBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDqBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDqBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDqBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDqBSAFQZABaiADQg+GQgAgBEIAEOoFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ6gUgBUGAAWpCASACfUIAIARCABDqBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEOoFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEOoFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ6AUgBUEwaiAWIBMgBkHwAGoQ3gUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q6gUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDqBSAFIAMgDkIFQgAQ6gUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEN4FIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEN4FIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ3gUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ3gUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ3gVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ3gUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ3gUgBUEgaiACIAQgBhDeBSAFQRBqIBIgASAHEOgFIAUgAiAEIAcQ6AUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEN0FIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDeBSACIAAgBEGB+AAgA2sQ6AUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHg8AUkA0Hg8AFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEQ8ACyUBAX4gACABIAKtIAOtQiCGhCAEEPgFIQUgBUIgiKcQ7gUgBacLEwAgACABpyABQiCIpyACIAMQFgsLhs+BgAADAEGACAuYwgFpbmZpbml0eQAtSW5maW5pdHkAISBFeGNlcHRpb246IE91dE9mTWVtb3J5AGRldnNfdmVyaWZ5AGRldnNfanNvbl9zdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AcHJvZ1ZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAGZyb20AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mAHNlbGYAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBkZXZOYW1lAHByb2dOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgRXhjZXB0aW9uOiBQYW5pY18lZCBhdCAoZ3BjOiVkKQAqICBhdCB1bmtub3duIChncGM6JWQpACogIGF0ICVzX0YlZCAocGM6JWQpACEgIGF0ICVzX0YlZCAocGM6JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQAlcyAoV1NTSykAIXRhcmdldF9pbl9pcnEoKQBmc3RvcjogaW52YWxpZCBsYXJnZSBrZXk6ICclcycAZnN0b3I6IGludmFsaWQga2V5OiAnJXMnAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABADAuMC4wAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAARENGRwqbtMr4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAgACAAIAAgADAAMAAwADAAMAAwADAAMAAwAEAAQABAAEAAQABAAEAGRldk5hbWUAAAAAAAAA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ZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAA6fKAgAAEbmFtZQH5cfsFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkUZGV2c190cmFja19leGNlcHRpb25aD2RldnNkYmdfcHJvY2Vzc1sRZGV2c2RiZ19yZXN0YXJ0ZWRcFWRldnNkYmdfaGFuZGxlX3BhY2tldF0Lc2VuZF92YWx1ZXNeEXZhbHVlX2Zyb21fdGFnX3YwXxlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYA1vYmpfZ2V0X3Byb3BzYQxleHBhbmRfdmFsdWViEmRldnNkYmdfc3VzcGVuZF9jYmMMZGV2c2RiZ19pbml0ZBBleHBhbmRfa2V5X3ZhbHVlZQZrdl9hZGRmD2RldnNtZ3JfcHJvY2Vzc2cHdHJ5X3J1bmgMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUQZGV2c19maWJlcl95aWVsZHYYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EWRldnNfZmliZXJfYnlfdGFnfhBkZXZzX2ZpYmVyX3N0YXJ0fxRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYABDmRldnNfZmliZXJfcnVugQETZGV2c19maWJlcl9zeW5jX25vd4IBCmRldnNfcGFuaWODARVfZGV2c19pbnZhbGlkX3Byb2dyYW2EAQ9kZXZzX2ZpYmVyX3Bva2WFARZkZXZzX2djX29ial9jaGVja19jb3JlhgETamRfZ2NfYW55X3RyeV9hbGxvY4cBB2RldnNfZ2OIAQ9maW5kX2ZyZWVfYmxvY2uJARJkZXZzX2FueV90cnlfYWxsb2OKAQ5kZXZzX3RyeV9hbGxvY4sBC2pkX2djX3VucGlujAEKamRfZ2NfZnJlZY0BFGRldnNfdmFsdWVfaXNfcGlubmVkjgEOZGV2c192YWx1ZV9waW6PARBkZXZzX3ZhbHVlX3VucGlukAESZGV2c19tYXBfdHJ5X2FsbG9jkQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkgEUZGV2c19hcnJheV90cnlfYWxsb2OTARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OUARVkZXZzX3N0cmluZ190cnlfYWxsb2OVARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJYBD2RldnNfZ2Nfc2V0X2N0eJcBDmRldnNfZ2NfY3JlYXRlmAEPZGV2c19nY19kZXN0cm95mQERZGV2c19nY19vYmpfY2hlY2uaAQtzY2FuX2djX29iapsBEXByb3BfQXJyYXlfbGVuZ3RonAESbWV0aDJfQXJyYXlfaW5zZXJ0nQESZnVuMV9BcnJheV9pc0FycmF5ngEQbWV0aFhfQXJyYXlfcHVzaJ8BFW1ldGgxX0FycmF5X3B1c2hSYW5nZaABEW1ldGhYX0FycmF5X3NsaWNloQERZnVuMV9CdWZmZXJfYWxsb2OiARBmdW4xX0J1ZmZlcl9mcm9towEScHJvcF9CdWZmZXJfbGVuZ3RopAEVbWV0aDFfQnVmZmVyX3RvU3RyaW5npQETbWV0aDNfQnVmZmVyX2ZpbGxBdKYBE21ldGg0X0J1ZmZlcl9ibGl0QXSnARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKgBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6kBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKoBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKsBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50rAEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdK0BGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50rgEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKvAR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7ABGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7EBFG1ldGgxX0Vycm9yX19fY3Rvcl9fsgEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7MBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7QBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9ftQEPcHJvcF9FcnJvcl9uYW1ltgERbWV0aDBfRXJyb3JfcHJpbnS3AQ9wcm9wX0RzRmliZXJfaWS4ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkuQEUbWV0aDFfRHNGaWJlcl9yZXN1bWW6ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZbsBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmS8ARFmdW4wX0RzRmliZXJfc2VsZr0BFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0vgEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGW/ARJwcm9wX0Z1bmN0aW9uX25hbWXAAQ9mdW4yX0pTT05fcGFyc2XBARNmdW4zX0pTT05fc3RyaW5naWZ5wgEOZnVuMV9NYXRoX2NlaWzDAQ9mdW4xX01hdGhfZmxvb3LEAQ9mdW4xX01hdGhfcm91bmTFAQ1mdW4xX01hdGhfYWJzxgEQZnVuMF9NYXRoX3JhbmRvbccBE2Z1bjFfTWF0aF9yYW5kb21JbnTIAQ1mdW4xX01hdGhfbG9nyQENZnVuMl9NYXRoX3Bvd8oBDmZ1bjJfTWF0aF9pZGl2ywEOZnVuMl9NYXRoX2ltb2TMAQ5mdW4yX01hdGhfaW11bM0BDWZ1bjJfTWF0aF9taW7OAQtmdW4yX21pbm1heM8BDWZ1bjJfTWF0aF9tYXjQARJmdW4yX09iamVjdF9hc3NpZ27RARBmdW4xX09iamVjdF9rZXlz0gETZnVuMV9rZXlzX29yX3ZhbHVlc9MBEmZ1bjFfT2JqZWN0X3ZhbHVlc9QBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m1QEQcHJvcF9QYWNrZXRfcm9sZdYBHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXLXARNwcm9wX1BhY2tldF9zaG9ydElk2AEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV42QEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmTaARFwcm9wX1BhY2tldF9mbGFnc9sBFXByb3BfUGFja2V0X2lzQ29tbWFuZNwBFHByb3BfUGFja2V0X2lzUmVwb3J03QETcHJvcF9QYWNrZXRfcGF5bG9hZN4BE3Byb3BfUGFja2V0X2lzRXZlbnTfARVwcm9wX1BhY2tldF9ldmVudENvZGXgARRwcm9wX1BhY2tldF9pc1JlZ1NldOEBFHByb3BfUGFja2V0X2lzUmVnR2V04gETcHJvcF9QYWNrZXRfcmVnQ29kZeMBFHByb3BfUGFja2V0X2lzQWN0aW9u5AEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl5QESZGV2c19nZXRfc3BlY19jb2Rl5gETbWV0aDBfUGFja2V0X2RlY29kZecBEmRldnNfcGFja2V0X2RlY29kZegBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZOkBFERzUmVnaXN0ZXJfcmVhZF9jb2506gESZGV2c19wYWNrZXRfZW5jb2Rl6wEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZewBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXtARZwcm9wX0RzUGFja2V0SW5mb19uYW1l7gEWcHJvcF9Ec1BhY2tldEluZm9fY29kZe8BGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX/ABE3Byb3BfRHNSb2xlX2lzQm91bmTxARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTyARFtZXRoMF9Ec1JvbGVfd2FpdPMBEnByb3BfU3RyaW5nX2xlbmd0aPQBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF09QETbWV0aDFfU3RyaW5nX2NoYXJBdPYBEm1ldGgyX1N0cmluZ19zbGljZfcBFGRldnNfamRfZ2V0X3JlZ2lzdGVy+AEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZPkBEGRldnNfamRfc2VuZF9jbWT6ARFkZXZzX2pkX3dha2Vfcm9sZfsBFGRldnNfamRfcmVzZXRfcGFja2V0/AETZGV2c19qZF9wa3RfY2FwdHVyZf0BE2RldnNfamRfc2VuZF9sb2dtc2f+ARJkZXZzX2pkX3Nob3VsZF9ydW7/ARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZYACE2RldnNfamRfcHJvY2Vzc19wa3SBAhRkZXZzX2pkX3JvbGVfY2hhbmdlZIICEmRldnNfamRfaW5pdF9yb2xlc4MCEmRldnNfamRfZnJlZV9yb2xlc4QCFWRldnNfc2V0X2dsb2JhbF9mbGFnc4UCF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzhgIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzhwIQZGV2c19qc29uX2VzY2FwZYgCFWRldnNfanNvbl9lc2NhcGVfY29yZYkCD2RldnNfanNvbl9wYXJzZYoCCmpzb25fdmFsdWWLAgxwYXJzZV9zdHJpbmeMAg1zdHJpbmdpZnlfb2JqjQIKYWRkX2luZGVudI4CD3N0cmluZ2lmeV9maWVsZI8CE2RldnNfanNvbl9zdHJpbmdpZnmQAhFwYXJzZV9zdHJpbmdfY29yZZECEWRldnNfbWFwbGlrZV9pdGVykgIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3STAhJkZXZzX21hcF9jb3B5X2ludG+UAgxkZXZzX21hcF9zZXSVAgZsb29rdXCWAhNkZXZzX21hcGxpa2VfaXNfbWFwlwIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzmAIRZGV2c19hcnJheV9pbnNlcnSZAghrdl9hZGQuMZoCEmRldnNfc2hvcnRfbWFwX3NldJsCD2RldnNfbWFwX2RlbGV0ZZwCEmRldnNfc2hvcnRfbWFwX2dldJ0CF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0ngIOZGV2c19yb2xlX3NwZWOfAhJkZXZzX2Z1bmN0aW9uX2JpbmSgAhFkZXZzX21ha2VfY2xvc3VyZaECDmRldnNfZ2V0X2ZuaWR4ogITZGV2c19nZXRfZm5pZHhfY29yZaMCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZKQCE2RldnNfZ2V0X3JvbGVfcHJvdG+lAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnemAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSnAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+oAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+pAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51baoCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+rAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSsAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmStAhBkZXZzX2luc3RhbmNlX29mrgIPZGV2c19vYmplY3RfZ2V0rwIMZGV2c19zZXFfZ2V0sAIMZGV2c19hbnlfZ2V0sQIMZGV2c19hbnlfc2V0sgIMZGV2c19zZXFfc2V0swIOZGV2c19hcnJheV9zZXS0AhNkZXZzX2FycmF5X3Bpbl9wdXNotQIMZGV2c19hcmdfaW50tgIPZGV2c19hcmdfZG91YmxltwIPZGV2c19yZXRfZG91YmxluAIMZGV2c19yZXRfaW50uQINZGV2c19yZXRfYm9vbLoCD2RldnNfcmV0X2djX3B0crsCEWRldnNfYXJnX3NlbGZfbWFwvAIRZGV2c19zZXR1cF9yZXN1bWW9Ag9kZXZzX2Nhbl9hdHRhY2i+AhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlvwIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlwAISZGV2c19yZWdjYWNoZV9mcmVlwQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbMICF2RldnNfcmVnY2FjaGVfbWFya191c2VkwwITZGV2c19yZWdjYWNoZV9hbGxvY8QCFGRldnNfcmVnY2FjaGVfbG9va3VwxQIRZGV2c19yZWdjYWNoZV9hZ2XGAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZccCEmRldnNfcmVnY2FjaGVfbmV4dMgCD2pkX3NldHRpbmdzX2dldMkCD2pkX3NldHRpbmdzX3NldMoCDmRldnNfbG9nX3ZhbHVlywIPZGV2c19zaG93X3ZhbHVlzAIQZGV2c19zaG93X3ZhbHVlMM0CDWNvbnN1bWVfY2h1bmvOAg1zaGFfMjU2X2Nsb3NlzwIPamRfc2hhMjU2X3NldHVw0AIQamRfc2hhMjU2X3VwZGF0ZdECEGpkX3NoYTI1Nl9maW5pc2jSAhRqZF9zaGEyNTZfaG1hY19zZXR1cNMCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaNQCDmpkX3NoYTI1Nl9oa2Rm1QIOZGV2c19zdHJmb3JtYXTWAg5kZXZzX2lzX3N0cmluZ9cCDmRldnNfaXNfbnVtYmVy2AIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjZAhNkZXZzX2J1aWx0aW5fc3RyaW5n2gIUZGV2c19zdHJpbmdfdnNwcmludGbbAhNkZXZzX3N0cmluZ19zcHJpbnRm3AIVZGV2c19zdHJpbmdfZnJvbV91dGY43QIUZGV2c192YWx1ZV90b19zdHJpbmfeAhBidWZmZXJfdG9fc3RyaW5n3wIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZOACEmRldnNfc3RyaW5nX2NvbmNhdOECEWRldnNfc3RyaW5nX3NsaWNl4gISZGV2c19wdXNoX3RyeWZyYW1l4wIRZGV2c19wb3BfdHJ5ZnJhbWXkAg9kZXZzX2R1bXBfc3RhY2vlAhNkZXZzX2R1bXBfZXhjZXB0aW9u5gIKZGV2c190aHJvd+cCEmRldnNfcHJvY2Vzc190aHJvd+gCEGRldnNfYWxsb2NfZXJyb3LpAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LqAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y6wIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y7AIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LtAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTuAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LvAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcvACFmRldnNfdmFsdWVfZnJvbV9kb3VibGXxAhNkZXZzX3ZhbHVlX2Zyb21faW508gIUZGV2c192YWx1ZV9mcm9tX2Jvb2zzAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcvQCFGRldnNfdmFsdWVfdG9fZG91Ymxl9QIRZGV2c192YWx1ZV90b19pbnT2AhJkZXZzX3ZhbHVlX3RvX2Jvb2z3Ag5kZXZzX2lzX2J1ZmZlcvgCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl+QIQZGV2c19idWZmZXJfZGF0YfoCE2RldnNfYnVmZmVyaXNoX2RhdGH7AhRkZXZzX3ZhbHVlX3RvX2djX29iavwCDWRldnNfaXNfYXJyYXn9AhFkZXZzX3ZhbHVlX3R5cGVvZv4CD2RldnNfaXNfbnVsbGlzaP8CGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSAAxRkZXZzX3ZhbHVlX2FwcHJveF9lcYEDEmRldnNfdmFsdWVfaWVlZV9lcYIDDWRldnNfdmFsdWVfZXGDAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOEAxJkZXZzX2ltZ19zdHJpZHhfb2uFAxJkZXZzX2R1bXBfdmVyc2lvbnOGAwtkZXZzX3ZlcmlmeYcDEWRldnNfZmV0Y2hfb3Bjb2RliAMOZGV2c192bV9yZXN1bWWJAxFkZXZzX3ZtX3NldF9kZWJ1Z4oDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOLAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSMAw9kZXZzX3ZtX3N1c3BlbmSNAxZkZXZzX3ZtX3NldF9icmVha3BvaW50jgMUZGV2c192bV9leGVjX29wY29kZXOPAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeJADEWRldnNfaW1nX2dldF91dGY4kQMUZGV2c19nZXRfc3RhdGljX3V0ZjiSAw9kZXZzX3ZtX3JvbGVfb2uTAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaJQDDGV4cHJfaW52YWxpZJUDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0lgMLc3RtdDFfY2FsbDCXAwtzdG10Ml9jYWxsMZgDC3N0bXQzX2NhbGwymQMLc3RtdDRfY2FsbDOaAwtzdG10NV9jYWxsNJsDC3N0bXQ2X2NhbGw1nAMLc3RtdDdfY2FsbDadAwtzdG10OF9jYWxsN54DC3N0bXQ5X2NhbGw4nwMSc3RtdDJfaW5kZXhfZGVsZXRloAMMc3RtdDFfcmV0dXJuoQMJc3RtdHhfam1wogMMc3RtdHgxX2ptcF96owMKZXhwcjJfYmluZKQDEmV4cHJ4X29iamVjdF9maWVsZKUDEnN0bXR4MV9zdG9yZV9sb2NhbKYDE3N0bXR4MV9zdG9yZV9nbG9iYWynAxJzdG10NF9zdG9yZV9idWZmZXKoAwlleHByMF9pbmapAxBleHByeF9sb2FkX2xvY2FsqgMRZXhwcnhfbG9hZF9nbG9iYWyrAwtleHByMV91cGx1c6wDC2V4cHIyX2luZGV4rQMPc3RtdDNfaW5kZXhfc2V0rgMUZXhwcngxX2J1aWx0aW5fZmllbGSvAxJleHByeDFfYXNjaWlfZmllbGSwAxFleHByeDFfdXRmOF9maWVsZLEDEGV4cHJ4X21hdGhfZmllbGSyAw5leHByeF9kc19maWVsZLMDD3N0bXQwX2FsbG9jX21hcLQDEXN0bXQxX2FsbG9jX2FycmF5tQMSc3RtdDFfYWxsb2NfYnVmZmVytgMRZXhwcnhfc3RhdGljX3JvbGW3AxNleHByeF9zdGF0aWNfYnVmZmVyuAMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nuQMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7oDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7sDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrwDDWV4cHJ4X2xpdGVyYWy9AxFleHByeF9saXRlcmFsX2Y2NL4DEGV4cHJ4X3JvbGVfcHJvdG+/AxFleHByM19sb2FkX2J1ZmZlcsADDWV4cHIwX3JldF92YWzBAwxleHByMV90eXBlb2bCAw9leHByMF91bmRlZmluZWTDAxJleHByMV9pc191bmRlZmluZWTEAwpleHByMF90cnVlxQMLZXhwcjBfZmFsc2XGAw1leHByMV90b19ib29sxwMJZXhwcjBfbmFuyAMJZXhwcjFfYWJzyQMNZXhwcjFfYml0X25vdMoDDGV4cHIxX2lzX25hbssDCWV4cHIxX25lZ8wDCWV4cHIxX25vdM0DDGV4cHIxX3RvX2ludM4DCWV4cHIyX2FkZM8DCWV4cHIyX3N1YtADCWV4cHIyX211bNEDCWV4cHIyX2RpdtIDDWV4cHIyX2JpdF9hbmTTAwxleHByMl9iaXRfb3LUAw1leHByMl9iaXRfeG9y1QMQZXhwcjJfc2hpZnRfbGVmdNYDEWV4cHIyX3NoaWZ0X3JpZ2h01wMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTYAwhleHByMl9lcdkDCGV4cHIyX2xl2gMIZXhwcjJfbHTbAwhleHByMl9uZdwDEGV4cHIxX2lzX251bGxpc2jdAxRzdG10eDJfc3RvcmVfY2xvc3VyZd4DE2V4cHJ4MV9sb2FkX2Nsb3N1cmXfAxJleHByeF9tYWtlX2Nsb3N1cmXgAxBleHByMV90eXBlb2Zfc3Ry4QMTc3RtdHhfam1wX3JldF92YWxfeuIDEHN0bXQyX2NhbGxfYXJyYXnjAwlzdG10eF90cnnkAw1zdG10eF9lbmRfdHJ55QMLc3RtdDBfY2F0Y2jmAw1zdG10MF9maW5hbGx55wMLc3RtdDFfdGhyb3foAw5zdG10MV9yZV90aHJvd+kDEHN0bXR4MV90aHJvd19qbXDqAw5zdG10MF9kZWJ1Z2dlcusDCWV4cHIxX25ld+wDEWV4cHIyX2luc3RhbmNlX29m7QMKZXhwcjBfbnVsbO4DD2V4cHIyX2FwcHJveF9lce8DD2V4cHIyX2FwcHJveF9uZfADE3N0bXQxX3N0b3JlX3JldF92YWzxAw9kZXZzX3ZtX3BvcF9hcmfyAxNkZXZzX3ZtX3BvcF9hcmdfdTMy8wMTZGV2c192bV9wb3BfYXJnX2kzMvQDFmRldnNfdm1fcG9wX2FyZ19idWZmZXL1AxJqZF9hZXNfY2NtX2VuY3J5cHT2AxJqZF9hZXNfY2NtX2RlY3J5cHT3AwxBRVNfaW5pdF9jdHj4Aw9BRVNfRUNCX2VuY3J5cHT5AxBqZF9hZXNfc2V0dXBfa2V5+gMOamRfYWVzX2VuY3J5cHT7AxBqZF9hZXNfY2xlYXJfa2V5/AMLamRfd3Nza19uZXf9AxRqZF93c3NrX3NlbmRfbWVzc2FnZf4DE2pkX3dlYnNvY2tfb25fZXZlbnT/AwdkZWNyeXB0gAQNamRfd3Nza19jbG9zZYEEEGpkX3dzc2tfb25fZXZlbnSCBAtyZXNwX3N0YXR1c4MEEndzc2toZWFsdGhfcHJvY2Vzc4QEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlhQQUd3Nza2hlYWx0aF9yZWNvbm5lY3SGBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSHBA9zZXRfY29ubl9zdHJpbmeIBBFjbGVhcl9jb25uX3N0cmluZ4kED3dzc2toZWFsdGhfaW5pdIoEEXdzc2tfc2VuZF9tZXNzYWdliwQRd3Nza19pc19jb25uZWN0ZWSMBBR3c3NrX3RyYWNrX2V4Y2VwdGlvbo0EEndzc2tfc2VydmljZV9xdWVyeY4EHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWPBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlkAQPcm9sZW1ncl9wcm9jZXNzkQQQcm9sZW1ncl9hdXRvYmluZJIEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJMEFGpkX3JvbGVfbWFuYWdlcl9pbml0lAQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVklQQNamRfcm9sZV9hbGxvY5YEEGpkX3JvbGVfZnJlZV9hbGyXBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kmAQTamRfY2xpZW50X2xvZ19ldmVudJkEE2pkX2NsaWVudF9zdWJzY3JpYmWaBBRqZF9jbGllbnRfZW1pdF9ldmVudJsEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VknAQQamRfZGV2aWNlX2xvb2t1cJ0EGGpkX2RldmljZV9sb29rdXBfc2VydmljZZ4EE2pkX3NlcnZpY2Vfc2VuZF9jbWSfBBFqZF9jbGllbnRfcHJvY2Vzc6AEDmpkX2RldmljZV9mcmVloQQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSiBA9qZF9kZXZpY2VfYWxsb2OjBBBzZXR0aW5nc19wcm9jZXNzpAQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKUEDXNldHRpbmdzX2luaXSmBA9qZF9jdHJsX3Byb2Nlc3OnBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSoBAxqZF9jdHJsX2luaXSpBBRkY2ZnX3NldF91c2VyX2NvbmZpZ6oECWRjZmdfaW5pdKsEDWRjZmdfdmFsaWRhdGWsBA5kY2ZnX2dldF9lbnRyea0EDGRjZmdfZ2V0X2kzMq4EDGRjZmdfZ2V0X3UzMq8ED2RjZmdfZ2V0X3N0cmluZ7AEDGRjZmdfaWR4X2tlebEECWpkX3ZkbWVzZ7IEEWpkX2RtZXNnX3N0YXJ0cHRyswQNamRfZG1lc2dfcmVhZLQEEmpkX2RtZXNnX3JlYWRfbGluZbUEE2pkX3NldHRpbmdzX2dldF9iaW62BA1qZF9mc3Rvcl9pbml0twQTamRfc2V0dGluZ3Nfc2V0X2JpbrgEC2pkX2ZzdG9yX2djuQQPcmVjb21wdXRlX2NhY2hlugQVamRfc2V0dGluZ3NfZ2V0X2xhcmdluwQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZbwEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdlvQQWamRfc2V0dGluZ3Nfc3luY19sYXJnZb4EDWpkX2lwaXBlX29wZW6/BBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0wAQOamRfaXBpcGVfY2xvc2XBBBJqZF9udW1mbXRfaXNfdmFsaWTCBBVqZF9udW1mbXRfd3JpdGVfZmxvYXTDBBNqZF9udW1mbXRfd3JpdGVfaTMyxAQSamRfbnVtZm10X3JlYWRfaTMyxQQUamRfbnVtZm10X3JlYWRfZmxvYXTGBBFqZF9vcGlwZV9vcGVuX2NtZMcEFGpkX29waXBlX29wZW5fcmVwb3J0yAQWamRfb3BpcGVfaGFuZGxlX3BhY2tldMkEEWpkX29waXBlX3dyaXRlX2V4ygQQamRfb3BpcGVfcHJvY2Vzc8sEFGpkX29waXBlX2NoZWNrX3NwYWNlzAQOamRfb3BpcGVfd3JpdGXNBA5qZF9vcGlwZV9jbG9zZc4EDWpkX3F1ZXVlX3B1c2jPBA5qZF9xdWV1ZV9mcm9udNAEDmpkX3F1ZXVlX3NoaWZ00QQOamRfcXVldWVfYWxsb2PSBA1qZF9yZXNwb25kX3U40wQOamRfcmVzcG9uZF91MTbUBA5qZF9yZXNwb25kX3UzMtUEEWpkX3Jlc3BvbmRfc3RyaW5n1gQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTXBAtqZF9zZW5kX3BrdNgEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs2QQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLaBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V02wQUamRfYXBwX2hhbmRsZV9wYWNrZXTcBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTdBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXeBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl3wQQamRfc2VydmljZXNfaW5pdOAEDmpkX3JlZnJlc2hfbm934QQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOIEFGpkX3NlcnZpY2VzX2Fubm91bmNl4wQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXkBBBqZF9zZXJ2aWNlc190aWNr5QQVamRfcHJvY2Vzc19ldmVyeXRoaW5n5gQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXnBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l6AQUYXBwX2dldF9kZXZpY2VfY2xhc3PpBBJhcHBfZ2V0X2Z3X3ZlcnNpb27qBA1qZF9zcnZjZmdfcnVu6wQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXsBBFqZF9zcnZjZmdfdmFyaWFudO0EDWpkX2hhc2hfZm52MWHuBAxqZF9kZXZpY2VfaWTvBAlqZF9yYW5kb23wBAhqZF9jcmMxNvEEDmpkX2NvbXB1dGVfY3Jj8gQOamRfc2hpZnRfZnJhbWXzBAxqZF93b3JkX21vdmX0BA5qZF9yZXNldF9mcmFtZfUEEGpkX3B1c2hfaW5fZnJhbWX2BA1qZF9wYW5pY19jb3Jl9wQTamRfc2hvdWxkX3NhbXBsZV9tc/gEEGpkX3Nob3VsZF9zYW1wbGX5BAlqZF90b19oZXj6BAtqZF9mcm9tX2hlePsEDmpkX2Fzc2VydF9mYWls/AQHamRfYXRvaf0EC2pkX3ZzcHJpbnRm/gQPamRfcHJpbnRfZG91Ymxl/wQKamRfc3ByaW50ZoAFEmpkX2RldmljZV9zaG9ydF9pZIEFDGpkX3NwcmludGZfYYIFC2pkX3RvX2hleF9hgwUJamRfc3RyZHVwhAUJamRfbWVtZHVwhQUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYYFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWHBRFqZF9zZW5kX2V2ZW50X2V4dIgFCmpkX3J4X2luaXSJBRRqZF9yeF9mcmFtZV9yZWNlaXZlZIoFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNriwUPamRfcnhfZ2V0X2ZyYW1ljAUTamRfcnhfcmVsZWFzZV9mcmFtZY0FEWpkX3NlbmRfZnJhbWVfcmF3jgUNamRfc2VuZF9mcmFtZY8FCmpkX3R4X2luaXSQBQdqZF9zZW5kkQUWamRfc2VuZF9mcmFtZV93aXRoX2NyY5IFD2pkX3R4X2dldF9mcmFtZZMFEGpkX3R4X2ZyYW1lX3NlbnSUBQtqZF90eF9mbHVzaJUFEF9fZXJybm9fbG9jYXRpb26WBQxfX2ZwY2xhc3NpZnmXBQVkdW1teZgFCF9fbWVtY3B5mQUHbWVtbW92ZZoFBm1lbXNldJsFCl9fbG9ja2ZpbGWcBQxfX3VubG9ja2ZpbGWdBQZmZmx1c2ieBQRmbW9knwUNX19ET1VCTEVfQklUU6AFDF9fc3RkaW9fc2Vla6EFDV9fc3RkaW9fd3JpdGWiBQ1fX3N0ZGlvX2Nsb3NlowUIX190b3JlYWSkBQlfX3Rvd3JpdGWlBQlfX2Z3cml0ZXimBQZmd3JpdGWnBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja6gFFl9fcHRocmVhZF9tdXRleF91bmxvY2upBQZfX2xvY2uqBQhfX3VubG9ja6sFDl9fbWF0aF9kaXZ6ZXJvrAUKZnBfYmFycmllcq0FDl9fbWF0aF9pbnZhbGlkrgUDbG9nrwUFdG9wMTawBQVsb2cxMLEFB19fbHNlZWuyBQZtZW1jbXCzBQpfX29mbF9sb2NrtAUMX19vZmxfdW5sb2NrtQUMX19tYXRoX3hmbG93tgUMZnBfYmFycmllci4xtwUMX19tYXRoX29mbG93uAUMX19tYXRoX3VmbG93uQUEZmFic7oFA3Bvd7sFBXRvcDEyvAUKemVyb2luZm5hbr0FCGNoZWNraW50vgUMZnBfYmFycmllci4yvwUKbG9nX2lubGluZcAFCmV4cF9pbmxpbmXBBQtzcGVjaWFsY2FzZcIFDWZwX2ZvcmNlX2V2YWzDBQVyb3VuZMQFBnN0cmNocsUFC19fc3RyY2hybnVsxgUGc3RyY21wxwUGc3RybGVuyAUHX191Zmxvd8kFB19fc2hsaW3KBQhfX3NoZ2V0Y8sFB2lzc3BhY2XMBQZzY2FsYm7NBQljb3B5c2lnbmzOBQdzY2FsYm5szwUNX19mcGNsYXNzaWZ5bNAFBWZtb2Rs0QUFZmFic2zSBQtfX2Zsb2F0c2NhbtMFCGhleGZsb2F01AUIZGVjZmxvYXTVBQdzY2FuZXhw1gUGc3RydG941wUGc3RydG9k2AUSX193YXNpX3N5c2NhbGxfcmV02QUIZGxtYWxsb2PaBQZkbGZyZWXbBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXcBQRzYnJr3QUIX19hZGR0ZjPeBQlfX2FzaGx0aTPfBQdfX2xldGYy4AUHX19nZXRmMuEFCF9fZGl2dGYz4gUNX19leHRlbmRkZnRmMuMFDV9fZXh0ZW5kc2Z0ZjLkBQtfX2Zsb2F0c2l0ZuUFDV9fZmxvYXR1bnNpdGbmBQ1fX2ZlX2dldHJvdW5k5wUSX19mZV9yYWlzZV9pbmV4YWN06AUJX19sc2hydGkz6QUIX19tdWx0ZjPqBQhfX211bHRpM+sFCV9fcG93aWRmMuwFCF9fc3VidGYz7QUMX190cnVuY3RmZGYy7gULc2V0VGVtcFJldDDvBQtnZXRUZW1wUmV0MPAFCXN0YWNrU2F2ZfEFDHN0YWNrUmVzdG9yZfIFCnN0YWNrQWxsb2PzBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW509AUVZW1zY3JpcHRlbl9zdGFja19pbml09QUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfYFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2X3BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT4BQxkeW5DYWxsX2ppamn5BRZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp+gUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB+AUEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 26456;
var ___stop_em_js = Module['___stop_em_js'] = 27509;



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
