
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABq4KAgAAvYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2AFf39/f38AYAV/f39/fwF/YAF8AXxgBX9+fn5+AGAAAX5gBn9/f39/fwBgAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBfmACf3wBfGACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGACfn4Bf2ADf35+AGACf38BfmACf30AYAJ+fgF8YAR/f35/AX5gBH9+f38BfwLog4CAABQDZW52DWVtX2ZsYXNoX3NhdmUAAgNlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawALA+yGgIAA6gYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAOBw4ABwcDBQIHBwMDBwgBAgcHBA8KCwYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMABQAGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAABAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAQAAAAAAAQEAAQABAQAAAQEBAQAAAQUAABIAAAAJAAYAAAABCwAAABIDDw8AAAAAAAAAAAAAAAAAAAAAAAIAAAACAAADAQEBAQEBAQEBAQEBAQEBBgEDAAABAQEBAAoAAgIAAQEBAAEBAAEBAAAAAQAAAQEAAAAAAAACAAUCAgUKAAEAAQEBBAEOBgACAAAABgAACAQDCQoCAgoCAwAFCQMBBQYDBQkFBQYFAQEBAwMGAwMDAwMDBQUFCQsGBQMDAwYDAwMDBQYFBQUFBQUBBgMDEBMCAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAIAHh8DBAMGAgUFBQEBBQUKAQMCAgEACgUFBQEFBQEFBgMDBAQDCxMCAgUQAwMDAwYGAwMDBAQGBgYGAQMAAwMEAgADAAIGAAQEAwYGBQEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEKCwICAAAHCQMGAQIAAAcJCQEDBwECAAACBQAHCQgABAQEAAACBwAUAwcHAQIBABUDCQcAAAQAAgcAAAIHBAcEBAMDAwMGAggGBgYEBwYHAwMGCAAGAAAEIAEDEAMDAAkHAwYEAwQABAMDAwMEBAYGAAAABAQHBwcHBAcHBwgICAcEBAMOCAMABAEACQEDAwEDBQQLIQkJFAMDBAMDAwcHBQcECAAEBAcJCAAHCBYEBgYGBAAEGSIRBgQEBAYJBAQAABcMDAwWDBEGCAcjDBcXDBkWFRUMJCUmJwwDAwMEBgMDAwMDBBQEBBoNGCgNKQUPEioFEAQEAAgEDRgbGw0TKwICCAgYDQ0aDSwACAgABAgHCAgILQsuBIeAgIAAAXABjwKPAgWGgICAAAEBgAKAAgaAgYCAABN/AUGAkwYLfwFBAAt/AUEAC38BQQALfwBB+OsBC38AQefsAQt/AEGx7gELfwBBre8BC38AQanwAQt/AEGV8QELfwBB5fEBC38AQYbyAQt/AEGL9AELfwBBgfUBC38AQdH1AQt/AEGd9gELfwBBxvYBC38AQfjrAQt/AEH19gELB66HgIAAKQZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAUBm1hbGxvYwDcBhZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwQWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMFEF9fZXJybm9fbG9jYXRpb24AkgYZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUA3QYaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKRpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAqCmpkX2VtX2luaXQAKw1qZF9lbV9wcm9jZXNzACwUamRfZW1fZnJhbWVfcmVjZWl2ZWQALRFqZF9lbV9kZXZzX2RlcGxveQAuEWpkX2VtX2RldnNfdmVyaWZ5AC8YamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADAbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADEWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMGHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDBxxfX2VtX2pzX19lbV9zZW5kX2xhcmdlX2ZyYW1lAwgaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDCRRfX2VtX2pzX19lbV90aW1lX25vdwMKIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwsXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDDBZqZF9lbV90Y3Bzb2NrX29uX2V2ZW50AEEYX19lbV9qc19fX2pkX3RjcHNvY2tfbmV3Aw0aX19lbV9qc19fX2pkX3RjcHNvY2tfd3JpdGUDDhpfX2VtX2pzX19famRfdGNwc29ja19jbG9zZQMPIV9fZW1fanNfX19qZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZQMQBmZmbHVzaACaBhVlbXNjcmlwdGVuX3N0YWNrX2luaXQA9wYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQD4BhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAPkGGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZAD6BglzdGFja1NhdmUA8wYMc3RhY2tSZXN0b3Jl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IgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ7AMNACADIAEpAwA3AxgCQAJAIAAgA0EYahCMAyICDQAgAyABKQMANwMQIAAgA0EQahCLAyEBDAELAkAgACACEI0DIgENAEEAIQEMAQsCQCAAIAIQ7QINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABC/AyADQShqIAAgBBCkAyADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQYgtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEFEOgCIAFqIQIMAQsgACACQQBBABDoAiABaiECCyADQcAAaiQAIAIL+AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCDAyIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEOEDIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUErSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEF42AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACADQSBqEOsDDg0BBAsFCQYDBwsICgIACwsgAUEDNgIAIAFBAjoACgwLCyABQQA2AgAgAUECOgAKDAoLIAFBBjoACiABIAIpAwA3AgAMCQsgAUECOgAKIAMgAikDADcDACABQQFBAiAAIAMQ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AwggBCACakEMaiAAIAFBCGoQ4wM6AAAgAkEBaiIFIQIgBSADLwEISQ0ACyAEIQIMAQsgAUEoaiAAQfUIQQAQzwNBACECCyAAIAIQnwMgAUHAAGokAAuKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ5QMNACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDTAwwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ5wNFDQAgACADKAIoEN8DDAELIABCADcDAAsgA0EwaiQAC/0CAgN/AX4jAEHwAGsiASQAIAEgAEHgAGopAwA3A1AgASAAKQNYIgQ3A0AgASAENwNgAkACQCAAIAFBwABqEOUDDQAgASABKQNgNwM4IAFB6ABqIABBEiABQThqENMDQQAhAgwBCyABIAEpA2A3AzAgACABQTBqIAFB3ABqEOcDIQILAkAgAiICRQ0AIAEgASkDUDcDKAJAIAAgAUEoakGWARDxA0UNAAJAIAAgASgCXEEBdBCUASIDRQ0AIANBBmogAiABKAJcEPUFCyAAIAMQnwMMAQsgASABKQNQNwMgAkACQCABQSBqEO0DDQAgASABKQNQNwMYIAAgAUEYakGXARDxAw0AIAEgASkDUDcDECAAIAFBEGpBmAEQ8QNFDQELIAFByABqIAAgAiABKAJcEMIDIAAoAuwBIgBFDQEgACABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahCwAzYCACABQegAaiAAQcobIAEQzwMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1giBjcDGCABIAY3AyACQAJAIAAgAUEYahDmAw0AIAEgASkDIDcDECABQShqIABBhiAgAUEQahDUA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEOcDIQILAkAgAiIDRQ0AIABBABCZAyECIABBARCZAyEEIABBAhCZAyEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQlwYaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNYIgg3AzggASAINwNQAkACQCAAIAFBOGoQ5gMNACABIAEpA1A3AzAgAUHYAGogAEGGICABQTBqENQDQQAhAgwB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IgM3AxggASADNwMIIAFBEGogACABQQhqEMMDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABEM0CIAFBIGokAAsOACAAIABBABCbAxCcAwsPACAAIABBABCbA50QnAMLgAICAn8BfiMAQfAAayIBJAAgASAAQeAAaikDADcDaCABIABB6ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDsA0UNACABIAEpA2g3AxAgASAAIAFBEGoQsAM2AgBBvRogARA6DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEMMDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI0BIAEgASkDYDcDOCAAIAFBOGpBABC+AyECIAEgASkDaDcDMCABIAAgAUEwahCwAzYCJCABIAI2AiBB7xogAUEgahA6IAEgASkDYDcDGCAAIAFBGGoQjgELIAFB8ABqJAALnwECAn8BfiMAQTBrIgEkACABIABB4ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEMMDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEL4DIgJFDQAgAiABQSBqEKoFIgJFDQAgAUEYaiAAQQggACACIAEoAiAQlwEQ4QMgACgC7AEiAEUNACAAIAEpAxg3AyALIAFBMGokAAs7AQF/IwBBEGsiASQAIAFBCGogACkDgAK6EN4DAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBEGokAAuoAQIBfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiAjcDKCABIAI3AxACQAJAAkAgACABQRBqQY8BEPEDRQ0AEOoFIQIMAQsgASABKQMoNwMIIAAgAUEIakGbARDxA0UNARDSAiECCyABQQg2AgAgASACNwMgIAEgAUEgajYCBCABQRhqIABBnyMgARDBAyAAKALsASIARQ0AIAAgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAEJkDIQIgASAAQegAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahCNAiIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABDVAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8Q1QMMAQsgAEGFA2ogAjoAACAA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fyMAQSBrIgEkACABIAApA1g3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqENMDQQAhAgwBCwJAIAAgASgCEBB7IgINACABQRhqIABBoDxBABDRAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABBkj5BABDRAwwBCyACIABB4ABqKQMANwMgIAJBARB2CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNYNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDTA0EAIQAMAQsCQCAAIAEoAhAQeyICDQAgAUEYaiAAQaA8QQAQ0QMLIAIhAAsCQCAAIgBFDQAgABB9CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAuwBIQIgASAAQeAAaikDACIENwMAIAEgBDcDCCAAIAEQrAEhAyAAKALsASADEHcgAiACLQAQQfABcUEEcjoAECABQRBqJAALIQACQCAAKALsASIARQ0AIAAgADUCHEKAgICAEIQ3AyALC2ABAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEHaLEEAENEDDAELIAAgAkF/akEBEHwiAkUNACAAKALsASIARQ0AIAAgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCDAyIEQc+GA0sNACABKADkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB0CUgA0EIahDUAwwBCyAAIAEgASgC2AEgBEH//wNxEPMCIAApAwBCAFINACADQdgAaiABQQggASABQQIQ6QIQjwEQ4QMgACADKQNYIgY3AwAgBlANACADIAApAwA3AzggASADQThqEI0BIANB0ABqQfsAEL8DIANBAzYCTCADIAQ2AkggAyAAKQMANwMwIAMgAykDUDcDKCADIAMpA0g3AyAgASADQTBqIANBKGogA0EgahCUAyABKALYASECIAMgACkDADcDGCABIAIgBEH//wNxIANBGGoQ8QIgAyAAKQMA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DQAgEiEIIAMhASAPIQcgDCECIBYNAwNAIAIhAiAIQX9qIQkgByIHKAIAIQgCQAJAAkAgASIBQQBIIgoNACABIBNKDQAgAkEAOwACIAIgCEHwAXFBBHY6AAEgAiACLQAAQQ9xIAhBBHRyOgAAIAJBBGohCAwBCwJAIAoNACABIABODQAgAiACLQAAQQ9xIAhBBHRyOgAACwJAIAFBf0gNACABQQFqIABODQAgAiACLQABQfABcSAIQfABcUEEdnI6AAELAkAgAUF+SA0AIAFBAmogAE4NACACIAItAAFBD3E6AAELAkAgAUF9SA0AIAFBA2ogAE4NACACIAItAAJB8AFxOgACCwJAIAFBfEgNACABQQRqIABODQAgAiACLQACQQ9xOgACCwJAIAFBe0gNACABQQVqIABODQAgAiACLQADQfABcToAAwsCQCABQXpIDQAgAUEGaiAATg0AIAIgAi0AA0EPcToAAwsgAkEEaiECAkAgAUF5Tg0AIAIhAgwCCyACIQggAiECIAFBB2ogAE4NAQsgCCICIAItAABB8AFxOgAAIAIhAgsgCSEIIAFBCGohASAHQQRqIQcgAiECIAkNAAwECwALIBIhCCADIQEgDyEHIAwhAiAWDQIDQCACIQIgCEF/aiEJIAciBygCACEIAkACQCABIgFBAEgiCg0AIAEgE0oNACACQQA6AAMgAkEAOwABIAIgCDoAAAwBCwJAIAoNACABIABODQAgAiACLQAAQfABcSAIQQ9xcjoAAAsCQCABQX9IDQAgAUEBaiAATg0AIAIgAi0AAEEPcSAIQfABcXI6AAALAkAgAUF+SA0AIAFBAmogAE4NACACIAItAAFB8AFxOgABCwJAIAFBfUgNACABQQNqIABODQAgAiACLQABQQ9xOgABCwJAIAFBfEgNACABQQRqIABODQAgAiACLQACQfABcToAAgsCQCABQXtIDQAgAUEFaiAATg0AIAIgAi0AAkEPcToAAgsCQCABQXpIDQAgAUEGaiAATg0AIAIgAi0AA0HwAXE6AAMLIAFBeUgNACABQQdqIABODQAgAiACLQADQQ9xOgADCyAJIQggAUEIaiEBIAdBBGohByACQQRqIQIgCQ0ADAMLAAsgEiEIIAwhCSAPIQIgAyEHIBIhCiAMIQwgDyEPIAMhCwJAIBVFDQADQCAHIQEgAiEC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IAAgAEEAEJsDIABBARCbAxC3BhCcAwsuAQN/IABBABCZAyEBQQAhAgJAIABBARCZAyIDRQ0AIAEgA20hAgsgACACEJ0DCy4BA38gAEEAEJkDIQFBACECAkAgAEEBEJkDIgNFDQAgASADbyECCyAAIAIQnQMLFgAgACAAQQAQmQMgAEEBEJkDbBCdAwsJACAAQQEQhgILkQMCBH8CfCMAQTBrIgIkACACIABB4ABqKQMANwMoIAIgAEHoAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQ4wMhAyACIAIpAyA3AxAgACACQRBqEOMDIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgBSEFIAAoAuwBIgNFDQAgAyAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEOIDIQYgAiACKQMgNwMAIAAgAhDiAyEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoAuwBIgVFDQAgBUEAKQPghwE3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyABIQECQCAAKALsASIARQ0AIAAgASkDADcDIAsgAkEwaiQACwkAIABBABCGAgudAQIDfwF+IwBBMGsiASQAIAEgAEHgAGopAwA3AyggASAAQegAaikDACIENwMYIAEgBDcDIAJAIAFBGGoQ7AMNACABIAEpAyg3AxAgACABQRBqEIkDIQIgASABKQMgNwMIIAAgAUEIahCMAyIDRQ0AIAJFDQAgACACIAMQ6gILAkAgACgC7AEiAEUNACAAIAEpAyg3AyALIAFBMGokAAsJACAAQQEQigILoQECA38BfiMAQTBrIgIkACACIABB4ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEIwDIgNFDQAgAEEAEJEBIgRFDQAgAkEgaiAAQQggBBDhAyACIAIpAyA3AxAgACACQRBqEI0BIAAgAyAEIAEQ7gIgAiACKQMgNwMIIAAgAkEIahCOASAAKALsASIARQ0AIAAgAikDIDcDIAsgAkEwaiQACwkAIABB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AHIhBAwBC0H//wMhBAtBACEBAkAgBEH//wNxIgVB//8DRg0AIAIhBANAIAMhBgJAIAQiBw0AQQAPCyAHLwEIIgNBAEchAQJAAkACQCADDQAgASEEDAELIAEhCEEAIQlBACEEAkACQCAAKADkASIBIAEoAmBqIAcvAQpBAnRqIgIvAQIgBUYNAANAIARBAWoiASADRg0CIAEhBCACIAFBA3RqLwECIAVHDQALIAEgA0khCCABIQkLIAghBCACIAlBA3RqIQEMAgsgASADSSEECyAGIQELIAEhAQJAAkAgBCICRQ0AIAchBAwBCyAAIAcQ/wIhBAsgBCEEIAEhAyABIQEgAkUNAAsLIAELvgEBA38jAEEgayIBJAAgASAAKQNYNwMQAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiA0UNACADIQIgAygCAEGAgID4AHFBgICA2ABGDQELIAEgASkDEDcDACABQRhqIABBLyABENMDQQAhAgsCQCAAIAIiAhCfAiIDRQ0AIAFBCGogACADIAIoAhwiAkEMaiACLwEEEKcCIAAoAuwBIgBFDQAgACABKQMINwMgCyABQSBqJAAL8AECAn8BfiMAQSBrIgEkACABIAApA1g3AxACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDYAEcNACAAQfgCakEAQfwBEJcGGiAAQYYDakEDOwEAIAIpAwghAyAAQYQDakEEOgAAIABB/AJqIAM3AgAgAEGIA2ogAi8BEDsBACAAQYoDaiACLwEWOwEAIAFBCGogACACLwESEM4CAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBIGokAA8LIAEgASkDEDcDACABQRhqIABBLyABENMDAAuhAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQ+QIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENMDCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAhD7AiICQX9KDQAgAEIANwMADAELIAAgASACEPQCCyADQTBqJAALjwECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxAC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CwsgCyEKIAQgAWohBCADQQRqIQECQAJAAkAgAy8BBEUNACABIQMMAQsgCiEDIAoNACABIQFBACEKQQEhCwwBCyADIQEgCiEKQQAhCwsgBCEDDAELIAMhASAKIQpBASELIAQhAwsgAyEDIAohCiABIQECQCALRQ0AIAMhAwwDCyADIQQgCUEBaiILIQkgCiEKIAEhASADIQMgCyAFRw0ADAILAAsgByEDAkACQCAFDgICAQALIAIgBTYCACACQShqIABB3z8gAhDRAyAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQSGohAwsgAEGEA2ogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahD5AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEHwICABQRBqENQDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEHjICABQQhqENQDQQAhAwsCQCADIgNFDQAgACADEKoCIAAgASgCJCADLwECQf8fcUGAwAByEMsCCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEPkCIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQfAgIANBCGoQ1ANBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahD5AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUHwICADQQhqENQDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ+QIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFB8CAgA0EIahDUA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsg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EPkCLwECQYAgSRshBAwDC0EFIQQMAgtB7MkAQbcCQdYuEPIFAAsgAUECdEH4hwFqKAIAIQQLIAJBEGokACAECxEAIAAoAgRFIAAoAgBBBElxCyQBAX9BACEBAkAgACgCBA0AIAAoAgAiAEUgAEEDRnIhAQsgAQtrAQJ/IwBBEGsiAyQAAkACQCABKAIEDQACQCABKAIADgQAAQEAAQsgAigCBA0AQQEhBCACKAIADgQBAAABAAsgAyABKQMANwMIIAMgAikDADcDACAAIANBCGogAxDvAyEECyADQRBqJAAgBAuGAgICfwJ+IwBBwABrIgMkAAJAAkAgASgCBA0AIAEoAgBBAkcNACACKAIEDQBBACEEIAIoAgBBAkYNAQsgAyACKQMAIgU3AzAgAyABKQMAIgY3AyhBASEBAkAgBiAFUQ0AIAMgAykDKDcDIAJAIAAgA0EgahC7Aw0AQQAhAQwBCyADIAMpAzA3AxhBACEBIAAgA0EYahC7A0UNACADIAMpAyg3AxAgACADQRBqIANBPGoQvgMhAiADIAMpAzA3AwggACADQQhqIANBOGoQvgMhBEEAIQECQCADKAI8IgAgAygCOEcNACACIAQgABCvBkUhAQsgASEBCyABIQQLIANBwABqJAAgBAvAAQECfyMAQTBrIgMkAEEBIQQCQCABKQMAIAIpAwBRDQAgAyABKQMANwMgAkAgACADQSBqELsDDQBBACEEDAELIAMgAikDADcDGEEAIQQgACADQRhqELsDRQ0AIAMgASkDADcDECAAIANBEGogA0EsahC+AyEEIAMgAikDADcDCCAAIANBCGogA0EoahC+AyECQQAhAQJAIAMoAiwiACADKAIoRw0AIAQgAiAAEK8GRSEBCyABIQQLIANBMGokACAEC90BAgJ/An4jAEHAAGsiAyQAIANBIGogAhC/AyADIAMpAyAiBTcDMCADIAEpAwAiBjcDKEEBIQICQCAGIAVRDQAgAyADKQMoNwMYAkAgACADQRhqELsDDQBBACECDAELIAMgAykDMDcDEEEAIQIgACADQRBqELsDRQ0AIAMgAykDKDcDCCAAIANBCGogA0E8ahC+AyEBIAMgAykDMDcDACAAIAMgA0E4ahC+AyEAQQAhAgJAIAMoAjwiBCADKAI4Rw0AIAEgACAEEK8GRSECCyACIQILIANB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IAJB+gAQgAELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCRAwsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIEIAMgAykDIDcDKCACKAJQIQQgAyACKALkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBDzAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgAELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCRAwsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOIEIAMgAykDIDcDKCACKAJQIQQgAyACKALkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBDzAw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgAELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCRAwsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJQIQQgAyACKALkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBDzAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgAELIAJBABDpAiEEIAMgAykDEDcDACAAIAIgBCADEIYDIANBIGokAAuOAQECfyMAQSBrIgMkACACKAJQIQQgAyACKALkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBDzAw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgAELIAJBFRDpAiEEIAMgAykDEDcDACAAIAIgBCADEIYDIANBIGokAAtNAQN/IwBBEGsiAiQAAkAgASABQQIQ6QIQjwEiAw0AIAFBEBBQCyABKALsASEEIAJBCGogAUEIIAMQ4QMgBCACKQMINwMgIAJBEGokAAtTAQN/IwBBEGsiAiQAAkAgASABEOMEIgMQkQEiBA0AIAEgA0EDdEEQahBQCyABKALsASEDIAJBCGogAUEIIAQQ4QMgAyACKQMINwMgIAJBEGokAAtQAQN/IwBBEGsiAiQAAkAgASABEOMEIgMQkwEiBA0AIAEgA0EMahBQCyABKALsASEDIAJBCGogAUEIIAQQ4QMgAyACKQMINwMgIAJBEGokAAs1AQF/AkAgAigCUCIDIAIoAuQBLwEOSQ0AIAAgAkGDARCAAQ8LIAAgAkEIIAIgAxCHAxDhAwtpAQJ/IwBBEGsiAyQAIAIoAlAhBCADIAIoAuQBNgIEAkACQCADQQRqIAQQ8wMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIABCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJQIQQgAyACKALkATYCBAJAAkAgA0EEaiAEQYCAAXIiBBDzAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgAELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAlAhBCADIAIoAuQBNgIEAkACQCADQQRqIARBgIACciIEEPMDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCAAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCUCEEIAMgAigC5AE2AgQCQAJAIANBBGogBEGAgANyIgQQ8wMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIABCyADQRBqJAALOQEBfwJAIAIoAlAiAyACKADkAUEkaigCAEEEdkkNACAAIAJB+AAQgAEPCyAAIAM2AgAgAEEDNgIECwwAIAAgAigCUBDfAwtDAQJ/AkAgAigCUCIDIAIoAOQBIgRBNGooAgBBA3ZPDQAgACAEIAQoAjBqIANBA3RqKQAANwMADwsgACACQfcAEIABC18BA38jAEEQayIDJAAgAhDjBCEEIAIQ4wQhBSADQQhqIAJBAhDlBAJAAkAgAykDCEIAUg0AIABCADcDAAwBCyADIAMpAwg3AwAgACACIAUgBCADQQAQRgsgA0EQaiQACxAAIAAgAigC7AEpAyA3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ4gQgAyADKQMINwMAIAAgAiADEOsDEN8DIANBEGokAAsJACAAQgA3AwALNQEBfyMAQRBrIgMkACADQQhqIAIQ4gQgAEHQhwFB2IcBIAMpAwhQGykDADcDACADQRBqJAALDgAgAEEAKQPQhwE3AwALDgAgAEEAKQPYhwE3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQ4gQgAyADKQMINwMAIAAgAiADEOQDEOADIANBEGokAAsOACAAQQApA+CHATcDAAuqAQIBfwF8IwBBEGsiAyQAIANBCGogAhDiBAJAAkAgAygCDEF/Rg0AIAMgAykDCDcDAAJAIAIgAxDiAyIERAAAAAAAAAAAY0UNACAAIASaEN4DDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA8iHATcDAAwCCyAAQQAgAmsQ3wMMAQsgACADKQMINwMACyADQRBqJAALDwAgACACEOQEQX9zEN8DCzIBAX8jAEEQayIDJAAgA0EIaiACEOIEIAAgAygCDEUgAygCCEECRnEQ4AMgA0EQaiQAC3IBAX8jAEEQayIDJAAgA0EIaiACEOIEAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEOIDmhDeAwwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA8iHATcDAAwBCyAAQQAgAmsQ3wMLIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhDiBCADIAMpAwg3AwAgACACIAMQ5ANBAXMQ4AMgA0EQaiQACwwAIAAgAhDkBBDfAwupAgIFfwF8IwBBwABrIgMkACADQThqIAIQ4gQgAkEYaiIEIAMpAzg3AwAgA0E4aiACEOIEIAIgAykDODcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBCgCACIGQQBIIAUoAgAiByAGaiIGIAdIcw0AIAAgBhDfAwwBCyADIAUpAwA3AzACQAJAIAIgA0EwahC7Aw0AIAMgBCkDADcDKCACIANBKGoQuwNFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahDGAwwBCyADIAUpAwA3AyAgAiACIANBIGoQ4gM5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEOIDIgg5AwAgACAIIAIrAyCgEN4DCyADQcAAaiQAC80BAgV/AXwjAEEgayIDJAAgA0EYaiACEOIEIAJBGGoiBCADKQMYNwMAIANBGGogAhDiBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASiAFKAIAIgcgBmsiBiAHSHMNACAAIAYQ3wMMAQsgAyAFKQMANwMQIAIgAiADQRBqEOIDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDiAyIIOQMAIAAgAisDICAIoRDeAwsgA0EgaiQAC88BAwR/AX4BfCMAQSBrIgMkACADQRhqIAIQ4gQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBTQCACAENAIAfiIHQiCIpyAHpyIGQR91Rw0AIAAgBhDfAwwBCyADIAUpAwA3AxAgAiACIANBEGoQ4gM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOIDIgg5AwAgACAIIAIrAyCiEN4DCyADQSBqJAAL6AECBn8BfCMAQSBrIgMkACADQRhqIAIQ4gQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQACQAJAIAQoAgAiBkEBag4CAAIBCyAFKAIAQYCAgIB4Rg0BCyAFKAIAIgcgBm0iCCAGbCAHRw0AIAAgCBDfAwwBCyADIAUpAwA3AxAgAiACIANBEGoQ4gM5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEOIDIgk5AwAgACACKwMgIAmjEN4DCyADQSBqJAALLAECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCECAAIAQgAygCAHEQ3wMLLAECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCECAAIAQgAygCAHIQ3wMLLAECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCECAAIAQgAygCAHMQ3wMLLAECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCECAAIAQgAygCAHQQ3wMLLAECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCECAAIAQgAygCAHUQ3wMLQQECfyACQRhqIgMgAhDkBDYCACACIAIQ5AQiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQ3gMPCyAAIAIQ3wMLnQEBA38jAEEgayIDJAAgA0EYaiACEOIEIAJBGGoiBCADKQMYNwMAIANBGGogAhDiBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEYhAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEO8DIQILIAAgAhDgAyADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ4gQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIEIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEOIDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDiAyIGOQMAIAIrAyAgBmUhAgwBCyAFKAIAIAQoAgBMIQILIAAgAhDgAyADQSBqJAALvgECA38BfCMAQSBrIgMkACADQRhqIAIQ4gQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOIEIAIgAykDGDcDECACQRBqIQUCQAJAAkAgAigAFEF/Rw0AIAIoABxBf0YNAQsgAyAFKQMANwMQIAIgAiADQRBqEOIDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDiAyIGOQMAIAIrAyAgBmMhAgwBCyAFKAIAIAQoAgBIIQILIAAgAhDgAyADQSBqJAALoAEBA38jAEEgayIDJAAgA0EYaiACEOIEIAJBGGoiBCADKQMYNwMAIANBGGogAhDiBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAUoAgAgBCgCAEchAgwBCyADIAUpAwA3AxAgAyAEKQMANwMIIAIgA0EQaiADQQhqEO8DQQFzIQILIAAgAhDgAyADQSBqJAALPgEBfyMAQRBrIgMkACADQQhqIAIQ4gQgAyADKQMINwMAIABB0IcBQdiHASADEO0DGykDADcDACADQRBqJAAL4gEBBX8jAEEQayICJAAgAkEIaiABEOIEAkACQCABEOQEIgNBAU4NAEEAIQMMAQsCQAJAIAANACAAIQMgAEEARyEEDAELIAAhBSADIQYDQCAGIQAgBSgCCCIDQQBHIQQCQCADDQAgAyEDIAQhBAwCCyADIQUgAEF/aiEGIAMhAyAEIQQgAEEBSg0ACwsgAyEAQQAhAyAERQ0AIAAgASgCUCIDQQN0akEYakEAIAMgACgCEC8BCEkbIQMLAkACQCADIgMNACACIAFB8AAQgAEMAQsgAyACKQMINwMACyACQRBqJAALxAEBBH8CQAJAIAIQ5AQiA0EBTg0AQQAhAwwBCwJAAkAgAQ0AIAEhAyABQQBHIQQMAQsgASEFIAMhBgNAIAYhASAFKAIIIgNBAEchBAJAIAMNACADIQMgBCEEDAILIAMhBSABQX9qIQYgAyEDIAQhBCABQQFKDQALCyADIQFBACEDIARFDQAgASACKAJQIgNBA3RqQRhqQQAgAyABKAIQLwEISRshAwsCQCADIgMNACAAIAJB9AAQgAEPCyAAIAMpAwA3AwALNgEBfwJAIAIoAlAiAyACKADkAUEkaigCAEEEdkkNACAAIAJB9QAQgAEPCyAAIAIgASADEIIDC7oBAQN/IwBBIGsiAyQAIANBEGogAhDiBCADIAMpAxA3AwhBACEEAkAgAiADQQhqEOsDIgVBDUsNACAFQfCSAWotAAAhBAsCQAJAIAQiBA0AIABCADcDAAwBCyACIAQ2AlAgAyACKALkATYCBAJAAkAgA0EEaiAEQYCAAXIiBBDzAw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyAAKQMAQgBSDQAgA0EYaiACQfoAEIABCyADQSBqJAALgwEBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCUCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCAAUEAIQQLAkAgBCIERQ0AIAIgASgC7AEpAyA3AwAgAhDtA0UNACABKALsAUIANwMgIAAgBDsBBAsgAkEQaiQAC6UBAQJ/IwBBMGsiAiQAIAJBKGogARDiBCACQSBqIAEQ4gQgAiACKQMoNwMQAkACQAJAIAEgAkEQahDqAw0AIAIgAikDKDcDCCACQRhqIAFBDyACQQhqENMDDAELIAEtAEINASABQQE6AEMgASgC7AEhAyACIAIpAyg3AwAgA0EAIAEgAhDpAxB0GgsgAkEwaiQADwtBj9sAQfPFAEHsAEHNCBD3BQALWgEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJQIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIABQQAhBAsgACABIAQQyAMgAkEQaiQAC3sBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCUCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCAAUEAIQQLAkAgBCIERQ0AIAAgBDsBBAsCQCAAIAEQyQMNACACQQhqIAFB6gAQgAELIAJBEGokAAshAQF/IwBBEGsiAiQAIAJBCGogAUHrABCAASACQRBqJAALRgEBfyMAQRBrIgIkAAJAAkAgACABEMkDIAAvAQRBf2pHDQAgASgC7AFCADcDIAwBCyACQQhqIAFB7QAQgAELIAJBEGokAAtdAQF/IwBBIGsiAiQAIAJBGGogARDiBCACIAIpAxg3AwgCQAJAIAJBCGoQ7QNFDQAgAkEQaiABQYA9QQAQzwMMAQsgAiACKQMYNwMAIAEgAkEAEMwDCyACQSBqJAALPAEBfyMAQRBrIgIkACACQQhqIAEQ4gQCQCACKQMIUA0AIAIgAikDCDcDACABIAJBARDMAwsgAkEQaiQAC5gBAQR/IwBBEGsiAiQAAkACQCABEOQEIgNBEEkNACACQQhqIAFB7gAQgAEMAQsCQAJAIAAoAhAoAgAgASgCUCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBCGogAUHpABCAAUEAIQULIAUiAEUNACACQQhqIAAgAxDyAyACIAIpAwg3AwAgASACQQEQzAMLIAJBEGokAAsJACABQQcQ/AMLhAIBA38jAEEgayIDJAAgA0EYaiACEOIEIAMgAykDGDcDAAJAAkACQAJAIAIgAyADQRBqIANBDGoQgwMiBEF/Sg0AIAAgAkGdJkEAEM8DDAELAkACQCAEQdCGA0gNACAEQbD5fGoiBEEALwHY6gFODQNBkPwAIARBA3RqLQADQQhxDQEgACACQfccQQAQzwMMAgsgBCACKADkASIFQSRqKAIAQQR2Tg0DIAUgBSgCIGogBEEEdGotAAtBAnENACAAIAJB/xxBABDPAwwBCyAAIAMpAxg3AwALIANBIGokAA8LQeIWQfPFAEHPAkHXDBD3BQALQYflAEHzxQBB1AJB1wwQ9wUAC1YBAn8jAEEgayIDJAAgA0EYaiACEOIEIANBEGogAhDiBCADIAMpAxg3AwggAiADQQhqEI4DIQQgAyADKQMQNwMAIAAgAiADIAQQkAMQ4AMgA0EgaiQACw4AIABBACkD8IcBNwMAC50BAQN/IwBBIGsiAyQAIANBGGogAhDiBCACQRhqIgQgAykDGDcDACADQRhqIAIQ4gQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFKAIAIAQoAgBGIQIMAQsgAyAFKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahDuAyECCyAAIAIQ4AMgA0EgaiQAC6ABAQN/IwBBIGsiAyQAIANBGGogAhDiBCACQRhqIgQgAykDGDcDACADQRhqIAIQ4gQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFKAIAIAQoAgBHIQIMAQsgAyAFKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahDuA0EBcyECCyAAIAIQ4AMgA0EgaiQACywBAX8jAEEQayICJAAgAkEIaiABEOIEIAEoAuwBIAIpAwg3AyAgAkEQaiQACy4BAX8CQCACKAJQIgMgAigC5AEvAQ5JDQAgACACQYABEIABDwsgACACIAMQ9AILPwEBfwJAIAEtAEIiAg0AIAAgAUHsABCAAQ8LIAEgAkF/aiICOgBCIAAgASACQf8BcUEDdGpB2ABqKQMANwMAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCAAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdgAaikDADcDCAsgASABKQMINwMAIAAgARDjAyEAIAFBEGokACAAC2sBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABCAAQwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdgAaikDADcDCAsgASABKQMINwMAIAAgARDjAyEAIAFBEGokACAAC4kCAgJ/AX4jAEHAAGsiAyQAAkACQCABLQBCIgQNACADQThqIAFB7AAQgAEMAQsgASAEQX9qIgQ6AEIgAyABIARB/wFxQQN0akHYAGopAwA3AzgLIAMgAykDODcDKAJAAkAgASADQShqEOUDDQACQCACQQJxRQ0AIAMgAykDODcDICABIANBIGoQuwMNAQsgAyADKQM4NwMYIANBMGogAUESIANBGGoQ0wNCACEFDAELAkAgAkEBcUUNACADIAMpAzg3AxAgASADQRBqEOYDDQAgAyADKQM4NwMIIANBMGogAUGGICADQQhqENQDQgAhBQwBCyADKQM4IQULIAAgBTcDACADQcAAaiQAC6EEAQV/AkAgBEH2/wNPDQAgABDqBEEAQQE6AOD+AUEAIAEpAAA3AOH+AUEAIAFBBWoiBSkAADcA5v4BQQAgBEEIdCAEQYD+A3FBCHZyOwHu/gFBAEEJOgDg/gFB4P4BEOsEAkAgBEUNAEEAIQADQAJAIAQgACIGayIAQRAgAEEQSRsiB0UNACADIAZqIQhBACEAA0AgACIAQeD+AWoiCSAJLQAAIAggAGotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLQeD+ARDrBCAGQRBqIgkhACAJIARJDQALCyACQQAoAuD+ATYAAEEAQQE6AOD+AUEAIAEpAAA3AOH+AUEAIAUpAAA3AOb+AUEAQQA7Ae7+AUHg/gEQ6wRBACEAA0AgAiAAIgBqIgkgCS0AACAAQeD+AWotAABzOgAAIABBAWoiCSEAIAlBBEcNAAsCQCAERQ0AIAFBBWohBUEAIQBBASEJA0BBAEEBOgDg/gFBACABKQAANwDh/gFBACAFKQAANwDm/gFBACAJIgZBCHQgBkGA/gNxQQh2cjsB7v4BQeD+ARDrBAJAIAQgACICayIAQRAgAEEQSRsiB0UNACADIAJqIQhBACEAA0AgCCAAIgBqIgkgCS0AACAAQeD+AWotAABzOgAAIABBAWoiCSEAIAkgB0cNAAsLIAJBEGoiByEAIAZBAWohCSAHIARJDQALCxDsBA8LQYzIAEEyQdoPEPIFAAu/BQEGf0F/IQUCQCAEQfX/A0sNACAAEOoEAkACQCAERQ0AIAFBBWohBkEAIQBBASEHA0BBAEEBOgDg/gFBACABKQAANwDh/gFBACAGKQAANwDm/gFBACAHIghBCHQgCEGA/gNxQQh2cjsB7v4BQeD+ARDrBAJAIAQgACIJayIAQRAgAEEQSRsiBUUNACADIAlqIQpBACEAA0AgCiAAIgBqIgcgBy0AACAAQeD+AWotAABzOgAAIABBAWoiByEAIAcgBUcNAAsLIAlBEGoiBSEAIAhBAWohByAFIARJDQALQQBBAToA4P4BQQAgASkAADcA4f4BQQAgAUEFaikAADcA5v4BQQBBCToA4P4BQQAgBEEIdCAEQYD+A3FBCHZyOwHu/gFB4P4BEOsEIARFDQFBACEAA0ACQCAEIAAiCGsiAEEQIABBEEkbIgVFDQAgAyAIaiEKQQAhAANAIAAiAEHg/gFqIgcgBy0AACAKIABqLQAAczoAACAAQQFqIgchACAHIAVHDQALC0Hg/gEQ6wQgCEEQaiIHIQAgByAESQ0ADAILAAtBAEEBOgDg/gFBACABKQAANwDh/gFBACABQQVqKQAANwDm/gFBAEEJOgDg/gFBACAEQQh0IARBgP4DcUEIdnI7Ae7+AUHg/gEQ6wQLQQAhAANAIAIgACIAaiIHIActAAAgAEHg/gFqLQAAczoAACAAQQFqIgchACAHQQRHDQALQQBBAToA4P4BQQAgASkAADcA4f4BQQAgAUEFaikAADcA5v4BQQBBADsB7v4BQeD+ARDrBEEAIQADQCACIAAiAGoiByAHLQAAIABB4P4Bai0AAHM6AAAgAEEBaiIHIQAgB0EERw0ACxDsBEEAIQBBACEHA0AgACIFQQFqIgohACAHIAIgBWotAABqIgUhByAFIQUgCkEERw0ACwsgBQvdAwEIf0EAIQIDQCAAIAIiA0ECdCICaiABIAJqLQAAOgAAIAAgAkEBciIEaiABIARqLQAAOgAAIAAgAkECciIEaiABIARqLQAAOgAAIAAgAkEDciICaiABIAJqLQAAOgAAIANBAWoiAyECIANBCEcNAAtBCCECA0AgAiIDQQJ0IgEgAGoiAkF/ai0AACEFIAJBfmotAAAhBiACQX1qLQAAIQcgAkF8ai0AACEIAkACQCADQQdxIgRFDQAgBSEJIAYhBSAHIQYgCCEHDAELIAhBgJMBai0AACEJIAVBgJMBai0AACEFIAZBgJMBai0AACEGIANBA3ZBgJUBai0AACAHQYCTAWotAABzIQcLIAchByAGIQYgBSEFIAkhCAJAAkAgBEEERg0AIAghBCAFIQUgBiEGIAchBwwBCyAIQf8BcUGAkwFqLQAAIQQgBUH/AXFBgJMBai0AACEFIAZB/wFxQYCTAWotAAAhBiAHQf8BcUGAkwFqLQAAIQcLIAIgAkFgai0AACAHczoAACAAIAFBAXJqIAJBYWotAAAgBnM6AAAgACABQQJyaiACQWJqLQAAIAVzOgAAIAAgAUEDcmogAkFjai0AACAEczoAACADQQFqIgEhAiABQTxHDQALC8wFAQl/QQAhAgNAIAIiA0ECdCEEQQAhAgNAIAEgBGogAiICaiIFIAUtAAAgACACIARqai0AAHM6AAAgAkEBaiIFIQIgBUEERw0ACyADQQFqIgQhAiAEQQRHDQALQQEhAgNAIAIhBkEAIQIDQCACIQVBACECA0AgASACIgJBAnRqIAVqIgQgBC0AAEGAkwFqLQAAOgAAIAJBAWoiBCECIARBBEcNAAsgBUEBaiIEIQIgBEEERw0ACyABLQABIQIgASABLQAFOgABIAEtAAkhBCABIAEtAA06AAkgASAEOgAFIAEgAjoADSABLQACIQIgASABLQAKOgACIAEgAjoACiABLQAGIQIgASABLQAOOgAGIAEgAjoADiABLQADIQIgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASACOgAHAkAgBkEORg0AQQAhAgNAIAEgAiIHQQJ0aiICIAItAAMiBCACLQAAIgVzIgNBAXQgA8BBB3ZBG3FzIARzIAQgAi0AAiIDcyIIIAItAAEiCSAFcyIKcyIEczoAAyACIAMgCEEBdCAIwEEHdkEbcXNzIARzOgACIAIgCSADIAlzIgNBAXQgA8BBB3ZBG3FzcyAEczoAASACIAUgCkEBdCAKwEEHdkEbcXNzIARzOgAAIAdBAWoiBCECIARBBEcNAAsgBkEEdCEJQQAhAgNAIAIiCEECdCIFIAlqIQNBACECA0AgASAFaiACIgJqIgQgBC0AACAAIAMgAmpqLQAAczoAACACQQFqIgQhAiAEQQRHDQALIAhBAWoiBCECIARBBEcNAAsgBkEBaiECDAELC0EAIQIDQCACIghBAnQiBUHgAWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACwsLAEHw/gEgABDoBAsLAEHw/gEgABDpBAsPAEHw/gFBAEHwARCXBhoLqQEBBX9BlH8hBAJAAkBBACgC4IACDQBBAEEANgHmgAIgABDEBiIEIAMQxAYiBWoiBiACEMQGIgdqIghB9n1qQfB9TQ0BIARB7IACIAAgBBCVBmpBADoAACAEQe2AAmogAyAFEJUGIQQgBkHtgAJqQQA6AAAgBCAFakEBaiACIAcQlQYaIAhB7oACakEAOgAAIAAgARA9IQQLIAQPC0HRxwBBN0HIDBDyBQALCwAgACABQQIQ7wQL6AEBBX8CQCABQYDgA08NAEEIQQYgAUH9AEsbIAFqIgMQHiIEIAJBgAFyOgAAAkACQCABQf4ASQ0AIAQgAToAAyAEQf4AOgABIAQgAUEIdjoAAiAEQQRqIQIMAQsgBCABOgABIARBAmohAgsgBCAELQABQYABcjoAASACIgUQ6wU2AAACQCABRQ0AIAVBBGohBkEAIQIDQCAGIAIiAmogBSACQQNxai0AACAAIAJqLQAAczoAACACQQFqIgchAiAHIAFHDQALCyAEIAMQPiECIAQQHyACDwtB4tkAQdHHAEHEAEG7NhD3BQALugIBAn8jAEHAAGsiAyQAAkACQEEAKALggAIiBEUNACAAIAEgAiAEEQEADAELAkACQAJAAkAgAEF/ag4EAAIDAQQLQQBBAToA5IACIANBNWpBCxAnIANBNWpBCxD/BSEAQeyAAhDEBkHtgAJqIgIQxAYhASADQSRqEOUFNgIAIANBIGogAjYCACADIAA2AhwgA0HsgAI2AhggA0HsgAI2AhQgAyACIAFqQQFqNgIQQf7pACADQRBqEP4FIQIgABAfIAIgAhDEBhA+QX9KDQNBAC0A5IACQf8BcUH/AUYNAyADQawdNgIAQfgaIAMQOkEAQf8BOgDkgAJBA0GsHUEQEPcEED8MAwsgASACEPEEDAILQQIgASACEPcEDAELQQBB/wE6AOSAAhA/QQMgASACEPcECyADQcAAaiQAC7UOAQh/IwBBsAFrIgIkACABIQEgACEAAkACQAJAA0AgACEAIAEhAUEALQDkgAJB/wFGDQECQAJAAkAgAUGOAkEALwHmgAIiA2siBEoNAEECIQMMAQsCQCADQY4CSQ0AIAJBigw2AqABQfgaIAJBoAFqEDpBAEH/AToA5IACQQNBigxBDhD3BBA/QQEhAwwBCyAAIAQQ8QRBACEDIAEgBGshASAAIARqIQAMAQsgASEBIAAhAAsgASIEIQEgACIFIQAgAyIDRQ0ACwJAIANBf2oOAgEAAQtBAC8B5oACQeyAAmogBSAEEJUGGkEAQQAvAeaAAiAEaiIBOwHmgAIgAUH//wNxIgBBjwJPDQIgAEHsgAJqQQA6AAACQEEALQDkgAJBAUcNACABQf//A3FBDEkNAAJAQeyAAkGh2QAQgwZFDQBBAEECOgDkgAJBldkAQQAQOgwBCyACQeyAAjYCkAFBlhsgAkGQAWoQOkEALQDkgAJB/wFGDQAgAkHoMjYCgAFB+BogAkGAAWoQOkEAQf8BOgDkgAJBA0HoMkEQEPcEED8LAkBBAC0A5IACQQJHDQACQAJAQQAvAeaAAiIFDQBBfyEDDAELQX8hAEEAIQECQANAIAAhAAJAIAEiAUHsgAJqLQAAQQpHDQAgASEAAkACQCABQe2AAmotAABBdmoOBAACAgECCyABQQJqIgMhACADIAVNDQNBthxB0ccAQZcBQcYsEPcFAAsgASEAIAFB7oACai0AAEEKRw0AIAFBA2oiAyEAIAMgBU0NAkG2HEHRxwBBlwFBxiwQ9wUACyAAIgMhACABQQFqIgQhASADIQMgBCAFRw0ADAILAAtBACAFIAAiAGsiAzsB5oACQeyAAiAAQeyAAmogA0H//wNxEJYGGkEAQQM6AOSAAiABIQMLIAMhAQJAAkBBAC0A5IACQX5qDgIAAQILAkACQCABQQFqDgIAAwELQQBBADsB5oACDAILIAFBAC8B5oACIgBLDQNBACAAIAFrIgA7AeaAAkHsgAIgAUHsgAJqIABB//8DcRCWBhoMAQsgAkEALwHmgAI2AnBBrsEAIAJB8ABqEDpBAUEAQQAQ9wQLQQAtAOSAAkEDRw0AA0BBACEBAkBBAC8B5oACIgNBAC8B6IACIgBrIgRBAkgNAAJAIABB7YACai0AACIFwCIBQX9KDQBBACEBQQAtAOSAAkH/AUYNASACQZ8SNgJgQfgaIAJB4ABqEDpBAEH/AToA5IACQQNBnxJBERD3BBA/QQAhAQwBCwJAIAFB/wBHDQBBACEBQQAtAOSAAkH/AUYNASACQfXgADYCAEH4GiACEDpBAEH/AToA5IACQQNB9eAAQQsQ9wQQP0EAIQEMAQsgAEHsgAJqIgYsAAAhBwJAAkAgAUH+AEYNACAFIQUgAEECaiEIDAELQQAhASAEQQRIDQECQCAAQe6AAmotAABBCHQgAEHvgAJqLQAAciIBQf0ATQ0AIAEhBSAAQQRqIQgMAQtBACEBQQAtAOSAAkH/AUYNASACQckpNgIQQfgaIAJBEGoQOkEAQf8BOgDkgAJBA0HJKUELEPcEED9BACEBDAELQQAhASAIIgggBSIFaiIJIANKDQACQCAHQf8AcSIBQQhJDQACQCAHQQBIDQBBACEBQQAtAOSAAkH/AUYNAiACQdYoNgIgQfgaIAJBIGoQOkEAQf8BOgDkgAJBA0HWKEEMEPcEED9BACEBDAILAkAgBUH+AEgNAEEAIQFBAC0A5IACQf8BRg0CIAJB4yg2AjBB+BogAkEwahA6QQBB/wE6AOSAAkEDQeMoQQ4Q9wQQP0EAIQEMAgsCQAJAAkACQCABQXhqDgMCAAMBCyAGIAVBChDvBEUNAkH2LBDyBEEAIQEMBAtBySgQ8gRBACEBDAMLQQBBBDoA5IACQf40QQAQOkECIAhB7IACaiAFEPcECyAGIAlB7IACakEALwHmgAIgCWsiARCWBhpBAEEALwHogAIgAWo7AeaAAkEBIQEMAQsCQCAARQ0AIAFFDQBBACEBQQAtAOSAAkH/AUYNASACQZvRADYCQEH4GiACQcAAahA6QQBB/wE6AOSAAkEDQZvRAEEOEPcEED9BACEBDAELAkAgAA0AIAFBAkYNAEEAIQFBAC0A5IACQf8BRg0BIAJBjdQANgJQQfgaIAJB0ABqEDpBAEH/AToA5IACQQNBjdQAQQ0Q9wQQP0EAIQEMAQtBACADIAggAGsiAWs7AeaAAiAGIAhB7IACaiAEIAFrEJYGGkEAQQAvAeiAAiAFaiIBOwHogAICQCAHQX9KDQBBBEHsgAIgAUH//wNxIgEQ9wQgARDzBEEAQQA7AeiAAgtBASEBCyABRQ0BQQAtAOSAAkH/AXFBA0YNAAsLIAJBsAFqJAAPC0G2HEHRxwBBlwFBxiwQ9wUAC0GT1wBB0ccAQbIBQZvNABD3BQALSgEBfyMAQRBrIgEkAAJAQQAtAOSAAkH/AUYNACABIAA2AgBB+BogARA6QQBB/wE6AOSAAkEDIAAgABDEBhD3BBA/CyABQRBqJAALUwEBfwJAAkAgAEUNAEEALwHmgAIiASAASQ0BQQAgASAAayIBOwHmgAJB7IACIABB7IACaiABQf//A3EQlgYaCw8LQbYcQdHHAEGXAUHGLBD3BQALMQEBfwJAQQAtAOSAAiIAQQRGDQAgAEH/AUYNAEEAQQQ6AOSAAhA/QQJBAEEAEPcECwvPAQEFfyMAQRBrIgQkAEEAIQVBACEGA0AgBSADIAYiBmotAABqIgchBSAGQQFqIgghBiAIQSBHDQALAkAgBw0AQeDpAEEAEDpBxcgAQTBBvAwQ8gUAC0EAIAMpAAA3APyCAkEAIANBGGopAAA3AJSDAkEAIANBEGopAAA3AIyDAkEAIANBCGopAAA3AISDAkEAQQE6ALyDAkGcgwJBEBAnIARBnIMCQRAQ/wU2AgAgACABIAJBrRggBBD+BSIFEO0EIQYgBRAfIARBEGokACAGC9oCAQR/IwBBEGsiBCQAAkACQAJAECANAAJAIAANACACRQ0AQX8hBQwDCwJAIABBAEdBAC0AvIMCIgZBAkZxRQ0AQX8hBQwDC0F/IQUgAEUgBkEDRnENAiADIAFqIgZBBGoiBxAeIQUCQCAARQ0AIAUgACABEJUGGgsCQCACRQ0AIAUgAWogAiADEJUGGgtB/IICQZyDAiAFIAZqIAUgBhDmBCAFIAcQ7gQhACAFEB8gAA0BQQwhAgNAAkAgAiIAQZyDAmoiBS0AACICQf8BRg0AIABBnIMCaiACQQFqOgAAQQAhBQwECyAFQQA6AAAgAEF/aiECQQAhBSAADQAMAwsAC0HFyABBpwFBszYQ8gUACyAEQdgcNgIAQYYbIAQQOgJAQQAtALyDAkH/AUcNACAAIQUMAQtBAEH/AToAvIMCQQNB2BxBCRD6BBD0BCAAIQULIARBEGokACAFC+cGAgJ/AX4jAEGQAWsiAyQAAkAQIA0AAkACQAJAAkAgAEF+ag4DAQIAAwsCQAJAAkBBAC0AvIMCQX9qDgMAAQIFCyADIAI2AkBB+eIAIANBwABqEDoCQCACQRdLDQAgA0HfJDYCAEGGGyADEDpBAC0AvIMCQf8BRg0FQQBB/wE6ALyDAkEDQd8kQQsQ+gQQ9AQMBQsgA0H4AGpBEGogAUEQaikAADcDACADQfgAakEIaiABQQhqKQAANwMAIAMgASkAACIFNwN4AkAgBadBytGQ93xGDQAgA0GcwwA2AjBBhhsgA0EwahA6QQAtALyDAkH/AUYNBUEAQf8BOgC8gwJBA0GcwwBBCRD6BBD0BAwFCwJAIAMoAnxBAkYNACADQckmNgIgQYYbIANBIGoQOkEALQC8gwJB/wFGDQVBAEH/AToAvIMCQQNBySZBCxD6BBD0BAwFC0EAQQBB/IICQSBBnIMCQRAgA0GAAWpBEEH8ggIQuQNBAEIANwCcgwJBAEIANwCsgwJBAEIANwCkgwJBAEIANwC0gwJBAEECOgC8gwJBAEEBOgCcgwJBAEECOgCsgwICQEEAQSBBAEEAEPYERQ0AIANBxyo2AhBBhhsgA0EQahA6QQAtALyDAkH/AUYNBUEAQf8BOgC8gwJBA0HHKkEPEPoEEPQEDAULQbcqQQAQOgwECyADIAI2AnBBmOMAIANB8ABqEDoCQCACQSNLDQAgA0HvDjYCUEGGGyADQdAAahA6QQAtALyDAkH/AUYNBEEAQf8BOgC8gwJBA0HvDkEOEPoEEPQEDAQLIAEgAhD4BA0DQQAhAAJAAkAgAS0AAA0AQQAhAgNAIAIiBEEBaiIAQSBGDQIgACECIAEgAGotAABFDQALIARBHkshAAsgACEAIANBgNoANgJgQYYbIANB4ABqEDoCQEEALQC8gwJB/wFGDQBBAEH/AToAvIMCQQNBgNoAQQoQ+gQQ9AQLIABFDQQLQQBBAzoAvIMCQQFBAEEAEPoEDAMLIAEgAhD4BA0CQQQgASACQXxqEPoEDAILAkBBAC0AvIMCQf8BRg0AQQBBBDoAvIMCC0ECIAEgAhD6BAwBC0EAQf8BOgC8gwIQ9ARBAyABIAIQ+gQLIANBkAFqJAAPC0HFyABBwAFBiREQ8gUAC/8BAQN/IwBBIGsiAiQAAkACQAJAIAFBBEsNACACQdAsNgIAQYYbIAIQOkHQLCEBQQAtALyDAkH/AUcNAUF/IQEMAgtB/IICQayDAiAAIAFBfGoiAWogACABEOcEIQNBDCEAAkADQAJAIAAiAUGsgwJqIgAtAAAiBEH/AUYNACABQayDAmogBEEBajoAAAwCCyAAQQA6AAAgAUF/aiEAIAENAAsLAkAgAw0AQQAhAQwCCyACQaIdNgIQQYYbIAJBEGoQOkGiHSEBQQAtALyDAkH/AUcNAEF/IQEMAQtBAEH/AToAvIMCQQMgAUEJEPoEEPQEQX8hAQsgAkEgaiQAIAELNgEBfwJAECANAAJAQQAtALyDAiIAQQRGDQAgAEH/AUYNABD0BAsPC0HFyABB2gFBvjIQ8gUAC4QJAQR/IwBBgAJrIgMkAEEAKALAgwIhBAJAAkACQAJAAkAgAEF/ag4EAAIDAQQLIAMgBCgCODYCEEG0GSADQRBqEDogBEGAAjsBECAEQQAoApz3ASIAQYCAgAhqNgI0IAQgAEGAgIAQajYCKCAELwEGQQFGDQMgA0G91wA2AgQgA0EBNgIAQbbjACADEDogBEEBOwEGIARBAyAEQQZqQQIQhgYMAwsgBEEAKAKc9wEiAEGAgIAIajYCNCAEIABBgICAEGo2AigCQCACRQ0AIAMgAS0AACIAOgD/ASACQX9qIQUgAUEBaiEGAkACQAJAAkACQAJAAkACQAJAIABB8H5qDgoCAwwEBQYHAQgACAsgAS0AA0EMaiIEIAVLDQggBiAEEIEGIgQQiwYaIAQQHwwLCyAFRQ0HIAEtAAEgAUECaiACQX5qEFUMCgsgBC8BECECIAQgAS0AAkEIdCABLQABIgByOwEQAkAgAEEBcUUNACAEKAJkDQAgBEGAEBDNBTYCZAsCQCAELQAQQQJxRQ0AIAJBAnENACAEEK0FNgIYCyAEQQAoApz3AUGAgIAIajYCFCADIAQvARA2AmBBrwsgA0HgAGoQOgwJCyADIAA6ANABIAQvAQZBAUcNCAJAIABB5QBqQf8BcUH9AUsNACADIAA2AnBBnwogA0HwAGoQOgsgA0HQAWpBAUEAQQAQ9gQNCCAEKAIMIgBFDQggBEEAKAK4jAIgAGo2AjAMCAsgA0HQAWoQaxpBACgCwIMCIgQvAQZBAUcNBwJAIAMtAP8BIgBB5QBqQf8BcUH9AUsNACADIAA2AoABQZ8KIANBgAFqEDoLIANB/wFqQQEgA0HQAWpBIBD2BA0HIAQoAgwiAEUNByAEQQAoAriMAiAAajYCMAwHCyAAIAEgBiAFEJYGKAIAEGkQ+wQMBgsgACABIAYgBRCWBiAFEGoQ+wQMBQtBlgFBAEEAEGoQ+wQMBAsgAyAANgJQQYcLIANB0ABqEDogA0H/AToA0AFBACgCwIMCIgQvAQZBAUcNAyADQf8BNgJAQZ8KIANBwABqEDogA0HQAWpBAUEAQQAQ9gQNAyAEKAIMIgBFDQMgBEEAKAK4jAIgAGo2AjAMAwsgAyACNgIwQcPBACADQTBqEDogA0H/AToA0AFBACgCwIMCIgQvAQZBAUcNAiADQf8BNgIgQZ8KIANBIGoQOiADQdABakEBQQBBABD2BA0CIAQoAgwiAEUNAiAEQQAoAriMAiAAajYCMAwCCwJAIAQoAjgiAEUNACADIAA2AqABQbc8IANBoAFqEDoLIAQgBEERai0AAEEIdDsBECAELwEGQQJGDQEgA0G61wA2ApQBIANBAjYCkAFBtuMAIANBkAFqEDogBEECOwEGIARBAyAEQQZqQQIQhgYMAQsgAyABIAIQ3gI2AsABQboYIANBwAFqEDogBC8BBkECRg0AIANButcANgK0ASADQQI2ArABQbbjACADQbABahA6IARBAjsBBiAEQQMgBEEGakECEIYGCyADQYACaiQAC+sBAQF/IwBBMGsiAiQAAkACQCABDQAgAiAAOgAuQQAoAsCDAiIBLwEGQQFHDQECQCAAQeUAakH/AXFB/QFLDQAgAiAAQf8BcTYCAEGfCiACEDoLIAJBLmpBAUEAQQAQ9gQNASABKAIMIgBFDQEgAUEAKAK4jAIgAGo2AjAMAQsgAiAANgIgQYcKIAJBIGoQOiACQf8BOgAvQQAoAsCDAiIALwEGQQFHDQAgAkH/ATYCEEGfCiACQRBqEDogAkEvakEBQQBBABD2BA0AIAAoAgwiAUUNACAAQQAoAriMAiABajYCMAsgAkEwaiQAC8gFAQd/IwBBEGsiASQAAkACQCAAKAIMRQ0AQQAoAriMAiAAKAIwa0EATg0BCwJAIABBFGpBgICACBD0BUUNACAALQAQRQ0AQdE8QQAQOiAAIABBEWotAABBCHQ7ARALAkAgAC0AEEECcUUNAEEAKAL0gwIgACgCHEYNACABIAAoAhg2AggCQCAAKAIgDQAgAEGAAhAeNgIgCyAAKAIgQYACIAFBCGoQrgUhAkEAKAL0gwIhAyACRQ0AIAEoAgghBCAAKAIgIQUgAUGaAToADUGcfyEGAkBBACgCwIMCIgcvAQZBAUcNACABQQ1qQQEgBSACEPYEIgIhBiACDQACQCAHKAIMIgINAEEAIQYMAQsgB0EAKAK4jAIgAmo2AjBBACEGCyAGDQAgACABKAIINgIYIAMgBEcNACAAQQAoAvSDAjYCHAsCQCAAKAJkRQ0AIAAoAmQQywUiAkUNACACIQIDQCACIQICQCAALQAQQQFxRQ0AIAItAAIhAyABQZkBOgAOQZx/IQYCQEEAKALAgwIiBS8BBkEBRw0AIAFBDmpBASACIANBDGoQ9gQiAiEGIAINAAJAIAUoAgwiAg0AQQAhBgwBCyAFQQAoAriMAiACajYCMEEAIQYLIAYNAgsgACgCZBDMBSAAKAJkEMsFIgYhAiAGDQALCwJAIABBNGpBgICAAhD0BUUNACABQZIBOgAPQQAoAsCDAiICLwEGQQFHDQAgAUGSATYCAEGfCiABEDogAUEPakEBQQBBABD2BA0AIAIoAgwiBkUNACACQQAoAriMAiAGajYCMAsCQCAAQSRqQYCAIBD0BUUNAEGbBCECAkAQQEUNACAALwEGQQJ0QZCVAWooAgAhAgsgAhAcCwJAIABBKGpBgIAgEPQFRQ0AIAAQ/QQLIABBLGogACgCCBDzBRogAUEQaiQADwtBixNBABA6EDMAC7YCAQV/IwBBMGsiASQAIABBBmohAgJAAkACQCAALwEGQX5qDgMCAAEACyABQePVADYCJCABQQQ2AiBBtuMAIAFBIGoQOiAAQQQ7AQYgAEEDIAJBAhCGBgsQ+QQLAkAgACgCOEUNABBARQ0AIAAtAGIhAyAAKAI4IQQgAC8BYCEFIAEgACgCPDYCHCABIAU2AhggASAENgIUIAFBhRZB0RUgAxs2AhBB0hggAUEQahA6IAAoAjhBACAALwFgIgNrIAMgAC0AYhsgACgCPCAAQcAAahD1BA0AAkAgAi8BAEEDRg0AIAFB5tUANgIEIAFBAzYCAEG24wAgARA6IABBAzsBBiAAQQMgAkECEIYGCyAAQQAoApz3ASICQYCAgAhqNgI0IAAgAkGAgIAQajYCKAsgAUEwaiQAC/sCAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0H/fmoOBgIDBwcHAQALIANBgF1qDgQDBQYEBgsgACABQRBqIAEtAAxBARD/BAwGCyAAEP0EDAULAkACQCAALwEGQX5qDgMGAAEACyACQePVADYCBCACQQQ2AgBBtuMAIAIQOiAAQQQ7AQYgAEEDIABBBmpBAhCGBgsQ+QQMBAsgASAAKAI4ENEFGgwDCyABQfrUABDRBRoMAgsCQAJAIAAoAjwiAA0AQQAhAAwBCyAAQQZBACAAQcfgABCDBhtqIQALIAEgABDRBRoMAQsgACABQaSVARDUBUF+cUGAAUcNAAJAIAAoAghB5wdLDQAgAEHoBzYCCAsCQCAAKAIIQYG4mSlJDQAgAEGAuJkpNgIICyAAKAIMIgFFDQACQCABIAAoAghBA2wiA08NACAAIAM2AgwLIAAoAgwiAUUNACAAQQAoAriMAiABajYCMAsgAkEQaiQAC/MEAQl/IwBBMGsiBCQAAkACQCACDQBB0S1BABA6IAAoAjgQHyAAKAI8EB8gAEIANwI4IABB0AA7AWAgAEHAAGpCADcCACAAQcgAakIANwIAIABB0ABqQgA3AgAgAEHYAGpCADcCAAJAIANFDQBBqRxBABCuAxoLIAAQ/QQMAQsCQAJAIAJBAWoQHiABIAIQlQYiBRDEBkHGAEkNAAJAAkAgBUHU4AAQgwYiBkUNAEG7AyEHQQYhCAwBCyAFQc7gABCDBkUNAUHQACEHQQUhCAsgByEJIAUgCGoiCEHAABDBBiEHIAhBOhDBBiEKIAdBOhDBBiELIAdBLxDBBiEMIAdFDQAgDEUNAAJAIAtFDQAgByALTw0BIAsgDE8NAQsCQAJAQQAgCiAKIAdLGyIKDQAgCCEIDAELIAhB8dcAEIMGRQ0BIApBAWohCAsgByAIIghrQcAARw0AIAdBADoAACAEQRBqIAgQ9gVBIEcNACAJIQgCQCALRQ0AIAtBADoAACALQQFqEPgFIgshCCALQYCAfGpBgoB8SQ0BCyAMQQA6AAAgB0EBahCABiEHIAxBLzoAACAMEIAGIQsgABCABSAAIAs2AjwgACAHNgI4IAAgBiAHQfwMEIIGIgtyOgBiIABBuwMgCCIHIAdB0ABGGyAHIAsbOwFgIAAgBCkDEDcCQCAAQcgAaiAEKQMYNwIAIABB0ABqIARBIGopAwA3AgAgAEHYAGogBEEoaikDADcCAAJAIANFDQBBqRwgBSABIAIQlQYQrgMaCyAAEP0EDAELIAQgATYCAEGjGyAEEDpBABAfQQAQHwsgBRAfCyAEQTBqJAALSwAgACgCOBAfIAAoAjwQHyAAQgA3AjggAEHQADsBYCAAQcAAakIANwIAIABByABqQgA3AgAgAEHQAGpCADcCACAAQdgAakIANwIAC0MBAn9BsJUBENoFIgBBiCc2AgggAEECOwEGAkBBqRwQrQMiAUUNACAAIAEgARDEBkEAEP8EIAEQHwtBACAANgLAgwILpAEBBH8jAEEQayIEJAAgARDEBiIFQQNqIgYQHiIHIAA6AAEgB0GYAToAACAHQQJqIAEgBRCVBhpBnH8hAQJAQQAoAsCDAiIALwEGQQFHDQAgBEGYATYCAEGfCiAEEDogByAGIAIgAxD2BCIFIQEgBQ0AAkAgACgCDCIBDQBBACEBDAELIABBACgCuIwCIAFqNgIwQQAhAQsgBxAfIARBEGokACABCw8AQQAoAsCDAi8BBkEBRguVAgEIfyMAQRBrIgEkAAJAQQAoAsCDAiICRQ0AIAJBEWotAABBAXFFDQAgAi8BBkEBRw0AIAEQrQU2AggCQCACKAIgDQAgAkGAAhAeNgIgCwNAIAIoAiBBgAIgAUEIahCuBSEDQQAoAvSDAiEEQQIhBQJAIANFDQAgASgCCCEGIAIoAiAhByABQZsBOgAPQZx/IQUCQEEAKALAgwIiCC8BBkEBRw0AIAFBmwE2AgBBnwogARA6IAFBD2pBASAHIAMQ9gQiAyEFIAMNAAJAIAgoAgwiBQ0AQQAhBQwBCyAIQQAoAriMAiAFajYCMEEAIQULQQIgBCAGRkEBdCAFGyEFCyAFRQ0AC0GmPkEAEDoLIAFBEGokAAtQAQJ/IwBBEGsiASQAQQAhAgJAIAAvAQ5BgSNHDQAgAUEAKALAgwIoAjg2AgAgAEHx6AAgARD+BSICENEFGiACEB9BASECCyABQRBqJAAgAgsNACAAKAIEEMQGQQ1qC2sCA38BfiAAKAIEEMQGQQ1qEB4hAQJAIAAoAhAiAkUNACACQQAgAi0ABCIDa0EMbGpBZGopAwAhBCABIAM6AAwgASAENwMACyABIAAoAgg2AgggACgCBCEAIAFBDWogACAAEMQGEJUGGiABC4MDAgZ/AX4CQAJAIAAoAqACIgFFDQAgAEEYaiECIAEhAQNAAkAgAiABIgMoAgQQxAZBDWoiBBDHBSIBRQ0AIAFBAUYNAiAAQQA2AqACIAIQyQUaDAILIAMoAgQQxAZBDWoQHiEBAkAgAygCECIFRQ0AIAVBACAFLQAEIgZrQQxsakFkaikDACEHIAEgBjoADCABIAc3AwALIAEgAygCCDYCCCADKAIEIQUgAUENaiAFIAUQxAYQlQYaIAIgASAEEMgFDQIgARAfIAMoAgAiASEDIAEhBQJAIAFFDQADQAJAIAMiAS0ADEEBcQ0AIAEhBQwCCyABKAIAIgEhAyABIQUgAQ0ACwsgACAFIgE2AqACAkAgAQ0AIAIQyQUaCyAAKAKgAiIDIQEgAw0ACwsCQCAAQRBqQaDoOxD0BUUNACAAEIkFCwJAIABBFGpB0IYDEPQFRQ0AIAAtAAhFDQAgAEEAOgAIIABBA0EAQQAQhgYLDwtBhtsAQfDGAEG2AUGbFhD3BQALmwcCCX8BfiMAQTBrIgEkAAJAAkAgAC0ABkUNAAJAAkAgAC0ACQ0AIABBAToACSAAKAIMIgJFDQEgAiECA0ACQCACIgIoAhANAEIAIQoCQAJAAkAgAi0ADQ4DAwEAAgsgACkDqAIhCgwBCxDqBSEKCyAKIgpQDQAgChCVBSIDRQ0AIAMtABBFDQBBACEEIAItAA4hBQNAIAUhBQJAAkAgAyAEIgZBDGxqIgRBJGoiBygCACACKAIIRg0AQQQhBCAFIQUMAQsgBUF/aiEIAkACQCAFRQ0AQQAhBAwBCwJAIARBKWoiBS0AAEEBcQ0AIAIoAhAiCSAHRg0AAkAgCUUNACAJIAktAAVB/gFxOgAFCyAFIAUtAABBAXI6AAAgAUEraiAHQQAgBEEoaiIFLQAAa0EMbGpBZGopAwAQ/QUgAigCBCEEIAEgBS0AADYCGCABIAQ2AhAgASABQStqNgIUQZU/IAFBEGoQOiACIAc2AhAgAEEBOgAIIAIQlAULQQIhBAsgCCEFCyAFIQUCQCAEDgUAAgICAAILIAZBAWoiBiEEIAUhBSAGIAMtABBJDQALCyACKAIAIgUhAiAFDQAMAgsAC0HVPUHwxgBB7gBBizkQ9wUACwJAIAAoAgwiAkUNACACIQIDQAJAIAIiBigCEA0AAkAgBi0ADUUNACAALQAKDQELQdCDAiECAkADQAJAIAIoAgAiAg0AQQwhAwwCC0EBIQUCQAJAIAItABBBAUsNAEEPIQMMAQsDQAJAAkAgAiAFIgRBDGxqIgdBJGoiCCgCACAGKAIIRg0AQQEhBUEAIQMMAQtBASEFQQAhAyAHQSlqIgktAABBAXENAAJAAkAgBigCECIFIAhHDQBBACEFDAELAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAJIAktAABBAXI6AAAgAUEraiAIQQAgB0EoaiIFLQAAa0EMbGpBZGopAwAQ/QUgBigCBCEDIAEgBS0AADYCCCABIAM2AgAgASABQStqNgIEQZU/IAEQOiAGIAg2AhAgAEEBOgAIIAYQlAVBACEFC0ESIQMLIAMhAyAFRQ0BIARBAWoiAyEFIAMgAi0AEEkNAAtBDyEDCyACIQIgAyIFIQMgBUEPRg0ACwsgA0F0ag4HAAICAgICAAILIAYoAgAiBSECIAUNAAsLIAAtAAlFDQEgAEEAOgAJCyABQTBqJAAPC0HWPUHwxgBBhAFBizkQ9wUAC9kFAgZ/AX4jAEHAAGsiAiQAAkAgAC0ACQ0AAkACQAJAAkACQCABLwEOQf9+ag4EAQMCAAMLIAAoAgwiA0UNAyADIQMDQAJAIAMiAygCECIERQ0AIAQgBC0ABUH+AXE6AAUgAiADKAIENgIAQakaIAIQOiADQQA2AhAgAEEBOgAIIAMQlAULIAMoAgAiBCEDIAQNAAwECwALAkACQCAAKAIMIgMNACADIQUMAQsgAUEZaiEGIAEtAAxBcGohByADIQQDQAJAIAQiAygCBCIEIAYgBxCvBg0AIAQgB2otAAANACADIQUMAgsgAygCACIDIQQgAyEFIAMNAAsLIAUiA0UNAgJAIAEpAxAiCEIAUg0AIAMoAhAiBEUNAyAEIAQtAAVB/gFxOgAFIAIgAygCBDYCEEGpGiACQRBqEDogA0EANgIQIABBAToACCADEJQFDAMLAkACQCAIEJUFIgcNAEEAIQQMAQtBACEEIActABAgAS0AGCIFTQ0AIAcgBUEMbGpBJGohBAsgBCIERQ0CIAMoAhAiByAERg0CAkAgB0UNACAHIActAAVB/gFxOgAFCyAEIAQtAAVBAXI6AAUgAkE7aiAEQQAgBC0ABGtBDGxqQWRqKQMAEP0FIAMoAgQhByACIAQtAAQ2AiggAiAHNgIgIAIgAkE7ajYCJEGVPyACQSBqEDogAyAENgIQIABBAToACCADEJQFDAILIABBGGoiBSABEMIFDQECQAJAIAAoAgwiAw0AIAMhBwwBCyADIQQDQAJAIAQiAy0ADEEBcQ0AIAMhBwwCCyADKAIAIgMhBCADIQcgAw0ACwsgACAHIgM2AqACIAMNASAFEMkFGgwBCyAAQQE6AAcgAEEMaiEEAkADQCAEKAIAIgNFDQEgAyEEIAMoAhANAAsgAEEAOgAHCyAAIAFB1JUBENQFGgsgAkHAAGokAA8LQdU9QfDGAEHcAUHYExD3BQALLAEBf0EAQeCVARDaBSIANgLEgwIgAEEBOgAGIABBACgCnPcBQaDoO2o2AhAL2QEBBH8jAEEQayIBJAACQAJAQQAoAsSDAiICLQAJDQAgAkEBOgAJAkAgAigCDCIDRQ0AIAMhAwNAAkAgAyIEKAIQIgNFDQAgA0EAIAMtAARrQQxsakFcaiAARw0AIAMgAy0ABUH+AXE6AAUgASAEKAIENgIAQakaIAEQOiAEQQA2AhAgAkEBOgAIIAQQlAULIAQoAgAiBCEDIAQNAAsLIAItAAlFDQEgAkEAOgAJIAFBEGokAA8LQdU9QfDGAEGFAkH2OhD3BQALQdY9QfDGAEGLAkH2OhD3BQALLwEBfwJAQQAoAsSDAiICDQBB8MYAQZkCQfMVEPIFAAsgAiAAOgAKIAIgATcDqAILvwMBBn8CQAJAAkACQAJAQQAoAsSDAiICRQ0AIAAQxAYhAwJAAkAgAigCDCIEDQAgBCEFDAELIAQhBgNAAkAgBiIEKAIEIgYgACADEK8GDQAgBiADai0AAA0AIAQhBQwCCyAEKAIAIgQhBiAEIQUgBA0ACwsgBQ0BIAItAAkNAgJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahDJBRoLIAJBDGohBEEUEB4iByABNgIIIAcgADYCBAJAIABB2wAQwQYiBkUNAEECIQMCQAJAIAZBAWoiAUHs1wAQgwYNAEEBIQMgASEFIAFB59cAEIMGRQ0BCyAHIAM6AA0gBkEFaiEFCyAFIQYgBy0ADUUNACAHIAYQ+AU6AA4LIAQoAgAiBkUNAyAAIAYoAgQQwwZBAEgNAyAGIQYDQAJAIAYiAygCACIEDQAgBCEFIAMhAwwGCyAEIQYgBCEFIAMhAyAAIAQoAgQQwwZBf0oNAAwFCwALQfDGAEGhAkHWwgAQ8gUAC0HwxgBBpAJB1sIAEPIFAAtB1T1B8MYAQY8CQdcOEPcFAAsgBiEFIAQhAwsgByAFNgIAIAMgBzYCACACQQE6AAggBwvVAgEEfyMAQRBrIgAkAAJAAkACQEEAKALEgwIiAS0ACQ0AAkAgASgCoAJFDQAgAUEANgKgAiABQRhqEMkFGgsgAS0ACQ0BIAFBAToACQJAIAEoAgwiAkUNACACIQIDQAJAIAIiAigCECIDRQ0AIAMgAy0ABUH+AXE6AAUgACACKAIENgIAQakaIAAQOiACQQA2AhAgAUEBOgAIIAIQlAULIAIoAgAiAyECIAMNAAsLIAEtAAlFDQIgAUEAOgAJAkAgASgCDCICRQ0AIAIhAgNAAkAgAiICKAIQIgNFDQAgAyADLQAFQf4BcToABQsgASACKAIANgIMIAJBADYCBCACEB8gASgCDCIDIQIgAw0ACwsgAUEBOgAIIABBEGokAA8LQdU9QfDGAEGPAkHXDhD3BQALQdU9QfDGAEHsAkGMKRD3BQALQdY9QfDGAEHvAkGMKRD3BQALDABBACgCxIMCEIkFC9ABAQJ/IwBBwABrIgMkAAJAAkACQAJAAkAgAEF/ag4gAAECBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAMECyADIAFBFGo2AhBBjRwgA0EQahA6DAMLIAMgAUEUajYCIEH4GyADQSBqEDoMAgsgAyABQRRqNgIwQd4aIANBMGoQOgwBCyABLQAEIQAgAi8BBCEEIAMgAi0ABzYCDCADIAQ2AgggAyAANgIEIAMgAUEAIABrQQxsakFwajYCAEH+zgAgAxA6CyADQcAAaiQACzEBAn9BDBAeIQJBACgCyIMCIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgLIgwILlQEBAn8CQAJAQQAtAMyDAkUNAEEAQQA6AMyDAiAAIAEgAhCRBQJAQQAoAsiDAiIDRQ0AIAMhAwNAIAMiAygCCCAAIAEgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAMyDAg0BQQBBAToAzIMCDwtBrtkAQe/IAEHjAEHjEBD3BQALQaPbAEHvyABB6QBB4xAQ9wUAC5wBAQN/AkACQEEALQDMgwINAEEAQQE6AMyDAiAAKAIQIQFBAEEAOgDMgwICQEEAKALIgwIiAkUNACACIQIDQCACIgIoAghBwAAgASAAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0AzIMCDQFBAEEAOgDMgwIPC0Gj2wBB78gAQe0AQf09EPcFAAtBo9sAQe/IAEHpAEHjEBD3BQALMAEDf0HQgwIhAQNAAkAgASgCACICDQBBAA8LIAIhASACIQMgAikDCCAAUg0ACyADC1kBBH8CQCAALQAQIgINAEEADwsgAEEkaiEDQQAhBANAAkAgAyAEIgRBDGxqKAIAIAFHDQAgACAEQQxsakEkakEAIAAbDwsgBEEBaiIFIQQgBSACRw0AC0EAC2ICAn8BfiADQRBqEB4iBEEBOgADIABBACAALQAEIgVrQQxsakFkaikDACEGIAQgATsBDiAEIAU6AA0gBCAGNwIEIAQgAzoADCAEQRBqIAIgAxCVBhogBBDTBSEDIAQQHyADC94CAQJ/AkACQAJAQQAtAMyDAg0AQQBBAToAzIMCAkBB1IMCQeCnEhD0BUUNAAJAQQAoAtCDAiIARQ0AIAAhAANAQQAoApz3ASAAIgAoAhxrQQBIDQFBACAAKAIANgLQgwIgABCZBUEAKALQgwIiASEAIAENAAsLQQAoAtCDAiIARQ0AIAAhAANAIAAiASgCACIARQ0BAkBBACgCnPcBIAAoAhxrQQBIDQAgASAAKAIANgIAIAAQmQULIAEoAgAiASEAIAENAAsLQQAtAMyDAkUNAUEAQQA6AMyDAgJAQQAoAsiDAiIARQ0AIAAhAANAIAAiACgCCEEwQQBBACAAKAIEEQUAIAAoAgAiASEAIAENAAsLQQAtAMyDAg0CQQBBADoAzIMCDwtBo9sAQe/IAEGUAkGJFhD3BQALQa7ZAEHvyABB4wBB4xAQ9wUAC0Gj2wBB78gAQekAQeMQEPcFAAufAgEDfyMAQRBrIgEkAAJAAkACQEEALQDMgwJFDQBBAEEAOgDMgwIgABCMBUEALQDMgwINASABIABBFGo2AgBBAEEAOgDMgwJB+BsgARA6AkBBACgCyIMCIgJFDQAgAiECA0AgAiICKAIIQQIgAEEAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0AzIMCDQJBAEEBOgDMgwICQCAAKAIEIgJFDQAgAiECA0AgACACIgIoAgAiAzYCBAJAIAItAAdBBUkNACACKAIMEB8LIAIQHyADIQIgAw0ACwsgABAfIAFBEGokAA8LQa7ZAEHvyABBsAFBkjcQ9wUAC0Gj2wBB78gAQbIBQZI3EPcFAAtBo9sAQe/IAEHpAEHjEBD3BQALnw4CCn8BfiMAQRBrIgEkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBAC0AzIMCDQBBAEEBOgDMgwICQCAALQADIgJBBHFFDQBBAEEAOgDMgwICQEEAKALIgwIiA0UNACADIQMDQCADIgMoAghBEkEAIAAgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQDMgwJFDQhBo9sAQe/IAEHpAEHjEBD3BQALIAApAgQhC0HQgwIhBAJAA0ACQCAEKAIAIgMNAEEAIQUMAgsgAyEEIAMhBSADKQMIIAtSDQALC0EAIQQCQCAFIgNFDQAgAyAALQANQT9xIgRBDGxqQSRqQQAgBCADLQAQSRshBAsgBCEFAkAgAkEBcUUNAEEQIQQgBSECIAMhAwwHCyAALQANDQQgAC8BDg0EIAMhBAJAIAMNACAAEJsFIQQLAkAgBCIDLwESIgUgAC8BECIERg0AAkAgBUEPcSAEQQ9xTQ0AQQMgAyAAEJMFQQAoAtCDAiIEIANGDQMgBCEEA0AgBCIFRQ0FIAUoAgAiAiEEIAIgA0cNAAsgBSADKAIANgIADAQLIAMgBDsBEgsgAyEDDAMLQaPbAEHvyABBvgJBwBMQ9wUAC0EAIAMoAgA2AtCDAgsgAxCZBSAAEJsFIQMLIAMiA0EAKAKc9wFBgIn6AGo2AhwgA0EkaiEEIAMhAwwBCyAFIQQgAyEDCyADIQYCQAJAIAQiBQ0AQRAhBEEAIQIMAQsCQAJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgRBf2ogBi0AESIDIANB/wFGG0EBaiIDa0H/AHEiAkUNAAJAIAMgBGtB/ABxQTxPDQBBEyEDDAMLQRMhAyACQQVJDQILIAYgBDoAEQtBECEDCyADIQcCQAJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiA0GA4ANxQYAgRw0CAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAiACLAAGIgNBAEgNAiACIANBgAFyOgAGQQAtAMyDAkUNBkEAQQA6AMyDAgJAQQAoAsiDAiIDRQ0AIAMhAwNAIAMiAygCCEEhIAUgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAMyDAkUNAUGj2wBB78gAQekAQeMQEPcFAAsgAC8BDiIDQYDgA3FBgCBHDQECQAJAIAVBACAFLQAEIglrQQxsakFgaigCACIERQ0AIANB/x9xIQIgBCEDA0ACQCACIAMiAy8BBEcNACADLQAGQT9xIAlHDQAgAyEDDAMLIAMoAgAiBCEDIAQNAAsLQQAhAwsgAyICRQ0BAkACQCACLQAHIgMgCEcNACADIQQgAkEMaiEJIABBEGohCgJAAkAgA0EFTw0AIAkhCQwBCyAJKAIAIQkLIAogCSAEEK8GDQBBASEEDAELQQAhBAsgBCEEAkAgCEEFSQ0AIAMgCEYNAAJAIANBBUkNACACKAIMEB8LIAIgAC0ADBAeNgIMCyACIAAtAAwiAzoAByACQQxqIQkCQAJAIANBBU8NACAJIQkMAQsgCSgCACEJCyAJIABBEGogAxCVBhogBA0BQQAtAMyDAkUNBkEAQQA6AMyDAiAFLQAEIQMgAi8BBCEEIAEgAi0ABzYCDCABIAQ2AgggASADNgIEIAEgBUEAIANrQQxsakFwajYCAEH+zgAgARA6AkBBACgCyIMCIgNFDQAgAyEDA0AgAyIDKAIIQSAgBSACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0AzIMCDQcLQQBBAToAzIMCCyAHIQQgBSECCyAGIQMLIAMhBiAEIQVBAC0AzIMCIQMCQCACIgJFDQAgA0EBcUUNBUEAQQA6AMyDAiAFIAIgABCRBQJAQQAoAsiDAiIDRQ0AIAMhAwNAIAMiAygCCCAFIAIgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAMyDAkUNAUGj2wBB78gAQekAQeMQEPcFAAsgA0EBcUUNBUEAQQA6AMyDAgJAQQAoAsiDAiIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtAMyDAg0GC0EAQQA6AMyDAiABQRBqJAAPC0Gu2QBB78gAQeMAQeMQEPcFAAtBrtkAQe/IAEHjAEHjEBD3BQALQaPbAEHvyABB6QBB4xAQ9wUAC0Gu2QBB78gAQeMAQeMQEPcFAAtBrtkAQe/IAEHjAEHjEBD3BQALQaPbAEHvyABB6QBB4xAQ9wUAC5MEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQHiIEIAM6ABAgBCAAKQIEIgk3AwhBACgCnPcBIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQ/QUgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKALQgwIiA0UNACAEQQhqIgIpAwAQ6gVRDQAgAiADQQhqQQgQrwZBAEgNAEHQgwIhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEOoFUQ0AIAMhBSACIAhBCGpBCBCvBkF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoAtCDAjYCAEEAIAQ2AtCDAgsCQAJAQQAtAMyDAkUNACABIAY2AgBBAEEAOgDMgwJBjRwgARA6AkBBACgCyIMCIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBQAgAygCACICIQMgAg0ACwtBAC0AzIMCDQFBAEEBOgDMgwIgAUEQaiQAIAQPC0Gu2QBB78gAQeMAQeMQEPcFAAtBo9sAQe/IAEHpAEHjEBD3BQALAgALmQIBBX8jAEEgayICJAACQAJAIAEvAQ4iA0GAf2oiBEEESw0AQQEgBHRBE3FFDQAgAkEBciABQRBqIgUgAS0ADCIEQQ8gBEEPSRsiBhCVBiEAIAJBOjoAACAGIAJyQQFqQQA6AAAgABDEBiIGQQ5KDQECQAJAAkAgA0GAf2oOBQACBAQBBAsgBkEBaiEEIAIgBCAEIAJBAEEAELAFIgNBACADQQBKGyIDaiIFEB4gACAGEJUGIgBqIAMQsAUaIAEtAA0gAS8BDiAAIAUQjgYaIAAQHwwDCyACQQBBABCzBRoMAgsgAiAFIAZqQQFqIAZBf3MgBGoiAUEAIAFBAEobELMFGgwBCyAAIAFB8JUBENQFGgsgAkEgaiQACwoAQfiVARDaBRoLBQAQMwALAgALuQEBAn8jAEEQayICJAACQAJAAkACQAJAAkACQCABLwEOIgNBgF1qDgcBAwUFAwIEAAsCQAJAAkACQCADQf9+ag4HAQIICAgIAwALIAMNBxDeBQwIC0H8ABAbDAcLEDMACyABKAIQEJ8FDAULIAEQ4wUQ0QUaDAQLIAEQ5QUQ0QUaDAMLIAEQ5AUQ0AUaDAILIAIQNDcDCEEAIAEvAQ4gAkEIakEIEI4GGgwBCyABENIFGgsgAkEQaiQACwoAQYiWARDaBRoLJwEBfxCkBUEAQQA2AtiDAgJAIAAQpQUiAQ0AQQAgADYC2IMCCyABC5cBAQJ/IwBBIGsiACQAAkACQEEALQDwgwINAEEAQQE6APCDAhAgDQECQEGQ7AAQpQUiAQ0AQQBBkOwANgLcgwIgAEGQ7AAvAQw2AgAgAEGQ7AAoAgg2AgRBuRcgABA6DAELIAAgATYCFCAAQZDsADYCEEGRwAAgAEEQahA6CyAAQSBqJAAPC0H76ABBu8kAQSFBzBIQ9wUAC6sFAQp/AkAgAA0AQdAPDwtB0Q8hAQJAIABBA3ENAEHSDyEBIAAoAgBBxIaZugRHDQBB0w8hASAAKAIEQYq20tV8Rw0AQdQPIQEgACgCCCICQf//B0sNAEHeDyEBIAAvAQwiA0EYbEHwAGoiBCACSw0AQd8PIQEgAEHYAGoiBSADQRhsaiIGLwEQQf//A0cNAEHgDyEBIAYvARJB//8DRw0AQQAhBkEAIQEDQCAIIQcgBiEIAkACQCAAIAEiAUEBdGpBGGovAQAiBiADTQ0AQQAhBkHhDyEJDAELAkAgASAFIAZBGGxqIgovARBBC3ZNDQBBACEGQeIPIQkMAQsCQCAGRQ0AQQAhBkHjDyEJIAEgCkF4ai8BAEELdk0NAQtBASEGIAchCQsgCSEHIAghCQJAIAZFDQAgAUEeSyIJIQYgByEIIAFBAWoiCiEBIAkhCSAKQSBHDQELCwJAIAlBAXENACAHDwsCQCADDQBBAA8LIAchCUEAIQYDQCAJIQgCQAJAIAUgBiIGQRhsaiIBEMQGIglBD00NAEEAIQFB1g8hCQwBCyABIAkQ6QUhCQJAIAEvARAiByAJIAlBEHZzQf//A3FGDQBBACEBQdcPIQkMAQsCQCAGRQ0AIAFBeGovAQAgB00NAEEAIQFB2A8hCQwBCwJAAkAgAS8BEiIHQQJxDQBBACEBQdkPIQkgB0EESQ0BDAILAkAgASgCFCIBIARPDQBBACEBQdoPIQkMAgsCQCABIAJJDQBBACEBQdsPIQkMAgsCQCABIAdBAnZqIgcgAkkNAEEAIQFB3A8hCQwCC0EAIQFB3Q8hCSAAIAdqLQAADQELQQEhASAIIQkLIAkhCQJAIAFFDQAgCSEJIAZBAWoiCCEGQQAhASAIIANGDQIMAQsLIAkhAQsgAQv8AQEKfxCkBUEAIQECQANAIAEhAiAEIQNBACEEAkAgAEUNAEEAIQQgAkECdEHYgwJqKAIAIgFFDQBBACEEIAAQxAYiBUEPSw0AQQAhBCABIAAgBRDpBSIGQRB2IAZzIgdBCnZBPnFqQRhqLwEAIgYgAS8BDCIITw0AIAFB2ABqIQkgBiEEAkADQCAJIAQiCkEYbGoiAS8BECIEIAdB//8DcSIGSw0BAkAgBCAGRw0AIAEhBCABIAAgBRCvBkUNAwsgCkEBaiIBIQQgASAIRw0ACwtBACEECyAEIgQgAyAEGyEBIAQNASABIQQgAkEBaiEBIAJFDQALQQAPCyABC6UCAQh/EKQFIAAQxAYhAkEAIQMgASEBAkADQCABIQQgBiEFAkACQCADIgdBAnRB2IMCaigCACIBRQ0AQQAhBgJAIARFDQAgBCABa0Gof2pBGG0iBkF/IAYgAS8BDEkbIgZBAEgNASAGQQFqIQYLQQAhCCAGIgMhBgJAIAMgAS8BDCIJSA0AIAghBkEAIQEgBSEDDAILAkADQCAAIAEgBiIGQRhsakHYAGoiAyACEK8GRQ0BIAZBAWoiAyEGIAMgCUcNAAtBACEGQQAhASAFIQMMAgsgBCEGQQEhASADIQMMAQsgBCEGQQQhASAFIQMLIAYhCSADIgYhAwJAIAEOBQACAgIAAgsgBiEGIAdBAWoiBCEDIAkhASAEQQJHDQALQQAhAwsgAwtRAQJ/AkACQCAAEKYFIgANAEH/ASECDAELIAAvARJBA3EhAgsgASEDAkACQAJAIAIOAgABAgsgASAAKAIUIgAgAEEASBsPCyAAKAIUIQMLIAMLUQECfwJAAkAgABCmBSIADQBB/wEhAgwBCyAALwESQQNxIQILIAEhAwJAAkACQCACDgIBAAILIAEgACgCFCIAIABBAEgbDwsgACgCFCEDCyADC8IDAQh/EKQFQQAoAtyDAiECAkACQCAARQ0AIAJFDQAgABDEBiIDQQ9LDQAgAiAAIAMQ6QUiBEEQdiAEcyIEQQp2QT5xakEYai8BACIFIAIvAQwiBk8NACACQdgAaiEHIARB//8DcSEEIAUhBQNAIAcgBSIIQRhsaiIJLwEQIgUgBEsNAQJAIAUgBEcNACAJIQUgCSAAIAMQrwZFDQMLIAhBAWoiCSEFIAkgBkcNAAsLQQAhBQsgAiECIAUiBSEEAkAgBQ0AQQAoAtiDAiECAkAgAEUNACACRQ0AIAAQxAYiA0EPSw0AIAIgACADEOkFIgRBEHYgBHMiBEEKdkE+cWpBGGovAQAiBSACLwEMIgZPDQAgAkHYAGohByAEQf//A3EhBCAFIQUDQCAHIAUiCUEYbGoiCC8BECIFIARLDQECQCAFIARHDQAgCCAAIAMQrwYNACACIQIgCCEEDAMLIAlBAWoiCSEFIAkgBkcNAAsLIAIhAkEAIQQLIAIhAgJAIAQiAEUNACAALQASQQJxRQ0AAkAgAUUNACABIAAvARJBAnY2AgALIAIgACgCFGoPCwJAIAENAEEADwsgAUEANgIAQQALtAEBAn9BACEDAkACQCAARQ0AQQAhAyAAEMQGIgRBDksNAQJAIABB4IMCRg0AQeCDAiAAIAQQlQYaCyAEIQMLIAMhAAJAIAFB5ABNDQBBAA8LIABB4IMCaiABQYABczoAACAAQQFqIQACQAJAIAINACAAIQAMAQtBACEDIAIQxAYiASAAaiIEQQ9LDQEgAEHggwJqIAIgARCVBhogBCEACyAAQeCDAmpBADoAAEHggwIhAwsgAwujAgEDfyMAQbACayICJAAgAkGrAiAAIAEQ+wUaAkACQCACEMQGIgENACABIQAMAQsgASEAA0AgACIBIQACQCACIAFBf2oiAWotAABBdmoOBAACAgACCyABIQAgAQ0AC0EAIQALIAIgACIBakEKOgAAECEgAUEBaiEDIAIhBAJAAkBBgAhBACgC9IMCayIAIAFBAmpJDQAgAyEDIAQhAAwBC0H0gwJBACgC9IMCakEEaiACIAAQlQYaQQBBADYC9IMCQQEgAyAAayIBIAFBgXhqQf93SRshAyACIABqIQALQfSDAkEEaiIBQQAoAvSDAmogACADIgAQlQYaQQBBACgC9IMCIABqNgL0gwIgAUEAKAL0gwJqQQA6AAAQIiACQbACaiQACzkBAn8QIQJAAkBBACgC9IMCQQFqIgBB/wdLDQAgACEBQfSDAiAAakEEai0AAA0BC0EAIQELECIgAQt2AQN/ECECQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBgAhBACgC9IMCIgQgBCACKAIAIgVJGyIEIAVGDQAgAEH0gwIgBWpBBGogBCAFayIFIAEgBSABSRsiBRCVBhogAiACKAIAIAVqNgIAIAUhAwsQIiADC/gBAQd/ECECQCACKAIAQYAISQ0AIAJBADYCAAtBACEDAkBBACgC9IMCIgQgAigCACIFRg0AIAAgAWpBf2ohBiAAIQEgBSEDAkADQCADIQMCQCABIgEgBkkNACABIQUgAyEHDAILIAEhBSADQQFqIgghB0EDIQkCQAJAQfSDAiADakEEai0AACIDDgsBAAAAAAAAAAAAAQALIAEgAzoAACABQQFqIQVBACAIIAhBgAhGGyIDIQdBA0EAIAMgBEYbIQkLIAUiBSEBIAciByEDIAUhBSAHIQcgCUUNAAsLIAIgBzYCACAFIgNBADoAACADIABrIQMLECIgAwuIAQEBfyMAQRBrIgMkAAJAAkACQCAARQ0AIAAQxAZBD0sNACAALQAAQSpHDQELIAMgADYCAEHH6QAgAxA6QX8hAAwBCwJAIAAQsQUiAA0AQX4hAAwBCwJAIAAoAhQgAksNACABQQAoAviLAiAAKAIQaiACEJUGGgsgACgCFCEACyADQRBqJAAgAAvLAwEEfyMAQSBrIgEkAAJAAkBBACgChIwCDQBBABAVIgI2AviLAiACQYAgaiEDAkACQCACKAIAQcam0ZIFRw0AIAIhBCACKAIEQYqM1fkFRg0BC0EAIQQLIAQhBAJAAkAgAygCAEHGptGSBUcNACADIQMgAigChCBBiozV+QVGDQELQQAhAwsgAyECAkACQAJAIARFDQAgAkUNACAEIAIgBCgCCCACKAIISxshAgwBCyAEIAJyRQ0BIAQgAiAEGyECC0EAIAI2AoSMAgsCQEEAKAKEjAJFDQAQsgULAkBBACgChIwCDQBB9AtBABA6QQBBACgC+IsCIgI2AoSMAiACEBcgAUIBNwMYIAFCxqbRkqXB0ZrfADcDEEEAKAKEjAIgAUEQakEQEBYQGBCyBUEAKAKEjAJFDQILIAFBACgC/IsCQQAoAoCMAmtBUGoiAkEAIAJBAEobNgIAQac3IAEQOgsCQAJAQQAoAoCMAiICQQAoAoSMAkEQaiIDSQ0AIAIhAgNAAkAgAiICIAAQwwYNACACIQIMAwsgAkFoaiIEIQIgBCADTw0ACwtBACECCyABQSBqJAAgAg8LQafUAEG+xgBBxQFBsRIQ9wUAC4IEAQh/IwBBIGsiACQAQQAoAoSMAiIBQQAoAviLAiICa0GAIGohAyABQRBqIgQhAQJAAkACQANAIAMhAyABIgUoAhAiAUF/Rg0BIAEgAyABIANJGyIGIQMgBUEYaiIFIQEgBSACIAZqTQ0AC0HlESEDDAELQQAgAiADaiICNgL8iwJBACAFQWhqIgY2AoCMAiAFIQECQANAIAEiAyACTw0BIANBAWohASADLQAAQf8BRg0AC0GrLyEDDAELQQBBADYCiIwCIAQgBksNASAEIQMCQANAAkAgAyIHLQAAQSpHDQAgAEEIakEQaiAHQRBqKQIANwMAIABBCGpBCGogB0EIaikCADcDACAAIAcpAgA3AwggByEBAkADQCABQRhqIgMgBksiBQ0BIAMhASADIABBCGoQwwYNAAsgBUUNAQsgBygCFCIDQf8fakEMdkEBIAMbIgJFDQAgBygCEEEMdkF+aiEEQQAhAwNAIAQgAyIBaiIDQR5PDQMCQEEAKAKIjAJBASADdCIFcQ0AIANBA3ZB/P///wFxQYiMAmoiAyADKAIAIAVzNgIACyABQQFqIgEhAyABIAJHDQALCyAHQRhqIgEhAyABIAZNDQAMAwsAC0Ho0gBBvsYAQc8AQeo7EPcFAAsgACADNgIAQd8bIAAQOkEAQQA2AoSMAgsgAEEgaiQAC+kDAQR/IwBBwABrIgMkAAJAAkACQAJAIABFDQAgABDEBkEPSw0AIAAtAABBKkcNAQsgAyAANgIAQcfpACADEDpBfyEEDAELAkAgAkG5HkkNACADIAI2AhBB9g0gA0EQahA6QX4hBAwBCwJAIAAQsQUiBUUNACAFKAIUIAJHDQBBACEEQQAoAviLAiAFKAIQaiABIAIQrwZFDQELAkBBACgC/IsCQQAoAoCMAmtBUGoiBEEAIARBAEobIAJBB2pBeHFBCCACGyIEQRhqIgVPDQAQtAVBACgC/IsCQQAoAoCMAmtBUGoiBkEAIAZBAEobIAVPDQAgAyACNgIgQboNIANBIGoQOkF9IQQMAQtBAEEAKAL8iwIgBGsiBTYC/IsCAkACQCABQQAgAhsiBEEDcUUNACAEIAIQgQYhBEEAKAL8iwIgBCACEBYgBBAfDAELIAUgBCACEBYLIANBMGpCADcDACADQgA3AyggAyACNgI8IANBACgC/IsCQQAoAviLAms2AjggA0EoaiAAIAAQxAYQlQYaQQBBACgCgIwCQRhqIgA2AoCMAiAAIANBKGpBGBAWEBhBACgCgIwCQRhqQQAoAvyLAksNAUEAIQQLIANBwABqJAAgBA8LQaoPQb7GAEGpAkH+JhD3BQALrwQCDX8BfiMAQSBrIgAkAEHZwwBBABA6QQAoAviLAiIBIAFBACgChIwCRkEMdGoiAhAXAkBBACgChIwCQRBqIgNBACgCgIwCIgFLDQAgASEBIAMhAyACQYAgaiEEIAJBEGohBQNAIAUhBiAEIQcgASEEIABBCGpBEGoiCCADIglBEGoiCikCADcDACAAQQhqQQhqIgsgCUEIaiIMKQIANwMAIAAgCSkCADcDCCAJIQMCQAJAA0AgA0EYaiIBIARLIgUNASABIQMgASAAQQhqEMMGDQALIAUNACAGIQUgByEEDAELIAggCikCADcDACALIAwpAgA3AwAgACAJKQIAIg03AwgCQAJAIA2nQf8BcUEqRw0AIAchAQwBCyAHIAAoAhwiAUEHakF4cUEIIAEbayIDQQAoAviLAiAAKAIYaiABEBYgACADQQAoAviLAms2AhggAyEBCyAGIABBCGpBGBAWIAZBGGohBSABIQQLQQAoAoCMAiIGIQEgCUEYaiIJIQMgBCEEIAUhBSAJIAZNDQALC0EAKAKEjAIoAgghAUEAIAI2AoSMAiAAQQA2AhQgACABQQFqIgE2AhAgAELGptGSpcHRmt8ANwMIIAIgAEEIakEQEBYQGBCyBQJAQQAoAoSMAg0AQafUAEG+xgBB5gFBpsMAEPcFAAsgACABNgIEIABBACgC/IsCQQAoAoCMAmtBUGoiAUEAIAFBAEobNgIAQe8nIAAQOiAAQSBqJAALgAEBAX8jAEEQayICJAACQAJAAkAgAEUNACAALQAAQSpHDQAgABDEBkEQSQ0BCyACIAA2AgBBqOkAIAIQOkEAIQAMAQsCQCAAELEFIgANAEEAIQAMAQsCQCABRQ0AIAEgACgCFDYCAAtBACgC+IsCIAAoAhBqIQALIAJBEGokACAAC5UJAQt/IwBBMGsiAiQAAkACQAJAAkACQAJAAkACQAJAAkAgAEUNACAALQAAQSpHDQAgABDEBkEQSQ0BCyACIAA2AgBBqOkAIAIQOkEAIQMMAQsCQCAAELEFIgRFDQAgBC0AAEEqRw0CIAQoAhQiA0H/H2pBDHZBASADGyIFRQ0AIAQoAhBBDHZBfmohBkEAIQMDQCAGIAMiB2oiA0EeTw0EAkBBACgCiIwCQQEgA3QiCHFFDQAgA0EDdkH8////AXFBiIwCaiIDIAMoAgAgCHM2AgALIAdBAWoiByEDIAcgBUcNAAsLIAJBIGpCADcDACACQgA3AxggAUH/H2pBDHZBASABGyIJQX9qIQpBHiAJayELQQAoAoiMAiEFQQAhBwJAA0AgAyEMAkAgByIIIAtJDQBBACEGDAILAkACQCAJDQAgDCEDIAghB0EBIQgMAQsgCEEdSw0GQQBBHiAIayIDIANBHksbIQZBACEDA0ACQCAFIAMiAyAIaiIHdkEBcUUNACAMIQMgB0EBaiEHQQEhCAwCCwJAIAMgCkYNACADQQFqIgchAyAHIAZGDQgMAQsLIAhBDHRBgMAAaiEDIAghB0EAIQgLIAMiBiEDIAchByAGIQYgCA0ACwsgAiABNgIsIAIgBiIDNgIoAkACQCADDQAgAiABNgIQQZ4NIAJBEGoQOgJAIAQNAEEAIQMMAgsgBC0AAEEqRw0GAkAgBCgCFCIDQf8fakEMdkEBIAMbIgUNAEEAIQMMAgsgBCgCEEEMdkF+aiEGQQAhAwNAIAYgAyIHaiIDQR5PDQgCQEEAKAKIjAJBASADdCIIcQ0AIANBA3ZB/P///wFxQYiMAmoiAyADKAIAIAhzNgIACyAHQQFqIgchAyAHIAVHDQALQQAhAwwBCyACQRhqIAAgABDEBhCVBhoCQEEAKAL8iwJBACgCgIwCa0FQaiIDQQAgA0EAShtBF0sNABC0BUEAKAL8iwJBACgCgIwCa0FQaiIDQQAgA0EAShtBF0sNAEGdIEEAEDpBACEDDAELQQBBACgCgIwCQRhqNgKAjAICQCAJRQ0AQQAoAviLAiACKAIoaiEIQQAhAwNAIAggAyIDQQx0ahAXIANBAWoiByEDIAcgCUcNAAsLQQAoAoCMAiACQRhqQRgQFhAYIAItABhBKkcNByACKAIoIQoCQCACKAIsIgNB/x9qQQx2QQEgAxsiBUUNACAKQQx2QX5qIQZBACEDA0AgBiADIgdqIgNBHk8NCgJAQQAoAoiMAkEBIAN0IghxDQAgA0EDdkH8////AXFBiIwCaiIDIAMoAgAgCHM2AgALIAdBAWoiByEDIAcgBUcNAAsLQQAoAviLAiAKaiEDCyADIQMLIAJBMGokACADDwtB0uUAQb7GAEHlAEH7NRD3BQALQejSAEG+xgBBzwBB6jsQ9wUAC0Ho0gBBvsYAQc8AQeo7EPcFAAtB0uUAQb7GAEHlAEH7NRD3BQALQejSAEG+xgBBzwBB6jsQ9wUAC0HS5QBBvsYAQeUAQfs1EPcFAAtB6NIAQb7GAEHPAEHqOxD3BQALDAAgACABIAIQFkEACwYAEBhBAAsaAAJAQQAoAoyMAiAATQ0AQQAgADYCjIwCCwuXAgEDfwJAECANAAJAAkACQEEAKAKQjAIiAyAARw0AQZCMAiEDDAELIAMhAwNAIAMiBEUNAiAEKAIIIgUhAyAFIABHDQALIARBCGohAwsgAyAAKAIINgIACyAAIAI2AgQgACABNgIAIABBADsBDANAEOsFIgFB/wNxIgJFDQBBACgCkIwCIgNFIQUCQAJAIAMNACAFIQUMAQsgAyEEIAUhBSACIAMvAQxBB3ZGDQADQCAEKAIIIgNFIQUCQCADDQAgBSEFDAILIAMhBCAFIQUgAiADLwEMQQd2Rw0ACwsgBUUNAAsgACABQQd0OwEMIABBACgCkIwCNgIIQQAgADYCkIwCIAFB/wNxDwtBhssAQSdB1ScQ8gUAC4gCAQR/AkAgAC0ADUE+Rw0AIAAtAANBAXFFDQAgACkCBBDqBVINAEEAKAKQjAIiAUUNACAALwEOIQIgASEBA0ACQCABIgEvAQwiAyACcyIEQf//A3FB/wBLDQAgBEEfcQ0CIAEgA0EBakEfcSADQeD/A3FyOwEMIAEgACABQQRqIAEgAkHAAHEbKAIAEQIAIAJBIHFFDQIgAUEAIAEoAgQRAgACQAJAAkBBACgCkIwCIgAgAUcNAEGQjAIhAAwBCyAAIQADQCAAIgRFDQIgBCgCCCICIQAgAiABRw0ACyAEQQhqIQALIAAgASgCCDYCAAsgAUEAOwEMDwsgASgCCCIEIQEgBA0ACwsLWQEDfwJAAkACQEEAKAKQjAIiASAARw0AQZCMAiEBDAELIAEhAQNAIAEiAkUNAiACKAIIIgMhASADIABHDQALIAJBCGohAQsgASAAKAIINgIACyAAQQA7AQwLNwEBfwJAIABBDnFBCEcNAEEADwtBACEBAkAgAEEMcUEMRg0AIABBBHZBCCAAQQNxdE0hAQsgAQuTBAIBfwF+IAFBD3EhAwJAAkAgAUEQTw0AIAIhAgwBCyABQRB0QYCAwP8DakGAgMD/B3GtQiCGvyACoiECCyACIQICQAJAAkACQAJAAkAgA0F+ag4KAAEFBQUCBQUDBAULQQAhAQJAIAJEAAAAAAAAAABjDQBBfyEBIAJEAADg////70FkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8EFjIAJEAAAAAAAAAABmcUUNACACqyEBDAELQQAhAQsgASEBCyAAIAE2AAAPC0IAIQQCQCACRAAAAAAAAAAAYw0AIAJEAAAAAAAA8ENkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8ENjIAJEAAAAAAAAAABmcUUNACACsSEEDAELQgAhBAsgBCEECyAAIAQ3AAAPCwJARAAAAAAAAOBDIAJEAAAAAAAA4D+gIAJEAAAAAAAA4ENkIAJEAAAAAAAA4ENjchsiAplEAAAAAAAA4ENjRQ0AIAAgArA3AAAPCyAAQoCAgICAgICAgH83AAAPCyAAIAK2OAAADwsgACACOQAADwtBgICAgHghAQJAIAJEAAAAAAAA4MFjDQBB/////wchASACRAAAwP///99BZA0AAkACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgAqohAQwBC0GAgICAeCEBCyABIQELIAAgAyABEL8FC/kBAAJAIAFBCEkNACAAIAEgArcQvgUPCwJAAkACQAJAAkACQAJAAkACQCABDggIAAECAwQFBgcLIAAgAkH//wMgAkH//wNIGyIBQQAgAUEAShs7AAAPCyAAIAJBACACQQBKGzYAAA8LIAAgAkEAIAJBAEobrTcAAA8LIAAgAkH/ACACQf8ASBsiAUGAfyABQYB/Shs6AAAPCyAAIAJB//8BIAJB//8BSBsiAUGAgH4gAUGAgH5KGzsAAA8LIAAgAjYAAA8LIAAgAqw3AAAPC0H4xABBrgFB5NgAEPIFAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALvAMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDABbchAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0H4xABBygFB+NgAEPIFAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEMAFtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvkAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIA0BAkAgAC0ABkUNAAJAAkACQEEAKAKUjAIiASAARw0AQZSMAiEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQlwYaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKAKUjAI2AgBBACAANgKUjAJBACECCyACDwtB68oAQStBxycQ8gUAC+QBAgN/AX4CQCABLQAMQQJPDQBBfg8LQX4hAgJAAkAgASkCBCIFUA0AIAEvARAhAxAgDQECQCAALQAGRQ0AAkACQAJAQQAoApSMAiIBIABHDQBBlIwCIQEMAQsgASECA0AgAiIBRQ0CIAEoAgAiBCECIAEhASAEIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCXBhoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAFNwIAIAAgA0EHdDsBBCAAQQAoApSMAjYCAEEAIAA2ApSMAkEAIQILIAIPC0HrygBBK0HHJxDyBQAL1wIBBH8CQAJAAkAgAC0ADUE/Rw0AIAAtAANBAXENABAgDQFBACgClIwCIgFFDQAgASEBA0ACQCABIgEtAAdFDQAgAC8BDiABLwEMRw0AIAFBEGopAgAgACkCBFINACABQQA6AAcgAUEMaiICEPAFAkACQCABLQAGQYB/ag4DAQIAAgtBACgClIwCIgIhAwJAAkACQCACIAFHDQBBlIwCIQIMAQsDQCADIgJFDQIgAigCACIEIQMgAiECIAQgAUcNAAsLIAIgASgCADYCAAsgAUEAQYgCEJcGGgwBCyABQQE6AAYCQCABQQBBAEHgABDFBQ0AIAFBggE6AAYgAS0ABw0FIAIQ7QUgAUEBOgAHIAFBACgCnPcBNgIIDAELIAFBgAE6AAYLIAEoAgAiAiEBIAINAAsLDwtB68oAQckAQe4TEPIFAAtBzdoAQevKAEHxAEGILBD3BQAL6gEBAn9BACEEQX8hBQJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQQAhBEF+IQUMAQtBACEEQQEhBSAALQAHDQACQCACIABBDmotAABqQQRqQe0BTw0AQQEhBEEAIQUMAQsgAEEMahDtBSAAQQE6AAcgAEEAKAKc9wE2AghBACEEQQEhBQsgBSEFAkACQCAERQ0AIABBDGpBPiAALwEEIANyIAIQ8QUiBEUNASAEIAEgAhCVBhogACAALwEEIgRBAWpBH3EgBEHg/wNxcjsBBEEAIQULIAUPC0G41ABB68oAQYwBQcAJEPcFAAvaAQEDfwJAECANAAJAQQAoApSMAiIARQ0AIAAhAANAAkAgACIALQAHIgFFDQBBACgCnPcBIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqEIwGIQFBACgCnPcBIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgEhACABDQALCw8LQevKAEHaAEGrFhDyBQALawEBf0F/IQICQAJAAkAgAC0ABkF/ag4IAQAAAAAAAAIAC0F+DwtBASECIAAtAAcNAEEAIQIgASAAQQ5qLQAAakEEakHtAUkNACAAQQxqEO0FIABBAToAByAAQQAoApz3ATYCCEEBIQILIAILDQAgACABIAJBABDFBQuOAgEDfyAALQAGIgEhAgJAAkACQAJAAkACQAJAIAEOCQUCAwMDAwMDAQALIAFBgH9qDgMBAgMCCwJAAkACQEEAKAKUjAIiASAARw0AQZSMAiEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgMhAiABIQEgAyAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQlwYaQQAPCyAAQQE6AAYCQCAAQQBBAEHgABDFBSIBDQAgAEGCAToABiAALQAHDQQgAEEMahDtBSAAQQE6AAcgAEEAKAKc9wE2AghBAQ8LIABBgAE6AAYgAQ8LQevKAEG8AUHMMhDyBQALQQEhAgsgAg8LQc3aAEHrygBB8QBBiCwQ9wUAC58CAQV/AkACQAJAAkAgAS0AAkUNABAhIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCEGIAQgAC8BBE0NAiACIAVJDQFBACEEQX8hAwwDCyAEIQYgBCAFSQ0BQQAhBEF+IQMMAgsgACADOwEGIAIhBgsgACAGOwECQQEhBEEAIQMLIAMhAwJAIARFDQAgACAALwECaiACa0EIaiABIAIQlQYaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECIgAw8LQdDKAEEdQe4rEPIFAAtBkDBB0MoAQTZB7isQ9wUAC0GkMEHQygBBN0HuKxD3BQALQbcwQdDKAEE4Qe4rEPcFAAsxAQJ/QQAhAQJAIAAvAQAiAiAALwECRg0AIAAgAkEAIAIgAC8BBkkbakEIaiEBCyABC6YBAQN/ECFBACEBAkAgAC8BACICIAAvAQJGDQAgACACQQAgAiAALwEGSRtqQQhqIQELAkACQCABIgFFDQAgAS0AAkEPakH8A3EhAQJAIAIgAC8BBiIDSQ0AIAIgA0cNAiAAIAE7AQAgACAALwEEOwEGECIPCyAAIAIgAWo7AQAQIg8LQZvUAEHQygBBzgBB7xIQ9wUAC0HsL0HQygBB0QBB7xIQ9wUACyIBAX8gAEEIahAeIgEgADsBBCABIAA7AQYgAUEANgEAIAELMwEBfyMAQRBrIgIkACACIAE6AA8gAC0ADSAALwEOIAJBD2pBARCOBiEAIAJBEGokACAACzMBAX8jAEEQayICJAAgAiABOwEOIAAtAA0gAC8BDiACQQ5qQQIQjgYhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATYCDCAALQANIAAvAQ4gAkEMakEEEI4GIQAgAkEQaiQAIAALPAACQAJAIAFFDQAgAS0AAA0BCyAALQANIAAvAQ5B7esAQQAQjgYPCyAALQANIAAvAQ4gASABEMQGEI4GC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBCOBiECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABDtBSAAEIwGCxoAAkAgACABIAIQ1QUiAg0AIAEQ0gUaCyACC4EHARB/IwBBEGsiAyQAAkACQCABLwEOIgRBDHYiBUF/akEBTQ0AQQAhBAwBCwJAIAVBAkcNACABLQAMDQBBACEEDAELAkAgBEH/H3EiBkH/HU0NAEEAIQQMAQsCQCAFQQJHDQAgBEGAHnFBgAJHDQBBACEEDAELQQAhBCACLwEAIgdB8R9GDQBBACAGayEIIAFBEGoiCSEKIAchB0EAIgQhC0EAIQwgBCENA0AgDSENIAwhDiALIQsgECEPAkACQCAHQf//A3EiDEEMdiIEQQlGDQAgDSEHIARBoJYBai0AACEQDAELIA1BAWoiECEHIAIgEEEBdGovAQAhEAsgByERAkACQAJAAkAgECIHRQ0AAkACQCAEQXZqQX1NDQAgDiENIAshEAwBC0EAIQ0gCyAOQf8BcUEAR2pBAyAHQX9qIAdBA0sbIhBqIBBBf3NxIRALIBAhECANIQsCQCAMQf8fcSAGRyISDQAgACAQaiEPAkAgBUEBRw0AAkACQCAEQQhHDQAgAyAPLQAAIAtB/wFxdkEBcToADyABLQANIAEvAQ4gA0EPakEBEI4GGgwBCyAPIQ0gByEOAkAgDEGAwAJJDQADQCANIQQgDiIMRQ0HIARBAWohDSAMQX9qIQ4gBC0AAEUNAAsgDEUNBgsgAS0ADSABLwEOIA8gBxCOBhoLIAshCyAQIQcgCCEEDAULAkAgBEEIRw0AQQEgC0H/AXF0IQQgDy0AACEHAkAgAS0AEEUNACAPIAcgBHI6AAAMBAsgDyAHIARBf3NxOgAADAMLAkAgByABLQAMIgRLDQAgDyAKIAcQlQYaDAMLIA8gCSAEEJUGIQ0CQAJAIAxB/58BTQ0AQQAhBAwBC0EAIQQgDEGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQQLIA0gAS0ADCIMaiAEIAcgDGsQlwYaDAILAkACQCAEQQhHDQBBACALQQFqIgQgBEH/AXFBCEYiBBshCyAQIARqIQcMAQsgCyELIBAgB2ohBwsgDyEEDAMLQYnGAEHbAEGTHhDyBQALIAshCyAQIQcgBiEEDAELIAshCyAQIQdBACEECyAEIQQgByENIAshDAJAIBJFDQAgAiARQQFqIg5BAXRqLwEAIhIhByAEIRAgDSELIAwhDCAOIQ1BACEEIBJB8R9GDQIMAQsLIAQhBAsgA0EQaiQAIAQL/gIBBH8gABDXBSAAEMQFIAAQuwUgABCaBQJAAkAgAC0AA0EBcQ0AIAAtAA0NASAALwEODQEgAC0ADEEESQ0BIAAtABFBCHFFDQFBAEEAKAKc9wE2AqCMAkGAAhAcQQAtAMjqARAbDwsCQCAAKQIEEOoFUg0AIAAQ2AUgAC0ADSIBQQAtAJyMAk8NAUEAKAKYjAIgAUECdGooAgAhAgJAAkACQCAALwEOQfldag4DAQIAAgsgARDZBSIDIQECQCADDQAgAhDnBSEBCwJAIAEiAQ0AIAAQ0gUaDwsgACABENEFGg8LIAIQ6AUiAUF/Rg0AIAAgAUH/AXEQzgUaDwsgAiAAIAIoAgAoAgwRAgAPCyAALQADQQRxRQ0AQQAtAJyMAkUNACAAKAIEIQRBACEBA0ACQEEAKAKYjAIgASIBQQJ0aigCACICKAIAIgMoAgAgBEcNACAAIAE6AA0gAiAAIAMoAgwRAgALIAFBAWoiAiEBIAJBAC0AnIwCSQ0ACwsLAgALAgALBABBAAtnAQF/AkBBAC0AnIwCQSBJDQBBicYAQbABQZc4EPIFAAsgAC8BBBAeIgEgADYCACABQQAtAJyMAiIAOgAEQQBB/wE6AJ2MAkEAIABBAWo6AJyMAkEAKAKYjAIgAEECdGogATYCACABC7ECAgV/AX4jAEGAAWsiACQAQQBBADoAnIwCQQAgADYCmIwCQQAQNKciATYCnPcBAkACQAJAAkAgAUEAKAKsjAIiAmsiA0H//wBLDQBBACkDsIwCIQUgA0HoB0sNASAFIQUgAyEDDAILQQBBACkDsIwCIANB6AduIgKtfDcDsIwCIAMgAkHoB2xrIQMMAgsgBSABIAJrQZd4aiIDQegHbiIEQQFqrXwhBSABIAIgA2prIAMgBEHoB2xrakGYeGohAwtBACAFNwOwjAIgAyEDC0EAIAEgA2s2AqyMAkEAQQApA7CMAj4CuIwCEKIFEDcQ5gVBAEEAOgCdjAJBAEEALQCcjAJBAnQQHiIBNgKYjAIgASAAQQAtAJyMAkECdBCVBhpBABA0PgKgjAIgAEGAAWokAAvCAQIDfwF+QQAQNKciADYCnPcBAkACQAJAAkAgAEEAKAKsjAIiAWsiAkH//wBLDQBBACkDsIwCIQMgAkHoB0sNASADIQMgAiECDAILQQBBACkDsIwCIAJB6AduIgGtfDcDsIwCIAIgAUHoB2xrIQIMAgsgAyAAIAFrQZd4aiICQegHbiIBrXxCAXwhAyACIAFB6Adsa0EBaiECC0EAIAM3A7CMAiACIQILQQAgACACazYCrIwCQQBBACkDsIwCPgK4jAILEwBBAEEALQCkjAJBAWo6AKSMAgvEAQEGfyMAIgAhARAdIABBAC0AnIwCIgJBAnRBD2pB8A9xayIDJAACQCACRQ0AQQAoApiMAiEEQQAhAANAIAMgACIAQQJ0IgVqIAQgBWooAgAoAgAoAgA2AgAgAEEBaiIFIQAgBSACRw0ACwsCQEEALQCljAIiAEEPTw0AQQAgAEEBajoApYwCCyADQQAtAKSMAkEQdEEALQCljAJyQYCeBGo2AgACQEEAQQAgAyACQQJ0EI4GDQBBAEEAOgCkjAILIAEkAAsEAEEBC9wBAQJ/AkBBqIwCQaDCHhD0BUUNABDeBQsCQAJAQQAoAqCMAiIARQ0AQQAoApz3ASAAa0GAgIB/akEASA0BC0EAQQA2AqCMAkGRAhAcC0EAKAKYjAIoAgAiACAAKAIAKAIIEQAAAkBBAC0AnYwCQf4BRg0AAkBBAC0AnIwCQQFNDQBBASEAA0BBACAAIgA6AJ2MAkEAKAKYjAIgAEECdGooAgAiASABKAIAKAIIEQAAIABBAWoiASEAIAFBAC0AnIwCSQ0ACwtBAEEAOgCdjAILEIQGEMYFEJgFEJEGC9oBAgR/AX5BAEGQzgA2AoyMAkEAEDSnIgA2Apz3AQJAAkACQAJAIABBACgCrIwCIgFrIgJB//8ASw0AQQApA7CMAiEEIAJB6AdLDQEgBCEEIAIhAgwCC0EAQQApA7CMAiACQegHbiIBrXw3A7CMAiACIAFB6AdsayECDAILIAQgACABa0GXeGoiAkHoB24iA0EBaq18IQQgACABIAJqayACIANB6Adsa2pBmHhqIQILQQAgBDcDsIwCIAIhAgtBACAAIAJrNgKsjAJBAEEAKQOwjAI+AriMAhDiBQtnAQF/AkACQANAEIkGIgBFDQECQCAALQADQQNxQQNHDQAgACkCBBDqBVINAEE/IAAvAQBBAEEAEI4GGhCRBgsDQCAAENYFIAAQ7gUNAAsgABCKBhDgBRA8IAANAAwCCwALEOAFEDwLCxQBAX9BpzVBABCqBSIAQZ4tIAAbCw4AQe8+QfH///8DEKkFCwYAQe7rAAveAQEDfyMAQRBrIgAkAAJAQQAtALyMAg0AQQBCfzcD2IwCQQBCfzcD0IwCQQBCfzcDyIwCQQBCfzcDwIwCA0BBACEBAkBBAC0AvIwCIgJB/wFGDQBB7esAIAJBozgQqwUhAQsgAUEAEKoFIQFBAC0AvIwCIQICQAJAIAENAEHAACEBIAJBwABJDQFBAEH/AToAvIwCIABBEGokAA8LIAAgAjYCBCAAIAE2AgBB4zggABA6QQAtALyMAkEBaiEBC0EAIAE6ALyMAgwACwALQeLaAEGfyQBB2gBB8CQQ9wUACzUBAX9BACEBAkAgAC0ABEHAjAJqLQAAIgBB/wFGDQBB7esAIABBojUQqwUhAQsgAUEAEKoFCzgAAkACQCAALQAEQcCMAmotAAAiAEH/AUcNAEEAIQAMAQtB7esAIABB7hEQqwUhAAsgAEF/EKgFC1MBA38CQCABDQBBxbvyiHgPC0HFu/KIeCECIAAhACABIQEDQCACIAAiAC0AAHNBk4OACGwiAyECIABBAWohACABQX9qIgQhASADIQMgBA0ACyADCwQAEDILTgEBfwJAQQAoAuCMAiIADQBBACAAQZODgAhsQQ1zNgLgjAILQQBBACgC4IwCIgBBDXQgAHMiAEERdiAAcyIAQQV0IABzIgA2AuCMAiAAC34BA39B//8DIQICQCABRQ0AIAEhAiAAIQBB//8DIQEDQCACQX9qIgMhAiAAIgRBAWohACABQf//A3EiAUEIdCAELQAAIAFBCHZzIgFB8AFxQQR2IAFzQf8BcSIBciABQQx0cyABQQV0cyIEIQEgAw0ACyAEIQILIAJB//8DcQt1AQV/IAAtAAJBCmohASAAQQJqIQJB//8DIQMDQCABQX9qIgQhASACIgVBAWohAiADQf//A3EiA0EIdCAFLQAAIANBCHZzIgNB8AFxQQR2IANzQf8BcSIDciADQQx0cyADQQV0cyIFIQMgBA0ACyAAIAU7AQALhgIBCH8CQCAALQAMIgFBB2pB/ANxIgIgAC0AAiIDSQ0AQQAPCyACIQICQCAAQQxqIgQgAUEEaiIFai0AAEH/AUcNAAJAIAEgAGpBEWotAAAiASADSQ0AQQAPCyABIQIgBSABSQ0AQQAPCyAAIAAtAANB/QFxOgADQQAhAQJAIAAgAiIFakEMaiICLQAAIgZBBGoiByAFaiADSg0AIAIhASAEIQMgBkEHaiIIQQJ2IQIDQCADIgMgASIBKAIANgIAIAFBBGohASADQQRqIQMgAkF/aiIEIQIgBA0ACyAAQQxqIgEgB2pB/wE6AAAgBiABakEFaiAIQfwBcSAFajoAAEEBIQELIAELSQEBfwJAIAJBBEkNACABIQEgACEAIAJBAnYhAgNAIAAiACABIgEoAgA2AgAgAUEEaiEBIABBBGohACACQX9qIgMhAiADDQALCwsJACAAQQA6AAILngEBA38CQAJAIAFBgAJPDQAgAkGAgARPDQFBACEEAkAgA0EEaiAAQQxqIgUgBSAALQACIgZqIgVrQewBaksNACAFIAE6AAEgBSADOgAAIAVBA2ogAkEIdjoAACAFQQJqIAI6AAAgACAGIANBB2pB/AFxajoAAiAFQQRqIQQLIAQPC0GryABB/QBB7TQQ8gUAC0GryABB/wBB7TQQ8gUACywBAX8jAEEQayIDJAAgAyACNgIIIAMgATYCBCADIAA2AgBB6xkgAxA6EBoAC0kBA38CQCAAKAIAIgJBACgCuIwCayIDQX9KDQAgACACIAFqIgI2AgAgAkEAKAK4jAIiBGtBf0oNACAAIAQgAWo2AgALIANBH3YLSQEDfwJAIAAoAgAiAkEAKAKc9wFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoApz3ASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtqAQN/AkAgAkUNAEEAIQMDQCAAIAMiA0EBdGoiBCABIANqIgUtAABBBHZBsi9qLQAAOgAAIARBAWogBS0AAEEPcUGyL2otAAA6AAAgA0EBaiIEIQMgBCACRw0ACwsgACACQQF0akEAOgAAC+ICAQd/IAAhAgJAIAEtAAAiA0UNACADRSEEIAMhAyABIQFBACEFIAAhBgNAIAYhByAFIQggBCEEIAMhAyABIQICQANAIAIhAiAEIQUCQAJAIAMiBEFQakH/AXFBCUsiAw0AIATAQVBqIQEMAQtBfyEBIARBIHIiBkGff2pB/wFxQQVLDQAgBsBBqX9qIQELIAFBf0cNASACLQABIgFFIQQgASEDIAJBAWohAiABDQALIAchAgwCCwJAIAVBAXFFDQAgByECDAILAkACQCADDQAgBMBBUGohAQwBC0F/IQEgBEEgciIEQZ9/akH/AXFBBUsNACAEwEGpf2ohAQsgASEBIAJBAWohAgJAAkAgCA0AIAchBiABQQR0QYACciEFDAELIAcgASAIcjoAACAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBBxhkgBBA6EBoAC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsLtxABDn8jAEHAAGsiBSQAIAAgAWohBiAFQX9qIQcgBUEBciEIIAVBAnIhCUEAIQEgACEKIAQhBCACIQsgAiECA0AgAiECIAQhDCAKIQ0gASEBIAsiDkEBaiEPAkACQCAOLQAAIhBBJUYNACAQRQ0AIAEhASANIQogDCEEIA8hC0EBIQ8gAiECDAELAkACQCACIA9HDQAgASEBIA0hCgwBCyAGIA1rIREgASEBQQAhCgJAIAJBf3MgD2oiC0EATA0AA0AgASACIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAtHDQALCyABIQECQCARQQBMDQAgDSACIAsgEUF/aiARIAtKGyIKEJUGIApqQQA6AAALIAEhASANIAtqIQoLIAohDSABIRECQCAQDQAgESEBIA0hCiAMIQQgDyELQQAhDyACIQIMAQsCQAJAIA8tAABBLUYNACAPIQFBACEKDAELIA5BAmogDyAOLQACQfMARiIKGyEBIAogAEEAR3EhCgsgCiEOIAEiEiwAACEBIAVBADoAASASQQFqIQ8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UCAcHBwcGBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHAwcHBwcHBwcHBwcAAQcFBwcHBwcHBwcHBAcHCgcCBwcDBwsgBSAMKAIAOgAAIBEhCiANIQQgDEEEaiECDAwLIAUhCgJAAkAgDCgCACIBQX9MDQAgASEBIAohCgwBCyAFQS06AABBACABayEBIAghCgsgDEEEaiEOIAoiCyEKIAEhBANAIAoiCiAEIgEgAUEKbiIEQQpsa0EwcjoAACAKQQFqIgIhCiAEIQQgAUEJSw0ACyACQQA6AAAgCyALEMQGakF/aiIEIQogCyEBIAQgC00NCgNAIAEiAS0AACEEIAEgCiIKLQAAOgAAIAogBDoAACAKQX9qIgQhCiABQQFqIgIhASACIARJDQAMCwsACyAFIQogDCgCACEEA0AgCiIKIAQiASABQQpuIgRBCmxrQTByOgAAIApBAWoiAiEKIAQhBCABQQlLDQALIAJBADoAACAMQQRqIQsgByAFEMQGaiIEIQogBSEBIAQgBU0NCANAIAEiAS0AACEEIAEgCiIKLQAAOgAAIAogBDoAACAKQX9qIgQhCiABQQFqIgIhASACIARJDQAMCQsACyAFQbDwATsBACAMKAIAIQtBACEKQRwhBANAIAohCgJAAkAgCyAEIgF2QQ9xIgQNACABRQ0AQQAhAiAKRQ0BCyAJIApqIARBN2ogBEEwciAEQQlLGzoAACAKQQFqIQILIAIiAiEKIAFBfGohBCABDQALIAkgAmpBADoAACARIQogDSEEIAxBBGohAgwJCyAFQbDwATsBACAMKAIAIQtBACEKQRwhBANAIAohCgJAAkAgCyAEIgF2QQ9xIgQNACABRQ0AQQAhAiAKRQ0BCyAJIApqIARBN2ogBEEwciAEQQlLGzoAACAKQQFqIQILIAIiAiEKIAFBfGohBCABDQALIAkgAmpBADoAACARIQogDSEEIAxBBGohAgwICyAFIAxBB2pBeHEiASsDAEEIEPoFIBEhCiANIQQgAUEIaiECDAcLAkACQCASLQABQfAARg0AIBEhASANIQ9BPyENDAELAkAgDCgCACIBQQFODQAgESEBIA0hD0EAIQ0MAQsgDCgCBCEKIAEhBCANIQIgESELA0AgCyERIAIhDSAKIQsgBCIQQR8gEEEfSBshAkEAIQEDQCAFIAEiAUEBdGoiCiALIAFqIgQtAABBBHZBsi9qLQAAOgAAIAogBC0AAEEPcUGyL2otAAA6AAEgAUEBaiIKIQEgCiACRw0ACyAFIAJBAXQiD2pBADoAACAGIA1rIQ4gESEBQQAhCgJAIA9BAEwNAANAIAEgBSAKIgpqLQAAQcABcUGAAUdqIQEgCkEBaiIEIQogBCAPRw0ACwsgASEBAkAgDkEATA0AIA0gBSAPIA5Bf2ogDiAPShsiChCVBiAKakEAOgAACyALIAJqIQogECACayIOIQQgDSAPaiIPIQIgASELIAEhASAPIQ9BACENIA5BAEoNAAsLIAUgDToAACABIQogDyEEIAxBCGohAiASQQJqIQEMBwsgBUE/OgAADAELIAUgAToAAAsgESEKIA0hBCAMIQIMAwsgBiANayEQIBEhAUEAIQoCQCAMKAIAIgRBtuQAIAQbIgsQxAYiAkEATA0AA0AgASALIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCAQQQBMDQAgDSALIAIgEEF/aiAQIAJKGyIKEJUGIApqQQA6AAALIAxBBGohECAFQQA6AAAgDSACaiEEAkAgDkUNACALEB8LIAEhCiAEIQQgECECDAILIBEhCiANIQQgCyECDAELIBEhCiANIQQgDiECCyAPIQELIAEhDSACIQ4gBiAEIg9rIQsgCiEBQQAhCgJAIAUQxAYiAkEATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCALQQBMDQAgDyAFIAIgC0F/aiALIAJKGyIKEJUGIApqQQA6AAALIAEhASAPIAJqIQogDiEEIA0hC0EBIQ8gDSECCyABIg4hASAKIg0hCiAEIQQgCyELIAIhAiAPDQALAkAgA0UNACADIA5BAWo2AgALIAVBwABqJAAgDSAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEK0GIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ7gaiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ7gajIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBDuBqNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahDuBqJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQlwYaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QbCWAWopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEJcGIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQxAZqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLDwAgACABIAJBACADEPkFCywBAX8jAEEQayIEJAAgBCADNgIMIAAgASACQQAgAxD5BSEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALTQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgAEEAIAEQ+QUiARAeIgMgASAAQQAgAigCCBD5BRogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQHiEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZBsi9qLQAAOgAAIAVBAWogBi0AAEEPcUGyL2otAAA6AAAgBEEBaiIFIQQgBSABRw0ACwsgAyACakEAOgAAIAML6QEBB38jAEEQayIBJAAgAUEANgIMIAFCADcCBCABIAA2AgACQAJAIAANAEEBIQIMAQsgACECQQAhA0EAIQQDQCACIQUgASAEQQFqIgRBAnRqKAIAIgYhAiAFEMQGIANqIgUhAyAEIQQgBg0ACyAFQQFqIQILIAIQHiEHQQAhBQJAIABFDQAgACECQQAhA0EAIQQDQCACIQIgByADIgNqIAIgAhDEBiIFEJUGGiABIARBAWoiBEECdGooAgAiBiECIAUgA2oiBSEDIAQhBCAFIQUgBg0ACwsgByAFakEAOgAAIAFBEGokACAHCxkAAkAgAQ0AQQEQHg8LIAEQHiAAIAEQlQYLQgEDfwJAIAANAEEADwsCQCABDQBBAQ8LQQAhAgJAIAAQxAYiAyABEMQGIgRJDQAgACADaiAEayABEMMGRSECCyACCyMAAkAgAA0AQQAPCwJAIAENAEEBDwsgACABIAEQxAYQrwZFCxIAAkBBACgC6IwCRQ0AEIUGCwueAwEHfwJAQQAvAeyMAiIARQ0AIAAhAUEAKALkjAIiACICIQMgACEAIAIhAgNAIAAhBCACIgBBCGohBSABIQIgAyEBA0AgASEBIAIhAwJAAkACQCAALQAFIgJB/wFHDQAgACABRw0BQQAgAyABLQAEQQNqQfwDcUEIaiICayIDOwHsjAIgASABIAJqIANB//8DcRDvBQwCC0EAKAKc9wEgACgCAGtBAEgNACACQf8AcSAALwEGIAUgAC0ABBCOBg0EAkACQCAALAAFIgFBf0oNAAJAIABBACgC5IwCIgFGDQBB/wEhAQwCC0EAQQAvAeyMAiABLQAEQQNqQfwDcUEIaiICayIDOwHsjAIgASABIAJqIANB//8DcRDvBQwDCyAAIAAoAgBB0IYDajYCACABQYB/ciEBCyAAIAE6AAULQQAvAeyMAiIEIQFBACgC5IwCIgUhAyAALQAEQQNqQfwDcSAAakEIaiIGIQAgBiECIAYgBWsgBEgNAgwDC0EALwHsjAIiAyECQQAoAuSMAiIGIQEgBCAGayADSA0ACwsLC/ACAQR/AkACQBAgDQAgAUGAAk8NAUEAQQAtAO6MAkEBaiIEOgDujAIgAC0ABCAEQQh0IAFB/wFxckGAgH5yIgVB//8DcSACIAMQjgYaAkBBACgC5IwCDQBBgAEQHiEBQQBBiwI2AuiMAkEAIAE2AuSMAgsCQCADQQhqIgZBgAFKDQACQAJAQYABQQAvAeyMAiIBayAGSA0AIAEhBwwBCyABIQQDQEEAIARBACgC5IwCIgEtAARBA2pB/ANxQQhqIgRrIgc7AeyMAiABIAEgBGogB0H//wNxEO8FQQAvAeyMAiIBIQQgASEHQYABIAFrIAZIDQALC0EAKALkjAIgByIEaiIBIAU7AQYgASADOgAEIAEgAC0ABDoABSABQQhqIAIgAxCVBhogAUEAKAKc9wFBoJwBajYCAEEAIANB/wFxQQNqQfwDcSAEakEIajsB7IwCCw8LQafKAEHdAEGQDhDyBQALQafKAEEjQas6EPIFAAsbAAJAQQAoAvCMAg0AQQBBgBAQzQU2AvCMAgsLOwEBfwJAIAANAEEADwtBACEBAkAgABDfBUUNACAAIAAtAANBwAByOgADQQAoAvCMAiAAEMoFIQELIAELDABBACgC8IwCEMsFCwwAQQAoAvCMAhDMBQtNAQJ/QQAhAQJAIAAQ3QJFDQBBACEBQQAoAvSMAiAAEMoFIgJFDQBBri5BABA6IAIhAQsgASEBAkAgABCIBkUNAEGcLkEAEDoLEEMgAQtSAQJ/IAAQRRpBACEBAkAgABDdAkUNAEEAIQFBACgC9IwCIAAQygUiAkUNAEGuLkEAEDogAiEBCyABIQECQCAAEIgGRQ0AQZwuQQAQOgsQQyABCxsAAkBBACgC9IwCDQBBAEGACBDNBTYC9IwCCwuvAQECfwJAAkACQBAgDQBB/IwCIAAgASADEPEFIgQhBQJAIAQNAEEAEOoFNwKAjQJB/IwCEO0FQfyMAhCMBhpB/IwCEPAFQfyMAiAAIAEgAxDxBSIBIQUgAUUNAgsgBSEBAkAgA0UNACACRQ0DIAEgAiADEJUGGgtBAA8LQYHKAEHmAEHXORDyBQALQbjUAEGBygBB7gBB1zkQ9wUAC0Ht1ABBgcoAQfYAQdc5EPcFAAtHAQJ/AkBBAC0A+IwCDQBBACEAAkBBACgC9IwCEMsFIgFFDQBBAEEBOgD4jAIgASEACyAADwtBhi5BgcoAQYgBQd00EPcFAAtGAAJAQQAtAPiMAkUNAEEAKAL0jAIQzAVBAEEAOgD4jAICQEEAKAL0jAIQywVFDQAQQwsPC0GHLkGBygBBsAFBtBEQ9wUAC0gAAkAQIA0AAkBBAC0A/owCRQ0AQQAQ6gU3AoCNAkH8jAIQ7QVB/IwCEIwGGhDdBUH8jAIQ8AULDwtBgcoAQb0BQfwrEPIFAAsGAEH4jgILTwIBfgJ/AkACQCAAvSIBQjSIp0H/D3EiAkH/D0YNAEEEIQMgAg0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC44EAQN/AkAgAkGABEkNACAAIAEgAhAQIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQlQYPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAL8jgJFDQBBACgC/I4CEJoGIQELAkBBACgC8OsBRQ0AQQAoAvDrARCaBiABciEBCwJAELAGKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABCYBiECCwJAIAAoAhQgACgCHEYNACAAEJoGIAFyIQELAkAgAkUNACAAEJkGCyAAKAI4IgANAAsLELEGIAEPC0EAIQICQCAAKAJMQQBIDQAgABCYBiECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEGABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoEREAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQmQYLIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQnAYhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBUIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAFQQEgBmuthiEDDAELIAVC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBEIAUw0AA0AgB0F/aiEHIARCAYYiBEJ/VQ0ACwsgAkEBIAdrrYYhAgwBCyACQv////////8Hg0KAgICAgICACIQhAgsCQCAGIAdMDQADQAJAIAMgAn0i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v6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ7AYgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDsBiADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOwGIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDsBiADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ7AYgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEOIGRQ0AIAMgBBDSBiEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDsBiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEOQGIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDiBkEASg0AAkAgASAJIAMgChDiBkUNACABIQQMAgsgBUHwAGogASACQgBCABDsBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ7AYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOwGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDsBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ7AYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EOwGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkG86gFqKAIAIQYgAkGw6gFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEM0GIQILIAIQzgYNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDNBiECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAgCUEGSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEM0GIQILIAlBAWoiCUEIRw0ADAILAAsCQCAJQQNGDQAgCUEIRg0BIANFDQIgCUEESQ0CIAlBCEYNAQsCQCABKQNwIgpCAFMNACAFIAUoAgBBf2o2AgALIANFDQAgCUEESQ0AIApCAFMhAQNAAkAgAQ0AIAUgBSgCAEF/ajYCAAsgCUF/aiIJQQNLDQALCyAE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KAKQjwIiBEEBIABBA3Z0IgBxDQBBACAEIAByNgKQjwIgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QcCRAmohBAJAAkACQAJAQQAoApSPAiIGQQEgAnQiA3ENAEEAIAYgA3I2ApSPAiAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCsI8CQX9qIgFBfyABGzYCsI8CCwsHAD8AQRB0C1QBAn9BACgC9OsBIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEN4GTQ0AIAAQEkUNAQtBACAANgL06wEgAQ8LEJIGQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDhBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ4QZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEOEGIAVBMGogCiABIAcQ6wYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDhBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDhBiAFIAIgBEEBIAZrEOsGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDpBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDqBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIA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IARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDhBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDhBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEOEGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEOEGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEOEGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEOEGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEOEGIAVBIGogAiAEIAYQ4QYgBUEQaiASIAEgBxDrBiAFIAIgBCAHEOsGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDgBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ4QYgAiAAIARBgfgAIANrEOsGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBgJMGJANBgJMCQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABERAAslAQF+IAAgASACrSADrUIghoQgBBD7BiEFIAVCIIinEPEGIAWnCxMAIAAgAacgAUIgiKcgAiADEBMLC47vgYAAAwBBgAgLyOIBaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBpc1JlYWRPbmx5AGRldnNfdmVyaWZ5AHN0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAZGVsYXkAc2V0dXBfY3R4AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAY2h1bmsgb3ZlcmZsb3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAYmxpdFJvdwBqZF93c3NrX25ldwBqZF93ZWJzb2NrX25ldwBleHByMV9uZXcAZGV2c19qZF9zZW5kX3JhdwBpZGl2AHByZXYALmFwcC5naXRodWIuZGV2ACVzXyV1AHRocm93OiVkQCV1AGZzdG9yOiBubyBmcmVlIHBhZ2VzOyBzej0ldQBmc3Rvcjogb3V0IG9mIHNwYWNlOyBzej0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBmc3RvcjogdG9vIGxhcmdlOiAldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AFVuZXhwZWN0ZWQgZW5kIG9mIEpTT04gaW5wdXQAc2V0VGltZW91dABjbGVhclRpbWVvdXQAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdAAhIGV4cGVjdGluZyBzdGFjaywgZ290AHByaW50AGRldnNfdm1fc2V0X2JyZWFrcG9pbnQAZGV2c192bV9jbGVhcl9icmVha3BvaW50AGRldnNfdXRmOF9jb2RlX3BvaW50AGpkX2NsaWVudF9lbWl0X2V2ZW50AHRjcHNvY2tfb25fZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AF9zb2NrZXRPbkV2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAY3VycmVudABkZXZzX3BhY2tldF9zcGVjX3BhcmVudABsYXN0LWVudAB2YXJpYW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABkYmc6IGhhbHQAbWFza2VkIHNlcnZlciBwa3QAamRfZnN0b3JfaW5pdABkZXZzbWdyX2luaXQAZGNmZ19pbml0AGJsaXQAd2FpdABoZWlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19zaG9ydF9tYXBfc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABfb25TZXJ2ZXJQYWNrZXQAX29uUGFja2V0AGdldABpc1JlZ1NldABpc1JlZ0dldABkZXZzX2dldF9idWlsdGluX29iamVjdABhIGJ1aWx0aW4gZnJvemVuIG9iamVjdABmaWxsUmVjdABwYXJzZUZsb2F0AGRldnNjbG91ZDogaW52YWxpZCBjbG91ZCB1cGxvYWQgZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwB3cwBqZGlmOiByb2xlICclcycgYWxyZWFkeSBleGlzdHMAamRfcm9sZV9zZXRfaGludHMAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzADB4MXh4eHh4eHggZXhwZWN0ZWQgZm9yIHNlcnZpY2UgY2xhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBHUElPOiBpbml0OiAlZCBwaW5zAGVxdWFscwBtaWxsaXMAZmxhZ3MAc2VuZF92YWx1ZXMAZGNmZzogaW5pdGVkLCAlZCBlbnRyaWVzLCAldSBieXRlcwBjYXBhYmlsaXRpZXMAaWR4IDwgY3R4LT5pbWcuaGVhZGVyLT5udW1fc2VydmljZV9zcGVjcwBwaXBlcyBpbiBzcGVjcwBhYnMAZXZlcnlNcwBkZXZzLWtleS0lLXMAKiBjb25uZWN0aW9uIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvICVzOi8vJXM6JWQlcwBzZWxmLWRldmljZTogJXMvJXMAIyAldSAlcwBleHBlY3RpbmcgJXM7IGdvdCAlcwAqIHN0YXJ0OiAlcyAlcwAqIGNvbm5lY3RlZCB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwAlcyBmaWVsZHMgb2YgJXMAJXMgZmllbGQgJyVzJyBvZiAlcwBjbGVhciByb2xlICVzACVjICVzAD4gJXMAbWFpbjogYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAPiAlczogJXMAV1M6IGVycm9yOiAlcwBXU1NLOiBlcnJvcjogJXMAYmFkIHJlc3A6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAFVua25vd24gZW5jb2Rpbmc6ICVzAGZzdG9yOiBtb3VudCBmYWlsdXJlOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAJWMgICAgJXMAd3Nza19jb25uc3RyAG4gPD0gd3MtPm1zZ3B0cgBmYWlsX3B0cgBtYXJrX3B0cgB3cml0ZSBlcnIAX2xvZ1JlcHIAY29uc3RydWN0b3IAYnVpbHRpbiBmdW5jdGlvbiBpcyBub3QgYSBjdG9yAGlzU2ltdWxhdG9yAHRhZyBlcnJvcgBzb2NrIHdyaXRlIGVycm9yAFN5bnRheEVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAHNlcnZlcgBKU09OLnBhcnNlIHJldml2ZXIAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAbWdyOiBzdGFydGluZyBjbG91ZCBhZGFwdGVyAG1ncjogZGV2TmV0d29yayBtb2RlIC0gZGlzYWJsZSBjbG91ZCBhZGFwdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAZGV2c19tYXBsaWtlX2l0ZXIAZGVwbG95X2hhbmRsZXIAc3RhcnRfcGt0X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBjbGFzc0lkZW50aWZpZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAbXV0YWJsZSBCdWZmZXIAc3BpWGZlcgBmc3Rvcjogbm8gc3BhY2UgZm9yIGhlYWRlcgBKU09OLnN0cmluZ2lmeSByZXBsYWNlcgBudW1iZXIAcm9sZV9tZW1iZXIAaW5zdGFudGlhdGVkIHJvbGUgbWVtYmVyAGZyZWVfZmliZXIARmliZXIAZmxhc2hfYmFzZV9hZGRyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgREVWU19QQUNLX1NISUZUKSA+PiBERVZTX1BBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAYnBwAHBvcAAhIEV4Y2VwdGlvbjogSW5maW5pdGVMb29wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABzbGVlcABkZXZzX21hcGxpa2VfaXNfbWFwAGRldnNfZHVtcF9oZWFwAHZhbGlkYXRlX2hlYXAARGV2Uy1TSEEyNTY6ICUqcAAhIEdDLXB0ciB2YWxpZGF0aW9uIGVycm9yOiAlcyBwdHI9JXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAaW52YWxpZCB0YWc6ICV4IGF0ICVwACEgaGQ6ICVwAGRldnNfbWFwbGlrZV9nZXRfcHJvdG8AZ2V0X3N0YXRpY19idWlsdF9pbl9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19pbnNwZWN0X3RvAHNtYWxsIGhlbGxvAGdwaW8AamRfc3J2Y2ZnX3J1bgBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuACEgVW5oYW5kbGVkIGV4Y2VwdGlvbgAqIEV4Y2VwdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AY3RvciBmdW5jdGlvbgBmaWJlciBzdGFydGVkIHdpdGggYSBidWlsdGluIGZ1bmN0aW9uAF9pMmNUcmFuc2FjdGlvbgBpc0FjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAEB2ZXJzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AamRfc2V0dGluZ3Nfc2V0X2JpbgBtYWluAG1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduAG1ncjogcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBfc29ja2V0T3BlbgBmc3RvcjogZ2MgZG9uZSwgJWQgZnJlZSwgJWQgZ2VuAG5hbgBib29sZWFuAGZyb20AcmFuZG9tAGZsYXNoX3Byb2dyYW0AKiBzdG9wIHByb2dyYW0AaW11bAB1bmtub3duIGN0cmwAbm9uLWZpbiBjdHJsAHRvbyBsYXJnZSBjdHJsAG51bGwAZmlsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxhYmVsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAG5vbi1taW5pbWFsAD9zcGVjaWFsAGRldk5ldHdvcmsAZGV2c19pbWdfc3RyaWR4X29rAGRldnNfZ2NfYWRkX2NodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABvdmVybGFwc1dpdGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGJ5dGVMZW5ndGgAd2lkdGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaABkZXZzX3N0cmluZ19maW5pc2gAISB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAcCA8IGNoAHNoaWZ0X21zZwBzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAGNhbid0IHBvbmcAc2V0dGluZwBnZXR0aW5nAGJvZHkgbWlzc2luZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c19zdHJpbmdfdnNwcmludGYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAeV9vZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAGluZGV4T2YAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAc3ogPT0gcy0+aW5uZXIuc2l6ZQBzdGF0ZS5vZmYgKyAzIDw9IHNpemUAYSBwcmltaXRpdmUAZGV2c19sZWF2ZQB0cnVlAGV4cGFuZF9rZXlfdmFsdWUAcHJvdG9fdmFsdWUAZGV2c19tYXBsaWtlX3RvX3ZhbHVlAGpzb25fdmFsdWUAZXhwYW5kX3ZhbHVlAD92YWx1ZQB3cml0ZQBfc29ja2V0V3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGNhdXNlAGRldnNfanNvbl9wYXJzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAF9zb2NrZXRDbG9zZQB3ZWJzb2NrIHJlc3BvbnNlAF9jb21tYW5kUmVzcG9uc2UAbWdyOiBydW5uaW5nIHNldCB0byBmYWxzZQBmbGFzaF9lcmFzZQB0b0xvd2VyQ2FzZQB0b1VwcGVyQ2FzZQBkZXZzX21ha2VfY2xvc3VyZQBzcGlDb25maWd1cmUAbm8gLnByb3RvdHlwZQBpbnZhbGlkIC5wcm90b3R5cGUAbWFpbjogb3BlbmluZyBkZXBsb3kgcGlwZQBtYWluOiBjbG9zZWQgZGVwbG95IHBpcGUAY2xvbmUAaW5saW5lAGRyYXdMaW5lAGRiZzogcmVzdW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAFdTOiBjbG9zZSBmcmFtZQBwcm9wX0Z1bmN0aW9uX25hbWUAQG5hbWUAZGV2TmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAF9hbGxvY1JvbGUAZmlsbENpcmNsZQBuZXR3b3JrIG5vdCBhdmFpbGFibGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAF90d2luTWVzc2FnZQBpbWFnZQBkcmF3SW1hZ2UAZHJhd1RyYW5zcGFyZW50SW1hZ2UAc3BpU2VuZEltYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1vZGUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAc2V0TW9kZQBldmVudENvZGUAZnJvbUNoYXJDb2RlAHJlZ0NvZGUAaW1nX3N0cmlkZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAamRpZjogYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGhvc3Qgb3IgcG9ydCBpbnZhbGlkAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAHJvbGUgbmFtZSAnJXMnIGFscmVhZHkgdXNlZAB0cmFuc3Bvc2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXUgcGFja2V0cyB0aHJvdHRsZWQAJXMgY2FsbGVkAGRldk5ldHdvcmsgZW5hYmxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAGludmFsaWQgZGltZW5zaW9ucyAlZHglZHglZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAaW52YWxpZCBvZmZzZXQgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABHUElPOiAlcyglZCkgc2V0IHRvICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABqZGlmOiBjcmVhdGUgcm9sZSAnJXMnIC0+ICVkAFdTOiBoZWFkZXJzIGRvbmU7ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbXBsX3NvY2tldC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9pbXBsX2RzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd2Vic29ja19jb25uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvaW1wbF9pbWFnZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L2ltcGxfcGFja2V0c3BlYy5jAGRldmljZXNjcmlwdC9pbXBsX3NlcnZpY2VzcGVjLmMAZGV2aWNlc2NyaXB0L3V0ZjguYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAb25fZGF0YQBleHBlY3RpbmcgdG9waWMgYW5kIGRhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtSb2xlOiAlcy4lc10AW1BhY2tldFNwZWM6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtTZXJ2aWNlU3BlYzogJXNdAFtDaXJjdWxhcl0AW0J1ZmZlclsldV0gJSpwXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJSpwLi4uXQBbSW1hZ2U6ICVkeCVkICglZCBicHApXQBmbGlwWQBmbGlwWABpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABleHBlY3RpbmcgQ09OVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAb2ZmIDwgRlNUT1JfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AZXhwZWN0aW5nIEJJTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAU1BJAERJU0NPTk5FQ1RJTkcAc3ogPT0gbGVuICYmIHN6IDwgREVWU19NQVhfQVNDSUlfU1RSSU5HAG1ncjogd291bGQgcmVzdGFydCBkdWUgdG8gRENGRwAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBGTEFTSF9TSVpFADAgPD0gZGlmZiAmJiBkaWZmIDw9IEZMQVNIX1NJWkUgLSBKRF9GTEFTSF9QQUdFX1NJWkUAd3MtPm1zZ3B0ciA8PSBNQVhfTUVTU0FHRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMASTJDAD8/PwAlYyAgJXMgPT4AaW50OgBhcHA6AHdzc2s6AHV0ZjgAc2l6ZSA+IHNpemVvZihjaHVua190KSArIDEyOAB1dGYtOABjbnQgPT0gMyB8fCBjbnQgPT0gLTMAbGVuID09IGwyAGxvZzIAZGV2c19hcmdfaW1nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAV1M6IGdvdCAxMDEASFRUUC8xLjEgMTAxAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABzaXplIDwgMHhmMDAwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAaWR4ID49IDAAciA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwB3c3M6Ly8AcGlucy4APy4AJWMgIC4uLgAhICAuLi4ALABwYWNrZXQgNjRrKwAhZGV2c19pbl92bV9sb29wKGN0eCkAZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAGRldnNfaGFuZGxlX3R5cGUodikgPT0gREVWU19IQU5ETEVfVFlQRV9HQ19PQkpFQ1QgJiYgZGV2c19pc19zdHJpbmcoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBzdGF0czogJWQgb2JqZWN0cywgJWQgQiB1c2VkLCAlZCBCIGZyZWUgKCVkIEIgbWF4IGJsb2NrKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpACEgaW52YWxpZCBw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/////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGB1AACAiQEAAEH46wEL/Qoodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaFNhdmUpIE1vZHVsZS5mbGFzaFNhdmUoSEVBUFU4LnNsaWNlKHN0YXJ0LCBzdGFydCArIHNpemUpKTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoY29uc3Qgdm9pZCAqZnJhbWUsIHVuc2lnbmVkIHN6KTw6Oj57IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAoY29uc3QgY2hhciAqaG9zdG5hbWUsIGludCBwb3J0KTw6Oj57IHJldHVybiBNb2R1bGUuc29ja09wZW4oaG9zdG5hbWUsIHBvcnQpOyB9AChjb25zdCB2b2lkICpidWYsIHVuc2lnbmVkIHNpemUpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrV3JpdGUoYnVmLCBzaXplKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tDbG9zZSgpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja0lzQXZhaWxhYmxlKCk7IH0AAO2IgYAABG5hbWUB/IcB/gYADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX2xvYWQCBWFib3J0AxNlbV9zZW5kX2xhcmdlX2ZyYW1lBBNfZGV2c19wYW5pY19oYW5kbGVyBRFlbV9kZXBsb3lfaGFuZGxlcgYXZW1famRfY3J5cHRvX2dldF9yYW5kb20HDWVtX3NlbmRfZnJhbWUIBGV4aXQJC2VtX3RpbWVfbm93Cg5lbV9wcmludF9kbWVzZwsPX2pkX3RjcHNvY2tfbmV3DBFfamRfdGNwc29ja193cml0ZQ0RX2pkX3RjcHNvY2tfY2xvc2UOGF9qZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZQ8PX193YXNpX2ZkX2Nsb3NlEBVlbXNjcmlwdGVuX21lbWNweV9iaWcRD19fd2FzaV9mZF93cml0ZRIWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBMabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsUEV9fd2FzbV9jYWxsX2N0b3JzFQ9mbGFzaF9iYXNlX2FkZHIWDWZsYXNoX3Byb2dyYW0XC2ZsYXNoX2VyYXNlGApmbGFzaF9zeW5jGQpmbGFzaF9pbml0Gghod19wYW5pYxsIamRfYmxpbmscB2pkX2dsb3cdFGpkX2FsbG9jX3N0YWNrX2NoZWNrHghqZF9hbGxvYx8HamRfZnJlZSANdGFyZ2V0X2luX2lycSESdGFyZ2V0X2Rpc2FibGVfaXJxIhF0YXJnZXRfZW5hYmxlX2lycSMYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJBVkZXZzX3NlbmRfbGFyZ2VfZnJhbWUlEmRldnNfcGFuaWNfaGFuZGxlciYTZGV2c19kZXBsb3lfaGFuZGxlcicUamRfY3J5cHRvX2dldF9yYW5kb20oEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0UamRfZW1fZnJhbWVfcmVjZWl2ZWQuEWpkX2VtX2RldnNfZGVwbG95LxFqZF9lbV9kZXZzX3ZlcmlmeTAYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MRtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUPYXBwX3ByaW50X2RtZXNnNhJqZF90Y3Bzb2NrX3Byb2Nlc3M3EWFwcF9pbml0X3NlcnZpY2VzOBJkZXZzX2NsaWVudF9kZXBsb3k5FGNsaWVudF9ldmVudF9oYW5kbGVyOglhcHBfZG1lc2c7C2ZsdXNoX2RtZXNnPAthcHBfcHJvY2Vzcz0OamRfdGNwc29ja19uZXc+EGpkX3RjcHNvY2tfd3JpdGU/EGpkX3RjcHNvY2tfY2xvc2VAF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlQRZqZF9lbV90Y3Bzb2NrX29uX2V2ZW50Qgd0eF9pbml0Qw9qZF9wYWNrZXRfcmVhZHlECnR4X3Byb2Nlc3NFDXR4X3NlbmRfZnJhbWVGDmRldnNfYnVmZmVyX29wRxJkZXZzX2J1ZmZlcl9kZWNvZGVIEmRldnNfYnVmZmVyX2VuY29kZUkPZGV2c19jcmVhdGVfY3R4SglzZXR1cF9jdHhLCmRldnNfdHJhY2VMD2RldnNfZXJyb3JfY29kZU0ZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlck4JY2xlYXJfY3R4Tw1kZXZzX2ZyZWVfY3R4UAhkZXZzX29vbVEJZGV2c19mcmVlUhFkZXZzY2xvdWRfcHJvY2Vzc1MXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRUEGRldnNjbG91ZF91cGxvYWRVFGRldnNjbG91ZF9vbl9tZXNzYWdlVg5kZXZzY2xvdWRfaW5pdFcUZGV2c190cmFja19leGNlcHRpb25YD2RldnNkYmdfcHJvY2Vzc1kRZGV2c2RiZ19yZXN0YXJ0ZWRaFWRldnNkYmdfaGFuZGxlX3BhY2tldFsLc2VuZF92YWx1ZXNcEXZhbHVlX2Zyb21fdGFnX3YwXRlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXg1vYmpfZ2V0X3Byb3BzXwxleHBhbmRfdmFsdWVgEmRldnNkYmdfc3VzcGVuZF9jYmEMZGV2c2RiZ19pbml0YhBleHBhbmRfa2V5X3ZhbHVlYwZrdl9hZGRkD2RldnNtZ3JfcHJvY2Vzc2UHdHJ5X3J1bmYHcnVuX2ltZ2cMc3RvcF9wcm9ncmFtaA9kZXZzbWdyX3Jlc3RhcnRpFGRldnNtZ3JfZGVwbG95X3N0YXJ0ahRkZXZzbWdyX2RlcGxveV93cml0ZWsQZGV2c21ncl9nZXRfaGFzaGwVZGV2c21ncl9oYW5kbGVfcGFja2V0bQ5kZXBsb3lfaGFuZGxlcm4TZGVwbG95X21ldGFfaGFuZGxlcm8PZGV2c21ncl9nZXRfY3R4cA5kZXZzbWdyX2RlcGxveXEMZGV2c21ncl9pbml0chFkZXZzbWdyX2NsaWVudF9ldnMWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHQYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udQpkZXZzX3BhbmljdhhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV3EGRldnNfZmliZXJfc2xlZXB4G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHkaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN6EWRldnNfaW1nX2Z1bl9uYW1lexFkZXZzX2ZpYmVyX2J5X3RhZ3wQZGV2c19maWJlcl9zdGFydH0UZGV2c19maWJlcl90ZXJtaWFudGV+DmRldnNfZmliZXJfcnVufxNkZXZzX2ZpYmVyX3N5bmNfbm93gAEVX2RldnNfaW52YWxpZF9wcm9ncmFtgQEYZGV2c19maWJlcl9nZXRfbWF4X3NsZWVwggEPZGV2c19maWJlcl9wb2tlgwERZGV2c19nY19hZGRfY2h1bmuEARZkZXZzX2djX29ial9jaGVja19jb3JlhQETamRfZ2NfYW55X3RyeV9hbGxvY4YBB2RldnNfZ2OHAQ9maW5kX2ZyZWVfYmxvY2uIARJkZXZzX2FueV90cnlfYWxsb2OJAQ5kZXZzX3RyeV9hbGxvY4oBC2pkX2djX3VucGluiwEKamRfZ2NfZnJlZYwBFGRldnNfdmFsdWVfaXNfcGlubmVkjQEOZGV2c192YWx1ZV9waW6OARBkZXZzX3ZhbHVlX3VucGlujwESZGV2c19tYXBfdHJ5X2FsbG9jkAEYZGV2c19zaG9ydF9tYXBfdHJ5X2FsbG9jkQEUZGV2c19hcnJheV90cnlfYWxsb2OSARpkZXZzX2J1ZmZlcl90cnlfYWxsb2NfaW5pdJMBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5QBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5UBEGRldnNfc3RyaW5nX3ByZXCWARJkZXZzX3N0cmluZ19maW5pc2iXARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdJgBD2RldnNfZ2Nfc2V0X2N0eJkBDmRldnNfZ2NfY3JlYXRlmgEPZGV2c19nY19kZXN0cm95mwERZGV2c19nY19vYmpfY2hlY2ucAQ5kZXZzX2R1bXBfaGVhcJ0BC3NjYW5fZ2Nfb2JqngERcHJvcF9BcnJheV9sZW5ndGifARJtZXRoMl9BcnJheV9pbnNlcnSgARJmdW4xX0FycmF5X2lzQXJyYXmhARBtZXRoWF9BcnJheV9wdXNoogEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlowERbWV0aFhfQXJyYXlfc2xpY2WkARBtZXRoMV9BcnJheV9qb2lupQERZnVuMV9CdWZmZXJfYWxsb2OmARBmdW4xX0J1ZmZlcl9mcm9tpwEScHJvcF9CdWZmZXJfbGVuZ3RoqAEVbWV0aDFfQnVmZmVyX3RvU3RyaW5nqQETbWV0aDNfQnVmZmVyX2ZpbGxBdKoBE21ldGg0X0J1ZmZlcl9ibGl0QXSrARRtZXRoM19CdWZmZXJfaW5kZXhPZqwBFGRldnNfY29tcHV0ZV90aW1lb3V0rQEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXCuARdmdW4xX0RldmljZVNjcmlwdF9kZWxhea8BGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY7ABGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdLEBGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnSyARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSzARdmdW4yX0RldmljZVNjcmlwdF9wcmludLQBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXS1ARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLYBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXBytwEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme4ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO5ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVyugEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmS7ARxmdW4yX0RldmljZVNjcmlwdF9fYWxsb2NSb2xlvAEgZnVuMF9EZXZpY2VTY3JpcHRfbm90SW1wbGVtZW50ZWS9AR5mdW4yX0RldmljZVNjcmlwdF9fdHdpbk1lc3NhZ2W+ASFmdW4zX0RldmljZVNjcmlwdF9faTJjVHJhbnNhY3Rpb26/AR5mdW41X0RldmljZVNjcmlwdF9zcGlDb25maWd1cmXAARlmdW4yX0RldmljZVNjcmlwdF9zcGlYZmVywQEeZnVuM19EZXZpY2VTY3JpcHRfc3BpU2VuZEltYWdlwgEUbWV0aDFfRXJyb3JfX19jdG9yX1/DARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fxAEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fxQEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1/GAQ9wcm9wX0Vycm9yX25hbWXHARFtZXRoMF9FcnJvcl9wcmludMgBD3Byb3BfRHNGaWJlcl9pZMkBFnByb3BfRHNGaWJlcl9zdXNwZW5kZWTKARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZcsBF21ldGgwX0RzRmliZXJfdGVybWluYXRlzAEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZM0BEWZ1bjBfRHNGaWJlcl9zZWxmzgEUbWV0aFhfRnVuY3Rpb25fc3RhcnTPARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZdABEnByb3BfRnVuY3Rpb25fbmFtZdEBE2RldnNfZ3Bpb19pbml0X2RjZmfSAQ5wcm9wX0dQSU9fbW9kZdMBDmluaXRfcGluX3N0YXRl1AEWcHJvcF9HUElPX2NhcGFiaWxpdGllc9UBD3Byb3BfR1BJT192YWx1ZdYBEm1ldGgxX0dQSU9fc2V0TW9kZdcBFmZ1bjFfRGV2aWNlU2NyaXB0X2dwaW/YARBwcm9wX0ltYWdlX3dpZHRo2QERcHJvcF9JbWFnZV9oZWlnaHTaAQ5wcm9wX0ltYWdlX2JwcNsBEXByb3BfSW1hZ2VfYnVmZmVy3AEQZnVuNV9JbWFnZV9hbGxvY90BD21ldGgzX0ltYWdlX3NldN4BDGRldnNfYXJnX2ltZ98BB3NldENvcmXgAQ9tZXRoMl9JbWFnZV9nZXThARBtZXRoMV9JbWFnZV9maWxs4gEJZmlsbF9yZWN04wEUbWV0aDVfSW1hZ2VfZmlsbFJlY3TkARJtZXRoMV9JbWFnZV9lcXVhbHPlARFtZXRoMF9JbWFnZV9jbG9uZeYBDWFsbG9jX2ltZ19yZXTnARFtZXRoMF9JbWFnZV9mbGlwWOgBB3BpeF9wdHLpARFtZXRoMF9JbWFnZV9mbGlwWeoBFm1ldGgwX0ltYWdlX3RyYW5zcG9zZWTrARVtZXRoM19JbWFnZV9kcmF3SW1hZ2XsAQ1kZXZzX2FyZ19pbWcy7QENZHJhd0ltYWdlQ29yZe4BIG1ldGg0X0ltYWdlX2RyYXdUcmFuc3BhcmVudEltYWdl7wEYbWV0aDNfSW1hZ2Vfb3ZlcmxhcHNXaXRo8AEUbWV0aDVfSW1hZ2VfZHJhd0xpbmXxAQhkcmF3TGluZfIBE21ha2Vfd3JpdGFibGVfaW1hZ2XzAQtkcmF3TGluZUxvd/QBDGRyYXdMaW5lSGlnaPUBE21ldGg1X0ltYWdlX2JsaXRSb3f2ARFtZXRoMTFfSW1hZ2VfYmxpdPcBFm1ldGg0X0ltYWdlX2ZpbGxDaXJjbGX4AQ9mdW4yX0pTT05fcGFyc2X5ARNmdW4zX0pTT05fc3RyaW5naWZ5+gEOZnVuMV9NYXRoX2NlaWz7AQ9mdW4xX01hdGhfZmxvb3L8AQ9mdW4xX01hdGhfcm91bmT9AQ1mdW4xX01hdGhfYWJz/gEQZnVuMF9NYXRoX3JhbmRvbf8BE2Z1bjFfTWF0aF9yYW5kb21JbnSAAg1mdW4xX01hdGhfbG9ngQINZnVuMl9NYXRoX3Bvd4ICDmZ1bjJfTWF0aF9pZGl2gwIOZnVuMl9NYXRoX2ltb2SEAg5mdW4yX01hdGhfaW11bIUCDWZ1bjJfTWF0aF9taW6GAgtmdW4yX21pbm1heIcCDWZ1bjJfTWF0aF9tYXiIAhJmdW4yX09iamVjdF9hc3NpZ26JAhBmdW4xX09iamVjdF9rZXlzigITZnVuMV9rZXlzX29yX3ZhbHVlc4sCEmZ1bjFfT2JqZWN0X3ZhbHVlc4wCGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9mjQIdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3eOAhJwcm9wX0RzUGFja2V0X3JvbGWPAh5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXKQAhVwcm9wX0RzUGFja2V0X3Nob3J0SWSRAhpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleJICHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmSTAhNwcm9wX0RzUGFja2V0X2ZsYWdzlAIXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmSVAhZwcm9wX0RzUGFja2V0X2lzUmVwb3J0lgIVcHJvcF9Ec1BhY2tldF9wYXlsb2FklwIVcHJvcF9Ec1BhY2tldF9pc0V2ZW50mAIXcHJvcF9Ec1BhY2tldF9ldmVudENvZGWZAhZwcm9wX0RzUGFja2V0X2lzUmVnU2V0mgIWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldJsCFXByb3BfRHNQYWNrZXRfcmVnQ29kZZwCFnByb3BfRHNQYWNrZXRfaXNBY3Rpb26dAhVkZXZzX3BrdF9zcGVjX2J5X2NvZGWeAhJwcm9wX0RzUGFja2V0X3NwZWOfAhFkZXZzX3BrdF9nZXRfc3BlY6ACFW1ldGgwX0RzUGFja2V0X2RlY29kZaECHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVkogIYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW50owIWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZaQCFnByb3BfRHNQYWNrZXRTcGVjX2NvZGWlAhpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZaYCGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGWnAhJkZXZzX3BhY2tldF9kZWNvZGWoAhVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWSpAhREc1JlZ2lzdGVyX3JlYWRfY29udKoCEmRldnNfcGFja2V0X2VuY29kZasCFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGWsAhZwcm9wX0RzUGFja2V0SW5mb19yb2xlrQIWcHJvcF9Ec1BhY2tldEluZm9fbmFtZa4CFnByb3BfRHNQYWNrZXRJbmZvX2NvZGWvAhhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1+wAhNwcm9wX0RzUm9sZV9pc0JvdW5ksQIQcHJvcF9Ec1JvbGVfc3BlY7ICGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZLMCInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXK0Ahdwcm9wX0RzU2VydmljZVNwZWNfbmFtZbUCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwtgIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ263Ah1mdW4yX0RldmljZVNjcmlwdF9fc29ja2V0T3BlbrgCEHRjcHNvY2tfb25fZXZlbnS5Ah5mdW4wX0RldmljZVNjcmlwdF9fc29ja2V0Q2xvc2W6Ah5mdW4xX0RldmljZVNjcmlwdF9fc29ja2V0V3JpdGW7AhJwcm9wX1N0cmluZ19sZW5ndGi8AhZwcm9wX1N0cmluZ19ieXRlTGVuZ3RovQIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXS+AhNtZXRoMV9TdHJpbmdfY2hhckF0vwISbWV0aDJfU3RyaW5nX3NsaWNlwAIYZnVuWF9TdHJpbmdfZnJvbUNoYXJDb2RlwQIUbWV0aDNfU3RyaW5nX2luZGV4T2bCAhhtZXRoMF9TdHJpbmdfdG9Mb3dlckNhc2XDAhNtZXRoMF9TdHJpbmdfdG9DYXNlxAIYbWV0aDBfU3RyaW5nX3RvVXBwZXJDYXNlxQIMZGV2c19pbnNwZWN0xgILaW5zcGVjdF9vYmrHAgdhZGRfc3RyyAINaW5zcGVjdF9maWVsZMkCFGRldnNfamRfZ2V0X3JlZ2lzdGVyygIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZMsCEGRldnNfamRfc2VuZF9jbWTMAhBkZXZzX2pkX3NlbmRfcmF3zQITZGV2c19qZF9zZW5kX2xvZ21zZ84CE2RldnNfamRfcGt0X2NhcHR1cmXPAhFkZXZzX2pkX3dha2Vfcm9sZdACEmRldnNfamRfc2hvdWxkX3J1btECE2RldnNfamRfcHJvY2Vzc19wa3TSAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWTTAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdQCEmRldnNfamRfYWZ0ZXJfdXNlctUCFGRldnNfamRfcm9sZV9jaGFuZ2Vk1gIUZGV2c19qZF9yZXNldF9wYWNrZXTXAhJkZXZzX2pkX2luaXRfcm9sZXPYAhJkZXZzX2pkX2ZyZWVfcm9sZXPZAhJkZXZzX2pkX2FsbG9jX3JvbGXaAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3PbAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc9wCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc90CD2pkX25lZWRfdG9fc2VuZN4CEGRldnNfanNvbl9lc2NhcGXfAhVkZXZzX2pzb25fZXNjYXBlX2NvcmXgAg9kZXZzX2pzb25fcGFyc2XhAgpqc29uX3ZhbHVl4gIMcGFyc2Vfc3RyaW5n4wITZGV2c19qc29uX3N0cmluZ2lmeeQCDXN0cmluZ2lmeV9vYmrlAhFwYXJzZV9zdHJpbmdfY29yZeYCCmFkZF9pbmRlbnTnAg9zdHJpbmdpZnlfZmllbGToAhFkZXZzX21hcGxpa2VfaXRlcukCF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN06gISZGV2c19tYXBfY29weV9pbnRv6wIMZGV2c19tYXBfc2V07AIGbG9va3Vw7QITZGV2c19tYXBsaWtlX2lzX21hcO4CG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc+8CEWRldnNfYXJyYXlfaW5zZXJ08AIIa3ZfYWRkLjHxAhJkZXZzX3Nob3J0X21hcF9zZXTyAg9kZXZzX21hcF9kZWxldGXzAhJkZXZzX3Nob3J0X21hcF9nZXT0AiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkePUCHGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWP2AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWP3Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHj4AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY/kCF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0+gIYZGV2c19yb2xlX3NwZWNfZm9yX2NsYXNz+wIXZGV2c19wYWNrZXRfc3BlY19wYXJlbnT8Ag5kZXZzX3JvbGVfc3BlY/0CEWRldnNfcm9sZV9zZXJ2aWNl/gIOZGV2c19yb2xlX25hbWX/AhJkZXZzX2dldF9iYXNlX3NwZWOAAxBkZXZzX3NwZWNfbG9va3VwgQMSZGV2c19mdW5jdGlvbl9iaW5kggMRZGV2c19tYWtlX2Nsb3N1cmWDAw5kZXZzX2dldF9mbmlkeIQDE2RldnNfZ2V0X2ZuaWR4X2NvcmWFAxhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSGAxhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSHAxNkZXZzX2dldF9zcGVjX3Byb3RviAMTZGV2c19nZXRfcm9sZV9wcm90b4kDG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd4oDFWRldnNfZ2V0X3N0YXRpY19wcm90b4sDG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb4wDHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtjQMWZGV2c19tYXBsaWtlX2dldF9wcm90b44DGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZI8DHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZJADEGRldnNfaW5zdGFuY2Vfb2aRAw9kZXZzX29iamVjdF9nZXSSAwxkZXZzX3NlcV9nZXSTAwxkZXZzX2FueV9nZXSUAwxkZXZzX2FueV9zZXSVAwxkZXZzX3NlcV9zZXSWAw5kZXZzX2FycmF5X3NldJcDE2RldnNfYXJyYXlfcGluX3B1c2iYAxFkZXZzX2FyZ19pbnRfZGVmbJkDDGRldnNfYXJnX2ludJoDDWRldnNfYXJnX2Jvb2ybAw9kZXZzX2FyZ19kb3VibGWcAw9kZXZzX3JldF9kb3VibGWdAwxkZXZzX3JldF9pbnSeAw1kZXZzX3JldF9ib29snwMPZGV2c19yZXRfZ2NfcHRyoAMRZGV2c19hcmdfc2VsZl9tYXChAxFkZXZzX3NldHVwX3Jlc3VtZaIDD2RldnNfY2FuX2F0dGFjaKMDGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWWkAxVkZXZzX21hcGxpa2VfdG9fdmFsdWWlAxJkZXZzX3JlZ2NhY2hlX2ZyZWWmAxZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxspwMXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWSoAxNkZXZzX3JlZ2NhY2hlX2FsbG9jqQMUZGV2c19yZWdjYWNoZV9sb29rdXCqAxFkZXZzX3JlZ2NhY2hlX2FnZasDF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlrAMSZGV2c19yZWdjYWNoZV9uZXh0rQMPamRfc2V0dGluZ3NfZ2V0rgMPamRfc2V0dGluZ3Nfc2V0rwMOZGV2c19sb2dfdmFsdWWwAw9kZXZzX3Nob3dfdmFsdWWxAxBkZXZzX3Nob3dfdmFsdWUwsgMNY29uc3VtZV9jaHVua7MDDXNoYV8yNTZfY2xvc2W0Aw9qZF9zaGEyNTZfc2V0dXC1AxBqZF9zaGEyNTZfdXBkYXRltgMQamRfc2hhMjU2X2ZpbmlzaLcDFGpkX3NoYTI1Nl9obWFjX3NldHVwuAMVamRfc2hhMjU2X2htYWNfZmluaXNouQMOamRfc2hhMjU2X2hrZGa6Aw5kZXZzX3N0cmZvcm1hdLsDDmRldnNfaXNfc3RyaW5nvAMOZGV2c19pc19udW1iZXK9AxtkZXZzX3N0cmluZ19nZXRfdXRmOF9zdHJ1Y3S+AxRkZXZzX3N0cmluZ19nZXRfdXRmOL8DE2RldnNfYnVpbHRpbl9zdHJpbmfAAxRkZXZzX3N0cmluZ192c3ByaW50ZsEDE2RldnNfc3RyaW5nX3NwcmludGbCAxVkZXZzX3N0cmluZ19mcm9tX3V0ZjjDAxRkZXZzX3ZhbHVlX3RvX3N0cmluZ8QDEGJ1ZmZlcl90b19zdHJpbmfFAxlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxkxgMSZGV2c19zdHJpbmdfY29uY2F0xwMRZGV2c19zdHJpbmdfc2xpY2XIAxJkZXZzX3B1c2hfdHJ5ZnJhbWXJAxFkZXZzX3BvcF90cnlmcmFtZcoDD2RldnNfZHVtcF9zdGFja8sDE2RldnNfZHVtcF9leGNlcHRpb27MAwpkZXZzX3Rocm93zQMSZGV2c19wcm9jZXNzX3Rocm93zgMQZGV2c19hbGxvY19lcnJvcs8DFWRldnNfdGhyb3dfdHlwZV9lcnJvctADGGRldnNfdGhyb3dfZ2VuZXJpY19lcnJvctEDFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LSAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LTAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvctQDHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dNUDGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvctYDF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y1wMRZGV2c19zdHJpbmdfaW5kZXjYAxJkZXZzX3N0cmluZ19sZW5ndGjZAxlkZXZzX3V0ZjhfZnJvbV9jb2RlX3BvaW502gMbZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3Ro2wMUZGV2c191dGY4X2NvZGVfcG9pbnTcAxRkZXZzX3N0cmluZ19qbXBfaW5pdN0DDmRldnNfdXRmOF9pbml03gMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZd8DE2RldnNfdmFsdWVfZnJvbV9pbnTgAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbOEDF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy4gMUZGV2c192YWx1ZV90b19kb3VibGXjAxFkZXZzX3ZhbHVlX3RvX2ludOQDEmRldnNfdmFsdWVfdG9fYm9vbOUDDmRldnNfaXNfYnVmZmVy5gMXZGV2c19idWZmZXJfaXNfd3JpdGFibGXnAxBkZXZzX2J1ZmZlcl9kYXRh6AMTZGV2c19idWZmZXJpc2hfZGF0YekDFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq6gMNZGV2c19pc19hcnJheesDEWRldnNfdmFsdWVfdHlwZW9m7AMPZGV2c19pc19udWxsaXNo7QMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZO4DFGRldnNfdmFsdWVfYXBwcm94X2Vx7wMSZGV2c192YWx1ZV9pZWVlX2Vx8AMNZGV2c192YWx1ZV9lcfEDHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbmfyAx5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGPzAxJkZXZzX2ltZ19zdHJpZHhfb2v0AxJkZXZzX2R1bXBfdmVyc2lvbnP1AwtkZXZzX3ZlcmlmefYDEWRldnNfZmV0Y2hfb3Bjb2Rl9wMOZGV2c192bV9yZXN1bWX4AxFkZXZzX3ZtX3NldF9kZWJ1Z/kDGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHP6AxhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnT7AwxkZXZzX3ZtX2hhbHT8Aw9kZXZzX3ZtX3N1c3BlbmT9AxZkZXZzX3ZtX3NldF9icmVha3BvaW50/gMUZGV2c192bV9leGVjX29wY29kZXP/Aw9kZXZzX2luX3ZtX2xvb3CABBpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIEEF2RldnNfaW1nX2dldF9zdHJpbmdfam1wggQRZGV2c19pbWdfZ2V0X3V0ZjiDBBRkZXZzX2dldF9zdGF0aWNfdXRmOIQEFGRldnNfdmFsdWVfYnVmZmVyaXNohQQMZXhwcl9pbnZhbGlkhgQUZXhwcnhfYnVpbHRpbl9vYmplY3SHBAtzdG10MV9jYWxsMIgEC3N0bXQyX2NhbGwxiQQLc3RtdDNfY2FsbDKKBAtzdG10NF9jYWxsM4sEC3N0bXQ1X2NhbGw0jAQLc3RtdDZfY2FsbDWNBAtzdG10N19jYWxsNo4EC3N0bXQ4X2NhbGw3jwQLc3RtdDlfY2FsbDiQBBJzdG10Ml9pbmRleF9kZWxldGWRBAxzdG10MV9yZXR1cm6SBAlzdG10eF9qbXCTBAxzdG10eDFfam1wX3qUBApleHByMl9iaW5klQQSZXhwcnhfb2JqZWN0X2ZpZWxklgQSc3RtdHgxX3N0b3JlX2xvY2FslwQTc3RtdHgxX3N0b3JlX2dsb2JhbJgEEnN0bXQ0X3N0b3JlX2J1ZmZlcpkECWV4cHIwX2luZpoEEGV4cHJ4X2xvYWRfbG9jYWybBBFleHByeF9sb2FkX2dsb2JhbJwEC2V4cHIxX3VwbHVznQQLZXhwcjJfaW5kZXieBA9zdG10M19pbmRleF9zZXSfBBRleHByeDFfYnVpbHRpbl9maWVsZKAEEmV4cHJ4MV9hc2NpaV9maWVsZKEEEWV4cHJ4MV91dGY4X2ZpZWxkogQQZXhwcnhfbWF0aF9maWVsZKMEDmV4cHJ4X2RzX2ZpZWxkpAQPc3RtdDBfYWxsb2NfbWFwpQQRc3RtdDFfYWxsb2NfYXJyYXmmBBJzdG10MV9hbGxvY19idWZmZXKnBBdleHByeF9zdGF0aWNfc3BlY19wcm90b6gEE2V4cHJ4X3N0YXRpY19idWZmZXKpBBtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmeqBBlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nqwQYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nrAQVZXhwcnhfc3RhdGljX2Z1bmN0aW9urQQNZXhwcnhfbGl0ZXJhbK4EEWV4cHJ4X2xpdGVyYWxfZjY0rwQRZXhwcjNfbG9hZF9idWZmZXKwBA1leHByMF9yZXRfdmFssQQMZXhwcjFfdHlwZW9msgQPZXhwcjBfdW5kZWZpbmVkswQSZXhwcjFfaXNfdW5kZWZpbmVktAQKZXhwcjBfdHJ1ZbUEC2V4cHIwX2ZhbHNltgQNZXhwcjFfdG9fYm9vbLcECWV4cHIwX25hbrgECWV4cHIxX2Fic7kEDWV4cHIxX2JpdF9ub3S6BAxleHByMV9pc19uYW67BAlleHByMV9uZWe8BAlleHByMV9ub3S9BAxleHByMV90b19pbnS+BAlleHByMl9hZGS/BAlleHByMl9zdWLABAlleHByMl9tdWzBBAlleHByMl9kaXbCBA1leHByMl9iaXRfYW5kwwQMZXhwcjJfYml0X29yxAQNZXhwcjJfYml0X3hvcsUEEGV4cHIyX3NoaWZ0X2xlZnTGBBFleHByMl9zaGlmdF9yaWdodMcEGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkyAQIZXhwcjJfZXHJBAhleHByMl9sZcoECGV4cHIyX2x0ywQIZXhwcjJfbmXMBBBleHByMV9pc19udWxsaXNozQQUc3RtdHgyX3N0b3JlX2Nsb3N1cmXOBBNleHByeDFfbG9hZF9jbG9zdXJlzwQSZXhwcnhfbWFrZV9jbG9zdXJl0AQQZXhwcjFfdHlwZW9mX3N0ctEEE3N0bXR4X2ptcF9yZXRfdmFsX3rSBBBzdG10Ml9jYWxsX2FycmF50wQJc3RtdHhfdHJ51AQNc3RtdHhfZW5kX3RyedUEC3N0bXQwX2NhdGNo1gQNc3RtdDBfZmluYWxsedcEC3N0bXQxX3Rocm932AQOc3RtdDFfcmVfdGhyb3fZBBBzdG10eDFfdGhyb3dfam1w2gQOc3RtdDBfZGVidWdnZXLbBAlleHByMV9uZXfcBBFleHByMl9pbnN0YW5jZV9vZt0ECmV4cHIwX251bGzeBA9leHByMl9hcHByb3hfZXHfBA9leHByMl9hcHByb3hfbmXgBBNzdG10MV9zdG9yZV9yZXRfdmFs4QQRZXhwcnhfc3RhdGljX3NwZWPiBA9kZXZzX3ZtX3BvcF9hcmfjBBNkZXZzX3ZtX3BvcF9hcmdfdTMy5AQTZGV2c192bV9wb3BfYXJnX2kzMuUEFmRldnNfdm1fcG9wX2FyZ19idWZmZXLmBBJqZF9hZXNfY2NtX2VuY3J5cHTnBBJqZF9hZXNfY2NtX2RlY3J5cHToBAxBRVNfaW5pdF9jdHjpBA9BRVNfRUNCX2VuY3J5cHTqBBBqZF9hZXNfc2V0dXBfa2V56wQOamRfYWVzX2VuY3J5cHTsBBBqZF9hZXNfY2xlYXJfa2V57QQOamRfd2Vic29ja19uZXfuBBdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZe8EDHNlbmRfbWVzc2FnZfAEE2pkX3RjcHNvY2tfb25fZXZlbnTxBAdvbl9kYXRh8gQLcmFpc2VfZXJyb3LzBAlzaGlmdF9tc2f0BBBqZF93ZWJzb2NrX2Nsb3Nl9QQLamRfd3Nza19uZXf2BBRqZF93c3NrX3NlbmRfbWVzc2FnZfcEE2pkX3dlYnNvY2tfb25fZXZlbnT4BAdkZWNyeXB0+QQNamRfd3Nza19jbG9zZfoEEGpkX3dzc2tfb25fZXZlbnT7BAtyZXNwX3N0YXR1c/wEEndzc2toZWFsdGhfcHJvY2Vzc/0EFHdzc2toZWFsdGhfcmVjb25uZWN0/gQYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0/wQPc2V0X2Nvbm5fc3RyaW5ngAURY2xlYXJfY29ubl9zdHJpbmeBBQ93c3NraGVhbHRoX2luaXSCBRF3c3NrX3NlbmRfbWVzc2FnZYMFEXdzc2tfaXNfY29ubmVjdGVkhAUUd3Nza190cmFja19leGNlcHRpb26FBRJ3c3NrX3NlcnZpY2VfcXVlcnmGBRxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplhwUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZYgFD3JvbGVtZ3JfcHJvY2Vzc4kFEHJvbGVtZ3JfYXV0b2JpbmSKBRVyb2xlbWdyX2hhbmRsZV9wYWNrZXSLBRRqZF9yb2xlX21hbmFnZXJfaW5pdIwFGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZI0FEWpkX3JvbGVfc2V0X2hpbnRzjgUNamRfcm9sZV9hbGxvY48FEGpkX3JvbGVfZnJlZV9hbGyQBRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kkQUTamRfY2xpZW50X2xvZ19ldmVudJIFE2pkX2NsaWVudF9zdWJzY3JpYmWTBRRqZF9jbGllbnRfZW1pdF9ldmVudJQFFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VklQUQamRfZGV2aWNlX2xvb2t1cJYFGGpkX2RldmljZV9sb29rdXBfc2VydmljZZcFE2pkX3NlcnZpY2Vfc2VuZF9jbWSYBRFqZF9jbGllbnRfcHJvY2Vzc5kFDmpkX2RldmljZV9mcmVlmgUXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSbBQ9qZF9kZXZpY2VfYWxsb2OcBRBzZXR0aW5nc19wcm9jZXNznQUWc2V0dGluZ3NfaGFuZGxlX3BhY2tldJ4FDXNldHRpbmdzX2luaXSfBQ50YXJnZXRfc3RhbmRieaAFD2pkX2N0cmxfcHJvY2Vzc6EFFWpkX2N0cmxfaGFuZGxlX3BhY2tldKIFDGpkX2N0cmxfaW5pdKMFFGRjZmdfc2V0X3VzZXJfY29uZmlnpAUJZGNmZ19pbml0pQUNZGNmZ192YWxpZGF0ZaYFDmRjZmdfZ2V0X2VudHJ5pwUTZGNmZ19nZXRfbmV4dF9lbnRyeagFDGRjZmdfZ2V0X2kzMqkFDGRjZmdfZ2V0X3UzMqoFD2RjZmdfZ2V0X3N0cmluZ6sFDGRjZmdfaWR4X2tleawFCWpkX3ZkbWVzZ60FEWpkX2RtZXNnX3N0YXJ0cHRyrgUNamRfZG1lc2dfcmVhZK8FEmpkX2RtZXNnX3JlYWRfbGluZbAFE2pkX3NldHRpbmdzX2dldF9iaW6xBQpmaW5kX2VudHJ5sgUPcmVjb21wdXRlX2NhY2hlswUTamRfc2V0dGluZ3Nfc2V0X2JpbrQFC2pkX2ZzdG9yX2djtQUVamRfc2V0dGluZ3NfZ2V0X2xhcmdltgUWamRfc2V0dGluZ3NfcHJlcF9sYXJnZbcFF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdluAUWamRfc2V0dGluZ3Nfc3luY19sYXJnZbkFEGpkX3NldF9tYXhfc2xlZXC6BQ1qZF9pcGlwZV9vcGVuuwUWamRfaXBpcGVfaGFuZGxlX3BhY2tldLwFDmpkX2lwaXBlX2Nsb3NlvQUSamRfbnVtZm10X2lzX3ZhbGlkvgUVamRfbnVtZm10X3dyaXRlX2Zsb2F0vwUTamRfbnVtZm10X3dyaXRlX2kzMsAFEmpkX251bWZtdF9yZWFkX2kzMsEFFGpkX251bWZtdF9yZWFkX2Zsb2F0wgURamRfb3BpcGVfb3Blbl9jbWTDBRRqZF9vcGlwZV9vcGVuX3JlcG9ydMQFFmpkX29waXBlX2hhbmRsZV9wYWNrZXTFBRFqZF9vcGlwZV93cml0ZV9leMYFEGpkX29waXBlX3Byb2Nlc3PHBRRqZF9vcGlwZV9jaGVja19zcGFjZcgFDmpkX29waXBlX3dyaXRlyQUOamRfb3BpcGVfY2xvc2XKBQ1qZF9xdWV1ZV9wdXNoywUOamRfcXVldWVfZnJvbnTMBQ5qZF9xdWV1ZV9zaGlmdM0FDmpkX3F1ZXVlX2FsbG9jzgUNamRfcmVzcG9uZF91OM8FDmpkX3Jlc3BvbmRfdTE20AUOamRfcmVzcG9uZF91MzLRBRFqZF9yZXNwb25kX3N0cmluZ9IFF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk0wULamRfc2VuZF9wa3TUBR1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbNUFF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy1gUZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldNcFFGpkX2FwcF9oYW5kbGVfcGFja2V02AUVamRfYXBwX2hhbmRsZV9jb21tYW5k2QUVYXBwX2dldF9pbnN0YW5jZV9uYW1l2gUTamRfYWxsb2NhdGVfc2VydmljZdsFEGpkX3NlcnZpY2VzX2luaXTcBQ5qZF9yZWZyZXNoX25vd90FGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTeBRRqZF9zZXJ2aWNlc19hbm5vdW5jZd8FF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l4AUQamRfc2VydmljZXNfdGlja+EFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+IFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl4wUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZeQFFGFwcF9nZXRfZGV2aWNlX2NsYXNz5QUSYXBwX2dldF9md192ZXJzaW9u5gUNamRfc3J2Y2ZnX3J1bucFF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l6AURamRfc3J2Y2ZnX3ZhcmlhbnTpBQ1qZF9oYXNoX2ZudjFh6gUMamRfZGV2aWNlX2lk6wUJamRfcmFuZG9t7AUIamRfY3JjMTbtBQ5qZF9jb21wdXRlX2NyY+4FDmpkX3NoaWZ0X2ZyYW1l7wUMamRfd29yZF9tb3Zl8AUOamRfcmVzZXRfZnJhbWXxBRBqZF9wdXNoX2luX2ZyYW1l8gUNamRfcGFuaWNfY29yZfMFE2pkX3Nob3VsZF9zYW1wbGVfbXP0BRBqZF9zaG91bGRfc2FtcGxl9QUJamRfdG9faGV49gULamRfZnJvbV9oZXj3BQ5qZF9hc3NlcnRfZmFpbPgFB2pkX2F0b2n5BQ9qZF92c3ByaW50Zl9leHT6BQ9qZF9wcmludF9kb3VibGX7BQtqZF92c3ByaW50ZvwFCmpkX3NwcmludGb9BRJqZF9kZXZpY2Vfc2hvcnRfaWT+BQxqZF9zcHJpbnRmX2H/BQtqZF90b19oZXhfYYAGCWpkX3N0cmR1cIEGCWpkX21lbWR1cIIGDGpkX2VuZHNfd2l0aIMGDmpkX3N0YXJ0c193aXRohAYWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYUGFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWGBhFqZF9zZW5kX2V2ZW50X2V4dIcGCmpkX3J4X2luaXSIBh1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4kGD2pkX3J4X2dldF9mcmFtZYoGE2pkX3J4X3JlbGVhc2VfZnJhbWWLBhFqZF9zZW5kX2ZyYW1lX3Jhd4wGDWpkX3NlbmRfZnJhbWWNBgpqZF90eF9pbml0jgYHamRfc2VuZI8GD2pkX3R4X2dldF9mcmFtZZAGEGpkX3R4X2ZyYW1lX3NlbnSRBgtqZF90eF9mbHVzaJIGEF9fZXJybm9fbG9jYXRpb26TBgxfX2ZwY2xhc3NpZnmUBgVkdW1teZUGCF9fbWVtY3B5lgYHbWVtbW92ZZcGBm1lbXNldJgGCl9fbG9ja2ZpbGWZBgxfX3VubG9ja2ZpbGWaBgZmZmx1c2ibBgRmbW9knAYNX19ET1VCTEVfQklUU50GDF9fc3RkaW9fc2Vla54GDV9fc3RkaW9fd3JpdGWfBg1fX3N0ZGlvX2Nsb3NloAYIX190b3JlYWShBglfX3Rvd3JpdGWiBglfX2Z3cml0ZXijBgZmd3JpdGWkBhRfX3B0aHJlYWRfbXV0ZXhfbG9ja6UGFl9fcHRocmVhZF9tdXRleF91bmxvY2umBgZfX2xvY2unBghfX3VubG9ja6gGDl9fbWF0aF9kaXZ6ZXJvqQYKZnBfYmFycmllcqoGDl9fbWF0aF9pbnZhbGlkqwYDbG9nrAYFdG9wMTatBgVsb2cxMK4GB19fbHNlZWuvBgZtZW1jbXCwBgpfX29mbF9sb2NrsQYMX19vZmxfdW5sb2NrsgYMX19tYXRoX3hmbG93swYMZnBfYmFycmllci4xtAYMX19tYXRoX29mbG93tQYMX19tYXRoX3VmbG93tgYEZmFic7cGA3Bvd7gGBXRvcDEyuQYKemVyb2luZm5hbroGCGNoZWNraW50uwYMZnBfYmFycmllci4yvAYKbG9nX2lubGluZb0GCmV4cF9pbmxpbmW+BgtzcGVjaWFsY2FzZb8GDWZwX2ZvcmNlX2V2YWzABgVyb3VuZMEGBnN0cmNocsIGC19fc3RyY2hybnVswwYGc3RyY21wxAYGc3RybGVuxQYGbWVtY2hyxgYGc3Ryc3RyxwYOdHdvYnl0ZV9zdHJzdHLIBhB0aHJlZWJ5dGVfc3Ryc3RyyQYPZm91cmJ5dGVfc3Ryc3RyygYNdHdvd2F5X3N0cnN0cssGB19fdWZsb3fMBgdfX3NobGltzQYIX19zaGdldGPOBgdpc3NwYWNlzwYGc2NhbGJu0AYJY29weXNpZ25s0QYHc2NhbGJubNIGDV9fZnBjbGFzc2lmeWzTBgVmbW9kbNQGBWZhYnNs1QYLX19mbG9hdHNjYW7WBghoZXhmbG9hdNcGCGRlY2Zsb2F02AYHc2NhbmV4cNkGBnN0cnRveNoGBnN0cnRvZNsGEl9fd2FzaV9zeXNjYWxsX3JldNwGCGRsbWFsbG9j3QYGZGxmcmVl3gYYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl3wYEc2Jya+AGCF9fYWRkdGYz4QYJX19hc2hsdGkz4gYHX19sZXRmMuMGB19fZ2V0ZjLkBghfX2RpdnRmM+UGDV9fZXh0ZW5kZGZ0ZjLmBg1fX2V4dGVuZHNmdGYy5wYLX19mbG9hdHNpdGboBg1fX2Zsb2F0dW5zaXRm6QYNX19mZV9nZXRyb3VuZOoGEl9fZmVfcmFpc2VfaW5leGFjdOsGCV9fbHNocnRpM+wGCF9fbXVsdGYz7QYIX19tdWx0aTPuBglfX3Bvd2lkZjLvBghfX3N1YnRmM/AGDF9fdHJ1bmN0ZmRmMvEGC3NldFRlbXBSZXQw8gYLZ2V0VGVtcFJldDDzBglzdGFja1NhdmX0BgxzdGFja1Jlc3RvcmX1BgpzdGFja0FsbG9j9gYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudPcGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdPgGGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWX5BhllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl+gYYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k+wYMZHluQ2FsbF9qaWpp/AYWbGVnYWxzdHViJGR5bkNhbGxfamlqaf0GGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfsGBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 30200;
var ___stop_em_js = Module['___stop_em_js'] = 31605;



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
