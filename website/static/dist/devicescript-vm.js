
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2AAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA4SGgIAAggYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDQYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgADAwMGAAAAAgEAAgYABgYDAgIDAgIDBAMDAwYCCAACAQEAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAwEDAAABAQEBAAoAAgIAAQEBAAEAAQEAAAEAAAACAgUFCgABAAEBAgQGAQ4CAAAAAAAIAwYKAgICAAUKAwkDAQUGAwUJBQUGBQEBAwMGAwMDBQUFCQ0FAwMGBgMDAwMFBgUFBQUFBQEDDxECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAYCBQUFAQEFBQoBAwICAQAKBQUBBQUBBRECAgUPAwMDAwYGAwMDBAQGBgYBAwADAwQCAAMAAgYABAYGBQEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgECBAQBCg0CAgAABwkJAQMHAQIACAACBQAHCQgABAQEAAACBwADBwcBAgEAEgMJBwAABAACBwACBwQHBAQDAwMGAggGBgYEBwYHAwMGCAYAAAQfAQMPAwMACQcDBgQDBAAEAwMDAwQEBgYAAAAEBAcHBwcEBwcHCAgIBwQEAw4IAwAEAQAJAQMDAQMFBAkgCRcDAwQDBwcFBwQECAAEBAcJBwgABwgTBAYGBgQABBghEAYEBAQGCQQEAAAUCwsLEwsQBggHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgFFikqBQ8EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAecB5wEFhoCAgAABAYACgAIG3YCAgAAOfwFBsPYFC38BQQALfwFBAAt/AUEAC38AQajUAQt/AEGX1QELfwBB4dYBC38AQd3XAQt/AEHZ2AELfwBBqdkBC38AQcrZAQt/AEHP2wELfwBBqNQBC38AQcXcAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAPcFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCzBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQD4BRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoALsFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACSBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAJMGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAlAYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAJUGCXN0YWNrU2F2ZQCOBgxzdGFja1Jlc3RvcmUAjwYKc3RhY2tBbGxvYwCQBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AJEGDV9fc3RhcnRfZW1fanMDDAxf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NgIEIAEgAxCYAQwDCyADIQUgA0HlAEYNAQsgBCAFNgIEIAQgAjYCAEGnCiAEEDwgAEIANwMADAELAkAgASkAOCIGQgBSDQAgASgCrAEiA0UNACAAIAMpAyA3AwAMAQsgACAGNwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEOsEGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQ5AQaIAMgACgCBC0ADjoACiADKAIQDwtBvswAQZQ+QTFBhzgQmQUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQmwMNACADIAEpAwA3AxgCQAJAIAAgA0EYahDGAiICDQAgAyABKQMANwMQIAAgA0EQahDFAiEBDAELAkAgACACEMcCIgENAEEAIQEMAQsCQCAAIAIQrAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABD2AiADQShqIAAgBBDcAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEKcCIAFqIQIMAQsgACACQQBBABCnAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahC+AiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEJADIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEnSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEGA2AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEJoDDg0BBAsFCQYDBwsICgIACwsgAUEDNgIAIAFBAjoACgwLCyABQQA2AgAgAUECOgAKDAoLIAFBBjoACiABIAIpAwA3AgAMCQsgAUECOgAKIAMgAikDADcDCCABQQFBAiAAIANBCGoQkwMbNgIADAgLIAFBAToACiADIAIpAwA3AxAgASAAIANBEGoQkQM5AgAMBwsgAUHRADoACiACKAIAIQIgASAENgIAIAEgAi8BCEGAgICAeHI2AgQMBgsgASAENgIAIAFBMDoACiADIAIpAwA3AxggASAAIANBGGpBABBgNgIEDAULIAEgBDYCACABQQM6AAoMBAsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgDBHDQUgASAENgIAIAFB1AA6AAoMAwsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgChHDQUgASAENgIAIAFB0wA6AAogASACLwEEQYCAgIB4cjYCBAwCCyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICA0ABHDQUgASAENgIAIAFB1gA6AAogASACKAIcLwEEQYCAgIB4cjYCBAwBCyABQQc6AAogASACKQMANwIACyADQdAAaiQADwtBvtMAQZQ+QZMBQegqEJkFAAtBn8kAQZQ+QfQBQegqEJkFAAtBvMYAQZQ+QfsBQegqEJkFAAtB58QAQZQ+QYQCQegqEJkFAAuDAQEEfyMAQRBrIgEkACABIAAtAEY2AgBBACgC9OEBIQJBkTcgARA8IAAoAqwBIgMhBAJAIAMNACAAKAKwASEEC0EAIQMCQCAEIgRFDQAgBCgCHCEDCyABIAM2AgggASAALQBGOgAMIAJBAToACSACQYABIAFBCGpBCBClBSABQRBqJAALEABBAEG4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AigCDCADIgNBA3RqKQMANwMIIAQgA2pBDGogACABQQhqEJIDOgAAIANBAWoiBSEDIAUgAi8BCEkNAAsgBCEDDAELIAFBKGogAEH0CEEAEIYDQQAhAwsgACADENcCIAFBwABqJAALigECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AyACQAJAAkAgASADQRhqEJQDDQAgAyADKQMgNwMQIANBKGogAUESIANBEGoQiQMMAQsgAyADKQMgNwMIIAEgA0EIaiADQShqEJYDRQ0AIAAgAygCKBCOAwwBCyAAQgA3AwALIANBMGokAAv2AgIDfwF+IwBB8ABrIgEkACABIABB2ABqKQMANwNQIAEgACkDUCIENwNAIAEgBDcDYAJAAkAgACABQcAAahCUAw0AIAEgASkDYDcDOCABQegAaiAAQRIgAUE4ahCJA0EAIQIMAQsgASABKQNgNwMwIAAgAUEwaiABQdwAahCWAyECCwJAIAIiAkUNACABIAEpA1A3AygCQCAAIAFBKGpBlgEQnwNFDQACQCAAIAEoAlxBAXQQkwEiA0UNACADQQZqIAIgASgCXBCXBQsgACADENcCDAELIAEgASkDUDcDIAJAAkAgAUEgahCcAw0AIAEgASkDUDcDGCAAIAFBGGpBlwEQnwMNACABIAEpA1A3AxAgACABQRBqQZgBEJ8DRQ0BCyABQcgAaiAAIAIgASgCXBD5AiAAKAKsASABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahDoAjYCACABQegAaiAAQeIYIAEQhgMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahCVAw0AIAEgASkDIDcDECABQShqIABBohwgAUEQahCKA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEJYDIQILAkAgAiIDRQ0AIABBABDSAiECIABBARDSAiEEIABBAhDSAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQuAUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQlQMNACABIAEpA1A3AzAgAUHYAGogAEGiHCABQTBqEIoDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEJYDIQILAkAgAiIDRQ0AIABBABDSAiEEIAEgAEHgAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDzAkUNACABIAEpA0A3AwAgACABIAFB2ABqEPUCIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQlAMNACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQiQNBACECDAELIAEgASkDUDcDCCAAIAFBCGogAUHYAGoQlgMhAgsgAiECCyACIgVFDQAgAEECENICIQIgAEEDENICIQAgASgCWCIGIAJNDQAgASAGIAJrIgY2AlggASgCTCIHIARNDQAgASAHIARrIgc2AkwgAyAEaiAFIAJqIAcgBiAAIAYgAEkbIgAgByAASRsQtgUaCyABQeAAaiQAC9kBAgF/AXwjAEEQayICJAAgAiABKQMANwMIAkACQCACQQhqEJwDRQ0AQX8hAQwBCwJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAiAUEAIAFBAEobIQEMAgsgASgCAEHCAEcNAEF/IQEMAQsgAiABKQMANwMAQX8hASAAIAIQkQMiA0QAAOD////vQWQNAEEAIQEgA0QAAAAAAAAAAGMNAAJAAkAgA0QAAAAAAADwQWMgA0QAAAAAAAAAAGZxRQ0AIAOrIQEMAQtBACEBCyABIQELIAJBEGokACABC/MBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxAgASADNwMYAkACQCABQRBqEJwDRQ0AQX8hAgwBCwJAAkACQCABKAIcQQFqDgIAAQILIAEoAhgiAkEAIAJBAEobIQIMAgsgASgCGEHCAEcNAEF/IQIMAQsgASABKQMYNwMIQX8hAiAAIAFBCGoQkQMiBEQAAOD////vQWQNAEEAIQIgBEQAAAAAAAAAAGMNAAJAAkAgBEQAAAAAAADwQWMgBEQAAAAAAAAAAGZxRQ0AIASrIQIMAQtBACECCyACIQILIAAoAqwBIAIQdyABQSBqJAAL8wEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDECABIAM3AxgCQAJAIAFBEGoQnANFDQBBfyECDAELAkACQAJAIAEoAhxBAWoOAgABAgsgASgCGCICQQAgAkEAShshAgwCCyABKAIYQcIARw0AQX8hAgwBCyABIAEpAxg3AwhBfyECIAAgAUEIahCRAyIERAAA4P///+9BZA0AQQAhAiAERAAAAAAAAAAAYw0AAkACQCAERAAAAAAAAPBBYyAERAAAAAAAAAAAZnFFDQAgBKshAgwBC0EAIQILIAIhAgsgACgCrAEgAhB3IAFBIGokAAsjAQF/IABB39QDIABBABDSAiIBIAFBoKt8akGhq3xJGxCBAQsFABA1AAsJACAAQQAQgQEL/gECB38BfiMAQfAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNoIAEgCDcDECAAIAFBEGogAUHkAGoQ9QIiAkUNACAAIAAgAiABKAJkIAFBIGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDyAiIFQX9qIgYQkwEiB0UNAAJAAkAgBUHBAEkNACABQRhqIABBCCAHEJADIAEgASkDGDcDCCAAIAFBCGoQjQEgACACIAEoAmQgB0EGaiAFIAMgBEEAEPICGiABIAEpAxg3AwAgACABEI4BDAELIAdBBmogAUEgaiAGELYFGgsgACAHENcCCyABQfAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQ0gIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEPoCIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEI8CIAFBIGokAAsOACAAIABBABDTAhDUAgsPACAAIABBABDTAp0Q1AILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahCbA0UNACABIAEpA2g3AxAgASAAIAFBEGoQ6AI2AgBB5xcgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEPoCIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABD1AiECIAEgASkDaDcDMCABIAAgAUEwahDoAjYCJCABIAI2AiBBmRggAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEPoCIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEPUCIgJFDQAgAiABQSBqEM0EIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlAEQkAMgACgCrAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPAAboQjQMgACgCrAEgASkDCDcDICABQRBqJAALnwECAX8BfiMAQTBrIgEkACABIABB2ABqKQMAIgI3AyggASACNwMQAkACQAJAIAAgAUEQakGPARCfA0UNABCMBSECDAELIAEgASkDKDcDCCAAIAFBCGpBmwEQnwNFDQEQlQIhAgsgASACNwMgIAEgAUEgakEIEKAFNgIAIAFBGGogAEHmFSABEPgCIAAoAqwBIAEpAxg3AyALIAFBMGokAAvmAQIEfwF+IwBBIGsiASQAIABBABDSAiECIAEgAEHgAGopAwAiBTcDCCABIAU3AxgCQCAAIAFBCGoQ2QEiA0UNAAJAIAJBMUkNACABQRBqIABB3AAQiwMMAQsgAyACOgAVAkAgAygCHC8BBCIEQe0BSQ0AIAFBEGogAEEvEIsDDAELIABBsQJqIAI6AAAgAEGyAmogAy8BEDsBACAAQagCaiADKQMINwIAIAMtABQhAiAAQbACaiAEOgAAIABBpwJqIAI6AAAgAEG0AmogAygCHEEMaiAEELYFGiAAEI4CCyABQSBqJAALewICfwF+IwBBEGsiASQAAkAgABDYAiICRQ0AAkAgAigCBA0AIAIgAEEcEKgCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABD2AgsgASABKQMINwMAIAAgAkH2ACABEPwCIAAgAhDXAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ2AIiAkUNAAJAIAIoAgQNACACIABBIBCoAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQ9gILIAEgASkDCDcDACAAIAJB9gAgARD8AiAAIAIQ1wILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAENgCIgJFDQACQCACKAIEDQAgAiAAQR4QqAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEPYCCyABIAEpAwg3AwAgACACQfYAIAEQ/AIgACACENcCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDYAiICRQ0AAkAgAigCBA0AIAIgAEEiEKgCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARD2AgsgASABKQMINwMAIAAgAkH2ACABEPwCIAAgAhDXAgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEMACAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABDAAgsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEIIDIAAQWSABQRBqJAALpgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCJA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQZ0zQQAQhwMLIAIhAQsCQAJAIAEiAUUNACAAIAEoAhwQjgMMAQsgAEIANwMACyADQSBqJAALrAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCJA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQZ0zQQAQhwMLIAIhAQsCQAJAIAEiAUUNACAAIAEtABBBD3FBBEYQjwMMAQsgAEIANwMACyADQSBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCJA0EAIQIMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQZ0zQQAQhwMLIAIhAgsCQCACIgJFDQACQCACLQAQQQ9xQQRGDQAgAUEYaiAAQec0QQAQhwMMAQsgAiAAQdgAaikDADcDICACQQEQdgsgAUEgaiQAC5QBAQJ/IwBBIGsiASQAIAEgACkDUDcDEAJAAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxA3AwggAUEYaiAAQYsBIAFBCGoQiQNBACEADAELAkAgACABKAIQEHwiAg0AIAFBGGogAEGdM0EAEIcDCyACIQALAkAgACIARQ0AIAAQfgsgAUEgaiQAC1kCA38BfiMAQRBrIgEkACAAKAKsASECIAEgAEHYAGopAwAiBDcDACABIAQ3AwggACABEKYBIQMgACgCrAEgAxB3IAIgAi0AEEHwAXFBBHI6ABAgAUEQaiQACxkAIAAoAqwBIgAgADUCHEKAgICAEIQ3AyALWQECfyMAQRBrIgEkAAJAAkAgAC0AQyICDQAgAUEIaiAAQcMmQQAQhwMMAQsgACACQX9qQQEQfSICRQ0AIAAoAqwBIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQvgIiBEHPhgNLDQAgASgApAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQbshIANBCGoQigMMAQsgACABIAEoAqABIARB//8DcRCyAiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEKgCEI8BEJADIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCNASADQdAAakH7ABD2AiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQzgIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqELACIAMgACkDADcDECABIANBEGoQjgELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQvgIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEIkDDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BiNMBTg0CIABB8OgAIAFBA3RqLwEAEPYCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQboUQZc8QTFBtC0QmQUAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQmwMNACABQThqIABB4hoQiAMLIAEgASkDSDcDICABQThqIAAgAUEgahD6AiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI0BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEPUCIgJFDQAgAUEwaiAAIAIgASgCOEEBEJ8CIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjgEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECENICIQIgASABKQMgNwMIAkAgAUEIahCbAw0AIAFBGGogAEHMHBCIAwsgASABKQMoNwMAIAFBEGogACABIAJBARClAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQkQObENQCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEJEDnBDUAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCRAxDhBRDUAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxCOAwsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQkQMiBEQAAAAAAAAAAGNFDQAgACAEmhDUAgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABCNBbhEAAAAAAAA8D2iENQCC2QBBX8CQAJAIABBABDSAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEI0FIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQ1QILEQAgACAAQQAQ0wIQzAUQ1AILGAAgACAAQQAQ0wIgAEEBENMCENgFENQCCy4BA38gAEEAENICIQFBACECAkAgAEEBENICIgNFDQAgASADbSECCyAAIAIQ1QILLgEDfyAAQQAQ0gIhAUEAIQICQCAAQQEQ0gIiA0UNACABIANvIQILIAAgAhDVAgsWACAAIABBABDSAiAAQQEQ0gJsENUCCwkAIABBARDSAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahCSAyEDIAIgAikDIDcDECAAIAJBEGoQkgMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEJEDIQYgAiACKQMgNwMAIAAgAhCRAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA9hxNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAENIBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahCbAw0AIAEgASkDKDcDECAAIAFBEGoQwgIhAiABIAEpAyA3AwggACABQQhqEMYCIgNFDQAgAkUNACAAIAIgAxCpAgsgACgCrAEgASkDKDcDICABQTBqJAALCQAgAEEBENYBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahDGAiIDRQ0AIABBABCRASIERQ0AIAJBIGogAEEIIAQQkAMgAiACKQMgNwMQIAAgAkEQahCNASAAIAMgBCABEK0CIAIgAikDIDcDCCAAIAJBCGoQjgEgACgCrAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDWAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahCYAyICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqEIkDDAELIAEgASkDMDcDGAJAIAAgAUEYahDGAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQiQMMAQsgAiADNgIEIAAoAqwBIAEpAzg3AyALIAFBwABqJAALdQEDfyMAQRBrIgIkAAJAAkAgASgCBCIDQYCAwP8HcQ0AIANBD3FBCEcNACABKAIAIgRFDQAgBCEDIAQoAgBBgICA+ABxQYCAgNAARg0BCyACIAEpAwA3AwAgAkEIaiAAQS8gAhCJA0EAIQMLIAJBEGokACADC8gBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCJA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABKACkAUE8aigCAEEDdiACLwESIgFNDQAgACABNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuwAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAMgAkEIakEIEKAFNgIAIAAgAUHmFSADEPgCCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEIkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQRhqIAIpAwgQngUgAyADQRhqNgIAIAAgAUG+GSADEPgCCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEIkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABUQjgMLIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEBCOAwsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCJA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUEI4DCyADQSBqJAALogEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEIkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXEQjwMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFEEBcUUQjwMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAUEIIAIoAhwQkAMLIANBIGokAAvLAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELAkACQCACLQAUQQFxRQ0AQQAhAQwBC0EAIQEgAi0AFUEwSw0AIAIvARBBD3YhAQsgACABEI8DCyADQSBqJAALyQEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEIkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAItABRBAXENACACLQAVQTBLDQAgAi4BEEF/Sg0AIAAgAi0AEBCOAwwBCyAAQgA3AwALIANBIGokAAupAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYDAAEYQjwMLIANBIGokAAuoAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYAgRhCPAwsgA0EgaiQAC74BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCJA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLwEQIgJBDHZBf2pBAkkNACAAQgA3AwAMAQsgACACQf8fcRCOAwsgA0EgaiQAC6MBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCJA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQQYAgSRCPAwsgA0EgaiQAC/gBAQd/AkAgAkH//wNHDQBBAA8LIAEhAwNAIAUhBAJAIAMiBg0AQQAPCyAGLwEIIgVBAEchAQJAAkACQCAFDQAgASEDDAELIAEhB0EAIQhBACEDAkACQCAAKACkASIBIAEoAmBqIAYvAQpBAnRqIgkvAQIgAkYNAANAIANBAWoiASAFRg0CIAEhAyAJIAFBA3RqLwECIAJHDQALIAEgBUkhByABIQgLIAchAyAJIAhBA3RqIQEMAgsgASAFSSEDCyAEIQELIAEhAQJAAkAgAyIJRQ0AIAYhAwwBCyAAIAYQugIhAwsgAyEDIAEhBSABIQEgCUUNAAsgAQudAQEBfyABQYDgA3EhAgJAAkACQCAAQQFxRQ0AAkAgAg0AIAEhAQwDCwJAIAJBgMAARg0AIAJBgCBHDQILIAFB/x9xQYAgciEBDAILAkAgAcFBf0oNACABQf8BcUGAgH5yIQEMAgsCQCACRQ0AIAJBgCBHDQEgAUH/H3FBgCByIQEMAgsgAUGAwAByIQEMAQtB//8DIQELIAFB//8DcQujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQiQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgASABIAIQ7AEQtAILIANBIGokAAvCAwEIfwJAIAENAEEADwsCQCAAIAEvARIQuQIiAg0AQQAPCyABLgEQIgNBgGBxIQQCQAJAAkAgAS0AFEEBcUUNAAJAIAQNACADIQQMAwsCQCAEQf//A3EiAUGAwABGDQAgAUGAIEcNAgsgA0H/H3FBgCByIQQMAgsCQCADQX9KDQAgA0H/AXFBgIB+ciEEDAILAkAgBEUNACAEQf//A3FBgCBHDQEgA0H/H3FBgCByIQQMAgsgA0GAwAByIQQMAQtB//8DIQQLQQAhAQJAIARB//8DcSIFQf//A0YNACACIQQDQCADIQYCQCAEIgcNAEEADwsgBy8BCCIDQQBHIQECQAJAAkAgAw0AIAEhBAwBCyABIQhBACEJQQAhBAJAAkAgACgApAEiASABKAJgaiAHLwEKQQJ0aiICLwECIAVGDQADQCAEQQFqIgEgA0YNAiABIQQgAiABQQN0ai8BAiAFRw0ACyABIANJIQggASEJCyAIIQQgAiAJQQN0aiEBDAILIAEgA0khBAsgBiEBCyABIQECQAJAIAQiAkUNACAHIQQMAQsgACAHELoCIQQLIAQhBCABIQMgASEBIAJFDQALCyABC7cBAQN/IwBBIGsiASQAIAEgACkDUDcDEAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACABKAIQIgNFDQAgAyECIAMoAgBBgICA+ABxQYCAgNAARg0BCyABIAEpAxA3AwAgAUEYaiAAQS8gARCJA0EAIQILAkAgACACIgIQ7AEiA0UNACABQQhqIAAgAyACKAIcIgJBDGogAi8BBBD0ASAAKAKsASABKQMINwMgCyABQSBqJAAL6AECAn8BfiMAQSBrIgEkACABIAApA1A3AxACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyABIAEpAxA3AwAgAUEYaiAAQS8gARCJAwALIABBpAJqQQBB/AEQuAUaIABBsgJqQQM7AQAgAikDCCEDIABBsAJqQQQ6AAAgAEGoAmogAzcCACAAQbQCaiACLwEQOwEAIABBtgJqIAIvARY7AQAgAUEIaiAAIAIvARIQkAIgACgCrAEgASkDCDcDICABQSBqJAALoQECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqELcCIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCJAwsCQAJAIAINACAAQgA3AwAMAQsCQCABIAIQuAIiAkF/Sg0AIABCADcDAAwBCyAAIAEgAhCzAgsgA0EwaiQAC48BAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahC3AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQiQMLAkACQCACDQAgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBMGokAAuIAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQtwIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEIkDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQIQjgMLIANBMGokAAv4AQIDfwF+IwBBMGsiAyQAIAMgAikDACIGNwMYIAMgBjcDEAJAAkAgASADQRBqIANBLGoQtwIiBEUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEIkDCwJAAkAgBA0AIABCADcDAAwBCwJAAkAgBC8BAkGA4ANxIgVFDQAgBUGAIEcNASAAIAIpAwA3AwAMAgsCQCABIAQQuAIiAkF/Sg0AIABCADcDAAwCCyAAIAEgASABKACkASIFIAUoAmBqIAJBBHRqIAQvAQJB/x9xQYDAAHIQ6QEQtAIMAQsgAEIANwMACyADQTBqJAALjwICBH8BfiMAQTBrIgEkACABIAApA1AiBTcDGCABIAU3AwgCQAJAIAAgAUEIaiABQSxqELcCIgJFDQAgASgCLEH//wFGDQELIAEgASkDGDcDACABQSBqIABBnQEgARCJAwsCQCACRQ0AIAAgAhC4AiIDQQBIDQAgAEGkAmpBAEH8ARC4BRogAEGyAmogAi8BAiIEQf8fcTsBACAAQagCahCVAjcCAAJAAkAgBEGA4ANxIgRBgCBGDQAgBEGAgAJHDQFBp8AAQcgAQf8uEJQFAAsgACAALwGyAkGAIHI7AbICCyAAIAIQ9wEgAUEQaiAAIANBgIACahCQAiAAKAKsASABKQMQNwMgCyABQTBqJAALowMBBH8jAEEwayIFJAAgBSADNgIsAkACQCACLQAEQQFxRQ0AAkAgAUEAEJEBIgYNACAAQgA3AwAMAgsgAyAEaiEHIAAgAUEIIAYQkAMgBSAAKQMANwMYIAEgBUEYahCNAUEAIQMgASgApAEiBCAEKAJgaiACLwEGQQJ0aiECA0AgAiECIAMhAwJAAkAgByAFKAIsIghrIgRBAE4NACADIQMgAiECQQIhBAwBCyAFQSBqIAEgAi0AAiAFQSxqIAQQSgJAAkACQCAFKQMgUA0AIAUgBSkDIDcDECABIAYgBUEQahDRAiAFKAIsIAhGDQAgAyEEAkAgAw0AIAItAANBHnRBH3UgAnEhBAsgBCEDIAJBBGohBAJAAkAgAi8BBEUNACAEIQIMAQsgAyECIAMNAEEAIQMgBCECDAILIAMhAyACIQJBACEEDAILIAMhAyACIQILQQIhBAsgAyEDIAIhAiAEIQQLIAMhAyACIQIgBEUNAAsgBSAAKQMANwMIIAEgBUEIahCOAQwBCyAAIAEgAi8BBiAFQSxqIAQQSgsgBUEwaiQAC90BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQtwIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBhB0gAUEQahCKA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABB9xwgAUEIahCKA0EAIQMLAkAgAyIDRQ0AIAAoAqwBIQIgACABKAIkIAMvAQJB9ANBABCLAiACQREgAxDZAgsgAUHAAGokAAs9AQF/IwBBEGsiAiQAIAJBCGogACABIABBtAJqIABBsAJqLQAAEPQBIAAoAqwBIAIpAwg3AyAgAkEQaiQAC78EAQp/IwBBMGsiAiQAIABB2ABqIQMCQAJAIAAtAENBf2oiBEEBRg0AIAMhAyAEIQQMAQsgAiADKQMANwMgAkAgACACQSBqEJkDDQAgAyEDQQEhBAwBCyACIAMpAwA3AxggACACQRhqEJgDIgQoAgwhAyAELwEIIQQLIAQhBSADIQYgAEG0AmohBwJAAkAgAS0ABEEBcUUNACAHIQMgBUUNASAAQaAEaiEIIAchBEEAIQlBACEKIAAoAKQBIgMgAygCYGogAS8BBkECdGohAQNAIAEhAyAKIQogCSEJAkACQCAIIAQiBGsiAUEASA0AIAMtAAIhCyACIAYgCUEDdGopAwA3AxAgACALIAQgASACQRBqEEsiAUUNACAKIQsCQCAKDQAgAy0AA0EedEEfdSADcSELCyALIQogBCABaiEEIANBBGohAQJAAkACQCADLwEERQ0AIAEhAwwBCyAKIQMgCg0AIAEhAUEAIQpBASELDAELIAMhASAKIQpBACELCyAEIQMMAQsgAyEBIAohCkEBIQsgBCEDCyADIQMgCiEKIAEhAQJAIAtFDQAgAyEDDAMLIAMhBCAJQQFqIgshCSAKIQogASEBIAMhAyALIAVHDQAMAgsACyAHIQMCQAJAIAUOAgIBAAsgAiAFNgIAIAJBKGogAEGYNiACEIcDIAchAwwBCyABLwEGIQMgAiAGKQMANwMIIAcgACADIAdB7AEgAkEIahBLaiEDCyAAQbACaiADIAdrOgAAIAJBMGokAAvXAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqELcCIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQYQdIAFBEGoQigNBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQfccIAFBCGoQigNBACEDCwJAIAMiA0UNACAAIAMQ9wEgACABKAIkIAMvAQJB/x9xQYDAAHIQjQILIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQtwIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBhB0gA0EIahCKA0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQAC4kBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqELcCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQYQdIANBCGoQigNBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BADYCACAAQQQ2AgQLIANBMGokAAuGAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahC3AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGEHSADQQhqEIoDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQJB/x9xEI4DCyADQTBqJAALzQMCA38BfiMAQeAAayIBJAAgASAAKQNQIgQ3A0ggASAENwMwIAEgBDcDUCAAIAFBMGogAUHEAGoQtwIiAiEDAkAgAg0AIAEgASkDUDcDKCABQdgAaiAAQYQdIAFBKGoQigNBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAJEQf//AUcNACABIAEpA0g3AyAgAUHYAGogAEH3HCABQSBqEIoDQQAhAwsCQCADIgNFDQAgACADEPcBAkAgACAAIAEoAkQQuQJBACADLwECEOoBEOkBRQ0AIABBAzoAQyAAQeAAaiAAKAKsATUCHEKAgICAEIQ3AwAgAEHQAGoiAkEIakIANwMAIAJCADcDACABQQI2AlwgASABKAJENgJYIAEgASkDWDcDGCABQThqIAAgAUEYakGSARDAAiABIAEpA1g3AxAgASABKQM4NwMIIAFB0ABqIAAgAUEQaiABQQhqELwCIAAgASkDUDcDUCAAQbECakEBOgAAIABBsgJqIAMvAQI7AQAgAUHQAGogACABKAJEEJACIABB2ABqIAEpA1A3AwAgACgCrAFBAkEAEHUaDAELIAAgASgCRCADLwECEI0CCyABQeAAaiQAC28BAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqEIkDDAELIAAgASgCtAEgAigCAEEMbGooAgAoAhBBAEcQjwMLIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDUDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQiQNB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAENICIQMgASAAQeAAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahCXAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AEIsDDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABCLAwwBCyAAQbACaiAFOgAAIABBtAJqIAQgBRC2BRogACACIAMQjQILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQtgIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxCJAyAAQgA3AwAMAQsgACACKAIEEI4DCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqELYCIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQiQMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuTAQICfwF+IwBBwABrIgEkACABIAApA1AiAzcDGCABIAM3AzACQAJAIAAgAUEYahC2AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqEIkDDAELIAEgAEHYAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahC7AiAAKAKsASABKQMoNwMgCyABQcAAaiQAC8MBAgJ/AX4jAEHAAGsiASQAIAEgACkDUCIDNwMYIAEgAzcDMAJAAkACQCAAIAFBGGoQtgINACABIAEpAzA3AwAgAUE4aiAAQZ0BIAEQiQMMAQsgASAAQdgAaikDACIDNwMQIAEgAzcDKCAAIAFBEGoQ2QEiAkUNACABIAApA1AiAzcDCCABIAM3AyAgACABQQhqELUCIgBBf0wNASACIABBgIACczsBEgsgAUHAAGokAA8LQZLNAEHGwABBKUHyIhCZBQALRgEBfyMAQRBrIgMkACADIAIpAwA3AwACQAJAIAEgAyADQQxqEPUCRQ0AIAAgAygCDBCOAwwBCyAAQgA3AwALIANBEGokAAtyAgN/AX4jAEEgayIBJAAgASAAKQNQIgQ3AwggASAENwMQAkAgACABQQhqIAFBHGoQ9QIiAkUNAAJAIABBABDSAiIDIAEoAhxJDQAgACgCrAFBACkD2HE3AyAMAQsgACACIANqLQAAENUCCyABQSBqJAALUAECfyMAQSBrIgEkACABIAApA1A3AxAgAEEAENICIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQzAIgACgCrAEgASkDGDcDICABQSBqJAAL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ACADQcAASQ0AQZTjASABEOoCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAojjASABIAMgACADIABJGyIAELYFGkEAQQAoAozjASIJIABrNgKM4wEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEGU4wFByOIBEOoCQQBBwAA2AozjAUEAQcjiATYCiOMBIAIhAyABIQEgAg0BDAILQQBBACgCiOMBIABqNgKI4wEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKAKQ4wEgB2o2ApDjASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAozjASIAQcAARw0AIANBwABJDQBBlOMBIAEQ6gIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCiOMBIAEgAyAAIAMgAEkbIgAQtgUaQQBBACgCjOMBIgkgAGs2AozjASABIABqIQEgAyAAayECAkAgCSAARw0AQZTjAUHI4gEQ6gJBAEHAADYCjOMBQQBByOIBNgKI4wEgAiEDIAEhASACDQEMAgtBAEEAKAKI4wEgAGo2AojjASACIQMgASEBIAINAAsLQQBBACgCkOMBQQFqNgKQ4wFBASEDQffaACEBAkADQCABIQEgAyEDAkBBACgCjOMBIgBBwABHDQAgA0HAAEkNAEGU4wEgARDqAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAKI4wEgASADIAAgAyAASRsiABC2BRpBAEEAKAKM4wEiCSAAazYCjOMBIAEgAGohASADIABrIQICQCAJIABHDQBBlOMBQcjiARDqAkEAQcAANgKM4wFBAEHI4gE2AojjASACIQMgASEBIAINAQwCC0EAQQAoAojjASAAajYCiOMBIAIhAyABIQEgAg0ACwsgCBDwAguxBwIIfwF+IwBBgAFrIggkAAJAIARFDQAgA0EAOgAACyAHIQdBACEJQQAhCgNAIAohCyAHIQxBACEKAkAgCSIJIAJGDQAgASAJai0AACEKCyAJQQFqIQcCQAJAAkACQAJAIAoiCkH/AXEiDUH7AEcNACAHIAJJDQELIA1B/QBHDQEgByACTw0BIAohCiAJQQJqIAcgASAHai0AAEH9AEYbIQcMAgsgCUECaiENAkAgASAHai0AACIHQfsARw0AIAchCiANIQcMAgsCQAJAIAdBUGpB/wFxQQlLDQAgB8BBUGohCQwBC0F/IQkgB0EgciIHQZ9/akH/AXFBGUsNACAHwEGpf2ohCQsCQCAJIgpBAE4NAEEhIQogDSEHDAILIA0hByANIQkCQCANIAJPDQADQAJAIAEgByIHai0AAEH9AEcNACAHIQkMAgsgB0EBaiIJIQcgCSACRw0ACyACIQkLAkACQCANIAkiCUkNAEF/IQcMAQsCQCABIA1qLAAAIg1BUGoiB0H/AXFBCUsNACAHIQcMAQtBfyEHIA1BIHIiDUGff2pB/wFxQRlLDQAgDUGpf2ohBwsgByEHIAlBAWohDgJAIAogBkgNAEE/IQogDiEHDAILIAggBSAKQQN0aiIJKQMAIhA3AyAgCCAQNwNwAkACQCAIQSBqEPQCRQ0AIAggCSkDADcDCCAIQTBqIAAgCEEIahCRA0EHIAdBAWogB0EASBsQnAUgCCAIQTBqEOUFNgJ8IAhBMGohCgwBCyAIIAgpA3A3AxggCEEoaiAAIAhBGGpB5AAQigIgCCAIKQMoNwMQIAAgCEEQaiAIQfwAahD1AiEKCyAIIAgoAnwiB0F/aiIJNgJ8IAkhDSAMIQ8gCiEKIAshCQJAIAcNACALIQogDiEJIAwhBwwDCwNAIAkhCSAKIQogDSEHAkACQCAPIg0NAAJAIAkgBE8NACADIAlqIAotAAA6AAALIAlBAWohDEEAIQ8MAQsgCSEMIA1Bf2ohDwsgCCAHQX9qIgk2AnwgCSENIA8iCyEPIApBAWohCiAMIgwhCSAHDQALIAwhCiAOIQkgCyEHDAILIAohCiAHIQcLIAchByAKIQkCQCAMDQACQCALIARPDQAgAyALaiAJOgAACyALQQFqIQogByEJQQAhBwwBCyALIQogByEJIAxBf2ohBwsgByEHIAkiDSEJIAoiDyEKIA0gAk0NAAsCQCAERQ0AIAQgA2pBf2pBADoAAAsgCEGAAWokACAPC2EBAn9BACECAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxG0F8ag4FAQICAgACC0EAIQIgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgDBGDwsgASgCAEH//wBLIQILIAILGQAgACgCBCIAQX9GIABBgIDA/wdxQQBHcguQAQECf0EAIQMCQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQXxqDgUBAgICAAILAkAgASgCACIBDQBBAA8LQQAhAyABKAIAQYCAgPgAcUGAgIAwRw0BAkAgAkUNACACIAEvAQQ2AgALIAFBBmoPC0EAIQMgASgCACIBQYCAAUkNACAAIAEgAhCvAyEDCyADCxUAIABBBDYCBCAAIAFBgIABcjYCAAt5AQJ/IwBBEGsiBCQAIAQgAzYCDCAEIAM2AggCQAJAIAFBAEEAIAIgAxCbBSIFQX9qEJMBIgMNACAEQQdqQQEgAiAEKAIIEJsFGiAAQgA3AwAMAQsgA0EGaiAFIAIgBCgCCBCbBRogACABQQggAxCQAwsgBEEQaiQACyYBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQ9wIgBEEQaiQACyUAAkAgASACIAMQlAEiAw0AIABCADcDAA8LIAAgAUEIIAMQkAMLnQsBBH8jAEGgAmsiAyQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEQIAIoAgQiBEEPcSAEQYCAwP8HcRsiBQ4RBAULBgEIDA0ABwgNDQ0NDQ4NCyACKAIAIgZFDQIgBigCAEGAgID4AHFBgICAMEYhBgwBCyACKAIAQf//AEshBgsgBkUNACAAIAIpAwA3AwAMDAsgBQ4RAAEHAgYECAkFAwQJCQkJCQoJCwJAAkACQAJAAkACQAJAAkAgAigCACICDkQBAgQABwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHAwcFBgcLIABCqoCBgMAANwMADBELIABCxoCBgMAANwMADBALIABCmICBgMAANwMADA8LIABCxYCBgMAANwMADA4LIABCiYCBgMAANwMADA0LIABChICBgMAANwMADAwLIABCgYCBgMAANwMADAsLAkAgAkGgf2oiBEEnSw0AIAMgBDYCECAAIAFBpsMAIANBEGoQ+AIMCwsCQCACQYAISQ0AIAMgAjYCICAAIAFB0cEAIANBIGoQ+AIMCwtByD1B/gBBjScQlAUACyADIAIoAgA2AjAgACABQd3BACADQTBqEPgCDAkLIAIoAgAhAiADIAEoAqQBNgJMIAMgA0HMAGogAhB6NgJAIAAgAUGcwgAgA0HAAGoQ+AIMCAsgAyABKAKkATYCXCADIANB3ABqIARBBHZB//8DcRB6NgJQIAAgAUGrwgAgA0HQAGoQ+AIMBwsgAyABKAKkATYCZCADIANB5ABqIARBBHZB//8DcRB6NgJgIAAgAUHEwgAgA0HgAGoQ+AIMBgsCQAJAIAIoAgAiBA0AQQAhBQwBCyAELQADQQ9xIQULAkACQAJAAkACQAJAIAVBfWoOCQAEAgUBBQQDBAULIABCj4CBgMAANwMADAoLIABCnICBgMAANwMADAkLIAMgAikDADcDaCAAIAEgA0HoAGoQ+wIMCAsgBC8BEiECIAMgASgCpAE2AoQBIANBhAFqIAIQeyECIAQvARAhBSADIAQoAhwvAQQ2AnggAyAFNgJ0IAMgAjYCcCAAIAFBjMMAIANB8ABqEPgCDAcLIABCpoCBgMAANwMADAYLQcg9QaIBQY0nEJQFAAsgAigCAEGAgAFPDQUgAyACKQMANwOIASAAIAEgA0GIAWoQ+wIMBAsgAigCACECIAMgASgCpAE2ApwBIAMgA0GcAWogAhB7NgKQASAAIAFBucIAIANBkAFqEPgCDAMLIAMgAikDADcD2AECQCABIANB2AFqELYCIgRFDQAgBC8BACECIAMgASgCpAE2AtQBIAMgA0HUAWogAkEAEK4DNgLQASAAIAFB0cIAIANB0AFqEPgCDAMLIAMgAikDADcDyAEgAUGkAWohAiABIANByAFqIANB4AFqELcCIQQCQCADKALgASIFQf//AUcNACABIAQQuAIhBSABKACkASIGIAYoAmBqIAVBBHRqLwEAIQUgAyACKAIANgKsASADQawBaiAFQQAQrgMhBSAELwEAIQQgAyACKAIANgKoASADIANBqAFqIARBABCuAzYCpAEgAyAFNgKgASAAIAFBiMIAIANBoAFqEPgCDAMLIAMgAigCADYCxAEgA0HEAWogBRB7IQUgBC8BACEEIAMgAigCADYCwAEgAyADQcABaiAEQQAQrgM2ArQBIAMgBTYCsAEgACABQfrBACADQbABahD4AgwCC0HIPUG7AUGNJxCUBQALIAMgAikDADcDCCADQeABaiABIANBCGoQkQNBBxCcBSADIANB4AFqNgIAIAAgAUG+GSADEPgCCyADQaACaiQADwtB1NMAQcg9QaUBQY0nEJkFAAt8AQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAIAEgA0EQaiADQRxqEJcDIgQNAEGcyABByD1B0wBB/CYQmQUACyADIAQgAygCHCICQSAgAkEgSRsQoAU2AgQgAyACNgIAIAAgAUG3wwBB6cEAIAJBIEsbIAMQ+AIgA0EgaiQAC7gCAQJ/IwBB0ABrIgQkACAEIAMpAwA3AzAgACAEQTBqEI0BIAQgAykDADcDSAJAAkACQAJAAkACQEEQIAQoAkwiBUEPcSAFQYCAwP8HcRtBfGoOBQEDAwMAAwsgBCgCSCIFRQ0CIAUoAgBBgICA+ABxQYCAgDBGIQUMAQsgBCgCSEH//wBLIQULIAUNAQsgBCAEKQNINwMoIARBwABqIAAgBEEoahD6AiAEIAQpA0A3AyAgACAEQSBqEI0BIAQgBCkDSDcDGCAAIARBGGoQjgEMAQsgBCAEKQNINwNACyADIAQpA0A3AwAgBEEENgI8IAQgAkGAgAFyNgI4IAQgBCkDODcDECAEIAMpAwA3AwggACABIARBEGogBEEIahCqAiAEIAMpAwA3AwAgACAEEI4BIARB0ABqJAALmAkCBn8CfiMAQYABayIEJAAgAykDACEKIAQgAikDACILNwNgIAEgBEHgAGoQjQECQAJAIAsgClEiBQ0AIAQgAykDADcDWCABIARB2ABqEI0BIAQgAikDADcDeAJAAkACQAJAAkACQEEQIAQoAnwiBkEPcSAGQYCAwP8HcRtBfGoOBQEDAwMAAwsgBCgCeCIGRQ0CIAYoAgBBgICA+ABxQYCAgDBGIQYMAQsgBCgCeEH//wBLIQYLIAYNAQsgBCAEKQN4NwNQIARB8ABqIAEgBEHQAGoQ+gIgBCAEKQNwNwNIIAEgBEHIAGoQjQEgBCAEKQN4NwNAIAEgBEHAAGoQjgEMAQsgBCAEKQN4NwNwCyACIAQpA3A3AwAgBCADKQMANwN4AkACQAJAAkACQAJAQRAgBCgCfCIGQQ9xIAZBgIDA/wdxG0F8ag4FAQMDAwADCyAEKAJ4IgZFDQIgBigCAEGAgID4AHFBgICAMEYhBgwBCyAEKAJ4Qf//AEshBgsgBg0BCyAEIAQpA3g3AzggBEHwAGogASAEQThqEPoCIAQgBCkDcDcDMCABIARBMGoQjQEgBCAEKQN4NwMoIAEgBEEoahCOAQwBCyAEIAQpA3g3A3ALIAMgBCkDcDcDAAwBCyAEIAIpAwA3A3gCQAJAAkACQAJAAkBBECAEKAJ8IgZBD3EgBkGAgMD/B3EbQXxqDgUBAwMDAAMLIAQoAngiBkUNAiAGKAIAQYCAgPgAcUGAgIAwRiEGDAELIAQoAnhB//8ASyEGCyAGDQELIAQgBCkDeDcDICAEQfAAaiABIARBIGoQ+gIgBCAEKQNwNwMYIAEgBEEYahCNASAEIAQpA3g3AxAgASAEQRBqEI4BDAELIAQgBCkDeDcDcAsgAiAEKQNwIgo3AwAgAyAKNwMACyACKAIAIQdBACEGAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACC0EAIQYgB0UNAUEAIQYgBygCAEGAgID4AHFBgICAMEcNASAEIAcvAQQ2AnAgB0EGaiEGDAELQQAhBiAHQYCAAUkNACABIAcgBEHwAGoQrwMhBgsgBiEIIAMoAgAhB0EAIQYCQAJAAkBBECADKAIEIglBD3EgCUGAgMD/B3EbQXxqDgUBAgICAAILAkAgBw0AQQAhBgwCC0EAIQYgBygCAEGAgID4AHFBgICAMEcNASAEIAcvAQQ2AmwgB0EGaiEGDAELQQAhBiAHQYCAAUkNACABIAcgBEHsAGoQrwMhBgsgBiEGAkACQAJAIAhFDQAgBg0BCyAEQfgAaiABQf4AEIIBIABCADcDAAwBCwJAIAQoAnAiBw0AIAAgAykDADcDAAwBCwJAIAQoAmwiCQ0AIAAgAikDADcDAAwBCwJAIAEgCSAHahCTASIHDQAgAEIANwMADAELIAQoAnAhCSAJIAdBBmogCCAJELYFaiAGIAQoAmwQtgUaIAAgAUEIIAcQkAMLIAQgAikDADcDCCABIARBCGoQjgECQCAFDQAgBCADKQMANwMAIAEgBBCOAQsgBEGAAWokAAvCAgEEfyMAQRBrIgUkACACKAIAIQZBACEHAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACCwJAIAYNAEEAIQcMAgtBACEHIAYoAgBBgICA+ABxQYCAgDBHDQEgBSAGLwEENgIMIAZBBmohBwwBC0EAIQcgBkGAgAFJDQAgASAGIAVBDGoQrwMhBwsCQAJAIAciCA0AIABCADcDAAwBCwJAIAUoAgwiByAEaiIGQQAgBkEAShsgBCAEQQBIGyIEIAcgBCAHSBsgByADaiIEQQAgBEEAShsgAyADQQBIGyIEIAcgBCAHSBsiBGsiA0EASg0AIABCgICBgMAANwMADAELAkAgBA0AIAMgB0cNACAAIAIpAwA3AwAMAQsgACABQQggASAIIARqIAMQlAEQkAMLIAVBEGokAAuTAQEEfyMAQRBrIgMkAAJAIAJFDQBBACEEAkAgACgCECIFLQAOIgZFDQAgACAFLwEIQQN0akEYaiEECyAEIQUCQCAGRQ0AQQAhAAJAA0AgBSAAIgBBAXRqIgQvAQBFDQEgAEEBaiIEIQAgBCAGRg0CDAALAAsgBCACOwEADAELIANBCGogAUH7ABCCAQsgA0EQaiQAC2IBA38CQCAAKAIQIgItAA4iAw0AQQAPCyAAIAIvAQhBA3RqQRhqIQQgAyEAA0ACQCAAIgBBAU4NAEEADwsgAEF/aiICIQAgBCACQQF0aiICLwEAIgNFDQALIAJBADsBACADC8ADAQx/IwBBwABrIgIkACACIAEpAwA3AzACQAJAIAAgAkEwahCUAw0AIAIgASkDADcDKCAAQYoPIAJBKGoQ5wIMAQsgAiABKQMANwMgIAAgAkEgaiACQTxqEJYDIQMgAiACKAI8IgFBAXY2AjwgAUECSQ0AIABBpAFqIQRBACEAA0AgAyAAIgVBAXRqLwEAIQZBACEAAkAgBCgAACIHQSRqKAIAIgFBEEkNACABQQR2IgBBASAAQQFLGyEIIAcgBygCIGohCUEAIQECQANAIAAhCgJAAkAgCSABIgtBBHRqIgwoAgAiDSAGSw0AQQAhACAMIQEgDCgCBCANaiAGTw0BC0EBIQAgCiEBCyABIQEgAEUNASABIQAgC0EBaiIMIQEgDCAIRw0AC0EAIQAMAQsgASEACwJAAkAgACIARQ0AIAcoAiAhASACIAQoAgA2AhwgAkEcaiAAIAcgAWprQQR1IgEQeiEMIAAoAgAhACACIAE2AhQgAiAMNgIQIAIgBiAAazYCGEHh1wAgAkEQahA8DAELIAIgBjYCAEHK1wAgAhA8CyAFQQFqIgEhACABIAIoAjxJDQALCyACQcAAaiQAC8sCAQJ/IwBB4ABrIgIkACACIABBggJqQSAQoAU2AkBB2RUgAkHAAGoQPCACIAEpAwA3AzhBACEDAkAgACACQThqENoCRQ0AIAIgASkDADcDMCACQdgAaiAAIAJBMGpB4wAQwAICQAJAIAIpA1hQRQ0AQQAhAwwBCyACIAIpA1g3AyggAEGWISACQShqEOcCQQEhAwsgAyEDIAIgASkDADcDICACQdAAaiAAIAJBIGpB9gAQwAICQAJAIAIpA1BQRQ0AIAMhAwwBCyACIAIpA1A3AxggAEHHLiACQRhqEOcCIAIgASkDADcDECACQcgAaiAAIAJBEGpB8QAQwAICQCACKQNIUA0AIAIgAikDSDcDCCAAIAJBCGoQgQMLIANBAWohAwsgAyEDCwJAIAMNACACIAEpAwA3AwAgAEGWISACEOcCCyACQeAAaiQAC4gEAQZ/IwBB4ABrIgMkAAJAAkAgAC0ARUUNACADIAEpAwA3A0AgAEG3CyADQcAAahDnAgwBCwJAIAAoAqgBDQAgAyABKQMANwNYQYAhQQAQPCAAQQA6AEUgAyADKQNYNwMAIAAgAxCCAyAAQeXUAxCBAQwBCyAAQQE6AEUgACABKQMANwM4IAMgASkDADcDOCAAIANBOGoQ2gIhBCACQQFxDQAgBEUNACADIAEpAwA3AzAgA0HYAGogACADQTBqQfEAEMACIAMpA1hCAFINAAJAAkAgACgCqAEiAg0AQQAhBQwBCyACIQJBACEEA0AgBEEBaiIEIQUgAigCDCIGIQIgBCEEIAYNAAsLAkACQCAAIAUiAkEQIAJBEEkbIgVBAXQQkgEiB0UNAAJAIAAoAqgBIgJFDQAgBUUNACAHQQxqIQggAiECQQAhBANAIAggBCIEQQF0aiACIgIvAQQ7AQAgAigCDCICRQ0BIAIhAiAEQQFqIgYhBCAGIAVJDQALCyADQdAAaiAAQQggBxCQAwwBCyADQgA3A1ALIAMgAykDUDcDKCAAIANBKGoQjQEgA0HIAGpB8QAQ9gIgAyABKQMANwMgIAMgAykDSDcDGCADIAMpA1A3AxAgACADQSBqIANBGGogA0EQahDOAiADIAMpA1A3AwggACADQQhqEI4BCyADQeAAaiQAC9AHAgx/AX4jAEEQayIBJAAgACkDOCINpyECAkACQAJAAkAgDUIgiKciAw0AIAJBgAhJDQAgAkEPcSEEIAJBgHhqQQR2IQUMAQsCQCAALQBHDQBBACEEQQAhBQwBCwJAAkAgAC0ASEUNAEEBIQZBACEHDAELQQEhBkEAIQcgAC0ASUEDcUUNACAAKAKoASIHQQBHIQQCQAJAIAcNACAEIQgMAQsgBCEEIAchBQNAIAQhCUEAIQcCQCAFIgYoAhAiBC0ADiIFRQ0AIAYgBC8BCEEDdGpBGGohBwsgByEIIAYvAQQhCgJAIAVFDQBBACEEIAUhBQNAIAQhCwJAIAggBSIHQX9qIgVBAXRqLwEAIgRFDQAgBiAEOwEEIAYgABCkA0HSAEcNACAGIAo7AQQgCSEIIAtBAXENAgwECyAHQQJIIQQgBSEFIAdBAUoNAAsLIAYgCjsBBCAGKAIMIgdBAEciBiEEIAchBSAGIQggBw0ACwtBACEGQQIhByAIQQFxRQ0AIAAtAEkiB0ECcUUhBiAHQR50QR91QQNxIQcLQQAhBEEAIQUgByEHIAZFDQELQQBBAyAFIgobIQlBf0EAIAobIQwgBCEHAkADQCAHIQsgACgCqAEiCEUNAQJAAkAgCkUNACALDQAgCCAKOwEEIAshB0EDIQQMAQsCQAJAIAgoAhAiBy0ADiIEDQBBACEHDAELIAggBy8BCEEDdGpBGGohBSAEIQcDQAJAIAciB0EBTg0AQQAhBwwCCyAHQX9qIgQhByAFIARBAXRqIgQvAQAiBkUNAAsgBEEAOwEAIAYhBwsCQCAHIgcNAAJAIApFDQAgAUEIaiAAQfwAEIIBIAshB0EDIQQMAgsgCCgCDCEHIAAoAqwBIAgQeAJAIAdFDQAgCyEHQQIhBAwCCyABIAM2AgwgASACNgIIQYAhQQAQPCAAQQA6AEUgASABKQMINwMAIAAgARCCAyAAQeXUAxCBASALIQdBAyEEDAELIAggBzsBBAJAAkACQAJAIAggABCkA0Guf2oOAgABAgsgCyAMaiEHIAkhBAwDCyAKRQ0BIAFBCGogCiALQX9qEKADIAAgASkDCDcDOCAALQBHRQ0BIAAoAtgBIAAoAqgBRw0BIABBCBCqAwwBCyABQQhqIABB/QAQggEgCyEHQQMhBAwBCyALIQdBAyEECyAHIQcgBEEDRw0ACwsgAEEAOgBFIABBADoAQgJAIAAoAqwBIgdFDQAgByAAKQM4NwMgCyAAQgA3AzhBCCEHIAAtAAdFDQELIAAgBxCqAwsgAUEQaiQAC4oBAQF/IwBBIGsiBSQAAkACQCABIAEgAhCoAhCPASICDQAgAEIANwMADAELIAAgAUEIIAIQkAMgBSAAKQMANwMQIAEgBUEQahCNASAFQRhqIAEgAyAEEPcCIAUgBSkDGDcDCCABIAJB9gAgBUEIahD8AiAFIAApAwA3AwAgASAFEI4BCyAFQSBqJAALUwEBfyMAQSBrIgQkACAEIAM2AhQgBEEYaiABQR4gAiADEIUDAkAgBCkDGFANACAEIAQpAxg3AwggASAEQQhqQQIQgwMLIABCADcDACAEQSBqJAALUwEBfyMAQSBrIgQkACAEIAM2AhQgBEEYaiABQSAgAiADEIUDAkAgBCkDGFANACAEIAQpAxg3AwggASAEQQhqQQIQgwMLIABCADcDACAEQSBqJAALKAEBfyMAQRBrIgMkACADIAI2AgAgACABQYfUACADEIYDIANBEGokAAtSAgF/AX4jAEEgayIEJAAgAhCtAyECIAQgAykDACIFNwMQIAQgBTcDGCAEIAEgBEEQahDoAjYCBCAEIAI2AgAgACABQbMWIAQQhgMgBEEgaiQAC0ABAX8jAEEQayIEJAAgBCADKQMANwMIIAQgASAEQQhqEOgCNgIEIAQgAjYCACAAIAFBsxYgBBCGAyAEQRBqJAALKgEBfyMAQRBrIgMkACADIAIQrQM2AgAgACABQeInIAMQhwMgA0EQaiQAC1MBAX8jAEEgayIEJAAgBCADNgIUIARBGGogAUEiIAIgAxCFAwJAIAQpAxhQDQAgBCAEKQMYNwMIIAEgBEEIakECEIMDCyAAQgA3AwAgBEEgaiQAC8MCAgF+BH8CQAJAAkACQCABELQFDgQAAQICAwsgAEICNwMADwsCQCABRAAAAAAAAAAAZEUNACAAQsIANwMADwsgAELDADcDAA8LIABCgICAgHA3AwAPCwJAIAG9IgJCIIinIgMgAqciBHINACAAQoCAgIBwNwMADwsCQCADQRR2Qf8PcSIFQf8HSQ0AAkACQCAFQZMISw0AIAQNAgJAIAVBkwhGDQAgA0H//z9xIAVBjXhqdA0DCyADQf//P3FBgIDAAHJBkwggBWt2IQMMAQsCQCAFQZ4ISQ0AIAQNAiADQYCAgI98Rw0CIABCgICAgHg3AwAPCyAEIAVB7XdqIgZ0DQEgA0H//z9xQYCAwAByIAZ0IARBswggBWt2ciEDCyAAQX82AgQgAEEAIAMiA2sgAyACQgBTGzYCAA8LIAAgATkDAAsQACAAIAE2AgAgAEF/NgIECw8AIABCwABCASABGzcDAAtDAAJAIAMNACAAQgA3AwAPCwJAIAJBCHFFDQAgASADEJgBIAAgAzYCACAAIAI2AgQPC0HW1gBBqz5B2wBBohsQmQUAC5UCAgJ/AXwjAEEgayICJAACQAJAIAEoAgQiA0F/Rw0AIAEoAgC3IQQMAQsCQCABQQZqLwEAQfD/AXFFDQAgASsDACEEDAELAkAgAw0AAkACQAJAAkACQCABKAIAIgFBQGoOBAEEAgMAC0QAAAAAAAAAACEEIAFBf2oOAwUDBQMLRAAAAAAAAPA/IQQMBAtEAAAAAAAA8H8hBAwDC0QAAAAAAADw/yEEDAILRAAAAAAAAPh/IQQMAQsgAiABKQMANwMQAkAgACACQRBqEPMCRQ0AIAIgASkDADcDCCAAIAJBCGogAkEcahD1AiIBIAJBGGoQ9QUhBCABIAIoAhhHDQELRAAAAAAAAPh/IQQLIAJBIGokACAEC9YBAgF/AXwjAEEQayICJAACQAJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAhAQwCCyABKAIAQT9LIQEMAQsgAiABKQMANwMIQQAhASAAIAJBCGoQkQMiA71C////////////AINCgICAgICAgPj/AFYNAAJAAkAgA51EAAAAAAAA8EEQvAUiA0QAAAAAAADwQaAgAyADRAAAAAAAAAAAYxsiA0QAAAAAAADwQWMgA0QAAAAAAAAAAGZxRQ0AIAOrIQEMAQtBACEBCyABIQELIAJBEGokACABC7ABAQF/IwBBIGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAQQBHIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDEAJAIAAgAkEQahDzAkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQ9QIaIAIoAhxBAEchAQwBCwJAIAFBBmovAQBB8P8BcQ0AQQEhAQwBCyABKwMARAAAAAAAAAAAYSEBCyACQSBqJAAgAQthAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRtBfGoOBQECAgIAAgtBACECIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAoRg8LIAEoAgBBgIABSSECCyACC2wBAn9BACECAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDQXxqDgUBAgICAAILQQAhAiABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYhAgwBCyABKAIAQYCAAUkhAgsgA0EERyACcQvGAQECfwJAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIEQXxqDgUBAwMDAAMLIAEoAgAiA0UNAiADKAIAQYCAgPgAcUGAgIAoRiEDDAELIAEoAgBBgIABSSEDCyADRQ0AAkACQAJAIARBfGoOBQIBAQEAAQsgASgCACEBAkAgAkUNACACIAEvAQQ2AgALIAFBDGoPC0GrPkHRAUGbwQAQlAUACyAAIAEoAgAgAhCvAw8LQfDTAEGrPkHDAUGbwQAQmQUAC90BAQJ/IwBBIGsiAyQAAkACQAJAAkACQEEQIAEoAgQiBEEPcSAEQYCAwP8HcRtBfGoOBQEDAwMAAwsgASgCACIERQ0CIAQoAgBBgICA+ABxQYCAgChGIQQMAQsgASgCAEGAgAFJIQQLIARFDQAgAyABKQMANwMYIAAgA0EYaiACEJYDIQEMAQsgAyABKQMANwMQAkAgACADQRBqEPMCRQ0AIAMgASkDADcDCCAAIANBCGogAhD1AiEBDAELAkAgAg0AQQAhAQwBCyACQQA2AgBBACEBCyADQSBqJAAgAQsjAEEAIAEoAgBBACABKAIEIgFBD3FBCEYbIAFBgIDA/wdxGwtSAQF/AkAgASgCBCICQYCAwP8HcUUNAEEADwsCQCACQQ9xQQhGDQBBAA8LQQAhAgJAIAEoAgAiAUUNACABKAIAQYCAgPgAcUGAgIAYRiECCyACC8QDAQN/IwBBEGsiAiQAAkACQCABKAIEIgNBf0cNAEEBIQQMAQtBASEEAkACQAJAAkACQAJAAkACQAJAQRAgA0EPcSABQQZqLwEAQfD/AXEbDhEAAQYCBAIFBwMCAgcHBwcHCQcLQQwhBAJAAkACQAJAIAEoAgAiAQ5EAAECDAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwEDAgIDC0EAIQQMCwtBBiEEDAoLQQEhBAwJC0ECIQQgAUGgf2pBKEkNCEELIQQgAUH/B0sNCEGrPkGIAkGSKBCUBQALQQchBAwHC0EIIQQMBgsCQAJAIAEoAgAiAQ0AQX0hAQwBCyABLQADQQ9xQX1qIQELIAEiAUEJSQ0EQas+QaUCQZIoEJQFAAtBBEEJIAEoAgBBgIABSRshBAwECyACIAEpAwA3AwhBAiEEIAAgAkEIahC2Ag0DIAIgASkDADcDAEEIQQIgACACQQAQtwIvAQJBgCBJGyEEDAMLQQUhBAwCC0GrPkG0AkGSKBCUBQALIAFBAnRB8PEAaigCACEECyACQRBqJAAgBAsRACAAKAIERSAAKAIAQQRJcQskAQF/QQAhAQJAIAAoAgQNACAAKAIAIgBFIABBA0ZyIQELIAELawECfyMAQRBrIgMkAAJAAkAgASgCBA0AAkAgASgCAA4EAAEBAAELIAIoAgQNAEEBIQQgAigCAA4EAQAAAQALIAMgASkDADcDCCADIAIpAwA3AwAgACADQQhqIAMQngMhBAsgA0EQaiQAIAQLhgICAn8CfiMAQcAAayIDJAACQAJAIAEoAgQNACABKAIAQQJHDQAgAigCBA0AQQAhBCACKAIAQQJGDQELIAMgAikDACIFNwMwIAMgASkDACIGNwMoQQEhAQJAIAYgBVENACADIAMpAyg3AyACQCAAIANBIGoQ8wINAEEAIQEMAQsgAyADKQMwNwMYQQAhASAAIANBGGoQ8wJFDQAgAyADKQMoNwMQIAAgA0EQaiADQTxqEPUCIQIgAyADKQMwNwMIIAAgA0EIaiADQThqEPUCIQRBACEBAkAgAygCPCIAIAMoAjhHDQAgAiAEIAAQ0AVFIQELIAEhAQsgASEECyADQcAAaiQAIAQL3QECAn8CfiMAQcAAayIDJAAgA0EgaiACEPYCIAMgAykDICIFNwMwIAMgASkDACIGNwMoQQEhAgJAIAYgBVENACADIAMpAyg3AxgCQCAAIANBGGoQ8wINAEEAIQIMAQsgAyADKQMwNwMQQQAhAiAAIANBEGoQ8wJFDQAgAyADKQMoNwMIIAAgA0EIaiADQTxqEPUCIQEgAyADKQMwNwMAIAAgAyADQThqEPUCIQBBACECAkAgAygCPCIEIAMoAjhHDQAgASAAIAQQ0AVFIQILIAIhAgsgA0HAAGokACACC1kAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0HswwBBqz5B/QJB1DcQmQUAC0GUxABBqz5B/gJB1DcQmQUAC4wBAQF/QQAhAgJAIAFB//8DSw0AQagBIQICQAJAAkACQAJAAkAgAUEOdg4EAwUAAQILIAAoAgBBxABqIQJBASEADAMLIAAoAgBBzABqIQJBAyEADAILQds5QTlB3iQQlAUACyAAKAIAQdQAaiECQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtuAQJ/IwBBIGsiASQAIAAoAAghABCFBSECIAFBGGogAEH//wNxNgIAIAFBEGogAEEYdjYCACABQRRqIABBEHZB/wFxNgIAIAFBATYCDCABQoKAgIDAADcCBCABIAI2AgBB+TUgARA8IAFBIGokAAuIIQIMfwF+IwBBsARrIgIkAAJAAkACQCAAQQNxDQACQCABQfAATQ0AIAIgADYCqAQCQAJAIAAoAgBBxMrZmwVHDQAgACgCBEGK3KWJf0YNAQsgAkLoBzcDkARBvQogAkGQBGoQPEGYeCEADAQLAkACQCAAKAIIIgNBgICAeHFBgICAEEcNACADQYCA/AdxQYCAFEkNAQtBniZBABA8IAAoAAghABCFBSEBIAJB8ANqQRhqIABB//8DcTYCACACQfADakEQaiAAQRh2NgIAIAJBhARqIABBEHZB/wFxNgIAIAJBATYC/AMgAkKCgICAwAA3AvQDIAIgATYC8ANB+TUgAkHwA2oQPCACQpoINwPgA0G9CiACQeADahA8QeZ3IQAMBAtBACEEIABBIGohBUEAIQMDQCADIQMgBCEGAkACQAJAIAUiBSgCACIEIAFNDQBB6QchA0GXeCEEDAELAkAgBSgCBCIHIARqIAFNDQBB6gchA0GWeCEEDAELAkAgBEEDcUUNAEHrByEDQZV4IQQMAQsCQCAHQQNxRQ0AQewHIQNBlHghBAwBCyADRQ0BIAVBeGoiB0EEaigCACAHKAIAaiAERg0BQfIHIQNBjnghBAsgAiADNgLQAyACIAUgAGs2AtQDQb0KIAJB0ANqEDwgBiEHIAQhCAwECyADQQhLIgchBCAFQQhqIQUgA0EBaiIGIQMgByEHIAZBCkcNAAwDCwALQZ7UAEHbOUHHAEGsCBCZBQALQdTPAEHbOUHGAEGsCBCZBQALIAghAwJAIAdBAXENACADIQAMAQsCQCAAQTRqLQAAQQdxRQ0AIAJC84eAgIAGNwPAA0G9CiACQcADahA8QY14IQAMAQsgACAAKAIwaiIFIAUgACgCNGoiBEkhBwJAAkAgBSAESQ0AIAchBCADIQcMAQsgByEGIAMhCCAFIQkDQCAIIQMgBiEEAkACQCAJIgYpAwAiDkL/////b1gNAEELIQUgAyEDDAELAkACQCAOQv///////////wCDQoCAgICAgID4/wBYDQBBkwghA0HtdyEHDAELIAJBoARqIA6/EI0DQQAhBSADIQMgAikDoAQgDlENAUGUCCEDQex3IQcLIAJBMDYCtAMgAiADNgKwA0G9CiACQbADahA8QQEhBSAHIQMLIAQhBCADIgMhBwJAIAUODAACAgICAgICAgICAAILIAZBCGoiBCAAIAAoAjBqIAAoAjRqSSIFIQYgAyEIIAQhCSAFIQQgAyEHIAUNAAsLIAchAwJAIARBAXFFDQAgAyEADAELAkAgAEEkaigCAEGA6jBJDQAgAkKjiICAgAY3A6ADQb0KIAJBoANqEDxB3XchAAwBCyAAIAAoAiBqIgUgBSAAKAIkaiIESSEHAkACQCAFIARJDQAgByEBQTAhBSADIQMMAQsCQAJAAkACQCAFLwEIIAUtAApPDQAgByEKQTAhCwwBCyAFQQpqIQggBSEFIAAoAighBiADIQkgByEEA0AgBCEMIAkhDSAGIQYgCCEKIAUiAyAAayEJAkAgAygCACIFIAFNDQAgAiAJNgL0ASACQekHNgLwAUG9CiACQfABahA8IAwhASAJIQVBl3ghAwwFCwJAIAMoAgQiBCAFaiIHIAFNDQAgAiAJNgKEAiACQeoHNgKAAkG9CiACQYACahA8IAwhASAJIQVBlnghAwwFCwJAIAVBA3FFDQAgAiAJNgKUAyACQesHNgKQA0G9CiACQZADahA8IAwhASAJIQVBlXghAwwFCwJAIARBA3FFDQAgAiAJNgKEAyACQewHNgKAA0G9CiACQYADahA8IAwhASAJIQVBlHghAwwFCwJAAkAgACgCKCIIIAVLDQAgBSAAKAIsIAhqIgtNDQELIAIgCTYClAIgAkH9BzYCkAJBvQogAkGQAmoQPCAMIQEgCSEFQYN4IQMMBQsCQAJAIAggB0sNACAHIAtNDQELIAIgCTYCpAIgAkH9BzYCoAJBvQogAkGgAmoQPCAMIQEgCSEFQYN4IQMMBQsCQCAFIAZGDQAgAiAJNgL0AiACQfwHNgLwAkG9CiACQfACahA8IAwhASAJIQVBhHghAwwFCwJAIAQgBmoiB0GAgARJDQAgAiAJNgLkAiACQZsINgLgAkG9CiACQeACahA8IAwhASAJIQVB5XchAwwFCyADLwEMIQUgAiACKAKoBDYC3AICQCACQdwCaiAFEKEDDQAgAiAJNgLUAiACQZwINgLQAkG9CiACQdACahA8IAwhASAJIQVB5HchAwwFCwJAIAMtAAsiBUEDcUECRw0AIAIgCTYCtAIgAkGzCDYCsAJBvQogAkGwAmoQPCAMIQEgCSEFQc13IQMMBQsgDSEEAkAgBUEFdMBBB3UgBUEBcWsgCi0AAGpBf0oiBQ0AIAIgCTYCxAIgAkG0CDYCwAJBvQogAkHAAmoQPEHMdyEECyAEIQ0gBUUNAiADQRBqIgUgACAAKAIgaiAAKAIkaiIGSSEEAkAgBSAGSQ0AIAQhAQwECyAEIQogCSELIANBGmoiDCEIIAUhBSAHIQYgDSEJIAQhBCADQRhqLwEAIAwtAABPDQALCyACIAsiAzYC5AEgAkGmCDYC4AFBvQogAkHgAWoQPCAKIQEgAyEFQdp3IQMMAgsgDCEBCyAJIQUgDSEDCyADIQcgBSEIAkAgAUEBcUUNACAHIQAMAQsCQCAAQdwAaigCACIBIAAgACgCWGoiBWpBf2otAABFDQAgAiAINgLUASACQaMINgLQAUG9CiACQdABahA8Qd13IQAMAQsCQCAAQcwAaigCACIDQQBMDQAgACAAKAJIaiIEIANqIQYgBCEDA0ACQCADIgMoAgAiBCABSQ0AIAIgCDYCxAEgAkGkCDYCwAFBvQogAkHAAWoQPEHcdyEADAMLAkAgAygCBCAEaiIEIAFJDQAgAiAINgK0ASACQZ0INgKwAUG9CiACQbABahA8QeN3IQAMAwsCQCAFIARqLQAADQAgA0EIaiIEIQMgBCAGTw0CDAELCyACIAg2AqQBIAJBngg2AqABQb0KIAJBoAFqEDxB4nchAAwBCwJAIABB1ABqKAIAIgNBAEwNACAAIAAoAlBqIgQgA2ohBiAEIQMDQAJAIAMiAygCACIEIAFJDQAgAiAINgKUASACQZ8INgKQAUG9CiACQZABahA8QeF3IQAMAwsCQCADKAIEIARqIAFPDQAgA0EIaiIEIQMgBCAGTw0CDAELCyACIAg2AoQBIAJBoAg2AoABQb0KIAJBgAFqEDxB4HchAAwBCwJAAkAgACAAKAJAaiIBIAEgAEHEAGooAgBqSSIDDQAgAyENIAchAQwBCyADIQQgByEHIAEhBgNAIAchDSAEIQogBiIJLwEAIgQhAQJAIAAoAlwiBiAESw0AIAIgCDYCdCACQaEINgJwQb0KIAJB8ABqEDwgCiENQd93IQEMAgsCQANAAkAgASIBIARrQcgBSSIHDQAgAiAINgJkIAJBogg2AmBBvQogAkHgAGoQPEHedyEBDAILAkAgBSABai0AAEUNACABQQFqIgMhASADIAZJDQELCyANIQELIAEhAQJAIAdFDQAgCUECaiIDIAAgACgCQGogACgCRGoiCUkiDSEEIAEhByADIQYgDSENIAEhASADIAlPDQIMAQsLIAohDSABIQELIAEhAQJAIA1BAXFFDQAgASEADAELAkACQCAAIAAoAjhqIgMgAyAAQTxqKAIAakkiBQ0AIAUhCSAIIQUgASEDDAELIAUhBCABIQcgAyEGA0AgByEDIAQhCCAGIgEgAGshBQJAAkACQCABKAIAQRx2QX9qQQFNDQBBkAghA0HwdyEHDAELIAEvAQQhByACIAIoAqgENgJcQQEhBCADIQMgAkHcAGogBxChAw0BQZIIIQNB7nchBwsgAiAFNgJUIAIgAzYCUEG9CiACQdAAahA8QQAhBCAHIQMLIAMhAwJAIARFDQAgAUEIaiIBIAAgACgCOGogACgCPGoiCEkiCSEEIAMhByABIQYgCSEJIAUhBSADIQMgASAITw0CDAELCyAIIQkgBSEFIAMhAwsgAyEBIAUhAwJAIAlBAXFFDQAgASEADAELIAAvAQ4iBUEARyEEAkACQCAFDQAgBCEJIAMhBiABIQEMAQsgACAAKAJgaiENIAQhBSABIQRBACEHA0AgBCEGIAUhCCANIAciBUEEdGoiASAAayEDAkACQAJAIAFBEGogACAAKAJgaiAAKAJkIgRqSQ0AQbIIIQFBznchBwwBCwJAAkACQCAFDgIAAQILAkAgASgCBEHz////AUYNAEGnCCEBQdl3IQcMAwsgBUEBRw0BCyABKAIEQfL///8BRg0AQagIIQFB2HchBwwBCwJAIAEvAQpBAnQiByAESQ0AQakIIQFB13chBwwBCwJAIAEvAQhBA3QgB2ogBE0NAEGqCCEBQdZ3IQcMAQsgAS8BACEEIAIgAigCqAQ2AkwCQCACQcwAaiAEEKEDDQBBqwghAUHVdyEHDAELAkAgAS0AAkEOcUUNAEGsCCEBQdR3IQcMAQsCQAJAIAEvAQhFDQAgDSAHaiEMIAYhCUEAIQoMAQtBASEEIAMhAyAGIQcMAgsDQCAJIQcgDCAKIgpBA3RqIgMvAQAhBCACIAIoAqgENgJIIAMgAGshBgJAAkAgAkHIAGogBBChAw0AIAIgBjYCRCACQa0INgJAQb0KIAJBwABqEDxBACEDQdN3IQQMAQsCQAJAIAMtAARBAXENACAHIQcMAQsCQAJAAkAgAy8BBkECdCIDQQRqIAAoAmRJDQBBrgghBEHSdyELDAELIA0gA2oiBCEDAkAgBCAAIAAoAmBqIAAoAmRqTw0AA0ACQCADIgMvAQAiBA0AAkAgAy0AAkUNAEGvCCEEQdF3IQsMBAtBrwghBEHRdyELIAMtAAMNA0EBIQkgByEDDAQLIAIgAigCqAQ2AjwCQCACQTxqIAQQoQMNAEGwCCEEQdB3IQsMAwsgA0EEaiIEIQMgBCAAIAAoAmBqIAAoAmRqSQ0ACwtBsQghBEHPdyELCyACIAY2AjQgAiAENgIwQb0KIAJBMGoQPEEAIQkgCyEDCyADIgQhB0EAIQMgBCEEIAlFDQELQQEhAyAHIQQLIAQhBwJAIAMiA0UNACAHIQkgCkEBaiILIQogAyEEIAYhAyAHIQcgCyABLwEITw0DDAELCyADIQQgBiEDIAchBwwBCyACIAM2AiQgAiABNgIgQb0KIAJBIGoQPEEAIQQgAyEDIAchBwsgByEBIAMhBgJAIARFDQAgBUEBaiIDIAAvAQ4iCEkiCSEFIAEhBCADIQcgCSEJIAYhBiABIQEgAyAITw0CDAELCyAIIQkgBiEGIAEhAQsgASEBIAYhAwJAIAlBAXFFDQAgASEADAELAkAgAEHsAGooAgAiBUUNAAJAAkAgACAAKAJoaiIEKAIIIAVNDQAgAiADNgIEIAJBtQg2AgBBvQogAhA8QQAhA0HLdyEADAELAkAgBBDJBCIFDQBBASEDIAEhAAwBCyACIAAoAmg2AhQgAiAFNgIQQb0KIAJBEGoQPEEAIQNBACAFayEACyAAIQAgA0UNAQtBACEACyACQbAEaiQAIAALXgECfyMAQRBrIgIkAAJAAkAgAC8BBCIDIAAvAQZPDQAgASgCpAEhASAAIANBAWo7AQQgASADai0AACEADAELIAJBCGogAUHkABCCAUEAIQALIAJBEGokACAAQf8BcQslAAJAIAAtAEYNAEF/DwsgAEEAOgBGIAAgAC0ABkEQcjoABkEACywAIAAgAToARwJAIAENACAALQBGRQ0AIABBADoARiAAIAAtAAZBEHI6AAYLCz4AIAAoAtwBECIgAEH6AWpCADcBACAAQfQBakIANwIAIABB7AFqQgA3AgAgAEHkAWpCADcCACAAQgA3AtwBC7ICAQR/AkAgAQ0AQQAPCwJAIAFBgIAETw0AAkAgAC8B4AEiAg0AIAJBAEcPCyAAKALcASEDQQAhBAJAA0ACQCADIAQiBEECdGoiBS8BACABRw0AIAUgBUEEaiACIARBf3NqQQJ0ELcFGiAALwHgASICQQJ0IAAoAtwBIgNqQXxqQQA7AQAgAEH6AWpCADcBACAAQfIBakIANwEAIABB6gFqQgA3AQAgAEIANwHiAQJAIAINAEEBDwtBACEEA0ACQCADIAQiBEECdGovAQAiBUUNACAAIAVBH3FqQeIBaiIFLQAADQAgBSAEQQFqOgAACyAEQQFqIgUhBEEBIQEgBSACRw0ADAMLAAsgBEEBaiIFIQQgBSACRw0AC0EAIQELIAEPC0HzN0G0PEHUAEG+DxCZBQALJAACQCAAKAKoAUUNACAAQQQQqgMPCyAAIAAtAAdBgAFyOgAHC+QCAQd/AkAgAC0AR0UNAAJAIAAtAAdBAnFFDQAgACgC3AEhAiAALwHgASIDIQRBACEFAkAgA0UNAEEAIQZBACEDA0AgAyEDAkACQCACIAYiBkECdGoiBy0AAkEBcUUNACADIQMMAQsgAiADQQJ0aiAHKAEANgEAIANBAWohAwsgAC8B4AEiByEEIAMiAyEFIAZBAWoiCCEGIAMhAyAIIAdJDQALCyACIAUiA0ECdGpBACAEIANrQQJ0ELgFGiAAQfoBakIANwEAIABB8gFqQgA3AQAgAEHqAWpCADcBACAAQgA3AeIBIAAvAeABIgdFDQAgACgC3AEhCEEAIQMDQAJAIAggAyIDQQJ0ai8BACIGRQ0AIAAgBkEfcWpB4gFqIgYtAAANACAGIANBAWo6AAALIANBAWoiBiEDIAYgB0cNAAsLIABBADoAByAAQQA2AtgBIAAtAEYNACAAIAE6AEYgABBiCwvPBAEKfwJAIAFBgIAETw0AAkAgAQ0AQX4PCwJAAkACQCAALwHgASIDRQ0AIANBAnQgACgC3AEiBGpBfGovAQANACAEIQQgAyEDDAELQX8hBSADQe8BSw0BIANBAXQiA0HoASADQegBSRtBCGoiA0ECdBAhIAAoAtwBIAAvAeABQQJ0ELYFIQQgACgC3AEQIiAAIAM7AeABIAAgBDYC3AEgBCEEIAMhAwsgBCEGIAMiB0EBIAdBAUsbIQhBACEDQQAhBAJAA0AgBCEEAkACQAJAIAYgAyIFQQJ0aiIDLwEAIglFDQAgCSABc0EfcSEKAkACQCAEQQFxRQ0AIAoNAQsCQCAKRQ0AQQEhC0EAIQwgCkUhCgwEC0EBIQtBACEMQQEhCiAJIAFJDQMLAkAgCSABRw0AIAMtAAIgAkcNAEEAIQtBASEMDAILIANBBGogAyAHIAVBf3NqQQJ0ELcFGgsgAyABOwEAIAMgAjoAAkEAIQtBBCEMCyAEIQoLIAohBCAMIQMgC0UNASAFQQFqIgUhAyAEIQQgBSAIRw0AC0EEIQMLQQAhBSADQQRHDQAgAEIANwHiASAAQfoBakIANwEAIABB8gFqQgA3AQAgAEHqAWpCADcBAAJAIAAvAeABIgENAEEBDwsgACgC3AEhCUEAIQMDQAJAIAkgAyIDQQJ0ai8BACIERQ0AIAAgBEEfcWpB4gFqIgQtAAANACAEIANBAWo6AAALIANBAWoiBCEDQQEhBSAEIAFHDQALCyAFDwtB8zdBtDxBgwFBpw8QmQUAC7YHAgt/AX4jAEEQayIBJAACQCAALAAHQX9KDQAgAEEEEKoDCwJAIAAoAqgBIgJFDQAgAiECQYCACCEDAkADQCACIQIgA0F/aiIERQ0BIAAtAEYNAgJAAkAgAC0AR0UNAAJAIAAtAEhFDQAgAEEAOgBIDAELIAAgAi8BBCIFQR9xakHiAWotAAAiA0UNACAAKALcASIGIANBf2oiA0ECdGovAQAiByEIIAMhAyAFIAdJDQADQCADIQMCQCAFIAhB//8DcUcNAAJAIAYgA0ECdGotAAJBAXFFDQAgACgC2AEgAkcNASAAQQgQqgMMBAsgAEEBEKoDDAMLIAYgA0EBaiIDQQJ0ai8BACIHIQggAyEDIAUgB08NAAsLAkACQCACLwEEIgMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIIBQQAhAwsgAyIDQf8BcSEGAkAgA8BBf0oNACABIAZB8H5qEI4DAkAgAC0AQiICQQpJDQAgAUEIaiAAQeUAEIIBDAILIAEpAwAhDCAAIAJBAWo6AEIgACACQQN0akHQAGogDDcDAAwBCwJAIAZB3wBJDQAgAUEIaiAAQeYAEIIBDAELAkAgBkHA9wBqLQAAIglBIHFFDQAgACACLwEEIgNBf2o7AUACQAJAIAMgAi8BBk8NACAAKAKkASEFIAIgA0EBajsBBCAFIANqLQAAIQMMAQsgAUEIaiAAQeQAEIIBQQAhAwsCQAJAIANB/wFxIgpB+AFPDQAgCiEDDAELIApBA3EhC0EAIQVBACEIA0AgCCEIIAUhAwJAAkAgAi8BBCIFIAIvAQZPDQAgACgCpAEhByACIAVBAWo7AQQgByAFai0AACEHDAELIAFBCGogAEHkABCCAUEAIQcLIANBAWohBSAIQQh0IAdB/wFxciIHIQggAyALRw0AC0EAIAdrIAcgCkEEcRshAwsgACADNgJMCyAAIAAtAEI6AEMCQAJAIAlBEHFFDQAgAiAAQaD4ACAGQQJ0aigCABECACAALQBCRQ0BIAFBCGogAEHnABCCAQwBCyABIAIgAEGg+AAgBkECdGooAgARAQACQCAALQBCIgJBCkkNACABQQhqIABB5QAQggEMAQsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMACyAALQBFRQ0AIAAQhAMLIAAoAqgBIgUhAiAEIQMgBQ0ADAILAAsgAEHh1AMQgQELIAFBEGokAAskAQF/QQAhAQJAIABBpwFLDQAgAEECdEGg8gBqKAIAIQELIAELywIBA38jAEEQayIDJAAgAyAAKAIANgIMAkACQAJAIANBDGogARChAw0AIAINAUEAIQEMAgsgAUH//wBxIQQCQAJAAkACQAJAIAFBDnZBA3EOBAECAwABC0EAIQEgACgCACIFIAUoAkhqIARBA3RqIQQMAwtBACEBIAAoAgAiBSAFKAJQaiAEQQN0aiEEDAILIARBAnRBoPIAaigCACEBQQAhBAwBCyAAKAIAIgEgASgCWGogASABKAJAaiAEQQF0ai8BAGohAUEAIQQLIAEhBQJAIAQiAUUNAAJAIAJFDQAgAiABKAIENgIACyAAKAIAIgAgACgCWGogASgCAGohAQwCCwJAIAVFDQACQCACDQAgBSEBDAMLIAIgBRDlBTYCACAFIQEMAgtBtDxBuQJBlssAEJQFAAsgAkEANgIAQQAhAQsgA0EQaiQAIAELSwEBfyMAQRBrIgMkACADIAAoAqQBNgIEIANBBGogASACEK4DIgEhAgJAIAENACADQQhqIABB6AAQggFB+NoAIQILIANBEGokACACC1ABAX8jAEEQayIEJAAgBCABKAKkATYCDAJAAkAgBEEMaiACQQ50IANyIgEQoQMNACAAQgA3AwAMAQsgACABNgIAIABBBDYCBAsgBEEQaiQACwwAIAAgAkHyABCCAQsOACAAIAIgAigCTBDbAgs1AAJAIAEtAEJBAUYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQBBABB1Ggs1AAJAIAEtAEJBAkYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQFBABB1Ggs1AAJAIAEtAEJBA0YNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQJBABB1Ggs1AAJAIAEtAEJBBEYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQNBABB1Ggs1AAJAIAEtAEJBBUYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQRBABB1Ggs1AAJAIAEtAEJBBkYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQVBABB1Ggs1AAJAIAEtAEJBB0YNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQZBABB1Ggs1AAJAIAEtAEJBCEYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQdBABB1Ggs1AAJAIAEtAEJBCUYNAEGbzABB7TpBzQBB8sYAEJkFAAsgAUEAOgBCIAEoAqwBQQhBABB1Ggv2AQIDfwF+IwBB0ABrIgIkACACQcgAaiABEI8EIAJBwABqIAEQjwQgASgCrAFBACkD0HE3AyAgASACKQNINwMwIAIgAikDQDcDMAJAIAEgAkEwahDCAiIDRQ0AIAIgAikDSDcDKAJAIAEgAkEoahDzAiIEDQAgAiACKQNINwMgIAJBOGogASACQSBqEPoCIAIgAikDOCIFNwNIIAIgBTcDGCABIAJBGGoQjQELIAIgAikDSDcDEAJAIAEgAyACQRBqELECDQAgASgCrAFBACkDyHE3AyALIAQNACACIAIpA0g3AwggASACQQhqEI4BCyACQdAAaiQAC14BAn8jAEEQayICJAAgASgCrAEhAyACQQhqIAEQjwQgAyACKQMINwMgIAMgABB4AkAgAS0AR0UNACABKALYASAARw0AIAEtAAdBCHFFDQAgAUEIEKoDCyACQRBqJAALYgEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIIBQQAhBAsCQCAEIgFFDQAgACABOwEECyACQRBqJAALhQEBBH8jAEEgayICJAAgAkEQaiABEI8EIAIgAikDEDcDCCABIAJBCGoQkwMhAwJAAkAgACgCECgCACABKAJMIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEYaiABQekAEIIBQQAhBQsCQCAFIgFFIANyDQAgACABOwEECyACQSBqJAALjwEBAX8jAEEwayIDJAAgA0EoaiACEI8EIANBIGogAhCPBAJAIAMoAiRBj4DA/wdxDQAgAygCIEGgf2pBJ0sNACADIAMpAyA3AxAgA0EYaiACIANBEGpB2AAQwAIgAyADKQMYNwMgCyADIAMpAyg3AwggAyADKQMgNwMAIAAgAiADQQhqIAMQvAIgA0EwaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqQBNgIMAkACQCADQQxqIARBgIABciIEEKEDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEKgCIQQgAyADKQMQNwMAIAAgAiAEIAMQyQIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEI8EAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQjwQCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQjwQgARCQBCEDIAEQkAQhBCACQRBqIAFBARCSBAJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA+BxNwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQjwQgAyADKQMYNwMQAkACQAJAIANBEGoQ9AINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEJEDEI0DCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQjwQgA0EQaiACEI8EIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxDNAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQjwQgAkEgaiABEI8EIAJBGGogARCPBCACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEM4CIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEI8EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBChAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDLAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEI8EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBChAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDLAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEI8EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBChAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDLAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBChAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBABCoAiEEIAMgAykDEDcDACAAIAIgBCADEMkCIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBChAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBFRCoAiEEIAMgAykDEDcDACAAIAIgBCADEMkCIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQqAIQjwEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQkAMgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEJAEIgMQkQEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQkAMgAyACKQMINwMgIAJBEGokAAtQAQN/IwBBEGsiAiQAAkAgASABEJAEIgMQkgEiBA0AIAEgA0EMahBTCyABKAKsASEDIAJBCGogAUEIIAQQkAMgAyACKQMINwMgIAJBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKACkAUE8aigCAEEDdiACKAJMIgRLDQAgA0EIaiACQfkAEIIBIABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALaQECfyMAQRBrIgMkACACKAJMIQQgAyAC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IQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQngMhAgsgACACEI8DIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCPBCACQRhqIgQgAykDGDcDACADQRhqIAIQjwQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQkQM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJEDIgY5AwAgAisDICAGZSECDAELIAUoAgAgBCgCAEwhAgsgACACEI8DIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCPBCACQRhqIgQgAykDGDcDACADQRhqIAIQjwQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQkQM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJEDIgY5AwAgAisDICAGYyECDAELIAUoAgAgBCgCAEghAgsgACACEI8DIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQngNBAXMhAgsgACACEI8DIANBIGokAAs+AQF/IwBBEGsiAyQAIANBCGogAhCPBCADIAMpAwg3AwAgAEHI8QBB0PEAIAMQnAMbKQMANwMAIANBEGokAAviAQEFfyMAQRBrIgIkACACQQhqIAEQjwQCQAJAIAEQkQQiA0EBTg0AQQAhAwwBCwJAAkAgAA0AIAAhAyAAQQBHIQQMAQsgACEFIAMhBgNAIAYhACAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSAAQX9qIQYgAyEDIAQhBCAAQQFKDQALCyADIQBBACEDIARFDQAgACABKAJMIgNBA3RqQRhqQQAgAyAAKAIQLwEISRshAwsCQAJAIAMiAw0A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aiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQnQMhAgsgACACEI8DIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQnQNBAXMhAgsgACACEI8DIANBIGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCPBCABKAKsASACKQMINwMgIAJBEGokAAsuAQF/AkAgAigCTCIDIAIoAqQBLwEOSQ0AIAAgAkGAARCCAQ8LIAAgAiADELMCCz8BAX8CQCABLQBCIgINACAAIAFB7AAQggEPCyABIAJBf2oiAjoAQiAAIAEgAkH/AXFBA3RqQdAAaikDADcDAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQkgMhACABQRBqJAAgAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQkgMhACABQRBqJAAgAAuJAgICfwF+IwBBwABrIgMkAAJAAkAgAS0AQiIEDQAgA0E4aiABQewAEIIBDAELIAEgBEF/aiIEOgBCIAMgASAEQf8BcUEDdGpB0ABqKQMANwM4CyADIAMpAzg3AygCQAJAIAEgA0EoahCUAw0AAkAgAkECcUUNACADIAMpAzg3AyAgASADQSBqEPMCDQELIAMgAykDODcDGCADQTBqIAFBEiADQRhqEIkDQgAhBQwBCwJAIAJBAXFFDQAgAyADKQM4NwMQIAEgA0EQahCVAw0AIAMgAykDODcDCCADQTBqIAFBohwgA0EIahCK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AkQAAMD////fQWQNAAJAAkAgAkQAAAAAAADgP6AiAplEAAAAAAAA4EFjRQ0AIAKqIQEMAQtBgICAgHghAQsgASEBCyAAIAMgARDhBAv4AQACQCABQQhJDQAgACABIAK3EOAEDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4ICAABAgMEBQYHCyAAIAJB//8DIAJB//8DSBsiAUEAIAFBAEobOwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBjTpBrgFBz8sAEJQFAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALuwMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDiBLchAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0GNOkHKAUHjywAQlAUAC0GAgICAeCEBCyABC6ABAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQ4gS3IQMLIAMhAwJAIAFBEE8NACADDwsg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AgggBCABNgIEIAQgADYCAEHwFiAEEDwQHQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwv5CgELfyMAQcAAayIEJAAgACABaiEFIARBf2ohBiAEQQFyIQcgBEECciEIIABBAEchCSACIQEgAyEKIAIhAiAAIQMDQCADIQMgAiECIAohCyABIgpBAWohAQJAAkAgCi0AACIMQSVGDQAgDEUNACABIQEgCyEKIAIhAkEBIQwgAyEDDAELAkACQCACIAFHDQAgAyEDDAELIAJBf3MgAWohDQJAIAUgA2siDkEBSA0AIAMgAiANIA5Bf2ogDiANShsiDhC2BSAOakEAOgAACyADIA1qIQMLIAMhDQJAIAwNACABIQEgCyEKIAIhAkEAIQwgDSEDDAELAkACQCABLQAAQS1GDQAgASEBQQAhAgwBCyAKQQJqIAEgCi0AAkHzAEYiAhshASACIAlxIQILIAIhAiABIg4sAAAhASAEQQA6AAECQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCALKAIAOgAAIAtBBGohAgwMCyAEIQICQAJAIAsoAgAiAUF/TA0AIAEhASACIQIMAQsgBEEtOgAAQQAgAWshASAHIQILIAtBBGohCyACIgwhAiABIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAwgDBDlBWpBf2oiAyECIAwhASADIAxNDQoDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAsLAAsgBCECIAsoAgAhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgC0EEaiEMIAYgBBDlBWoiAyECIAQhASADIARNDQgDQCABIgEtAAAhAyABIAIiAi0AADoAACACIAM6AAAgAkF/aiIDIQIgAUEBaiIKIQEgCiADSQ0ADAkLAAsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAkLIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwICyAEIAtBB2pBeHEiASsDAEEIEJwFIAFBCGohAgwHCyALKAIAIgFBkdYAIAEbIgMQ5QUhAQJAIAUgDWsiCkEBSA0AIA0gAyABIApBf2ogCiABShsiChC2BSAKakEAOgAACyALQQRqIQogBEEAOgAAIA0gAWohASACRQ0DIAMQIgwDCyAEIAE6AAAMAQsgBEE/OgAACyALIQIMAwsgCiECIAEhAQwDCyAMIQIMAQsgCyECCyANIQELIAIhAiAEEOUFIQMCQCAFIAEiC2siAUEBSA0AIAsgBCADIAFBf2ogASADShsiARC2BSABakEAOgAACyAOQQFqIgwhASACIQogDCECQQEhDCALIANqIQMLIAEhASAKIQogAiECIAMiCyEDIAwNAAsgBEHAAGokACALIABrQQFqC+0IAwN+CH8BfAJAAkAgAUQAAAAAAAAAAGMNACABIQEgACEADAELIABBLToAACABmiEBIABBAWohAAsgACEAAkAgASIBvUL///////////8AgyIDQoGAgICAgID4/wBUDQAgAEHOwrkCNgAADwsCQCADQoCAgICAgID4/wBSDQAgAEHp3JkDNgAADwsCQCABRLDKbkftiRAAY0UNACAAQTA7AAAPCyACQQQgAkEEShsiAkEPSSEGIAFEje21oPfGsD5jIQcCQAJAIAEQzgUiDplEAAAAAAAA4EFjRQ0AIA6qIQgMAQtBgICAgHghCAsgCCEIIAJBDyAGGyECAkACQCAHDQAgAURQ7+LW5BpLRGQNACAIIQZBASEH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AS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQtgUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAKs8gFFDQBBACgCrPIBELsFIQELAkBBACgCoNQBRQ0AQQAoAqDUARC7BSABciEBCwJAENEFKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABC5BSECCwJAIAAoAhQgACgCHEYNACAAELsFIAFyIQELAkAgAkUNACAAELoFCyAAKAI4IgANAAsLENIFIAEPC0EAIQICQCAAKAJMQQBIDQAgABC5BSECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEGABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoERAAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQugULIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQvQUhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBUIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAFQQEgBmuthiEDDAELIAVC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBEIAUw0AA0AgB0F/aiEHIARCAYYiBEJ/VQ0ACwsgAkEBIAdrrYYhAgwBCyACQv////////8Hg0KAgICAgICACIQhAgsCQCAGIAdMDQADQAJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCyADQgGGIQMgBkF/aiIGIAdKDQALIAchBgsCQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsCQAJAIANC/////////wdYDQAgAyEEDAELA0AgBkF/aiEGIANCgICAgICAgARUIQcgA0IBhiIEIQMgBw0ACwsgBUKAgICAgICAgIB/gyEDAkACQCAGQQFIDQAgBEKAgICAgICAeHwgBq1CNIaEIQQMAQsgBEEBIAZrrYghBAsgBCADhL8LBQAgAL0LDgAgACgCPCABIAIQzwUL5QIBB38jAEEgayIDJAAgAyAAKAIcIgQ2AhAgACgCFCEFIAMgAjYCHCADIAE2AhggAyAFIARrIgE2AhQgASACaiEGIANBEGohBEECIQcCQAJAAkACQAJAIAAoAjwgA0EQakECIANBDGoQFBD2BUUNACAEIQUMAQsDQCAGIAMoAgwiAUYNAgJAIAFBf0oNACAEIQUMBAsgBCABIAQoAgQiCEsiCUEDdGoiBSAFKAIAIAEgCEEAIAkbayIIajYCACAEQQxBBCAJG2oiBCAEKAIAIAhrNgIAIAYgAWshBiAFIQQgACgCPCAFIAcgCWsiByADQQxqEBQQ9gVFDQALCyAGQX9HDQELIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhAgAiEBDAELQQAhASAAQQA2AhwgAEIANwMQIAAgACgCAEEgcjYCACAHQQJGDQAgAiAFKAIEayEBCyADQSBqJAAgAQsMACAAKAI8ELUFEBILgQEBAn8gACAAKAJIIgFBf2ogAXI2AkgCQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEGABoLIABBADYCHCAAQgA3AxACQCAAKAIAIgFBBHFFDQAgACABQSByNgIAQX8PCyAAIAAoAiwgACgCMGoiAjYCCCAAIAI2AgQgAUEbdEEfdQtcAQF/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCACIBQQhxRQ0AIAAgAUEgcjYCAEF/DwsgAEIANwIEIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhBBAAvOAQEDfwJAAkAgAigCECIDDQBBACEEIAIQwgUNASACKAIQIQMLAkAgAyACKAIUIgVrIAFPDQAgAiAAIAEgAigCJBEGAA8LAkACQCACKAJQQQBODQBBACEDDAELIAEhBANAAkAgBCIDDQBBACEDDAILIAAgA0F/aiIEai0AAEEKRw0ACyACIAAgAyACKAIkEQYAIgQgA0kNASAAIANqIQAgASADayEBIAIoAhQhBQsgBSAAIAEQtgUaIAIgAigCFCABajYCFCADIAFqIQQLIAQLWwECfyACIAFsIQQCQAJAIAMoAkxBf0oNACAAIAQgAxDDBSEADAELIAMQuQUhBSAAIAQgAxDDBSEAIAVFDQAgAxC6BQsCQCAAIARHDQAgAkEAIAEbDwsgACABbgsEAEEACwQAQQALAgALAgALJABEAAAAAAAA8L9EAAAAAAAA8D8gABsQygVEAAAAAAAAAACjCxUBAX8jAEEQayIBIAA5AwggASsDCAsMACAAIAChIgAgAKMLzgQDAX8CfgZ8IAAQzQUhAQJAIAC9IgJCgICAgICAgIlAfEL//////5/CAVYNAAJAIAJCgICAgICAgPg/Ug0ARAAAAAAAAAAADwsgAEQAAAAAAADwv6AiACAAIABEAAAAAAAAoEGiIgSgIAShIgQgBKJBACsDkIABIgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsD4IABoiAIQQArA9iAAaIgAEEAKwPQgAGiQQArA8iAAaCgoKIgCEEAKwPAgAGiIABBACsDuIABokEAKwOwgAGgoKCiIAhBACsDqIABoiAAQQArA6CAAaJBACsDmIABoKCgoiAAIAShIAWiIAAgBKCiIAYgACAHoaCgoKAPCwJAAkAgAUGQgH5qQZ+AfksNAAJAIAJC////////////AINCAFINAEEBEMkFDwsgAkKAgICAgICA+P8AUQ0BAkACQCABQYCAAnENACABQfD/AXFB8P8BRw0BCyAAEMsFDwsgAEQAAAAAAAAwQ6K9QoCAgICAgIDgfHwhAgsgAkKAgICAgICAjUB8IgNCNIentyIIQQArA9h/oiADQi2Ip0H/AHFBBHQiAUHwgAFqKwMAoCIJIAFB6IABaisDACACIANCgICAgICAgHiDfb8gAUHokAFqKwMAoSABQfCQAWorAwChoiIAoCIFIAAgACAAoiIEoiAEIABBACsDiIABokEAKwOAgAGgoiAAQQArA/h/okEAKwPwf6CgoiAEQQArA+h/oiAIQQArA+B/oiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB4r4laiICQRR2arciBUQAYJ9QE0TTP6IiBiACQf//P3FBnsGa/wNqrUIghiABQv////8Pg4S/RAAAAAAAAPC/oCIAIAAgAEQAAAAAAADgP6Ki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hwYgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EIcGIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhCHBiAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ/QVFDQAgAyAEEO0FIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEIcGIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ/wUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEP0FQQBKDQACQCABIAkgAyAKEP0FRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEIcGIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABCHBiAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQhwYgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEIcGIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABCHBiAFQThqKQMAIQIgBSkDMCEEDAEL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diEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKALg8gFBf2oiAUF/IAEbNgLg8gELCwcAPwBBEHQLVAECf0EAKAKk1AEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ+QVNDQAgABAVRQ0BC0EAIAA2AqTUASABDwsQswVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEPwFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahD8BUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ/AUgBUEwaiAKIAEgBxCGBiAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEPwFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEPwFIAUgAiAEQQEgBmsQhgYgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEIQGDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEIUGGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ/AVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahD8BSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABCIBiAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABCIBiAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABCIBiAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABCIBiAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABCIBiAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABCIBiAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABCIBiAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABCIBiAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABCIBiAFQZABaiADQg+GQgAgBEIAEIgGIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQiAYgBUGAAWpCASACfUIAIARCABCIBiAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEIgGIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEIgGIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQhgYgBUEwaiAWIBMgBkHwAGoQ/AUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8QiAYgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABCIBiAFIAMgDkIFQgAQiAYgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEPwFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEPwFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ/AUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ/AUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ/AVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ/AUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ/AUgBUEgaiACIAQgBhD8BSAFQRBqIBIgASAHEIYGIAUgAiAEIAcQhgYgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEPsFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahD8BSACIAAgBEGB+AAgA2sQhgYgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEGw9gUkA0Gw9gFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAERAACyUBAX4gACABIAKtIAOtQiCGhCAEEJYGIQUgBUIgiKcQjAYgBacLEwAgACABpyABQiCIpyACIAMQFgsL3tSBgAADAEGACAv4ygFpbmZpbml0eQAtSW5maW5pdHkAISBFeGNlcHRpb246IE91dE9mTWVtb3J5AGRldnNfdmVyaWZ5AGRldnNfanNvbl9zdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGRlbGF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBqZF93c3NrX25ldwBleHByMV9uZXcAZGV2c19qZF9zZW5kX3JhdwBpZGl2AHByZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAZGV2c19wYWNrZXRfc3BlY19wYXJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdAB3YWl0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uU2VydmVyUGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2luc3BlY3QAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX2luc3BlY3RfdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AQHZlcnNpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AbWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AZnJvbQByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAY2h1bmsAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAHN6IC0gMSA9PSBzLT5sZW5ndGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaAAhIHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAHN0YXRlLm9mZiA8IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAFJvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAFNlcnZlckludGVyZmFjZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABfc2VydmVyU2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABub3RJbXBsZW1lbnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAUGFja2V0U3BlYwBTZXJ2aWNlU3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvaW5zcGVjdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L2ltcGxfcGFja2V0c3BlYy5jAGRldmljZXNjcmlwdC9pbXBsX3NlcnZpY2VzcGVjLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW1BhY2tldFNwZWM6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtTZXJ2aWNlU3BlYzogJXNdAFtDaXJjdWxhcl0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOAB1dGYtOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABpZHggPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQAhIG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRF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aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AACe+YCAAARuYW1lAa54mQYADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNfZGV2c19wYW5pY19oYW5kbGVyBBFlbV9kZXBsb3lfaGFuZGxlcgUXZW1famRfY3J5cHRvX2dldF9yYW5kb20GDWVtX3NlbmRfZnJhbWUHBGV4aXQIC2VtX3RpbWVfbm93CQ5lbV9wcmludF9kbWVzZwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3D2FwcF9wcmludF9kbWVzZzgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwJYXBwX2RtZXNnPQtmbHVzaF9kbWVzZz4LYXBwX3Byb2Nlc3M/B3R4X2luaXRAD2pkX3BhY2tldF9yZWFkeUEKdHhfcHJvY2Vzc0IXamRfd2Vic29ja19zZW5kX21lc3NhZ2VDDmpkX3dlYnNvY2tfbmV3RAZvbm9wZW5FB29uZXJyb3JGB29uY2xvc2VHCW9ubWVzc2FnZUgQamRfd2Vic29ja19jbG9zZUkOZGV2c19idWZmZXJfb3BKEmRldnNfYnVmZmVyX2RlY29kZUsSZGV2c19idWZmZXJfZW5jb2RlTA9kZXZzX2NyZWF0ZV9jdHhNCXNldHVwX2N0eE4KZGV2c190cmFjZU8PZGV2c19lcnJvcl9jb2RlUBlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUQljbGVhcl9jdHhSDWRldnNfZnJlZV9jdHhTCGRldnNfb29tVAlkZXZzX2ZyZWVVEWRldnNjbG91ZF9wcm9jZXNzVhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFcUZGV2c2Nsb3VkX29uX21lc3NhZ2VYDmRldnNjbG91ZF9pbml0WRRkZXZzX3RyYWNrX2V4Y2VwdGlvbloPZGV2c2RiZ19wcm9jZXNzWxFkZXZzZGJnX3Jlc3RhcnRlZFwVZGV2c2RiZ19oYW5kbGVfcGFja2V0XQtzZW5kX3ZhbHVlc14RdmFsdWVfZnJvbV90YWdfdjBfGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVgDW9ial9nZXRfcHJvcHNhDGV4cGFuZF92YWx1ZWISZGV2c2RiZ19zdXNwZW5kX2NiYwxkZXZzZGJnX2luaXRkEGV4cGFuZF9rZXlfdmFsdWVlBmt2X2FkZGYPZGV2c21ncl9wcm9jZXNzZwd0cnlfcnVuaAxzdG9wX3Byb2dyYW1pD2RldnNtZ3JfcmVzdGFydGoUZGV2c21ncl9kZXBsb3lfc3RhcnRrFGRldnNtZ3JfZGVwbG95X3dyaXRlbBBkZXZzbWdyX2dldF9oYXNobRVkZXZzbWdyX2hhbmRsZV9wYWNrZXRuDmRlcGxveV9oYW5kbGVybxNkZXBsb3lfbWV0YV9oYW5kbGVycA9kZXZzbWdyX2dldF9jdHhxDmRldnNtZ3JfZGVwbG95cgxkZXZzbWdyX2luaXRzEWRldnNtZ3JfY2xpZW50X2V2dBZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb252GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXcQZGV2c19maWJlcl9zbGVlcHgbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseRpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3oRZGV2c19pbWdfZnVuX25hbWV7EmRldnNfaW1nX3JvbGVfbmFtZXwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBAQpkZXZzX3BhbmljggEVX2RldnNfaW52YWxpZF9wcm9ncmFtgwEPZGV2c19maWJlcl9wb2tlhAEWZGV2c19nY19vYmpfY2hlY2tfY29yZYUBE2pkX2djX2FueV90cnlfYWxsb2OGAQdkZXZzX2djhwEPZmluZF9mcmVlX2Jsb2NriAESZGV2c19hbnlfdHJ5X2FsbG9jiQEOZGV2c190cnlfYWxsb2OKAQtqZF9nY191bnBpbosBCmpkX2djX2ZyZWWMARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZI0BDmRldnNfdmFsdWVfcGlujgEQZGV2c192YWx1ZV91bnBpbo8BEmRldnNfbWFwX3RyeV9hbGxvY5ABGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5EBFGRldnNfYXJyYXlfdHJ5X2FsbG9jkgEVZGV2c19idWZmZXJfdHJ5X2FsbG9jkwEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlAEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSVAQ9kZXZzX2djX3NldF9jdHiWAQ5kZXZzX2djX2NyZWF0ZZcBD2RldnNfZ2NfZGVzdHJveZgBEWRldnNfZ2Nfb2JqX2NoZWNrmQELc2Nhbl9nY19vYmqaARFwcm9wX0FycmF5X2xlbmd0aJsBEm1ldGgyX0FycmF5X2luc2VydJwBEmZ1bjFfQXJyYXlfaXNBcnJheZ0BEG1ldGhYX0FycmF5X3B1c2ieARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WfARFtZXRoWF9BcnJheV9zbGljZaABEWZ1bjFfQnVmZmVyX2FsbG9joQEQZnVuMV9CdWZmZXJfZnJvbaIBEnByb3BfQnVmZmVyX2xlbmd0aKMBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6QBE21ldGgzX0J1ZmZlcl9maWxsQXSlARNtZXRoNF9CdWZmZXJfYmxpdEF0pgEUZGV2c19jb21wdXRlX3RpbWVvdXSnARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKgBF2Z1bjFfRGV2aWNlU2NyaXB0X2RlbGF5qQEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljqgEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qwEZZnVuMF9EZXZpY2VTY3JpcHRfcmVzdGFydKwBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdK0BF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50rgEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdK8BGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50sAEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKxAR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7IBGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7MBImZ1bjFfRGV2aWNlU2NyaXB0X2RldmljZUlkZW50aWZpZXK0AR1mdW4yX0RldmljZVNjcmlwdF9fc2VydmVyU2VuZLUBFG1ldGgxX0Vycm9yX19fY3Rvcl9ftgEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7cBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7gBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fuQEPcHJvcF9FcnJvcl9uYW1lugERbWV0aDBfRXJyb3JfcHJpbnS7AQ9wcm9wX0RzRmliZXJfaWS8ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkvQEUbWV0aDFfRHNGaWJlcl9yZXN1bWW+ARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0Zb8BGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmTAARFmdW4wX0RzRmliZXJfc2VsZsEBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0wgEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXDARJwcm9wX0Z1bmN0aW9uX25hbWXEAQ9mdW4yX0pTT05fcGFyc2XFARNmdW4zX0pTT05fc3RyaW5naWZ5xgEOZnVuMV9NYXRoX2NlaWzHAQ9mdW4xX01hdGhfZmxvb3LIAQ9mdW4xX01hdGhfcm91bmTJAQ1mdW4xX01hdGhfYWJzygEQZnVuMF9NYXRoX3JhbmRvbcsBE2Z1bjFfTWF0aF9yYW5kb21JbnTMAQ1mdW4xX01hdGhfbG9nzQENZnVuMl9NYXRoX3Bvd84BDmZ1bjJfTWF0aF9pZGl2zwEOZnVuMl9NYXRoX2ltb2TQAQ5mdW4yX01hdGhfaW11bNEBDWZ1bjJfTWF0aF9taW7SAQtmdW4yX21pbm1heNMBDWZ1bjJfTWF0aF9tYXjUARJmdW4yX09iamVjdF9hc3NpZ27VARBmdW4xX09iamVjdF9rZXlz1gETZnVuMV9rZXlzX29yX3ZhbHVlc9cBEmZ1bjFfT2JqZWN0X3ZhbHVlc9gBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m2QEdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3faARJwcm9wX0RzUGFja2V0X3JvbGXbAR5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXLcARVwcm9wX0RzUGFja2V0X3Nob3J0SWTdARpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleN4BHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmTfARNwcm9wX0RzUGFja2V0X2ZsYWdz4AEXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmThARZwcm9wX0RzUGFja2V0X2lzUmVwb3J04gEVcHJvcF9Ec1BhY2tldF9wYXlsb2Fk4wEVcHJvcF9Ec1BhY2tldF9pc0V2ZW505AEXcHJvcF9Ec1BhY2tldF9ldmVudENvZGXlARZwcm9wX0RzUGFja2V0X2lzUmVnU2V05gEWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldOcBFXByb3BfRHNQYWNrZXRfcmVnQ29kZegBFnByb3BfRHNQYWNrZXRfaXNBY3Rpb27pARVkZXZzX3BrdF9zcGVjX2J5X2NvZGXqARJkZXZzX2dldF9zcGVjX2NvZGXrARJwcm9wX0RzUGFja2V0X3NwZWPsARFkZXZzX3BrdF9nZXRfc3BlY+0BFW1ldGgwX0RzUGFja2V0X2RlY29kZe4BHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVk7wEYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW508AEWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZfEBFnByb3BfRHNQYWNrZXRTcGVjX2NvZGXyARpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZfMBGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGX0ARJkZXZzX3BhY2tldF9kZWNvZGX1ARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWT2ARREc1JlZ2lzdGVyX3JlYWRfY29udPcBEmRldnNfcGFja2V0X2VuY29kZfgBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGX5ARZwcm9wX0RzUGFja2V0SW5mb19yb2xl+gEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZfsBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGX8ARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/9ARNwcm9wX0RzUm9sZV9pc0JvdW5k/gEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k/wEicHJvcF9Ec1NlcnZpY2VTcGVjX2NsYXNzSWRlbnRpZmllcoACF3Byb3BfRHNTZXJ2aWNlU3BlY19uYW1lgQIabWV0aDFfRHNTZXJ2aWNlU3BlY19sb29rdXCCAhptZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnboMCEnByb3BfU3RyaW5nX2xlbmd0aIQCF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0hQITbWV0aDFfU3RyaW5nX2NoYXJBdIYCEm1ldGgyX1N0cmluZ19zbGljZYcCC2luc3BlY3Rfb2JqiAIGYWRkX2NoiQINaW5zcGVjdF9maWVsZIoCDGRldnNfaW5zcGVjdIsCFGRldnNfamRfZ2V0X3JlZ2lzdGVyjAIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZI0CEGRldnNfamRfc2VuZF9jbWSOAhBkZXZzX2pkX3NlbmRfcmF3jwITZGV2c19qZF9zZW5kX2xvZ21zZ5ACE2RldnNfamRfcGt0X2NhcHR1cmWRAhFkZXZzX2pkX3dha2Vfcm9sZZICEmRldnNfamRfc2hvdWxkX3J1bpMCF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hllAITZGV2c19qZF9wcm9jZXNzX3BrdJUCGGRldnNfamRfc2VydmVyX2RldmljZV9pZJYCFGRldnNfamRfcm9sZV9jaGFuZ2VklwIUZGV2c19qZF9yZXNldF9wYWNrZXSYAhJkZXZzX2pkX2luaXRfcm9sZXOZAhJkZXZzX2pkX2ZyZWVfcm9sZXOaAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3ObAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc5wCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc50CEGRldnNfanNvbl9lc2NhcGWeAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWfAg9kZXZzX2pzb25fcGFyc2WgAgpqc29uX3ZhbHVloQIMcGFyc2Vfc3RyaW5nogINc3RyaW5naWZ5X29iaqMCCmFkZF9pbmRlbnSkAg9zdHJpbmdpZnlfZmllbGSlAhNkZXZzX2pzb25fc3RyaW5naWZ5pgIRcGFyc2Vfc3RyaW5nX2NvcmWnAhFkZXZzX21hcGxpa2VfaXRlcqgCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0qQISZGV2c19tYXBfY29weV9pbnRvqgIMZGV2c19tYXBfc2V0qwIGbG9va3VwrAITZGV2c19tYXBsaWtlX2lzX21hcK0CG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc64CEWRldnNfYXJyYXlfaW5zZXJ0rwIIa3ZfYWRkLjGwAhJkZXZzX3Nob3J0X21hcF9zZXSxAg9kZXZzX21hcF9kZWxldGWyAhJkZXZzX3Nob3J0X21hcF9nZXSzAiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkeLQCG2RldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlY7UCHmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjX2lkeLYCGmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjtwIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXS4AhdkZXZzX3BhY2tldF9zcGVjX3BhcmVudLkCDmRldnNfcm9sZV9zcGVjugISZGV2c19nZXRfYmFzZV9zcGVjuwIQZGV2c19zcGVjX2xvb2t1cLwCEmRldnNfZnVuY3Rpb25fYmluZL0CEWRldnNfbWFrZV9jbG9zdXJlvgIOZGV2c19nZXRfZm5pZHi/AhNkZXZzX2dldF9mbmlkeF9jb3JlwAIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxkwQITZGV2c19nZXRfcm9sZV9wcm90b8ICG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd8MCGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZMQCFWRldnNfZ2V0X3N0YXRpY19wcm90b8UCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb8YCHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtxwIWZGV2c19tYXBsaWtlX2dldF9wcm90b8gCGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZMkCGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZMoCEGRldnNfaW5zdGFuY2Vfb2bLAg9kZXZzX29iamVjdF9nZXTMAgxkZXZzX3NlcV9nZXTNAgxkZXZzX2FueV9nZXTOAgxkZXZzX2FueV9zZXTPAgxkZXZzX3NlcV9zZXTQAg5kZXZzX2FycmF5X3NldNECE2RldnNfYXJyYXlfcGluX3B1c2jSAgxkZXZzX2FyZ19pbnTTAg9kZXZzX2FyZ19kb3VibGXUAg9kZXZzX3JldF9kb3VibGXVAgxkZXZzX3JldF9pbnTWAg1kZXZzX3JldF9ib29s1wIPZGV2c19yZXRfZ2NfcHRy2AIRZGV2c19hcmdfc2VsZl9tYXDZAhFkZXZzX3NldHVwX3Jlc3VtZdoCD2RldnNfY2FuX2F0dGFjaNsCGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWXcAhVkZXZzX21hcGxpa2VfdG9fdmFsdWXdAhJkZXZzX3JlZ2NhY2hlX2ZyZWXeAhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs3wIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTgAhNkZXZzX3JlZ2NhY2hlX2FsbG9j4QIUZGV2c19yZWdjYWNoZV9sb29rdXDiAhFkZXZzX3JlZ2NhY2hlX2FnZeMCF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xl5AISZGV2c19yZWdjYWNoZV9uZXh05QIPamRfc2V0dGluZ3NfZ2V05gIPamRfc2V0dGluZ3Nfc2V05wIOZGV2c19sb2dfdmFsdWXoAg9kZXZzX3Nob3dfdmFsdWXpAhBkZXZzX3Nob3dfdmFsdWUw6gINY29uc3VtZV9jaHVua+sCDXNoYV8yNTZfY2xvc2XsAg9qZF9zaGEyNTZfc2V0dXDtAhBqZF9zaGEyNTZfdXBkYXRl7gIQamRfc2hhMjU2X2ZpbmlzaO8CFGpkX3NoYTI1Nl9obWFjX3NldHVw8AIVamRfc2hhMjU2X2htYWNfZmluaXNo8QIOamRfc2hhMjU2X2hrZGbyAg5kZXZzX3N0cmZvcm1hdPMCDmRldnNfaXNfc3RyaW5n9AIOZGV2c19pc19udW1iZXL1AhRkZXZzX3N0cmluZ19nZXRfdXRmOPYCE2RldnNfYnVpbHRpbl9zdHJpbmf3AhRkZXZzX3N0cmluZ192c3ByaW50ZvgCE2RldnNfc3RyaW5nX3NwcmludGb5AhVkZXZzX3N0cmluZ19mcm9tX3V0Zjj6AhRkZXZzX3ZhbHVlX3RvX3N0cmluZ/sCEGJ1ZmZlcl90b19zdHJpbmf8AhlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxk/QISZGV2c19zdHJpbmdfY29uY2F0/gIRZGV2c19zdHJpbmdfc2xpY2X/AhJkZXZzX3B1c2hfdHJ5ZnJhbWWAAxFkZXZzX3BvcF90cnlmcmFtZYEDD2RldnNfZHVtcF9zdGFja4IDE2RldnNfZHVtcF9leGNlcHRpb26DAwpkZXZzX3Rocm93hAMSZGV2c19wcm9jZXNzX3Rocm93hQMQZGV2c19hbGxvY19lcnJvcoYDFWRldnNfdGhyb3dfdHlwZV9lcnJvcocDFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3KIAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3KJAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcooDHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dIsDGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcowDF2RldnNfdGhyb3dfc3ludGF4X2Vycm9yjQMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZY4DE2RldnNfdmFsdWVfZnJvbV9pbnSPAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbJADF2RldnNfdmFsdWVfZnJvbV9wb2ludGVykQMUZGV2c192YWx1ZV90b19kb3VibGWSAxFkZXZzX3ZhbHVlX3RvX2ludJMDEmRldnNfdmFsdWVfdG9fYm9vbJQDDmRldnNfaXNfYnVmZmVylQMXZGV2c19idWZmZXJfaXNfd3JpdGFibGWWAxBkZXZzX2J1ZmZlcl9kYXRhlwMTZGV2c19idWZmZXJpc2hfZGF0YZgDFGRldnNfdmFsdWVfdG9fZ2Nfb2JqmQMNZGV2c19pc19hcnJheZoDEWRldnNfdmFsdWVfdHlwZW9mmwMPZGV2c19pc19udWxsaXNonAMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZJ0DFGRldnNfdmFsdWVfYXBwcm94X2VxngMSZGV2c192YWx1ZV9pZWVlX2VxnwMcZGV2c192YWx1ZV9lcV9idWlsdGluX3N0cmluZ6ADHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY6EDEmRldnNfaW1nX3N0cmlkeF9va6IDEmRldnNfZHVtcF92ZXJzaW9uc6MDC2RldnNfdmVyaWZ5pAMRZGV2c19mZXRjaF9vcGNvZGWlAw5kZXZzX3ZtX3Jlc3VtZaYDEWRldnNfdm1fc2V0X2RlYnVnpwMZZGV2c192bV9jbGVhcl9icmVha3BvaW50c6gDGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludKkDDGRldnNfdm1faGFsdKoDD2RldnNfdm1fc3VzcGVuZKsDFmRldnNfdm1fc2V0X2JyZWFrcG9pbnSsAxRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc60DGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4rgMRZGV2c19pbWdfZ2V0X3V0ZjivAxRkZXZzX2dldF9zdGF0aWNfdXRmOLADFGRldnNfdmFsdWVfYnVmZmVyaXNosQMMZXhwcl9pbnZhbGlksgMUZXhwcnhfYnVpbHRpbl9vYmplY3SzAwtzdG10MV9jYWxsMLQDC3N0bXQyX2NhbGwxtQMLc3RtdDNfY2FsbDK2AwtzdG10NF9jYWxsM7cDC3N0bXQ1X2NhbGw0uAMLc3RtdDZfY2FsbDW5AwtzdG10N19jYWxsNroDC3N0bXQ4X2NhbGw3uwMLc3RtdDlfY2FsbDi8AxJzdG10Ml9pbmRleF9kZWxldGW9AwxzdG10MV9yZXR1cm6+AwlzdG10eF9qbXC/AwxzdG10eDFfam1wX3rAAwpleHByMl9iaW5kwQMSZXhwcnhfb2JqZWN0X2ZpZWxkwgMSc3RtdHgxX3N0b3JlX2xvY2FswwMTc3RtdHgxX3N0b3JlX2dsb2JhbMQDEnN0bXQ0X3N0b3JlX2J1ZmZlcsUDCWV4cHIwX2luZsYDEGV4cHJ4X2xvYWRfbG9jYWzHAxFleHByeF9sb2FkX2dsb2JhbMgDC2V4cHIxX3VwbHVzyQMLZXhwcjJfaW5kZXjKAw9zdG10M19pbmRleF9zZXTLAxRleHByeDFfYnVpbHRpbl9maWVsZMwDEmV4cHJ4MV9hc2NpaV9maWVsZM0DEWV4cHJ4MV91dGY4X2ZpZWxkzgMQZXhwcnhfbWF0aF9maWVsZM8DDmV4cHJ4X2RzX2ZpZWxk0AMPc3RtdDBfYWxsb2NfbWFw0QMRc3RtdDFfYWxsb2NfYXJyYXnSAxJzdG10MV9hbGxvY19idWZmZXLTAxFleHByeF9zdGF0aWNfcm9sZdQDE2V4cHJ4X3N0YXRpY19idWZmZXLVAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfWAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n1wMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n2AMVZXhwcnhfc3RhdGljX2Z1bmN0aW9u2QMNZXhwcnhfbGl0ZXJhbNoDEWV4cHJ4X2xpdGVyYWxfZjY02wMQZXhwcnhfcm9sZV9wcm90b9wDEWV4cHIzX2xvYWRfYnVmZmVy3QMNZXhwcjBfcmV0X3ZhbN4DDGV4cHIxX3R5cGVvZt8DD2V4cHIwX3VuZGVmaW5lZOADEmV4cHIxX2lzX3VuZGVmaW5lZOEDCmV4cHIwX3RydWXiAwtleHByMF9mYWxzZeMDDWV4cHIxX3RvX2Jvb2zkAwlleHByMF9uYW7lAwlleHByMV9hYnPmAw1leHByMV9iaXRfbm905wMMZXhwcjFfaXNfbmFu6AMJZXhwcjFfbmVn6QMJZXhwcjFfbm906gMMZXhwcjFfdG9faW506wMJZXhwcjJfYWRk7AMJZXhwcjJfc3Vi7QMJZXhwcjJfbXVs7gMJZXhwcjJfZGl27wMNZXhwcjJfYml0X2FuZPADDGV4cHIyX2JpdF9vcvEDDWV4cHIyX2JpdF94b3LyAxBleHByMl9zaGlmdF9sZWZ08wMRZXhwcjJfc2hpZnRfcmlnaHT0AxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZPUDCGV4cHIyX2Vx9gMIZXhwcjJfbGX3AwhleHByMl9sdPgDCGV4cHIyX25l+QMQZXhwcjFfaXNfbnVsbGlzaPoDFHN0bXR4Ml9zdG9yZV9jbG9zdXJl+wMTZXhwcngxX2xvYWRfY2xvc3VyZfwDEmV4cHJ4X21ha2VfY2xvc3VyZf0DEGV4cHIxX3R5cGVvZl9zdHL+AxNzdG10eF9qbXBfcmV0X3ZhbF96/wMQc3RtdDJfY2FsbF9hcnJheYAECXN0bXR4X3RyeYEEDXN0bXR4X2VuZF90cnmCBAtzdG10MF9jYXRjaIMEDXN0bXQwX2ZpbmFsbHmEBAtzdG10MV90aHJvd4UEDnN0bXQxX3JlX3Rocm93hgQQc3RtdHgxX3Rocm93X2ptcIcEDnN0bXQwX2RlYnVnZ2VyiAQJZXhwcjFfbmV3iQQRZXhwcjJfaW5zdGFuY2Vfb2aKBApleHByMF9udWxsiwQPZXhwcjJfYXBwcm94X2VxjAQPZXhwcjJfYXBwcm94X25ljQQTc3RtdDFfc3RvcmVfcmV0X3ZhbI4EEWV4cHJ4X3N0YXRpY19zcGVjjwQPZGV2c192bV9wb3BfYXJnkAQTZGV2c192bV9wb3BfYXJnX3UzMpEEE2RldnNfdm1fcG9wX2FyZ19pMzKSBBZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVykwQSamRfYWVzX2NjbV9lbmNyeXB0lAQSamRfYWVzX2NjbV9kZWNyeXB0lQQMQUVTX2luaXRfY3R4lgQPQUVTX0VDQl9lbmNyeXB0lwQQamRfYWVzX3NldHVwX2tleZgEDmpkX2Flc19lbmNyeXB0mQQQamRfYWVzX2NsZWFyX2tleZoEC2pkX3dzc2tfbmV3mwQUamRfd3Nza19zZW5kX21lc3NhZ2WcBBNqZF93ZWJzb2NrX29uX2V2ZW50nQQHZGVjcnlwdJ4EDWpkX3dzc2tfY2xvc2WfBBBqZF93c3NrX29uX2V2ZW50oAQLcmVzcF9zdGF0dXOhBBJ3c3NraGVhbHRoX3Byb2Nlc3OiBBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZaMEFHdzc2toZWFsdGhfcmVjb25uZWN0pAQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0pQQPc2V0X2Nvbm5fc3RyaW5npgQRY2xlYXJfY29ubl9zdHJpbmenBA93c3NraGVhbHRoX2luaXSoBBF3c3NrX3NlbmRfbWVzc2FnZakEEXdzc2tfaXNfY29ubmVjdGVkqgQUd3Nza190cmFja19leGNlcHRpb26rBBJ3c3NrX3NlcnZpY2VfcXVlcnmsBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplrQQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZa4ED3JvbGVtZ3JfcHJvY2Vzc68EEHJvbGVtZ3JfYXV0b2JpbmSwBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSxBBRqZF9yb2xlX21hbmFnZXJfaW5pdLIEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZLMEDWpkX3JvbGVfYWxsb2O0BBBqZF9yb2xlX2ZyZWVfYWxstQQWamRfcm9sZV9mb3JjZV9hdXRvYmluZLYEE2pkX2NsaWVudF9sb2dfZXZlbnS3BBNqZF9jbGllbnRfc3Vic2NyaWJluAQUamRfY2xpZW50X2VtaXRfZXZlbnS5BBRyb2xlbWdyX3JvbGVfY2hhbmdlZLoEEGpkX2RldmljZV9sb29rdXC7BBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2W8BBNqZF9zZXJ2aWNlX3NlbmRfY21kvQQRamRfY2xpZW50X3Byb2Nlc3O+BA5qZF9kZXZpY2VfZnJlZb8EF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0wAQPamRfZGV2aWNlX2FsbG9jwQQQc2V0dGluZ3NfcHJvY2Vzc8IEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXTDBA1zZXR0aW5nc19pbml0xAQPamRfY3RybF9wcm9jZXNzxQQVamRfY3RybF9oYW5kbGVfcGFja2V0xgQMamRfY3RybF9pbml0xwQUZGNmZ19zZXRfdXNlcl9jb25maWfIBAlkY2ZnX2luaXTJBA1kY2ZnX3ZhbGlkYXRlygQOZGNmZ19nZXRfZW50cnnLBAxkY2ZnX2dldF9pMzLMBAxkY2ZnX2dldF91MzLNBA9kY2ZnX2dldF9zdHJpbmfOBAxkY2ZnX2lkeF9rZXnPBAlqZF92ZG1lc2fQBBFqZF9kbWVzZ19zdGFydHB0ctEEDWpkX2RtZXNnX3JlYWTSBBJqZF9kbWVzZ19yZWFkX2xpbmXTBBNqZF9zZXR0aW5nc19nZXRfYmlu1AQKZmluZF9lbnRyedUED3JlY29tcHV0ZV9jYWNoZdYEE2pkX3NldHRpbmdzX3NldF9iaW7XBAtqZF9mc3Rvcl9nY9gEFWpkX3NldHRpbmdzX2dldF9sYXJnZdkEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2XaBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZdsEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XcBA1qZF9pcGlwZV9vcGVu3QQWamRfaXBpcGVfaGFuZGxlX3BhY2tldN4EDmpkX2lwaXBlX2Nsb3Nl3wQSamRfbnVtZm10X2lzX3ZhbGlk4AQVamRfbnVtZm10X3dyaXRlX2Zsb2F04QQTamRfbnVtZm10X3dyaXRlX2kzMuIEEmpkX251bWZtdF9yZWFkX2kzMuMEFGpkX251bWZtdF9yZWFkX2Zsb2F05AQRamRfb3BpcGVfb3Blbl9jbWTlBBRqZF9vcGlwZV9vcGVuX3JlcG9ydOYEFmpkX29waXBlX2hhbmRsZV9wYWNrZXTnBBFqZF9vcGlwZV93cml0ZV9leOgEEGpkX29waXBlX3Byb2Nlc3PpBBRqZF9vcGlwZV9jaGVja19zcGFjZeoEDmpkX29waXBlX3dyaXRl6wQOamRfb3BpcGVfY2xvc2XsBA1qZF9xdWV1ZV9wdXNo7QQOamRfcXVldWVfZnJvbnTuBA5qZF9xdWV1ZV9zaGlmdO8EDmpkX3F1ZXVlX2FsbG9j8AQNamRfcmVzcG9uZF91OPEEDmpkX3Jlc3BvbmRfdTE28gQOamRfcmVzcG9uZF91MzLzBBFqZF9yZXNwb25kX3N0cmluZ/QEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk9QQLamRfc2VuZF9wa3T2BB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbPcEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy+AQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldPkEFGpkX2FwcF9oYW5kbGVfcGFja2V0+gQVamRfYXBwX2hhbmRsZV9jb21tYW5k+wQVYXBwX2dldF9pbnN0YW5jZV9uYW1l/AQTamRfYWxsb2NhdGVfc2VydmljZf0EEGpkX3NlcnZpY2VzX2luaXT+BA5qZF9yZWZyZXNoX25vd/8EGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSABRRqZF9zZXJ2aWNlc19hbm5vdW5jZYEFF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1lggUQamRfc2VydmljZXNfdGlja4MFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ4QFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlhQUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZYYFFGFwcF9nZXRfZGV2aWNlX2NsYXNzhwUSYXBwX2dldF9md192ZXJzaW9uiAUNamRfc3J2Y2ZnX3J1bokFF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1ligURamRfc3J2Y2ZnX3ZhcmlhbnSLBQ1qZF9oYXNoX2ZudjFhjAUMamRfZGV2aWNlX2lkjQUJamRfcmFuZG9tjgUIamRfY3JjMTaPBQ5qZF9jb21wdXRlX2NyY5AFDmpkX3NoaWZ0X2ZyYW1lkQUMamRfd29yZF9tb3ZlkgUOamRfcmVzZXRfZnJhbWWTBRBqZF9wdXNoX2luX2ZyYW1llAUNamRfcGFuaWNfY29yZZUFE2pkX3Nob3VsZF9zYW1wbGVfbXOWBRBqZF9zaG91bGRfc2FtcGxllwUJamRfdG9faGV4mAULamRfZnJvbV9oZXiZBQ5qZF9hc3NlcnRfZmFpbJoFB2pkX2F0b2mbBQtqZF92c3ByaW50ZpwFD2pkX3ByaW50X2RvdWJsZZ0FCmpkX3NwcmludGaeBRJqZF9kZXZpY2Vfc2hvcnRfaWSfBQxqZF9zcHJpbnRmX2GgBQtqZF90b19oZXhfYaEFCWpkX3N0cmR1cKIFCWpkX21lbWR1cKMFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWkBRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlpQURamRfc2VuZF9ldmVudF9leHSmBQpqZF9yeF9pbml0pwUUamRfcnhfZnJhbWVfcmVjZWl2ZWSoBR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja6kFD2pkX3J4X2dldF9mcmFtZaoFE2pkX3J4X3JlbGVhc2VfZnJhbWWrBRFqZF9zZW5kX2ZyYW1lX3Jhd6wFDWpkX3NlbmRfZnJhbWWtBQpqZF90eF9pbml0rgUHamRfc2VuZK8FFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOwBQ9qZF90eF9nZXRfZnJhbWWxBRBqZF90eF9mcmFtZV9zZW50sgULamRfdHhfZmx1c2izBRBfX2Vycm5vX2xvY2F0aW9utAUMX19mcGNsYXNzaWZ5tQUFZHVtbXm2BQhfX21lbWNwebcFB21lbW1vdmW4BQZtZW1zZXS5BQpfX2xvY2tmaWxlugUMX191bmxvY2tmaWxluwUGZmZsdXNovAUEZm1vZL0FDV9fRE9VQkxFX0JJVFO+BQxfX3N0ZGlvX3NlZWu/BQ1fX3N0ZGlvX3dyaXRlwAUNX19zdGRpb19jbG9zZcEFCF9fdG9yZWFkwgUJX190b3dyaXRlwwUJX19md3JpdGV4xAUGZndyaXRlxQUUX19wdGhyZWFkX211dGV4X2xvY2vGBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrxwUGX19sb2NryAUIX191bmxvY2vJBQ5fX21hdGhfZGl2emVyb8oFCmZwX2JhcnJpZXLLBQ5fX21hdGhfaW52YWxpZMwFA2xvZ80FBXRvcDE2zgUFbG9nMTDPBQdfX2xzZWVr0AUGbWVtY21w0QUKX19vZmxfbG9ja9IFDF9fb2ZsX3VubG9ja9MFDF9fbWF0aF94Zmxvd9QFDGZwX2JhcnJpZXIuMdUFDF9fbWF0aF9vZmxvd9YFDF9fbWF0aF91Zmxvd9cFBGZhYnPYBQNwb3fZBQV0b3AxMtoFCnplcm9pbmZuYW7bBQhjaGVja2ludNwFDGZwX2JhcnJpZXIuMt0FCmxvZ19pbmxpbmXeBQpleHBfaW5saW5l3wULc3BlY2lhbGNhc2XgBQ1mcF9mb3JjZV9ldmFs4QUFcm91bmTiBQZzdHJjaHLjBQtfX3N0cmNocm51bOQFBnN0cmNtcOUFBnN0cmxlbuYFB19fdWZsb3fnBQdfX3NobGlt6AUIX19zaGdldGPpBQdpc3NwYWNl6gUGc2NhbGJu6wUJY29weXNpZ25s7AUHc2NhbGJubO0FDV9fZnBjbGFzc2lmeWzuBQVmbW9kbO8FBWZhYnNs8AULX19mbG9hdHNjYW7xBQhoZXhmbG9hdPIFCGRlY2Zsb2F08wUHc2NhbmV4cPQFBnN0cnRvePUFBnN0cnRvZPYFEl9fd2FzaV9zeXNjYWxsX3JldPcFCGRsbWFsbG9j+AUGZGxmcmVl+QUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl+gUEc2Jya/sFCF9fYWRkdGYz/AUJX19hc2hsdGkz/QUHX19sZXRmMv4FB19fZ2V0ZjL/BQhfX2RpdnRmM4AGDV9fZXh0ZW5kZGZ0ZjKBBg1fX2V4dGVuZHNmdGYyggYLX19mbG9hdHNpdGaDBg1fX2Zsb2F0dW5zaXRmhAYNX19mZV9nZXRyb3VuZIUGEl9fZmVfcmFpc2VfaW5leGFjdIYGCV9fbHNocnRpM4cGCF9fbXVsdGYziAYIX19tdWx0aTOJBglfX3Bvd2lkZjKKBghfX3N1YnRmM4sGDF9fdHJ1bmN0ZmRmMowGC3NldFRlbXBSZXQwjQYLZ2V0VGVtcFJldDCOBglzdGFja1NhdmWPBgxzdGFja1Jlc3RvcmWQBgpzdGFja0FsbG9jkQYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudJIGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdJMGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWUBhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNllQYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5klgYMZHluQ2FsbF9qaWpplwYWbGVnYWxzdHViJGR5bkNhbGxfamlqaZgGGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAZYGBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
