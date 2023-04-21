
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA5+GgIAAnQYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMGAgcHAgcHAwkFBQUFBxYKDAUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYABQICAgIAAwMFAAAAAQACBQAFBQMCAgMCAgMEAwMDCQYFAggAAgEBAAAAAAAAAAABAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEFAQMAAAEBAQEACgACAgABAQEAAQEAAQEAAAEAAAAABgICBgoAAQABAQIEBQEOAAIAAAAFAAAIAwkKAgIKAgMABgkDAQYFAwYJBgYFBgEBAQMDBQMDAwMDAwYGBgkMBgMDAwUFAwMDAwYFBgYGBgYGAQMPEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEAwUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBgUDAwQEAwwRAgIGDwMDAwMFBQMDAwQEBQUFBQEDAAMDBAIAAwACBQAEAwUFBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKDAICAAAHCQkBAwcBAgAIAAIGAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQQHBQcDAwUIBQAABB8BAw8DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDDggDAAQBAAkBAwMBAwYEDCAJCRcDAwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBghEAUEBAQFCQQEAAAUCwsLEwsQBQgHIgsUFAsYExISCyMkJSYLAwMDBAUDAwMDAwQXBAQZDRUnDSgGFikqBg8EBAAIBA0VGhoNESsCAggIFQ0NGQ0sAAgIAAQIBwgICC0MLgSHgICAAAFwAeoB6gEFhoCAgAABAYACgAIG3YCAgAAOfwFBgPsFC38BQQALfwFBAAt/AUEAC38AQfjYAQt/AEHn2QELfwBBsdsBC38AQa3cAQt/AEGp3QELfwBB+d0BC38AQZreAQt/AEGf4AELfwBB+NgBC38AQZXhAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAJIGFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgDIBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQCTBhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoANAFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACtBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAK4GGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UArwYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kALAGCXN0YWNrU2F2ZQCpBgxzdGFja1Jlc3RvcmUAqgYKc3RhY2tBbGxvYwCrBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9j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AS8BSiADTQ0AIAEoArgBIANBAnRqKAIAIQULAkAgBSIGDQAgAyEFDAMLAkACQCAGKAIMIgVFDQAgACABQQggBRCjAwwBCyAAIAM2AgAgAEECNgIECyADIQUgBkUNAgwECwJAIAMNACAAQgA3AwAMBAsgACADNgIAIABBCDYCBCABIAMQmQEMAwsgAyEFIANB5QBGDQELIAQgBTYCBCAEIAI2AgBBqwogBBA8IABCADcDAAwBCwJAIAEpADgiB0IAUg0AIAEoArABIgNFDQAgACADKQMgNwMADAELIAAgBzcDAAsgBEEQaiQAC88BAQJ/AkACQCAAKAIAIgMtAAZFDQAgAiECIAMtAAkNAQtBACECCwJAIAIiAkHoB08NAAJAIAMtAApFDQAgA0EUahD/BBogA0EAOgAKIAMoAhAQIiADQQA2AhALIANBADsBDiADIAI7AQwgAyABOgALQQAhBAJAIAJFDQAgAiABbBAhIQQLIAMgBCICNgIQAkAgAg0AIANBADsBDAsgA0EUaiAAKAIEEPgEGiADIAAoAgQtAA46AAogAygCEA8LQenPAEHRwQBBMUGnOxCtBQAL1gIBAn8jAEHAAGsiAyQAIAMgAjYCPCADIAEpAwA3AyBBACECAkAgA0EgahCuAw0AIAMgASkDADcDGAJAAkAgACADQRhqENECIgINACADIAEpAwA3AxAgACADQRBqENACIQEMAQsCQCAAIAIQ0gIiAQ0AQQAhAQwBCwJAIAAgAhCyAg0AIAEhAQwBC0EAIAEgAigCAEGAgID4AHFBgICAyABGGyEBCwJAAkAgASIEDQBBACEBDAELAkAgAygCPCIBRQ0AIAMgAUEQajYCPCADQTBqQfwAEIIDIANBKGogACAEEOcCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBkC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQrQIgAWohAgwBCyAAIAJBAEEAEK0CIAFqIQILIANBwABqJAAgAgv4BwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEMgCIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGA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3QIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEIYDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEJMCIAFBIGokAAsOACAAIABBABDeAhDfAgsPACAAIABBABDeAp0Q3wILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahCuA0UNACABIAEpA2g3AxAgASAAIAFBEGoQ8wI2AgBBghkgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEIYDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEIwBIAEgASkDYDcDOCAAIAFBOGpBABCBAyECIAEgASkDaDcDMCABIAAgAUEwahDzAjYCJCABIAI2AiBBtBkgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjQELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEIYDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEIEDIgJFDQAgAiABQSBqEOEEIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlQEQowMgACgCsAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPIAboQoAMgACgCsAEgASkDCDcDICABQRBqJAALoQECAX8BfiMAQTBrIgEkACABIABB2ABqKQMAIgI3AyggASACNwMQAkACQAJAIAAgAUEQakGPARCzA0UNABCgBSECDAELIAEgASkDKDcDCCAAIAFBCGpBmwEQswNFDQEQmQIhAgsgAUEINgIAIAEgAjcDICABIAFBIGo2AgQgAUEYaiAAQbsgIAEQhAMgACgCsAEgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAEN0CIQIgASAAQeAAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahDcASIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABCXAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8QlwMMAQsgAEG5AmogAjoAACAAQboCaiADLwEQOwEAIABBsAJqIAMpAwg3AgAgAy0AFCECIABBuAJqIAQ6AAAgAEGvAmogAjoAACAAQbwCaiADKAIcQQxqIAQQywUaIAAQkgILIAFBIGokAAukAgIDfwF+IwBB0ABrIgEkACAAQQAQ3QIhAiABIABB4ABqKQMAIgQ3A0gCQAJAIARQDQAgASABKQNINwM4IAAgAUE4ahD+Ag0AIAEgASkDSDcDMCABQcAAaiAAQcIAIAFBMGoQlQMMAQsCQCACQYCAgIB/cUGAgICAAUYNACABQcAAaiAAQZcVQQAQkwMMAQsgASABKQNINwMoAkACQAJAIAAgAUEoaiACEJ8CIgNBA2oOAgEAAgsgASACNgIAIAFBwABqIABBiQsgARCSAwwCCyABIAEpA0g3AyAgASAAIAFBIGpBABCBAzYCECABQcAAaiAAQeo1IAFBEGoQkwMMAQsgA0EASA0AIAAoArABIAOtQoCAgIAghDcDIAsgAUHQAGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEOMCIgJFDQACQCACKAIEDQAgAiAAQRwQrgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEIIDCyABIAEpAwg3AwAgACACQfYAIAEQiAMgACACEOICCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDjAiICRQ0AAkAgAigCBA0AIAIgAEEgEK4CNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABCCAwsgASABKQMINwMAIAAgAkH2ACABEIgDIAAgAhDiAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ4wIiAkUNAAJAIAIoAgQNACACIABBHhCuAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQggMLIAEgASkDCDcDACAAIAJB9gAgARCIAyAAIAIQ4gILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEOMCIgJFDQACQCACKAIEDQAgAiAAQSIQrgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQYQBEIIDCyABIAEpAwg3AwAgACACQfYAIAEQiAMgACACEOICCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQygICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEMoCCyADQSBqJAALNAIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQjgMgABBZIAFBEGokAAumAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEJUDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFBhjZBABCTAwsgAiEBCwJAAkAgASIBRQ0AIAAgASgCHBChAwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEJUDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFBhjZBABCTAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhCiAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEJUDQQAhAgwBCwJAIAAgASgCEBB8IgINACABQRhqIABBhjZBABCTAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABB0DdBABCTAwwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCVA0EAIQAMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQYY2QQAQkwMLIAIhAAsCQCAAIgBFDQAgABB+CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoArABIQIgASAAQdgAaikDACIENwMAIAEgBDcDCCAAIAEQqAEhAyAAKAKwASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALGQAgACgCsAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABBwChBABCTAwwBCyAAIAJBf2pBARB9IgJFDQAgACgCsAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahDIAiIEQc+GA0sNACABKACoASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB5yIgA0EIahCWAwwBCyAAIAEgASgCoAEgBEH//wNxELgCIAApAwBCAFINACADQdgAaiABQQggASABQQIQrgIQjgEQowMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEIwBIANB0ABqQfsAEIIDIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahDZAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQtgIgAyAAKQMANwMQIAEgA0EQahCNAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahDIAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQlQMMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwHY1wFODQIgAEGQ7QAgAUEDdGovAQAQggMMAQsgACABKACoASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtBvRVB1D9BMUHfLxCtBQAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahCuAw0AIAFBOGogAEH9GxCUAwsgASABKQNINwMgIAFBOGogACABQSBqEIYDIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjAEgASABKQNINwMQAkAgACABQRBqIAFBOGoQgQMiAkUNACABQTBqIAAgAiABKAI4QQEQpQIgACgCsAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCNASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQ3QIhAiABIAEpAyA3AwgCQCABQQhqEK4DDQAgAUEYaiAAQecdEJQDCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEKgCIAAoArABIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKwASACNwMgDAELIAEgASkDCDcDACAAIAAgARCkA5sQ3wILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCsAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQpAOcEN8CCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoArABIAI3AyAMAQsgASABKQMINwMAIAAgACABEKQDEPYFEN8CCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEKEDCyAAKAKwASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahCkAyIERAAAAAAAAAAAY0UNACAAIASaEN8CDAELIAAoArABIAEpAxg3AyALIAFBIGokAAsVACAAEKEFuEQAAAAAAADwPaIQ3wILZAEFfwJAAkAgAEEAEN0CIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQoQUgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRDgAgsRACAAIABBABDeAhDhBRDfAgsYACAAIABBABDeAiAAQQEQ3gIQ7QUQ3wILLgEDfyAAQQAQ3QIhAUEAIQICQCAAQQEQ3QIiA0UNACABIANtIQILIAAgAhDgAgsuAQN/IABBABDdAiEBQQAhAgJAIABBARDdAiIDRQ0AIAEgA28hAgsgACACEOACCxYAIAAgAEEAEN0CIABBARDdAmwQ4AILCQAgAEEBENUBC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEKUDIQMgAiACKQMgNwMQIAAgAkEQahClAyEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoArABIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQpAMhBiACIAIpAyA3AwAgACACEKQDIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCsAFBACkDoHY3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKwASABKQMANwMgIAJBMGokAAsJACAAQQAQ1QELkwECA38BfiMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwAiBDcDGCABIAQ3AyACQCABQRhqEK4DDQAgASABKQMoNwMQIAAgAUEQahDNAiECIAEgASkDIDcDCCAAIAFBCGoQ0QIiA0UNACACRQ0AIAAgAiADEK8CCyAAKAKwASABKQMoNwMgIAFBMGokAAsJACAAQQEQ2QELmgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqENECIgNFDQAgAEEAEJABIgRFDQAgAkEgaiAAQQggBBCjAyACIAIpAyA3AxAgACACQRBqEIwBIAAgAyAEIAEQswIgAiACKQMgNwMIIAAgAkEIahCNASAAKAKwASACKQMgNwMgCyACQTBqJAALCQAgAEEAENkBC+MBAgN/AX4jAEHAAGsiASQAIAEgAEHYAGopAwAiBDcDOCABIABB4ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqEKsDIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQlQMMAQsgASABKQMwNwMYAkAgACABQRhqENECIgMNACABIAEpAzA3AxAgAUEoaiAAQTQgAUEQahCVAwwBCyACIAM2AgQgACgCsAEgASkDODcDIAsgAUHAAGokAAt1AQN/IwBBEGsiAiQAAkACQCABKAIEIgNBgIDA/wdxDQAgA0EPcUEIRw0AIAEoAgAiBEUNACAEIQMgBCgCAEGAgID4AHFBgICA2ABGDQELIAIgASkDADcDACACQQhqIABBLyACEJUDQQAhAwsgAkEQaiQAIAMLvgEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEJUDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAIvARIiAiABLwFKTw0AIAAgAjYCACAAQQI2AgQMAQsgAEIANwMACyADQSBqJAALsgEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEJUDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQQg2AgAgAyACQQhqNgIEIAAgAUG7ICADEIQDCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEJUDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQRhqIAIpAwgQswUgAyADQRhqNgIAIAAgAUHZGiADEIQDCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEJUDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABUQoQMLIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQlQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEBChAwsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCVA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUEKEDCyADQSBqJAALogEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEJUDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXEQogMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQlQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFEEBcUUQogMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQlQNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAUEIIAIoAhwQowMLIANBIGokAAvLAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQlQNBACECCwJA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QbgCaiADIAdrOgAAIAJBMGokAAvXAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEL4CIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQZ8eIAFBEGoQlgNBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQZIeIAFBCGoQlgNBACEDCwJAIAMiA0UNACAAIAMQ+QEgACABKAIkIAMvAQJB/x9xQYDAAHIQkQILIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQvgIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBnx4gA0EIahCWA0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQAC4kBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEL4CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZ8eIANBCGoQlgNBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BADYCACAAQQQ2AgQLIANBMGokAAuGAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahC+AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGfHiADQQhqEJYDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQJB/x9xEKEDCyADQTBqJAALzgECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahC+AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGfHiABQRBqEJYDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGSHiABQQhqEJYDQQAhAwsCQCADIgNFDQAgACADEPkBIAAgASgCJCADLwECEJECCyABQcAAaiQAC2QBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqEJUDDAELIAAgASACKAIAEMICQQBHEKIDCyADQRBqJAALYwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQlQMMAQsgACABIAEgAigCABDBAhC6AgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahCVA0H//wEhAgwBCyABKAIoIQILAkAgAiICQf//AUYNACAAQQAQ3QIhAyABIABB4ABqKQMAIgY3AyggASAGNwMIIAAgAUEIaiABQRxqEKoDIQQCQCADQYCABEkNACABQSBqIABB3QAQlwMMAQsCQCABKAIcIgVB7QFJDQAgAUEgaiAAQd4AEJcDDAELIABBuAJqIAU6AAAgAEG8AmogBCAFEMsFGiAAIAIgAxCRAgsgAUEwaiQAC2kCAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDCCADIAQ3AxACQAJAIAEgA0EIahC9AiICDQAgAyADKQMQNwMAIANBGGogAUGdASADEJUDIABCADcDAAwBCyAAIAIoAgQQoQMLIANBIGokAAtwAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQvQIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxCVAyAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EgaiQAC5MBAgJ/AX4jAEHAAGsiASQAIAEgACkDUCIDNwMYIAEgAzcDMAJAAkAgACABQRhqEL0CIgINACABIAEpAzA3AwggAUE4aiAAQZ0BIAFBCGoQlQMMAQsgASAAQdgAaikDACIDNwMQIAEgAzcDICABQShqIAAgAiABQRBqEMUCIAAoArABIAEpAyg3AyALIAFBwABqJAALwwECAn8BfiMAQcAAayIBJAAgASAAKQNQIgM3AxggASADNwMwAkACQAJAIAAgAUEYahC9Ag0AIAEgASkDMDcDACABQThqIABBnQEgARCVAwwBCyAB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ByEHIApFDQALCwJAAkAgByIGDQBCACELDAELIAYpAwAhCwsgACALNwMAIARBwABqJAAPC0GD2gBB/T1BxANB4B4QrQUAC0H4ygBB/T1BPUHmLBCtBQALQfjKAEH9PUE9QeYsEK0FAAvsAQIDfwF+IwBBIGsiAyQAAkACQCACDQBBACEEDAELIAMgASkDADcDEEEAIQQgA0EQahCuAw0AIAMgASkDACIGNwMIIAMgBjcDGCAAIANBCGpBABDOAiEEIABCADcDMCADIAEpAwAiBjcDACADIAY3AxggACADQQIQzgIhBSAAQgA3AzBBACEBAkAgBEUNAAJAIAQgBUYNACAEIQEMAQsgACAEENICIQELQQAhBCABIgFFDQAgASEBA0ACQCABIgEgAkYiBEUNACAEIQQMAgsgACABENICIgUhASAEIQQgBQ0ACwsgA0EgaiQAIAQLiAECAn8BfiMAQTBrIgQkACABIAMpAwA3AzAgBCACKQMAIgY3AyAgBCAGNwMoIAEgBEEgakEAEM4CIQUgAUIANwMwIAQgAykDADcDGCAEQShqIAEgBSAEQRhqENQCIAQgAikDADcDECAEIAQpAyg3AwggACABIARBEGogBEEIahDGAiAEQTBqJAALnQIBAn8jAEEwayIEJAACQAJAIANBgcADSQ0AIABCADcDAAwBCyAEIAIpAwA3AyACQCABIARBIGogBEEsahCqAyIFRQ0AIAQoAiwgA00NACAEIAIpAwA3AxACQCABIARBEGoQ/gJFDQAgBCACKQMANwMIAkAgASAEQQhqIAMQmQMiA0F/Sg0AIABCADcDAAwDCyAFIANqIQMgACABQQggASADIAMQnAMQlQEQowMMAgsgACAFIANqLQAAEKEDDAELIAQgAikDADcDGAJAIAEgBEEYahCrAyIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBMGokAAu+BAIBfwJ+IwBBsAFrIgQkACAEIAMpAwA3A5ABAkACQCAEQZABahD/AkUNACAEIAIpAwAiBTcDiAEgBCAFNwOoAQJAIAEgBEGIAWoQrAMNACAEIAQpA6gBNwOAASABIARBgAFqEKcDDQAgBCAEKQOoATcDeCABIARB+ABqEP4CRQ0BCyAEIAMpAwA3AxAgASAEQRBqEKUDIQMgBCACKQMANwMIIAAgASAEQQhqIAMQ1wIMAQsgBCADKQMANwNwAkAgASAEQfAAahD+AkUNACAEIAMpAwAiBjcDoAEgBCACKQMAIgU3A5gBIAEgBjcDMCAEIAU3AzAgBCAFNwOoASABIARBMGpBABDOAiEDIAFCADcDMCAEIAQpA6ABNwMoIARBqAFqIAEgAyAEQShqENQCIAQgBCkDmAE3AyAgBCAEKQOoATcDGCAAIAEgBEEgaiAEQRhqEMYCDAELIAQgAykDADcDaCAEQagBaiABIARB6ABqEIYDIAMgBCkDqAE3AwAgBCADKQMANwNgIAEgBEHgAGoQjAEgBCADKQMAIgY3A6ABIAQgAikDACIFNwOYASABIAY3AzAgBCAFNwNYIAQgBTcDqAEgASAEQdgAakEAEM4CIQIgAUIANwMwIAQgBCkDoAE3A1AgBEGoAWogASACIARB0ABqENQCIAQgBCkDmAE3A0ggBCAEKQOoATcDQCAAIAEgBEHIAGogBEHAAGoQxgIgBCADKQMANwM4IAEgBEE4ahCNAQsgBEGwAWokAAvxAwIBfwF+IwBBkAFrIgQkACAEIAIpAwA3A4ABAkACQCAEQYABahD/AkUNACAEIAEpAwAiBTcDeCAEIAU3A4gBAkAgACAEQfgAahCsAw0AIAQgBCkDiAE3A3AgACAEQfAAahCnAw0AIAQgBCkDiAE3A2ggACAEQegAahD+AkUNAQsgBCACKQMANwMYIAAgBEEYahClAyECIAQgASkDADcDECAEIAMpAwA3AwggACAEQRBqIAIgBEEIahDaAgwBCyAAIAIpAwA3AzAgBCABKQMAIgU3A2AgBCAFNwOIAQJAIAAgBEHgAGpBARDOAiIBRQ0AAkACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0HU2QBB/T1BwAZBsAsQrQUACyAAQgA3AzAgAUUNASAEIAIpAwA3A1gCQCAAIARB2ABqEP4CRQ0AIAQgAikDADcDKCAEIAMpAwA3AyAgACABIARBKGogBEEgahCwAgwCCyAEIAIpAwA3A1AgBEGIAWogACAEQdAAahCGAyACIAQpA4gBNwMAIAQgAikDADcDSCAAIARByABqEIwBIAQgAikDADcDQCAEIAMpAwA3AzggACABIARBwABqIARBOGoQsAIgBCACKQMANwMwIAAgBEEwahCNAQwBCyAAQgA3AzALIARBkAFqJAALtQMCBH8BfiMAQdAAayIEJAACQAJAIAJBgcADSQ0AIARByABqIABBDxCXAwwBCyAEIAEpAwA3AzgCQCAAIARBOGoQqANFDQAgBCABKQMANwMgIAAgBEEgaiAEQcQAahCpAyEBAkAgBCgCRCIFIAJNDQAgBCADKQMANwMIIAEgAmogACAEQQhqEKUDOgAADAILIAQgAjYCECAEIAU2AhQgBEHIAGogAEGKDSAEQRBqEJMDDAELIAQgASkDADcDMAJAIAAgBEEwahCrAyIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQACQCACQYE4SQ0AIARByABqIABBDxCXAwwCCyADKQMAIQgCQCACQQFqIgEgBS8BCk0NACAAIAFBCmxBA3YiA0EEIANBBEsbIgZBA3QQiAEiA0UNAgJAIAUoAgwiB0UNACADIAcgBS8BCEEDdBDLBRoLIAUgBjsBCiAFIAM2AgwgACgC2AEgAxCJAQsgBSgCDCACQQN0aiAINwMAIAUvAQggAksNASAFIAE7AQgMAQsgBCABKQMANwMoIARByABqIABBDyAEQShqEJUDCyAEQdAAaiQAC70BAQV/IwBBEGsiBCQAAkACQCACQYE4SQ0AIARBCGogAEEPEJcDDAELAkAgAkEBaiIFIAEvAQpNDQAgACAFQQpsQQN2IgZBBCAGQQRLGyIHQQN0EIgBIgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQywUaCyABIAc7AQogASAGNgIMIAAoAtgBIAYQiQELIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAAL8gECBn8BfiMAQSBrIgMkACADIAIpAwA3AxAgACADQRBqEIwBAkACQCABLwEIIgRBgThJDQAgA0EYaiAAQQ8QlwMMAQsgAikDACEJIARBAWohBQJAIAQgAS8BCkkNACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQiAEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBDLBRoLIAEgBzsBCiABIAY2AgwgACgC2AEgBhCJAQsgASgCDCAEQQN0aiAJNwMAIAEvAQggBEsNACABIAU7AQgLIAMgAikDADcDCCAAIANBCGoQjQEgA0EgaiQACz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB2ABqKQMAIgM3AwAgAiADNwMIIAAgAhClAyEAIAJBEGokACAAC0ADAX8BfgF8IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEKQDIQQgAkEQaiQAIAQLLAEBfyMAQRBrIgIkACACQQhqIAEQoAMgACgCsAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQoQMgACgCsAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQogMgACgCsAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEKMDIAAoArABIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahCrAyICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABBoTVBABCSA0EAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoArABDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahCtAyEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQShJDQAgAEIANwMADwsCQCABIAIQrgIiA0Hg5wBrQQxtQSdLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEKMDC/8BAQJ/IAIhAwNAAkAgAyICQeDnAGtBDG0iA0EnSw0AAkAgASADEK4CIgJB4OcAa0EMbUEnSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhCjAw8LAkAgAiABKACoASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQZ/aAEH9PUGrCUHyLBCtBQALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQeDnAGtBDG1BKEkNAQsLIAAgAUEIIAIQowMLJAACQCABLQAUQQpJDQAgASgC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AjYCcCAAIAFB3cYAIANB8ABqEIQDDAcLIABCpoCBgMAANwMADAYLQYXBAEHEAUGKKRCoBQALIAIoAgBBgIABTw0FIAMgAikDACIHNwOAAiADIAc3A6gBIAEgA0GoAWogA0HMAmoQqgMiBEUNBgJAIAMoAswCIgJBIUkNACADIAQ2AogBIANBIDYChAEgAyACNgKAASAAIAFBiMcAIANBgAFqEIQDDAULIAMgBDYCmAEgAyACNgKUASADIAI2ApABIAAgAUGuxgAgA0GQAWoQhAMMBAsgAyABIAIoAgAQwwI2ArABIAAgAUH5xQAgA0GwAWoQhAMMAwsgAyACKQMANwP4AQJAIAEgA0H4AWoQvQIiBEUNACAELwEAIQIgAyABKAKoATYC9AEgAyADQfQBaiACQQAQwwM2AvABIAAgAUGRxgAgA0HwAWoQhAMMAwsgAyACKQMANwPoASABIANB6AFqIANBgAJqEL4CIQICQCADKAKAAiIEQf//AUcNACABIAIQwAIhBSABKAKoASIEIAQoAmBqIAVBBHRqLwEAIQUgAyAENgLMASADQcwBaiAFQQAQwwMhBCACLwEAIQIgAyABKAKoATYCyAEgAyADQcgBaiACQQAQwwM2AsQBIAMgBDYCwAEgACABQcjFACADQcABahCEAwwDCyABIAQQwwIhBCACLwEAIQIgAyABKAKoATYC5AEgAyADQeQBaiACQQAQwwM2AtQBIAMgBDYC0AEgACABQbrFACADQdABahCEAwwCC0GFwQBB3AFBiikQqAUACyADIAIpAwA3AwggA0GAAmogASADQQhqEKQDQQcQsAUgAyADQYACajYCACAAIAFB2RogAxCEAwsgA0HQAmokAA8LQY/XAEGFwQBBxwFBiikQrQUAC0HtywBBhcEAQfQAQfkoEK0FAAujAQECfyMAQTBrIgMkACADIAIpAwA3AyACQCABIANBIGogA0EsahCqAyIERQ0AAkACQCADKAIsIgJBIUkNACADIAQ2AgggA0EgNgIEIAMgAjYCACAAIAFBiMcAIAMQhAMMAQsgAyAENgIYIAMgAjYCFCADIAI2AhAgACABQa7GACADQRBqEIQDCyADQTBqJAAPC0HtywBBhcEAQfQAQfkoEK0FAAvIAgECfyMAQdAAayIEJAAgBCADKQMANwMwIAAgBEEwahCMASAE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ACkDqHY3AwALNwEBfwJAIAIoAkwiAyABKAIQLwEITw0AIAAgASADQQN0akEYaikDADcDAA8LIAAgAkHzABCBAQs4AQF/AkAgAigCTCIDIAIoAqgBLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkH2ABCBAQtxAQF/IwBBIGsiAyQAIANBGGogAhCjBCADIAMpAxg3AxACQAJAAkAgA0EQahD/Ag0AIAMoAhwNASADKAIYQQJHDQELIAAgAykDGDcDAAwBCyADIAMpAxg3AwggACACIANBCGoQpAMQoAMLIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhCjBCADQRBqIAIQowQgAyADKQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADENgCIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARCjBCACQSBqIAEQowQgAkEYaiABEKMEIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQ2QIgAkEwaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQowQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIABciIEELUDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENYCCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQowQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIACciIEELUDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENYCCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQowQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIADciIEELUDDQAgA0IANwMwDAELIAMgBDYCMCAD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IAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQywUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAL89gFFDQBBACgC/PYBENAFIQELAkBBACgC8NgBRQ0AQQAoAvDYARDQBSABciEBCwJAEOYFKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABDOBSECCwJAIAAoAhQgACgCHEYNACAAENAFIAFyIQELAkAgAkUNACAAEM8FCyAAKAI4IgANAAsLEOcFIAEPC0EAIQICQCAAKAJMQQBIDQAgABDOBSECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEFABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoERAAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQzwULIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQ0gUhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBUIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAFQQEgBmuthiEDDAELIAVC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBEIAUw0AA0AgB0F/aiEH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AGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQogYgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABCiBiADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EKIGIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORCiBiADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQogYgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEJgGRQ0AIAMgBBCIBiEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBCiBiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEJoGIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChCYBkEASg0AAkAgASAJIAMgChCYBkUNACABIQQMAgsgBUHwAGogASACQgBCABCiBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQogYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEKIGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABCiBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQogYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EKIGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkG81wFqKAIAIQYgAkGw1wFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEIMGIQILIAIQhAYNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARCDBiECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEIMGIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMN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DQFBACAANgKY9wEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBeHFBuPcBaiECAkACQEEAKAKQ9wEiBEEBIABBA3Z0IgBxDQBBACAEIAByNgKQ9wEgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QcD5AWohBAJAAkACQAJAQQAoApT3ASIGQQEgAnQiA3ENAEEAIAYgA3I2ApT3ASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCsPcBQX9qIgFBfyABGzYCsPcBCwsHAD8AQRB0C1QBAn9BACgC9NgBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEJQGTQ0AIAAQFUUNAQtBACAANgL02AEgAQ8LEMgFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahCXBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQlwZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEJcGIAVBMGogCiABIAcQoQYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxCXBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahCXBiAFIAIgBEEBIAZrEKEGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBCfBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCgBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEJcGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQlwYgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQowYgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQowYgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQowYgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQowYgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQowYgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQowYgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQowYgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQowYgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQowYgBUGQAWogA0IPhkIAIARCABCjBiAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEKMGIAVBgAFqQgEgAn1CACAEQgAQowYgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhCjBiABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhCjBiABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEKEGIAVBMGogFiATIAZB8ABqEJcGIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEKMGIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQowYgBSADIA5CBUIAEKMGIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahCXBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCXBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEJcGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEJcGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEJcGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJcGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEJcGIAVBIGogAiAEIAYQlwYgBUEQaiASIAEgBxChBiAFIAIgBCAHEKEGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCWBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQlwYgAiAAIARBgfgAIANrEKEGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBgPsFJANBgPsBQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEQAAslAQF+IAAgASACrSADrUIghoQgBBCxBiEFIAVCIIinEKcGIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC67ZgYAAAwBBgAgLyM8BaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBzdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGRlbGF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGRldnNfamRfc2VuZF9yYXcAaWRpdgBwcmV2ACVzXyV1AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydAByZXN0YXJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzADB4MXh4eHh4eHggZXhwZWN0ZWQgZm9yIHNlcnZpY2UgY2xhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3ogPT0gcy0+aW5uZXIuc2l6ZQBzdGF0ZS5vZmYgKyAzIDw9IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAF9hbGxvY1JvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAamRpZjogYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAHJvbGUgbmFtZSAnJXMnIGFscmVhZHkgdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABqZGlmOiBjcmVhdGUgcm9sZSAnJXMnIC0+ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvdXRmOC5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBbQnVmZmVyWyV1XSAlKnBdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0leCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlKnAuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBzeiA9PSBsZW4gJiYgc3ogPCBERVZTX01BWF9BU0NJSV9TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/ACVjICAlcyA9PgB3c3NrOgB1dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHIgPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uACEgIC4uLgAsAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBkZXZzX2hhbmRsZV90eXBlKHYpID09IERFVlNfSEFORExFX1RZUEVfR0NfT0JKRUNUICYmIGRldnNfaXNfc3RyaW5nKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBFeGNlcHRpb246IFBhbmljXyVkIGF0IChncGM6JWQpACogIGF0IHVua25vd24gKGdwYzolZCkAKiAgYXQgJXNfRiVkIChwYzolZCkAISAgYXQgJXNfRiVkIChwYzolZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpACVzIChXU1NLKQAhdGFyZ2V0X2luX2lycSgpAGZzdG9yOiBpbnZhbGlkIGxhcmdlIGtleTog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ZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AAOP9gIAABG5hbWUB83y0BgANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBARVfZGV2c19pbnZhbGlkX3Byb2dyYW2CAQ9kZXZzX2ZpYmVyX3Bva2WDARZkZXZzX2djX29ial9jaGVja19jb3JlhAETamRfZ2NfYW55X3RyeV9hbGxvY4UBB2RldnNfZ2OGAQ9maW5kX2ZyZWVfYmxvY2uHARJkZXZzX2FueV90cnlfYWxsb2OIAQ5kZXZzX3RyeV9hbGxvY4kBC2pkX2djX3VucGluigEKamRfZ2NfZnJlZYsBFGRldnNfdmFsdWVfaXNfcGlubmVkjAEOZGV2c192YWx1ZV9waW6NARBkZXZzX3ZhbHVlX3VucGlujgESZGV2c19tYXBfdHJ5X2FsbG9jjwEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkAEUZGV2c19hcnJheV90cnlfYWxsb2ORARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OSARVkZXZzX3N0cmluZ190cnlfYWxsb2OTARBkZXZzX3N0cmluZ19wcmVwlAESZGV2c19zdHJpbmdfZmluaXNolQEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSWAQ9kZXZzX2djX3NldF9jdHiXAQ5kZXZzX2djX2NyZWF0ZZgBD2RldnNfZ2NfZGVzdHJveZkBEWRldnNfZ2Nfb2JqX2NoZWNrmgELc2Nhbl9nY19vYmqbARFwcm9wX0FycmF5X2xlbmd0aJwBEm1ldGgyX0FycmF5X2luc2VydJ0BEmZ1bjFfQXJyYXlfaXNBcnJheZ4BEG1ldGhYX0FycmF5X3B1c2ifARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WgARFtZXRoWF9BcnJheV9zbGljZaEBEG1ldGgxX0FycmF5X2pvaW6iARFmdW4xX0J1ZmZlcl9hbGxvY6MBEGZ1bjFfQnVmZmVyX2Zyb22kARJwcm9wX0J1ZmZlcl9sZW5ndGilARVtZXRoMV9CdWZmZXJfdG9TdHJpbmemARNtZXRoM19CdWZmZXJfZmlsbEF0pwETbWV0aDRfQnVmZmVyX2JsaXRBdKgBFGRldnNfY29tcHV0ZV90aW1lb3V0qQEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCqARdmdW4xX0RldmljZVNjcmlwdF9kZWxheasBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6wBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdK0BGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnSuARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSvARdmdW4yX0RldmljZVNjcmlwdF9wcmludLABHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSxARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLIBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByswEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme0ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO1ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVytgEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmS3ARxmdW4yX0RldmljZVNjcmlwdF9fYWxsb2NSb2xluAEUbWV0aDFfRXJyb3JfX19jdG9yX1+5ARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fugEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fuwEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+8AQ9wcm9wX0Vycm9yX25hbWW9ARFtZXRoMF9FcnJvcl9wcmludL4BD3Byb3BfRHNGaWJlcl9pZL8BFnByb3BfRHNGaWJlcl9zdXNwZW5kZWTAARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZcEBF21ldGgwX0RzRmliZXJfdGVybWluYXRlwgEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZMMBEWZ1bjBfRHNGaWJlcl9zZWxmxAEUbWV0aFhfRnVuY3Rpb25fc3RhcnTFARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZcYBEnByb3BfRnVuY3Rpb25fbmFtZccBD2Z1bjJfSlNPTl9wYXJzZcgBE2Z1bjNfSlNPTl9zdHJpbmdpZnnJAQ5mdW4xX01hdGhfY2VpbMoBD2Z1bjFfTWF0aF9mbG9vcssBD2Z1bjFfTWF0aF9yb3VuZMwBDWZ1bjFfTWF0aF9hYnPNARBmdW4wX01hdGhfcmFuZG9tzgETZnVuMV9NYXRoX3JhbmRvbUludM8BDWZ1bjFfTWF0aF9sb2fQAQ1mdW4yX01hdGhfcG930QEOZnVuMl9NYXRoX2lkaXbSAQ5mdW4yX01hdGhfaW1vZNMBDmZ1bjJfTWF0aF9pbXVs1AENZnVuMl9NYXRoX21pbtUBC2Z1bjJfbWlubWF41gENZnVuMl9NYXRoX21heNcBEmZ1bjJfT2JqZWN0X2Fzc2lnbtgBEGZ1bjFfT2JqZWN0X2tleXPZARNmdW4xX2tleXNfb3JfdmFsdWVz2gESZnVuMV9PYmplY3RfdmFsdWVz2wEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bcAR1kZXZzX3ZhbHVlX3RvX3BhY2tldF9vcl90aHJvd90BEnByb3BfRHNQYWNrZXRfcm9sZd4BHnByb3BfRHNQYWNrZXRfZGV2aWNlSWRlbnRpZmllct8BFXByb3BfRHNQYWNrZXRfc2hvcnRJZOABGnByb3BfRHNQYWNrZXRfc2VydmljZUluZGV44QEccHJvcF9Ec1BhY2tldF9zZXJ2aWNlQ29tbWFuZOIBE3Byb3BfRHNQYWNrZXRfZmxhZ3PjARdwcm9wX0RzUGFja2V0X2lzQ29tbWFuZOQBFnByb3BfRHNQYWNrZXRfaXNSZXBvcnTlARVwcm9wX0RzUGFja2V0X3BheWxvYWTmARVwcm9wX0RzUGFja2V0X2lzRXZlbnTnARdwcm9wX0RzUGFja2V0X2V2ZW50Q29kZegBFnByb3BfRHNQYWNrZXRfaXNSZWdTZXTpARZwcm9wX0RzUGFja2V0X2lzUmVnR2V06gEVcHJvcF9Ec1BhY2tldF9yZWdDb2Rl6wEWcHJvcF9Ec1BhY2tldF9pc0FjdGlvbuwBFWRldnNfcGt0X3NwZWNfYnlfY29kZe0BEnByb3BfRHNQYWNrZXRfc3BlY+4BEWRldnNfcGt0X2dldF9zcGVj7wEVbWV0aDBfRHNQYWNrZXRfZGVjb2Rl8AEdbWV0aDBfRHNQYWNrZXRfbm90SW1wbGVtZW50ZWTxARhwcm9wX0RzUGFja2V0U3BlY19wYXJlbnTyARZwcm9wX0RzUGFja2V0U3BlY19uYW1l8wEWcHJvcF9Ec1BhY2tldFNwZWNfY29kZfQBGnByb3BfRHNQYWNrZXRTcGVjX3Jlc3BvbnNl9QEZbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZfYBEmRldnNfcGFja2V0X2RlY29kZfcBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZPgBFERzUmVnaXN0ZXJfcmVhZF9jb250+QESZGV2c19wYWNrZXRfZW5jb2Rl+gEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZfsBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGX8ARZwcm9wX0RzUGFja2V0SW5mb19uYW1l/QEWcHJvcF9Ec1BhY2tldEluZm9fY29kZf4BGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX/8BE3Byb3BfRHNSb2xlX2lzQm91bmSAAhBwcm9wX0RzUm9sZV9zcGVjgQIYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5kggIicHJvcF9Ec1NlcnZpY2VTcGVjX2NsYXNzSWRlbnRpZmllcoMCF3Byb3BfRHNTZXJ2aWNlU3BlY19uYW1lhAIabWV0aDFfRHNTZXJ2aWNlU3BlY19sb29rdXCFAhptZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnboYCEnByb3BfU3RyaW5nX2xlbmd0aIcCF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0iAITbWV0aDFfU3RyaW5nX2NoYXJBdIkCEm1ldGgyX1N0cmluZ19zbGljZYoCGGZ1blhfU3RyaW5nX2Zyb21DaGFyQ29kZYsCDGRldnNfaW5zcGVjdIwCC2luc3BlY3Rfb2JqjQIHYWRkX3N0co4CDWluc3BlY3RfZmllbGSPAhRkZXZzX2pkX2dldF9yZWdpc3RlcpACFmRldnNfamRfY2xlYXJfcGt0X2tpbmSRAhBkZXZzX2pkX3NlbmRfY21kkgIQZGV2c19qZF9zZW5kX3Jhd5MCE2RldnNfamRfc2VuZF9sb2dtc2eUAhNkZXZzX2pkX3BrdF9jYXB0dXJllQIRZGV2c19qZF93YWtlX3JvbGWWAhJkZXZzX2pkX3Nob3VsZF9ydW6XAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZZgCE2RldnNfamRfcHJvY2Vzc19wa3SZAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWSaAhJkZXZzX2pkX2FmdGVyX3VzZXKbAhRkZXZzX2pkX3JvbGVfY2hhbmdlZJwCFGRldnNfamRfcmVzZXRfcGFja2V0nQISZGV2c19qZF9pbml0X3JvbGVzngISZGV2c19qZF9mcmVlX3JvbGVznwISZGV2c19qZF9hbGxvY19yb2xloAIVZGV2c19zZXRfZ2xvYmFsX2ZsYWdzoQIXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3OiAhVkZXZzX2dldF9nbG9iYWxfZmxhZ3OjAhBkZXZzX2pzb25fZXNjYXBlpAIVZGV2c19qc29uX2VzY2FwZV9jb3JlpQIPZGV2c19qc29uX3BhcnNlpgIKanNvbl92YWx1ZacCDHBhcnNlX3N0cmluZ6gCE2RldnNfanNvbl9zdHJpbmdpZnmpAg1zdHJpbmdpZnlfb2JqqgIRcGFyc2Vfc3RyaW5nX2NvcmWrAgphZGRfaW5kZW50rAIPc3RyaW5naWZ5X2ZpZWxkrQIRZGV2c19tYXBsaWtlX2l0ZXKuAhdkZXZzX2dldF9idWlsdGluX29iamVjdK8CEmRldnNfbWFwX2NvcHlfaW50b7ACDGRldnNfbWFwX3NldLECBmxvb2t1cLICE2RldnNfbWFwbGlrZV9pc19tYXCzAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXO0AhFkZXZzX2FycmF5X2luc2VydLUCCGt2X2FkZC4xtgISZGV2c19zaG9ydF9tYXBfc2V0twIPZGV2c19tYXBfZGVsZXRluAISZGV2c19zaG9ydF9tYXBfZ2V0uQIgZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY19pZHi6AhxkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjuwIbZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjvAIeZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWNfaWR4vQIaZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWO+AhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldL8CGGRldnNfcm9sZV9zcGVjX2Zvcl9jbGFzc8ACF2RldnNfcGFja2V0X3NwZWNfcGFyZW50wQIOZGV2c19yb2xlX3NwZWPCAhFkZXZzX3JvbGVfc2VydmljZcMCDmRldnNfcm9sZV9uYW1lxAISZGV2c19nZXRfYmFzZV9zcGVjxQIQZGV2c19zcGVjX2xvb2t1cMYCEmRldnNfZnVuY3Rpb25fYmluZMcCEWRldnNfbWFrZV9jbG9zdXJlyAIOZGV2c19nZXRfZm5pZHjJAhNkZXZzX2dldF9mbmlkeF9jb3JlygIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxkywITZGV2c19nZXRfc3BlY19wcm90b8wCE2RldnNfZ2V0X3JvbGVfcHJvdG/NAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfOAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTPAhVkZXZzX2dldF9zdGF0aWNfcHJvdG/QAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm/RAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bdICFmRldnNfbWFwbGlrZV9nZXRfcHJvdG/TAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGTUAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmTVAhBkZXZzX2luc3RhbmNlX29m1gIPZGV2c19vYmplY3RfZ2V01wIMZGV2c19zZXFfZ2V02AIMZGV2c19hbnlfZ2V02QIMZGV2c19hbnlfc2V02gIMZGV2c19zZXFfc2V02wIOZGV2c19hcnJheV9zZXTcAhNkZXZzX2FycmF5X3Bpbl9wdXNo3QIMZGV2c19hcmdfaW503gIPZGV2c19hcmdfZG91Ymxl3wIPZGV2c19yZXRfZG91Ymxl4AIMZGV2c19yZXRfaW504QINZGV2c19yZXRfYm9vbOICD2RldnNfcmV0X2djX3B0cuMCEWRldnNfYXJnX3NlbGZfbWFw5AIRZGV2c19zZXR1cF9yZXN1bWXlAg9kZXZzX2Nhbl9hdHRhY2jmAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVl5wIVZGV2c19tYXBsaWtlX3RvX3ZhbHVl6AISZGV2c19yZWdjYWNoZV9mcmVl6QIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbOoCF2RldnNfcmVnY2FjaGVfbWFya191c2Vk6wITZGV2c19yZWdjYWNoZV9hbGxvY+wCFGRldnNfcmVnY2FjaGVfbG9va3Vw7QIRZGV2c19yZWdjYWNoZV9hZ2XuAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZe8CEmRldnNfcmVnY2FjaGVfbmV4dPACD2pkX3NldHRpbmdzX2dldPECD2pkX3NldHRpbmdzX3NldPICDmRldnNfbG9nX3ZhbHVl8wIPZGV2c19zaG93X3ZhbHVl9AIQZGV2c19zaG93X3ZhbHVlMPUCDWNvbnN1bWVfY2h1bmv2Ag1zaGFfMjU2X2Nsb3Nl9wIPamRfc2hhMjU2X3NldHVw+AIQamRfc2hhMjU2X3VwZGF0ZfkCEGpkX3NoYTI1Nl9maW5pc2j6AhRqZF9zaGEyNTZfaG1hY19zZXR1cPsCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaPwCDmpkX3NoYTI1Nl9oa2Rm/QIOZGV2c19zdHJmb3JtYXT+Ag5kZXZzX2lzX3N0cmluZ/8CDmRldnNfaXNfbnVtYmVygAMbZGV2c19zdHJpbmdfZ2V0X3V0Zjhfc3RydWN0gQMUZGV2c19zdHJpbmdfZ2V0X3V0ZjiCAxNkZXZzX2J1aWx0aW5fc3RyaW5ngwMUZGV2c19zdHJpbmdfdnNwcmludGaEAxNkZXZzX3N0cmluZ19zcHJpbnRmhQMVZGV2c19zdHJpbmdfZnJvbV91dGY4hgMUZGV2c192YWx1ZV90b19zdHJpbmeHAxBidWZmZXJfdG9fc3RyaW5niAMZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZIkDEmRldnNfc3RyaW5nX2NvbmNhdIoDEWRldnNfc3RyaW5nX3NsaWNliwMSZGV2c19wdXNoX3RyeWZyYW1ljAMRZGV2c19wb3BfdHJ5ZnJhbWWNAw9kZXZzX2R1bXBfc3RhY2uOAxNkZXZzX2R1bXBfZXhjZXB0aW9ujwMKZGV2c190aHJvd5ADEmRldnNfcHJvY2Vzc190aHJvd5EDEGRldnNfYWxsb2NfZXJyb3KSAxVkZXZzX3Rocm93X3R5cGVfZXJyb3KTAxZkZXZzX3Rocm93X3JhbmdlX2Vycm9ylAMeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9ylQMaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3KWAx5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHSXAxhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3KYAxdkZXZzX3Rocm93X3N5bnRheF9lcnJvcpkDEWRldnNfc3RyaW5nX2luZGV4mgMSZGV2c19zdHJpbmdfbGVuZ3RomwMZZGV2c191dGY4X2Zyb21fY29kZV9wb2ludJwDG2RldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aJ0DFGRldnNfdXRmOF9jb2RlX3BvaW50ngMUZGV2c19zdHJpbmdfam1wX2luaXSfAw5kZXZzX3V0ZjhfaW5pdKADFmRldnNfdmFsdWVfZnJvbV9kb3VibGWhAxNkZXZzX3ZhbHVlX2Zyb21faW50ogMUZGV2c192YWx1ZV9mcm9tX2Jvb2yjAxdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcqQDFGRldnNfdmFsdWVfdG9fZG91YmxlpQMRZGV2c192YWx1ZV90b19pbnSmAxJkZXZzX3ZhbHVlX3RvX2Jvb2ynAw5kZXZzX2lzX2J1ZmZlcqgDF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxlqQMQZGV2c19idWZmZXJfZGF0YaoDE2RldnNfYnVmZmVyaXNoX2RhdGGrAxRkZXZzX3ZhbHVlX3RvX2djX29iaqwDDWRldnNfaXNfYXJyYXmtAxFkZXZzX3ZhbHVlX3R5cGVvZq4DD2RldnNfaXNfbnVsbGlzaK8DGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSwAxRkZXZzX3ZhbHVlX2FwcHJveF9lcbEDEmRldnNfdmFsdWVfaWVlZV9lcbIDDWRldnNfdmFsdWVfZXGzAxxkZXZzX3ZhbHVlX2VxX2J1aWx0aW5fc3RyaW5ntAMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjtQMSZGV2c19pbWdfc3RyaWR4X29rtgMSZGV2c19kdW1wX3ZlcnNpb25ztwMLZGV2c192ZXJpZnm4AxFkZXZzX2ZldGNoX29wY29kZbkDDmRldnNfdm1fcmVzdW1lugMRZGV2c192bV9zZXRfZGVidWe7AxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzvAMYZGV2c192bV9jbGVhcl9icmVha3BvaW50vQMMZGV2c192bV9oYWx0vgMPZGV2c192bV9zdXNwZW5kvwMWZGV2c192bV9zZXRfYnJlYWtwb2ludMADFGRldnNfdm1fZXhlY19vcGNvZGVzwQMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHjCAxdkZXZzX2ltZ19nZXRfc3RyaW5nX2ptcMMDEWRldnNfaW1nX2dldF91dGY4xAMUZGV2c19nZXRfc3RhdGljX3V0ZjjFAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaMYDDGV4cHJfaW52YWxpZMcDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0yAMLc3RtdDFfY2FsbDDJAwtzdG10Ml9jYWxsMcoDC3N0bXQzX2NhbGwyywMLc3RtdDRfY2FsbDPMAwtzdG10NV9jYWxsNM0DC3N0bXQ2X2NhbGw1zgMLc3RtdDdfY2FsbDbPAwtzdG10OF9jYWxsN9ADC3N0bXQ5X2NhbGw40QMSc3RtdDJfaW5kZXhfZGVsZXRl0gMMc3RtdDFfcmV0dXJu0wMJc3RtdHhfam1w1AMMc3RtdHgxX2ptcF961QMKZXhwcjJfYmluZNYDEmV4cHJ4X29iamVjdF9maWVsZNcDEnN0bXR4MV9zdG9yZV9sb2NhbNgDE3N0bXR4MV9zdG9yZV9nbG9iYWzZAxJzdG10NF9zdG9yZV9idWZmZXLaAwlleHByMF9pbmbbAxBleHByeF9sb2FkX2xvY2Fs3AMRZXhwcnhfbG9hZF9nbG9iYWzdAwtleHByMV91cGx1c94DC2V4cHIyX2luZGV43wMPc3RtdDNfaW5kZXhfc2V04AMUZXhwcngxX2J1aWx0aW5fZmllbGThAxJleHByeDFfYXNjaWlfZmllbGTiAxFleHByeDFfdXRmOF9maWVsZOMDEGV4cHJ4X21hdGhfZmllbGTkAw5leHByeF9kc19maWVsZOUDD3N0bXQwX2FsbG9jX21hcOYDEXN0bXQxX2FsbG9jX2FycmF55wMSc3RtdDFfYWxsb2NfYnVmZmVy6AMXZXhwcnhfc3RhdGljX3NwZWNfcHJvdG/pAxNleHByeF9zdGF0aWNfYnVmZmVy6gMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5n6wMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ+wDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ+0DFWV4cHJ4X3N0YXRpY19mdW5jdGlvbu4DDWV4cHJ4X2xpdGVyYWzvAxFleHByeF9saXRlcmFsX2Y2NPADEWV4cHIzX2xvYWRfYnVmZmVy8QMNZXhwcjBfcmV0X3ZhbPIDDGV4cHIxX3R5cGVvZvMDD2V4cHIwX3VuZGVmaW5lZPQDEmV4cHIxX2lzX3VuZGVmaW5lZPUDCmV4cHIwX3RydWX2AwtleHByMF9mYWxzZfcDDWV4cHIxX3RvX2Jvb2z4AwlleHByMF9uYW75AwlleHByMV9hYnP6Aw1leHByMV9iaXRfbm90+wMMZXhwcjFfaXNfbmFu/AMJZXhwcjFfbmVn/QMJZXhwcjFfbm90/gMMZXhwcjFfdG9faW50/wMJZXhwcjJfYWRkgAQJZXhwcjJfc3VigQQJZXhwcjJfbXVsggQJZXhwcjJfZGl2gwQNZXhwcjJfYml0X2FuZIQEDGV4cHIyX2JpdF9vcoUEDWV4cHIyX2JpdF94b3KGBBBleHByMl9zaGlmdF9sZWZ0hwQRZXhwcjJfc2hpZnRfcmlnaHSIBBpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZIkECGV4cHIyX2VxigQIZXhwcjJfbGWLBAhleHByMl9sdIwECGV4cHIyX25ljQQQZXhwcjFfaXNfbnVsbGlzaI4EFHN0bXR4Ml9zdG9yZV9jbG9zdXJljwQTZXhwcngxX2xvYWRfY2xvc3VyZZAEEmV4cHJ4X21ha2VfY2xvc3VyZZEEEGV4cHIxX3R5cGVvZl9zdHKSBBNzdG10eF9qbXBfcmV0X3ZhbF96kwQQc3RtdDJfY2FsbF9hcnJheZQECXN0bXR4X3RyeZUEDXN0bXR4X2VuZF90cnmWBAtzdG10MF9jYXRjaJcEDXN0bXQwX2ZpbmFsbHmYBAtzdG10MV90aHJvd5kEDnN0bXQxX3JlX3Rocm93mgQQc3RtdHgxX3Rocm93X2ptcJsEDnN0bXQwX2RlYnVnZ2VynAQJZXhwcjFfbmV3nQQRZXhwcjJfaW5zdGFuY2Vfb2aeBApleHByMF9udWxsnwQPZXhwcjJfYXBwcm94X2VxoAQPZXhwcjJfYXBwcm94X25loQQTc3RtdDFfc3RvcmVfcmV0X3ZhbKIEEWV4cHJ4X3N0YXRpY19zcGVjowQPZGV2c192bV9wb3BfYXJnpAQTZGV2c192bV9wb3BfYXJnX3UzMqUEE2RldnNfdm1fcG9wX2FyZ19pMzKmBBZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVypwQSamRfYWVzX2NjbV9lbmNyeXB0qAQSamRfYWVzX2NjbV9kZWNyeXB0qQQMQUVTX2luaXRfY3R4qgQPQUVTX0VDQl9lbmNyeXB0qwQQamRfYWVzX3NldHVwX2tleawEDmpkX2Flc19lbmNyeXB0rQQQamRfYWVzX2NsZWFyX2tlea4EC2pkX3dzc2tfbmV3rwQUamRfd3Nza19zZW5kX21lc3NhZ2WwBBNqZF93ZWJzb2NrX29uX2V2ZW50sQQHZGVjcnlwdLIEDWpkX3dzc2tfY2xvc2WzBBBqZF93c3NrX29uX2V2ZW50tAQLcmVzcF9zdGF0dXO1BBJ3c3NraGVhbHRoX3Byb2Nlc3O2BBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZbcEFHdzc2toZWFsdGhfcmVjb25uZWN0uAQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0uQQPc2V0X2Nvbm5fc3RyaW5nugQRY2xlYXJfY29ubl9zdHJpbme7BA93c3NraGVhbHRoX2luaXS8BBF3c3NrX3NlbmRfbWVzc2FnZb0EEXdzc2tfaXNfY29ubmVjdGVkvgQUd3Nza190cmFja19leGNlcHRpb26/BBJ3c3NrX3NlcnZpY2VfcXVlcnnABBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplwQQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZcIED3JvbGVtZ3JfcHJvY2Vzc8MEEHJvbGVtZ3JfYXV0b2JpbmTEBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXTFBBRqZF9yb2xlX21hbmFnZXJfaW5pdMYEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZMcEDWpkX3JvbGVfYWxsb2PIBBBqZF9yb2xlX2ZyZWVfYWxsyQQWamRfcm9sZV9mb3JjZV9hdXRvYmluZMoEE2pkX2NsaWVudF9sb2dfZXZlbnTLBBNqZF9jbGllbnRfc3Vic2NyaWJlzAQUamRfY2xpZW50X2VtaXRfZXZlbnTNBBRyb2xlbWdyX3JvbGVfY2hhbmdlZM4EEGpkX2RldmljZV9sb29rdXDPBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XQBBNqZF9zZXJ2aWNlX3NlbmRfY21k0QQRamRfY2xpZW50X3Byb2Nlc3PSBA5qZF9kZXZpY2VfZnJlZdMEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V01AQPamRfZGV2aWNlX2FsbG9j1QQQc2V0dGluZ3NfcHJvY2Vzc9YEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXTXBA1zZXR0aW5nc19pbml02AQPamRfY3RybF9wcm9jZXNz2QQVamRfY3RybF9oYW5kbGVfcGFja2V02gQMamRfY3RybF9pbml02wQUZGNmZ19zZXRfdXNlcl9jb25maWfcBAlkY2ZnX2luaXTdBA1kY2ZnX3ZhbGlkYXRl3gQOZGNmZ19nZXRfZW50cnnfBAxkY2ZnX2dldF9pMzLgBAxkY2ZnX2dldF91MzLhBA9kY2ZnX2dldF9zdHJpbmfiBAxkY2ZnX2lkeF9rZXnjBAlqZF92ZG1lc2fkBBFqZF9kbWVzZ19zdGFydHB0cuUEDWpkX2RtZXNnX3JlYWTmBBJqZF9kbWVzZ19yZWFkX2xpbmXnBBNqZF9zZXR0aW5nc19nZXRfYmlu6AQKZmluZF9lbnRyeekED3JlY29tcHV0ZV9jYWNoZeoEE2pkX3NldHRpbmdzX3NldF9iaW7rBAtqZF9mc3Rvcl9nY+wEFWpkX3NldHRpbmdzX2dldF9sYXJnZe0EFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2XuBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZe8EFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XwBA1qZF9pcGlwZV9vcGVu8QQWamRfaXBpcGVfaGFuZGxlX3BhY2tldPIEDmpkX2lwaXBlX2Nsb3Nl8wQSamRfbnVtZm10X2lzX3ZhbGlk9AQVamRfbnVtZm10X3dyaXRlX2Zsb2F09QQTamRfbnVtZm10X3dyaXRlX2kzMvYEEmpkX251bWZtdF9yZWFkX2kzMvcEFGpkX251bWZtdF9yZWFkX2Zsb2F0+AQRamRfb3BpcGVfb3Blbl9jbWT5BBRqZF9vcGlwZV9vcGVuX3JlcG9ydPoEFmpkX29waXBlX2hhbmRsZV9wYWNrZXT7BBFqZF9vcGlwZV93cml0ZV9lePwEEGpkX29waXBlX3Byb2Nlc3P9BBRqZF9vcGlwZV9jaGVja19zcGFjZf4EDmpkX29waXBlX3dyaXRl/wQOamRfb3BpcGVfY2xvc2WABQ1qZF9xdWV1ZV9wdXNogQUOamRfcXVldWVfZnJvbnSCBQ5qZF9xdWV1ZV9zaGlmdIMFDmpkX3F1ZXVlX2FsbG9jhAUNamRfcmVzcG9uZF91OIUFDmpkX3Jlc3BvbmRfdTE2hgUOamRfcmVzcG9uZF91MzKHBRFqZF9yZXNwb25kX3N0cmluZ4gFF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkiQULamRfc2VuZF9wa3SKBR1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbIsFF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyjAUZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldI0FFGpkX2FwcF9oYW5kbGVfcGFja2V0jgUVamRfYXBwX2hhbmRsZV9jb21tYW5kjwUVYXBwX2dldF9pbnN0YW5jZV9uYW1lkAUTamRfYWxsb2NhdGVfc2VydmljZZEFEGpkX3NlcnZpY2VzX2luaXSSBQ5qZF9yZWZyZXNoX25vd5MFGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSUBRRqZF9zZXJ2aWNlc19hbm5vdW5jZZUFF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1llgUQamRfc2VydmljZXNfdGlja5cFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ5gFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlmQUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZZoFFGFwcF9nZXRfZGV2aWNlX2NsYXNzmwUSYXBwX2dldF9md192ZXJzaW9unAUNamRfc3J2Y2ZnX3J1bp0FF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1lngURamRfc3J2Y2ZnX3ZhcmlhbnSfBQ1qZF9oYXNoX2ZudjFhoAUMamRfZGV2aWNlX2lkoQUJamRfcmFuZG9togUIamRfY3JjMTajBQ5qZF9jb21wdXRlX2NyY6QFDmpkX3NoaWZ0X2ZyYW1lpQUMamRfd29yZF9tb3ZlpgUOamRfcmVzZXRfZnJhbWWnBRBqZF9wdXNoX2luX2ZyYW1lqAUNamRfcGFuaWNfY29yZakFE2pkX3Nob3VsZF9zYW1wbGVfbXOqBRBqZF9zaG91bGRfc2FtcGxlqwUJamRfdG9faGV4rAULamRfZnJvbV9oZXitBQ5qZF9hc3NlcnRfZmFpbK4FB2pkX2F0b2mvBQ9qZF92c3ByaW50Zl9leHSwBQ9qZF9wcmludF9kb3VibGWxBQtqZF92c3ByaW50ZrIFCmpkX3NwcmludGazBRJqZF9kZXZpY2Vfc2hvcnRfaWS0BQxqZF9zcHJpbnRmX2G1BQtqZF90b19oZXhfYbYFCWpkX3N0cmR1cLcFCWpkX21lbWR1cLgFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWW5BRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlugURamRfc2VuZF9ldmVudF9leHS7BQpqZF9yeF9pbml0vAUUamRfcnhfZnJhbWVfcmVjZWl2ZWS9BR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja74FD2pkX3J4X2dldF9mcmFtZb8FE2pkX3J4X3JlbGVhc2VfZnJhbWXABRFqZF9zZW5kX2ZyYW1lX3Jhd8EFDWpkX3NlbmRfZnJhbWXCBQpqZF90eF9pbml0wwUHamRfc2VuZMQFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmPFBQ9qZF90eF9nZXRfZnJhbWXGBRBqZF90eF9mcmFtZV9zZW50xwULamRfdHhfZmx1c2jIBRBfX2Vycm5vX2xvY2F0aW9uyQUMX19mcGNsYXNzaWZ5ygUFZHVtbXnLBQhfX21lbWNwecwFB21lbW1vdmXNBQZtZW1zZXTOBQpfX2xvY2tmaWxlzwUMX191bmxvY2tmaWxl0AUGZmZsdXNo0QUEZm1vZNIFDV9fRE9VQkxFX0JJVFPTBQxfX3N0ZGlvX3NlZWvUBQ1fX3N0ZGlvX3dyaXRl1QUNX19zdGRpb19jbG9zZdYFCF9fdG9yZWFk1wUJX190b3dyaXRl2AUJX19md3JpdGV42QUGZndyaXRl2gUUX19wdGhyZWFkX211dGV4X2xvY2vbBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr3AUGX19sb2Nr3QUIX191bmxvY2veBQ5fX21hdGhfZGl2emVyb98FCmZwX2JhcnJpZXLgBQ5fX21hdGhfaW52YWxpZOEFA2xvZ+IFBXRvcDE24wUFbG9nMTDkBQdfX2xzZWVr5QUGbWVtY21w5gUKX19vZmxfbG9ja+cFDF9fb2ZsX3VubG9ja+gFDF9fbWF0aF94Zmxvd+kFDGZwX2JhcnJpZXIuMeoFDF9fbWF0aF9vZmxvd+sFDF9fbWF0aF91Zmxvd+wFBGZhYnPtBQNwb3fuBQV0b3AxMu8FCnplcm9pbmZuYW7wBQhjaGVja2ludPEFDGZwX2JhcnJpZXIuMvIFCmxvZ19pbmxpbmXzBQpleHBfaW5saW5l9AULc3BlY2lhbGNhc2X1BQ1mcF9mb3JjZV9ldmFs9gUFcm91bmT3BQZzdHJjaHL4BQtfX3N0cmNocm51bPkFBnN0cmNtcPoFBnN0cmxlbvsFBm1lbWNocvwFBnN0cnN0cv0FDnR3b2J5dGVfc3Ryc3Ry/gUQdGhyZWVieXRlX3N0cnN0cv8FD2ZvdXJieXRlX3N0cnN0coAGDXR3b3dheV9zdHJzdHKBBgdfX3VmbG93ggYHX19zaGxpbYMGCF9fc2hnZXRjhAYHaXNzcGFjZYUGBnNjYWxiboYGCWNvcHlzaWdubIcGB3NjYWxibmyIBg1fX2ZwY2xhc3NpZnlsiQYFZm1vZGyKBgVmYWJzbIsGC19fZmxvYXRzY2FujAYIaGV4ZmxvYXSNBghkZWNmbG9hdI4GB3NjYW5leHCPBgZzdHJ0b3iQBgZzdHJ0b2SRBhJfX3dhc2lfc3lzY2FsbF9yZXSSBghkbG1hbGxvY5MGBmRsZnJlZZQGGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZZUGBHNicmuWBghfX2FkZHRmM5cGCV9fYXNobHRpM5gGB19fbGV0ZjKZBgdfX2dldGYymgYIX19kaXZ0ZjObBg1fX2V4dGVuZGRmdGYynAYNX19leHRlbmRzZnRmMp0GC19fZmxvYXRzaXRmngYNX19mbG9hdHVuc2l0Zp8GDV9fZmVfZ2V0cm91bmSgBhJfX2ZlX3JhaXNlX2luZXhhY3ShBglfX2xzaHJ0aTOiBghfX211bHRmM6MGCF9fbXVsdGkzpAYJX19wb3dpZGYypQYIX19zdWJ0ZjOmBgxfX3RydW5jdGZkZjKnBgtzZXRUZW1wUmV0MKgGC2dldFRlbXBSZXQwqQYJc3RhY2tTYXZlqgYMc3RhY2tSZXN0b3JlqwYKc3RhY2tBbGxvY6wGHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnStBhVlbXNjcmlwdGVuX3N0YWNrX2luaXSuBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlrwYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZbAGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZLEGDGR5bkNhbGxfamlqabIGFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammzBhhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGxBgQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 27768;
var ___stop_em_js = Module['___stop_em_js'] = 28821;



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
