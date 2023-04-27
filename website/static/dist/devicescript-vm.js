
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
// devs_timeout === undefined - program is not running
// devs_timeout === null - the C code is executing, program running
// devs_timeout is number - we're waiting for timeout, program running
var devs_timeout = undefined;
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
        if (devs_timeout) {
            try {
                copyToHeap(pkt, Module._jd_em_frame_received);
            }
            catch (_a) { }
            clearDevsTimeout();
            process();
        }
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
    function process() {
        devs_timeout = null;
        try {
            const us = Module._jd_em_process();
            devs_timeout = setTimeout(process, us / 1000);
        }
        catch (e) {
            Module.error(e);
            devsStop();
        }
    }
    function clearDevsTimeout() {
        if (devs_timeout)
            clearInterval(devs_timeout);
        devs_timeout = undefined;
    }
    /**
     * Initializes and start the virtual machine (calls init).
     */
    function devsStart() {
        if (devs_timeout)
            return;
        Module.devsInit();
        devs_timeout = setTimeout(process, 10);
    }
    Exts.devsStart = devsStart;
    /**
     * Stops the virtual machine
     */
    function devsStop() {
        clearDevsTimeout();
    }
    Exts.devsStop = devsStop;
    /**
     * Indicates if the virtual machine is running
     * @returns true if the virtual machine is started.
     */
    function devsIsRunning() {
        return devs_timeout !== undefined;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9/f39/AX9gBX9+fn5+AGAAAX5gAn9/AXxgA39+fwF+YAJ/fABgAn9+AGABfgF/YAF8AX9gAX8BfGAEf35+fwBgBn9/f39/fwBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF+YAJ/fAF8YAJ+fwF8YAN8fH8BfGADfH5+AXxgAXwAYAJ+fgF/YAN/fn4AYAd/f39/f39/AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLhhYCAABcDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2Vudg5lbV9wcmludF9kbWVzZwAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA6OGgIAAoQYHCAEABwcHAAAHBAAIBwccAAACAwIABwgEAwMDAA4HDgAHBwMGAgcHAgcHAwkFBQUFBxcKDAUCBgMGAAACAgACAQAAAAACAQYFBQEABwYGAAAABwQDBAICAggDAAYABQICAgIAAwMFAAAAAQQAAgUABQUDAgIDAgIDBAMDAwkGBQIIAAIFAQEAAAAAAAAAAAEAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAAAAAAAAAAAAAAAAAACAAAAAgAAAwEBAQEBAQEBAQEBAQEBAQUBAwAAAQEBAQAKAAICAAEBAQABAQABAQAAAQAAAAAGAgIGCgABAAEBAQQBDgUAAgAAAAUAAAgDCQoCAgoCAwAGCQMBBgUDBgkGBgUGAQEBAwMFAwMDAwMDBgYGCQwGAwMDBQUDAwMDBgUGBgYGBgYBAw8RAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB0eAwQDBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGBQMDBAQDDBECAgYPAwMDAwUFAwMDBAQFBQUFAQMAAwMEAgADAAIFAAQDBQUGAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQIBAgQEAQoMAgIAAAcJCQEDBwECAAgAAgYABwkIAAQEBAAAAgcAEgMHBwECAQATAwkHAAAEAAIHAAIHBAcEBAMDAwUCCAUFBQQHBQcDAwUIAAUAAAQfAQMPAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAw4IAwAEAQAJAQMDAQMGBAwgCQkSAwMEAwcHBgcEBAgABAQHCQcIAAcIFAQFBQUEAAQYIRAFBAQEBQkEBAAAFQsLCxQLEAUIByILFRULGBQTEwsjJCUmCwMDAwQFAwMDAwMEEgQEGQ0WJw0oBhcpKgYPBAQACAQNFhoaDRErAgIICBYNDRkNLAAICAAECAcICAgtDC4Eh4CAgAABcAHqAeoBBYaAgIAAAQGAAoACBt2AgIAADn8BQeD7BQt/AUEAC38BQQALfwFBAAt/AEHY2QELfwBBx9oBC38AQZHcAQt/AEGN3QELfwBBid4BC38AQdneAQt/AEH63gELfwBB/+ABC38AQdjZAQt/AEH14QELB/2FgIAAIwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwCWBhZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AzAUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUAlwYaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQALxFqZF9lbV9kZXZzX2RlcGxveQAwEWpkX2VtX2RldnNfdmVyaWZ5ADEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADMWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMLBmZmbHVzaADUBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQAsQYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQCyBhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlALMGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZAC0BglzdGFja1NhdmUArQYMc3RhY2tSZXN0b3JlAK4GCnN0YWNrQWxsb2MArwYcZW1zY3JpcHRlbl9zdGFja19n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AbjYAUHQhgNqSQ0AIAMhBQwECyAAIAM2AgAgAEEDNgIEDAULQQAhBQJAIAEvAUogA00NACABKAK4ASADQQJ0aigCACEFCwJAIAUiBg0AIAMhBQwDCwJAAkAgBigCDCIFRQ0AIAAgAUEIIAUQpQMMAQsgACADNgIAIABBAjYCBAsgAyEFIAZFDQIMBAsCQCADDQAgAEIANwMADAQLIAAgAzYCACAAQQg2AgQgASADEJoBDAMLIAMhBSADQeUARg0BCyAEIAU2AgQgBCACNgIAQasKIAQQPCAAQgA3AwAMAQsCQCABKQA4IgdCAFINACABKAKwASIDRQ0AIAAgAykDIDcDAAwBCyAAIAc3AwALIARBEGokAAvPAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQgwUaIANBADoACiADKAIQECIgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQISEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBD8BBogAyAAKAIELQAOOgAKIAMoAhAPC0Gy0ABBmsIAQTFB8DsQsQUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQsAMNACADIAEpAwA3AxgCQAJAIAAgA0EYahDTAiICDQAgAyABKQMANwMQIAAgA0EQahDSAiEBDAELAkAgACACENQCIgENAEEAIQEMAQsCQCAAIAIQtAINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABCEAyADQShqIAAgBBDpAiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZAtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEK8CIAFqIQIMAQsgACACQQBBABCvAiABaiECCyADQcAAaiQAIAIL+AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiAD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ZCAGIAUgAyAEIAFBHGoQ/wIhAiABIAEoAhxBf2o2AhwgAkF/aiECCyAAIAFBEGogAiABKAIcEJUBCyAAKAKwASABKQMQNwMgCyABQfAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQ3wIhAiABIABB4ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEIgDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEJUCIAFBIGokAAsOACAAIABBABDgAhDhAgsPACAAIABBABDgAp0Q4QILgAICAn8BfiMAQfAAayIBJAAgASAAQdgAaikDADcDaCABIABB4ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahCwA0UNACABIAEpA2g3AxAgASAAIAFBEGoQ9QI2AgBBlBkgARA8DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEIgDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABCDAyECIAEgASkDaDcDMCABIAAgAUEwahD1AjYCJCABIAI2AiBBxhkgAUEgahA8IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALmAECAn8BfiMAQTBrIgEkACABIABB2ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEIgDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEIMDIgJFDQAgAiABQSBqEOQEIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlgEQpQMgACgCsAEgASkDGDcDIAsgAUEwaiQACzEBAX8jAEEQayIBJAAgAUEIaiAAKQPIAboQogMgACgCsAEgASkDCDcDICABQRBqJAALoQECAX8BfiMAQTBrIgEkACABIABB2ABqKQMAIgI3AyggASACNwMQAkACQAJAIAAgAUEQakGPARC1A0UNABCkBSECDAELIAEgASkDKDcDCCAAIAFBCGpBmwEQtQNFDQEQmgIhAgsgAUEINgIAIAEgAjcDICABIAFBIGo2AgQgAUEYaiAAQdwgIAEQhgMgACgCsAEgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAEN8CIQIgASAAQeAAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahDeASIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABCZAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8QmQMMAQsgAEG5AmogAjoAACAAQboCaiADLwEQOwEAIABBsAJqIAMpAwg3AgAgAy0AFCECIABBuAJqIAQ6AAAgAEGvAmogAjoAACAAQbwCaiADKAIcQQxqIAQQzwUaIAAQlAILIAFBIGokAAukAgIDfwF+IwBB0ABrIgEkACAAQQAQ3wIhAiABIABB4ABqKQMAIgQ3A0gCQAJAIARQDQAgASABKQNINwM4IAAgAUE4ahCAAw0AIAEgASkDSDcDMCABQcAAaiAAQcIAIAFBMGoQlwMMAQsCQCACQYCAgIB/cUGAgICAAUYNACABQcAAaiAAQakVQQAQlQMMAQsgASABKQNINwMoAkACQAJAIAAgAUEoaiACEKECIgNBA2oOAgEAAgsgASACNgIAIAFBwABqIABBiQsgARCUAwwCCyABIAEpA0g3AyAgASAAIAFBIGpBABCDAzYCECABQcAAaiAAQbM2IAFBEGoQlQMMAQsgA0EASA0AIAAoArABIAOtQoCAgIAghDcDIAsgAUHQAGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEOUCIgJFDQACQCACKAIEDQAgAiAAQRwQsAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEIQDCyABIAEpAwg3AwAgACACQfYAIAEQigMgACACEOQCCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABDlAiICRQ0AAkAgAigCBA0AIAIgAEEgELACNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABCEAwsgASABKQMINwMAIAAgAkH2ACABEIoDIAAgAhDkAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ5QIiAkUNAAJAIAIoAgQNACACIABBHhCwAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQhAMLIAEgASkDCDcDACAAIAJB9gAgARCKAyAAIAIQ5AILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEOUCIgJFDQACQCACKAIEDQAgAiAAQSIQsAI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQYQBEIQDCyABIAEpAwg3AwAgACACQfYAIAEQigMgACACEOQCCyABQRBqJAALYgEBfyMAQSBrIgMkACADIAIpAwA3AxAgA0EYaiABIANBEGpB+wAQzAICQAJAIAMpAxhCAFINACAAQgA3AwAMAQsgAyADKQMYNwMIIAAgASADQQhqQeMAEMwCCyADQSBqJAALNAIBfwF+IwBBEGsiASQAIAEgACkDUCICNwMAIAEgAjcDCCAAIAEQkAMgABBZIAFBEGokAAumAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEJcDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFBzzZBABCVAwsgAiEBCwJAAkAgASIBRQ0AIAAgASgCHBCjAwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqEJcDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFBzzZBABCVAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhCkAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1A3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqEJcDQQAhAgwBCwJAIAAgASgCEBB8IgINACABQRhqIABBzzZBABCVAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBmThBABCVAwwBCyACIABB2ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNQNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahCXA0EAIQAMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQc82QQAQlQMLIAIhAAsCQCAAIgBFDQAgABB+CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoArABIQIgASAAQdgAaikDACIENwMAIAEgBDcDCCAAIAEQqgEhAyAAKAKwASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALGQAgACgCsAEiACAANQIcQoCAgIAQhDcDIAtZAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABB4ShBABCVAwwBCyAAIAJBf2pBARB9IgJFDQAgACgCsAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahDKAiIEQc+GA0sNACABKACoASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBiCMgA0EIahCYAwwBCyAAIAEgASgCoAEgBEH//wNxELoCIAApAwBCAFINACADQdgAaiABQQggASABQQIQsAIQjwEQpQMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEIQDIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahDbAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQuAIgAyAAKQMANwMQIAEgA0EQahCOAQsgA0HwAGokAAvAAQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahDKAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQlwMMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwG42AFODQIgAEHw7QAgAUEDdGovAQAQhAMMAQsgACABKACoASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtBzxVBncAAQTFBgDAQsQUAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQsAMNACABQThqIABBjxwQlgMLIAEgASkDSDcDICABQThqIAAgAUEgahCIAyABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEI0BIAEgASkDSDcDEAJAIAAgAUEQaiABQThqEIMDIgJFDQAgAUEwaiAAIAIgASgCOEEBEKcCIAAoArABIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjgEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECEN8CIQIgASABKQMgNwMIAkAgAUEIahCwAw0AIAFBGGogAEH5HRCWAwsgASABKQMoNwMAIAFBEGogACABIAJBARCqAiAAKAKwASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCsAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQpgObEOECCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoArABIAI3AyAMAQsgASABKQMINwMAIAAgACABEKYDnBDhAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKwASACNwMgDAELIAEgASkDCDcDACAAIAAgARCmAxD6BRDhAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxCjAwsgACgCsAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQpgMiBEQAAAAAAAAAAGNFDQAgACAEmhDhAgwBCyAAKAKwASABKQMYNwMgCyABQSBqJAALFQAgABClBbhEAAAAAAAA8D2iEOECC2QBBX8CQAJAIABBABDfAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEKUFIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQ4gILEQAgACAAQQAQ4AIQ5QUQ4QILGAAgACAAQQAQ4AIgAEEBEOACEPEFEOECCy4BA38gAEEAEN8CIQFBACECAkAgAEEBEN8CIgNFDQAgASADbSECCyAAIAIQ4gILLgEDfyAAQQAQ3wIhAUEAIQICQCAAQQEQ3wIiA0UNACABIANvIQILIAAgAhDiAgsWACAAIABBABDfAiAAQQEQ3wJsEOICCwkAIABBARDXAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahCnAyEDIAIgAikDIDcDECAAIAJBEGoQpwMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKwASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEKYDIQYgAiACKQMgNwMAIAAgAhCmAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoArABQQApA4B3NwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCsAEgASkDADcDICACQTBqJAALCQAgAEEAENcBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahCwAw0AIAEgASkDKDcDECAAIAFBEGoQzwIhAiABIAEpAyA3AwggACABQQhqENMCIgNFDQAgAkUNACAAIAIgAxCxAgsgACgCsAEgASkDKDcDICABQTBqJAALCQAgAEEBENsBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahDTAiIDRQ0AIABBABCRASIERQ0AIAJBIGogAEEIIAQQpQMgAiACKQMgNwMQIAAgAkEQahCNASAAIAMgBCABELUCIAIgAikDIDcDCCAAIAJBCGoQjgEgACgCsAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDbAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahCtAyICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4G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YGogBy8BCkECdGoiAi8BAiAFRg0AA0AgBEEBaiIBIANGDQIgASEEIAIgAUEDdGovAQIgBUcNAAsgASADSSEIIAEhCQsgCCEEIAIgCUEDdGohAQwCCyABIANJIQQLIAYhAQsgASEBAkACQCAEIgJFDQAgByEEDAELIAAgBxDGAiEECyAEIQQgASEDIAEhASACRQ0ACwsgAQu3AQEDfyMAQSBrIgEkACABIAApA1A3AxACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECIDRQ0AIAMhAiADKAIAQYCAgPgAcUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQlwNBACECCwJAIAAgAiICEPABIgNFDQAgAUEIaiAAIAMgAigCHCICQQxqIAIvAQQQ+AEgACgCsAEgASkDCDcDIAsgAUEgaiQAC+gBAgJ/AX4jAEEgayIBJAAgASAAKQNQNwMQAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQlwMACyAAQawCakEAQfwBENEFGiAAQboCakEDOwEAIAIpAwghAyAAQbgCakEEOgAAIABBsAJqIAM3AgAgAEG8AmogAi8BEDsBACAAQb4CaiACLwEWOwEAIAFBCGogACACLwESEJYCIAAoArABIAEpAwg3AyAgAUEgaiQAC6EBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahDAAiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQlwMLAkACQCACDQAgAEIANwMADAELAkAgASACEMICIgJBf0oNACAAQgA3AwAMAQsgACABIAIQuwILIANBMGokAAuPAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQwAIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqEJcDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIp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ASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABByjkgAhCVAyAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQS2ohAwsgAEG4AmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahDAAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGxHiABQRBqEJgDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGkHiABQQhqEJgDQQAhAwsCQCADIgNFDQAgACADEPsBIAAgASgCJCADLwECQf8fcUGAwAByEJMCCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEMACIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQbEeIANBCGoQmANBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahDAAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGxHiADQQhqEJgDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQwAIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBsR4gA0EIahCYA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRCjAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQwAIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBsR4gAUEQahCYA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEo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QAJAIANBDGogBEGAgAFyIgQQtwMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIEBCyACQQEQsAIhBCADIAMpAxA3AwAgACACIAQgAxDWAiADQSBqJAALVQECfyMAQRBrIgIkACACQQhqIAEQpQQCQAJAIAEoAkwiAyAAKAIQLwEISQ0AIAIgAUHvABCBAQwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtWAQJ/IwBBEGsiAiQAIAJBCGogARClBAJAAkAgASgCTCIDIAEoAqgBLwEMSQ0AIAIgAUHxABCBAQwBCyABKAIAIANBA3RqIAIpAwg3AwALIAJBEGokAAthAQN/IwBBIGsiAiQAIAJBGGogARClBCABEKYEIQMgARCmBCEEIAJBEGogAUEBEKgEAkAgAikDEFANACACIAIpAxA3AwAgAkEIaiABIAQgAyACIAJBGGoQSQsgAkEgaiQACw0AIABBACkDiHc3AwALNwEBfwJAIAIoAkwiAyABKAIQLwEITw0AIAAgASADQQN0akEYaikDADcDAA8LIAAgAkHzABCBAQs4AQF/AkAgAigCTCIDIAIoAqgBLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkH2ABCBAQtxAQF/IwBBIGsiAyQAIANBGGogAhClBCADIAMpAxg3AxACQAJAAkAgA0EQahCBAw0AIAMoAhwNASADKAIYQQJHDQELIAAgAykDGDcDAAwBCyADIAMpAxg3AwggACACIANBCGoQpgMQogMLIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhClBCADQRBqIAIQpQQgAyADKQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADENoCIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARClBCACQSBqIAEQpQQgAkEYaiABEKUEIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQ2wIgAkEwaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQpQQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIABciIEELcDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENgCCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQpQQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIACciIEELcDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENgCCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQpQQgAyADKQMgNwMoIAIoAkwhBCADIAIoAqgBNgIcAkACQCADQRxqIARBgIADciIEELcDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENgCCyADQcAAaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqgBNgIMAkACQCADQQxqIARBgIABciIEELcDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEAELACIQQgAyADKQMQNwMAIAAgAiAEIAMQ1gIgA0EgaiQAC44BAQJ/IwBBIGsiAyQAIAIoAkwhBCADIAIoAqgBNgIMAkACQCADQQxqIARBgIABciIEELcDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEVELACIQQgAyADKQMQNwMAIAAgAiAEIAMQ1gIgA0EgaiQAC00BA38jAEEQayICJAACQCABIAFBAhCwAhCPASIDDQAgAUEQEFMLIAEoArABIQQgAkEIaiABQQggAxClAyAEIAIpAwg3AyAgAkEQaiQAC1MBA38jAEEQayICJAACQCABIAEQpgQiAxCRASIEDQAgASADQQN0QRBqEFMLIAEoArABIQMgAkEIaiABQQggBBClAyADIAIpAwg3AyAgAkEQaiQAC1ABA38jAEEQayICJAACQCABIAEQpgQiAxCSASIEDQAgASADQQxqEFMLIAEoArABIQMgAkEIaiABQQggBBClAyADIAIpAwg3AyAgAkEQaiQACzUBAX8CQCACKAJMIgMgAigCqAEvAQ5JDQAgACACQYMBEIEBDwsgACACQQggAiADEM0CEKUDC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCqAE2AgQCQAJAIANBBGogBBC3Aw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgQELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqgBNgIEAkACQCADQQRqIARBgIABciIEELcDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCBAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCqAE2AgQCQAJAIANBBGogBEGAgAJyIgQQtwMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIEBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKoATYCBAJAAkAgA0EEaiAEQYCAA3IiBBC3Aw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgQELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKgBQSRqKAIAQQR2SQ0AIAAgAkH4ABCBAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEKMDC0MBAn8CQCACKAJMIgMgAigAqAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQgQELXwEDfyMAQRBrIgMkACACEKYEIQQgAhCmBCEFIANBCGogAkECEKgEAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBJCyADQRBqJAALEAAgACACKAKwASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhClBCADIAMpAwg3AwAgACACIAMQrwMQowMgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhClBCAAQfD2AEH49gAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA/B2NwMACw0AIABBACkD+HY3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQpQQgAyADKQMINwMAIAAgAiADEKgDEKQDIANBEGokAAsNACAAQQApA4B3NwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEKUEAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEKYDIgREAAAAAAAAAABjRQ0AIAAgBJoQogMMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkD6HY3AwAMAgsgAEEAIAJrEKMDDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhCnBEF/cxCjAwsyAQF/IwBBEGsiAyQAIANBCGogAhClBCAAIAMoAgxFIAMoAghBAkZxEKQDIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhClBAJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxCmA5oQogMMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQPodjcDAAwBCyAAQQAgAmsQowMLIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhClBCADIAMpAwg3AwAgACACIAMQqANBAXMQpAMgA0EQaiQACwwAIAAgAhCnBBCjAwupAgIFfwF8IwBBwABrIgMkACADQThqIAIQpQQgAkEYaiIEIAMpAzg3AwAgA0E4aiACEKUEIAIgAykDODcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBIIAUoAgAiByAGaiIGIAdIcw0AIAAgBhCjAwwBCyADIAUpAwA3AzACQAJAIAIgA0EwahCAAw0AIAMgBCkDADcDKCACIANBKGoQgANFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahCLAwwBCyADIAUpAwA3AyAgAiACIANBIGoQpgM5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEKYDIgg5AwAgACAIIAIrAyCgEKIDCyADQcAA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EKUEIANBEGogAhClBCADIAMpAxg3AwggAiADQQhqENUCIQQgAyADKQMQNwMAIAAgAiADIAQQ1wIQpAMgA0EgaiQACw0AIABBACkDkHc3AwALnQEBA38jAEEgayIDJAAgA0EYaiACEKUEIAJBGGoiBCADKQMYNwMAIANBGGogAhClBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqELIDIQILIAAgAhCkAyADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEKUEIAJBGGoiBCADKQMYNwMAIANBGGogAhClBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqELIDQQFzIQILIAAgAhCkAyADQSBqJAALLAEBfyMAQRBrIgIkACACQQhqIAEQpQQgASgCsAEgAikDCDcDICACQRBqJAALLgEBfwJAIAIoAkwiAyACKAKoAS8BDkkNACAAIAJBgAEQgQEPCyAAIAIgAxC7Ags/AQF/AkAgAS0AQiICDQAgACABQewAEIEBDwsgASACQX9qIgI6AEIgACABIAJB/wFxQQN0akHQAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIEBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEKcDIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AQiICDQAgAUEIaiAAQewAEIEBDAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEKcDIQAgAUEQaiQAIAALiQICAn8BfiMAQcAAayIDJAACQAJAIAEtAEIiBA0AIANBOGogAUHsABCBAQwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQqQMNAAJAIAJBAnFFDQAgAyADKQM4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ECMNAAJAQQAtAN71AUUNABDIBRCXBUHc9QEQqgULDwtBxsIAQakBQZQoEKwFAAsGAEHY9wELTwIBfgJ/AkACQCAAvSIBQjSIp0H/D3EiAkH/D0YNAEEEIQMgAg0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC44EAQN/AkAgAkGABEkNACAAIAEgAhATIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQzwUPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKALc9wFFDQBBACgC3PcBENQFIQELAkBBACgC0NkBRQ0AQQAoAtDZARDUBSABciEBCwJAEOoFKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABDSBSECCwJAIAAoAhQgACgCHEYNACAAENQFIAFyIQELAkAgAkUNACAAENMFCyAAKAI4IgANAAsLEOsFIAEPC0EAIQICQCAAKAJMQQBIDQAgABDSBSECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEFABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoERAAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQ0wULIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQ1gUhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv//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AiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChCcBkEASg0AAkAgASAJIAMgChCcBkUNACABIQQMAgsgBUHwAGogASACQgBCABCmBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQpgYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEKYGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABCmBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQpgYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EKYGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkGc2AFqKAIAIQYgAkGQ2AFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEIcGIQILIAIQiAYNAAtBASEIAkACQCACQVVqDgMAAQAB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IApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahCbBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQmwZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEJsGIAVBMGogCiABIAcQpQYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxCbBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahCbBiAFIAIgBEEBIAZrEKUGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBCjBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCkBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEJsGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQmwYgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQpwYgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQpwYgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQpwYgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQpwYgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQpwYgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQpwYgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQpwYgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQpwYgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQpwYgBUGQAWogA0IPhkIAIARCABCnBiAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEKcGIAVBgAFqQgEgAn1CACAEQgAQpwYgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhCnBiABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhCnBiABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEKUGIAVBMGogFiATIAZB8ABqEJsGIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEKcGIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQpwYgBSADIA5CBUIAEKcGIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahCbBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCbBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEJsGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEJsGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEJsGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEJsGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEJsGIAVBIGogAiAEIAYQmwYgBUEQaiASIAEgBxClBiAFIAIgBCAHEKUGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCaBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQmwYgAiAAIARBgfgAIANrEKUGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABB4PsFJANB4PsBQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEQAAslAQF+IAAgASACrSADrUIghoQgBBC1BiEFIAVCIIinEKsGIAWnCxMAIAAgAacgAUIgiKcgAiADEBYLC47agYAAAwBBgAgLqNABaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBkZXZzX3ZlcmlmeQBzdHJpbmdpZnkAc3RtdDJfY2FsbF9hcnJheQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AEV4cGVjdGluZyBzdHJpbmcsIGJ1ZmZlciBvciBhcnJheQBpc0FycmF5AGRlbGF5AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGRldnNfamRfc2VuZF9yYXcAaWRpdgBwcmV2ACVzXyV1AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydAByZXN0YXJ0AGRldnNfZmliZXJfc3RhcnQAKGNvbnN0IHVpbnQ4X3QgKikobGFzdF9lbnRyeSArIDEpIDw9IGRhdGFfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAd2FpdAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX3JvbGVfc2V0X2hpbnRzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzADB4MXh4eHh4eHggZXhwZWN0ZWQgZm9yIHNlcnZpY2UgY2xhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwB3c3M6Ly8lcyVzAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcABkZXZzX2R1bXBfaGVhcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBjaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAHNtYWxsIG1zZwBuZWVkIGZ1bmN0aW9uIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAX2RjZmdTdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3ogPT0gcy0+aW5uZXIuc2l6ZQBzdGF0ZS5vZmYgKyAzIDw9IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1NuOiBjbG9zZQByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAGZhbHNlAGZsYXNoX2VyYXNlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAF9hbGxvY1JvbGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAHN0YXRzOiAlZCBvYmplY3RzLCAlZCBCIHVzZWQsICVkIEIgZnJlZQBtZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlAGRlY29kZQBldmVudENvZGUAZnJvbUNoYXJDb2RlAHJlZ0NvZGUAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAU2VydmVySW50ZXJmYWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kACEgc2VydmljZSAlczolZCBub3QgZm91bmQAYm91bmQAaXNCb3VuZAByb2xlbWdyX2F1dG9iaW5kAGpkaWY6IGF1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABzdXNwZW5kAF9zZXJ2ZXJTZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG5vdEltcGxlbWVudGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZAByb2xlIG5hbWUgJyVzJyBhbHJlYWR5IHVzZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAamRpZjogY3JlYXRlIHJvbGUgJyVzJyAtPiAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzX3N0cmluZ19qbXBfdHJ5X2FsbG9jAGRldnNkYmdfcGlwZV9hbGxvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAZmxhc2ggc3luYwBfcGFuaWMAYmFkIG1hZ2ljAGpkX2ZzdG9yX2djAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGZzdG9yOiBnYwBkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWMAUGFja2V0U3BlYwBTZXJ2aWNlU3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvaW5zcGVjdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L2ltcGxfcGFja2V0c3BlYy5jAGRldmljZXNjcmlwdC9pbXBsX3NlcnZpY2VzcGVjLmMAZGV2aWNlc2NyaXB0L3V0ZjguYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtSb2xlOiAlcy4lc10AW1BhY2tldFNwZWM6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtTZXJ2aWNlU3BlYzogJXNdAFtDaXJjdWxhcl0AW0J1ZmZlclsldV0gJSpwXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJSpwLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAc3ogPT0gbGVuICYmIHN6IDwgREVWU19NQVhfQVNDSUlfU1RSSU5HAG1ncjogd291bGQgcmVzdGFydCBkdWUgdG8gRENGRwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwAlYyAgJXMgPT4Ad3NzazoAdXRmOAB1dGYtOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAMTI3LjAuMC4xAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABpZHggPj0gMAByID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgAhICAuLi4ALABkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAZGV2c19oYW5kbGVfdHlwZSh2KSA9PSBERVZTX0hBTkRMRV9UWVBFX0dDX09CSkVDVCAmJiBkZXZzX2lzX3N0cmluZyhjdHgsIHYpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpACEgRXhjZXB0aW9uOiBQYW5pY18lZCBhdCAoZ3BjOiVkKQAqICBhdCB1bmtub3duIChncGM6JWQpACogIGF0ICVzX0YlZCAocGM6JWQpACEgIGF0ICVz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IGRhdGEgPSBNb2R1bGUuZmxhc2hMb2FkKCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZygiZmxhc2ggbG9hZCwgc2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AALb+gIAABG5hbWUBxn24BgANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcEZXhpdAgLZW1fdGltZV9ub3cJDmVtX3ByaW50X2RtZXNnCiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQshZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkDBhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcNMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQPM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZBA1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQRGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEg9fX3dhc2lfZmRfY2xvc2UTFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxQPX193YXNpX2ZkX3dyaXRlFRZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFhpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxcRX193YXNtX2NhbGxfY3RvcnMYD2ZsYXNoX2Jhc2VfYWRkchkNZmxhc2hfcHJvZ3JhbRoLZmxhc2hfZXJhc2UbCmZsYXNoX3N5bmMcCmZsYXNoX2luaXQdCGh3X3BhbmljHghqZF9ibGluax8HamRfZ2xvdyAUamRfYWxsb2Nfc3RhY2tfY2hlY2shCGpkX2FsbG9jIgdqZF9mcmVlIw10YXJnZXRfaW5faXJxJBJ0YXJnZXRfZGlzYWJsZV9pcnElEXRhcmdldF9lbmFibGVfaXJxJhhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmcnEmRldnNfcGFuaWNfaGFuZGxlcigTZGV2c19kZXBsb3lfaGFuZGxlcikUamRfY3J5cHRvX2dldF9yYW5kb20qEGpkX2VtX3NlbmRfZnJhbWUrGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy0KamRfZW1faW5pdC4NamRfZW1fcHJvY2Vzcy8UamRfZW1fZnJhbWVfcmVjZWl2ZWQwEWpkX2VtX2RldnNfZGVwbG95MRFqZF9lbV9kZXZzX3ZlcmlmeTIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcPYXBwX3ByaW50X2RtZXNnOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAlhcHBfZG1lc2c9C2ZsdXNoX2RtZXNnPgthcHBfcHJvY2Vzcz8HdHhfaW5pdEAPamRfcGFja2V0X3JlYWR5QQp0eF9wcm9jZXNzQhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUMOamRfd2Vic29ja19uZXdEBm9ub3BlbkUHb25lcnJvckYHb25jbG9zZUcJb25tZXNzYWdlSBBqZF93ZWJzb2NrX2Nsb3NlSQ5kZXZzX2J1ZmZlcl9vcEoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVURZGV2c2Nsb3VkX3Byb2Nlc3NWF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VxRkZXZzY2xvdWRfb25fbWVzc2FnZVgOZGV2c2Nsb3VkX2luaXRZFGRldnNfdHJhY2tfZXhjZXB0aW9uWg9kZXZzZGJnX3Byb2Nlc3NbEWRldnNkYmdfcmVzdGFydGVkXBVkZXZzZGJnX2hhbmRsZV9wYWNrZXRdC3NlbmRfdmFsdWVzXhF2YWx1ZV9mcm9tX3RhZ192MF8ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZWANb2JqX2dldF9wcm9wc2EMZXhwYW5kX3ZhbHVlYhJkZXZzZGJnX3N1c3BlbmRfY2JjDGRldnNkYmdfaW5pdGQQZXhwYW5kX2tleV92YWx1ZWUGa3ZfYWRkZg9kZXZzbWdyX3Byb2Nlc3NnB3RyeV9ydW5oDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBARVfZGV2c19pbnZhbGlkX3Byb2dyYW2CARhkZXZzX2ZpYmVyX2dldF9tYXhfc2xlZXCDAQ9kZXZzX2ZpYmVyX3Bva2WEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OTARVkZXZzX3N0cmluZ190cnlfYWxsb2OUARBkZXZzX3N0cmluZ19wcmVwlQESZGV2c19zdHJpbmdfZmluaXNolgEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSXAQ9kZXZzX2djX3NldF9jdHiYAQ5kZXZzX2djX2NyZWF0ZZkBD2RldnNfZ2NfZGVzdHJveZoBEWRldnNfZ2Nfb2JqX2NoZWNrmwEOZGV2c19kdW1wX2hlYXCcAQtzY2FuX2djX29iap0BEXByb3BfQXJyYXlfbGVuZ3RongESbWV0aDJfQXJyYXlfaW5zZXJ0nwESZnVuMV9BcnJheV9pc0FycmF5oAEQbWV0aFhfQXJyYXlfcHVzaKEBFW1ldGgxX0FycmF5X3B1c2hSYW5nZaIBEW1ldGhYX0FycmF5X3NsaWNlowEQbWV0aDFfQXJyYXlfam9pbqQBEWZ1bjFfQnVmZmVyX2FsbG9jpQEQZnVuMV9CdWZmZXJfZnJvbaYBEnByb3BfQnVmZmVyX2xlbmd0aKcBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6gBE21ldGgzX0J1ZmZlcl9maWxsQXSpARNtZXRoNF9CdWZmZXJfYmxpdEF0qgEUZGV2c19jb21wdXRlX3RpbWVvdXSrARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcKwBF2Z1bjFfRGV2aWNlU2NyaXB0X2RlbGF5rQEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljrgEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290rwEZZnVuMF9EZXZpY2VTY3JpcHRfcmVzdGFydLABGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdLEBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50sgEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdLMBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50tAEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHK1AR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ7YBGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc7cBImZ1bjFfRGV2aWNlU2NyaXB0X2RldmljZUlkZW50aWZpZXK4AR1mdW4yX0RldmljZVNjcmlwdF9fc2VydmVyU2VuZLkBHGZ1bjJfRGV2aWNlU2NyaXB0X19hbGxvY1JvbGW6ARRtZXRoMV9FcnJvcl9fX2N0b3JfX7sBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+8ARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+9ARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX74BD3Byb3BfRXJyb3JfbmFtZb8BEW1ldGgwX0Vycm9yX3ByaW50wAEPcHJvcF9Ec0ZpYmVyX2lkwQEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZMIBFG1ldGgxX0RzRmliZXJfcmVzdW1lwwEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGXEARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5kxQERZnVuMF9Ec0ZpYmVyX3NlbGbGARRtZXRoWF9GdW5jdGlvbl9zdGFydMcBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBlyAEScHJvcF9GdW5jdGlvbl9uYW1lyQEPZnVuMl9KU09OX3BhcnNlygETZnVuM19KU09OX3N0cmluZ2lmecsBDmZ1bjFfTWF0aF9jZWlszAEPZnVuMV9NYXRoX2Zsb29yzQEPZnVuMV9NYXRoX3JvdW5kzgENZnVuMV9NYXRoX2Fic88BEGZ1bjBfTWF0aF9yYW5kb23QARNmdW4xX01hdGhfcmFuZG9tSW500QENZnVuMV9NYXRoX2xvZ9IBDWZ1bjJfTWF0aF9wb3fTAQ5mdW4yX01hdGhfaWRpdtQBDmZ1bjJfTWF0aF9pbW9k1QEOZnVuMl9NYXRoX2ltdWzWAQ1mdW4yX01hdGhfbWlu1wELZnVuMl9taW5tYXjYAQ1mdW4yX01hdGhfbWF42QESZnVuMl9PYmplY3RfYXNzaWdu2gEQZnVuMV9PYmplY3Rfa2V5c9sBE2Z1bjFfa2V5c19vcl92YWx1ZXPcARJmdW4xX09iamVjdF92YWx1ZXPdARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZt4BHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm933wEScHJvcF9Ec1BhY2tldF9yb2xl4AEecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVy4QEVcHJvcF9Ec1BhY2tldF9zaG9ydElk4gEacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXjjARxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5k5AETcHJvcF9Ec1BhY2tldF9mbGFnc+UBF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5k5gEWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydOcBFXByb3BfRHNQYWNrZXRfcGF5bG9hZOgBFXByb3BfRHNQYWNrZXRfaXNFdmVudOkBF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2Rl6gEWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldOsBFnByb3BfRHNQYWNrZXRfaXNSZWdHZXTsARVwcm9wX0RzUGFja2V0X3JlZ0NvZGXtARZwcm9wX0RzUGFja2V0X2lzQWN0aW9u7gEVZGV2c19wa3Rfc3BlY19ieV9jb2Rl7wEScHJvcF9Ec1BhY2tldF9zcGVj8AERZGV2c19wa3RfZ2V0X3NwZWPxARVtZXRoMF9Ec1BhY2tldF9kZWNvZGXyAR1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZPMBGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudPQBFnByb3BfRHNQYWNrZXRTcGVjX25hbWX1ARZwcm9wX0RzUGFja2V0U3BlY19jb2Rl9gEacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2X3ARltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2Rl+AESZGV2c19wYWNrZXRfZGVjb2Rl+QEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk+gEURHNSZWdpc3Rlcl9yZWFkX2NvbnT7ARJkZXZzX3BhY2tldF9lbmNvZGX8ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl/QEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZf4BFnByb3BfRHNQYWNrZXRJbmZvX25hbWX/ARZwcm9wX0RzUGFja2V0SW5mb19jb2RlgAIYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fgQITcHJvcF9Ec1JvbGVfaXNCb3VuZIICEHByb3BfRHNSb2xlX3NwZWODAhhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmSEAiJwcm9wX0RzU2VydmljZVNwZWNfY2xhc3NJZGVudGlmaWVyhQIXcHJvcF9Ec1NlcnZpY2VTcGVjX25hbWWGAhptZXRoMV9Ec1NlcnZpY2VTcGVjX2xvb2t1cIcCGm1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduiAIScHJvcF9TdHJpbmdfbGVuZ3RoiQIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXSKAhNtZXRoMV9TdHJpbmdfY2hhckF0iwISbWV0aDJfU3RyaW5nX3NsaWNljAIYZnVuWF9TdHJpbmdfZnJvbUNoYXJDb2RljQIMZGV2c19pbnNwZWN0jgILaW5zcGVjdF9vYmqPAgdhZGRfc3RykAINaW5zcGVjdF9maWVsZJECFGRldnNfamRfZ2V0X3JlZ2lzdGVykgIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZJMCEGRldnNfamRfc2VuZF9jbWSUAhBkZXZzX2pkX3NlbmRfcmF3lQITZGV2c19qZF9zZW5kX2xvZ21zZ5YCE2RldnNfamRfcGt0X2NhcHR1cmWXAhFkZXZzX2pkX3dha2Vfcm9sZZgCEmRldnNfamRfc2hvdWxkX3J1bpkCE2RldnNfamRfcHJvY2Vzc19wa3SaAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWSbAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZZwCEmRldnNfamRfYWZ0ZXJfdXNlcp0CFGRldnNfamRfcm9sZV9jaGFuZ2VkngIUZGV2c19qZF9yZXNldF9wYWNrZXSfAhJkZXZzX2pkX2luaXRfcm9sZXOgAhJkZXZzX2pkX2ZyZWVfcm9sZXOhAhJkZXZzX2pkX2FsbG9jX3JvbGWiAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3OjAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc6QCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc6UCEGRldnNfanNvbl9lc2NhcGWmAhVkZXZzX2pzb25fZXNjYXBlX2NvcmWnAg9kZXZzX2pzb25fcGFyc2WoAgpqc29uX3ZhbHVlqQIMcGFyc2Vfc3RyaW5nqgITZGV2c19qc29uX3N0cmluZ2lmeasCDXN0cmluZ2lmeV9vYmqsAhFwYXJzZV9zdHJpbmdfY29yZa0CCmFkZF9pbmRlbnSuAg9zdHJpbmdpZnlfZmllbGSvAhFkZXZzX21hcGxpa2VfaXRlcrACF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0sQISZGV2c19tYXBfY29weV9pbnRvsgIMZGV2c19tYXBfc2V0swIGbG9va3VwtAITZGV2c19tYXBsaWtlX2lzX21hcLUCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc7YCEWRldnNfYXJyYXlfaW5zZXJ0twIIa3ZfYWRkLjG4AhJkZXZzX3Nob3J0X21hcF9zZXS5Ag9kZXZzX21hcF9kZWxldGW6AhJkZXZzX3Nob3J0X21hcF9nZXS7AiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkeLwCHGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWO9AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWO+Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHi/AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY8ACF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0wQIYZGV2c19yb2xlX3NwZWNfZm9yX2NsYXNzwgIXZGV2c19wYWNrZXRfc3BlY19wYXJlbnTDAg5kZXZzX3JvbGVfc3BlY8QCEWRldnNfcm9sZV9zZXJ2aWNlxQIOZGV2c19yb2xlX25hbWXGAhJkZXZzX2dldF9iYXNlX3NwZWPHAhBkZXZzX3NwZWNfbG9va3VwyAISZGV2c19mdW5jdGlvbl9iaW5kyQIRZGV2c19tYWtlX2Nsb3N1cmXKAg5kZXZzX2dldF9mbmlkeMsCE2RldnNfZ2V0X2ZuaWR4X2NvcmXMAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGTNAhNkZXZzX2dldF9zcGVjX3Byb3RvzgITZGV2c19nZXRfcm9sZV9wcm90b88CG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd9ACGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZNECFWRldnNfZ2V0X3N0YXRpY19wcm90b9ICG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb9MCHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVt1AIWZGV2c19tYXBsaWtlX2dldF9wcm90b9UCGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZNYCGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZNcCEGRldnNfaW5zdGFuY2Vfb2bYAg9kZXZzX29iamVjdF9nZXTZAgxkZXZzX3NlcV9nZXTaAgxkZXZzX2FueV9nZXTbAgxkZXZzX2FueV9zZXTcAgxkZXZzX3NlcV9zZXTdAg5kZXZzX2FycmF5X3NldN4CE2RldnNfYXJyYXlfcGluX3B1c2jfAgxkZXZzX2FyZ19pbnTgAg9kZXZzX2FyZ19kb3VibGXhAg9kZXZzX3JldF9kb3VibGXiAgxkZXZzX3JldF9pbnTjAg1kZXZzX3JldF9ib29s5AIPZGV2c19yZXRfZ2NfcHRy5QIRZGV2c19hcmdfc2VsZl9tYXDmAhFkZXZzX3NldHVwX3Jlc3VtZecCD2RldnNfY2FuX2F0dGFjaOgCGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWXpAhVkZXZzX21hcGxpa2VfdG9fdmFsdWXqAhJkZXZzX3JlZ2NhY2hlX2ZyZWXrAhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs7AIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTtAhNkZXZzX3JlZ2NhY2hlX2FsbG9j7gIUZGV2c19yZWdjYWNoZV9sb29rdXDvAhFkZXZzX3JlZ2NhY2hlX2FnZfACF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xl8QISZGV2c19yZWdjYWNoZV9uZXh08gIPamRfc2V0dGluZ3NfZ2V08wIPamRfc2V0dGluZ3Nfc2V09AIOZGV2c19sb2dfdmFsdWX1Ag9kZXZzX3Nob3dfdmFsdWX2AhBkZXZzX3Nob3dfdmFsdWUw9wINY29uc3VtZV9jaHVua/gCDXNoYV8yNTZfY2xvc2X5Ag9qZF9zaGEyNTZfc2V0dXD6AhBqZF9zaGEyNTZfdXBkYXRl+wIQamRfc2hhMjU2X2ZpbmlzaPwCFGpkX3NoYTI1Nl9obWFjX3NldHVw/QIVamRfc2hhMjU2X2htYWNfZmluaXNo/gIOamRfc2hhMjU2X2hrZGb/Ag5kZXZzX3N0cmZvcm1hdIADDmRldnNfaXNfc3RyaW5ngQMOZGV2c19pc19udW1iZXKCAxtkZXZzX3N0cmluZ19nZXRfdXRmOF9zdHJ1Y3SDAxRkZXZzX3N0cmluZ19nZXRfdXRmOIQDE2RldnNfYnVpbHRpbl9zdHJpbmeFAxRkZXZzX3N0cmluZ192c3ByaW50ZoYDE2RldnNfc3RyaW5nX3NwcmludGaHAxVkZXZzX3N0cmluZ19mcm9tX3V0ZjiIAxRkZXZzX3ZhbHVlX3RvX3N0cmluZ4kDEGJ1ZmZlcl90b19zdHJpbmeKAxlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxkiwMSZGV2c19zdHJpbmdfY29uY2F0jAMRZGV2c19zdHJpbmdfc2xpY2WNAxJkZXZzX3B1c2hfdHJ5ZnJhbWWOAxFkZXZzX3BvcF90cnlmcmFtZY8DD2RldnNfZHVtcF9zdGFja5ADE2RldnNfZHVtcF9leGNlcHRpb26RAwpkZXZzX3Rocm93kgMSZGV2c19wcm9jZXNzX3Rocm93kwMQZGV2c19hbGxvY19lcnJvcpQDFWRldnNfdGhyb3dfdHlwZV9lcnJvcpUDFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3KWAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3KXAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcpgDHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dJkDGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcpoDF2RldnNfdGhyb3dfc3ludGF4X2Vycm9ymwMRZGV2c19zdHJpbmdfaW5kZXicAxJkZXZzX3N0cmluZ19sZW5ndGidAxlkZXZzX3V0ZjhfZnJvbV9jb2RlX3BvaW50ngMbZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RonwMUZGV2c191dGY4X2NvZGVfcG9pbnSgAxRkZXZzX3N0cmluZ19qbXBfaW5pdKEDDmRldnNfdXRmOF9pbml0ogMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZaMDE2RldnNfdmFsdWVfZnJvbV9pbnSkAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbKUDF2RldnNfdmFsdWVfZnJvbV9wb2ludGVypgMUZGV2c192YWx1ZV90b19kb3VibGWnAxFkZXZzX3ZhbHVlX3RvX2ludKgDEmRldnNfdmFsdWVfdG9fYm9vbKkDDmRldnNfaXNfYnVmZmVyqgMXZGV2c19idWZmZXJfaXNfd3JpdGFibGWrAxBkZXZzX2J1ZmZlcl9kYXRhrAMTZGV2c19idWZmZXJpc2hfZGF0Ya0DFGRldnNfdmFsdWVfdG9fZ2Nfb2JqrgMNZGV2c19pc19hcnJhea8DEWRldnNfdmFsdWVfdHlwZW9msAMPZGV2c19pc19udWxsaXNosQMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZLIDFGRldnNfdmFsdWVfYXBwcm94X2VxswMSZGV2c192YWx1ZV9pZWVlX2VxtAMNZGV2c192YWx1ZV9lcbUDHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbme2Ax5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGO3AxJkZXZzX2ltZ19zdHJpZHhfb2u4AxJkZXZzX2R1bXBfdmVyc2lvbnO5AwtkZXZzX3ZlcmlmeboDEWRldnNfZmV0Y2hfb3Bjb2RluwMOZGV2c192bV9yZXN1bWW8AxFkZXZzX3ZtX3NldF9kZWJ1Z70DGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHO+AxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnS/AwxkZXZzX3ZtX2hhbHTAAw9kZXZzX3ZtX3N1c3BlbmTBAxZkZXZzX3ZtX3NldF9icmVha3BvaW50wgMUZGV2c192bV9leGVjX29wY29kZXPDAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeMQDF2RldnNfaW1nX2dldF9zdHJpbmdfam1wxQMRZGV2c19pbWdfZ2V0X3V0ZjjGAxRkZXZzX2dldF9zdGF0aWNfdXRmOMcDFGRldnNfdmFsdWVfYnVmZmVyaXNoyAMMZXhwcl9pbnZhbGlkyQMUZXhwcnhfYnVpbHRpbl9vYmplY3TKAwtzdG10MV9jYWxsMMsDC3N0bXQyX2NhbGwxzAMLc3RtdDNfY2FsbDLNAwtzdG10NF9jYWxsM84DC3N0bXQ1X2NhbGw0zwMLc3RtdDZfY2FsbDXQAwtzdG10N19jYWxsNtEDC3N0bXQ4X2NhbGw30gMLc3RtdDlfY2FsbDjTAxJzdG10Ml9pbmRleF9kZWxldGXUAwxzdG10MV9yZXR1cm7VAwlzdG10eF9qbXDWAwxzdG10eDFfam1wX3rXAwpleHByMl9iaW5k2AMSZXhwcnhfb2JqZWN0X2ZpZWxk2QMSc3RtdHgxX3N0b3JlX2xvY2Fs2gMTc3RtdHgxX3N0b3JlX2dsb2JhbNsDEnN0bXQ0X3N0b3JlX2J1ZmZlctwDCWV4cHIwX2luZt0DEGV4cHJ4X2xvYWRfbG9jYWzeAxFleHByeF9sb2FkX2dsb2JhbN8DC2V4cHIxX3VwbHVz4AMLZXhwcjJfaW5kZXjhAw9zdG10M19pbmRleF9zZXTiAxRleHByeDFfYnVpbHRpbl9maWVsZOMDEmV4cHJ4MV9hc2NpaV9maWVsZOQDEWV4cHJ4MV91dGY4X2ZpZWxk5QMQZXhwcnhfbWF0aF9maWVsZOYDDmV4cHJ4X2RzX2ZpZWxk5wMPc3RtdDBfYWxsb2NfbWFw6AMRc3RtdDFfYWxsb2NfYXJyYXnpAxJzdG10MV9hbGxvY19idWZmZXLqAxdleHByeF9zdGF0aWNfc3BlY19wcm90b+sDE2V4cHJ4X3N0YXRpY19idWZmZXLsAxtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmftAxlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n7gMYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n7wMVZXhwcnhfc3RhdGljX2Z1bmN0aW9u8AMNZXhwcnhfbGl0ZXJhbPEDEWV4cHJ4X2xpdGVyYWxfZjY08gMRZXhwcjNfbG9hZF9idWZmZXLzAw1leHByMF9yZXRfdmFs9AMMZXhwcjFfdHlwZW9m9QMPZXhwcjBfdW5kZWZpbmVk9gMSZXhwcjFfaXNfdW5kZWZpbmVk9wMKZXhwcjBfdHJ1ZfgDC2V4cHIwX2ZhbHNl+QMNZXhwcjFfdG9fYm9vbPoDCWV4cHIwX25hbvsDCWV4cHIxX2Fic/wDDWV4cHIxX2JpdF9ub3T9AwxleHByMV9pc19uYW7+AwlleHByMV9uZWf/AwlleHByMV9ub3SABAxleHByMV90b19pbnSBBAlleHByMl9hZGSCBAlleHByMl9zdWKDBAlleHByMl9tdWyEBAlleHByMl9kaXaFBA1leHByMl9iaXRfYW5khgQMZXhwcjJfYml0X29yhwQNZXhwcjJfYml0X3hvcogEEGV4cHIyX3NoaWZ0X2xlZnSJBBFleHByMl9zaGlmdF9yaWdodIoEGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkiwQIZXhwcjJfZXGMBAhleHByMl9sZY0ECGV4cHIyX2x0jgQIZXhwcjJfbmWPBBBleHByMV9pc19udWxsaXNokAQUc3RtdHgyX3N0b3JlX2Nsb3N1cmWRBBNleHByeDFfbG9hZF9jbG9zdXJlkgQSZXhwcnhfbWFrZV9jbG9zdXJlkwQQZXhwcjFfdHlwZW9mX3N0cpQEE3N0bXR4X2ptcF9yZXRfdmFsX3qVBBBzdG10Ml9jYWxsX2FycmF5lgQJc3RtdHhfdHJ5lwQNc3RtdHhfZW5kX3RyeZgEC3N0bXQwX2NhdGNomQQNc3RtdDBfZmluYWxseZoEC3N0bXQxX3Rocm93mwQOc3RtdDFfcmVfdGhyb3ecBBBzdG10eDFfdGhyb3dfam1wnQQOc3RtdDBfZGVidWdnZXKeBAlleHByMV9uZXefBBFleHByMl9pbnN0YW5jZV9vZqAECmV4cHIwX251bGyhBA9leHByMl9hcHByb3hfZXGiBA9leHByMl9hcHByb3hfbmWjBBNzdG10MV9zdG9yZV9yZXRfdmFspAQRZXhwcnhfc3RhdGljX3NwZWOlBA9kZXZzX3ZtX3BvcF9hcmemBBNkZXZzX3ZtX3BvcF9hcmdfdTMypwQTZGV2c192bV9wb3BfYXJnX2kzMqgEFmRldnNfdm1fcG9wX2FyZ19idWZmZXKpBBJqZF9hZXNfY2NtX2VuY3J5cHSqBBJqZF9hZXNfY2NtX2RlY3J5cHSrBAxBRVNfaW5pdF9jdHisBA9BRVNfRUNCX2VuY3J5cHStBBBqZF9hZXNfc2V0dXBfa2V5rgQOamRfYWVzX2VuY3J5cHSvBBBqZF9hZXNfY2xlYXJfa2V5sAQLamRfd3Nza19uZXexBBRqZF93c3NrX3NlbmRfbWVzc2FnZbIEE2pkX3dlYnNvY2tfb25fZXZlbnSzBAdkZWNyeXB0tAQNamRfd3Nza19jbG9zZbUEEGpkX3dzc2tfb25fZXZlbnS2BAtyZXNwX3N0YXR1c7cEEndzc2toZWFsdGhfcHJvY2Vzc7gEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxluQQUd3Nza2hlYWx0aF9yZWNvbm5lY3S6BBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXS7BA9zZXRfY29ubl9zdHJpbme8BBFjbGVhcl9jb25uX3N0cmluZ70ED3dzc2toZWFsdGhfaW5pdL4EEXdzc2tfc2VuZF9tZXNzYWdlvwQRd3Nza19pc19jb25uZWN0ZWTABBR3c3NrX3RyYWNrX2V4Y2VwdGlvbsEEEndzc2tfc2VydmljZV9xdWVyecIEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemXDBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlxAQPcm9sZW1ncl9wcm9jZXNzxQQQcm9sZW1ncl9hdXRvYmluZMYEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldMcEFGpkX3JvbGVfbWFuYWdlcl9pbml0yAQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkyQQRamRfcm9sZV9zZXRfaGludHPKBA1qZF9yb2xlX2FsbG9jywQQamRfcm9sZV9mcmVlX2FsbMwEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmTNBBNqZF9jbGllbnRfbG9nX2V2ZW50zgQTamRfY2xpZW50X3N1YnNjcmliZc8EFGpkX2NsaWVudF9lbWl0X2V2ZW500AQUcm9sZW1ncl9yb2xlX2NoYW5nZWTRBBBqZF9kZXZpY2VfbG9va3Vw0gQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNl0wQTamRfc2VydmljZV9zZW5kX2NtZNQEEWpkX2NsaWVudF9wcm9jZXNz1QQOamRfZGV2aWNlX2ZyZWXWBBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldNcED2pkX2RldmljZV9hbGxvY9gEEHNldHRpbmdzX3Byb2Nlc3PZBBZzZXR0aW5nc19oYW5kbGVfcGFja2V02gQNc2V0dGluZ3NfaW5pdNsED2pkX2N0cmxfcHJvY2Vzc9wEFWpkX2N0cmxfaGFuZGxlX3BhY2tldN0EDGpkX2N0cmxfaW5pdN4EFGRjZmdfc2V0X3VzZXJfY29uZmln3wQJZGNmZ19pbml04AQNZGNmZ192YWxpZGF0ZeEEDmRjZmdfZ2V0X2VudHJ54gQMZGNmZ19nZXRfaTMy4wQMZGNmZ19nZXRfdTMy5AQPZGNmZ19nZXRfc3RyaW5n5QQMZGNmZ19pZHhfa2V55gQJamRfdmRtZXNn5wQRamRfZG1lc2dfc3RhcnRwdHLoBA1qZF9kbWVzZ19yZWFk6QQSamRfZG1lc2dfcmVhZF9saW5l6gQTamRfc2V0dGluZ3NfZ2V0X2JpbusECmZpbmRfZW50cnnsBA9yZWNvbXB1dGVfY2FjaGXtBBNqZF9zZXR0aW5nc19zZXRfYmlu7gQLamRfZnN0b3JfZ2PvBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2XwBBZqZF9zZXR0aW5nc19wcmVwX2xhcmdl8QQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2XyBBZqZF9zZXR0aW5nc19zeW5jX2xhcmdl8wQQamRfc2V0X21heF9zbGVlcPQEDWpkX2lwaXBlX29wZW71BBZqZF9pcGlwZV9oYW5kbGVfcGFja2V09gQOamRfaXBpcGVfY2xvc2X3BBJqZF9udW1mbXRfaXNfdmFsaWT4BBVqZF9udW1mbXRfd3JpdGVfZmxvYXT5BBNqZF9udW1mbXRfd3JpdGVfaTMy+gQSamRfbnVtZm10X3JlYWRfaTMy+wQUamRfbnVtZm10X3JlYWRfZmxvYXT8BBFqZF9vcGlwZV9vcGVuX2NtZP0EFGpkX29waXBlX29wZW5fcmVwb3J0/gQWamRfb3BpcGVfaGFuZGxlX3BhY2tldP8EEWpkX29waXBlX3dyaXRlX2V4gAUQamRfb3BpcGVfcHJvY2Vzc4EFFGpkX29waXBlX2NoZWNrX3NwYWNlggUOamRfb3BpcGVfd3JpdGWDBQ5qZF9vcGlwZV9jbG9zZYQFDWpkX3F1ZXVlX3B1c2iFBQ5qZF9xdWV1ZV9mcm9udIYFDmpkX3F1ZXVlX3NoaWZ0hwUOamRfcXVldWVfYWxsb2OIBQ1qZF9yZXNwb25kX3U4iQUOamRfcmVzcG9uZF91MTaKBQ5qZF9yZXNwb25kX3UzMosFEWpkX3Jlc3BvbmRfc3RyaW5njAUXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWSNBQtqZF9zZW5kX3BrdI4FHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFsjwUXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXKQBRlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0kQUUamRfYXBwX2hhbmRsZV9wYWNrZXSSBRVqZF9hcHBfaGFuZGxlX2NvbW1hbmSTBRVhcHBfZ2V0X2luc3RhbmNlX25hbWWUBRNqZF9hbGxvY2F0ZV9zZXJ2aWNllQUQamRfc2VydmljZXNfaW5pdJYFDmpkX3JlZnJlc2hfbm93lwUZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZJgFFGpkX3NlcnZpY2VzX2Fubm91bmNlmQUXamRfc2VydmljZXNfbmVlZHNfZnJhbWWaBRBqZF9zZXJ2aWNlc190aWNrmwUVamRfcHJvY2Vzc19ldmVyeXRoaW5nnAUaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWdBRZhcHBfZ2V0X2Rldl9jbGFzc19uYW1lngUUYXBwX2dldF9kZXZpY2VfY2xhc3OfBRJhcHBfZ2V0X2Z3X3ZlcnNpb26gBQ1qZF9zcnZjZmdfcnVuoQUXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWWiBRFqZF9zcnZjZmdfdmFyaWFudKMFDWpkX2hhc2hfZm52MWGkBQxqZF9kZXZpY2VfaWSlBQlqZF9yYW5kb22mBQhqZF9jcmMxNqcFDmpkX2NvbXB1dGVfY3JjqAUOamRfc2hpZnRfZnJhbWWpBQxqZF93b3JkX21vdmWqBQ5qZF9yZXNldF9mcmFtZasFEGpkX3B1c2hfaW5fZnJhbWWsBQ1qZF9wYW5pY19jb3JlrQUTamRfc2hvdWxkX3NhbXBsZV9tc64FEGpkX3Nob3VsZF9zYW1wbGWvBQlqZF90b19oZXiwBQtqZF9mcm9tX2hleLEFDmpkX2Fzc2VydF9mYWlssgUHamRfYXRvabMFD2pkX3ZzcHJpbnRmX2V4dLQFD2pkX3ByaW50X2RvdWJsZbUFC2pkX3ZzcHJpbnRmtgUKamRfc3ByaW50ZrcFEmpkX2RldmljZV9zaG9ydF9pZLgFDGpkX3NwcmludGZfYbkFC2pkX3RvX2hleF9hugUJamRfc3RyZHVwuwUJamRfbWVtZHVwvAUWamRfcHJvY2Vzc19ldmVudF9xdWV1Zb0FFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWW+BRFqZF9zZW5kX2V2ZW50X2V4dL8FCmpkX3J4X2luaXTABRRqZF9yeF9mcmFtZV9yZWNlaXZlZMEFHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrwgUPamRfcnhfZ2V0X2ZyYW1lwwUTamRfcnhfcmVsZWFzZV9mcmFtZcQFEWpkX3NlbmRfZnJhbWVfcmF3xQUNamRfc2VuZF9mcmFtZcYFCmpkX3R4X2luaXTHBQdqZF9zZW5kyAUWamRfc2VuZF9mcmFtZV93aXRoX2NyY8kFD2pkX3R4X2dldF9mcmFtZcoFEGpkX3R4X2ZyYW1lX3NlbnTLBQtqZF90eF9mbHVzaMwFEF9fZXJybm9fbG9jYXRpb27NBQxfX2ZwY2xhc3NpZnnOBQVkdW1tec8FCF9fbWVtY3B50AUHbWVtbW92ZdEFBm1lbXNldNIFCl9fbG9ja2ZpbGXTBQxfX3VubG9ja2ZpbGXUBQZmZmx1c2jVBQRmbW9k1gUNX19ET1VCTEVfQklUU9cFDF9fc3RkaW9fc2Vla9gFDV9fc3RkaW9fd3JpdGXZBQ1fX3N0ZGlvX2Nsb3Nl2gUIX190b3JlYWTbBQlfX3Rvd3JpdGXcBQlfX2Z3cml0ZXjdBQZmd3JpdGXeBRRfX3B0aHJlYWRfbXV0ZXhfbG9ja98FFl9fcHRocmVhZF9tdXRleF91bmxvY2vgBQZfX2xvY2vhBQhfX3VubG9ja+IFDl9fbWF0aF9kaXZ6ZXJv4wUKZnBfYmFycmllcuQFDl9fbWF0aF9pbnZhbGlk5QUDbG9n5gUFdG9wMTbnBQVsb2cxMOgFB19fbHNlZWvpBQZtZW1jbXDqBQpfX29mbF9sb2Nr6wUMX19vZmxfdW5sb2Nr7AUMX19tYXRoX3hmbG937QUMZnBfYmFycmllci4x7gUMX19tYXRoX29mbG937wUMX19tYXRoX3VmbG938AUEZmFic/EFA3Bvd/IFBXRvcDEy8wUKemVyb2luZm5hbvQFCGNoZWNraW509QUMZnBfYmFycmllci4y9gUKbG9nX2lubGluZfcFCmV4cF9pbmxpbmX4BQtzcGVjaWFsY2FzZfkFDWZwX2ZvcmNlX2V2YWz6BQVyb3VuZPsFBnN0cmNocvwFC19fc3RyY2hybnVs/QUGc3RyY21w/gUGc3RybGVu/wUGbWVtY2hygAYGc3Ryc3RygQYOdHdvYnl0ZV9zdHJzdHKCBhB0aHJlZWJ5dGVfc3Ryc3RygwYPZm91cmJ5dGVfc3Ryc3RyhAYNdHdvd2F5X3N0cnN0coUGB19fdWZsb3eGBgdfX3NobGlthwYIX19zaGdldGOIBgdpc3NwYWNliQYGc2NhbGJuigYJY29weXNpZ25siwYHc2NhbGJubIwGDV9fZnBjbGFzc2lmeWyNBgVmbW9kbI4GBWZhYnNsjwYLX19mbG9hdHNjYW6QBghoZXhmbG9hdJEGCGRlY2Zsb2F0kgYHc2NhbmV4cJMGBnN0cnRveJQGBnN0cnRvZJUGEl9fd2FzaV9zeXNjYWxsX3JldJYGCGRsbWFsbG9jlwYGZGxmcmVlmAYYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXplmQYEc2Jya5oGCF9fYWRkdGYzmwYJX19hc2hsdGkznAYHX19sZXRmMp0GB19fZ2V0ZjKeBghfX2RpdnRmM58GDV9fZXh0ZW5kZGZ0ZjKgBg1fX2V4dGVuZHNmdGYyoQYLX19mbG9hdHNpdGaiBg1fX2Zsb2F0dW5zaXRmowYNX19mZV9nZXRyb3VuZKQGEl9fZmVfcmFpc2VfaW5leGFjdKUGCV9fbHNocnRpM6YGCF9fbXVsdGYzpwYIX19tdWx0aTOoBglfX3Bvd2lkZjKpBghfX3N1YnRmM6oGDF9fdHJ1bmN0ZmRmMqsGC3NldFRlbXBSZXQwrAYLZ2V0VGVtcFJldDCtBglzdGFja1NhdmWuBgxzdGFja1Jlc3RvcmWvBgpzdGFja0FsbG9jsAYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudLEGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdLIGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWzBhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNltAYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5ktQYMZHluQ2FsbF9qaWpptgYWbGVnYWxzdHViJGR5bkNhbGxfamlqabcGGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAbUGBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 27864;
var ___stop_em_js = Module['___stop_em_js'] = 28917;



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
