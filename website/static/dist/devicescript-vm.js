
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABsoKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2ABfAF8YAV/fn5+fgBgBX9/f39/AGAFf39/f38Bf2ACf38BfGABfgF/YAN/fn8BfmAAAX5gAn98AGABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBfmACf3wBfGACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8Cu4WAgAAVA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52EWVtX2RlcGxveV9oYW5kbGVyAAADZW52F2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAAIDZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABsDZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAUDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAFFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQdmZF9zZWVrAA0DvoWAgAC8BQcIAQAHBwcAAAcEAAgHBxwIAAACAwIABwcCBAMDAwAAEQcRBwcDBgcCBwcDCQUFBQUHAAgFFh0MDQUCBgMGAAACAgACBgAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMAAAYAAwICAgADAwMDBQAAAAIBAAUABQUDAgICAgMEAwMDBQIIAAMBAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAEAAAEBAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAwAAgIAAQEBAAEAAAEAAAwAAQIAAQIDBAUBAgAAAgAACAkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAw4SAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAB4fAwQFAgYGBgEBBgYBAwICAQAGDAYBBgYBBAYCAAICBQASAgIGDgMDAwMFBQMDAwQFAQMAAwMEAgADAgUABAUFAwYBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQECBAQBDA0CAgAABwkDAQMHAQAACAACBgAHBQMICQQEAAACBwADBwcEAQIBAA8DCQcAAAQAAgcFBwUHBwMFCAUAAAQgAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBwcHBwQHBwcICAMRCAMABAEACQEDAwEDBgQJIQkXAwMPBAMFAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIhAFBAQEBQkEBAAAFAoKChMKEAUIByMKFBQKGBMPDwokJSYnCgMDAwQEFwQEGQsVKAspBhYqKwYOBAQACAQLFRoaCxIsAgIICBULCxkLLQAICAAECAcICAguDS8Eh4CAgAABcAHHAccBBYaAgIAAAQGAAoACBs+AgIAADH8BQZDgBQt/AUEAC38BQQALfwFBAAt/AEHIywELfwBBxMwBC38AQcDNAQt/AEGQzgELfwBBsc4BC38AQbbQAQt/AEHIywELfwBBrNEBCwfphYCAACIGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFQZtYWxsb2MArwUQX19lcnJub19sb2NhdGlvbgDrBBlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQCwBRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgAqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACsKamRfZW1faW5pdAAsDWpkX2VtX3Byb2Nlc3MALRRqZF9lbV9mcmFtZV9yZWNlaXZlZAAvEWpkX2VtX2RldnNfZGVwbG95ADARamRfZW1fZGV2c192ZXJpZnkAMRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMxlqZF9lbV9kZXZzX2VuYWJsZV9sb2dnaW5nADQWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMEHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBRpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMGFF9fZW1fanNfX2VtX3RpbWVfbm93AwcgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DCBlfX2VtX2pzX19lbV9jb25zb2xlX2RlYnVnAwkGZmZsdXNoAPMEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADKBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAMsFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAzAUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAM0FCXN0YWNrU2F2ZQDGBQxzdGFja1Jlc3RvcmUAxwUKc3RhY2tBbGxvYwDIBRxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AMkFDV9fc3RhcnRfZW1fanMDCgxfX3N0b3BfZW1fanMDCwxkeW5DYWxsX2ppamkAzwUJgoOAgAABAEEBC8YBKTtCQ0RFV1hmW11vcHVnbtoB/AGBApsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+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IABB4ABqIANB/wFxQX9qIgNBA3QQ7wQaIAAgAyACEIABIgJFDQAgACgCrAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCJAiIEQc+GA0sNACABKACkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFBtB8gA0EIahDTAgwBCyAAIAEgASgCoAEgBEH//wNxEIQCIAApAwBCAFINACADQdgAaiABQQggASABQQIQ+gEQkAEQ4AIgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI4BIANB0ABqQfsAEMACIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCZAiABKAKgASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQggIgAyAAKQMANwMQIAEgA0EQahCPAQsgA0HwAGokAAu/AQECfyMAQSBrIgMkACADIAIpAwA3AwgCQAJAAkAgASADQQhqIANBGGogA0EUahCJAiIEQX9KDQAgAyACKQMANwMAIAAgAUEcIAMQ0gIMAQsCQCAEQdCGA0gNACAEQbD5fGoiAUEALwGwxwFODQIgAEHg3wAgAUEDdGovAQAQwAIMAQsgACABKACkASIBIAEoAiBqIARBBHRqLwEMNgIAIABBBDYCBAsgA0EgaiQADwtByhNB9jhBOEH6KxDOBAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEOECmxCeAgsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARDhApwQngILIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ4QIQmQUQngILIAFBEGokAAu6AQMCfwF+AXwjAEEgayIBJAAgASAAQdgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ3gILIAAoAqwBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEOECIgREAAAAAAAAAABjRQ0AIAAgBJoQngIMAQsgACgCrAEgASkDGDcDIAsgAUEgaiQACxUAIAAQwgS4RAAAAAAAAPA9ohCeAgtkAQV/AkACQCAAQQAQnAIiAUEBSw0AQQEhAgwBC0EBIQMDQCADQQF0QQFyIgQhAiAEIQMgBCABSQ0ACwsgAiECA0AgBBDCBCACcSIEIAQgAUsiAxsiBSEEIAMNAAsgACAFEJ8CCxEAIAAgAEEAEJ0CEIQFEJ4CCxgAIAAgAEEAEJ0CIABBARCdAhCQBRCeAgsuAQN/IABBABCcAiEBQQAhAgJAIABBARCcAiIDRQ0AIAEgA20hAgsgACACEJ8CCy4BA38gAEEAEJwCIQFBACECAkAgAEEBEJwCIgNFDQAgASADbyECCyAAIAIQnwILFgAgACAAQQAQnAIgAEEBEJwCbBCfAgsJACAAQQEQwgEL8AICBH8CfCMAQTBrIgIkACACIABB2ABqKQMANwMoIAIgAEHgAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ4gIhAyACIAIpAyA3AxAgACACQRBqEOICIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCrAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahDhAiEGIAIgAikDIDcDACAAIAIQ4QIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKsAUEAKQOQZzcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqwBIAEpAwA3AyAgAkEwaiQACwkAIABBABDCAQuEAQIDfwF+IwBBIGsiASQAIAEgAEHYAGopAwA3AxggASAAQeAAaikDACIENwMQAkAgBFANACABIAEpAxg3AwggACABQQhqEI0CIQIgASABKQMQNwMAIAAgARCRAiIDRQ0AIAJFDQAgACACIAMQ+wELIAAoAqwBIAEpAxg3AyAgAUEgaiQACwkAIABBARDGAQuaAQIDfwF+IwBBMGsiAiQAIAIgAEHYAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQkQIiA0UNACAAQQAQkgEiBEUNACACQSBqIABBCCAEEOACIAIgAikDIDcDECAAIAJBEGoQjgEgACADIAQgARD/ASACIAIpAyA3AwggACACQQhqEI8BIAAoAqwBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQxgEL4wECA38BfiMAQcAAayIBJAAgASAAQdgAaikDACIENwM4IAEgAEHgAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ6AIiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDSAgwBCyABIAEpAzA3AxgCQCAAIAFBGGoQkQIiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqENICDAELIAIgAzYCBCAAKAKsASABKQM4NwMgCyABQcAAaiQAC78BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDSAkEAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCABIAIvARIQ/AJFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBIGokAAuwAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ0gJBACECCwJAAkAgAiICDQAgAEIANwMADAELIAMgAkEIakEIENUENgIAIAAgAUGCFSADEMICCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJB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IAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABBjzQgAhDQAiAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQTWohAwsgAEGYAmogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNQIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCFAiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEH3GyABQRBqENMCQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEHqGyABQQhqENMCQQAhAwsCQCADIgNFDQAgACADENsBIAAgASgCJCADLwECQf8fcUGAwAByEOkBCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEIUCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQfcbIANBCGoQ0wJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCFAiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUH3GyADQQhqENMCQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQhQIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFB9xsgA0EIahDTAkEAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDeAgsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQhQIiAiED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AwAMDgsgAEKJgIGAwAA3AwAMDQsgAEKEgIGAwAA3AwAMDAsgAEKBgIGAwAA3AwAMCwsCQCACQaB/aiIEQSBLDQAgAyAENgIQIAAgAUH2PiADQRBqEMICDAsLAkAgAkGACEkNACADIAI2AiAgACABQdA9IANBIGoQwgIMCwtBpzpB/ABBzCUQyQQACyADIAIoAgA2AjAgACABQdw9IANBMGoQwgIMCQsgAigCACECIAMgASgCpAE2AkwgAyADQcwAaiACEHw2AkAgACABQYc+IANBwABqEMICDAgLIAMgASgCpAE2AlwgAyADQdwAaiAEQQR2Qf//A3EQfDYCUCAAIAFBlj4gA0HQAGoQwgIMBwsgAyABKAKkATYCZCADIANB5ABqIARBBHZB//8DcRB8NgJgIAAgAUGvPiADQeAAahDCAgwGCwJAAkAgAigCACIEDQBBACEFDAELIAQtAANBD3EhBQsCQAJAAkACQAJAAkAgBUF9ag4JAAQCBQEFBAMEBQsgAEKPgIGAwAA3AwAMCgsgAEKcgIGAwAA3AwAMCQsgAyACKQMANwNoIAAgASADQegAahDFAgwICyAELwESIQIgAyABKAKkATYChAEgA0GEAWogAhB9IQIgBC8BECEFIAMgBCgCHC8BBDYCeCADIAU2AnQgAyACNgJwIAAgAUHaPiADQfAAahDCAgwHCyAAQqaAgYDAADcDAAwGC0GnOkGgAUHMJRDJBAALIAIoAgBBgIABTw0FIAMgAikDADcDiAEgACABIANBiAFqEMUCDAQLIAIoAgAhAiADIAEoAqQBNgKcASADIANBnAFqIAIQfTYCkAEgACABQaQ+IANBkAFqEMICDAMLIAMgAikDADcDuAEgASADQbgBaiADQcABahCFAiECIAMgASgCpAE2ArQBIANBtAFqIAMoAsABEH0hBCACLwEAIQIgAyABKAKkATYCsAEgAyADQbABaiACQQAQ+gI2AqQBIAMgBDYCoAEgACABQfk9IANBoAFqEMICDAILQac6Qa8BQcwlEMkEAAsgAyACKQMANwMIIANBwAFqIAEgA0EIahDhAkEHENEEIAMgA0HAAWo2AgAgACABQeoYIAMQwgILIANBgAJqJAAPC0H+zQBBpzpBowFBzCUQzgQAC3oBAn8jAEEgayIDJAAgAyACKQMANwMQAkAgASADQRBq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FyACEC4LIAJBwABqJAALggUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQAgASEBA0AgACABIgEoAgAiAjYCJCABKAIMECAgARAgIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDbAiECCyACIgJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhASACQQAoAujZASIAIAJBxABqKAIAIgMgACADa0EASBsiADYCFCACQShqIgMgAisDGCAAIAFruKIgAysDAKA5AwACQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQ2wIhAgsgAiICRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDbAiECCyACIgJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUHQ5gAQsARB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgC6NkBIAFqNgIcCwu6AgEFfyACQQFqIQMgAUGVxgAgARshBAJAAkAgACgCJCIBDQAgASEFDAELIAEhBgNAAkAgBiIBKAIMIgZFDQAgBiAEIAMQiAUNACABIQUMAgsgASgCACIBIQYgASEFIAENAAsLIAUiBiEBAkAgBg0AQcgAEB8iAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUHAAGpBACgC6NkBIgU2AgAgASgCECIHIQYCQCAHDQACQAJAIAAtABJFDQAgAEEoaiEGAkAgACgCKEUNACAGIQYMAgsgBkGIJzYCACAGIQYMAQsgAEEMaiEGCyAGKAIAIQYLIAFBxABqIAYgBWo2AgAgAUGQMRDZAiABIAMQHyIGNgIMIAYgBCACEO4EGiABIQELIAELOwEBf0EAQeDmABC1BCIBNgLA1gEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQdsAIAEQgQQLwwICAX4EfwJAAkACQAJAIAEQ7AQOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIgiKciAyACpyIEcg0AIABCgICAgHA3AwAPCwJAIANBFHZB/w9xIgVB/wdJDQACQAJAIAVBkwhLDQAgBA0CAkAgBUGTCEYNACADQf//P3EgBUGNeGp0DQMLIANB//8/cUGAgMAAckGTCCAFa3YhAwwBCwJAIAVBnghJDQAgBA0CIANBgICAj3xHDQIgAEKAgICAeDcDAA8LIAQgBUHtd2oiBnQNASADQf//P3FBgIDAAHIgBnQgBEGzCCAFa3ZyIQMLIABBfzYCBCAAQQAgAyIDayADIAJCAFMbNgIADwsgACABOQMACxAAIAAgATYCACAAQX82AgQLDwAgAELAAEIBIAEbNwMAC1oAAkAgAw0AIABCADcDAA8LAkACQCACQQhxRQ0AIAEgAxCZAUUNASAAIAM2AgAgACACNgIEDwtB0dEAQek6QdoAQZMaEM4EAAtB7c8AQek6QdsAQZMaEM4EAAuRAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAIAMNAAJAAkACQAJAAkAgASgCACIBQUBqDgQABAECAwtEAAAAAAAA8D8hBAwFC0QAAAAAAADwfyEEDAQLRAAAAAAAAPD/IQQMAwtEAAAAAAAAAAAhBCABQQJJDQILRAAAAAAAAPh/IQQMAQsgAiABKQMANwMQAkAgACACQRBqEL0CRQ0AIAIgASkDADcDCCAAIAJBCGogAkEcahC/AiIBIAJBGGoQrQUhBCABIAIoAhhHDQELRAAAAAAAAPh/IQQLIAJBIGokACAEC9YBAgF/AXwjAEEQayICJAACQAJAAkACQCABKAIEQQFqDgIAAQILIAEoAgAhAQwCCyABKAIAQT9LIQEMAQsgAiABKQMANwMIQQAhASAAIAJBCGoQ4QIiA71C////////////AINCgICAgICAgPj/AFYNAAJAAkAgA51EAAAAAAAA8EEQ9AQiA0QAAAAAAADwQaAgAyADRAAAAAAAAAAAYxsiA0QAAAAAAADwQWMgA0QAAAAAAAAAAGZxRQ0AIAOrIQEMAQtBACEBCyABIQELIAJBEGokACABC7ABAQF/IwBBIGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAQQBHIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDEAJAIAAgAkEQahC9AkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQvwIaIAIoAhxBAEchAQwBCwJAIAFBBmovAQBB8P8BcQ0AQQEhAQwBCyABKwMARAAAAAAAAAAAYSEBCyACQSBqJAAgAQthAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRtBfGoOBQECAgIAAgtBACECIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAoRg8LIAEoAgBBgIABSSECCyACC2wBAn9BACECAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDQXxqDgUBAgICAAILQQAhAiABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYhAgwBCyABKAIAQYCAAUkhAgsgA0EERyACcQvEAQECfwJAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIEQXxqDgUBAwMDAAMLIAEoAgAiA0UNAiADKAIAQYCAgPgAcUGAgIAoRiEDDAELIAEoAgBBgIABSSEDCyADRQ0AAkACQAJAIARBfGoOBQIBAQEAAQsgASgCACEBAkAgAkUNACACIAEvAQQ2AgALIAFBDGoPC0HpOkHPAUGaPRDJBAALIAAgASgCACACEPsCDwtBms4AQek6QcEBQZo9EM4EAAvdAQECfyMAQSBrIgMkAAJAAkACQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQXxqDgUBAwMDAAMLIAEoAgAiBEUNAiAEKAIAQYCAgPgAcUGAgIAoRiEEDAELIAEoAgBBgIABSSEECyAERQ0AIAMgASkDADcDGCAAIANBGGogAhDmAiEBDAELIAMgASkDADcDEAJAIAAgA0EQahC9AkUNACADIAEpAwA3AwggACADQQhqIAIQvwIhAQwBCwJAIAINAEEAIQEMAQsgAkEANgIAQQAhAQsgA0EgaiQAIAELIwBBACABKAIAQQAgASgCBCIBQQ9xQQhGGyABQYCAwP8HcRsLUgEBfwJAIAEoAgQiAkGAgMD/B3FFDQBBAA8LAkAgAkEPcUEIRg0AQQAPC0EAIQICQCABKAIAIgFFDQAgASgCAEGAgID4AHFBgICAGEYhAgsgAguJAwEDfyMAQRBrIgIkAAJAAkACQCABKAIEIgNBf0cNAEEBIQQMAQtBASEEAkACQAJAAkACQAJAAkACQAJAQRAgA0EPcSABQQZqLwEAQfD/AXEbDhEAAQYCBAIFBwMCAgcHBwcHCQcLIAEoAgAiASEEAkACQAJAAkAgAQ4DDAECAAsgAUFAag4EAAIBAQILQQYhBAwKC0EBIQQMCQtBAiEEIAFBoH9qQSFJDQhBCyEEIAFB/wdLDQhB6TpBhAJBxSYQyQQAC0EHIQQMBwtBCCEEDAYLAkACQCABKAIAIgENAEF9IQEMAQsgAS0AA0EPcUF9aiEBCyABIgFBCUkNBAwGC0EEQQkgASgCAEGAgAFJGyEEDAQLIAIgASkDADcDCEEIQQIgACACQQhqQQAQhQIvAQJBgCBJGyEEDAMLQQUhBAwCC0HpOkGsAkHFJhDJBAALQd8DIAFB//8DcXZBAXFFDQEgAUECdEGg5wBqKAIAIQQLIAJBEGokACAEDwtB6TpBnwJBxSYQyQQACxEAIAAoAgRFIAAoAgBBA0lxC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqEL0CDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqEL0CRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahC/AiECIAMgAykDMDcDCCAAIANBCGogA0E4ahC/AiEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAEIgFRSEBCyABIQELIAEhBAsgA0HAAGokACAEC1cAAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0G8P0HpOkHdAkHyNBDOBAALQeQ/Qek6Qd4CQfI0EM4EAAuMAQEBf0EAIQICQCABQf//A0sNAEGEASECAkACQAJAAkACQAJAIAFBDnYOBAMFAAECCyAAKAIAQcQAaiECQQEhAAwDCyAAKAIAQcwAaiECQQMhAAwCC0HMNkE5QfciEMkEAAsgACgCAEHUAGohAkEDIQALIAIoAgAgAHYhAgsgAUH//wBxIAJJIQILIAILaQECfyMAQSBrIgEkACAAKAAIIQAQvwQhAiABQRhqIABB//8DcTYCACABQRBqIABBGHY2AgAgAUEUaiAAQRB2Qf8BcTYCACABQQA2AgwgAUIFNwIEIAEgAjYCAEHwMyABEC4gAUEgaiQAC9seAgt/AX4jAEGQBGsiAiQAAkACQAJAIABBA3ENAAJAIAFB6ABNDQAgAiAANgKIBAJAAkAgACgCAEHEytmbBUcNACAAKAIEQYr8qdN5Rg0BCyACQugHNwPwA0H8CSACQfADahAuQZh4IQEMBAsCQCAAQQpqLwEAQRB0QYCAgChGDQBBySRBABAuIAAoAAghABC/BCEBIAJB0ANqQRhqIABB//8DcTYCACACQdADakEQaiAAQRh2NgIAIAJB5ANqIABBEHZB/wFxNgIAIAJBADYC3AMgAkIFNwLUAyACIAE2AtADQfAzIAJB0ANqEC4gAkKaCDcDwANB/AkgAkHAA2oQLkHmdyEBDAQLQQAhAyAAQSBqIQRBACEFA0AgBSEFIAMhBgJAAkACQCAEIgQoAgAiAyABTQ0AQekHIQVBl3ghAwwBCwJAIAQoAgQiByADaiABTQ0AQeoHIQVBlnghAwwBCwJAIANBA3FFDQBB6wchBUGVeCEDDAELAkAgB0EDcUUNAEHsByEFQZR4IQMMAQsgBUUNASAEQXhqIgdBBGooAgAgBygCAGogA0YNAUHyByEFQY54IQMLIAIgBTYCsAMgAiAEIABrNgK0A0H8CSACQbADahAuIAYhByADIQgMBAsgBUEHSyIHIQMgBEEIaiEEIAVBAWoiBiEFIAchByAGQQlHDQAMAwsAC0HIzgBBzDZBxwBBpAgQzgQAC0HPygBBzDZBxgBBpAgQzgQACyAIIQUCQCAHQQFxDQAgBSEBDAELAkAgAEE0ai0AAEEHcUUNACACQvOHgICABjcDoANB/AkgAkGgA2oQLkGNeCEBDAELIAAgACgCMGoiBCAEIAAoAjRqIgNJIQcCQAJAIAQgA0kNACAHIQMgBSEHDAELIAchBiAFIQggBCEJA0AgCCEFIAYhAwJAAkAgCSIGKQMAIg1C/////29YDQBBCyEEIAUhBQwBCwJAAkAgDUL///////////8Ag0KAgICAgICA+P8AWA0AQZMIIQVB7XchBwwBCyACQYAEaiANvxDdAkEAIQQgBSEFIAIpA4AEIA1RDQFBlAghBUHsdyEHCyACQTA2ApQDIAIgBTYCkANB/AkgAkGQA2oQLkEBIQQgByEFCyADIQMgBSIFIQcCQCAEDgwAAgICAgICAgICAgACCyAGQQhqIgMgACAAKAIwaiAAKAI0akkiBCEGIAUhCCADIQkgBCEDIAUhByAEDQALCyAHIQUCQCADQQFxRQ0AIAUhAQwBCwJAIABBJGooAgBBgOowSQ0AIAJCo4iAgIAGNwOAA0H8CSACQYADahAuQd13IQEMAQsgACAAKAIgaiIEIAQgACgCJGoiA0khBwJAAkACQCAEIANJDQAgByEBQTAhBAwBCwJAAkACQCAELwEIIAQtAApPDQAgByEBQTAhBQwBCyAEQQpqIQMgBCEGIAAoAighCCAHIQcDQCAHIQogCCEIIAMhCwJAIAYiBCgCACIDIAFNDQAgAkHpBzYC0AEgAiAEIABrIgU2AtQBQfwJIAJB0AFqEC4gCiEBIAUhBEGXeCEFDAULAkAgBCgCBCIHIANqIgYgAU0NACACQeoHNgLgASACIAQgAGsiBTYC5AFB/AkgAkHgAWoQLiAKIQEgBSEEQZZ4IQUMBQsCQCADQQNxRQ0AIAJB6wc2AvACIAIgBCAAayIFNgL0AkH8CSACQfACahAuIAohASAFIQRBlXghBQwFCwJAIAdBA3FFDQAgAkHsBzYC4AIgAiAEIABrIgU2AuQCQfwJIAJB4AJqEC4gCiEBIAUhBEGUeCEFDAULAkACQCAAKAIoIgkgA0sNACADIAAoAiwgCWoiDE0NAQsgAkH9BzYC8AEgAiAEIABrIgU2AvQBQfwJIAJB8AFqEC4gCiEBIAUhBEGDeCEFDAULAkACQCAJIAZLDQAgBiAMTQ0BCyACQf0HNgKAAiACIAQgAGsiBTYChAJB/AkgAkGAAmoQLiAKIQEgBSEEQYN4IQUMBQsCQCADIAhGDQAgAkH8BzYC0AIgAiAEIABrIgU2AtQCQfwJIAJB0AJqEC4gCiEBIAUhBEGEeCEFDAULAkAgByAIaiIHQYCABEkNACACQZsINgLAAiACIAQgAGsiBTYCxAJB/AkgAkHAAmoQLiAKIQEgBSEEQeV3IQUMBQsgBC8BDCEDIAIgAigCiAQ2ArwCAkAgAkG8AmogAxDuAg0AIAJBnAg2ArACIAIgBCAAayIFNgK0AkH8CSACQbACahAuIAohASAFIQRB5HchBQwFCwJAIAQtAAsiA0EDcUECRw0AIAJBswg2ApACIAIgBCAAayIFNgKUAkH8CSACQZACahAuIAohASAFIQRBzXchBQwFCwJAIANBAXFFDQAgCy0AAA0AIAJBtAg2AqACIAIgBCAAayIFNgKkAkH8CSACQaACahAuIAohASAFIQRBzHchBQwFCyAEQRBqIgYgACAAKAIgaiAAKAIkakkiCUUNAiAEQRpqIgwhAyAGIQYgByEIIAkhByAEQRhqLwEAIAwtAABPDQALIAkhASAEIABrIQULIAIgBSIFNgLEASACQaYINgLAAUH8CSACQcABahAuIAEhASAFIQRB2nchBQwCCyAJIQEgBCAAayEECyAFIQULIAUhByAEIQgCQCABQQFxRQ0AIAchAQwBCwJAIABB3ABqKAIAIgEgACAAKAJYaiIEakF/ai0AAEUNACACIAg2ArQBIAJBowg2ArABQfwJIAJBsAFqEC5B3XchAQwBCwJAIABBzABqKAIAIgVBAEwNACAAIAAoAkhqIgMgBWohBiADIQUDQAJAIAUiBSgCACIDIAFJDQAgAiAINgKkASACQaQINgKgAUH8CSACQaABahAuQdx3IQEMAwsCQCAFKAIEIANqIgMgAUkNACACIAg2ApQBIAJBnQg2ApABQfwJIAJBkAFqEC5B43chAQwDCwJAIAQgA2otAAANACAFQQhqIgMhBSADIAZPDQIMAQsLIAIgCDYChAEgAkGeCDYCgAFB/AkgAkGAAWoQLkHidyEBDAELAkAgAEHUAGooAgAiBUEATA0AIAAgACgCUGoiAyAFaiEGIAMhBQNAAkAgBSIFKAIAIgMgAUkNACACIAg2AnQgAkGfCDYCcEH8CSACQfAAahAuQeF3IQEMAwsCQCAFKAIEIANqIAFPDQAgBUEIaiIDIQUgAyAGTw0CDAELCyACIAg2AmQgAkGgCDYCYEH8CSACQeAAahAuQeB3IQEMAQsCQAJAIAAgACgCQGoiASABIABBxABqKAIAakkiBQ0AIAUhDCAHIQEMAQsgBSEDIAchByABIQYDQCAHIQwgAyELIAYiCS8BACIDIQECQCAAKAJcIgYgA0sNACACIAg2AlQgAkGhCDYCUEH8CSACQdAAahAuIAshDEHfdyEBDAILAkADQAJAIAEiASADa0HIAUkiBw0AIAIgCDYCRCACQaIINgJAQfwJIAJBwABqEC5B3nchAQwCCwJAIAQgAWotAABFDQAgAUEBaiIFIQEgBSAGSQ0BCwsgDCEBCyABIQECQCAHRQ0AIAlBAmoiBSAAIAAoAkBqIAAoAkRqIglJIgwhAyABIQcgBSEGIAwhDCABIQEgBSAJTw0CDAELCyALIQwgASEBCyABIQECQCAMQQFxRQ0AIAEhAQwBCwJAAkAgACAAKAI4aiIFIAUgAEE8aigCAGpJIgQNACAEIQggASEFDAELIAQhBCABIQMgBSEHA0AgAyEFIAQhBgJAAkACQCAHIgEoAgBBHHZBf2pBAU0NAEGQCCEFQfB3IQMMAQsgAS8BBCEDIAIgAigCiAQ2AjxBASEEIAUhBSACQTxqIAMQ7gINAUGSCCEFQe53IQMLIAIgASAAazYCNCACIAU2AjBB/AkgAkEwahAuQQAhBCADIQULIAUhBQJAIARFDQAgAUEIaiIBIAAgACgCOGogACgCPGoiBkkiCCEEIAUhAyABIQcgCCEIIAUhBSABIAZPDQIMAQsLIAYhCCAFIQULIAUhAQJAIAhBAXFFDQAgASEBDAELAkAgAC8BDg0AQQAhAQwBCyAAIAAoAmBqIQcgASEEQQAhBQNAIAQhAwJAAkACQCAHIAUiBUEEdGoiAUEQaiAAIAAoAmBqIAAoAmQiBGpJDQBBsgghBEHOdyEDDAELAkACQAJAIAUOAgABAgsCQCABKAIEQfP///8BRg0AQacIIQRB2XchAwwDCyAFQQFHDQELIAEoAgRB8v///wFGDQBBqAghBEHYdyEDDAELAkAgAS8BCkECdCIGIARJDQBBqQghBEHXdyEDDAELAkAgAS8BCEEDdCAGaiAETQ0AQaoIIQRB1nchAwwBCyABLwEAIQQgAiACKAKIBDYCLAJAIAJBLGogBBDuAg0AQasIIQRB1XchAwwBCwJAIAEtAAJBDnFFDQBBrAghBEHUdyEDDAELAkACQCABLwEIRQ0AIAcgBmohDCADIQZBACEIDAELQQEhBCADIQMMAgsDQCAGIQkgDCAIIghBA3RqIgQvAQAhAyACIAIoAogENgIoIAQgAGshBgJAAkAgAkEoaiADEO4CDQAgAiAGNgIkIAJBrQg2AiBB/AkgAkEgahAuQQAhBEHTdyEDDAELAkACQCAELQAEQQFxDQAgCSEGDAELAkACQAJAIAQvAQZBAnQiBEEEaiAAKAJkSQ0AQa4IIQNB0nchCgwBCyAHIARqIgMhBAJAIAMgACAAKAJgaiAAKAJkak8NAANAAkAgBCIELwEAIgMNAAJAIAQtAAJFDQBBrwghA0HRdyEKDAQLQa8IIQNB0XchCiAELQADDQNBASELIAkhBAwECyACIAIoAogENgIcAkAgAkEcaiADEO4CDQBBsAghA0HQdyEKDAMLIARBBGoiAyEEIAMgACAAKAJgaiAAKAJkakkNAAsLQbEIIQNBz3chCgsgAiAGNgIUIAIgAzYCEEH8CSACQRBqEC5BACELIAohBAsgBCIDIQZBACEEIAMhAyALRQ0BC0EBIQQgBiEDCyADIQMCQCAEIgRFDQAgAyEGIAhBAWoiCSEIIAQhBCADIQMgCSABLwEITw0DDAELCyAEIQQgAyEDDAELIAIgASAAazYCBCACIAQ2AgBB/AkgAhAuQQAhBCADIQMLIAMhAQJAIARFDQAgASEEIAVBAWoiAyEFQQAhASADIAAvAQ5PDQIMAQsLIAEhAQsgAkGQBGokACABC14BAn8jAEEQayICJAACQAJAIAAvAQQiAyAALwEGTw0AIAEoAqQBIQEgACADQQFqOwEEIAEgA2otAAAhAAwBCyACQQhqIAFB5AAQhQFBACEACyACQRBqJAAgAEH/AXELJQACQCAALQBGDQBBfw8LIABBADoARiAAIAAtAAZBEHI6AAZBAAssACAAIAE6AEcCQCABDQAgAC0ARkUNACAAQQA6AEYgACAALQAGQRByOgAGCws+ACAAKALkARAgIABBggJqQgA3AQAgAEH8AWpCADcCACAAQfQBakIANwIAIABB7AFqQgA3AgAgAEIANwLkAQuyAgEEfwJAIAENAEEADwsCQCABQYCABE8NAAJAIAAvAegBIgINACACQQBHDwsgACgC5AEhA0EAIQQCQANAAkAgAyAEIgRBAnRqIgUvAQAgAUcNACAFIAVBBGogAiAEQX9zakECdBDvBBogAC8B6AEiAkECdCAAKALkASIDakF8akEAOwEAIABBggJqQgA3AQAgAEH6AWpCADcBACAAQfIBakIANwEAIABCADcB6gECQCACDQBBAQ8LQQAhBANAAkAgAyAEIgRBAnRqLwEAIgVFDQAgACAFQR9xakHqAWoiBS0AAA0AIAUgBEEBajoAAAsgBEEBaiIFIQRBASEBIAUgAkcNAAwDCwALIARBAWoiBSEEIAUgAkcNAAtBACEBCyABDwtBkTVBkzlB1ABB6A4QzgQAC+QCAQd/AkAgAC0AR0UNAAJAIAAtAAdBAnFFDQAgACgC5AEhAiAALwHoASIDIQRBACEFAkAgA0UNAEEAIQZBACEDA0AgAyEDAkACQCACIAYiBkECdGoiBy0AAkEBcUUNACADIQMMAQsgAiADQQJ0aiAHKAEANgEAIANBAWohAwsgAC8B6AEiByEEIAMiAyEFIAZBAWoiCCEGIAMhAyAIIAdJDQALCyACIAUiA0ECdGpBACAEIANrQQJ0EPAEGiAAQYICakIANwEAIABB+gFqQgA3AQAgAEHyAWpCADcBACAAQgA3AeoBIAAvAegBIgdFDQAgACgC5AEhCEEAIQMDQAJAIAggAyIDQQJ0ai8BACIGRQ0AIAAgBkEfcWpB6gFqIgYtAAANACAGIANBAWo6AAALIANBAWoiBiEDIAYgB0cNAAsLIABBADoAByAAQQA2AuABIAAtAEYNACAAIAE6AEYgABBjCwvPBAEKfwJAIAFBgIAETw0AAkAgAQ0AQX4PCwJAAkACQCAALwHoASIDRQ0AIANBAnQgACgC5AEiBGpBfGovAQANACAEIQQgAyEDDAELQX8hBSADQe8BSw0BIANBAXQiA0HoASADQegBSRtBCGoiA0ECdBAfIAAoAuQBIAAvAegBQQJ0EO4EIQQgACgC5AEQICAAIAM7AegBIAAgBDYC5AEgBCEEIAMhAwsgBCEGIAMiB0EBIAdBAUsbIQhBACEDQQAhBAJAA0AgBCEEAkACQAJAIAYgAyIFQQJ0aiIDLwEAIglFDQAgCSABc0EfcSEKAkACQCAEQQFxRQ0AIAoNAQsCQCAKRQ0AQQEhC0EAIQwgCkUhCgwEC0EBIQtBACEMQQEhCiAJIAFJDQMLAkAgCSABRw0AIAMtAAIgAkcNAEEAIQtBASEMDAILIANBBGogAyAHIAVBf3NqQQJ0EO8EGgsgAyABOwEAIAMgAjoAAkEAIQtBBCEMCyAEIQoLIAohBCAMIQMgC0UNASAFQQFqIgUhAyAEIQQgBSAIRw0AC0EEIQMLQQAhBSADQQRHDQAgAEIANwHqASAAQYICakIANwEAIABB+gFqQgA3AQAgAEHyAWpCADcBAAJAIAAvAegBIgENAEEBDwsgACgC5AEhCUEAIQMDQAJAIAkgAyIDQQJ0ai8BACIERQ0AIAAgBEEfcWpB6gFqIgQtAAANACAEIANBAWo6AAALIANBAWoiBCEDQQEhBSAEIAFHDQALCyAFDwtBkTVBkzlB/ABB0Q4QzgQAC6IHAgt/AX4jAEEQayIBJAACQCAAKAKoASICRQ0AIAIhAkGAgAghAwJAA0AgAiECIANBf2oiBEUNASAALQBGDQICQAJAIAAtAEdFDQACQCAALQBIRQ0AIABBADoASAwBCyAAIAIvAQQiBUEfcWpB6gFqLQAAIgNFDQAgACgC5AEiBiADQX9qIgNBAnRqLwEAIgchCCADIQMgBSAHSQ0AA0AgAyEDAkAgBSAIQf//A3FHDQACQCAGIANBAnRqLQACQQFxRQ0AIAAoAuABIAJHDQEgAEEIEPYCDAQLIABBARD2AgwDCyAGIANBAWoiA0ECdGovAQAiByEIIAMhAyAFIAdPDQALCwJAAkAgAi8BBCIDIAIvAQZPDQAgACgCpAEhBSACIANBAWo7AQQgBSADai0AACEDDAELIAFBCGogAEHkABCFAUEAIQMLIAMiA0H/AXEhBgJAIAPAQX9KDQAgASAGQfB+ahDeAgJAIAAtAEIiAkEKSQ0AIAFBCGogAEHlABCFAQwCCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB0ABqIAw3AwAMAQsCQCAGQdoASQ0AIAFBCGogAEHmABCFAQwBCwJAIAZB4OsAai0AACIJQSBxRQ0AIAAgAi8BBCIDQX9qOwFAAkACQCADIAIvAQZPDQAgACgCpAEhBSACIANBAWo7AQQgBSADai0AACEDDAELIAFBCGogAEHkABCFAUEAIQMLAkACQCADQf8BcSIKQfgBTw0AIAohAwwBCyAKQQNxIQtBACEFQQAhCANAIAghCCAFIQMCQAJAIAIvAQQiBSACLwEGTw0AIAAoAqQBIQcgAiAFQQFqOwEEIAcgBWotAAAhBwwBCyABQQhqIABB5AAQhQFBACEHCyADQQFqIQUgCEEIdCAHQf8BcXIiByEIIAMgC0cNAAtBACAHayAHIApBBHEbIQMLIAAgAzYCTAsgACAALQBCOgBDAkACQCAJQRBxRQ0AIAIgAEHAxwEgBkECdGooAgARAgAgAC0AQkUNASABQQhqIABB5wAQhQEMAQsgASACIABBwMcBIAZBAnRqKAIAEQEAAkAgAC0AQiICQQpJDQAgAUEIaiAAQeUAEIUBDAELIAEpAwAhDCAAIAJBAWo6AEIgACACQQN0akHQAGogDDcDAAsgAC0ARUUNACAAEM0CCyAAKAKoASIFIQIgBCEDIAUNAAwCCwALIABB4dQDEIQBCyABQRBqJAALJAEBf0EAIQECQCAAQYMBSw0AIABBAnRB0OcAaigCACEBCyABC8sCAQN/IwBBEGsiAyQAIAMgACgCADYCDAJAAkACQCADQQxqIAEQ7gINACACDQFBACEBDAILIAFB//8AcSEEAkACQAJAAkACQCABQQ52QQNxDgQBAgMAAQtBACEBIAAoAgAiBSAFKAJIaiAEQQN0aiEEDAMLQQAhASAAKAIAIgUgBSgCUGogBEEDdGohBAwCCyAEQQJ0QdDnAGooAgAhAUEAIQQMAQsgACgCACIBIAEoAlhqIAEgASgCQGogBEEBdGovAQBqIQFBACEECyABIQUCQCAEIgFFDQACQCACRQ0AIAIgASgCBDYCAAsgACgCACIAIAAoAlhqIAEoAgBqIQEMAgsCQCAFRQ0AAkAgAg0AIAUhAQwDCyACIAUQnQU2AgAgBSEBDAILQZM5Qa4CQafGABDJBAALIAJBADYCAEEAIQELIANBEGokACABC0sBAX8jAEEQayIDJAAgAyAAKAKkATYCBCADQQRqIAEgAhD6AiIBIQICQCABDQAgA0EIaiAAQegAEIUBQavVACECCyADQRBqJAAgAgs8AQF/IwBBEGsiAiQAAkAgACgApAFBPGooAgBBA3YgAUsiAQ0AIAJBCGogAEH5ABCFAQsgAkEQaiQAIAELUAEBfyMAQRBrIgQkACAEIAEoAqQBNgIMAkACQCAEQQxqIAJBDnQgA3IiARDuAg0AIABCADcDAAwBCyAAIAE2AgAgAEEENgIECyAEQRBqJAALDAAgACACQfIAEIUBCw4AIAAgAiACKAJMEKUCCzMAAkAgAS0AQkEBRg0AQaHHAEHHN0HNAEHCwgAQzgQACyABQQA6AEIgASgCrAFBABB3GgszAAJAIAEtAEJBAkYNAEGhxwBBxzdBzQBBwsIAEM4EAAsgAUEAOgBCIAEoAqwBQQEQdxoLMwACQCABLQBCQQNGDQBBoccAQcc3Qc0AQcLCABDOBAALIAFBADoAQiABKAKsAUECEHcaCzMAAkAgAS0AQkEERg0AQaHHAEHHN0HNAEHCwgAQzgQACyABQQA6AEIgASgCrAFBAxB3GgszAAJAIAEtAEJBBUYNAEGhxwBBxzdBzQBBwsIAEM4EAAsgAUEAOgBCIAEoAqwBQQQQdxoLMwACQCABLQBCQQZGDQBBoccAQcc3Qc0AQcLCABDOBAALIAFBADoAQiABKAKsAUEFEHcaCzMAAkAgAS0AQkEHRg0AQaHHAEHHN0HNAEHCwgAQzgQACyABQQA6AEIgASgCrAFBBhB3GgszAAJAIAEtAEJBCEYNAEGhxwBBxzdBzQBBwsIAEM4EAAsgAUEAOgBCIAEoAqwBQQcQdxoLMwACQCABLQBCQQlGDQBBoccAQcc3Qc0AQcLCABDOBAALIAFBADoAQiABKAKsAUEIEHcaC/YBAgN/AX4jAEHQAGsiAiQAIAJByABqIAEQ2AMgAkHAAGogARDYAyABKAKsAUEAKQOIZzcDICABIAIpA0g3AzAgAiACKQNANwMwAkAgASACQTBqEI0CIgNFDQAgAiACKQNINwMoAkAgASACQShqEL0CIgQNACACIAIpA0g3AyAgAkE4aiABIAJBIGoQxAIgAiACKQM4IgU3A0ggAiAFNwMYIAEgAkEYahCOAQsgAiACKQNINwMQAkAgASADIAJBEGoQgwINACABKAKsAUEAKQOAZzcDIAsgBA0AIAIgAikDSDcDCCABIAJBCGoQjwELIAJB0ABqJAALXgECfyMAQRBrIgIkACABKAKsASEDIAJBCGogARDYAyADIAIpAwg3AyAgAyAAEHoCQCABLQBHRQ0AIAEoAuABIABHDQAgAS0AB0EIcUUNACABQQgQ9gILIAJBEGokAAtiAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQhQFBACEECwJAIAQiAUUNACAAIAE7AQQLIAJBEGokAAuFAQEEfyMAQSBrIgIkACACQRBqIAEQ2AMgAiACKQMQNwMIIAEgAkEIahDjAiEDAkACQCAAKAIQKAIAIAEoAkwgAS8BQGoiBEoNACAEIQUgBCAALwEGSA0BCyACQRhqIAFB6QAQhQFBACEFCwJAIAUiAUUgA3INACAAIAE7AQQLIAJBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhDYAyADQRBqIAIQ2AMgAyADKQMYNwMIIAMgAykDEDcDACAAIAIgA0EIaiADEIcCIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJMIQQgAyACKAKkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBDuAg0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQhQELIAJBARD6ASEEIAMgAykDEDcDACAAIAIgBCADEJQCIANBIGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARDYAwJAAkAgASgCTCIDIAAoAhAvAQhJDQAgAiABQe8AEIUBDAELIAAgA0EDdGpBGGogAikDCDcDAAsgAkEQaiQAC1YBAn8jAEEQayICJAAgAkEIaiABENgDAkACQCABKAJMIgMgASgCpAEvAQxJDQAgAiABQfEAEIUBDAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC2EBA38jAEEgayICJAAgAkEYaiABENgDIAEQ2QMhAyABENkDIQQgAkEQaiABQQEQ2wMCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBKCyACQSBqJAALDQAgAEEAKQOYZzcDAAs3AQF/AkAgAigCTCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIUBCzgBAX8CQCACKAJMIgMgAigCpAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIUBC3EBAX8jAEEgayIDJAAgA0EYaiACENgDIAMgAykDGDcDEAJAAkACQCADQRBqEL4CDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDhAhDdAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACENgDIANBEGogAhDYAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQmAIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABENgDIAJBIGogARDYAyACQRhqIAEQ2AMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCZAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDYAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQ7gINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIUBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQlgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDYAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQ7gINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIUBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQlgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDYAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQ7gINACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIUBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQlgILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ7gINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIUBCyACQQAQ+gEhBCADIAMpAxA3AwAgACACIAQgAxCUAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQ7gINACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIUBCyACQRUQ+gEhBCADIAMpAxA3AwAgACACIAQgAxCUAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEPoBEJABIgMNACABQRAQVQsgASgCrAEhBCACQQhqIAFBCCADEOACIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDZAyIDEJIBIgQNACABIANBA3RBEGoQVQsgASgCrAEhAyACQQhqIAFBCCAEEOACIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDZAyIDEJMBIgQNACABIANBDGoQVQsgASgCrAEhAyACQQhqIAFBCCAEEOACIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCFASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBDuAg0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhQELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEO4CDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCFAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQ7gINACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIUBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBDuAg0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhQELIANBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKAJMIgQgAigApAFBJGooAgBBBHZJDQAgA0EIaiACQfgAEIUBIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAJMEN4CC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQhQELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCFASAAQgA3AwAMAQsgACACQQggAiAEEIwCEOACCyADQRBqJAALXwEDfyMAQRBrIgMkACACENkDIQQgAhDZAyEFIANBCGogAkECENsDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBKCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDYAyADIAMpAwg3AwAgACACIAMQ6gIQ3gIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDYAyAAQYDnAEGI5wAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA4BnNwMACw0AIABBACkDiGc3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ2AMgAyADKQMINwMAIAAgAiADEOMCEN8CIANBEGokAAsNACAAQQApA5BnNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACENgDAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEOECIgREAAAAAAAAAABjRQ0AIAAgBJoQ3QIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkD+GY3AwAMAgsgAEEAIAJrEN4CDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhDaA0F/cxDeAgsyAQF/IwBBEGsiAyQAIANBCGogAhDYAyAAIAMo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IQogAiECQQEhDCADIQMMAQsCQAJAIAIgAUcNACADIQMMAQsgAkF/cyABaiENAkAgBSADayIOQQFIDQAgAyACIA0gDkF/aiAOIA1KGyIOEO4EIA5qQQA6AAALIAMgDWohAwsgAyENAkAgDA0AIAEhASALIQogAiECQQAhDCANIQMMAQsCQAJAIAEtAABBLUYNACABIQFBACECDAELIApBAmogASAKLQACQfMARiICGyEBIAIgCXEhAgsgAiECIAEiDiwAACEBIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQVtqDlQHCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgDCAgICAgICAgICAABCAUICAgICAgICAgECAgGCAIICAMICyAEIAsoAgA6AAAgC0EEaiECDAwLIAQhAgJAAkAgCygCACIBQX9MDQAgASEBIAIhAgwBCyAEQS06AABBACABayEBIAchAgsgC0EEaiELIAIiDCECIAEhAwNAIAIiAiADIgEgAUEKbiIDQQpsa0EwcjoAACACQQFqIgohAiADIQMgAUEJSw0ACyAKQQA6AAAgDCAMEJ0FakF/aiIDIQIgDCEBIAMgDE0NCgNAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCwsACyAEIQIgCygCACEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACALQQRqIQwgBiAEEJ0FaiIDIQIgBCEBIAMgBE0NCANAIAEiAS0AACEDIAEgAiICLQAAOgAAIAIgAzoAACACQX9qIgMhAiABQQFqIgohASAKIANJDQAMCQsACyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCQsgBEGw8AE7AQAgCygCACEMQQAhAkEcIQMDQCACIQICQAJAIAwgAyIBdkEPcSIDDQAgAUUNAEEA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Rg0AQQQhAyACDQFBAkEDIAFC////////////AINQGw8LIAFC/////////weDUCEDCyADCwQAIAALjgQBA38CQCACQYAESQ0AIAAgASACEBEgAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCADQXxqIgQgAE8NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL9wIBAn8CQCAAIAFGDQACQCABIAAgAmoiA2tBACACQQF0a0sNACAAIAEgAhDuBA8LIAEgAHNBA3EhBAJAAkACQCAAIAFPDQACQCAERQ0AIAAhAwwDCwJAIABBA3ENACAAIQMMAgsgACEDA0AgAkUNBCADIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiADQQFqIgNBA3FFDQIMAAsACwJAIAQNAAJAIANBA3FFDQADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMgASgCADYCACABQQRqIQEgA0EE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IAWnaiEDCyAAIAM2AmggACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQvwUgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABC/BSADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EL8FIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORC/BSADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQvwUgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAELUFRQ0AIAMgBBClBSEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBC/BSAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADELcFIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChC1BUEASg0AAkAgASAJIAMgChC1BUUNACABIQQMAgsgBUHwAGogASACQgBCABC/BSAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQvwUgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEL8FIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABC/BSAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQvwUgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EL8FIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkGMxwFqKAIAIQYgAkGAxwFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEKAFIQILIAIQoQUNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARCgBSECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEKAFIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAEIAiyQwAAgH+UELkFIARBCGopAwAhCyAEKQMAIQoMAgsCQAJAAkAgCQ0AQQAhCQNAIAJBIHIgCUG/IWosAABHDQECQCAJQQFLDQACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQoAUhAgsgCUEBaiIJQQNHDQAMAgsACwJAAkAgCQ4EAAEBAgELAkAgAkEwRw0AAkACQCABKAIEIgkgASgCaEYNACAFIAlBAWo2AgAgCS0AACEJDAELIAEQoAUhCQsCQCAJQV9xQdgARw0AIARBEGogASAHIAYgCCADEKkFIARBGGopAwAhCyAEKQMQIQoMBgsgASkDcEIAUw0AIAUgBSgCAEF/ajYCAAsgBEEgaiABIAIgByAGIAggAxCqBSAEQShqKQMAIQsgBCkDICEKDAQLQgAhCgJAIAEpA3BCAFMNACAFIAUoAgBBf2o2AgALEOsEQRw2AgAMAQsCQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARCgBSECCwJAAkAgAkEoRw0AQQEhCQwBC0IAIQpCgICAgICA4P//ACELIAEpA3BCAFMNAyAFIAUoAgBBf2o2AgAMAwsDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEKAFIQILIAJBv39qIQgCQAJAIAJBUGpBCkkNACAIQRpJDQAgAkGff2ohCCACQd8ARg0AIAhBGk8NAQsgCUEBaiEJDAELC0KAgICAgIDg//8AIQsgAkEpRg0CAkAgASkDcCIMQgBTDQAgBSAFKAIAQX9qNgIACwJAAkAgA0UNACAJDQFCACEKDAQLEOsEQRw2AgBCACEKDAELA0AgCUF/aiEJAkAgDEIAUw0AIAUgBSgCAEF/ajYCAAtCACEKIAkNAAwDCwALIAEgChCfBQtCACELCyAAIAo3AwAgACALNwMIIARBMGokAAvCDwIIfwd+IwBBsANrIgYkAAJAAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEKAFIQcLQQAhCEIAIQ5BACEJAkACQAJAA0ACQCAHQTBGDQAgB0EuRw0EIAEoAgQiByABKAJoRg0CIAEgB0EBajYCBCAHLQAAIQcMAwsCQCABKAIEIgcgASgCaEYNAEEBIQkgASAHQQFqNgIEIActAAAhBwwBC0EBIQkgARCgBSEHDAALAAsgARCgBSEHC0EBIQhCACEOIAdBMEcNAANAAkACQCABKAIEIgcgASgCaEYNACABIAdBAWo2AgQgBy0AACEHDAELIAEQoAUhBwsgDkJ/fCEOIAdBMEYNAAtBASEIQQEhCQtCgICAgICAwP8/IQ9BACEKQgAhEEIAIRFCACESQQAhC0IAIRMCQANAIAdBIHIhDAJAAkAgB0FQaiINQQpJDQACQCAMQZ9/akEGSQ0AIAdBLkcNBAsgB0EuRw0AIAgNA0EBIQggEyEODAELIAxBqX9qIA0gB0E5ShshBwJAAkAgE0IHVQ0AIAcgCkEEdGohCgwBCwJAIBNCHFYNACAGQTBqIAcQugUgBkEgaiASIA9CAEKAgICAgIDA/T8QvwUgBkEQaiAGKQMwIAZBMGpBCGopAwAgBikDICISIAZBIGpBCGopAwAiDxC/BSAGIAYpAxAgBkEQakEIaikDACAQIBEQswUgBkEIaikDACERIAYpAwAhEAwBCyAHRQ0AIAsNACAGQdAAaiASIA9CAEKAgICAgICA/z8QvwUgBkHAAGogBikDUCAGQdAAakEIaikDACAQIBEQswUgBkHAAGpBCGopAwAhEUEBIQsgBikDQCEQCyATQgF8IRNBASEJCwJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARCgBSEHDAALAAsCQAJAIAkNAAJAAkACQCABKQNwQgBTDQAgASABKAIEIgdBf2o2AgQgBUUNASABIAdBfmo2AgQgCEUNAiABIAdBfWo2AgQMAgsgBQ0BCyABQgAQnwULIAZB4ABqIAS3RAAAAAAAAAAAohC4BSAGQegAaikDACETIAYpA2AhEAwBCwJAIBNCB1UNACATIQ8DQCAKQQR0IQogD0IBfCIPQghSDQALCwJAAkACQAJAIAdBX3FB0ABHDQAgASAFEKsFIg9CgICAgICAgICAf1INAwJAIAVFDQAgASkDcEJ/VQ0CDAMLQgAhECABQgAQnwVCACETDAQLQgAhDyABKQNwQgBTDQILIAEgASgCBEF/ajYCBAtCACEPCwJAIAoNACAGQfAAaiAEt0QAAAAAAAAAAKIQuAUgBkH4AGopAwAhEyAGKQNwIRAMAQsCQCAOIBMgCBtCAoYgD3xCYHwiE0EAIANrrVcNABDrBEHEADYCACAGQaABaiAEELoFIAZBkAFqIAYpA6ABIAZBoAFqQQhqKQMAQn9C////////v///ABC/BSAGQYABaiAGKQOQASAGQZABakEIaikDAEJ/Qv///////7///wAQvwUgBkGAAWpBCGopAwAhEyAGKQOAASEQDAELAkAgEyADQZ5+aqxTDQACQCAKQX9MDQADQCAGQaADaiAQIBFCAEKAgICAgIDA/79/ELMFIBAgEUIAQoCAgICAgID/PxC2BSEHIAZBkANqIBAgESAGKQOgAyAQIAdBf0oiBxsgBkGgA2pBCGopAwAgESAHGxCzBSATQn98IRMgBkGQA2pBCGopAwAhESAGKQOQAyEQIApBAXQgB3IiCkF/Sg0ACwsCQAJAIBMgA6x9QiB8Ig6nIgdBACAHQQBKGyACIA4gAq1TGyIHQfEASA0AIAZBgANqIAQQugUgBkGIA2opAwAhDkIAIQ8gBikDgAMhEkIAIRQMAQsgBkHgAmpEAAAAAAAA8D9BkAEgB2sQogUQuAUgBkHQAmogBBC6BSAGQfACaiAGKQPgAiAGQeACakEIaikDACAGKQPQAiISIAZB0AJqQQhqKQMAIg4QowUgBkHwAmpBCGopAwAhFCAGKQPwAiEPCyAGQcACaiAKIAdBIEggECARQgBCABC1BUEAR3EgCkEBcUVxIgdqELsFIAZBsAJqIBIgDiAGKQPAAiAGQcACakEIaikDABC/BSAGQZACaiAGKQOwAiAGQbACakEIaikDACAPIBQQswUgBkGgAmogEiAOQgAgECAHG0IAIBEgBxsQvwUgBkGAAmogBikDoAIgBkGgAmpBCGopAwAgBikDkAIgBkGQAmpBCGopAwAQswUgBkHwAWogBikDgAIgBkGAAmpBCGopAwAgDyAUEMIFAkAgBikD8AEiECAGQfABakEIaikDACIRQgBCABC1BQ0AEOsEQcQANgIACyAGQeABaiAQIBEgE6cQpAUgBkHgAWpBCGopAwAhEyAGKQPgASEQDAELEOsEQcQANgIAIAZB0AFqIAQQugUgBkHAAWogBikD0AEgBkHQAWpBCGopAwBCAEKAgICAgIDAABC/BSAGQbABaiAGKQPAASAGQcABakEIaikDAEIAQoCAgICAgMAAEL8FIAZBsAFqQQhqKQMAIRMgBikDsAEhEAsgACAQNwMAIAAgEzcDCCAGQbADaiQAC/ofAwt/Bn4BfCMAQZDGAGsiByQAQQAhCEEAIARrIgkgA2shCkIAIRJBACELAkACQAJAA0ACQCACQTBGDQAgAkEuRw0EIAEoAgQiAiABKAJoRg0CIAEgAkEBajYCBCACLQAAIQIMAwsCQCABKAIEIgIgASgCaEYNAEEBIQsgASACQQFqNgIEIAItAAAhAgwBC0EBIQsgARCgBSECDAALAAsgARCgBSECC0EBIQhCACESIAJBMEcNAANAAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQoAUhAgsgEkJ/fCESIAJBMEYNAAtBASELQQEhCAtBACEMIAdBADYCkAYgAkFQaiENAkACQAJAAkACQAJAAkAgAkEuRiIODQBCACETIA1BCU0NAEEAIQ9BACEQDAELQgAhE0EAIRBBACEPQQAhDANAAkACQCAOQQFxRQ0AAkAgCA0AIBMhEkEBIQgMAgsgC0UhDgwECyATQgF8IRMCQCAPQfwPSg0AIAJBMEYhCyATpyERIAdBkAZqIA9BAnRqIQ4CQCAQRQ0AIAIgDigCAEEKbGpBUGohDQsgDCARIAsbIQwgDiANNgIAQQEhC0EAIBBBAWoiAiACQQlGIgIbIRAgDyACaiEPDAELIAJBMEYNACAHIAcoAoBGQQFyNgKARkHcjwEhDAsCQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARCgBSECCyACQVBqIQ0gAkEuRiIODQAgDUEKSQ0ACwsgEiATIAgbIRICQCALRQ0AIAJBX3FBxQBHDQACQCABIAYQqwUiFEKAgICAgICAgIB/Ug0AIAZFDQRCACEUIAEpA3BCAFMNACABIAEoAgRBf2o2AgQLIBQgEnwhEgwECyALRSEOIAJBAEgNAQsgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgDkUNARDrBEEcNgIAC0IAIRMgAUIAEJ8FQgAhEgwBCwJAIAcoApAGIgENACAHIAW3RAAAAAAAAAAAohC4BSAHQQhqKQMAIRIgBykDACETDAELAkAgE0IJVQ0AIBIgE1INAAJAIANBHkoNACABIAN2DQELIAdBMGogBRC6BSAHQSBqIAEQuwUgB0EQaiAHKQMwIAdBMGpBCGopAwAgBykDICAHQSBqQQhqKQMAEL8FIAdBEGpBCGopAwAhEiAHKQMQIRMMAQsCQCASIAlBAXatVw0AEOsEQcQANgIAIAdB4ABqIAUQugUgB0HQAGogBykDYCAHQeAAakEIaikDAEJ/Qv///////7///wAQvwUgB0HAAGogBykDUCAHQdAAakEIaikDAEJ/Qv///////7///wAQvwUgB0HAAGpBCGopAwAhEiAHKQNAIRMMAQsCQCASIARBnn5qrFkNABDrBEHEADYCACAHQZABaiAFELoFIAdBgAFqIAcpA5ABIAdBkAFqQQhqKQMAQgBCgICAgICAwAAQvwUgB0HwAGogBykDgAEgB0GAAWpBCGopAwBCAEKAgICAgIDAABC/BSAHQfAAakEIaikDACESIAcpA3AhEwwBCwJAIBBFDQACQCAQQQhKDQAgB0GQBmogD0ECdGoiAigCACEBA0AgAUEKbCEBIBBBAWoiEEEJRw0ACyACIAE2AgALIA9BAWohDwsgEqchCAJAIAxBCU4NACAMIAhKDQAgCEERSg0AAkAgCEEJRw0AIAdBwAFqIAUQugUgB0GwAWogBygCkAYQuwUgB0GgAWogBykDwAEgB0HAAWpBCGopAwAgBykDsAEgB0GwAWpBCGopAwAQvwUgB0GgAWpBCGopAwAhEiAHKQOgASETDAILAkAgCEEISg0AIAdBkAJqIAUQugUgB0GAAmogBygCkAYQuwUgB0HwAWogBykDkAIgB0GQAmpBCGopAwAgBykDgAIgB0GAAmpBCGopAwAQvwUgB0HgAWpBCCAIa0ECdEHgxgFqKAIAELoFIAdB0AFqIAcpA/ABIAdB8AFqQQhqKQMAIAcpA+ABIAdB4AFqQQhqKQMAELcFIAdB0AFqQQhqKQMAIRIgBykD0AEhEwwCCyAHKAKQBiEBAkAgAyAIQX1sakEbaiICQR5KDQAgASACdg0BCyAHQeACaiAFELoFIAdB0AJqIAEQuwUgB0HAAmogBykD4AIgB0HgAmpBCGopAwAgBykD0AIgB0HQAmpBCGopAwAQvwUgB0GwAmogCEECdEG4xgFqKAIAELoFIAdBoAJqIAcpA8ACIAdBwAJqQQhqKQMAIAcpA7ACIAdBsAJqQQhqKQMAEL8FIAdBoAJqQQhqKQMAIRIgBykDoAIhEwwBCwNAIAdBkAZqIA8iAkF/aiIPQQJ0aigCAEUNAAtBACEQAkACQCAIQQlvIgENAEEAIQ4MAQtBACEOIAFBCWogASAIQQBIGyEGAkACQCACDQBBACECDAELQYCU69wDQQggBmtBAnRB4MYBaigCACILbSERQQAhDUEAIQFBACEOA0AgB0GQBmogAUECdGoiDyAPKAIAIg8gC24iDCANaiINNgIAIA5BAWpB/w9xIA4gASAORiANRXEiDRshDiAIQXdqIAggDRshCCARIA8gDCALbGtsIQ0gAUEBaiIBIAJHDQALIA1FDQAgB0GQBmogAkECdGogDTYCACACQQFqIQILIAggBmtBCWohCAsDQCAHQZAGaiAOQQJ0aiEMAkADQAJAIAhBJEgNACAIQSRHDQIgDCgCAEHR6fkETw0CCyACQf8PaiEPQQAhDSACIQsDQCALIQICQAJAIAdBkAZqIA9B/w9xIgFBAnRqIgs1AgBCHYYgDa18IhJCgZTr3ANaDQBBACENDAELIBIgEkKAlOvcA4AiE0KAlOvcA359IRIgE6chDQsgCyASpyIPNgIAIAIgAiACIAEgDxsgASAORhsgASACQX9qQf8PcUcbIQsgAUF/aiEPIAEgDkcNAAsgEEFjaiEQIA1FDQALAkAgDkF/akH/D3EiDiALRw0AIAdBkAZqIAtB/g9qQf8PcUECdGoiASABKAIAIAdBkAZqIAtBf2pB/w9xIgJBAnRqKAIAcjYCAAsgCEEJaiEIIAdBkAZqIA5BAnRqIA02AgAMAQsLAkADQCACQQFqQf8PcSEJIAdBkAZqIAJBf2pB/w9xQQJ0aiEGA0BBCUEBIAhBLUobIQ8CQANAIA4hC0EAIQECQAJAA0AgASALakH/D3EiDiACRg0BIAdBkAZqIA5BAnRqKAIAIg4gAUECdEHQxgFqKAIAIg1JDQEgDiANSw0CIAFBAWoiAUEERw0ACwsgCEEkRw0AQgAhEkEAIQFCACETA0ACQCABIAtqQf8PcSIOIAJHDQAgAkEBakH/D3EiAkECdCAHQZAGampBfGpBADYCAAsgB0GABmogB0GQBmogDkECdGooAgAQuwUgB0HwBWogEiATQgBCgICAgOWat47AABC/BSAHQeAFaiAHKQPwBSAHQfAFakEIaikDACAHKQOABiAHQYAGakEIaikDABCzBSAHQeAFakEIaikDACETIAcpA+AFIRIgAUEBaiIBQQRHDQALIAdB0AVqIAUQugUgB0HABWogEiATIAcpA9AFIAdB0AVqQQhqKQMAEL8FIAdBwAVqQQhqKQMAIRNCACESIAcpA8AFIRQgEEHxAGoiDSAEayIBQQAgAUEAShsgAyABIANIIg8bIg5B8ABMDQJCACEVQgAhFkIAIRcMBQsgDyAQaiEQIAIhDiALIAJGDQALQYCU69wDIA92IQxBfyAPdEF/cyERQQAhASALIQ4DQCAHQZAGaiALQQJ0aiINIA0oAgAiDSAPdiABaiIBNgIAIA5BAWpB/w9xIA4gCyAORiABRXEiARshDiAIQXdqIAggARshCCANIBFxIAxsIQEgC0EBakH/D3EiCyACRw0ACyABRQ0BAkAgCSAORg0AIAdBkAZqIAJBAnRqIAE2AgAgCSECDAMLIAYgBigCAEEBcjYCAAwBCwsLIAdBkAVqRAAAAAAAAPA/QeEBIA5rEKIFELgFIAdBsAVqIAcpA5AFIAdBkAVqQQhqKQMAIBQgExCjBSAHQbAFakEIaikDACEXIAcpA7AFIRYgB0GABWpEAAAAAAAA8D9B8QAgDmsQogUQuAUgB0GgBWogFCATIAcpA4AFIAdBgAVqQQhqKQMAEKYFIAdB8ARqIBQgEyAHKQOgBSISIAdBoAVqQQhqKQMAIhUQwgUgB0HgBGogFiAXIAcpA/AEIAdB8ARqQQhqKQMAELMFIAdB4ARqQQhqKQMAIRMgBykD4AQhFAsCQCALQQRqQf8PcSIIIAJGDQACQAJAIAdBkAZqIAhBAnRqKAIAIghB/8m17gFLDQACQCAIDQAgC0EFakH/D3EgAkYNAgsgB0HwA2ogBbdEAAAAAAAA0D+iELgFIAdB4ANqIBIgFSAHKQPwAyAHQfADakEIaikDABCzBSAHQeADakEIaikDACEVIAcpA+ADIRIMAQsCQCAIQYDKte4BRg0AIAdB0ARqIAW3RAAAAAAAAOg/ohC4BSAHQcAEaiASIBUgBykD0AQgB0HQBGpBCGopAwAQswUgB0HABGpBCGopAwAhFSAHKQPABCESDAELIAW3IRgCQCALQQVqQf8PcSACRw0AIAdBkARqIBhEAAAAAAAA4D+iELgFIAdBgARqIBIgFSAHKQOQBCAHQZAEakEIaikDABCzBSAHQYAEakEIaikDACEVIAcpA4AEIRIMAQsgB0GwBGogGEQAAAAAAADoP6IQuAUgB0GgBGogEiAVIAcpA7AEIAdBsARqQQhqKQMAELMFIAdBoARqQQhqKQMAIRUgBykDoAQhEgsgDkHvAEoNACAHQdADaiASIBVCAEKAgICAgIDA/z8QpgUgBykD0AMgB0HQA2pBCGopAwBCAEIAELUFDQAgB0HAA2ogEiAVQgBCgICAgICAwP8/ELMFIAdBwANqQQhqKQMAIRUgBykDwAMhEgsgB0GwA2ogFCATIBIgFRCzBSAHQaADaiAHKQOwAyAHQbADakEIaikDACAWIBcQwgUgB0GgA2pBCGopAwAhEyAHKQOgAyEUAkAgDUH/////B3EgCkF+akwNACAHQZADaiAUIBMQpwUgB0GAA2ogFCATQgBCgICAgICAgP8/EL8FIAcpA5ADIAdBkANqQQhqKQMAQgBCgICAgICAgLjAABC2BSECIAdBgANqQQhqKQMAIBMgAkF/SiICGyETIAcpA4ADIBQgAhshFCASIBVCAEIAELUFIQ0CQCAQIAJqIhBB7gBqIApKDQAgDyAOIAFHcSAPIAIbIA1BAEdxRQ0BCxDrBEHEADYCAAsgB0HwAmogFCATIBAQpAUgB0HwAmpBCGopAwAhEiAHKQPwAiETCyAAIBI3AwggACATNwMAIAdBkMYAaiQAC8kEAgR/AX4CQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQMMAQsgABCgBSEDCwJAAkACQAJAAkAgA0FVag4DAAEAAQsCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABCgBSECCyADQS1GIQQgAkFGaiEFIAFFDQEgBUF1Sw0BIAApA3BCAFMNAiAAIAAoAgRBf2o2AgQMAgsgA0FGaiEFQQAhBCADIQILIAVBdkkNAEIAIQYCQCACQVBqIgVBCk8NAEEAIQMDQCACIANBCmxqIQMCQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABCgBSECCyADQVBqIQMCQCACQVBqIgVBCUsNACADQcyZs+YASA0BCwsgA6whBgsCQCAFQQpPDQADQCACrSAGQgp+fCEGAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQoAUhAgsgBkJQfCEGIAJBUGoiBUEJSw0BIAZCro+F18fC66MBUw0ACwsCQCAFQQpPDQADQAJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEKAFIQILIAJBUGpBCkkNAAsLAkAgACkDcEIAUw0AIAAgACgCBEF/ajYCBAtCACAGfSAGIAQbIQYMAQtCgICAgICAgICAfyEGIAApA3BCAFMNACAAIAAoAgRBf2o2AgRCgICAgICAgICAfw8LIAYLhgECAX8CfiMAQaABayIEJAAgBCABNgI8IAQgATYCFCAEQX82AhggBEEQakIAEJ8FIAQgBEEQaiADQQEQqAUgBEEIaikDACEFIAQpAwAhBgJAIAJFDQAgAiABIAQoAhQgBCgCiAFqIAQoAjxrajYCAAsgACAFNwMIIAAgBjcDACAEQaABaiQACzUCAX8BfCMAQRBrIgIkACACIAAgAUEBEKwFIAIpAwAgAkEIaikDABDDBSEDIAJBEGokACADCxYAAkAgAA0AQQAPCxDrBCAANgIAQX8LpSsBC38jAEEQayIBJAACQAJAAkACQAJAAkACQAJAAkACQCAAQfQBSw0AAkBBACgCnNwBIgJBECAAQQtqQXhxIABBC0kbIgNBA3YiBHYiAEEDcUUNAAJAAkAgAEF/c0EBcSAEaiIFQQN0IgRBxNwBaiIAIARBzNwBaigCACIEKAIIIgNHDQBBACACQX4gBXdxNgKc3AEMAQsgAyAANgIMIAAgAzYCCAsgBEEIaiEAIAQgBUEDdCIFQQNyNgIEIAQgBWoiBCAEKAIEQQFyNgIEDAoLIANBACgCpNwBIgZNDQECQCAARQ0AAkACQCAAIAR0QQIgBHQiAEEAIABrcnEiAEEAIABrcWgiBEEDdCIAQcTcAWoiBSAAQczcAWooAgAiACgCCCIHRw0AQQAgAkF+IAR3cSICNgKc3AEMAQsgByAFNgIMIAUgBzYCCAsgACADQQNyNgIEIAAgA2oiByAEQQN0IgQgA2siBUEBcjYCBCAAIARqIAU2AgACQCAGRQ0AIAZBeHFBxNwBaiEDQQAoArDcASEEAkACQCACQQEgBkEDdnQiCHENAEEAIAIgCHI2ApzcASADIQgMAQsgAygCCCEICyADIAQ2AgggCCAENgIMIAQgAzYCDCAEIAg2AggLIABBCGohAEEAIAc2ArDcAUEAIAU2AqTcAQwKC0EAKAKg3AEiCUUNASAJQQAgCWtxaEECdEHM3gFqKAIAIgcoAgRBeHEgA2shBCAHIQUCQANAAkAgBSgCECIADQAgBUEUaigCACIARQ0CCyAAKAIEQXhxIANrIgUgBCAFIARJIgUbIQQgACAHIAUbIQcgACEFDAALAAsgBygCGCEKAkAgBygCDCIIIAdGDQAgBygCCCIAQQAoAqzcAUkaIAAgCDYCDCAIIAA2AggMCQsCQCAHQRRqIgUoAgAiAA0AIAcoAhAiAEUNAyAHQRBqIQULA0AgBSELIAAiCEEUaiIFKAIAIgANACAIQRBqIQUgCCgCECIADQALIAtBADYCAAwIC0F/IQMgAEG/f0sNACAAQQtqIgBBeHEhA0EAKAKg3AEiBkUNAEEAIQsCQCADQYACSQ0AQR8hCyADQf///wdLDQAgA0EmIABBCHZnIgBrdkEBcSAAQQF0a0E+aiELC0EAIANrIQQCQAJAAkACQCALQQJ0QczeAWooAgAiBQ0AQQAhAEEAIQgMAQtBACEAIANBAEEZIAtBAXZrIAtBH0YbdCEHQQAhCANAAkAgBSgCBEF4cSADayICIARPDQAgAiEEIAUhCCACDQBBACEEIAUhCCAFIQAMAwsgACAFQRRqKAIAIgIgAiAFIAdBHXZBBHFqQRBqKAIAIgVGGyAAIAIbIQAgB0EBdCEHIAUNAAsLAkAgACAIcg0AQQAhCEECIAt0IgBBACAAa3IgBnEiAEUNAyAAQQAgAGtxaEECdEHM3gFqKAIAIQALIABFDQELA0AgACgCBEF4cSADayICIARJIQcCQCAAKAIQIgUNACAAQRRqKAIAIQULIAIgBCAHGyEEIAAgCCAHGyEIIAUhACAFDQALCyAIRQ0AIARBACgCpNwBIANrTw0AIAgoAhghCwJAIAgoAgwiByAIRg0AIAgoAggiAEEAKAKs3AFJGiAAIAc2AgwgByAANgIIDAcLAkAgCEEUaiIFKAIAIgANACAIKAIQIgBFDQMgCEEQaiEFCwNAIAUhAiAAIgdBFGoiBSgCACIADQAgB0EQaiEFIAcoAhAiAA0ACyACQQA2AgAMBgsCQEEAKAKk3AEiACADSQ0AQQAoArDcASEEAkACQCAAIANrIgVBEEkNACAEIANqIgcgBUEBcjYCBCAEIABqIAU2AgAgBCADQQNyNgIEDAELIAQgAEEDcjYCBCAEIABqIgAgACgCBEEBcjYCBEEAIQdBACEFC0EAIAU2AqTcAUEAIAc2ArDcASAEQQhqIQAMCAsCQEEAKAKo3AEiByADTQ0AQQAgByADayIENgKo3AFBAEEAKAK03AEiACADaiIFNgK03AEgBSAEQQFyNgIEIAAgA0EDcjYCBCAAQQhqIQAMCAsCQAJAQQAoAvTfAUUNAEEAKAL83wEhBAwBC0EAQn83AoDgAUEAQoCggICAgAQ3AvjfAUEAIAFBDGpBcHFB2KrVqgVzNgL03wFBAEEANgKI4AFBAEEANgLY3wFBgCAhBAtBACEAIAQgA0EvaiIGaiICQQAgBGsiC3EiCCADTQ0HQQAhAAJAQQAoAtTfASIERQ0AQQAoAszfASIFIAhqIgkgBU0NCCAJIARLDQgLAkACQEEALQDY3wFBBHENAAJAAkACQAJAAkBBACgCtNwBIgRFDQBB3N8BIQADQAJAIAAoAgAiBSAESw0AIAUgACgCBGogBEsNAwsgACgCCCIADQALC0EAELIFIgdBf0YNAyAIIQICQEEAKAL43wEiAEF/aiIEIAdxRQ0AIAggB2sgBCAHakEAIABrcWohAgsgAiADTQ0DAkBBACgC1N8BIgBFDQBBACgCzN8BIgQgAmoiBSAETQ0EIAUgAEsNBAsgAhCyBSIAIAdHDQEMBQsgAiAHayALcSICELIFIgcgACgCACAAKAIEakYNASAHIQALIABBf0YNAQJAIANBMGogAksNACAAIQcMBAsgBiACa0EAKAL83wEiBGpBACAEa3EiBBCyBUF/Rg0BIAQgAmohAiAAIQcMAwsgB0F/Rw0CC0EAQQAoAtjfAUEEcjYC2N8BCyAIELIFIQdBABCyBSEAIAdBf0YNBSAAQX9GDQUgByAATw0FIAAgB2siAiADQShqTQ0FC0EAQQAoAszfASACaiIANgLM3wECQCAAQQAoAtDfAU0NAEEAIAA2AtDfAQsCQAJAQQAoArTcASIERQ0AQdzfASEAA0AgByAAKAIAIgUgACgCBCIIakYNAiAAKAIIIgANAAwFCwALAkACQEEAKAKs3AEiAEUNACAHIABPDQELQQAgBzYCrNwBC0EAIQBBACACNgLg3wFBACAHNgLc3wFBAEF/NgK83AFBAEEAKAL03wE2AsDcAUEAQQA2AujfAQNAIABBA3QiBEHM3AFqIARBxNwBaiIFNgIAIARB0NwBaiAFNgIAIABBAWoiAEEgRw0AC0EAIAJBWGoiAEF4IAdrQQdxQQAgB0EIakEHcRsiBGsiBTYCqNwBQQAgByAEaiIENgK03AEgBCAFQQFyNgIEIAcgAGpBKDYCBEEAQQAoAoTgATYCuNwBDAQLIAAtAAxBCHENAiAEIAVJDQIgBCAHTw0CIAAgCCACajYCBEEAIARBeCAEa0EHcUEAIARBCGpBB3EbIgBqIgU2ArTcAUEAQQAoAqjcASACaiIHIABrIgA2AqjcASAFIABBAXI2AgQgBCAHakEoNgIEQQBBACgChOABNgK43AEMAwtBACEIDAULQQAhBwwDCwJAIAdBACgCrNwBIghPDQBBACAHNgKs3AEgByEICyAHIAJqIQVB3N8BIQACQAJAAkACQAJAAkACQANAIAAoAgAgBUYNASAAKAIIIgANAAwCCwALIAAtAAxBCHFFDQELQdzfASEAA0ACQCAAKAIAIgUgBEsNACAFIAAoAgRqIgUgBEsNAwsgACgCCCEADAALAAsgACAHNgIAIAAgACgCBCACajYCBCAHQXggB2tBB3FBACAHQQhqQQdxG2oiCyADQQNyNgIEIAVBeCAFa0EHcUEAIAVBCGpBB3EbaiICIAsgA2oiA2shAAJAIAIgBEcNAEEAIAM2ArTcAUEAQQAoAqjcASAAaiIANgKo3AEgAyAAQQFyNgIEDAMLAkAgAkEAKAKw3AFHDQBBACADNgKw3AFBAEEAKAKk3AEgAGoiADYCpNwBIAMgAEEBcjYCBCADIABqIAA2AgAMAwsCQCACKAIEIgRBA3FBAUcNACAEQXhxIQYCQAJAIARB/wFLDQAgAigCCCIFIARBA3YiCEEDdEHE3AFqIgdGGgJAIAIoAgwiBCAFRw0AQQBBACgCnNwBQX4gCHdxNgKc3AEMAgsgBCAHRhogBSAENgIMIAQgBTYCCAwBCyACKAIYIQkCQAJAIAIoAgwiByACRg0AIAIoAggiBCAISRogBCAHNgIMIAcgBDYCCAwBCwJAIAJBFGoiBCgCACIFDQAgAkEQaiIEKAIAIgUNAEEAIQcMAQsDQCAEIQggBSIHQRRqIgQoAgAiBQ0AIAdBEGohBCAHKAIQIgUNAAsgCEEANgIACyAJRQ0AAkACQCACIAIoAhwiBUECdEHM3gFqIgQoAgBHDQAgBCAHNgIAIAcNAUEAQQAoAqDcAUF+IAV3cTYCoNwBDAILIAlBEEEUIAkoAhAgAkYbaiAHNgIAIAdFDQELIAcgCTYCGAJAIAIoAhAiBEUNACAHIAQ2AhAgBCAHNgIYCyACKAIUIgRFDQAgB0EUaiAENgIAIAQgBzYCGAsgBiAAaiEAIAIgBmoiAigCBCEECyACIARBfnE2AgQgAyAAQQFyNgIEIAMgAGogADYCAAJAIABB/wFLDQAgAEF4cUHE3AFqIQQCQAJAQQAoApzcASIFQQEgAEEDdnQiAHENAEEAIAUgAHI2ApzcASAEIQAMAQsgBCgCCCEACyAEIAM2AgggACADNgIMIAMgBDYCDCADIAA2AggMAwtBHyEEAkAgAEH///8HSw0AIABBJiAAQQh2ZyIEa3ZBAXEgBEEBdGtBPmohBAsgAyAENgIcIANCADcCECAEQQJ0QczeAWohBQJAAkBBACgCoNwBIgdBASAEdCIIcQ0AQQAgByAIcjYCoNwBIAUgAzYCACADIAU2AhgMAQsgAEEAQRkgBEEBdmsgBEEfRht0IQQgBSgCACEHA0AgByIFKAIEQXhxIABGDQMgBEEddiEHIARBAXQhBCAFIAdBBHFqQRBqIggoAgAiBw0ACyAIIAM2AgAgAyAFNgIYCyADIAM2AgwgAyADNgIIDAILQQAgAkFYaiIAQXggB2tBB3FBACAHQQhqQQdxGyIIayILNgKo3AFBACAHIAhqIgg2ArTcASAIIAtBAXI2AgQgByAAakEoNgIEQQBBACgChOABNgK43AEgBCAFQScgBWtBB3FBACAFQVlqQQdxG2pBUWoiACAAIARBEGpJGyIIQRs2AgQgCEEQakEAKQLk3wE3AgAgCEEAKQLc3wE3AghBACAIQQhqNgLk3wFBACACNgLg3wFBACAHNgLc3wFBAEEANgLo3wEgCEEYaiEAA0AgAEEHNgIEIABBCGohByAAQQRqIQAgByAFSQ0ACyAIIARGDQMgCCAIKAIEQX5xNgIEIAQgCCAEayIHQQFyNgIEIAggBzYCAAJAIAdB/wFLDQAgB0F4cUHE3AFqIQACQAJAQQAoApzcASIFQQEgB0EDdnQiB3ENAEEAIAUgB3I2ApzcASAAIQUMAQsgACgCCCEFCyAAIAQ2AgggBSAENgIMIAQgADYCDCAEIAU2AggMBAtBHyEAAkAgB0H///8HSw0AIAdBJiAHQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgBCAANgIcIARCADcCECAAQQJ0QczeAWohBQJAAkBBACgCoNwBIghBASAAdCICcQ0AQQAgCCACcjYCoNwBIAUgBDYCACAEIAU2AhgMAQsgB0EAQRkgAEEBdmsgAEEfRht0IQAgBSgCACEIA0AgCCIFKAIEQXhxIAdGDQQgAEEddiEIIABBAXQhACAFIAhBBHFqQRBqIgIoAgAiCA0ACyACIAQ2AgAgBCAFNgIYCyAEIAQ2AgwgBCAENgIIDAMLIAUoAggiACADNgIMIAUgAzYCCCADQQA2AhggAyAFNgIMIAMgADYCCAsgC0EIaiEADAULIAUoAggiACAENgIMIAUgBDYCCCAEQQA2AhggBCAFNgIMIAQgADYCCAtBACgCqNwBIgAgA00NAEEAIAAgA2siBDYCqNwBQQBBACgCtNwBIgAgA2oiBTYCtNwBIAUgBEEBcjYCBCAAIANBA3I2AgQgAEEIaiEADAMLEOsEQTA2AgBBACEADAILAkAgC0UNAAJAAkAgCCAIKAIcIgVBAnRBzN4BaiIAKAIARw0AIAAgBzYCACAHDQFBACAGQX4gBXdxIgY2AqDcAQwCCyALQRBBFCALKAIQIAhGG2ogBzYCACAHRQ0BCyAHIAs2AhgCQCAIKAIQIgBFDQAgByAANgIQIAAgBzYCGAsgCEEUaigCACIARQ0AIAdBFGogADYCACAAIAc2AhgLAkACQCAEQQ9LDQAgCCAEIANqIgBBA3I2AgQgCCAAaiIAIAAoAgRBAXI2AgQMAQsgCCADQQNyNgIEIAggA2oiByAEQQFyNgIEIAcgBGogBDYCAAJAIARB/wFLDQAgBEF4cUHE3AFqIQACQAJAQQAoApzcASIFQQEgBEEDdnQiBHENAEEAIAUgBHI2ApzcASAAIQQMAQsgACgCCCEECyAAIAc2AgggBCAHNgIMIAcgADYCDCAHIAQ2AggMAQtBHyEAAkAgBEH///8HSw0AIARBJiAEQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgByAANgIcIAdCADcCECAAQQJ0QczeAWohBQJAAkACQCAGQQEgAHQiA3ENAEEAIAYgA3I2AqDcASAFIAc2AgAgByAFNgIYDAELIARBAEEZIABBAXZrIABBH0YbdCEAIAUoAgAhAwNAIAMiBSgCBEF4cSAERg0CIABBHXYhAyAAQQF0IQAgBSADQQRxakEQaiICKAIAIgMNAAsgAiAHNgIAIAcgBTYCGAsgByAHNgIMIAcgBzYCCAwBCyAFKAIIIgAgBzYCDCAFIAc2AgggB0EANgIYIAcgBTYCDCAHIAA2AggLIAhBCGohAAwBCwJAIApFDQACQAJAIAcgBygCHCIFQQJ0QczeAWoiACgCAEcNACAAIAg2AgAgCA0BQQAgCUF+IAV3cTYCoNwBDAILIApBEEEUIAooAhAgB0YbaiAINgIAIAhFDQELIAggCjYCGAJAIAcoAhAiAEUNACAIIAA2AhAgACAINgIYCyAHQRRqKAIAIgBFDQAgCEEUaiAANgIAIAAgCDYCGAsCQAJAIARBD0sNACAHIAQgA2oiAEEDcjYCBCAHIABqIgAgACgCBEEBcjYCBAwBCyAHIANBA3I2AgQgByADaiIFIARBAXI2AgQgBSAEaiAENgIAAkAgBkUNACAGQXhxQcTcAWohA0EAKAKw3AEhAAJAAkBBASAGQQN2dCIIIAJxDQBBACAIIAJyNgKc3AEgAyEIDAELIAMoAgghCAsgAyAANgIIIAggADYCDCAAIAM2AgwgACAINgIIC0EAIAU2ArDcAUEAIAQ2AqTcAQsgB0EIaiEACyABQRBqJAAgAAvMDAEHfwJAIABFDQAgAEF4aiIBIABBfGooAgAiAkF4cSIAaiEDAkAgAkEBcQ0AIAJBA3FFDQEgASABKAIAIgJrIgFBACgCrNwBIgRJDQEgAiAAaiEAAkAgAUEAKAKw3AFGDQACQCACQf8BSw0AIAEoAggiBCACQQN2IgVBA3RBxNwBaiIGRhoCQCABKAIMIgIgBEcNAEEAQQAoApzcAUF+IAV3cTYCnNwBDAMLIAIgBkYaIAQgAjYCDCACIAQ2AggMAgsgASgCGCEHAkACQCABKAIMIgYgAUYNACABKAIIIgIgBEkaIAIgBjYCDCAGIAI2AggMAQsCQCABQRRqIgIoAgAiBA0AIAFBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAQJAAkAgASABKAIcIgRBAnRBzN4BaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKAKg3AFBfiAEd3E2AqDcAQwDCyAHQRBBFCAHKAIQIAFGG2ogBjYCACAGRQ0CCyAGIAc2AhgCQCABKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgASgCFCICRQ0BIAZBFGogAjYCACACIAY2AhgMAQsgAygCBCICQQNxQQNHDQBBACAANgKk3AEgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgAPCyABIANPDQAgAygCBCICQQFxRQ0AAkACQCACQQJxDQACQCADQQAoArTcAUcNAEEAIAE2ArTcAUEAQQAoAqjcASAAaiIANgKo3AEgASAAQQFyNgIEIAFBACgCsNwBRw0DQQBBADYCpNwBQQBBADYCsNwBDwsCQCADQQAoArDcAUcNAEEAIAE2ArDcAUEAQQAoAqTcASAAaiIANgKk3AEgASAAQQFyNgIEIAEgAGogADYCAA8LIAJBeHEgAGohAAJAAkAgAkH/AUsNACADKAIIIgQgAkEDdiIFQQN0QcTcAWoiBkYaAkAgAygCDCICIARHDQBBAEEAKAKc3AFBfiAFd3E2ApzcAQwCCyACIAZGGiAEIAI2AgwgAiAENgIIDAELIAMoAhghBwJAAkAgAygCDCIGIANGDQAgAygCCCICQQAoAqzcAUkaIAIgBjYCDCAGIAI2AggMAQsCQCADQRRqIgIoAgAiBA0AIANBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAAJAAkAgAyADKAIcIgRBAnRBzN4BaiICKAIARw0AIAIgBjYCACAGDQFBAEEAKAKg3AFBfiAEd3E2AqDcAQwCCyAHQRBBFCAHKAIQIANGG2ogBjYCACAGRQ0BCyAGIAc2AhgCQCADKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKAKw3AFHDQFBACAANgKk3AEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBeHFBxNwBaiECAkACQEEAKAKc3AEiBEEBIABBA3Z0IgBxDQBBACAEIAByNgKc3AEgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QczeAWohBAJAAkACQAJAQQAoAqDcASIGQQEgAnQiA3ENAEEAIAYgA3I2AqDcASAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCvNwBQX9qIgFBfyABGzYCvNwBCwsHAD8AQRB0C1QBAn9BACgCxMsBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAELEFTQ0AIAAQE0UNAQtBACAANgLEywEgAQ8LEOsEQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahC0BUEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQtAVBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrELQFIAVBMGogCiABIAcQvgUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxC0BSAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahC0BSAFIAIgBEEBIAZrEL4FIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBC8BQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxC9BRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqELQFQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQtAUgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQwAUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQwAUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQwAUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQwAUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQwAUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQwAUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQwAUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQwAUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQwAUgBUGQAWogA0IPhkIAIARCABDABSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEMAFIAVBgAFqQgEgAn1CACAEQgAQwAUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhDABSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDABSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEL4FIAVBMGogFiATIAZB8ABqELQFIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEMAFIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQwAUgBSADIA5CBUIAEMAFIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahC0BSACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahC0BSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqELQFIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqELQFIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqELQFQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqELQFIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGELQFIAVBIGogAiAEIAYQtAUgBUEQaiASIAEgBxC+BSAFIAIgBCAHEL4FIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCzBSAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQtAUgAiAAIARBgfgAIANrEL4FIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBkOAFJANBkOABQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABEQAAslAQF+IAAgASACrSADrUIghoQgBBDOBSEFIAVCIIinEMQFIAWnCxMAIAAgAacgAUIgiKcgAiADEBQLC73JgYAAAwBBgAgLmL8BaW5maW5pdHkALUluZmluaXR5AGh1bWlkaXR5AGFjaWRpdHkAZGV2c192ZXJpZnkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBpc0FycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAamRfd3Nza19uZXcAZXhwcjFfbmV3AGlkaXYAcHJldgB0c2FnZ19jbGllbnRfZXYAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAbGFzdC1lbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBzZW5kX3ZhbHVlcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBleHBlY3RpbmcgJXM7IGdvdCAlcwBXU246IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAdGFnIGVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAcm90YXJ5RW5jb2RlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuAGJ1dHRvbgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAHRocm93aW5nIG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAaW52YWxpZCBmbGFnIGFyZwBuZWVkIGZsYWcgYXJnACpwcm9nAGxvZwBzZXR0aW5nAGdldHRpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBnY3JlZl90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQBoZWFydFJhdGUAY2F1c2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG1hcmtfbGFyZ2UAYnVmZmVyIHN0b3JlIG91dCBvZiByYW5nZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAKiAgbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBmc3RvcjogbW91bnRlZDsgJWQgZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAFdTbjogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABXU246IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAGRhdGFfcGFnZV91c2VkAHVuZGVmaW5lZAByZWFkX25hbWVkACVzIGNhbGxlZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACogIHBjPSVkIEAgJXNfRiVkACEgIHBjPSVkIEAgJXNfRiVkACEgUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAZGJnOiBzdXNwZW5kICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAHR2b2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBfcGFuaWMAYmFkIG1hZ2ljAGpkX2ZzdG9yX2djAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGZzdG9yOiBnYwBwYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAUEkARElTQ09OTkVDVElORwBkZXZzX2djX3RhZyhkZXZzX2hhbmRsZV9wdHJfdmFsdWUoY3R4LCB2KSkgPT0gREVWU19HQ19UQUdfU1RSSU5HADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IEZMQVNIX1NJWkUAMCA8PSBkaWZmICYmIGRpZmYgPD0gRkxBU0hfU0laRSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAKiAgcGM9JWQgQCA/Pz8AJWMgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxlbiA9PSBsMgBsb2cyAFNRUlQxXzIAU1FSVDIAZUNPMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAYXJnMABsb2cxMABMTjEwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AJWMgIC4uLgBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2djX29ial92YWxpZChjdHgsIHB0cikAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2djX29ial92YWxpZChjdHgsIHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpAGZzdG9yOiBpbnZhbGlkIGxhcmdlIGtleTogJyVzJwBmc3RvcjogaW52YWxpZCBrZXk6ICclcycAV1NuOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXU246IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAEAMC4wLjAAAAAAAAAAAAAAAAAAAABEZXZpY2VTY3JpcHQgU2ltdWxhdG9yIChXQVNNKQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAnG5gFAwAAAAHAAAACAAAAPCfBgABEIAQgRCAEfEPAABAW1sVHAEAAAoAAAALAAAAAAAAAAAAAAAAAAcA8J8GAIAQgRCCEPEPK+o0ETwBAAAPAAAAEAAAAERldlMKfmqaAAAABQEAAAAAAAAAAAAAAAAAAAAAAAAAaAAAACAAAACIAAAADAAAAJQAAAAAAAAAlAAAAAAAAACUAAAAAAAAAJQAAAAAAAAAlAAAAAAAAACUAAAABAAAAJgAAAAAAAAAiAAAAAgAAAAAAAAAUEAAAJAAAAAEAAAAAAAAADRAAAAnAQKQDAAAAC4MAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAgAEAAAAAAAGAAAAAAAACAAFAAcACgAABg4SDBAIAAIAABgAAAAXAAAAGgAAABcAAAAXAAAAFwAAABcAAAAXAAAAGQAAAAAAAAAUAGvDGgBswzoAbcMNAG7DNgBvwzcAcMMjAHHDMgBywx4Ac8NLAHTDHwB1wygAdsMnAHfDAAAAAAAAAAAAAAAAVQB4w1YAecNXAHrDeQB7wzQAAgAAAAAAAAAAAGwAUsM0AAQAAAAAAAAAAAAAAAAAIgBQw00AUcM1AFPDbwBUwz8AVcMAAAAADgBWwzQABgAAAAAAAAAAAAAAAAAAAAAAIgBXw0QAWMMZAFnDEABawwAAAAA0AAgAAAAAAAAAAAAiAJTDFQCVw1EAlsMAAAAANAAKAAAAAAA0AAwAAAAAADQADgAAAAAAAAAAAAAAAAAgAJHDcACSw0gAk8MAAAAANAAQAAAAAAAAAAAAAAAAAE4AaMM0AGnDYwBqwwAAAAA0ABIAAAAAADQAFAAAAAAAWQB8w1oAfcNbAH7DXAB/w10AgMNpAIHDawCCw2oAg8NeAITDZACFw2UAhsNmAIfDZwCIw2gAicNfAIrDAAAAAEoAW8MwAFzDOQBdw0wAXsMjAF/DVABgw1MAYcN9AGLDAAAAAAAAAAAAAAAAAAAAAFkAjcNjAI7DYgCPwwAAAAADAAAPAAAAAEAsAAADAAAPAAAAAIAsAAADAAAPAAAAAJgsAAADAAAPAAAAAJwsAAADAAAPAAAAALAsAAADAAAPAAAAAMgsAAADAAAPAAAAAOAsAAADAAAPAAAAAPQsAAADAAAPAAAAAAAtAAADAAAPAAAAABAtAAADAAAPAAAAAJgsAAADAAAPAAAAABgtAAADAAAPAAAAAJgsAAADAAAPAAAAACAtAAADAAAPAAAAADAtAAADAAAPAAAAAEAtAAADAAAPAAAAAFAtAAADAAAPAAAAAGAtAAADAAAPAAAAAJgsAAADAAAPAAAAAGgtAAADAAAPAAAAAHAtAAADAAAPAAAAALAtAAADAAAPAAAAAOAtAAADAAAP+C4AAHwvAAADAAAP+C4AAIgvAAADAAAP+C4AAJAvAAADAAAPAAAAAJgsAAADAAAPAAAAAJQvAAADAAAPAAAAAKAvAAADAAAPAAAAALAvAAADAAAPQC8AALwvAAADAAAPAAAAAMQvAAADAAAPQC8AANAvAAA4AIvDSQCMwwAAAABYAJDDAAAAAAAAAABYAGPDNAAcAAAAAAB7AGPDYwBmw34AZ8MAAAAAWABlwzQAHgAAAAAAewBlwwAAAABYAGTDNAAgAAAAAAB7AGTDAAAAAAAAAAAAAAAAIgAAARQAAABNAAIAFQAAAGwAAQQWAAAANQAAABcAAABvAAEAGAAAAD8AAAAZAAAADgABBBoAAAAiAAABGwAAAEQAAAAcAAAAGQADAB0AAAAQAAQAHgAAAEoAAQQfAAAAMAABBCAAAAA5AAAEIQAAAEwAAAQiAAAAIwABBCMAAABUAAEEJAAAAFMAAQQlAAAAfQACBCYAAAByAAEIJwAAAHQAAQgoAAAAcwABCCkAAABjAAABKgAAAH4AAAArAAAATgAAACwAAAA0AAABLQAAAGMAAAEuAAAAFAABBC8AAAAaAAEEMAAAADoAAQQxAAAADQABBDIAAAA2AAAEMwAAADcAAQQ0AAAAIwABBDUAAAAyAAIENgAAAB4AAgQ3AAAASwACBDgAAAAfAAIEOQAAACgAAgQ6AAAAJwACBDsAAABVAAIEPAAAAFYAAQQ9AAAAVwABBD4AAAB5AAIEPwAAAFkAAAFAAAAAWgAAAUEAAABbAAABQgAAAFwAAAFDAAAAXQAAAUQAAABpAAABRQAAAGsAAAFGAAAAagAAAUcAAABeAAABSAAAAGQAAAFJAAAAZQAAAUoAAABmAAABSwAAAGcAAAFMAAAAaAAAAU0AAABfAAAATgAAADgAAABPAAAASQAAAFAAAABZAAABUQAAAGMAAAFSAAAAYgAAAVMAAABYAAAAVAAAACAAAAFVAAAAcAACAFYAAABIAAAAVwAAACIAAAFYAAAAFQABAFkAAABRAAEAWgAAAKoWAAA1CgAAQQQAAM4OAACYDQAA+hIAADkXAAATIwAAzg4AAPMIAADODgAAAAAAAAAAAAAAAAAAmC+KQpFEN3HP+8C1pdu16VvCVjnxEfFZpII/ktVeHKuYqgfYAVuDEr6FMSTDfQxVdF2+cv6x3oCnBtybdPGbwcFpm+SGR77vxp3BD8yhDCRvLOktqoR0StypsFzaiPl2UlE+mG3GMajIJwOwx39Zv/ML4MZHkafVUWPKBmcpKRSFCrcnOCEbLvxtLE0TDThTVHMKZbsKanYuycKBhSxykqHov6JLZhqocItLwqNRbMcZ6JLRJAaZ1oU1DvRwoGoQFsGkGQhsNx5Md0gntbywNLMMHDlKqthOT8qcW/NvLmjugo90b2OleBR4yIQIAseM+v++kOtsUKT3o/m+8nhxxvCfBgCEUIFQgxCCEIAQ8Q/MvZIRLAAAAFwAAABdAAAAAAAAAP////8AAAAAAADgQUAAAAAAAAAAAQAAAAAAAAACAAAAAAAAAEIAAAAAAAAAAwAAAAIAAAAEAAAACQAAAAgAAAAJAAAAAgAAAAoAAAACAAAAAAAAAAAAAAAAAAAAqyoAAAkEAAAgBwAA6yIAAAoEAADEIwAAWyMAAOYiAADgIgAATSEAADMiAABIIwAAUCMAAEoKAADZGgAAQQQAAFcJAADDEAAAmA0AAMcGAAAUEQAAeAkAALEOAAAeDgAANRUAAHEJAADgDAAAXBIAAN8PAABkCQAAnwUAAOAQAAB4GAAARRAAAPMRAACnEgAAviMAAEMjAADODgAAiwQAAEoQAABZBgAA7hAAANcNAABoFgAAhBgAAFoYAADzCAAA3xoAAJ4OAABvBQAApAUAAJUVAAANEgAAyxAAAPYHAAB3GQAALQcAADMXAABeCQAA+hEAAFUIAABnEQAAERcAABcXAACcBgAA+hIAAB4XAAABEwAAeBQAAKcYAABECAAAMAgAANMUAABWCgAALhcAAFAJAADABgAABwcAACgXAABiEAAAagkAAD4JAAAACAAARQkAAGcQAACDCQAA+AkAAMceAAAoFgAAhw0AAHwZAABsBAAAoRcAACgZAADPFgAAyBYAAPoIAADRFgAACBYAAKoHAADWFgAAAwkAAAwJAADgFgAA7QkAAKEGAACXFwAARwQAANIVAAC5BgAAcRYAALAXAAC9HgAA2gwAAMsMAADVDAAAoREAAJMWAAAHFQAAqx4AAKcTAAC2EwAAlgwAALMeAACNDAAASwcAAE4KAABNEQAAcAYAAFkRAAB7BgAAf2AREhMUFRYXGBkSUXAxQmAxMRRAICBBAhMhISFgYBAREWBgYGBgYGBgIAMAQUBBQEBBQEFBQUFBQUJCQkJCQkJCQkJCQkJCETIhIEEAARIwcBAQUVFxEEFCACorUlJSUhFSHEJSUgAAAAAAAAAAAGN8d3vya2/FMAFnK/7Xq3bKgsl9+llH8K3Uoq+cpHLAt/2TJjY/98w0peXxcdgxFQTHI8MYlgWaBxKA4usnsnUJgywaG25aoFI71rMp4y+EU9EA7SD8sVtqy745SkxYz9DvqvtDTTOFRfkCf1A8n6hRo0CPkp049by22iEQ//PSzQwT7F+XRBfEp349ZF0Zc2CBT9wiKpCIRu64FN5eC9vgMjoKSQYkXMLTrGKRleR558g3bY3VTqlsVvTqZXquCLp4JS4cprTG6N10H0u9i4pwPrVmSAP2DmE1V7mGwR2e4fiYEWnZjpSbHofpzlUo34yhiQ2/5kJoQZktD7BUuxaNAQIECBAgQIAbNgAAAAAAAAAAACwCAAApAgAAIwIAACkCAADwnwYAgjGAUIFQ8Q/87mIUXAAAALgAAAC5AAAAugAAALsAAAC8AAAAvQAAAAAEAAC+AAAA8J8GAIAQgRHxDwAAZn5LHiQBAAC/AAAAwAAAAAAAAAAAAAAAAAAAAFYNAAC2TrsQgQAAAK4NAADJKfoQBgAAAJQPAABJp3kRAAAAADUIAACyTGwSAQEAAKUaAACXtaUSogAAADoRAAAPGP4S9QAAABsZAADILQYTAAAAADkWAACVTHMTAgEAAOgWAACKaxoUAgEAAFQVAADHuiEUpgAAAGsPAABjonMUAQEAACQRAADtYnsUAQEAAFQEAADWbqwUAgEAAC8RAABdGq0UAQEAAMIJAAC/ubcVAgEAANgHAAAZrDMWAwAAAP0UAADEbWwWAgEAAFYjAADGnZwWogAAABMEAAC4EMgWogAAABkRAAAcmtwXAQEAAOgPAAAr6WsYAQAAAMMHAACuyBIZAwAAAEISAAAClNIaAAAAABEZAAC/G1kbAgEAADcSAAC1KhEdBQAAAEcVAACzo0odAQEAAGAVAADqfBEeogAAAPEWAADyym4eogAAABwEAADFeJcewQAAAEgNAABGRycfAQEAAE8EAADGxkcf9QAAAC0WAABAUE0fAgEAAGQEAACQDW4fAgEAACEAAAAAAAAACAAAAMEAAADCAAAAAQECAgQEBAgBAAECBAQAAAEAAAAAAAAACgAAAAAAAABkAAAAAAAAAOgDAAAAAAAAECcAAAAAAACghgEAAAAAAEBCDwAAAAAAgJaYAAAAAAAA4fUFAAAAAADKmjsAAAAAAOQLVAIAAAAA6HZIFwAAAAAQpdToAAAAAKByThgJAAAAQHoQ81oAAAA4+v5CLuY/MGfHk1fzLj0BAAAAAADgv1swUVVVVdU/kEXr////z78RAfEks5nJP5/IBuV1VcW/AAAAAAAA4L93VVVVVVXVP8v9/////8+/DN2VmZmZyT+nRWdVVVXFvzDeRKMkScI/ZT1CpP//v7/K1ioohHG8P/9osEPrmbm/hdCv94KBtz/NRdF1E1K1v5/e4MPwNPc/AJDmeX/M178f6SxqeBP3PwAADcLub9e/oLX6CGDy9j8A4FET4xPXv32MEx+m0fY/AHgoOFu41r/RtMULSbH2PwB4gJBVXda/ugwvM0eR9j8AABh20ALWvyNCIhifcfY/AJCQhsqo1b/ZHqWZT1L2PwBQA1ZDT9W/xCSPqlYz9j8AQGvDN/bUvxTcnWuzFPY/AFCo/aed1L9MXMZSZPb1PwCoiTmSRdS/TyyRtWfY9T8AuLA59O3Tv96QW8u8uvU/AHCPRM6W0794GtnyYZ31PwCgvRceQNO/h1ZGElaA9T8AgEbv4unSv9Nr586XY/U/AOAwOBuU0r+Tf6fiJUf1PwCI2ozFPtK/g0UGQv8q9T8AkCcp4enRv9+9stsiD/U/APhIK22V0b/X3jRHj/P0PwD4uZpnQdG/QCjez0PY9D8AmO+U0O3Qv8ijeMA+vfQ/ABDbGKWa0L+KJeDDf6L0PwC4Y1LmR9C/NITUJAWI9D8A8IZFIuvPvwstGRvObfQ/ALAXdUpHz79UGDnT2VP0PwAwED1EpM6/WoS0RCc69D8AsOlEDQLOv/v4FUG1IPQ/APB3KaJgzb+x9D7aggf0PwCQlQQBwMy/j/5XXY/u8z8AEIlWKSDMv+lMC6DZ1fM/ABCBjReBy78rwRDAYL3zPwDQ08zJ4sq/uNp1KySl8z8AkBIuQEXKvwLQn80ijfM/APAdaHeoyb8ceoTFW3XzPwAwSGltDMm/4jatSc5d8z8AwEWmIHHIv0DUTZh5RvM/ADAUtI/Wx78ky//OXC/zPwBwYjy4PMe/SQ2hdXcY8z8AYDebmqPGv5A5PjfIAfM/AKC3VDELxr9B+JW7TuvyPwAwJHZ9c8W/0akZAgrV8j8AMMKPe9zEvyr9t6j5vvI/AADSUSxGxL+rGwx6HKnyPwAAg7yKsMO/MLUUYHKT8j8AAElrmRvDv/WhV1f6ffI/AECkkFSHwr+/Ox2bs2jyPwCgefi588G/vfWPg51T8j8AoCwlyGDBvzsIyaq3PvI/ACD3V3/OwL+2QKkrASryPwCg/kncPMC/MkHMlnkV8j8AgEu8vVe/v5v80h0gAfI/AEBAlgg3vr8LSE1J9OzxPwBA+T6YF72/aWWPUvXY8T8AoNhOZ/m7v3x+VxEjxfE/AGAvIHncur/pJst0fLHxPwCAKOfDwLm/thosDAGe8T8AwHKzRqa4v71wtnuwivE/AACsswGNt7+2vO8linfxPwAAOEXxdLa/2jFMNY1k8T8AgIdtDl61v91fJ5C5UfE/AOCh3lxItL9M0jKkDj/xPwCgak3ZM7O/2vkQcoss8T8AYMX4eSCyvzG17CgwGvE/ACBimEYOsb+vNITa+wfxPwAA0mps+q+/s2tOD+718D8AQHdKjdqtv86fKl0G5PA/AACF5Oy8q78hpSxjRNLwPwDAEkCJoam/GpjifKfA8D8AwAIzWIinv9E2xoMvr/A/AIDWZ15xpb85E6CY253wPwCAZUmKXKO/3+dSr6uM8D8AQBVk40mhv/soTi+fe/A/AIDrgsBynr8ZjzWMtWrwPwCAUlLxVZq/LPnspe5Z8D8AgIHPYj2Wv5As0c1JSfA/AACqjPsokr+prfDGxjjwPwAA+SB7MYy/qTJ5E2Uo8D8AAKpdNRmEv0hz6ickGPA/AADswgMSeL+VsRQGBAjwPwAAJHkJBGC/Gvom9x/g7z8AAJCE8+9vP3TqYcIcoe8/AAA9NUHchz8umYGwEGPvPwCAwsSjzpM/za3uPPYl7z8AAIkUwZ+bP+cTkQPI6e4/AAARztiwoT+rsct4gK7uPwDAAdBbiqU/mwydohp07j8AgNhAg1ypP7WZCoOROu4/AIBX72onrT9WmmAJ4AHuPwDAmOWYdbA/mLt35QHK7T8AIA3j9VOyPwORfAvyku0/AAA4i90utD/OXPtmrFztPwDAV4dZBrY/nd5eqiwn7T8AAGo1dtq3P80saz5u8uw/AGAcTkOruT8Ceaeibb7sPwBgDbvHeLs/bQg3bSaL7D8AIOcyE0O9PwRYXb2UWOw/AGDecTEKvz+Mn7sztSbsPwBAkSsVZ8A/P+fs7oP16z8AsJKChUfBP8GW23X9xOs/ADDKzW4mwj8oSoYMHpXrPwBQxabXA8M/LD7vxeJl6z8AEDM8w9/DP4uIyWdIN+s/AIB6aza6xD9KMB0hSwnrPwDw0Sg5k8U/fu/yhejb6j8A8BgkzWrGP6I9YDEdr+o/AJBm7PhAxz+nWNM/5oLqPwDwGvXAFcg/i3MJ70BX6j8AgPZUKenIPydLq5AqLOo/AED4Aja7yT/R8pMToAHqPwAALBzti8o/GzzbJJ/X6T8A0AFcUVvLP5CxxwUlruk/AMC8zGcpzD8vzpfyLoXpPwBgSNU19sw/dUuk7rpc6T8AwEY0vcHNPzhI553GNOk/AODPuAGMzj/mUmcvTw3pPwCQF8AJVc8/ndf/jlLm6D8AuB8SbA7QP3wAzJ/Ov+g/ANCTDrhx0D8Ow77awJnoPwBwhp5r1NA/+xcjqid06D8A0EszhzbRPwias6wAT+g/AEgjZw2Y0T9VPmXoSSroPwCAzOD/+NE/YAL0lQEG6D8AaGPXX1nSPymj4GMl4uc/AKgUCTC50j+ttdx3s77nPwBgQxByGNM/wiWXZ6qb5z8AGOxtJnfTP1cGF/IHeec/ADCv+0/V0z8ME9bbylbnPwDgL+PuMtQ/a7ZPAQAQ5j88W0KRbAJ+PJW0TQMAMOY/QV0ASOq/jTx41JQNAFDmP7el1oanf448rW9OBwBw5j9MJVRr6vxhPK4P3/7/j+Y//Q5ZTCd+fLy8xWMHALDmPwHa3EhowYq89sFcHgDQ5j8Rk0mdHD+DPD72Bev/7+Y/Uy3iGgSAfryAl4YOABDnP1J5CXFm/3s8Euln/P8v5z8kh70m4gCMPGoRgd//T+c/0gHxbpECbryQnGcPAHDnP3ScVM1x/Ge8Nch++v+P5z+DBPWewb6BPObCIP7/r+c/ZWTMKRd+cLwAyT/t/8/nPxyLewhygIC8dhom6f/v5z+u+Z1tKMCNPOijnAQAEOg/M0zlUdJ/iTyPLJMXADDoP4HzMLbp/oq8nHMzBgBQ6D+8NWVrv7+JPMaJQiAAcOg/dXsR82W/i7wEefXr/4/oP1fLPaJuAIm83wS8IgCw6D8KS+A43wB9vIobDOX/z+g/BZ//RnEAiLxDjpH8/+/oPzhwetB7gYM8x1/6HgAQ6T8DtN92kT6JPLl7RhMAMOk/dgKYS06AfzxvB+7m/0/pPy5i/9nwfo+80RI83v9v6T+6OCaWqoJwvA2KRfT/j+k/76hkkRuAh7w+Lpjd/6/pPzeTWorgQIe8ZvtJ7f/P6T8A4JvBCM4/PFGc8SAA8Ok/CluIJ6o/irwGsEURABDqP1baWJlI/3Q8+va7BwAw6j8YbSuKq76MPHkdlxAAUOo/MHl43cr+iDxILvUdAHDqP9ur2D12QY+8UjNZHACQ6j8SdsKEAr+OvEs+TyoAsOo/Xz//PAT9abzRHq7X/8/qP7RwkBLnPoK8eARR7v/v6j+j3g7gPgZqPFsNZdv/D+s/uQofOMgGWjxXyqr+/y/rPx08I3QeAXm83LqV2f9P6z+fKoZoEP95vJxlniQAcOs/Pk+G0EX/ijxAFof5/4/rP/nDwpZ3/nw8T8sE0v+v6z/EK/LuJ/9jvEVcQdL/z+s/Ieo77rf/bLzfCWP4/+/rP1wLLpcDQYG8U3a14f8P7D8ZareUZMGLPONX+vH/L+w/7cYwje/+ZLwk5L/c/0/sP3VH7LxoP4S897lU7f9v7D/s4FPwo36EPNWPmev/j+w/8ZL5jQaDczyaISUhALDsPwQOGGSO/Wi8nEaU3f/P7D9y6sccvn6OPHbE/er/7+w//oifrTm+jjwr+JoWABDtP3FauaiRfXU8HfcPDQAw7T/ax3BpkMGJPMQPeer/T+0/DP5YxTcOWLzlh9wuAHDtP0QPwU3WgH+8qoLcIQCQ7T9cXP2Uj3x0vIMCa9j/r+0/fmEhxR1/jDw5R2wpANDtP1Ox/7KeAYg89ZBE5f/v7T+JzFLG0gBuPJT2q83/D+4/0mktIECDf7zdyFLb/y/uP2QIG8rBAHs87xZC8v9P7j9Rq5SwqP9yPBFeiuj/b+4/Wb7vsXP2V7wN/54RAJDuPwHIC16NgIS8RBel3/+v7j+1IEPVBgB4PKF/EhoA0O4/klxWYPgCULzEvLoHAPDuPxHmNV1EQIW8Ao169f8P7z8Fke85MftPvMeK5R4AMO8/VRFz8qyBijyUNIL1/0/vP0PH19RBP4o8a0yp/P9v7z91eJgc9AJivEHE+eH/j+8/S+d39NF9dzx+4+DS/6/vPzGjfJoZAW+8nuR3HADQ7z+xrM5L7oFxPDHD4Pf/7+8/WodwATcFbrxuYGX0/w/wP9oKHEmtfoq8WHqG8/8v8D/gsvzDaX+XvBcN/P3/T/A/W5TLNP6/lzyCTc0DAHDwP8tW5MCDAII86Mvy+f+P8D8adTe+3/9tvGXaDAEAsPA/6ybmrn8/kbw406QBANDwP/efSHn6fYA8/f3a+v/v8D/Aa9ZwBQR3vJb9ugsAEPE/YgtthNSAjjxd9OX6/y/xP+82/WT6v5082ZrVDQBQ8T+uUBJwdwCaPJpVIQ8AcPE/7t7j4vn9jTwmVCf8/4/xP3NyO9wwAJE8WTw9EgCw8T+IAQOAeX+ZPLeeKfj/z/E/Z4yfqzL5ZbwA1Ir0/+/xP+tbp52/f5M8pIaLDAAQ8j8iW/2Ra4CfPANDhQMAMPI/M7+f68L/kzyE9rz//0/yP3IuLn7nAXY82SEp9f9v8j9hDH92u/x/PDw6kxQAkPI/K0ECPMoCcrwTY1UUALDyPwIf8jOCgJK8O1L+6//P8j/y3E84fv+IvJatuAsA8PI/xUEwUFH/hbyv4nr7/w/zP50oXohxAIG8f1+s/v8v8z8Vt7c/Xf+RvFZnpgwAUPM/vYKLIoJ/lTwh9/sRAHDzP8zVDcS6AIA8uS9Z+f+P8z9Rp7ItnT+UvELS3QQAsPM/4Th2cGt/hTxXybL1/8/zPzESvxA6Ano8GLSw6v/v8z+wUrFmbX+YPPSvMhUAEPQ/JIUZXzf4Zzwpi0cXADD0P0NR3HLmAYM8Y7SV5/9P9D9aibK4af+JPOB1BOj/b/Q/VPLCm7HAlbznwW/v/4/0P3IqOvIJQJs8BKe+5f+v9D9FfQ2/t/+UvN4nEBcA0PQ/PWrccWTAmbziPvAPAPD0PxxThQuJf5c80UvcEgAQ9T82pGZxZQRgPHonBRYAMPU/CTIjzs6/lrxMcNvs/0/1P9ehBQVyAom8qVRf7/9v9T8SZMkO5r+bPBIQ5hcAkPU/kO+vgcV+iDySPskDALD1P8AMvwoIQZ+8vBlJHQDQ9T8pRyX7KoGYvIl6uOf/7/U/BGntgLd+lLz+gitlRxVnQAAAAAAAADhDAAD6/kIudr86O568mvcMvb39/////98/PFRVVVVVxT+RKxfPVVWlPxfQpGcREYE/AAAAAAAAyELvOfr+Qi7mPyTEgv+9v84/tfQM1whrrD/MUEbSq7KDP4Q6Tpvg11U/AAAAAAAAAAAAAAAAAADwP26/iBpPO5s8NTP7qT327z9d3NicE2BxvGGAdz6a7O8/0WaHEHpekLyFf27oFePvPxP2ZzVS0ow8dIUV07DZ7z/6jvkjgM6LvN723Slr0O8/YcjmYU73YDzIm3UYRcfvP5nTM1vko5A8g/PGyj6+7z9te4NdppqXPA+J+WxYte8//O/9khq1jjz3R3IrkqzvP9GcL3A9vj48otHTMuyj7z8LbpCJNANqvBvT/q9mm+8/Dr0vKlJWlbxRWxLQAZPvP1XqTozvgFC8zDFswL2K7z8W9NW5I8mRvOAtqa6agu8/r1Vc6ePTgDxRjqXImHrvP0iTpeoVG4C8e1F9PLhy7z89Mt5V8B+PvOqNjDj5au8/v1MTP4yJizx1y2/rW2PvPybrEXac2Za81FwEhOBb7z9gLzo+9+yaPKq5aDGHVO8/nTiGy4Lnj7wd2fwiUE3vP43DpkRBb4o81oxiiDtG7z99BOSwBXqAPJbcfZFJP+8/lKio4/2Oljw4YnVuejjvP31IdPIYXoc8P6ayT84x7z/y5x+YK0eAPN184mVFK+8/XghxP3u4lryBY/Xh3yTvPzGrCW3h94I84d4f9Z0e7z/6v28amyE9vJDZ2tB/GO8/tAoMcoI3izwLA+SmhRLvP4/LzomSFG48Vi8+qa8M7z+2q7BNdU2DPBW3MQr+Bu8/THSs4gFChjwx2Ez8cAHvP0r401053Y88/xZksgj87j8EW447gKOGvPGfkl/F9u4/aFBLzO1KkrzLqTo3p/HuP44tURv4B5m8ZtgFba7s7j/SNpQ+6NFxvPef5TTb5+4/FRvOsxkZmbzlqBPDLePuP21MKqdIn4U8IjQSTKbe7j+KaSh6YBKTvByArARF2u4/W4kXSI+nWLwqLvchCtbuPxuaSWebLHy8l6hQ2fXR7j8RrMJg7WNDPC2JYWAIzu4/72QGOwlmljxXAB3tQcruP3kDodrhzG480DzBtaLG7j8wEg8/jv+TPN7T1/Aqw+4/sK96u86QdjwnKjbV2r/uP3fgVOu9HZM8Dd39mbK87j+Oo3EANJSPvKcsnXayue4/SaOT3Mzeh7xCZs+i2rbuP184D73G3ni8gk+dViu07j/2XHvsRhKGvA+SXcqkse4/jtf9GAU1kzzaJ7U2R6/uPwWbii+3mHs8/ceX1BKt7j8JVBzi4WOQPClUSN0Hq+4/6sYZUIXHNDy3RlmKJqnuPzXAZCvmMpQ8SCGtFW+n7j+fdplhSuSMvAncdrnhpe4/qE3vO8UzjLyFVTqwfqTuP67pK4l4U4S8IMPMNEaj7j9YWFZ43c6TvCUiVYI4ou4/ZBl+gKoQVzxzqUzUVaHuPygiXr/vs5O8zTt/Zp6g7j+CuTSHrRJqvL/aC3USoO4/7qltuO9nY7wvGmU8sp/uP1GI4FQ93IC8hJRR+X2f7j/PPlp+ZB94vHRf7Oh1n+4/sH2LwEruhrx0gaVImp/uP4rmVR4yGYa8yWdCVuuf7j/T1Aley5yQPD9d3k9poO4/HaVNudwye7yHAetzFKHuP2vAZ1T97JQ8MsEwAe2h7j9VbNar4etlPGJOzzbzou4/Qs+zL8WhiLwSGj5UJ6TuPzQ3O/G2aZO8E85MmYml7j8e/xk6hF6AvK3HI0Yap+4/bldy2FDUlLztkkSb2ajuPwCKDltnrZA8mWaK2ceq7j+06vDBL7eNPNugKkLlrO4//+fFnGC2ZbyMRLUWMq/uP0Rf81mD9ns8NncVma6x7j+DPR6nHwmTvMb/kQtbtO4/KR5si7ipXbzlxc2wN7fuP1m5kHz5I2y8D1LIy0S67j+q+fQiQ0OSvFBO3p+Cve4/S45m12zKhby6B8pw8cDuPyfOkSv8r3E8kPCjgpHE7j+7cwrhNdJtPCMj4xljyO4/YyJiIgTFh7xl5V17ZszuP9Ux4uOGHIs8My1K7JvQ7j8Vu7zT0buRvF0lPrID1e4/0jHunDHMkDxYszATntnuP7Nac26EaYQ8v/15VWve7j+0nY6Xzd+CvHrz079r4+4/hzPLkncajDyt01qZn+juP/rZ0UqPe5C8ZraNKQfu7j+6rtxW2cNVvPsVT7ii8+4/QPamPQ6kkLw6WeWNcvnuPzSTrTj01mi8R1778nb/7j81ilhr4u6RvEoGoTCwBe8/zd1fCtf/dDzSwUuQHgzvP6yYkvr7vZG8CR7XW8IS7z+zDK8wrm5zPJxShd2bGe8/lP2fXDLjjjx60P9fqyDvP6xZCdGP4IQ8S9FXLvEn7z9nGk44r81jPLXnBpRtL+8/aBmSbCxrZzxpkO/cIDfvP9K1zIMYioC8+sNdVQs/7z9v+v8/Xa2PvHyJB0otR+8/Sal1OK4NkLzyiQ0Ih0/vP6cHPaaFo3Q8h6T73BhY7z8PIkAgnpGCvJiDyRbjYO8/rJLB1VBajjyFMtsD5mnvP0trAaxZOoQ8YLQB8yFz7z8fPrQHIdWCvF+bezOXfO8/yQ1HO7kqibwpofUURobvP9OIOmAEtnQ89j+L5y6Q7z9xcp1R7MWDPINMx/tRmu8/8JHTjxL3j7zakKSir6TvP310I+KYro288WeOLUiv7z8IIKpBvMOOPCdaYe4buu8/Muupw5QrhDyXums3K8XvP+6F0TGpZIo8QEVuW3bQ7z/t4zvkujeOvBS+nK392+8/nc2RTTuJdzzYkJ6BwefvP4nMYEHBBVM88XGPK8Lz7z8AOPr+Qi7mPzBnx5NX8y49AAAAAAAA4L9gVVVVVVXlvwYAAAAAAOA/TlVZmZmZ6T96pClVVVXlv+lFSJtbSfK/wz8miysA8D8AAAAAAKD2PwAAAAAAAAAAAMi58oIs1r+AVjcoJLT6PAAAAAAAgPY/AAAAAAAAAAAACFi/vdHVvyD34NgIpRy9AAAAAABg9j8AAAAAAAAAAABYRRd3dtW/bVC21aRiI70AAAAAAED2PwAAAAAAAAAAAPgth60a1b/VZ7Ce5ITmvAAAAAAAIPY/AAAAAAAAAAAAeHeVX77Uv+A+KZNpGwS9AAAAAAAA9j8AAAAAAAAAAABgHMKLYdS/zIRMSC/YEz0AAAAAAOD1PwAAAAAAAAAAAKiGhjAE1L86C4Lt80LcPAAAAAAAwPU/AAAAAAAAAAAASGlVTKbTv2CUUYbGsSA9AAAAAACg9T8AAAAAAAAAAACAmJrdR9O/koDF1E1ZJT0AAAAAAID1PwAAAAAAAAAAACDhuuLo0r/YK7eZHnsmPQAAAAAAYPU/AAAAAAAAAAAAiN4TWonSvz+wz7YUyhU9AAAAAABg9T8AAAAAAAAAAACI3hNaidK/P7DPthTKFT0AAAAAAED1PwAAAAAAAAAAAHjP+0Ep0r922lMoJFoWvQAAAAAAIPU/AAAAAAAAAAAAmGnBmMjRvwRU52i8rx+9AAAAAAAA9T8AAAAAAAAAAACoq6tcZ9G/8KiCM8YfHz0AAAAAAOD0PwAAAAAAAAAAAEiu+YsF0b9mWgX9xKgmvQAAAAAAwPQ/AAAAAAAAAAAAkHPiJKPQvw4D9H7uawy9AAAAAACg9D8AAAAAAAAAAADQtJQlQNC/fy30nrg28LwAAAAAAKD0PwAAAAAAAAAAANC0lCVA0L9/LfSeuDbwvAAAAAAAgPQ/AAAAAAAAAAAAQF5tGLnPv4c8masqVw09AAAAAABg9D8AAAAAAAAAAABg3Mut8M6/JK+GnLcmKz0AAAAAAED0PwAAAAAAAAAAAPAqbgcnzr8Q/z9UTy8XvQAAAAAAIPQ/AAAAAAAAAAAAwE9rIVzNvxtoyruRuiE9AAAAAAAA9D8AAAAAAAAAAACgmsf3j8y/NISfaE95Jz0AAAAAAAD0PwAAAAAAAAAAAKCax/ePzL80hJ9oT3knPQAAAAAA4PM/AAAAAAAAAAAAkC10hsLLv4+3izGwThk9AAAAAADA8z8AAAAAAAAAAADAgE7J88q/ZpDNP2NOujwAAAAAAKDzPwAAAAAAAAAAALDiH7wjyr/qwUbcZIwlvQAAAAAAoPM/AAAAAAAAAAAAsOIfvCPKv+rBRtxkjCW9AAAAAACA8z8AAAAAAAAAAABQ9JxaUsm/49TBBNnRKr0AAAAAAGDzPwAAAAAAAAAAANAgZaB/yL8J+tt/v70rPQAAAAAAQPM/AAAAAAAAAAAA4BACiavHv1hKU3KQ2ys9AAAAAABA8z8AAAAAAAAAAADgEAKJq8e/WEpTcpDbKz0AAAAAACDzPwAAAAAAAAAAANAZ5w/Wxr9m4rKjauQQvQAAAAAAAPM/AAAAAAAAAAAAkKdwMP/FvzlQEJ9Dnh69AAAAAAAA8z8AAAAAAAAAAACQp3Aw/8W/OVAQn0OeHr0AAAAAAODyPwAAAAAAAAAAALCh4+Umxb+PWweQi94gvQAAAAAAwPI/AAAAAAAAAAAAgMtsK03Evzx4NWHBDBc9AAAAAADA8j8AAAAAAAAAAACAy2wrTcS/PHg1YcEMFz0AAAAAAKDyPwAAAAAAAAAAAJAeIPxxw786VCdNhnjxPAAAAAAAgPI/AAAAAAAAAAAA8B/4UpXCvwjEcRcwjSS9AAAAAABg8j8AAAAAAAAAAABgL9Uqt8G/lqMRGKSALr0AAAAAAGDyPwAAAAAAAAAAAGAv1Sq3wb+WoxEYpIAuvQAAAAAAQPI/AAAAAAAAAAAAkNB8ftfAv/Rb6IiWaQo9AAAAAABA8j8AAAAAAAAAAACQ0Hx+18C/9FvoiJZpCj0AAAAAACDyPwAAAAAAAAAAAODbMZHsv7/yM6NcVHUlvQAAAAAAAPI/AAAAAAAAAAAAACtuBye+vzwA8CosNCo9AAAAAAAA8j8AAAAAAAAAAAAAK24HJ76/PADwKiw0Kj0AAAAAAODxPwAAAAAAAAAAAMBbj1RevL8Gvl9YVwwdvQAAAAAAwPE/AAAAAAAAAAAA4Eo6bZK6v8iqW+g1OSU9AAAAAADA8T8AAAAAAAAAAADgSjptkrq/yKpb6DU5JT0AAAAAAKDxPwAAAAAAAAAAAKAx1kXDuL9oVi9NKXwTPQAAAAAAoPE/AAAAAAAAAAAAoDHWRcO4v2hWL00pfBM9AAAAAACA8T8AAAAAAAAAAABg5YrS8La/2nMzyTeXJr0AAAAAAGDxPwAAAAAAAAAAACAGPwcbtb9XXsZhWwIfPQAAAAAAYPE/AAAAAAAAAAAAIAY/Bxu1v1dexmFbAh89AAAAAABA8T8AAAAAAAAAAADgG5bXQbO/3xP5zNpeLD0AAAAAAEDxPwAAAAAAAAAAAOAbltdBs7/fE/nM2l4sPQAAAAAAIPE/AAAAAAAAAAAAgKPuNmWxvwmjj3ZefBQ9AAAAAAAA8T8AAAAAAAAAAACAEcAwCq+/kY42g55ZLT0AAAAAAADxPwAAAAAAAAAAAIARwDAKr7+RjjaDnlktPQAAAAAA4PA/AAAAAAAAAAAAgBlx3UKrv0xw1uV6ghw9AAAAAADg8D8AAAAAAAAAAACAGXHdQqu/THDW5XqCHD0AAAAAAMDwPwAAAAAAAAAAAMAy9lh0p7/uofI0RvwsvQAAAAAAwPA/AAAAAAAAAAAAwDL2WHSnv+6h8jRG/Cy9AAAAAACg8D8AAAAAAAAAAADA/rmHnqO/qv4m9bcC9TwAAAAAAKDwPwAAAAAAAAAAAMD+uYeeo7+q/ib1twL1PAAAAAAAgPA/AAAAAAAAAAAAAHgOm4Kfv+QJfnwmgCm9AAAAAACA8D8AAAAAAAAAAAAAeA6bgp+/5Al+fCaAKb0AAAAAAGDwPwAAAAAAAAAAAIDVBxu5l785pvqTVI0ovQAAAAAAQPA/AAAAAAAAAAAAAPywqMCPv5ym0/Z8Ht+8AAAAAABA8D8AAAAAAAAAAAAA/LCowI+/nKbT9nwe37wAAAAAACDwPwAAAAAAAAAAAAAQayrgf7/kQNoNP+IZvQAAAAAAIPA/AAAAAAAAAAAAABBrKuB/v+RA2g0/4hm9AAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO8/AAAAAAAAAAAAAIl1FRCAP+grnZlrxxC9AAAAAACA7z8AAAAAAAAAAACAk1hWIJA/0vfiBlvcI70AAAAAAEDvPwAAAAAAAAAAAADJKCVJmD80DFoyuqAqvQAAAAAAAO8/AAAAAAAAAAAAQOeJXUGgP1PX8VzAEQE9AAAAAADA7j8AAAAAAAAAAAAALtSuZqQ/KP29dXMWLL0AAAAAAIDuPwAAAAAAAAAAAMCfFKqUqD99JlrQlXkZvQAAAAAAQO4/AAAAAAAAAAAAwN3Nc8usPwco2EfyaBq9AAAAAAAg7j8AAAAAAAAAAADABsAx6q4/ezvJTz4RDr0AAAAAAODtPwAAAAAAAAAAAGBG0TuXsT+bng1WXTIlvQAAAAAAoO0/AAAAAAAAAAAA4NGn9b2zP9dO26VeyCw9AAAAAABg7T8AAAAAAAAAAACgl01a6bU/Hh1dPAZpLL0AAAAAAEDtPwAAAAAAAAAAAMDqCtMAtz8y7Z2pjR7sPAAAAAAAAO0/AAAAAAAAAAAAQFldXjO5P9pHvTpcESM9AAAAAADA7D8AAAAAAAAAAABgrY3Iars/5Wj3K4CQE70AAAAAAKDsPwAAAAAAAAAAAEC8AViIvD/TrFrG0UYmPQAAAAAAYOw/AAAAAAAAAAAAIAqDOce+P+BF5q9owC29AAAAAABA7D8AAAAAAAAAAADg2zmR6L8//QqhT9Y0Jb0AAAAAAADsPwAAAAAAAAAAAOAngo4XwT/yBy3OeO8hPQAAAAAA4Os/AAAAAAAAAAAA8CN+K6rBPzSZOESOpyw9AAAAAACg6z8AAAAAAAAAAACAhgxh0cI/obSBy2ydAz0AAAAAAIDrPwAAAAAAAAAAAJAVsPxlwz+JcksjqC/GPAAAAAAAQOs/AAAAAAAAAAAAsDODPZHEP3i2/VR5gyU9AAAAAAAg6z8AAAAAAAAAAACwoeTlJ8U/x31p5egzJj0AAAAAAODqPwAAAAAAAAAAABCMvk5Xxj94Ljwsi88ZPQAAAAAAwOo/AAAAAAAAAAAAcHWLEvDGP+EhnOWNESW9AAAAAACg6j8AAAAAAAAAAABQRIWNicc/BUORcBBmHL0AAAAAAGDqPwAAAAAAAAAAAAA566++yD/RLOmqVD0HvQAAAAAAQOo/AAAAAAAAAAAAAPfcWlrJP2//oFgo8gc9AAAAAAAA6j8AAAAAAAAAAADgijztk8o/aSFWUENyKL0AAAAAAODpPwAAAAAAAAAAANBbV9gxyz+q4axOjTUMvQAAAAAAwOk/AAAAAAAAAAAA4Ds4h9DLP7YSVFnESy29AAAAAACg6T8AAAAAAAAAAAAQ8Mb7b8w/0iuWxXLs8bwAAAAAAGDpPwAAAAAAAAAAAJDUsD2xzT81sBX3Kv8qvQAAAAAAQOk/AAAAAAAAAAAAEOf/DlPOPzD0QWAnEsI8AAAAAAAg6T8AAAAAAAAAAAAA3eSt9c4/EY67ZRUhyrwAAAAAAADpPwAAAAAAAAAAALCzbByZzz8w3wzK7MsbPQAAAAAAwOg/AAAAAAAAAAAAWE1gOHHQP5FO7RbbnPg8AAAAAACg6D8AAAAAAAAAAABgYWctxNA/6eo8FosYJz0AAAAAAIDoPwAAAAAAAAAAAOgngo4X0T8c8KVjDiEsvQAAAAAAYOg/AAAAAAAAAAAA+KzLXGvRP4EWpffNmis9AAAAAABA6D8AAAAAAAAAAABoWmOZv9E/t71HUe2mLD0AAAAAACDoPwAAAAAAAAAAALgObUUU0j/quka63ocKPQAAAAAA4Oc/AAAAAAAAAAAAkNx88L7SP/QEUEr6nCo9AAAAAADA5z8AAAAAAAAAAABg0+HxFNM/uDwh03riKL0AAAAAAKDnPwAAAAAAAAAAABC+dmdr0z/Id/GwzW4RPQAAAAAAgOc/AAAAAAAAAAAAMDN3UsLTP1y9BrZUOxg9AAAAAABg5z8AAAAAAAAAAADo1SO0GdQ/neCQ7DbkCD0AAAAAAEDnPwAAAAAAAAAAAMhxwo1x1D911mcJzicvvQAAAAAAIOc/AAAAAAAAAAAAMBee4MnUP6TYChuJIC69AAAAAAAA5z8AAAAAAAAAAACgOAeuItU/WcdkgXC+Lj0AAAAAAODmPwAAAAAAAAAAANDIU/d71T/vQF3u7a0fPQAAAAAAwOY/AAAAAAAAAAAAYFnfvdXVP9xlpAgqCwq9MGUAAAAAAAAAAAAAAAAAANF0ngBXnb0qgHBSD///PicKAAAAZAAAAOgDAAAQJwAAoIYBAEBCDwCAlpgAAOH1BRgAAAA1AAAAcQAAAGv////O+///kr///wBBoMcBC6gECgAAAAAAAAAZifTuMGrUAUcAAAAAAAAAAAAAAAAAAABeAAAAXwAAAGAAAABhAAAAYgAAAGMAAABkAAAAZQAAAGYAAABnAAAAaAAAAGkAAABqAAAAawAAAGwAAABtAAAAbgAAAG8AAABwAAAAcQAAAHIAAABzAAAAdAAAAHUAAAB2AAAAdwAAAHgAAAB5AAAAegAAAHsAAAB8AAAAfQAAAH4AAAB/AAAAgAAAAIEAAACCAAAAgwAAAIQAAACFAAAAhgAAAIcAAACIAAAAiQAAAIoAAACLAAAAjAAAAI0AAACOAAAAjwAAAJAAAACRAAAAkgAAAJMAAACUAAAAlQAAAJYAAACXAAAAmAAAAJkAAACaAAAAmwAAAJwAAACdAAAAngAAAJ8AAACgAAAAoQAAAKIAAACjAAAApAAAAKUAAACmAAAApwAAAKgAAACpAAAAqgAAAKsAAACsAAAArQAAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAABeAAAAAAAAAAUAAAAAAAAAAAAAAMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMUAAADGAAAAHG4AAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBlAAAQcAEAAEHIywEL5AUodm9pZCAqZnJhbWUpPDo6PnsgY29uc3Qgc3ogPSAxMiArIEhFQVBVOFtmcmFtZSArIDJdOyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoZXhpdGNvZGUpIGNvbnNvbGUubG9nKCJQQU5JQyIsIGV4aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AACP7ICAAARuYW1lAZ9r0QUABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAhFlbV9kZXBsb3lfaGFuZGxlcgMXZW1famRfY3J5cHRvX2dldF9yYW5kb20EDWVtX3NlbmRfZnJhbWUFEGVtX2NvbnNvbGVfZGVidWcGBGV4aXQHC2VtX3RpbWVfbm93CCBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQkhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkChhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcLMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQNM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA41ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQPGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFBpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxURX193YXNtX2NhbGxfY3RvcnMWD2ZsYXNoX2Jhc2VfYWRkchcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaCmZsYXNoX2luaXQbCGh3X3BhbmljHAhqZF9ibGluax0HamRfZ2xvdx4UamRfYWxsb2Nfc3RhY2tfY2hlY2sfCGpkX2FsbG9jIAdqZF9mcmVlIQ10YXJnZXRfaW5faXJxIhJ0YXJnZXRfZGlzYWJsZV9pcnEjEXRhcmdldF9lbmFibGVfaXJxJBhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmclFGFwcF9nZXRfZGV2aWNlX2NsYXNzJhJkZXZzX3BhbmljX2hhbmRsZXInE2RldnNfZGVwbG95X2hhbmRsZXIoFGpkX2NyeXB0b19nZXRfcmFuZG9tKRBqZF9lbV9zZW5kX2ZyYW1lKhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMisaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcsCmpkX2VtX2luaXQtDWpkX2VtX3Byb2Nlc3MuBWRtZXNnLxRqZF9lbV9mcmFtZV9yZWNlaXZlZDARamRfZW1fZGV2c19kZXBsb3kxEWpkX2VtX2RldnNfdmVyaWZ5MhhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kzG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczQZamRfZW1fZGV2c19lbmFibGVfbG9nZ2luZzUMaHdfZGV2aWNlX2lkNgx0YXJnZXRfcmVzZXQ3DnRpbV9nZXRfbWljcm9zOBJqZF90Y3Bzb2NrX3Byb2Nlc3M5EWFwcF9pbml0X3NlcnZpY2VzOhJkZXZzX2NsaWVudF9kZXBsb3k7FGNsaWVudF9ldmVudF9oYW5kbGVyPAthcHBfcHJvY2Vzcz0HdHhfaW5pdD4PamRfcGFja2V0X3JlYWR5Pwp0eF9wcm9jZXNzQBdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZUEOamRfd2Vic29ja19uZXdCBm9ub3BlbkMHb25lcnJvckQHb25jbG9zZUUJb25tZXNzYWdlRhBqZF93ZWJzb2NrX2Nsb3NlRw5hZ2didWZmZXJfaW5pdEgPYWdnYnVmZmVyX2ZsdXNoSRBhZ2didWZmZXJfdXBsb2FkSg5kZXZzX2J1ZmZlcl9vcEsQZGV2c19yZWFkX251bWJlckwSZGV2c19idWZmZXJfZGVjb2RlTRJkZXZzX2J1ZmZlcl9lbmNvZGVOD2RldnNfY3JlYXRlX2N0eE8Jc2V0dXBfY3R4UApkZXZzX3RyYWNlUQ9kZXZzX2Vycm9yX2NvZGVSGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJTCWNsZWFyX2N0eFQNZGV2c19mcmVlX2N0eFUIZGV2c19vb21WCWRldnNfZnJlZVcRZGV2c2Nsb3VkX3Byb2Nlc3NYF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0WRNkZXZzY2xvdWRfb25fbWV0aG9kWg5kZXZzY2xvdWRfaW5pdFsPZGV2c2RiZ19wcm9jZXNzXBFkZXZzZGJnX3Jlc3RhcnRlZF0VZGV2c2RiZ19oYW5kbGVfcGFja2V0XgtzZW5kX3ZhbHVlc18RdmFsdWVfZnJvbV90YWdfdjBgGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVhDW9ial9nZXRfcHJvcHNiDGV4cGFuZF92YWx1ZWMSZGV2c2RiZ19zdXNwZW5kX2NiZAxkZXZzZGJnX2luaXRlEGV4cGFuZF9rZXlfdmFsdWVmBmt2X2FkZGcPZGV2c21ncl9wcm9jZXNzaAd0cnlfcnVuaQxzdG9wX3Byb2dyYW1qD2RldnNtZ3JfcmVzdGFydGsUZGV2c21ncl9kZXBsb3lfc3RhcnRsFGRldnNtZ3JfZGVwbG95X3dyaXRlbRBkZXZzbWdyX2dldF9oYXNobhVkZXZzbWdyX2hhbmRsZV9wYWNrZXRvDmRlcGxveV9oYW5kbGVycBNkZXBsb3lfbWV0YV9oYW5kbGVycQ9kZXZzbWdyX2dldF9jdHhyDmRldnNtZ3JfZGVwbG95cxNkZXZzbWdyX3NldF9sb2dnaW5ndAxkZXZzbWdyX2luaXR1EWRldnNtZ3JfY2xpZW50X2V2dhBkZXZzX2ZpYmVyX3lpZWxkdxhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb254GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXkQZGV2c19maWJlcl9zbGVlcHobZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsexpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3wRZGV2c19pbWdfZnVuX25hbWV9EmRldnNfaW1nX3JvbGVfbmFtZX4SZGV2c19maWJlcl9ieV9maWR4fxFkZXZzX2ZpYmVyX2J5X3RhZ4ABEGRldnNfZmliZXJfc3RhcnSBARRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYIBDmRldnNfZmliZXJfcnVugwETZGV2c19maWJlcl9zeW5jX25vd4QBCmRldnNfcGFuaWOFARVfZGV2c19pbnZhbGlkX3Byb2dyYW2GAQ9kZXZzX2ZpYmVyX3Bva2WHARNqZF9nY19hbnlfdHJ5X2FsbG9jiAEHZGV2c19nY4kBD2ZpbmRfZnJlZV9ibG9ja4oBEmRldnNfYW55X3RyeV9hbGxvY4sBDmRldnNfdHJ5X2FsbG9jjAELamRfZ2NfdW5waW6NAQpqZF9nY19mcmVljgEOZGV2c192YWx1ZV9waW6PARBkZXZzX3ZhbHVlX3VucGlukAESZGV2c19tYXBfdHJ5X2FsbG9jkQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkgEUZGV2c19hcnJheV90cnlfYWxsb2OTARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OUARVkZXZzX3N0cmluZ190cnlfYWxsb2OVARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJYBD2RldnNfZ2Nfc2V0X2N0eJcBDmRldnNfZ2NfY3JlYXRlmAEPZGV2c19nY19kZXN0cm95mQERZGV2c19nY19vYmpfdmFsaWSaAQtzY2FuX2djX29iapsBEXByb3BfQXJyYXlfbGVuZ3RonAESbWV0aDJfQXJyYXlfaW5zZXJ0nQESZnVuMV9BcnJheV9pc0FycmF5ngEQbWV0aFhfQXJyYXlfcHVzaJ8BFW1ldGgxX0FycmF5X3B1c2hSYW5nZaABEW1ldGhYX0FycmF5X3NsaWNloQERZnVuMV9CdWZmZXJfYWxsb2OiARJwcm9wX0J1ZmZlcl9sZW5ndGijARVtZXRoMF9CdWZmZXJfdG9TdHJpbmekARNtZXRoM19CdWZmZXJfZmlsbEF0pQETbWV0aDRfQnVmZmVyX2JsaXRBdKYBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOnARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWOoARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SpARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSqARVmdW4xX0RldmljZVNjcmlwdF9sb2erARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnStARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcq4BFG1ldGgxX0Vycm9yX19fY3Rvcl9frwEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX7ABGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX7EBD3Byb3BfRXJyb3JfbmFtZbIBEW1ldGgwX0Vycm9yX3ByaW50swEUbWV0aFhfRnVuY3Rpb25fc3RhcnS0ARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbUBEnByb3BfRnVuY3Rpb25fbmFtZbYBDmZ1bjFfTWF0aF9jZWlstwEPZnVuMV9NYXRoX2Zsb29yuAEPZnVuMV9NYXRoX3JvdW5kuQENZnVuMV9NYXRoX2Fic7oBEGZ1bjBfTWF0aF9yYW5kb227ARNmdW4xX01hdGhfcmFuZG9tSW50vAENZnVuMV9NYXRoX2xvZ70BDWZ1bjJfTWF0aF9wb3e+AQ5mdW4yX01hdGhfaWRpdr8BDmZ1bjJfTWF0aF9pbW9kwAEOZnVuMl9NYXRoX2ltdWzBAQ1mdW4yX01hdGhfbWluwgELZnVuMl9taW5tYXjDAQ1mdW4yX01hdGhfbWF4xAESZnVuMl9PYmplY3RfYXNzaWduxQEQZnVuMV9PYmplY3Rfa2V5c8YBE2Z1bjFfa2V5c19vcl92YWx1ZXPHARJmdW4xX09iamVjdF92YWx1ZXPIARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZskBEHByb3BfUGFja2V0X3JvbGXKARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVyywETcHJvcF9QYWNrZXRfc2hvcnRJZMwBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleM0BGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5kzgERcHJvcF9QYWNrZXRfZmxhZ3PPARVwcm9wX1BhY2tldF9pc0NvbW1hbmTQARRwcm9wX1BhY2tldF9pc1JlcG9ydNEBE3Byb3BfUGFja2V0X3BheWxvYWTSARNwcm9wX1BhY2tldF9pc0V2ZW500wEVcHJvcF9QYWNrZXRfZXZlbnRDb2Rl1AEUcHJvcF9QYWNrZXRfaXNSZWdTZXTVARRwcm9wX1BhY2tldF9pc1JlZ0dldNYBE3Byb3BfUGFja2V0X3JlZ0NvZGXXARNtZXRoMF9QYWNrZXRfZGVjb2Rl2AESZGV2c19wYWNrZXRfZGVjb2Rl2QEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFk2gEURHNSZWdpc3Rlcl9yZWFkX2NvbnTbARJkZXZzX3BhY2tldF9lbmNvZGXcARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRl3QEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZd4BFnByb3BfRHNQYWNrZXRJbmZvX25hbWXfARZwcm9wX0RzUGFja2V0SW5mb19jb2Rl4AEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19f4QEXcHJvcF9Ec1JvbGVfaXNDb25uZWN0ZWTiARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTjARFtZXRoMF9Ec1JvbGVfd2FpdOQBEnByb3BfU3RyaW5nX2xlbmd0aOUBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF05gETbWV0aDFfU3RyaW5nX2NoYXJBdOcBFGRldnNfamRfZ2V0X3JlZ2lzdGVy6AEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZOkBEGRldnNfamRfc2VuZF9jbWTqARFkZXZzX2pkX3dha2Vfcm9sZesBFGRldnNfamRfcmVzZXRfcGFja2V07AETZGV2c19qZF9wa3RfY2FwdHVyZe0BE2RldnNfamRfc2VuZF9sb2dtc2fuAQ1oYW5kbGVfbG9nbXNn7wESZGV2c19qZF9zaG91bGRfcnVu8AEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXxARNkZXZzX2pkX3Byb2Nlc3NfcGt08gEUZGV2c19qZF9yb2xlX2NoYW5nZWTzARJkZXZzX2pkX2luaXRfcm9sZXP0ARJkZXZzX2pkX2ZyZWVfcm9sZXP1ARBkZXZzX3NldF9sb2dnaW5n9gEVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz9wEXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3P4ARVkZXZzX2dldF9nbG9iYWxfZmxhZ3P5ARFkZXZzX21hcGxpa2VfaXRlcvoBF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN0+wESZGV2c19tYXBfY29weV9pbnRv/AEMZGV2c19tYXBfc2V0/QEGbG9va3Vw/gETZGV2c19tYXBsaWtlX2lzX21hcP8BG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc4ACEWRldnNfYXJyYXlfaW5zZXJ0gQIIa3ZfYWRkLjGCAhJkZXZzX3Nob3J0X21hcF9zZXSDAg9kZXZzX21hcF9kZWxldGWEAhJkZXZzX3Nob3J0X21hcF9nZXSFAhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldIYCDmRldnNfcm9sZV9zcGVjhwISZGV2c19mdW5jdGlvbl9iaW5kiAIRZGV2c19tYWtlX2Nsb3N1cmWJAg5kZXZzX2dldF9mbmlkeIoCE2RldnNfZ2V0X2ZuaWR4X2NvcmWLAh5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSMAhNkZXZzX2dldF9yb2xlX3Byb3RvjQIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3jgIYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkjwIVZGV2c19nZXRfc3RhdGljX3Byb3RvkAIbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvkQIdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2SAhZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvkwIYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxklAIYZGV2c19tYXBsaWtlX2dldF9ub19iaW5klQIQZGV2c19pbnN0YW5jZV9vZpYCD2RldnNfb2JqZWN0X2dldJcCDGRldnNfc2VxX2dldJgCDGRldnNfYW55X2dldJkCDGRldnNfYW55X3NldJoCDGRldnNfc2VxX3NldJsCDmRldnNfYXJyYXlfc2V0nAIMZGV2c19hcmdfaW50nQIPZGV2c19hcmdfZG91YmxlngIPZGV2c19yZXRfZG91YmxlnwIMZGV2c19yZXRfaW50oAINZGV2c19yZXRfYm9vbKECD2RldnNfcmV0X2djX3B0cqICEWRldnNfYXJnX3NlbGZfbWFwowIRZGV2c19zZXR1cF9yZXN1bWWkAg9kZXZzX2Nhbl9hdHRhY2ilAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlpgIVZGV2c19tYXBsaWtlX3RvX3ZhbHVlpwISZGV2c19yZWdjYWNoZV9mcmVlqAIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbKkCF2RldnNfcmVnY2FjaGVfbWFya191c2VkqgITZGV2c19yZWdjYWNoZV9hbGxvY6sCFGRldnNfcmVnY2FjaGVfbG9va3VwrAIRZGV2c19yZWdjYWNoZV9hZ2WtAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZa4CEmRldnNfcmVnY2FjaGVfbmV4dK8CD2pkX3NldHRpbmdzX2dldLACD2pkX3NldHRpbmdzX3NldLECDmRldnNfbG9nX3ZhbHVlsgIPZGV2c19zaG93X3ZhbHVlswIQZGV2c19zaG93X3ZhbHVlMLQCDWNvbnN1bWVfY2h1bmu1Ag1zaGFfMjU2X2Nsb3NltgIPamRfc2hhMjU2X3NldHVwtwIQamRfc2hhMjU2X3VwZGF0ZbgCEGpkX3NoYTI1Nl9maW5pc2i5AhRqZF9zaGEyNTZfaG1hY19zZXR1cLoCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaLsCDmpkX3NoYTI1Nl9oa2RmvAIOZGV2c19zdHJmb3JtYXS9Ag5kZXZzX2lzX3N0cmluZ74CDmRldnNfaXNfbnVtYmVyvwIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjAAhNkZXZzX2J1aWx0aW5fc3RyaW5nwQIUZGV2c19zdHJpbmdfdnNwcmludGbCAhNkZXZzX3N0cmluZ19zcHJpbnRmwwIVZGV2c19zdHJpbmdfZnJvbV91dGY4xAIUZGV2c192YWx1ZV90b19zdHJpbmfFAhBidWZmZXJfdG9fc3RyaW5nxgIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZMcCEmRldnNfc3RyaW5nX2NvbmNhdMgCEmRldnNfcHVzaF90cnlmcmFtZckCEWRldnNfcG9wX3RyeWZyYW1lygIPZGV2c19kdW1wX3N0YWNrywITZGV2c19kdW1wX2V4Y2VwdGlvbswCCmRldnNfdGhyb3fNAhJkZXZzX3Byb2Nlc3NfdGhyb3fOAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LPAhlkZXZzX3Rocm93X2ludGVybmFsX2Vycm9y0AIWZGV2c190aHJvd19yYW5nZV9lcnJvctECHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvctICGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y0wIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh01AIYZGV2c190aHJvd190b29fYmlnX2Vycm9y1QIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY9YCD3RzYWdnX2NsaWVudF9ldtcCCmFkZF9zZXJpZXPYAg10c2FnZ19wcm9jZXNz2QIKbG9nX3Nlcmllc9oCE3RzYWdnX2hhbmRsZV9wYWNrZXTbAhRsb29rdXBfb3JfYWRkX3Nlcmllc9wCCnRzYWdnX2luaXTdAhZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl3gITZGV2c192YWx1ZV9mcm9tX2ludN8CFGRldnNfdmFsdWVfZnJvbV9ib29s4AIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLhAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZeICEWRldnNfdmFsdWVfdG9faW504wISZGV2c192YWx1ZV90b19ib29s5AIOZGV2c19pc19idWZmZXLlAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZeYCEGRldnNfYnVmZmVyX2RhdGHnAhNkZXZzX2J1ZmZlcmlzaF9kYXRh6AIUZGV2c192YWx1ZV90b19nY19vYmrpAg1kZXZzX2lzX2FycmF56gIRZGV2c192YWx1ZV90eXBlb2brAg9kZXZzX2lzX251bGxpc2jsAhJkZXZzX3ZhbHVlX2llZWVfZXHtAh5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGPuAhJkZXZzX2ltZ19zdHJpZHhfb2vvAhJkZXZzX2R1bXBfdmVyc2lvbnPwAgtkZXZzX3ZlcmlmefECEWRldnNfZmV0Y2hfb3Bjb2Rl8gIOZGV2c192bV9yZXN1bWXzAhFkZXZzX3ZtX3NldF9kZWJ1Z/QCGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHP1AhhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnT2Ag9kZXZzX3ZtX3N1c3BlbmT3AhZkZXZzX3ZtX3NldF9icmVha3BvaW50+AIUZGV2c192bV9leGVjX29wY29kZXP5AhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkePoCEWRldnNfaW1nX2dldF91dGY4+wIUZGV2c19nZXRfc3RhdGljX3V0Zjj8Ag9kZXZzX3ZtX3JvbGVfb2v9AhRkZXZzX3ZhbHVlX2J1ZmZlcmlzaP4CDGV4cHJfaW52YWxpZP8CFGV4cHJ4X2J1aWx0aW5fb2JqZWN0gAMLc3RtdDFfY2FsbDCBAwtzdG10Ml9jYWxsMYIDC3N0bXQzX2NhbGwygwMLc3RtdDRfY2FsbDOEAwtzdG10NV9jYWxsNIUDC3N0bXQ2X2NhbGw1hgMLc3RtdDdfY2FsbDaHAwtzdG10OF9jYWxsN4gDC3N0bXQ5X2NhbGw4iQMSc3RtdDJfaW5kZXhfZGVsZXRligMMc3RtdDFfcmV0dXJuiwMJc3RtdHhfam1wjAMMc3RtdHgxX2ptcF96jQMKZXhwcjJfYmluZI4DEmV4cHJ4X29iamVjdF9maWVsZI8DEnN0bXR4MV9zdG9yZV9sb2NhbJADE3N0bXR4MV9zdG9yZV9nbG9iYWyRAxJzdG10NF9zdG9yZV9idWZmZXKSAwlleHByMF9pbmaTAxBleHByeF9sb2FkX2xvY2FslAMRZXhwcnhfbG9hZF9nbG9iYWyVAwtleHByMV91cGx1c5YDC2V4cHIyX2luZGV4lwMPc3RtdDNfaW5kZXhfc2V0mAMUZXhwcngxX2J1aWx0aW5fZmllbGSZAxJleHByeDFfYXNjaWlfZmllbGSaAxFleHByeDFfdXRmOF9maWVsZJsDEGV4cHJ4X21hdGhfZmllbGScAw5leHByeF9kc19maWVsZJ0DD3N0bXQwX2FsbG9jX21hcJ4DEXN0bXQxX2FsbG9jX2FycmF5nwMSc3RtdDFfYWxsb2NfYnVmZmVyoAMRZXhwcnhfc3RhdGljX3JvbGWhAxNleHByeF9zdGF0aWNfYnVmZmVyogMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nowMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ6QDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ6UDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbqYDDWV4cHJ4X2xpdGVyYWynAxFleHByeF9saXRlcmFsX2Y2NKgDEGV4cHJ4X3JvbGVfcHJvdG+pAxFleHByM19sb2FkX2J1ZmZlcqoDDWV4cHIwX3JldF92YWyrAwxleHByMV90eXBlb2asAwpleHByMF9udWxsrQMNZXhwcjFfaXNfbnVsbK4DCmV4cHIwX3RydWWvAwtleHByMF9mYWxzZbADDWV4cHIxX3RvX2Jvb2yxAwlleHByMF9uYW6yAwlleHByMV9hYnOzAw1leHByMV9iaXRfbm90tAMMZXhwcjFfaXNfbmFutQMJZXhwcjFfbmVntgMJZXhwcjFfbm90twMMZXhwcjFfdG9faW50uAMJZXhwcjJfYWRkuQMJZXhwcjJfc3ViugMJZXhwcjJfbXVsuwMJZXhwcjJfZGl2vAMNZXhwcjJfYml0X2FuZL0DDGV4cHIyX2JpdF9vcr4DDWV4cHIyX2JpdF94b3K/AxBleHByMl9zaGlmdF9sZWZ0wAMRZXhwcjJfc2hpZnRfcmlnaHTBAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZMIDCGV4cHIyX2VxwwMIZXhwcjJfbGXEAwhleHByMl9sdMUDCGV4cHIyX25lxgMVc3RtdDFfdGVybWluYXRlX2ZpYmVyxwMUc3RtdHgyX3N0b3JlX2Nsb3N1cmXIAxNleHByeDFfbG9hZF9jbG9zdXJlyQMSZXhwcnhfbWFrZV9jbG9zdXJlygMQZXhwcjFfdHlwZW9mX3N0cssDDGV4cHIwX25vd19tc8wDFmV4cHIxX2dldF9maWJlcl9oYW5kbGXNAxBzdG10Ml9jYWxsX2FycmF5zgMJc3RtdHhfdHJ5zwMNc3RtdHhfZW5kX3RyedADC3N0bXQwX2NhdGNo0QMNc3RtdDBfZmluYWxsedIDC3N0bXQxX3Rocm930wMOc3RtdDFfcmVfdGhyb3fUAxBzdG10eDFfdGhyb3dfam1w1QMOc3RtdDBfZGVidWdnZXLWAwlleHByMV9uZXfXAxFleHByMl9pbnN0YW5jZV9vZtgDD2RldnNfdm1fcG9wX2FyZ9kDE2RldnNfdm1fcG9wX2FyZ191MzLaAxNkZXZzX3ZtX3BvcF9hcmdfaTMy2wMWZGV2c192bV9wb3BfYXJnX2J1ZmZlctwDEmpkX2Flc19jY21fZW5jcnlwdN0DEmpkX2Flc19jY21fZGVjcnlwdN4DDEFFU19pbml0X2N0eN8DD0FFU19FQ0JfZW5jcnlwdOADEGpkX2Flc19zZXR1cF9rZXnhAw5qZF9hZXNfZW5jcnlwdOIDEGpkX2Flc19jbGVhcl9rZXnjAwtqZF93c3NrX25ld+QDFGpkX3dzc2tfc2VuZF9tZXNzYWdl5QMTamRfd2Vic29ja19vbl9ldmVudOYDB2RlY3J5cHTnAw1qZF93c3NrX2Nsb3Nl6AMQamRfd3Nza19vbl9ldmVudOkDCnNlbmRfZW1wdHnqAxJ3c3NraGVhbHRoX3Byb2Nlc3PrAxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZewDFHdzc2toZWFsdGhfcmVjb25uZWN07QMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V07gMPc2V0X2Nvbm5fc3RyaW5n7wMRY2xlYXJfY29ubl9zdHJpbmfwAw93c3NraGVhbHRoX2luaXTxAxN3c3NrX3B1Ymxpc2hfdmFsdWVz8gMQd3Nza19wdWJsaXNoX2JpbvMDEXdzc2tfaXNfY29ubmVjdGVk9AMTd3Nza19yZXNwb25kX21ldGhvZPUDHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemX2AxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xl9wMPcm9sZW1ncl9wcm9jZXNz+AMQcm9sZW1ncl9hdXRvYmluZPkDFXJvbGVtZ3JfaGFuZGxlX3BhY2tldPoDFGpkX3JvbGVfbWFuYWdlcl9pbml0+wMYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVk/AMNamRfcm9sZV9hbGxvY/0DEGpkX3JvbGVfZnJlZV9hbGz+AxZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5k/wMSamRfcm9sZV9ieV9zZXJ2aWNlgAQTamRfY2xpZW50X2xvZ19ldmVudIEEE2pkX2NsaWVudF9zdWJzY3JpYmWCBBRqZF9jbGllbnRfZW1pdF9ldmVudIMEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkhAQQamRfZGV2aWNlX2xvb2t1cIUEGGpkX2RldmljZV9sb29rdXBfc2VydmljZYYEE2pkX3NlcnZpY2Vfc2VuZF9jbWSHBBFqZF9jbGllbnRfcHJvY2Vzc4gEDmpkX2RldmljZV9mcmVliQQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSKBA9qZF9kZXZpY2VfYWxsb2OLBA9qZF9jdHJsX3Byb2Nlc3OMBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSNBAxqZF9jdHJsX2luaXSOBBNqZF9zZXR0aW5nc19nZXRfYmlujwQNamRfZnN0b3JfaW5pdJAEE2pkX3NldHRpbmdzX3NldF9iaW6RBAtqZF9mc3Rvcl9nY5IED3JlY29tcHV0ZV9jYWNoZZMEFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2WUBBdqZF9zZXR0aW5nc193cml0ZV9sYXJnZZUEFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2WWBA1qZF9pcGlwZV9vcGVulwQWamRfaXBpcGVfaGFuZGxlX3BhY2tldJgEDmpkX2lwaXBlX2Nsb3NlmQQSamRfbnVtZm10X2lzX3ZhbGlkmgQVamRfbnVtZm10X3dyaXRlX2Zsb2F0mwQTamRfbnVtZm10X3dyaXRlX2kzMpwEEmpkX251bWZtdF9yZWFkX2kzMp0EFGpkX251bWZtdF9yZWFkX2Zsb2F0ngQRamRfb3BpcGVfb3Blbl9jbWSfBBRqZF9vcGlwZV9vcGVuX3JlcG9ydKAEFmpkX29waXBlX2hhbmRsZV9wYWNrZXShBBFqZF9vcGlwZV93cml0ZV9leKIEEGpkX29waXBlX3Byb2Nlc3OjBBRqZF9vcGlwZV9jaGVja19zcGFjZaQEDmpkX29waXBlX3dyaXRlpQQOamRfb3BpcGVfY2xvc2WmBA1qZF9xdWV1ZV9wdXNopwQOamRfcXVldWVfZnJvbnSoBA5qZF9xdWV1ZV9zaGlmdKkEDmpkX3F1ZXVlX2FsbG9jqgQNamRfcmVzcG9uZF91OKsEDmpkX3Jlc3BvbmRfdTE2rAQOamRfcmVzcG9uZF91MzKtBBFqZF9yZXNwb25kX3N0cmluZ64EF2pkX3NlbmRfbm90X2ltcGxlbWVudGVkrwQLamRfc2VuZF9wa3SwBB1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbLEEF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVysgQZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldLMEFGpkX2FwcF9oYW5kbGVfcGFja2V0tAQVamRfYXBwX2hhbmRsZV9jb21tYW5ktQQTamRfYWxsb2NhdGVfc2VydmljZbYEEGpkX3NlcnZpY2VzX2luaXS3BA5qZF9yZWZyZXNoX25vd7gEGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWS5BBRqZF9zZXJ2aWNlc19hbm5vdW5jZboEF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1luwQQamRfc2VydmljZXNfdGlja7wEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ70EGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlvgQSYXBwX2dldF9md192ZXJzaW9uvwQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZcAEDWpkX2hhc2hfZm52MWHBBAxqZF9kZXZpY2VfaWTCBAlqZF9yYW5kb23DBAhqZF9jcmMxNsQEDmpkX2NvbXB1dGVfY3JjxQQOamRfc2hpZnRfZnJhbWXGBAxqZF93b3JkX21vdmXHBA5qZF9yZXNldF9mcmFtZcgEEGpkX3B1c2hfaW5fZnJhbWXJBA1qZF9wYW5pY19jb3JlygQTamRfc2hvdWxkX3NhbXBsZV9tc8sEEGpkX3Nob3VsZF9zYW1wbGXMBAlqZF90b19oZXjNBAtqZF9mcm9tX2hleM4EDmpkX2Fzc2VydF9mYWlszwQHamRfYXRvadAEC2pkX3ZzcHJpbnRm0QQPamRfcHJpbnRfZG91Ymxl0gQKamRfc3ByaW50ZtMEEmpkX2RldmljZV9zaG9ydF9pZNQEDGpkX3NwcmludGZfYdUEC2pkX3RvX2hleF9h1gQUamRfZGV2aWNlX3Nob3J0X2lkX2HXBAlqZF9zdHJkdXDYBA5qZF9qc29uX2VzY2FwZdkEE2pkX2pzb25fZXNjYXBlX2NvcmXaBAlqZF9tZW1kdXDbBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVl3AQWZG9fcHJvY2Vzc19ldmVudF9xdWV1Zd0EEWpkX3NlbmRfZXZlbnRfZXh03gQKamRfcnhfaW5pdN8EFGpkX3J4X2ZyYW1lX3JlY2VpdmVk4AQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2vhBA9qZF9yeF9nZXRfZnJhbWXiBBNqZF9yeF9yZWxlYXNlX2ZyYW1l4wQRamRfc2VuZF9mcmFtZV9yYXfkBA1qZF9zZW5kX2ZyYW1l5QQKamRfdHhfaW5pdOYEB2pkX3NlbmTnBBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3Jj6AQPamRfdHhfZ2V0X2ZyYW1l6QQQamRfdHhfZnJhbWVfc2VudOoEC2pkX3R4X2ZsdXNo6wQQX19lcnJub19sb2NhdGlvbuwEDF9fZnBjbGFzc2lmee0EBWR1bW157gQIX19tZW1jcHnvBAdtZW1tb3Zl8AQGbWVtc2V08QQKX19sb2NrZmlsZfIEDF9fdW5sb2NrZmlsZfMEBmZmbHVzaPQEBGZtb2T1BA1fX0RPVUJMRV9CSVRT9gQMX19zdGRpb19zZWVr9wQNX19zdGRpb193cml0ZfgEDV9fc3RkaW9fY2xvc2X5BAhfX3RvcmVhZPoECV9fdG93cml0ZfsECV9fZndyaXRlePwEBmZ3cml0Zf0EFF9fcHRocmVhZF9tdXRleF9sb2Nr/gQWX19wdGhyZWFkX211dGV4X3VubG9ja/8EBl9fbG9ja4AFCF9fdW5sb2NrgQUOX19tYXRoX2Rpdnplcm+CBQpmcF9iYXJyaWVygwUOX19tYXRoX2ludmFsaWSEBQNsb2eFBQV0b3AxNoYFBWxvZzEwhwUHX19sc2Vla4gFBm1lbWNtcIkFCl9fb2ZsX2xvY2uKBQxfX29mbF91bmxvY2uLBQxfX21hdGhfeGZsb3eMBQxmcF9iYXJyaWVyLjGNBQxfX21hdGhfb2Zsb3eOBQxfX21hdGhfdWZsb3ePBQRmYWJzkAUDcG93kQUFdG9wMTKSBQp6ZXJvaW5mbmFukwUIY2hlY2tpbnSUBQxmcF9iYXJyaWVyLjKVBQpsb2dfaW5saW5llgUKZXhwX2lubGluZZcFC3NwZWNpYWxjYXNlmAUNZnBfZm9yY2VfZXZhbJkFBXJvdW5kmgUGc3RyY2hymwULX19zdHJjaHJudWycBQZzdHJjbXCdBQZzdHJsZW6eBQdfX3VmbG93nwUHX19zaGxpbaAFCF9fc2hnZXRjoQUHaXNzcGFjZaIFBnNjYWxibqMFCWNvcHlzaWdubKQFB3NjYWxibmylBQ1fX2ZwY2xhc3NpZnlspgUFZm1vZGynBQVmYWJzbKgFC19fZmxvYXRzY2FuqQUIaGV4ZmxvYXSqBQhkZWNmbG9hdKsFB3NjYW5leHCsBQZzdHJ0b3itBQZzdHJ0b2SuBRJfX3dhc2lfc3lzY2FsbF9yZXSvBQhkbG1hbGxvY7AFBmRsZnJlZbEFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZbIFBHNicmuzBQhfX2FkZHRmM7QFCV9fYXNobHRpM7UFB19fbGV0ZjK2BQdfX2dldGYytwUIX19kaXZ0ZjO4BQ1fX2V4dGVuZGRmdGYyuQUNX19leHRlbmRzZnRmMroFC19fZmxvYXRzaXRmuwUNX19mbG9hdHVuc2l0ZrwFDV9fZmVfZ2V0cm91bmS9BRJfX2ZlX3JhaXNlX2luZXhhY3S+BQlfX2xzaHJ0aTO/BQhfX211bHRmM8AFCF9fbXVsdGkzwQUJX19wb3dpZGYywgUIX19zdWJ0ZjPDBQxfX3RydW5jdGZkZjLEBQtzZXRUZW1wUmV0MMUFC2dldFRlbXBSZXQwxgUJc3RhY2tTYXZlxwUMc3RhY2tSZXN0b3JlyAUKc3RhY2tBbGxvY8kFHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnTKBRVlbXNjcmlwdGVuX3N0YWNrX2luaXTLBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlzAUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZc0FGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZM4FDGR5bkNhbGxfamlqac8FFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnQBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHOBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 26056;
var ___stop_em_js = Module['___stop_em_js'] = 26796;



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
