
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA5mGgIAAlwYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDAYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgIAAwMDBgAAAAEAAgYABgYDAgIDAgIDBAMDAwkFBgIIAAIBAQAAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAQMAAAEBAQEACgACAgABAQEAAQEAAQEAAAEAAAAABQICBQoAAQABAQIEBgEOAgAAAAAACAMJCgICCgIDAAUJAwEFBgMFCQUFBgUBAQEDAwYDAwMFBQUJDAUDAwYGAwMDAwUGBQUFBQUFAQMPEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEAwYCBQUFAQEFBQoBAwICAQAKBQUBBQUBBQYDAwQEAwwRAgIFDwMDAwMGBgMDAwQEBgYGAQMAAwMEAgADAAIGAAQDBgYFAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKDAICAAAHCQkBAwcBAgAIAAIFAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwYCCAYGBgQHBgcDAwYIBgAABB8BAw8DAwAJBwMGBAMEAAQDAwMDBAQGBgAAAAQEBwcHBwQHBwcICAgHBAQDDggDAAQBAAkBAwMBAwUEDCAJCRcDAwQDBwcFBwQECAAEBAcJBwgABwgTBAYGBgQABBghEAYEBAQGCQQEAAAUCwsLEwsQBggHIgsUFAsYExISCyMkJSYLAwMDBAYDAwMDAwQXBAQZDRUnDSgFFikqBQ8EBAAIBA0VGhoNESsCAggIFQ0NGQ0sAAgIAAQIBwgICC0MLgSHgICAAAFwAeoB6gEFhoCAgAABAYACgAIG3YCAgAAOfwFBsPkFC38BQQALfwFBAAt/AUEAC38AQajXAQt/AEGX2AELfwBB4dkBC38AQd3aAQt/AEHZ2wELfwBBqdwBC38AQcrcAQt/AEHP3gELfwBBqNcBC38AQcXfAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAIwGFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgDCBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQCNBhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAMoFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACnBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAKgGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAqQYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAKoGCXN0YWNrU2F2ZQCjBgxzdGFja1Jlc3RvcmUApAYKc3RhY2tBbGxvYwClBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50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KQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEIADIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEJMCIAFBIGokAAsOACAAIABBABDYAhDZAgsPACAAIABBABDYAp0Q2QILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahCoA0UNACABIAEpA2g3AxAgASAAIAFBEGoQ7QI2AgBBmBggARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEIADIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABD7AiECIAEgASkDaDcDMCABIAAgAUEwahDtAjYCJCABIAI2AiBByhggAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEIADIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEPsCIgJFDQAgAiABQSBqENsEIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlgEQnQMgACgCrAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPAAboQmgMgACgCrAEgASkDCDcDICABQRBqJAALoQECAX8BfiMAQTBrIgEkACABIABB2ABqKQMAIgI3AyggASACNwMQAkACQAJAIAAgAUEQakGPARCsA0UNABCaBSECDAELIAEgASkDKDcDCCAAIAFBCGpBmwEQrANFDQEQmQIhAgsgAUEINgIAIAEgAjcDICABIAFBIGo2AgQgAUEYaiAAQdEfIAEQ/gIgACgCrAEgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAENcCIQIgASAAQeAAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahDcASIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABCRAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8QkQMMAQsgAEGxAmogAjoAACAAQbICaiADLwEQOwEAIABBqAJqIAMpAwg3AgAgAy0AFCECIABBsAJqIAQ6AAAgAEGnAmogAjoAACAAQbQCaiADKAIcQQxqIAQQxQUaIAAQkgILIAFBIGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEN0CIgJFDQACQCACKAIEDQAgAiAAQRwQrAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEPwCCyABIAEpAwg3AwAgACACQfYAIAEQggMgACACENwCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDdAiICRQ0AAkAgAigCBA0AIAIgAEEgEKwCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABD8AgsgASABKQMINwMAIAAgAkH2ACABEIIDIAAgAhDcAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ3QIiAkUNAAJAIAIoAgQNACACIABBHhCsAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQ/AILIAEgASkDCDcDACAAIAJB9gAgARCCAyAAIAIQ3AILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEN0CIgJFDQACQCACKAIEDQAgAiAAQSIQrAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQYQBEPwCCyABIAEpAwg3AwAgACACQfYAIAEQggMgACACENwCCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQxQICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEMUCCyADQSBqJAALNAIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQiAMgABBZIAFBEGokAAumAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEI8DQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFB6zRBABCNAwsgAiEBCwJAAkAgASIBRQ0AIAAgASgCHBCbAwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEI8DQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFB6zRBABCNAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhCcAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEI8DQQAhAgwBCwJAIAAgASgCEBB9IgINACABQRhqIABB6zRBABCNAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBtTZBABCNAwwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCPA0EAIQAMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQes0QQAQjQMLIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAqwBIQIgASAAQdgAaikDACIENwMAIAEgBDcDCCAAIAEQqQEhAyAAKAKsASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABB1idBABCNAwwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahDDAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB/SEgA0EIahCQAwwBCyAAIAEgASgCoAEgBEH//wNxELYCIAApAwBCAFINACADQdgAaiABQQggASABQQIQrAIQjwEQnQMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEPwCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahDTAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQtAIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahDDAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQjwMMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGI1gFODQIgAEHQ6wAgAUEDdGovAQAQ/AIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtB0xRBnD5BMUH1LhCnBQAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahCoAw0AIAFBOGogAEGTGxCOAwsgASABKQNINwMgIAFBOGogACABQSBqEIADIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjQEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ+wIiAkUNACABQTBqIAAgAiABKAI4QQEQowIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCOASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQ1wIhAiABIAEpAyA3AwgCQCABQQhqEKgDDQAgAUEYaiAAQf0cEI4DCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEKYCIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCeA5sQ2QILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQngOcENkC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AkUNACACKAIAQYCAgPgAcUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQjwMACyAAQaQCakEAQfwBEMcFGiAAQbICakEDOwEAIAIpAwghAyAAQbACakEEOgAAIABBqAJqIAM3AgAgAEG0AmogAi8BEDsBACAAQbYCaiACLwEWOwEAIAFBCGogACACLwESEJQCIAAoAqwBIAEpAwg3AyAgAUEgaiQAC6EBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahC8AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQjwMLAkACQCACDQAgAEIANwMADAELAkAgASACEL0CIgJBf0oNACAAQgA3AwAMAQsgACABIAIQtwILIANBMGokAAuPAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQvAIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEI8DCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqELwCIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCPAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwECEJsDCyADQTBqJAAL+AECA38BfiMAQTBrIgMkACADIAIpAwAiBjcDGCADIAY3AxACQAJAIAEgA0EQaiADQSxqELwCIgRFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCPAwsCQAJAIAQNACAAQgA3AwAMAQsCQAJAIAQvAQJBgOADcSIFRQ0AIAVBgCBHDQEgACACKQMANwMADAILAkAgASAEEL0CIgJBf0oNACAAQgA3AwAMAgsgACABIAEgASgApAEiBSAFKAJgaiACQQR0aiAELwECQf8fcUGAwAByEOwBELkCDAELIABCADcDAAsgA0EwaiQAC48CAgR/AX4jAEEwayIBJAAgASAAKQNQIgU3AxggASAF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ACADIAMpAyA3AwggA0EoaiABQbUdIANBCGoQkANBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahC8AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUG1HSADQQhqEJADQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQvAIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBtR0gA0EIahCQA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRCbAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQvAIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBtR0gAUEQahCQA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBqB0gAUEIahCQA0EAIQMLAkAgAyIDRQ0AIAAgAxD5ASAAIAEoAiQgAy8BAhCRAgsgAUHAAGokAAtvAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahCPAwwBCyAAIAEoArQBIAIoAgBBDGxqKAIAKAIQQQBHEJwDCyADQRBqJAALYwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQjwMMAQsgACABIAEgAigCABC+AhC4AgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahCPA0H//wEhAgwBCyABKAIoIQIL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QQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEKwCIQQgAyADKQMQNwMAIAAgAiAEIAMQzgIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEJ0EAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQnQQCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQnQQgARCeBCEDIAEQngQhBCACQRBqIAFBARCgBAJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA9h0NwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQnQQgAyADKQMYNwMQAkACQAJAIANBEGoQ+QINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEJ4DEJoDCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQnQQgA0EQaiACEJ0EIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxDSAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQnQQgAkEgaiABEJ0EIAJBGGogARCdBCACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACENMCIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCuAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBABCsAiEEIAMgAykDEDcDACAAIAIgBCADEM4CIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCuAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBFRCsAiEEIAMgAykDEDcDACAAIAIgBCADEM4CIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQrAIQjwEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQnQMgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEJ4EIgMQkQEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQnQMgAyACKQMINwMgIAJBEGokAAtQ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NgIQIAAgBCADKAIAdBCbAwssAQJ/IAJBGGoiAyACEJ8ENgIAIAIgAhCfBCIENgIQIAAgBCADKAIAdRCbAwtBAQJ/IAJBGGoiAyACEJ8ENgIAIAIgAhCfBCIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBCaAw8LIAAgAhCbAwudAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqwMhAgsgACACEJwDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCdBCACQRhqIgQgAykDGDcDACADQRhqIAIQnQQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQngM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJ4DIgY5AwAgAisDICAGZSECDAELIAUoAgAgBCgCAEwhAgsgACACEJwDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCdBCACQRhqIgQgAykDGDcDACADQRhqIAIQnQQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQngM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJ4DIgY5AwAgAisDICAGYyECDAELIAUoAgAgBCgCAEghAgsgACACEJwDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqwNBAXMhAgsgACACEJwDIANBIGokAAs+AQF/IwBBEGsiAyQAIANBCGogAhCdBCADIAMpAwg3AwAgAEHA9ABByPQAIAMQqQMbKQMANwMAIANBEGokAAviAQEF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QQAQjAMMAQsgACADKQMYNwMACyADQSBqJAAPC0HTFEHyPEHNAkH9CxCnBQALQfjYAEHyPEHSAkH9CxCnBQALVgECfyMAQSBrIgMkACADQRhqIAIQnQQgA0EQaiACEJ0EIAMgAykDGDcDCCACIANBCGoQzQIhBCADIAMpAxA3AwAgACACIAMgBBDPAhCcAyADQSBqJAALDQAgAEEAKQPgdDcDAAudAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqgMhAgsgACACEJwDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqgNBAXMhAgsgACACEJwDIANBIGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCdBCABKAKsASACKQMINwMgIAJBEGokAAsuAQF/AkAgAigCTCIDIAIoAqQBLwEOSQ0AIAAgAkGAARCCAQ8LIAAgAiADELcCCz8BAX8CQCABLQBCIgINACAAIAFB7AAQggEPCyABIAJBf2oiAjoAQiAAIAEgAkH/AXFBA3RqQdAAaikDADcDAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQnwMhACABQRBqJAAgAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQnwMhACABQRBqJAAgAAuJAgICfwF+IwBBwABrIgMkAAJAAkAgAS0AQiIEDQAgA0E4aiABQewAEIIBDAELIAEgBEF/aiIEOgBCIAMgASAEQf8BcUEDdGpB0ABqKQMANwM4CyADIAMpAzg3AygCQAJAIAEgA0EoahChAw0AAkAgAkECcUUNACADIAMpAzg3AyAgASADQSBqEPgCDQELIAMgAykDODcDGCADQTBqIAFBEiADQRhqEI8DQgAhBQwBCwJAIAJBAXFFDQAgAyADKQM4NwMQIAEgA0EQahCiAw0AIAMgAykDODcDCCADQTBqIAFB0xwgA0EIahCQA0IAIQUMAQsgAykDOCEFCyAAIAU3AwAgA0HAAGokAAugBAEFfwJAIARB9v8DTw0AIAAQpQRBAEEBOgCg5wFBACABKQAANwCh5wFBACABQQVqIgUpAAA3AKbnAUEAIARBCHQgBEGA/gNxQQh2cjsBrucBQQBBCToAoOcBQaDnARCmBAJAIARFDQBBACEAA0ACQCAEIAAiBmsiAEEQIABBEEkbIgdFDQAgAyAGaiEIQQAhAANAIAAiAEGg5wFqIgkgCS0AACAIIABqLQAAczoAACAAQQFqIgkhACAJIAdHDQALC0Gg5wEQpgQgBkEQaiIJIQAgCSAESQ0ACwsgAkEAKAKg5wE2AABBAEEBOgCg5wFBACABKQAANwCh5wFBACAFKQAANwCm5wFBAEEAOwGu5wFBoOcBEKYEQQAhAANAIAIgACIAaiIJIAktAAAgAEGg5wFqLQAAczoAACAAQQFqIgkhACAJQQRHDQALAkAgBEUNACABQQVqIQVBACEAQQEhCQNAQQBBAToAoOcBQQAgASkAADcAoecBQQAgBSkAADcApucBQQAgCSIGQQh0IAZBgP4DcUEIdnI7Aa7nAUGg5wEQpgQCQCAEIAAiAmsiAEEQIABBEEkbIgdFDQAgAyACaiEIQQAhAANAIAggACIAaiIJIAktAAAgAEGg5wFqLQAAczoAACAAQQFqIgkhACAJIAdHDQALCyACQRBqIgchACAGQQFqIQkgByAESQ0ACwsQpwQPC0HQPkEyQfQOEKIFAAu/BQEGf0F/IQUCQCAEQfX/A0sNACAAEKUEAkACQCAERQ0AIAFBBWohBkEAIQBBASEHA0BBAEEBOgCg5wFBACABKQAANwCh5wFBACAGKQAANwCm5wFBACAHIghBCHQgCEGA/gNxQQh2cjsBrucBQaDnARCmBAJAIAQgACIJayIAQRAgAEEQSRsiBUUNACADIAlqIQpBACEAA0AgCiAAIgBqIgcgBy0AACAAQaDnAWotAABzOgAAIABBAWoiByEAIAcgBUcNAAsLIAlBEGoiBSEAIAhBAWohByAFIARJDQALQQBBAToAoOcBQQAgASkAADcAoecBQQAgAUEFaikAADcApucBQQBBCToAoOcBQQAgBEEIdCAEQYD+A3FBCHZyOwGu5wFBoOcBEKYEIARFDQFBACEAA0ACQCAEIAAiCGsiAEEQIABBEEkbIgVFDQAgAyAIaiEKQQAhAANAIAAiAEGg5wFqIgcgBy0AACAKIABqLQAAczoAACAAQQFqIgchACAHIAVHDQALC0Gg5wEQpgQgCEEQaiIHIQAgByAESQ0ADAILAAtBAEEBOgCg5wFBACABKQAANwCh5wFBACABQQVqKQAANwCm5wFBAEEJOgCg5wFBACAEQQh0IARBgP4DcUEIdnI7Aa7nAUGg5wEQpgQLQQAhAANAIAIgACIAaiIHIActAAAgAEGg5wFqLQAAczoAACAAQQFqIgchACAHQQRHDQALQQBBAToAoOcBQQAgASkAADcAoecBQQAgAUEFaikAADcApucBQQBBADsBrucBQaDnARCmBEEAIQADQCACIAAiAGoiByAHLQAAIABBoOcBai0AAHM6AAAgAEEBaiIHIQAgB0EERw0ACxCnBEEAIQBBACEHA0AgACIFQQFqIgohACAHIAIgBWotAABqIgUhByAFIQUgCkEERw0ACwsgBQvdAwEIf0EAIQIDQCAAIAIiA0ECdCICaiABIAJqLQAAOgAAIAAgAkEBciIEaiABIARqLQAAOgAAIAAgAkECciIEaiABIARqLQAAOgAAIAAgAkEDciICaiABIAJqLQAAOgAAIANBAWoiAyECIANBCEcNAAtBCCECA0AgAiIDQQJ0IgEgAGoiAkF/ai0AACEFIAJBfmotAAAhBiACQX1qLQAAIQcgAkF8ai0AACEIAkACQCADQQdxIgRFDQAgBSEJIAYhBSAHIQYgCCEHDAELIAhBsP4Aai0AACEJIAVBsP4Aai0AACEFIAZBsP4Aai0AACEGIANBA3ZBsIABai0AACAHQbD+AGotAABzIQcLIAchByAGIQYgBSEFIAkhCAJAAkAgBEEERg0AIAghBCAFIQUgBiEGIAchBwwBCyAIQf8BcUGw/gBqLQAAIQQgBUH/AXFBsP4Aai0AACEFIAZB/wFxQbD+AGotAAAhBiAHQf8BcUGw/gBqLQAAIQcLIAIgAkFgai0AACAHczoAACAAIAFBAXJqIAJBYWotAAAgBnM6AAAgACABQQJyaiACQWJqLQAAIAVzOgAAIAAgAUEDcmogAkFjai0AACAEczoAACADQQFqIgEhAiABQTxHDQALC8wFAQl/QQAhAgNAIAIiA0ECdCEEQQAhAgNAIAEgBGogAiICaiIFIAUtAAAgACACIARqai0AAHM6AAAgAkEBaiIFIQIgBUEERw0ACyADQQFqIgQhAiAEQQRHDQALQQEhAgNAIAIhBkEAIQIDQCACIQVBACECA0AgASACIgJBAnRqIAVqIgQgBC0AAEGw/gBqLQAAOgAAIAJBAWoiBCECIARBBEcNAAsgBUEBaiIEIQIgBEEERw0ACyABLQABIQIgASABLQAFOgABIAEtAAkhBCABIAEtAA06AAkgASAEOgAFIAEgAjoADSABLQACIQIgASABLQAKOgACIAEgAjoACiABLQAGIQIgASABLQAOOgAGIAEgAjoADiABLQADIQIgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASACOgAHAkAgBkEORg0AQQAhAgNAIAEgAiIHQQJ0aiICIAItAAMiBCACLQAAIgVzIgNBAXQgA8BBB3ZBG3FzIARzIAQgAi0AAiIDcyIIIAItAAEiCSAFcyIKcyIEczoAAyACIAMgCEEBdCAIwEEHdkEbcXNzIARzOgACIAIgCSADIAlzIgNBAXQgA8BBB3ZBG3FzcyAEczoAASACIAUgCkEBdCAKwEEHdkEbcXNzIARzOgAAIAdBAWoiBCECIARBBEcNAAsgBkEEdCEJQQAhAgNAIAIiCEECdCIFIAlqIQNBACECA0AgASAFaiACIgJqIgQgBC0AACAAIAMgAmpqLQAAczoAACACQQFqIgQhAiAEQQRHDQALIAhBAWoiBCECIARBBEcNAAsgBkEBaiECDAELC0EAIQIDQCACIghBAnQiBUHgAWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACwsLAEGw5wEgABCjBAsLAEGw5wEgABCkBAsPAEGw5wFBAEHwARDHBRoLzQEBBX8jAEEQayIEJABBACEFQQAhBgNAIAUgAyAGIgZqLQAAaiIHIQUgBkEBaiIIIQYgCEEgRw0ACwJAIAcNAEGc3QBBABA8QYk/QTBB8QsQogUAC0EAIAMpAAA3AKDpAUEAIANBGGopAAA3ALjpAUEAIANBEGopAAA3ALDpAUEAIANBCGopAAA3AKjpAUEAQQE6AODpAUHA6QFBEBApIARBwOkBQRAQrwU2AgAgACABIAJB9hUgBBCuBSIFEEMhBiAFECIgBEEQaiQAIAYL1wIBBH8jAEEQayIEJAACQAJAAkAQIw0AAkAgAA0AIAJFDQBBfyEFDAMLAkAgAEEAR0EALQDg6QEiBkECRnFFDQBBfyEFDAMLQX8hBSAARSAGQQNGcQ0CIAMgAWoiBkEEaiIHECEhBQJAIABFDQAgBSAAIAEQxQUaCwJAIAJFDQAgBSABaiACIAMQxQUaC0Gg6QFBwOkBIAUgBmogBSAGEKEEIAUgBxBCIQAgBRAiIAANAUEMIQIDQAJAIAIiAEHA6QFqIgUtAAAiAkH/AUYNACAAQcDpAWogAkEBajoAAEEAIQUMBAsgBUEAOgAAIABBf2ohAkEAIQUgAA0ADAMLAAtBiT9BpwFB8y8QogUACyAEQZEaNgIAQdMYIAQQPAJAQQAtAODpAUH/AUcNACAAIQUMAQtBAEH/AToA4OkBQQNBkRpBCRCtBBBIIAAhBQsgBEEQaiQAIAUL3QYCAn8BfiMAQZABayIDJAACQBAjDQACQAJAAkACQCAAQX5qDgMBAgADCwJAAkACQEEALQDg6QFBf2oOAwABAgULIAMgAjYCQEGj1wAgA0HAAGoQPAJAIAJBF0sNACADQZEhNgIAQdMYIAMQPEEALQDg6QFB/wFGDQVBAEH/AToA4OkBQQNBkSFBCxCtBBBIDAULIANB+ABqQRBqIAFBEGopAAA3AwAgA0H4AGpBCGogAUEIaikAADcDACADIAEpAAAiBTcDeAJAIAWnQcrRkPd8Rg0AIANBtjo2AjBB0xggA0EwahA8QQAtAODpAUH/AUYNBUEAQf8BOgDg6QFBA0G2OkEJEK0EEEgMBQsCQCADKAJ8QQJGDQAgA0HmIjYCIEHTGCADQSBqEDxBAC0A4OkBQf8BRg0FQQBB/wE6AODpAUEDQeYiQQsQrQQQSAwFC0EAQQBBoOkBQSBBwOkBQRAgA0GAAWpBEEGg6QEQ9gJBAEIANwDA6QFBAEIANwDQ6QFBAEIANwDI6QFBAEIANwDY6QFBAEECOgDg6QFBAEEBOgDA6QFBAEECOgDQ6QECQEEAQSBBAEEAEKkERQ0AIANB8iU2AhBB0xggA0EQahA8QQAtAODpAUH/AUYNBUEAQf8BOgDg6QFBA0HyJUEPEK0EEEgMBQtB4iVBABA8DAQLIAMgAjYCcEHC1wAgA0HwAGoQPAJAIAJBI0sNACADQYkONgJQQdMYIANB0ABqEDxBAC0A4OkBQf8BRg0EQQBB/wE6AODpAUEDQYkOQQ4QrQQQSAwECyABIAIQqwQNA0EAIQACQAJAIAEtAAANAEEAIQIDQCACIgRBAWoiAEEgRg0CIAAhAiABIABqLQAARQ0ACyAEQR5LIQALIAAhACADQcHOADYCYEHTGCADQeAAahA8AkBBAC0A4OkBQf8BRg0AQQBB/wE6AODpAUEDQcHOAEEKEK0EEEgLIABFDQQLQQBBAzoA4OkBQQFBAEEAEK0EDAMLIAEgAhCrBA0CQQQgASACQXxqEK0EDAILAkBBAC0A4OkBQf8BRg0AQQBBBDoA4OkBC0ECIAEgAhCtBAwBC0EAQf8BOgDg6QEQSEEDIAEgAhCtBAsgA0GQAWokAA8LQYk/QcABQZIQEKIFAAv+AQEDfyMAQSBrIgIkAAJAAkACQCABQQRLDQAgAkHMJzYCAEHTGCACEDxBzCchAUEALQDg6QFB/wFHDQFBfyEBDAILQaDpAUHQ6QEgACABQXxqIgFqIAAgARCiBCEDQQwhAAJAA0ACQCAAIgFB0OkBaiIALQAAIgRB/wFGDQAgAUHQ6QFqIARBAWo6AAAMAgsgAEEAOgAAIAFBf2ohACABDQALCwJAIAMNAEEAIQEMAgsgAkHbGjYCEEHTGCACQRBqEDxB2xohAUEALQDg6QFB/wFHDQBBfyEBDAELQQBB/wE6AODpAUEDIAFBCRCtBBBIQX8hAQsgAkEgaiQAIAELNAEBfwJAECMNAAJAQQAtAODpASIAQQRGDQAgAEH/AUYNABBICw8LQYk/QdoBQYctEKIFAAv5CAEEfyMAQYACayIDJABBACgC5OkBIQQCQAJAAkACQAJAIABBf2oOBAACAwEECyADIAQoAjg2AhBBjxcgA0EQahA8IARBgAI7ARAgBEEAKALs3wEiAEGAgIAIajYCNCAEIABBgICAEGo2AiggBC8BBkEBRg0DIANB6swANgIEIANBATYCAEHg1wAgAxA8IARBATsBBiAEQQMgBEEGakECELQFDAMLIARBACgC7N8BIgBBgICACGo2AjQgBCAAQYCAgBBqNgIoAkAgAkUNACADIAEtAAAiADoA/wEgAkF/aiEFIAFBAWohBgJAAkACQAJAAkACQAJAAkACQCAAQfB+ag4KAgMMBAUGBwEIAAgLIAEtAANBDGoiBCAFSw0IIAYgBBCxBSIEELoFGiAEECIMCwsgBUUNByABLQABIAFBAmogAkF+ahBXDAoLIAQvARAhAiAEIAEtAAJBCHQgAS0AASIAcjsBEAJAIABBAXFFDQAgBCgCZA0AIARBgAgQ/QQ2AmQLAkAgBC0AEEECcUUNACACQQJxDQAgBBDeBDYCGAsgBEEAKALs3wFBgICACGo2AhQgAyAELwEQNgJgQfsKIANB4ABqEDwMCQsgAyAAOgDQASAELwEGQQFHDQgCQCAAQeUAakH/AXFB/QFLDQAgAyAANgJwQfwJIANB8ABqEDwLIANB0AFqQQFBAEEAEKkEDQggBCgCDCIARQ0IIARBACgC6PIBIABqNgIwDAgLIANB0AFqEGwaQQAoAuTpASIELwEGQQFHDQcCQCADLQD/ASIAQeUAakH/AXFB/QFLDQAgAyAANgKAAUH8CSADQYABahA8CyADQf8BakEBIANB0AFqQSAQqQQNByAEKAIMIgBFDQcgBEEAKALo8gEgAGo2AjAMBwsgACABIAYgBRDGBSgCABBqEK4EDAYLIAAgASAGIAUQxgUgBRBrEK4EDAULQZYBQQBBABBrEK4EDAQLIAMgADYCUEHkCiADQdAAahA8IANB/wE6ANABQQAoAuTpASIELwEGQQFHDQMgA0H/ATYCQEH8CSADQcAAahA8IANB0AFqQQFBAEEAEKkEDQMgBCgCDCIARQ0DIARBACgC6PIBIABqNgIwDAMLIAMgAjYCMEHvOCADQTBqEDwgA0H/AToA0AFBACgC5OkBIgQvAQZBAUcNAiADQf8BNgIgQfwJIANBIGoQPCADQdABakEBQQBBABCpBA0CIAQoAgwiAEUNAiAEQQAoAujyASAAajYCMAwCCyADIAQoAjg2AqABQYI1IANBoAFqEDwgBCAEQRFqLQAAQQh0OwEQIAQvAQZBAkYNASADQefMADYClAEgA0ECNgKQAUHg1wAgA0GQAWoQPCAEQQI7AQYgBEEDIARBBmpBAhC0BQwBCyADIAEgAhChAjYCwAFBgxYgA0HAAWoQPCAELwEGQQJGDQAgA0HnzAA2ArQBIANBAjYCsAFB4NcAIANBsAFqEDwgBEECOwEGIARBAyAEQQZqQQIQtAULIANBgAJqJAAL6wEBAX8jAEEwayICJAACQAJAIAENACACIAA6AC5BACgC5OkBIgEvAQZBAUcNAQJAIABB5QBqQf8BcUH9AUsNACACIABB/wFxNgIAQfwJIAIQPAsgAkEuakEBQQBBABCpBA0BIAEoAgwiAEUNASABQQAoAujyASAAajYCMAwBCyACIAA2AiBB5AkgAkEgahA8IAJB/wE6AC9BACgC5OkBIgAvAQZBAUcNACACQf8BNgIQQfwJIAJBEGoQPCACQS9qQQFBAEEAEKkEDQAgACgCDCIBRQ0AIABBACgC6PIBIAFqNgIwCyACQTBqJAALyQUBB38jAEEQayIBJAACQAJAIAAoAgxFDQBBACgC6PIBIAAoAjBrQQBODQELAkAgAEEUakGAgIAIEKQFRQ0AIAAtABBFDQBBnDVBABA8IAAgAEERai0AAEEIdDsBEAsCQCAALQAQQQJxRQ0AQQAoAqTqASAAKAIcRg0AIAEgACgCGDYCCAJAIAAoAiANACAAQYACECE2AiALIAAoAiBBgAIgAUEIahDfBCECQQAoAqTqASEDIAJFDQAgASgCCCEEIAAoAiAhBSABQZoBOgANQZx/IQYCQEEAKALk6QEiBy8BBkEBRw0AIAFBDWpBASAFIAIQqQQiAiEGIAINAAJAIAcoAgwiAg0AQQAhBgwBCyAHQQAoAujyASACajYCMEEAIQYLIAYNACAAIAEoAgg2AhggAyAERw0AIABBACgCpOoBNgIcCwJAIAAoAmRFDQAgACgCZBD7BCICRQ0AIAIhAgNAIAIhAgJAIAAtABBBAXFFDQAgAi0AAiEDIAFBmQE6AA5BnH8hBgJAQQAoAuTpASIFLwEGQQFHDQAgAUEOakEBIAIgA0EMahCpBCICIQYgAg0AAkAgBSgCDCICDQBBACEGDAELIAVBACgC6PIBIAJqNgIwQQAhBgsgBg0CCyAAKAJkEPwEIAAoAmQQ+wQiBiECIAYNAAsLAkAgAEE0akGAgIACEKQFRQ0AIAFBkgE6AA9BACgC5OkBIgIvAQZBAUcNACABQZIBNgIAQfwJIAEQPCABQQ9qQQFBAEEAEKkEDQAgAigCDCIGRQ0AIAJBACgC6PIBIAZqNgIwCwJAIABBJGpBgIAgEKQFRQ0AQZsEIQICQBCwBEUNACAALwEGQQJ0QcCAAWooAgAhAgsgAhAfCwJAIABBKGpBgIAgEKQFRQ0AIAAQsQQLIABBLGogACgCCBCjBRogAUEQaiQADwtB5xFBABA8EDUACwQAQQELlQIBBH8jAEEwayIBJAAgAEEGaiECAkACQAJAIAAvAQZBfmoOAwIAAQALIAFBqssANgIkIAFBBDYCIEHg1wAgAUEgahA8IABBBDsBBiAAQQMgAkECELQFCxCsBAsCQCAAKAI4RQ0AELAERQ0AIAAoAjghAyAALwFgIQQgASAAKAI8NgIYIAEgBDYCFCABIAM2AhBBphYgAUEQahA8IAAoAjggAC8BYCAAKAI8IABBwABqEKgEDQACQCACLwEAQQNGDQAgAUGtywA2AgQgAUEDNgIAQeDXACABEDwgAEEDOwEGIABBAyACQQIQtAULIABBACgC7N8BIgJBgICACGo2AjQgACACQYCAgBBqNgIoCyABQTBqJAAL/QIBAn8jAEEQayICJAACQAJAAkACQAJAAkACQAJAAkAgAS8BDiIDQf9+ag4GAgMHBwcBAAsgA0GAXWoOBAMFBgQGCyAAIAFBEGogAS0ADEEBELMEDAYLIAAQsQQMBQsCQAJAIAAvAQZBfmoOAwYAAQALIAJBqssANgIEIAJBBDYCAEHg1wAgAhA8IABBBDsBBiAAQQMgAEEGakECELQFCxCsBAwECyABIAAoAjgQgQUaDAMLIAFBwsoAEIEFGgwCCwJAAkAgACgCPCIADQBBACEADAELIABBAEEGIABBoNUAQQYQ3wUbaiEACyABIAAQgQUaDAELIAAgAUHUgAEQhAVBfnFBgAFHDQACQCAAKAIIQecHSw0AIABB6Ac2AggLAkAgACgCCEGBuJkpSQ0AIABBgLiZKTYCCAsgACgCDCIBRQ0AAkAgASAAKAIIQQNsIgNPDQAgACADNgIMCyAAKAIMIgFFDQAgAEEAKALo8gEgAWo2AjALIAJBEGokAAunBAEHfyMAQTBrIgQkAAJAAkAgAg0AQbUoQQAQPCAAKAI4ECIgACgCPBAiIABCADcCOCAAQdAAOwFgIABBwABqQgA3AgAgAEHIAGpCADcCACAAQdAAakIANwIAIABB2ABqQgA3AgACQCADRQ0AQfIZQQAQ6wIaCyAAELEEDAELAkACQCACQQFqECEgASACEMUFIgUQ9AVBxgBJDQAgBUGn1QBBBRDfBQ0AIAVBBWoiBkHAABDxBSEHIAZBOhDxBSEIIAdBOhDxBSEJIAdBLxDxBSEKIAdFDQAgCkUNAAJAIAlFDQAgByAJTw0BIAkgCk8NAQsCQAJAQQAgCCAIIAdLGyIIDQAgBiEGDAELIAZBkM0AQQUQ3wUNASAIQQFqIQYLIAcgBiIGa0HAAEcNACAHQQA6AAAgBEEQaiAGEKYFQSBHDQBB0AAhBgJAIAlFDQAgCUEAOgAAIAlBAWoQqAUiCSEGIAlBgIB8akGCgHxJDQELIApBADoAACAHQQFqELAFIQcgCkEvOgAAIAoQsAUhCSAAELQEIAAgBjsBYCAAIAk2AjwgACAHNgI4IAAgBCkDEDcCQCAAQcgAaiAEKQMYNwIAIABB0ABqIARBIGopAwA3AgAgAEHYAGogBEEoaikDADcCAAJAIANFDQBB8hkgBSABIAIQxQUQ6wIaCyAAELEEDAELIAQgATYCAEHsGCAEEDxBABAiQQAQIgsgBRAiCyAEQTBqJAALSwAgACgCOBAiIAAoAjwQIiAAQgA3AjggAEHQADsBYCAAQcAAakIANwIAIABByABqQgA3AgAgAEHQAGpCADcCACAAQdgAakIANwIAC0MBAn9B4IABEIoFIgBBiCc2AgggAEECOwEGAkBB8hkQ6gIiAUUNACAAIAEgARD0BUEAELMEIAEQIgtBACAANgLk6QELpAEBBH8jAEEQayIEJAAgARD0BSIFQQNqIgYQISIHIAA6AAEgB0GYAToAACAHQQJqIAEgBRDFBRpBnH8hAQJAQQAoAuTpASIALwEGQQFHDQAgBEGYATYCAEH8CSAEEDwgByAGIAIgAxCpBCIFIQEgBQ0AAkAgACgCDCIBDQBBACEBDAELIABBACgC6PIBIAFqNgIwQQAhAQsgBxAiIARBEGokACABCw8AQQAoAuTpAS8BBkEBRguVAgEIfyMAQRBrIgEkAAJAQQAoAuTpASICRQ0AIAJBEWotAABBAXFFDQAgAi8BBkEBRw0AIAEQ3gQ2AggCQCACKAIgDQAgAkGAAhAhNgIgCwNAIAIoAiBBgAIgAUEIahDfBCEDQQAoAqTqASEEQQIhBQJAIANFDQAgASgCCCEGIAIoAiAhByABQZsBOgAPQZx/IQUCQEEAKALk6QEiCC8BBkEBRw0AIAFBmwE2AgBB/AkgARA8IAFBD2pBASAHIAMQqQQiAyEFIAMNAAJAIAgoAgwiBQ0AQQAhBQwBCyAIQQAoAujyASAFajYCMEEAIQULQQIgBCAGRkEBdCAFGyEFCyAFRQ0AC0HJNkEAEDwLIAFBEGokAAtQAQJ/IwBBEGsiASQAQQAhAgJAIAAvAQ5BgSNHDQAgAUEAKALk6QEoAjg2AgAgAEGw3AAgARCuBSICEIEFGiACECJBASECCyABQRBqJAAgAgsNACAAKAIEEPQFQQ1qC2sCA38BfiAAKAIEEPQFQQ1qECEhAQJAIAAoAhAiAkUNACACQQAgAi0ABCIDa0EMbGpBZGopAwAhBCABIAM6AAwgASAENwMACyABIAAoAgg2AgggACgCBCEAIAFBDWogACAAEPQFEMUFGiABC4IDAgZ/AX4CQAJAIAAoAqACIgFFDQAgAEEYaiECIAEhAQNAAkAgAiABIgMoAgQQ9AVBDWoiBBD3BCIBRQ0AIAFBAUYNAiAAQQA2AqACIAIQ+QQaDAILIAMoAgQQ9AVBDWoQISEBAkAgAygCECIFRQ0AIAVBACAFLQAEIgZrQQxsakFkaikDACEHIAEgBjoADCABIAc3AwALIAEgAygCCDYCCCADKAIEIQUgAUENaiAFIAUQ9AUQxQUaIAIgASAEEPgEDQIgARAiIAMoAgAiASEDIAEhBQJAIAFFDQADQAJAIAMiAS0ADEEBcQ0AIAEhBQwCCyABKAIAIgEhAyABIQUgAQ0ACwsgACAFIgE2AqACAkAgAQ0AIAIQ+QQaCyAAKAKgAiIDIQEgAw0ACwsCQCAAQRBqQaDoOxCkBUUNACAAEL0ECwJAIABBFGpB0IYDEKQFRQ0AIAAtAAhFDQAgAEEAOgAIIABBA0EAQQAQtAULDwtBzs8AQdg9QZIBQbIUEKcFAAvuAwEJfyMAQSBrIgEkAAJAAkACQCAALQAGRQ0AIAAtAAkNASAAQQE6AAkCQCAAKAIMIgJFDQAgAiECA0ACQCACIgMoAhANAEH06QEhAgJAA0ACQCACKAIAIgINAEEJIQQMAgtBASEFAkACQCACLQAQQQFLDQBBDCEEDAELA0ACQAJAIAIgBSIGQQxsaiIHQSRqIggoAgAgAygCCEYNAEEBIQVBACEEDAELQQEhBUEAIQQgB0EpaiIJLQAAQQFxDQACQAJAIAMoAhAiBSAIRw0AQQAhBQwBCwJAIAVFDQAgBSAFLQAFQf4BcToABQsgCSAJLQAAQQFyOgAAIAFBG2ogCEEAIAdBKGoiBS0AAGtBDGxqQWRqKQMAEK0FIAMoAgQhBCABIAUtAAA2AgggASAENgIAIAEgAUEbajYCBEGcNyABEDwgAyAINgIQIABBAToACCADEMcEQQAhBQtBDyEECyAEIQQgBUUNASAGQQFqIgQhBSAEIAItABBJDQALQQwhBAsgAiECIAQiBSEEIAVBDEYNAAsLIARBd2oOBwACAgICAgACCyADKAIAIgUhAiAFDQALCyAALQAJRQ0CIABBADoACQsgAUEgaiQADwtB+DVB2D1BzgBB9DEQpwUAC0H5NUHYPUHgAEH0MRCnBQALpAUCBn8BfiMAQcAAayICJAACQCAALQAJDQACQAJAAkACQAJAIAEvAQ5B/35qDgQBAwIAAwsgACgCDCIDRQ0DIAMhAwNAAkAgAyIDKAIQIgRFDQAgBCAELQAFQf4BcToABSACIAMoAgQ2AgBBhBggAhA8IANBADYCECAAQQE6AAggAxDHBAsgAygCACIEIQMgBA0ADAQLAAsgAUEZaiEFIAEtAAxBcGohBiAAQQxqIQQDQCAEKAIAIgNFDQMgAyEEIAMoAgQiByAFIAYQ3wUNAAsCQCABKQMQIghCAFINACADKAIQIgRFDQMgBCAELQAFQf4BcToABSACIAc2AhBBhBggAkEQahA8IANBADYCECAAQQE6AAggAxDHBAwDCwJAAkAgCBDIBCIFDQBBACEEDAELQQAhBCAFLQAQIAEtABgiBk0NACAFIAZBDGxqQSRqIQQLIAQiBEUNAiADKAIQIgUgBEYNAgJAIAVFDQAgBSAFLQAFQf4BcToABQsgBCAELQAFQQFyOgAFIAJBO2ogBEEAIAQtAARrQQxsakFkaikDABCtBSADKAIEIQUgAiAELQAENgIoIAIgBTYCICACIAJBO2o2AiRBnDcgAkEgahA8IAMgBDYCECAAQQE6AAggAxDHBAwCCyAAQRhqIgYgARDyBA0BAkACQCAAKAIMIgMNACADIQUMAQsgAyEEA0ACQCAEIgMtAAxBAXENACADIQUMAgsgAygCACIDIQQgAyEFIAMNAAsLIAAgBSIDNgKgAiADDQEgBhD5BBoMAQsgAEEBOgAHIABBDGohBAJAA0AgBCgCACIDRQ0BIAMhBCADKAIQDQALIABBADoABwsgACABQYSBARCEBRoLIAJBwABqJAAPC0H4NUHYPUG4AUG0EhCnBQALLAEBf0EAQZCBARCKBSIANgLo6QEgAEEBOgAGIABBACgC7N8BQaDoO2o2AhAL1wEBBH8jAEEQayIBJAACQAJAQQAoAujpASICLQAJDQAgAkEBOgAJAkAgAigCDCIDRQ0AIAMhAwNAAkAgAyIEKAIQIgNFDQAgA0EAIAMtAARrQQxsakFcaiAARw0AIAMgAy0ABUH+AXE6AAUgASAEKAIENgIAQYQYIAEQPCAEQQA2AhAgAkEBOgAIIAQQxwQLIAQoAgAiBCEDIAQNAAsLIAItAAlFDQEgAkEAOgAJIAFBEGokAA8LQfg1Qdg9QeEBQbszEKcFAAtB+TVB2D1B5wFBuzMQpwUAC6oCAQZ/AkACQAJAAkACQEEAKALo6QEiAkUNACAAEPQFIQMgAkEMaiIEIQUCQANAIAUoAgAiBkUNASAGIQUgBigCBCAAIAMQ3wUNAAsgBg0CCyACLQAJDQICQCACKAKgAkUNACACQQA2AqACIAJBGGoQ+QQaC0EUECEiByABNgIIIAcgADYCBCAEKAIAIgZFDQMgACAGKAIEEPMFQQBIDQMgBiEFA0ACQCAFIgMoAgAiBg0AIAYhASADIQMMBgsgBiEFIAYhASADIQMgACAGKAIEEPMFQX9KDQAMBQsAC0HYPUH1AUGCOhCiBQALQdg9QfgBQYI6EKIFAAtB+DVB2D1B6wFB8Q0QpwUACyAGIQEgBCEDCyAHIAE2AgAgAyAHNgIAIAJBAToACCAHC9ICAQR/IwBBEGsiACQAAkACQAJAQQAoAujpASIBLQAJDQACQCABKAKgAkUNACABQQA2AqACIAFBGGoQ+QQaCyABLQAJDQEgAUEBOgAJAkAgASgCDCICRQ0AIAIhAgNAAkAgAiICKAIQIgNFDQAgAyADLQAFQf4BcToABSAAIAIoAgQ2AgBBhBggABA8IAJBADYCECABQQE6AAggAhDHBAsgAigCACIDIQIgAw0ACwsgAS0ACUUNAiABQQA6AAkCQCABKAIMIgJFDQAgAiECA0ACQCACIgIoAhAiA0UNACADIAMtAAVB/gFxOgAFCyABIAIoAgA2AgwgAkEANgIEIAIQIiABKAIMIgMhAiADDQALCyABQQE6AAggAEEQaiQADwtB+DVB2D1B6wFB8Q0QpwUAC0H4NUHYPUGyAkHgJBCnBQALQfk1Qdg9QbUCQeAkEKcFAAsMAEEAKALo6QEQvQQL0AEBAn8jAEHAAGsiAyQAAkACQAJAAkACQCAAQX9qDiAAAQIEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAwQLIAMgAUEUajYCEEHWGSADQRBqEDwMAwsgAyABQRRqNgIgQcEZIANBIGoQPAwCCyADIAFBFGo2AjBBuRggA0EwahA8DAELIAEtAAQhACACLwEEIQQgAyACLQAHNgIMIAMgBDYCCCADIAA2AgQgAyABQQAgAGtBDGxqQXBqNgIAQYfFACADEDwLIANBwABqJAALMQECf0EMECEhAkEAKALs6QEhAyACIAE2AgggAiADNgIAIAIgADYCBEEAIAI2AuzpAQuTAQECfwJAAkBBAC0A8OkBRQ0AQQBBADoA8OkBIAAgASACEMQEAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIIAAgASACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBDQFBAEEBOgDw6QEPC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5oBAQN/AkACQEEALQDw6QENAEEAQQE6APDpASAAKAIQIQFBAEEAOgDw6QECQEEAKALs6QEiAkUNACACIQIDQCACIgIoAghBwAAgASAAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0A8OkBDQFBAEEAOgDw6QEPC0HrzwBBsz9B7QBBoDYQpwUAC0HrzwBBsz9B6QBB/Q8QpwUACzABA39B9OkBIQEDQAJAIAEoAgAiAg0AQQAPCyACIQEgAiEDIAIpAwggAFINAAsgAwtZAQR/AkAgAC0AECICDQBBAA8LIABBJGohA0EAIQQDQAJAIAMgBCIEQQxsaigCACABRw0AIAAgBEEMbGpBJGpBACAAGw8LIARBAWoiBSEEIAUgAkcNAAtBAAtiAgJ/AX4gA0EQahAhIgRBAToAAyAAQQAgAC0ABCIFa0EMbGpBZGopAwAhBiAEIAE7AQ4gBCAFOgANIAQgBjcCBCAEIAM6AAwgBEEQaiACIAMQxQUaIAQQgwUhAyAEECIgAwvbAgECfwJAAkACQEEALQDw6QENAEEAQQE6APDpAQJAQfjpAUHgpxIQpAVFDQACQEEAKAL06QEiAEUNACAAIQADQEEAKALs3wEgACIAKAIca0EASA0BQQAgACgCADYC9OkBIAAQzARBACgC9OkBIgEhACABDQALC0EAKAL06QEiAEUNACAAIQADQCAAIgEoAgAiAEUNAQJAQQAoAuzfASAAKAIca0EASA0AIAEgACgCADYCACAAEMwECyABKAIAIgEhACABDQALC0EALQDw6QFFDQFBAEEAOgDw6QECQEEAKALs6QEiAEUNACAAIQADQCAAIgAoAghBMEEAQQAgACgCBBEFACAAKAIAIgEhACABDQALC0EALQDw6QENAkEAQQA6APDpAQ8LQevPAEGzP0GUAkGgFBCnBQALQf3NAEGzP0HjAEH9DxCnBQALQevPAEGzP0HpAEH9DxCnBQALnAIBA38jAEEQayIBJAACQAJAAkBBAC0A8OkBRQ0AQQBBADoA8OkBIAAQwARBAC0A8OkBDQEgASAAQRRqNgIAQQBBADoA8OkBQcEZIAEQPAJAQQAoAuzpASICRQ0AIAIhAgNAIAIiAigCCEECIABBACACKAIEEQUAIAIoAgAiAyECIAMNAAsLQQAtAPDpAQ0CQQBBAToA8OkBAkAgACgCBCICRQ0AIAIhAgNAIAAgAiICKAIAIgM2AgQCQCACLQAHQQVJDQAgAigCDBAiCyACECIgAyECIAMNAAsLIAAQIiABQRBqJAAPC0H9zQBBsz9BsAFBkzAQpwUAC0HrzwBBsz9BsgFBkzAQpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5UOAgp/AX4jAEEQayIBJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAQQAtAPDpAQ0AQQBBAToA8OkBAkAgAC0AAyICQQRxRQ0AQQBBADoA8OkBAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQRJBACAAIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBRQ0IQevPAEGzP0HpAEH9DxCnBQALIAApAgQhC0H06QEhBAJAA0ACQCAEKAIAIgMNAEEAIQUMAgsgAyEEIAMhBSADKQMIIAtSDQALC0EAIQQCQCAFIgNFDQAgAyAALQANQT9xIgRBDGxqQSRqQQAgBCADLQAQSRshBAsgBCEFAkAgAkEBcUUNAEEQIQQgBSECIAMhAwwHCyAALQANDQQgAC8BDg0EIAMhBAJAIAMNACAAEM4EIQQLAkAgBCIDLwESIgUgAC8BECIERg0AAkAgBUEPcSAEQQ9xTQ0AQQMgAyAAEMYEQQAoAvTpASIEIANGDQMgBCEEA0AgBCIFRQ0FIAUoAgAiAiEEIAIgA0cNAAsgBSADKAIANgIADAQLIAMgBDsBEgsgAyEDDAMLQevPAEGzP0G+AkGcEhCnBQALQQAgAygCADYC9OkBCyADEMwEIAAQzgQhAwsgAyIDQQAoAuzfAUGAifoAajYCHCADQSRqIQQgAyEDDAELIAUhBCADIQMLIAMhBgJAAkAgBCIFDQBBECEEQQAhAgwBCwJAAkAgAC0AA0EBcQ0AIAAtAA1BMEsNACAALgEOQX9KDQACQCAAQQ9qLQAAIgMgA0H/AHEiBEF/aiAGLQARIgMgA0H/AUYbQQFqIgNrQf8AcSICRQ0AAkAgAyAEa0H8AHFBPE8NAEETIQMMAwtBEyEDIAJBBUkNAgsgBiAEOgARC0EQIQMLIAMhBwJAAkACQCAALQAMIghBBEkNACAALwEOQQNHDQAgAC8BECIDQYDgA3FBgCBHDQICQAJAIAVBACAFLQAEIglrQQxsakFgaigCACIERQ0AIANB/x9xIQIgBCEDA0ACQCACIAMiAy8BBEcNACADLQAGQT9xIAlHDQAgAyEDDAMLIAMoAgAiBCEDIAQNAAsLQQAhAwsgAyICRQ0CIAIsAAYiA0EASA0CIAIgA0GAAXI6AAZBAC0A8OkBRQ0GQQBBADoA8OkBAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQSEgBSACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBRQ0BQevPAEGzP0HpAEH9DxCnBQALIAAvAQ4iA0GA4ANxQYAgRw0BAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAQJAAkAgAi0AByIDIAhHDQAgAyEEIAJBDGohCSAAQRBqIQoCQAJAIANBBU8NACAJIQkMAQsgCSgCACEJCyAKIAkgBBDfBQ0AQQEhBAwBC0EAIQQLIAQhBAJAIAhBBUkNACADIAhGDQACQCADQQVJDQAgAigCDBAiCyACIAAtAAwQITYCDAsgAiAALQAMIgM6AAcgAkEMaiEJAkACQCADQQVPDQAgCSEJDAELIAkoAgAhCQsgCSAAQRBqIAMQxQUaIAQNAUEALQDw6QFFDQZBAEEAOgDw6QEgBS0ABCEDIAIvAQQhBCABIAItAAc2AgwgASAENgIIIAEgAzYCBCABIAVBACADa0EMbGpBcGo2AgBBh8UAIAEQPAJAQQAoAuzpASIDRQ0AIAMhAwNAIAMiAygCCEEgIAUgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAPDpAQ0HC0EAQQE6APDpAQsgByEEIAUhAgsgBiEDCyADIQYgBCEFQQAtAPDpASEDAkAgAiICRQ0AIANBAXFFDQVBAEEAOgDw6QEgBSACIAAQxAQCQEEAKALs6QEiA0UNACADIQMDQCADIgMoAgggBSACIAAgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQDw6QFFDQFB688AQbM/QekAQf0PEKcFAAsgA0EBcUUNBUEAQQA6APDpAQJAQQAoAuzpASIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAPDpAQ0GC0EAQQA6APDpASABQRBqJAAPC0H9zQBBsz9B4wBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5EEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQISIEIAM6ABAgBCAAKQIEIgk3AwhBACgC7N8BIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQrQUgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKAL06QEiA0UNACAEQQhqIgIpAwAQmgVRDQAgAiADQQhqQQgQ3wVBAEgNAEH06QEhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEJoFUQ0AIAMhBSACIAhBCGpBCBDfBUF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoAvTpATYCAEEAIAQ2AvTpAQsCQAJAQQAtAPDpAUUNACABIAY2AgBBAEEAOgDw6QFB1hkgARA8AkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBQAgAygCACICIQMgAg0ACwtBAC0A8OkBDQFBAEEBOgDw6QEgAUEQaiQAIAQPC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUACwIAC5kCAQV/IwBBIGsiAiQAAkACQCABLwEOIgNBgH9qIgRBBEsNAEEBIAR0QRNxRQ0AIAJBAXIgAUEQaiIFIAEtAAwiBEEPIARBD0kbIgYQxQUhACACQTo6AAAgBiACckEBakEAOgAAIAAQ9AUiBkEOSg0BAkACQAJAIANBgH9qDgUAAgQEAQQLIAZBAWohBCACIAQgBCACQQBBABDhBCIDQQAgA0EAShsiA2oiBRAhIAAgBhDFBSIAaiADEOEEGiABLQANIAEvAQ4gACAFEL0FGiAAECIMAwsgAkEAQQAQ5AQaDAILIAIgBSAGakEBaiAGQX9zIARqIgFBACABQQBKGxDkBBoMAQsgACABQaCBARCEBRoLIAJBIGokAAsKAEGogQEQigUaCwIAC6cBAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkAgAS8BDiIDQYBdag4HAQMFBQMCBAALAkACQAJAIANB/35qDgIBAgALIAMNBhCOBQwHC0H8ABAeDAYLEDUACyABEJMFEIEFGgwECyABEJUFEIEFGgwDCyABEJQFEIAFGgwCCyACEDY3AwhBACABLwEOIAJBCGpBCBC9BRoMAQsgARCCBRoLIAJBEGokAAsKAEG4gQEQigUaCycBAX8Q1gRBAEEANgL86QECQCAAENcEIgENAEEAIAA2AvzpAQsgAQuVAQECfyMAQSBrIgAkAAJAAkBBAC0AoOoBDQBBAEEBOgCg6gEQIw0BAkBB8N0AENcEIgENAEEAQfDdADYCgOoBIABB8N0ALwEMNgIAIABB8N0AKAIINgIEQY8VIAAQPAwBCyAAIAE2AhQgAEHw3QA2AhBBhjggAEEQahA8CyAAQSBqJAAPC0G63ABB/z9BIUG0ERCnBQALqwUBCn8CQCAADQBB0A8PC0HRDyEBAkAgAEEDcQ0AQdIPIQEgACgCAEHEhpm6BEcNAEHTDyEBIAAoAgRBirbS1XxHDQBB1A8hASAAKAIIIgJB//8HSw0AQd4PIQEgAC8BDCIDQRhsQfAAaiIEIAJLDQBB3w8hASAAQdgAaiIFIANBGGxqIgYvARBB//8DRw0AQeAPIQEgBi8BEkH//wNHDQBBACEGQQAhAQNAIAghByAGIQgCQAJAIAAgASIBQQF0akEYai8BACIGIANNDQBBACEGQeEPIQkMAQsCQCABIAUgBkEYbGoiCi8BEEELdk0NAEEAIQZB4g8hCQwBCwJAIAZFDQBBACEGQeMPIQkgASAKQXhqLwEAQQt2TQ0BC0EBIQYgByEJCyAJIQcgCCEJAkAgBkUNACABQR5LIgkhBiAHIQggAUEBaiIKIQEgCSEJIApBIEcNAQsLAkAgCUEBcQ0AIAcPCwJAIAMNAEEADwsgByEJQQAhBgNAIAkhCAJAAkAgBSAGIgZBGGxqIgEQ9AUiCUEPTQ0AQQAhAUHWDyEJDAELIAEgCRCZBSEJAkAgAS8BECIHIAkgCUEQdnNB//8DcUYNAEEAIQFB1w8hCQwBCwJAIAZFDQAgAUF4ai8BACAHTQ0AQQAhAUHYDyEJDAELAkACQCABLwESIgdBAnENAEEAIQFB2Q8hCSAHQQRJDQEMAgsCQCABKAIUIgEgBE8NAEEAIQFB2g8hCQwCCwJAIAEgAkkNAEEAIQFB2w8hCQwCCwJAIAEgB0ECdmoiByACSQ0AQQAhAUHcDyEJDAILQQAhAUHdDyEJIAAgB2otAAANAQtBASEBIAghCQsgCSEJAkAgAUUNACAJIQkgBkEBaiIIIQZBACEBIAggA0YNAgwBCwsgCSEBCyABC/wBAQp/ENYEQQAhAQJAA0AgASECIAQhA0EAIQQCQCAARQ0AQQAhBCACQQJ0QfzpAWooAgAiAUUNAEEAIQQgABD0BSIFQQ9LDQBBACEEIAEgACAFEJkFIgZBEHYgBnMiB0EKdkE+cWpBGGovAQAiBiABLwEMIghPDQAgAUHYAGohCSAGIQQCQANAIAkgBCIKQRhsaiIBLwEQIgQgB0H//wNxIgZLDQECQCAEIAZHDQAgASEEIAEgACAFEN8FRQ0DCyAKQQFqIgEhBCABIAhHDQALC0EAIQQLIAQiBCADIAQbIQEgBA0BIAEhBCACQQFqIQEgAkUNAAtBAA8LIAELUQECfwJAAkAgABDYBCIADQBB/wEhAgwBCyAALwESQQNxIQILIAEhAwJAAkACQCACDgIAAQILIAEgACgCFCIAIABBAEgbDwsgACgCFCEDCyADC1EBAn8CQAJAIAAQ2AQiAA0AQf8BIQIMAQsgAC8BEkEDcSECCyABIQMCQAJAAkAgAg4CAQACCyABIAAoAhQiACAAQQBIGw8LIAAoAhQhAwsgAwvCAwEIfxDWBEEAKAKA6gEhAgJAAkAgAEUNACACRQ0AIAAQ9AUiA0EPSw0AIAIgACADEJkFIgRBEHYgBHMiBEEKdkE+cWpBGGovAQAiBSACLwEMIgZPDQAgAkHYAGohByAEQf//A3EhBCAFIQUDQCAHIAUiCEEYbGoiCS8BECIFIARLDQECQCAFIARHDQAgCSEFIAkgACADEN8FRQ0DCyAIQQFqIgkhBSAJIAZHDQALC0EAIQULIAIhAiAFIgUhBAJAIAUNAEEAKAL86QEhAgJAIABFDQAgAkUNACAAEPQFIgNBD0sNACACIAAgAxCZBSIEQRB2IARzIgRBCnZBPnFqQRhqLwEAIgUgAi8BDCIGTw0AIAJB2ABqIQcgBEH//wNxIQQgBSEFA0AgByAFIglBGGxqIggvARAiBSAESw0BAkAgBSAERw0AIAggACADEN8FDQAgAiECIAghBAwDCyAJQQFqIgkhBSAJIAZHDQALCyACIQJBACEECyACIQICQCAEIgBFDQAgAC0AEkECcUUNAAJAIAFFDQAgASAALwESQQJ2NgIACyACIAAoAhRqDwsCQCABDQBBAA8LIAFBADYCAEEAC7QBAQJ/QQAhAwJAAkAgAEUNAEEAIQMgABD0BSIEQQ5LDQECQCAAQZDqAUYNAEGQ6gEgACAEEMUFGgsgBCEDCyADIQACQCABQeQATQ0AQQAPCyAAQZDqAWogAUGAAXM6AAAgAEEBaiEAAkACQCACDQAgACEADAELQQAhAyACEPQFIgEgAGoiBEEPSw0BIABBkOoBaiACIAEQxQUaIAQhAAsgAEGQ6gFqQQA6AABBkOoBIQMLIAMLowIBA38jAEGwAmsiAiQAIAJBqwIgACABEKsFGgJAAkAgAhD0BSIBDQAgASEADAELIAEhAANAIAAiASEAAkAgAiABQX9qIgFqLQAAQXZqDgQAAgIAAgsgASEAIAENAAtBACEACyACIAAiAWpBCjoAABAkIAFBAWohAyACIQQCQAJAQYAIQQAoAqTqAWsiACABQQJqSQ0AIAMhAyAEIQAMAQtBpOoBQQAoAqTqAWpBBGogAiAAEMUFGkEAQQA2AqTqAUEBIAMgAGsiASABQYF4akH/d0kbIQMgAiAAaiEAC0Gk6gFBBGoiAUEAKAKk6gFqIAAgAyIAEMUFGkEAQQAoAqTqASAAajYCpOoBIAFBACgCpOoBakEAOgAAECUgAkGwAmokAAs5AQJ/ECQCQAJAQQAoAqTqAUEBaiIAQf8HSw0AIAAhAUGk6gEgAGpBBGotAAANAQtBACEBCxAlIAELdgEDfxAkAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQYAIQQAoAqTqASIEIAQgAigCACIFSRsiBCAFRg0AIABBpOoBIAVqQQRqIAQgBWsiBSABIAUgAUkbIgUQxQUaIAIgAigCACAFajYCACAFIQMLECUgAwv4AQEHfxAkAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQQAoAqTqASIEIAIoAgAiBUYNACAAIAFqQX9qIQYgACEBIAUhAwJAA0AgAyEDAkAgASIBIAZJDQAgASEFIAMhBwwCCyABIQUgA0EBaiIIIQdBAyEJAkACQEGk6gEgA2pBBGotAAAiAw4LAQAAAAAAAAAAAAEACyABIAM6AAAgAUEBaiEFQQAgCCAIQYAIRhsiAyEHQQNBACADIARGGyEJCyAFIgUhASAHIgchAyAFIQUgByEHIAlFDQALCyACIAc2AgAgBSIDQQA6AAAgAyAAayEDCxAlIAMLiAEBAX8jAEEQayIDJAACQAJAAkAgAEUNACAAEPQFQQ9LDQAgAC0AAEEqRw0BCyADIAA2AgBB6twAIAMQPEF/IQAMAQsCQCAAEOIEIgANAEF+IQAMAQsCQCAAKAIUIAJLDQAgAUEAKAKo8gEgACgCEGogAhDFBRoLIAAoAhQhAAsgA0EQaiQAIAALygMBBH8jAEEgayIBJAACQAJAQQAoArTyAQ0AQQAQGCICNgKo8gEgAkGAIGohAwJAAkAgAigCAEHGptGSBUcNACACIQQgAigCBEGKjNX5BUYNAQtBACEECyAEIQQCQAJAIAMoAgBBxqbRkgVHDQAgAyEDIAIoAoQgQYqM1fkFRg0BC0EAIQMLIAMhAgJAAkACQCAERQ0AIAJFDQAgBCACIAQoAgggAigCCEsbIQIMAQsgBCACckUNASAEIAIgBBshAgtBACACNgK08gELAkBBACgCtPIBRQ0AEOMECwJAQQAoArTyAQ0AQcALQQAQPEEAQQAoAqjyASICNgK08gEgAhAaIAFCATcDGCABQsam0ZKlwdGa3wA3AxBBACgCtPIBIAFBEGpBEBAZEBsQ4wRBACgCtPIBRQ0CCyABQQAoAqzyAUEAKAKw8gFrQVBqIgJBACACQQBKGzYCAEGoMCABEDwLAkACQEEAKAKw8gEiAkEAKAK08gFBEGoiA0kNACACIQIDQAJAIAIiAiAAEPMFDQAgAiECDAMLIAJBaGoiBCECIAQgA08NAAsLQQAhAgsgAUEgaiQAIAIPC0HvyQBBpj1BxQFBmREQpwUAC4EEAQh/IwBBIGsiACQAQQAoArTyASIBQQAoAqjyASICa0GAIGohAyABQRBqIgQhAQJAAkACQANAIAMhAyABIgUoAhAiAUF/Rg0BIAEgAyABIANJGyIGIQMgBUEYaiIFIQEgBSACIAZqTQ0AC0HfECEDDAELQQAgAiADaiICNgKs8gFBACAFQWhqIgY2ArDyASAFIQECQANAIAEiAyACTw0BIANBAWohASADLQAAQf8BRg0AC0GJKiEDDAELQQBBADYCuPIBIAQgBksNASAEIQMCQANAAkAgAyIHLQAAQSpHDQAgAEEIakEQaiAHQRBqKQIANwMAIABBCGpBCGogB0EIaikCADcDACAAIAcpAgA3AwggByEBAkADQCABQRhqIgMgBksiBQ0BIAMhASADIABBCGoQ8wUNAAsgBUUNAQsgBygCFCIDQf8fakEMdkEBIAMbIgJFDQAgBygCEEEMdkF+aiEEQQAhAwNAIAQgAyIBaiIDQR5PDQMCQEEAKAK48gFBASADdCIFcQ0AIANBA3ZB/P///wFxQbjyAWoiAyADKAIAIAVzNgIACyABQQFqIgEhAyABIAJHDQALCyAHQRhqIgEhAyABIAZNDQAMAwsAC0G+yABBpj1BzwBB3DQQpwUACyAAIAM2AgBBqBkgABA8QQBBADYCtPIBCyAAQSBqJAAL6AMBBH8jAEHAAGsiAyQAAkACQAJAAkAgAEUNACAAEPQFQQ9LDQAgAC0AAEEqRw0BCyADIAA2AgBB6twAIAMQPEF/IQQMAQsCQCACQbkeSQ0AIAMgAjYCEEGGDSADQRBqEDxBfiEEDAELAkAgABDiBCIFRQ0AIAUoAhQgAkcNAEEAIQRBACgCqPIBIAUoAhBqIAEgAhDfBUUNAQsCQEEAKAKs8gFBACgCsPIBa0FQaiIEQQAgBEEAShsgAkEHakF4cUEIIAIbIgRBGGoiBU8NABDlBEEAKAKs8gFBACgCsPIBa0FQaiIGQQAgBkEAShsgBU8NACADIAI2AiBBygwgA0EgahA8QX0hBAwBC0EAQQAoAqzyASAEayIFNgKs8gECQAJAIAFBACACGyIEQQNxRQ0AIAQgAhCxBSEEQQAoAqzyASAEIAIQGSAEECIMAQsgBSAEIAIQGQsgA0EwakIANwMAIANCADcDKCADIAI2AjwgA0EAKAKs8gFBACgCqPIBazYCOCADQShqIAAgABD0BRDFBRpBAEEAKAKw8gFBGGoiADYCsPIBIAAgA0EoakEYEBkQG0EAKAKw8gFBGGpBACgCrPIBSw0BQQAhBAsgA0HAAGokACAEDwtBxA5Bpj1BqQJBmyMQpwUAC6wEAg1/AX4jAEEgayIAJABB8zpBABA8QQAoAqjyASIBIAFBACgCtPIBRkEMdGoiAhAaAkBBACgCtPIBQRBqIgNBACgCsPIBIgFLDQAgASEBIAMhAyACQYAgaiEEIAJBEGohBQNAIAUhBiAEIQcgASEEIABBCGpBEGoiCCADIglBEGoiCikCADcDACAAQQhqQQhqIgsgCUEIaiIMKQIANwMAIAAgCSkCADcDCCAJIQMCQAJAA0AgA0EYaiIBIARLIgUNASABIQMgASAAQQhqEPMFDQALIAUNACAGIQUgByEEDAELIAggCikCADcDACALIAwpAgA3AwAgACAJKQIAIg03AwgCQAJAIA2nQf8BcUEqRw0AIAchAQwBCyAHIAAoAhwiAUEHakF4cUEIIAEbayIDQQAoAqjyASAAKAIYaiABEBkgACADQQAoAqjyAWs2AhggAyEBCyAGIABBCGpBGBAZIAZBGGohBSABIQQLQQAoArDyASIGIQEgCUEYaiIJIQMgBCEEIAUhBSAJIAZNDQALC0EAKAK08gEoAgghAUEAIAI2ArTyASAAQQA2AhQgACABQQFqIgE2AhAgAELGptGSpcHRmt8ANwMIIAIgAEEIakEQEBkQGxDjBAJAQQAoArTyAQ0AQe/JAEGmPUHmAUHAOhCnBQALIAAgATYCBCAAQQAoAqzyAUEAKAKw8gFrQVBqIgFBACABQQBKGzYCAEGAJCAAEDwgAEEgaiQAC4ABAQF/IwBBEGsiAiQAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQ9AVBEEkNAQsgAiAANgIAQcvcACACEDxBACEADAELAkAgABDiBCIADQBBACEADAELAkAgAUUNACABIAAoAhQ2AgALQQAoAqjyASAAKAIQaiEACyACQRBqJAAgAAuOCQELfyMAQTBrIgIkAAJAAkACQAJAAkACQAJAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQ9AVBEEkNAQsgAiAANgIAQcvcACACEDxBACEDDAELAkAgABDiBCIERQ0AIAQtAABBKkcNAiAEKAIUIgNB/x9qQQx2QQEgAxsiBUUNACAEKAIQQQx2QX5qIQZBACEDA0AgBiADIgdqIgNBHk8NBAJAQQAoArjyAUEBIAN0IghxRQ0AIANBA3ZB/P///wFxQbjyAWoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALCyACQSBqQgA3AwAgAkIANwMYIAFB/x9qQQx2QQEgARsiCUF/aiEKQR4gCWshC0EAKAK48gEhBUEAIQcCQANAIAMhDAJAIAciCCALSQ0AQQAhBgwCCwJAAkAgCQ0AIAwhAyAIIQdBASEIDAELIAhBHUsNBkEAQR4gCGsiAyADQR5LGyEGQQAhAwNAAkAgBSADIgMgCGoiB3ZBAXFFDQAgDCEDIAdBAWohB0EBIQgMAgsCQCADIApGDQAgA0EBaiIHIQMgByAGRg0IDAELCyAIQQx0QYDAAGohAyAIIQdBACEICyADIgYhAyAHIQcgBiEGIAgNAAsLIAIgATYCLCACIAYiAzYCKAJAAkAgAw0AIAIgATYCEEGuDCACQRBqEDwCQCAEDQBBACEDDAILIAQtAABBKkcNBgJAIAQoAhQiA0H/H2pBDHZBASADGyIFDQBBACEDDAILIAQoAhBBDHZBfmohBkEAIQMDQCAGIAMiB2oiA0EeTw0IAkBBACgCuPIBQQEgA3QiCHENACADQQN2Qfz///8BcUG48gFqIgMgAygCACAIczYCAAsgB0EBaiIHIQMgByAFRw0AC0EAIQMMAQsgAkEYaiAAIAAQ9AUQxQUaAkBBACgCrPIBQQAoArDyAWtBUGoiA0EAIANBAEobQRdLDQAQ5QRBACgCrPIBQQAoArDyAWtBUGoiA0EAIANBAEobQRdLDQBB4hxBABA8QQAhAwwBC0EAQQAoArDyAUEYajYCsPIBAkAgCUUNAEEAKAKo8gEgAigCKGohCEEAIQMDQCAIIAMiA0EMdGoQGiADQQFqIgchAyAHIAlHDQALC0EAKAKw8gEgAkEYakEYEBkQGyACLQAYQSpHDQcgAigCKCEKAkAgAigCLCIDQf8fakEMdkEBIAMbIgVFDQAgCkEMdkF+aiEGQQAhAwNAIAYgAyIHaiIDQR5PDQoCQEEAKAK48gFBASADdCIIcQ0AIANBA3ZB/P///wFxQbjyAWoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALC0EAKAKo8gEgCmohAwsgAyEDCyACQTBqJAAgAw8LQcPZAEGmPUHlAEG7LxCnBQALQb7IAEGmPUHPAEHcNBCnBQALQb7IAEGmPUHPAEHcNBCnBQALQcPZAEGmPUHlAEG7LxCnBQALQb7IAEGmPUHPAEHcNBCnBQALQcPZAEGmPUHlAEG7LxCnBQALQb7IAEGmPUHPAEHcNBCnBQALDAAgACABIAIQGUEACwYAEBtBAAuXAgEDfwJAECMNAAJAAkACQEEAKAK88gEiAyAARw0AQbzyASEDDAELIAMhAwNAIAMiBEUNAiAEKAIIIgUhAyAFIABHDQALIARBCGohAwsgAyAAKAIINgIACyAAIAI2AgQgACABNgIAIABBADsBDANAEJsFIgFB/wNxIgJFDQBBACgCvPIBIgNFIQUCQAJAIAMNACAFIQUMAQsgAyEEIAUhBSACIAMvAQxBB3ZGDQADQCAEKAIIIgNFIQUCQCADDQAgBSEFDAILIAMhBCAFIQUgAiADLwEMQQd2Rw0ACwsgBUUNAAsgACABQQd0OwEMIABBACgCvPIBNgIIQQAgADYCvPIBIAFB/wNxDwtBysEAQSdB8iMQogUAC4gCAQR/AkAgAC0ADUE+Rw0AIAAtAANBAXFFDQAgACkCBBCaBVINAEEAKAK88gEiAUUNACAALwEOIQIgASEBA0ACQCABIgEvAQwiAyACcyIEQf//A3FB/wBLDQAgBEEfcQ0CIAEgA0EBakEfcSADQeD/A3FyOwEMIAEgACABQQRqIAEgAkHAAHEbKAIAEQIAIAJBIHFFDQIgAUEAIAEoAgQRAgACQAJAAkBBACgCvPIBIgAgAUcNAEG88gEhAAwBCyAAIQADQCAAIgRFDQIgBCgCCCICIQAgAiABRw0ACyAEQQhqIQALIAAgASgCCDYCAAsgAUEAOwEMDwsgASgCCCIEIQEgBA0ACwsLWQEDfwJAAkACQEEAKAK88gEiASAARw0AQbzyASEBDAELIAEhAQNAIAEiAkUNAiACKAIIIgMhASADIABHDQALIAJBCGohAQsgASAAKAIINgIACyAAQQA7AQwLNwEBfwJAIABBDnFBCEcNAEEADwtBACEBAkAgAEEMcUEMRg0AIABBBHZBCCAAQQNxdE0hAQsgAQuTBAIBfwF+IAFBD3EhAwJAAkAgAUEQTw0AIAIhAgwBCyABQRB0QYCAwP8DakGAgMD/B3GtQiCGvyACoiECCyACIQICQAJAAkACQAJAAkAgA0F+ag4KAAEFBQUCBQUDBAULQQAhAQJAIAJEAAAAAAAAAABjDQBBfyEBIAJEAADg////70FkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8EFjIAJEAAAAAAAAAABmcUUNACACqyEBDAELQQAhAQsgASEBCyAAIAE2AAAPC0IAIQQCQCACRAAAAAAAAAAAYw0AIAJEAAAAAAAA8ENkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8ENjIAJEAAAAAAAAAABmcUUNACACsSEEDAELQgAhBAsgBCEECyAAIAQ3AAAPCwJARAAAAAAAAOBDIAJEAAAAAAAA4D+gIAJEAAAAAAAA4ENkIAJEAAAAAAAA4ENjchsiAplEAAAAAAAA4ENjRQ0AIAAgArA3AAAPCyAAQoCAgICAgICAgH83AAAPCyAAIAK2OAAADwsgACACOQAADwtBgICAgHghAQJAIAJEAAAAAAAA4MFjDQBB/////wchASACRAAAwP///99BZA0AAkACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgAqohAQwBC0GAgICAeCEBCyABIQELIAAgAyABEO8EC/gBAAJAIAFBCEkNACAAIAEgArcQ7gQPCwJAAkACQAJAAkACQAJAAkACQCABDggIAAECAwQFBgcLIAAgAkH//wMgAkH//wNIGyIBQQAgAUEAShs7AAAPCyAAIAJBACACQQBKGzYAAA8LIAAgAkEAIAJBAEobrTcAAA8LIAAgAkH/ACACQf8ASBsiAUGAfyABQYB/Shs6AAAPCyAAIAJB//8BIAJB//8BSBsiAUGAgH4gAUGAgH5KGzsAAA8LIAAgAjYAAA8LIAAgAqw3AAAPC0GSPEGuAUHCzQAQogUACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAu7AwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPAEtyEDCyADIQMCQAJAIAFBEE8NACADIQMMAQsgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLIAMiA0QAAAAAAADgwWMNAUH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQZI8QcoBQdbNABCiBQALQYCAgIB4IQELIAELoAECAX8BfAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAo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IAEhASAPIQ9BACENIA5BAEoNAAsLIAUgDToAACABIQogDyEEIAxBCGohAiASQQJqIQEMBwsgBUE/OgAADAELIAUgAToAAAsgESEKIA0hBCAMIQIMAwsgBiANayEQIBEhAUEAIQoCQCAMKAIAIgRB4NgAIAQbIgsQ9AUiAkEATA0AA0AgASALIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCAQQQBMDQAgDSALIAIgEEF/aiAQIAJKGyIKEMUFIApqQQA6AAALIAxBBGohECAFQQA6AAAgDSACaiEEAkAgDkUNACALECILIAEhCiAEIQQgECECDAILIBEhCiANIQQgCyECDAELIBEhCiANIQQgDiECCyAPIQELIAEhDSACIQ4gBiAEIg9rIQsgCiEBQQAhCgJAIAUQ9AUiAkEATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCALQQBMDQAgDyAFIAIgC0F/aiALIAJKGyIKEMUFIApqQQA6AAALIAEhASAPIAJqIQogDiEEIA0hC0EBIQ8gDSECCyABIg4hASAKIg0hCiAEIQQgCyELIAIhAiAPDQALAkAgA0UNACADIA5BAWo2AgALIAVBwABqJAAgDSAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEN0FIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQngaiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQngajIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBCeBqNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahCeBqJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQxwUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QeCBAWopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEMcFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQ9AVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLDwAgACABIAJBACADEKkFCywBAX8jAEEQayIEJAAgBCADNgIMIAAgASACQQAgAxCpBSEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQg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BEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCSBkUNACADIAQQggYhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQnAYgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxCUBiAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQkgZBAEoNAAJAIAEgCSADIAoQkgZFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQnAYgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEJwGIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCcBiAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQnAYgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEJwGIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxCcBiAFQcgAaikD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dAtUAQJ/QQAoAqTXASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABCOBk0NACAAEBVFDQELQQAgADYCpNcBIAEPCxDCBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQkQZBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEJEGQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxCRBiAFQTBqIAogASAHEJsGIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQkQYgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQkQYgBSACIARBASAGaxCbBiAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQmQYOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQmgYaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahCRBkEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJEGIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEJ0GIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEJ0GIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEJ0GIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEJ0GIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEJ0GIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEJ0GIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEJ0GIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEJ0GIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEJ0GIAVBkAFqIANCD4ZCACAEQgAQnQYgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABCdBiAFQYABakIBIAJ9QgAgBEIAEJ0GIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4QnQYgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4QnQYgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxCbBiAFQTBqIBYgEyAGQfAAahCRBiAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxCdBiAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEJ0GIAUgAyAOQgVCABCdBiAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQkQYgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQkQYgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahCRBiACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahCRBiACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahCRBkEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCRBiAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhCRBiAFQSBqIAIgBCAGEJEGIAVBEGogEiABIAcQmwYgBSACIAQgBxCbBiAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQkAYgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEJEGIAIgACAEQYH4ACADaxCbBiACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQbD5BSQDQbD5AUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAAREAALJQEBfiAAIAEgAq0gA61CIIaEIAQQqwYhBSAFQiCIpxChBiAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwve14GAAAMAQYAIC/jNAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBkZWxheQBoZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGRldnNfamRfc2VuZF9yYXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydAByZXN0YXJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3ogPT0gcy0+aW5uZXIuc2l6ZQBzdGF0ZS5vZmYgKyAzIDw9IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAFJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXMgY2FsbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABmaWJlciBub3Qgc3VzcGVuZGVkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW5fb2JqOiVkACogJXMgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkACEgY2FuJ3QgdmFsaWRhdGUgbWZyIGNvbmZpZyBhdCAlcCwgZXJyb3IgJWQAVW5leHBlY3RlZCB0b2tlbiAnJWMnIGluIEpTT04gYXQgcG9zaXRpb24gJWQAZGJnOiBzdXNwZW5kICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvdXRmOC5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBbQnVmZmVyWyV1XSAlKnBdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0leCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlKnAuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBzeiA9PSBsZW4gJiYgc3ogPCBERVZTX01BWF9BU0NJSV9TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/ACVjICAlcyA9PgB3c3NrOgB1dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHIgPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uACEgIC4uLgAsAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBkZXZzX2hhbmRsZV90eXBlKHYpID09IERFVlNfSEFORExFX1RZUEVfR0NfT0JKRUNUICYmIGRldnNfaXNfc3RyaW5nKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBFeGNlcHRpb246IFBhbmljXyVkIGF0IChncGM6JWQpACogIGF0IHVua25vd24gKGdwYzolZCkAKiAgYXQgJXNfRiVkIChwYzolZCkAISAgYXQgJXNfRiVkIChwYzolZCkAISBtaXNzaW5nICVk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c2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AANb8gIAABG5hbWUB5nuuBgANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwSZGV2c19pbWdfcm9sZV9uYW1lfRFkZXZzX2ZpYmVyX2J5X3RhZ34QZGV2c19maWJlcl9zdGFydH8UZGV2c19maWJlcl90ZXJtaWFudGWAAQ5kZXZzX2ZpYmVyX3J1boEBE2RldnNfZmliZXJfc3luY19ub3eCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARBkZXZzX3N0cmluZ19wcmVwlQESZGV2c19zdHJpbmdfZmluaXNolgEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSXAQ9kZXZzX2djX3NldF9jdHiYAQ5kZXZzX2djX2NyZWF0ZZkBD2RldnNfZ2NfZGVzdHJveZoBEWRldnNfZ2Nfb2JqX2NoZWNrmwELc2Nhbl9nY19vYmqcARFwcm9wX0FycmF5X2xlbmd0aJ0BEm1ldGgyX0FycmF5X2luc2VydJ4BEmZ1bjFfQXJyYXlfaXNBcnJheZ8BEG1ldGhYX0FycmF5X3B1c2igARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WhARFtZXRoWF9BcnJheV9zbGljZaIBEG1ldGgxX0FycmF5X2pvaW6jARFmdW4xX0J1ZmZlcl9hbGxvY6QBEGZ1bjFfQnVmZmVyX2Zyb22lARJwcm9wX0J1ZmZlcl9sZW5ndGimARVtZXRoMV9CdWZmZXJfdG9TdHJpbmenARNtZXRoM19CdWZmZXJfZmlsbEF0qAETbWV0aDRfQnVmZmVyX2JsaXRBdKkBFGRldnNfY29tcHV0ZV90aW1lb3V0qgEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCrARdmdW4xX0RldmljZVNjcmlwdF9kZWxheawBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY60BGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdK4BGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnSvARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSwARdmdW4yX0RldmljZVNjcmlwdF9wcmludLEBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSyARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLMBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXBytAEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme1ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO2ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVytwEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmS4ARRtZXRoMV9FcnJvcl9fX2N0b3JfX7kBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+6ARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+7ARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7wBD3Byb3BfRXJyb3JfbmFtZb0BEW1ldGgwX0Vycm9yX3ByaW50vgEPcHJvcF9Ec0ZpYmVyX2lkvwEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZMABFG1ldGgxX0RzRmliZXJfcmVzdW1lwQEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGXCARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kwwERZnVuMF9Ec0ZpYmVyX3NlbGbEARRtZXRoWF9GdW5jdGlvbl9zdGFydMUBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlxgEScHJvcF9GdW5jdGlvbl9uYW1lxwEPZnVuMl9KU09OX3BhcnNlyAETZnVuM19KU09OX3N0cmluZ2lmeckBDmZ1bjFfTWF0aF9jZWlsygEPZnVuMV9NYXRoX2Zsb29yywEPZnVuMV9NYXRoX3JvdW5kzAENZnVuMV9NYXRoX2Fic80BEGZ1bjBfTWF0aF9yYW5kb23OARNmdW4xX01hdGhfcmFuZG9tSW50zwENZnVuMV9NYXRoX2xvZ9ABDWZ1bjJfTWF0aF9wb3fRAQ5mdW4yX01hdGhfaWRpdtIBDmZ1bjJfTWF0aF9pbW9k0wEOZnVuMl9NYXRoX2ltdWzUAQ1mdW4yX01hdGhfbWlu1QELZnVuMl9taW5tYXjWAQ1mdW4yX01hdGhfbWF41wESZnVuMl9PYmplY3RfYXNzaWdu2AEQZnVuMV9PYmplY3Rfa2V5c9kBE2Z1bjFfa2V5c19vcl92YWx1ZXPaARJmdW4xX09iamVjdF92YWx1ZXPbARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtwBHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm933QEScHJvcF9Ec1BhY2tldF9yb2xl3gEecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVy3wEVcHJvcF9Ec1BhY2tldF9zaG9ydElk4AEacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXjhARxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5k4gETcHJvcF9Ec1BhY2tldF9mbGFnc+MBF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5k5AEWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydOUBFXByb3BfRHNQYWNrZXRfcGF5bG9hZOYBFXByb3BfRHNQYWNrZXRfaXNFdmVudOcBF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2Rl6AEWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldOkBFnByb3BfRHNQYWNrZXRfaXNSZWdHZXTqARVwcm9wX0RzUGFja2V0X3JlZ0NvZGXrARZwcm9wX0RzUGFja2V0X2lzQWN0aW9u7AEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl7QEScHJvcF9Ec1BhY2tldF9zcGVj7gERZGV2c19wa3RfZ2V0X3NwZWPvARVtZXRoMF9Ec1BhY2tldF9kZWNvZGXwAR1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZPEBGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudPIBFnByb3BfRHNQYWNrZXRTcGVjX25hbWXzARZwcm9wX0RzUGFja2V0U3BlY19jb2Rl9AEacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2X1ARltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2Rl9gESZGV2c19wYWNrZXRfZGVjb2Rl9wEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk+AEURHNSZWdpc3Rlcl9yZWFkX2NvbnT5ARJkZXZzX3BhY2tldF9lbmNvZGX6ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl+wEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZfwBFnByb3BfRHNQYWNrZXRJbmZvX25hbWX9ARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl/gEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f/wETcHJvcF9Ec1JvbGVfaXNCb3VuZIACEHByb3BfRHNSb2xlX3NwZWOBAhhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmSCAiJwcm9wX0RzU2VydmljZVNwZWNfY2xhc3NJZGVudGlmaWVygwIXcHJvcF9Ec1NlcnZpY2VTcGVjX25hbWWEAhptZXRoMV9Ec1NlcnZpY2VTcGVjX2xvb2t1cIUCGm1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduhgIScHJvcF9TdHJpbmdfbGVuZ3RohwIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXSIAhNtZXRoMV9TdHJpbmdfY2hhckF0iQISbWV0aDJfU3RyaW5nX3NsaWNligIYZnVuWF9TdHJpbmdfZnJvbUNoYXJDb2RliwIMZGV2c19pbnNwZWN0jAILaW5zcGVjdF9vYmqNAgdhZGRfc3RyjgINaW5zcGVjdF9maWVsZI8CFGRldnNfamRfZ2V0X3JlZ2lzdGVykAIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZJECEGRldnNfamRfc2VuZF9jbWSSAhBkZXZzX2pkX3NlbmRfcmF3kwITZGV2c19qZF9zZW5kX2xvZ21zZ5QCE2RldnNfamRfcGt0X2NhcHR1cmWVAhFkZXZzX2pkX3dha2Vfcm9sZZYCEmRldnNfamRfc2hvdWxkX3J1bpcCF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hlmAITZGV2c19qZF9wcm9jZXNzX3BrdJkCGGRldnNfamRfc2VydmVyX2RldmljZV9pZJoCFGRldnNfamRfcm9sZV9jaGFuZ2VkmwIUZGV2c19qZF9yZXNldF9wYWNrZXScAhJkZXZzX2pkX2luaXRfcm9sZXOdAhJkZXZzX2pkX2ZyZWVfcm9sZXOeAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3OfAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc6ACFWRldnNfZ2V0X2dsb2JhbF9mbGFnc6ECEGRldnNfanNvbl9lc2NhcGWiAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWjAg9kZXZzX2pzb25fcGFyc2WkAgpqc29uX3ZhbHVlpQIMcGFyc2Vfc3RyaW5npgITZGV2c19qc29uX3N0cmluZ2lmeacCDXN0cmluZ2lmeV9vYmqoAhFwYXJzZV9zdHJpbmdfY29yZakCCmFkZF9pbmRlbnSqAg9zdHJpbmdpZnlfZmllbGSrAhFkZXZzX21hcGxpa2VfaXRlcqwCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0rQISZGV2c19tYXBfY29weV9pbnRvrgIMZGV2c19tYXBfc2V0rwIGbG9va3VwsAITZGV2c19tYXBsaWtlX2lzX21hcLECG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc7ICEWRldnNfYXJyYXlfaW5zZXJ0swIIa3ZfYWRkLjG0AhJkZXZzX3Nob3J0X21hcF9zZXS1Ag9kZXZzX21hcF9kZWxldGW2AhJkZXZzX3Nob3J0X21hcF9nZXS3AiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkeLgCHGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWO5AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWO6Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHi7AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY7wCF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0vQIXZGV2c19wYWNrZXRfc3BlY19wYXJlbnS+Ag5kZXZzX3JvbGVfc3BlY78CEmRldnNfZ2V0X2Jhc2Vfc3BlY8ACEGRldnNfc3BlY19sb29rdXDBAhJkZXZzX2Z1bmN0aW9uX2JpbmTCAhFkZXZzX21ha2VfY2xvc3VyZcMCDmRldnNfZ2V0X2ZuaWR4xAITZGV2c19nZXRfZm5pZHhfY29yZcUCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZMYCE2RldnNfZ2V0X3JvbGVfcHJvdG/HAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfIAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTJAhVkZXZzX2dldF9zdGF0aWNfcHJvdG/KAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm/LAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bcwCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG/NAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGTOAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmTPAhBkZXZzX2luc3RhbmNlX29m0AIPZGV2c19vYmplY3RfZ2V00QIMZGV2c19zZXFfZ2V00gIMZGV2c19hbnlfZ2V00wIMZGV2c19hbnlfc2V01AIMZGV2c19zZXFfc2V01QIOZGV2c19hcnJheV9zZXTWAhNkZXZzX2FycmF5X3Bpbl9wdXNo1wIMZGV2c19hcmdfaW502AIPZGV2c19hcmdfZG91Ymxl2QIPZGV2c19yZXRfZG91Ymxl2gIMZGV2c19yZXRfaW502wINZGV2c19yZXRfYm9vbNwCD2RldnNfcmV0X2djX3B0ct0CEWRldnNfYXJnX3NlbGZfbWFw3gIRZGV2c19zZXR1cF9yZXN1bWXfAg9kZXZzX2Nhbl9hdHRhY2jgAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVl4QIVZGV2c19tYXBsaWtlX3RvX3ZhbHVl4gISZGV2c19yZWdjYWNoZV9mcmVl4wIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbOQCF2RldnNfcmVnY2FjaGVfbWFya191c2Vk5QITZGV2c19yZWdjYWNoZV9hbGxvY+YCFGRldnNfcmVnY2FjaGVfbG9va3Vw5wIRZGV2c19yZWdjYWNoZV9hZ2XoAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZekCEmRldnNfcmVnY2FjaGVfbmV4dOoCD2pkX3NldHRpbmdzX2dldOsCD2pkX3NldHRpbmdzX3NldOwCDmRldnNfbG9nX3ZhbHVl7QIPZGV2c19zaG93X3ZhbHVl7gIQZGV2c19zaG93X3ZhbHVlMO8CDWNvbnN1bWVfY2h1bmvwAg1zaGFfMjU2X2Nsb3Nl8QIPamRfc2hhMjU2X3NldHVw8gIQamRfc2hhMjU2X3VwZGF0ZfMCEGpkX3NoYTI1Nl9maW5pc2j0AhRqZF9zaGEyNTZfaG1hY19zZXR1cPUCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaPYCDmpkX3NoYTI1Nl9oa2Rm9wIOZGV2c19zdHJmb3JtYXT4Ag5kZXZzX2lzX3N0cmluZ/kCDmRldnNfaXNfbnVtYmVy+gIbZGV2c19zdHJpbmdfZ2V0X3V0Zjhfc3RydWN0+wIUZGV2c19zdHJpbmdfZ2V0X3V0Zjj8AhNkZXZzX2J1aWx0aW5fc3RyaW5n/QIUZGV2c19zdHJpbmdfdnNwcmludGb+AhNkZXZzX3N0cmluZ19zcHJpbnRm/wIVZGV2c19zdHJpbmdfZnJvbV91dGY4gAMUZGV2c192YWx1ZV90b19zdHJpbmeBAxBidWZmZXJfdG9fc3RyaW5nggMZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZIMDEmRldnNfc3RyaW5nX2NvbmNhdIQDEWRldnNfc3RyaW5nX3NsaWNlhQMSZGV2c19wdXNoX3RyeWZyYW1lhgMRZGV2c19wb3BfdHJ5ZnJhbWWHAw9kZXZzX2R1bXBfc3RhY2uIAxNkZXZzX2R1bXBfZXhjZXB0aW9uiQMKZGV2c190aHJvd4oDEmRldnNfcHJvY2Vzc190aHJvd4sDEGRldnNfYWxsb2NfZXJyb3KMAxVkZXZzX3Rocm93X3R5cGVfZXJyb3KNAxZkZXZzX3Rocm93X3JhbmdlX2Vycm9yjgMeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9yjwMaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3KQAx5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHSRAxhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3KSAxdkZXZzX3Rocm93X3N5bnRheF9lcnJvcpMDEWRldnNfc3RyaW5nX2luZGV4lAMSZGV2c19zdHJpbmdfbGVuZ3RolQMZZGV2c191dGY4X2Zyb21fY29kZV9wb2ludJYDG2RldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aJcDFGRldnNfdXRmOF9jb2RlX3BvaW50mAMUZGV2c19zdHJpbmdfam1wX2luaXSZAw5kZXZzX3V0ZjhfaW5pdJoDFmRldnNfdmFsdWVfZnJvbV9kb3VibGWbAxNkZXZzX3ZhbHVlX2Zyb21faW50nAMUZGV2c192YWx1ZV9mcm9tX2Jvb2ydAxdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcp4DFGRldnNfdmFsdWVfdG9fZG91YmxlnwMRZGV2c192YWx1ZV90b19pbnSgAxJkZXZzX3ZhbHVlX3RvX2Jvb2yhAw5kZXZzX2lzX2J1ZmZlcqIDF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxlowMQZGV2c19idWZmZXJfZGF0YaQDE2RldnNfYnVmZmVyaXNoX2RhdGGlAxRkZXZzX3ZhbHVlX3RvX2djX29iaqYDDWRldnNfaXNfYXJyYXmnAxFkZXZzX3ZhbHVlX3R5cGVvZqgDD2RldnNfaXNfbnVsbGlzaKkDGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSqAxRkZXZzX3ZhbHVlX2FwcHJveF9lcasDEmRldnNfdmFsdWVfaWVlZV9lcawDHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbmetAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOuAxJkZXZzX2ltZ19zdHJpZHhfb2uvAxJkZXZzX2R1bXBfdmVyc2lvbnOwAwtkZXZzX3ZlcmlmebEDEWRldnNfZmV0Y2hfb3Bjb2RlsgMOZGV2c192bV9yZXN1bWWzAxFkZXZzX3ZtX3NldF9kZWJ1Z7QDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHO1AxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnS2AwxkZXZzX3ZtX2hhbHS3Aw9kZXZzX3ZtX3N1c3BlbmS4AxZkZXZzX3ZtX3NldF9icmVha3BvaW50uQMUZGV2c192bV9leGVjX29wY29kZXO6AxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeLsDF2RldnNfaW1nX2dldF9zdHJpbmdfam1wvAMRZGV2c19pbWdfZ2V0X3V0Zji9AxRkZXZzX2dldF9zdGF0aWNfdXRmOL4DFGRldnNfdmFsdWVfYnVmZmVyaXNovwMMZXhwcl9pbnZhbGlkwAMUZXhwcnhfYnVpbHRpbl9vYmplY3TBAwtzdG10MV9jYWxsMMIDC3N0bXQyX2NhbGwxwwMLc3RtdDNfY2FsbDLEAwtzdG10NF9jYWxsM8UDC3N0bXQ1X2NhbGw0xgMLc3RtdDZfY2FsbDXHAwtzdG10N19jYWxsNsgDC3N0bXQ4X2NhbGw3yQMLc3RtdDlfY2FsbDjKAxJzdG10Ml9pbmRleF9kZWxldGXLAwxzdG10MV9yZXR1cm7MAwlzdG10eF9qbXDNAwxzdG10eDFfam1wX3rOAwpleHByMl9iaW5kzwMSZXhwcnhfb2JqZWN0X2ZpZWxk0AMSc3RtdHgxX3N0b3JlX2xvY2Fs0QMTc3RtdHgxX3N0b3JlX2dsb2JhbNIDEnN0bXQ0X3N0b3JlX2J1ZmZlctMDCWV4cHIwX2luZtQDEGV4cHJ4X2xvYWRfbG9jYWzVAxFleHByeF9sb2FkX2dsb2JhbNYDC2V4cHIxX3VwbHVz1wMLZXhwcjJfaW5kZXjYAw9zdG10M19pbmRleF9zZXTZAxRleHByeDFfYnVpbHRpbl9maWVsZNoDEmV4cHJ4MV9hc2NpaV9maWVsZNsDEWV4cHJ4MV91dGY4X2ZpZWxk3AMQZXhwcnhfbWF0aF9maWVsZN0DDmV4cHJ4X2RzX2ZpZWxk3gMPc3RtdDBfYWxsb2NfbWFw3wMRc3RtdDFfYWxsb2NfYXJyYXngAxJzdG10MV9hbGxvY19idWZmZXLhAxFleHByeF9zdGF0aWNfcm9sZeIDE2V4cHJ4X3N0YXRpY19idWZmZXLjAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfkAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n5QMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n5gMVZXhwcnhfc3RhdGljX2Z1bmN0aW9u5wMNZXhwcnhfbGl0ZXJhbOgDEWV4cHJ4X2xpdGVyYWxfZjY06QMQZXhwcnhfcm9sZV9wcm90b+oDEWV4cHIzX2xvYWRfYnVmZmVy6wMNZXhwcjBfcmV0X3ZhbOwDDGV4cHIxX3R5cGVvZu0DD2V4cHIwX3VuZGVmaW5lZO4DEmV4cHIxX2lzX3VuZGVmaW5lZO8DCmV4cHIwX3RydWXwAwtleHByMF9mYWxzZfEDDWV4cHIxX3RvX2Jvb2zyAwlleHByMF9uYW7zAwlleHByMV9hYnP0Aw1leHByMV9iaXRfbm909QMMZXhwcjFfaXNfbmFu9gMJZXhwcjFfbmVn9wMJZXhwcjFfbm90+AMMZXhwcjFfdG9faW50+QMJZXhwcjJfYWRk+gMJZXhwcjJfc3Vi+wMJZXhwcjJfbXVs/AMJZXhwcjJfZGl2/QMNZXhwcjJfYml0X2FuZP4DDGV4cHIyX2JpdF9vcv8DDWV4cHIyX2JpdF94b3KABBBleHByMl9zaGlmdF9sZWZ0gQQRZXhwcjJfc2hpZnRfcmlnaHSCBBpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZIMECGV4cHIyX2VxhAQIZXhwcjJfbGWFBAhleHByMl9sdIYECGV4cHIyX25lhwQQZXhwcjFfaXNfbnVsbGlzaIgEFHN0bXR4Ml9zdG9yZV9jbG9zdXJliQQTZXhwcngxX2xvYWRfY2xvc3VyZYoEEmV4cHJ4X21ha2VfY2xvc3VyZYsEEGV4cHIxX3R5cGVvZl9zdHKMBBNzdG10eF9qbXBfcmV0X3ZhbF96jQQQc3RtdDJfY2FsbF9hcnJheY4ECXN0bXR4X3RyeY8EDXN0bXR4X2VuZF90cnmQBAtzdG10MF9jYXRjaJEEDXN0bXQwX2ZpbmFsbHmSBAtzdG10MV90aHJvd5MEDnN0bXQxX3JlX3Rocm93lAQQc3RtdHgxX3Rocm93X2ptcJUEDnN0bXQwX2RlYnVnZ2VylgQJZXhwcjFfbmV3lwQRZXhwcjJfaW5zdGFuY2Vfb2aYBApleHByMF9udWxsmQQPZXhwcjJfYXBwcm94X2VxmgQPZXhwcjJfYXBwcm94X25lmwQTc3RtdDFfc3RvcmVfcmV0X3ZhbJwEEWV4cHJ4X3N0YXRpY19zcGVjnQQPZGV2c192bV9wb3BfYXJnngQTZGV2c192bV9wb3BfYXJnX3UzMp8EE2RldnNfdm1fcG9wX2FyZ19pMzKgBBZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyoQQSamRfYWVzX2NjbV9lbmNyeXB0ogQSamRfYWVzX2NjbV9kZWNyeXB0owQMQUVTX2luaXRfY3R4pAQPQUVTX0VDQl9lbmNyeXB0pQQQamRfYWVzX3NldHVwX2tleaYEDmpkX2Flc19lbmNyeXB0pwQQamRfYWVzX2NsZWFyX2tleagEC2pkX3dzc2tfbmV3qQQUamRfd3Nza19zZW5kX21lc3NhZ2WqBBNqZF93ZWJzb2NrX29uX2V2ZW50qwQHZGVjcnlwdKwEDWpkX3dzc2tfY2xvc2WtBBBqZF93c3NrX29uX2V2ZW50rgQLcmVzcF9zdGF0dXOvBBJ3c3NraGVhbHRoX3Byb2Nlc3OwBBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZbEEFHdzc2toZWFsdGhfcmVjb25uZWN0sgQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0swQPc2V0X2Nvbm5fc3RyaW5ntAQRY2xlYXJfY29ubl9zdHJpbme1BA93c3NraGVhbHRoX2luaXS2BBF3c3NrX3NlbmRfbWVzc2FnZbcEEXdzc2tfaXNfY29ubmVjdGVkuAQUd3Nza190cmFja19leGNlcHRpb265BBJ3c3NrX3NlcnZpY2VfcXVlcnm6BBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpluwQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZbwED3JvbGVtZ3JfcHJvY2Vzc70EEHJvbGVtZ3JfYXV0b2JpbmS+BBVyb2xlbWdyX2hhbmRsZV9wYWNrZXS/BBRqZF9yb2xlX21hbmFnZXJfaW5pdMAEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZMEEDWpkX3JvbGVfYWxsb2PCBBBqZF9yb2xlX2ZyZWVfYWxswwQWamRfcm9sZV9mb3JjZV9hdXRvYmluZMQEE2pkX2NsaWVudF9sb2dfZXZlbnTFBBNqZF9jbGllbnRfc3Vic2NyaWJlxgQUamRfY2xpZW50X2VtaXRfZXZlbnTHBBRyb2xlbWdyX3JvbGVfY2hhbmdlZMgEEGpkX2RldmljZV9sb29rdXDJBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XKBBNqZF9zZXJ2aWNlX3NlbmRfY21kywQRamRfY2xpZW50X3Byb2Nlc3PMBA5qZF9kZXZpY2VfZnJlZc0EF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0zgQPamRfZGV2aWNlX2FsbG9jzwQQc2V0dGluZ3NfcHJvY2Vzc9AEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXTRBA1zZXR0aW5nc19pbml00gQPamRfY3RybF9wcm9jZXNz0wQVamRfY3RybF9oYW5kbGVfcGFja2V01AQMamRfY3RybF9pbml01QQUZGNmZ19zZXRfdXNlcl9jb25maWfWBAlkY2ZnX2luaXTXBA1kY2ZnX3ZhbGlkYXRl2AQOZGNmZ19nZXRfZW50cnnZBAxkY2ZnX2dldF9pMzLaBAxkY2ZnX2dldF91MzLbBA9kY2ZnX2dldF9zdHJpbmfcBAxkY2ZnX2lkeF9rZXndBAlqZF92ZG1lc2feBBFqZF9kbWVzZ19zdGFydHB0ct8EDWpkX2RtZXNnX3JlYWTgBBJqZF9kbWVzZ19yZWFkX2xpbmXhBBNqZF9zZXR0aW5nc19nZXRfYmlu4gQKZmluZF9lbnRyeeMED3JlY29tcHV0ZV9jYWNoZeQEE2pkX3NldHRpbmdzX3NldF9iaW7lBAtqZF9mc3Rvcl9nY+YEFWpkX3NldHRpbmdzX2dldF9sYXJnZecEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2XoBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZekEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XqBA1qZF9pcGlwZV9vcGVu6wQWamRfaXBpcGVfaGFuZGxlX3BhY2tldOwEDmpkX2lwaXBlX2Nsb3Nl7QQSamRfbnVtZm10X2lzX3ZhbGlk7gQVamRfbnVtZm10X3dyaXRlX2Zsb2F07wQTamRfbnVtZm10X3dyaXRlX2kzMvAEEmpkX251bWZtdF9yZWFkX2kzMvEEFGpkX251bWZtdF9yZWFkX2Zsb2F08gQRamRfb3BpcGVfb3Blbl9jbWTzBBRqZF9vcGlwZV9vcGVuX3JlcG9ydPQEFmpkX29waXBlX2hhbmRsZV9wYWNrZXT1BBFqZF9vcGlwZV93cml0ZV9lePYEEGpkX29waXBlX3Byb2Nlc3P3BBRqZF9vcGlwZV9jaGVja19zcGFjZfgEDmpkX29waXBlX3dyaXRl+QQOamRfb3BpcGVfY2xvc2X6BA1qZF9xdWV1ZV9wdXNo+wQOamRfcXVldWVfZnJvbnT8BA5qZF9xdWV1ZV9zaGlmdP0EDmpkX3F1ZXVlX2FsbG9j/gQNamRfcmVzcG9uZF91OP8EDmpkX3Jlc3BvbmRfdTE2gAUOamRfcmVzcG9uZF91MzKBBRFqZF9yZXNwb25kX3N0cmluZ4IFF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkgwULamRfc2VuZF9wa3SEBR1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbIUFF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyhgUZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldIcFFGpkX2FwcF9oYW5kbGVfcGFja2V0iAUVamRfYXBwX2hhbmRsZV9jb21tYW5kiQUVYXBwX2dldF9pbnN0YW5jZV9uYW1ligUTamRfYWxsb2NhdGVfc2VydmljZYsFEGpkX3NlcnZpY2VzX2luaXSMBQ5qZF9yZWZyZXNoX25vd40FGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSOBRRqZF9zZXJ2aWNlc19hbm5vdW5jZY8FF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1lkAUQamRfc2VydmljZXNfdGlja5EFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ5IFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlkwUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZZQFFGFwcF9nZXRfZGV2aWNlX2NsYXNzlQUSYXBwX2dldF9md192ZXJzaW9ulgUNamRfc3J2Y2ZnX3J1bpcFF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1lmAURamRfc3J2Y2ZnX3ZhcmlhbnSZBQ1qZF9oYXNoX2ZudjFhmgUMamRfZGV2aWNlX2lkmwUJamRfcmFuZG9tnAUIamRfY3JjMTadBQ5qZF9jb21wdXRlX2NyY54FDmpkX3NoaWZ0X2ZyYW1lnwUMamRfd29yZF9tb3ZloAUOamRfcmVzZXRfZnJhbWWhBRBqZF9wdXNoX2luX2ZyYW1logUNamRfcGFuaWNfY29yZaMFE2pkX3Nob3VsZF9zYW1wbGVfbXOkBRBqZF9zaG91bGRfc2FtcGxlpQUJamRfdG9faGV4pgULamRfZnJvbV9oZXinBQ5qZF9hc3NlcnRfZmFpbKgFB2pkX2F0b2mpBQ9qZF92c3ByaW50Zl9leHSqBQ9qZF9wcmludF9kb3VibGWrBQtqZF92c3ByaW50ZqwFCmpkX3NwcmludGatBRJqZF9kZXZpY2Vfc2hvcnRfaWSuBQxqZF9zcHJpbnRmX2GvBQtqZF90b19oZXhfYbAFCWpkX3N0cmR1cLEFCWpkX21lbWR1cLIFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWzBRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVltAURamRfc2VuZF9ldmVudF9leHS1BQpqZF9yeF9pbml0tgUUamRfcnhfZnJhbWVfcmVjZWl2ZWS3BR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja7gFD2pkX3J4X2dldF9mcmFtZbkFE2pkX3J4X3JlbGVhc2VfZnJhbWW6BRFqZF9zZW5kX2ZyYW1lX3Jhd7sFDWpkX3NlbmRfZnJhbWW8BQpqZF90eF9pbml0vQUHamRfc2VuZL4FFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmO/BQ9qZF90eF9nZXRfZnJhbWXABRBqZF90eF9mcmFtZV9zZW50wQULamRfdHhfZmx1c2jCBRBfX2Vycm5vX2xvY2F0aW9uwwUMX19mcGNsYXNzaWZ5xAUFZHVtbXnFBQhfX21lbWNwecYFB21lbW1vdmXHBQZtZW1zZXTIBQpfX2xvY2tmaWxlyQUMX191bmxvY2tmaWxlygUGZmZsdXNoywUEZm1vZMwFDV9fRE9VQkxFX0JJVFPNBQxfX3N0ZGlvX3NlZWvOBQ1fX3N0ZGlvX3dyaXRlzwUNX19zdGRpb19jbG9zZdAFCF9fdG9yZWFk0QUJX190b3dyaXRl0gUJX19md3JpdGV40wUGZndyaXRl1AUUX19wdGhyZWFkX211dGV4X2xvY2vVBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr1gUGX19sb2Nr1wUIX191bmxvY2vYBQ5fX21hdGhfZGl2emVyb9kFCmZwX2JhcnJpZXLaBQ5fX21hdGhfaW52YWxpZNsFA2xvZ9wFBXRvcDE23QUFbG9nMTDeBQdfX2xzZWVr3wUGbWVtY21w4AUKX19vZmxfbG9ja+EFDF9fb2ZsX3VubG9ja+IFDF9fbWF0aF94Zmxvd+MFDGZwX2JhcnJpZXIuMeQFDF9fbWF0aF9vZmxvd+UFDF9fbWF0aF91Zmxvd+YFBGZhYnPnBQNwb3foBQV0b3AxMukFCnplcm9pbmZuYW7qBQhjaGVja2ludOsFDGZwX2JhcnJpZXIuMuwFCmxvZ19pbmxpbmXtBQpleHBfaW5saW5l7gULc3BlY2lhbGNhc2XvBQ1mcF9mb3JjZV9ldmFs8AUFcm91bmTxBQZzdHJjaHLyBQtfX3N0cmNocm51bPMFBnN0cmNtcPQFBnN0cmxlbvUFBm1lbWNocvYFBnN0cnN0cvcFDnR3b2J5dGVfc3Ryc3Ry+AUQdGhyZWVieXRlX3N0cnN0cvkFD2ZvdXJieXRlX3N0cnN0cvoFDXR3b3dheV9zdHJzdHL7BQdfX3VmbG93/AUHX19zaGxpbf0FCF9fc2hnZXRj/gUHaXNzcGFjZf8FBnNjYWxiboAGCWNvcHlzaWdubIEGB3NjYWxibmyCBg1fX2ZwY2xhc3NpZnlsgwYFZm1vZGyEBgVmYWJzbIUGC19fZmxvYXRzY2FuhgYIaGV4ZmxvYXSHBghkZWNmbG9hdIgGB3NjYW5leHCJBgZzdHJ0b3iKBgZzdHJ0b2SLBhJfX3dhc2lfc3lzY2FsbF9yZXSMBghkbG1hbGxvY40GBmRsZnJlZY4GGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZY8GBHNicmuQBghfX2FkZHRmM5EGCV9fYXNobHRpM5IGB19fbGV0ZjKTBgdfX2dldGYylAYIX19kaXZ0ZjOVBg1fX2V4dGVuZGRmdGYylgYNX19leHRlbmRzZnRmMpcGC19fZmxvYXRzaXRmmAYNX19mbG9hdHVuc2l0ZpkGDV9fZmVfZ2V0cm91bmSaBhJfX2ZlX3JhaXNlX2luZXhhY3SbBglfX2xzaHJ0aTOcBghfX211bHRmM50GCF9fbXVsdGkzngYJX19wb3dpZGYynwYIX19zdWJ0ZjOgBgxfX3RydW5jdGZkZjKhBgtzZXRUZW1wUmV0MKIGC2dldFRlbXBSZXQwowYJc3RhY2tTYXZlpAYMc3RhY2tSZXN0b3JlpQYKc3RhY2tBbGxvY6YGHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSnBhVlbXNjcmlwdGVuX3N0YWNrX2luaXSoBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlqQYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZaoGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZKsGDGR5bkNhbGxfamlqaawGFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammtBhhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGrBgQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 27560;
var ___stop_em_js = Module['___stop_em_js'] = 28613;



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
