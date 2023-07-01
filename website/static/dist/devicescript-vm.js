
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
["_malloc","_free","_jd_em_set_device_id_2x_i32","_jd_em_set_device_id_string","_jd_em_init","_jd_em_process","_jd_em_frame_received","_jd_em_devs_deploy","_jd_em_devs_verify","_jd_em_devs_client_deploy","_jd_em_devs_enable_gc_stress","_jd_em_tcpsock_on_event","_fflush","onRuntimeInitialized"].forEach((prop) => {
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
                if (data.length >= 0xff)
                    return;
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
    let currSock;
    function sockClose() {
        if (!currSock)
            return -10;
        currSock.end();
        currSock = null;
        return 0;
    }
    Exts.sockClose = sockClose;
    function sockWrite(data, len) {
        if (!currSock)
            return -10;
        const buf = Module.HEAPU8.slice(data, data + len);
        currSock.write(buf);
        return 0;
    }
    Exts.sockWrite = sockWrite;
    function sockIsAvailable() {
        try {
            require("node:tls");
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    Exts.sockIsAvailable = sockIsAvailable;
    function sockOpen(hostptr, port) {
        const host = UTF8ToString(hostptr, 256);
        const JD_CONN_EV_OPEN = 0x01;
        const JD_CONN_EV_CLOSE = 0x02;
        const JD_CONN_EV_ERROR = 0x03;
        const JD_CONN_EV_MESSAGE = 0x04;
        const isTLS = port < 0;
        if (isTLS)
            port = -port;
        const name = `${isTLS ? "tls" : "tcp"}://${host}:${port}`;
        currSock === null || currSock === void 0 ? void 0 : currSock.end();
        currSock = null;
        const sock = isTLS
            ? require("tls").connect({
                host,
                port,
            })
            : require("net").createConnection({ host, port });
        currSock = sock;
        currSock.once("connect", () => {
            if (sock === currSock)
                cb(JD_CONN_EV_OPEN);
        });
        currSock.on("data", (buf) => {
            if (sock === currSock)
                cb(JD_CONN_EV_MESSAGE, buf);
        });
        currSock.on("error", (err) => {
            if (sock === currSock) {
                cb(JD_CONN_EV_ERROR, `${name}: ${err.message}`);
                currSock = null;
            }
        });
        currSock.on("close", (hadError) => {
            if (sock === currSock) {
                cb(JD_CONN_EV_CLOSE);
                currSock = null;
            }
        });
        function cb(tp, arg) {
            let len = arg ? arg.length : 0;
            let ptr = 0;
            if (typeof arg === "string") {
                len = lengthBytesUTF8(arg);
                ptr = allocateUTF8(arg);
            }
            else if (arg) {
                ptr = Module._malloc(len);
                Module.HEAPU8.set(arg, ptr);
            }
            Module._jd_em_tcpsock_on_event(tp, ptr, len);
            if (ptr)
                Module._free(ptr);
        }
    }
    Exts.sockOpen = sockOpen;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABtYKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/f39/fwBgBX9/f39/AX9gBX9+fn5+AGAGf39/f39/AGAAAX5gAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gBn9/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C/IOAgAAVA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX3NpemUACANlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA/SGgIAA8gYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAPBw8ABwcDBQIHBwMDBwgBAgcHBA4LDAYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMHBQcGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAAAAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAcBAAEBAAABAQEBAAABBQAAEgAAAAkABgAAAAEMAAAAEgMODgAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAADAQEBAQEBAQEBAQEBAQEBBgEDAAABAQEBAAsAAgIAAQEBAAEBAAEBAAAAAQAAAQEAAAAAAAACAAUCAgULAAEAAQEBBAEPBgACAAAABgAACAQDCQsCAgsCAwAFCQMBBQYDBQkFBQYFAQEBAwMGAwMDAwMDBQUFCQwGBQMDAwYDAwMDBQYFBQUFBQUBBgMDEBMCAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAICAB4fAwQDBgIFBQUBAQUFCwEDAgIBAAsFBQUBBQUBBQYDAwQEAwwTAgIFEAMDAwMGBgMDAwQEBgYGBgEDAAMDBAIAAwACBgAEBAMGBgUBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgECBAQBDiACAgAABwkDBgECAAAHCQkBAwcBAgAAAgUABwkIAAQEBAAAAgcAFAMHBwECAQAVAwkHAAAEAAIHAAACBwQHBAQDAwMDBgIIBgYGBAcGBwMDAgYIAAYAAAQhAQMQAwMACQcDBgQDBAAEAwMDAwQEBgYAAAAEBAcHBwcEBwcHCAgIBwQEAw8IAwAEAQAJAQMDAQMFBAwiCQkUAwMEAwMDBwcFBwQIAAQEBwkIAAcIFgQGBgYEAAQZIxEGBAQEBgkEBAAAFwoKChYKEQYIByQKFxcKGRYVFQolJicoCgMDAwQGAwMDAwMEFAQEGg0YKQ0qBQ4SKwUQBAQACAQNGBsbDRMsAgIICBgNDRoNLQAICAAECAcICAguDC8Eh4CAgAABcAGUApQCBYaAgIAAAQGAAoACBoeBgIAAFH8BQZCXBgt/AUEAC38BQQALfwFBAAt/AEGI7wELfwBB2O8BC38AQcfwAQt/AEGR8gELfwBBjfMBC38AQYn0AQt/AEH19AELfwBBxfUBC38AQeb1AQt/AEHr9wELfwBB4fgBC38AQbH5AQt/AEH9+QELfwBBpvoBC38AQYjvAQt/AEHV+gELB8eHgIAAKgZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAVBm1hbGxvYwDlBhZfX2VtX2pzX19lbV9mbGFzaF9zaXplAwQWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMFFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBhBfX2Vycm5vX2xvY2F0aW9uAJsGGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAOYGGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACoaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKwpqZF9lbV9pbml0ACwNamRfZW1fcHJvY2VzcwAtFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC4RamRfZW1fZGV2c19kZXBsb3kALxFqZF9lbV9kZXZzX3ZlcmlmeQAwGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAxG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAyFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBxxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwgcX19lbV9qc19fZW1fc2VuZF9sYXJnZV9mcmFtZQMJGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwoUX19lbV9qc19fZW1fdGltZV9ub3cDCyBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMMF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAw0WamRfZW1fdGNwc29ja19vbl9ldmVudABCGF9fZW1fanNfX19qZF90Y3Bzb2NrX25ldwMOGl9fZW1fanNfX19qZF90Y3Bzb2NrX3dyaXRlAw8aX19lbV9qc19fX2pkX3RjcHNvY2tfY2xvc2UDECFfX2VtX2pzX19famRfdGNwc29ja19pc19hdmFpbGFibGUDEQZmZmx1c2gAowYVZW1zY3JpcHRlbl9zdGFja19pbml0AIAHGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAgQcZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCCBxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAgwcJc3RhY2tTYXZlAPwGDHN0YWNrUmVzdG9yZQD9BgpzdGFja0FsbG9jAP4GHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA/wYNX19zdGFydF9lbV9qcwMSDF9fc3RvcF9lbV9qcwMTDGR5bkNhbGxfamlqaQCFBwmhhICAAAEAQQELkwIpOlNUZFlbbm9zZW2wAr8CzwLuAvIC9wKfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHYAdoB2wHcAd0B3gHfAeAB4QHiAeMB5gHnAekB6gHrAe0B7wHwAfEB9AH1AfYB+wH8Af0B/gH/AYACgQKCAoMChAKFAoYChwKIAokCigKLAo0CjgKPApECkgKTApUClgKXApgCmQKaApsCnAKdAp4CnwKgAqECogKjAqUCpwKoAqkCqgKrAqwCrQKvArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CwALBAsICwwLEAsUCxgLHAsgCyQLLAo0EjgSPBJAEkQSSBJMElASVBJYElwSYBJkEmgSbBJwEnQSeBJ8EoAShBKIEowSkBKUEpgSnBKgEqQSqBKsErAStBK4ErwSwBLEEsgSzBLQEtQS2BLcEuAS5BLoEuwS8BL0EvgS/BMAEwQTCBMMExATFBMYExwTIBMkEygTLBMwEzQTOBM8E0ATRBNIE0wTUBNUE1gTXBNgE2QTaBNsE3ATdBN4E3wTgBOEE4gTjBOQE5QTmBOcE6ATpBIQFhgWKBYsFjQWMBZAFkgWkBaUFqAWpBY4GqAanBqYGCrbSjIAA8gYFABCABwslAQF/AkBBACgC4PoBIgANAEGt1gBBq8oAQRlBsCEQgAYACyAAC9wBAQJ/AkACQAJAAkBBACgC4PoBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgC5PoBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBi94AQavKAEEiQeEoEIAGAAsCQANAIAAgAyIDai0AAEH/AUcNASADQQFqIgQhAyAEIAJGDQUMAAsAC0HoL0GrygBBJEHhKBCABgALQa3WAEGrygBBHkHhKBCABgALQZveAEGrygBBIEHhKBCABgALQYsxQavKAEEhQeEoEIAGAAsgACABIAIQngYaC30BAX8CQAJAAkBBACgC4PoBIgFFDQAgACABayIBQQBIDQEgAUEAKALk+gFBgGBqSw0BIAFB/x9xDQIgAEH/AUGAIBCgBhoPC0Gt1gBBq8oAQSlBxTQQgAYAC0GX2ABBq8oAQStBxTQQgAYAC0Hj4ABBq8oAQSxBxTQQgAYAC0cBA39BqcQAQQAQO0EAKALg+gEhAEEAKALk+gEhAQJAA0AgAUF/aiICQQBIDQEgAiEBIAAgAmotAABBN0YNAAsgACACEAALCyoBAn9BABABIgA2AuT6AUEAIAAQ5QYiATYC4PoBIAFBNyAAEKAGIAAQAgsFABADAAsCAAsCAAsCAAscAQF/AkAgABDlBiIBDQAQAwALIAFBACAAEKAGCwcAIAAQ5gYLBABBAAsKAEHo+gEQrQYaCwoAQej6ARCuBhoLYQICfwF+IwBBEGsiASQAAkACQCAAEM0GQRBHDQAgAUEIaiAAEP8FQQhHDQAgASkDCCEDDAELIAAgABDNBiICEPIFrUIghiAAQQFqIAJBf2oQ8gWthCEDCyABQRBqJAAgAwsIACAAIAEQBAsIABA8IAAQBQsGACAAEAYLCAAgACABEAcLCAAgARAIQQALEwBBACAArUIghiABrIQ3A+DtAQsNAEEAIAAQJDcD4O0BCycAAkBBAC0AhPsBDQBBAEEBOgCE+wEQQEGk7gBBABBDEJAGEOQFCwtwAQJ/IwBBMGsiACQAAkBBAC0AhPsBQQFHDQBBAEECOgCE+wEgAEErahDzBRCGBiAAQRBqQeDtAUEIEP4FIAAgAEErajYCBCAAIABBEGo2AgBBmBkgABA7CxDqBRBFQQAoApCQAiEBIABBMGokACABCy0AAkAgAEECaiAALQACQQpqEPUFIAAvAQBGDQBBgNkAQQAQO0F+DwsgABCRBgsIACAAIAEQcQsJACAAIAEQ/QMLCAAgACABEDkLFQACQCAARQ0AQQEQ4QIPC0EBEOICCwkAQQApA+DtAQsOAEGME0EAEDtBABAJAAueAQIBfAF+AkBBACkDiPsBQgBSDQACQAJAEApEAAAAAABAj0CiIgBEAAAAAAAA8ENjIABEAAAAAAAAAABmcUUNACAAsSEBDAELQgAhAQtBACABQoV/fDcDiPsBCwJAAkAQCkQAAAAAAECPQKIiAEQAAAAAAADwQ2MgAEQAAAAAAAAAAGZxRQ0AIACxIQEMAQtCACEBCyABQQApA4j7AX0LBgAgABALCwIACwYAEBoQdAsdAEGQ+wEgATYCBEEAIAA2ApD7AUECQQAQmgVBAAvNBAEBfyMAQRBrIgQkAAJAAkACQAJAAkAgAUF/ag4QAwIEBAQEBAQEBAQEBAQEAQALIAFBMEcNA0GQ+wEtAAxFDQMCQAJAQZD7ASgCBEGQ+wEoAggiAmsiAUHgASABQeABSBsiAQ0AQZD7AUEUahDSBSECDAELQZD7AUEUakEAKAKQ+wEgAmogARDRBSECCyACDQNBkPsBQZD7ASgCCCABajYCCCABDQNBwzVBABA7QZD7AUGAAjsBDEEAECcMAwsgAkUNAkEAKAKQ+wFFDQJBkPsBKAIQIAJHDQICQCADLQADQQFxDQAgAy8BDkGAAUcNAEGpNUEAEDtBkPsBQRRqIAMQzAUNAEGQ+wFBAToADAtBkPsBLQAMRQ0CAkACQEGQ+wEoAgRBkPsBKAIIIgJrIgFB4AEgAUHgAUgbIgENAEGQ+wFBFGoQ0gUhAgwBC0GQ+wFBFGpBACgCkPsBIAJqIAEQ0QUhAgsgAg0CQZD7AUGQ+wEoAgggAWo2AgggAQ0CQcM1QQAQO0GQ+wFBgAI7AQxBABAnDAILQZD7ASgCECIBRQ0BIAFBACABLQAEa0EMbGpBXGogAkcNAUGZ7ABBE0EBQQAoAoDtARCsBhpBkPsBQQA2AhAMAQtBACgCkPsBRQ0AQZD7ASgCEA0AIAIpAwgQ8wVRDQBBkPsBIAJBq9TTiQEQngUiATYCECABRQ0AIARBC2ogAikDCBCGBiAEIARBC2o2AgBB5RogBBA7QZD7ASgCEEGAAUGQ+wFBBGpBBBCfBRoLIARBEGokAAtPAQF/IwBBEGsiAiQAIAIgATYCDCAAIAEQtAUCQEGw/QFBwAJBrP0BELcFRQ0AA0BBsP0BEDZBsP0BQcACQaz9ARC3BQ0ACwsgAkEQaiQACy8AAkBBsP0BQcACQaz9ARC3BUUNAANAQbD9ARA2QbD9AUHAAkGs/QEQtwUNAAsLCzMAEEUQNwJAQbD9AUHAAkGs/QEQtwVFDQADQEGw/QEQNkGw/QFBwAJBrP0BELcFDQALCwsIACAAIAEQDAsIACAAIAEQDQsFABAOGgsEABAPCwsAIAAgASACEPgECxcAQQAgADYC9P8BQQAgATYC8P8BEJYGCwsAQQBBAToA+P8BCzYBAX8CQEEALQD4/wFFDQADQEEAQQA6APj/AQJAEJgGIgBFDQAgABCZBgtBAC0A+P8BDQALCwsmAQF/AkBBACgC9P8BIgENAEF/DwtBACgC8P8BIAAgASgCDBEDAAvSAgECfyMAQTBrIgYkAAJAAkACQAJAIAIQxgUNACAAIAFBkTxBABDZAwwBCyAGIAQpAwA3AxggASAGQRhqIAZBLGoQ8AMiB0UNAQJAQQEgAkEDcXQgA2ogBigCLE0NAAJAIAVFDQAgBkEgaiABQbc3QQAQ2QMLIABCADcDAAwBCyAHIANqIQMCQCAFRQ0AIAYgBCkDADcDECABIAZBEGoQ7gNFDQMgBiAFKQMANwMgAkACQCAGKAIkQX9HDQAgAyACIAYoAiAQyAUMAQsgBiAGKQMgNwMIIAMgAiABIAZBCGoQ6gMQxwULIABCADcDAAwBCwJAIAJBB0sNACADIAIQyQUiAUGBgICAeGpBAkkNACAAIAEQ5wMMAQsgACADIAIQygUQ5gMLIAZBMGokAA8LQczWAEG7yABBFUHiIhCABgALQb7lAEG7yABBIUHiIhCABgAL5AMBAn8gAygCACEFAkACQAJAAkACQAJAAkACQAJAAkAgAkEEdEEwcSACQQR2ckF/IAJBDHFBDEYbQQFqDggBAwQHAAIICAkLIARBAEchAgJAIAQNAEEAIQYgAiEEDAYLIAUtAAANBEEAIQYgAiEEDAULAkAgAhDGBQ0AIAAgAUGRPEEAENkDDwsCQEEBIAJBA3F0IgEgBE0NACAAQgA3AwAPCyADIAMoAgAgAWo2AgACQCACQQdLDQAgBSACEMkFIgRBgYCAgHhqQQJJDQAgACAEEOcDDwsgACAFIAIQygUQ5gMPCwJAIAQNACAAQgA3AwAPCyADIAVBAWo2AgAgAEHQigFB2IoBIAUtAAAbKQMANwMADwsgAEIANwMADwsCQCABIAUgBBCTASICDQAgAEIANwMADwsgAyADKAIAIARqNgIAIAAgAUEIIAIQ6QMPC0EAIQYCQAJAA0AgBkEBaiICIARGDQEgAiEGIAUgAmotAAANAAsgAiEGDAELIAQhBgsgBiEGIAIgBEkhBAsgAyAFIAYiAmogBGo2AgAgACABQQggASAFIAIQmAEQ6QMPCyADIAUgBGo2AgAgACABQQggASAFIAQQmAEQ6QMPCyAAIAFBtRgQ2gMPCyAAIAFBlxIQ2gML7AMBA38jAEHAAGsiBSQAIAFBBHRBMHEgAUEEdnJBfyABQQxxQQxGGyIGIQcCQAJAAkACQAJAAkAgBkEBag4IAAUCAgIBAwMECwJAIAEQxgUNACAFQThqIABBkTxBABDZA0EAIQcMBQsCQEEBIAFBA3F0IgcgA00NACAHIQcMBQsCQCAEKAIEQX9HDQAgAiABIAQoAgAQyAUgByEHDAULIAUgBCkDADcDCCACIAEgACAFQQhqEOoDEMcFIAchBwwECwJAIAMNAEEBIQcMBAsgBSAEKQMANwMQIAJBACAAIAVBEGoQ7ANrOgAAQQEhBwwDCyAFIAQpAwA3AyggACAFQShqIAVBNGoQ8AMiByEBAkACQCAHDQAgBSAEKQMANwMgIAVBOGogACAFQSBqEMsDIAQgBSkDODcDACAFIAQpAwA3AxggACAFQRhqIAVBNGoQ8AMiByEBIAcNAEEAIQEMAQsgASEHAkAgBSgCNCADTQ0AIAUgAzYCNAsgAiAHIAUoAjQiARCeBiEHAkAgBkEDRw0AIAEgA08NACAHIAFqQQA6AAAgBSABQQFqNgI0CyAFKAI0IQELIAEhBwwCCyAFQThqIABBtRgQ2gNBACEHDAELIAVBOGogAEGXEhDaA0EAIQcLIAVBwABqJAAgBwuYAQEDfyMAQRBrIgMkAAJAAkAgAUHvAEsNAEG2KUEAEDtBACEEDAELIAAgARD9AyEFIAAQ/ANBACEEIAUNAEHYCBAfIgQgAi0AADoApAIgBCAELQAGQQhyOgAGELsDIAAgARC8AyAEQdYCaiIBEL0DIAMgATYCBCADQSA2AgBBtSMgAxA7IAQgABBLIAQhBAsgA0EQaiQAIAQLxwEAIAAgATYC5AFBAEEAKAL8/wFBAWoiATYC/P8BIAAgATYCnAIgABCaATYCoAIgACAAIAAoAuQBLwEMQQN0EIoBNgIAIAAoAqACIAAQmQEgACAAEJEBNgLYASAAIAAQkQE2AuABIAAgABCRATYC3AECQAJAIAAvAQgNACAAEIABIAAQ3QIgABDeAiAALwEIDQAgABCHBA0BIABBAToAQyAAQoCAgIAwNwNYIABBAEEBEH0aCw8LQcHiAEGNxgBBJUGlCRCABgALKgEBfwJAIAAtAAZBCHENACAAKAKIAiAAKAKAAiIERg0AIAAgBDYCiAILCxkAAkAgAUUNACABIAAvAQo2AgALIAAvAQgLwAMBAX8CQAJAAkAgAEUNACAALQAGIgRBAXENASAAIARBAXI6AAYCQCABQTBGDQAgABCAAQsCQCAALQAGIgRBEHFFDQAgACAEQRBzOgAGIAAoAuwBRQ0AIABBAToASAJAIAAtAEVFDQAgABDVAwsCQCAAKALsASIERQ0AIAQQfwsgAEEAOgBIIAAQgwELAkACQAJAAkACQAJAIAFBcGoOMQACAQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBAUFBQUFBQUFBQUFBQUFBQMFCwJAIAAtAAZBCHENACAAKAKIAiAAKAKAAiIERg0AIAAgBDYCiAILIAAgAiADENgCDAQLIAAtAAZBCHENAyAAKAKIAiAAKAKAAiIDRg0DIAAgAzYCiAIMAwsCQCAALQAGQQhxDQAgACgCiAIgACgCgAIiBEYNACAAIAQ2AogCCyAAQQAgAxDYAgwCCyAAIAMQ3AIMAQsgABCDAQsgABCCARDCBSAALQAGIgNBAXFFDQIgACADQf4BcToABiABQTBHDQAgABDbAgsPC0Gi3QBBjcYAQdAAQa8fEIAGAAtBu+EAQY3GAEHVAEGmMhCABgALtwEBAn8gABDfAiAAEIEEAkAgAC0ABiIBQQFxDQAgACABQQFyOgAGIABB9ARqEK0DIAAQeiAAKAKgAiAAKAIAEIwBAkAgAC8BTEUNAEEAIQEDQCAAKAKgAiAAKAL0ASABIgFBAnRqKAIAEIwBIAFBAWoiAiEBIAIgAC8BTEkNAAsLIAAoAqACIAAoAvQBEIwBIAAoAqACEJsBIABBAEHYCBCgBhoPC0Gi3QBBjcYAQdAAQa8fEIAGAAsSAAJAIABFDQAgABBPIAAQIAsLPwEBfyMAQRBrIgIkACAAQQBBHhCdARogAEF/QQAQnQEaIAIgATYCAEHV5AAgAhA7IABB5NQDEHYgAkEQaiQACw0AIAAoAqACIAEQjAELAgALdQEBfwJAAkACQCABLwEOIgJBgH9qDgIAAQILIABBAiABEFUPCyAAQQEgARBVDwsCQCACQYAjRg0AAkACQCAAKAIIKAIMIgBFDQAgASAAEQQAQQBKDQELIAEQ2wUaCw8LIAEgACgCCCgCBBEIAEH/AXEQ1wUaC9kBAQN/IAItAAwiA0EARyEEAkACQCADDQBBACEFIAQhBAwBCwJAIAItABANAEEAIQUgBCEEDAELQQAhBQJAAkADQCAFQQFqIgQgA0YNASAEIQUgAiAEakEQai0AAA0ACyAEIQUMAQsgAyEFCyAFIQUgBCADSSEECyAFIQUCQCAEDQBBhxVBABA7DwsCQCAAKAIIKAIEEQgARQ0AAkAgASACQRBqIgQgBCAFQQFqIgVqIAItAAwgBWsgACgCCCgCABEJAEUNAEH6P0EAEDtByQAQHA8LQYwBEBwLCzUBAn9BACgCgIACIQNBgAEhBAJAAkACQCAAQX9qDgIAAQILQYEBIQQLIAMgBCABIAIQjwYLCxsBAX9BuPAAEOMFIgEgADYCCEEAIAE2AoCAAgsuAQF/AkBBACgCgIACIgFFDQAgASgCCCIBRQ0AIAEoAhAiAUUNACAAIAERAAALC8IBAQV/AkAgAC0ACkUNACAAQRRqIgEhAgNAAkACQAJAIAAvAQwiAyAALwEOIgRLDQAgAhDSBRogAEEAOgAKIAAoAhAQIAwBCwJAAkAgASAAKAIQIAAtAAsiBSAEbGogAyAEayIEQcgBIARByAFJG0EBIAVBAUYbIgQgBWwQ0QUOAgAFAQsgACAALwEOIARqOwEODAILIAAtAApFDQEgARDSBRogAEEAOgAKIAAoAhAQIAsgAEEANgIQCyAALQAKDQALCwttAQN/AkBBACgChIACIgFFDQACQBBwIgJFDQAgAiABLQAGQQBHEIAEIAJBADoASSACIAEtAAhBAEdBAXQiAzoASSABLQAHRQ0AIAIgA0EBcjoASQsCQCABLQAGDQAgAUEAOgAJCyAAQQYQhAQLC6QVAgd/AX4jAEGAAWsiAiQAIAIQcCIDNgJYIAIgATYCVCACIAA2AlACQAJAAkAgA0UNACAALQAJDQELAkACQAJAIAEvAQ4iBEH/fmoOEgAAAAEDAwMDAwMDAwMDAwICAgMLAkAgAC0ACkUNACAAQRRqENIFGiAAQQA6AAogACgCEBAgIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQywUaIAAgAS0ADjoACgwDCyACQfgAakEAKALwcDYCACACQQApAuhwNwNwIAEtAA0gBCACQfAAakEMEJcGGgwBCyADRQ0BCwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAEvAQ5BgH9qDhcCAwQGBwUNDQ0NDQ0NDQ0NAAEICgkLDA0LIAEtAAxFDQ8gAUEQaiEFQQAhAANAIAMgBSAAIgBqKAIAQQAQhQQaIABBBGoiBCEAIAQgAS0ADEkNAAwQCwALIAEtAAxFDQ4gAUEQaiEFQQAhAANAIAMgBSAAIgBqKAIAEIIEGiAAQQRqIgQhACAEIAEtAAxJDQAMDwsAC0EAIQECQCADRQ0AIAMoAvABIQELAkAgASIADQBBACEFDA0LQQAhASAAIQADQCABQQFqIgEhBSABIQEgACgCACIEIQAgBA0ADA0LAAtBACEAAkAgAyABQRxqKAIAEHwiBkUNACAGKAIoIQALAkAgACIBDQBBACEFDAsLIAEhAUEAIQADQCAAQQFqIgAhBSABKAIMIgQhASAAIQAgBA0ADAsLAAsCQCABLQAgQfABcUHQAEcNACABQdAAOgAgCwJAAkAgAS0AICIEQQJGDQAgBEHQAEcNAUEAIQQCQCABQRxqKAIAIgVFDQAgAyAFEJwBIAUhBAtBACEFAkAgBCIDRQ0AIAMtAANBD3EhBQtBACEEAkACQAJAAkAgBUF9ag4GAQMDAwMAAwsgAygCEEEIaiEEDAELIANBCGohBAsgBC8BACEECwJAIARB//8DcSIEDQACQCAALQAKRQ0AIABBFGoQ0gUaIABBADoACiAAKAIQECAgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARDLBRogACABLQAOOgAKDA4LAkACQCADDQBBACEBDAELIAMtAANBD3EhAQsCQAJAAkAgAUF9ag4GAAICAgIBAgsgAkHQAGogBCADKAIMEFwMDwsgAkHQAGogBCADQRhqEFwMDgtBn8sAQY0DQcA8EPsFAAsgAUEcaigCAEHkAEcNACACQdAAaiADKALkAS8BDCADKAIAEFwMDAsCQCAALQAKRQ0AIABBFGoQ0gUaIABBADoACiAAKAIQECAgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARDLBRogACABLQAOOgAKDAsLIAJB8ABqIAMgAS0AICABQRxqKAIAEF0gAkEANgJgIAIgAikDcDcDIAJAIAMgAkEgahDxAyIERQ0AIAQoAgBBgICA+ABxQYCAgNgARw0AIAJB6ABqIANBCCAEKAIcEOkDIAIgAikDaDcDcAsgAiACKQNwNwMYAkACQCADIAJBGGoQ7QMNACACIAIpA3A3AxBBACEEIAMgAkEQahDDA0UNAQsgAiACKQNwNwMIIAMgAkEIaiACQeAAahDwAyEECyAEIQUCQCACKAJgIgQgAUEiai8BACIDSw0AAkAgAC0ACkUNACAAQRRqENIFGiAAQQA6AAogACgCEBAgIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQywUaIAAgAS0ADjoACgwLCyACIAQgA2siADYCYCACIAAgAUEkai8BACIBIAAgAUkbIgE2AmAgAkHQAGpBASABEF4iAUUNCiABIAUgA2ogAigCYBCeBhoMCgsgAkHwAGogAyABLQAgIAFBHGooAgAQXSACIAIpA3A3AzAgAkHQAGpBECADIAJBMGpBABBfIgEQXiIARQ0JIAIgAikDcDcDKCABIAMgAkEoaiAAEF9GDQlB9dkAQZ/LAEGUBEHJPhCABgALIAJB4ABqIAMgAUEUai0AACABKAIQEF0gAiACKQNgIgk3A2ggAiAJNwM4IAMgAkHwAGogAkE4ahBgIAEtAA0gAS8BDiACQfAAakEMEJcGGgwICyADEIEEDAcLIABBAToABgJAEHAiAUUNACABIAAtAAZBAEcQgAQgAUEAOgBJIAEgAC0ACEEAR0EBdCIEOgBJIAAtAAdFDQAgASAEQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLIANFDQZBoxJBABA7IAMQgwQMBgsgAEEAOgAJIANFDQVB8jVBABA7IAMQ/wMaDAULIABBAToABgJAEHAiA0UNACADIAAtAAZBAEcQgAQgA0EAOgBJIAMgAC0ACEEAR0EBdCIBOgBJIAAtAAdFDQAgAyABQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLEGkMBAsCQCADRQ0AAkACQCABKAIQIgQNACACQgA3A3AMAQsgAiAENgJwIAJBCDYCdCADIAQQnAELIAIgAikDcDcDSAJAAkAgAyACQcgAahDxAyIEDQBBACEFDAELIAQoAgBBgICA+ABxQYCAgMAARiEFCwJAAkAgBSIHDQAgAiABKAIQNgJAQfcKIAJBwABqEDsMAQsgA0EBQQMgAS0ADEF4aiIFQQRJGyIIOgAHAkAgAUEUai8BACIGQQFxRQ0AIAMgCEEIcjoABwsCQCAGQQJxRQ0AIAMgAy0AB0EEcjoABwsgAyAENgKsAiAFQQRJDQAgBUECdiIEQQEgBEEBSxshBSABQRhqIQZBACEBA0AgAyAGIAEiAUECdGooAgBBARCFBBogAUEBaiIEIQEgBCAFRw0ACwsgB0UNBCAAQQA6AAkgA0UNBEHyNUEAEDsgAxD/AxoMBAsgAEEAOgAJDAMLAkAgACABQcjwABDdBSIDQYB/akECSQ0AIANBAUcNAwsCQBBwIgNFDQAgAyAALQAGQQBHEIAEIANBADoASSADIAAtAAhBAEdBAXQiAToASSAALQAHRQ0AIAMgAUEBcjoASQsgAC0ABg0CIABBADoACQwCCyACQdAAakEQIAUQXiIHRQ0BAkACQCAGDQBBACEBDAELIAYoAighAQsgASIBRQ0BIAEhAUEAIQADQCACQfAAaiADQQggASIBEOkDIAcgACIFQQR0aiIAIAIoAnA2AgAgACABLwEENgIEQQAhBAJAIAEoAggiBkUNACACQfAAaiADQQggBhDpAyACKAJwIQQLIAAgBDYCCCAAQc+GfyABKAIQIgQgAygA5AEiBiAGKAIgaiIGa0EEdiAEIAZGGzsBDCABKAIMIgQhASAFQQFqIQAgBA0ADAILAAsgAkHQAGpBCCAFEF4iB0UNAAJAAkAgAw0AQQAhAQwBCyADKALwASEBCyABIgFFDQBBACEAIAEhAQNAIAcgACIFQQN0aiIAIAEiASgCHDYCACAAIAEvARYiBEHPhn8gBBs7AQRBACEEAkAgASgCKCIGRQ0AQc+GfyAGKAIQIgQgAygA5AEiBiAGKAIgaiIGa0EEdiAEIAZGGyEECyAAIAQ7AQYgBUEBaiEAIAEoAgAiBCEBIAQNAAsLIAJBgAFqJAALnAIBBX8jAEEQayIDJAACQCAAKAIEIgQvAQ5BggFHDQACQAJAIARBImovAQAiBSABSQ0AAkAgACgCACIBLQAKRQ0AIAFBFGoQ0gUaIAFBADoACiABKAIQECAgAUEANgIQCyABQgA3AgwgAUEBOgALIAFBFGogACgCBBDLBRogASAAKAIELQAOOgAKDAELIABBDCABIAVrIgEgBEEkai8BACIEIAEgBEkbIgYQXiIHRQ0AIAZFDQAgAiAFQQN0aiEFQQAhAQNAIAAoAgghBCADIAUgASIBQQN0aikDADcDCCAEIAcgAUEMbGogA0EIahBgIAFBAWoiBCEBIAQgBkcNAAsLIANBEGokAA8LQZnTAEGfywBB5gJB0BcQgAYAC+MEAgN/AX4jAEEQayIEJAAgAyEFAkACQAJAAkACQAJAAkACQAJAAkACQAJAQdAAIAIgAkHwAXFB0ABGGyICQX9qDlAAAQIJAwkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBAQEBAkJCQkJCQkJCQkJCQYFCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBwkLIAAgAxDnAwwKCwJAAkACQAJAIAMOBAECAwAKCyAAQQApA/CKATcDAAwMCyAAQgA3AwAMCwsgAEEAKQPQigE3AwAMCgsgAEEAKQPYigE3AwAMCQsgACADNgIAIABBATYCBAwICyAAIAEgAxCqAwwHCyAAIAEgAkFgaiADEIwEDAYLAkBBACADIANBz4YDRhsiAyABKADkAUEkaigCAEEEdkkNAAJAIANB0IYDTw0AIAMhBQwFCyADQQAvAejtAUHQhgNqSQ0AIAMhBQwECyAAIAM2AgAgAEEDNgIEDAULQQAhBQJAIAEvAUwgA00NACABKAL0ASADQQJ0aigCACEFCwJAIAUiBg0AIAMhBQwDCwJAAkAgBigCDCIFRQ0AIAAgAUEIIAUQ6QMMAQsgACADNgIAIABBAjYCBAsgAyEFIAZFDQIMBAsCQCADDQAgAEIANwMADAQLIAAgAzYCACAAQQg2AgQgASADEJwBDAMLIAMhBSADQeUARg0BCyAEIAU2AgQgBCACNgIAQcAKIAQQOyAAQgA3AwAMAQsCQCABKQA4IgdCAFINACABKALsASIDRQ0AIAAgAykDIDcDAAwBCyAAIAc3AwALIARBEGokAAvQAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQ0gUaIANBADoACiADKAIQECAgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQHyEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDLBRogAyAAKAIELQAOOgAKIAMoAhAPC0Gw2wBBn8sAQTFB9MMAEIAGAAvWAgECfyMAQcAAayIDJAAgAyACNgI8IAMgASkDADcDIEEAIQICQCADQSBqEPQDDQAgAyABKQMANwMYAkACQCAAIANBGGoQkwMiAg0AIAMgASkDADcDECAAIANBEGoQkgMhAQwBCwJAIAAgAhCUAyIBDQBBACEBDAELAkAgACACEPQCDQAgASEBDAELQQAgASACKAIAQYCAgPgAcUGAgIDIAEYbIQELAkACQCABIgQNAEEAIQEMAQsCQCADKAI8IgFFDQAgAyABQRBqNgI8IANBMGpB/AAQxwMgA0EoaiAAIAQQqwMgAyADKQMwNwMIIAMgAykDKDcDACAAIAEgA0EIaiADEGMLQQEhAQsgASEBAkAgAg0AIAEhAgwBCwJAIAMoAjxFDQAgACACIANBPGpBBRDvAiABaiECDAELIAAgAkEAQQAQ7wIgAWohAgsgA0HAAGokACACC/gHAQN/IwBB0ABrIgMkACABQQhqQQA2AgAgAUIANwIAIAMgAikDADcDMAJAAkACQAJAAkACQCAAIANBMGogA0HIAGogA0HEAGoQigMiBEEASA0AAkAgAygCRCIFRQ0AIAMpA0hQDQAgAigCBCIAQYCAwP8HcQ0DIABBCHFFDQMgAUHXADoACiABIAIoAgA2AgAMAgsCQAJAIAVFDQAgA0E4aiAAQQggBRDpAyACIAMpAzg3AwAMAQsgAiADKQNINwMACyABIARBz4Z/IAQbOwEICyACKAIAIQQCQAJAAkACQAJAQRAgAigCBCIFQQ9xIAVBgIDA/wdxGw4JAQQEBAAEAwQCBAsgASAEQf//AHE2AgAgASAEQQ52QSBqOgAKDAQLIARBoH9qIgVBK0sNAiABIAU2AgAgAUEFOgAKDAMLAkACQCAEDQBBACEFDAELIAQtAANBD3EhBQsCQCAFQXxqDgYAAgICAgACCyABIAQ2AgAgAUHSADoACiADIAIpAwA3AyggASAAIANBKGpBABBfNgIEDAILIAEgBDYCACABQTI6AAoMAQsgAyACKQMANwMgAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAgA0EgahDzAw4NAQQLBQkGAwcLCAoCAAsLIAFBAzYCACABQQI6AAoMCwsgAUEANgIAIAFBAjoACgwKCyABQQY6AAogASACKQMANwIADAkLIAFBAjoACiADIAIpAwA3AwAgAUEBQQIgACADEOwDGzYCAAwICyABQQE6AAogAyACKQMANwMIIAEgACADQQhqEOoDOQIADAcLIAFB0QA6AAogAigCACECIAEgBDYCACABIAIvAQhBgICAgHhyNgIEDAYLIAEgBDYCACABQTA6AAogAyACKQMANwMQIAEgACADQRBqQQAQXzYCBAwFCyABIAQ2AgAgAUEDOgAKDAQLIAIoAgQiBUGAgMD/B3ENBSAFQQ9xQQhHDQUgAyACKQMANwMYIAAgA0EYahDDA0UNBSABIAQ2AgAgAUHUADoACgwDCyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICAKEcNBSABIAQ2AgAgAUHTADoACiABIAIvAQRBgICAgHhyNgIEDAILIAIoAgAiAkUNBSACKAIAQYCAgPgAcUGAgIDYAEcNBSABIAQ2AgAgAUHWADoACiABIAIoAhwvAQRBgICAgHhyNgIEDAELIAFBBzoACiABIAIpAwA3AgALIANB0ABqJAAPC0HX4gBBn8sAQZMBQfQyEIAGAAtBoOMAQZ/LAEH0AUH0MhCABgALQd7UAEGfywBB+wFB9DIQgAYAC0H00gBBn8sAQYQCQfQyEIAGAAuEAQEEfyMAQRBrIgEkACABIAAtAEY2AgBBACgChIACIQJBssIAIAEQOyAAKALsASIDIQQCQCADDQAgACgC8AEhBAtBACEDAkAgBCIERQ0AIAQoAhwhAwsgASADNgIIIAEgAC0ARjoADCACQQE6AAkgAkGAASABQQhqQQgQjwYgAUEQaiQACxAAQQBB2PAAEOMFNgKEgAILhwIBAn8jAEEgayIEJAAgBCACKQMANwMIIAAgBEEQaiAEQQhqEGACQAJAAkACQCAELQAaIgVBX2pBA0kNAEEAIQIgBUHUAEcNASAEKAIQIgUhAiAFQYGAgIB4cUGBgICAeEcNAUHe1gBBn8sAQaICQbYyEIAGAAsgBUEYdCICQX9MDQEgBCgCEEEBdCIFQYCAgAhPDQIgAiAFckGBgICAeHIhAgsgASACNgIAIAQgAykDADcDACAAIARBEGogBBBgIAFBDGogBEEYaigCADYAACABIAQpAxA3AAQgBEEgaiQADwtB098AQZ/LAEGcAkG2MhCABgALQZTfAEGfywBBnQJBtjIQgAYAC0kBAn8jAEEQayIEJAAgASgCACEFIAQgAikDADcDCCAEIAMpAwA3AwAgACAFIARBCGogBBBjIAEgASgCAEEQajYCACAEQRBqJAALkgQBBX8jAEEQayIBJAACQCAAKAI0IgJBAEgNAAJAAkAgACgCGCIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEEIAMoAghBq5bxk3tGDQELQQAhBAsCQAJAIAQiAw0AQQAhBAwBCyADKAIEIQQLAkAgAiAEIgRIDQAgAEE4ahDSBRogAEF/NgI0DAELAkACQCAAQThqIgUgAyACakGAAWogBEHsASAEQewBSBsiAhDRBQ4CAAIBCyAAIAAoAjQgAmo2AjQMAQsgAEF/NgI0IAUQ0gUaCwJAIABBDGpBgICABBD9BUUNAAJAIAAtAAgiAkEBcQ0AIAAtAAdFDQELIAAoAhwNACAAIAJB/gFxOgAIIAAQZgsCQCAAKAIcIgJFDQAgAiABQQhqEE0iAkUNACABIAEoAgg2AgQgAUEAIAIgAkHg1ANGGzYCACAAQYABIAFBCBCPBgJAIAAoAhwiA0UNACADEFAgAEEANgIcQe8oQQAQOwtBACEDAkAgACgCHCIEDQACQAJAIAAoAhgiA0UNACADKAIAQdP6qux4Rw0AIAMhBSADKAIIQauW8ZN7Rg0BC0EAIQULAkAgBSIFRQ0AQQMhAyAFKAIEDQELQQQhAwsgASADNgIMIAAgBEEARzoABiAAQQQgAUEMakEEEI8GIABBACgCgPsBQYCAwABBgIDAAiACQeDUA0YbajYCDAsgAUEQaiQAC8wDAgV/An4jAEEQayIBJAACQAJAIAAoAhgiAkUNACACKAIAQdP6qux4Rw0AIAIhAyACKAIIQauW8ZN7Rg0BC0EAIQMLAkACQCADIgJFDQAgAigCBCIDRQ0AIAJBgAFqIgQgAxD9Aw0AAkACQCAAKAIYIgNFDQAgAygCAEHT+qrseEcNACADIQUgAygCCEGrlvGTe0YNAQtBACEFCwJAIAUiA0UNACADQewBaigCAEUNACADIANB6AFqKAIAakGAAWoiAxCrBQ0AAkAgAykDECIGUA0AIAApAxAiB1ANACAHIAZRDQBB+NcAQQAQOwsgACADKQMQNwMQCwJAIAApAxBCAFINACAAQgE3AxALIAAgBCACKAIEEGcMAQsCQCAAKAIcIgJFDQAgAhBQCyABIAAtAAQ6AAggAEGQ8QBBoAEgAUEIahBKNgIcC0EAIQICQCAAKAIcIgMNAAJAAkAgACgCGCICRQ0AIAIoAgBB0/qq7HhHDQAgAiEEIAIoAghBq5bxk3tGDQELQQAhBAsCQCAEIgRFDQBBAyECIAQoAgQNAQtBBCECCyABIAI2AgwgACADQQBHOgAGIABBBCABQQxqQQQQjwYgAUEQaiQAC34BAn8jAEEQayIDJAACQCAAKAIcIgRFDQAgBBBQCyADIAAtAAQ6AAggACABIAIgA0EIahBKIgI2AhwCQCABQZDxAEYNACACRQ0AQcI2QQAQsgUhASADQeMmQQAQsgU2AgQgAyABNgIAQcgZIAMQOyAAKAIcEFoLIANBEGokAAuvAQEEfyMAQRBrIgEkAAJAIAAoAhwiAkUNACACEFAgAEEANgIcQe8oQQAQOwtBACECAkAgACgCHCIDDQACQAJAIAAoAhgiAkUNACACKAIAQdP6qux4Rw0AIAIhBCACKAIIQauW8ZN7Rg0BC0EAIQQLAkAgBCIERQ0AQQMhAiAEKAIEDQELQQQhAgsgASACNgIMIAAgA0EARzoABiAAQQQgAUEMakEEEI8GIAFBEGokAAvUAQEFfyMAQRBrIgAkAAJAQQAoAoiAAiIBKAIcIgJFDQAgAhBQIAFBADYCHEHvKEEAEDsLQQAhAgJAIAEoAhwiAw0AAkACQCABKAIYIgJFDQAgAigCAEHT+qrseEcNACACIQQgAigCCEGrlvGTe0YNAQtBACEECwJAIAQiBEUNAEEDIQIgBCgCBA0BC0EEIQILIAAgAjYCDCABIANBAEc6AAYgAUEEIABBDGpBBBCPBiABQQAoAoD7AUGAkANqNgIMIAEgAS0ACEEBcjoACCAAQRBqJAALswMBBX8jAEGQAWsiASQAIAEgADYCAEEAKAKIgAIhAkHDzgAgARA7QX8hAwJAIABBH3ENAAJAIAIoAhwiA0UNACADEFAgAkEANgIcQe8oQQAQOwtBACEDAkAgAigCHCIEDQACQAJAIAIoAhgiA0UNACADKAIAQdP6qux4Rw0AIAMhBSADKAIIQauW8ZN7Rg0BC0EAIQULAkAgBSIFRQ0AQQMhAyAFKAIEDQELQQQhAwsgASADNgIIIAIgBEEARzoABiACQQQgAUEIakEEEI8GIAJB0y0gAEGAAWoQvgUiAzYCGAJAIAMNAEF+IQMMAQsCQCAADQBBACEDDAELIAEgADYCDCABQdP6qux4NgIIIAMgAUEIakEIEMAFGhDBBRogAkGAATYCIEEAIQACQCACKAIcIgMNAAJAAkAgAigCGCIARQ0AIAAoAgBB0/qq7HhHDQAgACEEIAAoAghBq5bxk3tGDQELQQAhBAsCQCAEIgRFDQBBAyEAIAQoAgQNAQtBBCEACyABIAA2AowBIAIgA0EARzoABiACQQQgAUGMAWpBBBCPBkEAIQMLIAFBkAFqJAAgAwv9AwEFfyMAQbABayICJAACQAJAQQAoAoiAAiIDKAIgIgQNAEF/IQMMAQsgAygCGCEFAkAgAA0AIAJBKGpBAEGAARCgBhogAkGrlvGTezYCMCACIAVBgAFqIAUoAgQQ8gU2AjQCQCAFKAIEIgFBgAFqIgAgAygCICIERg0AIAIgATYCBCACIAAgBGs2AgBBp+kAIAIQO0F/IQMMAgsgBUEIaiACQShqQQhqQfgAEMAFGhDBBRpB1SdBABA7AkAgAygCHCIBRQ0AIAEQUCADQQA2AhxB7yhBABA7C0EAIQECQCADKAIcIgUNAAJAAkAgAygCGCIBRQ0AIAEoAgBB0/qq7HhHDQAgASEAIAEoAghBq5bxk3tGDQELQQAhAAsCQCAAIgBFDQBBAyEBIAAoAgQNAQtBBCEBCyACIAE2AqwBIAMgBUEARzoABiADQQQgAkGsAWpBBBCPBiADQQNBAEEAEI8GIANBACgCgPsBNgIMQQAhAwwBCyAFKAIEQYABaiEGAkACQAJAIAFBH3ENACABQf8fSw0AIAQgAWogBk0NAQsgAiAGNgIYIAIgBDYCFCACIAE2AhBB6ucAIAJBEGoQO0EAIQFBfyEFDAELIAUgBGogACABEMAFGiADKAIgIAFqIQFBACEFCyADIAE2AiAgBSEDCyACQbABaiQAIAMLhwEBAn8CQAJAQQAoAoiAAigCGCIBRQ0AIAEoAgBB0/qq7HhHDQAgASECIAEoAghBq5bxk3tGDQELQQAhAgsCQCACIgFFDQAQuwMgAUGAAWogASgCBBC8AyAAEL0DQQAPCyAAQgA3AAAgAEEYakIANwAAIABBEGpCADcAACAAQQhqQgA3AABBfwvlBQECfyMAQSBrIgIkAAJAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBgECAwQHBQALAkACQCADQYB/ag4CAAEHCyABKAIQEGoNCSABIABBJGpBCEEJEMMFQf//A3EQ2AUaDAkLIABBOGogARDLBQ0IIABBADYCNAwICwJAAkAgACgCGCIDDQBBACEADAELAkAgAygCAEHT+qrseEYNAEEAIQAMAQtBACEAIAMoAghBq5bxk3tHDQAgAygCBCEACyABIAAQ2QUaDAcLAkACQCAAKAIYIgMNAEEAIQAMAQsCQCADKAIAQdP6qux4Rg0AQQAhAAwBC0EAIQAgAygCCEGrlvGTe0cNACADKAIMIQALIAEgABDZBRoMBgsCQAJAQQAoAoiAAigCGCIARQ0AIAAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQAJAIAMiAEUNABC7AyAAQYABaiAAKAIEELwDIAIQvQMMAQsgAkEYakIANwMAIAJBEGpCADcDACACQgA3AwggAkIANwMACyABLQANIAEvAQ4gAkEgEJcGGgwFCyABQYqAtBAQ2QUaDAQLIAFB4yZBABCyBSIAQZzuACAAGxDaBRoMAwsgA0GDIkYNAQsCQCABLwEOQYQjRw0AIAFBwjZBABCyBSIAQZzuACAAGxDaBRoMAgsCQAJAIAAgAUH08AAQ3QVBgH9qDgIAAQMLAkAgAC0ABiIBRQ0AAkAgACgCHA0AIABBADoABiAAEGYMBAsgAQ0DCyAAKAIcRQ0CQas0QQAQOyAAEGgMAgsgAC0AB0UNASAAQQAoAoD7ATYCDAwBC0EAIQMCQCAAKAIcDQACQAJAIAAoAhgiAEUNACAAKAIAQdP6qux4Rw0AIAAhAyAAKAIIQauW8ZN7Rg0BC0EAIQMLAkAgAyIARQ0AQQMhAyAAKAIEDQELQQQhAwsgASADENkFGgsgAkEgaiQAC9sBAQZ/IwBBEGsiAiQAAkAgAEFcakEAKAKIgAIiA0cNAAJAAkAgAygCICIEDQBBfyEDDAELIAMoAhgiBSgCBEGAAWohBgJAAkACQCABLQAMIgdBH3ENACAEIAdqIAZNDQELIAIgBjYCCCACIAQ2AgQgAiAHNgIAQernACACEDtBACEEQX8hBwwBCyAFIARqIAFBEGogBxDABRogAygCICAHaiEEQQAhBwsgAyAENgIgIAchAwsCQCADRQ0AIAAQxQULIAJBEGokAA8LQa8zQYrIAEGxAkHMHxCABgALNAACQCAAQVxqQQAoAoiAAkcNAAJAIAENAEEAQQAQaxoLDwtBrzNBisgAQbkCQe0fEIAGAAsgAQJ/QQAhAAJAQQAoAoiAAiIBRQ0AIAEoAhwhAAsgAAvDAQEDf0EAKAKIgAIhAkF/IQMCQCABEGoNAAJAIAENAEF+DwtBACEDAkACQANAIAAgAyIDaiABIANrIgRBgAEgBEGAAUkbIgQQaw0BIAQgA2oiBCEDIAQgAU8NAgwACwALQX0PC0F8IQNBAEEAEGsNAAJAAkAgAigCGCIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEBIAMoAghBq5bxk3tGDQELQQAhAQsCQCABIgMNAEF7DwsgA0GAAWogAygCBBD9AyEDCyADC5cCAgN/An5BgPEAEOMFIQBB0y1BABC9BSEBIABBfzYCNCAAIAE2AhggAEEBOgAHIABBACgCgPsBQYCAwAJqNgIMAkBBkPEAQaABEP0DDQBBCiAAEJoFQQAgADYCiIACAkACQCAAKAIYIgFFDQAgASgCAEHT+qrseEcNACABIQIgASgCCEGrlvGTe0YNAQtBACECCwJAIAIiAUUNACABQewBaigCAEUNACABIAFB6AFqKAIAakGAAWoiARCrBQ0AAkAgASkDECIDUA0AIAApAxAiBFANACAEIANRDQBB+NcAQQAQOwsgACABKQMQNwMQCwJAIAApAxBCAFINACAAQgE3AxALDwtB094AQYrIAEHTA0HNEhCABgALGQACQCAAKAIcIgBFDQAgACABIAIgAxBOCws3AEEAENYBEJMFEHIQYhCmBQJAQZgqQQAQsAVFDQBB6h5BABA7DwtBzh5BABA7EIkFQdCYARBXC4MJAgh/AX4jAEHAAGsiAyQAAkACQAJAIAFBAWogACgCLCIELQBDRw0AIAMgBCkDWCILNwM4IAMgCzcDIAJAAkAgBCADQSBqIARB2ABqIgUgA0E0ahCKAyIGQX9KDQAgAyADKQM4NwMIIAMgBCADQQhqELcDNgIAIANBKGogBEHpPiADENcDQX8hBAwBCwJAIAZB0IYDSA0AIAZBsPl8aiIGQQAvAejtAU4NAyABIQECQCACRQ0AAkAgAi8BCCIBQRBJDQAgA0EoaiAEQd4IENoDQX0hBAwDCyAEIAFBAWo6AEMgBEHgAGogAigCDCABQQN0EJ4GGiABIQELAkAgASIBQeD+ACAGQQN0aiICLQACIgdPDQAgBCABQQN0akHgAGpBACAHIAFrQQN0EKAGGgsgAi0AAyIBQQFxDQQgAEIANwMgAkAgAUEIcUUNACADIAUpAwA3AxACQAJAIAQgA0EQahDxAyIADQBBACEADAELIAAtAANBD3EhAAsCQCAAQXxqDgYBAAAAAAEACyADQShqIARBCCAEQQAQkAEQ6QMgBCADKQMoNwNYCyAEQeD+ACAGQQN0aigCBBEAAEEAIQQMAQsCQCAALQARIgdB5QBJDQAgBEHm1AMQdkF9IQQMAQsgACAHQQFqOgARAkAgBEEIIAQoAOQBIgcgBygCIGogBkEEdGoiBi8BCEEDdCAGLQAOQQF0akEYahCJASIHDQBBfiEEDAELIAcgBigCACIIOwEEIAcgAygCNDYCCCAHIAggBigCBGoiCTsBBiAAKAIoIQggByAGNgIQIAcgCDYCDAJAAkAgCEUNACAAIAc2AiggACgCLCIALQBGDQEgACAHNgLoASAJQf//A3ENAUHm2wBBjscAQRVBmzMQgAYACyAAIAc2AigLIAdBGGohCSAGLQAKIQACQAJAIAYtAAtBAXENACAAIQAgCSEFDAELIAcgBSkDADcDGCAAQX9qIQAgB0EgaiEFCyAFIQogACEFAkACQCACRQ0AIAIoAgwhByACLwEIIQAMAQsgBEHgAGohByABIQALIAAhACAHIQECQAJAIAYtAAtBBHFFDQAgCiABIAVBf2oiBSAAIAUgAEkbIgdBA3QQngYhCgJAAkAgAkUNACAEIAJBAEEAIAdrEPYCGiACIQAMAQsCQCAEIAAgB2siAhCSASIARQ0AIAAoAgwgASAHQQN0aiACQQN0EJ4GGgsgACEACyADQShqIARBCCAAEOkDIAogBUEDdGogAykDKDcDAAwBCyAKIAEgBSAAIAUgAEkbQQN0EJ4GGgsCQCAGLQALQQJxRQ0AIAkpAABCAFINACADIAMpAzg3AxggA0EoaiAEQQggBCAEIANBGGoQlQMQkAEQ6QMgCSADKQMoNwMACwJAIAQtAEdFDQAgBCgCrAIgCEcNACAELQAHQQRxRQ0AIARBCBCEBAtBACEECyADQcAAaiQAIAQPC0HjxABBjscAQR9B2iUQgAYAC0HwFkGOxwBBLkHaJRCABgALQfPpAEGOxwBBPkHaJRCABgAL2AQBCH8jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgC6AEiBA0AQQAhBAwBCyAELwEEIQQLIAAgBCIEOwEKAkACQAJAAkACQAJAAkAgA0Ggq3xqDgcAAQUFAgQDBQtBzTxBABA7DAULQcgiQQAQOwwEC0GTCEEAEDsMAwtBmQxBABA7DAILQbglQQAQOwwBCyACIAM2AhAgAiAEQf//A3E2AhRBsOgAIAJBEGoQOwsgACADOwEIAkACQCADQaCrfGoOBgEAAAAAAQALIAAoAugBIgRFDQAgBCEEQR4hBQNAIAUhBiAEIgQoAhAhBSAAKADkASIHKAIgIQggAiAAKADkATYCGCAFIAcgCGprIghBBHUhBQJAAkAgCEHx6TBJDQBBvs4AIQcgBUGw+XxqIghBAC8B6O0BTw0BQeD+ACAIQQN0ai8BABCIBCEHDAELQZLZACEHIAIoAhgiCUEkaigCAEEEdiAFTQ0AIAkgCSgCIGogCGovAQwhByACIAIoAhg2AgwgAkEMaiAHQQAQigQiB0GS2QAgBxshBwsgBC8BBCEIIAQoAhAoAgAhCSACIAU2AgQgAiAHNgIAIAIgCCAJazYCCEH+6AAgAhA7AkAgBkF/Sg0AQaziAEEAEDsMAgsgBCgCDCIHIQQgBkF/aiEFIAcNAAsLIABBBToARiABECYgA0Hg1ANGDQAgABBYCwJAIAAoAugBIgRFDQAgAC0ABkEIcQ0AIAIgBC8BBDsBGCAAQccAIAJBGGpBAhBMCyAAQgA3A+gBIAJBIGokAAsJACAAIAE2AhgLhQEBAn8jAEEQayICJAACQAJAIAFBf0cNAEEAIQEMAQtBfyAAKAIsKAKAAiIDIAFqIgEgASADSRshAQsgACABNgIYAkAgACgCLCIAKALoASIBRQ0AIAAtAAZBCHENACACIAEvAQQ7AQggAEHHACACQQhqQQIQTAsgAEIANwPoASACQRBqJAAL9gIBBH8jAEEQayICJAAgACgCLCEDAkACQAJAAkAgASgCDEUNAAJAIAApACBCAFINACABKAIQLQALQQJxRQ0AIAAgASkDGDcDIAsgACABKAIMIgQ2AigCQCADLQBGDQAgAyAENgLoASAELwEGRQ0DCyAAIAAtABFBf2o6ABEgAUEANgIMIAFBADsBBgwBCwJAIAAtABAiBEEQcUUNACAAIARB7wFxOgAQIAEgASgCECgCADsBBAwBCwJAIAMoAugBIgFFDQAgAy0ABkEIcQ0AIAIgAS8BBDsBCCADQccAIAJBCGpBAhBMCyADQgA3A+gBIAAQ0QICQAJAIAAoAiwiBSgC8AEiASAARw0AIAVB8AFqIQEMAQsgASEDA0AgAyIBRQ0EIAEoAgAiBCEDIAEhASAEIABHDQALCyABIAAoAgA2AgAgBSAAEFILIAJBEGokAA8LQebbAEGOxwBBFUGbMxCABgALQaPWAEGOxwBBxwFBnyEQgAYACz8BAn8CQCAAKALwASIBRQ0AIAEhAQNAIAAgASIBKAIANgLwASABENECIAAgARBSIAAoAvABIgIhASACDQALCwuhAQEDfyMAQRBrIgIkAAJAAkAgAUHQhgNJDQBBvs4AIQMgAUGw+XxqIgFBAC8B6O0BTw0BQeD+ACABQQN0ai8BABCIBCEDDAELQZLZACEDIAAoAgAiBEEkaigCAEEEdiABTQ0AIAQgBCgCIGogAUEEdGovAQwhASACIAAoAgA2AgwgAkEMaiABQQAQigQiAUGS2QAgARshAwsgAkEQaiQAIAMLLAEBfyAAQfABaiECAkADQCACKAIAIgBFDQEgACECIAAoAhwgAUcNAAsLIAAL/QICBH8BfiMAQTBrIgMkAEEAIQQCQCAALwEIDQAgAyAAKQNYIgc3AwggAyAHNwMYAkACQCAAIANBCGogA0EgaiADQSxqEIoDIgVBAE4NAEEAIQYMAQsCQCAFQdCGA0gNACADQRBqIABBgSZBABDXA0EAIQYMAQsCQCACQQFGDQAgAEHwAWohBgNAIAYoAgAiBEUNASAEIQYgBSAELwEWRw0ACyAERQ0AIAQhBgJAAkACQCACQX5qDgMEAAIBCyAEIAQtABBBEHI6ABAgBCEGDAMLQY7HAEGrAkGfDxD7BQALIAQQfgtBACEGIABBOBCKASICRQ0AIAIgBTsBFiACIAA2AiwgACAAKAKMAkEBaiIENgKMAiACIAQ2AhwCQAJAIAAoAvABIgQNACAAQfABaiEGDAELIAQhBANAIAQiBigCACIFIQQgBiEGIAUNAAsLIAYgAjYCACACIAFBABB1GiACIAApA4ACPgIYIAIhBgsgBiEECyADQTBqJAAgBAvOAQEFfyMAQRBrIgEkAAJAIAAoAiwiAigC7AEgAEcNAAJAIAIoAugBIgNFDQAgAi0ABkEIcQ0AIAEgAy8BBDsBCCACQccAIAFBCGpBAhBMCyACQgA3A+gBCyAAENECAkACQAJAIAAoAiwiBCgC8AEiAiAARw0AIARB8AFqIQIMAQsgAiEDA0AgAyICRQ0CIAIoAgAiBSEDIAIhAiAFIABHDQALCyACIAAoAgA2AgAgBCAAEFIgAUEQaiQADwtBo9YAQY7HAEHHAUGfIRCABgAL4QEBBH8jAEEQayIBJAACQAJAIAAoAiwiAi0ARg0AEOUFIAJBACkDuJACNwOAAiAAENcCRQ0AIAAQ0QIgAEEANgIYIABB//8DOwESIAIgADYC7AEgACgCKCEDAkAgACgCLCIELQBGDQAgBCADNgLoASADLwEGRQ0CCwJAIAItAAZBCHENACABIAMvAQQ7AQggAkHGACABQQhqQQIQTAsCQCAAKAIwIgNFDQAgACgCNCEEIABCADcDMCACIAQgAxECAAsgAhCGBAsgAUEQaiQADwtB5tsAQY7HAEEVQZszEIAGAAsSABDlBSAAQQApA7iQAjcDgAILHgAgASACQeQAIAJB5ABLG0Hg1ANqEHYgAEIANwMAC5MBAgF+BH8Q5QUgAEEAKQO4kAIiATcDgAICQAJAIAAoAvABIgANAEHkACECDAELIAGnIQMgACEEQeQAIQADQCAAIQACQAJAIAQiBCgCGCIFDQAgACEADAELIAUgA2siBUEAIAVBAEobIgUgACAFIABIGyEACyAAIgAhAiAEKAIAIgUhBCAAIQAgBQ0ACwsgAkHoB2wLugIBBn8jAEEQayIBJAAQ5QUgAEEAKQO4kAI3A4ACAkAgAC0ARg0AA0ACQAJAIAAoAvABIgINAEEAIQMMAQsgACkDgAKnIQQgAiECQQAhBQNAIAUhBQJAIAIiAi0AECIDQSBxRQ0AIAIhAwwCCwJAIANBD3FBBUcNACACKAIILQAARQ0AIAIhAwwCCwJAAkAgAigCGCIGQX9qIARJDQAgBSEDDAELAkAgBUUNACAFIQMgBSgCGCAGTQ0BCyACIQMLIAIoAgAiBiECIAMiAyEFIAMhAyAGDQALCyADIgJFDQEgABDdAiACEH8gAC0ARkUNAAsLAkAgACgCmAJBgChqIAAoAoACIgJPDQAgACACNgKYAiAAKAKUAiICRQ0AIAEgAjYCAEHUPiABEDsgAEEANgKUAgsgAUEQaiQAC/kBAQN/AkACQAJAAkAgAkGIAU0NACABIAEgAmpBfHFBfGoiAzYCBCAAIAAoAgwgAkEEdmo2AgwgAUEANgIAIAAoAgQiAkUNASACIQIDQCACIgQgAU8NAyAEKAIAIgUhAiAFDQALIAQgATYCAAwDC0G12QBBtM0AQdwAQbYqEIAGAAsgACABNgIEDAELQaYtQbTNAEHoAEG2KhCABgALIANBgYCA+AQ2AgAgASABKAIEIAFBCGoiBGsiAkECdUGAgIAIcjYCCAJAIAJBBE0NACABQRBqQTcgAkF4ahCgBhogACAEEIUBDwtBy9oAQbTNAEHQAEHIKhCABgAL6gIBBH8jAEHQAGsiAiQAAkACQAJAAkAgAUUNACABQQNxDQAgACgCBCIARQ0DIABFIQMgACEEAkADQCADIQMCQCAEIgBBCGogAUsNACAAKAIEIgQgAU0NACABKAIAIgVB////B3EiAEUNBCABIABBAnRqIARLDQUgBUGAgID4AHENAiACIAU2AjBBoiQgAkEwahA7IAIgATYCJCACQdQgNgIgQcYjIAJBIGoQO0G0zQBB+AVB6RwQ+wUACyAAKAIAIgBFIQMgACEEIAANAAwFCwALIANBAXENAyACQdAAaiQADwsgAiABNgJEIAJBgjM2AkBBxiMgAkHAAGoQO0G0zQBB+AVB6RwQ+wUAC0HL2wBBtM0AQYkCQYAxEIAGAAsgAiABNgIUIAJBlTI2AhBBxiMgAkEQahA7QbTNAEH4BUHpHBD7BQALIAIgATYCBCACQcIqNgIAQcYjIAIQO0G0zQBB+AVB6RwQ+wUAC+EEAQh/IwBBEGsiAyQAAkACQCACQYDAA00NAEEAIQQMAQsCQAJAAkACQBAhDQACQCABQYACTw0AIAAgACgCCEEBaiIENgIIAkACQCAEQSBJDQAgBEEfcQ0BCxAeCxDjAkEBcUUNAiAAKAIEIgRFDQMgBCEEA0ACQCAEIgUoAggiBkEYdiIEQc8ARg0AIAUoAgQhByAEIQQgBiEGIAVBCGohCAJAAkACQAJAA0AgBiEJIAQhBCAIIgggB08NAQJAIARBAUcNACAJQf///wdxIgZFDQNBACEEIAZBAnRBeGoiCkUNAANAIAggBCIEakEIai0AACIGQTdHDQUgBEEBaiIGIQQgBiAKRw0ACwsgCUH///8HcSIERQ0EIAggBEECdGoiCCgCACIGQRh2IgohBCAGIQYgCCEIIApBzwBGDQUMAAsAC0GkO0G0zQBB4gJBpyMQgAYAC0HL2wBBtM0AQYkCQYAxEIAGAAsgAyAGNgIIIAMgCDYCACADIARBBGo2AgRB5AkgAxA7QbTNAEHqAkGnIxD7BQALQcvbAEG0zQBBiQJBgDEQgAYACyAFKAIAIgYhBCAGRQ0EDAALAAtBhDBBtM0AQaEDQdMqEIAGAAtBqusAQbTNAEGaA0HTKhCABgALIAAoAhAgACgCDE0NAQsgABCHAQsgACAAKAIQIAJBA2pBAnYiBEECIARBAksbIgRqNgIQIAAgASAEEIgBIgghBgJAIAgNACAAEIcBIAAgASAEEIgBIQYLQQAhBCAGIgZFDQAgBkEEakEAIAJBfGoQoAYaIAYhBAsgA0EQaiQAIAQL7woBC38CQCAAKAIUIgFFDQACQCABKALkAS8BDCICRQ0AIAEoAgAhA0EAIQQDQAJAIAMgBCIEQQN0aiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEJ4BCyAEQQFqIgUhBCAFIAJHDQALCwJAIAEtAEMiAkUNACABQdgAaiEDQQAhBANAAkAgAyAEIgRBA3RqIgUoAARBiIDA/wdxQQhHDQAgASAFKAAAQQoQngELIARBAWoiBSEEIAUgAkcNAAsLAkAgAS0AREUNAEEAIQQDQCABIAEoAvgBIAQiBEECdGooAgBBChCeASAEQQFqIgUhBCAFIAEtAERJDQALCwJAIAEvAUxFDQBBACEEA0ACQCABKAL0ASAEIgVBAnRqKAIAIgRFDQACQCAEKAAEQYiAwP8HcUEIRw0AIAEgBCgAAEEKEJ4BCyABIAQoAgxBChCeAQsgBUEBaiIFIQQgBSABLwFMSQ0ACwsCQCABLQBKRQ0AQQAhBANAAkAgASgCqAIgBCIEQRhsaiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEJ4BCyAEQQFqIgUhBCAFIAEtAEpJDQALCyABIAEoAtgBQQoQngEgASABKALcAUEKEJ4BIAEgASgC4AFBChCeAQJAIAEoADxBiIDA/wdxQQhHDQAgASABKAA4QQoQngELAkAgASgANEGIgMD/B3FBCEcNACABIAEoADBBChCeAQsgASgC8AEiBEUNACAEIQQDQAJAIAQiAigAJEGIgMD/B3FBCEcNACABIAIoACBBChCeAQsgAigCKCIFIQQCQCAFRQ0AA0AgASAEIgRBChCeASAEKAIMIgUhBCAFDQALCyACKAIAIgUhBCAFDQALCyAAQQA2AhAgAEEANgIAQQAhBUEAIQQDQCAEIQYgBSEEAkACQCAAKAIEIgUNAEEAIQMgBCEHDAELIAUhASAEIQVBACEEA0AgASIIQQhqIQEgBCEEIAUhBQJAAkACQAJAAkACQANAIAUhCSAEIQoCQAJAAkAgASIDKAIAIgdBgICAeHEiBEGAgID4BEYiCw0AIAMgCCgCBE8NBAJAAkAgB0EASA0AIAdBgICAgAZxIgVBgICAgARHDQELIAYNBiAAKAIUIANBChCeAUEBIQQMAgsgBkUNACAHIQEgAyECAkACQCAEQYCAgAhGDQAgByEBIAMhAiADIQQgBQ0BCwNAIAIhBCABQf///wdxIgVFDQggBCAFQQJ0aiIEKAIAIgUhASAEIQIgBUGAgIB4cUGAgIAIRg0AIAUhASAEIQIgBCEEIAVBgICAgAZxRQ0ACwsCQCAEIgQgA0YNACADIAQgA2siBEECdUGAgIAIcjYCACAEQQRNDQggA0EIakE3IARBeGoQoAYaIAAgAxCFASAJQQRqIAAgCRsgAzYCACADQQA2AgQgCiEEIAMhBQwDCyADIAdB/////31xNgIACyAKIQQLIAkhBQsgBSEFIAQhBCALDQYgAygCAEH///8HcSIBRQ0FIAMgAUECdGohASAEIQQgBSEFDAALAAtBpDtBtM0AQa0CQfgiEIAGAAtB9yJBtM0AQbUCQfgiEIAGAAtBy9sAQbTNAEGJAkGAMRCABgALQcvaAEG0zQBB0ABByCoQgAYAC0HL2wBBtM0AQYkCQYAxEIAGAAsgBCEDIAUhByAIKAIAIgIhASAFIQUgBCEEIAINAAsLIAchBSADIQECQAJAIAYNAEEAIQQgAQ0BIAAoAhQiBEUNACAEKAKsAiIBRQ0AAkAgASgCACIBQYCAgHhxQYCAgAhGDQAgAUGAgICABnENAQsgBEEANgKsAgtBASEECyAFIQUgBCEEIAZFDQALC9YDAQl/AkAgACgCACIDDQBBAA8LIAJBAnRBeGohBCABQRh0IgUgAnIhBiABQQFHIQcgAyEDQQAhAQJAAkACQAJAAkACQANAIAEhCCAJIQkgAyIBKAIAQf///wdxIgNFDQIgCSEJAkAgAyACayIKQQBIIgsNAAJAAkAgCkEDSA0AIAEgBjYCAAJAIAcNACACQQFNDQcgAUEIakE3IAQQoAYaCyAAIAEQhQEgASgCAEH///8HcSIDRQ0HIAEoAgQhCSABIANBAnRqIgMgCkGAgIAIcjYCACADIAk2AgQgCkEBTQ0IIANBCGpBNyAKQQJ0QXhqEKAGGiAAIAMQhQEgAyEDDAELIAEgAyAFcjYCAAJAIAcNACADQQFNDQkgAUEIakE3IANBAnRBeGoQoAYaCyAAIAEQhQEgASgCBCEDCyAIQQRqIAAgCBsgAzYCACABIQkLIAkhCSALRQ0BIAEoAgQiCiEDIAkhCSABIQEgCg0AC0EADwsgCQ8LQcvbAEG0zQBBiQJBgDEQgAYAC0HL2gBBtM0AQdAAQcgqEIAGAAtBy9sAQbTNAEGJAkGAMRCABgALQcvaAEG0zQBB0ABByCoQgAYAC0HL2gBBtM0AQdAAQcgqEIAGAAseAAJAIAAoAqACIAEgAhCGASIBDQAgACACEFELIAELLgEBfwJAIAAoAqACQcIAIAFBBGoiAhCGASIBDQAgACACEFELIAFBBGpBACABGwuPAQEBfwJAAkACQAJAIAFFDQAgAUEDcQ0BIAFBfGoiASgCACICQYCAgHhxQYCAgJAERw0CIAJB////B3EiAkUNAyABIAJBgICAEHI2AgAgACABEIUBCw8LQYrhAEG0zQBB1gNBgycQgAYAC0G56gBBtM0AQdgDQYMnEIAGAAtBy9sAQbTNAEGJAkGAMRCABgALvgEBAn8CQAJAAkACQAJAIAFFDQAgAUEDcQ0BIAFBfGoiAigCACIDQYCAgHhxQYCAgJAERw0CIANB////B3EiA0UNAyACIANBgICACHI2AgAgA0EBRg0EIAFBBGpBNyADQQJ0QXhqEKAGGiAAIAIQhQELDwtBiuEAQbTNAEHWA0GDJxCABgALQbnqAEG0zQBB2ANBgycQgAYAC0HL2wBBtM0AQYkCQYAxEIAGAAtBy9oAQbTNAEHQAEHIKhCABgALZAECfwJAIAEoAgQiAkGAgMD/B3FFDQBBAA8LQQAhAwJAAkAgAkEIcUUNACABKAIAKAIAIgFBgICA8ABxRQ0BIAFBgICAgARxQR52IQMLIAMPC0Ha0wBBtM0AQe4DQZw+EIAGAAt5AQF/AkACQAJAIAEoAgQiAkGAgMD/B3ENACACQQhxRQ0AIAEoAgAiAigCACIBQYCAgIAEcQ0BIAFBgICA8ABxRQ0CIAIgAUGAgICABHI2AgALDwtB5t0AQbTNAEH3A0GJJxCABgALQdrTAEG0zQBB+ANBiScQgAYAC3oBAX8CQAJAAkAgASgCBCICQYCAwP8HcQ0AIAJBCHFFDQAgASgCACICKAIAIgFBgICAgARxRQ0BIAFBgICA8ABxRQ0CIAIgAUH/////e3E2AgALDwtB4uEAQbTNAEGBBEH4JhCABgALQdrTAEG0zQBBggRB+CYQgAYACyoBAX8CQCAAKAKgAkEEQRAQhgEiAg0AIABBEBBRIAIPCyACIAE2AgQgAgsgAQF/AkAgACgCoAJBCkEQEIYBIgENACAAQRAQUQsgAQvuAgEEfyMAQRBrIgIkAAJAAkACQAJAAkACQCABQYDAA0sNACABQQN0IgNBgcADSQ0BCyACQQhqIABBDxDdA0EAIQEMAQsCQCAAKAKgAkHDAEEQEIYBIgQNACAAQRAQUUEAIQEMAQsCQCABRQ0AAkAgACgCoAJBwgAgA0EEciIFEIYBIgMNACAAIAUQUQsgBCADQQRqQQAgAxsiBTYCDAJAIAMNACAEIAQoAgBBgICAgARzNgIAQQAhAQwCCyAFQQNxDQIgBUF8aiIDKAIAIgVBgICAeHFBgICAkARHDQMgBUH///8HcSIFRQ0EIAAoAqACIQAgAyAFQYCAgBByNgIAIAAgAxCFASAEIAE7AQggBCABOwEKCyAEIAQoAgBBgICAgARzNgIAIAQhAQsgAkEQaiQAIAEPC0GK4QBBtM0AQdYDQYMnEIAGAAtBueoAQbTNAEHYA0GDJxCABgALQcvbAEG0zQBBiQJBgDEQgAYAC3gBA38jAEEQayIDJAACQAJAIAJBgcADSQ0AIANBCGogAEESEN0DQQAhAgwBCwJAAkAgACgCoAJBBSACQQxqIgQQhgEiBQ0AIAAgBBBRDAELIAUgAjsBBCABRQ0AIAVBDGogASACEJ4GGgsgBSECCyADQRBqJAAgAgtmAQN/IwBBEGsiAiQAAkACQCABQYHAA0kNACACQQhqIABBEhDdA0EAIQEMAQsCQAJAIAAoAqACQQUgAUEMaiIDEIYBIgQNACAAIAMQUQwBCyAEIAE7AQQLIAQhAQsgAkEQaiQAIAELZwEDfyMAQRBrIgIkAAJAAkAgAUGBwANJDQAgAkEIaiAAQcIAEN0DQQAhAQwBCwJAAkAgACgCoAJBBiABQQlqIgMQhgEiBA0AIAAgAxBRDAELIAQgATsBBAsgBCEBCyACQRBqJAAgAQuvAwEDfyMAQRBrIgQkAAJAAkACQAJAAkAgAkExSw0AIAMgAkcNAAJAAkAgACgCoAJBBiACQQlqIgUQhgEiAw0AIAAgBRBRDAELIAMgAjsBBAsgBEEIaiAAQQggAxDpAyABIAQpAwg3AwAgA0EGakEAIAMbIQIMAQsCQAJAIAJBgcADSQ0AIARBCGogAEHCABDdA0EAIQIMAQsgAiADSQ0CAkACQCAAKAKgAkEMIAIgA0EDdkH+////AXFqQQlqIgYQhgEiBQ0AIAAgBhBRDAELIAUgAjsBBCAFQQZqIAM7AQALIAUhAgsgBEEIaiAAQQggAiICEOkDIAEgBCkDCDcDAAJAIAINAEEAIQIMAQsgAiACQQZqLwEAQQN2Qf4/cWpBCGohAgsgAiECAkAgASgABEGIgMD/B3FBCEcNACABKAAAIgAoAgAiAUGAgICABHENAiABQYCAgPAAcUUNAyAAIAFBgICAgARyNgIACyAEQRBqJAAgAg8LQZMsQbTNAEHNBEHawwAQgAYAC0Hm3QBBtM0AQfcDQYknEIAGAAtB2tMAQbTNAEH4A0GJJxCABgAL+AIBA38jAEEQayIEJAAgBCABKQMANwMIAkACQCAAIARBCGoQ8QMiBQ0AQQAhBgwBCyAFLQADQQ9xIQYLAkACQAJAAkACQAJAAkACQAJAIAZBemoOBwACAgICAgECCyAFLwEEIAJHDQMCQCACQTFLDQAgAiADRg0DC0HQ1wBBtM0AQe8EQeAsEIAGAAsgBS8BBCACRw0DIAVBBmovAQAgA0cNBCAAIAUQ5ANBf0oNAUGG3ABBtM0AQfUEQeAsEIAGAAtBtM0AQfcEQeAsEPsFAAsCQCABKAAEQYiAwP8HcUEIRw0AIAEoAAAiASgCACIFQYCAgIAEcUUNBCAFQYCAgPAAcUUNBSABIAVB/////3txNgIACyAEQRBqJAAPC0G6K0G0zQBB7gRB4CwQgAYAC0HwMUG0zQBB8gRB4CwQgAYAC0HnK0G0zQBB8wRB4CwQgAYAC0Hi4QBBtM0AQYEEQfgmEIAGAAtB2tMAQbTNAEGCBEH4JhCABgALsAIBBX8jAEEQayIDJAACQAJAAkAgASACIANBBGpBAEEAEOUDIgQgAkcNACACQTFLDQAgAygCBCACRw0AAkACQCAAKAKgAkEGIAJBCWoiBRCGASIEDQAgACAFEFEMAQsgBCACOwEECwJAIAQNACAEIQIMAgsgBEEGaiABIAIQngYaIAQhAgwBCwJAAkAgBEGBwANJDQAgA0EIaiAAQcIAEN0DQQAhBAwBCyAEIAMoAgQiBkkNAgJAAkAgACgCoAJBDCAEIAZBA3ZB/v///wFxakEJaiIHEIYBIgUNACAAIAcQUQwBCyAFIAQ7AQQgBUEGaiAGOwEACyAFIQQLIAEgAkEAIAQiBEEEakEDEOUDGiAEIQILIANBEGokACACDwtBkyxBtM0AQc0EQdrDABCABgALCQAgACABNgIUCxoBAX9BmIAEEB8iACAAQRhqQYCABBCEASAACw0AIABBADYCBCAAECALDQAgACgCoAIgARCFAQv8BgERfyMAQSBrIgMkACAAQeQBaiEEIAIgAWohBSABQX9HIQZBACECIAAoAqACQQRqIQdBACEIQQAhCUEAIQpBACELAkACQANAIAwhACALIQ0gCiEOIAkhDyAIIRAgAiECAkAgBygCACIRDQAgAiESIBAhECAPIQ8gDiEOIA0hDSAAIQAMAgsgAiESIBFBCGohAiAQIRAgDyEPIA4hDiANIQ0gACEAA0AgACEIIA0hACAOIQ4gDyEPIBAhECASIQ0CQAJAAkACQCACIgIoAgAiB0EYdiISQc8ARiITRQ0AIA0hEkEFIQcMAQsCQAJAIAIgESgCBE8NAAJAIAYNACAHQf///wdxIgdFDQIgDkEBaiEJIAdBAnQhDgJAAkAgEkEBRw0AIA4gDSAOIA1KGyESQQchByAOIBBqIRAgDyEPDAELIA0hEkEHIQcgECEQIA4gD2ohDwsgCSEOIAAhDQwECwJAIBJBCEYNACANIRJBByEHDAMLIABBAWohCQJAAkAgACABTg0AIA0hEkEHIQcMAQsCQCAAIAVIDQAgDSESQQEhByAQIRAgDyEPIA4hDiAJIQ0gCSEADAYLIAIoAhAhEiAEKAIAIgAoAiAhByADIAA2AhwgA0EcaiASIAAgB2prQQR1IgAQeyESIAIvAQQhByACKAIQKAIAIQogAyAANgIUIAMgEjYCECADIAcgCms2AhhBk+kAIANBEGoQOyANIRJBACEHCyAQIRAgDyEPIA4hDiAJIQ0MAwtBpDtBtM0AQaIGQZgjEIAGAAtBy9sAQbTNAEGJAkGAMRCABgALIBAhECAPIQ8gDiEOIAAhDQsgCCEACyAAIQAgDSENIA4hDiAPIQ8gECEQIBIhEgJAAkAgBw4IAAEBAQEBAQABCyACKAIAQf///wdxIgdFDQQgEiESIAIgB0ECdGohAiAQIRAgDyEPIA4hDiANIQ0gACEADAELCyASIQIgESEHIBAhCCAPIQkgDiEKIA0hCyAAIQwgEiESIBAhECAPIQ8gDiEOIA0hDSAAIQAgEw0ACwsgDSENIA4hDiAPIQ8gECEQIBIhEiAAIQICQCARDQACQCABQX9HDQAgAyASNgIMIAMgEDYCCCADIA82AgQgAyAONgIAQa7mACADEDsLIA0hAgsgA0EgaiQAIAIPC0HL2wBBtM0AQYkCQYAxEIAGAAvEBwEIfyMAQRBrIgMkACACQX9qIQQgASEBAkADQCABIgVFDQECQAJAIAUoAgAiAUEYdkEPcSIGQQFGDQAgAUGAgICAAnENAAJAIAJBAUoNACAFIAFBgICAgHhyNgIADAELIAUgAUH/////BXFBgICAgAJyNgIAQQAhBwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAZBfmoODgwCAQcMBAUBAQMMAAYMBgsgACAFKAIQIAQQngEgBSgCFCEHDAsLIAUhBwwKCwJAIAUoAgwiCEUNACAIQQNxDQYgCEF8aiIHKAIAIgFBgICAgAZxDQcgAUGAgID4AHFBgICAEEcNCCAFLwEIIQkgByABQYCAgIACcjYCAEEAIQEgCUUNAANAAkAgCCABIgFBA3RqIgcoAARBiIDA/wdxQQhHDQAgACAHKAAAIAQQngELIAFBAWoiByEBIAcgCUcNAAsLIAUoAgQhBwwJCyAAIAUoAhwgBBCeASAFKAIYIQcMCAsCQCAFKAAMQYiAwP8HcUEIRw0AIAAgBSgACCAEEJ4BC0EAIQcgBSgAFEGIgMD/B3FBCEcNByAAIAUoABAgBBCeAUEAIQcMBwsgACAFKAIIIAQQngEgBSgCEC8BCCIIRQ0FIAVBGGohCUEAIQEDQAJAIAkgASIBQQN0aiIHKAAEQYiAwP8HcUEIRw0AIAAgBygAACAEEJ4BCyABQQFqIgchASAHIAhHDQALQQAhBwwGCyADIAU2AgQgAyABNgIAQYwkIAMQO0G0zQBBygFB5SoQ+wUACyAFKAIIIQcMBAtBiuEAQbTNAEGDAUHyHBCABgALQZLgAEG0zQBBhQFB8hwQgAYAC0GI1ABBtM0AQYYBQfIcEIAGAAtBACEHCwJAIAciCQ0AIAUhAUEAIQYMAgsCQAJAAkACQCAJKAIMIgdFDQAgB0EDcQ0BIAdBfGoiCCgCACIBQYCAgIAGcQ0CIAFBgICA+ABxQYCAgBBHDQMgCS8BCCEKIAggAUGAgICAAnI2AgBBACEBIAogBkEKR3QiCEUNAANAAkAgByABIgFBA3RqIgYoAARBiIDA/wdxQQhHDQAgACAGKAAAIAQQngELIAFBAWoiBiEBIAYgCEcNAAsLIAUhAUEAIQYgACAJKAIEEPQCRQ0EIAkoAgQhAUEBIQYMBAtBiuEAQbTNAEGDAUHyHBCABgALQZLgAEG0zQBBhQFB8hwQgAYAC0GI1ABBtM0AQYYBQfIcEIAGAAsgBSEBQQAhBgsgASEBIAYNAAsLIANBEGokAAtUAQF/IwBBEGsiAyQAIAMgAikDADcDCAJAAkAgASADQQhqEPIDDQAgAyACKQMANwMAIAAgAUEPIAMQ2wMMAQsgACACKAIALwEIEOcDCyADQRBqJAALgQECAn8BfiMAQSBrIgEkACABIAApA1giAzcDCCABIAM3AxgCQAJAIAAgAUEIahDyA0UNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQ2wNBACECCwJAIAIiAkUNACAAIAIgAEEAEKADIABBARCgAxD2AhoLIAFBIGokAAs5AgF/AX4jAEEQayIBJAAgASAAQeAAaikDACICNwMAIAEgAjcDCCAAIAAgARDyAxClAyABQRBqJAALsQICBn8BfiMAQTBrIgEkACAALQBDIgJBf2ohA0EAIQRBACEFAkACQCACQQJJDQAgASAAQeAAaikDADcDKAJAAkAgA0EBRw0AIAEgASkDKDcDECABQRBqEMQDRQ0AAkAgASgCLEF/Rg0AIAFBIGogAEH+K0EAENkDQQAiBSEEIAUhBkEAIQUMAgsgASABKQMoNwMIQQAhBEEBIQYgACABQQhqEOsDIQUMAQtBASEEQQEhBiADIQULIAQhBCAFIQUgBkUNAQsgBCEEIAAgBRCSASIFRQ0AIAAgBRCmAyAEIAJBAUtxQQFHDQBBACEEA0AgASAAIAQiBEEBaiICQQN0akHYAGopAwAiBzcDACABIAc3AxggACAFIAQgARCdAyACIQQgAiADRw0ACwsgAUEwaiQAC9EBAgV/AX4jAEEwayIBJAAgASAAKQNYIgY3AxAgASAGNwMoAkACQCAAIAFBEGoQ8gNFDQAgASgCKCECDAELIAEgASkDKDcDCCABQSBqIABBDyABQQhqENsDQQAhAgsCQCACIgNFDQACQCAALQBDQQJJDQBBACEEA0AgAy8BCCEFIAEgACAEQQFqIgJBA3RqQdgAaikDACIGNwMAIAEgBjcDGCAAIAMgBSABEJ0DIAIhBCACIAAtAENBf2pIDQALCyAAIAMvAQgQpAMLIAFBMGokAAuJAgIFfwF+IwBBwABrIgEkACABIAApA1giBjcDKCABIAY3AzgCQAJAIAAgAUEoahDyA0UNACABKAI4IQIMAQsgASABKQM4NwMgIAFBMGogAEEPIAFBIGoQ2wNBACECCwJAIAIiAkUNACABIABB4ABqKQMAIgY3AxggASAGNwM4AkAgACABQRhqEPIDDQAgASABKQM4NwMQIAFBMGogAEEPIAFBEGoQ2wMMAQsgASABKQM4NwMIAkAgACABQQhqEPEDIgMvAQgiBEUNACAAIAIgAi8BCCIFIAQQ9gINACACKAIMIAVBA3RqIAMoAgwgBEEDdBCeBhoLIAAgAi8BCBCkAwsgAUHAAGokAAuOAgIGfwF+IwBBIGsiASQAIAEgACkDWCIHNwMIIAEgBzcDGAJAAkAgACABQQhqEPIDRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARDbA0EAIQILIAIiAy8BCCECQQAhBAJAIAAtAENBf2oiBUUNACAAQQAQoAMhBAsgBCIEQR91IAJxIARqIgRBACAEQQBKGyEEIAIhBgJAIAVBAkkNACAAQQEgAhCfAyEGCwJAIAAgBiIGQR91IAJxIAZqIgYgAiAGIAJIGyICIAQgAiAEIAJIGyIEayIGEJIBIgJFDQAgAigCDCADKAIMIARBA3RqIAZBA3QQngYaCyAAIAIQpgMgAUEgaiQAC7EHAg1/AX4jAEGAAWsiASQAIAEgACkDWCIONwNYIAEgDjcDeAJAAkAgACABQdgAahDyA0UNACABKAJ4IQIMAQsgASABKQN4NwNQIAFB8ABqIABBDyABQdAAahDbA0EAIQILAkAgAiIDRQ0AIAEgAEHgAGopAwAiDjcDeAJAAkAgDkIAUg0AIAFBATYCbEGz4gAhAkEBIQQMAQsgASABKQN4NwNIIAFB8ABqIAAgAUHIAGoQywMgASABKQNwIg43A3ggASAONwNAIAAgAUHAAGogAUHsAGoQxgMiAkUNASABIAEpA3g3AzggACABQThqEOADIQQgASABKQN4NwMwIAAgAUEwahCOASACIQIgBCEECyAEIQUgAiEGIAMvAQgiAkEARyEEAkACQCACDQAgBCEHQQAhBEEAIQgMAQsgBCEJQQAhCkEAIQtBACEMA0AgCSENIAEgAygCDCAKIgJBA3RqKQMANwMoIAFB8ABqIAAgAUEoahDLAyABIAEpA3A3AyAgBUEAIAIbIAtqIQQgASgCbEEAIAIbIAxqIQgCQAJAIAAgAUEgaiABQegAahDGAyIJDQAgCCEKIAQhBAwBCyABIAEpA3A3AxggASgCaCAIaiEKIAAgAUEYahDgAyAEaiEECyAEIQggCiEEAkAgCUUNACACQQFqIgIgAy8BCCINSSIHIQkgAiEKIAghCyAEIQwgByEHIAQhBCAIIQggAiANTw0CDAELCyANIQcgBCEEIAghCAsgCCEFIAQhAgJAIAdBAXENACAAIAFB4ABqIAIgBRCWASINRQ0AIAMvAQgiAkEARyEEAkACQCACDQAgBCEMQQAhBAwBCyAEIQhBACEJQQAhCgNAIAohBCAIIQogASADKAIMIAkiAkEDdGopAwA3AxAgAUHwAGogACABQRBqEMsDAkACQCACDQAgBCEEDAELIA0gBGogBiABKAJsEJ4GGiABKAJsIARqIQQLIAQhBCABIAEpA3A3AwgCQAJAIAAgAUEIaiABQegAahDGAyIIDQAgBCEEDAELIA0gBGogCCABKAJoEJ4GGiABKAJoIARqIQQLIAQhBAJAIAhFDQAgAkEBaiICIAMvAQgiC0kiDCEIIAIhCSAEIQogDCEMIAQhBCACIAtPDQIMAQsLIAohDCAEIQQLIAQhAiAMQQFxDQAgACABQeAAaiACIAUQlwEgACgC7AEiAkUNACACIAEpA2A3AyALIAEgASkDeDcDACAAIAEQjwELIAFBgAFqJAALEwAgACAAIABBABCgAxCUARCmAwvcBAIFfwF+IwBBgAFrIgEkACABIABB4ABqKQMANwNoIAEgAEHoAGopAwAiBjcDYCABIAY3A3BBACECQQAhAwJAIAFB4ABqEPUDDQAgASABKQNwNwNYQQEhAkEBIQMgACABQdgAakGWARD5Aw0AIAEgASkDcDcDUAJAIAAgAUHQAGpBlwEQ+QMNACABIAEpA3A3A0ggACABQcgAakGYARD5Aw0AIAEgASkDcDcDQCABIAAgAUHAAGoQtwM2AjAgAUH4AGogAEHtGyABQTBqENcDQQAhAkF/IQMMAQtBACECQQIhAwsgAiEEIAEgASkDaDcDKCAAIAFBKGogAUHwAGoQ8AMhAgJAAkACQCADQQFqDgICAQALIAEgASkDaDcDICAAIAFBIGoQwwMNACABIAEpA2g3AxggAUH4AGogAEHCACABQRhqENsDDAELAkACQCACRQ0AAkAgBEUNACABQQAgAhD/BSIENgJwQQAhAyAAIAQQlAEiBEUNAiAEQQxqIAIQ/wUaIAQhAwwCCyAAIAIgASgCcBCTASEDDAELIAEgASkDaDcDEAJAIAAgAUEQahDyA0UNACABIAEpA2g3AwgCQCAAIAAgAUEIahDxAyIDLwEIEJQBIgUNACAFIQMMAgsCQCADLwEIDQAgBSEDDAILQQAhAgNAIAEgAygCDCACIgJBA3RqKQMANwMAIAUgAmpBDGogACABEOsDOgAAIAJBAWoiBCECIAQgAy8BCEkNAAsgBSEDDAELIAFB+ABqIABB9QhBABDXA0EAIQMLIAAgAxCmAwsgAUGAAWokAAuKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ7QMNACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDbAwwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ7wNFDQAgACADKAIoEOcDDAELIABCADcDAAsgA0EwaiQAC/0CAgN/AX4jAEHwAGsiASQAIAEgAEHgAGopAwA3A1AgASAAKQNYIgQ3A0AgASAENwNgAkACQCAAIAFBwABqEO0DDQAgASABKQNgNwM4IAFB6ABqIABBEiABQThqENsDQQAhAgwBCyABIAEpA2A3AzAgACABQTBqIAFB3ABqEO8DIQILAkAgAiICRQ0AIAEgASkDUDcDKAJAIAAgAUEoakGWARD5A0UNAAJAIAAgASgCXEEBdBCVASIDRQ0AIANBBmogAiABKAJcEP4FCyAAIAMQpgMMAQsgASABKQNQNwMgAkACQCABQSBqEPUDDQAgASABKQNQNwMYIAAgAUEYakGXARD5Aw0AIAEgASkDUDcDECAAIAFBEGpBmAEQ+QNFDQELIAFByABqIAAgAiABKAJcEMoDIAAoAuwBIgBFDQEgACABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahC3AzYCACABQegAaiAAQe0bIAEQ1wMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1giBjcDGCABIAY3AyACQAJAIAAgAUEYahDuAw0AIAEgASkDIDcDECABQShqIABBqSAgAUEQahDcA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEO8DIQILAkAgAiIDRQ0AIABBABCgAyECIABBARCgAyEEIABBAhCgAyEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQoAYaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNYIgg3AzggASAINwNQAkACQCAAIAFBOGoQ7gMNACABIAEpA1A3AzAgAUHYAGogAEGpICABQTBqENwDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEO8DIQILAkAgAiIDRQ0AIABBABCgAyEEIAEgAEHoAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDDA0UNACABIAEpA0A3AwAgACABIAFB2ABqEMYDIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQ7QMNACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQ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ASkDADcDCAJAAkAgAkEIahD1A0UNAEF/IQEMAQsCQAJAAkAgASgCBEEBag4CAAECCyABKAIAIgFBACABQQBKGyEBDAILIAEoAgBBwgBHDQBBfyEBDAELIAIgASkDADcDAEF/IQEgACACEOoDIgNEAADg////70FkDQBBACEBIANEAAAAAAAAAABjDQACQAJAIANEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQvzAQMCfwF+AXwjAEEgayIBJAAgASAAQeAAaikDACIDNwMQIAEgAzcDGAJAAkAgAUEQahD1A0UNAEF/IQIMAQsCQAJAAkAgASgCHEEBag4CAAECCyABKAIYIgJBACACQQBKGyECDAILIAEoAhhBwgBHDQBBfyECDAELIAEgASkDGDcDCEF/IQIgACABQQhqEOoDIgREAADg////70FkDQBBACECIAREAAAAAAAAAABjDQACQAJAIAREAAAAAAAA8EFjIAREAAAAAAAAAABmcUUNACAEqyECDAELQQAhAgsgAiECCyAAKALsASACEHggAUEgaiQAC/MBAwJ/AX4BfCMAQSBrIgEkACABIABB4ABqKQMAIgM3AxAgASADNwMYAkACQCABQRBqEPUDRQ0AQX8hAgwBCwJAAkACQCABKAIcQQFqDgIAAQILIAEoAhgiAkEAIAJBAEobIQIMAgsgASgCGEHCAEcNAEF/IQIMAQsgASABKQMYNwMIQX8hAiAAIAFBCGoQ6gMiBEQAAOD////vQWQNAEEAIQIgBEQAAAAAAAAAAGMNAAJAAkAgBEQAAAAAAADwQWMgBEQAAAAAAAAAAGZxRQ0AIASrIQIMAQtBACECCyACIQILIAAoAuwBIAIQeCABQSBqJAALRgEBfwJAIABBABCgAyIBQZGOwdUARw0AQbvrAEEAEDtB2McAQSFBtMQAEPsFAAsgAEHf1AMgASABQaCrfGpBoat8SRsQdgsFABA0AAsIACAAQQAQdgudAgIHfwF+IwBB8ABrIgEkAAJAIAAtAENBAkkNACABIABB4ABqKQMAIgg3A2ggASAINwMIIAAgAUEIaiABQeQAahDGAyICRQ0AIAAgAiABKAJkIAFBIGpBwAAgAEHoAGoiAyAALQBDQX5qIgQgAUEcahDCAyEFIAEgASgCHEF/aiIGNgIcAkAgACABQRBqIAVBf2oiByAGEJYBIgZFDQACQAJAIAdBPksNACAGIAFBIGogBxCeBhogByECDAELIAAgAiABKAJkIAYgBSADIAQgAUEcahDCAyECIAEgASgCHEF/ajYCHCACQX9qIQILIAAgAUEQaiACIAEoAhwQlwELIAAoAuwBIgBFDQAgACABKQMQNwMgCyABQfAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQoAMhAiABIABB6ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEMsDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABENQCIAFBIGokAAsOACAAIABBABCiAxCjAwsPACAAIABBABCiA50QowMLgAICAn8BfiMAQfAAayIBJAAgASAAQeAAaikDADcDaCABIABB6ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahD0A0UNACABIAEpA2g3AxAgASAAIAFBEGoQtwM2AgBB4BogARA7DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEMsDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI4BIAEgASkDYDcDOCAAIAFBOGpBABDGAyECIAEgASkDaDcDMCABIAAgAUEwahC3AzYCJCABIAI2AiBBkhsgAUEgahA7IAEgASkDYDcDGCAAIAFBGGoQjwELIAFB8ABqJAALnwECAn8BfiMAQTBrIgEkACABIABB4ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEMsDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEMYDIgJFDQAgAiABQSBqELIFIgJFDQAgAUEYaiAAQQggACACIAEoAiAQmAEQ6QMgACgC7AEiAEUNACAAIAEpAxg3AyALIAFBMGokAAs7AQF/IwBBEGsiASQAIAFBCGogACkDgAK6EOYDAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBEGokAAuoAQIBfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiAjcDKCABIAI3AxACQAJAAkAgACABQRBqQY8BEPkDRQ0AEPMFIQIMAQsgASABKQMoNwMIIAAgAUEIakGbARD5A0UNARDZAiECCyABQQg2AgAgASACNwMg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AwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqENsDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFB0T1BABDZAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhDoAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1g3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqENsDQQAhAgwBCwJAIAAgASgCEBB8IgINACABQRhqIABB0T1BABDZAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBwz9BABDZAwwBCyACIABB4ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNYNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDbA0EAIQAMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQdE9QQAQ2QMLIAIhAAsCQCAAIgBFDQAgABB+CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAuwBIQIgASAAQeAAaikDACIENwMAIAEgBDcDCCAAIAEQsQEhAyAAKALsASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALIQACQCAAKALsASIARQ0AIAAgADUCHEKAgICAEIQ3AyALC2ABAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEHBLUEAENkDDAELIAAgAkF/akEBEH0iAkUNACAAKALsASIARQ0AIAAgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCKAyIEQc+GA0sNACABKADkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB8yUgA0EIahDcAwwBCyAAIAEgASgC2AEgBEH/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IAAgAi8BEBDnAwwBCyAAQgA3AwALIANBIGokAAutAQIEfwF+IwBBIGsiAyQAIAMgAikDADcDECABENkBAkACQAJAIAEtAEoiBA0AIARBAEchAgwBCyABKAKoAiIFKQMAIAMpAxAiB1ENAUEAIQYCQANAIAZBAWoiAiAERg0BIAIhBiAFIAJBGGxqKQMAIAdSDQALCyACIARJIQILIAINACADIAMpAxA3AwggA0EYaiABQdABIANBCGoQ2wMLIABCADcDACADQSBqJAALlgICCH8BfiMAQTBrIgEkACABIAApA1g3AyAgABDZAQJAAkAgAC0ASiICDQAgAkEARyEDDAELAkAgACgCqAIiBCkDACABKQMgIglSDQBBASEDIAQhBQwBCyACQRhsIARqQWhqIQZBACEDAkADQAJAIANBAWoiBSACRw0AIAYhBwwCCyAFIQMgBCAFQRhsaiIIIQcgCCkDACAJUg0ACwsgBSACSSEDIAchBQsgBSEFAkAgAw0AIAEgASkDIDcDECABQShqIABB0AEgAUEQahDbA0EAIQULAkAgBUUNACAAQQBBfxCfAxogASAAQeAAaikDACIJNwMYIAEgCTcDCCABQShqIABB0gEgAUEIahDbAwsgAUEwaiQAC/0DAgZ/AX4jAEGAAWsiASQAIABBAEF/EJ8DIQIgABDZAUEAIQMCQCAALQBKIgRFDQAgACgCqAIhBUEAIQMDQAJAIAIgBSADIgNBGGxqLQANRw0AIAUgA0EYbGohAwwCCyADQQFqIgYhAyAGIARHDQALQQAhAwsCQAJAIAMiAw0AAkAgAkGAvqvvAEcNACABQfgAaiAAQSsQqgMgACgC7AEiA0UNAiADIAEpA3g3AyAMAgsgASAAQeAAaikDACIHNwNwIAEgBzcDCCABQegAaiAAQdABIAFBCGoQ2wMMAQsCQCADKQAAQgBSDQAgAUHoAGogAEEIIAAgAEErEPACEJABEOkDIAMgASkDaDcDACABQeAAakHQARDHAyABQdgAaiACEOcDIAEgAykDADcDSCABIAEpA2A3A0AgASABKQNYNwM4IAAgAUHIAGogAUHAAGogAUE4ahCbAyADKAIIIQYgAUHoAGogAEEIIAAgBiAGEM0GEJgBEOkDIAEgASkDaDcDMCAAIAFBMGoQjgEgAUHQAGpB0QEQxwMgASADKQMA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Ayg3AwggACACQQhqEOoDIQYgAiACKQMgNwMAIAAgAhDqAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAuwBIgVFDQAgBUEAKQPgigE3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyABIQECQCAAKALsASIARQ0AIAAgASkDADcDIAsgAkEwaiQACwkAIABBABCMAgudAQIDfwF+IwBBMGsiASQAIAEgAEHgAGopAwA3AyggASAAQegAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQ9AMNACABIAEpAyg3AxAgACABQRBqEJADIQIgASABKQMgNwMIIAAgAUEIahCTAyIDRQ0AIAJFDQAgACACIAMQ8QILAkAgACgC7AEiAEUNACAAIAEpAyg3AyALIAFBMGokAAsJACAAQQEQkAILoQECA38BfiMAQTBrIgIkACACIABB4ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEJMDIgNFDQAgAEEAEJIBIgRFDQAgAkEgaiAAQQggBBDpAyACIAIpAyA3AxAgACACQRBqEI4BIAAgAyAEIAEQ9QIgAiACKQMgNwMIIAAgAkEIahCPASAAKALsASIARQ0AIAAgAikDIDcDIAsgAkEwaiQACwkAIABBABCQAgvqAQIDfwF+IwBBwABrIgEkACABIABB4ABqKQMAIgQ3AzggASAAQegAaikDADcDMCABIAQ3AyACQAJAIAAgAUEgahDxAyICDQBBACEDDAELIAItAANBD3EhAwsCQAJAAkAgA0F8ag4GAQAAAAABAAsgASABKQM4NwMIIAFBKGogAEHSACABQQhqENsDDAELIAEgASkDMDcDGAJAIAAgAUEYahCTAyIDDQAgASABKQMwNwMQIAFBKGogAEE0IAFBEGoQ2wMMAQsgAiADNgIEIAAoAuwBIgBFDQAgACABKQM4NwMgCyABQcAAaiQAC24CAn8CfiMAQRBrIgEkACAAKQNYIQMgASAAQeAAaikDACIENwMAIAEgBDcDCCABEPUDIQIgACgC7AEhAAJAAkACQCACRQ0AIAMhBCAADQEMAgsgAEUNASABKQMIIQQLIAAgBDcD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BAwBCyAAIAcQhgMhBAsgBCEEIAEhAyABIQEgAkUNAAsLIAELvgEBA38jAEEgayIBJAAgASAAKQNYNwMQAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiA0UNACADIQIgAygCAEGAgID4AHFBgICA2ABGDQELIAEgASkDEDcDACABQRhqIABBLyABENsDQQAhAgsCQCAAIAIiAhCmAiIDRQ0AIAFBCGogACADIAIoAhwiAkEMaiACLwEEEK4CIAAoAuwBIgBFDQAgACABKQMINwMgCyABQSBqJAAL8AECAn8BfiMAQSBrIgEkACABIAApA1g3AxACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDYAEcNACAAQfgCakEAQfwBEKAGGiAAQYYDakEDOwEAIAIpAwghAyAAQYQDakEEOgAAIABB/AJqIAM3AgAgAEGIA2ogAi8BEDsBACAAQYoDaiACLwEWOwEAIAFBCGogACACLwESENUCAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBIGokAA8LIAEgASkDEDcDACABQRhqIABBLyABENsDAAuhAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQgAMiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENsDCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAhCCAyICQX9KDQAgAEIANwMADAELIAAgASACEPsCCyADQTBqJAALjwECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqEIADIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDbAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EwaiQAC4gBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahCAAyICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQ2wMLAkACQCACDQAgAEIANwMADAELIAAg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IAMgB0HsASACQQhqEElqIQMLIABBhANqIAMgB2s6AAAgAkEwaiQAC9cBAgN/AX4jAEHAAGsiASQAIAEgACkDWCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQgAMiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBkyEgAUEQahDcA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBhiEgAUEIahDcA0EAIQMLAkAgAyIDRQ0AIAAgAxCxAiAAIAEoAiQgAy8BAkH/H3FBgMAAchDSAgsgAUHAAGokAAueAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCAAyIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGTISADQQhqENwDQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCADKAIcIgJB//8BRw0AIABCADcDAAwBCyAAIAI2AgAgAEECNgIECyADQTBqJAALiQECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQgAMiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBkyEgA0EIahDcA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwEANgIAIABBBDYCBAsgA0EwaiQAC4YBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEIADIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZMhIANBCGoQ3ANBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BAkH/H3EQ5wMLIANBMGokAAvOAQIDfwF+IwBBwABrIgEkACABIAApA1giBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEIADIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQZMhIAFBEGoQ3ANBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQYYhIAFBCGoQ3ANBACEDCwJAIAMiA0UNACAAIAMQsQIgACABKAIkIAMvAQIQ0gILIAFBwABqJAALZAECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQ2wMMAQsgACABIAIoAgAQhANBAEcQ6AMLIANBEGokAAtjAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahDbAwwBCyAAIAEgASACKAIAEIMDEPwCCyADQRBqJAALiQICBX8BfiMAQTBrIgEkACABIAApA1g3AygCQAJAAkAgASgCLCICQYCAwP8HcQ0AIAJBD3FBAkYNAQsgASABKQMoNwMQIAFBIGogAEHZACABQRBqENsDQf//ASECDAELIAEoAighAgsCQCACIgJB//8BRg0AIABBABCgAyEDIAEgAEHoAGopAwAiBjcDKCABIAY3AwggACABQQhqIAFBHGoQ8AMhBAJAIANBgIAESQ0AIAFBIGogAEHdABDdAwwBCwJAIAEoAhwiBUHtAUkNACABQSBqIABB3gAQ3QMMAQsgAEGEA2ogBToAACAAQYgDaiAEIAUQngYaIAAgAiADENICCyABQTBqJAALaQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqEP8CIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQ2wMgAEIANwMADAELIAAgAigCBBDnAwsgA0EgaiQAC3ACAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDCCADIAQ3AxACQAJAIAEgA0EIahD/AiICDQAgAyADKQMQNwMAIANBGGogAUGdASADENsDIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQSBqJAALmgECAn8BfiMAQcAAayIBJAAgASAAKQNYIgM3AxggASADNwMwAkACQCAAIAFBGGoQ/wIiAg0AIAEgASkDMDcDCCABQThqIABBnQEgAUEIahDbAwwBCyABIABB4ABqKQMAIgM3AxAgASADNwMgIAFBKGogACACIAFBEGoQhwMgACgC7AEiAEUNACAAIAEpAyg3AyALIAFBwABqJAALwwECAn8BfiMAQcAAayIBJAAgASAAKQNYIgM3AxggASADNwMwAkACQAJAIAAgAUEYahD/Ag0AIAEg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NgIMAkACQCADQQxqIARBgIABciIEEPsDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEBEPACIQQgAyADKQMQNwMAIAAgAiAEIAMQjQMgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEOoEAkACQCABKAJQIgMgACgCEC8BCEkNACACIAFB7wAQgQEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ6gQCQAJAIAEoAlAiAyABKALkAS8BDEkNACACIAFB8QAQgQEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ6gQgARDrBCEDIAEQ6wQhBCACQRBqIAFBARDtBAJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEcLIAJBIGokAAsOACAAQQApA+iKATcDAAs3AQF/AkAgAigCUCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIEBCzgBAX8CQCACKAJQIgMgAigC5AEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIEBC3EBAX8jAEEgayIDJAAgA0EYaiACEOoEIAMgAykDGDcDEAJAAkACQCADQRBqEMQDDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDqAxDmAwsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOoEIANBEGogAhDqBCADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQmgMgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEOoEIAJBIGogARDqBCACQRhqIAEQ6gQgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCbAyACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDqBCADIAMpAyA3AyggAigCUCEEIAMgAigC5AE2AhwCQAJAIANBHGogBEGAgAFyIgQQ+wMNACADQgA3AzAMAQsgAyAENgIwIANBBDYC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SAACQBAhDQACQEEALQCOkQJFDQBBABDzBTcCkJECQYyRAhD2BUGMkQIQlQYaEOYFQYyRAhD5BQsPC0HLywBBvQFByywQ+wUACwYAQYiTAgtPAgF+An8CQAJAIAC9IgFCNIinQf8PcSICQf8PRg0AQQQhAyACDQFBAkEDIAFC////////////AINQGw8LIAFC/////////weDUCEDCyADCwQAIAALjgQBA38CQCACQYAESQ0AIAAgASACEBEgAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCADQXxqIgQgAE8NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL9wIBAn8CQCAAIAFGDQACQCABIAAgAmoiA2tBACACQQF0a0sNACAAIAEgAhCeBg8LIAEgAHNBA3EhBAJAAkACQCAAIAFPDQACQCAERQ0AIAAhAwwDCwJAIABBA3ENACAAIQMMAgsgACEDA0AgAkUNBCADIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiADQQFqIgNBA3FFDQIMAAsACwJAIAQNAAJAIANBA3FFDQADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIAJBfGoiAkEDSw0ACwsgAkUNAANAIAMgAS0AADoAACADQQFqIQMgAUEBaiEBIAJBf2oiAg0ACwsgAAvyAgIDfwF+AkAgAkUNACAAIAE6AAAgAiAAaiIDQX9qIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0F9aiABOgAAIANBfmogAToAACACQQdJDQAgACABOgADIANBfGogAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkF8aiABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBeGogATYCACACQXRqIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQXBqIAE2AgAgAkFsaiABNgIAIAJBaGogATYCACACQWRqIAE2AgAgBCADQQRxQRhyIgVrIgJBIEkNACABrUKBgICAEH4hBiADIAVqIQEDQCABIAY3AxggASAGNwMQIAEgBjcDCCABIAY3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsgAAsEAEEBCwIAC70CAQN/AkAgAA0AQQAhAQJAQQAoAoyTAkUNAEEAKAKMkwIQowYhAQsCQEEAKAKA7wFFDQBBACgCgO8BEKMGIAFyIQELAkAQuQYoAgAiAEUNAANAQQAhAgJAIAAoAkxBAEgNACAAEKEGIQILAkAgACgCFCAAKAIcRg0AIAAQowYgAXIhAQsCQCACRQ0AIAAQogYLIAAoAjgiAA0ACwsQugYgAQ8LQQAhAgJAIAAoAkxBAEgNACAAEKEGIQILAkACQAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQYAGiAAKAIUDQBBfyEBIAINAQwCCwJAIAAoAgQiASAAKAIIIgNGDQAgACABIANrrEEBIAAoAigREQAaC0EAIQEgAEEANgIcIABCADcDECAAQgA3AgQgAkUNAQsgABCiBgsgAQuyBAIEfgJ/AkACQCABvSICQgGGIgNQDQAgARClBiEEIAC9IgVCNIinQf8PcSIGQf8PRg0AIARC////////////AINCgYCAgICAgPj/AFQNAQsgACABoiIBIAGjDwsCQCAFQgGGIgQgA1YNACAARAAAAAAAAAAAoiAAIAQgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAFQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIAVBASAGa62GIQMMAQsgBUL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIEQgBTDQADQCAHQX9qIQcgBEIBhiIEQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LIANCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCwJAAkAgA0L/////////B1gNACADIQQMAQsDQCAGQX9qIQYgA0KAgICAgICABFQhByADQgGGIgQhAyAHDQALCyAFQoCAgICAgICAgH+DIQMCQAJAIAZBAUgNACAEQoCAgICAgIB4fCAGrUI0hoQhBAwBCyAEQQEgBmutiCEECyAEIAOEvwsFACAAvQsOACAAKAI8IAEgAhC3BgvlAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQYgA0EQaiEEQQIhBwJAAkACQAJAAkAgACgCPCADQRBqQQIgA0EMahASEOQGRQ0AIAQhBQwBCwNAIAYgAygCDCIBRg0CAkAgAUF/Sg0AIAQhBQwECyAEIAEgBCgCBCIISyIJQQN0aiIFIAUoAgAgASAIQQAgCRtrIghqNgIAIARBDEEEIAkbaiIEIAQoAgAgCGs2AgAgBiABayEGIAUhBCAAKAI8IAUgByAJayIHIANBDGoQEhDkBkUNAAsLIAZBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACIQEMAQtBACEBIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAIAdBAkYNACACIAUoAgRr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EGpBCGopAwAiAyAEIAMQ7QYgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEOsGQQBKDQACQCABIAkgAyAKEOsGRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEPUGIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABD1BiAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ9QYgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEPUGIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABD1BiAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDAwz8Q9QYgBUHIAGopAwAhAiAFKQNAIQQMAQsgCkL///////8/gyAIIAZyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQACxwAIAAgAkL///////////8AgzcDCCAAIAE3AwALjgkCBn8DfiMAQTBrIgQkAEIAIQoCQAJAIAJBAksNACABQQRqIQUgAkECdCICQcztAWooAgAhBiACQcDtAWooAgAhBwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ1gYhAgsg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IAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEOoGIAUgAiAEQQEgBmsQ9AYgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEPIGDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEPMGGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ6gZBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDqBiAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABD2BiAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABD2BiAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABD2BiAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABD2BiAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABD2BiAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABD2BiAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABD2BiAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABD2BiAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABD2BiAFQZABaiADQg+GQgAgBEIAEPYGIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ9gYgBUGAAWpCASACfUIAIARCABD2BiAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEPYGIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEPYGIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ9AYgBUEwaiAWIBMgBkHwAGoQ6gYgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q9gYgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABD2BiAFIAMgDkIFQgAQ9gYgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEOoGIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEOoGIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ6gYgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ6gYgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ6gZBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ6gYgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ6gYgBUEgaiACIAQgBhDqBiAFQRBqIBIgASAHEPQGIAUgAiAEIAcQ9AYgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEOkGIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDqBiACIAAgBEGB+AAgA2sQ9AYgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEGQlwYkA0GQlwJBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEREACyUBAX4gACABIAKtIAOtQiCGhCAEEIQHIQUgBUIgiKcQ+gYgBacLEwAgACABpyABQiCIpyACIAMQFAsL7vKBgAADAEGACAvY5QFpbmZpbml0eQAtSW5maW5pdHkAISBFeGNlcHRpb246IE91dE9mTWVtb3J5AGlzUmVhZE9ubHkAZGV2c192ZXJpZnkAc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBkZWxheQBzZXR1cF9jdHgAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABkZXZzX3NwZWNfaWR4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABzcGVjIG1pc3Npbmc6ICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBjaHVuayBvdmVyZmxvdwAhIEV4Y2VwdGlvbjogU3RhY2tPdmVyZmxvdwBibGl0Um93AGpkX3dzc2tfbmV3AGpkX3dlYnNvY2tfbmV3AGV4cHIxX25ldwBkZXZzX2pkX3NlbmRfcmF3AGlkaXYAcHJldgAuYXBwLmdpdGh1Yi5kZXYAJXMldQB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AHN0b3BfbGlzdABkaWdlc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAcmVzdGFydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABkZWNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudAB0Y3Bzb2NrX29uX2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABfc29ja2V0T25FdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAZGV2c19wYWNrZXRfc3BlY19wYXJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AG1hc2tlZCBzZXJ2ZXIgcGt0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdABibGl0AHdhaXQAaGVpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uU2VydmVyUGFja2V0AF9vblBhY2tldABnZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAZmlsbFJlY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX3JvbGVfc2V0X2hpbnRzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwAweDF4eHh4eHh4IGV4cGVjdGVkIGZvciBzZXJ2aWNlIGNsYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAaWR4IDw9IGN0eC0+bnVtX3BpbnMAR1BJTzogaW5pdDogJWQgcGlucwBlcXVhbHMAbWlsbGlzAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAY2FwYWJpbGl0aWVzAGlkeCA8IGN0eC0+aW1nLmhlYWRlci0+bnVtX3NlcnZpY2Vfc3BlY3MAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byAlczovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAKiBzdGFydDogJXMgJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTOiBlcnJvcjogJXMAV1NTSzogZXJyb3I6ICVzAGJhZCByZXNwOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBuIDw9IHdzLT5tc2dwdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAc29jayB3cml0ZSBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAG1ncjogc3RhcnRpbmcgY2xvdWQgYWRhcHRlcgBtZ3I6IGRldk5ldHdvcmsgbW9kZSAtIGRpc2FibGUgY2xvdWQgYWRhcHRlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAHN0YXJ0X3BrdF9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAHNwaVhmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAGJwcABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcABkZXZzX2R1bXBfaGVhcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBncGlvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBfaTJjVHJhbnNhY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AX3NvY2tldE9wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmaWxsUmFuZG9tAGFlcy0yNTYtY2NtAGZsYXNoX3Byb2dyYW0AKiBzdG9wIHByb2dyYW0AaW11bAB1bmtub3duIGN0cmwAbm9uLWZpbiBjdHJsAHRvbyBsYXJnZSBjdHJsAG51bGwAZmlsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxhYmVsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAG5vbi1taW5pbWFsAD9zcGVjaWFsAGRldk5ldHdvcmsAZGV2c19pbWdfc3RyaWR4X29rAGRldnNfZ2NfYWRkX2NodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABvdmVybGFwc1dpdGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgASW52YWxpZCBhcnJheSBsZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGJ5dGVMZW5ndGgAd2lkdGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaABkZXZzX3N0cmluZ19maW5pc2gAISB2ZXJzaW9uIG1pc21hdGNoAGVuY3J5cHRpb24gdGFnIG1pc21hdGNoAGZvckVhY2gAcCA8IGNoAHNoaWZ0X21zZwBzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAGNhbid0IHBvbmcAc2V0dGluZwBnZXR0aW5nAGJvZHkgbWlzc2luZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwBkZXZzX2dwaW9faW5pdF9kY2ZnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgB5X29mZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAaW5kZXhPZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBmbGFzaF9zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAHN6ID09IHMtPmlubmVyLnNpemUAc3RhdGUub2ZmICsgMyA8PSBzaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAX3NvY2tldFdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBfc29ja2V0Q2xvc2UAd2Vic29jayByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAG1ncjogcnVubmluZyBzZXQgdG8gZmFsc2UAZmxhc2hfZXJhc2UAdG9Mb3dlckNhc2UAdG9VcHBlckNhc2UAZGV2c19tYWtlX2Nsb3N1cmUAc3BpQ29uZmlndXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGNsb25lAGlubGluZQBkcmF3TGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBXUzogY2xvc2UgZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAEBuYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBfYWxsb2NSb2xlAGZpbGxDaXJjbGUAbmV0d29yayBub3QgYXZhaWxhYmxlAHJlY29tcHV0ZV9jYWNoZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAX3R3aW5NZXNzYWdlAGltYWdlAGRyYXdJbWFnZQBkcmF3VHJhbnNwYXJlbnRJbWFnZQBzcGlTZW5kSW1hZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbW9kZQBtZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlAGRlY29kZQBzZXRNb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBpbWdfc3RyaWRlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAFNlcnZlckludGVyZmFjZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABqZGlmOiBhdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABfc2VydmVyU2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAaG9zdCBvciBwb3J0IGludmFsaWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABub3RJbXBsZW1lbnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAcm9sZSBuYW1lICclcycgYWxyZWFkeSB1c2VkAHRyYW5zcG9zZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAldSBwYWNrZXRzIHRocm90dGxlZAAlcyBjYWxsZWQAZGV2TmV0d29yayBlbmFibGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABmaWJlciBub3Qgc3VzcGVuZGVkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAaW52YWxpZCBkaW1lbnNpb25zICVkeCVkeCVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZABpbnZhbGlkIG9mZnNldCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAEdQSU86ICVzKCVkKSBzZXQgdG8gJWQAVW5leHBlY3RlZCB0b2tlbiAnJWMnIGluIEpTT04gYXQgcG9zaXRpb24gJWQAZGJnOiBzdXNwZW5kICVkAGpkaWY6IGNyZWF0ZSByb2xlICclcycgLT4gJWQAV1M6IGhlYWRlcnMgZG9uZTsgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c19zdHJpbmdfam1wX3RyeV9hbGxvYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjAFBhY2tldFNwZWMAU2VydmljZVNwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L2ltcGxfc29ja2V0LmMAZGV2aWNlc2NyaXB0L2luc3BlY3QuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAZGV2aWNlc2NyaXB0L2ltcGxfZHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9pbXBsX2dwaW8uYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd2Vic29ja19jb25uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvaW1wbF9pbWFnZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L2ltcGxfcGFja2V0c3BlYy5jAGRldmljZXNjcmlwdC9pbXBsX3NlcnZpY2VzcGVjLmMAZGV2aWNlc2NyaXB0L3V0ZjguYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAb25fZGF0YQBleHBlY3RpbmcgdG9waWMgYW5kIGRhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtSb2xlOiAlcy4lc10AW1BhY2tldFNwZWM6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtTZXJ2aWNlU3BlYzogJXNdAFtDaXJjdWxhcl0AW0J1ZmZlclsldV0gJSpwXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJSpwLi4uXQBbSW1hZ2U6ICVkeCVkICglZCBicHApXQBmbGlwWQBmbGlwWABpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABleHBlY3RpbmcgQ09OVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMARlNUT1JfREFUQV9QQUdFUyA8PSBKRF9GU1RPUl9NQVhfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AZXhwZWN0aW5nIEJJTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAU1BJAERJU0NPTk5FQ1RJTkcAc3ogPT0gbGVuICYmIHN6IDwgREVWU19NQVhfQVNDSUlfU1RSSU5HAG1ncjogd291bGQgcmVzdGFydCBkdWUgdG8gRENGRwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBmbGFzaF9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAHdzLT5tc2dwdHIgPD0gTUFYX01FU1NBR0UATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAEkyQwA/Pz8AJWMgICVzID0+AGludDoAYXBwOgB3c3NrOgB1dGY4AHNpemUgPiBzaXplb2YoY2h1bmtfdCkgKyAxMjgAdXRmLTgAc2hhMjU2AGNudCA9PSAzIHx8IGNudCA9PSAtMwBsZW4gPT0gbDIAbG9nMgBkZXZzX2FyZ19pbWcyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBXUzogZ290IDEwMQBIVFRQLzEuMSAxMDEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAHNpemUgPCAweGYwMDAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABpZHggPj0gMAByID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAHdzczovLwBwaW5zLgA/LgAlYyAgLi4uACEgIC4uLgAsAHBhY2tldCA2NGsrACFkZXZzX2luX3ZtX2xvb3AoY3R4KQBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAZGV2c19oYW5kbGVfdHlwZSh2KSA9PSBERVZTX0hBTkRMRV9UWVBFX0dDX09CSkVDVCAmJiBkZXZzX2lzX3N0cmluZyhjdHgsIHYpAGVuY3J5cHRlZCBkYXRhIChsZW49JXUpIHNob3J0ZXIgdGhhbiB0YWdMZW4gKCV1KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBzdGF0czogJWQgb2JqZWN0cywgJWQgQiB1c2VkLCAlZCBCIGZyZWUgKCVkIEIgbWF4IGJsb2NrKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpAEdQSU86IHNraXAgJXMgLT4gJWQgKHVzZWQpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBHUElPOiBpbml0WyV1XSAlcyAtPiAlZCAoPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQBhY3Q6ICVzX0YlZCAocGM6JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VU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eyBpZiAoTW9kdWxlLmZsYXNoU2F2ZSkgTW9kdWxlLmZsYXNoU2F2ZShIRUFQVTguc2xpY2Uoc3RhcnQsIHN0YXJ0ICsgc2l6ZSkpOyB9ACh2b2lkICpzdGFydCwgdW5zaWduZWQgc2l6ZSk8Ojo+eyBpZiAoTW9kdWxlLmZsYXNoTG9hZCkgeyBjb25zdCBkYXRhID0gTW9kdWxlLmZsYXNoTG9hZCgpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2coImZsYXNoIGxvYWQsIHNpemU9IiArIGRhdGEubGVuZ3RoKTsgSEVBUFU4LnNldChkYXRhLnNsaWNlKDAsIHNpemUpLCBzdGFydCk7IH0gfQAodm9pZCAqZnJhbWUpPDo6PnsgY29uc3Qgc3ogPSAxMiArIEhFQVBVOFtmcmFtZSArIDJdOyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoZXhpdGNvZGUpIGNvbnNvbGUubG9nKCJQQU5JQyIsIGV4aXRjb2RlKTsgaWYgKE1vZHVsZS5wYW5pY0hhbmRsZXIpIE1vZHVsZS5wYW5pY0hhbmRsZXIoZXhpdGNvZGUpOyB9AChjb25zdCB2b2lkICpmcmFtZSwgdW5zaWduZWQgc3opPDo6PnsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKE1vZHVsZS5kZXBsb3lIYW5kbGVyKSBNb2R1bGUuZGVwbG95SGFuZGxlcihleGl0Y29kZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIERhdGUubm93KCk7IH0AKHVpbnQ4X3QgKiB0cmcsIHVuc2lnbmVkIHNpemUpPDo6PnsgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHNpemUpOyBpZiAodHlwZW9mIHdpbmRvdyA9PSAib2JqZWN0IiAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWYpOyBlbHNlIHsgYnVmID0gcmVxdWlyZSgiY3J5cHRvIikucmFuZG9tQnl0ZXMoc2l6ZSk7IH0gSEVBUFU4LnNldChidWYsIHRyZyk7IH0AKGNvbnN0IGNoYXIgKnB0cik8Ojo+eyBjb25zdCBzID0gVVRGOFRvU3RyaW5nKHB0ciwgMTAyNCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZyhzKTsgZWxzZSBjb25zb2xlLmRlYnVnKHMpOyB9AChjb25zdCBjaGFyICpob3N0bmFtZSwgaW50IHBvcnQpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrT3Blbihob3N0bmFtZSwgcG9ydCk7IH0AKGNvbnN0IHZvaWQgKmJ1ZiwgdW5zaWduZWQgc2l6ZSk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tXcml0ZShidWYsIHNpemUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja0Nsb3NlKCk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrSXNBdmFpbGFibGUoKTsgfQAAo4qBgAAEbmFtZQGyiQGHBwANZW1fZmxhc2hfc2F2ZQENZW1fZmxhc2hfc2l6ZQINZW1fZmxhc2hfbG9hZAMFYWJvcnQEE2VtX3NlbmRfbGFyZ2VfZnJhbWUFE19kZXZzX3BhbmljX2hhbmRsZXIGEWVtX2RlcGxveV9oYW5kbGVyBxdlbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQgNZW1fc2VuZF9mcmFtZQkEZXhpdAoLZW1fdGltZV9ub3cLDmVtX3ByaW50X2RtZXNnDA9famRfdGNwc29ja19uZXcNEV9qZF90Y3Bzb2NrX3dyaXRlDhFfamRfdGNwc29ja19jbG9zZQ8YX2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFBpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxURX193YXNtX2NhbGxfY3RvcnMWD2ZsYXNoX2Jhc2VfYWRkchcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaCmZsYXNoX2luaXQbCGh3X3BhbmljHAhqZF9ibGluax0HamRfZ2xvdx4UamRfYWxsb2Nfc3RhY2tfY2hlY2sfCGpkX2FsbG9jIAdqZF9mcmVlIQ10YXJnZXRfaW5faXJxIhJ0YXJnZXRfZGlzYWJsZV9pcnEjEXRhcmdldF9lbmFibGVfaXJxJBhqZF9kZXZpY2VfaWRfZnJvbV9zdHJpbmclFWRldnNfc2VuZF9sYXJnZV9mcmFtZSYSZGV2c19wYW5pY19oYW5kbGVyJxNkZXZzX2RlcGxveV9oYW5kbGVyKBRqZF9jcnlwdG9fZ2V0X3JhbmRvbSkQamRfZW1fc2VuZF9mcmFtZSoaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIrGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLApqZF9lbV9pbml0LQ1qZF9lbV9wcm9jZXNzLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczMMaHdfZGV2aWNlX2lkNAx0YXJnZXRfcmVzZXQ1DnRpbV9nZXRfbWljcm9zNg9hcHBfcHJpbnRfZG1lc2c3EmpkX3RjcHNvY2tfcHJvY2VzczgRYXBwX2luaXRfc2VydmljZXM5EmRldnNfY2xpZW50X2RlcGxveToUY2xpZW50X2V2ZW50X2hhbmRsZXI7CWFwcF9kbWVzZzwLZmx1c2hfZG1lc2c9C2FwcF9wcm9jZXNzPg5qZF90Y3Bzb2NrX25ldz8QamRfdGNwc29ja193cml0ZUAQamRfdGNwc29ja19jbG9zZUEXamRfdGNwc29ja19pc19hdmFpbGFibGVCFmpkX2VtX3RjcHNvY2tfb25fZXZlbnRDB3R4X2luaXRED2pkX3BhY2tldF9yZWFkeUUKdHhfcHJvY2Vzc0YNdHhfc2VuZF9mcmFtZUcOZGV2c19idWZmZXJfb3BIEmRldnNfYnVmZmVyX2RlY29kZUkSZGV2c19idWZmZXJfZW5jb2RlSg9kZXZzX2NyZWF0ZV9jdHhLCXNldHVwX2N0eEwKZGV2c190cmFjZU0PZGV2c19lcnJvcl9jb2RlThlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyTwljbGVhcl9jdHhQDWRldnNfZnJlZV9jdHhRCGRldnNfb29tUglkZXZzX2ZyZWVTEWRldnNjbG91ZF9wcm9jZXNzVBdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldFUQZGV2c2Nsb3VkX3VwbG9hZFYUZGV2c2Nsb3VkX29uX21lc3NhZ2VXDmRldnNjbG91ZF9pbml0WBRkZXZzX3RyYWNrX2V4Y2VwdGlvblkPZGV2c2RiZ19wcm9jZXNzWhFkZXZzZGJnX3Jlc3RhcnRlZFsVZGV2c2RiZ19oYW5kbGVfcGFja2V0XAtzZW5kX3ZhbHVlc10RdmFsdWVfZnJvbV90YWdfdjBeGWRldnNkYmdfb3Blbl9yZXN1bHRzX3BpcGVfDW9ial9nZXRfcHJvcHNgDGV4cGFuZF92YWx1ZWESZGV2c2RiZ19zdXNwZW5kX2NiYgxkZXZzZGJnX2luaXRjEGV4cGFuZF9rZXlfdmFsdWVkBmt2X2FkZGUPZGV2c21ncl9wcm9jZXNzZgd0cnlfcnVuZwdydW5faW1naAxzdG9wX3Byb2dyYW1pD2RldnNtZ3JfcmVzdGFydGoUZGV2c21ncl9kZXBsb3lfc3RhcnRrFGRldnNtZ3JfZGVwbG95X3dyaXRlbBBkZXZzbWdyX2dldF9oYXNobRVkZXZzbWdyX2hhbmRsZV9wYWNrZXRuDmRlcGxveV9oYW5kbGVybxNkZXBsb3lfbWV0YV9oYW5kbGVycA9kZXZzbWdyX2dldF9jdHhxDmRldnNtZ3JfZGVwbG95cgxkZXZzbWdyX2luaXRzEWRldnNtZ3JfY2xpZW50X2V2dBZkZXZzX3NlcnZpY2VfZnVsbF9pbml0dRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb252CmRldnNfcGFuaWN3GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXgQZGV2c19maWJlcl9zbGVlcHkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsehpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3sRZGV2c19pbWdfZnVuX25hbWV8EWRldnNfZmliZXJfYnlfdGFnfRBkZXZzX2ZpYmVyX3N0YXJ0fhRkZXZzX2ZpYmVyX3Rlcm1pYW50ZX8OZGV2c19maWJlcl9ydW6AARNkZXZzX2ZpYmVyX3N5bmNfbm93gQEVX2RldnNfaW52YWxpZF9wcm9ncmFtggEYZGV2c19maWJlcl9nZXRfbWF4X3NsZWVwgwEPZGV2c19maWJlcl9wb2tlhAERZGV2c19nY19hZGRfY2h1bmuFARZkZXZzX2djX29ial9jaGVja19jb3JlhgETamRfZ2NfYW55X3RyeV9hbGxvY4cBB2RldnNfZ2OIAQ9maW5kX2ZyZWVfYmxvY2uJARJkZXZzX2FueV90cnlfYWxsb2OKAQ5kZXZzX3RyeV9hbGxvY4sBC2pkX2djX3VucGlujAEKamRfZ2NfZnJlZY0BFGRldnNfdmFsdWVfaXNfcGlubmVkjgEOZGV2c192YWx1ZV9waW6PARBkZXZzX3ZhbHVlX3VucGlukAESZGV2c19tYXBfdHJ5X2FsbG9jkQEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkgEUZGV2c19hcnJheV90cnlfYWxsb2OTARpkZXZzX2J1ZmZlcl90cnlfYWxsb2NfaW5pdJQBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5UBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5YBEGRldnNfc3RyaW5nX3ByZXCXARJkZXZzX3N0cmluZ19maW5pc2iYARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJkBD2RldnNfZ2Nfc2V0X2N0eJoBDmRldnNfZ2NfY3JlYXRlmwEPZGV2c19nY19kZXN0cm95nAERZGV2c19nY19vYmpfY2hlY2udAQ5kZXZzX2R1bXBfaGVhcJ4BC3NjYW5fZ2Nfb2JqnwERcHJvcF9BcnJheV9sZW5ndGigARJtZXRoMl9BcnJheV9pbnNlcnShARJmdW4xX0FycmF5X2lzQXJyYXmiARRtZXRoWF9BcnJheV9fX2N0b3JfX6MBEG1ldGhYX0FycmF5X3B1c2ikARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WlARFtZXRoWF9BcnJheV9zbGljZaYBEG1ldGgxX0FycmF5X2pvaW6nARFmdW4xX0J1ZmZlcl9hbGxvY6gBEGZ1bjJfQnVmZmVyX2Zyb22pARJwcm9wX0J1ZmZlcl9sZW5ndGiqARVtZXRoMV9CdWZmZXJfdG9TdHJpbmerARNtZXRoM19CdWZmZXJfZmlsbEF0rAETbWV0aDRfQnVmZmVyX2JsaXRBdK0BFG1ldGgzX0J1ZmZlcl9pbmRleE9mrgEXbWV0aDBfQnVmZmVyX2ZpbGxSYW5kb22vARRtZXRoNF9CdWZmZXJfZW5jcnlwdLABEmZ1bjNfQnVmZmVyX2RpZ2VzdLEBFGRldnNfY29tcHV0ZV90aW1lb3V0sgEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCzARdmdW4xX0RldmljZVNjcmlwdF9kZWxhebQBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY7UBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdLYBGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnS3ARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXS4ARdmdW4yX0RldmljZVNjcmlwdF9wcmludLkBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXS6ARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLsBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByvAEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme9ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO+ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVyvwEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmTAARxmdW4yX0RldmljZVNjcmlwdF9fYWxsb2NSb2xlwQEgZnVuMF9EZXZpY2VTY3JpcHRfbm90SW1wbGVtZW50ZWTCAR5mdW4yX0RldmljZVNjcmlwdF9fdHdpbk1lc3NhZ2XDASFmdW4zX0RldmljZVNjcmlwdF9faTJjVHJhbnNhY3Rpb27EAR5mdW41X0RldmljZVNjcmlwdF9zcGlDb25maWd1cmXFARlmdW4yX0RldmljZVNjcmlwdF9zcGlYZmVyxgEeZnVuM19EZXZpY2VTY3JpcHRfc3BpU2VuZEltYWdlxwEUbWV0aDFfRXJyb3JfX19jdG9yX1/IARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fyQEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fygEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1/LAQ9wcm9wX0Vycm9yX25hbWXMARFtZXRoMF9FcnJvcl9wcmludM0BD3Byb3BfRHNGaWJlcl9pZM4BFnByb3BfRHNGaWJlcl9zdXNwZW5kZWTPARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZdABF21ldGgwX0RzRmliZXJfdGVybWluYXRl0QEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZNIBEWZ1bjBfRHNGaWJlcl9zZWxm0wEUbWV0aFhfRnVuY3Rpb25fc3RhcnTUARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZdUBEnByb3BfRnVuY3Rpb25fbmFtZdYBE2RldnNfZ3Bpb19pbml0X2RjZmfXAQlpbml0X3VzZWTYAQ5wcm9wX0dQSU9fbW9kZdkBDmluaXRfcGluX3N0YXRl2gEWcHJvcF9HUElPX2NhcGFiaWxpdGllc9sBD3Byb3BfR1BJT192YWx1ZdwBEm1ldGgxX0dQSU9fc2V0TW9kZd0BFmZ1bjFfRGV2aWNlU2NyaXB0X2dwaW/eARBwcm9wX0ltYWdlX3dpZHRo3wERcHJvcF9JbWFnZV9oZWlnaHTgAQ5wcm9wX0ltYWdlX2JwcOEBEXByb3BfSW1hZ2VfYnVmZmVy4gEQZnVuNV9JbWFnZV9hbGxvY+MBD21ldGgzX0ltYWdlX3NldOQBDGRldnNfYXJnX2ltZ+UBB3NldENvcmXmAQ9tZXRoMl9JbWFnZV9nZXTnARBtZXRoMV9JbWFnZV9maWxs6AEJZmlsbF9yZWN06QEUbWV0aDVfSW1hZ2VfZmlsbFJlY3TqARJtZXRoMV9JbWFnZV9lcXVhbHPrARFtZXRoMF9JbWFnZV9jbG9uZewBDWFsbG9jX2ltZ19yZXTtARFtZXRoMF9JbWFnZV9mbGlwWO4BB3BpeF9wdHLvARFtZXRoMF9JbWFnZV9mbGlwWfABFm1ldGgwX0ltYWdlX3RyYW5zcG9zZWTxARVtZXRoM19JbWFnZV9kcmF3SW1hZ2XyAQ1kZXZzX2FyZ19pbWcy8wENZHJhd0ltYWdlQ29yZfQBIG1ldGg0X0ltYWdlX2RyYXdUcmFuc3BhcmVudEltYWdl9QEYbWV0aDNfSW1hZ2Vfb3ZlcmxhcHNXaXRo9gEUbWV0aDVfSW1hZ2VfZHJhd0xpbmX3AQhkcmF3TGluZfgBE21ha2Vfd3JpdGFibGVfaW1hZ2X5AQtkcmF3TGluZUxvd/oBDGRyYXdMaW5lSGlnaPsBE21ldGg1X0ltYWdlX2JsaXRSb3f8ARFtZXRoMTFfSW1hZ2VfYmxpdP0BFm1ldGg0X0ltYWdlX2ZpbGxDaXJjbGX+AQ9mdW4yX0pTT05fcGFyc2X/ARNmdW4zX0pTT05fc3RyaW5naWZ5gAIOZnVuMV9NYXRoX2NlaWyBAg9mdW4xX01hdGhfZmxvb3KCAg9mdW4xX01hdGhfcm91bmSDAg1mdW4xX01hdGhfYWJzhAIQZnVuMF9NYXRoX3JhbmRvbYUCE2Z1bjFfTWF0aF9yYW5kb21JbnSGAg1mdW4xX01hdGhfbG9nhwINZnVuMl9NYXRoX3Bvd4gCDmZ1bjJfTWF0aF9pZGl2iQIOZnVuMl9NYXRoX2ltb2SKAg5mdW4yX01hdGhfaW11bIsCDWZ1bjJfTWF0aF9taW6MAgtmdW4yX21pbm1heI0CDWZ1bjJfTWF0aF9tYXiOAhJmdW4yX09iamVjdF9hc3NpZ26PAhBmdW4xX09iamVjdF9rZXlzkAITZnVuMV9rZXlzX29yX3ZhbHVlc5ECEmZ1bjFfT2JqZWN0X3ZhbHVlc5ICGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9mkwIVbWV0aDFfT2JqZWN0X19fY3Rvcl9flAIdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3eVAhJwcm9wX0RzUGFja2V0X3JvbGWWAh5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXKXAhVwcm9wX0RzUGFja2V0X3Nob3J0SWSYAhpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleJkCHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmSaAhNwcm9wX0RzUGFja2V0X2ZsYWdzmwIXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmScAhZwcm9wX0RzUGFja2V0X2lzUmVwb3J0nQIVcHJvcF9Ec1BhY2tldF9wYXlsb2FkngIVcHJvcF9Ec1BhY2tldF9pc0V2ZW50nwIXcHJvcF9Ec1BhY2tldF9ldmVudENvZGWgAhZwcm9wX0RzUGFja2V0X2lzUmVnU2V0oQIWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldKICFXByb3BfRHNQYWNrZXRfcmVnQ29kZaMCFnByb3BfRHNQYWNrZXRfaXNBY3Rpb26kAhVkZXZzX3BrdF9zcGVjX2J5X2NvZGWlAhJwcm9wX0RzUGFja2V0X3NwZWOmAhFkZXZzX3BrdF9nZXRfc3BlY6cCFW1ldGgwX0RzUGFja2V0X2RlY29kZagCHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVkqQIYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW50qgIWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZasCFnByb3BfRHNQYWNrZXRTcGVjX2NvZGWsAhpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZa0CGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGWuAhJkZXZzX3BhY2tldF9kZWNvZGWvAhVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWSwAhREc1JlZ2lzdGVyX3JlYWRfY29udLECEmRldnNfcGFja2V0X2VuY29kZbICFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGWzAhZwcm9wX0RzUGFja2V0SW5mb19yb2xltAIWcHJvcF9Ec1BhY2tldEluZm9fbmFtZbUCFnByb3BfRHNQYWNrZXRJbmZvX2NvZGW2AhhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1+3AhNwcm9wX0RzUm9sZV9pc0JvdW5kuAIQcHJvcF9Ec1JvbGVfc3BlY7kCGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZLoCInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXK7Ahdwcm9wX0RzU2VydmljZVNwZWNfbmFtZbwCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwvQIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26+Ah1mdW4yX0RldmljZVNjcmlwdF9fc29ja2V0T3Blbr8CEHRjcHNvY2tfb25fZXZlbnTAAh5mdW4wX0RldmljZVNjcmlwdF9fc29ja2V0Q2xvc2XBAh5mdW4xX0RldmljZVNjcmlwdF9fc29ja2V0V3JpdGXCAhJwcm9wX1N0cmluZ19sZW5ndGjDAhZwcm9wX1N0cmluZ19ieXRlTGVuZ3RoxAIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTFAhNtZXRoMV9TdHJpbmdfY2hhckF0xgISbWV0aDJfU3RyaW5nX3NsaWNlxwIYZnVuWF9TdHJpbmdfZnJvbUNoYXJDb2RlyAIUbWV0aDNfU3RyaW5nX2luZGV4T2bJAhhtZXRoMF9TdHJpbmdfdG9Mb3dlckNhc2XKAhNtZXRoMF9TdHJpbmdfdG9DYXNlywIYbWV0aDBfU3RyaW5nX3RvVXBwZXJDYXNlzAIMZGV2c19pbnNwZWN0zQILaW5zcGVjdF9vYmrOAgdhZGRfc3RyzwINaW5zcGVjdF9maWVsZNACFGRldnNfamRfZ2V0X3JlZ2lzdGVy0QIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZNICEGRldnNfamRfc2VuZF9jbWTTAhBkZXZzX2pkX3NlbmRfcmF31AITZGV2c19qZF9zZW5kX2xvZ21zZ9UCE2RldnNfamRfcGt0X2NhcHR1cmXWAhFkZXZzX2pkX3dha2Vfcm9sZdcCEmRldnNfamRfc2hvdWxkX3J1btgCE2RldnNfamRfcHJvY2Vzc19wa3TZAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWTaAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdsCEmRldnNfamRfYWZ0ZXJfdXNlctwCFGRldnNfamRfcm9sZV9jaGFuZ2Vk3QIUZGV2c19qZF9yZXNldF9wYWNrZXTeAhJkZXZzX2pkX2luaXRfcm9sZXPfAhJkZXZzX2pkX2ZyZWVfcm9sZXPgAhJkZXZzX2pkX2FsbG9jX3JvbGXhAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3PiAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc+MCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc+QCD2pkX25lZWRfdG9fc2VuZOUCEGRldnNfanNvbl9lc2NhcGXmAhVkZXZzX2pzb25fZXNjYXBlX2NvcmXnAg9kZXZzX2pzb25fcGFyc2XoAgpqc29uX3ZhbHVl6QIMcGFyc2Vfc3RyaW5n6gITZGV2c19qc29uX3N0cmluZ2lmeesCDXN0cmluZ2lmeV9vYmrsAhFwYXJzZV9zdHJpbmdfY29yZe0CCmFkZF9pbmRlbnTuAg9zdHJpbmdpZnlfZmllbGTvAhFkZXZzX21hcGxpa2VfaXRlcvACF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN08QISZGV2c19tYXBfY29weV9pbnRv8gIMZGV2c19tYXBfc2V08wIGbG9va3Vw9AITZGV2c19tYXBsaWtlX2lzX21hcPUCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc/YCEWRldnNfYXJyYXlfaW5zZXJ09wIIa3ZfYWRkLjH4AhJkZXZzX3Nob3J0X21hcF9zZXT5Ag9kZXZzX21hcF9kZWxldGX6AhJkZXZzX3Nob3J0X21hcF9nZXT7AiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkePwCHGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWP9AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWP+Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHj/AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY4ADF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0gQMYZGV2c19yb2xlX3NwZWNfZm9yX2NsYXNzggMXZGV2c19wYWNrZXRfc3BlY19wYXJlbnSDAw5kZXZzX3JvbGVfc3BlY4QDEWRldnNfcm9sZV9zZXJ2aWNlhQMOZGV2c19yb2xlX25hbWWGAxJkZXZzX2dldF9iYXNlX3NwZWOHAxBkZXZzX3NwZWNfbG9va3VwiAMSZGV2c19mdW5jdGlvbl9iaW5kiQMRZGV2c19tYWtlX2Nsb3N1cmWKAw5kZXZzX2dldF9mbmlkeIsDE2RldnNfZ2V0X2ZuaWR4X2NvcmWMAxhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSNAxhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSOAxNkZXZzX2dldF9zcGVjX3Byb3RvjwMTZGV2c19nZXRfcm9sZV9wcm90b5ADG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd5EDFWRldnNfZ2V0X3N0YXRpY19wcm90b5IDG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb5MDHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtlAMWZGV2c19tYXBsaWtlX2dldF9wcm90b5UDGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZJYDHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZJcDEGRldnNfaW5zdGFuY2Vfb2aYAw9kZXZzX29iamVjdF9nZXSZAwxkZXZzX3NlcV9nZXSaAwxkZXZzX2FueV9nZXSbAwxkZXZzX2FueV9zZXScAwxkZXZzX3NlcV9zZXSdAw5kZXZzX2FycmF5X3NldJ4DE2RldnNfYXJyYXlfcGluX3B1c2ifAxFkZXZzX2FyZ19pbnRfZGVmbKADDGRldnNfYXJnX2ludKEDDWRldnNfYXJnX2Jvb2yiAw9kZXZzX2FyZ19kb3VibGWjAw9kZXZzX3JldF9kb3VibGWkAwxkZXZzX3JldF9pbnSlAw1kZXZzX3JldF9ib29spgMPZGV2c19yZXRfZ2NfcHRypwMRZGV2c19hcmdfc2VsZl9tYXCoAxFkZXZzX3NldHVwX3Jlc3VtZakDD2RldnNfY2FuX2F0dGFjaKoDGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWWrAxVkZXZzX21hcGxpa2VfdG9fdmFsdWWsAxJkZXZzX3JlZ2NhY2hlX2ZyZWWtAxZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsrgMXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWSvAxNkZXZzX3JlZ2NhY2hlX2FsbG9jsAMUZGV2c19yZWdjYWNoZV9sb29rdXCxAxFkZXZzX3JlZ2NhY2hlX2FnZbIDF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlswMSZGV2c19yZWdjYWNoZV9uZXh0tAMPamRfc2V0dGluZ3NfZ2V0tQMPamRfc2V0dGluZ3Nfc2V0tgMOZGV2c19sb2dfdmFsdWW3Aw9kZXZzX3Nob3dfdmFsdWW4AxBkZXZzX3Nob3dfdmFsdWUwuQMNY29uc3VtZV9jaHVua7oDDXNoYV8yNTZfY2xvc2W7Aw9qZF9zaGEyNTZfc2V0dXC8AxBqZF9zaGEyNTZfdXBkYXRlvQMQamRfc2hhMjU2X2ZpbmlzaL4DFGpkX3NoYTI1Nl9obWFjX3NldHVwvwMVamRfc2hhMjU2X2htYWNfdXBkYXRlwAMVamRfc2hhMjU2X2htYWNfZmluaXNowQMOamRfc2hhMjU2X2hrZGbCAw5kZXZzX3N0cmZvcm1hdMMDDmRldnNfaXNfc3RyaW5nxAMOZGV2c19pc19udW1iZXLFAxtkZXZzX3N0cmluZ19nZXRfdXRmOF9zdHJ1Y3TGAxRkZXZzX3N0cmluZ19nZXRfdXRmOMcDE2RldnNfYnVpbHRpbl9zdHJpbmfIAxRkZXZzX3N0cmluZ192c3ByaW50ZskDE2RldnNfc3RyaW5nX3NwcmludGbKAxVkZXZzX3N0cmluZ19mcm9tX3V0ZjjLAxRkZXZzX3ZhbHVlX3RvX3N0cmluZ8wDEGJ1ZmZlcl90b19zdHJpbmfNAxlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxkzgMSZGV2c19zdHJpbmdfY29uY2F0zwMRZGV2c19zdHJpbmdfc2xpY2XQAxJkZXZzX3B1c2hfdHJ5ZnJhbWXRAxFkZXZzX3BvcF90cnlmcmFtZdIDD2RldnNfZHVtcF9zdGFja9MDE2RldnNfZHVtcF9leGNlcHRpb27UAwpkZXZzX3Rocm931QMSZGV2c19wcm9jZXNzX3Rocm931gMQZGV2c19hbGxvY19lcnJvctcDFWRldnNfdGhyb3dfdHlwZV9lcnJvctgDGGRldnNfdGhyb3dfZ2VuZXJpY19lcnJvctkDFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LaAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LbAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvctwDHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dN0DGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvct4DF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y3wMRZGV2c19zdHJpbmdfaW5kZXjgAxJkZXZzX3N0cmluZ19sZW5ndGjhAxlkZXZzX3V0ZjhfZnJvbV9jb2RlX3BvaW504gMbZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3Ro4wMUZGV2c191dGY4X2NvZGVfcG9pbnTkAxRkZXZzX3N0cmluZ19qbXBfaW5pdOUDDmRldnNfdXRmOF9pbml05gMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZecDE2RldnNfdmFsdWVfZnJvbV9pbnToAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbOkDF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy6gMUZGV2c192YWx1ZV90b19kb3VibGXrAxFkZXZzX3ZhbHVlX3RvX2ludOwDEmRldnNfdmFsdWVfdG9fYm9vbO0DDmRldnNfaXNfYnVmZmVy7gMXZGV2c19idWZmZXJfaXNfd3JpdGFibGXvAxBkZXZzX2J1ZmZlcl9kYXRh8AMTZGV2c19idWZmZXJpc2hfZGF0YfEDFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq8gMNZGV2c19pc19hcnJhefMDEWRldnNfdmFsdWVfdHlwZW9m9AMPZGV2c19pc19udWxsaXNo9QMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZPYDFGRldnNfdmFsdWVfYXBwcm94X2Vx9wMSZGV2c192YWx1ZV9pZWVlX2Vx+AMNZGV2c192YWx1ZV9lcfkDHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbmf6Ax5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP7AxJkZXZzX2ltZ19zdHJpZHhfb2v8AxJkZXZzX2R1bXBfdmVyc2lvbnP9AwtkZXZzX3Zlcmlmef4DEWRldnNfZmV0Y2hfb3Bjb2Rl/wMOZGV2c192bV9yZXN1bWWABBFkZXZzX3ZtX3NldF9kZWJ1Z4EEGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOCBBhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSDBAxkZXZzX3ZtX2hhbHSEBA9kZXZzX3ZtX3N1c3BlbmSFBBZkZXZzX3ZtX3NldF9icmVha3BvaW50hgQUZGV2c192bV9leGVjX29wY29kZXOHBA9kZXZzX2luX3ZtX2xvb3CIBBpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIkEF2RldnNfaW1nX2dldF9zdHJpbmdfam1wigQRZGV2c19pbWdfZ2V0X3V0ZjiLBBRkZXZzX2dldF9zdGF0aWNfdXRmOIwEFGRldnNfdmFsdWVfYnVmZmVyaXNojQQMZXhwcl9pbnZhbGlkjgQUZXhwcnhfYnVpbHRpbl9vYmplY3SPBAtzdG10MV9jYWxsMJAEC3N0bXQyX2NhbGwxkQQLc3RtdDNfY2FsbDKSBAtzdG10NF9jYWxsM5MEC3N0bXQ1X2NhbGw0lAQLc3RtdDZfY2FsbDWVBAtzdG10N19jYWxsNpYEC3N0bXQ4X2NhbGw3lwQLc3RtdDlfY2FsbDiYBBJzdG10Ml9pbmRleF9kZWxldGWZBAxzdG10MV9yZXR1cm6aBAlzdG10eF9qbXCbBAxzdG10eDFfam1wX3qcBApleHByMl9iaW5knQQSZXhwcnhfb2JqZWN0X2ZpZWxkngQSc3RtdHgxX3N0b3JlX2xvY2FsnwQTc3RtdHgxX3N0b3JlX2dsb2JhbKAEEnN0bXQ0X3N0b3JlX2J1ZmZlcqEECWV4cHIwX2luZqIEEGV4cHJ4X2xvYWRfbG9jYWyjBBFleHByeF9sb2FkX2dsb2JhbKQEC2V4cHIxX3VwbHVzpQQLZXhwcjJfaW5kZXimBA9zdG10M19pbmRleF9zZXSnBBRleHByeDFfYnVpbHRpbl9maWVsZKgEEmV4cHJ4MV9hc2NpaV9maWVsZKkEEWV4cHJ4MV91dGY4X2ZpZWxkqgQQZXhwcnhfbWF0aF9maWVsZKsEDmV4cHJ4X2RzX2ZpZWxkrAQPc3RtdDBfYWxsb2NfbWFwrQQRc3RtdDFfYWxsb2NfYXJyYXmuBBJzdG10MV9hbGxvY19idWZmZXKvBBdleHByeF9zdGF0aWNfc3BlY19wcm90b7AEE2V4cHJ4X3N0YXRpY19idWZmZXKxBBtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmeyBBlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nswQYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5ntAQVZXhwcnhfc3RhdGljX2Z1bmN0aW9utQQNZXhwcnhfbGl0ZXJhbLYEEWV4cHJ4X2xpdGVyYWxfZjY0twQRZXhwcjNfbG9hZF9idWZmZXK4BA1leHByMF9yZXRfdmFsuQQMZXhwcjFfdHlwZW9mugQPZXhwcjBfdW5kZWZpbmVkuwQSZXhwcjFfaXNfdW5kZWZpbmVkvAQKZXhwcjBfdHJ1Zb0EC2V4cHIwX2ZhbHNlvgQNZXhwcjFfdG9fYm9vbL8ECWV4cHIwX25hbsAECWV4cHIxX2Fic8EEDWV4cHIxX2JpdF9ub3TCBAxleHByMV9pc19uYW7DBAlleHByMV9uZWfEBAlleHByMV9ub3TFBAxleHByMV90b19pbnTGBAlleHByMl9hZGTHBAlleHByMl9zdWLIBAlleHByMl9tdWzJBAlleHByMl9kaXbKBA1leHByMl9iaXRfYW5kywQMZXhwcjJfYml0X29yzAQNZXhwcjJfYml0X3hvcs0EEGV4cHIyX3NoaWZ0X2xlZnTOBBFleHByMl9zaGlmdF9yaWdodM8EGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk0AQIZXhwcjJfZXHRBAhleHByMl9sZdIECGV4cHIyX2x00wQIZXhwcjJfbmXUBBBleHByMV9pc19udWxsaXNo1QQUc3RtdHgyX3N0b3JlX2Nsb3N1cmXWBBNleHByeDFfbG9hZF9jbG9zdXJl1wQSZXhwcnhfbWFrZV9jbG9zdXJl2AQQZXhwcjFfdHlwZW9mX3N0ctkEE3N0bXR4X2ptcF9yZXRfdmFsX3raBBBzdG10Ml9jYWxsX2FycmF52wQJc3RtdHhfdHJ53AQNc3RtdHhfZW5kX3Ryed0EC3N0bXQwX2NhdGNo3gQNc3RtdDBfZmluYWxsed8EC3N0bXQxX3Rocm934AQOc3RtdDFfcmVfdGhyb3fhBBBzdG10eDFfdGhyb3dfam1w4gQOc3RtdDBfZGVidWdnZXLjBAlleHByMV9uZXfkBBFleHByMl9pbnN0YW5jZV9vZuUECmV4cHIwX251bGzmBA9leHByMl9hcHByb3hfZXHnBA9leHByMl9hcHByb3hfbmXoBBNzdG10MV9zdG9yZV9yZXRfdmFs6QQRZXhwcnhfc3RhdGljX3NwZWPqBA9kZXZzX3ZtX3BvcF9hcmfrBBNkZXZzX3ZtX3BvcF9hcmdfdTMy7AQTZGV2c192bV9wb3BfYXJnX2kzMu0EFmRldnNfdm1fcG9wX2FyZ19idWZmZXLuBBJqZF9hZXNfY2NtX2VuY3J5cHTvBBJqZF9hZXNfY2NtX2RlY3J5cHTwBAxBRVNfaW5pdF9jdHjxBA9BRVNfRUNCX2VuY3J5cHTyBBBqZF9hZXNfc2V0dXBfa2V58wQOamRfYWVzX2VuY3J5cHT0BBBqZF9hZXNfY2xlYXJfa2V59QQOamRfd2Vic29ja19uZXf2BBdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZfcEDHNlbmRfbWVzc2FnZfgEE2pkX3RjcHNvY2tfb25fZXZlbnT5BAdvbl9kYXRh+gQLcmFpc2VfZXJyb3L7BAlzaGlmdF9tc2f8BBBqZF93ZWJzb2NrX2Nsb3Nl/QQLamRfd3Nza19uZXf+BBRqZF93c3NrX3NlbmRfbWVzc2FnZf8EE2pkX3dlYnNvY2tfb25fZXZlbnSABQdkZWNyeXB0gQUNamRfd3Nza19jbG9zZYIFEGpkX3dzc2tfb25fZXZlbnSDBQtyZXNwX3N0YXR1c4QFEndzc2toZWFsdGhfcHJvY2Vzc4UFFHdzc2toZWFsdGhfcmVjb25uZWN0hgUYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0hwUPc2V0X2Nvbm5fc3RyaW5niAURY2xlYXJfY29ubl9zdHJpbmeJBQ93c3NraGVhbHRoX2luaXSKBRF3c3NrX3NlbmRfbWVzc2FnZYsFEXdzc2tfaXNfY29ubmVjdGVkjAUUd3Nza190cmFja19leGNlcHRpb26NBRJ3c3NrX3NlcnZpY2VfcXVlcnmOBRxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpljwUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZZAFD3JvbGVtZ3JfcHJvY2Vzc5EFEHJvbGVtZ3JfYXV0b2JpbmSSBRVyb2xlbWdyX2hhbmRsZV9wYWNrZXSTBRRqZF9yb2xlX21hbmFnZXJfaW5pdJQFGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZJUFEWpkX3JvbGVfc2V0X2hpbnRzlgUNamRfcm9sZV9hbGxvY5cFEGpkX3JvbGVfZnJlZV9hbGyYBRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kmQUTamRfY2xpZW50X2xvZ19ldmVudJoFE2pkX2NsaWVudF9zdWJzY3JpYmWbBRRqZF9jbGllbnRfZW1pdF9ldmVudJwFFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VknQUQamRfZGV2aWNlX2xvb2t1cJ4FGGpkX2RldmljZV9sb29rdXBfc2VydmljZZ8FE2pkX3NlcnZpY2Vfc2VuZF9jbWSgBRFqZF9jbGllbnRfcHJvY2Vzc6EFDmpkX2RldmljZV9mcmVlogUXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSjBQ9qZF9kZXZpY2VfYWxsb2OkBRBzZXR0aW5nc19wcm9jZXNzpQUWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKYFDXNldHRpbmdzX2luaXSnBQ50YXJnZXRfc3RhbmRieagFD2pkX2N0cmxfcHJvY2Vzc6kFFWpkX2N0cmxfaGFuZGxlX3BhY2tldKoFDGpkX2N0cmxfaW5pdKsFFGRjZmdfc2V0X3VzZXJfY29uZmlnrAUJZGNmZ19pbml0rQUNZGNmZ192YWxpZGF0Za4FDmRjZmdfZ2V0X2VudHJ5rwUTZGNmZ19nZXRfbmV4dF9lbnRyebAFDGRjZmdfZ2V0X2kzMrEFDGRjZmdfZ2V0X3UzMrIFD2RjZmdfZ2V0X3N0cmluZ7MFDGRjZmdfaWR4X2tlebQFCWpkX3ZkbWVzZ7UFEWpkX2RtZXNnX3N0YXJ0cHRytgUNamRfZG1lc2dfcmVhZLcFEmpkX2RtZXNnX3JlYWRfbGluZbgFE2pkX3NldHRpbmdzX2dldF9iaW65BQpmaW5kX2VudHJ5ugUPcmVjb21wdXRlX2NhY2hluwUTamRfc2V0dGluZ3Nfc2V0X2JpbrwFC2pkX2ZzdG9yX2djvQUVamRfc2V0dGluZ3NfZ2V0X2xhcmdlvgUWamRfc2V0dGluZ3NfcHJlcF9sYXJnZb8FCm1hcmtfbGFyZ2XABRdqZF9zZXR0aW5nc193cml0ZV9sYXJnZcEFFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XCBRBqZF9zZXRfbWF4X3NsZWVwwwUNamRfaXBpcGVfb3BlbsQFFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTFBQ5qZF9pcGlwZV9jbG9zZcYFEmpkX251bWZtdF9pc192YWxpZMcFFWpkX251bWZtdF93cml0ZV9mbG9hdMgFE2pkX251bWZtdF93cml0ZV9pMzLJBRJqZF9udW1mbXRfcmVhZF9pMzLKBRRqZF9udW1mbXRfcmVhZF9mbG9hdMsFEWpkX29waXBlX29wZW5fY21kzAUUamRfb3BpcGVfb3Blbl9yZXBvcnTNBRZqZF9vcGlwZV9oYW5kbGVfcGFja2V0zgURamRfb3BpcGVfd3JpdGVfZXjPBRBqZF9vcGlwZV9wcm9jZXNz0AUUamRfb3BpcGVfY2hlY2tfc3BhY2XRBQ5qZF9vcGlwZV93cml0ZdIFDmpkX29waXBlX2Nsb3Nl0wUNamRfcXVldWVfcHVzaNQFDmpkX3F1ZXVlX2Zyb2501QUOamRfcXVldWVfc2hpZnTWBQ5qZF9xdWV1ZV9hbGxvY9cFDWpkX3Jlc3BvbmRfdTjYBQ5qZF9yZXNwb25kX3UxNtkFDmpkX3Jlc3BvbmRfdTMy2gURamRfcmVzcG9uZF9zdHJpbmfbBRdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZNwFC2pkX3NlbmRfcGt03QUdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzeBRdzZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlct8FGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTgBRRqZF9hcHBfaGFuZGxlX3BhY2tldOEFFWpkX2FwcF9oYW5kbGVfY29tbWFuZOIFFWFwcF9nZXRfaW5zdGFuY2VfbmFtZeMFE2pkX2FsbG9jYXRlX3NlcnZpY2XkBRBqZF9zZXJ2aWNlc19pbml05QUOamRfcmVmcmVzaF9ub3fmBRlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk5wUUamRfc2VydmljZXNfYW5ub3VuY2XoBRdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZekFEGpkX3NlcnZpY2VzX3RpY2vqBRVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfrBRpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZewFFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXtBRRhcHBfZ2V0X2RldmljZV9jbGFzc+4FEmFwcF9nZXRfZndfdmVyc2lvbu8FDWpkX3NydmNmZ19ydW7wBRdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZfEFEWpkX3NydmNmZ192YXJpYW508gUNamRfaGFzaF9mbnYxYfMFDGpkX2RldmljZV9pZPQFCWpkX3JhbmRvbfUFCGpkX2NyYzE29gUOamRfY29tcHV0ZV9jcmP3BQ5qZF9zaGlmdF9mcmFtZfgFDGpkX3dvcmRfbW92ZfkFDmpkX3Jlc2V0X2ZyYW1l+gUQamRfcHVzaF9pbl9mcmFtZfsFDWpkX3BhbmljX2NvcmX8BRNqZF9zaG91bGRfc2FtcGxlX21z/QUQamRfc2hvdWxkX3NhbXBsZf4FCWpkX3RvX2hleP8FC2pkX2Zyb21faGV4gAYOamRfYXNzZXJ0X2ZhaWyBBgdqZF9hdG9pggYPamRfdnNwcmludGZfZXh0gwYPamRfcHJpbnRfZG91YmxlhAYLamRfdnNwcmludGaFBgpqZF9zcHJpbnRmhgYSamRfZGV2aWNlX3Nob3J0X2lkhwYMamRfc3ByaW50Zl9hiAYLamRfdG9faGV4X2GJBglqZF9zdHJkdXCKBglqZF9tZW1kdXCLBgxqZF9lbmRzX3dpdGiMBg5qZF9zdGFydHNfd2l0aI0GFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWOBhZkb19wcm9jZXNzX2V2ZW50X3F1ZXVljwYRamRfc2VuZF9ldmVudF9leHSQBgpqZF9yeF9pbml0kQYdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uSBg9qZF9yeF9nZXRfZnJhbWWTBhNqZF9yeF9yZWxlYXNlX2ZyYW1llAYRamRfc2VuZF9mcmFtZV9yYXeVBg1qZF9zZW5kX2ZyYW1llgYKamRfdHhfaW5pdJcGB2pkX3NlbmSYBg9qZF90eF9nZXRfZnJhbWWZBhBqZF90eF9mcmFtZV9zZW50mgYLamRfdHhfZmx1c2ibBhBfX2Vycm5vX2xvY2F0aW9unAYMX19mcGNsYXNzaWZ5nQYFZHVtbXmeBghfX21lbWNweZ8GB21lbW1vdmWgBgZtZW1zZXShBgpfX2xvY2tmaWxlogYMX191bmxvY2tmaWxlowYGZmZsdXNopAYEZm1vZKUGDV9fRE9VQkxFX0JJVFOmBgxfX3N0ZGlvX3NlZWunBg1fX3N0ZGlvX3dyaXRlqAYNX19zdGRpb19jbG9zZakGCF9fdG9yZWFkqgYJX190b3dyaXRlqwYJX19md3JpdGV4rAYGZndyaXRlrQYUX19wdGhyZWFkX211dGV4X2xvY2uuBhZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrrwYGX19sb2NrsAYIX191bmxvY2uxBg5fX21hdGhfZGl2emVyb7IGCmZwX2JhcnJpZXKzBg5fX21hdGhfaW52YWxpZLQGA2xvZ7UGBXRvcDE2tgYFbG9nMTC3BgdfX2xzZWVruAYGbWVtY21wuQYKX19vZmxfbG9ja7oGDF9fb2ZsX3VubG9ja7sGDF9fbWF0aF94Zmxvd7wGDGZwX2JhcnJpZXIuMb0GDF9fbWF0aF9vZmxvd74GDF9fbWF0aF91Zmxvd78GBGZhYnPABgNwb3fBBgV0b3AxMsIGCnplcm9pbmZuYW7DBghjaGVja2ludMQGDGZwX2JhcnJpZXIuMsUGCmxvZ19pbmxpbmXGBgpleHBfaW5saW5lxwYLc3BlY2lhbGNhc2XIBg1mcF9mb3JjZV9ldmFsyQYFcm91bmTKBgZzdHJjaHLLBgtfX3N0cmNocm51bMwGBnN0cmNtcM0GBnN0cmxlbs4GBm1lbWNocs8GBnN0cnN0ctAGDnR3b2J5dGVfc3Ryc3Ry0QYQdGhyZWVieXRlX3N0cnN0ctIGD2ZvdXJieXRlX3N0cnN0ctMGDXR3b3dheV9zdHJzdHLUBgdfX3VmbG931QYHX19zaGxpbdYGCF9fc2hnZXRj1wYHaXNzcGFjZdgGBnNjYWxibtkGCWNvcHlzaWdubNoGB3NjYWxibmzbBg1fX2ZwY2xhc3NpZnls3AYFZm1vZGzdBgVmYWJzbN4GC19fZmxvYXRzY2Fu3wYIaGV4ZmxvYXTgBghkZWNmbG9hdOEGB3NjYW5leHDiBgZzdHJ0b3jjBgZzdHJ0b2TkBhJfX3dhc2lfc3lzY2FsbF9yZXTlBghkbG1hbGxvY+YGBmRsZnJlZecGGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZegGBHNicmvpBghfX2FkZHRmM+oGCV9fYXNobHRpM+sGB19fbGV0ZjLsBgdfX2dldGYy7QYIX19kaXZ0ZjPuBg1fX2V4dGVuZGRmdGYy7wYNX19leHRlbmRzZnRmMvAGC19fZmxvYXRzaXRm8QYNX19mbG9hdHVuc2l0ZvIGDV9fZmVfZ2V0cm91bmTzBhJfX2ZlX3JhaXNlX2luZXhhY3T0BglfX2xzaHJ0aTP1BghfX211bHRmM/YGCF9fbXVsdGkz9wYJX19wb3dpZGYy+AYIX19zdWJ0ZjP5BgxfX3RydW5jdGZkZjL6BgtzZXRUZW1wUmV0MPsGC2dldFRlbXBSZXQw/AYJc3RhY2tTYXZl/QYMc3RhY2tSZXN0b3Jl/gYKc3RhY2tBbGxvY/8GHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSABxVlbXNjcmlwdGVuX3N0YWNrX2luaXSBBxllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlggcZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZYMHGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZIQHDGR5bkNhbGxfamlqaYUHFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammGBxhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGEBwQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
function em_flash_size() { if (Module.flashSize) return Module.flashSize; return 128 * 1024; }
function em_flash_save(start,size) { if (Module.flashSave) Module.flashSave(HEAPU8.slice(start, start + size)); }
function em_flash_load(start,size) { if (Module.flashLoad) { const data = Module.flashLoad(); if (Module.dmesg) Module.dmesg("flash load, size=" + data.length); HEAPU8.set(data.slice(0, size), start); } }
function em_send_frame(frame) { const sz = 12 + HEAPU8[frame + 2]; const pkt = HEAPU8.slice(frame, frame + sz); Module.sendPacket(pkt) }
function _devs_panic_handler(exitcode) { if (exitcode) console.log("PANIC", exitcode); if (Module.panicHandler) Module.panicHandler(exitcode); }
function em_send_large_frame(frame,sz) { const pkt = HEAPU8.slice(frame, frame + sz); Module.sendPacket(pkt) }
function em_deploy_handler(exitcode) { if (Module.deployHandler) Module.deployHandler(exitcode); }
function em_time_now() { return Date.now(); }
function em_jd_crypto_get_random(trg,size) { let buf = new Uint8Array(size); if (typeof window == "object" && window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf); else { buf = require("crypto").randomBytes(size); } HEAPU8.set(buf, trg); }
function em_print_dmesg(ptr) { const s = UTF8ToString(ptr, 1024); if (Module.dmesg) Module.dmesg(s); else console.debug(s); }
function _jd_tcpsock_new(hostname,port) { return Module.sockOpen(hostname, port); }
function _jd_tcpsock_write(buf,size) { return Module.sockWrite(buf, size); }
function _jd_tcpsock_close() { return Module.sockClose(); }
function _jd_tcpsock_is_available() { return Module.sockIsAvailable(); }




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
  "_jd_tcpsock_close": _jd_tcpsock_close,
  "_jd_tcpsock_is_available": _jd_tcpsock_is_available,
  "_jd_tcpsock_new": _jd_tcpsock_new,
  "_jd_tcpsock_write": _jd_tcpsock_write,
  "abort": _abort,
  "em_deploy_handler": em_deploy_handler,
  "em_flash_load": em_flash_load,
  "em_flash_save": em_flash_save,
  "em_flash_size": em_flash_size,
  "em_jd_crypto_get_random": em_jd_crypto_get_random,
  "em_print_dmesg": em_print_dmesg,
  "em_send_frame": em_send_frame,
  "em_send_large_frame": em_send_large_frame,
  "em_time_now": em_time_now,
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap,
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
var _jd_em_tcpsock_on_event = Module["_jd_em_tcpsock_on_event"] = createExportWrapper("jd_em_tcpsock_on_event");

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

var ___start_em_js = Module['___start_em_js'] = 30600;
var ___stop_em_js = Module['___stop_em_js'] = 32085;



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
