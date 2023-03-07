
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABsoKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf39/f38AYAF8AXxgBX9+fn5+AGAFf39/f38Bf2ACf38BfGABfgF/YAN/fn8BfmAAAX5gAn98AGABfAF/YAF/AXxgBH9+fn8AYAZ/f39/f38AYAJ/fgBgAnx8AXxgAnx/AXxgBH5+fn4Bf2AAAXxgAX8BfmADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBfmACf3wBfGACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C44WAgAAXA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX2xvYWQAAgNlbnYFYWJvcnQABwNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgAAA2VudhFlbV9kZXBsb3lfaGFuZGxlcgAAA2VudhdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQACA2Vudg1lbV9zZW5kX2ZyYW1lAAADZW52EGVtX2NvbnNvbGVfZGVidWcAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwAbA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAFA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawANA+GFgIAA3wUHCAEABwcHAAAHBAAIBwccAAACAwIABwcCBAMDAwAAEQcRBwcDBgcCBwcDCQUFBQUHAAgFFh0KDQUCBgMGAAACAgACBgAAAAIBBgUFAQAHBgYAAAAHBAMEAgICCAMAAAYAAwICAgADAwMDBQAAAAIBAAUABQUDAgIDAgIDBAMDAwUCCAADAQEAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAQEAAAAAAAAAAAAAAAAAAAIAAAACAAABAQEBAQEBAQEBAQEBAQAKAAICAAEBAQABAAABAAAACgABAgABAgMEBQECAAACAAAIAwUKAgICAAYKAwkDAQYFAwYJBgYFBgUDBgYJDQYDAwUFAwMDAwYFBgYGBgYGAQMOEgICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgAeHwMEBQIGBgYBAQYGCgEDAgIBAAoGBgEGBgEGBAYCAAICBQASAgIGDgMDAwMFBQMDAwQEBQUBAwADAwQCAAMCBQAEBQUDBgEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAQEBAQIEBAEKDQICAAAHCQMBAwcBAAAIAAIGAAcFAwgJBAQEAAACBwADBwcEAQIBAA8DCQcAAAQAAgcEBwQEAwMDBQUHBQcHAwMFCAUAAAQgAQMOAwMACQcDBQQDBAAEAwMDAwQEBQUAAAAEBAcHBwcEBwcHCAgIBwQEAxEIAwAEAQAJAQMDAQMGBAkhCRcDAw8EAwcHBgcEBAgABAQHCQcIAAcIEwQFBQUEAAQYIhAFBAQEBQkEBAAAFAsLCxMLEAUIByMLFBQLGBMPDwskJSYnCwMDAwQEFwQEGQwVKAwpBhYqKwYOBAQACAQMFRoaDBIsAgIICBUMDBkMLQAICAAECAcICAguDS8Eh4CAgAABcAHQAdABBYaAgIAAAQGAAoACBt2AgIAADn8BQZDrBQt/AUEAC38BQQALfwFBAAt/AEHA0wELfwBBr9QBC38AQfnVAQt/AEH11gELfwBB8dcBC38AQcHYAQt/AEHi2AELfwBB59oBC38AQcDTAQt/AEHd2wELB5uGgIAAJAZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAXBm1hbGxvYwDUBRZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AkAUZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUA1QUaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAsCmpkX2VtX2luaXQALQ1qZF9lbV9wcm9jZXNzAC4UamRfZW1fZnJhbWVfcmVjZWl2ZWQAMBFqZF9lbV9kZXZzX2RlcGxveQAxEWpkX2VtX2RldnNfdmVyaWZ5ADIYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADMbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADQZamRfZW1fZGV2c19lbmFibGVfbG9nZ2luZwA1Fl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBhxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwcaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCBRfX2VtX2pzX19lbV90aW1lX25vdwMJIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwoZX19lbV9qc19fZW1fY29uc29sZV9kZWJ1ZwMLBmZmbHVzaACYBRVlbXNjcmlwdGVuX3N0YWNrX2luaXQA7wUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQDwBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAPEFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZADyBQlzdGFja1NhdmUA6wUMc3RhY2tSZXN0b3JlAOwFCnN0YWNrQWxsb2MA7QUcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudADuBQ1fX3N0YXJ0X2VtX2pz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gICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDRAiADQShqIAAgBBC3AiADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQZgtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEJEIkCIAFqIQIMAQsgACACQQBBABCJAiABaiECCyADQcAAaiQAIAIL5AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCZAiIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEPMCIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUEjSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEGI2AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEP0CDg0BBAsFCQYDBwsICgIACwsgAUEDNgIAIAFBAjoACgwLCyABQQA2AgAgAUECOgAKDAoLIAFBBjoACiABIAIpAwA3AgAMCQsgAUECOgAKIAMgAikDADcDCCABQQFBAiAAIANBCGoQ9gIbNgIADAgLIAFBAToACiADIAIpAwA3AxAgASAAIANBEGoQ9AI5AgAMBwsgAUHRADoACiACKAIAIQIgASAENgIAIAEgAi8BCEGAgICAeHI2AgQMBgsgASAENgIAIAFBMDoACiADIAIpAwA3AxggASAAIANBGGpBABBiNgIEDAULIAEgBDYC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ACEEAkAgAC0AQ0F/aiIFRQ0AIABBABCtAiEECyAEIgRBH3UgAnEgBGoiBEEAIARBAEobIQQgAiEGAkAgBUECSQ0AIAIhBiAAQeAAaikDAFANACAAQQEQrQIhBgsCQCAAIAYiBkEfdSACcSAGaiIGIAIgBiACSBsiAiAEIAIgBCACSBsiBGsiBhCUASICRQ0AIAIoAgwgAygCDCAEQQN0aiAGQQN0EJMFGgsgACACELICIAFBIGokAAsTACAAIAAgAEEAEK0CEJUBELICC4oBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMgAkACQAJAIAEgA0EYahD3Ag0AIAMgAykDIDcDECADQShqIAFBEiADQRBqEOQCDAELIAMgAykDIDcDCCABIANBCGogA0EoahD5AkUNACAAIAMoAigQ8QIMAQsgAEIANwMACyADQTBqJAALnQECAn8BfiMAQTBrIgEkACABIAApA1AiAzcDECABIAM3AyACQAJAIAAgAUEQahD3Ag0AIAEgASkDIDcDCCABQShqIABBEiABQQhqEOQCQQAhAgwBCyABIAEpAyA3AwAgACABIAFBKGoQ+QIhAgsCQCACIgJFDQAgAUEYaiAAIAIgASgCKBDUAiAAKAKsASABKQMYNwMgCyABQTBqJAALygECBX8BfiMAQTBrIgEkACABIAApA1AiBjcDGCABIAY3AyACQAJAIAAgAUEYahD4Ag0AIAEgASkDIDcDECABQShqIABBqhwgAUEQahDlAkEAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEPkCIQILAkAgAiIDRQ0AIABBABCtAiECIABBARCtAiEEIABBAhCtAiEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQlQUaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQ+AINACABIAEpA1A3AzAgAUHYAGogAEGqHCABQTBqEOUCQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEPkCIQILAkAgAiIDRQ0AIABBABCtAiEEIAEgAEHgAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDOAkUNACABIAEpA0A3AwAgACABIAFB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CyADIAIpAwA3AwggACABQfsgIANBCGoQ5QIMAQsgACABIAEoAqABIARB//8DcRCUAiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEIoCEJIBEPMCIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCQASADQdAAakH7ABDRAiADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQqQIgASgCoAEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEJICIAMgACkDADcDECABIANBEGoQkQELIANB8ABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQmQIiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADEOQCDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BoM8BTg0CIABBoOcAIAFBA3RqLwEAENECDAELIAAgASgApAEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQYYUQfg8QThB9C0Q9QQAC+MBAgJ/AX4jAEHQAGsiASQAIAEgAEHYAGopAwA3A0ggASAAQeAAaikDACIDNwMoIAEgAzcDQAJAIAFBKGoQ/gINACABQThqIABB3hoQ4wILIAEgASkDSDcDICABQThqIAAgAUEgahDVAiABIAEpAzgiAzcDSCABIAM3AxggACABQRhqEJABIAEgASkDSDcDEAJAIAAgAUEQaiABQThqENACIgJFDQAgAUEwaiAAIAIgASgCOEEBEIECIAAoAqwBIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQkQEgAUHQAGokAAuFAQECfyMAQTBrIgEkACABIABB2ABqKQMANwMoIAEgAEHgAGopAwA3AyAgAEECEK0CIQIgASABKQMgNwMIAkAgAUEIahD+Ag0AIAFBGGogAEHiHBDjAgsgASABKQMoNwMAIAFBEGogACABIAJBARCHAiAAKAKsASABKQMQNwMgIAFBMGokAAtaAgF/AX4jAEEQayIBJAAgASAAQdgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCrAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ9AKbEK8CCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHYAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAqwBIAI3AyAMAQsgASABKQMINwMAIAAgACABEPQCnBCvAgsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABB2ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKsASACNwMgDAELIAEgASkDCDcDACAAIAAgARD0AhC+BRCvAgsgAUEQaiQAC7oBAwJ/AX4BfCMAQSBrIgEkACABIABB2ABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASABKQMYNwMQDAELIAFBEGpBACACaxDxAgsgACgCrAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQ9AIiBEQAAAAAAAAAAGNFDQAgACAEmhCvAgwBCyAAKAKsASABKQMYNwMgCyABQSBqJAALFQAgABDpBLhEAAAAAAAA8D2iEK8CC2QBBX8CQAJAIABBABCtAiIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEOkEIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQsAILEQAgACAAQQAQrgIQqQUQrwILGAAgACAAQQAQrgIgAEEBEK4CELUFEK8CCy4BA38gAEEAEK0CIQFBACECAkAgAEEBEK0CIgNFDQAgASADbSECCyAAIAIQsAILLgEDfyAAQQAQrQIhAUEAIQICQCAAQQEQrQIiA0UNACABIANvIQILIAAgAhCwAgsWACAAIABBABCtAiAAQQEQrQJsELACCwkAIABBARDHAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHYAGopAwA3AyggAiAAQeAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahD1AiEDIAIgAikDIDcDECAAIAJBEGoQ9QIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKsASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEPQCIQYgAiACKQMgNwMAIAAgAhD0AiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAqwBQQApA/BuNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCrAEgASkDADcDICACQTBqJAALCQAgAEEAEMcBC5MBAgN/AX4jAEEwayIBJAAgASAAQdgAaikDADcDKCABIABB4ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahD+Ag0AIAEgASkDKDcDECAAIAFBEGoQnQIhAiABIAEpAyA3AwggACABQQhqEKECIgNFDQAgAkUNACAAIAIgAxCLAgsgACgCrAEgASkDKDcDICABQTBqJAALCQAgAEEBEMsBC5oBAgN/AX4jAEEwayICJAAgAiAAQdgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahChAiIDRQ0AIABBABCUASIERQ0AIAJBIGogAEEIIAQQ8wIgAiACKQMgNwMQIAAgAkEQahCQASAAIAMgBCABEI8CIAIgAikDIDcDCCAAIAJBCGoQkQEgACgCrAEgAikDIDcDIAsgAkEwaiQACwkAIABBABDLAQvjAQIDfwF+IwBBwABrIgEkACABIABB2ABqKQMAIgQ3AzggASAAQeAAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahD7AiICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqEOQCDAELIAEgASkDMDcDGAJAIAAgAUEYahChAiIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQ5AIMAQsgAiADNgIEIAAoAqwBIAEpAzg3AyALIAFBwABqJAALvwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqEOQCQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAEgAi8BEhCRA0UNACAAIAIvARI2AgAgAEECNgIEDAELIABCADcDAAsgA0Eg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QRBrIgIkACACQQhqIABBCCABEPMCIAAoAqwBIAIpAwg3AyAgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1AiBDcDCCABIAQ3AxgCQAJAIAAgAUEIahD7AiICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABB5jJBABDhAkEAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAqwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzIBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahD9AiEBIAJBEGokACABQX5qQQRJC00BAX8CQCACQSRJDQAgAEIANwMADwsCQCABIAIQigIiA0Hg4gBrQQxtQSNLDQAgAEEANgIEIAAgAkHgAGo2AgAPCyAAIAFBCCADEPMCC/8BAQJ/IAIhAwNAAkAgAyICQeDiAGtBDG0iA0EjSw0AAkAgASADEIoCIgJB4OIAa0EMbUEjSw0AIABBADYCBCAAIANB4ABqNgIADwsgACABQQggAhDzAg8LAkAgAiABKACkASIDIAMoAmBqayADLwEOQQR0Tw0AIABCADcDAA8LAkACQCACDQBBACEDDAELIAItAANBD3EhAwsCQAJAIANBfGoOBgEAAAAAAQALQZ7WAEGIO0G8CEGIKxD1BAALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQeDiAGtBDG1BJEkNAQsLIAAgAUEIIAIQ8wILJAACQCABLQAUQQpJDQAgASgCCBAiCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECILIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyAC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AX8jAEEgayIDJAAgA0EYaiACEPADIANBEGogAhDwAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQqAIgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEPADIAJBIGogARDwAyACQRhqIAEQ8AMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCpAiACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDwAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAFyIgQQgwMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIYBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDwAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgAJyIgQQgwMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIYBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpgILIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDwAyADIAMpAyA3AyggAigCTCEEIAMgAigCpAE2AhwCQAJAIANBHGogBEGAgANyIgQQgwMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIYBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQpgILIANBwABqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgwMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIYBCyACQQAQigIhBCADIAMpAxA3AwAgACACIAQgAxCkAiADQSBqJAALjgEBAn8jAEEgayIDJAAgAigCTCEEIAMgAigCpAE2AgwCQAJAIANBDGogBEGAgAFyIgQQgwMNACADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsCQCADKQMQQgBSDQAgA0EYaiACQfoAEIYBCyACQRUQigIhBCADIAMpAxA3AwAgACACIAQgAxCkAiADQSBqJAALTQEDfyMAQRBrIgIkAAJAIAEgAUECEIoCEJIBIgMNACABQRAQVgsgASgCrAEhBCACQQhqIAFBCCADEPMCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARDxAyIDEJQBIgQNACABIANBA3RBEGoQVgsgASgCrAEhAyACQQhqIAFBCCAEEPMCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDxAyIDEJUBIgQNACABIANBDGoQVgsgASgCrAEhAyACQQhqIAFBCCAEEPMCIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCGASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2kBAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBBCDAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhgELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAkwhBCADIAIoAqQBNgIEAkACQCADQQRqIARBgIABciIEEIMDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCGAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCTCEEIAMgAigCpAE2AgQCQAJAIANBBGogBEGAgAJyIgQQgwMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIYBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJMIQQgAyACKAKkATYCBAJAAkAgA0EEaiAEQYCAA3IiBBCDAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQhgELIANBEGokAAs5AQF/AkAgAigCTCIDIAIoAKQBQSRqKAIAQQR2SQ0AIAAgAkH4ABCGAQ8LIAAgAzYCACAAQQM2AgQLDAAgACACKAJMEPECC0MBAn8CQCACKAJMIgMgAigApAEiBEE0aigCAEEDdk8NACAAIAQgBCgCMGogA0EDdGopAAA3AwAPCyAAIAJB9wAQhgELWQECfyMAQRBrIgMkAAJAAkAgAigApAFBPGooAgBBA3YgAigCTCIESw0AIANBCGogAkH5ABCGASAAQgA3AwAMAQsgACACQQggAiAEEJwCEPMCCyADQRBqJAALXwEDfyMAQRBrIgMkACACEPEDIQQgAhDxAyEFIANBCGogAkECEPMDAkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBLCyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhDwAyADIAMpAwg3AwAgACACIAMQ/QIQ8QIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhDwAyAAQeDuAEHo7gAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA+BuNwMACw0AIABBACkD6G43AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ8AMgAyADKQMINwMAIAAgAiADEPYCEPICIANBEGokAAsNACAAQQApA/BuNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACEPADAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEPQCIgREAAAAAAAAAABjRQ0AIAAgBJoQ8AIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkD2G43AwAMAgsgAEEAIAJrEPECDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhDyA0F/cxDxAgsyAQF/IwBBEGsiAyQAIANBCGogAhDwAyAAIAMoAgxFIAMoAghBAkZxEPICIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhDwAwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxD0ApoQ8AIMAQsCQCADKAIIIgJBgICAgHhH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4ENkIAJEAAAAAAAA4ENjchsiAplEAAAAAAAA4ENjRQ0AIAAgArA3AAAPCyAAQoCAgICAgICAgH83AAAPCyAAIAK2OAAADwsgACACOQAADwtBgICAgHghAQJAIAJEAAAAAAAA4MFjDQBB/////wchASACRAAAwP///99BZA0AAkACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgAqohAQwBC0GAgICAeCEBCyABIQELIAAgAyABEL0EC/gBAAJAIAFBCEkNACAAIAEgArcQvAQPCwJAAkACQAJAAkACQAJAAkACQCABDggIAAECAwQFBgcLIAAgAkH//wMgAkH//wNIGyIBQQAgAUEAShs7AAAPCyAAIAJBACACQQBKGzYAAA8LIAAgAkEAIAJBAEobrTcAAA8LIAAgAkH/ACACQf8ASBsiAUGAfyABQYB/Shs6AAAPCyAAIAJB//8BIAJB//8BSBsiAUGAgH4gAUGAgH5KGzsAAA8LIAAgAjYAAA8LIAAgAqw3AAAPC0HsOkGuAUHCywAQ8AQACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAu7AwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEL4EtyEDCyADIQMCQAJAIAFBEE8NACADIQMMAQsgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLIAMiA0QAAAAAAADgwWMNAUH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQew6QcoBQdbLABDwBAALQYCAgIB4IQELIAELoAECAX8BfAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhC+BLchAwsgAyEDAkAgAUEQTw0AIAMPCyADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IL5AECA38BfgJAIAEtAAxBDE8NAEF+DwtBfiECAkACQCABKQIQIgVQDQAgAS8BGCEDECMNAQJAIAAtAAZFDQACQAJAAkBBACgCnOQBIgEgAEcNAEGc5AEhAQwBCyABIQIDQCACIgFFDQIgASgCACIEIQIgASEBIAQgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEJUFGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAU3AgAgACADQQd0OwEEIABBACgCnOQBNgIAQQAgADYCnOQBQQAhAgsgAg8LQaDAAEErQcoiEPAEAAvkAQIDfwF+AkAgAS0ADEECTw0AQX4PC0F+IQICQAJAIAEpAgQiBVANACABLwEQIQMQIw0BAkAgAC0ABkUNAAJAAkACQEEAKAKc5AEiASAARw0AQZzkASEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQlQUaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKAKc5AE2AgBBACAANgKc5AFBACECCyACDwtBoMAAQStByiIQ8AQAC9cCAQR/AkACQAJAIAAtAA1BP0cNACAALQADQQFxDQAQIw0BQQAoApzkASIBRQ0AIAEhAQNAAkAgASIBLQAHRQ0AIAAvAQ4gAS8BDEcNACABQRBqKQIAIAApAgRSDQAgAUEAOgAHIAFBDGoiAhDuBAJAAkAgAS0ABkGAf2oOAwECAAILQQAoApzkASICIQMCQAJAAkAgAiABRw0AQZzkASECDAELA0AgAyICRQ0CIAIoAgAiBCEDIAIhAiAEIAFHDQALCyACIAEoAgA2AgALIAFBAEGIAhCVBRoMAQsgAUEBOgAGAkAgAUEAQQBB4AAQwwQNACABQYIBOgAGIAEtAAcNBSACEOsEIAFBAToAByABQQAoAvzbATYCCAwBCyABQYABOgAGCyABKAIAIgIhASACDQALCw8LQaDAAEHJAEGmEhDwBAALQYDNAEGgwABB8QBBgCYQ9QQAC+oBAQJ/QQAhBEF/IQUCQAJAAkAgAC0ABkF/ag4IAQAAAAAAAAIAC0EAIQRBfiEFDAELQQAhBEEBIQUgAC0ABw0AAkAgAiAAQQ5qLQAAakEEakHtAU8NAEEBIQRBACEFDAELIABBDGoQ6wQgAEEBOgAHIABBACgC/NsBNgIIQQAhBEEBIQULIAUhBQJAAkAgBEUNACAAQQxqQT4gAC8BBCADciACEO8EIgRFDQEgBCABIAIQkwUaIAAgAC8BBCIEQQFqQR9xIARB4P8DcXI7AQRBACEFCyAFDwtB78cAQaDAAEGMAUGNCRD1BAAL2gEBA38CQBAjDQACQEEAKAKc5AEiAEUNACAAIQADQAJAIAAiAC0AByIBRQ0AQQAoAvzbASICIAAoAghrQQBIDQACQCABQQRLDQAgAEEMahCJBSEBQQAoAvzbASECAkAgAQ0AIAAgAC0AByIBQQFqOgAHIABBgCAgAXQgAmo2AggMAgsgACACQYCABGo2AggMAQsCQCABQQVHDQAgACABQQFqOgAHIAAgAkGAgAJqNgIIDAELIABBCDoABgsgACgCACIBIQAgAQ0ACwsPC0GgwABB2gBB7RMQ8AQAC2sBAX9BfyECAkACQAJAIAAtAAZBf2oOCAEAAAAAAAACAAtBfg8LQQEhAiAALQAHDQBBACECIAEgAEEOai0AAGpBBGpB7QFJDQAgAEEMahDrBCAAQQE6AAcgAEEAKAL82wE2AghBASECCyACCw0AIAAgASACQQAQwwQLjgIBA38gAC0ABiIBIQICQAJAAkACQAJAAkACQCABDgkFAgMDAwMDAwEACyABQYB/ag4DAQIDAgsCQAJAAkBBACgCnOQBIgEgAEcNAEGc5AEhAQwBCyABIQIDQCACIgFFDQIgASgCACIDIQIgASEBIAMgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEJUFGkEADwsgAEEBOgAGAkAgAEEAQQBB4AAQwwQiAQ0AIABBggE6AAYgAC0ABw0EIABBDGoQ6wQgAEEBOgAHIABBACgC/NsBNgIIQQEPCyAAQYABOgAGIAEPC0GgwABBvAFBlSwQ8AQAC0EBIQILIAIPC0GAzQBBoMAAQfEAQYAmEPUEAAufAgEFfwJAAkACQAJAIAEtAAJFDQAQJCABLQACQQ9qQfwDcSICIAAvAQIiA2ohBAJAAkACQAJAIAAvAQAiBSADSw0AIAQhBiAEIAAvAQRNDQIgAiAFSQ0BQQAhBEF/IQMMAwsgBCEGIAQgBUkNAUEAIQRBfiEDDAILIAAgAzsBBiACIQYLIAAgBjsBAkEBIQRBACEDCyADIQMCQCAERQ0AIAAgAC8BAmogAmtBCGogASACEJMFGgsgAC8BACAALwEEIgFLDQEgAC8BAiABSw0CIAAvAQYgAUsNAxAlIAMPC0GFwABBHUHWJRDwBAALQYEqQYXAAEE2QdYlEPUEAAtBlSpBhcAAQTdB1iUQ9QQAC0GoKkGFwABBOEHWJRD1BAALMQECf0EAIQECQCAALwEAIgIgAC8BAkYNACAAIAJBACACIAAvAQZJG2pBCGohAQsgAQumAQEDfxAkQQAhAQJAIAAvAQAiAiAALwECRg0AIAAgAkEAIAIgAC8BBkkbakEIaiEBCwJAAkAgASIBRQ0AIAEtAAJBD2pB/ANxIQECQCACIAAvAQYiA0kNACACIANHDQIgACABOwEAIAAgAC8BBDsBBhAlDwsgACACIAFqOwEAECUPC0HSxwBBhcAAQc4AQY8REPUEAAtBpylBhcAAQdEAQY8REPUEAAsiAQF/IABBCGoQISIBIAA7AQQgASAAOwEGIAFBADYBACABCzMBAX8jAEEQayICJAAgAiABOgAPIAAtAA0gAC8BDiACQQ9qQQEQiwUhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATsBDiAALQANIAAvAQ4gAkEOakECEIsFIQAgAkEQaiQAIAALMwEBfyMAQRBrIgIkACACIAE2AgwgAC0ADSAALwEOIAJBDGpBBBCLBSEAIAJBEGokACAACzwAAkACQCABRQ0AIAEtAAANAQsgAC0ADSAALwEOQdHaAEEAEIsFDwsgAC0ADSAALwEOIAEgARDCBRCLBQtOAQJ/IwBBEGsiASQAQQAhAgJAIAAtAANBBHENACABIAAvAQ47AQggASAALwEAOwEKIAAtAA1BAyABQQhqQQQQiwUhAgsgAUEQaiQAIAILGQAgACAALQAMQQRqOgACIAAQ6wQgABCJBQsaAAJAIAAgASACENMEIgINACABENAEGgsgAguABwEQfyMAQRBrIgMkAAJAAkAgAS8BDiIEQQx2IgVBf2pBAU0NAEEAIQQMAQsCQCAFQQJHDQAgAS0ADA0AQQAhBAwBCwJAIARB/x9xIgZB/x1NDQBBACEEDAELAkAgBUECRw0AIARBgB5xQYACRw0AQQAhBAwBC0EAIQQgAi8BACIHQfEfRg0AQQAgBmshCCABQRBqIgkhCiAHIQdBACIEIQtBACEMIAQhDQNAIA0hDSAMIQ4gCyELIBAhDwJAAkAgB0H//wNxIgxBDHYiBEEJRg0AIA0hByAEQeD6AGotAAAhEAwBCyANQQFqIhAhByACIBBBAXRqLwEAIRALIAchEQJAAkACQAJAIBAiB0UNAAJAAkAgBEF2akF9TQ0AIA4hDSALIRAMAQtBACENIAsgDkH/AXFBAEdqQQMgB0F/aiAHQQNLGyIQaiAQQX9zcSEQCyAQIRAgDSELAkAgDEH/H3EgBkciEg0AIAAgEGohDwJAIAVBAUcNAAJAAkAgBEEIRw0AIAMgDy0AACALQf8BcXZBAXE6AA8gAS0ADSABLwEOIANBD2pBARCLBRoMAQsgDyENIAchDgJAIAxBgMACSQ0AA0AgDSEEIA4iDEUNByAEQQFqIQ0gDEF/aiEOIAQtAABFDQALIAxFDQYLIAEtAA0gAS8BDiAPIAcQiwUaCyALIQsgECEHIAghBAwFCwJAIARBCEcNAEEBIAtB/wFxdCEEIA8tAAAhBwJAIAEtABBFDQAgDyAHIARyOgAADAQLIA8gByAEQX9zcToAAAwDCwJAIAcgAS0ADCIESw0AIA8gCiAHEJMFGgwDCyAPIAkgBBCTBSENAkACQCAMQf+fAU0NAEEAIQQMAQtBACEEIAxBgCBxDQAgAS0ADCABakEPaiwAAEEHdSEECyANIAEtAAwiDGogBCAHIAxrEJUFGgwCCwJAAkAgBEEIRw0AQQAgC0EBaiIEIARB/wFxQQhGIgQbIQsgECAEaiEHDAELIAshCyAQIAdqIQcLIA8hBAwDC0HLO0HbAEGGGxDwBAALIAshCyAQIQcgBiEEDAELIAshCyAQIQdBACEECyAEIQQgByENIAshDAJAIBJFDQAgAiARQQFqIg5BAXRqLwEAIhIhByAEIRAgDSELIAwhDCAOIQ1BACEEIBJB8R9GDQIMAQsLIAQhBAsgA0EQaiQAIAQL/gIBBH8gABDVBCAAEMIEIAAQuQQgABCiBAJAAkAgAC0AA0EBcQ0AIAAtAA0NASAALwEODQEgAC0ADEEESQ0BIAAtABFBCHFFDQFBAEEAKAL82wE2AqjkAUGAAhAfQQAtAJDPARAeDwsCQCAAKQIEEOgEUg0AIAAQ1gQgAC0ADSIBQQAtAKTkAU8NAUEAKAKg5AEgAUECdGooAgAhAgJAAkACQCAALwEOQfldag4DAQIAAgsgARDXBCIDIQECQCADDQAgAhDlBCEBCwJAIAEiAQ0AIAAQ0AQaDwsgACABEM8EGg8LIAIQ5gQiAUF/Rg0AIAAgAUH/AXEQzAQaDwsgAiAAIAIoAgAoAgwRAgAPCyAALQADQQRxRQ0AQQAtAKTkAUUNACAAKAIEIQRBACEBA0ACQEEAKAKg5AEgASIBQQJ0aigCACICKAIAIgMoAgAgBEcNACAAIAE6AA0gAiAAIAMoAgwRAgALIAFBAWoiAiEBIAJBAC0ApOQBSQ0ACwsLAgALAgALBABBAAtmAQF/AkBBAC0ApOQBQSBJDQBByztBsAFB/y8Q8AQACyAALwEEECEiASAANgIAIAFBAC0ApOQBIgA6AARBAEH/AToApeQBQQAgAEEBajoApOQBQQAoAqDkASAAQQJ0aiABNgIAIAELsQICBX8BfiMAQYABayIAJABBAEEAOgCk5AFBACAANgKg5AFBABA4pyIBNgL82wECQAJAAkACQCABQQAoArTkASICayIDQf//AEsNAEEAKQO45AEhBSADQegHSw0BIAUhBSADIQMMAgtBAEEAKQO45AEgA0HoB24iAq18NwO45AEgAyACQegHbGshAwwCCyAFIAEgAmtBl3hqIgNB6AduIgRBAWqtfCEFIAEgAiADamsgAyAEQegHbGtqQZh4aiEDC0EAIAU3A7jkASADIQMLQQAgASADazYCtOQBQQBBACkDuOQBPgLA5AEQpgQQOhDkBEEAQQA6AKXkAUEAQQAtAKTkAUECdBAhIgE2AqDkASABIABBAC0ApOQBQQJ0EJMFGkEAEDg+AqjkASAAQYABaiQAC8IBAgN/AX5BABA4pyIANgL82wECQAJAAkACQCAAQQAoArTkASIBayICQf//AEsNAEEAKQO45AEhAyACQegHSw0BIAMhAyACIQIMAgtBAEEAKQO45AEgAkHoB24iAa18NwO45AEgAiABQegHbGshAgwCCyADIAAgAWtBl3hqIgJB6AduIgGtfEIBfCEDIAIgAUHoB2xrQQFqIQILQQAgAzcDuOQBIAIhAgtBACAAIAJrNgK05AFBAEEAKQO45AE+AsDkAQsTAEEAQQAtAKzkAUEBajoArOQBC8QBAQZ/IwAiACEBECAgAEEALQCk5AEiAkECdEEPakHwD3FrIgMkAAJAIAJFDQBBACgCoOQBIQRBACEAA0AgAyAAIgBBAnQiBWogBCAFaigCACgCACgCADYCACAAQQFqIgUhACAFIAJHDQALCwJAQQAtAK3kASIAQQ9PDQBBACAAQQFqOgCt5AELIANBAC0ArOQBQRB0QQAtAK3kAXJBgJ4EajYCAAJAQQBBACADIAJBAnQQiwUNAEEAQQA6AKzkAQsgASQACyUBAX9BASEBAkAgAC0AA0EFcUEBRw0AIAApAgQQ6ARRIQELIAEL3AEBAn8CQEGw5AFBoMIeEPIERQ0AENwECwJAAkBBACgCqOQBIgBFDQBBACgC/NsBIABrQYCAgH9qQQBIDQELQQBBADYCqOQBQZECEB8LQQAoAqDkASgCACIAIAAoAgAoAggRAAACQEEALQCl5AFB/gFGDQACQEEALQCk5AFBAU0NAEEBIQADQEEAIAAiADoApeQBQQAoAqDkASAAQQJ0aigCACIBIAEoAgAoAggRAAAgAEEBaiIBIQAgAUEALQCk5AFJDQALC0EAQQA6AKXkAQsQgAUQxAQQoAQQjwULzwECBH8BfkEAEDinIgA2AvzbAQJAAkACQAJAIABBACgCtOQBIgFrIgJB//8ASw0AQQApA7jkASEEIAJB6AdLDQEgBCEEIAIhAgwCC0EAQQApA7jkASACQegHbiIBrXw3A7jkASACIAFB6AdsayECDAILIAQgACABa0GXeGoiAkHoB24iA0EBaq18IQQgACABIAJqayACIANB6Adsa2pBmHhqIQILQQAgBDcDuOQBIAIhAgtBACAAIAJrNgK05AFBAEEAKQO45AE+AsDkARDgBAtnAQF/AkACQANAEIYFIgBFDQECQCAALQADQQNxQQNHDQAgACkCBBDoBFINAEE/IAAvAQBBAEEAEIsFGhCPBQsDQCAAENQEIAAQ7AQNAAsgABCHBRDeBBA9IAANAAwCCwALEN4EED0LCxQBAX9Bhy5BABCtBCIAQY0nIAAbCw4AQfE1QfH///8DEKwECwYAQdLaAAvdAQEDfyMAQRBrIgAkAAJAQQAtAMTkAQ0AQQBCfzcD6OQBQQBCfzcD4OQBQQBCfzcD2OQBQQBCfzcD0OQBA0BBACEBAkBBAC0AxOQBIgJB/wFGDQBB0doAIAJBizAQrgQhAQsgAUEAEK0EIQFBAC0AxOQBIQICQAJAIAENAEHAACEBIAJBwABJDQFBAEH/AToAxOQBIABBEGokAA8LIAAgAjYCBCAAIAE2AgBBuzAgABAvQQAtAMTkAUEBaiEBC0EAIAE6AMTkAQwACwALQZXNAEHUPkHEAEGNIBD1BAALNQEBf0EAIQECQCAALQAEQdDkAWotAAAiAEH/AUYNAEHR2gAgAEGCLhCuBCEBCyABQQAQrQQLOAACQAJAIAAtAARB0OQBai0AACIAQf8BRw0AQQAhAAwBC0HR2gAgAEGnEBCuBCEACyAAQX8QqwQLUwEDfwJAIAENAEHFu/KIeA8LQcW78oh4IQIgACEAIAEhAQNAIAIgACIALQAAc0GTg4AIbCIDIQIgAEEBaiEAIAFBf2oiBCEBIAMhAyAEDQALIAMLBAAQNgtOAQF/AkBBACgC8OQBIgANAEEAIABBk4OACGxBDXM2AvDkAQtBAEEAKALw5AEiAEENdCAAcyIAQRF2IABzIgBBBXQgAHMiADYC8OQBIAALfgEDf0H//wMhAgJAIAFFDQAgASECIAAhAEH//wMhAQNAIAJBf2oiAyECIAAiBEEBaiEAIAFB//8DcSIBQQh0IAQtAAAgAUEIdnMiAUHwAXFBBHYgAXNB/wFxIgFyIAFBDHRzIAFBBXRzIgQhASADDQALIAQhAgsgAkH//wNxC3UBBX8gAC0AAkEKaiEBIABBAmohAkH//wMhAwNAIAFBf2oiBCEBIAIiBUEBaiECIANB//8DcSIDQQh0IAUtAAAgA0EIdnMiA0HwAXFBBHYgA3NB/wFxIgNyIANBDHRzIANBBXRzIgUhAyAEDQALIAAgBTsBAAuGAgEIfwJAIAAtAAwiAUEHakH8A3EiAiAALQACIgNJDQBBAA8LIAIhAgJAIABBDGoiBCABQQRqIgVqLQAAQf8BRw0AAkAgASAAakERai0AACIBIANJDQBBAA8LIAEhAiAFIAFJDQBBAA8LIAAgAC0AA0H9AXE6AANBACEBAkAgACACIgVqQQxqIgItAAAiBkEEaiIHIAVqIANKDQAgAiEBIAQhAyAGQQdqIghBAnYhAgNAIAMiAyABIgEoAgA2AgAgAUEEaiEBIANBBGohAyACQX9qIgQhAiAEDQALIABBDGoiASAHakH/AToAACAGIAFqQQVqIAhB/AFxIAVqOgAAQQEhAQsgAQtJAQF/AkAgAkEESQ0AIAEhASAAIQAgAkECdiECA0AgACIAIAEiASgCADYCACABQQRqIQEgAEEEaiEAIAJBf2oiAyECIAMNAAsLCwkAIABBADoAAgucAQEDfwJAAkAgAUGAAk8NACACQYCABE8NAUEAIQQCQCADQQRqIABBDGoiBSAFIAAtAAIiBmoiBWtB7AFqSw0AIAUgAToAASAFIAM6AAAgBUEDaiACQQh2OgAAIAVBAmogAjoAACAAIAYgA0EHakH8AXFqOgACIAVBBGohBAsgBA8LQcs9Qf0AQeMtEPAEAAtByz1B/wBB4y0Q8AQACywBAX8jAEEQayIDJAAgAyACNgIIIAMgATYCBCADIAA2AgBBkxcgAxAvEB0AC0kBA38CQCAAKAIAIgJBACgCwOQBayIDQX9KDQAgACACIAFqIgI2AgAgAkEAKALA5AEiBGtBf0oNACAAIAQgAWo2AgALIANBH3YLSQEDfwJAIAAoAgAiAkEAKAL82wFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoAvzbASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtqAQN/AkAgAkUNAEEAIQMDQCAAIAMiA0EBdGoiBCABIANqIgUtAABBBHZB9ShqLQAAOgAAIARBAWogBS0AAEEPcUH1KGotAAA6AAAgA0EBaiIEIQMgBCACRw0ACwsgACACQQF0akEAOgAAC+ICAQd/IAAhAgJAIAEtAAAiA0UNACADRSEEIAMhAyABIQFBACEFIAAhBgNAIAYhByAFIQggBCEEIAMhAyABIQICQANAIAIhAiAEIQUCQAJAIAMiBEFQakH/AXFBCUsiAw0AIATAQVBqIQEMAQtBfyEBIARBIHIiBkGff2pB/wFxQQVLDQAgBsBBqX9qIQELIAFBf0cNASACLQABIgFFIQQgASEDIAJBAWohAiABDQALIAchAgwCCwJAIAVBAXFFDQAgByECDAILAkACQCADDQAgBMBBUGohAQwBC0F/IQEgBEEgciIEQZ9/akH/AXFBBUsNACAEwEGpf2ohAQsgASEBIAJBAWohAgJAAkAgCA0AIAchBiABQQR0QYACciEFDAELIAcgASAIcjoAACAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBB7hYgBBAvEB0AC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsL+QoBC38jAEHAAGsiBCQAIAAgAWohBSAEQX9qIQYgBEEBciEHIARBAnIhCCAAQQBHIQkgAiEBIAMhCiACIQIgACEDA0AgAyEDIAIhAiAKIQsgASIKQQFqIQECQAJAIAotAAAiDEElRg0AIAxFDQAgASEBIAshCiACIQJBASEMIAMhAwwBCwJAAkAgAiABRw0AIAMhAwwBCyACQX9zIAFqIQ0CQCAFIANrIg5BAUgNACADIAIgDSAOQX9qIA4gDUobIg4QkwUgDmpBADoAAAsgAyANaiEDCyADIQ0CQCAMDQAgASEBIAshCiACIQJBACEMIA0hAwwBCwJAAkAgAS0AAEEtRg0AIAEhAUEAIQIMAQsgCkECaiABIAotAAJB8wBGIgIbIQEgAiAJcSECCyACIQIgASIOLAAAIQEgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAFBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgCygCADoAACALQQRqIQIMDAsgBCECAkACQCALKAIAIgFBf0wNACABIQEgAiECDAELIARBLToAAEEAIAFrIQEgByECCyALQQRqIQsgAiIMIQIgASEDA0AgAiICIAMiASABQQpuIgNBCmxrQTByOgAAIAJBAWoiCiECIAMhAyABQQlLDQALIApBADoAACAMIAwQwgVqQX9qIgMhAiAMIQEgAyAMTQ0KA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwLCwALIAQhAiALKAIAIQMDQCACIgIgAyIBIAFBCm4iA0EKbGtBMHI6AAAgAkEBaiIKIQIgAyEDIAFBCUsNAAsgCkEAOgAAIAtBBGohDCAGIAQQwgVqIgMhAiAEIQEgAyAETQ0IA0AgASIBLQAAIQMgASACIgItAAA6AAAgAiADOgAAIAJBf2oiAyECIAFBAWoiCiEBIAogA0kNAAwJCwALIARBsPABOwEAIAsoAgAhDEEAIQJBHCEDA0AgAiECAkACQCAMIAMiAXZBD3EiAw0AIAFFDQBBACEKIAJFDQELIAggAmogA0E3aiADQTByIANBCUsbOgAAIAJBAWohCgsgCiIKIQIgAUF8aiEDIAENAAsgCCAKakEAOgAAIAtBBGohAgwJCyAEQbDwATsBACALKAIAIQxBACECQRwhAwNAIAIhAgJAAkAgDCADIgF2QQ9xIgMNACABRQ0AQQAhCiACRQ0BCyAIIAJqIANBN2ogA0EwciADQQlLGzoAACACQQFqIQoLIAoiCiECIAFBfGohAyABDQALIAggCmpBADoAACALQQRqIQIMCAsgBCALQQdqQXhxIgErAwBBCBD4BCABQQhqIQIMBwsgCygCACIBQZfWACABGyIDEMIFIQECQCAFIA1rIgpBAUgNACANIAMgASAKQX9qIAogAUobIgoQkwUgCmpBADoAAAsgC0EEaiEKIARBADoAACANIAFqIQEgAkUNAyADECIMAwsgBCABOgAADAELIARBPzoAAAsgCyECDAMLIAohAiABIQEMAwsgDCECDAELIAshAgsgDSEBCyACIQIgBBDCBSEDAkAgBSABIgtrIgFBAUgNACALIAQgAyABQX9qIAEgA0obIgEQkwUgAWpBADoAAAsgDkEBaiIMIQEgAiEKIAwhAkEBIQwgCyADaiEDCyABIQEgCiEKIAIhAiADIgshAyAMDQALIARBwABqJAAgCyAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA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Aw0AQQAhBCACEJ8FDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBQAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEFACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEJMFGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQoAUhAAwBCyADEJYFIQUgACAEIAMQoAUhACAFRQ0AIAMQlwULAkAgACAERw0AIAJBACABGw8LIAAgAW4LBABBAAsEAEEACwIACwIACyQARAAAAAAAAPC/RAAAAAAAAPA/IAAbEKcFRAAAAAAAAAAAowsVAQF/IwBBEGsiASAAOQMIIAErAwgLDAAgACAAoSIAIACjC8EEAwF/An4GfCAAEKoFIQECQCAAvSICQoCAgICAgICJQHxC//////+fwgFWDQACQCACQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIEoCAEoSIEIASiQQArA6B8IgWiIgagIgcgACAAIACiIgiiIgkgCSAJIAlBACsD8HyiIAhBACsD6HyiIABBACsD4HyiQQArA9h8oKCgoiAIQQArA9B8oiAAQQArA8h8okEAKwPAfKCgoKIgCEEAKwO4fKIgAEEAKwOwfKJBACsDqHygoKCiIAAgBKEgBaIgACAEoKIgBiAAIAehoKCgoA8LAkACQCABQZCAfmpBn4B+Sw0AAkAgAkL///////////8Ag0IAUg0AQQEQpgUPCyACQoCAgICAgID4/wBRDQECQAJAIAFBgIACcQ0AIAFB8P8BcUHw/wFHDQELIAAQqAUPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCECCyACQoCAgICAgICNQHwiA0I0h6e3IghBACsD6HuiIANCLYinQf8AcUEEdCIBQYD9AGorAwCgIgkgAUH4/ABqKwMAIAIgA0KAgICAgICAeIN9vyABQfiMAWorAwChIAFBgI0BaisDAKGiIgCgIgUgACAAIACiIgSiIAQgAEEAKwOYfKJBACsDkHygoiAA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CyABQYF4Sg0AIABEAAAAAAAAYAOiIQACQCABQbhwTQ0AIAFByQdqIQEMAQsgAEQAAAAAAABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDkBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEOQFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ5AUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EOQFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDkBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ2gVFDQAgAyAEEMoFIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOQFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ3AUgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKENoFQQBKDQACQCABIAkgAyAKENoFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEOQFIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDkBSAFQegAaikDACIJQjCIp0GI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AGogADYCACABQQAoArTnAUcNAUEAIAA2AqjnAQ8LIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIACwJAIABB/wFLDQAgAEF4cUHI5wFqIQICQAJAQQAoAqDnASIEQQEgAEEDdnQiAHENAEEAIAQgAHI2AqDnASACIQAMAQsgAigCCCEACyACIAE2AgggACABNgIMIAEgAjYCDCABIAA2AggPC0EfIQICQCAAQf///wdLDQAgAEEmIABBCHZnIgJrdkEBcSACQQF0a0E+aiECCyABIAI2AhwgAUIANwIQIAJBAnRB0OkBaiEEAkACQAJAAkBBACgCpOcBIgZBASACdCIDcQ0AQQAgBiADcjYCpOcBIAQgATYCACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKALA5wFBf2oiAUF/IAEbNgLA5wELCwcAPwBBEHQLVAECf0EAKAK80wEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ1gVNDQAgABAVRQ0BC0EAIAA2ArzTASABDwsQkAVBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqENkFQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDZBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ2QUgBUEwaiAKIAEgBxDjBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHENkFIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqENkFIAUgAiAEQQEgBmsQ4wUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEOEFDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEOIFGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ2QVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDZBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDlBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDlBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDlBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDlBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDlBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDlBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDlBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDlBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDlBSAFQZABaiADQg+GQgAgBEIAEOUFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ5QUgBUGAAWpCASACfUIAIARCABDlBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEOUFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEOUFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ4wUgBUEwaiAWIBMgBkHwAGoQ2QUgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q5QUgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDlBSAFIAMgDkIFQgAQ5QUgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqENkFIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqENkFIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ2QUgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ2QUgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ2QVBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ2QUgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ2QUgBUEgaiACIAQgBhDZBSAFQRBqIBIgASAHEOMFIAUgAiAEIAcQ4wUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FENgFIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDZBSACIAAgBEGB+AAgA2sQ4wUgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEGQ6wUkA0GQ6wFBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAERAACyUBAX4gACABIAKtIAOtQiCGhCAEEPMFIQUgBUIgiKcQ6QUgBacLEwAgACABpyABQiCIpyACIAMQFgsL7tOBgAADAEGACAuIxwFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBkZXZzX2pzb25fc3RyaW5naWZ5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleABtZXRob2Q6JWQ6JXgAZGJnOiB1bmhhbmRsZWQ6ICV4LyV4ACEgdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4ACEgc3RlcCBmcmFtZSAleABXU1NLLUg6IHVua25vd24gY21kICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwAhIGRvdWJsZSB0aHJvdwBwb3cAZnN0b3I6IGZvcm1hdHRpbmcgbm93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAc2xlZXBNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMAd3NzOi8vJXMlcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAGV4cGVjdGluZyAlczsgZ290ICVzAFdTbjogY29ubmVjdGluZyB0byAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgB0YWcgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAcm90YXJ5RW5jb2RlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABkZXZzX21hcGxpa2VfaXNfbWFwAHZhbGlkYXRlX2hlYXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8Ac21hbGwgaGVsbG8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuAGJ1dHRvbgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAGFzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2V0SW50ZXJ2YWwAY2xlYXJJbnRlcnZhbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAdG9fZ2Nfb2JqAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAc3ogLSAxID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAAhIHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBpbnZhbGlkIGZsYWcgYXJnAG5lZWQgZmxhZyBhcmcAKnByb2cAbG9nAHNldHRpbmcAZ2V0dGluZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgBub24gZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBnY3JlZl90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGhlYXJ0UmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZABkYXRhX3BhZ2VfdXNlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogZndkIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAlcyBjYWxsZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZAAlLXMlZAAlLXNfJWQAKiAgcGM9JWQgQCAlc19GJWQAISAgcGM9JWQgQCAlc19GJWQAISBQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABXU1NLLUg6IGZ3ZF9lbjogJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAdHZvYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFBJAERJU0NPTk5FQ1RJTkcAZGV2c19nY190YWcoZGV2c19oYW5kbGVfcHRyX3ZhbHVlKGN0eCwgdikpID09IERFVlNfR0NfVEFHX1NUUklORwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDACogIHBjPSVkIEAgPz8/ACVjICAlcyA9PgB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsZW4gPT0gbDIAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAlYyAgLi4uAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcHRyKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfZ2Nfb2JqX3ZhbGlkKGN0eCwgcikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEg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dGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AANrxgIAABG5hbWUB6nD2BQANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfbG9hZAIFYWJvcnQDE19kZXZzX3BhbmljX2hhbmRsZXIEEWVtX2RlcGxveV9oYW5kbGVyBRdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQYNZW1fc2VuZF9mcmFtZQcQZW1fY29uc29sZV9kZWJ1ZwgEZXhpdAkLZW1fdGltZV9ub3cKIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CyFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQMGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldw0yZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQOM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZA8zZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkEDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZBEaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2USD19fd2FzaV9mZF9jbG9zZRMVZW1zY3JpcHRlbl9tZW1jcHlfYmlnFA9fX3dhc2lfZmRfd3JpdGUVFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAWGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFxFfX3dhc21fY2FsbF9jdG9ycxgPZmxhc2hfYmFzZV9hZGRyGQ1mbGFzaF9wcm9ncmFtGgtmbGFzaF9lcmFzZRsKZmxhc2hfc3luYxwKZmxhc2hfaW5pdB0IaHdfcGFuaWMeCGpkX2JsaW5rHwdqZF9nbG93IBRqZF9hbGxvY19zdGFja19jaGVjayEIamRfYWxsb2MiB2pkX2ZyZWUjDXRhcmdldF9pbl9pcnEkEnRhcmdldF9kaXNhYmxlX2lycSURdGFyZ2V0X2VuYWJsZV9pcnEmGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZycSZGV2c19wYW5pY19oYW5kbGVyKBNkZXZzX2RlcGxveV9oYW5kbGVyKRRqZF9jcnlwdG9fZ2V0X3JhbmRvbSoQamRfZW1fc2VuZF9mcmFtZSsaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIsGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLQpqZF9lbV9pbml0Lg1qZF9lbV9wcm9jZXNzLwVkbWVzZzAUamRfZW1fZnJhbWVfcmVjZWl2ZWQxEWpkX2VtX2RldnNfZGVwbG95MhFqZF9lbV9kZXZzX3ZlcmlmeTMYamRfZW1fZGV2c19jbGllbnRfZGVwbG95NBtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3M1GWpkX2VtX2RldnNfZW5hYmxlX2xvZ2dpbmc2DGh3X2RldmljZV9pZDcMdGFyZ2V0X3Jlc2V0OA50aW1fZ2V0X21pY3JvczkSamRfdGNwc29ja19wcm9jZXNzOhFhcHBfaW5pdF9zZXJ2aWNlczsSZGV2c19jbGllbnRfZGVwbG95PBRjbGllbnRfZXZlbnRfaGFuZGxlcj0LYXBwX3Byb2Nlc3M+B3R4X2luaXQ/D2pkX3BhY2tldF9yZWFkeUAKdHhfcHJvY2Vzc0EXamRfd2Vic29ja19zZW5kX21lc3NhZ2VCDmpkX3dlYnNvY2tfbmV3QwZvbm9wZW5EB29uZXJyb3JFB29uY2xvc2VGCW9ubWVzc2FnZUcQamRfd2Vic29ja19jbG9zZUgOYWdnYnVmZmVyX2luaXRJD2FnZ2J1ZmZlcl9mbHVzaEoQYWdnYnVmZmVyX3VwbG9hZEsOZGV2c19idWZmZXJfb3BMEGRldnNfcmVhZF9udW1iZXJNEmRldnNfYnVmZmVyX2RlY29kZU4SZGV2c19idWZmZXJfZW5jb2RlTw9kZXZzX2NyZWF0ZV9jdHhQCXNldHVwX2N0eFEKZGV2c190cmFjZVIPZGV2c19lcnJvcl9jb2RlUxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyVAljbGVhcl9jdHhVDWRldnNfZnJlZV9jdHhWCGRldnNfb29tVwlkZXZzX2ZyZWVYEWRldnNjbG91ZF9wcm9jZXNzWRdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFoTZGV2c2Nsb3VkX29uX21ldGhvZFsOZGV2c2Nsb3VkX2luaXRcD2RldnNkYmdfcHJvY2Vzc10RZGV2c2RiZ19yZXN0YXJ0ZWReFWRldnNkYmdfaGFuZGxlX3BhY2tldF8Lc2VuZF92YWx1ZXNgEXZhbHVlX2Zyb21fdGFnX3YwYRlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlYg1vYmpfZ2V0X3Byb3BzYwxleHBhbmRfdmFsdWVkEmRldnNkYmdfc3VzcGVuZF9jYmUMZGV2c2RiZ19pbml0ZhBleHBhbmRfa2V5X3ZhbHVlZwZrdl9hZGRoD2RldnNtZ3JfcHJvY2Vzc2kHdHJ5X3J1bmoMc3RvcF9wcm9ncmFtaw9kZXZzbWdyX3Jlc3RhcnRsFGRldnNtZ3JfZGVwbG95X3N0YXJ0bRRkZXZzbWdyX2RlcGxveV93cml0ZW4QZGV2c21ncl9nZXRfaGFzaG8VZGV2c21ncl9oYW5kbGVfcGFja2V0cA5kZXBsb3lfaGFuZGxlcnETZGVwbG95X21ldGFfaGFuZGxlcnIPZGV2c21ncl9nZXRfY3R4cw5kZXZzbWdyX2RlcGxveXQTZGV2c21ncl9zZXRfbG9nZ2luZ3UMZGV2c21ncl9pbml0dhFkZXZzbWdyX2NsaWVudF9ldncQZGV2c19maWJlcl95aWVsZHgYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9ueRhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV6EGRldnNfZmliZXJfc2xlZXB7G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHwaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN9EWRldnNfaW1nX2Z1bl9uYW1lfhJkZXZzX2ltZ19yb2xlX25hbWV/EmRldnNfZmliZXJfYnlfZmlkeIABEWRldnNfZmliZXJfYnlfdGFngQEQZGV2c19maWJlcl9zdGFydIIBFGRldnNfZmliZXJfdGVybWlhbnRlgwEOZGV2c19maWJlcl9ydW6EARNkZXZzX2ZpYmVyX3N5bmNfbm93hQEKZGV2c19wYW5pY4YBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYcBD2RldnNfZmliZXJfcG9rZYgBE2pkX2djX2FueV90cnlfYWxsb2OJAQdkZXZzX2djigEPZmluZF9mcmVlX2Jsb2NriwESZGV2c19hbnlfdHJ5X2FsbG9jjAEOZGV2c190cnlfYWxsb2ONAQtqZF9nY191bnBpbo4BCmpkX2djX2ZyZWWPARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZJABDmRldnNfdmFsdWVfcGlukQEQZGV2c192YWx1ZV91bnBpbpIBEmRldnNfbWFwX3RyeV9hbGxvY5MBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5QBFGRldnNfYXJyYXlfdHJ5X2FsbG9jlQEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlgEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlwEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSYAQ9kZXZzX2djX3NldF9jdHiZAQ5kZXZzX2djX2NyZWF0ZZoBD2RldnNfZ2NfZGVzdHJveZsBEWRldnNfZ2Nfb2JqX3ZhbGlknAELc2Nhbl9nY19vYmqdARFwcm9wX0FycmF5X2xlbmd0aJ4BEm1ldGgyX0FycmF5X2luc2VydJ8BEmZ1bjFfQXJyYXlfaXNBcnJheaABEG1ldGhYX0FycmF5X3B1c2ihARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WiARFtZXRoWF9BcnJheV9zbGljZaMBEWZ1bjFfQnVmZmVyX2FsbG9jpAEScHJvcF9CdWZmZXJfbGVuZ3RopQEVbWV0aDBfQnVmZmVyX3RvU3RyaW5npgETbWV0aDNfQnVmZmVyX2ZpbGxBdKcBE21ldGg0X0J1ZmZlcl9ibGl0QXSoARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zqQEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljqgEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290qwEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0rAEVZnVuMV9EZXZpY2VTY3JpcHRfbG9nrQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdK4BGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50rwEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHKwARRtZXRoMV9FcnJvcl9fX2N0b3JfX7EBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+yARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+zARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX7QBD3Byb3BfRXJyb3JfbmFtZbUBEW1ldGgwX0Vycm9yX3ByaW50tgEUbWV0aFhfRnVuY3Rpb25fc3RhcnS3ARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZbgBEnByb3BfRnVuY3Rpb25fbmFtZbkBD2Z1bjJfSlNPTl9wYXJzZboBE2Z1bjNfSlNPTl9zdHJpbmdpZnm7AQ5mdW4xX01hdGhfY2VpbLwBD2Z1bjFfTWF0aF9mbG9vcr0BD2Z1bjFfTWF0aF9yb3VuZL4BDWZ1bjFfTWF0aF9hYnO/ARBmdW4wX01hdGhfcmFuZG9twAETZnVuMV9NYXRoX3JhbmRvbUludMEBDWZ1bjFfTWF0aF9sb2fCAQ1mdW4yX01hdGhfcG93wwEOZnVuMl9NYXRoX2lkaXbEAQ5mdW4yX01hdGhfaW1vZMUBDmZ1bjJfTWF0aF9pbXVsxgENZnVuMl9NYXRoX21pbscBC2Z1bjJfbWlubWF4yAENZnVuMl9NYXRoX21heMkBEmZ1bjJfT2JqZWN0X2Fzc2lnbsoBEGZ1bjFfT2JqZWN0X2tleXPLARNmdW4xX2tleXNfb3JfdmFsdWVzzAESZnVuMV9PYmplY3RfdmFsdWVzzQEaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2bOARBwcm9wX1BhY2tldF9yb2xlzwEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllctABE3Byb3BfUGFja2V0X3Nob3J0SWTRARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXjSARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZNMBEXByb3BfUGFja2V0X2ZsYWdz1AEVcHJvcF9QYWNrZXRfaXNDb21tYW5k1QEUcHJvcF9QYWNrZXRfaXNSZXBvcnTWARNwcm9wX1BhY2tldF9wYXlsb2Fk1wETcHJvcF9QYWNrZXRfaXNFdmVudNgBFXByb3BfUGFja2V0X2V2ZW50Q29kZdkBFHByb3BfUGFja2V0X2lzUmVnU2V02gEUcHJvcF9QYWNrZXRfaXNSZWdHZXTbARNwcm9wX1BhY2tldF9yZWdDb2Rl3AETbWV0aDBfUGFja2V0X2RlY29kZd0BEmRldnNfcGFja2V0X2RlY29kZd4BFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZN8BFERzUmVnaXN0ZXJfcmVhZF9jb2504AESZGV2c19wYWNrZXRfZW5jb2Rl4QEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZeIBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXjARZwcm9wX0RzUGFja2V0SW5mb19uYW1l5AEWcHJvcF9Ec1BhY2tldEluZm9fY29kZeUBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX+YBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVk5wEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5k6AERbWV0aDBfRHNSb2xlX3dhaXTpARJwcm9wX1N0cmluZ19sZW5ndGjqARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdOsBE21ldGgxX1N0cmluZ19jaGFyQXTsARJtZXRoMl9TdHJpbmdfc2xpY2XtARRkZXZzX2pkX2dldF9yZWdpc3Rlcu4BFmRldnNfamRfY2xlYXJfcGt0X2tpbmTvARBkZXZzX2pkX3NlbmRfY21k8AERZGV2c19qZF93YWtlX3JvbGXxARRkZXZzX2pkX3Jlc2V0X3BhY2tldPIBE2RldnNfamRfcGt0X2NhcHR1cmXzARNkZXZzX2pkX3NlbmRfbG9nbXNn9AENaGFuZGxlX2xvZ21zZ/UBEmRldnNfamRfc2hvdWxkX3J1bvYBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl9wETZGV2c19qZF9wcm9jZXNzX3BrdPgBFGRldnNfamRfcm9sZV9jaGFuZ2Vk+QESZGV2c19qZF9pbml0X3JvbGVz+gESZGV2c19qZF9mcmVlX3JvbGVz+wEQZGV2c19zZXRfbG9nZ2luZ/wBFWRldnNfc2V0X2dsb2JhbF9mbGFnc/0BF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdz/gEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz/wEQZGV2c19qc29uX2VzY2FwZYACFWRldnNfanNvbl9lc2NhcGVfY29yZYECD2RldnNfanNvbl9wYXJzZYICCmpzb25fdmFsdWWDAgxwYXJzZV9zdHJpbmeEAg1zdHJpbmdpZnlfb2JqhQIKYWRkX2luZGVudIYCD3N0cmluZ2lmeV9maWVsZIcCE2RldnNfanNvbl9zdHJpbmdpZnmIAhFwYXJzZV9zdHJpbmdfY29yZYkCEWRldnNfbWFwbGlrZV9pdGVyigIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3SLAhJkZXZzX21hcF9jb3B5X2ludG+MAgxkZXZzX21hcF9zZXSNAgZsb29rdXCOAhNkZXZzX21hcGxpa2VfaXNfbWFwjwIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVzkAIRZGV2c19hcnJheV9pbnNlcnSRAghrdl9hZGQuMZICEmRldnNfc2hvcnRfbWFwX3NldJMCD2RldnNfbWFwX2RlbGV0ZZQCEmRldnNfc2hvcnRfbWFwX2dldJUCF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0lgIOZGV2c19yb2xlX3NwZWOXAhJkZXZzX2Z1bmN0aW9uX2JpbmSYAhFkZXZzX21ha2VfY2xvc3VyZZkCDmRldnNfZ2V0X2ZuaWR4mgITZGV2c19nZXRfZm5pZHhfY29yZZsCHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZJwCE2RldnNfZ2V0X3JvbGVfcHJvdG+dAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcneeAhhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSfAhVkZXZzX2dldF9zdGF0aWNfcHJvdG+gAhtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+hAh1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51baICFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+jAhhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSkAhhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSlAhBkZXZzX2luc3RhbmNlX29mpgIPZGV2c19vYmplY3RfZ2V0pwIMZGV2c19zZXFfZ2V0qAIMZGV2c19hbnlfZ2V0qQIMZGV2c19hbnlfc2V0qgIMZGV2c19zZXFfc2V0qwIOZGV2c19hcnJheV9zZXSsAhNkZXZzX2FycmF5X3Bpbl9wdXNorQIMZGV2c19hcmdfaW50rgIPZGV2c19hcmdfZG91YmxlrwIPZGV2c19yZXRfZG91YmxlsAIMZGV2c19yZXRfaW50sQINZGV2c19yZXRfYm9vbLICD2RldnNfcmV0X2djX3B0crMCEWRldnNfYXJnX3NlbGZfbWFwtAIRZGV2c19zZXR1cF9yZXN1bWW1Ag9kZXZzX2Nhbl9hdHRhY2i2AhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVltwIVZGV2c19tYXBsaWtlX3RvX3ZhbHVluAISZGV2c19yZWdjYWNoZV9mcmVluQIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbLoCF2RldnNfcmVnY2FjaGVfbWFya191c2VkuwITZGV2c19yZWdjYWNoZV9hbGxvY7wCFGRldnNfcmVnY2FjaGVfbG9va3VwvQIRZGV2c19yZWdjYWNoZV9hZ2W+AhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZb8CEmRldnNfcmVnY2FjaGVfbmV4dMACD2pkX3NldHRpbmdzX2dldMECD2pkX3NldHRpbmdzX3NldMICDmRldnNfbG9nX3ZhbHVlwwIPZGV2c19zaG93X3ZhbHVlxAIQZGV2c19zaG93X3ZhbHVlMMUCDWNvbnN1bWVfY2h1bmvGAg1zaGFfMjU2X2Nsb3NlxwIPamRfc2hhMjU2X3NldHVwyAIQamRfc2hhMjU2X3VwZGF0ZckCEGpkX3NoYTI1Nl9maW5pc2jKAhRqZF9zaGEyNTZfaG1hY19zZXR1cMsCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaMwCDmpkX3NoYTI1Nl9oa2RmzQIOZGV2c19zdHJmb3JtYXTOAg5kZXZzX2lzX3N0cmluZ88CDmRldnNfaXNfbnVtYmVy0AIUZGV2c19zdHJpbmdfZ2V0X3V0ZjjRAhNkZXZzX2J1aWx0aW5fc3RyaW5n0gIUZGV2c19zdHJpbmdfdnNwcmludGbTAhNkZXZzX3N0cmluZ19zcHJpbnRm1AIVZGV2c19zdHJpbmdfZnJvbV91dGY41QIUZGV2c192YWx1ZV90b19zdHJpbmfWAhBidWZmZXJfdG9fc3RyaW5n1wIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZNgCEmRldnNfc3RyaW5nX2NvbmNhdNkCEWRldnNfc3RyaW5nX3NsaWNl2gISZGV2c19wdXNoX3RyeWZyYW1l2wIRZGV2c19wb3BfdHJ5ZnJhbWXcAg9kZXZzX2R1bXBfc3RhY2vdAhNkZXZzX2R1bXBfZXhjZXB0aW9u3gIKZGV2c190aHJvd98CEmRldnNfcHJvY2Vzc190aHJvd+ACEGRldnNfYWxsb2NfZXJyb3LhAhVkZXZzX3Rocm93X3R5cGVfZXJyb3LiAhZkZXZzX3Rocm93X3JhbmdlX2Vycm9y4wIeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y5AIaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LlAh5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTmAhhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LnAhdkZXZzX3Rocm93X3N5bnRheF9lcnJvcugCHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2PpAg90c2FnZ19jbGllbnRfZXbqAgphZGRfc2VyaWVz6wINdHNhZ2dfcHJvY2Vzc+wCCmxvZ19zZXJpZXPtAhN0c2FnZ19oYW5kbGVfcGFja2V07gIUbG9va3VwX29yX2FkZF9zZXJpZXPvAgp0c2FnZ19pbml08AIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZfECE2RldnNfdmFsdWVfZnJvbV9pbnTyAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbPMCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy9AIUZGV2c192YWx1ZV90b19kb3VibGX1AhFkZXZzX3ZhbHVlX3RvX2ludPYCEmRldnNfdmFsdWVfdG9fYm9vbPcCDmRldnNfaXNfYnVmZmVy+AIXZGV2c19idWZmZXJfaXNfd3JpdGFibGX5AhBkZXZzX2J1ZmZlcl9kYXRh+gITZGV2c19idWZmZXJpc2hfZGF0YfsCFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq/AINZGV2c19pc19hcnJhef0CEWRldnNfdmFsdWVfdHlwZW9m/gIPZGV2c19pc19udWxsaXNo/wIZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZIADFGRldnNfdmFsdWVfYXBwcm94X2VxgQMSZGV2c192YWx1ZV9pZWVlX2VxggMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjgwMSZGV2c19pbWdfc3RyaWR4X29rhAMSZGV2c19kdW1wX3ZlcnNpb25zhQMLZGV2c192ZXJpZnmGAxFkZXZzX2ZldGNoX29wY29kZYcDDmRldnNfdm1fcmVzdW1liAMRZGV2c192bV9zZXRfZGVidWeJAxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzigMYZGV2c192bV9jbGVhcl9icmVha3BvaW50iwMPZGV2c192bV9zdXNwZW5kjAMWZGV2c192bV9zZXRfYnJlYWtwb2ludI0DFGRldnNfdm1fZXhlY19vcGNvZGVzjgMaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiPAxFkZXZzX2ltZ19nZXRfdXRmOJADFGRldnNfZ2V0X3N0YXRpY191dGY4kQMPZGV2c192bV9yb2xlX29rkgMUZGV2c192YWx1ZV9idWZmZXJpc2iTAwxleHByX2ludmFsaWSUAxRleHByeF9idWlsdGluX29iamVjdJUDC3N0bXQxX2NhbGwwlgMLc3RtdDJfY2FsbDGXAwtzdG10M19jYWxsMpgDC3N0bXQ0X2NhbGwzmQMLc3RtdDVfY2FsbDSaAwtzdG10Nl9jYWxsNZsDC3N0bXQ3X2NhbGw2nAMLc3RtdDhfY2FsbDedAwtzdG10OV9jYWxsOJ4DEnN0bXQyX2luZGV4X2RlbGV0ZZ8DDHN0bXQxX3JldHVybqADCXN0bXR4X2ptcKEDDHN0bXR4MV9qbXBfeqIDCmV4cHIyX2JpbmSjAxJleHByeF9vYmplY3RfZmllbGSkAxJzdG10eDFfc3RvcmVfbG9jYWylAxNzdG10eDFfc3RvcmVfZ2xvYmFspgMSc3RtdDRfc3RvcmVfYnVmZmVypwMJZXhwcjBfaW5mqAMQZXhwcnhfbG9hZF9sb2NhbKkDEWV4cHJ4X2xvYWRfZ2xvYmFsqgMLZXhwcjFfdXBsdXOrAwtleHByMl9pbmRleKwDD3N0bXQzX2luZGV4X3NldK0DFGV4cHJ4MV9idWlsdGluX2ZpZWxkrgMSZXhwcngxX2FzY2lpX2ZpZWxkrwMRZXhwcngxX3V0ZjhfZmllbGSwAxBleHByeF9tYXRoX2ZpZWxksQMOZXhwcnhfZHNfZmllbGSyAw9zdG10MF9hbGxvY19tYXCzAxFzdG10MV9hbGxvY19hcnJhebQDEnN0bXQxX2FsbG9jX2J1ZmZlcrUDEWV4cHJ4X3N0YXRpY19yb2xltgMTZXhwcnhfc3RhdGljX2J1ZmZlcrcDG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ7gDGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbme5AxhleHByeF9zdGF0aWNfdXRmOF9zdHJpbme6AxVleHByeF9zdGF0aWNfZnVuY3Rpb267Aw1leHByeF9saXRlcmFsvAMRZXhwcnhfbGl0ZXJhbF9mNjS9AxBleHByeF9yb2xlX3Byb3RvvgMRZXhwcjNfbG9hZF9idWZmZXK/Aw1leHByMF9yZXRfdmFswAMMZXhwcjFfdHlwZW9mwQMPZXhwcjBfdW5kZWZpbmVkwgMSZXhwcjFfaXNfdW5kZWZpbmVkwwMKZXhwcjBfdHJ1ZcQDC2V4cHIwX2ZhbHNlxQMNZXhwcjFfdG9fYm9vbMYDCWV4cHIwX25hbscDCWV4cHIxX2Fic8gDDWV4cHIxX2JpdF9ub3TJAwxleHByMV9pc19uYW7KAwlleHByMV9uZWfLAwlleHByMV9ub3TMAwxleHByMV90b19pbnTNAwlleHByMl9hZGTOAwlleHByMl9zdWLPAwlleHByMl9tdWzQAwlleHByMl9kaXbRAw1leHByMl9iaXRfYW5k0gMMZXhwcjJfYml0X29y0wMNZXhwcjJfYml0X3hvctQDEGV4cHIyX3NoaWZ0X2xlZnTVAxFleHByMl9zaGlmdF9yaWdodNYDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk1wMIZXhwcjJfZXHYAwhleHByMl9sZdkDCGV4cHIyX2x02gMIZXhwcjJfbmXbAxVzdG10MV90ZXJtaW5hdGVfZmliZXLcAxRzdG10eDJfc3RvcmVfY2xvc3VyZd0DE2V4cHJ4MV9sb2FkX2Nsb3N1cmXeAxJleHByeF9tYWtlX2Nsb3N1cmXfAxBleHByMV90eXBlb2Zfc3Ry4AMMZXhwcjBfbm93X21z4QMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZeIDEHN0bXQyX2NhbGxfYXJyYXnjAwlzdG10eF90cnnkAw1zdG10eF9lbmRfdHJ55QMLc3RtdDBfY2F0Y2jmAw1zdG10MF9maW5hbGx55wMLc3RtdDFfdGhyb3foAw5zdG10MV9yZV90aHJvd+kDEHN0bXR4MV90aHJvd19qbXDqAw5zdG10MF9kZWJ1Z2dlcusDCWV4cHIxX25ld+wDEWV4cHIyX2luc3RhbmNlX29m7QMKZXhwcjBfbnVsbO4DD2V4cHIyX2FwcHJveF9lce8DD2V4cHIyX2FwcHJveF9uZfADD2RldnNfdm1fcG9wX2FyZ/EDE2RldnNfdm1fcG9wX2FyZ191MzLyAxNkZXZzX3ZtX3BvcF9hcmdfaTMy8wMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcvQDEmpkX2Flc19jY21fZW5jcnlwdPUDEmpkX2Flc19jY21fZGVjcnlwdPYDDEFFU19pbml0X2N0ePcDD0FFU19FQ0JfZW5jcnlwdPgDEGpkX2Flc19zZXR1cF9rZXn5Aw5qZF9hZXNfZW5jcnlwdPoDEGpkX2Flc19jbGVhcl9rZXn7AwtqZF93c3NrX25ld/wDFGpkX3dzc2tfc2VuZF9tZXNzYWdl/QMTamRfd2Vic29ja19vbl9ldmVudP4DB2RlY3J5cHT/Aw1qZF93c3NrX2Nsb3NlgAQQamRfd3Nza19vbl9ldmVudIEECnNlbmRfZW1wdHmCBBJ3c3NraGVhbHRoX3Byb2Nlc3ODBBdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZYQEFHdzc2toZWFsdGhfcmVjb25uZWN0hQQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0hgQPc2V0X2Nvbm5fc3RyaW5nhwQRY2xlYXJfY29ubl9zdHJpbmeIBA93c3NraGVhbHRoX2luaXSJBBN3c3NrX3B1Ymxpc2hfdmFsdWVzigQQd3Nza19wdWJsaXNoX2JpbosEEXdzc2tfaXNfY29ubmVjdGVkjAQTd3Nza19yZXNwb25kX21ldGhvZI0EEndzc2tfc2VydmljZV9xdWVyeY4EHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWPBBZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlkAQPcm9sZW1ncl9wcm9jZXNzkQQQcm9sZW1ncl9hdXRvYmluZJIEFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJMEFGpkX3JvbGVfbWFuYWdlcl9pbml0lAQYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVklQQNamRfcm9sZV9hbGxvY5YEEGpkX3JvbGVfZnJlZV9hbGyXBBZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kmAQSamRfcm9sZV9ieV9zZXJ2aWNlmQQTamRfY2xpZW50X2xvZ19ldmVudJoEE2pkX2NsaWVudF9zdWJzY3JpYmWbBBRqZF9jbGllbnRfZW1pdF9ldmVudJwEFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VknQQQamRfZGV2aWNlX2xvb2t1cJ4EGGpkX2RldmljZV9sb29rdXBfc2VydmljZZ8EE2pkX3NlcnZpY2Vfc2VuZF9jbWSgBBFqZF9jbGllbnRfcHJvY2Vzc6EEDmpkX2RldmljZV9mcmVlogQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSjBA9qZF9kZXZpY2VfYWxsb2OkBA9qZF9jdHJsX3Byb2Nlc3OlBBVqZF9jdHJsX2hhbmRsZV9wYWNrZXSmBAxqZF9jdHJsX2luaXSnBBRkY2ZnX3NldF91c2VyX2NvbmZpZ6gECWRjZmdfaW5pdKkEDWRjZmdfdmFsaWRhdGWqBA5kY2ZnX2dldF9lbnRyeasEDGRjZmdfZ2V0X2kzMqwEDGRjZmdfZ2V0X3UzMq0ED2RjZmdfZ2V0X3N0cmluZ64EDGRjZmdfaWR4X2tlea8EE2pkX3NldHRpbmdzX2dldF9iaW6wBA1qZF9mc3Rvcl9pbml0sQQTamRfc2V0dGluZ3Nfc2V0X2JpbrIEC2pkX2ZzdG9yX2djswQPcmVjb21wdXRlX2NhY2hltAQVamRfc2V0dGluZ3NfZ2V0X2xhcmdltQQWamRfc2V0dGluZ3NfcHJlcF9sYXJnZbYEF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdltwQWamRfc2V0dGluZ3Nfc3luY19sYXJnZbgEDWpkX2lwaXBlX29wZW65BBZqZF9pcGlwZV9oYW5kbGVfcGFja2V0ugQOamRfaXBpcGVfY2xvc2W7BBJqZF9udW1mbXRfaXNfdmFsaWS8BBVqZF9udW1mbXRfd3JpdGVfZmxvYXS9BBNqZF9udW1mbXRfd3JpdGVfaTMyvgQSamRfbnVtZm10X3JlYWRfaTMyvwQUamRfbnVtZm10X3JlYWRfZmxvYXTABBFqZF9vcGlwZV9vcGVuX2NtZMEEFGpkX29waXBlX29wZW5fcmVwb3J0wgQWamRfb3BpcGVfaGFuZGxlX3BhY2tldMMEEWpkX29waXBlX3dyaXRlX2V4xAQQamRfb3BpcGVfcHJvY2Vzc8UEFGpkX29waXBlX2NoZWNrX3NwYWNlxgQOamRfb3BpcGVfd3JpdGXHBA5qZF9vcGlwZV9jbG9zZcgEDWpkX3F1ZXVlX3B1c2jJBA5qZF9xdWV1ZV9mcm9udMoEDmpkX3F1ZXVlX3NoaWZ0ywQOamRfcXVldWVfYWxsb2PMBA1qZF9yZXNwb25kX3U4zQQOamRfcmVzcG9uZF91MTbOBA5qZF9yZXNwb25kX3UzMs8EEWpkX3Jlc3BvbmRfc3RyaW5n0AQXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTRBAtqZF9zZW5kX3BrdNIEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs0wQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLUBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V01QQUamRfYXBwX2hhbmRsZV9wYWNrZXTWBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmTXBBVhcHBfZ2V0X2luc3RhbmNlX25hbWXYBBNqZF9hbGxvY2F0ZV9zZXJ2aWNl2QQQamRfc2VydmljZXNfaW5pdNoEDmpkX3JlZnJlc2hfbm932wQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZNwEFGpkX3NlcnZpY2VzX2Fubm91bmNl3QQXamRfc2VydmljZXNfbmVlZHNfZnJhbWXeBBBqZF9zZXJ2aWNlc190aWNr3wQVamRfcHJvY2Vzc19ldmVyeXRoaW5n4AQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXhBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l4gQUYXBwX2dldF9kZXZpY2VfY2xhc3PjBBJhcHBfZ2V0X2Z3X3ZlcnNpb27kBA1qZF9zcnZjZmdfcnVu5QQXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXmBBFqZF9zcnZjZmdfdmFyaWFudOcEDWpkX2hhc2hfZm52MWHoBAxqZF9kZXZpY2VfaWTpBAlqZF9yYW5kb23qBAhqZF9jcmMxNusEDmpkX2NvbXB1dGVfY3Jj7AQOamRfc2hpZnRfZnJhbWXtBAxqZF93b3JkX21vdmXuBA5qZF9yZXNldF9mcmFtZe8EEGpkX3B1c2hfaW5fZnJhbWXwBA1qZF9wYW5pY19jb3Jl8QQTamRfc2hvdWxkX3NhbXBsZV9tc/IEEGpkX3Nob3VsZF9zYW1wbGXzBAlqZF90b19oZXj0BAtqZF9mcm9tX2hlePUEDmpkX2Fzc2VydF9mYWls9gQHamRfYXRvafcEC2pkX3ZzcHJpbnRm+AQPamRfcHJpbnRfZG91Ymxl+QQKamRfc3ByaW50ZvoEEmpkX2RldmljZV9zaG9ydF9pZPsEDGpkX3NwcmludGZfYfwEC2pkX3RvX2hleF9h/QQUamRfZGV2aWNlX3Nob3J0X2lkX2H+BAlqZF9zdHJkdXD/BAlqZF9tZW1kdXCABRZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlgQUWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZYIFEWpkX3NlbmRfZXZlbnRfZXh0gwUKamRfcnhfaW5pdIQFFGpkX3J4X2ZyYW1lX3JlY2VpdmVkhQUdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uGBQ9qZF9yeF9nZXRfZnJhbWWHBRNqZF9yeF9yZWxlYXNlX2ZyYW1liAURamRfc2VuZF9mcmFtZV9yYXeJBQ1qZF9zZW5kX2ZyYW1ligUKamRfdHhfaW5pdIsFB2pkX3NlbmSMBRZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjjQUPamRfdHhfZ2V0X2ZyYW1ljgUQamRfdHhfZnJhbWVfc2VudI8FC2pkX3R4X2ZsdXNokAUQX19lcnJub19sb2NhdGlvbpEFDF9fZnBjbGFzc2lmeZIFBWR1bW15kwUIX19tZW1jcHmUBQdtZW1tb3ZllQUGbWVtc2V0lgUKX19sb2NrZmlsZZcFDF9fdW5sb2NrZmlsZZgFBmZmbHVzaJkFBGZtb2SaBQ1fX0RPVUJMRV9CSVRTmwUMX19zdGRpb19zZWVrnAUNX19zdGRpb193cml0ZZ0FDV9fc3RkaW9fY2xvc2WeBQhfX3RvcmVhZJ8FCV9fdG93cml0ZaAFCV9fZndyaXRleKEFBmZ3cml0ZaIFFF9fcHRocmVhZF9tdXRleF9sb2NrowUWX19wdGhyZWFkX211dGV4X3VubG9ja6QFBl9fbG9ja6UFCF9fdW5sb2NrpgUOX19tYXRoX2Rpdnplcm+nBQpmcF9iYXJyaWVyqAUOX19tYXRoX2ludmFsaWSpBQNsb2eqBQV0b3AxNqsFBWxvZzEwrAUHX19sc2Vla60FBm1lbWNtcK4FCl9fb2ZsX2xvY2uvBQxfX29mbF91bmxvY2uwBQxfX21hdGhfeGZsb3exBQxmcF9iYXJyaWVyLjGyBQxfX21hdGhfb2Zsb3ezBQxfX21hdGhfdWZsb3e0BQRmYWJztQUDcG93tgUFdG9wMTK3BQp6ZXJvaW5mbmFuuAUIY2hlY2tpbnS5BQxmcF9iYXJyaWVyLjK6BQpsb2dfaW5saW5luwUKZXhwX2lubGluZbwFC3NwZWNpYWxjYXNlvQUNZnBfZm9yY2VfZXZhbL4FBXJvdW5kvwUGc3RyY2hywAULX19zdHJjaHJudWzBBQZzdHJjbXDCBQZzdHJsZW7DBQdfX3VmbG93xAUHX19zaGxpbcUFCF9fc2hnZXRjxgUHaXNzcGFjZccFBnNjYWxibsgFCWNvcHlzaWdubMkFB3NjYWxibmzKBQ1fX2ZwY2xhc3NpZnlsywUFZm1vZGzMBQVmYWJzbM0FC19fZmxvYXRzY2FuzgUIaGV4ZmxvYXTPBQhkZWNmbG9hdNAFB3NjYW5leHDRBQZzdHJ0b3jSBQZzdHJ0b2TTBRJfX3dhc2lfc3lzY2FsbF9yZXTUBQhkbG1hbGxvY9UFBmRsZnJlZdYFGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdcFBHNicmvYBQhfX2FkZHRmM9kFCV9fYXNobHRpM9oFB19fbGV0ZjLbBQdfX2dldGYy3AUIX19kaXZ0ZjPdBQ1fX2V4dGVuZGRmdGYy3gUNX19leHRlbmRzZnRmMt8FC19fZmxvYXRzaXRm4AUNX19mbG9hdHVuc2l0ZuEFDV9fZmVfZ2V0cm91bmTiBRJfX2ZlX3JhaXNlX2luZXhhY3TjBQlfX2xzaHJ0aTPkBQhfX211bHRmM+UFCF9fbXVsdGkz5gUJX19wb3dpZGYy5wUIX19zdWJ0ZjPoBQxfX3RydW5jdGZkZjLpBQtzZXRUZW1wUmV0MOoFC2dldFRlbXBSZXQw6wUJc3RhY2tTYXZl7AUMc3RhY2tSZXN0b3Jl7QUKc3RhY2tBbGxvY+4FHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnTvBRVlbXNjcmlwdGVuX3N0YWNrX2luaXTwBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl8QUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZfIFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZPMFDGR5bkNhbGxfamlqafQFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamn1BRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHzBQQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 27072;
var ___stop_em_js = Module['___stop_em_js'] = 28125;



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
