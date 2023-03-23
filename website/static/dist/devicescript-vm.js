
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGADf35/AX5gAAF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+WFgIAA4wUHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDABAHEAAHBwMGAgcHAgcHAwkFBQUFBxYKDQUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYAAAUCAgIAAwMDBQAAAAIBAAIFAAUFAwICAwICAwQDAwMFAggAAgEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQEFAwAKAAICAAEBAQABAAABAAAACgABAgABAQQFAQIAAAAACAMFCgICAgAGCgMJAwEGBQMGCQYGBQYFAwYGCQ0GAwMFBQMDAwMGBQYGBgYGBgEDDhECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAUCBgYGAQEGBgoBAwICAQAKBgYBBgYBBhECAgYOAwMDAwUFAwMDBAQFBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgIEBAEKDQICAAAHCQkBAwcBAgAIAAIGAAcJCAAEBAQAAAIHAAMHBwECAQASAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQcFBwcDAwUIBQAABB8BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEAgDAAQBAAkBAwMBAwYECSAJFwMDBAMHBwYHBAQIAAQEBwkHCAAHCBMEBQUFBAAEGCEPBQQEBAUJBAQAABQLCwsTCw8FCAciCxQUCxgTEhILIyQlJgsDAwMEBBcEBBkMFScMKAYWKSoGDgQEAAgEDBUaGgwRKwICCAgVDAwZDCwACAgABAgHCAgILQ0uBIeAgIAAAXAB1gHWAQWGgICAAAEBgAKAAgbdgICAAA5/AUHA8AULfwFBAAt/AUEAC38BQQALfwBBuM4BC38AQafPAQt/AEHx0AELfwBB7dEBC38AQenSAQt/AEG50wELfwBB2tMBC38AQd/VAQt/AEG4zgELfwBB1dYBCwf9hYCAACMGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFwZtYWxsb2MA2AUWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBRBfX2Vycm5vX2xvY2F0aW9uAJQFGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlANkFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACsaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcALApqZF9lbV9pbml0AC0NamRfZW1fcHJvY2VzcwAuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC8RamRfZW1fZGV2c19kZXBsb3kAMBFqZF9lbV9kZXZzX3ZlcmlmeQAxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAzFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDCwZmZmx1c2gAnAUVZW1zY3JpcHRlbl9zdGFja19pbml0APMFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA9AUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQD1BRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA9gUJc3RhY2tTYXZlAO8FDHN0YWNrUmVzdG9yZQDwBQpzdGFja0FsbG9jAPEFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA8gUNX19zdGFydF9lbV9qcwMMDF9fc3RvcF9lbV9qcwMNDGR5bkNhbGxfamlqaQD4BQmh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KALQARCYASAAQQBBiAgQmQUaCxIAAkAgAEUNACAAEFEgABAiCwssAQF/IwBBEGsiAiQAIAIgATYCAEHx0AAgAhA8IABB5NQDEIIBIAJBEGokAAsNACAAKALQASABEIwBCwIAC5EDAQR/AkACQAJAAkACQCABLwEOIgJBgH9qDgIAAQILAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtB0RJBABA8DwtBAiABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQJBpjNBABA8DwsCQAJAIAEtAAwiA0UNAAJAAkAgAS0AEA0AIANBAEchAkEBIQQMAQtBACEEA0AgBCIFQQFqIgIgA0YNAiACIQQgASACakEQai0AAA0ACyACIANJIQIgBUECaiEECyAEIQQgAg0BC0HREkEAEDwPC0EBIAFBEGoiASABIARqIAMgBGsgACgCCCgCABEJAEUNAUGmM0EAEDwPCyACQYAjRg0BAkAgACgCCCgCDCICRQ0AIAEgAhEEAEEASg0BCyABENUEGgsPCyABIAAoAggoAgQRCABB/wFxENEEGgs1AQJ/QQAoAoDcASEDQYABIQQCQAJAAkAgAEF/ag4CAAECC0GBASEECyADIAQgASACEIYFCwsbAQF/QcjZABDdBCIBIAA2AghBACABNgKA3AELLgEBfwJAQQAoAoDcASIBRQ0AIAEoAggiAUUNACABKAIQIgFFDQAgACABEQAACwvCAQEFfwJAIAAtAApFDQAgAEEUaiIBIQIDQAJAAkACQCAALwEMIgMgAC8BDiIESw0AIAIQzAQaIABBADoACiAAKAIQECIMAQsCQAJAIAEgACgCECAALQALIgUgBGxqIAMgBGsiBEHIASAEQcgBSRtBASAFQQFGGyIEIAVsEMsEDgIABQELIAAgAC8BDiAEajsBDgwCCyAALQAKRQ0BIAEQzAQaIABBADoACiAAKAIQECILIABBADYCEAsgAC0ACg0ACwsLbQEDfwJAQQAoAoTcASIBRQ0AAkAQcCICRQ0AIAIgAS0ABkEARxCIAyACQQA6AEkgAiABLQAIQQBHQQF0IgM6AEkgAS0AB0UN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IgYgAk0NACABIAYgAmsiBjYCWCABKAJMIgcgBE0NACABIAcgBGsiBzYCTCADIARqIAUgAmogByAGIAAgBiAASRsiACAHIABJGxCXBRoLIAFB4ABqJAALHwEBfwJAIABBABC0AiIBQQBIDQAgACgCrAEgARB4CwsjAQF/IABB39QDIABBABC0AiIBIAFBoKt8akGhq3xJGxCCAQsJACAAQQAQggELywECB38BfiMAQeAAayIBJAACQCAALQBDQQJJDQAgASAAQdgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQ1wIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHgAGoiAyAALQBDQX5qIgRBABDUAiIFQX9qIgYQlAEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQ1AIaDAELIAdBBmogAUEQaiAGEJcFGgsgACAHELkCCyABQeAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQtAIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqENwCIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEPwBIAFBIGokAAsOACAAIABBABC1AhC2AgsPACAAIABBABC1Ap0QtgILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahD9AkUNACABIAEpA2g3AxAgASAAIAFBEGoQygI2AgBBgRcgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqENwCIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI4BIAEgASkDYDcDOCAAIAFBOGpBABDXAiECIAEgASkDaDcDMCABIAAgAUEwahDKAjYCJCABIAI2AiBBsxcgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjwELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqENwCIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAENcCIgJFDQAgAiABQSBqEK4EIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlQEQ8gIgACgCrAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPAAboQ7wIgACgCrAEgASkDCDcDICABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC6AiICRQ0AAkAgAigCBA0AIAIgAEEcEJECNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABDYAgsgASABKQMINwMAIAAgAkH2ACABEN4CIAAgAhC5AgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQugIiAkUNAAJAIAIoAgQNACACIABBIBCRAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQ2AILIAEgASkDCDcDACAAIAJB9gAgARDeAiAAIAIQuQILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAELoCIgJFDQACQCACKAIEDQAgAiAAQR4QkQI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAENgCCyABIAEpAwg3AwAgACACQfYAIAEQ3gIgACACELkCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABC6AiICRQ0AAkAgAigCBA0AIAIgAEEiEJECNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARDYAgsgASABKQMINwMAIAAgAkH2ACABEN4CIAAgAhC5AgsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEKICAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABCiAgsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1AiAjcDACABIAI3AwggACABEOQCIAAQWSABQRBqJAALXAECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUEBRg0BCyADIAIpAwA3AwggACABQYsBIANBCGoQ6wIMAQsgACACKAIAEPACCyADQRBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNQNwMYAkACQAJAIAEoAhwiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDGDcDCCABQRBqIABBiwEgAUEIahDr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CyABQSBqJAALFQAgABDuBLhEAAAAAAAA8D2iELYCC2QBBX8CQAJAIABBABC0AiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEO4EIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQtwILEQAgACAAQQAQtQIQrQUQtgILGAAgACAAQQAQtQIgAEEBELUCELkFELYCCy4BA38gAEEAELQCIQFBACECAkAgAEEBELQCIgNFDQAgASADbSECCyAAIAIQtwILLgEDfyAAQQAQtAIhAUEAIQICQCAAQQEQtAIiA0UNACABIANvIQILIAAgAhC3AgsWACAAIABBABC0AiAAQQEQtAJsELcCCwkAIABBARDNAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahD0AiEDIAIgAikDIDcDECAAIAJBEGoQ9AIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEPMCIQYgAiACKQMgNwMAIAAgAhDzAiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA5hsNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAEM0BC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahD9Ag0AIAEgASkDKDcDECAAIAFBEGoQpAIhAiABIAEpAyA3AwggACABQQhqEKgCIgNFDQAgAkUNACAAIAIgAxCSAgsgACgCrAEgASkDKDcDICABQTBqJAALCQAgAEEBENEBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahCoAiIDRQ0AIABBABCSASIERQ0AIAJBIGogAEEIIAQQ8gIgAiACKQMgNwMQIAAgAkEQahCOASAAIAMgBCABEJYCIAIgAikDIDcDCCAAIAJBCGoQjwEgACgCrAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDRAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahD6AiICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqEOsCDAELIAEgASkDMDcDGAJAIAAgAUEYahCoAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQ6wIMAQsgAiADNgIEIAAoAqwBIAEpAzg3AyALIAFBwABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOsCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAEgAi8BEhCRA0UNACAAIAIvARI2AgAgAEECNgIEDAELIABCADcDAAsgA0EgaiQAC7ABAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgAyACQQhqQQgQgQU2AgAgACABQYgVIAMQ2gILIANBIGokAAu4AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ6wJBACECCwJAAkAgAiICDQAgAEIANwMADAELIANBGGogAikDCBD/BCADIANBGGo2AgAgACABQdgYIAMQ2gILIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ6wJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFRDwAgsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQEPACCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOsCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABQQ8AILIANBIGokAAuiAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ6wJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFEEBcRDxAgsgA0EgaiQAC6MBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUQQFxRRDxAgsgA0EgaiQAC6MBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACABQQggAigCHBDyAgsgA0EgaiQAC8sBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQAJAIAItABRBAXFFDQBBACEBDAELQQAhASACLQAVQTBLDQAgAi8BEEEPdiEBCyAAIAEQ8QILIANBIGokAAvJAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ6wJBACECCwJAAkAgAiICDQAgAEIANwMADAELAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLgEQQX9KDQAgACACLQAQEPACDAELIABCADcDAAsgA0EgaiQAC6kBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgMAARhDxAgsgA0EgaiQAC6gBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDrAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgCBGEPECCyADQSBqJAALvgEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOsCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAIvARAiAkEMdkF/akECSQ0AIABCADcDAAwBCyAAIAJB/x9xEPACCyADQSBqJAALowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOsCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARBBgCBJEPECCyADQSBqJAALcgECfwJAIAJB//8DRw0AQQAPCwJAIAEvAQgiAw0AQQAPCyAAKACkASIAIAAoAmBqIAEvAQpBAnRqIQRBACEBA0ACQCAEIAEiAUEDdGovAQIgAkcNACAEIAFBA3RqDwsgAUEBaiIAIQEgACADRw0AC0EAC5IBAQF/IAFBgOADcSECAkACQAJAIABBAXFFDQACQCACDQAgASEBDAMLIAJBgMAARw0BIAFB/x9xQYAgciEBDAILAkAgAcFBf0oNACABQf8BcUGAgH5yIQEMAgsCQCACRQ0AIAJBgCBHDQEgAUH/H3FBgCByIQEMAgsgAUGAwAByIQEMAQtB//8DIQELIAFB//8DcQv0AwEHfyMAQSBrIgEkACABIAApA1A3AxACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECIDRQ0AIAMhAiADKAIAQYCAgPgAcUGAgIDQAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQ6wJBACECCwJAAkAgAiIEDQBBACECDAELAkAgACAELwESEJ0CIgMNAEEAIQIMAQsgBC4BECIFQYBgcSECAkACQAJAIAQtABRBAXFFDQACQCACDQAgBSEFDAMLIAJB//8DcUGAwABHDQEgBUH/H3FBgCByIQUMAgsCQCAFQX9KDQAgBUH/AXFBgIB+ciEFDAILAkAgAkUNACACQf//A3FBgCBHDQEgBUH/H3FBgCByIQUMAgsgBUGAwAByIQUMAQtB//8DIQULQQAhAiAFIgZB//8DcUH//wNGDQACQCADLwEIIgcNAEEAIQIMAQsgACgApAEiAiACKAJgaiADLwEKQQJ0aiEFIAZB//8DcSEGQQAhAgNAAkAgBSACIgJBA3RqLwECIAZHDQAgBSACQQN0aiECDAILIAJBAWoiAyECIAMgB0cNAAtBACECCwJAIAIiAkUNACABQQhqIAAgAiAEKAIcIgNBDGogAy8BBBDmASAAKAKsASABKQMINwMgCyABQSBqJAALowMBBH8jAEEwayIFJAAgBSADNgIsAkACQCACLQAEQQFxRQ0AAkAgAUEAEJIBIgYNACAAQgA3AwAMAgsgAyAEaiEHIAAgAUEIIAYQ8gIgBSAAKQMANwMYIAEgBUEYahCOAUEAIQMgASgApAEiBCAEKAJgaiACLwEGQQJ0aiECA0AgAiECIAMhAwJAAkAgByAFKAIsIghrIgRBAE4NACADIQMgAiECQQIhBAwBCyAFQSBqIAEgAi0AAiAFQSxqIAQQSgJAAkACQCAFKQMgUA0AIAUgBSkDIDcDECABIAYgBUEQahCzAiAFKAIsIAhGDQAgAyEEAkAgAw0AIAItAANBHnRBH3UgAnEhBAsgBCEDIAJBBGohBAJAAkAgAi8BBEUNACAEIQIMAQsgAyECIAMNAEEAIQMgBCECDAILIAMhAyACIQJBACEEDAILIAMhAyACIQILQQIhBAsgAyEDIAIhAiAEIQQLIAMhAyACIQIgBEUNAAsgBSAAKQMANwMIIAEgBUEIahCPAQwBCyAAIAEgAi8BBiAFQSxqIAQQSgsgBUEwaiQAC90BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQnAIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBhxwgAUEQahDsAkEAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABB+hsgAUEIahDsAkEAIQMLAkAgAyIDRQ0AIAAoAqwBIQIgACABKAIkIAMvAQJB9ANBABD2ASACQREgAxC7AgsgAUHAAGokAAs9AQF/IwBBEGsiAiQAIAJBCGogACABIABBtAJqIABBsAJqLQAAEOYBIAAoAqwBIAIpAwg3AyAgAkEQaiQAC78EAQp/IwBBMGsiAiQAIABB2ABqIQMCQAJAIAAtAENBf2oiBEEBRg0AIAMhAyAEIQQMAQsgAiADKQMANwMgAkAgACACQSBqEPsCDQAgAyEDQQEhBAwBCyACIAMpAwA3AxggACACQRhqEPoCIgQoAgwhAyAELwEIIQQLIAQhBSADIQYgAEG0AmohBwJAAkAgAS0ABEEBcUUNACAHIQMgBUUNASAAQaAEaiEIIAchBEEAIQlBACEKIAAoAKQBIgMgAygCYGogAS8BBkECdGohAQNAIAEhAyAKIQogCSEJAkACQCAIIAQiBGsiAUEASA0AIAMtAAIhCyACIAYgCUEDdGopAwA3AxAgACALIAQgASACQRBqEEsiAUUNACAKIQsCQCAKDQAgAy0AA0EedEEfdSADcSELCyALIQogBCABaiEEIANBBGohAQJAAkACQCADLwEERQ0AIAEhAwwBCyAKIQMgCg0AIAEhAUEAIQpBASELDAELIAMhASAKIQpBACELCyAEIQMMAQsgAyEBIAohCkEBIQsgBCEDCyADIQMgCiEKIAEhAQJAIAtFDQAgAyEDDAMLIAMhBCAJQQFqIgshCSAKIQogASEBIAMhAyALIAVHDQAMAgsACyAHIQMCQAJAIAUOAgIBAAsgAiAFNgIAIAJBKGogAEGgNCACEOkCIAchAwwBCyABLwEGIQMgAiAGKQMANwMIIAcgACADIAdB7AEgAkEIahBLaiEDCyAAQbACaiADIAdrOgAAIAJBMGokAAvXAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEJwCIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQYccIAFBEGoQ7AJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQfobIAFBCGoQ7AJBACEDCwJAIAMiA0UNACAAIAMQ6QEgACABKAIkIAMvAQJB/x9xQYDAAHIQ+AELIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQnAIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBhxwgA0EIahDsAkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQA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NwMQAkACQAJAIANBEGoQ1gINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEPMCEO8CCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQ8AMgA0EQaiACEPADIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCvAiADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ8AMgAkEgaiABEPADIAJBGGogARDwAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACELACIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPADIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBCDAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCtAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPADIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBCDAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCtAgsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEPADIAMgAykDIDcDKCACKAJMIQQgAyACKAKkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBCDAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgwELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCtAgsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCDAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwELIAJBABCRAiEEIAMgAykDEDcDACAAIAIgBCADEKsCIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBCDAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgwELIAJBFRCRAiEEIAMgAykDEDcDACAAIAIgBCADEKsCIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQkQIQkAEiAw0AIAFBEBBTCyABKAKsASEEIAJBCGogAUEIIAMQ8gIgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEPEDIgMQkgEiBA0AIAEgA0EDdEEQahBTCyABKAKsASEDIAJBCGogAUEIIAQQ8gIgAyACKQMINwMgIAJBEGokAAtQAQN/IwBBEGsiAiQAAkAgASABEPEDIgMQkwEiBA0AIAEgA0EMahBTCyABKAKsASEDIAJBCGogAUEIIAQQ8gIgAyACKQMINwMgIAJBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKACkAUE8aigCAEEDdiACKAJMIgRLDQAgA0EIaiACQfkAEIMBIABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALaQECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEEIMDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCDAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAFyIgQQgwMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIMBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAAnIiBBCDAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgwELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIADciIEEIMDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCDAQsgA0EQaiQACzkBAX8CQCACKAJMIgMgAigApAFBJGooAgBBBHZJDQAgACACQfgAEIMBDwsgACADNgIAIABBAzYCBAsMACAAIAIoAkwQ8AILQwECfwJAIAIoAkwiAyACKACkASIEQTRqKAIAQQN2Tw0AIAAgBCAEKAIwaiADQQN0aikAADcDAA8LIAAgAkH3ABCDAQtZAQJ/IwBBEGsiAyQAAkACQCACKACkAUE8aigCAEEDdiACKAJMIgRLDQAgA0EIaiACQfkAEIMBIABCADcDAAwBCyAAIAJBCCACIAQQowIQ8gILIANBEGokAAtfAQN/IwBBEGsiAyQAIAIQ8QMhBCACEPEDIQUgA0EIaiACQQIQ8wMCQAJAIAMpAwhCAFINACAAQgA3AwAMAQsgAyADKQMINwMAIAAgAiAFIAQgA0EAEEkLIANBEGokAAsQACAAIAIoAqwBKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEPADIAMgAykDCDcDACAAIAIgAxD8AhDwAiADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACEPADIABBiOwAQZDsACADKQMIUBspAwA3AwAgA0EQaiQACw0AIABBACkDiGw3AwALDQAgAEEAKQOQbDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDwAyADIAMpAwg3AwAgACACIAMQ9QIQ8QIgA0EQaiQACw0AIABBACkDmGw3AwALqQECAX8BfCMAQRBrIgMkACADQQhqIAIQ8AMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCACIAMQ8wIiBEQAAAAAAAAAAGNFDQAgACAEmhDvAgwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQOAbDcDAAwCCyAAQQAgAmsQ8AIMAQsgACADKQMINwMACyADQRBqJAALDwAgACACEPIDQX9zEPACCzIBAX8jAEEQayIDJAAgA0EIaiACEPADIAAgAygCDEUgAygCCEECRnEQ8QIgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACEPADAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEPMCmhDvAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA4BsNwMADAELIABBACACaxDwAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEPADIAMgAykDCDcDACAAIAIgAxD1AkEBcxDxAiADQRBqJAALDAAgACACEPIDEPACC6kCAgV/AXwjAEHAAGsiAyQAIANBOGogAhDwAyACQRhqIgQgAykDODcDACADQThqIAIQ8AMgAiADKQM4NwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEggBSgCACIHIAZqIgYgB0hzDQAgACAGEPACDAELIAMgBSkDADcDMAJAAkAgAiADQTBqENUCDQAgAyAEKQMANwMoIAIgA0EoahDVAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqEN8CDAELIAMgBSkDADcDICACIAIgA0EgahDzAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQ8wIiCDkDACAAIAggAisDIKAQ7wILIANBwABqJAALzQECBX8BfCMAQSBrIgMkACADQRhqIAIQ8AMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPADIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBKIAUoAgAiByAGayIGIAdIcw0AIAAgBhDwAgwBCyADIAUpAwA3AxAgAiACIANBEGoQ8wI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEPMCIgg5AwAgACACKwMgIAihEO8CCyADQSBqJAALzwEDBH8BfgF8IwBBIGsiAyQAIANBGGogAhDwAyACQRhqIgQgAykDGDcDACADQRhqIAIQ8AMgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFNAIAIAQ0AgB+IgdCIIinIAenIgZBH3VHDQAgACAGEPACDAELIAMgBSkDADcDECACIAIgA0EQahDzAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ8wIiCDkDACAAIAggAisDIKIQ7wILIANB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ayAEIAFBLUYbC/kKAQt/IwBBwABrIgQkACAAIAFqIQUgBEF/aiEGIARBAXIhByAEQQJyIQggAEEARyEJIAIhASADIQogAiECIAAhAwNAIAMhAyACIQIgCiELIAEiCkEBaiEBAkACQCAKLQAAIgxBJUYNACAMRQ0AIAEhASALIQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEJcFIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEMYFakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEEMYFaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCQsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEAIQogAkUNAQsgCCACaiADQTdqIANBMHIgA0EJSxs6AAAgAkEBaiEKCyAKIgohAiABQXxqIQMgAQ0ACyAIIApqQQA6AAAgC0EEaiECDAgLIAQgC0EHakF4cSIBKwMAQQgQ/QQgAUEIaiECDAcLIAsoAgAiAUHD0gAgARsiAxDGBSEBAkAgBSANayIKQQFIDQAgDSADIAEgCkF/aiAKIAFKGyIKEJcFIApqQQA6AAALIAtBBGohCiAEQQA6AAAgDSABaiEBIAJFDQMgAxAiDAMLIAQgAToAAAwBCyAEQT86AAALIAshAgwDCyAKIQIgASEBDAMLIAwhAgwBCyALIQILIA0hAQsgAiECIAQQxgUhAwJAIAUgASILayIBQQFIDQAgCyAEIAMgAUF/aiABIANKGyIBEJcFIAFqQQA6AAALIA5BAWoiDCEBIAIhCiAMIQJBASEMIAsgA2ohAwsgASEBIAohCiACIQIgAyILIQMgDA0ACyAEQcAAaiQAIAsgAGtBAWoL7QgDA34IfwF8AkACQCABRAAAAAAAAAAAYw0AIAEhASAAIQAMAQsgAEEtOgAAIAGaIQEgAEEBaiEACyAAIQACQCABIgG9Qv///////////wCDIgNCgYCAgICAgPj/AFQNACAAQc7CuQI2AAAPCwJAIANCgICAgICAgPj/AFINACAAQencmQM2AAAPCwJAIAFEsMpuR+2JEABjRQ0AIABBMDsAAA8LIAJBBCACQQRKGyICQQ9JIQYgAUSN7bWg98awPmMhBwJAAkAgARCvBSIOmUQAAAAAAADgQWNFDQAgDqohCAwBC0GAgICAeCEICyAIIQggAkEPIAYbIQICQAJAIAcNACABRFDv4tbkGktEZA0AIAghBkEBIQcgASEBDAELAkAgCEF/Sg0AQQAhBiAIIQcgAUQAAAAAAAAkQEEAIAhrEOoFoiEBDAELQQAhBiAIIQcgAUQAAAAAAAAkQCAIEOoFoyEBCyABIQEgByEJIAIgBiIKQQFqIgtBDyAKQQ9IIgYbIAogAkgiCBshDAJAAkAgCA0AIAYNACAKIAxrQQFqIgghAiABRAAAAAAAACRAIAgQ6gWjRAAAAAAAAOA/oCEBDAELQQAhAiABRAAAAAAAACRAIAwgCkF/c2oQ6gWiRAAAAAAAAOA/oCEBCyACIQ0gCkF/SiECAkACQCABIgFEAAAAAAAA8ENjIAFEAAAAAAAAAABmcUUNACABsSEDDAELQgAhAwsgAyEDAkACQCACRQ0AIAAhAAwBCyAAQbDcADsAACAAQQJqIQICQCAKQX9HDQAgAiEADAELIAJBMCAKQX9zEJkFGiAAIAprQQFqIQALIAMhAyAMIQggACEAAkADQCAAIQIgAyEEAkAgCCIIQQFODQAgAiECDAILQTAhACAEIQMCQCAEIAhBf2oiCEEDdEHg9QBqKQMAIgVUDQADQCAAQQFqIQAgAyAFfSIEIQMgBCAFWg0ACwsgAiAAOgAAIAJBAWohAAJAAkAgAyIDQgBSIAwgCGsiByAKTHIiBkEBRg0AIAAhAAwBCyAAIQAgByALRw0AIAJBLjoAASACQQJqIQALIAMhAyAIIQggACICIQAgAiECIAYNAAsLIAIhAAJAAkAgDUEBTg0AIAAhAAwBCyAAQTAgDRCZBSANaiEACyAAIQACQAJAIAlBAUYNACAAQeUAOgAAAkACQCAJQQFODQAgAEEBaiEADAELIABBKzoAASAAQQJqIQALIAAhAAJAAkAgCUF/TA0AIAkhCCAAIQAMAQsgAEEtOgAAQQAgCWshCCAAQQFqIQALIAAiByECIAghCANAIAIiAiAIIgAgAEEKbiIIQQpsa0EwcjoAACACQQFqIgYhAiAIIQggAEEJSw0ACyAGQQA6AAAgByAHEMYFakF/aiIAIAdNDQEgACECIAchAANAIAAiAC0AACEIIAAgAiICLQAAOgAAIAIgCDoAACACQX9qIgghAiAAQQFqIgYhACAGIAhJDQAMAgsACyAAQQA6AAALCyoBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQ/AQhAyAEQRBqJAAgAwuuAQEGfyMAQRBrIgIgATcDCEHFu/KIeCEDIAJBCGohAkEIIQQDQCADQZODgAhsIgUgAiICLQAAcyIGIQMgAkEBaiECIARBf2oiByEEIAcNAAsgAEEAOgAEIAAgBkH/////A3EiA0HoNG5BCnBBMHI6AAMgACADQaQFbkEKcEEwcjoAAiAAIAMgBUEednMiA0EabiICQRpwQcEAajoAASAAIAMgAkEabGtBwQBqOgAAC0kBAn8jAEEQayICJAAgAiABNgIEIAIgATYCDCACIAE2AghBAEEAIAAgARD8BCIBECEiAyABIAAgAigCCBD8BBogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQISEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZByidqLQAAOgAAIAVBAWogBi0AAEEPcUHKJ2otAAA6AAAgBEEBaiIFIQQgBSABRw0ACwsgAyACakEAOgAAIAML6QEBB38jAEEQayIBJAAgAUEANgIMIAFCADcCBCABIAA2AgACQAJAIAANAEEBIQIMAQsgACECQQAhA0EAIQQDQCACIQUgASAEQQFqIgRBAnRqKAIAIgYhAiAFEMYFIANqIgUhAyAEIQQgBg0ACyAFQQFqIQILIAIQISEHQQAhBQJAIABFDQAgACECQQAhA0EAIQQDQCACIQIgByADIgNqIAIgAhDGBSIFEJcFGiABIARBAWoiBEECdGooAgAiBiECIAUgA2oiBSEDIAQhBCAFIQUgBg0ACwsgByAFakEAOgAAIAFBEGokACAHCxkAAkAgAQ0AQQEQIQ8LIAEQISAAIAEQlwULEgACQEEAKAKo6gFFDQAQhQULC54DAQd/AkBBAC8BrOoBIgBFDQAgACEBQQAoAqTqASIAIgIhAyAAIQAgAiECA0AgACEEIAIiAEEIaiEFIAEhAiADIQEDQCABIQEgAiEDAkACQAJAIAAtAAUiAkH/AUcNACAAIAFHDQFBACADIAEtAARBA2pB/ANxQQhqIgJrIgM7AazqASABIAEgAmogA0H//wNxEPIEDAILQQAoAvzWASAAKAIAa0EASA0AIAJB/wBxIAAvAQYgBSAALQAEEI8FDQQCQAJAIAAsAAUiAUF/Sg0AAkAgAEEAKAKk6gEiAUYNAEH/ASEBDAILQQBBAC8BrOoBIAEtAARBA2pB/ANxQQhqIgJrIgM7AazqASABIAEgAmogA0H//wNxEPIEDAMLIAAgACgCAEHQhgNqNgIAIAFBgH9yIQELIAAgAToABQtBAC8BrOoBIgQhAUEAKAKk6gEiBSEDIAAtAARBA2pB/ANxIABqQQhqIgYhACAGIQIgBiAFayAESA0CDAMLQQAvAazqASIDIQJBACgCpOoBIgYhASAEIAZrIANIDQALCwsL7gIBBH8CQAJAECMNACABQYACTw0BQQBBAC0AruoBQQFqIgQ6AK7qASAALQAEIARBCHQgAUH/AXFyQYCAfnIiBUH//wNxIAIgAxCPBRoCQEEAKAKk6gENAEGAARAhIQFBAEHSATYCqOoBQQAgATYCpOoBCwJAIANBCGoiBkGAAUoNAAJAAkBBgAFBAC8BrOoBIgFrIAZIDQAgASEHDAELIAEhBANAQQAgBEEAKAKk6gEiAS0ABEEDakH8A3FBCGoiBGsiBzsBrOoBIAEgASAEaiAHQf//A3EQ8gRBAC8BrOoBIgEhBCABIQdBgAEgAWsgBkgNAAsLQQAoAqTqASAHIgRqIgEgBTsBBiABIAM6AAQgASAALQAEOgAFIAFBCGogAiADEJcFGiABQQAoAvzWAUGgnAFqNgIAQQAgA0H/AXFBA2pB/ANxIARqQQhqOwGs6gELDwtBsDxB3QBB+AwQ9QQAC0GwPEEjQc4vEPUEAAsbAAJAQQAoArDqAQ0AQQBBgAQQ0AQ2ArDqAQsLOwEBfwJAIAANAEEADwtBACEBAkAgABDiBEUNACAAIAAtAANBvwFxOgADQQAoArDqASAAEM0EIQELIAELOwEBfwJAIAANAEEADwtBACEBAkAgABDiBEUNACAAIAAtAANBwAByOgADQQAoArDqASAAEM0EIQELIAELDABBACgCsOoBEM4ECwwAQQAoArDqARDPBAs1AQF/AkBBACgCtOoBIAAQzQQiAUUNAEHhJkEAEDwLAkAgABCJBUUNAEHPJkEAEDwLEEAgAQs1AQF/AkBBACgCtOoBIAAQzQQiAUUNAEHhJkEAEDwLAkAgABCJBUUNAEHPJkEAEDwLEEAgAQsbAAJAQQAoArTqAQ0AQQBBgAQQ0AQ2ArTqAQsLlgEBAn8CQAJAAkAQIw0AQbzqASAAIAEgAxD0BCIEIQUCQCAEDQAQkAVBvOoBEPMEQbzqASAAIAEgAxD0BCIBIQUgAUUNAgsgBSEBAkAgA0UNACACRQ0DIAEgAiADEJcFGgtBAA8LQYo8QdIAQYYvEPUEAAtBwcQAQYo8QdoAQYYvEPoEAAtB9sQAQYo8QeIAQYYvEPoEAAtEAEEAEO0ENwLA6gFBvOoBEPAEAkBBACgCtOoBQbzqARDNBEUNAEHhJkEAEDwLAkBBvOoBEIkFRQ0AQc8mQQAQPAsQQAtGAQJ/AkBBAC0AuOoBDQBBACEAAkBBACgCtOoBEM4EIgFFDQBBAEEBOgC46gEgASEACyAADwtBuSZBijxB9ABB1isQ+gQAC0UAAkBBAC0AuOoBRQ0AQQAoArTqARDPBEEAQQA6ALjqAQJAQQAoArTqARDOBEUNABBACw8LQbomQYo8QZwBQekPEPoEAAsxAAJAECMNAAJAQQAtAL7qAUUNABCQBRDgBEG86gEQ8wQLDwtBijxBqQFB6yQQ9QQACwYAQbjsAQtPAgF+An8CQAJAIAC9IgFCNIinQf8PcSICQf8PRg0AQQQhAyACDQFBAkEDIAFC////////////AINQGw8LIAFC/////////weDUCEDCyADCwQAIAALjgQBA38CQCACQYAESQ0AIAAgASACEBMgAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCADQXxqIgQgAE8NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL9wIBAn8CQCAAIAFGDQACQCABIAAgAmoiA2tBACACQQF0a0sNACAAIAEgAhCXBQ8LIAEgAHNBA3EhBAJAAkACQCAAIAFPDQACQCAERQ0AIAAhAwwDCwJAIABBA3ENACAAIQMMAgsgACEDA0AgAkUNBCADIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiADQQFqIgNBA3FFDQIMAAsACwJAIAQNAAJAIANBA3FFDQADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIAJBfGoiAkEDSw0ACwsgAkUNAANAIAMgAS0AADoAACADQQFqIQMgAUEBaiEBIAJBf2oiAg0ACwsgAAvyAgIDfwF+AkAgAkUNACAAIAE6AAAgAiAAaiIDQX9qIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0F9aiABOgAAIANBfmogAToAACACQQdJDQAgACABOgADIANBfGogAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkF8aiABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBeGogATYCACACQXRqIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQXBqIAE2AgAgAkFsaiABNgIAIAJBaGogATYCACACQWRqIAE2AgAgBCADQQRxQRhyIgVrIgJBIEkNACABrUKBgICAEH4hBiADIAVqIQEDQCABIAY3AxggASAGNwMQIAEgBjcDCCABIAY3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsgAAsEAEEBCwIAC70CAQN/AkAgAA0AQQAhAQJAQQAoArzsAUUNAEEAKAK87AEQnAUhAQsCQEEAKAKwzgFFDQBBACgCsM4BEJwFIAFyIQELAkAQsgUoAgAiAEUNAANAQQAhAgJAIAAoAkxBAEgNACAAEJoFIQILAkAgACgCFCAAKAIcRg0AIAAQnAUgAXIhAQsCQCACRQ0AIAAQmwULIAAoAjgiAA0ACwsQswUgAQ8LQQAhAgJAIAAoAkxBAEgNACAAEJoFIQILAkACQAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQUAGiAAKAIUDQBBfyEBIAINAQwCCwJAIAAoAgQiASAAKAIIIgNGDQAgACABIANrrEEBIAAoAigRDwAaC0EAIQEgAEEANgIcIABCADcDECAAQgA3AgQgAkUNAQsgABCbBQsgAQuyBAIEfgJ/AkACQCABvSICQgGGIgNQDQAgARCeBSEEIAC9IgVCNIinQf8PcSIGQf8PRg0AIARC////////////AINCgYCAgICAgPj/AFQNAQsgACABoiIBIAGjDwsCQCAFQgGGIgQgA1YNACAARAAAAAAAAAAAoiAAIAQgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAFQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIAVBASAGa62GIQMMAQsgBUL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIEQgBTDQADQCAHQX9qIQcgBEIBhiIEQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LIANCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCwJAAkAgA0L/////////B1gNACADIQQMAQsDQCAGQX9qIQYgA0KAgICAgICABFQhByADQgGGIgQhAyAHDQALCyAFQoCAgICAgICAgH+DIQMCQAJAIAZBAUgNACAEQoCAgICAgIB4fCAGrUI0hoQhBAwBCyAEQQEgBmutiCEECyAEIAOEvwsFACAAvQsOACAAKAI8IAEgAhCwBQvlAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQYgA0EQaiEEQQIhBwJAAkACQAJAAkAgACgCPCADQRBqQQIgA0EMahAUENcFRQ0AIAQhBQwBCwNAIAYgAygCDCIBRg0CAkAgAUF/Sg0AIAQhBQwECyAEIAEgBCgCBCIISyIJQQN0aiIFIAUo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IANB//8Aaq1CMIYQ6AUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEN4FRQ0AIAMgBBDOBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDoBSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEOAFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDeBUEASg0AAkAgASAJIAMgChDeBUUNACABIQQMAgsgBUHwAGogASACQgBCABDoBSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ6AUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOgFIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDoBSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ6AUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICA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fyABGzYC8OwBCwsHAD8AQRB0C1QBAn9BACgCtM4BIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAENoFTQ0AIAAQFUUNAQtBACAANgK0zgEgAQ8LEJQFQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDdBUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ3QVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEN0FIAVBMGogCiABIAcQ5wUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDdBSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDdBSAFIAIgBEEBIAZrEOcFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDlBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDmBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEN0FQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ3QUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ6QUgBUGQAmpC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gICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDdBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEN0FIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEN0FIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEN0FQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEN0FIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEN0FIAVBIGogAiAEIAYQ3QUgBUEQaiASIAEgBxDnBSAFIAIgBCAHEOcFIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDcBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ3QUgAiAAIARBgfgAIANrEOcFIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBwPAFJANBwPABQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEPAAslAQF+IAAgASACrSADrUIghoQgBBD3BSEFIAVCIIinEO0FIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC+bOgYAAAwBBgAgL+MEBaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBkZXZzX2pzb25fc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBoZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMARGV2Uy1TSEEyNTY6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAFVua25vd24gZW5jb2Rpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAHNtYWxsIGhlbGxvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBpc0FjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAHByb2dWZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAcHJvZ05hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBSb2xlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAdXRmLTgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyADEyNy4wLjAuMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQg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bnNvbGUubG9nKCJQQU5JQyIsIGV4aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AADQ8oCAAARuYW1lAeBx+gUADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNfZGV2c19wYW5pY19oYW5kbGVyBBFlbV9kZXBsb3lfaGFuZGxlcgUXZW1famRfY3J5cHRvX2dldF9yYW5kb20GDWVtX3NlbmRfZnJhbWUHBGV4aXQIC2VtX3RpbWVfbm93CQ5lbV9wcmludF9kbWVzZwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMBFqZF9lbV9kZXZzX2RlcGxveTERamRfZW1fZGV2c192ZXJpZnkyGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzNAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3D2FwcF9wcmludF9kbWVzZzgSamRfdGNwc29ja19wcm9jZXNzORFhcHBfaW5pdF9zZXJ2aWNlczoSZGV2c19jbGllbnRfZGVwbG95OxRjbGllbnRfZXZlbnRfaGFuZGxlcjwJYXBwX2RtZXNnPQtmbHVzaF9kbWVzZz4LYXBwX3Byb2Nlc3M/B3R4X2luaXRAD2pkX3BhY2tldF9yZWFkeUEKdHhfcHJvY2Vzc0IXamRfd2Vic29ja19zZW5kX21lc3NhZ2VDDmpkX3dlYnNvY2tfbmV3RAZvbm9wZW5FB29uZXJyb3JGB29uY2xvc2VHCW9ubWVzc2FnZUgQamRfd2Vic29ja19jbG9zZUkOZGV2c19idWZmZXJfb3BKEmRldnNfYnVmZmVyX2RlY29kZUsSZGV2c19idWZmZXJfZW5jb2RlTA9kZXZzX2NyZWF0ZV9jdHhNCXNldHVwX2N0eE4KZGV2c190cmFjZU8PZGV2c19lcnJvcl9jb2RlUBlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUQljbGVhcl9jdHhSDWRldnNfZnJlZV9jdHhTCGRldnNfb29tVAlkZXZzX2ZyZWVVEWRldnNjbG91ZF9wcm9jZXNzVhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFcUZGV2c2Nsb3VkX29uX21lc3NhZ2VYDmRldnNjbG91ZF9pbml0WRRkZXZzX3RyYWNrX2V4Y2VwdGlvbloPZGV2c2RiZ19wcm9jZXNzWxFkZXZzZGJnX3Jlc3RhcnRlZFwVZGV2c2RiZ19oYW5kbGVfcGFja2V0XQtzZW5kX3ZhbHVlc14RdmFsdWVfZnJvbV90YWdfdjBfGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVgDW9ial9nZXRfcHJvcHNhDGV4cGFuZF92YWx1ZWISZGV2c2RiZ19zdXNwZW5kX2NiYwxkZXZzZGJnX2luaXRkEGV4cGFuZF9rZXlfdmFsdWVlBmt2X2FkZGYPZGV2c21ncl9wcm9jZXNzZwd0cnlfcnVuaAxzdG9wX3Byb2dyYW1pD2RldnNtZ3JfcmVzdGFydGoUZGV2c21ncl9kZXBsb3lfc3RhcnRrFGRldnNtZ3JfZGVwbG95X3dyaXRlbBBkZXZzbWdyX2dldF9oYXNobRVkZXZzbWdyX2hhbmRsZV9wYWNrZXRuDmRlcGxveV9oYW5kbGVybxNkZXBsb3lfbWV0YV9oYW5kbGVycA9kZXZzbWdyX2dldF9jdHhxDmRldnNtZ3JfZGVwbG95cgxkZXZzbWdyX2luaXRzEWRldnNtZ3JfY2xpZW50X2V2dBZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dRBkZXZzX2ZpYmVyX3lpZWxkdhhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb253GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXgQZGV2c19maWJlcl9zbGVlcHkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsehpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3sRZGV2c19pbWdfZnVuX25hbWV8EmRldnNfaW1nX3JvbGVfbmFtZX0RZGV2c19maWJlcl9ieV90YWd+EGRldnNfZmliZXJfc3RhcnR/FGRldnNfZmliZXJfdGVybWlhbnRlgAEOZGV2c19maWJlcl9ydW6BARNkZXZzX2ZpYmVyX3N5bmNfbm93ggEKZGV2c19wYW5pY4MBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYQBD2RldnNfZmliZXJfcG9rZYUBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEUZGV2c192YWx1ZV9pc19waW5uZWSOAQ5kZXZzX3ZhbHVlX3Bpbo8BEGRldnNfdmFsdWVfdW5waW6QARJkZXZzX21hcF90cnlfYWxsb2ORARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OSARRkZXZzX2FycmF5X3RyeV9hbGxvY5MBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5QBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5UBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lgEPZGV2c19nY19zZXRfY3R4lwEOZGV2c19nY19jcmVhdGWYAQ9kZXZzX2djX2Rlc3Ryb3mZARFkZXZzX2djX29ial9jaGVja5oBC3NjYW5fZ2Nfb2JqmwERcHJvcF9BcnJheV9sZW5ndGicARJtZXRoMl9BcnJheV9pbnNlcnSdARJmdW4xX0FycmF5X2lzQXJyYXmeARBtZXRoWF9BcnJheV9wdXNonwEVbWV0aDFfQXJyYXlfcHVzaFJhbmdloAERbWV0aFhfQXJyYXlfc2xpY2WhARFmdW4xX0J1ZmZlcl9hbGxvY6IBEGZ1bjFfQnVmZmVyX2Zyb22jARJwcm9wX0J1ZmZlcl9sZW5ndGikARVtZXRoMV9CdWZmZXJfdG9TdHJpbmelARNtZXRoM19CdWZmZXJfZmlsbEF0pgETbWV0aDRfQnVmZmVyX2JsaXRBdKcBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwqAEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljqQEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qgEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0qwEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnSsARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rQEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSuARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcq8BHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nsAEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlzsQEUbWV0aDFfRXJyb3JfX19jdG9yX1+yARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fswEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9ftAEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1+1AQ9wcm9wX0Vycm9yX25hbWW2ARFtZXRoMF9FcnJvcl9wcmludLcBD3Byb3BfRHNGaWJlcl9pZLgBFG1ldGgxX0RzRmliZXJfcmVzdW1luQEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGW6ARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kuwERZnVuMF9Ec0ZpYmVyX3NlbGa8ARRtZXRoWF9GdW5jdGlvbl9zdGFydL0BF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlvgEScHJvcF9GdW5jdGlvbl9uYW1lvwEPZnVuMl9KU09OX3BhcnNlwAETZnVuM19KU09OX3N0cmluZ2lmecEBDmZ1bjFfTWF0aF9jZWlswgEPZnVuMV9NYXRoX2Zsb29ywwEPZnVuMV9NYXRoX3JvdW5kxAENZnVuMV9NYXRoX2Fic8UBEGZ1bjBfTWF0aF9yYW5kb23GARNmdW4xX01hdGhfcmFuZG9tSW50xwENZnVuMV9NYXRoX2xvZ8gBDWZ1bjJfTWF0aF9wb3fJAQ5mdW4yX01hdGhfaWRpdsoBDmZ1bjJfTWF0aF9pbW9kywEOZnVuMl9NYXRoX2ltdWzMAQ1mdW4yX01hdGhfbWluzQELZnVuMl9taW5tYXjOAQ1mdW4yX01hdGhfbWF4zwESZnVuMl9PYmplY3RfYXNzaWdu0AEQZnVuMV9PYmplY3Rfa2V5c9EBE2Z1bjFfa2V5c19vcl92YWx1ZXPSARJmdW4xX09iamVjdF92YWx1ZXPTARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtQBEHByb3BfUGFja2V0X3JvbGXVARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVy1gETcHJvcF9QYWNrZXRfc2hvcnRJZNcBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleNgBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5k2QERcHJvcF9QYWNrZXRfZmxhZ3PaARVwcm9wX1BhY2tldF9pc0NvbW1hbmTbARRwcm9wX1BhY2tldF9pc1JlcG9ydNwBE3Byb3BfUGFja2V0X3BheWxvYWTdARNwcm9wX1BhY2tldF9pc0V2ZW503gEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl3wEUcHJvcF9QYWNrZXRfaXNSZWdTZXTgARRwcm9wX1BhY2tldF9pc1JlZ0dldOEBE3Byb3BfUGFja2V0X3JlZ0NvZGXiARRwcm9wX1BhY2tldF9pc0FjdGlvbuMBFWRldnNfcGt0X3NwZWNfYnlfY29kZeQBEmRldnNfZ2V0X3NwZWNfY29kZeUBE21ldGgwX1BhY2tldF9kZWNvZGXmARJkZXZzX3BhY2tldF9kZWNvZGXnARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWToARREc1JlZ2lzdGVyX3JlYWRfY29udOkBEmRldnNfcGFja2V0X2VuY29kZeoBFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXrARZwcm9wX0RzUGFja2V0SW5mb19yb2xl7AEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZe0BFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXuARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/vARNwcm9wX0RzUm9sZV9pc0JvdW5k8AEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k8QERbWV0aDBfRHNSb2xlX3dhaXTyARJwcm9wX1N0cmluZ19sZW5ndGjzARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdPQBE21ldGgxX1N0cmluZ19jaGFyQXT1ARJtZXRoMl9TdHJpbmdfc2xpY2X2ARRkZXZzX2pkX2dldF9yZWdpc3RlcvcBFmRldnNfamRfY2xlYXJfcGt0X2tpbmT4ARBkZXZzX2pkX3NlbmRfY21k+QERZGV2c19qZF93YWtlX3JvbGX6ARRkZXZzX2pkX3Jlc2V0X3BhY2tldPsBE2RldnNfamRfcGt0X2NhcHR1cmX8ARNkZXZzX2pkX3NlbmRfbG9nbXNn/QESZGV2c19qZF9zaG91bGRfcnVu/gEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX/ARNkZXZzX2pkX3Byb2Nlc3NfcGt0gAIUZGV2c19qZF9yb2xlX2NoYW5nZWSBAhJkZXZzX2pkX2luaXRfcm9sZXOCAhJkZXZzX2pkX2ZyZWVfcm9sZXODAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3OEAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc4UCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc4YCEGRldnNfanNvbl9lc2NhcGWHAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWIAg9kZXZzX2pzb25fcGFyc2WJAgpqc29uX3ZhbHVligIMcGFyc2Vfc3RyaW5niwINc3RyaW5naWZ5X29iaowCCmFkZF9pbmRlbnSNAg9zdHJpbmdpZnlfZmllbGSOAhNkZXZzX2pzb25fc3RyaW5naWZ5jwIRcGFyc2Vfc3RyaW5nX2NvcmWQAhFkZXZzX21hcGxpa2VfaXRlcpECF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0kgISZGV2c19tYXBfY29weV9pbnRvkwIMZGV2c19tYXBfc2V0lAIGbG9va3VwlQITZGV2c19tYXBsaWtlX2lzX21hcJYCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc5cCEWRldnNfYXJyYXlfaW5zZXJ0mAIIa3ZfYWRkLjGZAhJkZXZzX3Nob3J0X21hcF9zZXSaAg9kZXZzX21hcF9kZWxldGWbAhJkZXZzX3Nob3J0X21hcF9nZXScAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldJ0CDmRldnNfcm9sZV9zcGVjngISZGV2c19mdW5jdGlvbl9iaW5knwIRZGV2c19tYWtlX2Nsb3N1cmWgAg5kZXZzX2dldF9mbmlkeKECE2RldnNfZ2V0X2ZuaWR4X2NvcmWiAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSjAhNkZXZzX2dldF9yb2xlX3Byb3RvpAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3pQIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkpgIVZGV2c19nZXRfc3RhdGljX3Byb3RvpwIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvqAIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2pAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvqgIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxkqwIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5krAIQZGV2c19pbnN0YW5jZV9vZq0CD2RldnNfb2JqZWN0X2dldK4CDGRldnNfc2VxX2dldK8CDGRldnNfYW55X2dldLACDGRldnNfYW55X3NldLECDGRldnNfc2VxX3NldLICDmRldnNfYXJyYXlfc2V0swITZGV2c19hcnJheV9waW5fcHVzaLQCDGRldnNfYXJnX2ludLUCD2RldnNfYXJnX2RvdWJsZbYCD2RldnNfcmV0X2RvdWJsZbcCDGRldnNfcmV0X2ludLgCDWRldnNfcmV0X2Jvb2y5Ag9kZXZzX3JldF9nY19wdHK6AhFkZXZzX2FyZ19zZWxmX21hcLsCEWRldnNfc2V0dXBfcmVzdW1lvAIPZGV2c19jYW5fYXR0YWNovQIZZGV2c19idWlsdGluX29iamVjdF92YWx1Zb4CFWRldnNfbWFwbGlrZV90b192YWx1Zb8CEmRldnNfcmVnY2FjaGVfZnJlZcACFmRldnNfcmVnY2FjaGVfZnJlZV9hbGzBAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZMICE2RldnNfcmVnY2FjaGVfYWxsb2PDAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cMQCEWRldnNfcmVnY2FjaGVfYWdlxQIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGXGAhJkZXZzX3JlZ2NhY2hlX25leHTHAg9qZF9zZXR0aW5nc19nZXTIAg9qZF9zZXR0aW5nc19zZXTJAg5kZXZzX2xvZ192YWx1ZcoCD2RldnNfc2hvd192YWx1ZcsCEGRldnNfc2hvd192YWx1ZTDMAg1jb25zdW1lX2NodW5rzQINc2hhXzI1Nl9jbG9zZc4CD2pkX3NoYTI1Nl9zZXR1cM8CEGpkX3NoYTI1Nl91cGRhdGXQAhBqZF9zaGEyNTZfZmluaXNo0QIUamRfc2hhMjU2X2htYWNfc2V0dXDSAhVqZF9zaGEyNTZfaG1hY19maW5pc2jTAg5qZF9zaGEyNTZfaGtkZtQCDmRldnNfc3RyZm9ybWF01QIOZGV2c19pc19zdHJpbmfWAg5kZXZzX2lzX251bWJlctcCFGRldnNfc3RyaW5nX2dldF91dGY42AITZGV2c19idWlsdGluX3N0cmluZ9kCFGRldnNfc3RyaW5nX3ZzcHJpbnRm2gITZGV2c19zdHJpbmdfc3ByaW50ZtsCFWRldnNfc3RyaW5nX2Zyb21fdXRmONwCFGRldnNfdmFsdWVfdG9fc3RyaW5n3QIQYnVmZmVyX3RvX3N0cmluZ94CGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTfAhJkZXZzX3N0cmluZ19jb25jYXTgAhFkZXZzX3N0cmluZ19zbGljZeECEmRldnNfcHVzaF90cnlmcmFtZeICEWRldnNfcG9wX3RyeWZyYW1l4wIPZGV2c19kdW1wX3N0YWNr5AITZGV2c19kdW1wX2V4Y2VwdGlvbuUCCmRldnNfdGhyb3fmAhJkZXZzX3Byb2Nlc3NfdGhyb3fnAhBkZXZzX2FsbG9jX2Vycm9y6AIVZGV2c190aHJvd190eXBlX2Vycm9y6QIWZGV2c190aHJvd19yYW5nZV9lcnJvcuoCHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcusCGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y7AIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh07QIYZGV2c190aHJvd190b29fYmlnX2Vycm9y7gIXZGV2c190aHJvd19zeW50YXhfZXJyb3LvAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl8AITZGV2c192YWx1ZV9mcm9tX2ludPECFGRldnNfdmFsdWVfZnJvbV9ib29s8gIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLzAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZfQCEWRldnNfdmFsdWVfdG9faW509QISZGV2c192YWx1ZV90b19ib29s9gIOZGV2c19pc19idWZmZXL3AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfgCEGRldnNfYnVmZmVyX2RhdGH5AhNkZXZzX2J1ZmZlcmlzaF9kYXRh+gIUZGV2c192YWx1ZV90b19nY19vYmr7Ag1kZXZzX2lzX2FycmF5/AIRZGV2c192YWx1ZV90eXBlb2b9Ag9kZXZzX2lzX251bGxpc2j+AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk/wIUZGV2c192YWx1ZV9hcHByb3hfZXGAAxJkZXZzX3ZhbHVlX2llZWVfZXGBAw1kZXZzX3ZhbHVlX2VxggMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjgwMSZGV2c19pbWdfc3RyaWR4X29rhAMSZGV2c19kdW1wX3ZlcnNpb25zhQMLZGV2c192ZXJpZnmGAxFkZXZzX2ZldGNoX29wY29kZYcDDmRldnNfdm1fcmVzdW1liAMRZGV2c192bV9zZXRfZGVidWeJAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzigMYZGV2c192bV9jbGVhcl9icmVha3BvaW50iwMPZGV2c192bV9zdXNwZW5kjAMWZGV2c192bV9zZXRfYnJlYWtwb2ludI0DFGRldnNfdm1fZXhlY19vcGNvZGVzjgMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiPAxFkZXZzX2ltZ19nZXRfdXRmOJADFGRldnNfZ2V0X3N0YXRpY191dGY4kQMPZGV2c192bV9yb2xlX29rkgMUZGV2c192YWx1ZV9idWZmZXJpc2iTAwxleHByX2ludmFsaWSUAxRleHByeF9idWlsdGluX29iamVjdJUDC3N0bXQxX2NhbGwwlgMLc3RtdDJfY2FsbDGXAwtzdG10M19jYWxsMpgDC3N0bXQ0X2NhbGwzmQMLc3RtdDVfY2FsbDSaAwtzdG10Nl9jYWxsNZsDC3N0bXQ3X2NhbGw2nAMLc3RtdDhfY2FsbDedAwtzdG10OV9jYWxsOJ4DEnN0bXQyX2luZGV4X2RlbGV0ZZ8DDHN0bXQxX3JldHVybqADCXN0bXR4X2ptcKEDDHN0bXR4MV9qbXBfeqIDCmV4cHIyX2JpbmSjAxJleHByeF9vYmplY3RfZmllbGSkAxJzdG10eDFfc3RvcmVfbG9jYWylAxNzdG10eDFfc3RvcmVfZ2xvYmFspgMSc3RtdDRfc3RvcmVfYnVmZmVypwMJZXhwcjBfaW5mqAMQZXhwcnhfbG9hZF9sb2NhbKkDEWV4cHJ4X2xvYWRfZ2xvYmFsqgMLZXhwcjFfdXBsdXOrAwtleHByMl9pbmRleKwDD3N0bXQzX2luZGV4X3NldK0DFGV4cHJ4MV9idWlsdGluX2ZpZWxkrgMSZXhwcngxX2FzY2lpX2ZpZWxkrwMRZXhwcngxX3V0ZjhfZmllbGSwAxBleHByeF9tYXRoX2ZpZWxksQMOZXhwcnhfZHNfZmllbGSyAw9zdG10MF9hbGxvY19tYXCzAxFzdG10MV9hbGxvY19hcnJhebQDEnN0bXQxX2FsbG9jX2J1ZmZlcrUDEWV4cHJ4X3N0YXRpY19yb2xltgMTZXhwcnhfc3RhdGljX2J1ZmZlcrcDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ7gDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbme5AxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbme6AxVleHByeF9zdGF0aWNfZnVuY3Rpb267Aw1leHByeF9saXRlcmFsvAMRZXhwcnhfbGl0ZXJhbF9mNjS9AxBleHByeF9yb2xlX3Byb3RvvgMRZXhwcjNfbG9hZF9idWZmZXK/Aw1leHByMF9yZXRfdmFswAMMZXhwcjFfdHlwZW9mwQMPZXhwcjBfdW5kZWZpbmVkwgMSZXhwcjFfaXNfdW5kZWZpbmVkwwMKZXhwcjBfdHJ1ZcQDC2V4cHIwX2ZhbHNlxQMNZXhwcjFfdG9fYm9vbMYDCWV4cHIwX25hbscDCWV4cHIxX2Fic8gDDWV4cHIxX2JpdF9ub3TJAwxleHByMV9pc19uYW7KAwlleHByMV9uZWfLAwlleHByMV9ub3TMAwxleHByMV90b19pbnTNAwlleHByMl9hZGTOAwlleHByMl9zdWLPAwlleHByMl9tdWzQAwlleHByMl9kaXbRAw1leHByMl9iaXRfYW5k0gMMZXhwcjJfYml0X29y0wMNZXhwcjJfYml0X3hvctQDEGV4cHIyX3NoaWZ0X2xlZnTVAxFleHByMl9zaGlmdF9yaWdodNYDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk1wMIZXhwcjJfZXHYAwhleHByMl9sZdkDCGV4cHIyX2x02gMIZXhwcjJfbmXbAxBleHByMV9pc19udWxsaXNo3AMUc3RtdHgyX3N0b3JlX2Nsb3N1cmXdAxNleHByeDFfbG9hZF9jbG9zdXJl3gMSZXhwcnhfbWFrZV9jbG9zdXJl3wMQZXhwcjFfdHlwZW9mX3N0cuADE3N0bXR4X2ptcF9yZXRfdmFsX3rhAxBzdG10Ml9jYWxsX2FycmF54gMJc3RtdHhfdHJ54wMNc3RtdHhfZW5kX3RyeeQDC3N0bXQwX2NhdGNo5QMNc3RtdDBfZmluYWxseeYDC3N0bXQxX3Rocm935wMOc3RtdDFfcmVfdGhyb3foAxBzdG10eDFfdGhyb3dfam1w6QMOc3RtdDBfZGVidWdnZXLqAwlleHByMV9uZXfrAxFleHByMl9pbnN0YW5jZV9vZuwDCmV4cHIwX251bGztAw9leHByMl9hcHByb3hfZXHuAw9leHByMl9hcHByb3hfbmXvAxNzdG10MV9zdG9yZV9yZXRfdmFs8AMPZGV2c192bV9wb3BfYXJn8QMTZGV2c192bV9wb3BfYXJnX3UzMvIDE2RldnNfdm1fcG9wX2FyZ19pMzLzAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy9AMSamRfYWVzX2NjbV9lbmNyeXB09QMSamRfYWVzX2NjbV9kZWNyeXB09gMMQUVTX2luaXRfY3R49wMPQUVTX0VDQl9lbmNyeXB0+AMQamRfYWVzX3NldHVwX2tlefkDDmpkX2Flc19lbmNyeXB0+gMQamRfYWVzX2NsZWFyX2tlefsDC2pkX3dzc2tfbmV3/AMUamRfd3Nza19zZW5kX21lc3NhZ2X9AxNqZF93ZWJzb2NrX29uX2V2ZW50/gMHZGVjcnlwdP8DDWpkX3dzc2tfY2xvc2WABBBqZF93c3NrX29uX2V2ZW50gQQLcmVzcF9zdGF0dXOCBBJ3c3NraGVhbHRoX3Byb2Nlc3ODBBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZYQEFHdzc2toZWFsdGhfcmVjb25uZWN0hQQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0hgQPc2V0X2Nvbm5fc3RyaW5nhwQRY2xlYXJfY29ubl9zdHJpbmeIBA93c3NraGVhbHRoX2luaXSJBBF3c3NrX3NlbmRfbWVzc2FnZYoEEXdzc2tfaXNfY29ubmVjdGVkiwQUd3Nza190cmFja19leGNlcHRpb26MBBJ3c3NrX3NlcnZpY2VfcXVlcnmNBBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpljgQWcm9sZW1ncl9zZXJpYWxpemVfcm9sZY8ED3JvbGVtZ3JfcHJvY2Vzc5AEEHJvbGVtZ3JfYXV0b2JpbmSRBBVyb2xlbWdyX2hhbmRsZV9wYWNrZXSSBBRqZF9yb2xlX21hbmFnZXJfaW5pdJMEGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZJQEDWpkX3JvbGVfYWxsb2OVBBBqZF9yb2xlX2ZyZWVfYWxslgQWamRfcm9sZV9mb3JjZV9hdXRvYmluZJcEE2pkX2NsaWVudF9sb2dfZXZlbnSYBBNqZF9jbGllbnRfc3Vic2NyaWJlmQQUamRfY2xpZW50X2VtaXRfZXZlbnSaBBRyb2xlbWdyX3JvbGVfY2hhbmdlZJsEEGpkX2RldmljZV9sb29rdXCcBBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WdBBNqZF9zZXJ2aWNlX3NlbmRfY21kngQRamRfY2xpZW50X3Byb2Nlc3OfBA5qZF9kZXZpY2VfZnJlZaAEF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0oQQPamRfZGV2aWNlX2FsbG9jogQQc2V0dGluZ3NfcHJvY2Vzc6MEFnNldHRpbmdzX2hhbmRsZV9wYWNrZXSkBA1zZXR0aW5nc19pbml0pQQPamRfY3RybF9wcm9jZXNzpgQVamRfY3RybF9oYW5kbGVfcGFja2V0pwQMamRfY3RybF9pbml0qAQUZGNmZ19zZXRfdXNlcl9jb25maWepBAlkY2ZnX2luaXSqBA1kY2ZnX3ZhbGlkYXRlqwQOZGNmZ19nZXRfZW50cnmsBAxkY2ZnX2dldF9pMzKtBAxkY2ZnX2dldF91MzKuBA9kY2ZnX2dldF9zdHJpbmevBAxkY2ZnX2lkeF9rZXmwBAlqZF92ZG1lc2exBBFqZF9kbWVzZ19zdGFydHB0crIEDWpkX2RtZXNnX3JlYWSzBBJqZF9kbWVzZ19yZWFkX2xpbmW0BBNqZF9zZXR0aW5nc19nZXRfYmlutQQNamRfZnN0b3JfaW5pdLYEE2pkX3NldHRpbmdzX3NldF9iaW63BAtqZF9mc3Rvcl9nY7gED3JlY29tcHV0ZV9jYWNoZbkEFWpkX3NldHRpbmdzX2dldF9sYXJnZboEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2W7BBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZbwEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2W9BA1qZF9pcGlwZV9vcGVuvgQWamRfaXBpcGVfaGFuZGxlX3BhY2tldL8EDmpkX2lwaXBlX2Nsb3NlwAQSamRfbnVtZm10X2lzX3ZhbGlkwQQVamRfbnVtZm10X3dyaXRlX2Zsb2F0wgQTamRfbnVtZm10X3dyaXRlX2kzMsMEEmpkX251bWZtdF9yZWFkX2kzMsQEFGpkX251bWZtdF9yZWFkX2Zsb2F0xQQRamRfb3BpcGVfb3Blbl9jbWTGBBRqZF9vcGlwZV9vcGVuX3JlcG9ydMcEFmpkX29waXBlX2hhbmRsZV9wYWNrZXTIBBFqZF9vcGlwZV93cml0ZV9leMkEEGpkX29waXBlX3Byb2Nlc3PKBBRqZF9vcGlwZV9jaGVja19zcGFjZcsEDmpkX29waXBlX3dyaXRlzAQOamRfb3BpcGVfY2xvc2XNBA1qZF9xdWV1ZV9wdXNozgQOamRfcXVldWVfZnJvbnTPBA5qZF9xdWV1ZV9zaGlmdNAEDmpkX3F1ZXVlX2FsbG9j0QQNamRfcmVzcG9uZF91ONIEDmpkX3Jlc3BvbmRfdTE20wQOamRfcmVzcG9uZF91MzLUBBFqZF9yZXNwb25kX3N0cmluZ9UEF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk1gQLamRfc2VuZF9wa3TXBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbNgEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy2QQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldNoEFGpkX2FwcF9oYW5kbGVfcGFja2V02wQVamRfYXBwX2hhbmRsZV9jb21tYW5k3AQVYXBwX2dldF9pbnN0YW5jZV9uYW1l3QQTamRfYWxsb2NhdGVfc2VydmljZd4EEGpkX3NlcnZpY2VzX2luaXTfBA5qZF9yZWZyZXNoX25vd+AEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWThBBRqZF9zZXJ2aWNlc19hbm5vdW5jZeIEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l4wQQamRfc2VydmljZXNfdGlja+QEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+UEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl5gQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZecEFGFwcF9nZXRfZGV2aWNlX2NsYXNz6AQSYXBwX2dldF9md192ZXJzaW9u6QQNamRfc3J2Y2ZnX3J1buoEF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l6wQRamRfc3J2Y2ZnX3ZhcmlhbnTsBA1qZF9oYXNoX2ZudjFh7QQMamRfZGV2aWNlX2lk7gQJamRfcmFuZG9t7wQIamRfY3JjMTbwBA5qZF9jb21wdXRlX2NyY/EEDmpkX3NoaWZ0X2ZyYW1l8gQMamRfd29yZF9tb3Zl8wQOamRfcmVzZXRfZnJhbWX0BBBqZF9wdXNoX2luX2ZyYW1l9QQNamRfcGFuaWNfY29yZfYEE2pkX3Nob3VsZF9zYW1wbGVfbXP3BBBqZF9zaG91bGRfc2FtcGxl+AQJamRfdG9faGV4+QQLamRfZnJvbV9oZXj6BA5qZF9hc3NlcnRfZmFpbPsEB2pkX2F0b2n8BAtqZF92c3ByaW50Zv0ED2pkX3ByaW50X2RvdWJsZf4ECmpkX3NwcmludGb/BBJqZF9kZXZpY2Vfc2hvcnRfaWSABQxqZF9zcHJpbnRmX2GBBQtqZF90b19oZXhfYYIFCWpkX3N0cmR1cIMFCWpkX21lbWR1cIQFFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWFBRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlhgURamRfc2VuZF9ldmVudF9leHSHBQpqZF9yeF9pbml0iAUUamRfcnhfZnJhbWVfcmVjZWl2ZWSJBR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4oFD2pkX3J4X2dldF9mcmFtZYsFE2pkX3J4X3JlbGVhc2VfZnJhbWWMBRFqZF9zZW5kX2ZyYW1lX3Jhd40FDWpkX3NlbmRfZnJhbWWOBQpqZF90eF9pbml0jwUHamRfc2VuZJAFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmORBQ9qZF90eF9nZXRfZnJhbWWSBRBqZF90eF9mcmFtZV9zZW50kwULamRfdHhfZmx1c2iUBRBfX2Vycm5vX2xvY2F0aW9ulQUMX19mcGNsYXNzaWZ5lgUFZHVtbXmXBQhfX21lbWNweZgFB21lbW1vdmWZBQZtZW1zZXSaBQpfX2xvY2tmaWxlmwUMX191bmxvY2tmaWxlnAUGZmZsdXNonQUEZm1vZJ4FDV9fRE9VQkxFX0JJVFOfBQxfX3N0ZGlvX3NlZWugBQ1fX3N0ZGlvX3dyaXRloQUNX19zdGRpb19jbG9zZaIFCF9fdG9yZWFkowUJX190b3dyaXRlpAUJX19md3JpdGV4pQUGZndyaXRlpgUUX19wdGhyZWFkX211dGV4X2xvY2unBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrqAUGX19sb2NrqQUIX191bmxvY2uqBQ5fX21hdGhfZGl2emVyb6sFCmZwX2JhcnJpZXKsBQ5fX21hdGhfaW52YWxpZK0FA2xvZ64FBXRvcDE2rwUFbG9nMTCwBQdfX2xzZWVrsQUGbWVtY21wsgUKX19vZmxfbG9ja7MFDF9fb2ZsX3VubG9ja7QFDF9fbWF0aF94Zmxvd7UFDGZwX2JhcnJpZXIuMbYFDF9fbWF0aF9vZmxvd7cFDF9fbWF0aF91Zmxvd7gFBGZhYnO5BQNwb3e6BQV0b3AxMrsFCnplcm9pbmZuYW68BQhjaGVja2ludL0FDGZwX2JhcnJpZXIuMr4FCmxvZ19pbmxpbmW/BQpleHBfaW5saW5lwAULc3BlY2lhbGNhc2XBBQ1mcF9mb3JjZV9ldmFswgUFcm91bmTDBQZzdHJjaHLEBQtfX3N0cmNocm51bMUFBnN0cmNtcMYFBnN0cmxlbscFB19fdWZsb3fIBQdfX3NobGltyQUIX19zaGdldGPKBQdpc3NwYWNlywUGc2NhbGJuzAUJY29weXNpZ25szQUHc2NhbGJubM4FDV9fZnBjbGFzc2lmeWzPBQVmbW9kbNAFBWZhYnNs0QULX19mbG9hdHNjYW7SBQhoZXhmbG9hdNMFCGRlY2Zsb2F01AUHc2NhbmV4cNUFBnN0cnRveNYFBnN0cnRvZNcFEl9fd2FzaV9zeXNjYWxsX3JldNgFCGRsbWFsbG9j2QUGZGxmcmVl2gUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl2wUEc2Jya9wFCF9fYWRkdGYz3QUJX19hc2hsdGkz3gUHX19sZXRmMt8FB19fZ2V0ZjLgBQhfX2RpdnRmM+EFDV9fZXh0ZW5kZGZ0ZjLiBQ1fX2V4dGVuZHNmdGYy4wULX19mbG9hdHNpdGbkBQ1fX2Zsb2F0dW5zaXRm5QUNX19mZV9nZXRyb3VuZOYFEl9fZmVfcmFpc2VfaW5leGFjdOcFCV9fbHNocnRpM+gFCF9fbXVsdGYz6QUIX19tdWx0aTPqBQlfX3Bvd2lkZjLrBQhfX3N1YnRmM+wFDF9fdHJ1bmN0ZmRmMu0FC3NldFRlbXBSZXQw7gULZ2V0VGVtcFJldDDvBQlzdGFja1NhdmXwBQxzdGFja1Jlc3RvcmXxBQpzdGFja0FsbG9j8gUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudPMFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdPQFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWX1BRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl9gUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k9wUMZHluQ2FsbF9qaWpp+AUWbGVnYWxzdHViJGR5bkNhbGxfamlqafkFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfcFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 26424;
var ___stop_em_js = Module['___stop_em_js'] = 27477;



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
