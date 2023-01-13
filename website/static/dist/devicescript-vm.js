
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
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_devs_enable_gc_stress')) {
        Object.defineProperty(Module['ready'], '_jd_em_devs_enable_gc_stress', { configurable: true, get: function() { abort('You are getting _jd_em_devs_enable_gc_stress on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_devs_enable_gc_stress', { configurable: true, set: function() { abort('You are setting _jd_em_devs_enable_gc_stress on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
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

function unexportedMessage(sym, isFSSybol) {
  var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
  if (isFSSybol) {
    msg += '. Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you';
  }
  return msg;
}

function unexportedRuntimeSymbol(sym, isFSSybol) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get: function() {
        abort(unexportedMessage(sym, isFSSybol));
      }
    });
  }
}

function unexportedRuntimeFunction(sym, isFSSybol) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Module[sym] = () => abort(unexportedMessage(sym, isFSSybol));
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
// NOTE: This is also used as the process return code code in shell environments
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
// a copy of that string as a Javascript String object.

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
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
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

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
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

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
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
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

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

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
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

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

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

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
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

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAR/f39/AGAAAGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAHA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADQOLhYCAAIkFBwEABwcIBwAABwQACAcHBQUAAwIABwcCBAMDAwARBxEHBwMGBwIHBwMJBQUFBQcACAUVGwwNBQIGAwYAAAICAAAABAMEAgICAwAGAAIGAAADAgICAAMDAwMFAAAAAgEABQAFBQMCAgICAwQDAwMFAggAAQEAAAAAAAABAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAgAAAAIAAAEBAQEBAQEBAQEBAQEBAAwAAgIAAQEBAAEAAAEAAAwAAQIAAQIDBAUBAgAAAgAACAEDBgMFBgkGBQYFAwYGBgYJDQUGAwMFAwMDBgUGBgYGBgYDDg8CAgIEAQMBAgADCQkBAgkEAwEDAwIEBwIAAgAcHQMEBQIGBgYBAQYGAQMCAgEGDAYBBgYBBAYDAAICBQAPDwICBg4DAwMDBQUDAwMEBQEDAAMDAAQFBQMBAQICAgICAgICAgICAgICAQICAgEBAQEBAgEBAQEBAgICAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgEBAQEBAgICAgICAgICAQEBAgQEAQwNAgIAAAcJAwEDBwEAAAgAAgYABwUDCAkEBAAAAgcAAwcHBAECAQASAwkHAAAEAAIHBQAABB4BAw4DAwAJBwMFBAMEAAQDAwMDBAQFBQAAAAQHBwcHBAcHBwgIAxEIAwAEAQAJAQMDAQMGBAkfCRYDAxIEAwUDBwcGBwQECAAEBAcJBwgABwggBAUFBQQAFxAFBAcABAQFCQcEBAATCwsLEAUIIQsTEwsXEiILAwMDBAQWBAQYChQjCiQGFSUmBg4EBAAIBAoUGRkKDycCAggIFAoKGAooCAAEBwgICCkNKgSHgICAAAFwAb8BvwEFhoCAgAABAYACgAIGk4CAgAADfwFBgNPBAgt/AUEAC38BQQALB5iEgIAAGQZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAWEF9fZXJybm9fbG9jYXRpb24AxQQZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABm1hbGxvYwCABQRmcmVlAIEFGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACkaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKgpqZF9lbV9pbml0ACsNamRfZW1fcHJvY2VzcwAsFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC4RamRfZW1fZGV2c19kZXBsb3kALxFqZF9lbV9kZXZzX3ZlcmlmeQAwGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAxG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzcwAyDF9fc3RkaW9fZXhpdADRBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzANcEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACYBRllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAJkFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAmgUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAJsFCXN0YWNrU2F2ZQCVBQxzdGFja1Jlc3RvcmUAlgUKc3RhY2tBbGxvYwCXBQxkeW5DYWxsX2ppamkAnQUJ9YKAgAABAEEBC74BKDlAQUJDXF1gVVthYsQBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAa0BrgGvAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHDAcYBxwHIAckBygHLAcwBzQHOAc8B0AG9Ar8CwQLfAuAC4QLiAuMC5ALlAuYC5wLoAukC6gLrAuwC7QLuAu8C8ALxAvIC8wL0AvUC9gL3AvgC+QL6AvsC/AL9Av4C/wKAA4EDggODA4QDhQOGA4cDiAOJA4oDiwOMA40DjgOPA5ADkQOSA5MDlAOVA5YDlwOYA5kDmgObA5wDnQOeA58DoAOhA6IDowOkA6UDpgOnA6gDqQOqA6sDrAOtA64DrwOwA7EDsgOzA7QDtQO2A7cDuAO5A8wDzwPTA9QDR9UD1gPZA9sD7QPuA7YE0ATPBM4ECsSViIAAiQUFABCYBQvQAQEBfwJAAkACQAJAQQAoAqDEASIDRQ0AIAFBA3ENASAAIANrIgNBAEgN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JAALEwAgACAAIABBABCFAhCCARCKAguKAQIBfwF+IwBBMGsiAyQAIAMgAikDACIENwMYIAMgBDcDIAJAAkACQCABIANBGGoQzAINACADIAMpAyA3AxAgA0EoaiABQRIgA0EQahC5AgwBCyADIAMpAyA3AwggASADQQhqIANBKGoQzgJFDQAgACADKAIoEMYCDAELIABCADcDAAsgA0EwaiQAC5sBAgJ/AX4jAEEwayIBJAAgASAAKQNQIgM3AxAgASADNwMgAkACQCAAIAFBEGoQzAINACABIAEpAyA3AwggAUEoaiAAQRIgAUEIahC5AkEAIQIMAQsgASABKQMgNwMAIAAgASABQShqEM4CIQILAkAgAkUNACABQRhqIAAgAiABKAIoEKsCIAAoAqwBIAEpAxg3AyALIAFBMGokAAvIAQIFfwF+IwBBMGsiASQAIAEgACkDUCIGNwMYIAEgBjcDIAJAAkAgACABQRhqEM0CDQAgASABKQMgNwMQIAFBKGogAEGvGCABQRBqELoCQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQzgIhAgsCQCACRQ0AIABBABCFAiEDIABBARCFAiEEIABBAhCFAiEAIAEoAigiBSADTQ0AIAEgBSADayIFNgIoIAIgA2ogACAFIAQgBSAESRsQygQaCyABQTBqJAALmwMCB38BfiMAQeAAayIBJAAgASAAKQNQIgg3AzggASAINwNQAkACQCAAIAFBOGoQzQINACABIAEpA1A3AzAgAUHYAGogAEGvGCABQTBqELoCQQAhAgwBCyABIAEpA1A3AyggACABQShqIAFBzABqEM4CIQILAkAgAkUNACAAQQAQhQIhAyABIABB4ABqKQMAIgg3AyAgASAINwNAAkACQCAAIAFBIGoQpQJFDQAgASABKQNANwMAIAAgASABQdgAahCnAiEEDAELIAEgASkDQCIINwNQIAEgCDcDGAJAIAAgAUEYahDMAg0AIAEgASkDUDcDECABQdgAaiAAQRIgAUEQahC5AkEAIQQMAQsgASABKQNQNwMIIAAgAUEIaiABQdgAahDOAiEECyAERQ0AIABBAhCFAiEFIABBAxCFAiEAIAEoAlgiBiAFTQ0AIAEgBiAFayIGNgJYIAEoAkwiByADTQ0AIAEgByADayIHNgJMIAIgA2ogBCAF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AxshBCADDQALIAAgBBCIAgsRACAAIABBABCGAhDdBBCHAgsYACAAIABBABCGAiAAQQEQhgIQ5wQQhwILLgEDf0EAIQEgAEEAEIUCIQICQCAAQQEQhQIiA0UNACACIANtIQELIAAgARCIAgsuAQN/QQAhASAAQQAQhQIhAgJAIABBARCFAiIDRQ0AIAIgA28hAQsgACABEIgCCxYAIAAgAEEAEIUCIABBARCFAmwQiAILCQAgAEEBEKwBC/ACAgR/AnwjAEEwayICJAAgAiAAQdgAaikDADcDKCACIABB4ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEMoCIQMgAiACKQMgNwMQIAAgAkEQahDKAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoAqwBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQyQIhBiACIAIpAyA3AwAgACACEMkCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCrAFBACkDwFo3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKsASABKQMANwMgIAJBMGokAAsJACAAQQAQrAELqAECA38BfiMAQSBrIgEkACABIABB2ABqKQMANwMYIAEgAEHgAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahD4ASECIAEgASkDEDcDACAAIAEQ+gEiA0UNACACRQ0AAkAgAygCAEGAgID4AHFBgICAyABHDQAgACACIAMoAgQQ4wELIAAgAiADEOMBCyAAKAKsASABKQMYNwMgIAFBIGokAAsJACAAQQEQsAELvgECA38BfiMAQTBrIgIkACACIABB2ABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEPoBIgNFDQAgAEEAEIEBIgRFDQAgAkEgaiAAQQggBBDIAiACIAIpAyA3AxAgACACQRBqEH0CQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAMoAgQgBCABEOgBCyAAIAMgBCABEOgBIAIgAikDIDcDCCAAIAJBCGoQfiAAKAKsASACKQMgNwMgCyACQTBqJAALCQAgAEEAELABC+MBAgN/AX4jAEHAAGsiASQAIAEgAEHYAGopAwAiBDcDOCABIABB4ABqKQMANwMwIAEgBDcDIAJAAkAgACABQSBqENACIgINAEEAIQMMAQsgAi0AA0EPcSEDCwJAAkACQCADQXxqDgYBAAAAAAEACyABIAEpAzg3AwggAUEoaiAAQdIAIAFBCGoQuQIMAQsgASABKQMwNwMYAkAgACABQRhqEPoBIgMNACABIAEpAzA3AxAgAUEoaiAAQTQgAUEQahC5AgwBCyACIAM2AgQgACgCrAEgASkDODcDIAsgAUHAAGokAAu5AQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC5AkEAIQILAkACQCACDQAgAEIANwMADAELAkAgASACLwESEN4CRQ0AIAAgAi8BEjYCACAAQQI2AgQMAQsgAEIANwMACyADQSBqJAALqgEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQuQJBACECCwJAAkAgAg0AIABCADcDAAwBCyADIAJBCGpBCBCvBDYCACAAIAFB3xIgAxCqAgsgA0EgaiQAC7IBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELkCQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgA0EYaiACKQMIEK0EIAMgA0EYajYCACAAIAFBoRYgAxCqAgsgA0EgaiQAC5kBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELkCQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLQAVEMYCCyADQSBqJAALmQEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQuQJBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARAQxgILIANBIGokAAuZAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC5AkEAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFBDGAgsgA0EgaiQAC5wBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELkCQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLQAUQQFxEMcCCyADQSBqJAALnwEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQuQJBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBf3NBAXEQxwILIANBIGokAAudAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC5AkEAIQILAkACQCACDQAgAEIANwMADAELIAAgAUEIIAIoAhwQyAILIANBIGokAAu7AQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC5AkEAIQILAkACQCACDQAgAEIANwMADAELQQAhAQJAIAItABRBAXENACACLQAVQTBLDQAgAi8BEEEPdiEBCyAAIAEQxwILIANBIGokAAvDAQEBfyMAQSBrIgMkACADIAIpAwA3AxACQAJAIAMoAhQiAkGAgMD/B3ENACACQQ9xQQhHDQAgAygCECICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0BCyADIAMpAxA3AwggA0EYaiABQS8gA0EIahC5AkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLgEQQX9KDQAgACACLQAQEMYCDAELIABCADcDAAsgA0EgaiQAC6MBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELkCQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgMAARhDHAgsgA0EgaiQAC6IBAQF/IwBBIGsiAyQAIAMgAikDADcDEAJAAkAgAygCFCICQYCAwP8HcQ0AIAJBD3FBCEcNACADKAIQIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQELIAMgAykDEDcDCCADQRhqIAFBLyADQQhqELkCQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgCBGEMcCCyADQSBqJAALuAEBAX8jAEEgayIDJAAgAyACKQMANwMQAkACQCADKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAMoAhAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAQsgAyADKQMQNwMIIANBGGogAUEvIANBCGoQuQJBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAIvARAiAkEMdkF/akECSQ0AIABCADcDAAwBCyAAIAJB/x9xEMYCCyADQSBqJAAL5QIBCX8jAEEgayIBJAAgASAAKQNQNwMQAkACQCABKAIUIgJBgIDA/wdxDQAgAkEPcUEIRw0AIAEoAhAiA0UNACADKAIAQYCAgPgAcUGAgIDQAEYNAQsgASABKQMQNwMAIAFBGGogAEEvIAEQuQJBACEDC0EAIQICQCADRQ0AIAAgAy8BEhDuASIERQ0AIAQvAQgiBUUNACAAKACkASICIAIoAmBqIAQvAQpBAnRqIQZBACECIAMuARAiB0H//wNxIQggB0F/SiEJAkACQANAIAYgAkEDdGovAQIiBCAIRg0CAkAgCQ0AIARBgOADcUGAgAJHDQAgBCAHc0H/AXFFDQILIAJBAWoiAiAFRw0AC0EAIQIMAgsgBiACQQN0aiECDAELIAYgAkEDdGohAgsCQCACRQ0AIAFBCGogACACIAMoAhwiBEEMaiAELwEEEMIBIAAoAqwBIAEpAwg3AyALIAFBIGokAAuVAwEFfyMAQcAAayIFJAAgBSADNgI8AkACQCACLQAEQQFxRQ0AAkAgAUEAEIEBIgYNACAAQgA3AwAMAgsgAyAEaiEHIAVBMGogAUEIIAYQyAIgBSAFKQMwNwMgIAEgBUEgahB9IAEoAKQBIgMgAygCYGogAi8BBkECdGohA0EAIQgDQAJAAkAgByAFKAI8IgRrIgJBAE4NAEECIQIMAQsgBUEoaiABIAMtAAIgBUE8aiACEEpBAiECIAUpAyhQDQAgBSAFKQMoNwMYIAEgBUEYahB9IAYvAQghCSAFIAUpAyg3AxAgASAGIAkgBUEQahCEAiAFIAUpAyg3AwggASAFQQhqEH4gBSgCPCAERg0AAkAgCA0AIAMtAANBHnRBH3UgA3EhCAsgA0EEaiEEAkACQCADLwEERQ0AIAQhAwwBCyAIIQMgCA0AQQAhCCAEIQMMAQtBACECCyACRQ0ACyAFIAUpAzA3AwAgASAFEH4gACAFKQMwNwMADAELIAAgASACLwEGIAVBPGogBBBKCyAFQcAAaiQAC8kBAgN/AX4jAEHAAGsiASQAIAEgACkDUCIENwMoIAEgBDcDGCABIAQ3AzACQCAAIAFBGGogAUEkahDtASICDQAgASABKQMwNwMQIAFBOGogAEHsGCABQRBqELoCQQAhAgsCQCACRQ0AIAEoAiRB//8BRw0AIAEgASkDKDcDCCABQThqIABB3xggAUEIahC6AkEAIQILAkAgAkUNACAAKAKsASEDIAAgASgCJCACLwECQfQDQQAQ0QEgA0EOIAIQjAILIAFBwABqJAALPQEBfyMAQRBrIgIkACACQQhqIAAgASAAQfABaiAAQewBai0AABDCASAAKAKsASACKQMINwMgIAJBEGokAAvGAwEKfyMAQTBrIgIkACAAQdgAaiEDAkAgAC0AQ0F/aiIEQQFHDQAgAiADKQMANwMgAkAgACACQSBqENECDQBBASEEDAELIAIgAykDADcDGCAAIAJBGGoQ0AIiBS8BCCEEIAUoAgwhAwsgAEHwAWohBgJAAkAgAS0ABEEBcUUNACAGIQUgBEUNASAAQdwDaiEHIAAoAKQBIgUgBSgCYGogAS8BBkECdGohCCAGIQVBACEBQQAhCQNAAkACQAJAIAcgBWsiCkEASA0AIAgtAAIhCyACIAMgAUEDdGopAwA3AxAgACALIAUgCiACQRBqEEsiCkUNAAJAIAkNACAILQADQR50QR91IAhxIQkLIAUgCmohBSAIQQRqIQoCQCAILwEERQ0AIAohCAwCCyAJIQggCQ0BQQAhCSAKIQgLQQAhCgwBC0EBIQoLIApFDQIgAUEBaiIBIARJDQAMAgsACyAGIQUCQAJAIAQOAgIBAAsgAiAENgIAIAJBKGogAEGTLyACELcCIAYhBQwBCyABLwEGIQUgAiADKQMANwMIIAYgACAFIAZB7AEgAkEIahBLaiEFCyAAQewBaiAFIAZrOgAAIAJBMGokAAvDAQICfwF+IwBBwABrIgEkACABIAApA1AiAzcDKCABIAM3AxggASADNwMwAkAgACABQRhqIAFBJGoQ7QEiAg0AIAEgASkDMDcDECABQThqIABB7BggAUEQahC6AkEAIQILAkAgAkUNACABKAIkQf//AUcNACABIAEpAyg3AwggAUE4aiAAQd8YIAFBCGoQugJBACECCwJAIAJFDQAgACACEMUBIAAgASgCJCACLwECQf8fcUGAwAByENMBCyABQcAAaiQAC5oBAgF/AX4jAEEwayIDJAAgAyACKQMAIgQ3AxAgAyAENwMgAkAgASADQRBqIANBHGoQ7QEiAg0AIAMgAykDIDcDCCADQShqIAFB7BggA0EIahC6AkEAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCHCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EwaiQA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QegBakJ/NwMAIABCfzcD4AEgACABENQBDwsgAyACOwEUIAMgATsBEiAAQewBai0AACEBIAMgAy0AEEHwAXFBAnI6ABAgAyAAIAEQeiICNgIIAkAgAkUNACADIAE6AAwgAiAAQfABaiABEMgEGgsgA0EAEGgLDwtBzztBhzZBzABB/SoQqAQAC44CAgJ/AX4jAEEgayICJAACQCAAKAKwASIDRQ0AA0ACQCADLwESIAFHDQAgAyADLQAQQSByOgAQCyADKAIAIgMNAAsLIAIgATYCGCACQQI2AhwgAiACKQMYNwMAIAJBEGogACACQeEAEP0BAkAgAikDECIEUA0AIAAgBDcDUCAAQQI6AEMgAEHYAGoiA0IANwMAIAJBCGogACABENYBIAMgAikDCDcDACAAQQFBARBvIgNFDQAgAyADLQAQQSByOgAQCwJAIAAoArABIgNFDQADQAJAIAMtABAiAUEgcUUNACADIAFB3wFxOgAQIAMQcSAAKAKwASIDDQEMAgsgAygCACIDDQALCyACQSBqJAALKwAgAEJ/NwPgASAAQfgBakJ/NwMAIABB8AFqQn83AwAgAEHoAWpCfzcDAAuRAgEDfyMAQSBrIgMkAAJAAkAgAUHtAWotAABB/wFHDQAgAEIANwMADAELAkAgAUEKQSAQeSIEDQAgAEIANwMADAELIANBGGogAUEIIAQQyAIgAyADKQMYNwMQIAEgA0EQahB9IAQgASABQewBai0AABCCASIFNgIcAkAgBQ0AIAMgAykDGDcDACABIAMQfiAAQgA3AwAMAQsgBUEMaiABQfABaiAFLwEEEMgEGiAEIAFB5AFqKQIANwMIIAQgAS0A7QE6ABUgBCABQe4Bai8BADsBECABQeMBai0AACEFIAQgAjsBEiAEIAU6ABQgAyADKQMYNwMIIAEgA0EIahB+IAAgAykDGDcDAAsgA0EgaiQAC6QBAQJ/AkACQCAALwEIDQAgACgCrAEiAkUNASACQf//AzsBEiACIAItABBB8AFxQQNyOgAQIAIgACgCzAEiAzsBFCAAIANBAWo2AswBIAIgASkDADcDCCACQQEQ2AFFDQACQCACLQAQQQ9xQQJHDQAgAigCLCACKAIIEFQLIAJCADcDCCACIAItABBB8AFxOgAQCw8LQc87QYc2QegAQYchEKgEAAvfAgEHfyMA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AAsgAy8BDkGBIkcNASADLQADQQFxDQFBACgC3GVBf2ohCCACKAIAIQtBACEBAkADQAJAIAEgCEwNAEEAIQUMAgsCQAJAQdDiACAIIAFqQQJtIgdBDGxqIgkoAgQiCiALTw0AQQEhDCAHQQFqIQEMAQtBACEMAkAgCiALSw0AIAkhBQwBCyAHQX9qIQhBASEMCyAMDQALCyAFRQ0BIAAoAiQiAUUNASADQRBqIQwDQAJAIAEoAgQgAkcNAAJAIAEtAAkiCEUNACABIAhBf2o6AAkLAkAgDCADLQAMIAUvAQgQSSINvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhBwJAAkBBACgC2MwBIgsgAUHEAGooAgAiCGtBAEgNACABQShqIgsgASsDGCAIIAdruKIgCysDAKA5AwAMAQsgAUEoaiIIIAErAxggCyAHa7iiIAgrAwCgOQMAIAshCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgC2MwBIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBDtBEUhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIECEgAygCBBCxBCEIDAELIAxFDQEgCBAhQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtBhD5BpTRBlQJB5woQqAQAC7oBAQN/QcgAECAiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKALYzAEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABEOEDIgBFDQAgAiAAKAIEELEENgIMCyACQbMsEMACIAIL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DQILIAEoAgAiAQ0ACwsCQCABDQBByAAQICIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQQAoAtjMASIGNgJAAkAgASgCECIFDQACQAJAIAAtABJFDQAgAEEoaiEFIAAoAigNASAFQYgnNgIADAELIABBDGohBQsgBSgCACEFCyABIAUgBmo2AkQgAUGzLBDAAiABIAMQICIFNgIMIAUgBCACEMgEGgsgAQs7AQF/QQBBkNoAEI8EIgE2AsDJASABQQE6ABIgASAANgIgIAFB4NQDNgIMIAFBgQI7ARBB0gAgARDjAwvKAgEDfwJAQQAoAsDJASICRQ0AIAIgACAAEO4EEMICIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoAtjMASIEIABBxABqKAIAIgJrQQBIDQAgAEEoaiIEIAArAxggAiADa7iiIAQrAwCgOQMADAELIABBKGoiAiAAKwMYIAQgA2u4oiACKwMAoDkDACAEIQILIAAgAjYCFAJAIABBOGorAwAgAWNFDQAgACABOQM4CwJAIABBMGorAwAgAWRFDQAgACABOQMwCyAAIAE5AxgLC8YCAgJ+BH8CQAJAAkACQCABEMYEDgQAAQICAwsgAEICNwMADwsCQCABRAAAAAAAAAAAZEUNACAAQsIANwMADwsgAELDADcDAA8LIABCgICAgHA3AwAPCwJAIAG9IgJCIIgiAyAChKcNACAAQoCAgIBwNwMADwsCQCADpyIEQRR2Qf8PcSIFQf8HSQ0AIAKnIQYCQAJAIAVBkwhLDQAgBg0CAkAgBUGTCEYNACAEQf//P3EgBUGNeGp0DQMLIARB//8/cUGAgMAAckGTCCAFa3YhBQwBCwJAIAVBnghJDQAgBg0CIARBgICAj3xHDQIgAEKAgICAeDcDAA8LIAYgBUHtd2oiB3QNASAEQf//P3FBgIDAAHIgB3QgBkGzCCAFa3ZyIQULIABBfzYCBCAAIAVBACAFayACQn9V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AkACQCADKQMIQgBSDQAgAEIANwMADAELIAMgAykDCDcDACAAIAIgBSAEIANBABBICyADQRBqJAALEAAgACACKAKsASkDIDcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhC6AyADIAMpAwg3AwAgACACIAMQ0gIQxgIgA0EQaiQACwkAIABCADcDAAs1AQF/IwBBEGsiAyQAIANBCGogAhC6AyAAQbDaAEG42gAgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA7BaNwMACw0AIABBACkDuFo3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQugMgAyADKQMINwMAIAAgAiADEMsCEMcCIANBEGokAAsNACAAQQApA8BaNwMAC6kBAgF/AXwjAEEQayIDJAAgA0EIaiACELoDAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAiADEMkCIgREAAAAAAAAAABjRQ0AIAAgBJoQxQIMAgsgACADKQMINwMADAELAkAgAygCCCICQX9KDQACQCACQYCAgIB4Rw0AIABBACkDqFo3AwAMAgsgAEEAIAJrEMYCDAELIAAgAykDCDcDAAsgA0EQaiQACw8AIAAgAhC8A0F/cxDGAgsyAQF/IwBBEGsiAyQAIANBCGogAhC6AyAAIAMoAgxFIAMoAghBAkZxEMcCIANBEGokAAtxAQF/IwBBEGsiAyQAIANBCGogAhC6AwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDACAAIAIgAxDJApoQxQIMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQOoWjcDAAwBCyAAQQAgAmsQxgILIANBEGokAAs3AQF/IwBBEGsiAyQAIANBCGogAhC6AyADIAMpAwg3AwAgACACIAMQywJBAXMQxwIgA0EQaiQACwwAIAAgAhC8AxDGAguqAgIEfwF8IwBBwABrIgMkACADQThqIAIQugMgAkEYaiIEIAMpAzg3AwAgA0E4aiACELoDIAIgAykDODcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEggAigCECIGIAVqIgUgBkhzDQAgACAFEMYCDAELIAMgAkEQaiIFKQMANwMwAkACQCACIANBMGoQpQINACADIAQpAwA3AyggAiADQShqEKUCRQ0BCyADIAUpAwA3AxAg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KDcDEAJAAkAgASACQRBqENECDQAgAiACKQMoNwMIIAJBGGogAUEPIAJBCGoQuQIMAQsgAiACKQMoNwMAAkAgASACENACIgMvAQgiBEEKSQ0AIAJBGGogAUGwCBC4AgwBCyABIARBAWo6AEMgASACKQMgNwNQIAFB2ABqIAMoAgwgBEEDdBDIBBogASgCrAEgBBBmGgsgAkEwaiQAC1UBAn8jAEEQayICJAACQAJAIAAoAhAoAgAgASgCSCABLwFAaiIDSg0AIAMgAC8BBkgNAQsgAkEIaiABQekAEHRBACEDCyAAIAEgAxCwAiACQRBqJAALcwECfyMAQRBrIgIkAAJAAkAgACgCECgCACABKAJIIAEvAUBqIgNKDQAgAyAALwEGSA0BCyACQQhqIAFB6QAQdEEAIQMLAkAgA0UNACAAIAM7AQQLAkAgACABELECDQAgAkEIaiABQeoAEHQLIAJBEGokAAsgAQF/IwBBEGsiAiQAIAJBCGogAUHrABB0IAJBEGokAAtFAQF/IwBBEGsiAiQAAkACQCAAIAEQsQIgAC8BBEF/akcNACABKAKsAUIANwMgDAELIAJBCGogAUHtABB0CyACQRBqJAALVQEBfyMAQSBrIgIkACACQRhqIAEQugMCQAJAIAIpAxhCAFINACACQRBqIAFBrh5BABC1AgwBCyACIAIpAxg3AwggASACQQhqQQAQtAILIAJBIGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARC6AwJAIAIpAwhQDQAgAiACKQMINwMAIAEgAkEBELQCCyACQRBqJAALkAEBA38jAEEQayICJAACQAJAIAEQvAMiA0EQSQ0AIAJBCGogAUHuABB0DAELAkACQCAAKAIQKAIAIAEoAkggAS8BQGoiBEoNACAEIAAvAQZIDQELIAJBCGogAUHpABB0QQAhBAsgBEUNACACQQhqIAQgAxDVAiACIAIpAwg3AwAgASACQQEQtAILIAJBEGokAAsCAAuGAgEDfyMAQSBrIgMkACADQRhqIAIQugMgAyADKQMYNwMAAkACQAJAAkAgAiADIANBEGogA0EMahDzASIEQX9KDQAgACACQb8cQQAQtQIMAQsCQAJAIARB0IYDSA0AIARBsPl8aiIEQQAvAbC6AU4NA0Gw0wAgBEEDdGotAANBCHENASAAIAJBxBZBABC1AgwCCyAEIAIoAKQBQSRqKAIAQQR2Tg0DIAIoAKQBIgUgBSgCIGogBEEEdGotAAtBAnENACAAIAJBzBZBABC1AgwBCyAAIAMpAxg3AwALIANBIGokAA8LQZURQfkxQesCQdMKEKgEAAtBs8YAQfkxQfACQdMKEKgEAAtWAQJ/IwBBIGsiAyQAIANBGGogAhC6AyADQRBqIAIQugMgAyADKQMYNwMIIAIgA0EIahD8ASEEIAMgAykDEDcDACAAIAIgAyAEEP4BEMcCIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhC6AyADQRBqIAIQugMgAyADKQMYNwMIIAMgAykDEDcDACAAIAIgA0EIaiADEPEBIANBIGokAAs+AQF/AkAgAS0AQiICDQAgACABQewAEHQPCyABIAJBf2oiAjoAQiAAIAEgAkH/AXFBA3RqQdAAaikDADcDAAtqAQJ/IwBBEGsiASQAAkACQCAALQBCIgINACABQQhqIABB7AAQdAwBCyAAIAJBf2oiAjoAQiABIAAgAkH/AXFBA3RqQdAAaikDADcDCAsgASABKQMINwMAIAAgARDKAiEAIAFBEGokACAAC2oBAn8jAEEQayIBJAACQAJAIAAtAEIiAg0AIAFBCGogAEHsABB0DAELIAAgAkF/aiICOgBCIAEgACACQf8BcUEDdGpB0ABqKQMANwMICyABIAEpAwg3AwAgACABEMoCIQAgAUEQaiQAIAALiAIBAn8jAEHAAGsiAyQAAkACQCABLQBCIgQNACADQThqIAFB7AAQdAwBCyABIARBf2oiBDoAQiADIAEgBEH/AXFBA3RqQdAAaikDADcDOAsgAyADKQM4NwMoAkACQCABIANBKGoQzAINAAJAIAJBAnFFDQAgAyADKQM4NwMgIAEgA0EgahClAg0BCyADIAMpAzg3AxggA0EwaiABQRIgA0EYahC5AiAAQgA3AwAMAQsCQCACQQFxRQ0AIAMgAykDODcDECABIANBEGoQzQINACADIAMpAzg3AwggA0EwaiABQa8YIANBCGoQugIgAEIANwMADAELIAAgAykDODcDAAsgA0HAAGokAAuABAEFfwJAIARB9v8DTw0AIAAQwgNBACEFQQBBAToA0MkBQQAgASkAADcA0ckBQQAgAUEFaiIGKQAANwDWyQFBACAEQQh0IARB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AgMEBQYHCyAAIAJB//8DIAJB//8DSBsiAUEAIAFBAEobOwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBsDFBrgFBqj0QowQACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAuzAwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPYDtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBsDFBygFBvj0QowQAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQ9gO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoArDMASICIABHDQBBsMwBIQEMAQsDQCACIgFFDQIgASgCACIC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IAJBAU4NACAAQQFqIQUMAQsgAEErOgABIABBAmohBQsCQCACQX9KDQAgBUEtOgAAQQAgAmshAiAFQQFqIQULIAUhAANAIAAgAiACQQpuIgZBCmxrQTByOgAAIABBAWohACACQQlLIQcgBiECIAcNAAsgAEEAOgAAIAUgBRDuBGpBf2oiACAFTQ0BA0AgBS0AACECIAUgAC0AADoAACAAIAI6AAAgBUEBaiIFIABBf2oiAEkNAAwCCwALIABBADoAAAsLKgEBfyMAQRBrIgQkACAEIAM2AgwgACABIAIgAxCqBCEDIARBEGokACADC6YBAQR/IwBBEGsiAiABNwMIQQghA0HFu/KIeCEEIAJBCGohAgNAIARBk4OACGwiBSACLQAAcyEEIAJBAWohAiADQX9qIgMNAAsgAEEAOgAEIAAgBEH/////A3EiAkHoNG5BCnBBMHI6AAMgACACQaQFbkEKcEEwcjoAAiAAIAIgBUEednMiAkEabiIEQRpwQcEAajoAASAAIAIgBEEabGtBwQBqOgAAC0kBAn8jAEEQayICJAAgAiABNgIEIAIgATYCDCACIAE2AghBAEEAIAAgARCqBCIBECAiAyABIAAgAigCCBCqBBogAkEQaiQAIAMLcQEFfyABQQF0IgJBAXIQICEDAkAgAUUNAEEAIQQDQCADIARBAXRqIgUgACAEaiIGLQAAQQR2Qawjai0AADoAACAFQQFqIAYtAABBD3FBrCNqLQAAOgAAIARBAWoiBCABRw0ACwsgAyACakEAOgAAIAMLuQEBBn8jAEEQayIBJABBBRAgIQIgASAANwMIQQghA0HFu/KIeCEEIAFBCGohBQNAIARBk4OACGwiBiAFLQAAcyEEIAVBAWohBSADQX9qIgMNAAsgAkEAOgAEIAIgBEH/////A3EiBUHoNG5BCnBBMHI6AAMgAiAFQaQFbkEKcEEwcjoAAiACIAUgBkEednMiBUEabiIEQRpwQcEAajoAASACIAUgBEEabGtBwQBqOgAAIAFBEGokACACC8MBAQV/IwBBEGsiASQAQQAhAiABQQA2AgwgAUIANwIEIAEgADYCAAJAAkAgAA0AQQEhAgwBCyAAIQNBACEEA0AgAxDuBCACaiECIAEgBEEBaiIEQQJ0aigCACIDDQALIAJBAWohAgsgAhAgIQVBACECAkAgAEUN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IQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALtQQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAJC////////////AINCgICAgICAgPj/AFYNACAAvSIEQjSIp0H/D3EiBkH/D0cNAQsgACABoiIBIAGjDwsCQCAEQgGGIgUgA1YNACAARAAAAAAAAAAAoiAAIAUgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAEQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIARBASAGa62GIQMMAQsgBEL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIFQgBTDQADQCAHQX9qIQcgBUIBhiIFQn9VDQAL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QXdqQQVJcguuAQACQAJAIAFBgAhIDQAgAEQAAAAAAADgf6IhAAJAIAFB/w9PDQAgAUGBeGohAQwCCyAARAAAAAAAAOB/oiEAIAFB/RcgAUH9F0gbQYJwaiEBDAELIAFBgXhKDQAgAEQAAAAAAABgA6IhAAJAIAFBuHBNDQAgAUHJB2ohAQwBCyAARAAAAAAAAGADoiEAIAFB8GggAUHwaEobQZIPaiEBCyAAIAFB/wdqrUI0hr+iCzUAIAAgATcDACAAIARCMIinQYCAAnEgAkIwiKdB//8BcXKtQjCGIAJC////////P4OENwMIC+cCAQF/IwBB0ABrIgQkAAJAAkAgA0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEJAFIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQkAUgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORCQBSAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQkAUgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEJAFIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL2wYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCGBUUNACADIAQQ9gQhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQkAUgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxCIBSAFQQhqKQMAIQIgBSkDACEEDAELAkAgASAIrUIwhiACQv///////z+DhCIJIAMgBEIwiKdB//8BcSIGrUIwhiAEQv///////z+DhCIKEIYFQQBKDQACQCABIAkgAyAKEIYFRQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEJAFIAVB+ABqKQMAIQIgBSkDcCEEDAELAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEJAFIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABCQBSAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQkAUgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEJAFIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxCQBSAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAggBnKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuOCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAFBBGohBSACQQJ0IgJBjLoBaigCACEGIAJBgLoBaigCACEHA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDxBCECCyACEPIEDQALQQEhCAJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQgCQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQ8QQhAgtBACEJAkACQAJAA0AgAkEgciAJQYAIaiwAAEcNAQJAIAlB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ATYCDCABIAA2AgwgASACNgIIDwtBHyECAkAgAEH///8HSw0AIABBCHYiAiACQYD+P2pBEHZBCHEiAnQiBCAEQYDgH2pBEHZBBHEiBHQiBiAGQYCAD2pBEHZBAnEiBnRBD3YgAiAEciAGcmsiAkEBdCAAIAJBFWp2QQFxckEcaiECCyABQgA3AhAgAUEcaiACNgIAIAJBAnRBwNEBaiEEAkACQAJAAkBBACgClM8BIgZBASACdCIDcQ0AQQAgBiADcjYClM8BIAQgATYCACABQRhqIAQ2AgAMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgAUEYaiAENgIACyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQRhqQQA2AgAgASAENgIMIAEgADYCCAtBAEEAKAKwzwFBf2oiAUF/IAEbNgKwzwELCwcAPwBBEHQLVAECf0EAKALEvgEiASAAQQNqQXxxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQggVNDQAgABATRQ0BC0EAIAA2AsS+ASABDwsQxQRBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQogBCACIAcbIglC////////P4MhCyACIAQgBxsiDEIwiKdB//8BcSEIAkAgCUIwiKdB//8BcSIGDQAgBUHgAGogCiALIAogCyALUCIGG3kgBkEGdK18pyIGQXFqEIUFQRAgBmshBiAFQegAaikDACELIAUpA2AhCgsgASADIAcbIQMgDEL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahCFBUEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQIgC0IDhiAKQj2IhCEEIANCA4YhASAJIAyFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACECQgEhAQwBCyAFQcAAaiABIAJBgAEgB2sQhQUgBUEwaiABIAIgBxCPBSAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhASAFQTBqQQhqKQMAIQILIARCgICAgICAgASEIQwgCkIDhiELAkACQCADQn9VDQBCACEDQgAhBCALIAGFIAwgAoWEUA0CIAsgAX0hCiAMIAJ9IAsgAVStfSIEQv////////8DVg0BIAVBIGogCiAEIAogBCAEUCIHG3kgB0EGdK18p0F0aiIHEIUFIAYgB2shBiAFQShqKQMAIQQgBSkDICEKDAELIAIgDHwgASALfCIKIAFUrXwiBEKAgICAgICACINQDQAgCkIBiCAEQj+GhCAKQgGDhCEKIAZBAWohBiAEQgGIIQQLIAlCgICAgICAgICAf4MhAQJAIAZB//8BSA0AIAFCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogCiAEIAZB/wBqEIUFIAUgCiAEQQEgBmsQjwUgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhCiAFQQhqKQMAIQQLIApCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCABhCEEIAqnQQdxIQYCQAJAAkACQAJAEI0FDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgAUIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgAVAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEI4FGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC98QAgV/Dn4jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQhQVBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCFBSAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABCRBSAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABCRBSAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABCRBSAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABCRBSAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABCRBSAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABCRBSAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABCRBSAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABCRBSAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABCRBSAFQZABaiADQg+GQgAgBEIAEJEFIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQkQUgBUGAAWpCASACfUIAIARCABCRBSAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYgAUI/iIQiFEIgiCIEfiILIAFCAYYiFUIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECALVK0gECAPQv////8PgyILIBRC/////w+DIg9+fCIRIBBUrXwgDSAEfnwgCyAEfiIWIA8gDX58IhAgFlStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgD34iFiACIAp+fCIRIBZUrSARIAsgFUL+////D4MiFn58IhcgEVStfHwiESAQVK18IBEgEiAEfiIQIBYgDX58IgQgAiAPfnwiDSALIAp+fCILQiCIIAQgEFStIA0gBFStfCALIA1UrXxCIIaEfCIEIBFUrXwgBCAXIAIgFn4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAXVK0gAiALQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAFQdAAaiACIAQgAyAOEJEFIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEJEFIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFSATIRQLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCELIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEI8FIAVBMGogFSAUIAZB8ABqEIUFIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACILEJEFIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQkQUgBSADIA5CBUIAEJEFIAsgAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahCFBSACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCFBSACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqEIUFIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqEIUFIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqEIUFQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqEIUFIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESAKQg+GIANCMYiEIhRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0GAAUkNAEIAIQEMAwsgBUEwaiASIAEgBkH/AGoiBhCFBSAFQSBqIAIgBCAGEIUFIAVBEGogEiABIAcQjwUgBSACIAQgBxCPBSAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAELIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiBCABQiCIIgJ+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyACfnwiA0IgiHwgA0L/////D4MgBCABfnwiA0IgiHw3AwggACADQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCEBSAFKQMAIQEgACAFQQhqKQMANwMIIAAgATcDACAFQRBqJAAL6gMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACIVCAFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQhQUgAiAAIARBgfgAIANrEI8FIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAiFQgBSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCxUAQYDTwQIkAkGA0wFBD2pBcHEkAQsHACMAIwFrCwQAIwILBAAjAQsNACABIAIgAyAAERAACyQBAX4gACABIAKtIAOtQiCGhCAEEJwFIQUgBUIgiKcQFCAFpwsTACAAIAGnIAFCIIinIAIgAxAVCwvYtoGAAAMAQYAIC5iyAWluZmluaXR5AC1JbmZpbml0eQBodW1pZGl0eQBhY2lkaXR5AGRldnNfdmVyaWZ5AGxhcmdlIHBhcmFtZXRlcnMgYXJyYXkAaXNBcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAYmxvY2sgY29ycnVwdGlvbjogJXAgb2ZmPSV1IHY9JXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAbWV0aG9kOiVkOiV4AHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleABXU1NLLUg6IHVua25vd24gY21kICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwBkb3VibGUgdGhyb3cAcG93AGpkX3dzc2tfbmV3AGV4cHIxX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AHRocm93OiVkQCV1AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1AGJ1ZmZlciB3cml0ZSBhdCAldSwgbGVuPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290AGV4cGVjdGluZyBzdGFjaywgZ290AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AHJhbmRvbUludABwYXJzZUludAB0aGlzIG51bWZtdABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfc2hvcnRfbWFwX3NldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAYSBidWlsdGluIGZyb3plbiBvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAZGV2c19tYXBfa2V5c19vcl92YWx1ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZ2V0X3RyeWZyYW1lcwBwaXBlcyBpbiBzcGVjcwBhYnMAc2xlZXBNcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAZXhwZWN0aW5nICVzOyBnb3QgJXMAV1NuOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzACVzIGZpZWxkcyBvZiAlcwAlcyBmaWVsZCAnJXMnIG9mICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzACAgICAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAGJ1aWx0aW4gZnVuY3Rpb24gaXMgbm90IGEgY3RvcgB0YWcgZXJyb3IAVHlwZUVycm9yAFJhbmdlRXJyb3IAZmxvb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgBtdXRhYmxlIEJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgByb2xlX21lbWJlcgBpbnN0YW50aWF0ZWQgcm9sZSBtZW1iZXIAZnJlZV9maWJlcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAbWFwAHZhbGlkYXRlX2hlYXAAJXM6JXAAY2xvc3VyZTolZDolcABtZXRob2Q6JWQ6JXAAZGV2c19vYmplY3RfZ2V0X3Byb3RvAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX21hcF9jb3B5X2ludG8Ac21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgBidXR0b24AVW5oYW5kbGVkIGV4Y2VwdGlvbgBFeGNlcHRpb24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgBjdG9yIGZ1bmN0aW9uAGZpYmVyIHN0YXJ0ZWQgd2l0aCBhIGJ1aWx0aW4gZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBuZXcgdW5zdXBwb3J0ZWQgb24gdGhpcyBleHByZXNzaW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AbWFpbgBkZXZzX29iamVjdF9nZXRfYnVpbHRfaW4AZGV2c19vYmplY3RfZ2V0X3N0YXRpY19idWlsdF9pbgBhc3NpZ24AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAHRocm93aW5nIG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBtYXJrX2Jsb2NrAGFsbG9jX2Jsb2NrAHN0YWNrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGludmFsaWQgZmxhZyBhcmcAbmVlZCBmbGFnIGFyZwBsb2cAc2V0dGluZwBnZXR0aW5nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACVzIHRvbyBiaWcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgBzZXRQcm90b3R5cGVPZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBhIHByaW1pdGl2ZQBkZXZzX2xlYXZlAHRydWUAcHJvdG9fdmFsdWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGhlYXJ0UmF0ZQBjYXVzZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTbjogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAG5vIC5wcm90b3R5cGUAaW52YWxpZCAucHJvdG90eXBlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAbmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBidWZmZXIgc3RvcmUgb3V0IG9mIHJhbmdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAGJ1ZmZlciBudW1mbXQgaW52YWxpZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1NuOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb2JqZWN0IGV4cGVjdGVkAG9uRGlzY29ubmVjdGVkAFdTbjogY29ubmVjdGVkAGlzQ29ubmVjdGVkAG9uQ29ubmVjdGVkAGNyZWF0ZWQAdW5kZWZpbmVkACVzIGNhbGxlZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABvbmx5IG9uZSB2YWx1ZSBleHBlY3RlZDsgZ290ICVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZABkZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGMAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdHJ5LmMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBuZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAG5ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAZGV2aWNlc2NyaXB0L3RzYWdnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX25ld19fAF9fc3RhY2tfXwBfX2Z1bmNfXwBbVGhyb3c6ICV4XQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGxldiA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX0xFVkVMX01BWABwYyAmJiBwYyA8PSBERVZTX1NQRUNJQUxfVEhST1dfSk1QX1BDX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAGlkeCA+PSBERVZTX0ZJUlNUX0JVSUxUSU5fRlVOQ1RJT04AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAUEkARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAICBwYz0lZCBAID8/PwAgICVzID0+AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBzaXplID49IDIAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBhcmcwAGxvZzEwAExOMTAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAGZyYW1lLT5mdW5jLT5udW1fdHJ5X2ZyYW1lcyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gREVWU19QQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AICAuLi4AZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAJXMgbm90IHN1cHBvcnRlZCAoeWV0KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZGV2c19pc19tYXAob2JqKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBmaWR4IDwgZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRl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c29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyG2pkX2VtX2RldnNfZW5hYmxlX2djX3N0cmVzczMMaHdfZGV2aWNlX2lkNAx0YXJnZXRfcmVzZXQ1DnRpbV9nZXRfbWljcm9zNhJqZF90Y3Bzb2NrX3Byb2Nlc3M3EWFwcF9pbml0X3NlcnZpY2VzOBJkZXZzX2NsaWVudF9kZXBsb3k5FGNsaWVudF9ldmVudF9oYW5kbGVyOgthcHBfcHJvY2VzczsHdHhfaW5pdDwPamRfcGFja2V0X3JlYWR5PQp0eF9wcm9jZXNzPhdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT8OamRfd2Vic29ja19uZXdABm9ub3BlbkEHb25lcnJvckIHb25jbG9zZUMJb25tZXNzYWdlRBBqZF93ZWJzb2NrX2Nsb3NlRQ5hZ2didWZmZXJfaW5pdEYPYWdnYnVmZmVyX2ZsdXNoRxBhZ2didWZmZXJfdXBsb2FkSA5kZXZzX2J1ZmZlcl9vcEkQZGV2c19yZWFkX251bWJlckoSZGV2c19idWZmZXJfZGVjb2RlSxJkZXZzX2J1ZmZlcl9lbmNvZGVMD2RldnNfY3JlYXRlX2N0eE0Jc2V0dXBfY3R4TgpkZXZzX3RyYWNlTw9kZXZzX2Vycm9yX2NvZGVQGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJRCWNsZWFyX2N0eFINZGV2c19mcmVlX2N0eFMIZGV2c19vb21UCWRldnNfZnJlZVUXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NWB3RyeV9ydW5XDHN0b3BfcHJvZ3JhbVgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFkcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVoYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWx1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFwOZGVwbG95X2hhbmRsZXJdE2RlcGxveV9tZXRhX2hhbmRsZXJeFmRldmljZXNjcmlwdG1ncl9kZXBsb3lfFGRldmljZXNjcmlwdG1ncl9pbml0YBlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YRFkZXZzY2xvdWRfcHJvY2Vzc2IXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRjE2RldnNjbG91ZF9vbl9tZXRob2RkDmRldnNjbG91ZF9pbml0ZRBkZXZzX2ZpYmVyX3lpZWxkZhhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25nGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWgQZGV2c19maWJlcl9zbGVlcGkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsahpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc2sRZGV2c19pbWdfZnVuX25hbWVsEmRldnNfaW1nX3JvbGVfbmFtZW0SZGV2c19maWJlcl9ieV9maWR4bhFkZXZzX2ZpYmVyX2J5X3RhZ28QZGV2c19maWJlcl9zdGFydHAUZGV2c19maWJlcl90ZXJtaWFudGVxDmRldnNfZmliZXJfcnVuchNkZXZzX2ZpYmVyX3N5bmNfbm93cwpkZXZzX3BhbmljdBVfZGV2c19ydW50aW1lX2ZhaWx1cmV1D2RldnNfZmliZXJfcG9rZXYTamRfZ2NfYW55X3RyeV9hbGxvY3cHZGV2c19nY3gPZmluZF9mcmVlX2Jsb2NreRJkZXZzX2FueV90cnlfYWxsb2N6DmRldnNfdHJ5X2FsbG9jewtqZF9nY191bnBpbnwKamRfZ2NfZnJlZX0OZGV2c192YWx1ZV9waW5+EGRldnNfdmFsdWVfdW5waW5/EmRldnNfbWFwX3RyeV9hbGxvY4ABGGRldnNfc2hvcnRfbWFwX3RyeV9hbGxvY4EBFGRldnNfYXJyYXlfdHJ5X2FsbG9jggEVZGV2c19idWZmZXJfdHJ5X2FsbG9jgwEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jhAEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSFAQ9kZXZzX2djX3NldF9jdHiGAQ5kZXZzX2djX2NyZWF0ZYcBD2RldnNfZ2NfZGVzdHJveYgBC3NjYW5fZ2Nfb2JqiQERcHJvcF9BcnJheV9sZW5ndGiKARJtZXRoMl9BcnJheV9pbnNlcnSLARJmdW4xX0FycmF5X2lzQXJyYXmMARBtZXRoWF9BcnJheV9wdXNojQEVbWV0aDFfQXJyYXlfcHVzaFJhbmdljgERbWV0aFhfQXJyYXlfc2xpY2WPARFmdW4xX0J1ZmZlcl9hbGxvY5ABEnByb3BfQnVmZmVyX2xlbmd0aJEBFW1ldGgwX0J1ZmZlcl90b1N0cmluZ5IBE21ldGgzX0J1ZmZlcl9maWxsQXSTARNtZXRoNF9CdWZmZXJfYmxpdEF0lAEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc5UBF2Z1bjFfRGV2aWNlU2NyaXB0X3BhbmljlgEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290lwEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0mAEVZnVuMV9EZXZpY2VTY3JpcHRfbG9nmQEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdJoBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50mwEUbWV0aDFfRXJyb3JfX19jdG9yX1+cARltZXRoMV9SYW5nZUVycm9yX19fY3Rvcl9fnQEYbWV0aDFfVHlwZUVycm9yX19fY3Rvcl9fngEUbWV0aFhfRnVuY3Rpb25fc3RhcnSfARdwcm9wX0Z1bmN0aW9uX3Byb3RvdHlwZaABDmZ1bjFfTWF0aF9jZWlsoQEPZnVuMV9NYXRoX2Zsb29yogEPZnVuMV9NYXRoX3JvdW5kowENZnVuMV9NYXRoX2Fic6QBEGZ1bjBfTWF0aF9yYW5kb22lARNmdW4xX01hdGhfcmFuZG9tSW50pgENZnVuMV9NYXRoX2xvZ6cBDWZ1bjJfTWF0aF9wb3eoAQ5mdW4yX01hdGhfaWRpdqkBDmZ1bjJfTWF0aF9pbW9kqgEOZnVuMl9NYXRoX2ltdWyrAQ1mdW4yX01hdGhfbWlurAELZnVuMl9taW5tYXitAQ1mdW4yX01hdGhfbWF4rgESZnVuMl9PYmplY3RfYXNzaWdurwEQZnVuMV9PYmplY3Rfa2V5c7ABE2Z1bjFfa2V5c19vcl92YWx1ZXOxARJmdW4xX09iamVjdF92YWx1ZXOyARpmdW4yX09iamVjdF9zZXRQcm90b3R5cGVPZrMBEHByb3BfUGFja2V0X3JvbGW0ARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVytQETcHJvcF9QYWNrZXRfc2hvcnRJZLYBGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleLcBGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5kuAERcHJvcF9QYWNrZXRfZmxhZ3O5ARVwcm9wX1BhY2tldF9pc0NvbW1hbmS6ARRwcm9wX1BhY2tldF9pc1JlcG9ydLsBE3Byb3BfUGFja2V0X3BheWxvYWS8ARNwcm9wX1BhY2tldF9pc0V2ZW50vQEVcHJvcF9QYWNrZXRfZXZlbnRDb2RlvgEUcHJvcF9QYWNrZXRfaXNSZWdTZXS/ARRwcm9wX1BhY2tldF9pc1JlZ0dldMABE3Byb3BfUGFja2V0X3JlZ0NvZGXBARNtZXRoMF9QYWNrZXRfZGVjb2RlwgESZGV2c19wYWNrZXRfZGVjb2RlwwEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkxAEURHNSZWdpc3Rlcl9yZWFkX2NvbnTFARJkZXZzX3BhY2tldF9lbmNvZGXGARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlxwEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZcgBFnByb3BfRHNQYWNrZXRJbmZvX25hbWXJARZwcm9wX0RzUGFja2V0SW5mb19jb2RlygEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fywEXcHJvcF9Ec1JvbGVfaXNDb25uZWN0ZWTMARhtZXRoMl9Ec1JvbGVfc2VuZENvbW1hbmTNARFtZXRoMF9Ec1JvbGVfd2FpdM4BEnByb3BfU3RyaW5nX2xlbmd0aM8BF21ldGgxX1N0cmluZ19jaGFyQ29kZUF00AETbWV0aDFfU3RyaW5nX2NoYXJBdNEBFGRldnNfamRfZ2V0X3JlZ2lzdGVy0gEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZNMBEGRldnNfamRfc2VuZF9jbWTUARFkZXZzX2pkX3dha2Vfcm9sZdUBFGRldnNfamRfcmVzZXRfcGFja2V01gETZGV2c19qZF9wa3RfY2FwdHVyZdcBE2RldnNfamRfc2VuZF9sb2dtc2fYAQ1oYW5kbGVfbG9nbXNn2QESZGV2c19qZF9zaG91bGRfcnVu2gEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXbARNkZXZzX2pkX3Byb2Nlc3NfcGt03AEUZGV2c19qZF9yb2xlX2NoYW5nZWTdARJkZXZzX2pkX2luaXRfcm9sZXPeARJkZXZzX2pkX2ZyZWVfcm9sZXPfARBkZXZzX3NldF9sb2dnaW5n4AEVZGV2c19zZXRfZ2xvYmFsX2ZsYWdz4QEXZGV2c19yZXNldF9nbG9iYWxfZmxhZ3PiARVkZXZzX2dldF9nbG9iYWxfZmxhZ3PjARJkZXZzX21hcF9jb3B5X2ludG/kARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7lAQxkZXZzX21hcF9zZXTmARRkZXZzX2lzX3NlcnZpY2Vfc3BlY+cBBmxvb2t1cOgBF2RldnNfbWFwX2tleXNfb3JfdmFsdWVz6QERZGV2c19hcnJheV9pbnNlcnTqARJkZXZzX3Nob3J0X21hcF9zZXTrAQ9kZXZzX21hcF9kZWxldGXsARJkZXZzX3Nob3J0X21hcF9nZXTtARdkZXZzX2RlY29kZV9yb2xlX3BhY2tldO4BDmRldnNfcm9sZV9zcGVj7wEQZGV2c19zcGVjX2xvb2t1cPABEWRldnNfcHJvdG9fbG9va3Vw8QESZGV2c19mdW5jdGlvbl9iaW5k8gERZGV2c19tYWtlX2Nsb3N1cmXzAQ5kZXZzX2dldF9mbmlkePQBE2RldnNfZ2V0X2ZuaWR4X2NvcmX1ARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWT2ARdkZXZzX29iamVjdF9nZXRfbm9fYmluZPcBE2RldnNfZ2V0X3JvbGVfcHJvdG/4ARtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnf5ARVkZXZzX2dldF9zdGF0aWNfcHJvdG/6AR1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bfsBFWRldnNfb2JqZWN0X2dldF9wcm90b/wBGGRldnNfZ2V0X3Byb3RvdHlwZV9maWVsZP0BHmRldnNfb2JqZWN0X2dldF9idWlsdF9pbl9maWVsZP4BEGRldnNfaW5zdGFuY2Vfb2b/AQ9kZXZzX29iamVjdF9nZXSAAgxkZXZzX3NlcV9nZXSBAgxkZXZzX2FueV9nZXSCAgxkZXZzX2FueV9zZXSDAgxkZXZzX3NlcV9zZXSEAg5kZXZzX2FycmF5X3NldIUCDGRldnNfYXJnX2ludIYCD2RldnNfYXJnX2RvdWJsZYcCD2RldnNfcmV0X2RvdWJsZYgCDGRldnNfcmV0X2ludIkCDWRldnNfcmV0X2Jvb2yKAg9kZXZzX3JldF9nY19wdHKLAhFkZXZzX2FyZ19zZWxmX21hcIwCEWRldnNfc2V0dXBfcmVzdW1ljQIPZGV2c19jYW5fYXR0YWNojgIZZGV2c19idWlsdGluX29iamVjdF92YWx1ZY8CEmRldnNfcmVnY2FjaGVfZnJlZZACFmRldnNfcmVnY2FjaGVfZnJlZV9hbGyRAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZJICE2RldnNfcmVnY2FjaGVfYWxsb2OTAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cJQCEWRldnNfcmVnY2FjaGVfYWdllQIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWWAhJkZXZzX3JlZ2NhY2hlX25leHSXAg9qZF9zZXR0aW5nc19nZXSYAg9qZF9zZXR0aW5nc19zZXSZAg5kZXZzX2xvZ192YWx1ZZoCD2RldnNfc2hvd192YWx1ZZsCEGRldnNfc2hvd192YWx1ZTCcAg1jb25zdW1lX2NodW5rnQINc2hhXzI1Nl9jbG9zZZ4CD2pkX3NoYTI1Nl9zZXR1cJ8CEGpkX3NoYTI1Nl91cGRhdGWgAhBqZF9zaGEyNTZfZmluaXNooQIUamRfc2hhMjU2X2htYWNfc2V0dXCiAhVqZF9zaGEyNTZfaG1hY19maW5pc2ijAg5qZF9zaGEyNTZfaGtkZqQCDmRldnNfc3RyZm9ybWF0pQIOZGV2c19pc19zdHJpbmemAg5kZXZzX2lzX251bWJlcqcCFGRldnNfc3RyaW5nX2dldF91dGY4qAITZGV2c19idWlsdGluX3N0cmluZ6kCFGRldnNfc3RyaW5nX3ZzcHJpbnRmqgITZGV2c19zdHJpbmdfc3ByaW50ZqsCFWRldnNfc3RyaW5nX2Zyb21fdXRmOKwCFGRldnNfdmFsdWVfdG9fc3RyaW5nrQIQYnVmZmVyX3RvX3N0cmluZ64CGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGSvAhJkZXZzX3N0cmluZ19jb25jYXSwAhJkZXZzX3B1c2hfdHJ5ZnJhbWWxAhFkZXZzX3BvcF90cnlmcmFtZbICD2RldnNfZHVtcF9zdGFja7MCE2RldnNfZHVtcF9leGNlcHRpb260AgpkZXZzX3Rocm93tQIVZGV2c190aHJvd190eXBlX2Vycm9ytgIZZGV2c190aHJvd19pbnRlcm5hbF9lcnJvcrcCFmRldnNfdGhyb3dfcmFuZ2VfZXJyb3K4Ah5kZXZzX3Rocm93X25vdF9zdXBwb3J0ZWRfZXJyb3K5AhpkZXZzX3Rocm93X2V4cGVjdGluZ19lcnJvcroCHmRldnNfdGhyb3dfZXhwZWN0aW5nX2Vycm9yX2V4dLsCGGRldnNfdGhyb3dfdG9vX2JpZ19lcnJvcrwCHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2O9Ag90c2FnZ19jbGllbnRfZXa+AgphZGRfc2VyaWVzvwINdHNhZ2dfcHJvY2Vzc8ACCmxvZ19zZXJpZXPBAhN0c2FnZ19oYW5kbGVfcGFja2V0wgIUbG9va3VwX29yX2FkZF9zZXJpZXPDAgp0c2FnZ19pbml0xAIMdHNhZ2dfdXBkYXRlxQIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZcYCE2RldnNfdmFsdWVfZnJvbV9pbnTHAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbMgCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyyQIUZGV2c192YWx1ZV90b19kb3VibGXKAhFkZXZzX3ZhbHVlX3RvX2ludMsCEmRldnNfdmFsdWVfdG9fYm9vbMwCDmRldnNfaXNfYnVmZmVyzQIXZGV2c19idWZmZXJfaXNfd3JpdGFibGXOAhBkZXZzX2J1ZmZlcl9kYXRhzwITZGV2c19idWZmZXJpc2hfZGF0YdACFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq0QINZGV2c19pc19hcnJhedICEWRldnNfdmFsdWVfdHlwZW9m0wIPZGV2c19pc19udWxsaXNo1AISZGV2c192YWx1ZV9pZWVlX2Vx1QIeZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3Bj1gISZGV2c19pbWdfc3RyaWR4X29r1wISZGV2c19kdW1wX3ZlcnNpb25z2AILZGV2c192ZXJpZnnZAhFkZXZzX2ZldGNoX29wY29kZdoCFGRldnNfdm1fZXhlY19vcGNvZGVz2wIaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHjcAhFkZXZzX2ltZ19nZXRfdXRmON0CFGRldnNfZ2V0X3N0YXRpY191dGY43gIPZGV2c192bV9yb2xlX29r3wIMZXhwcl9pbnZhbGlk4AIUZXhwcnhfYnVpbHRpbl9vYmplY3ThAgtzdG10MV9jYWxsMOICC3N0bXQyX2NhbGwx4wILc3RtdDNfY2FsbDLkAgtzdG10NF9jYWxsM+UCC3N0bXQ1X2NhbGw05gILc3RtdDZfY2FsbDXnAgtzdG10N19jYWxsNugCC3N0bXQ4X2NhbGw36QILc3RtdDlfY2FsbDjqAhJzdG10Ml9pbmRleF9kZWxldGXrAgxzdG10MV9yZXR1cm7sAglzdG10eF9qbXDtAgxzdG10eDFfam1wX3ruAgtzdG10MV9wYW5pY+8CEmV4cHJ4X29iamVjdF9maWVsZPACEnN0bXR4MV9zdG9yZV9sb2NhbPECE3N0bXR4MV9zdG9yZV9nbG9iYWzyAhJzdG10NF9zdG9yZV9idWZmZXLzAglleHByMF9pbmb0AhBleHByeF9sb2FkX2xvY2Fs9QIRZXhwcnhfbG9hZF9nbG9iYWz2AgtleHByMV91cGx1c/cCC2V4cHIyX2luZGV4+AIPc3RtdDNfaW5kZXhfc2V0+QIUZXhwcngxX2J1aWx0aW5fZmllbGT6AhJleHByeDFfYXNjaWlfZmllbGT7AhFleHByeDFfdXRmOF9maWVsZPwCEGV4cHJ4X21hdGhfZmllbGT9Ag5leHByeF9kc19maWVsZP4CD3N0bXQwX2FsbG9jX21hcP8CEXN0bXQxX2FsbG9jX2FycmF5gAMSc3RtdDFfYWxsb2NfYnVmZmVygQMRZXhwcnhfc3RhdGljX3JvbGWCAxNleHByeF9zdGF0aWNfYnVmZmVygwMbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nhAMZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ4UDGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ4YDFWV4cHJ4X3N0YXRpY19mdW5jdGlvbocDDWV4cHJ4X2xpdGVyYWyIAxFleHByeF9saXRlcmFsX2Y2NIkDEGV4cHJ4X3JvbGVfcHJvdG+KAxFleHByM19sb2FkX2J1ZmZlcosDDWV4cHIwX3JldF92YWyMAwxleHByMV90eXBlb2aNAwpleHByMF9udWxsjgMNZXhwcjFfaXNfbnVsbI8DCmV4cHIwX3RydWWQAwtleHByMF9mYWxzZZEDDWV4cHIxX3RvX2Jvb2ySAwlleHByMF9uYW6TAwlleHByMV9hYnOUAw1leHByMV9iaXRfbm90lQMMZXhwcjFfaXNfbmFulgMJZXhwcjFfbmVnlwMJZXhwcjFfbm90mAMMZXhwcjFfdG9faW50mQMJZXhwcjJfYWRkmgMJZXhwcjJfc3VimwMJZXhwcjJfbXVsnAMJZXhwcjJfZGl2nQMNZXhwcjJfYml0X2FuZJ4DDGV4cHIyX2JpdF9vcp8DDWV4cHIyX2JpdF94b3KgAxBleHByMl9zaGlmdF9sZWZ0oQMRZXhwcjJfc2hpZnRfcmlnaHSiAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZKMDCGV4cHIyX2VxpAMIZXhwcjJfbGWlAwhleHByMl9sdKYDCGV4cHIyX25lpwMVc3RtdDFfdGVybWluYXRlX2ZpYmVyqAMUc3RtdHgyX3N0b3JlX2Nsb3N1cmWpAxNleHByeDFfbG9hZF9jbG9zdXJlqgMSZXhwcnhfbWFrZV9jbG9zdXJlqwMQZXhwcjFfdHlwZW9mX3N0cqwDDGV4cHIwX25vd19tc60DFmV4cHIxX2dldF9maWJlcl9oYW5kbGWuAxBzdG10Ml9jYWxsX2FycmF5rwMJc3RtdHhfdHJ5sAMNc3RtdHhfZW5kX3RyebEDC3N0bXQwX2NhdGNosgMNc3RtdDBfZmluYWxsebMDC3N0bXQxX3Rocm93tAMOc3RtdDFfcmVfdGhyb3e1AxBzdG10eDFfdGhyb3dfam1wtgMOc3RtdDBfZGVidWdnZXK3AwlleHByMV9uZXe4AxFleHByMl9pbnN0YW5jZV9vZrkDCmV4cHIyX2JpbmS6Aw9kZXZzX3ZtX3BvcF9hcme7AxNkZXZzX3ZtX3BvcF9hcmdfdTMyvAMTZGV2c192bV9wb3BfYXJnX2kzMr0DFmRldnNfdm1fcG9wX2FyZ19idWZmZXK+AxJqZF9hZXNfY2NtX2VuY3J5cHS/AxJqZF9hZXNfY2NtX2RlY3J5cHTAAwxBRVNfaW5pdF9jdHjBAw9BRVNfRUNCX2VuY3J5cHTCAxBqZF9hZXNfc2V0dXBfa2V5wwMOamRfYWVzX2VuY3J5cHTEAxBqZF9hZXNfY2xlYXJfa2V5xQMLamRfd3Nza19uZXfGAxRqZF93c3NrX3NlbmRfbWVzc2FnZccDE2pkX3dlYnNvY2tfb25fZXZlbnTIAwdkZWNyeXB0yQMNamRfd3Nza19jbG9zZcoDEGpkX3dzc2tfb25fZXZlbnTLAwpzZW5kX2VtcHR5zAMSd3Nza2hlYWx0aF9wcm9jZXNzzQMXamRfdGNwc29ja19pc19hdmFpbGFibGXOAxR3c3NraGVhbHRoX3JlY29ubmVjdM8DGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldNADD3NldF9jb25uX3N0cmluZ9EDEWNsZWFyX2Nvbm5fc3RyaW5n0gMPd3Nza2hlYWx0aF9pbml00wMTd3Nza19wdWJsaXNoX3ZhbHVlc9QDEHdzc2tfcHVibGlzaF9iaW7VAxF3c3NrX2lzX2Nvbm5lY3RlZNYDE3dzc2tfcmVzcG9uZF9tZXRob2TXAxxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXpl2AMWcm9sZW1ncl9zZXJpYWxpemVfcm9sZdkDD3JvbGVtZ3JfcHJvY2Vzc9oDEHJvbGVtZ3JfYXV0b2JpbmTbAxVyb2xlbWdyX2hhbmRsZV9wYWNrZXTcAxRqZF9yb2xlX21hbmFnZXJfaW5pdN0DGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZN4DDWpkX3JvbGVfYWxsb2PfAxBqZF9yb2xlX2ZyZWVfYWxs4AMWamRfcm9sZV9mb3JjZV9hdXRvYmluZOEDEmpkX3JvbGVfYnlfc2VydmljZeIDE2pkX2NsaWVudF9sb2dfZXZlbnTjAxNqZF9jbGllbnRfc3Vic2NyaWJl5AMUamRfY2xpZW50X2VtaXRfZXZlbnTlAxRyb2xlbWdyX3JvbGVfY2hhbmdlZOYDEGpkX2RldmljZV9sb29rdXDnAxhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XoAxNqZF9zZXJ2aWNlX3NlbmRfY21k6QMRamRfY2xpZW50X3Byb2Nlc3PqAw5qZF9kZXZpY2VfZnJlZesDF2pkX2NsaWVudF9oYW5kbGVfcGFja2V07AMPamRfZGV2aWNlX2FsbG9j7QMPamRfY3RybF9wcm9jZXNz7gMVamRfY3RybF9oYW5kbGVfcGFja2V07wMMamRfY3RybF9pbml08AMNamRfaXBpcGVfb3BlbvEDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTyAw5qZF9pcGlwZV9jbG9zZfMDEmpkX251bWZtdF9pc192YWxpZPQDFWpkX251bWZtdF93cml0ZV9mbG9hdPUDE2pkX251bWZtdF93cml0ZV9pMzL2AxJqZF9udW1mbXRfcmVhZF9pMzL3AxRqZF9udW1mbXRfcmVhZF9mbG9hdPgDEWpkX29waXBlX29wZW5fY21k+QMUamRfb3BpcGVfb3Blbl9yZXBvcnT6AxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0+wMRamRfb3BpcGVfd3JpdGVfZXj8AxBqZF9vcGlwZV9wcm9jZXNz/QMUamRfb3BpcGVfY2hlY2tfc3BhY2X+Aw5qZF9vcGlwZV93cml0Zf8DDmpkX29waXBlX2Nsb3NlgAQNamRfcXVldWVfcHVzaIEEDmpkX3F1ZXVlX2Zyb250ggQOamRfcXVldWVfc2hpZnSDBA5qZF9xdWV1ZV9hbGxvY4QEDWpkX3Jlc3BvbmRfdTiFBA5qZF9yZXNwb25kX3UxNoYEDmpkX3Jlc3BvbmRfdTMyhwQRamRfcmVzcG9uZF9zdHJpbmeIBBdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZIkEC2pkX3NlbmRfcGt0igQdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyLBBdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcowEGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSNBBRqZF9hcHBfaGFuZGxlX3BhY2tldI4EFWpkX2FwcF9oYW5kbGVfY29tbWFuZI8EE2pkX2FsbG9jYXRlX3NlcnZpY2WQBBBqZF9zZXJ2aWNlc19pbml0kQQOamRfcmVmcmVzaF9ub3eSBBlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkkwQUamRfc2VydmljZXNfYW5ub3VuY2WUBBdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZZUEEGpkX3NlcnZpY2VzX3RpY2uWBBVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeXBBpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZZgEEmFwcF9nZXRfZndfdmVyc2lvbpkEFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWaBA1qZF9oYXNoX2ZudjFhmwQMamRfZGV2aWNlX2lknAQJamRfcmFuZG9tnQQIamRfY3JjMTaeBA5qZF9jb21wdXRlX2NyY58EDmpkX3NoaWZ0X2ZyYW1loAQMamRfd29yZF9tb3ZloQQOamRfcmVzZXRfZnJhbWWiBBBqZF9wdXNoX2luX2ZyYW1lowQNamRfcGFuaWNfY29yZaQEE2pkX3Nob3VsZF9zYW1wbGVfbXOlBBBqZF9zaG91bGRfc2FtcGxlpgQJamRfdG9faGV4pwQLamRfZnJvbV9oZXioBA5qZF9hc3NlcnRfZmFpbKkEB2pkX2F0b2mqBAtqZF92c3ByaW50ZqsED2pkX3ByaW50X2RvdWJsZawECmpkX3NwcmludGatBBJqZF9kZXZpY2Vfc2hvcnRfaWSuBAxqZF9zcHJpbnRmX2GvBAtqZF90b19oZXhfYbAEFGpkX2RldmljZV9zaG9ydF9pZF9hsQQJamRfc3RyZHVwsgQOamRfanNvbl9lc2NhcGWzBBNqZF9qc29uX2VzY2FwZV9jb3JltAQJamRfbWVtZHVwtQQWamRfcHJvY2Vzc19ldmVudF9xdWV1ZbYEFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWW3BBFqZF9zZW5kX2V2ZW50X2V4dLgECmpkX3J4X2luaXS5BBRqZF9yeF9mcmFtZV9yZWNlaXZlZLoEHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNruwQPamRfcnhfZ2V0X2ZyYW1lvAQTamRfcnhfcmVsZWFzZV9mcmFtZb0EEWpkX3NlbmRfZnJhbWVfcmF3vgQNamRfc2VuZF9mcmFtZb8ECmpkX3R4X2luaXTABAdqZF9zZW5kwQQWamRfc2VuZF9mcmFtZV93aXRoX2NyY8IED2pkX3R4X2dldF9mcmFtZcMEEGpkX3R4X2ZyYW1lX3NlbnTEBAtqZF90eF9mbHVzaMUEEF9fZXJybm9fbG9jYXRpb27GBAxfX2ZwY2xhc3NpZnnHBAVkdW1tecgECF9fbWVtY3B5yQQHbWVtbW92ZcoEBm1lbXNldMsECl9fbG9ja2ZpbGXMBAxfX3VubG9ja2ZpbGXNBARmbW9kzgQMX19zdGRpb19zZWVrzwQNX19zdGRpb193cml0ZdAEDV9fc3RkaW9fY2xvc2XRBAxfX3N0ZGlvX2V4aXTSBApjbG9zZV9maWxl0wQIX190b3JlYWTUBAlfX3Rvd3JpdGXVBAlfX2Z3cml0ZXjWBAZmd3JpdGXXBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxz2AQUX19wdGhyZWFkX211dGV4X2xvY2vZBBZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr2gQGX19sb2Nr2wQOX19tYXRoX2Rpdnplcm/cBA5fX21hdGhfaW52YWxpZN0EA2xvZ94EBWxvZzEw3wQHX19sc2Vla+AEBm1lbWNtcOEECl9fb2ZsX2xvY2viBAxfX21hdGhfeGZsb3fjBApmcF9iYXJyaWVy5AQMX19tYXRoX29mbG935QQMX19tYXRoX3VmbG935gQEZmFic+cEA3Bvd+gECGNoZWNraW506QQLc3BlY2lhbGNhc2XqBAVyb3VuZOsEBnN0cmNocuwEC19fc3RyY2hybnVs7QQGc3RyY21w7gQGc3RybGVu7wQHX191Zmxvd/AEB19fc2hsaW3xBAhfX3NoZ2V0Y/IEB2lzc3BhY2XzBAZzY2FsYm70BAljb3B5c2lnbmz1BAdzY2FsYm5s9gQNX19mcGNsYXNzaWZ5bPcEBWZtb2Rs+AQFZmFic2z5BAtfX2Zsb2F0c2NhbvoECGhleGZsb2F0+wQIZGVjZmxvYXT8BAdzY2FuZXhw/QQGc3RydG94/gQGc3RydG9k/wQSX193YXNpX3N5c2NhbGxfcmV0gAUIZGxtYWxsb2OBBQZkbGZyZWWCBRhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemWDBQRzYnJrhAUIX19hZGR0ZjOFBQlfX2FzaGx0aTOGBQdfX2xldGYyhwUHX19nZXRmMogFCF9fZGl2dGYziQUNX19leHRlbmRkZnRmMooFDV9fZXh0ZW5kc2Z0ZjKLBQtfX2Zsb2F0c2l0ZowFDV9fZmxvYXR1bnNpdGaNBQ1fX2ZlX2dldHJvdW5kjgUSX19mZV9yYWlzZV9pbmV4YWN0jwUJX19sc2hydGkzkAUIX19tdWx0ZjORBQhfX211bHRpM5IFCV9fcG93aWRmMpMFCF9fc3VidGYzlAUMX190cnVuY3RmZGYylQUJc3RhY2tTYXZllgUMc3RhY2tSZXN0b3JllwUKc3RhY2tBbGxvY5gFFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdJkFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWaBRllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlmwUYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5knAUMZHluQ2FsbF9qaWppnQUWbGVnYWxzdHViJGR5bkNhbGxfamlqaZ4FGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAZwFBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
var _jd_em_devs_enable_gc_stress = Module["_jd_em_devs_enable_gc_stress"] = createExportWrapper("jd_em_devs_enable_gc_stress");

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
