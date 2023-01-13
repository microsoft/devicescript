
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};



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

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_malloc')) {
        Object.defineProperty(Module['ready'], '_malloc', { configurable: true, get: function() { abort('You are getting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_malloc', { configurable: true, set: function() { abort('You are setting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_free')) {
        Object.defineProperty(Module['ready'], '_free', { configurable: true, get: function() { abort('You are getting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_free', { configurable: true, set: function() { abort('You are setting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_set_device_id_2x_i32')) {
        Object.defineProperty(Module['ready'], '_jd_em_set_device_id_2x_i32', { configurable: true, get: function() { abort('You are getting _jd_em_set_device_id_2x_i32 on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_set_device_id_2x_i32', { configurable: true, set: function() { abort('You are setting _jd_em_set_device_id_2x_i32 on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_set_device_id_string')) {
        Object.defineProperty(Module['ready'], '_jd_em_set_device_id_string', { configurable: true, get: function() { abort('You are getting _jd_em_set_device_id_string on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_set_device_id_string', { configurable: true, set: function() { abort('You are setting _jd_em_set_device_id_string on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_init')) {
        Object.defineProperty(Module['ready'], '_jd_em_init', { configurable: true, get: function() { abort('You are getting _jd_em_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_init', { configurable: true, set: function() { abort('You are setting _jd_em_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_process')) {
        Object.defineProperty(Module['ready'], '_jd_em_process', { configurable: true, get: function() { abort('You are getting _jd_em_process on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_process', { configurable: true, set: function() { abort('You are setting _jd_em_process on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_frame_received')) {
        Object.defineProperty(Module['ready'], '_jd_em_frame_received', { configurable: true, get: function() { abort('You are getting _jd_em_frame_received on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_frame_received', { configurable: true, set: function() { abort('You are setting _jd_em_frame_received on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_devs_deploy')) {
        Object.defineProperty(Module['ready'], '_jd_em_devs_deploy', { configurable: true, get: function() { abort('You are getting _jd_em_devs_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_devs_deploy', { configurable: true, set: function() { abort('You are setting _jd_em_devs_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_devs_verify')) {
        Object.defineProperty(Module['ready'], '_jd_em_devs_verify', { configurable: true, get: function() { abort('You are getting _jd_em_devs_verify on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_devs_verify', { configurable: true, set: function() { abort('You are setting _jd_em_devs_verify on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_devs_client_deploy')) {
        Object.defineProperty(Module['ready'], '_jd_em_devs_client_deploy', { configurable: true, get: function() { abort('You are getting _jd_em_devs_client_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_devs_client_deploy', { configurable: true, set: function() { abort('You are setting _jd_em_devs_client_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '___stdio_exit')) {
        Object.defineProperty(Module['ready'], '___stdio_exit', { configurable: true, get: function() { abort('You are getting ___stdio_exit on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '___stdio_exit', { configurable: true, set: function() { abort('You are setting ___stdio_exit on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], 'onRuntimeInitialized')) {
        Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, get: function() { abort('You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], 'onRuntimeInitialized', { configurable: true, set: function() { abort('You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

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
    Exts.dmesg = (s) => console.debug(s);
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
                Exts.log("disconnect", err === null || err === void 0 ? void 0 : err.message);
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
                Exts.log(`connected to ${port}:${host}`);
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
                Exts.log("disconnect", err === null || err === void 0 ? void 0 : err.message);
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
                Exts.log(`connected to ${url}`);
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
                    Exts.error("got string msg");
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
     * Initialises the virtual machine data structure.
     */
    function devsInit() {
        Module._jd_em_init();
    }
    Exts.devsInit = devsInit;
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
                Exts.error(e);
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
     * Specifies the virtual machine device id.
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
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
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

var fs;
var nodePath;
var requireNodeFS;

if (ENVIRONMENT_IS_NODE) {
  if (!(typeof process == 'object' && typeof require == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require('path').dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js


requireNodeFS = () => {
  // Use nodePath as the indicator for these not being initialized,
  // since in some environments a global fs may have already been
  // created.
  if (!nodePath) {
    fs = require('fs');
    nodePath = require('path');
  }
};

read_ = function shell_read(filename, binary) {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    return binary ? ret : ret.toString();
  }
  requireNodeFS();
  filename = nodePath['normalize'](filename);
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
  requireNodeFS();
  filename = nodePath['normalize'](filename);
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
      // Unlike node which has process.exitCode, d8 has no such mechanism. So we
      // have no way to set the exit code and then let the program exit with
      // that code when it naturally stops running (say, when all setTimeouts
      // have completed). For that reason we must call `quit` - the only way to
      // set the exit code - but quit also halts immediately, so we need to be
      // careful of whether the runtime is alive or not, which is why this code
      // path looks different than node. It also has the downside that it will
      // halt the entire program when no code remains to run, which means this
      // is not friendly for bundling this code into a larger codebase, and for
      // that reason the "shell" environment is mainly useful for testing whole
      // programs by themselves, basically.
      if (runtimeKeepaliveCounter) {
        throw toThrow;
      }
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
function alignMemory() { abort('`alignMemory` is now a library function and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line'); }

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-s ENVIRONMENT` to enable.");




var STACK_ALIGN = 16;
var POINTER_SIZE = 4;

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return POINTER_SIZE;
      } else if (type[0] === 'i') {
        const bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}

// include: runtime_functions.js


// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function == "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

var freeTableIndexes = [];

// Weak map of functions in the table to their indexes, created on first use.
var functionsInTableMap;

function getEmptyTableSlot() {
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    return freeTableIndexes.pop();
  }
  // Grow the table
  try {
    wasmTable.grow(1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
  }
  return wasmTable.length - 1;
}

function updateTableMap(offset, count) {
  for (var i = offset; i < offset + count; i++) {
    var item = getWasmTableEntry(i);
    // Ignore null values.
    if (item) {
      functionsInTableMap.set(item, i);
    }
  }
}

/**
 * Add a function to the table.
 * 'sig' parameter is required if the function being added is a JS function.
 * @param {string=} sig
 */
function addFunction(func, sig) {
  assert(typeof func != 'undefined');

  // Check if the function is already in the table, to ensure each function
  // gets a unique index. First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    updateTableMap(0, wasmTable.length);
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }

  // It's not in the table, add it now.

  var ret = getEmptyTableSlot();

  // Set the new value.
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    setWasmTableEntry(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig != 'undefined', 'Missing signature argument to addFunction: ' + func);
    var wrapped = convertJsFunctionToWasm(func, sig);
    setWasmTableEntry(ret, wrapped);
  }

  functionsInTableMap.set(func, ret);

  return ret;
}

function removeFunction(index) {
  functionsInTableMap.delete(getWasmTableEntry(index));
  freeTableIndexes.push(index);
}

// end include: runtime_functions.js
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

function unexportedMessage(sym, isFSSymbol) {
  var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
  if (isFSSymbol) {
    msg += '. Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you';
  }
  return msg;
}

function unexportedRuntimeSymbol(sym, isFSSymbol) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get: function() {
        abort(unexportedMessage(sym, isFSSymbol));
      }
    });
  }
}

function unexportedRuntimeFunction(sym, isFSSymbol) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Module[sym] = () => abort(unexportedMessage(sym, isFSSymbol));
  }
}

// end include: runtime_debug.js
var tempRet0 = 0;
var setTempRet0 = (value) => { tempRet0 = value; };
var getTempRet0 = () => tempRet0;



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

// include: runtime_safe_heap.js


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @param {number} ptr
    @param {number} value
    @param {string} type
    @param {number|boolean=} noSafe */
function setValue(ptr, value, type = 'i8', noSafe) {
  if (type.charAt(type.length-1) === '*') type = 'i32';
    switch (type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)] = tempI64[0],HEAP32[(((ptr)+(4))>>2)] = tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @param {number} ptr
    @param {string} type
    @param {number|boolean=} noSafe */
function getValue(ptr, type = 'i8', noSafe) {
  if (type.charAt(type.length-1) === '*') type = 'i32';
    switch (type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return Number(HEAPF64[((ptr)>>3)]);
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}

// end include: runtime_safe_heap.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
/** @param {string|null=} returnType
    @param {Array=} argTypes
    @param {Arguments|Array=} args
    @param {Object=} opts */
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }

  ret = onDone(ret);
  return ret;
}

/** @param {string=} returnType
    @param {Array=} argTypes
    @param {Object=} opts */
function cwrap(ident, returnType, argTypes, opts) {
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

// include: runtime_legacy.js


var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call

/**
 * allocate(): This function is no longer used by emscripten but is kept around to avoid
 *             breaking external users.
 *             You should normally not use allocate(), and instead allocate
 *             memory using _malloc()/stackAlloc(), initialize it with
 *             setValue(), and so forth.
 * @param {(Uint8Array|Array<number>)} slab: An array of data.
 * @param {number=} allocator : How to allocate memory, see ALLOC_*
 */
function allocate(slab, allocator) {
  var ret;
  assert(typeof allocator == 'number', 'allocate no longer takes a type argument')
  assert(typeof slab != 'number', 'allocate no longer takes a number as arg0')

  if (allocator == ALLOC_STACK) {
    ret = stackAlloc(slab.length);
  } else {
    ret = _malloc(slab.length);
  }

  if (!slab.subarray && !slab.slice) {
    slab = new Uint8Array(slab);
  }
  HEAPU8.set(slab, ret);
  return ret;
}

// end include: runtime_legacy.js
// include: runtime_strings.js


// runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a JavaScript String object.

var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = heap[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = heap[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = heap[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a JavaScript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToRead[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  ;
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given JavaScript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the JavaScript string to copy.
//   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
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
      if (u > 0x10FFFF) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
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

// Copies the given JavaScript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given JavaScript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}

// end include: runtime_strings.js
// include: runtime_strings_extra.js


// runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a JavaScript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given JavaScript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a JavaScript String object.

var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  var maxIdx = idx + maxBytesToRead / 2;
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var str = '';

    // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
    // will always evaluate to true. The loop is then terminated on the first null char.
    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) break;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }

    return str;
  }
}

// Copies the given JavaScript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the JavaScript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)] = codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given JavaScript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr, maxBytesToRead) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(i >= maxBytesToRead / 4)) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0) break;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
}

// Copies the given JavaScript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the JavaScript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given JavaScript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated
    @param {boolean=} dontAddNull */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

/** @param {boolean=} dontAddNull */
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
    HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)] = 0;
}

// end include: runtime_strings_extra.js
// Memory management

var HEAP,
/** @type {!ArrayBuffer} */
  buffer,
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

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;legacyModuleProp('INITIAL_MEMORY', 'INITIAL_MEMORY');

assert(INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it.
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally');
assert(INITIAL_MEMORY == 16777216, 'Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically');

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
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAP32[((max)>>2)] = 0x2135467;
  HEAP32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' 0x' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}

// end include: runtime_stack_check.js
// include: runtime_assertions.js


// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -s SUPPORT_BIG_ENDIAN=1 to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;
var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
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
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  
  callRuntimeCallbacks(__ATINIT__);
}

function exitRuntime() {
  checkStackCookie();
  runtimeExited = true;
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

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data

/** @param {string|number=} what */
function abort(what) {
  {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }
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
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
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
    assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

var wasmBinaryFile;
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADQOBhYCAAP8EBwEABwcIBwAABwQACAcHBQUAAwIABwcCBAMDAxEHEQcHAwYHAgcHAwkFBQUFBwAIBRUbDA0FAgYDBgAAAgIAAAAEAwQCAgIDAAYAAgYAAAMCAgIAAwMDAwUAAAACAQAFAAUFAwICAgIDAwMDBQIIAAEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAQEBAQEBAQEBAQEBAQEADAACAgABAQEAAQAAAQAADAABAgABAgMEBQECAAACCAEDBgMFBgkFBQMGBgYGCQ0FBgMDBQMDAwYFBgYGBgYGAw4PAgICBAEDAQIAAwkJAQIJBAMBAwMCBAcCAAIAHB0DBAUCBgYGAQEGBgEDAgIBBgwGAQYGAQQGAwACAgUADw8CAgYOAwMDAwUFAwMDBAUBAwADAwAEBQUDAQECAgICAgICAgICAgICAgECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgIBAQEBAQICAgICAgICAgEBAgQEAQwNAgIAAAcJAwEDBwEAAAgAAgYABwUDCAkEBAAAAgcAAwcHBAECAQASAwkHAAAEAAIHBQAABB4BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQHBwcHBAcHBwgIAxEIAwAEAAkBAwMBAwYECR8JFgMDEgQDBQMHBwYHBAQIAAQEBwkHCAAHCCAEBQUFBAAXEAUEBwAEBAUJBwQEABMLCwsQBQghCxMTCxcSIgsDAwMEBBYEBBgKFCMKJAYVJSYGDgQEAAgEChQZGQoPJwICCAgUCgoYCigIAAQHCAgIKQ0qBIeAgIAAAXABvAG8AQWGgICAAAEBgAKAAgaTgICAAAN/AUHQ0cECC38BQQALfwFBAAsH+oOAgAAYBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABYQX19lcnJub19sb2NhdGlvbgC7BBlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAGbWFsbG9jAPYEBGZyZWUA9wQaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKRpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAqCmpkX2VtX2luaXQAKw1qZF9lbV9wcm9jZXNzACwUamRfZW1fZnJhbWVfcmVjZWl2ZWQALhFqZF9lbV9kZXZzX2RlcGxveQAvEWpkX2VtX2RldnNfdmVyaWZ5ADAYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADEMX19zdGRpb19leGl0AMcEK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHMAzQQVZW1zY3JpcHRlbl9zdGFja19pbml0AI4FGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAjwUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCQBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAkQUJc3RhY2tTYXZlAIsFDHN0YWNrUmVzdG9yZQCMBQpzdGFja0FsbG9jAI0FDGR5bkNhbGxfamlqaQCTBQnvgoCAAAEAQQELuwEoOD9AQUJbXF9UWmBhwAGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAaoBqwGsAa4BrwGwAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvwHCAcMBxAHFAcYBxwHIAckBygHLAcwBtQK3ArkC1wLYAtkC2gLbAtwC3QLeAt8C4ALhAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AoADgQOCA4MDhAOFA4YDhwOIA4kDigOLA4wDjQOOA48DkAORA5IDkwOUA5UDlgOXA5gDmQOaA5sDnAOdA54DnwOgA6EDogOjA6QDpQOmA6cDqAOpA6oDqwOsA60DrgOvA7ADwwPGA8oDywNGzAPNA9AD0gPkA+UDrATGBMUExAQK24aIgAD/BAUAEI4FC9ABAQF/AkACQAJAAkBBACgC8MIBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgC9MIBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBjMAAQf0y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EIICIAFBIGokAAsTACAAIAAgAEEAEP0BEIABEIICC4oBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxggAyAENwMgAkACQAJAIAEgA0EYahDEAg0AIAMgAykDIDcDECADQShqIAFBEiADQRBqELECDAELIAMgAykDIDcDCCABIANBCGogA0EoahDGAkUNACAAIAMoAigQvgIMAQsgAEIANwMACyADQTBqJAALmwECAn8BfiMAQTBrIgEkACABIAApA0giAzcDECABIAM3AyACQAJAIAAgAUEQahDEAg0AIAEgASkDIDcDCCABQShqIABBEiABQQhqELECQQAhAgwBCyABIAEpAyA3AwAgACABIAFBKGoQxgIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQowIgACgCoAEgASkDGDcDIAsgAUEwaiQAC8gBAgV/AX4jAEEwayIBJAAgASAAKQNIIgY3AxggASAGNwMgAkACQCAAIAFBGGoQxQINACABIAEpAyA3AxAgAUEoaiAAQfsXIAFBEGoQsgJBACECDAELIAEgASkDIDcDCCAAIAFBCGogAUEoahDGAiECCwJAIAJFDQAgAEEAEP0BIQMgAEEBEP0BIQQgAEECEP0BIQAgASgCKCIFIANNDQAgASAFIANrIgU2AiggAiADaiAAIAUgBCAFIARJGxDABBoLIAFBMGokAAuRAwIHfwF+IwBB4ABrIgEkACABIAApA0giCDcDOCABIAg3A1ACQAJAIAAgAUE4ahDFAg0AIAEgASkDUDcDMCABQdgAaiAAQfsXIAFBMGoQsgJBACECDAELIAEgASkDUDcDKCAAIAFBKGogAUHMAGoQxgIhAgsgAEEAEP0BIQMgASAAQdgAaikDACIINwMgIAEgCDcDQAJAAkAgACABQSBqEJ0CRQ0AIAEgASkDQDcDACAAIAEgAUHYAGoQnwIhBAwBCyABIAEpA0AiCDcDUCABIAg3AxgCQCAAIAFBGGoQxAINACABIAEpA1A3AxAgAUHYAGogAEESIAFBEGoQsQJBACEEDAELIAEgASkDUDcDCCAAIAFBCGogAUHYAGoQxgIhBAsgAEECEP0BIQUgAEEDEP0BIQACQCABKAJYIgYgBU0NACABIAYgBWsiBjYCWCABKAJMIgcgA00NACABIAcgA2siBzYCTCACIANqIAQgBWog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ACACQRBqEMICIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCoAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahDBAiEGIAIgAikDIDcDACAAIAIQwQIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKgAUEAKQOgWTcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoAqABIAEpAwA3AyAgAkEwaiQACwkAIABBABCpAQuoAQIDfwF+IwBBIGsiASQAIAEgAEHQAGopAwA3AxggASAAQdgAaikDACIENwMQAkAgBFANACABIAEpAxg3AwggACABQQhqEPABIQIgASABKQMQNwMAIAAgARDyASIDRQ0AIAJFDQACQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAIgAygCBBDdAQsgACACIAMQ3QELIAAoAqABIAEpAxg3AyAgAUEgaiQACwkAIABBARCtAQu9AQIDfwF+IwBBMGsiAiQAIAIgAEHQAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQ8gEiA0UNACAAQQAQfyIERQ0AIAJBIGogAEEIIAQQwAIgAiACKQMgNwMQIAAgAkEQahB8AkAgAygCAEGAgID4AHFBgICAyABHDQAgACADKAIEIAQgARDiAQsgACADIAQgARDiASACIAIpAyA3AwggACACQQhqEH0gACgCoAEgAikDIDcDIAsgAkEwaiQACwkAIABBABCtAQu5AQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCxAkEAIQILAkACQCACDQAgAEIANwMADAELAkAgASACLwESENYCRQ0AIAAgAi8BEjYCACAAQQI2AgQMAQsgAEIANwMACyADQSBqJAALqgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQsQJBACECCwJAAkAgAg0AIABCADcDAAwBCyADIAJBCGpBCBClBDYCACAAIAFBqxIgAxCiAgsgA0EgaiQAC7IBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELECQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgA0EYaiACKQMIEKMEIAMgA0EYajYCACAAIAFB7RUgAxCiAgsgA0EgaiQAC5kBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELECQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLQAVEL4CCyADQSBqJAALmQEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQsQJBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARAQvgILIANBIGokAAuZAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCxAkEAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFBC+AgsgA0EgaiQAC5wBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELECQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLQAUQQFxEL8CCyADQSBqJAALnwEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQsQJBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBf3NBAXEQvwILIANBIGokAAudAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCxAkEAIQILAkACQCACDQAgAEIANwMADAELIAAgAUEIIAIoAhwQwAILIANBIGokAAu7AQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCxAkEAIQILAkACQCACDQAgAEIANwMADAELQQAhAQJAIAItABRBAXENACACLQAVQTBLDQAgAi8BEEEPdiEBCyAAIAEQvwILIANBIGokAAvDAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahCxAkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLgEQQX9KDQAgACACLQAQEL4CDAELIABCADcDAAsgA0EgaiQAC6MBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELECQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgMAARhC/AgsgA0EgaiQAC6IBAQF/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QQhqEEpqIQULIABB5AFqIAUgBms6AAAgAkEwaiQAC8MBAgJ/AX4jAEHAAGsiASQAIAEgACkDSCIDNwMoIAEgAzcDGCABIAM3AzACQCAAIAFBGGogAUEkahDlASICDQAgASABKQMwNwMQIAFBOGogAEG4GCABQRBqELICQQAhAgsCQCACRQ0AIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABBqxggAUEIahCyAkEAIQILAkAgAkUNACAAIAIQwQEgACABKAIkIAIvAQJB/x9xQYDAAHIQzwELIAFBwABqJAALmgECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDECADIAQ3AyACQCABIANBEGogA0EcahDlASICDQAgAyADKQMgNwMIIANBKGogAUG4GCADQQhqELICQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCADKAIcIgJB//8BRw0AIABCADcDAAwBCyAAIAI2AgAgAEECNgIECyADQTBqJAALgwECAX8BfiMAQTBrIgMkACADIAIpAwAiBDcDECADIAQ3AyACQCABIANBEGogA0EcahDlASICDQAgAyADKQMgNwMIIANBKGogAUG4GCADQQhqELICQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EwaiQAC4ABAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxAgAyAENwMgAkAgASADQRBqIANBHGoQ5QEiAg0AIAMgAykDIDcDCCADQShqIAFBuBggA0EIahCyAkEAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BAkH/H3EQvgILIANBMGokAAu6AQICfwF+IwBBwABrIgEkACABIAApA0giAzcDKCABIAM3AxggASADNwMwAkAgACABQRhqIAFBJGoQ5QEiAg0AIAEgASkDMDcDECABQThqIABBuBggAUEQahCyAkEAIQILAkAgAkUNACABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQasYIAFBCGoQsgJBACECCwJAIAJFDQAgACACEMEBIAAgASgCJCACLwECEM8BCyABQcAAaiQAC28BAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgAyACKQMANwMIIAAgAUHZACADQQhqELECDAELIAAgASgCqAEgAigCAEEMbGooAgAoAhBBAEcQvwILIANBEGokAAuHAgIFfwF+IwBBMGsiASQAIAEgACkDSDcDKAJAAkACQCABKAIsIgJBgIDA/wdxDQAgAkEPcUECRg0BCyABIAEpAyg3AxAgAUEgaiAAQdkAIAFBEGoQsQJB//8BIQIMAQsgASgCKCECCwJAIAJB//8BRg0AIABBABD9ASEDIAEgAEHYAGopAwAiBjcDKCABIAY3AwggACABQQhqIAFBHGoQxwIhBAJAIANBgIAESQ0AIAFBIGogAEHdABCzAgwBCwJAIAEoAhwiBUHtAUkNACABQSBqIABB3gAQswIMAQsgAEHkAWogBToAACAAQegBaiAEIAUQvgQaIAAgAiADEM8BCyABQTBqJAALpgEBA38jAEEgayIBJAAgASAAKQNINwMYAkACQAJAIAEoAhwiAkGAgMD/B3ENACACQQ9xQQJGDQELIAEgASkDGDcDCCABQRBqIABB2QAgAUEIahCxAkH//wEhAgwBCyABKAIYIQILAkAgAkH//wFGDQAgACgCoAEiAyADLQAQQfABcUEEcjoAECAAKAKgASIDIAI7ARIgA0EAEGYgABBkCyABQSBqJAALRgEBfyMAQRBrIgMkACADIAIpAwA3AwACQAJAIAEgAyADQQxqEJ8CRQ0AIAAgAygCDBC+AgwBCyAAQgA3AwALIANBEGokAAtyAgN/AX4jAEEgayIBJAAgASAAKQNIIgQ3AwggASAENwMQAkAgACABQQhqIAFBHGoQnwIiAkUNAAJAIABBABD9ASIDIAEoAhxJDQAgACgCoAFBACkDoFk3AyAMAQsgACACIANqLQAAEIACCyABQSBqJAALUAECfyMAQSBrIgEkACABIAApA0g3AxAgAEEAEP0BIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQ+AEgACgCoAEgASkDGDcDICABQSBqJAAL0QIBA38CQAJAIAAvAQgNAAJAAkAgACgCqAEgAUEMbGooAgAoAhAiBUUNACAAQdQDaiIGIAEgAiAEEIsCIgdFDQAgBygCBEGg9zYgAyADQd+ISWpB4IhJSRtqIAAoArgBTw0BIAYgBxCHAgsgACgCoAEiAEUNAiAAIAI7ARQgACABOwESIAAgBDsBCCAAQQpqQRQ7AQAgACAALQAQQfABcUEBcjoAECAAQQAQZw8LIAYgBxCJAiEBIABB4AFqQgA3AwAgAEIANwPYASAAQeYBaiABLwECOwEAIABB5AFqIAEtABQ6AAAgAEHlAWogBS0ABDoAACAAQdwBaiAFQQAgBS0ABGtBDGxqQWRqKQMANwIAIABB6AFqIQIgAUEIaiEAAkAgAS0AFCIBQQpJDQAgACgCACEACyACIAAgARC+BBoLDwtB5TpBnTVBKUHUFhCeBAALMwACQCAALQAQQQ9xQQJHDQAgACgCLCAAKAIIEFMLIABCADcDCCAAIAAtABBB8AFxOgAQC5cCAQJ/AkACQCAALwEIDQACQCACQYBgcUGAwABHDQAgAEHUA2oiAyABIAJB/59/cUGAIHJBABCLAiIERQ0AIAMgBBCHAgsgACgCoAEiA0UNAQJAIAAoAJgBIgQgBCgCOGogAUEDdGooAgBB7fLZjAFHDQAgA0EAEGcgAEHwAWpCfzcDACAAQegBakJ/NwMAIABB4AFqQn83AwAgAEJ/NwPYASAAIAEQ0AEPCyADIAI7ARQgAyABOwESIABB5AFqLQAAIQEgAyADLQAQQfABcUECcjoAECADIAAgARB5IgI2AggCQCACRQ0AIAMgAToADCACIABB6AFqIAEQvgQaCyADQQAQZwsPC0HlOkGdNUHMAEGTKhCeBAALjgICAn8BfiMAQSBrIgIkAAJAIAAoAqQBIgNFDQADQAJAIAMvARIgAUcNACADIAMtABBBIHI6ABALIAMoAgAiAw0ACwsgAiABNgIYIAJBAjYCHCACIAIpAxg3AwAgAkEQaiAAIAJB4QAQ9QECQCACKQMQIgRQDQAgACAENwNIIABBAjoAOyAAQdAAaiIDQgA3AwAgAkEIaiAAIAEQ0gEgAyACKQMINwMAIABBAUEBEG4iA0UNACADIAMtABBBIHI6ABALAkAgACgCpAEiA0UNAANAAkAgAy0AECIBQSBxRQ0AIAMgAUHfAXE6ABAgAxBwIAAoAqQBIgMNAQwCCyADKAIAIgMNAAsLIAJBIGokAAsrACAAQn83A9gBIABB8AFqQn83AwAgAEHoAWpCfzcDACAAQeABakJ/NwMAC5ECAQN/IwBBIGsiAyQAAkACQCABQeUBai0AAEH/AUcNACAAQgA3AwAMAQsCQCABQQpBIBB4IgQNACAAQgA3AwAMAQsgA0EYaiABQQggBBDAAiADIAMpAxg3AxAgASADQRBqEHwgBCABIAFB5AFqLQAAEIABIgU2AhwCQCAFDQAgAyADKQMYNwMAIAEgAxB9IABCADcDAAwBCyAFQQxqIAFB6AFqIAUvAQQQvgQaIAQgAUHcAWopAgA3AwggBCABLQDlAToAFSAEIAFB5gFqLwEAOwEQIAFB2wFqLQAAIQUgBCACOwESIAQgBToAFCADIAMpAxg3AwggASADQQhqEH0gACADKQMYNwMACyADQSBqJAALpAEBAn8CQAJAIAAvAQgNACAAKAKgASICRQ0BIAJB//8DOwESIAIgAi0AEEHwAXFBA3I6ABAgAiAAKALEASIDOwEUIAAgA0EBajYCxAEgAiABKQMANwMIIAJBARDUAUUNAAJAIAItABBBD3FBAkcNACACKAIsIAIoAggQUwsgAkIANwMIIAIgAi0AEEHwAXE6ABALDwtB5TpBnTVB6ABBrCAQngQAC98CAQd/IwBBIGsiAiQAAkACQAJAIAAvARQiAyAAKAIsIgQoAsgBIgVB//8DcUYNACABDQAgAEEDEGcMAQsgAiAAKQMINwMQIAQgAkEQaiACQRxqEJ8CIQYgBEHpAWpBADoAACAEQegBaiIHIAM6AAACQCACKAIcQesBSQ0AIAJB6gE2AhwLIAcgBiACKAIcIggQvgQaIARB5gFqQYIBOwEAIARB5AFqIgcgCEECajoAACAEQeUBaiAELQDUAToAACAEQdwBahCSBDcCACAEQdsBakEAOgAAIARB2gFqIActAABBB2pB/AFxOgAAAkAgAUUNACACIAY2AgBByhUgAhAtC0EBIQEgBC0ABkECcUUNAQJAIAMgBUH//wNxRw0AAkAgBEHYAWoQgAQNAEEBIQEgBCAEKALIAUEBajYCyAEMAwsgAEEDEGcMAQsgAEEDEGcLQQAhAQsgAkEgaiQAIAELlQYCB38BfiMAQRBrIgEkAEEBIQICQCAALQAQQQ9xIgNFDQACQAJAAkACQAJAAkACQCADQX9qDgQBAgMABAsgASAAKAIsIAAvARIQ0gEgACABKQMANwMgDAYLIAAoAiwiAigCqAEgAC8BEiIEQQxsaigCACgCECIDRQ0EAkAgAkHbAWotAABBAXENACACQeYBai8BACIFRQ0AIAUgAC8BFEcNACADLQAEIgUgAkHlAWotAABHDQAgA0EAIAVrQQxsakFkaikDACACQdwBaikCAFINACACIAQgAC8BCBDWASIDRQ0AIAJB1ANqIAMQiQIaQQEhAgwGCwJAIAAoAhggAigCuAFLDQAgAUEANgIMQQAhBAJAIAAvAQgiA0UNACACIAMgAUEMahDVAiEECyACQdgBaiEFIAAvARQhBiAALwESIQcgASgCDCEDIAJBAToA2wEgAkHaAWogA0EHakH8AXE6AAAgAigCqAEgB0EMbGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkHmAWogBjsBACACQeUBaiAHOgAAIAJB5AFqIAM6AAAgAkHcAWogCDcCAAJAIARFDQAgAkHoAWogBCADEL4EGgsgBRCABCIDRSECIAMNBAJAIAAvAQoiBEHnB0sNACAAIARBAXQ7AQoLIAAgAC8BChBnIAMNBgtBACECDAULIAAoAiwiAigCqAEgAC8BEkEMbGooAgAoAhAiBEUNAyAAQQxqLQAAIQMgACgCCCEFIAAvARQhBiACQdsBakEBOgAAIAJB2gFqIANBB2pB/AFxOgAAIARBACAELQAEIgdrQQxsakFkaikDACEIIAJB5gFqIAY7AQAgAkHlAWogBzoAACACQeQBaiADOgAAIAJB3AFqIAg3AgACQCAFRQ0AIAJB6AFqIAUgAxC+BBoLAkAgAkHYAWoQgAQiAg0AIAJFIQIMBQsgAEEDEGdBACECDAQLIABBABDUASECDAMLQZ01QfwCQd8aEJkEAAsgAEEDEGcMAQtBACECIABBABBmCyABQRBqJAAgAgueAgEGfyMAQRBrIgMkACAAQegBaiEEIABB5AFqLQAAIQUCQAJAAkAgAkUNACAAIAIgA0EMahDVAiEGAkACQCADKAIMIgdBAWoiCCAALQDkAUoNACAEIAdqLQAADQAgBiAEIAcQ1gRFDQELQQAhCAsgCEUNASAFIAhrIQUgBCAIaiEEC0EAIQgCQCAAQdQDaiIGIAEgAEHmAWovAQAgAhCLAiIHRQ0AAkAgBSAHLQAURw0AIAchCAwBCyAGIAcQhwILAkAgCA0AIAYgASAALwHmASAFEIoCIgggAjsBFgsgCEEIaiECAkAgCC0AFEEKSQ0AIAIoAgAhAgsgAiAEIAUQvgQaIAggACkDuAE+AgQMAQtBACEICyADQRBqJAAgCAu8AgEEfwJAIAAvAQgNACAAQdgBaiACIAItAAxBEGoQvgQaAkAgACgAmAFBPGooAgAiAkEISQ0AIAJBA3YiAkEBIAJBAUsbIQMgAEHUA2ohBEEAIQUDQAJAIAAoAqgBIAVBDGxqKAIAKAIQIgJFDQACQAJAIAAtAOUBIgYNACAALwHmAUUNAQsgAi0ABCAGRw0BCyACQQAgAi0ABGtBDGxqQWRqKQMAIAApAtwBUg0AIAAQcQJAIAAtANsBQQFxDQACQCAALQDlAUExTw0AIAAvAeYBQf+BAnFBg4ACRw0AIAQgBSAAKAK4AUHwsX9qEIwCDAELQQAhAgNAIAQgBSAALwHmASACEI4CIgJFDQEgACACLwEAIAIvARYQ1gFFDQALCyAAIAUQ0AELIAVBAWoiBSADRw0ACwsgABB0CwvIAQEDfwJAIAAvAQYiAkEEcQ0AAkAgAkEIcQ0AIAEQzgMhAiAAQcUAIAEQzwMgAhBNCwJAIAAoAJgBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoAqgBIQRBACECA0ACQCAEIAJBDGxqKAIAIAFHDQAgAEHUA2ogAhCNAiAAQfABakJ/NwMAIABB6AFqQn83AwAgAEHgAWpCfzcDACAAQn83A9gBIAAgAhDQAQwCCyACQQFqIgIgA0cNAAsLIAAQdAsL3AEBBn8jAEEQayIBJAAgACAALwEGQQRyOwEGENYDIAAgAC8BBkH7/wNxOwEGAkAgACgAmAFBPGooAgAiAkEISQ0AIABBmAFqIQMgAkEDdiICQQEgAkEBSxshBEEAIQIDQCAAKACYASIFKAI4IQYgASADKAIANgIMIAFBDGogAhBrIAUgBmogAkEDdGoiBigCABDVAyEFIAAoAqgBIAJBDGxqIAU2AgACQCAGKAIAQe3y2YwBRw0AIAUgBS0ADEEBcjoADAsgAkEBaiICIARHDQALCxDXAyABQRBqJAALIQAgACAALwEGQQRyOwEGENYDIAAgAC8BBkH7/wNxOwEGCzYBAX8gAC8BBiECAkAgAUUNACAAIAJBAnI7AQYPCyAAIAJB/f8DcTsBBiAAIAAoAsQBNgLIAQsJAEEAKALkxQELwQMBBH8jAEEwayIDJAACQAJAIAIgACgCmAEiBCAEKAJgamsgBC8BDkEEdEkNAAJAAkAgAkHgzgBrQQxtQSBLDQAgAigCCCIELwEAIgJFDQEDQCADQShqIAJB//8DcRCgAgJAAkAgBCICLwECIgRBIEsNAAJAIAAgBBDeASIFQeDOAGtBDG1BIEsNACADQQA2AiQgAyAEQeAAajYCIAwCCyADQSBqIABBCCAFEMACDAELIARBz4YDTQ0FIAMgBDYCICADQQM2AiQLIAMgAykDKDcDCCADIAMpAyA3AwAgACABIANBCGogAxDfASACQQRqIQQgAi8BBCICDQAMAgsACwJAAkAgAg0AQQAhBAwBCyACLQADQQ9xIQQLAkACQCAEQXxqDgYBAAAAAAEAC0HxxgBB4jBBPUHAGhCeBAALIAIvAQgiBEUNACAEQQF0IQYgAigCDCEEQQAhAgNAIAMgBCACQQN0IgVqKQMANwMYIAMgBCAFQQhyaikDADcDECAAIAEgA0EYaiADQRBqEN8BIAJBAmoiAiAGSQ0ACwsgA0EwaiQADwtB4jBBNEHAGhCZBAALQYc6QeIwQS5ByiQQngQAC5oCAQN/AkACQAJAAkACQCABQRlLDQACQEGu/f4KIAF2QQFxIgINAAJAIAAoAqwBDQAgAEEgEHkhAyAAQQg6ADwgACADNgKsASADDQBBACEDDAELIAFBgMsAai0AAEF/aiIEQQhPDQMgACgCrAEgBEECdGooAgAiAw0AAkAgAEEJQRAQeCIDDQBBACEDDAELIAAoAqwBIARBAnRqIAM2AgAgAUEhTw0EIANB4M4AIAFBDGxqIgBBACAAKAIIGzYCBAsgAkUNAQsgAUEhTw0DQeDOACABQQxsaiIBQQAgASgCCBshAwsgAw8LQec5QeIwQcsBQcwcEJ4EAAtB8zdB4jBBrgFB5RwQngQAC0HzN0HiMEGuAUHlHBCeBAALtQIBA38jAEEgayIEJAAgBCACKQMANwMQAkACQAJAIAAgASAEQRBqEOEBIgVFDQAgBSADKQMANwMADAELIAQgAikDADcDCAJAIAAgBEEIahCdAg0AIAQgAikDADcDACAEQRhqIABBwgAgBBCxAgwBCyABLwEKIgUgAS8BCCIGSQ0BAkAgBSAGRw0AIAEgBUEKbEEDdiIFQQQgBUEEShsiBTsBCiAAIAVBBHQQeSIFRQ0BAkAgAS8BCCIGRQ0AIAUgASgCDCAGQQR0EL4EGgsgASAFNgIMIAAoAtABIAUQegsgASgCDCABLwEIQQR0aiACKQMANwMAIAEoAgwgAS8BCEEEdGpBCGogAykDADcDACABIAEvAQhBAWo7AQgLIARBIGokAA8LQacfQeIwQf0AQdcOEJ4EAAscACABIAAoApgBIgAgACgCYGprIAAvAQ5BBHRJC7UCAgd/AX4jAEEgayIDJAAgAyACKQMANwMQQQAhBAJAIAAgA0EQahCdAkUNAEEAIQUgAS8BCCIGQQBHIQcgBkEBdCEIIAEoAgwhAQJAAkAgBg0ADAELIAIoAgAhCSACKQMAIQoDQAJAIAEgBUEDdGoiBCgAACAJRw0AIAQpAwAgClINACABIAVBA3RBCHJqIQQMAgsgBUECaiIFIAhJIgcNAAsLIAdBAXENACADIAIpAwA3AwhBACEEIAAgA0EIaiADQRxqEJ8CIQkgBkUNAANAIAMgASAEQQN0aikDADcDACAAIAMgA0EYahCfAiEFAkAgAygCGCADKAIcIgdHDQAgCSAFIAcQ1gQNACABIARBA3RBCHJqIQQMAgsgBEECaiIEIAhJDQALQQAhBAsgA0EgaiQAIAQLjAQBBX8jAEEQayIEJAACQAJAIAEgACgCmAEiBSAFKAJgamsgBS8BDkEEdEkNACACLwEIIQUCQAJAIAFB4M4Aa0EMbUEgSw0AIAEoAggiBiEHA0AgByIIQQRqIQcgCC8BAA0ACyAAIAIgBSAIIAZrQQJ1EOMBDQEgASgCCCIHLwEARQ0BA0AgAigCDCAFQQN0aiEIAkACQCADRQ0AIARBCGogBy8BABCgAiAIIAQpAwg3AwAMAQsCQAJAIAcvAQIiAUEgSw0AAkAgACABEN4BIgZB4M4Aa0EMbUEgSw0AIARBADYCDCAEIAFB4ABqNgIIDAILIARBCGogAEEIIAYQwAIMAQsgAUHPhgNNDQYgBCABNgIIIARBAzYCDAsgCCAEKQMINwMACyAFQQFqIQUgBy8BBCEIIAdBBGohByAIDQAMAgsACwJAAkAgAQ0AQQAhBwwBCyABLQADQQ9xIQcLAkACQCAHQXxqDgYBAAAAAAEAC0HxxgBB4jBB3gBBihEQngQACyABKAIMIQggACACIAUgAS8BCCIHEOMBDQAgB0UNACAHQQF0IQEgA0EBcyEDQQAhBwNAIAIoAgwgBUEDdGogCCAHIANyQQN0aikDADcDACAFQQFqIQUgB0ECaiIHIAFJDQALCyAEQRBqJAAPC0HiMEHLAEGKERCZBAALQYc6QeIwQS5ByiQQngQAC94CAQd/IwBBEGsiBCQAAkACQCADQYE8SA0AIARBCGogAEEPELMCQXwhBQwBC0EAIQVBACABLwEIIgZrIAMgBiADaiIHQQBIGyIDRQ0AAkAgB0EAIAdBAEobIgdBgTxJDQAgBEEIaiAAQQ8QswJBeiEFDAELAkAgByABLwEKTQ0AAkAgACAHQQpsQQN2IghBBCAIQQRKGyIJQQN0EHkiCA0AQXshBQwCCwJAIAEoAgwiCkUNACAIIAogAS8BCEEDdBC+BBoLIAEgCTsBCiABIAg2AgwgACgC0AEgCBB6CyABLwEIIAYgAiAGIAJJGyIAayECAkACQCADQX9KDQAgASgCDCAAQQN0aiIAIAAgA0EDdGsgAiADahC/BBoMAQsgASgCDCAAQQN0IgBqIgYgA0EDdCIDaiAGIAIQvwQaIAEoAgwgAGpBACADEMAEGgsgASAHOwEICyAEQRBqJAAgBQt9AQN/IwBBEGsiAyQAIAMgAikDADcDCAJAAkAgACABIANBCGoQ4QEiAA0AQX8hAgwBCyABIAEvAQgiBEF/ajsBCEEAIQIgBCAAQXhqIgUgASgCDGtBA3VBAXZBf3NqIgFFDQAgBSAAQQhqIAFBBHQQvwQaCyADQRBqJAAgAgtuAQJ/AkAgAkUNACACQf//ATYCAAtBACEDAkAgASgCBCIEQYCAwP8HcQ0AIARBD3FBBkcNACABKAIAIQECQCACRQ0AIAIgAUH//wFxNgIACyAAKACYASICIAIoAmBqIAFBDXZB/P8fcWohAwsgAwuHAQEEf0EAIQICQCAAKACYASIDQTxqKAIAQQN2IAFNDQAgAy8BDiIERQ0AIAAoAJgBIgIgAigCOGogAUEDdGooAgAhACACIAIoAmBqIQVBACEBA0AgBSABQQR0aiIDIAIgAygCBCIDIABGGyECIAMgAEYNASABQQFqIgEgBEcNAAtBACECCyACC6gFAQx/IwBBIGsiBCQAIAFBmAFqIQUCQANAAkACQAJAAkACQAJAAkACQCACRQ0AIAIgASgCmAEiBiAGKAJgaiIHayAGLwEOQQR0Tw0BIAcgAi8BCkECdGohCCACLwEIIQkCQCADKAIEIgZBgIDA/wdxDQAgBkEPcUEERw0AQQAhCiAJQQBHIQYCQCAJRQ0AQQEhCyAIIQwCQAJAIAMoAgAiDSAILwEARg0AA0AgCyIGIAlGDQIgBkEBaiELIA0gCCAGQQN0aiIMLwEARw0ACyAGIAlJIQYLIAwgB2siC0GAgAJPDQUgAEEGNgIEIAAgC0ENdEH//wFyNgIAQQEhCgwBCyAGIAlJIQYLIAYNCAsgBCADKQMANwMQIAEgBEEQaiAEQRhqEJ8CIQ4gBCgCGEUNA0EAIQYgCUEARyEHQQkhCgJAIAlFDQADQCAIIAZBA3RqIg8vAQAhCyAEKAIYIQwgBCAFKAIANgIMIARBDGogCyAEQRxqENQCIQsCQCAMIAQoAhwiDUcNACALIA4gDRDWBA0AIA8gASgAmAEiBiAGKAJgamsiBkGAgAJPDQcgAEEGNgIEIAAgBkENdEH//wFyNgIAQQEhCgwCCyAGQQFqIgYgCUkhByAGIAlHDQALCwJAIAdBAXFFDQAgAiEGDAcLQQAhCkEAIQYgAigCBEHz////AUYNBiACLwECQQ9xIgZBAk8NBSABKACYASIJIAkoAmBqIAZBBHRqIQZBACEKDAYLIABCADcDAAwIC0GCxwBB4jBBkgJB9RgQngQAC0HOxwBB4jBB6QFB4i8QngQACyAAQgA3AwBBASEKIAIhBgwCC0HOxwBB4jBB6QFB4i8QngQAC0HmOEHiMEGMAkHuLxCeBAALIAYhAgsgCkUNAAsLIARBIGokAAu7BAEEfyMAQRBrIgQkAAJAIAJFDQAgAigCAEGAgID4AHFBgICA+ABHDQACQANAAkACQAJAAkACQCACRQ0AIAIoAgghBQJAAkAgAygCBCIGQYCAwP8HcQ0AIAZBD3FBBEcNACADKAIAIgdBgIB/cUGAgAFHDQAgBS8BACIGRQ0BIAdB//8AcSEHA0ACQCAHIAZB//8DcUcNAAJAIAUvAQIiBUEgSw0AAkAgASAFEN4BIgZB4M4Aa0EMbUEgSw0AIABBADYCBCAAIAVB4ABqNgIAQQANCwwMCyAAIAFBCCAGEMACQQANCgwLCyAFQc+GA00NBSAAIAU2AgAMCAsgBS8BBCEGIAVBBGohBSAGDQAMAgsACyAEIAMpAwA3AwAgASAEIARBDGoQnwIhByAEKAIMIAcQ5ARHDQMgBS8BACIGRQ0AA0ACQCAGQf//A3EQ0wIgBxDjBA0AAkAgBS8BAiIFQSBLDQACQCABIAUQ3gEiBkHgzgBrQQxtQSBLDQAgAEEANgIEIAAgBUHgAGo2AgBBAA0KDAsLIAAgAUEIIAYQwAJBAA0JDAoLIAVBz4YDTQ0GIAAgBTYCAAwHCyAFLwEEIQYgBUEEaiEFIAYNAAsLIAIoAgQhAkEBDQUMBgsgAEIANwMADAULQYc6QeIwQS5ByiQQngQACyAAQgA3AwBBAA0CDAMLQYc6QeIwQS5ByiQQngQACyAAQQM2AgRBAA0ACwsgBEEQaiQADwtBksUAQeIwQa8CQeMYEJ4EAAvWBQIFfwJ+IwBBEGsiBCQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EgBUGAgMD/B3EbIgVBfWoOBwMCAgACAgECCwJAIAIoAgQiBkGAgMD/B3ENACAGQQ9xQQJHDQAgAigCACICQYCAAk8NBSADKAIAIQMgAEEGNgIEIAAgA0GAgH5xIAJyNgIADAQLIAVBfWoOBwIBAQEBAQABCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeCIDDQAgAEIANwMADAMLIAMgCjcDECADIAk3AwggACABQQggAxDAAgwCCyAAIAMpAwA3AwAMAQsCQAJAIAMoAgAiBkGw+XxqIgVBAEgNACAFQQAvAYC5AU4NBEGw0gAgBUEDdGoiBy0AA0EBcUUNASAHLQACDQUgBCACKQMANwMIIAAgASAEQQhqQbDSACAFQQN0aigCBBEBAAwCCyAGIAEoAJgBQSRqKAIAQQR2Tw0FCwJAIAZB//8DSw0AAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcSIHGyIIDgkAAAAAAAIAAgECCyAHDQcgAigCACIDQYCAgIABTw0IIAVB8P8/cQ0JIAAgAyAIQRx0cjYCACAAIAZBBHRBBXI2AgQMAgsgBUHw/z9xDQkgACACKAIANgIAIAAgBkEEdEEKcjYCBAwBCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeCIDDQAgAEIANwMADAELIAMgCjcDECADIAk3AwggACABQQggAxDAAgsgBEEQaiQADwtBhCdB4jBB4gJBsSkQngQAC0HhEEHiMEHyAkGxKRCeBAALQZE+QeIwQfUCQbEpEJ4EAAtB7MUAQeIwQfsCQbEpEJ4EAAtBhhlB4jBBjQNBsSkQngQAC0GVP0HiMEGOA0GxKRCeBAALQc0+QeIwQY8DQbEpEJ4EAAtBzT5B4jBBlQNBsSkQngQACy8AAkAgA0GAgARJDQBBwSJB4jBBngNB9iUQngQACyAAIAEgA0EEdEEJciACEMACCzIBAX8jAEEQayIEJAAgBCABKQMANwMIIAAgBEEIaiACIANBABDsASEAIARBEGokACAAC+0DAgR/An4jAEHgAGsiBSQAIANBADYCACACQgA3AwBBfyEGAkAgBEECSg0AIAEoAgAhBwJAAkACQAJAAkACQEEQIAEoAgQiCEEPcSAIQYCAwP8HcRtBfWoOCAAFAQUFBAMCBQsgAkIANwMAIAchBgwFCyACIAdBHHatQiCGIAdB/////wBxrYQ3AwAgCEEEdkH//wNxIQYMBAsgAiAHrUKAgICAgAGENwMAIAhBBHZB//8DcSEGDAMLIAMgBzYCACAIQQR2Qf//A3EhBgwCCyAHRQ0BIAcoAgBBgICA+ABxQYCAgDhHDQEgBSAHKQMQNwMwIAAgBUEwaiACIAMgBEEBahDsASEGIAIgBykDCDcDAAwBCyABKQMAIglQDQAgBUHAAGpB2AAQoAIgBSAJNwNIIAUgBSkDQCIKNwNQIAAgCjcDMCAFIAk3AyggBSAJNwNYIAAgBUEoakEAEO0BIQYgAEIANwMwIAUgBSkDUDcDICAFQdgAaiAAIAYgBUEgahDuASAFIAUpA0g3AxggBSAFKQNYNwMQIAVBOGogACAFQRhqIAVBEGoQ6QECQCAFKQM4UEUNAEF/IQYMAQsgBSAFKQM4NwMIIAAgBUEIaiACIAMgBEEBahDsASEGIAIgCTcDAAsgBUHgAGokACAGC5oGAgR/AX4jAEHQAGsiAyQAAkACQAJAAkAgASkDAEIAUg0AIAMgASkDACIHNwMwIAMgBzcDQEHtIEH1ICACQQFxGyEEIAAgA0EwahCSAhCnBCEBAkACQCAAKQAwQgBSDQAgAyAENgIAIAMgATYCBCADQcgAaiAAQeoTIAMQrQIMAQsgAyAAQTBqKQMANwMoIAAgA0EoahCSAiECIAMgBDYCECADIAI2AhQgAyABNgIYIANByABqIABB+hMgA0EQahCtAgsgARAhQQAhBAwBCwJAAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F+ag4HAQICAgACAwILIAAoAJgBIgQgBCgCYGogASgCAEENdkH8/x9xai8BAiIBQYCgAk8NBEGHAiABQQx2IgF2QQFxRQ0EIAAgAUECdEGoywBqKAIAIAIQ8QEhBAwDCyAAKAKoASABKAIAIgFBDGxqKAIIIQQgAkECcQ0CIAQNAgJAIAAgARDvASIEDQBBACEEDAMLIAJBAXFFDQIgACAEEH4hBCAAKAKoASABQQxsaiAENgIIDAILIAMgASkDADcDOAJAIAAgA0E4ahDKAiIFQQJHDQAgASgCBA0AAkAgASgCAEGgf2oiAUEgSw0AIAAgASACQQRyEPEBIQQLIAFBIUkNAgtBACEBAkAgBUELSg0AIAVBmssAai0AACEBCyABRQ0DIAAgASACEPEBIQQMAQsCQAJAIAEoAgAiBA0AQQAhAQwBCyAELQADQQ9xIQELQQYhBkEIIQUCQAJAAkACQAJAAkAgAUF9ag4IBAYFAQIDBgADC0EUIQZBGCEFDAQLIABBCCACEPEBIQQMBAsgAEEQIAIQ8QEhBAwDC0HiMEH+BEGCLBCZBAALQQQhBUEEIQYLAkAgBCAFaiIBKAIAIgQNAEEAIQQgAkEBcUUNACABIAAgACAGEN4BEH4iBDYCACAEDQBBACEEDAELIAJBAnENACAEDQAgACAGEN4BIQQLIANB0ABqJAAgBA8LQeIwQb4EQYIsEJkEAAtB5cEAQeIwQd8EQYIsEJ4EAAu2AwIEfwF+IwBBMGsiBCQAQQAhBUHgzgBBqAFqQQBB4M4AQbABaigCABshBgJAA0AgAkUNAQJAAkAgAkHgzgBrQQxtQSBLDQAgBCADKQMANwMIIARBKGogASACIARBCGoQ6AFBASEHIARBKGohBQwBCwJAAkAgAiABKAKYASIHIAcoAmBqayAHLwEOQQR0Tw0AIAQgAykDADcDECAEQSBqIAEgAiAEQRBqEOcBIAQgBCkDICIINwMoAkAgCEIAUQ0AQQEhByAEQShqIQUMAwsCQCABKAKsAQ0AIAFBIBB5IQIgAUEIOgA8IAEgAjYCrAEgAg0AQQAhAgwCCyABKAKsASgCFCICDQECQCABQQlBEBB4IgINAEEAIQIMAgsgASgCrAEgAjYCFCACIAY2AgQMAQsCQAJAIAItAANBD3FBfGoOBgEAAAAAAQALQf/EAEHiMEHrBUGZKRCeBAALIAQgAykDADcDGEEBIQcgASACIARBGGoQ4QEiBQ0BIAIoAgQhAkEAIQULQQAhBwsgB0UNAAsLAkACQCAFDQAgAEIANwMADAELIAAgBSkDADcDAAsgBEEwaiQAC6ACAQh/AkAgACgCqAEgAUEMbGooAgQiAg0AAkAgAEEJQRAQeCICDQBBAA8LQQAhA0EAIQQCQCAAKACYASIFQTxqKAIAQQN2IAFNDQBBACEEIAUvAQ4iBkUNACAAKACYASIFIAUoAjhqIAFBA3RqKAIAIQcgBSAFKAJgaiEIQQAhBQNAIAggBUEEdGoiCSAEIAkoAgQiCSAHRhshBCAJIAdGDQEgBUEBaiIFIAZHDQALQQAhBAsgAiAENgIEIAAoAJgBQTxqKAIAQQhJDQAgACgCqAEiBCABQQxsaigCACgCCCEHA0ACQCAEIANBDGxqIgUoAgAoAgggB0cNACAFIAI2AgQLIANBAWoiAyAAKACYAUE8aigCAEEDdkkNAAsLIAILYwEBfyMAQRBrIgIkACACIAEpAwA3AwgCQCAAIAJBCGpBARDtASIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB48QAQeIwQZIFQfkJEJ4EAAsgAEIANwMwIAJBEGokACABC50DAQJ/IwBB4ABrIgMkAEEAIQQCQCACQQZxQQJGDQAgACABEN4BIQECQCACQQFxDQAgASEEDAELAkACQCACQQRxRQ0AAkAgAUHgzgBrQQxtQSBLDQBBxA8QpwQhAgJAIAApADBCAFINACADQe0gNgIwIAMgAjYCNCADQdgAaiAAQeoTIANBMGoQrQIMAwsgAyAAQTBqKQMANwNQIAAgA0HQAGoQkgIhASADQe0gNgJAIAMgATYCRCADIAI2AkggA0HYAGogAEH6EyADQcAAahCtAgwCCwJAAkAgAQ0AQQAhAgwBCyABLQADQQ9xIQILIAEhBAJAIAJBfGoOBgMAAAAAAwALQfDEAEHiMEH5A0GqGhCeBAALQa4kEKcEIQICQCAAKQAwQgBSDQAgA0HtIDYCACADIAI2AgQgA0HYAGogAEHqEyADEK0CDAELIAMgAEEwaikDADcDKCAAIANBKGoQkgIhASADQe0gNgIQIAMgATYCFCADIAI2AhggA0HYAGogAEH6EyADQRBqEK0CCyACECELIANB4ABqJAAgBAs1AQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGpBAhDtASEBIABCADcDMCACQRBqJAAgAQufAgEBfwJAAkAgAUHgzgBrQQxtQSBLDQAgASgCBCECDAELAkAgASAAKAKYASICIAIoAmBqayACLwEOQQR0Tw0AAkAgACgCrAENACAAQSAQeSECIABBCDoAPCAAIAI2AqwBIAINAEEAIQIMAgsgACgCrAEoAhQiAg0BAkAgAEEJQRAQeCICDQBBACECDAILIAAoAqwBIAI2AhQgAkHgzgBBqAFqQQBB4M4AQbABaigCABs2AgQMAQsCQAJAIAENAEEAIQIMAQsgAS0AA0EPcSECCwJAAkAgAkF8ag4GAQAAAAABAAtBrsUAQeIwQasFQZQaEJ4EAAsgASgCBA8LQQAgAkHgzgBBGGpBAEHgzgBBIGooAgAbIAIbIgIgAiABRhsLiwICAn8CfiMAQdAAayICJAAgASkDACEEIAJBMGpBNBCgAiACIAQ3AzggAiACKQMwIgU3A0AgACAFNwMwIAIgBDcDICACIAQ3A0hBACEBIAAgAkEgakEAEO0BIQMgAEIANwMwIAIgAikDQDcDGCACQcgAaiAAIAMgAkEYahDuASACIAIpAzg3AxAgAiACKQNINwMIIAJBKGogACACQRBqIAJBCGoQ6QECQAJAIAIpAyhCAFINACACQcgAaiAAQYgmQQAQrQIMAQsgAiACKQMoIgQ3A0ggAiAENwMAIAAgAkECEO0BIQEgAEIANwMwIAENACACQcgAaiAAQZYmQQAQrQILIAJB0ABqJAAgAQukAQIBfwF+IwBBwABrIgQkACAEQSBqIAMQoAIgBCAEKQMgIgU3AzAgBCACKQMANwMoIAEgBTcDMCAEIAQpAygiBTcDGCAEIAU3AzggASAEQRhqQQAQ7QEhAiABQgA3AzAgBCAEKQMwNwMQIARBOGogASACIARBEGoQ7gEgBCAEKQMoNwMIIAQgBCkDODcDACAAIAEgBEEIaiAEEOkBIARBwABqJAALvQECBH8BfiMAQSBrIgMkAAJAAkAgAg0AQQAhBAwBCyADIAEpAwAiBzcDECADIAc3AxhBACEEIAAgA0EQakEAEO0BIQUgAEIANwMwIAMgASkDACIHNwMIIAMgBzcDGCAAIANBCGpBAhDtASEGIABCADcDMEEAIQECQCAFRQ0AAkAgBSAGRg0AIAUhAQwBCyAAIAUQ8wEhAQsgAUUNAANAIAEgAkYiBA0BIAAgARDzASIBDQALCyADQSBqJAAgBAuIAQICfwF+IwBBMGsiBCQAIAEgAykDADcDMCAEIAIpAwAiBjcDICAEIAY3AyggASAEQSBqQQAQ7QEhBSABQgA3AzAgBCADKQMANwMYIARBKGogASAFIARBGGoQ7gEgBCACKQMANwMQIAQgBCkDKDcDCCAAIAEgBEEQaiAEQQhqEOkBIARBMGokAAvrAQECfyMAQSBrIgQkAAJAAkAgA0GB4ANJDQAgAEIANwMADAELIAQgAikDADcDEAJAIAEgBEEQaiAEQRxqEMcCIgVFDQAgBCgCHCADTQ0AIAQgAikDADcDACAFIANqIQMCQCABIAQQnQJFDQAgACABQQggASADQQEQggEQwAIMAgsgACADLQAAEL4CDAELIAQgAikDADcDCAJAIAEgBEEIahDIAiIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBIGokAAvEBAIBfwF+IwBBsAFrIgQkACAEIAMpAwA3A5ABAkACQCAEQZABahCeAkUNACAEIAIpAwAiBTcDiAEgBCAFNwOoAQJAIAEgBEGIAWoQyQINACAEIAQpA6gBNwOAASABIARBgAFqEMQCDQAgBCAEKQOoATcDeCABIARB+ABqEJ0CRQ0BCyAEIAMpAwA3AxAgASAEQRBqEMICIQMgBCACKQMANwMIIAAgASAEQQhqIAMQ+AEMAQsgBCADKQMANwNwAkAgASAEQfAAahCdAkUNACAEIAMpAwAiBTcDoAEgBCACKQMANwOYASABIAU3AzAgBCAEKQOYASIFNwMwIAQgBTcDqAEgASAEQTBqQQAQ7QEhAyABQgA3AzAgBCAEKQOgATcDKCAEQagBaiABIAMgBEEoahDuASAEIAQpA5gBNwMgIAQgBCkDqAE3AxggACABIARBIGogBEEYahDpAQwBCyAEIAMpAwA3A2ggBEGoAWogASAEQegAahCkAiADIAQpA6gBNwMAIAQgAykDADcDYCABIARB4ABqEHwgBCADKQMAIgU3A6ABIAQgAikDADcDmAEgASAFNwMwIAQgBCkDmAEiBTcDWCAEIAU3A6gBIAEgBEHYAGpBABDtASECIAFCADcDMCAEIAQpA6ABNwNQIARBqAFqIAEgAiAEQdAAahDuASAEIAQpA5gBNwNIIAQgBCkDqAE3A0AgACABIARByABqIARBwABqEOkBIAQgAykDADcDOCABIARBOGoQfQsgBEGwAWokAAvjAwIBfwF+IwBBkAFrIgQkACAEIAIpAwA3A4ABAkACQCAEQYABahCeAkUNACAEIAEpAwAiBTcDeCAEIAU3A4gBAkAgACAEQfgAahDJAg0AIAQgBCkDiAE3A3AgACAEQfAAahDEAg0AIAQgBCkDiAE3A2ggACAEQegAahCdAkUNAQsgBCACKQMANwMYIAAgBEEYahDCAiECIAQgASkDADcDECAEIAMpAwA3AwggACAEQRBqIAIgBEEIahD7AQwBCyAAIAIpAwA3AzAgBCABKQMAIgU3A2AgBCAFNwOIAQJAIAAgBEHgAGpBARDtASIBRQ0AAkAgAS0AA0EPcUF8ag4GAQAAAAABAAtB48QAQeIwQZIFQfkJEJ4EAAsgAEIANwMwIAFFDQAgBCACKQMANwNYAkAgACAEQdgAahCdAkUNACAEIAIpAwA3AyggBCADKQMANwMgIAAgASAEQShqIARBIGoQ3wEMAQsgBCACKQMANwNQIARBiAFqIAAgBEHQAGoQpAIgAiAEKQOIATcDACAEIAIpAwA3A0ggACAEQcgAahB8IAQgAikDADcDQCAEIAMpAwA3AzggACABIARBwABqIARBOGoQ3wEgBCACKQMANwMwIAAgBEEwahB9CyAEQZABaiQAC7MDAgR/AX4jAEHQAGsiBCQAAkACQCACQYHgA0kNACAEQcgAaiAAQQ8QswIMAQsgBCABKQMANwM4AkAgACAEQThqEMUCRQ0AIAQgASkDADcDICAAIARBIGogBEHEAGoQxgIhAQJAIAQoAkQiBSACTQ0AIAQgAykDADcDCCABIAJqIAAgBEEIahDCAjoAAAwCCyAEIAI2AhAgBCAFNgIUIARByABqIABBiQsgBEEQahCvAgwBCyAEIAEpAwA3AzACQCAAIARBMGoQyAIiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AAkAgAkGBPEkNACAEQcgAaiAAQQ8QswIMAgsgAykDACEIAkAgAkEBaiIDIAEvAQpNDQAgACADQQpsQQhtIgVBBCAFQQRKGyIGQQN0EHkiBUUNAgJAIAEoAgwiB0UNACAFIAcgAS8BCEEDdBC+BBoLIAEgBjsBCiABIAU2AgwgACgC0AEgBRB6CyABKAIMIAJBA3RqIAg3AwAgAS8BCCACSw0BIAEgAzsBCAwBCyAEIAMpAwA3AyggBEHIAGogAEEPIARBKGoQsQILIARB0ABqJAALuwEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQQ8QswIMAQsCQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBCG0iBkEEIAZBBEobIgdBA3QQeSIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0EL4EGgsgASAHOwEKIAEgBjYCDCAAKALQASAGEHoLIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQAgASAFOwEICyAEQRBqJAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHQAGopAwAiAzcDACACIAM3AwggACACEMICIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQdAAaikDACIDNwMAIAIgAzcDCCAAIAIQwQIhBCACQRBqJAAgBAssAQF/IwBBEGsiAiQAIAJBCGogARC9AiAAKAKgASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARC+AiAAKAKgASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARC/AiAAKAKgASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQwAIgACgCoAEgAikDCDcDICACQRBqJAALdgIDfwF+IwBBIGsiASQAIAEgACkDSCIENwMIIAEgBDcDGAJAAkAgACABQQhqEMgCIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkAgA0F8ag4GAQAAAAABAAtBACECIAFBEGogAEGDK0EAEK0CCyABQSBqJAAgAgssAQF/AkAgACgCLCIDKAKgAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAsyAQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGoQygIhACACQRBqJAAgAEF+akEESQtNAQF/AkAgAkEhSQ0AIABCADcDAA8LAkAgASACEN4BIgNB4M4Aa0EMbUEgSw0AIABBADYCBCAAIAJB4ABqNgIADwsgACABQQggAxDAAgskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECELIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIFQRRHDQALQQAhBQsCQCAFDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQIQsgB0EAOgAAIAAgBmpBADsBAgsgBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAgNgIICwJAAkAgACAALwHgAyIDQRhsaiAFRw0AIAUhAwwBCwJAIABBACADQQFqIANBEksbIgJBGGxqIgMgBUYNACAEQQhqQRBqIgEgBUEQaiIGKQIANwMAIARBCGpBCGoiByAFQQhqIggpAgA3AwAgBCAFKQIANwMIIAYgA0EQaiIJKQIANwIAIAggA0EIaiIGKQIANwIAIAUgAykCADcCACAJIAEpAwA3AgAgBiAHKQMANwIAIAMgBCkDCDcCAAsgACACOwHgAwsgBEEgaiQAIAMPC0HZPUGFNUElQZcvEJ4EAAtoAQV/QQAhBAJAA0ACQAJAIAAgBEEYbCIFaiIGLwEAIAFHDQAgACAFaiIHLwECIAJHDQBBACEFIAcvARYgA0YNAQtBASEFIAghBgsgBUUNASAGIQggBEEBaiIEQRRHDQALQQAhBgsgBgtAAQJ/QQAhAwNAAkAgACADQRhsaiIELwEAIAFHDQAgBCgCBCACTQ0AIARBBGogAjYCAAsgA0EBaiIDQRRHDQALC1UBA39BACECA0ACQCAAIAJBGGxqIgMvAQAgAUcNACADQRRqIQQCQCADLQAUQQpJDQAgAygCCBAhCyAEQQA6AAAgA0EAOwECCyACQQFqIgJBFEcNAAsLSQACQCACRQ0AIAMgACADGyIDIABB4ANqIgBPDQADQAJAIAMvAQIgAkcNACADLwEAIAFHDQAgAw8LIANBGGoiAyAASQ0ACwtBAAtUAQN/IwBBIGsiASQAQQAhAgJAIAAgAUEgECUiA0EASA0AIANBAWoQICECAkAgA0EgSg0AIAIgASADEL4EGgwBCyAAIAIgAxAlGgsgAUEgaiQAIAILHQACQCABDQAgACABQQAQJg8LIAAgASABEOQEECYLiwIBAn8jAEHAAGsiAyQAIAMgAikDADcDOCADIAAgA0E4ahCSAjYCNCADIAE2AjBByhQgA0EwahAtIAMgAikDADcDKAJAAkAgACADQShqEMgCIgENAEEAIQIMAQsgAS0AA0EPcSECCwJAAkAgAkF8ag4GAAEBAQEAAQsgAS8BCEUNAEEAIQIDQAJAIAJBC0cNAEHJwgBBABAtDAILIAMgASgCDCACQQR0IgRqKQMANwMgIAMgACADQSBqEJICNgIQQYQ8IANBEGoQLSADIAEoAgwgBGpBCGopAwA3AwggAyAAIANBCGoQkgI2AgBB6RUgAxAtIAJBAWoiAiABLwEISQ0ACwsgA0HAAGokAAvTAwEDfyMAQeAAayICJAACQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbIgNBCksNAEEBIAN0QagMcQ0BIANBCEcNACABKAIAIgNFDQAgAygCAEGAgID4AHFBgICAOEYNAQsgAiABKQMANwMIIAAgAkEIakEAEJ8CIgMNASACIAEpAwA3AwAgACACEJMCIQMMAQsgAiABKQMANwNAIAAgAkHAAGogAkHYAGogAkHUAGoQ6wEhAwJAAkAgAikDWFBFDQBBACEBDAELIAIgAikDWDcDOAJAIAAgAkE4ahCTAiIBQfDFAUYNACACIAE2AjBB8MUBQcAAQe0VIAJBMGoQogQaCwJAQfDFARDkBCIBQSdJDQBBAEEALQDIQjoA8sUBQQBBAC8AxkI7AfDFAUECIQEMAQsgAUHwxQFqQS46AAAgAUEBaiEBCwJAIAIoAlQiBEUNACACQcgAaiAAQQggBBDAAiACIAIoAkg2AiAgAUHwxQFqQcAAIAFrQfYJIAJBIGoQogQaQfDFARDkBCIBQfDFAWpBwAA6AAAgAUEBaiEBCyACIAM2AhBB8MUBIQMgAUHwxQFqQcAAIAFrQegtIAJBEGoQogQaCyACQeAAaiQAIAMLjAYBA38jAEGQAWsiAiQAAkACQCABKAIEIgNBf0cNACACIAEoAgA2AgBB8MUBIQNB8MUBQcAAQeIuIAIQogQaDAELQQAhBAJAAkACQAJAAkACQAJAAkACQAJAAkACQEEQIANBD3EgAUEGai8BAEHw/wFxGw4RAQoEAgMGBQsJCAcLCwsLCwALCyACIAEpAwA3AyggAiAAIAJBKGoQwQI5AyBB8MUBIQNB8MUBQcAAQeIiIAJBIGoQogQaDAsLQecdIQMCQAJAAkACQAJAAkACQCABKAIAIgEOAxEBBQALIAFBQGoOBAEFAgMFC0G/JSEDDA8LQcUkIQMMDgtBigghAwwNC0GJCCEDDAwLQYM6IQMMCwsCQCABQaB/aiIDQSBLDQAgAiADNgIwQfDFASEDQfDFAUHAAEHvLSACQTBqEKIEGgwLC0HNHiEDIAFBgAhJDQogAiABQQ9xNgJEIAIgAUGAeGpBBHY2AkBB8MUBIQNB8MUBQcAAQdYKIAJBwABqEKIEGgwKC0HyGiEEDAgLQYMiQfkVIAEoAgBBgIABSRshBAwHC0GfJyEEDAYLQZ8YIQQMBQsgAiABKAIANgJUIAIgA0EEdkH//wNxNgJQQfDFASEDQfDFAUHAAEG2CSACQdAAahCiBBoMBQsgAiABKAIANgJkIAIgA0EEdkH//wNxNgJgQfDFASEDQfDFAUHAAEGHGiACQeAAahCiBBoMBAsgAiABKAIANgJ0IAIgA0EEdkH//wNxNgJwQfDFASEDQfDFAUHAAEH5GSACQfAAahCiBBoMAwsCQAJAIAEoAgAiAQ0AQX8hBAwBCyABLQADQQ9xQX9qIQQLQYA8IQMCQCAEQQlLDQAgBEECdEG41gBqKAIAIQMLIAIgATYChAEgAiADNgKAAUHwxQEhA0HwxQFBwABB8xkgAkGAAWoQogQaDAILQec1IQQLAkAgBA0AQdYkIQMMAQsgAiABKAIANgIUIAIgBDYCEEHwxQEhA0HwxQFBwABBpAsgAkEQahCiBBoLIAJBkAFqJAAgAwuhBAEMfyMAQeAAayICQcAAakEYaiAAQRhqKQIANwMAIAJBwABqQRBqIABBEGopAgA3AwAgAiAAKQIANwNAIAIgAEEIaikCADcDSEEAIQMDQCADQQR0IQRBACEFA0ACQAJAIAMNACACIAVBAnRqIAEoAAAiBkEYdCAGQQh0QYCA/AdxciAGQQh2QYD+A3EgBkEYdnJyNgIAIAFBBGohAQwBCyACIAVBAnRqIgcgAiAFQQFqQQ9xQQJ0aigCACIGQRl3IAZBDndzIAZBA3ZzIAcoAgBqIAIgBUEJakEPcUECdGooAgBqIAIgBUEOakEPcUECdGooAgAiBkEPdyAGQQ13cyAGQQp2c2o2AgALIAIoAlwhCCACIAIoAlgiCTYCXCACIAIoAlQiCjYCWCACIAIoAlAiBjYCVCACKAJMIQsgAiACKAJIIgw2AkwgAiACKAJEIg02AkggAiACKAJAIgc2AkQgAiALIAggBkEadyAGQRV3cyAGQQd3cyAKIAZxamogCSAGQX9zcWogBSAEckECdEHg1gBqKAIAaiACIAVBAnRqKAIAaiIGajYCUCACIAdBHncgB0ETd3MgB0EKd3MgBmogByAMIA1zcSAMIA1xc2o2AkAgBUEBaiIFQRBHDQALIANBAWoiA0EERw0AC0EAIQUDQCAAIAVBAnQiBmoiByAHKAIAIAJBwABqIAZqKAIAajYCACAFQQFqIgVBCEcNAAsLpwIBBX8gACgCSCEBIAAoAkQiAkGAAToAACAAQdAAaiEDIAJBAWohAgJAIAFBf2oiAUEHSw0AIAJBACABEMAEGiADIABBBGoiAhCUAkHAACEBCyACQQAgAUF4aiIBEMAEIAFqIgQgACgCTCICQQN0OgAHIAJBBXYhAkEGIQUDQCAEIAUiAWogAjoAACABQX9qIQUgAkEIdiECIAENAAsgAyAAQQRqEJQCIAAoAgAhAUEAIQJBACEFA0AgASACaiAAIAVBAnRqIgRB0wBqLQAAOgAAIAEgAkEBcmogBEHSAGovAQA6AAAgASACQQJyaiAEQdAAaiIEKAIAQQh2OgAAIAEgAkEDcmogBCgCADoAACACQQRqIQIgBUEBaiIFQQhHDQALIAAoAgALkAEAECMCQEEALQCwxgFFDQBBzDVBDkHTGBCZBAALQQBBAToAsMYBECRBAEKrs4/8kaOz8NsANwKcxwFBAEL/pLmIxZHagpt/NwKUxwFBAELy5rvjo6f9p6V/NwKMxwFBAELnzKfQ1tDrs7t/NwKExwFBAELAADcC/MYBQQBBuMYBNgL4xgFBAEGwxwE2ArTGAQvVAQECfwJAIAFFDQBBAEEAKAKAxwEgAWo2AoDHAQNAAkBBACgC/MYBIgJBwABHDQAgAUHAAEkNAEGExwEgABCUAiAAQcAAaiEAIAFBQGoiAQ0BDAILQQAoAvjGASAAIAEgAiABIAJJGyICEL4EGkEAQQAoAvzGASIDIAJrNgL8xgEgACACaiEAIAEgAmshAQJAIAMgAkcNAEGExwFBuMYBEJQCQQBBwAA2AvzGAUEAQbjGATYC+MYBIAENAQwCC0EAQQAoAvjGASACajYC+MYBIAENAAsLC0wAQbTGARCVAhogAEEYakEAKQPIxwE3AAAgAEEQakEAKQPAxwE3AAAgAEEIakEAKQO4xwE3AAAgAEEAKQOwxwE3AABBAEEAOgCwxgELkwcBAn9BACECQQBCADcDiMgBQQBCADcDgMgBQQBCADcD+McBQQBCADcD8McBQQBCADcD6McBQQBCADcD4McBQQBCADcD2McBQQBCADcD0McBAkACQAJAAkAgAUHBAEkNABAjQQAtALDGAQ0CQQBBAToAsMYBECRBACABNgKAxwFBAEHAADYC/MYBQQBBuMYBNgL4xgFBAEGwxwE2ArTGAUEAQquzj/yRo7Pw2wA3ApzHAUEAQv+kuYjFkdqCm383ApTHAUEAQvLmu+Ojp/2npX83AozHAUEAQufMp9DW0Ouzu383AoTHAQJAA0ACQEEAKAL8xgEiAkHAAEcNACABQcAASQ0AQYTHASAAEJQCIABBwABqIQAgAUFAaiIBDQEMAgtBACgC+MYBIAAgASACIAEgAkkbIgIQvgQaQQBBACgC/MYBIgMgAms2AvzGASAAIAJqIQAgASACayEBAkAgAyACRw0AQYTHAUG4xgEQlAJBAEHAADYC/MYBQQBBuMYBNgL4xgEgAQ0BDAILQQBBACgC+MYBIAJqNgL4xgEgAQ0ACwtBtMYBEJUCGkEAIQJBAEEAKQPIxwE3A+jHAUEAQQApA8DHATcD4McBQQBBACkDuMcBNwPYxwFBAEEAKQOwxwE3A9DHAUEAQQA6ALDGAQwBC0HQxwEgACABEL4EGgsDQCACQdDHAWoiASABLQAAQTZzOgAAIAJBAWoiAkHAAEcNAAwCCwALQcw1QQ5B0xgQmQQACxAjAkBBAC0AsMYBDQBBAEEBOgCwxgEQJEEAQsCAgIDwzPmE6gA3AoDHAUEAQcAANgL8xgFBAEG4xgE2AvjGAUEAQbDHATYCtMYBQQBBmZqD3wU2AqDHAUEAQozRldi5tfbBHzcCmMcBQQBCuuq/qvrPlIfRADcCkMcBQQBChd2e26vuvLc8NwKIxwFB0McBIQFBwAAhAgJAA0ACQEEAKAL8xgEiAEHAAEcNACACQcAASQ0AQYTHASABEJQCIAFBwABqIQEgAkFAaiICDQEMAgtBACgC+MYBIAEgAiAAIAIgAEkbIgAQvgQaQQBBACgC/MYBIgMgAGs2AvzGASABIABqIQEgAiAAayECAkAgAyAARw0AQYTHAUG4xgEQlAJBAEHAADYC/MYBQQBBuMYBNgL4xgEgAg0BDAILQQBBACgC+MYBIABqNgL4xgEgAg0ACwsPC0HMNUEOQdMYEJkEAAu7BgEEf0G0xgEQlQIaQQAhASAAQRhqQQApA8jHATcAACAAQRBqQQApA8DHATcAACAAQQhqQQApA7jHATcAACAAQQApA7DHATcAAEEAQQA6ALDGARAjAkBBAC0AsMYBDQBBAEEBOgCwxgEQJEEAQquzj/yRo7Pw2wA3ApzHAUEAQv+kuYjFkdqCm383ApTHAUEAQvLmu+Ojp/2npX83AozHAUEAQufMp9DW0Ouzu383AoTHAUEAQsAANwL8xgFBAEG4xgE2AvjGAUEAQbDHATYCtMYBA0AgAUHQxwFqIgIgAi0AAEHqAHM6AAAgAUEBaiIBQcAARw0AC0EAQcAANgKAxwFB0McBIQJBwAAhAQJAA0ACQEEAKAL8xgEiA0HAAEcNACABQcAASQ0AQYTHASACEJQCIAJBwABqIQIgAUFAaiIBDQEMAgtBACgC+MYBIAIgASADIAEgA0kbIgMQvgQaQQBBACgC/MYBIgQgA2s2AvzGASACIANqIQIgASADayEBAkAgBCADRw0AQYTHAUG4xgEQlAJBAEHAADYC/MYBQQBBuMYBNgL4xgEgAQ0BDAILQQBBACgC+MYBIANqNgL4xgEgAQ0ACwtBICEBQQBBACgCgMcBQSBqNgKAxwEgACECAkADQAJAQQAoAvzGASIDQcAARw0AIAFBwABJDQBBhMcBIAIQlAIgAkHAAGohAiABQUBqIgENAQwCC0EAKAL4xgEgAiABIAMgASADSRsiAxC+BBpBAEEAKAL8xgEiBCADazYC/MYBIAIgA2ohAiABIANrIQECQCAEIANHDQBBhMcBQbjGARCUAkEAQcAANgL8xgFBAEG4xgE2AvjGASABDQEMAgtBAEEAKAL4xgEgA2o2AvjGASABDQALC0G0xgEQlQIaIABBGGpBACkDyMcBNwAAIABBEGpBACkDwMcBNwAAIABBCGpBACkDuMcBNwAAIABBACkDsMcBNwAAQQBCADcD0McBQQBCADcD2McBQQBCADcD4McBQQBCADcD6McBQQBCADcD8McBQQBCADcD+McBQQBCADcDgMgBQQBCADcDiMgBQQBBADoAsMYBDwtBzDVBDkHTGBCZBAAL4wYAIAAgARCZAgJAIANFDQBBAEEAKAKAxwEgA2o2AoDHAQNAAkBBACgC/MYBIgBBwABHDQAgA0HAAEkNAEGExwEgAhCUAiACQcAAaiECIANBQGoiAw0BDAILQQAoAvjGASACIAMgACADIABJGyIAEL4EGkEAQQAoAvzGASIBIABrNgL8xgEgAiAAaiECIAMgAGshAwJAIAEgAEcNAEGExwFBuMYBEJQCQQBBwAA2AvzGAUEAQbjGATYC+MYBIAMNAQwCC0EAQQAoAvjGASAAajYC+MYBIAMNAAsLIAgQmgIgCEEgEJkCAkAgBUUNAEEAQQAoAoDHASAFajYCgMcBA0ACQEEAKAL8xgEiA0HAAEcNACAFQcAASQ0AQYTHASAEEJQCIARBwABqIQQgBUFAaiIFDQEMAgtBACgC+MYBIAQgBSADIAUgA0kbIgMQvgQaQQBBACgC/MYBIgIgA2s2AvzGASAEIANqIQQgBSADayEFAkAgAiADRw0AQYTHAUG4xgEQlAJBAEHAADYC/MYBQQBBuMYBNgL4xgEgBQ0BDAILQQBBACgC+MYBIANqNgL4xgEgBQ0ACwsCQCAHRQ0AQQBBACgCgMcBIAdqNgKAxwEDQAJAQQAoAvzGASIDQcAARw0AIAdBwABJDQBBhMcBIAYQlAIgBkHAAGohBiAHQUBqIgcNAQwCC0EAKAL4xgEgBiAHIAMgByADSRsiAxC+BBpBAEEAKAL8xgEiBSADazYC/MYBIAYgA2ohBiAHIANrIQcCQCAFIANHDQBBhMcBQbjGARCUAkEAQcAANgL8xgFBAEG4xgE2AvjGASAHDQEMAgtBAEEAKAL4xgEgA2o2AvjGASAHDQALC0EBIQNBAEEAKAKAxwFBAWo2AoDHAUHvyAAhBQJAA0ACQEEAKAL8xgEiB0HAAEcNACADQcAASQ0AQYTHASAFEJQCIAVBwABqIQUgA0FAaiIDDQEMAgtBACgC+MYBIAUgAyAHIAMgB0kbIgcQvgQaQQBBACgC/MYBIgIgB2s2AvzGASAFIAdqIQUgAyAHayEDAkAgAiAHRw0AQYTHAUG4xgEQlAJBAEHAADYC/MYBQQBBuMYBNgL4xgEgAw0BDAILQQBBACgC+MYBIAdqNgL4xgEgAw0ACwsgCBCaAgv4BQIHfwF+IwBB8ABrIggkAAJAIARFDQAgA0EAOgAAC0EAIQlBACEKA0BBACELAkAgCSACRg0AIAEgCWotAAAhCwsgCUEBaiEMAkACQAJAAkACQCALQf8BcSINQfsARw0AIAwgAkkNAQsCQCANQf0ARg0AIAwhCQwDCyAMIAJJDQEgDCEJDAILIAlBAmohCSABIAxqLQAAIgtB+wBGDQECQAJAIAtBUGpB/wFxQQlLDQAgC0EYdEEYdUFQaiEMDAELQX8hDCALQSByIgtBn39qQf8BcUEZSw0AIAtBGHRBGHVBqX9qIQwLAkAgDEEATg0AQSEhCwwCCyAJIQsCQCAJIAJPDQADQCABIAtqLQAAQf0ARg0BIAtBAWoiCyACRw0ACyACIQsLQX8hDQJAIAkgC08NAAJAIAEgCWosAAAiCUFQaiIOQf8BcUEJSw0AIA4hDQwBCyAJQSByIglBn39qQf8BcUEZSw0AIAlBqX9qIQ0LIAtBAWohCUE/IQsgDCAGTg0BIAggBSAMQQN0aiILKQMAIg83AxggCCAPNwNgAkACQCAIQRhqEJ4CRQ0AIAggCykDADcDACAIQSBqIAAgCBDBAkEHIA1BAWogDUEASBsQoQQgCCAIQSBqEOQENgJsIAhBIGohCwwBCyAIIAgpA2A3AxAgCEEgaiAAIAhBEGoQpAIgCCAIKQMgNwMIIAAgCEEIaiAIQewAahCfAiELCyAIIAgoAmwiDEF/ajYCbCAMRQ0CA0ACQAJAIAcNAAJAIAogBE8NACADIApqIAstAAA6AAALIApBAWohCkEAIQcMAQsgB0F/aiEHCyALQQFqIQsgCCAIKAJsIgxBf2o2AmwgDA0ADAMLAAsgCUECaiAMIAEgDGotAABB/QBGGyEJCwJAIAcNAAJAIAogBE8NACADIApqIAs6AAALIApBAWohCkEAIQcMAQsgB0F/aiEHCyAJIAJNDQALAkAgBEUNACAEIANqQX9qQQA6AAALIAhB8ABqJAAgCgtdAQJ/QQAhAgJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRtBfGoOBQECAgIAAgsgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgDBGDwsgASgCAEH//wBLIQILIAILGQAgACgCBCIAQX9GIABBgIDA/wdxQQBHcguDAQECf0EAIQMCQAJAAkBBECABKAIEIgRBD3EgBEGAgMD/B3EbQXxqDgUBAgICAAILIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAwRw0BAkAgAkUNACACIAEvAQQ2AgALIAFBBmoPCyABKAIAIgFBgIABSQ0AIAAgASACENUCIQMLIAMLFQAgAEEENgIEIAAgAUGAgAFyNgIAC3kBAn8jAEEQayIEJAAgBCADNgIMIAQgAzYCCAJAAkAgAUEAQQAgAiADEKAEIgVBf2oQgQEiAw0AIARBB2pBASACIAQoAggQoAQaIABCADcDAAwBCyADQQZqIAUgAiAEKAIIEKAEGiAAIAFBCCADEMACCyAEQRBqJAALJgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxChAiAEQRBqJAALJQACQCABIAIgAxCCASICDQAgAEIANwMADwsgACABQQggAhDAAgvpCAEEfyMAQYACayIDJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAQRAgAigCBCIEQQ9xIARBgIDA/wdxGyIFDhEEBQsGAQgMDQAHCA0NDQ0NDg0LIAIoAgAiBkUNAiAGKAIAQYCAgPgAcUGAgIAwRiEGDAELIAIoAgBB//8ASyEGCyAGRQ0AIAAgAikDADcDAAwMCyAFDhEAAQcCBgQICQUDBAkJCQkJCgkLAkACQAJAAkACQAJAAkACQCACKAIAIgIOAwECBAALIAJBQGoOBAIGBAUGCyAAQqqAgYDAADcDAAwQCyAAQpiAgYDAADcDAAwPCyAAQsWAgYDAADcDAAwOCyAAQomAgYDAADcDAAwNCyAAQoSAgYDAADcDAAwMCyAAQoGAgYDAADcDAAwLCwJAIAJBoH9qIgRBIEsNACADIAQ2AhAgACABQc43IANBEGoQogIMCwsCQCACQYAISQ0AIAMgAjYCICAAIAFBqDYgA0EgahCiAgwLC0GlM0H8AEGOIRCZBAALIAMgAigCADYCMCAAIAFBtDYgA0EwahCiAgwJCyACKAIAIQIgAyABKAKYATYCTCADIANBzABqIAIQajYCQCAAIAFB3zYgA0HAAGoQogIMCAsgAyABKAKYATYCXCADIANB3ABqIARBBHZB//8DcRBqNgJQIAAgAUHuNiADQdAAahCiAgwHCyADIAEoApgBNgJkIAMgA0HkAGogBEEEdkH//wNxEGo2AmAgACABQYc3IANB4ABqEKICDAYLAkACQCACKAIAIgQNAEEAIQUMAQsgBC0AA0EPcSEFCwJAAkACQAJAAkACQCAFQX1qDggABAIFAQUEAwULIABCj4CBgMAANwMADAoLIABCnICBgMAANwMADAkLIAMgAikDADcDaCAAIAEgA0HoAGoQpQIMCAsgBC8BEiECIAMgASgCmAE2AoQBIANBhAFqIAIQayECIAQvARAhBSADIAQoAhwvAQQ2AnggAyAFNgJ0IAMgAjYCcCAAIAFBsjcgA0HwAGoQogIMBwsgAEKmgIGAwAA3AwAMBgtBpTNBnwFBjiEQmQQACyACKAIAQYCAAU8NBSADIAIpAwA3A4gBIAAgASADQYgBahClAgwECyACKAIAIQIgAyABKAKYATYCnAEgAyADQZwBaiACEGs2ApABIAAgAUH8NiADQZABahCiAgwDCyADIAIpAwA3A7gBIAEgA0G4AWogA0HAAWoQ5QEhAiADIAEoApgBNgK0ASADQbQBaiADKALAARBrIQQgAi8BACECIAMgASgCmAE2ArABIAMgA0GwAWogAkEAENQCNgKkASADIAQ2AqABIAAgAUHRNiADQaABahCiAgwCC0GlM0GuAUGOIRCZBAALIAMgAikDADcDCCADQcABaiABIANBCGoQwQJBBxChBCADIANBwAFqNgIAIAAgAUHtFSADEKICCyADQYACaiQADwtB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DAELIAdBf2ohCEEBIQwLIAwNAAsLIAVFDQEgACgCJCIBRQ0BIANBEGohDANAAkAgASgCBCACRw0AAkAgAS0ACSIIRQ0AIAEgCEF/ajoACQsCQCAMIAMtAAwgBS8BCBBIIg29Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASANOQMYIAFBADYCICABQThqIA05AwAgAUEwaiANOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEHAkACQEEAKAKoywEiCyABQcQAaigCACIIa0EASA0AIAFBKGoiCyABKwMYIAggB2u4oiALKwMAoDkDAAwBCyABQShqIgggASsDGCALIAdruKIgCCsDAKA5AwAgCyEICyABIAg2AhQCQCABQThqKwMAIA1jRQ0AIAEgDTkDOAsCQCABQTBqKwMAIA1kRQ0AIAEgDTkDMAsgASANOQMYCyAAKAIIIghFDQAgAEEAKAKoywEgCGo2AhwLIAEoAgAiAQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNAANAAkACQCABKAIMIggNAEEAIQwMAQsgCCADKAIEEOMERSEMCwJAAkACQCABKAIEIAJHDQAgDA0CIAgQISADKAIEEKcEIQgMAQsgDEUNASAIECFBACEICyABIAg2AgwLIAEoAgAiAQ0ACwsPC0GQPUG7M0GVAkHGChCeBAALugEBA39ByAAQICICQf8BOgAKIAIgATYCBCACIAAoAiQ2AgAgACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoAqjLASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQ2AMiAEUNACACIAAoAgQQpwQ2AgwLIAJBySsQuAIgAgvpBgIIfwJ8IwBBEGsiASQAAkACQCAAKAIIRQ0AQQAoAqjLASAAKAIca0EATg0BCwJAIABBGGpBgMC4AhCbBEUNAAJAIAAoAiQiAkUNAANAAkAgAi0ACSACLQAIRw0AIAJBADoACQsgAiACLQAJOgAIIAIoAgAiAg0ACwsgACgCKCICRQ0AAkAgAiAAKAIMIgNPDQAgACACQdAPajYCKAsgACgCKCADTQ0AIAAgAzYCKAsCQCAAQRRqIgRBgKAGEJsERQ0AIAAoAiQiAkUNAANAAkAgAigCBCIDRQ0AIAItAAlBMUsNACABQfoBOgAPAkACQCADQYPAACABQQ9qQQEQ3wMiA0UNACAEQQAoApDDAUGAwABqNgIADAELIAIgAS0ADzoACQsgAw0CCyACKAIAIgINAAsLAkAgACgCJCICRQ0AIABBDGohBSAAQShqIQYDQAJAIAJBxABqKAIAIgNBACgCqMsBa0F/Sg0AAkACQAJAIAJBIGoiBCgCAA0AIAJCgICAgICAgPz/ADcDGAwBCyACKwMYIAMgAigCFGu4oiEJIAJBKGorAwAhCgJAAkAgAigCDCIDDQBBACEHDAELIAMQ5AQhBwsgCSAKoCEJIAdBKWoQICIDQSBqIARBIGopAwA3AwAgA0EYaiAEQRhqKQMANwMAIANBEGogBEEQaikDADcDACADQQhqIARBCGopAwA3AwAgAyAEKQMANwMAIAdBKGohBAJAIAIoAgwiCEUNACADQShqIAggBxC+BBoLIAMgCSACKAJEIAJBwABqKAIAa7ijOQMIIAAtAARBkAEgAyAEELYEIgQNAQJAIAIsAAoiB0F/Rw0AIABBEUEQIAIoAgwbai0AACEHCwJAIAdFDQAgAigCDCACKAIEIAMgACgCICgCCBEFAEUNACACQeUrELgCCyADECEgBA0CCyACQcAAaiACKAJEIgM2AgACQCACKAIQIgQNACAFIQQCQCAALQASRQ0AIAYhBCAGKAIADQAgBkGIJzYCACAGIQQLIAQoAgAhBAsgAkEANgIgIAIgAzYCFCACIAQgA2o2AkQgAkE4aiACKwMYIgk5AwAgAkEwaiAJOQMAIAJBKGpCADcDAAwBCyADECELIAIoAgAiAg0ACwsgAUEQaiQADwtBqg5BABAtEDMAC8QBAQJ/IwBBwABrIgIkAAJAAkAgACgCBCIDRQ0AIAJBO2ogA0EAIAMtAARrQQxsakFkaikDABCjBCAAKAIELQAEIQMCQCAAKAIMIgBFDQAgAiABNgIsIAIgAzYCKCACIAA2AiAgAiACQTtqNgIkQdMVIAJBIGoQLQwCCyACIAE2AhggAiADNgIUIAIgAkE7ajYCEEG5FSACQRBqEC0MAQsgACgCDCEAIAIgATYCBCACIAA2AgBBwxQgAhAtCyACQcAAaiQAC5sFAgJ/AXwCQAJAAkACQAJAAkAgAS8BDkGAf2oOBgAEBAECAwQLAkAgACgCJCIBRQ0AA0AgACABKAIAIgI2AiQgASgCDBAhIAEQISACIQEgAg0ACwsgAEEANgIoDwtBACECAkAgAS0ADCIDQQlJDQAgACABQRhqIANBeGoQugIhAgsgAkUNAyABKwMQIgS9Qv///////////wCDQoCAgICAgID4/wBWDQMCQCACKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgAiAEOQMYIAJBADYCICACQThqIAQ5AwAgAkEwaiAEOQMAIAJBKGpCADcDACACIAJBwABqKAIANgIUCyACIAIoAiBBAWo2AiAgAigCFCEAAkACQEEAKAKoywEiAyACQcQAaigCACIBa0EASA0AIAJBKGoiAyACKwMYIAEgAGu4oiADKwMAoDkDAAwBCyACQShqIgEgAisDGCADIABruKIgASsDAKA5AwAgAyEBCyACIAE2AhQCQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQugIhAgsgAkUNAiACIAEoAhAiAUGAuJkpIAFBgLiZKUkbNgIQDwtBACECAkAgAS0ADCIDQQJJDQAgACABQRFqIANBf2oQugIhAgsgAkUNASACIAEtABBBAEc6AAoPCwJAAkAgACABQeDYABCBBEH/fmoOBAACAgECCyAAIAAoAgwiAUGAuJkpIAFBgLiZKUkbNgIMDwsgACAAKAIIIgFBgLiZKSABQYC4mSlJGyIBNgIIIAFFDQAgAEEAKAKoywEgAWo2AhwLC/oBAQR/IAJBAWohAyABQYI8IAEbIQQCQCAAKAIkIgFFDQADQAJAIAEoAgwiBUUNACAFIAQgAxDWBEUNAgsgASgCACIBDQALCwJAIAENAEHIABAgIgFB/wE6AAogAUEANgIEIAEgACgCJDYCACAAIAE2AiQgAUKAgICAgICA/P8ANwMYIAFBACgCqMsBIgY2AkACQCABKAIQIgUNAAJAAkAgAC0AEkUNACAAQShqIQUgACgCKA0BIAVBiCc2AgAMAQsgAEEMaiEFCyAFKAIAIQULIAEgBSAGajYCRCABQckrELgCIAEgAxAgIgU2AgwgBSAEIAIQvgQaCyABCzsBAX9BAEHw2AAQhgQiATYCkMgBIAFBAToAEiABIAA2AiAgAUHg1AM2AgwgAUGBAjsBEEHQACABENoDC8oCAQN/AkBBACgCkMgBIgJFDQAgAiAAIAAQ5AQQugIhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAAgATkDGCAAQQA2AiAgAEE4aiABOQMAIABBMGogATkDACAAQShqQgA3AwAgACAAQcAAaigCADYCFAsgACAAKAIgQQFqNgIgIAAoAhQhAwJAAkBBACgCqMsBIgQgAEHEAGooAgAiAmtBAEgNACAAQShqIgQgACsDGCACIANruKIgBCsDAKA5AwAMAQsgAEEoaiICIAArAxggBCADa7iiIAIrAwCgOQMAIAQhAgsgACACNgIUAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLxgICAn4EfwJAAkACQAJAIAEQvAQOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIgiCIDIAKEpw0AIABCgICAgHA3AwAPCwJAIAOnIgRBFHZB/w9xIgVB/wdJDQAgAqchBgJAAkAgBUGTCEsNACAGDQICQCAFQZMIRg0AIARB//8/cSAFQY14anQNAwsgBEH//z9xQYCAwAByQZMIIAVrdiEFDAELAkAgBUGeCEkNACAGDQIgBEGAgICPfEcNAiAAQoCAgIB4NwMADwsgBiAFQe13aiIHdA0BIARB//8/cUGAgMAAciAHdCAGQbMIIAVrdnIhBQsgAEF/NgIEIAAgBUEAIAVrIAJCf1UbNgIADwsgACABOQMACxAAIAAgATYCACAAQX82AgQLDwAgAELAAEIBIAEbNwMACzwAAkAgAw0AIABCADcDAA8LAkAgAkEIcUUNACAAIAM2AgAgACACNgIEDwtBlMYAQdAzQdoAQYEXEJ4EAAuDAgICfwF8IwBBIGsiAiQAAkACQCAB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QRBqJAALZQECfyMAQRBrIgMkACACKAJAIQQgAyACKAKYATYCBAJAAkAgBEF/IANBBGogBBDOAhsiBEF/Sg0AIANBCGogAkH6ABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJAIQQgAyACKAKYATYCBCAEQYCAAXIhBAJAAkAgBEF/IANBBGogBBDOAhsiBEF/Sg0AIANBCGogAkH6ABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJAIQQgAyACKAKYATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBDOAhsiBEF/Sg0AIANBCGogAkH6ABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAJAIQQgAyACKAKYATYCBCAEQYCAA3IhBAJAAkAgBEF/IANBBGogBBDOAhsiBEF/Sg0AIANBCGogAkH6ABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigCQCIEIAIoAJgBQSRqKAIAQQR2SQ0AIANBCGogAkH4ABBzIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAJAEL4CC0YBAX8CQCACKAJAIgMgAigAmAFBNGooAgBBA3ZPDQAgACACKACYASICIAIoAjBqIANBA3RqKQAANwMADwsgACACQfcAEHMLWAECfyMAQRBrIgMkAAJAAkAgAigAmAFBPGooAgBBA3YgAigCQCIESw0AIANBCGogAkH5ABBzIABCADcDAAwBCyAAIAJBCCACIAQQ7wEQwAILIANBEGokAAtfAQN/IwBBEGsiAyQAIAIQsgMhBCACELIDIQUgA0EIaiACQQIQtAMCQAJAIAMpAwhCAFINACAAQgA3AwAMAQsgAyADKQMINwMAIAAgAiAFIAQgA0EAEEcLIANBEGokAAsQACAAIAIoAqABKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACELEDIAMgAykDCDcDACAAIAIgAxDKAhC+AiADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACELEDIABBkNkAQZjZACADKQMIUBspAwA3AwAgA0EQaiQACw0AIABBACkDkFk3AwALDQAgAEEAKQOYWTcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhCxAyADIAMpAwg3AwAgACACIAMQwwIQvwIgA0EQaiQACw0AIABBACkDoFk3AwALqQECAX8BfCMAQRBrIgMkACADQQhqIAIQsQMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCACIAMQwQIiBEQAAAAAAAAAAGNFDQAgACAEmhC9AgwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQOIWTcDAAwCCyAAQQAgAmsQvgIMAQsgACADKQMINwMACyADQRBqJAALDwAgACACELMDQX9zEL4CCzIBAX8jAEEQayIDJAAgA0EIaiACELEDIAAgAygCDEUgAygCCEECRnEQvwIgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACELEDAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEMECmhC9AgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA4hZNwMADAELIABBACACaxC+AgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACELEDIAMgAykDCDcDACAAIAIgAxDDAkEBcxC/AiADQRBqJAALDAAgACACELMDEL4CC6oCAgR/AXwjAEHAAGsiAyQAIANBOGogAhCxAyACQRhqIgQgAykDODcDACADQThqIAIQsQMgAiADKQM4NwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQvgIMAQsgAyACQRBqIgUpAwA3AzACQAJAIAIgA0EwahCdAg0AIAMgBCkDADcDKCACIANBKGoQnQJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahCnAgwBCyADIAUpAwA3AyAgAiACIANBIGoQwQI5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEMECIgc5AwAgACAHIAIrAyCgEL0CCyADQcAAaiQAC8wBAgR/AXwjAEEgayIDJAAgA0EYaiACELEDIAJBGGoiBCADKQMYNwMAIANBGGogAhCxAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRC+AgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQwQI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEMECIgc5AwAgACACKwMgIAehEL0CCyADQSBqJAALzgEDA38BfgF8IwBBIGsiAyQAIANBGGogAhCxAyACQRhqIgQgAykDGDcDACADQRhqIAIQsQMgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAI0AhAgAjQCGH4iBkIgiKcgBqciBUEfdUcNACAAIAUQvgIMAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEMECOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDBAiIHOQMAIAAgByACKwMgohC9AgsgA0EgaiQAC+cBAgV/AXwjAEEgayIDJAAgA0EYaiACELEDIAJBGGoiBCADKQMYNwMAIANBGGogAhCxAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQACQAJAIAIoAhgiBUEBag4CAAIBCyACKAIQQYCAgIB4Rg0BCyACKAIQIgYgBW0iByAFbCAGRw0AIAAgBxC+AgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQwQI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEMECIgg5AwAgACACKwMgIAijEL0CCyADQSBqJAALLAECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCECAAIAQgAygCAHEQvgILLAECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCECAAIAQgAygCAHIQvgILLAECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCECAAIAQgAygCAHMQvgILLAECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCECAAIAQgAygCAHQQvgILLAECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCECAAIAQgAygCAHUQvgILQQECfyACQRhqIgMgAhCzAzYCACACIAIQswMiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQvQIPCyAAIAIQvgILnAEBAn8jAEEgayIDJAAgA0EYaiACELEDIAJBGGoiBCADKQMYNwMAIANBGGogAhCxAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRiECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQzAIhAgsgACACEL8CIANBIGokAAu9AQICfwF8IwBBIGsiAyQAIANBGGogAhCxAyACQRhqIgQgAykDGDcDACADQRhqIAIQsQMgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIAIgA0EQahDBAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQwQIiBTkDACACKwMgIAVlIQIMAQsgAigCECACKAIYTCECCyAAIAIQvwIgA0EgaiQAC70BAgJ/AXwjAEEgayIDJAAgA0EYaiACELEDIAJBGGoiBCADKQMYNwMAIANBGGogAhCxAyACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEMECOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahDBAiIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhC/AiADQSBqJAALnwEBAn8jAEEgayIDJAAgA0EYaiACELEDIAJBGGoiBCADKQMYNwMAIANBGGogAhCxAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRyECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQzAJBAXMhAgsgACACEL8CIANBIGokAAucAQECfyMAQSBrIgIkACACQRhqIAEQsQMgASgCoAFCADcDICACIAIpAxg3AwgCQCACQQhqEMsCDQACQAJAIAIoAhwiA0GAgMD/B3ENACADQQ9xQQFGDQELIAIgAikDGDcDACACQRBqIAFByRggAhCyAgwBCyABIAIoAhgQbSIDRQ0AIAEoAqABQQApA4BZNwMgIAMQbwsgAkEgaiQAC6kBAQV/IwBBEGsiAiQAIAJBCGogARCxA0EAIQMCQCABELMDIgRBAUgNAAJAAkAgAA0AIABFIQUM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Axg3AwggAiADQQhqEPQBIQQgAyADKQMQNwMAIAAgAiADIAQQ9gEQvwIgA0EgaiQACz4BAX8CQCABLQA6IgINACAAIAFB7AAQcw8LIAEgAkF/aiICOgA6IAAgASACQf8BcUEDdGpByABqKQMANwMAC2oBAn8jAEEQayIBJAACQAJAIAAtADoiAg0AIAFBCGogAEHsABBzDAELIAAgAkF/aiICOgA6IAEgACACQf8BcUEDdGpByABqKQMANwMICyABIAEpAwg3AwAgACABEMICIQAgAUEQaiQAIAALagECfyMAQRBrIgEkAAJAAkAgAC0AOiICDQAgAUEIaiAAQewAEHMMAQsgACACQX9qIgI6ADogASAAIAJB/wFxQQN0akHIAGopAwA3AwgLIAEgASkDCDcDACAAIAEQwgIhACABQRBqJAAgAAuIAgECfyMAQcAAayIDJAACQAJAIAEtADoiBA0AIANBOGogAUHsABBzDAELIAEgBEF/aiIEOgA6IAMgASAEQf8BcUEDdGpByABqKQMANwM4CyADIAMpAzg3AygCQAJAIAEgA0EoahDEAg0AAkAgAkECcUUNACADIAMpAzg3AyAgASADQSBqEJ0CDQELIAMgAykDODcDGCADQTBqIAFBEiADQRhqELECIABCADcDAAwBCwJAIAJBAXFFDQAgAyADKQM4NwMQIAEgA0EQahDFAg0AIAMgAykDODcDCCADQTBqIAFB+xcgA0EIahCyAiAAQgA3AwAMAQsgACADKQM4NwMACyADQcAAaiQAC4AEAQV/AkAgBEH2/wNPDQAgABC5A0EAIQVBAEEBOgCgyAFBACABKQAANwChyAFBACABQQVqIgYpAAA3AKbIAUEAIARBCHQgBEGA/gNxQQh2cjsBrsgBQQBBCToAoMgBQaDIARC6AwJAIARFDQADQAJAIAQgBWsiAEEQIABBEEkbIgdFDQAgAyAFaiEIQQAhAANAIABBoMgBaiIJIAktAAAgCCAAai0AAHM6AAAgAEEBaiIAIAdHDQALC0GgyAEQugMgBUEQaiIFIARJDQALC0EAIQAgAkEAKAKgyAE2AABBAEEBOgCgyAFBACABKQAANwChyAFBACAGKQAANwCmyAFBAEEAOwGuyAFBoMgBELoDA0AgAiAAaiIJIAktAAAgAEGgyAFqLQAAczoAACAAQQFqIgBB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0SJqLQAAOgAAIARBAWogBS0AAEEPcUHRImotAAA6AAAgA0EBaiIDIAJHDQALCyAAIAJBAXRqQQA6AAALnQIBB38gACECAkAgAS0AACIDRQ0AIANFIQRBACEFIAAhAgNAAkACQCADQVBqQf8BcUEJSyIGDQAgA0EYdEEYdUFQaiEHDAELQX8hByADQSByIghBn39qQf8BcUEFSw0AIAhBGHRBGHVBqX9qIQcLAkAgB0F/Rw0AIAEtAAEiA0UhBCABQQFqIQEgAw0BDAILIARBAXENAQJAAkAgBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIDQZ9/akH/AXFBBUsNACADQRh0QRh1Qal/aiEHCyABQQFqIQECQAJAIAUNACAHQQR0QYACciEFDAELIAIgByAFcjoAACACQQFqIQJBACEFCyABLQAAIgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGrEyAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuWCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEL4EIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiED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LQAAOgAAIAINAAwDCwALIAJBA00NAANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIAJBfGoiAkEDSw0ACwsgAkUNAANAIAMgAS0AADoAACADQQFqIQMgAUEBaiEBIAJBf2oiAg0ACwsgAAvyAgIDfwF+AkAgAkUNACAAIAE6AAAgAiAAaiIDQX9qIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0F9aiABOgAAIANBfmogAToAACACQQdJDQAgACABOgADIANBfGogAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkF8aiABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBeGogATYCACACQXRqIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQXBqIAE2AgAgAkFsaiABNgIAIAJBaGogATYCACACQWRqIAE2AgAgBCADQQRxQRhyIgVrIgJBIEkNACABrUKBgICAEH4hBiADIAVqIQEDQCABIAY3AxggASAGNwMQIAEgBjcDCCABIAY3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsgAAsEAEEBCwIAC7UEAgR+An8CQAJAIAG9IgJCAYYiA1ANACACQv///////////wCDQoCAgICAgID4/wBWDQAgAL0iBEI0iKdB/w9xIgZB/w9HDQELIAAgAaIiASABow8LAkAgBEIBhiIFIANWDQAgAEQAAAAAAAAAAKIgACAFIANRGw8LIAJCNIinQf8PcSEHAkACQCAGDQBBACEGAkAgBEIMhiIDQgBTDQADQCAGQX9qIQYgA0IBhiIDQn9VDQALCyAEQQEgBmuthiEDDAELIARC/////////weDQoCAgICAgIAIhCEDCwJAAkAgBw0AQQAhBwJAIAJCDIYiBUIAUw0AA0AgB0F/aiEHIAVCAYYiBUJ/VQ0ACwsgAkEBIAdrrYYhAgwBCyACQv////////8Hg0KAgICAgICACIQhAgsCQCAGIAdMDQADQAJAAkAgAyACfSIFQgBZDQAgAyEFDAELIAMgAlINACAARAAAAAAAAAAAog8LIAVCAYYhAyAGQX9qIgYgB0oNAAsgByEGCwJAAkAgAyACfSIFQgBZDQAgAyEFDAEL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AABgA6IhACABQfBoIAFB8GhKG0GSD2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABCGBSAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEIYFIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQhgUgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EIYFIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhCGBSAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9sGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ/ARFDQAgAyAEEOwEIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEIYFIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ/gQgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgCK1CMIYgAkL///////8/g4QiCSADIARCMIinQf//AXEiBq1CMIYgBEL///////8/g4QiChD8BEEASg0AAkAgASAJIAMgChD8BEUNACABIQQMAgsgBUHwAGogASACQgBCABCGBSAFQfgAaikDACECIAUpA3AhBAwBCwJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABCGBSAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQhgUg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AjYCACACQQJ0QZDQAWohBAJAAkACQAJAQQAoAuTNASIGQQEgAnQiA3ENAEEAIAYgA3I2AuTNASAEIAE2AgAgAUEYaiAENgIADAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAFBGGogBDYCAAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEYakEANgIAIAEgBDYCDCABIAA2AggLQQBBACgCgM4BQX9qIgFBfyABGzYCgM4BCwsHAD8AQRB0C1QBAn9BACgClL0BIgEgAEEDakF8cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAEPgETQ0AIAAQE0UNAQtBACAANgKUvQEgAQ8LELsEQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEKIAQgAiAHGyIJQv///////z+DIQsgAiAEIAcbIgxCMIinQf//AXEhCAJAIAlCMIinQf//AXEiBg0AIAVB4ABqIAogCyAKIAsgC1AiBht5IAZBBnStfKciBkFxahD7BEEQIAZrIQYgBUHoAGopAwAhCyAFKQNgIQoLIAEgAyAHGyEDIAxC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ+wRBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCECIAtCA4YgCkI9iIQhBCADQgOGIQEgCSAMhSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAkIBIQEMAQsgBUHAAGogASACQYABIAdrEPsEIAVBMGogASACIAcQhQUgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQEgBUEwakEIaikDACECCyAEQoCAgICAgIAEhCEMIApCA4YhCwJAAkAgA0J/VQ0AQgAhA0IAIQQgCyABhSAMIAKFhFANAiALIAF9IQogDCACfSALIAFUrX0iBEL/////////A1YNASAFQSBqIAogBCAKIAQgBFAiBxt5IAdBBnStfKdBdGoiBxD7BCAGIAdrIQYgBUEoaikDACEEIAUpAyAhCgwBCyACIAx8IAEgC3wiCiABVK18IgRCgICAgICAgAiDUA0AIApCAYggBEI/hoQgCkIBg4QhCiAGQQFqIQYgBEIBiCEECyAJQoCAgICAgICAgH+DIQECQCAGQf//AUgNACABQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAogBCAGQf8AahD7BCAFIAogBEEBIAZrEIUFIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQogBUEIaikDACEECyAKQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgAYQhBCAKp0EHcSEGAkACQAJAAkACQBCDBQ4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIAFCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIAFQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxCEBRoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvfEAIFfw5+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEPsEQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ+wQgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQhwUgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQhwUgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQhwUgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQhwUgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQhwUgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQhwUgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQhwUgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQhwUgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQhwUgBUGQAWogA0IPhkIAIARCABCHBSAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEIcFIAVBgAFqQgEgAn1CACAEQgAQhwUgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIAFCP4iEIhRCIIgiBH4iCyABQgGGIhVCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgC1StIBAgD0L/////D4MiCyAUQv////8PgyIPfnwiESAQVK18IA0gBH58IAsgBH4iFiAPIA1+fCIQIBZUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIA9+IhYgAiAKfnwiESAWVK0gESALIBVC/v///w+DIhZ+fCIXIBFUrXx8IhEgEFStfCARIBIgBH4iECAWIA1+fCIEIAIgD358Ig0gCyAKfnwiC0IgiCAEIBBUrSANIARUrXwgCyANVK18QiCGhHwiBCARVK18IAQgFyACIBZ+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgF1StIAIgC0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgBUHQAGogAiAEIAMgDhCHBSABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhCHBSABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRUgEyEUCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhCyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxCFBSAFQTBqIBUgFCAGQfAAahD7BCAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiCxCHBSAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEIcFIAUgAyAOQgVCABCHBSALIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ+wQgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ+wQgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahD7BCACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahD7BCACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahD7BEEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahD7BCAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgCkIPhiADQjGIhCIUQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdBgAFJDQBCACEBDAMLIAVBMGogEiABIAZB/wBqIgYQ+wQgBUEgaiACIAQgBhD7BCAFQRBqIBIgASAHEIUFIAUgAiAEIAcQhQUgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwBCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgQgAUIgiCICfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgAn58IgNCIIh8IANC/////w+DIAQgAX58IgNCIIh8NwMIIAAgA0IghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ+gQgBSkDACEBIAAgBUEIaikDADcDCCAAIAE3AwAgBUEQaiQAC+oDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAiFQgBSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEPsEIAIgACAEQYH4ACADaxCFBSACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIhUIAUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEHQ0cECJAJB0NEBQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABEQAAskAQF+IAAgASACrSADrUIghoQgBBCSBSEFIAVCIIinEBQgBacLEwAgACABpyABQiCIpyACIAMQFQsLqLWBgAADAEGACAvosAFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBsYXJnZSBwYXJhbWV0ZXJzIGFycmF5AGlzQXJyYXkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4AG1ldGhvZDolZDoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAZG91YmxlIHRocm93AHBvdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRzYWdnX2NsaWVudF9ldgB0aHJvdzolZEAldQBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBidWZmZXIgd3JpdGUgYXQgJXUsIGxlbj0ldQAlczoldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdABleHBlY3Rpbmcgc3RhY2ssIGdvdABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudAByYW5kb21JbnQAcGFyc2VJbnQAdGhpcyBudW1mbXQAZGV2aWNlc2NyaXB0bWdyX2luaXQAd2FpdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAZGV2c19tYXBfa2V5c19vcl92YWx1ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZ2V0X3RyeWZyYW1lcwBwaXBlcyBpbiBzcGVjcwBhYnMAc2xlZXBNcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzACAgICAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgB0YWcgZXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAbWFwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGRldnNfb2JqZWN0X2dldF9wcm90bwBkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19tYXBfY29weV9pbnRvAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgBmdW4AYnV0dG9uAFVuaGFuZGxlZCBleGNlcHRpb24ARXhjZXB0aW9uAG1vdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24AZmliZXIgc3RhcnRlZCB3aXRoIGEgYnVpbHRpbiBmdW5jdGlvbgB3aW5kRGlyZWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAdGhyb3dpbmcgbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGludmFsaWQgZmxhZyBhcmcAbmVlZCBmbGFnIGFyZwBsb2cAc2V0dGluZwBnZXR0aW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAcHJvdG9fdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGhlYXJ0UmF0ZQBjYXVzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAbmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAGlzQ29ubmVjdGVkAG9uQ29ubmVjdGVkAGNyZWF0ZWQAdW5kZWZpbmVkACVzIGNhbGxlZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdHJ5LmMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBuZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAG5ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAZGV2aWNlc2NyaXB0L3RzYWdnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAUEkARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAICBwYz0lZCBAID8/PwAgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAZnJhbWUtPmZ1bmMtPm51bV90cnlfZnJhbWVzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBERVZTX1BBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgAgIC4uLgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQAlcyBub3Qgc3VwcG9ydGVkICh5ZXQpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8g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AJkAAACaAAAAmwAAAJwAAACdAAAAngAAAJ8AAACgAAAAoQAAAKIAAACjAAAApAAAAKUAAACmAAAApwAAAKgAAACpAAAAqgAAAKsAAACsAAAAUwAAAAAAAAAFAAAAAAAAAAAAAAC5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC6AAAAuwAAAOBmAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXgAA0GhQAABBmL0BCwAAtOOAgAAEbmFtZQHOYpUFAAVhYm9ydAETX2RldnNfcGFuaWNfaGFuZGxlcgINZW1fc2VuZF9mcmFtZQMQZW1fY29uc29sZV9kZWJ1ZwQEZXhpdAULZW1fdGltZV9ub3cGE2RldnNfZGVwbG95X2hhbmRsZXIHIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CCFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQJGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRA5hZ2didWZmZXJfaW5pdEUPYWdnYnVmZmVyX2ZsdXNoRhBhZ2didWZmZXJfdXBsb2FkRw5kZXZzX2J1ZmZlcl9vcEgQZGV2c19yZWFkX251bWJlckkSZGV2c19idWZmZXJfZGVjb2RlShJkZXZzX2J1ZmZlcl9lbmNvZGVLD2RldnNfY3JlYXRlX2N0eEwJc2V0dXBfY3R4TQpkZXZzX3RyYWNlTg9kZXZzX2Vycm9yX2NvZGVPGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJQCWNsZWFyX2N0eFENZGV2c19mcmVlX2N0eFIIZGV2c19vb21TCWRldnNfZnJlZVQXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NVB3RyeV9ydW5WDHN0b3BfcHJvZ3JhbVccZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVkYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFsOZGVwbG95X2hhbmRsZXJcE2RlcGxveV9tZXRhX2hhbmRsZXJdFmRldmljZXNjcmlwdG1ncl9kZXBsb3leFGRldmljZXNjcmlwdG1ncl9pbml0XxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YBFkZXZzY2xvdWRfcHJvY2Vzc2EXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRiE2RldnNjbG91ZF9vbl9tZXRob2RjDmRldnNjbG91ZF9pbml0ZBBkZXZzX2ZpYmVyX3lpZWxkZRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25mGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWcQZGV2c19maWJlcl9zbGVlcGgbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsaRpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc2oRZGV2c19pbWdfZnVuX25hbWVrEmRldnNfaW1nX3JvbGVfbmFtZWwSZGV2c19maWJlcl9ieV9maWR4bRFkZXZzX2ZpYmVyX2J5X3RhZ24QZGV2c19maWJlcl9zdGFydG8UZGV2c19maWJlcl90ZXJtaWFudGVwDmRldnNfZmliZXJfcnVucRNkZXZzX2ZpYmVyX3N5bmNfbm93cgpkZXZzX3BhbmljcxVfZGV2c19ydW50aW1lX2ZhaWx1cmV0D2RldnNfZmliZXJfcG9rZXUTamRfZ2NfYW55X3RyeV9hbGxvY3YHZGV2c19nY3cPZmluZF9mcmVlX2Jsb2NreBJkZXZzX2FueV90cnlfYWxsb2N5DmRldnNfdHJ5X2FsbG9jegtqZF9nY191bnBpbnsKamRfZ2NfZnJlZXwOZGV2c192YWx1ZV9waW59EGRldnNfdmFsdWVfdW5waW5+EmRldnNfbWFwX3RyeV9hbGxvY38UZGV2c19hcnJheV90cnlfYWxsb2OAARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OBARVkZXZzX3N0cmluZ190cnlfYWxsb2OCARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdIMBD2RldnNfZ2Nfc2V0X2N0eIQBDmRldnNfZ2NfY3JlYXRlhQEPZGV2c19nY19kZXN0cm95hgELc2Nhbl9nY19vYmqHARFwcm9wX0FycmF5X2xlbmd0aIgBEm1ldGgyX0FycmF5X2luc2VydIkBEmZ1bjFfQXJyYXlfaXNBcnJheYoBEG1ldGhYX0FycmF5X3B1c2iLARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WMARFtZXRoWF9BcnJheV9zbGljZY0BEWZ1bjFfQnVmZmVyX2FsbG9jjgEScHJvcF9CdWZmZXJfbGVuZ3RojwEVbWV0aDBfQnVmZmVyX3RvU3RyaW5nkAETbWV0aDNfQnVmZmVyX2ZpbGxBdJEBE21ldGg0X0J1ZmZlcl9ibGl0QXSSARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zkwEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOUARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SVARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSWARVmdW4xX0RldmljZVNjcmlwdF9sb2eXARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0mAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSZARRtZXRoMV9FcnJvcl9fX2N0b3JfX5oBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+bARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+cARRtZXRoWF9GdW5jdGlvbl9zdGFydJ0BDmZ1bjFfTWF0aF9jZWlsngEPZnVuMV9NYXRoX2Zsb29ynwEPZnVuMV9NYXRoX3JvdW5koAENZnVuMV9NYXRoX2Fic6EBEGZ1bjBfTWF0aF9yYW5kb22iARNmdW4xX01hdGhfcmFuZG9tSW50owENZnVuMV9NYXRoX2xvZ6QBDWZ1bjJfTWF0aF9wb3elAQ5mdW4yX01hdGhfaWRpdqYBDmZ1bjJfTWF0aF9pbW9kpwEOZnVuMl9NYXRoX2ltdWyoAQ1mdW4yX01hdGhfbWluqQELZnVuMl9taW5tYXiqAQ1mdW4yX01hdGhfbWF4qwESZnVuMl9PYmplY3RfYXNzaWdurAEQZnVuMV9PYmplY3Rfa2V5c60BE2Z1bjFfa2V5c19vcl92YWx1ZXOuARJmdW4xX09iamVjdF92YWx1ZXOvARBwcm9wX1BhY2tldF9yb2xlsAEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcrEBE3Byb3BfUGFja2V0X3Nob3J0SWSyARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXizARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZLQBEXByb3BfUGFja2V0X2ZsYWdztQEVcHJvcF9QYWNrZXRfaXNDb21tYW5ktgEUcHJvcF9QYWNrZXRfaXNSZXBvcnS3ARNwcm9wX1BhY2tldF9wYXlsb2FkuAETcHJvcF9QYWNrZXRfaXNFdmVudLkBFXByb3BfUGFja2V0X2V2ZW50Q29kZboBFHByb3BfUGFja2V0X2lzUmVnU2V0uwEUcHJvcF9QYWNrZXRfaXNSZWdHZXS8ARNwcm9wX1BhY2tldF9yZWdDb2RlvQETbWV0aDBfUGFja2V0X2RlY29kZb4BEmRldnNfcGFja2V0X2RlY29kZb8BFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZMABFERzUmVnaXN0ZXJfcmVhZF9jb250wQESZGV2c19wYWNrZXRfZW5jb2RlwgEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZcMBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXEARZwcm9wX0RzUGFja2V0SW5mb19uYW1lxQEWcHJvcF9Ec1BhY2tldEluZm9fY29kZcYBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX8cBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVkyAEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5kyQERbWV0aDBfRHNSb2xlX3dhaXTKARJwcm9wX1N0cmluZ19sZW5ndGjLARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdMwBE21ldGgxX1N0cmluZ19jaGFyQXTNARRkZXZzX2pkX2dldF9yZWdpc3Rlcs4BFmRldnNfamRfY2xlYXJfcGt0X2tpbmTPARBkZXZzX2pkX3NlbmRfY21k0AERZGV2c19qZF93YWtlX3JvbGXRARRkZXZzX2pkX3Jlc2V0X3BhY2tldNIBE2RldnNfamRfcGt0X2NhcHR1cmXTARNkZXZzX2pkX3NlbmRfbG9nbXNn1AENaGFuZGxlX2xvZ21zZ9UBEmRldnNfamRfc2hvdWxkX3J1btYBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl1wETZGV2c19qZF9wcm9jZXNzX3BrdNgBFGRldnNfamRfcm9sZV9jaGFuZ2Vk2QESZGV2c19qZF9pbml0X3JvbGVz2gESZGV2c19qZF9mcmVlX3JvbGVz2wEQZGV2c19zZXRfbG9nZ2luZ9wBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc90BEmRldnNfbWFwX2NvcHlfaW50b94BGGRldnNfb2JqZWN0X2dldF9idWlsdF9pbt8BDGRldnNfbWFwX3NldOABFGRldnNfaXNfc2VydmljZV9zcGVj4QEGbG9va3Vw4gEXZGV2c19tYXBfa2V5c19vcl92YWx1ZXPjARFkZXZzX2FycmF5X2luc2VydOQBD2RldnNfbWFwX2RlbGV0ZeUBF2RldnNfZGVjb2RlX3JvbGVfcGFja2V05gEOZGV2c19yb2xlX3NwZWPnARBkZXZzX3NwZWNfbG9va3Vw6AERZGV2c19wcm90b19sb29rdXDpARJkZXZzX2Z1bmN0aW9uX2JpbmTqARFkZXZzX21ha2VfY2xvc3VyZesBDmRldnNfZ2V0X2ZuaWR47AETZGV2c19nZXRfZm5pZHhfY29yZe0BGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZO4BF2RldnNfb2JqZWN0X2dldF9ub19iaW5k7wETZGV2c19nZXRfcm9sZV9wcm90b/ABG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd/EBFWRldnNfZ2V0X3N0YXRpY19wcm90b/IBHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVt8wEVZGV2c19vYmplY3RfZ2V0X3Byb3Rv9AEYZGV2c19nZXRfcHJvdG90eXBlX2ZpZWxk9QEeZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luX2ZpZWxk9gEQZGV2c19pbnN0YW5jZV9vZvcBD2RldnNfb2JqZWN0X2dldPgBDGRldnNfc2VxX2dldPkBDGRldnNfYW55X2dldPoBDGRldnNfYW55X3NldPsBDGRldnNfc2VxX3NldPwBDmRldnNfYXJyYXlfc2V0/QEMZGV2c19hcmdfaW50/gEPZGV2c19hcmdfZG91Ymxl/wEPZGV2c19yZXRfZG91YmxlgAIMZGV2c19yZXRfaW50gQINZGV2c19yZXRfYm9vbIICD2RldnNfcmV0X2djX3B0coMCEWRldnNfYXJnX3NlbGZfbWFwhAIRZGV2c19zZXR1cF9yZXN1bWWFAg9kZXZzX2Nhbl9hdHRhY2iGAhlkZXZzX2J1aWx0aW5fb2JqZWN0X3ZhbHVlhwISZGV2c19yZWdjYWNoZV9mcmVliAIWZGV2c19yZWdjYWNoZV9mcmVlX2FsbIkCF2RldnNfcmVnY2FjaGVfbWFya191c2VkigITZGV2c19yZWdjYWNoZV9hbGxvY4sCFGRldnNfcmVnY2FjaGVfbG9va3VwjAIRZGV2c19yZWdjYWNoZV9hZ2WNAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZY4CEmRldnNfcmVnY2FjaGVfbmV4dI8CD2pkX3NldHRpbmdzX2dldJACD2pkX3NldHRpbmdzX3NldJECDmRldnNfbG9nX3ZhbHVlkgIPZGV2c19zaG93X3ZhbHVlkwIQZGV2c19zaG93X3ZhbHVlMJQCDWNvbnN1bWVfY2h1bmuVAg1zaGFfMjU2X2Nsb3NllgIPamRfc2hhMjU2X3NldHVwlwIQamRfc2hhMjU2X3VwZGF0ZZgCEGpkX3NoYTI1Nl9maW5pc2iZAhRqZF9zaGEyNTZfaG1hY19zZXR1cJoCFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaJsCDmpkX3NoYTI1Nl9oa2RmnAIOZGV2c19zdHJmb3JtYXSdAg5kZXZzX2lzX3N0cmluZ54CDmRldnNfaXNfbnVtYmVynwIUZGV2c19zdHJpbmdfZ2V0X3V0ZjigAhNkZXZzX2J1aWx0aW5fc3RyaW5noQIUZGV2c19zdHJpbmdfdnNwcmludGaiAhNkZXZzX3N0cmluZ19zcHJpbnRmowIVZGV2c19zdHJpbmdfZnJvbV91dGY4pAIUZGV2c192YWx1ZV90b19zdHJpbmelAhBidWZmZXJfdG9fc3RyaW5npgIZZGV2c19tYXBfc2V0X3N0cmluZ19maWVsZKcCEmRldnNfc3RyaW5nX2NvbmNhdKgCEmRldnNfcHVzaF90cnlmcmFtZakCEWRldnNfcG9wX3RyeWZyYW1lqgIPZGV2c19kdW1wX3N0YWNrqwITZGV2c19kdW1wX2V4Y2VwdGlvbqwCCmRldnNfdGhyb3etAhVkZXZzX3Rocm93X3R5cGVfZXJyb3KuAhlkZXZzX3Rocm93X2ludGVybmFsX2Vycm9yrwIWZGV2c190aHJvd19yYW5nZV9lcnJvcrACHmRldnNfdGhyb3dfbm90X3N1cHBvcnRlZF9lcnJvcrECGmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9ysgIeZGV2c190aHJvd19leHBlY3RpbmdfZXJyb3JfZXh0swIYZGV2c190aHJvd190b29fYmlnX2Vycm9ytAIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY7UCD3RzYWdnX2NsaWVudF9ldrYCCmFkZF9zZXJpZXO3Ag10c2FnZ19wcm9jZXNzuAIKbG9nX3Nlcmllc7kCE3RzYWdnX2hhbmRsZV9wYWNrZXS6AhRsb29rdXBfb3JfYWRkX3Nlcmllc7sCCnRzYWdnX2luaXS8Agx0c2FnZ191cGRhdGW9AhZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlvgITZGV2c192YWx1ZV9mcm9tX2ludL8CFGRldnNfdmFsdWVfZnJvbV9ib29swAIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLBAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZcICEWRldnNfdmFsdWVfdG9faW50wwISZGV2c192YWx1ZV90b19ib29sxAIOZGV2c19pc19idWZmZXLFAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZcYCEGRldnNfYnVmZmVyX2RhdGHHAhNkZXZzX2J1ZmZlcmlzaF9kYXRhyAIUZGV2c192YWx1ZV90b19nY19vYmrJAg1kZXZzX2lzX2FycmF5ygIRZGV2c192YWx1ZV90eXBlb2bLAg9kZXZzX2lzX251bGxpc2jMAhJkZXZzX3ZhbHVlX2llZWVfZXHNAh5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGPOAhJkZXZzX2ltZ19zdHJpZHhfb2vPAhJkZXZzX2R1bXBfdmVyc2lvbnPQAgtkZXZzX3ZlcmlmedECEWRldnNfZmV0Y2hfb3Bjb2Rl0gIUZGV2c192bV9leGVjX29wY29kZXPTAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeNQCEWRldnNfaW1nX2dldF91dGY41QIUZGV2c19nZXRfc3RhdGljX3V0ZjjWAg9kZXZzX3ZtX3JvbGVfb2vXAgxleHByX2ludmFsaWTYAhRleHByeF9idWlsdGluX29iamVjdNkCC3N0bXQxX2NhbGww2gILc3RtdDJfY2FsbDHbAgtzdG10M19jYWxsMtwCC3N0bXQ0X2NhbGwz3QILc3RtdDVfY2FsbDTeAgtzdG10Nl9jYWxsNd8CC3N0bXQ3X2NhbGw24AILc3RtdDhfY2FsbDfhAgtzdG10OV9jYWxsOOICEnN0bXQyX2luZGV4X2RlbGV0ZeMCDHN0bXQxX3JldHVybuQCCXN0bXR4X2ptcOUCDHN0bXR4MV9qbXBfeuYCC3N0bXQxX3Bhbmlj5wISZXhwcnhfb2JqZWN0X2ZpZWxk6AISc3RtdHgxX3N0b3JlX2xvY2Fs6QITc3RtdHgxX3N0b3JlX2dsb2JhbOoCEnN0bXQ0X3N0b3JlX2J1ZmZlcusCCWV4cHIwX2luZuwCEGV4cHJ4X2xvYWRfbG9jYWztAhFleHByeF9sb2FkX2dsb2JhbO4CC2V4cHIxX3VwbHVz7wILZXhwcjJfaW5kZXjwAg9zdG10M19pbmRleF9zZXTxAhRleHByeDFfYnVpbHRpbl9maWVsZPICEmV4cHJ4MV9hc2NpaV9maWVsZPMCEWV4cHJ4MV91dGY4X2ZpZWxk9AIQZXhwcnhfbWF0aF9maWVsZPUCDmV4cHJ4X2RzX2ZpZWxk9gIPc3RtdDBfYWxsb2NfbWFw9wIRc3RtdDFfYWxsb2NfYXJyYXn4AhJzdG10MV9hbGxvY19idWZmZXL5AhFleHByeF9zdGF0aWNfcm9sZfoCE2V4cHJ4X3N0YXRpY19idWZmZXL7AhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmf8AhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n/QIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n/gIVZXhwcnhfc3RhdGljX2Z1bmN0aW9u/wINZXhwcnhfbGl0ZXJhbIADEWV4cHJ4X2xpdGVyYWxfZjY0gQMQZXhwcnhfcm9sZV9wcm90b4IDEWV4cHIzX2xvYWRfYnVmZmVygwMNZXhwcjBfcmV0X3ZhbIQDDGV4cHIxX3R5cGVvZoUDCmV4cHIwX251bGyGAw1leHByMV9pc19udWxshwMKZXhwcjBfdHJ1ZYgDC2V4cHIwX2ZhbHNliQMNZXhwcjFfdG9fYm9vbIoDCWV4cHIwX25hbosDCWV4cHIxX2Fic4wDDWV4cHIxX2JpdF9ub3SNAwxleHByMV9pc19uYW6OAwlleHByMV9uZWePAwlleHByMV9ub3SQAwxleHByMV90b19pbnSRAwlleHByMl9hZGSSAwlleHByMl9zdWKTAwlleHByMl9tdWyUAwlleHByMl9kaXaVAw1leHByMl9iaXRfYW5klgMMZXhwcjJfYml0X29ylwMNZXhwcjJfYml0X3hvcpgDEGV4cHIyX3NoaWZ0X2xlZnSZAxFleHByMl9zaGlmdF9yaWdodJoDGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkmwMIZXhwcjJfZXGcAwhleHByMl9sZZ0DCGV4cHIyX2x0ngMIZXhwcjJfbmWfAxVzdG10MV90ZXJtaW5hdGVfZmliZXKgAxRzdG10eDJfc3RvcmVfY2xvc3VyZaEDE2V4cHJ4MV9sb2FkX2Nsb3N1cmWiAxJleHByeF9tYWtlX2Nsb3N1cmWjAxBleHByMV90eXBlb2Zfc3RypAMMZXhwcjBfbm93X21zpQMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZaYDEHN0bXQyX2NhbGxfYXJyYXmnAwlzdG10eF90cnmoAw1zdG10eF9lbmRfdHJ5qQMLc3RtdDBfY2F0Y2iqAw1zdG10MF9maW5hbGx5qwMLc3RtdDFfdGhyb3esAw5zdG10MV9yZV90aHJvd60DEHN0bXR4MV90aHJvd19qbXCuAw5zdG10MF9kZWJ1Z2dlcq8DCWV4cHIxX25ld7ADEWV4cHIyX2luc3RhbmNlX29msQMPZGV2c192bV9wb3BfYXJnsgMTZGV2c192bV9wb3BfYXJnX3UzMrMDE2RldnNfdm1fcG9wX2FyZ19pMzK0AxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVytQMSamRfYWVzX2NjbV9lbmNyeXB0tgMSamRfYWVzX2NjbV9kZWNyeXB0twMMQUVTX2luaXRfY3R4uAMPQUVTX0VDQl9lbmNyeXB0uQMQamRfYWVzX3NldHVwX2tleboDDmpkX2Flc19lbmNyeXB0uwMQamRfYWVzX2NsZWFyX2tlebwDC2pkX3dzc2tfbmV3vQMUamRfd3Nza19zZW5kX21lc3NhZ2W+AxNqZF93ZWJzb2NrX29uX2V2ZW50vwMHZGVjcnlwdMADDWpkX3dzc2tfY2xvc2XBAxBqZF93c3NrX29uX2V2ZW50wgMKc2VuZF9lbXB0ecMDEndzc2toZWFsdGhfcHJvY2Vzc8QDF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlxQMUd3Nza2hlYWx0aF9yZWNvbm5lY3TGAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXTHAw9zZXRfY29ubl9zdHJpbmfIAxFjbGVhcl9jb25uX3N0cmluZ8kDD3dzc2toZWFsdGhfaW5pdMoDE3dzc2tfcHVibGlzaF92YWx1ZXPLAxB3c3NrX3B1Ymxpc2hfYmluzAMRd3Nza19pc19jb25uZWN0ZWTNAxN3c3NrX3Jlc3BvbmRfbWV0aG9kzgMccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6Zc8DFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGXQAw9yb2xlbWdyX3Byb2Nlc3PRAxByb2xlbWdyX2F1dG9iaW5k0gMVcm9sZW1ncl9oYW5kbGVfcGFja2V00wMUamRfcm9sZV9tYW5hZ2VyX2luaXTUAxhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWTVAw1qZF9yb2xlX2FsbG9j1gMQamRfcm9sZV9mcmVlX2FsbNcDFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmTYAxJqZF9yb2xlX2J5X3NlcnZpY2XZAxNqZF9jbGllbnRfbG9nX2V2ZW502gMTamRfY2xpZW50X3N1YnNjcmliZdsDFGpkX2NsaWVudF9lbWl0X2V2ZW503AMUcm9sZW1ncl9yb2xlX2NoYW5nZWTdAxBqZF9kZXZpY2VfbG9va3Vw3gMYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNl3wMTamRfc2VydmljZV9zZW5kX2NtZOADEWpkX2NsaWVudF9wcm9jZXNz4QMOamRfZGV2aWNlX2ZyZWXiAxdqZF9jbGllbnRfaGFuZGxlX3BhY2tldOMDD2pkX2RldmljZV9hbGxvY+QDD2pkX2N0cmxfcHJvY2Vzc+UDFWpkX2N0cmxfaGFuZGxlX3BhY2tldOYDDGpkX2N0cmxfaW5pdOcDDWpkX2lwaXBlX29wZW7oAxZqZF9pcGlwZV9oYW5kbGVfcGFja2V06QMOamRfaXBpcGVfY2xvc2XqAxJqZF9udW1mbXRfaXNfdmFsaWTrAxVqZF9udW1mbXRfd3JpdGVfZmxvYXTsAxNqZF9udW1mbXRfd3JpdGVfaTMy7QMSamRfbnVtZm10X3JlYWRfaTMy7gMUamRfbnVtZm10X3JlYWRfZmxvYXTvAxFqZF9vcGlwZV9vcGVuX2NtZPADFGpkX29waXBlX29wZW5fcmVwb3J08QMWamRfb3BpcGVfaGFuZGxlX3BhY2tldPIDEWpkX29waXBlX3dyaXRlX2V48wMQamRfb3BpcGVfcHJvY2Vzc/QDFGpkX29waXBlX2NoZWNrX3NwYWNl9QMOamRfb3BpcGVfd3JpdGX2Aw5qZF9vcGlwZV9jbG9zZfcDDWpkX3F1ZXVlX3B1c2j4Aw5qZF9xdWV1ZV9mcm9udPkDDmpkX3F1ZXVlX3NoaWZ0+gMOamRfcXVldWVfYWxsb2P7Aw1qZF9yZXNwb25kX3U4/AMOamRfcmVzcG9uZF91MTb9Aw5qZF9yZXNwb25kX3UzMv4DEWpkX3Jlc3BvbmRfc3RyaW5n/wMXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWSABAtqZF9zZW5kX3BrdIEEHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFsggQXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXKDBBlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0hAQUamRfYXBwX2hhbmRsZV9wYWNrZXSFBBVqZF9hcHBfaGFuZGxlX2NvbW1hbmSGBBNqZF9hbGxvY2F0ZV9zZXJ2aWNlhwQQamRfc2VydmljZXNfaW5pdIgEDmpkX3JlZnJlc2hfbm93iQQZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZIoEFGpkX3NlcnZpY2VzX2Fubm91bmNliwQXamRfc2VydmljZXNfbmVlZHNfZnJhbWWMBBBqZF9zZXJ2aWNlc190aWNrjQQVamRfcHJvY2Vzc19ldmVyeXRoaW5njgQaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWPBBJhcHBfZ2V0X2Z3X3ZlcnNpb26QBBZhcHBfZ2V0X2Rldl9jbGFzc19uYW1lkQQNamRfaGFzaF9mbnYxYZIEDGpkX2RldmljZV9pZJMECWpkX3JhbmRvbZQECGpkX2NyYzE2lQQOamRfY29tcHV0ZV9jcmOWBA5qZF9zaGlmdF9mcmFtZZcEDmpkX3Jlc2V0X2ZyYW1lmAQQamRfcHVzaF9pbl9mcmFtZZkEDWpkX3BhbmljX2NvcmWaBBNqZF9zaG91bGRfc2FtcGxlX21zmwQQamRfc2hvdWxkX3NhbXBsZZwECWpkX3RvX2hleJ0EC2pkX2Zyb21faGV4ngQOamRfYXNzZXJ0X2ZhaWyfBAdqZF9hdG9poAQLamRfdnNwcmludGahBA9qZF9wcmludF9kb3VibGWiBApqZF9zcHJpbnRmowQSamRfZGV2aWNlX3Nob3J0X2lkpAQMamRfc3ByaW50Zl9hpQQLamRfdG9faGV4X2GmBBRqZF9kZXZpY2Vfc2hvcnRfaWRfYacECWpkX3N0cmR1cKgEDmpkX2pzb25fZXNjYXBlqQQTamRfanNvbl9lc2NhcGVfY29yZaoECWpkX21lbWR1cKsEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWsBBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVlrQQRamRfc2VuZF9ldmVudF9leHSuBApqZF9yeF9pbml0rwQUamRfcnhfZnJhbWVfcmVjZWl2ZWSwBB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja7EED2pkX3J4X2dldF9mcmFtZbIEE2pkX3J4X3JlbGVhc2VfZnJhbWWzBBFqZF9zZW5kX2ZyYW1lX3Jhd7QEDWpkX3NlbmRfZnJhbWW1BApqZF90eF9pbml0tgQHamRfc2VuZLcEFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmO4BA9qZF90eF9nZXRfZnJhbWW5BBBqZF90eF9mcmFtZV9zZW50ugQLamRfdHhfZmx1c2i7BBBfX2Vycm5vX2xvY2F0aW9uvAQMX19mcGNsYXNzaWZ5vQQFZHVtbXm+BAhfX21lbWNweb8EB21lbW1vdmXABAZtZW1zZXTBBApfX2xvY2tmaWxlwgQMX191bmxvY2tmaWxlwwQEZm1vZMQEDF9fc3RkaW9fc2Vla8UEDV9fc3RkaW9fd3JpdGXGBA1fX3N0ZGlvX2Nsb3NlxwQMX19zdGRpb19leGl0yAQKY2xvc2VfZmlsZckECF9fdG9yZWFkygQJX190b3dyaXRlywQJX19md3JpdGV4zAQGZndyaXRlzQQrZW1zY3JpcHRlbl9tYWluX3RocmVhZF9wcm9jZXNzX3F1ZXVlZF9jYWxsc84EFF9fcHRocmVhZF9tdXRleF9sb2NrzwQWX19wdGhyZWFkX211dGV4X3VubG9ja9AEBl9fbG9ja9EEDl9fbWF0aF9kaXZ6ZXJv0gQOX19tYXRoX2ludmFsaWTTBANsb2fUBAVsb2cxMNUEB19fbHNlZWvWBAZtZW1jbXDXBApfX29mbF9sb2Nr2AQMX19tYXRoX3hmbG932QQKZnBfYmFycmllctoEDF9fbWF0aF9vZmxvd9sEDF9fbWF0aF91Zmxvd9wEBGZhYnPdBANwb3feBAhjaGVja2ludN8EC3NwZWNpYWxjYXNl4AQFcm91bmThBAZzdHJjaHLiBAtfX3N0cmNocm51bOMEBnN0cmNtcOQEBnN0cmxlbuUEB19fdWZsb3fmBAdfX3NobGlt5wQIX19zaGdldGPoBAdpc3NwYWNl6QQGc2NhbGJu6gQJY29weXNpZ25s6wQHc2NhbGJubOwEDV9fZnBjbGFzc2lmeWztBAVmbW9kbO4EBWZhYnNs7wQLX19mbG9hdHNjYW7wBAhoZXhmbG9hdPEECGRlY2Zsb2F08gQHc2NhbmV4cPMEBnN0cnRvePQEBnN0cnRvZPUEEl9fd2FzaV9zeXNjYWxsX3JldPYECGRsbWFsbG9j9wQGZGxmcmVl+AQYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl+QQEc2Jya/oECF9fYWRkdGYz+wQJX19hc2hsdGkz/AQHX19sZXRmMv0EB19fZ2V0ZjL+BAhfX2RpdnRmM/8EDV9fZXh0ZW5kZGZ0ZjKABQ1fX2V4dGVuZHNmdGYygQULX19mbG9hdHNpdGaCBQ1fX2Zsb2F0dW5zaXRmgwUNX19mZV9nZXRyb3VuZIQFEl9fZmVfcmFpc2VfaW5leGFjdIUFCV9fbHNocnRpM4YFCF9fbXVsdGYzhwUIX19tdWx0aTOIBQlfX3Bvd2lkZjKJBQhfX3N1YnRmM4oFDF9fdHJ1bmN0ZmRmMosFCXN0YWNrU2F2ZYwFDHN0YWNrUmVzdG9yZY0FCnN0YWNrQWxsb2OOBRVlbXNjcmlwdGVuX3N0YWNrX2luaXSPBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlkAUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZZEFGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZJIFDGR5bkNhbGxfamlqaZMFFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppammUBRhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwGSBQQABGZwdHIBATACATEDATIHLQMAD19fc3RhY2tfcG9pbnRlcgELX19zdGFja19lbmQCDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
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
    updateGlobalBufferAndViews(wasmMemory.buffer);

    wasmTable = Module['asm']['__indirect_function_table'];
    assert(wasmTable, "table not found in wasm exports");

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
  }
  // we can't run yet (except in a pthread, where we have a custom sync instantiator)
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
        typeof fetch == 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        // Suppress closure warning here since the upstream definition for
        // instantiateStreaming only allows Promise<Response> rather than
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
      return false;
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
function _devs_panic_handler(exitcode){ console.log("PANIC", exitcode); if (Module.panicHandler) Module.panicHandler(exitcode); }
function devs_deploy_handler(exitcode){ if (Module.deployHandler) Module.deployHandler(exitcode); }
function em_console_debug(ptr){ const s = UTF8ToString(ptr, 1024); if (Module.dmesg) Module.dmesg(s); else console.debug(s); }
function em_send_frame(frame){ const sz = 12 + HEAPU8[frame + 2]; const pkt = HEAPU8.slice(frame, frame + sz); Module.sendPacket(pkt) }
function em_time_now(){ return Date.now(); }
function jd_crypto_get_random(trg,size){ let buf = new Uint8Array(size); if (typeof window == "object" && window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf); else { buf = require("crypto").randomBytes(size); } HEAPU8.set(buf, trg); }





  function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == 'function') {
          callback(Module); // Pass the module as the first argument.
          continue;
        }
        var func = callback.func;
        if (typeof func == 'number') {
          if (callback.arg === undefined) {
            // Run the wasm function ptr with signature 'v'. If no function
            // with such signature was exported, this call does not need
            // to be emitted (and would confuse Closure)
            getWasmTableEntry(func)();
          } else {
            // If any function with signature 'vi' was exported, run
            // the callback with that signature.
            getWasmTableEntry(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

  function withStackSave(f) {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    }
  function demangle(func) {
      warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
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

  function handleException(e) {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    }

  function jsStackTrace() {
      var error = new Error();
      if (!error.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error();
        } catch(e) {
          error = e;
        }
        if (!error.stack) {
          return '(no stack trace available)';
        }
      }
      return error.stack.toString();
    }

  function setWasmTableEntry(idx, func) {
      wasmTable.set(idx, func);
      wasmTableMirror[idx] = func;
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function _abort() {
      abort('native code called abort()');
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  function _emscripten_get_heap_max() {
      return HEAPU8.length;
    }
  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s INITIAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
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

  function _exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      exit(status);
    }

  var SYSCALLS = {buffers:[null,[],[]],printChar:function(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        assert(buffer);
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },get64:function(low, high) {
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      }};
  function _fd_close(fd) {
      abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
      return 0;
    }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
  }

  function flush_NO_FILESYSTEM() {
      // flush anything remaining in the buffers during shutdown
      ___stdio_exit();
      var buffers = SYSCALLS.buffers;
      if (buffers[1].length) SYSCALLS.printChar(1, 10);
      if (buffers[2].length) SYSCALLS.printChar(2, 10);
    }
  function _fd_write(fd, iov, iovcnt, pnum) {
      ;
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[((iov)>>2)];
        var len = HEAP32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAP32[((pnum)>>2)] = num;
      return 0;
    }

  function _setTempRet0(val) {
      setTempRet0(val);
    }
var ASSERTIONS = true;



/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
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
  "devs_deploy_handler": devs_deploy_handler,
  "em_console_debug": em_console_debug,
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
  "fd_write": _fd_write,
  "jd_crypto_get_random": jd_crypto_get_random,
  "setTempRet0": _setTempRet0
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = createExportWrapper("malloc");

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
var ___stdio_exit = Module["___stdio_exit"] = createExportWrapper("__stdio_exit");

/** @type {function(...*):?} */
var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = createExportWrapper("emscripten_main_thread_process_queued_calls");

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
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");





// === Auto-generated postamble setup entry stuff ===

unexportedRuntimeFunction('intArrayFromString', false);
unexportedRuntimeFunction('intArrayToString', false);
unexportedRuntimeFunction('ccall', false);
unexportedRuntimeFunction('cwrap', false);
unexportedRuntimeFunction('setValue', false);
unexportedRuntimeFunction('getValue', false);
unexportedRuntimeFunction('allocate', false);
unexportedRuntimeFunction('UTF8ArrayToString', false);
unexportedRuntimeFunction('UTF8ToString', false);
unexportedRuntimeFunction('stringToUTF8Array', false);
unexportedRuntimeFunction('stringToUTF8', false);
unexportedRuntimeFunction('lengthBytesUTF8', false);
unexportedRuntimeFunction('stackTrace', false);
unexportedRuntimeFunction('addOnPreRun', false);
unexportedRuntimeFunction('addOnInit', false);
unexportedRuntimeFunction('addOnPreMain', false);
unexportedRuntimeFunction('addOnExit', false);
unexportedRuntimeFunction('addOnPostRun', false);
unexportedRuntimeFunction('writeStringToMemory', false);
unexportedRuntimeFunction('writeArrayToMemory', false);
unexportedRuntimeFunction('writeAsciiToMemory', false);
unexportedRuntimeFunction('addRunDependency', true);
unexportedRuntimeFunction('removeRunDependency', true);
unexportedRuntimeFunction('FS_createFolder', false);
unexportedRuntimeFunction('FS_createPath', true);
unexportedRuntimeFunction('FS_createDataFile', true);
unexportedRuntimeFunction('FS_createPreloadedFile', true);
unexportedRuntimeFunction('FS_createLazyFile', true);
unexportedRuntimeFunction('FS_createLink', false);
unexportedRuntimeFunction('FS_createDevice', true);
unexportedRuntimeFunction('FS_unlink', true);
unexportedRuntimeFunction('getLEB', false);
unexportedRuntimeFunction('getFunctionTables', false);
unexportedRuntimeFunction('alignFunctionTables', false);
unexportedRuntimeFunction('registerFunctions', false);
unexportedRuntimeFunction('addFunction', false);
unexportedRuntimeFunction('removeFunction', false);
unexportedRuntimeFunction('getFuncWrapper', false);
unexportedRuntimeFunction('prettyPrint', false);
unexportedRuntimeFunction('dynCall', false);
unexportedRuntimeFunction('getCompilerSetting', false);
unexportedRuntimeFunction('print', false);
unexportedRuntimeFunction('printErr', false);
unexportedRuntimeFunction('getTempRet0', false);
unexportedRuntimeFunction('setTempRet0', false);
unexportedRuntimeFunction('callMain', false);
unexportedRuntimeFunction('abort', false);
unexportedRuntimeFunction('keepRuntimeAlive', false);
unexportedRuntimeFunction('zeroMemory', false);
unexportedRuntimeFunction('stringToNewUTF8', false);
unexportedRuntimeFunction('abortOnCannotGrowMemory', false);
unexportedRuntimeFunction('emscripten_realloc_buffer', false);
unexportedRuntimeFunction('ENV', false);
unexportedRuntimeFunction('withStackSave', false);
unexportedRuntimeFunction('ERRNO_CODES', false);
unexportedRuntimeFunction('ERRNO_MESSAGES', false);
unexportedRuntimeFunction('setErrNo', false);
unexportedRuntimeFunction('inetPton4', false);
unexportedRuntimeFunction('inetNtop4', false);
unexportedRuntimeFunction('inetPton6', false);
unexportedRuntimeFunction('inetNtop6', false);
unexportedRuntimeFunction('readSockaddr', false);
unexportedRuntimeFunction('writeSockaddr', false);
unexportedRuntimeFunction('DNS', false);
unexportedRuntimeFunction('getHostByName', false);
unexportedRuntimeFunction('Protocols', false);
unexportedRuntimeFunction('Sockets', false);
unexportedRuntimeFunction('getRandomDevice', false);
unexportedRuntimeFunction('traverseStack', false);
unexportedRuntimeFunction('convertFrameToPC', false);
unexportedRuntimeFunction('UNWIND_CACHE', false);
unexportedRuntimeFunction('saveInUnwindCache', false);
unexportedRuntimeFunction('convertPCtoSourceLocation', false);
unexportedRuntimeFunction('readAsmConstArgsArray', false);
unexportedRuntimeFunction('readAsmConstArgs', false);
unexportedRuntimeFunction('mainThreadEM_ASM', false);
unexportedRuntimeFunction('jstoi_q', false);
unexportedRuntimeFunction('jstoi_s', false);
unexportedRuntimeFunction('getExecutableName', false);
unexportedRuntimeFunction('listenOnce', false);
unexportedRuntimeFunction('autoResumeAudioContext', false);
unexportedRuntimeFunction('dynCallLegacy', false);
unexportedRuntimeFunction('getDynCaller', false);
unexportedRuntimeFunction('dynCall', false);
unexportedRuntimeFunction('callRuntimeCallbacks', false);
unexportedRuntimeFunction('wasmTableMirror', false);
unexportedRuntimeFunction('setWasmTableEntry', false);
unexportedRuntimeFunction('getWasmTableEntry', false);
unexportedRuntimeFunction('handleException', false);
unexportedRuntimeFunction('runtimeKeepalivePush', false);
unexportedRuntimeFunction('runtimeKeepalivePop', false);
unexportedRuntimeFunction('callUserCallback', false);
unexportedRuntimeFunction('maybeExit', false);
unexportedRuntimeFunction('safeSetTimeout', false);
unexportedRuntimeFunction('asmjsMangle', false);
unexportedRuntimeFunction('asyncLoad', false);
unexportedRuntimeFunction('alignMemory', false);
unexportedRuntimeFunction('mmapAlloc', false);
unexportedRuntimeFunction('reallyNegative', false);
unexportedRuntimeFunction('unSign', false);
unexportedRuntimeFunction('reSign', false);
unexportedRuntimeFunction('formatString', false);
unexportedRuntimeFunction('PATH', false);
unexportedRuntimeFunction('PATH_FS', false);
unexportedRuntimeFunction('SYSCALLS', false);
unexportedRuntimeFunction('getSocketFromFD', false);
unexportedRuntimeFunction('getSocketAddress', false);
unexportedRuntimeFunction('JSEvents', false);
unexportedRuntimeFunction('registerKeyEventCallback', false);
unexportedRuntimeFunction('specialHTMLTargets', false);
unexportedRuntimeFunction('maybeCStringToJsString', false);
unexportedRuntimeFunction('findEventTarget', false);
unexportedRuntimeFunction('findCanvasEventTarget', false);
unexportedRuntimeFunction('getBoundingClientRect', false);
unexportedRuntimeFunction('fillMouseEventData', false);
unexportedRuntimeFunction('registerMouseEventCallback', false);
unexportedRuntimeFunction('registerWheelEventCallback', false);
unexportedRuntimeFunction('registerUiEventCallback', false);
unexportedRuntimeFunction('registerFocusEventCallback', false);
unexportedRuntimeFunction('fillDeviceOrientationEventData', false);
unexportedRuntimeFunction('registerDeviceOrientationEventCallback', false);
unexportedRuntimeFunction('fillDeviceMotionEventData', false);
unexportedRuntimeFunction('registerDeviceMotionEventCallback', false);
unexportedRuntimeFunction('screenOrientation', false);
unexportedRuntimeFunction('fillOrientationChangeEventData', false);
unexportedRuntimeFunction('registerOrientationChangeEventCallback', false);
unexportedRuntimeFunction('fillFullscreenChangeEventData', false);
unexportedRuntimeFunction('registerFullscreenChangeEventCallback', false);
unexportedRuntimeFunction('registerRestoreOldStyle', false);
unexportedRuntimeFunction('hideEverythingExceptGivenElement', false);
unexportedRuntimeFunction('restoreHiddenElements', false);
unexportedRuntimeFunction('setLetterbox', false);
unexportedRuntimeFunction('currentFullscreenStrategy', false);
unexportedRuntimeFunction('restoreOldWindowedStyle', false);
unexportedRuntimeFunction('softFullscreenResizeWebGLRenderTarget', false);
unexportedRuntimeFunction('doRequestFullscreen', false);
unexportedRuntimeFunction('fillPointerlockChangeEventData', false);
unexportedRuntimeFunction('registerPointerlockChangeEventCallback', false);
unexportedRuntimeFunction('registerPointerlockErrorEventCallback', false);
unexportedRuntimeFunction('requestPointerLock', false);
unexportedRuntimeFunction('fillVisibilityChangeEventData', false);
unexportedRuntimeFunction('registerVisibilityChangeEventCallback', false);
unexportedRuntimeFunction('registerTouchEventCallback', false);
unexportedRuntimeFunction('fillGamepadEventData', false);
unexportedRuntimeFunction('registerGamepadEventCallback', false);
unexportedRuntimeFunction('registerBeforeUnloadEventCallback', false);
unexportedRuntimeFunction('fillBatteryEventData', false);
unexportedRuntimeFunction('battery', false);
unexportedRuntimeFunction('registerBatteryEventCallback', false);
unexportedRuntimeFunction('setCanvasElementSize', false);
unexportedRuntimeFunction('getCanvasElementSize', false);
unexportedRuntimeFunction('demangle', false);
unexportedRuntimeFunction('demangleAll', false);
unexportedRuntimeFunction('jsStackTrace', false);
unexportedRuntimeFunction('stackTrace', false);
unexportedRuntimeFunction('getEnvStrings', false);
unexportedRuntimeFunction('checkWasiClock', false);
unexportedRuntimeFunction('flush_NO_FILESYSTEM', false);
unexportedRuntimeFunction('writeI53ToI64', false);
unexportedRuntimeFunction('writeI53ToI64Clamped', false);
unexportedRuntimeFunction('writeI53ToI64Signaling', false);
unexportedRuntimeFunction('writeI53ToU64Clamped', false);
unexportedRuntimeFunction('writeI53ToU64Signaling', false);
unexportedRuntimeFunction('readI53FromI64', false);
unexportedRuntimeFunction('readI53FromU64', false);
unexportedRuntimeFunction('convertI32PairToI53', false);
unexportedRuntimeFunction('convertU32PairToI53', false);
unexportedRuntimeFunction('setImmediateWrapped', false);
unexportedRuntimeFunction('clearImmediateWrapped', false);
unexportedRuntimeFunction('polyfillSetImmediate', false);
unexportedRuntimeFunction('uncaughtExceptionCount', false);
unexportedRuntimeFunction('exceptionLast', false);
unexportedRuntimeFunction('exceptionCaught', false);
unexportedRuntimeFunction('ExceptionInfo', false);
unexportedRuntimeFunction('CatchInfo', false);
unexportedRuntimeFunction('exception_addRef', false);
unexportedRuntimeFunction('exception_decRef', false);
unexportedRuntimeFunction('Browser', false);
unexportedRuntimeFunction('funcWrappers', false);
unexportedRuntimeFunction('getFuncWrapper', false);
unexportedRuntimeFunction('setMainLoop', false);
unexportedRuntimeFunction('wget', false);
unexportedRuntimeFunction('FS', false);
unexportedRuntimeFunction('MEMFS', false);
unexportedRuntimeFunction('TTY', false);
unexportedRuntimeFunction('PIPEFS', false);
unexportedRuntimeFunction('SOCKFS', false);
unexportedRuntimeFunction('_setNetworkCallback', false);
unexportedRuntimeFunction('tempFixedLengthArray', false);
unexportedRuntimeFunction('miniTempWebGLFloatBuffers', false);
unexportedRuntimeFunction('heapObjectForWebGLType', false);
unexportedRuntimeFunction('heapAccessShiftForWebGLHeap', false);
unexportedRuntimeFunction('GL', false);
unexportedRuntimeFunction('emscriptenWebGLGet', false);
unexportedRuntimeFunction('computeUnpackAlignedImageSize', false);
unexportedRuntimeFunction('emscriptenWebGLGetTexPixelData', false);
unexportedRuntimeFunction('emscriptenWebGLGetUniform', false);
unexportedRuntimeFunction('webglGetUniformLocation', false);
unexportedRuntimeFunction('webglPrepareUniformLocationsBeforeFirstUse', false);
unexportedRuntimeFunction('webglGetLeftBracePos', false);
unexportedRuntimeFunction('emscriptenWebGLGetVertexAttrib', false);
unexportedRuntimeFunction('writeGLArray', false);
unexportedRuntimeFunction('AL', false);
unexportedRuntimeFunction('SDL_unicode', false);
unexportedRuntimeFunction('SDL_ttfContext', false);
unexportedRuntimeFunction('SDL_audio', false);
unexportedRuntimeFunction('SDL', false);
unexportedRuntimeFunction('SDL_gfx', false);
unexportedRuntimeFunction('GLUT', false);
unexportedRuntimeFunction('EGL', false);
unexportedRuntimeFunction('GLFW_Window', false);
unexportedRuntimeFunction('GLFW', false);
unexportedRuntimeFunction('GLEW', false);
unexportedRuntimeFunction('IDBStore', false);
unexportedRuntimeFunction('runAndAbortIfError', false);
unexportedRuntimeFunction('WS', false);
unexportedRuntimeFunction('warnOnce', false);
unexportedRuntimeFunction('stackSave', false);
unexportedRuntimeFunction('stackRestore', false);
unexportedRuntimeFunction('stackAlloc', false);
unexportedRuntimeFunction('AsciiToString', false);
unexportedRuntimeFunction('stringToAscii', false);
unexportedRuntimeFunction('UTF16ToString', false);
unexportedRuntimeFunction('stringToUTF16', false);
unexportedRuntimeFunction('lengthBytesUTF16', false);
unexportedRuntimeFunction('UTF32ToString', false);
unexportedRuntimeFunction('stringToUTF32', false);
unexportedRuntimeFunction('lengthBytesUTF32', false);
unexportedRuntimeFunction('allocateUTF8', false);
unexportedRuntimeFunction('allocateUTF8OnStack', false);
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
unexportedRuntimeFunction('intArrayFromBase64', false);
unexportedRuntimeFunction('tryParseAsDataURI', false);
unexportedRuntimeSymbol('ALLOC_NORMAL', false);
unexportedRuntimeSymbol('ALLOC_STACK', false);

var calledRun;

/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  _emscripten_stack_init();
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
Module['run'] = run;

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
    var flush = flush_NO_FILESYSTEM;
    if (flush) flush();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -s FORCE_FILESYSTEM=1)');
  }
}

/** @param {boolean|number=} implicit */
function exit(status, implicit) {
  EXITSTATUS = status;

  // Skip this check if the runtime is being kept alive deliberately.
  // For example if `exit_with_live_runtime` is called.
  if (!runtimeKeepaliveCounter) {
    checkUnflushedContent();
  }

  if (keepRuntimeAlive()) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
      readyPromiseReject(msg);
      err(msg);
    }
  } else {
    exitRuntime();
  }

  procExit(status);
}

function procExit(code) {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    if (Module['onExit']) Module['onExit'](code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
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
