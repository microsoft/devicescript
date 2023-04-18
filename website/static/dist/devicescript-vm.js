
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA5mGgIAAlwYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDAYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgIAAwMDBgAAAAEAAgYABgYDAgIDAgIDBAMDAwkFBgIIAAIBAQAAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAQMAAAEBAQEACgACAgABAQEAAQEAAQEAAAEAAAAABQICBQoAAQABAQIEBgEOAgAAAAAACAMJCgICCgIDAAUJAwEFBgMFCQUFBgUBAQEDAwYDAwMFBQUJDAUDAwYGAwMDAwUGBQUFBQUFAQMPEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEAwYCBQUFAQEFBQoBAwICAQAKBQUBBQUBBQYDAwQEAwwRAgIFDwMDAwMGBgMDAwQEBgYGAQMAAwMEAgADAAIGAAQDBgYFAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKDAICAAAHCQkBAwcBAgAIAAIFAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwYCCAYGBgQHBgcDAwYIBgAABB8BAw8DAwAJBwMGBAMEAAQDAwMDBAQGBgAAAAQEBwcHBwQHBwcICAgHBAQDDggDAAQBAAkBAwMBAwUEDCAJCRcDAwQDBwcFBwQECAAEBAcJBwgABwgTBAYGBgQABBghEAYEBAQGCQQEAAAUCwsLEwsQBggHIgsUFAsYExISCyMkJSYLAwMDBAYDAwMDAwQXBAQZDRUnDSgFFikqBQ8EBAAIBA0VGhoNESsCAggIFQ0NGQ0sAAgIAAQIBwgICC0MLgSHgICAAAFwAeoB6gEFhoCAgAABAYACgAIG3YCAgAAOfwFBsPkFC38BQQALfwFBAAt/AUEAC38AQajXAQt/AEGX2AELfwBB4dkBC38AQd3aAQt/AEHZ2wELfwBBqdwBC38AQcrcAQt/AEHP3gELfwBBqNcBC38AQcXfAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAIwGFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgDCBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQCNBhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoAMoFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACnBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAKgGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAqQYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAKoGCXN0YWNrU2F2ZQCjBgxzdGFja1Jlc3RvcmUApAYKc3RhY2tBbGxvYwClBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50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KQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEIADIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEJMCIAFBIGokAAsOACAAIABBABDYAhDZAgsPACAAIABBABDYAp0Q2QILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahCoA0UNACABIAEpA2g3AxAgASAAIAFBEGoQ7QI2AgBBmBggARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEIADIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABD7AiECIAEgASkDaDcDMCABIAAgAUEwahDtAjYCJCABIAI2AiBByhggAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEIADIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEPsCIgJFDQAgAiABQSBqENsEIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlgEQnQMgACgCrAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPAAboQmgMgACgCrAEgASkDCDcDICABQRBqJAALoQECAX8BfiMAQTBrIgEkACABIABB2ABqKQMAIgI3AyggASACNwMQAkACQAJAIAAgAUEQakGPARCsA0UNABCaBSECDAELIAEgASkDKDcDCCAAIAFBCGpBmwEQrANFDQEQmQIhAgsgAUEINgIAIAEgAjcDICABIAFBIGo2AgQgAUEYaiAAQdEfIAEQ/gIgACgCrAEgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAENcCIQIgASAAQeAAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahDcASIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABCRAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8QkQMMAQsgAEGxAmogAjoAACAAQbICaiADLwEQOwEAIABBqAJqIAMpAwg3AgAgAy0AFCECIABBsAJqIAQ6AAAgAEGnAmogAjoAACAAQbQCaiADKAIcQQxqIAQQxQUaIAAQkgILIAFBIGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEN0CIgJFDQACQCACKAIEDQAgAiAAQRwQrAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEPwCCyABIAEpAwg3AwAgACACQfYAIAEQggMgACACENwCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDdAiICRQ0AAkAgAigCBA0AIAIgAEEgEKwCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABD8AgsgASABKQMINwMAIAAgAkH2ACABEIIDIAAgAhDcAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ3QIiAkUNAAJAIAIoAgQNACACIABBHhCsAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQ/AILIAEgASkDCDcDACAAIAJB9gAgARCCAyAAIAIQ3AILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEN0CIgJFDQACQCACKAIEDQAgAiAAQSIQrAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQYQBEPwCCyABIAEpAwg3AwAgACACQfYAIAEQggMgACACENwCCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQxQICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEMUCCyADQSBqJAALNAIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQiAMgABBZIAFBEGokAAumAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEI8DQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFB6zRBABCNAwsgAiEBCwJAAkAgASIBRQ0AIAAgASgCHBCbAwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEI8DQQAhAQwBCwJAIAEgAygCEBB9IgINACADQRhqIAFB6zRBABCNAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhCcAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEI8DQQAhAgwBCwJAIAAgASgCEBB9IgINACABQRhqIABB6zRBABCNAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBtTZBABCNAwwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCPA0EAIQAMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQes0QQAQjQMLIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAqwBIQIgASAAQdgAaikDACIENwMAIAEgBDcDCCAAIAEQqQEhAyAAKAKsASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABB1idBABCNAwwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahDDAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB/SEgA0EIahCQAwwBCyAAIAEgASgCoAEgBEH//wNxELYCIAApAwBCAFINACADQdgAaiABQQggASABQQIQrAIQjwEQnQMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEPwCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahDTAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQtAIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahDDAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQjwMMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGI1gFODQIgAEHQ6wAgAUEDdGovAQAQ/AIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtB0xRBnD5BMUH1LhCnBQAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahCoAw0AIAFBOGogAEGTGxCOAwsgASABKQNINwMgIAFBOGogACABQSBqEIADIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjQEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ+wIiAkUNACABQTBqIAAgAiABKAI4QQEQowIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCOASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQ1wIhAiABIAEpAyA3AwgCQCABQQhqEKgDDQAgAUEYaiAAQf0cEI4DCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEKYCIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCeA5sQ2QILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQngOcENkC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AkUNACACKAIAQYCAgPgAcUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQjwMACyAAQaQCakEAQfwBEMcFGiAAQbICakEDOwEAIAIpAwghAyAAQbACakEEOgAAIABBqAJqIAM3AgAgAEG0AmogAi8BEDsBACAAQbYCaiACLwEWOwEAIAFBCGogACACLwESEJQCIAAoAqwBIAEpAwg3AyAgAUEgaiQAC6EBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahC8AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQjwMLAkACQCACDQAgAEIANwMADAELAkAgASACEL0CIgJBf0oNACAAQgA3AwAMAQsgACABIAIQtwILIANBMGokAAuPAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQvAIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEI8DCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqELwCIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCPAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwECEJsDCyADQTBqJAAL+AECA38BfiMAQTBrIgMkACADIAIpAwAiBjcDGCADIAY3AxACQAJAIAEgA0EQaiADQSxqELwCIgRFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCPAwsCQAJAIAQNACAAQgA3AwAMAQsCQAJAIAQvAQJBgOADcSIFRQ0AIAVBgCBHDQEgACACKQMANwMADAILAkAgASAEEL0CIgJBf0oNACAAQgA3AwAMAgsgACABIAEgASgApAEiBSAFKAJgaiACQQR0aiAELwECQf8fcUGAwAByEOwBELkCDAELIABCADcDAAsgA0EwaiQAC48CAgR/AX4jAEEwayIBJAAgASAAKQNQIgU3AxggASAF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ACADIAMpAyA3AwggA0EoaiABQbUdIANBCGoQkANBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahC8AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUG1HSADQQhqEJADQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQvAIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBtR0gA0EIahCQA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRCbAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQvAIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBtR0gAUEQahCQA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBqB0gAUEIahCQA0EAIQMLAkAgAyIDRQ0AIAAgAxD5ASAAIAEoAiQgAy8BAhCRAgsgAUHAAGokAAtvAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahCPAwwBCyAAIAEoArQBIAIoAgBBDGxqKAIAKAIQQQBHEJwDCyADQRBqJAALYwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQjwMMAQsgACABIAEgAigCABC+AhC4AgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahCPA0H//wEhAgwBCyABKAIoIQIL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QQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCCAQsgAkEBEKwCIQQgAyADKQMQNwMAIAAgAiAEIAMQzgIgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEJ0EAkACQCABKAJMIgMgACgCEC8BCEkNACACIAFB7wAQggEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQnQQCQAJAIAEoAkwiAyABKAKkAS8BDEkNACACIAFB8QAQggEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQnQQgARCeBCEDIAEQngQhBCACQRBqIAFBARCgBAJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEkLIAJBIGokAAsNACAAQQApA9h0NwMACzcBAX8CQCACKAJMIgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB8wAQggELOAEBfwJAIAIoAkwiAyACKAKkAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB9gAQggELcQEBfyMAQSBrIgMkACADQRhqIAIQnQQgAyADKQMYNwMQAkACQAJAIANBEGoQ+QINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEJ4DEJoDCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQnQQgA0EQaiACEJ0EIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxDSAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQnQQgAkEgaiABEJ0EIAJBGGogARCdBCACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACENMCIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEJ0EIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBCuAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQggELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCuAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBABCsAiEEIAMgAykDEDcDACAAIAIgBCADEM4CIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCuAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQggELIAJBFRCsAiEEIAMgAykDEDcDACAAIAIgBCADEM4CIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQrAIQjwEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQnQMgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEJ4EIgMQkQEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQnQMgAyACKQMINwMgIAJBEGokAAtQ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NgIQIAAgBCADKAIAdBCbAwssAQJ/IAJBGGoiAyACEJ8ENgIAIAIgAhCfBCIENgIQIAAgBCADKAIAdRCbAwtBAQJ/IAJBGGoiAyACEJ8ENgIAIAIgAhCfBCIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBCaAw8LIAAgAhCbAwudAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqwMhAgsgACACEJwDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCdBCACQRhqIgQgAykDGDcDACADQRhqIAIQnQQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQngM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJ4DIgY5AwAgAisDICAGZSECDAELIAUoAgAgBCgCAEwhAgsgACACEJwDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCdBCACQRhqIgQgAykDGDcDACADQRhqIAIQnQQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQngM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJ4DIgY5AwAgAisDICAGYyECDAELIAUoAgAgBCgCAEghAgsgACACEJwDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqwNBAXMhAgsgACACEJwDIANBIGokAAs+AQF/IwBBEGsiAyQAIANBCGogAhCdBCADIAMpAwg3AwAgAEHA9ABByPQAIAMQqQMbKQMANwMAIANBEGokAAviAQEF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QQAQjAMMAQsgACADKQMYNwMACyADQSBqJAAPC0HTFEHyPEHNAkH9CxCnBQALQfjYAEHyPEHSAkH9CxCnBQALVgECfyMAQSBrIgMkACADQRhqIAIQnQQgA0EQaiACEJ0EIAMgAykDGDcDCCACIANBCGoQzQIhBCADIAMpAxA3AwAgACACIAMgBBDPAhCcAyADQSBqJAALDQAgAEEAKQPgdDcDAAudAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqgMhAgsgACACEJwDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQnQQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEJ0EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQqgNBAXMhAgsgACACEJwDIANBIGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCdBCABKAKsASACKQMINwMgIAJBEGokAAsuAQF/AkAgAigCTCIDIAIoAqQBLwEOSQ0AIAAgAkGAARCCAQ8LIAAgAiADELcCCz8BAX8CQCABLQBCIgINACAAIAFB7AAQggEPCyABIAJBf2oiAjoAQiAAIAEgAkH/AXFBA3RqQdAAaikDADcDAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQnwMhACABQRBqJAAgAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQggEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHQAGopAwA3AwgLIAEgASkDCDcDACAAIAEQnwMhACABQRBqJAAgAAuJAgICfwF+IwBBwABrIgMkAAJAAkAgAS0AQiIEDQAgA0E4aiABQewAEIIBDAELIAEgBEF/aiIEOgBCIAMgASAEQf8BcUEDdGpB0ABqKQMANwM4CyADIAMpAzg3AygCQAJAIAEgA0EoahChAw0AAkAgAkECcUUNACADIAMpAzg3AyAgASADQSBqEPgCDQELIAMgAykDODcDGCADQTBqIAFBEiADQRhqEI8DQgAhBQwBCwJAIAJBAXFFDQAgAyADKQM4NwMQIAEgA0EQahCiAw0AIAMgAykDODcDCCADQTBqIAFB0xwgA0EIahCQA0IAIQUMAQsgAykDOCEFCyAAIAU3AwAgA0HAAGokAAugBAEFfwJAIARB9v8DTw0AIAAQpQRBAEEBOgCg5wFBACABKQAANwCh5wFBACABQQVqIgUpAAA3AKbnAUEAIARBCHQgBEGA/gNxQQh2cjsBrucBQQBBCToAoOcBQaDnARCmBAJAIARFDQBBACEAA0ACQCAEIAAiBmsiAEEQIABBEEkbIgdFDQAgAyAGaiEIQQAhAANAIAAiAEGg5wFqIgkgCS0AACAIIABqLQAAczoAACAAQQFqIgkhACAJIAdHDQALC0Gg5wEQpgQgBkEQaiIJIQAgCSAESQ0ACwsgAkEAKAKg5wE2AABBAEEBOgCg5wFBACABKQAANwCh5wFBACAFKQAANwCm5wFBAEEAOwGu5wFBoOcBEKYEQQAhAANAIAIgACIAaiIJIAktAAAgAEGg5wFqLQAAczoAACAAQQFqIgkhACAJQQRHDQALAkAgBEUNACABQQVqIQVBACEAQQEhCQNAQQBBAToAoOcBQQAgASkAADcAoecBQQAgBSkAADcApucBQQAgCSIGQQh0IAZBgP4DcUEIdnI7Aa7nAUGg5wEQpgQCQCAEIAAiAmsiAEEQIABBEEkbIgdFDQAgAyACaiEIQQAhAANAIAggACIAaiIJIAktAAAgAEGg5wFqLQAAczoAACAAQQFqIgkhACAJIAdHDQALCyACQRBqIgchACAGQQFqIQkgByAESQ0ACwsQpwQPC0HQPkEyQfQOEKIFAAu/BQEGf0F/IQUCQCAEQfX/A0sNACAAEKUEAkACQCAERQ0AIAFBBWohBkEAIQBBASEHA0BBAEEBOgCg5wFBACABKQAANwCh5wFBACAGKQAANwCm5wFBACAHIghBCHQgCEGA/gNxQQh2cjsBrucBQaDnARCmBAJAIAQgACIJayIAQRAgAEEQSRsiBUUNACADIAlqIQpBACEAA0AgCiAAIgBqIgcgBy0AACAAQaDnAWotAABzOgAAIABBAWoiByEAIAcgBUcNAAsLIAlBEGoiBSEAIAhBAWohByAFIARJDQALQQBBAToAoOcBQQAgASkAADcAoecBQQAgAUEFaikAADcApucBQQBBCToAoOcBQQAgBEEIdCAEQYD+A3FBCHZyOwGu5wFBoOcBEKYEIARFDQFBACEAA0ACQCAEIAAiCGsiAEEQIABBEEkbIgVFDQAgAyAIaiEKQQAhAANAIAAiAEGg5wFqIgcgBy0AACAKIABqLQAAczoAACAAQQFqIgchACAHIAVHDQALC0Gg5wEQpgQgCEEQaiIHIQAgByAESQ0ADAILAAtBAEEBOgCg5wFBACABKQAANwCh5wFBACABQQVqKQAANwCm5wFBAEEJOgCg5wFBACAEQQh0IARBgP4DcUEIdnI7Aa7nAUGg5wEQpgQLQQAhAANAIAIgACIAaiIHIActAAAgAEGg5wFqLQAAczoAACAAQQFqIgchACAHQQRHDQALQQBBAToAoOcBQQAgASkAADcAoecBQQAgAUEFaikAADcApucBQQBBADsBrucBQaDnARCmBEEAIQADQCACIAAiAGoiByAHLQAAIABBoOcBai0AAHM6AAAgAEEBaiIHIQAgB0EERw0ACxCnBEEAIQBBACEHA0AgACIFQQFqIgohACAHIAIgBWotAABqIgUhByAFIQUgCkEERw0ACwsgBQvdAwEIf0EAIQIDQCAAIAIiA0ECdCICaiABIAJqLQAAOgAAIAAgAkEBciIEaiABIARqLQAAOgAAIAAgAkECciIEaiABIARqLQAAOgAAIAAgAkEDciICaiABIAJqLQAAOgAAIANBAWoiAyECIANBCEcNAAtBCCECA0AgAiIDQQJ0IgEgAGoiAkF/ai0AACEFIAJBfmotAAAhBiACQX1qLQAAIQcgAkF8ai0AACEIAkACQCADQQdxIgRFDQAgBSEJIAYhBSAHIQYgCCEHDAELIAhBsP4Aai0AACEJIAVBsP4Aai0AACEFIAZBsP4Aai0AACEGIANBA3ZBsIABai0AACAHQbD+AGotAABzIQcLIAchByAGIQYgBSEFIAkhCAJAAkAgBEEERg0AIAghBCAFIQUgBiEGIAchBwwBCyAIQf8BcUGw/gBqLQAAIQQgBUH/AXFBsP4Aai0AACEFIAZB/wFxQbD+AGotAAAhBiAHQf8BcUGw/gBqLQAAIQcLIAIgAkFgai0AACAHczoAACAAIAFBAXJqIAJBYWotAAAgBnM6AAAgACABQQJyaiACQWJqLQAAIAVzOgAAIAAgAUEDcmogAkFjai0AACAEczoAACADQQFqIgEhAiABQTxHDQALC8wFAQl/QQAhAgNAIAIiA0ECdCEEQQAhAgNAIAEgBGogAiICaiIFIAUtAAAgACACIARqai0AAHM6AAAgAkEBaiIFIQIgBUEERw0ACyADQQFqIgQhAiAEQQRHDQALQQEhAgNAIAIhBkEAIQIDQCACIQVBACECA0AgASACIgJBAnRqIAVqIgQgBC0AAEGw/gBqLQAAOgAAIAJBAWoiBCECIARBBEcNAAsgBUEBaiIEIQIgBEEERw0ACyABLQABIQIgASABLQAFOgABIAEtAAkhBCABIAEtAA06AAkgASAEOgAFIAEgAjoADSABLQACIQIgASABLQAKOgACIAEgAjoACiABLQAGIQIgASABLQAOOgAGIAEgAjoADiABLQADIQIgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASACOgAHAkAgBkEORg0AQQAhAgNAIAEgAiIHQQJ0aiICIAItAAMiBCACLQAAIgVzIgNBAXQgA8BBB3ZBG3FzIARzIAQgAi0AAiIDcyIIIAItAAEiCSAFcyIKcyIEczoAAyACIAMgCEEBdCAIwEEHdkEbcXNzIARzOgACIAIgCSADIAlzIgNBAXQgA8BBB3ZBG3FzcyAEczoAASACIAUgCkEBdCAKwEEHdkEbcXNzIARzOgAAIAdBAWoiBCECIARBBEcNAAsgBkEEdCEJQQAhAgNAIAIiCEECdCIFIAlqIQNBACECA0AgASAFaiACIgJqIgQgBC0AACAAIAMgAmpqLQAAczoAACACQQFqIgQhAiAEQQRHDQALIAhBAWoiBCECIARBBEcNAAsgBkEBaiECDAELC0EAIQIDQCACIghBAnQiBUHgAWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACwsLAEGw5wEgABCjBAsLAEGw5wEgABCkBAsPAEGw5wFBAEHwARDHBRoLzQEBBX8jAEEQayIEJABBACEFQQAhBgNAIAUgAyAGIgZqLQAAaiIHIQUgBkEBaiIIIQYgCEEgRw0ACwJAIAcNAEGc3QBBABA8QYk/QTBB8QsQogUAC0EAIAMpAAA3AKDpAUEAIANBGGopAAA3ALjpAUEAIANBEGopAAA3ALDpAUEAIANBCGopAAA3AKjpAUEAQQE6AODpAUHA6QFBEBApIARBwOkBQRAQrwU2AgAgACABIAJB9hUgBBCuBSIFEEMhBiAFECIgBEEQaiQAIAYL1wIBBH8jAEEQayIEJAACQAJAAkAQIw0AAkAgAA0AIAJFDQBBfyEFDAMLAkAgAEEAR0EALQDg6QEiBkECRnFFDQBBfyEFDAMLQX8hBSAARSAGQQNGcQ0CIAMgAWoiBkEEaiIHECEhBQJAIABFDQAgBSAAIAEQxQUaCwJAIAJFDQAgBSABaiACIAMQxQUaC0Gg6QFBwOkBIAUgBmogBSAGEKEEIAUgBxBCIQAgBRAiIAANAUEMIQIDQAJAIAIiAEHA6QFqIgUtAAAiAkH/AUYNACAAQcDpAWogAkEBajoAAEEAIQUMBAsgBUEAOgAAIABBf2ohAkEAIQUgAA0ADAMLAAtBiT9BpwFB8y8QogUACyAEQZEaNgIAQdMYIAQQPAJAQQAtAODpAUH/AUcNACAAIQUMAQtBAEH/AToA4OkBQQNBkRpBCRCtBBBIIAAhBQsgBEEQaiQAIAUL3QYCAn8BfiMAQZABayIDJAACQBAjDQACQAJAAkACQCAAQX5qDgMBAgADCwJAAkACQEEALQDg6QFBf2oOAwABAgULIAMgAjYCQEGj1wAgA0HAAGoQPAJAIAJBF0sNACADQZEhNgIAQdMYIAMQPEEALQDg6QFB/wFGDQVBAEH/AToA4OkBQQNBkSFBCxCtBBBIDAULIANB+ABqQRBqIAFBEGopAAA3AwAgA0H4AGpBCGogAUEIaikAADcDACADIAEpAAAiBTcDeAJAIAWnQcrRkPd8Rg0AIANBtjo2AjBB0xggA0EwahA8QQAtAODpAUH/AUYNBUEAQf8BOgDg6QFBA0G2OkEJEK0EEEgMBQsCQCADKAJ8QQJGDQAgA0HmIjYCIEHTGCADQSBqEDxBAC0A4OkBQf8BRg0FQQBB/wE6AODpAUEDQeYiQQsQrQQQSAwFC0EAQQBBoOkBQSBBwOkBQRAgA0GAAWpBEEGg6QEQ9gJBAEIANwDA6QFBAEIANwDQ6QFBAEIANwDI6QFBAEIANwDY6QFBAEECOgDg6QFBAEEBOgDA6QFBAEECOgDQ6QECQEEAQSBBAEEAEKkERQ0AIANB8iU2AhBB0xggA0EQahA8QQAtAODpAUH/AUYNBUEAQf8BOgDg6QFBA0HyJUEPEK0EEEgMBQtB4iVBABA8DAQLIAMgAjYCcEHC1wAgA0HwAGoQPAJAIAJBI0sNACADQYkONgJQQdMYIANB0ABqEDxBAC0A4OkBQf8BRg0EQQBB/wE6AODpAUEDQYkOQQ4QrQQQSAwECyABIAIQqwQNA0EAIQACQAJAIAEtAAANAEEAIQIDQCACIgRBAWoiAEEgRg0CIAAhAiABIABqLQAARQ0ACyAEQR5LIQALIAAhACADQcHOADYCYEHTGCADQeAAahA8AkBBAC0A4OkBQf8BRg0AQQBB/wE6AODpAUEDQcHOAEEKEK0EEEgLIABFDQQLQQBBAzoA4OkBQQFBAEEAEK0EDAMLIAEgAhCrBA0CQQQgASACQXxqEK0EDAILAkBBAC0A4OkBQf8BRg0AQQBBBDoA4OkBC0ECIAEgAhCtBAwBC0EAQf8BOgDg6QEQSEEDIAEgAhCtBAsgA0GQAWokAA8LQYk/QcABQZIQEKIFAAv+AQEDfyMAQSBrIgIkAAJAAkACQCABQQRLDQAgAkHMJzYCAEHTGCACEDxBzCchAUEALQDg6QFB/wFHDQFBfyEBDAILQaDpAUHQ6QEgACABQXxqIgFqIAAgARCiBCEDQQwhAAJAA0ACQCAAIgFB0OkBaiIALQAAIgRB/wFGDQAgAUHQ6QFqIARBAWo6AAAMAgsgAEEAOgAAIAFBf2ohACABDQALCwJAIAMNAEEAIQEMAgsgAkHbGjYCEEHTGCACQRBqEDxB2xohAUEALQDg6QFB/wFHDQBBfyEBDAELQQBB/wE6AODpAUEDIAFBCRCtBBBIQX8hAQsgAkEgaiQAIAELNAEBfwJAECMNAAJAQQAtAODpASIAQQRGDQAgAEH/AUYNABBICw8LQYk/QdoBQYctEKIFAAv5CAEEfyMAQYACayIDJABBACgC5OkBIQQCQAJAAkACQAJAIABBf2oOBAACAwEECyADIAQoAjg2AhBBjxcgA0EQahA8IARBgAI7ARAgBEEAKALs3wEiAEGAgIAIajYCNCAEIABBgICAEGo2AiggBC8BBkEBRg0DIANB6swANgIEIANBATYCAEHg1wAgAxA8IARBATsBBiAEQQMgBEEGakECELQFDAMLIARBACgC7N8BIgBBgICACGo2AjQgBCAAQYCAgBBqNgIoAkAgAkUNACADIAEtAAAiADoA/wEgAkF/aiEFIAFBAWohBgJAAkACQAJAAkACQAJAAkACQCAAQfB+ag4KAgMMBAUGBwEIAAgLIAEtAANBDGoiBCAFSw0IIAYgBBCxBSIEELoFGiAEECIMCwsgBUUNByABLQABIAFBAmogAkF+ahBXDAoLIAQvARAhAiAEIAEtAAJBCHQgAS0AASIAcjsBEAJAIABBAXFFDQAgBCgCZA0AIARBgAgQ/QQ2AmQLAkAgBC0AEEECcUUNACACQQJxDQAgBBDeBDYCGAsgBEEAKALs3wFBgICACGo2AhQgAyAELwEQNgJgQfsKIANB4ABqEDwMCQsgAyAAOgDQASAELwEGQQFHDQgCQCAAQeUAakH/AXFB/QFLDQAgAyAANgJwQfwJIANB8ABqEDwLIANB0AFqQQFBAEEAEKkEDQggBCgCDCIARQ0IIARBACgC6PIBIABqNgIwDAgLIANB0AFqEGwaQQAoAuTpASIELwEGQQFHDQcCQCADLQD/ASIAQeUAakH/AXFB/QFLDQAgAyAANgKAAUH8CSADQYABahA8CyADQf8BakEBIANB0AFqQSAQqQQNByAEKAIMIgBFDQcgBEEAKALo8gEgAGo2AjAMBwsgACABIAYgBRDGBSgCABBqEK4EDAYLIAAgASAGIAUQxgUgBRBrEK4EDAULQZYBQQBBABBrEK4EDAQLIAMgADYCUEHkCiADQdAAahA8IANB/wE6ANABQQAoAuTpASIELwEGQQFHDQMgA0H/ATYCQEH8CSADQcAAahA8IANB0AFqQQFBAEEAEKkEDQMgBCgCDCIARQ0DIARBACgC6PIBIABqNgIwDAMLIAMgAjYCMEHvOCADQTBqEDwgA0H/AToA0AFBACgC5OkBIgQvAQZBAUcNAiADQf8BNgIgQfwJIANBIGoQPCADQdABakEBQQBBABCpBA0CIAQoAgwiAEUNAiAEQQAoAujyASAAajYCMAwCCyADIAQoAjg2AqABQYI1IANBoAFqEDwgBCAEQRFqLQAAQQh0OwEQIAQvAQZBAkYNASADQefMADYClAEgA0ECNgKQAUHg1wAgA0GQAWoQPCAEQQI7AQYgBEEDIARBBmpBAhC0BQwBCyADIAEgAhChAjYCwAFBgxYgA0HAAWoQPCAELwEGQQJGDQAgA0HnzAA2ArQBIANBAjYCsAFB4NcAIANBsAFqEDwgBEECOwEGIARBAyAEQQZqQQIQtAULIANBgAJqJAAL6wEBAX8jAEEwayICJAACQAJAIAENACACIAA6AC5BACgC5OkBIgEvAQZBAUcNAQJAIABB5QBqQf8BcUH9AUsNACACIABB/wFxNgIAQfwJIAIQPAsgAkEuakEBQQBBABCpBA0BIAEoAgwiAEUNASABQQAoAujyASAAajYCMAwBCyACIAA2AiBB5AkgAkEgahA8IAJB/wE6AC9BACgC5OkBIgAvAQZBAUcNACACQf8BNgIQQfwJIAJBEGoQPCACQS9qQQFBAEEAEKkEDQAgACgCDCIBRQ0AIABBACgC6PIBIAFqNgIwCyACQTBqJAALyQUBB38jAEEQayIBJAACQAJAIAAoAgxFDQBBACgC6PIBIAAoAjBrQQBODQELAkAgAEEUakGAgIAIEKQFRQ0AIAAtABBFDQBBnDVBABA8IAAgAEERai0AAEEIdDsBEAsCQCAALQAQQQJxRQ0AQQAoAqTqASAAKAIcRg0AIAEgACgCGDYCCAJAIAAoAiANACAAQYACECE2AiALIAAoAiBBgAIgAUEIahDfBCECQQAoAqTqASEDIAJFDQAgASgCCCEEIAAoAiAhBSABQZoBOgANQZx/IQYCQEEAKALk6QEiBy8BBkEBRw0AIAFBDWpBASAFIAIQqQQiAiEGIAINAAJAIAcoAgwiAg0AQQAhBgwBCyAHQQAoAujyASACajYCMEEAIQYLIAYNACAAIAEoAgg2AhggAyAERw0AIABBACgCpOoBNgIcCwJAIAAoAmRFDQAgACgCZBD7BCICRQ0AIAIhAgNAIAIhAgJAIAAtABBBAXFFDQAgAi0AAiEDIAFBmQE6AA5BnH8hBgJAQQAoAuTpASIFLwEGQQFHDQAgAUEOakEBIAIgA0EMahCpBCICIQYgAg0AAkAgBSgCDCICDQBBACEGDAELIAVBACgC6PIBIAJqNgIwQQAhBgsgBg0CCyAAKAJkEPwEIAAoAmQQ+wQiBiECIAYNAAsLAkAgAEE0akGAgIACEKQFRQ0AIAFBkgE6AA9BACgC5OkBIgIvAQZBAUcNACABQZIBNgIAQfwJIAEQPCABQQ9qQQFBAEEAEKkEDQAgAigCDCIGRQ0AIAJBACgC6PIBIAZqNgIwCwJAIABBJGpBgIAgEKQFRQ0AQZsEIQICQBCwBEUNACAALwEGQQJ0QcCAAWooAgAhAgsgAhAfCwJAIABBKGpBgIAgEKQFRQ0AIAAQsQQLIABBLGogACgCCBCjBRogAUEQaiQADwtB5xFBABA8EDUACwQAQQELlQIBBH8jAEEwayIBJAAgAEEGaiECAkACQAJAIAAvAQZBfmoOAwIAAQALIAFBqssANgIkIAFBBDYCIEHg1wAgAUEgahA8IABBBDsBBiAAQQMgAkECELQFCxCsBAsCQCAAKAI4RQ0AELAERQ0AIAAoAjghAyAALwFgIQQgASAAKAI8NgIYIAEgBDYCFCABIAM2AhBBphYgAUEQahA8IAAoAjggAC8BYCAAKAI8IABBwABqEKgEDQACQCACLwEAQQNGDQAgAUGtywA2AgQgAUEDNgIAQeDXACABEDwgAEEDOwEGIABBAyACQQIQtAULIABBACgC7N8BIgJBgICACGo2AjQgACACQYCAgBBqNgIoCyABQTBqJAAL/QIBAn8jAEEQayICJAACQAJAAkACQAJAAkACQAJAAkAgAS8BDiIDQf9+ag4GAgMHBwcBAAsgA0GAXWoOBAMFBgQGCyAAIAFBEGogAS0ADEEBELMEDAYLIAAQsQQMBQsCQAJAIAAvAQZBfmoOAwYAAQALIAJBqssANgIEIAJBBDYCAEHg1wAgAhA8IABBBDsBBiAAQQMgAEEGakECELQFCxCsBAwECyABIAAoAjgQgQUaDAMLIAFBwsoAEIEFGgwCCwJAAkAgACgCPCIADQBBACEADAELIABBAEEGIABBoNUAQQYQ3wUbaiEACyABIAAQgQUaDAELIAAgAUHUgAEQhAVBfnFBgAFHDQACQCAAKAIIQecHSw0AIABB6Ac2AggLAkAgACgCCEGBuJkpSQ0AIABBgLiZKTYCCAsgACgCDCIBRQ0AAkAgASAAKAIIQQNsIgNPDQAgACADNgIMCyAAKAIMIgFFDQAgAEEAKALo8gEgAWo2AjALIAJBEGokAAunBAEHfyMAQTBrIgQkAAJAAkAgAg0AQbUoQQAQPCAAKAI4ECIgACgCPBAiIABCADcCOCAAQdAAOwFgIABBwABqQgA3AgAgAEHIAGpCADcCACAAQdAAakIANwIAIABB2ABqQgA3AgACQCADRQ0AQfIZQQAQ6wIaCyAAELEEDAELAkACQCACQQFqECEgASACEMUFIgUQ9AVBxgBJDQAgBUGn1QBBBRDfBQ0AIAVBBWoiBkHAABDxBSEHIAZBOhDxBSEIIAdBOhDxBSEJIAdBLxDxBSEKIAdFDQAgCkUNAAJAIAlFDQAgByAJTw0BIAkgCk8NAQsCQAJAQQAgCCAIIAdLGyIIDQAgBiEGDAELIAZBkM0AQQUQ3wUNASAIQQFqIQYLIAcgBiIGa0HAAEcNACAHQQA6AAAgBEEQaiAGEKYFQSBHDQBB0AAhBgJAIAlFDQAgCUEAOgAAIAlBAWoQqAUiCSEGIAlBgIB8akGCgHxJDQELIApBADoAACAHQQFqELAFIQcgCkEvOgAAIAoQsAUhCSAAELQEIAAgBjsBYCAAIAk2AjwgACAHNgI4IAAgBCkDEDcCQCAAQcgAaiAEKQMYNwIAIABB0ABqIARBIGopAwA3AgAgAEHYAGogBEEoaikDADcCAAJAIANFDQBB8hkgBSABIAIQxQUQ6wIaCyAAELEEDAELIAQgATYCAEHsGCAEEDxBABAiQQAQIgsgBRAiCyAEQTBqJAALSwAgACgCOBAiIAAoAjwQIiAAQgA3AjggAEHQADsBYCAAQcAAakIANwIAIABByABqQgA3AgAgAEHQAGpCADcCACAAQdgAakIANwIAC0MBAn9B4IABEIoFIgBBiCc2AgggAEECOwEGAkBB8hkQ6gIiAUUNACAAIAEgARD0BUEAELMEIAEQIgtBACAANgLk6QELpAEBBH8jAEEQayIEJAAgARD0BSIFQQNqIgYQISIHIAA6AAEgB0GYAToAACAHQQJqIAEgBRDFBRpBnH8hAQJAQQAoAuTpASIALwEGQQFHDQAgBEGYATYCAEH8CSAEEDwgByAGIAIgAxCpBCIFIQEgBQ0AAkAgACgCDCIBDQBBACEBDAELIABBACgC6PIBIAFqNgIwQQAhAQsgBxAiIARBEGokACABCw8AQQAoAuTpAS8BBkEBRguVAgEIfyMAQRBrIgEkAAJAQQAoAuTpASICRQ0AIAJBEWotAABBAXFFDQAgAi8BBkEBRw0AIAEQ3gQ2AggCQCACKAIgDQAgAkGAAhAhNgIgCwNAIAIoAiBBgAIgAUEIahDfBCEDQQAoAqTqASEEQQIhBQJAIANFDQAgASgCCCEGIAIoAiAhByABQZsBOgAPQZx/IQUCQEEAKALk6QEiCC8BBkEBRw0AIAFBmwE2AgBB/AkgARA8IAFBD2pBASAHIAMQqQQiAyEFIAMNAAJAIAgoAgwiBQ0AQQAhBQwBCyAIQQAoAujyASAFajYCMEEAIQULQQIgBCAGRkEBdCAFGyEFCyAFRQ0AC0HJNkEAEDwLIAFBEGokAAtQAQJ/IwBBEGsiASQAQQAhAgJAIAAvAQ5BgSNHDQAgAUEAKALk6QEoAjg2AgAgAEGw3AAgARCuBSICEIEFGiACECJBASECCyABQRBqJAAgAgsNACAAKAIEEPQFQQ1qC2sCA38BfiAAKAIEEPQFQQ1qECEhAQJAIAAoAhAiAkUNACACQQAgAi0ABCIDa0EMbGpBZGopAwAhBCABIAM6AAwgASAENwMACyABIAAoAgg2AgggACgCBCEAIAFBDWogACAAEPQFEMUFGiABC4IDAgZ/AX4CQAJAIAAoAqACIgFFDQAgAEEYaiECIAEhAQNAAkAgAiABIgMoAgQQ9AVBDWoiBBD3BCIBRQ0AIAFBAUYNAiAAQQA2AqACIAIQ+QQaDAILIAMoAgQQ9AVBDWoQISEBAkAgAygCECIFRQ0AIAVBACAFLQAEIgZrQQxsakFkaikDACEHIAEgBjoADCABIAc3AwALIAEgAygCCDYCCCADKAIEIQUgAUENaiAFIAUQ9AUQxQUaIAIgASAEEPgEDQIgARAiIAMoAgAiASEDIAEhBQJAIAFFDQADQAJAIAMiAS0ADEEBcQ0AIAEhBQwCCyABKAIAIgEhAyABIQUgAQ0ACwsgACAFIgE2AqACAkAgAQ0AIAIQ+QQaCyAAKAKgAiIDIQEgAw0ACwsCQCAAQRBqQaDoOxCkBUUNACAAEL0ECwJAIABBFGpB0IYDEKQFRQ0AIAAtAAhFDQAgAEEAOgAIIABBA0EAQQAQtAULDwtBzs8AQdg9QZIBQbIUEKcFAAvuAwEJfyMAQSBrIgEkAAJAAkACQCAALQAGRQ0AIAAtAAkNASAAQQE6AAkCQCAAKAIMIgJFDQAgAiECA0ACQCACIgMoAhANAEH06QEhAgJAA0ACQCACKAIAIgINAEEJIQQMAgtBASEFAkACQCACLQAQQQFLDQBBDCEEDAELA0ACQAJAIAIgBSIGQQxsaiIHQSRqIggoAgAgAygCCEYNAEEBIQVBACEEDAELQQEhBUEAIQQgB0EpaiIJLQAAQQFxDQACQAJAIAMoAhAiBSAIRw0AQQAhBQwBCwJAIAVFDQAgBSAFLQAFQf4BcToABQsgCSAJLQAAQQFyOgAAIAFBG2ogCEEAIAdBKGoiBS0AAGtBDGxqQWRqKQMAEK0FIAMoAgQhBCABIAUtAAA2AgggASAENgIAIAEgAUEbajYCBEGcNyABEDwgAyAINgIQIABBAToACCADEMcEQQAhBQtBDyEECyAEIQQgBUUNASAGQQFqIgQhBSAEIAItABBJDQALQQwhBAsgAiECIAQiBSEEIAVBDEYNAAsLIARBd2oOBwACAgICAgACCyADKAIAIgUhAiAFDQALCyAALQAJRQ0CIABBADoACQsgAUEgaiQADwtB+DVB2D1BzgBB9DEQpwUAC0H5NUHYPUHgAEH0MRCnBQALpAUCBn8BfiMAQcAAayICJAACQCAALQAJDQACQAJAAkACQAJAIAEvAQ5B/35qDgQBAwIAAwsgACgCDCIDRQ0DIAMhAwNAAkAgAyIDKAIQIgRFDQAgBCAELQAFQf4BcToABSACIAMoAgQ2AgBBhBggAhA8IANBADYCECAAQQE6AAggAxDHBAsgAygCACIEIQMgBA0ADAQLAAsgAUEZaiEFIAEtAAxBcGohBiAAQQxqIQQDQCAEKAIAIgNFDQMgAyEEIAMoAgQiByAFIAYQ3wUNAAsCQCABKQMQIghCAFINACADKAIQIgRFDQMgBCAELQAFQf4BcToABSACIAc2AhBBhBggAkEQahA8IANBADYCECAAQQE6AAggAxDHBAwDCwJAAkAgCBDIBCIFDQBBACEEDAELQQAhBCAFLQAQIAEtABgiBk0NACAFIAZBDGxqQSRqIQQLIAQiBEUNAiADKAIQIgUgBEYNAgJAIAVFDQAgBSAFLQAFQf4BcToABQsgBCAELQAFQQFyOgAFIAJBO2ogBEEAIAQtAARrQQxsakFkaikDABCtBSADKAIEIQUgAiAELQAENgIoIAIgBTYCICACIAJBO2o2AiRBnDcgAkEgahA8IAMgBDYCECAAQQE6AAggAxDHBAwCCyAAQRhqIgYgARDyBA0BAkACQCAAKAIMIgMNACADIQUMAQsgAyEEA0ACQCAEIgMtAAxBAXENACADIQUMAgsgAygCACIDIQQgAyEFIAMNAAsLIAAgBSIDNgKgAiADDQEgBhD5BBoMAQsgAEEBOgAHIABBDGohBAJAA0AgBCgCACIDRQ0BIAMhBCADKAIQDQALIABBADoABwsgACABQYSBARCEBRoLIAJBwABqJAAPC0H4NUHYPUG4AUG0EhCnBQALLAEBf0EAQZCBARCKBSIANgLo6QEgAEEBOgAGIABBACgC7N8BQaDoO2o2AhAL1wEBBH8jAEEQayIBJAACQAJAQQAoAujpASICLQAJDQAgAkEBOgAJAkAgAigCDCIDRQ0AIAMhAwNAAkAgAyIEKAIQIgNFDQAgA0EAIAMtAARrQQxsakFcaiAARw0AIAMgAy0ABUH+AXE6AAUgASAEKAIENgIAQYQYIAEQPCAEQQA2AhAgAkEBOgAIIAQQxwQLIAQoAgAiBCEDIAQNAAsLIAItAAlFDQEgAkEAOgAJIAFBEGokAA8LQfg1Qdg9QeEBQbszEKcFAAtB+TVB2D1B5wFBuzMQpwUAC6oCAQZ/AkACQAJAAkACQEEAKALo6QEiAkUNACAAEPQFIQMgAkEMaiIEIQUCQANAIAUoAgAiBkUNASAGIQUgBigCBCAAIAMQ3wUNAAsgBg0CCyACLQAJDQICQCACKAKgAkUNACACQQA2AqACIAJBGGoQ+QQaC0EUECEiByABNgIIIAcgADYCBCAEKAIAIgZFDQMgACAGKAIEEPMFQQBIDQMgBiEFA0ACQCAFIgMoAgAiBg0AIAYhASADIQMMBgsgBiEFIAYhASADIQMgACAGKAIEEPMFQX9KDQAMBQsAC0HYPUH1AUGCOhCiBQALQdg9QfgBQYI6EKIFAAtB+DVB2D1B6wFB8Q0QpwUACyAGIQEgBCEDCyAHIAE2AgAgAyAHNgIAIAJBAToACCAHC9ICAQR/IwBBEGsiACQAAkACQAJAQQAoAujpASIBLQAJDQACQCABKAKgAkUNACABQQA2AqACIAFBGGoQ+QQaCyABLQAJDQEgAUEBOgAJAkAgASgCDCICRQ0AIAIhAgNAAkAgAiICKAIQIgNFDQAgAyADLQAFQf4BcToABSAAIAIoAgQ2AgBBhBggABA8IAJBADYCECABQQE6AAggAhDHBAsgAigCACIDIQIgAw0ACwsgAS0ACUUNAiABQQA6AAkCQCABKAIMIgJFDQAgAiECA0ACQCACIgIoAhAiA0UNACADIAMtAAVB/gFxOgAFCyABIAIoAgA2AgwgAkEANgIEIAIQIiABKAIMIgMhAiADDQALCyABQQE6AAggAEEQaiQADwtB+DVB2D1B6wFB8Q0QpwUAC0H4NUHYPUGyAkHgJBCnBQALQfk1Qdg9QbUCQeAkEKcFAAsMAEEAKALo6QEQvQQL0AEBAn8jAEHAAGsiAyQAAkACQAJAAkACQCAAQX9qDiAAAQIEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAwQLIAMgAUEUajYCEEHWGSADQRBqEDwMAwsgAyABQRRqNgIgQcEZIANBIGoQPAwCCyADIAFBFGo2AjBBuRggA0EwahA8DAELIAEtAAQhACACLwEEIQQgAyACLQAHNgIMIAMgBDYCCCADIAA2AgQgAyABQQAgAGtBDGxqQXBqNgIAQYfFACADEDwLIANBwABqJAALMQECf0EMECEhAkEAKALs6QEhAyACIAE2AgggAiADNgIAIAIgADYCBEEAIAI2AuzpAQuTAQECfwJAAkBBAC0A8OkBRQ0AQQBBADoA8OkBIAAgASACEMQEAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIIAAgASACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBDQFBAEEBOgDw6QEPC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5oBAQN/AkACQEEALQDw6QENAEEAQQE6APDpASAAKAIQIQFBAEEAOgDw6QECQEEAKALs6QEiAkUNACACIQIDQCACIgIoAghBwAAgASAAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0A8OkBDQFBAEEAOgDw6QEPC0HrzwBBsz9B7QBBoDYQpwUAC0HrzwBBsz9B6QBB/Q8QpwUACzABA39B9OkBIQEDQAJAIAEoAgAiAg0AQQAPCyACIQEgAiEDIAIpAwggAFINAAsgAwtZAQR/AkAgAC0AECICDQBBAA8LIABBJGohA0EAIQQDQAJAIAMgBCIEQQxsaigCACABRw0AIAAgBEEMbGpBJGpBACAAGw8LIARBAWoiBSEEIAUgAkcNAAtBAAtiAgJ/AX4gA0EQahAhIgRBAToAAyAAQQAgAC0ABCIFa0EMbGpBZGopAwAhBiAEIAE7AQ4gBCAFOgANIAQgBjcCBCAEIAM6AAwgBEEQaiACIAMQxQUaIAQQgwUhAyAEECIgAwvbAgECfwJAAkACQEEALQDw6QENAEEAQQE6APDpAQJAQfjpAUHgpxIQpAVFDQACQEEAKAL06QEiAEUNACAAIQADQEEAKALs3wEgACIAKAIca0EASA0BQQAgACgCADYC9OkBIAAQzARBACgC9OkBIgEhACABDQALC0EAKAL06QEiAEUNACAAIQADQCAAIgEoAgAiAEUNAQJAQQAoAuzfASAAKAIca0EASA0AIAEgACgCADYCACAAEMwECyABKAIAIgEhACABDQALC0EALQDw6QFFDQFBAEEAOgDw6QECQEEAKALs6QEiAEUNACAAIQADQCAAIgAoAghBMEEAQQAgACgCBBEFACAAKAIAIgEhACABDQALC0EALQDw6QENAkEAQQA6APDpAQ8LQevPAEGzP0GUAkGgFBCnBQALQf3NAEGzP0HjAEH9DxCnBQALQevPAEGzP0HpAEH9DxCnBQALnAIBA38jAEEQayIBJAACQAJAAkBBAC0A8OkBRQ0AQQBBADoA8OkBIAAQwARBAC0A8OkBDQEgASAAQRRqNgIAQQBBADoA8OkBQcEZIAEQPAJAQQAoAuzpASICRQ0AIAIhAgNAIAIiAigCCEECIABBACACKAIEEQUAIAIoAgAiAyECIAMNAAsLQQAtAPDpAQ0CQQBBAToA8OkBAkAgACgCBCICRQ0AIAIhAgNAIAAgAiICKAIAIgM2AgQCQCACLQAHQQVJDQAgAigCDBAiCyACECIgAyECIAMNAAsLIAAQIiABQRBqJAAPC0H9zQBBsz9BsAFBkzAQpwUAC0HrzwBBsz9BsgFBkzAQpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5UOAgp/AX4jAEEQayIBJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAQQAtAPDpAQ0AQQBBAToA8OkBAkAgAC0AAyICQQRxRQ0AQQBBADoA8OkBAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQRJBACAAIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBRQ0IQevPAEGzP0HpAEH9DxCnBQALIAApAgQhC0H06QEhBAJAA0ACQCAEKAIAIgMNAEEAIQUMAgsgAyEEIAMhBSADKQMIIAtSDQALC0EAIQQCQCAFIgNFDQAgAyAALQANQT9xIgRBDGxqQSRqQQAgBCADLQAQSRshBAsgBCEFAkAgAkEBcUUNAEEQIQQgBSECIAMhAwwHCyAALQANDQQgAC8BDg0EIAMhBAJAIAMNACAAEM4EIQQLAkAgBCIDLwESIgUgAC8BECIERg0AAkAgBUEPcSAEQQ9xTQ0AQQMgAyAAEMYEQQAoAvTpASIEIANGDQMgBCEEA0AgBCIFRQ0FIAUoAgAiAiEEIAIgA0cNAAsgBSADKAIANgIADAQLIAMgBDsBEgsgAyEDDAMLQevPAEGzP0G+AkGcEhCnBQALQQAgAygCADYC9OkBCyADEMwEIAAQzgQhAwsgAyIDQQAoAuzfAUGAifoAajYCHCADQSRqIQQgAyEDDAELIAUhBCADIQMLIAMhBgJAAkAgBCIFDQBBECEEQQAhAgwBCwJAAkAgAC0AA0EBcQ0AIAAtAA1BMEsNACAALgEOQX9KDQACQCAAQQ9qLQAAIgMgA0H/AHEiBEF/aiAGLQARIgMgA0H/AUYbQQFqIgNrQf8AcSICRQ0AAkAgAyAEa0H8AHFBPE8NAEETIQMMAwtBEyEDIAJBBUkNAgsgBiAEOgARC0EQIQMLIAMhBwJAAkACQCAALQAMIghBBEkNACAALwEOQQNHDQAgAC8BECIDQYDgA3FBgCBHDQICQAJAIAVBACAFLQAEIglrQQxsakFgaigCACIERQ0AIANB/x9xIQIgBCEDA0ACQCACIAMiAy8BBEcNACADLQAGQT9xIAlHDQAgAyEDDAMLIAMoAgAiBCEDIAQNAAsLQQAhAwsgAyICRQ0CIAIsAAYiA0EASA0CIAIgA0GAAXI6AAZBAC0A8OkBRQ0GQQBBADoA8OkBAkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQSEgBSACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A8OkBRQ0BQevPAEGzP0HpAEH9DxCnBQALIAAvAQ4iA0GA4ANxQYAgRw0BAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAQJAAkAgAi0AByIDIAhHDQAgAyEEIAJBDGohCSAAQRBqIQoCQAJAIANBBU8NACAJIQkMAQsgCSgCACEJCyAKIAkgBBDfBQ0AQQEhBAwBC0EAIQQLIAQhBAJAIAhBBUkNACADIAhGDQACQCADQQVJDQAgAigCDBAiCyACIAAtAAwQITYCDAsgAiAALQAMIgM6AAcgAkEMaiEJAkACQCADQQVPDQAgCSEJDAELIAkoAgAhCQsgCSAAQRBqIAMQxQUaIAQNAUEALQDw6QFFDQZBAEEAOgDw6QEgBS0ABCEDIAIvAQQhBCABIAItAAc2AgwgASAENgIIIAEgAzYCBCABIAVBACADa0EMbGpBcGo2AgBBh8UAIAEQPAJAQQAoAuzpASIDRQ0AIAMhAwNAIAMiAygCCEEgIAUgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAPDpAQ0HC0EAQQE6APDpAQsgByEEIAUhAgsgBiEDCyADIQYgBCEFQQAtAPDpASEDAkAgAiICRQ0AIANBAXFFDQVBAEEAOgDw6QEgBSACIAAQxAQCQEEAKALs6QEiA0UNACADIQMDQCADIgMoAgggBSACIAAgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQDw6QFFDQFB688AQbM/QekAQf0PEKcFAAsgA0EBcUUNBUEAQQA6APDpAQJAQQAoAuzpASIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAPDpAQ0GC0EAQQA6APDpASABQRBqJAAPC0H9zQBBsz9B4wBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUAC5EEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQISIEIAM6ABAgBCAAKQIEIgk3AwhBACgC7N8BIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQrQUgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKAL06QEiA0UNACAEQQhqIgIpAwAQmgVRDQAgAiADQQhqQQgQ3wVBAEgNAEH06QEhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEJoFUQ0AIAMhBSACIAhBCGpBCBDfBUF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoAvTpATYCAEEAIAQ2AvTpAQsCQAJAQQAtAPDpAUUNACABIAY2AgBBAEEAOgDw6QFB1hkgARA8AkBBACgC7OkBIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBQAgAygCACICIQMgAg0ACwtBAC0A8OkBDQFBAEEBOgDw6QEgAUEQaiQAIAQPC0H9zQBBsz9B4wBB/Q8QpwUAC0HrzwBBsz9B6QBB/Q8QpwUACwIAC5kCAQV/IwBBIGsiAiQAAkACQCABLwEOIgNBgH9qIgRBBEsNAEEBIAR0QRNxRQ0AIAJBAXIgAUEQaiIFIAEtAAwiBEEPIARBD0kbIgYQxQUhACACQTo6AAAgBiACckEBakEAOgAAIAAQ9AUiBkEOSg0BAkACQAJAIANBgH9qDgUAAgQEAQQLIAZBAWohBCACIAQgBCACQQBBABDhBCIDQQAgA0EAShsiA2oiBRAhIAAgBhDFBSIAaiADEOEEGiABLQANIAEvAQ4gACAFEL0FGiAAECIMAwsgAkEAQQAQ5AQaDAILIAIgBSAGakEBaiAGQX9zIARqIgFBACABQQBKGxDkBBoMAQsgACABQaCBARCEBRoLIAJBIGokAAsKAEGogQEQigUaCwIAC6cBAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkAgAS8BDiIDQYBdag4HAQMFBQMCBAALAkACQAJAIANB/35qDgIBAgALIAMNBhCOBQwHC0H8ABAeDAYLEDUACyABEJMFEIEFGgwECyABEJUFEIEFGgwDCyABEJQFEIAFGgwCCyACEDY3AwhBACABLwEOIAJBCGpBCBC9BRoMAQsgARCCBRoLIAJBEGokAAsKAEG4gQEQigUaCycBAX8Q1gRBAEEANgL86QECQCAAENcEIgENAEEAIAA2AvzpAQsgAQuVAQECfyMAQSBrIgAkAAJAAkBBAC0AoOoBDQBBAEEBOgCg6gEQIw0BAkBB8N0AENcEIgENAEEAQfDdADYCgOoBIABB8N0ALwEMNgIAIABB8N0AKAIINgIEQY8VIAAQPAwBCyAAIAE2AhQgAEHw3QA2AhBBhjggAEEQahA8CyAAQSBqJAAPC0G63ABB/z9BHUG0ERCnBQALqwUBCn8CQCAADQBB0A8PC0HRDyEBAkAgAEEDcQ0AQdIPIQEgACgCAEHEhpm6BEcNAEHTDyEBIAAoAgRBirbS1XxHDQBB1A8hASAAKAIIIgJB//8HSw0AQd4PIQEgAC8BDCIDQRhsQfAAaiIEIAJLDQBB3w8hASAAQdgAaiIFIANBGGxqIgYvARBB//8DRw0AQeAPIQEgBi8BEkH//wNHDQBBACEGQQAhAQNAIAghByAGIQgCQAJAIAAgASIBQQF0akEYai8BACIGIANNDQBBACEGQeEPIQkMAQsCQCABIAUgBkEYbGoiCi8BEEELdk0NAEEAIQZB4g8hCQwBCwJAIAZFDQBBACEGQeMPIQkgASAKQXhqLwEAQQt2TQ0BC0EBIQYgByEJCyAJIQcgCCEJAkAgBkUNACABQR5LIgkhBiAHIQggAUEBaiIKIQEgCSEJIApBIEcNAQsLAkAgCUEBcQ0AIAcPCwJAIAMNAEEADwsgByEJQQAhBgNAIAkhCAJAAkAgBSAGIgZBGGxqIgEQ9AUiCUEPTQ0AQQAhAUHWDyEJDAELIAEgCRCZBSEJAkAgAS8BECIHIAkgCUEQdnNB//8DcUYNAEEAIQFB1w8hCQwBCwJAIAZFDQAgAUF4ai8BACAHTQ0AQQAhAUHYDyEJDAELAkACQCABLwESIgdBAnENAEEAIQFB2Q8hCSAHQQRJDQEMAgsCQCABKAIUIgEgBE8NAEEAIQFB2g8hCQwCCwJAIAEgAkkNAEEAIQFB2w8hCQwCCwJAIAEgB0ECdmoiByACSQ0AQQAhAUHcDyEJDAILQQAhAUHdDyEJIAAgB2otAAANAQtBASEBIAghCQsgCSEJAkAgAUUNACAJIQkgBkEBaiIIIQZBACEBIAggA0YNAgwBCwsgCSEBCyABC+sCAQd/ENYEAkACQCAARQ0AQQAoAvzpASIBRQ0AIAAQ9AUiAkEPSw0AIAEgACACEJkFIgNBEHYgA3MiA0EKdkE+cWpBGGovAQAiBCABLwEMIgVPDQAgAUHYAGohBiADQf//A3EhASAEIQMDQCAGIAMiB0EYbGoiBC8BECIDIAFLDQECQCADIAFHDQAgBCEDIAQgACACEN8FRQ0DCyAHQQFqIgQhAyAEIAVHDQALC0EAIQMLIAMiAyEBAkAgAw0AAkAgAEUNAEEAKAKA6gEiAUUNACAAEPQFIgJBD0sNACABIAAgAhCZBSIDQRB2IANzIgNBCnZBPnFqQRhqLwEAIgRB8N0ALwEMIgVPDQAgAUHYAGohBiADQf//A3EhAyAEIQEDQCAGIAEiB0EYbGoiBC8BECIBIANLDQECQCABIANHDQAgBCEBIAQgACACEN8FRQ0DCyAHQQFqIgQhASAEIAVHDQALC0EAIQELIAELUQECfwJAAkAgABDYBCIADQBB/wEhAgwBCyAALwESQQNxIQILIAEhAwJAAkACQCACDgIAAQILIAEgACgCFCIAIABBAEgbDwsgACgCFCEDCyADC1EBAn8CQAJAIAAQ2AQiAA0AQf8BIQIMAQsgAC8BEkEDcSECCyABIQMCQAJAAkAgAg4CAQACCyABIAAoAhQiACAAQQBIGw8LIAAoAhQhAwsgAwvEAwEIfxDWBEEAKAKA6gEhAgJAAkAgAEUNACACRQ0AIAAQ9AUiA0EPSw0AIAIgACADEJkFIgRBEHYgBHMiBEEKdkE+cWpBGGovAQAiBUHw3QAvAQwiBk8NACACQdgAaiEHIARB//8DcSEEIAUhBQNAIAcgBSIIQRhsaiIJLwEQIgUgBEsNAQJAIAUgBEcNACAJIQUgCSAAIAMQ3wVFDQMLIAhBAWoiCSEFIAkgBkcNAAsLQQAhBQsgAiEEIAUiCSEFAkAgCQ0AQQAoAvzpASEEAkAgAEUNACAERQ0AIAAQ9AUiA0EPSw0AIAQgACADEJkFIgVBEHYgBXMiBUEKdkE+cWpBGGovAQAiCSAELwEMIgZPDQAgBEHYAGohByAFQf//A3EhBSAJIQkDQCAHIAkiCEEYbGoiAi8BECIJIAVLDQECQCAJIAVHDQAgAiAAIAMQ3wUNACAEIQQgAiEFDAMLIAhBAWoiCCEJIAggBkcNAAsLIAQhBEEAIQULIAQhBAJAIAUiAEUNACAALQASQQJxRQ0AAkAgAUUNACABIAAvARJBAnY2AgALIAQgACgCFGoPCwJAIAENAEEADwsgAUEANgIAQQALtAEBAn9BACEDAkACQCAARQ0AQQAhAyAAEPQFIgRBDksNAQJAIABBkOoBRg0AQZDqASAAIAQQxQUaCyAEIQMLIAMhAAJAIAFB5ABNDQBBAA8LIABBkOoBaiABQYABczoAACAAQQFqIQACQAJAIAINACAAIQAMAQtBACEDIAIQ9AUiASAAaiIEQQ9LDQEgAEGQ6gFqIAIgARDFBRogBCEACyAAQZDqAWpBADoAAEGQ6gEhAwsgAwujAgEDfyMAQbACayICJAAgAkGrAiAAIAEQqwUaAkACQCACEPQFIgENACABIQAMAQsgASEAA0AgACIBIQACQCACIAFBf2oiAWotAABBdmoOBAACAgACCyABIQAgAQ0AC0EAIQALIAIgACIBakEKOgAAECQgAUEBaiEDIAIhBAJAAkBBgAhBACgCpOoBayIAIAFBAmpJDQAgAyEDIAQhAAwBC0Gk6gFBACgCpOoBakEEaiACIAAQxQUaQQBBADYCpOoBQQEgAyAAayIBIAFBgXhqQf93SRshAyACIABqIQALQaTqAUEEaiIBQQAoAqTqAWogACADIgAQxQUaQQBBACgCpOoBIABqNgKk6gEgAUEAKAKk6gFqQQA6AAAQJSACQbACaiQACzkBAn8QJAJAAkBBACgCpOoBQQFqIgBB/wdLDQAgACEBQaTqASAAakEEai0AAA0BC0EAIQELECUgAQt2AQN/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBgAhBACgCpOoBIgQgBCACKAIAIgVJGyIEIAVGDQAgAEGk6gEgBWpBBGogBCAFayIFIAEgBSABSRsiBRDFBRogAiACKAIAIAVqNgIAIAUhAwsQJSADC/gBAQd/ECQCQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBACgCpOoBIgQgAigCACIFRg0AIAAgAWpBf2ohBiAAIQEgBSEDAkADQCADIQMCQCABIgEgBkkNACABIQUgAyEHDAILIAEhBSADQQFqIgghB0EDIQkCQAJAQaTqASADakEEai0AACIDDgsBAAAAAAAAAAAAAQALIAEgAzoAACABQQFqIQVBACAIIAhBgAhGGyIDIQdBA0EAIAMgBEYbIQkLIAUiBSEBIAciByEDIAUhBSAHIQcgCUUNAAsLIAIgBzYCACAFIgNBADoAACADIABrIQMLECUgAwuIAQEBfyMAQRBrIgMkAAJAAkACQCAARQ0AIAAQ9AVBD0sNACAALQAAQSpHDQELIAMgADYCAEHq3AAgAxA8QX8hAAwBCwJAIAAQ4gQiAA0AQX4hAAwBCwJAIAAoAhQgAksNACABQQAoAqjyASAAKAIQaiACEMUFGgsgACgCFCEACyADQRBqJAAgAAvKAwEEfyMAQSBrIgEkAAJAAkBBACgCtPIBDQBBABAYIgI2AqjyASACQYAgaiEDAkACQCACKAIAQcam0ZIFRw0AIAIhBCACKAIEQYqM1fkFRg0BC0EAIQQLIAQhBAJAAkAgAygCAEHGptGSBUcNACADIQMgAigChCBBiozV+QVGDQELQQAhAwsgAyECAkACQAJAIARFDQAgAkUNACAEIAIgBCgCCCACKAIISxshAgwBCyAEIAJyRQ0BIAQgAiAEGyECC0EAIAI2ArTyAQsCQEEAKAK08gFFDQAQ4wQLAkBBACgCtPIBDQBBwAtBABA8QQBBACgCqPIBIgI2ArTyASACEBogAUIBNwMYIAFCxqbRkqXB0ZrfADcDEEEAKAK08gEgAUEQakEQEBkQGxDjBEEAKAK08gFFDQILIAFBACgCrPIBQQAoArDyAWtBUGoiAkEAIAJBAEobNgIAQagwIAEQPAsCQAJAQQAoArDyASICQQAoArTyAUEQaiIDSQ0AIAIhAgNAAkAgAiICIAAQ8wUNACACIQIMAwsgAkFoaiIEIQIgBCADTw0ACwtBACECCyABQSBqJAAgAg8LQe/JAEGmPUHFAUGZERCnBQALgQQBCH8jAEEgayIAJABBACgCtPIBIgFBACgCqPIBIgJrQYAgaiEDIAFBEGoiBCEBAkACQAJAA0AgAyEDIAEiBSgCECIBQX9GDQEgASADIAEgA0kbIgYhAyAFQRhqIgUhASAFIAIgBmpNDQALQd8QIQMMAQtBACACIANqIgI2AqzyAUEAIAVBaGoiBjYCsPIBIAUhAQJAA0AgASIDIAJPDQEgA0EBaiEBIAMtAABB/wFGDQALQYkqIQMMAQtBAEEANgK48gEgBCAGSw0BIAQhAwJAA0ACQCADIgctAABBKkcNACAAQQhqQRBqIAdBEGopAgA3AwAgAEEIakEIaiAHQQhqKQIANwMAIAAgBykCADcDCCAHIQECQANAIAFBGGoiAyAGSyIFDQEgAyEBIAMgAEEIahDzBQ0ACyAFRQ0BCyAHKAIUIgNB/x9qQQx2QQEgAxsiAkUNACAHKAIQQQx2QX5qIQRBACEDA0AgBCADIgFqIgNBHk8NAwJAQQAoArjyAUEBIAN0IgVxDQAgA0EDdkH8////AXFBuPIBaiIDIAMoAgAgBXM2AgALIAFBAWoiASEDIAEgAkcNAAsLIAdBGGoiASEDIAEgBk0NAAwDCwALQb7IAEGmPUHPAEHcNBCnBQALIAAgAzYCAEGoGSAAEDxBAEEANgK08gELIABBIGokAAvoAwEEfyMAQcAAayIDJAACQAJAAkACQCAARQ0AIAAQ9AVBD0sNACAALQAAQSpHDQELIAMgADYCAEHq3AAgAxA8QX8hBAwBCwJAIAJBuR5JDQAgAyACNgIQQYYNIANBEGoQPEF+IQQMAQsCQCAAEOIEIgVFDQAgBSgCFCACRw0AQQAhBEEAKAKo8gEgBSgCEGogASACEN8FRQ0BCwJAQQAoAqzyAUEAKAKw8gFrQVBqIgRBACAEQQBKGyACQQdqQXhxQQggAhsiBEEYaiIFTw0AEOUEQQAoAqzyAUEAKAKw8gFrQVBqIgZBACAGQQBKGyAFTw0AIAMgAjYCIEHKDCADQSBqEDxBfSEEDAELQQBBACgCrPIBIARrIgU2AqzyAQJAAkAgAUEAIAIbIgRBA3FFDQAgBCACELEFIQRBACgCrPIBIAQgAhAZIAQQIgwBCyAFIAQgAhAZCyADQTBqQgA3AwAgA0IANwMoIAMgAjYCPCADQQAoAqzyAUEAKAKo8gFrNgI4IANBKGogACAAEPQFEMUFGkEAQQAoArDyAUEYaiIANgKw8gEgACADQShqQRgQGRAbQQAoArDyAUEYakEAKAKs8gFLDQFBACEECyADQcAAaiQAIAQPC0HEDkGmPUGpAkGbIxCnBQALrAQCDX8BfiMAQSBrIgAkAEHzOkEAEDxBACgCqPIBIgEgAUEAKAK08gFGQQx0aiICEBoCQEEAKAK08gFBEGoiA0EAKAKw8gEiAUsNACABIQEgAyEDIAJBgCBqIQQgAkEQaiEFA0AgBSEGIAQhByABIQQgAEEIakEQaiIIIAMiCUEQaiIKKQIANwMAIABBCGpBCGoiCyAJQQhqIgwpAgA3AwAgACAJKQIANwMIIAkhAwJAAkADQCADQRhqIgEgBEsiBQ0BIAEhAyABIABBCGoQ8wUNAAsgBQ0AIAYhBSAHIQQMAQsgCCAKKQIANwMAIAsgDCkCADcDACAAIAkpAgAiDTcDCAJAAkAgDadB/wFxQSpHDQAgByEBDAELIAcgACgCHCIBQQdqQXhxQQggARtrIgNBACgCqPIBIAAoAhhqIAEQGSAAIANBACgCqPIBazYCGCADIQELIAYgAEEIakEYEBkgBkEYaiEFIAEhBAtBACgCsPIBIgYhASAJQRhqIgkhAyAEIQQgBSEFIAkgBk0NAAsLQQAoArTyASgCCCEBQQAgAjYCtPIBIABBADYCFCAAIAFBAWoiATYCECAAQsam0ZKlwdGa3wA3AwggAiAAQQhqQRAQGRAbEOMEAkBBACgCtPIBDQBB78kAQaY9QeYBQcA6EKcFAAsgACABNgIEIABBACgCrPIBQQAoArDyAWtBUGoiAUEAIAFBAEobNgIAQYAkIAAQPCAAQSBqJAALgAEBAX8jAEEQayICJAACQAJAAkAgAEUNACAALQAAQSpHDQAgABD0BUEQSQ0BCyACIAA2AgBBy9wAIAIQPEEAIQAMAQsCQCAAEOIEIgANAEEAIQAMAQsCQCABRQ0AIAEgACgCFDYCAAtBACgCqPIBIAAoAhBqIQALIAJBEGokACAAC44JAQt/IwBBMGsiAiQAAkACQAJAAkACQAJAAkACQAJAAkAgAEUNACAALQAAQSpHDQAgABD0BUEQSQ0BCyACIAA2AgBBy9wAIAIQPEEAIQMMAQsCQCAAEOIEIgRFDQAgBC0AAEEqRw0CIAQoAhQiA0H/H2pBDHZBASADGyIFRQ0AIAQoAhBBDHZBfmohBkEAIQMDQCAGIAMiB2oiA0EeTw0EAkBBACgCuPIBQQEgA3QiCHFFDQAgA0EDdkH8////AXFBuPIBaiIDIAMoAgAgCHM2AgALIAdBAWoiByEDIAcgBUcNAAsLIAJBIGpCADcDACACQgA3AxggAUH/H2pBDHZBASABGyIJQX9qIQpBHiAJayELQQAoArjyASEFQQAhBwJAA0AgAyEMAkAgByIIIAtJDQBBACEGDAILAkACQCAJDQAgDCEDIAghB0EBIQgMAQsgCEEdSw0GQQBBHiAIayIDIANBHksbIQZBACEDA0ACQCAFIAMiAyAIaiIHdkEBcUUNACAMIQMgB0EBaiEHQQEhCAwCCwJAIAMgCkYNACADQQFqIgchAyAHIAZGDQgMAQsLIAhBDHRBgMAAaiEDIAghB0EAIQgLIAMiBiEDIAchByAGIQYgCA0ACwsgAiABNgIsIAIgBiIDNgIoAkACQCADDQAgAiABNgIQQa4MIAJBEGoQPAJAIAQNAEEAIQMMAgsgBC0AAEEqRw0GAkAgBCgCFCIDQf8fakEMdkEBIAMbIgUNAEEAIQMMAgsgBCgCEEEMdkF+aiEGQQAhAwNAIAYgAyIHaiIDQR5PDQgCQEEAKAK48gFBASADdCIIcQ0AIANBA3ZB/P///wFxQbjyAWoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALQQAhAwwBCyACQRhqIAAgABD0BRDFBRoCQEEAKAKs8gFBACgCsPIBa0FQaiIDQQAgA0EAShtBF0sNABDlBEEAKAKs8gFBACgCsPIBa0FQaiIDQQAgA0EAShtBF0sNAEHiHEEAEDxBACEDDAELQQBBACgCsPIBQRhqNgKw8gECQCAJRQ0AQQAoAqjyASACKAIoaiEIQQAhAwNAIAggAyIDQQx0ahAaIANBAWoiByEDIAcgCUcNAAsLQQAoArDyASACQRhqQRgQGRAbIAItABhBKkcNByACKAIoIQoCQCACKAIsIgNB/x9qQQx2QQEgAxsiBUUNACAKQQx2QX5qIQZBACEDA0AgBiADIgdqIgNBHk8NCgJAQQAoArjyAUEBIAN0IghxDQAgA0EDdkH8////AXFBuPIBaiIDIAMoAgAgCHM2AgALIAdBAWoiByEDIAcgBUcNAAsLQQAoAqjyASAKaiEDCyADIQMLIAJBMGokACADDwtBw9kAQaY9QeUAQbsvEKcFAAtBvsgAQaY9Qc8AQdw0EKcFAAtBvsgAQaY9Qc8AQdw0EKcFAAtBw9kAQaY9QeUAQbsvEKcFAAtBvsgAQaY9Qc8AQdw0EKcFAAtBw9kAQaY9QeUAQbsvEKcFAAtBvsgAQaY9Qc8AQdw0EKcFAAsMACAAIAEgAhAZQQALBgAQG0EAC5cCAQN/AkAQIw0AAkACQAJAQQAoArzyASIDIABHDQBBvPIBIQMMAQsgAyEDA0AgAyIERQ0CIAQoAggiBSEDIAUgAEcNAAsgBEEIaiEDCyADIAAoAgg2AgALIAAgAjYCBCAAIAE2AgAgAEEAOwEMA0AQmwUiAUH/A3EiAkUNAEEAKAK88gEiA0UhBQJAAkAgAw0AIAUhBQwBCyADIQQgBSEFIAIgAy8BDEEHdkYNAANAIAQoAggiA0UhBQJAIAMNACAFIQUMAgsgAyEEIAUhBSACIAMvAQxBB3ZHDQALCyAFRQ0ACyAAIAFBB3Q7AQwgAEEAKAK88gE2AghBACAANgK88gEgAUH/A3EPC0HKwQBBJ0HyIxCiBQALiAIBBH8CQCAALQANQT5HDQAgAC0AA0EBcUUNACAAKQIEEJoFUg0AQQAoArzyASIBRQ0AIAAvAQ4hAiABIQEDQAJAIAEiAS8BDCIDIAJzIgRB//8DcUH/AEsNACAEQR9xDQIgASADQQFqQR9xIANB4P8DcXI7AQwgASAAIAFBBGogASACQcAAcRsoAgARAgAgAkEgcUUNAiABQQAgASgCBBECAAJAAkACQEEAKAK88gEiACABRw0AQbzyASEADAELIAAhAANAIAAiBEUNAiAEKAIIIgIhACACIAFHDQALIARBCGohAAsgACABKAIINgIACyABQQA7AQwPCyABKAIIIgQhASAEDQALCwtZAQN/AkACQAJAQQAoArzyASIBIABHDQBBvPIBIQEMAQsgASEBA0AgASICRQ0CIAIoAggiAyEBIAMgAEcNAAsgAkEIaiEBCyABIAAoAgg2AgALIABBADsBDAs3AQF/AkAgAEEOcUEIRw0AQQAPC0EAIQECQCAAQQxxQQxGDQAgAEEEdkEIIABBA3F0TSEBCyABC5MEAgF/AX4gAUEPcSEDAkACQCABQRBPDQAgAiECDAELIAFBEHRBgIDA/wNqQYCAwP8Hca1CIIa/IAKiIQILIAIhAgJAAkACQAJAAkACQCADQX5qDgoAAQUFBQIFBQMEBQtBACEBAkAgAkQAAAAAAAAAAGMNAEF/IQEgAkQAAOD////vQWQNAAJAAkAgAkQAAAAAAADgP6AiAkQAAAAAAADwQWMgAkQAAAAAAAAAAGZxRQ0AIAKrIQEMAQtBACEBCyABIQELIAAgATYAAA8LQgAhBAJAIAJEAAAAAAAAAABjDQAgAkQAAAAAAADwQ2QNAAJAAkAgAkQAAAAAAADgP6AiAkQAAAAAAADwQ2MgAkQAAAAAAAAAAGZxRQ0AIAKxIQQMAQtCACEECyAEIQQLIAAgBDcAAA8LAkBEAAAAAAAA4EMgAkQAAAAAAADgP6AgAkQAAAAAAADgQ2QgAkQAAAAAAADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQAJAIAJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELIAEhAQsgACADIAEQ7wQL+AEAAkAgAUEISQ0AIAAgASACtxDuBA8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQZI8Qa4BQcLNABCiBQALIAAgAkH/ASACQf8BSBsiAUEAIAFBAEobOgAAC7sDAwF/AXwBfgJAAkACQCABQQhJDQACQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQ8AS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBkjxBygFB1s0AEKIFAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPAEtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvkAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKALA8gEiASAARw0AQcDyASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQxwUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKALA8gE2AgBBACAANgLA8gFBACECCyACDwtBr8EAQStB5CMQogUAC+QBAgN/AX4CQCABLQAMQQJPDQBBfg8LQX4hAgJAAkAgASkCBCIFUA0AIAEvARAhAxAjDQECQCAALQAGRQ0AAkACQAJAQQAoAsDyASIBIABHDQBBwPIBIQEMAQsgASECA0AgAiIBRQ0CIAEoAgAiBCECIAEhASAEIABHDQALCyABIAAoAgA2AgALIABBAEGIAhDHBRoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAFNwIAIAAgA0EHdDsBBCAAQQAoAsDyATYCAEEAIAA2AsDyAUEAIQILIAIPC0GvwQBBK0HkIxCiBQAL1wIBBH8CQAJAAkAgAC0ADUE/Rw0AIAAtAANBAXENABAjDQFBACgCwPIBIgFFDQAgASEBA0ACQCABIgEtAAdFDQAgAC8BDiABLwEMRw0AIAFBEGopAgAgACkCBFINACABQQA6AAcgAUEMaiICEKAFAkACQCABLQAGQYB/ag4DAQIAAgtBACgCwPIBIgIhAwJAAkACQCACIAFHDQBBwPIBIQIMAQsDQCADIgJFDQIgAigCACIEIQMgAiECIAQgAUcNAAsLIAIgASgCADYCAAsgAUEAQYgCEMcFGgwBCyABQQE6AAYCQCABQQBBAEHgABD1BA0AIAFBggE6AAYgAS0ABw0FIAIQnQUgAUEBOgAHIAFBACgC7N8BNgIIDAELIAFBgAE6AAYLIAEoAgAiAiEBIAINAAsLDwtBr8EAQckAQcoSEKIFAAtBlc8AQa/BAEHxAEGVJxCnBQAL6gEBAn9BACEEQX8hBQJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQQAhBEF+IQUMAQtBACEEQQEhBSAALQAHDQACQCACIABBDmotAABqQQRqQe0BTw0AQQEhBEEAIQUMAQsgAEEMahCdBSAAQQE6AAcgAEEAKALs3wE2AghBACEEQQEhBQsgBSEFAkACQCAERQ0AIABBDGpBPiAALwEEIANyIAIQoQUiBEUNASAEIAEgAhDFBRogACAALwEEIgRBAWpBH3EgBEHg/wNxcjsBBEEAIQULIAUPC0GAygBBr8EAQYwBQasJEKcFAAvaAQEDfwJAECMNAAJAQQAoAsDyASIARQ0AIAAhAANAAkAgACIALQAHIgFFDQBBACgC7N8BIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqELsFIQFBACgC7N8BIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgEhACABDQALCw8LQa/BAEHaAEHCFBCiBQALawEBf0F/IQICQAJAAkAgAC0ABkF/ag4IAQAAAAAAAAIAC0F+DwtBASECIAAtAAcNAEEAIQIgASAAQQ5qLQAAakEEakHtAUkNACAAQQxqEJ0FIABBAToAByAAQQAoAuzfATYCCEEBIQILIAILDQAgACABIAJBABD1BAuOAgEDfyAALQAGIgEhAgJAAkACQAJAAkACQAJAIAEOCQUCAwMDAwMDAQALIAFBgH9qDgMBAgMCCwJAAkACQEEAKALA8gEiASAARw0AQcDyASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgMhAiABIQEgAyAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQxwUaQQAPCyAAQQE6AAYCQCAAQQBBAEHgABD1BCIBDQAgAEGCAToABiAALQAHDQQgAEEMahCdBSAAQQE6AAcgAEEAKALs3wE2AghBAQ8LIABBgAE6AAYgAQ8LQa/BAEG8AUGVLRCiBQALQQEhAgsgAg8LQZXPAEGvwQBB8QBBlScQpwUAC58CAQV/AkACQAJAAkAgAS0AAkUNABAkIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCEGIAQgAC8BBE0NAiACIAVJDQFBACEEQX8hAwwDCyAEIQYgBCAFSQ0BQQAhBEF+IQMMAgsgACADOwEGIAIhBgsgACAGOwECQQEhBEEAIQMLIAMhAwJAIARFDQAgACAALwECaiACa0EIaiABIAIQxQUaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECUgAw8LQZTBAEEdQfsmEKIFAAtB5ipBlMEAQTZB+yYQpwUAC0H6KkGUwQBBN0H7JhCnBQALQY0rQZTBAEE4QfsmEKcFAAsxAQJ/QQAhAQJAIAAvAQAiAiAALwECRg0AIAAgAkEAIAIgAC8BBkkbakEIaiEBCyABC6YBAQN/ECRBACEBAkAgAC8BACICIAAvAQJGDQAgACACQQAgAiAALwEGSRtqQQhqIQELAkACQCABIgFFDQAgAS0AAkEPakH8A3EhAQJAIAIgAC8BBiIDSQ0AIAIgA0cNAiAAIAE7AQAgACAALwEEOwEGECUPCyAAIAIgAWo7AQAQJQ8LQePJAEGUwQBBzgBByxEQpwUAC0HCKkGUwQBB0QBByxEQpwUACyIBAX8gAEEIahAhIgEgADsBBCABIAA7AQYgAUEANgEAIAELMwEBfyMAQRBrIgIkACACIAE6AA8gAC0ADSAALwEOIAJBD2pBARC9BSEAIAJBEGokACAACzMBAX8jAEEQayICJAAgAiABOwEOIAAtAA0gAC8BDiACQQ5qQQIQvQUhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATYCDCAALQANIAAvAQ4gAkEMakEEEL0FIQAgAkEQaiQAIAALPAACQAJAIAFFDQAgAS0AAA0BCyAALQANIAAvAQ5Bx90AQQAQvQUPCyAALQANIAAvAQ4gASABEPQFEL0FC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBC9BSECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABCdBSAAELsFCxoAAkAgACABIAIQhQUiAg0AIAEQggUaCyACC4AHARB/IwBBEGsiAyQAAkACQCABLwEOIgRBDHYiBUF/akEBTQ0AQQAhBAwBCwJAIAVBAkcNACABLQAMDQBBACEEDAELAkAgBEH/H3EiBkH/HU0NAEEAIQQMAQsCQCAFQQJHDQAgBEGAHnFBgAJHDQBBACEEDAELQQAhBCACLwEAIgdB8R9GDQBBACAGayEIIAFBEGoiCSEKIAchB0EAIgQhC0EAIQwgBCENA0AgDSENIAwhDiALIQsgECEPAkACQCAHQf//A3EiDEEMdiIEQQlGDQAgDSEHIARB0IEBai0AACEQDAELIA1BAWoiECEHIAIgEEEBdGovAQAhEAsgByERAkACQAJAAkAgECIHRQ0AAkACQCAEQXZqQX1NDQAgDiENIAshEAwBC0EAIQ0gCyAOQf8BcUEAR2pBAyAHQX9qIAdBA0sbIhBqIBBBf3NxIRALIBAhECANIQsCQCAMQf8fcSAGRyISDQAgACAQaiEPAkAgBUEBRw0AAkACQCAEQQhHDQAgAyAPLQAAIAtB/wFxdkEBcToADyABLQANIAEvAQ4gA0EPakEBEL0FGgwBCyAPIQ0gByEOAkAgDEGAwAJJDQADQCANIQQgDiIMRQ0HIARBAWohDSAMQX9qIQ4gBC0AAEUNAAsgDEUNBgsgAS0ADSABLwEOIA8gBxC9BRoLIAshCyAQIQcgCCEEDAULAkAgBEEIRw0AQQEgC0H/AXF0IQQgDy0AACEHAkAgAS0AEEUNACAPIAcgBHI6AAAMBAsgDyAHIARBf3NxOgAADAMLAkAgByABLQAMIgRLDQAgDyAKIAcQxQUaDAMLIA8gCSAEEMUFIQ0CQAJAIAxB/58BTQ0AQQAhBAwBC0EAIQQgDEGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQQLIA0gAS0ADCIMaiAEIAcgDGsQxwUaDAILAkACQCAEQQhHDQBBACALQQFqIgQgBEH/AXFBCEYiBBshCyAQIARqIQcMAQsgCyELIBAgB2ohBwsgDyEEDAMLQYg9QdsAQbsbEKIFAAsgCyELIBAhByAGIQQMAQsgCyELIBAhB0EAIQQLIAQhBCAHIQ0gCyEMAkAgEkUNACACIBFBAWoiDkEBdGovAQAiEiEHIAQhECANIQsgDCEMIA4hDUEAIQQgEkHxH0YNAgwBCwsgBCEECyADQRBqJAAgBAv+AgEEfyAAEIcFIAAQ9AQgABDrBCAAEM0EAkACQCAALQADQQFxDQAgAC0ADQ0BIAAvAQ4NASAALQAMQQRJDQEgAC0AEUEIcUUNAUEAQQAoAuzfATYCzPIBQYACEB9BAC0A+NUBEB4PCwJAIAApAgQQmgVSDQAgABCIBSAALQANIgFBAC0AyPIBTw0BQQAoAsTyASABQQJ0aigCACECAkACQAJAIAAvAQ5B+V1qDgMBAgACCyABEIkFIgMhAQJAIAMNACACEJcFIQELAkAgASIBDQAgABCCBRoPCyAAIAEQgQUaDwsgAhCYBSIBQX9GDQAgACABQf8BcRD+BBoPCyACIAAgAigCACgCDBECAA8LIAAtAANBBHFFDQBBAC0AyPIBRQ0AIAAoAgQhBEEAIQEDQAJAQQAoAsTyASABIgFBAnRqKAIAIgIoAgAiAygCACAERw0AIAAgAToADSACIAAgAygCDBECAAsgAUEBaiICIQEgAkEALQDI8gFJDQALCwsCAAsCAAsEAEEAC2YBAX8CQEEALQDI8gFBIEkNAEGIPUGwAUGAMRCiBQALIAAvAQQQISIBIAA2AgAgAUEALQDI8gEiADoABEEAQf8BOgDJ8gFBACAAQQFqOgDI8gFBACgCxPIBIABBAnRqIAE2AgAgAQuxAgIFfwF+IwBBgAFrIgAkAEEAQQA6AMjyAUEAIAA2AsTyAUEAEDanIgE2AuzfAQJAAkACQAJAIAFBACgC2PIBIgJrIgNB//8ASw0AQQApA+DyASEFIANB6AdLDQEgBSEFIAMhAwwCC0EAQQApA+DyASADQegHbiICrXw3A+DyASADIAJB6AdsayEDDAILIAUgASACa0GXeGoiA0HoB24iBEEBaq18IQUgASACIANqayADIARB6Adsa2pBmHhqIQMLQQAgBTcD4PIBIAMhAwtBACABIANrNgLY8gFBAEEAKQPg8gE+AujyARDUBBA5EJYFQQBBADoAyfIBQQBBAC0AyPIBQQJ0ECEiATYCxPIBIAEgAEEALQDI8gFBAnQQxQUaQQAQNj4CzPIBIABBgAFqJAALwgECA38BfkEAEDanIgA2AuzfAQJAAkACQAJAIABBACgC2PIBIgFrIgJB//8ASw0AQQApA+DyASEDIAJB6AdLDQEgAyEDIAIhAgwCC0EAQQApA+DyASACQegHbiIBrXw3A+DyASACIAFB6AdsayECDAILIAMgACABa0GXeGoiAkHoB24iAa18QgF8IQMgAiABQegHbGtBAWohAgtBACADNwPg8gEgAiECC0EAIAAgAms2AtjyAUEAQQApA+DyAT4C6PIBCxMAQQBBAC0A0PIBQQFqOgDQ8gELxAEBBn8jACIAIQEQICAAQQAtAMjyASICQQJ0QQ9qQfAPcWsiAyQAAkAgAkUNAEEAKALE8gEhBEEAIQADQCADIAAiAEECdCIFaiAEIAVqKAIAKAIAKAIANgIAIABBAWoiBSEAIAUgAkcNAAsLAkBBAC0A0fIBIgBBD08NAEEAIABBAWo6ANHyAQsgA0EALQDQ8gFBEHRBAC0A0fIBckGAngRqNgIAAkBBAEEAIAMgAkECdBC9BQ0AQQBBADoA0PIBCyABJAALBABBAQvcAQECfwJAQdTyAUGgwh4QpAVFDQAQjgULAkACQEEAKALM8gEiAEUNAEEAKALs3wEgAGtBgICAf2pBAEgNAQtBAEEANgLM8gFBkQIQHwtBACgCxPIBKAIAIgAgACgCACgCCBEAAAJAQQAtAMnyAUH+AUYNAAJAQQAtAMjyAUEBTQ0AQQEhAANAQQAgACIAOgDJ8gFBACgCxPIBIABBAnRqKAIAIgEgASgCACgCCBEAACAAQQFqIgEhACABQQAtAMjyAUkNAAsLQQBBADoAyfIBCxCyBRD2BBDLBBDBBQvPAQIEfwF+QQAQNqciADYC7N8BAkACQAJAAkAgAEEAKALY8gEiAWsiAkH//wBLDQBBACkD4PIBIQQgAkHoB0sNASAEIQQgAiECDAILQQBBACkD4PIBIAJB6AduIgGtfDcD4PIBIAIgAUHoB2xrIQIMAgsgBCAAIAFrQZd4aiICQegHbiIDQQFqrXwhBCAAIAEgAmprIAIgA0HoB2xrakGYeGohAgtBACAENwPg8gEgAiECC0EAIAAgAms2AtjyAUEAQQApA+DyAT4C6PIBEJIFC2cBAX8CQAJAA0AQuAUiAEUNAQJAIAAtAANBA3FBA0cNACAAKQIEEJoFUg0AQT8gAC8BAEEAQQAQvQUaEMEFCwNAIAAQhgUgABCeBQ0ACyAAELkFEJAFED4gAA0ADAILAAsQkAUQPgsLFAEBf0GOL0EAENsEIgBBgiggABsLDgBBkjdB8f///wMQ2gQLBgBByN0AC90BAQN/IwBBEGsiACQAAkBBAC0A7PIBDQBBAEJ/NwOI8wFBAEJ/NwOA8wFBAEJ/NwP48gFBAEJ/NwPw8gEDQEEAIQECQEEALQDs8gEiAkH/AUYNAEHH3QAgAkGMMRDcBCEBCyABQQAQ2wQhAUEALQDs8gEhAgJAAkAgAQ0AQcAAIQEgAkHAAEkNAUEAQf8BOgDs8gEgAEEQaiQADwsgACACNgIEIAAgATYCAEHMMSAAEDxBAC0A7PIBQQFqIQELQQAgAToA7PIBDAALAAtBqs8AQeM/QdYAQZ0hEKcFAAs1AQF/QQAhAQJAIAAtAARB8PIBai0AACIAQf8BRg0AQcfdACAAQYkvENwEIQELIAFBABDbBAs4AAJAAkAgAC0ABEHw8gFqLQAAIgBB/wFHDQBBACEADAELQcfdACAAQegQENwEIQALIABBfxDZBAtTAQN/AkAgAQ0AQcW78oh4DwtBxbvyiHghAiAAIQAgASEBA0AgAiAAIgAtAABzQZODgAhsIgMhAiAAQQFqIQAgAUF/aiIEIQEgAyEDIAQNAAsgAwsEABA0C04BAX8CQEEAKAKQ8wEiAA0AQQAgAEGTg4AIbEENczYCkPMBC0EAQQAoApDzASIAQQ10IABzIgBBEXYgAHMiAEEFdCAAcyIANgKQ8wEgAAt+AQN/Qf//AyECAkAgAUUNACABIQIgACEAQf//AyEBA0AgAkF/aiIDIQIgACIEQQFqIQAgAUH//wNxIgFBCHQgBC0AACABQQh2cyIBQfABcUEEdiABc0H/AXEiAXIgAUEMdHMgAUEFdHMiBCEBIAMNAAsgBCECCyACQf//A3ELdQEFfyAALQACQQpqIQEgAEECaiECQf//AyEDA0AgAUF/aiIEIQEgAiIFQQFqIQIgA0H//wNxIgNBCHQgBS0AACADQQh2cyIDQfABcUEEdiADc0H/AXEiA3IgA0EMdHMgA0EFdHMiBSEDIAQNAAsgACAFOwEAC4YCAQh/AkAgAC0ADCIBQQdqQfwDcSICIAAtAAIiA0kNAEEADwsgAiECAkAgAEEMaiIEIAFBBGoiBWotAABB/wFHDQACQCABIABqQRFqLQAAIgEgA0kNAEEADwsgASECIAUgAUkNAEEADwsgACAALQADQf0BcToAA0EAIQECQCAAIAIiBWpBDGoiAi0AACIGQQRqIgcgBWogA0oNACACIQEgBCEDIAZBB2oiCEECdiECA0AgAyIDIAEiASgCADYCACABQQRqIQEgA0EEaiEDIAJBf2oiBCECIAQNAAsgAEEMaiIBIAdqQf8BOgAAIAYgAWpBBWogCEH8AXEgBWo6AABBASEBCyABC0kBAX8CQCACQQRJDQAgASEBIAAhACACQQJ2IQIDQCAAIgAgASIBKAIANgIAIAFBBGohASAAQQRqIQAgAkF/aiIDIQIgAw0ACwsLCQAgAEEAOgACC5wBAQN/AkACQCABQYACTw0AIAJBgIAETw0BQQAhBAJAIANBBGogAEEMaiIFIAUgAC0AAiIGaiIFa0HsAWpLDQAgBSABOgABIAUgAzoAACAFQQNqIAJBCHY6AAAgBUECaiACOgAAIAAgBiADQQdqQfwBcWo6AAIgBUEEaiEECyAEDwtB7z5B/QBB5C4QogUAC0HvPkH/AEHkLhCiBQALLAEBfyMAQRBrIgMkACADIAI2AgggAyABNgIEIAMgADYCAEHGFyADEDwQHQALSQEDfwJAIAAoAgAiAkEAKALo8gFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoAujyASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtJAQN/AkAgACgCACICQQAoAuzfAWsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgC7N8BIgRrQX9KDQAgACAEIAFqNgIACyADQR92C2oBA38CQCACRQ0AQQAhAwNAIAAgAyIDQQF0aiIEIAEgA2oiBS0AAEEEdkGQKmotAAA6AAAgBEEBaiAFLQAAQQ9xQZAqai0AADoAACADQQFqIgQhAyAEIAJHDQALCyAAIAJBAXRqQQA6AAAL4gIBB38gACECAkAgAS0AACIDRQ0AIANFIQQgAyEDIAEhAUEAIQUgACEGA0AgBiEHIAUhCCAEIQQgAyEDIAEhAgJAA0AgAiECIAQhBQJAAkAgAyIEQVBqQf8BcUEJSyIDDQAgBMBBUGohAQwBC0F/IQEgBEEgciIGQZ9/akH/AXFBBUsNACAGwEGpf2ohAQsgAUF/Rw0BIAItAAEiAUUhBCABIQMgAkEBaiECIAENAAsgByECDAILAkAgBUEBcUUNACAHIQIMAgsCQAJAIAMNACAEwEFQaiEBDAELQX8hASAEQSByIgRBn39qQf8BcUEFSw0AIATAQal/aiEBCyABIQEgAkEBaiECAkACQCAIDQAgByEGIAFBBHRBgAJyIQUMAQsgByABIAhyOgAAIAdBAWohBkEAIQULIAItAAAiB0UhBCAHIQMgAiEBIAUhBSAGIgIhBiACIQIgBw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGhFyAEEDwQHQALWAEEfyAAIAAtAAAiAUEtRmohAEEAIQIDQCAAIgNBAWohACADLAAAQVBqIgMgAiICQQpsaiACIANB/wFxQQpJIgMbIgQhAiADDQALQQAgBGsgBCABQS1GGwu3EAEOfyMAQcAAayIFJAAgACABaiEGIAVBf2ohByAFQQFyIQggBUECciEJQQAhASAAIQogBCEEIAIhCyACIQIDQCACIQIgBCEMIAohDSABIQEgCyIOQQFqIQ8CQAJAIA4tAAAiEEElRg0AIBBFDQAgASEBIA0hCiAMIQQgDyELQQEhDyACIQIMAQsCQAJAIAIgD0cNACABIQEgDSEKDAELIAYgDWshESABIQFBACEKAkAgAkF/cyAPaiILQQBMDQADQCABIAIgCiIKai0AAEHAAXFBgAFHaiEBIApBAWoiBCEKIAQgC0cNAAsLIAEhAQJAIBFBAEwNACANIAIgCyARQX9qIBEgC0obIgoQxQUgCmpBADoAAAsgASEBIA0gC2ohCgsgCiENIAEhEQJAIBANACARIQEgDSEKIAwhBCAPIQtBACEPIAIhAgwBCwJAAkAgDy0AAEEtRg0AIA8hAUEAIQoMAQsgDkECaiAPIA4tAAJB8wBGIgobIQEgCiAAQQBHcSEKCyAKIQ4gASISLAAAIQEgBUEAOgABIBJBAWohDwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQIBwcHBwYHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcDBwcHBwcHBwcHBwABBwUHBwcHBwcHBwcEBwcKBwIHBwMHCyAFIAwoAgA6AAAgESEKIA0hBCAMQQRqIQIMDAsgBSEKAkACQCAMKAIAIgFBf0wNACABIQEgCiEKDAELIAVBLToAAEEAIAFrIQEgCCEKCyAMQQRqIQ4gCiILIQogASEEA0AgCiIKIAQiASABQQpuIgRBCmxrQTByOgAAIApBAWoiAiEKIAQhBCABQQlLDQALIAJBADoAACALIAsQ9AVqQX9qIgQhCiALIQEgBCALTQ0KA0AgASIBLQAAIQQgASAKIgotAAA6AAAgCiAEOgAAIApBf2oiBCEKIAFBAWoiAiEBIAIgBEkNAAwLCwALIAUhCiAMKAIAIQQDQCAKIgogBCIBIAFBCm4iBEEKbGtBMHI6AAAgCkEBaiICIQogBCEEIAFBCUsNAAsgAkEAOgAAIAxBBGohCyAHIAUQ9AVqIgQhCiAFIQEgBCAFTQ0IA0AgASIBLQAAIQQgASAKIgotAAA6AAAgCiAEOgAAIApBf2oiBCEKIAFBAWoiAiEBIAIgBEkNAAwJCwALIAVBsPABOwEAIAwoAgAhC0EAIQpBHCEEA0AgCiEKAkACQCALIAQiAXZBD3EiBA0AIAFFDQBBACECIApFDQELIAkgCmogBEE3aiAEQTByIARBCUsbOgAAIApBAWohAgsgAiICIQogAUF8aiEEIAENAAsgCSACakEAOgAAIBEhCiANIQQgDEEEaiECDAkLIAVBsPABOwEAIAwoAgAhC0EAIQpBHCEEA0AgCiEKAkACQCALIAQiAXZBD3EiBA0AIAFFDQBBACECIApFDQELIAkgCmogBEE3aiAEQTByIARBCUsbOgAAIApBAWohAgsgAiICIQogAUF8aiEEIAENAAsgCSACakEAOgAAIBEhCiANIQQgDEEEaiECDAgLIAUgDEEHakF4cSIBKwMAQQgQqgUgESEKIA0hBCABQQhqIQIMBwsCQAJAIBItAAFB8ABGDQAgESEBIA0hD0E/IQ0MAQsCQCAMKAIAIgFBAU4NACARIQEgDSEPQQAhDQwBCyAMKAIEIQogASEEIA0hAiARIQsDQCALIREgAiENIAohCyAEIhBBHyAQQR9IGyECQQAhAQNAIAUgASIBQQF0aiIKIAsgAWoiBC0AAEEEdkGQKmotAAA6AAAgCiAELQAAQQ9xQZAqai0AADoAASABQQFqIgohASAKIAJHDQALIAUgAkEBdCIPakEAOgAAIAYgDWshDiARIQFBACEKAkAgD0EATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIA9HDQALCyABIQECQCAOQQBMDQAgDSAFIA8gDkF/aiAOIA9KGyIKEMUFIApqQQA6AAALIAsgAmohCiAQIAJrIg4hBCANIA9qIg8hAiABIQsgASEBIA8hD0EAIQ0gDkEASg0ACwsgBSANOgAAIAEhCiAPIQQgDEEIaiECIBJBAmohAQwHCyAFQT86AAAMAQsgBSABOgAACyARIQogDSEEIAwhAgwDCyAGIA1rIRAgESEBQQAhCgJAIAwoAgAiBEHg2AAgBBsiCxD0BSICQQBMDQADQCABIAsgCiIKai0AAEHAAXFBgAFHaiEBIApBAWoiBCEKIAQgAkcNAAsLIAEhAQJAIBBBAEwNACANIAsgAiAQQX9qIBAgAkobIgoQxQUgCmpBADoAAAsgDEEEaiEQIAVBADoAACANIAJqIQQCQCAORQ0AIAsQIgsgASEKIAQhBCAQIQIMAgsgESEKIA0hBCALIQIMAQsgESEKIA0hBCAOIQILIA8hAQsgASENIAIhDiAGIAQiD2shCyAKIQFBACEKAkAgBRD0BSICQQBMDQADQCABIAUgCiIKai0AAEHAAXFBgAFHaiEBIApBAWoiBCEKIAQgAkcNAAsLIAEhAQJAIAtBAEwNACAPIAUgAiALQX9qIAsgAkobIgoQxQUgCmpBADoAAAsgASEBIA8gAmohCiAOIQQgDSELQQEhDyANIQILIAEiDiEBIAoiDSEKIAQhBCALIQsgAiECIA8NAAsCQCADRQ0AIAMgDkEBajYCAAsgBUHAAGokACANIABrQQFqC+0IAwN+CH8BfAJAAkAgAUQAAAAAAAAAAGMNACABIQEgACEADAELIABBLToAACABmiEBIABBAWohAAsgACEAAkAgASIBvUL///////////8AgyIDQoGAgICAgID4/wBUDQAgAEHOwrkCNgAADwsCQCADQoCAgICAgID4/wBSDQAgAEHp3JkDNgAADwsCQCABRLDKbkftiRAAY0UNACAAQTA7AAAPCyACQQQgAkEEShsiAkEPSSEGIAFEje21oPfGsD5jIQcCQAJAIAEQ3QUiDplEAAAAAAAA4EFjRQ0AIA6qIQgMAQtBgICAgHghCAsgCCEIIAJBDyAGGyECAkACQCAHDQAgAURQ7+LW5BpLRGQNACAIIQZBASEHIAEhAQwBCwJAIAhBf0oNAEEAIQYgCCEHIAFEAAAAAAAAJEBBACAIaxCeBqIhAQwBC0EAIQYgCCEHIAFEAAAAAAAAJEAgCBCeBqMhAQsgASEBIAchCSACIAYiCkEBaiILQQ8gCkEPSCIGGyAKIAJIIggbIQwCQAJAIAgNACAGDQAgCiAMa0EBaiIIIQIgAUQAAAAAAAAkQCAIEJ4Go0QAAAAAAADgP6AhAQwBC0EAIQIgAUQAAAAAAAAkQCAMIApBf3NqEJ4GokQAAAAAAADgP6AhAQsgAiENIApBf0ohAgJAAkAgASIBRAAAAAAAAPBDYyABRAAAAAAAAAAAZnFFDQAgAbEhAwwBC0IAIQMLIAMhAwJAAkAgAkUNACAAIQAMAQsgAEGw3AA7AAAgAEECaiECAkAgCkF/Rw0AIAIhAAwBCyACQTAgCkF/cxDHBRogACAKa0EBaiEACyADIQMgDCEIIAAhAAJAA0AgACECIAMhBAJAIAgiCEEBTg0AIAIhAgwCC0EwIQAgBCEDAkAgBCAIQX9qIghBA3RB4IEBaikDACIFVA0AA0AgAEEBaiEAIAMgBX0iBCEDIAQgBVoNAAsLIAIgADoAACACQQFqIQACQAJAIAMiA0IAUiAMIAhrIgcgCkxyIgZBAUYNACAAIQAMAQsgACEAIAcgC0cNACACQS46AAEgAkECaiEACyADIQMgCCEIIAAiAiEAIAIhAiAGDQALCyACIQACQAJAIA1BAU4NACAAIQAMAQsgAEEwIA0QxwUgDWohAAsgACEAAkACQCAJQQFGDQAgAEHlADoAAAJAAkAgCUEBTg0AIABBAWohAAwBCyAAQSs6AAEgAEECaiEACyAAIQACQAJAIAlBf0wNACAJIQggACEADAELIABBLToAAEEAIAlrIQggAEEBaiEACyAAIgchAiAIIQgDQCACIgIgCCIAIABBCm4iCEEKbGtBMHI6AAAgAkEBaiIGIQIgCCEIIABBCUsNAAsgBkEAOgAAIAcgBxD0BWpBf2oiACAHTQ0BIAAhAiAHIQADQCAAIgAtAAAhCCAAIAIiAi0AADoAACACIAg6AAAgAkF/aiIIIQIgAEEBaiIGIQAgBiAISQ0ADAILAAsgAEEAOgAACwsPACAAIAEgAkEAIAMQqQULLAEBfyMAQRBrIgQkACAEIAM2AgwgACABIAJBACADEKkFIQMgBEEQaiQAIAMLrgEBBn8jAEEQayICIAE3AwhBxbvyiHghAyACQQhqIQJBCCEEA0AgA0GTg4AIbCIFIAIiAi0AAHMiBiEDIAJBAWohAiAEQX9qIgchBCAHDQALIABBADoABCAAIAZB/////wNxIgNB6DRuQQpwQTByOgADIAAgA0GkBW5BCnBBMHI6AAIgACADIAVBHnZzIgNBGm4iAkEacEHBAGo6AAEgACADIAJBGmxrQcEAajoAAAtNAQJ/IwBBEGsiAiQAIAIgATYCBCACIAE2AgwgAiABNgIIQQBBACAAQQAgARCpBSIBECEiAyABIABBACACKAIIEKkFGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkGQKmotAAA6AAAgBUEBaiAGLQAAQQ9xQZAqai0AADoAACAEQQFqIgUhBCAFIAFHDQALCyADIAJqQQA6AAAgAwvpAQEHfyMAQRBrIgEkACABQQA2AgwgAUIANwIEIAEgADYCAAJAAkAgAA0AQQEhAgwBCyAAIQJBACEDQQAhBANAIAIhBSABIARBAWoiBEECdGooAgAiBiECIAUQ9AUgA2oiBSEDIAQhBCAGDQALIAVBAWohAgsgAhAhIQdBACEFAkAgAEUNACAAIQJBACEDQQAhBANAIAIhAiAHIAMiA2ogAiACEPQFIgUQxQUaIAEgBEEBaiIEQQJ0aigCACIGIQIgBSADaiIFIQMgBCEEIAUhBSAGDQALCyAHIAVqQQA6AAAgAUEQaiQAIAcLGQACQCABDQBBARAhDwsgARAhIAAgARDFBQsSAAJAQQAoApjzAUUNABCzBQsLngMBB38CQEEALwGc8wEiAEUNACAAIQFBACgClPMBIgAiAiEDIAAhACACIQIDQCAAIQQgAiIAQQhqIQUgASECIAMhAQNAIAEhASACIQMCQAJAAkAgAC0ABSICQf8BRw0AIAAgAUcNAUEAIAMgAS0ABEEDakH8A3FBCGoiAmsiAzsBnPMBIAEgASACaiADQf//A3EQnwUMAgtBACgC7N8BIAAoAgBrQQBIDQAgAkH/AHEgAC8BBiAFIAAtAAQQvQUNBAJAAkAgACwABSIBQX9KDQACQCAAQQAoApTzASIBRg0AQf8BIQEMAgtBAEEALwGc8wEgAS0ABEEDakH8A3FBCGoiAmsiAzsBnPMBIAEgASACaiADQf//A3EQnwUMAwsgACAAKAIAQdCGA2o2AgAgAUGAf3IhAQsgACABOgAFC0EALwGc8wEiBCEBQQAoApTzASIFIQMgAC0ABEEDakH8A3EgAGpBCGoiBiEAIAYhAiAGIAVrIARIDQIMAwtBAC8BnPMBIgMhAkEAKAKU8wEiBiEBIAQgBmsgA0gNAAsLCwvwAgEEfwJAAkAQIw0AIAFBgAJPDQFBAEEALQCe8wFBAWoiBDoAnvMBIAAtAAQgBEEIdCABQf8BcXJBgIB+ciIFQf//A3EgAiADEL0FGgJAQQAoApTzAQ0AQYABECEhAUEAQeYBNgKY8wFBACABNgKU8wELAkAgA0EIaiIGQYABSg0AAkACQEGAAUEALwGc8wEiAWsgBkgNACABIQcMAQsgASEEA0BBACAEQQAoApTzASIBLQAEQQNqQfwDcUEIaiIEayIHOwGc8wEgASABIARqIAdB//8DcRCfBUEALwGc8wEiASEEIAEhB0GAASABayAGSA0ACwtBACgClPMBIAciBGoiASAFOwEGIAEgAzoABCABIAAtAAQ6AAUgAUEIaiACIAMQxQUaIAFBACgC7N8BQaCcAWo2AgBBACADQf8BcUEDakH8A3EgBGpBCGo7AZzzAQsPC0HrwABB3QBBoA0QogUAC0HrwABBI0GFMxCiBQALGwACQEEAKAKg8wENAEEAQYAEEP0ENgKg8wELCzsBAX8CQCAADQBBAA8LQQAhAQJAIAAQjwVFDQAgACAALQADQb8BcToAA0EAKAKg8wEgABD6BCEBCyABCzsBAX8CQCAADQBBAA8LQQAhAQJAIAAQjwVFDQAgACAALQADQcAAcjoAA0EAKAKg8wEgABD6BCEBCyABCwwAQQAoAqDzARD7BAsMAEEAKAKg8wEQ/AQLNQEBfwJAQQAoAqTzASAAEPoEIgFFDQBBkilBABA8CwJAIAAQtwVFDQBBgClBABA8CxBAIAELNQEBfwJAQQAoAqTzASAAEPoEIgFFDQBBkilBABA8CwJAIAAQtwVFDQBBgClBABA8CxBAIAELGwACQEEAKAKk8wENAEEAQYAEEP0ENgKk8wELC5kBAQJ/AkACQAJAECMNAEGs8wEgACABIAMQoQUiBCEFAkAgBA0AEL4FQazzARCgBUGs8wEgACABIAMQoQUiASEFIAFFDQILIAUhAQJAIANFDQAgAkUNAyABIAIgAxDFBRoLQQAPC0HFwABB0gBBsTIQogUAC0GAygBBxcAAQdoAQbEyEKcFAAtBtcoAQcXAAEHiAEGxMhCnBQALRABBABCaBTcCsPMBQazzARCdBQJAQQAoAqTzAUGs8wEQ+gRFDQBBkilBABA8CwJAQazzARC3BUUNAEGAKUEAEDwLEEALRwECfwJAQQAtAKjzAQ0AQQAhAAJAQQAoAqTzARD7BCIBRQ0AQQBBAToAqPMBIAEhAAsgAA8LQeooQcXAAEH0AEHULhCnBQALRgACQEEALQCo8wFFDQBBACgCpPMBEPwEQQBBADoAqPMBAkBBACgCpPMBEPsERQ0AEEALDwtB6yhBxcAAQZwBQa4QEKcFAAsyAAJAECMNAAJAQQAtAK7zAUUNABC+BRCNBUGs8wEQoAULDwtBxcAAQakBQYknEKIFAAsGAEGo9QELTwIBfgJ/AkACQCAAvSIBQjSIp0H/D3EiAkH/D0YNAEEEIQMgAg0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC44EAQN/AkAgAkGABEkNACAAIAEgAhATIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQxQUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAKs9QFFDQBBACgC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QX9qIgRqLQAAIAYgBGotAABGDQALIA0hBCAOIQcMAgsgCCALayEEC0EAIQcLIAYgBGohBgwACwALQQAhBgsgAkGgCGokACAGC0EBAn8jAEEQayIBJABBfyECAkAgABDQBQ0AIAAgAUEPakEBIAAoAiARBgBBAUcNACABLQAPIQILIAFBEGokACACC0cBAn8gACABNwNwIAAgACgCLCAAKAIEIgJrrDcDeCAAKAIIIQMCQCABUA0AIAMgAmusIAFXDQAgAiABp2ohAwsgACADNgJoC90BAgN/An4gACkDeCAAKAIEIgEgACgCLCICa6x8IQQCQAJAAkAgACkDcCIFUA0AIAQgBVkNAQsgABD7BSICQX9KDQEgACgCBCEBIAAoAiwhAgsgAEJ/NwNwIAAgATYCaCAAIAQgAiABa6x8NwN4QX8PCyAEQgF8IQQgACgCBCEBIAAoAgghAwJAIAApA3AiBUIAUQ0AIAUgBH0iBSADIAFrrFkNACABIAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQnAYgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABCcBiADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EJwGIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORCcBiADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQnAYgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEJIGRQ0AIAMgBBCCBiEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBCcBiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEJQGIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChCSBkEASg0AAkAgASAJIAMgChCSBkUNACABIQQMAgsgBUHwAGogASACQgBCABCcBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQnAYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEJwGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABCcBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQnAYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EJwGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkHs1QFqKAIAIQYgAkHg1QFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEP0FIQILIAIQ/gUNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARD9BSECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEP0FIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAEIAiyQwAAgH+UEJYGIARBCGopAwAhCyAEKQMAIQoMAgsCQAJAAkAgCQ0AQQAhCQNAIAJBIHIgCUGgJGosAABHDQECQCAJQQFLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ/QUhAgsgCUEBaiIJQQNHDQAMAgsACwJAAkAgCQ4EAAEBAgELAkAgAkEwRw0AAkACQCABKAIEIgkgASgCaEYNACAFIAlBAWo2AgAgCS0AACEJDAELIAEQ/QUhCQsCQCAJQV9xQdgARw0AIARBEGogASAHIAYgCCADEIYGIARBGGopAwAhCyAEKQMQIQoMBgsgASkDcEIAUw0AIAUgBSgCAEF/ajYCAAsgBEEgaiABIAIgByAGIAggAxCHBiAEQShqKQMAIQsgBCkDICEKDAQLQgAhCgJAIAEpA3BCAFMNACAFIAUoAgBBf2o2AgALEMIFQRw2AgAMAQsCQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARD9BSECCwJAAkAgAkEoRw0AQQEhCQwBC0IAIQpCgICAgICA4P//ACELIAEpA3BCAFMNAyAFIAUoAgBBf2o2AgAMAwsDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEP0FIQILIAJBv39qIQgCQAJAIAJBUGpBCkkNACAIQRpJDQAgAkGff2ohCCACQd8ARg0AIAhBGk8NAQsgCUEBaiEJDAELC0KAgICAgIDg//8AIQsgAkEpRg0CAkAgASkDcCIMQgBTDQAgBSAFKAIAQX9qNgIACwJAAkAgA0UNACAJDQFCACEKDAQLEMIFQRw2AgBCACEKDAELA0AgCUF/aiEJAkAgDEIAUw0AIAUgBSgCAEF/ajYCAAtCACEKIAkNAAwDCwALIAEgChD8BQtCACELCyAAIAo3AwAgACALNwMIIARBMGokAAvCDwIIfwd+IwBBsANrIgYkAAJAAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEP0FIQcLQQAhCEIAIQ5BACEJAkACQAJAA0ACQCAHQTBGDQAgB0EuRw0EIAEoAgQiByABKAJoRg0CIAEgB0EBajYCBCAHLQAAIQcMAwsCQCABKAIEIgcgASgCaEYNAEEBIQkgASAHQQFqNgIEIActAAAhBwwBC0EBIQkgARD9BSEHDAALAAsgARD9BSEHC0EBIQhCACEOIAdBMEcNAANAAkACQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQ/QUhBwsgDkJ/fCEOIAdBMEYNAAtBASEIQQEhCQtCgICAgICAwP8/IQ9BACEKQgAhEEIAIRFCACESQQAhC0IAIRMCQANAIAdBIHIhDAJAAkAgB0FQaiINQQpJDQACQCAMQZ9/akEGSQ0AIAdBLkcNBAsgB0EuRw0AIAgNA0EBIQggEyEODAELIAxBqX9qIA0gB0E5ShshBwJAAkAgE0IHVQ0AIAcgCkEEdGohCgwBCwJAIBNCHFYNACAGQTBqIAcQlwYgBkEgaiASIA9CAEKAgICAgIDA/T8QnAYgBkEQaiAGKQMwIAZBMGpBCGopAwAgBikDICISIAZBIGpBCGopAwAiDxCcBiAGIAYpAxAgBkEQakEIaikDACAQIBEQkAYgBkEIaikDACERIAYpAwAhEAwBCyAHRQ0AIAsNACAGQdAAaiASIA9CAEKAgICAgICA/z8QnAYgBkHAAGogBikDUCAGQdAAakEIaikDACAQIBEQkAYgBkHAAGpBCGopAwAhEUEBIQsgBikDQCEQCyATQgF8IRNBASEJCwJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARD9BSEHDAALAAsCQAJAIAkNAAJAAkACQCABKQNwQgBTDQAgASABKAIEIgdBf2o2AgQgBUUNASABIAdBfmo2AgQgCEUNAiABIAdBfWo2AgQMAgsgBQ0BCyABQgAQ/AULIAZB4ABqIAS3RAAAAAAAAAAAohCVBiAGQegAaikDACETIAYpA2AhEAwBCwJAIBNCB1UNACATIQ8DQCAKQQR0IQogD0IBfCIPQghSDQALCwJAAkACQAJAIAdBX3FB0ABHDQAgASAFEIgGIg9CgICAgICAgICAf1INAwJAIAVFDQAgASkDcEJ/VQ0CDAMLQgAhECABQgAQ/AVCACETDAQLQgAhDyABKQNwQgBTDQILIAEgASgCBEF/ajYCBAtCACEPCwJAIAoNACAGQfAAaiAEt0QAAAAAAAAAAKIQlQYgBkH4AGopAwAhEyAGKQNwIRAMAQsCQCAOIBMgCBtCAoYgD3xCYHwiE0EAIANrrVcNABDCBUHEADYCACAGQaABaiAEEJcGIAZBkAFqIAYpA6ABIAZBoAFqQQhqKQMAQn9C////////v///ABCcBiAGQYABaiAGKQOQASAGQZABakEIaikDAEJ/Qv///////7///wAQnAYgBkGAAWpBCGopAwAhEyAGKQOAASEQDAELAkAgEyADQZ5+aqxTDQACQCAKQX9MDQADQCAGQaADaiAQIBFCAEKAgICAgIDA/79/EJAGIBAgEUIAQoCAgICAgID/PxCTBiEHIAZBkANqIBAgESAGKQOgAyAQIAdBf0oiBxsgBkGgA2pBCGopAwAgESAHGxCQBiATQn98IRMgBkGQA2pBCGopAwAhESAGKQOQAyEQIApBAXQgB3IiCkF/Sg0ACwsCQAJAIBMgA6x9QiB8Ig6nIgdBACAHQQBKGyACIA4gAq1TGyIHQfEASA0AIAZBgANqIAQQlwYgBkGIA2opAwAhDkIAIQ8gBikDgAMhEkIAIRQMAQsgBkHgAmpEAAAAAAAA8D9BkAEgB2sQ/wUQlQYgBkHQAmogBBCXBiAGQfACaiAGKQPgAiAGQeACakEIaikDACAGKQPQAiISIAZB0AJqQQhqKQMAIg4QgAYgBkHwAmpBCGopAwAhFCAGKQPwAiEPCyAGQcACaiAKIAdBIEggECARQgBCABCSBkEAR3EgCkEBcUVxIgdqEJgGIAZBsAJqIBIgDiAGKQPAAiAGQcACakEIaikDABCcBiAGQZACaiAGKQOwAiAGQbACakEIaikDACAPIBQQkAYgBkGgAmogEiAOQgAgECAHG0IAIBEgBxsQnAYgBkGAAmogBikDoAIgBkGgAmpBCGopAwAgBikDkAIgBkGQAmpBCGopAwAQkAYgBkHwAWogBikDgAIgBkGAAmpBCGopAwAgDyAUEJ8GAkAgBikD8AEiECAGQfABakEIaikDACIRQgBCABCSBg0AEMIFQcQANgIACyAGQeABaiAQIBEgE6cQgQYgBkHgAWpBCGopAwAhEyAGKQPgASEQDAELEMIFQcQANgIAIAZB0AFqIAQQlwYgBkHAAWogBikD0AEgBkHQAWpBCGopAwBCAEKAgICAgIDAABCcBiAGQbABaiAGKQPAASAGQcABakEIaikDAEIAQoCAgICAgMAAEJwGIAZBsAFqQQhqKQMAIRMgBikDsAEhEAsgACAQNwMAIAAgEzcDCCAGQbADaiQAC/ofAwt/Bn4BfCMAQZDGAGsiByQAQQAhCEEAIARrIgkgA2shCkIAIRJBACELAkACQAJAA0ACQCACQTBGDQAgAkEuRw0EIAEoAgQiAiABKAJoRg0CIAEgAkEBajYCBCACLQAAIQIMAwsCQCABKAIEIgIgASgCaEYNAEEBIQsgASACQQFqNgIEIAItAAAhAgwBC0EBIQsgARD9BSECDAALAAsgARD9BSECC0EBIQhCACESIAJBMEcNAANAAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQ/QUhAgsgEkJ/fCESIAJBMEYNAAtBASELQQEhCAtBACEMIAdBADYCkAYgAkFQaiENAkACQAJAAkACQAJAAkAgAkEuRiIODQBCACETIA1BCU0NAEEAIQ9BACEQDAELQgAhE0EAIRBBACEPQQAhDANAAkACQCAOQQFxRQ0AAkAgCA0AIBMhEkEBIQgMAgsgC0UhDgwECyATQgF8IRMCQCAPQfwPSg0AIAJBMEYhCyATpyERIAdBkAZqIA9BAnRqIQ4CQCAQRQ0AIAIgDigCAEEKbGpBUGohDQsgDCARIAsbIQwgDiANNgIAQQEhC0EAIBBBAWoiAiACQQlGIgIbIRAgDyACaiEPDAELIAJBMEYNACAHIAcoAoBGQQFyNgKARkHcjwEhDAsCQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARD9BSECCyACQVBqIQ0gAkEuRiIODQAgDUEKSQ0ACwsgEiATIAgbIRICQCALRQ0AIAJBX3FBxQBHDQACQCABIAYQiAYiFEKAgICAgICAgIB/Ug0AIAZFDQRCACEUIAEpA3BCAFMNACABIAEoAgRBf2o2AgQLIBQgEnwhEgwECyALRSEOIAJBAEgNAQsgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgDkUNARDCBUEcNgIAC0IAIRMgAUIAEPwFQgAhEgwBCwJAIAcoApAGIgENACAHIAW3RAAAAAAAAAAAohCVBiAHQQhqKQMAIRIgBykDACETDAELAkAgE0IJVQ0AIBIgE1INAAJAIANBHkoNACABIAN2DQELIAdBMGogBRCXBiAHQSBqIAEQmAYgB0EQaiAHKQMwIAdBMGpBCGopAwAgBykDICAHQSBqQQhqKQMAEJwGIAdBEGpBCGopAwAhEiAHKQMQIRMMAQsCQCASIAlBAXatVw0AEMIFQcQANgIAIAdB4ABqIAUQlwYgB0HQAGogBykDYCAHQeAAakEIaikDAEJ/Qv///////7///wAQnAYgB0HAAGogBykDUCAHQdAAakEIaikDAEJ/Qv///////7///wAQnAYgB0HAAGpBCGopAwAhEiAHKQNAIRMMAQsCQCASIARBnn5qrFkNABDCBUHEADYCACAHQZABaiAFEJcGIAdBgAFqIAcpA5ABIAdBkAFqQQhqKQMAQgBCgICAgICAwAAQnAYgB0HwAGogBykDgAEgB0GAAWpBCGopAwBCAEKAgICAgIDAABCcBiAHQfAAakEIaikDACESIAcpA3AhEwwBCwJAIBBFDQACQCAQQQhKDQAgB0GQBmogD0ECdGoiAigCACEBA0AgAUEKbCEBIBBBAWoiEEEJRw0ACyACIAE2AgALIA9BAWohDwsgEqchCAJAIAxBCU4NACAMIAhKDQAgCEERSg0AAkAgCEEJRw0AIAdBwAFqIAUQlwYgB0GwAWogBygCkAYQmAYgB0GgAWogBykDwAEgB0HAAWpBCGopAwAgBykDsAEgB0GwAWpBCGopAwAQnAYgB0GgAWpBCGopAwAhEiAHKQOgASETDAILAkAgCEEISg0AIAdBkAJqIAUQlwYgB0GAAmogBygCkAYQmAYgB0HwAWogBykDkAIgB0GQAmpBCGopAwAgBykDgAIgB0GAAmpBCGopAwAQnAYgB0HgAWpBCCAIa0ECdEHA1QFqKAIAEJcGIAdB0AFqIAcpA/ABIAdB8AFqQQhqKQMAIAcpA+ABIAdB4AFqQQhqKQMAEJQGIAdB0AFqQQhqKQMAIRIgBykD0AEhEwwCCyAHKAKQBiEBAkAgAyAIQX1sakEbaiICQR5KDQAgASACdg0BCyAHQeACaiAFEJcGIAdB0AJqIAEQmAYgB0HAAmogBykD4AIgB0HgAmpBCGopAwAgBykD0AIgB0HQAmpBCGopAwAQnAYgB0GwAmogCEECdEGY1QFqKAIAEJcGIAdBoAJqIAcpA8ACIAdBwAJqQQhqKQMAIAcpA7ACIAdBsAJqQQhqKQMAEJwGIAdBoAJqQQhqKQMAIRIgBykDoAIhEwwBCwNAIAdBkAZqIA8iAkF/aiIPQQJ0aigCAEUNAAtBACEQAkACQCAIQQlvIgENAEEAIQ4MAQtBACEOIAFBCWogASAIQQBIGyEGAkACQCACDQBBACECDAELQYCU69wDQQggBmtBAnRBwNUBaigCACILbSERQQAhDUEAIQFBACEOA0AgB0GQBmogAUECdGoiDyAPKAIAIg8gC24iDCANaiINNgIAIA5BAWpB/w9xIA4gASAORiANRXEiDRshDiAIQXdqIAggDRshCCARIA8gDCALbGtsIQ0gAUEBaiIBIAJHDQALIA1FDQAgB0GQBmogAkECdGogDTYCACACQQFqIQILIAggBmtBCWohCAsDQCAHQZAGaiAOQQJ0aiEMAkADQAJAIAhBJEgNACAIQSRHDQIgDCgCAEHR6fkETw0CCyACQf8PaiEPQQAhDSACIQsDQCALIQICQAJAIAdBkAZqIA9B/w9xIgFBAnRqIgs1AgBCHYYgDa18IhJCgZTr3ANaDQBBACENDAELIBIgEkKAlOvcA4AiE0KAlOvcA359IRIgE6chDQsgCyASpyIPNgIAIAIgAiACIAEgDxsgASAORhsgASACQX9qQf8PcUcbIQsgAUF/aiEPIAEgDkcNAAsgEEFjaiEQIA1FDQALAkAgDkF/akH/D3EiDiALRw0AIAdBkAZqIAtB/g9qQf8PcUECdGoiASABKAIAIAdBkAZqIAtBf2pB/w9xIgJBAnRqKAIAcjYCAAsgCEEJaiEIIAdBkAZqIA5BAnRqIA02AgAMAQsLAkADQCACQQFqQf8PcSEJIAdBkAZqIAJBf2pB/w9xQQJ0aiEGA0BBCUEBIAhBLUobIQ8CQANAIA4hC0EAIQECQAJAA0AgASALakH/D3EiDiACRg0BIAdBkAZqIA5BAnRqKAIAIg4gAUECdEGw1QFqKAIAIg1JDQEgDiANSw0CIAFBAWoiAUEERw0ACwsgCEEkRw0AQgAhEkEAIQFCACETA0ACQCABIAtqQf8PcSIOIAJHDQAgAkEBakH/D3EiAkECdCAHQZAGampBfGpBADYCAAsgB0GABmogB0GQBmogDkECdGooAgAQmAYgB0HwBWogEiATQgBCgICAgOWat47AABCcBiAHQeAFaiAHKQPwBSAHQfAFakEIaikDACAHKQOABiAHQYAGakEIaikDABCQBiAHQeAFakEIaikDACETIAcpA+AFIRIgAUEBaiIBQQRHDQALIAdB0AVqIAUQlwYgB0HABWogEiATIAcpA9AFIAdB0AVqQQhqKQMAEJwGIAdBwAVqQQhqKQMAIRNCACESIAcpA8AFIRQgEEHxAGoiDSAEayIBQQAgAUEAShsgAyABIANIIg8bIg5B8ABMDQJCACEVQgAhFkIAIRcMBQsgDyAQaiEQIAIhDiALIAJGDQALQYCU69wDIA92IQxBfyAPdEF/cyERQQAhASALIQ4DQCAHQZAGaiALQQJ0aiINIA0oAgAiDSAPdiABaiIBNgIAIA5BAWpB/w9xIA4gCyAORiABRXEiARshDiAIQXdqIAggARshCCANIBFxIAxsIQEgC0EBakH/D3EiCyACRw0ACyABRQ0BAkAgCSAORg0AIAdBkAZqIAJBAnRqIAE2AgAgCSECDAMLIAYgBigCAEEBcjYCAAwBCwsLIAdBkAVqRAAAAAAAAPA/QeEBIA5rEP8FEJUGIAdBsAVqIAcpA5AFIAdBkAVqQQhqKQMAIBQgExCABiAHQbAFakEIaikDACEXIAcpA7AFIRYgB0GABWpEAAAAAAAA8D9B8QAgDmsQ/wUQlQYgB0GgBWogFCATIAcpA4AFIAdBgAVqQQhqKQMAEIMGIAdB8ARqIBQgEyAHKQOgBSISIAdBoAVqQQhqKQMAIhUQnwYgB0HgBGogFiAXIAcpA/AEIAdB8ARqQQhqKQMAEJAGIAdB4ARqQQhqKQMAIRMgBykD4AQhFAsCQCALQQRqQf8PcSIIIAJGDQACQAJAIAdBkAZqIAhBAnRqKAIAIghB/8m17gFLDQACQCAIDQAgC0EFakH/D3EgAkYNAgsgB0HwA2ogBbdEAAAAAAAA0D+iEJUGIAdB4ANqIBIgFSAHKQPwAyAHQfADakEIaikDABCQBiAHQeADakEIaikDACEVIAcpA+ADIRIMAQsCQCAIQYDKte4BRg0AIAdB0ARqIAW3RAAAAAAAAOg/ohCVBiAHQcAEaiASIBUgBykD0AQgB0HQBGpBCGopAwAQkAYgB0HABGpBCGopAwAhFSAHKQPABCESDAELIAW3IRgCQCALQQVqQf8PcSACRw0AIAdBkARqIBhEAAAAAAAA4D+iEJUGIAdBgARqIBIgFSAHKQOQBCAHQZAEakEIaikDABCQBiAHQYAEakEIaikDACEVIAcpA4AEIRIMAQsgB0GwBGogGEQAAAAAAADoP6IQlQYgB0GgBGogEiAVIAcpA7AEIAdBsARqQQhqKQMAEJAGIAdBoARqQQhqKQMAIRUgBykDoAQhEgsgDkHvAEoNACAHQdADaiASIBVCAEKAgICAgIDA/z8QgwYgBykD0AMgB0HQA2pBCGopAwBCAEIAEJIGDQAgB0HAA2ogEiAVQgBCgICAgICAwP8/EJAGIAdBwANqQQhqKQMAIRUgBykDwAMhEgsgB0GwA2ogFCATIBIgFRCQBiAHQaADaiAHKQOwAyAHQbADakEIaikDACAWIBcQnwYgB0GgA2pBCGopAwAhEyAHKQOgAyEUAkAgDUH/////B3EgCkF+akwNACAHQZADaiAUIBMQhAYgB0GAA2ogFCATQgBCgICAgICAgP8/EJwGIAcpA5ADIAdBkANqQQhqKQMAQgBCgICAgICAgLjAABCTBiECIAdBgANqQQhqKQMAIBMgAkF/SiICGyETIAcpA4ADIBQgAhshFCASIBVCAEIAEJIGIQ0CQCAQIAJqIhBB7gBqIApKDQAgDyAOIAFHcSAPIAIbIA1BAEdxRQ0BCxDCBUHEADYCAAsgB0HwAmogFCATIBAQgQYgB0HwAmpBCGopAwAhEiAHKQPwAiETCyAAIBI3AwggACATNwMAIAdBkMYAaiQAC8kEAgR/AX4CQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQMMAQsgABD9BSEDCwJAAkACQAJAAkAgA0FVag4DAAEAAQsCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABD9BSECCyADQS1GIQQgAkFGaiEFIAFFDQEgBUF1Sw0BIAApA3BCAFMNAiAAIAAoAgRBf2o2AgQMAgsgA0FGaiEFQQAhBCADIQILIAVBdkkNAEIAIQYCQCACQVBqIgVBCk8NAEEAIQMDQCACIANBCmxqIQMCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABD9BSECCyADQVBqIQMCQCACQVBqIgVBCUsNACADQcyZs+YASA0BCwsgA6whBgsCQCAFQQpPDQADQCACrSAGQgp+fCEGAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQ/QUhAgsgBkJQfCEGIAJBUGoiBUEJSw0BIAZCro+F18fC66MBUw0ACwsCQCAFQQpPDQADQAJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEP0FIQILIAJBUGpBCkkNAAsLAkAgACkDcEIAUw0AIAAgACgCBEF/ajYCBAtCACAGfSAGIAQbIQYMAQtCgICAgICAgICAfyEGIAApA3BCAFMNACAAIAAoAgRBf2o2AgRCgICAgICAgICAfw8LIAYLhgECAX8CfiMAQaABayIEJAAgBCABNgI8IAQgATYCFCAEQX82AhggBEEQakIAEPwFIAQgBEEQaiADQQEQhQYgBEEIaikDACEFIAQpAwAhBgJAIAJFDQAgAiABIAQoAhQgBCgCiAFqIAQoAjxrajYCAAsgACAFNwMIIAAgBjcDACAEQaABaiQACzUCAX8BfCMAQRBrIgIkACACIAAgAUEBEIkGIAIpAwAgAkEIaikDABCgBiEDIAJBEGokACADCxYAAkAgAA0AQQAPCxDCBSAANgIAQX8LpSsBC38jAEEQayIBJAACQAJAAkACQAJAAkACQAJAAkACQCAAQfQBSw0AAkBBACgCwPUBIgJBECAAQQtqQXhxIABBC0kbIgNBA3YiBHYiAEEDcUUNAAJAAkAgAEF/c0EBcSAEaiIFQQN0IgRB6PUBaiIAIARB8PUBaigCACIEKAIIIgNHDQBBACACQX4gBXdxNgLA9QEMAQsgAyAANgIMIAAgAzYCCAsgBEEIaiEAIAQgBUEDdCIFQQNyNgIEIAQgBWoiBCAEKAIEQQFyNgIEDAoLIANBACgCyPUBIgZNDQECQCAARQ0AAkACQCAAIAR0QQIgBHQiAEEAIABrcnEiAEEAIABrcWgiBEEDdCIAQej1AWoiBSAAQfD1AWooAgAiACgCCCIHRw0AQQAgAkF+IAR3cSICNgLA9QEMAQsgByAFNgIMIAUgBzYCCAsgACADQQNyNgIEIAAgA2oiByAEQQN0IgQgA2siBUEBcjYCBCAAIARqIAU2AgACQCAGRQ0AIAZBeHFB6PUBaiEDQQAoAtT1ASEEAkACQCACQQEgBkEDdnQiCHENAEEAIAIgCHI2AsD1ASADIQgMAQsgAygCCCEICyADIAQ2AgggCCAENgIMIAQgAzYCDCAEIAg2AggLIABBCGohAEEAIAc2AtT1AUEAIAU2Asj1AQwKC0EAKALE9QEiCUUNASAJQQAgCWtxaEECdEHw9wFqKAIAIgcoAgRBeHEgA2shBCAHIQUCQANAAkAgBSgCECIADQAgBUEUaigCACIARQ0CCyAAKAIEQXhxIANrIgUgBCAFIARJIgUbIQQgACAHIAUbIQcgACEFDAALAAsgBygCGCEKAkAgBygCDCIIIAdGDQAgBygCCCIAQQAoAtD1AUkaIAAgCDYCDCAIIAA2AggMCQsCQCAHQRRqIgUoAgAiAA0AIAcoAhAiAEUNAyAHQRBqIQULA0AgBSELIAAiCEEUaiIFKAIAIgANACAIQRBqIQUgCCgCECIADQALIAtBADYCAAwIC0F/IQMgAEG/f0sNACAAQQtqIgBBeHEhA0EAKALE9QEiBkUNAEEAIQsCQCADQYACSQ0AQR8hCyADQf///wdLDQAgA0EmIABBCHZnIgBrdkEBcSAAQQF0a0E+aiELC0EAIANrIQQCQAJAAkACQCALQQJ0QfD3AWooAgAiBQ0AQQAhAEEAIQgMAQtBACEAIANBAEEZIAtBAXZrIAtBH0YbdCEHQQAhCANAAkAgBSgCBEF4cSADayICIARPDQAgAiEEIAUhCCACDQBBACEEIAUhCCAFIQAMAwsgACAFQRRqKAIAIgIgAiAFIAdBHXZBBHFqQRBqKAIAIgVGGyAAIAIbIQAgB0EBdCEHIAUNAAsLAkAgACAIcg0AQQAhCEECIAt0IgBBACAAa3IgBnEiAEUNAyAAQQAgAGtxaEECdEHw9wFqKAIAIQALIABFDQELA0AgACgCBEF4cSADayICIARJIQcCQCAAKAIQIgUNACAAQRRqKAIAIQULIAIgBCAHGyEEIAAgCCAHGyEIIAUhACAFDQALCyAIRQ0AIARBACgCyPUBIANrTw0AIAgoAhghCwJAIAgoAgwiByAIRg0AIAgoAggiAEEAKALQ9QFJGiAAIAc2AgwgByAANgIIDAcLAkAgCEEUaiIFKAIAIgANACAIKAIQIgBFDQMgCEEQaiEFCwNAIAUhAiAAIgdBFGoiBSgCACIADQAgB0EQaiEFIAcoAhAiAA0ACyACQQA2AgAMBgsCQEEAKALI9QEiACADSQ0AQQAoAtT1ASEEAkACQCAAIANrIgVBEEkNACAEIANqIgcgBUEBcjYCBCAEIABqIAU2AgAgBCADQQNyNgIEDAELIAQgAEEDcjYCBCAEIABqIgAgACgCBEEBcjYCBEEAIQdBACEFC0EAIAU2Asj1AUEAIAc2AtT1ASAEQQhqIQAMCAsCQEEAKALM9QEiByADTQ0AQQAgByADayIENgLM9QFBAEEAKALY9QEiACADaiIFNgLY9QEgBSAEQQFyNgIEIAAgA0EDcjYCBCAAQQhqIQAMCAsCQAJAQQAoApj5AUUNAEEAKAKg+QEhBAwBC0EAQn83AqT5AUEAQoCggICAgAQ3Apz5AUEAIAFBDGpBcHFB2KrVqgVzNgKY+QFBAEEANgKs+QFBAEEANgL8+AFBgCAhBAtBACEAIAQgA0EvaiIGaiICQQAgBGsiC3EiCCADTQ0HQQAhAAJAQQAoAvj4ASIERQ0AQQAoAvD4ASIFIAhqIgkgBU0NCCAJIARLDQgLAkACQEEALQD8+AFBBHENAAJAAkACQAJAAkBBACgC2PUBIgRFDQBBgPkBIQADQAJAIAAoAgAiBSAESw0AIAUgACgCBGogBEsNAwsgACgCCCIADQALC0EAEI8GIgdBf0YNAyAIIQICQEEAKAKc+QEiAEF/aiIEIAdxRQ0AIAggB2sgBCAHakEAIABrcWohAgsgAiADTQ0DAkBBACgC+PgBIgBFDQBBACgC8PgBIgQgAmoiBSAETQ0EIAUgAEsNBAsgAhCPBiIAIAdHDQEMBQsgAiAHayALcSICEI8GIgcgACgCACAAKAIEakYNASAHIQALIABBf0YNAQJAIANBMGogAksNACAAIQcMBAsgBiACa0EAKAKg+QEiBGpBACAEa3EiBBCPBkF/Rg0BIAQgAmohAiAAIQcMAwsgB0F/Rw0CC0EAQQAoAvz4AUEEcjYC/PgBCyAIEI8GIQdBABCPBiEAIAdBf0YNBSAAQX9GDQUgByAATw0FIAAgB2siAiADQShqTQ0FC0EAQQAoAvD4ASACaiIANgLw+AECQCAAQQAoAvT4AU0NAEEAIAA2AvT4AQsCQAJAQQAoAtj1ASIERQ0AQYD5ASEAA0AgByAAKAIAIgUgACgCBCIIakYNAiAAKAIIIgANAAwFCwALAkACQEEAKALQ9QEiAEUNACAHIABPDQELQQAgBzYC0PUBC0EAIQBBACACNgKE+QFBACAHNgKA+QFBAEF/NgLg9QFBAEEAKAKY+QE2AuT1AUEAQQA2Aoz5AQNAIABBA3QiBEHw9QFqIARB6PUBaiIFNgIAIARB9PUBaiAFNgIAIABBAWoiAEEgRw0AC0EAIAJBWGoiAEF4IAdrQQdxQQAgB0EIakEHcRsiBGsiBTYCzPUBQQAgByAEaiIENgLY9QEgBCAFQQFyNgIEIAcgAGpBKDYCBEEAQQAoAqj5ATYC3PUBDAQLIAAtAAxBCHENAiAEIAVJDQIgBCAHTw0CIAAgCCACajYCBEEAIARBeCAEa0EHcUEAIARBCGpBB3EbIgBqIgU2Atj1AUEAQQAoAsz1ASACaiIHIABrIgA2Asz1ASAFIABBAXI2AgQgBCAHakEoNgIEQQBBACgCqPkBNgLc9QEMAwtBACEIDAULQQAhBwwDCwJAIAdBACgC0PUBIghPDQBBACAHNgLQ9QEgByEICyAHIAJqIQVBgPkBIQACQAJAAkACQAJAAkACQANAIAAoAgAgBUYNASAAKAIIIgANAAwCCwALIAAtAAxBCHFFDQELQYD5ASEAA0ACQCAAKAIAIgUgBEsNACAFIAAoAgRqIgUgBEsNAwsgACgCCCEADAALAAsgACAHNgIAIAAgACgCBCACajYCBCAHQXggB2tBB3FBACAHQQhqQQdxG2oiCyADQQNyNgIEIAVBeCAFa0EHcUEAIAVBCGpBB3EbaiICIAsgA2oiA2shAAJAIAIgBEcNAEEAIAM2Atj1AUEAQQAoAsz1ASAAaiIANgLM9QEgAyAAQQFyNgIEDAMLAkAgAkEAKALU9QFHDQBBACADNgLU9QFBAEEAKALI9QEgAGoiADYCyPUBIAMgAEEBcjYCBCADIABqIAA2AgAMAwsCQCACKAIEIgRBA3FBAUcNACAEQXhxIQYCQAJAIARB/wFLDQAgAigCCCIFIARBA3YiCEEDdEHo9QFqIgdGGgJAIAIoAgwiBCAFRw0AQQBBACgCwPUBQX4gCHdxNgLA9QEMAgsgBCAHRhogBSAENgIMIAQgBTYCCAwBCyACKAIYIQkCQAJAIAIoAgwiByACRg0AIAIoAggiBCAISRogBCAHNgIMIAcgBDYCCAwBCwJAIAJBFGoiBCgCACIFDQAgAkEQaiIEKAIAIgUNAEEAIQcMAQsDQCAEIQggBSIHQRRqIgQoAgAiBQ0AIAdBEGohBCAHKAIQIgUNAAsgCEEANgIACyAJRQ0AAkACQCACIAIoAhwiBUECdEHw9wFqIgQoAgBHDQAgBCAHNgIAIAcNAUEAQQAoAsT1AUF+IAV3cTYCxPUBDAILIAlBEEEUIAkoAhAgAkYbaiAHNgIAIAdFDQELIAcgCTYCGAJAIAIoAhAiBEUNACAHIAQ2AhAgBCAHNgIYCyACKAIUIgRFDQAgB0EUaiAENgIAIAQgBzYCGAsgBiAAaiEAIAIgBmoiAigCBCEECyACIARBfnE2AgQgAyAAQQFyNgIEIAMgAGogADYCAAJAIABB/wFLDQAgAEF4cUHo9QFqIQQCQAJAQQAoAsD1ASIFQQEgAEEDdnQiAHENAEEAIAUgAHI2AsD1ASAEIQAMAQsgBCgCCCEACyAEIAM2AgggACADNgIMIAMgBDYCDCADIAA2AggMAwtBHyEEAkAgAEH///8HSw0AIABBJiAAQQh2ZyIEa3ZBAXEgBEEBdGtBPmohBAsgAyAENgIcIANCADcCECAEQQJ0QfD3AWohBQJAAkBBACgCxPUBIgdBASAEdCIIcQ0AQQAgByAIcjYCxPUBIAUgAzYCACADIAU2AhgMAQsgAEEAQRkgBEEBdmsgBEEfRht0IQQgBSgCACEHA0AgByIFKAIEQXhxIABGDQMgBEEddiEHIARBAXQhBCAFIAdBBHFqQRBqIggoAgAiBw0ACyAIIAM2AgAgAyAFNgIYCyADIAM2AgwgAyADNgIIDAILQQAgAkFYaiIAQXggB2tBB3FBACAHQQhqQQdxGyIIayILNgLM9QFBACAHIAhqIgg2Atj1ASAIIAtBAXI2AgQgByAAakEoNgIEQQBBACgCqPkBNgLc9QEgBCAFQScgBWtBB3FBACAFQVlqQQdxG2pBUWoiACAAIARBEGpJGyIIQRs2AgQgCEEQakEAKQKI+QE3AgAgCEEAKQKA+QE3AghBACAIQQhqNgKI+QFBACACNgKE+QFBACAHNgKA+QFBAEEANgKM+QEgCEEYaiEAA0AgAEEHNgIEIABBCGohByAAQQRqIQAgByAFSQ0ACyAIIARGDQMgCCAIKAIEQX5xNgIEIAQgCCAEayIHQQFyNgIEIAggBzYCAAJAIAdB/wFLDQAgB0F4cUHo9QFqIQACQAJAQQAoAsD1ASIFQQEgB0EDdnQiB3ENAEEAIAUgB3I2AsD1ASAAIQUMAQsgACgCCCEFCyAAIAQ2AgggBSAENgIMIAQgADYCDCAEIAU2AggMBAtBHyEAAkAgB0H///8HSw0AIAdBJiAHQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgBCAANgIcIARCADcCECAAQQJ0QfD3AWohBQJAAkBBACgCxPUBIghBASAAdCICcQ0AQQAgCCACcjYCxPUBIAUgBDYCACAEIAU2AhgMAQsgB0EAQRkgAEEBdmsgAEEfRht0IQAgBSgCACEIA0AgCCIFKAIEQXhxIAdGDQQgAEEddiEIIABBAXQhACAFIAhBBHFqQRBqIgIoAgAiCA0ACyACIAQ2AgAgBCAFNgIYCyAEIAQ2AgwgBCAENgIIDAMLIAUoAggiACADNgIMIAUgAzYCCCADQQA2AhggAyAFNgIMIAMgADYCCAsgC0EIaiEADAULIAUoAggiACAENgIMIAUgBDYCCCAEQQA2AhggBCAFNgIMIAQgADYCCAtBACgCzPUBIgAgA00NAEEAIAAgA2siBDYCzPUBQQBBACgC2PUBIgAgA2oiBTYC2PUBIAUgBEEBcjYCBCAAIANBA3I2AgQgAEEIaiEADAMLEMIFQTA2AgBBACEADAILAkAgC0UNAAJAAkAgCCAIKAIcIgVBAnRB8PcBaiIAKAIARw0AIAAgBzYCACAHDQFBACAGQX4gBXdxIgY2AsT1AQwCCyALQRBBFCALKAIQIAhGG2ogBzYCACAHRQ0BCyAHIAs2AhgCQCAIKAIQIgBFDQAgByAANgIQIAAgBzYCGAsgCEEUaigCACIARQ0AIAdBFGogADYCACAAIAc2AhgLAkACQCAEQQ9LDQAgCCAEIANqIgBBA3I2AgQgCCAAaiIAIAAoAgRBAXI2AgQMAQsgCCADQQNyNgIEIAggA2oiByAEQQFyNgIEIAcgBGogBDYCAAJAIARB/wFLDQAgBEF4cUHo9QFqIQACQAJAQQAoAsD1ASIFQQEgBEEDdnQiBHENAEEAIAUgBHI2AsD1ASAAIQQMAQsgACgCCCEECyAAIAc2AgggBCAHNgIMIAcgADYCDCAHIAQ2AggMAQtBHyEAAkAgBEH///8HSw0AIARBJiAEQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgByAANgIcIAdCADcCECAAQQJ0QfD3AWohBQJAAkACQCAGQQEgAHQiA3ENAEEAIAYgA3I2AsT1ASAFIAc2AgAgByAFNgIYDAELIARBAEEZIABBAXZrIABBH0YbdCEAIAUoAgAhAwNAIAMiBSgCBEF4cSAERg0CIABBHXYhAyAAQQF0IQAgBSADQQRxakEQaiICKAIAIgMNAAsgAiAHNgIAIAcgBTYCGAsgByAHNgIMIAcgBzYCCAwBCyAFKAIIIgAgBzYCDCAFIAc2AgggB0EANgIYIAcgBTYCDCAHIAA2AggLIAhBCGohAAwBCwJAIApFDQACQAJAIAcgBygCHCIFQQJ0QfD3AWoiACgCAEcNACAAIAg2AgAgCA0BQQAgCUF+IAV3cTYCxPUBDAILIApBEEEUIAooAhAgB0YbaiAINgIAIAhFDQELIAggCjYCGAJAIAcoAhAiAEUNACAIIAA2AhAgACAINgIYCyAHQRRqKAIAIgBFDQAgCEEUaiAANgIAIAAgCDYCGAsCQAJAIARBD0sNACAHIAQgA2oiAEEDcjYCBCAHIABqIgAgACgCBEEBcjYCBAwBCyAHIANBA3I2AgQgByADaiIFIARBAXI2AgQgBSAEaiAENgIAAkAgBkUNACAGQXhxQej1AWohA0EAKALU9QEhAAJAAkBBASAGQQN2dCIIIAJxDQBBACAIIAJyNgLA9QEgAyEIDAELIAMoAgghCAsgAyAANgIIIAggADYCDCAAIAM2AgwgACAINgIIC0EAIAU2AtT1AUEAIAQ2Asj1AQsgB0EIaiEACyABQRBqJAAgAAvMDAEHfwJAIABFDQAgAEF4aiIBIABBfGooAgAiAkF4cSIAaiEDAkAgAkEBcQ0AIAJBA3FFDQEgASABKAIAIgJrIgFBACgC0PUBIgRJDQEgAiAAaiEAAkAgAUEAKALU9QFGDQACQCACQf8BSw0AIAEoAggiBCACQQN2IgVBA3RB6PUBaiIGRhoCQCABKAIMIgIgBEcNAEEAQQAoAsD1AUF+IAV3cTYCwPUBDAMLIAIgBkYaIAQgAjYCDCACIAQ2AggMAgsgASgCGCEHAkACQCABKAIMIgYgAUYNACABKAIIIgIgBEkaIAIgBjYCDCAGIAI2AggMAQsCQCABQRRqIgIoAgAiBA0AIAFBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAQJAAkAgASABKAIcIgRBAnRB8PcBaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKALE9QFBfiAEd3E2AsT1AQwDCyAHQRBBFCAHKAIQIAFGG2ogBjYCACAGRQ0CCyAGIAc2AhgCQCABKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgASgCFCICRQ0BIAZBFGogAjYCACACIAY2AhgMAQsgAygCBCICQQNxQQNHDQBBACAANgLI9QEgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgAPCyABIANPDQAgAygCBCICQQFxRQ0AAkACQCACQQJxDQACQCADQQAoAtj1AUcNAEEAIAE2Atj1AUEAQQAoAsz1ASAAaiIANgLM9QEgASAAQQFyNgIEIAFBACgC1PUBRw0DQQBBADYCyPUBQQBBADYC1PUBDwsCQCADQQAoAtT1AUcNAEEAIAE2AtT1AUEAQQAoAsj1ASAAaiIANgLI9QEgASAAQQFyNgIEIAEgAGogADYCAA8LIAJBeHEgAGohAAJAAkAgAkH/AUsNACADKAIIIgQgAkEDdiIFQQN0Qej1AWoiBkYaAkAgAygCDCICIARHDQBBAEEAKALA9QFBfiAFd3E2AsD1AQwCCyACIAZGGiAEIAI2AgwgAiAENgIIDAELIAMoAhghBwJAAkAgAygCDCIGIANGDQAgAygCCCICQQAoAtD1AUkaIAIgBjYCDCAGIAI2AggMAQsCQCADQRRqIgIoAgAiBA0AIANBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAAJAAkAgAyADKAIcIgRBAnRB8PcBaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKALE9QFBfiAEd3E2AsT1AQwCCyAHQRBBFCAHKAIQIANGG2ogBjYCACAGRQ0BCyAGIAc2AhgCQCADKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKALU9QFHDQFBACAANgLI9QEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBeHFB6PUBaiECAkACQEEAKALA9QEiBEEBIABBA3Z0IgBxDQBBACAEIAByNgLA9QEgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QfD3AWohBAJAAkACQAJAQQAoAsT1ASIGQQEgAnQiA3ENAEEAIAYgA3I2AsT1ASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgC4PUBQX9qIgFBfyABGzYC4PUBCwsHAD8AQRB0C1QBAn9BACgCpNcBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEI4GTQ0AIAAQFUUNAQtBACAANgKk1wEgAQ8LEMIFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahCRBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQkQZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEJEGIAVBMGogCiABIAcQmwYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxCRBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahCRBiAFIAIgBEEBIAZrEJsGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBCZBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCaBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEJEGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglB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BgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCRBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEJEGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEJEGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEJEGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJEGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEJEGIAVBIGogAiAEIAYQkQYgBUEQaiASIAEgBxCbBiAFIAIgBCAHEJsGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCQBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQkQYgAiAAIARBgfgAIANrEJsGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBsPkFJANBsPkBQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEQAAslAQF+IAAgASACrSADrUIghoQgBBCrBiEFIAVCIIinEKEGIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC97XgYAAAwBBgAgL+M0BaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBzdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGRlbGF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4ACEgYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBlcnJvciBvbiBjbWQ9JXgAV1NTSy1IOiBzZW5kIGNtZD0leABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwAhIEV4Y2VwdGlvbjogU3RhY2tPdmVyZmxvdwBqZF93c3NrX25ldwBleHByMV9uZXcAZGV2c19qZF9zZW5kX3JhdwBpZGl2AHByZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGRldnNfdXRmOF9jb2RlX3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAZGV2c19wYWNrZXRfc3BlY19wYXJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdAB3YWl0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uU2VydmVyUGFja2V0AF9vblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAGlkeCA8IGN0eC0+aW1nLmhlYWRlci0+bnVtX3NlcnZpY2Vfc3BlY3MAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAIyAldSAlcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBjbGFzc0lkZW50aWZpZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAARGV2Uy1TSEEyNTY6ICUqcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19pbnNwZWN0X3RvAHNtYWxsIGhlbGxvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBpc0FjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAEB2ZXJzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAG1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAGZyb20AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGNodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABkZXZzX3V0ZjhfY29kZV9wb2ludF9sZW5ndGgAc3ogPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAbGVuID09IHMtPmlubmVyLmxlbmd0aABzaXplID49IGxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaABkZXZzX3N0cmluZ19maW5pc2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfc3RyaW5nX3ZzcHJpbnRmAGRldnNfdmFsdWVfdHlwZW9mAHNlbGYAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBzeiA9PSBzLT5pbm5lci5zaXplAHN0YXRlLm9mZiArIDMgPD0gc2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAHJlc3BvbnNlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAZXZlbnRDb2RlAGZyb21DaGFyQ29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAFNlcnZlckludGVyZmFjZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABfc2VydmVyU2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABub3RJbXBsZW1lbnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c19zdHJpbmdfam1wX3RyeV9hbGxvYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjAFBhY2tldFNwZWMAU2VydmljZVNwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L2luc3BlY3QuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9pbXBsX3BhY2tldHNwZWMuYwBkZXZpY2VzY3JpcHQvaW1wbF9zZXJ2aWNlc3BlYy5jAGRldmljZXNjcmlwdC91dGY4LmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbUm9sZTogJXMuJXNdAFtQYWNrZXRTcGVjOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBbU2VydmljZVNwZWM6ICVzXQBbQ2lyY3VsYXJdAFtCdWZmZXJbJXVdICUqcF0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUqcC4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAHN6ID09IGxlbiAmJiBzeiA8IERFVlNfTUFYX0FTQ0lJX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AHV0ZjgAdXRmLTgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAaWR4ID49IDAAciA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AISAgLi4uACwAZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAGRldnNfaGFuZGxlX3R5cGUodikgPT0gREVWU19IQU5ETEVfVFlQRV9HQ19PQkpFQ1QgJiYgZGV2c19pc19zdHJpbmcoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVk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IHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAA1vyAgAAEbmFtZQHme64GAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkUZGV2c190cmFja19leGNlcHRpb25aD2RldnNkYmdfcHJvY2Vzc1sRZGV2c2RiZ19yZXN0YXJ0ZWRcFWRldnNkYmdfaGFuZGxlX3BhY2tldF0Lc2VuZF92YWx1ZXNeEXZhbHVlX2Zyb21fdGFnX3YwXxlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYA1vYmpfZ2V0X3Byb3BzYQxleHBhbmRfdmFsdWViEmRldnNkYmdfc3VzcGVuZF9jYmMMZGV2c2RiZ19pbml0ZBBleHBhbmRfa2V5X3ZhbHVlZQZrdl9hZGRmD2RldnNtZ3JfcHJvY2Vzc2cHdHJ5X3J1bmgMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udgpkZXZzX3BhbmljdxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EWRldnNfZmliZXJfYnlfdGFnfhBkZXZzX2ZpYmVyX3N0YXJ0fxRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYABDmRldnNfZmliZXJfcnVugQETZGV2c19maWJlcl9zeW5jX25vd4IBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYMBD2RldnNfZmliZXJfcG9rZYQBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWFARNqZF9nY19hbnlfdHJ5X2FsbG9jhgEHZGV2c19nY4cBD2ZpbmRfZnJlZV9ibG9ja4gBEmRldnNfYW55X3RyeV9hbGxvY4kBDmRldnNfdHJ5X2FsbG9jigELamRfZ2NfdW5waW6LAQpqZF9nY19mcmVljAEUZGV2c192YWx1ZV9pc19waW5uZWSNAQ5kZXZzX3ZhbHVlX3Bpbo4BEGRldnNfdmFsdWVfdW5waW6PARJkZXZzX21hcF90cnlfYWxsb2OQARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2ORARRkZXZzX2FycmF5X3RyeV9hbGxvY5IBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5MBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5QBEGRldnNfc3RyaW5nX3ByZXCVARJkZXZzX3N0cmluZ19maW5pc2iWARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJcBD2RldnNfZ2Nfc2V0X2N0eJgBDmRldnNfZ2NfY3JlYXRlmQEPZGV2c19nY19kZXN0cm95mgERZGV2c19nY19vYmpfY2hlY2ubAQtzY2FuX2djX29iapwBEXByb3BfQXJyYXlfbGVuZ3RonQESbWV0aDJfQXJyYXlfaW5zZXJ0ngESZnVuMV9BcnJheV9pc0FycmF5nwEQbWV0aFhfQXJyYXlfcHVzaKABFW1ldGgxX0FycmF5X3B1c2hSYW5nZaEBEW1ldGhYX0FycmF5X3NsaWNlogEQbWV0aDFfQXJyYXlfam9pbqMBEWZ1bjFfQnVmZmVyX2FsbG9jpAEQZnVuMV9CdWZmZXJfZnJvbaUBEnByb3BfQnVmZmVyX2xlbmd0aKYBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6cBE21ldGgzX0J1ZmZlcl9maWxsQXSoARNtZXRoNF9CdWZmZXJfYmxpdEF0qQEUZGV2c19jb21wdXRlX3RpbWVvdXSqARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKsBF2Z1bjFfRGV2aWNlU2NyaXB0X2RlbGF5rAEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljrQEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290rgEZZnVuMF9EZXZpY2VTY3JpcHRfcmVzdGFydK8BGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdLABF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50sQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdLIBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50swEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHK0AR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7UBGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7YBImZ1bjFfRGV2aWNlU2NyaXB0X2RldmljZUlkZW50aWZpZXK3AR1mdW4yX0RldmljZVNjcmlwdF9fc2VydmVyU2VuZLgBFG1ldGgxX0Vycm9yX19fY3Rvcl9fuQEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7oBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7sBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fvAEPcHJvcF9FcnJvcl9uYW1lvQERbWV0aDBfRXJyb3JfcHJpbnS+AQ9wcm9wX0RzRmliZXJfaWS/ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkwAEUbWV0aDFfRHNGaWJlcl9yZXN1bWXBARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZcIBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmTDARFmdW4wX0RzRmliZXJfc2VsZsQBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0xQEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXGARJwcm9wX0Z1bmN0aW9uX25hbWXHAQ9mdW4yX0pTT05fcGFyc2XIARNmdW4zX0pTT05fc3RyaW5naWZ5yQEOZnVuMV9NYXRoX2NlaWzKAQ9mdW4xX01hdGhfZmxvb3LLAQ9mdW4xX01hdGhfcm91bmTMAQ1mdW4xX01hdGhfYWJzzQEQZnVuMF9NYXRoX3JhbmRvbc4BE2Z1bjFfTWF0aF9yYW5kb21JbnTPAQ1mdW4xX01hdGhfbG9n0AENZnVuMl9NYXRoX3Bvd9EBDmZ1bjJfTWF0aF9pZGl20gEOZnVuMl9NYXRoX2ltb2TTAQ5mdW4yX01hdGhfaW11bNQBDWZ1bjJfTWF0aF9taW7VAQtmdW4yX21pbm1heNYBDWZ1bjJfTWF0aF9tYXjXARJmdW4yX09iamVjdF9hc3NpZ27YARBmdW4xX09iamVjdF9rZXlz2QETZnVuMV9rZXlzX29yX3ZhbHVlc9oBEmZ1bjFfT2JqZWN0X3ZhbHVlc9sBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m3AEdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3fdARJwcm9wX0RzUGFja2V0X3JvbGXeAR5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXLfARVwcm9wX0RzUGFja2V0X3Nob3J0SWTgARpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleOEBHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmTiARNwcm9wX0RzUGFja2V0X2ZsYWdz4wEXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmTkARZwcm9wX0RzUGFja2V0X2lzUmVwb3J05QEVcHJvcF9Ec1BhY2tldF9wYXlsb2Fk5gEVcHJvcF9Ec1BhY2tldF9pc0V2ZW505wEXcHJvcF9Ec1BhY2tldF9ldmVudENvZGXoARZwcm9wX0RzUGFja2V0X2lzUmVnU2V06QEWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldOoBFXByb3BfRHNQYWNrZXRfcmVnQ29kZesBFnByb3BfRHNQYWNrZXRfaXNBY3Rpb27sARVkZXZzX3BrdF9zcGVjX2J5X2NvZGXtARJwcm9wX0RzUGFja2V0X3NwZWPuARFkZXZzX3BrdF9nZXRfc3BlY+8BFW1ldGgwX0RzUGFja2V0X2RlY29kZfABHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVk8QEYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW508gEWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZfMBFnByb3BfRHNQYWNrZXRTcGVjX2NvZGX0ARpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZfUBGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGX2ARJkZXZzX3BhY2tldF9kZWNvZGX3ARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWT4ARREc1JlZ2lzdGVyX3JlYWRfY29udPkBEmRldnNfcGFja2V0X2VuY29kZfoBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGX7ARZwcm9wX0RzUGFja2V0SW5mb19yb2xl/AEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZf0BFnByb3BfRHNQYWNrZXRJbmZvX2NvZGX+ARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1//ARNwcm9wX0RzUm9sZV9pc0JvdW5kgAIQcHJvcF9Ec1JvbGVfc3BlY4ECGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZIICInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXKDAhdwcm9wX0RzU2VydmljZVNwZWNfbmFtZYQCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwhQIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26GAhJwcm9wX1N0cmluZ19sZW5ndGiHAhdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdIgCE21ldGgxX1N0cmluZ19jaGFyQXSJAhJtZXRoMl9TdHJpbmdfc2xpY2WKAhhmdW5YX1N0cmluZ19mcm9tQ2hhckNvZGWLAgxkZXZzX2luc3BlY3SMAgtpbnNwZWN0X29iao0CB2FkZF9zdHKOAg1pbnNwZWN0X2ZpZWxkjwIUZGV2c19qZF9nZXRfcmVnaXN0ZXKQAhZkZXZzX2pkX2NsZWFyX3BrdF9raW5kkQIQZGV2c19qZF9zZW5kX2NtZJICEGRldnNfamRfc2VuZF9yYXeTAhNkZXZzX2pkX3NlbmRfbG9nbXNnlAITZGV2c19qZF9wa3RfY2FwdHVyZZUCEWRldnNfamRfd2FrZV9yb2xllgISZGV2c19qZF9zaG91bGRfcnVulwIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWYAhNkZXZzX2pkX3Byb2Nlc3NfcGt0mQIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lkmgIUZGV2c19qZF9yb2xlX2NoYW5nZWSbAhRkZXZzX2pkX3Jlc2V0X3BhY2tldJwCEmRldnNfamRfaW5pdF9yb2xlc50CEmRldnNfamRfZnJlZV9yb2xlc54CFWRldnNfc2V0X2dsb2JhbF9mbGFnc58CF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzoAIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzoQIQZGV2c19qc29uX2VzY2FwZaICFWRldnNfanNvbl9lc2NhcGVfY29yZaMCD2RldnNfanNvbl9wYXJzZaQCCmpzb25fdmFsdWWlAgxwYXJzZV9zdHJpbmemAhNkZXZzX2pzb25fc3RyaW5naWZ5pwINc3RyaW5naWZ5X29iaqgCEXBhcnNlX3N0cmluZ19jb3JlqQIKYWRkX2luZGVudKoCD3N0cmluZ2lmeV9maWVsZKsCEWRldnNfbWFwbGlrZV9pdGVyrAIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3StAhJkZXZzX21hcF9jb3B5X2ludG+uAgxkZXZzX21hcF9zZXSvAgZsb29rdXCwAhNkZXZzX21hcGxpa2VfaXNfbWFwsQIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzsgIRZGV2c19hcnJheV9pbnNlcnSzAghrdl9hZGQuMbQCEmRldnNfc2hvcnRfbWFwX3NldLUCD2RldnNfbWFwX2RlbGV0ZbYCEmRldnNfc2hvcnRfbWFwX2dldLcCIGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWNfaWR4uAIcZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY7kCG2RldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlY7oCHmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjX2lkeLsCGmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjvAIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXS9AhdkZXZzX3BhY2tldF9zcGVjX3BhcmVudL4CDmRldnNfcm9sZV9zcGVjvwISZGV2c19nZXRfYmFzZV9zcGVjwAIQZGV2c19zcGVjX2xvb2t1cMECEmRldnNfZnVuY3Rpb25fYmluZMICEWRldnNfbWFrZV9jbG9zdXJlwwIOZGV2c19nZXRfZm5pZHjEAhNkZXZzX2dldF9mbmlkeF9jb3JlxQIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxkxgITZGV2c19nZXRfcm9sZV9wcm90b8cCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd8gCGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZMkCFWRldnNfZ2V0X3N0YXRpY19wcm90b8oCG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb8sCHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtzAIWZGV2c19tYXBsaWtlX2dldF9wcm90b80CGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZM4CGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZM8CEGRldnNfaW5zdGFuY2Vfb2bQAg9kZXZzX29iamVjdF9nZXTRAgxkZXZzX3NlcV9nZXTSAgxkZXZzX2FueV9nZXTTAgxkZXZzX2FueV9zZXTUAgxkZXZzX3NlcV9zZXTVAg5kZXZzX2FycmF5X3NldNYCE2RldnNfYXJyYXlfcGluX3B1c2jXAgxkZXZzX2FyZ19pbnTYAg9kZXZzX2FyZ19kb3VibGXZAg9kZXZzX3JldF9kb3VibGXaAgxkZXZzX3JldF9pbnTbAg1kZXZzX3JldF9ib29s3AIPZGV2c19yZXRfZ2NfcHRy3QIRZGV2c19hcmdfc2VsZl9tYXDeAhFkZXZzX3NldHVwX3Jlc3VtZd8CD2RldnNfY2FuX2F0dGFjaOACGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWXhAhVkZXZzX21hcGxpa2VfdG9fdmFsdWXiAhJkZXZzX3JlZ2NhY2hlX2ZyZWXjAhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs5AIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTlAhNkZXZzX3JlZ2NhY2hlX2FsbG9j5gIUZGV2c19yZWdjYWNoZV9sb29rdXDnAhFkZXZzX3JlZ2NhY2hlX2FnZegCF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xl6QISZGV2c19yZWdjYWNoZV9uZXh06gIPamRfc2V0dGluZ3NfZ2V06wIPamRfc2V0dGluZ3Nfc2V07AIOZGV2c19sb2dfdmFsdWXtAg9kZXZzX3Nob3dfdmFsdWXuAhBkZXZzX3Nob3dfdmFsdWUw7wINY29uc3VtZV9jaHVua/ACDXNoYV8yNTZfY2xvc2XxAg9qZF9zaGEyNTZfc2V0dXDyAhBqZF9zaGEyNTZfdXBkYXRl8wIQamRfc2hhMjU2X2ZpbmlzaPQCFGpkX3NoYTI1Nl9obWFjX3NldHVw9QIVamRfc2hhMjU2X2htYWNfZmluaXNo9gIOamRfc2hhMjU2X2hrZGb3Ag5kZXZzX3N0cmZvcm1hdPgCDmRldnNfaXNfc3RyaW5n+QIOZGV2c19pc19udW1iZXL6AhtkZXZzX3N0cmluZ19nZXRfdXRmOF9zdHJ1Y3T7AhRkZXZzX3N0cmluZ19nZXRfdXRmOPwCE2RldnNfYnVpbHRpbl9zdHJpbmf9AhRkZXZzX3N0cmluZ192c3ByaW50Zv4CE2RldnNfc3RyaW5nX3NwcmludGb/AhVkZXZzX3N0cmluZ19mcm9tX3V0ZjiAAxRkZXZzX3ZhbHVlX3RvX3N0cmluZ4EDEGJ1ZmZlcl90b19zdHJpbmeCAxlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxkgwMSZGV2c19zdHJpbmdfY29uY2F0hAMRZGV2c19zdHJpbmdfc2xpY2WFAxJkZXZzX3B1c2hfdHJ5ZnJhbWWGAxFkZXZzX3BvcF90cnlmcmFtZYcDD2RldnNfZHVtcF9zdGFja4gDE2RldnNfZHVtcF9leGNlcHRpb26JAwpkZXZzX3Rocm93igMSZGV2c19wcm9jZXNzX3Rocm93iwMQZGV2c19hbGxvY19lcnJvcowDFWRldnNfdGhyb3dfdHlwZV9lcnJvco0DFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3KOAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3KPAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcpADHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dJEDGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcpIDF2RldnNfdGhyb3dfc3ludGF4X2Vycm9ykwMRZGV2c19zdHJpbmdfaW5kZXiUAxJkZXZzX3N0cmluZ19sZW5ndGiVAxlkZXZzX3V0ZjhfZnJvbV9jb2RlX3BvaW50lgMbZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RolwMUZGV2c191dGY4X2NvZGVfcG9pbnSYAxRkZXZzX3N0cmluZ19qbXBfaW5pdJkDDmRldnNfdXRmOF9pbml0mgMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZZsDE2RldnNfdmFsdWVfZnJvbV9pbnScAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbJ0DF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyngMUZGV2c192YWx1ZV90b19kb3VibGWfAxFkZXZzX3ZhbHVlX3RvX2ludKADEmRldnNfdmFsdWVfdG9fYm9vbKEDDmRldnNfaXNfYnVmZmVyogMXZGV2c19idWZmZXJfaXNfd3JpdGFibGWjAxBkZXZzX2J1ZmZlcl9kYXRhpAMTZGV2c19idWZmZXJpc2hfZGF0YaUDFGRldnNfdmFsdWVfdG9fZ2Nfb2JqpgMNZGV2c19pc19hcnJheacDEWRldnNfdmFsdWVfdHlwZW9mqAMPZGV2c19pc19udWxsaXNoqQMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZKoDFGRldnNfdmFsdWVfYXBwcm94X2VxqwMSZGV2c192YWx1ZV9pZWVlX2VxrAMcZGV2c192YWx1ZV9lcV9idWlsdGluX3N0cmluZ60DHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY64DEmRldnNfaW1nX3N0cmlkeF9va68DEmRldnNfZHVtcF92ZXJzaW9uc7ADC2RldnNfdmVyaWZ5sQMRZGV2c19mZXRjaF9vcGNvZGWyAw5kZXZzX3ZtX3Jlc3VtZbMDEWRldnNfdm1fc2V0X2RlYnVntAMZZGV2c192bV9jbGVhcl9icmVha3BvaW50c7UDGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludLYDDGRldnNfdm1faGFsdLcDD2RldnNfdm1fc3VzcGVuZLgDFmRldnNfdm1fc2V0X2JyZWFrcG9pbnS5AxRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc7oDGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4uwMXZGV2c19pbWdfZ2V0X3N0cmluZ19qbXC8AxFkZXZzX2ltZ19nZXRfdXRmOL0DFGRldnNfZ2V0X3N0YXRpY191dGY4vgMUZGV2c192YWx1ZV9idWZmZXJpc2i/AwxleHByX2ludmFsaWTAAxRleHByeF9idWlsdGluX29iamVjdMEDC3N0bXQxX2NhbGwwwgMLc3RtdDJfY2FsbDHDAwtzdG10M19jYWxsMsQDC3N0bXQ0X2NhbGwzxQMLc3RtdDVfY2FsbDTGAwtzdG10Nl9jYWxsNccDC3N0bXQ3X2NhbGw2yAMLc3RtdDhfY2FsbDfJAwtzdG10OV9jYWxsOMoDEnN0bXQyX2luZGV4X2RlbGV0ZcsDDHN0bXQxX3JldHVybswDCXN0bXR4X2ptcM0DDHN0bXR4MV9qbXBfes4DCmV4cHIyX2JpbmTPAxJleHByeF9vYmplY3RfZmllbGTQAxJzdG10eDFfc3RvcmVfbG9jYWzRAxNzdG10eDFfc3RvcmVfZ2xvYmFs0gMSc3RtdDRfc3RvcmVfYnVmZmVy0wMJZXhwcjBfaW5m1AMQZXhwcnhfbG9hZF9sb2NhbNUDEWV4cHJ4X2xvYWRfZ2xvYmFs1gMLZXhwcjFfdXBsdXPXAwtleHByMl9pbmRleNgDD3N0bXQzX2luZGV4X3NldNkDFGV4cHJ4MV9idWlsdGluX2ZpZWxk2gMSZXhwcngxX2FzY2lpX2ZpZWxk2wMRZXhwcngxX3V0ZjhfZmllbGTcAxBleHByeF9tYXRoX2ZpZWxk3QMOZXhwcnhfZHNfZmllbGTeAw9zdG10MF9hbGxvY19tYXDfAxFzdG10MV9hbGxvY19hcnJheeADEnN0bXQxX2FsbG9jX2J1ZmZlcuEDEWV4cHJ4X3N0YXRpY19yb2xl4gMTZXhwcnhfc3RhdGljX2J1ZmZlcuMDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ+QDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmflAxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfmAxVleHByeF9zdGF0aWNfZnVuY3Rpb27nAw1leHByeF9saXRlcmFs6AMRZXhwcnhfbGl0ZXJhbF9mNjTpAxBleHByeF9yb2xlX3Byb3Rv6gMRZXhwcjNfbG9hZF9idWZmZXLrAw1leHByMF9yZXRfdmFs7AMMZXhwcjFfdHlwZW9m7QMPZXhwcjBfdW5kZWZpbmVk7gMSZXhwcjFfaXNfdW5kZWZpbmVk7wMKZXhwcjBfdHJ1ZfADC2V4cHIwX2ZhbHNl8QMNZXhwcjFfdG9fYm9vbPIDCWV4cHIwX25hbvMDCWV4cHIxX2Fic/QDDWV4cHIxX2JpdF9ub3T1AwxleHByMV9pc19uYW72AwlleHByMV9uZWf3AwlleHByMV9ub3T4AwxleHByMV90b19pbnT5AwlleHByMl9hZGT6AwlleHByMl9zdWL7AwlleHByMl9tdWz8AwlleHByMl9kaXb9Aw1leHByMl9iaXRfYW5k/gMMZXhwcjJfYml0X29y/wMNZXhwcjJfYml0X3hvcoAEEGV4cHIyX3NoaWZ0X2xlZnSBBBFleHByMl9zaGlmdF9yaWdodIIEGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkgwQIZXhwcjJfZXGEBAhleHByMl9sZYUECGV4cHIyX2x0hgQIZXhwcjJfbmWHBBBleHByMV9pc19udWxsaXNoiAQUc3RtdHgyX3N0b3JlX2Nsb3N1cmWJBBNleHByeDFfbG9hZF9jbG9zdXJligQSZXhwcnhfbWFrZV9jbG9zdXJliwQQZXhwcjFfdHlwZW9mX3N0cowEE3N0bXR4X2ptcF9yZXRfdmFsX3qNBBBzdG10Ml9jYWxsX2FycmF5jgQJc3RtdHhfdHJ5jwQNc3RtdHhfZW5kX3RyeZAEC3N0bXQwX2NhdGNokQQNc3RtdDBfZmluYWxseZIEC3N0bXQxX3Rocm93kwQOc3RtdDFfcmVfdGhyb3eUBBBzdG10eDFfdGhyb3dfam1wlQQOc3RtdDBfZGVidWdnZXKWBAlleHByMV9uZXeXBBFleHByMl9pbnN0YW5jZV9vZpgECmV4cHIwX251bGyZBA9leHByMl9hcHByb3hfZXGaBA9leHByMl9hcHByb3hfbmWbBBNzdG10MV9zdG9yZV9yZXRfdmFsnAQRZXhwcnhfc3RhdGljX3NwZWOdBA9kZXZzX3ZtX3BvcF9hcmeeBBNkZXZzX3ZtX3BvcF9hcmdfdTMynwQTZGV2c192bV9wb3BfYXJnX2kzMqAEFmRldnNfdm1fcG9wX2FyZ19idWZmZXKhBBJqZF9hZXNfY2NtX2VuY3J5cHSiBBJqZF9hZXNfY2NtX2RlY3J5cHSjBAxBRVNfaW5pdF9jdHikBA9BRVNfRUNCX2VuY3J5cHSlBBBqZF9hZXNfc2V0dXBfa2V5pgQOamRfYWVzX2VuY3J5cHSnBBBqZF9hZXNfY2xlYXJfa2V5qAQLamRfd3Nza19uZXepBBRqZF93c3NrX3NlbmRfbWVzc2FnZaoEE2pkX3dlYnNvY2tfb25fZXZlbnSrBAdkZWNyeXB0rAQNamRfd3Nza19jbG9zZa0EEGpkX3dzc2tfb25fZXZlbnSuBAtyZXNwX3N0YXR1c68EEndzc2toZWFsdGhfcHJvY2Vzc7AEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlsQQUd3Nza2hlYWx0aF9yZWNvbm5lY3SyBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSzBA9zZXRfY29ubl9zdHJpbme0BBFjbGVhcl9jb25uX3N0cmluZ7UED3dzc2toZWFsdGhfaW5pdLYEEXdzc2tfc2VuZF9tZXNzYWdltwQRd3Nza19pc19jb25uZWN0ZWS4BBR3c3NrX3RyYWNrX2V4Y2VwdGlvbrkEEndzc2tfc2VydmljZV9xdWVyeboEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemW7BBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlvAQPcm9sZW1ncl9wcm9jZXNzvQQQcm9sZW1ncl9hdXRvYmluZL4EFXJvbGVtZ3JfaGFuZGxlX3BhY2tldL8EFGpkX3JvbGVfbWFuYWdlcl9pbml0wAQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkwQQNamRfcm9sZV9hbGxvY8IEEGpkX3JvbGVfZnJlZV9hbGzDBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kxAQTamRfY2xpZW50X2xvZ19ldmVudMUEE2pkX2NsaWVudF9zdWJzY3JpYmXGBBRqZF9jbGllbnRfZW1pdF9ldmVudMcEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkyAQQamRfZGV2aWNlX2xvb2t1cMkEGGpkX2RldmljZV9sb29rdXBfc2VydmljZcoEE2pkX3NlcnZpY2Vfc2VuZF9jbWTLBBFqZF9jbGllbnRfcHJvY2Vzc8wEDmpkX2RldmljZV9mcmVlzQQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXTOBA9qZF9kZXZpY2VfYWxsb2PPBBBzZXR0aW5nc19wcm9jZXNz0AQWc2V0dGluZ3NfaGFuZGxlX3BhY2tldNEEDXNldHRpbmdzX2luaXTSBA9qZF9jdHJsX3Byb2Nlc3PTBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXTUBAxqZF9jdHJsX2luaXTVBBRkY2ZnX3NldF91c2VyX2NvbmZpZ9YECWRjZmdfaW5pdNcEDWRjZmdfdmFsaWRhdGXYBA5kY2ZnX2dldF9lbnRyedkEDGRjZmdfZ2V0X2kzMtoEDGRjZmdfZ2V0X3UzMtsED2RjZmdfZ2V0X3N0cmluZ9wEDGRjZmdfaWR4X2tled0ECWpkX3ZkbWVzZ94EEWpkX2RtZXNnX3N0YXJ0cHRy3wQNamRfZG1lc2dfcmVhZOAEEmpkX2RtZXNnX3JlYWRfbGluZeEEE2pkX3NldHRpbmdzX2dldF9iaW7iBApmaW5kX2VudHJ54wQPcmVjb21wdXRlX2NhY2hl5AQTamRfc2V0dGluZ3Nfc2V0X2JpbuUEC2pkX2ZzdG9yX2dj5gQVamRfc2V0dGluZ3NfZ2V0X2xhcmdl5wQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZegEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdl6QQWamRfc2V0dGluZ3Nfc3luY19sYXJnZeoEDWpkX2lwaXBlX29wZW7rBBZqZF9pcGlwZV9oYW5kbGVfcGFja2V07AQOamRfaXBpcGVfY2xvc2XtBBJqZF9udW1mbXRfaXNfdmFsaWTuBBVqZF9udW1mbXRfd3JpdGVfZmxvYXTvBBNqZF9udW1mbXRfd3JpdGVfaTMy8AQSamRfbnVtZm10X3JlYWRfaTMy8QQUamRfbnVtZm10X3JlYWRfZmxvYXTyBBFqZF9vcGlwZV9vcGVuX2NtZPMEFGpkX29waXBlX29wZW5fcmVwb3J09AQWamRfb3BpcGVfaGFuZGxlX3BhY2tldPUEEWpkX29waXBlX3dyaXRlX2V49gQQamRfb3BpcGVfcHJvY2Vzc/cEFGpkX29waXBlX2NoZWNrX3NwYWNl+AQOamRfb3BpcGVfd3JpdGX5BA5qZF9vcGlwZV9jbG9zZfoEDWpkX3F1ZXVlX3B1c2j7BA5qZF9xdWV1ZV9mcm9udPwEDmpkX3F1ZXVlX3NoaWZ0/QQOamRfcXVldWVfYWxsb2P+BA1qZF9yZXNwb25kX3U4/wQOamRfcmVzcG9uZF91MTaABQ5qZF9yZXNwb25kX3UzMoEFEWpkX3Jlc3BvbmRfc3RyaW5nggUXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWSDBQtqZF9zZW5kX3BrdIQFHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFshQUXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXKGBRlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0hwUUamRfYXBwX2hhbmRsZV9wYWNrZXSIBRVqZF9hcHBfaGFuZGxlX2NvbW1hbmSJBRVhcHBfZ2V0X2luc3RhbmNlX25hbWWKBRNqZF9hbGxvY2F0ZV9zZXJ2aWNliwUQamRfc2VydmljZXNfaW5pdIwFDmpkX3JlZnJlc2hfbm93jQUZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZI4FFGpkX3NlcnZpY2VzX2Fubm91bmNljwUXamRfc2VydmljZXNfbmVlZHNfZnJhbWWQBRBqZF9zZXJ2aWNlc190aWNrkQUVamRfcHJvY2Vzc19ldmVyeXRoaW5nkgUaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWTBRZhcHBfZ2V0X2Rldl9jbGFzc19uYW1llAUUYXBwX2dldF9kZXZpY2VfY2xhc3OVBRJhcHBfZ2V0X2Z3X3ZlcnNpb26WBQ1qZF9zcnZjZmdfcnVulwUXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWWYBRFqZF9zcnZjZmdfdmFyaWFudJkFDWpkX2hhc2hfZm52MWGaBQxqZF9kZXZpY2VfaWSbBQlqZF9yYW5kb22cBQhqZF9jcmMxNp0FDmpkX2NvbXB1dGVfY3JjngUOamRfc2hpZnRfZnJhbWWfBQxqZF93b3JkX21vdmWgBQ5qZF9yZXNldF9mcmFtZaEFEGpkX3B1c2hfaW5fZnJhbWWiBQ1qZF9wYW5pY19jb3JlowUTamRfc2hvdWxkX3NhbXBsZV9tc6QFEGpkX3Nob3VsZF9zYW1wbGWlBQlqZF90b19oZXimBQtqZF9mcm9tX2hleKcFDmpkX2Fzc2VydF9mYWlsqAUHamRfYXRvaakFD2pkX3ZzcHJpbnRmX2V4dKoFD2pkX3ByaW50X2RvdWJsZasFC2pkX3ZzcHJpbnRmrAUKamRfc3ByaW50Zq0FEmpkX2RldmljZV9zaG9ydF9pZK4FDGpkX3NwcmludGZfYa8FC2pkX3RvX2hleF9hsAUJamRfc3RyZHVwsQUJamRfbWVtZHVwsgUWamRfcHJvY2Vzc19ldmVudF9xdWV1ZbMFFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWW0BRFqZF9zZW5kX2V2ZW50X2V4dLUFCmpkX3J4X2luaXS2BRRqZF9yeF9mcmFtZV9yZWNlaXZlZLcFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNruAUPamRfcnhfZ2V0X2ZyYW1luQUTamRfcnhfcmVsZWFzZV9mcmFtZboFEWpkX3NlbmRfZnJhbWVfcmF3uwUNamRfc2VuZF9mcmFtZbwFCmpkX3R4X2luaXS9BQdqZF9zZW5kvgUWamRfc2VuZF9mcmFtZV93aXRoX2NyY78FD2pkX3R4X2dldF9mcmFtZcAFEGpkX3R4X2ZyYW1lX3NlbnTBBQtqZF90eF9mbHVzaMIFEF9fZXJybm9fbG9jYXRpb27DBQxfX2ZwY2xhc3NpZnnEBQVkdW1tecUFCF9fbWVtY3B5xgUHbWVtbW92ZccFBm1lbXNldMgFCl9fbG9ja2ZpbGXJBQxfX3VubG9ja2ZpbGXKBQZmZmx1c2jLBQRmbW9kzAUNX19ET1VCTEVfQklUU80FDF9fc3RkaW9fc2Vla84FDV9fc3RkaW9fd3JpdGXPBQ1fX3N0ZGlvX2Nsb3Nl0AUIX190b3JlYWTRBQlfX3Rvd3JpdGXSBQlfX2Z3cml0ZXjTBQZmd3JpdGXUBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja9UFFl9fcHRocmVhZF9tdXRleF91bmxvY2vWBQZfX2xvY2vXBQhfX3VubG9ja9gFDl9fbWF0aF9kaXZ6ZXJv2QUKZnBfYmFycmllctoFDl9fbWF0aF9pbnZhbGlk2wUDbG9n3AUFdG9wMTbdBQVsb2cxMN4FB19fbHNlZWvfBQZtZW1jbXDgBQpfX29mbF9sb2Nr4QUMX19vZmxfdW5sb2Nr4gUMX19tYXRoX3hmbG934wUMZnBfYmFycmllci4x5AUMX19tYXRoX29mbG935QUMX19tYXRoX3VmbG935gUEZmFic+cFA3Bvd+gFBXRvcDEy6QUKemVyb2luZm5hbuoFCGNoZWNraW506wUMZnBfYmFycmllci4y7AUKbG9nX2lubGluZe0FCmV4cF9pbmxpbmXuBQtzcGVjaWFsY2FzZe8FDWZwX2ZvcmNlX2V2YWzwBQVyb3VuZPEFBnN0cmNocvIFC19fc3RyY2hybnVs8wUGc3RyY21w9AUGc3RybGVu9QUGbWVtY2hy9gUGc3Ryc3Ry9wUOdHdvYnl0ZV9zdHJzdHL4BRB0aHJlZWJ5dGVfc3Ryc3Ry+QUPZm91cmJ5dGVfc3Ryc3Ry+gUNdHdvd2F5X3N0cnN0cvsFB19fdWZsb3f8BQdfX3NobGlt/QUIX19zaGdldGP+BQdpc3NwYWNl/wUGc2NhbGJugAYJY29weXNpZ25sgQYHc2NhbGJubIIGDV9fZnBjbGFzc2lmeWyDBgVmbW9kbIQGBWZhYnNshQYLX19mbG9hdHNjYW6GBghoZXhmbG9hdIcGCGRlY2Zsb2F0iAYHc2NhbmV4cIkGBnN0cnRveIoGBnN0cnRvZIsGEl9fd2FzaV9zeXNjYWxsX3JldIwGCGRsbWFsbG9jjQYGZGxmcmVljgYYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpljwYEc2Jya5AGCF9fYWRkdGYzkQYJX19hc2hsdGkzkgYHX19sZXRmMpMGB19fZ2V0ZjKUBghfX2RpdnRmM5UGDV9fZXh0ZW5kZGZ0ZjKWBg1fX2V4dGVuZHNmdGYylwYLX19mbG9hdHNpdGaYBg1fX2Zsb2F0dW5zaXRmmQYNX19mZV9nZXRyb3VuZJoGEl9fZmVfcmFpc2VfaW5leGFjdJsGCV9fbHNocnRpM5wGCF9fbXVsdGYznQYIX19tdWx0aTOeBglfX3Bvd2lkZjKfBghfX3N1YnRmM6AGDF9fdHJ1bmN0ZmRmMqEGC3NldFRlbXBSZXQwogYLZ2V0VGVtcFJldDCjBglzdGFja1NhdmWkBgxzdGFja1Jlc3RvcmWlBgpzdGFja0FsbG9jpgYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudKcGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdKgGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWpBhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlqgYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kqwYMZHluQ2FsbF9qaWpprAYWbGVnYWxzdHViJGR5bkNhbGxfamlqaa0GGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAasGBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
