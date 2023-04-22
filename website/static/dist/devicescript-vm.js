
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAn9+AGABfgF/YAF8AX9gAX8BfGAEf35+fwBgBn9/f39/fwBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA6CGgIAAngYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMGAgcHAgcHAwkFBQUFBxcKDAUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYABQICAgIAAwMFAAAAAQACBQAFBQMCAgMCAgMEAwMDCQYFAggAAgEBAAAAAAAAAAABAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEFAQMAAAEBAQEACgACAgABAQEAAQEAAQEAAAEAAAAABgICBgoAAQABAQIEBQEOAAIAAAAFAAAIAwkKAgIKAgMABgkDAQYFAwYJBgYFBgEBAQMDBQMDAwMDAwYGBgkMBgMDAwUFAwMDAwYFBgYGBgYGAQMPEQICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAdHgMEAwUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBgUDAwQEAwwRAgIGDwMDAwMFBQMDAwQEBQUFBQEDAAMDBAIAAwACBQAEAwUFBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKDAICAAAHCQkBAwcBAgAIAAIGAAcJCAAEBAQAAAIHABIDBwcBAgEAEwMJBwAABAACBwACBwQHBAQDAwMFAggFBQUEBwUHAwMFCAUAAAQfAQMPAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAw4IAwAEAQAJAQMDAQMGBAwgCQkSAwMEAwcHBgcEBAgABAQHCQcIAAcIFAQFBQUEAAQYIRAFBAQEBQkEBAAAFQsLCxQLEAUIByILFRULGBQTEwsjJCUmCwMDAwQFAwMDAwMEEgQEGQ0WJw0oBhcpKgYPBAQACAQNFhoaDRErAgIICBYNDRkNLAAICAAECAcICAgtDC4Eh4CAgAABcAHqAeoBBYaAgIAAAQGAAoACBt2AgIAADn8BQZD7BQt/AUEAC38BQQALfwFBAAt/AEGI2QELfwBB99kBC38AQcHbAQt/AEG93AELfwBBud0BC38AQYneAQt/AEGq3gELfwBBr+ABC38AQYjZAQt/AEGl4QELB/2FgIAAIwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwCTBhZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AyQUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUAlAYaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQALxFqZF9lbV9kZXZzX2RlcGxveQAwEWpkX2VtX2RldnNfdmVyaWZ5ADEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADMWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMLBmZmbHVzaADRBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQArgYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQCvBhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlALAGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZACxBglzdGFja1NhdmUAqgYMc3RhY2tSZXN0b3JlAKsGCnN0YWNrQWxsb2MArAYcZW1zY3JpcHRlbl9zdGFja19nZXRf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D3EhBQtBACEEAkACQAJAAkAgBUF9ag4GAQMDAwMAAwsgAygCEEEIaiEEDAELIANBCGohBAsgBC8BACEECwJAIARB//8DcSIEDQACQCAALQAKRQ0AIABBFGoQgAUaIABBADoACiAAKAIQECIgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARD5BBogACABLQAOOgAKDA4LAkACQCADDQBBACEBDAELIAMtAANBD3EhAQsCQAJAAkAgAUF9ag4GAAICAgIBAgsgAkHQAGogBCADKAIMEF0MDwsgAkHQAGogBCADQRhqEF0MDgtB48EAQY0DQeU0EKkFAAsgAUEcaigCAEHkAEcNACACQdAAaiADKAKoAS8BDCADKAIAEF0MDAsCQCAALQAKRQ0AIABBFGoQgAUaIABBADoACiAAKAIQECIgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARD5BBogACABLQAOOgAKDAsLIAJB8ABqIAMgAS0AICABQRxqKAIAEF4gAkEANgJgIAIgAikDcDcDIAJAIAMgAkEgahCrAyIERQ0AIAQoAgBBgICA+ABxQYCAgNgARw0AIAJB6ABqIANBCCAEKAIcEKMDIAIgAikDaDcDcAsgAiACKQNwNwMYAkACQCADIAJBGGoQpwMNACACIAIpA3A3AxBBACEEIAMgAkEQahD+AkUNAQsgAiACKQNwNwMIIAMgAkEIaiACQeAAahCqAyEECyAEIQUCQCACKAJgIgQgAUEiai8BACIDSw0AAkAgAC0ACkUNACAAQRRqEIAFGiAAQQA6AAogACgCEBAiIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQ+QQaIAAgAS0ADjoACgwLCyACIAQgA2siADYCYCACIAAgAUEkai8BACIBIAAgAUkbIgE2AmAgAkHQAGpBASABEF8iAUUNCiABIAUgA2ogAigCYBDMBRoMCgsgAkHwAGogAyABLQAgIAFBHGooAgAQXiACIAIpA3A3AzAgAkHQAGpBECADIAJBMGpBABBgIgEQXyIARQ0JIAIgAikDcDcDKCABIAMgAkEoaiAAEGBGDQlB684AQePBAEGUBEGQNxCuBQALIAJB4ABqIAMgAUEUai0AACABKAIQEF4gAiACKQNgIgk3A2ggAiAJNwM4IAMgAkHwAGogAkE4ahBh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IAEvAUogA00NACABKAK4ASADQQJ0aigCACEFCwJAIAUiBg0AIAMhBQwDCwJAAkAgBigCDCIFRQ0AIAAgAUEIIAUQowMMAQsgACADNgIAIABBAjYCBAsgAyEFIAZFDQIMBAsCQCADDQAgAEIANwMADAQLIAAgAzYCACAAQQg2AgQgASADEJkBDAMLIAMhBSADQeUARg0BCyAEIAU2AgQgBCACNgIAQasKIAQQPCAAQgA3AwAMAQsCQCABKQA4IgdCAFINACABKAKwASIDRQ0AIAAgAykDIDcDAAwBCyAAIAc3AwALIARBEGokAAvPAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQgAUaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBD5BBogAyAAKAIELQAOOgAKIAMoAhAPC0H7zwBB48EAQTFBuTsQrgUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQrgMNACADIAEpAwA3AxgCQAJAIAAgA0EYahDRAiICDQAgAyABKQMANwMQIAAgA0EQahDQAiEBDAELAkAgACACENICIgENAEEAIQEMAQsCQCAAIAIQsgINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABCCAyADQShqIAAgBBDnAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEK0CIAFqIQIMAQsgACACQQBBABCtAiABaiECCyADQcAAaiQAIAIL+AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahDIAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBB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ACABIAEpA1A3AxAgACABQRBqQZgBELMDRQ0BCyABQcgAaiAAIAIgASgCXBCFAyAAKAKwASABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahDzAjYCACABQegAaiAAQY8aIAEQkgMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahCoAw0AIAEgASkDIDcDECABQShqIABBzx0gAUEQahCWA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEKkDIQILAkAgAiIDRQ0AIABBABDdAiECIABBARDdAiEEIABBAhDdAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQzgUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQqAMNACABIAEpA1A3AzAgAUHYAGogAEHPHSABQTBqEJYDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEKkDIQILAkAgAiIDRQ0AIABBABDdAiEEIAEgAEHgAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahD+AkUNACABIAEpA0A3AwAgACABIAFB2ABqEIEDIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQpwMNACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQlQNBACECDAELIAEgASkDUDcDCCAAIAFBCGogAUHYAGoQqQMhAgsgAiECCyACIgVFDQAgAEECEN0CIQIgAEEDEN0CIQAgASgCWCIGIAJNDQAgASAGIAJrIgY2AlggASgCTCIHIARNDQAgASAHIARrIgc2AkwgAyAEaiAFIAJqIAcgBiAAIAYgAEkbIgAgByAASRsQzAUaCyABQeAAaiQAC9kBAgF/AXwjAEEQayICJAAgAiABKQMANwMIAkACQCACQQhqEK8DRQ0AQX8hAQwBCwJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAiAUEAIAFBAEobIQEMAgsgASgCAEHCAEcNAEF/IQEMAQsgAiABKQMANwMAQX8hASAAIAIQpAMiA0QAAOD////vQWQNAEEAIQEgA0QAAAAAAAAAAGMN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EDsBACAAQbACaiADKQMINwIAIAMtABQhAiAAQbgCaiAEOgAAIABBrwJqIAI6AAAgAEG8AmogAygCHEEMaiAEEMwFGiAAEJICCyABQSBqJAALpAICA38BfiMAQdAAayIBJAAgAEEAEN0CIQIgASAAQeAAaikDACIENwNIAkACQCAEUA0AIAEgASkDSDcDOCAAIAFBOGoQ/gINACABIAEpA0g3AzAgAUHAAGogAEHCACABQTBqEJUDDAELAkAgAkGAgICAf3FBgICAgAFGDQAgAUHAAGogAEGpFUEAEJMDDAELIAEgASkDSDcDKAJAAkACQCAAIAFBKGogAhCfAiIDQQNqDgIBAAILIAEgAjYCACABQcAAaiAAQYkLIAEQkgMMAgsgASABKQNINwMgIAEgACABQSBqQQAQgQM2AhAgAUHAAGogAEH8NSABQRBqEJMDDAELIANBAEgNACAAKAKwASADrUKAgICAIIQ3AyALIAFB0ABqJAALewICfwF+IwBBEGsiASQAAkAgABDjAiICRQ0AAkAgAigCBA0AIAIgAEEcEK4CNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABCCAwsgASABKQMINwMAIAAgAkH2ACABEIgDIAAgAhDiAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ4wIiAkUNAAJAIAIoAgQNACACIABBIBCuAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQggMLIAEgASkDCDcDACAAIAJB9gAgARCIAyAAIAIQ4gILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEOMCIgJFDQACQCACKAIEDQAgAiAAQR4QrgI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEIIDCyABIAEpAwg3AwAgACACQfYAIAEQiAMgACACEOICCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDjAiICRQ0AAkAgAigCBA0AIAIgAEEiEK4CNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARCCAwsgASABKQMINwMAIAAgAkH2ACABEIgDIAAgAhDiAgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEMoCAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABDKAgsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEI4DIAAQWSABQRBqJAALpgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCVA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQZg2QQAQkwMLIAIhAQsCQAJAIAEiAUUNACAAIAEoAhwQoQMMAQsgAEIANwMACyADQSBqJAALrAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahCVA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQZg2QQAQkwMLIAIhAQsCQAJAIAEiAUUNACAAIAEtABBBD3FBBEYQogMMAQsgAEIANwMACyADQSBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCVA0EAIQIMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQZg2QQAQkwMLIAIhAgsCQCACIgJFDQACQCACLQAQQQ9xQQRGDQAgAUEYaiAAQeI3QQAQkwMMAQsgAiAAQdgAaikDADcDICACQQEQdwsgAUEgaiQAC5QBAQJ/IwBBIGsiASQAIAEgACkDUDcDEAJAAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxA3AwggAUEYaiAAQYsBIAFBCGoQlQNBACEADAELAkAgACABKAIQEHwiAg0AIAFBGGogAEGYNkEAEJMDCyACIQALAkAgACIARQ0AIAAQfgsgAUEgaiQAC1kCA38BfiMAQRBrIgEkACAAKAKwASECIAEgAEHYAGopAwAiBDcDACABIAQ3AwggACABEKgBIQMgACgCsAEgAxB4IAIgAi0AEEHwAXFBBHI6ABAgAUEQaiQACxkAIAAoArABIgAgADUCHEKAgICAEIQ3AyALWQECfyMAQRBrIgEkAAJAAkAgAC0AQyICDQAgAUEIaiAAQdIoQQAQkwMMAQsgACACQX9qQQEQfSICRQ0AIAAoArABIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQyAIiBEHPhgNLDQAgASgAqAEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQfkiIANBCGoQlgMMAQsgACABIAEoAqABIARB//8DcRC4AiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEK4CEI4BEKMDIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCMASADQdAAakH7ABCCAyADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQ2QIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqELYCIAMgACkDADcDECABIANBEGoQjQELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQyAIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEJUDDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8B6NcBTg0CIABBoO0AIAFBA3RqLwEAEIIDDAELIAAgASgAqAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQc8VQeY/QTFB8S8QrgUAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQrgMNACABQThqIABBjxwQlAMLIAEgASkDSDcDICABQThqIAAgAUEgahCGAyABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEIwBIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEIEDIgJFDQAgAUEwaiAAIAIgASgCOEEBEKUCIAAoArABIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjQEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECEN0CIQIgASABKQMgNwMIAkAgAUEIahCuAw0AIAFBGGogAEH5HRCUAwsgASABKQMoNwMAIAFBEGogACABIAJBARCoAiAAKAKwASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCsAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQpAObEN8CCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoArABIAI3AyAMAQsgASABKQMINwMAIAAgACABEKQDnBDfAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKwASACNwMgDAELIAEgASkDCDcDACAAIAAgARCkAxD3BRDfAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxChAwsgACgCsAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQpAMiBEQAAAAAAAAAAGNFDQAgACAEmhDfAgwBCyAAKAKwASABKQMYNwMgCyABQSBqJAALFQAgABCiBbhEAAAAAAAA8D2iEN8CC2QBBX8CQAJAIABBABDdAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEKIFIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQ4AILEQAgACAAQQAQ3gIQ4gUQ3wILGAAgACAAQQAQ3gIgAEEBEN4CEO4FEN8CCy4BA38gAEEAEN0CIQFBACECAkAgAEEBEN0CIgNFDQAgASADbSECCyAAIAIQ4AILLgEDfyAAQQAQ3QIhAUEAIQICQCAAQQEQ3QIiA0UNACABIANvIQILIAAgAhDgAgsWACAAIABBABDdAiAAQQEQ3QJsEOACCwkAIABBARDVAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahClAyEDIAIgAikDIDcDECAAIAJBEGoQpQMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKwASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEKQDIQYgAiACKQMgNwMAIAAgAhCkAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoArABQQApA7B2NwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCsAEgASkDADcDICACQTBqJAALCQAgAEEAENUBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahCuAw0AIAEgASkDKDcDECAAIAFBEGoQzQIhAiABIAEpAyA3AwggACABQQhqENECIgNFDQAgAkUNACAAIAIgAxCvAgsgACgCsAEgASkDKDcDICABQTBqJAALCQAgAEEBENkBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahDRAiIDRQ0AIABBABCQASIERQ0AIAJBIGogAEEIIAQQowMgAiACKQMgNwMQIAAgAkEQahCMASAAIAMgBCABELMCIAIgAikDIDcDCCAAIAJBCGoQjQEgACgCsAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDZAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahCrAyICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqEJUDDAELIAEgASkDMDcDGAJAIAAgAUEYahDRAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQlQMMAQsgAiADNgIE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AEG4AmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahC+AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGxHiABQRBqEJYDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGkHiABQQhqEJYDQQAhAwsCQCADIgNFDQAgACADEPkBIAAgASgCJCADLwECQf8fcUGAwAByEJECCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEL4CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQbEeIANBCGoQlgNBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahC+AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGxHiADQQhqEJYDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQvgIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBsR4gA0EIahCWA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRChAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQvgIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBsR4gAUEQahCWA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBpB4gAUEIahCWA0EAIQMLAkAgAyIDRQ0AIAAgAxD5ASAAIAEoAiQgAy8BAhCRAgsgAUHAAGokAAtkAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahCVAwwBCyAAIAEgAigCABDCAkEARxCiAwsgA0EQaiQAC2MBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqEJUDDAELIAAgASABIAIoAgAQwQIQugILIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDUDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQlQNB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAEN0CIQMgASAAQeAAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahCqAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AEJcDDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABCXAwwBCyAAQbgCaiAFOgAAIABBvAJqIAQgBRDMBRogACACIAMQkQILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQvQIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxCVAyAAQgA3AwAMAQsgACACKAIEEKEDCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqEL0CIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQlQMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuTAQICfwF+IwBBwABrIgEkACABIAApA1AiAzcDGCABIAM3AzACQAJAIAAgAUEYahC9AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqEJUDDAELIAEgAEHYAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahDFAiAAKAKwASABKQMoNwMgCyABQcAAaiQAC8MBAgJ/AX4jAEHAAGsiASQAIAEgACkDUCIDNwMYIAEgAzcDMAJAAkACQCAAIAFBGGoQvQINACABIAEpAzA3AwAgAUE4aiAAQZ0BIAEQlQMMAQsgASAAQdgAaikDACIDNwMQIAEgAzcDKCAAIAFBEGoQ3AEiAkUNACABIAApA1AiAzcDCCABIAM3AyAgACABQQhqELwCIgBBf0wNASACIABBgIACczsBEgsgAUHAAGokAA8LQc/QAEGVxABBKUGwJBCuBQALRQEBfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAEgA0EIahCaAyICQX9KDQAgAEIANwMADAELIAAgAhChAwsgA0EQaiQAC38CAn8BfiMAQSBrIgEkACABIAApA1A3AxggAEEAEN0CIQIgASABKQMYNwMIAkAgACABQQhqIAIQmQMiAkF/Sg0AIAAoArABQQApA7B2NwMgCyABIAApA1AiAzcDACABIAM3AxAgACAAIAFBABCBAyACahCdAxDgAiABQSBqJAALUAECfyMAQSBrIgEkACABIAApA1A3AxAgAEEAEN0CIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQ1wIgACgCsAEgASkDGDcDICABQSBqJAALjwECA38BfiMAQTBrIgEkACAAQQAQ3QIhAiABIABB4ABqKQMAIgQ3AygCQAJAIARQRQ0AQf////8HIQMMAQsgASABKQMoNwMQIAAgAUEQahClAyEDCyABIAApA1AiBDcDCCABIAQ3AxggAUEgaiAAIAFBCGogAiADEIoDIAAoArABIAEpAyA3AyAgAUEwaiQAC4ECAQl/IwBBIGsiASQAAkACQAJAIAAtAEMiAkF/aiIDRQ0AAkAgAkEBSw0AQQAhBAwCC0EAIQVBACEGA0AgACAGIgYQ3QIgAUEcahCbAyAFaiIFIQQgBSEFIAZBAWoiByEGIAcgA0cNAAwCCwALIAFBEGpBABCCAyAAKAKwASABKQMQNwMgDAELAkAgACABQQhqIAQiCCADEJMBIglFDQACQCACQQFNDQBBACEFQQAhBgNAIAUiB0EBaiIEIQUgACAHEN0CIAkgBiIGahCbAyAGaiEGIAQgA0cNAAsLIAAgAUEIaiAIIAMQlAELIAAoArABIAEpAwg3AyALIAFBIGokAAumBAEEfyMAQcAAayIEJAAgBCACKQMANwMYAkACQAJAAkAgASAEQRhqEK0DQX5xQQJGDQAgBCACKQMANwMQIAAgASAEQRBqEIYDDAELIAQgAikDADcDIEF/IQUCQCADQeQAIAMbIgNB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D3EhAAsgASECAkAgAEF8ag4GBAAAAAAEAAtB89kAQY8+QZYFQechEK4FAAtByywQtwUhAgJAAkAgACkAMEIAUg0AIANB7ig2AgAgAyACNgIEIANB2ABqIABB3BggAxCSAwwBCyADIABBMGopAwA3AyggACADQShqEPMCIQEgA0HuKDYCECADIAE2AhQgAyACNgIYIANB2ABqIABB7BggA0EQahCSAwsgAiECCyACECILQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakEAEM4CIQEgAEIANwMwIAJBEGokACABCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEM4CIQEgAEIANwMwIAJBEGokACABC6kCAQJ/AkACQCABQfDnAGtBDG1BJ0sNACABKAIEIQIMAQsCQAJAIAEgACgAqAEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoArwBDQAgAEEgEIgBIQIgAEEIOgBEIAAgAjYCvAEgAg0AQQAhAgwDCyAAKAK8ASgCFCIDIQIgAw0CIABBCUEQEIcBIgINAUEAIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACwJAAkAgAEF8ag4GAQAAAAABAAtBsdoAQY8+QdwGQbYhEK4FAAsgASgCBA8LIAAoArwBIAI2AhQgAkHw5wBBqAFqQQBB8OcAQbABaigCABs2AgQgAiECC0EAIAIiAEHw5wBBGGpBAEHw5wBBIGooAgAbIAAbIgAgACABRhsLogECAX8BfiMAQSBrIgIkACACIAEpAwA3AwggAkEQaiAAIAJBCGpBNBDKAgJAAkAgAikDEEIAUg0AQQAhASAALQBFDQEgAkEYaiAAQekuQQAQkgNBACEBDAELIAIgAikDECIDNwMYIAIgAzcDACAAIAJBAhDOAiEBIABCADcDMAJAIAENACACQRhqIABB9y5BABCSAwsgASEBCyACQSBqJAAgAQv+CAIHfwF+IwBBwABrIgQkAEHw5wBBqAFqQQBB8OcAQbABaigCABshBUEAIQYgAiECAkACQAJAAkADQCAGIQcCQCACIggNACAHIQcMAgsCQAJAIAhB8OcAa0EMbUEnSw0AIAQgAykDADcDMCAIIQYgCCgCAEGAgID4AHFBgICA+ABHDQQCQAJAA0AgBiIJRQ0BIAkoAgghBgJAAkACQAJAIAQoAjQiAkGAgMD/B3ENACACQQ9xQQRHDQAgBCgCMCICQYCAf3FBgIABRw0AIAYvAQAiB0UNASACQf//AHEhCiAHIQIgBiEGA0AgBiEGAkAgCiACQf//A3FHDQAgBi8BAiIGIQICQCAGQSdLDQACQCABIAIQrgIiAkHw5wBrQQxtQSdLDQAgBEEANgIkIAQgBkHgAGo2AiAgCSEGQQANCAwKCyAEQSBqIAFBCCACEKMDIAkhBkEADQcMCQsgBkHPhgNNDQ4gBCACNgIgIARBAzYCJCAJIQZBAA0GDAgLIAYvAQQiByECIAZBBGohBiAHDQAMAgsACyAEIAQpAzA3AwggASAEQQhqIARBPGoQgQMhCiAEKAI8IAoQ+wVHDQEgBi8BACIHIQIgBiEGIAdFDQADQCAGIQYCQCACQf//A3EQwQMgChD6BQ0AIAYvAQIiBiECAkAgBkEnSw0AAkAgASACEK4CIgJB8OcAa0EMbUEnSw0AIARBADYCJCAEIAZB4ABqNgIgDAYLIARBIGogAUEIIAIQowMMBQsgBkHPhgNNDQ4gBCACNgIgIARBAzYCJAwECyAGLwEEIgchAiAGQQRqIQYgBw0ACwsgCSgCBCEGQQENAgwECyAEQgA3AyALIAkhBkEADQAMAgsACyAEQgA3AyALIAQgBCkDIDcDKCAEQShqIQYgCCECQQEhCgwBCwJAIAggASgAqAEiBiAGKAJgamsgBi8BDkEEdE8NACAEIAMpAwA3AxAgBEEwaiABIAggBEEQahDFAiAEIAQpAzAiCzcDKAJAIAtCAFENACAEQShqIQYgCCECQQEhCgwCCwJAIAEoArwBDQAgAUEgEIgBIQYgAUEIOgBEIAEgBjYCvAEgBg0AIAchBkEAIQJBACEKDAILAkAgASgCvAEoAhQiAkUNACAHIQYgAiECQQAhCgwCCwJAIAFBCUEQEIcBIgINACAHIQZBACECQQAhCgwCCyABKAK8ASACNgIUIAIgBTYCBCAHIQYgAiECQQAhCgwBCwJAAkAgCC0AA0EPcUF8ag4GAQAAAAABAAtBgtoAQY8+QZ0HQZYzEK4FAAsgBCADKQMANwMYAkAgASAIIARBGGoQsQIiBkUNACAGIQYgCCECQQEhCgwBC0EAIQYgCCgCBCECQQAhCgsgBiIHIQYgAiECIAchByAKRQ0ACwsCQAJAIAciBg0AQgAhCwwBCyAGKQMAIQsLIAAgCzcDACAEQcAAaiQADwtBldoAQY8+QccDQfIeEK4FAAtBissAQY8+QcAAQfgsEK4FAAtBissAQY8+QcAAQfgsEK4FAAvsAQIDfwF+IwBBIGsiAyQAAkACQCACDQBBACEEDAELIAMgASkDADcDEEEAIQQgA0EQahCuAw0AIAMgASkDACIGNwMIIAMgBjcDGCAAIANBCGpBABDOAiEEIABCADcDMCADIAEpAwAiBjcDACADIAY3AxggACADQQIQzgIhBSAAQgA3AzBBACEBAkAgBEUNAAJAIAQgBUYNACAEIQEMAQsgACAEENICIQELQQAhBCABIgFFDQAgASEBA0ACQCABIgEgAkYiBEUNACAEIQQMAgsgACABENICIgUhASAEIQQgBQ0ACwsgA0EgaiQAIAQLiAECAn8BfiMAQTBrIgQkACABIAMpAwA3AzAgBCACKQMAIgY3AyAgBCAGNwMoIAEgBEEgakEAEM4CIQUgAUIANwMwIAQgAykDADcDGCAEQShqIAEgBSAEQRhqENQCIAQgAikDADcDECAEIAQpAyg3AwggACABIARBEGogBEEIahDGAiAEQTBqJAALnQIBAn8jAEEwayIEJAACQAJAIANBgcADSQ0AIABCADcDAAwBCyAEIAIpAwA3AyACQCABIARBIGogBEEsahCqAyIFRQ0AIAQoAiwgA00NACAEIAIpAwA3AxACQCABIARBEGoQ/gJFDQAgBCACKQMANwMIAkAgASAEQQhqIAMQmQMiA0F/Sg0AIABCADcDAAwDCyAFIANqIQMgACABQQggASADIAMQnAMQlQEQowMMAgsgACAFIANqLQAAEKEDDAELIAQgAikDADcDGAJAIAEgBEEYahCrAyIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBMGokAAu+BAIBfwJ+IwBBsAFrIgQkACAEIAMpAwA3A5ABAkACQCAEQZABahD/AkUNACAEIAIpAwAiBTcDiAEgBCAFNwOoAQJAIAEgBEGIAWoQrAMNACAEIAQpA6gBNwOAASABIARBgAFqEKcDDQAgBCAEKQOoATcDeCABIARB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IAMgAikDADcDCCAAIANBCGoQjQEgA0EgaiQACz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB2ABqKQMAIgM3AwAgAiADNwMIIAAgAhClAyEAIAJBEGokACAAC0ADAX8BfgF8IwBBEGsiAiQAIAIgAUEDdCAAakHYAGopAwAiAzcDACACIAM3AwggACACEKQDIQQgAkEQaiQAIAQLLAEBfyMAQRBrIgIkACACQQhqIAEQoAMgACgCsAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQoQMgACgCsAEgAikDCDcDICACQRBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQogMgACgCsAEgAikDCDcDICACQRBqJAALMAEBfyMAQRBrIgIkACACQQhqIABBCCABEKMDIAAoArABIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahCrAyICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABBszVBABCSA0EAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoArABDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahCtAyEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQShJDQAgAEIANwMADwsCQCABIAIQrgIiA0Hw5wBrQQxtQSdLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEKMDC/8BAQJ/IAIhAwNAAkAgAyICQfDnAGtBDG0iA0EnSw0AAkAgASADEK4CIgJB8OcAa0EMbUEnSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhCjAw8LAkAgAiABKACoASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQbHaAEGPPkGuCUGELRCuBQALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQfDnAGtBDG1BKEkNAQsLIAAgAUEIIAIQowMLJAACQCAB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6AFBAEIANwPw6AFBAEIANwP46AFBAEEAOgCg5wEPC0HJxABBDkHiHhCpBQAL7QcBAX8gACABEPoCAkAgA0UNAEEAQQAoAvDnASADajYC8OcBIAMhAyACIQEDQCABIQEgAyEDAkBBACgC7OcBIgBBwABHDQAgA0HAAEkNAEH05wEgARD1AiADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALo5wEgASADIAAgAyAASRsiABDMBRpBAEEAKALs5wEiCSAAazYC7OcBIAEgAGohASADIABrIQICQCAJIABHDQBB9OcBQajnARD1AkEAQcAANgLs5wFBAEGo5wE2AujnASACIQMgASEBIAINAQwCC0EAQQAoAujnASAAajYC6OcBIAIhAyABIQEgAg0ACwsgCBD7AiAIQSAQ+gICQCAFRQ0AQQBBACgC8OcBIAVqNgLw5wEgBSEDIAQhAQNAIAEhASADIQMCQEEAKALs5wEiAEHAAEcNACADQcAASQ0AQfTnASABEPUCIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAujnASABIAMgACADIABJGyIAEMwFGkEAQQAoAuznASIJIABrNgLs5wEgASAAaiEBIAMgAGshAgJAIAkgAEcNAEH05wFBqOcBEPUCQQBBwAA2AuznAUEAQajnATYC6OcBIAIhAyABIQEgAg0BDAILQQBBACgC6OcBIABqNgLo5wEgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALw5wEgB2o2AvDnASAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAuznASIAQcAARw0AIANBwABJDQBB9OcBIAEQ9QIgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgC6OcBIAEgAyAAIAMgAEkbIgAQzAUaQQBBACgC7OcBIgkgAGs2AuznASABIABqIQEgAyAAayECAkAgCSAARw0AQfTnAUGo5wEQ9QJBAEHAADYC7OcBQQBBqOcBNgLo5wEgAiEDIAEhASACDQEMAgtBAEEAKALo5wEgAGo2AujnASACIQMgASEBIAINAAsLQQBBACgC8OcBQQFqNgLw5wFBASEDQZDfACEBAkADQCABIQEgAyEDAkBBACgC7OcBIgBBwABHDQAgA0HAAEkNAEH05wEgARD1AiADQUBqIgAhAyABQcAAaiEBIAANAQwC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AnggAyAFNgJ0IAMgAjYCcCAAIAFB78YAIANB8ABqEIQDDAcLIABCpoCBgMAANwMADAYLQZfBAEHEAUGcKRCpBQALIAIoAgBBgIABTw0FIAMgAikDACIHNwOAAiADIAc3A6gBIAEgA0GoAWogA0HMAmoQqgMiBEUNBgJAIAMoAswCIgJBIUkNACADIAQ2AogBIANBIDYChAEgAyACNgKAASAAIAFBmscAIANBgAFqEIQDDAULIAMgBDYCmAEgAyACNgKUASADIAI2ApABIAAgAUHAxgAgA0GQAWoQhAMMBAsgAyABIAIoAgAQwwI2ArABIAAgAUGLxgAgA0GwAWoQhAMMAwsgAyACKQMANwP4AQJAIAEgA0H4AWoQvQIiBEUNACAELwEAIQIgAyABKAKoATYC9AEgAyADQfQBaiACQQAQwwM2AvABIAAgAUGjxgAgA0HwAWoQhAMMAwsgAyACKQMANwPoASABIANB6AFqIANBgAJqEL4CIQICQCADKAKAAiIEQf//AUcNACABIAIQwAIhBSABKAKoASIEIAQoAmBqIAVBBHRqLwEAIQUgAyAENgLMASADQcwBaiAFQQAQwwMhBCACLwEAIQIgAyABKAKoATYCyAEgAyADQcgBaiACQQAQwwM2AsQBIAMgBDYCwAEgACABQdrFACADQcABahCEAwwDCyABIAQQwwIhBCACLwEAIQIgAyABKAKoATYC5AEgAyADQeQBaiACQQAQwwM2AtQBIAMgBDYC0AEgACABQczFACADQdABahCEAwwCC0GXwQBB3AFBnCkQqQUACyADIAIpAwA3AwggA0GAAmogASADQQhqEKQDQQcQsQUgAyADQYACajYCACAAIAFB6xogAxCEAwsgA0HQAmokAA8LQaHXAEGXwQBBxwFBnCkQrgUAC0H/ywBBl8EAQfQAQYspEK4FAAujAQECfyMAQTBrIgMkACADIAIpAwA3AyACQCABIANBIGogA0EsahCqAyIERQ0AAkACQCADKAIsIgJBIUkNACADIAQ2AgggA0EgNgIEIAMgAjYCACAAIAFBmscAIAMQhAMMAQsgAyAENgIYIAMgAjYCFCADIAI2AhAgACABQcDGACADQRBqEIQDCyADQTBqJAAPC0H/ywBBl8EAQfQAQYspEK4FAAvIAgECfyMAQdAAayIEJAAgBCADKQMANwMw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CyACQSBqJAALDQAgAEEAKQO4djcDAAs3AQF/AkAgAigCTCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIEBCzgBAX8CQCACKAJMIgMgAigCqAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIEBC3EBAX8jAEEgayIDJAAgA0EYaiACEKMEIAMgAykDGDcDEAJAAkACQCADQRBqEP8CDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahCkAxCgAwsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEKMEIANBEGogAhCjBCADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQ2AIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEKMEIAJBIGogARCjBCACQRhqIAEQowQgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhDZAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCjBCADIAMpAyA3AyggAigCTCEEIAMgAigCqAE2AhwCQAJAIANBHGogBEGAgAFyIgQQtQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIEBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ1gILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCjBCADIAMpAyA3AyggAigCTCEEIAMgAigCqAE2AhwCQAJAIANBHGogBEGAgAJyIgQQtQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIEBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ1gILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCjBCADIAMpAyA3AyggAigCTCEEIAMgAigCqAE2AhwCQAJAIANBHGogBEGAgANyIgQQtQMNACADQgA3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AX8jAEEQayIDJAAgA0EIaiACEKMEIAAgAygCDEUgAygCCEECRnEQogMgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACEKMEAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEKQDmhCgAwwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA5h2NwMADAELIABBACACaxChAwsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEKMEIAMgAykDCDcDACAAIAIgAxCmA0EBcxCiAyADQRBqJAALDAAgACACEKUEEKEDC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhCjBCACQRhqIgQgAykDODcDACADQThqIAIQowQgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEKEDDAELIAMgBSkDADcDMAJAAkAgAiADQTBqEP4CDQAgAyAEKQMANwMoIAIgA0EoahD+AkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqEIkDDAELIAMgBSkDADcDICACIAIgA0EgahCkAzkDICADIAQpAwA3AxggAkEoaiACIANBGGoQpAMiCDkDACAAIAggAisDIKAQoAMLIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQowQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKMEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhChAwwBCyADIAUpAwA3AxAgAiACIANBEGoQpAM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKQDIgg5AwAgACACKwMgIAihEKADCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhCjBCACQRhqIgQgAykDGDcDACADQRhqIAIQowQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEKEDDAELIAMgBSkDADcDECACIAIgA0EQahCkAzkDICADIAQpAwA3AwggAkEoaiACIANBCGoQpAMiCDkDACAAIAggAisDIKIQoAMLIANBIGokAAvoAQIGfwF8IwBBIGsiAyQAIANBGGogAhCjBCACQRhqIgQgAykDGDcDACADQRhqIAIQowQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNAAJAAkAgBCgCACIGQQFqDgIAAgELIAUoAgBBgICAgHhGDQELIAUoAgAiByAGbSIIIAZsIAdHDQAgACAIEKEDDAELIAMgBSkDADcDECACIAIgA0EQahCkAzkDICADIAQpAwA3AwggAkEoaiACIANBCGoQpAMiCTkDACAAIAIrAyAgCaMQoAMLIANBIGokAAssAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQIAAgBCADKAIAcRChAwssAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQIAAgBCADKAIAchChAwssAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQIAAgBCADKAIAcxChAwssAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQIAAgBCADKAIAdBChAwssAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQIAAgBCADKAIAdRChAwtBAQJ/IAJBGGoiAyACEKUENgIAIAIgAhClBCIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBCgAw8LIAAgAhChAwudAQEDfyMAQSBrIgMkACADQRhqIAIQowQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKMEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQsQMhAgsgACACEKIDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCjBCACQRhqIgQgAykDGDcDACADQRhqIAIQowQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQpAM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKQDIgY5AwAgAisDICAGZSECDAELIAUoAgAgBCgCAEwhAgsgACACEKIDIANBIGokAAu+AQIDfwF8IwBBIGsiAyQAIANBGGogAhCjBCACQRhqIgQgAykDGDcDACADQRhqIAIQowQgAiADKQMYNwMQIAJBEGohBQJAAkACQCACKAAUQX9HDQAgAigAHEF/Rg0BCyADIAUpAwA3AxAgAiACIANBEGoQpAM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKQDIgY5AwAgAisDICAGYyECDAELIAUoAgAgBCgCAEghAgsgACACEKIDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQowQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKMEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQsQNBAXMhAgsgACACEKIDIANBIGokAAs+AQF/IwBBEGsiAyQAIANBCGogAhCjBCADIAMpAwg3AwAgAEGg9gBBqPYAIAMQrwMbKQMANwMAIANBEGokAAviAQEFfyMAQRBrIgIkACACQQhqIAEQowQCQAJAIAEQpQQiA0EBTg0AQQAhAwwBCwJAAkAgAA0AIAAhAyAAQQBHIQQMAQsgACEFIAMhBgNAIAYhACAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSAAQX9qIQYgAyEDIAQhBCAAQQFKDQALCyADIQBBACEDIARFDQAgACABKAJMIgNBA3RqQRhqQQAgAyAAKAIQLwEISRshAwsCQAJAIAMiAw0AIAIgAUHwABCBAQwBCyADIAIpAwg3AwALIAJBEGokAAvEAQEEfwJAAkAgAhClBCIDQQFODQBBACEDDAELAkACQCABDQAgASEDIAFBAEchBAwBCyABIQUgAyEGA0AgBiEBIAUoAggiA0EARyEEAkAgAw0AIAMhAyAEIQQMAgsgAyEFIAFBf2ohBiADIQMgBCEEIAFBAUoNAAsLIAMhAUEAIQMgBEUNACABIAIoAkwiA0EDdGpBGGpBACADIAEoAhAvAQhJGyEDCwJAIAMiAw0AIAAgAkH0ABCBAQ8LIAAgAykDADcDAAs2AQF/AkAgAigCTCIDIAIoAKgBQSRqKAIAQQR2SQ0AIAAgAkH1ABCBAQ8LIAAgAiABIAMQxwILugEBA38jAEEgayIDJAAgA0EQaiACEKMEIAMgAykDEDcDCEEAIQQCQCACIANBCGoQrQMiBUEMSw0AIAVBgIABai0AACEECwJAAkAgBCIEDQAgAEIANwMADAELIAIgBDYCTCADIAIoAqgBNgIEAkACQCADQQRqIARBgIABciIEELUDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIAApAwBCAFINACADQRhqIAJB+gAQgQELIANBIGokAAuDAQEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIEBQQAhBAsCQCAEIgRFDQAgAiABKAKwASkDIDcDACACEK8DRQ0AIAEoArABQgA3AyAgACAEOwEECyACQRBqJAALpAEBAn8jAEEwayICJAAgAkEoaiABEKMEIAJBIGogARCjBCACIAIpAyg3AxACQAJAAkAgASACQRBqEKwDDQAgAiACKQMoNwMIIAJBGGogAUEPIAJBCGoQlQMMAQsgAS0AQg0BIAFBAToAQyABKAKwASEDIAIgAikDKDcDACADQQAgASACEKsDEHUaCyACQTBqJAAPC0Gh0QBBvD5B6gBBwggQrgUAC1oBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCBAUEAIQQLIAAgASAEEIsDIAJBEGokAAt7AQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQgQFBACEECwJAIAQiBEUNACAAIAQ7AQQLAkAgACABEIwDDQAgAkEIaiABQeoAEIEBCyACQRBqJAALIQEBfyMAQRBrIgIkACACQQhqIAFB6wAQgQEgAkEQaiQAC0YBAX8jAEEQayICJAACQAJAIAAgARCMAyAALwEEQX9qRw0AIAEoArABQgA3AyAMAQsgAkEIaiABQe0AEIEBCyACQRBqJAALXQEBfyMAQSBrIgIkACACQRhqIAEQowQgAiACKQMYNwMIAkACQCACQQhqEK8DRQ0AIAJBEGogAUH4NkEAEJIDDAELIAIgAikD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QQA7AY7pAUGA6QEQrARBACEAA0AgAiAAIgBqIgcgBy0AACAAQYDpAWotAABzOgAAIABBAWoiByEAIAdBBEcNAAsQrQRBACEAQQAhBwNAIAAiBUEBaiIKIQAgByACIAVqLQAAaiIFIQcgBSEFIApBBEcNAAsLIAUL3QMBCH9BACECA0AgACACIgNBAnQiAmogASACai0AADoAACAAIAJBAXIiBGogASAEai0AADoAACAAIAJBAnIiBGogASAEai0AADoAACAAIAJBA3IiAmogASACai0AADoAACADQQFqIgMhAiADQQhHDQALQQghAgNAIAIiA0ECdCIBIABqIgJBf2otAAAhBSACQX5qLQAAIQYgAkF9ai0AACEHIAJBfGotAAAhCAJAAkAgA0EHcSIERQ0AIAUhCSAGIQUgByEGIAghBwwBCyAIQZCAAWotAAAhCSAFQZCAAWotAAAhBSAGQZCAAWotAAAhBiADQQN2QZCCAWotAAAgB0GQgAFqLQAAcyEHCyAHIQcgBiEGIAUhBSAJIQgCQAJAIARBBEYNACAIIQQgBSEFIAYhBiAHIQcMAQsgCEH/AXFBkIABai0AACEEIAVB/wFxQZCAAWotAAAhBSAGQf8BcUGQgAFqLQAAIQYgB0H/AXFBkIABai0AACEHCyACIAJBYGotAAAgB3M6AAAgACABQQFyaiACQWFqLQAAIAZzOgAAIAAgAUECcmogAkFiai0AACAFczoAACAAIAFBA3JqIAJBY2otAAAgBHM6AAAgA0EBaiIBIQIgAUE8Rw0ACwvMBQEJf0EAIQIDQCACIgNBAnQhBEEAIQIDQCABIARqIAIiAmoiBSAFLQAAIAAgAiAEamotAABzOgAAIAJBAWoiBSECIAVBBEcNAAsgA0EBaiIEIQIgBEEERw0AC0EBIQIDQCACIQZBACECA0AgAiEFQQAhAgNAIAEgAiICQQJ0aiAFaiIEIAQtAABBkIABai0AADoAACACQQFqIgQhAiAEQQRHDQALIAVBAWoiBCECIARBBEcNAAsgAS0AASECIAEgAS0ABToAASABLQAJIQQgASABLQANOgAJIAEgBDoABSABIAI6AA0gAS0AAiECIAEgAS0ACjoAAiABIAI6AAogAS0ABiECIAEgAS0ADjoABiABIAI6AA4gAS0AAyECIAEgAS0ADzoAAyABIAEt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IREgAiENIAohCyAEIhBBHyAQQR9IGyECQQAhAQNAIAUgASIBQQF0aiIKIAsgAWoiBC0AAEEEdkGMK2otAAA6AAAgCiAELQAAQQ9xQYwrai0AADoAASABQQFqIgohASAKIAJHDQALIAUgAkEBdCIPakEAOgAAIAYgDWshDiARIQFBACEKAkAgD0EATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIA9HDQALCyABIQECQCAOQQBMDQAgDSAFIA8gDkF/aiAOIA9KGyIKEMwFIApqQQA6AAALIAsgAmohCiAQIAJrIg4hBCANIA9qIg8hAiABIQsgASEBIA8hD0EAIQ0gDkEASg0ACwsgBSANOgAAIAEhCiAPIQQgDEEIaiECIBJBAmohAQwHCyAFQT86AAAMAQsgBSABOgAACyARIQogDSEEIAwhAgwDCyAGIA1rIRAgESEBQQAhCgJAIAwoAgAiBEGq2gAgBBsiCxD7BSICQQBMDQADQCABIAsgCiIKai0AAEHAAXFBgAFHaiEBIApBAWoiBCEKIAQgAkcNAAsLIAEhAQJAIBBBAEwNACANIAsgAiAQQX9qIBAgAkobIgoQzAUgCmpBADoAAAsgDEEEaiEQIAVBADoAACANIAJqIQQCQCAORQ0AIAsQIgsgASEKIAQhBCAQIQIMAgsgESEKIA0hBCALIQIMAQsgESEKIA0hBCAOIQILIA8hAQsgASENIAIhDiAGIAQiD2shCyAKIQFBACEKAkAgBRD7BSICQQBMDQADQCABIAUgCiIKai0AAEHAAXFBgAFHaiEBIApBAWoiBCEKIAQgAkcNAAsLIAEhAQJAIAtBAEwNACAPIAUgAiALQX9qIAsgAkobIgoQzAUgCmpBADoAAAsgASEBIA8gAmohCiAOIQQgDSELQQEhDyANIQILIAEiDiEBIAoiDSEKIAQhBCALIQsgAiECIA8NAAsCQCADRQ0AIAMgDkEBajYCAAsgBUHAAGokACANIABrQQFqC+0IAwN+CH8BfAJAAkAgAUQAAAAAAAAAAGMNACABIQEgACEADAELIABBLToAACABmiEBIABBAWohAAsgACEAAkAgASIBvUL///////////8AgyIDQoGAgICAgID4/wBUDQAgAEHOwrkCNgAADwsCQCADQoCAgICAgID4/wBSDQAgAEHp3JkDNgAADwsCQCABRLDKbkftiRAAY0UNACAAQTA7AAAPCyACQQQgAkEEShsiAkEPSSEGIAFEje21oPfGsD5jIQcCQAJAIAEQ5AUiDplEAAAAAAAA4EFjRQ0AIA6qIQgMAQtBgICAgHghCAsgCCEIIAJBDyAGGyECAkACQCAHDQAgAURQ7+LW5BpLRGQNACAIIQZBASEHIAEhAQwBCwJAIAhBf0oNAEEAIQYgCCEHIAFEAAAAAAAAJEBBACAIaxClBqIhAQwBC0EAIQYgCCEHIAFEAAAAAAAAJEAgCBClBqMhAQsgASEBIAchCSACIAYiCkEBaiILQQ8gCkEPSCIGGyAKIAJIIggbIQwCQAJAIAgNACAGDQAgCiAMa0EBaiIIIQIgAUQAAAAAAAAkQCAIEKUGo0QAAAAAAADgP6AhAQwBC0EAIQIgAUQAAAAAAAAkQCAMIApBf3NqEKUGokQAAAAAAADgP6AhAQsgAiENIApBf0ohAgJAAkAgASIBRAAAAAAAAPBDYyABRAAAAAAAAAAAZnFFDQAgAbEhAwwBC0IAIQMLIAMhAwJAAkAgAkUNACAAIQAMAQsgAEGw3AA7AAAgAEECaiECAkAgCkF/Rw0AIAIhAAwBCyACQTAgCkF/cxDOBRogACAKa0EBaiEACyADIQMgDCEIIAAhAAJAA0AgACECIAMhBAJAIAgiCEEBTg0AIAIhAgwCC0EwIQAgBCEDAkAgBCAIQX9qIghBA3RBwIMBaikDACIFVA0AA0AgAEEBaiEAIAMgBX0iBCEDIAQgBVoNAAsLIAIgADoAACACQQFqIQACQAJAIAMiA0IAUiAMIAhrIgcgCkxyIgZBAUYNACAAIQAMAQsgACEAIAcgC0cNACACQS46AAEgAkECaiEACyADIQMgCCEIIAAiAiEAIAIhAiAGDQALCyACIQACQAJAIA1BAU4NACAAIQAMAQsgAEEwIA0QzgUgDWohAAsgACEAAkACQCAJQQFGDQAgAEHlADoAAAJAAkAgCUEBTg0AIABBAWohAAwBCyAAQSs6AAEgAEECaiEACyAAIQACQAJAIAlBf0wNACAJIQggACEADAELIABBLToAAEEAIAlrIQggAEEBaiEACyAAIgchAiAIIQgDQCACIgIgCCIAIABBCm4iCEEKbGtBMHI6AAAgAkEBaiIGIQIgCCEIIABBCUsNAAsgBkEAOgAAIAcgBxD7BWpBf2oiACAHTQ0BIAAhAiAHIQADQCAAIgAtAAAhCCAAIAIiAi0AADoAACACIAg6AAAgAkF/aiIIIQIgAEEBaiIGIQAgBiAISQ0ADAILAAsgAEEAOgAACwsPACAAIAEgAkEAIAMQsAULLAEBfyMAQRBrIgQkACAEIAM2AgwgACABIAJBACADELAFIQMgBEEQaiQAIAMLrgEBBn8jAEEQayICIAE3AwhBxbvyiHghAyACQQhqIQJBCCEEA0AgA0GTg4AIbCIFIAIiAi0AAHMiBiEDIAJBAWohAiAEQX9qIgchBCAHDQALIABBADoABCAAIAZB/////wNxIgNB6DRuQQpwQTByOgADIAAgA0GkBW5BCnBBMHI6AAIgACADIAVBHnZzIgNBGm4iAkEacEHBAGo6AAEgACADIAJBGmxrQcEAajoAAAtNAQJ/IwBBEGsiAiQAIAIgATYCBCACIAE2AgwgAiABNgIIQQBBACAAQQAgARCwBSIBECEiAyABIABBACACKAIIELAFGiACQRBqJAAgAwt3AQV/IAFBAXQiAkEBchAhIQMCQCABRQ0AQQAhBANAIAMgBCIEQQF0aiIFIAAgBGoiBi0AAEEEdkGMK2otAAA6AAAgBUEBaiAGLQAAQQ9xQYwrai0AADoAACAEQQFqIgUhBCAFIAFHDQALCyADIAJqQQA6AAAgAwvpAQEHfyMAQRBrIgEkACABQQA2AgwgAUIANwIEIAEgADYCAAJAAkAgAA0AQQEhAgwBCyAAIQJBACEDQQAhBANAIAIhBSABIARBAWoiBEECdGooAgAiBiECIAUQ+wUgA2oiBSEDIAQhBCAGDQALIAVBAWohAgsgAhAhIQdBACEFAkAgAEUNACAAIQJBACEDQQAhBANAIAIhAiAHIAMiA2ogAiACEPsFIgUQzAUaIAEgBEEBaiIEQQJ0aigCACIGIQIgBSADaiIFIQMgBCEEIAUhBSAGDQALCyAHIAVqQQA6AAAgAUEQaiQAIAcLGQACQCABDQBBARAhDwsgARAhIAAgARDMBQsSAAJAQQAoAvj0AUUNABC6BQsLngMBB38CQEEALwH89AEiAEUNACAAIQFBACgC9PQBIgAiAiEDIAAhACACIQIDQCAAIQQgAiIAQQhqIQUgASECIAMhAQNAIAEhASACIQMCQAJAAkAgAC0ABSICQf8BRw0AIAAgAUcNAUEAIAMgAS0ABEEDakH8A3FBCGoiAmsiAzsB/PQBIAEgASACaiADQf//A3EQpgUMAgtBACgCzOEBIAAoAgBrQQBIDQAgAkH/AHEgAC8BBiAFIAAtAAQQxAUNBAJAAkAgACwABSIBQX9KDQACQCAAQQAoAvT0ASIBRg0AQf8BIQEMAgtBAEEALwH89AEgAS0ABEEDakH8A3FBCGoiAmsiAzsB/PQBIAEgASACaiADQf//A3EQpgUMAwsgACAAKAIAQdCGA2o2AgAgAUGAf3IhAQsgACABOgAFC0EALwH89AEiBCEBQQAoAvT0ASIFIQMgAC0ABEEDakH8A3EgAGpBCGoiBiEAIAYhAiAGIAVrIARIDQIMAwtBAC8B/PQBIgMhAkEAKAL09AEiBiEBIAQgBmsgA0gNAAsLCwvwAgEEfwJAAkAQIw0AIAFBgAJPDQFBAEEALQD+9AFBAWoiBDoA/vQBIAAtAAQgBEEIdCABQf8BcXJBgIB+ciIFQf//A3EgAiADEMQFGgJAQQAoAvT0AQ0AQYABECEhAUEAQeYBNgL49AFBACABNgL09AELAkAgA0EIaiIGQYABSg0AAkACQEGAAUEALwH89AEiAWsgBkgNACABIQcMAQsgASEEA0BBACAEQQAoAvT0ASIBLQAEQQNqQfwDcUEIaiIEayIHOwH89AEgASABIARqIAdB//8DcRCmBUEALwH89AEiASEEIAEhB0GAASABayAGSA0ACwtBACgC9PQBIAciBGoiASAFOwEGIAEgAzoABCABIAAtAAQ6AAUgAUEIaiACIAMQzAUaIAFBACgCzOEBQaCcAWo2AgBBACADQf8BcUEDakH8A3EgBGpBCGo7Afz0AQsPC0G1wgBB3QBBxQ0QqQUAC0G1wgBBI0GWNBCpBQALGwACQEEAKAKA9QENAEEAQYAEEIQFNgKA9QELCzsBAX8CQCAADQBBAA8LQQAhAQJAIAAQlgVFDQAgACAALQADQb8BcToAA0EAKAKA9QEgABCBBSEBCyABCzsBAX8CQCAADQBBAA8LQQAhAQJAIAAQlgVFDQAgACAALQADQcAAcjoAA0EAKAKA9QEgABCBBSEBCyABCwwAQQAoAoD1ARCCBQsMAEEAKAKA9QEQgwULNQEBfwJAQQAoAoT1ASAAEIEFIgFFDQBBjipBABA8CwJAIAAQvgVFDQBB/ClBABA8CxBAIAELNQEBfwJAQQAoAoT1ASAAEIEFIgFFDQBBjipBABA8CwJAIAAQvgVFDQBB/ClBABA8CxBAIAELGwACQEEAKAKE9QENAEEAQYAEEIQFNgKE9QELC5kBAQJ/AkACQAJAECMNAEGM9QEgACABIAMQqAUiBCEFAkAgBA0AEMUFQYz1ARCnBUGM9QEgACABIAMQqAUiASEFIAFFDQILIAUhAQJAIANFDQAgAkUNAyABIAIgAxDMBRoLQQAPC0GPwgBB0gBBwjMQqQUAC0HKywBBj8IAQdoAQcIzEK4FAAtB/8sAQY/CAEHiAEHCMxCuBQALRABBABChBTcCkPUBQYz1ARCkBQJAQQAoAoT1AUGM9QEQgQVFDQBBjipBABA8CwJAQYz1ARC+BUUNAEH8KUEAEDwLEEALRwECfwJAQQAtAIj1AQ0AQQAhAAJAQQAoAoT1ARCCBSIBRQ0AQQBBAToAiPUBIAEhAAsgAA8LQeYpQY/CAEH0AEHQLxCuBQALRgACQEEALQCI9QFFDQBBACgChPUBEIMFQQBBADoAiPUBAkBBACgChPUBEIIFRQ0AEEALDwtB5ylBj8IAQZwBQdMQEK4FAAsyAAJAECMNAAJAQQAtAI71AUUNABDFBRCUBUGM9QEQpwULDwtBj8IAQakBQYUoEKkFAAsGAEGI9wELTwIBfgJ/AkACQCAAvSIBQjSIp0H/D3EiAkH/D0YNAEEEIQMgAg0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC44EAQN/AkAgAkGABEkNACAAIAEgAhATIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQzAUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAKM9wFFDQBBACgCjPcBENEFIQELAkBBACgCgNkBRQ0AQQAoAoDZARDRBSABciEBCwJAEOcFKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABDPBSECCwJAIAAoAhQgACgCHEYNACAAENEFIAFyIQELAkAgAkUNACAAENAFCyAAKAI4IgANAAsLEOgFIAEPC0EAIQICQCAAKAJMQQBIDQAgABDPBSECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEFABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoERAAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQ0AULIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQ0wUhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBUIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAFQQEgBmuthiEDDAELIAVC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBEIAUw0AA0AgB0F/aiEHIARCAYYiBEJ/VQ0ACwsgAkEBIAdrrYYhAgwBCyACQv////////8Hg0KAgICAgICACIQhAgsCQCAGIAdMDQADQAJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCyADQgGGIQMgBkF/aiIGIAdKDQALIAchBgsCQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsCQAJAIANC/////////wdYDQAgAyEEDAELA0AgBkF/aiEGIANC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IANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABCjBiADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EKMGIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORCjBiADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQowYgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEJkGRQ0AIAMgBBCJBiEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBCjBiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEJsGIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChCZBkEASg0AAkAgASAJIAMgChCZBkUNACABIQQMAgsgBUHwAGogASACQgBCABCjBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQowYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEKMGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABCjBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQowYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EKMGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkHM1wFqKAIAIQYgAkHA1wFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEIQGIQILIAIQhQYNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARCEBiECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEIQGIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAEIAiyQwAAgH+UEJ0GIARBCGopAwAhCyAEKQMAIQoMAgsCQAJAAkAgCQ0AQQAhCQNAIAJBIHIgCUGcJWosAABHDQECQCAJQQFLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQhAYhAgsgCUEBaiIJQQNHDQAM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ADcCECACQQJ0QdD5AWohBAJAAkACQAJAQQAoAqT3ASIGQQEgAnQiA3ENAEEAIAYgA3I2AqT3ASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCwPcBQX9qIgFBfyABGzYCwPcBCwsHAD8AQRB0C1QBAn9BACgChNkBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEJUGTQ0AIAAQFUUNAQtBACAANgKE2QEgAQ8LEMkFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahCYBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQmAZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEJgGIAVBMGogCiABIAcQogYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxCYBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahCYBiAFIAIgBEEBIAZrEKIGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBCgBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxChBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEJgGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQmAYgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQpAYgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQpAYgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQpAYgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQpAYgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQpAYgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQpAYgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQpAYgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQpAYgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQpAYgBUGQAWogA0IPhkIAIARCABCkBiAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEKQGIAVBgAFqQgEgAn1CACAEQgAQpAYgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhCkBiABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhCkBiABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEKIGIAVBMGogFiATIAZB8ABqEJgGIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEKQGIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQpAYgBSADIA5CBUIAEKQGIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahCYBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCYBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEJgGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEJgGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEJgGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJgGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEJgGIAVBIGogAiAEIAYQmAYgBUEQaiASIAEgBxCiBiAFIAIgBCAHEKIGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCXBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQmAYgAiAAIARBgfgAIANrEKIGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBkPsFJANBkPsBQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEQAAslAQF+IAAgASACrSADrUIghoQgBBCyBiEFIAVCIIinEKgGIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC77ZgYAAAwBBgAgL2M8BaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBzdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGRlbGF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGRldnNfamRfc2VuZF9yYXcAaWRpdgBwcmV2ACVzXyV1AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydAByZXN0YXJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX3JvbGVfc2V0X2hpbnRzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzADB4MXh4eHh4eHggZXhwZWN0ZWQgZm9yIHNlcnZpY2UgY2xhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3ogPT0gcy0+aW5uZXIuc2l6ZQBzdGF0ZS5vZmYgKyAzIDw9IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAF9hbGxvY1JvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAamRpZjogYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAHJvbGUgbmFtZSAnJXMnIGFscmVhZHkgdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABqZGlmOiBjcmVhdGUgcm9sZSAnJXMnIC0+ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAF9wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvdXRmOC5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBbQnVmZmVyWyV1XSAlKnBdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0leCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlKnAuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBvZmYgPCBGU1RPUl9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBzeiA9PSBsZW4gJiYgc3ogPCBERVZTX01BWF9BU0NJSV9TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/ACVjICAlcyA9PgB3c3NrOgB1dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHIgPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uACEgIC4uLgAsAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBkZXZzX2hhbmRsZV90eXBlKHYpID09IERFVlNfSEFORExFX1RZUEVfR0NfT0JKRUNUICYmIGRldnNfaXNfc3RyaW5nKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBFeGNlcHRpb246IFBhbmljXyVkIGF0IChncGM6JWQpACogIGF0IHVua25vd24gKGdwYzolZCkAKiAgYXQgJXNfRiVkIChwYzolZCkAISAgYXQgJXNfRiVkIChwYzolZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpACVzIChXU1NLKQAhdGFyZ2V0X2luX2lycSgpAGZzdG9yOiBpbnZhbGlkIGxhcmdlIGtleTogJyVzJwBmc3RvcjogaW52YWxpZCBrZXk6ICclcycAV1NuOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXU246IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAEAMC4wLjAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAARENGRwqbtMr4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAgACAAIAAgAD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bm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AAD3/YCAAARuYW1lAYd9tQYADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNfZGV2c19wYW5pY19oYW5kbGVyBBFlbV9kZXBsb3lfaGFuZGxlcgUXZW1famRfY3J5cHRvX2dldF9yYW5kb20GDWVtX3NlbmRfZnJhbWUHBGV4aXQIC2VtX3RpbWVfbm93CQ5lbV9wcmludF9kbWVzZwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3D2FwcF9wcmludF9kbWVzZzgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwJYXBwX2RtZXNnPQtmbHVzaF9kbWVzZz4LYXBwX3Byb2Nlc3M/B3R4X2luaXRAD2pkX3BhY2tldF9yZWFkeUEKdHhfcHJvY2Vzc0IXamRfd2Vic29ja19zZW5kX21lc3NhZ2VDDmpkX3dlYnNvY2tfbmV3RAZvbm9wZW5FB29uZXJyb3JGB29uY2xvc2VHCW9ubWVzc2FnZUgQamRfd2Vic29ja19jbG9zZUkOZGV2c19idWZmZXJfb3BKEmRldnNfYnVmZmVyX2RlY29kZUsSZGV2c19idWZmZXJfZW5jb2RlTA9kZXZzX2NyZWF0ZV9jdHhNCXNldHVwX2N0eE4KZGV2c190cmFjZU8PZGV2c19lcnJvcl9jb2RlUBlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUQljbGVhcl9jdHhSDWRldnNfZnJlZV9jdHhTCGRldnNfb29tVAlkZXZzX2ZyZWVVEWRldnNjbG91ZF9wcm9jZXNzVhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFcUZGV2c2Nsb3VkX29uX21lc3NhZ2VYDmRldnNjbG91ZF9pbml0WRRkZXZzX3RyYWNrX2V4Y2VwdGlvbloPZGV2c2RiZ19wcm9jZXNzWxFkZXZzZGJnX3Jlc3RhcnRlZFwVZGV2c2RiZ19oYW5kbGVfcGFja2V0XQtzZW5kX3ZhbHVlc14RdmFsdWVfZnJvbV90YWdfdjBfGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVgDW9ial9nZXRfcHJvcHNhDGV4cGFuZF92YWx1ZWISZGV2c2RiZ19zdXNwZW5kX2NiYwxkZXZzZGJnX2luaXRkEGV4cGFuZF9rZXlfdmFsdWVlBmt2X2FkZGYPZGV2c21ncl9wcm9jZXNzZwd0cnlfcnVuaAxzdG9wX3Byb2dyYW1pD2RldnNtZ3JfcmVzdGFydGoUZGV2c21ncl9kZXBsb3lfc3RhcnRrFGRldnNtZ3JfZGVwbG95X3dyaXRlbBBkZXZzbWdyX2dldF9oYXNobRVkZXZzbWdyX2hhbmRsZV9wYWNrZXRuDmRlcGxveV9oYW5kbGVybxNkZXBsb3lfbWV0YV9oYW5kbGVycA9kZXZzbWdyX2dldF9jdHhxDmRldnNtZ3JfZGVwbG95cgxkZXZzbWdyX2luaXRzEWRldnNtZ3JfY2xpZW50X2V2dBZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb252CmRldnNfcGFuaWN3GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXgQZGV2c19maWJlcl9zbGVlcHkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsehpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3sRZGV2c19pbWdfZnVuX25hbWV8EWRldnNfZmliZXJfYnlfdGFnfRBkZXZzX2ZpYmVyX3N0YXJ0fhRkZXZzX2ZpYmVyX3Rlcm1pYW50ZX8OZGV2c19maWJlcl9ydW6AARNkZXZzX2ZpYmVyX3N5bmNfbm93gQEVX2RldnNfaW52YWxpZF9wcm9ncmFtggEPZGV2c19maWJlcl9wb2tlgwEWZGV2c19nY19vYmpfY2hlY2tfY29yZYQBE2pkX2djX2FueV90cnlfYWxsb2OFAQdkZXZzX2djhgEPZmluZF9mcmVlX2Jsb2NrhwESZGV2c19hbnlfdHJ5X2FsbG9jiAEOZGV2c190cnlfYWxsb2OJAQtqZF9nY191bnBpbooBCmpkX2djX2ZyZWWLARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZIwBDmRldnNfdmFsdWVfcGlujQEQZGV2c192YWx1ZV91bnBpbo4BEmRldnNfbWFwX3RyeV9hbGxvY48BGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5ABFGRldnNfYXJyYXlfdHJ5X2FsbG9jkQEVZGV2c19idWZmZXJfdHJ5X2FsbG9jkgEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jkwEQZGV2c19zdHJpbmdfcHJlcJQBEmRldnNfc3RyaW5nX2ZpbmlzaJUBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lgEPZGV2c19nY19zZXRfY3R4lwEOZGV2c19nY19jcmVhdGWYAQ9kZXZzX2djX2Rlc3Ryb3mZARFkZXZzX2djX29ial9jaGVja5oBC3NjYW5fZ2Nfb2JqmwERcHJvcF9BcnJheV9sZW5ndGicARJtZXRoMl9BcnJheV9pbnNlcnSdARJmdW4xX0FycmF5X2lzQXJyYXmeARBtZXRoWF9BcnJheV9wdXNonwEVbWV0aDFfQXJyYXlfcHVzaFJhbmdloAERbWV0aFhfQXJyYXlfc2xpY2WhARBtZXRoMV9BcnJheV9qb2luogERZnVuMV9CdWZmZXJfYWxsb2OjARBmdW4xX0J1ZmZlcl9mcm9tpAEScHJvcF9CdWZmZXJfbGVuZ3RopQEVbWV0aDFfQnVmZmVyX3RvU3RyaW5npgETbWV0aDNfQnVmZmVyX2ZpbGxBdKcBE21ldGg0X0J1ZmZlcl9ibGl0QXSoARRkZXZzX2NvbXB1dGVfdGltZW91dKkBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwqgEXZnVuMV9EZXZpY2VTY3JpcHRfZGVsYXmrARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOsARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3StARlmdW4wX0RldmljZVNjcmlwdF9yZXN0YXJ0rgEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0rwEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSwARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0sQEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSyARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcrMBHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5ntAEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlztQEiZnVuMV9EZXZpY2VTY3JpcHRfZGV2aWNlSWRlbnRpZmllcrYBHWZ1bjJfRGV2aWNlU2NyaXB0X19zZXJ2ZXJTZW5ktwEcZnVuMl9EZXZpY2VTY3JpcHRfX2FsbG9jUm9sZbgBFG1ldGgxX0Vycm9yX19fY3Rvcl9fuQEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7oBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7sBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fvAEPcHJvcF9FcnJvcl9uYW1lvQERbWV0aDBfRXJyb3JfcHJpbnS+AQ9wcm9wX0RzRmliZXJfaWS/ARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkwAEUbWV0aDFfRHNGaWJlcl9yZXN1bWXBARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZcIBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmTDARFmdW4wX0RzRmliZXJfc2VsZsQBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0xQEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXGARJwcm9wX0Z1bmN0aW9uX25hbWXHAQ9mdW4yX0pTT05fcGFyc2XIARNmdW4zX0pTT05fc3RyaW5naWZ5yQEOZnVuMV9NYXRoX2NlaWzKAQ9mdW4xX01hdGhfZmxvb3LLAQ9mdW4xX01hdGhfcm91bmTMAQ1mdW4xX01hdGhfYWJzzQEQZnVuMF9NYXRoX3JhbmRvbc4BE2Z1bjFfTWF0aF9yYW5kb21JbnTPAQ1mdW4xX01hdGhfbG9n0AENZnVuMl9NYXRoX3Bvd9EBDmZ1bjJfTWF0aF9pZGl20gEOZnVuMl9NYXRoX2ltb2TTAQ5mdW4yX01hdGhfaW11bNQBDWZ1bjJfTWF0aF9taW7VAQtmdW4yX21pbm1heNYBDWZ1bjJfTWF0aF9tYXjXARJmdW4yX09iamVjdF9hc3NpZ27YARBmdW4xX09iamVjdF9rZXlz2QETZnVuMV9rZXlzX29yX3ZhbHVlc9oBEmZ1bjFfT2JqZWN0X3ZhbHVlc9sBGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9m3AEdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3fdARJwcm9wX0RzUGFja2V0X3JvbGXeAR5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXLfARVwcm9wX0RzUGFja2V0X3Nob3J0SWTgARpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleOEBHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmTiARNwcm9wX0RzUGFja2V0X2ZsYWdz4wEXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmTkARZwcm9wX0RzUGFja2V0X2lzUmVwb3J05QEVcHJvcF9Ec1BhY2tldF9wYXlsb2Fk5gEVcHJvcF9Ec1BhY2tldF9pc0V2ZW505wEXcHJvcF9Ec1BhY2tldF9ldmVudENvZGXoARZwcm9wX0RzUGFja2V0X2lzUmVnU2V06QEWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldOoBFXByb3BfRHNQYWNrZXRfcmVnQ29kZesBFnByb3BfRHNQYWNrZXRfaXNBY3Rpb27sARVkZXZzX3BrdF9zcGVjX2J5X2NvZGXtARJwcm9wX0RzUGFja2V0X3NwZWPuARFkZXZzX3BrdF9nZXRfc3BlY+8BFW1ldGgwX0RzUGFja2V0X2RlY29kZfABHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVk8QEYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW508gEWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZfMBFnByb3BfRHNQYWNrZXRTcGVjX2NvZGX0ARpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZfUBGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGX2ARJkZXZzX3BhY2tldF9kZWNvZGX3ARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWT4ARREc1JlZ2lzdGVyX3JlYWRfY29udPkBEmRldnNfcGFja2V0X2VuY29kZfoBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGX7ARZwcm9wX0RzUGFja2V0SW5mb19yb2xl/AEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZf0BFnByb3BfRHNQYWNrZXRJbmZvX2NvZGX+ARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1//ARNwcm9wX0RzUm9sZV9pc0JvdW5kgAIQcHJvcF9Ec1JvbGVfc3BlY4ECGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZIICInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXKDAhdwcm9wX0RzU2VydmljZVNwZWNfbmFtZYQCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwhQIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26GAhJwcm9wX1N0cmluZ19sZW5ndGiHAhdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdIgCE21ldGgxX1N0cmluZ19jaGFyQXSJAhJtZXRoMl9TdHJpbmdfc2xpY2WKAhhmdW5YX1N0cmluZ19mcm9tQ2hhckNvZGWLAgxkZXZzX2luc3BlY3SMAgtpbnNwZWN0X29iao0CB2FkZF9zdHKOAg1pbnNwZWN0X2ZpZWxkjwIUZGV2c19qZF9nZXRfcmVnaXN0ZXKQAhZkZXZzX2pkX2NsZWFyX3BrdF9raW5kkQIQZGV2c19qZF9zZW5kX2NtZJICEGRldnNfamRfc2VuZF9yYXeTAhNkZXZzX2pkX3NlbmRfbG9nbXNnlAITZGV2c19qZF9wa3RfY2FwdHVyZZUCEWRldnNfamRfd2FrZV9yb2xllgISZGV2c19qZF9zaG91bGRfcnVulwIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWYAhNkZXZzX2pkX3Byb2Nlc3NfcGt0mQIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lkmgISZGV2c19qZF9hZnRlcl91c2VymwIUZGV2c19qZF9yb2xlX2NoYW5nZWScAhRkZXZzX2pkX3Jlc2V0X3BhY2tldJ0CEmRldnNfamRfaW5pdF9yb2xlc54CEmRldnNfamRfZnJlZV9yb2xlc58CEmRldnNfamRfYWxsb2Nfcm9sZaACFWRldnNfc2V0X2dsb2JhbF9mbGFnc6ECF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdzogIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzowIQZGV2c19qc29uX2VzY2FwZaQCFWRldnNfanNvbl9lc2NhcGVfY29yZaUCD2RldnNfanNvbl9wYXJzZaYCCmpzb25fdmFsdWWnAgxwYXJzZV9zdHJpbmeoAhNkZXZzX2pzb25fc3RyaW5naWZ5qQINc3RyaW5naWZ5X29iaqoCEXBhcnNlX3N0cmluZ19jb3JlqwIKYWRkX2luZGVudKwCD3N0cmluZ2lmeV9maWVsZK0CEWRldnNfbWFwbGlrZV9pdGVyrgIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SvAhJkZXZzX21hcF9jb3B5X2ludG+wAgxkZXZzX21hcF9zZXSxAgZsb29rdXCyAhNkZXZzX21hcGxpa2VfaXNfbWFwswIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVztAIRZGV2c19hcnJheV9pbnNlcnS1Aghrdl9hZGQuMbYCEmRldnNfc2hvcnRfbWFwX3NldLcCD2RldnNfbWFwX2RlbGV0ZbgCEmRldnNfc2hvcnRfbWFwX2dldLkCIGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWNfaWR4ugIcZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY7sCG2RldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlY7wCHmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjX2lkeL0CGmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjvgIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXS/AhhkZXZzX3JvbGVfc3BlY19mb3JfY2xhc3PAAhdkZXZzX3BhY2tldF9zcGVjX3BhcmVudMECDmRldnNfcm9sZV9zcGVjwgIRZGV2c19yb2xlX3NlcnZpY2XDAg5kZXZzX3JvbGVfbmFtZcQCEmRldnNfZ2V0X2Jhc2Vfc3BlY8UCEGRldnNfc3BlY19sb29rdXDGAhJkZXZzX2Z1bmN0aW9uX2JpbmTHAhFkZXZzX21ha2VfY2xvc3VyZcgCDmRldnNfZ2V0X2ZuaWR4yQITZGV2c19nZXRfZm5pZHhfY29yZcoCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZMsCE2RldnNfZ2V0X3NwZWNfcHJvdG/MAhNkZXZzX2dldF9yb2xlX3Byb3RvzQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3zgIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkzwIVZGV2c19nZXRfc3RhdGljX3Byb3Rv0AIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3Jv0QIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW3SAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3Rv0wIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxk1AIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5k1QIQZGV2c19pbnN0YW5jZV9vZtYCD2RldnNfb2JqZWN0X2dldNcCDGRldnNfc2VxX2dldNgCDGRldnNfYW55X2dldNkCDGRldnNfYW55X3NldNoCDGRldnNfc2VxX3NldNsCDmRldnNfYXJyYXlfc2V03AITZGV2c19hcnJheV9waW5fcHVzaN0CDGRldnNfYXJnX2ludN4CD2RldnNfYXJnX2RvdWJsZd8CD2RldnNfcmV0X2RvdWJsZeACDGRldnNfcmV0X2ludOECDWRldnNfcmV0X2Jvb2ziAg9kZXZzX3JldF9nY19wdHLjAhFkZXZzX2FyZ19zZWxmX21hcOQCEWRldnNfc2V0dXBfcmVzdW1l5QIPZGV2c19jYW5fYXR0YWNo5gIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZecCFWRldnNfbWFwbGlrZV90b192YWx1ZegCEmRldnNfcmVnY2FjaGVfZnJlZekCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzqAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZOsCE2RldnNfcmVnY2FjaGVfYWxsb2PsAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cO0CEWRldnNfcmVnY2FjaGVfYWdl7gIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXvAhJkZXZzX3JlZ2NhY2hlX25leHTwAg9qZF9zZXR0aW5nc19nZXTxAg9qZF9zZXR0aW5nc19zZXTyAg5kZXZzX2xvZ192YWx1ZfMCD2RldnNfc2hvd192YWx1ZfQCEGRldnNfc2hvd192YWx1ZTD1Ag1jb25zdW1lX2NodW5r9gINc2hhXzI1Nl9jbG9zZfcCD2pkX3NoYTI1Nl9zZXR1cPgCEGpkX3NoYTI1Nl91cGRhdGX5AhBqZF9zaGEyNTZfZmluaXNo+gIUamRfc2hhMjU2X2htYWNfc2V0dXD7AhVqZF9zaGEyNTZfaG1hY19maW5pc2j8Ag5qZF9zaGEyNTZfaGtkZv0CDmRldnNfc3RyZm9ybWF0/gIOZGV2c19pc19zdHJpbmf/Ag5kZXZzX2lzX251bWJlcoADG2RldnNfc3RyaW5nX2dldF91dGY4X3N0cnVjdIEDFGRldnNfc3RyaW5nX2dldF91dGY4ggMTZGV2c19idWlsdGluX3N0cmluZ4MDFGRldnNfc3RyaW5nX3ZzcHJpbnRmhAMTZGV2c19zdHJpbmdfc3ByaW50ZoUDFWRldnNfc3RyaW5nX2Zyb21fdXRmOIYDFGRldnNfdmFsdWVfdG9fc3RyaW5nhwMQYnVmZmVyX3RvX3N0cmluZ4gDGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGSJAxJkZXZzX3N0cmluZ19jb25jYXSKAxFkZXZzX3N0cmluZ19zbGljZYsDEmRldnNfcHVzaF90cnlmcmFtZYwDEWRldnNfcG9wX3RyeWZyYW1ljQMPZGV2c19kdW1wX3N0YWNrjgMTZGV2c19kdW1wX2V4Y2VwdGlvbo8DCmRldnNfdGhyb3eQAxJkZXZzX3Byb2Nlc3NfdGhyb3eRAxBkZXZzX2FsbG9jX2Vycm9ykgMVZGV2c190aHJvd190eXBlX2Vycm9ykwMWZGV2c190aHJvd19yYW5nZV9lcnJvcpQDHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcpUDGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9ylgMeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh0lwMYZGV2c190aHJvd190b29fYmlnX2Vycm9ymAMXZGV2c190aHJvd19zeW50YXhfZXJyb3KZAxFkZXZzX3N0cmluZ19pbmRleJoDEmRldnNfc3RyaW5nX2xlbmd0aJsDGWRldnNfdXRmOF9mcm9tX2NvZGVfcG9pbnScAxtkZXZzX3V0ZjhfY29kZV9wb2ludF9sZW5ndGidAxRkZXZzX3V0ZjhfY29kZV9wb2ludJ4DFGRldnNfc3RyaW5nX2ptcF9pbml0nwMOZGV2c191dGY4X2luaXSgAxZkZXZzX3ZhbHVlX2Zyb21fZG91YmxloQMTZGV2c192YWx1ZV9mcm9tX2ludKIDFGRldnNfdmFsdWVfZnJvbV9ib29sowMXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXKkAxRkZXZzX3ZhbHVlX3RvX2RvdWJsZaUDEWRldnNfdmFsdWVfdG9faW50pgMSZGV2c192YWx1ZV90b19ib29spwMOZGV2c19pc19idWZmZXKoAxdkZXZzX2J1ZmZlcl9pc193cml0YWJsZakDEGRldnNfYnVmZmVyX2RhdGGqAxNkZXZzX2J1ZmZlcmlzaF9kYXRhqwMUZGV2c192YWx1ZV90b19nY19vYmqsAw1kZXZzX2lzX2FycmF5rQMRZGV2c192YWx1ZV90eXBlb2auAw9kZXZzX2lzX251bGxpc2ivAxlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVksAMUZGV2c192YWx1ZV9hcHByb3hfZXGxAxJkZXZzX3ZhbHVlX2llZWVfZXGyAw1kZXZzX3ZhbHVlX2VxswMcZGV2c192YWx1ZV9lcV9idWlsdGluX3N0cmluZ7QDHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY7UDEmRldnNfaW1nX3N0cmlkeF9va7YDEmRldnNfZHVtcF92ZXJzaW9uc7cDC2RldnNfdmVyaWZ5uAMRZGV2c19mZXRjaF9vcGNvZGW5Aw5kZXZzX3ZtX3Jlc3VtZboDEWRldnNfdm1fc2V0X2RlYnVnuwMZZGV2c192bV9jbGVhcl9icmVha3BvaW50c7wDGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludL0DDGRldnNfdm1faGFsdL4DD2RldnNfdm1fc3VzcGVuZL8DFmRldnNfdm1fc2V0X2JyZWFrcG9pbnTAAxRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc8EDGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4wgMXZGV2c19pbWdfZ2V0X3N0cmluZ19qbXDDAxFkZXZzX2ltZ19nZXRfdXRmOMQDFGRldnNfZ2V0X3N0YXRpY191dGY4xQMUZGV2c192YWx1ZV9idWZmZXJpc2jGAwxleHByX2ludmFsaWTHAxRleHByeF9idWlsdGluX29iamVjdMgDC3N0bXQxX2NhbGwwyQMLc3RtdDJfY2FsbDHKAwtzdG10M19jYWxsMssDC3N0bXQ0X2NhbGwzzAMLc3RtdDVfY2FsbDTNAwtzdG10Nl9jYWxsNc4DC3N0bXQ3X2NhbGw2zwMLc3RtdDhfY2FsbDfQAwtzdG10OV9jYWxsONEDEnN0bXQyX2luZGV4X2RlbGV0ZdIDDHN0bXQxX3JldHVybtMDCXN0bXR4X2ptcNQDDHN0bXR4MV9qbXBfetUDCmV4cHIyX2JpbmTWAxJleHByeF9vYmplY3RfZmllbGTXAxJzdG10eDFfc3RvcmVfbG9jYWzYAxNzdG10eDFfc3RvcmVfZ2xvYmFs2QMSc3RtdDRfc3RvcmVfYnVmZmVy2gMJZXhwcjBfaW5m2wMQZXhwcnhfbG9hZF9sb2NhbNwDEWV4cHJ4X2xvYWRfZ2xvYmFs3QMLZXhwcjFfdXBsdXPeAwtleHByMl9pbmRleN8DD3N0bXQzX2luZGV4X3NldOADFGV4cHJ4MV9idWlsdGluX2ZpZWxk4QMSZXhwcngxX2FzY2lpX2ZpZWxk4gMRZXhwcngxX3V0ZjhfZmllbGTjAxBleHByeF9tYXRoX2ZpZWxk5AMOZXhwcnhfZHNfZmllbGTlAw9zdG10MF9hbGxvY19tYXDmAxFzdG10MV9hbGxvY19hcnJheecDEnN0bXQxX2FsbG9jX2J1ZmZlcugDF2V4cHJ4X3N0YXRpY19zcGVjX3Byb3Rv6QMTZXhwcnhfc3RhdGljX2J1ZmZlcuoDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ+sDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfsAxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmftAxVleHByeF9zdGF0aWNfZnVuY3Rpb27uAw1leHByeF9saXRlcmFs7wMRZXhwcnhfbGl0ZXJhbF9mNjTwAxFleHByM19sb2FkX2J1ZmZlcvEDDWV4cHIwX3JldF92YWzyAwxleHByMV90eXBlb2bzAw9leHByMF91bmRlZmluZWT0AxJleHByMV9pc191bmRlZmluZWT1AwpleHByMF90cnVl9gMLZXhwcjBfZmFsc2X3Aw1leHByMV90b19ib29s+AMJZXhwcjBfbmFu+QMJZXhwcjFfYWJz+gMNZXhwcjFfYml0X25vdPsDDGV4cHIxX2lzX25hbvwDCWV4cHIxX25lZ/0DCWV4cHIxX25vdP4DDGV4cHIxX3RvX2ludP8DCWV4cHIyX2FkZIAECWV4cHIyX3N1YoEECWV4cHIyX211bIIECWV4cHIyX2RpdoMEDWV4cHIyX2JpdF9hbmSEBAxleHByMl9iaXRfb3KFBA1leHByMl9iaXRfeG9yhgQQZXhwcjJfc2hpZnRfbGVmdIcEEWV4cHIyX3NoaWZ0X3JpZ2h0iAQaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWSJBAhleHByMl9lcYoECGV4cHIyX2xliwQIZXhwcjJfbHSMBAhleHByMl9uZY0EEGV4cHIxX2lzX251bGxpc2iOBBRzdG10eDJfc3RvcmVfY2xvc3VyZY8EE2V4cHJ4MV9sb2FkX2Nsb3N1cmWQBBJleHByeF9tYWtlX2Nsb3N1cmWRBBBleHByMV90eXBlb2Zfc3RykgQTc3RtdHhfam1wX3JldF92YWxfepMEEHN0bXQyX2NhbGxfYXJyYXmUBAlzdG10eF90cnmVBA1zdG10eF9lbmRfdHJ5lgQLc3RtdDBfY2F0Y2iXBA1zdG10MF9maW5hbGx5mAQLc3RtdDFfdGhyb3eZBA5zdG10MV9yZV90aHJvd5oEEHN0bXR4MV90aHJvd19qbXCbBA5zdG10MF9kZWJ1Z2dlcpwECWV4cHIxX25ld50EEWV4cHIyX2luc3RhbmNlX29mngQKZXhwcjBfbnVsbJ8ED2V4cHIyX2FwcHJveF9lcaAED2V4cHIyX2FwcHJveF9uZaEEE3N0bXQxX3N0b3JlX3JldF92YWyiBBFleHByeF9zdGF0aWNfc3BlY6MED2RldnNfdm1fcG9wX2FyZ6QEE2RldnNfdm1fcG9wX2FyZ191MzKlBBNkZXZzX3ZtX3BvcF9hcmdfaTMypgQWZGV2c192bV9wb3BfYXJnX2J1ZmZlcqcEEmpkX2Flc19jY21fZW5jcnlwdKgEEmpkX2Flc19jY21fZGVjcnlwdKkEDEFFU19pbml0X2N0eKoED0FFU19FQ0JfZW5jcnlwdKsEEGpkX2Flc19zZXR1cF9rZXmsBA5qZF9hZXNfZW5jcnlwdK0EEGpkX2Flc19jbGVhcl9rZXmuBAtqZF93c3NrX25ld68EFGpkX3dzc2tfc2VuZF9tZXNzYWdlsAQTamRfd2Vic29ja19vbl9ldmVudLEEB2RlY3J5cHSyBA1qZF93c3NrX2Nsb3NlswQQamRfd3Nza19vbl9ldmVudLQEC3Jlc3Bfc3RhdHVztQQSd3Nza2hlYWx0aF9wcm9jZXNztgQXamRfdGNwc29ja19pc19hdmFpbGFibGW3BBR3c3NraGVhbHRoX3JlY29ubmVjdLgEGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldLkED3NldF9jb25uX3N0cmluZ7oEEWNsZWFyX2Nvbm5fc3RyaW5nuwQPd3Nza2hlYWx0aF9pbml0vAQRd3Nza19zZW5kX21lc3NhZ2W9BBF3c3NrX2lzX2Nvbm5lY3RlZL4EFHdzc2tfdHJhY2tfZXhjZXB0aW9uvwQSd3Nza19zZXJ2aWNlX3F1ZXJ5wAQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZcEEFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGXCBA9yb2xlbWdyX3Byb2Nlc3PDBBByb2xlbWdyX2F1dG9iaW5kxAQVcm9sZW1ncl9oYW5kbGVfcGFja2V0xQQUamRfcm9sZV9tYW5hZ2VyX2luaXTGBBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWTHBBFqZF9yb2xlX3NldF9oaW50c8gEDWpkX3JvbGVfYWxsb2PJBBBqZF9yb2xlX2ZyZWVfYWxsygQWamRfcm9sZV9mb3JjZV9hdXRvYmluZMsEE2pkX2NsaWVudF9sb2dfZXZlbnTMBBNqZF9jbGllbnRfc3Vic2NyaWJlzQQUamRfY2xpZW50X2VtaXRfZXZlbnTOBBRyb2xlbWdyX3JvbGVfY2hhbmdlZM8EEGpkX2RldmljZV9sb29rdXDQBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XRBBNqZF9zZXJ2aWNlX3NlbmRfY21k0gQRamRfY2xpZW50X3Byb2Nlc3PTBA5qZF9kZXZpY2VfZnJlZdQEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V01QQPamRfZGV2aWNlX2FsbG9j1gQQc2V0dGluZ3NfcHJvY2Vzc9cEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXTYBA1zZXR0aW5nc19pbml02QQPamRfY3RybF9wcm9jZXNz2gQVamRfY3RybF9oYW5kbGVfcGFja2V02wQMamRfY3RybF9pbml03AQUZGNmZ19zZXRfdXNlcl9jb25maWfdBAlkY2ZnX2luaXTeBA1kY2ZnX3ZhbGlkYXRl3wQOZGNmZ19nZXRfZW50cnngBAxkY2ZnX2dldF9pMzLhBAxkY2ZnX2dldF91MzLiBA9kY2ZnX2dldF9zdHJpbmfjBAxkY2ZnX2lkeF9rZXnkBAlqZF92ZG1lc2flBBFqZF9kbWVzZ19zdGFydHB0cuYEDWpkX2RtZXNnX3JlYWTnBBJqZF9kbWVzZ19yZWFkX2xpbmXoBBNqZF9zZXR0aW5nc19nZXRfYmlu6QQKZmluZF9lbnRyeeoED3JlY29tcHV0ZV9jYWNoZesEE2pkX3NldHRpbmdzX3NldF9iaW7sBAtqZF9mc3Rvcl9nY+0EFWpkX3NldHRpbmdzX2dldF9sYXJnZe4EFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2XvBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZfAEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XxBA1qZF9pcGlwZV9vcGVu8gQWamRfaXBpcGVfaGFuZGxlX3BhY2tldPMEDmpkX2lwaXBlX2Nsb3Nl9AQSamRfbnVtZm10X2lzX3ZhbGlk9QQVamRfbnVtZm10X3dyaXRlX2Zsb2F09gQTamRfbnVtZm10X3dyaXRlX2kzMvcEEmpkX251bWZtdF9yZWFkX2kzMvgEFGpkX251bWZtdF9yZWFkX2Zsb2F0+QQRamRfb3BpcGVfb3Blbl9jbWT6BBRqZF9vcGlwZV9vcGVuX3JlcG9ydPsEFmpkX29waXBlX2hhbmRsZV9wYWNrZXT8BBFqZF9vcGlwZV93cml0ZV9leP0EEGpkX29waXBlX3Byb2Nlc3P+BBRqZF9vcGlwZV9jaGVja19zcGFjZf8EDmpkX29waXBlX3dyaXRlgAUOamRfb3BpcGVfY2xvc2WBBQ1qZF9xdWV1ZV9wdXNoggUOamRfcXVldWVfZnJvbnSDBQ5qZF9xdWV1ZV9zaGlmdIQFDmpkX3F1ZXVlX2FsbG9jhQUNamRfcmVzcG9uZF91OIYFDmpkX3Jlc3BvbmRfdTE2hwUOamRfcmVzcG9uZF91MzKIBRFqZF9yZXNwb25kX3N0cmluZ4kFF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkigULamRfc2VuZF9wa3SLBR1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbIwFF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyjQUZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldI4FFGpkX2FwcF9oYW5kbGVfcGFja2V0jwUVamRfYXBwX2hhbmRsZV9jb21tYW5kkAUVYXBwX2dldF9pbnN0YW5jZV9uYW1lkQUTamRfYWxsb2NhdGVfc2VydmljZZIFEGpkX3NlcnZpY2VzX2luaXSTBQ5qZF9yZWZyZXNoX25vd5QFGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWSVBRRqZF9zZXJ2aWNlc19hbm5vdW5jZZYFF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1llwUQamRfc2VydmljZXNfdGlja5gFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ5kFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlmgUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZZsFFGFwcF9nZXRfZGV2aWNlX2NsYXNznAUSYXBwX2dldF9md192ZXJzaW9unQUNamRfc3J2Y2ZnX3J1bp4FF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1lnwURamRfc3J2Y2ZnX3ZhcmlhbnSgBQ1qZF9oYXNoX2ZudjFhoQUMamRfZGV2aWNlX2lkogUJamRfcmFuZG9towUIamRfY3JjMTakBQ5qZF9jb21wdXRlX2NyY6UFDmpkX3NoaWZ0X2ZyYW1lpgUMamRfd29yZF9tb3ZlpwUOamRfcmVzZXRfZnJhbWWoBRBqZF9wdXNoX2luX2ZyYW1lqQUNamRfcGFuaWNfY29yZaoFE2pkX3Nob3VsZF9zYW1wbGVfbXOrBRBqZF9zaG91bGRfc2FtcGxlrAUJamRfdG9faGV4rQULamRfZnJvbV9oZXiuBQ5qZF9hc3NlcnRfZmFpbK8FB2pkX2F0b2mwBQ9qZF92c3ByaW50Zl9leHSxBQ9qZF9wcmludF9kb3VibGWyBQtqZF92c3ByaW50ZrMFCmpkX3NwcmludGa0BRJqZF9kZXZpY2Vfc2hvcnRfaWS1BQxqZF9zcHJpbnRmX2G2BQtqZF90b19oZXhfYbcFCWpkX3N0cmR1cLgFCWpkX21lbWR1cLkFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWW6BRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVluwURamRfc2VuZF9ldmVudF9leHS8BQpqZF9yeF9pbml0vQUUamRfcnhfZnJhbWVfcmVjZWl2ZWS+BR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja78FD2pkX3J4X2dldF9mcmFtZcAFE2pkX3J4X3JlbGVhc2VfZnJhbWXBBRFqZF9zZW5kX2ZyYW1lX3Jhd8IFDWpkX3NlbmRfZnJhbWXDBQpqZF90eF9pbml0xAUHamRfc2VuZMUFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmPGBQ9qZF90eF9nZXRfZnJhbWXHBRBqZF90eF9mcmFtZV9zZW50yAULamRfdHhfZmx1c2jJBRBfX2Vycm5vX2xvY2F0aW9uygUMX19mcGNsYXNzaWZ5ywUFZHVtbXnMBQhfX21lbWNwec0FB21lbW1vdmXOBQZtZW1zZXTPBQpfX2xvY2tmaWxl0AUMX191bmxvY2tmaWxl0QUGZmZsdXNo0gUEZm1vZNMFDV9fRE9VQkxFX0JJVFPUBQxfX3N0ZGlvX3NlZWvVBQ1fX3N0ZGlvX3dyaXRl1gUNX19zdGRpb19jbG9zZdcFCF9fdG9yZWFk2AUJX190b3dyaXRl2QUJX19md3JpdGV42gUGZndyaXRl2wUUX19wdGhyZWFkX211dGV4X2xvY2vcBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr3QUGX19sb2Nr3gUIX191bmxvY2vfBQ5fX21hdGhfZGl2emVyb+AFCmZwX2JhcnJpZXLhBQ5fX21hdGhfaW52YWxpZOIFA2xvZ+MFBXRvcDE25AUFbG9nMTDlBQdfX2xzZWVr5gUGbWVtY21w5wUKX19vZmxfbG9ja+gFDF9fb2ZsX3VubG9ja+kFDF9fbWF0aF94Zmxvd+oFDGZwX2JhcnJpZXIuMesFDF9fbWF0aF9vZmxvd+wFDF9fbWF0aF91Zmxvd+0FBGZhYnPuBQNwb3fvBQV0b3AxMvAFCnplcm9pbmZuYW7xBQhjaGVja2ludPIFDGZwX2JhcnJpZXIuMvMFCmxvZ19pbmxpbmX0BQpleHBfaW5saW5l9QULc3BlY2lhbGNhc2X2BQ1mcF9mb3JjZV9ldmFs9wUFcm91bmT4BQZzdHJjaHL5BQtfX3N0cmNocm51bPoFBnN0cmNtcPsFBnN0cmxlbvwFBm1lbWNocv0FBnN0cnN0cv4FDnR3b2J5dGVfc3Ryc3Ry/wUQdGhyZWVieXRlX3N0cnN0coAGD2ZvdXJieXRlX3N0cnN0coEGDXR3b3dheV9zdHJzdHKCBgdfX3VmbG93gwYHX19zaGxpbYQGCF9fc2hnZXRjhQYHaXNzcGFjZYYGBnNjYWxibocGCWNvcHlzaWdubIgGB3NjYWxibmyJBg1fX2ZwY2xhc3NpZnlsigYFZm1vZGyLBgVmYWJzbIwGC19fZmxvYXRzY2FujQYIaGV4ZmxvYXSOBghkZWNmbG9hdI8GB3NjYW5leHCQBgZzdHJ0b3iRBgZzdHJ0b2SSBhJfX3dhc2lfc3lzY2FsbF9yZXSTBghkbG1hbGxvY5QGBmRsZnJlZZUGGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZZYGBHNicmuXBghfX2FkZHRmM5gGCV9fYXNobHRpM5kGB19fbGV0ZjKaBgdfX2dldGYymwYIX19kaXZ0ZjOcBg1fX2V4dGVuZGRmdGYynQYNX19leHRlbmRzZnRmMp4GC19fZmxvYXRzaXRmnwYNX19mbG9hdHVuc2l0ZqAGDV9fZmVfZ2V0cm91bmShBhJfX2ZlX3JhaXNlX2luZXhhY3SiBglfX2xzaHJ0aTOjBghfX211bHRmM6QGCF9fbXVsdGkzpQYJX19wb3dpZGYypgYIX19zdWJ0ZjOnBgxfX3RydW5jdGZkZjKoBgtzZXRUZW1wUmV0MKkGC2dldFRlbXBSZXQwqgYJc3RhY2tTYXZlqwYMc3RhY2tSZXN0b3JlrAYKc3RhY2tBbGxvY60GHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSuBhVlbXNjcmlwdGVuX3N0YWNrX2luaXSvBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlsAYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZbEGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZLIGDGR5bkNhbGxfamlqabMGFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamm0BhhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGyBgQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 27784;
var ___stop_em_js = Module['___stop_em_js'] = 28837;



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
