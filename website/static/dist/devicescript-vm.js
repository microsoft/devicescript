
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABtYKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/f39/fwBgBX9/f39/AX9gBX9+fn5+AGAGf39/f39/AGAAAX5gAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gBn9/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C/IOAgAAVA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX3NpemUACANlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA/OGgIAA8QYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAPBw8ABwcDBQIHBwMDBwgBAgcHBA4LDAYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMHBQcGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAAAAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQEAAAAAAAEBAAcBAQEAAQEBAQAAAQUAABIAAAAJAAYAAAABDAAAABIDDg4AAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAAAwEBAQEBAQEBAQEBAQEBAQYBAwAAAQEBAQALAAICAAEBAQABAQABAQAAAAEAAAEBAAAAAAAAAgAFAgIFCwABAAEBAQQBDwYAAgAAAAYAAAgEAwkLAgILAgMABQkDAQUGAwUJBQUGBQEBAQMDBgMDAwMDAwUFBQkMBgUDAwMGAwMDAwUGBQUFBQUFAQYDAxATAgICBAEDAQECAAMJCQECCQQDAQMDAgQHAgACAgAeHwMEAwYCBQUFAQEFBQsBAwICAQALBQUFAQUFAQUGAwMEBAMMEwICBRADAwMDBgYDAwMEBAYGBgYBAwADAwQCAAMAAgYABAQDBgYFAQECAgICAgICAgICAgICAQECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgEBAQICAgICAgICAgIBAQEBAQIBAgQEAQ4gAgIAAAcJAwYBAgAABwkJAQMHAQIAAAIFAAcJCAAEBAQAAAIHABQDBwcBAgEAFQMJBwAABAACBwAAAgcEBwQEAwMEAwYDAggGBgYEBwYHAwMCBggABgAABCEBAxADAwAJBwMGBAMEAAQDAwMDBAQGBgAAAAQEBwcHBwQHBwcICAgHBAQDDwgDAAQBAAkBAwMBAwUEDCIJCRQDAwQDAwMHBwUHBAgABAQHCQgABwgWBAYGBgQABBkjEQYEBAQGCQQEAAAXCgoKFgoRBggHJAoXFwoZFhUVCiUmJygKAwMDBAYDAwMDAwQUBAQaDRgpDSoFDhIrBRAEBAAIBA0YGxsNEywCAggIGA0NGg0tAAgIAAQIBwgICC4MLwSHgICAAAFwAZMCkwIFhoCAgAABAYACgAIGh4GAgAAUfwFBkJcGC38BQQALfwFBAAt/AUEAC38AQZjvAQt/AEHo7wELfwBB1/ABC38AQaHyAQt/AEGd8wELfwBBmfQBC38AQYX1AQt/AEHV9QELfwBB9vUBC38AQfv3AQt/AEHx+AELfwBBwfkBC38AQY36AQt/AEG2+gELfwBBmO8BC38AQeX6AQsHx4eAgAAqBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABUGbWFsbG9jAOQGFl9fZW1fanNfX2VtX2ZsYXNoX3NpemUDBBZfX2VtX2pzX19lbV9mbGFzaF9zYXZlAwUWX19lbV9qc19fZW1fZmxhc2hfbG9hZAMGEF9fZXJybm9fbG9jYXRpb24AmgYZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABGZyZWUA5QYaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwArCmpkX2VtX2luaXQALA1qZF9lbV9wcm9jZXNzAC0UamRfZW1fZnJhbWVfcmVjZWl2ZWQALhFqZF9lbV9kZXZzX2RlcGxveQAvEWpkX2VtX2RldnNfdmVyaWZ5ADAYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADEbamRfZW1fZGV2c19lbmFibGVfZ2Nfc3RyZXNzADIWX19lbV9qc19fZW1fc2VuZF9mcmFtZQMHHF9fZW1fanNfX19kZXZzX3BhbmljX2hhbmRsZXIDCBxfX2VtX2pzX19lbV9zZW5kX2xhcmdlX2ZyYW1lAwkaX19lbV9qc19fZW1fZGVwbG95X2hhbmRsZXIDChRfX2VtX2pzX19lbV90aW1lX25vdwMLIF9fZW1fanNfX2VtX2pkX2NyeXB0b19nZXRfcmFuZG9tAwwXX19lbV9qc19fZW1fcHJpbnRfZG1lc2cDDRZqZF9lbV90Y3Bzb2NrX29uX2V2ZW50AEIYX19lbV9qc19fX2pkX3RjcHNvY2tfbmV3Aw4aX19lbV9qc19fX2pkX3RjcHNvY2tfd3JpdGUDDxpfX2VtX2pzX19famRfdGNwc29ja19jbG9zZQMQIV9fZW1fanNfX19qZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZQMRBmZmbHVzaACiBhVlbXNjcmlwdGVuX3N0YWNrX2luaXQA/wYZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQCABxllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlAIEHGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZACCBwlzdGFja1NhdmUA+wYMc3RhY2tSZXN0b3JlAPwGCnN0YWNrQWxsb2MA/QYcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudAD+Bg1fX3N0YXJ0X2VtX2pzAxIMX19zdG9wX2VtX2pzAxMMZHluQ2FsbF9qaWppAIQHCZ+EgIAAAQBBAQuSAik6U1RkWVtub3Nlba4CvQLNAuwC8AL1Ap8BoAGhAaIBowGkAaUBpgGnAagBqQGqAasBrAGtAa4BrwGwAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAdgB2QHaAdsB3AHdAd4B3wHgAeEB5AHlAecB6AHpAesB7QHuAe8B8gHzAfQB+QH6AfsB/AH9Af4B/wGAAoECggKDAoQChQKGAocCiAKJAosCjAKNAo8CkAKRApMClAKVApYClwKYApkCmgKbApwCnQKeAp8CoAKhAqMCpQKmAqcCqAKpAqoCqwKtArACsQKyArMCtAK1ArYCtwK4ArkCugK7ArwCvgK/AsACwQLCAsMCxALFAsYCxwLJAosEjASNBI4EjwSQBJEEkgSTBJQElQSWBJcEmASZBJoEmwScBJ0EngSfBKAEoQSiBKMEpASlBKYEpwSoBKkEqgSrBKwErQSuBK8EsASxBLIEswS0BLUEtgS3BLgEuQS6BLsEvAS9BL4EvwTABMEEwgTDBMQExQTGBMcEyATJBMoEywTMBM0EzgTPBNAE0QTSBNME1ATVBNYE1wTYBNkE2gTbBNwE3QTeBN8E4AThBOIE4wTkBOUE5gTnBIIFhAWIBYkFiwWKBY4FkAWiBaMFpgWnBY0GpwamBqUGCrPSjIAA8QYFABD/BgslAQF/AkBBACgC8PoBIgANAEHC1gBBwMoAQRlBsCEQ/wUACyAAC9wBAQJ/AkACQAJAAkBBACgC8PoBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgC9PoBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBoN4AQcDKAEEiQeEoEP8FAAsCQANAIAAgAyIDai0AAEH/AUcNASADQQFqIgQhAyAEIAJG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AyA3AwggASADQQhqIANBKGoQ7QNFDQAgACADKAIoEOUDDAELIABCADcDAAsgA0EwaiQAC/0CAgN/AX4jAEHwAGsiASQAIAEgAEHgAGopAwA3A1AgASAAKQNYIgQ3A0AgASAENwNgAkACQCAAIAFBwABqEOsDDQAgASABKQNgNwM4IAFB6ABqIABBEiABQThqENkDQQAhAgwBCyABIAEpA2A3AzAgACABQTBqIAFB3ABqEO0DIQILAkAgAiICRQ0AIAEgASkDUDcDKAJAIAAgAUEoakGWARD3A0UNAAJAIAAgASgCXEEBdBCVASIDRQ0AIANBBmogAiABKAJcEP0FCyAAIAMQpAMMAQsgASABKQNQNwMgAkACQCABQSBqEPMDDQAgASABKQNQNwMYIAAgAUEYakGXARD3Aw0AIAEgASkDUDcDECAAIAFBEGpBmAEQ9wNFDQELIAFByABqIAAgAiABKAJcEMgDIAAoAuwBIgBFDQEgACABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahC1AzYCACABQegAaiAAQe0bIAEQ1QMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1giBjcDGCABIAY3AyACQAJAIAAgAUEYahDsAw0AIAEgASkDIDcDECABQShqIABBqSAgAUEQahDaA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEO0DIQILAkAgAiIDRQ0AIABBABCeAyECIABBARCeAyEEIABBAhCeAyEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQnwYaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNYIgg3AzggASAINwNQAkACQCAAIAFBOGoQ7AMNACABIAEpA1A3AzAgAUHYAGogAEGpICABQTBqENoDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEO0DIQILAkAgAiIDRQ0AIABBABCeAyEEIAEgAEHoAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDBA0UNACABIAEpA0A3AwAgACABIAFB2ABqEMQDIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQ6wMNACABIAEpA1A3AxAgAUHYAGogAEESIAFB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IAIgASkDADcDCAJAAkAgAkEIahDzA0UNAEF/IQEMAQsCQAJAAkAgASgCBEEBag4CAAECCyABKAIAIgFBACABQQBKGyEBDAILIAEoAgBBwgBHDQBBfyEBDAELIAIgASkDADcDAEF/IQEgACACEOgDIgNEAADg////70FkDQBBACEBIANEAAAAAAAAAABjDQACQAJAIANEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQvzAQMCfwF+AXwjAEEgayIBJAAgASAAQeAAaikDACIDNwMQIAEgAzcDGAJAAkAgAUEQahDzA0UNAEF/IQIMAQsCQAJAAkAgASgCHEEBag4CAAECCyABKAIYIgJBACACQQBKGyECDAILIAEoAhhBwgBHDQBBfyECDAELIAEgASkDGDcDCEF/IQIgACABQQhqEOgDIgREAADg////70FkDQBBACECIAREAAAAAAAAAABjDQACQAJAIAREAAAAAAAA8EFjIAREAAAAAAAAAABmcUUNACAEqyECDAELQQAhAgsgAiECCyAAKALsASACEHggAUEgaiQAC/MBAwJ/AX4BfCMAQSBrIgEkACABIABB4ABqKQMAIgM3AxAgASADNwMYAkACQCABQRBqEPMDRQ0AQX8hAgwBCwJAAkACQCABKAIcQQFqDgIAAQILIAEoAhgiAkEAIAJBAEobIQIMAgsgASgCGEHCAEcNAEF/IQIMAQsgASABKQMYNwMIQX8hAiAAIAFBCGoQ6AMiBEQAAOD////vQWQNAEEAIQIgBEQAAAAAAAAAAGMNAAJAAkAgBEQAAAAAAADwQWMgBEQAAAAAAAAAAGZxRQ0AIASrIQIMAQtBACECCyACIQILIAAoAuwBIAIQeCABQSBqJAALRgEBfwJAIABBABCeAyIBQZGOwdUARw0AQeHrAEEAEDtB7ccAQSFBycQAEPoFAAsgAEHf1AMgASABQaCrfGpBoat8SRsQdgsFABA0AAsIACAAQQAQdgudAgIHfwF+IwBB8ABrIgEkAAJAIAAtAENBAkkNACABIABB4ABqKQMAIgg3A2ggASAINwMIIAAgAUEIaiABQeQAahDEAyICRQ0AIAAgAiABKAJkIAFBIGpBwAAgAEHoAGoiAyAALQBDQX5qIgQgAUEcahDAAyEFIAEgASgCHEF/aiIGNgIcAkAgACABQRBqIAVBf2oiByAGEJYBIgZFDQACQAJAIAdBPksNACAGIAFBIGogBxCdBhogByECDAELIAAgAiABKAJkIAYgBSADIAQgAUEcahDAAyECIAEgASgCHEF/ajYCHCACQX9qIQILIAAgAUEQaiACIAEoAhwQlwELIAAoAuwBIgBFDQAgACABKQMQNwMgCyABQfAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQngMhAiABIABB6ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEMkDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABENICIAFBIGokAAsOACAAIABBABCgAxChAwsPACAAIABBABCgA50QoQMLgAICAn8BfiMAQfAAayIBJAAgASAAQeAAaikDADcDaCABIABB6ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDyA0UNACABIAEpA2g3AxAgASAAIAFBEGoQtQM2AgBB4BogARA7DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEMkDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI4BIAEgASkDYDcDOCAAIAFBOGpBABDEAyECIAEgASkDaDcDMCABIAAgAUEwahC1AzYCJCABIAI2AiBBkhsgAUEgahA7IAEgASkDYDcDGCAAIAFBGGoQjwELIAFB8ABqJAALnwECAn8BfiMAQTBrIgEkACABIABB4ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEMkDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEMQDIgJFDQAgAiABQSBqELAFIgJFDQAgAUEYaiAAQQggACACIAEoAiAQmAEQ5wMgACgC7AEiAEUNACAAIAEpAxg3AyALIAFBMGokAAs7AQF/IwBBEGsiASQAIAFBCGogACkDgAK6EOQDAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBEGokAAuoAQIBfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiAjcDKCABIAI3AxACQAJAAkAgACABQRBqQY8BEPcDRQ0AEPIFIQIMAQsgASABKQMoNwMIIAAgAUEIakGbARD3A0UNARDXAiECCyABQQg2AgAgASAC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HBDlAwwBCyAAQgA3AwALIANBIGokAAusAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgAyADKQMQNwMIIANBGGogAUGLASADQQhqENkDQQAhAQwBCwJAIAEgAygCEBB8IgINACADQRhqIAFB5j1BABDXAwsgAiEBCwJAAkAgASIBRQ0AIAAgAS0AEEEPcUEERhDmAwwBCyAAQgA3AwALIANBIGokAAvFAQECfyMAQSBrIgEkACABIAApA1g3AxACQAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBAUYNAQsgASABKQMQNwMIIAFBGGogAEGLASABQQhqENkDQQAhAgwBCwJAIAAgASgCEBB8IgINACABQRhqIABB5j1BABDXAwsgAiECCwJAIAIiAkUNAAJAIAItABBBD3FBBEYNACABQRhqIABB2D9BABDXAwwBCyACIABB4ABqKQMANwMgIAJBARB3CyABQSBqJAALlAEBAn8jAEEgayIBJAAgASAAKQNYNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDZA0EAIQAMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQeY9QQAQ1wMLIAIhAAsCQCAAIgBFDQAgABB+CyABQSBqJAALWQIDfwF+IwBBEGsiASQAIAAoAuwBIQIgASAAQeAAaikDACIENwMAIAEgBDcDCCAAIAEQsQEhAyAAKALsASADEHggAiACLQAQQfABcUEEcjoAECABQRBqJAALIQACQCAAKALsASIARQ0AIAAgADUCHEKAgICAEIQ3AyALC2ABAn8jAEEQayIBJAACQAJAIAAtAEMiAg0AIAFBCGogAEHBLUEAENcDDAELIAAgAkF/akEBEH0iAkUNACAAKALsASIARQ0AIAAgAjUCHEKAgICAEIQ3AyALIAFBEGokAAvjAgIDfwF+IwBB8ABrIgMkACADIAIpAwA3A0ACQAJAAkAgASADQcAAaiADQegAaiADQeQAahCIAyIEQc+GA0sNACABKADkASIFIAUoAiBqIARBBHRqLQALQQJxDQELIAMgAikDADcDCCAAIAFB8yUgA0EIahDaAwwBCyAAIAEgASgC2AEg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DAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgASEBAkAgACgC7AEiAEUNACAAIAEpAwA3AyALIAJBMGokAAsJACAAQQAQigILnQECA38BfiMAQTBrIgEkACABIABB4ABqKQMANwMoIAEgAEHoAGopAwAiBDcDGCABIAQ3AyACQCABQRhqEPIDDQAgASABKQMoNwMQIAAgAUEQahCOAyECIAEgASkDIDcDCCAAIAFBCGoQkQMiA0UNACACRQ0AIAAgAiADEO8CCwJAIAAoAuwBIgBFDQAgACABKQMoNwMgCyABQTBqJAALCQAgAEEBEI4CC6EBAgN/AX4jAEEwayICJAAgAiAAQeAAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahCRAyIDRQ0AIABBABCSASIERQ0AIAJBIGogAEEIIAQQ5wMgAiACKQMgNwMQIAAgAkEQahCOASAAIAMgBCABEPMCIAIgAikDIDcDCCAAIAJBCGoQjwEgACgC7AEiAEUNACAAIAIpAyA3AyALIAJBMGokAAsJACAAQQAQjgIL6gECA38BfiMAQcAAayIBJAAgASAAQeAAaikDACIENwM4IAEgAEHoAGopAwA3AzAgASAENwMgAkACQCAAIAFBIGoQ7wMiAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQAJAIANBfGoOBgEAAAAAAQALIAEgASkDODcDCCABQShqIABB0gAgAUEIahDZAwwBCyABIAEpAzA3AxgCQCAAIAFBGGoQkQMiAw0AIAEgASkDMDcDECABQShqIABBNCABQRBqENkDDAELIAIgAzYCBCAAKALsASIARQ0AIAAgASkDODcDIAsgAUHAAGokAAtuAgJ/An4jAEEQayIBJAAgACkDWCEDIAEgAEHgAGopAwAiBDcDACABIAQ3AwggARDzAyECIAAoAuwBIQACQAJAAkAgAkUNACADIQQgAA0BDAILIABFDQEgASkDCCEECyAAIAQ3AyALIAFBEGokAAt1AQN/IwBBEGsiAiQAAkACQCABKAIEIgNBgIDA/wdxDQAgA0EPcUEIRw0AIAEoAgAiBEUNACAEIQMgBCgCAEGAgID4AHFBgICA2ABGDQELIAIgASkDADcDACACQQhqIABBLyACENkDQQAhAwsgAkEQaiQAIAMLvgEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAIvARIiAiABLwFMTw0AIAAgAjYCACAAQQI2AgQMAQsgAEIANwMACyADQSBqJAALsgEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQQg2AgAgAyACQQhqNgIEIAAgAUHCIyADEMcDCyADQSBqJAALuAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyADQRhqIAIpAwgQhQYgAyADQRhqNgIAIAAgAUHJHCADEMcDCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABUQ5QMLIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEBDlAwsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDZA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUEOUDCyADQSBqJAALogEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXEQ5gMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFEEBcUUQ5gMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAUEIIAIoAhwQ5wMLIANBIGokAAvLAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELAkACQCACLQAUQQFxRQ0AQQAhAQwBC0EAIQEgAi0AFUEwSw0AIAIvARBBD3YhAQsgACABEOYDCyADQSBqJAALyQEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENkDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAIAItABRBAXENACACLQAVQTBLDQAgAi4BEEF/Sg0AIAAgAi0AEBDlAwwBCyAAQgA3AwALIANBIGokAAupAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYDAAEYQ5gMLIANBIGokAAuoAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYAgRhDmAwsgA0EgaiQAC74BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDZA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLwEQIgJBDHZBf2pBAkkNACAAQgA3AwAMAQsgACACQf8fcRDlAwsgA0EgaiQAC6MBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDZA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLwEQQYAgSRDmAwsgA0EgaiQAC/gBAQd/AkAgAkH//wNHDQBBAA8LIAEhAwNAIAUhBAJAIAMiBg0AQQAPCyAGLwEIIgVBAEchAQJAAkACQCAFDQAgASEDDAELIAEhB0EAIQhBACEDAkACQCAAKADkASIBIAEoAmBqIAYvAQpBAnRqIgkvAQIgAkYNAANAIANBAWoiASAFRg0CIAEhAyAJIAFBA3RqLwECIAJHDQALIAEgBUkhByABIQgLIAchAyAJIAhBA3RqIQEMAgsgASAFSSEDCyAEIQELIAEhAQJAAkAgAyIJRQ0AIAYhAwwBCyAAIAYQhAMhAwsgAyEDIAEhBSABIQEgCUUNAAsgAQujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2QNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgASABIAIQpAIQ+wILIANBIGokAAvCAwEIfwJAIAENAEEADwsCQCAAIAEvARIQgQMiAg0AQQAPCyABLgEQIgNBgGBxIQQCQAJAAkAgAS0AFEEBcUUNAAJAIAQNACADIQQMAwsCQCAEQf//A3EiAUGAwABGDQAgAUGAIEcNAgsgA0H/H3FBgCByIQQMAgsCQCADQX9KDQAgA0H/AXFBgIB+ciEEDAILAkAgBEUNACAEQf//A3FBgCBHDQEgA0H/H3FBgCByIQQMAgsgA0GAwAByIQQMAQtB//8DIQQLQQAhAQJAIARB//8DcSIFQf//A0YNACACIQQDQCADIQYCQCAEIgcNAEEADwsgBy8BCCIDQQBHIQECQAJAAkAgAw0AIAEhBAwBCyABIQhBACEJQQAhBAJAAkAgACgA5AEiASABKAJgaiAHLwEKQQJ0aiICLwECIAVGDQADQCAEQQFqIgEgA0YNAiABIQQgAiABQQN0ai8BAiAFRw0ACyABIANJIQggASEJCyAIIQQgAiAJQQN0aiEBDAILIAEgA0khBAsgBiEBCyABIQECQAJAIAQiAkUNACAHIQQMAQsgACAHEIQDIQQLIAQhBCABIQMgASEBIAJFDQALCyABC74BAQN/IwBBIGsiASQAIAEgACkDWDcDEAJAAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACABKAIQIgNFDQAgAyECIAMoAgBBgICA+ABxQYCAgNgARg0BCyABIAEpAxA3AwAgAUEYaiAAQS8gARDZA0EAIQILAkAgACACIgIQpAIiA0UNACABQQhqIAAgAyACKAIcIgJBDGogAi8BBBCsAiAAKALsASIARQ0AIAAgASkDCDcDIAsgAUEgaiQAC/ABAgJ/AX4jAEEgayIBJAAgASAAKQNYNwMQAkAgASgCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACABKAIQIgJFDQAgAigCAEGAgID4AHFBgICA2ABHDQAgAEH4AmpBAEH8ARCfBhogAEGGA2pBAzsBACACKQMIIQMgAEGEA2pBBDoAACAAQfwCaiADNwIAIABBiANqIAIvARA7AQAgAEGKA2ogAi8BFjsBACABQQhqIAAgAi8BEhDTAgJAIAAoAuwBIgBFDQAgACABKQMINwMgCyABQSBqJAAPCyABIAEpAxA3AwAgAUEYaiAAQS8gARDZAwALoQECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqEP4CIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDZAwsCQAJAIAINACAAQgA3AwAMAQsCQCABIAIQgAMiAkF/Sg0AIABCADcDAAwBCyAAIAEgAhD5AgsgA0EwaiQAC48BAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahD+AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQ2QMLAkACQCACDQAgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBMGokAAuIAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQ/gIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENkDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQIQ5QMLIANBMGokAAv4AQIDfwF+IwBBMGsiAyQAIAMgAikDACIGNwMYIAMgBjcDEAJAAkAgASADQRBqIANBLGoQ/gIiBEUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENkDCwJAAkAgBA0AIABCADcDAAwBCwJAAkAgBC8BAkGA4ANxIgVFDQAgBUGAIEcNASAAIAIpAwA3AwAMAgsCQCABIAQQgAMiAkF/Sg0AIABCADcDAAwCCyAAIAEgASABKADkASIFIAUoAmBqIAJBBHRqIAQvAQJB/x9xQYDAAHIQogIQ+wIMAQsgAEIANwMACyADQTBqJAALlgICBH8BfiMAQTBrIgEkACABIAApA1giBTcDGCABIAU3AwgCQAJAIAAgAUEIaiABQSxqEP4CIgJFDQAgASgCLEH//wFGDQELIAEgASkDGDcDACABQSBqIABBnQEgARDZAwsCQCACRQ0AIAAgAhCAAyIDQQBIDQAgAEH4AmpBAEH8ARCfBhogAEGGA2ogAi8BAiIEQf8fcTsBACAAQfwCahDXAjcCAAJAAkAgBEGA4ANxIgRBgCBGDQAgBEGAgAJHDQFB4c0AQcgAQYo5EPoFAAsgACAALwGGA0GAIHI7AYYDCyAAIAIQrwIgAUEQaiAAIANBgIACahDTAiAAKALsASIARQ0AIAAgASkDEDcDIAsgAUEwaiQAC6MDAQR/IwBBMGsiBSQAIAUgAzYCLAJAAkAgAi0ABEEBcUUNAAJAIAFBABCSASIGDQAgAEIANwMADAILIAMgBGohByAAIAFBCCAGEOcDIAUgACkDADcDGCABIAVBGGoQjgFBACEDIAEoAOQBIgQgBCgCYGogAi8BBkECdGohAgNAIAIhAiADIQMCQAJAIAcgBSgCLCIIayIEQQBODQAgAyEDIAIhAkECIQQMAQsgBUEgaiABIAItAAIgBUEsaiAEEEgCQAJAAkAgBSkDIFANACAFIAUpAyA3AxAgASAGIAVBEGoQnAMgBSgCLCAIRg0AIAMhBAJAIAMNACACLQADQR50QR91IAJxIQQLIAQhAyACQQRqIQQCQAJAIAIvAQRFDQAgBCECDAELIAMhAiADDQBBACEDIAQhAgwCCyADIQMgAiECQQAhBAwCCyADIQMgAiECC0ECIQQLIAMhAyACIQIgBCEECyADIQMgAiECIARFDQALIAUgACkDADcDCCABIAVBCGoQjwEMAQsgACABIAIvAQYgBUEsaiAEEEgLIAVBMGokAAvdAQIDfwF+IwBBwABrIgEkACABIAApA1giBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEP4CIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQZMhIAFBEGoQ2gNBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQYYhIAFBCGoQ2gNBACEDCwJAIAMiA0UNACAAKALsASECIAAgASgCJCADLwECQfQDQQAQzgIgAkENIAMQpgMLIAFBwABqJAALRwEBfyMAQRBrIgIkACACQQhqIAAgASAAQYgDaiAAQYQDai0AABCsAgJAIAAoAuwBIgBFDQAgACACKQMINwMgCyACQRBqJAALwAQBCn8jAEEwayICJAAgAEHgAGohAwJAAkAgAC0AQ0F/aiIEQQFGDQAgAyEDIAQhBAwBCyACIAMpAwA3AyACQCAAIAJBIGoQ8AMNACADIQNBASEEDAELIAIgAykDADcDGCAAIAJBGGoQ7wMiBCgCDCEDIAQvAQghBAsgBCEFIAMhBiAAQYgDaiEHAkACQCABLQAEQQFxRQ0AIAchAyAFRQ0BIABB9ARqIQggByEEQQAhCUEAIQogACgA5AEiAyADKAJgaiABLwEGQQJ0aiEBA0AgASEDIAohCiAJIQkCQAJAIAggBCIEayIBQQBIDQAgAy0AAiELIAIgBiAJQQN0aikDADcDECAAIAsgBCABIAJBEGoQSSIBRQ0AIAohCwJAIAoNACADLQADQR50QR91IANxIQsLIAshCiAEIAFqIQQgA0EEaiEBAkACQAJAIAMvAQRFDQAgASEDDAELIAohAyAKDQAgASEBQQAhCkEBIQsMAQsgAyEBIAohCkEAIQsLIAQhAwwBCyADIQEgCiEKQQEhCyAEIQMLIAMhAyAKIQogASEBAkAgC0UNACADIQMMAwsgAyEEIAlBAWoiCyEJIAohCiABIQEgAyEDIAsgBUcNAAwCCwALIAchAwJAAkAgBQ4CAgEACyACIAU2AgAgAkEoaiAAQaXBACACENcDIAchAwwBCyABLwEGIQMgAiAGKQMANwMIIAcgACADIAdB7AEgAkEIahBJaiEDCyAAQYQDaiADIAdrOgAAIAJBMGokAAvXAQIDfwF+IwBBwABrIgEkACABIAApA1giBDcDKCABIAQ3AxggASAENwMwIAAgAUEYaiABQSRqEP4CIgIhAwJAIAINACABIAEpAzA3AxAgAUE4aiAAQZMhIAFBEGoQ2gNBACEDCwJAAkAgAyIDDQAgAyEDDAELIAMhAyABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQYYhIAFBCGoQ2gNBACEDCwJAIAMiA0UNACAAIAMQrwIgACABKAIkIAMvAQJB/x9xQYDAAHIQ0AILIAFBwABqJAALngECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ/gIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBkyEgA0EIahDaA0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQAC4kBAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEP4CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZMhIANBCGoQ2gNBACECCwJAAkAgAiIBDQAgAEIANwMADAELIAAgAS8BADYCACAAQQQ2AgQLIANBMGokAAuGAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahD+AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGTISADQQhqENoDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQJB/x9xEOUDCyADQTBqJAALzgECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahD+AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGTISABQRBqENoDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENoDQQAhAwsCQCADIgNFDQAgACADEK8CIAAgASgCJCADLwECENACCyABQcAAaiQAC2QBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqENkDDAELIAAgASACKAIAEIIDQQBHEOYDCyADQRBqJAALYwECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADIAIpAwA3AwggACABQdkAIANBCGoQ2QMMAQsgACABIAEgAigCABCBAxD6AgsgA0EQaiQAC4kCAgV/AX4jAEEwayIBJAAgASAAKQNYNwMoAkACQAJAIAEoAiwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDKDcDECABQSBqIABB2QAgAUEQahDZA0H//wEhAgwBCyABKAIoIQILAkAgAiICQf//AUYNACAAQQAQngMhAyABIABB6ABqKQMAIgY3AyggASAGNwMIIAAgAUEIaiABQRxqEO4DIQQCQCADQYCABEkNACABQSBqIABB3QAQ2wMMAQsCQCABKAIcIgVB7QFJDQAgAUEgaiAAQd4AENsDDAELIABBhANqIAU6AAAgAEGIA2ogBCAFEJ0GGiAAIAIgAxDQAgsgAUEwaiQAC2kCAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDCCADIAQ3AxACQAJAIAEgA0EIahD9AiICDQAgAyADKQMQNwMAIANBGGogAUGdASADENkDIABCADcDAAwBCyAAIAIoAgQQ5QMLIANBIGokAAtwAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQ/QIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxDZAyAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EgaiQAC5oBAgJ/AX4jAEHAAGsiASQAIAEgACkDWCIDNwMYIAEgAzcDMAJAAkAgACABQRhqEP0CIgINACABIAEpAzA3AwggAUE4aiAAQZ0BIAFBCGoQ2QMMAQsgASAAQeAAaikDACIDNwMQIAEgAzcDICABQShqIAAgAiABQRBqEIUDIAAoAuwBIgBFDQAgACABKQMoNwMgCyABQcAAaiQAC8MBAgJ/AX4jAEHAAGsiASQAIAEgACkDWCIDNwMYIAEgAzcDMAJAAkACQCAAIAFBGGoQ/QINACABIAEpAzA3AwAgAUE4aiAAQZ0BIAEQ2QMMAQsgASAAQeAAaikDACIDNwMQIAEgAzcDKCAAIAFBEGoQkgIiAkUNACABIAApA1giAzcDCCABIAM3AyAgACABQQhqEPwCIgBBf0wNASACIABBgIACczsBEgsgAUHAAGokAA8LQZLcAEGAzgBBKUG6JxD/BQAL+AECBH8BfiMAQSBrIgEkACABIABB4ABqKQMAIgU3AwggASAFNwMYIAAgAUEIakEAEMQDIQIgAEEBEJ4DIQMCQAJAQZgqQQAQrgVFDQAgAUEQaiAAQYg/QQAQ1wMMAQsCQBBBDQAgAUEQaiAAQZs3QQAQ1wMMAQsCQAJAIAJFDQAgAw0BCyABQRBqIABBkTxBABDVAwwBC0EAQQ42AtCEAgJAIAAoAuwBIgRFDQAgBCAAKQNgNwMgC0EAQQE6AKiAAiACIAMQPiECQQBBADoAqIACAkAgAkUNAEEAQQA2AtCEAiAAQX8QogMLIABBABCiAwsgAUEgaiQAC+4CAgN/AX4jAEEgayIDJAACQAJAEHAiBEUNACAELwEIDQAgBEEVEO4CIQUgA0EQakGvARDFAyADIAMpAxA3AwAgA0EYaiAEIAUgAxCLAyADKQMYUA0AQgAhBkGwASEFAkACQAJAAkACQCAAQX9qDgQEAAEDAgtBAEEANgLQhAJCACEGQbEBIQUMAwtBAEEANgLQhAIQQAJAIAENAEIAIQZBsgEhBQwDCyADQQhqIARBCCAEIAEgAhCYARDnAyADKQMIIQZBsgEhBQwCC0HaxgBBLEGGERD6BQALIANBCGogBEEIIAQgASACEJMBEOcDIAMpAwghBkGzASEFCyAFIQAgBiEGAkBBAC0AqIACDQAgBBCFBA0CCyAEQQM6AEMgBCADKQMYNwNYIANBCGogABDFAyAEQeAAaiADKQMINwMAIARB6ABqIAY3AwAgBEECQQEQfRoLIANBIGokAA8LQdbiAEHaxgBBMUGGERD/BQALLwEBfwJAAkBBACgC0IQCDQBBfyEBDAELEEBBAEEANgLQhAJBACEBCyAAIAEQogMLpgECA38BfiMAQSBrIgEkAAJAAkBBACgC0IQCDQAgAEGcfxCiAwwBCyABIABB4ABqKQMAIgQ3AwggASAENwMQAkACQCAAIAFBCGogAUEcahDuAyICDQBBm38hAgwBCwJAIAAoAuwBIgNFDQAgAyAAKQNgNwMgC0EAQQE6AKiAAiACIAEoAhwQPyECQQBBADoAqIACIAIhAgsgACACEKIDCyABQSBqJAALRQEBfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAEgA0EIahDeAyICQX9KDQAgAEIANwMADAELIAAgAhDlAwsgA0EQaiQAC0YBAX8jAEEQayIDJAAgAyACKQMANwMAAkACQCABIAMgA0EMahDEA0UNACAAIAMoAgwQ5QMMAQsgAEIANwMACyADQRBqJAALhwECA38BfiMAQSBrIgEkACABIAApA1g3AxggAEEAEJ4DIQIgASABKQMYNwMIAkAgACABQQhqIAIQ3QMiAkF/Sg0AIAAoAuwBIgNFDQAgA0EAKQPwigE3AyALIAEgACkDWCIENwMAIAEgBDcDECAAIAAgAUEAEMQDIAJqEOEDEKIDIAFBIGokAAtaAQJ/IwBBIGsiASQAIAEgACkDWDcDECAAQQAQngMhAiABIAEpAxA3AwggAUEYaiAAIAFBCGogAhCXAwJAIAAoAuwBIgBFDQAgACABKQMYNwMgCyABQSBqJAALbAIDfwF+IwBBIGsiASQAIABBABCeAyECIABBAUH/////BxCdAyEDIAEgACkDWCIENwMIIAEgBDcDECABQRhqIAAgAUEIaiACIAMQzQMCQCAAKALsASIARQ0AIAAgASkDGDcDIAsgAUEgaiQAC4wCAQl/IwBBIGsiASQAAkACQAJAAkAgAC0AQyICQX9qIgNFDQAgAkEBSw0BQQAhBAwCCyABQRBqQQAQxQMgACgC7AEiBUUNAiAFIAEpAxA3AyAMAgtBACEFQQAhBgNAIAAgBiIGEJ4DIAFBHGoQ3wMgBWoiBSEEIAUhBSAGQQFqIgchBiAHIANHDQALCwJAIAAgAUEIaiAEIgggAxCWASIJRQ0AAkAgAkEBTQ0AQQAhBUEAIQYDQCAFIgdBAWoiBCEFIAAgBxCeAyAJIAYiBmoQ3wMgBmohBiAEIANHDQALCyAAIAFBCGogCCADEJcBCyAAKALsASIFRQ0AIAUgASkDCDcDIAsgAUEgaiQAC60DAg1/AX4jAEHAAGsiASQAIAEgACkDWCIONwM4IAEgDjcDGCAAIAFBGGogAUE0ahDEAyECIAEgAEHgAGopAwAiDjcDKCABIA43AxAgACABQRBqIAFBJGoQxAMhAyABIAEpAzg3AwggACABQQhqEN4DIQQgAEEBEJ4DIQUgAEECIAQQnQMhBiABIAEpAzg3AwAgACABIAUQ3QMhBAJAAkAgAw0AQX8hBwwBCwJAIARBAE4NAEF/IQcMAQtBfyEHIAUgBiAGQR91IghzIAhrIglODQAgASgCNCEIIAEoAiQhCiAEIQRBfyELIAUhBQNAIAUhBSALIQsCQCAKIAQiBGogCE0NACALIQcMAgsCQCACIARqIAMgChC3BiIHDQAgBkF/TA0AIAUhBwwCCyALIAUgBxshByAIIARBAWoiCyAIIAtKGyEMIAVBAWohDSAEIQUCQANAAkAgBUEBaiIEIAhIDQAgDCELDAILIAQhBSAEIQsgAiAEai0AAEHAAXFBgAFGDQALCyALIQQgByELIA0hBSAHIQcgDSAJRw0ACwsgACAHEKIDIAFBwABqJAALCQAgAEEBEMgCC+IBAgV/AX4jAEEwayICJAAgAiAAKQNYIgc3AyggAiAHNwMQAkAgACACQRBqIAJBJGoQxAMiA0UNACACQRhqIAAgAyACKAIkEMgDIAIgAikDGDcDCCAAIAJBCGogAkEkahDEAyIERQ0AAkAgAigCJEUNAEEgQWAgARshBUG/f0GffyABGyEGQQAhAwNAIAQgAyIDaiIBIAEtAAAiASAFQQAgASAGakH/AXFBGkkbajoAACADQQFqIgEhAyABIAIoAiRJDQALCyAAKALsASIDRQ0AIAMgAikDGDcDIAsgAkEwaiQACwkAIABBABDIAguoBAEEfyMAQcAAayIEJAAgBCACKQMANwMYAkACQAJAAkAgASAEQRhqEPEDQX5xQQJGDQAgBCACKQMANwMQIAAgASAEQRBqEMkDDAELIAQgAikDADcDIEF/IQUCQCADQeQAIAMbIgNBCkkNACAEQTxqQQA6AAAgBEIANwI0IARBADYCLCAEIAE2AiggBCAEKQMgNwMIIAQgA0F9ajYCMCAEQShqIARBCGoQywIgBCgCLCIGQQNqIgcgA0sNAiAGIQUCQCAELQA8RQ0AIAQgBCgCNEEDajYCNCAHIQULIAQoAjQhBiAFIQULIAYhBgJAIAUiBUF/Rw0AIABCADcDAAwBCyABIAAgBSAGEJYBIgVFDQAgBCACKQMANwMgIAYhAkF/IQYCQCADQQpJDQAgBEEAOgA8IAQgBTYCOCAEQQA2AjQgBEEANgIsIAQgATYCKCAEIAQpAyA3AwAgBCADQX1qNgIwIARBKGogBBDLAiAEKAIsIgJBA2oiByADSw0DAkAgBC0APCIDRQ0AIAQgBCgCNEEDajYCNAsgBCgCNCEGAkAgA0UNACAEIAJBAWoiAzYCLCAFIAJqQS46AAAgBCACQQJqIgI2AiwgBSADakEuOgAAIAQgBzYCLCAFIAJqQS46AAALIAYhAiAEKAIsIQYLIAEgACAGIAIQlwELIARBwABqJAAPC0GEMkH1xgBBqgFB8iQQ/wUAC0GEMkH1xgBBqgFB8iQQ/wUAC8gEAQV/IwBB4ABrIgIkAAJAIAAtABQNACAAKAIAIQMgAiABKQMANwNQAkAgAyACQdAAahCNAUUNACAAQcHQABDMAgwBCyACIAEpAwA3A0gCQCADIAJByABqEPEDIgRBCUcNACACIAEpAwA3AwAgACADIAIgAkHYAGoQxAMgAigCWBDjAiIBEMwCIAEQIAwBCwJAAkAgBEF+cUECRw0AIAEoAgQiBEGAgMD/B3ENASAEQQ9xQQZHDQELIAIgASkDADcDECACQdgAaiADIAJBEGoQyQMgASACKQNYNwMAIAIgASkDADcDCCAAIAMgAkEIaiACQdgAahDEAxDMAgwBCyACIAEpAwA3A0AgAyACQcAAahCOASACIAEpAwA3AzgCQAJAIAMgAkE4ahDwA0UNACACIAEpAwA3AyggAyACQShqEO8DIQQgAkHbADsAWCAAIAJB2ABqEMwCAkAgBC8BCEUNAEEAIQUDQCACIAQoAgwgBSIFQQN0aikDADcDICAAIAJBIGoQywIgAC0AFA0BAkAgBSAELwEIQX9qRg0AIAJBLDsAWCAAIAJB2ABqEMwCCyAFQQFqIgYhBSAGIAQvAQhJDQALCyACQd0AOwBYIAAgAkHYAGoQzAIMAQsgAiABKQMANwMwIAMgAkEwahCRAyEEIAJB+wA7AFggACACQdgAahDMAgJAIARFDQAgAyAEIABBDxDtAhoLIAJB/QA7AFggACACQdgAahDMAgsgAiABKQMANwMYIAMgAkEYahCPAQsgAkHgAGokAAuDAgEEfwJAIAAtABQNACABEMwGIgIhAwJAIAIgACgCCCAAKAIEayIETQ0AIABBAToAFAJAIARBAU4NACAEIQMMAQsgBCEDIAEgBEF/aiIEaiwAAEF/Sg0AIAQhAgNAAkAgASACIgRqLQAAQcABcUGAAUYNACAEIQMMAgsgBEF/aiECQQAhAyAEQQBKDQALCwJAIAMiBUUNAEEAIQQDQAJAIAEgBCIEaiIDLQAAQcABcUGAAUYNACAAIAAoAgxBAWo2AgwLAkAgACgCECICRQ0AIAIgACgCBCAEamogAy0AADoAAAsgBEEBaiIDIQQgAyAFRw0ACwsgACAAKAIEIAVqNgIECwvOAgEGfyMAQTBrIgQkAAJAIAEtABQNACAEIAIpAwA3AyBBACEFAkAgACAEQSBqEMEDRQ0AIAQgAikDADcDGCAAIARBGGogBEEsahDEAyEGIAQoAiwiBUUhAAJAAkAgBQ0AIAAhBwwBCyAAIQhBACEJA0AgCCEHAkAgBiAJIgBqLQAAIghB3wFxQb9/akH/AXFBGkkNACAAQQBHIAjAIghBL0pxIAhBOkhxDQAgByEHIAhB3wBHDQILIABBAWoiACAFTyIHIQggACEJIAchByAAIAVHDQALC0EAIQACQCAHQQFxRQ0AIAEgBhDMAkEBIQALIAAhBQsCQCAFDQAgBCACKQMANwMQIAEgBEEQahDLAgsgBEE6OwAsIAEgBEEsahDMAiAEIAMpAwA3AwggASAEQQhqEMsCIARBLDsALCABIARBLGoQzAILIARBMGokAAvRAgECfwJAAkAgAC8BCA0AAkACQCAAIAEQggNFDQAgAEH0BGoiBSABIAIgBBCuAyIGRQ0AIAYoAgRBoPc2IAMgA0HfiElqQeCISUkbaiAAKAKAAk8NASAFIAYQqgMLIAAoAuwBIgBFDQIgACACOwEUIAAgATsBEiAAQRQ7AQogACAEOwEIIAAgAC0AEEHwAXFBAXI6ABAgAEEAEHgPCyAAIAEQggMhBCAFIAYQrAMhASAAQYADakIANwMAIABCADcD+AIgAEGGA2ogAS8BAjsBACAAQYQDaiABLQAUOgAAIABBhQNqIAQtAAQ6AAAgAEH8AmogBEEAIAQtAARrQQxsakFkaikDADcCACABQQhqIQQCQAJAIAEtABQiAUEKTw0AIAQhBAwBCyAEKAIAIQQLIABBiANqIAQgARCdBhoLDwtB1dYAQbLNAEEtQaEeEP8FAAszAAJAIAAtABBBDnFBAkcNACAAKAIsIAAoAggQUgsgAEIANwMIIAAgAC0AEEHwAXE6ABALowIBAn8CQAJAIAAvAQgNAAJAIAJBgGBxQYDAAEcNACAAQfQEaiIDIAEgAkH/n39xQYAgckEAEK4DIgRFDQAgAyAEEKoDCyAAKALsASIDRQ0BIAMgAjsBFCADIAE7ARIgAEGEA2otAAAhAiADIAMtABBB8AFxQQJyOgAQIAMgACACEIoBIgE2AggCQCABRQ0AIAMgAjoADCABIABBiANqIAIQnQYaCwJAIAAoApACQQAgACgCgAIiAkGcf2oiASABIAJLGyIBTw0AIAAgATYCkAILIAAgACgCkAJBFGoiBDYCkAJBACEBAkAgBCACayICQQBIDQAgACAAKAKUAkEBajYClAIgAiEBCyADIAEQeAsPC0HV1gBBss0AQeMAQYA8EP8FAAv7AQEEfwJAAkAgAC8BCA0AIAAoAuwBIgFFDQEgAUH//wE7ARIgASAAQYYDai8BADsBFCAAQYQDai0AACECIAEgAS0AEEHwAXFBA3I6ABAgASAAIAJBEGoiAxCKASICNgIIAkAgAkUNACABIAM6AAwgAiAAQfgCaiADEJ0GGgsCQCAAKAKQAkEAIAAoAoACIgJBnH9qIgMgAyACSxsiA08NACAAIAM2ApACCyAAIAAoApACQRRqIgQ2ApACQQAhAwJAIAQgAmsiAkEASA0AIAAgACgClAJBAWo2ApQCIAIhAwsgASADEHgLDwtB1dYAQbLNAEH3AEHhDBD/BQALnQICA38BfiMAQdAAayIDJAACQCAALwEIDQAgAyACKQMANwNAAkAgACADQcAAaiADQcwAahDEAyICQQoQyQZFDQAgASEEIAIQiAYiBSEAA0AgACICIQACQANAAkACQCAAIgAtAAAOCwMBAQEBAQEBAQEAAQsgAEEAOgAAIAMgAjYCNCADIAQ2AjBB2hogA0EwahA7IABBAWohAAwDCyAAQQFqIQAMAAsACwsCQCACLQAARQ0AIAMgAjYCJCADIAE2AiBB2hogA0EgahA7CyAFECAMAQsCQCABQSNHDQAgACkDgAIhBiADIAI2AgQgAyAGPgIAQasZIAMQOwwBCyADIAI2AhQgAyABNgIQQdoaIANBEGoQOwsgA0HQAGokAAuYAgIDfwF+IwBBIGsiAyQAAkACQCABQYUDai0AAEH/AUcNACAAQgA3AwAMAQsCQCABQQtBIBCJASIEDQAgAEIANwMADAELIANBGGogAUEIIAQQ5wMgAyADKQMYNwMQIAEgA0EQahCOASAEIAEgAUGIA2ogAUGEA2otAAAQkwEiBTYCHAJAAkAgBQ0AIAMgAykDGDcDACABIAMQjwFCACEGDAELIAQgAUH8AmopAgA3AwggBCABLQCFAzoAFSAEIAFBhgNqLwEAOwEQIAFB+wJqLQAAIQUgBCACOwESIAQgBToAFCAEIAEvAfgCOwEWIAMgAykDGDcDCCABIANBCGoQjwEgAykDGCEGCyAAIAY3AwALIANBIGokAAucAgICfwF+IwBBwABrIgMkACADIAE2AjAgA0ECNgI0IAMgAykDMDcDGCADQSBqIAAgA0EYakHhABCUAyADIAMpAzA3AxAgAyADKQMgNwMIIANBKGogACADQRBqIANBCGoQhgMCQAJAIAMpAygiBVANACAALwEIDQAgAC0ARg0AIAAQhQQNASAAIAU3A1ggAEECOgBDIABB4ABqIgRCADcDACADQThqIAAgARDTAiAEIAMpAzg3AwAgAEEBQQEQfRoLAkAgAkUNACAAKALwASICRQ0AIAIhAgNAAkAgAiICLwESIAFHDQAgAiAAKAKAAhB3CyACKAIAIgQhAiAEDQALCyADQcAAaiQADwtB1uIAQbLNAEHVAUHbHxD/BQAL6wkCB38BfiMAQRBrIgEkAEEBIQICQAJAIAAtABBBD3EiAw4FAQAAAAEACwJAAkACQAJAAkACQCADQX9qDgUAAQIEAwQLAkAgACgCLCAALwESEIIDDQAgAEEAEHcgACAALQAQQd8BcToAEEEAIQIMBgsgACgCLCECAkAgAC0AECIDQSBxRQ0AIAAgA0HfAXE6ABAgAkH0BGoiBCAALwESIAAvARQgAC8BCBCuAyIFRQ0AIAIgAC8BEhCCAyEDIAQgBRCsAyEAIAJBgANqQgA3AwAgAkIANwP4AiACQYYDaiAALwECOwEAIAJBhANqIAAtABQ6AAAgAkGFA2ogAy0ABDoAACACQfwCaiADQQAgAy0ABGtBDGxqQWRqKQMANwIAIABBCGohAwJAAkAgAC0AFCIAQQpPDQAgAyEDDAELIAMoAgAhAwsgAkGIA2ogAyAAEJ0GGkEBIQIMBgsgACgCGCACKAKAAksNBCABQQA2AgxBACEFAkAgAC8BCCIDRQ0AIAIgAyABQQxqEIkEIQULIAAvARQhBiAALwESIQQgASgCDCEDIAJB+wJqQQE6AAAgAkH6AmogA0EHakH8AXE6AAAgAiAEEIIDIgdBACAHLQAEa0EMbGpBZGopAwAhCCACQYQDaiADOgAAIAJB/AJqIAg3AgAgAiAEEIIDLQAEIQQgAkGGA2ogBjsBACACQYUDaiAEOgAAAkAgBSIERQ0AIAJBiANqIAQgAxCdBhoLAkACQCACQfgCahDbBSIDRQ0AAkAgACgCLCICKAKQAkEAIAIoAoACIgVBnH9qIgQgBCAFSxsiBE8NACACIAQ2ApACCyACIAIoApACQRRqIgY2ApACQQMhBCAGIAVrIgVBA0gNASACIAIoApQCQQFqNgKUAiAFIQQMAQsCQCAALwEKIgJB5wdLDQAgACACQQF0OwEKCyAALwEKIQQLIAAgBBB4IANFDQQgA0UhAgwFCwJAIAAoAiwgAC8BEhCCAw0AIABBABB3QQAhAgwFCyAAKAIIIQUgAC8BFCEGIAAvARIhBCAALQAMIQMgACgCLCICQfsCakEBOgAAIAJB+gJqIANBB2pB/AFxOgAAIAIgBBCCAyIHQQAgBy0ABGtBDGxqQWRqKQMAIQggAkGEA2ogAzoAACACQfwCaiAINwIAIAIgBBCCAy0ABCEEIAJBhgNqIAY7AQAgAkGFA2ogBDoAAAJAIAVFDQAgAkGIA2ogBSADEJ0GGgsCQCACQfgCahDbBSICDQAgAkUhAgwFCwJAIAAoAiwiAigCkAJBACACKAKAAiIDQZx/aiIEIAQgA0sbIgRPDQAgAiAENgKQAgsgAiACKAKQAkEUaiIFNgKQAkEDIQQCQCAFIANrIgNBA0gNACACIAIoApQCQQFqNgKUAiADIQQLIAAgBBB4QQAhAgwECyAAKAIIENsFIgJFIQMCQCACDQAgAyECDAQLAkAgACgCLCICKAKQAkEAIAIoAoACIgRBnH9qIgUgBSAESxsiBU8NACACIAU2ApACCyACIAIoApACQRRqIgY2ApACQQMhBQJAIAYgBGsiBEEDSA0AIAIgAigClAJBAWo2ApQCIAQhBQsgACAFEHggAyECDAMLIAAoAggtAABBAEchAgwCC0GyzQBBkwNBoSUQ+gUAC0EAIQILIAFBEGokACACC4wGAgd/AX4jAEEgayIDJAACQAJAIAAtAEYNACAAQfgCaiACIAItAAxBEGoQnQYaAkAgAEH7AmotAABBAXFFDQAgAEH8AmopAgAQ1wJSDQAgAEEVEO4CIQIgA0EIakGkARDFAyADIAMpAwg3AwAgA0EQaiAAIAIgAxCLAyADKQMQIgpQDQAgAC8BCA0AIAAtAEYNACAAEIUEDQIgACAKNwNYIABBAjoAQyAAQeAAaiICQgA3AwAgA0EYaiAAQf//ARDTAiACIAMpAxg3AwAgAEEBQQEQfRoLAkAgAC8BTEUNACAAQfQEaiIEIQVBACECA0ACQCAAIAIiBhCCAyICRQ0AAkACQCAALQCFAyIHDQAgAC8BhgNFDQELIAItAAQgB0cNAQsgAkEAIAItAARrQQxsakFkaikDACAAKQL8AlINACAAEIABAkAgAC0A+wJBAXENAAJAIAAtAIUDQTBLDQAgAC8BhgNB/4ECcUGDgAJHDQAgBCAGIAAoAoACQfCxf2oQrwMMAQtBACEHIAAoAvABIgghAgJAIAhFDQADQCAHIQcCQAJAIAIiAi0AEEEPcUEBRg0AIAchBwwBCwJAIAAvAYYDIggNACAHIQcMAQsCQCAIIAIvARRGDQAgByEHDAELAkAgACACLwESEIIDIggNACAHIQcMAQsCQAJAIAAtAIUDIgkNACAALwGGA0UNAQsgCC0ABCAJRg0AIAchBwwBCwJAIAhBACAILQAEa0EMbGpBZGopAwAgACkC/AJRDQAgByEHDAELAkAgACACLwESIAIvAQgQ2AIiCA0AIAchBwwBCyAFIAgQrAMaIAIgAi0AEEEgcjoAECAHQQFqIQcLIAchByACKAIAIgghAiAIDQALC0EAIQggB0EASg0AA0AgBSAGIAAvAYYDIAgQsQMiAkUNASACIQggACACLwEAIAIvARYQ2AJFDQALCyAAIAZBABDUAgsgBkEBaiIHIQIgByAALwFMSQ0ACwsgABCDAQsgA0EgaiQADwtB1uIAQbLNAEHVAUHbHxD/BQALEAAQ8gVC+KftqPe0kpFbhQvTAgEGfyMAQRBrIgMkACAAQYgDaiEEIABBhANqLQAAIQUCQAJAAkACQCACDQAgBSEFIAQhBAwBCyAAIAIgA0EMahCJBCEGAkACQCADKAIMIgcgAC0AhANODQAgBCAHai0AAA0AIAYgBCAHELcGDQAgB0EBaiEHDAELQQAhBwsgByIHRQ0BIAUgB2shBSAEIAdqIQQLIAQhByAFIQQCQAJAIABB9ARqIgggASAAQYYDai8BACACEK4DIgVFDQACQCAEIAUtABRHDQAgBSEFDAILIAggBRCqAwtBACEFCyAFIgYhBQJAIAYNACAIIAEgAC8BhgMgBBCtAyIBIAI7ARYgASEFCyAFIgJBCGohAQJAAkAgAi0AFEEKTw0AIAEhAQwBCyABKAIAIQELIAEgByAEEJ0GGiACIAApA4ACPgIEIAIhAAwBC0EAIQALIANBEGokACAACykBAX8CQCAALQAGIgFBIHFFDQAgACABQd8BcToABkHiOkEAEDsQlgULC7gBAQR/AkAgAC0ABiICQQRxDQACQCACQQhxDQAgARCMBSECIABBxQAgARCNBSACEEwLIAAvAUwiA0UNACAAKAL0ASEEQQAhAgNAAkAgBCACIgJBAnRqKAIAIgVFDQAgBSgCCCABRw0AIABB9ARqIAIQsAMgAEGQA2pCfzcDACAAQYgDakJ/NwMAIABBgANqQn83AwAgAEJ/NwP4AiAAIAJBARDUAg8LIAJBAWoiBSECIAUgA0cNAAsLCysAIABCfzcD+AIgAEGQA2pCfzcDACAAQYgDakJ/NwMAIABBgANqQn83AwALKABBABDXAhCTBSAAIAAtAAZBBHI6AAYQlQUgACAALQAGQfsBcToABgsgACAAIAAtAAZBBHI6AAYQlQUgACAALQAGQfsBcToABgu6BwIIfwF+IwBBgAFrIgMkAAJAAkAgACACEP8CIgQNAEF+IQQMAQsCQCABKQMAQgBSDQAgAyAAIAQvAQBBABCJBCIFNgJwIANBADYCdCADQfgAaiAAQYwNIANB8ABqEMcDIAEgAykDeCILNwMAIAMgCzcDeCAALwFMRQ0AQQAhBANAIAQhBkEAIQQCQANAAkAgACgC9AEgBCIEQQJ0aigCACIHRQ0AIAMgBykDADcDaCADIAMpA3g3A2AgACADQegAaiADQeAAahD2Aw0CCyAEQQFqIgchBCAHIAAvAUxJDQAMAwsACyADIAU2AlAgAyAGQQFqIgQ2AlQgA0H4AGogAEGMDSADQdAAahDHAyABIAMpA3giCzcDACADIAs3A3ggBCEEIAAvAUwNAAsLIAMgASkDADcDeAJAAkAgAC8BTEUNAEEAIQQDQAJAIAAoAvQBIAQiBEECdGooAgAiB0UNACADIAcpAwA3A0ggAyADKQN4NwNAIAAgA0HIAGogA0HAAGoQ9gNFDQAgBCEEDAMLIARBAWoiByEEIAcgAC8BTEkNAAsLQX8hBAsCQCAEQQBIDQAgAyABKQMANwMQIAMgACADQRBqQQAQxAM2AgBB4hUgAxA7QX0hBAwBCyADIAEpAwA3AzggACADQThqEI4BIAMgASkDADcDMAJAAkAgACADQTBqQQAQxAMiCA0AQX8hBwwBCwJAIABBEBCKASIJDQBBfyEHDAELAkACQAJAIAAvAUwiBQ0AQQAhBAwBCwJAAkAgACgC9AEiBigCAA0AIAVBAEchB0EAIQQMAQsgBSEKQQAhBwJAAkADQCAHQQFqIgQgBUYNASAEIQcgBiAEQQJ0aigCAEUNAgwACwALIAohBAwCCyAEIAVJIQcgBCEECyAEIgYhBCAGIQYgBw0BCyAEIQQCQAJAIAAgBUEBdEECaiIHQQJ0EIoBIgUNACAAIAkQUkF/IQRBBSEFDAELIAUgACgC9AEgAC8BTEECdBCdBiEFIAAgACgC9AEQUiAAIAc7AUwgACAFNgL0ASAEIQRBACEFCyAEIgQhBiAEIQcgBQ4GAAICAgIBAgsgBiEEIAkgCCACEJQFIgc2AggCQCAHDQAgACAJEFJBfyEHDAELIAkgASkDADcDACAAKAL0ASAEQQJ0aiAJNgIAIAAgAC0ABkEgcjoABiADIAQ2AiQgAyAINgIgQdfCACADQSBqEDsgBCEHCyADIAEpAwA3AxggACADQRhqEI8BIAchBAsgA0GAAWokACAECxMAQQBBACgCrIACIAByNgKsgAILFgBBAEEAKAKsgAIgAEF/c3E2AqyAAgsJAEEAKAKsgAILOAEBfwJAAkAgAC8BDkUNAAJAIAApAgQQ8gVSDQBBAA8LQQAhASAAKQIEENcCUQ0BC0EBIQELIAELHwEBfyAAIAEgACABQQBBABDkAhAfIgJBABDkAhogAgv6AwEKfyMAQRBrIgQkAEEAIQUCQCACRQ0AIAJBIjoAACACQQFqIQULIAUhAgJAAkAgAQ0AIAIhBkEBIQdBACEIDAELQQAhBUEAIQlBASEKIAIhAgNAIAIhAiAKIQsgCSEJIAQgACAFIgpqLAAAIgU6AA8CQAJAAkACQAJAAkACQAJAIAVBd2oOGgIABQUBBQUFBQUFBQUFBQUFBQUFBQUFBQUEAwsgBEHuADoADwwDCyAEQfIAOgAPDAILIARB9AA6AA8MAQsgBUHcAEcNAQsgC0ECaiEFAkACQCACDQBBACEMDAELIAJB3AA6AAAgAiAELQAPOgABIAJBAmohDAsgBSEFDAELAkAgBUEgSA0AAkACQCACDQBBACECDAELIAIgBToAACACQQFqIQILIAIhDCALQQFqIQUgCSAELQAPQcABcUGAAUZqIQIMAgsgC0EGaiEFAkAgAg0AQQAhDCAFIQUMAQsgAkHc6sGBAzYAACACQQRqIARBD2pBARD9BSACQQZqIQwgBSEFCyAJIQILIAwiCyEGIAUiDCEHIAIiAiEIIApBAWoiDSEFIAIhCSAMIQogCyECIA0gAUcNAAsLIAghBSAHIQICQCAGIglFDQAgCUEiOwAACyACQQJqIQICQCADRQ0AIAMgAiAFazYCAAsgBEEQaiQAIAILxgMCBX8BfiMAQTBrIgUkAAJAIAIgA2otAAANACAFQQA6AC4gBUEAOwEsIAVBADYCKCAFIAM2AiQgBSACNgIgIAUgAjYCHCAFIAE2AhggBUEQaiAFQRhqEOYCAkAgBS0ALg0AIAUoAiAhASAFKAIkIQYDQCACIQcgASECAkACQCAGIgMNACAFQf//AzsBLCACIQIgAyEDQX8hAQwBCyAFIAJBAWoiATYCICAFIANBf2oiAzYCJCAFIAIsAAAiBjsBLCABIQIgAyEDIAYhAQsgAyEGIAIhCAJAAkAgASIJQXdqIgFBF0sNACAHIQJBASEDQQEgAXRBk4CABHENAQsgCSECQQAhAwsgCCEBIAYhBiACIgghAiADDQALIAhBf0YNACAFQQE6AC4LAkACQCAFLQAuRQ0AAkAgBA0AQgAhCgwCCwJAIAUuASwiAkF/Rw0AIAVBCGogBSgCGEGhDkEAENwDQgAhCgwCCyAFIAI2AgAgBSAFKAIcQX9zIAUoAiBqNgIEIAVBCGogBSgCGEGawgAgBRDcA0IAIQoMAQsgBSkDECEKCyAAIAo3AwAgBUEwaiQADwtBid0AQf/IAEHxAkHPMxD/BQALwhIDCX8BfgF8IwBBgAFrIgIkAAJAAkAgAS0AFkUNACAAQgA3AwAMAQsgASgCDCEDA0AgBSEEAkACQCADIgUNACABQf//AzsBFCAFIQVBfyEGDAELIAEgBUF/aiIFNgIMIAEgASgCCCIGQQFqNgIIIAEgBiwAACIGOwEUIAUhBSAGIQYLIAUhAwJAAkAgBiIHQXdqIghBF0sNACAEIQVBASEGQQEgCHRBk4CABHENAQsgByEFQQAhBgsgAyEDIAUiBCEFIAYNAAsCQAJAAkACQAJAAkACQCAEQSJGDQACQCAEQdsARg0AIARB+wBHDQICQCABKAIAIglBABCQASIKDQAgAEIANwMADAkLIAJB+ABqIAlBCCAKEOcDIAEtABZB/wFxIQgDQCAFIQZBfyEFAkAgCA0AAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALAkAgA0F/Rg0AIANB/QBGDQQgASABKAIIQX9qNgIIIAEgASgCDEEBajYCDAsgAiACKQN4NwNAIAkgAkHAAGoQjgECQANAIAEtABYhCANAIAUhBgJAAkAgCEH/AXFFDQBBfyEFDAELAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALIANBIkcNASACQfAAaiABEOcCAkACQCABLQAWRQ0AQQQhBQwBCyABKAIMIQMDQCAFIQQCQAJAIAMiBQ0AIAFB//8DOwEUIAUhBUF/IQYMAQsgASAFQX9qIgU2AgwgASABKAIIIgZBAWo2AgggASAGLAAAIgY7ARQgBSEFIAYhBgsgBSEDAkACQCAGIgdBd2oiCEEXSw0AIAQhBUEBIQZBASAIdEGTgIAEcQ0BCyAHIQVBACEGCyADIQMgBSIEIQUgBg0AC0EEIQUgBEE6Rw0AIAIgAikDcDcDOCAJIAJBOGoQjgEgAkHoAGogARDmAgJAIAEtABYNACACIAIpA2g3AzAgCSACQTBqEI4BIAIgAikDcDcDKCACIAIpA2g3AyAgCSAKIAJBKGogAkEgahDwAiACIAIpA2g3AxggCSACQRhqEI8BCyACIAIpA3A3AxAgCSACQRBqEI8BQQQhBQJAIAEtABYNACABKAIMIQMDQCAFIQQCQAJAIAMiBQ0AIAFB//8DOwEUIAUhBUF/IQYMAQsgASAFQX9qIgU2AgwgASABKAIIIgZBAWo2AgggASAGLAAAIgY7ARQgBSEFIAYhBgsgBSEDAkACQCAGIgdBd2oiCEEXSw0AIAQhBUEBIQZBASAIdEGTgIAEcQ0BCyAHIQVBACEGCyADIQMgBSIEIQUgBg0AC0EDQQJBBCAEQf0ARhsgBEEsRhshBQsgBSEFCyAFIgVBA0YNAAsCQCAFQX5qDgMACgEKCyACIAIpA3g3AwAgCSACEI8BIAIpA3ghCwwICyACIAIpA3g3AwggCSACQQhqEI8BIAFBAToAFkIAIQsMBwsCQCABKAIAIgdBABCSASIJDQAgAEIANwMADAgLIAJB+ABqIAdBCCAJEOcDIAEtABZB/wFxIQgDQCAFIQZBfyEFAkAgCA0AAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALAkAgA0F/Rg0AIANB3QBGDQQgASABKAIIQX9qNgIIIAEgASgCDEEBajYCDAsgAiACKQN4NwNgIAcgAkHgAGoQjgEDQCACQfAAaiABEOYCQQQhBQJAIAEtABYNACACIAIpA3A3A1ggByAJIAJB2ABqEJwDIAEtABYhCANAIAUhBgJAAkAgCEH/AXFFDQBBfyEFDAELAkAgASgCDCIFDQAgAUH//wM7ARRBfyEFDAELIAEgBUF/ajYCDCABIAEoAggiBUEBajYCCCABIAUsAAAiBTsBFCAFIQULAkACQCAFIgRBd2oiA0EXSw0AIAYhBUEBIQZBASADdEGTgIAEcQ0BCyAEIQVBACEGCyAFIgMhBSAGDQALQQNBAkEEIANB3QBGGyADQSxGGyEFCyAFIgVBA0YNAAsCQAJAIAVBfmoOAwAJAQkLIAIgAikDeDcDSCAHIAJByABqEI8BIAIpA3ghCwwGCyACIAIpA3g3A1AgByACQdAAahCPASABQQE6ABZCACELDAULIAAgARDnAgwGCwJAAkACQAJAIAEvARQiBUGaf2oODwIDAwMDAwMDAAMDAwMDAQMLAkAgASgCDCIGQQNJDQAgASgCCCIDQa0pQQMQtwYNACABIAZBfWo2AgwgASADQQNqNgIIIABBACkDgIsBNwMADAkLIAVBmn9qDg8BAgICAgICAgICAgICAgACCwJAIAEoAgwiBkEDSQ0AIAEoAggiA0GyMkEDELcGDQAgASAGQX1qNgIMIAEgA0EDajYCCCAAQQApA+CKATcDAAwICyAFQeYARw0BCyABKAIMIgVBBEkNACABKAIIIgYoAABB4djNqwZHDQAgASAFQXxqNgIMIAEgBkEEajYCCCAAQQApA+iKATcDAAwGCwJAAkAgBEEtRg0AIARBUGpBCUsNAQsgASgCCEF/aiACQfgAahDiBiEMAkAgAigCeCIFIAEoAggiBkF/akcNACABQQE6ABYgAEIANwMADAcLIAEoAgwgBiAFa2oiBkF/TA0DIAEgBTYCCCABIAY2AgwgACAMEOQDDAYLIAFBAToAFiAAQgA3AwAMBQsgAikDeCELDAMLIAIpA3ghCwwBC0GK3ABB/8gAQeECQekyEP8FAAsgACALNwMADAELIAAgCzcDAAsgAkGAAWokAAuNAQEDfyABQQA2AhAgASgCDCECIAEoAgghAwJAAkACQCABQQAQ6gIiBEEBag4CAAECCyABQQE6ABYgAEIANwMADwsgAEEAEMUDDwsgASACNgIMIAEgAzYCCAJAIAEoAgAiAiAAIAQgASgCEBCWASIDRQ0AIAFBADYCECACIAAgASADEOoCIAEoAhAQlwELC5gCAgN/AX4jAEHAAGsiBSQAIAUgAikDACIINwMYIAVBNGoiBkIANwIAIAUgCDcDECAFQgA3AiwgBSADQQBHIgc2AiggBSADNgIkIAUgATYCICAFQSBqIAVBEGoQ6QICQAJAAkAgBigCAA0AIAUoAiwiBkF/Rw0BCwJAIARFDQAgBUEgaiABQbjVAEEAENUDCyAAQgA3AwAMAQsgASAAIAYgBSgCOBCWASIGRQ0AIAUgAikDACIINwMYIAUgCDcDCCAFQgA3AjQgBSAGNgIwIAVBADYCLCAFIAc2AiggBSADNgIkIAUgATYCICAFQSBqIAVBCGoQ6QIgASAAQX8gBSgCLCAFKAI0GyAFKAI4EJcBCyAFQcAAaiQAC8AJAQl/IwBB8ABrIgIkACAAKAIAIQMgAiABKQMANwNYAkACQCADIAJB2ABqEI0BRQ0AIABBATYCFAwBCyAAKAIUDQACQAJAIAAoAhAiBA0AQQAhBAwBCyAEIAAoAgxqIQQLIAQhBCACIAEpAwA3A1ACQAJAAkACQCADIAJB0ABqEPEDDg0BAAMDAwMBAwMCAwMBAwsgASgCBEGPgMD/B3ENAAJAIAEoAgAiBUG+f2pBAkkNACAFQQJHDQELIAFBACkDgIsBNwMACyACIAEpAwA3A0AgAkHoAGogAyACQcAAahDJAyABIAIpA2g3AwAgAiABKQMANwM4IAMgAkE4aiACQegAahDEAyEBAkAgBEUNACAEIAEgAigCaBCdBhoLIAAgACgCDCACKAJoIgFqNgIMIAAgASAAKAIYajYCGAwCCyACIAEpAwA3A0ggACADIAJByABqIAJB6ABqEMQDIAIoAmggBCACQeQAahDkAiAAKAIMakF/ajYCDCAAIAIoAmQgACgCGGpBf2o2AhgMAQsgAiABKQMANwMwIAMgAkEwahCOASACIAEpAwA3AygCQAJAAkAgAyACQShqEPADRQ0AIAIgASkDADcDGCADIAJBGGoQ7wMhBgJAIAAoAhBFDQAgACgCECAAKAIMakHbADoAAAsgACAAKAIMQQFqNgIMIAAgACgCGEEBajYCGCAAIAAoAgggACgCBGo2AgggAEEYaiEHIABBDGohCAJAIAYvAQhFDQBBACEEA0AgBCEJAkAgACgCCEUNAAJAIAAoAhAiBEUNACAEIAgoAgBqQQo6AAALIAAgACgCDEEBajYCDCAAIAAoAhhBAWo2AhggACgCCEF/aiEKAkAgACgCEEUNAEEAIQQgCkUNAANAIAAoAhAgACgCDCAEIgRqakEgOgAAIARBAWoiBSEEIAUgCkcNAAsLIAggCCgCACAKajYCACAHIAcoAgAgCmo2AgALIAIgBigCDCAJQQN0aikDADcDECAAIAJBEGoQ6QIgACgCFA0BAkAgCSAGLwEIQX9qRg0AAkAgACgCEEUNACAAKAIQIAAoAgxqQSw6AAALIAggCCgCAEEBajYCACAHIAcoAgBBAWo2AgALIAlBAWoiBSEEIAUgBi8BCEkNAAsLIAAgACgCCCAAKAIEazYCCAJAIAYvAQhFDQAgABDrAgsgCCEKQd0AIQkgByEGIAghBCAHIQUgACgCEA0BDAILIAIgASkDADcDICADIAJBIGoQkQMhBAJAIAAoAhBFDQAgACgCECAAKAIMakH7ADoAAAsgACAAKAIMQQFqIgU2AgwgACAAKAIYQQFqNgIYAkAgBEUNACAAIAAoAgggACgCBGo2AgggAyAEIABBEBDtAhogACAAKAIIIAAoAgRrNgIIIAUgACgCDCIERg0AIAAgBEF/ajYCDCAAIAAoAhhBf2o2AhggABDrAgsgAEEMaiIEIQpB/QAhCSAAQRhqIgUhBiAEIQQgBSEFIAAoAhBFDQELIAAoAhAgACgCDGogCToAACAKIQQgBiEFCyAEIgAgACgCAEEBajYCACAFIgAgACgCAEEBajYCACACIAEpAwA3AwggAyACQQhqEI8BCyACQfAAaiQAC9AHAQp/IwBBEGsiAiQAIAEhAUEAIQNBACEEAkADQCAEIQQgAyEFIAEhA0F/IQECQCAALQAWIgYNAAJAIAAoAgwiAQ0AIABB//8DOwEUQX8hAQwBCyAAIAFBf2o2AgwgACAAKAIIIgFBAWo2AgggACABLAAAIgE7ARQgASEBCwJAAkAgASIBQX9GDQACQAJAIAFB3ABGDQAgASEHIAFBIkcNASADIQEgBSEIIAQhCUECIQoMAwsCQAJAIAZFDQBBfyEBDAELAkAgACgCDCIBDQAgAEH//wM7ARRBfyEBDAELIAAgAUF/ajYCDCAAIAAoAggiAUEBajYCCCAAIAEsAAAiATsBFCABIQELIAEiCyEHIAMhASAFIQggBCEJQQEhCgJAAkACQAJAAkACQCALQV5qDlQGCAgICAgICAgICAgIBggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBggICAgIAggICAMICAgICAgIBQgICAEIAAQIC0EJIQcMBQtBDSEHDAQLQQghBwwDC0EMIQcMAgtBACEBAkADQCABIQFBfyEIAkAgBg0AAkAgACgCDCIIDQAgAEH//wM7ARRBfyEIDAELIAAgCEF/ajYCDCAAIAAoAggiCEEBajYCCCAAIAgsAAAiCDsBFCAIIQgLQX8hCSAIIghBf0YNASACQQtqIAFqIAg6AAAgAUEBaiIIIQEgCEEERw0ACyACQQA6AA8gAkEJaiACQQtqEP4FIQEgAi0ACUEIdCACLQAKckF/IAFBAkYbIQkLIAkiCUF/Rg0CAkACQCAJQYB4cSIBQYC4A0YNAAJAIAFBgLADRg0AIAQhASAJIQQMAgsgAyEBIAUhCCAEIAkgBBshCUEBQQMgBBshCgwFCwJAIAQNACADIQEgBSEIQQAhCUEBIQoMBQtBACEBIARBCnQgCWpBgMiAZWohBAsgASEJIAQgAkEFahDfAyEEIAAgACgCEEEBajYCEAJAAkAgAw0AQQAhAQwBCyADIAJBBWogBBCdBiAEaiEBCyABIQEgBCAFaiEIIAkhCUEDIQoMAwtBCiEHCyAHIQEgBA0AAkACQCADDQBBACEEDAELIAMgAToAACADQQFqIQQLIAQhBAJAIAFBwAFxQYABRg0AIAAgACgCEEEBajYCEAsgBCEBIAVBAWohCEEAIQlBACEKDAELIAMhASAFIQggBCEJQQEhCgsgASEBIAgiCCEDIAkiCSEEQX8hBQJAIAoOBAECAAECCwtBfyAIIAkbIQULIAJBEGokACAFC6QBAQN/AkAgACgCCEUNAAJAIAAoAhBFDQAgACgCECAAKAIMakEKOgAACyAAIAAoAgxBAWo2AgwgACAAKAIYQQFqNgIYIAAoAghBf2ohAQJAIAAoAhBFDQAgAUUNAEEAIQIDQCAAKAIQIAAoAgwgAiICampBIDoAACACQQFqIgMhAiADIAFHDQALCyAAIAAoAgwgAWo2AgwgACAAKAIYIAFqNgIYCwvFAwEDfyMAQSBrIgQkACAEIAIpAwA3AxgCQCAAIARBGGoQwQNFDQAgBCADKQMANwMQAkAgACAEQRBqEPEDIgBBC0sNAEEBIAB0QYEScQ0BCwJAIAEoAghFDQACQCABKAIQIgBFDQAgACABKAIMakEKOgAACyABIAEoAgxBAWo2AgwgASABKAIYQQFqNgIYIAEoAghBf2ohBQJAIAEoAhBFDQAgBUUNAEEAIQADQCABKAIQIAEoAgwgACIAampBIDoAACAAQQFqIgYhACAGIAVHDQALCyABIAEoAgwgBWo2AgwgASABKAIYIAVqNgIYCyAEIAIpAwA3AwggASAEQQhqEOkCAkAgASgCEEUNACABKAIQIAEoAgxqQTo6AAALIAEgASgCDEEBajYCDCABIAEoAhhBAWo2AhgCQCABKAIIRQ0AAkAgASgCEEUNACABKAIQIAEoAgxqQSA6AAALIAEgASgCDEEBajYCDCABIAEoAhhBAWo2AhgLIAQgAykDADcDACABIAQQ6QICQCABKAIQRQ0AIAEoAhAgASgCDGpBLDoAAAsgASABKAIMQQFqNgIMIAEgASgCGEEBajYCGAsgBEEgaiQAC94EAQd/IwBBMGsiBCQAQQAhBSABIQECQANAIAUhBgJAIAEiByAAKADkASIFIAUoAmBqayAFLwEOQQR0Tw0AQQAhBQwCCwJAAkAgB0GQ+ABrQQxtQStLDQACQAJAIAcoAggiBS8BACIBDQAgBSEIDAELIAEhASAFIQUDQCAFIQUgASEBAkAgA0UNACAEQShqIAFB//8DcRDFAyAFLwECIgEhCQJAAkAgAUErSw0AAkAgACAJEO4CIglBkPgAa0EMbUErSw0AIARBADYCJCAEIAFB4ABqNgIgDAILIARBIGogAEEIIAkQ5wMMAQsgAUHPhgNNDQUgBCAJNgIgIARBAzYCJAsgBCAEKQMoNwMIIAQgBCkDIDcDACAAIAIgBEEIaiAEIAMRBQALIAUvAQQiCSEBIAVBBGoiCCEFIAghCCAJDQALCyAIIAcoAghrQQJ1IQUMAwsCQAJAIAcNAEEAIQUMAQsgBy0AA0EPcSEFCwJAAkAgBUF8ag4GAQAAAAABAAtB6OkAQYzHAEHUAEG6HxD/BQALIAcvAQghCgJAIANFDQAgCkUNACAKQQF0IQggBygCDCEFQQAhAQNAIAQgBSABIgFBA3QiCWopAwA3AxggBCAFIAlBCHJqKQMANwMQIAAgAiAEQRhqIARBEGogAxEFACABQQJqIgkhASAJIAhJDQALCyAKIQUCQCAHDQAgBSEFDAMLIAUhBSAHKAIAQYCAgPgAcUGAgIDIAEcNAiAGIApqIQUgBygCBCEBDAELC0He1QBBjMcAQcAAQccyEP8FAAsgBEEwaiQAIAYgBWoLnAICAX4DfwJAIAFBK0sNAAJAAkBCjv3+6v8/IAGtiCICp0EBcQ0AIAFB0PIAai0AACEDAkAgACgC+AENACAAQTAQigEhBCAAQQw6AEQgACAENgL4ASAEDQBBACEDDAELIANBf2oiBEEMTw0BIAAoAvgBIARBAnRqKAIAIgUhAyAFDQACQCAAQQlBEBCJASIDDQBBACEDDAELIAAoAvgBIARBAnRqIAM2AgAgA0GQ+AAgAUEMbGoiAEEAIAAoAggbNgIEIAMhAwsgAyEAAkAgAkIBg1ANACABQSxPDQJBkPgAIAFBDGxqIgFBACABKAIIGyEACyAADwtBmNUAQYzHAEGWAkHDFBD/BQALQd7RAEGMxwBB9QFBwiQQ/wUACw4AIAAgAiABQREQ7QIaC7gCAQN/IwBBIGsiBCQAIAQgAikDADcDEAJAAkACQCAAIAEgBEEQahDxAiIFRQ0AIAUgAykDADcDAAwBCyAEIAIpAwA3AwgCQCAAIARBCGoQwQMNACAEIAIpAwA3AwAgBEEYaiAAQcIAIAQQ2QMMAQsgAS8BCiIFIAEvAQgiBkkNAQJAIAUgBkcNACAAIAVBCmxBA3YiBUEEIAVBBEsbIgZBBHQQigEiBUUNASABIAY7AQoCQCABLwEIIgZFDQAgBSABKAIMIAZBBHQQnQYaCyABIAU2AgwgACgCoAIgBRCLAQsgASgCDCABLwEIQQR0aiACKQMANwMAIAEoAgwgAS8BCEEEdGpBCGogAykDADcDACABIAEvAQhBAWo7AQgLIARBIGokAA8LQcorQYzHAEGgAUHBExD/BQAL7AICCX8BfiMAQSBrIgMkACADIAIpAwA3AxBBACEEAkAgACADQRBqEMEDRQ0AIAEvAQgiBUEARyEEIAVBAXQhBiABKAIMIQcCQAJAIAUNACAEIQgMAQsgAigCACEJIAIpAwAhDCAEIQFBACEKA0AgASEIAkAgByAKIgRBA3RqIgEoAAAgCUcNACABKQMAIAxSDQAgCCEIIAcgBEEDdEEIcmohCwwCCyAEQQJqIgogBkkiBCEBIAohCiAEIQggBA0ACwsgCyEEIAhBAXENACADIAIpAwA3AwggACADQQhqIANBHGoQxAMhCAJAAkAgBQ0AQQAhBAwBC0EAIQQDQCADIAcgBCIEQQN0aikDADcDACAAIAMgA0EYahDEAyEBAkAgAygCGCADKAIcIgpHDQAgCCABIAoQtwYNACAHIARBA3RBCHJqIQQMAgsgBEECaiIBIQQgASAGSQ0AC0EAIQQLIAQhBAsgA0EgaiQAIAQLcQEBfwJAAkAgAUUNACABQZD4AGtBDG1BLEkNAEEAIQIgASAAKADkASIAIAAoAmBqayAALwEOQQR0SQ0BQQEhAgJAIAEtAANBD3FBfGoOBgIAAAAAAgALQejpAEGMxwBB+QBBhCMQ/wUAC0EAIQILIAILXAECfyMAQRBrIgQkACACLwEIIQUgBCACNgIIIAQgAzoABCAEIAU2AgAgACABQQBBABDtAiEDAkAgACACIAQoAgAgAxD0Ag0AIAAgASAEQRIQ7QIaCyAEQRBqJAAL6QIBBn8jAEEQayIEJAACQAJAIANBgThIDQAgBEEIaiAAQQ8Q2wNBfCEDDAELAkBBACABLwEIIgVrIAMgBSADaiIGQQBIGyIDRQ0AAkAgBkEAIAZBAEobIgZBgThJDQAgBEEIaiAAQQ8Q2wNBeiEDDAILAkAgBiABLwEKTQ0AAkAgACAGQQpsQQN2IgdBBCAHQQRLGyIIQQN0EIoBIgcNAEF7IQMMAwsCQCABKAIMIglFDQAgByAJIAEvAQhBA3QQnQYaCyABIAg7AQogASAHNgIMIAAoAqACIAcQiwELIAEvAQggBSACIAUgAkkbIgBrIQICQAJAIANBf0oNACABKAIMIABBA3RqIgAgACADQQN0ayACIANqQQN0EJ4GGgwBCyABKAIMIABBA3QiAGoiBSADQQN0IgNqIAUgAkEDdBCeBhogASgCDCAAakEAIAMQnwYaCyABIAY7AQgLQQAhAwsgBEEQaiQAIAMLNQECfyABKAIIKAIMIQQgASABKAIAIgVBAWo2AgAgBCAFQQN0aiACIAMgAS0ABBspAwA3AwAL4QIBBn8gAS8BCiEEAkACQCABLwEIIgUNAEEAIQYMAQsgASgCDCIHIARBA3RqIQhBACEGA0ACQCAIIAYiBkEBdGovAQAgAkcNACAHIAZBA3RqIQYMAgsgBkEBaiIJIQYgCSAFRw0AC0EAIQYLAkAgBiIGRQ0AIAYgAykDADcDAA8LAkAgBCAFSQ0AAkACQCAEIAVHDQAgACAEQQpsQQN2IgZBBCAGQQRLGyIJQQpsEIoBIgZFDQEgAS8BCiEFIAEgCTsBCgJAIAEvAQgiCEUNACAGIAEoAgwiBCAIQQN0EJ0GIAlBA3RqIAQgBUEDdGogAS8BCEEBdBCdBhoLIAEgBjYCDCAAKAKgAiAGEIsBCyABKAIMIAEvAQhBA3RqIAMpAwA3AwAgASgCDCABLwEKQQN0aiABLwEIQQF0aiACOwEAIAEgAS8BCEEBajsBCAsPC0HKK0GMxwBBuwFBrhMQ/wUAC4ABAQJ/IwBBEGsiAyQAIAMgAikDADcDCAJAAkAgACABIANBCGoQ8QIiAg0AQX8hAQwBCyABIAEvAQgiAEF/ajsBCAJAIAAgAkF4aiIEIAEoAgxrQQN1QQF2QX9zaiIBRQ0AIAQgAkEIaiABQQR0EJ4GGgtBACEBCyADQRBqJAAgAQuJAQIEfwF+AkACQCACLwEIIgQNAEEAIQIMAQsgAigCDCIFIAIvAQpBA3RqIQZBACECA0ACQCAGIAIiAkEBdGovAQAgA0cNACAFIAJBA3RqIQIMAgsgAkEBaiIHIQIgByAERw0AC0EAIQILAkACQCACIgINAEIAIQgMAQsgAikDACEICyAAIAg3AwALGAAgAEEGNgIEIAAgAkEPdEH//wFyNgIAC0sAAkAgAiABKADkASIBIAEoAmBqayICQQR1IAEvAQ5JDQBBjBhBjMcAQbcCQdjFABD/BQALIABBBjYCBCAAIAJBC3RB//8BcjYCAAtYAAJAIAINACAAQgA3AwAPCwJAIAIgASgA5AEiASABKAJgamsiAkGAgAJPDQAgAEEGNgIEIAAgAkENdEH//wFyNgIADwtBxeoAQYzHAEHAAkGpxQAQ/wUAC0kBAn8CQCABKAIEIgJBgIDA/wdxRQ0AQX8PC0F/IQMCQCACQQ9xQQZHDQAgASgCAEEPdiIBQX8gASAAKALkAS8BDkkbIQMLIAMLcgECfwJAAkAgASgCBCICQYCAwP8HcUUNAEF/IQMMAQtBfyEDIAJBD3FBBkcNACABKAIAQQ92IgFBfyABIAAoAuQBLwEOSRshAwtBACEBAkAgAyIDQQBIDQAgACgA5AEiASABKAJgaiADQQR0aiEBCyABC5oBAQF/AkAgAkUNACACQf//ATYCAAsCQCABKAIEIgNBgIDA/wdxRQ0AQQAPCwJAIANBD3FBBkYNAEEADwsCQAJAIAEoAgBBD3YgACgC5AEvAQ5PDQBBACEDIAAoAOQBDQELIAEoAgAhAQJAIAJFDQAgAiABQf//AXE2AgALIAAoAOQBIgIgAigCYGogAUENdkH8/x9xaiEDCyADC2gBBH8CQCAAKALkASIALwEOIgINAEEADwsgACAAKAJgaiEDQQAhBAJAA0AgAyAEIgVBBHRqIgQgACAEKAIEIgAgAUYbIQQgACABRg0BIAQhACAFQQFqIgUhBCAFIAJHDQALQQAPCyAEC94BAQh/IAAoAuQBIgAvAQ4iAkEARyEDAkACQCACDQAgAyEEDAELIAAgACgCYGohBSADIQZBACEHA0AgCCEIIAYhCQJAAkAgASAFIAUgByIDQQR0aiIHLwEKQQJ0amsiBEEASA0AQQAhBiADIQAgBCAHLwEIQQN0SA0BC0EBIQYgCCEACyAAIQACQCAGRQ0AIANBAWoiAyACSSIEIQYgACEIIAMhByAEIQQgACEAIAMgAkYNAgwBCwsgCSEEIAAhAAsgACEAAkAgBEEBcQ0AQYzHAEH7AkHbERD6BQALIAAL3AEBBH8CQAJAIAFBgIACSQ0AQQAhAiABQYCAfmoiAyAAKALkASIBLwEOTw0BIAEgASgCYGogA0EEdGoPC0EAIQICQCAALwFMIAFNDQAgACgC9AEgAUECdGooAgAhAgsCQCACIgENAEEADwtBACECIAAoAuQBIgAvAQ4iBEUNACABKAIIKAIIIQEgACAAKAJgaiEFQQAhAgJAA0AgBSACIgNBBHRqIgIgACACKAIEIgAgAUYbIQIgACABRg0BIAIhACADQQFqIgMhAiADIARHDQALQQAPCyACIQILIAILQAEBf0EAIQICQCAALwFMIAFNDQAgACgC9AEgAUECdGooAgAhAgtBACEAAkAgAiIBRQ0AIAEoAggoAhAhAAsgAAs8AQF/QQAhAgJAIAAvAUwgAU0NACAAKAL0ASABQQJ0aigCACECCwJAIAIiAA0AQafZAA8LIAAoAggoAgQLVwEBf0EAIQICQAJAIAEoAgRB8////wFGDQAgAS8BAkEPcSIBQQJPDQEgACgA5AEiAiACKAJgaiABQQR0aiECCyACDwtB0dIAQYzHAEGoA0HFxQAQ/wUAC48GAQt/IwBBIGsiBCQAIAFB5AFqIQUgAiECAkACQAJAAkACQAJAA0AgAiIGRQ0BIAYgBSgAACICIAIoAmBqIgdrIAIvAQ5BBHRPDQMgByAGLwEKQQJ0aiEIIAYvAQghCQJAAkAgAygCBCICQYCAwP8HcQ0AIAJBD3FBBEcNACAJQQBHIQICQAJAIAkNACACIQJBACEKDAELQQAhCiACIQIgCCELAkACQCADKAIAIgwgCC8BAEYNAANAIApBAWoiAiAJRg0CIAIhCiAMIAggAkEDdGoiCy8BAEcNAAsgAiAJSSECIAshCwsgAiECIAsgB2siCkGAgAJPDQggAEEGNgIEIAAgCkENdEH//wFyNgIAIAIhAkEBIQoMAQsgAiAJSSECQQAhCgsgCiEKIAJFDQAgCiEJIAYhAgwBCyAEIAMpAwA3AxAgASAEQRBqIARBGGoQxAMhDQJAAkACQAJAAkAgBCgCGEUNACAJQQBHIgIhCkEAIQwgCQ0BIAIhAgwCCyAAQgA3AwBBASECIAYhCgwDCwNAIAohByAIIAwiDEEDdGoiDi8BACECIAQoAhghCiAEIAUoAgA2AgwgBEEMaiACIARBHGoQiAQhAgJAIAogBCgCHCILRw0AIAIgDSALELcGDQAgDiAFKAAAIgIgAigCYGprIgJBgIACTw0LIABBBjYCBCAAIAJBDXRB//8BcjYCACAHIQJBASEJDAMLIAxBAWoiAiAJSSILIQogAiEMIAIgCUcNAAsgCyECC0EJIQkLIAkhCQJAIAJBAXFFDQAgCSECIAYhCgwBC0EAIQJBACEKIAYoAgRB8////wFGDQAgBi8BAkEPcSIJQQJPDQhBACECIAUoAAAiCiAKKAJgaiAJQQR0aiEKCyACIQkgCiECCyACIQIgCUUNAAwCCwALIABCADcDAAsgBEEgaiQADwtB+ekAQYzHAEGuA0HmIRD/BQALQcXqAEGMxwBBwAJBqcUAEP8FAAtBxeoAQYzHAEHAAkGpxQAQ/wUAC0HR0gBBjMcAQagDQcXFABD/BQALyAYCBX8CfiMAQRBrIgQkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEQIAMoAgQiBUEPcSIGIAVBgIDA/wdxIgcbIgVBfWoOBwMCAgACAgECCwJAIAIoAgQiCEGAgMD/B3ENACAIQQ9xQQJHDQACQAJAIAdFDQBBfyEIDAELQX8hCCAGQQZHDQAgAygCAEEPdiIHQX8gByABKALkAS8BDkkbIQgLQQAhBwJAIAgiBkEASA0AIAEoAOQBIgcgBygCYGogBkEEdGohBwsgBw0AIAIoAgAiAkGAgAJPDQUgAygCACEDIABBBjYCBCAAIANBgIB+cSACcjYCAAwECyAFQX1qDgcCAQEBAQEAAQsgAikDACEJIAMpAwAhCgJAIAFBB0EYEIkBIgMNACAAQgA3AwAMAwsgAyAKNwMQIAMgCTcDCCAAIAFBCCADEOcDDAILIAAgAykDADcDAAwBCyADKAIAIQdBACEFAkAgAygCBEGPgMD/B3FBA0cNAEEAIQUgB0Gw+XxqIgZBAEgNACAGQQAvAfjtAU4NA0EAIQVBgP8AIAZBA3RqIgYtAANBAXFFDQAgBiEFIAYtAAINBAsCQCAFIgVFDQAgBSgCBCEDIAQgAikDADcDCCAAIAEgBEEIaiADEQEADAELAkAgB0H//wNLDQACQAJAQRAgAigCBCIFQQ9xIAVBgIDA/wdxIgYbIggOCQAAAAAAAgACAQILIAYNBiACKAIAIgNBgICAgAFPDQcgBUHw/z9xDQggACADIAhBHHRyNgIAIAAgB0EEdEEFcjYCBAwCCyAFQfD/P3ENCCAAIAIoAgA2AgAgACAHQQR0QQpyNgIEDAELIAIpAwAhCSADKQMAIQoCQCABQQdBGBCJASIDDQAgAEIANwMADAELIAMgCjcDECADIAk3AwggACABQQggAxDnAwsgBEEQaiQADwtB5TZBjMcAQZQEQYo7EP8FAAtB8BZBjMcAQf8DQaXDABD/BQALQcrcAEGMxwBBggRBpcMAEP8FAAtB9yFBjMcAQa8EQYo7EP8FAAtB3t0AQYzHAEGwBEGKOxD/BQALQZbdAEGMxwBBsQRBijsQ/wUAC0GW3QBBjMcAQbcEQYo7EP8FAAswAAJAIANBgIAESQ0AQZYwQYzHAEHABEHpNBD/BQALIAAgASADQQR0QQlyIAIQ5wMLMgEBfyMAQRBrIgQkACAEIAEpAwA3AwggACAEQQhqIAIgA0EAEIkDIQEgBEEQaiQAIAELtgUCA38BfiMAQdAAayIFJAAgA0EANgIAIAJCADcDAAJAAkACQAJAIARBAkwNAEF/IQYMAQsgASgCACEHAkACQAJAAkACQAJAQRAgASgCBCIGQQ9xIAZBgIDA/wdxG0F9ag4IAAUBBQUEAwIFCyACQgA3AwAgByEGDAULIAIgB0Ecdq1CIIYgB0H/////AHGthDcDACAGQQR2Qf//A3EhBgwECyACIAetQoCAgICAAYQ3AwAgBkEEdkH//wNxIQYMAwsgAyAHNgIAIAZBBHZB//8DcSEGDAILAkAgBw0AQX8hBgwCC0F/IQYgBygCAEGAgID4AHFBgICAOEcNASAFIAcpAxA3AyggACAFQShqIAIgAyAEQQFqEIkDIQMgAiAHKQMINwMAIAMhBgwBCyAFIAEpAwA3AyBBfyEGIAVBIGoQ8gMNACAFIAEpAwA3AzggBUHAAGpB2AAQxQMgACAFKQNANwMwIAUgBSkDOCIINwMYIAUgCDcDSCAAIAVBGGpBABCKAyEGIABCADcDMCAFIAUpA0A3AxAgBUHIAGogACAGIAVBEGoQiwNBACEGAkAgBSgCTEGPgMD/B3FBA0cNAEEAIQYgBSgCSEGw+XxqIgdBAEgNACAHQQAvAfjtAU4NAkEAIQZBgP8AIAdBA3RqIgctAANBAXFFDQAgByEGIActAAINAwsCQAJAIAYiBkUNACAGKAIEIQYgBSAFKQM4NwMIIAVBMGogACAFQQhqIAYRAQAMAQsgBSAFKQNINwMwCwJAAkAgBSkDMFBFDQBBfyECDAELIAUgBSkDMDcDACAAIAUgAiADIARBAWoQiQMhAyACIAEpAwA3AwAgAyECCyACIQYLIAVB0ABqJAAgBg8LQfAWQYzHAEH/A0GlwwAQ/wUAC0HK3ABBjMcAQYIEQaXDABD/BQALpwwCCX8BfiMAQZABayIDJAAgAyABKQMANwNoAkACQAJAAkAgA0HoAGoQ8wNFDQAgAyABKQMAIgw3AzAgAyAMNwOAAUHoLUHwLSACQQFxGyEEIAAgA0EwahC1AxCIBiEBAkACQCAAKQAwQgBSDQAgAyAENgIAIAMgATYCBCADQYgBaiAAQagaIAMQ1QMMAQsgAyAAQTBqKQMANwMoIAAgA0EoahC1AyECIAMgBDYCECADIAI2AhQgAyABNgIYIANBiAFqIABBuBogA0EQahDVAwsgARAgQQAhBAwBCwJAAkACQAJAQRAgASgCBCIEQQ9xIgUgBEGAgMD/B3EiBBtBfmoOBwECAgIAAgMCCyABKAIAIQYCQAJAIAEoAgRBj4DA/wdxQQZGDQBBASEBQQAhBwwBCwJAIAZBD3YgACgC5AEiCC8BDk8NAEEBIQFBACEHIAgNAQsgBkH//wFxQf//AUYhASAIIAgoAmBqIAZBDXZB/P8fcWohBwsgByEHAkACQCABRQ0AAkAgBEUNAEEnIQEMAgsCQCAFQQZGDQBBJyEBDAILQSchASAGQQ92IAAoAuQBLwEOTw0BQSVBJyAAKADkARshAQwBCyAHLwECIgFBgKACTw0FQYcCIAFBDHYiAXZBAXFFDQUgAUECdEGM8wBqKAIAIQELIAAgASACEI8DIQQMAwtBACEEAkAgASgCACIBIAAvAUxPDQAgACgC9AEgAUECdGooAgAhBAsCQCAEIgUNAEEAIQQMAwsgBSgCDCEGAkAgAkECcUUNACAGIQQMAwsgBiEEIAYNAkEAIQQgACABEI0DIgFFDQICQCACQQFxDQAgASEEDAMLIAUgACABEJABIgA2AgwgACEEDAILIAMgASkDADcDYAJAIAAgA0HgAGoQ8QMiBkECRw0AIAEoAgQNAAJAIAEoAgBBoH9qIgdBK0sNACAAIAcgAkEEchCPAyEECyAEIgQhBSAEIQQgB0EsSQ0CCyAFIQkCQCAGQQhHDQAgAyABKQMAIgw3A1ggAyAMNwOIAQJAAkACQCAAIANB2ABqIANBgAFqIANB/ABqQQAQiQMiCkEATg0AIAkhBQwBCwJAAkAgACgC3AEiAS8BCCIFDQBBACEBDAELIAEoAgwiCyABLwEKQQN0aiEHIApB//8DcSEIQQAhAQNAAkAgByABIgFBAXRqLwEAIAhHDQAgCyABQQN0aiEBDAILIAFBAWoiBCEBIAQgBUcNAAtBACEBCwJAAkAgASIBDQBCACEMDAELIAEpAwAhDAsgAyAMIgw3A4gBAkAgAkUNACAMQgBSDQAgA0HwAGogAEEIIABBkPgAQcABakEAQZD4AEHIAWooAgAbEJABEOcDIAMgAykDcCIMNwOIASAMUA0AIAMgAykDiAE3A1AgACADQdAAahCOASAAKALcASEBIAMgAykDiAE3A0ggACABIApB//8DcSADQcgAahD2AiADIAMpA4gBNwNAIAAgA0HAAGoQjwELIAkhAQJAIAMpA4gBIgxQDQAgAyADKQOIATcDOCAAIANBOGoQ7wMhAQsgASIEIQVBACEBIAQhBCAMQgBSDQELQQEhASAFIQQLIAQhBCABRQ0CC0EAIQECQCAGQQ1KDQAgBkH88gBqLQAAIQELIAEiAUUNAyAAIAEgAhCPAyEEDAELAkACQCABKAIAIgENAEEAIQUMAQsgAS0AA0EPcSEFCyABIQQCQAJAAkACQAJAAkACQAJAIAVBfWoOCwEIBgMEBQgFAgMABQsgAUEUaiEBQSkhBAwGCyABQQRqIQFBBCEEDAULIAFBGGohAUEUIQQMBAsgAEEIIAIQjwMhBAwECyAAQRAgAhCPAyEEDAMLQYzHAEHNBkGqPxD6BQALIAFBCGohAUEGIQQLIAQhBSABIgYoAgAiBCEBAkAgBA0AQQAhASACQQFxRQ0AIAYgACAAIAUQ7gIQkAEiBDYCACAEIQEgBA0AQQAhBAwBCyABIQECQCACQQJxRQ0AIAEhBAwBCyABIQQgAQ0AIAAgBRDuAiEECyADQZABaiQAIAQPC0GMxwBB7wVBqj8Q+gUAC0HI4QBBjMcAQagGQao/EP8FAAuCCQIHfwF+IwBBwABrIgQkAEGQ+ABBqAFqQQBBkPgAQbABaigCABshBUEAIQYgAiECAkACQAJAAkADQCAGIQcCQCACIggNACAHIQcMAgsCQAJAIAhBkPgAa0EMbUErSw0AIAQgAykDADcDMCAIIQYgCCgCAEGAgID4AHFBgICA+ABHDQQCQAJAA0AgBiIJRQ0BIAkoAgghBgJAAkACQAJAIAQoAjQiAkGAgMD/B3ENACACQQ9xQQRHDQAgBCgCMCICQYCAf3FBgIABRw0AIAYvAQAiB0UNASACQf//AHEhCiAHIQIgBiEGA0AgBiEGAkAgCiACQf//A3FHDQAgBi8BAiIGIQICQCAGQStLDQACQCABIAIQ7gIiAkGQ+ABrQQxtQStLDQAgBEEANgIkIAQgBkHgAGo2AiAgCSEGQQANCAwKCyAEQSBqIAFBCCACEOcDIAkhBkEADQcMCQsgBkHPhgNNDQ4gBCACNgIgIARBAzYCJCAJIQZBAA0GDAgLIAYvAQQiByECIAZBBGohBiAHDQAMAgsACyAEIAQpAzA3AwggASAEQQhqIARBPGoQxAMhCiAEKAI8IAoQzAZHDQEgBi8BACIHIQIgBiEGIAdFDQADQCAGIQYCQCACQf//A3EQhgQgChDLBg0AIAYvAQIiBiECAkAgBkErSw0AAkAgASACEO4CIgJBkPgAa0EMbUErSw0AIARBADYCJCAEIAZB4ABqNgIgDAYLIARBIGogAUEIIAIQ5wMMBQsgBkHPhgNNDQ4gBCACNgIgIARBAzYCJAwECyAGLwEEIgchAiAGQQRqIQYgBw0ACwsgCSgCBCEGQQENAgwECyAEQgA3AyALIAkhBkEADQAMAgsACyAEQgA3AyALIAQgBCkDIDcDKCAEQShqIQYgCCECQQEhCgwBCwJAIAggASgA5AEiBiAGKAJgamsgBi8BDkEEdE8NACAEIAMpAwA3AxAgBEEwaiABIAggBEEQahCFAyAEIAQpAzAiCzcDKAJAIAtCAFENACAEQShqIQYgCCECQQEhCgwCCwJAIAEoAvgBDQAgAUEwEIoBIQYgAUEMOgBEIAEgBjYC+AEgBg0AIAchBkEAIQJBACEKDAILAkAgASgC+AEoAhQiAkUNACAHIQYgAiECQQAhCgwCCwJAIAFBCUEQEIkBIgINACAHIQZBACECQQAhCgwCCyABKAL4ASACNgIUIAIgBTYCBCAHIQYgAiECQQAhCgwBCwJAAkAgCC0AA0EPcUF8ag4GAQAAAAABAAtBpeYAQYzHAEG7B0HxOhD/BQALIAQgAykDADcDGAJAIAEgCCAEQRhqEPECIgZFDQAgBiEGIAghAkEBIQoMAQtBACEGIAgoAgQhAkEAIQoLIAYiByEGIAIhAiAHIQcgCkUNAAsLAkACQCAHIgYNAEIAIQsMAQsgBikDACELCyAAIAs3AwAgBEHAAGokAA8LQbjmAEGMxwBBywNB1CEQ/wUAC0He1QBBjMcAQcAAQccyEP8FAAtB3tUAQYzHAEHAAEHHMhD/BQAL2gICB38BfiMAQTBrIgIkAAJAAkAgACgC4AEiAy8BCCIEDQBBACEDDAELIAMoAgwiBSADLwEKQQN0aiEGIAFB//8DcSEHQQAhAwNAAkAgBiADIgNBAXRqLwEAIAdHDQAgBSADQQN0aiEDDAILIANBAWoiCCEDIAggBEcNAAtBACEDCwJAAkAgAyIDDQBCACEJDAELIAMpAwAhCQsgAiAJIgk3AygCQAJAIAlQDQAgAiACKQMoNwMYIAAgAkEYahDvAyEDDAELAkAgAEEJQRAQiQEiAw0AQQAhAwwBCyACQSBqIABBCCADEOcDIAIgAikDIDcDECAAIAJBEGoQjgEgAyAAKADkASIIIAgoAmBqIAFBBHRqNgIEIAAoAuABIQggAiACKQMgNwMIIAAgCCABQf//A3EgAkEIahD2AiACIAIpAyA3AwAgACACEI8BIAMhAwsgAkEwaiQAIAMLhQIBBn9BACECAkAgAC8BTCABTQ0AIAAoAvQBIAFBAnRqKAIAIQILQQAhAQJAAkAgAiICRQ0AAkACQCAAKALkASIDLwEOIgQNAEEAIQEMAQsgAigCCCgCCCEBIAMgAygCYGohBUEAIQYCQANAIAUgBiIHQQR0aiIGIAIgBigCBCIGIAFGGyECIAYgAUYNASACIQIgB0EBaiIHIQYgByAERw0AC0EAIQEMAQsgAiEBCwJAAkAgASIBDQBBfyECDAELIAEgAyADKAJgamtBBHUiASECIAEgBE8NAgtBACEBIAIiAkEASA0AIAAgAhCMAyEBCyABDwtBjBhBjMcAQeYCQdIJEP8FAAtkAQF/IwBBEGsiAiQAIAIgASkDADcDCAJAIAAgAkEIakEBEIoDIgFFDQACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0H45QBBjMcAQeEGQcULEP8FAAsgAEIANwMwIAJBEGokACABC7ADAQF/IwBB4ABrIgMkAAJAAkAgAkEGcUECRg0AIAAgARDuAiEBAkAgAkEBcQ0AIAEhAgwCCwJAAkAgAkEEcUUNAAJAIAFBkPgAa0EMbUErSw0AQdsUEIgGIQICQCAAKQAwQgBSDQAgA0HoLTYCMCADIAI2AjQgA0HYAGogAEGoGiADQTBqENUDIAIhAgwDCyADIABBMGopAwA3A1AgACADQdAAahC1AyEBIANB6C02AkAgAyABNgJEIAMgAjYCSCADQdgAaiAAQbgaIANBwABqENUDIAIhAgwCCwJAAkAgAQ0AQQAhAAwBCyABLQADQQ9xIQALIAEhAgJAIABBfGoOBgQAAAAABAALQYXmAEGMxwBBmgVB3CQQ/wUAC0GaMhCIBiECAkACQCAAKQAwQgBSDQAgA0HoLTYCACADIAI2AgQgA0HYAGogAEGoGiADENUDDAELIAMgAEEwaikDADcDKCAAIANBKGoQtQMhASADQegtNgIQIAMgATYCFCADIAI2AhggA0HYAGogAEG4GiADQRBqENUDCyACIQILIAIQIAtBACECCyADQeAAaiQAIAILNQEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqQQAQigMhASAAQgA3AzAgAkEQaiQAIAELNQEBfyMAQRBrIgIkACACIAEpAwA3AwggACACQQhqQQIQigMhASAAQgA3AzAgAkEQaiQAIAELqgIBAn8CQAJAIAFBkPgAa0EMbUErSw0AIAEoAgQhAgwBCwJAAkAgASAAKADkASICIAIoAmBqayACLwEOQQR0Tw0AAkAgACgC+AENACAAQTAQigEhAiAAQQw6AEQgACACNgL4ASACDQBBACECDAMLIAAoAvgBKAIUIgMhAiADDQIgAEEJQRAQiQEiAg0BQQAhAgwCCwJAAkAgAQ0AQQAhAAwBCyABLQADQQ9xIQALAkACQCAAQXxqDgYBAAAAAAEAC0GN5wBBjMcAQfoGQaskEP8FAAsgASgCBA8LIAAoAvgBIAI2AhQgAkGQ+ABBqAFqQQBBkPgAQbABaigCABs2AgQgAiECC0EAIAIiAEGQ+ABBGGpBAEGQ+ABBIGooAgAbIAAbIgAgACABRhsLogECAX8BfiMAQSBrIgIkACACIAEpAwA3AwggAkEQaiAAIAJBCGpBNBCUAwJAAkAgAikDEEIAUg0AQQAhASAALQBFDQEgAkEYaiAAQYg1QQAQ1QNBACEBDAELIAIgAikDECIDNwMYIAIgAzcDACAAIAJBAhCKAyEBIABCADcDMAJAIAENACACQRhqIABBljVBABDVAwsgASEBCyACQSBqJAAgAQuuAgICfwF+IwBBMGsiBCQAIARBIGogAxDFAyABIAQpAyA3AzAgBCACKQMAIgY3AxggBCAGNwMoIAEgBEEYakEAEIoDIQMgAUIANwMwIAQgBCkDIDcDECAEQShqIAEgAyAEQRBqEIsDQQAhAwJAAkACQCAEKAIsQY+AwP8HcUEDRw0AQQAhAyAEKAIoQbD5fGoiBUEASA0AIAVBAC8B+O0BTg0BQQAhA0GA/wAgBUEDdGoiBS0AA0EBcUUNACAFIQMgBS0AAg0CCwJAAkAgAyIDRQ0AIAMoAgQhAyAEIAIpAwA3AwggACABIARBCGogAxEBAAwBCyAAIAQpAyg3AwALIARBMGokAA8LQfAWQYzHAEH/A0GlwwAQ/wUAC0HK3ABBjMcAQYIEQaXDABD/BQAL7AECA38BfiMAQSBrIgMkAAJAAkAgAg0AQQAhBAwBCyADIAEpAwA3AxBBACEEIANBEGoQ8gMNACADIAEpAwAiBjcDCCADIAY3AxggACADQQhqQQAQigMhBCAAQgA3AzAgAyABKQMAIgY3AwAgAyAGNwMYIAAgA0ECEIoDIQUgAEIANwMwQQAhAQJAIARFDQACQCAEIAVGDQAgBCEBDAELIAAgBBCSAyEBC0EAIQQgASIBRQ0AIAEhAQNAAkAgASIBIAJGIgRFDQAgBCEEDAILIAAgARCSAyIFIQEgBCEEIAUNAAsLIANBIGokACAEC4gBAgJ/AX4jAEEwayIEJAAgASADKQMANwMwIAQgAikDACIGNwMgIAQgBjcDKCABIARBIGpBABCKAyEFIAFCADcDMCAEIAMpAwA3AxggBEEoaiABIAUgBEEYahCLAyAEIAIpAwA3AxAgBCAEKQMoNwMIIAAgASAEQRBqIARBCGoQhgMgBEEwaiQAC50CAQJ/IwBBMGsiBCQAAkACQCADQYHAA0kNACAAQgA3AwAMAQsgBCACKQMANwMgAkAgASAEQSBqIARBLGoQ7gMiBUUNACAEKAIsIANNDQAgBCACKQMANwMQAkAgASAEQRBqEMEDRQ0AIAQgAikDADcDCAJAIAEgBEEIaiADEN0DIgNBf0oNACAAQgA3AwAMAwsgBSADaiEDIAAgAUEIIAEgAyADEOADEJgBEOcDDAILIAAgBSADai0AABDlAwwBCyAEIAIpAwA3AxgCQCABIARBGGoQ7wMiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AIAEvAQggA00NACAAIAEoAgwgA0EDdGopAwA3AwAMAQsgAEIANwMACyAEQTBqJAALvgQCAX8CfiMAQbABayIEJAAgBCADKQMANwOQAQJAAkAgBEGQAWoQwgNFDQAgBCACKQMAIgU3A4gBIAQgBTcDqAECQCABIARBiAFqEPADDQAgBCAEKQOoATcDgAEgASAEQYABahDrAw0AIAQgBCkDqAE3A3ggASAEQfgAahDBA0UNAQsgBCADKQMANwMQIAEgBEEQahDpAyEDIAQgAikDADcDCCAAIAEgBEEIaiADEJcDDAELIAQgAykDADcDcAJAIAEgBEHwAGoQwQNFDQAgBCADKQMAIgY3A6ABIAQgAikDACIFNwOYASABIAY3AzAgBCAFNwMwIAQgBTcDqAEgASAEQTBqQQAQigMhAyABQgA3AzAgBCAEKQOgATcDKCAEQagBaiABIAMgBEEoahCLAyAEIAQpA5gBNwMgIAQgBCkDqAE3AxggACABIARBIGogBEEYahCGAwwBCyAEIAMpAwA3A2ggBEGoAWogASAEQegAahDJAyADIAQpA6gBNwMAIAQgAykDADcDYCABIARB4ABqEI4BIAQgAykDACIGNwOgASAEIAIpAwAiBTcDmAEgASAGNwMwIAQgBTcDWCAEIAU3A6gBIAEgBEHYAGpBABCKAyECIAFCADcDMCAEIAQpA6ABNwNQIARBqAFqIAEgAiAEQdAAahCLAyAEIAQpA5gBNwNIIAQgBCkDqAE3A0AgACABIARByABqIARBwABqEIYDIAQgAykDADcDOCABIARBOGoQjwELIARBsAFqJAAL8gMCAX8BfiMAQZABayIEJAAgBCACKQMANwOAAQJAAkAgBEGAAWoQwgNFDQAgBCABKQMAIgU3A3ggBCAFNwOIAQJAIAAgBEH4AGoQ8AMNACAEIAQpA4gBNwNwIAAgBEHwAGoQ6wMNACAEIAQpA4gBNwNoIAAgBEHoAGoQwQNFDQELIAQgAikDADcDGCAAIARBGGoQ6QMhAiAEIAEpAwA3AxAgBCADKQMANwMIIAAgBEEQaiACIARBCGoQmgMMAQsgACACKQMANwMwIAQgASkDACIFNwNgIAQgBTcDiAECQCAAIARB4ABqQQEQigMiAUUNAAJAAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB+OUAQYzHAEHhBkHFCxD/BQALIABCADcDMCABRQ0BIAQgAikDADcDWAJAIAAgBEHYAGoQwQNFDQAgBCACKQMANwMoIAQgAykDADcDICAAIAEgBEEoaiAEQSBqEPACDAILIAQgAikDADcDUCAEQYgBaiAAIARB0ABqEMkDIAIgBCkDiAE3AwAgBCACKQMANwNIIAAgBEHIAGoQjgEgBCACKQMANwNAIAQgAykDADcDOCAAIAEgBEHAAGogBEE4ahDwAiAEIAIpAwA3AzAgACAEQTBqEI8BDAELIABCADcDMAsgBEGQAWokAAu1AwIEfwF+IwBB0ABrIgQkAAJAAkAgAkGBwANJDQAgBEHIAGogAEEPENsDDAELIAQgASkDADcDOAJAIAAgBEE4ahDsA0UNACAEIAEpAwA3AyAgACAEQSBqIARBxABqEO0DIQECQCAEKAJEIgUgAk0NACAEIAMpAwA3AwggASACaiAAIARBCGoQ6QM6AAAMAgsgBCACNgIQIAQgBTYCFCAEQcgAaiAAQdQNIARBEGoQ1wMMAQsgBCABKQMANwMwAkAgACAEQTBqEO8DIgVFDQAgBSgCAEGAgID4AHFBgICAGEcNAAJAIAJBgThJDQAgBEHIAGogAEEPENsDDAILIAMpAwAhCAJAIAJBAWoiASAFLwEKTQ0AIAAgAUEKbEEDdiIDQQQgA0EESxsiBkEDdBCKASIDRQ0CAkAgBSgCDCIHRQ0AIAMgByAFLwEIQQN0EJ0GGgsgBSAGOwEKIAUgAzYCDCAAKAKgAiADEIsBCyAFKAIMIAJBA3RqIAg3AwAgBS8BCCACSw0BIAUgATsBCAwBCyAEIAEpAwA3AyggBEHIAGogAEEPIARBKGoQ2QMLIARB0ABqJAALvQEBBX8jAEEQayIEJAACQAJAIAJBgThJDQAgBEEIaiAAQQ8Q2wMMAQsCQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBA3YiBkEEIAZBBEsbIgdBA3QQigEiBkUNAQJAIAEoAgwiCEUNACAGIAggAS8BCEEDdBCdBhoLIAEgBzsBCiABIAY2AgwgACgCoAIgBhCLAQsgASgCDCACQQN0aiADKQMANwMAIAEvAQggAksNACABIAU7AQgLIARBEGokAAvyAQIGfwF+IwBBIGsiAyQAIAMgAikDADcDECAAIANBEGoQjgECQAJAIAEvAQgiBEGBOEkNACADQRhqIABBDxDbAwwBCyACKQMAIQkgBEEBaiEFAkAgBCABLwEKSQ0AIAAgBUEKbEEDdiIGQQQgBkEESxsiB0EDdBCKASIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0EJ0GGgsgASAHOwEKIAEgBjYCDCAAKAKgAiAGEIsBCyABKAIMIARBA3RqIAk3AwAgAS8BCCAESw0AIAEgBTsBCAsgAyACKQMANwMIIAAgA0EIahCPASADQSBqJAALXAIBfwF+IwBBIGsiAyQAIAMgAUEDdCAAakHgAGopAwAiBDcDECADIAQ3AxggAiEBAkAgA0EQahDzAw0AIAMgAykDGDcDCCAAIANBCGoQ6QMhAQsgA0EgaiQAIAELPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHgAGopAwAiAzcDACACIAM3AwggACACEOkDIQAgAkEQaiQAIAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHgAGopAwAiAzcDACACIAM3AwggACACEOoDIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQeAAaikDACIDNwMAIAIgAzcDCCAAIAIQ6AMhBCACQRBqJAAgBAs2AQF/IwBBEGsiAiQAIAJBCGogARDkAwJAIAAoAuwBIgBFDQAgACACKQMINwMgCyACQRBqJAALNgEBfyMAQRBrIgIkACACQQhqIAEQ5QMCQCAAKALsASIBRQ0AIAEgAikDCDcDIAsgAkEQaiQACzYBAX8jAEEQayICJAAgAkEIaiABEOYDAkAgACgC7AEiAUUNACABIAIpAwg3AyALIAJBEGokAAs6AQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQ5wMCQCAAKALsASIARQ0AIAAgAikDCDcDIAsgAkEQaiQAC3oCA38BfiMAQSBrIgEkACABIAApA1giBDcDCCABIAQ3AxgCQAJAIAAgAUEIahDvAyICDQBBACEDDAELIAItAANBD3EhAwsgAiECAkACQCADQXxqDgYBAAAAAAEACyABQRBqIABBhT1BABDVA0EAIQILIAFBIGokACACCywBAX8CQCAAKAIsIgMoAuwBDQAgACACNgI0IAAgATYCMA8LIAMgAiABEQIACzwBAX8jAEEQayICJAAgAiABKQMANwMIIAAgAkEIahDxAyEBIAJBEGokACABQQ5JQbzAACABQf//AHF2cQtNAQF/AkAgAkEsSQ0AIABCADcDAA8LAkAgASACEO4CIgNBkPgAa0EMbUErSw0AIABBADYCBCAAIAJB4ABqNgIADwsgACABQQggAxDnAwuAAgECfyACIQMDQAJAIAMiAkGQ+ABrQQxtIgNBK0sNAAJAIAEgAxDuAiICQZD4AGtBDG1BK0sNACAAQQA2AgQgACADQeAAajYCAA8LIAAgAUEIIAIQ5wMPCwJAIAIgASgA5AEiAyADKAJgamsgAy8BDkEEdE8NACAAQgA3AwAPCwJAAkAgAg0AQQAhAwwBCyACLQADQQ9xIQMLAkACQCADQXxqDgYBAAAAAAEAC0GN5wBBjMcAQdgJQdMyEP8FAAsCQCACRQ0AIAIoAgBBgICA+ABxQYCAgMgARw0AIAIoAgQiBCEDIARBkPgAa0EMbUEsSQ0BCwsgACABQQggAhDnAwskAAJAIAEtABRBCkkNACABKAIIECALIAFBADsBAiABQQA6ABQLTgEDf0EAIQEDQCAAIAEiAkEYbGoiAUEUaiEDAkAgAS0AFEEKSQ0AIAEoAggQIAsgA0EAOgAAIAFBADsBAiACQQFqIgIhASACQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwvBAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBSIFQRhsai8BAg0AIAAgBUEYbGohBQwCCyAFQQFqIgYhBSAGQRRHDQALQQAhBQsgBSIGIQUCQCAGDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQIAsgB0EAOgAAIAAgBmpBADsBAiAFIQULIAUiBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAfNgIICwJAAkAgACAALwHgAyIGQRhsaiAFRw0AIAUhBQwBCwJAIABBACAGQQFqIAZBEksbIgNBGGxqIgYgBUYNACAEQQhqQRBqIgIgBUEQaiIBKQIANwMAIARBCGpBCGoiByAFQQhqIggpAgA3AwAgBCAFKQIANwMIIAEgBkEQaiIJKQIANwIAIAggBkEIaiIBKQIANwIAIAUgBikCADcCACAJIAIpAwA3AgAgASAHKQMANwIAIAYgBCkDCDcCAAsgACADOwHgAyAGIQULIARBIGokACAFDwtB59sAQYDNAEElQarEABD/BQALeQEFf0EAIQQCQANAIAYhBQJAAkAgACAEIgdBGGwiBmoiBC8BACABRw0AIAAgBmoiCC8BAiACRw0AQQAhBiAEIQQgCC8BFiADRg0BC0EBIQYgBSEECyAEIQQgBkUNASAEIQYgB0EBaiIHIQQgB0EURw0AC0EADwsgBAtGAQJ/QQAhAwNAAkAgACADIgNBGGxqIgQvAQAgAUcNACAEKAIEIAJNDQAgBEEEaiACNgIACyADQQFqIgQhAyAEQRRHDQALC1sBA39BACECA0ACQCAAIAIiA0EYbGoiAi8BACABRw0AIAJBFGohBAJAIAItABRBCkkNACACKAIIECALIARBADoAACACQQA7AQILIANBAWoiAyECIANBFEcNAAsLVQEBfwJAIAJFDQAgAyAAIAMbIgMgAEHgA2oiBE8NACADIQMDQAJAIAMiAy8BAiACRw0AIAMvAQAgAUcNACADDwsgA0EYaiIAIQMgACAESQ0ACwtBAAtdAQN/IwBBIGsiASQAQQAhAgJAIAAgAUEgELcFIgNBAEgNACADQQFqEB8hAgJAAkAgA0EgSg0AIAIgASADEJ0GGgwBCyAAIAIgAxC3BRoLIAIhAgsgAUEgaiQAIAILJAEBfwJAAkAgAQ0AQQAhAgwBCyABEMwGIQILIAAgASACELoFC9ACAQN/IwBB0ABrIgMkACADIAIpAwA3A0ggAyAAIANByABqELUDNgJEIAMgATYCQEGUGyADQcAAahA7IAEtAAAhASADIAIpAwA3AzgCQAJAIAAgA0E4ahDvAyICDQBBACEEDAELIAItAANBD3EhBAsCQAJAIARBfGoOBgABAQEBAAELIAIvAQhFDQBBICABIAFBKkcbIAEgAUEhRxsgASABQT5HG8AhBEEAIQEDQAJAIAEiAUELRw0AIAMgBDYCAEG54gAgAxA7DAILIAMgAigCDCABQQR0IgVqKQMANwMwIAMgACADQTBqELUDNgIkIAMgBDYCIEGr2QAgA0EgahA7IAMgAigCDCAFakEIaikDADcDGCADIAAgA0EYahC1AzYCFCADIAQ2AhBBwxwgA0EQahA7IAFBAWoiBSEBIAUgAi8BCEkNAAsLIANB0ABqJAAL5gMBA38jAEHgAGsiAiQAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDQQpLDQBBASADdEGoDHENASADQQhHDQAgASgCACIDRQ0AIAMoAgBBgICA+ABxQYCAgDhGDQELIAIgASkDADcDCCAAIAJBCGpBABDEAyIEIQMgBA0BIAIgASkDADcDACAAIAIQtgMhAwwBCyACIAEpAwA3A0AgACACQcAAaiACQdgAaiACQdQAahCIAyEDAkACQCACKQNYUEUNAEEAIQEMAQsgAiACKQNYNwM4AkAgACACQThqELYDIgFBsIACRg0AIAIgATYCMEGwgAJBwABByRwgAkEwahCEBhoLAkBBsIACEMwGIgFBJ0kNAEEAQQAtALhiOgCygAJBAEEALwC2YjsBsIACQQIhAQwBCyABQbCAAmpBLjoAACABQQFqIQELIAEhAQJAAkAgAigCVCIEDQAgASEBDAELIAJByABqIABBCCAEEOcDIAIgAigCSDYCICABQbCAAmpBwAAgAWtBwgsgAkEgahCEBhpBsIACEMwGIgFBsIACakHAADoAACABQQFqIQELIAIgAzYCECABIgFBsIACakHAACABa0HwwAAgAkEQahCEBhpBsIACIQMLIAJB4ABq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AEEOQcQhEPoFAAvtBwEBfyAAIAEQvAMCQCADRQ0AQQBBACgCwIECIANqNgLAgQIgAyEDIAIhAQNAIAEhASADIQMCQEEAKAK8gQIiAEHAAEcNACADQcAASQ0AQcSBAiABELcDIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAriBAiABIAMgACADIABJGyIAEJ0GGkEAQQAoAryBAiIJIABrNgK8gQIgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHEgQJB+IACELcDQQBBwAA2AryBAkEAQfiAAjYCuIECIAIhAyABIQEgAg0BDAILQQBBACgCuIECIABqNgK4gQIgAiEDIAEhASACDQALCyAIEL4DIAhBIBC8AwJAIAVFDQBBAEEAKALAgQIgBWo2AsCBAiAFIQMgBCEBA0AgASEBIAMhAwJAQQAoAryBAiIAQcAARw0AIANBwABJDQBBxIECIAEQtwMgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgCuIECIAEgAyAAIAMgAEkbIgAQnQYaQQBBACgCvIECIgkgAGs2AryBAiABIABqIQEgAyAAayECAkAgCSAARw0AQcSBAkH4gAIQtwNBAEHAADYCvIECQQBB+IACNgK4gQIgAiEDIAEhASACDQEMAgtBAEEAKAK4gQIgAGo2AriBAiACIQMgASEBIAINAAsLAkAgB0UNAEEAQQAoAsCBAiAHajYCwIECIAchAyAGIQEDQCABIQEgAyEDAkBBACgCvIECIgBBwABHDQAgA0HAAEkNAEHEgQIgARC3AyADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKAK4gQIgASADIAAgAyAASRsiABCdBhpBAEEAKAK8gQIiCSAAazYCvIECIAEgAGohASADIABrIQICQCAJIABHDQBBxIECQfiAAhC3A0EAQcAANgK8gQJBAEH4gAI2AriBAiACIQMgASEBIAINAQwCC0EAQQAoAriBAiAAajYCuIECIAIhAyABIQEgAg0ACwtBAEEAKALAgQJBAWo2AsCBAkEBIQNBwe4AIQECQANAIAEhASADIQMCQEEAKAK8gQIiAEHAAEcNACADQcAASQ0AQcSBAiABELcDIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAriBAiABIAMgACADIABJGyIAEJ0GGkEAQQAoAryB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EMcDDAgLIAQvAQQhAiAELwEGIQUgAyAELQAKNgKIASADIAU2AoQBIAMgAjYCgAEgACABQbrRACADQYABahDHAwwHCyAAQqaAgYDAADcDAAwGC0HoygBByQFBoy4Q+gUACyACKAIAQYCAAU8NBSADIAIpAwAiBzcDkAIgAyAHNwO4ASABIANBuAFqIANB3AJqEO4DIgRFDQYCQCADKALcAiICQSFJDQAgAyAENgKYASADQSA2ApQBIAMgAjYCkAEgACABQabRACADQZABahDHAwwFCyADIAQ2AqgBIAMgAjYCpAEgAyACNgKgASAAIAFBzNAAIANBoAFqEMcDDAQLIAMgASACKAIAEIMDNgLAASAAIAFBl9AAIANBwAFqEMcDDAMLIAMgAikDADcDiAICQCABIANBiAJqEP0CIgRFDQAgBC8BACECIAMgASgC5AE2AoQCIAMgA0GEAmogAkEAEIgENgKAAiAAIAFBr9AAIANBgAJqEMcDDAMLIAMgAikDADcD+AEgASADQfgBaiADQZACahD+AiECAkAgAygCkAIiBEH//wFHDQAgASACEIADIQUgASgC5AEiBCAEKAJgaiAFQQR0ai8BACEFIAMgBDYC3AEgA0HcAWogBUEAEIgEIQQgAi8BACECIAMgASgC5AE2AtgBIAMgA0HYAWogAkEAEIgENgLUASADIAQ2AtABIAAgAUHmzwAgA0HQAWoQxwMMAwsgASAEEIMDIQQgAi8BACECIAMgASgC5AE2AvQBIAMgA0H0AWogAkEAEIgENgLkASADIAQ2AuABIAAgAUHYzwAgA0HgAWoQxwMMAgtB6MoAQeEBQaMuEPoFAAsgAyACKQMANwMIIANBkAJqIAEgA0EIahDoA0EHEIIGIAMgA0GQAmo2AgAgACABQckcIAMQxwMLIANB4AJqJAAPC0GC4wBB6MoAQcwBQaMuEP8FAAtB4dYAQejKAEH0AEGSLhD/BQALowEBAn8jAEEwayIDJAAgAyACKQMANwMgAkAgASADQSBqIANBLGoQ7gMiBEUNAAJAAkAgAygCLCICQSFJDQAgAyAENgIIIANBIDYCBCADIAI2AgAgACABQabRACADEMcDDAELIAMgBDYCGCADIAI2AhQgAyACNgIQIAAgAUHM0AAgA0EQahDHAwsgA0EwaiQADwtB4dYAQejKAEH0AEGS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BCANaiAGTw0BC0EBIQAgCiEBCyABIQEgAEUNASABIQAgC0EBaiIMIQEgDCAIRw0AC0EAIQAMAQsgASEACwJAAkAgACIARQ0AIAcoAiAhASACIAQoAgA2AhwgAkEcaiAAIAcgAWprQQR1IgEQeyEMIAAoAgAhACACIAE2AhQgAiAMNgIQIAIgBiAAazYCGEGP6QAgAkEQahA7DAELIAIgBjYCAEH46AAgAhA7CyAFQQFqIgEhACABIAIoAjxJDQALCyACQcAAaiQAC80CAQJ/IwBB4ABrIgIkACACQSA2AkAgAiAAQdYCajYCREG1IyACQcAAahA7IAIgASkDADcDOEEAIQMCQCAAIAJBOGoQpwNFDQAgAiABKQMANwMwIAJB2ABqIAAgAkEwakHjABCUAwJAAkAgAikDWFBFDQBBACEDDAELIAIgAikDWDcDKCAAQc4lIAJBKGoQtANBASEDCyADIQMgAiABKQMANwMgIAJB0ABqIAAgAkEgakH2ABCUAwJAAkAgAikDUFBFDQAgAyEDDAELIAIgAikDUDcDGCAAQY44IAJBGGoQtAMgAiABKQMANwMQIAJByABqIAAgAkEQakHxABCUAwJAIAIpA0hQDQAgAiACKQNINwMIIAAgAkEIahDQAwsgA0EBaiEDCyADIQMLAkAgAw0AIAIgASkDADcDACAAQc4lIAIQtAMLIAJB4ABqJAALhwQBBn8jAEHgAGsiAyQAAkACQCAALQBFRQ0AIAMgASkDADcDQCAAQeELIANBwABqELQDDAELAkAgACgC6AENACADIAEpAwA3A1hBuCVBABA7IABBADoARSADIAMpA1g3AwAgACADENEDIABB5dQDEHYMAQsgAEEBOgBFIAAgASkDADcDOCADIAEpAwA3AzggACADQThqEKcDIQQgAkEBcQ0AIARFDQAgAyABKQMANwMwIANB2ABqIAAgA0EwakHxABCUAyADKQNYQgBSDQACQAJAIAAoAugBIgINAEEAIQUMAQsgAiECQQAhBANAIARBAWoiBCEFIAIoAgwiBiECIAQhBCAGDQALCwJAAkAgACAFIgJBECACQRBJGyIFQQF0EJQBIgdFDQACQCAAKALoASICRQ0AIAVFDQAgB0EMaiEIIAIhAkEAIQQDQCAIIAQiBEEBdGogAiICLwEEOwEAIAIoAgwiAkUNASAC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QAJAIAEoAgQNAAJAIAEoAgAOBAABAQABCyACKAIEDQBBASEEIAIoAgAOBAEAAAEACyADIAEpAwA3AwggAyACKQMANwMAIAAgA0EIaiADEPUDIQQLIANBEGokACAEC4YCAgJ/An4jAEHAAGsiAyQAAkACQCABKAIEDQAgASgCAEECRw0AIAIoAgQNAEEAIQQgAigCAEECRg0BCyADIAIpAwAiBTcDMCADIAEpAwAiBjcDKEEBIQECQCAGIAVRDQAgAyADKQMoNwMgAkAgACADQSBqEMEDDQBBACEBDAELIAMgAykDMDcDGEEAIQEgACADQRhqEMEDRQ0AIAMgAykDKDcDECAAIANBEGogA0E8ahDEAyECIAMgAykDMDcDCCAAIANBCGogA0E4ahDEAyEEQQAhAQJAIAMoAjwiACADKAI4Rw0AIAIgBCAAELcGRSEBCyABIQELIAEhBAsgA0HAAGokACAEC8ABAQJ/IwBBMGsiAyQAQQEhBAJAIAEpAwAgAikDAFENACADIAEpAwA3AyACQCAAIANBIGoQwQMNAEEAIQQMAQsgAyACKQMANwMYQQAhBCAAIANBGGoQwQNFDQAgAyABKQMANwMQIAAgA0EQaiADQSxqEMQDIQQgAyACKQMANwMIIAAgA0EIaiADQShqEMQDIQJBACEBAkAgAygCLCIAIAMoAihHDQAgBCACIAAQtwZFIQELIAEhBAsgA0EwaiQAIAQL3QECAn8CfiMAQcAAayIDJAAgA0EgaiACEMUDIAMgAykDICIFNwMwIAMgASkDACIGNwMoQQEhAgJAIAYgBVENACADIAMpAyg3AxgCQCAAIANBGGoQwQMNAEEAIQIMAQsgAyADKQMwNwMQQQAhAiAAIANBEGoQwQNFDQAgAyADKQMoNwMIIAAgA0EIaiADQTxqEMQDIQEgAyADKQMwNwMAIAAgAyADQThqEMQDIQBBACECAkAgAygCPCIEIAMoAjhHDQAgASAAIAQQtwZFIQILIAIhAgsgA0HAAGokACACC10AAkACQCACQRBPDQAgAUUNASABQYCAgAhODQEgAEEANgIEIAAgAUEEdCACckGACGo2AgAPC0H/0QBBy8sAQYADQbzDABD/BQALQafSAEHLywBBgQNBvMMAEP8FAAuNAQEBf0EAIQICQCABQf//A0sNAEHaASECAkACQAJAAkACQAJAIAFBDnYOBAMFAAECCyAAKAIAQcQAaiECQQEhAAwDCyAAKAIAQcwAaiECQQIhAAwCC0GMxgBBOUGjKhD6BQALIAAoAgBB1ABqIQJBAyEACyACKAIAIAB2IQILIAFB//8AcSACSSECCyACC28BAn8jAEEgayIBJAAgACgACCEAEOsFIQIgAUEYaiAAQf//A3E2AgAgAUEQaiAAQRh2NgIAIAFBFGogAEEQdkH/AXE2AgAgAUENNgIMIAFCgoCAgOABNwIEIAEgAjYCAEGGwQAgARA7IAFBIGokAAuGIQIMfwF+IwBBoARrIgIkAAJAAkACQCAAQQNxDQACQCABQfAATQ0AIAIgADYCmAQCQAJAIAAoAgBBxMrZmwVHDQAgACgCBEGK3KWJf0YNAQsgAkLoBzcDgARB1gogAkGABGoQO0GYeCEADAQLAkACQCAAKAIIIgNBgICAeHFBgICAEEcNACADQRB2Qf8BcUF5akEISQ0BC0HzLEEAEDsgACgACCEAEOsFIQEgAkHgA2pBGGogAEH//wNxNgIAIAJB4ANqQRBqIABBGHY2AgAgAkH0A2ogAEEQdkH/AXE2AgAgAkENNgLsAyACQoKAgIDgATcC5AMgAiABNgLgA0GGwQAgAkHgA2oQOyACQpoINwPQA0HWCiACQdADahA7QeZ3IQAMBAtBACEEIABBIGohBUEAIQMDQCADIQMgBCEGAkACQAJAIAUiBSgCACIEIAFNDQBB6QchA0GXeCEEDAELAkAgBSgCBCIHIARqIAFNDQBB6gchA0GWeCEEDAELAkAgBEEDcUUNAEHrByEDQZV4IQQMAQsCQCAHQQNxRQ0AQewHIQNBlHghBAwBCyADRQ0BIAVBeGoiB0EEaigCACAHKAIAaiAERg0BQfIHIQNBjnghBAsgAiADNgLAAyACIAUgAGs2AsQDQdYKIAJBwANqEDsgBiEHIAQhCAwECyADQQhLIgchBCAFQQhqIQUgA0EBaiIGIQMgByEHIAZBCkcNAAwDCwALQcnkAEGMxgBByQBBtwgQ/wUAC0HK3gBBjMYAQcgAQbcIEP8FAAsgCCEDAkAgB0EBcQ0AIAMhAAwBCwJAIABBNGotAABBB3FFDQAgAkLzh4CAgAY3A7ADQdYKIAJBsANqEDtBjXghAAwBCyAAIAAoAjBqIgUgBSAAKAI0aiIESSEHAkACQCAFIARJDQAgByEEIAMhBwwBCyAHIQYgAyEIIAUhCQNAIAghAyAGIQQCQAJAIAkiBikDACIOQv////9vWA0AQQshBSADIQMMAQsCQAJAIA5C////////////AINCgICAgICAgPj/AFgNAEGTCCEDQe13IQcMAQsgAkGQBGogDr8Q5ANBACEFIAMhAyACKQOQBCAOUQ0BQZQIIQNB7HchBwsgAkEwNgKkAyACIAM2AqADQdYKIAJBoANqEDtBASEFIAchAwsgBCEEIAMiAyEHAkAgBQ4MAAICAgICAgICAgIAAgsgBkEIaiIEIAAgACgCMGogACgCNGpJIgUhBiADIQggBCEJIAUhBCADIQcgBQ0ACwsgByEDAkAgBEEBcUUNACADIQAMAQsCQCAAQSRqKAIAQYDqMEkNACACQqOIgICABjcDkANB1gogAkGQA2oQO0HddyEADAELIAAgACgCIGoiBSAFIAAoAiRqIgRJIQcCQAJAIAUgBEkNACAHIQVBMCEBIAMhAwwBCwJAAkACQAJAIAUvAQggBS0ACk8NACAHIQpBMCELDAELIAVBCmohCCAFIQUgACgCKCEGIAMhCSAHIQQDQCAEIQwgCSENIAYhBiAIIQogBSIDIABrIQkCQCADKAIAIgUgAU0NACACIAk2AuQBIAJB6Qc2AuABQdYKIAJB4AFqEDsgDCEFIAkhAUGXeCEDDAULAkAgAygCBCIEIAVqIgcgAU0NACACIAk2AvQBIAJB6gc2AvABQdYKIAJB8AFqEDsgDCEFIAkhAUGWeCEDDAULAkAgBUEDcUUNACACIAk2AoQDIAJB6wc2AoADQdYKIAJBgANqEDsgDCEFIAkhAUGVeCEDDAULAkAgBEEDcUUNACACIAk2AvQCIAJB7Ac2AvACQdYKIAJB8AJqEDsgDCEFIAkhAUGUeCEDDAULAkACQCAAKAIoIgggBUsNACAFIAAoAiwgCGoiC00NAQsgAiAJNgKEAiACQf0HNgKAAkHWCiACQYACahA7IAwhBSAJIQFBg3ghAwwFCwJAAkAgCCAHSw0AIAcgC00NAQsgAiAJNgKUAiACQf0HNgKQAkHWCiACQZACahA7IAwhBSAJIQFBg3ghAwwFCwJAIAUgBkYNACACIAk2AuQCIAJB/Ac2AuACQdYKIAJB4AJqEDsgDCEFIAkhAUGEeCEDDAULAkAgBCAGaiIHQYCABEkNACACIAk2AtQCIAJBmwg2AtACQdYKIAJB0AJqEDsgDCEFIAkhAUHldyEDDAULIAMvAQwhBSACIAIoApgENgLMAgJAIAJBzAJqIAUQ+QMNACACIAk2AsQCIAJBnAg2AsACQdYKIAJBwAJqEDsgDCEFIAkhAUHkdyEDDAULAkAgAy0ACyIFQQNxQQJHDQAgAiAJNgKkAiACQbMINgKgAkHWCiACQaACahA7IAwhBSAJIQFBzXchAwwFCyANIQQCQCAFQQV0wEEHdSAFQQFxayAKLQAAakF/SiIFDQAgAiAJNgK0AiACQbQINgKwAkHWCiACQbACahA7Qcx3IQQLIAQhDSAFRQ0CIANBEGoiBSAAIAAoAiBqIAAoAiRqIgZJIQQCQCAFIAZJDQAgBCEFDAQLIAQhCiAJIQsgA0EaaiIMIQggBSEFIAchBiANIQkgBCEEIANBGGovAQAgDC0AAE8NAAsLIAIgCyIBNgLUASACQaYINgLQAUHWCiACQdABahA7IAohBSABIQFB2nchAwwCCyAMIQULIAkhASANIQMLIAMhAyABIQgCQCAFQQFxRQ0AIAMhAAwBCwJAIABB3ABqKAIAIAAgACgCWGoiBWpBf2otAABFDQAgAiAINgLEASACQaMINgLAAUHWCiACQcABahA7Qd13IQAMAQsCQAJAIAAgACgCSGoiASABIABBzABqKAIAakkiBA0AIAQhDSADIQEMAQsgBCEEIAMhByABIQYCQANAIAchCSAEIQ0CQCAGIgcoAgAiAUEBcUUNAEG2CCEBQcp3IQMMAgsCQCABIAAoAlwiA0kNAEG3CCEBQcl3IQMMAgsCQCABQQVqIANJDQBBuAghAUHIdyEDDAILAkACQAJAIAEgBSABaiIELwEAIgZqIAQvAQIiAUEDdkH+P3FqQQVqIANJDQBBuQghAUHHdyEEDAELAkAgBCABQfD/A3FBA3ZqQQRqIAZBACAEQQwQ4wMiBEF7Sw0AQQEhAyAJIQEgBEF/Sg0CQb4IIQFBwnchBAwBC0G5CCAEayEBIARBx3dqIQQLIAIgCDYCpAEgAiABNgKgAUHWCiACQaABahA7QQAhAyAEIQELIAEhAQJAIANFDQAgB0EEaiIDIAAgACgCSGogACgCTGoiCUkiDSEEIAEhByADIQYgDSENIAEhASADIAlPDQMMAQsLIA0hDSABIQEMAQsgAiAINgK0ASACIAE2ArABQdYKIAJBsAFqEDsgDSENIAMhAQsgASEGAkAgDUEBcUUNACAGIQAMAQsCQCAAQdQAaigCACIBQQFIDQAgACAAKAJQaiIEIAFqIQcgACgCXCEDIAQhAQNAAkAgASIBKAIAIgQgA0kNACACIAg2ApQBIAJBnwg2ApABQdYKIAJBkAFqEDtB4XchAAwDCwJAIAEoAgQgBGogA08NACABQQhqIgQhASAEIAdPDQIMAQsLIAIgCDYChAEgAkGgCDYCgAFB1gogAkGAAWoQO0HgdyEADAELAkACQCAAIAAoAkBqIgEgASAAQcQAaigCAGpJIgMNACADIQ0gBiEBDAELIAMhBCAGIQcgASEGA0AgByENIAQhCiAGIgkvAQAiBCEBAkAgACgCXCIGIARLDQAgAiAINgJ0IAJBoQg2AnBB1gogAkHwAGoQOyAKIQ1B33chAQwCCwJAA0ACQCABIgEgBGtByAFJIgcNACACIAg2AmQgAkGiCDYCYEHWCiACQeAAahA7Qd53IQEMAgsCQCAFIAFqLQAARQ0AIAFBAWoiAyEBIAMgBkkNAQsLIA0hAQsgASEBAkAgB0UNACAJQQJqIgMgACAAKAJAaiAAKAJEaiIJSSINIQQgASEHIAMhBiANIQ0gASEBIAMgCU8NAgwBCwsgCiENIAEhAQsgASEBAkAgDUEBcUUNACABIQAMAQsCQCAAQTxqKAIARQ0AIAIgCDYCVCACQZAINgJQQdYKIAJB0ABqEDtB8HchAAwBCyAALwEOIgNBAEchBQJAAkAgAw0AIAUhCSAIIQYgASEBDAELIAAgACgCYGohDSAFIQUgASEEQQAhBwNAIAQhBiAFIQggDSAHIgVBBHRqIgEgAGshAwJAAkACQCABQRBqIAAgACgCYGogACgCZCIEakkNAEGyCCEBQc53IQcMAQsCQAJAAkAgBQ4CAAECCwJAIAEoAgRB8////wFGDQBBpwghAUHZdyEHDAMLIAVBAUcNAQsgASgCBEHy////AUYNAEGoCCEBQdh3IQcMAQsCQCABLwEKQQJ0IgcgBEkNAEGpCCEBQdd3IQcMAQsCQCABLwEIQQN0IAdqIARNDQBBqgghAUHWdyEHDAELIAEvAQAhBCACIAIoApgENgJMAkAgAkHMAGogBBD5Aw0AQasIIQFB1XchBwwBCwJAIAEtAAJBDnFFDQBBrAghAUHUdyEHDAELAkACQCABLwEIRQ0AIA0gB2ohDCAGIQlBACEKDAELQQEhBCADIQMgBiEHDAILA0AgCSEHIAwgCiIKQQN0aiIDLwEAIQQgAiACKAKYBDYCSCADIABrIQYCQAJAIAJByABqIAQQ+QMNACACIAY2AkQgAkGtCDYCQEHWCiACQcAAahA7QQAhA0HTdyEEDAELAkACQCADLQAEQQFxDQAgByEHDAELAkACQAJAIAMvAQZBAnQiA0EEaiAAKAJkSQ0AQa4IIQRB0nchCwwBCyANIANqIgQhAwJAIAQgACAAKAJgaiAAKAJkak8NAANAAkAgAyIDLwEAIgQNAAJAIAMtAAJFDQBBrwghBEHRdyELDAQLQa8IIQRB0XchCyADLQADDQNBASEJIAchAwwECyACIAIoApgENgI8AkAgAkE8aiAEEPkDDQBBsAghBEHQdyELDAMLIANBBGoiBCEDIAQgACAAKAJgaiAAKAJkakkNAAsLQbEIIQRBz3chCwsgAiAGNgI0IAIgBDYCMEHWCiACQTBqEDtBACEJIAshAwsgAyIEIQdBACEDIAQhBCAJRQ0BC0EBIQMgByEECyAEIQcCQCADIgNFDQAgByEJIApBAWoiCyEKIAMhBCAGIQMgByEHIAsgAS8BCE8NAwwBCwsgAyEEIAYhAyAHIQcMAQsgAiADNgIkIAIgATYCIEHWCiACQSBqEDtBACEEIAMhAyAHIQcLIAchASADIQYCQCAERQ0AIAVBAWoiAyAALwEOIghJIgkhBSABIQQgAyEHIAkhCSAGIQYgASEBIAMgCE8NAgwBCwsgCCEJIAYhBiABIQELIAEhASAGIQMCQCAJQQFxRQ0AIAEhAAwBCwJAIABB7ABqKAIAIgVFDQACQAJAIAAgACgCaGoiBCgCCCAFTQ0AIAIgAzYCBCACQbUINgIAQdYKIAIQO0EAIQNBy3chAAwBCwJAIAQQqwUiBQ0AQQEhAyABIQAMAQsgAiAAKAJoNgIUIAIgBTYCEEHWCiACQRBqEDtBACEDQQAgBWshAAsgACEAIANFDQELQQAhAAsgAkGgBGokACAAC14BAn8jAEEQayICJAACQAJAIAAvAQQiAyAALwEGTw0AIAEoAuQBIQEgACADQQFqOwEEIAEgA2otAAAhAAwBCyACQQhqIAFB5AAQgQFBACEACyACQRBqJAAgAEH/AXELPAEBf0F/IQECQAJAAkAgAC0ARg4GAgAAAAABAAsgAEEAOgBGIAAgAC0ABkEQcjoABkEADwtBfiEBCyABCzUAIAAgAToARwJAIAENAAJAIAAtAEYOBgEAAAAAAQALIABBADoARiAAIAAtAAZBEHI6AAYLCz4AIAAoArACECAgAEHOAmpCADcBACAAQcgCakIANwMAIABBwAJqQgA3AwAgAEG4AmpCADcDACAAQgA3A7ACC7QCAQR/AkAgAQ0AQQAPCwJAIAFBgIAETw0AAkAgAC8BtAIiAg0AIAJBAEcPCyAAKAKwAiEDQQAhBAJAA0ACQCADIAQiBEECdGoiBS8BACABRw0AIAUgBUEEaiACIARBf3NqQQJ0EJ4GGiAALwG0AiICQQJ0IAAoArACIgNqQXxqQQA7AQAgAEHOAmpCADcBACAAQcYCakIANwEAIABBvgJqQgA3AQAgAEIANwG2AgJAIAINAEEBDwtBACEEA0ACQCADIAQiBEECdGovAQAiBUUNACAAIAVBH3FqQbYCaiIFLQAADQAgBSAEQQFqOgAACyAEQQFqIgUhBEEBIQEgBSACRw0ADAMLAAsgBEEBaiIFIQQgBSACRw0AC0EAIQELIAEPC0HbwwBB1MkAQdYAQcMQEP8FAAskAAJAIAAoAugBRQ0AIABBBBCCBA8LIAAgAC0AB0GAAXI6AAcL5AIBB38CQCAALQBHRQ0AAkAgAC0AB0ECcUUNACAAKAKwAiECIAAvAbQCIgMhBEEAIQUCQCADRQ0AQQAhBkEAIQMDQCADIQMCQAJAIAIgBiIGQQJ0aiIHLQACQQFxRQ0AIAMhAwwBCyACIANBAnRqIAcoAQA2AQAgA0EBaiEDCyAALwG0AiIHIQQgAyIDIQUgBkEBaiIIIQYgAyEDIAggB0kNAAsLIAIgBSIDQQJ0akEAIAQgA2tBAnQQnwYaIABBzgJqQgA3AQAgAEHGAmpCADcBACAAQb4CakIANwEAIABCADcBtgIgAC8BtAIiB0UNACAAKAKwAiEIQQAhAwNAAkAgCCADIgNBAnRqLwEAIgZFDQAgACAGQR9xakG2AmoiBi0AAA0AIAYgA0EBajoAAAsgA0EBaiIGIQMgBiAHRw0ACwsgAEEAOgAHIABBADYCrAIgAC0ARg0AIAAgAToARiAAEGELC9EEAQp/AkAgAUGAgARPDQACQCABDQBBfg8LAkACQAJAIAAvAbQCIgNFDQAgA0ECdCAAKAKwAiIEakF8ai8BAA0AIAQhBCADIQMMAQtBfyEFIANB7wFLDQEgA0EBdCIDQegBIANB6AFJG0EIaiIDQQJ0EB8gACgCsAIgAC8BtAJBAnQQnQYhBCAAKAKwAhAgIAAgAzsBtAIgACAENgKwAiAEIQQgAyEDCyAEIQYgAyIHQQEgB0EBSxshCEEAIQNBACEEAkADQCAEIQQCQAJAAkAgBiADIgVBAnRqIgMvAQAiCUUNACAJIAFzQR9xIQoCQAJAIARBAXFFDQAgCg0BCwJAIApFDQBBASELQQAhDCAKRSEKDAQLQQEhC0EAIQxBASEKIAkgAUkNAwsCQCAJIAFHDQAgAy0AAiACRw0AQQAhC0EBIQwMAgsgA0EEaiADIAcgBUF/c2pBAnQQngYaCyADIAE7AQAgAyACOgACQQAhC0EEIQwLIAQhCgsgCiEEIAwhAyALRQ0BIAVBAWoiBSEDIAQhBCAFIAhHDQALQQQhAwtBACEFIANBBEcNACAAQgA3AbYCIABBzgJqQgA3AQAgAEHGAmpCADcBACAAQb4CakIANwEAAkAgAC8BtAIiAQ0AQQEPCyAAKAKwAiEJQQAhAwNAAkAgCSADIgNBAnRqLwEAIgRFDQAgACAEQR9xakG2AmoiBC0AAA0AIAQgA0EBajoAAAsgA0EBaiIEIQNBASEFIAQgAUcNAAsLIAUPC0HbwwBB1MkAQYUBQawQEP8FAAu1BwILfwF+IwBBEGsiASQAAkAgACwAB0F/Sg0AIABBBBCCBAsCQCAAKALoASICRQ0AIAIhAkGAgAghAwJAA0AgAiECIANBf2oiBEUNASAALQBGDQICQAJAIAAtAEdFDQACQCAALQBIRQ0AIABBADoASAwBCyAAIAIvAQQiBUEfcWpBtgJqLQAAIgNFDQAgACgCsAIiBiADQX9qIgNBAnRqLwEAIgchCCADIQMgBSAHSQ0AA0AgAyEDAkAgBSAIQf//A3FHDQACQCAGIANBAnRqLQACQQFxRQ0AIAAoAqwCIAJHDQEgAEEIEIIEDAQLIABBARCCBAwDCyAGIANBAWoiA0ECdGovAQAiByEIIAMhAyAFIAdPDQALCwJAAkAgAi8BBCIDIAIvAQZPDQAgACgC5AEhBSACIANBAWo7AQQgBSADai0AACEDDAELIAFBCGogAEHkABCBAUEAIQMLIAMiA0H/AXEhBgJAIAPAQX9KDQAgASAGQfB+ahDlAwJAIAAtAEIiAkEQSQ0AIAFBCGogAEHlABCBAQwCCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB2ABqIAw3AwAMAQsCQCAGQd8ASQ0AIAFBCGogAEHmABCBAQwBCwJAIAZBqJIBai0AACIJQSBxRQ0AIAAgAi8BBCIDQX9qOwFAAkACQCADIAIvAQZPDQAgACgC5AEhBSACIANBAWo7AQQgBSADai0AACEDDAELIAFBCGogAEHkABCBAUEAIQMLAkACQCADQf8BcSIKQfgBTw0AIAohAwwBCyAKQQNxIQtBACEFQQAhCANAIAghCCAFIQMCQAJAIAIvAQQiBSACLwEGTw0AIAAoAuQBIQcgAiAFQQFqOwEEIAcgBWotAAAhBwwBCyABQQhqIABB5AAQgQFBACEHCyADQQFqIQUgCEEIdCAHQf8BcXIiByEIIAMgC0cNAAtBACAHayAHIApBBHEbIQMLIAAgAzYCUAsgACAALQBCOgBDAkACQCAJQRBxRQ0AIAIgAEGQkwEgBkECdGooAgARAgAgAC0AQkUNASABQQhqIABB5wAQgQEMAQsgASACIABBkJMBIAZBAnRqKAIAEQEAAkAgAC0AQiICQRBJDQAgAUEIaiAAQeUAEIEBDAELIAEpAwAhDCAAIAJBAWo6AEIgACACQQN0akHYAGogDDcDAAsgAC0ARUUNACAAENMDCyAAKALoASIFIQIgBCEDIAUNAAwCCwALIABB4dQDEHYLIAFBEGokAAsqAQF/AkAgACgC6AENAEEADwtBACEBAkAgAC0ARg0AIAAvAQhFIQELIAELJAEBf0EAIQECQCAAQdkBSw0AIABBAnRBwIsBaigCACEBCyABCyEAIAAoAgAiACAAKAJYaiAAIAAoAkhqIAFBAnRqKAIAagvBAgECfyMAQRBrIgMkACADIAAoAgA2AgwCQAJAIANBDGogARD5Aw0AAkAgAg0AQQAhAQwCCyACQQA2AgBBACEBDAELIAFB//8AcSEEAkACQAJAAkACQCABQQ52QQNxDgQBAgMAAQsgACgCACIBIAEoAlhqIAEgASgCSGogBEECdGooAgBqIQECQCACRQ0AIAIgAS8BADYCAAsgASABLwECQQN2Qf4/cWpBBGohAQwECyAAKAIAIgEgASgCUGogBEEDdGohAAJAIAJFDQAgAiAAKAIENgIACyABIAEoAlhqIAAoAgBqIQEMAwsgBEECdEHAiwFqKAIAIQEMAQsgACgCACIBIAEoAlhqIAEgASgCQGogBEEBdGovAQBqIQELIAEhAQJAIAJFDQAgAiABEMwGNgIACyABIQELIANBEGokACABC0sBAX8jAEEQayIDJAAgAyAAKALkATYCBCADQQRqIAEgAhCIBCIBIQICQCABDQAgA0EIaiAAQegAEIEBQcLuACECCyADQRBqJAAgAgtQAQF/IwBBEGsiBCQAIAQgASgC5AE2AgwCQAJAIARBDGogAkEOdCADciIBEPkDDQAgAEIANwMADAELIAAgATYCACAAQQQ2AgQLIARBEGokAAsMACAAIAJB8gAQgQELDgAgACACIAIoAlAQqAMLNgACQCABLQBCQQFGDQBBlNsAQbnHAEHPAEGp1QAQ/wUACyABQQA6AEIgASgC7AFBAEEAEHUaCzYAAkAgAS0AQkECRg0AQZTbAEG5xwBBzwBBqdUAEP8FAAsgAUEAOgBCIAEoAuwBQQFBABB1Ggs2AAJAIAEtAEJBA0YNAEGU2wBBuccAQc8AQanVABD/BQALIAFBADoAQiABKALsAUECQQAQdRoLNgACQCABLQBCQQRGDQBBlNsAQbnHAEHPAEGp1QAQ/wUACyABQQA6AEIgASgC7AFBA0EAEHUaCzYAAkAgAS0AQkEFRg0AQZTbAEG5xwBBzwBBqdUAEP8FAAsgAUEAOgBCIAEoAuwBQQRBABB1Ggs2AAJAIAEtAEJBBkYNAEGU2wBBuccAQc8AQanVABD/BQALIAFBADoAQiABKALsAUEFQQAQdRoLNgACQCABLQBCQQdGDQBBlNsAQbnHAEHPAEGp1QAQ/wUACyABQQA6AEIgASgC7AFBBkEAEHUaCzYAAkAgAS0AQkEIRg0AQZTbAEG5xwBBzwBBqdUAEP8FAAsgAUEAOgBCIAEoAuwBQQdBABB1Ggs2AAJAIAEtAEJBCUYNAEGU2wBBuccAQc8AQanVABD/BQALIAFBADoAQiABKALsAUEIQQAQdRoL+AECA38BfiMAQdAAayICJAAgAkHIAGogARDoBCACQcAAaiABEOgEIAEoAuwBQQApA+iKATcDICABIAIpA0g3AzAgAiACKQNANwMwAkAgASACQTBqEI4DIgNFDQAgAiACKQNINwMoAkAgASACQShqEMEDIgQNACACIAIpA0g3AyAgAkE4aiABIAJBIGoQyQMgAiACKQM4IgU3A0ggAiAFNwMYIAEgAkEYahCOAQsgAiACKQNINwMQAkAgASADIAJBEGoQ9wINACABKALsAUEAKQPgigE3AyALIAQNACACIAIpA0g3AwggASACQQhqEI8BCyACQdAAaiQAC14BAn8jAEEQayICJAAgASgC7AEhAyACQQhqIAEQ6AQgAyACKQMINwMgIAMgABB5AkAgAS0AR0UNACABKAKsAiAARw0AIAEtAAdBCHFFDQAgAUEIEIIECyACQRBqJAALYgEDfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJQIAEvAUBqIgNKDQAgAyEEIAMgAC8BBkgNAQsgAkEIaiABQekAEIEBQQAhBAsCQCAEIgFFDQAgACABOwEECyACQRBqJAALhQEBBH8jAEEgayICJAAgAkEQaiABEOgEIAIgAikDEDcDCCABIAJBCGoQ6gMhAwJAAkAgACgCECgCACABKAJQIAEvAUBqIgRKDQAgBCEFIAQgAC8BBkgNAQsgAkEYaiABQekAEIEBQQAhBQsCQCAFIgFFIANyDQAgACABOwEECyACQSBqJAALjwEBAX8jAEEwayIDJAAgA0EoaiACEOgEIANBIGogAhDoBAJAIAMoAiRBj4DA/wdxDQAgAygCIEGgf2pBK0sNACADIAMpAyA3AxAgA0EYaiACIANBEGpB2AAQlAMgAyADKQMYNwMgCyADIAMpAyg3AwggAyADKQMgNwMAIAAgAiADQQhqIAMQhgMgA0EwaiQAC44BAQJ/IwBBIGsiAyQAIAIoAlAhBCADIAIoAuQBNgIMAkACQCADQQxqIARBgIABciIEEPkDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEBEO4CIQQgAyADKQMQNwMAIAAgAiAEIAMQiwMgA0EgaiQAC1UBAn8jAEEQayICJAAgAkEIaiABEOgEAkACQCABKAJQIgMgACgCEC8BCEkNACACIAFB7wAQgQEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ6AQCQAJAIAEoAlAiAyABKALkAS8BDEkNACACIAFB8QAQgQEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALYQEDfyMAQSBrIgIkACACQRhqIAEQ6AQgARDpBCEDIAEQ6QQhBCACQRBqIAFBARDrBAJAIAIpAxBQDQAgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEcLIAJBIGokAAsOACAAQQApA/iKATcDAAs3AQF/AkAgAigCUCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQfMAEIEBCzgBAX8CQCACKAJQIgMgAigC5AEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQfYAEIEBC3EBAX8jAEEgayIDJAAgA0EYaiACEOgEIAMgAykDGDcDEAJAAkACQCADQRBqEMIDDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahDoAxDkAwsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEOgEIANBEGogAhDoBCADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQmAMgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEOgEIAJBIGogARDoBCACQRhqIAEQ6AQgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhCZAyACQTBqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDoBCADIAMpAyA3AyggAigCUCEEIAMgAigC5AE2AhwCQAJAIANBHGogBEGAgAFyIgQQ+QMNACADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQCADKQMwQgBSDQAgA0E4aiACQfoAEIEBCwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQlgMLIANBwABqJAALxAEBAn8jAEHAAGsiAyQAIANBIGogAhDoBCADIAMpAyA3AyggAigCUCEEIAMgAigC5AE2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DQACQEEALQCOkQJFDQBBABDyBTcCkJECQYyRAhD1BUGMkQIQlAYaEOUFQYyRAhD4BQsPC0HgywBBvQFByywQ+gUACwYAQYiTAgtPAgF+An8CQAJAIAC9IgFCNIinQf8PcSICQf8PRg0AQQQhAyACDQFBAkEDIAFC////////////AINQGw8LIAFC/////////weDUCEDCyADCwQAIAALjgQBA38CQCACQYAESQ0AIAAgASACEBEgAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQcAAaiEBIAJBwABqIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQAMAgsACwJAIANBBE8NACAAIQIMAQsCQCADQXxqIgQgAE8NACAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLAkAgAiADTw0AA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAAL9wIBAn8CQCAAIAFGDQACQCABIAAgAmoiA2tBACACQQF0a0sNACAAIAEgAhCdBg8LIAEgAHNBA3EhBAJAAkACQCAAIAFPDQACQCAERQ0AIAAhAwwDCwJAIABBA3ENACAAIQMMAgsgACEDA0AgAkUNBCADIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiADQQFqIgNBA3FFDQIMAAsACwJAIAQNAAJAIANBA3FFDQADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIAJBfGoiAkEDSw0ACwsgAkUNAANAIAMgAS0AADoAACADQQFqIQMgAUEBaiEBIAJBf2oiAg0ACwsgAAvyAgIDfwF+AkAgAkUNACAAIAE6AAAgAiAAaiIDQX9qIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0F9aiABOgAAIANBfmogAToAACACQQdJDQAgACABOgADIANBfGogAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkF8aiABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBeGogATYCACACQXRqIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQXBqIAE2AgAgAkFsaiABNgIAIAJBaGogATYCACACQWRqIAE2AgAgBCADQQRxQRhyIgVrIgJBIEkNACABrUKBgICAEH4hBiADIAVqIQEDQCABIAY3AxggASAGNwMQIAEgBjcDCCABIAY3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsgAAsEAEEBCwIAC70CAQN/AkAgAA0AQQAhAQJAQQAoAoyTAkUNAEEAKAKMkwIQogYhAQsCQEEAKAKQ7wFFDQBBACgCkO8BEKIGIAFyIQELAkAQuAYoAgAiAEUNAANAQQAhAgJAIAAoAkxBAEgNACAAEKAGIQILAkAgACgCFCAAKAIcRg0AIAAQogYgAXIhAQsCQCACRQ0AIAAQoQYLIAAoAjgiAA0ACwsQuQYgAQ8LQQAhAgJAIAAoAkxBAEgNACAAEKAGIQILAkACQAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQYAGiAAKAIUDQBBfyEBIAINAQwCCwJAIAAoAgQiASAAKAIIIgNGDQAgACABIANrrEEBIAAoAigREQAaC0EAIQEgAEEANgIcIABCADcDECAAQgA3AgQgAkUNAQsgABChBgsgAQuyBAIEfgJ/AkACQCABvSICQgGGIgNQDQAgARCkBiEEIAC9IgVCNIinQf8PcSIGQf8PRg0AIARC////////////AINCgYCAgICAgPj/AFQNAQsgACABoiIBIAGjDwsCQCAFQgGGIgQgA1YNACAARAAAAAAAAAAAoiAAIAQgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAFQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIAVBASAGa62GIQMMAQsgBUL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIEQgBTDQADQCAHQX9qIQcgBEIBhiIEQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkAgAyACfSIEQgBTDQAgBCEDIARCAFINACAARAAAAAAAAAAAog8LIANCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAIAMgAn0iBEIAUw0AIAQhAyAEQgBSDQAgAEQAAAAAAAAAAKIPCwJAAkAgA0L/////////B1gNACADIQQMAQsDQCAGQX9qIQYgA0KAgICAgICABFQhByADQgGGIgQhAyAHDQALCyAFQoCAgICAgICAgH+DIQMCQAJAIAZBAUgNACAEQoCAgICAgIB4fCAGrUI0hoQhBAwBCyAEQQEgBmutiCEECyAEIAOEvwsFACAAvQsOACAAKAI8IAEgAhC2BgvlAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQYgA0EQaiEEQQIhBwJAAkACQAJAAkAgACgCPCADQRBqQQIgA0EMahASEOMGRQ0AIAQhBQwBCwNAIAYgAygCDCIBRg0CAkAgAUF/Sg0AIAQhBQwECyAEIAEgBCgCBCIISyIJQQN0aiIFIAUoAgAgASAIQQAgCRtrIghqNgIAIARBDEEEIAkbaiIEIAQoAgAgCGs2AgAgBiABayEGIAUhBCAAKAI8IAUgByAJayIHIANBDGoQEhDjBkUNAAsLIAZBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACIQEMAQtBACEBIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAIAdBAkYNACACIAUoAgRrIQELIANB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AwAiAyAEIAMQ7AYgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgAkL///////////8AgyIJIAMgBEL///////////8AgyIKEOoGQQBKDQACQCABIAkgAyAKEOoGRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEPQGIAVB+ABqKQMAIQIgBSkDcCEEDAELIARCMIinQf//AXEhBgJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABD0BiAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ9AYgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEPQGIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABD0BiAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDAwz8Q9AYgBUHIAGopAwAhAiAFKQNAIQQMAQsgCkL///////8/gyAIIAZyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQACxwAIAAgAkL///////////8AgzcDCCAAIAE3AwALjgkCBn8DfiMAQTBrIgQkAEIAIQoCQAJAIAJBAksNACABQQRqIQUgAkECdCICQdztAWooAgAhBiACQdDtAWooAgAhBwNAAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ1QYhAgsgAhDWBg0A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gICAgICAf4MhCgJAIAZB//8BSA0AIApCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogAiAEIAZB/wBqEOkGIAUgAiAEQQEgBmsQ8wYgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhAiAFQQhqKQMAIQQLIAJCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCAKhCEEIAKnQQdxIQYCQAJAAkACQAJAEPEGDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgCkIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgClAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEPIGGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC+cQAgV/D34jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ6QZBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDpBiAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABD1BiAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABD1BiAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABD1BiAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABD1BiAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABD1BiAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABD1BiAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABD1BiAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABD1BiAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABD1BiAFQZABaiADQg+GQgAgBEIAEPUGIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ9QYgBUGAAWpCASACfUIAIARCABD1BiAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYiFEIgiCIEfiIVIAFCAYYiFkIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECAVVK0gECAPQv////8PgyIPIAFCP4giFyALQgGGhEL/////D4MiC358IhEgEFStfCANIAR+fCAPIAR+IhUgCyANfnwiECAVVK1CIIYgEEIgiIR8IBEgEEIghnwiECARVK18IBAgEkL/////D4MiEiALfiIVIAIgCn58IhEgFVStIBEgDyAWQv7///8PgyIVfnwiGCARVK18fCIRIBBUrXwgESASIAR+IhAgFSANfnwiBCACIAt+fCINIA8gCn58Ig9CIIggBCAQVK0gDSAEVK18IA8gDVStfEIghoR8IgQgEVStfCAEIBggAiAVfiICIBIgCn58IgpCIIggCiACVK1CIIaEfCICIBhUrSACIA9CIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AVg0AIBQgF4QhEyAFQdAAaiACIAQgAyAOEPUGIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEPUGIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFgsCQCAGQf//AUgNACAMQoCAgICAgMD//wCEIQxCACEBDAELAkACQCAGQQFIDQAgDUIBhiAKQj+IhCENIAatQjCGIARC////////P4OEIQ8gCkIBhiEEDAELAkAgBkGPf0oNAEIAIQEMAgsgBUHAAGogAiAEQQEgBmsQ8wYgBUEwaiAWIBMgBkHwAGoQ6QYgBUEgaiADIA4gBSkDQCICIAVBwABqQQhqKQMAIg8Q9QYgBUEwakEIaikDACAFQSBqQQhqKQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABD1BiAFIAMgDkIFQgAQ9QYgDyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEOkGIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEOkGIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ6QYgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ6QYgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ6QZBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ6QYgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIANCMYggCkIPhiIUhEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQf8ASw0AIAVBMGogEiABIAZB/wBqIgYQ6QYgBUEgaiACIAQgBhDpBiAFQRBqIBIgASAHEPMGIAUgAiAEIAcQ8wYgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwCC0IAIQEMAgsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCICIAFCIIgiBH58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAR+fCIDQiCIfCADQv////8PgyACIAF+fCIBQiCIfDcDCCAAIAFCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEOgGIAUpAwAhBCAAIAVBCGopAwA3AwggACAENwMAIAVBEGokAAvkAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDpBiACIAAgBEGB+AAgA2sQ8wYgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELBAAjAAsUAEGQlwYkA0GQlwJBD2pBcHEkAgsHACMAIwJrCwQAIwMLBAAjAgsNACABIAIgAyAAEREACyUBAX4gACABIAKtIAOtQiCGhCAEEIMHIQUgBUIgiKcQ+QYgBacLEwAgACABpyABQiCIpyACIAMQFAsL/vKBgAADAEGACAvo5QFpbmZpbml0eQAtSW5maW5pdHkAISBFeGNlcHRpb246IE91dE9mTWVtb3J5AGlzUmVhZE9ubHkAZGV2c192ZXJpZnkAc3RyaW5naWZ5AHN0bXQyX2NhbGxfYXJyYXkAbGFyZ2UgcGFyYW1ldGVycyBhcnJheQBFeHBlY3Rpbmcgc3RyaW5nLCBidWZmZXIgb3IgYXJyYXkAaXNBcnJheQBkZWxheQBzZXR1cF9jdHgAaGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABkZXZzX3NwZWNfaWR4AG1heAAhIGJsb2NrIGNvcnJ1cHRpb246ICVwIG9mZj0ldSB2PSV4AFdTU0stSDogZXJyb3Igb24gY21kPSV4AFdTU0stSDogc2VuZCBjbWQ9JXgAbWV0aG9kOiVkOiV4AGRiZzogdW5oYW5kbGVkOiAleC8leAAhIHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleAAhIHN0ZXAgZnJhbWUgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABzcGVjIG1pc3Npbmc6ICV4AFdTU0stSDogc3RyZWFtaW5nOiAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAISBkb3VibGUgdGhyb3cAcG93AGZzdG9yOiBmb3JtYXR0aW5nIG5vdwBjaHVuayBvdmVyZmxvdwAhIEV4Y2VwdGlvbjogU3RhY2tPdmVyZmxvdwBibGl0Um93AGpkX3dzc2tfbmV3AGpkX3dlYnNvY2tfbmV3AGV4cHIxX25ldwBkZXZzX2pkX3NlbmRfcmF3AGlkaXYAcHJldgAuYXBwLmdpdGh1Yi5kZXYAJXMldQB0aHJvdzolZEAldQBmc3Rvcjogbm8gZnJlZSBwYWdlczsgc3o9JXUAZnN0b3I6IG91dCBvZiBzcGFjZTsgc3o9JXUAYnVmZmVyIHdyaXRlIGF0ICV1LCBsZW49JXUAJXM6JXUAZnN0b3I6IHRvbyBsYXJnZTogJXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABVbmV4cGVjdGVkIGVuZCBvZiBKU09OIGlucHV0AHNldFRpbWVvdXQAY2xlYXJUaW1lb3V0AHN0b3BfbGlzdABkaWdlc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAcmVzdGFydABkZXZzX2ZpYmVyX3N0YXJ0AChjb25zdCB1aW50OF90ICopKGxhc3RfZW50cnkgKyAxKSA8PSBkYXRhX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABkZWNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAISBleHBlY3Rpbmcgc3RhY2ssIGdvdABwcmludABkZXZzX3ZtX3NldF9icmVha3BvaW50AGRldnNfdm1fY2xlYXJfYnJlYWtwb2ludABkZXZzX3V0ZjhfY29kZV9wb2ludABqZF9jbGllbnRfZW1pdF9ldmVudAB0Y3Bzb2NrX29uX2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABfc29ja2V0T25FdmVudABqZF90eF9mcmFtZV9zZW50AGN1cnJlbnQAZGV2c19wYWNrZXRfc3BlY19wYXJlbnQAbGFzdC1lbnQAdmFyaWFudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGJnOiBoYWx0AG1hc2tlZCBzZXJ2ZXIgcGt0AGpkX2ZzdG9yX2luaXQAZGV2c21ncl9pbml0AGRjZmdfaW5pdABibGl0AHdhaXQAaGVpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAX29uU2VydmVyUGFja2V0AF9vblBhY2tldABnZXQAaXNSZWdTZXQAaXNSZWdHZXQAZGV2c19nZXRfYnVpbHRpbl9vYmplY3QAYSBidWlsdGluIGZyb3plbiBvYmplY3QAZmlsbFJlY3QAcGFyc2VGbG9hdABkZXZzY2xvdWQ6IGludmFsaWQgY2xvdWQgdXBsb2FkIGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAamRpZjogcm9sZSAnJXMnIGFscmVhZHkgZXhpc3RzAGpkX3JvbGVfc2V0X2hpbnRzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwAweDF4eHh4eHh4IGV4cGVjdGVkIGZvciBzZXJ2aWNlIGNsYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAaWR4IDw9IGN0eC0+bnVtX3BpbnMAR1BJTzogaW5pdDogJWQgcGlucwBlcXVhbHMAbWlsbGlzAGZsYWdzAHNlbmRfdmFsdWVzAGRjZmc6IGluaXRlZCwgJWQgZW50cmllcywgJXUgYnl0ZXMAY2FwYWJpbGl0aWVzAGlkeCA8IGN0eC0+aW1nLmhlYWRlci0+bnVtX3NlcnZpY2Vfc3BlY3MAcGlwZXMgaW4gc3BlY3MAYWJzAGV2ZXJ5TXMAZGV2cy1rZXktJS1zACogY29ubmVjdGlvbiBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byAlczovLyVzOiVkJXMAc2VsZi1kZXZpY2U6ICVzLyVzACMgJXUgJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAKiBzdGFydDogJXMgJXMAKiBjb25uZWN0ZWQgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAJXMgZmllbGRzIG9mICVzACVzIGZpZWxkICclcycgb2YgJXMAY2xlYXIgcm9sZSAlcwAlYyAlcwA+ICVzAG1haW46IGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAD4gJXM6ICVzAFdTOiBlcnJvcjogJXMAV1NTSzogZXJyb3I6ICVzAGJhZCByZXNwOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBVbmtub3duIGVuY29kaW5nOiAlcwBmc3RvcjogbW91bnQgZmFpbHVyZTogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzACVjICAgICVzAHdzc2tfY29ubnN0cgBuIDw9IHdzLT5tc2dwdHIAZmFpbF9wdHIAbWFya19wdHIAd3JpdGUgZXJyAF9sb2dSZXByAGNvbnN0cnVjdG9yAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgBpc1NpbXVsYXRvcgB0YWcgZXJyb3IAc29jayB3cml0ZSBlcnJvcgBTeW50YXhFcnJvcgBUeXBlRXJyb3IAUmFuZ2VFcnJvcgBmbG9vcgBzZXJ2ZXIASlNPTi5wYXJzZSByZXZpdmVyAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAG1ncjogc3RhcnRpbmcgY2xvdWQgYWRhcHRlcgBtZ3I6IGRldk5ldHdvcmsgbW9kZSAtIGRpc2FibGUgY2xvdWQgYWRhcHRlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAGRldnNfbWFwbGlrZV9pdGVyAGRlcGxveV9oYW5kbGVyAHN0YXJ0X3BrdF9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAY2xhc3NJZGVudGlmaWVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAG11dGFibGUgQnVmZmVyAHNwaVhmZXIAZnN0b3I6IG5vIHNwYWNlIGZvciBoZWFkZXIASlNPTi5zdHJpbmdpZnkgcmVwbGFjZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGluc3RhbnRpYXRlZCByb2xlIG1lbWJlcgBmcmVlX2ZpYmVyAEZpYmVyAGZsYXNoX2Jhc2VfYWRkcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAGJwcABwb3AAISBFeGNlcHRpb246IEluZmluaXRlTG9vcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAc2xlZXAAZGV2c19tYXBsaWtlX2lzX21hcABkZXZzX2R1bXBfaGVhcAB2YWxpZGF0ZV9oZWFwAERldlMtU0hBMjU2OiAlKnAAISBHQy1wdHIgdmFsaWRhdGlvbiBlcnJvcjogJXMgcHRyPSVwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGludmFsaWQgdGFnOiAleCBhdCAlcAAhIGhkOiAlcABkZXZzX21hcGxpa2VfZ2V0X3Byb3RvAGdldF9zdGF0aWNfYnVpbHRfaW5fcHJvdG8AZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfaW5zcGVjdF90bwBzbWFsbCBoZWxsbwBncGlvAGpkX3NydmNmZ19ydW4AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgAhIFVuaGFuZGxlZCBleGNlcHRpb24AKiBFeGNlcHRpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAGN0b3IgZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgBfaTJjVHJhbnNhY3Rpb24AaXNBY3Rpb24AbmV3IHVuc3VwcG9ydGVkIG9uIHRoaXMgZXhwcmVzc2lvbgBAdmVyc2lvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAGpkX3NldHRpbmdzX3NldF9iaW4AbWFpbgBtZXRoMV9Ec1NlcnZpY2VTcGVjX2Fzc2lnbgBtZ3I6IHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AX3NvY2tldE9wZW4AZnN0b3I6IGdjIGRvbmUsICVkIGZyZWUsICVkIGdlbgBuYW4AYm9vbGVhbgBmcm9tAHJhbmRvbQBmaWxsUmFuZG9tAGFlcy0yNTYtY2NtAGZsYXNoX3Byb2dyYW0AKiBzdG9wIHByb2dyYW0AaW11bAB1bmtub3duIGN0cmwAbm9uLWZpbiBjdHJsAHRvbyBsYXJnZSBjdHJsAG51bGwAZmlsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxhYmVsAHNldEludGVydmFsAGNsZWFySW50ZXJ2YWwAc2lnbmFsAG5vbi1taW5pbWFsAD9zcGVjaWFsAGRldk5ldHdvcmsAZGV2c19pbWdfc3RyaWR4X29rAGRldnNfZ2NfYWRkX2NodW5rAG1hcmtfYmxvY2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABvdmVybGFwc1dpdGgAZGV2c191dGY4X2NvZGVfcG9pbnRfbGVuZ3RoAHN6ID09IHMtPmxlbmd0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAGxlbiA9PSBzLT5pbm5lci5sZW5ndGgASW52YWxpZCBhcnJheSBsZW5ndGgAc2l6ZSA+PSBsZW5ndGgAc2V0TGVuZ3RoAGJ5dGVMZW5ndGgAd2lkdGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABkb19mbHVzaABkZXZzX3N0cmluZ19maW5pc2gAISB2ZXJzaW9uIG1pc21hdGNoAGVuY3J5cHRpb24gdGFnIG1pc21hdGNoAGZvckVhY2gAcCA8IGNoAHNoaWZ0X21zZwBzbWFsbCBtc2cAbmVlZCBmdW5jdGlvbiBhcmcAKnByb2cAbG9nAGNhbid0IHBvbmcAc2V0dGluZwBnZXR0aW5nAGJvZHkgbWlzc2luZwBEQ0ZHIG1pc3NpbmcAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nAF9kY2ZnU3RyaW5nACFxX3NlbmRpbmcAJXMgdG9vIGJpZwBkZXZzX2dwaW9faW5pdF9kY2ZnACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3N0cmluZ192c3ByaW50ZgBkZXZzX3ZhbHVlX3R5cGVvZgBzZWxmACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgB5X29mZgBmbmlkeCA8PSAweGZmZmYAbm9uIGZmADAxMjM0NTY3ODlhYmNkZWYAaW5kZXhPZgBzZXRQcm90b3R5cGVPZgBnZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAYmxvY2tfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBmbGFzaF9zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAHN6ID09IHMtPmlubmVyLnNpemUAc3RhdGUub2ZmICsgMyA8PSBzaXplAGEgcHJpbWl0aXZlAGRldnNfbGVhdmUAdHJ1ZQBleHBhbmRfa2V5X3ZhbHVlAHByb3RvX3ZhbHVlAGRldnNfbWFwbGlrZV90b192YWx1ZQBqc29uX3ZhbHVlAGV4cGFuZF92YWx1ZQA/dmFsdWUAd3JpdGUAX3NvY2tldFdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBjYXVzZQBkZXZzX2pzb25fcGFyc2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBfc29ja2V0Q2xvc2UAd2Vic29jayByZXNwb25zZQBfY29tbWFuZFJlc3BvbnNlAG1ncjogcnVubmluZyBzZXQgdG8gZmFsc2UAZmxhc2hfZXJhc2UAdG9Mb3dlckNhc2UAdG9VcHBlckNhc2UAZGV2c19tYWtlX2Nsb3N1cmUAc3BpQ29uZmlndXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG1haW46IG9wZW5pbmcgZGVwbG95IHBpcGUAbWFpbjogY2xvc2VkIGRlcGxveSBwaXBlAGNsb25lAEdQSU86IGluaXQgdXNlZCBkb25lAGlubGluZQBkcmF3TGluZQBkYmc6IHJlc3VtZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBXUzogY2xvc2UgZnJhbWUAcHJvcF9GdW5jdGlvbl9uYW1lAEBuYW1lAGRldk5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQBfYWxsb2NSb2xlAGZpbGxDaXJjbGUAbmV0d29yayBub3QgYXZhaWxhYmxlAHJlY29tcHV0ZV9jYWNoZQBtYXJrX2xhcmdlAGJ1ZmZlciBzdG9yZSBvdXQgb2YgcmFuZ2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlACogIG1lc3NhZ2UAX3R3aW5NZXNzYWdlAGltYWdlAGRyYXdJbWFnZQBkcmF3VHJhbnNwYXJlbnRJbWFnZQBzcGlTZW5kSW1hZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZnN0b3I6IG1vdW50ZWQ7ICVkIGZyZWUAbW9kZQBtZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlAGRlY29kZQBzZXRNb2RlAGV2ZW50Q29kZQBmcm9tQ2hhckNvZGUAcmVnQ29kZQBpbWdfc3RyaWRlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAFNlcnZlckludGVyZmFjZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZAAhIHNlcnZpY2UgJXM6JWQgbm90IGZvdW5kAGJvdW5kAGlzQm91bmQAcm9sZW1ncl9hdXRvYmluZABqZGlmOiBhdXRvYmluZABkZXZzX21hcGxpa2VfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAc3VzcGVuZABfc2VydmVyU2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAHNlbmRDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAaG9zdCBvciBwb3J0IGludmFsaWQAYnVmZmVyIG51bWZtdCBpbnZhbGlkAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZAByZWFkX2luZGV4ZWQAKiBSRVNUQVJUIHJlcXVlc3RlZABub3RJbXBsZW1lbnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAb25Db25uZWN0ZWQAZGF0YV9wYWdlX3VzZWQAcm9sZSBuYW1lICclcycgYWxyZWFkeSB1c2VkAHRyYW5zcG9zZWQAZmliZXIgYWxyZWFkeSBkaXNwb3NlZAAqIGNvbm5lY3Rpb24gdG8gJXMgY2xvc2VkAFdTU0stSDogc3RyZWFtaW5nIGV4cGlyZWQAZGV2c192YWx1ZV9pc19waW5uZWQAdGhyb3dpbmcgbnVsbC91bmRlZmluZWQAcmVhZF9uYW1lZAAldSBwYWNrZXRzIHRocm90dGxlZAAlcyBjYWxsZWQAZGV2TmV0d29yayBlbmFibGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZABmaWJlciBub3Qgc3VzcGVuZGVkAFdTU0stSDogZXhjZXB0aW9uIHVwbG9hZGVkAHBheWxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAc2hvcnRJZABwcm9kdWN0SWQAaW52YWxpZCBkaW1lbnNpb25zICVkeCVkeCVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluX29iajolZAAqICVzIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAb25seSBvbmUgdmFsdWUgZXhwZWN0ZWQ7IGdvdCAlZABpbnZhbGlkIG9mZnNldCAlZAAhIGNhbid0IHZhbGlkYXRlIG1mciBjb25maWcgYXQgJXAsIGVycm9yICVkAEdQSU86ICVzKCVkKSBzZXQgdG8gJWQAVW5leHBlY3RlZCB0b2tlbiAnJWMnIGluIEpTT04gYXQgcG9zaXRpb24gJWQAZGJnOiBzdXNwZW5kICVkAGpkaWY6IGNyZWF0ZSByb2xlICclcycgLT4gJWQAV1M6IGhlYWRlcnMgZG9uZTsgJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAGRldnNfZ2V0X3Byb3BlcnR5X2Rlc2MAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHBjID09IChkZXZzX3BjX3QpcGMAZGV2c19zdHJpbmdfam1wX3RyeV9hbGxvYwBkZXZzZGJnX3BpcGVfYWxsb2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGZsYXNoIHN5bmMAZnVuMV9EZXZpY2VTY3JpcHRfX3BhbmljAGJhZCBtYWdpYwBqZF9mc3Rvcl9nYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBmc3RvcjogZ2MAZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVjAFBhY2tldFNwZWMAU2VydmljZVNwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L2ltcGxfc29ja2V0LmMAZGV2aWNlc2NyaXB0L2luc3BlY3QuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAZGV2aWNlc2NyaXB0L2ltcGxfZHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfZnN0b3IuYwBkZXZpY2VzY3JpcHQvZGV2c21nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC9pbXBsX2dwaW8uYwBkZXZpY2VzY3JpcHQvanNvbi5jAGRldmljZXNjcmlwdC9pbXBsX2Z1bmN0aW9uLmMAZGV2aWNlc2NyaXB0L25ldHdvcmsvd2Vic29ja19jb25uLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBkZXZpY2VzY3JpcHQvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBkZXZpY2VzY3JpcHQvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfc3J2Y2ZnLmMAamFjZGFjLWMvc291cmNlL2pkX2RjZmcuYwBkZXZpY2VzY3JpcHQvZGV2c2RiZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvaW1wbF9pbWFnZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L2ltcGxfcGFja2V0c3BlYy5jAGRldmljZXNjcmlwdC9pbXBsX3NlcnZpY2VzcGVjLmMAZGV2aWNlc2NyaXB0L3V0ZjguYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBtZ3I6IGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAb25fZGF0YQBleHBlY3RpbmcgdG9waWMgYW5kIGRhdGEAX19uZXdfXwBfX3Byb3RvX18AX19zdGFja19fAF9fZnVuY19fAFtUaHJvdzogJXhdAFtGaWJlcjogJXhdAFtSb2xlOiAlcy4lc10AW1BhY2tldFNwZWM6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAFtTZXJ2aWNlU3BlYzogJXNdAFtDaXJjdWxhcl0AW0J1ZmZlclsldV0gJSpwXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJSpwLi4uXQBbSW1hZ2U6ICVkeCVkICglZCBicHApXQBmbGlwWQBmbGlwWABpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVABleHBlY3RpbmcgQ09OVABkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19QQUNLRVQAY21kLT5wa3QtPnNlcnZpY2VfY29tbWFuZCA9PSBKRF9ERVZTX0RCR19DTURfUkVBRF9JTkRFWEVEX1ZBTFVFUwAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMARlNUT1JfREFUQV9QQUdFUyA8PSBKRF9GU1RPUl9NQVhfREFUQV9QQUdFUwBkZXZzX2djX3RhZyhiKSA9PSBERVZTX0dDX1RBR19CVUZGRVIAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AZXhwZWN0aW5nIEJJTgBwa3QgIT0gTlVMTABzZXR0aW5ncyAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABmbGFzaF9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFdTU0sAKHRtcC52MCAmIEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0spICE9IEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ESUNBVE9SX01BU0sAU1BJAERJU0NPTk5FQ1RJTkcAc3ogPT0gbGVuICYmIHN6IDwgREVWU19NQVhfQVNDSUlfU1RSSU5HAG1ncjogd291bGQgcmVzdGFydCBkdWUgdG8gRENGRwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBmbGFzaF9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAHdzLT5tc2dwdHIgPD0gTUFYX01FU1NBR0UATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAEkyQwA/Pz8AJWMgICVzID0+AGludDoAYXBwOgB3c3NrOgB1dGY4AHNpemUgPiBzaXplb2YoY2h1bmtfdCkgKyAxMjgAdXRmLTgAc2hhMjU2AGNudCA9PSAzIHx8IGNudCA9PSAtMwBsZW4gPT0gbDIAbG9nMgBkZXZzX2FyZ19pbWcyAFNRUlQxXzIAU1FSVDIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAHNpemUgPj0gMgBXUzogZ290IDEwMQBIVFRQLzEuMSAxMDEAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBsb2cxMABMTjEwAHNpemUgPCAweGYwMDAAbnVtX2VsdHMgPCAxMDAwAGF1dGggbm9uLTAAc3ogPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3ogPj0gMABpZHggPj0gMAByID49IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAamRfc3J2Y2ZnX2lkeCA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAY3R4LT5zdGFja190b3AgPT0gMABldmVudF9zY29wZSA9PSAwAHN0cltzel0gPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwACgodG1wLnYwIDw8IDEpICYgfihKRF9ERVZTX0RCR19TVFJJTkdfU1RBVElDX0lOREVYX01BU0spKSA9PSAwACgodG1wLnRhZyA8PCAyNCkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfVEFHX01BU0spKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAHdzczovLwBwaW5zLgA/LgAlYyAgLi4uACEgIC4uLgAsAHBhY2tldCA2NGsrACFkZXZzX2luX3ZtX2xvb3AoY3R4KQBkZXZzX2hhbmRsZV9pc19wdHIodikAZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAZGV2c19oYW5kbGVfdHlwZSh2KSA9PSBERVZTX0hBTkRMRV9UWVBFX0dDX09CSkVDVCAmJiBkZXZzX2lzX3N0cmluZyhjdHgsIHYpAGVuY3J5cHRlZCBkYXRhIChsZW49JXUpIHNob3J0ZXIgdGhhbiB0YWdMZW4gKCV1KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAobWFwKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAHN0YXRzOiAlZCBvYmplY3RzLCAlZCBCIHVzZWQsICVkIEIgZnJlZSAoJWQgQiBtYXggYmxvY2spAGRldnNfaXNfbWFwKG9iaikAZmlkeCA8IChpbnQpZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaXNfbGFyZ2UoZSkAR1BJTzogc2tpcCAlcyAtPiAlZCAodXNlZCkAISBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpAEdQSU86IGluaXRbJXVdICVzIC0+ICVkICg9JWQpACEgRXhjZXB0aW9uOiBQYW5pY18lZCBhdCAoZ3BjOiVkKQAqICBhdCB1bmtub3duIChncGM6JWQpACogIGF0ICVzX0YlZCAocGM6JWQpACEgIGF0ICVzX0YlZCAocGM6JWQpAGFjdDogJXNfRiVkIChwYzolZCkAISBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJU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IHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaFNhdmUpIE1vZHVsZS5mbGFzaFNhdmUoSEVBUFU4LnNsaWNlKHN0YXJ0LCBzdGFydCArIHNpemUpKTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoY29uc3Qgdm9pZCAqZnJhbWUsIHVuc2lnbmVkIHN6KTw6Oj57IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAoY29uc3QgY2hhciAqaG9zdG5hbWUsIGludCBwb3J0KTw6Oj57IHJldHVybiBNb2R1bGUuc29ja09wZW4oaG9zdG5hbWUsIHBvcnQpOyB9AChjb25zdCB2b2lkICpidWYsIHVuc2lnbmVkIHNpemUpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrV3JpdGUoYnVmLCBzaXplKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tDbG9zZSgpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja0lzQXZhaWxhYmxlKCk7IH0AAIiKgYAABG5hbWUBl4kBhgcADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX3NpemUCDWVtX2ZsYXNoX2xvYWQDBWFib3J0BBNlbV9zZW5kX2xhcmdlX2ZyYW1lBRNfZGV2c19wYW5pY19oYW5kbGVyBhFlbV9kZXBsb3lfaGFuZGxlcgcXZW1famRfY3J5cHRvX2dldF9yYW5kb20IDWVtX3NlbmRfZnJhbWUJBGV4aXQKC2VtX3RpbWVfbm93Cw5lbV9wcmludF9kbWVzZwwPX2pkX3RjcHNvY2tfbmV3DRFfamRfdGNwc29ja193cml0ZQ4RX2pkX3RjcHNvY2tfY2xvc2UPGF9qZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsVEV9fd2FzbV9jYWxsX2N0b3JzFg9mbGFzaF9iYXNlX2FkZHIXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGgpmbGFzaF9pbml0Gwhod19wYW5pYxwIamRfYmxpbmsdB2pkX2dsb3ceFGpkX2FsbG9jX3N0YWNrX2NoZWNrHwhqZF9hbGxvYyAHamRfZnJlZSENdGFyZ2V0X2luX2lycSISdGFyZ2V0X2Rpc2FibGVfaXJxIxF0YXJnZXRfZW5hYmxlX2lycSQYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJRVkZXZzX3NlbmRfbGFyZ2VfZnJhbWUmEmRldnNfcGFuaWNfaGFuZGxlcicTZGV2c19kZXBsb3lfaGFuZGxlcigUamRfY3J5cHRvX2dldF9yYW5kb20pEGpkX2VtX3NlbmRfZnJhbWUqGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZywKamRfZW1faW5pdC0NamRfZW1fcHJvY2Vzcy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MzDGh3X2RldmljZV9pZDQMdGFyZ2V0X3Jlc2V0NQ50aW1fZ2V0X21pY3JvczYPYXBwX3ByaW50X2RtZXNnNxJqZF90Y3Bzb2NrX3Byb2Nlc3M4EWFwcF9pbml0X3NlcnZpY2VzORJkZXZzX2NsaWVudF9kZXBsb3k6FGNsaWVudF9ldmVudF9oYW5kbGVyOwlhcHBfZG1lc2c8C2ZsdXNoX2RtZXNnPQthcHBfcHJvY2Vzcz4OamRfdGNwc29ja19uZXc/EGpkX3RjcHNvY2tfd3JpdGVAEGpkX3RjcHNvY2tfY2xvc2VBF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlQhZqZF9lbV90Y3Bzb2NrX29uX2V2ZW50Qwd0eF9pbml0RA9qZF9wYWNrZXRfcmVhZHlFCnR4X3Byb2Nlc3NGDXR4X3NlbmRfZnJhbWVHDmRldnNfYnVmZmVyX29wSBJkZXZzX2J1ZmZlcl9kZWNvZGVJEmRldnNfYnVmZmVyX2VuY29kZUoPZGV2c19jcmVhdGVfY3R4SwlzZXR1cF9jdHhMCmRldnNfdHJhY2VND2RldnNfZXJyb3JfY29kZU4ZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlck8JY2xlYXJfY3R4UA1kZXZzX2ZyZWVfY3R4UQhkZXZzX29vbVIJZGV2c19mcmVlUxFkZXZzY2xvdWRfcHJvY2Vzc1QXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRVEGRldnNjbG91ZF91cGxvYWRWFGRldnNjbG91ZF9vbl9tZXNzYWdlVw5kZXZzY2xvdWRfaW5pdFgUZGV2c190cmFja19leGNlcHRpb25ZD2RldnNkYmdfcHJvY2Vzc1oRZGV2c2RiZ19yZXN0YXJ0ZWRbFWRldnNkYmdfaGFuZGxlX3BhY2tldFwLc2VuZF92YWx1ZXNdEXZhbHVlX2Zyb21fdGFnX3YwXhlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXw1vYmpfZ2V0X3Byb3BzYAxleHBhbmRfdmFsdWVhEmRldnNkYmdfc3VzcGVuZF9jYmIMZGV2c2RiZ19pbml0YxBleHBhbmRfa2V5X3ZhbHVlZAZrdl9hZGRlD2RldnNtZ3JfcHJvY2Vzc2YHdHJ5X3J1bmcHcnVuX2ltZ2gMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udgpkZXZzX3BhbmljdxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYIBGGRldnNfZmliZXJfZ2V0X21heF9zbGVlcIMBD2RldnNfZmliZXJfcG9rZYQBEWRldnNfZ2NfYWRkX2NodW5rhQEWZGV2c19nY19vYmpfY2hlY2tfY29yZYYBE2pkX2djX2FueV90cnlfYWxsb2OHAQdkZXZzX2djiAEPZmluZF9mcmVlX2Jsb2NriQESZGV2c19hbnlfdHJ5X2FsbG9jigEOZGV2c190cnlfYWxsb2OLAQtqZF9nY191bnBpbowBCmpkX2djX2ZyZWWNARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZI4BDmRldnNfdmFsdWVfcGlujwEQZGV2c192YWx1ZV91bnBpbpABEmRldnNfbWFwX3RyeV9hbGxvY5EBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5IBFGRldnNfYXJyYXlfdHJ5X2FsbG9jkwEaZGV2c19idWZmZXJfdHJ5X2FsbG9jX2luaXSUARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OVARVkZXZzX3N0cmluZ190cnlfYWxsb2OWARBkZXZzX3N0cmluZ19wcmVwlwESZGV2c19zdHJpbmdfZmluaXNomAEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSZAQ9kZXZzX2djX3NldF9jdHiaAQ5kZXZzX2djX2NyZWF0ZZsBD2RldnNfZ2NfZGVzdHJveZwBEWRldnNfZ2Nfb2JqX2NoZWNrnQEOZGV2c19kdW1wX2hlYXCeAQtzY2FuX2djX29iap8BEXByb3BfQXJyYXlfbGVuZ3RooAESbWV0aDJfQXJyYXlfaW5zZXJ0oQESZnVuMV9BcnJheV9pc0FycmF5ogEUbWV0aFhfQXJyYXlfX19jdG9yX1+jARBtZXRoWF9BcnJheV9wdXNopAEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlpQERbWV0aFhfQXJyYXlfc2xpY2WmARBtZXRoMV9BcnJheV9qb2lupwERZnVuMV9CdWZmZXJfYWxsb2OoARBmdW4yX0J1ZmZlcl9mcm9tqQEScHJvcF9CdWZmZXJfbGVuZ3RoqgEVbWV0aDFfQnVmZmVyX3RvU3RyaW5nqwETbWV0aDNfQnVmZmVyX2ZpbGxBdKwBE21ldGg0X0J1ZmZlcl9ibGl0QXStARRtZXRoM19CdWZmZXJfaW5kZXhPZq4BF21ldGgwX0J1ZmZlcl9maWxsUmFuZG9trwEUbWV0aDRfQnVmZmVyX2VuY3J5cHSwARJmdW4zX0J1ZmZlcl9kaWdlc3SxARRkZXZzX2NvbXB1dGVfdGltZW91dLIBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwswEXZnVuMV9EZXZpY2VTY3JpcHRfZGVsYXm0ARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWO1ARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3S2ARlmdW4wX0RldmljZVNjcmlwdF9yZXN0YXJ0twEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0uAEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnS5ARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0ugEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnS7ARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcrwBHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nvQEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlzvgEiZnVuMV9EZXZpY2VTY3JpcHRfZGV2aWNlSWRlbnRpZmllcr8BHWZ1bjJfRGV2aWNlU2NyaXB0X19zZXJ2ZXJTZW5kwAEcZnVuMl9EZXZpY2VTY3JpcHRfX2FsbG9jUm9sZcEBIGZ1bjBfRGV2aWNlU2NyaXB0X25vdEltcGxlbWVudGVkwgEeZnVuMl9EZXZpY2VTY3JpcHRfX3R3aW5NZXNzYWdlwwEhZnVuM19EZXZpY2VTY3JpcHRfX2kyY1RyYW5zYWN0aW9uxAEeZnVuNV9EZXZpY2VTY3JpcHRfc3BpQ29uZmlndXJlxQEZZnVuMl9EZXZpY2VTY3JpcHRfc3BpWGZlcsYBHmZ1bjNfRGV2aWNlU2NyaXB0X3NwaVNlbmRJbWFnZccBFG1ldGgxX0Vycm9yX19fY3Rvcl9fyAEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX8kBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX8oBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fywEPcHJvcF9FcnJvcl9uYW1lzAERbWV0aDBfRXJyb3JfcHJpbnTNAQ9wcm9wX0RzRmliZXJfaWTOARZwcm9wX0RzRmliZXJfc3VzcGVuZGVkzwEUbWV0aDFfRHNGaWJlcl9yZXN1bWXQARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZdEBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmTSARFmdW4wX0RzRmliZXJfc2VsZtMBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ01AEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXVARJwcm9wX0Z1bmN0aW9uX25hbWXWARNkZXZzX2dwaW9faW5pdF9kY2Zn1wEJaW5pdF91c2Vk2AEOcHJvcF9HUElPX21vZGXZARZwcm9wX0dQSU9fY2FwYWJpbGl0aWVz2gEPcHJvcF9HUElPX3ZhbHVl2wESbWV0aDFfR1BJT19zZXRNb2Rl3AEQcHJvcF9JbWFnZV93aWR0aN0BEXByb3BfSW1hZ2VfaGVpZ2h03gEOcHJvcF9JbWFnZV9icHDfARFwcm9wX0ltYWdlX2J1ZmZlcuABEGZ1bjVfSW1hZ2VfYWxsb2PhAQ9tZXRoM19JbWFnZV9zZXTiAQxkZXZzX2FyZ19pbWfjAQdzZXRDb3Jl5AEPbWV0aDJfSW1hZ2VfZ2V05QEQbWV0aDFfSW1hZ2VfZmlsbOYBCWZpbGxfcmVjdOcBFG1ldGg1X0ltYWdlX2ZpbGxSZWN06AESbWV0aDFfSW1hZ2VfZXF1YWxz6QERbWV0aDBfSW1hZ2VfY2xvbmXqAQ1hbGxvY19pbWdfcmV06wERbWV0aDBfSW1hZ2VfZmxpcFjsAQdwaXhfcHRy7QERbWV0aDBfSW1hZ2VfZmxpcFnuARZtZXRoMF9JbWFnZV90cmFuc3Bvc2Vk7wEVbWV0aDNfSW1hZ2VfZHJhd0ltYWdl8AENZGV2c19hcmdfaW1nMvEBDWRyYXdJbWFnZUNvcmXyASBtZXRoNF9JbWFnZV9kcmF3VHJhbnNwYXJlbnRJbWFnZfMBGG1ldGgzX0ltYWdlX292ZXJsYXBzV2l0aPQBFG1ldGg1X0ltYWdlX2RyYXdMaW5l9QEIZHJhd0xpbmX2ARNtYWtlX3dyaXRhYmxlX2ltYWdl9wELZHJhd0xpbmVMb3f4AQxkcmF3TGluZUhpZ2j5ARNtZXRoNV9JbWFnZV9ibGl0Um93+gERbWV0aDExX0ltYWdlX2JsaXT7ARZtZXRoNF9JbWFnZV9maWxsQ2lyY2xl/AEPZnVuMl9KU09OX3BhcnNl/QETZnVuM19KU09OX3N0cmluZ2lmef4BDmZ1bjFfTWF0aF9jZWls/wEPZnVuMV9NYXRoX2Zsb29ygAIPZnVuMV9NYXRoX3JvdW5kgQINZnVuMV9NYXRoX2Fic4ICEGZ1bjBfTWF0aF9yYW5kb22DAhNmdW4xX01hdGhfcmFuZG9tSW50hAINZnVuMV9NYXRoX2xvZ4UCDWZ1bjJfTWF0aF9wb3eGAg5mdW4yX01hdGhfaWRpdocCDmZ1bjJfTWF0aF9pbW9kiAIOZnVuMl9NYXRoX2ltdWyJAg1mdW4yX01hdGhfbWluigILZnVuMl9taW5tYXiLAg1mdW4yX01hdGhfbWF4jAISZnVuMl9PYmplY3RfYXNzaWdujQIQZnVuMV9PYmplY3Rfa2V5c44CE2Z1bjFfa2V5c19vcl92YWx1ZXOPAhJmdW4xX09iamVjdF92YWx1ZXOQAhpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZpECFW1ldGgxX09iamVjdF9fX2N0b3JfX5ICHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm93kwIScHJvcF9Ec1BhY2tldF9yb2xllAIecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVylQIVcHJvcF9Ec1BhY2tldF9zaG9ydElklgIacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXiXAhxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5kmAITcHJvcF9Ec1BhY2tldF9mbGFnc5kCF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5kmgIWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydJsCFXByb3BfRHNQYWNrZXRfcGF5bG9hZJwCFXByb3BfRHNQYWNrZXRfaXNFdmVudJ0CF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2RlngIWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldJ8CFnByb3BfRHNQYWNrZXRfaXNSZWdHZXSgAhVwcm9wX0RzUGFja2V0X3JlZ0NvZGWhAhZwcm9wX0RzUGFja2V0X2lzQWN0aW9uogIVZGV2c19wa3Rfc3BlY19ieV9jb2RlowIScHJvcF9Ec1BhY2tldF9zcGVjpAIRZGV2c19wa3RfZ2V0X3NwZWOlAhVtZXRoMF9Ec1BhY2tldF9kZWNvZGWmAh1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZKcCGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudKgCFnByb3BfRHNQYWNrZXRTcGVjX25hbWWpAhZwcm9wX0RzUGFja2V0U3BlY19jb2RlqgIacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2WrAhltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlrAISZGV2c19wYWNrZXRfZGVjb2RlrQIVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkrgIURHNSZWdpc3Rlcl9yZWFkX2NvbnSvAhJkZXZzX3BhY2tldF9lbmNvZGWwAhZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlsQIWcHJvcF9Ec1BhY2tldEluZm9fcm9sZbICFnByb3BfRHNQYWNrZXRJbmZvX25hbWWzAhZwcm9wX0RzUGFja2V0SW5mb19jb2RltAIYbWV0aFhfRHNDb21tYW5kX19fZnVuY19ftQITcHJvcF9Ec1JvbGVfaXNCb3VuZLYCEHByb3BfRHNSb2xlX3NwZWO3AhhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmS4AiJwcm9wX0RzU2VydmljZVNwZWNfY2xhc3NJZGVudGlmaWVyuQIXcHJvcF9Ec1NlcnZpY2VTcGVjX25hbWW6AhptZXRoMV9Ec1NlcnZpY2VTcGVjX2xvb2t1cLsCGm1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduvAIdZnVuMl9EZXZpY2VTY3JpcHRfX3NvY2tldE9wZW69AhB0Y3Bzb2NrX29uX2V2ZW50vgIeZnVuMF9EZXZpY2VTY3JpcHRfX3NvY2tldENsb3NlvwIeZnVuMV9EZXZpY2VTY3JpcHRfX3NvY2tldFdyaXRlwAIScHJvcF9TdHJpbmdfbGVuZ3RowQIWcHJvcF9TdHJpbmdfYnl0ZUxlbmd0aMICF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0wwITbWV0aDFfU3RyaW5nX2NoYXJBdMQCEm1ldGgyX1N0cmluZ19zbGljZcUCGGZ1blhfU3RyaW5nX2Zyb21DaGFyQ29kZcYCFG1ldGgzX1N0cmluZ19pbmRleE9mxwIYbWV0aDBfU3RyaW5nX3RvTG93ZXJDYXNlyAITbWV0aDBfU3RyaW5nX3RvQ2FzZckCGG1ldGgwX1N0cmluZ190b1VwcGVyQ2FzZcoCDGRldnNfaW5zcGVjdMsCC2luc3BlY3Rfb2JqzAIHYWRkX3N0cs0CDWluc3BlY3RfZmllbGTOAhRkZXZzX2pkX2dldF9yZWdpc3Rlcs8CFmRldnNfamRfY2xlYXJfcGt0X2tpbmTQAhBkZXZzX2pkX3NlbmRfY21k0QIQZGV2c19qZF9zZW5kX3Jhd9ICE2RldnNfamRfc2VuZF9sb2dtc2fTAhNkZXZzX2pkX3BrdF9jYXB0dXJl1AIRZGV2c19qZF93YWtlX3JvbGXVAhJkZXZzX2pkX3Nob3VsZF9ydW7WAhNkZXZzX2pkX3Byb2Nlc3NfcGt01wIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lk2AIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXZAhJkZXZzX2pkX2FmdGVyX3VzZXLaAhRkZXZzX2pkX3JvbGVfY2hhbmdlZNsCFGRldnNfamRfcmVzZXRfcGFja2V03AISZGV2c19qZF9pbml0X3JvbGVz3QISZGV2c19qZF9mcmVlX3JvbGVz3gISZGV2c19qZF9hbGxvY19yb2xl3wIVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz4AIXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3PhAhVkZXZzX2dldF9nbG9iYWxfZmxhZ3PiAg9qZF9uZWVkX3RvX3NlbmTjAhBkZXZzX2pzb25fZXNjYXBl5AIVZGV2c19qc29uX2VzY2FwZV9jb3Jl5QIPZGV2c19qc29uX3BhcnNl5gIKanNvbl92YWx1ZecCDHBhcnNlX3N0cmluZ+gCE2RldnNfanNvbl9zdHJpbmdpZnnpAg1zdHJpbmdpZnlfb2Jq6gIRcGFyc2Vfc3RyaW5nX2NvcmXrAgphZGRfaW5kZW507AIPc3RyaW5naWZ5X2ZpZWxk7QIRZGV2c19tYXBsaWtlX2l0ZXLuAhdkZXZzX2dldF9idWlsdGluX29iamVjdO8CEmRldnNfbWFwX2NvcHlfaW50b/ACDGRldnNfbWFwX3NldPECBmxvb2t1cPICE2RldnNfbWFwbGlrZV9pc19tYXDzAhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXP0AhFkZXZzX2FycmF5X2luc2VydPUCCGt2X2FkZC4x9gISZGV2c19zaG9ydF9tYXBfc2V09wIPZGV2c19tYXBfZGVsZXRl+AISZGV2c19zaG9ydF9tYXBfZ2V0+QIgZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY19pZHj6AhxkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVj+wIbZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVj/AIeZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWNfaWR4/QIaZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWP+AhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldP8CGGRldnNfcm9sZV9zcGVjX2Zvcl9jbGFzc4ADF2RldnNfcGFja2V0X3NwZWNfcGFyZW50gQMOZGV2c19yb2xlX3NwZWOCAxFkZXZzX3JvbGVfc2VydmljZYMDDmRldnNfcm9sZV9uYW1lhAMSZGV2c19nZXRfYmFzZV9zcGVjhQMQZGV2c19zcGVjX2xvb2t1cIYDEmRldnNfZnVuY3Rpb25fYmluZIcDEWRldnNfbWFrZV9jbG9zdXJliAMOZGV2c19nZXRfZm5pZHiJAxNkZXZzX2dldF9mbmlkeF9jb3JligMYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkiwMYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kjAMTZGV2c19nZXRfc3BlY19wcm90b40DE2RldnNfZ2V0X3JvbGVfcHJvdG+OAxtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnePAxVkZXZzX2dldF9zdGF0aWNfcHJvdG+QAxtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+RAx1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bZIDFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+TAxhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSUAx5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSVAxBkZXZzX2luc3RhbmNlX29mlgMPZGV2c19vYmplY3RfZ2V0lwMMZGV2c19zZXFfZ2V0mAMMZGV2c19hbnlfZ2V0mQMMZGV2c19hbnlfc2V0mgMMZGV2c19zZXFfc2V0mwMOZGV2c19hcnJheV9zZXScAxNkZXZzX2FycmF5X3Bpbl9wdXNonQMRZGV2c19hcmdfaW50X2RlZmyeAwxkZXZzX2FyZ19pbnSfAw1kZXZzX2FyZ19ib29soAMPZGV2c19hcmdfZG91YmxloQMPZGV2c19yZXRfZG91YmxlogMMZGV2c19yZXRfaW50owMNZGV2c19yZXRfYm9vbKQDD2RldnNfcmV0X2djX3B0cqUDEWRldnNfYXJnX3NlbGZfbWFwpgMRZGV2c19zZXR1cF9yZXN1bWWnAw9kZXZzX2Nhbl9hdHRhY2ioAxlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlqQMVZGV2c19tYXBsaWtlX3RvX3ZhbHVlqgMSZGV2c19yZWdjYWNoZV9mcmVlqwMWZGV2c19yZWdjYWNoZV9mcmVlX2FsbKwDF2RldnNfcmVnY2FjaGVfbWFya191c2VkrQMTZGV2c19yZWdjYWNoZV9hbGxvY64DFGRldnNfcmVnY2FjaGVfbG9va3VwrwMRZGV2c19yZWdjYWNoZV9hZ2WwAxdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZbEDEmRldnNfcmVnY2FjaGVfbmV4dLIDD2pkX3NldHRpbmdzX2dldLMDD2pkX3NldHRpbmdzX3NldLQDDmRldnNfbG9nX3ZhbHVltQMPZGV2c19zaG93X3ZhbHVltgMQZGV2c19zaG93X3ZhbHVlMLcDDWNvbnN1bWVfY2h1bmu4Aw1zaGFfMjU2X2Nsb3NluQMPamRfc2hhMjU2X3NldHVwugMQamRfc2hhMjU2X3VwZGF0ZbsDEGpkX3NoYTI1Nl9maW5pc2i8AxRqZF9zaGEyNTZfaG1hY19zZXR1cL0DFWpkX3NoYTI1Nl9obWFjX3VwZGF0Zb4DFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaL8DDmpkX3NoYTI1Nl9oa2RmwAMOZGV2c19zdHJmb3JtYXTBAw5kZXZzX2lzX3N0cmluZ8IDDmRldnNfaXNfbnVtYmVywwMbZGV2c19zdHJpbmdfZ2V0X3V0Zjhfc3RydWN0xAMUZGV2c19zdHJpbmdfZ2V0X3V0ZjjFAxNkZXZzX2J1aWx0aW5fc3RyaW5nxgMUZGV2c19zdHJpbmdfdnNwcmludGbHAxNkZXZzX3N0cmluZ19zcHJpbnRmyAMVZGV2c19zdHJpbmdfZnJvbV91dGY4yQMUZGV2c192YWx1ZV90b19zdHJpbmfKAxBidWZmZXJfdG9fc3RyaW5nywMZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZMwDEmRldnNfc3RyaW5nX2NvbmNhdM0DEWRldnNfc3RyaW5nX3NsaWNlzgMSZGV2c19wdXNoX3RyeWZyYW1lzwMRZGV2c19wb3BfdHJ5ZnJhbWXQAw9kZXZzX2R1bXBfc3RhY2vRAxNkZXZzX2R1bXBfZXhjZXB0aW9u0gMKZGV2c190aHJvd9MDEmRldnNfcHJvY2Vzc190aHJvd9QDEGRldnNfYWxsb2NfZXJyb3LVAxVkZXZzX3Rocm93X3R5cGVfZXJyb3LWAxhkZXZzX3Rocm93X2dlbmVyaWNfZXJyb3LXAxZkZXZzX3Rocm93X3JhbmdlX2Vycm9y2AMeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y2QMaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LaAx5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTbAxhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LcAxdkZXZzX3Rocm93X3N5bnRheF9lcnJvct0DEWRldnNfc3RyaW5nX2luZGV43gMSZGV2c19zdHJpbmdfbGVuZ3Ro3wMZZGV2c191dGY4X2Zyb21fY29kZV9wb2ludOADG2RldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aOEDFGRldnNfdXRmOF9jb2RlX3BvaW504gMUZGV2c19zdHJpbmdfam1wX2luaXTjAw5kZXZzX3V0ZjhfaW5pdOQDFmRldnNfdmFsdWVfZnJvbV9kb3VibGXlAxNkZXZzX3ZhbHVlX2Zyb21faW505gMUZGV2c192YWx1ZV9mcm9tX2Jvb2znAxdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcugDFGRldnNfdmFsdWVfdG9fZG91Ymxl6QMRZGV2c192YWx1ZV90b19pbnTqAxJkZXZzX3ZhbHVlX3RvX2Jvb2zrAw5kZXZzX2lzX2J1ZmZlcuwDF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl7QMQZGV2c19idWZmZXJfZGF0Ye4DE2RldnNfYnVmZmVyaXNoX2RhdGHvAxRkZXZzX3ZhbHVlX3RvX2djX29iavADDWRldnNfaXNfYXJyYXnxAxFkZXZzX3ZhbHVlX3R5cGVvZvIDD2RldnNfaXNfbnVsbGlzaPMDGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWT0AxRkZXZzX3ZhbHVlX2FwcHJveF9lcfUDEmRldnNfdmFsdWVfaWVlZV9lcfYDDWRldnNfdmFsdWVfZXH3AxxkZXZzX3ZhbHVlX2VxX2J1aWx0aW5fc3RyaW5n+AMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj+QMSZGV2c19pbWdfc3RyaWR4X29r+gMSZGV2c19kdW1wX3ZlcnNpb25z+wMLZGV2c192ZXJpZnn8AxFkZXZzX2ZldGNoX29wY29kZf0DDmRldnNfdm1fcmVzdW1l/gMRZGV2c192bV9zZXRfZGVidWf/AxlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzgAQYZGV2c192bV9jbGVhcl9icmVha3BvaW50gQQMZGV2c192bV9oYWx0ggQPZGV2c192bV9zdXNwZW5kgwQWZGV2c192bV9zZXRfYnJlYWtwb2ludIQEFGRldnNfdm1fZXhlY19vcGNvZGVzhQQPZGV2c19pbl92bV9sb29whgQaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiHBBdkZXZzX2ltZ19nZXRfc3RyaW5nX2ptcIgEEWRldnNfaW1nX2dldF91dGY4iQQUZGV2c19nZXRfc3RhdGljX3V0ZjiKBBRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIsEDGV4cHJfaW52YWxpZIwEFGV4cHJ4X2J1aWx0aW5fb2JqZWN0jQQLc3RtdDFfY2FsbDCOBAtzdG10Ml9jYWxsMY8EC3N0bXQzX2NhbGwykAQLc3RtdDRfY2FsbDORBAtzdG10NV9jYWxsNJIEC3N0bXQ2X2NhbGw1kwQLc3RtdDdfY2FsbDaUBAtzdG10OF9jYWxsN5UEC3N0bXQ5X2NhbGw4lgQSc3RtdDJfaW5kZXhfZGVsZXRllwQMc3RtdDFfcmV0dXJumAQJc3RtdHhfam1wmQQMc3RtdHgxX2ptcF96mgQKZXhwcjJfYmluZJsEEmV4cHJ4X29iamVjdF9maWVsZJwEEnN0bXR4MV9zdG9yZV9sb2NhbJ0EE3N0bXR4MV9zdG9yZV9nbG9iYWyeBBJzdG10NF9zdG9yZV9idWZmZXKfBAlleHByMF9pbmagBBBleHByeF9sb2FkX2xvY2FsoQQRZXhwcnhfbG9hZF9nbG9iYWyiBAtleHByMV91cGx1c6MEC2V4cHIyX2luZGV4pAQPc3RtdDNfaW5kZXhfc2V0pQQUZXhwcngxX2J1aWx0aW5fZmllbGSmBBJleHByeDFfYXNjaWlfZmllbGSnBBFleHByeDFfdXRmOF9maWVsZKgEEGV4cHJ4X21hdGhfZmllbGSpBA5leHByeF9kc19maWVsZKoED3N0bXQwX2FsbG9jX21hcKsEEXN0bXQxX2FsbG9jX2FycmF5rAQSc3RtdDFfYWxsb2NfYnVmZmVyrQQXZXhwcnhfc3RhdGljX3NwZWNfcHJvdG+uBBNleHByeF9zdGF0aWNfYnVmZmVyrwQbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nsAQZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7EEGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7IEFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrMEDWV4cHJ4X2xpdGVyYWy0BBFleHByeF9saXRlcmFsX2Y2NLUEEWV4cHIzX2xvYWRfYnVmZmVytgQNZXhwcjBfcmV0X3ZhbLcEDGV4cHIxX3R5cGVvZrgED2V4cHIwX3VuZGVmaW5lZLkEEmV4cHIxX2lzX3VuZGVmaW5lZLoECmV4cHIwX3RydWW7BAtleHByMF9mYWxzZbwEDWV4cHIxX3RvX2Jvb2y9BAlleHByMF9uYW6+BAlleHByMV9hYnO/BA1leHByMV9iaXRfbm90wAQMZXhwcjFfaXNfbmFuwQQJZXhwcjFfbmVnwgQJZXhwcjFfbm90wwQMZXhwcjFfdG9faW50xAQJZXhwcjJfYWRkxQQJZXhwcjJfc3VixgQJZXhwcjJfbXVsxwQJZXhwcjJfZGl2yAQNZXhwcjJfYml0X2FuZMkEDGV4cHIyX2JpdF9vcsoEDWV4cHIyX2JpdF94b3LLBBBleHByMl9zaGlmdF9sZWZ0zAQRZXhwcjJfc2hpZnRfcmlnaHTNBBpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZM4ECGV4cHIyX2VxzwQIZXhwcjJfbGXQBAhleHByMl9sdNEECGV4cHIyX25l0gQQZXhwcjFfaXNfbnVsbGlzaNMEFHN0bXR4Ml9zdG9yZV9jbG9zdXJl1AQTZXhwcngxX2xvYWRfY2xvc3VyZdUEEmV4cHJ4X21ha2VfY2xvc3VyZdYEEGV4cHIxX3R5cGVvZl9zdHLXBBNzdG10eF9qbXBfcmV0X3ZhbF962AQQc3RtdDJfY2FsbF9hcnJhedkECXN0bXR4X3RyedoEDXN0bXR4X2VuZF90cnnbBAtzdG10MF9jYXRjaNwEDXN0bXQwX2ZpbmFsbHndBAtzdG10MV90aHJvd94EDnN0bXQxX3JlX3Rocm933wQQc3RtdHgxX3Rocm93X2ptcOAEDnN0bXQwX2RlYnVnZ2Vy4QQJZXhwcjFfbmV34gQRZXhwcjJfaW5zdGFuY2Vfb2bjBApleHByMF9udWxs5AQPZXhwcjJfYXBwcm94X2Vx5QQPZXhwcjJfYXBwcm94X25l5gQTc3RtdDFfc3RvcmVfcmV0X3ZhbOcEEWV4cHJ4X3N0YXRpY19zcGVj6AQPZGV2c192bV9wb3BfYXJn6QQTZGV2c192bV9wb3BfYXJnX3UzMuoEE2RldnNfdm1fcG9wX2FyZ19pMzLrBBZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy7AQSamRfYWVzX2NjbV9lbmNyeXB07QQSamRfYWVzX2NjbV9kZWNyeXB07gQMQUVTX2luaXRfY3R47wQPQUVTX0VDQl9lbmNyeXB08AQQamRfYWVzX3NldHVwX2tlefEEDmpkX2Flc19lbmNyeXB08gQQamRfYWVzX2NsZWFyX2tlefMEDmpkX3dlYnNvY2tfbmV39AQXamRfd2Vic29ja19zZW5kX21lc3NhZ2X1BAxzZW5kX21lc3NhZ2X2BBNqZF90Y3Bzb2NrX29uX2V2ZW509wQHb25fZGF0YfgEC3JhaXNlX2Vycm9y+QQJc2hpZnRfbXNn+gQQamRfd2Vic29ja19jbG9zZfsEC2pkX3dzc2tfbmV3/AQUamRfd3Nza19zZW5kX21lc3NhZ2X9BBNqZF93ZWJzb2NrX29uX2V2ZW50/gQHZGVjcnlwdP8EDWpkX3dzc2tfY2xvc2WABRBqZF93c3NrX29uX2V2ZW50gQULcmVzcF9zdGF0dXOCBRJ3c3NraGVhbHRoX3Byb2Nlc3ODBRR3c3NraGVhbHRoX3JlY29ubmVjdIQFGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldIUFD3NldF9jb25uX3N0cmluZ4YFEWNsZWFyX2Nvbm5fc3RyaW5nhwUPd3Nza2hlYWx0aF9pbml0iAURd3Nza19zZW5kX21lc3NhZ2WJBRF3c3NrX2lzX2Nvbm5lY3RlZIoFFHdzc2tfdHJhY2tfZXhjZXB0aW9uiwUSd3Nza19zZXJ2aWNlX3F1ZXJ5jAUccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZY0FFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWOBQ9yb2xlbWdyX3Byb2Nlc3OPBRByb2xlbWdyX2F1dG9iaW5kkAUVcm9sZW1ncl9oYW5kbGVfcGFja2V0kQUUamRfcm9sZV9tYW5hZ2VyX2luaXSSBRhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSTBRFqZF9yb2xlX3NldF9oaW50c5QFDWpkX3JvbGVfYWxsb2OVBRBqZF9yb2xlX2ZyZWVfYWxslgUWamRfcm9sZV9mb3JjZV9hdXRvYmluZJcFE2pkX2NsaWVudF9sb2dfZXZlbnSYBRNqZF9jbGllbnRfc3Vic2NyaWJlmQUUamRfY2xpZW50X2VtaXRfZXZlbnSaBRRyb2xlbWdyX3JvbGVfY2hhbmdlZJsFEGpkX2RldmljZV9sb29rdXCcBRhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WdBRNqZF9zZXJ2aWNlX3NlbmRfY21kngURamRfY2xpZW50X3Byb2Nlc3OfBQ5qZF9kZXZpY2VfZnJlZaAFF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0oQUPamRfZGV2aWNlX2FsbG9jogUQc2V0dGluZ3NfcHJvY2Vzc6MFFnNldHRpbmdzX2hhbmRsZV9wYWNrZXSkBQ1zZXR0aW5nc19pbml0pQUOdGFyZ2V0X3N0YW5kYnmmBQ9qZF9jdHJsX3Byb2Nlc3OnBRVqZF9jdHJsX2hhbmRsZV9wYWNrZXSoBQxqZF9jdHJsX2luaXSpBRRkY2ZnX3NldF91c2VyX2NvbmZpZ6oFCWRjZmdfaW5pdKsFDWRjZmdfdmFsaWRhdGWsBQ5kY2ZnX2dldF9lbnRyea0FE2RjZmdfZ2V0X25leHRfZW50cnmuBQxkY2ZnX2dldF9pMzKvBQxkY2ZnX2dldF9waW6wBQ9kY2ZnX2dldF9zdHJpbmexBQxkY2ZnX2lkeF9rZXmyBQxkY2ZnX2dldF91MzKzBQlqZF92ZG1lc2e0BRFqZF9kbWVzZ19zdGFydHB0crUFDWpkX2RtZXNnX3JlYWS2BRJqZF9kbWVzZ19yZWFkX2xpbmW3BRNqZF9zZXR0aW5nc19nZXRfYmluuAUKZmluZF9lbnRyebkFD3JlY29tcHV0ZV9jYWNoZboFE2pkX3NldHRpbmdzX3NldF9iaW67BQtqZF9mc3Rvcl9nY7wFFWpkX3NldHRpbmdzX2dldF9sYXJnZb0FFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2W+BQptYXJrX2xhcmdlvwUXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2XABRZqZF9zZXR0aW5nc19zeW5jX2xhcmdlwQUQamRfc2V0X21heF9zbGVlcMIFDWpkX2lwaXBlX29wZW7DBRZqZF9pcGlwZV9oYW5kbGVfcGFja2V0xAUOamRfaXBpcGVfY2xvc2XFBRJqZF9udW1mbXRfaXNfdmFsaWTGBRVqZF9udW1mbXRfd3JpdGVfZmxvYXTHBRNqZF9udW1mbXRfd3JpdGVfaTMyyAUSamRfbnVtZm10X3JlYWRfaTMyyQUUamRfbnVtZm10X3JlYWRfZmxvYXTKBRFqZF9vcGlwZV9vcGVuX2NtZMsFFGpkX29waXBlX29wZW5fcmVwb3J0zAUWamRfb3BpcGVfaGFuZGxlX3BhY2tldM0FEWpkX29waXBlX3dyaXRlX2V4zgUQamRfb3BpcGVfcHJvY2Vzc88FFGpkX29waXBlX2NoZWNrX3NwYWNl0AUOamRfb3BpcGVfd3JpdGXRBQ5qZF9vcGlwZV9jbG9zZdIFDWpkX3F1ZXVlX3B1c2jTBQ5qZF9xdWV1ZV9mcm9udNQFDmpkX3F1ZXVlX3NoaWZ01QUOamRfcXVldWVfYWxsb2PWBQ1qZF9yZXNwb25kX3U41wUOamRfcmVzcG9uZF91MTbYBQ5qZF9yZXNwb25kX3UzMtkFEWpkX3Jlc3BvbmRfc3RyaW5n2gUXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTbBQtqZF9zZW5kX3BrdNwFHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs3QUXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLeBRlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V03wUUamRfYXBwX2hhbmRsZV9wYWNrZXTgBRVqZF9hcHBfaGFuZGxlX2NvbW1hbmThBRVhcHBfZ2V0X2luc3RhbmNlX25hbWXiBRNqZF9hbGxvY2F0ZV9zZXJ2aWNl4wUQamRfc2VydmljZXNfaW5pdOQFDmpkX3JlZnJlc2hfbm935QUZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOYFFGpkX3NlcnZpY2VzX2Fubm91bmNl5wUXamRfc2VydmljZXNfbmVlZHNfZnJhbWXoBRBqZF9zZXJ2aWNlc190aWNr6QUVamRfcHJvY2Vzc19ldmVyeXRoaW5n6gUaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXrBRZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l7AUUYXBwX2dldF9kZXZpY2VfY2xhc3PtBRJhcHBfZ2V0X2Z3X3ZlcnNpb27uBQ1qZF9zcnZjZmdfcnVu7wUXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXwBRFqZF9zcnZjZmdfdmFyaWFudPEFDWpkX2hhc2hfZm52MWHyBQxqZF9kZXZpY2VfaWTzBQlqZF9yYW5kb230BQhqZF9jcmMxNvUFDmpkX2NvbXB1dGVfY3Jj9gUOamRfc2hpZnRfZnJhbWX3BQxqZF93b3JkX21vdmX4BQ5qZF9yZXNldF9mcmFtZfkFEGpkX3B1c2hfaW5fZnJhbWX6BQ1qZF9wYW5pY19jb3Jl+wUTamRfc2hvdWxkX3NhbXBsZV9tc/wFEGpkX3Nob3VsZF9zYW1wbGX9BQlqZF90b19oZXj+BQtqZF9mcm9tX2hleP8FDmpkX2Fzc2VydF9mYWlsgAYHamRfYXRvaYEGD2pkX3ZzcHJpbnRmX2V4dIIGD2pkX3ByaW50X2RvdWJsZYMGC2pkX3ZzcHJpbnRmhAYKamRfc3ByaW50ZoUGEmpkX2RldmljZV9zaG9ydF9pZIYGDGpkX3NwcmludGZfYYcGC2pkX3RvX2hleF9hiAYJamRfc3RyZHVwiQYJamRfbWVtZHVwigYMamRfZW5kc193aXRoiwYOamRfc3RhcnRzX3dpdGiMBhZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVljQYWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZY4GEWpkX3NlbmRfZXZlbnRfZXh0jwYKamRfcnhfaW5pdJAGHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrkQYPamRfcnhfZ2V0X2ZyYW1lkgYTamRfcnhfcmVsZWFzZV9mcmFtZZMGEWpkX3NlbmRfZnJhbWVfcmF3lAYNamRfc2VuZF9mcmFtZZUGCmpkX3R4X2luaXSWBgdqZF9zZW5klwYPamRfdHhfZ2V0X2ZyYW1lmAYQamRfdHhfZnJhbWVfc2VudJkGC2pkX3R4X2ZsdXNomgYQX19lcnJub19sb2NhdGlvbpsGDF9fZnBjbGFzc2lmeZwGBWR1bW15nQYIX19tZW1jcHmeBgdtZW1tb3ZlnwYGbWVtc2V0oAYKX19sb2NrZmlsZaEGDF9fdW5sb2NrZmlsZaIGBmZmbHVzaKMGBGZtb2SkBg1fX0RPVUJMRV9CSVRTpQYMX19zdGRpb19zZWVrpgYNX19zdGRpb193cml0ZacGDV9fc3RkaW9fY2xvc2WoBghfX3RvcmVhZKkGCV9fdG93cml0ZaoGCV9fZndyaXRleKsGBmZ3cml0ZawGFF9fcHRocmVhZF9tdXRleF9sb2NrrQYWX19wdGhyZWFkX211dGV4X3VubG9ja64GBl9fbG9ja68GCF9fdW5sb2NrsAYOX19tYXRoX2Rpdnplcm+xBgpmcF9iYXJyaWVysgYOX19tYXRoX2ludmFsaWSzBgNsb2e0BgV0b3AxNrUGBWxvZzEwtgYHX19sc2Vla7cGBm1lbWNtcLgGCl9fb2ZsX2xvY2u5BgxfX29mbF91bmxvY2u6BgxfX21hdGhfeGZsb3e7BgxmcF9iYXJyaWVyLjG8BgxfX21hdGhfb2Zsb3e9BgxfX21hdGhfdWZsb3e+BgRmYWJzvwYDcG93wAYFdG9wMTLBBgp6ZXJvaW5mbmFuwgYIY2hlY2tpbnTDBgxmcF9iYXJyaWVyLjLEBgpsb2dfaW5saW5lxQYKZXhwX2lubGluZcYGC3NwZWNpYWxjYXNlxwYNZnBfZm9yY2VfZXZhbMgGBXJvdW5kyQYGc3RyY2hyygYLX19zdHJjaHJudWzLBgZzdHJjbXDMBgZzdHJsZW7NBgZtZW1jaHLOBgZzdHJzdHLPBg50d29ieXRlX3N0cnN0ctAGEHRocmVlYnl0ZV9zdHJzdHLRBg9mb3VyYnl0ZV9zdHJzdHLSBg10d293YXlfc3Ryc3Ry0wYHX191Zmxvd9QGB19fc2hsaW3VBghfX3NoZ2V0Y9YGB2lzc3BhY2XXBgZzY2FsYm7YBgljb3B5c2lnbmzZBgdzY2FsYm5s2gYNX19mcGNsYXNzaWZ5bNsGBWZtb2Rs3AYFZmFic2zdBgtfX2Zsb2F0c2Nhbt4GCGhleGZsb2F03wYIZGVjZmxvYXTgBgdzY2FuZXhw4QYGc3RydG944gYGc3RydG9k4wYSX193YXNpX3N5c2NhbGxfcmV05AYIZGxtYWxsb2PlBgZkbGZyZWXmBhhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXnBgRzYnJr6AYIX19hZGR0ZjPpBglfX2FzaGx0aTPqBgdfX2xldGYy6wYHX19nZXRmMuwGCF9fZGl2dGYz7QYNX19leHRlbmRkZnRmMu4GDV9fZXh0ZW5kc2Z0ZjLvBgtfX2Zsb2F0c2l0ZvAGDV9fZmxvYXR1bnNpdGbxBg1fX2ZlX2dldHJvdW5k8gYSX19mZV9yYWlzZV9pbmV4YWN08wYJX19sc2hydGkz9AYIX19tdWx0ZjP1BghfX211bHRpM/YGCV9fcG93aWRmMvcGCF9fc3VidGYz+AYMX190cnVuY3RmZGYy+QYLc2V0VGVtcFJldDD6BgtnZXRUZW1wUmV0MPsGCXN0YWNrU2F2ZfwGDHN0YWNrUmVzdG9yZf0GCnN0YWNrQWxsb2P+BhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50/wYVZW1zY3JpcHRlbl9zdGFja19pbml0gAcZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZYEHGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WCBxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSDBwxkeW5DYWxsX2ppammEBxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpphQcYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBgwcEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
