
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABtYKAgAAwYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gBH9/f38AYAN/f38Bf2AAAGAAAX9gBH9/f38Bf2ABfAF8YAV/f39/fwBgBX9/f39/AX9gBX9+fn5+AGAGf39/f39/AGAAAX5gAn9/AXxgA39+fwF+YAd/f39/f39/AGACf3wAYAJ/fgBgAX4Bf2ABfAF/YAF/AXxgBH9+fn8AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAF/AX5gCX9/f39/f39/fwBgCH9/f39/f39/AX9gBn9/f39/fwF/YAN/f3wAYAN/fH8AYAF8AX5gAn98AXxgAn5/AXxgA3x8fwF8YAN8fn4BfGABfABgAn5+AX9gA39+fgBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8C/IOAgAAVA2Vudg1lbV9mbGFzaF9zYXZlAAIDZW52DWVtX2ZsYXNoX3NpemUACANlbnYNZW1fZmxhc2hfbG9hZAACA2VudgVhYm9ydAAHA2VudhNlbV9zZW5kX2xhcmdlX2ZyYW1lAAIDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYRZW1fZGVwbG95X2hhbmRsZXIAAANlbnYXZW1famRfY3J5cHRvX2dldF9yYW5kb20AAgNlbnYNZW1fc2VuZF9mcmFtZQAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABwDZW52DmVtX3ByaW50X2RtZXNnAAADZW52D19qZF90Y3Bzb2NrX25ldwADA2VudhFfamRfdGNwc29ja193cml0ZQADA2VudhFfamRfdGNwc29ja19jbG9zZQAIA2VudhhfamRfdGNwc29ja19pc19hdmFpbGFibGUACBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA/SGgIAA8gYHCAEABwcHAAAHBAAIBwcdAgAAAgMCAAcIBAMDAwAPBw8ABwcDBQIHBwMDBwgBAgcHBA4LDAYCBQMFAAACAgACAQEAAAAAAgEFBgYBAAcFBQAAAQAHBAMEAgICCAMHBQcGAgICAgADAwYAAAABBAABAgYABgYDAgIDAgIDBAMGAwMJBQYCCAACBgEBAAAAAAAAAAAAAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEBAAAAAAABAQAHAQEBAAEBAQEAAAEFAAASAAAACQAGAAAAAQwAAAASAw4OAAAAAAAAAAAAAAAAAAAAAAACAAAAAgAAAAMBAQEBAQEBAQEBAQEBAQEGAQMAAAEBAQEACwACAgABAQEAAQEAAQEAAAABAAABAQAAAAAAAAIABQICBQsAAQABAQEEAQ8GAAIAAAAGAAAIBAMJCwICCwIDAAUJAwEFBgMFCQUFBgUBAQEDAwYDAwMDAwMFBQUJDAYFAwMDBgMDAwMFBgUFBQUFBQEGAwMQEwICAgQBAwEBAgADCQkBAgkEAwEDAwIEBwIAAgIAHh8DBAMGAgUFBQEBBQULAQMCAgEACwUFBQEFBQEFBgMDBAQDDBMCAgUQAwMDAwYGAwMDBAQGBgYGAQMAAwMEAgADAAIGAAQEAwYGBQEBAgICAgICAgICAgICAgEBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQIBAQECAgICAgICAgICAQEBAQECAQIEBAEOIAICAAAHCQMGAQIAAAcJCQEDBwECAAACBQAHCQgABAQEAAACBwAUAwcHAQIBABUDCQcAAAQAAgcAAAIHBAcEBAMDBAMGAwIIBgYGBAcGBwMDAgYIAAYAAAQhAQMQAwMACQcDBgQDBAAEAwMDAwQEBgYAAAAEBAcHBwcEBwcHCAgIBwQEAw8IAwAEAQAJAQMDAQMFBAwiCQkUAwMEAwMDBwcFBwQIAAQEBwkIAAcIFgQGBgYEAAQZIxEGBAQEBgkEBAAAFwoKChYKEQYIByQKFxcKGRYVFQolJicoCgMDAwQGAwMDAwMEFAQEGg0YKQ0qBQ4SKwUQBAQACAQNGBsbDRMsAgIICBgNDRoNLQAICAAECAcICAguDC8Eh4CAgAABcAGUApQCBYaAgIAAAQGAAoACBoeBgIAAFH8BQbCXBgt/AUEAC38BQQALfwFBAAt/AEG47wELfwBBiPABC38AQffwAQt/AEHB8gELfwBBvfMBC38AQbn0AQt/AEGl9QELfwBB9fUBC38AQZb2AQt/AEGb+AELfwBBkfkBC38AQeH5AQt/AEGt+gELfwBB1voBC38AQbjvAQt/AEGF+wELB8eHgIAAKgZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAVBm1hbGxvYwDlBhZfX2VtX2pzX19lbV9mbGFzaF9zaXplAwQWX19lbV9qc19fZW1fZmxhc2hfc2F2ZQMFFl9fZW1fanNfX2VtX2ZsYXNoX2xvYWQDBhBfX2Vycm5vX2xvY2F0aW9uAJsGGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAARmcmVlAOYGGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACoaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKwpqZF9lbV9pbml0ACwNamRfZW1fcHJvY2VzcwAtFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC4RamRfZW1fZGV2c19kZXBsb3kALxFqZF9lbV9kZXZzX3ZlcmlmeQAwGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAxG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAyFl9fZW1fanNfX2VtX3NlbmRfZnJhbWUDBxxfX2VtX2pzX19fZGV2c19wYW5pY19oYW5kbGVyAwgcX19lbV9qc19fZW1fc2VuZF9sYXJnZV9mcmFtZQMJGl9fZW1fanNfX2VtX2RlcGxveV9oYW5kbGVyAwoUX19lbV9qc19fZW1fdGltZV9ub3cDCyBfX2VtX2pzX19lbV9qZF9jcnlwdG9fZ2V0X3JhbmRvbQMMF19fZW1fanNfX2VtX3ByaW50X2RtZXNnAw0WamRfZW1fdGNwc29ja19vbl9ldmVudABCGF9fZW1fanNfX19qZF90Y3Bzb2NrX25ldwMOGl9fZW1fanNfX19qZF90Y3Bzb2NrX3dyaXRlAw8aX19lbV9qc19fX2pkX3RjcHNvY2tfY2xvc2UDECFfX2VtX2pzX19famRfdGNwc29ja19pc19hdmFpbGFibGUDEQZmZmx1c2gAowYVZW1zY3JpcHRlbl9zdGFja19pbml0AIAHGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAgQcZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCCBxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAgwcJc3RhY2tTYXZlAPwGDHN0YWNrUmVzdG9yZQD9BgpzdGFja0FsbG9jAP4GHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQA/wYNX19zdGFydF9lbV9qcwMSDF9fc3RvcF9lbV9qcwMTDGR5bkNhbGxfamlqaQCFBwmhhICAAAEAQQELkwIpOlNUZFlbbm9zZW2vAr4CzgLtAvEC9gKfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdkB2gHbAdwB3QHeAd8B4AHhAeIB5QHmAegB6QHqAewB7gHvAfAB8wH0AfUB+gH7AfwB/QH+Af8BgAKBAoICgwKEAoUChgKHAogCiQKKAowCjQKOApACkQKSApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqQCpgKnAqgCqQKqAqsCrAKuArECsgKzArQCtQK2ArcCuAK5AroCuwK8Ar0CvwLAAsECwgLDAsQCxQLGAscCyALKAowEjQSOBI8EkASRBJIEkwSUBJUElgSXBJgEmQSaBJsEnASdBJ4EnwSgBKEEogSjBKQEpQSmBKcEqASpBKoEqwSsBK0ErgSvBLAEsQSyBLMEtAS1BLYEtwS4BLkEugS7BLwEvQS+BL8EwATBBMIEwwTEBMUExgTHBMgEyQTKBMsEzATNBM4EzwTQBNEE0gTTBNQE1QTWBNcE2ATZBNoE2wTcBN0E3gTfBOAE4QTiBOME5ATlBOYE5wToBIMFhQWJBYoFjAWLBY8FkQWjBaQFpwWoBY4GqAanBqYGCtXSjIAA8gYFABCABwslAQF/AkBBACgCkPsBIgANAEHP1gBBzcoAQRlBsCEQgAYACyAAC9wBAQJ/AkACQAJAAkBBACgCkPsBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgClPsBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBrd4AQc3KAEEiQeEoEIAGAAsCQANAIAAgAyIDai0AAEH/AUcNASADQQFqIgQhAyAE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IAMpAyA3AwggASADQQhqIANBKGoQ7gNFDQAgACADKAIoEOYDDAELIABCADcDAAsgA0EwaiQAC/0CAgN/AX4jAEHwAGsiASQAIAEgAEHgAGopAwA3A1AgASAAKQNYIgQ3A0AgASAENwNgAkACQCAAIAFBwABqEOwDDQAgASABKQNgNwM4IAFB6ABqIABBEiABQThqENoDQQAhAgwBCyABIAEpA2A3AzAgACABQTBqIAFB3ABqEO4DIQILAkAgAiICRQ0AIAEgASkDUDcDKAJAIAAgAUEoakGWARD4A0UNAAJAIAAgASgCXEEBdBCVASIDRQ0AIANBBmogAiABKAJcEP4FCyAAIAMQpQMMAQsgASABKQNQNwMgAkACQCABQSBqEPQDDQAgASABKQNQNwMYIAAgAUEYakGXARD4Aw0AIAEgASkDUDcDECAAIAFBEGpBmAEQ+ANFDQELIAFByABqIAAgAiABKAJcEMkDIAAoAuwBIgBFDQEgACABKQNINwMgDAELIAEgASkDUDcDCCABIAAgAUEIahC2AzYCACABQegAaiAAQe0bIAEQ1gMLIAFB8ABqJAALygECBX8BfiMAQTBrIgEkACABIAApA1giBjcDGCABIAY3AyACQAJAIAAgAUEYahDtAw0AIAEgASkDIDcDECABQShqIABBqSAgAUEQahDbA0EAIQIMAQsgASABKQMgNwMIIAAgAUEIaiABQShqEO4DIQILAkAgAiIDRQ0AIABBABCfAyECIABBARCfAyEEIABBAhCfAyEAIAEoAigiBSACTQ0AIAEgBSACayIFNgIoIAMgAmogACAFIAQgBSAESRsQoAYaCyABQTBqJAALpgMCB38BfiMAQeAAayIBJAAgASAAKQNYIgg3AzggASAINwNQAkACQCAAIAFBOGoQ7QMNACABIAEpA1A3AzAgAUHYAGogAEGpICABQTBqENsDQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEO4DIQILAkAgAiIDRQ0AIABBABCfAyEEIAEgAEHoAGopAwAiCDcDICABIAg3A0ACQAJAIAAgAUEgahDCA0UNACABIAEpA0A3AwAgACABIAFB2ABqEMUDIQIMAQsgASABKQNAIgg3A1AgASAINwMYAkACQCAAIAFBGGoQ7AMNACABIAEpA1A3AxAgAUHYAGogAEES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AiQAIAIgASkDADcDCAJAAkAgAkEIahD0A0UNAEF/IQEMAQsCQAJAAkAgASgCBEEBag4CAAECCyABKAIAIgFBACABQQBKGyEBDAILIAEoAgBBwgBHDQBBfyEBDAELIAIgASkDADcDAEF/IQEgACACEOkDIgNEAADg////70FkDQBBACEBIANEAAAAAAAAAABjDQACQAJAIANEAAAAAAAA8EFjIANEAAAAAAAAAABmcUUNACADqyEBDAELQQAhAQsgASEBCyACQRBqJAAgAQvzAQMCfwF+AXwjAEEgayIBJAAgASAAQeAAaikDACIDNwMQIAEgAzcDGAJAAkAgAUEQahD0A0UNAEF/IQIMAQsCQAJAAkAgASgCHEEBag4CAAECCyABKAIYIgJBACACQQBKGyECDAILIAEoAhhBwgBHDQBBfyECDAELIAEgASkDGDcDCEF/IQIgACABQQhqEOkDIgREAADg////70FkDQBBACECIAREAAAAAAAAAABjDQACQAJAIAREAAAAAAAA8EFjIAREAAAAAAAAAABmcUUNACAEqyECDAELQQAhAgsgAiECCyAAKALsASACEHggAUEgaiQAC/MBAwJ/AX4BfCMAQSBrIgEkACABIABB4ABqKQMAIgM3AxAgASADNwMYAkACQCABQRBqEPQDRQ0AQX8hAgwBCwJAAkACQCABKAIcQQFqDgIAAQILIAEoAhgiAkEAIAJBAEobIQIMAgsgASgCGEHCAEcNAEF/IQIMAQsgASABKQMYNwMIQX8hAiAAIAFBCGoQ6QMiBEQAAOD////vQWQNAEEAIQIgBEQAAAAAAAAAAGMNAAJAAkAgBEQAAAAAAADwQWMgBEQAAAAAAAAAAGZxRQ0AIASrIQIMAQtBACECCyACIQILIAAoAuwBIAIQeCABQSBqJAALRgEBfwJAIABBABCfAyIBQZGOwdUARw0AQe7rAEEAEDtB+scAQSFB1sQAEPsFAAsgAEHf1AMgASABQaCrfGpBoat8SRsQdgsFABA0AAsIACAAQQAQdgudAgIHfwF+IwBB8ABrIgEkAAJAIAAtAENBAkkNACABIABB4ABqKQMAIgg3A2ggASAINwMIIAAgAUEIaiABQeQAahDFAyICRQ0AIAAgAiABKAJkIAFBIGpBwAAgAEHoAGoiAyAALQBDQX5qIgQgAUEcahDBAyEFIAEgASgCHEF/aiIGNgIcAkAgACABQRBqIAVBf2oiByAGEJYBIgZFDQACQAJAIAdBPksNACAGIAFBIGogBxCeBhogByECDAELIAAgAiABKAJkIAYgBSADIAQgAUEcahDBAyECIAEgASgCHEF/ajYCHCACQX9qIQILIAAgAUEQaiACIAEoAhwQlwELIAAoAuwBIgBFDQAgACABKQMQNwMgCyABQfAAaiQAC28CAn8BfiMAQSBrIgEkACAAQQAQnwMhAiABIABB6ABqKQMAIgM3AxggASADNwMIIAFBEGogACABQQhqEMoDIAEgASkDECIDNwMYIAEgAzcDACAAQT4gAiACQf9+akGAf0kbwCABENMCIAFBIGokAAsOACAAIABBABChAxCiAwsPACAAIABBABChA50QogMLgAICAn8BfiMAQfAAayIBJAAgASAAQeAAaikDADcDaCABIABB6ABqKQMAIgM3A1AgASADNwNgAkACQCABQdAAahDzA0UNACABIAEpA2g3AxAgASAAIAFBEGoQtgM2AgBB4BogARA7DAELIAEgASkDYDcDSCABQdgAaiAAIAFByABqEMoDIAEgASkDWCIDNwNgIAEgAzcDQCAAIAFBwABqEI4BIAEgASkDYDcDOCAAIAFBOGpBABDFAyECIAEgASkDaDcDMCABIAAgAUEwahC2AzYCJCABIAI2AiBBkhsgAUEgahA7IAEgASkDYDcDGCAAIAFBGGoQjwELIAFB8ABqJAALnwECAn8BfiMAQTBrIgEkACABIABB4ABqKQMAIgM3AyggASADNwMQIAFBIGogACABQRBqEMoDIAEgASkDICIDNwMoIAEgAzcDCAJAIAAgAUEIakEAEMUDIgJFDQAgAiABQSBqELEFIgJFDQAgAUEYaiAAQQggACACIAEoAiAQmAEQ6AMgACgC7AEiAEUNACAAIAEpAxg3AyALIAFBMGokAAs7AQF/IwBBEGsiASQAIAFBCGogACkDgAK6EOUDAkAgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBEGokAAuoAQIBfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiAjcDKCABIAI3AxACQAJAAkAgACABQRBqQY8BEPgDRQ0AEPMFIQIMAQsgASABKQMoNwMIIAAgAUEIakGbARD4A0UNARDYAiECCyABQQg2AgAgASACNwMgIAEgAUEgajYCBCABQRhqIABBwiMgARDIAyAAKALsASIARQ0AIAAgASkDGDcDIAsgAUEwaiQAC+YBAgR/AX4jAEEgayIBJAAgAEEAEJ8DIQIgASAAQegAaikDACIFNwMIIAEgBTcDGAJAIAAgAUEIahCTAiIDRQ0AAkAgAkExSQ0AIAFBEGogAEHcABDcAwwBCyADIAI6ABUCQCADKAIcLwEEIgRB7QFJDQAgAUEQaiAAQS8Q3AMMAQsgAEGFA2ogAjoAACAAQYYDaiADLwEQOwEAIABB/AJqIAMpAwg3AgAgAy0AFCECIABBhANqIAQ6AAAgAEH7AmogAjoAACAAQYgDaiADKAIcQQxqIAQQngYaIAAQ0gILIAFBIGokAAuwAgIDfwF+IwBB0ABrIgEkACAAQQAQnwMhAiABIABB6ABqKQMAIgQ3A0gCQAJAIARQDQAgASABKQNINwM4IAAgAUE4ahDCAw0AIAEgASkDSDcDMCABQcAAaiAAQcIAIAFBMGoQ2gMMAQsCQCACRQ0AIAJBgICAgH9xQYCAgIABRg0AIAFBwABqIABByhZBABDYAwwBCyABIAEpA0g3AygCQAJAAkAgACABQShqIAIQ3wIiA0EDag4CAQACCyABIAI2AgAgAUHAAGogAEGeCyABENYDDAILIAEgASkDSDcDICABIAAgAUEgakEAEMUDNgIQIAFBwABqIABBzD0gAUEQahDYAwwBCyADQQBIDQAgACgC7AEiAEUNACAAIAOtQoCAgIAghDcDIAsgAUHQAGokAAsjAQF/IwBBEGsiASQAIAFBCGogAEH4LUEAENcDIAFBEGokAAvpAQIEfwF+IwBBMGsiASQAIAEgAEHgAGopAwAiBTcDCCABIAU3AyAgACABQQhqIAFBLGoQxQMhAiABIABB6ABqKQMAIgU3AwAgASAFNwMYIAAgASABQShqEO8DIQMCQAJAAkAgAkUNACADDQELIAFBEGogAEGPzwBBABDWAwwBCyAAIAEoAiwgASgCKGpBEWoQlAEiBEUNACAAIAQQpQMgBEH/AToADiAEQRRqENgCNwAAIAEoAiwhACAAIARBHGogAiAAEJ4GakEBaiADIAEoAigQngYaIARBDGogBC8BBBAlCyABQTBqJAALIgEBfyMAQRBrIgEkACABQQhqIABBsNkAENkDIAFBEGokAAshAQF/IwBBEGsiASQAIAFBCGogAEG5OxDZAyABQRBqJAALIgEBfyMAQRBrIgEkACABQQhqIABB4NcAENkDIAFBEGokAAsiAQF/IwBBEGsiASQAIAFBCGogAEHg1wAQ2QMgAUEQaiQACyIBAX8jAEEQayIBJAAgAUEIaiAAQeDXABDZAyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCmAyICRQ0AAkAgAigCBA0AIAIgAEEcEO8CNgIECyABIABB4ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakHyABDGAwsgASABKQMINwMAIAAgAkH2ACABEMwDIAAgAhClAwsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQpgMiAkUNAAJAIAIoAgQNACACIABBIBDvAjYCBAsgASAAQeAAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB9AAQxgMLIAEgASkDCDcDACAAIAJB9gAgARDMAyAAIAIQpQMLIAFBEGokAAt7AgJ/AX4jAEEQayIBJAACQCAAEKYDIgJFDQACQCACKAIEDQAgAiAAQR4Q7wI2AgQLIAEgAEHgAGopAwAiAzcDCAJAIANCAFINACABQQhqQfMAEMYDCyABIAEpAwg3AwAgACACQfYAIAEQzAMgACACEKUDCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABCmAyICRQ0AAkAgAigCBA0AIAIgAEEiEO8CNgIECyABIABB4ABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakGEARDGAwsgASABKQMINwMAIAAgAkH2ACABEMwDIAAgAhClAwsgAUEQaiQAC2IBAX8jAEEgayIDJAAgAyACKQMANwMQIANBGGogASADQRBqQfsAEJUDAkACQCADKQMYQgBSDQAgAEIANwMADAELIAMgAykDGDcDCCAAIAEgA0EIakHjABCVAwsgA0EgaiQACzQCAX8BfiMAQRBrIgEkACABIAApA1giAjcDACABIAI3AwggACABENIDIAAQWCABQRBqJAALpgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahDaA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQfM9QQAQ2AMLIAIhAQsCQAJAIAEiAUUNACAAIAEoAhwQ5gMMAQsgAEIANwMACyADQSBqJAALrAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAMgAykDEDcDCCADQRhqIAFBiwEgA0EIahDaA0EAIQEMAQsCQCABIAMoAhAQfCICDQAgA0EYaiABQfM9QQAQ2AMLIAIhAQsCQAJAIAEiAUUNACAAIAEtABBBD3FBBEYQ5wMMAQsgAEIANwMACyADQSBqJAALxQEBAn8jAEEgayIBJAAgASAAKQNYNwMQAkACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQFGDQELIAEgASkDEDcDCCABQRhqIABBiwEgAUEIahDaA0EAIQIMAQsCQCAAIAEoAhAQfCICDQAgAUEYaiAAQfM9QQAQ2AMLIAIhAgsCQCACIgJFDQACQCACLQAQQQ9xQQRGDQAgAUEYaiAAQeU/QQAQ2AMMAQsgAiAAQeAAaikDADcDICACQQEQdwsgAUEgaiQAC5QBAQJ/IwBBIGsiASQAIAEgACkDWDcDEAJAAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEBRg0BCyABIAEpAxA3AwggAUEYaiAAQYsBIAFBCGoQ2gNBACEADAELAkAgACABKAIQEHwiAg0AIAFBGGogAEHzPUEAENgDCyACIQALAkAgACIARQ0AIAAQfgsgAUEgaiQAC1kCA38BfiMAQRBrIgEkACAAKALsASECIAEgAEHgAGopAwAiBDcDACABIAQ3AwggACABELEBIQMgACgC7AEgAxB4IAIgAi0AEEHwAXFBBHI6ABAgAUEQaiQACyEAAkAgACgC7AEiAEUNACAAIAA1AhxCgICAgBCENwMgCwtgAQJ/IwBBEGsiASQAAkACQCAALQBDIgINACABQQhqIABBwS1BABDYAwwBCyAAIAJBf2pBARB9IgJFDQAgACgC7AEiAEUNACAAIAI1AhxCgICAgBCENwMgCyABQRBqJAAL4wICA38BfiMAQfAAayIDJAAgAyACKQMANwNAAkACQAJAIAEgA0HAAGogA0HoAGogA0HkAGoQiQMiBEHPhgNLDQAgASgA5AEiBSAFKAIgaiAEQQR0ai0AC0ECcQ0BCyADIAIpAwA3AwggACABQfMlIANBCGoQ2wMMAQsgACABIAEoAtgBIARB//8DcRD5AiAAKQMAQgBSDQAgA0HYAGogAUEIIAEgAUECEO8CEJABEOgDIAAgAykDWCIGNwMAIAZQDQAgAyAAKQMANwM4IAEgA0E4ahCOASADQdAAakH7ABDGAyADQQM2AkwgAyAENgJIIAMgACkDADcDMCADIAMpA1A3AyggAyADKQNINwMgIAEgA0EwaiADQShqIANBIGoQmgMgASgC2AEhAiADIAApAwA3AxggASACIARB//8DcSADQRhqEPcCIAMgACkDADcDECABIANBEGoQjwELIANB8ABqJAALwAEBAn8jAEEgayIDJAAgAyACKQMANwMIAkACQAJAIAEgA0EIaiADQRhqIANBFGoQiQMiBEF/Sg0AIAMgAikDADcDACAAIAFBHCADENoDDAELAkAgBEHQhgNIDQAgBEGw+XxqIgFBAC8BmO4BTg0CIABBkP8AIAFBA3RqLwEAEMYDDAELIAAgASgA5AEiASABKAIgaiAEQQR0ai8BDDYCACAAQQQ2AgQLIANBIGokAA8LQfAWQaDJAEExQcQ2EIAGAAvzCAEHfyMAQbABayIBJAACQAJAAkACQAJAIABFDQAgACgCqAINAhDYAQJAAkBBveIAQQAQrgUiAg0AQQAhAwwBCyACIQJBACEEA0AgBCEDAkACQCACIgItAAVBwABHDQBBACEEDAELQQAhBCACELAFIgVB/wFGDQBBASEEIAVBPksNACAFQQN2QcCAAmotAAAgBUEHcXZBAXFFIQQLQb3iACACEK4FIgUhAiADIARqIgMhBCADIQMgBQ0ACwsgASADIgI2AoABQagXIAFBgAFqEDsgACAAIAJBGGwQigEiBDYCqAIgBEUNAiAAIAI6AEoMAQsQ2AELAkBBveIAQQAQrgUiAkUNACACIQJBACEEA0AgBCEDIAIiAhCwBSEEIAEgAikCADcDoAEgASACQQhqKQIANwOoASABQfOgpfMGNgKgAQJAAkAgAUGgAWpBfxCvBSIFQQFLDQAgASAFNgJoIAEgBDYCZCABIAFBoAFqNgJgQZDCACABQeAAahA7DAELIARBPksNACAEQQN2QcCAAmotAAAgBEEHcXZBAXFFDQAgASAENgJ0IAEgAkEFajYCcEGC6AAgAUHwAGoQOwsCQAJAIAItAAVBwABHDQAgAyEEDAELAkAgAhCwBSIGQf8BRw0AIAMhBAwBCwJAIAZBPksNACAGQQN2QcCAAmotAAAgBkEHcXZBAXFFDQAgAyEEDAELAkAgAEUNACAAKAKoAiIGRQ0AIAMgAC0ASksNBSAGIANBGGxqIgYgBDoADSAGIAM6AAwgBiACQQVqIgc2AgggASAENgJYIAEgBzYCVCABIANB/wFxNgJQIAEgBTYCXEHF6AAgAUHQAGoQOyAGQQ87ARAgBkEAQRJBIiAFGyAFQX9GGzoADgsgA0EBaiEEC0G94gAgAhCuBSIDIQIgBCEEIAMNAAsLIABFDQACQAJAIABBKhDvAiIFDQBBACECDAELIAUtAANBD3EhAgsCQCACQXxqDgYAAwMDAwADCyAALQBKRQ0AQQAhAgNAIAAoAqgCIQQgAUGgAWogAEEIIAAgAEErEO8CEJABEOgDIAQgAiIDQRhsaiICIAEpA6ABNwMAIAFBmAFqQdABEMYDIAFBkAFqIAItAA0Q5gMgASACKQMANwNIIAEgASkDmAE3A0AgASABKQOQATcDOCAAIAFByABqIAFBwABqIAFBOGoQmgMgAigCCCEEIAFBoAFqIABBCCAAIAQgBBDNBhCYARDoAyABIAEpA6ABNwMwIAAgAUEwahCOASABQYgBakHRARDGAyABIAIpAwA3AyggASABKQOIATcDICABIAEpA6ABNwMYIAAgAUEoaiABQSBqIAFBGGoQmgMgASABKQOgATcDECABIAIpAwA3AwggACAFIAFBEGogAUEIahDxAiABIAEpA6ABNwMAIAAgARCPASADQQFqIgQhAiAEIAAtAEpJDQALCyABQbABaiQADwtBkxdB88gAQekAQYMvEIAGAAtBoeYAQfPIAEGKAUGDLxCABgALkwEBA39BAEIANwPAgAICQEHP7gBBABCuBSIARQ0AIAAhAANAAkAgACIAQZQnEM8GIgEgAE0NAAJAIAFBf2osAAAiAUEuRg0AIAFBf0oNAQsgABCwBSIBQT9LDQAgAUEDdkHAgAJqIgIgAi0AAEEBIAFBB3F0cjoAAAtBz+4AIAAQrgUiASEAIAENAAsLQeI1QQAQOwv2AQIHfwF+IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAS0ASiIEDQAgBEEARyEFDAELAkAgASgCqAIiBikDACADKQMQIgpSDQBBASEFIAYhAgwBCyAEQRhsIAZqQWhqIQdBACEFAkADQAJAIAVBAWoiAiAERw0AIAchCAwCCyACIQUgBiACQRhsaiIJIQggCSkDACAKUg0ACwsgAiAESSEFIAghAgsgAiECAkAgBQ0AIAMgAykDEDcDCCADQRhqIAFB0AEgA0EIahDaA0EAIQILAkACQCACIgJFDQAgACACLQAOEOYDDAELIABCADcDAAsgA0EgaiQAC/YBAgd/AX4jAEEgayIDJAAgAyACKQMANwMQAkACQCABLQBKIgQNACAEQQBHIQUMAQsCQCABKAKoAiIGKQMAIAMpAxAiClINAEEBIQUgBiECDAELIARBGGwgBmpBaGohB0EAIQUCQANAAkAgBUEBaiICIARHDQAgByEIDAILIAIhBSAGIAJBGGxqIgkhCCAJKQMAIApSDQALCyACIARJIQUgCCECCyACIQICQCAFDQAgAyADKQMQNwMIIANBGGogAUHQASADQQhqENoDQQAhAgsCQAJAIAIiAkUNACAAIAIvARAQ5gMMAQsgAEIANwMACyADQSBqJAALqAECBH8BfiMAQSBrIgMkACADIAIpAwA3AxACQAJAAkAgAS0ASiIEDQAgBEEARyECDAELIAEoAqgCIgUpAwAgAykDECIHUQ0BQQAhBgJAA0AgBkEBaiICIARGDQEgAiEGIAUgAkEYbGopAwAgB1INAAsLIAIgBEkhAgsgAg0AIAMgAykDEDcDCCADQRhqIAFB0AEgA0EIahDaAwsgAEIANwMAIANBIGokAAuOAgIIfwF+IwBBMGsiASQAIAEgACkDWCIJNwMgAkACQCAALQBKIgINACACQQBHIQMMAQsCQCAAKAKoAiIEKQMAIAlSDQBBASEDIAQhBQwBCyACQRhsIARqQWhqIQZBACEDAkADQAJAIANBAWoiBSACRw0AIAYhBwwCCyAFIQMgBCAFQRhsaiIIIQcgCCkDACAJUg0ACwsgBSACSSEDIAchBQsgBSEFAkAgAw0AIAEgASkDIDcDECABQShqIABB0AEgAUEQahDaA0EAIQULAkAgBUUNACAAQQBBfxCeAxogASAAQeAAaikDACIJNwMYIAEgCTcDCCABQShqIABB0gEgAUEIahDaAwsgAUEwaiQAC4kBAgJ/AX4jAEEgayIDJAAg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AAsgEiEIIAMhASAPIQcgDCECIBYNAgNAIAIhAiAIQX9qIQkgByIHKAIAIQgCQAJAIAEiAUEASCIKDQAgASATSg0AIAJBADoAAyACQQA7AAEgAiAIOgAADAELAkAgCg0AIAEgAE4NACACIAItAABB8AFxIAhBD3FyOgAACwJAIAFBf0gNACABQQFqIABODQAgAiACLQAAQQ9xIAhB8AFxcjoAAAsCQCABQX5IDQAgAUECaiAATg0AIAIgAi0AAUHwAXE6AAELAkAgAUF9SA0AIAFBA2ogAE4NACACIAItAAFBD3E6AAELAkAgAUF8SA0AIAFBBGogAE4NACACIAItAAJB8AFxOgACCwJAIAFBe0gNACABQQVqIABODQAgAiACLQACQQ9xOgACCwJAIAFBekgNACABQQZqIABODQAgAiACLQADQfABcToAAwsgAUF5SA0AIAFBB2ogAE4NACACIAItAANBD3E6AAMLIAkhCCABQQhqIQEgB0EEaiEHIAJBBGohAiAJDQAMAwsACyASIQggDCEJIA8hAiADIQcgEiEKIAwhDCAPIQ8gAyELAkAgFUUNAANAIAchASACIQIgCSEJIAgiCEUNAyACKAIAIgpBD3EhBwJAAkACQCABQQBIIgwNACABIBBKDQACQCAHRQ0AIAktAABBD00NACAJIQlBACEKIAEhAQwDCyAKQfABcUUNASAJLQABQQ9xRQ0BIAlBAWohCUEAIQogASEBDAILAkAgDA0AIAdFDQAgASAATg0AIAktAABBD00NACAJIQlBACEKIAEhAQwCCyAKQfABcUUNACABQX9IDQAgAUEBaiIHIABODQAgCS0AAUEPcUUNACAJQQFqIQlBACEKIAchAQwBCyAJQQRqIQlBASEKIAFBCGohAQsgCEF/aiEIIAkhCSACQQRqIQIgASEHQQEhASAKDQAMBgsACwNAIAshASAPIQIgDCEJIAoiCEUNAiACKAIAIgpBD3EhBwJAAkACQCABQQBIIgwNACABIBBKDQACQCAHRQ0AIAktAABBD3FFDQAgCSEJQQAhByABIQEMAwsgCkHwAXFFDQEgCS0AAEEQSQ0BIAkhCUEAIQcgASEBDAILAkAgDA0AIAdFDQAgASAATg0AIAktAABBD3FFDQAgCSEJQQAhByABIQEMAgsgCkHwAXFFDQAgAUF/SA0AIAFB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ACAAIAFBBBDjAQJAIAEoAgAiAkUNACABKAIMIgNBAUgNACABKAIQIQQgASgCCCEFIAEoAgQhBkEBIANBAXQiB2shCEEBIQlBASEKQQAhCyADQX9qIQwDQCAKIQ0gCSEDIAAgAiAMIgkgBmogBSALIgprIgtBASAKQQF0QQFyIgwgBBDnASAAIAIgCiAGaiAFIAlrIg5BASAJQQF0QQFyIg8gBBDnASAAIAIgBiAJayALQQEgDCAEEOcBIAAgAiAGIAprIA5BASAPIAQQ5wECQAJAIAgiCEEASg0AIAkhDCAKQQFqIQsgDSEKIANBAmohCSADIQMMAQsgCUF/aiEMIAohCyANQQJqIg4hCiADIQkgDiAHayEDCyADIAhqIQggCSEJIAohCiALIgMhCyAMIg4hDCAOIANODQALCyABQSBqJAAL6gECAn8BfiMAQdAAayIBJAAgASAAQeAAaikDADcDSCABIABB6ABqKQMAIgM3AyggASADNwNAAkAgAUEoahDzAw0AIAFBOGogAEGOHhDZAwsgASABKQNINwMgIAFBOGogACABQSBqEMoDIAEgASkDOCIDNwNIIAEgAzcDGCAAIAFBGGoQjgEgASABKQNINwMQAkAgACABQRBqIAFBOGoQxQMiAkUNACABQTBqIAAgAiABKAI4QQEQ5gIgACgC7AEiAkUNACACIAEpAzA3AyALIAEgASkDSDcDCCAAIAFBCGoQjwEgAUHQAGokAAuPAQECfyMAQTBrIgEkACABIABB4ABqKQMANwMoIAEgAEHoAGopAwA3AyAgAEECEJ8DIQIgASABKQMgNwMIAkAgAUEIahDzAw0AIAFBGGogAEHbIBDZAwsgASABKQMoNwMAIAFBEGogACABIAJBARDpAgJAIAAoAuwBIgBFDQAgACABKQMQNwMgCyABQTBqJAALYQIBfwF+IwBBEGsiASQAIAEgAEHgAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoAuwBIgBFDQEgACACNwMgDAELIAEgASkDCDcDACAAIAAgARDpA5sQogMLIAFBEGokAAthAgF/AX4jAEEQayIBJAAgASAAQeAAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgC7AEiAEUNASAAIAI3AyAMAQsgASABKQMINwMAIAAgACABEOkDnBCiAwsgAUEQaiQAC2MCAX8BfiMAQRBrIgEkACABIABB4ABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKALsASIARQ0BIAAgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQ6QMQyQYQogMLIAFBEGokAAvIAQMCfwF+AXwjAEEgayIBJAAgASAAQeAAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgASkDGDcDEAwBCyABQRBqQQAgAmsQ5gMLIAAoAuwBIgBFDQEgACABKQMQNwMgDAELIAEgASkDGDcDCAJAIAAgAUEIahDpAyIERAAAAAAAAAAAY0UNACAAIASaEKIDDAELIAAoAuwBIgBFDQAgACABKQMYNwMgCyABQSBqJAALFQAgABD0BbhEAAAAAAAA8D2iEKIDC2QBBX8CQAJAIABBABCfAyIBQQFLDQBBASECDAELQQEhAwNAIANBAXRBAXIiBCECIAQhAyAEIAFJDQALCyACIQIDQCAEEPQFIAJxIgQgBCABSyIDGyIFIQQgAw0ACyAAIAUQowMLEQAgACAAQQAQoQMQtAYQogMLGAAgACAAQQAQoQMgAEEBEKEDEMAGEKIDCy4BA38gAEEAEJ8DIQFBACECAkAgAEEBEJ8DIgNFDQAgASADbSECCyAAIAIQowMLLgEDfyAAQQAQnwMhAUEAIQICQCAAQQEQnwMiA0UNACABIANvIQILIAAgAhCjAwsWACAAIABBABCfAyAAQQEQnwNsEKMDCwkAIABBARCLAguRAwIEfwJ8IwBBMGsiAiQAIAIgAEHgAGopAwA3AyggAiAAQegAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahDqAyEDIAIgAikDIDcDECAAIAJBEGoQ6gMhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAFIQUgACgC7AEiA0UNACADIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQ6QMhBiACIAIpAyA3AwAgACACEOkDIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgC7AEiBUUNACAFQQApA5CLATcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAEhAQJAIAAoAuwBIgBFDQAgACABKQMANwMgCyACQTBqJAALCQAgAEEAEIsCC50BAgN/AX4jAEEwayIBJAAgASAAQeAAaikDADcDKCABIABB6ABqKQMAIgQ3AxggASAENwMgAkAgAUEYahDzAw0AIAEgASkDKDcDECAAIAFBEGoQjwMhAiABIAEpAyA3AwggACABQQhqEJIDIgNFDQAgAkUNACAAIAIgAxDwAgsCQCAAKALsASIARQ0AIAAgASkDKDcDIAsgAUEwaiQACwkAIABBARCPAguhAQIDfwF+IwBBMGsiAiQAIAIgAEHgAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQkgMiA0UNACAAQQAQkgEiBEUNACACQSBqIABBCCAEEOgDIAIgAikDIDcDECAAIAJBEGoQjgEgACADIAQgARD0AiACIAIpAyA3AwggACACQQhqEI8BIAAoAuwBIgBFDQAgACACKQMgNwMgCyACQTBqJAALCQAgAEEAEI8CC+oBAgN/AX4jAEHAAGsiASQAIAEgAEHgAGopAwAiBDcDOCABIABB6ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqEPADIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQ2gMMAQsgASABKQMwNwMYAkAgACABQRhqEJIDIgMNACABIAEpAzA3AxAgAUEoaiAAQTQgAUEQahDaAwwBCyACIAM2AgQgACgC7AEiAEUNACAAIAEpAzg3AyALIAFBwABqJAALbgICfwJ+IwBBEGsiASQAIAApA1ghAyABIABB4ABqKQMAIgQ3AwAgASAENwMIIAEQ9AMhAiAAKALsASEAAkACQAJAIAJFDQAgAyEEIAANAQwCCyAARQ0BIAEpAwghBAsgACAENwMgCyABQRBqJAALdQEDfyMAQRBrIgIkAAJAAkAgASgCBCIDQYCAwP8HcQ0AIANBD3FBCEcNACABKAIAIgRFDQAgBCEDIAQoAgBBgICA+ABxQYCAgNgARg0BCyACIAEpAwA3AwAgAkEIaiAAQS8gAhDaA0EAIQMLIAJBEGokACADC74BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLwESIgIgAS8BTE8NACAAIAI2AgAgAEECNgIEDAELIABCADcDAAsgA0EgaiQAC7IBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgA0EINgIAIAMgAkEIajYCBCAAIAFBwiMgAxDIAwsgA0EgaiQAC7gBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgA0EYaiACKQMIEIYGIAMgA0EYajYCACAAIAFByRwgAxDIAwsgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAVEOYDCyADQSBqJAALnwEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARAQ5gMLIANBIGokAAufAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2gNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi0AFBDmAwsgA0EgaiQAC6IBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsgACACLQAUQQFxEOcDCyADQSBqJAALowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAItABRBAXFFEOcDCyADQSBqJAALowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAFBCCACKAIcEOgDCyADQSBqJAALywEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCwJAAkAgAi0AFEEBcUUNAEEAIQEMAQtBACEBIAItABVBMEsNACACLwEQQQ92IQELIAAgARDnAwsgA0EgaiQAC8kBAQJ/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgRFDQAgBCECIAQoAgBBgICA+ABxQYCAgNgARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahDaA0EAIQILAkACQCACIgINACAAQgA3AwAMAQsCQCACLQAUQQFxDQAgAi0AFUEwSw0AIAIuARBBf0oNACAAIAItABAQ5gMMAQsgAEIANwMACyADQSBqJAALqQEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARBBgOADcUGAwABGEOcDCyADQSBqJAALqAEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAIvARBBgOADcUGAIEYQ5wMLIANBIGokAAu+AQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2gNBACECCwJAAkAgAiICDQAgAEIANwMADAELAkAgAi8BECICQQx2QX9qQQJJDQAgAEIANwMADAELIAAgAkH/H3EQ5gMLIANBIGokAAujAQECfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECIERQ0AIAQhAiAEKAIAQYCAgPgAcUGAgIDYAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQ2gNBACECCwJAAkAgAiICDQAgAEIANwMADAELIAAgAi8BEEGAIEkQ5wMLIANBIGokAAv4AQEHfwJAIAJB//8DRw0AQQAPCyABIQMDQCAFIQQCQCADIgYNAEEADwsgBi8BCCIFQQBHIQECQAJAAkAgBQ0AIAEhAwwBCyABIQdBACEIQQAhAwJAAkAgACgA5AEiASABKAJgaiAGLwEKQQJ0aiIJLwECIAJGDQADQCADQQFqIgEgBUYNAiABIQMgCSABQQN0ai8BAiACRw0ACyABIAVJIQcgASEICyAHIQMgCSAIQQN0aiEBDAILIAEgBUkhAwsgBCEBCyABIQECQAJAIAMiCUUNACAGIQMMAQsgACAGEIUDIQMLIAMhAyABIQUgASEBIAlFDQALIAELowEBAn8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiBEUNACAEIQIgBCgCAEGAgID4AHFBgICA2ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqENoDQQAhAgsCQAJAIAIiAg0AIABCADcDAAwBCyAAIAEgASACEKUCEPwCCyADQSBqJAALwgMBCH8CQCABDQBBAA8LAkAgACABLwESEIIDIgINAEEADwsgAS4BECIDQYBgcSEEAkACQAJAIAEtABRBAXFFDQACQCAEDQAgAyEEDAMLAkAgBEH//wNxIgFBgMAARg0AIAFBgCBHDQILIANB/x9xQYAgciEEDAILAkAgA0F/Sg0AIANB/wFxQYCAfnIhBAwCCwJAIARFDQAgBEH//wNxQYAgRw0BIANB/x9xQYAgciEEDAILIANBgMAAciEEDAELQf//AyEEC0EAIQECQCAEQf//A3EiBUH//wNGDQAgAiEEA0AgAyEGAkAgBCIHDQBBAA8LIAcvAQgiA0EARyEBAkACQAJAIAMNACABIQQMAQsgASEIQQAhCUEAIQQCQAJAIAAoAOQBIgEgASgCYGogBy8BCkECdGoiAi8BAiAFRg0AA0AgBEEBaiIBIANGDQIgASEEIAIgAUEDdGovAQIgBUcNAAsgASADSSEIIAEhCQsgCCEEIAIgCUEDdGohAQwCCyABIANJIQQLIAYhAQsgASEBAkACQCAEIgJFDQAgByEEDAELIAAgBxCFAyEECyAEIQQgASEDIAEhASACRQ0ACwsgAQu+AQEDfyMAQSBrIgEkACABIAApA1g3AxACQAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECIDRQ0AIAMhAiADKAIAQYCAgPgAcUGAgIDYAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQ2gNBACECCwJAIAAgAiICEKUCIgNFDQAgAUEIaiAAIAMgAigCHCICQQxqIAIvAQQQrQIgACgC7AEiAEUNACAAIAEpAwg3AyALIAFBIGokAAvwAQICfwF+IwBBIGsiASQAIAEgACkDWDcDEAJAIAEoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgASgCECICRQ0AIAIoAgBBgICA+ABxQYCAgNgARw0AIABB+AJqQQBB/AEQoAYaIABBhgNqQQM7AQAgAikDCCEDIABBhANqQQQ6AAAgAEH8AmogAzcCACAAQYgDaiACLwEQOwEAIABBigNqIAIvARY7AQAgAUEIaiAAIAIvARIQ1AICQCAAKALsASIARQ0AIAAgASkDCDcDIAsgAUEgaiQADwsgASABKQMQNwMAIAFBGGogAEEvIAEQ2gMAC6EBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMQAkACQCABIANBEGogA0EsahD/AiICRQ0AIAMoAixB//8BRg0BCyADIAMpAxg3AwggA0EgaiABQZ0BIANBCGoQ2gMLAkACQCACDQAgAEIANwMADAELAkAgASACEIEDIgJBf0oNACAAQgA3AwAMAQsgACABIAIQ+gILIANBMGokAAuPAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDEAJAAkAgASADQRBqIANBLGoQ/wIiAkUNACADKAIsQf//AUYNAQsgAyADKQMYNwMIIANBIGogAUGdASADQQhqENoDCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQTBqJAALiAECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDGCADIAQ3AxACQAJAIAEgA0EQaiADQSxqEP8CIgJFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDaAwsCQAJAIAINACAAQgA3AwAMAQsgACACLwECEOYDCyADQTBqJAAL+AECA38BfiMAQTBrIgMkACADIAIpAwAiBjcDGCADIAY3AxACQAJAIAEgA0EQaiADQSxqEP8CIgRFDQAgAygCLEH//wFGDQELIAMgAykDGDcDCCADQSBqIAFBnQEgA0EIahDaAwsCQAJAIAQNACAAQgA3AwAMAQsCQAJAIAQvAQJBgOADcSIFRQ0AIAVBgCBHDQEgACACKQMANwMADAILAkAgASAEEIEDIgJBf0oNACAAQgA3AwAMAgsgACABIAEgASgA5AEiBSAFKAJgaiACQQR0aiAELwECQf8fcUGAwAByEKMCEPwCDAELIABCADcDAAsgA0EwaiQAC5YCAgR/AX4jAEEwayIBJAAgASAAKQNYIgU3AxggASAFNwMIAkACQCAAIAFBCGogAUEsahD/AiICRQ0AIAEoAixB//8BRg0BCyABIAEpAxg3AwAgAUEgaiAAQZ0BIAEQ2gMLAkAgAkUNACAAIAIQgQMiA0EASA0AIABB+AJqQQBB/AEQoAYaIABBhgNqIAIvAQIiBEH/H3E7AQAgAEH8AmoQ2AI3AgACQAJAIARBgOADcSIEQYAgRg0AIARBgIACRw0BQe7NAEHIAEGKORD7BQALIAAgAC8BhgNBgCByOwGGAwsgACACELACIAFBEGogACADQYCAAmoQ1AIgACgC7AEiAEUNACAAIAEpAxA3AyALIAFBMGokAAujAwEEfyMAQTBrIgUkACAFIAM2AiwCQAJAIAItAARBAXFFDQACQCABQQAQkgEiBg0AIABCADcDAAwCCyADIARqIQcgACABQQggBhDoAyAFIAApAwA3AxggASAFQRhqEI4BQQAhAyABKADkASIEIAQoAmBqIAIvAQZBAnRqIQIDQCACIQIgAyEDAkACQCAHIAUoAiwiCGsiBEEATg0AIAMhAyACIQJBAiEEDAELIAVBIGogASACLQACIAVBLGogBBBIAkACQAJAIAUpAyBQDQAgBSAFKQMgNwMQIAEgBiAFQRBqEJ0DIAUoAiwgCEYNACADIQQCQCADDQAgAi0AA0EedEEfdSACcSEECyAEIQMgAkEEaiEEAkACQCACLwEERQ0AIAQhAgwBCyADIQIgAw0AQQAhAyAEIQIMAgsgAyEDIAIhAkEAIQQMAgsgAyEDIAIhAgtBAiEECyADIQMgAiECIAQhBAsgAyEDIAIhAiAERQ0ACyAFIAApAwA3AwggASAFQQhqEI8BDAELIAAgASACLwEGIAVBLGogBBBICyAFQTBqJAAL3QECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahD/AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGTISABQRBqENsDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENsDQQAhAwsCQCADIgNFDQAgACgC7AEhAiAAIAEoAiQgAy8BAkH0A0EAEM8CIAJBDSADEKcDCyABQcAAaiQAC0cBAX8jAEEQayICJAAgAkEIaiAAIAEgAEGIA2ogAEGEA2otAAAQrQICQCAAKALsASIARQ0AIAAgAikDCDcDIAsgAkEQaiQAC8AEAQp/IwBBMGsiAiQAIABB4ABqIQMCQAJAIAAtAENBf2oiBEEBRg0AIAMhAyAEIQQMAQsgAiADKQMANwMgAkAgACACQSBqEPEDDQAgAyEDQQEhBAwBCyACIAMpAwA3AxggACACQRhqEPADIgQoAgwhAyAELwEIIQQLIAQhBSADIQYgAEGIA2ohBwJAAkAgAS0ABEEBcUUNACAHIQMgBUUNASAAQfQEaiEIIAchBEEAIQlBACEKIAAoAOQBIgMgAygCYGogAS8BBkECdGohAQNAIAEhAyAKIQogCSEJAkACQCAIIAQiBGsiAUEASA0AIAMtAAIhCyACIAYgCUEDdGopAwA3AxAgACALIAQgASACQRBqEEkiAUUNACAKIQsCQCAKDQAgAy0AA0EedEEfdSADcSELCyALIQogBCABaiEEIANBBGohAQJAAkACQCADLwEERQ0AIAEhAwwBCyAKIQMgCg0AIAEhAUEAIQpBASELDAELIAMhASAKIQpBACELCyAEIQMMAQsgAyEBIAohCkEBIQsgBCEDCyADIQMgCiEKIAEhAQJAIAtFDQAgAyEDDAMLIAMhBCAJQQFqIgshCSAKIQogASEBIAMhAyALIAVHDQAMAgsACyAHIQMCQAJAIAUOAgIBAAsgAiAFNgIAIAJBKGogAEGywQAgAhDYAyAHIQMMAQsgAS8BBiEDIAIgBikDADcDCCAHIAAgAyAHQewBIAJBCGoQSWohAwsgAEGEA2ogAyAHazoAACACQTBqJAAL1wECA38BfiMAQcAAayIBJAAgASAAKQNYIgQ3AyggASAENwMYIAEgBDcDMCAAIAFBGGogAUEkahD/AiICIQMCQCACDQAgASABKQMwNwMQIAFBOGogAEGTISABQRBqENsDQQAhAwsCQAJAIAMiAw0AIAMhAwwBCyADIQMgASgCJEH//wFHDQAgASABKQMoNwMIIAFBOGogAEGGISABQQhqENsDQQAhAwsCQCADIgNFDQAgACADELACIAAgASgCJCADLwECQf8fcUGAwAByENECCyABQcAAaiQAC54BAgJ/AX4jAEEwayIDJAAgAyACKQMAIgU3AxAgAyAFNwMgIAEgA0EQaiADQRxqEP8CIgQhAgJAIAQNACADIAMpAyA3AwggA0EoaiABQZMhIANBCGoQ2wNBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAhwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBMGokAAuJAQICfwF+IwBBMGsiAyQAIAMgAikDACIFNwMQIAMgBTcDICABIANBEGogA0EcahD/AiIEIQICQCAEDQAgAyADKQMgNwMIIANBKGogAUGTISADQQhqENsDQQAhAgsCQAJAIAIiAQ0AIABCADcDAAwBCyAAIAEvAQA2AgAgAEEENgIECyADQTBqJAALhgECAn8BfiMAQTBrIgMkACADIAIpAwAiBTcDECADIAU3AyAgASADQRBqIANBHGoQ/wIiBCECAkAgBA0AIAMgAykDIDcDCCADQShqIAFBkyEgA0EIahDbA0EAIQILAkACQCACIgENACAAQgA3AwAMAQsgACABLwECQf8fcRDmAwsgA0EwaiQAC84BAgN/AX4jAEHAAGsiASQAIAEgACkDWCIENwMoIAEgBDcDGCABIAQ3AzAgACABQRhqIAFBJGoQ/wIiAiEDAkAgAg0AIAEgASkDMDcDECABQThqIABBkyEgAUEQahDbA0EAIQMLAkACQCADIgMNACADIQMMAQsgAyEDIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBhiEgAUEIahDbA0EAIQMLAkAgAyIDRQ0AIAAgAxCwAiAAIAEoAiQgAy8BAhDRAgsgAUHAAGokAAtkAQJ/IwBBEGsiAyQAAkACQAJAIAIoAgQiBEGAgMD/B3ENACAEQQ9xQQJGDQELIAMgAikDADcDCCAAIAFB2QAgA0EIahDaAwwBCyAAIAEgAigCABCDA0EARxDnAwsgA0EQaiQAC2MBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqENoDDAELIAAgASABIAIoAgAQggMQ+wILIANBEGokAAuJAgIFfwF+IwBBMGsiASQAIAEgACkDWDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQ2gNB//8BIQIMAQsgASgCKCECCwJAIAIiAkH//wFGDQAgAEEAEJ8DIQMgASAAQegAaikDACIGNwMoIAEgBjcDCCAAIAFBCGogAUEcahDvAyEEAkAgA0GAgARJDQAgAUEgaiAAQd0AENwDDAELAkAgASgCHCIFQe0BSQ0AIAFBIGogAEHeABDcAwwBCyAAQYQDaiAFOgAAIABBiANqIAQgBRCeBhogACACIAMQ0QILIAFBMGokAAtpAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQCABIANBCGoQ/gIiAg0AIAMgAykDEDcDACADQRhqIAFBnQEgAxDaAyAAQgA3AwAMAQsgACACKAIEEOYDCyADQSBqJAALcAIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkAgASADQQhqEP4CIgINACADIAMpAxA3AwAgA0EYaiABQZ0BIAMQ2gMgAEIANwMADAELIAAgAi8BADYCACAAQQQ2AgQLIANBIGokAAuaAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAIAAgAUEYahD+AiICDQAgASABKQMwNwMIIAFBOGogAEGdASABQQhqENoDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyAgAUEoaiAAIAIgAUEQahCGAyAAKALsASIARQ0AIAAgASkDKDcDIAsgAUHAAGokAAvDAQICfwF+IwBBwABrIgEkACABIAApA1giAzcDGCABIAM3AzACQAJAAkAgACABQRhqEP4CDQAgASABKQMwNwMAIAFBOGogAEGdASABENoDDAELIAEgAEHgAGopAwAiAzcDECABIAM3AyggACABQRBqEJMCIgJFDQAgASAAKQNYIgM3AwggASADNwMgIAAgAUEIahD9AiIAQX9MDQEgAiAAQYCAAnM7ARIL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diEFIAENAAsgAyAAQQRqELgDIAAoAgAhAkEAIQFBACEFA0AgAiABIgFqIAMgBSIEQQJ0aiIFLQADOgAAIAIgAUEBcmogBS8BAjoAACACIAFBAnJqIAUoAgBBCHY6AAAgAiABQQNyaiAFKAIAOgAAIAFBBGohASAEQQFqIgQhBSAEQQhHDQALIAAoAgALkQEAECICQEEALQCQgQJFDQBBwc4AQQ5BxCEQ+wUAC0EAQQE6AJCBAhAjQQBCq7OP/JGjs/DbADcC/IECQQBC/6S5iMWR2oKbfzcC9IECQQBC8ua746On/aelfzcC7IECQQBC58yn0NbQ67O7fzcC5IECQQBCwAA3AtyBAkEAQZiBAjYC2IECQQBBkIICNgKUgQIL+QEBA38CQCABRQ0AQQBBACgC4IECIAFqNgLggQIgASEBIAAhAANAIAAhACABIQECQEEAKALcgQIiAkHAAEcNACABQcAASQ0AQeSBAiAAELgDIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAtiBAiAAIAEgAiABIAJJGyICEJ4GGkEAQQAoAtyBAiIDIAJrNgLcgQIgACACaiEAIAEgAmshBAJAIAMgAkcNAEHkgQJBmIECELgDQQBBwAA2AtyBAkEAQZiBAjYC2IECIAQhASAAIQAgBA0BDAILQQBBACgC2IECIAJqNgLYgQIgBCEBIAAhACAEDQALCwtMAEGUgQIQuQMaIABBGGpBACkDqIICNwAAIABBEGpBACkDoIICNwAAIABBCGpBACkDmIICNwAAIABBACkDkIICNwAAQQBBADoAkIECC9sHAQN/QQBCADcD6IICQQBCADcD4IICQQBCADcD2IICQQBCADcD0IICQQBCADcDyIICQQBCADcDwIICQQBCADcDuIICQQBCADcDsIICAkACQAJAAkAgAUHBAEkNABAiQQAtAJCBAg0CQQBBAToAkIECECNBACABNgLggQJBAEHAADYC3IECQQBBmIECNgLYgQJBAEGQggI2ApSBAkEAQquzj/yRo7Pw2wA3AvyBAkEAQv+kuYjFkdqCm383AvSBAkEAQvLmu+Ojp/2npX83AuyBAkEAQufMp9DW0Ouzu383AuSBAiABIQEgACEAAkADQCAAIQAgASEBAkBBACgC3IECIgJBwABHDQAgAUHAAEkNAEHkgQIgABC4AyABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKALYgQIgACABIAIgASACSRsiAhCeBhpBAEEAKALcgQIiAyACazYC3IECIAAgAmohACABIAJrIQQCQCADIAJHDQBB5IECQZiBAhC4A0EAQcAANgLcgQJBAEGYgQI2AtiBAiAEIQEgACEAIAQNAQwCC0EAQQAoAtiBAiACajYC2IECIAQhASAAIQAgBA0ACwtBlIECELkDGkEAQQApA6iCAjcDyIICQQBBACkDoIICNwPAggJBAEEAKQOYggI3A7iCAkEAQQApA5CCAjcDsIICQQBBADoAkIECQQAhAQwBC0GwggIgACABEJ4GGkEAIQELA0AgASIBQbCCAmoiACAALQAAQTZzOgAAIAFBAWoiACEBIABBwABHDQAMAgsAC0HBzgBBDkHEIRD7BQALECICQEEALQCQgQINAEEAQQE6AJCBAhAjQQBCwICAgPDM+YTqADcC4IECQQBBwAA2AtyBAkEAQZiBAjYC2IECQQBBkIICNgKUgQJBAEGZmoPfBTYCgIICQQBCjNGV2Lm19sEfNwL4gQJBAEK66r+q+s+Uh9EANwLwgQJBAEKF3Z7bq+68tzw3AuiBAkHAACEBQbCCAiEAAkADQCAAIQAgASEBAkBBACgC3IECIgJBwABHDQAgAUHAAEkNAEHkgQIgABC4AyABQUBqIgIhASAAQcAAaiEAIAINAQwCC0EAKALYgQIgACABIAIgASACSRsiAhCeBhpBAEEAKALcgQIiAyACazYC3IECIAAgAmohACABIAJrIQQCQCADIAJHDQBB5IECQZiBAhC4A0EAQcAANgLcgQJBAEGYgQI2AtiBAiAEIQEgACEAIAQNAQwCC0EAQQAoAtiBAiACajYC2IECIAQhASAAIQAgBA0ACwsPC0HBzgBBDkHEIRD7BQAL+QEBA38CQCABRQ0AQQBBACgC4IECIAFqNgLggQIgASEBIAAhAANAIAAhACABIQECQEEAKALcgQIiAkHAAEcNACABQcAASQ0AQeSBAiAAELgDIAFBQGoiAiEBIABBwABqIQAgAg0BDAILQQAoAtiBAiAAIAEgAiABIAJJGyICEJ4GGkEAQQAoAtyBAiIDIAJrNgLcgQIgACACaiEAIAEgAmshBAJAIAMgAkcNAEHkgQJBmIECELgDQQBBwAA2AtyBAkEAQZiBAjYC2IECIAQhASAAIQAgBA0BDAILQQBBACgC2IECIAJqNgLYgQIgBCEBIAAhACAEDQALCwv6BgEFf0GUgQIQuQMaIABBGGpBACkDqIICNwAAIABBEGpBACkDoIICNwAAIABBCGpBACkDmIICNwAAIABBACkDkIICNwAAQQBBADoAkIECECICQEEALQCQgQINAEEAQQE6AJCBAhAjQQBCq7OP/JGjs/DbADcC/IECQQBC/6S5iMWR2oKbfzcC9IECQQBC8ua746On/aelfzcC7IECQQBC58yn0NbQ67O7fzcC5IECQQBCwAA3AtyBAkEAQZiBAjYC2IECQQBBkIICNgKUgQJBACEBA0AgASIBQbCCAmoiAiACLQAAQeoAczoAACABQQFqIgIhASACQcAARw0AC0EAQcAANgLggQJBwAAhAUGwggIhAgJAA0AgAiECIAEhAQJAQQAoAtyBAiIDQcAARw0AIAFBwABJDQBB5IECIAIQuAMgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgC2IECIAIgASADIAEgA0kbIgMQngYaQQBBACgC3IECIgQgA2s2AtyBAiACIANqIQIgASADayEFAkAgBCADRw0AQeSBAkGYgQIQuANBAEHAADYC3IECQQBBmIECNgLYgQIgBSEBIAIhAiAFDQEMAgtBAEEAKALYgQIgA2o2AtiBAiAFIQEgAiECIAUNAAsLQQBBACgC4IECQSBqNgLggQJBICEBIAAhAgJAA0AgAiECIAEhAQJAQQAoAtyBAiIDQcAARw0AIAFBwABJDQBB5IECIAIQuAMgAUFAaiIDIQEgAkHAAGohAiADDQEMAgtBACgC2IECIAIgASADIAEgA0kbIgMQngYaQQBBACgC3IECIgQgA2s2AtyBAiACIANqIQIgASADayEFAkAgBCADRw0AQeSBAkGYgQIQuANBAEHAADYC3IECQQBBmIECNgLYgQIgBSEBIAIhAiAFDQEMAgtBAEEAKALYgQIgA2o2AtiBAiAFIQEgAiECIAUNAAsLQZSBAhC5AxogAEEYakEAKQOoggI3AAAgAEEQakEAKQOgggI3AAAgAEEIakEAKQOYggI3AAAgAEEAKQOQggI3AABBAEIANwOwggJBAEIANwO4ggJBAEIANwPAggJBAEIANwPIggJBAEIANwPQggJBAEIANwPYggJBAEIANwPgggJBAEIANwPoggJBAEEAOgCQgQIPC0HBzgBBDkHEIRD7BQAL7QcBAX8gACABEL0DAkAgA0UNAEEAQQAoAuCBAiADajYC4IECIAMhAyACIQEDQCABIQEgAyEDAkBBACgC3IECIgBBwABHDQAgA0HAAEkNAEHkgQIgARC4AyADQUBqIgAhAyABQcAAaiEBIAANAQwCC0EAKALYgQIgASADIAAgAyAASRsiABCeBhpBAEEAKALcgQIiCSAAazYC3IECIAEgAGohASADIABrIQICQCAJIABHDQBB5IECQZiBAhC4A0EAQcAANgLcgQJBAEGYgQI2AtiBAiACIQMgASEBIAINAQwCC0EAQQAoAtiBAiAAajYC2IECIAIhAyABIQEgAg0ACwsgCBC/AyAIQSAQvQMCQCAFRQ0AQQBBACgC4IECIAVqNgLggQIgBSEDIAQhAQNAIAEhASADIQMCQEEAKALcgQIiAEHAAEcNACADQcAASQ0AQeSBAiABELgDIANBQGoiACEDIAFBwABqIQEgAA0BDAILQQAoAtiBAiABIAMgACADIABJGyIAEJ4GGkEAQQAoAtyBAiIJIABrNgLcgQIgASAAaiEBIAMgAGshAgJAIAkgAEcNAEHkgQJBmIECELgDQQBBwAA2AtyBAkEAQZiBAjYC2IECIAIhAyABIQEgAg0BDAILQQBBACgC2IECIABqNgLYgQIgAiEDIAEhASACDQALCwJAIAdFDQBBAEEAKALggQIgB2o2AuCBAiAHIQMgBiEBA0AgASEBIAMhAwJAQQAoAtyBAiIAQcAARw0AIANBwABJDQBB5IECIAEQuAMgA0FAaiIAIQMgAUHAAGohASAADQEMAgtBACgC2IECIAEgAyAAIAMgAEkbIgAQngYaQQBBACgC3IECIgkgAGs2AtyBAiABIABqIQEgAyAAayECAkAgCSAARw0AQeSBAkGYgQIQuANBAEHAADYC3IECQQBBmIECNgLYgQIgAiEDIAEhASACDQEMAgtBAEEAKALYgQIgAGo2AtiBAiACIQMgASEBIAINAAsLQQBBACgC4IECQQFqNgLggQJBASEDQc7uACEBAkADQCABIQEgAyEDAkBBACgC3IECIgBBwABHDQAgA0HAAEkNAEHkgQIgARC4AyADQUBqIgAhAyABQcAAaiEBIAAN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BA0AIAAoAgAiAEUgAEEDRnIhAQsgAQtrAQJ/IwBBEGsiAyQAAkACQCABKAIEDQACQCABKAIADgQAAQEAAQsgAigCBA0AQQEhBCACKAIADgQBAAABAAsgAyABKQMANwMIIAMgAikDADcDACAAIANBCGogAxD2AyEECyADQRBqJAAgBAuGAgICfwJ+IwBBwABrIgMkAAJAAkAgASgCBA0AIAEoAgBBAkcNACACKAIEDQBBACEEIAIoAgBBAkYNAQsgAyACKQMAIgU3AzAgAyABKQMAIgY3AyhBASEBAkAgBiAFUQ0AIAMgAykDKDcDIAJAIAAgA0EgahDCAw0AQQAhAQwBCyADIAMpAzA3AxhBACEBIAAgA0EYahDCA0UNACADIAMpAyg3AxAgACADQRBqIANBPGoQxQMhAiADIAMpAzA3AwggACADQQhqIANBOGoQxQMhBEEAIQECQCADKAI8IgAgAygCOEcNACACIAQgABC4BkUhAQsgASEBCyABIQQLIANBwABqJAAgBAvAAQECfyMAQTBrIgMkAEEBIQQCQCABKQMAIAIpAwBRDQAgAyABKQMANwMgAkAgACADQSBqEMIDDQBBACEEDAELIAMgAikDADcDGEEAIQQgACADQRhqEMIDRQ0AIAMgASkDADcDECAAIANBEGogA0EsahDFAyEEIAMgAikDADcDCCAAIANBCGogA0EoahDFAyECQQAhAQJAIAMoAiwiACADKAIoRw0AIAQgAiAAELgGRSEBCyABIQQLIANBMGokACAEC90BAgJ/An4jAEHAAGsiAyQAIANBIGogAhDGAyADIAMpAyAiBTcDMCADIAEpAwAiBjcDKEEBIQICQCAGIAVRDQAgAyADKQMoNwMYAkAgACADQRhqEMIDDQBBACECDAELIAMgAykDMDcDEEEAIQIgACADQRBqEMIDRQ0AIAMgAykDKDcDCCAAIANBCGogA0E8ahDFAyEBIAMgAykDMDcDACAAIAMgA0E4ahDFAyEAQQAhAgJAIAMoAjwiBCADKAI4Rw0AIAEgACAEELgGRSECCyACIQILIANBwABqJAAgAgtdAAJAAkAgAkEQTw0AIAFFDQEgAUGAgIAITg0BIABBADYCBCAAIAFBBHQgAnJBgAhqNgIADwtBjNIAQdjLAEGAA0HJwwAQgAYAC0G00gBB2MsAQYEDQcnDABCABgALjQEBAX9BACECAkAgAUH//wNLDQBB2wEhAgJAAkACQAJAAkACQCABQQ52DgQDBQABAgsgACgCAEHEAGohAkEBIQAMAwsgACgCAEHMAGohAkECIQAMAgtBmcYAQTlBoyoQ+wUACyAAKAIAQdQAaiECQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtvAQJ/IwBBIGsiASQAIAAoAAghABDsBSECIAFBGGogAEH//wNxNgIAIAFBEGogAEEYdjYCACABQRRqIABBEHZB/wFxNgIAIAFBDzYCDCABQoKAgIDgATcCBCABIAI2AgBBk8EAIAEQOyABQSBqJAALhiECDH8BfiMAQaAEayICJAACQAJAAkAgAEEDcQ0AAkAgAUHwAE0NACACIAA2ApgEAkACQCAAKAIAQcTK2ZsFRw0AIAAoAgRBityliX9GDQELIAJC6Ac3A4AEQdYKIAJBgARqEDtBmHghAAwECwJAAkAgACgCCCIDQYCAgHhxQYCAgBBHDQAgA0EQdkH/AXFBeWpBCEkNAQtB8yxBABA7IAAoAAghABDsBSEBIAJB4ANqQRhqIABB//8DcTYCACACQeADakEQaiAAQRh2NgIAIAJB9ANqIABBEHZB/wFxNgIAIAJBDzYC7AMgAkKCgICA4AE3AuQDIAIgATYC4ANBk8EAIAJB4ANqEDsgAkKaCDcD0ANB1gogAkHQA2oQO0HmdyEADAQLQQAhBCAAQSBqIQVBACEDA0AgAyEDIAQhBgJAAkACQCAFIgUoAgAiBCABTQ0AQekHIQNBl3ghBAwBCwJAIAUoAgQiByAEaiABTQ0AQeoHIQNBlnghBAwBCwJAIARBA3FFDQBB6wchA0GVeCEEDAELAkAgB0EDcUUNAEHsByEDQZR4IQQMAQsgA0UNASAFQXhqIgdBBGooAgAgBygCAGogBEYNAUHyByEDQY54IQQLIAIgAzYCwAMgAiAFIABrNgLEA0HWCiACQcADahA7IAYhByAEIQgMBAsgA0EISyIHIQQgBUEIaiEFIANBAWoiBiEDIAchByAGQQpHDQAMAwsAC0HW5ABBmcYAQckAQbcIEIAGAAtB194AQZnGAEHIAEG3CBCABgALIAghAwJAIAdBAXENACADIQAMAQsCQCAAQTRqLQAAQQdxRQ0AIAJC84eAgIAGNwOwA0HWCiACQbADahA7QY14IQAMAQsgACAAKAIwaiIFIAUgACgCNGoiBEkhBwJAAkAgBSAESQ0AIAchBCADIQcMAQsgByEGIAMhCCAFIQkDQCAIIQMgBiEEAkACQCAJIgYpAwAiDkL/////b1gNAEELIQUgAyEDDAELAkACQCAOQv///////////wCDQoCAgICAgID4/wBYDQBBkwghA0HtdyEHDAELIAJBkARqIA6/EOUDQQAhBSADIQMgAikDkAQgDlENAUGUCCEDQex3IQcLIAJBMDYCpAMgAiADNgKgA0HWCiACQaADahA7QQEhBSAHIQMLIAQhBCADIgMhBwJAIAUODAACAgICAgICAgICAAILIAZBCGoiBCAAIAAoAjBqIAAoAjRqSSIFIQYgAyEIIAQhCSAFIQQgAyEHIAUNAAsLIAchAwJAIARBAXFFDQAgAyEADAELAkAgAEEkaigCAEGA6jBJDQAgAkKjiICAgAY3A5ADQdYKIAJBkANqEDtB3XchAAwBCyAAIAAoAiBqIgUgBSAAKAIkaiIESSEHAkACQCAFIARJDQAgByEFQTAhASADIQMMAQsCQAJAAkACQCAFLwEIIAUtAApPDQAgByEKQTAhCwwBCyAFQQpqIQggBSEFIAAoAighBiADIQkgByEEA0AgBCEMIAkhDSAGIQYgCCEKIAUiAyAAayEJAkAgAygCACIFIAFNDQAgAiAJNgLkASACQekHNgLgAUHWCiACQeABahA7IAwhBSAJIQFBl3ghAwwFCwJAIAMoAgQiBCAFaiIHIAFNDQAgAiAJNgL0ASACQeoHNgLwAUHWCiACQfABahA7IAwhBSAJIQFBlnghAwwFCwJAIAVBA3FFDQAgAiAJNgKEAyACQesHNgKAA0HWCiACQYADahA7IAwhBSAJIQFBlXghAwwFCwJAIARBA3FFDQAgAiAJNgL0AiACQewHNgLwAkHWCiACQfACahA7IAwhBSAJIQFBlHghAwwFCwJAAkAgACgCKCIIIAVLDQAgBSAAKAIsIAhqIgtNDQELIAIgCTYChAIgAkH9BzYCgAJB1gogAkGAAmoQOyAMIQUgCSEBQYN4IQMMBQsCQAJAIAggB0sNACAHIAtNDQELIAIgCTYClAIgAkH9BzYCkAJB1gogAkGQAmoQOyAMIQUgCSEBQYN4IQMMBQsCQCAFIAZGDQAgAiAJNgLkAiACQfwHNgLgAkHWCiACQeACahA7IAwhBSAJIQFBhHghAwwFCwJAIAQgBmoiB0GAgARJDQAgAiAJNgLUAiACQZsINgLQAkHWCiACQdACahA7IAwhBSAJIQFB5XchAwwFCyADLwEMIQUgAiACKAKYBDYCzAICQCACQcwCaiAFEPoDDQAgAiAJNgLEAiACQZwINgLAAkHWCiACQcACahA7IAwhBSAJIQFB5HchAwwFCwJAIAMtAAsiBUEDcUECRw0AIAIgCTYCpAIgAkGzCDYCoAJB1gogAkGgAmoQOyAMIQUgCSEBQc13IQMMBQsgDSEEAkAgBUEFdMBBB3UgBUEBcWsgCi0AAGpBf0oiBQ0AIAIgCTYCtAIgAkG0CDYCsAJB1gogAkGwAmoQO0HMdyEECyAEIQ0gBUUNAiADQRBqIgUgACAAKAIgaiAAKAIkaiIGSSEEAkAgBSAGSQ0AIAQhBQwECyAEIQogCSELIANBGmoiDCEIIAUhBSAHIQYgDSEJIAQhBCADQRhqLwEAIAwtAABPDQALCyACIAsiATYC1AEgAkGmCDYC0AFB1gogAkHQAWoQOyAKIQUgASEBQdp3IQMMAgsgDCEFCyAJIQEgDSEDCyADIQMgASEIAkAgBUEBcUUNACADIQAMAQsCQCAAQdwAaigCACAAIAAoAlhqIgVqQX9qLQAARQ0AIAIgCDYCxAEgAkGjCDYCwAFB1gogAkHAAWoQO0HddyEADAELAkACQCAAIAAoAkhqIgEgASAAQcwAaigCAGpJIgQNACAEIQ0gAyEBDAELIAQhBCADIQcgASEGAkADQCAHIQkgBCENAkAgBiIHKAIAIgFBAXFFDQBBtgghAUHKdyEDDAILAkAgASAAKAJcIgNJDQBBtwghAUHJdyEDDAILAkAgAUEFaiADSQ0AQbgIIQFByHchAwwCCwJAAkACQCABIAUgAWoiBC8BACIGaiAELwECIgFBA3ZB/j9xakEFaiADSQ0AQbkIIQFBx3chBAwBCwJAIAQgAUHw/wNxQQN2akEEaiAGQQAgBEEMEOQDIgRBe0sNAEEBIQMgCSEBIARBf0oNAkG+CCEBQcJ3IQQMAQtBuQggBGshASAEQcd3aiEECyACIAg2AqQBIAIgATYCoAFB1gogAkGgAWoQO0EAIQMgBCEBCyABIQECQCADRQ0AIAdBBGoiAyAAIAAoAkhqIAAoAkxqIglJIg0hBCABIQcgAyEGIA0hDSABIQEgAyAJTw0DDAELCyANIQ0gASEBDAELIAIgCDYCtAEgAiABNgKwAUHWCiACQbABahA7IA0hDSADIQELIAEhBgJAIA1BAXFFDQAgBiEADAELAkAgAEHUAGooAgAiAUEBSA0AIAAgACgCUGoiBCABaiEHIAAoAlwhAyAEIQEDQAJAIAEiASgCACIEIANJDQAgAiAINgKUASACQZ8INgKQAUHWCiACQZABahA7QeF3IQAMAwsCQCABKAIEIARqIANPDQAgAUEIaiIEIQEgBCAHTw0CDAELCyACIAg2AoQBIAJBoAg2AoABQdYKIAJBgAFqEDtB4HchAAwBCwJAAkAgACAAKAJAaiIBIAEgAEHEAGooAgBqSSIDDQAgAyENIAYhAQwBCyADIQQgBiEHIAEhBgNAIAchDSAEIQogBiIJLwEAIgQhAQJAIAAoAlwiBiAESw0AIAIgCDYCdCACQaEINgJwQdYKIAJB8ABqEDsgCiENQd93IQEMAgsCQANAAkAgASIBIARrQcgBSSIHDQAgAiAINgJkIAJBogg2AmBB1gogAkHgAGoQO0HedyEBDAILAkAgBSABai0AAEUNACABQQFqIgMhASADIAZJDQELCyANIQELIAEhAQJAIAdFDQAgCUECaiIDIAAgACgCQGogACgCRGoiCUkiDSEEIAEhByADIQYgDSENIAEhASADIAlPDQIMAQsLIAohDSABIQELIAEhAQJAIA1BAXFFDQAgASEADAELAkAgAEE8aigCAEUNACACIAg2AlQgAkGQCDYCUEHWCiACQdAAahA7QfB3IQAMAQsgAC8BDiIDQQBHIQUCQAJAIAMNACAFIQkgCCEGIAEhAQwBCyAAIAAoAmBqIQ0gBSEFIAEhBEEAIQcDQCAEIQYgBSEIIA0gByIFQQR0aiIBIABrIQMCQAJAAkAgAUEQaiAAIAAoAmBqIAAoAmQiBGpJDQBBsgghAUHOdyEHDAELAkACQAJAIAUOAgABAgsCQCABKAIEQfP///8BRg0AQacIIQFB2XchBwwDCyAFQQFHDQELIAEoAgRB8v///wFGDQBBqAghAUHYdyEHDAELAkAgAS8BCkECdCIHIARJDQBBqQghAUHXdyEHDAELAkAgAS8BCEEDdCAHaiAETQ0AQaoIIQFB1nchBwwBCyABLwEAIQQgAiACKAKYBDYCTAJAIAJBzABqIAQQ+gMNAEGrCCEBQdV3IQcMAQsCQCABLQACQQ5xRQ0AQawIIQFB1HchBwwBCwJAAkAgAS8BCEUNACANIAdqIQwgBiEJQQAhCgwBC0EBIQQgAyEDIAYhBwwCCwNAIAkhByAMIAoiCkEDdGoiAy8BACEEIAIgAigCmAQ2AkggAyAAayEGAkACQCACQcgAaiAEEPoDDQAgAiAGNgJEIAJBrQg2AkBB1gogAkHAAGoQO0EAIQNB03chBAwBCwJAAkAgAy0ABEEBcQ0AIAchBwwBCwJAAkACQCADLwEGQQJ0IgNBBGogACgCZEkNAEGuCCEEQdJ3IQsMAQsgDSADaiIEIQMCQCAEIAAgACgCYGogACgCZGpPDQADQAJAIAMiAy8BACIEDQACQCADLQACRQ0AQa8IIQRB0XchCwwEC0GvCCEEQdF3IQsgAy0AAw0DQQEhCSAHIQMMBAsgAiACKAKYBDYCPAJAIAJBPGogBBD6Aw0AQbAIIQRB0HchCwwDCyADQQRqIgQhAyAEIAAgACgCYGogACgCZGpJDQALC0GxCCEEQc93IQsLIAIgBjYCNCACIAQ2AjBB1gogAkEwahA7QQAhCSALIQMLIAMiBCEHQQAhAyAEIQQgCUUNAQtBASEDIAchBAsgBCEHAkAgAyIDRQ0AIAchCSAKQQFqIgshCiADIQQgBiEDIAchByALIAEvAQhPDQMMAQsLIAMhBCAGIQMgByEHDAELIAIgAzYCJCACIAE2AiBB1gogAkEgahA7QQAhBCADIQMgByEHCyAHIQEgAyEGAkAgBEUNACAFQQFqIgMgAC8BDiIISSIJIQUgASEEIAMhByAJIQkgBiEGIAEhASADIAhPDQIMAQsLIAghCSAGIQYgASEBCyABIQEgBiEDAkAgCUEBcUUNACABIQAMAQsCQCAAQewAaigCACIFRQ0AAkACQCAAIAAoAmhqIgQoAgggBU0NACACIAM2AgQgAkG1CDYCAEHWCiACEDtBACEDQct3IQAMAQsCQCAEEKwFIgUNAEEBIQMgASEADAELIAIgACgCaDYCFCACIAU2AhBB1gogAkEQahA7QQAhA0EAIAVrIQALIAAhACADRQ0BC0EAIQALIAJBoARqJAAgAAteAQJ/IwBBEGsiAiQAAkACQCAALwEEIgMgAC8BBk8NACABKALkASEBIAAgA0EBajsBBCABIANqLQAAIQAMAQsgAkEIaiABQeQAEIEBQQAhAAsgAkEQaiQAIABB/wFxCzwBAX9BfyEBAkACQAJAIAAtAEYOBgIAAAAAAQALIABBADoARiAAIAAtAAZBEHI6AAZBAA8LQX4hAQsgAQs1ACAAIAE6AEcCQCABDQACQCAALQBGDgYBAAAAAAEACyAAQQA6AEYgACAALQAGQRByOgAGCws+ACAAKAKwAhAgIABBzgJqQgA3AQAgAEHIAmpCADcDACAAQcACakIANwMAIABBuAJqQgA3AwAgAEIANwOwAgu0AgEEfwJAIAENAEEADwsCQCABQYCABE8NAAJAIAAvAbQCIgINACACQQBHDwsgACgCsAIhA0EAIQQCQANAAkAgAyAEIgRBAnRqIgUvAQAgAUcNACAFIAVBBGogAiAEQX9zakECdBCfBhogAC8BtAIiAkECdCAAKAKwAiIDakF8akEAOwEAIABBzgJqQgA3AQAgAEHGAmpCADcBACAAQb4CakIANwEAIABCADcBtgICQCACDQBBAQ8LQQAhBANAAkAgAyAEIgRBAnRqLwEAIgVFDQAgACAFQR9xakG2AmoiBS0AAA0AIAUgBEEBajoAAAsgBEEBaiIFIQRBASEBIAUgAkcNAAwDCwALIARBAWoiBSEEIAUgAkcNAAtBACEBCyABDwtB6MMAQeHJAEHWAEHDEBCABgALJAACQCAAKALoAUUNACAAQQQQgwQPCyAAIAAtAAdBgAFyOgAHC+QCAQd/AkAgAC0AR0UNAAJAIAAtAAdBAnFFDQAgACgCsAIhAiAALwG0AiIDIQRBACEFAkAgA0UNAEEAIQZBACEDA0AgAyEDAkACQCACIAYiBkECdGoiBy0AAkEBcUUNACADIQMMAQsgAiADQQJ0aiAHKAEANgEAIANBAWohAwsgAC8BtAIiByEEIAMiAyEFIAZBAWoiCCEGIAMhAyAIIAdJDQALCyACIAUiA0ECdGpBACAEIANrQQJ0EKAGGiAAQc4CakIANwEAIABBxgJqQgA3AQAgAEG+AmpCADcBACAAQgA3AbYCIAAvAbQCIgdFDQAgACgCsAIhCEEAIQMDQAJAIAggAyIDQQJ0ai8BACIGRQ0AIAAgBkEfcWpBtgJqIgYtAAANACAGIANBAWo6AAALIANBAWoiBiEDIAYgB0cNAAsLIABBADoAByAAQQA2AqwCIAAtAEYNACAAIAE6AEYgABBhCwvRBAEKfwJAIAFBgIAETw0AAkAgAQ0AQX4PCwJAAkACQCAALwG0AiIDRQ0AIANBAnQgACgCsAIiBGpBfGovAQANACAEIQQgAyEDDAELQX8hBSADQe8BSw0BIANBAXQiA0HoASADQegBSRtBCGoiA0ECdBAfIAAoArACIAAvAbQCQQJ0EJ4GIQQgACgCsAIQICAAIAM7AbQCIAAgBDYCsAIgBCEEIAMhAwsgBCEGIAMiB0EBIAdBAUsbIQhBACEDQQAhBAJAA0AgBCEEAkACQAJAIAYgAyIFQQJ0aiIDLwEAIglFDQAgCSABc0EfcSEKAkACQCAEQQFxRQ0AIAoNAQsCQCAKRQ0AQQEhC0EAIQwgCkUhCgwEC0EBIQtBACEMQQEhCiAJIAFJDQMLAkAgCSABRw0AIAMtAAIgAkcNAEEAIQtBASEMDAILIANBBGogAyAHIAVBf3NqQQJ0EJ8GGgsgAyABOwEAIAMgAjoAAkEAIQtBBCEMCyAEIQoLIAohBCAMIQMgC0UNASAFQQFqIgUhAyAEIQQgBSAIRw0AC0EEIQMLQQAhBSADQQRHDQAgAEIANwG2AiAAQc4CakIANwEAIABBxgJqQgA3AQAgAEG+AmpCADcBAAJAIAAvAbQCIgENAEEBDwsgACgCsAIhCUEAIQMDQAJAIAkgAyIDQQJ0ai8BACIERQ0AIAAgBEEfcWpBtgJqIgQtAAANACAEIANBAWo6AAALIANBAWoiBCEDQQEhBSAEIAFHDQALCyAFDwtB6MMAQeHJAEGFAUGsEBCABgALtQcCC38BfiMAQRBrIgEkAAJAIAAsAAdBf0oNACAAQQQQgwQLAkAgACgC6AEiAkUNACACIQJBgIAIIQMCQANAIAIhAiADQX9qIgRFDQEgAC0ARg0CAkACQCAALQBHRQ0AAkAgAC0ASEUNACAAQQA6AEgMAQsgACACLwEEIgVBH3FqQbYCai0AACIDRQ0AIAAoArACIgYgA0F/aiIDQQJ0ai8BACIHIQggAyEDIAUgB0kNAANAIAMhAwJAIAUgCEH//wNxRw0AAkAgBiADQQJ0ai0AAkEBcUUNACAAKAKsAiACRw0BIABBCBCDBAwECyAAQQEQgwQMAwsgBiADQQFqIgNBAnRqLwEAIgchCCADIQMgBSAHTw0ACwsCQAJAIAIvAQQiAyACLwEGTw0AIAAoAuQBIQUgAiADQQFqOwEEIAUgA2otAAAhAwwBCyABQQhqIABB5AAQgQFBACEDCyADIgNB/wFxIQYCQCADwEF/Sg0AIAEgBkHwfmoQ5gMCQCAALQBCIgJBEEkNACABQQhqIABB5QAQgQEMAgsgASkDACEMIAAgAkEBajoAQiAAIAJBA3RqQdgAaiAMNwMADAELAkAgBkHfAEkNACABQQhqIABB5gAQgQEMAQsCQCAGQcySAWotAAAiCUEgcUUNACAAIAIvAQQiA0F/ajsBQAJAAkAgAyACLwEGTw0AIAAoAuQBIQUgAiADQQFqOwEEIAUgA2otAAAhAwwBCyABQQhqIABB5AAQgQFBACEDCwJAAkAgA0H/AXEiCkH4AU8NACAKIQMMAQsgCkEDcSELQQAhBUEAIQgDQCAIIQggBSEDAkACQCACLwEEIgUgAi8BBk8NACAAKALkASEHIAIgBUEBajsBBCAHIAVqLQAAIQcMAQsgAUEIaiAAQeQAEIEBQQAhBwsgA0EBaiEFIAhBCHQgB0H/AXFyIgchCCADIAtHDQALQQAgB2sgByAKQQRxGyEDCyAAIAM2AlALIAAgAC0AQjoAQwJAAkAgCUEQcUUNACACIABBsJMBIAZBAnRqKAIAEQIAIAAtAEJFDQEgAUEIaiAAQecAEIEBDAELIAEgAiAAQbCTASAGQQJ0aigCABEBAAJAIAAtAEIiAkEQSQ0AIAFBCGogAEHlABCBAQwBCyABKQMAIQwgACACQQFqOgBCIAAgAkEDdGpB2ABqIAw3AwALIAAtAEVFDQAgABDUAwsgACgC6AEiBSECIAQhAyAFDQAMAgsACyAAQeHUAxB2CyABQRBqJAALKgEBfwJAIAAoAugBDQBBAA8LQQAhAQJAIAAtAEYNACAALwEIRSEBCyABCyQBAX9BACEBAkAgAEHaAUsNACAAQQJ0QeCLAWooAgAhAQsgAQshACAAKAIAIgAgACgCWGogACAAKAJIaiABQQJ0aigCAGoLwQIBAn8jAEEQayIDJAAgAyAAKAIANgIMAkACQCADQQxqIAEQ+gMNAAJAIAINAEEAIQEMAgsgAkEANgIAQQAhAQwBCyABQf//AHEhBAJAAkACQAJAAkAgAUEOdkEDcQ4EAQIDAAELIAAoAgAiASABKAJYaiABIAEoAkhqIARBAnRqKAIAaiEBAkAgAkUNACACIAEvAQA2AgALIAEgAS8BAkEDdkH+P3FqQQRqIQEMBAsgACgCACIBIAEoAlBqIARBA3RqIQACQCACRQ0AIAIgACgCBDYCAAsgASABKAJYaiAAKAIAaiEBDAMLIARBAnRB4IsBaigCACEBDAELIAAoAgAiASABKAJYaiABIAEoAkBqIARBAXRqLwEAaiEBCyABIQECQCACRQ0AIAIgARDNBjYCAAsgASEBCyADQRBqJAAgAQtLAQF/IwBBEGsiAyQAIAMgACgC5AE2AgQgA0EEaiABIAIQiQQiASECAkAgAQ0AIANBCGogAEHoABCBAUHP7gAhAgsgA0EQaiQAIAILUAEBfyMAQRBrIgQkACAEIAEoAuQBNgIMAkACQCAEQQxqIAJBDnQgA3IiARD6Aw0AIABCADcDAAwBCyAAIAE2AgAgAEEENgIECyAEQRBqJAALDAAgACACQfIAEIEBCw4AIAAgAiACKAJQEKkDCzYAAkAgAS0AQkEBRg0AQaHbAEHGxwBBzwBBttUAEIAGAAsgAUEAOgBCIAEoAuwBQQBBABB1Ggs2AAJAIAEtAEJBAkYNAEGh2wBBxscAQc8AQbbVABCABgALIAFBADoAQiABKALsAUEBQQAQdRoLNgACQCABLQBCQQNGDQBBodsAQcbHAEHPAEG21QAQgAYACyABQQA6AEIgASgC7AFBAkEAEHUaCzYAAkAgAS0AQkEERg0AQaHbAEHGxwBBzwBBttUAEIAGAAsgAUEAOgBCIAEoAuwBQQNBABB1Ggs2AAJAIAEtAEJBBUYNAEGh2wBBxscAQc8AQbbVABCABgALIAFBADoAQiABKALsAUEEQQAQdRoLNgACQCABLQBCQQZGDQBBodsAQcbHAEHPAEG21QAQgAYACyABQQA6AEIgASgC7AFBBUEAEHUaCzYAAkAgAS0AQkEHRg0AQaHbAEHGxwBBzwBBttUAEIAGAAsgAUEAOgBCIAEoAuwBQQZBABB1Ggs2AAJAIAEtAEJBCEYNAEGh2wBBxscAQc8AQbbVABCABgALIAFBADoAQiABKALsAUEHQQAQdRoLNgACQCABLQBCQQlGDQBBodsAQcbHAEHPAEG21QAQgAYACyABQQA6AEIgASgC7AFBCEEAEHUaC/gBAgN/AX4jAEHQAGsiAiQAIAJByABqIAEQ6QQgAkHAAGogARDpBCABKALsAUEAKQOIiwE3AyAgASACKQNINwMwIAIgAikDQDcDMAJAIAEgAkEwahCPAyIDRQ0AIAIgAikDSDcDKAJAIAEgAkEoahDCAyIEDQAgAiACKQNINwMgIAJBOGogASACQSBqEMoDIAIgAikDOCIFNwNIIAIgBTcDGCABIAJBGGoQjgELIAIgAikDSDcDEAJAIAEgAyACQRBqEPgCDQAgASgC7AFBACkDgIsBNwMgCyAEDQAgAiACKQNINwMIIAEgAkEIahCPAQsgAkHQAGokAAteAQJ/IwBBEGsiAiQAIAEoAuwBIQMgAkEIaiABEOkEIAMgAikDCDcDICADIAAQeQJAIAEtAEdFDQAgASgCrAIgAEcNACABLQAHQQhxRQ0AIAFBCBCDBAsgAkEQaiQAC2IBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCUCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCBAUEAIQQLAkAgBCIBRQ0AIAAgATsBBAsgAkEQaiQAC4UBAQR/IwBBIGsiAiQAIAJBEGogARDpBCACIAIpAxA3AwggASACQQhqEOsDIQMCQAJAIAAoAhAoAgAgASgCUCABLwFAaiIESg0AIAQhBSAEIAAvAQZIDQELIAJBGGogAUHpABCBAUEAIQULAkAgBSIBRSADcg0AIAAgATsBBAsgAkEgaiQAC48BAQF/IwBBMGsiAyQAIANBKGogAhDpBCADQSBqIAIQ6QQCQCADKAIkQY+AwP8HcQ0AIAMoAiBBoH9qQStLDQAgAyADKQMgNwMQIANBGGogAiADQRBqQdgAEJUDIAMgAykDGDcDIAsgAyADKQMoNwMIIAMgAykDIDcDACAAIAIgA0EIaiADEIcDIANBMGokAAuOAQECfyMAQSBrIgMkACACKAJQIQQgAyACKALkATYCDAJAAkAgA0EMaiAEQYCAAXIiBBD6Aw0AIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCwJAIAMpAxBCAFINACADQRhqIAJB+gAQgQELIAJBARDvAiEEIAMgAykDEDcDACAAIAIgBCADEIwDIANBIGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARDpBAJAAkAgASgCUCIDIAAoAhAvAQhJDQAgAiABQe8AEIEBDAELIAAgA0EDdGpBGGogAikDCDcDAAsgAkEQaiQAC1YBAn8jAEEQayICJAAgAkEIaiABEOkEAkACQCABKAJQIgMgASgC5AEvAQxJDQAgAiABQfEAEIEBDAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC2EBA38jAEEgayICJAAgAkEYaiABEOkEIAEQ6gQhAyABEOoEIQQgAkEQaiABQQEQ7AQCQCACKQMQUA0AIAIgAikDEDcDACACQQhqIAEgBCADIAIgAkEYahBHCyACQSBqJAALDgAgAEEAKQOYiwE3AwALNwEBfwJAIAIoAlAiAyABKAIQLwEITw0AIAAgASADQQN0akEYaikDADcDAA8LIAAgAkHzABCBAQs4AQF/AkAgAigCUCIDIAIoAuQBLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkH2ABCBAQtxAQF/IwBBIGsiAyQAIANBGGogAhDpBCADIAMpAxg3AxACQAJAAkAgA0EQahDDAw0AIAMoAhwNASADKAIYQQJHDQELIAAgAykDGDcDAAwBCyADIAMpAxg3AwggACACIANBCGoQ6QMQ5QMLIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhDpBCADQRBqIAIQ6QQgAyADKQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADEJkDIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARDpBCACQSBqIAEQ6QQgAkEYaiABEOkEIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQmgMgAkEwaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQ6QQgAyADKQMgNwMoIAIoAlAhBCADIAIoAuQBNgIcAkACQCADQRxqIARBgIABciIEEPoDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEJcDCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQ6QQgAyADKQMgNwMoIAIoAlAhBCADIAIoAuQBNgIcAkACQCADQRxqIARBgIACciIEEPoDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEJcDCyADQcAAaiQAC8QBAQJ/IwBBwABrIgMkACADQSBqIAIQ6QQgAyADKQMgNwMoIAIoAlAhBCADIAIoAuQBNgIcAkACQCADQRxqIARBgIADciIEEPoDDQAgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkAgAykDMEIAUg0AIANBOGogAkH6ABCBAQsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEJcDCyADQcAAaiQAC44BAQJ/IwBBIGsiAyQAIAIoAlAhBCADIAIoAuQBNgIMAkACQCADQQxqIARBgIABciIEEPoDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEAEO8CIQQgAyADKQMQNwMAIAAgAiAEIAMQjAMgA0EgaiQAC44BAQJ/IwBBIGsiAyQAIAIoAlAhBCADIAIoAuQBNgIMAkACQCADQQxqIARBgIABciIEEPoDDQAgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLAkAgAykDEEIAUg0AIANBGGogAkH6ABCBAQsgAkEVEO8CIQQgAyADKQMQNwMAIAAgAiAEIAMQjAMgA0EgaiQAC00BA38jAEEQayICJAACQCABIAFBAhDvAhCQASIDDQAgAUEQEFELIAEoAuwBIQQgAkEIaiABQQggAxDoAyAEIAIpAwg3AyAgAkEQaiQAC38BA38jAEEQayICJAACQAJAIAEgARDqBCIDEJIBIgQNACABIANBA3RBEGoQUSABKALsASEDIAJBCGogAUEIIAQQ6AMgAyACKQMINwMgDAELIAEoAuwBIQMgAkEIaiABQQggBBDoAyADIAIpAwg3AyAgBEEAOwEICyACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARDqBCIDEJQBIgQNACABIANBDGoQUQsgASgC7AEhAyACQQhqIAFBCCAEEOgDIAMgAikDCDcDICACQRBqJAALNQEBfwJAIAIoAlAiAyACKALkAS8BDkkNACAAIAJBgwEQgQEPCyAAIAJBCCACIAMQjQMQ6AMLaQECfyMAQRBrIgMkACACKAJQIQQgAyACKALkATYCBAJAAkAgA0EEaiAEEPoDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCBAQsgA0EQaiQAC3ABAn8jAEEQayIDJAAgAigCUCEEIAMgAigC5AE2AgQCQAJAIANBBGogBEGAgAFyIgQQ+gMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsCQCAAKQMAQgBSDQAgA0EIaiACQfoAEIEBCyADQRBqJAALcAECfyMAQRBrIgMkACACKAJQIQQgAyACKALkATYCBAJAAkAgA0EEaiAEQYCAAnIiBBD6Aw0AIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECwJAIAApAwBCAFINACADQQhqIAJB+gAQgQELIANBEGokAAtwAQJ/IwBBEGsiAyQAIAIoAlAhBCADIAIoAuQBNgIEAkACQCADQQRqIARBgIADciIEEPoDDQAgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLAkAgACkDAEIAUg0AIANBCGogAkH6ABCBAQsgA0EQaiQACzkBAX8CQCACKAJQIgMgAigA5AFBJGooAgBBBHZJDQAgACACQfgAEIEBDwsgACADNgIAIABBAzYCBAsMACAAIAIoAlAQ5gMLQwECfwJAIAIoAlAiAyACKADkASIEQTRqKAIAQQN2Tw0AIAAgBCAEKAIwaiADQQN0aikAADcDAA8LIAAgAkH3ABCBAQtfAQN/IwBBEGsiAyQAIAIQ6gQhBCACEOoEIQUgA0EIaiACQQIQ7AQCQAJAIAMpAwhCAFINACAAQgA3AwAMAQsgAyADKQMINwMAIAAgAiAFIAQgA0EAEEcLIANBEGokAAsQACAAIAIoAuwBKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEOkEIAMgAykDCDcDACAAIAIgAxDyAxDmAyADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACEOkEIABBgIsBQYiLASADKQMIUBspAwA3AwAgA0EQaiQACw4AIABBACkDgIsBNwMACw4AIABBACkDiIsBNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEOkEIAMgAykDCDcDACAAIAIgAxDrAxDnAyADQRBqJAALDgAgAEEAKQOQiwE3AwALqgECAX8BfCMAQRBrIgMkACADQQhqIAIQ6QQCQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCACIAMQ6QMiBEQAAAAAAAAAAGNFDQAgACAEmhDlAwwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQP4igE3AwAMAgsgAEEAIAJrEOYDDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhDrBEF/cxDmAwsyAQF/IwBBEGsiAyQAIANBCGogAhDpBCAAIAMoAgxFIAMoAghBAkZxEOcDIANBEGokAAtyAQF/IwBBEGsiAyQAIANBCGogAhDpBAJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxDpA5oQ5QMMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQP4igE3AwAMAQsgAEEAIAJrEOYDCyADQRBqJAALNwEBfyMAQRBrIgMkACADQQhqIAIQ6QQgAyADKQMINwMAIAAgAiADEOsDQQFzEOcDIANBEGokAAsMACAAIAIQ6wQQ5gMLqQICBX8BfCMAQcAAayIDJAAgA0E4aiACEOkEIAJBGGoiBCADKQM4NwMAIANBOGogAhDpBCACIAMpAzg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAQoAgAiBkEASCAFKAIAIgcgBmoiBiAHSHMNACAAIAYQ5gMMAQsgAyAFKQMANwMwAkACQCACIANBMGoQwgMNACADIAQpAwA3AyggAiADQShqEMIDRQ0BCyADIAUpAwA3AxAgAyAEKQMANwMIIAAgAiADQRBqIANBCGoQzQMMAQsgAyAFKQMANwMgIAIgAiADQSBqEOkDOQMgIAMgBCkDADcDGCACQShqIAIgA0EYahDpAyIIOQMAIAAgCCACKwMgoBDlAwsgA0HAAGokAAvNAQIFfwF8IwBBIGsiAyQAIANBGGogAhDpBCACQRhqIgQgAykDGDcDACADQRhqIAIQ6QQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAEKAIAIgZBAEogBSgCACIHIAZrIgYgB0hzDQAgACAGEOYDDAELIAMgBSkDADcDECACIAIgA0EQahDpAzkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ6QMiCDkDACAAIAIrAyAgCKEQ5QMLIANBIGokAAvPAQMEfwF+AXwjAEEgayIDJAAgA0EYaiACEOkEIAJBGGoiBCADKQMYNwMAIANBGGogAhDpBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AIAU0AgAgBDQCAH4iB0IgiKcgB6ciBkEfdUcNACAAIAYQ5gMMAQsgAyAFKQMANwMQIAIgAiADQRBqEOkDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDpAyIIOQMAIAAgCCACKwMgohDlAwsgA0EgaiQAC+gBAgZ/AXwjAEEgayIDJAAgA0EYaiACEOkEIAJBGGoiBCADKQMYNwMAIANBGGogAhDpBCACIAMpAxg3AxAgAkEQaiEFAkACQCACKAAUQX9HDQAgAigAHEF/Rw0AAkACQCAEKAIAIgZBAWoOAgACAQsgBSgCAEGAgICAeEYNAQsgBSgCACIHIAZtIgggBmwgB0cNACAAIAgQ5gMMAQsgAyAFKQMANwMQIAIgAiADQRBqEOkDOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDpAyIJOQMAIAAgAisDICAJoxDlAwsgA0EgaiQACywBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhAgACAEIAMoAgBxEOYDCywBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhAgACAEIAMoAgByEOYDCywBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhAgACAEIAMoAgBzEOYDCywBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhAgACAEIAMoAgB0EOYDCywBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhAgACAEIAMoAgB1EOYDC0EBAn8gAkEYaiIDIAIQ6wQ2AgAgAiACEOsEIgQ2AhACQCAEIAMoAgB2IgJBf0oNACAAIAK4EOUDDwsgACACEOYDC50BAQN/IwBBIGsiAyQAIANBGGogAhDpBCACQRhqIgQgAykDGDcDACADQRhqIAIQ6QQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFKAIAIAQoAgBGIQIMAQsgAyAFKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahD2AyECCyAAIAIQ5wMgA0EgaiQAC74BAgN/AXwjAEEgayIDJAAgA0EYaiACEOkEIAJBGGoiBCADKQMYNwMAIANBGGogAhDpBCACIAMpAxg3AxAgAkEQaiEFAkACQAJAIAIoABRBf0cNACACKAAcQX9GDQELIAMgBSkDADcDECACIAIgA0EQahDpAzkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ6QMiBjkDACACKwMgIAZlIQIMAQsgBSgCACAEKAIATCECCyAAIAIQ5wMgA0EgaiQAC74BAgN/AXwjAEEgayIDJAAgA0EYaiACEOkEIAJBGGoiBCADKQMYNwMAIANBGGogAhDpBCACIAMpAxg3AxAgAkEQaiEFAkACQAJAIAIoABRBf0cNACACKAAcQX9GDQELIAMgBSkDADcDECACIAIgA0EQahDpAzkDICADIAQpAwA3AwggAkEoaiACIANBCGoQ6QMiBjkDACACKwMgIAZjIQIMAQsgBSgCACAEKAIASCECCyAAIAIQ5wMgA0EgaiQAC6ABAQN/IwBBIGsiAyQAIANBGGogAhDpBCACQRhqIgQgAykDGDcDACADQRhqIAIQ6QQgAiADKQMYNwMQIAJBEGohBQJAAkAgAigAFEF/Rw0AIAIoABxBf0cNACAFKAIAIAQoAgBHIQIMAQsgAyAFKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahD2A0EBcyECCyAAIAIQ5wMgA0EgaiQACz4BAX8jAEEQayIDJAAgA0EIaiACEOkEIAMgAykDCDcDACAAQYCLAUGIiwEgAxD0AxspAwA3AwAgA0EQaiQAC+IBAQV/IwBBEGsiAiQAIAJBCGogARDpBAJAAkAgARDrBCIDQQFODQBBACEDDAELAkACQCAADQAgACEDIABBAEchBAwBCyAAIQUgAyEGA0AgBiEAIAUoAggiA0EARyEEAkAgAw0AIAMhAyAEIQQMAgsgAyEFIABBf2ohBiADIQMgBCEEIABBAUoNAAsLIAMhAEEAIQMgBEUNACAAIAEoAlAiA0EDdGpBGGpBACADIAAoAhAvAQhJGyEDCwJAAkAgAyIDDQAgAiABQfAAEIEBDAELIAMgAikDCDcDAAsgAkEQaiQAC8QBAQR/AkACQCACEOsEIgNBAU4NAEEAIQMMAQsCQAJAIAENACABIQMgAUEARyEEDAELIAEhBSADIQYDQCAGIQEgBSgCCCIDQQBHIQQCQCADDQAgAyEDIAQhBAwCCyADIQUgAUF/aiEGIAMhAyAEIQQgAUEBSg0ACwsgAyEBQQAhAyAERQ0AIAEgAigCUCIDQQN0akEYakEAIAMgASgCEC8BCEkbIQMLAkAgAyIDDQAgACACQfQAEIEBDwsgACADKQMANwMACzYBAX8CQCACKAJQIgMgAigA5AFBJGooAgBBBHZJDQAgACACQfUAEIEBDwsgACACIAEgAxCIAwu6AQEDfyMAQSBrIgMkACADQRBqIAIQ6QQgAyADKQMQNwMIQQAhBAJAIAIgA0EIahDyAyIFQQ1LDQAgBUGwlgFqLQAAIQQLAkACQCAEIgQNACAAQgA3AwAMAQsgAiAENgJQIAMgAigC5AE2AgQCQAJAIANBBGogBEGAgAFyIgQQ+gMNACAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgACkDAEIAUg0AIANBGGogAkH6ABCBAQsgA0EgaiQAC4MBAQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAlAgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQgQFBACEECwJAIAQiBEUNACACIAEoAuwBKQMgNwMAIAIQ9ANFDQAgASgC7AFCADcDICAAIAQ7AQQLIAJBEGokAAulAQECfyMAQTBrIgIkACACQShqIAEQ6QQgAkEgaiABEOkEIAIgAikDKDcDEAJAAkACQCABIAJBEGoQ8QMNACACIAIpAyg3AwggAkEYaiABQQ8gAkEIahDaAwwBCyABLQBCDQEgAUEBOgBDIAEoAuwBIQMgAiACKQMoNwMAIANBACABIAIQ8AMQdRoLIAJBMGokAA8LQfHcAEHGxwBB7gBBzQgQgAYAC1oBA38jAEEQayICJAACQAJAIAAoAhAoAgAgASgCUCABLwFAaiIDSg0AIAMhBCADIAAvAQZIDQELIAJBCGogAUHpABCBAUEAIQQLIAAgASAEEM8DIAJBEGokAAt7AQN/IwBBEGsiAiQAAkACQCAAKAIQKAIAIAEoAlAgAS8BQGoiA0oNACADIQQgAyAALwEGSA0BCyACQQhqIAFB6QAQgQFBACEECwJAIAQiBEUNACAAIAQ7AQQLAkAgACABENADDQAgAkEIaiABQeoAEIEBCyACQRBqJAALIQEBfyMAQRBrIgIkACACQQhqIAFB6wAQgQEgAkEQaiQAC0YBAX8jAEEQayICJAACQAJAIAAgARDQAyAALwEEQX9qRw0AIAEoAuwBQgA3AyAMAQsgAkEIaiABQe0AEIEBCyACQRBqJAALXQEBfyMAQSBrIgIkACACQRhqIAEQ6QQgAiACKQMYNwMIAkACQCACQQhqEPQDRQ0AIAJBEGogAUHTPkEAENYDDAELIAIgAikDGDcDACABIAJBABDTAwsgAkEgaiQACzwBAX8jAEEQayICJAAgAkEIaiABEOkEAkAgAikDCFANACACIAIpAwg3AwAgASACQQEQ0wMLIAJBEGokAAuYAQEEfyMAQRBrIgIkAAJAAkAgARDrBCIDQRBJDQAgAkEIaiABQe4AEIEBDAELAkACQCAAKAIQKAIAIAEoAlAgAS8BQGoiBEoNACAEIQUgBCAALwEGSA0BCyACQQhqIAFB6QAQgQFBACEFCyAFIgBFDQAgAkEIaiAAIAMQ+QMgAiACKQMINwMAIAEgAkEBENMDCyACQRBqJAALCQAgAUEHEIMEC4QCAQN/IwBBIGsiAyQAIANBGGogAhDpBCADIAMpAxg3AwACQAJAAkACQCACIAMgA0EQaiADQQxqEIkDIgRBf0oNACAAIAJBwCZBABDWAwwBCwJAAkAgBEHQhgNIDQAgBEGw+XxqIgRBAC8BmO4BTg0DQZD/ACAEQQN0ai0AA0EIcQ0BIAAgAkGaHUEAENYDDAILIAQgAigA5AEiBUEkaigCAEEEdk4NAyAFIAUoAiBqIARBBHRqLQALQQJxDQAgACACQaIdQQAQ1gMMAQsgACADKQMYNwMACyADQSBqJAAPC0HwFkHGxwBB0QJB1wwQgAYAC0Gr5wBBxscAQdYCQdcMEIAGAAtWAQJ/IwBBIGsiAyQAIANBGGogAhDpBCADQRBqIAIQ6QQgAyADKQMYNwMIIAIgA0EIahCUAyEEIAMgAykDEDcDACAAIAIgAyAEEJYDEOcDIANBIGokAAsOACAAQQApA6CLATcDAAudAQEDfyMAQSBrIgMkACADQRhqIAIQ6QQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOkEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARiECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9QMhAgsgACACEOcDIANBIGokAAugAQEDfyMAQSBrIgMkACADQRhqIAIQ6QQgAkEYaiIEIAMpAxg3AwAgA0EYaiACEOkEIAIgAykDGDcDECACQRBqIQUCQAJAIAIoABRBf0cNACACKAAcQX9HDQAgBSgCACAEKAIARyECDAELIAMgBSkDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQ9QNBAXMhAgsgACACEOcDIANBIGokAAssAQF/IwBBEGsiAiQAIAJBCGogARDpBCABKALsASACKQMINwMgIAJBEGokAAsuAQF/AkAgAigCUCIDIAIoAuQBLwEOSQ0AIAAgAkGAARCBAQ8LIAAgAiADEPoCCz8BAX8CQCABLQBCIgINACAAIAFB7AAQgQEPCyABIAJBf2oiAjoAQiAAIAEgAkH/AXFBA3RqQdgAaikDADcDAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQgQEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHYAGopAwA3AwgLIAEgASkDCDcDACAAIAEQ6gMhACABQRBqJAAgAAtrAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQgQEMAQsgACACQX9qIgI6AEIgASAAIAJB/wFxQQN0akHYAGopAwA3AwgLIAEgASkDCDcDACAAIAEQ6gMhACABQRBqJAAgAAuJAgICfwF+IwBBwABrIgMkAAJAAkAgAS0AQiIEDQAgA0E4aiABQewAEIEBDAELIAEgBEF/aiIEOgBCIAMgASAEQf8BcUEDdGpB2ABqKQMANwM4CyADIAMpAzg3AygCQAJAIAEgA0EoahDsAw0AAkAgAkECcUUNACADIAMpAzg3AyAgASADQSBqEMIDDQELIAMgAykDODcDGCADQTBqIAFBEiADQRhqENoDQgAhBQwBCwJAIAJBAXFFDQAgAyADKQM4NwMQIAEgA0EQahDtAw0AIAMgAykDODcDCCADQTBqIAFBqSAgA0EIahDbA0IAIQUMAQsgAykDOCEFCyAAIAU3AwAgA0HAAGokAAu+BAEFfwJAIAVB9v8DTw0AIAAQ8QRBAEEBOgDwggJBACABKQAANwDxggJBACABQQVqIgYpAAA3APaCAkEAIAVBCHQgBUGA/gNxQQh2cjsB/oICQQAgA0ECdEH4AXFBeWo6APCCAkHwggIQ8gQCQCAFRQ0AQQAhAANAAkAgBSAAIgdrIgBBECAAQRBJGyIIRQ0AIAQgB2ohCUEAIQADQCAAIgBB8IICaiIKIAotAAAgCSAAai0AAHM6AAAgAEEBaiIKIQAgCiAIRw0ACwtB8IICEPIEIAdBEGoiCiEAIAogBUkNAAsLIAJB8IICIAMQngYhCEEAQQE6APCCAkEAIAEpAAA3APGCAkEAIAYpAAA3APaCAkEAQQA7Af6CAkHwggIQ8gQCQCADQRAgA0EQSRsiCUUNAEEAIQADQCAIIAAiAGoiCiAKLQAAIABB8IICai0AAHM6AAAgAEEBaiIKIQAgCiAJRw0ACwsCQCAFRQ0AIAFBBWohAkEAIQBBASEKA0BBAEEBOgDwggJBACABKQAANwDxggJBACACKQAANwD2ggJBACAKIgdBCHQgB0GA/gNxQQh2cjsB/oICQfCCAhDyBAJAIAUgACIDayIAQRAgAEEQSRsiCEUNACAEIANqIQlBACEAA0AgCSAAIgBqIgogCi0AACAAQfCCAmotAABzOgAAIABBAWoiCiEAIAogCEcNAAsLIANBEGoiCCEAIAdBAWohCiAIIAVJDQALCxDzBA8LQfjJAEEwQeAPEPsFAAvWBQEGf0F/IQYCQCAFQfX/A0sNACAAEPEEAkAgBUUNACABQQVqIQdBACEAQQEhCANAQQBBAToA8IICQQAgASkAADcA8YICQQAgBykAADcA9oICQQAgCCIJQQh0IAlBgP4DcUEIdnI7Af6CAkHwggIQ8gQCQCAFIAAiCmsiAEEQIABBEEkbIgZFDQAgBCAKaiELQQAhAANAIAsgACIAaiIIIAgtAAAgAEHwggJqLQAAczoAACAAQQFqIgghACAIIAZHDQALCyAKQRBqIgYhACAJQQFqIQggBiAFSQ0ACwtBAEEBOgDwggJBACABKQAANwDxggJBACABQQVqKQAANwD2ggJBACAFQQh0IAVBgP4DcUEIdnI7Af6CAkEAIANBAnRB+AFxQXlqOgDwggJB8IICEPIEAkAgBUUNAEEAIQADQAJAIAUgACIJayIAQRAgAEEQSRsiBkUNACAEIAlqIQtBACEAA0AgACIAQfCCAmoiCCAILQAAIAsgAGotAABzOgAAIABBAWoiCCEAIAggBkcNAAsLQfCCAhDyBCAJQRBqIgghACAIIAVJDQALCwJAAkAgA0EQIANBEEkbIgZFDQBBACEAA0AgAiAAIgBqIgggCC0AACAAQfCCAmotAABzOgAAIABBAWoiCCEAIAggBkcNAAtBAEEBOgDwggJBACABKQAANwDxggJBACABQQVqKQAANwD2ggJBAEEAOwH+ggJB8IICEPIEIAZFDQFBACEAA0AgAiAAIgBqIgggCC0AACAAQfCCAmotAABzOgAAIABBAWoiCCEAIAggBkcNAAwCCwALQQBBAToA8IICQQAgASkAADcA8YICQQAgAUEFaikAADcA9oICQQBBADsB/oICQfCCAhDyBAsQ8wQCQCADDQBBAA8LQQAhAEEAIQgDQCAAIgZBAWoiCyEAIAggAiAGai0AAGoiBiEIIAYhBiALIANHDQALCyAGC90DAQh/QQAhAgNAIAAgAiIDQQJ0IgJqIAEgAmotAAA6AAAgACACQQFyIgRqIAEgBGotAAA6AAAgACACQQJyIgRqIAEgBGotAAA6AAAgACACQQNyIgJqIAEgAmotAAA6AAAgA0EBaiIDIQIgA0EIRw0AC0EIIQIDQCACIgNBAnQiASAAaiICQX9qLQAAIQUgAkF+ai0AACEGIAJBfWotAAAhByACQXxqLQAAIQgCQAJAIANBB3EiBEUNACAFIQkgBiEFIAchBiAIIQcMAQsgCEHAlgFqLQAAIQkgBUHAlgFqLQAAIQUgBkHAlgFqLQAAIQYgA0EDdkHAmAFqLQAAIAdBwJYBai0AAHMhBwsgByEHIAYhBiAFIQUgCSEIAkACQCAEQQRGDQAgCCEEIAUhBSAGIQYgByEHDAELIAhB/wFxQcCWAWotAAAhBCAFQf8BcUHAlgFqLQAAIQUgBkH/AXFBwJYBai0AACEGIAdB/wFxQcCWAWotAAAhBwsgAiACQWBqLQAAIAdzOgAAIAAgAUEBcmogAkFhai0AACAGczoAACAAIAFBAnJqIAJBYmotAAAgBXM6AAAgACABQQNyaiACQWNqLQAAIARzOgAAIANBAWoiASECIAFBPEcNAAsLzAUBCX9BACECA0AgAiIDQQJ0IQRBACECA0AgASAEaiACIgJqIgUgBS0AACAAIAIgBGpqLQAAczoAACACQQFqIgUhAiAFQQRHDQALIANBAWoiBCECIARBBEcNAAtBASECA0AgAiEGQQAhAgNAIAIhBUEAIQIDQCABIAIiAkECdGogBWoiBCAELQAAQcCWAWotAAA6AAAgAkEBaiIEIQIgBEEERw0ACyAFQQFqIgQhAiAEQQRHDQALIAEtAAEhAiABIAEtAAU6AAEgAS0ACSEEIAEgAS0ADToACSABIAQ6AAUgASACOgANIAEtAAIhAiABIAEtAAo6AAIgASACOgAKIAEtAAYhAiABIAEtAA46AAYgASACOgAOIAEtAAMhAiABIAEtAA86AAMgASABLQALOgAPIAEgAS0ABzoACyABIAI6AAcCQCAGQQ5GDQBBACECA0AgASACIgdBAnRqIgIgAi0AAyIEIAItAAAiBXMiA0EBdCADwEEHdkEbcXMgBHMgBCACLQACIgNzIgggAi0AASIJIAVzIgpzIgRzOgADIAIgAyAIQQF0IAjAQQd2QRtxc3MgBHM6AAIgAiAJIAMgCXMiA0EBdCADwEEHdkEbcXNzIARzOgABIAIgBSAKQQF0IArAQQd2QRtxc3MgBHM6AAAgB0EBaiIEIQIgBEEERw0ACyAGQQR0IQlBACECA0AgAiIIQQJ0IgUgCWohA0EAIQIDQCABIAVqIAIiAmoiBCAELQAAIAAgAyACamotAABzOgAAIAJBAWoiBCECIARBBEcNAAsgCEEBaiIEIQIgBEEERw0ACyAGQQFqIQIMAQsLQQAhAgNAIAIiCEECdCIFQeABaiEDQQAhAgNAIAEgBWogAiICaiIEIAQtAAAgACADIAJqai0AAHM6AAAgAkEBaiIEIQIgBEEERw0ACyAIQQFqIgQhAiAEQQRHDQALCwsAQYCDAiAAEO8ECwsAQYCDAiAAEPAECw8AQYCDAkEAQfABEKAGGgupAQEFf0GUfyEEAkACQEEAKALwhAINAEEAQQA2AfaEAiAAEM0GIgQgAxDNBiIFaiIGIAIQzQYiB2oiCEH2fWpB8H1NDQEgBEH8hAIgACAEEJ4GakEAOgAAIARB/YQCaiADIAUQngYhBCAGQf2EAmpBADoAACAEIAVqQQFqIAIgBxCeBhogCEH+hAJqQQA6AAAgACABED4hBAsgBA8LQb3JAEE3QcgMEPsFAAsLACAAIAFBAhD2BAvoAQEFfwJAIAFBgOADTw0AQQhBBiABQf0ASxsgAWoiAxAfIgQgAkGAAXI6AAACQAJAIAFB/gBJDQAgBCABOgADIARB/gA6AAEgBCABQQh2OgACIARBBGohAgwBCyAEIAE6AAEgBEECaiECCyAEIAQtAAFBgAFyOgABIAIiBRD0BTYAAAJAIAFFDQAgBUEEaiEGQQAhAgNAIAYgAiICaiAFIAJBA3FqLQAAIAAgAmotAABzOgAAIAJBAWoiByECIAcgAUcNAAsLIAQgAxA/IQIgBBAgIAIPC0HE2wBBvckAQcQAQYE4EIAGAAu6AgECfyMAQcAAayIDJAACQAJAQQAoAvCEAiIERQ0AIAAgASACIAQRAQAMAQsCQAJAAkACQCAAQX9qDgQAAgMBBAtBAEEBOgD0hAIgA0E1akELECggA0E1akELEIgGIQBB/IQCEM0GQf2EAmoiAhDNBiEBIANBJGoQ7gU2AgAgA0EgaiACNgIAIAMgADYCHCADQfyEAjYCGCADQfyEAjYCFCADIAIgAWpBAWo2AhBB4OwAIANBEGoQhwYhAiAAECAgAiACEM0GED9Bf0oNA0EALQD0hAJB/wFxQf8BRg0DIANBzx02AgBBmxsgAxA7QQBB/wE6APSEAkEDQc8dQRAQ/gQQQAwDCyABIAIQ+AQMAgtBAiABIAIQ/gQMAQtBAEH/AToA9IQCEEBBAyABIAIQ/gQLIANBwABqJAALtQ4BCH8jAEGwAWsiAiQAIAEhASAAIQACQAJAAkADQCAAIQAgASEBQQAtAPSEAkH/AUYNAQJAAkACQCABQY4CQQAvAfaEAiIDayIESg0AQQIhAwwBCwJAIANBjgJJDQAgAkGKDDYCoAFBmxsgAkGgAWoQO0EAQf8BOgD0hAJBA0GKDEEOEP4EEEBBASEDDAELIAAgBBD4BEEAIQMgASAEayEBIAAgBGohAAwBCyABIQEgACEACyABIgQhASAAIgUhACADIgNFDQALAkAgA0F/ag4CAQABC0EALwH2hAJB/IQCaiAFIAQQngYaQQBBAC8B9oQCIARqIgE7AfaEAiABQf//A3EiAEGPAk8NAiAAQfyEAmpBADoAAAJAQQAtAPSEAkEBRw0AIAFB//8DcUEMSQ0AAkBB/IQCQYPbABCMBkUNAEEAQQI6APSEAkH32gBBABA7DAELIAJB/IQCNgKQAUG5GyACQZABahA7QQAtAPSEAkH/AUYNACACQYk0NgKAAUGbGyACQYABahA7QQBB/wE6APSEAkEDQYk0QRAQ/gQQQAsCQEEALQD0hAJBAkcNAAJAAkBBAC8B9oQCIgUNAEF/IQMMAQtBfyEAQQAhAQJAA0AgACEAAkAgASIBQfyEAmotAABBCkcNACABIQACQAJAIAFB/YQCai0AAEF2ag4EAAICAQILIAFBAmoiAyEAIAMgBU0NA0HZHEG9yQBBlwFBrS0QgAYACyABIQAgAUH+hAJqLQAAQQpHDQAgAUEDaiIDIQAgAyAFTQ0CQdkcQb3JAEGXAUGtLRCABgALIAAiAyEAIAFBAWoiBCEBIAMhAyAEIAVHDQAMAgsAC0EAIAUgACIAayIDOwH2hAJB/IQCIABB/IQCaiADQf//A3EQnwYaQQBBAzoA9IQCIAEhAwsgAyEBAkACQEEALQD0hAJBfmoOAgABAgsCQAJAIAFBAWoOAgADAQtBAEEAOwH2hAIMAgsgAUEALwH2hAIiAEsNA0EAIAAgAWsiADsB9oQCQfyEAiABQfyEAmogAEH//wNxEJ8GGgwBCyACQQAvAfaEAjYCcEGBwwAgAkHwAGoQO0EBQQBBABD+BAtBAC0A9IQCQQNHDQADQEEAIQECQEEALwH2hAIiA0EALwH4hAIiAGsiBEECSA0AAkAgAEH9hAJqLQAAIgXAIgFBf0oNAEEAIQFBAC0A9IQCQf8BRg0BIAJBrRI2AmBBmxsgAkHgAGoQO0EAQf8BOgD0hAJBA0GtEkEREP4EEEBBACEBDAELAkAgAUH/AEcNAEEAIQFBAC0A9IQCQf8BRg0BIAJB1+IANgIAQZsbIAIQO0EAQf8BOgD0hAJBA0HX4gBBCxD+BBBAQQAhAQwBCyAAQfyEAmoiBiwAACEHAkACQCABQf4ARg0AIAUhBSAAQQJqIQgMAQtBACEBIARBBEgNAQJAIABB/oQCai0AAEEIdCAAQf+EAmotAAByIgFB/QBNDQAgASEFIABBBGohCAwBC0EAIQFBAC0A9IQCQf8BRg0BIAJBgyo2AhBBmxsgAkEQahA7QQBB/wE6APSEAkEDQYMqQQsQ/gQQQEEAIQEMAQtBACEBIAgiCCAFIgVqIgkgA0oNAAJAIAdB/wBxIgFBCEkNAAJAIAdBAEgNAEEAIQFBAC0A9IQCQf8BRg0CIAJBkCk2AiBBmxsgAkEgahA7QQBB/wE6APSEAkEDQZApQQwQ/gQQQEEAIQEMAgsCQCAFQf4ASA0AQQAhAUEALQD0hAJB/wFGDQIgAkGdKTYCMEGbGyACQTBqEDtBAEH/AToA9IQCQQNBnSlBDhD+BBBAQQAhAQwCCwJAAkACQAJAIAFBeGoOAwIAAwELIAYgBUEKEPYERQ0CQd0tEPkEQQAhAQwEC0GDKRD5BEEAIQEMAwtBAEEEOgD0hAJBtDZBABA7QQIgCEH8hAJqIAUQ/gQLIAYgCUH8hAJqQQAvAfaEAiAJayIBEJ8GGkEAQQAvAfiEAiABajsB9oQCQQEhAQwBCwJAIABFDQAgAUUNAEEAIQFBAC0A9IQCQf8BRg0BIAJBh9MANgJAQZsbIAJBwABqEDtBAEH/AToA9IQCQQNBh9MAQQ4Q/gQQQEEAIQEMAQsCQCAADQAgAUECRg0AQQAhAUEALQD0hAJB/wFGDQEgAkGO1gA2AlBBmxsgAkHQAGoQO0EAQf8BOgD0hAJBA0GO1gBBDRD+BBBAQQAhAQwBC0EAIAMgCCAAayIBazsB9oQCIAYgCEH8hAJqIAQgAWsQnwYaQQBBAC8B+IQCIAVqIgE7AfiEAgJAIAdBf0oNAEEEQfyEAiABQf//A3EiARD+BCABEPoEQQBBADsB+IQCC0EBIQELIAFFDQFBAC0A9IQCQf8BcUEDRg0ACwsgAkGwAWokAA8LQdkcQb3JAEGXAUGtLRCABgALQe7YAEG9yQBBsgFBh88AEIAGAAtKAQF/IwBBEGsiASQAAkBBAC0A9IQCQf8BRg0AIAEgADYCAEGbGyABEDtBAEH/AToA9IQCQQMgACAAEM0GEP4EEEALIAFBEGokAAtTAQF/AkACQCAARQ0AQQAvAfaEAiIBIABJDQFBACABIABrIgE7AfaEAkH8hAIgAEH8hAJqIAFB//8DcRCfBhoLDwtB2RxBvckAQZcBQa0tEIAGAAsxAQF/AkBBAC0A9IQCIgBBBEYNACAAQf8BRg0AQQBBBDoA9IQCEEBBAkEAQQAQ/gQLC88BAQV/IwBBEGsiBCQAQQAhBUEAIQYDQCAFIAMgBiIGai0AAGoiByEFIAZBAWoiCCEGIAhBIEcNAAsCQCAHDQBBwuwAQQAQO0GxygBBMEG8DBD7BQALQQAgAykAADcAjIcCQQAgA0EYaikAADcApIcCQQAgA0EQaikAADcAnIcCQQAgA0EIaikAADcAlIcCQQBBAToAzIcCQayHAkEQECggBEGshwJBEBCIBjYCACAAIAEgAkHQGCAEEIcGIgUQ9AQhBiAFECAgBEEQaiQAIAYL3AIBBH8jAEEQayIEJAACQAJAAkAQIQ0AAkAgAA0AIAJFDQBBfyEFDAMLAkAgAEEAR0EALQDMhwIiBkECRnFFDQBBfyEFDAMLQX8hBSAARSAGQQNGcQ0CIAMgAWoiBkEEaiIHEB8hBQJAIABFDQAgBSAAIAEQngYaCwJAIAJFDQAgBSABaiACIAMQngYaC0GMhwJBrIcCIAUgBmpBBCAFIAYQ7QQgBSAHEPUEIQAgBRAgIAANAUEMIQIDQAJAIAIiAEGshwJqIgUtAAAiAkH/AUYNACAAQayHAmogAkEBajoAAEEAIQUMBAsgBUEAOgAAIABBf2ohAkEAIQUgAA0ADAMLAAtBscoAQagBQfk3EPsFAAsgBEH7HDYCAEGpGyAEEDsCQEEALQDMhwJB/wFHDQAgACEFDAELQQBB/wE6AMyHAkEDQfscQQkQgQUQ+wQgACEFCyAEQRBqJAAgBQvnBgICfwF+IwBBkAFrIgMkAAJAECENAAJAAkACQAJAIABBfmoOAwECAAMLAkACQAJAQQAtAMyHAkF/ag4DAAECBQsgAyACNgJAQYzlACADQcAAahA7AkAgAkEXSw0AIANBgiU2AgBBqRsgAxA7QQAtAMyHAkH/AUYNBUEAQf8BOgDMhwJBA0GCJUELEIEFEPsEDAULIANB+ABqQRBqIAFBEGopAAA3AwAgA0H4AGpBCGogAUEIaikAADcDACADIAEpAAAiBTcDeAJAIAWnQcrRkPd8Rg0AIANB78QANgIwQakbIANBMGoQO0EALQDMhwJB/wFGDQVBAEH/AToAzIcCQQNB78QAQQkQgQUQ+wQMBQsCQCADKAJ8QQJGDQAgA0HsJjYCIEGpGyADQSBqEDtBAC0AzIcCQf8BRg0FQQBB/wE6AMyHAkEDQewmQQsQgQUQ+wQMBQtBAEEAQYyHAkEgQayHAkEQIANBgAFqQRBBjIcCEMADQQBCADcArIcCQQBCADcAvIcCQQBCADcAtIcCQQBCADcAxIcCQQBBAjoAzIcCQQBBAToArIcCQQBBAjoAvIcCAkBBAEEgQQBBABD9BEUNACADQYErNgIQQakbIANBEGoQO0EALQDMhwJB/wFGDQVBAEH/AToAzIcCQQNBgStBDxCBBRD7BAwFC0HxKkEAEDsMBAsgAyACNgJwQavlACADQfAAahA7AkAgAkEjSw0AIANB9Q42AlBBqRsgA0HQAGoQO0EALQDMhwJB/wFGDQRBAEH/AToAzIcCQQNB9Q5BDhCBBRD7BAwECyABIAIQ/wQNA0EAIQACQAJAIAEtAAANAEEAIQIDQCACIgRBAWoiAEEgRg0CIAAhAiABIABqLQAARQ0ACyAEQR5LIQALIAAhACADQeLbADYCYEGpGyADQeAAahA7AkBBAC0AzIcCQf8BRg0AQQBB/wE6AMyHAkEDQeLbAEEKEIEFEPsECyAARQ0EC0EAQQM6AMyHAkEBQQBBABCBBQwDCyABIAIQ/wQNAkEEIAEgAkF8ahCBBQwCCwJAQQAtAMyHAkH/AUYNAEEAQQQ6AMyHAgtBAiABIAIQgQUMAQtBAEH/AToAzIcCEPsEQQMgASACEIEFCyADQZABaiQADwtBscoAQcIBQZcREPsFAAuBAgEDfyMAQSBrIgIkAAJAAkACQCABQQRLDQAgAkG3LTYCAEGpGyACEDtBty0hAUEALQDMhwJB/wFHDQFBfyEBDAILQYyHAkG8hwIgACABQXxqIgFqQQQgACABEO4EIQNBDCEAAkADQAJAIAAiAUG8hwJqIgAtAAAiBEH/AUYNACABQbyHAmogBEEBajoAAAwCCyAAQQA6AAAgAUF/aiEAIAENAAsLAkAgAw0AQQAhAQwCCyACQcUdNgIQQakbIAJBEGoQO0HFHSEBQQAtAMyHAkH/AUcNAEF/IQEMAQtBAEH/AToAzIcCQQMgAUEJEIEFEPsEQX8hAQsgAkEgaiQAIAELNgEBfwJAECENAAJAQQAtAMyHAiIAQQRGDQAgAEH/AUYNABD7BAsPC0GxygBB3AFB3zMQ+wUAC4QJAQR/IwBBgAJrIgMkAEEAKALQhwIhBAJAAkACQAJAAkAgAEF/ag4EAAIDAQQLIAMgBCgCODYCEEHXGSADQRBqEDsgBEGAAjsBECAEQQAoArD7ASIAQYCAgAhqNgI0IAQgAEGAgIAQajYCKCAELwEGQQFGDQMgA0GY2QA2AgQgA0EBNgIAQcnlACADEDsgBEEBOwEGIARBAyAEQQZqQQIQjwYMAwsgBEEAKAKw+wEiAEGAgIAIajYCNCAEIABBgICAEGo2AigCQCACRQ0AIAMgAS0AACIAOgD/ASACQX9qIQUgAUEBaiEGAkACQAJAAkACQAJAAkACQAJAIABB8H5qDgoCAwwEBQYHAQgACAsgAS0AA0EMaiIEIAVLDQggBiAEEIoGIgQQlAYaIAQQIAwLCyAFRQ0HIAEtAAEgAUECaiACQX5qEFYMCgsgBC8BECECIAQgAS0AAkEIdCABLQABIgByOwEQAkAgAEEBcUUNACAEKAJkDQAgBEGAEBDWBTYCZAsCQCAELQAQQQJxRQ0AIAJBAnENACAEELUFNgIYCyAEQQAoArD7AUGAgIAIajYCFCADIAQvARA2AmBBrwsgA0HgAGoQOwwJCyADIAA6ANABIAQvAQZBAUcNCAJAIABB5QBqQf8BcUH9AUsNACADIAA2AnBBnwogA0HwAGoQOwsgA0HQAWpBAUEAQQAQ/QQNCCAEKAIMIgBFDQggBEEAKALgkAIgAGo2AjAMCAsgA0HQAWoQbBpBACgC0IcCIgQvAQZBAUcNBwJAIAMtAP8BIgBB5QBqQf8BcUH9AUsNACADIAA2AoABQZ8KIANBgAFqEDsLIANB/wFqQQEgA0HQAWpBIBD9BA0HIAQoAgwiAEUNByAEQQAoAuCQAiAAajYCMAwHCyAAIAEgBiAFEJ8GKAIAEGoQggUMBgsgACABIAYgBRCfBiAFEGsQggUMBQtBlgFBAEEAEGsQggUMBAsgAyAANgJQQYcLIANB0ABqEDsgA0H/AToA0AFBACgC0IcCIgQvAQZBAUcNAyADQf8BNgJAQZ8KIANBwABqEDsgA0HQAWpBAUEAQQAQ/QQNAyAEKAIMIgBFDQMgBEEAKALgkAIgAGo2AjAMAwsgAyACNgIwQZbDACADQTBqEDsgA0H/AToA0AFBACgC0IcCIgQvAQZBAUcNAiADQf8BNgIgQZ8KIANBIGoQOyADQdABakEBQQBBABD9BA0CIAQoAgwiAEUNAiAEQQAoAuCQAiAAajYCMAwCCwJAIAQoAjgiAEUNACADIAA2AqABQYo+IANBoAFqEDsLIAQgBEERai0AAEEIdDsBECAELwEGQQJGDQEgA0GV2QA2ApQBIANBAjYCkAFByeUAIANBkAFqEDsgBEECOwEGIARBAyAEQQZqQQIQjwYMAQsgAyABIAIQ5AI2AsABQd0YIANBwAFqEDsgBC8BBkECRg0AIANBldkANgK0ASADQQI2ArABQcnlACADQbABahA7IARBAjsBBiAEQQMgBEEGakECEI8GCyADQYACaiQAC+sBAQF/IwBBMGsiAiQAAkACQCABDQAgAiAAOgAuQQAoAtCHAiIBLwEGQQFHDQECQCAAQeUAakH/AXFB/QFLDQAgAiAAQf8BcTYCAEGfCiACEDsLIAJBLmpBAUEAQQAQ/QQNASABKAIMIgBFDQEgAUEAKALgkAIgAGo2AjAMAQsgAiAANgIgQYcKIAJBIGoQOyACQf8BOgAvQQAoAtCHAiIALwEGQQFHDQAgAkH/ATYCEEGfCiACQRBqEDsgAkEvakEBQQBBABD9BA0AIAAoAgwiAUUNACAAQQAoAuCQAiABajYCMAsgAkEwaiQAC8gFAQd/IwBBEGsiASQAAkACQCAAKAIMRQ0AQQAoAuCQAiAAKAIwa0EATg0BCwJAIABBFGpBgICACBD9BUUNACAALQAQRQ0AQaQ+QQAQOyAAIABBEWotAABBCHQ7ARALAkAgAC0AEEECcUUNAEEAKAKEiAIgACgCHEYNACABIAAoAhg2AggCQCAAKAIgDQAgAEGAAhAfNgIgCyAAKAIgQYACIAFBCGoQtgUhAkEAKAKEiAIhAyACRQ0AIAEoAgghBCAAKAIgIQUgAUGaAToADUGcfyEGAkBBACgC0IcCIgcvAQZBAUcNACABQQ1qQQEgBSACEP0EIgIhBiACDQACQCAHKAIMIgINAEEAIQYMAQsgB0EAKALgkAIgAmo2AjBBACEGCyAGDQAgACABKAIINgIYIAMgBEcNACAAQQAoAoSIAjYCHAsCQCAAKAJkRQ0AIAAoAmQQ1AUiAkUNACACIQIDQCACIQICQCAALQAQQQFxRQ0AIAItAAIhAyABQZkBOgAOQZx/IQYCQEEAKALQhwIiBS8BBkEBRw0AIAFBDmpBASACIANBDGoQ/QQiAiEGIAINAAJAIAUoAgwiAg0AQQAhBgwBCyAFQQAoAuCQAiACajYCMEEAIQYLIAYNAgsgACgCZBDVBSAAKAJkENQFIgYhAiAGDQALCwJAIABBNGpBgICAAhD9BUUNACABQZIBOgAPQQAoAtCHAiICLwEGQQFHDQAgAUGSATYCAEGfCiABEDsgAUEPakEBQQBBABD9BA0AIAIoAgwiBkUNACACQQAoAuCQAiAGajYCMAsCQCAAQSRqQYCAIBD9BUUNAEGbBCECAkAQQUUNACAALwEGQQJ0QdCYAWooAgAhAgsgAhAdCwJAIABBKGpBgIAgEP0FRQ0AIAAQhAULIABBLGogACgCCBD8BRogAUEQaiQADwtBmRNBABA7EDQAC7YCAQV/IwBBMGsiASQAIABBBmohAgJAAkACQCAALwEGQX5qDgMCAAEACyABQeTXADYCJCABQQQ2AiBByeUAIAFBIGoQOyAAQQQ7AQYgAEEDIAJBAhCPBgsQgAULAkAgACgCOEUNABBBRQ0AIAAtAGIhAyAAKAI4IQQgAC8BYCEFIAEgACgCPDYCHCABIAU2AhggASAENgIUIAFBkxZB3xUgAxs2AhBB9RggAUEQahA7IAAoAjhBACAALwFgIgNrIAMgAC0AYhsgACgCPCAAQcAAahD8BA0AAkAgAi8BAEEDRg0AIAFB59cANgIEIAFBAzYCAEHJ5QAgARA7IABBAzsBBiAAQQMgAkECEI8GCyAAQQAoArD7ASICQYCAgAhqNgI0IAAgAkGAgIAQajYCKAsgAUEwaiQAC/sCAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkACQAJAIAEvAQ4iA0H/fmoOBgIDBwcHAQALIANBgF1qDgQDBQYEBgsgACABQRBqIAEtAAxBARCGBQwGCyAAEIQFDAULAkACQCAALwEGQX5qDgMGAAEACyACQeTXADYCBCACQQQ2AgBByeUAIAIQOyAAQQQ7AQYgAEEDIABBBmpBAhCPBgsQgAUMBAsgASAAKAI4ENoFGgwDCyABQfvWABDaBRoMAgsCQAJAIAAoAjwiAA0AQQAhAAwBCyAAQQZBACAAQaniABCMBhtqIQALIAEgABDaBRoMAQsgACABQeSYARDdBUF+cUGAAUcNAAJAIAAoAghB5wdLDQAgAEHoBzYCCAsCQCAAKAIIQYG4mSlJDQAgAEGAuJkpNgIICyAAKAIMIgFFDQACQCABIAAoAghBA2wiA08NACAAIAM2AgwLIAAoAgwiAUUNACAAQQAoAuCQAiABajYCMAsgAkEQaiQAC/MEAQl/IwBBMGsiBCQAAkACQCACDQBBuC5BABA7IAAoAjgQICAAKAI8ECAgAEIANwI4IABB0AA7AWAgAEHAAGpCADcCACAAQcgAakIANwIAIABB0ABqQgA3AgAgAEHYAGpCADcCAAJAIANFDQBBzBxBABC0AxoLIAAQhAUMAQsCQAJAIAJBAWoQHyABIAIQngYiBRDNBkHGAEkNAAJAAkAgBUG24gAQjAYiBkUNAEG7AyEHQQYhCAwBCyAFQbDiABCMBkUNAUHQACEHQQUhCAsgByEJIAUgCGoiCEHAABDKBiEHIAhBOhDKBiEKIAdBOhDKBiELIAdBLxDKBiEMIAdFDQAgDEUNAAJAIAtFDQAgByALTw0BIAsgDE8NAQsCQAJAQQAgCiAKIAdLGyIKDQAgCCEIDAELIAhBzNkAEIwGRQ0BIApBAWohCAsgByAIIghrQcAARw0AIAdBADoAACAEQRBqIAgQ/wVBIEcNACAJIQgCQCALRQ0AIAtBADoAACALQQFqEIEGIgshCCALQYCAfGpBgoB8SQ0BCyAMQQA6AAAgB0EBahCJBiEHIAxBLzoAACAMEIkGIQsgABCHBSAAIAs2AjwgACAHNgI4IAAgBiAHQfwMEIsGIgtyOgBiIABBuwMgCCIHIAdB0ABGGyAHIAsbOwFgIAAgBCkDEDcCQCAAQcgAaiAEKQMYNwIAIABB0ABqIARBIGopAwA3AgAgAEHYAGogBEEoaikDADcCAAJAIANFDQBBzBwgBSABIAIQngYQtAMaCyAAEIQFDAELIAQgATYCAEHGGyAEEDtBABAgQQAQIAsgBRAgCyAEQTBqJAALSwAgACgCOBAgIAAoAjwQICAAQgA3AjggAEHQADsBYCAAQcAAakIANwIAIABByABqQgA3AgAgAEHQAGpCADcCACAAQdgAakIANwIAC0MBAn9B8JgBEOMFIgBBiCc2AgggAEECOwEGAkBBzBwQswMiAUUNACAAIAEgARDNBkEAEIYFIAEQIAtBACAANgLQhwILpAEBBH8jAEEQayIEJAAgARDNBiIFQQNqIgYQHyIHIAA6AAEgB0GYAToAACAHQQJqIAEgBRCeBhpBnH8hAQJAQQAoAtCHAiIALwEGQQFHDQAgBEGYATYCAEGfCiAEEDsgByAGIAIgAxD9BCIFIQEgBQ0AAkAgACgCDCIBDQBBACEBDAELIABBACgC4JACIAFqNgIwQQAhAQsgBxAgIARBEGokACABCw8AQQAoAtCHAi8BBkEBRguVAgEIfyMAQRBrIgEkAAJAQQAoAtCHAiICRQ0AIAJBEWotAABBAXFFDQAgAi8BBkEBRw0AIAEQtQU2AggCQCACKAIgDQAgAkGAAhAfNgIgCwNAIAIoAiBBgAIgAUEIahC2BSEDQQAoAoSIAiEEQQIhBQJAIANFDQAgASgCCCEGIAIoAiAhByABQZsBOgAPQZx/IQUCQEEAKALQhwIiCC8BBkEBRw0AIAFBmwE2AgBBnwogARA7IAFBD2pBASAHIAMQ/QQiAyEFIAMNAAJAIAgoAgwiBQ0AQQAhBQwBCyAIQQAoAuCQAiAFajYCMEEAIQULQQIgBCAGRkEBdCAFGyEFCyAFRQ0AC0H5P0EAEDsLIAFBEGokAAtQAQJ/IwBBEGsiASQAQQAhAgJAIAAvAQ5BgSNHDQAgAUEAKALQhwIoAjg2AgAgAEHT6wAgARCHBiICENoFGiACECBBASECCyABQRBqJAAgAgsNACAAKAIEEM0GQQ1qC2sCA38BfiAAKAIEEM0GQQ1qEB8hAQJAIAAoAhAiAkUNACACQQAgAi0ABCIDa0EMbGpBZGopAwAhBCABIAM6AAwgASAENwMACyABIAAoAgg2AgggACgCBCEAIAFBDWogACAAEM0GEJ4GGiABC4MDAgZ/AX4CQAJAIAAoAqACIgFFDQAgAEEYaiECIAEhAQNAAkAgAiABIgMoAgQQzQZBDWoiBBDQBSIBRQ0AIAFBAUYNAiAAQQA2AqACIAIQ0gUaDAILIAMoAgQQzQZBDWoQHyEBAkAgAygCECIFRQ0AIAVBACAFLQAEIgZrQQxsakFkaikDACEHIAEgBjoADCABIAc3AwALIAEgAygCCDYCCCADKAIEIQUgAUENaiAFIAUQzQYQngYaIAIgASAEENEFDQIgARAgIAMoAgAiASEDIAEhBQJAIAFFDQADQAJAIAMiAS0ADEEBcQ0AIAEhBQwCCyABKAIAIgEhAyABIQUgAQ0ACwsgACAFIgE2AqACAkAgAQ0AIAIQ0gUaCyAAKAKgAiIDIQEgAw0ACwsCQCAAQRBqQaDoOxD9BUUNACAAEJAFCwJAIABBFGpB0IYDEP0FRQ0AIAAtAAhFDQAgAEEAOgAIIABBA0EAQQAQjwYLDwtB6NwAQcPIAEG2AUGpFhCABgALnQcCCX8BfiMAQTBrIgEkAAJAAkAgAC0ABkUNAAJAAkAgAC0ACQ0AIABBAToACSAAKAIMIgJFDQEgAiECA0ACQCACIgIoAhANAEIAIQoCQAJAAkAgAi0ADQ4DAwEAAgsgACkDqAIhCgwBCxDzBSEKCyAKIgpQDQAgChCcBSIDRQ0AIAMtABBFDQBBACEEIAItAA4hBQNAIAUhBQJAAkAgAyAEIgZBDGxqIgRBJGoiBygCACACKAIIRg0AQQQhBCAFIQUMAQsgBUF/aiEIAkACQCAFRQ0AQQAhBAwBCwJAIARBKWoiBS0AAEEBcQ0AIAIoAhAiCSAHRg0AAkAgCUUNACAJIAktAAVB/gFxOgAFCyAFIAUtAABBAXI6AAAgAUEraiAHQQAgBEEoaiIFLQAAa0EMbGpBZGopAwAQhgYgAigCBCEEIAEgBS0AADYCGCABIAQ2AhAgASABQStqNgIUQejAACABQRBqEDsgAiAHNgIQIABBAToACCACEJsFC0ECIQQLIAghBQsgBSEFAkAgBA4FAAICAgACCyAGQQFqIgYhBCAFIQUgBiADLQAQSQ0ACwsgAigCACIFIQIgBQ0ADAILAAtBqD9Bw8gAQe4AQdE6EIAGAAsCQCAAKAIMIgJFDQAgAiECA0ACQCACIgYoAhANAAJAIAYtAA1FDQAgAC0ACg0BC0HghwIhAgJAA0ACQCACKAIAIgINAEEMIQMMAgtBASEFAkACQCACLQAQQQFLDQBBDyEDDAELA0ACQAJAIAIgBSIEQQxsaiIHQSRqIggoAgAgBigCCEYNAEEBIQVBACEDDAELQQEhBUEAIQMgB0EpaiIJLQAAQQFxDQACQAJAIAYoAhAiBSAIRw0AQQAhBQwBCwJAIAVFDQAgBSAFLQAFQf4BcToABQsgCSAJLQAAQQFyOgAAIAFBK2ogCEEAIAdBKGoiBS0AAGtBDGxqQWRqKQMAEIYGIAYoAgQhAyABIAUtAAA2AgggASADNgIAIAEgAUErajYCBEHowAAgARA7IAYgCDYCECAAQQE6AAggBhCbBUEAIQULQRIhAwsgAyEDIAVFDQEgBEEBaiIDIQUgAyACLQAQSQ0AC0EPIQMLIAIhAiADIgUhAyAFQQ9GDQALCyADQXRqDgcAAgICAgIAAgsgBigCACIFIQIgBQ0ACwsgAC0ACUUNASAAQQA6AAkLIAFBMGokAA8LQak/QcPIAEGEAUHROhCABgAL2gUCBn8BfiMAQcAAayICJAACQCAALQAJDQACQAJAAkACQAJAIAEvAQ5B/35qDgQBAwIAAwsgACgCDCIDRQ0DIAMhAwNAAkAgAyIDKAIQIgRFDQAgBCAELQAFQf4BcToABSACIAMoAgQ2AgBBzBogAhA7IANBADYCECAAQQE6AAggAxCbBQsgAygCACIEIQMgBA0ADAQLAAsCQAJAIAAoAgwiAw0AIAMhBQwBCyABQRlqIQYgAS0ADEFwaiEHIAMhBANAAkAgBCIDKAIEIgQgBiAHELgGDQAgBCAHai0AAA0AIAMhBQwCCyADKAIAIgMhBCADIQUgAw0ACwsgBSIDRQ0CAkAgASkDECIIQgBSDQAgAygCECIERQ0DIAQgBC0ABUH+AXE6AAUgAiADKAIENgIQQcwaIAJBEGoQOyADQQA2AhAgAEEBOgAIIAMQmwUMAwsCQAJAIAgQnAUiBw0AQQAhBAwBC0EAIQQgBy0AECABLQAYIgVNDQAgByAFQQxsakEkaiEECyAEIgRFDQIgAygCECIHIARGDQICQCAHRQ0AIAcgBy0ABUH+AXE6AAULIAQgBC0ABUEBcjoABSACQTtqIARBACAELQAEa0EMbGpBZGopAwAQhgYgAygCBCEHIAIgBC0ABDYCKCACIAc2AiAgAiACQTtqNgIkQejAACACQSBqEDsgAyAENgIQIABBAToACCADEJsFDAILIABBGGoiBSABEMsFDQECQAJAIAAoAgwiAw0AIAMhBwwBCyADIQQDQAJAIAQiAy0ADEEBcQ0AIAMhBwwCCyADKAIAIgMhBCADIQcgAw0ACwsgACAHIgM2AqACIAMNASAFENIFGgwBCyAAQQE6AAcgAEEMaiEEAkADQCAEKAIAIgNFDQEgAyEEIAMoAhANAAsgAEEAOgAHCyAAIAFBlJkBEN0FGgsgAkHAAGokAA8LQag/QcPIAEHcAUHmExCABgALLAEBf0EAQaCZARDjBSIANgLUhwIgAEEBOgAGIABBACgCsPsBQaDoO2o2AhAL2QEBBH8jAEEQayIBJAACQAJAQQAoAtSHAiICLQAJDQAgAkEBOgAJAkAgAigCDCIDRQ0AIAMhAwNAAkAgAyIEKAIQIgNFDQAgA0EAIAMtAARrQQxsakFcaiAARw0AIAMgAy0ABUH+AXE6AAUgASAEKAIENgIAQcwaIAEQOyAEQQA2AhAgAkEBOgAIIAQQmwULIAQoAgAiBCEDIAQNAAsLIAItAAlFDQEgAkEAOgAJIAFBEGokAA8LQag/QcPIAEGFAkHJPBCABgALQak/QcPIAEGLAkHJPBCABgALLwEBfwJAQQAoAtSHAiICDQBBw8gAQZkCQYEWEPsFAAsgAiAAOgAKIAIgATcDqAILvwMBBn8CQAJAAkACQAJAQQAoAtSHAiICRQ0AIAAQzQYhAwJAAkAgAigCDCIEDQAgBCEFDAELIAQhBgNAAkAgBiIEKAIEIgYgACADELgGDQAgBiADai0AAA0AIAQhBQwCCyAEKAIAIgQhBiAEIQUgBA0ACwsgBQ0BIAItAAkNAgJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahDSBRoLIAJBDGohBEEUEB8iByABNgIIIAcgADYCBAJAIABB2wAQygYiBkUNAEECIQMCQAJAIAZBAWoiAUHH2QAQjAYNAEEBIQMgASEFIAFBwtkAEIwGRQ0BCyAHIAM6AA0gBkEFaiEFCyAFIQYgBy0ADUUNACAHIAYQgQY6AA4LIAQoAgAiBkUNAyAAIAYoAgQQzAZBAEgNAyAGIQYDQAJAIAYiAygCACIEDQAgBCEFIAMhAwwGCyAEIQYgBCEFIAMhAyAAIAQoAgQQzAZBf0oNAAwFCwALQcPIAEGhAkGpxAAQ+wUAC0HDyABBpAJBqcQAEPsFAAtBqD9Bw8gAQY8CQdYOEIAGAAsgBiEFIAQhAwsgByAFNgIAIAMgBzYCACACQQE6AAggBwvVAgEEfyMAQRBrIgAkAAJAAkACQEEAKALUhwIiAS0ACQ0AAkAgASgCoAJFDQAgAUEANgKgAiABQRhqENIFGgsgAS0ACQ0BIAFBAToACQJAIAEoAgwiAkUNACACIQIDQAJAIAIiAigCECIDRQ0AIAMgAy0ABUH+AXE6AAUgACACKAIENgIAQcwaIAAQOyACQQA2AhAgAUEBOgAIIAIQmwULIAIoAgAiAyECIAMNAAsLIAEtAAlFDQIgAUEAOgAJAkAgASgCDCICRQ0AIAIhAgNAAkAgAiICKAIQIgNFDQAgAyADLQAFQf4BcToABQsgASACKAIANgIMIAJBADYCBCACECAgASgCDCIDIQIgAw0ACwsgAUEBOgAIIABBEGokAA8LQag/QcPIAEGPAkHWDhCABgALQag/QcPIAEHsAkHGKRCABgALQak/QcPIAEHvAkHGKRCABgALDABBACgC1IcCEJAFC9ABAQJ/IwBBwABrIgMkAAJAAkACQAJAAkAgAEF/ag4gAAECBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAMECyADIAFBFGo2AhBBsBwgA0EQahA7DAMLIAMgAUEUajYCIEGbHCADQSBqEDsMAgsgAyABQRRqNgIwQYEbIANBMGoQOwwBCyABLQAEIQAgAi8BBCEEIAMgAi0ABzYCDCADIAQ2AgggAyAANgIEIAMgAUEAIABrQQxsakFwajYCAEHq0AAgAxA7CyADQcAAaiQACzEBAn9BDBAfIQJBACgC2IcCIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgLYhwILlQEBAn8CQAJAQQAtANyHAkUNAEEAQQA6ANyHAiAAIAEgAhCYBQJAQQAoAtiHAiIDRQ0AIAMhAwNAIAMiAygCCCAAIAEgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtANyHAg0BQQBBAToA3IcCDwtBkNsAQdvKAEHjAEHxEBCABgALQYXdAEHbygBB6QBB8RAQgAYAC5wBAQN/AkACQEEALQDchwINAEEAQQE6ANyHAiAAKAIQIQFBAEEAOgDchwICQEEAKALYhwIiAkUNACACIQIDQCACIgIoAghBwAAgASAAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0A3IcCDQFBAEEAOgDchwIPC0GF3QBB28oAQe0AQdA/EIAGAAtBhd0AQdvKAEHpAEHxEBCABgALMAEDf0HghwIhAQNAAkAgASgCACICDQBBAA8LIAIhASACIQMgAikDCCAAUg0ACyADC1kBBH8CQCAALQAQIgINAEEADwsgAEEkaiEDQQAhBANAAkAgAyAEIgRBDGxqKAIAIAFHDQAgACAEQQxsakEkakEAIAAbDwsgBEEBaiIFIQQgBSACRw0AC0EAC2ICAn8BfiADQRBqEB8iBEEBOgADIABBACAALQAEIgVrQQxsakFkaikDACEGIAQgATsBDiAEIAU6AA0gBCAGNwIEIAQgAzoADCAEQRBqIAIgAxCeBhogBBDcBSEDIAQQICADC94CAQJ/AkACQAJAQQAtANyHAg0AQQBBAToA3IcCAkBB5IcCQeCnEhD9BUUNAAJAQQAoAuCHAiIARQ0AIAAhAANAQQAoArD7ASAAIgAoAhxrQQBIDQFBACAAKAIANgLghwIgABCgBUEAKALghwIiASEAIAENAAsLQQAoAuCHAiIARQ0AIAAhAANAIAAiASgCACIARQ0BAkBBACgCsPsBIAAoAhxrQQBIDQAgASAAKAIANgIAIAAQoAULIAEoAgAiASEAIAENAAsLQQAtANyHAkUNAUEAQQA6ANyHAgJAQQAoAtiHAiIARQ0AIAAhAANAIAAiACgCCEEwQQBBACAAKAIEEQUAIAAoAgAiASEAIAENAAsLQQAtANyHAg0CQQBBADoA3IcCDwtBhd0AQdvKAEGUAkGXFhCABgALQZDbAEHbygBB4wBB8RAQgAYAC0GF3QBB28oAQekAQfEQEIAGAAufAgEDfyMAQRBrIgEkAAJAAkACQEEALQDchwJFDQBBAEEAOgDchwIgABCTBUEALQDchwINASABIABBFGo2AgBBAEEAOgDchwJBmxwgARA7AkBBACgC2IcCIgJFDQAgAiECA0AgAiICKAIIQQIgAEEAIAIoAgQRBQAgAigCACIDIQIgAw0ACwtBAC0A3IcCDQJBAEEBOgDchwICQCAAKAIEIgJFDQAgAiECA0AgACACIgIoAgAiAzYCBAJAIAItAAdBBUkNACACKAIMECALIAIQICADIQIgAw0ACwsgABAgIAFBEGokAA8LQZDbAEHbygBBsAFB2DgQgAYAC0GF3QBB28oAQbIBQdg4EIAGAAtBhd0AQdvKAEHpAEHxEBCABgALnw4CCn8BfiMAQRBrIgEkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBAC0A3IcCDQBBAEEBOgDchwICQCAALQADIgJBBHFFDQBBAEEAOgDchwICQEEAKALYhwIiA0UNACADIQMDQCADIgMoAghBEkEAIAAgAygCBBEFACADKAIAIgQhAyAEDQALC0EALQDchwJFDQhBhd0AQdvKAEHpAEHxEBCABgALIAApAgQhC0HghwIhBAJAA0ACQCAEKAIAIgMNAEEAIQUMAgsgAyEEIAMhBSADKQMIIAtSDQALC0EAIQQCQCAFIgNFDQAgAyAALQANQT9xIgRBDGxqQSRqQQAgBCADLQAQSRshBAsgBCEFAkAgAkEBcUUNAEEQIQQgBSECIAMhAwwHCyAALQANDQQgAC8BDg0EIAMhBAJAIAMNACAAEKIFIQQLAkAgBCIDLwESIgUgAC8BECIERg0AAkAgBUEPcSAEQQ9xTQ0AQQMgAyAAEJoFQQAoAuCHAiIEIANGDQMgBCEEA0AgBCIFRQ0FIAUoAgAiAiEEIAIgA0cNAAsgBSADKAIANgIADAQLIAMgBDsBEgsgAyEDDAMLQYXdAEHbygBBvgJBzhMQgAYAC0EAIAMoAgA2AuCHAgsgAxCgBSAAEKIFIQMLIAMiA0EAKAKw+wFBgIn6AGo2AhwgA0EkaiEEIAMhAwwBCyAFIQQgAyEDCyADIQYCQAJAIAQiBQ0AQRAhBEEAIQIMAQsCQAJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgRBf2ogBi0AESIDIANB/wFGG0EBaiIDa0H/AHEiAkUNAAJAIAMgBGtB/ABxQTxPDQBBEyEDDAMLQRMhAyACQQVJDQILIAYgBDoAEQtBECEDCyADIQcCQAJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiA0GA4ANxQYAgRw0CAkACQCAFQQAgBS0ABCIJa0EMbGpBYGooAgAiBEUNACADQf8fcSECIAQhAwNAAkAgAiADIgMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhAwwDCyADKAIAIgQhAyAEDQALC0EAIQMLIAMiAkUNAiACLAAGIgNBAEgNAiACIANBgAFyOgAGQQAtANyHAkUNBkEAQQA6ANyHAgJAQQAoAtiHAiIDRQ0AIAMhAwNAIAMiAygCCEEhIAUgAiADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtANyHAkUNAUGF3QBB28oAQekAQfEQEIAGAAsgAC8BDiIDQYDgA3FBgCBHDQECQAJAIAVBACAFLQAEIglrQQxsakFgaigCACIERQ0AIANB/x9xIQIgBCEDA0ACQCACIAMiAy8BBEcNACADLQAGQT9xIAlHDQAgAyEDDAMLIAMoAgAiBCEDIAQNAAsLQQAhAwsgAyICRQ0BAkACQCACLQAHIgMgCEcNACADIQQgAkEMaiEJIABBEGohCgJAAkAgA0EFTw0AIAkhCQwBCyAJKAIAIQkLIAogCSAEELgGDQBBASEEDAELQQAhBAsgBCEEAkAgCEEFSQ0AIAMgCEYNAAJAIANBBUkNACACKAIMECALIAIgAC0ADBAfNgIMCyACIAAtAAwiAzoAByACQQxqIQkCQAJAIANBBU8NACAJIQkMAQsgCSgCACEJCyAJIABBEGogAxCeBhogBA0BQQAtANyHAkUNBkEAQQA6ANyHAiAFLQAEIQMgAi8BBCEEIAEgAi0ABzYCDCABIAQ2AgggASADNgIEIAEgBUEAIANrQQxsakFwajYCAEHq0AAgARA7AkBBACgC2IcCIgNFDQAgAyEDA0AgAyIDKAIIQSAgBSACIAMoAgQRBQAgAygCACIEIQMgBA0ACwtBAC0A3IcCDQcLQQBBAToA3IcCCyAHIQQgBSECCyAGIQMLIAMhBiAEIQVBAC0A3IcCIQMCQCACIgJFDQAgA0EBcUUNBUEAQQA6ANyHAiAFIAIgABCYBQJAQQAoAtiHAiIDRQ0AIAMhAwNAIAMiAygCCCAFIAIgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtANyHAkUNAUGF3QBB28oAQekAQfEQEIAGAAsgA0EBcUUNBUEAQQA6ANyHAgJAQQAoAtiHAiIDRQ0AIAMhAwNAIAMiAygCCEERIAYgACADKAIEEQUAIAMoAgAiBCEDIAQNAAsLQQAtANyHAg0GC0EAQQA6ANyHAiABQRBqJAAPC0GQ2wBB28oAQeMAQfEQEIAGAAtBkNsAQdvKAEHjAEHxEBCABgALQYXdAEHbygBB6QBB8RAQgAYAC0GQ2wBB28oAQeMAQfEQEIAGAAtBkNsAQdvKAEHjAEHxEBCABgALQYXdAEHbygBB6QBB8RAQgAYAC5MEAgh/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQHyIEIAM6ABAgBCAAKQIEIgk3AwhBACgCsPsBIQUgBEH/AToAESAEIAVBgIn6AGo2AhwgBEEUaiIGIAkQhgYgBCAAKAIQOwESAkAgAkEESQ0AIABBEGohByADQQEgA0EBSxshCEEAIQMDQAJAAkAgAyIDDQBBACECDAELIAcgA0ECdGooAgAhAgsgBCADQQxsaiIFQShqIAM6AAAgBUEkaiACNgIAIANBAWoiAiEDIAIgCEcNAAsLAkACQEEAKALghwIiA0UNACAEQQhqIgIpAwAQ8wVRDQAgAiADQQhqQQgQuAZBAEgNAEHghwIhBQNAIAUoAgAiA0UNAgJAIAMoAgAiCEUNACACKQMAEPMFUQ0AIAMhBSACIAhBCGpBCBC4BkF/Sg0BCwsgBCADKAIANgIAIAMgBDYCAAwBCyAEQQAoAuCHAjYCAEEAIAQ2AuCHAgsCQAJAQQAtANyHAkUNACABIAY2AgBBAEEAOgDchwJBsBwgARA7AkBBACgC2IcCIgNFDQAgAyEDA0AgAyIDKAIIQQEgBCAAIAMoAgQRBQAgAygCACICIQMgAg0ACwtBAC0A3IcCDQFBAEEBOgDchwIgAUEQaiQAIAQPC0GQ2wBB28oAQeMAQfEQEIAGAAtBhd0AQdvKAEHpAEHxEBCABgALAgALmQIBBX8jAEEgayICJAACQAJAIAEvAQ4iA0GAf2oiBEEESw0AQQEgBHRBE3FFDQAgAkEBciABQRBqIgUgAS0ADCIEQQ8gBEEPSRsiBhCeBiEAIAJBOjoAACAGIAJyQQFqQQA6AAAgABDNBiIGQQ5KDQECQAJAAkAgA0GAf2oOBQACBAQBBAsgBkEBaiEEIAIgBCAEIAJBAEEAELgFIgNBACADQQBKGyIDaiIFEB8gACAGEJ4GIgBqIAMQuAUaIAEtAA0gAS8BDiAAIAUQlwYaIAAQIAwDCyACQQBBABC7BRoMAgsgAiAFIAZqQQFqIAZBf3MgBGoiAUEAIAFBAEobELsFGgwBCyAAIAFBsJkBEN0FGgsgAkEgaiQACwoAQbiZARDjBRoLBQAQNAALAgALuQEBAn8jAEEQayICJAACQAJAAkACQAJAAkACQCABLwEOIgNBgF1qDgcBAwUFAwIEAAsCQAJAAkACQCADQf9+ag4HAQIICAgIAwALIAMNBxDnBQwIC0H8ABAcDAcLEDQACyABKAIQEKYFDAULIAEQ7AUQ2gUaDAQLIAEQ7gUQ2gUaDAMLIAEQ7QUQ2QUaDAILIAIQNTcDCEEAIAEvAQ4gAkEIakEIEJcGGgwBCyABENsFGgsgAkEQaiQACwoAQciZARDjBRoLJwEBfxCrBUEAQQA2AuiHAgJAIAAQrAUiAQ0AQQAgADYC6IcCCyABC5cBAQJ/IwBBIGsiACQAAkACQEEALQCAiAINAEEAQQE6AICIAhAhDQECQEHw7gAQrAUiAQ0AQQBB8O4ANgLshwIgAEHw7gAvAQw2AgAgAEHw7gAoAgg2AgRB3BcgABA7DAELIAAgATYCFCAAQfDuADYCEEHkwQAgAEEQahA7CyAAQSBqJAAPC0Hd6wBBp8sAQSFB2hIQgAYAC6sFAQp/AkAgAA0AQdAPDwtB0Q8hAQJAIABBA3ENAEHSDyEBIAAoAgBBxIaZugRHDQBB0w8hASAAKAIEQYq20tV8Rw0AQdQPIQEgACgCCCICQf//B0sNAEHeDyEBIAAvAQwiA0EYbEHwAGoiBCACSw0AQd8PIQEgAEHYAGoiBSADQRhsaiIGLwEQQf//A0cNAEHgDyEBIAYvARJB//8DRw0AQQAhBkEAIQEDQCAIIQcgBiEIAkACQCAAIAEiAUEBdGpBGGovAQAiBiADTQ0AQQAhBkHhDyEJDAELAkAgASAFIAZBGGxqIgovARBBC3ZNDQBBACEGQeIPIQkMAQsCQCAGRQ0AQQAhBkHjDyEJIAEgCkF4ai8BAEELdk0NAQtBASEGIAchCQsgCSEHIAghCQJAIAZFDQAgAUEeSyIJIQYgByEIIAFBAWoiCiEBIAkhCSAKQSBHDQELCwJAIAlBAXENACAHDwsCQCADDQBBAA8LIAchCUEAIQYDQCAJIQgCQAJAIAUgBiIGQRhsaiIBEM0GIglBD00NAEEAIQFB1g8hCQwBCyABIAkQ8gUhCQJAIAEvARAiByAJIAlBEHZzQf//A3FGDQBBACEBQdcPIQkMAQsCQCAGRQ0AIAFBeGovAQAgB00NAEEAIQFB2A8hCQwBCwJAAkAgAS8BEiIHQQJxDQBBACEBQdkPIQkgB0EESQ0BDAILAkAgASgCFCIBIARPDQBBACEBQdoPIQkMAgsCQCABIAJJDQBBACEBQdsPIQkMAgsCQCABIAdBAnZqIgcgAkkNAEEAIQFB3A8hCQwCC0EAIQFB3Q8hCSAAIAdqLQAADQELQQEhASAIIQkLIAkhCQJAIAFFDQAgCSEJIAZBAWoiCCEGQQAhASAIIANGDQIMAQsLIAkhAQsgAQv8AQEKfxCrBUEAIQECQANAIAEhAiAEIQNBACEEAkAgAEUNAEEAIQQgAkECdEHohwJqKAIAIgFFDQBBACEEIAAQzQYiBUEPSw0AQQAhBCABIAAgBRDyBSIGQRB2IAZzIgdBCnZBPnFqQRhqLwEAIgYgAS8BDCIITw0AIAFB2ABqIQkgBiEEAkADQCAJIAQiCkEYbGoiAS8BECIEIAdB//8DcSIGSw0BAkAgBCAGRw0AIAEhBCABIAAgBRC4BkUNAwsgCkEBaiIBIQQgASAIRw0ACwtBACEECyAEIgQgAyAEGyEBIAQNASABIQQgAkEBaiEBIAJFDQALQQAPCyABC6UCAQh/EKsFIAAQzQYhAkEAIQMgASEBAkADQCABIQQgBiEFAkACQCADIgdBAnRB6IcCaigCACIBRQ0AQQAhBgJAIARFDQAgBCABa0Gof2pBGG0iBkF/IAYgAS8BDEkbIgZBAEgNASAGQQFqIQYLQQAhCCAGIgMhBgJAIAMgAS8BDCIJSA0AIAghBkEAIQEgBSEDDAILAkADQCAAIAEgBiIGQRhsakHYAGoiAyACELgGRQ0BIAZBAWoiAyEGIAMgCUcNAAtBACEGQQAhASAFIQMMAgsgBCEGQQEhASADIQMMAQsgBCEGQQQhASAFIQMLIAYhCSADIgYhAwJAIAEOBQACAgIAAgsgBiEGIAdBAWoiBCEDIAkhASAEQQJHDQALQQAhAwsgAwtRAQJ/AkACQCAAEK0FIgANAEH/ASECDAELIAAvARJBA3EhAgsgASEDAkACQAJAIAIOAgABAgsgASAAKAIUIgAgAEEASBsPCyAAKAIUIQMLIAMLvwEBAn8gACEBAkAgAEEAELEFIgBFDQACQEG94gBB8IcCRg0AQQBBAC0AwWI6APSHAkEAQQAoAL1iNgLwhwILQQAhASAAEM0GIgJBBWpBD0sNACACQfWHAiAAIAIQngZqQQA6AABB8IcCIQELAkACQCABEK0FIgENAEH/ASECDAELIAEvARJBA3EhAgtBfyEAAkACQAJAIAIOAgABAgsgASgCFCIAQX8gAEF/ShshAAwBCyABKAIUIQALIABB/wFxC8oCAQp/EKsFQQAhAgJAAkADQCACIgNBAnRB6IcCaiEEQQAhAgJAIABFDQBBACECIAQoAgAiBUUNAEEAIQIgABDNBiIGQQ9LDQBBACECIAUgACAGEPIFIgdBEHYgB3MiCEEKdkE+cWpBGGovAQAiByAFLwEMIglPDQAgBUHYAGohCiAHIQICQANAIAogAiILQRhsaiIFLwEQIgIgCEH//wNxIgdLDQECQCACIAdHDQAgBSECIAUgACAGELgGRQ0DCyALQQFqIgUhAiAFIAlHDQALC0EAIQILIAIiAg0BIANBAWohAiADRQ0AC0EAIQJBACEFDAELIAIhAiAEKAIAIQULIAUhBQJAIAIiAkUNACACLQASQQJxRQ0AAkAgAUUNACABIAIvARJBAnY2AgALIAUgAigCFGoPCwJAIAENAEEADwsgAUEANgIAQQALzwEBAn8CQAJAAkAgAA0AQQAhAAwBC0EAIQMgABDNBiIEQQ5LDQECQCAAQfCHAkYNAEHwhwIgACAEEJ4GGgsgBCEACyAAIQACQAJAIAFB//8DRw0AIAAhAAwBC0EAIQMgAUHkAEsNASAAQfCHAmogAUGAAXM6AAAgAEEBaiEACyAAIQACQAJAIAINACAAIQAMAQtBACEDIAIQzQYiASAAaiIEQQ9LDQEgAEHwhwJqIAIgARCeBhogBCEACyAAQfCHAmpBADoAAEHwhwIhAwsgAwtRAQJ/AkACQCAAEK0FIgANAEH/ASECDAELIAAvARJBA3EhAgsgASEDAkACQAJAIAIOAgEAAgsgASAAKAIUIgAgAEEASBsPCyAAKAIUIQMLIAMLowIBA38jAEGwAmsiAiQAIAJBqwIgACABEIQGGgJAAkAgAhDNBiIBDQAgASEADAELIAEhAANAIAAiASEAAkAgAiABQX9qIgFqLQAAQXZqDgQAAgIAAgsgASEAIAENAAtBACEACyACIAAiAWpBCjoAABAiIAFBAWohAyACIQQCQAJAQYAIQQAoAoSIAmsiACABQQJqSQ0AIAMhAyAEIQAMAQtBhIgCQQAoAoSIAmpBBGogAiAAEJ4GGkEAQQA2AoSIAkEBIAMgAGsiASABQYF4akH/d0kbIQMgAiAAaiEAC0GEiAJBBGoiAUEAKAKEiAJqIAAgAyIAEJ4GGkEAQQAoAoSIAiAAajYChIgCIAFBACgChIgCakEAOgAAECMgAkGwAmokAAs5AQJ/ECICQAJAQQAoAoSIAkEBaiIAQf8HSw0AIAAhAUGEiAIgAGpBBGotAAANAQtBACEBCxAjIAELdgEDfxAiAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQYAIQQAoAoSIAiIEIAQgAigCACIFSRsiBCAFRg0AIABBhIgCIAVqQQRqIAQgBWsiBSABIAUgAUkbIgUQngYaIAIgAigCACAFajYCACAFIQMLECMgAwv4AQEHfxAiAkAgAigCAEGACEkNACACQQA2AgALQQAhAwJAQQAoAoSIAiIEIAIoAgAiBUYNACAAIAFqQX9qIQYgACEBIAUhAwJAA0AgAyEDAkAgASIBIAZJDQAgASEFIAMhBwwCCyABIQUgA0EBaiIIIQdBAyEJAkACQEGEiAIgA2pBBGotAAAiAw4LAQAAAAAAAAAAAAEACyABIAM6AAAgAUEBaiEFQQAgCCAIQYAIRhsiAyEHQQNBACADIARGGyEJCyAFIgUhASAHIgchAyAFIQUgByEHIAlFDQALCyACIAc2AgAgBSIDQQA6AAAgAyAAayEDCxAjIAMLiAEBAX8jAEEQayIDJAACQAJAAkAgAEUNACAAEM0GQQ9LDQAgAC0AAEEqRw0BCyADIAA2AgBBqewAIAMQO0F/IQAMAQsCQCAAELkFIgANAEF+IQAMAQsCQCAAKAIUIAJLDQAgAUEAKAKIkAIgACgCEGogAhCeBhoLIAAoAhQhAAsgA0EQaiQAIAALugUBBn8jAEEgayIBJAACQAJAQQAoApiQAg0AQQBBAUEAKAKU+wEiAkEQdiIDQfABIANB8AFJGyACQYCABEkbOgCMkAJBABAWIgI2AoiQAiACQQAtAIyQAiIEQQx0aiEDQQAhBQJAIAIoAgBBxqbRkgVHDQBBACEFIAIoAgRBitSz3wZHDQBBACEFIAIoAgxBgCBHDQBBACEFQQAoApT7AUEMdiACLwEQRw0AIAIvARIgBEYhBQsgBSEFQQAhBgJAIAMoAgBBxqbRkgVHDQBBACEGIAMoAgRBitSz3wZHDQBBACEGIAMoAgxBgCBHDQBBACEGQQAoApT7AUEMdiADLwEQRw0AIAMvARIgBEYhBgsgA0EAIAYiBhshAwJAAkACQCAGIAVxQQFHDQAgAkEAIAUbIgIgAyACKAIIIAMoAghLGyECDAELIAUgBnJBAUcNASACIAMgBRshAgtBACACNgKYkAILAkBBACgCmJACRQ0AELoFCwJAQQAoApiQAg0AQfQLQQAQO0EAQQAoAoiQAiIFNgKYkAICQEEALQCMkAIiBkUNAEEAIQIDQCAFIAIiAkEMdGoQGCACQQFqIgMhAiADIAZHDQALCyABQoGAgICAgAQ3AxAgAULGptGSpcG69usANwMIIAFBADYCHCABQQAtAIyQAjsBGiABQQAoApT7AUEMdjsBGEEAKAKYkAIgAUEIakEYEBcQGRC6BUEAKAKYkAJFDQILIAFBACgCkJACQQAoApSQAmtBUGoiAkEAIAJBAEobNgIAQe04IAEQOwsCQAJAQQAoApSQAiICQQAoApiQAkEYaiIFSQ0AIAIhAgNAAkAgAiICIAAQzAYNACACIQIMAwsgAkFoaiIDIQIgAyAFTw0ACwtBACECCyABQSBqJAAgAg8LQajWAEGRyABB6gFBvxIQgAYAC80DAQh/IwBBIGsiACQAQQAoApiQAiIBQQAtAIyQAiICQQx0akEAKAKIkAIiA2shBCABQRhqIgUhAQJAAkACQANAIAQhBCABIgYoAhAiAUF/Rg0BIAEgBCABIARJGyIHIQQgBkEYaiIGIQEgBiADIAdqTQ0AC0HzESEEDAELQQAgAyAEaiIHNgKQkAJBACAGQWhqNgKUkAIgBiEBAkADQCABIgQgB08NASAEQQFqIQEgBC0AAEH/AUYNAAtBpjAhBAwBCwJAQQAoApT7AUEMdiACQQF0a0GBAU8NAEEAQgA3A6iQAkEAQgA3A6CQAiAFQQAoApSQAiIESw0CIAQhBCAFIQEDQCAEIQYCQCABIgMtAABBKkcNACAAQQhqQRBqIANBEGopAgA3AwAgAEEIakEIaiADQQhqKQIANwMAIAAgAykCADcDCCADIQECQANAIAFBGGoiBCAGSyIHDQEgBCEBIAQgAEEIahDMBg0ACyAHRQ0BCyADQQEQvwULQQAoApSQAiIGIQQgA0EYaiIHIQEgByAGTQ0ADAMLAAtB1NQAQZHIAEGpAUGxNxCABgALIAAgBDYCAEGCHCAAEDtBAEEANgKYkAILIABBIGokAAv0AwEEfyMAQcAAayIDJAACQAJAAkACQCAARQ0AIAAQzQZBD0sNACAALQAAQSpHDQELIAMgADYCAEGp7AAgAxA7QX8hBAwBCwJAQQAtAIyQAkEMdEG4fmogAk8NACADIAI2AhBB9Q0gA0EQahA7QX4hBAwBCwJAIAAQuQUiBUUNACAFKAIUIAJHDQBBACEEQQAoAoiQAiAFKAIQaiABIAIQuAZFDQELAkBBACgCkJACQQAoApSQAmtBUGoiBEEAIARBAEobIAJBB2pBeHFBCCACGyIEQRhqIgVPDQAQvAVBACgCkJACQQAoApSQAmtBUGoiBkEAIAZBAEobIAVPDQAgAyACNgIgQbkNIANBIGoQO0F9IQQMAQtBAEEAKAKQkAIgBGsiBTYCkJACAkACQCABQQAgAhsiBEEDcUUNACAEIAIQigYhBEEAKAKQkAIgBCACEBcgBBAgDAELIAUgBCACEBcLIANBMGpCADcDACADQgA3AyggAyACNgI8IANBACgCkJACQQAoAoiQAms2AjggA0EoaiAAIAAQzQYQngYaQQBBACgClJACQRhqIgA2ApSQAiAAIANBKGpBGBAXEBlBACgClJACQRhqQQAoApCQAksNAUEAIQQLIANBwABqJAAgBA8LQbAPQZHIAEHOAkGhJxCABgALjgUCDX8BfiMAQSBrIgAkAEGsxQBBABA7QQAoAoiQAiIBQQAtAIyQAiICQQx0QQAgAUEAKAKYkAJGG2ohAwJAIAJFDQBBACEBA0AgAyABIgFBDHRqEBggAUEBaiIEIQEgBCACRw0ACwsCQEEAKAKYkAJBGGoiBEEAKAKUkAIiAUsNACABIQEgBCEEIANBAC0AjJACQQx0aiECIANBGGohBQNAIAUhBiACIQcgASECIABBCGpBEGoiCCAEIglBEGoiCikCADcDACAAQQhqQQhqIgsgCUEIaiIMKQIANwMAIAAgCSkCADcDCCAJIQQCQAJAA0AgBEEYaiIBIAJLIgUNASABIQQgASAAQQhqEMwGDQALIAUNACAGIQUgByECDAELIAggCikCADcDACALIAwpAgA3AwAgACAJKQIAIg03AwgCQAJAIA2nQf8BcUEqRw0AIAchAQwBCyAHIAAoAhwiAUEHakF4cUEIIAEbayIEQQAoAoiQAiAAKAIYaiABEBcgACAEQQAoAoiQAms2AhggBCEBCyAGIABBCGpBGBAXIAZBGGohBSABIQILQQAoApSQAiIGIQEgCUEYaiIJIQQgAiECIAUhBSAJIAZNDQALC0EAKAKYkAIoAgghAUEAIAM2ApiQAiAAQYAgNgIUIAAgAUEBaiIBNgIQIABCxqbRkqXBuvbrADcDCCAAQQAoApT7AUEMdjsBGCAAQQA2AhwgAEEALQCMkAI7ARogAyAAQQhqQRgQFxAZELoFAkBBACgCmJACDQBBqNYAQZHIAEGLAkH5xAAQgAYACyAAIAE2AgQgAEEAKAKQkAJBACgClJACa0FQaiIBQQAgAUEAShs2AgBBkiggABA7IABBIGokAAuAAQEBfyMAQRBrIgIkAAJAAkACQCAARQ0AIAAtAABBKkcNACAAEM0GQRBJDQELIAIgADYCAEGK7AAgAhA7QQAhAAwBCwJAIAAQuQUiAA0AQQAhAAwBCwJAIAFFDQAgASAAKAIUNgIAC0EAKAKIkAIgACgCEGohAAsgAkEQaiQAIAAL9QYBDH8jAEEwayICJAACQAJAAkACQAJAAkAgAEUNACAALQAAQSpHDQAgABDNBkEQSQ0BCyACIAA2AgBBiuwAIAIQO0EAIQMMAQsCQCAAELkFIgRFDQAgBEEAEL8FCyACQSBqQgA3AwAgAkIANwMYQQAoApT7AUEMdiIDQQAtAIyQAkEBdCIFayEGIAMgAUH/H2pBDHZBASABGyIHIAVqayEIIAdBf2ohCUEAIQoCQANAIAMhCwJAIAoiDCAISQ0AQQAhDQwCCwJAAkAgBw0AIAshAyAMIQpBASEMDAELIAYgDE0NBEEAIAYgDGsiAyADIAZLGyENQQAhAwNAAkAgAyIDIAxqIgpBA3ZB/P///wFxQaCQAmooAgAgCnZBAXFFDQAgCyEDIApBAWohCkEBIQwMAgsCQCADIAlGDQAgA0EBaiIKIQMgCiANRg0GDAELCyAMIAVqQQx0IQMgDCEKQQAhDAsgAyINIQMgCiEKIA0hDSAMDQALCyACIAE2AiwgAiANIgM2AigCQAJAIAMNACACIAE2AhBBnQ0gAkEQahA7AkAgBA0AQQAhAwwCCyAEQQEQvwVBACEDDAELIAJBGGogACAAEM0GEJ4GGgJAQQAoApCQAkEAKAKUkAJrQVBqIgNBACADQQBKG0EXSw0AELwFQQAoApCQAkEAKAKUkAJrQVBqIgNBACADQQBKG0EXSw0AQcAgQQAQO0EAIQMMAQtBAEEAKAKUkAJBGGo2ApSQAgJAIAdFDQBBACgCiJACIAIoAihqIQxBACEDA0AgDCADIgNBDHRqEBggA0EBaiIKIQMgCiAHRw0ACwtBACgClJACIAJBGGpBGBAXEBkgAi0AGEEqRw0DIAIoAighCwJAIAIoAiwiA0H/H2pBDHZBASADGyIJRQ0AIAtBDHZBAC0AjJACQQF0IgNrIQZBACgClPsBQQx2IANrIQdBACEDA0AgByADIgogBmoiA00NBgJAIANBA3ZB/P///wFxQaCQAmoiDCgCACINQQEgA3QiA3ENACAMIA0gA3M2AgALIApBAWoiCiEDIAogCUcNAAsLQQAoAoiQAiALaiEDCyADIQMLIAJBMGokACADDwtBsOsAQZHIAEHgAEG9PRCABgALQfbnAEGRyABB9gBBwTcQgAYAC0Gw6wBBkcgAQeAAQb09EIAGAAvUAQEGfwJAAkAgAC0AAEEqRw0AAkAgACgCFCICQf8fakEMdkEBIAIbIgNFDQAgACgCEEEMdkEALQCMkAJBAXQiAGshBEEAKAKU+wFBDHYgAGshBUEAIQADQCAFIAAiAiAEaiIATQ0DAkAgAEEDdkH8////AXFBoJACaiIGKAIAIgdBASAAdCIAcUEARyABRg0AIAYgByAAczYCAAsgAkEBaiICIQAgAiADRw0ACwsPC0H25wBBkcgAQfYAQcE3EIAGAAtBsOsAQZHIAEHgAEG9PRCABgALDAAgACABIAIQF0EACwYAEBlBAAsaAAJAQQAoArCQAiAATQ0AQQAgADYCsJACCwuXAgEDfwJAECENAAJAAkACQEEAKAK0kAIiAyAARw0AQbSQAiEDDAELIAMhAwNAIAMiBEUNAiAEKAIIIgUhAyAFIABHDQALIARBCGohAwsgAyAAKAIINgIACyAAIAI2AgQgACABNgIAIABBADsBDANAEPQFIgFB/wNxIgJFDQBBACgCtJACIgNFIQUCQAJAIAMNACAFIQUMAQsgAyEEIAUhBSACIAMvAQxBB3ZGDQADQCAEKAIIIgNFIQUCQCADDQAgBSEFDAILIAMhBCAFIQUgAiADLwEMQQd2Rw0ACwsgBUUNAAsgACABQQd0OwEMIABBACgCtJACNgIIQQAgADYCtJACIAFB/wNxDwtB8swAQSdB+CcQ+wUAC4gCAQR/AkAgAC0ADUE+Rw0AIAAtAANBAXFFDQAgACkCBBDzBVINAEEAKAK0kAIiAUUNACAALwEOIQIgASEBA0ACQCABIgEvAQwiAyACcyIEQf//A3FB/wBLDQAgBEEfcQ0CIAEgA0EBakEfcSADQeD/A3FyOwEMIAEgACABQQRqIAEgAkHAAHEbKAIAEQIAIAJBIHFFDQIgAUEAIAEoAgQRAgACQAJAAkBBACgCtJACIgAgAUcNAEG0kAIhAAwBCyAAIQADQCAAIgRFDQIgBCgCCCICIQAgAiABRw0ACyAEQQhqIQALIAAgASgCCDYCAAsgAUEAOwEMDwsgASgCCCIEIQEgBA0ACwsLWQEDfwJAAkACQEEAKAK0kAIiASAARw0AQbSQAiEBDAELIAEhAQNAIAEiAkUNAiACKAIIIgMhASADIABHDQALIAJBCGohAQsgASAAKAIINgIACyAAQQA7AQwLNwEBfwJAIABBDnFBCEcNAEEADwtBACEBAkAgAEEMcUEMRg0AIABBBHZBCCAAQQNxdE0hAQsgAQuTBAIBfwF+IAFBD3EhAwJAAkAgAUEQTw0AIAIhAgwBCyABQRB0QYCAwP8DakGAgMD/B3GtQiCGvyACoiECCyACIQICQAJAAkACQAJAAkAgA0F+ag4KAAEFBQUCBQUDBAULQQAhAQJAIAJEAAAAAAAAAABjDQBBfyEBIAJEAADg////70FkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8EFjIAJEAAAAAAAAAABmcUUNACACqyEBDAELQQAhAQsgASEBCyAAIAE2AAAPC0IAIQQCQCACRAAAAAAAAAAAYw0AIAJEAAAAAAAA8ENkDQACQAJAIAJEAAAAAAAA4D+gIgJEAAAAAAAA8ENjIAJEAAAAAAAAAABmcUUNACACsSEEDAELQgAhBAsgBCEECyAAIAQ3AAAPCwJARAAAAAAAAOBDIAJEAAAAAAAA4D+gIAJEAAAAAAAA4ENkIAJEAAAAAAAA4ENjchsiAplEAAAAAAAA4ENjRQ0AIAAgArA3AAAPCyAAQoCAgICAgICAgH83AAAPCyAAIAK2OAAADwsgACACOQAADwtBgICAgHghAQJAIAJEAAAAAAAA4MFjDQBB/////wchASACRAAAwP///99BZA0AAkACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgAqohAQwBC0GAgICAeCEBCyABIQELIAAgAyABEMgFC/kBAAJAIAFBCEkNACAAIAEgArcQxwUPCwJAAkACQAJAAkACQAJAAkACQCABDggIAAECAwQFBgcLIAAgAkH//wMgAkH//wNIGyIBQQAgAUEAShs7AAAPCyAAIAJBACACQQBKGzYAAA8LIAAgAkEAIAJBAEobrTcAAA8LIAAgAkH/ACACQf8ASBsiAUGAfyABQYB/Shs6AAAPCyAAIAJB//8BIAJB//8BSBsiAUGAgH4gAUGAgH5KGzsAAA8LIAAgAjYAAA8LIAAgAqw3AAAPC0HLxgBBrgFBxtoAEPsFAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALvAMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDJBbchAwsgAyEDAkACQCABQRBPDQAgAyEDDAELIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADIgNEAAAAAAAA4MFjDQFB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0HLxgBBygFB2toAEPsFAAtBgICAgHghAQsgAQugAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEMkFtyEDCyADIQMCQCABQRBPDQAgAw8LIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/ogvkAQIDfwF+AkAgAS0ADEEMTw0AQX4PC0F+IQICQAJAIAEpAhAiBVANACABLwEYIQMQIQ0BAkAgAC0ABkUNAAJAAkACQEEAKAK4kAIiASAARw0AQbiQAiEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgQhAiABIQEgBCAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQoAYaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBTcCACAAIANBB3Q7AQQgAEEAKAK4kAI2AgBBACAANgK4kAJBACECCyACDwtB18wAQStB6icQ+wUAC+QBAgN/AX4CQCABLQAMQQJPDQBBfg8LQX4hAgJAAkAgASkCBCIFUA0AIAEvARAhAxAhDQECQCAALQAGRQ0AAkACQAJAQQAoAriQAiIBIABHDQBBuJACIQEMAQsgASECA0AgAiIBRQ0CIAEoAgAiBCECIAEhASAEIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCgBhoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAFNwIAIAAgA0EHdDsBBCAAQQAoAriQAjYCAEEAIAA2AriQAkEAIQILIAIPC0HXzABBK0HqJxD7BQAL1wIBBH8CQAJAAkAgAC0ADUE/Rw0AIAAtAANBAXENABAhDQFBACgCuJACIgFFDQAgASEBA0ACQCABIgEtAAdFDQAgAC8BDiABLwEMRw0AIAFBEGopAgAgACkCBFINACABQQA6AAcgAUEMaiICEPkFAkACQCABLQAGQYB/ag4DAQIAAgtBACgCuJACIgIhAwJAAkACQCACIAFHDQBBuJACIQIMAQsDQCADIgJFDQIgAigCACIEIQMgAiECIAQgAUcNAAsLIAIgASgCADYCAAsgAUEAQYgCEKAGGgwBCyABQQE6AAYCQCABQQBBAEHgABDOBQ0AIAFBggE6AAYgAS0ABw0FIAIQ9gUgAUEBOgAHIAFBACgCsPsBNgIIDAELIAFBgAE6AAYLIAEoAgAiAiEBIAINAAsLDwtB18wAQckAQfwTEPsFAAtBr9wAQdfMAEHxAEHXLBCABgAL6gEBAn9BACEEQX8hBQJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQQAhBEF+IQUMAQtBACEEQQEhBSAALQAHDQACQCACIABBDmotAABqQQRqQe0BTw0AQQEhBEEAIQUMAQsgAEEMahD2BSAAQQE6AAcgAEEAKAKw+wE2AghBACEEQQEhBQsgBSEFAkACQCAERQ0AIABBDGpBPiAALwEEIANyIAIQ+gUiBEUNASAEIAEgAhCeBhogACAALwEEIgRBAWpBH3EgBEHg/wNxcjsBBEEAIQULIAUPC0G51gBB18wAQYwBQcAJEIAGAAvaAQEDfwJAECENAAJAQQAoAriQAiIARQ0AIAAhAANAAkAgACIALQAHIgFFDQBBACgCsPsBIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqEJUGIQFBACgCsPsBIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgEhACABDQALCw8LQdfMAEHaAEG5FhD7BQALawEBf0F/IQICQAJAAkAgAC0ABkF/ag4IAQAAAAAAAAIAC0F+DwtBASECIAAtAAcNAEEAIQIgASAAQQ5qLQAAakEEakHtAUkNACAAQQxqEPYFIABBAToAByAAQQAoArD7ATYCCEEBIQILIAILDQAgACABIAJBABDOBQuOAgEDfyAALQAGIgEhAgJAAkACQAJAAkACQAJAIAEOCQUCAwMDAwMDAQALIAFBgH9qDgMBAgMCCwJAAkACQEEAKAK4kAIiASAARw0AQbiQAiEBDAELIAEhAgNAIAIiAUUNAiABKAIAIgMhAiABIQEgAyAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQoAYaQQAPCyAAQQE6AAYCQCAAQQBBAEHgABDOBSIBDQAgAEGCAToABiAALQAHDQQgAEEMahD2BSAAQQE6AAcgAEEAKAKw+wE2AghBAQ8LIABBgAE6AAYgAQ8LQdfMAEG8AUHtMxD7BQALQQEhAgsgAg8LQa/cAEHXzABB8QBB1ywQgAYAC58CAQV/AkACQAJAAkAgAS0AAkUNABAiIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCEGIAQgAC8BBE0NAiACIAVJDQFBACEEQX8hAwwDCyAEIQYgBCAFSQ0BQQAhBEF+IQMMAgsgACADOwEGIAIhBgsgACAGOwECQQEhBEEAIQMLIAMhAwJAIARFDQAgACAALwECaiACa0EIaiABIAIQngYaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECMgAw8LQbzMAEEdQb0sEPsFAAtBsTFBvMwAQTZBvSwQgAYAC0HFMUG8zABBN0G9LBCABgALQdgxQbzMAEE4Qb0sEIAGAAsxAQJ/QQAhAQJAIAAvAQAiAiAALwECRg0AIAAgAkEAIAIgAC8BBkkbakEIaiEBCyABC6YBAQN/ECJBACEBAkAgAC8BACICIAAvAQJGDQAgACACQQAgAiAALwEGSRtqQQhqIQELAkACQCABIgFFDQAgAS0AAkEPakH8A3EhAQJAIAIgAC8BBiIDSQ0AIAIgA0cNAiAAIAE7AQAgACAALwEEOwEGECMPCyAAIAIgAWo7AQAQIw8LQZzWAEG8zABBzgBB/RIQgAYAC0HnMEG8zABB0QBB/RIQgAYACyIBAX8gAEEIahAfIgEgADsBBCABIAA7AQYgAUEANgEAIAELMwEBfyMAQRBrIgIkACACIAE6AA8gAC0ADSAALwEOIAJBD2pBARCXBiEAIAJBEGokACAACzMBAX8jAEEQayICJAAgAiABOwEOIAAtAA0gAC8BDiACQQ5qQQIQlwYhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATYCDCAALQANIAAvAQ4gAkEMakEEEJcGIQAgAkEQaiQAIAALPAACQAJAIAFFDQAgAS0AAA0BCyAALQANIAAvAQ5Bz+4AQQAQlwYPCyAALQANIAAvAQ4gASABEM0GEJcGC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBCXBiECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABD2BSAAEJUGCxoAAkAgACABIAIQ3gUiAg0AIAEQ2wUaCyACC4EHARB/IwBBEGsiAyQAAkACQCABLwEOIgRBDHYiBUF/akEBTQ0AQQAhBAwBCwJAIAVBAkcNACABLQAMDQBBACEEDAELAkAgBEH/H3EiBkH/HU0NAEEAIQQMAQsCQCAFQQJHDQAgBEGAHnFBgAJHDQBBACEEDAELQQAhBCACLwEAIgdB8R9GDQBBACAGayEIIAFBEGoiCSEKIAchB0EAIgQhC0EAIQwgBCENA0AgDSENIAwhDiALIQsgECEPAkACQCAHQf//A3EiDEEMdiIEQQlGDQAgDSEHIARB4JkBai0AACEQDAELIA1BAWoiECEHIAIgEEEBdGovAQAhEAsgByERAkACQAJAAkAgECIHRQ0AAkACQCAEQXZqQX1NDQAgDiENIAshEAwBC0EAIQ0gCyAOQf8BcUEAR2pBAyAHQX9qIAdBA0sbIhBqIBBBf3NxIRALIBAhECANIQsCQCAMQf8fcSAGRyISDQAgACAQaiEPAkAgBUEBRw0AAkACQCAEQQhHDQAgAyAPLQAAIAtB/wFxdkEBcToADyABLQANIAEvAQ4gA0EPakEBEJcGGgwBCyAPIQ0gByEOAkAgDEGAwAJJDQADQCANIQQgDiIMRQ0HIARBAWohDSAMQX9qIQ4gBC0AAEUNAAsgDEUNBgsgAS0ADSABLwEOIA8gBxCXBhoLIAshCyAQIQcgCCEEDAULAkAgBEEIRw0AQQEgC0H/AXF0IQQgDy0AACEHAkAgAS0AEEUNACAPIAcgBHI6AAAMBAsgDyAHIARBf3NxOgAADAMLAkAgByABLQAMIgRLDQAgDyAKIAcQngYaDAMLIA8gCSAEEJ4GIQ0CQAJAIAxB/58BTQ0AQQAhBAwBC0EAIQQgDEGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQQLIA0gAS0ADCIMaiAEIAcgDGsQoAYaDAILAkACQCAEQQhHDQBBACALQQFqIgQgBEH/AXFBCEYiBBshCyAQIARqIQcMAQsgCyELIBAgB2ohBwsgDyEEDAMLQdzHAEHbAEG2HhD7BQALIAshCyAQIQcgBiEEDAELIAshCyAQIQdBACEECyAEIQQgByENIAshDAJAIBJFDQAgAiARQQFqIg5BAXRqLwEAIhIhByAEIRAgDSELIAwhDCAOIQ1BACEEIBJB8R9GDQIMAQsLIAQhBAsgA0EQaiQAIAQL/gIBBH8gABDgBSAAEM0FIAAQxAUgABChBQJAAkAgAC0AA0EBcQ0AIAAtAA0NASAALwEODQEgAC0ADEEESQ0BIAAtABFBCHFFDQFBAEEAKAKw+wE2AsSQAkGAAhAdQQAtAIjuARAcDwsCQCAAKQIEEPMFUg0AIAAQ4QUgAC0ADSIBQQAtAMCQAk8NAUEAKAK8kAIgAUECdGooAgAhAgJAAkACQCAALwEOQfldag4DAQIAAgsgARDiBSIDIQECQCADDQAgAhDwBSEBCwJAIAEiAQ0AIAAQ2wUaDwsgACABENoFGg8LIAIQ8QUiAUF/Rg0AIAAgAUH/AXEQ1wUaDwsgAiAAIAIoAgAoAgwRAgAPCyAALQADQQRxRQ0AQQAtAMCQAkUNACAAKAIEIQRBACEBA0ACQEEAKAK8kAIgASIBQQJ0aigCACICKAIAIgMoAgAgBEcNACAAIAE6AA0gAiAAIAMoAgwRAgALIAFBAWoiAiEBIAJBAC0AwJACSQ0ACwsLAgALAgALBABBAAtnAQF/AkBBAC0AwJACQSBJDQBB3McAQbABQd05EPsFAAsgAC8BBBAfIgEgADYCACABQQAtAMCQAiIAOgAEQQBB/wE6AMGQAkEAIABBAWo6AMCQAkEAKAK8kAIgAEECdGogATYCACABC7ECAgV/AX4jAEGAAWsiACQAQQBBADoAwJACQQAgADYCvJACQQAQNaciATYCsPsBAkACQAJAAkAgAUEAKALQkAIiAmsiA0H//wBLDQBBACkD2JACIQUgA0HoB0sNASAFIQUgAyEDDAILQQBBACkD2JACIANB6AduIgKtfDcD2JACIAMgAkHoB2xrIQMMAgsgBSABIAJrQZd4aiIDQegHbiIEQQFqrXwhBSABIAIgA2prIAMgBEHoB2xrakGYeGohAwtBACAFNwPYkAIgAyEDC0EAIAEgA2s2AtCQAkEAQQApA9iQAj4C4JACEKkFEDgQ7wVBAEEAOgDBkAJBAEEALQDAkAJBAnQQHyIBNgK8kAIgASAAQQAtAMCQAkECdBCeBhpBABA1PgLEkAIgAEGAAWokAAvCAQIDfwF+QQAQNaciADYCsPsBAkACQAJAAkAgAEEAKALQkAIiAWsiAkH//wBLDQBBACkD2JACIQMgAkHoB0sNASADIQMgAiECDAILQQBBACkD2JACIAJB6AduIgGtfDcD2JACIAIgAUHoB2xrIQIMAgsgAyAAIAFrQZd4aiICQegHbiIBrXxCAXwhAyACIAFB6Adsa0EBaiECC0EAIAM3A9iQAiACIQILQQAgACACazYC0JACQQBBACkD2JACPgLgkAILEwBBAEEALQDIkAJBAWo6AMiQAgvEAQEGfyMAIgAhARAeIABBAC0AwJACIgJBAnRBD2pB8A9xayIDJAACQCACRQ0AQQAoAryQAiEEQQAhAANAIAMgACIAQQJ0IgVqIAQgBWooAgAoAgAoAgA2AgAgAEEBaiIFIQAgBSACRw0ACwsCQEEALQDJkAIiAEEPTw0AQQAgAEEBajoAyZACCyADQQAtAMiQAkEQdEEALQDJkAJyQYCeBGo2AgACQEEAQQAgAyACQQJ0EJcGDQBBAEEAOgDIkAILIAEkAAsEAEEBC9wBAQJ/AkBBzJACQaDCHhD9BUUNABDnBQsCQAJAQQAoAsSQAiIARQ0AQQAoArD7ASAAa0GAgIB/akEASA0BC0EAQQA2AsSQAkGRAhAdC0EAKAK8kAIoAgAiACAAKAIAKAIIEQAAAkBBAC0AwZACQf4BRg0AAkBBAC0AwJACQQFNDQBBASEAA0BBACAAIgA6AMGQAkEAKAK8kAIgAEECdGooAgAiASABKAIAKAIIEQAAIABBAWoiASEAIAFBAC0AwJACSQ0ACwtBAEEAOgDBkAILEI0GEM8FEJ8FEJoGC9oBAgR/AX5BAEGQzgA2ArCQAkEAEDWnIgA2ArD7AQJAAkACQAJAIABBACgC0JACIgFrIgJB//8ASw0AQQApA9iQAiEEIAJB6AdLDQEgBCEEIAIhAgwCC0EAQQApA9iQAiACQegHbiIBrXw3A9iQAiACIAFB6AdsayECDAILIAQgACABa0GXeGoiAkHoB24iA0EBaq18IQQgACABIAJqayACIANB6Adsa2pBmHhqIQILQQAgBDcD2JACIAIhAgtBACAAIAJrNgLQkAJBAEEAKQPYkAI+AuCQAhDrBQtnAQF/AkACQANAEJIGIgBFDQECQCAALQADQQNxQQNHDQAgACkCBBDzBVINAEE/IAAvAQBBAEEAEJcGGhCaBgsDQCAAEN8FIAAQ9wUNAAsgABCTBhDpBRA9IAANAAwCCwALEOkFED0LCxQBAX9B3TZBABCxBSIAQYUuIAAbCw8AQcLAAEHx////AxCzBQsGAEHQ7gAL3gEBA38jAEEQayIAJAACQEEALQDkkAINAEEAQn83A4iRAkEAQn83A4CRAkEAQn83A/iQAkEAQn83A/CQAgNAQQAhAQJAQQAtAOSQAiICQf8BRg0AQc/uACACQek5ELIFIQELIAFBABCxBSEBQQAtAOSQAiECAkACQCABDQBBwAAhASACQcAASQ0BQQBB/wE6AOSQAiAAQRBqJAAPCyAAIAI2AgQgACABNgIAQak6IAAQO0EALQDkkAJBAWohAQtBACABOgDkkAIMAAsAC0HE3ABBi8sAQdwAQZMlEIAGAAs1AQF/QQAhAQJAIAAtAARB8JACai0AACIAQf8BRg0AQc/uACAAQdg2ELIFIQELIAFBABCxBQs4AAJAAkAgAC0ABEHwkAJqLQAAIgBB/wFHDQBBACEADAELQc/uACAAQfwRELIFIQALIABBfxCvBQtTAQN/AkAgAQ0AQcW78oh4DwtBxbvyiHghAiAAIQAgASEBA0AgAiAAIgAtAABzQZODgAhsIgMhAiAAQQFqIQAgAUF/aiIEIQEgAyEDIAQNAAsgAwsEABAzC04BAX8CQEEAKAKQkQIiAA0AQQAgAEGTg4AIbEENczYCkJECC0EAQQAoApCRAiIAQQ10IABzIgBBEXYgAHMiAEEFdCAAcyIANgKQkQIgAAt+AQN/Qf//AyECAkAgAUUNACABIQIgACEAQf//AyEBA0AgAkF/aiIDIQIgACIEQQFqIQAgAUH//wNxIgFBCHQgBC0AACABQQh2cyIBQfABcUEEdiABc0H/AXEiAXIgAUEMdHMgAUEFdHMiBCEBIAMNAAsgBCECCyACQf//A3ELdQEFfyAALQACQQpqIQEgAEECaiECQf//AyEDA0AgAUF/aiIEIQEgAiIFQQFqIQIgA0H//wNxIgNBCHQgBS0AACADQQh2cyIDQfABcUEEdiADc0H/AXEiA3IgA0EMdHMgA0EFdHMiBSEDIAQNAAsgACAFOwEAC4YCAQh/AkAgAC0ADCIBQQdqQfwDcSICIAAtAAIiA0kNAEEADwsgAiECAkAgAEEMaiIEIAFBBGoiBWotAABB/wFHDQACQCABIABqQRFqLQAAIgEgA0kNAEEADwsgASECIAUgAUkNAEEADwsgACAALQADQf0BcToAA0EAIQECQCAAIAIiBWpBDGoiAi0AACIGQQRqIgcgBWogA0oNACACIQEgBCEDIAZBB2oiCEECdiECA0AgAyIDIAEiASgCADYCACABQQRqIQEgA0EEaiEDIAJBf2oiBCECIAQNAAsgAEEMaiIBIAdqQf8BOgAAIAYgAWpBBWogCEH8AXEgBWo6AABBASEBCyABC0kBAX8CQCACQQRJDQAgASEBIAAhACACQQJ2IQIDQCAAIgAgASIBKAIANgIAIAFBBGohASAAQQRqIQAgAkF/aiIDIQIgAw0ACwsLCQAgAEEAOgACC54BAQN/AkACQCABQYACTw0AIAJBgIAETw0BQQAhBAJAIANBBGogAEEMaiIFIAUgAC0AAiIGaiIFa0HsAWpLDQAgBSABOgABIAUgAzoAACAFQQNqIAJBCHY6AAAgBUECaiACOgAAIAAgBiADQQdqQfwBcWo6AAIgBUEEaiEECyAEDwtBl8oAQf0AQaM2EPsFAAtBl8oAQf8AQaM2EPsFAAssAQF/IwBBEGsiAyQAIAMgAjYCCCADIAE2AgQgAyAANgIAQY4aIAMQOxAbAAtJAQN/AkAgACgCACICQQAoAuCQAmsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgC4JACIgRrQX9KDQAgACAEIAFqNgIACyADQR92C0kBA38CQCAAKAIAIgJBACgCsPsBayIDQX9KDQAgACACIAFqIgI2AgAgAkEAKAKw+wEiBGtBf0oNACAAIAQgAWo2AgALIANBH3YLagEDfwJAIAJFDQBBACEDA0AgACADIgNBAXRqIgQgASADaiIFLQAAQQR2Qa0wai0AADoAACAEQQFqIAUtAABBD3FBrTBqLQAAOgAAIANBAWoiBCEDIAQgAkcNAAsLIAAgAkEBdGpBADoAAAvqAgEHfyAAIQICQCABLQAAIgNFDQAgA0UhBCADIQMgASEBQQAhBSAAIQYDQCAGIQcgBSEIIAQhBCADIQMgASECAkADQCACIQIgBCEFAkACQCADIgRBUGpB/wFxQQlLIgMNACAEwEFQaiEBDAELQX8hASAEQSByIgZBn39qQf8BcUEFSw0AIAbAQal/aiEBCyABQX9HDQEgAi0AASIBRSEEIAEhAyACQQFqIQIgAQ0ACyAHIQIMAgsCQCAFQQFxRQ0AIAchAgwCCwJAAkAgAw0AIATAQVBqIQEMAQtBfyEBIARBIHIiBEGff2pB/wFxQQVLDQAgBMBBqX9qIQELIAEhASACQQFqIQICQAJAIAgNACAHIQYgAUEEdEGAAnIhBQwBCwJAIABFDQAgByABIAhyOgAACyAHQQFqIQZBACEFCyACLQAAIgdFIQQgByEDIAIhASAFIQUgBiICIQYgAiECIAcNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBB6RkgBBA7EBsAC1gBBH8gACAALQAAIgFBLUZqIQBBACECA0AgACIDQQFqIQAgAywAAEFQaiIDIAIiAkEKbGogAiADQf8BcUEKSSIDGyIEIQIgAw0AC0EAIARrIAQgAUEtRhsLtxABDn8jAEHAAGsiBSQAIAAgAWohBiAFQX9qIQcgBUEBciEIIAVBAnIhCUEAIQEgACEKIAQhBCACIQsgAiECA0AgAiECIAQhDCAKIQ0gASEBIAsiDkEBaiEPAkACQCAOLQAAIhBBJUYNACAQRQ0AIAEhASANIQogDCEEIA8hC0EBIQ8gAiECDAELAkACQCACIA9HDQAgASEBIA0hCgwBCyAGIA1rIREgASEBQQAhCgJAIAJBf3MgD2oiC0EATA0AA0AgASACIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAtHDQALCyABIQECQCARQQBMDQAgDSACIAsgEUF/aiARIAtKGyIKEJ4GIApqQQA6AAALIAEhASANIAtqIQoLIAohDSABIRECQCAQDQAgESEBIA0hCiAMIQQgDyELQQAhDyACIQIMAQsCQAJAIA8tAABBLUYNACAPIQFBACEKDAELIA5BAmogDyAOLQACQfMARiIKGyEBIAogAEEAR3EhCgsgCiEOIAEiEiwAACEBIAVBADoAASASQQFqIQ8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUFbag5UCAcHBwcGBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHAwcHBwcHBwcHBwcAAQcFBwcHBwcHBwcHBAcHCgcCBwcDBwsgBSAMKAIAOgAAIBEhCiANIQQgDEEEaiECDAwLIAUhCgJAAkAgDCgCACIBQX9MDQAgASEBIAohCgwBCyAFQS06AABBACABayEBIAghCgsgDEEEaiEOIAoiCyEKIAEhBANAIAoiCiAEIgEgAUEKbiIEQQpsa0EwcjoAACAKQQFqIgIhCiAEIQQgAUEJSw0ACyACQQA6AAAgCyALEM0GakF/aiIEIQogCyEBIAQgC00NCgNAIAEiAS0AACEEIAEgCiIKLQAAOgAAIAogBDoAACAKQX9qIgQhCiABQQFqIgIhASACIARJDQAMCwsACyAFIQogDCgCACEEA0AgCiIKIAQiASABQQpuIgRBCmxrQTByOgAAIApBAWoiAiEKIAQhBCABQQlLDQALIAJBADoAACAMQQRqIQsgByAFEM0GaiIEIQogBSEBIAQgBU0NCANAIAEiAS0AACEEIAEgCiIKLQAAOgAAIAogBDoAACAKQX9qIgQhCiABQQFqIgIhASACIARJDQAMCQsACyAFQbDwATsBACAMKAIAIQtBACEKQRwhBANAIAohCgJAAkAgCyAEIgF2QQ9xIgQNACABRQ0AQQAhAiAKRQ0BCyAJIApqIARBN2ogBEEwciAEQQlLGzoAACAKQQFqIQILIAIiAiEKIAFBfGohBCABDQALIAkgAmpBADoAACARIQogDSEEIAxBBGohAgwJCyAFQbDwATsBACAMKAIAIQtBACEKQRwhBANAIAohCgJAAkAgCyAEIgF2QQ9xIgQNACABRQ0AQQAhAiAKRQ0BCyAJIApqIARBN2ogBEEwciAEQQlLGzoAACAKQQFqIQILIAIiAiEKIAFBfGohBCABDQALIAkgAmpBADoAACARIQogDSEEIAxBBGohAgwICyAFIAxBB2pBeHEiASsDAEEIEIMGIBEhCiANIQQgAUEIaiECDAcLAkACQCASLQABQfAARg0AIBEhASANIQ9BPyENDAELAkAgDCgCACIBQQFODQAgESEBIA0hD0EAIQ0MAQsgDCgCBCEKIAEhBCANIQIgESELA0AgCyERIAIhDSAKIQsgBCIQQR8gEEEfSBshAkEAIQEDQCAFIAEiAUEBdGoiCiALIAFqIgQtAABBBHZBrTBqLQAAOgAAIAogBC0AAEEPcUGtMGotAAA6AAEgAUEBaiIKIQEgCiACRw0ACyAFIAJBAXQiD2pBADoAACAGIA1rIQ4gESEBQQAhCgJAIA9BAEwNAANAIAEgBSAKIgpqLQAAQcABcUGAAUdqIQEgCkEBaiIEIQogBCAPRw0ACwsgASEBAkAgDkEATA0AIA0gBSAPIA5Bf2ogDiAPShsiChCeBiAKakEAOgAACyALIAJqIQogECACayIOIQQgDSAPaiIPIQIgASELIAEhASAPIQ9BACENIA5BAEoNAAsLIAUgDToAACABIQogDyEEIAxBCGohAiASQQJqIQEMBwsgBUE/OgAADAELIAUgAToAAAsgESEKIA0hBCAMIQIMAwsgBiANayEQIBEhAUEAIQoCQCAMKAIAIgRB2uYAIAQbIgsQzQYiAkEATA0AA0AgASALIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCAQQQBMDQAgDSALIAIgEEF/aiAQIAJKGyIKEJ4GIApqQQA6AAALIAxBBGohECAFQQA6AAAgDSACaiEEAkAgDkUNACALECALIAEhCiAEIQQgECECDAILIBEhCiANIQQgCyECDAELIBEhCiANIQQgDiECCyAPIQELIAEhDSACIQ4gBiAEIg9rIQsgCiEBQQAhCgJAIAUQzQYiAkEATA0AA0AgASAFIAoiCmotAABBwAFxQYABR2ohASAKQQFqIgQhCiAEIAJHDQALCyABIQECQCALQQBMDQAgDyAFIAIgC0F/aiALIAJKGyIKEJ4GIApqQQA6AAALIAEhASAPIAJqIQogDiEEIA0hC0EBIQ8gDSECCyABIg4hASAKIg0hCiAEIQQgCyELIAIhAiAPDQALAkAgA0UNACADIA5BAWo2AgALIAVBwABqJAAgDSAAa0EBagvtCAMDfgh/AXwCQAJAIAFEAAAAAAAAAABjDQAgASEBIAAhAAwBCyAAQS06AAAgAZohASAAQQFqIQALIAAhAAJAIAEiAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgJBD0khBiABRI3ttaD3xrA+YyEHAkACQCABELYGIg6ZRAAAAAAAAOBBY0UNACAOqiEIDAELQYCAgIB4IQgLIAghCCACQQ8gBhshAgJAAkAgBw0AIAFEUO/i1uQaS0RkDQAgCCEGQQEhByABIQEMAQsCQCAIQX9KDQBBACEGIAghByABRAAAAAAAACRAQQAgCGsQ9waiIQEMAQtBACEGIAghByABRAAAAAAAACRAIAgQ9wajIQELIAEhASAHIQkgAiAGIgpBAWoiC0EPIApBD0giBhsgCiACSCIIGyEMAkACQCAIDQAgBg0AIAogDGtBAWoiCCECIAFEAAAAAAAAJEAgCBD3BqNEAAAAAAAA4D+gIQEMAQtBACECIAFEAAAAAAAAJEAgDCAKQX9zahD3BqJEAAAAAAAA4D+gIQELIAIhDSAKQX9KIQICQAJAIAEiAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCyADIQMCQAJAIAJFDQAgACEADAELIABBsNwAOwAAIABBAmohAgJAIApBf0cNACACIQAMAQsgAkEwIApBf3MQoAYaIAAgCmtBAWohAAsgAyEDIAwhCCAAIQACQANAIAAhAiADIQQCQCAIIghBAU4NACACIQIMAgtBMCEAIAQhAwJAIAQgCEF/aiIIQQN0QfCZAWopAwAiBVQNAANAIABBAWohACADIAV9IgQhAyAEIAVaDQALCyACIAA6AAAgAkEBaiEAAkACQCADIgNCAFIgDCAIayIHIApMciIGQQFGDQAgACEADAELIAAhACAHIAtHDQAgAkEuOgABIAJBAmohAAsgAyEDIAghCCAAIgIhACACIQIgBg0ACwsgAiEAAkACQCANQQFODQAgACEADAELIABBMCANEKAGIA1qIQALIAAhAAJAAkAgCUEBRg0AIABB5QA6AAACQAJAIAlBAU4NACAAQQFqIQAMAQsgAEErOgABIABBAmohAAsgACEAAkACQCAJQX9MDQAgCSEIIAAhAAwBCyAAQS06AABBACAJayEIIABBAWohAAsgACIHIQIgCCEIA0AgAiICIAgiACAAQQpuIghBCmxrQTByOgAAIAJBAWoiBiECIAghCCAAQQlLDQALIAZBADoAACAHIAcQzQZqQX9qIgAgB00NASAAIQIgByEAA0AgACIALQAAIQggACACIgItAAA6AAAgAiAIOgAAIAJBf2oiCCECIABBAWoiBiEAIAYgCEkNAAwCCwALIABBADoAAAsLDwAgACABIAJBACADEIIGCywBAX8jAEEQayIEJAAgBCADNgIMIAAgASACQQAgAxCCBiEDIARBEGokACADC64BAQZ/IwBBEGsiAiABNwMIQcW78oh4IQMgAkEIaiECQQghBANAIANBk4OACGwiBSACIgItAABzIgYhAyACQQFqIQIgBEF/aiIHIQQgBw0ACyAAQQA6AAQgACAGQf////8DcSIDQeg0bkEKcEEwcjoAAyAAIANBpAVuQQpwQTByOgACIAAgAyAFQR52cyIDQRpuIgJBGnBBwQBqOgABIAAgAyACQRpsa0HBAGo6AAALTQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgAEEAIAEQggYiARAfIgMgASAAQQAgAigCCBCCBhogAkEQaiQAIAMLdwEFfyABQQF0IgJBAXIQHyEDAkAgAUUNAEEAIQQDQCADIAQiBEEBdGoiBSAAIARqIgYtAABBBHZBrTBqLQAAOgAAIAVBAWogBi0AAEEPcUGt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BSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu9AgEDfwJAIAANAEEAIQECQEEAKAKskwJFDQBBACgCrJMCEKMGIQELAkBBACgCsO8BRQ0AQQAoArDvARCjBiABciEBCwJAELkGKAIAIgBFDQADQEEAIQICQCAAKAJMQQBIDQAgABChBiECCwJAIAAoAhQgACgCHEYNACAAEKMGIAFyIQELAkAgAkUNACAAEKIGCyAAKAI4IgANAAsLELoGIAEPC0EAIQICQCAAKAJMQQBIDQAgABChBiECCwJAAkACQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEGABogACgCFA0AQX8hASACDQEMAgsCQCAAKAIEIgEgACgCCCIDRg0AIAAgASADa6xBASAAKAIoEREAGgtBACEBIABBADYCHCAAQgA3AxAgAEIANwIEIAJFDQELIAAQogYLIAEL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DQELIAVBEGogASACIAMgBBD1BiAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEO0GIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAJC////////////AIMiCSADIARC////////////AIMiChDrBkEASg0AAkAgASAJIAMgChDrBkUNACABIQQMAgsgBUHwAGogASACQgBCABD1BiAFQfgAaikDACECIAUpA3AhBAwBCyAEQjCIp0H//wFxIQYCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ9QYgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEPUGIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABD1BiAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ9QYgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EPUGIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkH87QFqKAIAIQYgAkHw7QFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhG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DQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEJIAQgAiAHGyILQv///////z+DIQogAiAEIAcbIgJCMIinQf//AXEhCAJAIAtCMIinQf//AXEiBg0AIAVB4ABqIAkgCiAJIAogClAiBht5IAZBBnStfKciBkFxahDqBkEQIAZrIQYgBUHoAGopAwAhCiAFKQNgIQkLIAEgAyAHGyEDIAJC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ6gZBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIApCA4YgCUI9iIQhBCADQgOGIQogCyAChSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAUIBIQoMAQsgBUHAAGogCiABQYABIAdrEOoGIAVBMGogCiABIAcQ9AYgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQogBUEwakEIaikDACEBCyAEQoCAgICAgIAEhCEMIAlCA4YhCQJAAkAgA0J/VQ0AQgAhA0IAIQQgCSAKhSAMIAGFhFANAiAJIAp9IQIgDCABfSAJIApUrX0iBEL/////////A1YNASAFQSBqIAIgBCACIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDqBiAGIAdrIQYgBUEoaikDACEEIAUpAyAhAgwBCyABIAx8IAogCXwiAiAKVK18IgRCgICAgICAgAiDUA0AIAJCAYggBEI/hoQgCkIBg4QhAiAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQoCQCAGQf//AUgNACAKQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAIgBCAGQf8AahDqBiAFIAIgBEEBIAZrEPQGIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQIgBUEIaikDACEECyACQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgCoQhBCACp0EHcSEGAkACQAJAAkACQBDyBg4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIApCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIApQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDzBhoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvnEAIFfw9+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEOoGQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ6gYgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ9gYgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ9gYgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ9gYgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ9gYgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ9gYgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ9gYgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ9gYgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ9gYgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ9gYgBUGQAWogA0IPhkIAIARCABD2BiAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEPYGIAVBgAFqQgEgAn1CACAEQgAQ9gYgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIhRCIIgiBH4iFSABQgGGIhZCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgFVStIBAgD0L/////D4MiDyABQj+IIhcgC0IBhoRC/////w+DIgt+fCIRIBBUrXwgDSAEfnwgDyAEfiIVIAsgDX58IhAgFVStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgC34iFSACIAp+fCIRIBVUrSARIA8gFkL+////D4MiFX58IhggEVStfHwiESAQVK18IBEgEiAEfiIQIBUgDX58IgQgAiALfnwiDSAPIAp+fCIPQiCIIAQgEFStIA0gBFStfCAPIA1UrXxCIIaEfCIEIBFUrXwgBCAYIAIgFX4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAYVK0gAiAPQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAUIBeEIRMgBUHQAGogAiAEIAMgDhD2BiABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhD2BiABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRYLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCEPIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEPQGIAVBMGogFiATIAZB8ABqEOoGIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACIPEPYGIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ9gYgBSADIA5CBUIAEPYGIA8gAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDqBiACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDqBiACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEOoGIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEOoGIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEOoGQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEOoGIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESADQjGIIApCD4YiFIRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0H/AEsNACAFQTBqIBIgASAGQf8AaiIGEOoGIAVBIGogAiAEIAYQ6gYgBUEQaiASIAEgBxD0BiAFIAIgBCAHEPQGIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAgtCACEBDAILIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiAiABQiCIIgR+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyAEfnwiA0IgiHwgA0L/////D4MgAiABfnwiAUIgiHw3AwggACABQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDpBiAFKQMAIQQgACAFQQhqKQMANwMIIAAgBDcDACAFQRBqJAAL5AMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ6gYgAiAAIARBgfgAIANrEPQGIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAhSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBgAgACQBCwQAIwELBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCwQAIwALFABBsJcGJANBsJcCQQ9qQXBxJAILBwAjACMCawsEACMDCwQAIwILDQAgASACIAMgABERAAslAQF+IAAgASACrSADrUIghoQgBBCEByEFIAVCIIinEPoGIAWnCxMAIAAgAacgAUIgiKcgAiADEBQLC57zgYAAAwBBgAgLiOYBaW5maW5pdHkALUluZmluaXR5ACEgRXhjZXB0aW9uOiBPdXRPZk1lbW9yeQBpc1JlYWRPbmx5AGRldnNfdmVyaWZ5AHN0cmluZ2lmeQBzdG10Ml9jYWxsX2FycmF5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkARXhwZWN0aW5nIHN0cmluZywgYnVmZmVyIG9yIGFycmF5AGlzQXJyYXkAZGVsYXkAc2V0dXBfY3R4AGhleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAZGV2c19zcGVjX2lkeABtYXgAISBibG9jayBjb3JydXB0aW9uOiAlcCBvZmY9JXUgdj0leABXU1NLLUg6IGVycm9yIG9uIGNtZD0leABXU1NLLUg6IHNlbmQgY21kPSV4AG1ldGhvZDolZDoleABkYmc6IHVuaGFuZGxlZDogJXgvJXgAISB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAISBzdGVwIGZyYW1lICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAc3BlYyBtaXNzaW5nOiAleABXU1NLLUg6IHN0cmVhbWluZzogJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3ACEgZG91YmxlIHRocm93AHBvdwBmc3RvcjogZm9ybWF0dGluZyBub3cAY2h1bmsgb3ZlcmZsb3cAISBFeGNlcHRpb246IFN0YWNrT3ZlcmZsb3cAYmxpdFJvdwBqZF93c3NrX25ldwBqZF93ZWJzb2NrX25ldwBleHByMV9uZXcAZGV2c19qZF9zZW5kX3JhdwBpZGl2AHByZXYALmFwcC5naXRodWIuZGV2ACVzJXUAdGhyb3c6JWRAJXUAZnN0b3I6IG5vIGZyZWUgcGFnZXM7IHN6PSV1AGZzdG9yOiBvdXQgb2Ygc3BhY2U7IHN6PSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AGZzdG9yOiB0b28gbGFyZ2U6ICV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAVW5leHBlY3RlZCBlbmQgb2YgSlNPTiBpbnB1dABzZXRUaW1lb3V0AGNsZWFyVGltZW91dABzdG9wX2xpc3QAZGlnZXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AHJlc3RhcnQAZGV2c19maWJlcl9zdGFydAAoY29uc3QgdWludDhfdCAqKShsYXN0X2VudHJ5ICsgMSkgPD0gZGF0YV9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQAZGVjcnlwdABEZXZpY2VTY3JpcHQAcmVib290ACEgZXhwZWN0aW5nIHN0YWNrLCBnb3QAcHJpbnQAZGV2c192bV9zZXRfYnJlYWtwb2ludABkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnQAZGV2c191dGY4X2NvZGVfcG9pbnQAamRfY2xpZW50X2VtaXRfZXZlbnQAdGNwc29ja19vbl9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAX3NvY2tldE9uRXZlbnQAamRfdHhfZnJhbWVfc2VudABjdXJyZW50AGRldnNfcGFja2V0X3NwZWNfcGFyZW50AGxhc3QtZW50AHZhcmlhbnQAcmFuZG9tSW50AHBhcnNlSW50AHRoaXMgbnVtZm10AGRiZzogaGFsdABtYXNrZWQgc2VydmVyIHBrdABqZF9mc3Rvcl9pbml0AGRldnNtZ3JfaW5pdABkY2ZnX2luaXQAYmxpdAB3YWl0AGhlaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX3Nob3J0X21hcF9zZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AF9vblNlcnZlclBhY2tldABfb25QYWNrZXQAZ2V0AGlzUmVnU2V0AGlzUmVnR2V0AGRldnNfZ2V0X2J1aWx0aW5fb2JqZWN0AGEgYnVpbHRpbiBmcm96ZW4gb2JqZWN0AGZpbGxSZWN0AHBhcnNlRmxvYXQAZGV2c2Nsb3VkOiBpbnZhbGlkIGNsb3VkIHVwbG9hZCBmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAGpkaWY6IHJvbGUgJyVzJyBhbHJlYWR5IGV4aXN0cwBqZF9yb2xlX3NldF9oaW50cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAMHgxeHh4eHh4eCBleHBlY3RlZCBmb3Igc2VydmljZSBjbGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGlkeCA8PSBjdHgtPm51bV9waW5zAEdQSU86IGluaXQ6ICVkIHBpbnMAZXF1YWxzAG1pbGxpcwBmbGFncwBzZW5kX3ZhbHVlcwBkY2ZnOiBpbml0ZWQsICVkIGVudHJpZXMsICV1IGJ5dGVzAGNhcGFiaWxpdGllcwBpZHggPCBjdHgtPmltZy5oZWFkZXItPm51bV9zZXJ2aWNlX3NwZWNzAHBpcGVzIGluIHNwZWNzAGFicwBldmVyeU1zAGRldnMta2V5LSUtcwAqIGNvbm5lY3Rpb24gZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gJXM6Ly8lczolZCVzAHNlbGYtZGV2aWNlOiAlcy8lcwAjICV1ICVzAGV4cGVjdGluZyAlczsgZ290ICVzACogc3RhcnQ6ICVzICVzACogY29ubmVjdGVkIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAJWMgJXMAPiAlcwBtYWluOiBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwA+ICVzOiAlcwBXUzogZXJyb3I6ICVzAFdTU0s6IGVycm9yOiAlcwBiYWQgcmVzcDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAVW5rbm93biBlbmNvZGluZzogJXMAZnN0b3I6IG1vdW50IGZhaWx1cmU6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwAlYyAgICAlcwB3c3NrX2Nvbm5zdHIAbiA8PSB3cy0+bXNncHRyAGZhaWxfcHRyAG1hcmtfcHRyAHdyaXRlIGVycgBfbG9nUmVwcgBjb25zdHJ1Y3RvcgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAaXNTaW11bGF0b3IAdGFnIGVycm9yAHNvY2sgd3JpdGUgZXJyb3IAU3ludGF4RXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAc2VydmVyAEpTT04ucGFyc2UgcmV2aXZlcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBtZ3I6IHN0YXJ0aW5nIGNsb3VkIGFkYXB0ZXIAbWdyOiBkZXZOZXR3b3JrIG1vZGUgLSBkaXNhYmxlIGNsb3VkIGFkYXB0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBkZXZzX21hcGxpa2VfaXRlcgBkZXBsb3lfaGFuZGxlcgBzdGFydF9wa3RfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGNsYXNzSWRlbnRpZmllcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgBzcGlYZmVyAGZzdG9yOiBubyBzcGFjZSBmb3IgaGVhZGVyAEpTT04uc3RyaW5naWZ5IHJlcGxhY2VyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBGaWJlcgBmbGFzaF9iYXNlX2FkZHIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBERVZTX1BBQ0tfU0hJRlQpID4+IERFVlNfUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABicHAAcG9wACEgRXhjZXB0aW9uOiBJbmZpbml0ZUxvb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAHNsZWVwAGRldnNfbWFwbGlrZV9pc19tYXAAZGV2c19kdW1wX2hlYXAAdmFsaWRhdGVfaGVhcABEZXZTLVNIQTI1NjogJSpwACEgR0MtcHRyIHZhbGlkYXRpb24gZXJyb3I6ICVzIHB0cj0lcAAlczolcABjbG9zdXJlOiVkOiVwAG1ldGhvZDolZDolcABpbnZhbGlkIHRhZzogJXggYXQgJXAAISBoZDogJXAAZGV2c19tYXBsaWtlX2dldF9wcm90bwBnZXRfc3RhdGljX2J1aWx0X2luX3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX2luc3BlY3RfdG8Ac21hbGwgaGVsbG8AZ3BpbwBqZF9zcnZjZmdfcnVuAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AISBVbmhhbmRsZWQgZXhjZXB0aW9uACogRXhjZXB0aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24AX2kyY1RyYW5zYWN0aW9uAGlzQWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AQHZlcnNpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBqZF9zZXR0aW5nc19zZXRfYmluAG1haW4AbWV0aDFfRHNTZXJ2aWNlU3BlY19hc3NpZ24AbWdyOiBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAF9zb2NrZXRPcGVuAGZzdG9yOiBnYyBkb25lLCAlZCBmcmVlLCAlZCBnZW4AbmFuAGJvb2xlYW4AZnJvbQByYW5kb20AZmlsbFJhbmRvbQBhZXMtMjU2LWNjbQBmbGFzaF9wcm9ncmFtACogc3RvcCBwcm9ncmFtAGltdWwAdW5rbm93biBjdHJsAG5vbi1maW4gY3RybAB0b28gbGFyZ2UgY3RybABudWxsAGZpbGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsYWJlbABzZXRJbnRlcnZhbABjbGVhckludGVydmFsAHNpZ25hbABub24tbWluaW1hbAA/c3BlY2lhbABkZXZOZXR3b3JrAGRldnNfaW1nX3N0cmlkeF9vawBkZXZzX2djX2FkZF9jaHVuawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAb3ZlcmxhcHNXaXRoAGRldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aABzeiA9PSBzLT5sZW5ndGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABsZW4gPT0gcy0+aW5uZXIubGVuZ3RoAEludmFsaWQgYXJyYXkgbGVuZ3RoAHNpemUgPj0gbGVuZ3RoAHNldExlbmd0aABieXRlTGVuZ3RoAHdpZHRoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAZG9fZmx1c2gAZGV2c19zdHJpbmdfZmluaXNoACEgdmVyc2lvbiBtaXNtYXRjaABlbmNyeXB0aW9uIHRhZyBtaXNtYXRjaABmb3JFYWNoAHAgPCBjaABzaGlmdF9tc2cAc21hbGwgbXNnAG5lZWQgZnVuY3Rpb24gYXJnACpwcm9nAGxvZwBjYW4ndCBwb25nAHNldHRpbmcAZ2V0dGluZwBib2R5IG1pc3NpbmcARENGRyBtaXNzaW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwBfZGNmZ1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAZGV2c19ncGlvX2luaXRfZGNmZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c19zdHJpbmdfdnNwcmludGYAZGV2c192YWx1ZV90eXBlb2YAc2VsZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAeV9vZmYAZm5pZHggPD0gMHhmZmZmAG5vbiBmZgAwMTIzNDU2Nzg5YWJjZGVmAGluZGV4T2YAc2V0UHJvdG90eXBlT2YAZ2V0UHJvdG90eXBlT2YAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplAGJsb2NrX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gZmxhc2hfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBzeiA9PSBzLT5pbm5lci5zaXplAHN0YXRlLm9mZiArIDMgPD0gc2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAZXhwYW5kX2tleV92YWx1ZQBwcm90b192YWx1ZQBkZXZzX21hcGxpa2VfdG9fdmFsdWUAanNvbl92YWx1ZQBleHBhbmRfdmFsdWUAP3ZhbHVlAHdyaXRlAF9zb2NrZXRXcml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAY2F1c2UAZGV2c19qc29uX3BhcnNlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAX3NvY2tldENsb3NlAHdlYnNvY2sgcmVzcG9uc2UAX2NvbW1hbmRSZXNwb25zZQBtZ3I6IHJ1bm5pbmcgc2V0IHRvIGZhbHNlAGZsYXNoX2VyYXNlAHRvTG93ZXJDYXNlAHRvVXBwZXJDYXNlAGRldnNfbWFrZV9jbG9zdXJlAHNwaUNvbmZpZ3VyZQBubyAucHJvdG90eXBlAGludmFsaWQgLnByb3RvdHlwZQBtYWluOiBvcGVuaW5nIGRlcGxveSBwaXBlAG1haW46IGNsb3NlZCBkZXBsb3kgcGlwZQBjbG9uZQBHUElPOiBpbml0IHVzZWQgZG9uZQBpbmxpbmUAZHJhd0xpbmUAZGJnOiByZXN1bWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAV1M6IGNsb3NlIGZyYW1lAHByb3BfRnVuY3Rpb25fbmFtZQBAbmFtZQBkZXZOYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAX2FsbG9jUm9sZQBmaWxsQ2lyY2xlAG5ldHdvcmsgbm90IGF2YWlsYWJsZQByZWNvbXB1dGVfY2FjaGUAbWFya19sYXJnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQAqICBtZXNzYWdlAF90d2luTWVzc2FnZQBpbWFnZQBkcmF3SW1hZ2UAZHJhd1RyYW5zcGFyZW50SW1hZ2UAc3BpU2VuZEltYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGZzdG9yOiBtb3VudGVkOyAlZCBmcmVlAG1vZGUAbWV0aFhfRHNQYWNrZXRTcGVjX2VuY29kZQBkZWNvZGUAc2V0TW9kZQBldmVudENvZGUAZnJvbUNoYXJDb2RlAHJlZ0NvZGUAaW1nX3N0cmlkZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBTZXJ2ZXJJbnRlcmZhY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAISBzZXJ2aWNlICVzOiVkIG5vdCBmb3VuZABib3VuZABpc0JvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAamRpZjogYXV0b2JpbmQAZGV2c19tYXBsaWtlX2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAHN1c3BlbmQAX3NlcnZlclNlbmQAbGVkU3RyaXBTZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZABob3N0IG9yIHBvcnQgaW52YWxpZABidWZmZXIgbnVtZm10IGludmFsaWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAHJlYWRfaW5kZXhlZAAqIFJFU1RBUlQgcmVxdWVzdGVkAG5vdEltcGxlbWVudGVkAG9iamVjdCBleHBlY3RlZABvbkRpc2Nvbm5lY3RlZABvbkNvbm5lY3RlZABkYXRhX3BhZ2VfdXNlZAByb2xlIG5hbWUgJyVzJyBhbHJlYWR5IHVzZWQAdHJhbnNwb3NlZABmaWJlciBhbHJlYWR5IGRpc3Bvc2VkACogY29ubmVjdGlvbiB0byAlcyBjbG9zZWQAV1NTSy1IOiBzdHJlYW1pbmcgZXhwaXJlZABkZXZzX3ZhbHVlX2lzX3Bpbm5lZAB0aHJvd2luZyBudWxsL3VuZGVmaW5lZAByZWFkX25hbWVkACV1IHBhY2tldHMgdGhyb3R0bGVkACVzIGNhbGxlZABkZXZOZXR3b3JrIGVuYWJsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAGZpYmVyIG5vdCBzdXNwZW5kZWQAV1NTSy1IOiBleGNlcHRpb24gdXBsb2FkZWQAcGF5bG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkAHByb2R1Y3RJZABpbnZhbGlkIGRpbWVuc2lvbnMgJWR4JWR4JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW5fb2JqOiVkACogJXMgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkAGludmFsaWQgb2Zmc2V0ICVkACEgY2FuJ3QgdmFsaWRhdGUgbWZyIGNvbmZpZyBhdCAlcCwgZXJyb3IgJWQAR1BJTzogJXMoJWQpIHNldCB0byAlZABVbmV4cGVjdGVkIHRva2VuICclYycgaW4gSlNPTiBhdCBwb3NpdGlvbiAlZABkYmc6IHN1c3BlbmQgJWQAamRpZjogY3JlYXRlIHJvbGUgJyVzJyAtPiAlZABXUzogaGVhZGVycyBkb25lOyAlZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c19nZXRfcHJvcGVydHlfZGVzYwBkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAcGMgPT0gKGRldnNfcGNfdClwYwBkZXZzX3N0cmluZ19qbXBfdHJ5X2FsbG9jAGRldnNkYmdfcGlwZV9hbGxvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAZmxhc2ggc3luYwBmdW4xX0RldmljZVNjcmlwdF9fcGFuaWMAYmFkIG1hZ2ljAGpkX2ZzdG9yX2djAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGZzdG9yOiBnYwBkZXZzX3ZhbHVlX2Zyb21fcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldnNfdmFsdWVfZnJvbV9zZXJ2aWNlX3NwZWMAUGFja2V0U3BlYwBTZXJ2aWNlU3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvaW1wbF9zb2NrZXQuYwBkZXZpY2VzY3JpcHQvaW5zcGVjdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBkZXZpY2VzY3JpcHQvaW1wbF9kcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9mc3Rvci5jAGRldmljZXNjcmlwdC9kZXZzbWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2ltcGxfZ3Bpby5jAGRldmljZXNjcmlwdC9qc29uLmMAZGV2aWNlc2NyaXB0L2ltcGxfZnVuY3Rpb24uYwBkZXZpY2VzY3JpcHQvbmV0d29yay93ZWJzb2NrX2Nvbm4uYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGRldmljZXNjcmlwdC9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGRldmljZXNjcmlwdC9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zcnZjZmcuYwBqYWNkYWMtYy9zb3VyY2UvamRfZGNmZy5jAGRldmljZXNjcmlwdC9kZXZzZGJnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9pbXBsX2ltYWdlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvaW1wbF9wYWNrZXRzcGVjLmMAZGV2aWNlc2NyaXB0L2ltcGxfc2VydmljZXNwZWMuYwBkZXZpY2VzY3JpcHQvdXRmOC5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAG1ncjogZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBvbl9kYXRhAGV4cGVjdGluZyB0b3BpYyBhbmQgZGF0YQBfX25ld19fAF9fcHJvdG9fXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW1JvbGU6ICVzLiVzXQBbUGFja2V0U3BlYzogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10AW1NlcnZpY2VTcGVjOiAlc10AW0NpcmN1bGFyXQBbQnVmZmVyWyV1XSAlKnBdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0leCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlKnAuLi5dAFtJbWFnZTogJWR4JWQgKCVkIGJwcCldAGZsaXBZAGZsaXBYAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUAGV4cGVjdGluZyBDT05UAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX1BBQ0tFVABjbWQtPnBrdC0+c2VydmljZV9jb21tYW5kID09IEpEX0RFVlNfREJHX0NNRF9SRUFEX0lOREVYRURfVkFMVUVTACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBGU1RPUl9EQVRBX1BBR0VTIDw9IEpEX0ZTVE9SX01BWF9EQVRBX1BBR0VTAGRldnNfZ2NfdGFnKGIpID09IERFVlNfR0NfVEFHX0JVRkZFUgBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAENvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT04AaWR4ID49IERFVlNfRklSU1RfQlVJTFRJTl9GVU5DVElPTgBleHBlY3RpbmcgQklOAHBrdCAhPSBOVUxMAHNldHRpbmdzICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGZsYXNoX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAV1NTSwAodG1wLnYwICYgSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSykgIT0gSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19JTkRJQ0FUT1JfTUFTSwBTUEkARElTQ09OTkVDVElORwBzeiA9PSBsZW4gJiYgc3ogPCBERVZTX01BWF9BU0NJSV9TVFJJTkcAbWdyOiB3b3VsZCByZXN0YXJ0IGR1ZSB0byBEQ0ZHADAgPD0gZGlmZiAmJiBkaWZmIDw9IGZsYXNoX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUAd3MtPm1zZ3B0ciA8PSBNQVhfTUVTU0FHRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMASTJDAD8/PwAlYyAgJXMgPT4AaW50OgBhcHA6AHdzc2s6AHV0ZjgAc2l6ZSA+IHNpemVvZihjaHVua190KSArIDEyOAB1dGYtOABzaGEyNTYAY250ID09IDMgfHwgY250ID09IC0zAGxlbiA9PSBsMgBsb2cyAGRldnNfYXJnX2ltZzIAU1FSVDFfMgBTUVJUMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAc2l6ZSA+PSAyAFdTOiBnb3QgMTAxAEhUVFAvMS4xIDEwMQBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGxvZzEwAExOMTAAc2l6ZSA8IDB4ZjAwMABudW1fZWx0cyA8IDEwMDAAYXV0aCBub24tMABzeiA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzeiA+PSAwAGlkeCA+PSAwAHIgPj0gMABzdHItPmN1cnJfcmV0cnkgPT0gMABqZF9zcnZjZmdfaWR4ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABjdHgtPnN0YWNrX3RvcCA9PSAwAGV2ZW50X3Njb3BlID09IDAAc3RyW3N6XSA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKCh0bXAudjAgPDwgMSkgJiB+KEpEX0RFVlNfREJHX1NUUklOR19TVEFUSUNfSU5ERVhfTUFTSykpID09IDAAKCh0bXAudGFnIDw8IDI0KSAmIH4oSkRfREVWU19EQkdfU1RSSU5HX1NUQVRJQ19UQUdfTUFTSykpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8Ad3NzOi8vAHBpbnMuAD8uACVjICAuLi4AISAgLi4uACwAcGFja2V0IDY0aysAIWRldnNfaW5fdm1fbG9vcChjdHgpAGRldnNfaGFuZGxlX2lzX3B0cih2KQBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBkZXZzX2hhbmRsZV90eXBlKHYpID09IERFVlNfSEFORExFX1RZUEVfR0NfT0JKRUNUICYmIGRldnNfaXNfc3RyaW5nKGN0eCwgdikAZW5jcnlwdGVkIGRhdGEgKGxlbj0ldSkgc2hvcnRlciB0aGFuIHRhZ0xlbiAoJXUpACVzIG5vdCBzdXBwb3J0ZWQgKHlldCkAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChtYXApAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAc3RhdHM6ICVkIG9iamVjdHMsICVkIEIgdXNlZCwgJWQgQiBmcmVlICglZCBCIG1heCBibG9jaykAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpc19sYXJnZShlKQBHUElPOiBza2lwICVzIC0+ICVkICh1c2VkKQAhIGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAR1BJTzogaW5pdFsldV0gJXMgLT4gJWQgKD0lZCkAISBFeGNlcHRpb246IFBhbmljXyVkIGF0IChncGM6JWQpACogIGF0IHVua25vd24gKGdwYzolZCkAKiAgYXQgJXNfRiVkIChwYzolZCkAISAgYXQgJXNfRiVkIChwYzolZCkAYWN0OiAlc19GJWQgKHBjOiVkKQAhIG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0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IHJldHVybiBNb2R1bGUuZmxhc2hTaXplOyByZXR1cm4gMTI4ICogMTAyNDsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaFNhdmUpIE1vZHVsZS5mbGFzaFNhdmUoSEVBUFU4LnNsaWNlKHN0YXJ0LCBzdGFydCArIHNpemUpKTsgfQAodm9pZCAqc3RhcnQsIHVuc2lnbmVkIHNpemUpPDo6PnsgaWYgKE1vZHVsZS5mbGFzaExvYWQpIHsgY29uc3QgZGF0YSA9IE1vZHVsZS5mbGFzaExvYWQoKTsgaWYgKE1vZHVsZS5kbWVzZykgTW9kdWxlLmRtZXNnKCJmbGFzaCBsb2FkLCBzaXplPSIgKyBkYXRhLmxlbmd0aCk7IEhFQVBVOC5zZXQoZGF0YS5zbGljZSgwLCBzaXplKSwgc3RhcnQpOyB9IH0AKHZvaWQgKmZyYW1lKTw6Oj57IGNvbnN0IHN6ID0gMTIgKyBIRUFQVThbZnJhbWUgKyAyXTsgY29uc3QgcGt0ID0gSEVBUFU4LnNsaWNlKGZyYW1lLCBmcmFtZSArIHN6KTsgTW9kdWxlLnNlbmRQYWNrZXQocGt0KSB9AChpbnQgZXhpdGNvZGUpPDo6PnsgaWYgKGV4aXRjb2RlKSBjb25zb2xlLmxvZygiUEFOSUMiLCBleGl0Y29kZSk7IGlmIChNb2R1bGUucGFuaWNIYW5kbGVyKSBNb2R1bGUucGFuaWNIYW5kbGVyKGV4aXRjb2RlKTsgfQAoY29uc3Qgdm9pZCAqZnJhbWUsIHVuc2lnbmVkIHN6KTw6Oj57IGNvbnN0IHBrdCA9IEhFQVBVOC5zbGljZShmcmFtZSwgZnJhbWUgKyBzeik7IE1vZHVsZS5zZW5kUGFja2V0KHBrdCkgfQAoaW50IGV4aXRjb2RlKTw6Oj57IGlmIChNb2R1bGUuZGVwbG95SGFuZGxlcikgTW9kdWxlLmRlcGxveUhhbmRsZXIoZXhpdGNvZGUpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBEYXRlLm5vdygpOyB9ACh1aW50OF90ICogdHJnLCB1bnNpZ25lZCBzaXplKTw6Oj57IGxldCBidWYgPSBuZXcgVWludDhBcnJheShzaXplKTsgaWYgKHR5cGVvZiB3aW5kb3cgPT0gIm9iamVjdCIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnVmKTsgZWxzZSB7IGJ1ZiA9IHJlcXVpcmUoImNyeXB0byIpLnJhbmRvbUJ5dGVzKHNpemUpOyB9IEhFQVBVOC5zZXQoYnVmLCB0cmcpOyB9AChjb25zdCBjaGFyICpwdHIpPDo6PnsgY29uc3QgcyA9IFVURjhUb1N0cmluZyhwdHIsIDEwMjQpOyBpZiAoTW9kdWxlLmRtZXNnKSBNb2R1bGUuZG1lc2cocyk7IGVsc2UgY29uc29sZS5kZWJ1ZyhzKTsgfQAoY29uc3QgY2hhciAqaG9zdG5hbWUsIGludCBwb3J0KTw6Oj57IHJldHVybiBNb2R1bGUuc29ja09wZW4oaG9zdG5hbWUsIHBvcnQpOyB9AChjb25zdCB2b2lkICpidWYsIHVuc2lnbmVkIHNpemUpPDo6PnsgcmV0dXJuIE1vZHVsZS5zb2NrV3JpdGUoYnVmLCBzaXplKTsgfQAodm9pZCk8Ojo+eyByZXR1cm4gTW9kdWxlLnNvY2tDbG9zZSgpOyB9ACh2b2lkKTw6Oj57IHJldHVybiBNb2R1bGUuc29ja0lzQXZhaWxhYmxlKCk7IH0AAKmKgYAABG5hbWUBuIkBhwcADWVtX2ZsYXNoX3NhdmUBDWVtX2ZsYXNoX3NpemUCDWVtX2ZsYXNoX2xvYWQDBWFib3J0BBNlbV9zZW5kX2xhcmdlX2ZyYW1lBRNfZGV2c19wYW5pY19oYW5kbGVyBhFlbV9kZXBsb3lfaGFuZGxlcgcXZW1famRfY3J5cHRvX2dldF9yYW5kb20IDWVtX3NlbmRfZnJhbWUJBGV4aXQKC2VtX3RpbWVfbm93Cw5lbV9wcmludF9kbWVzZwwPX2pkX3RjcHNvY2tfbmV3DRFfamRfdGNwc29ja193cml0ZQ4RX2pkX3RjcHNvY2tfY2xvc2UPGF9qZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsVEV9fd2FzbV9jYWxsX2N0b3JzFg9mbGFzaF9iYXNlX2FkZHIXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGgpmbGFzaF9pbml0Gwhod19wYW5pYxwIamRfYmxpbmsdB2pkX2dsb3ceFGpkX2FsbG9jX3N0YWNrX2NoZWNrHwhqZF9hbGxvYyAHamRfZnJlZSENdGFyZ2V0X2luX2lycSISdGFyZ2V0X2Rpc2FibGVfaXJxIxF0YXJnZXRfZW5hYmxlX2lycSQYamRfZGV2aWNlX2lkX2Zyb21fc3RyaW5nJRVkZXZzX3NlbmRfbGFyZ2VfZnJhbWUmEmRldnNfcGFuaWNfaGFuZGxlcicTZGV2c19kZXBsb3lfaGFuZGxlcigUamRfY3J5cHRvX2dldF9yYW5kb20pEGpkX2VtX3NlbmRfZnJhbWUqGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKxpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZywKamRfZW1faW5pdC0NamRfZW1fcHJvY2Vzcy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95MhtqZF9lbV9kZXZzX2VuYWJsZV9nY19zdHJlc3MzDGh3X2RldmljZV9pZDQMdGFyZ2V0X3Jlc2V0NQ50aW1fZ2V0X21pY3JvczYPYXBwX3ByaW50X2RtZXNnNxJqZF90Y3Bzb2NrX3Byb2Nlc3M4EWFwcF9pbml0X3NlcnZpY2VzORJkZXZzX2NsaWVudF9kZXBsb3k6FGNsaWVudF9ldmVudF9oYW5kbGVyOwlhcHBfZG1lc2c8C2ZsdXNoX2RtZXNnPQthcHBfcHJvY2Vzcz4OamRfdGNwc29ja19uZXc/EGpkX3RjcHNvY2tfd3JpdGVAEGpkX3RjcHNvY2tfY2xvc2VBF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlQhZqZF9lbV90Y3Bzb2NrX29uX2V2ZW50Qwd0eF9pbml0RA9qZF9wYWNrZXRfcmVhZHlFCnR4X3Byb2Nlc3NGDXR4X3NlbmRfZnJhbWVHDmRldnNfYnVmZmVyX29wSBJkZXZzX2J1ZmZlcl9kZWNvZGVJEmRldnNfYnVmZmVyX2VuY29kZUoPZGV2c19jcmVhdGVfY3R4SwlzZXR1cF9jdHhMCmRldnNfdHJhY2VND2RldnNfZXJyb3JfY29kZU4ZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlck8JY2xlYXJfY3R4UA1kZXZzX2ZyZWVfY3R4UQhkZXZzX29vbVIJZGV2c19mcmVlUxFkZXZzY2xvdWRfcHJvY2Vzc1QXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRVEGRldnNjbG91ZF91cGxvYWRWFGRldnNjbG91ZF9vbl9tZXNzYWdlVw5kZXZzY2xvdWRfaW5pdFgUZGV2c190cmFja19leGNlcHRpb25ZD2RldnNkYmdfcHJvY2Vzc1oRZGV2c2RiZ19yZXN0YXJ0ZWRbFWRldnNkYmdfaGFuZGxlX3BhY2tldFwLc2VuZF92YWx1ZXNdEXZhbHVlX2Zyb21fdGFnX3YwXhlkZXZzZGJnX29wZW5fcmVzdWx0c19waXBlXw1vYmpfZ2V0X3Byb3BzYAxleHBhbmRfdmFsdWVhEmRldnNkYmdfc3VzcGVuZF9jYmIMZGV2c2RiZ19pbml0YxBleHBhbmRfa2V5X3ZhbHVlZAZrdl9hZGRlD2RldnNtZ3JfcHJvY2Vzc2YHdHJ5X3J1bmcHcnVuX2ltZ2gMc3RvcF9wcm9ncmFtaQ9kZXZzbWdyX3Jlc3RhcnRqFGRldnNtZ3JfZGVwbG95X3N0YXJ0axRkZXZzbWdyX2RlcGxveV93cml0ZWwQZGV2c21ncl9nZXRfaGFzaG0VZGV2c21ncl9oYW5kbGVfcGFja2V0bg5kZXBsb3lfaGFuZGxlcm8TZGVwbG95X21ldGFfaGFuZGxlcnAPZGV2c21ncl9nZXRfY3R4cQ5kZXZzbWdyX2RlcGxveXIMZGV2c21ncl9pbml0cxFkZXZzbWdyX2NsaWVudF9ldnQWZGV2c19zZXJ2aWNlX2Z1bGxfaW5pdHUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9udgpkZXZzX3BhbmljdxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV4EGRldnNfZmliZXJfc2xlZXB5G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN7EWRldnNfaW1nX2Z1bl9uYW1lfBFkZXZzX2ZpYmVyX2J5X3RhZ30QZGV2c19maWJlcl9zdGFydH4UZGV2c19maWJlcl90ZXJtaWFudGV/DmRldnNfZmliZXJfcnVugAETZGV2c19maWJlcl9zeW5jX25vd4EBFV9kZXZzX2ludmFsaWRfcHJvZ3JhbYIBGGRldnNfZmliZXJfZ2V0X21heF9zbGVlcIMBD2RldnNfZmliZXJfcG9rZYQBEWRldnNfZ2NfYWRkX2NodW5rhQEWZGV2c19nY19vYmpfY2hlY2tfY29yZYYBE2pkX2djX2FueV90cnlfYWxsb2OHAQdkZXZzX2djiAEPZmluZF9mcmVlX2Jsb2NriQESZGV2c19hbnlfdHJ5X2FsbG9jigEOZGV2c190cnlfYWxsb2OLAQtqZF9nY191bnBpbowBCmpkX2djX2ZyZWWNARRkZXZzX3ZhbHVlX2lzX3Bpbm5lZI4BDmRldnNfdmFsdWVfcGlujwEQZGV2c192YWx1ZV91bnBpbpABEmRldnNfbWFwX3RyeV9hbGxvY5EBGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY5IBFGRldnNfYXJyYXlfdHJ5X2FsbG9jkwEaZGV2c19idWZmZXJfdHJ5X2FsbG9jX2luaXSUARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OVARVkZXZzX3N0cmluZ190cnlfYWxsb2OWARBkZXZzX3N0cmluZ19wcmVwlwESZGV2c19zdHJpbmdfZmluaXNomAEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSZAQ9kZXZzX2djX3NldF9jdHiaAQ5kZXZzX2djX2NyZWF0ZZsBD2RldnNfZ2NfZGVzdHJveZwBEWRldnNfZ2Nfb2JqX2NoZWNrnQEOZGV2c19kdW1wX2hlYXCeAQtzY2FuX2djX29iap8BEXByb3BfQXJyYXlfbGVuZ3RooAESbWV0aDJfQXJyYXlfaW5zZXJ0oQESZnVuMV9BcnJheV9pc0FycmF5ogEUbWV0aFhfQXJyYXlfX19jdG9yX1+jARBtZXRoWF9BcnJheV9wdXNopAEVbWV0aDFfQXJyYXlfcHVzaFJhbmdlpQERbWV0aFhfQXJyYXlfc2xpY2WmARBtZXRoMV9BcnJheV9qb2lupwERZnVuMV9CdWZmZXJfYWxsb2OoARBmdW4yX0J1ZmZlcl9mcm9tqQEScHJvcF9CdWZmZXJfbGVuZ3RoqgEVbWV0aDFfQnVmZmVyX3RvU3RyaW5nqwETbWV0aDNfQnVmZmVyX2ZpbGxBdKwBE21ldGg0X0J1ZmZlcl9ibGl0QXStARRtZXRoM19CdWZmZXJfaW5kZXhPZq4BF21ldGgwX0J1ZmZlcl9maWxsUmFuZG9trwEUbWV0aDRfQnVmZmVyX2VuY3J5cHSwARJmdW4zX0J1ZmZlcl9kaWdlc3SxARRkZXZzX2NvbXB1dGVfdGltZW91dLIBF2Z1bjFfRGV2aWNlU2NyaXB0X3NsZWVwswEXZnVuMV9EZXZpY2VTY3JpcHRfZGVsYXm0ARhmdW4xX0RldmljZVNjcmlwdF9fcGFuaWO1ARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3S2ARlmdW4wX0RldmljZVNjcmlwdF9yZXN0YXJ0twEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0uAEXZnVuMl9EZXZpY2VTY3JpcHRfcHJpbnS5ARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0ugEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnS7ARpmdW4yX0RldmljZVNjcmlwdF9fbG9nUmVwcrwBHWZ1bjFfRGV2aWNlU2NyaXB0X19kY2ZnU3RyaW5nvQEYZnVuMF9EZXZpY2VTY3JpcHRfbWlsbGlzvgEiZnVuMV9EZXZpY2VTY3JpcHRfZGV2aWNlSWRlbnRpZmllcr8BHWZ1bjJfRGV2aWNlU2NyaXB0X19zZXJ2ZXJTZW5kwAEcZnVuMl9EZXZpY2VTY3JpcHRfX2FsbG9jUm9sZcEBIGZ1bjBfRGV2aWNlU2NyaXB0X25vdEltcGxlbWVudGVkwgEeZnVuMl9EZXZpY2VTY3JpcHRfX3R3aW5NZXNzYWdlwwEhZnVuM19EZXZpY2VTY3JpcHRfX2kyY1RyYW5zYWN0aW9uxAEeZnVuMl9EZXZpY2VTY3JpcHRfbGVkU3RyaXBTZW5kxQEeZnVuNV9EZXZpY2VTY3JpcHRfc3BpQ29uZmlndXJlxgEZZnVuMl9EZXZpY2VTY3JpcHRfc3BpWGZlcscBHmZ1bjNfRGV2aWNlU2NyaXB0X3NwaVNlbmRJbWFnZcgBFG1ldGgxX0Vycm9yX19fY3Rvcl9fyQEZbWV0aDFfUmFuZ2VFcnJvcl9fX2N0b3JfX8oBGG1ldGgxX1R5cGVFcnJvcl9fX2N0b3JfX8sBGm1ldGgxX1N5bnRheEVycm9yX19fY3Rvcl9fzAEPcHJvcF9FcnJvcl9uYW1lzQERbWV0aDBfRXJyb3JfcHJpbnTOAQ9wcm9wX0RzRmliZXJfaWTPARZwcm9wX0RzRmliZXJfc3VzcGVuZGVk0AEUbWV0aDFfRHNGaWJlcl9yZXN1bWXRARdtZXRoMF9Ec0ZpYmVyX3Rlcm1pbmF0ZdIBGWZ1bjFfRGV2aWNlU2NyaXB0X3N1c3BlbmTTARFmdW4wX0RzRmliZXJfc2VsZtQBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ01QEXcHJvcF9GdW5jdGlvbl9wcm90b3R5cGXWARJwcm9wX0Z1bmN0aW9uX25hbWXXARNkZXZzX2dwaW9faW5pdF9kY2Zn2AEJaW5pdF91c2Vk2QEOcHJvcF9HUElPX21vZGXaARZwcm9wX0dQSU9fY2FwYWJpbGl0aWVz2wEPcHJvcF9HUElPX3ZhbHVl3AESbWV0aDFfR1BJT19zZXRNb2Rl3QEQcHJvcF9JbWFnZV93aWR0aN4BEXByb3BfSW1hZ2VfaGVpZ2h03wEOcHJvcF9JbWFnZV9icHDgARFwcm9wX0ltYWdlX2J1ZmZlcuEBEGZ1bjVfSW1hZ2VfYWxsb2PiAQ9tZXRoM19JbWFnZV9zZXTjAQxkZXZzX2FyZ19pbWfkAQdzZXRDb3Jl5QEPbWV0aDJfSW1hZ2VfZ2V05gEQbWV0aDFfSW1hZ2VfZmlsbOcBCWZpbGxfcmVjdOgBFG1ldGg1X0ltYWdlX2ZpbGxSZWN06QESbWV0aDFfSW1hZ2VfZXF1YWxz6gERbWV0aDBfSW1hZ2VfY2xvbmXrAQ1hbGxvY19pbWdfcmV07AERbWV0aDBfSW1hZ2VfZmxpcFjtAQdwaXhfcHRy7gERbWV0aDBfSW1hZ2VfZmxpcFnvARZtZXRoMF9JbWFnZV90cmFuc3Bvc2Vk8AEVbWV0aDNfSW1hZ2VfZHJhd0ltYWdl8QENZGV2c19hcmdfaW1nMvIBDWRyYXdJbWFnZUNvcmXzASBtZXRoNF9JbWFnZV9kcmF3VHJhbnNwYXJlbnRJbWFnZfQBGG1ldGgzX0ltYWdlX292ZXJsYXBzV2l0aPUBFG1ldGg1X0ltYWdlX2RyYXdMaW5l9gEIZHJhd0xpbmX3ARNtYWtlX3dyaXRhYmxlX2ltYWdl+AELZHJhd0xpbmVMb3f5AQxkcmF3TGluZUhpZ2j6ARNtZXRoNV9JbWFnZV9ibGl0Um93+wERbWV0aDExX0ltYWdlX2JsaXT8ARZtZXRoNF9JbWFnZV9maWxsQ2lyY2xl/QEPZnVuMl9KU09OX3BhcnNl/gETZnVuM19KU09OX3N0cmluZ2lmef8BDmZ1bjFfTWF0aF9jZWlsgAIPZnVuMV9NYXRoX2Zsb29ygQIPZnVuMV9NYXRoX3JvdW5kggINZnVuMV9NYXRoX2Fic4MCEGZ1bjBfTWF0aF9yYW5kb22EAhNmdW4xX01hdGhfcmFuZG9tSW50hQINZnVuMV9NYXRoX2xvZ4YCDWZ1bjJfTWF0aF9wb3eHAg5mdW4yX01hdGhfaWRpdogCDmZ1bjJfTWF0aF9pbW9kiQIOZnVuMl9NYXRoX2ltdWyKAg1mdW4yX01hdGhfbWluiwILZnVuMl9taW5tYXiMAg1mdW4yX01hdGhfbWF4jQISZnVuMl9PYmplY3RfYXNzaWdujgIQZnVuMV9PYmplY3Rfa2V5c48CE2Z1bjFfa2V5c19vcl92YWx1ZXOQAhJmdW4xX09iamVjdF92YWx1ZXORAhpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZpICFW1ldGgxX09iamVjdF9fX2N0b3JfX5MCHWRldnNfdmFsdWVfdG9fcGFja2V0X29yX3Rocm93lAIScHJvcF9Ec1BhY2tldF9yb2xllQIecHJvcF9Ec1BhY2tldF9kZXZpY2VJZGVudGlmaWVylgIVcHJvcF9Ec1BhY2tldF9zaG9ydElklwIacHJvcF9Ec1BhY2tldF9zZXJ2aWNlSW5kZXiYAhxwcm9wX0RzUGFja2V0X3NlcnZpY2VDb21tYW5kmQITcHJvcF9Ec1BhY2tldF9mbGFnc5oCF3Byb3BfRHNQYWNrZXRfaXNDb21tYW5kmwIWcHJvcF9Ec1BhY2tldF9pc1JlcG9ydJwCFXByb3BfRHNQYWNrZXRfcGF5bG9hZJ0CFXByb3BfRHNQYWNrZXRfaXNFdmVudJ4CF3Byb3BfRHNQYWNrZXRfZXZlbnRDb2RlnwIWcHJvcF9Ec1BhY2tldF9pc1JlZ1NldKACFnByb3BfRHNQYWNrZXRfaXNSZWdHZXShAhVwcm9wX0RzUGFja2V0X3JlZ0NvZGWiAhZwcm9wX0RzUGFja2V0X2lzQWN0aW9uowIVZGV2c19wa3Rfc3BlY19ieV9jb2RlpAIScHJvcF9Ec1BhY2tldF9zcGVjpQIRZGV2c19wa3RfZ2V0X3NwZWOmAhVtZXRoMF9Ec1BhY2tldF9kZWNvZGWnAh1tZXRoMF9Ec1BhY2tldF9ub3RJbXBsZW1lbnRlZKgCGHByb3BfRHNQYWNrZXRTcGVjX3BhcmVudKkCFnByb3BfRHNQYWNrZXRTcGVjX25hbWWqAhZwcm9wX0RzUGFja2V0U3BlY19jb2RlqwIacHJvcF9Ec1BhY2tldFNwZWNfcmVzcG9uc2WsAhltZXRoWF9Ec1BhY2tldFNwZWNfZW5jb2RlrQISZGV2c19wYWNrZXRfZGVjb2RlrgIVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkrwIURHNSZWdpc3Rlcl9yZWFkX2NvbnSwAhJkZXZzX3BhY2tldF9lbmNvZGWxAhZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlsgIWcHJvcF9Ec1BhY2tldEluZm9fcm9sZbMCFnByb3BfRHNQYWNrZXRJbmZvX25hbWW0AhZwcm9wX0RzUGFja2V0SW5mb19jb2RltQIYbWV0aFhfRHNDb21tYW5kX19fZnVuY19ftgITcHJvcF9Ec1JvbGVfaXNCb3VuZLcCEHByb3BfRHNSb2xlX3NwZWO4AhhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmS5AiJwcm9wX0RzU2VydmljZVNwZWNfY2xhc3NJZGVudGlmaWVyugIXcHJvcF9Ec1NlcnZpY2VTcGVjX25hbWW7AhptZXRoMV9Ec1NlcnZpY2VTcGVjX2xvb2t1cLwCGm1ldGgxX0RzU2VydmljZVNwZWNfYXNzaWduvQIdZnVuMl9EZXZpY2VTY3JpcHRfX3NvY2tldE9wZW6+AhB0Y3Bzb2NrX29uX2V2ZW50vwIeZnVuMF9EZXZpY2VTY3JpcHRfX3NvY2tldENsb3NlwAIeZnVuMV9EZXZpY2VTY3JpcHRfX3NvY2tldFdyaXRlwQIScHJvcF9TdHJpbmdfbGVuZ3RowgIWcHJvcF9TdHJpbmdfYnl0ZUxlbmd0aMMCF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0xAITbWV0aDFfU3RyaW5nX2NoYXJBdMUCEm1ldGgyX1N0cmluZ19zbGljZcYCGGZ1blhfU3RyaW5nX2Zyb21DaGFyQ29kZccCFG1ldGgzX1N0cmluZ19pbmRleE9myAIYbWV0aDBfU3RyaW5nX3RvTG93ZXJDYXNlyQITbWV0aDBfU3RyaW5nX3RvQ2FzZcoCGG1ldGgwX1N0cmluZ190b1VwcGVyQ2FzZcsCDGRldnNfaW5zcGVjdMwCC2luc3BlY3Rfb2JqzQIHYWRkX3N0cs4CDWluc3BlY3RfZmllbGTPAhRkZXZzX2pkX2dldF9yZWdpc3RlctACFmRldnNfamRfY2xlYXJfcGt0X2tpbmTRAhBkZXZzX2pkX3NlbmRfY21k0gIQZGV2c19qZF9zZW5kX3Jhd9MCE2RldnNfamRfc2VuZF9sb2dtc2fUAhNkZXZzX2pkX3BrdF9jYXB0dXJl1QIRZGV2c19qZF93YWtlX3JvbGXWAhJkZXZzX2pkX3Nob3VsZF9ydW7XAhNkZXZzX2pkX3Byb2Nlc3NfcGt02AIYZGV2c19qZF9zZXJ2ZXJfZGV2aWNlX2lk2QIXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXaAhJkZXZzX2pkX2FmdGVyX3VzZXLbAhRkZXZzX2pkX3JvbGVfY2hhbmdlZNwCFGRldnNfamRfcmVzZXRfcGFja2V03QISZGV2c19qZF9pbml0X3JvbGVz3gISZGV2c19qZF9mcmVlX3JvbGVz3wISZGV2c19qZF9hbGxvY19yb2xl4AIVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz4QIXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3PiAhVkZXZzX2dldF9nbG9iYWxfZmxhZ3PjAg9qZF9uZWVkX3RvX3NlbmTkAhBkZXZzX2pzb25fZXNjYXBl5QIVZGV2c19qc29uX2VzY2FwZV9jb3Jl5gIPZGV2c19qc29uX3BhcnNl5wIKanNvbl92YWx1ZegCDHBhcnNlX3N0cmluZ+kCE2RldnNfanNvbl9zdHJpbmdpZnnqAg1zdHJpbmdpZnlfb2Jq6wIRcGFyc2Vfc3RyaW5nX2NvcmXsAgphZGRfaW5kZW507QIPc3RyaW5naWZ5X2ZpZWxk7gIRZGV2c19tYXBsaWtlX2l0ZXLvAhdkZXZzX2dldF9idWlsdGluX29iamVjdPACEmRldnNfbWFwX2NvcHlfaW50b/ECDGRldnNfbWFwX3NldPICBmxvb2t1cPMCE2RldnNfbWFwbGlrZV9pc19tYXD0AhtkZXZzX21hcGxpa2Vfa2V5c19vcl92YWx1ZXP1AhFkZXZzX2FycmF5X2luc2VydPYCCGt2X2FkZC4x9wISZGV2c19zaG9ydF9tYXBfc2V0+AIPZGV2c19tYXBfZGVsZXRl+QISZGV2c19zaG9ydF9tYXBfZ2V0+gIgZGV2c192YWx1ZV9mcm9tX3NlcnZpY2Vfc3BlY19pZHj7AhxkZXZzX3ZhbHVlX2Zyb21fc2VydmljZV9zcGVj/AIbZGV2c192YWx1ZV9mcm9tX3BhY2tldF9zcGVj/QIeZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWNfaWR4/gIaZGV2c192YWx1ZV90b19zZXJ2aWNlX3NwZWP/AhdkZXZzX2RlY29kZV9yb2xlX3BhY2tldIADGGRldnNfcm9sZV9zcGVjX2Zvcl9jbGFzc4EDF2RldnNfcGFja2V0X3NwZWNfcGFyZW50ggMOZGV2c19yb2xlX3NwZWODAxFkZXZzX3JvbGVfc2VydmljZYQDDmRldnNfcm9sZV9uYW1lhQMSZGV2c19nZXRfYmFzZV9zcGVjhgMQZGV2c19zcGVjX2xvb2t1cIcDEmRldnNfZnVuY3Rpb25fYmluZIgDEWRldnNfbWFrZV9jbG9zdXJliQMOZGV2c19nZXRfZm5pZHiKAxNkZXZzX2dldF9mbmlkeF9jb3JliwMYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkjAMYZGV2c19tYXBsaWtlX2dldF9ub19iaW5kjQMTZGV2c19nZXRfc3BlY19wcm90b44DE2RldnNfZ2V0X3JvbGVfcHJvdG+PAxtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcneQAxVkZXZzX2dldF9zdGF0aWNfcHJvdG+RAxtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcm+SAx1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bZMDFmRldnNfbWFwbGlrZV9nZXRfcHJvdG+UAxhkZXZzX2dldF9wcm90b3R5cGVfZmllbGSVAx5kZXZzX29iamVjdF9nZXRfYnVpbHRfaW5fZmllbGSWAxBkZXZzX2luc3RhbmNlX29mlwMPZGV2c19vYmplY3RfZ2V0mAMMZGV2c19zZXFfZ2V0mQMMZGV2c19hbnlfZ2V0mgMMZGV2c19hbnlfc2V0mwMMZGV2c19zZXFfc2V0nAMOZGV2c19hcnJheV9zZXSdAxNkZXZzX2FycmF5X3Bpbl9wdXNongMRZGV2c19hcmdfaW50X2RlZmyfAwxkZXZzX2FyZ19pbnSgAw1kZXZzX2FyZ19ib29soQMPZGV2c19hcmdfZG91YmxlogMPZGV2c19yZXRfZG91YmxlowMMZGV2c19yZXRfaW50pAMNZGV2c19yZXRfYm9vbKUDD2RldnNfcmV0X2djX3B0cqYDEWRldnNfYXJnX3NlbGZfbWFwpwMRZGV2c19zZXR1cF9yZXN1bWWoAw9kZXZzX2Nhbl9hdHRhY2ipAxlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlqgMVZGV2c19tYXBsaWtlX3RvX3ZhbHVlqwMSZGV2c19yZWdjYWNoZV9mcmVlrAMWZGV2c19yZWdjYWNoZV9mcmVlX2FsbK0DF2RldnNfcmVnY2FjaGVfbWFya191c2VkrgMTZGV2c19yZWdjYWNoZV9hbGxvY68DFGRldnNfcmVnY2FjaGVfbG9va3VwsAMRZGV2c19yZWdjYWNoZV9hZ2WxAxdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZbIDEmRldnNfcmVnY2FjaGVfbmV4dLMDD2pkX3NldHRpbmdzX2dldLQDD2pkX3NldHRpbmdzX3NldLUDDmRldnNfbG9nX3ZhbHVltgMPZGV2c19zaG93X3ZhbHVltwMQZGV2c19zaG93X3ZhbHVlMLgDDWNvbnN1bWVfY2h1bmu5Aw1zaGFfMjU2X2Nsb3NlugMPamRfc2hhMjU2X3NldHVwuwMQamRfc2hhMjU2X3VwZGF0ZbwDEGpkX3NoYTI1Nl9maW5pc2i9AxRqZF9zaGEyNTZfaG1hY19zZXR1cL4DFWpkX3NoYTI1Nl9obWFjX3VwZGF0Zb8DFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaMADDmpkX3NoYTI1Nl9oa2RmwQMOZGV2c19zdHJmb3JtYXTCAw5kZXZzX2lzX3N0cmluZ8MDDmRldnNfaXNfbnVtYmVyxAMbZGV2c19zdHJpbmdfZ2V0X3V0Zjhfc3RydWN0xQMUZGV2c19zdHJpbmdfZ2V0X3V0ZjjGAxNkZXZzX2J1aWx0aW5fc3RyaW5nxwMUZGV2c19zdHJpbmdfdnNwcmludGbIAxNkZXZzX3N0cmluZ19zcHJpbnRmyQMVZGV2c19zdHJpbmdfZnJvbV91dGY4ygMUZGV2c192YWx1ZV90b19zdHJpbmfLAxBidWZmZXJfdG9fc3RyaW5nzAMZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZM0DEmRldnNfc3RyaW5nX2NvbmNhdM4DEWRldnNfc3RyaW5nX3NsaWNlzwMSZGV2c19wdXNoX3RyeWZyYW1l0AMRZGV2c19wb3BfdHJ5ZnJhbWXRAw9kZXZzX2R1bXBfc3RhY2vSAxNkZXZzX2R1bXBfZXhjZXB0aW9u0wMKZGV2c190aHJvd9QDEmRldnNfcHJvY2Vzc190aHJvd9UDEGRldnNfYWxsb2NfZXJyb3LWAxVkZXZzX3Rocm93X3R5cGVfZXJyb3LXAxhkZXZzX3Rocm93X2dlbmVyaWNfZXJyb3LYAxZkZXZzX3Rocm93X3JhbmdlX2Vycm9y2QMeZGV2c190aHJvd19ub3Rfc3VwcG9ydGVkX2Vycm9y2gMaZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3LbAx5kZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcl9leHTcAxhkZXZzX3Rocm93X3Rvb19iaWdfZXJyb3LdAxdkZXZzX3Rocm93X3N5bnRheF9lcnJvct4DEWRldnNfc3RyaW5nX2luZGV43wMSZGV2c19zdHJpbmdfbGVuZ3Ro4AMZZGV2c191dGY4X2Zyb21fY29kZV9wb2ludOEDG2RldnNfdXRmOF9jb2RlX3BvaW50X2xlbmd0aOIDFGRldnNfdXRmOF9jb2RlX3BvaW504wMUZGV2c19zdHJpbmdfam1wX2luaXTkAw5kZXZzX3V0ZjhfaW5pdOUDFmRldnNfdmFsdWVfZnJvbV9kb3VibGXmAxNkZXZzX3ZhbHVlX2Zyb21faW505wMUZGV2c192YWx1ZV9mcm9tX2Jvb2zoAxdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcukDFGRldnNfdmFsdWVfdG9fZG91Ymxl6gMRZGV2c192YWx1ZV90b19pbnTrAxJkZXZzX3ZhbHVlX3RvX2Jvb2zsAw5kZXZzX2lzX2J1ZmZlcu0DF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl7gMQZGV2c19idWZmZXJfZGF0Ye8DE2RldnNfYnVmZmVyaXNoX2RhdGHwAxRkZXZzX3ZhbHVlX3RvX2djX29iavEDDWRldnNfaXNfYXJyYXnyAxFkZXZzX3ZhbHVlX3R5cGVvZvMDD2RldnNfaXNfbnVsbGlzaPQDGWRldnNfaXNfbnVsbF9vcl91bmRlZmluZWT1AxRkZXZzX3ZhbHVlX2FwcHJveF9lcfYDEmRldnNfdmFsdWVfaWVlZV9lcfcDDWRldnNfdmFsdWVfZXH4AxxkZXZzX3ZhbHVlX2VxX2J1aWx0aW5fc3RyaW5n+QMeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj+gMSZGV2c19pbWdfc3RyaWR4X29r+wMSZGV2c19kdW1wX3ZlcnNpb25z/AMLZGV2c192ZXJpZnn9AxFkZXZzX2ZldGNoX29wY29kZf4DDmRldnNfdm1fcmVzdW1l/wMRZGV2c192bV9zZXRfZGVidWeABBlkZXZzX3ZtX2NsZWFyX2JyZWFrcG9pbnRzgQQYZGV2c192bV9jbGVhcl9icmVha3BvaW50ggQMZGV2c192bV9oYWx0gwQPZGV2c192bV9zdXNwZW5khAQWZGV2c192bV9zZXRfYnJlYWtwb2ludIUEFGRldnNfdm1fZXhlY19vcGNvZGVzhgQPZGV2c19pbl92bV9sb29whwQaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHiIBBdkZXZzX2ltZ19nZXRfc3RyaW5nX2ptcIkEEWRldnNfaW1nX2dldF91dGY4igQUZGV2c19nZXRfc3RhdGljX3V0ZjiLBBRkZXZzX3ZhbHVlX2J1ZmZlcmlzaIwEDGV4cHJfaW52YWxpZI0EFGV4cHJ4X2J1aWx0aW5fb2JqZWN0jgQLc3RtdDFfY2FsbDCPBAtzdG10Ml9jYWxsMZAEC3N0bXQzX2NhbGwykQQLc3RtdDRfY2FsbDOSBAtzdG10NV9jYWxsNJMEC3N0bXQ2X2NhbGw1lAQLc3RtdDdfY2FsbDaVBAtzdG10OF9jYWxsN5YEC3N0bXQ5X2NhbGw4lwQSc3RtdDJfaW5kZXhfZGVsZXRlmAQMc3RtdDFfcmV0dXJumQQJc3RtdHhfam1wmgQMc3RtdHgxX2ptcF96mwQKZXhwcjJfYmluZJwEEmV4cHJ4X29iamVjdF9maWVsZJ0EEnN0bXR4MV9zdG9yZV9sb2NhbJ4EE3N0bXR4MV9zdG9yZV9nbG9iYWyfBBJzdG10NF9zdG9yZV9idWZmZXKgBAlleHByMF9pbmahBBBleHByeF9sb2FkX2xvY2FsogQRZXhwcnhfbG9hZF9nbG9iYWyjBAtleHByMV91cGx1c6QEC2V4cHIyX2luZGV4pQQPc3RtdDNfaW5kZXhfc2V0pgQUZXhwcngxX2J1aWx0aW5fZmllbGSnBBJleHByeDFfYXNjaWlfZmllbGSoBBFleHByeDFfdXRmOF9maWVsZKkEEGV4cHJ4X21hdGhfZmllbGSqBA5leHByeF9kc19maWVsZKsED3N0bXQwX2FsbG9jX21hcKwEEXN0bXQxX2FsbG9jX2FycmF5rQQSc3RtdDFfYWxsb2NfYnVmZmVyrgQXZXhwcnhfc3RhdGljX3NwZWNfcHJvdG+vBBNleHByeF9zdGF0aWNfYnVmZmVysAQbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nsQQZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ7IEGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ7MEFWV4cHJ4X3N0YXRpY19mdW5jdGlvbrQEDWV4cHJ4X2xpdGVyYWy1BBFleHByeF9saXRlcmFsX2Y2NLYEEWV4cHIzX2xvYWRfYnVmZmVytwQNZXhwcjBfcmV0X3ZhbLgEDGV4cHIxX3R5cGVvZrkED2V4cHIwX3VuZGVmaW5lZLoEEmV4cHIxX2lzX3VuZGVmaW5lZLsECmV4cHIwX3RydWW8BAtleHByMF9mYWxzZb0EDWV4cHIxX3RvX2Jvb2y+BAlleHByMF9uYW6/BAlleHByMV9hYnPABA1leHByMV9iaXRfbm90wQQMZXhwcjFfaXNfbmFuwgQJZXhwcjFfbmVnwwQJZXhwcjFfbm90xAQMZXhwcjFfdG9faW50xQQJZXhwcjJfYWRkxgQJZXhwcjJfc3VixwQJZXhwcjJfbXVsyAQJZXhwcjJfZGl2yQQNZXhwcjJfYml0X2FuZMoEDGV4cHIyX2JpdF9vcssEDWV4cHIyX2JpdF94b3LMBBBleHByMl9zaGlmdF9sZWZ0zQQRZXhwcjJfc2hpZnRfcmlnaHTOBBpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZM8ECGV4cHIyX2Vx0AQIZXhwcjJfbGXRBAhleHByMl9sdNIECGV4cHIyX25l0wQQZXhwcjFfaXNfbnVsbGlzaNQEFHN0bXR4Ml9zdG9yZV9jbG9zdXJl1QQTZXhwcngxX2xvYWRfY2xvc3VyZdYEEmV4cHJ4X21ha2VfY2xvc3VyZdcEEGV4cHIxX3R5cGVvZl9zdHLYBBNzdG10eF9qbXBfcmV0X3ZhbF962QQQc3RtdDJfY2FsbF9hcnJhedoECXN0bXR4X3RyedsEDXN0bXR4X2VuZF90cnncBAtzdG10MF9jYXRjaN0EDXN0bXQwX2ZpbmFsbHneBAtzdG10MV90aHJvd98EDnN0bXQxX3JlX3Rocm934AQQc3RtdHgxX3Rocm93X2ptcOEEDnN0bXQwX2RlYnVnZ2Vy4gQJZXhwcjFfbmV34wQRZXhwcjJfaW5zdGFuY2Vfb2bkBApleHByMF9udWxs5QQPZXhwcjJfYXBwcm94X2Vx5gQPZXhwcjJfYXBwcm94X25l5wQTc3RtdDFfc3RvcmVfcmV0X3ZhbOgEEWV4cHJ4X3N0YXRpY19zcGVj6QQPZGV2c192bV9wb3BfYXJn6gQTZGV2c192bV9wb3BfYXJnX3UzMusEE2RldnNfdm1fcG9wX2FyZ19pMzLsBBZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy7QQSamRfYWVzX2NjbV9lbmNyeXB07gQSamRfYWVzX2NjbV9kZWNyeXB07wQMQUVTX2luaXRfY3R48AQPQUVTX0VDQl9lbmNyeXB08QQQamRfYWVzX3NldHVwX2tlefIEDmpkX2Flc19lbmNyeXB08wQQamRfYWVzX2NsZWFyX2tlefQEDmpkX3dlYnNvY2tfbmV39QQXamRfd2Vic29ja19zZW5kX21lc3NhZ2X2BAxzZW5kX21lc3NhZ2X3BBNqZF90Y3Bzb2NrX29uX2V2ZW50+AQHb25fZGF0YfkEC3JhaXNlX2Vycm9y+gQJc2hpZnRfbXNn+wQQamRfd2Vic29ja19jbG9zZfwEC2pkX3dzc2tfbmV3/QQUamRfd3Nza19zZW5kX21lc3NhZ2X+BBNqZF93ZWJzb2NrX29uX2V2ZW50/wQHZGVjcnlwdIAFDWpkX3dzc2tfY2xvc2WBBRBqZF93c3NrX29uX2V2ZW50ggULcmVzcF9zdGF0dXODBRJ3c3NraGVhbHRoX3Byb2Nlc3OEBRR3c3NraGVhbHRoX3JlY29ubmVjdIUFGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldIYFD3NldF9jb25uX3N0cmluZ4cFEWNsZWFyX2Nvbm5fc3RyaW5niAUPd3Nza2hlYWx0aF9pbml0iQURd3Nza19zZW5kX21lc3NhZ2WKBRF3c3NrX2lzX2Nvbm5lY3RlZIsFFHdzc2tfdHJhY2tfZXhjZXB0aW9ujAUSd3Nza19zZXJ2aWNlX3F1ZXJ5jQUccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZY4FFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWPBQ9yb2xlbWdyX3Byb2Nlc3OQBRByb2xlbWdyX2F1dG9iaW5kkQUVcm9sZW1ncl9oYW5kbGVfcGFja2V0kgUUamRfcm9sZV9tYW5hZ2VyX2luaXSTBRhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSUBRFqZF9yb2xlX3NldF9oaW50c5UFDWpkX3JvbGVfYWxsb2OWBRBqZF9yb2xlX2ZyZWVfYWxslwUWamRfcm9sZV9mb3JjZV9hdXRvYmluZJgFE2pkX2NsaWVudF9sb2dfZXZlbnSZBRNqZF9jbGllbnRfc3Vic2NyaWJlmgUUamRfY2xpZW50X2VtaXRfZXZlbnSbBRRyb2xlbWdyX3JvbGVfY2hhbmdlZJwFEGpkX2RldmljZV9sb29rdXCdBRhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2WeBRNqZF9zZXJ2aWNlX3NlbmRfY21knwURamRfY2xpZW50X3Byb2Nlc3OgBQ5qZF9kZXZpY2VfZnJlZaEFF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0ogUPamRfZGV2aWNlX2FsbG9jowUQc2V0dGluZ3NfcHJvY2Vzc6QFFnNldHRpbmdzX2hhbmRsZV9wYWNrZXSlBQ1zZXR0aW5nc19pbml0pgUOdGFyZ2V0X3N0YW5kYnmnBQ9qZF9jdHJsX3Byb2Nlc3OoBRVqZF9jdHJsX2hhbmRsZV9wYWNrZXSpBQxqZF9jdHJsX2luaXSqBRRkY2ZnX3NldF91c2VyX2NvbmZpZ6sFCWRjZmdfaW5pdKwFDWRjZmdfdmFsaWRhdGWtBQ5kY2ZnX2dldF9lbnRyea4FE2RjZmdfZ2V0X25leHRfZW50cnmvBQxkY2ZnX2dldF9pMzKwBQxkY2ZnX2dldF9waW6xBQ9kY2ZnX2dldF9zdHJpbmeyBQxkY2ZnX2lkeF9rZXmzBQxkY2ZnX2dldF91MzK0BQlqZF92ZG1lc2e1BRFqZF9kbWVzZ19zdGFydHB0crYFDWpkX2RtZXNnX3JlYWS3BRJqZF9kbWVzZ19yZWFkX2xpbmW4BRNqZF9zZXR0aW5nc19nZXRfYmluuQUKZmluZF9lbnRyeboFD3JlY29tcHV0ZV9jYWNoZbsFE2pkX3NldHRpbmdzX3NldF9iaW68BQtqZF9mc3Rvcl9nY70FFWpkX3NldHRpbmdzX2dldF9sYXJnZb4FFmpkX3NldHRpbmdzX3ByZXBfbGFyZ2W/BQptYXJrX2xhcmdlwAUXamRfc2V0dGluZ3Nfd3JpdGVfbGFyZ2XBBRZqZF9zZXR0aW5nc19zeW5jX2xhcmdlwgUQamRfc2V0X21heF9zbGVlcMMFDWpkX2lwaXBlX29wZW7EBRZqZF9pcGlwZV9oYW5kbGVfcGFja2V0xQUOamRfaXBpcGVfY2xvc2XGBRJqZF9udW1mbXRfaXNfdmFsaWTHBRVqZF9udW1mbXRfd3JpdGVfZmxvYXTIBRNqZF9udW1mbXRfd3JpdGVfaTMyyQUSamRfbnVtZm10X3JlYWRfaTMyygUUamRfbnVtZm10X3JlYWRfZmxvYXTLBRFqZF9vcGlwZV9vcGVuX2NtZMwFFGpkX29waXBlX29wZW5fcmVwb3J0zQUWamRfb3BpcGVfaGFuZGxlX3BhY2tldM4FEWpkX29waXBlX3dyaXRlX2V4zwUQamRfb3BpcGVfcHJvY2Vzc9AFFGpkX29waXBlX2NoZWNrX3NwYWNl0QUOamRfb3BpcGVfd3JpdGXSBQ5qZF9vcGlwZV9jbG9zZdMFDWpkX3F1ZXVlX3B1c2jUBQ5qZF9xdWV1ZV9mcm9udNUFDmpkX3F1ZXVlX3NoaWZ01gUOamRfcXVldWVfYWxsb2PXBQ1qZF9yZXNwb25kX3U42AUOamRfcmVzcG9uZF91MTbZBQ5qZF9yZXNwb25kX3UzMtoFEWpkX3Jlc3BvbmRfc3RyaW5n2wUXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTcBQtqZF9zZW5kX3BrdN0FHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs3gUXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLfBRlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V04AUUamRfYXBwX2hhbmRsZV9wYWNrZXThBRVqZF9hcHBfaGFuZGxlX2NvbW1hbmTiBRVhcHBfZ2V0X2luc3RhbmNlX25hbWXjBRNqZF9hbGxvY2F0ZV9zZXJ2aWNl5AUQamRfc2VydmljZXNfaW5pdOUFDmpkX3JlZnJlc2hfbm935gUZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOcFFGpkX3NlcnZpY2VzX2Fubm91bmNl6AUXamRfc2VydmljZXNfbmVlZHNfZnJhbWXpBRBqZF9zZXJ2aWNlc190aWNr6gUVamRfcHJvY2Vzc19ldmVyeXRoaW5n6wUaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXsBRZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l7QUUYXBwX2dldF9kZXZpY2VfY2xhc3PuBRJhcHBfZ2V0X2Z3X3ZlcnNpb27vBQ1qZF9zcnZjZmdfcnVu8AUXamRfc3J2Y2ZnX2luc3RhbmNlX25hbWXxBRFqZF9zcnZjZmdfdmFyaWFudPIFDWpkX2hhc2hfZm52MWHzBQxqZF9kZXZpY2VfaWT0BQlqZF9yYW5kb231BQhqZF9jcmMxNvYFDmpkX2NvbXB1dGVfY3Jj9wUOamRfc2hpZnRfZnJhbWX4BQxqZF93b3JkX21vdmX5BQ5qZF9yZXNldF9mcmFtZfoFEGpkX3B1c2hfaW5fZnJhbWX7BQ1qZF9wYW5pY19jb3Jl/AUTamRfc2hvdWxkX3NhbXBsZV9tc/0FEGpkX3Nob3VsZF9zYW1wbGX+BQlqZF90b19oZXj/BQtqZF9mcm9tX2hleIAGDmpkX2Fzc2VydF9mYWlsgQYHamRfYXRvaYIGD2pkX3ZzcHJpbnRmX2V4dIMGD2pkX3ByaW50X2RvdWJsZYQGC2pkX3ZzcHJpbnRmhQYKamRfc3ByaW50ZoYGEmpkX2RldmljZV9zaG9ydF9pZIcGDGpkX3NwcmludGZfYYgGC2pkX3RvX2hleF9hiQYJamRfc3RyZHVwigYJamRfbWVtZHVwiwYMamRfZW5kc193aXRojAYOamRfc3RhcnRzX3dpdGiNBhZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVljgYWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZY8GEWpkX3NlbmRfZXZlbnRfZXh0kAYKamRfcnhfaW5pdJEGHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrkgYPamRfcnhfZ2V0X2ZyYW1lkwYTamRfcnhfcmVsZWFzZV9mcmFtZZQGEWpkX3NlbmRfZnJhbWVfcmF3lQYNamRfc2VuZF9mcmFtZZYGCmpkX3R4X2luaXSXBgdqZF9zZW5kmAYPamRfdHhfZ2V0X2ZyYW1lmQYQamRfdHhfZnJhbWVfc2VudJoGC2pkX3R4X2ZsdXNomwYQX19lcnJub19sb2NhdGlvbpwGDF9fZnBjbGFzc2lmeZ0GBWR1bW15ngYIX19tZW1jcHmfBgdtZW1tb3ZloAYGbWVtc2V0oQYKX19sb2NrZmlsZaIGDF9fdW5sb2NrZmlsZaMGBmZmbHVzaKQGBGZtb2SlBg1fX0RPVUJMRV9CSVRTpgYMX19zdGRpb19zZWVrpwYNX19zdGRpb193cml0ZagGDV9fc3RkaW9fY2xvc2WpBghfX3RvcmVhZKoGCV9fdG93cml0ZasGCV9fZndyaXRleKwGBmZ3cml0Za0GFF9fcHRocmVhZF9tdXRleF9sb2NrrgYWX19wdGhyZWFkX211dGV4X3VubG9ja68GBl9fbG9ja7AGCF9fdW5sb2NrsQYOX19tYXRoX2Rpdnplcm+yBgpmcF9iYXJyaWVyswYOX19tYXRoX2ludmFsaWS0BgNsb2e1BgV0b3AxNrYGBWxvZzEwtwYHX19sc2Vla7gGBm1lbWNtcLkGCl9fb2ZsX2xvY2u6BgxfX29mbF91bmxvY2u7BgxfX21hdGhfeGZsb3e8BgxmcF9iYXJyaWVyLjG9BgxfX21hdGhfb2Zsb3e+BgxfX21hdGhfdWZsb3e/BgRmYWJzwAYDcG93wQYFdG9wMTLCBgp6ZXJvaW5mbmFuwwYIY2hlY2tpbnTEBgxmcF9iYXJyaWVyLjLFBgpsb2dfaW5saW5lxgYKZXhwX2lubGluZccGC3NwZWNpYWxjYXNlyAYNZnBfZm9yY2VfZXZhbMkGBXJvdW5kygYGc3RyY2hyywYLX19zdHJjaHJudWzMBgZzdHJjbXDNBgZzdHJsZW7OBgZtZW1jaHLPBgZzdHJzdHLQBg50d29ieXRlX3N0cnN0ctEGEHRocmVlYnl0ZV9zdHJzdHLSBg9mb3VyYnl0ZV9zdHJzdHLTBg10d293YXlfc3Ryc3Ry1AYHX191Zmxvd9UGB19fc2hsaW3WBghfX3NoZ2V0Y9cGB2lzc3BhY2XYBgZzY2FsYm7ZBgljb3B5c2lnbmzaBgdzY2FsYm5s2wYNX19mcGNsYXNzaWZ5bNwGBWZtb2Rs3QYFZmFic2zeBgtfX2Zsb2F0c2Nhbt8GCGhleGZsb2F04AYIZGVjZmxvYXThBgdzY2FuZXhw4gYGc3RydG944wYGc3RydG9k5AYSX193YXNpX3N5c2NhbGxfcmV05QYIZGxtYWxsb2PmBgZkbGZyZWXnBhhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXoBgRzYnJr6QYIX19hZGR0ZjPqBglfX2FzaGx0aTPrBgdfX2xldGYy7AYHX19nZXRmMu0GCF9fZGl2dGYz7gYNX19leHRlbmRkZnRmMu8GDV9fZXh0ZW5kc2Z0ZjLwBgtfX2Zsb2F0c2l0ZvEGDV9fZmxvYXR1bnNpdGbyBg1fX2ZlX2dldHJvdW5k8wYSX19mZV9yYWlzZV9pbmV4YWN09AYJX19sc2hydGkz9QYIX19tdWx0ZjP2BghfX211bHRpM/cGCV9fcG93aWRmMvgGCF9fc3VidGYz+QYMX190cnVuY3RmZGYy+gYLc2V0VGVtcFJldDD7BgtnZXRUZW1wUmV0MPwGCXN0YWNrU2F2Zf0GDHN0YWNrUmVzdG9yZf4GCnN0YWNrQWxsb2P/BhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50gAcVZW1zY3JpcHRlbl9zdGFja19pbml0gQcZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZYIHGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WDBxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSEBwxkeW5DYWxsX2ppammFBxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpphgcYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBhAcEAARmcHRyAQEwAgExAwEyBzcEAA9fX3N0YWNrX3BvaW50ZXIBCHRlbXBSZXQwAgtfX3N0YWNrX2VuZAMMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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

var ___start_em_js = Module['___start_em_js'] = 30648;
var ___stop_em_js = Module['___stop_em_js'] = 32133;



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
