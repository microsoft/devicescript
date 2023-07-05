
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABtYKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/f39/fwBgBX9/f39/AX9gBX9+fn5+AGAGf39/f39/AGAAAX5gAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gBn9/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C/IOAgAAVA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX3NpemUACANlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA/KGgIAA8AYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAPBw8ABwcDBQIHBwMDBwgBAgcHBA4LDAYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMHBQcGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAAAAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAcBAQEAAQEBAQAAAQUAABIAAAAJAAYAAAABDAAAABIDDg4AAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAAAwEBAQEBAQEBAQEBAQEBAQYBAwAAAQEBAQALAAICAAEBAQABAQABAQAAAAEAAAEBAAAAAAAAAgAFAgIFCwABAAEBAQQBDwYAAgAAAAYAAAgEAwkLAgILAgMABQkDAQUGAwUJBQUGBQEBAQMDBgMDAwMDAwUFBQkMBgUDAwMGAwMDAwUGBQUFBQUFAQYDAxATAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAgAeHwMEAwYCBQUFAQEFBQsBAwICAQALBQUFAQUFAQUGAwMEBAMMEwICBRADAwMDBgYDAwMEBAYGBgYBAwADAwQCAAMAAgYABAQDBgYFAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQIBAgQEAQ4gAgIAAAcJAwYBAgAABwkJAQMHAQIAAAIFAAcJCAAEBAQAAAIHABQDBwcBAgEAFQMJBwAABAACBwAAAgcEBwQEAwMDAwYCCAYGBgQHBgcDAwIGCAAGAAAEIQEDEAMDAAkHAwYEAwQABAMDAwMEBAYGAAAABAQHBwcHBAcHBwgICAcEBAMPCAMABAEACQEDAwEDBQQMIgkJFAMDBAMDAwcHBQcECAAEBAcJCAAHCBYEBgYGBAAEGSMRBgQEBAYJBAQAABcKCgoWChEGCAckChcXChkWFRUKJSYnKAoDAwMEBgMDAwMDBBQEBBoNGCkNKgUOEisFEAQEAAgEDRgbGw0TLAICCAgYDQ0aDS0ACAgABAgHCAgILgwvBIeAgIAAAXABkwKTAgWGgICAAAEBgAKAAgaHgYCAABR/AUGQlwYLfwFBAAt/AUEAC38BQQALfwBBmO8BC38AQejvAQt/AEHX8AELfwBBofIBC38AQZ3zAQt/AEGZ9AELfwBBhfUBC38AQdX1AQt/AEH29QELfwBB+/cBC38AQfH4AQt/AEHB+QELfwBBjfoBC38AQbb6AQt/AEGY7wELfwBB5foBCwfHh4CAACoGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFQZtYWxsb2MA4wYWX19lbV9qc19fZW1fZmxhc2hfc2l6ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBRZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwYQX19lcnJub19sb2NhdGlvbgCZBhlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDkBhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgAqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACsKamRfZW1faW5pdAAsDWpkX2VtX3Byb2Nlc3MALRRqZF9lbV9mcmFtZV9yZWNlaXZlZAAuEWpkX2VtX2RldnNfZGVwbG95AC8RamRfZW1fZGV2c192ZXJpZnkAMBhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMRtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMhZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwccX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMIHF9fZW1fanNfX2VtX3NlbmRfbGFyZ2VfZnJhbWUDCRpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMKFF9fZW1fanNfX2VtX3RpbWVfbm93AwsgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DDBdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMNFmpkX2VtX3RjcHNvY2tfb25fZXZlbnQAQhhfX2VtX2pzX19famRfdGNwc29ja19uZXcDDhpfX2VtX2pzX19famRfdGNwc29ja193cml0ZQMPGl9fZW1fanNfX19qZF90Y3Bzb2NrX2Nsb3NlAxAhX19lbV9qc19fX2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlAxEGZmZsdXNoAKEGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdAD+BhllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAP8GGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAgAcYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAIEHCXN0YWNrU2F2ZQD6BgxzdGFja1Jlc3RvcmUA+wYKc3RhY2tBbGxvYwD8BhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AP0GDV9fc3RhcnRfZW1fanMDEgxfX3N0b3BfZW1fanMDEwxkeW5DYWxsX2ppamkAgwcJn4SAgAABAEEBC5ICKTpTVGRZW25vc2VtrgK9As0C7ALwAvUCnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAckBygHLAcwBzQHOAc8B0AHRAdIB0wHUAdUB2AHZAdoB2wHcAd0B3gHfAeAB4QHkAeUB5wHoAekB6wHtAe4B7wHyAfMB9AH5AfoB+wH8Af0B/gH/AYACgQKCAoMChAKFAoYChwKIAokCiwKMAo0CjwKQApECkwKUApUClgKXApgCmQKaApsCnAKdAp4CnwKgAqECowKlAqYCpwKoAqkCqgKrAq0CsAKxArICswK0ArUCtgK3ArgCuQK6ArsCvAK+Ar8CwALBAsICwwLEAsUCxgLHAskCiwSMBI0EjgSPBJAEkQSSBJMElASVBJYElwSYBJkEmgSbBJwEnQSeBJ8EoAShBKIEowSkBKUEpgSnBKgEqQSqBKsErAStBK4ErwSwBLEEsgSzBLQEtQS2BLcEuAS5BLoEuwS8BL0EvgS/BMAEwQTCBMMExATFBMYExwTIBMkEygTLBMwEzQTOBM8E0ATRBNIE0wTUBNUE1gTXBNgE2QTaBNsE3ATdBN4E3wTgBOEE4gTjBOQE5QTmBOcEggWEBYgFiQWLBYoFjgWQBaIFowWmBacFjAamBqUGpAYKxtGMgADwBgUAEP4GCyUBAX8CQEEAKALw+gEiAA0AQcLWAEHAygBBGUGwIRD+BQALIAAL3AEBAn8CQAJAAkACQEEAKALw+gEiA0UNACABQQNxDQEgACADayIDQQBIDQIgAyACakEAKAL0+gFLDQICQAJAIANBB3ENACACRQ0FQQAhAwwBC0Gg3gBBwMoAQSJB4SgQ/gUACwJAA0AgACADIgNqLQAAQf8BRw0BIANBAWoiBCEDIAQgAkYN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QQAhBAJAIAJFDQAgAiABbBAfIQQLIAMgBCICNgIQAkAgAg0AIANBADsBDAsgA0EUaiAAKAIEEMkFGiADIAAoAgQtAA46AAogAygCEA8LQcXbAEG0ywBBMUGJxAAQ/gUAC9YCAQJ/IwBBwABrIgMkACADIAI2AjwgAyABKQMANwMgQQAhAgJAIANBIGoQ8gMNACADIAEpAwA3AxgCQAJAIAAgA0EYahCRAyICDQAgAyABKQMANwMQIAAgA0EQahCQAyEBDAELAkAgACACEJIDIgENAEEAIQEMAQsCQCAAIAIQ8gINACABIQEMAQtBACABIAIoAgBBgICA+ABxQYCAgMgARhshAQsCQAJAIAEiBA0AQQAhAQwBCwJAIAMoAjwiAUUNACADIAFBEGo2AjwgA0EwakH8ABDFAyADQShqIAAgBBCpAyADIAMpAzA3AwggAyADKQMoNwMAIAAgASADQQhqIAMQYwtBASEBCyABIQECQCACDQAgASECDAELAkAgAygCPEUNACAAIAIgA0E8akEFEO0CIAFqIQIMAQsgACACQQBBABDtAiABaiECCyADQcAAaiQAIAIL+AcBA38jAEHQAGsiAyQAIAFBCGpBADYCACABQgA3AgAgAyACKQMANwMwAkACQAJAAkACQAJAIAAgA0EwaiADQcgAaiADQcQAahCIAyIEQQBIDQACQCADKAJEIgVFDQAgAykDSFANACACKAIEIgBBgIDA/wdxDQMgAEEIcUUNAyABQdcAOgAKIAEgAigCADYCAAwCCwJAAkAgBUUNACADQThqIABBCCAFEOcDIAIgAykDODcDAAwBCyACIAMpA0g3AwALIAEgBEHPhn8gBBs7AQgLIAIoAgAhBAJAAkACQAJAAkBBECACKAIEIgVBD3EgBUGAgMD/B3EbDgkBBAQEAAQDBAIECyABIARB//8AcTYCACABIARBDnZBIGo6AAoMBAsgBEGgf2oiBUErSw0CIAEgBTYCACABQQU6AAoMAwsCQAJAIAQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAIAVBfGoOBgACAgICAAILIAEgBDYCACABQdIAOgAKIAMgAikDADcDKCABIAAgA0EoakEAEF82AgQMAgsgASAENgIAIAFBMjoACgwBCyADIAIpAwA3AyACQAJAAkACQAJAAkACQAJAAkACQAJAAkAg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AyAgASABQSBqNgIEIAFBGGogAEHCIyABEMcDIAAoAuwBIgBFDQAgACABKQMYNwMgCyABQTBqJAAL5gECBH8BfiMAQSBrIgEkACAAQQAQngMhAiABIABB6ABqKQMAIgU3AwggASAFNwMYAkAgACABQQhqEJICIgNFDQACQCACQTFJDQAgAUEQaiAAQdwAENsDDAELIAMgAjoAFQJAIAMoAhwvAQQiBEHtAUkNACABQRBqIABBLxDbAwwBCyAAQYUDaiACOgAAIABBhgNqIAMvARA7AQAgAEH8AmogAykDCDcCACADLQAUIQIgAEGEA2ogBDoAACAAQfsCaiACOgAAIABBiANqIAMoAhxBDGogBBCcBhogABDRAgsgAUEgaiQAC7ACAgN/AX4jAEHQAGsiASQAIABBABCeAyECIAEgAEHoAGopAwAiBDcDSAJAAkAgBFANACABIAEpA0g3AzggACABQThqEMEDDQAgASABKQNINwMwIAFBwABqIABBwgAgAUEwahDZAwwBCwJAIAJFDQAgAkGAgICAf3FBgICAgAFGDQAgAUHAAGogAEHKFkEAENcDDAELIAEgASkDSDcDKAJAAkACQCAAIAFBKGogAhDeAiIDQQNqDgIBAAILIAEgAjYCACABQcAAaiAAQZ4LIAEQ1QMMAgsgASABKQNINwMgIAEgACABQSBqQQAQxAM2AhAgAUHAAGogAEG/PSABQRBqENcDDAELIANBAEgNACAAKALsASIARQ0AIAAgA61CgICAgCCENwMgCyABQdAAaiQACyMBAX8jAEEQayIBJAAgAUEIaiAAQfgtQQAQ1gMgAUEQaiQAC+kBAgR/AX4jAEEwayIBJAAgASAAQeAAaikDACIFNwMIIAEgBTcDICAAIAFBCGogAUEsahDEAyECIAEgAEHoAGopAwAiBTcDACABIAU3AxggACABIAFBKGoQ7gMhAwJAAkACQCACRQ0AIAMNAQsgAUEQaiAAQYLPAEEAENUDDAELIAAgASgCLCABKAIoakERahCUASIERQ0AIAAgBBCkAyAEQf8BOgAOIARBFGoQ8QU3AAAgASgCLCEAIAAgBEEcaiACIAAQnAZqQQFqIAMgASgCKBCcBhogBEEMaiAELwEEECULIAFBMGokAAsiAQF/IwBBEGsiASQAIAFBCGogAEGj2QAQ2AMgAUEQaiQA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BikDACADKQMQIgpSDQBBASEFIAYhAgwBCyAEQRhsIAZqQWhqIQdBACEFAkADQAJAIAVBAWoiAiAERw0AIAchCAwCCyACIQUgBiACQRhsaiIJIQggCSkDACAKUg0ACwsgAiAESSEFIAghAgsgAiECAkAgBQ0AIAMgAykDEDcDCCADQRhqIAFB0AEgA0EIahDZA0EAIQILAkACQCACIgJFDQAgACACLQAOEOUDDAELIABCADcDAAsgA0EgaiQAC/YBAgd/AX4jAEEgayIDJAAgAyACKQMANwMQAkACQCABLQBKIgQNACAEQQBHIQUMAQsCQCABKAKoAiIGKQMAIAMpAxAiClINAEEBIQUgBiECDAELIARBGGwgBmpBaGohB0EAIQUCQANAAkAgBUEBaiICIARHDQAgByEIDAILIAIhBSAGIAJBGGxqIgkhCCAJKQMAIApSDQALCyACIARJIQUgCCECCyACIQICQCAFDQAgAyADKQMQNwMIIANBGGogAUHQASADQQhqENkDQQAhAgsCQAJAIAIiAkUNACAAIAIvARAQ5QMMAQsgAEIANwMACyADQSBqJAALqAECBH8BfiMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAS0ASiIEDQAgBEEARyECDAELIAEoAqgCIgUpAwAgAykDECIHUQ0BQQAhBgJAA0AgBkEBaiICIARGDQEgAiEGIAUgAkEYbGopAwAgB1INAAsLIAIgBEkhAgsgAg0AIAMgAykDEDcDCCADQRhqIAFB0AEgA0EIahDZAwsgAEIANwMAIANBIGokAAuOAgIIfwF+IwBBMGsiASQAIAEgACkDWCIJNwMgAkACQCAALQBKIgINACACQQBHIQMMAQsCQCAAKAKoAiIEKQMAIAlSDQBBASEDIAQhBQwBCyACQRhsIARqQWhqIQZBACEDAkADQAJAIANBAWoiBSACRw0AIAYhBwwCCyAFIQMgBCAFQRhsaiIIIQcgCCkDACAJUg0ACwsgBSACSSEDIAchBQsgBSEFAkAgAw0AIAEgASkDIDcDECABQShqIABB0AEgAUEQahDZA0EAIQULAkAgBUUNACAAQQBBfxCdAxogASAAQeAAaikDACIJNwMYIAEgCTcDCCABQShqIABB0gEgAUEIahDZAwsgAUEwaiQAC4kBAgJ/AX4jAEEgayIDJAAgAyAC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EiEIIAMhASAPIQcgDCECIBYNAgNAIAIhAiAIQX9qIQkgByIHKAIAIQgCQAJAIAEiAUEASCIKDQAgASATSg0AIAJBADoAAyACQQA7AAEgAiAIOgAADAELAkAgCg0AIAEgAE4NACACIAItAABB8AFxIAhBD3FyOgAACwJAIAFBf0gNACABQQFqIABODQAgAiACLQAAQQ9xIAhB8AFxcjoAAAsCQCABQX5IDQAgAUECaiAATg0AIAIgAi0AAUHwAXE6AAELAkAgAUF9SA0AIAFBA2ogAE4NACACIAItAAFBD3E6AAELAkAgAUF8SA0AIAFBBGogAE4NACACIAItAAJB8AFxOgACCwJAIAFBe0gNACABQQVqIABODQAgAiACLQACQQ9xOgACCwJAIAFBekgNACABQQZqIABODQAgAiACLQADQfABcToAAwsgAUF5SA0AIAFBB2ogAE4NACACIAItAANBD3E6AAMLIAkhCCABQQhqIQEgB0EEaiEHIAJBBGohAiAJDQAMAwsACyASIQggDCEJIA8hAiADIQcgEiEKIAwhDCAPIQ8gAyELAkAgFUUNAANAIAchASACIQIgCSEJIAgiCEUNAyACKAIAIgpBD3EhBwJAAkACQCABQQBIIgwNACABIBBKDQACQCAHRQ0AIAktAABBD00NACAJIQlBACEKIAEhAQwDCyAKQfABcUUNASAJLQABQQ9xRQ0BIAlBAWohCUEAIQogASEBDAILAkAgDA0AIAdFDQAgASAATg0AIAktAABBD00NACAJIQlBACEKIAEhAQwCCyAKQfABcUUNACABQX9IDQAgAUEBaiIHIABODQAgCS0AAUEPcUUNACAJQQFqIQlBACEKIAchAQwBCyAJQQRqIQlBASEKIAFBCGohAQsgCEF/aiEIIAkhCSACQQRqIQIgASEHQQEhASAKDQAMBgsACwNAIAshASAPIQIgDCEJIAoiCEUNAiACKAIAIgpBD3EhBwJAAkACQCABQQBIIgwNACABIBBKDQACQCAHRQ0AIAktAABBD3FFDQAgCSEJQQAhByABIQEMAwsgCkHwAXFFDQEgCS0AAEEQSQ0BIAkhCUEAIQcgASEBDAILAkAgDA0AIAdFDQAgASAATg0AIAktAABBD3FFDQAgCSEJQQAhByABIQEMAgsgCkHwAXFFDQAgAUF/SA0AIAFBAWoi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IAFBBBDiAQJAIAEoAgAiAkUNACABKAIMIgNBAUgNACABKAIQIQQgASgCCCEFIAEoAgQhBkEBIANBAXQiB2shCEEBIQlBASEKQQAhCyADQX9qIQwDQCAKIQ0gCSEDIAAgAiAMIgkgBmogBSALIgprIgtBASAKQQF0QQFyIgwgBBDmASAAIAIgCiAGaiAFIAlrIg5BASAJQQF0QQFyIg8gBBDmASAAIAIgBiAJayALQQEgDCAEEOYBIAAgAiAGIAprIA5BASAPIAQQ5gECQAJAIAgiCEEASg0AIAkhDCAKQQFqIQsgDSEKIANBAmohCSADIQMMAQsgCUF/aiEMIAohCyANQQJqIg4hCiADIQkgDiAHayEDCyADIAhqIQggCSEJIAohCiALIgMhCyAMIg4hDCAOIANODQALCyABQSBqJAAL6gECAn8BfiMAQdAAayIBJAAgASAAQeAAaikDADcDSCABIABB6ABqKQMAIgM3AyggASADNwNAAkAgAUEoahDyAw0AIAFBOGogAEGOHhDYAwsgASABKQNINwMgIAFBOGogACABQSBqEMkDIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjgEgASABKQNINwMQAkAgACABQRBqIAFBOGoQxAMiAkUNACABQTBqIAAgAiABKAI4QQEQ5QIgACgC7AEiAkUNACACIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjwEgAUHQAGokAAuPAQECfyMAQTBrIgEkACABIABB4ABqKQMANwMoIAEgAEHoAGopAwA3AyAgAEECEJ4DIQIgASABKQMgNwMIAkAgAUEIahDyAw0AIAFBGGogAEHbIBDYAwsgASABKQMoNwMAIAFBEGogACABIAJBARDoAgJAIAAoAuwBIgBFDQAgACABKQMQNwMgCyABQTBqJAALYQIBfwF+IwBBEGsiASQAIAEgAEHgAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAuwBIgBFDQEgACACNwMgDAELIAEgASkDCDcDACAAIAAgARDoA5sQoQMLIAFBEGokAAthAgF/AX4jAEEQayIBJAAgASAAQeAAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgC7AEiAEUNASAAIAI3AyAMAQsgASABKQMINwMAIAAgACABEOgDnBChAwsgAUEQaiQAC2MC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cUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQ2QNBACECCwJAIAAgAiICEKQCIgNFDQAgAUEIaiAAIAMgAigCHCICQQxqIAIvAQQQrAIgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBIGokAAvwAQICfwF+IwBBIGsiASQAIAEgACkDWDcDEAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECICRQ0AIAIoAgBBgICA+ABxQYCAgNgARw0AIABB+AJqQQBB/AEQngYaIABBhgNqQQM7AQAgAikDCCEDIABBhANqQQQ6AAAgAEH8AmogAzcCACAAQYgDaiACLwEQOwEAIABBigNqIAIvARY7AQAgAUEIaiAAIAIvARIQ0wICQCAAKALsASIARQ0AIAAgASkDCDcDIAsgAUEgaiQADwsgASABKQMQNwMAIAFBGGogAEEvIAEQ2QMAC6EBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahD+AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQ2QMLAkACQCACDQAgAEIANwMADAELAkAgASACEIADIgJBf0oNACAAQgA3AwAMAQsgACABIAIQ+QILIANBMGokAAuPAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQ/gIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENkDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqEP4CIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDZAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwECEOUDCyADQTBqJAAL+AECA38BfiMAQTBrIgMkACADIAIpAwAiBjcDGCADIAY3AxACQAJAIAEgA0EQaiADQSxqEP4CIgRFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDZ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NwMQIAFBOGogAEGTISABQRBqENoDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENoDQQAhAwsCQCADIgNFDQAgACADEK8CIAAgASgCJCADLwECQf8fcUGAwAByENACCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEP4CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZMhIANBCGoQ2gNBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahD+AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGTISADQQhqENoDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ/gIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBkyEgA0EIahDaA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDlAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDWCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQ/gIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBkyEgAUEQahDaA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBhiEgAUEIahDaA0EAIQMLAkAgAyIDRQ0AIAAgAxCvAiAAIAEoAiQgAy8BAhDQAgsgAUHAAGokAAtkAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahDZAwwBCyAAIAEgAigCABCCA0EARxDmAwsgA0EQaiQAC2MBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqENkDDAELIAAgASABIAIoAgAQgQMQ+gILIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDWDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQ2QNB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAEJ4DIQMgASAAQegAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahDuAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AENsDDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABDbAwwBCyAAQYQDaiAFOgAAIABBiANqIAQgBRCcBhogACACIAMQ0AILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQ/QIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxDZAyAAQgA3AwAMAQsgACACKAIEEOUDCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqEP0CIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQ2QMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuaAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAIAAgAUEYahD9AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqENkDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahCFAyAAKALsASIARQ0AIAAgASkDKDcDIAsgAUHAAGokAAvDAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAAkAgACABQRhqEP0CDQAgASABKQMwNwMAIAFBOGogAEGdASABENkDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyggACABQRBqEJICIgJFDQAgASAAKQNYIgM3AwggASADNwMgIAAgAUEIahD8AiIAQX9MDQEgAiAAQYCAAnM7ARILIAFBwABqJAAPC0GS3ABBgM4AQSlBuicQ/gUAC/gBAgR/AX4jAEEgayIBJAAgASAAQeAAaikDACIFNwMIIAEgBTcDGCAAIAFBCGpBABDEAyECIABBARCeAyEDAkACQEGYKkEAEK4FRQ0AIAFBEGogAEGIP0EAENcDDAELAkAQQQ0AIAFBEGogAEGbN0EAENcDDAELAkACQCACRQ0AIAMNAQsgAUEQaiAAQZE8QQAQ1QMMAQtBAEEONgLQhAICQCAAKALsASIERQ0AIAQgACkDYDcDIAtBAEEBOgCogAIgAiADED4hAkEAQQA6AKiAAgJAIAJFDQBBAEEANgLQhAIgAEF/EKIDCyAAQQAQogMLIAFBIGokAAvuAgIDfwF+IwBBIGsiAyQAAkACQBBwIgRFDQAgBC8BCA0AIARBFRDuAiEFIANBEGpBrwEQxQMgAyADKQMQNwMAIANBGGogBCAFIAMQiwMgAykDGFANAEIAIQZBsAEhBQJAAkACQAJAAkAgAEF/ag4EBAABAwILQQBBADYC0IQCQgAhBkGxASEFDAMLQQBBADYC0IQCEEACQCABDQBCACEGQbIBIQUMAwsgA0EIaiAEQQggBCABIAIQmAEQ5wMgAykDCCEGQbIBIQUMAgtB2sYAQSxBhhEQ+QUACyADQQhqIARBCCAEIAEgAhCTARDnAyADKQMIIQZBswEhBQsgBSEAIAYhBgJAQQAtAKiAAg0AIAQQhQQNAgsgBEEDOgBDIAQgAykDGDcDWCADQQhqIAAQxQMgBEHgAGogAykDCDcDACAEQegAaiAGNwMAIARBAkEBEH0aCyADQSBqJAAPC0HW4gBB2sYAQTFBhhEQ/gUACy8BAX8CQAJAQQAoAtCEAg0AQX8hAQwBCxBAQQBBADYC0IQCQQAhAQsgACABEKIDC6YBAgN/AX4jAEEgayIBJAACQAJAQQAoAtCEAg0AIABBnH8QogMMAQsgASAAQeAAaikDACIENwMIIAEgBDcDEAJAAkAgACABQQhqIAFBHGoQ7gMiAg0AQZt/IQIMAQsCQCAAKALsASIDRQ0AIAMgACkDYDcDIAtBAEEBOgCogAIgAiABKAIcED8hAkEAQQA6AKiAAiACIQILIAAgAhCiAwsgAUEgaiQAC0UBAX8jAEEQayIDJAAgAyACKQMANwMIAkACQCABIANBCGoQ3gMiAkF/Sg0AIABCADcDAAwBCyAAIAIQ5QMLIANBEGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQxANFDQAgACADKAIMEOUDDAELIABCADcDAAsgA0EQaiQAC4cBAgN/AX4jAEEgayIBJAAgASAAKQNYNwMYIABBABCeAyECIAEgASkDGDcDCAJAIAAgAUEIaiACEN0DIgJBf0oNACAAKALsASIDRQ0AIANBACkD8IoBNwMgCyABIAApA1giBDcDACABIAQ3AxAgACAAIAFBABDEAyACahDhAxCiAyABQSBqJAALWgECfyMAQSBrIgEkACABIAApA1g3AxAgAEEAEJ4DIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQlwMCQCAAKALsASIARQ0AIAAgASkDGDcDIAsgAUEgaiQAC2wCA38BfiMAQSBrIgEkACAAQQAQngMhAiAAQQFB/////wcQnQMhAyABIAApA1giBDcDCCABIAQ3AxAgAUEYaiAAIAFBCGogAiADEM0DAkAgACgC7AEiAEUNACAAIAEpAxg3AyALIAFBIGokAAuMAgEJfyMAQSBrIgEkAAJAAkACQAJAIAAtAEMiAkF/aiIDRQ0AIAJBAUsNAUEAIQQMAgsgAUEQakEAEMUDIAAoAuwBIgVFDQIgBSABKQMQNwMgDAILQQAhBUEAIQYDQCAAIAYiBhCeAyABQRxqEN8DIAVqIgUhBCAFIQUgBkEBaiIHIQYgByADRw0ACwsCQCAAIAFBCGogBCIIIAMQlgEiCUUNAAJAIAJBAU0NAEEAIQVBACEGA0AgBSIHQQFqIgQhBSAAIAcQngMgCSAGIgZqEN8DIAZqIQYgBCADRw0ACwsgACABQQhqIAggAxCXAQsgACgC7AEiBUUNACAFIAEpAwg3AyALIAFBIGokAAutAwINfwF+IwBBwABrIgEkACABIAApA1giDjcDOCABIA43AxggACABQRhqIAFBNGoQxAMhAiABIABB4ABqKQMAIg43AyggASAONwMQIAAgAUEQaiABQSRqEMQDIQMgASABKQM4NwMIIAAgAUEIahDeAyEEIABBARCeAyEFIABBAiAEEJ0DIQYgASABKQM4NwMAIAAgASAFEN0DIQQCQAJAIAMNAEF/IQcMAQsCQCAEQQBODQBBfyEHDAELQX8hByAFIAYgBkEfdSIIcyAIayIJTg0AIAEoAjQhCCABKAIkIQogBCEEQX8hCyAFIQUDQCAFIQUgCyELAkAgCiAEIgRqIAhNDQAgCyEHDAILAkAgAiAEaiADIAoQtgYiBw0AIAZBf0wNACAFIQcMAgsgCyAFIAcbIQcgCCAEQQFqIgsgCCALShshDCAFQQFqIQ0gBCEFAkADQAJAIAVBAWoiBCAISA0AIAwhCwwCCyAEIQUgBCELIAIgBGotAABBwAFxQYABRg0ACwsgCyEEIAchCyANIQUgByEHIA0gCUcNAAsLIAAgBxCiAyABQcAAaiQACwkAIABBARDIAgviAQIFfwF+IwBBMGsiAiQAIAIgACkDWCIHNwMoIAIgBzcDEAJAIAAgAkEQaiACQSRqEMQDIgNFDQAgAkEYaiAAIAMgAigCJBDIAyACIAIpAxg3AwggACACQQhqIAJBJGoQxAMiBEUNAAJAIAIoAiRFDQBBIEFgIAEbIQVBv39Bn38gARshBkEAIQMDQCAEIAMiA2oiASABLQAAIgEgBUEAIAEgBmpB/wFxQRpJG2o6AAAgA0EBaiIBIQMgASACKAIkSQ0ACwsgACgC7AEiA0UNACADIAIpAxg3AyALIAJBMGokAAsJACAAQQAQyAILqAQBBH8jAEHAAGsiBCQAIAQgAikDADcDGAJAAkACQAJAIAEgBEEYahDxA0F+cUECRg0AIAQgAikDADcDECAAIAEgBEEQahDJAwwBCyAEIAIpAwA3AyBBfyEFAkAgA0HkACADGyIDQQpJDQAgBEE8akEAOgAAIARCADcCNCAEQQA2AiwgBCABNgIoIAQgBCkDIDcDCCAEIANBfWo2AjAgBEEoaiAEQQhqEMsCIAQoAiwiBkEDaiIHIANLDQIgBiEFAkAgBC0APEUNACAEIAQoAjRBA2o2AjQgByEFCyAEKAI0IQYgBSEFCyAGIQYCQCAFIgVBf0cNACAAQgA3AwAMAQsgASAAIAUgBhCWASIFRQ0AIAQgAikDADcDICAGIQJBfyEGAkAgA0EKSQ0AIARBADoAPCAEIAU2AjggBEEANgI0IARBADYCLCAEIAE2AiggBCAEKQMgNwMAIAQgA0F9ajYCMCAEQShqIAQQywIgBCgCLCICQQNqIgcgA0sNAwJAIAQtADwiA0UNACAEIAQoAjRBA2o2AjQLIAQoAjQhBgJAIANFDQAgBCACQQFqIgM2AiwgBSACakEuOgAAIAQgAkECaiICNgIsIAUgA2pBLjoAACAEIAc2AiwgBSACakEuOgAACyAGIQIgBCgCLCEGCyABIAAgBiACEJcBCyAEQcAAaiQADwtBhDJB9cYAQaoBQfIkEP4FAAtBhDJB9cYAQaoBQfIkEP4FAAvIBAEFfyMAQeAAayICJAACQCAALQAUDQAgACgCACEDIAIgASkDADcDUAJAIAMgAkHQAGoQjQFFDQAgAEHB0AAQzAIMAQsgAiABKQMANwNIAkAgAyACQcgAahDxAyIEQQlHDQAgAiABKQMANwMAIAAgAyACIAJB2ABqEMQDIAIoAlgQ4wIiARDMAiABECAMAQsCQAJAIARBfnFBAkcNACABKAIEIgRBgIDA/wdxDQEgBEEPcUEGRw0BCyACIAEpAwA3AxAgAkHYAGogAyACQRBqEMkDIAEgAikDWDcDACACIAEpAwA3AwggACADIAJBCGogAkHYAGoQxAMQzAIMAQsgAiABKQMANwNAIAMgAkHAAGoQjgEgAiABKQMANwM4AkACQCADIAJBOGoQ8ANFDQAgAiABKQMANwMoIAMgAkEoahDvAyEEIAJB2wA7AFggACACQdgAahDMAgJAIAQvAQhFDQBBACEFA0AgAiAEKAIMIAUiBUEDdGopAwA3AyAgACACQSBqEMsCIAAtABQNAQJAIAUgBC8BCEF/akYNACACQSw7AFggACACQdgAahDMAgsgBUEBaiIGIQUgBiAELwEISQ0ACwsgAkHdADsAWCAAIAJB2ABqEMwCDAELIAIgASkDADcDMCADIAJBMGoQkQMhBCACQfsAOwBYIAAgAkHYAGoQzAICQCAERQ0AIAMgBCAAQQ8Q7QIaCyACQf0AOwBYIAAgAkHYAGoQzAILIAIgASkDADcDGCADIAJBGGoQjwELIAJB4ABqJAALgwIBBH8CQCAALQAUDQAgARDLBiICIQMCQCACIAAoAgggACgCBGsiBE0NACAAQQE6ABQCQCAEQQFODQAgBCEDDAELIAQhAyABIARBf2oiBGosAABBf0oNACAEIQIDQAJAIAEgAiIEai0AAEHAAXFBgAFGDQAgBCEDDAILIARBf2ohAkEAIQMgBEEASg0ACwsCQCADIgVFDQBBACEEA0ACQCABIAQiBGoiAy0AAEHAAXFBgAFGDQAgACAAKAIMQQFqNgIMCwJAIAAoAhAiAkUNACACIAAoAgQgBGpqIAMtAAA6AAALIARBAWoiAyEEIAMgBUcNAAsLIAAgACgCBCAFajYCBAsLzgIBBn8jAEEwayIEJAACQCABLQAUDQAgBCACKQMANwMgQQAhBQJAIAAgBEEgahDBA0UNACAEIAIpAwA3AxggACAEQRhqIARBLGoQxAMhBiAEKAIsIgVFIQACQAJAIAUNACAAIQcMAQsgACEIQQAhCQNAIAghBwJAIAYgCSIAai0AACIIQd8BcUG/f2pB/wFxQRpJDQAgAEEARyAIwCIIQS9KcSAIQTpIcQ0AIAchByAIQd8ARw0CCyAAQQFqIgAgBU8iByEIIAAhCSAHIQcgACAFRw0ACwtBACEAAkAgB0EBcUUNACABIAYQzAJBASEACyAAIQULAkAgBQ0AIAQgAikDADcDECABIARBEGoQywILIARBOjsALCABIARBLGoQzAIgBCADKQMANwMIIAEgBEEIahDLAiAEQSw7ACwgASAEQSxqEMwCCyAEQTBqJAAL0QIBAn8CQAJAIAAvAQgNAAJAAkAgACABEIIDRQ0AIABB9ARqIgUgASACIAQQrgMiBkUNACAGKAIEQaD3NiADIANB34hJakHgiElJG2ogACgCgAJPDQEgBSAGEKoDCyAAKALsASIARQ0CIAAgAjsBFCAAIAE7ARIgAEEUOwEKIAAgBDsBCCAAIAAtABBB8AFxQQFyOgAQIABBABB4DwsgACABEIIDIQQgBSAGEKwDIQEgAEGAA2pCADcDACAAQgA3A/gCIABBhgNqIAEvAQI7AQAgAEGEA2ogAS0AFDoAACAAQYUDaiAELQAEOgAAIABB/AJqIARBACAELQAEa0EMbGpBZGopAwA3AgAgAUEIaiEEAkACQCABLQAUIgFBCk8NACAEIQQMAQsgBCgCACEECyAAQYgDaiAEIAEQnAYaCw8LQdXWAEGyzQBBLUGhHhD+BQALMwACQCAALQAQQQ5xQQJHDQAgACgCLCAAKAIIEFILIABCADcDCCAAIAAtABBB8AFxOgAQC6MCAQJ/AkACQCAALwEIDQACQCACQYBgcUGAwABHDQAgAEH0BGoiAyABIAJB/59/cUGAIHJBABCuAyIERQ0AIAMgBBCqAwsgACgC7AEiA0UNASADIAI7ARQgAyABOwESIABBhANqLQAAIQIgAyADLQAQQfABcUECcjoAECADIAAgAhCKASIBNgIIAkAgAUUNACADIAI6AAwgASAAQYgDaiACEJwGGgsCQCAAKAKQAkEAIAAoAoACIgJBnH9qIgEgASACSxsiAU8NACAAIAE2ApACCyAAIAAoApACQRRqIgQ2ApACQQAhAQJAIAQgAmsiAkEASA0AIAAgACgClAJBAWo2ApQCIAIhAQsgAyABEHgLDwtB1dYAQbLNAEHjAEGAPBD+BQAL+wEBBH8CQAJAIAAvAQgNACAAKALsASIBRQ0BIAFB//8BOwESIAEgAEGGA2ovAQA7ARQgAEGEA2otAAAhAiABIAEtABBB8AFxQQNyOgAQIAEgACACQRBqIgMQigEiAjYCCAJAIAJFDQAgASADOgAMIAIgAEH4AmogAxCcBhoLAkAgACgCkAJBACAAKAKAAiICQZx/aiIDIAMgAksbIgNPDQAgACADNgKQAgsgACAAKAKQAkEUaiIENgKQAkEAIQMCQCAEIAJrIgJBAEgNACAAIAAoApQCQQFqNgKUAiACIQMLIAEgAxB4Cw8LQdXWAEGyzQBB9wBB4QwQ/gUAC50CAgN/AX4jAEHQAGsiAyQAAkAgAC8BCA0AIAMgAikDADcDQAJAIAAgA0HAAGogA0HMAGoQxAMiAkEKEMgGRQ0AIAEhBCACEIcGIgUhAANAIAAiAiEAAkADQAJAAkAgACIALQAADgsDAQEBAQEBAQEBAAELIABBADoAACADIAI2AjQgAyAENgIwQdoaIANBMGoQOyAAQQFqIQAMAwsgAEEBaiEADAALAAsLAkAgAi0AAEUNACADIAI2AiQgAyABNgIgQdoaIANBIGoQOwsgBRAgDAELAkAgAUEjRw0AIAApA4ACIQYgAyACNgIEIAMgBj4CAEGrGSADEDsMAQsgAyACNgIUIAMgATYCEEHaGiADQRBqEDsLIANB0ABqJAALmAICA38BfiMAQSBrIgMkAAJAAkAgAUGFA2otAABB/wFHDQAgAEIANwMADAELAkAgAUELQSAQiQEiBA0AIABCADcDAAwBCyADQRhqIAFBCCAEEOcDIAMgAykDGDcDECABIANBEGoQjgEgBCABIAFBiANqIAFBhANqLQAAEJMBIgU2AhwCQAJAIAUNACADIAMpAxg3AwAgASADEI8BQgAhBgwBCyAEIAFB/AJqKQIANwMIIAQgAS0AhQM6ABUgBCABQYYDai8BADsBECABQfsCai0AACEFIAQgAjsBEiAEIAU6ABQgBCABLwH4AjsBFiADIAMpAxg3AwggASADQQhqEI8BIAMpAxghBgsgACAGNwMACyADQSBqJAALnAICAn8BfiMAQcAAayIDJAAgAyABNgIwIANBAjYCNCADIAMpAzA3AxggA0EgaiAAIANBGGpB4QAQlAMgAyADKQMwNwMQIAMgAykDIDcDCCADQShqIAAgA0EQaiADQQhqEIYDAkACQCADKQMoIgVQDQAgAC8BCA0AIAAtAEYNACAAEIUEDQEgACAFNwNYIABBAjoAQyAAQeAAaiIEQgA3AwAgA0E4aiAAIAEQ0wIgBCADKQM4NwMAIABBAUEBEH0aCwJAIAJFDQAgACgC8AEiAkUNACACIQIDQAJAIAIiAi8BEiABRw0AIAIgACgCgAIQdwsgAigCACIEIQIgBA0ACwsgA0HAAGokAA8LQdbiAEGyzQBB1QFB2x8Q/gUAC+sJAgd/AX4jAEEQayIBJABBASECAkACQCAALQAQQQ9xIgMOBQEAAAABAAsCQAJAAkACQAJAAkAgA0F/ag4FAAECBAMECwJAIAAoAiwgAC8BEhCCAw0AIABBABB3IAAgAC0AEEHfAXE6ABBBACECDAYLIAAoAiwhAgJAIAAtABAiA0EgcUUNACAAIANB3wFxOgAQIAJB9ARqIgQgAC8BEiAALwEUIAAvAQgQrgMiBUUNACACIAAvARIQggMhAyAEIAUQrAMhACACQYADakIANwMAIAJCADcD+AIgAkGGA2ogAC8BAjsBACACQYQDaiAALQAUOgAAIAJBhQNqIAMtAAQ6AAAgAkH8AmogA0EAIAMtAARrQQxsakFkaikDADcCACAAQQhqIQMCQAJAIAAtABQiAEEKTw0AIAMhAwwBCyADKAIAIQMLIAJBiANqIAMgABCcBhpBASECDAYLIAAoAhggAigCgAJLDQQgAUEANgIMQQAhBQJAIAAvAQgiA0UNACACIAMgAUEMahCJBCEFCyAALwEUIQYgAC8BEiEEIAEoAgwhAyACQfsCakEBOgAAIAJB+gJqIANBB2pB/AFxOgAAIAIgBBCCAyIHQQAgBy0ABGtBDGxqQWRqKQMAIQggAkGEA2ogAzoAACACQfwCaiAINwIAIAIgBBCCAy0ABCEEIAJBhgNqIAY7AQAgAkGFA2ogBDoAAAJAIAUiBEUNACACQYgDaiAEIAMQnAYaCwJAAkAgAkH4AmoQ2gUiA0UNAAJAIAAoAiwiAigCkAJBACACKAKAAiIFQZx/aiIEIAQgBUsbIgRPDQAgAiAENgKQAgsgAiACKAKQAkEUaiIGNgKQAkEDIQQgBiAFayIFQQNIDQEgAiACKAKUAkEBajYClAIgBSEEDAELAkAgAC8BCiICQecHSw0AIAAgAkEBdDsBCgsgAC8BCiEECyAAIAQQeCADRQ0EIANFIQIMBQsCQCAAKAIsIAAvARIQggMNACAAQQAQd0EAIQIMBQsgACgCCCEFIAAvARQhBiAALwESIQQgAC0ADCEDIAAoAiwiAkH7AmpBAToAACACQfoCaiADQQdqQfwBcToAACACIAQQggMiB0EAIActAARrQQxsakFkaikDACEIIAJBhANqIAM6AAAgAkH8AmogCDcCACACIAQQggMtAAQhBCACQYYDaiAGOwEAIAJBhQNqIAQ6AAACQCAFRQ0AIAJBiANqIAUgAxCcBhoLAkAgAkH4AmoQ2gUiAg0AIAJFIQIMBQsCQCAAKAIsIgIoApACQQAgAigCgAIiA0Gcf2oiBCAEIANLGyIETw0AIAIgBDYCkAILIAIgAigCkAJBFGoiBTYCkAJBAyEEAkAgBSADayIDQQNIDQAgAiACKAKUAkEBajYClAIgAyEECyAAIAQQeEEAIQIMBAsgACgCCBDaBSICRSEDAkAgAg0AIAMhAgwECwJAIAAoAiwiAigCkAJBACACKAKAAiIEQZx/aiIFIAUgBEsbIgVPDQAgAiAFNgKQAgsgAiACKAKQAkEUaiIGNgKQAkEDIQUCQCAGIARrIgRBA0gNACACIAIoApQCQQFqNgKUAiAEIQULIAAgBRB4IAMhAgwDCyAAKAIILQAAQQBHIQIMAgtBss0AQZMDQaElEPkFAAtBACECCyABQRBqJAAgAguMBgIHfwF+IwBBIGsiAyQAAkACQCAALQBGDQAgAEH4AmogAiACLQAMQRBqEJwGGgJAIABB+wJqLQAAQQFxRQ0AIABB/AJqKQIAENcCUg0AIABBFRDuAiECIANBCGpBpAEQxQMgAyADKQMINwMAIANBEGogACACIAMQiwMgAykDECIKUA0AIAAvAQgNACAALQBGDQAgABCFBA0CIAAgCjcDWCAAQQI6AEMgAEHgAGoiAkIANwMAIANBGGogAEH//wEQ0wIgAiADKQMYNwMAIABBAUEBEH0aCwJAIAAvAUxFDQAgAEH0BGoiBCEFQQAhAgNAAkAgACACIgYQggMiAkUNAAJAAkAgAC0AhQMiBw0AIAAvAYYDRQ0BCyACLQAEIAdHDQELIAJBACACLQAEa0EMbGpBZGopAwAgACkC/AJSDQAgABCAAQJAIAAtAPsCQQFxDQACQCAALQCFA0EwSw0AIAAvAYYDQf+BAnFBg4ACRw0AIAQgBiAAKAKAAkHwsX9qEK8DDAELQQAhByAAKALwASIIIQICQCAIRQ0AA0AgByEHAkACQCACIgItABBBD3FBAUYNACAHIQcMAQsCQCAALwGGAyIIDQAgByEHDAELAkAgCCACLwEURg0AIAchBwwBCwJAIAAgAi8BEhCCAyIIDQAgByEHDAELAkACQCAALQCFAyIJDQAgAC8BhgNFDQELIAgtAAQgCUYNACAHIQcMAQsCQCAIQQAgCC0ABGtBDGxqQWRqKQMAIAApAvwCUQ0AIAchBwwBCwJAIAAgAi8BEiACLwEIENgCIggNACAHIQcMAQsgBSAIEKwDGiACIAItABBBIHI6ABAgB0EBaiEHCyAHIQcgAigCACIIIQIgCA0ACwtBACEIIAdBAEoNAANAIAUgBiAALwGGAyAIELEDIgJFDQEgAiEIIAAgAi8BACACLwEWENgCRQ0ACwsgACAGQQAQ1AILIAZBAWoiByECIAcgAC8BTEkNAAsLIAAQgwELIANBIGokAA8LQdbiAEGyzQBB1QFB2x8Q/gUACxAAEPEFQvin7aj3tJKRW4UL0wIBBn8jAEEQayIDJAAgAEGIA2ohBCAAQYQDai0AACEFAkACQAJAAkAgAg0AIAUhBSAEIQQMAQsgACACIANBDGoQiQQhBgJAAkAgAygCDCIHIAAtAIQDTg0AIAQgB2otAAANACAGIAQgBxC2Bg0AIAdBAWohBwwBC0EAIQcLIAciB0UNASAFIAdrIQUgBCAHaiEECyAEIQcgBSEEAkACQCAAQfQEaiIIIAEgAEGGA2ovAQAgAhCuAyIFRQ0AAkAgBCAFLQAURw0AIAUhBQwCCyAIIAUQqgMLQQAhBQsgBSIGIQUCQCAGDQAgCCABIAAvAYYDIAQQrQMiASACOwEWIAEhBQsgBSICQQhqIQECQAJAIAItABRBCk8NACABIQEMAQsgASgCACEBCyABIAcgBBCcBhogAiAAKQOAAj4CBCACIQAMAQtBACEACyADQRBqJAAgAAspAQF/AkAgAC0ABiIBQSBxRQ0AIAAgAUHfAXE6AAZB4jpBABA7EJYFCwu4AQEEfwJAIAAtAAYiAkEEcQ0AAkAgAkEIcQ0AIAEQjAUhAiAAQcUAIAEQjQUgAhBMCyAALwFMIgNFDQAgACgC9AEhBEEAIQIDQAJAIAQgAiICQQJ0aigCACIFRQ0AIAUoAgggAUcNACAAQfQEaiACELADIABBkANqQn83AwAgAEGIA2pCfzcDACAAQYADakJ/NwMAIABCfzcD+AIgACACQQEQ1AIPCyACQQFqIgUhAiAFIANHDQALCwsrACAAQn83A/gCIABBkANqQn83AwAgAEGIA2pCfzcDACAAQYADakJ/NwMACygAQQAQ1wIQkwUgACAALQAGQQRyOgAGEJUFIAAgAC0ABkH7AXE6AAYLIAAgACAALQAGQQRyOgAGEJUFIAAgAC0ABkH7AXE6AAYLugcCCH8BfiMAQYABayIDJAACQAJAIAAgAhD/AiIEDQBBfiEEDAELAkAgASkDAEIAUg0AIAMgACAELwEAQQAQiQQiBTYCcCADQQA2AnQgA0H4AGogAEGMDSADQfAAahDHAyABIAMpA3giCzcDACADIAs3A3ggAC8BTEUNAEEAIQQDQCAEIQZBACEEAkADQAJAIAAoAvQBIAQiBEECdGooAgAiB0UNACADIAcpAwA3A2ggAyADKQN4NwNgIAAgA0HoAGogA0HgAGoQ9gMNAgsgBEEBaiIHIQQgByAALwFMSQ0ADAMLAAsgAyAFNgJQIAMgBkEBaiIENgJUIANB+ABqIABBjA0gA0HQAGoQxwMgASADKQN4Igs3AwAgAyALNwN4IAQhBCAALwFMDQALCyADIAEpAwA3A3gCQAJAIAAvAUxFDQBBACEEA0ACQCAAKAL0ASAEIgRBAnRqKAIAIgdFDQAgAyAHKQMANwNIIAMgAykDeDcDQCAAIANByABqIANBwABqEPYDRQ0AIAQhBAwDCyAEQQFqIgchBCAHIAAvAUxJDQALC0F/IQQLAkAgBEEASA0AIAMgASkDADcDECADIAAgA0EQakEAEMQDNgIAQeIVIAMQO0F9IQQMAQsgAyABKQMANwM4IAAgA0E4ahCOASADIAEpAwA3AzACQAJAIAAgA0EwakEAEMQDIggNAEF/IQcMAQsCQCAAQRAQigEiCQ0AQX8hBwwBCwJAAkACQCAALwFMIgUNAEEAIQQMAQsCQAJAIAAoAvQBIgYoAgANACAFQQBHIQdBACEEDAELIAUhCkEAIQcCQAJAA0AgB0EBaiIEIAVGDQEgBCEHIAYgBEECdGooAgBFDQIMAAsACyAKIQQMAgsgBCAFSSEHIAQhBAsgBCIGIQQgBiEGIAcNAQsgBCEEAkACQCAAIAVBAXRBAmoiB0ECdBCKASIFDQAgACAJEFJBfyEEQQUhBQwBCyAFIAAoAvQBIAAvAUxBAnQQnAYhBSAAIAAoAvQBEFIgACAHOwFMIAAgBTYC9AEgBCEEQQAhBQsgBCIEIQYgBCEHIAUOBgACAgICAQILIAYhBCAJIAggAhCUBSIHNgIIAkAgBw0AIAAgCRBSQX8hBwwBCyAJIAEpAwA3AwAgACgC9AEgBEECdGogCTYCACAAIAAtAAZBIHI6AAYgAyAENgIkIAMgCDYCIEHXwgAgA0EgahA7IAQhBwsgAyABKQMANwMYIAAgA0EYahCPASAHIQQLIANBgAFqJAAgBAsTAEEAQQAoAqyAAiAAcjYCrIACCxYAQQBBACgCrIACIABBf3NxNgKsgAILCQBBACgCrIACCzgBAX8CQAJAIAAvAQ5FDQACQCAAKQIEEPEFUg0AQQAPC0EAIQEgACkCBBDXAlENAQtBASEBCyABCx8BAX8gACABIAAgAUEAQQAQ5AIQHyICQQAQ5AIaIAIL+gMBCn8jAEEQayIEJABBACEFAkAgAkUNACACQSI6AAAgAkEBaiEFCyAFIQICQAJAIAENACACIQZBASEHQQAhCAwBC0EAIQVBACEJQQEhCiACIQIDQCACIQIgCiELIAkhCSAEIAAgBSIKaiwAACIFOgAPAkACQAJAAkACQAJAAkACQCAFQXdqDhoCAAUFAQUFBQUFBQUFBQUFBQUFBQUFBQUFBAMLIARB7gA6AA8MAwsgBEHyADoADwwCCyAEQfQAOgAPDAELIAVB3ABHDQELIAtBAmohBQJAAkAgAg0AQQAhDAwBCyACQdwAOgAAIAIgBC0ADzoAASACQQJqIQwLIAUhBQwBCwJAIAVBIEgNAAJAAkAgAg0AQQAhAgwBCyACIAU6AAAgAkEBaiECCyACIQwgC0EBaiEFIAkgBC0AD0HAAXFBgAFGaiECDAILIAtBBmohBQJAIAINAEEAIQwgBSEFDAELIAJB3OrBgQM2AAAgAkEEaiAEQQ9qQQEQ/AUgAkEGaiEMIAUhBQsgCSECCyAMIgshBiAFIgwhByACIgIhCCAKQQFqIg0hBSACIQkgDCEKIAshAiANIAFHDQALCyAIIQUgByECAkAgBiIJRQ0AIAlBIjsAAAsgAkECaiECAkAgA0UNACADIAIgBWs2AgALIARBEGokACACC8YDAgV/AX4jAEEwayIFJAACQCACIANqLQAADQAgBUEAOgAuIAVBADsBLCAFQQA2AiggBSADNgIkIAUgAjYCICAFIAI2AhwgBSABNgIYIAVBEGogBUEYahDmAgJAIAUtAC4NACAFKAIgIQEgBSgCJCEGA0AgAiEHIAEhAgJAAkAgBiIDDQAgBUH//wM7ASwgAiECIAMhA0F/IQEMAQsgBSACQQFqIgE2AiAgBSADQX9qIgM2AiQgBSACLAAAIgY7ASwgASECIAMhAyAGIQELIAMhBiACIQgCQAJAIAEiCUF3aiIBQRdLDQAgByECQQEhA0EBIAF0QZOAgARxDQELIAkhAkEAIQMLIAghASAGIQYgAiIIIQIgAw0ACyAIQX9GDQAgBUEBOgAuCwJAAkAgBS0ALkUNAAJAIAQNAEIAIQoMAgsCQCAFLgEsIgJBf0cNACAFQQhqIAUoAhhBoQ5BABDcA0IAIQoMAgsgBSACNgIAIAUgBSgCHEF/cyAFKAIgajYCBCAFQQhqIAUoAhhBmsIAIAUQ3ANCACEKDAELIAUpAxAhCgsgACAKNwMAIAVBMGokAA8LQYndAEH/yABB8QJBzzMQ/gUAC8ISAwl/AX4BfCMAQYABayICJAACQAJAIAEtABZFDQAgAEIANwMADAELIAEoAgwhAwNAIAUhBAJAAkAgAyIFDQAgAUH//wM7ARQgBSEFQX8hBgwBCyABIAVBf2oiBTYCDCABIAEoAggiBkEBajYCCCABIAYsAAAiBjsBFCAFIQUgBiEGCyAFIQMCQAJAIAYiB0F3aiIIQRdLDQAgBCEFQQEhBkEBIAh0QZOAgARxDQELIAchBUEAIQYLIAMhAyAFIgQhBSAGDQALAkACQAJAAkACQAJAAkAgBEEiRg0AAkAgBEHbAEYNACAEQfsARw0CAkAgASgCACIJQQAQkAEiCg0AIABCADcDAAwJCyACQfgAaiAJQQggChDnAyABLQAWQf8BcSEIA0AgBSEGQX8hBQJAIAgNAAJAIAEoAgwiBQ0AIAFB//8DOwEUQX8hBQwBCyABIAVBf2o2AgwgASABKAIIIgVBAWo2AgggASAFLAAAIgU7ARQgBSEFCwJAAkAgBSIEQXdqIgNBF0sNACAGIQVBASEGQQEgA3RBk4CABHENAQsgBCEFQQAhBgsgBSIDIQUgBg0ACwJAIANBf0YNACADQf0ARg0EIAEgASgCCEF/ajYCCCABIAEoAgxBAWo2AgwLIAIgAikDeDcDQCAJIAJBwABqEI4BAkADQCABLQAWIQgDQCAFIQYCQAJAIAhB/wFxRQ0AQX8hBQwBCwJAIAEoAgwiBQ0AIAFB//8DOwEUQX8hBQwBCyABIAVBf2o2AgwgASABKAIIIgVBAWo2AgggASAFLAAAIgU7ARQgBSEFCwJAAkAgBSIEQXdqIgNBF0sNACAGIQVBASEGQQEgA3RBk4CABHENAQsgBCEFQQAhBgsgBSIDIQUgBg0ACyADQSJHDQEgAkHwAGogARDnAgJAAkAgAS0AFkUNAEEEIQUMAQsgASgCDCEDA0AgBSEEAkACQCADIgUNACABQf//AzsBFCAFIQVBfyEGDAELIAEgBUF/aiIFNgIMIAEgASgCCCIGQQFqNgIIIAEgBiwAACIGOwEUIAUhBSAGIQYLIAUhAwJAAkAgBiIHQXdqIghBF0sNACAEIQVBASEGQQEgCHRBk4CABHENAQsgByEFQQAhBgsgAyEDIAUiBCEFIAYNAAtBBCEFIARBOkcNACACIAIpA3A3AzggCSACQThqEI4BIAJB6ABqIAEQ5gICQCABLQAWDQAgAiACKQNoNwMwIAkgAkEwahCOASACIAIpA3A3AyggAiACKQNoNwMgIAkgCiACQShqIAJBIGoQ8AIgAiACKQNoNwMYIAkgAkEYahCPAQsgAiACKQNwNwMQIAkgAkEQahCPAUEEIQUCQCABLQAWDQAgASgCDCEDA0AgBSEEAkACQCADIgUNACABQf//AzsBFCAFIQVBfyEGDAELIAEgBUF/aiIFNgIMIAEgASgCCCIGQQFqNgIIIAEgBiwAACIGOwEUIAUhBSAGIQYLIAUhAwJAAkAgBiIHQXdqIghBF0sNACAEIQVBASEGQQEgCHRBk4CABHENAQsgByEFQQAhBgsgAyEDIAUiBCEFIAYNAAtBA0ECQQQgBEH9AEYbIARBLEYbIQULIAUhBQsgBSIFQQNGDQALAkAgBUF+ag4DAAoBCgsgAiACKQN4NwMAIAkgAhCPASACKQN4IQsMCAsgAiACKQN4NwMIIAkgAkEIahCPASABQQE6ABZCACELDAcLAkAgASgCACIHQQAQkgEiCQ0AIABCADcDAAwICyACQfgAaiAHQQggCRDnAyABLQAWQf8BcSEIA0AgBSEGQX8hBQJAIAgNAAJAIAEoAgwiBQ0AIAFB//8DOwEUQX8hBQwBCyABIAVBf2o2AgwgASABKAIIIgVBAWo2AgggASAFLAAAIgU7ARQgBSEFCwJAAkAgBSIEQXdqIgNBF0sNACAGIQVBASEGQQEgA3RBk4CABHENAQsgBCEFQQAhBgsgBSIDIQUgBg0ACwJAIANBf0YNACADQd0ARg0EIAEgASgCCEF/ajYCCCABIAEoAgxBAWo2AgwLIAIgAikDeDcDYCAHIAJB4ABqEI4BA0AgAkHwAGogARDmAkEEIQUCQCABLQAWDQAgAiACKQNwNwNYIAcgCSACQdgAahCcAyABLQAWIQgDQCAFIQYCQAJAIAhB/wFxRQ0AQX8hBQwBCwJAIAEoAgwiBQ0AIAFB//8DOwEUQX8hBQwBCyABIAVBf2o2AgwgASABKAIIIgVBAWo2AgggASAFLAAAIgU7ARQgBSEFCwJAAkAgBSIEQXdqIgNBF0sNACAGIQVBASEGQQEgA3RBk4CABHENAQsgBCEFQQAhBgsgBSIDIQUgBg0AC0EDQQJBBCADQd0ARhsgA0EsRhshBQsgBSIFQQNGDQALAkACQCAFQX5qDgMACQEJCyACIAIpA3g3A0ggByACQcgAahCPASACKQN4IQsMBgsgAiACKQN4NwNQIAcgAkHQAGoQjwEgAUEBOgAWQgAhCwwFCyAAIAEQ5wIMBgsCQAJAAkACQCABLwEUIgVBmn9qDg8CAwMDAwMDAwADAwMDAwEDCwJAIAEoAgwiBkEDSQ0AIAEoAggiA0GtKUEDELYGDQAgASAGQX1qNgIMIAEgA0EDajYCCCAAQQApA4CLATcDAAwJCyAFQZp/ag4PAQICAgICAgICAgICAgIAAgsCQCABKAIMIgZBA0kNACABKAIIIgNBsjJBAxC2Bg0AIAEgBkF9ajYCDCABIANBA2o2AgggAEEAKQPgigE3AwAMCAsgBUHmAEcNAQsgASgCDCIFQQRJDQAgASgCCCIGKAAAQeHYzasGRw0AIAEgBUF8ajYCDCABIAZBBGo2AgggAEEAKQPoigE3AwAMBgsCQAJAIARBLUYNACAEQVBqQQlLDQELIAEoAghBf2ogAkH4AGoQ4QYhDAJAIAIoAngiBSABKAIIIgZBf2pHDQAgAUEBOgAWIABCADcDAAwHCyABKAIMIAYgBWtqIgZBf0wNAyABIAU2AgggASAGNgIMIAAgDBDkAwwGCyABQQE6ABYgAEIANwMADAULIAIpA3ghCwwDCyACKQN4IQsMAQtBitwAQf/IAEHhAkHpMhD+BQALIAAgCzcDAAwBCyAAIAs3AwALIAJBgAFqJAALjQEBA38gAUEANgIQIAEoAgwhAiABKAIIIQMCQAJAAkAgAUEAEOoCIgRBAWoOAgABAgsgAUEBOgAWIABCADcDAA8LIABBABDFAw8LIAEgAjYCDCABIAM2AggCQCABKAIAIgIgACAEIAEoAhAQlgEiA0UNACABQQA2AhAgAiAAIAEgAxDqAiABKAIQEJcBCwuYAgIDfwF+IwBBwABrIgUkACAFIAIpAwAiCDcDGCAFQTRqIgZCADcCACAFIAg3AxAgBUIANwIsIAUgA0EARyIHNgIoIAUgAzYCJCAFIAE2AiAgBUEgaiAFQRBqEOkCAkACQAJAIAYoAgANACAFKAIsIgZBf0cNAQsCQCAERQ0AIAVBIGogAUG41QBBABDVAwsgAEIANwMADAELIAEgACAGIAUoAjgQlgEiBkUNACAFIAIpAwAiCDcDGCAFIAg3AwggBUIANwI0IAUgBjYCMCAFQQA2AiwgBSAHNgIoIAUgAzYCJCAFIAE2AiAgBUEgaiAFQQhqEOkCIAEgAEF/IAUoAiwgBSgCNBsgBSgCOBCXAQsgBUHAAGokAAvACQEJfyMAQfAAayICJAAgACgCACEDIAIgASkDADcDWAJAAkAgAyACQdgAahCNAUUNACAAQQE2AhQMAQsgACgCFA0AAkACQCAAKAIQIgQNAEEAIQQMAQsgBCAAKAIMaiEECyAEIQQgAiABKQMANwNQAkACQAJAAkAgAyACQdAAahDxAw4NAQADAwMDAQMDAgMDAQMLIAEoAgRBj4DA/wdxDQACQCABKAIAIgVBvn9qQQJJDQAgBUECRw0BCyABQQApA4CLATcDAAsgAiABKQMANwNAIAJB6ABqIAMgAkHAAGoQyQMgASACKQNoNwMAIAIgASkDADcDOCADIAJBOGogAkHoAGoQxAMhAQJAIARFDQAgBCABIAIoAmgQnAYaCyAAIAAoAgwgAigCaCIBajYCDCAAIAEgACgCGGo2AhgMAgsgAiABKQMANwNIIAAgAyACQcgAaiACQegAahDEAyACKAJoIAQgAkHkAGoQ5AIgACgCDGpBf2o2AgwgACACKAJkIAAoAhhqQX9qNgIYDAELIAIgASkDADcDMCADIAJBMGoQjgEgAiABKQMANwMoAkACQAJAIAMgAkEoahDwA0UNACACIAEpAwA3AxggAyACQRhqEO8DIQYCQCAAKAIQRQ0AIAAoAhAgACgCDGpB2wA6AAALIAAgACgCDEEBajYCDCAAIAAoAhhBAWo2AhggACAAKAIIIAAoAgRqNgIIIABBGGohByAAQQxqIQgCQCAGLwEIRQ0AQQAhBANAIAQhCQJAIAAoAghFDQACQCAAKAIQIgRFDQAgBCAIKAIAakEKOgAACyAAIAAoAgxBAWo2AgwgACAAKAIYQQFqNgIYIAAoAghBf2ohCgJAIAAoAhBFDQBBACEEIApFDQADQCAAKAIQIAAoAgwgBCIEampBIDoAACAEQQFqIgUhBCAFIApHDQALCyAIIAgoAgAgCmo2AgAgByAHKAIAIApqNgIACyACIAYoAgwgCUEDdGopAwA3AxAgACACQRBqEOkCIAAoAhQNAQJAIAkgBi8BCEF/akYNAAJAIAAoAhBFDQAgACgCECAAKAIMakEsOgAACyAIIAgoAgBBAWo2AgAgByAHKAIAQQFqNgIACyAJQQFqIgUhBCAFIAYvAQhJDQALCyAAIAAoAgggACgCBGs2AggCQCAGLwEIRQ0AIAAQ6wILIAghCkHdACEJIAchBiAIIQQgByEFIAAoAhANAQwCCyACIAEpAwA3AyAgAyACQSBqEJEDIQQCQCAAKAIQRQ0AIAAoAhAgACgCDGpB+wA6AAALIAAgACgCDEEBaiIFNgIMIAAgACgCGEEBajYCGAJAIARFDQAgACAAKAIIIAAoAgRqNgIIIAMgBCAAQRAQ7QIaIAAgACgCCCAAKAIEazYCCCAFIAAoAgwiBEYNACAAIARBf2o2AgwgACAAKAIYQX9qNgIYIAAQ6wILIABBDGoiBCEKQf0AIQkgAEEYaiIFIQYgBCEEIAUhBSAAKAIQRQ0BCyAAKAIQIAAoAgxqIAk6AAAgCiEEIAYhBQsgBCIAIAAoAgBBAWo2AgAgBSIAIAAoAgBBAWo2AgAgAiABKQMANwMIIAMgAkEIahCPAQsgAkHwAGokAAvQBwEKfyMAQRBrIgIkACABIQFBACEDQQAhBAJAA0AgBCEEIAMhBSABIQNBfyEBAkAgAC0AFiIGDQACQCAAKAIMIgENACAAQf//AzsBFEF/IQEMAQsgACABQX9qNgIMIAAgACgCCCIBQQFqNgIIIAAgASwAACIBOwEUIAEhAQsCQAJAIAEiAUF/Rg0AAkACQCABQdwARg0AIAEhByABQSJHDQEgAyEBIAUhCCAEIQlBAiEKDAMLAkACQCAGRQ0AQX8hAQwBCwJAIAAoAgwiAQ0AIABB//8DOwEUQX8hAQwBCyAAIAFBf2o2AgwgACAAKAIIIgFBAWo2AgggACABLAAAIgE7ARQgASEBCyABIgshByADIQEgBSEIIAQhCUEBIQoCQAJAAkACQAJAAkAgC0Feag5UBggICAgICAgICAgICAYICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAYICAgICAIICAgDCAgICAgICAUICAgBCAAECAtBCSEHDAULQQ0hBwwEC0EIIQcMAwtBDCEHDAILQQAhAQJAA0AgASEBQX8hCAJAIAYNAAJAIAAoAgwiCA0AIABB//8DOwEUQX8hCAwBCyAAIAhBf2o2AgwgACAAKAIIIghBAWo2AgggACAILAAAIgg7ARQgCCEIC0F/IQkgCCIIQX9GDQEgAkELaiABaiAIOgAAIAFBAWoiCCEBIAhBBEcNAAsgAkEAOgAPIAJBCWogAkELahD9BSEBIAItAAlBCHQgAi0ACnJBfyABQQJGGyEJCyAJIglBf0YNAgJAAkAgCUGAeHEiAUGAuANGDQACQCABQYCwA0YNACAEIQEgCSEEDAILIAMhASAFIQggBCAJIAQbIQlBAUEDIAQbIQoMBQsCQCAEDQAgAyEBIAUhCEEAIQlBASEKDAULQQAhASAEQQp0IAlqQYDIgGVqIQQLIAEhCSAEIAJBBWoQ3wMhBCAAIAAoAhBBAWo2AhACQAJAIAMNAEEAIQEMAQsgAyACQQVqIAQQnAYgBGohAQsgASEBIAQgBWohCCAJIQlBAyEKDAMLQQohBwsgByEBIAQNAAJAAkAgAw0AQQAhBAwBCyADIAE6AAAgA0EBaiEECyAEIQQCQCABQcABcUGAAUYNACAAIAAoAhBBAWo2AhALIAQhASAFQQFqIQhBACEJQQAhCgwBCyADIQEgBSEIIAQhCUEBIQoLIAEhASAIIgghAyAJIgkhBEF/IQUCQCAKDgQBAgABAgsLQX8gCCAJGyEFCyACQRBqJAAgBQukAQEDfwJAIAAoAghFDQACQCAAKAIQRQ0AIAAoAhAgACgCDGpBCjoAAAsgACAAKAIMQQFqNgIMIAAgACgCGEEBajYCGCAAKAIIQX9qIQECQCAAKAIQRQ0AIAFFDQBBACECA0AgACgCECAAKAIMIAIiAmpqQSA6AAAgAkEBaiIDIQIgAyABRw0ACwsgACAAKAIMIAFqNgIMIAAgACgCGCABajYCGAsLxQMBA38jAEEgayIEJAAgBCACKQMANwMYAkAgACAEQRhqEMEDRQ0AIAQgAykDADcDEAJAIAAgBEEQahDxAyIAQQtLDQBBASAAdEGBEnENAQsCQCABKAIIRQ0AAkAgASgCECIARQ0AIAAgASgCDGpBCjoAAAsgASABKAIMQQFqNgIMIAEgASgCGEEBajYCGCABKAIIQX9qIQUCQCABKAIQRQ0AIAVFDQBBACEAA0AgASgCECABKAIMIAAiAGpqQSA6AAAgAEEBaiIGIQAgBiAFRw0ACwsgASABKAIMIAVqNgIMIAEgASgCGCAFajYCGAsgBCACKQMANwMIIAEgBEEIahDpAgJAIAEoAhBFDQAgASgCECABKAIMakE6OgAACyABIAEoAgxBAWo2AgwgASABKAIYQQFqNgIYAkAgASgCCEUNAAJAIAEoAhBFDQAgASgCECABKAIMakEgOgAACyABIAEoAgxBAWo2AgwgASABKAIYQQFqNgIYCyAEIAMpAwA3AwAgASAEEOkCAkAgASgCEEUNACABKAIQIAEoAgxqQSw6AAALIAEgASgCDEEBajYCDCABIAEoAhhBAWo2AhgLIARBIGokAAveBAEHfyMAQTBrIgQkAEEAIQUgASEBAkADQCAFIQYCQCABIgcgACgA5AEiBSAFKAJgamsgBS8BDkEEdE8NAEEAIQUMAgsCQAJAIAdBkPgAa0EMbUErSw0AAkACQCAHKAIIIgUvAQAiAQ0AIAUhCAwBCyABIQEgBSEFA0AgBSEFIAEhAQJAIANFDQAgBEEoaiABQf//A3EQxQMgBS8BAiIBIQkCQAJAIAFBK0sNAAJAIAAgCRDuAiIJQZD4AGtBDG1BK0sNACAEQQA2AiQgBCABQeAAajYCIAwCCyAEQSBqIABBCCAJEOcDDAELIAFBz4YDTQ0FIAQgCTYCICAEQQM2AiQLIAQgBCkDKDcDCCAEIAQpAyA3AwAgACACIARBCGogBCADEQUACyAFLwEEIgkhASAFQQRqIgghBSAIIQggCQ0ACwsgCCAHKAIIa0ECdSEFDAMLAkACQCAHDQBBACEFDAELIActAANBD3EhBQsCQAJAIAVBfGoOBgEAAAAAAQALQejpAEGMxwBB1ABBuh8Q/gUACyAHLwEIIQoCQCADRQ0AIApFDQAgCkEBdCEIIAcoAgwhBUEAIQEDQCAEIAUgASIBQQN0IglqKQMANwMYIAQgBSAJQQhyaikDADcDECAAIAIgBEEYaiAEQRBqIAMRBQAgAUECaiIJIQEgCSAISQ0ACwsgCiEFAkAgBw0AIAUhBQwDCyAFIQUgBygCAEGAgID4AHFBgICAyABHDQIgBiAKaiEFIAcoAgQhAQwBCwtB3tUAQYzHAEHAAEHHMhD+BQALIARBMGokACAGIAVqC5wCAgF+A38CQCABQStLDQACQAJAQo79/ur/PyABrYgiAqdBAXENACABQdDyAGotAAAhAwJAIAAoAvgBDQAgAEEwEIoBIQQgAEEMOgBEIAAgBDYC+AEgBA0AQQAhAwwBCyADQX9qIgRBDE8NASAAKAL4ASAEQQJ0aigCACIFIQMgBQ0AAkAgAEEJQRAQiQEiAw0AQQAhAwwBCyAAKAL4ASAEQQJ0aiADNgIAIANBkPgAIAFBDGxqIgBBACAAKAIIGzYCBCADIQMLIAMhAAJAIAJCAYNQDQAgAUEsTw0CQZD4ACABQQxsaiIBQQAgASgCCBshAAsgAA8LQZjVAEGMxwBBlgJBwxQQ/gUAC0He0QBBjMcAQfUBQcIkEP4FAAsOACAAIAIgAUEREO0CGgu4AgEDfyMAQSBrIgQkACAEIAIpAwA3AxACQAJAAkAgACABIARBEGoQ8QIiBUUNACAFIAMpAwA3AwAMAQsgBCACKQMANwMIAkAgACAEQQhqEMEDDQAgBCACKQMANwMAIARBGGogAEHCACAEENkDDAELIAEvAQoiBSABLwEIIgZJDQECQCAFIAZHDQAgACAFQQpsQQN2IgVBBCAFQQRLGyIGQQR0EIoBIgVFDQEgASAGOwEKAkAgAS8BCCIGRQ0AIAUgASgCDCAGQQR0EJwGGgsgASAFNgIMIAAoAqACIAUQiwELIAEoAgwgAS8BCEEEdGogAikDADcDACABKAIMIAEvAQhBBHRqQQhqIAMpAwA3AwAgASABLwEIQQFqOwEICyAEQSBqJAAPC0HKK0GMxwBBoAFBwRMQ/gUAC+wCAgl/AX4jAEEgayIDJAAgAyACKQMANwMQQQAhBAJAIAAgA0EQahDBA0UNACABLwEIIgVBAEchBCAFQQF0IQYgASgCDCEHAkACQCAFDQAgBCEIDAELIAIoAgAhCSACKQMAIQwgBCEBQQAhCgNAIAEhCAJAIAcgCiIEQQN0aiIBKAAAIAlHDQAgASkDACAMUg0AIAghCCAHIARBA3RBCHJqIQsMAgsgBEECaiIKIAZJIgQhASAKIQogBCEIIAQNAAsLIAshBCAIQQFxDQAgAyACKQMANwMIIAAgA0EIaiADQRxqEMQDIQgCQAJAIAUNAEEAIQQMAQtBACEEA0AgAyAHIAQiBEEDdGopAwA3AwAgACADIANBGGoQxAMhAQJAIAMoAhggAygCHCIKRw0AIAggASAKELYGDQAgByAEQQN0QQhyaiEEDAILIARBAmoiASEEIAEgBkkNAAtBACEECyAEIQQLIANBIGokACAEC3EBAX8CQAJAIAFFDQAgAUGQ+ABrQQxtQSxJDQBBACECIAEgACgA5AEiACAAKAJgamsgAC8BDkEEdEkNAUEBIQICQCABLQADQQ9xQXxqDgYCAAAAAAIAC0Ho6QBBjMcAQfkAQYQjEP4FAAtBACECCyACC1wBAn8jAEEQayIEJAAgAi8BCCEFIAQgAjYCCCAEIAM6AAQgBCAFNgIAIAAgAUEAQQAQ7QIhAwJAIAAgAiAEKAIAIAMQ9AINACAAIAEgBEESEO0CGgsgBEEQaiQAC+kCAQZ/IwBBEGsiBCQAAkACQCADQYE4SA0AIARBCGogAEEPENsDQXwhAwwBCwJAQQAgAS8BCCIFayADIAUgA2oiBkEASBsiA0UNAAJAIAZBACAGQQBKGyIGQYE4SQ0AIARBCGogAEEPENsDQXohAwwCCwJAIAYgAS8BCk0NAAJAIAAgBkEKbEEDdiIHQQQgB0EESxsiCEEDdBCKASIHDQBBeyEDDAMLAkAgASgCDCIJRQ0AIAcgCSABLwEIQQN0EJwGGgsgASAIOwEKIAEgBzYCDCAAKAKgAiAHEIsBCyABLwEIIAUgAiAFIAJJGyIAayECAkACQCADQX9KDQAgASgCDCAAQQN0aiIAIAAgA0EDdGsgAiADakEDdBCdBhoMAQsgASgCDCAAQQN0IgBqIgUgA0EDdCIDaiAFIAJBA3QQnQYaIAEoAgwgAGpBACADEJ4GGgsgASAGOwEIC0EAIQMLIARBEGokACADCzUBAn8gASgCCCgCDCEEIAEgASgCACIFQQFqNgIAIAQgBUEDdGogAiADIAEtAAQbKQMANwMAC+ECAQZ/IAEvAQohBAJAAkAgAS8BCCIFDQBBACEGDAELIAEoAgwiByAEQQN0aiEIQQAhBgNAAkAgCCAGIgZBAXRqLwEAIAJHDQAgByAGQQN0aiEGDAILIAZBAWoiCSEGIAkgBUcNAAtBACEGCwJAIAYiBkUNACAGIAMpAwA3AwAPCwJAIAQgBUkNAAJAAkAgBCAFRw0AIAAgBEEKbEEDdiIGQQQgBkEESxsiCUEKbBCKASIGRQ0BIAEvAQohBSABIAk7AQoCQCABLwEIIghFDQAgBiABKAIMIgQgCEEDdBCcBiAJQQN0aiAEIAVBA3RqIAEvAQhBAXQQnAYaCyABIAY2AgwgACgCoAIgBhCLAQsgASgCDCABLwEIQQN0aiADKQMANwMAIAEoAgwgAS8BCkEDdGogAS8BCEEBdGogAjsBACABIAEvAQhBAWo7AQgLDwtByitBjMcAQbsBQa4TEP4FAAuAAQECfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAAgASADQQhqEPECIgINAEF/IQEMAQsgASABLwEIIgBBf2o7AQgCQCAAIAJBeGoiBCABKAIMa0EDdUEBdkF/c2oiAUUNACAEIAJBCGogAUEEdBCdBhoLQQAhAQsgA0EQaiQAIAELiQECBH8BfgJAAkAgAi8BCCIEDQBBACECDAELIAIoAgwiBSACLwEKQQN0aiEGQQAhAgNAAkAgBiACIgJBAXRqLwEAIANHDQAgBSACQQN0aiECDAILIAJBAWoiByECIAcgBEcNAAtBACECCwJAAkAgAiICDQBCACEIDAELIAIpAwAhCAsgACAINwMACxgAIABBBjYCBCAAIAJBD3RB//8BcjYCAAtLAAJAIAIgASgA5AEiASABKAJgamsiAkEEdSABLwEOSQ0AQYwYQYzHAEG3AkHYxQAQ/gUACyAAQQY2AgQgACACQQt0Qf//AXI2AgALWAACQCACDQAgAEIANwMADwsCQCACIAEoAOQBIgEgASgCYGprIgJBgIACTw0AIABBBjYCBCAAIAJBDXRB//8BcjYCAA8LQcXqAEGMxwBBwAJBqcUAEP4FAAtJAQJ/AkAgASgCBCICQYCAwP8HcUUNAEF/DwtBfyEDAkAgAkEPcUEGRw0AIAEoAgBBD3YiAUF/IAEgACgC5AEvAQ5JGyEDCyADC3IBAn8CQAJAIAEoAgQiAkGAgMD/B3FFDQBBfyEDDAELQX8hAyACQQ9xQQZHDQAgASgCAEEPdiIBQX8gASAAKALkAS8BDkkbIQMLQQAhAQJAIAMiA0EASA0AIAAoAOQBIgEgASgCYGogA0EEdGohAQsgAQuaAQEBfwJAIAJFDQAgAkH//wE2AgALAkAgASgCBCIDQYCAwP8HcUUNAEEADwsCQCADQQ9xQQZGDQBBAA8LAkACQCABKAIAQQ92IAAoAuQBLwEOTw0AQQAhAyAAKADkAQ0BCyABKAIAIQECQCACRQ0AIAIgAUH//wFxNgIACyAAKADkASICIAIoAmBqIAFBDXZB/P8fcWohAwsgAwtoAQR/AkAgACgC5AEiAC8BDiICDQBBAA8LIAAgACgCYGohA0EAIQQCQANAIAMgBCIFQQR0aiIEIAAgBCgCBCIAIAFGGyEEIAAgAUYNASAEIQAgBUEBaiIFIQQgBSACRw0AC0EADwsgBAveAQEIfyAAKALkASIALwEOIgJBAEchAwJAAkAgAg0AIAMhBAwBCyAAIAAoAmBqIQUgAyEGQQAhBwNAIAghCCAGIQkCQAJAIAEgBSAFIAciA0EEdGoiBy8BCkECdGprIgRBAEgNAEEAIQYgAyEAIAQgBy8BCEEDdEgNAQtBASEGIAghAAsgACEAAkAgBkUNACADQQFqIgMgAkkiBCEGIAAhCCADIQcgBCEEIAAhACADIAJGDQIMAQsLIAkhBCAAIQALIAAhAAJAIARBAXENAEGMxwBB+wJB2xEQ+QUACyAAC9wBAQR/AkACQCABQYCAAkkNAEEAIQIgAUGAgH5qIgMgACgC5AEiAS8BDk8NASABIAEoAmBqIANBBHRqDwtBACECAkAgAC8BTCABTQ0AIAAoAvQBIAFBAnRqKAIAIQILAkAgAiIBDQBBAA8LQQAhAiAAKALkASIALwEOIgRFDQAgASgCCCgCCCEBIAAgACgCYGohBUEAIQICQANAIAUgAiIDQQR0aiICIAAgAigCBCIAIAFGGyECIAAgAUYNASACIQAgA0EBaiIDIQIgAyAERw0AC0EADwsgAiECCyACC0ABAX9BACECAkAgAC8BTCABTQ0AIAAoAvQBIAFBAnRqKAIAIQILQQAhAAJAIAIiAUUNACABKAIIKAIQIQALIAALPAEBf0EAIQICQCAALwFMIAFNDQAgACgC9AEgAUECdGooAgAhAgsCQCACIgANAEGn2QAPCyAAKAIIKAIEC1cBAX9BACECAkACQCABKAIEQfP///8BRg0AIAEvAQJBD3EiAUECTw0BIAAoAOQBIgIgAigCYGogAUEEdGohAgsgAg8LQdHSAEGMxwBBqANBxcUAEP4FAAuPBgELfyMAQSBrIgQkACABQeQBaiEFIAIhAgJAAkACQAJAAkACQANAIAIiBkUNASAGIAUoAAAiAiACKAJgaiIHayACLwEOQQR0Tw0DIAcgBi8BCkECdGohCCAGLwEIIQkCQAJAIAMoAgQiAkGAgMD/B3ENACACQQ9xQQRHDQAgCUEARyECAkACQCAJDQAgAiECQQAhCgwBC0EAIQogAiECIAghCwJAAkAgAygCACIMIAgvAQBGDQADQCAKQQFqIgIgCUYNAiACIQogDCAIIAJBA3RqIgsvAQBHDQALIAIgCUkhAiALIQsLIAIhAiALIAdrIgpBgIACTw0IIABBBjYCBCAAIApBDXRB//8BcjYCACACIQJBASEKDAELIAIgCUkhAkEAIQoLIAohCiACRQ0AIAohCSAGIQIMAQsgBCADKQMANwMQIAEgBEEQaiAEQRhqEMQDIQ0CQAJAAkACQAJAIAQoAhhFDQAgCUEARyICIQpBACEMIAkNASACIQIMAgsgAEIANwMAQQEhAiAGIQoMAwsDQCAKIQcgCCAMIgxBA3RqIg4vAQAhAiAEKAIYIQogBCAFKAIANgIMIARBDGogAiAEQRxqEIgEIQICQCAKIAQoAhwiC0cNACACIA0gCxC2Bg0AIA4gBSgAACICIAIoAmBqayICQYCAAk8NCyAAQQY2AgQgACACQQ10Qf//AXI2AgAgByECQQEhCQwDCyAMQQFqIgIgCUkiCyEKIAIhDCACIAlHDQALIAshAgtBCSEJCyAJIQkCQCACQQFxRQ0AIAkhAiAGIQoMAQtBACECQQAhCiAGKAIEQfP///8BRg0AIAYvAQJBD3EiCUECTw0IQQAhAiAFKAAAIgogCigCYGogCUEEdGohCgsgAiEJIAohAgsgAiECIAlFDQAMAgsACyAAQgA3AwALIARBIGokAA8LQfnpAEGMxwBBrgNB5iEQ/gUAC0HF6gBBjMcAQcACQanFABD+BQALQcXqAEGMxwBBwAJBqcUAEP4FAAtB0dIAQYzHAEGoA0HFxQAQ/gUAC8gGAgV/An4jAEEQayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EiBiAFQYCAwP8HcSIHGyIFQX1qDgcDAgIAAgIBAgsCQCACKAIEIghBgIDA/wdxDQAgCEEPcUECRw0AAkACQCAHRQ0AQX8hCAwBC0F/IQggBkEGRw0AIAMoAgBBD3YiB0F/IAcgASgC5AEvAQ5JGyEIC0EAIQcCQCAIIgZBAEgNACABKADkASIHIAcoAmBqIAZBBHRqIQcLIAcNACACKAIAIgJBgIACTw0FIAMoAgAhAyAAQQY2AgQgACADQYCAfnEgAnI2AgAMBAsgBUF9ag4HAgEBAQEBAAELIAIpAwAhCSADKQMAIQoCQCABQQdBGBCJASIDDQAgAEIANwMADAMLIAMgCjcDECADIAk3AwggACABQQggAxDnAwwCCyAAIAMpAwA3AwAMAQsgAygCACEHQQAhBQJAIAMoAgRBj4DA/wdxQQNHDQBBACEFIAdBsPl8aiIGQQBIDQAgBkEALwH47QFODQNBACEFQYD/ACAGQQN0aiIGLQADQQFxRQ0AIAYhBSAGLQACDQQLAkAgBSIFRQ0AIAUoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCwJAIAdB//8DSw0AAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcSIGGyIIDgkAAAAAAAIAAgECCyAGDQYgAigCACIDQYCAgIABTw0HIAVB8P8/cQ0IIAAgAyAIQRx0cjYCACAAIAdBBHRBBXI2AgQMAgsgBUHw/z9xDQggACACKAIANgIAIAAgB0EEdEEKcjYCBAwBCyACKQMAIQkgAykDACEKAkAgAUEHQRgQiQEiAw0AIABCADcDAAwBCyADIAo3AxAgAyAJNwMIIAAgAUEIIAMQ5wMLIARBEGokAA8LQeU2QYzHAEGUBEGKOxD+BQALQfAWQYzHAEH/A0GlwwAQ/gUAC0HK3ABBjMcAQYIEQaXDABD+BQALQfchQYzHAEGvBEGKOxD+BQALQd7dAEGMxwBBsARBijsQ/gUAC0GW3QBBjMcAQbEEQYo7EP4FAAtBlt0AQYzHAEG3BEGKOxD+BQALMAACQCADQYCABEkNAEGWMEGMxwBBwARB6TQQ/gUACyAAIAEgA0EEdEEJciACEOcDCzIBAX8jAEEQayIEJAAgBCABKQMANwMIIAAgBEEIaiACIANBABCJAyEBIARBEGokACABC7YFAgN/AX4jAEHQAGsiBSQAIANBADYCACACQgA3AwACQAJAAkACQCAEQQJMDQBBfyEGDAELIAEoAgAhBwJAAkACQAJAAkACQEEQIAEoAgQiBkEPcSAGQYCAwP8HcRtBfWoOCAAFAQUFBAMCBQsgAkIANwMAIAchBgwFCyACIAdBHHatQiCGIAdB/////wBxrYQ3AwAgBkEEdkH//wNxIQYMBAsgAiAHrUKAgICAgAGENwMAIAZBBHZB//8DcSEGDAMLIAMgBzYCACAGQQR2Qf//A3EhBgwCCwJAIAcNAEF/IQYMAgtBfyEGIAcoAgBBgICA+ABxQYCAgDhHDQEgBSAHKQMQNwMoIAAgBUEoaiACIAMgBEEBahCJAyEDIAIgBykDCDcDACADIQYMAQsgBSABKQMANwMgQX8hBiAFQSBqEPIDDQAgBSABKQMANwM4IAVBwABqQdgAEMUDIAAgBSkDQDcDMCAFIAUpAzgiCDcDGCAFIAg3A0ggACAFQRhqQQAQigMhBiAAQgA3AzAgBSAFKQNANwMQIAVByABqIAAgBiAFQRBqEIsDQQAhBgJAIAUoAkxBj4DA/wdxQQNHDQBBACEGIAUoAkhBsPl8aiIHQQBIDQAgB0EALwH47QFODQJBACEGQYD/ACAHQQN0aiIHLQADQQFxRQ0AIAchBiAHLQACDQMLAkACQCAGIgZFDQAgBigCBCEGIAUgBSkDODcDCCAFQTBqIAAgBUEIaiAGEQEADAELIAUgBSkDSDcDMAsCQAJAIAUpAzBQRQ0AQX8hAgwBCyAFIAUpAzA3AwAgACAFIAIgAyAEQQFqEIkDIQMgAiABKQMANwMAIAMhAgsgAiEGCyAFQdAAaiQAIAYPC0HwFkGMxwBB/wNBpcMAEP4FAAtBytwAQYzHAEGCBEGlwwAQ/gUAC6cMAgl/AX4jAEGQAWsiAyQAIAMgASkDADcDaAJAAkACQAJAIANB6ABqEPMDRQ0AIAMgASkDACIMNwMwIAMgDDcDgAFB6C1B8C0gAkEBcRshBCAAIANBMGoQtQMQhwYhAQJAAkAgACkAMEIAUg0AIAMgBDYCACADIAE2AgQgA0GIAWogAEGoGiADENUDDAELIAMgAEEwaikDADcDKCAAIANBKGoQtQMhAiADIAQ2AhAgAyACNgIUIAMgATYCGCADQYgBaiAAQbgaIANBEGoQ1QMLIAEQIEEAIQQMAQsCQAJAAkACQEEQIAEoAgQiBEEPcSIFIARBgIDA/wdxIgQbQX5qDgcBAgICAAIDAgsgASgCACEGAkACQCABKAIEQY+AwP8HcUEGRg0AQQEhAUEAIQcMAQsCQCAGQQ92IAAoAuQBIggvAQ5PDQBBASEBQQAhByAIDQELIAZB//8BcUH//wFGIQEgCCAIKAJgaiAGQQ12Qfz/H3FqIQcLIAchBwJAAkAgAUUNAAJAIARFDQBBJyEBDAILAkAgBUEGRg0AQSchAQwCC0EnIQEgBkEPdiAAKALkAS8BDk8NAUElQScgACgA5AEbIQEMAQsgBy8BAiIBQYCgAk8NBUGHAiABQQx2IgF2QQFxRQ0FIAFBAnRBjPMAaigCACEBCyAAIAEgAhCPAyEEDAMLQQAhBAJAIAEoAgAiASAALwFMTw0AIAAoAvQBIAFBAnRqKAIAIQQLAkAgBCIFDQBBACEEDAMLIAUoAgwhBgJAIAJBAnFFDQAgBiEEDAMLIAYhBCAGDQJBACEEIAAgARCNAyIBRQ0CAkAgAkEBcQ0AIAEhBAwDCyAFIAAgARCQASIANgIMIAAhBAwCCyADIAEpAwA3A2ACQCAAIANB4ABqEPEDIgZBAkcNACABKAIEDQACQCABKAIAQaB/aiIHQStLDQAgACAHIAJBBHIQjwMhBAsgBCIEIQUgBCEEIAdBLEkNAgsgBSEJAkAgBkEIRw0AIAMgASkDACIMNwNYIAMgDDcDiAECQAJAAkAgACADQdgAaiADQYABaiADQfwAakEAEIkDIgpBAE4NACAJIQUMAQsCQAJAIAAoAtwBIgEvAQgiBQ0AQQAhAQwBCyABKAIMIgsgAS8BCkEDdGohByAKQf//A3EhCEEAIQEDQAJAIAcgASIBQQF0ai8BACAIRw0AIAsgAUEDdGohAQwCCyABQQFqIgQhASAEIAVHDQALQQAhAQsCQAJAIAEiAQ0AQgAhDAwBCyABKQMAIQwLIAMgDCIMNwOIAQJAIAJFDQAgDEIAUg0AIANB8ABqIABBCCAAQZD4AEHAAWpBAEGQ+ABByAFqKAIAGxCQARDnAyADIAMpA3AiDDcDiAEgDFANACADIAMpA4gBNwNQIAAgA0HQAGoQjgEgACgC3AEhASADIAMpA4gBNwNIIAAgASAKQf//A3EgA0HIAGoQ9gIgAyADKQOIATcDQCAAIANBwABqEI8BCyAJIQECQCADKQOIASIMUA0AIAMgAykDiAE3AzggACADQThqEO8DIQELIAEiBCEFQQAhASAEIQQgDEIAUg0BC0EBIQEgBSEECyAEIQQgAUUNAgtBACEBAkAgBkENSg0AIAZB/PIAai0AACEBCyABIgFFDQMgACABIAIQjwMhBAwBCwJAAkAgASgCACIBDQBBACEFDAELIAEtAANBD3EhBQsgASEEAkACQAJAAkACQAJAAkACQCAFQX1qDgsBCAYDBAUIBQIDAAULIAFBFGohAUEpIQQMBgsgAUEEaiEBQQQhBAwFCyABQRhqIQFBFCEEDAQLIABBCCACEI8DIQQMBAsgAEEQIAIQjwMhBAwDC0GMxwBBzQZBqj8Q+QUACyABQQhqIQFBBiEECyAEIQUgASIGKAIAIgQhAQJAIAQNAEEAIQEgAkEBcUUNACAGIAAgACAFEO4CEJABIgQ2AgAgBCEBIAQNAEEAIQQMAQsgASEBAkAgAkECcUUNACABIQQMAQsgASEEIAENACAAIAUQ7gIhBAsgA0GQAWokACAEDwtBjMcAQe8FQao/EPkFAAtByOEAQYzHAEGoBkGqPxD+BQALggkCB38BfiMAQcAAayIEJABBkPgAQagBakEAQZD4AEGwAWooAgAbIQVBACEGIAIhAgJAAkACQAJAA0AgBiEHAkAgAiIIDQAgByEHDAILAkACQCAIQZD4AGtBDG1BK0sNACAEIAMpAwA3AzAgCCEGIAgoAgBBgICA+ABxQYCAgPgARw0EAkACQANAIAYiCUUNASAJKAIIIQYCQAJAAkACQCAEKAI0IgJBgIDA/wdxDQAgAkEPcUEERw0AIAQoAjAiAkGAgH9xQYCAAUcNACAGLwEAIgdFDQEgAkH//wBxIQogByECIAYhBgNAIAYhBgJAIAogAkH//wNxRw0AIAYvAQIiBiECAkAgBkErSw0AAkAgASACEO4CIgJBkPgAa0EMbUErSw0AIARBADYCJCAEIAZB4ABqNgIgIAkhBkEADQgMCgsgBEEgaiABQQggAhDnAyAJIQZBAA0HDAkLIAZBz4YDTQ0OIAQgAjYCICAEQQM2AiQgCSEGQQANBgwICyAGLwEEIgchAiAGQQRqIQYgBw0ADAILAAsgBCAEKQMwNwMIIAEgBEEIaiAEQTxqEMQDIQogBCgCPCAKEMsGRw0BIAYvAQAiByECIAYhBiAHRQ0AA0AgBiEGAkAgAkH//wNxEIYEIAoQygYNACAGLwECIgYhAgJAIAZBK0sNAAJAIAEgAhDuAiICQZD4AGtBDG1BK0sNACAEQQA2AiQgBCAGQeAAajYCIAwGCyAEQSBqIAFBCCACEOcDDAULIAZBz4YDTQ0OIAQgAjYCICAEQQM2AiQMBAsgBi8BBCIHIQIgBkEEaiEGIAcNAAsLIAkoAgQhBkEBDQIMBAsgBEIANwMgCyAJIQZBAA0ADAILAAsgBEIANwMgCyAEIAQpAyA3AyggBEEoaiEGIAghAkEBIQoMAQsCQCAIIAEoAOQBIgYgBigCYGprIAYvAQ5BBHRPDQAgBCADKQMANwMQIARBMGogASAIIARBEGoQhQMgBCAEKQMwIgs3AygCQCALQgBRDQAgBEEoaiEGIAghAkEBIQoMAgsCQCABKAL4AQ0AIAFBMBCKASEGIAFBDDoARCABIAY2AvgBIAYNACAHIQZBACECQQAhCgwCCwJAIAEoAvgBKAIUIgJFDQAgByEGIAIhAkEAIQoMAgsCQCABQQlBEBCJASICDQAgByEGQQAhAkEAIQoMAgsgASgC+AEgAjYCFCACIAU2AgQgByEGIAIhAkEAIQoMAQsCQAJAIAgtAANBD3FBfGoOBgEAAAAAAQALQaXmAEGMxwBBuwdB8ToQ/gUACyAEIAMpAwA3AxgCQCABIAggBEEYahDxAiIGRQ0AIAYhBiAIIQJBASEKDAELQQAhBiAIKAIEIQJBACEKCyAGIgchBiACIQIgByEHIApFDQALCwJAAkAgByIGDQBCACELDAELIAYpAwAhCwsgACALNwMAIARBwABqJAAPC0G45gBBjMcAQcsDQdQhEP4FAAtB3tUAQYzHAEHAAEHHMhD+BQALQd7VAEGMxwBBwABBxzIQ/gUAC9oCAgd/AX4jAEEwayICJAACQAJAIAAoAuABIgMvAQgiBA0AQQAhAwwBCyADKAIMIgUgAy8BCkEDdGohBiABQf//A3EhB0EAIQMDQAJAIAYgAyIDQQF0ai8BACAHRw0AIAUgA0EDdGohAwwCCyADQQFqIgghAyAIIARHDQALQQAhAwsCQAJAIAMiAw0AQgAhCQwBCyADKQMAIQkLIAIgCSIJNwMoAkACQCAJUA0AIAIgAikDKDcDGCAAIAJBGGoQ7wMhAwwBCwJAIABBCUEQEIkBIgMNAEEAIQMMAQsgAkEgaiAAQQggAxDnAyACIAIpAyA3AxAgACACQRBqEI4BIAMgACgA5AEiCCAIKAJgaiABQQR0ajYCBCAAKALgASEIIAIgAikDIDcDCCAAIAggAUH//wNxIAJBCGoQ9gIgAiACKQMgNwMAIAAgAhCPASADIQMLIAJBMGokACADC4UCAQZ/QQAhAgJAIAAvAUwgAU0NACAAKAL0ASABQQJ0aigCACECC0EAIQECQAJAIAIiAkUNAAJAAkAgACgC5AEiAy8BDiIEDQBBACEBDAELIAIoAggoAgghASADIAMoAmBqIQVBACEGAkADQCAFIAYiB0EEdGoiBiACIAYoAgQiBiABRhshAiAGIAFGDQEgAiECIAdBAWoiByEGIAcgBEcNAAtBACEBDAELIAIhAQsCQAJAIAEiAQ0AQX8hAgwBCyABIAMgAygCYGprQQR1IgEhAiABIARPDQILQQAhASACIgJBAEgNACAAIAIQjAMhAQsgAQ8LQYwYQYzHAEHmAkHSCRD+BQALZAEBfyMAQRBrIgIkACACIAEpAwA3AwgCQCAAIAJBCGpBARCKAyIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB+OUAQYzHAEHhBkHFCxD+BQALIABCADcDMCACQRBqJAAgAQuwAwEBfyMAQeAAayIDJAACQAJAIAJBBnFBAkYNACAAIAEQ7gIhAQJAIAJBAXENACABIQIMAgsCQAJAIAJBBHFFDQACQCABQZD4AGtBDG1BK0sNAEHbFBCHBiECAkAgACkAMEIAUg0AIANB6C02AjAgAyACNgI0IANB2ABqIABBqBogA0EwahDVAyACIQIMAwsgAyAAQTBqKQMANwNQIAAgA0HQAGoQtQMhASADQegtNgJAIAMgATYCRCADIAI2AkggA0HYAGogAEG4GiADQcAAahDVAyACIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACyABIQICQCAAQXxqDgYEAAAAAAQAC0GF5gBBjMcAQZoFQdwkEP4FAAtBmjIQhwYhAgJAAkAgACkAMEIAUg0AIANB6C02AgAgAyACNgIEIANB2ABqIABBqBogAxDVAwwBCyADIABBMGopAwA3AyggACADQShqELUDIQEgA0HoLTYCECADIAE2AhQgAyACNgIYIANB2ABqIABBuBogA0EQahDVAwsgAiECCyACECALQQAhAgsgA0HgAGokACACCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakEAEIoDIQEgAEIANwMwIAJBEGokACABCzUBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIakECEIoDIQEgAEIANwMwIAJBEGokACABC6oCAQJ/AkACQCABQZD4AGtBDG1BK0sNACABKAIEIQIMAQsCQAJAIAEgACgA5AEiAiACKAJgamsgAi8BDkEEdE8NAAJAIAAoAvgBDQAgAEEwEIoBIQIgAEEMOgBEIAAgAjYC+AEgAg0AQQAhAgwDCyAAKAL4ASgCFCIDIQIgAw0CIABBCUEQEIkBIgINAUEAIQIMAgsCQAJAIAENAEEAIQAMAQsgAS0AA0EPcSEACwJAAkAgAEF8ag4GAQAAAAABAAtBjecAQYzHAEH6BkGrJBD+BQALIAEoAgQPCyAAKAL4ASACNgIUIAJBkPgAQagBakEAQZD4AEGwAWooAgAbNgIEIAIhAgtBACACIgBBkPgAQRhqQQBBkPgAQSBqKAIAGyAAGyIAIAAgAUYbC6IBAgF/AX4jAEEgayICJAAgAiABKQMANwMIIAJBEGogACACQQhqQTQQlAMCQAJAIAIpAxBCAFINAEEAIQEgAC0ARQ0BIAJBGGogAEGINUEAENUDQQAhAQwBCyACIAIpAxAiAzcDGCACIAM3AwAgACACQQIQigMhASAAQgA3AzACQCABDQAgAkEYaiAAQZY1QQAQ1QMLIAEhAQsgAkEgaiQAIAELrgICAn8BfiMAQTBrIgQkACAEQSBqIAMQxQMgASAEKQMgNwMwIAQgAikDACIGNwMYIAQgBjcDKCABIARBGGpBABCKAyEDIAFCADcDMCAEIAQpAyA3AxAgBEEoaiABIAMgBEEQahCLA0EAIQMCQAJAAkAgBCgCLEGPgMD/B3FBA0cNAEEAIQMgBCgCKEGw+XxqIgVBAEgNACAFQQAvAfjtAU4NAUEAIQNBgP8AIAVBA3RqIgUtAANBAXFFDQAgBSEDIAUtAAINAgsCQAJAIAMiA0UNACADKAIEIQMgBCACKQMANwMIIAAgASAEQQhqIAMRAQAMAQsgACAEKQMoNwMACyAEQTBqJAAPC0HwFkGMxwBB/wNBpcMAEP4FAAtBytwAQYzHAEGCBEGlwwAQ/gUAC+wBAgN/AX4jAEEgayIDJAACQAJAIAINAEEAIQQMAQsgAyABKQMANwMQQQAhBCADQRBqEPIDDQAgAyABKQMAIgY3AwggAyAGNwMYIAAgA0EIakEAEIoDIQQgAEIANwMwIAMgASkDACIGNwMAIAMgBjcDGCAAIANBAhCKAyEFIABCADcDMEEAIQECQCAERQ0AAkAgBCAFRg0AIAQhAQwBCyAAIAQQkgMhAQtBACEEIAEiAUUNACABIQEDQAJAIAEiASACRiIERQ0AIAQhBAwCCyAAIAEQkgMiBSEBIAQhBCAFDQALCyADQSBqJAAgBAuIAQICfwF+IwBBMGsiBCQAIAEgAykDADcDMCAEIAIpAwAiBjcDICAEIAY3AyggASAEQSBqQQAQigMhBSABQgA3AzAgBCADKQMANwMYIARBKGogASAFIARBGGoQiwMgBCACKQMANwMQIAQgBCkDKDcDCCAAIAEgBEEQaiAEQQhqEIYDIARBMGokAAudAgECfyMAQTBrIgQkAAJAAkAgA0GBwANJDQAgAEIANwMADAELIAQgAikDADcDIAJAIAEgBEEgaiAEQSxqEO4DIgVFDQAgBCgCLCADTQ0AIAQgAikDADcDEAJAIAEgBEEQahDBA0UNACAEIAIpAwA3AwgCQCABIARBCGogAxDdAyIDQX9KDQAgAEIANwMADAMLIAUgA2ohAyAAIAFBCCABIAMgAxDgAxCYARDnAwwCCyAAIAUgA2otAAAQ5QMMAQsgBCACKQMANwMYAkAgASAEQRhqEO8DIgFFDQAgASgCAEGAgID4AHFBgICAGEcNACABLwEIIANNDQAgACABKAIMIANBA3RqKQMANwMADAELIABCADcDAAsgBEEwaiQAC74EAgF/An4jAEGwAWsiBCQAIAQgAykDADcDkAECQAJAIARBkAFqEMIDRQ0AIAQgAikDACIFNwOIASAEIAU3A6gBAkAgASAEQYgBahDwAw0AIAQgBCkDqAE3A4ABIAEgBEGAAWoQ6wMNACAEIAQpA6gBNwN4IAEgBEH4AGoQwQNFDQELIAQgAykDADcDECABIARBEGoQ6QMhAyAEIAIpAwA3AwggACABIARBCGogAxCXAwwBCyAEIAMpAwA3A3ACQCABIARB8ABqEMEDRQ0AIAQgAykDACIGNwOgASAEIAIpAwAiBTcDmAEgASAGNwMwIAQgBTcDMCAEIAU3A6gBIAEgBEEwakEAEIoDIQMgAUIANwMwIAQgBCkDoAE3AyggBEGoAWogASADIARBKGoQiwMgBCAEKQOYATcDICAEIAQpA6gBNwMYIAAgASAEQSBqIARBGGoQhgMMAQsgBCADKQMANwNoIARBqAFqIAEgBEHoAGoQyQMgAyAEKQOoATcDACAEIAMpAwA3A2AgASAEQeAAahCOASAEIAMpAwAiBjcDoAEgBCACKQMAIgU3A5gBIAEgBjcDMCAEIAU3A1ggBCAFNwOoASABIARB2ABqQQAQigMhAiABQgA3AzAgBCAEKQOgATcDUCAEQagBaiABIAIgBEHQAGoQiwMgBCAEKQOYATcDSCAEIAQpA6gBNwNAIAAgASAEQcgAaiAEQcAAahCGAyAEIAMpAwA3AzggASAEQThqEI8BCyAEQbABaiQAC/IDAgF/AX4jAEGQAWsiBCQAIAQgAikDADcDgAECQAJAIARBgAFqEMIDRQ0AIAQgASkDACIFNwN4IAQgBTcDiAECQCAAIARB+ABqEPADDQAgBCAEKQOIATcDcCAAIARB8ABqEOsDDQAgBCAEKQOIATcDaCAAIARB6ABqEMEDRQ0BCyAEIAIpAwA3AxggACAEQRhqEOkDIQIgBCABKQMANwMQIAQgAykDADcDCCAAIARBEGogAiAEQQhqEJoDDAELIAAgAikDADcDMCAEIAEpAwAiBTcDYCAEIAU3A4gBAkAgACAEQeAAakEBEIoDIgFFDQACQAJAIAEtAANBD3FBfGoOBgEAAAAAAQALQfjlAEGMxwBB4QZBxQsQ/gUACyAAQgA3AzAgAUUNASAEIAIpAwA3A1gCQCAAIARB2ABqEMEDRQ0AIAQgAikDADcDKCAEIAMpAwA3AyAgACABIARBKGogBEEgahDwAgwCCyAEIAIpAwA3A1AgBEGIAWogACAEQdAAahDJAyACIAQpA4gBNwMAIAQgAikDADcDSCAAIARByABqEI4BIAQgAikDADcDQCAEIAMpAwA3AzggACABIARBwABqIARBOGoQ8AIgBCACKQMANwMwIAAgBEEwahCPAQwBCyAAQgA3AzALIARBkAFqJAALtQMCBH8BfiMAQdAAayIEJAACQAJAIAJBgcADSQ0AIARByABqIABBDxDbAwwBCyAEIAEpAwA3AzgCQCAAIARBOGoQ7ANFDQAgBCABKQMANwMgIAAgBEEgaiAEQcQAahDtAyEBAkAgBCgCRCIFIAJNDQAgBCADKQMANwMIIAEgAmogACAEQQhqEOkDOgAADAILIAQgAjYCECAEIAU2AhQgBEHIAGogAEHUDSAEQRBqENcDDAELIAQgASkDADcDMAJAIAAgBEEwahDvAyIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQACQCACQYE4SQ0AIARByABqIABBDxDbAwwCCyADKQMAIQgCQCACQQFqIgEgBS8BCk0NACAAIAFBCmxBA3YiA0EEIANBBEsbIgZBA3QQigEiA0UNAgJAIAUoAgwiB0UNACADIAcgBS8BCEEDdBCcBhoLIAUgBjsBCiAFIAM2AgwgACgCoAIgAxCLAQsgBSgCDCACQQN0aiAINwMAIAUvAQggAksNASAFIAE7AQgMAQsgBCABKQMANwMoIARByABqIABBDyAEQShqENkDCyAEQdAAaiQAC70BAQV/IwBBEGsiBCQAAkACQCACQYE4SQ0AIARBCGogAEEPENsDDAELAkAgAkEBaiIFIAEvAQpNDQAgACAFQQpsQQN2IgZBBCAGQQRLGyIHQQN0EIoBIgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQnAYaCyABIAc7AQogASAGNgIMIAAoAqACIAYQiwELIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAAL8gECBn8BfiMAQSBrIgMkACADIAIpAwA3AxAgACADQRBqEI4BAkACQCABLwEIIgRBgThJDQAgA0EYaiAAQQ8Q2wMMAQsgAikDACEJIARBAWohBQJAIAQgAS8BCkkNACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQigEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBCcBhoLIAEgBzsBCiABIAY2AgwgACgCoAIgBhCLAQsgASgCDCAEQQN0aiAJNwMAIAEvAQggBEsNACABIAU7AQgLIAMgAikDADcDCCAAIANBCGoQjwEgA0EgaiQAC1wCAX8BfiMAQSBrIgMkACADIAFBA3QgAGpB4ABqKQMAIgQ3AxAgAyAENwMYIAIhAQJAIANBEGoQ8wMNACADIAMpAxg3AwggACADQQhqEOkDIQELIANBIGokACABCz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB4ABqKQMAIgM3AwAgAiADNwMIIAAgAhDpAyEAIAJBEGokACAACz4CAX8BfiMAQRBrIgIkACACIAFBA3QgAGpB4ABqKQMAIgM3AwAgAiADNwMIIAAgAhDqAyEAIAJBEGokACAAC0ADAX8BfgF8IwBBEGsiAiQAIAIgAUEDdCAAakHgAGopAwAiAzcDACACIAM3AwggACACEOgDIQQgAkEQaiQAIAQLNgEBfyMAQRBrIgIkACACQQhqIAEQ5AMCQCAAKALsASIARQ0AIAAgAikDCDcDIAsgAkEQaiQACzYBAX8jAEEQayICJAAgAkEIaiABEOUDAkAgACgC7AEiAUUNACABIAIpAwg3AyALIAJBEGokAAs2AQF/IwBBEGsiAiQAIAJBCGogARDmAwJAIAAoAuwBIgFFDQAgASACKQMINwMgCyACQRBqJAALOgEBfyMAQRBrIgIkACACQQhqIABBCCABEOcDAkAgACgC7AEiAEUNACAAIAIpAwg3AyALIAJBEGokAAt6AgN/AX4jAEEgayIBJAAgASAAKQNYIgQ3AwggASAENwMYAkACQCAAIAFBCGoQ7wMiAg0AQQAhAwwBCyACLQADQQ9xIQMLIAIhAgJAAkAgA0F8ag4GAQAAAAABAAsgAUEQaiAAQYU9QQAQ1QNBACECCyABQSBqJAAgAgssAQF/AkAgACgCLCIDKALsAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAs8AQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGoQ8QMhASACQRBqJAAgAUEOSUG8wAAgAUH//wBxdnELTQEBfwJAIAJBLEkNACAAQgA3AwAPCwJAIAEgAhDuAiIDQZD4AGtBDG1BK0sNACAAQQA2AgQgACACQeAAajYCAA8LIAAgAUEIIAMQ5wMLgAIBAn8gAiEDA0ACQCADIgJBkPgAa0EMbSIDQStLDQACQCABIAMQ7gIiAkGQ+ABrQQxtQStLDQAgAEEANgIEIAAgA0HgAGo2AgAPCyAAIAFBCCACEOcDDwsCQCACIAEoAOQBIgMgAygCYGprIAMvAQ5BBHRPDQAgAEIANwMADwsCQAJAIAINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkAgA0F8ag4GAQAAAAABAAtBjecAQYzHAEHYCUHTMhD+BQALAkAgAkUNACACKAIAQYCAgPgAcUGAgIDIAEcNACACKAIEIgQhAyAEQZD4AGtBDG1BLEkNAQsLIAAgAUEIIAIQ5wMLJAACQCABLQAUQQpJDQAgASgCCBAgCyABQQA7AQIgAUEAOgAUC04BA39BACEBA0AgACABIgJBGGxqIgFBFGohAwJAIAEtABRBCkkNACABKAIIECALIANBADoAACABQQA7AQIgAkEBaiICIQEgAkEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyACKQMINwIACyAAIAQ7AeADIAMLwQMBBn8jAEEgayIEJAACQCACRQ0AQQAhBQJAA0ACQCAAIAUiBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIGIQUgBkEURw0AC0EAIQULIAUiBiEFAkAgBg0AIABBACAALwHgAyIFQQFqIAVBEksbQRhsIgZqIgVBFGohBwJAIAUtABRBCkkNACAAIAZqKAIIECALIAdBADoAACAAIAZqQQA7AQIgBSEFCyAFIgVBADsBFiAFIAI7AQIgBSABOwEAIAUgAzoAFAJAIANBCkkNACAFIAMQHzYCCAsCQAJAIAAgAC8B4AMiBkEYbGogBUcNACAFIQUMAQsCQCAAQQAgBkEBaiAGQRJLGyIDQRhsaiIGIAVGDQAgBEEIakEQaiICIAVBEGoiASkCADcDACAEQQhqQQhqIgcgBUEIaiIIKQIANwMAIAQgBSkCADcDCCABIAZBEGoiCSkCADcCACAIIAZBCGoiASkCADcCACAFIAYpAgA3AgAgCSACKQMANwIAIAEgBykDADcCACAGIAQpAwg3AgALIAAgAzsB4AMgBiEFCyAEQSBqJAAgBQ8LQefbAEGAzQBBJUGqxAAQ/gUAC3kBBX9BACEEAkADQCAGIQUCQAJAIAAgBCIHQRhsIgZqIgQvAQAgAUcNACAAIAZqIggvAQIgAkcNAEEAIQYgBCEEIAgvARYgA0YNAQtBASEGIAUhBAsgBCEEIAZFDQEgBCEGIAdBAWoiByEEIAdBFEcNAAtBAA8LIAQLRgECf0EAIQMDQAJAIAAgAyIDQRhsaiIELwEAIAFHDQAgBCgCBCACTQ0AIARBBGogAjYCAAsgA0EBaiIEIQMgBEEURw0ACwtbAQN/QQAhAgNAAkAgACACIgNBGGxqIgIvAQAgAUcNACACQRRqIQQCQCACLQAUQQpJDQAgAigCCBAgCyAEQQA6AAAgAkEAOwECCyADQQFqIgMhAiADQRRHDQALC1UBAX8CQCACRQ0AIAMgACADGyIDIABB4ANqIgRPDQAgAyEDA0ACQCADIgMvAQIgAkcNACADLwEAIAFHDQAgAw8LIANBGGoiACEDIAAgBEkNAAsLQQALXQEDfyMAQSBrIgEkAEEAIQICQCAAIAFBIBC2BSIDQQBIDQAgA0EBahAfIQICQAJAIANBIEoNACACIAEgAxCcBhoMAQsgACACIAMQtgUaCyACIQILIAFBIGokACACCyQBAX8CQAJAIAENAEEAIQIMAQsgARDLBiECCyAAIAEgAhC5BQvQAgEDfyMAQdAAayIDJAAgAyACKQMANwNIIAMgACADQcgAahC1AzYCRCADIAE2AkBBlBsgA0HAAGoQOyABLQAAIQEgAyACKQMANwM4AkACQCAAIANBOGoQ7wMiAg0AQQAhBAwBCyACLQADQQ9xIQQLAkACQCAEQXxqDgYAAQEBAQABCyACLwEIRQ0AQSAgASABQSpHGyABIAFBIUcbIAEgAUE+RxvAIQRBACEBA0ACQCABIgFBC0cNACADIAQ2AgBBueIAIAMQOwwCCyADIAIoAgwgAUEEdCIFaikDADcDMCADIAAgA0EwahC1AzYCJCADIAQ2AiBBq9kAIANBIGoQOyADIAIoAgwgBWpBCGopAwA3AxggAyAAIANBGGoQtQM2AhQgAyAENgIQQcMcIANBEGoQOyABQQFqIgUhASAFIAIvAQhJDQALCyADQdAAaiQAC+YDAQN/IwBB4ABrIgIkAAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiA0EKSw0AQQEgA3RBqAxxDQEgA0EIRw0AIAEoAgAiA0UNACADKAIAQYCAgPgAcUGAgIA4Rg0BCyACIAEpAwA3AwggACACQQhqQQAQxAMiBCEDIAQNASACIAEpAwA3AwAgACACELYDIQMMAQsgAiABKQMANwNAIAAgAkHAAGogAkHYAGogAkHUAGoQiAMhAwJAAkAgAikDWFBFDQBBACEBDAELIAIgAikDWDcDOAJAIAAgAkE4ahC2AyIBQbCAAkYNACACIAE2AjBBsIACQcAAQckcIAJBMGoQgwYaCwJAQbCAAhDLBiIBQSdJDQBBAEEALQC4YjoAsoACQQBBAC8AtmI7AbCAAkECIQEMAQsgAUGwgAJqQS46AAAgAUEBaiEBCyABIQECQAJAIAIoAlQiBA0AIAEhAQwBCyACQcgAaiAAQQggBBDnAyACIAIoAkg2AiAgAUGwgAJqQcAAIAFrQcILIAJBIGoQgwYaQbCAAhDLBiIBQbCAAmpBwAA6AAAgAUEBaiEBCyACIAM2AhAgASIBQbCAAmpBwAAgAWtB8MAAIAJBEGoQgwYaQbCAAiEDCyACQeAAaiQAIAML0QYBA38jAEGQAWsiAiQAAkACQCABKAIEIgNBf0cNACACIAEoAgA2AgBBsIACQcAAQaLDACACEIMGGkGwgAIhAwwBC0EAIQQCQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADQQ9xIAFBBmovAQBB8P8BcRsOEQEKBAIDBgULCQgHCwsLCwsACwsgAiABKQMANwMoIAIgACACQShqEOgDOQMgQbCAAkHAAEHkMCACQSBqEIMGGkGwgAIhAwwLC0GsKSEDAkACQAJAAkACQAJAAkAgASgCACIBDkQAAQURBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGAgYDBAYLQdQ+IQMMEAtBvzQhAwwPC0GxMiEDDA4LQYoIIQMMDQtBiQghAwwMC0G01QAhAwwLCwJAIAFBoH9qIgNBK0sNACACIAM2AjBBsIACQcAAQffAACACQTBqEIMGGkGwgAIhAwwLC0GPKiEDIAFBgAhJDQogAiABQQ9xNgJEIAIgAUGAeGpBBHY2AkBBsIACQcAAQZENIAJBwABqEIMGGkGwgAIhAwwKC0G0JSEEDAgLQbgvQdUcIAEoAgBBgIABSRshBAwHC0GANyEEDAYLQfogIQQMBQsgAiABKAIANgJUIAIgA0EEdkH//wNxNgJQQbCAAkHAAEGzCiACQdAAahCDBhpBsIACIQMMBQsgAiABKAIANgJkIAIgA0EEdkH//wNxNgJgQbCAAkHAAEH/IyACQeAAahCDBhpBsIACIQMMBAsgAiABKAIANgJ0IAIgA0EEdkH//wNxNgJwQbCAAkHAAEHxIyACQfAAahCDBhpBsIACIQMMAwsCQAJAIAEoAgAiAQ0AQX8hBAwBCyABLQADQQ9xQX9qIQQLQafZACEDAkAgBCIEQQxLDQAgBEECdEGYiAFqKAIAIQMLIAIgATYChAEgAiADNgKAAUGwgAJBwABB6yMgAkGAAWoQgwYaQbCAAiEDDAILQc/OACEECwJAIAQiAw0AQYEzIQMMAQsgAiABKAIANgIUIAIgAzYCEEGwgAJBwABB7w0gAkEQahCDBhpBsIACIQMLIAJBkAFqJAAgAwvgBQIWfwR+IwBB4ABrIgJBwABqQRhqIABBGGopAgAiGDcDACACQcAAakEQaiAAQRBqKQIAIhk3AwAgAiAAKQIAIho3A0AgAiAAQQhqKQIAIhs3A0ggASEDQQAhBCACKAJcIQUgGKchBiACKAJUIQEgGachByACKAJMIQggG6chCSACKAJEIQogGqchCwNAIAQiDEEEdCENIAMhBEEAIQMgByEHIAEhDiAGIQ8gBSEQIAshCyAKIREgCSESIAghEwNAIBMhEyASIQggESEJIAshCiAQIRAgDyEFIA4hBiAHIQEgAyEDIAQhBAJAAkAgDA0AIAIgA0ECdGogBCgAACIHQRh0IAdBgP4DcUEIdHIgB0EIdkGA/gNxIAdBGHZycjYCACAEQQRqIQcMAQsgAiADQQJ0aiIOIAIgA0EBakEPcUECdGooAgAiB0EZdyAHQQ53cyAHQQN2cyAOKAIAaiACIANBCWpBD3FBAnRqKAIAaiACIANBDmpBD3FBAnRqKAIAIgdBD3cgB0ENd3MgB0EKdnNqNgIAIAQhBwsgAiABNgJUIAIgBjYCWCACIAU2AlwgAiATIAFBGncgAUEVd3MgAUEHd3MgBiABcWogEGogBSABQX9zcWogAyANckECdEHQiAFqKAIAaiACIANBAnRqKAIAaiIEaiIUNgJQIAIgCjYCRCACIAk2AkggAiAINgJMIAIgCkEedyAKQRN3cyAKQQp3cyAEaiAIIAlzIApxIAggCXFzaiIVNgJAIAciFiEEIANBAWoiFyEDIBQhByABIQ4gBiEPIAUhECAVIQsgCiERIAkhEiAIIRMgF0EQRw0ACyAWIQMgDEEBaiIOIQQgBSEFIAYhBiABIQEgFCEHIAghCCAJIQkgCiEKIBUhCyAOQQRHDQALQQAhAQNAIAAgASIBQQJ0IgpqIgMgAygCACACQcAAaiAKaigCAGo2AgAgAUEBaiIKIQEgCkEIRw0ACwu0AgEFfyAAKAJIIQEgACgCRCICQYABOgAAIABB0ABqIQMgAkEBaiECAkACQCABQX9qIgFBB00NACABIQEgAiECDAELIAJBACABEJ4GGiADIABBBGoiAhC3A0HAACEBIAIhAgsgAkEAIAFBeGoiARCeBiABaiIEIAAoAkwiAUEDdDoAB0EGIQIgAUEFdiEFA0AgBCACIgFqIAUiBToAACABQX9qIQIgBUEIdiEFIAENAAsgAyAAQQRqELcDIAAoAgAhAkEAIQFBACEFA0AgAiABIgFqIAMgBSIEQQJ0aiIFLQADOgAAIAIgAUEBcmogBS8BAjoAACACIAFBAnJqIAUoAgBBCHY6AAAgAiABQQNyaiAFKAIAOgAAIAFBBGohASAEQQFqIgQhBSAEQQhHDQALIAAoAgALkQEAECICQEEALQDwgAJFDQBBtM4AQQ5BxCEQ+QUAC0EAQQE6APCAAhAjQQBCq7OP/JGjs/DbADcC3IECQQBC/6S5iMWR2oKbfzcC1IECQQBC8ua746On/aelfzcCzIECQQBC58yn0NbQ67O7fzcCxIECQQBCwAA3AryBAkEAQfiAAjYCuIECQQBB8IECNgL0gAIL+QEBA38CQCABRQ0AQQBBACgCwIECIAFqNgLAgQIgASEBIAAhAANAIAAhACABIQECQEEAKAK8gQIiAkHAAEcNACABQcAASQ0AQcSBAiAAELcDIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAriBAiAAIAEgAiABIAJJGyICEJwGGkEAQQAoAryBAiIDIAJrNgK8gQIgACACaiEAIAEgAmshBAJAIAMgAkcNAEHEgQJB+IACELcDQQBBwAA2AryBAkEAQfiAAjYCuIECIAQhASAAIQAgBA0BDAILQQBBACgCuIECIAJqNgK4gQIgBCEBIAAhACAEDQALCwtMAEH0gAIQuAMaIABBGGpBACkDiIICNwAAIABBEGpBACkDgIICNwAAIABBCGpBACkD+IECNwAAIABBACkD8IECNwAAQQBBADoA8IACC9sHAQN/QQBCADcDyIICQQBCADcDwIICQQBCADcDuIICQQBCADcDsIICQQBCADcDqIICQQBCADcDoIICQQBCADcDmIICQQBCADcDkIICAkACQAJAAkAgAUHBAEkNABAiQQAtAPCAAg0CQQBBAToA8IACECNBACABNgLAgQJBAEHAADYCvIECQQBB+IACNgK4gQJBAEHwgQI2AvSAAkEAQquzj/yRo7Pw2wA3AtyBAkEAQv+kuYjFkdqCm383AtSBAkEAQvLmu+Ojp/2npX83AsyBAkEAQufMp9DW0Ouzu383AsSBAiABIQEgACEAAkADQCAAIQAgASEBAkBBACgCvIECIgJBwABHDQAgAUHAAEkNAEHEgQIgABC3AyABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKAK4gQIgACABIAIgASACSRsiAhCcBhpBAEEAKAK8gQIiAyACazYCvIECIAAgAmohACABIAJrIQQCQCADIAJHDQBBxIECQfiAAhC3A0EAQcAANgK8gQJBAEH4gAI2AriBAiAEIQEgACEAIAQNAQwCC0EAQQAoAriBAiACajYCuIECIAQhASAAIQAgBA0ACwtB9IACELgDGkEAQQApA4iCAjcDqIICQQBBACkDgIICNwOgggJBAEEAKQP4gQI3A5iCAkEAQQApA/CBAjcDkIICQQBBADoA8IACQQAhAQwBC0GQggIgACABEJwGGkEAIQELA0AgASIBQZCCAmoiACAALQAAQTZzOgAAIAFBAWoiACEBIABBwABHDQAMAgsAC0G0zgBBDkHEIRD5BQALECICQEEALQDwgAINAEEAQQE6APCAAhAjQQBCwICAgPDM+YTqADcCwIECQQBBwAA2AryBAkEAQfiAAjYCuIECQQBB8IECNgL0gAJBAEGZmoPfBTYC4IECQQBCjNGV2Lm19sEfNwLYgQJBAEK66r+q+s+Uh9EANwLQgQJBAEKF3Z7bq+68tzw3AsiBAkHAACEBQZCCAiEAAkADQCAAIQAgASEBAkBBACgCvIECIgJBwABHDQAgAUHAAEkNAEHEgQIgABC3AyABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKAK4gQIgACABIAIgASACSRsiAhCcBhpBAEEAKAK8gQIiAyACazYCvIECIAAgAmohACABIAJrIQQCQCADIAJHDQBBxIECQfiAAhC3A0EAQcAANgK8gQJBAEH4gAI2AriBAiAEIQEgACEAIAQNAQwCC0EAQQAoAriBAiACajYCuIECIAQhASAAIQAgBA0ACwsPC0G0zgBBDkHEIRD5BQAL+QEBA38CQCABRQ0AQQBBACgCwIECIAFqNgLAgQIgASEBIAAhAANAIAAhACABIQECQEEAKAK8gQIiAkHAAEcNACABQcAASQ0AQcSBAiAAELcDIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAriBAiAAIAEgAiABIAJJGyICEJwGGkEAQQAoAryBAiIDIAJrNgK8gQIgACACaiEAIAEgAmshBAJAIAMgAkcNAEHEgQJB+IACELcDQQBBwAA2AryBAkEAQfiAAjYCuIECIAQhASAAIQAgBA0BDAILQQBBACgCuIECIAJqNgK4gQIgBCEBIAAhACAEDQALCwv6BgEFf0H0gAIQuAMaIABBGGpBACkDiIICNwAAIABBEGpBACkDgIICNwAAIABBCGpBACkD+IECNwAAIABBACkD8IECNwAAQQBBADoA8IACECICQEEALQDwgAINAEEAQQE6APCAAhAjQQBCq7OP/JGjs/DbADcC3IECQQBC/6S5iMWR2oKbfzcC1IECQQBC8ua746On/aelfzcCzIECQQBC58yn0NbQ67O7fzcCxIECQQBCwAA3AryBAkEAQfiAAjYCuIECQQBB8IECNgL0gAJBACEBA0AgASIBQZCCAmoiAiACLQAAQeoAczoAACABQQFqIgIhASACQcAARw0AC0EAQcAANgLAgQJBwAAhAUGQggIhAgJAA0AgAiECIAEhAQJAQQAoAryBAiIDQcAARw0AIAFBwABJDQBBxIECIAIQtwMgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCuIECIAIgASADIAEgA0kbIgMQnAYaQQBBACgCvIECIgQgA2s2AryBAiACIANqIQIgASADayEFAkAgBCADRw0AQcSBAkH4gAIQtwNBAEHAADYCvIECQQBB+IACNgK4gQIgBSEBIAIhAiAFDQEMAgtBAEEAKAK4gQIgA2o2AriBAiAFIQEgAiECIAUNAAsLQQBBACgCwIECQSBqNgLAgQJBICEBIAAhAgJAA0AgAiECIAEhAQJAQQAoAryBAiIDQcAARw0AIAFBwABJDQBBxIECIAIQtwMgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgCuIECIAIgASADIAEgA0kbIgMQnAYaQQBBACgCvIECIgQgA2s2AryBAiACIANqIQIgASADayEFAkAgBCADRw0AQcSBAkH4gAIQtwNBAEHAADYCvIECQQBB+IACNgK4gQIgBSEBIAIhAiAFDQEMAgtBAEEAKAK4gQIgA2o2AriBAiAFIQEgAiECIAUNAAsLQfSAAhC4AxogAEEYakEAKQOIggI3AAAgAEEQakEAKQOAggI3AAAgAEEIakEAKQP4gQI3AAAgAEEAKQPwgQI3AABBAEIANwOQggJBAEIANwOYggJBAEIANwOgggJBAEIANwOoggJBAEIANwOwggJBAEIANwO4ggJBAEIANwPAggJBAEIANwPIggJBAEEAOgDwgAIPC0G0zgBBDkHEIRD5BQAL7QcBAX8gACABELwDAkAgA0UNAEEAQQAoAsCBAiADajYCwIECIAMhAyACIQEDQCABIQEgAyEDAkBBACgCvIECIgBBwABHDQAgA0HAAEkNAEHEgQIgARC3AyADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK4gQIgASADIAAgAyAASRsiABCcBhpBAEEAKAK8gQIiCSAAazYCvIECIAEgAGohASADIABrIQICQCAJIABHDQBBxIECQfiAAhC3A0EAQcAANgK8gQJBAEH4gAI2AriBAiACIQMgASEBIAINAQwCC0EAQQAoAriBAiAAajYCuIECIAIhAyABIQEgAg0ACwsgCBC+AyAIQSAQvAMCQCAFRQ0AQQBBACgCwIECIAVqNgLAgQIgBSEDIAQhAQNAIAEhASADIQMCQEEAKAK8gQIiAEHAAEcNACADQcAASQ0AQcSBAiABELcDIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAriBAiABIAMgACADIABJGyIAEJwGGkEAQQAoAryBAiIJIABrNgK8gQIgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHEgQJB+IACELcDQQBBwAA2AryBAkEAQfiAAjYCuIECIAIhAyABIQEgAg0BDAILQQBBACgCuIECIABqNgK4gQIgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALAgQIgB2o2AsCBAiAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAryBAiIAQcAARw0AIANBwABJDQBBxIECIAEQtwMgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuIECIAEgAyAAIAMgAEkbIgAQnAYaQQBBACgCvIECIgkgAGs2AryBAiABIABqIQEgAyAAayECAkAgCSAARw0AQcSBAkH4gAIQtwNBAEHAADYCvIECQQBB+IACNgK4gQIgAiEDIAEhASACDQEMAgtBAEEAKAK4gQIgAGo2AriBAiACIQMgASEBIAINAAsLQQBBACgCwIECQQFqNgLAgQJBASEDQcHuACEBAkADQCABIQEgAyEDAkBBACgCvIECIgBBwABHDQAgA0HAAEkNAEHEgQIgARC3AyADQUBqIgAhAyABQcAAaiEBIAANAQwC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KAIAIQtBACEKQRwhBANAIAohCgJAAkAgCyAEIgF2QQ9xIgQNACABRQ0AQQAhAiAKRQ0BCyAJIApqIARBN2ogBEEwciAEQQlLGzoAACAKQQFqIQILIAIiAiEKIAFBfGohBCABDQALIAkgAmpBADoAACARIQogDSEEIAxBBGohAgwICyAFIAxBB2pBeHEiASsDAEEIEIEGIBEhCiANIQQgAUEIaiECDAcLAkACQCASLQABQfAARg0AIBEhASANIQ9BPyENDAELAkAgDCgCACIBQQFODQAgESEBIA0hD0EAIQ0MAQsgDCgCBCEKIAEhBCANIQIgESELA0AgCyERIAIhDSAKIQsgBCIQQR8gEEEfSBshAkEAIQEDQCAFIAEiAUEBdGoiCiALIAFqIgQtAABBBHZBrTBqLQAAOgAAIAogBC0AAEEPcUGtMGotAAA6AAEgAUEBaiIKIQEgCiACRw0ACyAFIAJBAXQiD2pBADoAACAGIA1rIQ4gESEBQQAhCgJAIA9BAEwNAANAIAEgBSAKIgpqLQAAQcABcUGAAUdqIQEgCkEBaiIEIQogBCAPRw0ACwsgASEBAkAgDkEATA0AIA0gBSAPIA5Bf2ogDiAPShsiChCcBiAKakEAOgAACyALIAJqIQogECACayIOIQQgDSAPaiIPIQIgASELIAEhASAPIQ9BACENIA5BAEoNAAsLIAUgDToAACABIQogDyEEIAxBCGohAiASQQJqIQEMBwsgBUE/OgAADAELIAUgAToAAAsgESEKIA0hBCAMIQIMAwsgBiANayEQIBEhAUEAIQoCQCAMKAIAIgRBzeYAIAQbIgsQywYiAkEATA0AA0AgASALIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCAQQQBMDQAgDSALIAIgEEF/aiAQIAJKGyIKEJwGIApqQQA6AAALIAxBBGohECAFQQA6AAAgDSACaiEEAkAgDkUNACALECALIAEhCiAEIQQgECECDAILIBEhCiANIQQgCyECDAELIBEhCiANIQQgDiECCyAPIQELIAEhDSACIQ4gBiAEIg9rIQsgCiEBQQAhCgJAIAUQywYiAkEATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCALQQBMDQAgDyAFIAIgC0F/aiALIAJKGyIKEJwGIApqQQA6AAALIAEhASAPIAJqIQogDiEEIA0hC0EBIQ8gDSECCyABIg4hASAKIg0hCiAEIQQgCyELIAIhAiAPDQALAkAgA0UNACADIA5BAWo2AgALIAVBwABqJAAgDSAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABELQGIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ9QaiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ9QajIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBD1BqNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahD1BqJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQngYaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QdCZAWopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEJ4GIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQywZqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLDwAgACABIAJBACADEIAGCywBAX8jAEEQayIEJAAgBCADNgIMIAAgASACQQAgAxCABiEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALTQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgAEEAIAEQgAYiARAfIgMgASAAQQAgAigCCBCABhogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQHyEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZBrTBqLQAAOgAAIAVBAWogBi0AAEEPcUGtMGotAAA6AAAgBEEBaiIFIQQgBSABRw0ACwsgAyACakEAOgAAIAML6QEBB38jAEEQayIBJAAgAUEANgIMIAFCADcCBCABIAA2AgACQAJAIAANAEEBIQIMAQsgACECQQAhA0EAIQQDQCACIQUgASAEQQFqIgRBAnRqKAIAIgYhAiAFEMsGIANqIgUhAyAEIQQgBg0A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Ag0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC44EAQN/AkAgAkGABEkNACAAIAEgAhARIAAPCyAAIAJqIQMCQAJAIAEgAHNBA3ENAAJAAkAgAEEDcQ0AIAAhAgwBCwJAIAINACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQnAYPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAKMkwJFDQBBACgCjJMCEKEGIQELAkBBACgCkO8BRQ0AQQAoApDvARChBiABciEBCwJAELcGKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABCfBiECCwJAIAAoAhQgACgCHEYNACAAEKEGIAFyIQELAkAgAkUNACAAEKAGCyAAKAI4IgANAAsLELgGIAEPC0EAIQICQCAAKAJMQQBIDQAgABCfBiECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEGABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoEREAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQoAYLIAELsgQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAEQowYhBCAAvSIFQjSIp0H/D3EiBkH/D0YNACAEQv///////////wCDQoGAgICAgID4/wBUDQELIAAgAaIiASABow8LAkAgBUIBhiIEIANWDQAgAEQAAAAAAAAAAKIgACAEIANRGw8LIAJCNIinQf8PcSEHAkACQCAG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ACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ8wYgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDzBiADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EPMGIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDzBiADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ8wYgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvVBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAEOkGRQ0AIAMgBBDZBiEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDzBiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEOsGIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDpBkEASg0AAkAgASAJIAMgChDpBkUNACABIQQMAgsgBUHwAGogASACQgBCABDzBiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ8wYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEPMGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDzBiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ8wYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EPMGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkHc7QFqKAIAIQYgAkHQ7QFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABENQGIQILIAIQ1QYNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDUBiECC0EAIQkCQAJAAkADQCACQSByIAlBgAhqLAAARw0BAkAg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QRBBFCAHKAIQIANGG2ogBjYCACAGRQ0BCyAGIAc2AhgCQCADKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKAK0kwJHDQFBACAANgKokwIPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBeHFByJMCaiECAkACQEEAKAKgkwIiBEEBIABBA3Z0IgBxDQBBACAEIAByNgKgkwIgAiEADAELIAIoAgghAAsgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBHyECAkAgAEH///8HSw0AIABBJiAAQQh2ZyICa3ZBAXEgAkEBdGtBPmohAgsgASACNgIcIAFCADcCECACQQJ0QdCVAmohBAJAAkACQAJAQQAoAqSTAiIGQQEgAnQiA3ENAEEAIAYgA3I2AqSTAiAEIAE2AgAgASAENgIYDAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAEgBDYCGAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEANgIYIAEgBDYCDCABIAA2AggLQQBBACgCwJMCQX9qIgFBfyABGzYCwJMCCwsHAD8AQRB0C1QBAn9BACgClO8BIgEgAEEHakF4cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEOUGTQ0AIAAQE0UNAQtBACAANgKU7wEgAQ8LEJkGQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDoBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ6AZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEOgGIAVBMGogCiABIAcQ8gYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDoBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDoBiAFIAIgBEEBIAZrEPIGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDwBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDxBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEOgGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ6AYgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ9AYgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ9AYgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ9AYgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ9AYgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ9AYgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ9AYgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ9AYgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ9AYgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ9AYgBUGQAWogA0IPhkIAIARCABD0BiAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEPQGIAVBgAFqQgEgAn1CACAEQgAQ9AYgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhD0BiABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhD0BiABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEPIGIAVBMGogFiATIAZB8ABqEOgGIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEPQGIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ9AYgBSADIA5CBUIAEPQGIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDoBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDoBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEOgGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEOgGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEOgGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEOgGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEOgGIAVBIGogAiAEIAYQ6AYgBUEQaiASIAEgBxDyBiAFIAIgBCAHEPIGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDnBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ6AYgAiAAIARBgfgAIANrEPIGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBkJcGJANBkJcCQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABERAAslAQF+IAAgASACrSADrUIghoQgBBCCByEFIAVCIIinEPgGIAWnCxMAIAAgAacgAUIgiKcgAiADEBQLC/7ygYAAAwBBgAgL6OUBaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBpc1JlYWRPbmx5AGRldnNfdmVyaWZ5AHN0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAZGVsYXkAc2V0dXBfY3R4AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAY2h1bmsgb3ZlcmZsb3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAYmxpdFJvdwBqZF93c3NrX25ldwBqZF93ZWJzb2NrX25ldwBleHByMV9uZXcAZGV2c19qZF9zZW5kX3JhdwBpZGl2AHByZXYALmFwcC5naXRodWIuZGV2ACVzJXUAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABzdG9wX2xpc3QAZGlnZXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQAZGVjcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAZGV2c191dGY4X2NvZGVfcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAdGNwc29ja19vbl9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAX3NvY2tldE9uRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABtYXNrZWQgc2VydmVyIHBrdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAYmxpdAB3YWl0AGhlaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAZ2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfZ2V0X2J1aWx0aW5fb2JqZWN0AGEgYnVpbHRpbiBmcm96ZW4gb2JqZWN0AGZpbGxSZWN0AHBhcnNlRmxvYXQAZGV2c2Nsb3VkOiBpbnZhbGlkIGNsb3VkIHVwbG9hZCBmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAGpkaWY6IHJvbGUgJyVzJyBhbHJlYWR5IGV4aXN0cwBqZF9yb2xlX3NldF9oaW50cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAMHgxeHh4eHh4eCBleHBlY3RlZCBmb3Igc2VydmljZSBjbGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGlkeCA8PSBjdHgtPm51bV9waW5zAEdQSU86IGluaXQ6ICVkIHBpbnMAZXF1YWxzAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAGNhcGFiaWxpdGllcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gJXM6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwAjICV1ICVzAGV4cGVjdGluZyAlczsgZ290ICVzACogc3RhcnQ6ICVzICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXUzogZXJyb3I6ICVzAFdTU0s6IGVycm9yOiAlcwBiYWQgcmVzcDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAbiA8PSB3cy0+bXNncHRyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAHNvY2sgd3JpdGUgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBtZ3I6IHN0YXJ0aW5nIGNsb3VkIGFkYXB0ZXIAbWdyOiBkZXZOZXR3b3JrIG1vZGUgLSBkaXNhYmxlIGNsb3VkIGFkYXB0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBzdGFydF9wa3RfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGNsYXNzSWRlbnRpZmllcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBzcGlYZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABicHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAZGV2c19kdW1wX2hlYXAAdmFsaWRhdGVfaGVhcABEZXZTLVNIQTI1NjogJSpwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX2luc3BlY3RfdG8Ac21hbGwgaGVsbG8AZ3BpbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AX2kyY1RyYW5zYWN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AQHZlcnNpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AbWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAF9zb2NrZXRPcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AZnJvbQByYW5kb20AZmlsbFJhbmRvbQBhZXMtMjU2LWNjbQBmbGFzaF9wcm9ncmFtACogc3RvcCBwcm9ncmFtAGltdWwAdW5rbm93biBjdHJsAG5vbi1maW4gY3RybAB0b28gbGFyZ2UgY3RybABudWxsAGZpbGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsYWJlbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbABub24tbWluaW1hbAA/c3BlY2lhbABkZXZOZXR3b3JrAGRldnNfaW1nX3N0cmlkeF9vawBkZXZzX2djX2FkZF9jaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAb3ZlcmxhcHNXaXRoAGRldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aABzeiA9PSBzLT5sZW5ndGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABsZW4gPT0gcy0+aW5uZXIubGVuZ3RoAEludmFsaWQgYXJyYXkgbGVuZ3RoAHNpemUgPj0gbGVuZ3RoAHNldExlbmd0aABieXRlTGVuZ3RoAHdpZHRoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABlbmNyeXB0aW9uIHRhZyBtaXNtYXRjaABmb3JFYWNoAHAgPCBjaABzaGlmdF9tc2cAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBjYW4ndCBwb25nAHNldHRpbmcAZ2V0dGluZwBib2R5IG1pc3NpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAZGV2c19ncGlvX2luaXRfZGNmZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c19zdHJpbmdfdnNwcmludGYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAeV9vZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAGluZGV4T2YAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gZmxhc2hfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBzeiA9PSBzLT5pbm5lci5zaXplAHN0YXRlLm9mZiArIDMgPD0gc2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAF9zb2NrZXRXcml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAX3NvY2tldENsb3NlAHdlYnNvY2sgcmVzcG9uc2UAX2NvbW1hbmRSZXNwb25zZQBtZ3I6IHJ1bm5pbmcgc2V0IHRvIGZhbHNlAGZsYXNoX2VyYXNlAHRvTG93ZXJDYXNlAHRvVXBwZXJDYXNlAGRldnNfbWFrZV9jbG9zdXJlAHNwaUNvbmZpZ3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBjbG9uZQBHUElPOiBpbml0IHVzZWQgZG9uZQBpbmxpbmUAZHJhd0xpbmUAZGJnOiByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAV1M6IGNsb3NlIGZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAX2FsbG9jUm9sZQBmaWxsQ2lyY2xlAG5ldHdvcmsgbm90IGF2YWlsYWJsZQByZWNvbXB1dGVfY2FjaGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAF90d2luTWVzc2FnZQBpbWFnZQBkcmF3SW1hZ2UAZHJhd1RyYW5zcGFyZW50SW1hZ2UAc3BpU2VuZEltYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1vZGUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAc2V0TW9kZQBldmVudENvZGUAZnJvbUNoYXJDb2RlAHJlZ0NvZGUAaW1nX3N0cmlkZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAamRpZjogYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGhvc3Qgb3IgcG9ydCBpbnZhbGlkAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAHJvbGUgbmFtZSAnJXMnIGFscmVhZHkgdXNlZAB0cmFuc3Bvc2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXUgcGFja2V0cyB0aHJvdHRsZWQAJXMgY2FsbGVkAGRldk5ldHdvcmsgZW5hYmxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAGludmFsaWQgZGltZW5zaW9ucyAlZHglZHglZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAaW52YWxpZCBvZmZzZXQgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABHUElPOiAlcyglZCkgc2V0IHRvICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABqZGlmOiBjcmVhdGUgcm9sZSAnJXMnIC0+ICVkAFdTOiBoZWFkZXJzIGRvbmU7ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbXBsX3NvY2tldC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9pbXBsX2RzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvaW1wbF9ncGlvLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dlYnNvY2tfY29ubi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2ltcGxfaW1hZ2UuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9pbXBsX3BhY2tldHNwZWMuYwBkZXZpY2VzY3JpcHQvaW1wbF9zZXJ2aWNlc3BlYy5jAGRldmljZXNjcmlwdC91dGY4LmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAG9uX2RhdGEAZXhwZWN0aW5nIHRvcGljIGFuZCBkYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbUm9sZTogJXMuJXNdAFtQYWNrZXRTcGVjOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBbU2VydmljZVNwZWM6ICVzXQBbQ2lyY3VsYXJdAFtCdWZmZXJbJXVdICUqcF0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUqcC4uLl0AW0ltYWdlOiAlZHglZCAoJWQgYnBwKV0AZmxpcFkAZmxpcFgAaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZXhwZWN0aW5nIENPTlQAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAEZTVE9SX0RBVEFfUEFHRVMgPD0gSkRfRlNUT1JfTUFYX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAGV4cGVjdGluZyBCSU4AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFNQSQBESVNDT05ORUNUSU5HAHN6ID09IGxlbiAmJiBzeiA8IERFVlNfTUFYX0FTQ0lJX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gZmxhc2hfc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQB3cy0+bXNncHRyIDw9IE1BWF9NRVNTQUdFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwBJMkMAPz8/ACVjICAlcyA9PgBpbnQ6AGFwcDoAd3NzazoAdXRmOABzaXplID4gc2l6ZW9mKGNodW5rX3QpICsgMTI4AHV0Zi04AHNoYTI1NgBjbnQgPT0gMyB8fCBjbnQgPT0gLTMAbGVuID09IGwyAGxvZzIAZGV2c19hcmdfaW1nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAV1M6IGdvdCAxMDEASFRUUC8xLjEgMTAxAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABzaXplIDwgMHhmMDAwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAaWR4ID49IDAAciA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwB3c3M6Ly8AcGlucy4APy4AJWMgIC4uLgAhICAuLi4ALABwYWNrZXQgNjRrKwAhZGV2c19pbl92bV9sb29wKGN0eCkAZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAGRldnNfaGFuZGxlX3R5cGUodikgPT0gREVWU19IQU5ETEVfVFlQRV9HQ19PQkpFQ1QgJiYgZGV2c19pc19zdHJpbmcoY3R4LCB2KQBlbmNyeXB0ZWQgZGF0YSAobGVuPSV1KSBzaG9ydGVyIHRoYW4gdGFnTGVuICgldSkAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKG1hcCkAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBzdGF0czogJWQgb2JqZWN0cywgJWQgQiB1c2VkLCAlZCBCIGZyZWUgKCVkIEIgbWF4IGJsb2NrKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpAEdQSU86IHNraXAgJXMgLT4gJWQgKHVzZWQpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBHUElPOiBpbml0WyV1XSAlcyAtPiAlZCAoPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQBhY3Q6ICVzX0YlZCAocGM6JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQBvZmYgPCAodW5zaWdu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ZCBzaXplKTw6Oj57IGlmIChNb2R1bGUuZmxhc2hMb2FkKSB7IGNvbnN0IGRhdGEgPSBNb2R1bGUuZmxhc2hMb2FkKCk7IGlmIChNb2R1bGUuZG1lc2cpIE1vZHVsZS5kbWVzZygiZmxhc2ggbG9hZCwgc2l6ZT0iICsgZGF0YS5sZW5ndGgpOyBIRUFQVTguc2V0KGRhdGEuc2xpY2UoMCwgc2l6ZSksIHN0YXJ0KTsgfSB9ACh2b2lkICpmcmFtZSk8Ojo+eyBjb25zdCBzeiA9IDEyICsgSEVBUFU4W2ZyYW1lICsgMl07IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGNvbnN0IHZvaWQgKmZyYW1lLCB1bnNpZ25lZCBzeik8Ojo+eyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AKGNvbnN0IGNoYXIgKmhvc3RuYW1lLCBpbnQgcG9ydCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tPcGVuKGhvc3RuYW1lLCBwb3J0KTsgfQAoY29uc3Qgdm9pZCAqYnVmLCB1bnNpZ25lZCBzaXplKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja1dyaXRlKGJ1Ziwgc2l6ZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrQ2xvc2UoKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tJc0F2YWlsYWJsZSgpOyB9AAD5iYGAAARuYW1lAYiJAYUHAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9zaXplAg1lbV9mbGFzaF9sb2FkAwVhYm9ydAQTZW1fc2VuZF9sYXJnZV9mcmFtZQUTX2RldnNfcGFuaWNfaGFuZGxlcgYRZW1fZGVwbG95X2hhbmRsZXIHF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tCA1lbV9zZW5kX2ZyYW1lCQRleGl0CgtlbV90aW1lX25vdwsOZW1fcHJpbnRfZG1lc2cMD19qZF90Y3Bzb2NrX25ldw0RX2pkX3RjcHNvY2tfd3JpdGUOEV9qZF90Y3Bzb2NrX2Nsb3NlDxhfamRfdGNwc29ja19pc19hdmFpbGFibGUQD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFRFfX3dhc21fY2FsbF9jdG9ycxYPZmxhc2hfYmFzZV9hZGRyFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoKZmxhc2hfaW5pdBsIaHdfcGFuaWMcCGpkX2JsaW5rHQdqZF9nbG93HhRqZF9hbGxvY19zdGFja19jaGVjax8IamRfYWxsb2MgB2pkX2ZyZWUhDXRhcmdldF9pbl9pcnEiEnRhcmdldF9kaXNhYmxlX2lycSMRdGFyZ2V0X2VuYWJsZV9pcnEkGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZyUVZGV2c19zZW5kX2xhcmdlX2ZyYW1lJhJkZXZzX3BhbmljX2hhbmRsZXInE2RldnNfZGVwbG95X2hhbmRsZXIoFGpkX2NyeXB0b19nZXRfcmFuZG9tKRBqZF9lbV9zZW5kX2ZyYW1lKhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMisaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcsCmpkX2VtX2luaXQtDWpkX2VtX3Byb2Nlc3MuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzMwxod19kZXZpY2VfaWQ0DHRhcmdldF9yZXNldDUOdGltX2dldF9taWNyb3M2D2FwcF9wcmludF9kbWVzZzcSamRfdGNwc29ja19wcm9jZXNzOBFhcHBfaW5pdF9zZXJ2aWNlczkSZGV2c19jbGllbnRfZGVwbG95OhRjbGllbnRfZXZlbnRfaGFuZGxlcjsJYXBwX2RtZXNnPAtmbHVzaF9kbWVzZz0LYXBwX3Byb2Nlc3M+DmpkX3RjcHNvY2tfbmV3PxBqZF90Y3Bzb2NrX3dyaXRlQBBqZF90Y3Bzb2NrX2Nsb3NlQRdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZUIWamRfZW1fdGNwc29ja19vbl9ldmVudEMHdHhfaW5pdEQPamRfcGFja2V0X3JlYWR5RQp0eF9wcm9jZXNzRg10eF9zZW5kX2ZyYW1lRw5kZXZzX2J1ZmZlcl9vcEgSZGV2c19idWZmZXJfZGVjb2RlSRJkZXZzX2J1ZmZlcl9lbmNvZGVKD2RldnNfY3JlYXRlX2N0eEsJc2V0dXBfY3R4TApkZXZzX3RyYWNlTQ9kZXZzX2Vycm9yX2NvZGVOGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJPCWNsZWFyX2N0eFANZGV2c19mcmVlX2N0eFEIZGV2c19vb21SCWRldnNfZnJlZVMRZGV2c2Nsb3VkX3Byb2Nlc3NUF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VRBkZXZzY2xvdWRfdXBsb2FkVhRkZXZzY2xvdWRfb25fbWVzc2FnZVcOZGV2c2Nsb3VkX2luaXRYFGRldnNfdHJhY2tfZXhjZXB0aW9uWQ9kZXZzZGJnX3Byb2Nlc3NaEWRldnNkYmdfcmVzdGFydGVkWxVkZXZzZGJnX2hhbmRsZV9wYWNrZXRcC3NlbmRfdmFsdWVzXRF2YWx1ZV9mcm9tX3RhZ192MF4ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZV8Nb2JqX2dldF9wcm9wc2AMZXhwYW5kX3ZhbHVlYRJkZXZzZGJnX3N1c3BlbmRfY2JiDGRldnNkYmdfaW5pdGMQZXhwYW5kX2tleV92YWx1ZWQGa3ZfYWRkZQ9kZXZzbWdyX3Byb2Nlc3NmB3RyeV9ydW5nB3J1bl9pbWdoDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBARVfZGV2c19pbnZhbGlkX3Byb2dyYW2CARhkZXZzX2ZpYmVyX2dldF9tYXhfc2xlZXCDAQ9kZXZzX2ZpYmVyX3Bva2WEARFkZXZzX2djX2FkZF9jaHVua4UBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEUZGV2c192YWx1ZV9pc19waW5uZWSOAQ5kZXZzX3ZhbHVlX3Bpbo8BEGRldnNfdmFsdWVfdW5waW6QARJkZXZzX21hcF90cnlfYWxsb2ORARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OSARRkZXZzX2FycmF5X3RyeV9hbGxvY5MBGmRldnNfYnVmZmVyX3RyeV9hbGxvY19pbml0lAEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlQEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlgEQZGV2c19zdHJpbmdfcHJlcJcBEmRldnNfc3RyaW5nX2ZpbmlzaJgBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0mQEPZGV2c19nY19zZXRfY3R4mgEOZGV2c19nY19jcmVhdGWbAQ9kZXZzX2djX2Rlc3Ryb3mcARFkZXZzX2djX29ial9jaGVja50BDmRldnNfZHVtcF9oZWFwngELc2Nhbl9nY19vYmqfARFwcm9wX0FycmF5X2xlbmd0aKABEm1ldGgyX0FycmF5X2luc2VydKEBEmZ1bjFfQXJyYXlfaXNBcnJheaIBFG1ldGhYX0FycmF5X19fY3Rvcl9fowEQbWV0aFhfQXJyYXlfcHVzaKQBFW1ldGgxX0FycmF5X3B1c2hSYW5nZaUBEW1ldGhYX0FycmF5X3NsaWNlpgEQbWV0aDFfQXJyYXlfam9pbqcBEWZ1bjFfQnVmZmVyX2FsbG9jqAEQZnVuMl9CdWZmZXJfZnJvbakBEnByb3BfQnVmZmVyX2xlbmd0aKoBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6sBE21ldGgzX0J1ZmZlcl9maWxsQXSsARNtZXRoNF9CdWZmZXJfYmxpdEF0rQEUbWV0aDNfQnVmZmVyX2luZGV4T2auARdtZXRoMF9CdWZmZXJfZmlsbFJhbmRvba8BFG1ldGg0X0J1ZmZlcl9lbmNyeXB0sAESZnVuM19CdWZmZXJfZGlnZXN0sQEUZGV2c19jb21wdXRlX3RpbWVvdXSyARdmdW4xX0RldmljZVNjcmlwdF9zbGVlcLMBF2Z1bjFfRGV2aWNlU2NyaXB0X2RlbGF5tAEYZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljtQEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290tgEZZnVuMF9EZXZpY2VTY3JpcHRfcmVzdGFydLcBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdLgBF2Z1bjJfRGV2aWNlU2NyaXB0X3ByaW50uQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdLoBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50uwEaZnVuMl9EZXZpY2VTY3JpcHRfX2xvZ1JlcHK8AR1mdW4xX0RldmljZVNjcmlwdF9fZGNmZ1N0cmluZ70BGGZ1bjBfRGV2aWNlU2NyaXB0X21pbGxpc74BImZ1bjFfRGV2aWNlU2NyaXB0X2RldmljZUlkZW50aWZpZXK/AR1mdW4yX0RldmljZVNjcmlwdF9fc2VydmVyU2VuZMABHGZ1bjJfRGV2aWNlU2NyaXB0X19hbGxvY1JvbGXBASBmdW4wX0RldmljZVNjcmlwdF9ub3RJbXBsZW1lbnRlZMIBHmZ1bjJfRGV2aWNlU2NyaXB0X190d2luTWVzc2FnZcMBIWZ1bjNfRGV2aWNlU2NyaXB0X19pMmNUcmFuc2FjdGlvbsQBHmZ1bjVfRGV2aWNlU2NyaXB0X3NwaUNvbmZpZ3VyZcUBGWZ1bjJfRGV2aWNlU2NyaXB0X3NwaVhmZXLGAR5mdW4zX0RldmljZVNjcmlwdF9zcGlTZW5kSW1hZ2XHARRtZXRoMV9FcnJvcl9fX2N0b3JfX8gBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1/JARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1/KARptZXRoMV9TeW50YXhFcnJvcl9fX2N0b3JfX8sBD3Byb3BfRXJyb3JfbmFtZcwBEW1ldGgwX0Vycm9yX3ByaW50zQEPcHJvcF9Ec0ZpYmVyX2lkzgEWcHJvcF9Ec0ZpYmVyX3N1c3BlbmRlZM8BFG1ldGgxX0RzRmliZXJfcmVzdW1l0AEXbWV0aDBfRHNGaWJlcl90ZXJtaW5hdGXRARlmdW4xX0RldmljZVNjcmlwdF9zdXNwZW5k0gERZnVuMF9Ec0ZpYmVyX3NlbGbTARRtZXRoWF9GdW5jdGlvbl9zdGFydNQBF3Byb3BfRnVuY3Rpb25fcHJvdG90eXBl1QEScHJvcF9GdW5jdGlvbl9uYW1l1gETZGV2c19ncGlvX2luaXRfZGNmZ9cBCWluaXRfdXNlZNgBDnByb3BfR1BJT19tb2Rl2QEWcHJvcF9HUElPX2NhcGFiaWxpdGllc9oBD3Byb3BfR1BJT192YWx1ZdsBEm1ldGgxX0dQSU9fc2V0TW9kZdwBEHByb3BfSW1hZ2Vfd2lkdGjdARFwcm9wX0ltYWdlX2hlaWdodN4BDnByb3BfSW1hZ2VfYnBw3wERcHJvcF9JbWFnZV9idWZmZXLgARBmdW41X0ltYWdlX2FsbG9j4QEPbWV0aDNfSW1hZ2Vfc2V04gEMZGV2c19hcmdfaW1n4wEHc2V0Q29yZeQBD21ldGgyX0ltYWdlX2dldOUBEG1ldGgxX0ltYWdlX2ZpbGzmAQlmaWxsX3JlY3TnARRtZXRoNV9JbWFnZV9maWxsUmVjdOgBEm1ldGgxX0ltYWdlX2VxdWFsc+kBEW1ldGgwX0ltYWdlX2Nsb25l6gENYWxsb2NfaW1nX3JldOsBEW1ldGgwX0ltYWdlX2ZsaXBY7AEHcGl4X3B0cu0BEW1ldGgwX0ltYWdlX2ZsaXBZ7gEWbWV0aDBfSW1hZ2VfdHJhbnNwb3NlZO8BFW1ldGgzX0ltYWdlX2RyYXdJbWFnZfABDWRldnNfYXJnX2ltZzLxAQ1kcmF3SW1hZ2VDb3Jl8gEgbWV0aDRfSW1hZ2VfZHJhd1RyYW5zcGFyZW50SW1hZ2XzARhtZXRoM19JbWFnZV9vdmVybGFwc1dpdGj0ARRtZXRoNV9JbWFnZV9kcmF3TGluZfUBCGRyYXdMaW5l9gETbWFrZV93cml0YWJsZV9pbWFnZfcBC2RyYXdMaW5lTG93+AEMZHJhd0xpbmVIaWdo+QETbWV0aDVfSW1hZ2VfYmxpdFJvd/oBEW1ldGgxMV9JbWFnZV9ibGl0+wEWbWV0aDRfSW1hZ2VfZmlsbENpcmNsZfwBD2Z1bjJfSlNPTl9wYXJzZf0BE2Z1bjNfSlNPTl9zdHJpbmdpZnn+AQ5mdW4xX01hdGhfY2VpbP8BD2Z1bjFfTWF0aF9mbG9vcoACD2Z1bjFfTWF0aF9yb3VuZIECDWZ1bjFfTWF0aF9hYnOCAhBmdW4wX01hdGhfcmFuZG9tgwITZnVuMV9NYXRoX3JhbmRvbUludIQCDWZ1bjFfTWF0aF9sb2eFAg1mdW4yX01hdGhfcG93hgIOZnVuMl9NYXRoX2lkaXaHAg5mdW4yX01hdGhfaW1vZIgCDmZ1bjJfTWF0aF9pbXVsiQINZnVuMl9NYXRoX21pbooCC2Z1bjJfbWlubWF4iwINZnVuMl9NYXRoX21heIwCEmZ1bjJfT2JqZWN0X2Fzc2lnbo0CEGZ1bjFfT2JqZWN0X2tleXOOAhNmdW4xX2tleXNfb3JfdmFsdWVzjwISZnVuMV9PYmplY3RfdmFsdWVzkAIaZnVuMl9PYmplY3Rfc2V0UHJvdG90eXBlT2aRAhVtZXRoMV9PYmplY3RfX19jdG9yX1+SAh1kZXZzX3ZhbHVlX3RvX3BhY2tldF9vcl90aHJvd5MCEnByb3BfRHNQYWNrZXRfcm9sZZQCHnByb3BfRHNQYWNrZXRfZGV2aWNlSWRlbnRpZmllcpUCFXByb3BfRHNQYWNrZXRfc2hvcnRJZJYCGnByb3BfRHNQYWNrZXRfc2VydmljZUluZGV4lwIccHJvcF9Ec1BhY2tldF9zZXJ2aWNlQ29tbWFuZJgCE3Byb3BfRHNQYWNrZXRfZmxhZ3OZAhdwcm9wX0RzUGFja2V0X2lzQ29tbWFuZJoCFnByb3BfRHNQYWNrZXRfaXNSZXBvcnSbAhVwcm9wX0RzUGFja2V0X3BheWxvYWScAhVwcm9wX0RzUGFja2V0X2lzRXZlbnSdAhdwcm9wX0RzUGFja2V0X2V2ZW50Q29kZZ4CFnByb3BfRHNQYWNrZXRfaXNSZWdTZXSfAhZwcm9wX0RzUGFja2V0X2lzUmVnR2V0oAIVcHJvcF9Ec1BhY2tldF9yZWdDb2RloQIWcHJvcF9Ec1BhY2tldF9pc0FjdGlvbqICFWRldnNfcGt0X3NwZWNfYnlfY29kZaMCEnByb3BfRHNQYWNrZXRfc3BlY6QCEWRldnNfcGt0X2dldF9zcGVjpQIVbWV0aDBfRHNQYWNrZXRfZGVjb2RlpgIdbWV0aDBfRHNQYWNrZXRfbm90SW1wbGVtZW50ZWSnAhhwcm9wX0RzUGFja2V0U3BlY19wYXJlbnSoAhZwcm9wX0RzUGFja2V0U3BlY19uYW1lqQIWcHJvcF9Ec1BhY2tldFNwZWNfY29kZaoCGnByb3BfRHNQYWNrZXRTcGVjX3Jlc3BvbnNlqwIZbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZawCEmRldnNfcGFja2V0X2RlY29kZa0CFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZK4CFERzUmVnaXN0ZXJfcmVhZF9jb250rwISZGV2c19wYWNrZXRfZW5jb2RlsAIWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZbECFnByb3BfRHNQYWNrZXRJbmZvX3JvbGWyAhZwcm9wX0RzUGFja2V0SW5mb19uYW1lswIWcHJvcF9Ec1BhY2tldEluZm9fY29kZbQCGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX7UCE3Byb3BfRHNSb2xlX2lzQm91bmS2AhBwcm9wX0RzUm9sZV9zcGVjtwIYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5kuAIicHJvcF9Ec1NlcnZpY2VTcGVjX2NsYXNzSWRlbnRpZmllcrkCF3Byb3BfRHNTZXJ2aWNlU3BlY19uYW1lugIabWV0aDFfRHNTZXJ2aWNlU3BlY19sb29rdXC7AhptZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbrwCHWZ1bjJfRGV2aWNlU2NyaXB0X19zb2NrZXRPcGVuvQIQdGNwc29ja19vbl9ldmVudL4CHmZ1bjBfRGV2aWNlU2NyaXB0X19zb2NrZXRDbG9zZb8CHmZ1bjFfRGV2aWNlU2NyaXB0X19zb2NrZXRXcml0ZcACEnByb3BfU3RyaW5nX2xlbmd0aMECFnByb3BfU3RyaW5nX2J5dGVMZW5ndGjCAhdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdMMCE21ldGgxX1N0cmluZ19jaGFyQXTEAhJtZXRoMl9TdHJpbmdfc2xpY2XFAhhmdW5YX1N0cmluZ19mcm9tQ2hhckNvZGXGAhRtZXRoM19TdHJpbmdfaW5kZXhPZscCGG1ldGgwX1N0cmluZ190b0xvd2VyQ2FzZcgCE21ldGgwX1N0cmluZ190b0Nhc2XJAhhtZXRoMF9TdHJpbmdfdG9VcHBlckNhc2XKAgxkZXZzX2luc3BlY3TLAgtpbnNwZWN0X29iaswCB2FkZF9zdHLNAg1pbnNwZWN0X2ZpZWxkzgIUZGV2c19qZF9nZXRfcmVnaXN0ZXLPAhZkZXZzX2pkX2NsZWFyX3BrdF9raW5k0AIQZGV2c19qZF9zZW5kX2NtZNECEGRldnNfamRfc2VuZF9yYXfSAhNkZXZzX2pkX3NlbmRfbG9nbXNn0wITZGV2c19qZF9wa3RfY2FwdHVyZdQCEWRldnNfamRfd2FrZV9yb2xl1QISZGV2c19qZF9zaG91bGRfcnVu1gITZGV2c19qZF9wcm9jZXNzX3BrdNcCGGRldnNfamRfc2VydmVyX2RldmljZV9pZNgCF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl2QISZGV2c19qZF9hZnRlcl91c2Vy2gIUZGV2c19qZF9yb2xlX2NoYW5nZWTbAhRkZXZzX2pkX3Jlc2V0X3BhY2tldNwCEmRldnNfamRfaW5pdF9yb2xlc90CEmRldnNfamRfZnJlZV9yb2xlc94CEmRldnNfamRfYWxsb2Nfcm9sZd8CFWRldnNfc2V0X2dsb2JhbF9mbGFnc+ACF2RldnNfcmVzZXRfZ2xvYmFsX2ZsYWdz4QIVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz4gIPamRfbmVlZF90b19zZW5k4wIQZGV2c19qc29uX2VzY2FwZeQCFWRldnNfanNvbl9lc2NhcGVfY29yZeUCD2RldnNfanNvbl9wYXJzZeYCCmpzb25fdmFsdWXnAgxwYXJzZV9zdHJpbmfoAhNkZXZzX2pzb25fc3RyaW5naWZ56QINc3RyaW5naWZ5X29iauoCEXBhcnNlX3N0cmluZ19jb3Jl6wIKYWRkX2luZGVudOwCD3N0cmluZ2lmeV9maWVsZO0CEWRldnNfbWFwbGlrZV9pdGVy7gIXZGV2c19nZXRfYnVpbHRpbl9vYmplY3TvAhJkZXZzX21hcF9jb3B5X2ludG/wAgxkZXZzX21hcF9zZXTxAgZsb29rdXDyAhNkZXZzX21hcGxpa2VfaXNfbWFw8wIbZGV2c19tYXBsaWtlX2tleXNfb3JfdmFsdWVz9AIRZGV2c19hcnJheV9pbnNlcnT1Aghrdl9hZGQuMfYCEmRldnNfc2hvcnRfbWFwX3NldPcCD2RldnNfbWFwX2RlbGV0ZfgCEmRldnNfc2hvcnRfbWFwX2dldPkCIGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWNfaWR4+gIcZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY/sCG2RldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlY/wCHmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVjX2lkeP0CGmRldnNfdmFsdWVfdG9fc2VydmljZV9zcGVj/gIXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXT/AhhkZXZzX3JvbGVfc3BlY19mb3JfY2xhc3OAAxdkZXZzX3BhY2tldF9zcGVjX3BhcmVudIEDDmRldnNfcm9sZV9zcGVjggMRZGV2c19yb2xlX3NlcnZpY2WDAw5kZXZzX3JvbGVfbmFtZYQDEmRldnNfZ2V0X2Jhc2Vfc3BlY4UDEGRldnNfc3BlY19sb29rdXCGAxJkZXZzX2Z1bmN0aW9uX2JpbmSHAxFkZXZzX21ha2VfY2xvc3VyZYgDDmRldnNfZ2V0X2ZuaWR4iQMTZGV2c19nZXRfZm5pZHhfY29yZYoDGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZIsDGGRldnNfbWFwbGlrZV9nZXRfbm9fYmluZIwDE2RldnNfZ2V0X3NwZWNfcHJvdG+NAxNkZXZzX2dldF9yb2xlX3Byb3RvjgMbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3jwMVZGV2c19nZXRfc3RhdGljX3Byb3RvkAMbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3JvkQMdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW2SAxZkZXZzX21hcGxpa2VfZ2V0X3Byb3RvkwMYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxklAMeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxklQMQZGV2c19pbnN0YW5jZV9vZpYDD2RldnNfb2JqZWN0X2dldJcDDGRldnNfc2VxX2dldJgDDGRldnNfYW55X2dldJkDDGRldnNfYW55X3NldJoDDGRldnNfc2VxX3NldJsDDmRldnNfYXJyYXlfc2V0nAMTZGV2c19hcnJheV9waW5fcHVzaJ0DEWRldnNfYXJnX2ludF9kZWZsngMMZGV2c19hcmdfaW50nwMNZGV2c19hcmdfYm9vbKADD2RldnNfYXJnX2RvdWJsZaEDD2RldnNfcmV0X2RvdWJsZaIDDGRldnNfcmV0X2ludKMDDWRldnNfcmV0X2Jvb2ykAw9kZXZzX3JldF9nY19wdHKlAxFkZXZzX2FyZ19zZWxmX21hcKYDEWRldnNfc2V0dXBfcmVzdW1lpwMPZGV2c19jYW5fYXR0YWNoqAMZZGV2c19idWlsdGluX29iamVjdF92YWx1ZakDFWRldnNfbWFwbGlrZV90b192YWx1ZaoDEmRldnNfcmVnY2FjaGVfZnJlZasDFmRldnNfcmVnY2FjaGVfZnJlZV9hbGysAxdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZK0DE2RldnNfcmVnY2FjaGVfYWxsb2OuAxRkZXZzX3JlZ2NhY2hlX2xvb2t1cK8DEWRldnNfcmVnY2FjaGVfYWdlsAMXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWxAxJkZXZzX3JlZ2NhY2hlX25leHSyAw9qZF9zZXR0aW5nc19nZXSzAw9qZF9zZXR0aW5nc19zZXS0Aw5kZXZzX2xvZ192YWx1ZbUDD2RldnNfc2hvd192YWx1ZbYDEGRldnNfc2hvd192YWx1ZTC3Aw1jb25zdW1lX2NodW5ruAMNc2hhXzI1Nl9jbG9zZbkDD2pkX3NoYTI1Nl9zZXR1cLoDEGpkX3NoYTI1Nl91cGRhdGW7AxBqZF9zaGEyNTZfZmluaXNovAMUamRfc2hhMjU2X2htYWNfc2V0dXC9AxVqZF9zaGEyNTZfaG1hY191cGRhdGW+AxVqZF9zaGEyNTZfaG1hY19maW5pc2i/Aw5qZF9zaGEyNTZfaGtkZsADDmRldnNfc3RyZm9ybWF0wQMOZGV2c19pc19zdHJpbmfCAw5kZXZzX2lzX251bWJlcsMDG2RldnNfc3RyaW5nX2dldF91dGY4X3N0cnVjdMQDFGRldnNfc3RyaW5nX2dldF91dGY4xQMTZGV2c19idWlsdGluX3N0cmluZ8YDFGRldnNfc3RyaW5nX3ZzcHJpbnRmxwMTZGV2c19zdHJpbmdfc3ByaW50ZsgDFWRldnNfc3RyaW5nX2Zyb21fdXRmOMkDFGRldnNfdmFsdWVfdG9fc3RyaW5nygMQYnVmZmVyX3RvX3N0cmluZ8sDGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGTMAxJkZXZzX3N0cmluZ19jb25jYXTNAxFkZXZzX3N0cmluZ19zbGljZc4DEmRldnNfcHVzaF90cnlmcmFtZc8DEWRldnNfcG9wX3RyeWZyYW1l0AMPZGV2c19kdW1wX3N0YWNr0QMTZGV2c19kdW1wX2V4Y2VwdGlvbtIDCmRldnNfdGhyb3fTAxJkZXZzX3Byb2Nlc3NfdGhyb3fUAxBkZXZzX2FsbG9jX2Vycm9y1QMVZGV2c190aHJvd190eXBlX2Vycm9y1gMYZGV2c190aHJvd19nZW5lcmljX2Vycm9y1wMWZGV2c190aHJvd19yYW5nZV9lcnJvctgDHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvctkDGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9y2gMeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh02wMYZGV2c190aHJvd190b29fYmlnX2Vycm9y3AMXZGV2c190aHJvd19zeW50YXhfZXJyb3LdAxFkZXZzX3N0cmluZ19pbmRleN4DEmRldnNfc3RyaW5nX2xlbmd0aN8DGWRldnNfdXRmOF9mcm9tX2NvZGVfcG9pbnTgAxtkZXZzX3V0ZjhfY29kZV9wb2ludF9sZW5ndGjhAxRkZXZzX3V0ZjhfY29kZV9wb2ludOIDFGRldnNfc3RyaW5nX2ptcF9pbml04wMOZGV2c191dGY4X2luaXTkAxZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl5QMTZGV2c192YWx1ZV9mcm9tX2ludOYDFGRldnNfdmFsdWVfZnJvbV9ib29s5wMXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLoAxRkZXZzX3ZhbHVlX3RvX2RvdWJsZekDEWRldnNfdmFsdWVfdG9faW506gMSZGV2c192YWx1ZV90b19ib29s6wMOZGV2c19pc19idWZmZXLsAxdkZXZzX2J1ZmZlcl9pc193cml0YWJsZe0DEGRldnNfYnVmZmVyX2RhdGHuAxNkZXZzX2J1ZmZlcmlzaF9kYXRh7wMUZGV2c192YWx1ZV90b19nY19vYmrwAw1kZXZzX2lzX2FycmF58QMRZGV2c192YWx1ZV90eXBlb2byAw9kZXZzX2lzX251bGxpc2jzAxlkZXZzX2lzX251bGxfb3JfdW5kZWZpbmVk9AMUZGV2c192YWx1ZV9hcHByb3hfZXH1AxJkZXZzX3ZhbHVlX2llZWVfZXH2Aw1kZXZzX3ZhbHVlX2Vx9wMcZGV2c192YWx1ZV9lcV9idWlsdGluX3N0cmluZ/gDHmRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wY/kDEmRldnNfaW1nX3N0cmlkeF9va/oDEmRldnNfZHVtcF92ZXJzaW9uc/sDC2RldnNfdmVyaWZ5/AMRZGV2c19mZXRjaF9vcGNvZGX9Aw5kZXZzX3ZtX3Jlc3VtZf4DEWRldnNfdm1fc2V0X2RlYnVn/wMZZGV2c192bV9jbGVhcl9icmVha3BvaW50c4AEGGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludIEEDGRldnNfdm1faGFsdIIED2RldnNfdm1fc3VzcGVuZIMEFmRldnNfdm1fc2V0X2JyZWFrcG9pbnSEBBRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc4UED2RldnNfaW5fdm1fbG9vcIYEGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4hwQXZGV2c19pbWdfZ2V0X3N0cmluZ19qbXCIBBFkZXZzX2ltZ19nZXRfdXRmOIkEFGRldnNfZ2V0X3N0YXRpY191dGY4igQUZGV2c192YWx1ZV9idWZmZXJpc2iLBAxleHByX2ludmFsaWSMBBRleHByeF9idWlsdGluX29iamVjdI0EC3N0bXQxX2NhbGwwjgQLc3RtdDJfY2FsbDGPBAtzdG10M19jYWxsMpAEC3N0bXQ0X2NhbGwzkQQLc3RtdDVfY2FsbDSSBAtzdG10Nl9jYWxsNZMEC3N0bXQ3X2NhbGw2lAQLc3RtdDhfY2FsbDeVBAtzdG10OV9jYWxsOJYEEnN0bXQyX2luZGV4X2RlbGV0ZZcEDHN0bXQxX3JldHVybpgECXN0bXR4X2ptcJkEDHN0bXR4MV9qbXBfepoECmV4cHIyX2JpbmSbBBJleHByeF9vYmplY3RfZmllbGScBBJzdG10eDFfc3RvcmVfbG9jYWydBBNzdG10eDFfc3RvcmVfZ2xvYmFsngQSc3RtdDRfc3RvcmVfYnVmZmVynwQJZXhwcjBfaW5moAQQZXhwcnhfbG9hZF9sb2NhbKEEEWV4cHJ4X2xvYWRfZ2xvYmFsogQLZXhwcjFfdXBsdXOjBAtleHByMl9pbmRleKQED3N0bXQzX2luZGV4X3NldKUEFGV4cHJ4MV9idWlsdGluX2ZpZWxkpgQSZXhwcngxX2FzY2lpX2ZpZWxkpwQRZXhwcngxX3V0ZjhfZmllbGSoBBBleHByeF9tYXRoX2ZpZWxkqQQOZXhwcnhfZHNfZmllbGSqBA9zdG10MF9hbGxvY19tYXCrBBFzdG10MV9hbGxvY19hcnJheawEEnN0bXQxX2FsbG9jX2J1ZmZlcq0EF2V4cHJ4X3N0YXRpY19zcGVjX3Byb3RvrgQTZXhwcnhfc3RhdGljX2J1ZmZlcq8EG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ7AEGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmexBBhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmeyBBVleHByeF9zdGF0aWNfZnVuY3Rpb26zBA1leHByeF9saXRlcmFstAQRZXhwcnhfbGl0ZXJhbF9mNjS1BBFleHByM19sb2FkX2J1ZmZlcrYEDWV4cHIwX3JldF92YWy3BAxleHByMV90eXBlb2a4BA9leHByMF91bmRlZmluZWS5BBJleHByMV9pc191bmRlZmluZWS6BApleHByMF90cnVluwQLZXhwcjBfZmFsc2W8BA1leHByMV90b19ib29svQQJZXhwcjBfbmFuvgQJZXhwcjFfYWJzvwQNZXhwcjFfYml0X25vdMAEDGV4cHIxX2lzX25hbsEECWV4cHIxX25lZ8IECWV4cHIxX25vdMMEDGV4cHIxX3RvX2ludMQECWV4cHIyX2FkZMUECWV4cHIyX3N1YsYECWV4cHIyX211bMcECWV4cHIyX2RpdsgEDWV4cHIyX2JpdF9hbmTJBAxleHByMl9iaXRfb3LKBA1leHByMl9iaXRfeG9yywQQZXhwcjJfc2hpZnRfbGVmdMwEEWV4cHIyX3NoaWZ0X3JpZ2h0zQQaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTOBAhleHByMl9lcc8ECGV4cHIyX2xl0AQIZXhwcjJfbHTRBAhleHByMl9uZdIEEGV4cHIxX2lzX251bGxpc2jTBBRzdG10eDJfc3RvcmVfY2xvc3VyZdQEE2V4cHJ4MV9sb2FkX2Nsb3N1cmXVBBJleHByeF9tYWtlX2Nsb3N1cmXWBBBleHByMV90eXBlb2Zfc3Ry1wQTc3RtdHhfam1wX3JldF92YWxfetgEEHN0bXQyX2NhbGxfYXJyYXnZBAlzdG10eF90cnnaBA1zdG10eF9lbmRfdHJ52wQLc3RtdDBfY2F0Y2jcBA1zdG10MF9maW5hbGx53QQLc3RtdDFfdGhyb3feBA5zdG10MV9yZV90aHJvd98EEHN0bXR4MV90aHJvd19qbXDgBA5zdG10MF9kZWJ1Z2dlcuEECWV4cHIxX25ld+IEEWV4cHIyX2luc3RhbmNlX29m4wQKZXhwcjBfbnVsbOQED2V4cHIyX2FwcHJveF9lceUED2V4cHIyX2FwcHJveF9uZeYEE3N0bXQxX3N0b3JlX3JldF92YWznBBFleHByeF9zdGF0aWNfc3BlY+gED2RldnNfdm1fcG9wX2FyZ+kEE2RldnNfdm1fcG9wX2FyZ191MzLqBBNkZXZzX3ZtX3BvcF9hcmdfaTMy6wQWZGV2c192bV9wb3BfYXJnX2J1ZmZlcuwEEmpkX2Flc19jY21fZW5jcnlwdO0EEmpkX2Flc19jY21fZGVjcnlwdO4EDEFFU19pbml0X2N0eO8ED0FFU19FQ0JfZW5jcnlwdPAEEGpkX2Flc19zZXR1cF9rZXnxBA5qZF9hZXNfZW5jcnlwdPIEEGpkX2Flc19jbGVhcl9rZXnzBA5qZF93ZWJzb2NrX25ld/QEF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdl9QQMc2VuZF9tZXNzYWdl9gQTamRfdGNwc29ja19vbl9ldmVudPcEB29uX2RhdGH4BAtyYWlzZV9lcnJvcvkECXNoaWZ0X21zZ/oEEGpkX3dlYnNvY2tfY2xvc2X7BAtqZF93c3NrX25ld/wEFGpkX3dzc2tfc2VuZF9tZXNzYWdl/QQTamRfd2Vic29ja19vbl9ldmVudP4EB2RlY3J5cHT/BA1qZF93c3NrX2Nsb3NlgAUQamRfd3Nza19vbl9ldmVudIEFC3Jlc3Bfc3RhdHVzggUSd3Nza2hlYWx0aF9wcm9jZXNzgwUUd3Nza2hlYWx0aF9yZWNvbm5lY3SEBRh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSFBQ9zZXRfY29ubl9zdHJpbmeGBRFjbGVhcl9jb25uX3N0cmluZ4cFD3dzc2toZWFsdGhfaW5pdIgFEXdzc2tfc2VuZF9tZXNzYWdliQURd3Nza19pc19jb25uZWN0ZWSKBRR3c3NrX3RyYWNrX2V4Y2VwdGlvbosFEndzc2tfc2VydmljZV9xdWVyeYwFHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWNBRZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xljgUPcm9sZW1ncl9wcm9jZXNzjwUQcm9sZW1ncl9hdXRvYmluZJAFFXJvbGVtZ3JfaGFuZGxlX3BhY2tldJEFFGpkX3JvbGVfbWFuYWdlcl9pbml0kgUYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkkwURamRfcm9sZV9zZXRfaGludHOUBQ1qZF9yb2xlX2FsbG9jlQUQamRfcm9sZV9mcmVlX2FsbJYFFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmSXBRNqZF9jbGllbnRfbG9nX2V2ZW50mAUTamRfY2xpZW50X3N1YnNjcmliZZkFFGpkX2NsaWVudF9lbWl0X2V2ZW50mgUUcm9sZW1ncl9yb2xlX2NoYW5nZWSbBRBqZF9kZXZpY2VfbG9va3VwnAUYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlnQUTamRfc2VydmljZV9zZW5kX2NtZJ4FEWpkX2NsaWVudF9wcm9jZXNznwUOamRfZGV2aWNlX2ZyZWWgBRdqZF9jbGllbnRfaGFuZGxlX3BhY2tldKEFD2pkX2RldmljZV9hbGxvY6IFEHNldHRpbmdzX3Byb2Nlc3OjBRZzZXR0aW5nc19oYW5kbGVfcGFja2V0pAUNc2V0dGluZ3NfaW5pdKUFDnRhcmdldF9zdGFuZGJ5pgUPamRfY3RybF9wcm9jZXNzpwUVamRfY3RybF9oYW5kbGVfcGFja2V0qAUMamRfY3RybF9pbml0qQUUZGNmZ19zZXRfdXNlcl9jb25maWeqBQlkY2ZnX2luaXSrBQ1kY2ZnX3ZhbGlkYXRlrAUOZGNmZ19nZXRfZW50cnmtBRNkY2ZnX2dldF9uZXh0X2VudHJ5rgUMZGNmZ19nZXRfaTMyrwUMZGNmZ19nZXRfdTMysAUPZGNmZ19nZXRfc3RyaW5nsQUMZGNmZ19pZHhfa2V5sgUJamRfdmRtZXNnswURamRfZG1lc2dfc3RhcnRwdHK0BQ1qZF9kbWVzZ19yZWFktQUSamRfZG1lc2dfcmVhZF9saW5ltgUTamRfc2V0dGluZ3NfZ2V0X2JpbrcFCmZpbmRfZW50cnm4BQ9yZWNvbXB1dGVfY2FjaGW5BRNqZF9zZXR0aW5nc19zZXRfYmluugULamRfZnN0b3JfZ2O7BRVqZF9zZXR0aW5nc19nZXRfbGFyZ2W8BRZqZF9zZXR0aW5nc19wcmVwX2xhcmdlvQUKbWFya19sYXJnZb4FF2pkX3NldHRpbmdzX3dyaXRlX2xhcmdlvwUWamRfc2V0dGluZ3Nfc3luY19sYXJnZcAFEGpkX3NldF9tYXhfc2xlZXDBBQ1qZF9pcGlwZV9vcGVuwgUWamRfaXBpcGVfaGFuZGxlX3BhY2tldMMFDmpkX2lwaXBlX2Nsb3NlxAUSamRfbnVtZm10X2lzX3ZhbGlkxQUVamRfbnVtZm10X3dyaXRlX2Zsb2F0xgUTamRfbnVtZm10X3dyaXRlX2kzMscFEmpkX251bWZtdF9yZWFkX2kzMsgFFGpkX251bWZtdF9yZWFkX2Zsb2F0yQURamRfb3BpcGVfb3Blbl9jbWTKBRRqZF9vcGlwZV9vcGVuX3JlcG9ydMsFFmpkX29waXBlX2hhbmRsZV9wYWNrZXTMBRFqZF9vcGlwZV93cml0ZV9leM0FEGpkX29waXBlX3Byb2Nlc3POBRRqZF9vcGlwZV9jaGVja19zcGFjZc8FDmpkX29waXBlX3dyaXRl0AUOamRfb3BpcGVfY2xvc2XRBQ1qZF9xdWV1ZV9wdXNo0gUOamRfcXVldWVfZnJvbnTTBQ5qZF9xdWV1ZV9zaGlmdNQFDmpkX3F1ZXVlX2FsbG9j1QUNamRfcmVzcG9uZF91ONYFDmpkX3Jlc3BvbmRfdTE21wUOamRfcmVzcG9uZF91MzLYBRFqZF9yZXNwb25kX3N0cmluZ9kFF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk2gULamRfc2VuZF9wa3TbBR1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbNwFF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy3QUZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldN4FFGpkX2FwcF9oYW5kbGVfcGFja2V03wUVamRfYXBwX2hhbmRsZV9jb21tYW5k4AUVYXBwX2dldF9pbnN0YW5jZV9uYW1l4QUTamRfYWxsb2NhdGVfc2VydmljZeIFEGpkX3NlcnZpY2VzX2luaXTjBQ5qZF9yZWZyZXNoX25vd+QFGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTlBRRqZF9zZXJ2aWNlc19hbm5vdW5jZeYFF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l5wUQamRfc2VydmljZXNfdGlja+gFFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+kFGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl6gUWYXBwX2dldF9kZXZfY2xhc3NfbmFtZesFFGFwcF9nZXRfZGV2aWNlX2NsYXNz7AUSYXBwX2dldF9md192ZXJzaW9u7QUNamRfc3J2Y2ZnX3J1bu4FF2pkX3NydmNmZ19pbnN0YW5jZV9uYW1l7wURamRfc3J2Y2ZnX3ZhcmlhbnTwBQ1qZF9oYXNoX2ZudjFh8QUMamRfZGV2aWNlX2lk8gUJamRfcmFuZG9t8wUIamRfY3JjMTb0BQ5qZF9jb21wdXRlX2NyY/UFDmpkX3NoaWZ0X2ZyYW1l9gUMamRfd29yZF9tb3Zl9wUOamRfcmVzZXRfZnJhbWX4BRBqZF9wdXNoX2luX2ZyYW1l+QUNamRfcGFuaWNfY29yZfoFE2pkX3Nob3VsZF9zYW1wbGVfbXP7BRBqZF9zaG91bGRfc2FtcGxl/AUJamRfdG9faGV4/QULamRfZnJvbV9oZXj+BQ5qZF9hc3NlcnRfZmFpbP8FB2pkX2F0b2mABg9qZF92c3ByaW50Zl9leHSBBg9qZF9wcmludF9kb3VibGWCBgtqZF92c3ByaW50ZoMGCmpkX3NwcmludGaEBhJqZF9kZXZpY2Vfc2hvcnRfaWSFBgxqZF9zcHJpbnRmX2GGBgtqZF90b19oZXhfYYcGCWpkX3N0cmR1cIgGCWpkX21lbWR1cIkGDGpkX2VuZHNfd2l0aIoGDmpkX3N0YXJ0c193aXRoiwYWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYwGFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWNBhFqZF9zZW5kX2V2ZW50X2V4dI4GCmpkX3J4X2luaXSPBh1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja5AGD2pkX3J4X2dldF9mcmFtZZEGE2pkX3J4X3JlbGVhc2VfZnJhbWWSBhFqZF9zZW5kX2ZyYW1lX3Jhd5MGDWpkX3NlbmRfZnJhbWWUBgpqZF90eF9pbml0lQYHamRfc2VuZJYGD2pkX3R4X2dldF9mcmFtZZcGEGpkX3R4X2ZyYW1lX3NlbnSYBgtqZF90eF9mbHVzaJkGEF9fZXJybm9fbG9jYXRpb26aBgxfX2ZwY2xhc3NpZnmbBgVkdW1teZwGCF9fbWVtY3B5nQYHbWVtbW92ZZ4GBm1lbXNldJ8GCl9fbG9ja2ZpbGWgBgxfX3VubG9ja2ZpbGWhBgZmZmx1c2iiBgRmbW9kowYNX19ET1VCTEVfQklUU6QGDF9fc3RkaW9fc2Vla6UGDV9fc3RkaW9fd3JpdGWmBg1fX3N0ZGlvX2Nsb3NlpwYIX190b3JlYWSoBglfX3Rvd3JpdGWpBglfX2Z3cml0ZXiqBgZmd3JpdGWrBhRfX3B0aHJlYWRfbXV0ZXhfbG9ja6wGFl9fcHRocmVhZF9tdXRleF91bmxvY2utBgZfX2xvY2uuBghfX3VubG9ja68GDl9fbWF0aF9kaXZ6ZXJvsAYKZnBfYmFycmllcrEGDl9fbWF0aF9pbnZhbGlksgYDbG9nswYFdG9wMTa0BgVsb2cxMLUGB19fbHNlZWu2BgZtZW1jbXC3BgpfX29mbF9sb2NruAYMX19vZmxfdW5sb2NruQYMX19tYXRoX3hmbG93ugYMZnBfYmFycmllci4xuwYMX19tYXRoX29mbG93vAYMX19tYXRoX3VmbG93vQYEZmFic74GA3Bvd78GBXRvcDEywAYKemVyb2luZm5hbsEGCGNoZWNraW50wgYMZnBfYmFycmllci4ywwYKbG9nX2lubGluZcQGCmV4cF9pbmxpbmXFBgtzcGVjaWFsY2FzZcYGDWZwX2ZvcmNlX2V2YWzHBgVyb3VuZMgGBnN0cmNocskGC19fc3RyY2hybnVsygYGc3RyY21wywYGc3RybGVuzAYGbWVtY2hyzQYGc3Ryc3RyzgYOdHdvYnl0ZV9zdHJzdHLPBhB0aHJlZWJ5dGVfc3Ryc3Ry0AYPZm91cmJ5dGVfc3Ryc3Ry0QYNdHdvd2F5X3N0cnN0ctIGB19fdWZsb3fTBgdfX3NobGlt1AYIX19zaGdldGPVBgdpc3NwYWNl1gYGc2NhbGJu1wYJY29weXNpZ25s2AYHc2NhbGJubNkGDV9fZnBjbGFzc2lmeWzaBgVmbW9kbNsGBWZhYnNs3AYLX19mbG9hdHNjYW7dBghoZXhmbG9hdN4GCGRlY2Zsb2F03wYHc2NhbmV4cOAGBnN0cnRveOEGBnN0cnRvZOIGEl9fd2FzaV9zeXNjYWxsX3JldOMGCGRsbWFsbG9j5AYGZGxmcmVl5QYYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl5gYEc2Jya+cGCF9fYWRkdGYz6AYJX19hc2hsdGkz6QYHX19sZXRmMuoGB19fZ2V0ZjLrBghfX2RpdnRmM+wGDV9fZXh0ZW5kZGZ0ZjLtBg1fX2V4dGVuZHNmdGYy7gYLX19mbG9hdHNpdGbvBg1fX2Zsb2F0dW5zaXRm8AYNX19mZV9nZXRyb3VuZPEGEl9fZmVfcmFpc2VfaW5leGFjdPIGCV9fbHNocnRpM/MGCF9fbXVsdGYz9AYIX19tdWx0aTP1BglfX3Bvd2lkZjL2BghfX3N1YnRmM/cGDF9fdHJ1bmN0ZmRmMvgGC3NldFRlbXBSZXQw+QYLZ2V0VGVtcFJldDD6BglzdGFja1NhdmX7BgxzdGFja1Jlc3RvcmX8BgpzdGFja0FsbG9j/QYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudP4GFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdP8GGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWABxllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlgQcYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kggcMZHluQ2FsbF9qaWppgwcWbGVnYWxzdHViJGR5bkNhbGxfamlqaYQHGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAYIHBAAEZnB0cgEBMAIBMQMBMgc3BAAPX19zdGFja19wb2ludGVyAQh0ZW1wUmV0MAILX19zdGFja19lbmQDDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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

var ___start_em_js = Module['___start_em_js'] = 30616;
var ___stop_em_js = Module['___stop_em_js'] = 32101;



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
