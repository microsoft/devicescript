
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
                let buf;
                if (data.length >= 0xff) {
                    buf = new Uint8Array(3 + data.length);
                    buf[0] = 0xff;
                    buf[1] = data.length & 0xff;
                    buf[2] = data.length >> 8;
                    buf.set(data, 3);
                }
                else {
                    buf = new Uint8Array(1 + data.length);
                    buf[0] = data.length;
                    buf.set(data, 1);
                }
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABtYKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/f39/fwBgBX9/f39/AX9gBX9+fn5+AGAGf39/f39/AGAAAX5gAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gBn9/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C/IOAgAAVA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX3NpemUACANlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA/WGgIAA8wYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAPBw8ABwcDBQIHBwMDBwgBAgcHBA4LDAYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMHBQcGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAAAAQAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAQAAAAAAAQEABwEBAQABAQEBAAABBQAAEgAAAAkABgAAAAEMAAAAEgMODgAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAADAQEBAQEBAQEBAQEBAQEBBgEDAAABAQEBAAsAAgIAAQEBAAEBAAEBAAAAAQAAAQEAAAAAAAACAAUCAgULAAEAAQEBBAEPBgACAAAABgAACAQDCQsCAgsCAwAFCQMBBQYDBQkFBQYFAQEBAwMGAwMDAwMDBQUFCQwGBQMDAwYDAwMDBQYFBQUFBQUBBgMDEBMCAgIEAQMBAQIAAwkJAQIJBAMBAwMCBAcCAAICAB4fAwQDBgIFBQUBAQUFCwEDAgIBAAsFBQUBBQUBBQYDAwQEAwwTAgIFEAMDAwMGBgMDAwQEBgYGBgEDAAMDBAIAAwACBgAEBAMGBgUBAQICAgICAgICAgICAgIBAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgEBAQEBAgECBAQBDiACAgAABwkDBgECAAAHCQkBAwcBAgAAAgUABwkIAAQEBAAAAgcAFAMHBwECAQAVAwkHAAAEAAIHAAACBwQHBAQDAwQDBgMCCAYGBgQHBgcDAwIGCAAGAAAEIQEDEAMDAAkHAwYEAwQABAMDAwMEBAYGAAAABAQHBwcHBAcHBwgICAcEBAMPCAMABAEACQEDAwEDBQQMIgkJFAMDBAMDAwcHBQcECAAEBAcJCAAHCBYEBgYGBAAEGSMRBgQEBAYJBAQAABcKCgoWChEGCAckChcXChkWFRUKJSYnKAoDAwMEBgMDAwMDBBQEBBoNGCkNKgUOEisFEAQEAAgEDRgbGw0TLAICCAgYDQ0aDS0ACAgABAgHCAgILgwvBIeAgIAAAXABlQKVAgWGgICAAAEBgAKAAgaHgYCAABR/AUHQlwYLfwFBAAt/AUEAC38BQQALfwBB2O8BC38AQajwAQt/AEGX8QELfwBB4fIBC38AQd3zAQt/AEHZ9AELfwBBxfUBC38AQZX2AQt/AEG29gELfwBBu/gBC38AQbH5AQt/AEGB+gELfwBBzfoBC38AQfb6AQt/AEHY7wELfwBBpfsBCwfHh4CAACoGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFQZtYWxsb2MA5gYWX19lbV9qc19fZW1fZmxhc2hfc2l6ZQMEFl9fZW1fanNfX2VtX2ZsYXNoX3NhdmUDBRZfX2VtX2pzX19lbV9mbGFzaF9sb2FkAwYQX19lcnJub19sb2NhdGlvbgCcBhlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAEZnJlZQDnBhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgAqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACsKamRfZW1faW5pdAAsDWpkX2VtX3Byb2Nlc3MALRRqZF9lbV9mcmFtZV9yZWNlaXZlZAAuEWpkX2VtX2RldnNfZGVwbG95AC8RamRfZW1fZGV2c192ZXJpZnkAMBhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kAMRtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MAMhZfX2VtX2pzX19lbV9zZW5kX2ZyYW1lAwccX19lbV9qc19fX2RldnNfcGFuaWNfaGFuZGxlcgMIHF9fZW1fanNfX2VtX3NlbmRfbGFyZ2VfZnJhbWUDCRpfX2VtX2pzX19lbV9kZXBsb3lfaGFuZGxlcgMKFF9fZW1fanNfX2VtX3RpbWVfbm93AwsgX19lbV9qc19fZW1famRfY3J5cHRvX2dldF9yYW5kb20DDBdfX2VtX2pzX19lbV9wcmludF9kbWVzZwMNFmpkX2VtX3RjcHNvY2tfb25fZXZlbnQAQhhfX2VtX2pzX19famRfdGNwc29ja19uZXcDDhpfX2VtX2pzX19famRfdGNwc29ja193cml0ZQMPGl9fZW1fanNfX19qZF90Y3Bzb2NrX2Nsb3NlAxAhX19lbV9qc19fX2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlAxEGZmZsdXNoAKQGFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACBBxllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAIIHGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAgwcYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAIQHCXN0YWNrU2F2ZQD9BgxzdGFja1Jlc3RvcmUA/gYKc3RhY2tBbGxvYwD/BhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AIAHDV9fc3RhcnRfZW1fanMDEgxfX3N0b3BfZW1fanMDEwxkeW5DYWxsX2ppamkAhgcJo4SAgAABAEEBC5QCKTpTVGRZW25vc2VtsAK/As8C7gLyAvcCnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAckBygHLAcwBzQHOAc8B0AHRAdIB0wHUAdUB1gHXAdoB2wHcAd0B3gHfAeAB4QHiAeMB5gHnAekB6gHrAe0B7wHwAfEB9AH1AfYB+wH8Af0B/gH/AYACgQKCAoMChAKFAoYChwKIAokCigKLAo0CjgKPApECkgKTApUClgKXApgCmQKaApsCnAKdAp4CnwKgAqECogKjAqUCpwKoAqkCqgKrAqwCrQKvArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CwALBAsICwwLEAsUCxgLHAsgCyQLLAo0EjgSPBJAEkQSSBJMElASVBJYElwSYBJkEmgSbBJwEnQSeBJ8EoAShBKIEowSkBKUEpgSnBKgEqQSqBKsErAStBK4ErwSwBLEEsgSzBLQEtQS2BLcEuAS5BLoEuwS8BL0EvgS/BMAEwQTCBMMExATFBMYExwTIBMkEygTLBMwEzQTOBM8E0ATRBNIE0wTUBNUE1gTXBNgE2QTaBNsE3ATdBN4E3wTgBOEE4gTjBOQE5QTmBOcE6ATpBIQFhgWKBYsFjQWMBZAFkgWkBaUFqAWpBY8GqQaoBqcGCsXVjIAA8wYFABCBBwslAQF/AkBBACgCsPsBIgANAEHt1gBB68oAQRlBsCEQgQYACyAAC9wBAQJ/AkACQAJAAkBBACgCsPsBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgCtPsBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBy94AQevKAEEiQeEoEIEGAAsCQANAIAAgAyIDai0AAEH/AUcNASADQQFqIgQhAyAEIAJGDQUMAAsAC0HoL0HrygBBJEHhKBCBBgALQe3WAEHrygBBHkHhKBCBBgALQdveAEHrygBBIEHhKBCBBgALQYsxQevKAEEhQeEoEIEGAAsgACABIAIQnwYaC30BAX8CQAJAAkBBACgCsPsBIgFFDQAgACABayIBQQBIDQEgAUEAKAK0+wFBgGBqSw0BIAFB/x9xDQIgAEH/AUGAIBChBhoPC0Ht1gBB68oAQSlBzDQQgQYAC0HX2ABB68oAQStBzDQQgQYAC0Gj4QBB68oAQSxBzDQQgQYAC0cBA39B6cQAQQAQO0EAKAKw+wEhAEEAKAK0+wEhAQJAA0AgAUF/aiICQQBIDQEgAiEBIAAgAmotAABBN0YNAAsgACACEAALCyoBAn9BABABIgA2ArT7AUEAIAAQ5gYiATYCsPsBIAFBNyAAEKEGIAAQAgsFABADAAsCAAsCAAsCAAscAQF/AkAgABDmBiIBDQAQAwALIAFBACAAEKEGCwcAIAAQ5wYLBABBAAsKAEG4+wEQrgYaCwoAQbj7ARCvBhoLYQICfwF+IwBBEGsiASQAAkACQCAAEM4GQRBHDQAgAUEIaiAAEIAGQQhHDQAgASkDCCEDDAELIAAgABDOBiICEPMFrUIghiAAQQFqIAJBf2oQ8wWthCEDCyABQRBqJAAgAwsIACAAIAEQBAsIABA8IAAQBQsGACAAEAYLCAAgACABEAcLCAAgARAIQQALEwBBACAArUIghiABrIQ3A7DuAQsNAEEAIAAQJDcDsO4BCycAAkBBAC0A1PsBDQBBAEEBOgDU+wEQQEH07gBBABBDEJEGEOUFCwtwAQJ/IwBBMGsiACQAAkBBAC0A1PsBQQFHDQBBAEECOgDU+wEgAEErahD0BRCHBiAAQRBqQbDuAUEIEP8FIAAgAEErajYCBCAAIABBEGo2AgBBmBkgABA7CxDrBRBFQQAoAtCQAiEBIABBMGokACABCy0AAkAgAEECaiAALQACQQpqEPYFIAAvAQBGDQBBwNkAQQAQO0F+DwsgABCSBgsIACAAIAEQcQsJACAAIAEQ/QMLCAAgACABEDkLFQACQCAARQ0AQQEQ4QIPC0EBEOICCwkAQQApA7DuAQsOAEGME0EAEDtBABAJAAueAQIBfAF+AkBBACkD2PsBQgBSDQACQAJAEApEAAAAAABAj0CiIgBEAAAAAAAA8ENjIABEAAAAAAAAAABmcUUNACAAsSEBDAELQgAhAQtBACABQoV/fDcD2PsBCwJAAkAQCkQAAAAAAECPQKIiAEQAAAAAAADwQ2MgAEQAAAAAAAAAAGZxRQ0AIACxIQEMAQtCACEBCyABQQApA9j7AX0LBgAgABALCwIACwYAEBoQdAsdAEHg+wEgATYCBEEAIAA2AuD7AUECQQAQmgVBAAvNBAEBfyMAQRBrIgQkAAJAAkACQAJAAkAgAUF/ag4QAwIEBAQEBAQEBAQEBAQEAQALIAFBMEcNA0Hg+wEtAAxFDQMCQAJAQeD7ASgCBEHg+wEoAggiAmsiAUHgASABQeABSBsiAQ0AQeD7AUEUahDTBSECDAELQeD7AUEUakEAKALg+wEgAmogARDSBSECCyACDQNB4PsBQeD7ASgCCCABajYCCCABDQNByjVBABA7QeD7AUGAAjsBDEEAECcMAwsgAkUNAkEAKALg+wFFDQJB4PsBKAIQIAJHDQICQCADLQADQQFxDQAgAy8BDkGAAUcNAEGwNUEAEDtB4PsBQRRqIAMQzQUNAEHg+wFBAToADAtB4PsBLQAMRQ0CAkACQEHg+wEoAgRB4PsBKAIIIgJrIgFB4AEgAUHgAUgbIgENAEHg+wFBFGoQ0wUhAgwBC0Hg+wFBFGpBACgC4PsBIAJqIAEQ0gUhAgsgAg0CQeD7AUHg+wEoAgggAWo2AgggAQ0CQco1QQAQO0Hg+wFBgAI7AQxBABAnDAILQeD7ASgCECIBRQ0BIAFBACABLQAEa0EMbGpBXGogAkcNAUHq7ABBE0EBQQAoAtDtARCtBhpB4PsBQQA2AhAMAQtBACgC4PsBRQ0AQeD7ASgCEA0AIAIpAwgQ9AVRDQBB4PsBIAJBq9TTiQEQngUiATYCECABRQ0AIARBC2ogAikDCBCHBiAEIARBC2o2AgBB5RogBBA7QeD7ASgCEEGAAUHg+wFBBGpBBBCfBRoLIARBEGokAAtPAQF/IwBBEGsiAiQAIAIgATYCDCAAIAEQtQUCQEGA/gFBwAJB/P0BELgFRQ0AA0BBgP4BEDZBgP4BQcACQfz9ARC4BQ0ACwsgAkEQaiQACy8AAkBBgP4BQcACQfz9ARC4BUUNAANAQYD+ARA2QYD+AUHAAkH8/QEQuAUNAAsLCzMAEEUQNwJAQYD+AUHAAkH8/QEQuAVFDQADQEGA/gEQNkGA/gFBwAJB/P0BELgFDQALCwsIACAAIAEQDAsIACAAIAEQDQsFABAOGgsEABAPCwsAIAAgASACEPgECxcAQQAgADYCxIACQQAgATYCwIACEJcGCwsAQQBBAToAyIACCzYBAX8CQEEALQDIgAJFDQADQEEAQQA6AMiAAgJAEJkGIgBFDQAgABCaBgtBAC0AyIACDQALCwsmAQF/AkBBACgCxIACIgENAEF/DwtBACgCwIACIAAgASgCDBEDAAvSAgECfyMAQTBrIgYkAAJAAkACQAJAIAIQxwUNACAAIAFB0TxBABDZAwwBCyAGIAQpAwA3AxggASAGQRhqIAZBLGoQ8AMiB0UNAQJAQQEgAkEDcXQgA2ogBigCLE0NAAJAIAVFDQAgBkEgaiABQeo3QQAQ2QMLIABCADcDAAwBCyAHIANqIQMCQCAFRQ0AIAYgBCkDADcDECABIAZBEGoQ7gNFDQMgBiAFKQMANwMgAkACQCAGKAIkQX9HDQAgAyACIAYoAiAQyQUMAQsgBiAGKQMgNwMIIAMgAiABIAZBCGoQ6gMQyAULIABCADcDAAwBCwJAIAJBB0sNACADIAIQygUiAUGBgICAeGpBAkkNACAAIAEQ5wMMAQsgACADIAIQywUQ5gMLIAZBMGokAA8LQYzXAEH7yABBFUHiIhCBBgALQf7lAEH7yABBIUHiIhCBBgAL5AMBAn8gAygCACEFAkACQAJAAkACQAJAAkACQAJAAkAgAkEEdEEwcSACQQR2ckF/IAJBDHFBDEYbQQFqDggBAwQHAAIICAkLIARBAEchAgJAIAQNAEEAIQYgAiEEDAYLIAUtAAANBEEAIQYgAiEEDAULAkAgAhDHBQ0AIAAgAUHRPEEAENkDDwsCQEEBIAJBA3F0IgEgBE0NACAAQgA3AwAPCyADIAMoAgAgAWo2AgACQCACQQdLDQAgBSACEMoFIgRBgYCAgHhqQQJJDQAgACAEEOcDDwsgACAFIAIQywUQ5gMPCwJAIAQNACAAQgA3AwAPCyADIAVBAWo2AgAgAEGgiwFBqIsBIAUtAAAbKQMANwMADwsgAEIANwMADwsCQCABIAUgBBCTASICDQAgAEIANwMADwsgAyADKAIAIARqNgIAIAAgAUEIIAIQ6QMPC0EAIQYCQAJAA0AgBkEBaiICIARGDQEgAiEGIAUgAmotAAANAAsgAiEGDAELIAQhBgsgBiEGIAIgBEkhBAsgAyAFIAYiAmogBGo2AgAgACABQQggASAFIAIQmAEQ6QMPCyADIAUgBGo2AgAgACABQQggASAFIAQQmAEQ6QMPCyAAIAFBtRgQ2gMPCyAAIAFBlxIQ2gML7AMBA38jAEHAAGsiBSQAIAFBBHRBMHEgAUEEdnJBfyABQQxxQQxGGyIGIQcCQAJAAkACQAJAAkAgBkEBag4IAAUCAgIBAwMECwJAIAEQxwUNACAFQThqIABB0TxBABDZA0EAIQcMBQsCQEEBIAFBA3F0IgcgA00NACAHIQcMBQsCQCAEKAIEQX9HDQAgAiABIAQoAgAQyQUgByEHDAULIAUgBCkDADcDCCACIAEgACAFQQhqEOoDEMgFIAchBwwECwJAIAMNAEEBIQcMBAsgBSAEKQMANwMQIAJBACAAIAVBEGoQ7ANrOgAAQQEhBwwDCyAFIAQpAwA3AyggACAFQShqIAVBNGoQ8AMiByEBAkACQCAHDQAgBSAEKQMANwMgIAVBOGogACAFQSBqEMsDIAQgBSkDODcDACAFIAQpAwA3AxggACAFQRhqIAVBNGoQ8AMiByEBIAcNAEEAIQEMAQsgASEHAkAgBSgCNCADTQ0AIAUgAzYCNAsgAiAHIAUoAjQiARCfBiEHAkAgBkEDRw0AIAEgA08NACAHIAFqQQA6AAAgBSABQQFqNgI0CyAFKAI0IQELIAEhBwwCCyAFQThqIABBtRgQ2gNBACEHDAELIAVBOGogAEGXEhDaA0EAIQcLIAVBwABqJAAgBwuYAQEDfyMAQRBrIgMkAAJAAkAgAUHvAEsNAEG2KUEAEDtBACEEDAELIAAgARD9AyEFIAAQ/ANBACEEIAUNAEHYCBAfIgQgAi0AADoApAIgBCAELQAGQQhyOgAGELsDIAAgARC8AyAEQdYCaiIBEL0DIAMgATYCBCADQSA2AgBBtSMgAxA7IAQgABBLIAQhBAsgA0EQaiQAIAQLzAEAIAAgATYC5AFBAEEAKALMgAJBAWoiATYCzIACIAAgATYCnAIgABCaATYCoAIgACAAIAAoAuQBLwEMQQN0EIoBNgIAIAAoAqACIAAQmQEgACAAEJEBNgLYASAAIAAQkQE2AuABIAAgABCRATYC3AECQAJAIAAvAQgNACAAEIABIAAQ3QIgABDeAiAAENgBIAAvAQgNACAAEIcEDQEgAEEBOgBDIABCgICAgDA3A1ggAEEAQQEQfRoLDwtBgeMAQc3GAEEmQaUJEIEGAAsqAQF/AkAgAC0ABkEIcQ0AIAAoAogCIAAoAoACIgRGDQAgACAENgKIAgsLGQACQCABRQ0AIAEgAC8BCjYCAAsgAC8BCAvAAwEBfwJAAkACQCAARQ0AIAAtAAYiBEEBcQ0BIAAgBEEBcjoABgJAIAFBMEYNACAAEIABCwJAIAAtAAYiBEEQcUUNACAAIARBEHM6AAYgACgC7AFFDQAgAEEBOgBIAkAgAC0ARUUNACAAENUDCwJAIAAoAuwBIgRFDQAgBBB/CyAAQQA6AEggABCDAQsCQAJAAkACQAJAAkAgAUFwag4xAAIBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEBQUFBQUFBQUFBQUFBQUFAwULAkAgAC0ABkEIcQ0AIAAoAogCIAAoAoACIgRGDQAgACAENgKIAgsgACACIAMQ2AIMBAsgAC0ABkEIcQ0DIAAoAogCIAAoAoACIgNGDQMgACADNgKIAgwDCwJAIAAtAAZBCHENACAAKAKIAiAAKAKAAiIERg0AIAAgBDYCiAILIABBACADENgCDAILIAAgAxDcAgwBCyAAEIMBCyAAEIIBEMMFIAAtAAYiA0EBcUUNAiAAIANB/gFxOgAGIAFBMEcNACAAENsCCw8LQeLdAEHNxgBB0QBBrx8QgQYAC0H74QBBzcYAQdYAQaYyEIEGAAu3AQECfyAAEN8CIAAQgQQCQCAALQAGIgFBAXENACAAIAFBAXI6AAYgAEH0BGoQrQMgABB6IAAoAqACIAAoAgAQjAECQCAALwFMRQ0AQQAhAQNAIAAoAqACIAAoAvQBIAEiAUECdGooAgAQjAEgAUEBaiICIQEgAiAALwFMSQ0ACwsgACgCoAIgACgC9AEQjAEgACgCoAIQmwEgAEEAQdgIEKEGGg8LQeLdAEHNxgBB0QBBrx8QgQYACxIAAkAgAEUNACAAEE8gABAgCws/AQF/IwBBEGsiAiQAIABBAEEeEJ0BGiAAQX9BABCdARogAiABNgIAQZXlACACEDsgAEHk1AMQdiACQRBqJAALDQAgACgCoAIgARCMAQsCAAt1AQF/AkACQAJAIAEvAQ4iAkGAf2oOAgABAgsgAEECIAEQVQ8LIABBASABEFUPCwJAIAJBgCNGDQACQAJAIAAoAggoAgwiAEUNACABIAARBABBAEoNAQsgARDcBRoLDwsgASAAKAIIKAIEEQgAQf8BcRDYBRoL2gEBA38gAi0ADCIDQQBHIQQCQAJAIAMNAEEAIQUgBCEEDAELAkAgAi0AEA0AQQAhBSAEIQQMAQtBACEFAkACQANAIAVBAWoiBCADRg0BIAQhBSACIARqQRBqLQAADQALIAQhBQwBCyADIQULIAUhBSAEIANJIQQLIAUhBQJAIAQNAEGHFUEAEDsPCwJAIAAoAggoAgQRCABFDQACQCABIAJBEGoiBCAEIAVBAWoiBWogAi0ADCAFayAAKAIIKAIAEQkARQ0AQbrAAEEAEDtByQAQHA8LQYwBEBwLCzUBAn9BACgC0IACIQNBgAEhBAJAAkACQCAAQX9qDgIAAQILQYEBIQQLIAMgBCABIAIQkAYLCxsBAX9BiPEAEOQFIgEgADYCCEEAIAE2AtCAAgsuAQF/AkBBACgC0IACIgFFDQAgASgCCCIBRQ0AIAEoAhAiAUUNACAAIAERAAALC8IBAQV/AkAgAC0ACkUNACAAQRRqIgEhAgNAAkACQAJAIAAvAQwiAyAALwEOIgRLDQAgAhDTBRogAEEAOgAKIAAoAhAQIAwBCwJAAkAgASAAKAIQIAAtAAsiBSAEbGogAyAEayIEQcgBIARByAFJG0EBIAVBAUYbIgQgBWwQ0gUOAgAFAQsgACAALwEOIARqOwEODAILIAAtAApFDQEgARDTBRogAEEAOgAKIAAoAhAQIAsgAEEANgIQCyAALQAKDQALCwttAQN/AkBBACgC1IACIgFFDQACQBBwIgJFDQAgAiABLQAGQQBHEIAEIAJBADoASSACIAEtAAhBAEdBAXQiAzoASSABLQAHRQ0AIAIgA0EBcjoASQsCQCABLQAGDQAgAUEAOgAJCyAAQQYQhAQLC6QVAgd/AX4jAEGAAWsiAiQAIAIQcCIDNgJYIAIgATYCVCACIAA2AlACQAJAAkAgA0UNACAALQAJDQELAkACQAJAIAEvAQ4iBEH/fmoOEgAAAAEDAwMDAwMDAwMDAwICAgMLAkAgAC0ACkUNACAAQRRqENMFGiAAQQA6AAogACgCEBAgIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQzAUaIAAgAS0ADjoACgwDCyACQfgAakEAKALAcTYCACACQQApArhxNwNwIAEtAA0gBCACQfAAakEMEJgGGgwBCyADRQ0BCwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAEvAQ5BgH9qDhcCAwQGBwUNDQ0NDQ0NDQ0NAAEICgkLDA0LIAEtAAxFDQ8gAUEQaiEFQQAhAANAIAMgBSAAIgBqKAIAQQAQhQQaIABBBGoiBCEAIAQgAS0ADEkNAAwQCwALIAEtAAxFDQ4gAUEQaiEFQQAhAANAIAMgBSAAIgBqKAIAEIIEGiAAQQRqIgQhACAEIAEtAAxJDQAMDwsAC0EAIQECQCADRQ0AIAMoAvABIQELAkAgASIADQBBACEFDA0LQQAhASAAIQADQCABQQFqIgEhBSABIQEgACgCACIEIQAgBA0ADA0LAAtBACEAAkAgAyABQRxqKAIAEHwiBkUNACAGKAIoIQALAkAgACIBDQBBACEFDAsLIAEhAUEAIQADQCAAQQFqIgAhBSABKAIMIgQhASAAIQAgBA0ADAsLAAsCQCABLQAgQfABcUHQAEcNACABQdAAOgAgCwJAAkAgAS0AICIEQQJGDQAgBEHQAEcNAUEAIQQCQCABQRxqKAIAIgVFDQAgAyAFEJwBIAUhBAtBACEFAkAgBCIDRQ0AIAMtAANBD3EhBQtBACEEAkACQAJAAkAgBUF9ag4GAQMDAwMAAwsgAygCEEEIaiEEDAELIANBCGohBAsgBC8BACEECwJAIARB//8DcSIEDQACQCAALQAKRQ0AIABBFGoQ0wUaIABBADoACiAAKAIQECAgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARDMBRogACABLQAOOgAKDA4LAkACQCADDQBBACEBDAELIAMtAANBD3EhAQsCQAJAAkAgAUF9ag4GAAICAgIBAgsgAkHQAGogBCADKAIMEFwMDwsgAkHQAGogBCADQRhqEFwMDgtB38sAQY0DQYA9EPwFAAsgAUEcaigCAEHkAEcNACACQdAAaiADKALkAS8BDCADKAIAEFwMDAsCQCAALQAKRQ0AIABBFGoQ0wUaIABBADoACiAAKAIQECAgAEEANgIQCyAAQgA3AgwgAEEBOgALIABBFGogARDMBRogACABLQAOOgAKDAsLIAJB8ABqIAMgAS0AICABQRxqKAIAEF0gAkEANgJgIAIgAikDcDcDIAJAIAMgAkEgahDxAyIERQ0AIAQoAgBBgICA+ABxQYCAgNgARw0AIAJB6ABqIANBCCAEKAIcEOkDIAIgAikDaDcDcAsgAiACKQNwNwMYAkACQCADIAJBGGoQ7QMNACACIAIpA3A3AxBBACEEIAMgAkEQahDDA0UNAQsgAiACKQNwNwMIIAMgAkEIaiACQeAAahDwAyEECyAEIQUCQCACKAJgIgQgAUEiai8BACIDSw0AAkAgAC0ACkUNACAAQRRqENMFGiAAQQA6AAogACgCEBAgIABBADYCEAsgAEIANwIMIABBAToACyAAQRRqIAEQzAUaIAAgAS0ADjoACgwLCyACIAQgA2siADYCYCACIAAgAUEkai8BACIBIAAgAUkbIgE2AmAgAkHQAGpBASABEF4iAUUNCiABIAUgA2ogAigCYBCfBhoMCgsgAkHwAGogAyABLQAgIAFBHGooAgAQXSACIAIpA3A3AzAgAkHQAGpBECADIAJBMGpBABBfIgEQXiIARQ0JIAIgAikDcDcDKCABIAMgAkEoaiAAEF9GDQlBtdoAQd/LAEGUBEGJPxCBBgALIAJB4ABqIAMgAUEUai0AACABKAIQEF0gAiACKQNgIgk3A2ggAiAJNwM4IAMgAkHwAGogAkE4ahBgIAEtAA0gAS8BDiACQfAAakEMEJgGGgwICyADEIEEDAcLIABBAToABgJAEHAiAUUNACABIAAtAAZBAEcQgAQgAUEAOgBJIAEgAC0ACEEAR0EBdCIEOgBJIAAtAAdFDQAgASAEQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLIANFDQZBoxJBABA7IAMQgwQMBgsgAEEAOgAJIANFDQVBjjZBABA7IAMQ/wMaDAULIABBAToABgJAEHAiA0UNACADIAAtAAZBAEcQgAQgA0EAOgBJIAMgAC0ACEEAR0EBdCIBOgBJIAAtAAdFDQAgAyABQQFyOgBJCwJAIAAtAAYNACAAQQA6AAkLEGkMBAsCQCADRQ0AAkACQCABKAIQIgQNACACQgA3A3AMAQsgAiAENgJwIAJBCDYCdCADIAQQnAELIAIgAikDcDcDSAJAAkAgAyACQcgAahDxAyIEDQBBACEFDAELIAQoAgBBgICA+ABxQYCAgMAARiEFCwJAAkAgBSIHDQAgAiABKAIQNgJAQfcKIAJBwABqEDsMAQsgA0EBQQMgAS0ADEF4aiIFQQRJGyIIOgAHAkAgAUEUai8BACIGQQFxRQ0AIAMgCEEIcjoABwsCQCAGQQJxRQ0AIAMgAy0AB0EEcjoABwsgAyAENgKsAiAFQQRJDQAgBUECdiIEQQEgBEEBSxshBSABQRhqIQZBACEBA0AgAyAGIAEiAUECdGooAgBBARCFBBogAUEBaiIEIQEgBCAFRw0ACwsgB0UNBCAAQQA6AAkgA0UNBEGONkEAEDsgAxD/AxoMBAsgAEEAOgAJDAMLAkAgACABQZjxABDeBSIDQYB/akECSQ0AIANBAUcNAwsCQBBwIgNFDQAgAyAALQAGQQBHEIAEIANBADoASSADIAAtAAhBAEdBAXQiAToASSAALQAHRQ0AIAMgAUEBcjoASQsgAC0ABg0CIABBADoACQwCCyACQdAAakEQIAUQXiIHRQ0BAkACQCAGDQBBACEBDAELIAYoAighAQsgASIBRQ0BIAEhAUEAIQADQCACQfAAaiADQQggASIBEOkDIAcgACIFQQR0aiIAIAIoAnA2AgAgACABLwEENgIEQQAhBAJAIAEoAggiBkUNACACQfAAaiADQQggBhDpAyACKAJwIQQLIAAgBDYCCCAAQc+GfyABKAIQIgQgAygA5AEiBiAGKAIgaiIGa0EEdiAEIAZGGzsBDCABKAIMIgQhASAFQQFqIQAgBA0ADAILAAsgAkHQAGpBCCAFEF4iB0UNAAJAAkAgAw0AQQAhAQwBCyADKALwASEBCyABIgFFDQBBACEAIAEhAQNAIAcgACIFQQN0aiIAIAEiASgCHDYCACAAIAEvARYiBEHPhn8gBBs7AQRBACEEAkAgASgCKCIGRQ0AQc+GfyAGKAIQIgQgAygA5AEiBiAGKAIgaiIGa0EEdiAEIAZGGyEECyAAIAQ7AQYgBUEBaiEAIAEoAgAiBCEBIAQNAAsLIAJBgAFqJAALnAIBBX8jAEEQayIDJAACQCAAKAIEIgQvAQ5BggFHDQACQAJAIARBImovAQAiBSABSQ0AAkAgACgCACIBLQAKRQ0AIAFBFGoQ0wUaIAFBADoACiABKAIQECAgAUEANgIQCyABQgA3AgwgAUEBOgALIAFBFGogACgCBBDMBRogASAAKAIELQAOOgAKDAELIABBDCABIAVrIgEgBEEkai8BACIEIAEgBEkbIgYQXiIHRQ0AIAZFDQAgAiAFQQN0aiEFQQAhAQNAIAAoAgghBCADIAUgASIBQQN0aikDADcDCCAEIAcgAUEMbGogA0EIahBgIAFBAWoiBCEBIAQgBkcNAAsLIANBEGokAA8LQdnTAEHfywBB5gJB0BcQgQYAC+MEAgN/AX4jAEEQayIEJAAgAyEFAkACQAJAAkACQAJAAkACQAJAAkACQAJAQdAAIAIgAkHwAXFB0ABGGyICQX9qDlAAAQIJAwkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBAQEBAkJCQkJCQkJCQkJCQYFCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJBwkLIAAgAxDnAwwKCwJAAkACQAJAIAMOBAECAwAKCyAAQQApA8CLATcDAAwMCyAAQgA3AwAMCwsgAEEAKQOgiwE3AwAMCgsgAEEAKQOoiwE3AwAMCQsgACADNgIAIABBATYCBAwICyAAIAEgAxCqAwwHCyAAIAEgAkFgaiADEIwEDAYLAkBBACADIANBz4YDRhsiAyABKADkAUEkaigCAEEEdkkNAAJAIANB0IYDTw0AIAMhBQwFCyADQQAvAbjuAUHQhgNqSQ0AIAMhBQwECyAAIAM2AgAgAEEDNgIEDAULQQAhBQJAIAEvAUwgA00NACABKAL0ASADQQJ0aigCACEFCwJAIAUiBg0AIAMhBQwDCwJAAkAgBigCDCIFRQ0AIAAgAUEIIAUQ6QMMAQsgACADNgIAIABBAjYCBAsgAyEFIAZFDQIMBAsCQCADDQAgAEIANwMADAQLIAAgAzYCACAAQQg2AgQgASADEJwBDAMLIAMhBSADQeUARg0BCyAEIAU2AgQgBCACNgIAQcAKIAQQOyAAQgA3AwAMAQsCQCABKQA4IgdCAFINACABKALsASIDRQ0AIAAgAykDIDcDAAwBCyAAIAc3AwALIARBEGokAAvQAQECfwJAAkAgACgCACIDLQAGRQ0AIAIhAiADLQAJDQELQQAhAgsCQCACIgJB6AdPDQACQCADLQAKRQ0AIANBFGoQ0wUaIANBADoACiADKAIQECAgA0EANgIQCyADQQA7AQ4gAyACOwEMIAMgAToAC0EAIQQCQCACRQ0AIAIgAWwQHyEECyADIAQiAjYCEAJAIAINACADQQA7AQwLIANBFGogACgCBBDMBRogAyAAKAIELQAOOgAKIAMoAhAPC0Hw2wBB38sAQTFBtMQAEIEGAAvWAgECfyMAQcAAayIDJAAgAyACNgI8IAMgASkDADcDIEEAIQICQCADQSBqEPQDDQAgAyABKQMANwMYAkACQCAAIANBGGoQkwMiAg0AIAMgASkDADcDECAAIANBEGoQkgMhAQwBCwJAIAAgAhCUAyIBDQBBACEBDAELAkAgACACEPQCDQAgASEBDAELQQAgASACKAIAQYCAgPgAcUGAgIDIAEYbIQELAkACQCABIgQNAEEAIQEMAQsCQCADKAI8IgFFDQAgAyABQRBqNgI8IANBMGpB/AAQxwMgA0EoaiAAIAQQqwMgAyADKQMwNwMIIAMgAykDKDcDACAAIAEgA0EIaiADEGMLQQEhAQsgASEBAkAgAg0AIAEhAgwBCwJAIAMoAjxFDQAgACACIANBPGpBBRDvAiABaiECDAELIAAgAkEAQQAQ7wIgAWohAgsgA0HAAGokACACC/gHAQN/IwBB0ABrIgMkACABQQhqQQA2AgAgAUIANwIAIAMgAikDADcDMAJAAkACQAJAAkACQCAAIANBMGogA0HIAGogA0HEAGoQigMiBEEASA0AAkAgAygCRCIFRQ0AIAMpA0hQDQAgAigCBCIAQYCAwP8HcQ0DIABBCHFFDQMgAUHXADoACiABIAIoAgA2AgAMAgsCQAJAIAVFDQAgA0E4aiAAQQggBRDpAyACIAMpAzg3AwAMAQsgAiADKQNINwMACyABIARBz4Z/IAQbOwEICyACKAIAIQQCQAJAAkACQAJAQRAgAigCBCIFQQ9xIAVBgIDA/wdxGw4JAQQEBAAEAwQCBAsgASAEQf//AHE2AgAgASAEQQ52QSBqOgAKDAQLIARBoH9qIgVBK0sNAiABIAU2AgAgAUEFOgAKDAMLAkACQCAEDQBBACEFDAELIAQtAANBD3EhBQsCQCAFQXxqDgYAAgICAgACCyABIAQ2AgAgAUHSADoACiADIAIpAwA3AyggASAAIANBKGpBABBfNgIEDAILIAEgBDYCACABQTI6AAoMAQsgAyACKQMANwMgAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAgA0EgahDzAw4NAQQLBQkGAwcLCAoCAAsLIAFBAzYCACABQQI6AAoMCwsgAUEANgIAIAFBAjoACgwKCyABQQY6AAogASACKQMANwIADAkLIAFBAjoACiADIAIpAwA3AwAgAUEBQQIgACADEOwDGzYCAAwICyABQQE6AAogAyACKQMANwMIIAEgACADQQhqEOoDOQIADAcLIAFB0QA6AAogAigCACECIAEgBDYCACABIAIvAQhBgICAgHhyNgIEDAYLIAEgBDYCACABQTA6AAogAyACKQMANwMQIAEgACADQRBqQQAQXzYCBAwFCyABIAQ2AgAgAUEDOgAKDAQLIAIoAgQiBUGAgMD/B3ENBSAFQQ9xQQhHDQUgAyACKQMANwMYIAAgA0EYahDDA0UNBSABIAQ2AgAgAUHUADoACgwDCyACKAIAIgJFDQUgAigCAEGAgID4AHFBgICAKEcNBSABIAQ2AgAgAUHTADoACiABIAIvAQRBgICAgHhyNgIEDAILIAIoAgAiAkUNBSACKAIAQYCAgPgAcUGAgIDYAEcNBSABIAQ2AgAgAUHWADoACiABIAIoAhwvAQRBgICAgHhyNgIEDAELIAFBBzoACiABIAIpAwA3AgALIANB0ABqJAAPC0GX4wBB38sAQZMBQfQyEIEGAAtB4OMAQd/LAEH0AUH0MhCBBgALQZ7VAEHfywBB+wFB9DIQgQYAC0G00wBB38sAQYQCQfQyEIEGAAuEAQEEfyMAQRBrIgEkACABIAAtAEY2AgBBACgC1IACIQJB8sIAIAEQOyAAKALsASIDIQQCQCADDQAgACgC8AEhBAtBACEDAkAgBCIERQ0AIAQoAhwhAwsgASADNgIIIAEgAC0ARjoADCACQQE6AAkgAkGAASABQQhqQQgQkAYgAUEQaiQACxAAQQBBqPEAEOQFNgLUgAILhwIBAn8jAEEgayIEJAAgBCACKQMANwMIIAAgBEEQaiAEQQhqEGACQAJAAkACQCAELQAaIgVBX2pBA0kNAEEAIQIgBUHUAEcNASAEKAIQIgUhAiAFQYGAgIB4cUGBgICAeEcNAUGe1wBB38sAQaICQbYyEIEGAAsgBUEYdCICQX9MDQEgBCgCEEEBdCIFQYCAgAhPDQIgAiAFckGBgICAeHIhAgsgASACNgIAIAQgAykDADcDACAAIARBEGogBBBgIAFBDGogBEEYaigCADYAACABIAQpAxA3AAQgBEEgaiQADwtBk+AAQd/LAEGcAkG2MhCBBgALQdTfAEHfywBBnQJBtjIQgQYAC0kBAn8jAEEQayIEJAAgASgCACEFIAQgAikDADcDCCAEIAMpAwA3AwAgACAFIARBCGogBBBjIAEgASgCAEEQajYCACAEQRBqJAALkgQBBX8jAEEQayIBJAACQCAAKAI0IgJBAEgNAAJAAkAgACgCGCIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEEIAMoAghBq5bxk3tGDQELQQAhBAsCQAJAIAQiAw0AQQAhBAwBCyADKAIEIQQLAkAgAiAEIgRIDQAgAEE4ahDTBRogAEF/NgI0DAELAkACQCAAQThqIgUgAyACakGAAWogBEHsASAEQewBSBsiAhDSBQ4CAAIBCyAAIAAoAjQgAmo2AjQMAQsgAEF/NgI0IAUQ0wUaCwJAIABBDGpBgICABBD+BUUNAAJAIAAtAAgiAkEBcQ0AIAAtAAdFDQELIAAoAhwNACAAIAJB/gFxOgAIIAAQZgsCQCAAKAIcIgJFDQAgAiABQQhqEE0iAkUNACABIAEoAgg2AgQgAUEAIAIgAkHg1ANGGzYCACAAQYABIAFBCBCQBgJAIAAoAhwiA0UNACADEFAgAEEANgIcQe8oQQAQOwtBACEDAkAgACgCHCIEDQACQAJAIAAoAhgiA0UNACADKAIAQdP6qux4Rw0AIAMhBSADKAIIQauW8ZN7Rg0BC0EAIQULAkAgBSIFRQ0AQQMhAyAFKAIEDQELQQQhAwsgASADNgIMIAAgBEEARzoABiAAQQQgAUEMakEEEJAGIABBACgC0PsBQYCAwABBgIDAAiACQeDUA0YbajYCDAsgAUEQaiQAC8wDAgV/An4jAEEQayIBJAACQAJAIAAoAhgiAkUNACACKAIAQdP6qux4Rw0AIAIhAyACKAIIQauW8ZN7Rg0BC0EAIQMLAkACQCADIgJFDQAgAigCBCIDRQ0AIAJBgAFqIgQgAxD9Aw0AAkACQCAAKAIYIgNFDQAgAygCAEHT+qrseEcNACADIQUgAygCCEGrlvGTe0YNAQtBACEFCwJAIAUiA0UNACADQewBaigCAEUNACADIANB6AFqKAIAakGAAWoiAxCrBQ0AAkAgAykDECIGUA0AIAApAxAiB1ANACAHIAZRDQBBuNgAQQAQOwsgACADKQMQNwMQCwJAIAApAxBCAFINACAAQgE3AxALIAAgBCACKAIEEGcMAQsCQCAAKAIcIgJFDQAgAhBQCyABIAAtAAQ6AAggAEHg8QBBoAEgAUEIahBKNgIcC0EAIQICQCAAKAIcIgMNAAJAAkAgACgCGCICRQ0AIAIoAgBB0/qq7HhHDQAgAiEEIAIoAghBq5bxk3tGDQELQQAhBAsCQCAEIgRFDQBBAyECIAQoAgQNAQtBBCECCyABIAI2AgwgACADQQBHOgAGIABBBCABQQxqQQQQkAYgAUEQaiQAC34BAn8jAEEQayIDJAACQCAAKAIcIgRFDQAgBBBQCyADIAAtAAQ6AAggACABIAIgA0EIahBKIgI2AhwCQCABQeDxAEYNACACRQ0AQd42QQAQsgUhASADQeMmQQAQsgU2AgQgAyABNgIAQcgZIAMQOyAAKAIcEFoLIANBEGokAAuvAQEEfyMAQRBrIgEkAAJAIAAoAhwiAkUNACACEFAgAEEANgIcQe8oQQAQOwtBACECAkAgACgCHCIDDQACQAJAIAAoAhgiAkUNACACKAIAQdP6qux4Rw0AIAIhBCACKAIIQauW8ZN7Rg0BC0EAIQQLAkAgBCIERQ0AQQMhAiAEKAIEDQELQQQhAgsgASACNgIMIAAgA0EARzoABiAAQQQgAUEMakEEEJAGIAFBEGokAAvUAQEFfyMAQRBrIgAkAAJAQQAoAtiAAiIBKAIcIgJFDQAgAhBQIAFBADYCHEHvKEEAEDsLQQAhAgJAIAEoAhwiAw0AAkACQCABKAIYIgJFDQAgAigCAEHT+qrseEcNACACIQQgAigCCEGrlvGTe0YNAQtBACEECwJAIAQiBEUNAEEDIQIgBCgCBA0BC0EEIQILIAAgAjYCDCABIANBAEc6AAYgAUEEIABBDGpBBBCQBiABQQAoAtD7AUGAkANqNgIMIAEgAS0ACEEBcjoACCAAQRBqJAALswMBBX8jAEGQAWsiASQAIAEgADYCAEEAKALYgAIhAkGDzwAgARA7QX8hAwJAIABBH3ENAAJAIAIoAhwiA0UNACADEFAgAkEANgIcQe8oQQAQOwtBACEDAkAgAigCHCIEDQACQAJAIAIoAhgiA0UNACADKAIAQdP6qux4Rw0AIAMhBSADKAIIQauW8ZN7Rg0BC0EAIQULAkAgBSIFRQ0AQQMhAyAFKAIEDQELQQQhAwsgASADNgIIIAIgBEEARzoABiACQQQgAUEIakEEEJAGIAJB0y0gAEGAAWoQvwUiAzYCGAJAIAMNAEF+IQMMAQsCQCAADQBBACEDDAELIAEgADYCDCABQdP6qux4NgIIIAMgAUEIakEIEMEFGhDCBRogAkGAATYCIEEAIQACQCACKAIcIgMNAAJAAkAgAigCGCIARQ0AIAAoAgBB0/qq7HhHDQAgACEEIAAoAghBq5bxk3tGDQELQQAhBAsCQCAEIgRFDQBBAyEAIAQoAgQNAQtBBCEACyABIAA2AowBIAIgA0EARzoABiACQQQgAUGMAWpBBBCQBkEAIQMLIAFBkAFqJAAgAwv9AwEFfyMAQbABayICJAACQAJAQQAoAtiAAiIDKAIgIgQNAEF/IQMMAQsgAygCGCEFAkAgAA0AIAJBKGpBAEGAARChBhogAkGrlvGTezYCMCACIAVBgAFqIAUoAgQQ8wU2AjQCQCAFKAIEIgFBgAFqIgAgAygCICIERg0AIAIgATYCBCACIAAgBGs2AgBB+OkAIAIQO0F/IQMMAgsgBUEIaiACQShqQQhqQfgAEMEFGhDCBRpB1SdBABA7AkAgAygCHCIBRQ0AIAEQUCADQQA2AhxB7yhBABA7C0EAIQECQCADKAIcIgUNAAJAAkAgAygCGCIBRQ0AIAEoAgBB0/qq7HhHDQAgASEAIAEoAghBq5bxk3tGDQELQQAhAAsCQCAAIgBFDQBBAyEBIAAoAgQNAQtBBCEBCyACIAE2AqwBIAMgBUEARzoABiADQQQgAkGsAWpBBBCQBiADQQNBAEEAEJAGIANBACgC0PsBNgIMQQAhAwwBCyAFKAIEQYABaiEGAkACQAJAIAFBH3ENACABQf8fSw0AIAQgAWogBk0NAQsgAiAGNgIYIAIgBDYCFCACIAE2AhBBu+gAIAJBEGoQO0EAIQFBfyEFDAELIAUgBGogACABEMEFGiADKAIgIAFqIQFBACEFCyADIAE2AiAgBSEDCyACQbABaiQAIAMLhwEBAn8CQAJAQQAoAtiAAigCGCIBRQ0AIAEoAgBB0/qq7HhHDQAgASECIAEoAghBq5bxk3tGDQELQQAhAgsCQCACIgFFDQAQuwMgAUGAAWogASgCBBC8AyAAEL0DQQAPCyAAQgA3AAAgAEEYakIANwAAIABBEGpCADcAACAAQQhqQgA3AABBfwvlBQECfyMAQSBrIgIkAAJAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBgECAwQHBQALAkACQCADQYB/ag4CAAEHCyABKAIQEGoNCSABIABBJGpBCEEJEMQFQf//A3EQ2QUaDAkLIABBOGogARDMBQ0IIABBADYCNAwICwJAAkAgACgCGCIDDQBBACEADAELAkAgAygCAEHT+qrseEYNAEEAIQAMAQtBACEAIAMoAghBq5bxk3tHDQAgAygCBCEACyABIAAQ2gUaDAcLAkACQCAAKAIYIgMNAEEAIQAMAQsCQCADKAIAQdP6qux4Rg0AQQAhAAwBC0EAIQAgAygCCEGrlvGTe0cNACADKAIMIQALIAEgABDaBRoMBgsCQAJAQQAoAtiAAigCGCIARQ0AIAAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQAJAIAMiAEUNABC7AyAAQYABaiAAKAIEELwDIAIQvQMMAQsgAkEYakIANwMAIAJBEGpCADcDACACQgA3AwggAkIANwMACyABLQANIAEvAQ4gAkEgEJgGGgwFCyABQZCAuBAQ2gUaDAQLIAFB4yZBABCyBSIAQe3uACAAGxDbBRoMAwsgA0GDIkYNAQsCQCABLwEOQYQjRw0AIAFB3jZBABCyBSIAQe3uACAAGxDbBRoMAgsCQAJAIAAgAUHE8QAQ3gVBgH9qDgIAAQMLAkAgAC0ABiIBRQ0AAkAgACgCHA0AIABBADoABiAAEGYMBAsgAQ0DCyAAKAIcRQ0CQbI0QQAQOyAAEGgMAgsgAC0AB0UNASAAQQAoAtD7ATYCDAwBC0EAIQMCQCAAKAIcDQACQAJAIAAoAhgiAEUNACAAKAIAQdP6qux4Rw0AIAAhAyAAKAIIQauW8ZN7Rg0BC0EAIQMLAkAgAyIARQ0AQQMhAyAAKAIEDQELQQQhAwsgASADENoFGgsgAkEgaiQAC9sBAQZ/IwBBEGsiAiQAAkAgAEFcakEAKALYgAIiA0cNAAJAAkAgAygCICIEDQBBfyEDDAELIAMoAhgiBSgCBEGAAWohBgJAAkACQCABLQAMIgdBH3ENACAEIAdqIAZNDQELIAIgBjYCCCACIAQ2AgQgAiAHNgIAQbvoACACEDtBACEEQX8hBwwBCyAFIARqIAFBEGogBxDBBRogAygCICAHaiEEQQAhBwsgAyAENgIgIAchAwsCQCADRQ0AIAAQxgULIAJBEGokAA8LQa8zQcrIAEGxAkHMHxCBBgALNAACQCAAQVxqQQAoAtiAAkcNAAJAIAENAEEAQQAQaxoLDwtBrzNBysgAQbkCQe0fEIEGAAsgAQJ/QQAhAAJAQQAoAtiAAiIBRQ0AIAEoAhwhAAsgAAvDAQEDf0EAKALYgAIhAkF/IQMCQCABEGoNAAJAIAENAEF+DwtBACEDAkACQANAIAAgAyIDaiABIANrIgRBgAEgBEGAAUkbIgQQaw0BIAQgA2oiBCEDIAQgAU8NAgwACwALQX0PC0F8IQNBAEEAEGsNAAJAAkAgAigCGCIDRQ0AIAMoAgBB0/qq7HhHDQAgAyEBIAMoAghBq5bxk3tGDQELQQAhAQsCQCABIgMNAEF7DwsgA0GAAWogAygCBBD9AyEDCyADC5cCAgN/An5B0PEAEOQFIQBB0y1BABC+BSEBIABBfzYCNCAAIAE2AhggAEEBOgAHIABBACgC0PsBQZmzxgBqNgIMAkBB4PEAQaABEP0DDQBBCiAAEJoFQQAgADYC2IACAkACQCAAKAIYIgFFDQAgASgCAEHT+qrseEcNACABIQIgASgCCEGrlvGTe0YNAQtBACECCwJAIAIiAUUNACABQewBaigCAEUNACABIAFB6AFqKAIAakGAAWoiARCrBQ0AAkAgASkDECIDUA0AIAApAxAiBFANACAEIANRDQBBuNgAQQAQOwsgACABKQMQNwMQCwJAIAApAxBCAFINACAAQgE3AxALDwtBk98AQcrIAEHUA0HNEhCBBgALGQACQCAAKAIcIgBFDQAgACABIAIgAxBOCws3AEEAENgBEJMFEHIQYhCmBQJAQZgqQQAQsAVFDQBB6h5BABA7DwtBzh5BABA7EIkFQaCZARBXC4MJAgh/AX4jAEHAAGsiAyQAAkACQAJAIAFBAWogACgCLCIELQBDRw0AIAMgBCkDWCILNwM4IAMgCzcDIAJAAkAgBCADQSBqIARB2ABqIgUgA0E0ahCKAyIGQX9KDQAgAyADKQM4NwMIIAMgBCADQQhqELcDNgIAIANBKGogBEGpPyADENcDQX8hBAwBCwJAIAZB0IYDSA0AIAZBsPl8aiIGQQAvAbjuAU4NAyABIQECQCACRQ0AAkAgAi8BCCIBQRBJDQAgA0EoaiAEQd4IENoDQX0hBAwDCyAEIAFBAWo6AEMgBEHgAGogAigCDCABQQN0EJ8GGiABIQELAkAgASIBQbD/ACAGQQN0aiICLQACIgdPDQAgBCABQQN0akHgAGpBACAHIAFrQQN0EKEGGgsgAi0AAyIBQQFxDQQgAEIANwMgAkAgAUEIcUUNACADIAUpAwA3AxACQAJAIAQgA0EQahDxAyIADQBBACEADAELIAAtAANBD3EhAAsCQCAAQXxqDgYBAAAAAAEACyADQShqIARBCCAEQQAQkAEQ6QMgBCADKQMoNwNYCyAEQbD/ACAGQQN0aigCBBEAAEEAIQQMAQsCQCAALQARIgdB5QBJDQAgBEHm1AMQdkF9IQQMAQsgACAHQQFqOgARAkAgBEEIIAQoAOQBIgcgBygCIGogBkEEdGoiBi8BCEEDdCAGLQAOQQF0akEYahCJASIHDQBBfiEEDAELIAcgBigCACIIOwEEIAcgAygCNDYCCCAHIAggBigCBGoiCTsBBiAAKAIoIQggByAGNgIQIAcgCDYCDAJAAkAgCEUNACAAIAc2AiggACgCLCIALQBGDQEgACAHNgLoASAJQf//A3ENAUGm3ABBzscAQRVBmzMQgQYACyAAIAc2AigLIAdBGGohCSAGLQAKIQACQAJAIAYtAAtBAXENACAAIQAgCSEFDAELIAcgBSkDADcDGCAAQX9qIQAgB0EgaiEFCyAFIQogACEFAkACQCACRQ0AIAIoAgwhByACLwEIIQAMAQsgBEHgAGohByABIQALIAAhACAHIQECQAJAIAYtAAtBBHFFDQAgCiABIAVBf2oiBSAAIAUgAEkbIgdBA3QQnwYhCgJAAkAgAkUNACAEIAJBAEEAIAdrEPYCGiACIQAMAQsCQCAEIAAgB2siAhCSASIARQ0AIAAoAgwgASAHQQN0aiACQQN0EJ8GGgsgACEACyADQShqIARBCCAAEOkDIAogBUEDdGogAykDKDcDAAwBCyAKIAEgBSAAIAUgAEkbQQN0EJ8GGgsCQCAGLQALQQJxRQ0AIAkpAABCAFINACADIAMpAzg3AxggA0EoaiAEQQggBCAEIANBGGoQlQMQkAEQ6QMgCSADKQMoNwMACwJAIAQtAEdFDQAgBCgCrAIgCEcNACAELQAHQQRxRQ0AIARBCBCEBAtBACEECyADQcAAaiQAIAQPC0GjxQBBzscAQR9B2iUQgQYAC0HwFkHOxwBBLkHaJRCBBgALQcTqAEHOxwBBPkHaJRCBBgAL2AQBCH8jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgC6AEiBA0AQQAhBAwBCyAELwEEIQQLIAAgBCIEOwEKAkACQAJAAkACQAJAAkAgA0Ggq3xqDgcAAQUFAgQDBQtBjT1BABA7DAULQcgiQQAQOwwEC0GTCEEAEDsMAwtBmQxBABA7DAILQbglQQAQOwwBCyACIAM2AhAgAiAEQf//A3E2AhRBgekAIAJBEGoQOwsgACADOwEIAkACQCADQaCrfGoOBgEAAAAAAQALIAAoAugBIgRFDQAgBCEEQR4hBQNAIAUhBiAEIgQoAhAhBSAAKADkASIHKAIgIQggAiAAKADkATYCGCAFIAcgCGprIghBBHUhBQJAAkAgCEHx6TBJDQBB/s4AIQcgBUGw+XxqIghBAC8BuO4BTw0BQbD/ACAIQQN0ai8BABCIBCEHDAELQdLZACEHIAIoAhgiCUEkaigCAEEEdiAFTQ0AIAkgCSgCIGogCGovAQwhByACIAIoAhg2AgwgAkEMaiAHQQAQigQiB0HS2QAgBxshBwsgBC8BBCEIIAQoAhAoAgAhCSACIAU2AgQgAiAHNgIAIAIgCCAJazYCCEHP6QAgAhA7AkAgBkF/Sg0AQeziAEEAEDsMAgsgBCgCDCIHIQQgBkF/aiEFIAcNAAsLIABBBToARiABECYgA0Hg1ANGDQAgABBYCwJAIAAoAugBIgRFDQAgAC0ABkEIcQ0AIAIgBC8BBDsBGCAAQccAIAJBGGpBAhBMCyAAQgA3A+gBIAJBIGokAAsJACAAIAE2AhgLhQEBAn8jAEEQayICJAACQAJAIAFBf0cNAEEAIQEMAQtBfyAAKAIsKAKAAiIDIAFqIgEgASADSRshAQsgACABNgIYAkAgACgCLCIAKALoASIBRQ0AIAAtAAZBCHENACACIAEvAQQ7AQggAEHHACACQQhqQQIQTAsgAEIANwPoASACQRBqJAAL9gIBBH8jAEEQayICJAAgACgCLCEDAkACQAJAAkAgASgCDEUNAAJAIAApACBCAFINACABKAIQLQALQQJxRQ0AIAAgASkDGDcDIAsgACABKAIMIgQ2AigCQCADLQBGDQAgAyAENgLoASAELwEGRQ0DCyAAIAAtABFBf2o6ABEgAUEANgIMIAFBADsBBgwBCwJAIAAtABAiBEEQcUUNACAAIARB7wFxOgAQIAEgASgCECgCADsBBAwBCwJAIAMoAugBIgFFDQAgAy0ABkEIcQ0AIAIgAS8BBDsBCCADQccAIAJBCGpBAhBMCyADQgA3A+gBIAAQ0QICQAJAIAAoAiwiBSgC8AEiASAARw0AIAVB8AFqIQEMAQsgASEDA0AgAyIBRQ0EIAEoAgAiBCEDIAEhASAEIABHDQALCyABIAAoAgA2AgAgBSAAEFILIAJBEGokAA8LQabcAEHOxwBBFUGbMxCBBgALQePWAEHOxwBBxwFBnyEQgQYACz8BAn8CQCAAKALwASIBRQ0AIAEhAQNAIAAgASIBKAIANgLwASABENECIAAgARBSIAAoAvABIgIhASACDQALCwuhAQEDfyMAQRBrIgIkAAJAAkAgAUHQhgNJDQBB/s4AIQMgAUGw+XxqIgFBAC8BuO4BTw0BQbD/ACABQQN0ai8BABCIBCEDDAELQdLZACEDIAAoAgAiBEEkaigCAEEEdiABTQ0AIAQgBCgCIGogAUEEdGovAQwhASACIAAoAgA2AgwgAkEMaiABQQAQigQiAUHS2QAgARshAwsgAkEQaiQAIAMLLAEBfyAAQfABaiECAkADQCACKAIAIgBFDQEgACECIAAoAhwgAUcNAAsLIAAL/QICBH8BfiMAQTBrIgMkAEEAIQQCQCAALwEIDQAgAyAAKQNYIgc3AwggAyAHNwMYAkACQCAAIANBCGogA0EgaiADQSxqEIoDIgVBAE4NAEEAIQYMAQsCQCAFQdCGA0gNACADQRBqIABBgSZBABDXA0EAIQYMAQsCQCACQQFGDQAgAEHwAWohBgNAIAYoAgAiBEUNASAEIQYgBSAELwEWRw0ACyAERQ0AIAQhBgJAAkACQCACQX5qDgMEAAIBCyAEIAQtABBBEHI6ABAgBCEGDAMLQc7HAEGrAkGfDxD8BQALIAQQfgtBACEGIABBOBCKASICRQ0AIAIgBTsBFiACIAA2AiwgACAAKAKMAkEBaiIENgKMAiACIAQ2AhwCQAJAIAAoAvABIgQNACAAQfABaiEGDAELIAQhBANAIAQiBigCACIFIQQgBiEGIAUNAAsLIAYgAjYCACACIAFBABB1GiACIAApA4ACPgIYIAIhBgsgBiEECyADQTBqJAAgBAvOAQEFfyMAQRBrIgEkAAJAIAAoAiwiAigC7AEgAEcNAAJAIAIoAugBIgNFDQAgAi0ABkEIcQ0AIAEgAy8BBDsBCCACQccAIAFBCGpBAhBMCyACQgA3A+gBCyAAENECAkACQAJAIAAoAiwiBCgC8AEiAiAARw0AIARB8AFqIQIMAQsgAiEDA0AgAyICRQ0CIAIoAgAiBSEDIAIhAiAFIABHDQALCyACIAAoAgA2AgAgBCAAEFIgAUEQaiQADwtB49YAQc7HAEHHAUGfIRCBBgAL4QEBBH8jAEEQayIBJAACQAJAIAAoAiwiAi0ARg0AEOYFIAJBACkD+JACNwOAAiAAENcCRQ0AIAAQ0QIgAEEANgIYIABB//8DOwESIAIgADYC7AEgACgCKCEDAkAgACgCLCIELQBGDQAgBCADNgLoASADLwEGRQ0CCwJAIAItAAZBCHENACABIAMvAQQ7AQggAkHGACABQQhqQQIQTAsCQCAAKAIwIgNFDQAgACgCNCEEIABCADcDMCACIAQgAxECAAsgAhCGBAsgAUEQaiQADwtBptwAQc7HAEEVQZszEIEGAAsSABDmBSAAQQApA/iQAjcDgAILHgAgASACQeQAIAJB5ABLG0Hg1ANqEHYgAEIANwMAC5MBAgF+BH8Q5gUgAEEAKQP4kAIiATcDgAICQAJAIAAoAvABIgANAEHkACECDAELIAGnIQMgACEEQeQAIQADQCAAIQACQAJAIAQiBCgCGCIFDQAgACEADAELIAUgA2siBUEAIAVBAEobIgUgACAFIABIGyEACyAAIgAhAiAEKAIAIgUhBCAAIQAgBQ0ACwsgAkHoB2wLugIBBn8jAEEQayIBJAAQ5gUgAEEAKQP4kAI3A4ACAkAgAC0ARg0AA0ACQAJAIAAoAvABIgINAEEAIQMMAQsgACkDgAKnIQQgAiECQQAhBQNAIAUhBQJAIAIiAi0AECIDQSBxRQ0AIAIhAwwCCwJAIANBD3FBBUcNACACKAIILQAARQ0AIAIhAwwCCwJAAkAgAigCGCIGQX9qIARJDQAgBSEDDAELAkAgBUUNACAFIQMgBSgCGCAGTQ0BCyACIQMLIAIoAgAiBiECIAMiAyEFIAMhAyAGDQALCyADIgJFDQEgABDdAiACEH8gAC0ARkUNAAsLAkAgACgCmAJBgChqIAAoAoACIgJPDQAgACACNgKYAiAAKAKUAiICRQ0AIAEgAjYCAEGUPyABEDsgAEEANgKUAgsgAUEQaiQAC/kBAQN/AkACQAJAAkAgAkGIAU0NACABIAEgAmpBfHFBfGoiAzYCBCAAIAAoAgwgAkEEdmo2AgwgAUEANgIAIAAoAgQiAkUNASACIQIDQCACIgQgAU8NAyAEKAIAIgUhAiAFDQALIAQgATYCAAwDC0H12QBB9M0AQdwAQbYqEIEGAAsgACABNgIEDAELQaYtQfTNAEHoAEG2KhCBBgALIANBgYCA+AQ2AgAgASABKAIEIAFBCGoiBGsiAkECdUGAgIAIcjYCCAJAIAJBBE0NACABQRBqQTcgAkF4ahChBhogACAEEIUBDwtBi9sAQfTNAEHQAEHIKhCBBgAL6gIBBH8jAEHQAGsiAiQAAkACQAJAAkAgAUUNACABQQNxDQAgACgCBCIARQ0DIABFIQMgACEEAkADQCADIQMCQCAEIgBBCGogAUsNACAAKAIEIgQgAU0NACABKAIAIgVB////B3EiAEUNBCABIABBAnRqIARLDQUgBUGAgID4AHENAiACIAU2AjBBoiQgAkEwahA7IAIgATYCJCACQdQgNgIgQcYjIAJBIGoQO0H0zQBB+AVB6RwQ/AUACyAAKAIAIgBFIQMgACEEIAANAAwFCwALIANBAXENAyACQdAAaiQADwsgAiABNgJEIAJBgjM2AkBBxiMgAkHAAGoQO0H0zQBB+AVB6RwQ/AUAC0GL3ABB9M0AQYkCQYAxEIEGAAsgAiABNgIUIAJBlTI2AhBBxiMgAkEQahA7QfTNAEH4BUHpHBD8BQALIAIgATYCBCACQcIqNgIAQcYjIAIQO0H0zQBB+AVB6RwQ/AUAC+EEAQh/IwBBEGsiAyQAAkACQCACQYDAA00NAEEAIQQMAQsCQAJAAkACQBAhDQACQCABQYACTw0AIAAgACgCCEEBaiIENgIIAkACQCAEQSBJDQAgBEEfcQ0BCxAeCxDjAkEBcUUNAiAAKAIEIgRFDQMgBCEEA0ACQCAEIgUoAggiBkEYdiIEQc8ARg0AIAUoAgQhByAEIQQgBiEGIAVBCGohCAJAAkACQAJAA0AgBiEJIAQhBCAIIgggB08NAQJAIARBAUcNACAJQf///wdxIgZFDQNBACEEIAZBAnRBeGoiCkUNAANAIAggBCIEakEIai0AACIGQTdHDQUgBEEBaiIGIQQgBiAKRw0ACwsgCUH///8HcSIERQ0EIAggBEECdGoiCCgCACIGQRh2IgohBCAGIQYgCCEIIApBzwBGDQUMAAsAC0HkO0H0zQBB4gJBpyMQgQYAC0GL3ABB9M0AQYkCQYAxEIEGAAsgAyAGNgIIIAMgCDYCACADIARBBGo2AgRB5AkgAxA7QfTNAEHqAkGnIxD8BQALQYvcAEH0zQBBiQJBgDEQgQYACyAFKAIAIgYhBCAGRQ0EDAALAAtBhDBB9M0AQaEDQdMqEIEGAAtB++sAQfTNAEGaA0HTKhCBBgALIAAoAhAgACgCDE0NAQsgABCHAQsgACAAKAIQIAJBA2pBAnYiBEECIARBAksbIgRqNgIQIAAgASAEEIgBIgghBgJAIAgNACAAEIcBIAAgASAEEIgBIQYLQQAhBCAGIgZFDQAgBkEEakEAIAJBfGoQoQYaIAYhBAsgA0EQaiQAIAQL7woBC38CQCAAKAIUIgFFDQACQCABKALkAS8BDCICRQ0AIAEoAgAhA0EAIQQDQAJAIAMgBCIEQQN0aiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEJ4BCyAEQQFqIgUhBCAFIAJHDQALCwJAIAEtAEMiAkUNACABQdgAaiEDQQAhBANAAkAgAyAEIgRBA3RqIgUoAARBiIDA/wdxQQhHDQAgASAFKAAAQQoQngELIARBAWoiBSEEIAUgAkcNAAsLAkAgAS0AREUNAEEAIQQDQCABIAEoAvgBIAQiBEECdGooAgBBChCeASAEQQFqIgUhBCAFIAEtAERJDQALCwJAIAEvAUxFDQBBACEEA0ACQCABKAL0ASAEIgVBAnRqKAIAIgRFDQACQCAEKAAEQYiAwP8HcUEIRw0AIAEgBCgAAEEKEJ4BCyABIAQoAgxBChCeAQsgBUEBaiIFIQQgBSABLwFMSQ0ACwsCQCABLQBKRQ0AQQAhBANAAkAgASgCqAIgBCIEQRhsaiIFKAAEQYiAwP8HcUEIRw0AIAEgBSgAAEEKEJ4BCyAEQQFqIgUhBCAFIAEtAEpJDQALCyABIAEoAtgBQQoQngEgASABKALcAUEKEJ4BIAEgASgC4AFBChCeAQJAIAEoADxBiIDA/wdxQQhHDQAgASABKAA4QQoQngELAkAgASgANEGIgMD/B3FBCEcNACABIAEoADBBChCeAQsgASgC8AEiBEUNACAEIQQDQAJAIAQiAigAJEGIgMD/B3FBCEcNACABIAIoACBBChCeAQsgAigCKCIFIQQCQCAFRQ0AA0AgASAEIgRBChCeASAEKAIMIgUhBCAFDQALCyACKAIAIgUhBCAFDQALCyAAQQA2AhAgAEEANgIAQQAhBUEAIQQDQCAEIQYgBSEEAkACQCAAKAIEIgUNAEEAIQMgBCEHDAELIAUhASAEIQVBACEEA0AgASIIQQhqIQEgBCEEIAUhBQJAAkACQAJAAkACQANAIAUhCSAEIQoCQAJAAkAgASIDKAIAIgdBgICAeHEiBEGAgID4BEYiCw0AIAMgCCgCBE8NBAJAAkAgB0EASA0AIAdBgICAgAZxIgVBgICAgARHDQELIAYNBiAAKAIUIANBChCeAUEBIQQMAgsgBkUNACAHIQEgAyECAkACQCAEQYCAgAhGDQAgByEBIAMhAiADIQQgBQ0BCwNAIAIhBCABQf///wdxIgVFDQggBCAFQQJ0aiIEKAIAIgUhASAEIQIgBUGAgIB4cUGAgIAIRg0AIAUhASAEIQIgBCEEIAVBgICAgAZxRQ0ACwsCQCAEIgQgA0YNACADIAQgA2siBEECdUGAgIAIcjYCACAEQQRNDQggA0EIakE3IARBeGoQoQYaIAAgAxCFASAJQQRqIAAgCRsgAzYCACADQQA2AgQgCiEEIAMhBQwDCyADIAdB/////31xNgIACyAKIQQLIAkhBQsgBSEFIAQhBCALDQYgAygCAEH///8HcSIBRQ0FIAMgAUECdGohASAEIQQgBSEFDAALAAtB5DtB9M0AQa0CQfgiEIEGAAtB9yJB9M0AQbUCQfgiEIEGAAtBi9wAQfTNAEGJAkGAMRCBBgALQYvbAEH0zQBB0ABByCoQgQYAC0GL3ABB9M0AQYkCQYAxEIEGAAsgBCEDIAUhByAIKAIAIgIhASAFIQUgBCEEIAINAAsLIAchBSADIQECQAJAIAYNAEEAIQQgAQ0BIAAoAhQiBEUNACAEKAKsAiIBRQ0AAkAgASgCACIBQYCAgHhxQYCAgAhGDQAgAUGAgICABnENAQsgBEEANgKsAgtBASEECyAFIQUgBCEEIAZFDQALC9YDAQl/AkAgACgCACIDDQBBAA8LIAJBAnRBeGohBCABQRh0IgUgAnIhBiABQQFHIQcgAyEDQQAhAQJAAkACQAJAAkACQANAIAEhCCAJIQkgAyIBKAIAQf///wdxIgNFDQIgCSEJAkAgAyACayIKQQBIIgsNAAJAAkAgCkEDSA0AIAEgBjYCAAJAIAcNACACQQFNDQcgAUEIakE3IAQQoQYaCyAAIAEQhQEgASgCAEH///8HcSIDRQ0HIAEoAgQhCSABIANBAnRqIgMgCkGAgIAIcjYCACADIAk2AgQgCkEBTQ0IIANBCGpBNyAKQQJ0QXhqEKEGGiAAIAMQhQEgAyEDDAELIAEgAyAFcjYCAAJAIAcNACADQQFNDQkgAUEIakE3IANBAnRBeGoQoQYaCyAAIAEQhQEgASgCBCEDCyAIQQRqIAAgCBsgAzYCACABIQkLIAkhCSALRQ0BIAEoAgQiCiEDIAkhCSABIQEgCg0AC0EADwsgCQ8LQYvcAEH0zQBBiQJBgDEQgQYAC0GL2wBB9M0AQdAAQcgqEIEGAAtBi9wAQfTNAEGJAkGAMRCBBgALQYvbAEH0zQBB0ABByCoQgQYAC0GL2wBB9M0AQdAAQcgqEIEGAAseAAJAIAAoAqACIAEgAhCGASIBDQAgACACEFELIAELLgEBfwJAIAAoAqACQcIAIAFBBGoiAhCGASIBDQAgACACEFELIAFBBGpBACABGwuPAQEBfwJAAkACQAJAIAFFDQAgAUEDcQ0BIAFBfGoiASgCACICQYCAgHhxQYCAgJAERw0CIAJB////B3EiAkUNAyABIAJBgICAEHI2AgAgACABEIUBCw8LQcrhAEH0zQBB1gNBgycQgQYAC0GK6wBB9M0AQdgDQYMnEIEGAAtBi9wAQfTNAEGJAkGAMRCBBgALvgEBAn8CQAJAAkACQAJAIAFFDQAgAUEDcQ0BIAFBfGoiAigCACIDQYCAgHhxQYCAgJAERw0CIANB////B3EiA0UNAyACIANBgICACHI2AgAgA0EBRg0EIAFBBGpBNyADQQJ0QXhqEKEGGiAAIAIQhQELDwtByuEAQfTNAEHWA0GDJxCBBgALQYrrAEH0zQBB2ANBgycQgQYAC0GL3ABB9M0AQYkCQYAxEIEGAAtBi9sAQfTNAEHQAEHIKhCBBgALZAECfwJAIAEoAgQiAkGAgMD/B3FFDQBBAA8LQQAhAwJAAkAgAkEIcUUNACABKAIAKAIAIgFBgICA8ABxRQ0BIAFBgICAgARxQR52IQMLIAMPC0Ga1ABB9M0AQe4DQdw+EIEGAAt5AQF/AkACQAJAIAEoAgQiAkGAgMD/B3ENACACQQhxRQ0AIAEoAgAiAigCACIBQYCAgIAEcQ0BIAFBgICA8ABxRQ0CIAIgAUGAgICABHI2AgALDwtBpt4AQfTNAEH3A0GJJxCBBgALQZrUAEH0zQBB+ANBiScQgQYAC3oBAX8CQAJAAkAgASgCBCICQYCAwP8HcQ0AIAJBCHFFDQAgASgCACICKAIAIgFBgICAgARxRQ0BIAFBgICA8ABxRQ0CIAIgAUH/////e3E2AgALDwtBouIAQfTNAEGBBEH4JhCBBgALQZrUAEH0zQBBggRB+CYQgQYACyoBAX8CQCAAKAKgAkEEQRAQhgEiAg0AIABBEBBRIAIPCyACIAE2AgQgAgsgAQF/AkAgACgCoAJBCkEQEIYBIgENACAAQRAQUQsgAQvuAgEEfyMAQRBrIgIkAAJAAkACQAJAAkACQCABQYDAA0sNACABQQN0IgNBgcADSQ0BCyACQQhqIABBDxDdA0EAIQEMAQsCQCAAKAKgAkHDAEEQEIYBIgQNACAAQRAQUUEAIQEMAQsCQCABRQ0AAkAgACgCoAJBwgAgA0EEciIFEIYBIgMNACAAIAUQUQsgBCADQQRqQQAgAxsiBTYCDAJAIAMNACAEIAQoAgBBgICAgARzNgIAQQAhAQwCCyAFQQNxDQIgBUF8aiIDKAIAIgVBgICAeHFBgICAkARHDQMgBUH///8HcSIFRQ0EIAAoAqACIQAgAyAFQYCAgBByNgIAIAAgAxCFASAEIAE7AQggBCABOwEKCyAEIAQoAgBBgICAgARzNgIAIAQhAQsgAkEQaiQAIAEPC0HK4QBB9M0AQdYDQYMnEIEGAAtBiusAQfTNAEHYA0GDJxCBBgALQYvcAEH0zQBBiQJBgDEQgQYAC3gBA38jAEEQayIDJAACQAJAIAJBgcADSQ0AIANBCGogAEESEN0DQQAhAgwBCwJAAkAgACgCoAJBBSACQQxqIgQQhgEiBQ0AIAAgBBBRDAELIAUgAjsBBCABRQ0AIAVBDGogASACEJ8GGgsgBSECCyADQRBqJAAgAgtmAQN/IwBBEGsiAiQAAkACQCABQYHAA0kNACACQQhqIABBEhDdA0EAIQEMAQsCQAJAIAAoAqACQQUgAUEMaiIDEIYBIgQNACAAIAMQUQwBCyAEIAE7AQQLIAQhAQsgAkEQaiQAIAELZwEDfyMAQRBrIgIkAAJAAkAgAUGBwANJDQAgAkEIaiAAQcIAEN0DQQAhAQwBCwJAAkAgACgCoAJBBiABQQlqIgMQhgEiBA0AIAAgAxBRDAELIAQgATsBBAsgBCEBCyACQRBqJAAgAQuvAwEDfyMAQRBrIgQkAAJAAkACQAJAAkAgAkExSw0AIAMgAkcNAAJAAkAgACgCoAJBBiACQQlqIgUQhgEiAw0AIAAgBRBRDAELIAMgAjsBBAsgBEEIaiAAQQggAxDpAyABIAQpAwg3AwAgA0EGakEAIAMbIQIMAQsCQAJAIAJBgcADSQ0AIARBCGogAEHCABDdA0EAIQIMAQsgAiADSQ0CAkACQCAAKAKgAkEMIAIgA0EDdkH+////AXFqQQlqIgYQhgEiBQ0AIAAgBhBRDAELIAUgAjsBBCAFQQZqIAM7AQALIAUhAgsgBEEIaiAAQQggAiICEOkDIAEgBCkDCDcDAAJAIAINAEEAIQIMAQsgAiACQQZqLwEAQQN2Qf4/cWpBCGohAgsgAiECAkAgASgABEGIgMD/B3FBCEcNACABKAAAIgAoAgAiAUGAgICABHENAiABQYCAgPAAcUUNAyAAIAFBgICAgARyNgIACyAEQRBqJAAgAg8LQZMsQfTNAEHNBEGaxAAQgQYAC0Gm3gBB9M0AQfcDQYknEIEGAAtBmtQAQfTNAEH4A0GJJxCBBgAL+AIBA38jAEEQayIEJAAgBCABKQMANwMIAkACQCAAIARBCGoQ8QMiBQ0AQQAhBgwBCyAFLQADQQ9xIQYLAkACQAJAAkACQAJAAkACQAJAIAZBemoOBwACAgICAgECCyAFLwEEIAJHDQMCQCACQTFLDQAgAiADRg0DC0GQ2ABB9M0AQe8EQeAsEIEGAAsgBS8BBCACRw0DIAVBBmovAQAgA0cNBCAAIAUQ5ANBf0oNAUHG3ABB9M0AQfUEQeAsEIEGAAtB9M0AQfcEQeAsEPwFAAsCQCABKAAEQYiAwP8HcUEIRw0AIAEoAAAiASgCACIFQYCAgIAEcUUNBCAFQYCAgPAAcUUNBSABIAVB/////3txNgIACyAEQRBqJAAPC0G6K0H0zQBB7gRB4CwQgQYAC0HwMUH0zQBB8gRB4CwQgQYAC0HnK0H0zQBB8wRB4CwQgQYAC0Gi4gBB9M0AQYEEQfgmEIEGAAtBmtQAQfTNAEGCBEH4JhCBBgALsAIBBX8jAEEQayIDJAACQAJAAkAgASACIANBBGpBAEEAEOUDIgQgAkcNACACQTFLDQAgAygCBCACRw0AAkACQCAAKAKgAkEGIAJBCWoiBRCGASIEDQAgACAFEFEMAQsgBCACOwEECwJAIAQNACAEIQIMAgsgBEEGaiABIAIQnwYaIAQhAgwBCwJAAkAgBEGBwANJDQAgA0EIaiAAQcIAEN0DQQAhBAwBCyAEIAMoAgQiBkkNAgJAAkAgACgCoAJBDCAEIAZBA3ZB/v///wFxakEJaiIHEIYBIgUNACAAIAcQUQwBCyAFIAQ7AQQgBUEGaiAGOwEACyAFIQQLIAEgAkEAIAQiBEEEakEDEOUDGiAEIQILIANBEGokACACDwtBkyxB9M0AQc0EQZrEABCBBgALCQAgACABNgIUCxoBAX9BmIAEEB8iACAAQRhqQYCABBCEASAACw0AIABBADYCBCAAECALDQAgACgCoAIgARCFAQv8BgERfyMAQSBrIgMkACAAQeQBaiEEIAIgAWohBSABQX9HIQZBACECIAAoAqACQQRqIQdBACEIQQAhCUEAIQpBACELAkACQANAIAwhACALIQ0gCiEOIAkhDyAIIRAgAiECAkAgBygCACIRDQAgAiESIBAhECAPIQ8gDiEOIA0hDSAAIQAMAgsgAiESIBFBCGohAiAQIRAgDyEPIA4hDiANIQ0gACEAA0AgACEIIA0hACAOIQ4gDyEPIBAhECASIQ0CQAJAAkACQCACIgIoAgAiB0EYdiISQc8ARiITRQ0AIA0hEkEFIQcMAQsCQAJAIAIgESgCBE8NAAJAIAYNACAHQf///wdxIgdFDQIgDkEBaiEJIAdBAnQhDgJAAkAgEkEBRw0AIA4gDSAOIA1KGyESQQchByAOIBBqIRAgDyEPDAELIA0hEkEHIQcgECEQIA4gD2ohDwsgCSEOIAAhDQwECwJAIBJBCEYNACANIRJBByEHDAMLIABBAWohCQJAAkAgACABTg0AIA0hEkEHIQcMAQsCQCAAIAVIDQAgDSESQQEhByAQIRAgDyEPIA4hDiAJIQ0gCSEADAYLIAIoAhAhEiAEKAIAIgAoAiAhByADIAA2AhwgA0EcaiASIAAgB2prQQR1IgAQeyESIAIvAQQhByACKAIQKAIAIQogAyAANgIUIAMgEjYCECADIAcgCms2AhhB5OkAIANBEGoQOyANIRJBACEHCyAQIRAgDyEPIA4hDiAJIQ0MAwtB5DtB9M0AQaIGQZgjEIEGAAtBi9wAQfTNAEGJAkGAMRCBBgALIBAhECAPIQ8gDiEOIAAhDQsgCCEACyAAIQAgDSENIA4hDiAPIQ8gECEQIBIhEgJAAkAgBw4IAAEBAQEBAQABCyACKAIAQf///wdxIgdFDQQgEiESIAIgB0ECdGohAiAQIRAgDyEPIA4hDiANIQ0gACEADAELCyASIQIgESEHIBAhCCAPIQkgDiEKIA0hCyAAIQwgEiESIBAhECAPIQ8gDiEOIA0hDSAAIQAgEw0ACwsgDSENIA4hDiAPIQ8gECEQIBIhEiAAIQICQCARDQACQCABQX9HDQAgAyASNgIMIAMgEDYCCCADIA82AgQgAyAONgIAQf/mACADEDsLIA0hAgsgA0EgaiQAIAIPC0GL3ABB9M0AQYkCQYAxEIEGAAvEBwEIfyMAQRBrIgMkACACQX9qIQQgASEBAkADQCABIgVFDQECQAJAIAUoAgAiAUEYdkEPcSIGQQFGDQAgAUGAgICAAnENAAJAIAJBAUoNACAFIAFBgICAgHhyNgIADAELIAUgAUH/////BXFBgICAgAJyNgIAQQAhBwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAZBfmoODgwCAQcMBAUBAQMMAAYMBgsgACAFKAIQIAQQngEgBSgCFCEHDAsLIAUhBwwKCwJAIAUoAgwiCEUNACAIQQNxDQYgCEF8aiIHKAIAIgFBgICAgAZxDQcgAUGAgID4AHFBgICAEEcNCCAFLwEIIQkgByABQYCAgIACcjYCAEEAIQEgCUUNAANAAkAgCCABIgFBA3RqIgcoAARBiIDA/wdxQQhHDQAgACAHKAAAIAQQngELIAFBAWoiByEBIAcgCUcNAAsLIAUoAgQhBwwJCyAAIAUoAhwgBBCeASAFKAIYIQcMCAsCQCAFKAAMQYiAwP8HcUEIRw0AIAAgBSgACCAEEJ4BC0EAIQcgBSgAFEGIgMD/B3FBCEcNByAAIAUoABAgBBCeAUEAIQcMBwsgACAFKAIIIAQQngEgBSgCEC8BCCIIRQ0FIAVBGGohCUEAIQEDQAJAIAkgASIBQQN0aiIHKAAEQYiAwP8HcUEIRw0AIAAgBygAACAEEJ4BCyABQQFqIgchASAHIAhHDQALQQAhBwwGCyADIAU2AgQgAyABNgIAQYwkIAMQO0H0zQBBygFB5SoQ/AUACyAFKAIIIQcMBAtByuEAQfTNAEGDAUHyHBCBBgALQdLgAEH0zQBBhQFB8hwQgQYAC0HI1ABB9M0AQYYBQfIcEIEGAAtBACEHCwJAIAciCQ0AIAUhAUEAIQYMAgsCQAJAAkACQCAJKAIMIgdFDQAgB0EDcQ0BIAdBfGoiCCgCACIBQYCAgIAGcQ0CIAFBgICA+ABxQYCAgBBHDQMgCS8BCCEKIAggAUGAgICAAnI2AgBBACEBIAogBkEKR3QiCEUNAANAAkAgByABIgFBA3RqIgYoAARBiIDA/wdxQQhHDQAgACAGKAAAIAQQngELIAFBAWoiBiEBIAYgCEcNAAsLIAUhAUEAIQYgACAJKAIEEPQCRQ0EIAkoAgQhAUEBIQYMBAtByuEAQfTNAEGDAUHyHBCBBgALQdLgAEH0zQBBhQFB8hwQgQYAC0HI1ABB9M0AQYYBQfIcEIEGAAsgBSEBQQAhBgsgASEBIAYNAAsLIANBEGokAAtUAQF/IwBBEGsiAyQAIAMgAikDADcDCAJAAkAgASADQQhqEPIDDQAgAyACKQMANwMAIAAgAUEPIAMQ2wMMAQsgACACKAIALwEIEOcDCyADQRBqJAALgQECAn8BfiMAQSBrIgEkACABIAApA1giAzcDCCABIAM3AxgCQAJAIAAgAUEIahDyA0UNACABKAIYIQIMAQsgASABKQMYNwMAIAFBEGogAEEPIAEQ2wNBACECCwJAIAIiAkUNACAAIAIgAEEAEKADIABBARCgAxD2AhoLIAFBIGokAAs5AgF/AX4jAEEQayIBJAAgASAAQeAAaikDACICNwMAIAEgAjcDCCAAIAAgARDyAxClAyABQRBqJAALsQICBn8BfiMAQTBrIgEkACAALQBDIgJBf2ohA0EAIQRBACEFAkACQCACQQJJDQAgASAAQeAAaikDADcDKAJAAkAgA0EBRw0AIAEgASkDKDcDECABQRBqEMQDRQ0AAkAgASgCLEF/Rg0AIAFBIGogAEH+K0EAENkDQQAiBSEEIAUhBkEAIQUMAgsgASABKQMoNwMIQQAhBEEBIQYgACABQQhqEOsDIQUMAQtBASEEQQEhBiADIQULIAQhBCAFIQUgBkUNAQsgBCEEIAAgBRCSASIFRQ0AIAAgBRCmAyAEIAJBAUtxQQFHDQBBACEEA0AgASAAIAQiBEEBaiICQQN0akHYAGopAwAiBzcDACABIAc3AxggACAFIAQgARCdAyACIQQgAiADRw0ACwsgAUEwaiQAC9EBAgV/AX4jAEEwayIBJAAgASAAKQNYIgY3AxAgASAGNwMoAkACQCAAIAFBEGoQ8gNFDQAgASgCKCECDAELIAEgASkDKDcDCCABQSBqIABBDyABQQhqENsDQQAhAgsCQCACIgNFDQACQCAALQBDQQJJDQBBACEEA0AgAy8BCCEFIAEgACAEQQFqIgJBA3RqQdgAaikDACIGNwMAIAEgBjcDGCAAIAMgBSABEJ0DIAIhBCACIAAtAENBf2pIDQALCyAAIAMvAQgQpAMLIAFBMGokAAuJAgIFfwF+IwBBwABrIgEkACABIAApA1giBjcDKCABIAY3AzgCQAJAIAAgAUEoahDyA0UNACABKAI4IQIMAQsgASABKQM4NwMgIAFBMGogAEEPIAFBIGoQ2wNBACECCwJAIAIiAkUNACABIABB4ABqKQMAIgY3AxggASAGNwM4AkAgACABQRhqEPIDDQAgASABKQM4NwMQIAFBMGogAEEPIAFBEGoQ2wMMAQsgASABKQM4NwMIAkAgACABQQhqEPEDIgMvAQgiBEUNACAAIAIgAi8BCCIFIAQQ9gINACACKAIMIAVBA3RqIAMoAgwgBEEDdBCfBhoLIAAgAi8BCBCkAwsgAUHAAGokAAuOAgIGfwF+IwBBIGsiASQAIAEgACkDWCIHNwMIIAEgBzcDGAJAAkAgACABQQhqEPIDRQ0AIAEoAhghAgwBCyABIAEpAxg3AwAgAUEQaiAAQQ8gARDbA0EAIQILIAIiAy8BCCECQQAhBAJAIAAtAENBf2oiBUUNACAAQQAQoAMhBAsgBCIEQR91IAJxIARqIgRBACAEQQBKGyEEIAIhBgJAIAVBAkkNACAAQQEgAhCfAyEGCwJAIAAgBiIGQR91IAJxIAZqIgYgAiAGIAJIGyICIAQgAiAEIAJIGyIEayIGEJIBIgJFDQAgAigCDCADKAIMIARBA3RqIAZBA3QQnwYaCyAAIAIQpgMgAUEgaiQAC7EHAg1/AX4jAEGAAWsiASQAIAEgACkDWCIONwNYIAEgDjcDeAJAAkAgACABQdgAahDyA0UNACABKAJ4IQIMAQsgASABKQN4NwNQIAFB8ABqIABBDyABQdAAahDbA0EAIQILAkAgAiIDRQ0AIAEgAEHgAGopAwAiDjcDeAJAAkAgDkIAUg0AIAFBATYCbEHz4gAhAkEBIQQMAQsgASABKQN4NwNIIAFB8ABqIAAgAUHIAGoQywMgASABKQNwIg43A3ggASAONwNAIAAgAUHAAGogAUHsAGoQxgMiAkUNASABIAEpA3g3AzggACABQThqEOADIQQgASABKQN4NwMwIAAgAUEwahCOASACIQIgBCEECyAEIQUgAiEGIAMvAQgiAkEARyEEAkACQCACDQAgBCEHQQAhBEEAIQgMAQsgBCEJQQAhCkEAIQtBACEMA0AgCSENIAEgAygCDCAKIgJBA3RqKQMANwMoIAFB8ABqIAAgAUEoahDLAyABIAEpA3A3AyAgBUEAIAIbIAtqIQQgASgCbEEAIAIbIAxqIQgCQAJAIAAgAUEgaiABQegAahDGAyIJDQAgCCEKIAQhBAwBCyABIAEpA3A3AxggASgCaCAIaiEKIAAgAUEYahDgAyAEaiEECyAEIQggCiEEAkAgCUUNACACQQFqIgIgAy8BCCINSSIHIQkgAiEKIAghCyAEIQwgByEHIAQhBCAIIQggAiANTw0CDAELCyANIQcgBCEEIAghCAsgCCEFIAQhAgJAIAdBAXENACAAIAFB4ABqIAIgBRCWASINRQ0AIAMvAQgiAkEARyEEAkACQCACDQAgBCEMQQAhBAwBCyAEIQhBACEJQQAhCgNAIAohBCAIIQogASADKAIMIAkiAkEDdGopAwA3AxAgAUHwAGogACABQRBqEMsDAkACQCACDQAgBCEEDAELIA0gBGogBiABKAJsEJ8GGiABKAJsIARqIQQLIAQhBCABIAEpA3A3AwgCQAJAIAAgAUEIaiABQegAahDGAyIIDQAgBCEEDAELIA0gBGogCCABKAJoEJ8GGiABKAJoIARqIQQLIAQhBAJAIAhFDQAgAkEBaiICIAMvAQgiC0kiDCEIIAIhCSAEIQogDCEMIAQhBCACIAtPDQIMAQsLIAohDCAEIQQLIAQhAiAMQQFxDQAgACABQeAAaiACIAUQlwEgACgC7AEiAkUNACACIAEpA2A3AyALIAEgASkDeDcDACAAIAEQjwELIAFBgAFqJAALEwAgACAAIABBABCgAxCUARCmAwvcBAIFfwF+IwBBgAFrIgEkACABIABB4ABqKQMANwNoIAEgAEHoAGopAwAiBjcDYCABIAY3A3BBACECQQAhAwJAIAFB4ABqEPUDDQAgASABKQNwNwNYQQEhAkEBIQMgACABQdgAakGWARD5Aw0AIAEgASkDcDcDUAJAIAAgAUHQAGpBlwEQ+QMNACABIAEpA3A3A0ggACABQcgAakGYARD5Aw0AIAEgASkDcDcDQCABIAAgAUHAAGoQtwM2AjAgAUH4AGogAEHtGyABQTBqENcDQQAhAkF/IQMMAQtBACECQQIhAwsgAiEEIAEgASkDaDcDKCAAIAFBKGogAUHwAGoQ8AMhAgJAAkACQCADQQFqDgICAQALIAEgASkDaDcDICAAIAFBIGoQwwMNACABIAEpA2g3AxggAUH4AGogAEHCACABQRhqENsDDAELAkACQCACRQ0AAkAgBEUNACABQQAgAhCABiIENgJwQQAhAyAAIAQQlAEiBEUNAiAEQQxqIAIQgAYaIAQhAwwCCyAAIAIgASgCcBCTASEDDAELIAEgASkDaDcDEAJAIAAgAUEQahDyA0UNACABIAEpA2g3AwgCQCAAIAAgAUEIahDxAyIDLwEIEJQBIgUNACAFIQMMAgsCQCADLwEIDQAgBSEDDAILQQAhAgNAIAEgAygCDCACIgJBA3RqKQMANwMAIAUgAmpBDGogACABEOsDOgAAIAJBAWoiBCECIAQgAy8BCEkNAAsgBSEDDAELIAFB+ABqIABB9QhBABDXA0EAIQMLIAAgAxCmAwsgAUGAAWokAAuKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQ7QMNACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahDbAwwBCyADIAMpAyA3AwggASADQQhqIANBKGoQ7wNFDQAgACADKAIoEOcDDAELIABCADcDAAsgA0EwaiQAC/0CAgN/AX4jAEHwAGsiASQAIAEgAEHgAGopAwA3A1AgASAAKQNYIgQ3A0AgASAENwNgAkACQCAAIAFBwABqEO0DDQAgASABKQNgNwM4IAFB6ABqIABBEiABQThqENsDQQAhAgwBCyABIAEpA2A3AzAgACABQTBqIAFB3ABqEO8DIQILAkAgAiICRQ0AIAEgASkDUDcDKAJAIAAgAUEoakGWARD5A0UNAAJAIAAgASgCXEEBdBCVASIDRQ0AIANBBmogAiABKAJcEP8FCyAAIAMQpgMMAQsgASABKQNQNwMgAkACQCABQSBqEPUDDQAgASABKQNQNwMYIAAgAUEYakGXARD5Aw0AIAEgASkDUDcDECAAIAFBEGpBmAEQ+QNFDQELIAFByABqIAAgAiABKAJcEMoDIAAoAuwBIgBFDQEgACABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahC3AzYCACABQegAaiAAQe0bIAEQ1wMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1giBjcDGCABIAY3AyACQAJAIAAgAUEYahDuAw0AIAEgASkDIDcDECABQShqIABBqSAgAUEQahDcA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEO8DIQILAkAgAiIDRQ0AIABBABCgAyECIABBARCgAyEEIABBAhCgAyEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQoQYaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNYIgg3AzggASAINwNQAkACQCAAIAFBOGoQ7gMNACABIAEpA1A3AzAgAUHYAGogAEGpICABQTBqENwDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEO8DIQILAkAgAiIDRQ0AIABBABCgAyEEIAEgAEHoAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDDA0UNACABIAEpA0A3AwAgACABIAFB2ABqEMYDIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQ7QMNACABIAEpA1A3AxAgAUHYAGog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EDsgASABKQNgNwMYIAAgAUEYahCPAQsgAUHwAGokAAufAQICfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiAzcDKCABIAM3AxAgAUEgaiAAIAFBEGoQywMgASABKQMgIgM3AyggASADNwMIAkAgACABQQhqQQAQxgMiAkUNACACIAFBIGoQsgUiAkUNACABQRhqIABBCCAAIAIgASgCIBCYARDpAyAAKALsASIARQ0AIAAgASkDGDcDIAsgAUEwaiQACzsBAX8jAEEQayIBJAAgAUEIaiAAKQOAAroQ5gMCQCAAKALsASIARQ0AIAAgASkDCDcDIAsgAUEQaiQAC6gBAgF/AX4jAEEwayIBJAAgASAAQeAAaikDACICNwMoIAEgAjcDEAJAAkACQCAAIAFBEGpBjwEQ+QNFDQAQ9AUhAgwBCyABIAEpAyg3AwggACABQQhqQZsBEPkDRQ0BENkCIQILIAFBCDYCACABIAI3AyAgASABQSBqNgIEIAFBGGogAEHCIyABEMkDIAAoAuwBIgBFDQAgACABKQMYNwMgCyABQTBqJAAL5gECBH8BfiMAQSBrIgEkACAAQQAQoAMhAiABIABB6ABqKQMAIgU3AwggASAFNwMYAkAgACABQQhqEJQCIgNFDQACQCACQTFJDQAgAUEQaiAAQdwAEN0DDAELIAMgAjoAFQJAIAMoAhwvAQQiBEHtAUkNACABQRBqIABBLxDdAwwBCyAAQYUDaiACOgAAIABBhgNqIAMvARA7AQAgAEH8AmogAykDCDcCACADLQAUIQIgAEGEA2ogBDoAACAAQfsCaiACOgAAIABBiANqIAMoAhxBDGogBBCfBhogABDTAgsgAUEgaiQAC7ACAgN/AX4jAEHQAGsiASQAIABBABCgAyECIAEgAEHoAGopAwAiBDcDSAJAAkAgBFANACABIAEpA0g3AzggACABQThqEMMDDQAgASABKQNINwMwIAFBwABqIABBwgAgAUEwahDbAwwBCwJAIAJFDQAgAkGAgICAf3FBgICAgAFGDQAgAUHAAGogAEHKFkEAENkDDAELIAEgASkDSDcDKAJAAkACQCAAIAFBKGogAhDgAiIDQQNqDgIBAAILIAEgAjYCACABQcAAaiAAQZ4LIAEQ1wMMAgsgASABKQNINwMgIAEgACABQSBqQQAQxgM2AhAgAUHA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Ag0AIAFBGGogAEGRPkEAENkDCyACIQALAkAgACIARQ0AIAAQfgsgAUEgaiQAC1kCA38BfiMAQRBrIgEkACAAKALsASECIAEgAEHgAGopAwAiBDcDACABIAQ3AwggACABELIBIQMgACgC7AEgAxB4IAIgAi0AEEHwAXFBBHI6ABAgAUEQaiQACyEAAkAgACgC7AEiAEUNACAAIAA1AhxCgICAgBCENwMgCwtgAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABBwS1BABDZAwwBCyAAIAJBf2pBARB9IgJFDQAgACgC7AEiAEUNACAAIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQigMiBEHPhgNLDQAgASgA5AEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQfMlIANBCGoQ3AMMAQsgACABIAEoAtgBIARB//8DcRD6AiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEPACEJABEOkDIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCOASADQdAAakH7ABDHAyADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQmwMgASgC2AEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEPgCIAMgACkDADcDECABIANBEGoQjwELIANB8ABqJAALwAEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQigMiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADENsDDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BuO4BTg0CIABBsP8AIAFBA3RqLwEAEMcDDAELIAAgASgA5AEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQfAWQb7JAEExQcs2EIEGAAvzCAEHfyMAQbABayIBJAACQAJAAkACQAJAIABFDQAgACgCqAINAhDZAQJAAkBB2+IAQQAQrwUiAg0AQQAhAwwBCyACIQJBACEEA0AgBCEDAkACQCACIgItAAVBwABHDQBBACEEDAELQQAhBCACELEFIgVB/wFGDQBBASEEIAVBPksNACAFQQN2QeCAAmotAAAgBUEHcXZBAXFFIQQLQdviACACEK8FIgUhAiADIARqIgMhBCADIQMgBQ0ACwsgASADIgI2AoABQagXIAFBgAFqEDsgACAAIAJBGGwQigEiBDYCqAIgBEUNAiAAIAI6AEoMAQsQ2QELAkBB2+IAQQAQrwUiAkUNACACIQJBACEEA0AgBCEDIAIiAhCxBSEEIAEgAikCADcDoAEgASACQQhqKQIANwOoASABQfOgpfMGNgKgAQJAAkAgAUGgAWpBfxCwBSIFQQFLDQAgASAFNgJoIAEgBDYCZCABIAFBoAFqNgJgQa7CACABQeAAahA7DAELIARBPksNACAEQQN2QeCAAmotAAAgBEEHcXZBAXFFDQAgASAENgJ0IAEgAkEFajYCcEGg6AAgAUHwAGoQOwsCQAJAIAItAAVBwABHDQAgAyEEDAELAkAgAhCxBSIGQf8BRw0AIAMhBAwBCwJAIAZBPksNACAGQQN2QeCAAmotAAAgBkEHcXZBAXFFDQAgAyEEDAELAkAgAEUNACAAKAKoAiIGRQ0AIAMgAC0ASksNBSAGIANBGGxqIgYgBDoADSAGIAM6AAwgBiACQQVqIgc2AgggASAENgJYIAEgBzYCVCABIANB/wFxNgJQIAEgBTYCXEHj6AAgAUHQAGoQOyAGQQ87ARAgBkEAQRJBIiAFGyAFQX9GGzoADgsgA0EBaiEEC0Hb4gAgAhCvBSIDIQIgBCEEIAMNAAsLIABFDQACQAJAIABBKhDwAiIFDQBBACECDAELIAUtAANBD3EhAgsCQCACQXxqDgYAAwMDAwADCyAALQBKRQ0AQQAhAgNAIAAoAqgCIQQgAUGgAWogAEEIIAAgAEErEPACEJABEOkDIAQgAiIDQRhsaiICIAEpA6ABNwMAIAFBmAFqQdABEMcDIAFBkAFqIAItAA0Q5wMgASACKQMANwNIIAEgASkDmAE3A0AgASABKQOQATcDOCAAIAFByABqIAFBwABqIAFBOGoQmwMgAigCCCEEIAFBoAFqIABBCCAAIAQgBBDOBhCYARDpAyABIAEpA6ABNwMwIAAgAUEwahCOASABQYgBakHRARDHAyABIAIpAwA3AyggASABKQOIATcDICABIAEpA6ABNwMYIAAgAUEoaiABQSBqIAFBGGoQmwMgASABKQOgATcDECABIAIpAwA3AwggACAFIAFBEGogAUEIahDyAiABIAEpA6ABNwMAIAAgARCPASADQQFqIgQhAiAEIAAtAEpJDQALCyABQbABaiQADwtBkxdBkckAQekAQYMvEIEGAAtBv+YAQZHJAEGKAUGDLxCBBgALkwEBA39BAEIANwPggAICQEHt7gBBABCvBSIARQ0AIAAhAANAAkAgACIAQZQnENAGIgEgAE0NAAJAIAFBf2osAAAiAUEuRg0AIAFBf0oNAQsgABCxBSIBQT9LDQAgAUEDdkHggAJqIgIgAi0AAEEBIAFBB3F0cjoAAAtB7e4AIAAQrwUiASEAIAENAAsLQek1QQAQOwv2AQIHfwF+IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAS0ASiIEDQAgBEEARyEFDAELAkAgASgCqAIiBikDACADKQMQIgpSDQBBASEFIAYhAgwBCyAEQRhsIAZqQWhqIQdBACEFAkADQAJAIAVBAWoiAiAERw0AIAchCAwCCyACIQUgBiACQRhsaiIJIQggCSkDACAKUg0ACwsgAiAESSEFIAghAgsgAiECAkAgBQ0AIAMgAykDEDcDCCADQRhqIAFB0AEgA0EIahDbA0EAIQILAkACQCACIgJFDQAgACACLQAOEOcDDAELIABCADcDAAsgA0EgaiQAC/YBAgd/AX4jAEEgayIDJAAgAyACKQMANwMQAkACQCABLQBKIgQNACAEQQBHIQUMAQsCQCABKAKoAiIGKQMAIAMpAxAiClINAEEBIQUgBiECDAELIARBGGwgBmpBaGohB0EAIQUCQANAAkAgBUEBaiICIARHDQAgByEIDAILIAIhBSAGIAJBGGxqIgkhCCAJKQMAIApSDQALCyACIARJIQUgCCECCyACIQICQCAFDQAgAyADKQMQNwMIIANBGGogAUHQASADQQhqENsDQQAhAgsCQAJAIAIiAkUNACAAIAIvARAQ5wMMAQsgAEIANwMACyADQSBqJAALqAECBH8BfiMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAS0ASiIEDQAgBEEARyECDAELIAEoAqgCIgUpAwAgAykDECIHUQ0BQQAhBgJAA0AgBkEBaiICIARGDQEgAiEG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IAItAABBD3EgCEEEdHI6AAAgAkEEaiEIDAELAkAgCg0AIAEgAE4NACACIAItAABBD3EgCEEEdHI6AAALAkAgAUF/SA0AIAFBAWogAE4NACACIAItAAFB8AFxIAhB8AFxQQR2cjoAAQsCQCABQX5IDQAgAUECaiAATg0AIAIgAi0AAUEPcToAAQsCQCABQX1IDQAgAUEDaiAATg0AIAIgAi0AAkHwAXE6AAILAkAgAUF8SA0AIAFBBGogAE4NACACIAItAAJBD3E6AAILAkAgAUF7SA0AIAFBBWogAE4NACACIAItAANB8AFxOgADCwJAIAFBekgNACABQQZqIABODQAgAiACLQADQQ9xOgADCyACQQRqIQICQCABQXlODQAgAiECDAILIAIhCCACIQIgAUEHaiAATg0BCyAIIgIgAi0AAEHwAXE6AAAgAiECCyAJIQggAUEIaiEBIAdBBGohByACIQIgCQ0ADAQLAAsgEiEIIAMhASAPIQcgDCECIBYNAgNAIAIhAiAIQX9qIQkgByIHKAIAIQgCQAJAIAEiAUEASCIKDQAgASATSg0AIAJBADoAAyACQQA7AAEgAiAIOgAADAELAkAgCg0AIAEgAE4NACACIAItAABB8AFxIAhBD3FyOgAACwJAIAFBf0gNACABQQFqIABODQAgAiACLQAAQQ9xIAhB8AFxcjoAAAsCQCABQX5IDQAgAUECaiAATg0AIAIgAi0AAUHwAXE6AAELAkAgAUF9SA0AIAFBA2ogAE4NACACIAItAAFBD3E6AAELAkAgAUF8SA0AIAFBBGogAE4NACACIAItAAJB8AFxOgACCwJAIAFBe0gNACABQQVqIABODQAgAiACLQACQQ9xOgACCwJAIAFBekgNACABQQZqIABODQAgAiACLQADQfABcToAAwsgAUF5SA0AIAFBB2ogAE4NACACIAItAANBD3E6AAMLIAkhCCABQQhqIQEgB0EEaiEHIAJBBGohAiAJDQAMAwsACyASIQggDCEJIA8hAiADIQcgEiEKIAwhDCAPIQ8gAyELAkAgFUUNAANAIAchASACIQIgCSEJIAgiCEUNAyACKAIAIgpBD3EhBwJAAkACQCABQQBIIgwNACABIBBKDQACQCAHRQ0AIAktAABBD00NACAJIQlBACEKIAEhAQwDCyAKQfABcUUNASAJLQAB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QQEQoAMiA0UNACABIANvIQILIAAgAhCkAwsWACAAIABBABCgAyAAQQEQoANsEKQDCwkAIABBARCMAguRAwIEfwJ8IwBBMGsiAiQAIAIgAEHgAGopAwA3AyggAiAAQegAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahDrAyEDIAIgAikDIDcDECAAIAJBEGoQ6wMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAFIQUgACgC7AEiA0UNACADIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ6gMhBiACIAIpAyA3AwAgACACEOoDIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgC7AEiBUUNACAFQQApA7CLATcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAEhAQJAIAAoAuwBIgBFDQAgACABKQMANwMgCyACQTBqJAALCQAgAEEAEIwCC50BAgN/AX4jAEEwayIBJAAgASAAQeAAaikDADcDKCABIABB6ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahD0Aw0AIAEgASkDKDcDECAAIAFBEGoQkAMhAiABIAEpAyA3AwggACABQQhqEJMDIgNFDQAgAkUNACAAIAIgAxDxAgsCQCAAKALsASIARQ0AIAAgASkDKDcDIAsgAUEwaiQACwkAIABBARCQAguhAQIDfwF+IwBBMGsiAiQAIAIgAEHgAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQkwMiA0UNACAAQQAQkgEiBEUNACACQSBqIABBCCAEEOkDIAIgAikDIDcDECAAIAJBEGoQjgEgACADIAQgARD1AiACIAIpAyA3AwggACACQQhqEI8BIAAoAuwBIgBFDQAgACACKQMgNwMgCyACQTBqJAALCQAgAEEAEJACC+oBAgN/AX4jAEHAAGsiASQAIAEgAEHgAGopAwAiBDcDOCABIABB6ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqEPEDIgINAEEAIQMMAQsgAi0AA0EP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IAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQgAMiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENsDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqEIADIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDbAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwECEOcDCyADQTBqJAAL+AECA38BfiMAQTBrIgMkACADIAIpAwAiBjcDGCADIAY3AxACQAJAIAEgA0EQaiADQSxqEIADIgRFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDbAwsCQAJAIAQNACAAQgA3AwAMAQsCQAJAIAQvAQJBgOADcSIFRQ0AIAVBgCBHDQEgACACKQMANwMADAILAkAgASAEEIIDIgJBf0oNACAAQgA3AwAMAgsgACABIAEgASgA5AEiBSAFKAJgaiACQQR0aiAELwECQf8fcUGAwAByEKQCEP0CDAELIABCADcDAAsgA0EwaiQAC5YCAgR/AX4jAEEwayIBJAAgASAAKQNYIgU3AxggASAFNwMIAkACQCAAIAFBCGogAUEsahCAAyICRQ0AIAEoAixB//8BRg0BCyABIAEpAxg3AwAgAUEgaiAAQZ0BIAEQ2wMLAkAgAkUNACAAIAIQggMiA0EASA0AIABB+AJqQQBB/AEQoQYaIABBhgNqIAIvAQIiBEH/H3E7AQAgAEH8AmoQ2QI3AgACQAJAIARBgOADcSIEQYAgRg0AIARBgIACRw0BQYzOAEHIAEGoORD8BQALIAAgAC8BhgNBgCByOwGGAwsgACACELECIAFBEGogACADQYCAAmoQ1QIgACgC7AEiAEUNACAAIAEpAxA3AyALIAFBMGokAAujAwEEfyMAQTBrIgUkACAFIAM2AiwCQAJAIAItAARBAXFFDQACQCABQQAQkgEiBg0AIABCADcDAAwCCyADIARqIQcgACABQQggBhDpAyAFIAApAwA3AxggASAFQRhqEI4BQQAhAyABKADkASIEIAQoAmBqIAIvAQZBAnRqIQIDQCACIQIgAyEDAkACQCAHIAUoAiwiCGsiBEEATg0AIAMhAyACIQJBAiEEDAELIAVBIGogASACLQACIAVBLGogBBBIAkACQAJAIAUpAyBQDQAgBSAFKQMgNwMQIAEgBiAFQRBqEJ4DIAUoAiwgCEYNACADIQQCQCADDQAgAi0AA0EedEEfdSACcSEECyAEIQMgAkEEaiEEAkACQCACLwEERQ0AIAQhAgwBCyADIQIgAw0AQQAhAyAEIQIMAgsgAyEDIAIhAkEAIQQMAgsgAyEDIAIhAgtBAiEECyADIQMgAiECIAQhBAsgAyEDIAIhAiAERQ0ACyAFIAApAwA3AwggASAFQQhqEI8BDAELIAAgASACLwEGIAVBLGogBBBICyAFQTBqJAAL3QECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCAAyICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGTISABQRBqENwDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENwDQQAhAwsCQCADIgNFDQAgACgC7AEhAiAAIAEoAiQgAy8BAkH0A0EAENACIAJBDSADEKgDCyABQcAAaiQAC0cBAX8jAEEQayICJAAgAkEIaiAAIAEgAEGIA2ogAEGEA2otAAAQrgICQCAAKALsASIARQ0AIAAgAikDCDcDIAsgAkEQaiQAC8AEAQp/IwBBMGsiAiQAIABB4ABqIQMCQAJAIAAtAENBf2oiBEEBRg0AIAMhAyAEIQQMAQsgAiADKQMANwMgAkAgACACQSBqEPIDDQAgAyEDQQEhBAwBCyACIAMpAwA3AxggACACQRhqEPEDIgQoAgwhAyAELwEIIQQLIAQhBSADIQYgAEGIA2ohBwJAAkAgAS0ABEEBcUUNACAHIQMgBUUNASAAQfQEaiEIIAchBEEAIQlBACEKIAAoAOQBIgMgAygCYGogAS8BBkECdGohAQNAIAEhAyAKIQogCSEJAkACQCAIIAQiBGsiAUEASA0AIAMtAAIhCyACIAYgCUEDdGopAwA3AxAgACALIAQgASACQRBqEEkiAUUNACAKIQsCQCAKDQAgAy0AA0EedEEfdSADcSELCyALIQogBCABaiEEIANBBGohAQJAAkACQCADLwEERQ0AIAEhAwwBCyAKIQMgCg0AIAEhAUEAIQpBASELDAELIAMhASAKIQpBACELCyAEIQMMAQsgAyEBIAohCkEBIQsgBCEDCyADIQMgCiEKIAEhAQJAIAtFDQAgAyEDDAMLIAMhBCAJQQFqIgshCSAKIQogASEBIAMhAyALIAVHDQAMAgsACyAHIQMCQAJAIAUOAgIBAAsgAiAFNgIAIAJBKGogAEHQwQAgAhDZAyAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQSWohAwsgAEGEA2ogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahCAAyICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGTISABQRBqENwDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENwDQQAhAwsCQCADIgNFDQAgACADELECIAAgASgCJCADLwECQf8fcUGAwAByENICCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEIADIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZMhIANBCGoQ3ANBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahCAAyIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGTISADQQhqENwDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQgAMiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBkyEgA0EIahDcA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDnAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDWCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQgAMiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBkyEgAUEQahDcA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBhiEgAUEIahDcA0EAIQMLAkAgAyIDRQ0AIAAgAxCxAiAAIAEoAiQgAy8BAhDSAgsgAUHAAGokAAtkAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahDbAwwBCyAAIAEgAigCABCEA0EARxDoAwsgA0EQaiQAC2MBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqENsDDAELIAAgASABIAIoAgAQgwMQ/AILIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDWDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQ2wNB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAEKADIQMgASAAQegAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahDwAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AEN0DDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABDdAwwBCyAAQYQDaiAFOgAAIABBiANqIAQgBRCfBhogACACIAMQ0gILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQ/wIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxDbAyAAQgA3AwAMAQsgACACKAIEEOcDCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqEP8CIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQ2wMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuaAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAIAAgAUEYahD/AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqENsDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahCHAyAAKALsASIARQ0AIAAgASkDKDcDIAsgAUHAAGokAAvDAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAAkAgACABQRhqEP8CDQAgASABKQMwNwMAIAFBOGogAEGdASABENsDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyggACABQRBqEJQCIgJFDQAgASAAKQNYIgM3AwggASADNwMgIAAgAUEIahD+AiIAQX9MDQEgAiAAQYCAAnM7ARILIAFBwABqJAAPC0G93ABBq84AQSlBuicQgQYAC/gBAgR/AX4jAEEgayIBJAAgASAAQeAAaikDACIFNwMIIAEgBTcDGCAAIAFBCGpBABDGAyECIABBARCgAyEDAkACQEGYKkEAELAFRQ0AIAFBEGogAEGzP0EAENkDDAELAkAQQQ0AIAFBEGogAEGiN0EAENkDDAELAkACQCACRQ0AIAMNAQsgAUEQaiAAQbw8QQAQ1wMMAQtBAEEONgKQhQICQCAAKALsASIERQ0AIAQgACkDYDcDIAtBAEEBOgDogAIgAiADED4hAkEAQQA6AOiAAgJAIAJFDQBBAEEANgKQhQIgAEF/EKQDCyAAQQAQpAMLIAFBIGokAAvuAgIDfwF+IwBBIGsiAyQAAkACQBBwIgRFDQAgBC8BCA0AIARBFRDwAiEFIANBEGpBrwEQxwMgAyADKQMQNwMAIANBGGogBCAFIAMQjQMgAykDGFANAEIAIQZBsAEhBQJAAkACQAJAAkAgAEF/ag4EBAABAwILQQBBADYCkIUCQgAhBkGxASEFDAMLQQBBADYCkIUCEEACQCABDQBCACEGQbIBIQUMAwsgA0EIaiAEQQggBCABIAIQmAEQ6QMgAykDCCEGQbIBIQUMAgtBhccAQSxBhhEQ/AUACyADQQhqIARBCCAEIAEgAhCTARDpAyADKQMIIQZBswEhBQsgBSEAIAYh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gQIgBSEBIAIhAiAFDQALC0EAQQAoAoCCAkEgajYCgIICQSAhASAAIQICQANAIAIhAiABIQECQEEAKAL8gQIiA0HAAEcNACABQcAASQ0AQYSCAiACELkDIAFBQGoiAyEBIAJBwABqIQIgAw0BDAILQQAoAviBAiACIAEgAyABIANJGyIDEJ8GGkEAQQAoAvyBAiIEIANrNgL8gQIgAiADaiECIAEgA2shBQJAIAQgA0cNAEGEggJBuIECELkDQQBBwAA2AvyBAkEAQbiBAjYC+IECIAUhASACIQIgBQ0BDAILQQBBACgC+IECIANqNgL4gQIgBSEBIAIhAiAFDQALC0G0gQIQugMaIABBGGpBACkDyIICNwAAIABBEGpBACkDwIICNwAAIABBCGpBACkDuIICNwAAIABBACkDsIICNwAAQQBCADcD0IICQQBCADcD2IICQQBCADcD4IICQQBCADcD6IICQQBCADcD8IICQQBCADcD+IICQQBCADcDgIMCQQBCADcDiIMCQQBBADoAsIECDwtB384AQQ5BxCEQ/AUAC+0HAQF/IAAgARC+AwJAIANFDQBBAEEAKAKAggIgA2o2AoCCAiADIQMgAiEBA0AgASEBIAMhAwJAQQAoAvyBAiIAQcAARw0AIANBwABJDQBBhIICIAEQuQMgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgC+IECIAEgAyAAIAMgAEkbIgAQnwYaQQBBACgC/IECIgkgAGs2AvyBAiABIABqIQEgAyAAayECAkAgCSAARw0AQYSCAkG4gQIQuQNBAEHAADYC/IECQQBBuIECNgL4gQIgAiEDIAEhASACDQEMAgtBAEEAKAL4gQIgAGo2AviBAiACIQMgASEBIAINAAsLIAgQwAMgCEEgEL4DAkAgBUUNAEEAQQAoAoCCAiAFajYCgIICIAUhAyAEIQEDQCABIQEgAyEDAkBBACgC/IECIgBBwABHDQAgA0HAAEkNAEGEggIgARC5AyADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAL4gQIgASADIAAgAyAASRsiABCfBhpBAEEAKAL8gQIiCSAAazYC/IECIAEgAGohASADIABrIQICQCAJIABHDQBBhIICQbiBAhC5A0EAQcAANgL8gQJBAEG4gQI2AviBAiACIQMgASEBIAINAQwC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AiAgACABQevPACADQSBqEMkDDAsLQZPLAEGfAUGjLhD8BQALIAMgAigCADYCMCAAIAFB988AIANBMGoQyQMMCQsgAigCACECIAMgASgC5AE2AkwgAyADQcwAaiACEHs2AkAgACABQaXQACADQcAAahDJAwwICyADIAEoAuQBNgJcIAMgA0HcAGogBEEEdkH//wNxEHs2AlAgACABQbTQACADQdAAahDJAwwHCyADIAEoAuQBNgJkIAMgA0HkAGogBEEEdkH//wNxEHs2AmAgACABQc3QACADQeAAahDJAwwGCwJAAkAgAigCACIEDQBBACEFDAELIAQtAANBD3EhBQsCQAJAAkACQAJAAkACQCAFQX1qDgsABQIGAQYFBQMGBAYLIABCj4CBgMAANwMADAsLIABCnICBgMAANwMADAoLIAMgAikDADcDaCAAIAEgA0HoAGoQzAMMCQsgASAELwESEIUDIQIgBC8BECEFIAMgBCgCHC8BBDYCeCADIAU2AnQgAyACNgJwIAAgAUGm0QAgA0HwAGoQyQMMCAsgBC8BBCECIAQvAQYhBSADIAQtAAo2AogBIAMgBTYChAEgAyACNgKAASAAIAFB5dEAIANBgAFqEMkDDAcLIABCpoCBgMAANwMADAYLQZPLAEHJAUGjLhD8BQALIAIoAgBBgIABTw0FIAMgAikDACIHNwOQAiADIAc3A7gBIAEgA0G4AWogA0HcAmoQ8AMiBEUNBgJAIAMoAtwCIgJBIUkNACADIAQ2ApgBIANBIDYClAEgAyACNgKQASAAIAFB0dEAIANBkAFqEMkDDAULIAMgBDYCqAEgAyACNgKkASADIAI2AqABIAAgAUH30AAgA0GgAWoQyQMMBAsgAyABIAIoAgAQhQM2AsABIAAgAUHC0AAgA0HAAWoQyQMMAwsgAyACKQMANwOIAgJAIAEgA0GIAmoQ/wIiBEUNACAELwEAIQIgAyABKALkATYChAIgAyADQYQCaiACQQAQigQ2AoACIAAgAUHa0AAgA0GAAmoQyQMMAwsgAyACKQMANwP4ASABIANB+AFqIANBkAJqEIADIQICQCADKAKQAiIEQf//AUcNACABIAIQggMhBSABKALkASIEIAQoAmBqIAVBBHRqLwEAIQUgAyAENgLcASADQdwBaiAFQQAQigQhBCACLwEAIQIgAyAB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QRhqIAIQ6gQgA0EQaiACEOoEIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxCaAyADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQ6gQgAkEgaiABEOoEIAJBGGogARDqBCACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEJsDIAJBMGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOoEIAMgAykDIDcDKCACKAJQIQQgAyACKALkATYCHAJAAkAgA0EcaiAEQYCAAXIiBBD7Aw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgQELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCYAwsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOoEIAMgAykDIDcDKCACKAJQIQQgAyACKALkATYCHAJAAkAgA0EcaiAEQYCAAnIiBBD7Aw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgQELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCYAwsgA0HAAGokAAvEAQECfyMAQcAAayIDJAAgA0EgaiACEOoEIAMgAykDIDcDKCACKAJQIQQgAyACKALkATYCHAJAAkAgA0EcaiAEQYCAA3IiBBD7Aw0AIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAIAMpAzBCAFINACADQThqIAJB+gAQgQELAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahCYAwsgA0HAAGokAAuOAQECfyMAQSBrIgMkACACKAJQIQQgAyACKALkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD7Aw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgQELIAJBABDwAiEEIAMgAykDEDcDACAAIAIgBCADEI0DIANBIGokAAuOAQEC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ACABIAQ2AhgMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgASAENgIYCyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQQA2AhggASAENgIMIAEgADYCCAtBAEEAKAKAlAJBf2oiAUF/IAEbNgKAlAILCwcAPwBBEHQLVAECf0EAKALU7wEiASAAQQdqQXhxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ6AZNDQAgABATRQ0BC0EAIAA2AtTvASABDwsQnAZBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQkgBCACIAcbIgtC////////P4MhCiACIAQgBxsiAkIwiKdB//8BcSEIAkAgC0IwiKdB//8BcSIGDQAgBUHgAGogCSAKIAkgCiAKUCIGG3kgBkEGdK18pyIGQXFqEOsGQRAgBmshBiAFQegAaikDACEKIAUpA2AhCQsgASADIAcbIQMgAkL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDrBkEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQEgCkIDhiAJQj2IhCEEIANCA4YhCiALIAKFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACEBQgEhCgwBCyAFQcAAaiAKIAFBgAEgB2sQ6wYgBUEwaiAKIAEgBxD1BiAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhCiAFQTBqQQhqKQMAIQELIARCgICAgICAgASEIQwgCUIDhiEJAkACQCADQn9VDQBCACEDQgAhBCAJIAqFIAwgAYWEUA0CIAkgCn0hAiAMIAF9IAkgClStfSIEQv////////8DVg0BIAVBIGogAiAEIAIgBCAEUCIHG3kgB0EGdK18p0F0aiIHEOsGIAYgB2shBiAFQShqKQMAIQQgBSkDICECDAELIAEgDHwgCiAJfCICIApUrXwiBEKAgICAgICACINQDQAgAkIBiCAEQj+GhCAKQgGDhCECIAZBAWohBiAEQgGIIQQLIAtCgICAgICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEOsGIAUgAiAEQQEgBmsQ9QYgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEPMGDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEPQGGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ6wZBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDrBiAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABD3BiAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABD3BiAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABD3BiAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABD3BiAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABD3BiAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABD3BiAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABD3BiAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABD3BiAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABD3BiAFQZABaiADQg+GQgAgBEIAEPcGIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ9wYgBUGAAWpCASACfUIAIARCABD3BiAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEPcGIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEPcGIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ9QYgBUEwaiAWIBMgBkHwAGoQ6wYgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q9wYgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABD3BiAFIAMgDkIFQgAQ9wYgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEOsGIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEOsGIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ6wYgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ6wYgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ6wZBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ6wYgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ6wYgBUEgaiACIAQgBhDrBiAFQRBqIBIgASAHEPUGIAUgAiAEIAcQ9QYgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEOoGIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDrBiACIAAgBEGB+AAgA2sQ9QYgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEHQlwYkA0HQlwJBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEREACyUBAX4gACABIAKtIAOtQiCGhCAEEIUHIQUgBUIgiKcQ+wYgBacLEwAgACABpyABQiCIpyACIAMQFAsLvvOBgAADAEGACAuo5gFpbmZpbml0eQAtSW5maW5pdHkAISBFeGNlcHRpb246IE91dE9mTWVtb3J5AGlzUmVhZE9ubHkAZGV2c192ZXJpZnkAc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBkZWxheQBzZXR1cF9jdHgAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABkZXZzX3NwZWNfaWR4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABzcGVjIG1pc3Npbmc6ICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBjaHVuayBvdmVyZmxvdwAhIEV4Y2VwdGlvbjogU3RhY2tPdmVyZmxvdwBibGl0Um93AGpkX3dzc2tfbmV3AGpkX3dlYnNvY2tfbmV3AGV4cHIxX25ldwBkZXZzX2pkX3NlbmRfcmF3AGlkaXYAcHJldgAuYXBwLmdpdGh1Yi5kZXYAJXMldQB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AHN0b3BfbGlzdABkaWdlc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAcmVzdGFydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABkZWNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudAB0Y3Bzb2NrX29uX2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABfc29ja2V0T25FdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAZGV2c19wYWNrZXRfc3BlY19wYXJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AG1hc2tlZCBzZXJ2ZXIgcGt0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdABibGl0AHdhaXQAaGVpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uU2VydmVyUGFja2V0AF9vblBhY2tldABnZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAZmlsbFJlY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX3JvbGVfc2V0X2hpbnRzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwAweDF4eHh4eHh4IGV4cGVjdGVkIGZvciBzZXJ2aWNlIGNsYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAaWR4IDw9IGN0eC0+bnVtX3BpbnMAR1BJTzogaW5pdDogJWQgcGlucwBlcXVhbHMAbWlsbGlzAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAY2FwYWJpbGl0aWVzAGlkeCA8IGN0eC0+aW1nLmhlYWRlci0+bnVtX3NlcnZpY2Vfc3BlY3MAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byAlczovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAKiBzdGFydDogJXMgJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTOiBlcnJvcjogJXMAV1NTSzogZXJyb3I6ICVzAGJhZCByZXNwOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBuIDw9IHdzLT5tc2dwdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAc29jayB3cml0ZSBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAG1ncjogc3RhcnRpbmcgY2xvdWQgYWRhcHRlcgBtZ3I6IGRldk5ldHdvcmsgbW9kZSAtIGRpc2FibGUgY2xvdWQgYWRhcHRlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAHN0YXJ0X3BrdF9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAHNwaVhmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAGJwcABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcABkZXZzX2R1bXBfaGVhcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBncGlvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBfaTJjVHJhbnNhY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AX3NvY2tldE9wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmaWxsUmFuZG9tAGFlcy0yNTYtY2NtAGZsYXNoX3Byb2dyYW0AKiBzdG9wIHByb2dyYW0AaW11bAB1bmtub3duIGN0cmwAbm9uLWZpbiBjdHJsAHRvbyBsYXJnZSBjdHJsAG51bGwAZmlsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxhYmVsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAG5vbi1taW5pbWFsAD9zcGVjaWFsAGRldk5ldHdvcmsAZGV2c19pbWdfc3RyaWR4X29rAGRldnNfZ2NfYWRkX2NodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABvdmVybGFwc1dpdGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgASW52YWxpZCBhcnJheSBsZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGJ5dGVMZW5ndGgAd2lkdGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaABkZXZzX3N0cmluZ19maW5pc2gAISB2ZXJzaW9uIG1pc21hdGNoAGVuY3J5cHRpb24gdGFnIG1pc21hdGNoAGZvckVhY2gAcCA8IGNoAHNoaWZ0X21zZwBzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAGNhbid0IHBvbmcAc2V0dGluZwBnZXR0aW5nAGJvZHkgbWlzc2luZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwBkZXZzX2dwaW9faW5pdF9kY2ZnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgB5X29mZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAaW5kZXhPZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBmbGFzaF9zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAHN6ID09IHMtPmlubmVyLnNpemUAc3RhdGUub2ZmICsgMyA8PSBzaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAX3NvY2tldFdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHJvdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAX3NvY2tldENsb3NlAHdlYnNvY2sgcmVzcG9uc2UAX2NvbW1hbmRSZXNwb25zZQBtZ3I6IHJ1bm5pbmcgc2V0IHRvIGZhbHNlAGZsYXNoX2VyYXNlAHRvTG93ZXJDYXNlAHRvVXBwZXJDYXNlAGRldnNfbWFrZV9jbG9zdXJlAHNwaUNvbmZpZ3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBjbG9uZQBHUElPOiBpbml0IHVzZWQgZG9uZQBpbmxpbmUAZHJhd0xpbmUAZGJnOiByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAV1M6IGNsb3NlIGZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAX2FsbG9jUm9sZQBmaWxsQ2lyY2xlAG5ldHdvcmsgbm90IGF2YWlsYWJsZQByZWNvbXB1dGVfY2FjaGUAbWFya19sYXJnZQBpbnZhbGlkIHJvdGF0aW9uIHJhbmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAX3R3aW5NZXNzYWdlAGltYWdlAGRyYXdJbWFnZQBkcmF3VHJhbnNwYXJlbnRJbWFnZQBzcGlTZW5kSW1hZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbW9kZQBtZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlAGRlY29kZQBzZXRNb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBpbWdfc3RyaWRlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAFNlcnZlckludGVyZmFjZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABqZGlmOiBhdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABfc2VydmVyU2VuZABsZWRTdHJpcFNlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGhvc3Qgb3IgcG9ydCBpbnZhbGlkAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAcmVhZF9pbmRleGVkACogUkVTVEFSVCByZXF1ZXN0ZWQAbm90SW1wbGVtZW50ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAG9uQ29ubmVjdGVkAGRhdGFfcGFnZV91c2VkAHJvbGUgbmFtZSAnJXMnIGFscmVhZHkgdXNlZAB0cmFuc3Bvc2VkAGZpYmVyIGFscmVhZHkgZGlzcG9zZWQAKiBjb25uZWN0aW9uIHRvICVzIGNsb3NlZABXU1NLLUg6IHN0cmVhbWluZyBleHBpcmVkAGRldnNfdmFsdWVfaXNfcGlubmVkAHRocm93aW5nIG51bGwvdW5kZWZpbmVkAHJlYWRfbmFtZWQAJXUgcGFja2V0cyB0aHJvdHRsZWQAJXMgY2FsbGVkAGRldk5ldHdvcmsgZW5hYmxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAZmliZXIgbm90IHN1c3BlbmRlZABXU1NLLUg6IGV4Y2VwdGlvbiB1cGxvYWRlZABwYXlsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAcHJvZHVjdElkAGludmFsaWQgZGltZW5zaW9ucyAlZHglZHglZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbl9vYmo6JWQAKiAlcyB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAG9ubHkgb25lIHZhbHVlIGV4cGVjdGVkOyBnb3QgJWQAaW52YWxpZCBvZmZzZXQgJWQAISBjYW4ndCB2YWxpZGF0ZSBtZnIgY29uZmlnIGF0ICVwLCBlcnJvciAlZABHUElPOiAlcyglZCkgc2V0IHRvICVkAFVuZXhwZWN0ZWQgdG9rZW4gJyVjJyBpbiBKU09OIGF0IHBvc2l0aW9uICVkAGRiZzogc3VzcGVuZCAlZABqZGlmOiBjcmVhdGUgcm9sZSAnJXMnIC0+ICVkAFdTOiBoZWFkZXJzIGRvbmU7ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX2dldF9wcm9wZXJ0eV9kZXNjAGRldnNfdmFsdWVfZW5jb2RlX3Rocm93X2ptcF9wYwBwYyA9PSAoZGV2c19wY190KXBjAGRldnNfc3RyaW5nX2ptcF90cnlfYWxsb2MAZGV2c2RiZ19waXBlX2FsbG9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBmbGFzaCBzeW5jAGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pYwBiYWQgbWFnaWMAamRfZnN0b3JfZ2MAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAZnN0b3I6IGdjAGRldnNfdmFsdWVfZnJvbV9wYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlYwBQYWNrZXRTcGVjAFNlcnZpY2VTcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9pbXBsX3NvY2tldC5jAGRldmljZXNjcmlwdC9pbnNwZWN0LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9pbXBsX2RzLmMAamFjZGFjLWMvc291cmNlL2pkX2ZzdG9yLmMAZGV2aWNlc2NyaXB0L2RldnNtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvaW1wbF9ncGlvLmMAZGV2aWNlc2NyaXB0L2pzb24uYwBkZXZpY2VzY3JpcHQvaW1wbF9mdW5jdGlvbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dlYnNvY2tfY29ubi5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvc291cmNlL2pkX3NydmNmZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9kY2ZnLmMAZGV2aWNlc2NyaXB0L2RldnNkYmcuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2ltcGxfaW1hZ2UuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9pbXBsX3BhY2tldHNwZWMuYwBkZXZpY2VzY3JpcHQvaW1wbF9zZXJ2aWNlc3BlYy5jAGRldmljZXNjcmlwdC91dGY4LmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAbWdyOiBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAG9uX2RhdGEAZXhwZWN0aW5nIHRvcGljIGFuZCBkYXRhAF9fbmV3X18AX19wcm90b19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbUm9sZTogJXMuJXNdAFtQYWNrZXRTcGVjOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBbU2VydmljZVNwZWM6ICVzXQBbQ2lyY3VsYXJdAFtCdWZmZXJbJXVdICUqcF0Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPSV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUqcC4uLl0AW0ltYWdlOiAlZHglZCAoJWQgYnBwKV0AZmxpcFkAZmxpcFgAaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAbGV2IDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfTEVWRUxfTUFYAHBjICYmIHBjIDw9IERFVlNfU1BFQ0lBTF9USFJPV19KTVBfUENfTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAZXhwZWN0aW5nIENPTlQAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfUEFDS0VUAGNtZC0+cGt0LT5zZXJ2aWNlX2NvbW1hbmQgPT0gSkRfREVWU19EQkdfQ01EX1JFQURfSU5ERVhFRF9WQUxVRVMAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAEZTVE9SX0RBVEFfUEFHRVMgPD0gSkRfRlNUT1JfTUFYX0RBVEFfUEFHRVMAZGV2c19nY190YWcoYikgPT0gREVWU19HQ19UQUdfQlVGRkVSAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTgBpZHggPj0gREVWU19GSVJTVF9CVUlMVElOX0ZVTkNUSU9OAGV4cGVjdGluZyBCSU4AcGt0ICE9IE5VTEwAc2V0dGluZ3MgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAZmxhc2hfYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABXU1NLACh0bXAudjAgJiBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLKSAhPSBKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lORElDQVRPUl9NQVNLAFNQSQBESVNDT05ORUNUSU5HAHN6ID09IGxlbiAmJiBzeiA8IERFVlNfTUFYX0FTQ0lJX1NUUklORwBtZ3I6IHdvdWxkIHJlc3RhcnQgZHVlIHRvIERDRkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gZmxhc2hfc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQB3cy0+bXNncHRyIDw9IE1BWF9NRVNTQUdFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwBJMkMAPz8/ACVjICAlcyA9PgBpbnQ6AGFwcDoAd3NzazoAdXRmOABzaXplID4gc2l6ZW9mKGNodW5rX3QpICsgMTI4AHV0Zi04AHNoYTI1NgBjbnQgPT0gMyB8fCBjbnQgPT0gLTMAbGVuID09IGwyAGxvZzIAZGV2c19hcmdfaW1nMgBTUVJUMV8yAFNRUlQyAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAV1M6IGdvdCAxMDEASFRUUC8xLjEgMTAxAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAbG9nMTAATE4xMABzaXplIDwgMHhmMDAwAG51bV9lbHRzIDwgMTAwMABhdXRoIG5vbi0wAHN6ID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN6ID49IDAAaWR4ID49IDAAciA+PSAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGpkX3NydmNmZ19pZHggPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGN0eC0+c3RhY2tfdG9wID09IDAAZXZlbnRfc2NvcGUgPT0gMABzdHJbc3pdID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoKHRtcC52MCA8PCAxKSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRFWF9NQVNLKSkgPT0gMAAoKHRtcC50YWcgPDwgMjQpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX1RBR19NQVNLKSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwB3c3M6Ly8AcGlucy4APy4AJWMgIC4uLgAhICAuLi4ALABwYWNrZXQgNjRrKwAhZGV2c19pbl92bV9sb29wKGN0eCkAZGV2c19oYW5kbGVfaXNfcHRyKHYpAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAGRldnNfaGFuZGxlX3R5cGUodikgPT0gREVWU19IQU5ETEVfVFlQRV9HQ19PQkpFQ1QgJiYgZGV2c19pc19zdHJpbmcoY3R4LCB2KQBlbmNyeXB0ZWQgZGF0YSAobGVuPSV1KSBzaG9ydGVyIHRoYW4gdGFnTGVuICgldSkAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKG1hcCkAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBzdGF0czogJWQgb2JqZWN0cywgJWQgQiB1c2VkLCAlZCBCIGZyZWUgKCVkIEIgbWF4IGJsb2NrKQBkZXZzX2lzX21hcChvYmopAGZpZHggPCAoaW50KWRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGlzX2xhcmdlKGUpAEdQSU86IHNraXAgJXMgLT4gJWQgKHVzZWQpACEgaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBHUElPOiBpbml0WyV1XSAlcyAtPiAlZCAoPSVkKQAhIEV4Y2VwdGlvbjogUGFuaWNfJWQgYXQgKGdwYzolZCkAKiAgYXQgdW5rbm93biAoZ3BjOiVkKQAqICBhdCAlc19GJWQgKHBjOiVkKQAhICBhdCAlc19GJWQgKHBjOiVkKQBhY3Q6ICVzX0YlZCAocGM6JWQpACEgbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQBvZmYgPCAodW5zaWduZWQpKEZTVE9SX0RBVEFfUEFHRVMpACVzIChXU1NLKQAhdGFyZ2V0X2luX2lycSgpACEgVXNlci1yZXF1ZXN0ZWQgSkRfUEFOSUMoKQBmc3RvcjogaW52YWxpZCBsYXJnZSBrZXk6ICclcycAZnN0b3I6IGludmFsaWQga2V5OiAnJXMnAHplcm8ga2V5IQBkZXBsb3kgZGV2aWNlIGxvc3QKAEdFVCAlcyBIVFRQLzEuMQ0KSG9zdDogJXMNCk9yaWdpbjogaHR0cDovLyVzDQpTZWMtV2ViU29ja2V0LUtleTogJXM9PQ0KU2VjLVdlYlNvY2tldC1Qcm90b2NvbDogJXMNClVzZXItQWdlbnQ6IGphY2RhYy1jLyVzDQpQcmFnbWE6IG5vLWNhY2hlDQpDYWNoZS1Db250cm9sOiBuby1jYWNoZQ0KVXBncmFkZTog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KTw6Oj57IGlmIChleGl0Y29kZSkgY29uc29sZS5sb2coIlBBTklDIiwgZXhpdGNvZGUpOyBpZiAoTW9kdWxlLnBhbmljSGFuZGxlcikgTW9kdWxlLnBhbmljSGFuZGxlcihleGl0Y29kZSk7IH0AKGNvbnN0IHZvaWQgKmZyYW1lLCB1bnNpZ25lZCBzeik8Ojo+eyBjb25zdCBwa3QgPSBIRUFQVTguc2xpY2UoZnJhbWUsIGZyYW1lICsgc3opOyBNb2R1bGUuc2VuZFBhY2tldChwa3QpIH0AKGludCBleGl0Y29kZSk8Ojo+eyBpZiAoTW9kdWxlLmRlcGxveUhhbmRsZXIpIE1vZHVsZS5kZXBsb3lIYW5kbGVyKGV4aXRjb2RlKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gRGF0ZS5ub3coKTsgfQAodWludDhfdCAqIHRyZywgdW5zaWduZWQgc2l6ZSk8Ojo+eyBsZXQgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGlmICh0eXBlb2Ygd2luZG93ID09ICJvYmplY3QiICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ1Zik7IGVsc2UgeyBidWYgPSByZXF1aXJlKCJjcnlwdG8iKS5yYW5kb21CeXRlcyhzaXplKTsgfSBIRUFQVTguc2V0KGJ1ZiwgdHJnKTsgfQAoY29uc3QgY2hhciAqcHRyKTw6Oj57IGNvbnN0IHMgPSBVVEY4VG9TdHJpbmcocHRyLCAxMDI0KTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKHMpOyBlbHNlIGNvbnNvbGUuZGVidWcocyk7IH0AKGNvbnN0IGNoYXIgKmhvc3RuYW1lLCBpbnQgcG9ydCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tPcGVuKGhvc3RuYW1lLCBwb3J0KTsgfQAoY29uc3Qgdm9pZCAqYnVmLCB1bnNpZ25lZCBzaXplKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja1dyaXRlKGJ1Ziwgc2l6ZSk7IH0AKHZvaWQpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrQ2xvc2UoKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tJc0F2YWlsYWJsZSgpOyB9AAC/ioGAAARuYW1lAc6JAYgHAA1lbV9mbGFzaF9zYXZlAQ1lbV9mbGFzaF9zaXplAg1lbV9mbGFzaF9sb2FkAwVhYm9ydAQTZW1fc2VuZF9sYXJnZV9mcmFtZQUTX2RldnNfcGFuaWNfaGFuZGxlcgYRZW1fZGVwbG95X2hhbmRsZXIHF2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tCA1lbV9zZW5kX2ZyYW1lCQRleGl0CgtlbV90aW1lX25vdwsOZW1fcHJpbnRfZG1lc2cMD19qZF90Y3Bzb2NrX25ldw0RX2pkX3RjcHNvY2tfd3JpdGUOEV9qZF90Y3Bzb2NrX2Nsb3NlDxhfamRfdGNwc29ja19pc19hdmFpbGFibGUQD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFRFfX3dhc21fY2FsbF9jdG9ycxYPZmxhc2hfYmFzZV9hZGRyFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoKZmxhc2hfaW5pdBsIaHdfcGFuaWMcCGpkX2JsaW5rHQdqZF9nbG93HhRqZF9hbGxvY19zdGFja19jaGVjax8IamRfYWxsb2MgB2pkX2ZyZWUhDXRhcmdldF9pbl9pcnEiEnRhcmdldF9kaXNhYmxlX2lycSMRdGFyZ2V0X2VuYWJsZV9pcnEkGGpkX2RldmljZV9pZF9mcm9tX3N0cmluZyUVZGV2c19zZW5kX2xhcmdlX2ZyYW1lJhJkZXZzX3BhbmljX2hhbmRsZXInE2RldnNfZGVwbG95X2hhbmRsZXIoFGpkX2NyeXB0b19nZXRfcmFuZG9tKRBqZF9lbV9zZW5kX2ZyYW1lKhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMisaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcsCmpkX2VtX2luaXQtDWpkX2VtX3Byb2Nlc3MuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzMwxod19kZXZpY2VfaWQ0DHRhcmdldF9yZXNldDUOdGltX2dldF9taWNyb3M2D2FwcF9wcmludF9kbWVzZzcSamRfdGNwc29ja19wcm9jZXNzOBFhcHBfaW5pdF9zZXJ2aWNlczkSZGV2c19jbGllbnRfZGVwbG95OhRjbGllbnRfZXZlbnRfaGFuZGxlcjsJYXBwX2RtZXNnPAtmbHVzaF9kbWVzZz0LYXBwX3Byb2Nlc3M+DmpkX3RjcHNvY2tfbmV3PxBqZF90Y3Bzb2NrX3dyaXRlQBBqZF90Y3Bzb2NrX2Nsb3NlQRdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZUIWamRfZW1fdGNwc29ja19vbl9ldmVudEMHdHhfaW5pdEQPamRfcGFja2V0X3JlYWR5RQp0eF9wcm9jZXNzRg10eF9zZW5kX2ZyYW1lRw5kZXZzX2J1ZmZlcl9vcEgSZGV2c19idWZmZXJfZGVjb2RlSRJkZXZzX2J1ZmZlcl9lbmNvZGVKD2RldnNfY3JlYXRlX2N0eEsJc2V0dXBfY3R4TApkZXZzX3RyYWNlTQ9kZXZzX2Vycm9yX2NvZGVOGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJPCWNsZWFyX2N0eFANZGV2c19mcmVlX2N0eFEIZGV2c19vb21SCWRldnNfZnJlZVMRZGV2c2Nsb3VkX3Byb2Nlc3NUF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0VRBkZXZzY2xvdWRfdXBsb2FkVhRkZXZzY2xvdWRfb25fbWVzc2FnZVcOZGV2c2Nsb3VkX2luaXRYFGRldnNfdHJhY2tfZXhjZXB0aW9uWQ9kZXZzZGJnX3Byb2Nlc3NaEWRldnNkYmdfcmVzdGFydGVkWxVkZXZzZGJnX2hhbmRsZV9wYWNrZXRcC3NlbmRfdmFsdWVzXRF2YWx1ZV9mcm9tX3RhZ192MF4ZZGV2c2RiZ19vcGVuX3Jlc3VsdHNfcGlwZV8Nb2JqX2dldF9wcm9wc2AMZXhwYW5kX3ZhbHVlYRJkZXZzZGJnX3N1c3BlbmRfY2JiDGRldnNkYmdfaW5pdGMQZXhwYW5kX2tleV92YWx1ZWQGa3ZfYWRkZQ9kZXZzbWdyX3Byb2Nlc3NmB3RyeV9ydW5nB3J1bl9pbWdoDHN0b3BfcHJvZ3JhbWkPZGV2c21ncl9yZXN0YXJ0ahRkZXZzbWdyX2RlcGxveV9zdGFydGsUZGV2c21ncl9kZXBsb3lfd3JpdGVsEGRldnNtZ3JfZ2V0X2hhc2htFWRldnNtZ3JfaGFuZGxlX3BhY2tldG4OZGVwbG95X2hhbmRsZXJvE2RlcGxveV9tZXRhX2hhbmRsZXJwD2RldnNtZ3JfZ2V0X2N0eHEOZGV2c21ncl9kZXBsb3lyDGRldnNtZ3JfaW5pdHMRZGV2c21ncl9jbGllbnRfZXZ0FmRldnNfc2VydmljZV9mdWxsX2luaXR1GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnYKZGV2c19wYW5pY3cYZGV2c19maWJlcl9zZXRfd2FrZV90aW1leBBkZXZzX2ZpYmVyX3NsZWVweRtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx6GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzexFkZXZzX2ltZ19mdW5fbmFtZXwRZGV2c19maWJlcl9ieV90YWd9EGRldnNfZmliZXJfc3RhcnR+FGRldnNfZmliZXJfdGVybWlhbnRlfw5kZXZzX2ZpYmVyX3J1boABE2RldnNfZmliZXJfc3luY19ub3eBARVfZGV2c19pbnZhbGlkX3Byb2dyYW2CARhkZXZzX2ZpYmVyX2dldF9tYXhfc2xlZXCDAQ9kZXZzX2ZpYmVyX3Bva2WEARFkZXZzX2djX2FkZF9jaHVua4UBFmRldnNfZ2Nfb2JqX2NoZWNrX2NvcmWGARNqZF9nY19hbnlfdHJ5X2FsbG9jhwEHZGV2c19nY4gBD2ZpbmRfZnJlZV9ibG9ja4kBEmRldnNfYW55X3RyeV9hbGxvY4oBDmRldnNfdHJ5X2FsbG9jiwELamRfZ2NfdW5waW6MAQpqZF9nY19mcmVljQEUZGV2c192YWx1ZV9pc19waW5uZWSOAQ5kZXZzX3ZhbHVlX3Bpbo8BEGRldnNfdmFsdWVfdW5waW6QARJkZXZzX21hcF90cnlfYWxsb2ORARhkZXZzX3Nob3J0X21hcF90cnlfYWxsb2OSARRkZXZzX2FycmF5X3RyeV9hbGxvY5MBGmRldnNfYnVmZmVyX3RyeV9hbGxvY19pbml0lAEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlQEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlgEQZGV2c19zdHJpbmdfcHJlcJcBEmRldnNfc3RyaW5nX2ZpbmlzaJgBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0mQEPZGV2c19nY19zZXRfY3R4mgEOZGV2c19nY19jcmVhdGWbAQ9kZXZzX2djX2Rlc3Ryb3mcARFkZXZzX2djX29ial9jaGVja50BDmRldnNfZHVtcF9oZWFwngELc2Nhbl9nY19vYmqfARFwcm9wX0FycmF5X2xlbmd0aKABEm1ldGgyX0FycmF5X2luc2VydKEBEmZ1bjFfQXJyYXlfaXNBcnJheaIBFG1ldGhYX0FycmF5X19fY3Rvcl9fowEQbWV0aFhfQXJyYXlfcHVzaKQBFW1ldGgxX0FycmF5X3B1c2hSYW5nZaUBEW1ldGhYX0FycmF5X3NsaWNlpgEQbWV0aDFfQXJyYXlfam9pbqcBEWZ1bjFfQnVmZmVyX2FsbG9jqAEQZnVuMl9CdWZmZXJfZnJvbakBEnByb3BfQnVmZmVyX2xlbmd0aKoBFW1ldGgxX0J1ZmZlcl90b1N0cmluZ6sBE21ldGgzX0J1ZmZlcl9maWxsQXSsARNtZXRoNF9CdWZmZXJfYmxpdEF0rQETbWV0aDNfQnVmZmVyX3JvdGF0Za4BFG1ldGgzX0J1ZmZlcl9pbmRleE9mrwEXbWV0aDBfQnVmZmVyX2ZpbGxSYW5kb22wARRtZXRoNF9CdWZmZXJfZW5jcnlwdLEBEmZ1bjNfQnVmZmVyX2RpZ2VzdLIBFGRldnNfY29tcHV0ZV90aW1lb3V0swEXZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXC0ARdmdW4xX0RldmljZVNjcmlwdF9kZWxhebUBGGZ1bjFfRGV2aWNlU2NyaXB0X19wYW5pY7YBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdLcBGWZ1bjBfRGV2aWNlU2NyaXB0X3Jlc3RhcnS4ARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXS5ARdmdW4yX0RldmljZVNjcmlwdF9wcmludLoBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXS7ARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludLwBGmZ1bjJfRGV2aWNlU2NyaXB0X19sb2dSZXByvQEdZnVuMV9EZXZpY2VTY3JpcHRfX2RjZmdTdHJpbme+ARhmdW4wX0RldmljZVNjcmlwdF9taWxsaXO/ASJmdW4xX0RldmljZVNjcmlwdF9kZXZpY2VJZGVudGlmaWVywAEdZnVuMl9EZXZpY2VTY3JpcHRfX3NlcnZlclNlbmTBARxmdW4yX0RldmljZVNjcmlwdF9fYWxsb2NSb2xlwgEgZnVuMF9EZXZpY2VTY3JpcHRfbm90SW1wbGVtZW50ZWTDAR5mdW4yX0RldmljZVNjcmlwdF9fdHdpbk1lc3NhZ2XEASFmdW4zX0RldmljZVNjcmlwdF9faTJjVHJhbnNhY3Rpb27FAR5mdW4yX0RldmljZVNjcmlwdF9sZWRTdHJpcFNlbmTGAR5mdW41X0RldmljZVNjcmlwdF9zcGlDb25maWd1cmXHARlmdW4yX0RldmljZVNjcmlwdF9zcGlYZmVyyAEeZnVuM19EZXZpY2VTY3JpcHRfc3BpU2VuZEltYWdlyQEUbWV0aDFfRXJyb3JfX19jdG9yX1/KARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fywEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fzAEabWV0aDFfU3ludGF4RXJyb3JfX19jdG9yX1/NAQ9wcm9wX0Vycm9yX25hbWXOARFtZXRoMF9FcnJvcl9wcmludM8BD3Byb3BfRHNGaWJlcl9pZNABFnByb3BfRHNGaWJlcl9zdXNwZW5kZWTRARRtZXRoMV9Ec0ZpYmVyX3Jlc3VtZdIBF21ldGgwX0RzRmliZXJfdGVybWluYXRl0wEZZnVuMV9EZXZpY2VTY3JpcHRfc3VzcGVuZNQBEWZ1bjBfRHNGaWJlcl9zZWxm1QEUbWV0aFhfRnVuY3Rpb25fc3RhcnTWARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZdcBEnByb3BfRnVuY3Rpb25fbmFtZdgBE2RldnNfZ3Bpb19pbml0X2RjZmfZAQlpbml0X3VzZWTaAQ5wcm9wX0dQSU9fbW9kZdsBFnByb3BfR1BJT19jYXBhYmlsaXRpZXPcAQ9wcm9wX0dQSU9fdmFsdWXdARJtZXRoMV9HUElPX3NldE1vZGXeARBwcm9wX0ltYWdlX3dpZHRo3wERcHJvcF9JbWFnZV9oZWlnaHTgAQ5wcm9wX0ltYWdlX2JwcOEBEXByb3BfSW1hZ2VfYnVmZmVy4gEQZnVuNV9JbWFnZV9hbGxvY+MBD21ldGgzX0ltYWdlX3NldOQBDGRldnNfYXJnX2ltZ+UBB3NldENvcmXmAQ9tZXRoMl9JbWFnZV9nZXTnARBtZXRoMV9JbWFnZV9maWxs6AEJZmlsbF9yZWN06QEUbWV0aDVfSW1hZ2VfZmlsbFJlY3TqARJtZXRoMV9JbWFnZV9lcXVhbHPrARFtZXRoMF9JbWFnZV9jbG9uZewBDWFsbG9jX2ltZ19yZXTtARFtZXRoMF9JbWFnZV9mbGlwWO4BB3BpeF9wdHLvARFtZXRoMF9JbWFnZV9mbGlwWfABFm1ldGgwX0ltYWdlX3RyYW5zcG9zZWTxARVtZXRoM19JbWFnZV9kcmF3SW1hZ2XyAQ1kZXZzX2FyZ19pbWcy8wENZHJhd0ltYWdlQ29yZfQBIG1ldGg0X0ltYWdlX2RyYXdUcmFuc3BhcmVudEltYWdl9QEYbWV0aDNfSW1hZ2Vfb3ZlcmxhcHNXaXRo9gEUbWV0aDVfSW1hZ2VfZHJhd0xpbmX3AQhkcmF3TGluZfgBE21ha2Vfd3JpdGFibGVfaW1hZ2X5AQtkcmF3TGluZUxvd/oBDGRyYXdMaW5lSGlnaPsBE21ldGg1X0ltYWdlX2JsaXRSb3f8ARFtZXRoMTFfSW1hZ2VfYmxpdP0BFm1ldGg0X0ltYWdlX2ZpbGxDaXJjbGX+AQ9mdW4yX0pTT05fcGFyc2X/ARNmdW4zX0pTT05fc3RyaW5naWZ5gAIOZnVuMV9NYXRoX2NlaWyBAg9mdW4xX01hdGhfZmxvb3KCAg9mdW4xX01hdGhfcm91bmSDAg1mdW4xX01hdGhfYWJzhAIQZnVuMF9NYXRoX3JhbmRvbYUCE2Z1bjFfTWF0aF9yYW5kb21JbnSGAg1mdW4xX01hdGhfbG9nhwINZnVuMl9NYXRoX3Bvd4gCDmZ1bjJfTWF0aF9pZGl2iQIOZnVuMl9NYXRoX2ltb2SKAg5mdW4yX01hdGhfaW11bIsCDWZ1bjJfTWF0aF9taW6MAgtmdW4yX21pbm1heI0CDWZ1bjJfTWF0aF9tYXiOAhJmdW4yX09iamVjdF9hc3NpZ26PAhBmdW4xX09iamVjdF9rZXlzkAITZnVuMV9rZXlzX29yX3ZhbHVlc5ECEmZ1bjFfT2JqZWN0X3ZhbHVlc5ICGmZ1bjJfT2JqZWN0X3NldFByb3RvdHlwZU9mkwIVbWV0aDFfT2JqZWN0X19fY3Rvcl9flAIdZGV2c192YWx1ZV90b19wYWNrZXRfb3JfdGhyb3eVAhJwcm9wX0RzUGFja2V0X3JvbGWWAh5wcm9wX0RzUGFja2V0X2RldmljZUlkZW50aWZpZXKXAhVwcm9wX0RzUGFja2V0X3Nob3J0SWSYAhpwcm9wX0RzUGFja2V0X3NlcnZpY2VJbmRleJkCHHByb3BfRHNQYWNrZXRfc2VydmljZUNvbW1hbmSaAhNwcm9wX0RzUGFja2V0X2ZsYWdzmwIXcHJvcF9Ec1BhY2tldF9pc0NvbW1hbmScAhZwcm9wX0RzUGFja2V0X2lzUmVwb3J0nQIVcHJvcF9Ec1BhY2tldF9wYXlsb2FkngIVcHJvcF9Ec1BhY2tldF9pc0V2ZW50nwIXcHJvcF9Ec1BhY2tldF9ldmVudENvZGWgAhZwcm9wX0RzUGFja2V0X2lzUmVnU2V0oQIWcHJvcF9Ec1BhY2tldF9pc1JlZ0dldKICFXByb3BfRHNQYWNrZXRfcmVnQ29kZaMCFnByb3BfRHNQYWNrZXRfaXNBY3Rpb26kAhVkZXZzX3BrdF9zcGVjX2J5X2NvZGWlAhJwcm9wX0RzUGFja2V0X3NwZWOmAhFkZXZzX3BrdF9nZXRfc3BlY6cCFW1ldGgwX0RzUGFja2V0X2RlY29kZagCHW1ldGgwX0RzUGFja2V0X25vdEltcGxlbWVudGVkqQIYcHJvcF9Ec1BhY2tldFNwZWNfcGFyZW50qgIWcHJvcF9Ec1BhY2tldFNwZWNfbmFtZasCFnByb3BfRHNQYWNrZXRTcGVjX2NvZGWsAhpwcm9wX0RzUGFja2V0U3BlY19yZXNwb25zZa0CGW1ldGhYX0RzUGFja2V0U3BlY19lbmNvZGWuAhJkZXZzX3BhY2tldF9kZWNvZGWvAhVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWSwAhREc1JlZ2lzdGVyX3JlYWRfY29udLECEmRldnNfcGFja2V0X2VuY29kZbICFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGWzAhZwcm9wX0RzUGFja2V0SW5mb19yb2xltAIWcHJvcF9Ec1BhY2tldEluZm9fbmFtZbUCFnByb3BfRHNQYWNrZXRJbmZvX2NvZGW2AhhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1+3AhNwcm9wX0RzUm9sZV9pc0JvdW5kuAIQcHJvcF9Ec1JvbGVfc3BlY7kCGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZLoCInByb3BfRHNTZXJ2aWNlU3BlY19jbGFzc0lkZW50aWZpZXK7Ahdwcm9wX0RzU2VydmljZVNwZWNfbmFtZbwCGm1ldGgxX0RzU2VydmljZVNwZWNfbG9va3VwvQIabWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ26+Ah1mdW4yX0RldmljZVNjcmlwdF9fc29ja2V0T3Blbr8CEHRjcHNvY2tfb25fZXZlbnTAAh5mdW4wX0RldmljZVNjcmlwdF9fc29ja2V0Q2xvc2XBAh5mdW4xX0RldmljZVNjcmlwdF9fc29ja2V0V3JpdGXCAhJwcm9wX1N0cmluZ19sZW5ndGjDAhZwcm9wX1N0cmluZ19ieXRlTGVuZ3RoxAIXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTFAhNtZXRoMV9TdHJpbmdfY2hhckF0xgISbWV0aDJfU3RyaW5nX3NsaWNlxwIYZnVuWF9TdHJpbmdfZnJvbUNoYXJDb2RlyAIUbWV0aDNfU3RyaW5nX2luZGV4T2bJAhhtZXRoMF9TdHJpbmdfdG9Mb3dlckNhc2XKAhNtZXRoMF9TdHJpbmdfdG9DYXNlywIYbWV0aDBfU3RyaW5nX3RvVXBwZXJDYXNlzAIMZGV2c19pbnNwZWN0zQILaW5zcGVjdF9vYmrOAgdhZGRfc3RyzwINaW5zcGVjdF9maWVsZNACFGRldnNfamRfZ2V0X3JlZ2lzdGVy0QIWZGV2c19qZF9jbGVhcl9wa3Rfa2luZNICEGRldnNfamRfc2VuZF9jbWTTAhBkZXZzX2pkX3NlbmRfcmF31AITZGV2c19qZF9zZW5kX2xvZ21zZ9UCE2RldnNfamRfcGt0X2NhcHR1cmXWAhFkZXZzX2pkX3dha2Vfcm9sZdcCEmRldnNfamRfc2hvdWxkX3J1btgCE2RldnNfamRfcHJvY2Vzc19wa3TZAhhkZXZzX2pkX3NlcnZlcl9kZXZpY2VfaWTaAhdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdsCEmRldnNfamRfYWZ0ZXJfdXNlctwCFGRldnNfamRfcm9sZV9jaGFuZ2Vk3QIUZGV2c19qZF9yZXNldF9wYWNrZXTeAhJkZXZzX2pkX2luaXRfcm9sZXPfAhJkZXZzX2pkX2ZyZWVfcm9sZXPgAhJkZXZzX2pkX2FsbG9jX3JvbGXhAhVkZXZzX3NldF9nbG9iYWxfZmxhZ3PiAhdkZXZzX3Jlc2V0X2dsb2JhbF9mbGFnc+MCFWRldnNfZ2V0X2dsb2JhbF9mbGFnc+QCD2pkX25lZWRfdG9fc2VuZOUCEGRldnNfanNvbl9lc2NhcGXmAhVkZXZzX2pzb25fZXNjYXBlX2NvcmXnAg9kZXZzX2pzb25fcGFyc2XoAgpqc29uX3ZhbHVl6QIMcGFyc2Vfc3RyaW5n6gITZGV2c19qc29uX3N0cmluZ2lmeesCDXN0cmluZ2lmeV9vYmrsAhFwYXJzZV9zdHJpbmdfY29yZe0CCmFkZF9pbmRlbnTuAg9zdHJpbmdpZnlfZmllbGTvAhFkZXZzX21hcGxpa2VfaXRlcvACF2RldnNfZ2V0X2J1aWx0aW5fb2JqZWN08QISZGV2c19tYXBfY29weV9pbnRv8gIMZGV2c19tYXBfc2V08wIGbG9va3Vw9AITZGV2c19tYXBsaWtlX2lzX21hcPUCG2RldnNfbWFwbGlrZV9rZXlzX29yX3ZhbHVlc/YCEWRldnNfYXJyYXlfaW5zZXJ09wIIa3ZfYWRkLjH4AhJkZXZzX3Nob3J0X21hcF9zZXT5Ag9kZXZzX21hcF9kZWxldGX6AhJkZXZzX3Nob3J0X21hcF9nZXT7AiBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjX2lkePwCHGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWP9AhtkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWP+Ah5kZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY19pZHj/AhpkZXZzX3ZhbHVlX3RvX3NlcnZpY2Vfc3BlY4ADF2RldnNfZGVjb2RlX3JvbGVfcGFja2V0gQMYZGV2c19yb2xlX3NwZWNfZm9yX2NsYXNzggMXZGV2c19wYWNrZXRfc3BlY19wYXJlbnSDAw5kZXZzX3JvbGVfc3BlY4QDEWRldnNfcm9sZV9zZXJ2aWNlhQMOZGV2c19yb2xlX25hbWWGAxJkZXZzX2dldF9iYXNlX3NwZWOHAxBkZXZzX3NwZWNfbG9va3VwiAMSZGV2c19mdW5jdGlvbl9iaW5kiQMRZGV2c19tYWtlX2Nsb3N1cmWKAw5kZXZzX2dldF9mbmlkeIsDE2RldnNfZ2V0X2ZuaWR4X2NvcmWMAxhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWSNAxhkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmSOAxNkZXZzX2dldF9zcGVjX3Byb3RvjwMTZGV2c19nZXRfcm9sZV9wcm90b5ADG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd5EDFWRldnNfZ2V0X3N0YXRpY19wcm90b5IDG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yb5MDHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVtlAMWZGV2c19tYXBsaWtlX2dldF9wcm90b5UDGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZJYDHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZJcDEGRldnNfaW5zdGFuY2Vfb2aYAw9kZXZzX29iamVjdF9nZXSZAwxkZXZzX3NlcV9nZXSaAwxkZXZzX2FueV9nZXSbAwxkZXZzX2FueV9zZXScAwxkZXZzX3NlcV9zZXSdAw5kZXZzX2FycmF5X3NldJ4DE2RldnNfYXJyYXlfcGluX3B1c2ifAxFkZXZzX2FyZ19pbnRfZGVmbKADDGRldnNfYXJnX2ludKEDDWRldnNfYXJnX2Jvb2yiAw9kZXZzX2FyZ19kb3VibGWjAw9kZXZzX3JldF9kb3VibGWkAwxkZXZzX3JldF9pbnSlAw1kZXZzX3JldF9ib29spgMPZGV2c19yZXRfZ2NfcHRypwMRZGV2c19hcmdfc2VsZl9tYXCoAxFkZXZzX3NldHVwX3Jlc3VtZakDD2RldnNfY2FuX2F0dGFjaKoDGWRldnNfYnVpbHRpbl9vYmplY3RfdmFsdWWrAxVkZXZzX21hcGxpa2VfdG9fdmFsdWWsAxJkZXZzX3JlZ2NhY2hlX2ZyZWWtAxZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsrgMXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWSvAxNkZXZzX3JlZ2NhY2hlX2FsbG9jsAMUZGV2c19yZWdjYWNoZV9sb29rdXCxAxFkZXZzX3JlZ2NhY2hlX2FnZbIDF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlswMSZGV2c19yZWdjYWNoZV9uZXh0tAMPamRfc2V0dGluZ3NfZ2V0tQMPamRfc2V0dGluZ3Nfc2V0tgMOZGV2c19sb2dfdmFsdWW3Aw9kZXZzX3Nob3dfdmFsdWW4AxBkZXZzX3Nob3dfdmFsdWUwuQMNY29uc3VtZV9jaHVua7oDDXNoYV8yNTZfY2xvc2W7Aw9qZF9zaGEyNTZfc2V0dXC8AxBqZF9zaGEyNTZfdXBkYXRlvQMQamRfc2hhMjU2X2ZpbmlzaL4DFGpkX3NoYTI1Nl9obWFjX3NldHVwvwMVamRfc2hhMjU2X2htYWNfdXBkYXRlwAMVamRfc2hhMjU2X2htYWNfZmluaXNowQMOamRfc2hhMjU2X2hrZGbCAw5kZXZzX3N0cmZvcm1hdMMDDmRldnNfaXNfc3RyaW5nxAMOZGV2c19pc19udW1iZXLFAxtkZXZzX3N0cmluZ19nZXRfdXRmOF9zdHJ1Y3TGAxRkZXZzX3N0cmluZ19nZXRfdXRmOMcDE2RldnNfYnVpbHRpbl9zdHJpbmfIAxRkZXZzX3N0cmluZ192c3ByaW50ZskDE2RldnNfc3RyaW5nX3NwcmludGbKAxVkZXZzX3N0cmluZ19mcm9tX3V0ZjjLAxRkZXZzX3ZhbHVlX3RvX3N0cmluZ8wDEGJ1ZmZlcl90b19zdHJpbmfNAxlkZXZzX21hcF9zZXRfc3RyaW5nX2ZpZWxkzgMSZGV2c19zdHJpbmdfY29uY2F0zwMRZGV2c19zdHJpbmdfc2xpY2XQAxJkZXZzX3B1c2hfdHJ5ZnJhbWXRAxFkZXZzX3BvcF90cnlmcmFtZdIDD2RldnNfZHVtcF9zdGFja9MDE2RldnNfZHVtcF9leGNlcHRpb27UAwpkZXZzX3Rocm931QMSZGV2c19wcm9jZXNzX3Rocm931gMQZGV2c19hbGxvY19lcnJvctcDFWRldnNfdGhyb3dfdHlwZV9lcnJvctgDGGRldnNfdGhyb3dfZ2VuZXJpY19lcnJvctkDFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3LaAx5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3LbAxpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvctwDHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dN0DGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvct4DF2RldnNfdGhyb3dfc3ludGF4X2Vycm9y3wMRZGV2c19zdHJpbmdfaW5kZXjgAxJkZXZzX3N0cmluZ19sZW5ndGjhAxlkZXZzX3V0ZjhfZnJvbV9jb2RlX3BvaW504gMbZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3Ro4wMUZGV2c191dGY4X2NvZGVfcG9pbnTkAxRkZXZzX3N0cmluZ19qbXBfaW5pdOUDDmRldnNfdXRmOF9pbml05gMWZGV2c192YWx1ZV9mcm9tX2RvdWJsZecDE2RldnNfdmFsdWVfZnJvbV9pbnToAxRkZXZzX3ZhbHVlX2Zyb21fYm9vbOkDF2RldnNfdmFsdWVfZnJvbV9wb2ludGVy6gMUZGV2c192YWx1ZV90b19kb3VibGXrAxFkZXZzX3ZhbHVlX3RvX2ludOwDEmRldnNfdmFsdWVfdG9fYm9vbO0DDmRldnNfaXNfYnVmZmVy7gMXZGV2c19idWZmZXJfaXNfd3JpdGFibGXvAxBkZXZzX2J1ZmZlcl9kYXRh8AMTZGV2c19idWZmZXJpc2hfZGF0YfEDFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq8gMNZGV2c19pc19hcnJhefMDEWRldnNfdmFsdWVfdHlwZW9m9AMPZGV2c19pc19udWxsaXNo9QMZZGV2c19pc19udWxsX29yX3VuZGVmaW5lZPYDFGRldnNfdmFsdWVfYXBwcm94X2Vx9wMSZGV2c192YWx1ZV9pZWVlX2Vx+AMNZGV2c192YWx1ZV9lcfkDHGRldnNfdmFsdWVfZXFfYnVpbHRpbl9zdHJpbmf6Ax5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGP7AxJkZXZzX2ltZ19zdHJpZHhfb2v8AxJkZXZzX2R1bXBfdmVyc2lvbnP9AwtkZXZzX3Zlcmlmef4DEWRldnNfZmV0Y2hfb3Bjb2Rl/wMOZGV2c192bV9yZXN1bWWABBFkZXZzX3ZtX3NldF9kZWJ1Z4EEGWRldnNfdm1fY2xlYXJfYnJlYWtwb2ludHOCBBhkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnSDBAxkZXZzX3ZtX2hhbHSEBA9kZXZzX3ZtX3N1c3BlbmSFBBZkZXZzX3ZtX3NldF9icmVha3BvaW50hgQUZGV2c192bV9leGVjX29wY29kZXOHBA9kZXZzX2luX3ZtX2xvb3CIBBpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeIkEF2RldnNfaW1nX2dldF9zdHJpbmdfam1wigQRZGV2c19pbWdfZ2V0X3V0ZjiLBBRkZXZzX2dldF9zdGF0aWNfdXRmOIwEFGRldnNfdmFsdWVfYnVmZmVyaXNojQQMZXhwcl9pbnZhbGlkjgQUZXhwcnhfYnVpbHRpbl9vYmplY3SPBAtzdG10MV9jYWxsMJAEC3N0bXQyX2NhbGwxkQQLc3RtdDNfY2FsbDKSBAtzdG10NF9jYWxsM5MEC3N0bXQ1X2NhbGw0lAQLc3RtdDZfY2FsbDWVBAtzdG10N19jYWxsNpYEC3N0bXQ4X2NhbGw3lwQLc3RtdDlfY2FsbDiYBBJzdG10Ml9pbmRleF9kZWxldGWZBAxzdG10MV9yZXR1cm6aBAlzdG10eF9qbXCbBAxzdG10eDFfam1wX3qcBApleHByMl9iaW5knQQSZXhwcnhfb2JqZWN0X2ZpZWxkngQSc3RtdHgxX3N0b3JlX2xvY2FsnwQTc3RtdHgxX3N0b3JlX2dsb2JhbKAEEnN0bXQ0X3N0b3JlX2J1ZmZlcqEECWV4cHIwX2luZqIEEGV4cHJ4X2xvYWRfbG9jYWyjBBFleHByeF9sb2FkX2dsb2JhbKQEC2V4cHIxX3VwbHVzpQQLZXhwcjJfaW5kZXimBA9zdG10M19pbmRleF9zZXSnBBRleHByeDFfYnVpbHRpbl9maWVsZKgEEmV4cHJ4MV9hc2NpaV9maWVsZKkEEWV4cHJ4MV91dGY4X2ZpZWxkqgQQZXhwcnhfbWF0aF9maWVsZKsEDmV4cHJ4X2RzX2ZpZWxkrAQPc3RtdDBfYWxsb2NfbWFwrQQRc3RtdDFfYWxsb2NfYXJyYXmuBBJzdG10MV9hbGxvY19idWZmZXKvBBdleHByeF9zdGF0aWNfc3BlY19wcm90b7AEE2V4cHJ4X3N0YXRpY19idWZmZXKxBBtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmeyBBlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nswQYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5ntAQVZXhwcnhfc3RhdGljX2Z1bmN0aW9utQQNZXhwcnhfbGl0ZXJhbLYEEWV4cHJ4X2xpdGVyYWxfZjY0twQRZXhwcjNfbG9hZF9idWZmZXK4BA1leHByMF9yZXRfdmFsuQQMZXhwcjFfdHlwZW9mugQPZXhwcjBfdW5kZWZpbmVkuwQSZXhwcjFfaXNfdW5kZWZpbmVkvAQKZXhwcjBfdHJ1Zb0EC2V4cHIwX2ZhbHNlvgQNZXhwcjFfdG9fYm9vbL8ECWV4cHIwX25hbsAECWV4cHIxX2Fic8EEDWV4cHIxX2JpdF9ub3TCBAxleHByMV9pc19uYW7DBAlleHByMV9uZWfEBAlleHByMV9ub3TFBAxleHByMV90b19pbnTGBAlleHByMl9hZGTHBAlleHByMl9zdWLIBAlleHByMl9tdWzJBAlleHByMl9kaXbKBA1leHByMl9iaXRfYW5kywQMZXhwcjJfYml0X29yzAQNZXhwcjJfYml0X3hvcs0EEGV4cHIyX3NoaWZ0X2xlZnTOBBFleHByMl9zaGlmdF9yaWdodM8EGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk0AQIZXhwcjJfZXHRBAhleHByMl9sZdIECGV4cHIyX2x00wQIZXhwcjJfbmXUBBBleHByMV9pc19udWxsaXNo1QQUc3RtdHgyX3N0b3JlX2Nsb3N1cmXWBBNleHByeDFfbG9hZF9jbG9zdXJl1wQSZXhwcnhfbWFrZV9jbG9zdXJl2AQQZXhwcjFfdHlwZW9mX3N0ctkEE3N0bXR4X2ptcF9yZXRfdmFsX3raBBBzdG10Ml9jYWxsX2FycmF52wQJc3RtdHhfdHJ53AQNc3RtdHhfZW5kX3Ryed0EC3N0bXQwX2NhdGNo3gQNc3RtdDBfZmluYWxsed8EC3N0bXQxX3Rocm934AQOc3RtdDFfcmVfdGhyb3fhBBBzdG10eDFfdGhyb3dfam1w4gQOc3RtdDBfZGVidWdnZXLjBAlleHByMV9uZXfkBBFleHByMl9pbnN0YW5jZV9vZuUECmV4cHIwX251bGzmBA9leHByMl9hcHByb3hfZXHnBA9leHByMl9hcHByb3hfbmXoBBNzdG10MV9zdG9yZV9yZXRfdmFs6QQRZXhwcnhfc3RhdGljX3NwZWPqBA9kZXZzX3ZtX3BvcF9hcmfrBBNkZXZzX3ZtX3BvcF9hcmdfdTMy7AQTZGV2c192bV9wb3BfYXJnX2kzMu0EFmRldnNfdm1fcG9wX2FyZ19idWZmZXLuBBJqZF9hZXNfY2NtX2VuY3J5cHTvBBJqZF9hZXNfY2NtX2RlY3J5cHTwBAxBRVNfaW5pdF9jdHjxBA9BRVNfRUNCX2VuY3J5cHTyBBBqZF9hZXNfc2V0dXBfa2V58wQOamRfYWVzX2VuY3J5cHT0BBBqZF9hZXNfY2xlYXJfa2V59QQOamRfd2Vic29ja19uZXf2BBdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZfcEDHNlbmRfbWVzc2FnZfgEE2pkX3RjcHNvY2tfb25fZXZlbnT5BAdvbl9kYXRh+gQLcmFpc2VfZXJyb3L7BAlzaGlmdF9tc2f8BBBqZF93ZWJzb2NrX2Nsb3Nl/QQLamRfd3Nza19uZXf+BBRqZF93c3NrX3NlbmRfbWVzc2FnZf8EE2pkX3dlYnNvY2tfb25fZXZlbnSABQdkZWNyeXB0gQUNamRfd3Nza19jbG9zZYIFEGpkX3dzc2tfb25fZXZlbnSDBQtyZXNwX3N0YXR1c4QFEndzc2toZWFsdGhfcHJvY2Vzc4UFFHdzc2toZWFsdGhfcmVjb25uZWN0hgUYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0hwUPc2V0X2Nvbm5fc3RyaW5niAURY2xlYXJfY29ubl9zdHJpbmeJBQ93c3NraGVhbHRoX2luaXSKBRF3c3NrX3NlbmRfbWVzc2FnZYsFEXdzc2tfaXNfY29ubmVjdGVkjAUUd3Nza190cmFja19leGNlcHRpb26NBRJ3c3NrX3NlcnZpY2VfcXVlcnmOBRxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpljwUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZZAFD3JvbGVtZ3JfcHJvY2Vzc5EFEHJvbGVtZ3JfYXV0b2JpbmSSBRVyb2xlbWdyX2hhbmRsZV9wYWNrZXSTBRRqZF9yb2xlX21hbmFnZXJfaW5pdJQFGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZJUFEWpkX3JvbGVfc2V0X2hpbnRzlgUNamRfcm9sZV9hbGxvY5cFEGpkX3JvbGVfZnJlZV9hbGyYBRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kmQUTamRfY2xpZW50X2xvZ19ldmVudJoFE2pkX2NsaWVudF9zdWJzY3JpYmWbBRRqZF9jbGllbnRfZW1pdF9ldmVudJwFFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VknQUQamRfZGV2aWNlX2xvb2t1cJ4FGGpkX2RldmljZV9sb29rdXBfc2VydmljZZ8FE2pkX3NlcnZpY2Vfc2VuZF9jbWSgBRFqZF9jbGllbnRfcHJvY2Vzc6EFDmpkX2RldmljZV9mcmVlogUXamRfY2xpZW50X2hhbmRsZV9wYWNrZXSjBQ9qZF9kZXZpY2VfYWxsb2OkBRBzZXR0aW5nc19wcm9jZXNzpQUWc2V0dGluZ3NfaGFuZGxlX3BhY2tldKYFDXNldHRpbmdzX2luaXSnBQ50YXJnZXRfc3RhbmRieagFD2pkX2N0cmxfcHJvY2Vzc6kFFWpkX2N0cmxfaGFuZGxlX3BhY2tldKoFDGpkX2N0cmxfaW5pdKsFFGRjZmdfc2V0X3VzZXJfY29uZmlnrAUJZGNmZ19pbml0rQUNZGNmZ192YWxpZGF0Za4FDmRjZmdfZ2V0X2VudHJ5rwUTZGNmZ19nZXRfbmV4dF9lbnRyebAFDGRjZmdfZ2V0X2kzMrEFDGRjZmdfZ2V0X3BpbrIFD2RjZmdfZ2V0X3N0cmluZ7MFDGRjZmdfaWR4X2tlebQFDGRjZmdfZ2V0X3UzMrUFCWpkX3ZkbWVzZ7YFEWpkX2RtZXNnX3N0YXJ0cHRytwUNamRfZG1lc2dfcmVhZLgFEmpkX2RtZXNnX3JlYWRfbGluZbkFE2pkX3NldHRpbmdzX2dldF9iaW66BQpmaW5kX2VudHJ5uwUPcmVjb21wdXRlX2NhY2hlvAUTamRfc2V0dGluZ3Nfc2V0X2Jpbr0FC2pkX2ZzdG9yX2djvgUVamRfc2V0dGluZ3NfZ2V0X2xhcmdlvwUWamRfc2V0dGluZ3NfcHJlcF9sYXJnZcAFCm1hcmtfbGFyZ2XBBRdqZF9zZXR0aW5nc193cml0ZV9sYXJnZcIFFmpkX3NldHRpbmdzX3N5bmNfbGFyZ2XDBRBqZF9zZXRfbWF4X3NsZWVwxAUNamRfaXBpcGVfb3BlbsUFFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTGBQ5qZF9pcGlwZV9jbG9zZccFEmpkX251bWZtdF9pc192YWxpZMgFFWpkX251bWZtdF93cml0ZV9mbG9hdMkFE2pkX251bWZtdF93cml0ZV9pMzLKBRJqZF9udW1mbXRfcmVhZF9pMzLLBRRqZF9udW1mbXRfcmVhZF9mbG9hdMwFEWpkX29waXBlX29wZW5fY21kzQUUamRfb3BpcGVfb3Blbl9yZXBvcnTOBRZqZF9vcGlwZV9oYW5kbGVfcGFja2V0zwURamRfb3BpcGVfd3JpdGVfZXjQBRBqZF9vcGlwZV9wcm9jZXNz0QUUamRfb3BpcGVfY2hlY2tfc3BhY2XSBQ5qZF9vcGlwZV93cml0ZdMFDmpkX29waXBlX2Nsb3Nl1AUNamRfcXVldWVfcHVzaNUFDmpkX3F1ZXVlX2Zyb2501gUOamRfcXVldWVfc2hpZnTXBQ5qZF9xdWV1ZV9hbGxvY9gFDWpkX3Jlc3BvbmRfdTjZBQ5qZF9yZXNwb25kX3UxNtoFDmpkX3Jlc3BvbmRfdTMy2wURamRfcmVzcG9uZF9zdHJpbmfcBRdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZN0FC2pkX3NlbmRfcGt03gUdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzfBRdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcuAFGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXThBRRqZF9hcHBfaGFuZGxlX3BhY2tldOIFFWpkX2FwcF9oYW5kbGVfY29tbWFuZOMFFWFwcF9nZXRfaW5zdGFuY2VfbmFtZeQFE2pkX2FsbG9jYXRlX3NlcnZpY2XlBRBqZF9zZXJ2aWNlc19pbml05gUOamRfcmVmcmVzaF9ub3fnBRlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk6AUUamRfc2VydmljZXNfYW5ub3VuY2XpBRdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZeoFEGpkX3NlcnZpY2VzX3RpY2vrBRVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfsBRpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZe0FFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXuBRRhcHBfZ2V0X2RldmljZV9jbGFzc+8FEmFwcF9nZXRfZndfdmVyc2lvbvAFDWpkX3NydmNmZ19ydW7xBRdqZF9zcnZjZmdfaW5zdGFuY2VfbmFtZfIFEWpkX3NydmNmZ192YXJpYW508wUNamRfaGFzaF9mbnYxYfQFDGpkX2RldmljZV9pZPUFCWpkX3JhbmRvbfYFCGpkX2NyYzE29wUOamRfY29tcHV0ZV9jcmP4BQ5qZF9zaGlmdF9mcmFtZfkFDGpkX3dvcmRfbW92ZfoFDmpkX3Jlc2V0X2ZyYW1l+wUQamRfcHVzaF9pbl9mcmFtZfwFDWpkX3BhbmljX2NvcmX9BRNqZF9zaG91bGRfc2FtcGxlX21z/gUQamRfc2hvdWxkX3NhbXBsZf8FCWpkX3RvX2hleIAGC2pkX2Zyb21faGV4gQYOamRfYXNzZXJ0X2ZhaWyCBgdqZF9hdG9pgwYPamRfdnNwcmludGZfZXh0hAYPamRfcHJpbnRfZG91YmxlhQYLamRfdnNwcmludGaGBgpqZF9zcHJpbnRmhwYSamRfZGV2aWNlX3Nob3J0X2lkiAYMamRfc3ByaW50Zl9hiQYLamRfdG9faGV4X2GKBglqZF9zdHJkdXCLBglqZF9tZW1kdXCMBgxqZF9lbmRzX3dpdGiNBg5qZF9zdGFydHNfd2l0aI4GFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWPBhZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlkAYRamRfc2VuZF9ldmVudF9leHSRBgpqZF9yeF9pbml0kgYdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uTBg9qZF9yeF9nZXRfZnJhbWWUBhNqZF9yeF9yZWxlYXNlX2ZyYW1llQYRamRfc2VuZF9mcmFtZV9yYXeWBg1qZF9zZW5kX2ZyYW1llwYKamRfdHhfaW5pdJgGB2pkX3NlbmSZBg9qZF90eF9nZXRfZnJhbWWaBhBqZF90eF9mcmFtZV9zZW50mwYLamRfdHhfZmx1c2icBhBfX2Vycm5vX2xvY2F0aW9unQYMX19mcGNsYXNzaWZ5ngYFZHVtbXmfBghfX21lbWNweaAGB21lbW1vdmWhBgZtZW1zZXSiBgpfX2xvY2tmaWxlowYMX191bmxvY2tmaWxlpAYGZmZsdXNopQYEZm1vZKYGDV9fRE9VQkxFX0JJVFOnBgxfX3N0ZGlvX3NlZWuoBg1fX3N0ZGlvX3dyaXRlqQYNX19zdGRpb19jbG9zZaoGCF9fdG9yZWFkqwYJX190b3dyaXRlrAYJX19md3JpdGV4rQYGZndyaXRlrgYUX19wdGhyZWFkX211dGV4X2xvY2uvBhZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrsAYGX19sb2NrsQYIX191bmxvY2uyBg5fX21hdGhfZGl2emVyb7MGCmZwX2JhcnJpZXK0Bg5fX21hdGhfaW52YWxpZLUGA2xvZ7YGBXRvcDE2twYFbG9nMTC4BgdfX2xzZWVruQYGbWVtY21wugYKX19vZmxfbG9ja7sGDF9fb2ZsX3VubG9ja7wGDF9fbWF0aF94Zmxvd70GDGZwX2JhcnJpZXIuMb4GDF9fbWF0aF9vZmxvd78GDF9fbWF0aF91Zmxvd8AGBGZhYnPBBgNwb3fCBgV0b3AxMsMGCnplcm9pbmZuYW7EBghjaGVja2ludMUGDGZwX2JhcnJpZXIuMsYGCmxvZ19pbmxpbmXHBgpleHBfaW5saW5lyAYLc3BlY2lhbGNhc2XJBg1mcF9mb3JjZV9ldmFsygYFcm91bmTLBgZzdHJjaHLMBgtfX3N0cmNocm51bM0GBnN0cmNtcM4GBnN0cmxlbs8GBm1lbWNoctAGBnN0cnN0ctEGDnR3b2J5dGVfc3Ryc3Ry0gYQdGhyZWVieXRlX3N0cnN0ctMGD2ZvdXJieXRlX3N0cnN0ctQGDXR3b3dheV9zdHJzdHLVBgdfX3VmbG931gYHX19zaGxpbdcGCF9fc2hnZXRj2AYHaXNzcGFjZdkGBnNjYWxibtoGCWNvcHlzaWdubNsGB3NjYWxibmzcBg1fX2ZwY2xhc3NpZnls3QYFZm1vZGzeBgVmYWJzbN8GC19fZmxvYXRzY2Fu4AYIaGV4ZmxvYXThBghkZWNmbG9hdOIGB3NjYW5leHDjBgZzdHJ0b3jkBgZzdHJ0b2TlBhJfX3dhc2lfc3lzY2FsbF9yZXTmBghkbG1hbGxvY+cGBmRsZnJlZegGGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZekGBHNicmvqBghfX2FkZHRmM+sGCV9fYXNobHRpM+wGB19fbGV0ZjLtBgdfX2dldGYy7gYIX19kaXZ0ZjPvBg1fX2V4dGVuZGRmdGYy8AYNX19leHRlbmRzZnRmMvEGC19fZmxvYXRzaXRm8gYNX19mbG9hdHVuc2l0ZvMGDV9fZmVfZ2V0cm91bmT0BhJfX2ZlX3JhaXNlX2luZXhhY3T1BglfX2xzaHJ0aTP2BghfX211bHRmM/cGCF9fbXVsdGkz+AYJX19wb3dpZGYy+QYIX19zdWJ0ZjP6BgxfX3RydW5jdGZkZjL7BgtzZXRUZW1wUmV0MPwGC2dldFRlbXBSZXQw/QYJc3RhY2tTYXZl/gYMc3RhY2tSZXN0b3Jl/wYKc3RhY2tBbGxvY4AHHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnSBBxVlbXNjcmlwdGVuX3N0YWNrX2luaXSCBxllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlgwcZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZYQHGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZIUHDGR5bkNhbGxfamlqaYYHFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammHBxhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGFBwQABGZwdHIBATACATEDATIHNwQAD19fc3RhY2tfcG9pbnRlcgEIdGVtcFJldDACC19fc3RhY2tfZW5kAwxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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

var ___start_em_js = Module['___start_em_js'] = 30680;
var ___stop_em_js = Module['___stop_em_js'] = 32165;



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
