
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+aFgIAA5AUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAQEBAQEBAQEBAQEBAQEBBQMACgACAgABAQEAAQAAAQAAAAoAAQIAAQEEBQECAAAAAAgDBQoCAgIABgoDCQMBBgUDBgkGBgUGBQMGBgkNBgMDBQUDAwMDBgUGBgYGBgYBAw4RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQFAgYGBgEBBgYKAQMCAgEACgYGAQYGAQYRAgIGDgMDAwMFBQMDAwQEBQUFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQICBAQBCg0CAgAABwkJAQMHAQIACAACBgAHCQgABAQEAAACBwADBwcBAgEAEgMJBwAABAACBwACBwQHBAQDAwMFAggFBQUHBQcHAwMFCAUAAAQfAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxAIAwAEAQAJAQMDAQMGBAkgCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghDwUEBAQFCQQEAAAUCwsLEwsPBQgHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgGFikqBg4EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAdcB1wEFhoCAgAABAYACgAIG3YCAgAAOfwFB4PAFC38BQQALfwFBAAt/AUEAC38AQdjOAQt/AEHHzwELfwBBkdEBC38AQY3SAQt/AEGJ0wELfwBB2dMBC38AQfrTAQt/AEH/1QELfwBB2M4BC38AQfXWAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jANkFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCVBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDaBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAJ0FFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdAD0BRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAPUFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA9gUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPcFCXN0YWNrU2F2ZQDwBQxzdGFja1Jlc3RvcmUA8QUKc3RhY2tBbGxvYwDyBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50APMFDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkA+QUJ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ASAAKALQARCYASAAQQBBiAgQmgUaCxIAAkAgAEUNACAAEFEgABAiCwssAQF/IwBBEGsiAiQAIAIgATYCAEHx0AAgAhA8IABB5NQDEIIBIAJBEGokAAsNACAAKALQASABEIwBCwIAC5EDAQR/AkACQAJAAkACQCABLwEOIgJBgH9qDgIAAQILAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtB0RJBABA8DwtBAiABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQJBpjNBABA8DwsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0HREkEAEDwPC0EBIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAUGmM0EAEDwPCyACQYAjRg0BAkAgACgCCCgCDCICRQ0AIAEgAhEEAEEASg0BCyABENYEGgsPCyABIAAoAggoAgQRCABB/wFxENIEGgs1AQJ/QQAoAqDcASEDQYABIQQCQAJAAkAgAEF/ag4CAAECC0GBASEECyADIAQgASACEIcFCwsbAQF/QcjZABDeBCIBIAA2AghBACABNgKg3AELLgEBfwJAQQAoAqDcASIBRQ0AIAEoAggiAUUNACABKAIQIgFFDQAgACABEQAACwvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQzQQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsEMwEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQzQQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0ACwsLbQEDfwJAQQAoAqTcASIBRQ0AAkAQcCICRQ0AIAIgAS0ABkEARxCJAyACQQA6AEkgAiABLQAIQQBHQQF0IgM6AEkgAS0A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KAJYIgYgAk0NACABIAYgAmsiBjYCWCABKAJMIgcgBE0NACABIAcgBGsiBzYCTCADIARqIAUgAmogByAGIAAgBiAASRsiACAHIABJGxCYBRoLIAFB4ABqJAALHwEBfwJAIABBABC1AiIBQQBIDQAgACgCrAEgARB4CwsjAQF/IABB39QDIABBABC1AiIBIAFBoKt8akGhq3xJGxCCAQsJACAAQQAQggELywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQ2AIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDVAiIFQX9qIgYQlAEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQ1QIaDAELIAdBBmogAUEQaiAGEJgFGgsgACAHELoCCyABQeAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQtQIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEN0CIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEP0BIAFBIGokAAsOACAAIABBABC2AhC3AgsPACAAIABBABC2Ap0QtwILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahD+AkUNACABIAEpA2g3AxAgASAAIAFBEGoQywI2AgBBgRcgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEN0CIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI4BIAEgASkDYDcDOCAAIAFBOGpBABDYAiECIAEgASkDaDcDMCABIAAgAUEwahDLAjYCJCABIAI2AiBBsxcgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjwELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEN0CIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAENgCIgJFDQAgAiABQSBqEK8EIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlQEQ8wIgACgCrAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPAAboQ8AIgACgCrAEgASkDCDcDICABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC7AiICRQ0AAkAgAigCBA0AIAIgAEEcEJICNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABDZAgsgASABKQMINwMAIAAgAkH2ACABEN8CIAAgAhC6AgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQuwIiAkUNAAJAIAIoAgQNACACIABBIBCSAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQ2QILIAEgASkDCDcDACAAIAJB9gAgARDfAiAAIAIQugILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAELsCIgJFDQACQCACKAIEDQAgAiAAQR4QkgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAENkCCyABIAEpAwg3AwAgACACQfYAIAEQ3wIgACACELoCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC7AiICRQ0AAkAgAigCBA0AIAIgAEEiEJICNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARDZAgsgASABKQMINwMAIAAgAkH2ACABEN8CIAAgAhC6AgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEKMCAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABCjAgsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEOUCIAAQWSABQRBqJAALpgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahDsAkEAIQEMAQsCQCABIAMoAhAQfSICDQAgA0EYaiABQaUxQQAQ6gILIAIhAQsCQAJAIAEiAUUNACAAIAEoAhwQ8QIMAQsgAEIANwMACyADQSBqJAALrAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahDsAkEAIQEMAQsCQCABIAMoAhAQfSICDQAgA0EYaiABQaUxQQAQ6gILIAIhAQsCQAJAIAEiAUUNACAAIAEtABBBD3FBBEYQ8gIMAQsgAEIANwMACyADQSBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDsAkEAIQIMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQaUxQQAQ6gILIAIhAgsCQCACIgJFDQACQCACLQAQQQ9xQQRGDQAgAUEYaiAAQe8yQQAQ6gIMAQsgAiAAQdgAaikDADcDICACQQEQdwsgAUEgaiQAC5QBAQJ/IwBBIGsiASQAIAEgACkDUDcDEAJAAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxA3AwggAUEYaiAAQYsBIAFBCGoQ7AJBACEADAELAkAgACABKAIQEH0iAg0AIAFBGGogAEGlMUEAEOoCCyACIQALAkAgACIARQ0AIAAQfwsgAUEgaiQACzIBAX8CQCAAQQAQtQIiAUEASA0AIAAoAqwBIgAgARB4IAAgAC0AEEHwAXFBBHI6ABALCxkAIAAoAqwBIgAgADUCHEKAgICAEIQ3AyALWQECfyMAQRBrIgEkAAJAAkAgAC0AQyICDQAgAUEIaiAAQaUlQQAQ6gIMAQsgACACQX9qQQEQfiICRQ0AIAAoAqwBIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQoQIiBEHPhgNLDQAgASgApAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQa4gIANBCGoQ7QIMAQsgACABIAEoAqABIARB//8DcRCcAiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEJICEJABEPMCIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCOASADQdAAakH7ABDZAiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQsQIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEJoCIAMgACkDADcDECABIANBEGoQjwELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQoQIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEOwCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BsMoBTg0CIABBsOQAIAFBA3RqLwEAENkCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQdwTQeE5QTFB9ysQ+wQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ/gINACABQThqIABB9RkQ6wILIAEgASkDSDcDICABQThqIAAgAUEgahDdAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI4BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqENgCIgJFDQAgAUEwaiAAIAIgASgCOEEBEIkCIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjwEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECELUCIQIgASABKQMgNwMIAkAgAUEIahD+Ag0AIAFBGGogAEHPGxDrAgsgASABKQMoNwMAIAFBEGogACABIAJBARCPAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ9AKbELcCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPQCnBC3AgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD0AhDDBRC3AgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxDxAgsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQ9AIiBEQAAAAAAAAAAGNFDQAgACAEmhC3AgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABDvBLhEAAAAAAAA8D2iELcCC2QBBX8CQAJAIABBABC1AiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEO8EIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQuAILEQAgACAAQQAQtgIQrgUQtwILGAAgACAAQQAQtgIgAEEBELYCELoFELcCCy4BA38gAEEAELUCIQFBACECAkAgAEEBELUCIgNFDQAgASADbSECCyAAIAIQuAILLgEDfyAAQQAQtQIhAUEAIQICQCAAQQEQtQIiA0UNACABIANvIQILIAAgAhC4AgsWACAAIABBABC1AiAAQQEQtQJsELgCCwkAIABBARDOAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahD1AiEDIAIgAikDIDcDECAAIAJBEGoQ9QIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEPQCIQYgAiACKQMgNwMAIAAgAhD0AiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA6hsNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGoh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IANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjdASABIAMgACADIABJGyIAEJgFGkEAQQAoArzdASIJIABrNgK83QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE3QFB+NwBEM0CQQBBwAA2ArzdAUEAQfjcATYCuN0BIAIhAyABIQEgAg0BDAILQQBBACgCuN0BIABqNgK43QEgAiEDIAEhASACDQALCyAIENMCIAhBIBDSAgJAIAVFDQBBAEEAKALA3QEgBWo2AsDdASAFIQMgBCEBA0AgASEBIAMhAwJAQQAoArzdASIAQcAARw0AIANBwABJDQBBxN0BIAEQzQIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuN0BIAEgAyAAIAMgAEkbIgAQmAUaQQBBACgCvN0BIgkgAGs2ArzdASABIABqIQEgAyAAayECAkAgCSAARw0AQcTdAUH43AEQzQJBAEHAADYCvN0BQQBB+NwBNgK43QEgAiEDIAEhASACDQEMAgtBAEEAKAK43QEgAGo2ArjdASACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAsDdASAHajYCwN0BIAchAyAGIQEDQCABIQEgAyEDAkBBACgCvN0BIgBBwABHDQAgA0HAAEkNAEHE3QEgARDNAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK43QEgASADIAAgAyAASRsiABCYBRpBAEEAKAK83QEiCSAAazYCvN0BIAEgAGohASADIABrIQICQCAJIABHDQBBxN0BQfjcARDNAkEAQcAANgK83QFBAEH43AE2ArjdASACIQMgASEBIAINAQwCC0EAQQAoArjdASAAajYCuN0BIAIhAyABIQEgAg0ACwtBAEEAKALA3QFBAWo2AsDdAUEBIQNBqdcAIQECQANAIAEhASADIQMCQEEAKAK83QEiAEHAAEcNACADQcAASQ0AQcTdASABEM0CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoArjdASABIAMgACADIABJGyIAEJgFGkEAQQAoArzdASIJIABrNgK83QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHE3QFB+NwBEM0CQQBBwAA2ArzdAUEAQfjcATYCuN0BIAIhAyABIQEgAg0BDAILQQBBACgCuN0BIABqNgK43QEg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WFBFDQBBACEDDAELIAIgAikDWDcDKCAAQYkgIAJBKGoQygJBASEDCyADIQMgAiABKQMANwMgIAJB0ABqIAAgAkEgakH2ABCjAgJAAkAgAikDUFBFDQAgAyEDDAELIAIgAikDUDcDGCAAQY0tIAJBGGoQygIgAiABKQMANwMQIAJByABqIAAgAkEQakHxABCjAgJAIAIpA0hQDQAgAiACKQNINwMIIAAgAkEIahDkAgsgA0EBaiEDCyADIQMLAkAgAw0AIAIgASkDADcDACAAQYkgIAIQygILIAJB4ABqJAALiAQBBn8jAEHgAGsiAyQAAkACQCAALQBFRQ0AIAMgASkDADcDQCAAQbELIANBwABqEMoCDAELAkAgACgCqAENACADIAEpAwA3A1hB8x9BABA8IABBADoARSADIAMpA1g3AwAgACADEOUCIABB5dQDEIIBDAELIABBAToARSAAIAEpAwA3AzggAyABKQMANwM4IAAgA0E4ahC9AiEEIAJBAXENACAERQ0AIAMgASkDADcDMCADQdgAaiAAIANBMGpB8QAQowIgAykDWEIAUg0AAkACQCAAKAKoASICDQBBACEFDAELIAIhAkEAIQQDQCAEQQFqIgQhBSACKAIMIgYhAiAEIQQgBg0ACwsCQAJAIAAgBSICQRAgAkEQSRsiBUEBdBCTASIHRQ0AAkAgACgCqAEiAkUNACAFRQ0AIAdBDGohCCACIQJBACEEA0AgCCAEIgRBAXRqIAIiAi8BBDsBACACKAIMIgJFDQEgAiECIARBAWoiBiEEIAYgBUkNAAsLIANB0ABqIABBCCAHEPMCDAELIANCADcDUAsgAyADKQNQNwMoIAAgA0EoahCOASADQcgAakHxABDZAiADIAEpAwA3AyAgAyADKQNINwMYIAMgAykDUDcDECAAIANBIGogA0EYaiADQRBqELECIAMgAykDUDcDCCAAIANBCGoQjwELIANB4ABqJAAL0AcCDH8BfiMAQRBrIgEkACAAKQM4Ig2nIQICQAJAAkACQCANQiCIpyIDDQAgAkGACEkNACACQQ9xIQQgAkGAeGpBBHYhBQwBCwJAIAAtAEcNAEEAIQRBACEFDAELAkACQCAALQBIRQ0AQQEhBkEAIQcMAQtBASEGQQAhByAALQBJQQNxRQ0AIAAoAqgBIgdBAEchBAJAAkAg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KQNINwMgIAJBOGogASACQSBqEN0CIAIgAikDOCIFNwNIIAIgBTcDGCABIAJBGGoQjgELIAIgAikDSDcDEAJAIAEgAyACQRBqEJsCDQAgASgCrAFBACkDmGw3AyALIAQNACACIAIpA0g3AwggASACQQhqEI8BCyACQdAAaiQAC14BAn8jAEEQayICJAAgASgCrAEhAyACQQhqIAEQ8QMgAyACKQMINwMgIAMgABB5AkAgAS0AR0UNACABKALYASAARw0AIAEtAAdBCHFFDQAgAUEIEIwDCyACQRBqJAALYgEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIMBQQAhBAsCQCAEIgFFDQAgACABOwEECyACQRBqJAALhQEBBH8jAEEgayICJAAgAkEQaiABEPEDIAIgAikDEDcDCCABIAJBCGoQ9gIhAwJAAkAgACgCECgCACABKAJMIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEYaiABQekAEIMBQQAhBQsCQCAFIgFFIANyDQAgACABOwEECyACQSBqJAALjwEBAX8jAEEwayIDJAAgA0EoaiACEPEDIANBIGogAhDxAwJAIAMoAiRBj4DA/wdxDQAgAygCIEGgf2pBI0sNACADIAMpAyA3AxAgA0EYaiACIANBEGpB2AAQowIgAyADKQMYNwMgCyADIAMpAyg3AwggAyADKQMgNwMAIAAgAiADQQhqIAMQnwIgA0EwaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqQBNgIMAkACQCADQQxqIARBgIABciIEEIQDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCDAQsgAkEBEJICIQQgAyADKQMQNwMAIAAgAiAEIAMQrAIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEPEDAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQgwEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ8QMCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQgwEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ8QMgARDyAyEDIAEQ8gMhBCACQRBqIAFBARD0AwJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA7BsNwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQgwELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQgwELcQEBfyMAQSBrIgMkACADQRhqIAIQ8QMgAyADKQMYNwMQAkACQAJAIANBEGoQ1wINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEPQCEPACCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ8QMgA0EQaiACEPEDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCwAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ8QMgAkEgaiABEPEDIAJBGGogARDxAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACELECIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPEDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBCEAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCuAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPEDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBCEAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCuAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPEDIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBCEAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCuAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCEAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwELIAJBABCSAiEEIAMgAykDEDcDACAAIAIgBCADEKwCIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCEAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwELIAJBFRCSAiEEIAMgAykDEDcDACAAIAIgBCADEKwCIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQkgIQkAEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQ8wIgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEPIDIgMQkgEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQ8wIgAyACKQMINwMgIAJBEGokAAtQAQN/IwBBEGsiAiQAAkAgASABEPIDIgMQkwEiBA0AIAEgA0EMahBTCyABKAKsASEDIAJBCGogAUEIIAQQ8wIgAyACKQMINwMgIAJBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKACkAUE8aigCAEEDdiACKAJMIgRLDQAgA0EIaiACQfkAEIMBIABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALaQECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEEIQDDQAgAEIANwMADAEL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QRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQgAMhAgsgACACEPICIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQ8QMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPEDIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQgANBAXMhAgsgACACEPICIANBIGokAAssAQF/IwBBEGsiAiQAIAJBCGogARDxAyABKAKsASACKQMINwMgIAJBEGokAAs/AQF/AkAgAS0AQiICDQAgACABQewAEIMBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIMBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEPUCIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIMBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEPUCIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCDAQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQ9wINAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahDWAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahDsAkIAIQUMAQsCQCACQQFxRQ0AIAMgAykDODcDECABIANBEGoQ+AINACADIAMpAzg3AwggA0EwaiABQaUbIANBCGoQ7QJCACEFDAELIAMpAzghBQsgACAFNwMAIANBwABqJAALoAQBBX8CQCAEQfb/A08NACAAEPkDQQBBAToA0N4BQQAgASkAADcA0d4BQQAgAUEF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IQEMAQtBfyEBIARBIHIiBEGff2pB/wFxQQVLDQAgBMBBqX9qIQELIAEhASACQQFqIQICQAJAIAgNACAHIQYgAUEEdEGAAnIhBQwBCyAHIAEgCHI6AAAgB0EBaiEGQQAhBQsgAi0AACIHRSEEIAchAyACIQEgBSEFIAYiAiEGIAIhAiAHDQALCyACIABrCzMBAX8jAEEQayIEJAAgBCADNgIMIAQgAjYCCCAEIAE2AgQgBCAANgIAQYoWIAQQPBAdAAtYAQR/IAAgAC0AACIBQS1GaiEAQQAhAgNAIAAiA0EBaiEAIAMsAABBUGoiAyACIgJBCmxqIAIgA0H/AXFBCkkiAxsiBCECIAMNAAtBACAEayAEIAFBLUYbC/kKAQt/IwBBwABrIgQkACAAIAFqIQUgBEF/aiEGIARBAXIhByAEQQJyIQggAEEARyEJIAIhASADIQogAiECIAAhAwNAIAMhAyACIQIgCiELIAEiCkEBaiEBAkACQCAKLQAAIgxBJUYNACAMRQ0AIAEhASALIQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEJgFIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEMcFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEi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LQAAIgJFDQEgA0EBaiEAIAIgAUH/AXFHDQALCyADDwsgACAAEMcFag8LIAALWQECfyABLQAAIQICQCAALQAAIgNFDQAgAyACQf8BcUcNAANAIAEtAAEhAiAALQABIgNFDQEgAUEBaiEBIABBAWohACADIAJB/wFxRg0ACwsgAyACQf8BcWsLcgEDfyAAIQECQAJAIABBA3FFDQAgACEBA0AgAS0AAEUNAiABQQFqIgFBA3ENAAsLA0AgASICQQRqIQEgAigCACIDQX9zIANB//37d2pxQYCBgoR4cUUNAAsDQCACIgFBAWohAiABLQAADQALCyABIABrC0EBAn8jAEEQayIBJABBfyECAkAgABCjBQ0AIAAgAUEPakEBIAAoAiARBQBBAUcNACABLQAPIQILIAFBEGokACACC0cBAn8gACABNwNwIAAgACgCLCAAKAIEIgJrrDcDeCAAKAIIIQMCQCABUA0AIAMgAmusIAFXDQAgAiABp2ohAwsgACADNgJoC90BAgN/An4gACkDeCAAKAIEIgEgACgCLCICa6x8IQQCQAJAAkAgACkDcCIFUA0AIAQgBVkNAQsgABDIBSICQX9KDQEgACgCBCEBIAAoAiwhAgsgAEJ/NwNwIAAgATYCaCAAIAQgAiABa6x8NwN4QX8PCyAEQgF8IQQgACgCBCEBIAAoAgghAwJAIAApA3AiBUIAUQ0AIAUgBH0iBSADIAFrrFkNACABIAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ6QUgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDpBSADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOkFIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDpBSADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ6QUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEN8FRQ0AIAMgBBDPBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDpBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEOEFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDfBUEASg0AAkAgASAJIAMgChDfBUUNACABIQQMAgsgBUHwAGogASACQgBCABDpBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ6QUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOkFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDpBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ6QUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EOkFIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkGMygFqKAIAIQYgAkGAygFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMoFIQILIAIQywUNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDKBSECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMoFIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAEIAiyQwAAgH+UEOMFIARBCGopAwAhCyAEKQMAIQoMAgsCQAJAAkAgCQ0AQQAhCQNAIAJBIHIgCUHAImosAABHDQECQCAJQQFLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2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QQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QaDvAWohBAJAAkACQAJAQQAoAvTsASIGQQEgAnQiA3ENAEEAIAYgA3I2AvTsASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCkO0BQX9qIgFBfyABGzYCkO0BCwsHAD8AQRB0C1QBAn9BACgC1M4BIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAENsFTQ0AIAAQFUUNAQtBACAANgLUzgEgAQ8LEJUFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDeBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ3gVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEN4FIAVBMGogCiABIAcQ6AUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDeBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDeBSAFIAIgBEEBIAZrEOgFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDmBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDnBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEN4FQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ3gUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ6gUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ6gUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ6gUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ6gUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ6gUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ6gUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ6gUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ6gUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ6gUgBUGQAWogA0IPhkIAIARCABDqBSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEOoFIAVBgAFqQgEgAn1CACAEQgAQ6gUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhDqBSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDqBSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEOgFIAVBMGogFiATIAZB8ABqEN4FIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEOoFIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ6gUgBSADIA5CBUIAEOoFIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDeBSACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDeBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEN4FIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEN4FIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEN4FQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEN4FIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEN4FIAVBIGogAiAEIAYQ3gUgBUEQaiASIAEgBxDoBSAFIAIgBCAHEOgFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDdBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ3gUgAiAAIARBgfgAIANrEOgFIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABB4PAFJANB4PABQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEPAAslAQF+IAAgASACrSADrUIghoQgBBD4BSEFIAVCIIinEO4FIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC4bPgYAAAwBBgAgLmMIBaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBkZXZzX2pzb25fc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBoZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAFVua25vd24gZW5jb2Rpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAHNtYWxsIGhlbGxvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBpc0FjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAHByb2dWZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAcHJvZ05hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAdXRmLTgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRl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IGNvbnN0IGRhdGEgPSBNb2R1bGUuZmxhc2hMb2FkKCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZygiZmxhc2ggbG9hZCwgc2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAOnygIAABG5hbWUB+XH7BQANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1EGRldnNfZmliZXJfeWllbGR2GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbncYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwSZGV2c19pbWdfcm9sZV9uYW1lfRFkZXZzX2ZpYmVyX2J5X3RhZ34QZGV2c19maWJlcl9zdGFydH8UZGV2c19maWJlcl90ZXJtaWFudGWAAQ5kZXZzX2ZpYmVyX3J1boEBE2RldnNfZmliZXJfc3luY19ub3eCAQpkZXZzX3BhbmljgwEVX2RldnNfaW52YWxpZF9wcm9ncmFthAEPZGV2c19maWJlcl9wb2tlhQEWZGV2c19nY19vYmpfY2hlY2tfY29yZYYBE2pkX2djX2FueV90cnlfYWxsb2OHAQdkZXZzX2djiAEPZmluZF9mcmVlX2Jsb2NriQESZGV2c19hbnlfdHJ5X2FsbG9jigEOZGV2c190cnlfYWxsb2OLAQtqZF9nY191bnBpbowBCmpkX2djX2ZyZWWNARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZI4BDmRldnNfdmFsdWVfcGlujwEQZGV2c192YWx1ZV91bnBpbpABEmRldnNfbWFwX3RyeV9hbGxvY5EBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5IBFGRldnNfYXJyYXlfdHJ5X2FsbG9jkwEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlAEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlQEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSWAQ9kZXZzX2djX3NldF9jdHiXAQ5kZXZzX2djX2NyZWF0ZZgBD2RldnNfZ2NfZGVzdHJveZkBEWRldnNfZ2Nfb2JqX2NoZWNrmgELc2Nhbl9nY19vYmqbARFwcm9wX0FycmF5X2xlbmd0aJwBEm1ldGgyX0FycmF5X2luc2VydJ0BEmZ1bjFfQXJyYXlfaXNBcnJheZ4BEG1ldGhYX0FycmF5X3B1c2ifARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WgARFtZXRoWF9BcnJheV9zbGljZaEBEWZ1bjFfQnVmZmVyX2FsbG9jogEQZnVuMV9CdWZmZXJfZnJvbaMBEnByb3BfQnVmZmVyX2xlbmd0aKQBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6UBE21ldGgzX0J1ZmZlcl9maWxsQXSmARNtZXRoNF9CdWZmZXJfYmxpdEF0pwEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCoARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOpARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SqARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSrARdmdW4yX0RldmljZVNjcmlwdF9wcmludKwBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXStARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludK4BGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByrwEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbmewARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXOxARRtZXRoMV9FcnJvcl9fX2N0b3JfX7IBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+zARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+0ARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7UBD3Byb3BfRXJyb3JfbmFtZbYBEW1ldGgwX0Vycm9yX3ByaW50twEPcHJvcF9Ec0ZpYmVyX2lkuAEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZLkBFG1ldGgxX0RzRmliZXJfcmVzdW1lugEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGW7ARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kvAERZnVuMF9Ec0ZpYmVyX3NlbGa9ARRtZXRoWF9GdW5jdGlvbl9zdGFydL4BF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlvwEScHJvcF9GdW5jdGlvbl9uYW1lwAEPZnVuMl9KU09OX3BhcnNlwQETZnVuM19KU09OX3N0cmluZ2lmecIBDmZ1bjFfTWF0aF9jZWlswwEPZnVuMV9NYXRoX2Zsb29yxAEPZnVuMV9NYXRoX3JvdW5kxQENZnVuMV9NYXRoX2Fic8YBEGZ1bjBfTWF0aF9yYW5kb23HARNmdW4xX01hdGhfcmFuZG9tSW50yAENZnVuMV9NYXRoX2xvZ8kBDWZ1bjJfTWF0aF9wb3fKAQ5mdW4yX01hdGhfaWRpdssBDmZ1bjJfTWF0aF9pbW9kzAEOZnVuMl9NYXRoX2ltdWzNAQ1mdW4yX01hdGhfbWluzgELZnVuMl9taW5tYXjPAQ1mdW4yX01hdGhfbWF40AESZnVuMl9PYmplY3RfYXNzaWdu0QEQZnVuMV9PYmplY3Rfa2V5c9IBE2Z1bjFfa2V5c19vcl92YWx1ZXPTARJmdW4xX09iamVjdF92YWx1ZXPUARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtUBEHByb3BfUGFja2V0X3JvbGXWARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVy1wETcHJvcF9QYWNrZXRfc2hvcnRJZNgBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleNkBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5k2gERcHJvcF9QYWNrZXRfZmxhZ3PbARVwcm9wX1BhY2tldF9pc0NvbW1hbmTcARRwcm9wX1BhY2tldF9pc1JlcG9ydN0BE3Byb3BfUGFja2V0X3BheWxvYWTeARNwcm9wX1BhY2tldF9pc0V2ZW503wEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl4AEUcHJvcF9QYWNrZXRfaXNSZWdTZXThARRwcm9wX1BhY2tldF9pc1JlZ0dldOIBE3Byb3BfUGFja2V0X3JlZ0NvZGXjARRwcm9wX1BhY2tldF9pc0FjdGlvbuQBFWRldnNfcGt0X3NwZWNfYnlfY29kZeUBEmRldnNfZ2V0X3NwZWNfY29kZeYBE21ldGgwX1BhY2tldF9kZWNvZGXnARJkZXZzX3BhY2tldF9kZWNvZGXoARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWTpARREc1JlZ2lzdGVyX3JlYWRfY29udOoBEmRldnNfcGFja2V0X2VuY29kZesBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXsARZwcm9wX0RzUGFja2V0SW5mb19yb2xl7QEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZe4BFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXvARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/wARNwcm9wX0RzUm9sZV9pc0JvdW5k8QEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k8gERbWV0aDBfRHNSb2xlX3dhaXTzARJwcm9wX1N0cmluZ19sZW5ndGj0ARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdPUBE21ldGgxX1N0cmluZ19jaGFyQXT2ARJtZXRoMl9TdHJpbmdfc2xpY2X3ARRkZXZzX2pkX2dldF9yZWdpc3RlcvgBFmRldnNfamRfY2xlYXJfcGt0X2tpbmT5ARBkZXZzX2pkX3NlbmRfY21k+gERZGV2c19qZF93YWtlX3JvbGX7ARRkZXZzX2pkX3Jlc2V0X3BhY2tldPwBE2RldnNfamRfcGt0X2NhcHR1cmX9ARNkZXZzX2pkX3NlbmRfbG9nbXNn/gESZGV2c19qZF9zaG91bGRfcnVu/wEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWAAhNkZXZzX2pkX3Byb2Nlc3NfcGt0gQIUZGV2c19qZF9yb2xlX2NoYW5nZWSCAhJkZXZzX2pkX2luaXRfcm9sZXODAhJkZXZzX2pkX2ZyZWVfcm9sZXOEAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3OFAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc4YCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc4cCEGRldnNfanNvbl9lc2NhcGWIAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWJAg9kZXZzX2pzb25fcGFyc2WKAgpqc29uX3ZhbHVliwIMcGFyc2Vfc3RyaW5njAINc3RyaW5naWZ5X29iao0CCmFkZF9pbmRlbnSOAg9zdHJpbmdpZnlfZmllbGSPAhNkZXZzX2pzb25fc3RyaW5naWZ5kAIRcGFyc2Vfc3RyaW5nX2NvcmWRAhFkZXZzX21hcGxpa2VfaXRlcpICF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0kwISZGV2c19tYXBfY29weV9pbnRvlAIMZGV2c19tYXBfc2V0lQIGbG9va3VwlgITZGV2c19tYXBsaWtlX2lzX21hcJcCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc5gCEWRldnNfYXJyYXlfaW5zZXJ0mQIIa3ZfYWRkLjGaAhJkZXZzX3Nob3J0X21hcF9zZXSbAg9kZXZzX21hcF9kZWxldGWcAhJkZXZzX3Nob3J0X21hcF9nZXSdAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJ4CDmRldnNfcm9sZV9zcGVjnwISZGV2c19mdW5jdGlvbl9iaW5koAIRZGV2c19tYWtlX2Nsb3N1cmWhAg5kZXZzX2dldF9mbmlkeKICE2RldnNfZ2V0X2ZuaWR4X2NvcmWjAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSkAhNkZXZzX2dldF9yb2xlX3Byb3RvpQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3pgIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkpwIVZGV2c19nZXRfc3RhdGljX3Byb3RvqAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvqQIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2qAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvqwIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkrAIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5krQIQZGV2c19pbnN0YW5jZV9vZq4CD2RldnNfb2JqZWN0X2dldK8CDGRldnNfc2VxX2dldLACDGRldnNfYW55X2dldLECDGRldnNfYW55X3NldLICDGRldnNfc2VxX3NldLMCDmRldnNfYXJyYXlfc2V0tAITZGV2c19hcnJheV9waW5fcHVzaLUCDGRldnNfYXJnX2ludLYCD2RldnNfYXJnX2RvdWJsZbcCD2RldnNfcmV0X2RvdWJsZbgCDGRldnNfcmV0X2ludLkCDWRldnNfcmV0X2Jvb2y6Ag9kZXZzX3JldF9nY19wdHK7AhFkZXZzX2FyZ19zZWxmX21hcLwCEWRldnNfc2V0dXBfcmVzdW1lvQIPZGV2c19jYW5fYXR0YWNovgIZZGV2c19idWlsdGluX29iamVjdF92YWx1Zb8CFWRldnNfbWFwbGlrZV90b192YWx1ZcACEmRldnNfcmVnY2FjaGVfZnJlZcECFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzCAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZMMCE2RldnNfcmVnY2FjaGVfYWxsb2PEAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cMUCEWRldnNfcmVnY2FjaGVfYWdlxgIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXHAhJkZXZzX3JlZ2NhY2hlX25leHTIAg9qZF9zZXR0aW5nc19nZXTJAg9qZF9zZXR0aW5nc19zZXTKAg5kZXZzX2xvZ192YWx1ZcsCD2RldnNfc2hvd192YWx1ZcwCEGRldnNfc2hvd192YWx1ZTDNAg1jb25zdW1lX2NodW5rzgINc2hhXzI1Nl9jbG9zZc8CD2pkX3NoYTI1Nl9zZXR1cNACEGpkX3NoYTI1Nl91cGRhdGXRAhBqZF9zaGEyNTZfZmluaXNo0gIUamRfc2hhMjU2X2htYWNfc2V0dXDTAhVqZF9zaGEyNTZfaG1hY19maW5pc2jUAg5qZF9zaGEyNTZfaGtkZtUCDmRldnNfc3RyZm9ybWF01gIOZGV2c19pc19zdHJpbmfXAg5kZXZzX2lzX251bWJlctgCFGRldnNfc3RyaW5nX2dldF91dGY42QITZGV2c19idWlsdGluX3N0cmluZ9oCFGRldnNfc3RyaW5nX3ZzcHJpbnRm2wITZGV2c19zdHJpbmdfc3ByaW50ZtwCFWRldnNfc3RyaW5nX2Zyb21fdXRmON0CFGRldnNfdmFsdWVfdG9fc3RyaW5n3gIQYnVmZmVyX3RvX3N0cmluZ98CGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTgAhJkZXZzX3N0cmluZ19jb25jYXThAhFkZXZzX3N0cmluZ19zbGljZeICEmRldnNfcHVzaF90cnlmcmFtZeMCEWRldnNfcG9wX3RyeWZyYW1l5AIPZGV2c19kdW1wX3N0YWNr5QITZGV2c19kdW1wX2V4Y2VwdGlvbuYCCmRldnNfdGhyb3fnAhJkZXZzX3Byb2Nlc3NfdGhyb3foAhBkZXZzX2FsbG9jX2Vycm9y6QIVZGV2c190aHJvd190eXBlX2Vycm9y6gIWZGV2c190aHJvd19yYW5nZV9lcnJvcusCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcuwCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y7QIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh07gIYZGV2c190aHJvd190b29fYmlnX2Vycm9y7wIXZGV2c190aHJvd19zeW50YXhfZXJyb3LwAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl8QITZGV2c192YWx1ZV9mcm9tX2ludPICFGRldnNfdmFsdWVfZnJvbV9ib29s8wIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXL0AhRkZXZzX3ZhbHVlX3RvX2RvdWJsZfUCEWRldnNfdmFsdWVfdG9faW509gISZGV2c192YWx1ZV90b19ib29s9wIOZGV2c19pc19idWZmZXL4AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfkCEGRldnNfYnVmZmVyX2RhdGH6AhNkZXZzX2J1ZmZlcmlzaF9kYXRh+wIUZGV2c192YWx1ZV90b19nY19vYmr8Ag1kZXZzX2lzX2FycmF5/QIRZGV2c192YWx1ZV90eXBlb2b+Ag9kZXZzX2lzX251bGxpc2j/AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVkgAMUZGV2c192YWx1ZV9hcHByb3hfZXGBAxJkZXZzX3ZhbHVlX2llZWVfZXGCAw1kZXZzX3ZhbHVlX2VxgwMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjhAMSZGV2c19pbWdfc3RyaWR4X29rhQMSZGV2c19kdW1wX3ZlcnNpb25zhgMLZGV2c192ZXJpZnmHAxFkZXZzX2ZldGNoX29wY29kZYgDDmRldnNfdm1fcmVzdW1liQMRZGV2c192bV9zZXRfZGVidWeKAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRziwMYZGV2c192bV9jbGVhcl9icmVha3BvaW50jAMPZGV2c192bV9zdXNwZW5kjQMWZGV2c192bV9zZXRfYnJlYWtwb2ludI4DFGRldnNfdm1fZXhlY19vcGNvZGVzjwMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiQAxFkZXZzX2ltZ19nZXRfdXRmOJEDFGRldnNfZ2V0X3N0YXRpY191dGY4kgMPZGV2c192bV9yb2xlX29rkwMUZGV2c192YWx1ZV9idWZmZXJpc2iUAwxleHByX2ludmFsaWSVAxRleHByeF9idWlsdGluX29iamVjdJYDC3N0bXQxX2NhbGwwlwMLc3RtdDJfY2FsbDGYAwtzdG10M19jYWxsMpkDC3N0bXQ0X2NhbGwzmgMLc3RtdDVfY2FsbDSbAwtzdG10Nl9jYWxsNZwDC3N0bXQ3X2NhbGw2nQMLc3RtdDhfY2FsbDeeAwtzdG10OV9jYWxsOJ8DEnN0bXQyX2luZGV4X2RlbGV0ZaADDHN0bXQxX3JldHVybqEDCXN0bXR4X2ptcKIDDHN0bXR4MV9qbXBfeqMDCmV4cHIyX2JpbmSkAxJleHByeF9vYmplY3RfZmllbGSlAxJzdG10eDFfc3RvcmVfbG9jYWymAxNzdG10eDFfc3RvcmVfZ2xvYmFspwMSc3RtdDRfc3RvcmVfYnVmZmVyqAMJZXhwcjBfaW5mqQMQZXhwcnhfbG9hZF9sb2NhbKoDEWV4cHJ4X2xvYWRfZ2xvYmFsqwMLZXhwcjFfdXBsdXOsAwtleHByMl9pbmRleK0DD3N0bXQzX2luZGV4X3NldK4DFGV4cHJ4MV9idWlsdGluX2ZpZWxkrwMSZXhwcngxX2FzY2lpX2ZpZWxksAMRZXhwcngxX3V0ZjhfZmllbGSxAxBleHByeF9tYXRoX2ZpZWxksgMOZXhwcnhfZHNfZmllbGSzAw9zdG10MF9hbGxvY19tYXC0AxFzdG10MV9hbGxvY19hcnJhebUDEnN0bXQxX2FsbG9jX2J1ZmZlcrYDEWV4cHJ4X3N0YXRpY19yb2xltwMTZXhwcnhfc3RhdGljX2J1ZmZlcrgDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ7kDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbme6AxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbme7AxVleHByeF9zdGF0aWNfZnVuY3Rpb268Aw1leHByeF9saXRlcmFsvQMRZXhwcnhfbGl0ZXJhbF9mNjS+AxBleHByeF9yb2xlX3Byb3RvvwMRZXhwcjNfbG9hZF9idWZmZXLAAw1leHByMF9yZXRfdmFswQMMZXhwcjFfdHlwZW9mwgMPZXhwcjBfdW5kZWZpbmVkwwMSZXhwcjFfaXNfdW5kZWZpbmVkxAMKZXhwcjBfdHJ1ZcUDC2V4cHIwX2ZhbHNlxgMNZXhwcjFfdG9fYm9vbMcDCWV4cHIwX25hbsgDCWV4cHIxX2Fic8kDDWV4cHIxX2JpdF9ub3TKAwxleHByMV9pc19uYW7LAwlleHByMV9uZWfMAwlleHByMV9ub3TNAwxleHByMV90b19pbnTOAwlleHByMl9hZGTPAwlleHByMl9zdWLQAwlleHByMl9tdWzRAwlleHByMl9kaXbSAw1leHByMl9iaXRfYW5k0wMMZXhwcjJfYml0X29y1AMNZXhwcjJfYml0X3hvctUDEGV4cHIyX3NoaWZ0X2xlZnTWAxFleHByMl9zaGlmdF9yaWdodNcDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk2AMIZXhwcjJfZXHZAwhleHByMl9sZdoDCGV4cHIyX2x02wMIZXhwcjJfbmXcAxBleHByMV9pc19udWxsaXNo3QMUc3RtdHgyX3N0b3JlX2Nsb3N1cmXeAxNleHByeDFfbG9hZF9jbG9zdXJl3wMSZXhwcnhfbWFrZV9jbG9zdXJl4AMQZXhwcjFfdHlwZW9mX3N0cuEDE3N0bXR4X2ptcF9yZXRfdmFsX3riAxBzdG10Ml9jYWxsX2FycmF54wMJc3RtdHhfdHJ55AMNc3RtdHhfZW5kX3RyeeUDC3N0bXQwX2NhdGNo5gMNc3RtdDBfZmluYWxseecDC3N0bXQxX3Rocm936AMOc3RtdDFfcmVfdGhyb3fpAxBzdG10eDFfdGhyb3dfam1w6gMOc3RtdDBfZGVidWdnZXLrAwlleHByMV9uZXfsAxFleHByMl9pbnN0YW5jZV9vZu0DCmV4cHIwX251bGzuAw9leHByMl9hcHByb3hfZXHvAw9leHByMl9hcHByb3hfbmXwAxNzdG10MV9zdG9yZV9yZXRfdmFs8QMPZGV2c192bV9wb3BfYXJn8gMTZGV2c192bV9wb3BfYXJnX3UzMvMDE2RldnNfdm1fcG9wX2FyZ19pMzL0AxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy9QMSamRfYWVzX2NjbV9lbmNyeXB09gMSamRfYWVzX2NjbV9kZWNyeXB09wMMQUVTX2luaXRfY3R4+AMPQUVTX0VDQl9lbmNyeXB0+QMQamRfYWVzX3NldHVwX2tlefoDDmpkX2Flc19lbmNyeXB0+wMQamRfYWVzX2NsZWFyX2tlefwDC2pkX3dzc2tfbmV3/QMUamRfd3Nza19zZW5kX21lc3NhZ2X+AxNqZF93ZWJzb2NrX29uX2V2ZW50/wMHZGVjcnlwdIAEDWpkX3dzc2tfY2xvc2WBBBBqZF93c3NrX29uX2V2ZW50ggQLcmVzcF9zdGF0dXODBBJ3c3NraGVhbHRoX3Byb2Nlc3OEBBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZYUEFHdzc2toZWFsdGhfcmVjb25uZWN0hgQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0hwQPc2V0X2Nvbm5fc3RyaW5niAQRY2xlYXJfY29ubl9zdHJpbmeJBA93c3NraGVhbHRoX2luaXSKBBF3c3NrX3NlbmRfbWVzc2FnZYsEEXdzc2tfaXNfY29ubmVjdGVkjAQUd3Nza190cmFja19leGNlcHRpb26NBBJ3c3NrX3NlcnZpY2VfcXVlcnmOBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpljwQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZZAED3JvbGVtZ3JfcHJvY2Vzc5EEEHJvbGVtZ3JfYXV0b2JpbmSSBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSTBBRqZF9yb2xlX21hbmFnZXJfaW5pdJQEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZJUEDWpkX3JvbGVfYWxsb2OWBBBqZF9yb2xlX2ZyZWVfYWxslwQWamRfcm9sZV9mb3JjZV9hdXRvYmluZJgEE2pkX2NsaWVudF9sb2dfZXZlbnSZBBNqZF9jbGllbnRfc3Vic2NyaWJlmgQUamRfY2xpZW50X2VtaXRfZXZlbnSbBBRyb2xlbWdyX3JvbGVfY2hhbmdlZJwEEGpkX2RldmljZV9sb29rdXCdBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WeBBNqZF9zZXJ2aWNlX3NlbmRfY21knwQRamRfY2xpZW50X3Byb2Nlc3OgBA5qZF9kZXZpY2VfZnJlZaEEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0ogQPamRfZGV2aWNlX2FsbG9jowQQc2V0dGluZ3NfcHJvY2Vzc6QEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXSlBA1zZXR0aW5nc19pbml0pgQPamRfY3RybF9wcm9jZXNzpwQVamRfY3RybF9oYW5kbGVfcGFja2V0qAQMamRfY3RybF9pbml0qQQUZGNmZ19zZXRfdXNlcl9jb25maWeqBAlkY2ZnX2luaXSrBA1kY2ZnX3ZhbGlkYXRlrAQOZGNmZ19nZXRfZW50cnmtBAxkY2ZnX2dldF9pMzKuBAxkY2ZnX2dldF91MzKvBA9kY2ZnX2dldF9zdHJpbmewBAxkY2ZnX2lkeF9rZXmxBAlqZF92ZG1lc2eyBBFqZF9kbWVzZ19zdGFydHB0crMEDWpkX2RtZXNnX3JlYWS0BBJqZF9kbWVzZ19yZWFkX2xpbmW1BBNqZF9zZXR0aW5nc19nZXRfYmlutgQNamRfZnN0b3JfaW5pdLcEE2pkX3NldHRpbmdzX3NldF9iaW64BAtqZF9mc3Rvcl9nY7kED3JlY29tcHV0ZV9jYWNoZboEFWpkX3NldHRpbmdzX2dldF9sYXJnZbsEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2W8BBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZb0EFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2W+BA1qZF9pcGlwZV9vcGVuvwQWamRfaXBpcGVfaGFuZGxlX3BhY2tldMAEDmpkX2lwaXBlX2Nsb3NlwQQSamRfbnVtZm10X2lzX3ZhbGlkwgQVamRfbnVtZm10X3dyaXRlX2Zsb2F0wwQTamRfbnVtZm10X3dyaXRlX2kzMsQEEmpkX251bWZtdF9yZWFkX2kzMsUEFGpkX251bWZtdF9yZWFkX2Zsb2F0xgQRamRfb3BpcGVfb3Blbl9jbWTHBBRqZF9vcGlwZV9vcGVuX3JlcG9ydMgEFmpkX29waXBlX2hhbmRsZV9wYWNrZXTJBBFqZF9vcGlwZV93cml0ZV9leMoEEGpkX29waXBlX3Byb2Nlc3PLBBRqZF9vcGlwZV9jaGVja19zcGFjZcwEDmpkX29waXBlX3dyaXRlzQQOamRfb3BpcGVfY2xvc2XOBA1qZF9xdWV1ZV9wdXNozwQOamRfcXVldWVfZnJvbnTQBA5qZF9xdWV1ZV9zaGlmdNEEDmpkX3F1ZXVlX2FsbG9j0gQNamRfcmVzcG9uZF91ONMEDmpkX3Jlc3BvbmRfdTE21AQOamRfcmVzcG9uZF91MzLVBBFqZF9yZXNwb25kX3N0cmluZ9YEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk1wQLamRfc2VuZF9wa3TYBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbNkEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy2gQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldNsEFGpkX2FwcF9oYW5kbGVfcGFja2V03AQVamRfYXBwX2hhbmRsZV9jb21tYW5k3QQVYXBwX2dldF9pbnN0YW5jZV9uYW1l3gQTamRfYWxsb2NhdGVfc2VydmljZd8EEGpkX3NlcnZpY2VzX2luaXTgBA5qZF9yZWZyZXNoX25vd+EEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTiBBRqZF9zZXJ2aWNlc19hbm5vdW5jZeMEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l5AQQamRfc2VydmljZXNfdGlja+UEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+YEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl5wQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZegEFGFwcF9nZXRfZGV2aWNlX2NsYXNz6QQSYXBwX2dldF9md192ZXJzaW9u6gQNamRfc3J2Y2ZnX3J1busEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l7AQRamRfc3J2Y2ZnX3ZhcmlhbnTtBA1qZF9oYXNoX2ZudjFh7gQMamRfZGV2aWNlX2lk7wQJamRfcmFuZG9t8AQIamRfY3JjMTbxBA5qZF9jb21wdXRlX2NyY/IEDmpkX3NoaWZ0X2ZyYW1l8wQMamRfd29yZF9tb3Zl9AQOamRfcmVzZXRfZnJhbWX1BBBqZF9wdXNoX2luX2ZyYW1l9gQNamRfcGFuaWNfY29yZfcEE2pkX3Nob3VsZF9zYW1wbGVfbXP4BBBqZF9zaG91bGRfc2FtcGxl+QQJamRfdG9faGV4+gQLamRfZnJvbV9oZXj7BA5qZF9hc3NlcnRfZmFpbPwEB2pkX2F0b2n9BAtqZF92c3ByaW50Zv4ED2pkX3ByaW50X2RvdWJsZf8ECmpkX3NwcmludGaABRJqZF9kZXZpY2Vfc2hvcnRfaWSBBQxqZF9zcHJpbnRmX2GCBQtqZF90b19oZXhfYYMFCWpkX3N0cmR1cIQFCWpkX21lbWR1cIUFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWGBRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlhwURamRfc2VuZF9ldmVudF9leHSIBQpqZF9yeF9pbml0iQUUamRfcnhfZnJhbWVfcmVjZWl2ZWSKBR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4sFD2pkX3J4X2dldF9mcmFtZYwFE2pkX3J4X3JlbGVhc2VfZnJhbWWNBRFqZF9zZW5kX2ZyYW1lX3Jhd44FDWpkX3NlbmRfZnJhbWWPBQpqZF90eF9pbml0kAUHamRfc2VuZJEFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOSBQ9qZF90eF9nZXRfZnJhbWWTBRBqZF90eF9mcmFtZV9zZW50lAULamRfdHhfZmx1c2iVBRBfX2Vycm5vX2xvY2F0aW9ulgUMX19mcGNsYXNzaWZ5lwUFZHVtbXmYBQhfX21lbWNweZkFB21lbW1vdmWaBQZtZW1zZXSbBQpfX2xvY2tmaWxlnAUMX191bmxvY2tmaWxlnQUGZmZsdXNongUEZm1vZJ8FDV9fRE9VQkxFX0JJVFOgBQxfX3N0ZGlvX3NlZWuhBQ1fX3N0ZGlvX3dyaXRlogUNX19zdGRpb19jbG9zZaMFCF9fdG9yZWFkpAUJX190b3dyaXRlpQUJX19md3JpdGV4pgUGZndyaXRlpwUUX19wdGhyZWFkX211dGV4X2xvY2uoBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrqQUGX19sb2NrqgUIX191bmxvY2urBQ5fX21hdGhfZGl2emVyb6wFCmZwX2JhcnJpZXKtBQ5fX21hdGhfaW52YWxpZK4FA2xvZ68FBXRvcDE2sAUFbG9nMTCxBQdfX2xzZWVrsgUGbWVtY21wswUKX19vZmxfbG9ja7QFDF9fb2ZsX3VubG9ja7UFDF9fbWF0aF94Zmxvd7YFDGZwX2JhcnJpZXIuMbcFDF9fbWF0aF9vZmxvd7gFDF9fbWF0aF91Zmxvd7kFBGZhYnO6BQNwb3e7BQV0b3AxMrwFCnplcm9pbmZuYW69BQhjaGVja2ludL4FDGZwX2JhcnJpZXIuMr8FCmxvZ19pbmxpbmXABQpleHBfaW5saW5lwQULc3BlY2lhbGNhc2XCBQ1mcF9mb3JjZV9ldmFswwUFcm91bmTEBQZzdHJjaHLFBQtfX3N0cmNocm51bMYFBnN0cmNtcMcFBnN0cmxlbsgFB19fdWZsb3fJBQdfX3NobGltygUIX19zaGdldGPLBQdpc3NwYWNlzAUGc2NhbGJuzQUJY29weXNpZ25szgUHc2NhbGJubM8FDV9fZnBjbGFzc2lmeWzQBQVmbW9kbNEFBWZhYnNs0gULX19mbG9hdHNjYW7TBQhoZXhmbG9hdNQFCGRlY2Zsb2F01QUHc2NhbmV4cNYFBnN0cnRveNcFBnN0cnRvZNgFEl9fd2FzaV9zeXNjYWxsX3JldNkFCGRsbWFsbG9j2gUGZGxmcmVl2wUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl3AUEc2Jya90FCF9fYWRkdGYz3gUJX19hc2hsdGkz3wUHX19sZXRmMuAFB19fZ2V0ZjLhBQhfX2RpdnRmM+IFDV9fZXh0ZW5kZGZ0ZjLjBQ1fX2V4dGVuZHNmdGYy5AULX19mbG9hdHNpdGblBQ1fX2Zsb2F0dW5zaXRm5gUNX19mZV9nZXRyb3VuZOcFEl9fZmVfcmFpc2VfaW5leGFjdOgFCV9fbHNocnRpM+kFCF9fbXVsdGYz6gUIX19tdWx0aTPrBQlfX3Bvd2lkZjLsBQhfX3N1YnRmM+0FDF9fdHJ1bmN0ZmRmMu4FC3NldFRlbXBSZXQw7wULZ2V0VGVtcFJldDDwBQlzdGFja1NhdmXxBQxzdGFja1Jlc3RvcmXyBQpzdGFja0FsbG9j8wUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudPQFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdPUFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWX2BRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl9wUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k+AUMZHluQ2FsbF9qaWpp+QUWbGVnYWxzdHViJGR5bkNhbGxfamlqafoFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfgFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
