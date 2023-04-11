
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2AAAX5gAn9/AXxgA39+fwF+YAJ/fABgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA4SGgIAAggYHCAEABwcHAAAHBAAIBwccAAACAwIABwcEAwMDAA4HDgAHBwMFAgcHAgcHAwkGBgYGBxYKDQYCBQMFAAACAgACAQAAAAACAQUGBgEABwUFAAAABwQDBAICAggDAAUABgICAgIAAwMDBgAAAAEAAgYABgYDAgIDAgIDBAMDAwYCCAACAQEAAAAAAAAAAQAAAAMAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAAAAAAAAAAAAAAAAAAAgAAAAIAAAMBAQEBAQEBAQEBAQEBAQEGAwEDAAABAQEBAAoAAgIAAQEBAAEAAQEAAAEAAAACAgUFCgABAAEBAgQGAQ4CAAAAAAAIAwYKAgICAAUKAwkDAQUGAwUJBQUGBQEBAwMGAwMDBQUFCQ0FAwMGBgMDAwMFBgUFBQUFBQEDDxECAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHR4DBAYCBQUFAQEFBQoBAwICAQAKBQUBBQUBBRECAgUPAwMDAwYGAwMDBAQGBgYBAwADAwQCAAMAAgYABAYGBQEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgECBAQBCg0CAgAABwkJAQMHAQIACAACBQAHCQgABAQEAAACBwADBwcBAgEAEgMJBwAABAACBwACBwQHBAQDAwMGAggGBgYEBwYHAwMGCAYAAAQfAQMPAwMACQcDBgQDBAAEAwMDAwQEBgYAAAAEBAcHBwcEBwcHCAgIBwQEAw4IAwAEAQAJAQMDAQMFBAkgCRcDAwQDBwcFBwQECAAEBAcJBwgABwgTBAYGBgQABBghEAYEBAQGCQQEAAAUCwsLEwsQBggHIgsUFAsYExISCyMkJSYLAwMDBAQXBAQZDBUnDCgFFikqBQ8EBAAIBAwVGhoMESsCAggIFQwMGQwsAAgIAAQIBwgICC0NLgSHgICAAAFwAecB5wEFhoCAgAABAYACgAIG3YCAgAAOfwFB0PYFC38BQQALfwFBAAt/AUEAC38AQcjUAQt/AEG31QELfwBBgdcBC38AQf3XAQt/AEH52AELfwBBydkBC38AQerZAQt/AEHv2wELfwBByNQBC38AQeXcAQsH/YWAgAAjBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jAPcFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCzBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQD4BRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwYcX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMHGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwgUX19lbV9qc19fZW1fdGltZV9ub3cDCSBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMKF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAwsGZmZsdXNoALsFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACSBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAJMGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAlAYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAJUGCXN0YWNrU2F2ZQCOBgxzdGFja1Jlc3RvcmUAjwYKc3RhY2tBbGxvYwCQBhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AJEGDV9fc3RhcnRfZW1fanMDDAxfX3N0b3BfZW1fanMDDQxkeW5DYWxsX2ppamkAlwYJw4OAgAABAEEBC+YBKjtERUZHVVZlWlxub3NmbfYBiQKkAqoCrwKaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGnAagBqQGqAasBrAGtAa4BrwGwAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAckBygHLAcwBzQHOAc8B0AHRAdMB1AHVAdcB2AHaAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHrAe0B7gHvAfAB8QHyAfMB9QH4AfkB+gH7AfwB/QH+Af8BgAKBAoICgwKEAoUChgKxA7IDswO0A7UDtgO3A7gDuQO6A7sDvAO9A74DvwPAA8EDwgPDA8QDxQPGA8cDyAPJA8oDywPMA80DzgPPA9AD0QPSA9MD1APVA9YD1wPYA9kD2gPbA9wD3QPeA98D4APhA+ID4wPkA+UD5gPnA+gD6QPqA+sD7APtA+4D7wPwA/ED8gPzA/QD9QP2A/cD+AP5A/oD+wP8A/0D/gP/A4AEgQSCBIMEhASFBIYEhwSIBIkEigSLBIwEjQSOBKEEpASoBKkEqwSqBK4EsATBBMIExATFBKQFwAW/Bb4FCvuwioAAggYFABCSBgskAQF/AkBBACgC8NwBIgANAEGYyABBuz1BGUG8HRCZBQALIAAL1QEBAn8CQAJAAkACQEEAKALw3AEiA0UNACABQQNxDQEgACADayIDQQBIDQIgAyACakGBgAhPDQICQAJAIANBB3ENACACRQ0FQQAhAwwBC0HFzwBBuz1BIkGRJBCZBQALAkADQCAAIAMiA2otAABB/wFHDQEgA0EBaiIEIQMgBCACRg0FDAALAAtBxChBuz1BJEGRJBCZBQALQZjIAEG7PUEeQZEkEJkFAAtB1c8AQbs9QSBBkSQQmQUAC0GaygBBuz1BIUGRJBCZBQALIAAgASACELYFGgtsAQF/AkACQAJAQQAoAvDcASIBRQ0AIAAgAWsiAUGB4AdPDQEgAUH/H3ENAiAAQf8BQYAgELgFGg8LQZjIAEG7PUEpQaksEJkFAAtBwMoAQbs9QStBqSwQmQUAC0Gd0gBBuz1BLEGpLBCZBQALQQEDf0HXOEEAEDxBACgC8NwBIQBB//8HIQEDQAJAIAAgASICai0AAEE3Rg0AIAAgAhAADwsgAkF/aiEBIAINAAsLJQEBf0EAQYCACBD3BSIANgLw3AEgAEE3QYCACBC4BUGAgAgQAQsFABACAAsCAAsCAAsCAAscAQF/AkAgABD3BSIBDQAQAgALIAFBACAAELgFCwcAIAAQ+AULBABBAAsKAEH03AEQxQUaCwoAQfTcARDGBRoLYQICfwF+IwBBEGsiASQAAkACQCAAEOUFQRBHDQAgAUEIaiAAEJgFQQhHDQAgASkDCCEDDAELIAAgABDlBSICEIsFrUIghiAAQQFqIAJBf2oQiwWthCEDCyABQRBqJAAgAwsIABA9IAAQAwsGACAAEAQLCAAgACABEAULCAAgARAGQQALEwBBACAArUIghiABrIQ3A6DTAQsNAEEAIAAQJjcDoNMBCyUAAkBBAC0AkN0BDQBBAEEBOgCQ3QFBpNsAQQAQPxCmBRD9BAsLZQEBfyMAQTBrIgAkAAJAQQAtAJDdAUEBRw0AQQBBAjoAkN0BIABBK2oQjAUQngUgAEEQakGg0wFBCBCXBSAAIABBK2o2AgQgACAAQRBqNgIAQbMWIAAQPAsQgwUQQSAAQTBqJAALLQACQCAAQQJqIAAtAAJBCmoQjgUgAC8BAEYNAEGPywBBABA8QX4PCyAAEKcFCwgAIAAgARBxCwkAIAAgARCjAwsIACAAIAEQOgsVAAJAIABFDQBBARCaAg8LQQEQmwILCQBBACkDoNMBCw4AQc8RQQAQPEEAEAcAC54BAgF8AX4CQEEAKQOY3QFCAFINAAJAAkAQCEQAAAAAAECPQKIiAEQAAAAAAADwQ2MgAEQAAAAAAAAAAGZxRQ0AIACxIQEMAQtCACEBC0EAIAFChX98NwOY3QELAkACQBAIRAAAAAAAQI9AoiIARAAAAAAAAPBDYyAARAAAAAAAAAAAZnFFDQAgALEhAQwBC0IAIQELIAFBACkDmN0BfQsGACAAEAkLAgALCAAQHEEAEHQLHQBBoN0BIAE2AgRBACAANgKg3QFBAkEAELcEQQALzQQBAX8jAEEQayIEJAACQAJAAkACQAJAIAFBf2oOEAMCBAQEBAQEBAQEBAQEBAEACyABQTBHDQNBoN0BLQAMRQ0DAkACQEGg3QEoAgRBoN0BKAIIIgJrIgFB4AEgAUHgAUgbIgENAEGg3QFBFGoQ6wQhAgwBC0Gg3QFBFGpBACgCoN0BIAJqIAEQ6gQhAgsgAg0DQaDdAUGg3QEoAgggAWo2AgggAQ0DQYItQQAQPEGg3QFBgAI7AQxBABAoDAMLIAJFDQJBACgCoN0BRQ0CQaDdASgCECACRw0CAkAgAy0AA0EBcQ0AIAMvAQ5BgAFHDQBB6CxBABA8QaDdAUEUaiADEOUEDQBBoN0BQQE6AAwLQaDdAS0ADEUNAgJAAkBBoN0BKAIEQaDdASgCCCICayIBQeABIAFB4AFIGyIBDQBBoN0BQRRqEOsEIQIMAQtBoN0BQRRqQQAoAqDdASACaiABEOoEIQILIAINAkGg3QFBoN0BKAIIIAFqNgIIIAENAkGCLUEAEDxBoN0BQYACOwEMQQAQKAwCC0Gg3QEoAhAiAUUNASABQQAgAS0ABGtBDGxqQVxqIAJHDQFBhdsAQRNBAUEAKALA0gEQxAUaQaDdAUEANgIQDAELQQAoAqDdAUUNAEGg3QEoAhANACACKQMIEIwFUQ0AQaDdASACQavU04kBELsEIgE2AhAgAUUNACAEQQtqIAIpAwgQngUgBCAEQQtqNgIAQYcYIAQQPEGg3QEoAhBBgAFBoN0BQQRqQQQQvAQaCyAEQRBqJAALTwEBfyMAQRBrIgIkACACIAE2AgwgACABEM8EAkBBwN8BQcACQbzfARDSBEUNAANAQcDfARA3QcDfAUHAAkG83wEQ0gQNAAsLIAJBEGokAAsvAAJAQcDfAUHAAkG83wEQ0gRFDQADQEHA3wEQN0HA3wFBwAJBvN8BENIEDQALCwszABBBEDgCQEHA3wFBwAJBvN8BENIERQ0AA0BBwN8BEDdBwN8BQcACQbzfARDSBA0ACwsLFwBBACAANgKE4gFBACABNgKA4gEQrQULCwBBAEEBOgCI4gELVwECfwJAQQAtAIjiAUUNAANAQQBBADoAiOIBAkAQsAUiAEUNAAJAQQAoAoTiASIBRQ0AQQAoAoDiASAAIAEoAgwRAwAaCyAAELEFC0EALQCI4gENAAsLCyABAX8CQEEAKAKM4gEiAg0AQX8PCyACKAIAIAAgARAKC4kDAQN/IwBB4ABrIgQkAAJAAkACQAJAEAsNAEHCMkEAEDxBfyEFDAELAkBBACgCjOIBIgVFDQAgBSgCACIGRQ0AAkAgBSgCBEUNACAGQegHQQAQERoLIAVBADYCBCAFQQA2AgBBAEEANgKM4gELQQBBCBAhIgU2AoziASAFKAIADQECQAJAAkAgAEHxDRDkBUUNACAAQZvMABDkBQ0BCyAEIAI2AiggBCABNgIkIAQgADYCIEGmFiAEQSBqEJ8FIQAMAQsgBCACNgI0IAQgADYCMEGFFiAEQTBqEJ8FIQALIARBATYCWCAEIAM2AlQgBCAAIgM2AlAgBEHQAGoQDCIAQQBMDQIgACAFQQNBAhANGiAAIAVBBEECEA4aIAAgBUEFQQIQDxogACAFQQZBAhAQGiAFIAA2AgAgBCADNgIAQeMWIAQQPCADECJBACEFCyAEQeAAaiQAIAUPCyAEQZ3OADYCQEHNGCAEQcAAahA8EAIACyAEQfvMADYCEEHNGCAEQRBqEDwQAgALKgACQEEAKAKM4gEgAkcNAEGOM0EAEDwgAkEBNgIEQQFBAEEAEJwEC0EBCyQAAkBBACgCjOIBIAJHDQBB+doAQQAQPEEDQQBBABCcBAtBAQsqAAJAQQAoAoziASACRw0AQf4rQQAQPCACQQA2AgRBAkEAQQAQnAQLQQELVAEBfyMAQRBrIgMkAAJAQQAoAoziASACRw0AIAEoAgQhAgJAIAEoAgxFDQAgAyACNgIAQdbaACADEDwMAQtBBCACIAEoAggQnAQLIANBEGokAEEBC0kBAn8CQEEAKAKM4gEiAEUNACAAKAIAIgFFDQACQCAAKAIERQ0AIAFB6AdBABARGgsgAEEANgIEIABBADYCAEEAQQA2AoziAQsL0AIBAn8jAEEwayIGJAACQAJAAkACQCACEN8EDQAgACABQfIxQQAQhwMMAQsgBiAEKQMANwMYIAEgBkEYaiAGQSxqEJcDIgdFDQECQEEBIAJBA3F0IANqIAYoAixNDQACQCAFRQ0AIAZBIGogAUGgLkEAEIcDCyAAQgA3AwAMAQsgByADaiEDAkAgBUUNACAGIAQpAwA3AxAgASAGQRBqEJUDRQ0DIAYgBSkDADcDIAJAAkAgBigCJEF/Rw0AIAMgAiAGKAIgEOEEDAELIAYgBikDIDcDCCADIAIgASAGQQhqEJEDEOAECyAAQgA3AwAMAQsCQCACQQdLDQAgAyACEOIEIgFBgYCAgHhqQQJJDQAgACABEI4DDAELIAAgAyACEOMEEI0DCyAGQTBqJAAPC0G3yABBiDxBFUHqHhCZBQALQcrVAEGIPEEhQeoeEJkFAAvvAwECfyADKAIAIQUCQAJAAkACQAJAAkACQAJAAkACQCACQQR0QTBxIAJBBHZyQX8gAkEMcUEMRhtBAWoOCAEDBAcAAggICQsgBEEARyECAkAgBA0AQQAhBiACIQQMBgsgBS0AAA0EQQAhBiACIQQMBQsCQCACEN8EDQAgACABQfIxQQAQhwMPCwJAQQEgAkEDcXQiASAETQ0AIABCADcDAA8LIAMgAygCACABajYCAAJAIAJBB0sNACAFIAIQ4gQiBEGBgICAeGpBAkkNACAAIAQQjgMPCyAAIAUgAhDjBBCNAw8LAkAgBA0AIABCADcDAA8LIAMgBUEBajYCACAAQejxAEHw8QAgBS0AABspAwA3AwAPCyAAQgA3AwAPCwJAIAEgBBCSASICDQAgAEIANwMADwsgAyADKAIAIARqNgIAIAJBDGogBSAEELYFGiAAIAFBCCACEJADDwtBACEGAkACQANAIAZBAWoiAiAERg0BIAIhBiAFIAJqLQAADQALIAIhBgwBCyAEIQYLIAYhBiACIARJIQQLIAMgBSAGIgJqIARqNgIAIAAgAUEIIAEgBSACEJQBEJADDwsgAyAFIARqNgIAIAAgAUEIIAEgBSAEEJQBEJADDwsgACABQbQVEIgDDwsgACABQfgQEIgDC+wDAQN/IwBBwABrIgUkACABQQR0QTBxIAFBBHZyQX8gAUEMcUEMRhsiBiEHAkACQAJAAkACQAJAIAZBAWoOCAAFAgICAQMDBAsCQCABEN8EDQAgBUE4aiAAQfIxQQAQhwNBACEHDAULAkBBASABQQNxdCIHIANNDQAgByEHDAULAkAgBCgCBEF/Rw0AIAIgASAEKAIAEOEEIAchBwwFCyAFIAQpAwA3AwggAiABIAAgBUEIahCRAxDgBCAHIQcMBAsCQCADDQBBASEHDAQLIAUgBCkDADcDECACQQAgACAFQRBqEJMDazoAAEEBIQcMAwsgBSAEKQMANwMoIAAgBUEoaiAFQTRqEJcDIgchAQJAAkAgBw0AIAUgBCkDADcDICAFQThqIAAgBUEgahD6AiAEIAUpAzg3AwAgBSAEKQMANwMYIAAgBUEYaiAFQTRqEJcDIgchASAHDQBBACEBDAELIAEhBwJAIAUoAjQgA00NACAFIAM2AjQLIAIgByAFKAI0IgEQtgUhBwJAIAZBA0cNACABIANPDQAgByABakEAOgAAIAUgAUEBajYCNAsgBSgCNCEBCyABIQcMAgsgBUE4aiAAQbQVEIgDQQAhBwwBCyAFQThqIABB+BAQiANBACEHCyAFQcAAaiQAIAcLbgECfwJAIAFB7wBLDQBBqSRBABA8QQAPCyAAIAEQowMhAyAAEKIDQQAhBAJAIAMNAEGICBAhIgQgAi0AADoA1AEgBCAELQAGQQhyOgAGEOwCIAAgARDtAiAEQYICahDuAiAEIAAQTSAEIQQLIAQLlwEAIAAgATYCpAEgABCWATYC0AEgACAAIAAoAqQBLwEMQQN0EIkBNgIAIAAgACAAKACkAUE8aigCAEEDdkEMbBCJATYCtAEgACAAEJABNgKgAQJAIAAvAQgNACAAEIEBIAAQlwIgABCYAiAALwEIDQAgACgC0AEgABCVASAAQQE6AEMgAEKAgICAMDcDUCAAQQBBARB+GgsLKgEBfwJAIAAtAAZBCHENACAAKALIASAAKALAASIERg0AIAAgBDYCyAELCxkAAkAgAUUNACABIAAvAQo2AgALIAAvAQgLqwMBAX8CQAJAAkAgAEUNACAALQAGIgRBAXENASAAIARBAXI6AAYCQCABQTBGDQAgABCBAQsCQCAALQAGIgRBEHFFDQAgACAEQRBzOgAGIAAoAqwBRQ0AIABBAToASAJAIAAtAEVFDQAgABCEAwsCQCAAKAKsASIERQ0AIAQQgAELIABBADoASCAAEIMBCwJAAkACQAJAAkACQCABQXBqDjEAAgEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQQFBQUFBQUFBQUFBQUFBQUDBQsCQCAALQAGQQhxDQAgACgCyAEgACgCwAEiAUYNACAAIAE2AsgBCyAAIAIgAxCUAgwECyAALQAGQQhxDQMgACgCyAEgACgCwAEiAUYNAyAAIAE2AsgBDAMLAkAgAC0ABkEIcQ0AIAAoAsgBIAAoAsABIgFGDQAgACABNgLIAQsgAEEAIAMQlAIMAgsgACADEJYCDAELIAAQgwELIAAtAAYiAUEBcUUNAiAAIAFB/gFxOgAGCw8LQdzOAEGMOkHIAEHVGxCZBQALQfXSAEGMOkHNAEG1KhCZBQALdwEBfyAAEJkCIAAQpwMCQCAALQAGIgFBAXFFDQBB3M4AQYw6QcgAQdUbEJkFAAsgACABQQFyOgAGIABBoARqEN4CIAAQeiAAKALQASAAKAIAEIsBIAAoAtABIAAoArQBEIsBIAAoAtABEJcBIABBAEGICBC4BRoLEgACQCAARQ0AIAAQUSAAECILCysBAX8jAEEQayICJAAgAiABNgIAQeHUACACEDwgAEHk1AMQdiACQRBqJAALDQAgACgC0AEgARCLAQsCAAuRAwEEfwJAAkACQAJAAkAgAS8BDiICQYB/ag4CAAECCwJAAkAgAS0ADCIDRQ0AAkACQCABLQAQDQAgA0EARyECQQEhBAwBC0EAIQQDQCAEIgVBAWoiAiADRg0CIAIhBCABIAJqQRBqLQAADQALIAIgA0khAiAFQQJqIQQLIAQhBCACDQELQcoTQQAQPA8LQQIgAUEQaiIBIAEgBGogAyAEayAAKAIIKAIAEQkARQ0CQbk1QQAQPA8LAkACQCABLQAMIgNFDQACQAJAIAEtABANACADQQBHIQJBASEEDAELQQAhBANAIAQiBUEBaiICIANGDQIgAiEEIAEgAmpBEGotAAANAAsgAiADSSECIAVBAmohBAsgBCEEIAINAQtByhNBABA8DwtBASABQRBqIgEgASAEaiADIARrIAAoAggoAgARCQBFDQFBuTVBABA8DwsgAkGAI0YNAQJAIAAoAggoAgwiAkUNACABIAIRBABBAEoNAQsgARD0BBoLDwsgASAAKAIIKAIEEQgAQf8BcRDwBBoLNQECf0EAKAKQ4gEhA0GAASEEAkACQAJAIABBf2oOAgABAgtBgQEhBAsgAyAEIAEgAhClBQsLGwEBf0G43QAQ/AQiASAANgIIQQAgATYCkOIBCy4BAX8CQEEAKAKQ4gEiAUUNACABKAIIIgFFDQAgASgCECIBRQ0AIAAgAREAAAsLwgEBBX8CQCAALQAKRQ0AIABBFGoiASECA0ACQAJAAkAgAC8BDCIDIAAvAQ4iBEsNACACEOsEGiAAQQA6AAogACgCEBAiDAELAkACQCABIAAoAhAgAC0ACyIFIARsaiADIARrIgRByAEgBEHIAUkbQQEgBUEBRhsiBCAFbBDqBA4CAAUBCyAAIAAvAQ4gBGo7AQ4MAgsgAC0ACkUNASABEOsEGiAAQQA6AAogACgCEBAiCyAAQQA2AhALIAAtAAoNAAsLC20BA38CQEEAKAKU4gEiAUUNAAJAEHAiAkUNACACIAEtAAZBAEcQpgMgAkEAOgBJIAIgAS0ACEEAR0EBdCIDOgBJIAEtAAdFDQAgAiADQQFyOgBJCwJAIAEtAAYNACABQQA6AAkLIABBBhCqAwsLohUCB38BfiMAQYABayICJAAgAhBwIgM2AlggAiABNgJUIAIgADYCUAJAAkACQCADRQ0AIAAtAAkNAQsCQAJAAkAgAS8BDiIEQf9+ag4SAAAAAQMDAwMDAwMDAwMDAgICAwsCQCAALQAKRQ0AIABBFGoQ6wQaIABBADoACiAAKAIQECIgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARDkBBogACABLQAOOgAKDAMLIAJB+ABqQQAoAvBdNgIAIAJBACkC6F03A3AgAS0ADSAEIAJB8ABqQQwQrgUaDAELIANFDQELAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAS8BDkGAf2oOFwIDBAYHBQ0NDQ0NDQ0NDQ0AAQgKCQsMDQsgAS0ADEUNDyABQRBqIQVBACEAA0AgAyAFIAAiAGooAgBBABCrAxogAEEEaiIEIQAgBCABLQAMSQ0ADBALAAsgAS0ADEUNDiABQRBqIQVBACEAA0AgAyAFIAAiAGooAgAQqAMaIABBBGoiBCEAIAQgAS0ADEkNAAwPCwALQQAhAQJAIANFDQAgAygCsAEhAQsCQCABIgANAEEAIQUMDQtBACEBIAAhAANAIAFBAWoiASEFIAEhASAAKAIAIgQhACAEDQAMDQsAC0EAIQACQCADIAFBHGooAgAQfSIGRQ0AIAYoAighAAsCQCAAIgENAEEAIQUMCwsgASEBQQAhAANAIABBAWoiACEFIAEoAgwiBCEBIAAhACAEDQAMCwsACwJAIAEtACBB8AFxQdAARw0AIAFB0AA6ACALAkACQCABLQAgIgRBAkYNACAEQdAARw0BQQAhBAJAIAFBHGooAgAiBUUNACADIAUQmAEgBSEEC0EAIQUCQCAEIgNFDQAgAy0AA0EPcSEFC0EAIQQCQAJAAkACQCAFQX1qDgYBAwMDAwADCyADKAIQQQhqIQQMAQsgA0EIaiEECyAELwEAIQQLAkAgBEH//wNxIgQNAAJAIAAtAApFDQAgAEEUahDrBBogAEEAOgAKIAAoAhAQIiAAQQA2AhALIABCADcCDCAAQQE6AAsgAEEUaiABEOQEGiAAIAEtAA46AAoMDgsCQAJAIAMNAEEAIQEMAQsgAy0AA0EPcSEBCwJAAkACQCABQX1qDgYAAgICAgECCyACQdAAaiAEIAMoAgwQXQwPCyACQdAAaiAEIANBGGoQXQwOC0GvPkGNA0GhMhCUBQALIAFBHGooAgBB5ABHDQAgAkHQAGogAygCpAEvAQwgAygCABBdDAwLAkAgAC0ACkUNACAAQRRqEOsEGiAAQQA6AAogACgCEBAiIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQ5AQaIAAgAS0ADjoACgwLCyACQfAAaiADIAEtACAgAUEcaigCABBeIAJBADYCYCACIAIpA3A3AyACQCADIAJBIGoQmAMiBEUNACAEKAIAQYCAgPgAcUGAgIDQAEcNACACQegAaiADQQggBCgCHBCQAyACIAIpA2g3A3ALIAIgAikDcDcDGAJAAkAgAyACQRhqEJQDDQAgAiACKQNwNwMQQQAhBCADIAJBEGoQ8wJFDQELIAIgAikDcDcDCCADIAJBCGogAkHgAGoQlwMhBAsgBCEFAkAgAigCYCIEIAFBImovAQAiA0sNAAJAIAAtAApFDQAgAEEUahDrBBogAEEAOgAKIAAoAhAQIiAAQQA2AhALIABCADcCDCAAQQE6AAsgAEEUaiABEOQEGiAAIAEtAA46AAoMCwsgAiAEIANrIgA2AmAgAiAAIAFBJGovAQAiASAAIAFJGyIBNgJgIAJB0ABqQQEgARBfIgFFDQogASAFIANqIAIoAmAQtgUaDAoLIAJB8ABqIAMgAS0AICABQRxqKAIAEF4gAiACKQNwNwMwIAJB0ABqQRAgAyACQTBqQQAQYCIBEF8iAEUNCSACIAIpA3A3AyggASADIAJBKGogABBgRg0JQcnLAEGvPkGSBEGwNBCZBQALIAJB4ABqIAMgAUEUai0AACABKAIQEF4gAiACKQNgIgk3A2ggAiAJNwM4IAMgAkHwAGogAkE4ahBhIAEtAA0gAS8BDiACQfAAakEMEK4FGgwICyADEKcDDAcLIABBAToABgJAEHAiAUUNACABIAAtAAZBAEcQpgMgAUEAOgBJIAEgAC0ACEEAR0EBdCIEOgBJIAAtAAdFDQAgASAEQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLIANFDQZBhBFBABA8IAMQqQMMBgsgAEEAOgAJIANFDQVBoi1BABA8IAMQpQMaDAULIABBAToABgJAEHAiA0UNACADIAAtAAZBAEcQpgMgA0EAOgBJIAMgAC0ACEEAR0EBdCIBOgBJIAAtAAdFDQAgAyABQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLEGkMBAsCQCADRQ0AAkACQCABKAIQIgQNACACQgA3A3AMAQsgAiAENgJwIAJBCDYCdCADIAQQmAELIAIgAikDcDcDSAJAAkAgAyACQcgAahCYAyIEDQBBACEFDAELIAQoAgBBgICA+ABxQYCAgMAARiEFCwJAAkAgBSIHDQAgAiABKAIQNgJAQd4KIAJBwABqEDwMAQsgA0EBQQMgAS0ADEF4aiIFQQRJGyIIOgAHAkAgAUEUai8BACIGQQFxRQ0AIAMgCEEIcjoABwsCQCAGQQJxRQ0AIAMgAy0AB0EEcjoABwsgAyAENgLYASAFQQRJDQAgBUECdiIEQQEgBEEBSxshBSABQRhqIQZBACEBA0AgAyAGIAEiAUECdGooAgBBARCrAxogAUEBaiIEIQEgBCAFRw0ACwsgB0UNBCAAQQA6AAkgA0UNBEGiLUEAEDwgAxClAxoMBAsgAEEAOgAJDAMLAkAgACABQcjdABD2BCIDQYB/akECSQ0AIANBAUcNAwsCQBBwIgNFDQAgAyAALQAGQQBHEKYDIANBADoASSADIAAtAAhBAEdBAXQiAToASSAALQAHRQ0AIAMgAUEBcjoASQsgAC0ABg0CIABBADoACQwCCyACQdAAakEQIAUQXyIHRQ0BAkACQCAGDQBBACEBDAELIAYoAighAQsgASIBRQ0BIAEhAUEAIQADQCACQfAAaiADQQggASIBEJADIAcgACIFQQR0aiIAIAIoAnA2AgAgACABLwEENgIEQQAhBAJAIAEoAggiBkUNACACQfAAaiADQQggBhCQAyACKAJwIQQLIAAgBDYCCCAAQc+GfyABKAIQIgQgAygApAEiBiAGKAIgaiIGa0EEdiAEIAZGGzsBDCABKAIMIgQhASAFQQFqIQAgBA0ADAILAAsgAkHQAGpBCCAFEF8iB0UNAAJAAkAgAw0AQQAhAQwBCyADKAKwASEBCyABIgFFDQBBACEAIAEhAQNAIAcgACIFQQN0aiIAIAEiASgCHDYCACAAIAEvARYiBEHPhn8gBBs7AQRBACEEAkAgASgCKCIGRQ0AQc+GfyAGKAIQIgQgAygApAEiBiAGKAIgaiIGa0EEdiAEIAZGGyEECyAAIAQ7AQYgBUEBaiEAIAEoAgAiBCEBIAQNAAsLIAJBgAFqJAALmwIBBX8jAEEQayIDJAACQCAAKAIEIgQvAQ5BggFHDQACQAJAIARBImovAQAiBSABSQ0AAkAgACgCACIBLQAKRQ0AIAFBFGoQ6wQaIAFBADoACiABKAIQECIgAUEANgIQCyABQgA3AgwgAUEBOgALIAFBFGogACgCBBDkBBogASAAKAIELQAOOgAKDAELIABBDCABIAVrIgEgBEEkai8BACIEIAEgBEkbIgYQXyIHRQ0AIAZFDQAgAiAFQQN0aiEFQQAhAQNAIAAoAgghBCADIAUgASIBQQN0aikDADcDCCAEIAcgAUEMbGogA0EIahBhIAFBAWoiBCEBIAQgBkcNAAsLIANBEGokAA8LQafFAEGvPkHmAkGFFRCZBQALygQCAn8BfiMAQRBrIgQkACADIQUCQAJAAkACQAJAAkACQAJAAkACQAJAAkBB0AAgAiACQfABcUHQAEYbIgJBf2oOUAABAgkDCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkEBAQECQkJCQkJCQkJCQkJBgUJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkHCQsgACADEI4DDAoLAkACQAJAAkAgAw4EAQIDAAoLIABBACkDiHI3AwAMDAsgAEIANwMADAsLIABBACkD6HE3AwAMCgsgAEEAKQPwcTcDAAwJCyAAIAM2AgAgAEEBNgIEDAgLIAAgASADENsCDAcLIAAgASACQWBqIAMQsAMMBgsCQEEAIAMgA0HPhgNGGyIDIAEoAKQBQSRqKAIAQQR2SQ0AAkAgA0HQhgNPDQAgAyEFDAULIANBAC8BqNMBQdCGA2pJDQAgAyEFDAQLIAAgAzYCACAAQQM2AgQMBQsCQCABKACkAUE8aigCAEEDdiADSw0AIAMhBQwDCwJAIAEoArQBIANBDGxqKAIIIgJFDQAgACABQQggAhCQAwwFCyAAIAM2AgAgAEECNgIEDAQLAkAgAw0AIABCADcDAAwECyAAIAM2AgAgAEEINgIEIAEgAxCYAQwDCyADIQUgA0HlAEYNAQsgBCAFNgIEIAQgAjYCAEGnCiAEEDwgAEIANwMADAELAkAgASkAOCIGQgBSDQAgASgCrAEiA0UNACAAIAMpAyA3AwAMAQsgACAGNwMACyAEQRBqJAALzgEBAn8CQAJAIAAoAgAiAy0ABkUNACACIQIgAy0ACQ0BC0EAIQILAkAgAiICQegHTw0AAkAgAy0ACkUNACADQRRqEOsEGiADQQA6AAogAygCEBAiIANBADYCEAsgA0EAOwEOIAMgAjsBDCADIAE6AAtBACEEAkAgAkUNACACIAFsECEhBAsgAyAEIgI2AhACQCACDQAgA0EAOwEMCyADQRRqIAAoAgQQ5AQaIAMgACgCBC0ADjoACiADKAIQDwtB2cwAQa8+QTFBojgQmQUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQmwMNACADIAEpAwA3AxgCQAJAIAAgA0EYahDGAiICDQAgAyABKQMANwMQIAAgA0EQahDFAiEBDAELAkAgACACEMcCIgENAEEAIQEMAQsCQCAAIAIQrAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABD2AiADQShqIAAgBBDcAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEKcCIAFqIQIMAQsgACACQQBBABCnAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahC+AiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEJADIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEnSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEGA2AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEJoDDg0BBAsFCQYDBwsICgIACwsgAUEDNgIAIAFBAjoACgwLCyABQQA2AgAgAUECOgAKDAoLIAFBBjoACiABIAIpAwA3AgAMCQsgAUECOgAKIAMgAikDADcDCCABQQFBAiAAIANBCGoQkwMbNgIADAgLIAFBAToACiADIAIpAwA3AxAgASAAIANBEGoQkQM5AgAMBwsgAUHRADoACiACKAIAIQIgASAENgIAIAEgAi8BCEGAgICAeHI2AgQMBgsgASAENgIAIAFBMDoACiADIAIpAwA3AxggASAAIANBGGpBABBgNgIEDAULIAEgBDYCACABQQM6AAoMBAsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgDBHDQUgASAENgIAIAFB1AA6AAoMAwsgAigCACICRQ0FIAIoAgBBgICA+ABxQYCAgChHDQUgASAENgIAIAFB0wA6AAogASACLwEEQYCAgIB4cjYCBAwCCyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICA0ABHDQUgASAENgIAIAFB1gA6AAogASACKAIcLwEEQYCAgIB4cjYCBAwBCyABQQc6AAogASACKQMANwIACyADQdAAaiQADwtB4NMAQa8+QZMBQYMrEJkFAAtBuskAQa8+QfQBQYMrEJkFAAtB18YAQa8+QfsBQYMrEJkFAAtBgsUAQa8+QYQCQYMrEJkFAAuDAQEEfyMAQRBrIgEkACABIAAtAEY2AgBBACgClOIBIQJBrDcgARA8IAAoAqwBIgMhBAJAIAMNACAAKAKwASEEC0EAIQMCQCAEIgRFDQAgBCgCHCEDCyABIAM2AgggASAALQBGOgAMIAJBAToACSACQYABIAFBCGpBCBClBSABQRBqJAALEABBAEHY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AyECCwJAIAIiA0UNACAAQQAQ0gIhAiAAQQEQ0gIhBCAAQQIQ0gIhACABKAIoIgUgAk0NACABIAUgAmsiBTYCKCADIAJqIAAgBSAEIAUgBEkbELgFGgsgAUEwaiQAC6YDAgd/AX4jAEHgAGsiASQAIAEgACkDUCIINwM4IAEgCDcDUAJAAkAgACABQThqEJUDDQAgASABKQNQNwMwIAFB2ABqIABBvRwgAUEwahCKA0EAIQIMAQsgASABKQNQNwMoIAAgAUEoaiABQcwAahCWAyECCwJAIAIiA0UNACAAQQAQ0gIhBCABIABB4ABqKQMAIgg3AyAgASAINwNAAkACQCAAIAFBIGoQ8wJFDQAgASABKQNANwMAIAAgASABQdgAahD1AiECDAELIAEgASkDQCIINwNQIAEgCDcDGAJAAkAgACABQRhqEJQDDQAgASABKQNQNwMQIAFB2ABqIABBEiABQRBqEIkDQQAhAgwBCyABIAEpA1A3AwggACABQQhqIAFB2ABqEJYDIQILIAIhAgsgAiIFRQ0AIABBAhDSAiECIABBAxDSAiEAIAEoAlgiBiACTQ0AIAEgBiACayIGNgJYIAEoAkwiByAETQ0AIAEgByAEayIHNgJMIAMgBGogBSACaiAHIAYgACAGIABJGyIAIAcgAEkbELYFGgsgAUHgAGokAAvZAQIBfwF8IwBBEGsiAiQAIAIgASkDADcDCAJAAkAgAkEIahCcA0UNAEF/IQEMAQsCQAJAAkAgASgCBEEBag4CAAECCyABKAIAIgFBACABQQBKGyEBDAILIAEoAgBBwgBHDQBBfyEBDAELIAIgASkDADcDAEF/IQEgACACEJEDIgNEAADg////70FkDQBBACEBIANEAAAAAAAAAABjDQACQAJAIANEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQvzAQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMQIAEgAzcDGAJAAkAgAUEQahCcA0UNAEF/IQIMAQsCQAJAAkAgASgCHEEBag4CAAECCyABKAIYIgJBACACQQBKGyECDAILIAEoAhhBwgBHDQBBfyECDAELIAEgASkDGDcDCEF/IQIgACABQQhqEJEDIgREAADg////70FkDQBBACEC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QQhqEIkDQQAhAgwBCwJAIAAgASgCEBB9IgINACABQRhqIABBuDNBABCHAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBgjVBABCHAwwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCJA0EAIQAMAQsCQCAAIAEoAhAQfSICDQAgAUEYaiAAQbgzQQAQhwMLIAIhAAsCQCAAIgBFDQAgABB/CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAqwBIQIgASAAQdgAaikDACIENwMAIAEgBDcDCCAAIAEQpgEhAyAAKAKsASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALGQAgACgCrAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABB3iZBABCHAwwBCyAAIAJBf2pBARB+IgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahC+AiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB1iEgA0EIahCKAwwBCyAAIAEgASgCoAEgBEH//wNxELICIAApAwBCAFINACADQdgAaiABQQggASABQQIQqAIQjwEQkAMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEPYCIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahDOAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQsAIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahC+AiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQiQMMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGo0wFODQIgAEGQ6QAgAUEDdGovAQAQ9gIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtB1RRBsjxBMUHPLRCZBQAL4wECAn8BfiMAQdAAayIBJAAgASAAQdgAaikDADcDSCABIABB4ABqKQMAIgM3AyggASADNwNAAkAgAUEoahCbAw0AIAFBOGogAEH9GhCIAwsgASABKQNINwMgIAFBOGogACABQSBqEPoCIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjQEgASABKQNINwMQAkAgACABQRBqIAFBOGoQ9QIiAkUNACABQTBqIAAgAiABKAI4QQEQnwIgACgCrAEgASkDMDcDIAsgASABKQNINwMIIAAgAUEIahCOASABQdAAaiQAC4UBAQJ/IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDADcDICAAQQIQ0gIhAiABIAEpAyA3AwgCQCABQQhqEJsDDQAgAUEYaiAAQeccEIgDCyABIAEpAyg3AwAgAUEQaiAAIAEgAkEBEKUCIAAoAqwBIAEpAxA3AyAgAUEwaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARCRA5sQ1AILIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQkQOcENQCCyABQRBqJAALXAIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEJEDEOEFENQCCyABQRBqJAALugEDAn8BfgF8IwBBIGsiASQAIAEgAEHYAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAEpAxg3AxAMAQsgAUEQakEAIAJrEI4DCyAAKAKsASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahCRAyIERAAAAAAAAAAAY0UNACAAIASaENQCDAELIAAoAqwBIAEpAxg3AyALIAFBIGokAAsVACAAEI0FuEQAAAAAAADwPaIQ1AILZAEFfwJAAkAgAEEAENICIgFBAUsNAEEBIQIMAQtBASEDA0AgA0EBdEEBciIEIQIgBCEDIAQgAUkNAAsLIAIhAgNAIAQQjQUgAnEiBCAEIAFLIgMbIgUhBCADDQALIAAgBRDVAgsRACAAIABBABDTAhDMBRDUAgsYACAAIABBABDTAiAAQQEQ0wIQ2AUQ1AILLgEDfyAAQQAQ0gIhAUEAIQICQCAAQQEQ0gIiA0UNACABIANtIQILIAAgAhDVAgsuAQN/IABBABDSAiEBQQAhAgJAIABBARDSAiIDRQ0AIAEgA28hAgsgACACENUCCxYAIAAgAEEAENICIABBARDSAmwQ1QILCQAgAEEBENIBC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEJIDIQMgAiACKQMgNwMQIAAgAkEQahCSAyEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQkQMhBiACIAIpAyA3AwAgACACEJEDIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkD+HE3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQ0gELkwECA38BfiMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwAiBDcDGCABIAQ3AyACQCABQRhqEJsDDQAgASABKQMoNwMQIAAgAUEQahDCAiECIAEgASkDIDcDCCAAIAFBCGoQxgIiA0UNACACRQ0AIAAgAiADEKkCCyAAKAKsASABKQMoNwMgIAFBMGokAAsJACAAQQEQ1gELmgECA38BfiMAQTBrIgIk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KQMIIQMgAEGwAmpBBDoAACAAQagCaiADNwIAIABBtAJqIAIvARA7AQAgAEG2AmogAi8BFjsBACABQQhqIAAgAi8BEhCQAiAAKAKsASABKQMINwMgIAFBIGokAAuhAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQtwIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEIkDCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAhC4AiICQX9KDQAgAEIANwMADAELIAAgASACELMCCyADQTBqJAALjwECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqELcCIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahCJAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EwaiQAC4gBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahC3AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQiQMLAkACQCACDQAgAEIANwMADAELIAAgAi8BAhCOAwsgA0EwaiQAC/gBAgN/AX4jAEEwayIDJAAgAyACKQMAIgY3AxggAyAGNwMQAkACQCABIANBEGogA0EsahC3AiIERQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQiQMLAkACQCAEDQAgAEIANwMADAELAkACQCAELwECQYDgA3EiBUUNACAFQYAgRw0BIAAgAikDADcDAAwCCwJAIAEgBBC4AiICQX9KDQAgAEIANwMADAILIAAgASABIAEoAKQBIgUgBSgCYGogAkEEdGogBC8BAkH/H3FBgMAAchDpARC0AgwBCyAAQgA3AwALIANBMGokAAuPAgIEfwF+IwBBMGsiASQAIAEgACkDUCIFNwMYIAEgBTcDCAJAAkAgACABQQhqIAFBLGoQtwIiAkUNACABKAIsQf//AUYNAQsgASABKQMYNwMAIAFBIGogAEGdASABEIkDCwJAIAJFDQAgACACELgC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IAI2AgAgAEECNgIECyADQTBqJAALiQECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQtwIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBnx0gA0EIahCKA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwEANgIAIABBBDYCBAsgA0EwaiQAC4YBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqELcCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZ8dIANBCGoQigNBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BAkH/H3EQjgMLIANBMGokAAvNAwIDfwF+IwBB4ABrIgEkACABIAApA1AiBDcDSCABIAQ3AzAgASAENwNQIAAgAUEwaiABQcQAahC3AiICIQMCQCACDQAgASABKQNQNwMoIAFB2ABqIABBnx0gAUEoahCKA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAkRB//8BRw0AIAEgASkDSDcDICABQdgAaiAAQZIdIAFBIGoQigNBACEDCwJAIAMiA0UNACAAIAMQ9wECQCAAIAAgASgCRBC5AkEAIAMvAQIQ6gEQ6QFFDQAgAEEDOgBDIABB4ABqIAAoAqwBNQIcQoCAgIAQhDcDACAAQdAAaiICQQhqQgA3AwAgAkIANwMAIAFBAjYCXCABIAEoAkQ2AlggASABKQNYNwMYIAFBOGogACABQRhqQZIBEMACIAEgASkDWDcDECABIAEpAzg3AwggAUHQAGogACABQRBqIAFBCGoQvAIgACABKQNQNwNQIABBsQJqQQE6AAAgAEGyAmogAy8BAjsBACABQdAAaiAAIAEoAkQQkAIgAEHYAGogASkDUDcDACAAKAKsAUECQQAQdRoMAQsgACABKAJEIAMvAQIQjQILIAFB4ABqJAALbwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQiQMMAQsgACABKAK0ASACKAIAQQxsaigCACgCEEEARxCPAwsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNQNwMoAkAC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QcHDACADQRBqEPgCDAsLAkAgAkGACEkNACADIAI2AiAgACABQezBACADQSBqEPgCDAsLQeM9Qf4AQagnEJQFAAsgAyACKAIANgIwIAAgAUH4wQAgA0EwahD4AgwJCyACKAIAIQIgAyABKAKkATYCTCADIANBzABqIAIQezYCQCAAIAFBt8IAIANBwABqEPgCDAgLIAMgASgCpAE2AlwgAyADQdwAaiAEQQR2Qf//A3EQezYCUCAAIAFBxsIAIANB0ABqEPgCDAcLIAMgASgCpAE2AmQgAyADQeQAaiAEQQR2Qf//A3EQezYCYCAAIAFB38IAIANB4ABqEPgCDAYLAkACQCACKAIAIgQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAAkACQAJAAkACQCAFQX1qDgkABAIFAQUEAwQFCyAAQo+AgYDAADcDAAwKCyAAQpyAgYDAADcDAAwJCyADIAIpAwA3A2ggACABIANB6ABqEPsCDAgLIAQvARIhAiADIAEoAqQBNgKEASADQYQBaiACEHwhAiAELwEQIQUgAyAEKAIcLwEENgJ4IAMgBTYCdCADIAI2AnAgACABQafDACADQfAAahD4AgwHCyAAQqaAgYDAADcDAAwGC0HjPUGiAUGoJxCUBQALIAIoAgBBgIABTw0FIAMgAikDADcDiAEgACABIANBiAFqEPsCDAQLIAIoAgAhAiADIAEoAqQBNgKcASADIANBnAFqIAIQfDYCkAEgACABQdTCACADQZABahD4AgwDCyADIAIpAwA3A9gBAkAgASADQdgBahC2AiIERQ0AIAQvAQAhAiADIAEoAqQBNgLUASADIANB1AFqIAJBABCuAzYC0AEgACABQezCACADQdABahD4AgwDCyADIAIpAwA3A8gBIAFBpAFqIQIgASADQcgBaiADQeABahC3AiEEAkAgAygC4AEiBUH//wFHDQAgASAEELgCIQUgASgApAEiBiAGKAJgaiAFQQR0ai8BACEFIAMgAigCADYCrAEgA0GsAWogBUEAEK4DIQUgBC8BACEEIAMgAigCADYCqAEgAyADQagBaiAEQQAQrgM2AqQBIAMgBTYCoAEgACABQaPCACADQaABahD4AgwDCyADIAIoAgA2AsQBIANBxAFqIAUQfCEFIAQvAQAhBCADIAIoAgA2AsABIAMgA0HAAWogBEEA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KQMwNwMIIAAgAiADQRBqIANBCGoQywILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCPBCADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQoQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQywILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhCPBCADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQoQMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIIBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQywILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQoQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQQAQqAIhBCADIAMpAxA3AwAgACACIAQgAxDJAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQoQMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIIBCyACQRUQqAIhBCADIAMpAxA3AwAgACACIAQgAxDJAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEKgCEI8BIgMNACABQRAQUwsgASgCrAEhBCACQQhqIAFBCCADEJADIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARCQBCIDEJEBIgQNACABIANBA3RBEGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEJADIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARCQBCIDEJIBIgQNACABIANBDGoQUwsgASgCrAEhAyACQQhqIAFBCCAEEJADIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCCASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBChAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQggELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEKEDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCCAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQoQMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIIBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBChAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQggELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCCAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEI4DC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQggELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCCASAAQgA3AwAMAQsgACACQQggAiAEEMECEJADCyADQRBqJAALXwEDfyMAQRBrIgMkACACEJAEIQQgAhCQBCEFIANBCGogAkECEJIEAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhCPBCADIAMpAwg3AwAgACACIAMQmgMQjgMgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhCPBCAAQejxAEHw8QAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA+hxNwMACw0AIABBACkD8HE3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQjwQgAyADKQMINwMAIAAgAiADEJMDEI8DIANBEGokAAsNACAAQQApA/hxNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEI8EAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEJEDIgREAAAAAAAAAABjRQ0AIAAgBJoQjQMMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkD4HE3AwAMAgsgAEEAIAJrEI4DDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhCRBEF/cxCOAwsyAQF/IwBBEGsiAyQAIANBCGogAhCPBCAAIAMoAgxFIAMoAghBAkZxEI8DIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhCPBAJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxCRA5oQjQMMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQPgcTcDAAwBCyAAQQAgAmsQjgMLIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhCPBCADIAMpAwg3AwAgACACIAMQkwNBAXMQjwMgA0EQaiQACwwAIAAgAhCRBBCOAwupAgIFfwF8IwBBwABrIgMkACADQThqIAIQjwQgAkEYaiIEIAMpAzg3AwAgA0E4aiACEI8EIAIgAykDODcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBIIAUoAgAiByAGaiIGIAdIcw0AIAAgBhCOAwwBCyADIAUpAwA3AzACQAJAIAIgA0EwahDzAg0AIAMgBCkDADcDKCACIANBKGoQ8wJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahD9AgwBCyADIAUpAwA3AyAgAiACIANBIGoQkQM5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEJEDIgg5AwAgACAIIAIrAyCgEI0DCyADQcAAaiQAC80BAgV/AXwjAEEgayIDJAAgA0EYaiACEI8EIAJBGGoiBCADKQMYNwMAIANBGGogAhCPBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASiAFKAIAIgcgBmsiBiAHSHMNACAAIAYQjgMMAQsgAyAFKQMANwMQIAIgAiADQRBqEJEDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCRAyIIOQMAIAAgAisDICAIoRCNAwsgA0EgaiQAC88BAwR/AX4BfCMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBTQCACAENAIAfiIHQiCIpyAHpyIGQR91Rw0AIAAgBhCOAwwBCyADIAUpAwA3AxAgAiACIANBEGoQkQM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJEDIgg5AwAgACAIIAIrAyCiEI0DCyADQSBqJAAL6AECBn8BfCMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQACQAJAIAQoAgAiBkEBag4CAAIBCyAFKAIAQYCAgIB4Rg0BCyAFKAIAIgcgBm0iCCAGbCAHRw0AIAAgCBCOAwwBCyADIAUpAwA3AxAgAiACIANBEGoQkQM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJEDIgk5AwAgACACKwMgIAmjEI0DCyADQSBqJAALLAECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCECAAIAQgAygCAHEQjgMLLAECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCECAAIAQgAygCAHIQjgMLLAECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCECAAIAQgAygCAHMQjgMLLAECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCECAAIAQgAygCAHQQjgMLLAECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCECAAIAQgAygCAHUQjgMLQQECfyACQRhqIgMgAhCRBDYCACACIAIQkQQiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQjQMPCyAAIAIQjgMLnQEBA38jAEEgayIDJAAgA0EYaiACEI8EIAJBGGoiBCADKQMYNwMAIANBGGogAhCPBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEJ4DIQILIAAgAhCPAyADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEJEDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCRAyIGOQMAIAIrAyAgBmUhAgwBCyAFKAIAIAQoAgBMIQILIAAgAhCPAyADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQjwQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEI8EIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEJEDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCRAyIGOQMAIAIrAyAgBmMhAgwBCyAFKAIAIAQoAgBIIQILIAAgAhCPAyADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEI8EIAJBGGoiBCADKQMYNwMAIANBGGogAhCPBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEJ4DQQFzIQILIAAgAhCPAyADQSBqJAALPgEBfyMAQRBrIgMkACADQQhqIAIQjwQgAyADKQMINwMAIABB6PEAQfDxACADEJwDGykDADcDACADQRBqJAAL4gEBBX8jAEEQayICJAAgAkEIaiABEI8EAkACQCABEJEEIgNBAU4NAEEAIQMMAQsCQAJAIAANACAAIQMgAEEARyEEDAELIAAhBSADIQYDQCAGIQAgBSgCCCIDQQBHIQQCQCADDQAgAyEDIAQhBAwCCyADIQUgAEF/aiEGIAMhAyAEIQQgAEEBSg0ACwsgAyEAQQAhAyAERQ0AIAAgASgCTCIDQQN0akEYakEAIAMgACgCEC8BCEkbIQMLAkACQCADIgMNACACIAFB8AAQggEMAQsgAyACKQMINwMACyACQRBqJAALxAEBBH8CQAJAIAIQkQQiA0EBTg0AQQAhAwwBCwJAAkAgAQ0AIAEhAyABQQBHIQQMAQsgASEFIAMhBgNAIAYhASAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSABQX9qIQYgAyEDIAQhBCABQQFKDQALCyADIQFBACEDIARFDQAgASACKAJMIgNBA3RqQRhqQQAgAyABKAIQLwEISRshAwsCQCADIgMNACAAIAJB9AAQggEPCyAAIAMpAwA3AwALNgEBfwJAIAIoAkwiAyACKACkAUEkaigCAEEEdkkNACAAIAJB9QAQggEPCyAAIAIgASADEL0CC7oBAQN/IwBBIGsiAyQAIANBEGogAhCPBCADIAMpAxA3AwhBACEEAkAgAiADQQhqEJoDIgVBDEsNACAFQcD7AGotAAAhBAsCQAJAIAQiBA0AIABCADcDAAwBCyACIAQ2AkwgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAAXIiBBChAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyAAKQMAQgBSDQAgA0EYaiACQfoAEIIBCyADQSBqJAALgwEBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCTCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCCAUEAIQQLAkAgBCIERQ0AIAIgASgCrAEpAyA3AwAgAhCcA0UNACABKAKsAUIANwMgIAAgBDsBBAsgAkEQaiQAC6QBAQJ/IwBBMGsiAiQAIAJBKGogARCPBCACQSBqIAEQjwQgAiACKQMoNwMQAkACQAJAIAEgAkEQahCZAw0AIAIgAikDKDcDCCACQRhqIAFBDyACQQhqEIkDDAELIAEtAEINASABQQE6AEMgASgCrAEhAyACIAIpAyg3AwAgA0EAIAEgAhCYAxB1GgsgAkEwaiQADwtB+M0AQYg7QeoAQcwIEJkFAAtaAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQggFBACEECyAAIAEgBBD/AiACQRBqJAALewEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJMIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIIBQQAhBAsCQCAEIgRFDQAgACAEOwEECwJAIAAgARCAAw0AIAJBCGogAUHqABCCAQsgAkEQaiQACyEBAX8jAEEQayICJAAgAkEIaiABQesAEIIBIAJBEGokAAtGAQF/IwBBEGsiAiQAAkACQCAAIAEQgAMgAC8BBEF/akcNACABKAKsAUIANwMgDAELIAJBCGogAUHtABCCAQsgAkEQaiQAC10BAX8jAEEgayICJAAgAkEYaiABEI8EIAIgAikDGDcDCAJAAkAgAkEIahCcA0UNACACQRBqIAFBmDRBABCGAwwBCyACIAIpAxg3AwAgASACQQAQgwMLIAJBIGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARCPBAJAIAIpAwhQDQAgAiACKQMINwMAIAEgAkEBEIMDCyACQRBqJAALmAEBBH8jAEEQayICJAACQAJAIAEQkQQiA0EQSQ0AIAJBCGogAUHuABCCAQwBCwJAAkAgACgCECgCACABKAJMIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEIaiABQekAEIIBQQAhBQsgBSIARQ0AIAJBCGogACADEKADIAIgAikDCDcDACABIAJBARCDAwsgAkEQaiQACwkAIAFBBxCqAwuCAgEDfyMAQSBrIgMkACADQRhqIAIQjwQgAyADKQMYNwMAAkACQAJAAkAgAiADIANBEGogA0EMahC+AiIEQX9KDQAgACACQZMiQQAQhgMMAQsCQAJAIARB0IYDSA0AIARBsPl8aiIEQQAvAajTAU4NA0GQ6QAgBEEDdGotAANBCHENASAAIAJBmhpBABCGAwwCCyAEIAIoAKQBIgVBJGooAgBBBHZODQMgBSAFKAIgaiAEQQR0ai0AC0ECcQ0AIAAgAkGiGkEAEIYDDAELIAAgAykDGDcDAAsgA0EgaiQADwtB1RRBiDtBzQJBhwwQmQUAC0HL1gBBiDtB0gJBhwwQmQUAC1YBAn8jAEEgayIDJAAgA0EYaiACEI8EIANBEGogAhCPBCADIAMpAxg3AwggAiADQQhqEMgCIQQgAyADKQMQNwMAIAAgAiADIAQQygIQjwMgA0EgaiQACw0AIABBACkDiHI3AwALnQEBA38jAEEgayIDJAAgA0EYaiACEI8EIAJBGGoiBCADKQMYNwMAIANBGGogAhCPBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEJ0DIQILIAAgAhCPAyADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEI8EIAJBGGoiBCADKQMYNwMAIANBGGogAhCPBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEJ0DQQFzIQILIAAgAhCPAyADQSBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQjwQgASgCrAEgAikDCDcDICACQRBqJAALLgEBfwJAIAIoAkwiAyACKAKkAS8BDkkNACAAIAJBgAEQggEPCyAAIAIgAxCzAgs/AQF/AkAgAS0AQiICDQAgACABQewAEIIBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEJIDIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIIBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEJIDIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCCAQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQlAMNAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahDzAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahCJA0IAIQUMAQsCQCACQQFxRQ0AIAMgAykDODcDECABIANBEGoQlQMNACADIAMpAzg3AwggA0EwaiABQb0cIANBCGoQigNCACEFDAELIAMpAzghBQsgACAFNwMAIANBwABqJAALoAQBBX8CQCAEQfb/A08NACAAEJcEQQBBAToAwOQBQQAgASkAADcAweQBQQAgAUEFaiIFKQAANwDG5AFBACAEQQh0IARBgP4DcUEIdnI7Ac7kAUEAQQk6AMDkAUHA5AEQmAQCQCAERQ0AQQAhAANAAkAgBCAAIgZrIgBBECAAQRBJGyIHRQ0AIAMgBmohCEEAIQADQCAAIgBBwOQBaiIJIAktAAAgCCAAai0AAHM6AAAgAEEBaiIJIQAgCSAHRw0ACwtBwOQBEJgEIAZBEGoiCSEAIAkgBEkNAAsLIAJBACgCwOQBNgAAQQBBAToAwOQBQQAgASkAADcAweQBQQAgBSkAADcAxuQBQQBBADsBzuQBQcDkARCYBEEAIQADQCACIAAiAGoiCSAJLQAAIABBwOQBai0AAHM6AAAgAEEBaiIJIQAgCUEERw0ACwJAIARFDQAgAUEFaiEFQQAhAEEBIQkDQEEAQQE6AMDkAUEAIAEpAAA3AMHkAUEAIAUpAAA3AMbkAUEAIAkiBkEIdCAGQYD+A3FBCHZyOwHO5AFBwOQBEJgEAkAgBCAAIgJrIgBBECAAQRBJGyIHRQ0AIAMgAmohCEEAIQADQCAIIAAiAGoiCSAJLQAAIABBwOQBai0AAHM6AAAgAEEBaiIJIQAgCSAHRw0ACwsgAkEQaiIHIQAgBkEBaiEJIAcgBEkNAAsLEJkEDwtB5jxBMkH+DhCUBQALvwUBBn9BfyEFAkAgBEH1/wNLDQAgABCXBAJAAkAgBEUNACABQQVqIQZBACEAQQEhBwNAQQBBAToAwOQBQQAgASkAADcAweQBQQAgBikAADcAxuQBQQAgByIIQQh0IAhBgP4DcUEIdnI7Ac7kAUHA5AEQmAQCQCAEIAAiCWsiAEEQIABBEEkbIgVFDQAgAyAJaiEKQQAhAANAIAogACIAaiIHIActAAAgAEHA5AFqLQAAczoAACAAQQFqIgchACAHIAVHDQALCyAJQRBqIgUhACAIQQFqIQcgBSAESQ0AC0EAQQE6AMDkAUEAIAEpAAA3AMHkAUEAIAFBBWopAAA3AMbkAUEAQQk6AMDkAUEAIARBCHQgBEGA/gNxQQh2cjsBzuQBQcDkARCYBCAERQ0BQQAhAANAAkAgBCAAIghrIgBBECAAQRBJGyIFRQ0AIAMgCGohCkEAIQADQCAAIgBBwOQBaiIHIActAAAgCiAAai0AAHM6AAAgAEEBaiIHIQAgByAFRw0ACwtBwOQBEJgEIAhBEGoiByEAIAcgBEkNAAwCCwALQQBBAToAwOQBQQAgASkAADcAweQBQQAgAUEFaikAADcAxuQBQQBBCToAwOQBQQAgBEEIdCAEQYD+A3FBCHZyOwHO5AFBwOQBEJgEC0EAIQADQCACIAAiAGoiByAHLQAAIABBwOQBai0AAHM6AAAgAEEBaiIHIQAgB0EERw0AC0EAQQE6AMDkAUEAIAEpAAA3AMHkAUEAIAFBBWopAAA3AMbkAUEAQQA7Ac7kAUHA5AEQmARBACEAA0AgAiAAIgBqIgcgBy0AACAAQcDkAWotAABzOgAAIABBAWoiByEAIAdBBEcNAAsQmQRBACEAQQAhBwNAIAAiBUEBaiIKIQAgByACIAVqLQAAaiIFIQcgBSEFIApBBEcNAAsLIAUL3QMBCH9BACECA0AgACACIgNBAnQiAmogASACai0AADoAACAAIAJBAXIiBGogASAEai0AADoAACAAIAJBAnIiBGogASAEai0AADoAACAAIAJBA3IiAmogASACai0AADoAACADQQFqIgMhAiADQQhHDQALQQghAgNAIAIiA0ECdCIBIABqIgJBf2otAAAhBSACQX5qLQAAIQYgAkF9ai0AACEHIAJBfGotAAAhCAJAAkAgA0EHcSIERQ0AIAUhCSAGIQUgByEGIAghBwwBCyAIQdD7AGotAAAhCSAFQdD7AGotAAAhBSAGQdD7AGotAAAhBiADQQN2QdD9AGotAAAgB0HQ+wBqLQAAcyEHCyAHIQcgBiEGIAUhBSAJIQgCQAJAIARBBEYNACAIIQQgBSEFIAYhBiAHIQcMAQsgCEH/AXFB0PsAai0AACEEIAVB/wFxQdD7AGotAAAhBSAGQf8BcUHQ+wBqLQAAIQYgB0H/AXFB0PsAai0AACEHCyACIAJBYGotAAAgB3M6AAAgACABQQFyaiACQWFqLQAAIAZzOgAAIAAgAUECcmogAkFiai0AACAFczoAACAAIAFBA3JqIAJBY2otAAAgBHM6AAAgA0EBaiIBIQIgAUE8Rw0ACwvMBQEJf0EAIQIDQCACIgNBAnQhBEEAIQIDQCABIARqIAIiAmoiBSAFLQAAIAAgAiAEamotAABzOgAAIAJBAWoiBSECIAVBBEcNAAsgA0EBaiIEIQIgBEEERw0AC0EBIQIDQCACIQZBACECA0AgAiEFQQAhAgNAIAEgAiICQQJ0aiAFaiIEIAQtAABB0PsAai0AADoAACACQQFqIgQhAiAEQQRHDQALIAVBAWoiBCECIARBBEcNAAsgAS0AASECIAEgAS0ABToAASABLQAJIQQgASABLQANOgAJIAEgBDoABSABIAI6AA0gAS0AAiECIAEgAS0ACjoAAiABIAI6AAogAS0ABiECIAEgAS0ADjoABiABIAI6AA4gAS0AAyECIAEgAS0ADzoAAyABIAEtAAs6AA8gASABLQAHOgALIAEgAjoABwJAIAZBDkYNAEEAIQIDQCABIAIiB0ECdGoiAiACLQADIgQgAi0AACIFcyIDQQF0IAPAQQd2QRtxcyAEcyAEIAItAAIiA3MiCCACLQABIgkgBXMiCnMiBHM6AAMgAiADIAhBAXQgCMBBB3ZBG3FzcyAEczoAAiACIAkgAyAJcyIDQQF0IAPAQQd2QRtxc3MgBHM6AAEgAiAFIApBAXQgCsBBB3ZBG3FzcyAEczoAACAHQQFqIgQhAiAEQQRHDQALIAZBBHQhCUEAIQIDQCACIghBAnQiBSAJaiEDQQAhAgNAIAEgBWogAiICaiIEIAQtAAAgACADIAJqai0AAHM6AAAgAkEBaiIEIQIgBEEERw0ACyAIQQFqIgQhAiAEQQRHDQALIAZBAWohAgwBCwtBACECA0AgAiIIQQJ0IgVB4AFqIQNBACECA0AgASAFaiACIgJqIgQgBC0AACAAIAMgAmpqLQAAczoAACACQQFqIgQhAiAEQQRHDQALIAhBAWoiBCECIARBBEcNAAsLCwBB0OQBIAAQlQQLCwBB0OQBIAAQlgQLDwBB0OQBQQBB8AEQuAUaC80BAQV/IwBBEGsiBCQAQQAhBUEAIQYDQCAFIAMgBiIGai0AAGoiByEFIAZBAWoiCCEGIAhBIEcNAAsCQCAHDQBB79oAQQAQPEGfPUEwQfsLEJQFAAtBACADKQAANwDA5gFBACADQRhqKQAANwDY5gFBACADQRBqKQAANwDQ5gFBACADQQhqKQAANwDI5gFBAEEBOgCA5wFB4OYBQRAQKSAEQeDmAUEQEKAFNgIAIAAgASACQc8VIAQQnwUiBRBDIQYgBRAiIARBEGokACAGC9cCAQR/IwBBEGsiBCQAAkACQAJAECMNAAJAIAANACACRQ0AQX8hBQwDCwJAIABBAEdBAC0AgOcBIgZBAkZxRQ0AQX8hBQwDC0F/IQUgAEUgBkEDRnENAiADIAFqIgZBBGoiBxAhIQUCQCAARQ0AIAUgACABELYFGgsCQCACRQ0AIAUgAWogAiADELYFGgtBwOYBQeDmASAFIAZqIAUgBhCTBCAFIAcQQiEAIAUQIiAADQFBDCECA0ACQCACIgBB4OYBaiIFLQAAIgJB/wFGDQAgAEHg5gFqIAJBAWo6AABBACEFDAQLIAVBADoAACAAQX9qIQJBACEFIAANAAwDCwALQZ89QacBQc0uEJQFAAsgBEH7GTYCAEG9GCAEEDwCQEEALQCA5wFB/wFHDQAgACEFDAELQQBB/wE6AIDnAUEDQfsZQQkQnwQQSCAAIQULIARBEGokACAFC90GAgJ/AX4jAEGQAWsiAyQAAkAQIw0AAkACQAJAAkAgAEF+ag4DAQIAAwsCQAJAAkBBAC0AgOcBQX9qDgMAAQIFCyADIAI2AkBB9tQAIANBwABqEDwCQCACQRdLDQAgA0HqIDYCAEG9GCADEDxBAC0AgOcBQf8BRg0FQQBB/wE6AIDnAUEDQeogQQsQnwQQSAwFCyADQfgAakEQaiABQRBqKQAANwMAIANB+ABqQQhqIAFBCGopAAA3AwAgAyABKQAAIgU3A3gCQCAFp0HK0ZD3fEYNACADQek4NgIwQb0YIANBMGoQPEEALQCA5wFB/wFGDQVBAEH/AToAgOcBQQNB6ThBCRCfBBBIDAULAkAgAygCfEECRg0AIANBvyI2AiBBvRggA0EgahA8QQAtAIDnAUH/AUYNBUEAQf8BOgCA5wFBA0G/IkELEJ8EEEgMBQtBAEEAQcDmAUEgQeDmAUEQIANBgAFqQRBBwOYBEPECQQBCADcA4OYBQQBCADcA8OYBQQBCADcA6OYBQQBCADcA+OYBQQBBAjoAgOcBQQBBAToA4OYBQQBBAjoA8OYBAkBBAEEgQQBBABCbBEUNACADQcslNgIQQb0YIANBEGoQPEEALQCA5wFB/wFGDQVBAEH/AToAgOcBQQNByyVBDxCfBBBIDAULQbslQQAQPAwECyADIAI2AnBBldUAIANB8ABqEDwCQCACQSNLDQAgA0GTDjYCUEG9GCADQdAAahA8QQAtAIDnAUH/AUYNBEEAQf8BOgCA5wFBA0GTDkEOEJ8EEEgMBAsgASACEJ0EDQNBACEAAkACQCABLQAADQBBACECA0AgAiIEQQFqIgBBIEYNAiAAIQIgASAAai0AAEUNAAsgBEEeSyEACyAAIQAgA0HpzAA2AmBBvRggA0HgAGoQPAJAQQAtAIDnAUH/AUYNAEEAQf8BOgCA5wFBA0HpzABBChCfBBBICyAARQ0EC0EAQQM6AIDnAUEBQQBBABCfBAwDCyABIAIQnQQNAkEEIAEgAkF8ahCfBAwCCwJAQQAtAIDnAUH/AUYNAEEAQQQ6AIDnAQtBAiABIAIQnwQMAQtBAEH/AToAgOcBEEhBAyABIAIQnwQLIANBkAFqJAAPC0GfPUHAAUGHEBCUBQAL/gEBA38jAEEgayICJAACQAJAAkAgAUEESw0AIAJB1CY2AgBBvRggAhA8QdQmIQFBAC0AgOcBQf8BRw0BQX8hAQwCC0HA5gFB8OYBIAAgAUF8aiIBaiAAIAEQlAQhA0EMIQACQANAAkAgACIBQfDmAWoiAC0AACIEQf8BRg0AIAFB8OYBaiAEQQFqOgAADAILIABBADoAACABQX9qIQAgAQ0ACwsCQCADDQBBACEBDAILIAJBxRo2AhBBvRggAkEQahA8QcUaIQFBAC0AgOcBQf8BRw0AQX8hAQwBC0EAQf8BOgCA5wFBAyABQQkQnwQQSEF/IQELIAJBIGokACABCzQBAX8CQBAjDQACQEEALQCA5wEiAEEERg0AIABB/wFGDQAQSAsPC0GfPUHaAUHhKxCUBQAL+QgBBH8jAEGAAmsiAyQAQQAoAoTnASEEAkACQAJAAkACQCAAQX9qDgQAAgMBBAsgAyAEKAI4NgIQQfkWIANBEGoQPCAEQYACOwEQIARBACgCjN0BIgBBgICACGo2AjQgBCAAQYCAgBBqNgIoIAQvAQZBAUYNAyADQYXLADYCBCADQQE2AgBBs9UAIAMQPCAEQQE7AQYgBEEDIARBBmpBAhClBQwDCyAEQQAoAozdASIAQYCAgAhqNgI0IAQgAEGAgIAQajYCKAJAIAJFDQAgAyABLQAAIgA6AP8BIAJBf2ohBSABQQFqIQYCQAJAAkACQAJAAkACQAJAAkAgAEHwfmoOCgIDDAQFBgcBCAAICyABLQADQQxqIgQgBUsNCCAGIAQQogUiBBCrBRogBBAiDAsLIAVFDQcgAS0AASABQQJqIAJBfmoQVwwKCyAELwEQIQIgBCABLQACQQh0IAEtAAEiAHI7ARACQCAAQQFxRQ0AIAQoAmQNACAEQYAIEO8ENgJkCwJAIAQtABBBAnFFDQAgAkECcQ0AIAQQ0AQ2AhgLIARBACgCjN0BQYCAgAhqNgIUIAMgBC8BEDYCYEGFCyADQeAAahA8DAkLIAMgADoA0AEgBC8BBkEBRw0IAkAgAEHlAGpB/wFxQf0BSw0AIAMgADYCcEGGCiADQfAAahA8CyADQdABakEBQQBBABCbBA0IIAQoAgwiAEUNCCAEQQAoAojwASAAajYCMAwICyADQdABahBsGkEAKAKE5wEiBC8BBkEBRw0HAkAgAy0A/wEiAEHlAGpB/wFxQf0BSw0AIAMgADYCgAFBhgogA0GAAWoQPAsgA0H/AWpBASADQdABakEgEJsEDQcgBCgCDCIARQ0HIARBACgCiPABIABqNgIwDAcLIAAgASAGIAUQtwUoAgAQahCgBAwGCyAAIAEgBiAFELcFIAUQaxCgBAwFC0GWAUEAQQAQaxCgBAwECyADIAA2AlBB7gogA0HQAGoQPCADQf8BOgDQAUEAKAKE5wEiBC8BBkEBRw0DIANB/wE2AkBBhgogA0HAAGoQPCADQdABakEBQQBBABCbBA0DIAQoAgwiAEUNAyAEQQAoAojwASAAajYCMAwDCyADIAI2AjBBvDcgA0EwahA8IANB/wE6ANABQQAoAoTnASIELwEGQQFHDQIgA0H/ATYCIEGGCiADQSBqEDwgA0HQAWpBAUEAQQAQmwQNAiAEKAIMIgBFDQIgBEEAKAKI8AEgAGo2AjAMAgsgAyAEKAI4NgKgAUHPMyADQaABahA8IAQgBEERai0AAEEIdDsBECAELwEGQQJGDQEgA0GCywA2ApQBIANBAjYCkAFBs9UAIANBkAFqEDwgBEECOwEGIARBAyAEQQZqQQIQpQUMAQsgAyABIAIQnQI2AsABQdwVIANBwAFqEDwgBC8BBkECRg0AIANBgssANgK0ASADQQI2ArABQbPVACADQbABahA8IARBAjsBBiAEQQMgBEEGakECEKUFCyADQYACaiQAC+sBAQF/IwBBMGsiAiQAAkACQCABDQAgAiAAOgAuQQAoAoTnASIBLwEGQQFHDQECQCAAQeUAakH/AXFB/QFLDQAgAiAAQf8BcTYCAEGGCiACEDwLIAJBLmpBAUEAQQAQmwQNASABKAIMIgBFDQEgAUEAKAKI8AEgAGo2AjAMAQsgAiAANgIgQe4JIAJBIGoQPCACQf8BOgAvQQAoAoTnASIALwEGQQFHDQAgAkH/ATYCEEGGCiACQRBqEDwgAkEvakEBQQBBABCbBA0AIAAoAgwiAUUNACAAQQAoAojwASABajYCMAsgAkEwaiQAC8kFAQd/IwBBEGsiASQAAkACQCAAKAIMRQ0AQQAoAojwASAAKAIwa0EATg0BCwJAIABBFGpBgICACBCWBUUNACAALQAQRQ0AQekzQQAQPCAAIABBEWotAABBCHQ7ARALAkAgAC0AEEECcUUNAEEAKALE5wEgACgCHEYNACABIAAoAhg2AggCQCAAKAIgDQAgAEGAAhAhNgIgCyAAKAIgQYACIAFBCGoQ0QQhAkEAKALE5wEhAyACRQ0AIAEoAgghBCAAKAIgIQUgAUGaAToADUGcfyEGAkBBACgChOcBIgcvAQZBAUcNACABQQ1qQQEgBSACEJsEIgIhBiACDQACQCAHKAIMIgINAEEAIQYMAQsgB0EAKAKI8AEgAmo2AjBBACEGCyAGDQAgACABKAIINgIYIAMgBEcNACAAQQAoAsTnATYCHAsCQCAAKAJkRQ0AIAAoAmQQ7QQiAkUNACACIQIDQCACIQICQCAALQAQQQFxRQ0AIAItAAIhAyABQZkBOgAOQZx/IQYCQEEAKAKE5wEiBS8BBkEBRw0AIAFBDmpBASACIANBDGoQmwQiAiEGIAINAAJAIAUoAgwiAg0AQQAhBgwBCyAFQQAoAojwASACajYCMEEAIQYLIAYNAgsgACgCZBDuBCAAKAJkEO0EIgYhAiAGDQALCwJAIABBNGpBgICAAhCWBUUNACABQZIBOgAPQQAoAoTnASICLwEGQQFHDQAgAUGSATYCAEGGCiABEDwgAUEPakEBQQBBABCbBA0AIAIoAgwiBkUNACACQQAoAojwASAGajYCMAsCQCAAQSRqQYCAIBCWBUUNAEGbBCECAkAQogRFDQAgAC8BBkECdEHg/QBqKAIAIQILIAIQHwsCQCAAQShqQYCAIBCWBUUNACAAEKMECyAAQSxqIAAoAggQlQUaIAFBEGokAA8LQdwRQQAQPBA1AAsEAEEBC5UCAQR/IwBBMGsiASQAIABBBmohAgJAAkACQCAALwEGQX5qDgMCAAEACyABQazJADYCJCABQQQ2AiBBs9UAIAFBIGoQPCAAQQQ7AQYgAEEDIAJBAhClBQsQngQLAkAgACgCOEUNABCiBEUNACAAKAI4IQMgAC8BYCEEIAEgACgCPDYCGCABIAQ2AhQgASADNgIQQZAWIAFBEGoQPCAAKAI4IAAvAWAgACgCPCAAQcAAahCaBA0AAkAgAi8BAEEDRg0AIAFBr8kANgIEIAFBAzYCAEGz1QAgARA8IABBAzsBBiAAQQMgAkECEKUFCyAAQQAoAozdASICQYCAgAhqNgI0IAAgAkGAgIAQajYCKAsgAUEwaiQAC/0CAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0H/fmoOBgIDBwcHAQALIANBgF1qDgQDBQYEBgsgACABQRBqIAEtAAxBARClBAwGCyAAEKMEDAULAkACQCAALwEGQX5qDgMGAAEACyACQazJADYCBCACQQQ2AgBBs9UAIAIQPCAAQQQ7AQYgAEEDIABBBmpBAhClBQsQngQMBAsgASAAKAI4EPMEGgwDCyABQcTIABDzBBoMAgsCQAJAIAAoAjwiAA0AQQAhAAwBCyAAQQBBBiAAQcHTAEEGENAFG2ohAAsgASAAEPMEGgwBCyAAIAFB9P0AEPYEQX5xQYABRw0AAkAgACgCCEHnB0sNACAAQegHNgIICwJAIAAoAghBgbiZKUkNACAAQYC4mSk2AggLIAAoAgwiAUUNAAJAIAEgACgCCEEDbCIDTw0AIAAgAzYCDAsgACgCDCIBRQ0AIABBACgCiPABIAFqNgIwCyACQRBqJAALpwQBB38jAEEwayIEJAACQAJAIAINAEG9J0EAEDwgACgCOBAiIAAoAjwQIiAAQgA3AjggAEHQADsBYCAAQcAAakIANwIAIABByABqQgA3AgAgAEHQAGpCADcCACAAQdgAakIANwIAAkAgA0UNAEHcGUEAEOYCGgsgABCjBAwBCwJAAkAgAkEBahAhIAEgAhC2BSIFEOUFQcYASQ0AIAVByNMAQQUQ0AUNACAFQQVqIgZBwAAQ4gUhByAGQToQ4gUhCCAHQToQ4gUhCSAHQS8Q4gUhCiAHRQ0AIApFDQACQCAJRQ0AIAcgCU8NASAJIApPDQELAkACQEEAIAggCCAHSxsiCA0AIAYhBgwBCyAGQavLAEEFENAFDQEgCEEBaiEGCyAHIAYiBmtBwABHDQAgB0EAOgAAIARBEGogBhCYBUEgRw0AQdAAIQYCQCAJRQ0AIAlBADoAACAJQQFqEJoFIgkhBiAJQYCAfGpBgoB8SQ0BCyAKQQA6AAAgB0EBahChBSEHIApBLzoAACAKEKEFIQkgABCmBCAAIAY7AWAgACAJNgI8IAAgBzYCOCAAIAQpAxA3AkAgAEHIAGogBCkDGDcCACAAQdAAaiAEQSBqKQMANwIAIABB2ABqIARBKGopAwA3AgACQCADRQ0AQdwZIAUgASACELYFEOYCGgsgABCjBAwBCyAEIAE2AgBB1hggBBA8QQAQIkEAECILIAUQIgsgBEEwaiQAC0sAIAAoAjgQIiAAKAI8ECIgAEIANwI4IABB0AA7AWAgAEHAAGpCADcCACAAQcgAakIANwIAIABB0ABqQgA3AgAgAEHYAGpCADcCAAtDAQJ/QYD+ABD8BCIAQYgnNgIIIABBAjsBBgJAQdwZEOUCIgFFDQAgACABIAEQ5QVBABClBCABECILQQAgADYChOcBC6QBAQR/IwBBEGsiBCQAIAEQ5QUiBUEDaiIGECEiByAAOgABIAdBmAE6AAAgB0ECaiABIAUQtgUaQZx/IQECQEEAKAKE5wEiAC8BBkEBRw0AIARBmAE2AgBBhgogBBA8IAcgBiACIAMQmwQiBSEBIAUNAAJAIAAoAgwiAQ0AQQAhAQwBCyAAQQAoAojwASABajYCMEEAIQELIAcQIiAEQRBqJAAgAQsPAEEAKAKE5wEvAQZBAUYLlQIBCH8jAEEQayIBJAACQEEAKAKE5wEiAkUNACACQRFqLQAAQQFxRQ0AIAIvAQZBAUcNACABENAENgIIAkAgAigCIA0AIAJBgAIQITYCIAsDQCACKAIgQYACIAFBCGoQ0QQhA0EAKALE5wEhBEECIQUCQCADRQ0AIAEoAgghBiACKAIgIQcgAUGbAToAD0GcfyEFAkBBACgChOcBIggvAQZBAUcNACABQZsBNgIAQYYKIAEQPCABQQ9qQQEgByADEJsEIgMhBSADDQACQCAIKAIMIgUNAEEAIQUMAQsgCEEAKAKI8AEgBWo2AjBBACEFC0ECIAQgBkZBAXQgBRshBQsgBUUNAAtBljVBABA8CyABQRBqJAALUAECfyMAQRBrIgEkAEEAIQICQCAALwEOQYEjRw0AIAFBACgChOcBKAI4NgIAIABBg9oAIAEQnwUiAhDzBBogAhAiQQEhAgsgAUEQaiQAIAILDQAgACgCBBDlBUENagtrAgN/AX4gACgCBBDlBUENahAhIQECQCAAKAIQIgJFDQAgAkEAIAItAAQiA2tBDGxqQWRqKQMAIQQgASADOgAMIAEgBDcDAAsgASAAKAIINgIIIAAoAgQhACABQQ1qIAAgABDlBRC2BRogAQuCAwIGfwF+AkACQCAAKAKgAiIBRQ0AIABBGGohAiABIQEDQAJAIAIgASIDKAIEEOUFQQ1qIgQQ6QQiAUUNACABQQFGDQIgAEEANgKgAiACEOsEGgwCCyADKAIEEOUFQQ1qECEhAQJAIAMoAhAiBUUNACAFQQAgBS0ABCIGa0EMbGpBZGopAwAhByABIAY6AAwgASAHNwMACyABIAMoAgg2AgggAygCBCEFIAFBDWogBSAFEOUFELYFGiACIAEgBBDqBA0CIAEQIiADKAIAIgEhAyABIQUCQCABRQ0AA0ACQCADIgEtAAxBAXENACABIQUMAgsgASgCACIBIQMgASEFIAENAAsLIAAgBSIBNgKgAgJAIAENACACEOsEGgsgACgCoAIiAyEBIAMNAAsLAkAgAEEQakGg6DsQlgVFDQAgABCvBAsCQCAAQRRqQdCGAxCWBUUNACAALQAIRQ0AIABBADoACCAAQQNBAEEAEKUFCw8LQe/NAEHuO0GSAUG0FBCZBQAL7gMBCX8jAEEgayIBJAACQAJAAkAgAC0ABkUNACAALQAJDQEgAEEBOgAJAkAgACgCDCICRQ0AIAIhAgNAAkAgAiIDKAIQDQBBlOcBIQICQANAAkAgAigCACICDQBBCSEEDAILQQEhBQJAAkAgAi0AEEEBSw0AQQwhBAwBCwNAAkACQCACIAUiBkEMbGoiB0EkaiIIKAIAIAMoAghGDQBBASEFQQAhBAwBC0EBIQVBACEEIAdBKWoiCS0AAEEBcQ0AAkACQCADKAIQIgUgCEcNAEEAIQUMAQsCQCAFRQ0AIAUgBS0ABUH+AXE6AAULIAkgCS0AAEEBcjoAACABQRtqIAhBACAHQShqIgUtAABrQQxsakFkaikDABCeBSADKAIEIQQgASAFLQAANgIIIAEgBDYCACABIAFBG2o2AgRB6TUgARA8IAMgCDYCECAAQQE6AAggAxC5BEEAIQULQQ8hBAsgBCEEIAVFDQEgBkEBaiIEIQUgBCACLQAQSQ0AC0EMIQQLIAIhAiAEIgUhBCAFQQxGDQALCyAEQXdqDgcAAgICAgIAAgsgAygCACIFIQIgBQ0ACwsgAC0ACUUNAiAAQQA6AAkLIAFBIGokAA8LQcU0Qe47Qc4AQcEwEJkFAAtBxjRB7jtB4ABBwTAQmQUAC6QFAgZ/AX4jAEHAAGsiAiQAAkAgAC0ACQ0AAkACQAJAAkACQCABLwEOQf9+ag4EAQMCAAMLIAAoAgwiA0UNAyADIQMDQAJAIAMiAygCECIERQ0AIAQgBC0ABUH+AXE6AAUgAiADKAIENgIAQe4XIAIQPCADQQA2AhAgAEEBOgAIIAMQuQQLIAMoAgAiBCEDIAQNAAwECwALIAFBGWohBSABLQAMQXBqIQYgAEEMaiEEA0AgBCgCACIDRQ0DIAMhBCADKAIEIgcgBSAGENAFDQALAkAgASkDECIIQgBSDQAgAygCECIERQ0DIAQgBC0ABUH+AXE6AAUgAiAHNgIQQe4XIAJBEGoQPCADQQA2AhAgAEEBOgAIIAMQuQQMAwsCQAJAIAgQugQiBQ0AQQAhBAwBC0EAIQQgBS0AECABLQAYIgZNDQAgBSAGQQxsakEkaiEECyAEIgRFDQIgAygCECIFIARGDQICQCAFRQ0AIAUgBS0ABUH+AXE6AAULIAQgBC0ABUEBcjoABSACQTtqIARBACAELQAEa0EMbGpBZGopAwAQngUgAygCBCEFIAIgBC0ABDYCKCACIAU2AiAgAiACQTtqNgIkQek1IAJBIGoQPCADIAQ2AhAgAEEBOgAIIAMQuQQMAgsgAEEYaiIGIAEQ5AQNAQJAAkAgACgCDCIDDQAgAyEFDAELIAMhBANAAkAgBCIDLQAMQQFxDQAgAyEFDAILIAMoAgAiAyEEIAMhBSADDQALCyAAIAUiAzYCoAIgAw0BIAYQ6wQaDAELIABBAToAByAAQQxqIQQCQANAIAQoAgAiA0UNASADIQQgAygCEA0ACyAAQQA6AAcLIAAgAUGk/gAQ9gQaCyACQcAAaiQADwtBxTRB7jtBuAFBqRIQmQUACywBAX9BAEGw/gAQ/AQiADYCiOcBIABBAToABiAAQQAoAozdAUGg6DtqNgIQC9cBAQR/IwBBEGsiASQAAkACQEEAKAKI5wEiAi0ACQ0AIAJBAToACQJAIAIoAgwiA0UNACADIQMDQAJAIAMiBCgCECIDRQ0AIANBACADLQAEa0EMbGpBXGogAEcNACADIAMtAAVB/gFxOgAFIAEgBCgCBDYCAEHuFyABEDwgBEEANgIQIAJBAToACCAEELkECyAEKAIAIgQhAyAEDQALCyACLQAJRQ0BIAJBADoACSABQRBqJAAPC0HFNEHuO0HhAUGIMhCZBQALQcY0Qe47QecBQYgyEJkFAAuqAgEGfwJAAkACQAJAAkBBACgCiOcBIgJFDQAgABDlBSEDIAJBDGoiBCEFAkADQCAFKAIAIgZFDQEgBiEFIAYoAgQgACADENAFDQALIAYNAgsgAi0ACQ0CAkAgAigCoAJFDQAgAkEANgKgAiACQRhqEOsEGgtBFBAhIgcgATYCCCAHIAA2AgQgBCgCACIGRQ0DIAAgBigCBBDkBUEASA0DIAYhBQNAAkAgBSIDKAIAIgYNACAGIQEgAyEDDAYLIAYhBSAGIQEgAyEDIAAgBigCBBDkBUF/Sg0ADAULAAtB7jtB9QFBtTgQlAUAC0HuO0H4AUG1OBCUBQALQcU0Qe47QesBQfsNEJkFAAsgBiEBIAQhAwsgByABNgIAIAMgBzYCACACQQE6AAggBwvSAgEEfyMAQRBrIgAkAAJAAkACQEEAKAKI5wEiAS0ACQ0AAkAgASgCoAJFDQAgAUEANgKgAiABQRhqEOsEGgsgAS0ACQ0BIAFBAToACQJAIAEoAgwiAkUNACACIQIDQAJAIAIiAigCECIDRQ0AIAMgAy0ABUH+AXE6AAUgACACKAIENgIAQe4XIAAQPCACQQA2AhAgAUEBOgAIIAIQuQQLIAIoAgAiAyECIAMNAAsLIAEtAAlFDQIgAUEAOgAJAkAgASgCDCICRQ0AIAIhAgNAAkAgAiICKAIQIgNFDQAgAyADLQAFQf4BcToABQsgASACKAIANgIMIAJBADYCBCACECIgASgCDCIDIQIgAw0ACwsgAUEBOgAIIABBEGokAA8LQcU0Qe47QesBQfsNEJkFAAtBxTRB7jtBsgJBuSQQmQUAC0HGNEHuO0G1AkG5JBCZBQALDABBACgCiOcBEK8EC9ABAQJ/IwBBwABrIgMkAAJAAkACQAJAAkAgAEF/ag4gAAECBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAMECyADIAFBFGo2AhBBwBkgA0EQahA8DAMLIAMgAUEUajYCIEGrGSADQSBqEDwMAgsgAyABQRRqNgIwQaMYIANBMGoQPAwBCyABLQAEIQAgAi8BBCEEIAMgAi0ABzYCDCADIAQ2AgggAyAANgIEIAMgAUEAIABrQQxsakFwajYCAEGJwwAgAxA8CyADQcAAaiQACzEBAn9BDBAhIQJBACgCjOcBIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgKM5wELkwEBAn8CQAJAQQAtAJDnAUUNAEEAQQA6AJDnASAAIAEgAhC2BAJAQQAoAoznASIDRQ0AIAMhAwNAIAMiAygCCCAAIAEgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAJDnAQ0BQQBBAToAkOcBDwtBpcwAQck9QeMAQfIPEJkFAAtBjM4AQck9QekAQfIPEJkFAAuaAQEDfwJAAkBBAC0AkOcBDQBBAEEBOgCQ5wEgACgCECEBQQBBADoAkOcBAkBBACgCjOcBIgJFDQAgAiECA0AgAiICKAIIQcAAIAEgACACKAIEEQUAIAIoAgAiAyECIAMNAAsLQQAtAJDnAQ0BQQBBADoAkOcBDwtBjM4AQck9Qe0AQe00EJkFAAtBjM4AQck9QekAQfIPEJkFAAswAQN/QZTnASEBA0ACQCABKAIAIgINAEEADwsgAiEBIAIhAyACKQMIIABSDQALIAMLWQEEfwJAIAAtABAiAg0AQQAPCyAAQSRqIQNBACEEA0ACQCADIAQiBEEMbGooAgAgAUcNACAAIARBDGxqQSRqQQAgABsPCyAEQQFqIgUhBCAFIAJHDQALQQALYgICfwF+IANBEGoQISIEQQE6AAMgAEEAIAAtAAQiBWtBDGxqQWRqKQMAIQYgBCABOwEOIAQgBToADSAEIAY3AgQgBCADOgAMIARBEGogAiADELYFGiAEEPUEIQMgBBAiIAML2wIBAn8CQAJAAkBBAC0AkOcBDQBBAEEBOgCQ5wECQEGY5wFB4KcSEJYFRQ0AAkBBACgClOcBIgBFDQAgACEAA0BBACgCjN0BIAAiACgCHGtBAEgNAUEAIAAoAgA2ApTnASAAEL4EQQAoApTnASIBIQAgAQ0ACwtBACgClOcBIgBFDQAgACEAA0AgACIBKAIAIgBFDQECQEEAKAKM3QEgACgCHGtBAEgNACABIAAoAgA2AgAgABC+BAsgASgCACIBIQAgAQ0ACwtBAC0AkOcBRQ0BQQBBADoAkOcBAkBBACgCjOcBIgBFDQAgACEAA0AgACIAKAIIQTBBAEEAIAAoAgQRBQAgACgCACIBIQAgAQ0ACwtBAC0AkOcBDQJBAEEAOgCQ5wEPC0GMzgBByT1BlAJBohQQmQUAC0GlzABByT1B4wBB8g8QmQUAC0GMzgBByT1B6QBB8g8QmQUAC5wCAQN/IwBBEGsiASQAAkACQAJAQQAtAJDnAUUNAEEAQQA6AJDnASAAELIEQQAtAJDnAQ0BIAEgAEEUajYCAEEAQQA6AJDnAUGrGSABEDwCQEEAKAKM5wEiAkUNACACIQIDQCACIgIoAghBAiAAQQAgAigCBBEFACACKAIAIgMhAiADDQALC0EALQCQ5wENAkEAQQE6AJDnAQJAIAAoAgQiAkUNACACIQIDQCAAIAIiAigCACIDNgIEAkAgAi0AB0EFSQ0AIAIoAgwQIgsgAhAiIAMhAiADDQALCyAAECIgAUEQaiQADwtBpcwAQck9QbABQe0uEJkFAAtBjM4AQck9QbIBQe0uEJkFAAtBjM4AQck9QekAQfIPEJkFAAuVDgIKfwF+IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEALQCQ5wENAEEAQQE6AJDnAQJAIAAtAAMiAkEEcUUNAEEAQQA6AJDnAQJAQQAoAoznASIDRQ0AIAMhAwNAIAMiAygCCEESQQAgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAJDnAUUNCEGMzgBByT1B6QBB8g8QmQUACyAAKQIEIQtBlOcBIQQCQANAAkAgBCgCACIDDQBBACEFDAILIAMhBCADIQUgAykDCCALUg0ACwtBACEEAkAgBSIDRQ0AIAMgAC0ADUE/cSIEQQxsakEkakEAIAQgAy0AEEkbIQQLIAQhBQJAIAJBAXFFDQBBECEEIAUhAiADIQMMBwsgAC0ADQ0EIAAvAQ4NBCADIQQCQCADDQAgABDABCEECwJAIAQiAy8BEiIFIAAvARAiBEYNAAJAIAVBD3EgBEEPcU0NAEEDIAMgABC4BEEAKAKU5wEiBCADRg0DIAQhBANAIAQiBUUNBSAFKAIAIgIhBCACIANHDQALIAUgAygCADYCAAwECyADIAQ7ARILIAMhAwwDC0GMzgBByT1BvgJBkRIQmQUAC0EAIAMoAgA2ApTnAQsgAxC+BCAAEMAEIQMLIAMiA0EAKAKM3QFBgIn6AGo2AhwgA0EkaiEEIAMhAwwBCyAFIQQgAyEDCyADIQYCQAJAIAQiBQ0AQRAhBEEAIQIMAQsCQAJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgRBf2ogBi0AESIDIANB/wFGG0EBaiIDa0H/AHEiAkUNAAJAIAMgBGtB/ABxQTxPDQBBEyEDDAMLQRMhAyACQQVJDQILIAYgBDoAEQtBECEDCyADIQcCQAJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiA0GA4ANxQYAgRw0CAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAiACLAAGIgNBAEgNAiACIANBgAFyOgAGQQAtAJDnAUUNBkEAQQA6AJDnAQJAQQAoAoznASIDRQ0AIAMhAwNAIAMiAygCCEEhIAUgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAJDnAUUNAUGMzgBByT1B6QBB8g8QmQUACyAALwEOIgNBgOADcUGAIEcNAQJAAkAgBUEAIAUtAAQiCWtBDGxqQWBqKAIAIgRFDQAgA0H/H3EhAiAEIQMDQAJAIAIgAyIDLwEERw0AIAMtAAZBP3EgCUcNACADIQMMAwsgAygCACIEIQMgBA0ACwtBACEDCyADIgJFDQECQAJAIAItAAciAyAIRw0AIAMhBCACQQxqIQkgAEEQaiEKAkACQCADQQVPDQAgCSEJDAELIAkoAgAhCQsgCiAJIAQQ0AUNAEEBIQQMAQtBACEECyAEIQQCQCAIQQVJDQAgAyAIRg0AAkAgA0EFSQ0AIAIoAgwQIgsgAiAALQAMECE2AgwLIAIgAC0ADCIDOgAHIAJBDGohCQJAAkAgA0EFTw0AIAkhCQwBCyAJKAIAIQkLIAkgAEEQaiADELYFGiAEDQFBAC0AkOcBRQ0GQQBBADoAkOcBIAUtAAQhAyACLwEEIQQgASACLQAHNgIMIAEgBDYCCCABIAM2AgQgASAFQQAgA2tBDGxqQXBqNgIAQYnDACABEDwCQEEAKAKM5wEiA0UNACADIQMDQCADIgMoAghBICAFIAIgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQCQ5wENBwtBAEEBOgCQ5wELIAchBCAFIQILIAYhAwsgAyEGIAQhBUEALQCQ5wEhAwJAIAIiAkUNACADQQFxRQ0FQQBBADoAkOcBIAUgAiAAELYEAkBBACgCjOcBIgNFDQAgAyEDA0AgAyIDKAIIIAUgAiAAIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0AkOcBRQ0BQYzOAEHJPUHpAEHyDxCZBQALIANBAXFFDQVBAEEAOgCQ5wECQEEAKAKM5wEiA0UNACADIQMDQCADIgMoAghBESAGIAAgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQCQ5wENBgtBAEEAOgCQ5wEgAUEQaiQADwtBpcwAQck9QeMAQfIPEJkFAAtBpcwAQck9QeMAQfIPEJkFAAtBjM4AQck9QekAQfIPEJkFAAtBpcwAQck9QeMAQfIPEJkFAAtBpcwAQck9QeMAQfIPEJkFAAtBjM4AQck9QekAQfIPEJkFAAuRBAIIfwF+IwBBEGsiASQAIAAtAAwiAkECdiIDQQxsQShqECEiBCADOgAQIAQgACkCBCIJNwMIQQAoAozdASEFIARB/wE6ABEgBCAFQYCJ+gBqNgIcIARBFGoiBiAJEJ4FIAQgACgCEDsBEgJAIAJBBEkNACAAQRBqIQcgA0EBIANBAUsbIQhBACEDA0ACQAJAIAMiAw0AQQAhAgwBCyAHIANBAnRqKAIAIQILIAQgA0EMbGoiBUEoaiADOgAAIAVBJGogAjYCACADQQFqIgIhAyACIAhHDQALCwJAAkBBACgClOcBIgNFDQAgBEEIaiICKQMAEIwFUQ0AIAIgA0EIakEIENAFQQBIDQBBlOcBIQUDQCAFKAIAIgNFDQICQCADKAIAIghFDQAgAikDABCMBVENACADIQUgAiAIQQhqQQgQ0AVBf0oNAQsLIAQgAygCADYCACADIAQ2AgAMAQsgBEEAKAKU5wE2AgBBACAENgKU5wELAkACQEEALQCQ5wFFDQAgASAGNgIAQQBBADoAkOcBQcAZIAEQPAJAQQAoAoznASIDRQ0AIAMhAwNAIAMiAygCCEEBIAQgACADKAIEEQUAIAMoAgAiAiEDIAINAAsLQQAtAJDnAQ0BQQBBAToAkOcBIAFBEGokACAEDwtBpcwAQck9QeMAQfIPEJkFAAtBjM4AQck9QekAQfIPEJkFAAsCAAuZAgEFfyMAQSBrIgIkAAJAAkAgAS8BDiIDQYB/aiIEQQRLDQBBASAEdEETcUUNACACQQFyIAFBEGoiBSABLQAMIgRBDyAEQQ9JGyIGELYFIQAgAkE6OgAAIAYgAnJBAWpBADoAACAAEOUFIgZBDkoNAQJAAkACQCADQYB/ag4FAAIEBAEECyAGQQFqIQQgAiAEIAQgAkEAQQAQ0wQiA0EAIANBAEobIgNqIgUQISAAIAYQtgUiAGogAxDTBBogAS0ADSABLwEOIAAgBRCuBRogABAiDAMLIAJBAEEAENYEGgwCCyACIAUgBmpBAWogBkF/cyAEaiIBQQAgAUEAShsQ1gQaDAELIAAgAUHA/gAQ9gQaCyACQSBqJAALCgBByP4AEPwEGgsCAAunAQECfyMAQRBrIgIkAAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBwEDBQUDAgQACwJAAkACQCADQf9+ag4CAQIACyADDQYQgAUMBwtB/AAQHgwGCxA1AAsgARCFBRDzBBoMBAsgARCHBRDzBBoMAwsgARCGBRDyBBoMAgsgAhA2NwMIQQAgAS8BDiACQQhqQQgQrgUaDAELIAEQ9AQaCyACQRBqJAALCgBB2P4AEPwEGgsnAQF/EMgEQQBBADYCnOcBAkAgABDJBCIBDQBBACAANgKc5wELIAELlQEBAn8jAEEgayIAJAACQAJAQQAtAMDnAQ0AQQBBAToAwOcBECMNAQJAQcDbABDJBCIBDQBBAEHA2wA2AqDnASAAQcDbAC8BDDYCACAAQcDbACgCCDYCBEGRFSAAEDwMAQsgACABNgIUIABBwNsANgIQQdM2IABBEGoQPAsgAEEgaiQADwtBjdoAQZU+QR1BqREQmQUAC6sFAQp/AkAgAA0AQdAPDwtB0Q8hAQJAIABBA3ENAEHSDyEBIAAoAgBBxIaZugRHDQBB0w8hASAAKAIEQYq20tV8Rw0AQdQPIQEgACgCCCICQf//B0sNAEHeDyEBIAAvAQwiA0EYbEHwAGoiBCACSw0AQd8PIQEgAEHYAGoiBSADQRhsaiIGLwEQQf//A0cNAEHgDyEBIAYvARJB//8DRw0AQQAhBkEAIQEDQCAIIQcgBiEIAkACQCAAIAEiAUEBdGpBGGovAQAiBiADTQ0AQQAhBkHhDyEJDAELAkAgASAFIAZBGGxqIgovARBBC3ZNDQBBACEGQeIPIQkMAQsCQCAGRQ0AQQAhBkHjDyEJIAEgCkF4ai8BAEELdk0NAQtBASEGIAchCQsgCSEHIAghCQJAIAZFDQAgAUEeSyIJIQYgByEIIAFBAWoiCiEBIAkhCSAKQSBHDQELCwJAIAlBAXENACAHDwsCQCADDQBBAA8LIAchCUEAIQYDQCAJIQgCQAJAIAUgBiIGQRhsaiIBEOUFIglBD00NAEEAIQFB1g8hCQwBCyABIAkQiwUhCQJAIAEvARAiByAJIAlBEHZzQf//A3FGDQBBACEBQdcPIQkMAQsCQCAGRQ0AIAFBeGovAQAgB00NAEEAIQFB2A8hCQwBCwJAAkAgAS8BEiIHQQJxDQBBACEBQdkPIQkgB0EESQ0BDAILAkAgASgCFCIBIARPDQBBACEBQdoPIQkMAgsCQCABIAJJDQBBACEBQdsPIQkMAgsCQCABIAdBAnZqIgcgAkkNAEEAIQFB3A8hCQwCC0EAIQFB3Q8hCSAAIAdqLQAADQELQQEhASAIIQkLIAkhCQJAIAFFDQAgCSEJIAZBAWoiCCEGQQAhASAIIANGDQIMAQsLIAkhAQsgAQvrAgEHfxDIBAJAAkAgAEUNAEEAKAKc5wEiAUUNACAAEOUFIgJBD0sNACABIAAgAhCLBSIDQRB2IANzIgNBCnZBPnFqQRhqLwEAIgQgAS8BDCIFTw0AIAFB2ABqIQYgA0H//wNxIQEgBCEDA0AgBiADIgdBGGxqIgQvARAiAyABSw0BAkAgAyABRw0AIAQhAyAEIAAgAhDQBUUNAwsgB0EBaiIEIQMgBCAFRw0ACwtBACEDCyADIgMhAQJAIAMNAAJAIABFDQBBACgCoOcBIgFFDQAgABDlBSICQQ9LDQAgASAAIAIQiwUiA0EQdiADcyIDQQp2QT5xakEYai8BACIEQcDbAC8BDCIFTw0AIAFB2ABqIQYgA0H//wNxIQMgBCEBA0AgBiABIgdBGGxqIgQvARAiASADSw0BAkAgASADRw0AIAQhASAEIAAgAhDQBUUNAwsgB0EBaiIEIQEgBCAFRw0ACwtBACEBCyABC1EBAn8CQAJAIAAQygQiAA0AQf8BIQIMAQsgAC8BEkEDcSECCyABIQMCQAJAAkAgAg4CAAECCyABIAAoAhQiACAAQQBIGw8LIAAoAhQhAwsgAwtRAQJ/AkACQCAAEMoEIgANAEH/ASECDAELIAAvARJBA3EhAgsgASEDAkACQAJAIAIOAgEAAgsgASAAKAIUIgAgAEEASBsPCyAAKAIUIQMLIAMLxAMBCH8QyARBACgCoOcBIQICQAJAIABFDQAgAkUNACAAEOUFIgNBD0sNACACIAAgAxCLBSIEQRB2IARzIgRBCnZBPnFqQRhqLwEAIgVBwNsALwEMIgZPDQAgAkHYAGohByAEQf//A3EhBCAFIQUDQCAHIAUiCEEYbGoiCS8BECIFIARLDQECQCAFIARHDQAgCSEFIAkgACADENAFRQ0DCyAIQQFqIgkhBSAJIAZHDQALC0EAIQULIAIhBCAFIgkhBQJAIAkNAEEAKAKc5wEhBAJAIABFDQAgBEUNACAAEOUFIgNBD0sNACAEIAAgAxCLBSIFQRB2IAVzIgVBCnZBPnFqQRhqLwEAIgkgBC8BDCIGTw0AIARB2ABqIQcgBUH//wNxIQUgCSEJA0AgByAJIghBGGxqIgIvARAiCSAFSw0BAkAgCSAFRw0AIAIgACADENAFDQAgBCEEIAIhBQwDCyAIQQFqIgghCSAIIAZHDQALCyAEIQRBACEFCyAEIQQCQCAFIgBFDQAgAC0AEkECcUUNAAJAIAFFDQAgASAALwESQQJ2NgIACyAEIAAoAhRqDwsCQCABDQBBAA8LIAFBADYCAEEAC7QBAQJ/QQAhAwJAAkAgAEUNAEEAIQMgABDlBSIEQQ5LDQECQCAAQbDnAUYNAEGw5wEgACAEELYFGgsgBCEDCyADIQACQCABQeQATQ0AQQAPCyAAQbDnAWogAUGAAXM6AAAgAEEBaiEAAkACQCACDQAgACEADAELQQAhAyACEOUFIgEgAGoiBEEPSw0BIABBsOcBaiACIAEQtgUaIAQhAAsgAEGw5wFqQQA6AABBsOcBIQMLIAMLowIBA38jAEGwAmsiAiQAIAJBqwIgACABEJsFGgJAAkAgAhDlBSIBDQAgASEADAELIAEhAANAIAAiASEAAkAgAiABQX9qIgFqLQAAQXZqDgQAAgIAAgsgASEAIAENAAtBACEACyACIAAiAWpBCjoAABAkIAFBAWohAyACIQQCQAJAQYAIQQAoAsTnAWsiACABQQJqSQ0AIAMhAyAEIQAMAQtBxOcBQQAoAsTnAWpBBGogAiAAELYFGkEAQQA2AsTnAUEBIAMgAGsiASABQYF4akH/d0kbIQMgAiAAaiEAC0HE5wFBBGoiAUEAKALE5wFqIAAgAyIAELYFGkEAQQAoAsTnASAAajYCxOcBIAFBACgCxOcBakEAOgAAECUgAkGwAmokAAs5AQJ/ECQCQAJAQQAoAsTnAUEBaiIAQf8HSw0AIAAhAUHE5wEgAGpBBGotAAANAQtBACEBCxAlIAELdgEDfxAkAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQYAIQQAoAsTnASIEIAQgAigCACIFSRsiBCAFRg0AIABBxOcBIAVqQQRqIAQgBWsiBSABIAUgAUkbIgUQtgUaIAIgAigCACAFajYCACAFIQMLECUgAwv4AQEHfxAkAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQQAoAsTnASIEIAIoAgAiBUYNACAAIAFqQX9qIQYgACEBIAUhAwJAA0AgAyEDAkAgASIBIAZJDQAgASEFIAMhBwwCCyABIQUgA0EBaiIIIQdBAyEJAkACQEHE5wEgA2pBBGotAAAiAw4LAQAAAAAAAAAAAAEACyABIAM6AAAgAUEBaiEFQQAgCCAIQYAIRhsiAyEHQQNBACADIARGGyEJCyAFIgUhASAHIgchAyAFIQUgByEHIAlFDQALCyACIAc2AgAgBSIDQQA6AAAgAyAAayEDCxAlIAMLiAEBAX8jAEEQayIDJAACQAJAAkAgAEUNACAAEOUFQQ9LDQAgAC0AAEEqRw0BCyADIAA2AgBBvdoAIAMQPEF/IQAMAQsCQCAAENQEIgANAEF+IQAMAQsCQCAAKAIUIAJLDQAgAUEAKALI7wEgACgCEGogAhC2BRoLIAAoAhQhAAsgA0EQaiQAIAALygMBBH8jAEEgayIBJAACQAJAQQAoAtTvAQ0AQQAQGCICNgLI7wEgAkGAIGohAwJAAkAgAigCAEHGptGSBUcNACACIQQgAigCBEGKjNX5BUYNAQtBACEECyAEIQQCQAJAIAMoAgBBxqbRkgVHDQAgAyEDIAIoAoQgQYqM1fkFRg0BC0EAIQMLIAMhAgJAAkACQCAERQ0AIAJFDQAgBCACIAQoAgggAigCCEsbIQIMAQsgBCACckUNASAEIAIgBBshAgtBACACNgLU7wELAkBBACgC1O8BRQ0AENUECwJAQQAoAtTvAQ0AQcoLQQAQPEEAQQAoAsjvASICNgLU7wEgAhAaIAFCATcDGCABQsam0ZKlwdGa3wA3AxBBACgC1O8BIAFBEGpBEBAZEBsQ1QRBACgC1O8BRQ0CCyABQQAoAszvAUEAKALQ7wFrQVBqIgJBACACQQBKGzYCAEGCLyABEDwLAkACQEEAKALQ7wEiAkEAKALU7wFBEGoiA0kNACACIQIDQAJAIAIiAiAAEOQFDQAgAiECDAMLIAJBaGoiBCECIAQgA08NAAsLQQAhAgsgAUEgaiQAIAIPC0HxxwBBvDtBxQFBjhEQmQUAC4EEAQh/IwBBIGsiACQAQQAoAtTvASIBQQAoAsjvASICa0GAIGohAyABQRBqIgQhAQJAAkACQANAIAMhAyABIgUoAhAiAUF/Rg0BIAEgAyABIANJGyIGIQMgBUEYaiIFIQEgBSACIAZqTQ0AC0HUECEDDAELQQAgAiADaiICNgLM7wFBACAFQWhqIgY2AtDvASAFIQECQANAIAEiAyACTw0BIANBAWohASADLQAAQf8BRg0AC0H8KCEDDAELQQBBADYC2O8BIAQgBksNASAEIQMCQANAAkAgAyIHLQAAQSpHDQAgAEEIakEQaiAHQRBqKQIANwMAIABBCGpBCGogB0EIaikCADcDACAAIAcpAgA3AwggByEBAkADQCABQRhqIgMgBksiBQ0BIAMhASADIABBCGoQ5AUNAAsgBUUNAQsgBygCFCIDQf8fakEMdkEBIAMbIgJFDQAgBygCEEEMdkF+aiEEQQAhAwNAIAQgAyIBaiIDQR5PDQMCQEEAKALY7wFBASADdCIFcQ0AIANBA3ZB/P///wFxQdjvAWoiAyADKAIAIAVzNgIACyABQQFqIgEhAyABIAJHDQALCyAHQRhqIgEhAyABIAZNDQAMAwsAC0HAxgBBvDtBzwBBqTMQmQUACyAAIAM2AgBBkhkgABA8QQBBADYC1O8BCyAAQSBqJAAL6AMBBH8jAEHAAGsiAyQAAkACQAJAAkAgAEUNACAAEOUFQQ9LDQAgAC0AAEEqRw0BCyADIAA2AgBBvdoAIAMQPEF/IQQMAQsCQCACQbkeSQ0AIAMgAjYCEEGQDSADQRBqEDxBfiEEDAELAkAgABDUBCIFRQ0AIAUoAhQgAkcNAEEAIQRBACgCyO8BIAUoAhBqIAEgAhDQBUUNAQsCQEEAKALM7wFBACgC0O8Ba0FQaiIEQQAgBEEAShsgAkEHakF4cUEIIAIbIgRBGGoiBU8NABDXBEEAKALM7wFBACgC0O8Ba0FQaiIGQQAgBkEAShsgBU8NACADIAI2AiBB1AwgA0EgahA8QX0hBAwBC0EAQQAoAszvASAEayIFNgLM7wECQAJAIAFBACACGyIEQQNxRQ0AIAQgAhCiBSEEQQAoAszvASAEIAIQGSAEECIMAQsgBSAEIAIQGQsgA0EwakIANwMAIANCADcDKCADIAI2AjwgA0EAKALM7wFBACgCyO8BazYCOCADQShqIAAgABDlBRC2BRpBAEEAKALQ7wFBGGoiADYC0O8BIAAgA0EoakEYEBkQG0EAKALQ7wFBGGpBACgCzO8BSw0BQQAhBAsgA0HAAGokACAEDwtBzg5BvDtBqQJB9CIQmQUAC6wEAg1/AX4jAEEgayIAJABBpjlBABA8QQAoAsjvASIBIAFBACgC1O8BRkEMdGoiAhAaAkBBACgC1O8BQRBqIgNBACgC0O8BIgFLDQAgASEBIAMhAyACQYAgaiEEIAJBEGohBQNAIAUhBiAEIQcgASEEIABBCGpBEGoiCCADIglBEGoiCikCADcDACAAQQhqQQhqIgsgCUEIaiIMKQIANwMAIAAgCSkCADcDCCAJIQMCQAJAA0AgA0EYaiIBIARLIgUNASABIQMgASAAQQhqEOQFDQALIAUNACAGIQUgByEEDAELIAggCikCADcDACALIAwpAgA3AwAgACAJKQIAIg03AwgCQAJAIA2nQf8BcUEqRw0AIAchAQwBCyAHIAAoAhwiAUEHakF4cUEIIAEbayIDQQAoAsjvASAAKAIYaiABEBkgACADQQAoAsjvAWs2AhggAyEBCyAGIABBCGpBGBAZIAZBGGohBSABIQQLQQAoAtDvASIGIQEgCUEYaiIJIQMgBCEEIAUhBSAJIAZNDQALC0EAKALU7wEoAgghAUEAIAI2AtTvASAAQQA2AhQgACABQQFqIgE2AhAgAELGptGSpcHRmt8ANwMIIAIgAEEIakEQEBkQGxDVBAJAQQAoAtTvAQ0AQfHHAEG8O0HmAUHzOBCZBQALIAAgATYCBCAAQQAoAszvAUEAKALQ7wFrQVBqIgFBACABQQBKGzYCAEHZIyAAEDwgAEEgaiQAC4ABAQF/IwBBEGsiAiQAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQ5QVBEEkNAQsgAiAANgIAQZ7aACACEDxBACEADAELAkAgABDUBCIADQBBACEADAELAkAgAUUNACABIAAoAhQ2AgALQQAoAsjvASAAKAIQaiEACyACQRBqJAAgAAuOCQELfyMAQTBrIgIkAAJAAkACQAJAAkACQAJAAkACQAJAIABFDQAgAC0AAEEqRw0AIAAQ5QVBEEkNAQsgAiAANgIAQZ7aACACEDxBACEDDAELAkAgABDUBCIERQ0AIAQtAABBKkcNAiAEKAIUIgNB/x9qQQx2QQEgAxsiBUUNACAEKAIQQQx2QX5qIQZBACEDA0AgBiADIgdqIgNBHk8NBAJAQQAoAtjvAUEBIAN0IghxRQ0AIANBA3ZB/P///wFxQdjvAWoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALCyACQSBqQgA3AwAgAkIANwMYIAFB/x9qQQx2QQEgARsiCUF/aiEKQR4gCWshC0EAKALY7wEhBUEAIQcCQANAIAMhDAJAIAciCCALSQ0AQQAhBgwCCwJAAkAgCQ0AIAwhAyAIIQdBASEIDAELIAhBHUsNBkEAQR4gCGsiAyADQR5LGyEGQQAhAwNAAkAgBSADIgMgCGoiB3ZBAXFFDQAgDCEDIAdBAWohB0EBIQgMAgsCQCADIApGDQAgA0EBaiIHIQMgByAGRg0IDAELCyAIQQx0QYDAAGohAyAIIQdBACEICyADIgYhAyAHIQcgBiEGIAgNAAsLIAIgATYCLCACIAYiAzYCKAJAAkAgAw0AIAIgATYCEEG4DCACQRBqEDwCQCAEDQBBACEDDAILIAQtAABBKkcNBgJAIAQoAhQiA0H/H2pBDHZBASADGyIFDQBBACEDDAILIAQoAhBBDHZBfmohBkEAIQMDQCAGIAMiB2oiA0EeTw0IAkBBACgC2O8BQQEgA3QiCHENACADQQN2Qfz///8BcUHY7wFqIgMgAygCACAIczYCAAsgB0EBaiIHIQMgByAFRw0AC0EAIQMMAQsgAkEYaiAAIAAQ5QUQtgUaAkBBACgCzO8BQQAoAtDvAWtBUGoiA0EAIANBAEobQRdLDQAQ1wRBACgCzO8BQQAoAtDvAWtBUGoiA0EAIANBAEobQRdLDQBBzBxBABA8QQAhAwwBC0EAQQAoAtDvAUEYajYC0O8BAkAgCUUNAEEAKALI7wEgAigCKGohCEEAIQMDQCAIIAMiA0EMdGoQGiADQQFqIgchAyAHIAlHDQALC0EAKALQ7wEgAkEYakEYEBkQGyACLQAYQSpHDQcgAigCKCEKAkAgAigCLCIDQf8fakEMdkEBIAMbIgVFDQAgCkEMdkF+aiEGQQAhAwNAIAYgAyIHaiIDQR5PDQoCQEEAKALY7wFBASADdCIIcQ0AIANBA3ZB/P///wFxQdjvAWoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALC0EAKALI7wEgCmohAwsgAyEDCyACQTBqJAAgAw8LQZbXAEG8O0HlAEGVLhCZBQALQcDGAEG8O0HPAEGpMxCZBQALQcDGAEG8O0HPAEGpMxCZBQALQZbXAEG8O0HlAEGVLhCZBQALQcDGAEG8O0HPAEGpMxCZBQALQZbXAEG8O0HlAEGVLhCZBQALQcDGAEG8O0HPAEGpMxCZBQALDAAgACABIAIQGUEACwYAEBtBAAuWAgEDfwJAECMNAAJAAkACQEEAKALc7wEiAyAARw0AQdzvASEDDAELIAMhAwNAIAMiBEUNAiAEKAIIIgUhAyAFIABHDQALIARBCGohAwsgAyAAKAIINgIACyAAIAI2AgQgACABNgIAIABBADsBDANAEI0FIgFB/wNxIgJFDQBBACgC3O8BIgNFIQUCQAJAIAMNACAFIQUMAQsgAyEEIAUhBSACIAMvAQxBB3ZGDQADQCAEKAIIIgNFIQUCQCADDQAgBSEFDAILIAMhBCAFIQUgAiADLwEMQQd2Rw0ACwsgBUUNAAsgACABQQd0OwEMIABBACgC3O8BNgIIQQAgADYC3O8BIAFB/wNxDwtB4D9BJ0HLIxCUBQALiAIBBH8CQCAALQANQT5HDQAgAC0AA0EBcUUNACAAKQIEEIwFUg0AQQAoAtzvASIBRQ0AIAAvAQ4hAiABIQEDQAJAIAEiAS8BDCIDIAJzIgRB//8DcUH/AEsNACAEQR9xDQIgASADQQFqQR9xIANB4P8DcXI7AQwgASAAIAFBBGogASACQcAAcRsoAgARAgAgAkEgcUUNAiABQQAgASgCBBECAAJAAkACQEEAKALc7wEiACABRw0AQdzvASEADAELIAAhAANAIAAiBEUNAiAEKAIIIgIhACACIAFHDQALIARBCGohAAsgACABKAIINgIACyABQQA7AQwPCyABKAIIIgQhASAEDQALCwtZAQN/AkACQAJAQQAoAtzvASIBIABHDQBB3O8BIQEMAQsgASEBA0AgASICRQ0CIAIoAggiAyEBIAMgAEcNAAsgAkEIaiEBCyABIAAoAgg2AgALIABBADsBDAs3AQF/AkAgAEEOcUEIRw0AQQAPC0EAIQECQCAAQQxxQQxGDQAgAEEEdkEIIABBA3F0TSEBCyABC5MEAgF/AX4gAUEPcSEDAkACQCABQRBPDQAgAiECDAELIAFBEHRBgIDA/wNqQYCAwP8Hca1CIIa/IAKiIQILIAIhAgJAAkACQAJAAkACQCADQX5qDgoAAQUFBQIFBQMEBQtBACEBAkAgAkQAAAAAAAAAAGMNAEF/IQEgAkQAAOD////vQWQNAAJAAkAgAkQAAAAAAADgP6AiAkQAAAAAAADwQWMgAkQAAAAAAAAAAGZxRQ0AIAKrIQEMAQtBACEBCyABIQELIAAgATYAAA8LQgAhBAJAIAJEAAAAAAAAAABjDQAgAkQAAAAAAADwQ2QNAAJAAkAgAkQAAAAAAADgP6AiAkQAAAAAAADwQ2MgAkQAAAAAAAAAAGZxRQ0AIAKxIQQMAQtCACEECyAEIQQLIAAgBDcAAA8LAkBEAAAAAAAA4EMgAkQAAAAAAADgP6AgAkQAAAAAAADgQ2QgAkQAAAAAAADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQAJAIAJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELIAEhAQsgACADIAEQ4QQL+AEAAkAgAUEISQ0AIAAgASACtxDgBA8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQag6Qa4BQerLABCUBQALIAAgAkH/ASACQf8BSBsiAUEAIAFBAEobOgAAC7sDAwF/AXwBfgJAAkACQCABQQhJDQACQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQ4gS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/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BMBBUGohAQwBC0F/IQEgBEEgciIEQZ9/akH/AXFBBUsNACAEwEGpf2ohAQsgASEBIAJBAWohAgJAAkAgCA0AIAchBiABQQR0QYACciEFDAELIAcgASAIcjoAACAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBBixcgBBA8EB0AC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QtgUgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQ5QVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQ5QVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBCcBSABQQhqIQIMBwsgCygCACIBQbPWACABGyIDEOUFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQtgUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBDlBSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQtgUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8L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IAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACELYFDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYC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AyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQwwUhAAwBCyADELkFIQUgACAEIAMQwwUhACAFRQ0AIAMQugULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEMoFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC9IEAwF/An4GfCAAEM0FIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA7CAASIFoiIGoCIHIAAgACAAoiIIoiIJIAkgCSAJQQArA4CBAaIgCEEAKwP4gAGiIABBACsD8IABokEAKwPogAGgoKCiIAhBACsD4IABoiAAQQArA9iAAaJBACsD0IABoKCgoiAIQQArA8iAAaIgAEEAKwPAgAGiQQArA7iAAaCgoKIgACAEoSAFoiAAIASgoiAGIAAgB6GgoKCgDwsCQAJAIAFBkIB+akGfgH5LDQACQCACQv///////////wCDQgBSDQBBARDJBQ8LIAJCgICAgICAgPj/AFENAQJAAkAgAUGAgAJxDQAgAUHw/wFxQfD/AUcNAQsgABDLBQ8LIABEAAAAAAAAMEOivUKAgICAgICA4Hx8IQILIAJCgICAgICAgI1AfCIDQjSHp7ciCEEAKwP4f6IgA0ItiKdB/wBxQQR0IgFBkIEBaisDAKAiCSABQYiBAWorAwAgAiADQoCAgICAgIB4g32/IAFBiJEBaisDAKEgAUGQkQFqKwMAoaIiAKAiBSAAIAAgAKIiBKIgBCAAQQArA6iAAaJBACsDoIABoKIgAEEAKwOYgAGiQQArA5CAAaCgoiAEQQArA4iAAaIgCEEAKwOAgAGiIAAgCSAFoaCgoKCgIQALIAALCQAgAL1CMIinC+4DAwF+A38GfAJAAkACQAJAAkAgAL0iAUIAUw0AIAFCIIinIgJB//8/Sw0BCwJAIAFC////////////AINCAFINAEQAAAAAAADwvyAAIACiow8LIAFCf1UNASAAIAChRAAAAAAAAAAA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A0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEIcGIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQhwYgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORCHBiAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQhwYgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEIcGIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL1QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABD9BUUNACADIAQQ7QUhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQhwYgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxD/BSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASACQv///////////wCDIgkgAyAEQv///////////wCDIgoQ/QVBAEoNAAJAIAEgCSADIAoQ/QVFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQhwYgBUH4AGopAwAhAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEIcGIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCHBiAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRC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QR8hAgJAIABB////B0sNACAAQSYgAEEIdmciAmt2QQFxIAJBAXRrQT5qIQILIAEgAjYCHCABQgA3AhAgAkECdEGQ9QFqIQQCQAJAAkACQEEAKALk8gEiBkEBIAJ0IgNxDQBBACAGIANyNgLk8gEgBCABNgIAIAEgBDYCGAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABIAQ2AhgLIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBADYCGCABIAQ2AgwgASAANgIIC0EAQQAoAoDzAUF/aiIBQX8gARs2AoDzAQsLBwA/AEEQdAtUAQJ/QQAoAsTUASIBIABBB2pBeHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABD5BU0NACAAEBVFDQELQQAgADYCxNQBIAEPCxCzBUEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCSAEIAIgBxsiC0L///////8/gyEKIAIgBCAHGyICQjCIp0H//wFxIQgCQCALQjCIp0H//wFxIgYNACAFQeAAaiAJIAogCSAKIApQIgYbeSAGQQZ0rXynIgZBcWoQ/AVBECAGayEGIAVB6ABqKQMAIQogBSkDYCEJCyABIAMgBxshAyACQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEPwFQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhASAKQgOGIAlCPYiEIQQgA0IDhiEKIAsgAoUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQFCASEKDAELIAVBwABqIAogAUGAASAHaxD8BSAFQTBqIAogASAHEIYGIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEKIAVBMGpBCGopAwAhAQsgBEKAgICAgICABIQhDCAJQgOGIQkCQAJAIANCf1UNAEIAIQNCACEEIAkgCoUgDCABhYRQDQIgCSAKfSECIAwgAX0gCSAKVK19IgRC/////////wNWDQEgBUEgaiACIAQgAiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ/AUgBiAHayEGIAVBKGopAwAhBCAFKQMgIQIMAQsgASAMfCAKIAl8IgIgClStfCIEQoCAgICAgIAIg1ANACACQgGIIARCP4aEIApCAYOEIQIgBkEBaiEGIARCAYghBAsgC0KAgICAgICAgIB/gyEKAkAgBkH//wFIDQAgCkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiACIAQgBkH/AGoQ/AUgBSACIARBASAGaxCGBiAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCECIAVBCGopAwAhBAsgAkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAqEIQQgAqdBB3EhBgJAAkACQAJAAkAQhAYOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyAKQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyAKUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQhQYaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL5xACBX8PfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQwgAyEBDAILAkAgASANQoCAgICAgMD//wCFhEIAUg0AAkAgAyACQoCAgICAgMD//wCFhFBFDQBCACEBQoCAgICAgOD//wAhDAwDCyAMQoCAgICAgMD//wCEIQxCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AQgAhAQwCCwJAIAEgDYRCAFINAEKAgICAgIDg//8AIAwgAyAChFAbIQxCACEBDAILAkAgAyAChEIAUg0AIAxCgICAgICAwP//AIQhDEIAIQEMAgtBACEIAkAgDUL///////8/Vg0AIAVBwAJqIAEgCyABIAsgC1AiCBt5IAhBBnStfKciCEFxahD8BUEQIAhrIQggBUHIAmopAwAhCyAFKQPAAiEBCyACQv///////z9WDQAgBUGwAmogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEPwFIAkgCGpBcGohCCAFQbgCaikDACEKIAUpA7ACIQMLIAVBoAJqIANCMYggCkKAgICAgIDAAIQiDkIPhoQiAkIAQoCAgICw5ryC9QAgAn0iBEIAEIgGIAVBkAJqQgAgBUGgAmpBCGopAwB9QgAgBEIAEIgGIAVBgAJqIAUpA5ACQj+IIAVBkAJqQQhqKQMAQgGGhCIEQgAgAkIAEIgGIAVB8AFqIARCAEIAIAVBgAJqQQhqKQMAfUIAEIgGIAVB4AFqIAUpA/ABQj+IIAVB8AFqQQhqKQMAQgGGhCIEQgAgAkIAEIgGIAVB0AFqIARCAEIAIAVB4AFqQQhqKQMAfUIAEIgGIAVBwAFqIAUpA9ABQj+IIAVB0AFqQQhqKQMAQgGGhCIEQgAgAkIAEIgGIAVBsAFqIARCAEIAIAVBwAFqQQhqKQMAfUIAEIgGIAVBoAFqIAJCACAFKQOwAUI/iCAFQbABakEIaikDAEIBhoRCf3wiBEIAEIgGIAVBkAFqIANCD4ZCACAEQgAQiAYgBUHwAGogBEIAQgAgBUGgAWpBCGopAwAgBSkDoAEiCiAFQZABakEIaikDAHwiAiAKVK18IAJCAVatfH1CABCIBiAFQYABakIBIAJ9QgAgBEIAEIgGIAggByAGa2ohBgJAAkAgBSkDcCIPQgGGIhAgBSkDgAFCP4ggBUGAAWpBCGopAwAiEUIBhoR8Ig1CmZN/fCISQiCIIgIgC0KAgICAgIDAAIQiE0IBhiIUQiCIIgR+IhUgAUIBhiIWQiCIIgogBUHwAGpBCGopAwBCAYYgD0I/iIQgEUI/iHwgDSAQVK18IBIgDVStfEJ/fCIPQiCIIg1+fCIQIBVUrSAQIA9C/////w+DIg8gAUI/iCIXIAtCAYaEQv////8PgyILfnwiESAQVK18IA0gBH58IA8gBH4iFSALIA1+fCIQIBVUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIAt+IhUgAiAKfnwiESAVVK0gESAPIBZC/v///w+DIhV+fCIYIBFUrXx8IhEgEFStfCARIBIgBH4iECAVIA1+fCIEIAIgC358Ig0gDyAKfnwiD0IgiCAEIBBUrSANIARUrXwgDyANVK18QiCGhHwiBCARVK18IAQgGCACIBV+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgGFStIAIgD0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgFCAXhCETIAVB0ABqIAIgBCADIA4QiAYgAUIxhiAFQdAAakEIaikDAH0gBSkDUCIBQgBSrX0hDSAGQf7/AGohBkIAIAF9IQoMAQsgBUHgAGogAkIBiCAEQj+GhCICIARCAYgiBCADIA4QiAYgAUIwhiAFQeAAakEIaikDAH0gBSkDYCIKQgBSrX0hDSAGQf//AGohBkIAIAp9IQogASEWCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhDyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxCGBiAFQTBqIBYgEyAGQfAAahD8BSAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiDxCIBiAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEIgGIAUgAyAOQgVCABCIBiAPIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ/AUgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ/AUgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahD8BSACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahD8BSACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahD8BUEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahD8BSAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgA0IxiCAKQg+GIhSEQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdB/wBLDQAgBUEwaiASIAEgBkH/AGoiBhD8BSAFQSBqIAIgBCAGEPwFIAVBEGogEiABIAcQhgYgBSACIAQgBxCGBiAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAILQgAhAQwCCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgIgAUIgiCIEfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgBH58IgNCIIh8IANC/////w+DIAIgAX58IgFCIIh8NwMIIAAgAUIghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ+wUgBSkDACEEIAAgBUEIaikDADcDCCAAIAQ3AwAgBUEQaiQAC+QDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAhSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEPwFIAIgACAEQYH4ACADaxCGBiACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwYAIAAkAQsEACMBCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsEACMACxQAQdD2BSQDQdD2AUEPakFwcSQCCwcAIwAjAmsLBAAjAwsEACMCCw0AIAEgAiADIAAREAALJQEBfiAAIAEgAq0gA61CIIaEIAQQlgYhBSAFQiCIpxCMBiAFpwsTACAAIAGnIAFCIIinIAIgAxAWCwv+1IGAAAMAQYAIC5jLAWluZmluaXR5AC1JbmZpbml0eQAhIEV4Y2VwdGlvbjogT3V0T2ZNZW1vcnkAZGV2c192ZXJpZnkAZGV2c19qc29uX3N0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAZGVsYXkAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAV1NTSy1IOiBzdHJlYW1pbmc6ICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93ACEgRXhjZXB0aW9uOiBTdGFja092ZXJmbG93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBkZXZzX2pkX3NlbmRfcmF3AGlkaXYAcHJldgB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAcmVzdGFydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABkZXZzX3BhY2tldF9zcGVjX3BhcmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABkYmc6IGhhbHQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25TZXJ2ZXJQYWNrZXQAX29uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfaW5zcGVjdABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBEZXZTLVNIQTI1NjogJS1zAHdzczovLyVzJXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAIyAldSAlcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBjbGFzc0lkZW50aWZpZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGRvX2ZsdXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3RhdGUub2ZmIDwgc2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAHJlc3BvbnNlAF9jb21tYW5kUmVzcG9uc2UAZmFsc2UAZmxhc2hfZXJhc2UAZGV2c19tYWtlX2Nsb3N1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAUm9sZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAU2VydmVySW50ZXJmYWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAF9zZXJ2ZXJTZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG5vdEltcGxlbWVudGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AHV0Zi04AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgAxMjcuMC4wLjEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACVjICAuLi4AISAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQAh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bGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAAnvmAgAAEbmFtZQGueJkGAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBwRleGl0CAtlbV90aW1lX25vdwkOZW1fcHJpbnRfZG1lc2cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQMaHdfZGV2aWNlX2lkNQx0YXJnZXRfcmVzZXQ2DnRpbV9nZXRfbWljcm9zNw9hcHBfcHJpbnRfZG1lc2c4EmpkX3RjcHNvY2tfcHJvY2VzczkRYXBwX2luaXRfc2VydmljZXM6EmRldnNfY2xpZW50X2RlcGxveTsUY2xpZW50X2V2ZW50X2hhbmRsZXI8CWFwcF9kbWVzZz0LZmx1c2hfZG1lc2c+C2FwcF9wcm9jZXNzPwd0eF9pbml0QA9qZF9wYWNrZXRfcmVhZHlBCnR4X3Byb2Nlc3NCF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlQw5qZF93ZWJzb2NrX25ld0QGb25vcGVuRQdvbmVycm9yRgdvbmNsb3NlRwlvbm1lc3NhZ2VIEGpkX3dlYnNvY2tfY2xvc2VJDmRldnNfYnVmZmVyX29wShJkZXZzX2J1ZmZlcl9kZWNvZGVLEmRldnNfYnVmZmVyX2VuY29kZUwPZGV2c19jcmVhdGVfY3R4TQlzZXR1cF9jdHhOCmRldnNfdHJhY2VPD2RldnNfZXJyb3JfY29kZVAZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclEJY2xlYXJfY3R4Ug1kZXZzX2ZyZWVfY3R4UwhkZXZzX29vbVQJZGV2c19mcmVlVRFkZXZzY2xvdWRfcHJvY2Vzc1YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRXFGRldnNjbG91ZF9vbl9tZXNzYWdlWA5kZXZzY2xvdWRfaW5pdFkUZGV2c190cmFja19leGNlcHRpb25aD2RldnNkYmdfcHJvY2Vzc1sRZGV2c2RiZ19yZXN0YXJ0ZWRcFWRldnNkYmdfaGFuZGxlX3BhY2tldF0Lc2VuZF92YWx1ZXNeEXZhbHVlX2Zyb21fdGFnX3YwXxlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYA1vYmpfZ2V0X3Byb3BzYQxleHBhbmRfdmFsdWViEmRldnNkYmdfc3VzcGVuZF9jYmMMZGV2c2RiZ19pbml0ZBBleHBhbmRfa2V5X3ZhbHVlZQZrdl9hZGRmD2RldnNtZ3JfcHJvY2Vzc2cHdHJ5X3J1bmgMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udgpkZXZzX3BhbmljdxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBJkZXZzX2ltZ19yb2xlX25hbWV9EWRldnNfZmliZXJfYnlfdGFnfhBkZXZzX2ZpYmVyX3N0YXJ0fxRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYABDmRldnNfZmliZXJfcnVugQETZGV2c19maWJlcl9zeW5jX25vd4IBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYMBD2RldnNfZmliZXJfcG9rZYQBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWFARNqZF9nY19hbnlfdHJ5X2FsbG9jhgEHZGV2c19nY4cBD2ZpbmRfZnJlZV9ibG9ja4gBEmRldnNfYW55X3RyeV9hbGxvY4kBDmRldnNfdHJ5X2FsbG9jigELamRfZ2NfdW5waW6LAQpqZF9nY19mcmVljAEUZGV2c192YWx1ZV9pc19waW5uZWSNAQ5kZXZzX3ZhbHVlX3Bpbo4BEGRldnNfdmFsdWVfdW5waW6PARJkZXZzX21hcF90cnlfYWxsb2OQARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2ORARRkZXZzX2FycmF5X3RyeV9hbGxvY5IBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5MBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5QBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0lQEPZGV2c19nY19zZXRfY3R4lgEOZGV2c19nY19jcmVhdGWXAQ9kZXZzX2djX2Rlc3Ryb3mYARFkZXZzX2djX29ial9jaGVja5kBC3NjYW5fZ2Nfb2JqmgERcHJvcF9BcnJheV9sZW5ndGibARJtZXRoMl9BcnJheV9pbnNlcnScARJmdW4xX0FycmF5X2lzQXJyYXmdARBtZXRoWF9BcnJheV9wdXNongEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlnwERbWV0aFhfQXJyYXlfc2xpY2WgARFmdW4xX0J1ZmZlcl9hbGxvY6EBEGZ1bjFfQnVmZmVyX2Zyb22iARJwcm9wX0J1ZmZlcl9sZW5ndGijARVtZXRoMV9CdWZmZXJfdG9TdHJpbmekARNtZXRoM19CdWZmZXJfZmlsbEF0pQETbWV0aDRfQnVmZmVyX2JsaXRBdKYBFGRldnNfY29tcHV0ZV90aW1lb3V0pwEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCoARdmdW4xX0RldmljZVNjcmlwdF9kZWxheakBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY6oBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKsBGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnSsARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXStARdmdW4yX0RldmljZVNjcmlwdF9wcmludK4BHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSvARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLABGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXBysQEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbmeyARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXOzASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVytAEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmS1ARRtZXRoMV9FcnJvcl9fX2N0b3JfX7YBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+3ARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+4ARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7kBD3Byb3BfRXJyb3JfbmFtZboBEW1ldGgwX0Vycm9yX3ByaW50uwEPcHJvcF9Ec0ZpYmVyX2lkvAEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZL0BFG1ldGgxX0RzRmliZXJfcmVzdW1lvgEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGW/ARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kwAERZnVuMF9Ec0ZpYmVyX3NlbGbBARRtZXRoWF9GdW5jdGlvbl9zdGFydMIBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlwwEScHJvcF9GdW5jdGlvbl9uYW1lxAEPZnVuMl9KU09OX3BhcnNlxQETZnVuM19KU09OX3N0cmluZ2lmecYBDmZ1bjFfTWF0aF9jZWlsxwEPZnVuMV9NYXRoX2Zsb29yyAEPZnVuMV9NYXRoX3JvdW5kyQENZnVuMV9NYXRoX2Fic8oBEGZ1bjBfTWF0aF9yYW5kb23LARNmdW4xX01hdGhfcmFuZG9tSW50zAENZnVuMV9NYXRoX2xvZ80BDWZ1bjJfTWF0aF9wb3fOAQ5mdW4yX01hdGhfaWRpds8BDmZ1bjJfTWF0aF9pbW9k0AEOZnVuMl9NYXRoX2ltdWzRAQ1mdW4yX01hdGhfbWlu0gELZnVuMl9taW5tYXjTAQ1mdW4yX01hdGhfbWF41AESZnVuMl9PYmplY3RfYXNzaWdu1QEQZnVuMV9PYmplY3Rfa2V5c9YBE2Z1bjFfa2V5c19vcl92YWx1ZXPXARJmdW4xX09iamVjdF92YWx1ZXPYARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZtkBHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm932gEScHJvcF9Ec1BhY2tldF9yb2xl2wEecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVy3AEVcHJvcF9Ec1BhY2tldF9zaG9ydElk3QEacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXjeARxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5k3wETcHJvcF9Ec1BhY2tldF9mbGFnc+ABF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5k4QEWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydOIBFXByb3BfRHNQYWNrZXRfcGF5bG9hZOMBFXByb3BfRHNQYWNrZXRfaXNFdmVudOQBF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2Rl5QEWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldOYBFnByb3BfRHNQYWNrZXRfaXNSZWdHZXTnARVwcm9wX0RzUGFja2V0X3JlZ0NvZGXoARZwcm9wX0RzUGFja2V0X2lzQWN0aW9u6QEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl6gESZGV2c19nZXRfc3BlY19jb2Rl6wEScHJvcF9Ec1BhY2tldF9zcGVj7AERZGV2c19wa3RfZ2V0X3NwZWPtARVtZXRoMF9Ec1BhY2tldF9kZWNvZGXuAR1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZO8BGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudPABFnByb3BfRHNQYWNrZXRTcGVjX25hbWXxARZwcm9wX0RzUGFja2V0U3BlY19jb2Rl8gEacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2XzARltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2Rl9AESZGV2c19wYWNrZXRfZGVjb2Rl9QEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk9gEURHNSZWdpc3Rlcl9yZWFkX2NvbnT3ARJkZXZzX3BhY2tldF9lbmNvZGX4ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl+QEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZfoBFnByb3BfRHNQYWNrZXRJbmZvX25hbWX7ARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl/AEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f/QETcHJvcF9Ec1JvbGVfaXNCb3VuZP4BGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZP8BInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXKAAhdwcm9wX0RzU2VydmljZVNwZWNfbmFtZYECGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwggIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26DAhJwcm9wX1N0cmluZ19sZW5ndGiEAhdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdIUCE21ldGgxX1N0cmluZ19jaGFyQXSGAhJtZXRoMl9TdHJpbmdfc2xpY2WHAgtpbnNwZWN0X29iaogCBmFkZF9jaIkCDWluc3BlY3RfZmllbGSKAgxkZXZzX2luc3BlY3SLAhRkZXZzX2pkX2dldF9yZWdpc3RlcowCFmRldnNfamRfY2xlYXJfcGt0X2tpbmSNAhBkZXZzX2pkX3NlbmRfY21kjgIQZGV2c19qZF9zZW5kX3Jhd48CE2RldnNfamRfc2VuZF9sb2dtc2eQAhNkZXZzX2pkX3BrdF9jYXB0dXJlkQIRZGV2c19qZF93YWtlX3JvbGWSAhJkZXZzX2pkX3Nob3VsZF9ydW6TAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZZQCE2RldnNfamRfcHJvY2Vzc19wa3SVAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWSWAhRkZXZzX2pkX3JvbGVfY2hhbmdlZJcCFGRldnNfamRfcmVzZXRfcGFja2V0mAISZGV2c19qZF9pbml0X3JvbGVzmQISZGV2c19qZF9mcmVlX3JvbGVzmgIVZGV2c19zZXRfZ2xvYmFsX2ZsYWdzmwIXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3OcAhVkZXZzX2dldF9nbG9iYWxfZmxhZ3OdAhBkZXZzX2pzb25fZXNjYXBlngIVZGV2c19qc29uX2VzY2FwZV9jb3JlnwIPZGV2c19qc29uX3BhcnNloAIKanNvbl92YWx1ZaECDHBhcnNlX3N0cmluZ6ICDXN0cmluZ2lmeV9vYmqjAgphZGRfaW5kZW50pAIPc3RyaW5naWZ5X2ZpZWxkpQITZGV2c19qc29uX3N0cmluZ2lmeaYCEXBhcnNlX3N0cmluZ19jb3JlpwIRZGV2c19tYXBsaWtlX2l0ZXKoAhdkZXZzX2dldF9idWlsdGluX29iamVjdKkCEmRldnNfbWFwX2NvcHlfaW50b6oCDGRldnNfbWFwX3NldKsCBmxvb2t1cKwCE2RldnNfbWFwbGlrZV9pc19tYXCtAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXOuAhFkZXZzX2FycmF5X2luc2VydK8CCGt2X2FkZC4xsAISZGV2c19zaG9ydF9tYXBfc2V0sQIPZGV2c19tYXBfZGVsZXRlsgISZGV2c19zaG9ydF9tYXBfZ2V0swIgZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY19pZHi0AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWO1Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHi2AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY7cCF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0uAIXZGV2c19wYWNrZXRfc3BlY19wYXJlbnS5Ag5kZXZzX3JvbGVfc3BlY7oCEmRldnNfZ2V0X2Jhc2Vfc3BlY7sCEGRldnNfc3BlY19sb29rdXC8AhJkZXZzX2Z1bmN0aW9uX2JpbmS9AhFkZXZzX21ha2VfY2xvc3VyZb4CDmRldnNfZ2V0X2ZuaWR4vwITZGV2c19nZXRfZm5pZHhfY29yZcACHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZMECE2RldnNfZ2V0X3JvbGVfcHJvdG/CAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfDAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTEAhVkZXZzX2dldF9zdGF0aWNfcHJvdG/FAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm/GAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bccCFmRldnNfbWFwbGlrZV9nZXRfcHJvdG/IAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGTJAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmTKAhBkZXZzX2luc3RhbmNlX29mywIPZGV2c19vYmplY3RfZ2V0zAIMZGV2c19zZXFfZ2V0zQIMZGV2c19hbnlfZ2V0zgIMZGV2c19hbnlfc2V0zwIMZGV2c19zZXFfc2V00AIOZGV2c19hcnJheV9zZXTRAhNkZXZzX2FycmF5X3Bpbl9wdXNo0gIMZGV2c19hcmdfaW500wIPZGV2c19hcmdfZG91Ymxl1AIPZGV2c19yZXRfZG91Ymxl1QIMZGV2c19yZXRfaW501gINZGV2c19yZXRfYm9vbNcCD2RldnNfcmV0X2djX3B0ctgCEWRldnNfYXJnX3NlbGZfbWFw2QIRZGV2c19zZXR1cF9yZXN1bWXaAg9kZXZzX2Nhbl9hdHRhY2jbAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVl3AIVZGV2c19tYXBsaWtlX3RvX3ZhbHVl3QISZGV2c19yZWdjYWNoZV9mcmVl3gIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbN8CF2RldnNfcmVnY2FjaGVfbWFya191c2Vk4AITZGV2c19yZWdjYWNoZV9hbGxvY+ECFGRldnNfcmVnY2FjaGVfbG9va3Vw4gIRZGV2c19yZWdjYWNoZV9hZ2XjAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZeQCEmRldnNfcmVnY2FjaGVfbmV4dOUCD2pkX3NldHRpbmdzX2dldOYCD2pkX3NldHRpbmdzX3NldOcCDmRldnNfbG9nX3ZhbHVl6AIPZGV2c19zaG93X3ZhbHVl6QIQZGV2c19zaG93X3ZhbHVlMOoCDWNvbnN1bWVfY2h1bmvrAg1zaGFfMjU2X2Nsb3Nl7AIPamRfc2hhMjU2X3NldHVw7QIQamRfc2hhMjU2X3VwZGF0Ze4CEGpkX3NoYTI1Nl9maW5pc2jvAhRqZF9zaGEyNTZfaG1hY19zZXR1cPACFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaPECDmpkX3NoYTI1Nl9oa2Rm8gIOZGV2c19zdHJmb3JtYXTzAg5kZXZzX2lzX3N0cmluZ/QCDmRldnNfaXNfbnVtYmVy9QIUZGV2c19zdHJpbmdfZ2V0X3V0Zjj2AhNkZXZzX2J1aWx0aW5fc3RyaW5n9wIUZGV2c19zdHJpbmdfdnNwcmludGb4AhNkZXZzX3N0cmluZ19zcHJpbnRm+QIVZGV2c19zdHJpbmdfZnJvbV91dGY4+gIUZGV2c192YWx1ZV90b19zdHJpbmf7AhBidWZmZXJfdG9fc3RyaW5n/AIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZP0CEmRldnNfc3RyaW5nX2NvbmNhdP4CEWRldnNfc3RyaW5nX3NsaWNl/wISZGV2c19wdXNoX3RyeWZyYW1lgAMRZGV2c19wb3BfdHJ5ZnJhbWWBAw9kZXZzX2R1bXBfc3RhY2uCAxNkZXZzX2R1bXBfZXhjZXB0aW9ugwMKZGV2c190aHJvd4QDEmRldnNfcHJvY2Vzc190aHJvd4UDEGRldnNfYWxsb2NfZXJyb3KGAxVkZXZzX3Rocm93X3R5cGVfZXJyb3KHAxZkZXZzX3Rocm93X3JhbmdlX2Vycm9yiAMeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9yiQMaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3KKAx5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHSLAxhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3KMAxdkZXZzX3Rocm93X3N5bnRheF9lcnJvco0DFmRldnNfdmFsdWVfZnJvbV9kb3VibGWOAxNkZXZzX3ZhbHVlX2Zyb21faW50jwMUZGV2c192YWx1ZV9mcm9tX2Jvb2yQAxdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcpEDFGRldnNfdmFsdWVfdG9fZG91YmxlkgMRZGV2c192YWx1ZV90b19pbnSTAxJkZXZzX3ZhbHVlX3RvX2Jvb2yUAw5kZXZzX2lzX2J1ZmZlcpUDF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxllgMQZGV2c19idWZmZXJfZGF0YZcDE2RldnNfYnVmZmVyaXNoX2RhdGGYAxRkZXZzX3ZhbHVlX3RvX2djX29iapkDDWRldnNfaXNfYXJyYXmaAxFkZXZzX3ZhbHVlX3R5cGVvZpsDD2RldnNfaXNfbnVsbGlzaJwDGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWSdAxRkZXZzX3ZhbHVlX2FwcHJveF9lcZ4DEmRldnNfdmFsdWVfaWVlZV9lcZ8DHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbmegAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGOhAxJkZXZzX2ltZ19zdHJpZHhfb2uiAxJkZXZzX2R1bXBfdmVyc2lvbnOjAwtkZXZzX3ZlcmlmeaQDEWRldnNfZmV0Y2hfb3Bjb2RlpQMOZGV2c192bV9yZXN1bWWmAxFkZXZzX3ZtX3NldF9kZWJ1Z6cDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOoAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSpAwxkZXZzX3ZtX2hhbHSqAw9kZXZzX3ZtX3N1c3BlbmSrAxZkZXZzX3ZtX3NldF9icmVha3BvaW50rAMUZGV2c192bV9leGVjX29wY29kZXOtAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeK4DEWRldnNfaW1nX2dldF91dGY4rwMUZGV2c19nZXRfc3RhdGljX3V0ZjiwAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaLEDDGV4cHJfaW52YWxpZLIDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0swMLc3RtdDFfY2FsbDC0AwtzdG10Ml9jYWxsMbUDC3N0bXQzX2NhbGwytgMLc3RtdDRfY2FsbDO3AwtzdG10NV9jYWxsNLgDC3N0bXQ2X2NhbGw1uQMLc3RtdDdfY2FsbDa6AwtzdG10OF9jYWxsN7sDC3N0bXQ5X2NhbGw4vAMSc3RtdDJfaW5kZXhfZGVsZXRlvQMMc3RtdDFfcmV0dXJuvgMJc3RtdHhfam1wvwMMc3RtdHgxX2ptcF96wAMKZXhwcjJfYmluZMEDEmV4cHJ4X29iamVjdF9maWVsZMIDEnN0bXR4MV9zdG9yZV9sb2NhbMMDE3N0bXR4MV9zdG9yZV9nbG9iYWzEAxJzdG10NF9zdG9yZV9idWZmZXLFAwlleHByMF9pbmbGAxBleHByeF9sb2FkX2xvY2FsxwMRZXhwcnhfbG9hZF9nbG9iYWzIAwtleHByMV91cGx1c8kDC2V4cHIyX2luZGV4ygMPc3RtdDNfaW5kZXhfc2V0ywMUZXhwcngxX2J1aWx0aW5fZmllbGTMAxJleHByeDFfYXNjaWlfZmllbGTNAxFleHByeDFfdXRmOF9maWVsZM4DEGV4cHJ4X21hdGhfZmllbGTPAw5leHByeF9kc19maWVsZNADD3N0bXQwX2FsbG9jX21hcNEDEXN0bXQxX2FsbG9jX2FycmF50gMSc3RtdDFfYWxsb2NfYnVmZmVy0wMRZXhwcnhfc3RhdGljX3JvbGXUAxNleHByeF9zdGF0aWNfYnVmZmVy1QMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5n1gMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ9cDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ9gDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbtkDDWV4cHJ4X2xpdGVyYWzaAxFleHByeF9saXRlcmFsX2Y2NNsDEGV4cHJ4X3JvbGVfcHJvdG/cAxFleHByM19sb2FkX2J1ZmZlct0DDWV4cHIwX3JldF92YWzeAwxleHByMV90eXBlb2bfAw9leHByMF91bmRlZmluZWTgAxJleHByMV9pc191bmRlZmluZWThAwpleHByMF90cnVl4gMLZXhwcjBfZmFsc2XjAw1leHByMV90b19ib29s5AMJZXhwcjBfbmFu5QMJZXhwcjFfYWJz5gMNZXhwcjFfYml0X25vdOcDDGV4cHIxX2lzX25hbugDCWV4cHIxX25lZ+kDCWV4cHIxX25vdOoDDGV4cHIxX3RvX2ludOsDCWV4cHIyX2FkZOwDCWV4cHIyX3N1Yu0DCWV4cHIyX211bO4DCWV4cHIyX2Rpdu8DDWV4cHIyX2JpdF9hbmTwAwxleHByMl9iaXRfb3LxAw1leHByMl9iaXRfeG9y8gMQZXhwcjJfc2hpZnRfbGVmdPMDEWV4cHIyX3NoaWZ0X3JpZ2h09AMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWT1AwhleHByMl9lcfYDCGV4cHIyX2xl9wMIZXhwcjJfbHT4AwhleHByMl9uZfkDEGV4cHIxX2lzX251bGxpc2j6AxRzdG10eDJfc3RvcmVfY2xvc3VyZfsDE2V4cHJ4MV9sb2FkX2Nsb3N1cmX8AxJleHByeF9tYWtlX2Nsb3N1cmX9AxBleHByMV90eXBlb2Zfc3Ry/gMTc3RtdHhfam1wX3JldF92YWxfev8DEHN0bXQyX2NhbGxfYXJyYXmABAlzdG10eF90cnmBBA1zdG10eF9lbmRfdHJ5ggQLc3RtdDBfY2F0Y2iDBA1zdG10MF9maW5hbGx5hAQLc3RtdDFfdGhyb3eFBA5zdG10MV9yZV90aHJvd4YEEHN0bXR4MV90aHJvd19qbXCHBA5zdG10MF9kZWJ1Z2dlcogECWV4cHIxX25ld4kEEWV4cHIyX2luc3RhbmNlX29migQKZXhwcjBfbnVsbIsED2V4cHIyX2FwcHJveF9lcYwED2V4cHIyX2FwcHJveF9uZY0EE3N0bXQxX3N0b3JlX3JldF92YWyOBBFleHByeF9zdGF0aWNfc3BlY48ED2RldnNfdm1fcG9wX2FyZ5AEE2RldnNfdm1fcG9wX2FyZ191MzKRBBNkZXZzX3ZtX3BvcF9hcmdfaTMykgQWZGV2c192bV9wb3BfYXJnX2J1ZmZlcpMEEmpkX2Flc19jY21fZW5jcnlwdJQEEmpkX2Flc19jY21fZGVjcnlwdJUEDEFFU19pbml0X2N0eJYED0FFU19FQ0JfZW5jcnlwdJcEEGpkX2Flc19zZXR1cF9rZXmYBA5qZF9hZXNfZW5jcnlwdJkEEGpkX2Flc19jbGVhcl9rZXmaBAtqZF93c3NrX25ld5sEFGpkX3dzc2tfc2VuZF9tZXNzYWdlnAQTamRfd2Vic29ja19vbl9ldmVudJ0EB2RlY3J5cHSeBA1qZF93c3NrX2Nsb3NlnwQQamRfd3Nza19vbl9ldmVudKAEC3Jlc3Bfc3RhdHVzoQQSd3Nza2hlYWx0aF9wcm9jZXNzogQXamRfdGNwc29ja19pc19hdmFpbGFibGWjBBR3c3NraGVhbHRoX3JlY29ubmVjdKQEGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldKUED3NldF9jb25uX3N0cmluZ6YEEWNsZWFyX2Nvbm5fc3RyaW5npwQPd3Nza2hlYWx0aF9pbml0qAQRd3Nza19zZW5kX21lc3NhZ2WpBBF3c3NrX2lzX2Nvbm5lY3RlZKoEFHdzc2tfdHJhY2tfZXhjZXB0aW9uqwQSd3Nza19zZXJ2aWNlX3F1ZXJ5rAQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6Za0EFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWuBA9yb2xlbWdyX3Byb2Nlc3OvBBByb2xlbWdyX2F1dG9iaW5ksAQVcm9sZW1ncl9oYW5kbGVfcGFja2V0sQQUamRfcm9sZV9tYW5hZ2VyX2luaXSyBBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSzBA1qZF9yb2xlX2FsbG9jtAQQamRfcm9sZV9mcmVlX2FsbLUEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmS2BBNqZF9jbGllbnRfbG9nX2V2ZW50twQTamRfY2xpZW50X3N1YnNjcmliZbgEFGpkX2NsaWVudF9lbWl0X2V2ZW50uQQUcm9sZW1ncl9yb2xlX2NoYW5nZWS6BBBqZF9kZXZpY2VfbG9va3VwuwQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlvAQTamRfc2VydmljZV9zZW5kX2NtZL0EEWpkX2NsaWVudF9wcm9jZXNzvgQOamRfZGV2aWNlX2ZyZWW/BBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldMAED2pkX2RldmljZV9hbGxvY8EEEHNldHRpbmdzX3Byb2Nlc3PCBBZzZXR0aW5nc19oYW5kbGVfcGFja2V0wwQNc2V0dGluZ3NfaW5pdMQED2pkX2N0cmxfcHJvY2Vzc8UEFWpkX2N0cmxfaGFuZGxlX3BhY2tldMYEDGpkX2N0cmxfaW5pdMcEFGRjZmdfc2V0X3VzZXJfY29uZmlnyAQJZGNmZ19pbml0yQQNZGNmZ192YWxpZGF0ZcoEDmRjZmdfZ2V0X2VudHJ5ywQMZGNmZ19nZXRfaTMyzAQMZGNmZ19nZXRfdTMyzQQPZGNmZ19nZXRfc3RyaW5nzgQMZGNmZ19pZHhfa2V5zwQJamRfdmRtZXNn0AQRamRfZG1lc2dfc3RhcnRwdHLRBA1qZF9kbWVzZ19yZWFk0gQSamRfZG1lc2dfcmVhZF9saW5l0wQTamRfc2V0dGluZ3NfZ2V0X2JpbtQECmZpbmRfZW50cnnVBA9yZWNvbXB1dGVfY2FjaGXWBBNqZF9zZXR0aW5nc19zZXRfYmlu1wQLamRfZnN0b3JfZ2PYBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2XZBBZqZF9zZXR0aW5nc19wcmVwX2xhcmdl2gQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2XbBBZqZF9zZXR0aW5nc19zeW5jX2xhcmdl3AQNamRfaXBpcGVfb3Blbt0EFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTeBA5qZF9pcGlwZV9jbG9zZd8EEmpkX251bWZtdF9pc192YWxpZOAEFWpkX251bWZtdF93cml0ZV9mbG9hdOEEE2pkX251bWZtdF93cml0ZV9pMzLiBBJqZF9udW1mbXRfcmVhZF9pMzLjBBRqZF9udW1mbXRfcmVhZF9mbG9hdOQEEWpkX29waXBlX29wZW5fY21k5QQUamRfb3BpcGVfb3Blbl9yZXBvcnTmBBZqZF9vcGlwZV9oYW5kbGVfcGFja2V05wQRamRfb3BpcGVfd3JpdGVfZXjoBBBqZF9vcGlwZV9wcm9jZXNz6QQUamRfb3BpcGVfY2hlY2tfc3BhY2XqBA5qZF9vcGlwZV93cml0ZesEDmpkX29waXBlX2Nsb3Nl7AQNamRfcXVldWVfcHVzaO0EDmpkX3F1ZXVlX2Zyb2507gQOamRfcXVldWVfc2hpZnTvBA5qZF9xdWV1ZV9hbGxvY/AEDWpkX3Jlc3BvbmRfdTjxBA5qZF9yZXNwb25kX3UxNvIEDmpkX3Jlc3BvbmRfdTMy8wQRamRfcmVzcG9uZF9zdHJpbmf0BBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZPUEC2pkX3NlbmRfcGt09gQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWz3BBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcvgEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXT5BBRqZF9hcHBfaGFuZGxlX3BhY2tldPoEFWpkX2FwcF9oYW5kbGVfY29tbWFuZPsEFWFwcF9nZXRfaW5zdGFuY2VfbmFtZfwEE2pkX2FsbG9jYXRlX3NlcnZpY2X9BBBqZF9zZXJ2aWNlc19pbml0/gQOamRfcmVmcmVzaF9ub3f/BBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkgAUUamRfc2VydmljZXNfYW5ub3VuY2WBBRdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZYIFEGpkX3NlcnZpY2VzX3RpY2uDBRVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeEBRpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZYUFFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWGBRRhcHBfZ2V0X2RldmljZV9jbGFzc4cFEmFwcF9nZXRfZndfdmVyc2lvbogFDWpkX3NydmNmZ19ydW6JBRdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZYoFEWpkX3NydmNmZ192YXJpYW50iwUNamRfaGFzaF9mbnYxYYwFDGpkX2RldmljZV9pZI0FCWpkX3JhbmRvbY4FCGpkX2NyYzE2jwUOamRfY29tcHV0ZV9jcmOQBQ5qZF9zaGlmdF9mcmFtZZEFDGpkX3dvcmRfbW92ZZIFDmpkX3Jlc2V0X2ZyYW1lkwUQamRfcHVzaF9pbl9mcmFtZZQFDWpkX3BhbmljX2NvcmWVBRNqZF9zaG91bGRfc2FtcGxlX21zlgUQamRfc2hvdWxkX3NhbXBsZZcFCWpkX3RvX2hleJgFC2pkX2Zyb21faGV4mQUOamRfYXNzZXJ0X2ZhaWyaBQdqZF9hdG9pmwULamRfdnNwcmludGacBQ9qZF9wcmludF9kb3VibGWdBQpqZF9zcHJpbnRmngUSamRfZGV2aWNlX3Nob3J0X2lknwUMamRfc3ByaW50Zl9hoAULamRfdG9faGV4X2GhBQlqZF9zdHJkdXCiBQlqZF9tZW1kdXCjBRZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlpAUWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZaUFEWpkX3NlbmRfZXZlbnRfZXh0pgUKamRfcnhfaW5pdKcFFGpkX3J4X2ZyYW1lX3JlY2VpdmVkqAUdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2upBQ9qZF9yeF9nZXRfZnJhbWWqBRNqZF9yeF9yZWxlYXNlX2ZyYW1lqwURamRfc2VuZF9mcmFtZV9yYXesBQ1qZF9zZW5kX2ZyYW1lrQUKamRfdHhfaW5pdK4FB2pkX3NlbmSvBRZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjsAUPamRfdHhfZ2V0X2ZyYW1lsQUQamRfdHhfZnJhbWVfc2VudLIFC2pkX3R4X2ZsdXNoswUQX19lcnJub19sb2NhdGlvbrQFDF9fZnBjbGFzc2lmebUFBWR1bW15tgUIX19tZW1jcHm3BQdtZW1tb3ZluAUGbWVtc2V0uQUKX19sb2NrZmlsZboFDF9fdW5sb2NrZmlsZbsFBmZmbHVzaLwFBGZtb2S9BQ1fX0RPVUJMRV9CSVRTvgUMX19zdGRpb19zZWVrvwUNX19zdGRpb193cml0ZcAFDV9fc3RkaW9fY2xvc2XBBQhfX3RvcmVhZMIFCV9fdG93cml0ZcMFCV9fZndyaXRleMQFBmZ3cml0ZcUFFF9fcHRocmVhZF9tdXRleF9sb2NrxgUWX19wdGhyZWFkX211dGV4X3VubG9ja8cFBl9fbG9ja8gFCF9fdW5sb2NryQUOX19tYXRoX2Rpdnplcm/KBQpmcF9iYXJyaWVyywUOX19tYXRoX2ludmFsaWTMBQNsb2fNBQV0b3AxNs4FBWxvZzEwzwUHX19sc2Vla9AFBm1lbWNtcNEFCl9fb2ZsX2xvY2vSBQxfX29mbF91bmxvY2vTBQxfX21hdGhfeGZsb3fUBQxmcF9iYXJyaWVyLjHVBQxfX21hdGhfb2Zsb3fWBQxfX21hdGhfdWZsb3fXBQRmYWJz2AUDcG932QUFdG9wMTLaBQp6ZXJvaW5mbmFu2wUIY2hlY2tpbnTcBQxmcF9iYXJyaWVyLjLdBQpsb2dfaW5saW5l3gUKZXhwX2lubGluZd8FC3NwZWNpYWxjYXNl4AUNZnBfZm9yY2VfZXZhbOEFBXJvdW5k4gUGc3RyY2hy4wULX19zdHJjaHJudWzkBQZzdHJjbXDlBQZzdHJsZW7mBQdfX3VmbG935wUHX19zaGxpbegFCF9fc2hnZXRj6QUHaXNzcGFjZeoFBnNjYWxibusFCWNvcHlzaWdubOwFB3NjYWxibmztBQ1fX2ZwY2xhc3NpZnls7gUFZm1vZGzvBQVmYWJzbPAFC19fZmxvYXRzY2Fu8QUIaGV4ZmxvYXTyBQhkZWNmbG9hdPMFB3NjYW5leHD0BQZzdHJ0b3j1BQZzdHJ0b2T2BRJfX3dhc2lfc3lzY2FsbF9yZXT3BQhkbG1hbGxvY/gFBmRsZnJlZfkFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZfoFBHNicmv7BQhfX2FkZHRmM/wFCV9fYXNobHRpM/0FB19fbGV0ZjL+BQdfX2dldGYy/wUIX19kaXZ0ZjOABg1fX2V4dGVuZGRmdGYygQYNX19leHRlbmRzZnRmMoIGC19fZmxvYXRzaXRmgwYNX19mbG9hdHVuc2l0ZoQGDV9fZmVfZ2V0cm91bmSFBhJfX2ZlX3JhaXNlX2luZXhhY3SGBglfX2xzaHJ0aTOHBghfX211bHRmM4gGCF9fbXVsdGkziQYJX19wb3dpZGYyigYIX19zdWJ0ZjOLBgxfX3RydW5jdGZkZjKMBgtzZXRUZW1wUmV0MI0GC2dldFRlbXBSZXQwjgYJc3RhY2tTYXZljwYMc3RhY2tSZXN0b3JlkAYKc3RhY2tBbGxvY5EGHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSSBhVlbXNjcmlwdGVuX3N0YWNrX2luaXSTBhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVllAYZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZZUGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZJYGDGR5bkNhbGxfamlqaZcGFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammYBhhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGWBgQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 27208;
var ___stop_em_js = Module['___stop_em_js'] = 28261;



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
