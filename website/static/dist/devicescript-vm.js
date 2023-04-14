
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA5iGgIAAlgYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDAYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgIAAwMDBgAAAAEAAgYABgYDAgIDAgIDBAMDAwkFBgIIAAIBAQAAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAwEDAAABAQEBAAoAAgIAAQEBAAEAAQEAAAEAAAAABQICBQoAAQABAQIEBgEOAgAAAAAACAMJCgICCgIDAAUJAwEFBgMFCQUFBgUBAQMDBgMDAwUFBQkMBQMDBgYDAwMDBQYFBQUFBQUBAw8RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQDBgIFBQUBAQUFCgEDAgIBAAoFBQEFBQEFBgMDBAQDDBECAgUPAwMDAwYGAwMDBAQGBgYBAwADAwQCAAMAAgYABAMGBgUBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQIBAgQEAQoMAgIAAAcJCQEDBwECAAgAAgUABwkIAAQEBAAAAgcAAwcHAQIBABIDCQcAAAQAAgcAAgcEBwQEAwMDBgIIBgYGBAcGBwMDBggGAAAEHwEDDwMDAAkHAwYEAwQABAMDAwMEBAYGAAAABAQHBwcHBAcHBwgICAcEBAMOCAMABAEACQEDAwEDBQQMIAkJFwMDBAMHBwUHBAQIAAQEBwkHCAAHCBMEBgYGBAAEGCEQBgQEBAYJBAQAABQLCwsTCxAGCAciCxQUCxgTEhILIyQlJgsDAwMEBgMDAwMDBBcEBBkNFScNKAUWKSoFDwQEAAgEDRUaGg0RKwICCAgVDQ0ZDSwACAgABAgHCAgILQwuBIeAgIAAAXAB6QHpAQWGgICAAAEBgAKAAgbdgICAAA5/AUHQ+AULfwFBAAt/AUEAC38BQQALfwBByNYBC38AQbfXAQt/AEGB2QELfwBB/dkBC38AQfnaAQt/AEHJ2wELfwBB6tsBC38AQe/dAQt/AEHI1gELfwBB5d4BCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MAiwYWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAMEFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAIwGGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAyQUVZW1zY3JpcHRlbl9zdGFja19pbml0AKYGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUApwYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCoBhhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAqQYJc3RhY2tTYXZlAKIGDHN0YWNrUmVzdG9yZQCjBgpzdGFja0FsbG9jAKQGHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA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Aw0AIABCADcDAAwECyAAIAM2AgAgAEEINgIEIAEgAxCaAQwDCyADIQUgA0HlAEYNAQsgBCAFNgIEIAQgAjYCAEGdCiAEEDwgAEIANwMADAELAkAgASkAOCIGQgBSDQAgASgCrAEiA0UNACAAIAMpAyA3AwAMAQsgACAGNwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEPgEGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQ8QQaIAMgACgCBC0ADjoACiADKAIQDwtB680AQdM/QTFBxjkQpgUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQpwMNACADIAEpAwA3AxgCQAJAIAAgA0EYahDKAiICDQAgAyABKQMANwMQIAAgA0EQahDJAiEBDAELAkAgACACEMsCIgENAEEAIQEMAQsCQCAAIAIQsAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABD7AiADQShqIAAgBBDgAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEKsCIAFqIQIMAQsgACACQQBBABCrAiABaiECCyADQcAAaiQAIAIL9AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahDCAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEJwDIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIo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CGoQpQMNACADIAIpAwA3AwAgACABQQ8gAxCOAwwBCyAAIAIoAgAvAQgQmgMLIANBEGokAAuBAQICfwF+IwBBIGsiASQAIAEgACkDUCIDNwMIIAEgAzcDGAJAAkAgACABQQhqEKUDRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARCOA0EAIQILAkAgAiICRQ0AIAAgAiAAQQAQ1gIgAEEBENYCELICGgsgAUEgaiQACzkCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwAgASACNwMIIAAgACABEKUDENoCIAFBEGokAAvRAQIFfwF+IwBBMGsiASQAIAEgACkDUCIGNwMQIAEgBjcDKAJAAkAgACABQRBqEKUDRQ0AIAEoAighAgwBCyABIAEpAyg3AwggAUEgaiAAQQ8gAUEIahCOA0EAIQILAkAgAiIDRQ0AAkAgAC0AQ0ECSQ0AQQAhBANAIAMvAQghBSABIAAgBEEBaiICQQN0akHQAGopAwAiBjcDACABIAY3AxggACADIAUgARDUAiACIQQgAiAALQBDQX9qSA0ACwsgACADLwEIENkCCyABQTBqJAALiQICBX8BfiMAQcAAayIBJAAgASAAKQNQIgY3AyggASAGNwM4AkACQCAAIAFBKGoQpQNFDQAgASgCOCECDAELIAEgASkDODcDICABQTBqIABBDyABQSBqEI4DQQAhAgsCQCACIgJFDQAgASAAQdgAaikDACIGNwMYIAEgBjcDOAJAIAAgAUEYahClAw0AIAEgASkDODcDECABQTBqIABBDyABQRBqEI4DDAELIAEgASkDODcDCAJAIAAgAUEIahCkAyIDLwEIIgRFDQAgACACIAIvAQgiBSAEELICDQAgAigCDCAFQQN0aiADKAIMIARBA3QQxAUaCyAAIAIvAQgQ2QILIAFBwABqJAALnAICBn8BfiMAQSBrIgEkACABIAApA1AiBzcDCCABIAc3AxgCQAJAIAAgAUEIahClA0UNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQjgNBACECCyACIgMvAQghAkEAIQQCQCAALQBDQX9qIgVFDQAgAEEAENYCIQQLIAQiBEEfdSACcSAEaiIEQQAgBEEAShshBCACIQYCQCAFQQJJDQAgAiEGIABB4ABqKQMA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CyABQcgAaiAAIAIgASgCXBD+AiAAKAKsASABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahDsAjYCACABQegAaiAAQeoYIAEQiwMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahChAw0AIAEgASkDIDcDECABQShqIABBqhwgAUEQahCPA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEKIDIQILAkAgAiIDRQ0AIABBABDWAiECIABBARDWAiEEIABBAhDWAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQxgUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQoQMNACABIAEpA1A3AzAgAUHYAGogAEGqHCABQTBqEI8DQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEKIDIQILAkAgAiIDRQ0AIABBABDWAiEEIAEgAEHgAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahD3AkUNACABIAEpA0A3AwAgACABIAFB2ABqEPoCIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQoAMNACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQjgNBACECDAELIAEgASkDUDcDCCAAIAFBCGogAUHYAGoQogMhAgsgAiECCyACIgVFDQAgAEECENYCIQIgAEEDENYCIQAgASgCWCIGIAJNDQAgASAGIAJrIgY2AlggASgCTCIHIARNDQAgASAHIARrIgc2AkwgAyAEaiAFIAJqIAcgBiAAIAYgAEkbIgAgByAASRsQxAUaCyABQeAAaiQAC9kBAgF/AXwjAEEQayICJAAgAiABKQMANwMIAkACQCACQQhqEKgDRQ0AQX8hAQwBCwJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAiAUEAIAFBAEobIQEMAgsgASgCAEHCAEcNAEF/IQEMAQsgAiABKQMANwMAQX8hASAAIAIQnQMiA0QAAOD////vQWQNAEEAIQEgA0QAAAAAAAAAAGMNAAJAAkAgA0QAAAAAAADwQWMgA0QAAAAAAAAA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QbACaiAEOgAAIABBpwJqIAI6AAAgAEG0AmogAygCHEEMaiAEEMQFGiAAEJICCyABQSBqJAALewICfwF+IwBBEGsiASQAAkAgABDcAiICRQ0AAkAgAigCBA0AIAIgAEEcEKwCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABD7AgsgASABKQMINwMAIAAgAkH2ACABEIEDIAAgAhDbAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ3AIiAkUNAAJAIAIoAgQNACACIABBIBCsAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQ+wILIAEgASkDCDcDACAAIAJB9gAgARCBAyAAIAIQ2wILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAENwCIgJFDQACQCACKAIEDQAgAiAAQR4QrAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEPsCCyABIAEpAwg3AwAgACACQfYAIAEQgQMgACACENsCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDcAiICRQ0AAkAgAigCBA0AIAIgAEEiEKwCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARD7AgsgASABKQMINwMAIAAgAkH2ACABEIEDIAAgAhDbAgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEMQCAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABDEAgsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEIcDIAAQWSABQRBqJAALpgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCOA0EAIQEMAQsCQCABIAMoAhAQfSICDQAgA0EYaiABQcI0QQAQjAMLIAIhAQsCQAJAIAEiAUUNACAAIAEoAhwQmgMMAQsgAEIANwMACyADQSBqJAALrAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCOA0EAIQEMAQsCQCABIAMoAhAQfSICDQAgA0EYaiABQcI0QQAQjAMLIAIhAQsCQAJAIAEiAUUNACAAIAEtABBBD3FBBEYQmwMMAQsgAEIANwMACyADQSBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCOA0EAIQIMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQcI0QQAQjAMLIAIhAgsCQCACIgJFDQACQCACLQAQQQ9xQQRGDQAgAUEYaiAAQYw2QQAQjAMMAQsgAiAAQdgAaikDADcDICACQQEQdwsgAUEgaiQAC5QBAQJ/IwBBIGsiASQAIAEgACkDUDcDEAJAAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxA3AwggAUEYaiAAQYsBIAFBCGoQjgNBACEADAELAkAgACABKAIQEH0iAg0AIAFBGGogAEHCNEEAEIwDCyACIQALAkAgACIARQ0AIAAQfwsgAUEgaiQAC1kCA38BfiMAQRBrIgEkACAAKAKsASECIAEgAEHYAGopAwAiBDcDACABIAQ3AwggACABEKkBIQMgACgCrAEgAxB4IAIgAi0AEEHwAXFBBHI6ABAgAUEQaiQACxkAIAAoAqwBIgAgADUCHEKAgICAEIQ3AyALWQECfyMAQRBrIgEkAAJAAkAgAC0AQyICDQAgAUEIaiAAQa0nQQAQjAMMAQsgACACQX9qQQEQfiICRQ0AIAAoAqwBIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQwgIiBEHPhgNLDQAgASgApAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQdQhIANBCGoQjwMMAQsgACABIAEoAqABIARB//8DcRC2AiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEKwCEI8BEJwDIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCNASADQdAAakH7ABD7AiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQ0gIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqELQCIAMgACkDADcDECABIANBEGoQjgELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQwgIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEI4DDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BqNUBTg0CIABB8OoAIAFBA3RqLwEAEPsCDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQdMUQdY9QTFBzC4QpgUAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQpwMNACABQThqIABB6hoQjQMLIAEgASkDSDcDICABQThqIAAgAUEgahD/AiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI0BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEPoCIgJFDQAgAUEwaiAAIAIgASgCOEEBEKMCIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjgEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECENYCIQIgASABKQMgNwMIAkAgAUEIahCnAw0AIAFBGGogAEHUHBCNAwsgASABKQMoNwMAIAFBEGogACABIAJBARCmAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQnQObENgCCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEJ0DnBDYAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCdAxDvBRDYAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxCaAwsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQnQMiBEQAAAAAAAAAAGNFDQAgACAEmhDYAgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABCaBbhEAAAAAAAA8D2iENgCC2QBBX8CQAJAIABBABDWAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEJoFIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQ2QILEQAgACAAQQAQ1wIQ2gUQ2AILGAAgACAAQQAQ1wIgAEEBENcCEOYFENgCCy4BA38gAEEAENYCIQFBACECAkAgAEEBENYCIgNFDQAgASADbSECCyAAIAIQ2QILLgEDfyAAQQAQ1gIhAUEAIQICQCAAQQEQ1gIiA0UNACABIANvIQILIAAgAhDZAgsWACAAIABBABDWAiAAQQEQ1gJsENkCCwkAIABBARDVAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahCeAyEDIAIgAikDIDcDECAAIAJBEGoQngMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEJ0DIQYgAiACKQMgNwMAIAAgAhCdAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA/BzNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAENUBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahCnAw0AIAEgASkDKDcDECAAIAFBEGoQxgIhAiABIAEpAyA3AwggACABQQhqEMoCIgNFDQAgAkUNACAAIAIgAxCtAgsgACgCrAEgASkDKDcDICABQTBqJAALCQAgAEEBENkBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahDKAiIDRQ0AIABBABCRASIERQ0AIAJBIGogAEEIIAQQnAMgAiACKQMgNwMQIAAgAkEQahCNASAAIAMgBCABELECIAIgAikDIDcDCCAAIAJBCGoQjgEgACgCrAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDZAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahCkAyICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqEI4DDAELIAEgASkDMDcDGAJAIAAgAUEYahDKAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQjgMMAQsgAiADNgIEIAAoAqwBIAEpAzg3AyALIAFBwABqJAALdQEDfyMAQRBrIgIkAAJAAkAgASgCBCIDQYCAwP8HcQ0AIANBD3FBCEcNACABKAIAIgRFDQAgBCEDIAQoAgBBgICA+ABxQYCAgNgARg0BCyACIAEpAwA3AwAgAkEIaiAAQS8gAhCOA0EAIQMLIAJBEGokACADC8gBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCOA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABKACkAUE8aigCAEEDdiACLwESIgFNDQAgACABNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuyAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQjgNBACECCwJAAkAgAiICDQAgAEIANwMADAELIANBCDYCACADIAJBCGo2AgQgACABQagfIAMQ/QILIANBIGokAAu4AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQjgNBACECCwJAAkAgAiICDQAgAEIANwMADAELIANBGGogAikDCBCsBSADIANBGGo2AgAgACABQcYZIAMQ/QILIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQjgNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFRCaAwsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCOA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQEJoDCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEI4DQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABQQmgMLIANBIGokAAuiAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJA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QRhqIABBLyABEI4DQQAhAgsCQCAAIAIiAhDvASIDRQ0AIAFBCGogACADIAIoAhwiAkEMaiACLwEEEPcBIAAoAqwBIAEpAwg3AyALIAFBIGokAAvoAQICfwF+IwBBIGsiASQAIAEgACkDUDcDEAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACABKAIQIgJFDQAgAigCAEGAgID4AHFBgICA2ABGDQELIAEgASkDEDcDACABQRhqIABBLyABEI4DAAsgAEGkAmpBAEH8ARDGBRogAEGyAmpBAzsBACACKQMIIQMgAEGwAmpBBDoAACAAQagCaiADNwIAIABBtAJqIAIvARA7AQAgAEG2AmogAi8BFjsBACABQQhqIAAgAi8BEhCUAiAAKAKsASABKQMINwMgIAFBIGokAAuhAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQuwIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEI4DCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAhC8AiICQX9KDQAgAEIANwMADAELIAAgASACELcCCyADQTBqJAALjwECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqELsCIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCOAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EwaiQAC4gBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahC7AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQjgMLAkACQCACDQAgAEIANwMADAELIAAgAi8BAhCaAwsgA0EwaiQAC/gBAgN/AX4jAEEwayIDJAAgAyACKQMAIgY3AxggAyAGNwMQAkACQCABIANBEGogA0EsahC7AiIERQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQjgMLAkACQCAEDQAgAEIANwMADAELAkACQCAELwECQYDgA3EiBUUNACAFQYAgRw0BIAAgAikDADcDAAwCCwJAIAEgBBC8AiICQX9KDQAgAEIANwMADAILIAAgASABIAEoAKQBIgUgBSgCYGogAkEEdGogBC8BAkH/H3FBgMAAchDsARC4AgwBCyAAQgA3AwALIANBMGokAAuPAgIEfwF+IwBBMGsiASQAIAEgACkDUCIFNwMYIAEgBTcDCAJAAkAgACABQQhqIAFBLGoQuwIiAkUNACABKAIsQf//AUYNAQsgASABKQMYNwMAIAFBIGogAEGdASABEI4DCwJAIAJFDQAgACACELwCIgNBAEgNACAAQaQCakEAQfwBEMYFGiAAQbICaiACLwECIgRB/x9xOwEAIABBqAJqEJkCNwIAAkACQCAEQYDgA3EiBEGAIEYNACAEQYCAAkcNAUHmwQBByABBlzAQoQUACyAAIAAvAbICQYAgcjsBsgILIAAgAhD6ASABQRBqIAAgA0GAgAJqEJQCIAAoAqwBIAEpAxA3AyALIAFBMGokAAujAwEEfyMAQTBrIgUkACAFIAM2AiwCQAJAIAItAARBAXFFDQACQCABQQAQkQEiBg0AIABCADcDAAwCCyADIARqIQcgACABQQggBhCcAyAFIAApAwA3AxggASAFQRhqEI0BQQAhAyABKACkASIEIAQoAmBqIAIvAQZBAnRqIQIDQCACIQIgAyEDAkACQCAHIAUoAiwiCGsiBEEATg0AIAMhAyACIQJBAiEEDAELIAVBIGogASACLQACIAVBLGogBBBKAkACQAJAIAUpAyBQDQAgBSAFKQMgNwMQIAEgBiAFQRBqENUCIAUoAiwgCEYNACADIQQCQCADDQAgAi0AA0EedEEfdSACcSEECyAEIQMgAkEEaiEEAkACQCACLwEERQ0AIAQhAgwBCyADIQIgAw0AQQAhAyAEIQIMAgsgAyEDIAIhAkEAIQQMAgsgAyEDIAIhAgtBAiEECyADIQMgAiECIAQhBAsgAyEDIAIhAiAERQ0ACyAFIAApAwA3AwggASAFQQhqEI4BDAELIAAgASACLwEGIAVBLGogBBBKCyAFQTBqJAAL3QECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahC7AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGMHSABQRBq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AEGyAmogAy8BAjsBACABQdAAaiAAIAEoAkQQlAIgAEHYAGogASkDUDcDACAAKAKsAUECQQAQdRoMAQsgACABKAJEIAMvAQIQkQILIAFB4ABqJAALbwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQjgMMAQsgACABKAK0ASACKAIAQQxsaigCACgCEEEARxCbAwsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahCOA0H//wEhAgwBCyABKAIoIQILAkAgAiICQf//AUYNACAAQQAQ1gIhAyABIABB4ABqKQMAIgY3AyggASAGNwMIIAAgAUEIaiABQRxqEKMDIQQCQCADQYCABEkNACABQSBqIABB3QAQkAMMAQsCQCABKAIcIgVB7QFJDQAgAUEgaiAAQd4AEJADDAELIABBsAJqIAU6AAAgAEG0AmogBCAFEMQFGiAAIAIgAxCRAgsgAUEwaiQAC2kCAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDCCADIAQ3AxACQAJAIAEgA0EIahC6AiICDQAgAyADKQMQNwMAIANBGGogAUGdASADEI4DIABCADcDAAwBCyAAIAIoAgQQmgMLIANBIGokAAtwAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQugIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxCOAyAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EgaiQAC5MBAgJ/AX4jAEHAAGsiASQAIAEgACkDUCIDNwMYIAEgAzcDMAJAAkAgACABQRhqELoCIgINACABIAEpAzA3AwggAUE4aiAAQZ0BIAFBCGoQjgMMAQsgASAAQdgAaikDACIDNwMQIAEgAzcDICABQShqIAAgAiABQRBqEL8CIAAoAqwBIAEpAyg3AyALIAFBwABqJAALwwECAn8BfiMAQcAAayIBJAAgASAAKQNQIgM3AxggASADNwMwAkACQAJAIAAgAUEYahC6Ag0AIAEgASkDMDcDACABQThq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IgMkAAJAAkAgAUGxAmotAABB/wFHDQAgAEIANwMADAELAkAgAUELQSAQiAEiBA0AIABCADcDAAwBCyADQRhqIAFBCCAEEJwDIAMgAykDGDcDECABIANBEGoQjQEgBCABIAFBsAJqLQAAEJIBIgU2AhwCQAJAIAUNACADIAMpAxg3AwAgASADEI4BQgAhBgwBCyAFQQxqIAFBtAJqIAUvAQQQxAUaIAQgAUGoAmopAgA3AwggBCABLQCxAjoAFSAEIAFBsgJqLwEAOwEQIAFBpwJqLQAAIQUgBCACOwESIAQgBToAFCAEIAEvAaQCOwEWIAMgAykDGDcDCCABIANBCGoQjgEgAykDGCEGCyAAIAY3AwALIANBIGokAAvNAgIEfwF+IwBBwABrIgIkAAJAIAAoArABIgNFDQAgAyEDA0ACQCADIgMvARIgAUcNACADIAMtABBBIHI6ABALIAMoAgAiBCEDIAQNAAsLIAIgATYCMCACQQI2AjQgAiACKQMwNwMYIAJBIGogACACQRhqQeEAEMQCIAIgAikDMDcDECACIAIpAyA3AwggAkEoaiAAIAJBEGogAkEIahDAAiAAQbABaiIFIQQCQCACKQMoIgZCAFENACAAIAY3A1AgAEECOgBDIABB2ABqIgNCADcDACACQThqIAAgARCUAiADIAIpAzg3AwAgBSEEIABBAUEBEH4iA0UNACADIAMtABBBIHI6ABAgBSEECwJAA0AgBCgCACIDRQ0BIAMhBCADLQAQIgFBIHFFDQAgAyABQd8BcToAECADEIABIAUhBCADDQALCyACQcAAaiQAC9IGAgd/AX4jAEEQayIBJABBASECAkACQCAALQAQQQ9xIgMOBQEAAAABAAsCQAJAAkACQAJAAkAgA0F/ag4FAQIABAMECyABIAAoAiwgAC8BEhCUAiAAIAEpAwA3AyBBASECDAULAkAgACgCLCICKAK0ASAALwESIgRBDGxqKAIAKAIQIgMNACAAQQAQd0EAIQIMBQsCQCACQacCai0AAEEBcQ0AIAJBsgJqLwEAIgVFDQAgBSAALwEURw0AIAMtAAQiBSACQbECai0AAEcNACADQQAgBWtBDGxqQWRqKQMAIAJBqAJqKQIAUg0AIAIgBCAALwEIEJcCIgNFDQAgAkGgBGogAxDjAhpBASECDAULAkAgACgCGCACKALAAUsNACABQQA2AgxBACEEAkAgAC8BCCIDRQ0AIAIgAyABQQxqELwDIQQLIAJBpAJqIQUgAC8BFCEGIAAvARIhByABKAIMIQMgAkEBOgCnAiACQaYCaiADQQdqQfwBcToAACACKAK0ASAHQQxsaigCACgCECIHQQAgBy0ABCIHa0EMbGpBZGopAwAhCCACQbICaiAGOwEAIAJBsQJqIAc6AAAgAkGwAmogAzoAACACQagCaiAINwIAAkAgBCIERQ0AIAJBtAJqIAQgAxDEBRoLIAUQggUiA0UhAiADDQQCQCAALwEKIgRB5wdLDQAgACAEQQF0OwEKCyAAIAAvAQoQeCACIQIgAw0FC0EAIQIMBAsCQCAAKAIsIgIoArQBIAAvARJBDGxqKAIAKAIQIgQNACAAQQAQd0EAIQIMBAsgACgCCCEFIAAvARQhBiAALQAMIQMgAkGnAmpBAToAACACQaYCaiADQQdqQfwBcToAACAEQQAgBC0ABCIHa0EMbGpBZGopAwAhCCACQbICaiAGOwEAIAJBsQJqIAc6AAAgAkGwAmogAzoAACACQagCaiAINwIAAkAgBUUNACACQbQCaiAFIAMQxAUaCwJAIAJBpAJqEIIFIgINACACRSECDAQLIABBAxB4QQAhAgwDCyAAKAIIEIIFIgJFIQMCQCACDQAgAyECDAMLIABBAxB4IAMhAgwCC0G3wQBB/gJBgiEQoQUACyAAQQMQeCACIQILIAFBEGokACACC9MCAQZ/IwBBEGsiAyQAIABBtAJqIQQgAEGwAmotAAAhBQJAAkACQAJAIAINACAFIQUgBCEEDAELIAAgAiADQQxqELwDIQYCQAJAIAMoAgwiByAALQCwAk4NACAEIAdqLQAADQAgBiAEIAcQ3gUNACAHQQFqIQcMAQtBACEHCyAHIgdFDQEgBSAHayEFIAQgB2ohBAsgBCEHIAUhBAJAAkAgAEGgBGoiCCABIABBsgJqLwEAIAIQ5QIiBUUNAAJAIAQgBS0AFEcNACAFIQUMAgsgCCAFEOECC0EAIQULIAUiBiEFAkAgBg0AIAggASAALwGyAiAEEOQCIgEgAjsBFiABIQULIAUiAkEIaiEBAkACQCACLQAUQQpPDQAgASEBDAELIAEoAgAhAQsgASAHIAQQxAUaIAIgACkDwAE+AgQgAiEADAELQQAhAAsgA0EQaiQAIAALggQCBn8BfiMAQSBrIgMkAAJAIAAtAEYNACAAQaQCaiACIAItAAxBEGoQxAUaIAAoAKQBQTxqKAIAIQICQCAAQacCai0AAEEBcUUNACAAQagCaikCABCZAlINACAAQRUQrAIhBCADQQhqQaQBEPsCIAMgAykDCDcDACADQRBqIAAgBCADEM0CIAMpAxAiCVANACAAIAk3A1AgAEECOgBDIABB2ABqIgRCADcDACADQRhqIABB//8BEJQCIAQgAykDGDcDACAAQQFBARB+IgRFDQAgBCAELQAQQSByOgAQCwJAIAJBCEkNACACQQN2IgJBASACQQFLGyEFIABBoARqIgYhB0EAIQIDQAJAIAAoArQBIAIiBEEMbGooAgAoAhAiAkUNAAJAAkAgAC0AsQIiCA0AIAAvAbICRQ0BCyACLQAEIAhHDQELIAJBACACLQAEa0EMbGpBZGopAwAgACkCqAJSDQAgABCBAQJAIAAtAKcCQQFxDQACQCAALQCxAkExTw0AIAAvAbICQf+BAnFBg4ACRw0AIAYgBCAAKALAAUHwsX9qEOYCDAELQQAhCANAIAcgBCAALwGyAiAIEOgCIgJFDQEgAiEIIAAgAi8BACACLwEWEJcCRQ0ACwsgACAEEJUCCyAEQQFqIgQhAiAEIAVHDQALCyAAEIMBCyADQSBqJAALEAAQmQVC+KftqPe0kpFbhQvPAQEEfwJAIAAtAAYiAkEEcQ0AAkAgAkEIcQ0AIAEQuQQhAiAAQcUAIAEQugQgAhBOCwJAIAAoAKQBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoArQBIQRBACECA0ACQCAEIAIiAkEMbGooAgAgAUcNACAAQaAEaiACEOcCIABBvAJqQn83AgAgAEG0AmpCfzcCACAAQawCakJ/NwIAIABCfzcCpAIgACACEJUCDAILIAJBAWoiBSECIAUgA0cNAAsLIAAQgwELCysAIABCfzcCpAIgAEG8AmpCfzcCACAAQbQCakJ/NwIAIABBrAJqQn83AgALwQEBBn8jAEEQayIBJAAgACAALQAGQQRyOgAGEMEEIAAgAC0ABkH7AXE6AAYCQCAAKACkAUE8aigCACICQQhJDQAgAEGkAWohAyACQQN2IgJBASACQQFLGyEEQQAhAgNAIAAoAKQBIgUoAjghBiABIAMoAgA2AgwgAUEMaiACIgIQfCAFIAZqIAJBA3RqKAIAEMAEIQUgACgCtAEgAkEMbGogBTYCACACQQFqIgUhAiAFIARHDQALCxDCBCABQRBqJAALIAAgACAALQAGQQRyOgAGEMEEIAAgAC0ABkH7AXE6AAYLEwBBAEEAKAKc5AEgAHI2ApzkAQsWAEEAQQAoApzkASAAQX9zcTYCnOQBCwkAQQAoApzkAQsfAQF/IAAgASAAIAFBAEEAEKICECEiAkEAEKICGiACC/oDAQp/IwBBEGsiBCQAQQAhBQJAIAJFDQAgAkEiOgAAIAJBAWohBQsgBSECAkACQCABDQAgAiEGQQEhB0EAIQgMAQtBACEFQQAhCUEBIQogAiECA0AgAiECIAohCyAJIQkgBCAAIAUiCmosAAAiBToADwJAAkACQAJAAkACQAJAAkAgBUF3ag4aAgAFBQEFBQUFBQUFBQUFBQUFBQUFBQUFBQQDCyAEQe4AOgAPDAMLIARB8gA6AA8MAgsgBEH0ADoADwwBCyAFQdwARw0BCyALQQJqIQUCQAJAIAINAEEAIQwMAQsgAkHcADoAACACIAQtAA86AAEgAkECaiEMCyAFIQUMAQsCQCAFQSBIDQACQAJAIAINAEEAIQIMAQsgAiAFOgAAIAJBAWohAgsgAiEMIAtBAWohBSAJIAQtAA9BwAFxQYABRmohAgwCCyALQQZqIQUCQCACDQBBACEMIAUhBQwBCyACQdzqwYEDNgAAIAJBBGogBEEPakEBEKQFIAJBBmohDCAFIQULIAkhAgsgDCILIQYgBSIMIQcgAiICIQggCkEBaiINIQUgAiEJIAwhCiALIQIgDSABRw0ACwsgCCEFIAchAgJAIAYiCUUNACAJQSI7AAALIAJBAmohAgJAIANFDQAgAyACIAVrNgIACyAEQRBqJAAgAgvEAwIFfwF+IwBBMGsiBSQAAkAgAiADai0AAA0AIAVBADoALiAFQQA7ASwgBUEANgIoIAUgAzYCJCAFIAI2AiAgBSACNgIcIAUgATYCGCAFQRBqIAVBGGoQpAICQCAFLQAuDQAgBSgCICEBIAUoAiQhBgNAIAIhByABIQICQAJAIAYiAw0AIAVB//8DOwEsIAIhAiADIQNBfyEBDAELIAUgAkEBaiIBNgIgIAUgA0F/aiIDNgIkIAUgAiwAACIGOwEsIAEhAiADIQMgBiEBCyADIQYgAiEIAkACQCABIglBd2oiAUEXSw0AIAchAkEBIQNBASABdEGTgIAEcQ0BCyAJIQJBACEDCyAIIQEgBiEGIAIiCCECIAMNAAsgCEF/Rg0AIAVBAToALgsCQAJAIAUtAC5FDQACQCAEDQBCACEKDAILAkAgBS4BLCICQX9HDQAgBUEIaiAFKAIYQbINQQAQkQNCACEKDAILIAUgAjYCACAFIAUoAhxBf3MgBSgCIGo2AgQgBUEIaiAFKAIYQYk4IAUQkQNCACEKDAELIAUpAxAhCgsgACAKNwMAIAVBMGokAA8LQcfPAEHCPUHxAkHOLBCmBQALvhIDCX8BfgF8IwBBgAFrIgIkAAJAAkAgAS0AFkUNACAAQgA3AwAMAQsgASgCDCEDA0AgBSEEAkACQCADIgUNACABQf//AzsBFCAFIQVBfyEGDAELIAEgBUF/aiIFNgIMIAEgASgCCCIGQQFqNgIIIAEgBiwAACIGOwEUIAUhBSAGIQYLIAUhAwJAAkAgBiIHQXdqIghBF0sNACAEIQVBASEGQQEgCHRBk4CABHENAQsgByEFQQAhBgsgAyEDIAUiBCEFIAYNAAsCQAJAAkACQAJAAkACQCAEQSJGDQACQCAEQdsARg0AIARB+wBHDQICQCABKAIAIglBABCPASIKDQAgAEIANwMADAkLIAJB+ABqIAlBCCAKEJwDIAEtABZB/wFxIQgDQCAFIQZBfyEFAkAgCA0AAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALAkAgA0F/Rg0AIANB/QBGDQQgASABKAIIQX9qNgIIIAEgASgCDEEBajYCDAsgAiACKQN4NwNAIAkgAkHAAGoQjQECQANAIAEtABYhCANAIAUhBgJAAkAgCEH/AXFFDQBBfyEFDAELAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALIANBIkcNASACQfAAaiABEKUCAkACQCABLQAWRQ0AQQQhBQwBCyABKAIMIQMDQCAFIQQCQAJAIAMiBQ0AIAFB//8DOwEUIAUhBUF/IQYMAQsgASAFQX9qIgU2AgwgASABKAIIIgZBAWo2AgggASAGLAAAIgY7ARQgBSEFIAYhBgsgBSEDAkACQCAGIgdBd2oiCEEXSw0AIAQhBUEBIQZBASAIdEGTgIAEcQ0BCyAHIQVBACEGCyADIQMgBSIEIQUgBg0AC0EEIQUgBEE6Rw0AIAIgAikDcDcDOCAJIAJBOGoQjQEgAkHoAGogARCkAgJAIAEtABYNACACIAIpA2g3AzAgCSACQTBqEI0BIAIgAikDcDcDKCACIAIpA2g3AyAgCSAKIAJBKGogAkEgahCuAiACIAIpA2g3AxggCSACQRhqEI4BCyACIAIpA3A3AxAgCSACQRBqEI4BQQQhBQJAIAEtABYNACABKAIMIQMDQCAFIQQCQAJAIAMiBQ0AIAFB//8DOwEUIAUhBUF/IQYMAQsgASAFQX9qIgU2AgwgASABKAIIIgZBAWo2AgggASAGLAAAIgY7ARQgBSEFIAYhBgsgBSEDAkACQCAGIgdBd2oiCEEXSw0AIAQhBUEBIQZBASAIdEGTgIAEcQ0BCyAHIQVBACEGCyADIQMgBSIEIQUgBg0AC0EDQQJBBCAEQf0ARhsgBEEsRhshBQsgBSEFCyAFIgVBA0YNAAsCQCAFQX5qDgMACgEKCyACIAIpA3g3AwAgCSACEI4BIAIpA3ghCwwICyACIAIpA3g3AwggCSACQQhqEI4BIAFBAToAFkIAIQsMBwsCQCABKAIAIgdBABCRASIJDQAgAEIANwMADAgLIAJB+ABqIAdBCCAJEJwDIAEtABZB/wFxIQgDQCAFIQZBfyEFAkAgCA0AAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALAkAgA0F/Rg0AIANB3QBGDQQgASABKAIIQX9qNgIIIAEgASgCDEEBajYCDAsgAiACKQN4NwNgIAcgAkHgAGoQjQEDQCACQfAAaiABEKQCQQQhBQJAIAEtABYNACACIAIpA3A3A1ggByAJIAJB2ABqENUCIAEtABYhCANAIAUhBgJAAkAgCEH/AXFFDQBBfyEFDAELAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALQQNBAkEEIANB3QBGGyADQSxGGyEFCyAFIgVBA0YNAAsCQAJAIAVBfmoOAwAJAQkLIAIgAikDeDcDSCAHIAJByABqEI4BIAIpA3ghCwwGCyACIAIpA3g3A1AgByACQdAAahCOASABQQE6ABZCACELDAULIAAgARClAgwGCwJAAkACQAJAIAEvARQiBUGaf2oODwIDAwMDAwMDAAMDAwMDAQMLAkAgASgCDCIGQQNJDQAgASgCCCIDQaMkQQMQ3gUNACABIAZBfWo2AgwgASADQQNqNgIIIABBACkDgHQ3AwAMCQsgBUGaf2oODwECAgICAgICAgICAgICAAILAkAgASgCDCIGQQNJDQAgASgCCCIDQb4rQQMQ3gUNACABIAZBfWo2AgwgASADQQNqNgIIIABBACkD4HM3AwAMCAsgBUHmAEcNAQsgASgCDCIFQQRJDQAgASgCCCIGKAAAQeHYzasGRw0AIAEgBUF8ajYCDCABIAZBBGo2AgggAEEAKQPoczcDAAwGCwJAAkAgBEEtRg0AIARBUGpBCUsNAQsgASgCCEF/aiACQfgAahCJBiEMAkAgAigCeCIFIAEoAggiBkF/akcNACABQQE6ABYgAEIANwMADAcLIAEoAgwgBiAFa2oiBkF/TA0DIAEgBTYCCCABIAY2AgwgACAMEJkDDAYLIAFBAToAFiAAQgA3AwAMBQsgAikDeCELDAMLIAIpA3ghCwwBC0G3zgBBwj1B4QJB9SsQpgUACyAAIAs3AwAMAQsgACALNwMACyACQYABaiQAC40BAQN/IAFBADYCECABKAIMIQIgASgCCCEDAkACQAJAIAFBABCoAiIEQQFqDgIAAQILIAFBAToAFiAAQgA3AwAPCyAAQQAQ+wIPCyABIAI2AgwgASADNgIIAkAgASgCACICIAAgBCABKAIQEJQBIgNFDQAgAUEANgIQIAIgACABIAMQqAIgASgCEBCVAQsLmAICA38BfiMAQcAAayIFJAAgBSACKQMAIgg3AxggBUE0aiIGQgA3AgAgBSAINwMQIAVCADcCLCAFIANBAEciBzYCKCAFIAM2AiQgBSABNgIgIAVBIGogBUEQahCnAgJAAkACQCAGKAIADQAgBSgCLCIGQX9HDQELAkAgBEUNACAFQSBqIAFB1MgAQQAQiwMLIABCADcDAAwBCyABIAAgBiAFKAI4EJQBIgZFDQAgBSACKQMAIgg3AxggBSAINwMIIAVCADcCNCAFIAY2AjAgBUEANgIsIAUgBzYCKCAFIAM2AiQgBSABNgIgIAVBIGogBUEIahCnAiABIABBfyAFKAIsIAUoAjQbIAUoAjgQlQELIAVBwABqJAALvwkBCX8jAEHwAGsiAiQAIAAoAgAhAyACIAEpAwA3A1gCQAJAIAMgAkHYAGoQjAFFDQAgAEEBNgIUDAELIAAoAhQNAAJAAkAgACgCECIEDQBBACEEDAELIAQgACgCDGohBAsgBCEEIAIgASkDADcDUAJAAkACQAJAIAMgAkHQAGoQpgMODQEAAwMDAwEDAwIDAwEDCyABKAIEQY+AwP8HcQ0AAkAgASgCACIFQb5/akECSQ0AIAVBAkcNAQsgAUEAKQOAdDcDAAsgAiABKQMANwNAIAJB6ABqIAMgAkHAAGoQ/wIgASACKQNoNwMAIAIgASkDADcDOCADIAJBOGogAkHoAGoQ+gIhAQJAIARFDQAgBCABIAIoAmgQxAUaCyAAIAAoAgwgAigCaCIBajYCDCAAIAEgACgCGGo2AhgMAgsgAiABKQMANwNIIAAgAyACQcgAaiACQegAahD6AiACKAJoIAQgAkHkAGoQogIgACgCDGpBf2o2AgwgACACKAJkIAAoAhhqQX9qNgIYDAELIAIgASkDADcDMCADIAJBMGoQjQEgAiABKQMANwMoAkACQAJAIAMgAkEoahClA0UNACACIAEpAwA3AxggAyACQRhqEKQDIQYCQCAAKAIQRQ0AIAAoAhAgACgCDGpB2wA6AAALIAAgACgCDEEBajYCDCAAIAAoAhhBAWo2AhggACAAKAIIIAAoAgRqNgIIIABBGGohByAAQQxqIQgCQCAGLwEIRQ0AQQAhBANAIAQhCQJAIAAoAghFDQACQCAAKAIQIgRFDQAgBCAIKAIAakEKOgAACyAAIAAoAgxBAWo2AgwgACAAKAIYQQFqNgIYIAAoAghBf2ohCgJAIAAoAhBFDQBBACEEIApFDQADQCAAKAIQIAAoAgwgBCIEampBIDoAACAEQQFqIgUhBCAFIApHDQALCyAIIAgoAgAgCmo2AgAgByAHKAIAIApqNgIACyACIAYoAgwgCUEDdGopAwA3AxAgACACQRBqEKcCIAAoAhQNAQJAIAkgBi8BCEF/akYNAAJAIAAoAhBFDQAgACgCECAAKAIMakEsOgAACyAIIAgoAgBBAWo2AgAgByAHKAIAQQFqNgIACyAJQQFqIgUhBCAFIAYvAQhJDQALCyAAIAAoAgggACgCBGs2AggCQCAGLwEIRQ0AIAAQqQILIAghCkHdACEJIAchBiAIIQQgByEFIAAoAhANAQwCCyACIAEpAwA3AyAgAyACQSBqEMoCIQQCQCAAKAIQRQ0AIAAoAhAgACgCDGpB+wA6AAALIAAgACgCDEEBaiIFNgIMIAAgACgCGEEBajYCGAJAIARFDQAgACAAKAIIIAAoAgRqNgIIIAMgBCAAQRMQqwIaIAAgACgCCCAAKAIEazYCCCAFIAAoAgwiBEYNACAAIARBf2o2AgwgACAAKAIYQX9qNgIYIAAQqQILIABBDGoiBCEKQf0AIQkgAEEYaiIFIQYgBCEEIAUhBSAAKAIQRQ0BCyAAKAIQIAAoAgxqIAk6AAAgCiEEIAYhBQsgBCIAIAAoAgBBAWo2AgAgBSIAIAAoAgBBAWo2AgAgAiABKQMANwMIIAMgAkEIahCOAQsgAkHwAGokAAvQBwEKfyMAQRBrIgIkACABIQFBACEDQQAhBAJAA0AgBCEEIAMhBSABIQNBfyEBAkAgAC0AFiIGDQACQCAAKAIMIgENACAAQf//AzsBFEF/IQEMAQsgACABQX9qNgIMIAAgACgCCCIBQQFqNgIIIAAgASwAACIBOwEUIAEhAQsCQAJAIAEiAUF/Rg0AAkACQCABQdwARg0AIAEhByABQSJHDQEgAyEBIAUhCCAEIQlBAiEKDAMLAkACQCAGRQ0AQX8hAQwBCwJAIAAoAgwiAQ0AIABB//8DOwEUQX8hAQwBCyAAIAFBf2o2AgwgACAAKAIIIgFBAWo2AgggACABLAAAIgE7ARQgASEBCyABIgshByADIQEgBSEIIAQhCUEBIQoCQAJAAkACQAJAAkAgC0Feag5UBggICAgICAgICAgICAYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAYICAgICAIICAgDCAgICAgICAUICAgBCAAECAtBCSEHDAULQQ0hBwwEC0EIIQcMAwtBDCEHDAILQQAhAQJAA0AgASEBQX8hCAJAIAYNAAJAIAAoAgwiCA0AIABB//8DOwEUQX8hCAwBCyAAIAhBf2o2AgwgACAAKAIIIghBAWo2AgggACAILAAAIgg7ARQgCCEIC0F/IQkgCCIIQX9GDQEgAkELaiABaiAIOgAAIAFBAWoiCCEBIAhBBEcNAAsgAkEAOgAPIAJBCWogAkELahClBSEBIAItAAlBCHQgAi0ACnJBfyABQQJGGyEJCyAJIglBf0YNAgJAAkAgCUGAeHEiAUGAuANGDQACQCABQYCwA0YNACAEIQEgCSEEDAILIAMhASAFIQggBCAJIAQbIQlBAUEDIAQbIQoMBQsCQCAEDQAgAyEBIAUhCEEAIQlBASEKDAULQQAhASAEQQp0IAlqQYDIgGVqIQQLIAEhCSAEIAJBBWoQlAMhBCAAIAAoAhBBAWo2AhACQAJAIAMNAEEAIQEMAQsgAyACQQVqIAQQxAUgBGohAQsgASEBIAQgBWohCCAJIQlBAyEKDAMLQQohBwsgByEBIAQNAAJAAkAgAw0AQQAhBAwBCyADIAE6AAAgA0EBaiEECyAEIQQCQCABQcABcUGAAUYNACAAIAAoAhBBAWo2AhALIAQhASAFQQFqIQhBACEJQQAhCgwBCyADIQEgBSEIIAQhCUEBIQoLIAEhASAIIgghAyAJIgkhBEF/IQUCQCAKDgQBAgABAgsLQX8gCCAJGyEFCyACQRBqJAAgBQukAQEDfwJAIAAoAghFDQACQCAAKAIQRQ0AIAAoAhAgACgCDGpBCjoAAAsgACAAKAIMQQFqNgIMIAAgACgCGEEBajYCGCAAKAIIQX9qIQECQCAAKAIQRQ0AIAFFDQBBACECA0AgACgCECAAKAIMIAIiAmpqQSA6AAAgAkEBaiIDIQIgAyABRw0ACwsgACAAKAIMIAFqNgIMIAAgACgCGCABajYCGAsLxQMBA38jAEEgayIEJAAgBCACKQMANwMYAkAgACAEQRhqEPcCRQ0AIAQgAykDADcDEAJAIAAgBEEQahCmAyIAQQtLDQBBASAAdEGBEnENAQsCQCABKAIIRQ0AAkAgASgCECIARQ0AIAAgASgCDGpBCjoAAAsgASABKAIMQQFqNgIMIAEgASgCGEEBajYCGCABKAIIQX9qIQUCQCABKAIQRQ0AIAVFDQBBACEAA0AgASgCECABKAIMIAAiAGpqQSA6AAAgAEEBaiIGIQAgBiAFRw0ACwsgASABKAIMIAVqNgIMIAEgASgCGCAFajYCGAsgBCACKQMANwMIIAEgBEEIahCnAgJAIAEoAhBFDQAgASgCECABKAIMakE6OgAACyABIAEoAgxBAWo2AgwgASABKAIYQQFqNgIYAkAgASgCCEUNAAJAIAEoAhBFDQAgASgCECABKAIMakEgOgAACyABIAEoAgxBAWo2AgwgASABKAIYQQFqNgIYCyAEIAMpAwA3AwAgASAEEKcCAkAgASgCEEUNACABKAIQIAEoAgxqQSw6AAALIAEgASgCDEEBajYCDCABIAEoAhhBAWo2AhgLIARBIGokAAvbBAEHfyMAQTBrIgQkAEEAIQUgASEBAkADQCAFIQYCQCABIgcgACgApAEiBSAFKAJgamsgBS8BDkEEdE8NAEEAIQUMAgsCQAJAIAdBwOUAa0EMbUEnSw0AAkACQCAHKAIIIgUvAQAiAQ0AIAUhCAwBCyABIQEgBSEFA0AgBSEFIAEhAQJAIANFDQAgBEEoaiABQf//A3EQ+wIgBS8BAiIBIQkCQAJAIAFBJ0sNAAJAIAAgCRCsAiIJQcDlAGtBDG1BJ0sNACAEQQA2AiQgBCABQeAAajYCIAwCCyAEQSBqIABBCCAJEJwDDAELIAFBz4YDTQ0FIAQgCTYCICAEQQM2AiQLIAQgBCkDKDcDCCAEIAQpAyA3AwAgACACIARBCGogBCADEQUACyAFLwEEIgkhASAFQQRqIgghBSAIIQggCQ0ACwsgCCAHKAIIa0ECdSEFDAMLAkACQCAHDQBBACEFDAELIActAANBD3EhBQsCQAJAIAVBfGoOBgEAAAAAAQALQa/aAEH/O0HRAEHNGxCmBQALIAcvAQghCgJAIANFDQAgCkUNACAKQQF0IQggBygCDCEFQQAhAQNAIAQgBSABIgFBA3QiCWopAwA3AxggBCAFIAlBCHJqKQMANwMQIAAgAiAEQRhqIARBEGogAxEFACABQQJqIgkhASAJIAhJDQALCyAKIQUCQCAHDQAgBSEFDAMLIAUhBSAHKAIAQYCAgPgAcUGAgIDIAEcNAiAGIApqIQUgBygCBCEBDAELC0H6yABB/ztBPUHTKxCmBQALIARBMGokACAGIAVqC68CAQR/AkACQAJAAkACQCABQRlLDQACQEGu/f4KIAF2QQFxIgINACABQZDhAGotAAAhAwJAIAAoArgBDQAgAEEgEIkBIQQgAEEIOgBEIAAgBDYCuAEgBA0AQQAhAwwBCyADQX9qIgRBCE8NAyAAKAK4ASAEQQJ0aigCACIFIQMgBQ0AAkAgAEEJQRAQiAEiAw0AQQAhAwwBCyAAKAK4ASAEQQJ0aiADNgIAIAFBKE8NBCADQcDlACABQQxsaiIAQQAgACgCCBs2AgQgAyEDCyADIQAgAkUNAQsgAUEoTw0DQcDlACABQQxsaiIBQQAgASgCCBshAAsgAA8LQbTIAEH/O0GPAkGNExCmBQALQZ7FAEH/O0HyAUGoIBCmBQALQZ7FAEH/O0HyAUGoIBCmBQALDgAgACACIAFBFBCrAhoLtwIBA38jAEEgayIEJAAgBCACKQMANwMQAkACQAJAIAAgASAEQRBqEK8CIgVFDQAgBSADKQMANwMADAELIAQgAikDADcDCAJAIAAgBEEIahD3Ag0AIAQgAikDADcDACAEQRhqIABBwgAgBBCOAwwBCyABLwEKIgUgAS8BCCIGSQ0BAkAgBSAGRw0AIAAgBUEKbEEDdiIFQQQgBUEESxsiBkEEdBCJASIFRQ0BIAEgBjsBCgJAIAEvAQgiBkUNACAFIAEoAgwgBkEEdBDEBRoLIAEgBTYCDCAAKALQASAFEIoBCyABKAIMIAEvAQhBBHRqIAIpAwA3AwAgASgCDCABLwEIQQR0akEIaiADKQMANwMAIAEgAS8BCEEBajsBCAsgBEEgaiQADwtBhSZB/ztBnQFBjxIQpgUAC+wCAgl/AX4jAEEgayIDJAAgAyACKQMANwMQQQAhBAJAIAAgA0EQahD3AkUNACABLwEIIgVBAEchBCAFQQF0IQYgASgCDCEHAkACQCAFDQAgBCEIDAELIAIoAgAhCSACKQMAIQwgBCEBQQAhCgNAIAEhCAJAIAcgCiIEQQN0aiIBKAAAIAlHDQAgASkDACAMUg0AIAghCCAHIARBA3RBCHJqIQsMAgsgBEECaiIKIAZJIgQhASAKIQogBCEIIAQNAAsLIAshBCAIQQFxDQAgAyACKQMANwMIIAAgA0EIaiADQRxqEPoCIQgCQAJAIAUNAEEAIQQMAQtBACEEA0AgAyAHIAQiBEEDdGopAwA3AwAgACADIANBGGoQ+gIhAQJAIAMoAhggAygCHCIKRw0AIAggASAKEN4FDQAgByAEQQN0QQhyaiEEDAILIARBAmoiASEEIAEgBkkNAAtBACEECyAEIQQLIANBIGokACAEC3ABAX8CQAJAIAFFDQAgAUHA5QBrQQxtQShJDQBBACECIAEgACgApAEiACAAKAJgamsgAC8BDkEEdEkNAUEBIQICQCABLQADQQ9xQXxqDgYCAAAAAAIAC0Gv2gBB/ztB9gBB+R4QpgUAC0EAIQILIAILXAECfyMAQRBrIgQkACACLwEIIQUgBCACNgIIIAQgAzoABCAEIAU2AgAgACABQQBBABCrAiEDAkAgACACIAQoAgAgAxCyAg0AIAAgASAEQRUQqwIaCyAEQRBqJAAL6QIBBn8jAEEQayIEJAACQAJAIANBgThIDQAgBEEIaiAAQQ8QkANBfCEDDAELAkBBACABLwEIIgVrIAMgBSADaiIGQQBIGyIDRQ0AAkAgBkEAIAZBAEobIgZBgThJDQAgBEEIaiAAQQ8QkANBeiEDDAILAkAgBiABLwEKTQ0AAkAgACAGQQpsQQN2IgdBBCAHQQRLGyIIQQN0EIkBIgcNAEF7IQMMAwsCQCABKAIMIglFDQAgByAJIAEvAQhBA3QQxAUaCyABIAg7AQogASAHNgIMIAAoAtABIAcQigELIAEvAQggBSACIAUgAkkbIgBrIQICQAJAIANBf0oNACABKAIMIABBA3RqIgAgACADQQN0ayACIANqQQN0EMUFGgwBCyABKAIMIABBA3QiAGoiBSADQQN0IgNqIAUgAkEDdBDFBRogASgCDCAAakEAIAMQxgUaCyABIAY7AQgLQQAhAwsgBEEQaiQAIAMLNQECfyABKAIIKAIMIQQgASABKAIAIgVBAWo2AgAgBCAFQQN0aiACIAMgAS0ABBspAwA3AwAL4AIBBn8gAS8BCiEEAkACQCABLwEIIgUNAEEAIQYMAQsgASgCDCIHIARBA3RqIQhBACEGA0ACQCAIIAYiBkEBdGovAQAgAkcNACAHIAZBA3RqIQYMAgsgBkEBaiIJIQYgCSAFRw0AC0EAIQYLAkAgBiIGRQ0AIAYgAykDADcDAA8LAkAgBCAFSQ0AAkACQCAEIAVHDQAgACAEQQpsQQN2IgZBBCAGQQRLGyIJQQpsEIkBIgZFDQEgAS8BCiEFIAEgCTsBCgJAIAEvAQgiCEUNACAGIAEoAgwiBCAIQQN0EMQFIAlBA3RqIAQgBUEDdGogAS8BCEEBdBDEBRoLIAEgBjYCDCAAKALQASAGEIoBCyABKAIMIAEvAQhBA3RqIAMpAwA3AwAgASgCDCABLwEKQQN0aiABLwEIQQF0aiACOwEAIAEgAS8BCEEBajsBCAsPC0GFJkH/O0G4AUH8ERCmBQALgAEBAn8jAEEQayIDJAAgAyACKQMANwMIAkACQCAAIAEgA0EIahCvAiICDQBBfyEBDAELIAEgAS8BCCIAQX9qOwEIAkAgACACQXhqIgQgASgCDGtBA3VBAXZBf3NqIgFFDQAgBCACQQhqIAFBBHQQxQUaC0EAIQELIANBEGokACABC4kBAgR/AX4CQAJAIAIvAQgiBA0AQQAhAgwBCyACKAIMIgUgAi8BCkEDdGohBkEAIQIDQAJAIAYgAiICQQF0ai8BACADRw0AIAUgAkEDdGohAgwCCyACQQFqIgchAiAHIARHDQALQQAhAgsCQAJAIAIiAg0AQgAhCAwBCyACKQMAIQgLIAAgCDcDAAsYACAAQQY2AgQgACACQQ90Qf//AXI2AgALVgACQCACDQAgAEIANwMADwsCQCACIAEoAKQBIgEgASgCYGprIgJBgIACTw0AIABBBjYCBCAAIAJBDXRB//8BcjYCAA8LQYzbAEH/O0GzAkHUOhCmBQALSQECfwJAIAEoAgQiAkGAgMD/B3FFDQBBfw8LQX8hAwJAIAJBD3FBBkcNACABKAIAQQ92IgFBfyABIAAoAqQBLwEOSRshAwsgAwtyAQJ/AkACQCABKAIEIgJBgIDA/wdxRQ0AQX8hAwwBC0F/IQMgAkEPcUEGRw0AIAEoAgBBD3YiAUF/IAEgACgCpAEvAQ5JGyEDC0EAIQECQCADIgNBAEgNACAAKACkASIBIAEoAmBqIANBBHRqIQELIAELmgEBAX8CQCACRQ0AIAJB//8BNgIACwJAIAEoAgQiA0GAgMD/B3FFDQBBAA8LAkAgA0EPcUEGRg0AQQAPCwJAAkAgASgCAEEPdiAAKAKkAS8BDk8NAEEAIQMgACgApAENAQsgASgCACEBAkAgAkUNACACIAFB//8BcTYCAAsgACgApAEiAiACKAJgaiABQQ12Qfz/H3FqIQMLIAML3QEBCH8gACgCpAEiAC8BDiICQQBHIQMCQAJAIAINACADIQQMAQsgACAAKAJgaiEFIAMhBkEAIQcDQCAIIQggBiEJAkACQCABIAUgBSAHIgNBBHRqIgcvAQpBAnRqayIEQQBIDQBBACEGIAMhACAEIAcvAQhBA3RIDQELQQEhBiAIIQALIAAhAAJAIAZFDQAgA0EBaiIDIAJJIgQhBiAAIQggAyEHIAQhBCAAIQAgAyACRg0CDAELCyAJIQQgACEACyAAIQACQCAEQQFxDQBB/ztB5gJBxxAQoQUACyAAC80BAQR/AkACQCABQYCAAkkNAEEAIQIgAUGAgH5qIgMgACgCpAEiAS8BDk8NASABIAEoAmBqIANBBHRqDwsCQCAAKACkASIAQTxqKAIAQQN2IAFLDQBBAA8LQQAhAiAALwEOIgRFDQAgACAAKAI4aiABQQN0aigCACEBIAAgACgCYGohBUEAIQICQANAIAUgAiIDQQR0aiICIAAgAigCBCIAIAFGGyECIAAgAUYNASACIQAgA0EBaiIDIQIgAyAERw0AC0EADwsgAiECCyACC1UBAX9BACECAkACQCABKAIEQfP///8BRg0AIAEvAQJBD3EiAUECTw0BIAAoAKQBIgIgAigCYGogAUEEdGohAgsgAg8LQZHGAEH/O0H8AkHwOhCmBQALiAYBC38jAEEgayIEJAAgAUGkAWohBSACIQICQAJAAkACQAJAAkADQCACIgZFDQEgBiAFKAAAIgIgAigCYGoiB2sgAi8BDkEEdE8NAyAHIAYvAQpBAnRqIQggBi8BCCEJAkACQCADKAIEIgJBgIDA/wdxDQAgAkEPcUEERw0AIAlBAEchAgJAAkAgCQ0AIAIhAkEAIQoMAQtBACEKIAIhAiAIIQsCQAJAIAMoAgAiDCAILwEARg0AA0AgCkEBaiICIAlGDQIgAiEKIAwgCCACQQN0aiILLwEARw0ACyACIAlJIQIgCyELCyACIQIgCyAHayIKQYCAAk8NCCAAQQY2AgQgACAKQQ10Qf//AXI2AgAgAiECQQEhCgwBCyACIAlJIQJBACEKCyAKIQogAkUNACAKIQkgBiECDAELIAQgAykDADcDECABIARBEGogBEEYahD6AiENAkACQAJAAkACQCAEKAIYRQ0AIAlBAEciAiEKQQAhDCAJDQEgAiECDAILIABCADcDAEEBIQIgBiEKDAMLA0AgCiEHIAggDCIMQQN0aiIOLwEAIQIgBCgCGCEKIAQgBSgCADYCDCAEQQxqIAIgBEEcahC7AyECAkAgCiAEKAIcIgtHDQAgAiANIAsQ3gUNACAOIAUoAAAiAiACKAJgamsiAkGAgAJPDQsgAEEGNgIEIAAgAkENdEH//wFyNgIAIAchAkEBIQkMAwsgDEEBaiICIAlJIgshCiACIQwgAiAJRw0ACyALIQILQQkhCQsgCSEJAkAgAkEBcUUNACAJIQIgBiEKDAELQQAhAkEAIQogBigCBEHz////AUYNACAGLwECQQ9xIglBAk8NCEEAIQIgBSgAACIKIAooAmBqIAlBBHRqIQoLIAIhCSAKIQILIAIhAiAJRQ0ADAILAAsgAEIANwMACyAEQSBqJAAPC0HA2gBB/ztBggNB3x0QpgUAC0GM2wBB/ztBswJB1DoQpgUAC0GM2wBB/ztBswJB1DoQpgUAC0GRxgBB/ztB/AJB8DoQpgUAC78GAgV/An4jAEEQayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EiBiAFQYCAwP8HcSIHGyIFQX1qDgcDAgIAAgIBAgsCQCACKAIEIghBgIDA/wdxDQAgCEEPcUECRw0AAkACQCAHRQ0AQX8hCAwBC0F/IQggBkEGRw0AIAMoAgBBD3YiB0F/IAcgASgCpAEvAQ5JGyEIC0EAIQcCQCAIIgZBAEgNACABKACkASIHIAcoAmBqIAZBBHRqIQcLIAcNACACKAIAIgJBgIACTw0FIAMoAgAhAyAAQQY2AgQgACADQYCAfnEgAnI2AgAMBAsgBUF9ag4HAgEBAQEBAAELIAIpAwAhCSADKQMAIQoCQCABQQdBGBCIASIDDQAgAEIANwMADAMLIAMgCjcDECADIAk3AwggACABQQggAxCcAwwCCyAAIAMpAwA3AwAMAQsgAygCACEHQQAhBQJAIAMoAgRBj4DA/wdxQQNHDQBBACEFIAdBsPl8aiIGQQBIDQAgBkEALwGo1QFODQNBACEFQfDqACAGQQN0aiIGLQADQQFxRQ0AIAYhBSAGLQACDQQLAkAgBSIFRQ0AIAUoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCwJAIAdB//8DSw0AAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcSIGGyIIDgkAAAAAAAIAAgECCyAGDQYgAigCACIDQYCAgIABTw0HIAVB8P8/cQ0IIAAgAyAIQRx0cjYCACAAIAdBBHRBBXI2AgQMAgsgBUHw/z9xDQggACACKAIANgIAIAAgB0EEdEEKcjYCBAwBCyACKQMAIQkgAykDACEKAkAgAUEHQRgQiAEiAw0AIABCADcDAAwBCyADIAo3AxAgAyAJNwMIIAAgAUEIIAMQnAMLIARBEGokAA8LQe0uQf87QegDQfUxEKYFAAtB0xRB/ztB0wNB4jgQpgUAC0H3zgBB/ztB1gNB4jgQpgUAC0HwHUH/O0GDBEH1MRCmBQALQZzQAEH/O0GEBEH1MRCmBQALQdTPAEH/O0GFBEH1MRCmBQALQdTPAEH/O0GLBEH1MRCmBQALLwACQCADQYCABEkNAEHQKUH/O0GUBEGyLRCmBQALIAAgASADQQR0QQlyIAIQnAMLMgEBfyMAQRBrIgQkACAEIAEpAwA3AwggACAEQQhqIAIgA0EAEMMCIQEgBEEQaiQAIAELqQMBA38jAEEwayIFJAAgA0EANgIAIAJCADcDAAJAAkAgBEECTA0AQX8hBgwBCyABKAIAIQcCQAJAAkACQAJAAkBBECABKAIEIgZBD3EgBkGAgMD/B3EbQX1qDggABQEFBQQDAgULIAJCADcDACAHIQYMBQsgAiAHQRx2rUIghiAHQf////8Aca2ENwMAIAZBBHZB//8DcSEGDAQLIAIgB61CgICAgIABhDcDACAGQQR2Qf//A3EhBgwDCyADIAc2AgAgBkEEdkH//wNxIQYMAgsCQCAHDQBBfyEGDAILQX8hBiAHKAIAQYCAgPgAcUGAgIA4Rw0BIAUgBykDEDcDICAAIAVBIGogAiADIARBAWoQwwIhAyACIAcpAwg3AwAgAyEGDAELIAUgASkDADcDGEF/IQYgBUEYahCnAw0AIAUgASkDADcDECAFQShqIAAgBUEQakHYABDEAgJAAkAgBSkDKFBFDQBBfyECDAELIAUgBSkDKDcDCCAAIAVBCGogAiADIARBAWoQwwIhAyACIAEpAwA3AwAgAyECCyACIQYLIAVBMGokACAGC6oCAgJ/AX4jAEEwayIEJAAgBEEgaiADEPsCIAEgBCkDIDcDMCAEIAIpAwAiBjcDGCAEIAY3AyggASAEQRhqQQAQxwIhAyABQgA3AzAgBCAEKQMgNwMQIARBKGogASADIARBEGoQzQJBACEDAkACQAJAIAQoAixBj4DA/wdxQQNHDQBBACEDIAQoAihBsPl8aiIFQQBIDQAgBUEALwGo1QFODQFBACEDQfDqACAFQQN0aiIFLQADQQFxRQ0AIAUhAyAFLQACDQILAkACQCADIgNFDQAgAygCBCEDIAQgAikDADcDCCAAIAEgBEEIaiADEQEADAELIAAgBCkDKDcDAAsgBEEwaiQADwtB0xRB/ztB0wNB4jgQpgUAC0H3zgBB/ztB1gNB4jgQpgUAC/0CAQd/IAAoArQBIAFBDGxqKAIEIgIhAwJAIAINAAJAIABBCUEQEIgBIgQNAEEADwsCQAJAIAFBgIACSQ0AQQAhAyABQYCAfmoiBSAAKAKkASICLwEOTw0BIAIgAigCYGogBUEEdGohAwwBCwJAIAAoAKQBIgJBPGooAgBBA3YgAUsNAEEAIQMMAQtBACEDIAIvAQ4iBkUNACACIAIoAjhqIAFBA3RqKAIAIQMgAiACKAJgaiEHQQAhBQJAA0AgByAFIghBBHRqIgUgAiAFKAIEIgIgA0YbIQUgAiADRg0BIAUhAiAIQQFqIgghBSAIIAZHDQALQQAhAwwBCyAFIQMLIAQgAzYCBAJAIAAoAKQBQTxqKAIAQQhJDQAgACgCtAEiAiABQQxsaigCACgCCCEFQQAhAQNAAkAgAiABIgFBDGxqIgMoAgAoAgggBUcNACADIAQ2AgQLIAFBAWoiAyEBIAMgACgApAFBPGooAgBBA3ZJDQALCyAEIQMLIAMLYwEBfyMAQRBrIgIkACACIAEpAwA3AwgCQCAAIAJBCGpBARDHAiIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB1tcAQf87QYwGQZELEKYFAAsgAEIANwMwIAJBEGokACABC6IIAgZ/AX4jAEHQAGsiAyQAIAMgASkDADcDOAJAAkACQAJAIANBOGoQqANFDQAgAyABKQMAIgk3AyggAyAJNwNAQcknQdEnIAJBAXEbIQIgACADQShqEOwCEK8FIQECQAJAIAApADBCAFINACADIAI2AgAgAyABNgIEIANByABqIABBtxcgAxCLAwwBCyADIABBMGopAwA3AyAgACADQSBqEOwCIQQgAyACNgIQIAMgBDYCFCADIAE2AhggA0HIAGogAEHHFyADQRBqEIsDCyABECJBACEBDAELAkACQAJAAkBBECABKAIEIgRBD3EiBSAEQYCAwP8HcSIEG0F+ag4HAQICAgACAwILIAEoAgAhBgJAAkAgASgCBEGPgMD/B3FBBkYNAEEBIQFBACEHDAELAkAgBkEPdiAAKAKkASIILwEOTw0AQQEhAUEAIQcgCA0BCyAGQf//AXFB//8BRiEBIAggCCgCYGogBkENdkH8/x9xaiEHCyAHIQcCQAJAIAFFDQACQCAERQ0AQSchAQwCCwJAIAVBBkYNAEEnIQEMAgtBJyEBIAZBD3YgACgCpAEvAQ5PDQFBJUEnIAAoAKQBGyEBDAELIAcvAQIiAUGAoAJPDQVBhwIgAUEMdiIBdkEBcUUNBSABQQJ0QbjhAGooAgAhAQsgACABIAIQyAIhAQwDCyAAKAK0ASABKAIAIgVBDGxqKAIIIQQCQCACQQJxRQ0AIAQhAQwDCyAEIQEgBA0CAkAgACAFEMUCIgENAEEAIQEMAwsCQCACQQFxDQAgASEBDAMLIAAgARCPASEBIAAoArQBIAVBDGxqIAE2AgggASEBDAILIAMgASkDADcDMAJAIAAgA0EwahCmAyIEQQJHDQAgASgCBA0AAkAgASgCAEGgf2oiBkEnSw0AIAAgBiACQQRyEMgCIQULIAUhASAGQShJDQILQQAhAQJAIARBC0oNACAEQarhAGotAAAhAQsgASIBRQ0DIAAgASACEMgCIQEMAQsCQAJAIAEoAgAiBA0AQQAhBQwBCyAELQADQQ9xIQULIAQhAQJAAkACQAJAAkACQAJAIAVBfWoOCgAHBQIDBAcEAQIECyAEQQRqIQFBBCEEDAULIARBGGohAUEUIQQMBAsgAEEIIAIQyAIhAQwECyAAQRAgAhDIAiEBDAMLQf87QfgFQd41EKEFAAsgBEEIaiEBQQYhBAsgBCEFIAEiBigCACIEIQECQCAEDQBBACEBIAJBAXFFDQAgBiAAIAAgBRCsAhCPASIENgIAIAQhASAEDQBBACEBDAELIAEhBAJAIAJBAnFFDQAgBCEBDAELIAQhASAEDQAgACAFEKwCIQELIANB0ABqJAAgAQ8LQf87QbYFQd41EKEFAAtBhtQAQf87QdcFQd41EKYFAAuvAwEBfyMAQeAAayIDJAACQAJAIAJBBnFBAkYNACAAIAEQrAIhAQJAIAJBAXENACABIQIMAgsCQAJAIAJBBHFFDQACQCABQcDlAGtBDG1BJ0sNAEGlExCvBSECAkAgACkAMEIAUg0AIANBySc2AjAgAyACNgI0IANB2ABqIABBtxcgA0EwahCLAyACIQIMAwsgAyAAQTBqKQMANwNQIAAgA0HQAGoQ7AIhASADQcknNgJAIAMgATYCRCADIAI2AkggA0HYAGogAEHHFyADQcAAahCLAyACIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACyABIQICQCAAQXxqDgYEAAAAAAQAC0Hj1wBB/ztB7gRBwiAQpgUAC0GmKxCvBSECAkACQCAAKQAwQgBSDQAgA0HJJzYCACADIAI2AgQgA0HYAGogAEG3FyADEIsDDAELIAMgAEEwaikDADcDKCAAIANBKGoQ7AIhASADQcknNgIQIAMgATYCFCADIAI2AhggA0HYAGogAEHHFyADQRBqEIsDCyACIQILIAIQIgtBACECCyADQeAAaiQAIAILNQEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqQQAQxwIhASAAQgA3AzAgAkEQaiQAIAELNQEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqQQIQxwIhASAAQgA3AzAgAkEQaiQAIAELqQIBAn8CQAJAIAFBwOUAa0EMbUEnSw0AIAEoAgQhAgwBCwJAAkAgASAAKACkASICIAIoAmBqayACLwEOQQR0Tw0AAkAgACgCuAENACAAQSAQiQEhAiAAQQg6AEQgACACNgK4ASACDQBBACECDAMLIAAoArgBKAIUIgMhAiADDQIgAEEJQRAQiAEiAg0BQQAhAgwCCwJAAkAgAQ0AQQAhAAwBCyABLQADQQ9xIQALAkACQCAAQXxqDgYBAAAAAAEAC0Gh2ABB/ztBpQZBkSAQpgUACyABKAIEDwsgACgCuAEgAjYCFCACQcDlAEGoAWpBAEHA5QBBsAFqKAIAGzYCBCACIQILQQAgAiIAQcDlAEEYakEAQcDlAEEgaigCABsgABsiACAAIAFGGwuiAQIBfwF+IwBBIGsiAiQAIAIgASkDADcDCCACQRBqIAAgAkEIakE0EMQCAkACQCACKQMQQgBSDQBBACEBIAAtAEUNASACQRhqIABBxC1BABCLA0EAIQEMAQsgAiACKQMQIgM3AxggAiADNwMAIAAgAkECEMcCIQEgAEIANwMwAkAgAQ0AIAJBGGogAEHSLUEAEIsDCyABIQELIAJBIGokACABC/wIAgd/AX4jAEHAAGsiBCQAQcDlAEGoAWpBAEHA5QBBsAFqKAIAGyEFQQAhBiACIQICQAJAAkACQANAIAYhBwJAIAIiCA0AIAchBwwCCwJAAkAgCEHA5QBrQQxtQSdLDQAgBCADKQMANwMwIAghBiAIKAIAQYCAgPgAcUGAgID4AEcNBAJAAkADQCAGIglFDQEgCSgCCCEGAkACQAJAAkAgBCgCNCICQYCAwP8HcQ0AIAJBD3FBBEcNACAEKAIwIgJBgIB/cUGAgAFHDQAgBi8BACIHRQ0BIAJB//8AcSEKIAchAiAGIQYDQCAGIQYCQCAKIAJB//8DcUcNACAGLwECIgYhAgJAIAZBJ0sNAAJAIAEgAhCsAiICQcDlAGtBDG1BJ0sNACAEQQA2AiQgBCAGQeAAajYCICAJIQZBAA0IDAoLIARBIGogAUEIIAIQnAMgCSEGQQANBwwJCyAGQc+GA00NDiAEIAI2AiAgBEEDNgIkIAkhBkEADQYMCAsgBi8BBCIHIQIgBkEEaiEGIAcNAAwCCwALIAQgBCkDMDcDCCABIARBCGogBEE8ahD6AiEKIAQoAjwgChDzBUcNASAGLwEAIgchAiAGIQYgB0UNAANAIAYhBgJAIAJB//8DcRC5AyAKEPIFDQAgBi8BAiIGIQICQCAGQSdLDQACQCABIAIQrAIiAkHA5QBrQQxtQSdLDQAgBEEANgIkIAQgBkHgAGo2AiAMBgsgBEEgaiABQQggAhCcAwwFCyAGQc+GA00NDiAEIAI2AiAgBEEDNgIkDAQLIAYvAQQiByECIAZBBGohBiAHDQALCyAJKAIEIQZBAQ0CDAQLIARCADcDIAsgCSEGQQANAAwCCwALIARCADcDIAsgBCAEKQMgNwMoIARBKGohBiAIIQJBASEKDAELAkAgCCABKACkASIGIAYoAmBqayAGLwEOQQR0Tw0AIAQgAykDADcDECAEQTBqIAEgCCAEQRBqEL8CIAQgBCkDMCILNwMoAkAgC0IAUQ0AIARBKGohBiAIIQJBASEKDAILAkAgASgCuAENACABQSAQiQEhBiABQQg6AEQgASAGNgK4ASAGDQAgByEGQQAhAkEAIQoMAgsCQCABKAK4ASgCFCICRQ0AIAchBiACIQJBACEKDAILAkAgAUEJQRAQiAEiAg0AIAchBkEAIQJBACEKDAILIAEoArgBIAI2AhQgAiAFNgIEIAchBiACIQJBACEKDAELAkACQCAILQADQQ9xQXxqDgYBAAAAAAEAC0Hy1wBB/ztB5gZB3DEQpgUACyAEIAMpAwA3AxgCQCABIAggBEEYahCvAiIGRQ0AIAYhBiAIIQJBASEKDAELQQAhBiAIKAIEIQJBACEKCyAGIgchBiACIQIgByEHIApFDQALCwJAAkAgByIGDQBCACELDAELIAYpAwAhCwsgACALNwMAIARBwABqJAAPC0GF2ABB/ztBnwNBzR0QpgUAC0H6yABB/ztBPUHTKxCmBQALQfrIAEH/O0E9QdMrEKYFAAvsAQIDfwF+IwBBIGsiAyQAAkACQCACDQBBACEEDAELIAMgASkDADcDEEEAIQQgA0EQahCnAw0AIAMgASkDACIGNwMIIAMgBjcDGCAAIANBCGpBABDHAiEEIABCADcDMCADIAEpAwAiBjcDACADIAY3AxggACADQQIQxwIhBSAAQgA3AzBBACEBAkAgBEUNAAJAIAQgBUYNACAEIQEMAQsgACAEEMsCIQELQQAhBCABIgFFDQAgASEBA0ACQCABIgEgAkYiBEUNACAEIQQMAgsgACABEMsCIgUhASAEIQQgBQ0ACwsgA0EgaiQAIAQLiAECAn8BfiMAQTBrIgQkACABIAMpAwA3AzAgBCACKQMAIgY3AyAgBCAGNwMoIAEgBEEgakEAEMcCIQUgAUIANwMwIAQgAykDADcDGCAEQShqIAEgBSAEQRhqEM0CIAQgAikDADcDECAEIAQpAyg3AwggACABIARBEGogBEEIahDAAiAEQTBqJAALnQIBAn8jAEEwayIEJAACQAJAIANBgcADSQ0AIABCADcDAAwBCyAEIAIpAwA3AyACQCABIARBIGogBEEsahCjAyIFRQ0AIAQoAiwgA00NACAEIAIpAwA3AxACQCABIARBEGoQ9wJFDQAgBCACKQMANwMIAkAgASAEQQhqIAMQkgMiA0F/Sg0AIABCADcDAAwDCyAFIANqIQMgACABQQggASADIAMQlQMQlgEQnAMMAgsgACAFIANqLQAAEJoDDAELIAQgAikDADcDGAJAIAEgBEEYahCkAyIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBMGokAAu+BAIBfwJ+IwBBsAFrIgQkACAEIAMpAwA3A5ABAkACQCAEQZABahD4AkUNACAEIAIpAwAiBTcDiAEgBCAFNwOoAQJAIAEgBEGIAWoQpQMNACAEIAQpA6gBNwOAASABIARBgAFqEKADDQAgBCAEKQOoATcDeCABIARB+ABqEPcCRQ0BCyAEIAMpAwA3AxAgASAEQRBqEJ4DIQMgBCACKQMANwMIIAAgASAEQQhqIAMQ0AIMAQsgBCADKQMANwNwAkAgASAEQfAAahD3AkUNACAEIAMpAwAiBjcDoAEgBCACKQMAIgU3A5gBIAEgBjcDMCAEIAU3AzAgBCAFNwOoASABIARBMGpBABDHAiEDIAFCADcDMCAEIAQpA6ABNwMoIARBqAFqIAEgAyAEQShqEM0CIAQgBCkDmAE3AyAgBCAEKQOoATcDGCAAIAEgBEEgaiAEQRhqEMACDAELIAQgAykDADcDaCAEQagBaiABIARB6ABqEP8CIAMgBCkDqAE3AwAgBCADKQMANwNgIAEgBEHgAGoQjQEgBCADKQMAIgY3A6ABIAQgAikDACIFNwOYASABIAY3AzAgBCAFNwNYIAQgBTcDqAEgASAEQdgAakEAEMcCIQIgAUIANwMwIAQgBCkDoAE3A1AgBEGoAWogASACIARB0ABqEM0CIAQgBCkDmAE3A0ggBCAEKQOoATcDQCAAIAEgBEHIAGogBEHAAGoQwAIgBCADKQMANwM4IAEgBEE4ahCOAQsgBEGwAWokAAvxAwIBfwF+IwBBkAFrIgQkACAEIAIpAwA3A4ABAkACQCAEQYABahD4AkUNACAEIAEpAwAiBTcDeCAEIAU3A4gBAkAgACAEQfgAahClAw0AIAQgBCkDiAE3A3AgACAEQfAAahCgAw0AIAQgBCkDiAE3A2ggACAEQegAahD3AkUNAQsgBCACKQMANwMYIAAgBEEYahCeAyECIAQgASkDADcDECAEIAMpAwA3AwggACAEQRBqIAIgBEEIahDTAgwBCyAAIAIpAwA3AzAgBCABKQMAIgU3A2AgBCAFNwOIAQJAIAAgBEHgAGpBARDHAiIBRQ0AAkACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0HW1wBB/ztBjAZBkQsQpgUACyAAQgA3AzAgAUUNASAEIAIpAwA3A1gCQCAAIARB2ABqEPcCRQ0AIAQgAikDADcDKCAEIAMpAwA3AyAgACABIARBKGogBEEgahCuAgwCCyAEIAIpAwA3A1AgBEGIAWogACAEQdAAahD/AiACIAQpA4gBNwMAIAQgAikDADcDSCAAIARByABqEI0BIAQgAikDADcDQCAEIAMpAwA3AzggACABIARBwABqIARBOGoQrgIgBCACKQMANwMwIAAgBEEwahCOAQwBCyAAQgA3AzALIARBkAFqJAALtQMCBH8BfiMAQdAAayIEJAACQAJAIAJBgcADSQ0AIARByABqIABBDxCQAwwBCyAEIAEpAwA3AzgCQCAAIARBOGoQoQNFDQAgBCABKQMANwMgIAAgBEEgaiAEQcQAahCiAyEBAkAgBCgCRCIFIAJNDQAgBCADKQMANwMIIAEgAmogACAEQQhqEJ4DOgAADAILIAQgAjYCECAEIAU2AhQgBEHIAGogAEHlDCAEQRBqEIwDDAELIAQgASkDADcDMAJAIAAgBEEwahCkAyIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQACQCACQYE4SQ0AIARByABqIABBDxCQAwwCCyADKQMAIQgCQCACQQFqIgEgBS8BCk0NACAAIAFBCmxBA3YiA0EEIANBBEsbIgZBA3QQiQEiA0UNAgJAIAUoAgwiB0UNACADIAcgBS8BCEEDdBDEBRoLIAUgBjsBCiAFIAM2AgwgACgC0AEgAxCKAQsgBSgCDCACQQN0aiAINwMAIAUvAQggAksNASAFIAE7AQgMAQsgBCABKQMANwMoIARByABqIABBDyAEQShqEI4DCyAEQdAAaiQAC70BAQV/IwBBEGsiBCQAAkACQCACQYE4SQ0AIARBCGogAEEPEJADDAELAkAgAkEBaiIFIAEvAQpNDQAgACAFQQpsQQN2IgZBBCAGQQRLGyIHQQN0EIkBIgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQxAUaCyABIAc7AQogASAGNgIMIAAoAtABIAYQigELIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAAL8gECBn8BfiMAQSBrIgMkACADIAIpAwA3AxAgACADQRBqEI0BAkACQCABLwEIIgRBgThJDQAgA0EYaiAAQQ8QkAMMAQsgAikDACEJIARBAWohBQJAIAQgAS8BCkkNACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQiQEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBDEBRoLIAEgBzsBCiABIAY2AgwgACgC0AEgBhCKAQsgASgCDCAEQQN0aiAJNwMAIAEvAQggBEsNACABIAU7AQgLIAMgAikDADcDCCAAIANBCGoQjgEgA0EgaiQACz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB2ABqKQMAIgM3AwAgAiADNwMIIAAgAhCeAyEAIAJBEGokACAAC0ADAX8BfgF8IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEJ0DIQQgAkEQaiQAIAQLLAEBfyMAQRBrIgIkACACQQhqIAEQmQMgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQmgMgACgCrAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQmwMgACgCrAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEJwDIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahCkAyICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB+TNBABCLA0EAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahCmAyEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQShJDQAgAEIANwMADwsCQCABIAIQrAIiA0HA5QBrQQxtQSdLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEJwDC/8BAQJ/IAIhAwNAAkAgAyICQcDlAGtBDG0iA0EnSw0AAkAgASADEKwCIgJBwOUAa0EMbUEnSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhCcAw8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQaHYAEH/O0H3CEHfKxCmBQALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQcDlAGtBDG1BKEkNAQsLIAAgAUEIIAIQnAMLJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyACKQMINwIACyAAIAQ7AeADIAMLwAMBBn8jAEEgayIEJAACQCACRQ0AQQAhBQJAA0ACQCAAIAUiBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIGIQUgBkEURw0AC0EAIQULIAUiBiEFAkAgBg0AIABBACAALwHgAyIFQQFqIAVBEksbQRhsIgZqIgVBFGohBwJAIAUtABRBCkkNACAAIAZqKAIIECILIAdBADoAACAAIAZqQQA7AQIgBSEFCyAFIgVBADsBFiAFIAI7AQIgBSABOwEAIAUgAzoAFAJAIANBCkkNACAFIAMQITYCCAsCQAJAIAAgAC8B4AMiBkEYbGogBUcNACAFIQUMAQsCQCAAQQAgBkEBaiAGQRJLGyIDQRhsaiIGIAVGDQAgBEEIakEQaiICIAVBEGoiASkCADcDACAEQQhqQQhqIgcgBUEIaiIIKQIANwMAIAQgBSkCADcDCCABIAZBEGoiCSkCADcCACAIIAZBCGoiASkCADcCACAFIAYpAgA3AgAgCSACKQMANwIAIAEgBykDADcCACAGIAQpAwg3AgALIAAgAzsB4AMgBiEFCyAEQSBqJAAgBQ8LQZTOAEGfwQBBJUHnORCmBQALeQEFf0EAIQQCQANAIAYhBQJAAkAgACAEIgdBGGwiBmoiBC8BACABRw0AIAAgBmoiCC8BAiACRw0AQQAhBiAEIQQgCC8BFiADRg0BC0EBIQYgBSEECyAEIQQgBkUNASAEIQYgB0EBaiIHIQQgB0EURw0AC0EADwsgBAtGAQJ/QQAhAwNAAkAgACADIgNBGGxqIgQvAQAgAUcNACAEKAIEIAJNDQAgBEEEaiACNgIACyADQQFqIgQhAyAEQRRHDQALC1sBA39BACECA0ACQCAAIAIiA0EYbGoiAi8BACABRw0AIAJBFGohBAJAIAItABRBCkkNACACKAIIECILIARBADoAACACQQA7AQILIANBAWoiAyECIANBFEcNAAsLVQEBfwJAIAJFDQAgAyAAIAMbIgMgAEHgA2oiBE8NACADIQMDQAJAIAMiAy8BAiACRw0AIAMvAQAgAUcNACADDwsgA0EYaiIAIQMgACAESQ0ACwtBAAtdAQN/IwBBIGsiASQAQQAhAgJAIAAgAUEgEOAEIgNBAEgNACADQQFqECEhAgJAAkAgA0EgSg0AIAIgASADEMQFGgwBCyAAIAIgAxDgBBoLIAIhAgsgAUEgaiQAIAILJAEBfwJAAkAgAQ0AQQAhAgwBCyABEPMFIQILIAAgASACEOMEC9ACAQN/IwBB0ABrIgMkACADIAIpAwA3A0ggAyAAIANByABqEOwCNgJEIAMgATYCQEGjGCADQcAAahA8IAEtAAAhASADIAIpAwA3AzgCQAJAIAAgA0E4ahCkAyICDQBBACEEDAELIAItAANBD3EhBAsCQAJAIARBfGoOBgABAQEBAAELIAIvAQhFDQBBICABIAFBKkcbIAEgAUEhRxsgASABQT5HG8AhBEEAIQEDQAJAIAEiAUELRw0AIAMgBDYCAEHq1AAgAxA8DAILIAMgAigCDCABQQR0IgVqKQMANwMwIAMgACADQTBqEOwCNgIkIAMgBDYCIEHAzAAgA0EgahA8IAMgAigCDCAFakEIaikDADcDGCADIAAgA0EYahDsAjYCFCADIAQ2AhBBwBkgA0EQahA8IAFBAWoiBSEBIAUgAi8BCEkNAAsLIANB0ABqJAAL5QMBA38jAEHgAGsiAiQAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDQQpLDQBBASADdEGoDHENASADQQhHDQAgASgCACIDRQ0AIAMoAgBBgICA+ABxQYCAgDhGDQELIAIgASkDADcDCCAAIAJBCGpBABD6AiIEIQMgBA0BIAIgASkDADcDACAAIAIQ7QIhAwwBCyACIAEpAwA3A0AgACACQcAAaiACQdgAaiACQdQAahDCAiEDAkACQCACKQNYUEUNAEEAIQEMAQsgAiACKQNYNwM4AkAgACACQThqEO0CIgFBoOQBRg0AIAIgATYCMEGg5AFBwABBxhkgAkEwahCrBRoLAkBBoOQBEPMFIgFBJ0kNAEEAQQAtAOlUOgCi5AFBAEEALwDnVDsBoOQBQQIhAQwBCyABQaDkAWpBLjoAACABQQFqIQELIAEhAQJAAkAgAigCVCIEDQAgASEBDAELIAJByABqIABBCCAEEJwDIAIgAigCSDYCICABQaDkAWpBwAAgAWtBjgsgAkEgahCrBRpBoOQBEPMFIgFBoOQBakHAADoAACABQQFqIQELIAIgAzYCECABIgFBoOQBakHAACABa0GINyACQRBqEKsFGkGg5AEhAwsgAkHgAGokACADC88GAQN/IwBBkAFrIgIkAAJAAkAgASgCBCIDQX9HDQAgAiABKAIANgIAQaDkAUHAAEHfOCACEKsFGkGg5AEhAwwBC0EAIQQCQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADQQ9xIAFBBmovAQBB8P8BcRsOEQEKBAIDBgULCQgHCwsLCwsACwsgAiABKQMANwMoIAIgACACQShqEJ0DOQMgQaDkAUHAAEGWKiACQSBqEKsFGkGg5AEhAwwLC0GiJCEDAkACQAJAAkACQAJAAkAgASgCACIBDkQAAQURBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGAgYDBAYLQbA1IQMMEAtBoC0hAwwPC0G9KyEDDA4LQYoIIQMMDQtBiQghAwwMC0HQyAAhAwwLCwJAIAFBoH9qIgNBJ0sNACACIAM2AjBBoOQBQcAAQY83IAJBMGoQqwUaQaDkASEDDAsLQe4kIQMgAUGACEkNCiACIAFBD3E2AkQgAiABQYB4akEEdjYCQEGg5AFBwABBogwgAkHAAGoQqwUaQaDkASEDDAoLQZUhIQQMCAtB+ChB0hkgASgCAEGAgAFJGyEEDAcLQYgvIQQMBgtB8xwhBAwFCyACIAEoAgA2AlQgAiADQQR2Qf//A3E2AlBBoOQBQcAAQZAKIAJB0ABqEKsFGkGg5AEhAwwFCyACIAEoAgA2AmQgAiADQQR2Qf//A3E2AmBBoOQBQcAAQeUfIAJB4ABqEKsFGkGg5AEhAwwECyACIAEoAgA2AnQgAiADQQR2Qf//A3E2AnBBoOQBQcAAQdcfIAJB8ABqEKsFGkGg5AEhAwwDCwJAAkAgASgCACIBDQBBfyEEDAELIAEtAANBD3FBf2ohBAtBvMwAIQMCQCAEIgRBC0sNACAEQQJ0QZjxAGooAgAhAwsgAiABNgKEASACIAM2AoABQaDkAUHAAEHRHyACQYABahCrBRpBoOQBIQMMAgtB1MIAIQQLAkAgBCIDDQBBjSwhAwwBCyACIAEoAgA2AhQgAiADNgIQQaDkAUHAAEGADSACQRBqEKsFGkGg5AEhAwsgAkGQAWokACADC+AFAhZ/BH4jAEHgAGsiAkHAAGpBGGogAEEYaikCACIYNwMAIAJBwABqQRBqIABBEGopAgAiGTcDACACIAApAgAiGjcDQCACIABBCGopAgAiGzcDSCABIQNBACEEIAIoAlwhBSAYpyEGIAIoAlQhASAZpyEHIAIoAkwhCCAbpyEJIAIoAkQhCiAapyELA0AgBCIMQQR0IQ0gAyEEQQAhAyAHIQcgASEOIAYhDyAFIRAgCyELIAohESAJIRIgCCETA0AgEyETIBIhCCARIQkgCyEKIBAhECAPIQUgDiEGIAchASADIQMgBCEEAkACQCAMDQAgAiADQQJ0aiAEKAAAIgdBGHQgB0GA/gNxQQh0ciAHQQh2QYD+A3EgB0EYdnJyNgIAIARBBGohBwwBCyACIANBAnRqIg4gAiADQQFqQQ9xQQJ0aigCACIHQRl3IAdBDndzIAdBA3ZzIA4oAgBqIAIgA0EJakEPcUECdGooAgBqIAIgA0EOakEPcUECdGooAgAiB0EPdyAHQQ13cyAHQQp2c2o2AgAgBCEHCyACIAE2AlQgAiAGNgJYIAIgBTYCXCACIBMgAUEadyABQRV3cyABQQd3cyAGIAFxaiAQaiAFIAFBf3NxaiADIA1yQQJ0QdDxAGooAgBqIAIgA0ECdGooAgBqIgRqIhQ2AlAgAiAKNgJEIAIgCTYCSCACIAg2AkwgAiAKQR53IApBE3dzIApBCndzIARqIAggCXMgCnEgCCAJcXNqIhU2AkAgByIWIQQgA0EBaiIXIQMgFCEHIAEhDiAGIQ8gBSEQIBUhCyAKIREgCSESIAghEyAXQRBHDQALIBYhAyAMQQFqIg4hBCAFIQUgBiEGIAEhASAUIQcgCCEIIAkhCSAKIQogFSELIA5BBEcNAAtBACEBA0AgACABIgFBAnQiCmoiAyADKAIAIAJBwABqIApqKAIAajYCACABQQFqIgohASAKQQhHDQALC7QCAQV/IAAoAkghASAAKAJEIgJBgAE6AAAgAEHQAGohAyACQQFqIQICQAJAIAFBf2oiAUEHTQ0AIAEhASACIQIMAQsgAkEAIAEQxgUaIAMgAEEEaiICEO4CQcAAIQEgAiECCyACQQAgAUF4aiIBEMYFIAFqIgQgACgCTCIBQQN0OgAHQQYhAiABQQV2IQUDQCAEIAIiAWogBSIFOgAAIAFBf2ohAiAFQQh2IQUgAQ0ACyADIABBBGoQ7gIgACgCACECQQAhAUEAIQUDQCACIAEiAWogAyAFIgRBAnRqIgUtAAM6AAAgAiABQQFyaiAFLwECOgAAIAIgAUECcmogBSgCAEEIdjoAACACIAFBA3JqIAUoAgA6AAAgAUEEaiEBIARBAWoiBCEFIARBCEcNAAsgACgCAAuRAQAQJAJAQQAtAODkAUUNAEG5wgBBDkG9HRChBQALQQBBAToA4OQBECVBAEKrs4/8kaOz8NsANwLM5QFBAEL/pLmIxZHagpt/NwLE5QFBAELy5rvjo6f9p6V/NwK85QFBAELnzKfQ1tDrs7t/NwK05QFBAELAADcCrOUBQQBB6OQBNgKo5QFBAEHg5QE2AuTkAQv5AQEDfwJAIAFFDQBBAEEAKAKw5QEgAWo2ArDlASABIQEgACEAA0AgACEAIAEhAQJAQQAoAqzlASICQcAARw0AIAFBwABJDQBBtOUBIAAQ7gIgAUFAaiICIQEgAEHAAGohACACDQEMAgtBACgCqOUBIAAgASACIAEgAkkbIgIQxAUaQQBBACgCrOUBIgMgAms2AqzlASAAIAJqIQAgASACayEEAkAgAyACRw0AQbTlAUHo5AEQ7gJBAEHAADYCrOUBQQBB6OQBNgKo5QEgBCEBIAAhACAEDQEMAgtBAEEAKAKo5QEgAmo2AqjlASAEIQEgACEAIAQNAAsLC0wAQeTkARDvAhogAEEYakEAKQP45QE3AAAgAEEQakEAKQPw5QE3AAAgAEEIakEAKQPo5QE3AAAgAEEAKQPg5QE3AABBAEEAOgDg5AEL2wcBA39BAEIANwO45gFBAEIANwOw5gFBAEIANwOo5gFBAEIANwOg5gFBAEIANwOY5gFBAEIANwOQ5gFBAEIANwOI5gFBAEIANwOA5gECQAJAAkACQCABQcEASQ0AECRBAC0A4OQBDQJBAEEBOgDg5AEQJUEAIAE2ArDlAUEAQcAANgKs5QFBAEHo5AE2AqjlAUEAQeDlATYC5OQBQQBCq7OP/JGjs/DbADcCzOUBQQBC/6S5iMWR2oKbfzcCxOUBQQBC8ua746On/aelfzcCvOUBQQBC58yn0NbQ67O7fzcCtOUBIAEhASAAIQACQANAIAAhACABIQECQEEAKAKs5QEiAkHAAEcNACABQcAASQ0AQbTlASAAEO4CIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAqjlASAAIAEgAiABIAJJGyICEMQFGkEAQQAoAqzlASIDIAJrNgKs5QEgACACaiEAIAEgAmshBAJAIAMgAkcNAEG05QFB6OQBEO4CQQBBwAA2AqzlAUEAQejkATYCqOUBIAQhASAAIQAgBA0BDAILQQBBACgCqOUBIAJqNgKo5QEgBCEBIAAhACAEDQALC0Hk5AEQ7wIaQQBBACkD+OUBNwOY5gFBAEEAKQPw5QE3A5DmAUEAQQApA+jlATcDiOYBQQBBACkD4OUBNwOA5gFBAEEAOgDg5AFBACEBDAELQYDmASAAIAEQxAUaQQAhAQsDQCABIgFBgOYBaiIAIAAtAABBNnM6AAAgAUEBaiIAIQEgAEHAAEcNAAwCCwALQbnCAEEOQb0dEKEFAAsQJAJAQQAtAODkAQ0AQQBBAToA4OQBECVBAELAgICA8Mz5hOoANwKw5QFBAEHAADYCrOUBQQBB6OQBNgKo5QFBAEHg5QE2AuTkAUEAQZmag98FNgLQ5QFBAEKM0ZXYubX2wR83AsjlAUEAQrrqv6r6z5SH0QA3AsDlAUEAQoXdntur7ry3PDcCuOUBQcAAIQFBgOYBIQACQANAIAAhACABIQECQEEAKAKs5QEiAkHAAEcNACABQcAASQ0AQbTlASAAEO4CIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAqjlASAAIAEgAiABIAJJGyICEMQFGkEAQQAoAqzlASIDIAJrNgKs5QEgACACaiEAIAEgAmshBAJAIAMgAkcNAEG05QFB6OQBEO4CQQBBwAA2AqzlAUEAQejkATYCqOUBIAQhASAAIQAgBA0BDAILQQBBACgCqOUBIAJqNgKo5QEgBCEBIAAhACAEDQALCw8LQbnCAEEOQb0dEKEFAAv6BgEFf0Hk5AEQ7wIaIABBGGpBACkD+OUBNwAAIABBEGpBACkD8OUBNwAAIABBCGpBACkD6OUBNwAAIABBACkD4OUBNwAAQQBBADoA4OQBECQCQEEALQDg5AENAEEAQQE6AODkARAlQQBCq7OP/JGjs/DbADcCzOUBQQBC/6S5iMWR2oKbfzcCxOUBQQBC8ua746On/aelfzcCvOUBQQBC58yn0NbQ67O7fzcCtOUBQQBCwAA3AqzlAUEAQejkATYCqOUBQQBB4OUBNgLk5AFBACEBA0AgASIBQYDmAWoiAiACLQAAQeoAczoAACABQQFqIgIhASACQcAARw0AC0EAQcAANgKw5QFBwAAhAUGA5gEhAgJAA0AgAiECIAEhAQJAQQAoAqzlASIDQcAARw0AIAFBwABJDQBBtOUBIAIQ7gIgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCqOUBIAIgASADIAEgA0kbIgMQxAUaQQBBACgCrOUBIgQgA2s2AqzlASACIANqIQIgASADayEFAkAgBCADRw0AQbTlAUHo5AEQ7gJBAEHAADYCrOUBQQBB6OQBNgKo5QEgBSEBIAIhAiAFDQEMAgtBAEEAKAKo5QEgA2o2AqjlASAFIQEgAiECIAUNAAsLQQBBACgCsOUBQSBqNgKw5QFBICEBIAAhAgJAA0AgAiECIAEhAQJAQQAoAqzlASIDQcAARw0AIAFBwABJDQBBtOUBIAIQ7gIgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCqOUBIAIgASADIAEgA0kbIgMQxAUaQQBBACgCrOUBIgQgA2s2AqzlASACIANqIQIgASADayEFAkAgBCADRw0AQbTlAUHo5AEQ7gJBAEHAADYCrOUBQQBB6OQBNgKo5QEgBSEBIAIhAiAFDQEMAgtBAEEAKAKo5QEgA2o2AqjlASAFIQEgAiECIAUNAAsLQeTkARDvAhogAEEYakEAKQP45QE3AAAgAEEQakEAKQPw5QE3AAAgAEEIakEAKQPo5QE3AAAgAEEAKQPg5QE3AABBAEIANwOA5gFBAEIANwOI5gFBAEIANwOQ5gFBAEIANwOY5gFBAEIANwOg5gFBAEIANwOo5gFBAEIANwOw5gFBAEIANwO45gFBAEEAOgDg5AEPC0G5wgBBDkG9HRChBQAL7QcBAX8gACABEPMCAkAgA0UNAEEAQQAoArDlASADajYCsOUBIAMhAyACIQEDQCABIQEgAyEDAkBBACgCrOUBIgBBwABHDQAgA0HAAEkNAEG05QEgARDuAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAKo5QEgASADIAAgAyAASRsiABDEBRpBAEEAKAKs5QEiCSAAazYCrOUBIAEgAGohASADIABrIQICQCAJIABHDQBBtOUBQejkARDuAkEAQcAANgKs5QFBAEHo5AE2AqjlASACIQMgASEBIAINAQwCC0EAQQAoAqjlASAAajYCqOUBIAIhAyABIQEgAg0ACwsgCBD0AiAIQSAQ8wICQCAFRQ0AQQBBACgCsOUBIAVqNgKw5QEgBSEDIAQhAQNAIAEhASADIQMCQEEAKAKs5QEiAEHAAEcNACADQcAASQ0AQbTlASABEO4CIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAqjlASABIAMgACADIABJGyIAEMQFGkEAQQAoAqzlASIJIABrNgKs5QEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEG05QFB6OQBEO4CQQBBwAA2AqzlAUEAQejkATYCqOUBIAIhAyABIQEgAg0BDAILQQBBACgCqOUBIABqNgKo5QEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKAKw5QEgB2o2ArDlASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAqzlASIAQcAARw0AIANBwABJDQBBtOUBIAEQ7gIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCqOUBIAEgAyAAIAMgAEkbIgAQxAUaQQBBACgCrOUBIgkgAGs2AqzlASABIABqIQEgAyAAayECAkAgCSAARw0AQbTlAUHo5AEQ7gJBAEHAADYCrOUBQQBB6OQBNgKo5QEgAiEDIAEhASACDQEMAgtBAEEAKAKo5QEgAGo2AqjlASACIQMgASEBIAINAAsLQQBBACgCsOUBQQFqNgKw5QFBASEDQYDdACEBAkADQCABIQEgAyEDAkBBACgCrOUBIgBBwABHDQAgA0HAAEkNAEG05QEgARDuAiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAKo5QEgASADIAAgAyAASRsiABDEBRpBAEEAKAKs5QEiCSAAazYCrOUBIAEgAGohASADIABrIQICQCAJIABHDQBBtOUBQejkARDuAkEAQcAANgKs5QFBAEHo5AE2AqjlASACIQMgASEBIAINAQwCC0EAQQAoAqjlASAAajYCqOUBIAIhAyABIQEgAg0ACwsgCBD0AguSBwIJfwF+IwBBgAFrIggkAEEAIQlBACEKQQAhCwNAIAshDCAKIQpBACENAkAgCSILIAJGDQAgASALai0AACENCyALQQFqIQkCQAJAAkACQAJAIA0iDUH/AXEiDkH7AEcNACAJIAJJDQELIA5B/QBHDQEgCSACTw0BIA0hDiALQQJqIAkgASAJai0AAEH9AEYbIQkMAgsgC0ECaiENAkAgASAJai0AACIJQfsARw0AIAkhDiANIQkMAgsCQAJAIAlBUGpB/wFxQQlLDQAgCcBBUGohCwwBC0F/IQsgCUEgciIJQZ9/akH/AXFBGUsNACAJwEGpf2ohCwsCQCALIg5BAE4NAEEhIQ4gDSEJDAILIA0hCSANIQsCQCANIAJPDQADQAJAIAEgCSIJai0AAEH9AEcNACAJIQsMAgsgCUEBaiILIQkgCyACRw0ACyACIQsLAkACQCANIAsiC0kNAEF/IQkMAQsCQCABIA1qLAAAIg1BUGoiCUH/AXFBCUsNACAJIQkMAQtBfyEJIA1BIHIiDUGff2pB/wFxQRlLDQAgDUGpf2ohCQsgCSEJIAtBAWohDwJAIA4gBkgNAEE/IQ4gDyEJDAILIAggBSAOQQN0aiILKQMAIhE3AyAgCCARNwNwAkACQCAIQSBqEPgCRQ0AIAggCykDADcDCCAIQTBqIAAgCEEIahCdA0EHIAlBAWogCUEASBsQqQUgCCAIQTBqEPMFNgJ8IAhBMGohDgwBCyAIIAgpA3A3AxggCEEoaiAAIAhBGGpBABCLAiAIIAgpAyg3AxAgACAIQRBqIAhB/ABqEPoCIQ4LIAggCCgCfCIQQX9qIgk2AnwgCSENIAohCyAOIQ4gDCEJAkACQCAQDQAgDCELIAohDgwBCwNAIAkhDCANIQogDiIOLQAAIQkCQCALIgsgBE8NACADIAtqIAk6AAALIAggCkF/aiINNgJ8IA0hDSALQQFqIhAhCyAOQQFqIQ4gDCAJQcABcUGAAUdqIgwhCSAKDQALIAwhCyAQIQ4LIA8hCgwCCyANIQ4gCSEJCyAJIQ0gDiEJAkAgCiAETw0AIAMgCmogCToAAAsgDCAJQcABcUGAAUdqIQsgCkEBaiEOIA0hCgsgCiINIQkgDiIOIQogCyIMIQsgDSACTQ0ACwJAIARFDQAgBCADakF/akEAOgAACwJAIAdFDQAgByAMNgIACyAIQYABaiQAIA4LbQECf0EAIQICQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbQXxqDgUBAgICAAILAkACQCABKAIAIgENAEEAIQEMAQsgAS0AA0EPcSEBCyABIgFBBkYgAUEMRnIPCyABKAIAQf//AEshAgsgAgsZACAAKAIEIgBBf0YgAEGAgMD/B3FBAEdyC6sBAQN/IwBBEGsiAiQAQQAhAwJAAkACQEEQIAEoAgQiBEEPcSAEQYCAwP8HcRtBfGoOBQECAgIAAgtBACEDAkAgASgCACIBRQ0AIAEoAgBBgICA+ABxQYCAgOAARiEDCyABQQRqQQAgAxshAwwBC0EAIQMgASgCACIBQYCAA3FBgIADRw0AIAIgACgCpAE2AgwgAkEMaiABQf//AHEQugMhAwsgAkEQaiQAIAML2gEBAn9BACEDAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F8ag4FAQICAgACCwJAIAEoAgAiAQ0AQQAPCwJAIAEoAgBBgICA+ABxQYCAgDBHDQACQCACRQ0AIAIgAS8BBDYCAAsgAUEGag8LAkAgAQ0AQQAPC0EAIQMgASgCAEGAgID4AHFBgICA4ABHDQECQCACRQ0AIAIgAS8BBDYCAAsgASABQQZqLwEAQQN2Qf4/cWpBCGoPC0EAIQMgASgCACIBQYCAAUkNACAAIAEgAhC8AyEDCyADCxUAIABBBDYCBCAAIAFBgIABcjYCAAurAQECfyMAQRBrIgQkACAEIAM2AgwCQCACQe4VEPUFDQAgBCAEKAIMIgM2AghBAEEAIAIgBEEEaiADEKgFIQMgBCAEKAIEQX9qIgU2AgQCQCABIAAgA0F/aiAFEJQBIgVFDQAgBSADIAIgBEEEaiAEKAIIEKgFIQIgBCAEKAIEQX9qIgM2AgQgASAAIAJBf2ogAxCVAQsgBEEQaiQADwtBhz9BzABB/CgQoQUACyYBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQ/AIgBEEQaiQACyUAAkAgASACIAMQlgEiAw0AIABCADcDAA8LIAAgAUEIIAMQnAMLuQwCBH8BfiMAQdACayIDJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAQRAgAigCBCIEQQ9xIARBgIDA/wdxGyIFDhEDBAoFAQcLDAAGBwwMDAwMDQwLAkACQCACKAIAIgYNAEEAIQYMAQsgBi0AA0EPcSEGCyAGIgZBBkYgBkEMRnIhBgwBCyACKAIAQf//AEshBgsCQCAGRQ0AIAAgAikDADcDAAwMCyAFDhEAAQcCBgQICQUDBAkJCQkJCgkLAkACQAJAAkACQAJAAkACQCACKAIAIgIORAECBAAHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcDBwUGBwsgAEKqgIGAwAA3AwAMEQsgAELGgIGAwAA3AwAMEAsgAEKYgIGAwAA3AwAMDwsgAELFgIGAwAA3AwAMDgsgAEKJgIGAwAA3AwAMDQsgAEKEgIGAwAA3AwAMDAsgAEKBgIGAwAA3AwAMCwsCQCACQaB/aiIEQSdLDQAgAyAENgIQIAAgAUH5xAAgA0EQahD9AgwLCwJAIAJBgAhJDQAgAyACNgIgIAAgAUGkwwAgA0EgahD9AgwLC0GHP0GfAUH3JxChBQALIAMgAigCADYCMCAAIAFBsMMAIANBMGoQ/QIMCQsgAigCACECIAMgASgCpAE2AkwgAyADQcwAaiACEHs2AkAgACABQd7DACADQcAAahD9AgwICyADIAEoAqQBNgJcIAMgA0HcAGogBEEEdkH//wNxEHs2AlAgACABQe3DACADQdAAahD9AgwHCyADIAEoAqQBNgJkIAMgA0HkAGogBEEEdkH//wNxEHs2AmAgACABQYbEACADQeAAahD9AgwGCwJAAkAgAigCACIEDQBBACEFDAELIAQtAANBD3EhBQsCQAJAAkACQAJAAkAgBUF9ag4JAAQCBQEFBAQDBQsgAEKPgIGAwAA3AwAMCgsgAEKcgIGAwAA3AwAMCQsgAyACKQMANwNoIAAgASADQegAahCAAwwICyAELwESIQIgAyABKAKkATYCfCADQfwAaiACEHwhAiAELwEQIQUgAyAEKAIcLwEENgJ4IAMgBTYCdCADIAI2AnAgACABQd/EACADQfAAahD9AgwHCyAAQqaAgYDAADcDAAwGC0GHP0HEAUH3JxChBQALIAIoAgBBgIABTw0FIAMgAikDACIHNwOAAiADIAc3A6gBIAEgA0GoAWogA0HMAmoQowMiBEUNBgJAIAMoAswCIgJBIUkNACADIAQ2AogBIANBIDYChAEgAyACNgKAASAAIAFBisUAIANBgAFqEP0CDAULIAMgBDYCmAEgAyACNgKUASADIAI2ApABIAAgAUGwxAAgA0GQAWoQ/QIMBAsgAigCACECIAMgASgCpAE2ArwBIAMgA0G8AWogAhB8NgKwASAAIAFB+8MAIANBsAFqEP0CDAMLIAMgAikDADcD+AECQCABIANB+AFqELoCIgRFDQAgBC8BACECIAMgASgCpAE2AvQBIAMgA0H0AWogAkEAELsDNgLwASAAIAFBk8QAIANB8AFqEP0CDAMLIAMgAikDADcD6AEgAUGkAWohAiABIANB6AFqIANBgAJqELsCIQQCQCADKAKAAiIFQf//AUcNACABIAQQvAIhBSABKACkASIGIAYoAmBqIAVBBHRqLwEAIQUgAyACKAIANgLMASADQcwBaiAFQQAQuwMhBSAELwEAIQQgAyACKAIANgLIASADIANByAFqIARBABC7AzYCxAEgAyAFNgLAASAAIAFBysMAIANBwAFqEP0CDAMLIAMgAigCADYC5AEgA0HkAWogBRB8IQUgBC8BACEEIAMgAigCADYC4AEgAyADQeABaiAEQQAQuwM2AtQBIAMgBTYC0AEgACABQbzDACADQdABahD9AgwCC0GHP0HdAUH3JxChBQALIAMgAikDADcDCCADQYACaiABIANBCGoQnQNBBxCpBSADIANBgAJqNgIAIAAgAUHGGSADEP0CCyADQdACaiQADwtBkdUAQYc/QccBQfcnEKYFAAtB78kAQYc/QfQAQeYnEKYFAAuiAQECfyMAQTBrIgMkACADIAIpAwA3AyACQCABIANBIGogA0EsahCjAyIERQ0AAkACQCADKAIsIgJBIUkNACADIAQ2AgggA0EgNgIEIAMgAjYCACAAIAFBisUAIAMQ/QIMAQsgAyAENgIYIAMgAjYCFCADIAI2AhAgACABQbDEACADQRBqEP0CCyADQTBqJAAPC0HvyQBBhz9B9ABB5icQpgUAC8gCAQJ/IwBB0ABrIgQkACAEIAMpAwA3AzAgACAEQTBqEI0BIAQgAykDADcDSAJAAkACQAJAAkACQEEQIAQoAkwiBUEPcSAFQYCAwP8HcRtBfGoOBQEDAwMAAwsCQAJAIAQoAkgiBQ0AQQAhBQwBCyAFLQADQQ9xIQULIAUiBUEGRiAFQQxGciEFDAELIAQoAkhB//8ASyEFCyAFDQELIAQgBCkDSDcDKCAEQcAAaiAAIARBKGoQ/wIgBCAEKQNANwMgIAAgBEEgahCNASAEIAQpA0g3AxggACAEQRhqEI4BDAELIAQgBCkDSDcDQAsgAyAEKQNANwMAIARBBDYCPCAEIAJBgIABcjYCOCAEIAQpAzg3AxAgBCADKQMANwMIIAAgASAEQRBqIARBCGoQrgIgBCADKQMANwMAIAAgBBCOASAEQdAAaiQAC/sKAgh/An4jAEGQAWsiBCQAIAMpAwAhDCAEIAIpAwAiDTcDcCABIARB8ABqEI0BAkACQCANIAxRIgUNACAEIAMpAwA3A2ggASAEQegAahCNASAEIAIpAwA3A4gBAkACQAJAAkACQAJAQRAgBCgCjAEiBkEPcSAGQYCAwP8HcRtBfGoOBQEDAwMAAwsCQAJAIAQoAogBIgYNAEEAIQYMAQsgBi0AA0EPcSEGCyAGIgZBBkYgBkEMRnIhBgwBCyAEKAKIAUH//wBLIQYLIAYNAQsgBCAEKQOIATcDYCAEQYABaiABIARB4ABqEP8CIAQgBCkDgAE3A1ggASAEQdgAahCNASAEIAQpA4gBNwNQIAEgBEHQAGoQjgEMAQsgBCAEKQOIATcDgAELIAIgBCkDgAE3AwAgBCADKQMANwOIAQJAAkACQAJAAkACQEEQIAQoAowBIgZBD3EgBkGAgMD/B3EbQXxqDgUBAwMDAAMLAkACQCAEKAKIASIGDQBBACEGDAELIAYtAANBD3EhBgsgBiIGQQZGIAZBDEZyIQYMAQsgBCgCiAFB//8ASyEGCyAGDQELIAQgBCkDiAE3A0ggBEGAAWogASAEQcgAahD/AiAEIAQpA4ABNwNAIAEgBEHAAGoQjQEgBCAEKQOIATcDOCABIARBOGoQjgEMAQsgBCAEKQOIATcDgAELIAMgBCkDgAE3AwAMAQsgBCACKQMANwOIAQJAAkACQAJAAkACQEEQIAQoAowBIgZBD3EgBkGAgMD/B3EbQXxqDgUBAwMDAAMLAkACQCAEKAKIASIGDQBBACEGDAELIAYtAANBD3EhBgsgBiIGQQZGIAZBDEZyIQYMAQsgBCgCiAFB//8ASyEGCyAGDQELIAQgBCkDiAE3AzAgBEGAAWogASAEQTBqEP8CIAQgBCkDgAE3AyggASAEQShqEI0BIAQgBCkDiAE3AyAgASAEQSBqEI4BDAELIAQgBCkDiAE3A4ABCyACIAQpA4ABIgw3AwAgAyAMNwMACyACKAIAIQdBACEGAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACC0EAIQYgB0UNAQJAIAcoAgBBgICA+ABxIghBgICA4ABGDQBBACEGIAhBgICAMEcNAiAEIAcvAQQ2AoABIAdBBmohBgwCCyAEIAcvAQQ2AoABIAcgB0EGai8BAEEDdkH+P3FqQQhqIQYMAQtBACEGIAdBgIABSQ0AIAEgByAEQYABahC8AyEGCyAGIQggAygCACEHQQAhBgJAAkACQEEQIAMoAgQiCUEPcSAJQYCAwP8HcRtBfGoOBQECAgIAAgsCQCAHDQBBACEGDAILAkAgBygCAEGAgID4AHEiCUGAgIDgAEYNAEEAIQYgCUGAgIAwRw0CIAQgBy8BBDYCfCAHQQZqIQYMAgsgBCAHLwEENgJ8IAcgB0EGai8BAEEDdkH+P3FqQQhqIQYMAQtBACEGIAdBgIABSQ0AIAEgByAEQfwAahC8AyEGCyAGIQYgBCACKQMANwMYIAEgBEEYahCTAyEHIAQgAykDADcDECABIARBEGoQkwMhCQJAAkACQCAIRQ0AIAYNAQsgBEGIAWogAUH+ABCCASAAQgA3AwAMAQsCQCAEKAKAASIKDQAgACADKQMANwMADAELAkAgBCgCfCILDQAgACACKQMANwMADAELIAEgACALIApqIgogCSAHaiIHEJQBIglFDQAgCSAIIAQoAoABEMQFIAQoAoABaiAGIAQoAnwQxAUaIAEgACAKIAcQlQELIAQgAikDADcDCCABIARBCGoQjgECQCAFDQAgBCADKQMANwMAIAEgBBCOAQsgBEGQAWokAAvNAwEEfyMAQSBrIgUkACACKAIAIQZBACEHAkACQAJAQRAgAigCBCIIQQ9xIAhBgIDA/wdxG0F8ag4FAQICAgACCwJAIAYNAEEAIQcMAgsCQCAGKAIAQYCAgPgAcSIIQYCAgOAARg0AQQAhByAIQYCAgDBHDQIgBSAGLwEENgIcIAZBBmohBwwCCyAFIAYvAQQ2AhwgBiAGQQZqLwEAQQN2Qf4/cWpBCGohBwwBC0EAIQcgBkGAgAFJDQAgASAGIAVBHGoQvAMhBwsCQAJAIAciCA0AIABCADcDAAwBCyAFIAIpAwA3AxACQCABIAVBEGoQkwMiByAEaiIGQQAgBkEAShsgBCAEQQBIGyIEIAcgBCAHSBsiBiAHIANqIgRBACAEQQBKGyADIANBAEgbIgQgByAEIAdIGyIEayIDQQBKDQAgAEKAgIGAwAA3AwAMAQsCQCAEDQAgAyAHRw0AIAAgAikDADcDAAwBCyAFIAIpAwA3AwggASAFQQhqIAQQkgMhByAFIAIpAwA3AwAgASAFIAYQkgMhAiAAIAFBCCABIAggBSgCHCIEIAcgB0EASBsiB2ogBCACIAJBAEgbIAdrEJYBEJwDCyAFQSBqJAALkwEBBH8jAEEQayIDJAACQCACRQ0AQQAhBAJAIAAoAhAiBS0ADiIGRQ0AIAAgBS8BCEEDdGpBGGohBAsgBCEFAkAgBkUNAEEAIQACQANAIAUgACIAQQF0aiIELwEARQ0BIABBAWoiBCEAIAQgBkYNAgwACwALIAQgAjsBAAwBCyADQQhqIAFB+wAQggELIANBEGokAAtiAQN/AkAgACgCECICLQAOIgMNAEEADwsgACACLwEIQQN0akEYaiEEIAMhAANAAkAgACIAQQFODQBBAA8LIABBf2oiAiEAIAQgAkEBdGoiAi8BACIDRQ0ACyACQQA7AQAgAwvAAwEMfyMAQcAAayICJAAgAiABKQMANwMwAkACQCAAIAJBMGoQoAMNACACIAEpAwA3AyggAEGbDyACQShqEOsCDAELIAIgASkDADcDICAAIAJBIGogAkE8ahCiAyEDIAIgAigCPCIBQQF2NgI8IAFBAkkNACAAQaQBaiEEQQAhAANAIAMgACIFQQF0ai8BACEGQQAhAAJAIAQoAAAiB0EkaigCACIBQRBJDQAgAUEEdiIAQQEgAEEBSxshCCAHIAcoAiBqIQlBACEBAkADQCAAIQoCQAJAIAkgASILQQR0aiIMKAIAIg0gBksNAEEAIQAgDCEBIAwoAgQgDWogBk8NAQtBASEAIAohAQsgASEBIABFDQEgASEAIAtBAWoiDCEBIAwgCEcNAAtBACEADAELIAEhAAsCQAJAIAAiAEUNACAHKAIgIQEgAiAEKAIANgIcIAJBHGogACAHIAFqa0EEdSIBEHshDCAAKAIAIQAgAiABNgIUIAIgDDYCECACIAYgAGs2AhhB6tkAIAJBEGoQPAwBCyACIAY2AgBB09kAIAIQPAsgBUEBaiIBIQAgASACKAI8SQ0ACwsgAkHAAGokAAvNAgECfyMAQeAAayICJAAgAkEgNgJAIAIgAEGCAmo2AkRBmx8gAkHAAGoQPCACIAEpAwA3AzhBACEDAkAgACACQThqEN4CRQ0AIAIgASkDADcDMCACQdgAaiAAIAJBMGpB4wAQxAICQAJAIAIpA1hQRQ0AQQAhAwwBCyACIAIpA1g3AyggAEGvISACQShqEOsCQQEhAwsgAyEDIAIgASkDADcDICACQdAAaiAAIAJBIGpB9gAQxAICQAJAIAIpA1BQRQ0AIAMhAwwBCyACIAIpA1A3AxggAEHfLyACQRhqEOsCIAIgASkDADcDECACQcgAaiAAIAJBEGpB8QAQxAICQCACKQNIUA0AIAIgAikDSDcDCCAAIAJBCGoQhgMLIANBAWohAwsgAyEDCwJAIAMNACACIAEpAwA3AwAgAEGvISACEOsCCyACQeAAaiQAC4cEAQZ/IwBB4ABrIgMkAAJAAkAgAC0ARUUNACADIAEpAwA3A0AgAEGtCyADQcAAahDrAgwBCwJAIAAoAqgBDQAgAyABKQMANwNYQZkhQQAQPCAAQQA6AEUgAyADKQNYNwMAIAAgAxCHAyAAQeXUAxB2DAELIABBAToARSAAIAEpAwA3AzggAyABKQMANwM4IAAgA0E4ahDeAiEEIAJBAXENACAERQ0AIAMgASkDADcDMCADQdgAaiAAIANBMGpB8QAQxAIgAykDWEIAUg0AAkACQCAAKAKoASICDQBBACEFDAELIAIhAkEAIQQDQCAEQQFqIgQhBSACKAIMIgYhAiAEIQQgBg0ACwsCQAJAIAAgBSICQRAgAkEQSRsiBUEBdBCSASIHRQ0AAkAgACgCqAEiAkUNACAFRQ0AIAdBDGohCCACIQJBACEEA0AgCCAEIgRBAXRqIAIiAi8BBDsBACACKAIMIgJFDQEgAiECIARBAWoiBiEEIAYgBUkNAAsLIANB0ABqIABBCCAHEJwDDAELIANCADcDUAsgAyADKQNQNwMoIAAgA0EoahCNASADQcgAakHxABD7AiADIAEpAwA3AyAgAyADKQNINwMYIAMgAykDUDcDECAAIANBIGogA0EYaiADQRBqENICIAMgAykDUDcDCCAAIANBCGoQjgELIANB4ABqJAALzwcCDH8BfiMAQRBrIgEkACAAKQM4Ig2nIQICQAJAAkACQCANQiCIpyIDDQAgAkGACEkNACACQQ9xIQQgAkGAeGpBBHYhBQwBCwJAIAAtAEcNAEEAIQRBACEFDAELAkACQCAALQBIRQ0AQQEhBkEAIQcMAQtBASEGQQAhByAALQBJQQNxRQ0AIAAoAqgBIgdBAEchBAJAAkAgBw0AIAQhCAwBCyAEIQQgByEFA0AgBCEJQQAhBwJAIAUiBigCECIELQAOIgVFDQAgBiAELwEIQQN0akEYaiEHCyAHIQggBi8BBCEKAkAgBUUNAEEAIQQgBSEFA0AgBCELAkAgCCAFIgdBf2oiBUEBdGovAQAiBEUNACAGIAQ7AQQgBiAAELADQdIARw0AIAYgCjsBBCAJIQggC0EBcQ0CDAQLIAdBAkghBCAFIQUgB0EBSg0ACwsgBiAKOwEEIAYoAgwiB0EARyIGIQQgByEFIAYhCCAHDQALC0EAIQZBAiEHIAhBAXFFDQAgAC0ASSIHQQJxRSEGIAdBHnRBH3VBA3EhBwtBACEEQQAhBSAHIQcgBkUNAQtBAEEDIAUiChshCUF/QQAgChshDCAEIQcCQANAIAchCyAAKAKoASIIRQ0BAkACQCAKRQ0AIAsNACAIIAo7AQQgCyEHQQMhBAwBCwJAAkAgCCgCECIHLQAOIgQNAEEAIQcMAQsgCCAHLwEIQQN0akEYaiEFIAQhBwNAAkAgByIHQQFODQBBACEHDAILIAdBf2oiBCEHIAUgBEEBdGoiBC8BACIGRQ0ACyAEQQA7AQAgBiEHCwJAIAciBw0AAkAgCkUNACABQQhqIABB/AAQggEgCyEHQQMhBAwCCyAIKAIMIQcgACgCrAEgCBB5AkAgB0UNACALIQdBAiEEDAILIAEgAzYCDCABIAI2AghBmSFBABA8IABBADoARSABIAEpAwg3AwAgACABEIcDIABB5dQDEHYgCyEHQQMhBAwBCyAIIAc7AQQCQAJAAkACQCAIIAAQsANBrn9qDgIAAQILIAsgDGohByAJIQQMAwsgCkUNASABQQhqIAogC0F/ahCsAyAAIAEpAwg3AzggAC0AR0UNASAAKALYASAAKAKoAUcNASAAQQgQtgMMAQsgAUEIaiAAQf0AEIIBIAshB0EDIQQMAQsgCyEHQQMhBAsgByEHIARBA0cNAAsLIABBADoARSAAQQA6AEICQCAAKAKsASIHRQ0AIAcgACkDODcDIAsgAEIANwM4QQghByAALQAHRQ0BCyAAIAcQtgMLIAFBEGokAAuKAQEBfyMAQSBrIgUkAAJAAkAgASABIAIQrAIQjwEiAg0AIABCADcDAAwBCyAAIAFBCCACEJwDIAUgACkDADcDECABIAVBEGoQjQEgBUEYaiABIAMgBBD8AiAFIAUpAxg3AwggASACQfYAIAVBCGoQgQMgBSAAKQMANwMAIAEgBRCOAQsgBUEgaiQAC1MBAX8jAEEgayIEJAAgBCADNgIUIARBGGogAUEeIAIgAxCKAwJAIAQpAxhQDQAgBCAEKQMYNwMIIAEgBEEIakECEIgDCyAAQgA3AwAgBEEgaiQAC1MBAX8jAEEgayIEJAAgBCADNgIUIARBGGogAUEgIAIgAxCKAwJAIAQpAxhQDQAgBCAEKQMYNwMIIAEgBEEIakECEIgDCyAAQgA3AwAgBEEgaiQACygBAX8jAEEQayIDJAAgAyACNgIAIAAgAUGQ1gAgAxCLAyADQRBqJAALUgIBfwF+IwBBIGsiBCQAIAIQuQMhAiAEIAMpAwAiBTcDECAEIAU3AxggBCABIARBEGoQ7AI2AgQgBCACNgIAIAAgAUG7FiAEEIsDIARBIGokAAtAAQF/IwBBEGsiBCQAIAQgAykDADcDCCAEIAEgBEEIahDsAjYCBCAEIAI2AgAgACABQbsWIAQQiwMgBEEQaiQACyoBAX8jAEEQayIDJAAgAyACELkDNgIAIAAgAUHMKCADEIwDIANBEGokAAtTAQF/IwBBIGsiBCQAIAQgAzYCFCAEQRhqIAFBIiACIAMQigMCQCAEKQMYUA0AIAQgBCkDGDcDCCABIARBCGpBAhCIAwsgAEIANwMAIARBIGokAAuKAgEDfyMAQSBrIgMkACADIAEpAwA3AxACQAJAIAAgA0EQahD5AiIERQ0AQX8hASAELwECIgAgAk0NAUEAIQECQCACQRBJDQAgAkEDdkH+////AXEgBGpBAmovAQAhAQsgASEBAkAgAkEPcSICDQAgASEBDAILIAQgAEEDdkH+P3FqQQRqIQAgAiECIAEhBANAIAIhBSAEIQIDQCACQQFqIgEhAiAAIAFqLQAAQcABcUGAAUYNAAsgBUF/aiIFIQIgASEEIAEhASAFRQ0CDAALAAsgAyABKQMANwMIIAAgA0EIaiADQRxqEPoCIQEgAkF/IAMoAhwgAksbQX8gARshAQsgA0EgaiQAIAELZQECfyMAQSBrIgIkACACIAEpAwA3AxACQAJAIAAgAkEQahD5AiIDRQ0AIAMvAQIhAQwBCyACIAEpAwA3AwggACACQQhqIAJBHGoQ+gIhASACKAIcQX8gARshAQsgAkEgaiQAIAEL5gEAAkAgAEH/AEsNACABIAA6AABBAQ8LAkAgAEH/D0sNACABIABBP3FBgAFyOgABIAEgAEEGdkHAAXI6AABBAg8LAkAgAEH//wNLDQAgASAAQT9xQYABcjoAAiABIABBDHZB4AFyOgAAIAEgAEEGdkE/cUGAAXI6AAFBAw8LAkAgAEH//8MASw0AIAEgAEE/cUGAAXI6AAMgASAAQRJ2QfABcjoAACABIABBBnZBP3FBgAFyOgACIAEgAEEMdkE/cUGAAXI6AAFBBA8LIAFBAmpBAC0A0nM6AAAgAUEALwDQczsAAEEDC10BAX9BASEBAkAgACwAACIAQX9KDQBBAiEBIABB/wFxIgBB4AFxQcABRg0AQQMhASAAQfABcUHgAUYNAEEEIQEgAEH4AXFB8AFGDQBBpcIAQdQAQdklEKEFAAsgAQvDAQECfyAALAAAIgFB/wFxIQICQCABQX9MDQAgAg8LAkACQAJAIAJB4AFxQcABRw0AQQEhASACQQZ0QcAPcSECDAELAkAgAkHwAXFB4AFHDQBBAiEBIAAtAAFBP3FBBnQgAkEMdEGA4ANxciECDAELIAJB+AFxQfABRw0BQQMhASAALQABQT9xQQx0IAJBEnRBgIDwAHFyIAAtAAJBP3FBBnRyIQILIAIgACABai0AAEE/cXIPC0GlwgBB5ABB6A8QoQUAC1MBAX8jAEEQayICJAACQCABIAFBBmovAQBBA3ZB/j9xakEIaiABLwEEQQAgAUEEakEGEJgDIgFBf0oNACACQQhqIABBgQEQggELIAJBEGokACABC9IIARB/QQAhBQJAIARBAXFFDQAgAyADLwECQQN2Qf4/cWpBBGohBQsgBSEGIAAgAWohByAEQQhxIQggA0EEaiEJIARBAnEhCiAEQQRxIQsgACEEQQAhAEEAIQUCQANAIAEhDCAFIQ0gACEFAkACQAJAAkAgBCIEIAdPDQBBASEAIAQsAAAiAUF/Sg0BAkACQCABQf8BcSIOQeABcUHAAUcNAAJAIAcgBGtBAU4NAEEBIQ8MAgtBASEPIAQtAAFBwAFxQYABRw0BQQIhAEECIQ8gAUF+cUFARw0DDAELAkACQCAOQfABcUHgAUcNAAJAIAcgBGsiAEEBTg0AQQEhDwwDC0EBIQ8gBC0AASIQQcABcUGAAUcNAgJAIABBAk4NAEECIQ8MAwtBAiEPIAQtAAIiDkHAAXFBgAFHDQIgEEHgAXEhAAJAIAFBYEcNACAAQYABRw0AQQMhDwwDCwJAIAFBbUcNAEEDIQ8gAEGgAUYNAwsCQCABQW9GDQBBAyEADAULIBBBvwFGDQFBAyEADAQLQQEhDyAOQfgBcUHwAUcNAQJAAkAgByAERw0AQQAhEUEBIQ8MAQsgByAEayESQQEhE0EAIRQDQCAUIQ8CQCAEIBMiAGotAABBwAFxQYABRg0AIA8hESAAIQ8MAgsgAEECSyEPAkAgAEEBaiIQQQRGDQAgECETIA8hFCAPIREgECEPIBIgAE0NAgwBCwsgDyERQQEhDwsgDyEPIBFBAXFFDQECQAJAAkAgDkGQfmoOBQACAgIBAgtBBCEPIAQtAAFB8AFxQYABRg0DIAFBdEcNAQsCQCAELQABQY8BTQ0AQQQhDwwDC0EEIQBBBCEPIAFBdE0NBAwCC0EEIQBBBCEPIAFBdEsNAQwDC0EDIQBBAyEPIA5B/gFxQb4BRw0CCyAEIA9qIQQCQCALRQ0AIAQhBCAFIQAgDSEFQQAhDUF+IQEMBAsgBCEAQQMhAUHQ8wAhBAwCCwJAIANFDQACQCANIAMvAQIiBEYNAEF9DwtBfSEPIAUgAy8BACIARw0FQXwhDyADIARBA3ZB/j9xaiAAakEEai0AAA0FCwJAIAJFDQAgAiANNgIACyAFIQ8MBAsgBCAAIgFqIQAgASEBIAQhBAsgBCEPIAEhASAAIRBBACEEAkAgBkUNAANAIAYgBCIEIAVqaiAPIARqLQAAOgAAIARBAWoiACEEIAAgAUcNAAsLIAEgBWohAAJAAkAgDUEPcUEPRg0AIAwhAQwBCyANQQR2IQQCQAJAAkAgCkUNACAJIARBAXRqIAA7AQAMAQsgCEUNACAAIAMgBEEBdGpBBGovAQBGDQBBACEEQX8hBQwBC0EBIQQgDCEFCyAFIg8hASAEDQAgECEEIAAhACANIQVBACENIA8hAQwBCyAQIQQgACEAIA1BAWohBUEBIQ0gASEBCyAEIQQgACEAIAUhBSABIg8hASAPIQ8gDQ0ACwsgDwvDAgIBfgR/AkACQAJAAkAgARDCBQ4EAAECAgMLIABCAjcDAA8LAkAgAUQAAAAAAAAAAGRFDQAgAELCADcDAA8LIABCwwA3AwAPCyAAQoCAgIBwNwMADwsCQCABvSICQiCIpyIDIAKnIgRyDQAgAEKAgICAcDcDAA8LAkAgA0EUdkH/D3EiBUH/B0kNAAJAAkAgBUGTCEsNACAEDQICQCAFQZMIRg0AIANB//8/cSAFQY14anQNAwsgA0H//z9xQYCAwAByQZMIIAVrdiEDDAELAkAgBUGeCEkNACAEDQIgA0GAgICPfEcNAiAAQoCAgIB4NwMADwsgBCAFQe13aiIGdA0BIANB//8/cUGAgMAAciAGdCAEQbMIIAVrdnIhAwsgAEF/NgIEIABBACADIgNrIAMgAkIAUxs2AgAPCyAAIAE5AwALEAAgACABNgIAIABBfzYCBAsPACAAQsAAQgEgARs3AwALQwACQCADDQAgAEIANwMADwsCQCACQQhxRQ0AIAEgAxCaASAAIAM2AgAgACACNgIEDwtB39gAQeo/QdsAQaobEKYFAAuVAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAIAMNAAJAAkACQAJAAkAgASgCACIBQUBqDgQBBAIDAAtEAAAAAAAAAAAhBCABQX9qDgMFAwUDC0QAAAAAAADwPyEEDAQLRAAAAAAAAPB/IQQMAwtEAAAAAAAA8P8hBAwCC0QAAAAAAAD4fyEEDAELIAIgASkDADcDEAJAIAAgAkEQahD3AkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQ+gIiASACQRhqEIkGIQQgASACKAIYRw0BC0QAAAAAAAD4fyEECyACQSBqJAAgBAvWAQIBfwF8IwBBEGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDCEEAIQEgACACQQhqEJ0DIgO9Qv///////////wCDQoCAgICAgID4/wBWDQACQAJAIAOdRAAAAAAAAPBBEMoFIgNEAAAAAAAA8EGgIAMgA0QAAAAAAAAAAGMbIgNEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQuwAQEBfyMAQSBrIgIkAAJAAkACQAJAIAEoAgRBAWoOAgABAgsgASgCAEEARyEBDAILIAEoAgBBP0shAQwBCyACIAEpAwA3AxACQCAAIAJBEGoQ9wJFDQAgAiABKQMANwMIIAAgAkEIaiACQRxqEPoCGiACKAIcQQBHIQEMAQsCQCABQQZqLwEAQfD/AXENAEEBIQEMAQsgASsDAEQAAAAAAAAAAGEhAQsgAkEgaiQAIAELYQECf0EAIQICQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbQXxqDgUBAgICAAILQQAhAiABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYPCyABKAIAQYCAAUkhAgsgAgtsAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiA0F8ag4FAQICAgACC0EAIQIgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgChGIQIMAQsgASgCAEGAgAFJIQILIANBBEcgAnELxgEBAn8CQAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiBEF8ag4FAQMDAwADCyABKAIAIgNFDQIgAygCAEGAgID4AHFBgICAKEYhAwwBCyABKAIAQYCAAUkhAwsgA0UNAAJAAkACQCAEQXxqDgUCAQEBAAELIAEoAgAhAQJAIAJFDQAgAiABLwEENgIACyABQQxqDwtB6j9B0QFB7sIAEKEFAAsgACABKAIAIAIQvAMPC0Gt1QBB6j9BwwFB7sIAEKYFAAvdAQECfyMAQSBrIgMkAAJAAkACQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQXxqDgUBAwMDAAMLIAEoAgAiBEUNAiAEKAIAQYCAgPgAcUGAgIAoRiEEDAELIAEoAgBBgIABSSEECyAERQ0AIAMgASkDADcDGCAAIANBGGogAhCiAyEBDAELIAMgASkDADcDEAJAIAAgA0EQahD3AkUNACADIAEpAwA3AwggACADQQhqIAIQ+gIhAQwBCwJAIAINAEEAIQEMAQsgAkEANgIAQQAhAQsgA0EgaiQAIAELIwBBACABKAIAQQAgASgCBCIBQQ9xQQhGGyABQYCAwP8HcRsLUgEBfwJAIAEoAgQiAkGAgMD/B3FFDQBBAA8LAkAgAkEPcUEIRg0AQQAPC0EAIQICQCABKAIAIgFFDQAgASgCAEGAgID4AHFBgICAGEYhAgsgAgvEAwEDfyMAQRBrIgIkAAJAAkAgASgCBCIDQX9HDQBBASEEDAELQQEhBAJAAkACQAJAAkACQAJAAkACQEEQIANBD3EgAUEGai8BAEHw/wFxGw4RAAEGAgQCBQcDAgIHBwcHBwkHC0EMIQQCQAJAAkACQCABKAIAIgEORAABAgwDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMBAwICAwtBACEEDAsLQQYhBAwKC0EBIQQMCQtBAiEEIAFBoH9qQShJDQhBCyEEIAFB/wdLDQhB6j9BiAJBkSkQoQUAC0EHIQQMBwtBCCEEDAYLAkACQCABKAIAIgENAEF9IQEMAQsgAS0AA0EPcUF9aiEBCyABIgFBCkkNBEHqP0GmAkGRKRChBQALQQRBCSABKAIAQYCAAUkbIQQMBAsgAiABKQMANwMIQQIhBCAAIAJBCGoQugINAyACIAEpAwA3AwBBCEECIAAgAkEAELsCLwECQYAgSRshBAwDC0EFIQQMAgtB6j9BtQJBkSkQoQUACyABQQJ0QYj0AGooAgAhBAsgAkEQaiQAIAQLEQAgACgCBEUgACgCAEEESXELJAEBf0EAIQECQCAAKAIEDQAgACgCACIARSAAQQNGciEBCyABC2sBAn8jAEEQayIDJAACQAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEKoDIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqEPcCDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqEPcCRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahD6AiECIAMgAykDMDcDCCAAIANBCGogA0E4ahD6AiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEN4FRSEBCyABIQELIAEhBAsgA0HAAGokACAEC90BAgJ/An4jAEHAAGsiAyQAIANBIGogAhD7AiADIAMpAyAiBTcDMCADIAEpAwAiBjcDKEEBIQICQCAGIAVRDQAgAyADKQMoNwMYAkAgACADQRhqEPcCDQBBACECDAELIAMgAykDMDcDEEEAIQIgACADQRBqEPcCRQ0AIAMgAykDKDcDCCAAIANBCGogA0E8ahD6AiEBIAMgAykDMDcDACAAIAMgA0E4ahD6AiEAQQAhAgJAIAMoAjwiBCADKAI4Rw0AIAEgACAEEN4FRSECCyACIQILIANBwABqJAAgAgtZAAJAAkAgAkEQTw0AIAFFDQEgAUGAgIAITg0BIABBADYCBCAAIAFBBHQgAnJBgAhqNgIADwtBv8UAQeo/Qf4CQfk4EKYFAAtB58UAQeo/Qf8CQfk4EKYFAAuMAQEBf0EAIQICQCABQf//A0sNAEGpASECAkACQAJAAkACQAJAIAFBDnYOBAMFAAECCyAAKAIAQcQAaiECQQEhAAwDCyAAKAIAQcwAaiECQQIhAAwCC0GaO0E5QfckEKEFAAsgACgCAEHUAGohAkEDIQALIAIoAgAgAHYhAgsgAUH//wBxIAJJIQILIAILbgECfyMAQSBrIgEkACAAKAAIIQAQkgUhAiABQRhqIABB//8DcTYCACABQRBqIABBGHY2AgAgAUEUaiAAQRB2Qf8BcTYCACABQQA2AgwgAUKCgICA0AA3AgQgASACNgIAQZ43IAEQPCABQSBqJAAL7SICDH8BfiMAQaAEayICJAACQAJAAkAgAEEDcQ0AAkAgAUHwAE0NACACIAA2ApgEAkACQCAAKAIAQcTK2ZsFRw0AIAAoAgRBityliX9GDQELIAJC6Ac3A4AEQbMKIAJBgARqEDxBmHghAAwECwJAIABBCmovAQBBEHRBgICUEEYNAEGIJ0EAEDwgACgACCEAEJIFIQEgAkHgA2pBGGogAEH//wNxNgIAIAJB4ANqQRBqIABBGHY2AgAgAkH0A2ogAEEQdkH/AXE2AgAgAkEANgLsAyACQoKAgIDQADcC5AMgAiABNgLgA0GeNyACQeADahA8IAJCmgg3A9ADQbMKIAJB0ANqEDxB5nchAAwEC0EAIQMgAEEgaiEEQQAhBQNAIAUhBSADIQYCQAJAAkAgBCIEKAIAIgMgAU0NAEHpByEFQZd4IQMMAQsCQCAEKAIEIgcgA2ogAU0NAEHqByEFQZZ4IQMMAQsCQCADQQNxRQ0AQesHIQVBlXghAwwBCwJAIAdBA3FFDQBB7AchBUGUeCEDDAELIAVFDQEgBEF4aiIHQQRqKAIAIAcoAgBqIANGDQFB8gchBUGOeCEDCyACIAU2AsADIAIgBCAAazYCxANBswogAkHAA2oQPCAGIQcgAyEIDAQLIAVBCEsiByEDIARBCGohBCAFQQFqIgYhBSAHIQcgBkEKRw0ADAMLAAtBp9YAQZo7QckAQawIEKYFAAtBiNEAQZo7QcgAQawIEKYFAAsgCCEFAkAgB0EBcQ0AIAUhAAwBCwJAIABBNGotAABBB3FFDQAgAkLzh4CAgAY3A7ADQbMKIAJBsANqEDxBjXghAAwBCyAAIAAoAjBqIgQgBCAAKAI0aiIDSSEHAkACQCAEIANJDQAgByEDIAUhBwwBCyAHIQYgBSEIIAQhCQNAIAghBSAGIQMCQAJAIAkiBikDACIOQv////9vWA0AQQshBCAFIQUMAQsCQAJAIA5C////////////AINCgICAgICAgPj/AFgNAEGTCCEFQe13IQcMAQsgAkGQBGogDr8QmQNBACEEIAUhBSACKQOQBCAOUQ0BQZQIIQVB7HchBwsgAkEwNgKkAyACIAU2AqADQbMKIAJBoANqEDxBASEEIAchBQsgAyEDIAUiBSEHAkAgBA4MAAICAgICAgICAgIAAgsgBkEIaiIDIAAgACgCMGogACgCNGpJIgQhBiAFIQggAyEJIAQhAyAFIQcgBA0ACwsgByEFAkAgA0EBcUUNACAFIQAMAQsCQCAAQSRqKAIAQYDqMEkNACACQqOIgICABjcDkANBswogAkGQA2oQPEHddyEADAELIAAgACgCIGoiBCAEIAAoAiRqIgNJIQcCQAJAIAQgA0kNACAHIQRBMCEBIAUhBQwBCwJAAkACQAJAIAQvAQggBC0ACk8NACAHIQpBMCELDAELIARBCmohCCAEIQQgACgCKCEGIAUhCSAHIQMDQCADIQwgCSENIAYhBiAIIQogBCIFIABrIQkCQCAFKAIAIgQgAU0NACACIAk2AuQBIAJB6Qc2AuABQbMKIAJB4AFqEDwgDCEEIAkhAUGXeCEFDAULAkAgBSgCBCIDIARqIgcgAU0NACACIAk2AvQBIAJB6gc2AvABQbMKIAJB8AFqEDwgDCEEIAkhAUGWeCEFDAULAkAgBEEDcUUNACACIAk2AoQDIAJB6wc2AoADQbMKIAJBgANqEDwgDCEEIAkhAUGVeCEFDAULAkAgA0EDcUUNACACIAk2AvQCIAJB7Ac2AvACQbMKIAJB8AJqEDwgDCEEIAkhAUGUeCEFDAULAkACQCAAKAIoIgggBEsNACAEIAAoAiwgCGoiC00NAQsgAiAJNgKEAiACQf0HNgKAAkGzCiACQYACahA8IAwhBCAJIQFBg3ghBQwFCwJAAkAgCCAHSw0AIAcgC00NAQsgAiAJNgKUAiACQf0HNgKQAkGzCiACQZACahA8IAwhBCAJIQFBg3ghBQwFCwJAIAQgBkYNACACIAk2AuQCIAJB/Ac2AuACQbMKIAJB4AJqEDwgDCEEIAkhAUGEeCEFDAULAkAgAyAGaiIHQYCABEkNACACIAk2AtQCIAJBmwg2AtACQbMKIAJB0AJqEDwgDCEEIAkhAUHldyEFDAULIAUvAQwhBCACIAIoApgENgLMAgJAIAJBzAJqIAQQrQMNACACIAk2AsQCIAJBnAg2AsACQbMKIAJBwAJqEDwgDCEEIAkhAUHkdyEFDAULAkAgBS0ACyIEQQNxQQJHDQAgAiAJNgKkAiACQbMINgKgAkGzCiACQaACahA8IAwhBCAJIQFBzXchBQwFCyANIQMCQCAEQQV0wEEHdSAEQQFxayAKLQAAakF/SiIEDQAgAiAJNgK0AiACQbQINgKwAkGzCiACQbACahA8Qcx3IQMLIAMhDSAERQ0CIAVBEGoiBCAAIAAoAiBqIAAoAiRqIgZJIQMCQCAEIAZJDQAgAyEEDAQLIAMhCiAJIQsgBUEaaiIMIQggBCEEIAchBiANIQkgAyEDIAVBGGovAQAgDC0AAE8NAAsLIAIgCyIBNgLUASACQaYINgLQAUGzCiACQdABahA8IAohBCABIQFB2nchBQwCCyAMIQQLIAkhASANIQULIAUhBSABIQgCQCAEQQFxRQ0AIAUhAAwBCwJAIABB3ABqKAIAIAAgACgCWGoiBGpBf2otAABFDQAgAiAINgLEASACQaMINgLAAUGzCiACQcABahA8Qd13IQAMAQsCQAJAIAAgACgCSGoiASABIABBzABqKAIAakkiAw0AIAMhDSAFIQEMAQsgAyEDIAUhByABIQYCQANAIAchCSADIQ0CQCAGIgcoAgAiAUEBcUUNAEG2CCEBQcp3IQUMAgsCQCABIAAoAlwiBUkNAEG3CCEBQcl3IQUMAgsCQCABQQVqIAVJDQBBuAghAUHIdyEFDAILAkACQAJAIAEgBCABaiIDLwEAIgZqIAMvAQIiAUEDdkH+P3FqQQVqIAVJDQBBuQghAUHHdyEDDAELAkAgAyABQfD/A3FBA3ZqQQRqIAZBACADQQwQmAMiA0F7Sw0AQQEhBSAJIQEgA0F/Sg0CQb4IIQFBwnchAwwBC0G5CCADayEBIANBx3dqIQMLIAIgCDYCpAEgAiABNgKgAUGzCiACQaABahA8QQAhBSADIQELIAEhAQJAIAVFDQAgB0EEaiIFIAAgACgCSGogACgCTGoiCUkiDSEDIAEhByAFIQYgDSENIAEhASAFIAlPDQMMAQsLIA0hDSABIQEMAQsgAiAINgK0ASACIAE2ArABQbMKIAJBsAFqEDwgDSENIAUhAQsgASEGAkAgDUEBcUUNACAGIQAMAQsCQCAAQdQAaigCACIBQQFIDQAgACAAKAJQaiIDIAFqIQcgACgCXCEFIAMhAQNAAkAgASIBKAIAIgMgBUkNACACIAg2ApQBIAJBnwg2ApABQbMKIAJBkAFqEDxB4XchAAwDCwJAIAEoAgQgA2ogBU8NACABQQhqIgMhASADIAdPDQIMAQsLIAIgCDYChAEgAkGgCDYCgAFBswogAkGAAWoQPEHgdyEADAELAkACQCAAIAAoAkBqIgEgASAAQcQAaigCAGpJIgUNACAFIQ0gBiEBDAELIAUhAyAGIQcgASEGA0AgByENIAMhCiAGIgkvAQAiAyEBAkAgACgCXCIGIANLDQAgAiAINgJ0IAJBoQg2AnBBswogAkHwAGoQPCAKIQ1B33chAQwCCwJAA0ACQCABIgEgA2tByAFJIgcNACACIAg2AmQgAkGiCDYCYEGzCiACQeAAahA8Qd53IQEMAgsCQCAEIAFqLQAARQ0AIAFBAWoiBSEBIAUgBkkNAQsLIA0hAQsgASEBAkAgB0UNACAJQQJqIgUgACAAKAJAaiAAKAJEaiIJSSINIQMgASEHIAUhBiANIQ0gASEBIAUgCU8NAgwBCwsgCiENIAEhAQsgASEBAkAgDUEBcUUNACABIQAMAQsCQAJAIAAgACgCOGoiBSAFIABBPGooAgBqSSIEDQAgBCEJIAghBCABIQUMAQsgBCEDIAEhByAFIQYDQCAHIQUgAyEIIAYiASAAayEEAkACQAJAIAEoAgBBHHZBf2pBAU0NAEGQCCEFQfB3IQcMAQsgAS8BBCEHIAIgAigCmAQ2AlxBASEDIAUhBSACQdwAaiAHEK0DDQFBkgghBUHudyEHCyACIAQ2AlQgAiAFNgJQQbMKIAJB0ABqEDxBACEDIAchBQsgBSEFAkAgA0UNACABQQhqIgEgACAAKAI4aiAAKAI8aiIISSIJIQMgBSEHIAEhBiAJIQkgBCEEIAUhBSABIAhPDQIMAQsLIAghCSAEIQQgBSEFCyAFIQEgBCEFAkAgCUEBcUUNACABIQAMAQsgAC8BDiIEQQBHIQMCQAJAIAQNACADIQkgBSEGIAEhAQwBCyAAIAAoAmBqIQ0gAyEEIAEhA0EAIQcDQCADIQYgBCEIIA0gByIEQQR0aiIBIABrIQUCQAJAAkAgAUEQaiAAIAAoAmBqIAAoAmQiA2pJDQBBsgghAUHOdyEHDAELAkACQAJAIAQOAgABAgsCQCABKAIEQfP///8BRg0AQacIIQFB2XchBwwDCyAEQQFHDQELIAEoAgRB8v///wFGDQBBqAghAUHYdyEHDAELAkAgAS8BCkECdCIHIANJDQBBqQghAUHXdyEHDAELAkAgAS8BCEEDdCAHaiADTQ0AQaoIIQFB1nchBwwBCyABLwEAIQMgAiACKAKYBDYCTAJAIAJBzABqIAMQrQMNAEGrCCEBQdV3IQcMAQsCQCABLQACQQ5xRQ0AQawIIQFB1HchBwwBCwJAAkAgAS8BCEUNACANIAdqIQwgBiEJQQAhCgwBC0EBIQMgBSEFIAYhBwwCCwNAIAkhByAMIAoiCkEDdGoiBS8BACEDIAIgAigCmAQ2AkggBSAAayEGAkACQCACQcgAaiADEK0DDQAgAiAGNgJEIAJBrQg2AkBBswogAkHAAGoQPEEAIQVB03chAwwBCwJAAkAgBS0ABEEBcQ0AIAchBwwBCwJAAkACQCAFLwEGQQJ0IgVBBGogACgCZEkNAEGuCCEDQdJ3IQsMAQsgDSAFaiIDIQUCQCADIAAgACgCYGogACgCZGpPDQADQAJAIAUiBS8BACIDDQACQCAFLQACRQ0AQa8IIQNB0XchCwwEC0GvCCEDQdF3IQsgBS0AAw0DQQEhCSAHIQUMBAsgAiACKAKYBDYCPAJAIAJBPGogAxCtAw0AQbAIIQNB0HchCwwDCyAFQQRqIgMhBSADIAAgACgCYGogACgCZGpJDQALC0GxCCEDQc93IQsLIAIgBjYCNCACIAM2AjBBswogAkEwahA8QQAhCSALIQULIAUiAyEHQQAhBSADIQMgCUUNAQtBASEFIAchAwsgAyEHAkAgBSIFRQ0AIAchCSAKQQFqIgshCiAFIQMgBiEFIAchByALIAEvAQhPDQMMAQsLIAUhAyAGIQUgByEHDAELIAIgBTYCJCACIAE2AiBBswogAkEgahA8QQAhAyAFIQUgByEHCyAHIQEgBSEGAkAgA0UNACAEQQFqIgUgAC8BDiIISSIJIQQgASEDIAUhByAJIQkgBiEGIAEhASAFIAhPDQIMAQsLIAghCSAGIQYgASEBCyABIQEgBiEFAkAgCUEBcUUNACABIQAMAQsCQCAAQewAaigCACIERQ0AAkACQCAAIAAoAmhqIgMoAgggBE0NACACIAU2AgQgAkG1CDYCAEGzCiACEDxBACEFQct3IQAMAQsCQCADENYEIgQNAEEBIQUgASEADAELIAIgACgCaDYCFCACIAQ2AhBBswogAkEQahA8QQAhBUEAIARrIQALIAAhACAFRQ0BC0EAIQALIAJBoARqJAAgAAteAQJ/IwBBEGsiAiQAAkACQCAALwEEIgMgAC8BBk8NACABKAKkASEBIAAgA0EBajsBBCABIANqLQAAIQAMAQsgAkEIaiABQeQAEIIBQQAhAAsgAkEQaiQAIABB/wFxCyUAAkAgAC0ARg0AQX8PCyAAQQA6AEYgACAALQAGQRByOgAGQQALLAAgACABOgBHAkAgAQ0AIAAtAEZFDQAgAEEAOgBGIAAgAC0ABkEQcjoABgsLPgAgACgC3AEQIiAAQfoBakIANwEAIABB9AFqQgA3AgAgAEHsAWpCADcCACAAQeQBakIANwIAIABCADcC3AELsgIBBH8CQCABDQBBAA8LAkAgAUGAgARPDQACQCAALwHgASICDQAgAkEARw8LIAAoAtwBIQNBACEEAkADQAJAIAMgBCIEQQJ0aiIFLwEAIAFHDQAgBSAFQQRqIAIgBEF/c2pBAnQQxQUaIAAvAeABIgJBAnQgACgC3AEiA2pBfGpBADsBACAAQfoBakIANwEAIABB8gFqQgA3AQAgAEHqAWpCADcBACAAQgA3AeIBAkAgAg0AQQEPC0EAIQQDQAJAIAMgBCIEQQJ0ai8BACIFRQ0AIAAgBUEfcWpB4gFqIgUtAAANACAFIARBAWo6AAALIARBAWoiBSEEQQEhASAFIAJHDQAMAwsACyAEQQFqIgUhBCAFIAJHDQALQQAhAQsgAQ8LQZg5QfM9QdQAQc8PEKYFAAskAAJAIAAoAqgBRQ0AIABBBBC2Aw8LIAAgAC0AB0GAAXI6AAcL5AIBB38CQCAALQBHRQ0AAkAgAC0AB0ECcUUNACAAKALcASECIAAvAeABIgMhBEEAIQUCQCADRQ0AQQAhBkEAIQMDQCADIQMCQAJAIAIgBiIGQQJ0aiIHLQACQQFxRQ0AIAMhAwwBCyACIANBAnRqIAcoAQA2AQAgA0EBaiEDCyAALwHgASIHIQQgAyIDIQUgBkEBaiIIIQYgAyEDIAggB0kNAAsLIAIgBSIDQQJ0akEAIAQgA2tBAnQQxgUaIABB+gFqQgA3AQAgAEHyAWpCADcBACAAQeoBakIANwEAIABCADcB4gEgAC8B4AEiB0UNACAAKALcASEIQQAhAwNAAkAgCCADIgNBAnRqLwEAIgZFDQAgACAGQR9xakHiAWoiBi0AAA0AIAYgA0EBajoAAAsgA0EBaiIGIQMgBiAHRw0ACwsgAEEAOgAHIABBADYC2AEgAC0ARg0AIAAgAToARiAAEGILC88EAQp/AkAgAUGAgARPDQACQCABDQBBfg8LAkACQAJAIAAvAeABIgNFDQAgA0ECdCAAKALcASIEakF8ai8BAA0AIAQhBCADIQMMAQtBfyEFIANB7wFLDQEgA0EBdCIDQegBIANB6AFJG0EIaiIDQQJ0ECEgACgC3AEgAC8B4AFBAnQQxAUhBCAAKALcARAiIAAgAzsB4AEgACAENgLcASAEIQQgAyEDCyAEIQYgAyIHQQEgB0EBSxshCEEAIQNBACEEAkADQCAEIQQCQAJAAkAgBiADIgVBAnRqIgMvAQAiCUUNACAJIAFzQR9xIQoCQAJAIARBAXFFDQAgCg0BCwJAIApFDQBBASELQQAhDCAKRSEKDAQLQQEhC0EAIQxBASEKIAkgAUkNAwsCQCAJIAFHDQAgAy0AAiACRw0AQQAhC0EBIQwMAgsgA0EEaiADIAcgBUF/c2pBAnQQxQUaCyADIAE7AQAgAyACOgACQQAhC0EEIQwLIAQhCgsgCiEEIAwhAyALRQ0BIAVBAWoiBSEDIAQhBCAFIAhHDQALQQQhAwtBACEFIANBBEcNACAAQgA3AeIBIABB+gFqQgA3AQAgAEHyAWpCADcBACAAQeoBakIANwEAAkAgAC8B4AEiAQ0AQQEPCyAAKALcASEJQQAhAwNAAkAgCSADIgNBAnRqLwEAIgRFDQAgACAEQR9xakHiAWoiBC0AAA0AIAQgA0EBajoAAAsgA0EBaiIEIQNBASEFIAQgAUcNAAsLIAUPC0GYOUHzPUGDAUG4DxCmBQALtQcCC38BfiMAQRBrIgEkAAJAIAAsAAdBf0oNACAAQQQQtgMLAkAgACgCqAEiAkUNACACIQJBgIAIIQMCQANAIAIhAiADQX9qIgRFDQEgAC0ARg0CAkACQCAALQBHRQ0AAkAgAC0ASEUNACAAQQA6AEgMAQsgACACLwEEIgVBH3FqQeIBai0AACIDRQ0AIAAoAtwBIgYgA0F/aiIDQQJ0ai8BACIHIQggAyEDIAUgB0kNAANAIAMhAwJAIAUgCEH//wNxRw0AAkAgBiADQQJ0ai0AAkEBcUUNACAAKALYASACRw0BIABBCBC2AwwECyAAQQEQtgMMAwsgBiADQQFqIgNBAnRqLwEAIgchCCADIQMgBSAHTw0ACwsCQAJAIAIvAQQiAyACLwEGTw0AIAAoAqQBIQUgAiADQQFqOwEEIAUgA2otAAAhAwwBCyABQQhqIABB5AAQggFBACEDCyADIgNB/wFxIQYCQCADwEF/Sg0AIAEgBkHwfmoQmgMCQCAALQBCIgJBCkkNACABQQhqIABB5QAQggEMAgsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdAAaiAMNwMADAELAkAgBkHfAEkNACABQQhqIABB5gAQggEMAQsCQCAGQdT5AGotAAAiCUEgcUUNACAAIAIvAQQiA0F/ajsBQAJAAkAgAyACLwEGTw0AIAAoAqQBIQUgAiADQQFqOwEEIAUgA2otAAAhAwwBCyABQQhqIABB5AAQggFBACEDCwJAAkAgA0H/AXEiCkH4AU8NACAKIQMMAQsgCkEDcSELQQAhBUEAIQgDQCAIIQggBSEDAkACQCACLwEEIgUgAi8BBk8NACAAKAKkASEHIAIgBUEBajsBBCAHIAVqLQAAIQcMAQsgAUEIaiAAQeQAEIIBQQAhBwsgA0EBaiEFIAhBCHQgB0H/AXFyIgchCCADIAtHDQALQQAgB2sgByAKQQRxGyEDCyAAIAM2AkwLIAAgAC0AQjoAQwJAAkAgCUEQcUUNACACIABBwPoAIAZBAnRqKAIAEQIAIAAtAEJFDQEgAUEIaiAAQecAEIIBDAELIAEgAiAAQcD6ACAGQQJ0aigCABEBAAJAIAAtAEIiAkEKSQ0AIAFBCGogAEHlABCCAQwBCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB0ABqIAw3AwALIAAtAEVFDQAgABCJAwsgACgCqAEiBSECIAQhAyAFDQAMAgsACyAAQeHUAxB2CyABQRBqJAALJAEBf0EAIQECQCAAQagBSw0AIABBAnRBsPQAaigCACEBCyABCyEAIAAoAgAiACAAKAJYaiAAIAAoAkhqIAFBAnRqKAIAagvBAgECfyMAQRBrIgMkACADIAAoAgA2AgwCQAJAIANBDGogARCtAw0AAkAgAg0AQQAhAQwCCyACQQA2AgBBACEBDAELIAFB//8AcSEEAkACQAJAAkACQCABQQ52QQNxDgQBAgMAAQsgACgCACIBIAEoAlhqIAEgASgCSGogBEECdGooAgBqIQECQCACRQ0AIAIgAS8BADYCAAsgASABLwECQQN2Qf4/cWpBBGohAQwECyAAKAIAIgEgASgCUGogBEEDdGohAAJAIAJFDQAgAiAAKAIENgIACyABIAEoAlhqIAAoAgBqIQEMAwsgBEECdEGw9ABqKAIAIQEMAQsgACgCACIBIAEoAlhqIAEgASgCQGogBEEBdGovAQBqIQELIAEhAQJAIAJFDQAgAiABEPMFNgIACyABIQELIANBEGokACABC0sBAX8jAEEQayIDJAAgAyAAKAKkATYCBCADQQRqIAEgAhC7AyIBIQICQCABDQAgA0EIaiAAQegAEIIBQYHdACECCyADQRBqJAAgAgtQAQF/IwBBEGsiBCQAIAQgASgCpAE2AgwCQAJAIARBDGogAkEOdCADciIBEK0DDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQggELDgAgACACIAIoAkwQ3wILNQACQCABLQBCQQFGDQBByM0AQaw8Qc0AQcXIABCmBQALIAFBADoAQiABKAKsAUEAQQAQdRoLNQACQCABLQBCQQJGDQBByM0AQaw8Qc0AQcXIABCmBQALIAFBADoAQiABKAKsAUEBQQAQdRoLNQACQCABLQBCQQNGDQBByM0AQaw8Qc0AQcXIABCmBQALIAFBADoAQiABKAKsAUECQQAQdRoLNQACQCABLQBCQQRGDQBByM0AQaw8Qc0A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KQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhDSAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCcBCADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQrQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQzwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCcBCADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQrQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQzwILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCcBCADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQrQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQzwILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQrQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQQAQrAIhBCADIAMpAxA3AwAgACACIAQgAxDNAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQrQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQRUQ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////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABENwFIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQnQaiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQnQajIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBCdBqNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahCdBqJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQxgUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QYCBAWopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEMYFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQ8wVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLDwAgACABIAJBACADEKgFCywBAX8jAEEQayIEJAAgBCADNgIMIAAgASACQQAgAxCoBSEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALTQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgAEEAIAEQqAUiARAhIgMgASAAQQAgAigCCBCoBRogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQISEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZB5ylqLQAAOgAAIAVBAWogBi0AAEEPcUHnKWotAAA6AAAgBEEBaiIFIQQgBSABRw0ACwsgAyACakEAOgAAIAML6QEBB38jAEEQayIBJAAgAUEANgIMIAFCADcCBCABIAA2AgACQAJAIAANAEEBIQIMAQsgACECQQAhA0EAIQQDQCACIQUgASAEQQFqIgRBAnRqKAIAIgYhAiAFEPMFIANqIgUhAyAEIQQgBg0ACyAFQQFqIQILIAIQISEHQQAhBQJAIABFDQAgACECQQAhA0EAIQQDQCACIQIgByADIgNqIAIgAhDzBSIFEMQFGiABIARBAWoiBEECdGooAgAiBiECIAUgA2oiBSEDIAQhBCAFIQUgBg0ACwsgByAFakEAOgAAIAFBEGokACAHCxkAAkAgAQ0AQQEQIQ8LIAEQISAAIAEQxAULEgACQEEAKAK48gFFDQAQsgULC54DAQd/AkBBAC8BvPIBIgBFDQAgACEBQQAo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JBEGACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEMQFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQ0QUhAAwBCyADEMcFIQUgACAEIAMQ0QUhACAFRQ0AIAMQyAULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbENgFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC9MEAwF/An4GfCAAENsFIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA7CCASIFoiIGoCIHIAAgACAAoiIIoiIJIAkgCSAJQQArA4CDAaIgCEEAKwP4ggGiIABBACsD8IIBokEAKwPoggGgoKCiIAhBACsD4IIBoiAAQQArA9iCAaJBACsD0IIBoKCgoiAIQQArA8iCAaIgAEEAKwPAggGiQQArA7iCAaCgoKIgACAEoSAFoiAAIASgoiAGIAAgB6GgoKCgDwsCQAJAIAFBkIB+akGfgH5LDQACQCACQv///////////wCDQgBSDQBBARDXBQ8LIAJCgICAgICAgPj/AFENAQJAAkAgAUGAgAJxDQAgAUHw/wFxQfD/AUcNAQsgABDZBQ8LIABEAAAAAAAAMEOivUKAgICAgICA4Hx8IQILIAJCgICAgICAgI1AfCIDQjSHp7ciCEEAKwP4gQGiIANCLYinQf8AcUEEdCIBQZCDAWorAwCgIgkgAUGIgwFqKwMAIAIgA0KAgICAgICAeIN9vyABQYiTAWorAwChIAFBkJMBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwOoggGiQQArA6CCAaCiIABBACsDmIIBokEAKwOQggGgoKIgBEEAKwOIggGiIAhBACsDgIIBoiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsC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BEEgaiABIAJCAEKAgICAgICA//8AEJsGIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQmwYgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORCbBiAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQmwYgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEJsGIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCRBkUNACADIAQQgQYhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQmwYgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxCTBiAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQkQZBAEoNAAJAIAEgCSADIAoQkQZFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQmwYgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEJsGIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCbBiAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBq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////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEGQ9wFqIQQCQAJAAkACQEEAKALk9AEiBkEBIAJ0IgNxDQBBACAGIANyNgLk9AEgBCABNgIAIAEgBDYCGAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAoD1AUF/aiIBQX8gARs2AoD1AQsLBwA/AEEQdAtUAQJ/QQAoAsTWASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABCNBk0NACAAEBVFDQELQQAgADYCxNYBIAEPCxDBBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQkAZBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEJAGQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxCQBiAFQTBqIAogASAHEJoGIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQkAYgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQkAYgBSACIARBASAGaxCaBiAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQmAYOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQmQYaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahCQBkEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJAGIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEJwGIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEJwGIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEJwGIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEJwGIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEJwGIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEJwGIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEJwGIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEJwGIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEJwGIAVBkAFqIANCD4ZCACAEQgAQnAYgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABCcBiAFQYABakIBIAJ9QgAgBEIAEJwGIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4QnAYgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4QnAYgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxCaBiAFQTBqIBYgEyAGQfAAahCQBiAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxCcBiAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEJwGIAUgAyAOQgVCABCcBiAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQkAYgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQkAYgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahCQBiACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahCQBiACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahCQBkEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCQBiAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhCQBiAFQSBqIAIgBCAGEJAGIAVBEGogEiABIAcQmgYgBSACIAQgBxCaBiAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQjwYgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEJAGIAIgACAEQYH4ACADaxCaBiACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQdD4BSQDQdD4AUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAAREAALJQEBfiAAIAEgAq0gA61CIIaEIAQQqgYhBSAFQiCIpxCgBiAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwv+1oGAAAMAQYAIC5jNAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBkZWxheQBoZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGRldnNfamRfc2VuZF9yYXcAaWRpdgBwcmV2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydAByZXN0YXJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwAjICV1ICVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAFVua25vd24gZW5jb2Rpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAHNlcnZlcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGNsYXNzSWRlbnRpZmllcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAdmFsaWRhdGVfaGVhcABEZXZTLVNIQTI1NjogJSpwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX2luc3BlY3RfdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AQHZlcnNpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AbWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AZnJvbQByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAY2h1bmsAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAGRldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aABzeiA9PSBzLT5sZW5ndGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABsZW4gPT0gcy0+aW5uZXIubGVuZ3RoAHNpemUgPj0gbGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoAGRldnNfc3RyaW5nX2ZpbmlzaAAhIHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c19zdHJpbmdfdnNwcmludGYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAHN6ID09IHMtPmlubmVyLnNpemUAc3RhdGUub2ZmICsgMyA8PSBzaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAcmVzcG9uc2UAX2NvbW1hbmRSZXNwb25zZQBmYWxzZQBmbGFzaF9lcmFzZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAZGJnOiByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAEBuYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBtZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlAGRlY29kZQBldmVudENvZGUAZnJvbUNoYXJDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAU2VydmVySW50ZXJmYWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAF9zZXJ2ZXJTZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG5vdEltcGxlbWVudGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzX3N0cmluZ19qbXBfdHJ5X2FsbG9jAGRldnNkYmdfcGlwZV9hbGxvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAZmxhc2ggc3luYwBfcGFuaWMAYmFkIG1hZ2ljAGpkX2ZzdG9yX2djAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGZzdG9yOiBnYwBkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAFBhY2tldFNwZWMAU2VydmljZVNwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L2luc3BlY3QuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9pbXBsX3BhY2tldHNwZWMuYwBkZXZpY2VzY3JpcHQvaW1wbF9zZXJ2aWNlc3BlYy5jAGRldmljZXNjcmlwdC91dGY4LmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbUm9sZTogJXMuJXNdAFtQYWNrZXRTcGVjOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBbU2VydmljZVNwZWM6ICVzXQBbQ2lyY3VsYXJdAFtCdWZmZXJbJXVdICUqcF0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUqcC4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG9mZiA8IEZTVE9SX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAHN6ID09IGxlbiAmJiBzeiA8IERFVlNfTUFYX0FTQ0lJX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AHV0ZjgAdXRmLTgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAaWR4ID49IDAAciA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AISAgLi4uACwAZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAGRldnNfaGFuZGxlX3R5cGUodikgPT0gREVWU19IQU5ETEVfVFlQRV9HQ19PQkpFQ1QgJiYgZGV2c19pc19zdHJpbmcoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHgg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b2R1bGUuZmxhc2hTYXZlKSBNb2R1bGUuZmxhc2hTYXZlKEhFQVBVOC5zbGljZShzdGFydCwgc3RhcnQgKyBzaXplKSk7IH0AKHZvaWQgKnN0YXJ0LCB1bnNpZ25lZCBzaXplKTw6Oj57IGlmIChNb2R1bGUuZmxhc2hMb2FkKSB7IGNvbnN0IGRhdGEgPSBNb2R1bGUuZmxhc2hMb2FkKCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZygiZmxhc2ggbG9hZCwgc2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AALn8gIAABG5hbWUByXutBgANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwSZGV2c19pbWdfcm9sZV9uYW1lfRFkZXZzX2ZpYmVyX2J5X3RhZ34QZGV2c19maWJlcl9zdGFydH8UZGV2c19maWJlcl90ZXJtaWFudGWAAQ5kZXZzX2ZpYmVyX3J1boEBE2RldnNfZmliZXJfc3luY19ub3eCARVfZGV2c19pbnZhbGlkX3Byb2dyYW2DAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARBkZXZzX3N0cmluZ19wcmVwlQESZGV2c19zdHJpbmdfZmluaXNolgEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSXAQ9kZXZzX2djX3NldF9jdHiYAQ5kZXZzX2djX2NyZWF0ZZkBD2RldnNfZ2NfZGVzdHJveZoBEWRldnNfZ2Nfb2JqX2NoZWNrmwELc2Nhbl9nY19vYmqcARFwcm9wX0FycmF5X2xlbmd0aJ0BEm1ldGgyX0FycmF5X2luc2VydJ4BEmZ1bjFfQXJyYXlfaXNBcnJheZ8BEG1ldGhYX0FycmF5X3B1c2igARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WhARFtZXRoWF9BcnJheV9zbGljZaIBEG1ldGgxX0FycmF5X2pvaW6jARFmdW4xX0J1ZmZlcl9hbGxvY6QBEGZ1bjFfQnVmZmVyX2Zyb22lARJwcm9wX0J1ZmZlcl9sZW5ndGimARVtZXRoMV9CdWZmZXJfdG9TdHJpbmenARNtZXRoM19CdWZmZXJfZmlsbEF0qAETbWV0aDRfQnVmZmVyX2JsaXRBdKkBFGRldnNfY29tcHV0ZV90aW1lb3V0qgEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCrARdmdW4xX0RldmljZVNjcmlwdF9kZWxheawBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY60BGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdK4BGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnSvARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSwARdmdW4yX0RldmljZVNjcmlwdF9wcmludLEBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSyARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLMBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXBytAEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme1ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO2ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVytwEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmS4ARRtZXRoMV9FcnJvcl9fX2N0b3JfX7kBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+6ARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+7ARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7wBD3Byb3BfRXJyb3JfbmFtZb0BEW1ldGgwX0Vycm9yX3ByaW50vgEPcHJvcF9Ec0ZpYmVyX2lkvwEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZMABFG1ldGgxX0RzRmliZXJfcmVzdW1lwQEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGXCARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kwwERZnVuMF9Ec0ZpYmVyX3NlbGbEARRtZXRoWF9GdW5jdGlvbl9zdGFydMUBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlxgEScHJvcF9GdW5jdGlvbl9uYW1lxwEPZnVuMl9KU09OX3BhcnNlyAETZnVuM19KU09OX3N0cmluZ2lmeckBDmZ1bjFfTWF0aF9jZWlsygEPZnVuMV9NYXRoX2Zsb29yywEPZnVuMV9NYXRoX3JvdW5kzAENZnVuMV9NYXRoX2Fic80BEGZ1bjBfTWF0aF9yYW5kb23OARNmdW4xX01hdGhfcmFuZG9tSW50zwENZnVuMV9NYXRoX2xvZ9ABDWZ1bjJfTWF0aF9wb3fRAQ5mdW4yX01hdGhfaWRpdtIBDmZ1bjJfTWF0aF9pbW9k0wEOZnVuMl9NYXRoX2ltdWzUAQ1mdW4yX01hdGhfbWlu1QELZnVuMl9taW5tYXjWAQ1mdW4yX01hdGhfbWF41wESZnVuMl9PYmplY3RfYXNzaWdu2AEQZnVuMV9PYmplY3Rfa2V5c9kBE2Z1bjFfa2V5c19vcl92YWx1ZXPaARJmdW4xX09iamVjdF92YWx1ZXPbARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtwBHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm933QEScHJvcF9Ec1BhY2tldF9yb2xl3gEecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVy3wEVcHJvcF9Ec1BhY2tldF9zaG9ydElk4AEacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXjhARxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5k4gETcHJvcF9Ec1BhY2tldF9mbGFnc+MBF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5k5AEWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydOUBFXByb3BfRHNQYWNrZXRfcGF5bG9hZOYBFXByb3BfRHNQYWNrZXRfaXNFdmVudOcBF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2Rl6AEWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldOkBFnByb3BfRHNQYWNrZXRfaXNSZWdHZXTqARVwcm9wX0RzUGFja2V0X3JlZ0NvZGXrARZwcm9wX0RzUGFja2V0X2lzQWN0aW9u7AEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl7QESZGV2c19nZXRfc3BlY19jb2Rl7gEScHJvcF9Ec1BhY2tldF9zcGVj7wERZGV2c19wa3RfZ2V0X3NwZWPwARVtZXRoMF9Ec1BhY2tldF9kZWNvZGXxAR1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZPIBGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudPMBFnByb3BfRHNQYWNrZXRTcGVjX25hbWX0ARZwcm9wX0RzUGFja2V0U3BlY19jb2Rl9QEacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2X2ARltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2Rl9wESZGV2c19wYWNrZXRfZGVjb2Rl+AEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk+QEURHNSZWdpc3Rlcl9yZWFkX2NvbnT6ARJkZXZzX3BhY2tldF9lbmNvZGX7ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl/AEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZf0BFnByb3BfRHNQYWNrZXRJbmZvX25hbWX+ARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl/wEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fgAITcHJvcF9Ec1JvbGVfaXNCb3VuZIECGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZIICInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXKDAhdwcm9wX0RzU2VydmljZVNwZWNfbmFtZYQCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwhQIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26GAhJwcm9wX1N0cmluZ19sZW5ndGiHAhdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdIgCE21ldGgxX1N0cmluZ19jaGFyQXSJAhJtZXRoMl9TdHJpbmdfc2xpY2WKAhhmdW5YX1N0cmluZ19mcm9tQ2hhckNvZGWLAgxkZXZzX2luc3BlY3SMAgtpbnNwZWN0X29iao0CB2FkZF9zdHKOAg1pbnNwZWN0X2ZpZWxkjwIUZGV2c19qZF9nZXRfcmVnaXN0ZXKQAhZkZXZzX2pkX2NsZWFyX3BrdF9raW5kkQIQZGV2c19qZF9zZW5kX2NtZJICEGRldnNfamRfc2VuZF9yYXeTAhNkZXZzX2pkX3NlbmRfbG9nbXNnlAITZGV2c19qZF9wa3RfY2FwdHVyZZUCEWRldnNfamRfd2FrZV9yb2xllgISZGV2c19qZF9zaG91bGRfcnVulwIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWYAhNkZXZzX2pkX3Byb2Nlc3NfcGt0mQIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lkmgIUZGV2c19qZF9yb2xlX2NoYW5nZWSbAhRkZXZzX2pkX3Jlc2V0X3BhY2tldJwCEmRldnNfamRfaW5pdF9yb2xlc50CEmRldnNfamRfZnJlZV9yb2xlc54CFWRldnNfc2V0X2dsb2JhbF9mbGFnc58CF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzoAIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzoQIQZGV2c19qc29uX2VzY2FwZaICFWRldnNfanNvbl9lc2NhcGVfY29yZaMCD2RldnNfanNvbl9wYXJzZaQCCmpzb25fdmFsdWWlAgxwYXJzZV9zdHJpbmemAhNkZXZzX2pzb25fc3RyaW5naWZ5pwINc3RyaW5naWZ5X29iaqgCEXBhcnNlX3N0cmluZ19jb3JlqQIKYWRkX2luZGVudKoCD3N0cmluZ2lmeV9maWVsZKsCEWRldnNfbWFwbGlrZV9pdGVyrAIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3StAhJkZXZzX21hcF9jb3B5X2ludG+uAgxkZXZzX21hcF9zZXSvAgZsb29rdXCwAhNkZXZzX21hcGxpa2VfaXNfbWFwsQIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzsgIRZGV2c19hcnJheV9pbnNlcnSzAghrdl9hZGQuMbQCEmRldnNfc2hvcnRfbWFwX3NldLUCD2RldnNfbWFwX2RlbGV0ZbYCEmRldnNfc2hvcnRfbWFwX2dldLcCIGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWNfaWR4uAIbZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjuQIeZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWNfaWR4ugIaZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWO7AhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldLwCF2RldnNfcGFja2V0X3NwZWNfcGFyZW50vQIOZGV2c19yb2xlX3NwZWO+AhJkZXZzX2dldF9iYXNlX3NwZWO/AhBkZXZzX3NwZWNfbG9va3VwwAISZGV2c19mdW5jdGlvbl9iaW5kwQIRZGV2c19tYWtlX2Nsb3N1cmXCAg5kZXZzX2dldF9mbmlkeMMCE2RldnNfZ2V0X2ZuaWR4X2NvcmXEAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGTFAhNkZXZzX2dldF9yb2xlX3Byb3RvxgIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3xwIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkyAIVZGV2c19nZXRfc3RhdGljX3Byb3RvyQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvygIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW3LAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvzAIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkzQIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kzgIQZGV2c19pbnN0YW5jZV9vZs8CD2RldnNfb2JqZWN0X2dldNACDGRldnNfc2VxX2dldNECDGRldnNfYW55X2dldNICDGRldnNfYW55X3NldNMCDGRldnNfc2VxX3NldNQCDmRldnNfYXJyYXlfc2V01QITZGV2c19hcnJheV9waW5fcHVzaNYCDGRldnNfYXJnX2ludNcCD2RldnNfYXJnX2RvdWJsZdgCD2RldnNfcmV0X2RvdWJsZdkCDGRldnNfcmV0X2ludNoCDWRldnNfcmV0X2Jvb2zbAg9kZXZzX3JldF9nY19wdHLcAhFkZXZzX2FyZ19zZWxmX21hcN0CEWRldnNfc2V0dXBfcmVzdW1l3gIPZGV2c19jYW5fYXR0YWNo3wIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZeACFWRldnNfbWFwbGlrZV90b192YWx1ZeECEmRldnNfcmVnY2FjaGVfZnJlZeICFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzjAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZOQCE2RldnNfcmVnY2FjaGVfYWxsb2PlAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cOYCEWRldnNfcmVnY2FjaGVfYWdl5wIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXoAhJkZXZzX3JlZ2NhY2hlX25leHTpAg9qZF9zZXR0aW5nc19nZXTqAg9qZF9zZXR0aW5nc19zZXTrAg5kZXZzX2xvZ192YWx1ZewCD2RldnNfc2hvd192YWx1Ze0CEGRldnNfc2hvd192YWx1ZTDuAg1jb25zdW1lX2NodW5r7wINc2hhXzI1Nl9jbG9zZfACD2pkX3NoYTI1Nl9zZXR1cPECEGpkX3NoYTI1Nl91cGRhdGXyAhBqZF9zaGEyNTZfZmluaXNo8wIUamRfc2hhMjU2X2htYWNfc2V0dXD0AhVqZF9zaGEyNTZfaG1hY19maW5pc2j1Ag5qZF9zaGEyNTZfaGtkZvYCDmRldnNfc3RyZm9ybWF09wIOZGV2c19pc19zdHJpbmf4Ag5kZXZzX2lzX251bWJlcvkCG2RldnNfc3RyaW5nX2dldF91dGY4X3N0cnVjdPoCFGRldnNfc3RyaW5nX2dldF91dGY4+wITZGV2c19idWlsdGluX3N0cmluZ/wCFGRldnNfc3RyaW5nX3ZzcHJpbnRm/QITZGV2c19zdHJpbmdfc3ByaW50Zv4CFWRldnNfc3RyaW5nX2Zyb21fdXRmOP8CFGRldnNfdmFsdWVfdG9fc3RyaW5ngAMQYnVmZmVyX3RvX3N0cmluZ4EDGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGSCAxJkZXZzX3N0cmluZ19jb25jYXSDAxFkZXZzX3N0cmluZ19zbGljZYQDEmRldnNfcHVzaF90cnlmcmFtZYUDEWRldnNfcG9wX3RyeWZyYW1lhgMPZGV2c19kdW1wX3N0YWNrhwMTZGV2c19kdW1wX2V4Y2VwdGlvbogDCmRldnNfdGhyb3eJAxJkZXZzX3Byb2Nlc3NfdGhyb3eKAxBkZXZzX2FsbG9jX2Vycm9yiwMVZGV2c190aHJvd190eXBlX2Vycm9yjAMWZGV2c190aHJvd19yYW5nZV9lcnJvco0DHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvco4DGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yjwMeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh0kAMYZGV2c190aHJvd190b29fYmlnX2Vycm9ykQMXZGV2c190aHJvd19zeW50YXhfZXJyb3KSAxFkZXZzX3N0cmluZ19pbmRleJMDEmRldnNfc3RyaW5nX2xlbmd0aJQDGWRldnNfdXRmOF9mcm9tX2NvZGVfcG9pbnSVAxtkZXZzX3V0ZjhfY29kZV9wb2ludF9sZW5ndGiWAxRkZXZzX3V0ZjhfY29kZV9wb2ludJcDFGRldnNfc3RyaW5nX2ptcF9pbml0mAMOZGV2c191dGY4X2luaXSZAxZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlmgMTZGV2c192YWx1ZV9mcm9tX2ludJsDFGRldnNfdmFsdWVfZnJvbV9ib29snAMXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXKdAxRkZXZzX3ZhbHVlX3RvX2RvdWJsZZ4DEWRldnNfdmFsdWVfdG9faW50nwMSZGV2c192YWx1ZV90b19ib29soAMOZGV2c19pc19idWZmZXKhAxdkZXZzX2J1ZmZlcl9pc193cml0YWJsZaIDEGRldnNfYnVmZmVyX2RhdGGjAxNkZXZzX2J1ZmZlcmlzaF9kYXRhpAMUZGV2c192YWx1ZV90b19nY19vYmqlAw1kZXZzX2lzX2FycmF5pgMRZGV2c192YWx1ZV90eXBlb2anAw9kZXZzX2lzX251bGxpc2ioAxlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVkqQMUZGV2c192YWx1ZV9hcHByb3hfZXGqAxJkZXZzX3ZhbHVlX2llZWVfZXGrAxxkZXZzX3ZhbHVlX2VxX2J1aWx0aW5fc3RyaW5nrAMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjrQMSZGV2c19pbWdfc3RyaWR4X29rrgMSZGV2c19kdW1wX3ZlcnNpb25zrwMLZGV2c192ZXJpZnmwAxFkZXZzX2ZldGNoX29wY29kZbEDDmRldnNfdm1fcmVzdW1lsgMRZGV2c192bV9zZXRfZGVidWezAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRztAMYZGV2c192bV9jbGVhcl9icmVha3BvaW50tQMMZGV2c192bV9oYWx0tgMPZGV2c192bV9zdXNwZW5ktwMWZGV2c192bV9zZXRfYnJlYWtwb2ludLgDFGRldnNfdm1fZXhlY19vcGNvZGVzuQMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHi6AxdkZXZzX2ltZ19nZXRfc3RyaW5nX2ptcLsDEWRldnNfaW1nX2dldF91dGY4vAMUZGV2c19nZXRfc3RhdGljX3V0Zji9AxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaL4DDGV4cHJfaW52YWxpZL8DFGV4cHJ4X2J1aWx0aW5fb2JqZWN0wAMLc3RtdDFfY2FsbDDBAwtzdG10Ml9jYWxsMcIDC3N0bXQzX2NhbGwywwMLc3RtdDRfY2FsbDPEAwtzdG10NV9jYWxsNMUDC3N0bXQ2X2NhbGw1xgMLc3RtdDdfY2FsbDbHAwtzdG10OF9jYWxsN8gDC3N0bXQ5X2NhbGw4yQMSc3RtdDJfaW5kZXhfZGVsZXRlygMMc3RtdDFfcmV0dXJuywMJc3RtdHhfam1wzAMMc3RtdHgxX2ptcF96zQMKZXhwcjJfYmluZM4DEmV4cHJ4X29iamVjdF9maWVsZM8DEnN0bXR4MV9zdG9yZV9sb2NhbNADE3N0bXR4MV9zdG9yZV9nbG9iYWzRAxJzdG10NF9zdG9yZV9idWZmZXLSAwlleHByMF9pbmbTAxBleHByeF9sb2FkX2xvY2Fs1AMRZXhwcnhfbG9hZF9nbG9iYWzVAwtleHByMV91cGx1c9YDC2V4cHIyX2luZGV41wMPc3RtdDNfaW5kZXhfc2V02AMUZXhwcngxX2J1aWx0aW5fZmllbGTZAxJleHByeDFfYXNjaWlfZmllbGTaAxFleHByeDFfdXRmOF9maWVsZNsDEGV4cHJ4X21hdGhfZmllbGTcAw5leHByeF9kc19maWVsZN0DD3N0bXQwX2FsbG9jX21hcN4DEXN0bXQxX2FsbG9jX2FycmF53wMSc3RtdDFfYWxsb2NfYnVmZmVy4AMRZXhwcnhfc3RhdGljX3JvbGXhAxNleHByeF9zdGF0aWNfYnVmZmVy4gMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5n4wMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ+QDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ+UDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbuYDDWV4cHJ4X2xpdGVyYWznAxFleHByeF9saXRlcmFsX2Y2NOgDEGV4cHJ4X3JvbGVfcHJvdG/pAxFleHByM19sb2FkX2J1ZmZlcuoDDWV4cHIwX3JldF92YWzrAwxleHByMV90eXBlb2bsAw9leHByMF91bmRlZmluZWTtAxJleHByMV9pc191bmRlZmluZWTuAwpleHByMF90cnVl7wMLZXhwcjBfZmFsc2XwAw1leHByMV90b19ib29s8QMJZXhwcjBfbmFu8gMJZXhwcjFfYWJz8wMNZXhwcjFfYml0X25vdPQDDGV4cHIxX2lzX25hbvUDCWV4cHIxX25lZ/YDCWV4cHIxX25vdPcDDGV4cHIxX3RvX2ludPgDCWV4cHIyX2FkZPkDCWV4cHIyX3N1YvoDCWV4cHIyX211bPsDCWV4cHIyX2RpdvwDDWV4cHIyX2JpdF9hbmT9AwxleHByMl9iaXRfb3L+Aw1leHByMl9iaXRfeG9y/wMQZXhwcjJfc2hpZnRfbGVmdIAEEWV4cHIyX3NoaWZ0X3JpZ2h0gQQaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWSCBAhleHByMl9lcYMECGV4cHIyX2xlhAQIZXhwcjJfbHSFBAhleHByMl9uZYYEEGV4cHIxX2lzX251bGxpc2iHBBRzdG10eDJfc3RvcmVfY2xvc3VyZYgEE2V4cHJ4MV9sb2FkX2Nsb3N1cmWJBBJleHByeF9tYWtlX2Nsb3N1cmWKBBBleHByMV90eXBlb2Zfc3RyiwQTc3RtdHhfam1wX3JldF92YWxfeowEEHN0bXQyX2NhbGxfYXJyYXmNBAlzdG10eF90cnmOBA1zdG10eF9lbmRfdHJ5jwQLc3RtdDBfY2F0Y2iQBA1zdG10MF9maW5hbGx5kQQLc3RtdDFfdGhyb3eSBA5zdG10MV9yZV90aHJvd5MEEHN0bXR4MV90aHJvd19qbXCUBA5zdG10MF9kZWJ1Z2dlcpUECWV4cHIxX25ld5YEEWV4cHIyX2luc3RhbmNlX29mlwQKZXhwcjBfbnVsbJgED2V4cHIyX2FwcHJveF9lcZkED2V4cHIyX2FwcHJveF9uZZoEE3N0bXQxX3N0b3JlX3JldF92YWybBBFleHByeF9zdGF0aWNfc3BlY5wED2RldnNfdm1fcG9wX2FyZ50EE2RldnNfdm1fcG9wX2FyZ191MzKeBBNkZXZzX3ZtX3BvcF9hcmdfaTMynwQWZGV2c192bV9wb3BfYXJnX2J1ZmZlcqAEEmpkX2Flc19jY21fZW5jcnlwdKEEEmpkX2Flc19jY21fZGVjcnlwdKIEDEFFU19pbml0X2N0eKMED0FFU19FQ0JfZW5jcnlwdKQEEGpkX2Flc19zZXR1cF9rZXmlBA5qZF9hZXNfZW5jcnlwdKYEEGpkX2Flc19jbGVhcl9rZXmnBAtqZF93c3NrX25ld6gEFGpkX3dzc2tfc2VuZF9tZXNzYWdlqQQTamRfd2Vic29ja19vbl9ldmVudKoEB2RlY3J5cHSrBA1qZF93c3NrX2Nsb3NlrAQQamRfd3Nza19vbl9ldmVudK0EC3Jlc3Bfc3RhdHVzrgQSd3Nza2hlYWx0aF9wcm9jZXNzrwQXamRfdGNwc29ja19pc19hdmFpbGFibGWwBBR3c3NraGVhbHRoX3JlY29ubmVjdLEEGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldLIED3NldF9jb25uX3N0cmluZ7MEEWNsZWFyX2Nvbm5fc3RyaW5ntAQPd3Nza2hlYWx0aF9pbml0tQQRd3Nza19zZW5kX21lc3NhZ2W2BBF3c3NrX2lzX2Nvbm5lY3RlZLcEFHdzc2tfdHJhY2tfZXhjZXB0aW9uuAQSd3Nza19zZXJ2aWNlX3F1ZXJ5uQQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZboEFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGW7BA9yb2xlbWdyX3Byb2Nlc3O8BBByb2xlbWdyX2F1dG9iaW5kvQQVcm9sZW1ncl9oYW5kbGVfcGFja2V0vgQUamRfcm9sZV9tYW5hZ2VyX2luaXS/BBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWTABA1qZF9yb2xlX2FsbG9jwQQQamRfcm9sZV9mcmVlX2FsbMIEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmTDBBNqZF9jbGllbnRfbG9nX2V2ZW50xAQTamRfY2xpZW50X3N1YnNjcmliZcUEFGpkX2NsaWVudF9lbWl0X2V2ZW50xgQUcm9sZW1ncl9yb2xlX2NoYW5nZWTHBBBqZF9kZXZpY2VfbG9va3VwyAQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlyQQTamRfc2VydmljZV9zZW5kX2NtZMoEEWpkX2NsaWVudF9wcm9jZXNzywQOamRfZGV2aWNlX2ZyZWXMBBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldM0ED2pkX2RldmljZV9hbGxvY84EEHNldHRpbmdzX3Byb2Nlc3PPBBZzZXR0aW5nc19oYW5kbGVfcGFja2V00AQNc2V0dGluZ3NfaW5pdNEED2pkX2N0cmxfcHJvY2Vzc9IEFWpkX2N0cmxfaGFuZGxlX3BhY2tldNMEDGpkX2N0cmxfaW5pdNQEFGRjZmdfc2V0X3VzZXJfY29uZmln1QQJZGNmZ19pbml01gQNZGNmZ192YWxpZGF0ZdcEDmRjZmdfZ2V0X2VudHJ52AQMZGNmZ19nZXRfaTMy2QQMZGNmZ19nZXRfdTMy2gQPZGNmZ19nZXRfc3RyaW5n2wQMZGNmZ19pZHhfa2V53AQJamRfdmRtZXNn3QQRamRfZG1lc2dfc3RhcnRwdHLeBA1qZF9kbWVzZ19yZWFk3wQSamRfZG1lc2dfcmVhZF9saW5l4AQTamRfc2V0dGluZ3NfZ2V0X2JpbuEECmZpbmRfZW50cnniBA9yZWNvbXB1dGVfY2FjaGXjBBNqZF9zZXR0aW5nc19zZXRfYmlu5AQLamRfZnN0b3JfZ2PlBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2XmBBZqZF9zZXR0aW5nc19wcmVwX2xhcmdl5wQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2XoBBZqZF9zZXR0aW5nc19zeW5jX2xhcmdl6QQNamRfaXBpcGVfb3BlbuoEFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTrBA5qZF9pcGlwZV9jbG9zZewEEmpkX251bWZtdF9pc192YWxpZO0EFWpkX251bWZtdF93cml0ZV9mbG9hdO4EE2pkX251bWZtdF93cml0ZV9pMzLvBBJqZF9udW1mbXRfcmVhZF9pMzLwBBRqZF9udW1mbXRfcmVhZF9mbG9hdPEEEWpkX29waXBlX29wZW5fY21k8gQUamRfb3BpcGVfb3Blbl9yZXBvcnTzBBZqZF9vcGlwZV9oYW5kbGVfcGFja2V09AQRamRfb3BpcGVfd3JpdGVfZXj1BBBqZF9vcGlwZV9wcm9jZXNz9gQUamRfb3BpcGVfY2hlY2tfc3BhY2X3BA5qZF9vcGlwZV93cml0ZfgEDmpkX29waXBlX2Nsb3Nl+QQNamRfcXVldWVfcHVzaPoEDmpkX3F1ZXVlX2Zyb250+wQOamRfcXVldWVfc2hpZnT8BA5qZF9xdWV1ZV9hbGxvY/0EDWpkX3Jlc3BvbmRfdTj+BA5qZF9yZXNwb25kX3UxNv8EDmpkX3Jlc3BvbmRfdTMygAURamRfcmVzcG9uZF9zdHJpbmeBBRdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZIIFC2pkX3NlbmRfcGt0gwUdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyEBRdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcoUFGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSGBRRqZF9hcHBfaGFuZGxlX3BhY2tldIcFFWpkX2FwcF9oYW5kbGVfY29tbWFuZIgFFWFwcF9nZXRfaW5zdGFuY2VfbmFtZYkFE2pkX2FsbG9jYXRlX3NlcnZpY2WKBRBqZF9zZXJ2aWNlc19pbml0iwUOamRfcmVmcmVzaF9ub3eMBRlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkjQUUamRfc2VydmljZXNfYW5ub3VuY2WOBRdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZY8FEGpkX3NlcnZpY2VzX3RpY2uQBRVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeRBRpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZZIFFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWTBRRhcHBfZ2V0X2RldmljZV9jbGFzc5QFEmFwcF9nZXRfZndfdmVyc2lvbpUFDWpkX3NydmNmZ19ydW6WBRdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZZcFEWpkX3NydmNmZ192YXJpYW50mAUNamRfaGFzaF9mbnYxYZkFDGpkX2RldmljZV9pZJoFCWpkX3JhbmRvbZsFCGpkX2NyYzE2nAUOamRfY29tcHV0ZV9jcmOdBQ5qZF9zaGlmdF9mcmFtZZ4FDGpkX3dvcmRfbW92ZZ8FDmpkX3Jlc2V0X2ZyYW1loAUQamRfcHVzaF9pbl9mcmFtZaEFDWpkX3BhbmljX2NvcmWiBRNqZF9zaG91bGRfc2FtcGxlX21zowUQamRfc2hvdWxkX3NhbXBsZaQFCWpkX3RvX2hleKUFC2pkX2Zyb21faGV4pgUOamRfYXNzZXJ0X2ZhaWynBQdqZF9hdG9pqAUPamRfdnNwcmludGZfZXh0qQUPamRfcHJpbnRfZG91YmxlqgULamRfdnNwcmludGarBQpqZF9zcHJpbnRmrAUSamRfZGV2aWNlX3Nob3J0X2lkrQUMamRfc3ByaW50Zl9hrgULamRfdG9faGV4X2GvBQlqZF9zdHJkdXCwBQlqZF9tZW1kdXCxBRZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlsgUWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZbMFEWpkX3NlbmRfZXZlbnRfZXh0tAUKamRfcnhfaW5pdLUFFGpkX3J4X2ZyYW1lX3JlY2VpdmVktgUdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2u3BQ9qZF9yeF9nZXRfZnJhbWW4BRNqZF9yeF9yZWxlYXNlX2ZyYW1luQURamRfc2VuZF9mcmFtZV9yYXe6BQ1qZF9zZW5kX2ZyYW1luwUKamRfdHhfaW5pdLwFB2pkX3NlbmS9BRZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjvgUPamRfdHhfZ2V0X2ZyYW1lvwUQamRfdHhfZnJhbWVfc2VudMAFC2pkX3R4X2ZsdXNowQUQX19lcnJub19sb2NhdGlvbsIFDF9fZnBjbGFzc2lmecMFBWR1bW15xAUIX19tZW1jcHnFBQdtZW1tb3ZlxgUGbWVtc2V0xwUKX19sb2NrZmlsZcgFDF9fdW5sb2NrZmlsZckFBmZmbHVzaMoFBGZtb2TLBQ1fX0RPVUJMRV9CSVRTzAUMX19zdGRpb19zZWVrzQUNX19zdGRpb193cml0Zc4FDV9fc3RkaW9fY2xvc2XPBQhfX3RvcmVhZNAFCV9fdG93cml0ZdEFCV9fZndyaXRleNIFBmZ3cml0ZdMFFF9fcHRocmVhZF9tdXRleF9sb2Nr1AUWX19wdGhyZWFkX211dGV4X3VubG9ja9UFBl9fbG9ja9YFCF9fdW5sb2Nr1wUOX19tYXRoX2Rpdnplcm/YBQpmcF9iYXJyaWVy2QUOX19tYXRoX2ludmFsaWTaBQNsb2fbBQV0b3AxNtwFBWxvZzEw3QUHX19sc2Vla94FBm1lbWNtcN8FCl9fb2ZsX2xvY2vgBQxfX29mbF91bmxvY2vhBQxfX21hdGhfeGZsb3fiBQxmcF9iYXJyaWVyLjHjBQxfX21hdGhfb2Zsb3fkBQxfX21hdGhfdWZsb3flBQRmYWJz5gUDcG935wUFdG9wMTLoBQp6ZXJvaW5mbmFu6QUIY2hlY2tpbnTqBQxmcF9iYXJyaWVyLjLrBQpsb2dfaW5saW5l7AUKZXhwX2lubGluZe0FC3NwZWNpYWxjYXNl7gUNZnBfZm9yY2VfZXZhbO8FBXJvdW5k8AUGc3RyY2hy8QULX19zdHJjaHJudWzyBQZzdHJjbXDzBQZzdHJsZW70BQZtZW1jaHL1BQZzdHJzdHL2BQ50d29ieXRlX3N0cnN0cvcFEHRocmVlYnl0ZV9zdHJzdHL4BQ9mb3VyYnl0ZV9zdHJzdHL5BQ10d293YXlfc3Ryc3Ry+gUHX191Zmxvd/sFB19fc2hsaW38BQhfX3NoZ2V0Y/0FB2lzc3BhY2X+BQZzY2FsYm7/BQljb3B5c2lnbmyABgdzY2FsYm5sgQYNX19mcGNsYXNzaWZ5bIIGBWZtb2RsgwYFZmFic2yEBgtfX2Zsb2F0c2NhboUGCGhleGZsb2F0hgYIZGVjZmxvYXSHBgdzY2FuZXhwiAYGc3RydG94iQYGc3RydG9kigYSX193YXNpX3N5c2NhbGxfcmV0iwYIZGxtYWxsb2OMBgZkbGZyZWWNBhhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemWOBgRzYnJrjwYIX19hZGR0ZjOQBglfX2FzaGx0aTORBgdfX2xldGYykgYHX19nZXRmMpMGCF9fZGl2dGYzlAYNX19leHRlbmRkZnRmMpUGDV9fZXh0ZW5kc2Z0ZjKWBgtfX2Zsb2F0c2l0ZpcGDV9fZmxvYXR1bnNpdGaYBg1fX2ZlX2dldHJvdW5kmQYSX19mZV9yYWlzZV9pbmV4YWN0mgYJX19sc2hydGkzmwYIX19tdWx0ZjOcBghfX211bHRpM50GCV9fcG93aWRmMp4GCF9fc3VidGYznwYMX190cnVuY3RmZGYyoAYLc2V0VGVtcFJldDChBgtnZXRUZW1wUmV0MKIGCXN0YWNrU2F2ZaMGDHN0YWNrUmVzdG9yZaQGCnN0YWNrQWxsb2OlBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50pgYVZW1zY3JpcHRlbl9zdGFja19pbml0pwYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZagGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WpBhhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSqBgxkeW5DYWxsX2ppammrBhZsZWdhbHN0dWIkZHluQ2FsbF9qaWpprAYYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBqgYEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 27464;
var ___stop_em_js = Module['___stop_em_js'] = 28517;



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
