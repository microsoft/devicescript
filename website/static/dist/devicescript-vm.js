
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
["_malloc","_free","_jd_em_set_device_id_2x_i32","_jd_em_set_device_id_string","_jd_em_init","_jd_em_process","_jd_em_frame_received","_jd_em_devs_deploy","_jd_em_devs_verify","_jd_em_devs_client_deploy","_jd_em_devs_enable_gc_stress","_jd_em_devs_enable_logging","_fflush","onRuntimeInitialized"].forEach((prop) => {
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
                Module.log(`connected to ${port}:${host}`);
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
     * Enables/disables logging via Jacdac (devsmgr logging register).
     */
    function devsSetLogging(en) {
        Module._jd_em_devs_enable_logging(en ? 1 : 0);
    }
    Exts.devsSetLogging = devsSetLogging;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABsoKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGABfgF/YAN/fn8BfmAAAX5gAn98AGABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBfmACf3wBfGACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C44WAgAAXA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX2xvYWQAAgNlbnYFYWJvcnQABwNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgAAA2VudhFlbV9kZXBsb3lfaGFuZGxlcgAAA2VudhdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQACA2Vudg1lbV9zZW5kX2ZyYW1lAAADZW52EGVtX2NvbnNvbGVfZGVidWcAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+CFgIAA3gUHCAEABwcHAAAHBAAIBwccAAACAwIABwcCBAMDAwAAEQcRBwcDBgcCBwcDCQUFBQUHAAgFFh0KDQUCBgMGAAACAgACBgAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMAAAYAAwICAgADAwMDBQAAAAIBAAUABQUDAgIDAgIDBAMDAwUCCAADAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQAKAAICAAEBAQABAAABAAAACgABAgABAgMEBQECAAACAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEgICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAeHwMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGBAYCAAICBQASAgIGDgMDAwMFBQMDAwQEBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAQEBAQIEBAEKDQICAAAHCQMBAwcBAAAIAAIGAAcFAwgJBAQAAAIHAAMHBwQBAgEADwMJBwAABAACBwQHBAQDAwMFBQcFBwcDAwUIBQAABCABAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQEBwcHBwQHBwcICAgHBAQDEQgDAAQBAAkBAwMBAwYECSEJFwMDDwQDBwcGBwQECAAEBAcJBwgABwgTBAUFBQQABBgiEAUEBAQFCQQEAAAUCwsLEwsQBQgHIwsUFAsYEw8PCyQlJicLAwMDBAQXBAQZDBUoDCkGFiorBg4EBAAIBAwVGhoMEiwCAggIFQwMGQwtAAgIAAQIBwgICC4NLwSHgICAAAFwAc8BzwEFhoCAgAABAYACgAIG3YCAgAAOfwFB0OoFC38BQQALfwFBAAt/AUEAC38AQYDTAQt/AEHv0wELfwBBudUBC38AQbXWAQt/AEGx1wELfwBBgdgBC38AQaLYAQt/AEGn2gELfwBBgNMBC38AQZ3bAQsHm4aAgAAkBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABcGbWFsbG9jANMFFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBBZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwUQX19lcnJub19sb2NhdGlvbgCPBRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDUBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgArGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACwKamRfZW1faW5pdAAtDWpkX2VtX3Byb2Nlc3MALhRqZF9lbV9mcmFtZV9yZWNlaXZlZAAwEWpkX2VtX2RldnNfZGVwbG95ADERamRfZW1fZGV2c192ZXJpZnkAMhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMxtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MANBlqZF9lbV9kZXZzX2VuYWJsZV9sb2dnaW5nADUWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMIFF9fZW1fanNfX2VtX3RpbWVfbm93AwkgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DChlfX2VtX2pzX19lbV9jb25zb2xlX2RlYnVnAwsGZmZsdXNoAJcFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADuBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAO8FGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA8AUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPEFCXN0YWNrU2F2ZQDqBQxzdGFja1Jlc3RvcmUA6wUKc3RhY2tBbGxvYwDsBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AO0FDV9fc3RhcnRfZW1fanMD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PCADQTBqQfwAENECIANBKGogACAEELcCIAMgAykDMDcDCCADIAMpAyg3AwAgACABIANBCGogAxBmC0EBIQELIAEhAQJAIAINACABIQIMAQsCQCADKAI8RQ0AIAAgAiADQTxqQQkQiQIgAWohAgwBCyAAIAJBAEEAEIkCIAFqIQILIANBwABqJAAgAgvkBwEDfyMAQdAAayIDJAAgAUEIakEANgIAIAFCADcCACADIAIpAwA3AzACQAJAAkACQAJAAkAgACADQTBqIANByABqIANBxABqEJkCIgRBAEgNAAJAIAMoAkQiBUUNACADKQNIUA0AIAIoAgQiAEGAgMD/B3ENAyAAQQhxRQ0DIAFB1wA6AAogASACKAIANgIADAILAkACQCAFRQ0AIANBOGogAEEIIAUQ8wIgAiADKQM4NwMADAELIAIgAykDSDcDAAsgASAEQc+GfyAEGzsBCAsgAigCACEEAkACQAJAAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcRsOCQEEBAQABAMEAgQLIAEgBEH//wBxNgIAIAEgBEEOdkEgajoACgwECyAEQaB/aiIFQSNLDQIgASAFNgIAIAFBBToACgwDCwJAAkAgBA0AQQAhBQwBCyAELQADQQ9xIQULAkAgBUF8ag4GAAICAgIAAgsgASAENgIAIAFB0gA6AAogAyACKQMANwMoIAEgACADQShqQQAQYjYCBAwCCyABIAQ2AgAgAUEyOgAKDAELIAMgAikDADcDIAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAIANBIGoQ/QIODQEECwUJBgMHCwgKAgALCyABQQM2AgAgAUECOgAKDAsLIAFBADYCACABQQI6AAoMCgsgAUEGOgAKIAEgAikDADcCAAwJCyABQQI6AAogAyACKQMANwMIIAFBAUECIAAgA0EIahD2Ahs2AgAMCAsgAUEBOgAKIAMgAikDADcDECABIAAgA0EQahD0AjkCAAwHCyABQdEAOgAKIAIoAgAhAiABIAQ2AgAgASACLwEIQYCAgIB4cjYCBAwGCyABIAQ2AgAgAUEwOgAKIAMgAikDADcDGCABIAAgA0EYakEAEGI2AgQMBQsgASAENgIAIAFBAzoACgwECyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICAMEcNBSABIAQ2AgAgAUHUADoA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AkAgACAGIgZBH3UgAnEgBmoiBiACIAYgAkgbIgIgBCACIAQgAkgbIgRrIgYQlAEiAkUNACACKAIMIAMoAgwgBEEDdGogBkEDdBCSBRoLIAAgAhCyAiABQSBqJAALEwAgACAAIABBABCtAhCVARCyAguKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ9wINACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDkAgwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ+QJFDQAgACADKAIoEPECDAELIABCADcDAAsgA0EwaiQAC50BAgJ/AX4jAEEwayIBJAAgASAAKQNQIgM3AxAgASADNwMgAkACQCAAIAFBEGoQ9wINACABIAEpAyA3AwggAUEoaiAAQRIgAUEIahDkAkEAIQIMAQsgASABKQMgNwMAIAAgASABQShqEPkCIQILAkAgAiICRQ0AIAFBGGogACACIAEoAigQ1AIgACgCrAEgASkDGDcDIAsgAUEwaiQAC8oBAgV/AX4jAEEwayIBJAAgASAAKQNQIgY3AxggASAGNwMgAkACQCAAIAFBGGoQ+AINACABIAEpAyA3AxAgAUEoaiAAQaQcIAFBEGoQ5QJBACECDAELIAEgASkDIDcDCCAAIAFBCGogAUEoahD5AiECCwJAIAIiA0UNACAAQQAQrQIhAiAAQQEQrQIhBCAAQQIQrQIhACABKAIoIgUgAk0NACABIAUgAmsiBTYCKCADIAJqIAAgBSAEIAUgBEkbEJQFGgsgAUEwaiQAC6YDAgd/AX4jAEHgAGsiASQAIAEgACkDUCIINwM4IAEgCDcDUAJAAkAgACABQThqEPgCDQAgASABKQNQNwMwIAFB2ABqIABBpBwgAUEwahDlAkEAIQIMAQsgASABKQNQNwMoIAAgAUEoaiABQcwAahD5AiECCwJAIAIiA0UNACAAQQAQrQIhBCABIABB4ABqKQMAIgg3AyAgASAINwNAAkACQCAAIAFBIGoQzgJFDQAgASABKQNANwMAIAAgASABQdgAahDQAiECDAELIAEgASkDQCIINwNQIAEgCDcDGAJAAkAgACABQRhqEPcCDQAgASABKQNQNwMQIAFB2ABqIABBEiABQRBqEOQCQQAhAgwBCyABIAEpA1A3AwggACABQQhqIAFB2ABqEPkCIQILIAIhAgsgAiIFRQ0AIABBAhCtAiECIABBAxCtAiEAIAEoAlgiBiACTQ0AIAEgBiACayIGNgJYIAEoAkwiByAETQ0AIAEgByAEayIHNgJMIAMgBGogBSACaiAHIAYgACAGIABJGyIAIAcgAEkbEJIFGgsgAUHgAGokAAsfAQF/AkAgAEEAEK0CIgFBAEgNACAAKAKsASABEHoLCyMBAX8gAEHf1AMgAEEAEK0CIgEgAUGgq3xqQaGrfEkbEIUBCwkAIABBABCFAQvLAQIHfwF+IwBB4ABrIgEkAAJAIAAtAENBAkkNACABIABB2ABqKQMAIgg3A1ggASAINwMIIAAgAUEIaiABQdQAahDQAiICRQ0AIAAgACACIAEoAlQgAUEQakHAACAAQeAAaiIDIAAtAENBfmoiBEEAEM0CIgVBf2oiBhCWASIHRQ0AAkACQCAFQcEASQ0AIAAgAiABKAJUIAdBBmogBSADIARBABDNAhoMAQsgB0EGaiABQRBqIAYQkgUaCyAAIAcQsgILIAFB4ABqJAALVgIBfwF+IwBBIGsiASQAIAEgAEHYAGopAwAiAjcDGCABIAI3AwggAUEQaiAAIAFBCGoQ1QIgASABKQMQIgI3AxggASACNwMAIAAgARDzASABQSBqJAALDgAgACAAQQAQrgIQrwILDwAgACAAQQAQrgKdEK8CC4ACAgJ/AX4jAEHwAGsiASQAIAEgAEHYAGopAwA3A2ggASAAQeAAaikDACIDNwNQIAEgAzcDYAJAAkAgAUHQAGoQ/gJFDQAgASABKQNoNwMQIAEgACABQRBqEMMCNgIAQdkXIAEQLwwBCyABIAEpA2A3A0ggAUHYAGogACABQcgAahDVAiABIAEpA1giAzcDYCABIAM3A0AgACABQcAAahCQASABIAEpA2A3AzggACABQThqQQAQ0AIhAiABIAEpA2g3AzAgASAAIAFBMGoQwwI2AiQgASACNgIgQYsYIAFBIGoQLyABIAEpA2A3AxggACABQRhqEJEBCyABQfAAaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQswIiAkUNAAJAIAIoAgQNACACIABBHBCKAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8gAQ0QILIAEgASkDCDcDACAAIAJB9gAgARDXAiAAIAIQsgILIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAELMCIgJFDQACQCACKAIEDQAgAiAAQSAQigI2AgQLIAEgAEHYAGopAwAiAzcDCAJAIANCAFINACABQQhqQfQAENECCyABIAEpAwg3AwAgACACQfYAIAEQ1wIgACACELICCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCzAiICRQ0AAkAgAigCBA0AIAIgAEEeEIoCNgIECyABIABB2ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHzABDRAgsgASABKQMINwMAIAAgAkH2ACABENcCIAAgAhCyAgsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQswIiAkUNAAJAIAIoAgQNACACIABBIhCKAjYCBAsgASAAQdgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpBhAEQ0QILIAEgASkDCDcDACAAIAJB9gAgARDXAiAAIAIQsgILIAFBEGokAAtiAQF/IwBBIGsiAyQAIAMgAikDADcDECADQRhqIAEgA0EQakH7ABCbAgJAAkAgAykDGEIAUg0AIABCADcDAAwBCyADIAMpAxg3AwggACABIANBCGpB4wAQmwILIANBIGokAAswAgF/AX4jAEEQayIBJAAgASAAKQNQIgI3AwAgASACNwMIIAAgARDdAiABQRBqJAALqgEBA38jAEEQayIBJAACQAJAIAAtAENBAUsNACABQQhqIABBySZBABDiAgwBCwJAIABBABCtAiICQXtqQXtLDQAgAUEIaiAAQbgmQQAQ4gIMAQsgACAALQBDQX9qIgM6AEMgAEHYAGogAEHgAGogA0H/AXFBf2oiA0EDdBCTBRogACADIAIQgQEiAkUNACAAKAKsASACNQIcQoCAgIAQhDcDIAsgAUEQaiQAC+MCAgN/AX4jAEHwAGsiAyQAIAMgAikDADcDQAJAAkACQCABIANBwABqIANB6ABqIANB5ABqEJkCIgRBz4YDSw0AIAEoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENAQsgAyACKQMANwMIIAAgAUHfICADQQhqEOUCDAELIAAgASABKAKgASAEQf//A3EQlAIgACkDAEIAUg0AIANB2ABqIAFBCCABIAFBAhCKAhCSARDzAiAAIAMpA1giBjcDACAGUA0AIAMgACkDADcDOCABIANBOGoQkAEgA0HQAGpB+wAQ0QIgA0EDNgJMIAMgBDYCSCADIAApAwA3AzAgAyADKQNQNwMoIAMgAykDSDcDICABIANBMGogA0EoaiADQSBqEKkCIAEoAqABIQIgAyAAKQMANwMYIAEgAiAEQf//A3EgA0EYahCSAiADIAApAwA3AxAgASADQRBqEJEBCyADQfAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDCAJAAkACQCABIANBCGogA0EYaiADQRRqEJkCIgRBf0oNACADIAIpAwA3AwAgACABQRwgAxDkAgwBCwJAIARB0IYDSA0AIARBsPl8aiIBQQAvAeDOAU4NAiAAQeDmACABQQN0ai8BABDRAgwBCyAAIAEoAKQBIgEgASgCIGogBEEEdGovAQw2AgAgAEEENgIECyADQSBqJAAPC0GNFEHCPEE4QdgtEPQEAAvjAQICfwF+IwBB0ABrIgEkACABIABB2ABqKQMANwNIIAEgAEHgAGopAwAiAzcDKCABIAM3A0ACQCABQShqEP4CDQAgAUE4aiAAQdgaEOMCCyABIAEpA0g3AyAgAUE4aiAAIAFBIGoQ1QIgASABKQM4IgM3A0ggASADNwMYIAAgAUEYahCQASABIAEpA0g3AxACQCAAIAFBEGogAUE4ahDQAiICRQ0AIAFBMGogACACIAEoAjhBARCBAiAAKAKsASABKQMwNwMgCyABIAEpA0g3AwggACABQQhqEJEBIAFB0ABqJAALhQEBAn8jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMANwMgIABBAhCtAiECIAEgASkDIDcDCAJAIAFBCGoQ/gINACABQRhqIABB3BwQ4wILIAEgASkDKDcDACABQRBqIAAgASACQQEQhwIgACgCrAEgASkDEDcDICABQTBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPQCmxCvAgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD0ApwQrwILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ9AIQvQUQrwILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ8QILIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEPQCIgREAAAAAAAAAABjRQ0AIAAgBJoQrwIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQ6AS4RAAAAAAAAPA9ohCvAgtkAQV/AkACQCAAQQAQrQIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBDoBCACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFELACCxEAIAAgAEEAEK4CEKgFEK8CCxgAIAAgAEEAEK4CIABBARCuAhC0BRCvAgsuAQN/IABBABCtAiEBQQAhAgJAIABBARCtAiIDRQ0AIAEgA20hAgsgACACELACCy4BA38gAEEAEK0CIQFBACECAkAgAEEBEK0CIgNFDQAgASADbyECCyAAIAIQsAILFgAgACAAQQAQrQIgAEEBEK0CbBCwAgsJACAAQQEQxwEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ9QIhAyACIAIpAyA3AxAgACACQRBqEPUCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahD0AiEGIAIgAikDIDcDACAAIAIQ9AIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQOwbjcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDHAQuTAQIDfwF+IwBBMGsiASQAIAEgAEHYAGopAwA3AyggASAAQeAAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQ/gINACABIAEpAyg3AxAgACABQRBqEJ0CIQIgASABKQMgNwMIIAAgAUEIahChAiIDRQ0AIAJFDQAgACACIAMQiwILIAAoAqwBIAEpAyg3AyAgAUEwaiQACwkAIABBARDLAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQoQIiA0UNACAAQQAQlAEiBEUNACACQSBqIABBCCAEEPMCIAIgAikDIDcDECAAIAJBEGoQkAEgACADIAQgARCPAiACIAIpAyA3AwggACACQQhqEJEBIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQywEL4wECA38BfiMAQcAAayIBJAAgASAAQdgAaikDACIENwM4IAEgAEHgAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ+wIiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDkAgwBCyABIAEpAzA3AxgCQCAAIAFBGGoQoQIiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqEOQCDAELIAIgAzYCBCAAKAKsASABKQM4NwMgCyABQcAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDkAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABIAIvARIQkQNFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuwAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAMgAkEIakEIEPsENgIAIAAgAUHoFSADENMCCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOQCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQRhqIAIpAwgQ+QQgAyADQRhqNgIAIAAgAUHQGSADENMCCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOQCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABUQ8QILIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEBDxAgsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDkAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUEPECCyADQSBqJAALogEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOQCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXEQ8gILIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFEEBcUUQ8gILIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAUEIIAIoAhwQ8wILIANBIGokAAvLAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELAkACQCACLQAUQQFxRQ0AQQAhAQwBC0EAIQEgAi0AFUEwSw0AIAIvARBBD3YhAQsgACABEPICCyADQSBqJAALyQEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOQCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAItABRBAXENACACLQAVQTBLDQAgAi4BEEF/Sg0AIAAgAi0AEBDxAgwBCyAAQgA3AwALIANBIGokAAupAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYDAAEYQ8gILIANBIGokAAuoAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ5AJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYAgRhDyAgsgA0EgaiQAC74BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDkAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLwEQIgJBDHZBf2pBAkkNACAAQgA3AwAMAQsgACACQf8fcRDxAgsgA0EgaiQAC/4CAQp/IwBBIGsiASQAIAEgACkDUDcDEAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACABKAIQIgNFDQAgAyECIAMoAgBBgICA+ABxQYCAgNAARg0BCyABIAEpAxA3AwAgAUEYaiAAQS8gARDkAkEAIQILAkACQCACIgQNAEEAIQUMAQsCQCAAIAQvARIQlgIiAg0AQQAhBQwBC0EAIQUgAi8BCCIGRQ0AIAAoAKQBIgMgAygCYGogAi8BCkECdGohByAELwEQIgJB/wFxIQggAsEiAkH//wNxIQkgAkF/SiEKQQAhAgNAAkAgByACIgNBA3RqIgUvAQIiAiAJRw0AIAUhBQwCCwJAIAoNACACQYDgA3FBgIACRw0AIAUhBSACQf8BcSAIRg0CCyADQQFqIgMhAiADIAZHDQALQQAhBQsCQCAFIgJFDQAgAUEIaiAAIAIgBCgCHCIDQQxqIAMvAQQQ3QEgACgCrAEgASkDCDcDIAsgAUEgaiQAC6MDAQR/IwBBMGsiBSQAIAUgAzYCLAJAAkAgAi0ABEEBcUUNAAJAIAFBABCUASIGDQAgAEIANwMADAILIAMgBGohByAAIAFBCCAGEPMCIAUgACkDADcDGCABIAVBGGoQkAFBACEDIAEoAKQBIgQgBCgCYGogAi8BBkECdGohAgNAIAIhAiADIQMCQAJAIAcgBSgCLCIIayIEQQBODQAgAyEDIAIhAkECIQQMAQsgBUEgaiABIAItAAIgBUEsaiAEEE0CQAJAAkAgBSkDIFANACAFIAUpAyA3AxAgASAGIAVBEGoQrAIgBSgCLCAIRg0AIAMhBAJAIAMNACACLQADQR50QR91IAJxIQQLIAQhAyACQQRqIQQCQAJAIAIvAQRFDQAgBCECDAELIAMhAiADDQBBACEDIAQhAgwCCyADIQMgAiECQQAhBAwCCyADIQMgAiECC0ECIQQLIAMhAyACIQIgBCEECyADIQMgAiECIARFDQALIAUgACkDADcDCCABIAVBCGoQkQEMAQsgACABIAIvAQYgBUEsaiAEEE0LIAVBMGokAAvdAQIDfwF+IwBBwABrIgEkACABIAApA1AiBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEJUCIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQZQdIAFBEGoQ5QJBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQYcdIAFBCGoQ5QJBACEDCwJAIAMiA0UNACAAKAKsASECIAAgASgCJCADLwECQfQDQQAQ7QEgAkERIAMQtAILIAFBwABqJAALPQEBfyMAQRBrIgIkACACQQhqIAAgASAAQZwCaiAAQZgCai0AABDdASAAKAKsASACKQMINwMgIAJBEGokAAu/BAEKfyMAQTBrIgIkACAAQdgAaiEDAkACQCAALQBDQX9qIgRBAUYNACADIQMgBCEEDAELIAIgAykDADcDIAJAIAAgAkEgahD8Ag0AIAMhA0EBIQQMAQsgAiADKQMANwMYIAAgAkEYahD7AiIEKAIMIQMgBC8BCCEECyAEIQUgAyEGIABBnAJqIQcCQAJAIAEtAARBAXFFDQAgByEDIAVFDQEgAEGIBGohCCAHIQRBACEJQQAhCiAAKACkASIDIAMoAmBqIAEvAQZBAnRqIQEDQCABIQMgCiEKIAkhCQJAAkAgCCAEIgRrIgFBAEgNACADLQACIQsgAiAGIAlBA3RqKQMANwMQIAAgCyAEIAEgAkEQahBOIgFFDQAgCiELAkAgCg0AIAMtAANBHnRBH3UgA3EhCwsgCyEKIAQgAWohBCADQQRqIQECQAJAAkAgAy8BBEUNACABIQMMAQsgCiEDIAoNACABIQFBACEKQQEhCwwBCyADIQEgCiEKQQAhCwsgBCEDDAELIAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABB0DYgAhDiAiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQTmohAwsgAEGYAmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCVAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGUHSABQRBqEOUCQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGHHSABQQhqEOUCQQAhAwsCQCADIgNFDQAgACADEOABIAAgASgCJCADLwECQf8fcUGAwAByEO8BCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEJUCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZQdIANBCGoQ5QJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCVAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGUHSADQQhqEOUCQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQlQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBlB0gA0EIahDlAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8f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EIwBIgI2AggCQCACRQ0AIAMgAToADCACIABBnAJqIAEQkgUaCyADQQAQegsPC0HixwBBuMAAQcwAQcsxEPQEAAvEAgIDfwF+IwBBwABrIgIkAAJAIAAoArABIgNFDQAgAyEDA0ACQCADIgMvARIgAUcNACADIAMtABBBIHI6ABALIAMoAgAiBCEDIAQNAAsLIAIgATYCOCACQQI2AjwgAiACKQM4NwMYIAJBKGogACACQRhqQeEAEJsCIAIgAikDODcDECACIAIpAyg3AwggAkEwaiAAIAJBEGogAkEIahCXAgJAIAIpAzAiBVANACAAIAU3A1AgAEECOgBDIABB2ABqIgNCADcDACACQSBqIAAgARDyASADIAIpAyA3AwAgAEEBQQEQgQEiA0UNACADIAMtABBBIHI6ABALIABBsAFqIgAhBAJAA0AgBCgCACIDRQ0BIAMhBCADLQAQIgFBIHFFDQAgAyABQd8BcToAECADEIMBIAAhBCADDQALCyACQcAAaiQACysAIABCfzcCjAIgAEGkAmpCfzcCACAAQZwCakJ/NwIAIABBlAJqQn83AgALmwICA38BfiMAQSBrIgMkAAJAAkAgAUGZAmotAABB/wFHDQAgAEIANwMADAELAkAgAUEKQSAQiwEiBA0AIABCADcDAAwBCyADQRhqIAFBCCAEEPMCIAMgAykDGDcDECABIANBEGoQkAEgBCABIAFBmAJqLQAAEJUBIgU2AhwCQAJAIAUNACADIAMpAxg3AwAgASADEJEBQgAhBgwBCyAFQQxqIAFBnAJqIAUvAQQQkgUaIAQgAUGQAmopAgA3AwggBCABLQCZAjoAFSAEIAFBmgJqLwEAOwEQIAFBjwJqLQAAIQUgBCACOwESIAQgBToAFCADIAMpAxg3AwggASADQQhqEJEBIAMpAxghBgsgACAGNwMACyADQSBqJAALpgEBAn8CQAJAIAAvAQgNACAAKAKsASICRQ0BIAJB//8DOwESIAIgAi0AEEHwAXFBA3I6ABAgAiAAKALMASIDOwEUIAAgA0EBajYCzAEgAiABKQMANwMIIAJBARD0AUUNAAJAIAItABBBD3FBAkcNACACKAIsIAIoAggQVwsgAkIANwMIIAIgAi0AEEHwAXE6ABALDwtB4scAQbjAAEHoAEGaJhD0BAAL/AMBB38jAEHAAGsi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ECICLQAOIgMNAEEADwsgACACLwEIQQN0akEYaiEEIAMhAANAAkAgACIAQQFODQBBAA8LIABBf2oiAiEAIAQgAkEBdGoiAi8BACIDRQ0ACyACQQA7AQAgAwu/AwEMfyMAQcAAayICJAAgAiABKQMANwMwAkACQCAAIAJBMGoQ9wINACACIAEpAwA3AyggAEHlDiACQShqEMICDAELIAIgASkDADcDICAAIAJBIGogAkE8ahD5AiEDIAIgAigCPCIBQQF2NgI8IAFBAkkNACAAQaQBaiEEQQAhAANAIAMgACIFQQF0ai8BACEGQQAhAAJAIAQoAAAiB0EkaigCACIBQRBJDQAgAUEEdiIAQQEgAEEBSxshCCAHIAcoAiBqIQlBACEBAkADQCAAIQoCQAJAIAkgASILQQR0aiIMKAIAIg0gBksNAEEAIQAgDCEBIAwoAgQgDWogBk8NAQtBASEAIAohAQsgASEBIABFDQEgASEAIAtBAWoiDCEBIAwgCEcNAAtBACEADAELIAEhAAsCQAJAIAAiAEUNACAAKAIAIQEgBygCICEMIAIgBCgCADYCHCACQRxqIAAgByAMamtBBHUiABB9IQwgAiAANgIYIAIgDDYCFCACIAYgAWs2AhBB0jUgAkEQahAvDAELIAIgBjYCAEGwygAgAhAvCyAFQQFqIgEhACABIAIoAjxJDQALCyACQcAAaiQAC7QCAQJ/IwBB4ABrIgIkACACIAEpAwA3A0BBACEDAkAgACACQcAAahC1AkUNACACIAEpAwA3AzggAkHYAGogACACQThqQeMAEJsCAkACQCACKQNYUEUNAEEAIQMMAQsgAiACKQNYNwMwIABBsyAgAkEwahDCAkEBIQMLIAMhAyACIAEpAwA3AyggAkHQAGogACACQShqQfYAEJsCAkACQCACKQNQUEUNACADIQMMAQsgAiACKQNQNwMgIABB9i4gAkEgahDCAiACIAEpAwA3AxggAkHIAGogACACQRhqQfEAEJsCAkAgAikDSFANACACIAIpA0g3AxAgACACQRBqENwCCyADQQFqIQMLIAMhAwsCQCADDQAgAiABKQMANwMIIABBsyAgAkEIahDCAgsgAkHgAGokAAvgAwEGfyMAQdAAayIDJAACQAJAIAAtAEVFDQAgAyABKQMANwM4IABB9AogA0E4ahDCAgwB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DQALCyABQRBqJAAPC0GrEUEAEC8QNwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEPkEIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRBtBkgAkEgahAvDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQaMZIAJBEGoQLwwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEGUGCACEC8LIAJBwABqJAALggUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQAgASEBA0AgACABIgEoAgAiAjYCJCABKAIMECIgARAiIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDuAiECCyACIgJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhASACQQAoAoDkASIAIAJBxABqKAIAIgMgACADa0EASBsiADYCFCACQShqIgMgAisDGCAAIAFruKIgAysDAKA5AwACQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQ7gIhAgsgAiICRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDuAiECCyACIgJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUHw7QAQ0QRB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgCgOQBIAFqNgIcCwu6AgEFfyACQQFqIQMgAUG9ygAgARshBAJAAkAgACgCJCIB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BAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQbY6Qa4BQYfLABDvBAALIAAgAkH/ASACQf8BSBsiAUEAIAFBAEobOgAAC7sDAwF/AXwBfgJAAkACQCABQQhJDQACQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQvQS3IQMLIAMhAwJAAkAgAUEQTw0AIAMhAwwBCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAyIDRAAAAAAAAODBYw0BQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBtjpBygFBm8sAEO8EAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEL0EtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvjAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKALc4wEiASAARw0AQdzjASEBDAELIAEh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IQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QkgUgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQwQVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQwQVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBD3BCABQQhqIQIMBwsgCygCACIBQdzVACABGyIDEMEFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQkgUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBDBBSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQkgUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEKoFIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ5QWiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ5QWjIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDlBaNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDlBaJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQlAUaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QbD6AGopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEJQFIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQwQVqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxD2BCEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8D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QSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALvQIBA38CQCAADQBBACEBAkBBACgCzOYBRQ0AQQAoAszmARCXBSEBCwJAQQAoAvjSAUUNAEEAKAL40gEQlwUgAXIhAQsCQBCtBSgCACIARQ0AA0BBACECAkAgACgCTEEASA0AIAAQlQUhAgsCQCAAKAIUIAAoAhxGDQAgABCXBSABciEBCwJAIAJFDQAgABCWBQsgACgCOCIADQALCxCuBSABDwtBACECAkAgACgCTEEASA0AIAAQlQUhAgsCQAJAAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaIAAoAhQNAEF/IQEgAg0BDAILAkAgACgCBCIBIAAoAggiA0YNACAAIAEgA2usQQEgACgCKBEQABoLQQAhASAAQQA2AhwgAEIANwMQIABCADcCBCACRQ0BCyAAEJYFCyABC7IEAgR+An8CQAJAIAG9IgJCAYYiA1ANACABEJkFIQQgAL0iBUI0iKdB/w9xIgZB/w9GDQAgBEL///////////8Ag0KBgICAgICA+P8AVA0BCyAAIAGiIgEgAaMPCwJAIAVCAYYiBCADVg0AIABEAAAAAAAAAACiIAAgBCADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIAVCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBUEBIAZrrYYhAwwBCyAFQv////////8Hg0KAgICAgICACIQhAwsCQAJAIAcNAEEAIQcCQCACQgyGIgRCAFMNAANAIAdBf2ohByAEQgGGIgRCf1UNAAsLIAJBASAHa62GIQIMAQsgAkL/////////B4NCgICAgICAgAiEIQILAkAgBiAHTA0AA0ACQCADIAJ9IgRCAFMNACAEIQMgBEIAUg0AIABEAAAAAAAAAACiDwsgA0IBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LAkACQCADQv////////8HWA0AIAMhBAwBCwNAIAZBf2ohBiADQoCAgICAgIAEVCEHIANCAYYiBCEDIAcNAAsLIAVCgICAgICAgICAf4MhAwJAAkAgBkEBSA0AIARCgICAgICAgHh8IAatQjSGhCEEDAELIARBASAGa62IIQQLIAQgA4S/CwUAIAC9Cw4AIAAoAjwgASACEKsFC+UCAQd/IwBBIGsiAyQAIAMgACgCHCIENgIQIAAoAhQhBSADIAI2AhwgAyABNgIYIAMgBSAEayIBNgIUIAEgAmohBiADQRBqIQRBAiEHAkACQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBQQ0gVFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahAUENIFRQ0ACwsgBkF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIhAQwBC0EAIQEgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgAgB0ECRg0AIAIgBSgCBGshAQsgA0EgaiQAIAELDAAgACgCPBCRBRASC4EBAQJ/IAAgACgCSCIBQX9qIAFyNgJIAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQAkAgACgCACIBQQRxRQ0AIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULXAEBfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACEJ4FDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEJIFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQnwUhAAwBCyADEJUFIQUgACAEIAMQnwUhACAFRQ0AIAMQlgULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEKYFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEKkFIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA+B7IgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsDsHyiIAhBACsDqHyiIABBACsDoHyiQQArA5h8oKCgoiAIQQArA5B8oiAAQQArA4h8okEAKwOAfKCgoKIgCEEAKwP4e6IgAEEAKwPwe6JBACsD6HugoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQpQUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQpwUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsDqHuiIANCLYinQf8AcUEEdCIBQcD8AGorAwCgIgkgAUG4/ABqKwMAIAIgA0KAgICAgICAeIN9vyABQbiMAWorAwChIAFBwIwBaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwPYe6JBACsD0HugoiAAQQArA8h7okEAKwPAe6CgoiAEQQArA7h7oiAIQQArA7B7oiAAIAkgBaGgoKCgoCEACyAACwkAIAC9QjCIpwvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEE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gICAgICA//8AEOMFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ4wUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EOMFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDjBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ2QVFDQAgAyAEEMkFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOMFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ2wUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKENkFQQBKDQACQCABIAkgAyAKENkFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEOMFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDjBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ4wUgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEOMFIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABDjBSAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDAwz8Q4wUgBUHIAGopAwAhAiAFKQNAIQQMAQsgCkL///////8/gyAIIAZyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQACxwAIAAgAkL///////////8AgzcDCCAAIAE3AwALjgkCBn8DfiMAQTBrIgQkAEIAIQoCQAJAIAJBAksNACABQQRqIQUgAkECdCICQbzOAWooAgAhBiACQbDOAWooAgAhBwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQxAUhAgsgAhDFBQ0AC0EBIQgCQAJAIAJBVWoOAwABAAELQX9BASACQS1GGyEIAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMQFIQILQQAhCQJAAkACQANAIAJBIHIgCUGACGosAABHDQECQCAJQQZLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQxAUhAgsgCUEBaiIJQQhHDQAMAgsACwJAIAlBA0YNACAJQQhGDQEgA0UNAiAJQQRJDQIgCUEIRg0BCwJAIAEpA3AiCkIAUw0AIAUgBSgCAEF/ajYCAAsgA0UNACAJQQRJDQAgCkIAUyEBA0ACQCABDQAgBSAFKAIAQX9qNgIACyAJQX9qIglBA0sNAAsLIAQgCLJDAACAf5QQ3QUgBEEIaikDACELIAQpAwAhCgwCCwJAAkACQCAJDQBBACEJA0AgAkEgciAJQeoiaiwAAEcNAQJAIAlBAUsNAAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDEBSECCyAJQQFqIglBA0cNAAwCCwALAkACQCAJDgQAAQECAQsCQCACQTBHDQACQAJAIAEoAgQiCSABKAJoRg0AIAUgCUEBajYCACAJLQAAIQkMAQsgARDEBSEJCwJAIAlBX3FB2ABHDQAgBEEQaiABIAcgBiAIIAMQzQUgBEEYaikDACELIAQpAxAhCgwGCyABKQNwQgBTDQAgBSAFKAIAQX9qNgIACyAEQSBqIAEgAiAHIAYgCCADEM4FIARBKGopAwAhCyAEKQMgIQoMBAtCACEKAkAgASkDcEIAUw0AIAUgBSgCAEF/ajYCAAsQjwVBHDYCAAwBCwJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMQFIQILAkACQCACQShHDQBBASEJDAELQgAhCkKAgICAgIDg//8AIQsgASkDcEIAUw0DIAUgBSgCAEF/ajYCAAwDCwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQxAUhAgsgAkG/f2ohCAJAAkAgAkFQakEKSQ0AIAhBGkkNACACQZ9/aiEIIAJB3wBGDQAgCEEaTw0BCyAJQQFqIQkMAQsLQoCAgICAgOD//wAhCyACQSlGDQICQCABKQNwIgxCAFMNACAFIAUoAgBBf2o2AgALAkACQCADRQ0AIAkNAUIAIQoMBAsQjwVBHDYCAEIAIQoMAQsDQCAJQX9qIQkCQCAMQgBTDQAgBSAFKAIAQX9qNgIAC0IAIQogCQ0ADAMLAAsgASAKEMMFC0IAIQsLIAAgCjcDACAAIAs3AwggBEEwaiQAC8IPAgh/B34jAEGwA2siBiQAAkACQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQxAUhBwtBACEIQgAhDkEAIQkCQAJAAkADQAJAIAdBMEYNACAHQS5HDQQgASgCBCIHIAEoAmhGDQIgASAHQQFqNgIEIActAAAhBwwDCwJAIAEoAgQiByABKAJoRg0AQQEhCSABIAdBAWo2AgQgBy0AACEHDAELQQEhCSABEMQFIQcMAAsACyABEMQFIQcLQQEhCEIAIQ4gB0EwRw0AA0ACQAJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARDEBSEHCyAOQn98IQ4gB0EwRg0AC0EBIQhBASEJC0KAgICAgIDA/z8hD0EAIQpCACEQQgAhEUIAIRJBACELQgAhEwJAA0AgB0EgciEMAkACQCAHQVBqIg1BCkkNAAJAIAxBn39qQQZJDQAgB0EuRw0ECyAHQS5HDQAgCA0DQQEhCCATIQ4MAQsgDEGpf2ogDSAHQTlKGyEHAkACQCATQgdVDQAgByAKQQR0aiEKDAELAkAgE0IcVg0AIAZBMGogBxDeBSAGQSBqIBIgD0IAQoCAgICAgMD9PxDjBSAGQRBqIAYpAzAgBkEwakEIaikDACAGKQMgIhIgBkEgakEIaikDACIPEOMFIAYgBikDECAGQRBqQQhqKQMAIBAgERDXBSAGQQhqKQMAIREgBikDACEQDAELIAdFDQAgCw0AIAZB0ABqIBIgD0IAQoCAgICAgID/PxDjBSAGQcAAaiAGKQNQIAZB0ABqQQhqKQMAIBAgERDXBSAGQcAAakEIaikDACERQQEhCyAGKQNAIRALIBNCAXwhE0EBIQkLAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEMQFIQcMAAsACwJAAkAgCQ0AAkACQAJAIAEpA3BCAFMNACABIAEoAgQiB0F/ajYCBCAFRQ0BIAEgB0F+ajYCBCAIRQ0CIAEgB0F9ajYCBAwCCyAFDQELIAFCABDDBQsgBkHgAGogBLdEAAAAAAAAAACiENwFIAZB6ABqKQMAIRMgBikDYCEQDAELAkAgE0IHVQ0AIBMhDwNAIApBBHQhCiAPQgF8Ig9CCFINAAsLAkACQAJAAkAgB0FfcUHQAEcNACABIAUQzwUiD0KAgICAgICAgIB/Ug0DAkAgBUUNACABKQNwQn9VDQIMAwtCACEQIAFCABDDBUIAIRMMBAtCACEPIAEpA3BCAFMNAgsgASABKAIEQX9qNgIEC0IAIQ8LAkAgCg0AIAZB8ABqIAS3RAAAAAAAAAAAohDcBSAGQfgAaikDACETIAYpA3AhEAwBCwJAIA4gEyAIG0IChiAPfEJgfCITQQAgA2utVw0AEI8FQcQANgIAIAZBoAFqIAQQ3gUgBkGQAWogBikDoAEgBkGgAWpBCGopAwBCf0L///////+///8AEOMFIAZBgAFqIAYpA5ABIAZBkAFqQQhqKQMAQn9C////////v///ABDjBSAGQYABakEIaikDACETIAYpA4ABIRAMAQsCQCATIANBnn5qrFMNAAJAIApBf0wNAANAIAZBoANqIBAgEUIAQoCAgICAgMD/v38Q1wUgECARQgBCgICAgICAgP8/ENoFIQcgBkGQA2ogECARIAYpA6ADIBAgB0F/SiIHGyAGQaADakEIaikDACARIAcbENcFIBNCf3whEyAGQZADakEIaikDACERIAYpA5ADIRAgCkEBdCAHciIKQX9KDQALCwJAAkAgEyADrH1CIHwiDqciB0EAIAdBAEobIAIgDiACrVMbIgdB8QBIDQAgBkGAA2ogBBDeBSAGQYgDaikDACEOQgAhDyAGKQOAAyESQgAhFAwBCyAGQeACakQAAAAAAADwP0GQASAHaxDGBRDcBSAGQdACaiAEEN4FIAZB8AJqIAYpA+ACIAZB4AJqQQhqKQMAIAYpA9ACIhIgBkHQAmpBCGopAwAiDhDHBSAGQfACakEIaikDACEUIAYpA/ACIQ8LIAZBwAJqIAogB0EgSCAQIBFCAEIAENkFQQBHcSAKQQFxRXEiB2oQ3wUgBkGwAmogEiAOIAYpA8ACIAZBwAJqQQhqKQMAEOMFIAZBkAJqIAYpA7ACIAZBsAJqQQhqKQMAIA8gFBDXBSAGQaACaiASIA5CACAQIAcbQgAgESAHGxDjBSAGQYACaiAGKQOgAiAGQaACakEIaikDACAGKQOQAiAGQZACakEIaikDABDXBSAGQfABaiAGKQOAAiAGQYACakEIaikDACAPIBQQ5gUCQCAGKQPwASIQIAZB8AFqQQhqKQMAIhFCAEIAENkFDQAQjwVBxAA2AgALIAZB4AFqIBAgESATpxDIBSAGQeABakEIaikDACETIAYpA+ABIRAMAQsQjwVBxAA2AgAgBkHQAWogBBDeBSAGQcABaiAGKQPQASAGQdABakEIaikDAEIAQoCAgICAgMAAEOMFIAZBsAFqIAYpA8ABIAZBwAFqQQhqKQMAQgBCgICAgICAwAAQ4wUgBkGwAWpBCGopAwAhEyAGKQOwASEQCyAAIBA3AwAgACATNwMIIAZBsANqJAAL+h8DC38GfgF8IwBBkMYAayIHJABBACEIQQAgBGsiCSADayEKQgAhEkEAIQsCQAJAAkADQAJAIAJBMEYNACACQS5HDQQgASgCBCICIAEoAmhGDQIgASACQQFqNgIEIAItAAAhAgwDCwJAIAEoAgQiAiABKAJoRg0AQQEhCyABIAJBAWo2AgQgAi0AACECDAELQQEhCyABEMQFIQIMAAsACyABEMQFIQILQQEhCEIAIRIgAkEwRw0AA0ACQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARDEBSECCyASQn98IRIgAkEwRg0AC0EBIQtBASEIC0EAIQwgB0EANgKQBiACQVBqIQ0CQAJAAkACQAJAAkACQCACQS5GIg4NAEIAIRMgDUEJTQ0AQQAhD0EAIRAMAQtCACETQQAhEEEAIQ9BACEMA0ACQAJAIA5BAXFFDQACQCAIDQAgEyESQQEhCAwCCyALRSEODAQLIBNCAXwhEwJAIA9B/A9KDQAgAkEwRiELIBOnIREgB0GQBmogD0ECdGohDgJAIBBFDQAgAiAOKAIAQQpsakFQaiENCyAMIBEgCxshDCAOIA02AgBBASELQQAgEEEBaiICIAJBCUYiAhshECAPIAJqIQ8MAQsgAkEwRg0AIAcgBygCgEZBAXI2AoBGQdyPASEMCwJAAkAgASgCBCICIAEoAmhGDQAgASACQQFqNgIEIAItAAAhAgwBCyABEMQFIQILIAJBUGohDSACQS5GIg4NACANQQpJDQALCyASIBMgCBshEgJAIAtFDQAgAkFfcUHFAEcNAAJAIAEgBhDPBSIUQoCAgICAgICAgH9SDQAgBkUNBEIAIRQgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgFCASfCESDAQLIAtFIQ4gAkEASA0BCyABKQNwQgBTDQAgASABKAIEQX9qNgIECyAORQ0BEI8FQRw2AgALQgAhEyABQgAQwwVCACESDAELAkAgBygCkAYiAQ0AIAcgBbdEAAAAAAAAAACiENwFIAdBCGopAwAhEiAHKQMAIRMMAQsCQCATQglVDQAgEiATUg0AAkAgA0EeSg0AIAEgA3YNAQsgB0EwaiAFEN4FIAdBIGogARDfBSAHQRBqIAcpAzAgB0EwakEIaikDACAHKQMgIAdBIGpBCGopAwAQ4wUgB0EQakEIaikDACESIAcpAxAhEwwBCwJAIBIgCUEBdq1XDQAQjwVBxAA2AgAgB0HgAGogBRDeBSAHQdAAaiAHKQNgIAdB4ABqQQhqKQMAQn9C////////v///ABDjBSAHQcAAaiAHKQNQIAdB0ABqQQhqKQMAQn9C////////v///ABDjBSAHQcAAakEIaikDACESIAcpA0AhEwwBCwJAIBIgBEGefmqsWQ0AEI8FQcQANgIAIAdBkAFqIAUQ3gUgB0GAAWogBykDkAEgB0GQAWpBCGopAwBCAEKAgICAgIDAABDjBSAHQfAAaiAHKQOAASAHQYABakEIaikDAEIAQoCAgICAgMAAEOMFIAdB8ABqQQhqKQMAIRIgBykDcCETDAELAkAgEEUNAAJAIBBBCEoNACAHQZAGaiAPQQJ0aiICKAIAIQEDQCABQQpsIQEgEEEBaiIQQQlHDQALIAIgATYCAAsgD0EBaiEPCyASpyEIAkAgDEEJTg0AIAwgCEoNACAIQRFKDQACQCAIQQlHDQAgB0HAAWogBRDeBSAHQbABaiAHKAKQBhDfBSAHQaABaiAHKQPAASAHQcABakEIaikDACAHKQOwASAHQbABakEIaikDABDjBSAHQaABakEIaikDACESIAcpA6ABIRMMAgsCQCAIQQhKDQAgB0GQAmogBRDeBSAHQYACaiAHKAKQBhDfBSAHQfABaiAHKQOQAiAHQZACakEIaikDACAHKQOAAiAHQYACakEIaikDABDjBSAHQeABakEIIAhrQQJ0QZDOAWooAgAQ3gUgB0HQAWogBykD8AEgB0HwAWpBCGopAwAgBykD4AEgB0HgAWpBCGopAwAQ2wUgB0HQAWpBCGopAwAhEiAHKQPQASETDAILIAcoApAGIQECQCADIAhBfWxqQRtqIgJBHkoNACABIAJ2DQELIAdB4AJqIAUQ3gUgB0HQAmogARDfBSAHQcACaiAHKQPgAiAHQeACakEIaikDACAHKQPQAiAHQdACakEIaikDABDjBSAHQbACaiAIQQJ0QejNAWooAgAQ3gUgB0GgAmogBykDwAIgB0HAAmpBCGopAwAgBykDsAIgB0GwAmpBCGopAwAQ4wUgB0GgAmpBCGopAwAhEiAHKQOgAiETDAELA0AgB0GQBmogDyICQX9qIg9BAnRqKAIARQ0AC0EAIRACQAJAIAhBCW8iAQ0AQQAhDgwBC0EAIQ4gAUEJaiABIAhBAEgbIQYCQAJAIAINAEEAIQIMAQtBgJTr3ANBCCAGa0ECdEGQzgFqKAIAIgttIRFBACENQQAhAUEAIQ4DQCAHQZAGaiABQQJ0aiIPIA8oAgAiDyALbiIMIA1qIg02AgAgDkEBakH/D3EgDiABIA5GIA1FcSINGyEOIAhBd2ogCCANGyEIIBEgDyAMIAtsa2whDSABQQFqIgEgAkcNAAsgDUUNACAHQZAGaiACQQJ0aiANNgIAIAJBAWohAgsgCCAGa0EJaiEICwNAIAdBkAZqIA5BAnRqIQwCQANAAkAgCEEkSA0AIAhBJEcNAiAMKAIAQdHp+QRPDQILIAJB/w9qIQ9BACENIAIhCwNAIAshAgJAAkAgB0GQBmogD0H/D3EiAUECdGoiCzUCAEIdhiANrXwiEkKBlOvcA1oNAEEAIQ0MAQsgEiASQoCU69wDgCITQoCU69wDfn0hEiATpyENCyALIBKnIg82AgAgAiACIAIgASAPGyABIA5GGyABIAJBf2pB/w9xRxshCyABQX9qIQ8gASAORw0ACyAQQWNqIRAgDUUNAAsCQCAOQX9qQf8PcSIOIAtHDQAgB0GQBmogC0H+D2pB/w9xQQJ0aiIBIAEoAgAgB0GQBmogC0F/akH/D3EiAkECdGooAgByNgIACyAIQQlqIQggB0GQBmogDkECdGogDTYCAAwBCwsCQANAIAJBAWpB/w9xIQkgB0GQBmogAkF/akH/D3FBAnRqIQYDQEEJQQEgCEEtShshDwJAA0AgDiELQQAhAQJAAkADQCABIAtqQf8PcSIOIAJGDQEgB0GQBmogDkECdGooAgAiDiABQQJ0QYDOAWooAgAiDUkNASAOIA1LDQIgAUEBaiIBQQRHDQALCyAIQSRHDQBCACESQQAhAUIAIRMDQAJAIAEgC2pB/w9xIg4gAkcNACACQQFqQf8PcSICQQJ0IAdBkAZqakF8akEANgIACyAHQYAGaiAHQZAGaiAOQQJ0aigCABDfBSAHQfAFaiASIBNCAEKAgICA5Zq3jsAAEOMFIAdB4AVqIAcpA/AFIAdB8AVqQQhqKQMAIAcpA4AGIAdBgAZqQQhqKQMAENcFIAdB4AVqQQhqKQMAIRMgBykD4AUhEiABQQFqIgFBBEcNAAsgB0HQBWogBRDeBSAHQcAFaiASIBMgBykD0AUgB0HQBWpBCGopAwAQ4wUgB0HABWpBCGopAwAhE0IAIRIgBykDwAUhFCAQQfEAaiINIARrIgFBACABQQBKGyADIAEgA0giDxsiDkHwAEwNAkIAIRVCACEWQgAhFwwFCyAPIBBqIRAgAiEOIAsgAkYNAAtBgJTr3AMgD3YhDEF/IA90QX9zIRFBACEBIAshDgNAIAdBkAZqIAtBAnRqIg0gDSgCACINIA92IAFqIgE2AgAgDkEBakH/D3EgDiALIA5GIAFFcSIBGyEOIAhBd2ogCCABGyEIIA0gEXEgDGwhASALQQFqQf8PcSILIAJHDQALIAFFDQECQCAJIA5GDQAgB0GQBmogAkECdGogATYCACAJIQIMAwsgBiAGKAIAQQFyNgIADAELCwsgB0GQBWpEAAAAAAAA8D9B4QEgDmsQxgUQ3AUgB0GwBWogBykDkAUgB0GQBWpBCGopAwAgFCATEMcFIAdBsAVqQQhqKQMAIRcgBykDsAUhFiAHQYAFakQAAAAAAADwP0HxACAOaxDGBRDcBSAHQaAFaiAUIBMgBykDgAUgB0GABWpBCGopAwAQygUgB0HwBGogFCATIAcpA6AFIhIgB0GgBWpBCGopAwAiFRDmBSAHQeAEaiAWIBcgBykD8AQgB0HwBGpBCGopAwAQ1wUgB0HgBGpBCGopAwAhEyAHKQPgBCEUCwJAIAtBBGpB/w9xIgggAkYNAAJAAkAgB0GQBmogCEECdGooAgAiCEH/ybXuAUsNAAJAIAgNACALQQVqQf8PcSACRg0CCyAHQfADaiAFt0QAAAAAAADQP6IQ3AUgB0HgA2ogEiAVIAcpA/ADIAdB8ANqQQhqKQMAENcFIAdB4ANqQQhqKQMAIRUgBykD4AMhEgwBCwJAIAhBgMq17gFGDQAgB0HQBGogBbdEAAAAAAAA6D+iENwFIAdBwARqIBIgFSAHKQPQBCAHQdAEakEIaikDABDXBSAHQcAEakEIaikDACEVIAcpA8AEIRIMAQsgBbchGAJAIAtBBWpB/w9xIAJHDQAgB0GQBGogGEQAAAAAAADgP6IQ3AUgB0GABGogEiAVIAcpA5AEIAdBkARqQQhqKQMAENcFIAdBgARqQQhqKQMAIRUgBykDgAQhEgwBCyAHQbAEaiAYRAAAAAAAAOg/ohDcBSAHQaAEaiASIBUgBykDsAQgB0GwBGpBCGopAwAQ1wUgB0GgBGpBCGopAwAhFSAHKQOgBCESCyAOQe8ASg0AIAdB0ANqIBIgFUIAQoCAgICAgMD/PxDKBSAHKQPQAyAHQdADakEIaikDAEIAQgAQ2QUNACAHQcADaiASIBVCAEKAgICAgIDA/z8Q1wUgB0HAA2pBCGopAwAhFSAHKQPAAyESCyAHQbADaiAUIBMgEiAVENcFIAdBoANqIAcpA7ADIAdBsANqQQhqKQMAIBYgFxDmBSAHQaADakEIaikDACETIAcpA6ADIRQCQCANQf////8HcSAKQX5qTA0AIAdBkANqIBQgExDLBSAHQYADaiAUIBNCAEKAgICAgICA/z8Q4wUgBykDkAMgB0GQA2pBCGopAwBCAEKAgICAgICAuMAAENoFIQIgB0GAA2pBCGopAwAgEyACQX9KIgIbIRMgBykDgAMgFCACGyEUIBIgFUIAQgAQ2QUhDQJAIBAgAmoiEEHuAGogCkoNACAPIA4gAUdxIA8gAhsgDUEAR3FFDQELEI8FQcQANgIACyAHQfACaiAUIBMgEBDIBSAHQfACakEIaikDACESIAcpA/ACIRMLIAAgEjcDCCAAIBM3AwAgB0GQxgBqJAALyQQCBH8BfgJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAwwBCyAAEMQFIQMLAkACQAJAAkACQCADQVVqDgMAAQABCwJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEMQFIQILIANBLUYhBCACQUZqIQUgAUUNASAFQXVLDQEgACkDcEIAUw0CIAAgACgCBEF/ajYCBAwCCyADQUZqIQVBACEEIAMhAgsgBUF2SQ0AQgAhBgJAIAJBUGoiBUEKTw0AQQAhAwNAIAIgA0EKbGohAwJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEMQFIQILIANBUGohAwJAIAJBUGoiBUEJSw0AIANBzJmz5gBIDQELCyADrCEGCwJAIAVBCk8NAANAIAKtIAZCCn58IQYCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABDEBSECCyAGQlB8IQYgAkFQaiIFQQlLDQEgBkKuj4XXx8LrowFTDQALCwJAIAVBCk8NAANAAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQxAUhAgsgAkFQakEKSQ0ACwsCQCAAKQNwQgBTDQAgACAAKAIEQX9qNgIEC0IAIAZ9IAYgBBshBgwBC0KAgICAgICAgIB/IQYgACkDcEIAUw0AIAAgACgCBEF/ajYCBEKAgICAgICAgIB/DwsgBguGAQIBfwJ+IwBBoAFrIgQkACAEIAE2AjwgBCABNgIUIARBfzYCGCAEQRBqQgAQwwUgBCAEQRBqIANBARDMBSAEQQhqKQMAIQUgBCkDACEGAkAgAkUNACACIAEgBCgCFCAEKAKIAWogBCgCPGtqNgIACyAAIAU3AwggACAGNwMAIARBoAFqJAALNQIBfwF8IwBBEGsiAiQAIAIgACABQQEQ0AUgAikDACACQQhqKQMAEOcFIQMgAkEQaiQAIAMLFgACQCAADQBBAA8LEI8FIAA2AgBBfwulKwELfyMAQRBrIgEkAAJAAkACQAJAAkACQAJAAkACQAJAIABB9AFLDQACQEEAKALg5gEiAkEQIABBC2pBeHEgAEELSRsiA0EDdiIEdiIAQQNxRQ0AAkACQCAAQX9zQQFxIARqIgVBA3QiBEGI5wFqIgAgBEGQ5wFqKAIAIgQoAggiA0cNAEEAIAJBfiAFd3E2AuDmAQwBCyADIAA2AgwgACADNgIICyAEQQhqIQAgBCAFQQN0IgVBA3I2AgQgBCAFaiIEIAQoAgRBAXI2AgQMCgsgA0EAKALo5gEiBk0NAQJAIABFDQACQAJAIAAgBHRBAiAEdCIAQQAgAGtycSIAQQAgAGtxaCIEQQN0IgBBiOcBaiIFIABBkOcBaigCACIAKAIIIgdHDQBBACACQX4gBHdxIgI2AuDmAQwBCyAHIAU2AgwgBSAHNgIICyAAIANBA3I2AgQgACADaiIHIARBA3QiBCADayIFQQFyNgIEIAAgBGogBTYCAAJAIAZFDQAgBkF4cUGI5wFqIQNBACgC9OYBIQQCQAJAIAJBASAGQQN2dCIIcQ0AQQAgAiAIcjYC4OYBIAMhCAwBCyADKAIIIQgLIAMgBDYCCCAIIAQ2AgwgBCADNgIMIAQgCDYCCAsgAEEIaiEAQQAgBzYC9OYBQQAgBTYC6OYBDAoLQQAoAuTmASIJRQ0BIAlBACAJa3FoQQJ0QZDpAWooAgAiBygCBEF4cSADayEEIAchBQJAA0ACQCAFKAIQIgANACAFQRRqKAIAIgBFDQILIAAoAgRBeHEgA2siBSAEIAUgBEkiBRshBCAAIAcgBRshByAAIQUMAAsACyAHKAIYIQoCQCAHKAIMIgggB0YNACAHKAIIIgBBACgC8OYBSRogACAINgIMIAggADYCCAwJCwJAIAdBFGoiBSgCACIADQAgBygCECIARQ0DIAdBEGohBQsDQCAFIQsgACIIQRRqIgUoAgAiAA0AIAhBEGohBSAIKAIQIgANAAsgC0EANgIADAgLQX8hAyAAQb9/Sw0AIABBC2oiAEF4cSEDQQAoAuTmASIGRQ0AQQAhCwJAIANBgAJJDQBBHyELIANB////B0sNACADQSYgAEEIdmciAGt2QQFxIABBAXRrQT5qIQsLQQAgA2shBAJAAkACQAJAIAtBAnRBkOkBaigCACIFDQBBACEAQQAhCAwBC0EAIQAgA0EAQRkgC0EBdmsgC0EfRht0IQdBACEIA0ACQCAFKAIEQXhxIANrIgIgBE8NACACIQQgBSEIIAINAEEAIQQgBSEIIAUhAAwDCyAAIAVBFGooAgAiAiACIAUgB0EddkEEcWpBEGooAgAiBUYbIAAgAhshACAHQQF0IQcgBQ0ACwsCQCAAIAhyDQBBACEIQQIgC3QiAEEAIABrciAGcSIARQ0DIABBACAAa3FoQQJ0QZDpAWooAgAhAAsgAEUNAQsDQCAAKAIEQXhxIANrIgIgBEkhBwJAIAAoAhAiBQ0AIABBFGooAgAhBQsgAiAEIAcbIQQgACAIIAcbIQggBSEAIAUNAAsLIAhFDQAgBEEAKALo5gEgA2tPDQAgCCgCGCELAkAgCCgCDCIHIAhGDQAgCCgCCCIAQQAoAvDmAUkaIAAgBzYCDCAHIAA2AggMBwsCQCAIQRRqIgUoAgAiAA0AIAgoAhAiAEUNAyAIQRBqIQULA0AgBSECIAAiB0EUaiIFKAIAIgANACAHQRBqIQUgBygCECIADQALIAJBADYCAAwGCwJAQQAoAujmASIAIANJDQBBACgC9OYBIQQCQAJAIAAgA2siBUEQSQ0AIAQgA2oiByAFQQFyNgIEIAQgAGogBTYCACAEIANBA3I2AgQMAQsgBCAAQQNyNgIEIAQgAGoiACAAKAIEQQFyNgIEQQAhB0EAIQULQQAgBTYC6OYBQQAgBzYC9OYBIARBCGohAAwICwJAQQAoAuzmASIHIANNDQBBACAHIANrIgQ2AuzmAUEAQQAoAvjmASIAIANqIgU2AvjmASAFIARBAXI2AgQgACADQQNyNgIEIABBCGohAAwICwJAAkBBACgCuOoBRQ0AQQAoAsDqASEEDAELQQBCfzcCxOoBQQBCgKCAgICABDcCvOoBQQAgAUEMakFwcUHYqtWqBXM2ArjqAUEAQQA2AszqAUEAQQA2ApzqAUGAICEEC0EAIQAgBCADQS9qIgZqIgJBACAEayILcSIIIANNDQdBACEAAkBBACgCmOoBIgRFDQBBACgCkOoBIgUgCGoiCSAFTQ0IIAkgBEsNCAsCQAJAQQAtAJzqAUEEcQ0AAkACQAJAAkACQEEAKAL45gEiBEUNAEGg6gEhAANAAkAgACgCACIFIARLDQAgBSAAKAIEaiAESw0DCyAAKAIIIgANAAsLQQAQ1gUiB0F/Rg0DIAghAgJAQQAoArzqASIAQX9qIgQgB3FFDQAgCCAHayAEIAdqQQAgAGtxaiECCyACIANNDQMCQEEAKAKY6gEiAEUNAEEAKAKQ6gEiBCACaiIFIARNDQQgBSAASw0ECyACENYFIgAgB0cNAQwFCyACIAdrIAtxIgIQ1gUiByAAKAIAIAAoAgRqRg0BIAchAAsgAEF/Rg0BAkAgA0EwaiACSw0AIAAhBwwECyAGIAJrQQAoAsDqASIEakEAIARrcSIEENYFQX9GDQEgBCACaiECIAAhBwwDCyAHQX9HDQILQQBBACgCnOoBQQRyNgKc6gELIAgQ1gUhB0EAENYFIQAgB0F/Rg0FIABBf0YNBSAHIABPDQUgACAHayICIANBKGpNDQULQQBBACgCkOoBIAJqIgA2ApDqAQJAIABBACgClOoBTQ0AQQAgADYClOoBCwJAAkBBACgC+OYBIgRFDQBBoOoBIQADQCAHIAAoAgAiBSAAKAIEIghqRg0CIAAoAggiAA0ADAULAAsCQAJAQQAoAvDmASIARQ0AIAcgAE8NAQtBACAHNgLw5gELQQAhAEEAIAI2AqTqAUEAIAc2AqDqAUEAQX82AoDnAUEAQQAoArjqATYChOcBQQBBADYCrOoBA0AgAEEDdCIEQZDnAWogBEGI5wFqIgU2AgAgBEGU5wFqIAU2AgAgAEEBaiIAQSBHDQALQQAgAkFYaiIAQXggB2tBB3FBACAHQQhqQQdxGyIEayIFNgLs5gFBACAHIARqIgQ2AvjmASAEIAVBAXI2AgQgByAAakEoNgIEQQBBACgCyOoBNgL85gEMBAsgAC0ADEEIcQ0CIAQgBUkNAiAEIAdPDQIgACAIIAJqNgIEQQAgBEF4IARrQQdxQQAgBEEIakEHcRsiAGoiBTYC+OYBQQBBACgC7OYBIAJqIgcgAGsiADYC7OYBIAUgAEEBcjYCBCAEIAdqQSg2AgRBAEEAKALI6gE2AvzmAQwDC0EAIQgMBQtBACEHDAMLAkAgB0EAKALw5gEiCE8NAEEAIAc2AvDmASAHIQgLIAcgAmohBUGg6gEhAAJAAkACQAJAAkACQAJAA0AgACgCACAFRg0BIAAoAggiAA0ADAILAAsgAC0ADEEIcUUNAQtBoOoBIQADQAJAIAAoAgAiBSAESw0AIAUgACgCBGoiBSAESw0DCyAAKAIIIQAMAAsACyAAIAc2AgAgACAAKAIEIAJqNgIEIAdBeCAHa0EHcUEAIAdBCGpBB3EbaiILIANBA3I2AgQgBUF4IAVrQQdxQQAgBUEIakEHcRtqIgIgCyADaiIDayEAAkAgAiAERw0AQQAgAzYC+OYBQQBBACgC7OYBIABqIgA2AuzmASADIABBAXI2AgQMAwsCQCACQQAoAvTmAUcNAEEAIAM2AvTmAUEAQQAoAujmASAAaiIANgLo5gEgAyAAQQFyNgIEIAMgAGogADYCAAwDCwJAIAIoAgQiBEEDcUEBRw0AIARBeHEhBgJAAkAgBEH/AUsNACACKAIIIgUgBEEDdiIIQQN0QYjnAWoiB0YaAkAgAigCDCIEIAVHDQBBAEEAKALg5gFBfiAId3E2AuDmAQwCCyAEIAdGGiAFIAQ2AgwgBCAFNgIIDAELIAIoAhghCQJAAkAgAigCDCIHIAJGDQAgAigCCCIEIAhJGiAEIAc2AgwgByAENgIIDAELAkAgAkEUaiIEKAIAIgUNACACQRBqIgQoAgAiBQ0AQQAhBwwBCwNAIAQhCCAFIgdBFGoiBCgCACIFDQAgB0EQaiEEIAcoAhAiBQ0ACyAIQQA2AgALIAlFDQACQAJAIAIgAigCHCIFQQJ0QZDpAWoiBCgCAEcNACAEIAc2AgAgBw0BQQBBACgC5OYBQX4gBXdxNgLk5gEMAgsgCUEQQRQgCSgCECACRhtqIAc2AgAgB0UNAQsgByAJNgIYAkAgAigCECIERQ0AIAcgBDYCECAEIAc2AhgLIAIoAhQiBEUNACAHQRRqIAQ2AgAgBCAHNgIYCyAGIABqIQAgAiAGaiICKAIEIQQLIAIgBEF+cTYCBCADIABBAXI2AgQgAyAAaiAANgIAAkAgAEH/AUsNACAAQXhxQYjnAWohBAJAAkBBACgC4OYBIgVBASAAQQN2dCIAcQ0AQQAgBSAAcjYC4OYBIAQhAAwBCyAEKAIIIQALIAQgAzYCCCAAIAM2AgwgAyAENgIMIAMgADYCCAwDC0EfIQQCQCAAQf///wdLDQAgAEEmIABBCHZnIgRrdkEBcSAEQQF0a0E+aiEECyADIAQ2AhwgA0IANwIQIARBAnRBkOkBaiEFAkACQEEAKALk5gEiB0EBIAR0IghxDQBBACAHIAhyNgLk5gEgBSADNgIAIAMgBTYCGAwBCyAAQQBBGSAEQQF2ayAEQR9GG3QhBCAFKAIAIQcDQCAHIgUoAgRBeHEgAEYNAyAEQR12IQcgBEEBdCEEIAUgB0EEcWpBEGoiCCgCACIHDQALIAggAzYCACADIAU2AhgLIAMgAzYCDCADIAM2AggMAgtBACACQVhqIgBBeCAHa0EHcUEAIAdBCGpBB3EbIghrIgs2AuzmAUEAIAcgCGoiCDYC+OYBIAggC0EBcjYCBCAHIABqQSg2AgRBAEEAKALI6gE2AvzmASAEIAVBJyAFa0EHcUEAIAVBWWpBB3EbakFRaiIAIAAgBEEQakkbIghBGzYCBCAIQRBqQQApAqjqATcCACAIQQApAqDqATcCCEEAIAhBCGo2AqjqAUEAIAI2AqTqAUEAIAc2AqDqAUEAQQA2AqzqASAIQRhqIQADQCAAQQc2AgQgAEEIaiEHIABBBGohACAHIAVJDQALIAggBEYNAyAIIAgoAgRBfnE2AgQgBCAIIARrIgdBAXI2AgQgCCAHNgIAAkAgB0H/AUsNACAHQXhxQYjnAWohAAJAAkBBACgC4OYBIgVBASAHQQN2dCIHcQ0AQQAgBSAHcjYC4OYBIAAhBQwBCyAAKAIIIQULIAAgBDYCCCAFIAQ2AgwgBCAANgIMIAQgBTYCCAwEC0EfIQACQCAHQf///wdLDQAgB0EmIAdBCHZnIgBrdkEBcSAAQQF0a0E+aiEACyAEIAA2AhwgBEIANwIQIABBAnRBkOkBaiEFAkACQEEAKALk5gEiCEEBIAB0IgJxDQBBACAIIAJyNgLk5gEgBSAENgIAIAQgBTYCGAwBCyAHQQBBGSAAQQF2ayAAQR9GG3QhACAFKAIAIQgDQCAIIgUoAgRBeHEgB0YNBCAAQR12IQggAEEBdCEAIAUgCEEEcWpBEGoiAigCACIIDQALIAIgBDYCACAEIAU2AhgLIAQgBDYCDCAEIAQ2AggMAwsgBSgCCCIAIAM2AgwgBSADNgIIIANBADYCGCADIAU2AgwgAyAANgIICyALQQhqIQAMBQsgBSgCCCIAIAQ2AgwgBSAENgIIIARBADYCGCAEIAU2AgwgBCAANgIIC0EAKALs5gEiACADTQ0AQQAgACADayIENgLs5gFBAEEAKAL45gEiACADaiIFNgL45gEgBSAEQQFyNgIEIAAgA0EDcjYCBCAAQQhqIQAMAwsQjwVBMDYCAEEAIQAMAgsCQCALRQ0AAkACQCAIIAgoAhwiBUECdEGQ6QFqIgAoAgBHDQAgACAHNgIAIAcNAUEAIAZBfiAFd3EiBjYC5OYBDAILIAtBEEEUIAsoAhAgCEYbaiAHNgIAIAdFDQELIAcgCzYCGAJAIAgoAhAiAEUNACAHIAA2AhAgACAHNgIYCyAIQRRqKAIAIgBFDQAgB0EUaiAANgIAIAAgBzYCGAsCQAJAIARBD0sNACAIIAQgA2oiAEEDcjYCBCAIIABqIgAgACgCBEEBcjYCBAwBCyAIIANBA3I2AgQgCCADaiIHIARBAXI2AgQgByAEaiAENgIAAkAgBEH/AUsNACAEQXhxQYjnAWohAAJAAkBBACgC4OYBIgVBASAEQQN2dCIEcQ0AQQAgBSAEcjYC4OYBIAAhBAwBCyAAKAIIIQQLIAAgBzYCCCAEIAc2AgwgByAANgIMIAcgBDYCCAwBC0EfIQACQCAEQf///wdLDQAgBEEmIARBCHZnIgBrdkEBcSAAQQF0a0E+aiEACyAHIAA2AhwgB0IANwIQIABBAnRBkOkBaiEFAkACQAJAIAZBASAAdCIDcQ0AQQAgBiADcjYC5OYBIAUgBzYCACAHIAU2AhgMAQsgBEEAQRkgAEEBdmsgAEEfRht0IQAgBSgCACEDA0AgAyIFKAIEQXhxIARGDQIgAEEddiEDIABBAXQhACAFIANBBHFqQRBqIgIoAgAiAw0ACyACIAc2AgAgByAFNgIYCyAHIAc2AgwgByAHNgIIDAELIAUoAggiACAHNgIMIAUgBzYCCCAHQQA2AhggByAFNgIMIAcgADYCCAsgCEEIaiEADAELAkAgCkUNAAJAAkAgByAHKAIcIgVBAnRBkOkBaiIAKAIARw0AIAAgCDYCACAIDQFBACAJQX4gBXdxNgLk5gEMAgsgCkEQQRQgCigCECAHRhtqIAg2AgAgCEUNAQsgCCAKNgIYAkAgBygCECIARQ0AIAggADYCECAAIAg2AhgLIAdBFGooAgAiAEUNACAIQRRqIAA2AgAgACAINgIYCwJAAkAgBEEPSw0AIAcgBCADaiIAQQNyNgIEIAcgAGoiACAAKAIEQQFyNgIEDAELIAcgA0EDcjYCBCAHIANqIgUgBEEBcjYCBCAFIARqIAQ2AgACQCAGRQ0AIAZBeHFBiOcBaiEDQQAoAvTmASEAAkACQEEBIAZBA3Z0IgggAnENAEEAIAggAnI2AuDmASADIQgMAQsgAygCCCEICyADIAA2AgggCCAANgIMIAAgAzYCDCAAIAg2AggLQQAgBTYC9OYBQQAgBDYC6OYBCyAHQQhqIQALIAFBEGokACAAC8wMAQd/AkAgAEUNACAAQXhqIgEgAEF8aigCACICQXhxIgBqIQMCQCACQQFxDQAgAkEDcUUNASABIAEoAgAiAmsiAUEAKALw5gEiBEkNASACIABqIQACQCABQQAoAvTmAUYNAAJAIAJB/wFLDQAgASgCCCIEIAJBA3YiBUEDdEGI5wFqIgZGGgJAIAEoAgwiAiAERw0AQQBBACgC4OYBQX4gBXdxNgLg5gEMAwsgAiAGRhogBCACNgIMIAIgBDYCCAwCCyABKAIYIQcCQAJAIAEoAgwiBiABRg0AIAEoAggiAiAESRogAiAGNgIMIAYgAjYCCAwBCwJAIAFBFGoiAigCACIEDQAgAUEQaiICKAIAIgQNAEEAIQYMAQsDQCACIQUgBCIGQRRqIgIoAgAiBA0AIAZBEGohAiAGKAIQIgQNAAsgBUEANgIACyAHRQ0BAkACQCABIAEoAhwiBEECdEGQ6QFqIgIoAgBHDQAgAiAGNgIAIAYNAUEAQQAoAuTmAUF+IAR3cTYC5OYBDAMLIAdBEEEUIAcoAhAgAUYbaiAGNgIAIAZFDQILIAYgBzYCGAJAIAEoAhAiAkUNACAGIAI2AhAgAiAGNgIYCyABKAIUIgJFDQEgBkEUaiACNgIAIAIgBjYCGAwBCyADKAIEIgJBA3FBA0cNAEEAIAA2AujmASADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAA8LIAEgA08NACADKAIEIgJBAXFFDQACQAJAIAJBAnENAAJAIANBACgC+OYBRw0AQQAgATYC+OYBQQBBACgC7OYBIABqIgA2AuzmASABIABBAXI2AgQgAUEAKAL05gFHDQNBAEEANgLo5gFBAEEANgL05gEPCwJAIANBACgC9OYBRw0AQQAgATYC9OYBQQBBACgC6OYBIABqIgA2AujmASABIABBAXI2AgQgASAAaiAANgIADwsgAkF4cSAAaiEAAkACQCACQf8BSw0AIAMoAggiBCACQQN2IgVBA3RBiOcBaiIGRhoCQCADKAIMIgIgBEcNAEEAQQAoAuDmAUF+IAV3cTYC4OYBDAILIAIgBkYaIAQgAjYCDCACIAQ2AggMAQsgAygCGCEHAkACQCADKAIMIgYgA0YNACADKAIIIgJBACgC8OYBSRogAiAGNgIMIAYgAjYCCAwBCwJAIANBFGoiAigCACIEDQAgA0EQaiICKAIAIgQNAEEAIQYMAQsDQCACIQUgBCIGQRRqIgIoAgAiBA0AIAZBEGohAiAGKAIQIgQNAAsgBUEANgIACyAHRQ0AAkACQCADIAMoAhwiBEECdEGQ6QFqIgIoAgBHDQAgAiAGNgIAIAYNAUEAQQAoAuTmAUF+IAR3cTYC5OYBDAILIAdBEEEUIAcoAhAgA0YbaiAGNgIAIAZFDQELIAYgBzYCGAJAIAMoAhAiAkUNACAGIAI2AhAgAiAGNgIYCyADKAIUIgJFDQAgBkEUaiACNgIAIAIgBjYCGAsgASAAQQFyNgIEIAEgAGogADYCACABQQAoAvTmAUcNAUEAIAA2AujmAQ8LIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIACwJAIABB/wFLDQAgAEF4cUGI5wFqIQICQAJAQQAoAuDmASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AuDmASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRBkOkBaiEEAkACQAJAAkBBACgC5OYBIgZBASACdCIDcQ0AQQAgBiADcjYC5OYBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKA5wFBf2oiAUF/IAEbNgKA5wELCwcAPwBBEHQLVAECf0EAKAL80gEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ1QVNDQAgABAVRQ0BC0EAIAA2AvzSASABDwsQjwVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqENgFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDYBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ2AUgBUEwaiAKIAEgBxDiBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHENgFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqENgFIAUgAiAEQQEgBmsQ4gUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEOAFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEOEFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ2AVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDYBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDkBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDkBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDkBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDkBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDkBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDkBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDkBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDkBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDkBSAFQZABaiADQg+GQgAgBEIAEOQFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ5AUgBUGAAWpCASACfUIAIARCABDkBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEOQFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEOQFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ4gUgBUEwaiAWIBMgBkHwAGoQ2AUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q5AUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDkBSAFIAMgDkIFQgAQ5AUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqENgFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqENgFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ2AUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ2AUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ2AVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ2AUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ2AUgBUEgaiACIAQgBhDYBSAFQRBqIBIgASAHEOIFIAUgAiAEIAcQ4gUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FENcFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDYBSACIAAgBEGB+AAgA2sQ4gUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHQ6gUkA0HQ6gFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAERAACyUBAX4gACABIAKtIAOtQiCGhCAEEPIFIQUgBUIgiKcQ6AUgBacLEwAgACABpyABQiCIpyACIAMQFgsLrtOBgAADAEGACAvIxgFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBkZXZzX2pzb25fc3RyaW5naWZ5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAcm90YXJ5RW5jb2RlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AYnV0dG9uACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgB3aW5kRGlyZWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAbWFya19ibG9jawBhbGxvY19ibG9jawBzdGFjawB0b19nY19vYmoAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABzeiAtIDEgPT0gcy0+bGVuZ3RoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoACEgdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGludmFsaWQgZmxhZyBhcmcAbmVlZCBmbGFnIGFyZwAqcHJvZwBsb2cAc2V0dGluZwBnZXR0aW5nAERDRkcgbWlzc2luZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAlcyB0b28gYmlnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAHNldFByb3RvdHlwZU9mAGdldFByb3RvdHlwZU9mACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGdjcmVmX3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAaGVhcnRSYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAGRhdGFfcGFnZV91c2VkAFdTU0stSDogZndkIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZAAlLXMlZAAlLXNfJWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IGZ3ZF9lbjogJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAdHZvYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTAAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBQSQBESVNDT05ORUNUSU5HAGRldnNfZ2NfdGFnKGRldnNfaGFuZGxlX3B0cl92YWx1ZShjdHgsIHYpKSA9PSBERVZTX0dDX1RBR19TVFJJTkcAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gRkxBU0hfU0laRQAwIDw9IGRpZmYgJiYgZGlmZiA8PSBGTEFTSF9TSVpFIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAqICBwYz0lZCBAID8/PwAlYyAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbGVuID09IGwyAGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBhcmcwAGxvZzEwAExOMTAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2djX29ial92YWxpZChjdHgsIHB0cikAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2djX29ial92YWxpZChjdHgsIHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpACF0YXJnZXRf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IChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAAxfGAgAAEbmFtZQHVcPUFAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9sb2FkAgVhYm9ydAMTX2RldnNfcGFuaWNfaGFuZGxlcgQRZW1fZGVwbG95X2hhbmRsZXIFF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tBg1lbV9zZW5kX2ZyYW1lBxBlbV9jb25zb2xlX2RlYnVnCARleGl0CQtlbV90aW1lX25vdwogZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkLIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAwYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3DTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZA4zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQQNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkERplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZRIPX193YXNpX2ZkX2Nsb3NlExVlbXNjcmlwdGVuX21lbWNweV9iaWcUD19fd2FzaV9mZF93cml0ZRUWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBYabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsXEV9fd2FzbV9jYWxsX2N0b3JzGA9mbGFzaF9iYXNlX2FkZHIZDWZsYXNoX3Byb2dyYW0aC2ZsYXNoX2VyYXNlGwpmbGFzaF9zeW5jHApmbGFzaF9pbml0HQhod19wYW5pYx4IamRfYmxpbmsfB2pkX2dsb3cgFGpkX2FsbG9jX3N0YWNrX2NoZWNrIQhqZF9hbGxvYyIHamRfZnJlZSMNdGFyZ2V0X2luX2lycSQSdGFyZ2V0X2Rpc2FibGVfaXJxJRF0YXJnZXRfZW5hYmxlX2lycSYYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJxJkZXZzX3BhbmljX2hhbmRsZXIoE2RldnNfZGVwbG95X2hhbmRsZXIpFGpkX2NyeXB0b19nZXRfcmFuZG9tKhBqZF9lbV9zZW5kX2ZyYW1lKxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMiwaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmctCmpkX2VtX2luaXQuDWpkX2VtX3Byb2Nlc3MvBWRtZXNnMBRqZF9lbV9mcmFtZV9yZWNlaXZlZDERamRfZW1fZGV2c19kZXBsb3kyEWpkX2VtX2RldnNfdmVyaWZ5MxhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3k0G2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczUZamRfZW1fZGV2c19lbmFibGVfbG9nZ2luZzYMaHdfZGV2aWNlX2lkNwx0YXJnZXRfcmVzZXQ4DnRpbV9nZXRfbWljcm9zORJqZF90Y3Bzb2NrX3Byb2Nlc3M6EWFwcF9pbml0X3NlcnZpY2VzOxJkZXZzX2NsaWVudF9kZXBsb3k8FGNsaWVudF9ldmVudF9oYW5kbGVyPQthcHBfcHJvY2Vzcz4HdHhfaW5pdD8PamRfcGFja2V0X3JlYWR5QAp0eF9wcm9jZXNzQRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUIOamRfd2Vic29ja19uZXdDBm9ub3BlbkQHb25lcnJvckUHb25jbG9zZUYJb25tZXNzYWdlRxBqZF93ZWJzb2NrX2Nsb3NlSA5hZ2didWZmZXJfaW5pdEkPYWdnYnVmZmVyX2ZsdXNoShBhZ2didWZmZXJfdXBsb2FkSw5kZXZzX2J1ZmZlcl9vcEwQZGV2c19yZWFkX251bWJlck0SZGV2c19idWZmZXJfZGVjb2RlThJkZXZzX2J1ZmZlcl9lbmNvZGVPD2RldnNfY3JlYXRlX2N0eFAJc2V0dXBfY3R4UQpkZXZzX3RyYWNlUg9kZXZzX2Vycm9yX2NvZGVTGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJUCWNsZWFyX2N0eFUNZGV2c19mcmVlX2N0eFYIZGV2c19vb21XCWRldnNfZnJlZVgRZGV2c2Nsb3VkX3Byb2Nlc3NZF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0WhNkZXZzY2xvdWRfb25fbWV0aG9kWw5kZXZzY2xvdWRfaW5pdFwPZGV2c2RiZ19wcm9jZXNzXRFkZXZzZGJnX3Jlc3RhcnRlZF4VZGV2c2RiZ19oYW5kbGVfcGFja2V0XwtzZW5kX3ZhbHVlc2ARdmFsdWVfZnJvbV90YWdfdjBhGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGViDW9ial9nZXRfcHJvcHNjDGV4cGFuZF92YWx1ZWQSZGV2c2RiZ19zdXNwZW5kX2NiZQxkZXZzZGJnX2luaXRmEGV4cGFuZF9rZXlfdmFsdWVnBmt2X2FkZGgPZGV2c21ncl9wcm9jZXNzaQd0cnlfcnVuagxzdG9wX3Byb2dyYW1rD2RldnNtZ3JfcmVzdGFydGwUZGV2c21ncl9kZXBsb3lfc3RhcnRtFGRldnNtZ3JfZGVwbG95X3dyaXRlbhBkZXZzbWdyX2dldF9oYXNobxVkZXZzbWdyX2hhbmRsZV9wYWNrZXRwDmRlcGxveV9oYW5kbGVycRNkZXBsb3lfbWV0YV9oYW5kbGVycg9kZXZzbWdyX2dldF9jdHhzDmRldnNtZ3JfZGVwbG95dBNkZXZzbWdyX3NldF9sb2dnaW5ndQxkZXZzbWdyX2luaXR2EWRldnNtZ3JfY2xpZW50X2V2dxBkZXZzX2ZpYmVyX3lpZWxkeBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb255GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXoQZGV2c19maWJlcl9zbGVlcHsbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsfBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc30RZGV2c19pbWdfZnVuX25hbWV+EmRldnNfaW1nX3JvbGVfbmFtZX8SZGV2c19maWJlcl9ieV9maWR4gAERZGV2c19maWJlcl9ieV90YWeBARBkZXZzX2ZpYmVyX3N0YXJ0ggEUZGV2c19maWJlcl90ZXJtaWFudGWDAQ5kZXZzX2ZpYmVyX3J1boQBE2RldnNfZmliZXJfc3luY19ub3eFAQpkZXZzX3BhbmljhgEVX2RldnNfaW52YWxpZF9wcm9ncmFthwEPZGV2c19maWJlcl9wb2tliAETamRfZ2NfYW55X3RyeV9hbGxvY4kBB2RldnNfZ2OKAQ9maW5kX2ZyZWVfYmxvY2uLARJkZXZzX2FueV90cnlfYWxsb2OMAQ5kZXZzX3RyeV9hbGxvY40BC2pkX2djX3VucGlujgEKamRfZ2NfZnJlZY8BFGRldnNfdmFsdWVfaXNfcGlubmVkkAEOZGV2c192YWx1ZV9waW6RARBkZXZzX3ZhbHVlX3VucGlukgESZGV2c19tYXBfdHJ5X2FsbG9jkwEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jlAEUZGV2c19hcnJheV90cnlfYWxsb2OVARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OWARVkZXZzX3N0cmluZ190cnlfYWxsb2OXARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJgBD2RldnNfZ2Nfc2V0X2N0eJkBDmRldnNfZ2NfY3JlYXRlmgEPZGV2c19nY19kZXN0cm95mwERZGV2c19nY19vYmpfdmFsaWScAQtzY2FuX2djX29iap0BEXByb3BfQXJyYXlfbGVuZ3RongESbWV0aDJfQXJyYXlfaW5zZXJ0nwESZnVuMV9BcnJheV9pc0FycmF5oAEQbWV0aFhfQXJyYXlfcHVzaKEBFW1ldGgxX0FycmF5X3B1c2hSYW5nZaIBEW1ldGhYX0FycmF5X3NsaWNlowERZnVuMV9CdWZmZXJfYWxsb2OkARJwcm9wX0J1ZmZlcl9sZW5ndGilARVtZXRoMF9CdWZmZXJfdG9TdHJpbmemARNtZXRoM19CdWZmZXJfZmlsbEF0pwETbWV0aDRfQnVmZmVyX2JsaXRBdKgBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOpARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOqARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SrARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSsARVmdW4xX0RldmljZVNjcmlwdF9sb2etARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rgEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSvARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcrABFG1ldGgxX0Vycm9yX19fY3Rvcl9fsQEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7IBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7MBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9ftAEPcHJvcF9FcnJvcl9uYW1ltQERbWV0aDBfRXJyb3JfcHJpbnS2ARRtZXRoWF9GdW5jdGlvbl9zdGFydLcBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBluAEScHJvcF9GdW5jdGlvbl9uYW1luQEPZnVuMl9KU09OX3BhcnNlugETZnVuM19KU09OX3N0cmluZ2lmebsBDmZ1bjFfTWF0aF9jZWlsvAEPZnVuMV9NYXRoX2Zsb29yvQEPZnVuMV9NYXRoX3JvdW5kvgENZnVuMV9NYXRoX2Fic78BEGZ1bjBfTWF0aF9yYW5kb23AARNmdW4xX01hdGhfcmFuZG9tSW50wQENZnVuMV9NYXRoX2xvZ8IBDWZ1bjJfTWF0aF9wb3fDAQ5mdW4yX01hdGhfaWRpdsQBDmZ1bjJfTWF0aF9pbW9kxQEOZnVuMl9NYXRoX2ltdWzGAQ1mdW4yX01hdGhfbWluxwELZnVuMl9taW5tYXjIAQ1mdW4yX01hdGhfbWF4yQESZnVuMl9PYmplY3RfYXNzaWduygEQZnVuMV9PYmplY3Rfa2V5c8sBE2Z1bjFfa2V5c19vcl92YWx1ZXPMARJmdW4xX09iamVjdF92YWx1ZXPNARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZs4BEHByb3BfUGFja2V0X3JvbGXPARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVy0AETcHJvcF9QYWNrZXRfc2hvcnRJZNEBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleNIBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5k0wERcHJvcF9QYWNrZXRfZmxhZ3PUARVwcm9wX1BhY2tldF9pc0NvbW1hbmTVARRwcm9wX1BhY2tldF9pc1JlcG9ydNYBE3Byb3BfUGFja2V0X3BheWxvYWTXARNwcm9wX1BhY2tldF9pc0V2ZW502AEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl2QEUcHJvcF9QYWNrZXRfaXNSZWdTZXTaARRwcm9wX1BhY2tldF9pc1JlZ0dldNsBE3Byb3BfUGFja2V0X3JlZ0NvZGXcARNtZXRoMF9QYWNrZXRfZGVjb2Rl3QESZGV2c19wYWNrZXRfZGVjb2Rl3gEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk3wEURHNSZWdpc3Rlcl9yZWFkX2NvbnTgARJkZXZzX3BhY2tldF9lbmNvZGXhARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl4gEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZeMBFnByb3BfRHNQYWNrZXRJbmZvX25hbWXkARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl5QEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f5gEXcHJvcF9Ec1JvbGVfaXNDb25uZWN0ZWTnARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmToARFtZXRoMF9Ec1JvbGVfd2FpdOkBEnByb3BfU3RyaW5nX2xlbmd0aOoBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF06wETbWV0aDFfU3RyaW5nX2NoYXJBdOwBEm1ldGgyX1N0cmluZ19zbGljZe0BFGRldnNfamRfZ2V0X3JlZ2lzdGVy7gEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZO8BEGRldnNfamRfc2VuZF9jbWTwARFkZXZzX2pkX3dha2Vfcm9sZfEBFGRldnNfamRfcmVzZXRfcGFja2V08gETZGV2c19qZF9wa3RfY2FwdHVyZfMBE2RldnNfamRfc2VuZF9sb2dtc2f0AQ1oYW5kbGVfbG9nbXNn9QESZGV2c19qZF9zaG91bGRfcnVu9gEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGX3ARNkZXZzX2pkX3Byb2Nlc3NfcGt0+AEUZGV2c19qZF9yb2xlX2NoYW5nZWT5ARJkZXZzX2pkX2luaXRfcm9sZXP6ARJkZXZzX2pkX2ZyZWVfcm9sZXP7ARBkZXZzX3NldF9sb2dnaW5n/AEVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz/QEXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3P+ARVkZXZzX2dldF9nbG9iYWxfZmxhZ3P/ARBkZXZzX2pzb25fZXNjYXBlgAIVZGV2c19qc29uX2VzY2FwZV9jb3JlgQIPZGV2c19qc29uX3BhcnNlggIKanNvbl92YWx1ZYMCDHBhcnNlX3N0cmluZ4QCDXN0cmluZ2lmeV9vYmqFAgphZGRfaW5kZW50hgIPc3RyaW5naWZ5X2ZpZWxkhwITZGV2c19qc29uX3N0cmluZ2lmeYgCEXBhcnNlX3N0cmluZ19jb3JliQIRZGV2c19tYXBsaWtlX2l0ZXKKAhdkZXZzX2dldF9idWlsdGluX29iamVjdIsCEmRldnNfbWFwX2NvcHlfaW50b4wCDGRldnNfbWFwX3NldI0CBmxvb2t1cI4CE2RldnNfbWFwbGlrZV9pc19tYXCPAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXOQAhFkZXZzX2FycmF5X2luc2VydJECCGt2X2FkZC4xkgISZGV2c19zaG9ydF9tYXBfc2V0kwIPZGV2c19tYXBfZGVsZXRllAISZGV2c19zaG9ydF9tYXBfZ2V0lQIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXSWAg5kZXZzX3JvbGVfc3BlY5cCEmRldnNfZnVuY3Rpb25fYmluZJgCEWRldnNfbWFrZV9jbG9zdXJlmQIOZGV2c19nZXRfZm5pZHiaAhNkZXZzX2dldF9mbmlkeF9jb3JlmwIeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxknAITZGV2c19nZXRfcm9sZV9wcm90b50CG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd54CGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZJ8CFWRldnNfZ2V0X3N0YXRpY19wcm90b6ACG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb6ECHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtogIWZGV2c19tYXBsaWtlX2dldF9wcm90b6MCGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZKQCGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZKUCEGRldnNfaW5zdGFuY2Vfb2amAg9kZXZzX29iamVjdF9nZXSnAgxkZXZzX3NlcV9nZXSoAgxkZXZzX2FueV9nZXSpAgxkZXZzX2FueV9zZXSqAgxkZXZzX3NlcV9zZXSrAg5kZXZzX2FycmF5X3NldKwCE2RldnNfYXJyYXlfcGluX3B1c2itAgxkZXZzX2FyZ19pbnSuAg9kZXZzX2FyZ19kb3VibGWvAg9kZXZzX3JldF9kb3VibGWwAgxkZXZzX3JldF9pbnSxAg1kZXZzX3JldF9ib29ssgIPZGV2c19yZXRfZ2NfcHRyswIRZGV2c19hcmdfc2VsZl9tYXC0AhFkZXZzX3NldHVwX3Jlc3VtZbUCD2RldnNfY2FuX2F0dGFjaLYCGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWW3AhVkZXZzX21hcGxpa2VfdG9fdmFsdWW4AhJkZXZzX3JlZ2NhY2hlX2ZyZWW5AhZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsugIXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWS7AhNkZXZzX3JlZ2NhY2hlX2FsbG9jvAIUZGV2c19yZWdjYWNoZV9sb29rdXC9AhFkZXZzX3JlZ2NhY2hlX2FnZb4CF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlvwISZGV2c19yZWdjYWNoZV9uZXh0wAIPamRfc2V0dGluZ3NfZ2V0wQIPamRfc2V0dGluZ3Nfc2V0wgIOZGV2c19sb2dfdmFsdWXDAg9kZXZzX3Nob3dfdmFsdWXEAhBkZXZzX3Nob3dfdmFsdWUwxQINY29uc3VtZV9jaHVua8YCDXNoYV8yNTZfY2xvc2XHAg9qZF9zaGEyNTZfc2V0dXDIAhBqZF9zaGEyNTZfdXBkYXRlyQIQamRfc2hhMjU2X2ZpbmlzaMoCFGpkX3NoYTI1Nl9obWFjX3NldHVwywIVamRfc2hhMjU2X2htYWNfZmluaXNozAIOamRfc2hhMjU2X2hrZGbNAg5kZXZzX3N0cmZvcm1hdM4CDmRldnNfaXNfc3RyaW5nzwIOZGV2c19pc19udW1iZXLQAhRkZXZzX3N0cmluZ19nZXRfdXRmONECE2RldnNfYnVpbHRpbl9zdHJpbmfSAhRkZXZzX3N0cmluZ192c3ByaW50ZtMCE2RldnNfc3RyaW5nX3NwcmludGbUAhVkZXZzX3N0cmluZ19mcm9tX3V0ZjjVAhRkZXZzX3ZhbHVlX3RvX3N0cmluZ9YCEGJ1ZmZlcl90b19zdHJpbmfXAhlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxk2AISZGV2c19zdHJpbmdfY29uY2F02QIRZGV2c19zdHJpbmdfc2xpY2XaAhJkZXZzX3B1c2hfdHJ5ZnJhbWXbAhFkZXZzX3BvcF90cnlmcmFtZdwCD2RldnNfZHVtcF9zdGFja90CE2RldnNfZHVtcF9leGNlcHRpb27eAgpkZXZzX3Rocm933wISZGV2c19wcm9jZXNzX3Rocm934AIQZGV2c19hbGxvY19lcnJvcuECFWRldnNfdGhyb3dfdHlwZV9lcnJvcuICFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LjAh5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LkAhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcuUCHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dOYCGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcucCF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y6AIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY+kCD3RzYWdnX2NsaWVudF9lduoCCmFkZF9zZXJpZXPrAg10c2FnZ19wcm9jZXNz7AIKbG9nX3Nlcmllc+0CE3RzYWdnX2hhbmRsZV9wYWNrZXTuAhRsb29rdXBfb3JfYWRkX3Nlcmllc+8CCnRzYWdnX2luaXTwAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl8QITZGV2c192YWx1ZV9mcm9tX2ludPICFGRldnNfdmFsdWVfZnJvbV9ib29s8wIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXL0AhRkZXZzX3ZhbHVlX3RvX2RvdWJsZfUCEWRldnNfdmFsdWVfdG9faW509gISZGV2c192YWx1ZV90b19ib29s9wIOZGV2c19pc19idWZmZXL4AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZfkCEGRldnNfYnVmZmVyX2RhdGH6AhNkZXZzX2J1ZmZlcmlzaF9kYXRh+wIUZGV2c192YWx1ZV90b19nY19vYmr8Ag1kZXZzX2lzX2FycmF5/QIRZGV2c192YWx1ZV90eXBlb2b+Ag9kZXZzX2lzX251bGxpc2j/AhlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVkgAMUZGV2c192YWx1ZV9hcHByb3hfZXGBAxJkZXZzX3ZhbHVlX2llZWVfZXGCAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGODAxJkZXZzX2ltZ19zdHJpZHhfb2uEAxJkZXZzX2R1bXBfdmVyc2lvbnOFAwtkZXZzX3ZlcmlmeYYDEWRldnNfZmV0Y2hfb3Bjb2RlhwMOZGV2c192bV9yZXN1bWWIAxFkZXZzX3ZtX3NldF9kZWJ1Z4kDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOKAxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSLAw9kZXZzX3ZtX3N1c3BlbmSMAxZkZXZzX3ZtX3NldF9icmVha3BvaW50jQMUZGV2c192bV9leGVjX29wY29kZXOOAxpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeI8DEWRldnNfaW1nX2dldF91dGY4kAMUZGV2c19nZXRfc3RhdGljX3V0ZjiRAw9kZXZzX3ZtX3JvbGVfb2uSAxRkZXZzX3ZhbHVlX2J1ZmZlcmlzaJMDDGV4cHJfaW52YWxpZJQDFGV4cHJ4X2J1aWx0aW5fb2JqZWN0lQMLc3RtdDFfY2FsbDCWAwtzdG10Ml9jYWxsMZcDC3N0bXQzX2NhbGwymAMLc3RtdDRfY2FsbDOZAwtzdG10NV9jYWxsNJoDC3N0bXQ2X2NhbGw1mwMLc3RtdDdfY2FsbDacAwtzdG10OF9jYWxsN50DC3N0bXQ5X2NhbGw4ngMSc3RtdDJfaW5kZXhfZGVsZXRlnwMMc3RtdDFfcmV0dXJuoAMJc3RtdHhfam1woQMMc3RtdHgxX2ptcF96ogMKZXhwcjJfYmluZKMDEmV4cHJ4X29iamVjdF9maWVsZKQDEnN0bXR4MV9zdG9yZV9sb2NhbKUDE3N0bXR4MV9zdG9yZV9nbG9iYWymAxJzdG10NF9zdG9yZV9idWZmZXKnAwlleHByMF9pbmaoAxBleHByeF9sb2FkX2xvY2FsqQMRZXhwcnhfbG9hZF9nbG9iYWyqAwtleHByMV91cGx1c6sDC2V4cHIyX2luZGV4rAMPc3RtdDNfaW5kZXhfc2V0rQMUZXhwcngxX2J1aWx0aW5fZmllbGSuAxJleHByeDFfYXNjaWlfZmllbGSvAxFleHByeDFfdXRmOF9maWVsZLADEGV4cHJ4X21hdGhfZmllbGSxAw5leHByeF9kc19maWVsZLIDD3N0bXQwX2FsbG9jX21hcLMDEXN0bXQxX2FsbG9jX2FycmF5tAMSc3RtdDFfYWxsb2NfYnVmZmVytQMRZXhwcnhfc3RhdGljX3JvbGW2AxNleHByeF9zdGF0aWNfYnVmZmVytwMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nuAMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7kDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7oDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrsDDWV4cHJ4X2xpdGVyYWy8AxFleHByeF9saXRlcmFsX2Y2NL0DEGV4cHJ4X3JvbGVfcHJvdG++AxFleHByM19sb2FkX2J1ZmZlcr8DDWV4cHIwX3JldF92YWzAAwxleHByMV90eXBlb2bBAw9leHByMF91bmRlZmluZWTCAxJleHByMV9pc191bmRlZmluZWTDAwpleHByMF90cnVlxAMLZXhwcjBfZmFsc2XFAw1leHByMV90b19ib29sxgMJZXhwcjBfbmFuxwMJZXhwcjFfYWJzyAMNZXhwcjFfYml0X25vdMkDDGV4cHIxX2lzX25hbsoDCWV4cHIxX25lZ8sDCWV4cHIxX25vdMwDDGV4cHIxX3RvX2ludM0DCWV4cHIyX2FkZM4DCWV4cHIyX3N1Ys8DCWV4cHIyX211bNADCWV4cHIyX2RpdtEDDWV4cHIyX2JpdF9hbmTSAwxleHByMl9iaXRfb3LTAw1leHByMl9iaXRfeG9y1AMQZXhwcjJfc2hpZnRfbGVmdNUDEWV4cHIyX3NoaWZ0X3JpZ2h01gMaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTXAwhleHByMl9lcdgDCGV4cHIyX2xl2QMIZXhwcjJfbHTaAwhleHByMl9uZdsDFXN0bXQxX3Rlcm1pbmF0ZV9maWJlctwDFHN0bXR4Ml9zdG9yZV9jbG9zdXJl3QMTZXhwcngxX2xvYWRfY2xvc3VyZd4DEmV4cHJ4X21ha2VfY2xvc3VyZd8DEGV4cHIxX3R5cGVvZl9zdHLgAwxleHByMF9ub3dfbXPhAxZleHByMV9nZXRfZmliZXJfaGFuZGxl4gMQc3RtdDJfY2FsbF9hcnJheeMDCXN0bXR4X3RyeeQDDXN0bXR4X2VuZF90cnnlAwtzdG10MF9jYXRjaOYDDXN0bXQwX2ZpbmFsbHnnAwtzdG10MV90aHJvd+gDDnN0bXQxX3JlX3Rocm936QMQc3RtdHgxX3Rocm93X2ptcOoDDnN0bXQwX2RlYnVnZ2Vy6wMJZXhwcjFfbmV37AMRZXhwcjJfaW5zdGFuY2Vfb2btAwpleHByMF9udWxs7gMPZXhwcjJfYXBwcm94X2Vx7wMPZXhwcjJfYXBwcm94X25l8AMPZGV2c192bV9wb3BfYXJn8QMTZGV2c192bV9wb3BfYXJnX3UzMvIDE2RldnNfdm1fcG9wX2FyZ19pMzLzAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy9AMSamRfYWVzX2NjbV9lbmNyeXB09QMSamRfYWVzX2NjbV9kZWNyeXB09gMMQUVTX2luaXRfY3R49wMPQUVTX0VDQl9lbmNyeXB0+AMQamRfYWVzX3NldHVwX2tlefkDDmpkX2Flc19lbmNyeXB0+gMQamRfYWVzX2NsZWFyX2tlefsDC2pkX3dzc2tfbmV3/AMUamRfd3Nza19zZW5kX21lc3NhZ2X9AxNqZF93ZWJzb2NrX29uX2V2ZW50/gMHZGVjcnlwdP8DDWpkX3dzc2tfY2xvc2WABBBqZF93c3NrX29uX2V2ZW50gQQKc2VuZF9lbXB0eYIEEndzc2toZWFsdGhfcHJvY2Vzc4MEF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlhAQUd3Nza2hlYWx0aF9yZWNvbm5lY3SFBBh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSGBA9zZXRfY29ubl9zdHJpbmeHBBFjbGVhcl9jb25uX3N0cmluZ4gED3dzc2toZWFsdGhfaW5pdIkEE3dzc2tfcHVibGlzaF92YWx1ZXOKBBB3c3NrX3B1Ymxpc2hfYmluiwQRd3Nza19pc19jb25uZWN0ZWSMBBN3c3NrX3Jlc3BvbmRfbWV0aG9kjQQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZY4EFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWPBA9yb2xlbWdyX3Byb2Nlc3OQBBByb2xlbWdyX2F1dG9iaW5kkQQVcm9sZW1ncl9oYW5kbGVfcGFja2V0kgQUamRfcm9sZV9tYW5hZ2VyX2luaXSTBBhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSUBA1qZF9yb2xlX2FsbG9jlQQQamRfcm9sZV9mcmVlX2FsbJYEFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmSXBBJqZF9yb2xlX2J5X3NlcnZpY2WYBBNqZF9jbGllbnRfbG9nX2V2ZW50mQQTamRfY2xpZW50X3N1YnNjcmliZZoEFGpkX2NsaWVudF9lbWl0X2V2ZW50mwQUcm9sZW1ncl9yb2xlX2NoYW5nZWScBBBqZF9kZXZpY2VfbG9va3VwnQQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlngQTamRfc2VydmljZV9zZW5kX2NtZJ8EEWpkX2NsaWVudF9wcm9jZXNzoAQOamRfZGV2aWNlX2ZyZWWhBBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldKIED2pkX2RldmljZV9hbGxvY6MED2pkX2N0cmxfcHJvY2Vzc6QEFWpkX2N0cmxfaGFuZGxlX3BhY2tldKUEDGpkX2N0cmxfaW5pdKYEFGRjZmdfc2V0X3VzZXJfY29uZmlnpwQJZGNmZ19pbml0qAQNZGNmZ192YWxpZGF0ZakEDmRjZmdfZ2V0X2VudHJ5qgQMZGNmZ19nZXRfaTMyqwQMZGNmZ19nZXRfdTMyrAQPZGNmZ19nZXRfc3RyaW5nrQQMZGNmZ19pZHhfa2V5rgQTamRfc2V0dGluZ3NfZ2V0X2Jpbq8EDWpkX2ZzdG9yX2luaXSwBBNqZF9zZXR0aW5nc19zZXRfYmlusQQLamRfZnN0b3JfZ2OyBA9yZWNvbXB1dGVfY2FjaGWzBBVqZF9zZXR0aW5nc19nZXRfbGFyZ2W0BBZqZF9zZXR0aW5nc19wcmVwX2xhcmdltQQXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2W2BBZqZF9zZXR0aW5nc19zeW5jX2xhcmdltwQNamRfaXBpcGVfb3BlbrgEFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXS5BA5qZF9pcGlwZV9jbG9zZboEEmpkX251bWZtdF9pc192YWxpZLsEFWpkX251bWZtdF93cml0ZV9mbG9hdLwEE2pkX251bWZtdF93cml0ZV9pMzK9BBJqZF9udW1mbXRfcmVhZF9pMzK+BBRqZF9udW1mbXRfcmVhZF9mbG9hdL8EEWpkX29waXBlX29wZW5fY21kwAQUamRfb3BpcGVfb3Blbl9yZXBvcnTBBBZqZF9vcGlwZV9oYW5kbGVfcGFja2V0wgQRamRfb3BpcGVfd3JpdGVfZXjDBBBqZF9vcGlwZV9wcm9jZXNzxAQUamRfb3BpcGVfY2hlY2tfc3BhY2XFBA5qZF9vcGlwZV93cml0ZcYEDmpkX29waXBlX2Nsb3NlxwQNamRfcXVldWVfcHVzaMgEDmpkX3F1ZXVlX2Zyb250yQQOamRfcXVldWVfc2hpZnTKBA5qZF9xdWV1ZV9hbGxvY8sEDWpkX3Jlc3BvbmRfdTjMBA5qZF9yZXNwb25kX3UxNs0EDmpkX3Jlc3BvbmRfdTMyzgQRamRfcmVzcG9uZF9zdHJpbmfPBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZNAEC2pkX3NlbmRfcGt00QQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzSBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlctMEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTUBBRqZF9hcHBfaGFuZGxlX3BhY2tldNUEFWpkX2FwcF9oYW5kbGVfY29tbWFuZNYEFWFwcF9nZXRfaW5zdGFuY2VfbmFtZdcEE2pkX2FsbG9jYXRlX3NlcnZpY2XYBBBqZF9zZXJ2aWNlc19pbml02QQOamRfcmVmcmVzaF9ub3faBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk2wQUamRfc2VydmljZXNfYW5ub3VuY2XcBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZd0EEGpkX3NlcnZpY2VzX3RpY2veBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmffBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZeAEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXhBBRhcHBfZ2V0X2RldmljZV9jbGFzc+IEEmFwcF9nZXRfZndfdmVyc2lvbuMEDWpkX3NydmNmZ19ydW7kBBdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZeUEEWpkX3NydmNmZ192YXJpYW505gQNamRfaGFzaF9mbnYxYecEDGpkX2RldmljZV9pZOgECWpkX3JhbmRvbekECGpkX2NyYzE26gQOamRfY29tcHV0ZV9jcmPrBA5qZF9zaGlmdF9mcmFtZewEDGpkX3dvcmRfbW92Ze0EDmpkX3Jlc2V0X2ZyYW1l7gQQamRfcHVzaF9pbl9mcmFtZe8EDWpkX3BhbmljX2NvcmXwBBNqZF9zaG91bGRfc2FtcGxlX21z8QQQamRfc2hvdWxkX3NhbXBsZfIECWpkX3RvX2hlePMEC2pkX2Zyb21faGV49AQOamRfYXNzZXJ0X2ZhaWz1BAdqZF9hdG9p9gQLamRfdnNwcmludGb3BA9qZF9wcmludF9kb3VibGX4BApqZF9zcHJpbnRm+QQSamRfZGV2aWNlX3Nob3J0X2lk+gQMamRfc3ByaW50Zl9h+wQLamRfdG9faGV4X2H8BBRqZF9kZXZpY2Vfc2hvcnRfaWRfYf0ECWpkX3N0cmR1cP4ECWpkX21lbWR1cP8EFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWABRZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlgQURamRfc2VuZF9ldmVudF9leHSCBQpqZF9yeF9pbml0gwUUamRfcnhfZnJhbWVfcmVjZWl2ZWSEBR1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4UFD2pkX3J4X2dldF9mcmFtZYYFE2pkX3J4X3JlbGVhc2VfZnJhbWWHBRFqZF9zZW5kX2ZyYW1lX3Jhd4gFDWpkX3NlbmRfZnJhbWWJBQpqZF90eF9pbml0igUHamRfc2VuZIsFFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOMBQ9qZF90eF9nZXRfZnJhbWWNBRBqZF90eF9mcmFtZV9zZW50jgULamRfdHhfZmx1c2iPBRBfX2Vycm5vX2xvY2F0aW9ukAUMX19mcGNsYXNzaWZ5kQUFZHVtbXmSBQhfX21lbWNweZMFB21lbW1vdmWUBQZtZW1zZXSVBQpfX2xvY2tmaWxllgUMX191bmxvY2tmaWxllwUGZmZsdXNomAUEZm1vZJkFDV9fRE9VQkxFX0JJVFOaBQxfX3N0ZGlvX3NlZWubBQ1fX3N0ZGlvX3dyaXRlnAUNX19zdGRpb19jbG9zZZ0FCF9fdG9yZWFkngUJX190b3dyaXRlnwUJX19md3JpdGV4oAUGZndyaXRloQUUX19wdGhyZWFkX211dGV4X2xvY2uiBRZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrowUGX19sb2NrpAUIX191bmxvY2ulBQ5fX21hdGhfZGl2emVyb6YFCmZwX2JhcnJpZXKnBQ5fX21hdGhfaW52YWxpZKgFA2xvZ6kFBXRvcDE2qgUFbG9nMTCrBQdfX2xzZWVrrAUGbWVtY21wrQUKX19vZmxfbG9ja64FDF9fb2ZsX3VubG9ja68FDF9fbWF0aF94Zmxvd7AFDGZwX2JhcnJpZXIuMbEFDF9fbWF0aF9vZmxvd7IFDF9fbWF0aF91Zmxvd7MFBGZhYnO0BQNwb3e1BQV0b3AxMrYFCnplcm9pbmZuYW63BQhjaGVja2ludLgFDGZwX2JhcnJpZXIuMrkFCmxvZ19pbmxpbmW6BQpleHBfaW5saW5luwULc3BlY2lhbGNhc2W8BQ1mcF9mb3JjZV9ldmFsvQUFcm91bmS+BQZzdHJjaHK/BQtfX3N0cmNocm51bMAFBnN0cmNtcMEFBnN0cmxlbsIFB19fdWZsb3fDBQdfX3NobGltxAUIX19zaGdldGPFBQdpc3NwYWNlxgUGc2NhbGJuxwUJY29weXNpZ25syAUHc2NhbGJubMkFDV9fZnBjbGFzc2lmeWzKBQVmbW9kbMsFBWZhYnNszAULX19mbG9hdHNjYW7NBQhoZXhmbG9hdM4FCGRlY2Zsb2F0zwUHc2NhbmV4cNAFBnN0cnRveNEFBnN0cnRvZNIFEl9fd2FzaV9zeXNjYWxsX3JldNMFCGRsbWFsbG9j1AUGZGxmcmVl1QUYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl1gUEc2Jya9cFCF9fYWRkdGYz2AUJX19hc2hsdGkz2QUHX19sZXRmMtoFB19fZ2V0ZjLbBQhfX2RpdnRmM9wFDV9fZXh0ZW5kZGZ0ZjLdBQ1fX2V4dGVuZHNmdGYy3gULX19mbG9hdHNpdGbfBQ1fX2Zsb2F0dW5zaXRm4AUNX19mZV9nZXRyb3VuZOEFEl9fZmVfcmFpc2VfaW5leGFjdOIFCV9fbHNocnRpM+MFCF9fbXVsdGYz5AUIX19tdWx0aTPlBQlfX3Bvd2lkZjLmBQhfX3N1YnRmM+cFDF9fdHJ1bmN0ZmRmMugFC3NldFRlbXBSZXQw6QULZ2V0VGVtcFJldDDqBQlzdGFja1NhdmXrBQxzdGFja1Jlc3RvcmXsBQpzdGFja0FsbG9j7QUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudO4FFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdO8FGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXwBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl8QUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k8gUMZHluQ2FsbF9qaWpp8wUWbGVnYWxzdHViJGR5bkNhbGxfamlqafQFGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfIFBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
function em_console_debug(ptr) { const s = UTF8ToString(ptr, 1024); if (Module.dmesg) Module.dmesg(s); else console.debug(s); }




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
  "em_console_debug": em_console_debug,
  "em_deploy_handler": em_deploy_handler,
  "em_flash_load": em_flash_load,
  "em_flash_save": em_flash_save,
  "em_jd_crypto_get_random": em_jd_crypto_get_random,
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
var _jd_em_devs_enable_logging = Module["_jd_em_devs_enable_logging"] = createExportWrapper("jd_em_devs_enable_logging");

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

var ___start_em_js = Module['___start_em_js'] = 27008;
var ___stop_em_js = Module['___stop_em_js'] = 28061;



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
