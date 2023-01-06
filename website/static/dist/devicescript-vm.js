
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
     * Initalises the virtual machine data structure.
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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QCAAQQEQ8wEiA0UNACACIANvIQELIAAgARD2AQsWACAAIABBABDzASAAQQEQ8wFsEPYBCwkAIABBARCmAQvwAgIEfwJ8IwBBMGsiAiQAIAIgAEHIAGopAwA3AyggAiAAQdAAaikDADcDIAJAIAIoAixBf0cNACACKAIkQX9HDQAgAiACKQMoNwMYIAAgAkEYahCoAiEDIAIgAikDIDcDECAAIAJBEGoQqAIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKYASAFKQMANwMgCyACIAIpAyg3AwggACACQQhqEKcCIQYgAiACKQMgNwMAIAAgAhCnAiEHAkACQCAGvUL///////////8Ag0KAgICAgICA+P8AVg0AIAe9Qv///////////wCDQoGAgICAgID4/wBUDQELIAAoApgBQQApA8hPNwMgCwJAAkACQCABRQ0AIAJBKGohASAGIAdjRQ0BDAILIAJBKGohASAGIAdkDQELIAJBIGohAQsgACgCmAEgASkDADcDICACQTBqJAALCQAgAEEAEKYBC6gBAgN/AX4jAEEgayIBJAAgASAAQcgAaikDADcDGCABIABB0ABqKQMAIgQ3AxACQCAEUA0AIAEgASkDGDcDCCAAIAFBCGoQ6AEhAiABIAEpAxA3AwAgACABEOsBIgNFDQAgAkUNAAJAIAMoAgBBgICA+ABxQYCAgMgARw0AIAAgAiADKAIEENgBCyAAIAIgAxDYAQsgACgCmAEgASkDGDcDICABQSBqJAALCQAgAEEBEKoBC70BAgN/AX4jAEEwayICJAAgAiAAQcgAaikDACIFNwMYIAIgBTcDKAJAIAAgAkEYahDrASIDRQ0AIABBABB/IgRFDQAgAkEgaiAAQQggBBCmAiACIAIpAyA3AxAgACACQRBqEHwCQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAMoAgQgBCABENwBCyAAIAMgBCABENwBIAIgAikDIDcDCCAAIAJBCGoQfSAAKAKYASACKQMgNwMgCyACQTBqJAALCQAgAEEAEKoBC6sBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFB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c0EAIQILAkAgASgCDEH//wFHDQAgAUEYaiAAQa4BEHNBACECCwJAIAJFDQAgACACEL4BIAAgASgCDCACLwECQf8fcUGAwAByEMoBCyABQSBqJAALhwECAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDgASICDQAgA0EYaiABQa0BEHNBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAgwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBIGokAAtwAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwAgAyAENwMQAkAgASADIANBDGoQ4AEiAg0AIANBGGogAUGtARBzQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EgaiQAC20CAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDgASICDQAgA0EYaiABQa0BEHNBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQJB/x9xEKQCCyADQSBqJAALiQECAn8BfiMAQSBrIgEkACABIAApA0AiAzcDACABIAM3AxACQCAAIAEgAUEMahDgASICDQAgAUEYaiAAQa0BEHNBACECCwJAIAEoAgxB//8BRw0AIAFBGGogAEGuARBzQQAhAgsCQCACRQ0AIAAgAhC+ASAAIAEoAgwgAi8BAhDKAQsgAUEgaiQAC2kBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgA0EIaiABQaMBEHMgAEIANwMADAELIAAgASgCoAEgAigCAEEMbGooAgAoAhBBAEcQpQILIANBEGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQkgJFDQAgACADKAIMEKQCDAELIABCADcDAAsgA0EQaiQAC3ICA38BfiMAQSBrIgEkACABIAApA0AiBDcDCCABIAQ3AxACQCAAIAFBCGogAUEcahCSAiICRQ0AAkAgAEEAEPMBIgMgASgCHEkNACAAKAKYAUEAKQPITzcDIAwBCyAAIAIgA2otAAAQ9gELIAFBIGokAAtQAQJ/IwBBIGsiASQAIAEgACkDQDcDECAA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4ABqJAAL9wEBAX8jAEHAAGsiBCQAAkACQCACQYHgA0kNACAEQThqIABBlgEQcwwBCyAEIAEpAwA3AygCQCAAIARBKGoQqwJFDQAgBCABKQMANwMQIAAgBEEQaiAEQTRqEKwCIQECQCAEKAI0IAJNDQAgBCADKQMANwMIIAEgAmogACAEQQhqEKgCOgAADAILIARBOGogAEGXARBzDAELIAQgASkDADcDIAJAIAAgBEEgahCuAiIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgBCADKQMANwMYIAAgASACIARBGGoQ8gEMAQsgBEE4aiAAQZgBEHMLIARBwABqJAALzAEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQZkBEHMMAQsCQAJAIAJBAWoiBSABLwEKTQ0AIAAgBUEKbEEIbSIGQQQgBkEEShsiB0EDdBB5IgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQmQQaCyABIAc7AQogASAGNgIMIAAoAsgBIAYQegsgASgCDCACQQN0aiADKQMANwMAIAEvAQggAksNASABIAU7AQgMAQsgBEEIaiAAQZoBEHMLIARBEGokAAs+AgF/AX4jAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQqAIhACACQRBqJAAgAAtAAwF/AX4BfCMAQRBrIgIkACACIAFBA3QgAGpByABqKQMAIgM3AwAgAiADNwMIIAAgAhCnAiEEIAJBEGokACAECywBAX8jAEEQayICJAAgAkEIaiABEKMCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKQCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKUCIAAoApgBIAIpAwg3AyAgAkEQaiQACzABAX8jAEEQayICJAAgAkEIaiAAQQggARCmAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/AkAgACgCLCIDKAKYAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECEL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AQsgAyAENgIQIANBBDYCFAsgAkEBEN8BIQQgAyADKQMQNwMAIAAgAiAEIAMQ7AEgA0EgaiQAC1QBAn8jAEEQayICJAAgAkEIaiABEIwDAkACQCABKAI4IgMgACgCEC8BCEkNACACIAFB9gAQcwwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARCMAwJAAkAgASgCOCIDIAEoApABLwEMSQ0AIAIgAUH4ABBzDAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC1YBA38jAEEgayICJAAgAkEYaiABEIwDIAEQjQMhAyABEI0DIQQgAkEQaiABQQEQjwMgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEcgAkEgaiQACw0AIABBACkD0E83AwALNgEBfwJAIAIoAjgiAyABKAIQLwEITw0AIAAgASADQQN0akEYaikDADcDAA8LIAAgAkHpABBzCzcBAX8CQCACKAI4IgMgAigCkAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQeoAEHMLcQEBfyMAQSBrIgMkACADQRhqIAIQjAMgAyADKQMYNwMQAkACQAJAIANBEGoQkQINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEKcCEKMCCyADQSBqJAALSgEBfyMAQSBrIgMkACADQRhqIAIQjAMgA0EQaiACEIwDIAMgAykDEDcDCCADIAMpAxg3AwAgACACIANBCGogAxDvASADQSBqJAALYQEBfyMAQTBrIgIkACACQShqIAEQjAMgAkEgaiABEIwDIAJBGGogARCMAyACIAIpAxg3AxAgAiACKQMgNwMIIAIgAikDKDcDACABIAJBEGogAkEIaiACEPABIAJBMGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEIwDIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAAXIhBAJAAkAgBEF/IANBHGogBBCzAhsiBEF/Sg0AIANBOGogAkHwABBzIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ7QELIANBwABqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhCMAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAJyIQQCQAJAIARBfyADQRxqIAQQswIbIgRBf0oNACADQThqIAJB8AAQcyADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEO0BCyADQcAAaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQjAMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIADciEEAkACQCAEQX8gA0EcaiAEELMCGyIEQX9KDQAgA0E4aiACQfAAEHMgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDtAQsgA0HAAGokAAuMAQECfyMAQSBrIgMkACACKAI4IQQgAyACKAKQATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBCzAhsiBEF/Sg0AIANBGGogAkHwABBzIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQQAQ3wEhBCADIAMpAxA3AwAgACACIAQgAxDsASADQSBqJAALjAEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQswIbIgRBf0oNACADQRhqIAJB8AAQcyADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsgAkEVEN8BIQQgAyADKQMQNwMAIAAgAiAEIAMQ7AEgA0EgaiQAC0UBA38jAEEQayICJAACQCABEH4iAw0AIAFBEBBSCyABKAKYASEEIAJBCGogAUEIIAMQpgIgBCACKQMINwMgIAJBEGokAAtSAQN/IwBBEGsiAiQAAkAgASABEI0DIgMQfyIEDQAgASADQQN0QRBqEFILIAEoApgBIQMgAkEIaiABQQggBBCmAiADIAIpAwg3AyAgAkEQaiQAC1ABA38jAEEQayICJAACQCABIAEQjQMiAxCAASIEDQAgASADQQxqEFILIAEoApgBIQMgAkEIaiABQQggBBCmAiADIAIpAwg3AyAgAkEQaiQAC1YBAn8jAEEQayIDJAACQAJAIAIoAJABQTxqKAIAQQN2IAIoAjgiBEsNACADQQhqIAJB7wAQcyAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2UBAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQCQAJAIARBfyADQQRqIAQQswIbIgRBf0oNACADQQhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC24BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgAFyIQQCQAJAIARBfyADQQRqIAQQswIbIgRBf0oNACADQQhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC24BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgAJyIQQCQAJAIARBfyADQQRqIAQQswIbIgRBf0oNACADQQhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC24BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgANyIQQCQAJAIARBfyADQQRqIAQQswIbIgRBf0oNACADQQhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC1YBAn8jAEEQayIDJAACQAJAIAIoAjgiBCACKACQAUEkaigCAEEEdkkNACADQQhqIAJB8gAQcyAAQgA3AwAMAQsgACAENgIAIABBAzYCBAsgA0EQaiQACwwAIAAgAigCOBCkAgtGAQF/AkAgAigCOCIDIAIoAJABQTRqKAIAQQN2Tw0AIAAgAigAkAEiAiACKAIwaiADQQN0aikAADcDAA8LIAAgAkHrABBzCw0AIABBACkDwE83AwALRgEDfyMAQRBrIgMkACACEI0DIQQgAhCNAyEFIANBCGogAkECEI8DIAMgAykDCDcDACAAIAIgBSAEIANBABBHIANBEGokAAsQACAAIAIoApgBKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEIwDIAMgAykDCDcDACAAIAIgAxCwAhCkAiADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACEIwDIABBsM8AQbjPACADKQMIUBspAwA3AwAgA0EQaiQACw0AIABBACkDsE83AwALDQAgAEEAKQO4TzcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhCMAyADIAMpAwg3AwAgACACIAMQqQIQpQIgA0EQaiQACw0AIABBACkDyE83AwALqQECAX8BfCMAQRBrIgMkACADQQhqIAIQjAMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCACIAMQpwIiBEQAAAAAAAAAAGNFDQAgACAEmhCjAgwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQOoTzcDAAwCCyAAQQAgAmsQpAIMAQsgACADKQMINwMACyADQRBqJAALDwAgACACEI4DQX9zEKQCCzIBAX8jAEEQayIDJAAgA0EIaiACEIwDIAAgAygCDEUgAygCCEECRnEQpQIgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACEIwDAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEKcCmhCjAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA6hPNwMADAELIABBACACaxCkAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEIwDIAMgAykDCDcDACAAIAIgAxCpAkEBcxClAiADQRBqJAALDAAgACACEI4DEKQCC6oCAgR/AXwjAEHAAGsiAyQAIANBOGogAhCMAyACQRhqIgQgAykDODcDACADQThqIAIQjAMgAiADKQM4NwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQpAIMAQsgAyACQRBqIgUpAwA3AzACQAJAIAIgA0EwahCQAg0AIAMgBCkDADcDKCACIANBKGoQkAJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahCZAgwBCyADIAUpAwA3AyAgAiACIANBIGoQpwI5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEKcCIgc5AwAgACAHIAIrAyCgEKMCCyADQcAAaiQAC8wBAgR/AXwjAEEgayIDJAAgA0EYaiACEIwDIAJBGGoiBCADKQMYNwMAIANBGGogAhCMAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRCkAgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQpwI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKcCIgc5AwAgACACKwMgIAehEKMCCyADQSBqJAALzgEDA38BfgF8IwBBIGsiAyQAIANBGGogAhCMAyACQRhqIgQgAykDGDcDACADQRhqIAIQjAMgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAI0AhAgAjQCGH4iBkIgiKcgBqciBUEfdUcNACAAIAUQpAIMAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEKcCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCnAiIHOQMAIAAgByACKwMgohCjAgsgA0EgaiQAC+cBAgV/AXwjAEEgayIDJAAgA0EYaiACEIwDIAJBGGoiBCADKQMYNwMAIANBGGogAhCMAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQACQAJAIAIoAhgiBUEBag4CAAIBCyACKAIQQYCAgIB4Rg0BCyACKAIQIgYgBW0iByAFbCAGRw0AIAAgBxCkAgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQpwI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKcCIgg5AwAgACACKwMgIAijEKMCCyADQSBqJAALLAECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCECAAIAQgAygCAHEQpAILLAECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCECAAIAQgAygCAHIQpAILLAECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCECAAIAQgAygCAHMQpAILLAECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCECAAIAQgAygCAHQQpAILLAECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCECAAIAQgAygCAHUQpAILQQECfyACQRhqIgMgAhCOAzYCACACIAIQjgMiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQowIPCyAAIAIQpAILnAEBAn8jAEEgayIDJAAgA0EYaiACEIwDIAJBGGoiBCADKQMYNwMAIANBGGogAhCMAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRiECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQsgIhAgsgACACEKUCIANBIGokAAu9AQICfwF8IwBBIGsiAyQAIANBGGogAhCMAyACQRhqIgQgAykDGDcDACADQRhqIAIQjAMgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIAIgA0EQahCnAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQpwIiBTkDACACKwMgIAVlIQIMAQsgAigCECACKAIYTCECCyAAIAIQpQIgA0EgaiQAC70BAgJ/AXwjAEEgayIDJAAgA0EYaiACEIwDIAJBGGoiBCADKQMYNwMAIANBGGogAhCMAyACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEKcCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCnAiIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhClAiADQSBqJAALnwEBAn8jAEEgayIDJAAgA0EYaiACEIwDIAJBGGoiBCADKQMYNwMAIANBGGogAhCMAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRyECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQsgJBAXMhAgsgACACEKUCIANBIGokAAuPAQECfyMAQSBrIgIkACACQRhqIAEQjAMgASgCmAFCADcDICACIAIpAxg3AwgCQCACQQhqELECDQACQAJAIAIoAhwiA0GAgMD/B3ENACADQQ9xQQFGDQELIAJBEGogAUH7ABBzDAELIAEgAigCGBBuIgNFDQAgASgCmAFBACkDoE83AyAgAxBwCyACQSBqJAALqQEBBX8jAEEQayICJAAgAkEIaiABEIwDQQAhAwJAIAEQjgMiBEEBSA0AAkACQCAADQAgAEUhBQwBCwNAIAAoAggiAEUhBSAARQ0BIARBAUohBiAEQX9qIQQgBg0ACwsgBQ0AIAAgASgCOCIEQQN0akEYakEAIAQgACgCEC8BCEkbIQMLAkACQCADDQAgAiABQaYBEHMMAQsgAyACKQMINwMACyACQRBqJAALqQEBBX8jAEEQayIDJABBACEEAkAgAhCOAyIFQQFIDQACQAJAIAENACABRSEGDAELA0AgASgCCCIBRSEGIAFFDQEgBUEBSiEHIAVBf2ohBSAHDQALCyAGDQAgASACKAI4IgVBA3RqQRhqQQAgBSABKAIQLwEISRshBAsCQAJAIAQNACADQQhqIAJBpwEQcyAAQgA3AwAMAQsgACAEKQMANwMACyADQRBqJAALUwECfyMAQRBrIgMkAAJAAkAgAigCOCIEIAIoAJABQSRqKAIAQQR2SQ0AIANBCGogAkGoARBzIABCADcDAAwBCyAAIAIgASAEEOUBCyADQRBqJAALqgEBA38jAEEgayIDJAAgA0EQaiACEIwDIAMgAykDEDcDCEEAIQQCQCACIANBCGoQsAIiBUEKSw0AIAVBktQAai0AACEECwJAAkAgBA0AIABCADcDAAwBCyACIAQ2AjggAyACKAKQATYCBAJAIANBBGogBEGAgAFyIgQQswINACADQRhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EgaiQACw4AIAAgAikDsAG6EKMCC40BAQN/IwBBEGsiAyQAIANBCGogAhCMAyADIAMpAwg3AwACQAJAIAMQsQJFDQAgAigCmAEhBAwBC0EAIQQgAygCDCIFQYCAwP8HcQ0AIAVBD3FBA0cNACACIAMoAggQbSEECwJAAkAgBA0AIABCADcDAAwBCyAAIAQoAhw2AgAgAEEBNgIECyADQRBqJAALtgEBA38jAEEwayICJAAgAkEoaiABEIwDIAJBIGogARCMAyACIAIpAyg3AxACQAJAIAEgAkEQahCvAg0AIAJBGGogAUG6ARBzDAELIAIgAikDKDcDCAJAIAEgAkEIahCuAiIDLwEIIgRBCkkNACACQRhqIAFBuwEQcwwBCyABIARBAWo6ADMgASACKQMgNwNAIAFByABqIAMoAgwgBEEDdBCZBBogASgCmAEgBBBkGgsgAkEwaiQAC1gBAn8jAEEQayIDJAACQAJA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CgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQyAO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDC0GAgICAeCEBIANEAAAAAAAA4MFjDQJB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0H8KkHKAUHlNRD0AwALQYCAgIB4IQELIAELnQECAX8BfAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDIA7chAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLIAML1AECAn8BfkF+IQICQAJAIAEtAAxBDEkNACABKQIQIgRQDQAgAUEYai8BACEDECINAQJAIAAtAAZFDQACQAJAAkBBACgC4MABIgIgAEcNAEHgwAEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEJsEGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAQ3AgAgACADQQd0OwEEQQAhAiAAQQAoAuDAATYCAEEAIAA2AuDAAQsgAg8LQYUvQStB5BkQ9AMAC9EBAgJ/AX5BfiECAkACQCABLQAMQQJJDQAgASkCBCIEUA0AIAEvARAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoAuDAASICIABHDQBB4MABIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCbBBoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAENwIAIAAgA0EHdDsBBEEAIQIgAEEAKALgwAE2AgBBACAANgLgwAELIAIPC0GFL0ErQeQZEPQDAAu9AgEDfwJAAkACQCAALQANQT9HDQAgAC0AA0EBcQ0AECINAUEAKALgwAEiAUUNAANAAkAgAS0AB0UNACAALwEOIAEvAQxHDQAgAUEQaikCACAAKQIEUg0AIAFBADoAByABQQxqIgIQ8gMCQAJAIAEtAAZBgH9qDgMBAgACCwJAAkACQEEAKALgwAEiAyABRw0AQeDAASECDAELA0AgAyICRQ0CIAIoAgAiAyABRw0ACwsgAiABKAIANgIACyABQQBBiAIQmwQaDAELIAFBAToABgJAIAFBAEEAQSAQzQMNACABQYIBOgAGIAEtAAcNBSACEPADIAFBAToAByABQQAoAvC4ATYCCAwBCyABQYABOgAGCyABKAIAIgENAAsLDwtBhS9ByQBBwg4Q9AMAC0HtNkGFL0HxAEG6HBD5AwAL3AEBAn9BfyEEQQAhBQJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQX4hBAwBC0EBIQQgAC0ABw0AAkAgAiAAQQ5qLQAAakEEakHtAU8NAEEAIQRBASEFDAELIABBDGoQ8ANBASEEIABBAToAB0EAIQUgAEEAKALwuAE2AggLAkACQCAFRQ0AIABBDGpBPiAALwEEIANyIAIQ8wMiBEUNASAEIAEgAhCZBBogACAALwEEIgRBAWpBH3EgBEHg/wNxcjsBBEEAIQQLIAQPC0HZM0GFL0GMAUH0CBD5AwALzwEBA38CQBAiDQACQEEAKALgwAEiAEUNAANAAkAgAC0AByIBRQ0AQQAoAvC4ASICIAAoAghrQQBIDQACQCABQQRLDQAgAEEMahCPBCEBQQAoAvC4ASECAkAgAQ0AIAAgAC0AByIBQQFqOgAHIABBgCAgAXQgAmo2AggMAgsgACACQYCABGo2AggMAQsCQCABQQVHDQAgACABQQFqOgAHIAAgAkGAgAJqNgIIDAELIABBCDoABgsgACgCACIADQALCw8LQYUvQdoAQecPEPQDAAtrAQF/QX8hAgJAAkACQCAALQAGQX9qDggBAAAAAAAAAgALQX4PC0EBIQIgAC0ABw0AQQAhAiABIABBDmotAABqQQRqQe0BSQ0AIABBDGoQ8ANBASECIABBAToAByAAQQAoAvC4ATYCCAsgAgsNACAAIAEgAkEAEM0DC/4BAQJ/QQAhAQJAAkACQAJAAkACQAJAIAAtAAYiAg4JBQIDAwMDAwMBAAsgAkGAf2oOAwECAwILAkACQAJAQQAoAuDAASICIABHDQBB4MABIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCbBBpBAA8LIABBAToABgJAIABBAEEAQSAQzQMiAQ0AIABBggE6AAYgAC0ABw0EIABBDGoQ8AMgAEEBOgAHIABBACgC8LgBNgIIQQEPCyAAQYABOgAGIAEPC0GFL0G8AUGNIRD0AwALQQEhAQsgAQ8LQe02QYUvQfEAQbocEPkDAAuPAgEEfwJAAkACQAJAIAEtAAJFDQAQIyABLQACQQ9qQfwDcSICIAAvAQIiA2ohBAJAAkACQAJAIAAvAQAiBSADSw0AIAQgAC8BBE0NAiACIAVJDQFBfyEDQQAhBAwDCyAEIAVJDQFBfiEDQQAhBAwCCyAAIAM7AQYgAiEECyAAIAQ7AQJBACEDQQEhBAsCQCAERQ0AIAAgAC8BAmogAmtBCGogASACEJkEGgsgAC8BACAALwEEIgFLDQEgAC8BAiABSw0CIAAvAQYgAUsNAxAkIAMPC0HqLkEdQZAcEPQDAAtB6x9B6i5BNkGQHBD5AwALQf8fQeouQTdBkBwQ+QMAC0GSIEHqLkE4QZAcEPkDAAs5AQJ/QQAhAQJAIAAvAQAiAiAALwECRg0AAkAgAiAALwEGSQ0AIABBCGoPCyAAIAJqQQhqIQELIAELrAEBA38QI0EAIQECQCAALwEAIgIgAC8BAkYNAAJAIAIgAC8BBkkNACAAQQhqIQEMAQsgACACakEIaiEBCwJAAkAgAUUNACABLQACQQ9qQfwDcSEBAkAgAiAALwEGIgNJDQAgAiADRw0CIAAgATsBACAAIAAvAQQ7AQYQJA8LIAAgAiABajsBABAkDwtBzTNB6i5BzABBvg0Q+QMAC0HhHkHqLkHPAEG+DRD5AwALIgEBfyAAQQhqECAiASAAOwEEIAEgADsBBiABQQA2AQAgAQszAQF/IwBBEGsiAiQAIAIgAToADyAALQANIAAvAQ4gAkEPakEBEJEEIQAgAkEQaiQAIAALMwEBfyMAQRBrIgIkACACIAE7AQ4gAC0ADSAALwEOIAJBDmpBAhCRBCEAIAJBEGokACAACzMBAX8jAEEQayICJAAgAiABNgIMIAAtAA0gAC8BDiACQQxqQQQQkQQhACACQRBqJAAgAAs8AAJAAkAgAUUNACABLQAADQELIAAtAA0gAC8BDkH/wABBABCRBA8LIAAtAA0gAC8BDiABIAEQvwQQkQQLTgECfyMAQRBrIgEkAEEAIQICQCAALQADQQRxDQAgASAALwEOOwEIIAEgAC8BADsBCiAALQANQQMgAUEIakEEEJEEIQILIAFBEGokACACCxkAIAAgAC0ADEEEajoAAiAAEPADIAAQjwQLGgACQCAAIAEgAhDdAyIADQAgARDaAxoLIAAL6AUBEH8jAEEQayIDJABBACEEAkACQCABLwEOIgVBDHYiBkF/akEBSw0AAkAgBkECRw0AIAEtAAxFDQELIAVB/x9xIgdB/x1LDQACQCAGQQJHDQAgBUGAHnFBgAJGDQELIAIvAQAiBUHxH0YNAEEAIAdrIQggAUEQaiEJQQAhCkEAIQtBACEMA0ACQAJAIAVB//8DcSIFQQx2Ig1BCUYNACANQcDaAGotAAAhBAwBCyACIAxBAWoiDEEBdGovAQAhBAsgBEUNAgJAIAVBgMADcUGAgAJGDQAgC0H/AXEhDkEAIQsgCiAOQQBHakEDIARBf2ogBEEDSxsiCmogCkF/c3EhCgsCQAJAIAVB/x9xIAdHIg8NACAAIApqIRACQCAGQQFHDQACQCANQQhHDQAgAyAQLQAAIAtB/wFxdkEBcToADyABLQANIAEvAQ4gA0EPakEBEJEEGiAIIREMAwsgECENIAQhDgJAIAVBgMACSQ0AA0BBACERIA4iBUUNBCAFQX9qIQ4gDS0AACESIA1BAWohDSASRQ0ACyAFRQ0DCyABLQANIAEvAQ4gECAEEJEEGiAIIREMAgsCQCANQQhHDQBBASALQf8BcXQhBCAQLQAAIQUCQCABLQAQRQ0AIBAgBSAEcjoAACAHIREMAwsgECAFIARBf3NxOgAAIAchEQwCCwJAIAQgAS0ADCINSw0AIBAgCSAEEJkEGiAHIREMAgsgECAJIA0QmQQhDkEAIQ0CQCAFQf+fAUsNACAFQYAgcQ0AIAEtAAwgAWpBD2osAABBB3UhDQsgDiABLQAMIgVqIA0gBCAFaxCbBBogByERDAELAkAgDUEIRw0AQQAgC0EBaiIEIARB/wFxQQhGIgQbIQsgCiAEaiEKDAELIAogBGohCgsCQCAPRQ0AQQAhBCACIAxBAWoiDEEBdGovAQAiBUHxH0YNAgwBCwsgESEECyADQRBqJAAgBA8LQdsrQd0AQfYUEPQDAAuYAgEEfyAAEN8DIAAQzAMgABDDAyAAEL0DAkACQCAALQADQQFxDQAgAC0ADQ0BIAAvAQ4NASAALQAMQQRJDQEgAEERai0AAEEIcUUNAUEAQQAoAvC4ATYC7MABQYACEB5BAC0A8K4BEB0PCwJAIAApAgQQ7QNSDQAgABDgAyAALQANIgFBAC0A5MABTw0BQQAoAujAASABQQJ0aigCACIBIAAgASgCACgCDBECAA8LIAAtAANBBHFFDQBBAC0A5MABRQ0AIAAoAgQhAkEAIQEDQAJAQQAoAujAASABQQJ0aigCACIDKAIAIgQoAgAgAkcNACAAIAE6AA0gAyAAIAQoAgwRAgALIAFBAWoiAUEALQDkwAFJDQALCwsCAAsCAAtmAQF/AkBBAC0A5MABQSBJDQBB2ytBrgFB/CMQ9AMACyAALwEEECAiASAANgIAIAFBAC0A5MABIgA6AARBAEH/AToA5cABQQAgAEEBajoA5MABQQAoAujAASAAQQJ0aiABNgIAIAELhgIBBH8jAEGAAWsiACQAQQBBADoA5MABQQAgADYC6MABQQAQNKciATYC8LgBAkACQCABQQAoAvjAASICayIDQf//AEsNACADQekHSQ0BQQBBACkDgMEBIAEgAmtBl3hqIgNB6AduIgJBAWqtfDcDgMEBIAMgAkHoB2xrQQFqIQMMAQtBAEEAKQOAwQEgA0HoB24iAq18NwOAwQEgAyACQegHbGshAwtBACABIANrNgL4wAFBAEEAKQOAwQE+AojBARDBAxA2QQBBADoA5cABQQBBAC0A5MABQQJ0ECAiAzYC6MABIAMgAEEALQDkwAFBAnQQmQQaQQAQND4C7MABIABBgAFqJAALpAEBA39BABA0pyIANgLwuAECQAJAIABBACgC+MABIgFrIgJB//8ASw0AIAJB6QdJDQFBAEEAKQOAwQEgACABa0GXeGoiAkHoB24iAa18QgF8NwOAwQEgAiABQegHbGtBAWohAgwBC0EAQQApA4DBASACQegHbiIBrXw3A4DBASACIAFB6AdsayECC0EAIAAgAms2AvjAAUEAQQApA4DBAT4CiMEBCxMAQQBBAC0A8MABQQFqOgDwwAELvgEBBn8jACIAIQEQH0EAIQIgAEEALQDkwAEiA0ECdEEPakHwD3FrIgQkAAJAIANFDQBBACgC6MABIQUDQCAEIAJBAnQiAGogBSAAaigCACgCACgCADYCACACQQFqIgIgA0cNAAsLAkBBAC0A8cABIgJBD08NAEEAIAJBAWo6APHAAQsgBEEALQDwwAFBEHRBAC0A8cABckGAngRqNgIAAkBBAEEAIAQgA0ECdBCRBA0AQQBBADoA8MABCyABJAALJQEBf0EBIQECQCAALQADQQVxQQFHDQAgACkCBBDtA1EhAQsgAQvWAQECfwJAQfTAAUGgwh4Q9gNFDQAQ5QMLAkACQEEAKALswAEiAEUNAEEAKALwuAEgAGtBgICAf2pBAEgNAQtBAEEANgLswAFBkQIQHgtBACgC6MABKAIAIgAgACgCACgCCBEAAAJAQQAtAOXAAUH+AUYNAEEBIQACQEEALQDkwAFBAU0NAANAQQAgADoA5cABQQAoAujAASAAQQJ0aigCACIBIAEoAgAoAggRAAAgAEEBaiIAQQAtAOTAAUkNAAsLQQBBADoA5cABCxCGBBDOAxC7AxCVBAunAQEDf0EAEDSnIgA2AvC4AQJAAkAgAEEAKAL4wAEiAWsiAkH//wBLDQAgAkHpB0kNAUEAQQApA4DBASAAIAFrQZd4aiICQegHbiIBQQFqrXw3A4DBASACIAFB6Adsa0EBaiECDAELQQBBACkDgMEBIAJB6AduIgGtfDcDgMEBIAIgAUHoB2xrIQILQQAgACACazYC+MABQQBBACkDgMEBPgKIwQEQ6QMLZwEBfwJAAkADQBCMBCIARQ0BAkAgAC0AA0EDcUEDRw0AIAApAgQQ7QNSDQBBPyAALwEAQQBBABCRBBoQlQQLA0AgABDeAyAAEPEDDQALIAAQjQQQ5wMQOSAADQAMAgsACxDnAxA5CwsGAEGUwQALBgBBgMEACzkBAX9BxbvyiHghAgJAIAFFDQADQCACIAAtAABzQZODgAhsIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAgsEABAyC04BAX8CQEEAKAKMwQEiAA0AQQAgAEGTg4AIbEENczYCjMEBC0EAQQAoAozBASIAQQ10IABzIgBBEXYgAHMiAEEFdCAAcyIANgKMwQEgAAtqAQF/Qf//AyECAkAgAUUNAEH//wMhAgNAIAJB//8DcSICQQh0IAAtAAAgAkEIdnMiAkHwAXFBBHYgAnNB/wFxIgJyIAJBDHRzIAJBBXRzIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAkH//wNxC20BA38gAEECaiEBIAAtAAJBCmohAkH//wMhAwNAIANB//8DcSIDQQh0IAEtAAAgA0EIdnMiA0HwAXFBBHYgA3NB/wFxIgNyIANBDHRzIANBBXRzIQMgAUEBaiEBIAJBf2oiAg0ACyAAIAM7AQAL4QEBB39BACEBAkAgAC0ADCICQQdqQfwDcSIDIAAtAAIiBE8NAAJAIABBDGoiBSACQQRqIgZqLQAAQf8BRw0AIAIgAGpBEWotAAAiAyAETw0BIAYgA08NAQsgACAALQADQf0BcToAAyAAIANqQQxqIgItAAAiBkEEaiIHIANqIARLDQBBACEBA0AgBSACKAIANgIAIAVBBGohBSACQQRqIQIgASAGSSEEIAFBBGohASAEDQALIABBDGoiBSAHakH/AToAACAGIAVqQQVqIAZBB2pB/AFxIANqOgAAQQEhAQsgAQsJACAAQQA6AAILkQEBAn8CQAJAIAFBgAJPDQAgAkGAgARPDQFBACEEAkAgA0EEakHsASAALQACIgVrSw0AIAAgBWpBDGoiBCACOgACIAQgAToAASAEIAM6AAAgBCACQQh2OgADIAAgBSADQQdqQfwBcWo6AAIgBEEEaiEECyAEDwtBii1BgQFBviIQ9AMAC0GKLUGDAUG+IhD0AwALLAEBfyMAQRBrIgMkACADIAI2AgggAyABNgIEIAMgADYCAEG8EiADEC0QHAALSQEDfwJAIAAoAgAiAkEAKAKIwQFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoAojBASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtJAQN/AkAgACgCACICQQAoAvC4AWsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgC8LgBIgRrQX9KDQAgACAEIAFqNgIACyADQR92C2QBA38CQCACRQ0AQQAhAwNAIAAgA0EBdGoiBCABIANqIgUtAABBBHZBzR5qLQAAOgAAIARBAWogBS0AAEEPcUHNHmotAAA6AAAgA0EBaiIDIAJHDQALCyAAIAJBAXRqQQA6AAALnQIBB38gACECAkAgAS0AACIDRQ0AIANFIQRBACEFIAAhAgNAAkACQCADQVBqQf8BcUEJSyIGDQAgA0EYdEEYdUFQaiEHDAELQX8hByADQSByIghBn39qQf8BcUEFSw0AIAhBGHRBGHVBqX9qIQcLAkAgB0F/Rw0AIAEtAAEiA0UhBCABQQFqIQEgAw0BDAILIARBAXENAQJAAkAgBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIDQZ9/akH/AXFBBUsNACADQRh0QRh1Qal/aiEHCyABQQFqIQECQAJAIAUNACAHQQR0QYACciEFDAELIAIgByAFcjoAACACQQFqIQJBACEFCyABLQAAIgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGXEiAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEJkEIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiAC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wwELTwIBfgJ/AkACQCAAvSIBQjSIp0H/D3EiAkH/D0YNAEEEIQMgAg0BQQJBAyABQv///////////wCDUBsPCyABQv////////8Hg1AhAwsgAwsEACAAC48EAQN/AkAgAkGABEkNACAAIAEgAhARGiAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEJkEDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALtQQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAJC////////////AINCgICAgICAgPj/AFYNACAAvSIEQjSIp0H/D3EiBkH/D0cNAQsgACABoiIBIAGjDwsCQCAEQgGGIgUgA1YNACAARAAAAAAAAAAAoiAAIAUgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAEQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIARBASAGa62GIQMMAQsgBEL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIFQgBTDQADQCAHQX9qIQcgBUIBhiIFQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkACQCADIAJ9IgVCAFkNACADIQUMAQsgAyACUg0AIABEAAAAAAAAAACiDwsgBUIBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkACQCADIAJ9IgVCAFkNACADIQUMAQsgAyACUg0AIABEAAAA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D2ohAQsgACABQf8Haq1CNIa/ogs1ACAAIAE3AwAgACAEQjCIp0GAgAJxIAJCMIinQf//AXFyrUIwhiACQv///////z+DhDcDCAvnAgEBfyMAQdAAayIEJAACQAJAIANBgIABSA0AIARBIGogASACQgBCgICAgICAgP//ABDhBCAEQSBqQQhqKQMAIQIgBCkDICEBAkAgA0H//wFPDQAgA0GBgH9qIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEOEEIANB/f8CIANB/f8CSBtBgoB+aiEDIARBEGpBCGopAwAhAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEHAAGogASACQgBCgICAgICAgDkQ4QQgBEHAAGpBCGopAwAhAiAEKQNAIQECQCADQfSAfk0NACADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EOEEIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhDhBCAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9sGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ1wRFDQAgAyAEEMcEIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOEEIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ2QQgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgCK1CMIYgAkL///////8/g4QiCSADIARCMIinQf//AXEiBq1CMIYgBEL///////8/g4QiChDXBEEASg0AAkAgASAJIAMgChDXBEUNACABIQQMAgsgBUHwAGogASACQgBCABDhBCAFQfgAaikDACECIAUpA3AhBAwBCwJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDhBCAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ4QQgBUHYAGopAwAiCkIwiKdBiH9qIQYg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QAJAQQAoAsTDASIGQQEgAnQiA3ENAEEAIAYgA3I2AsTDASAEIAE2AgAgAUEYaiAENgIADAELIABBAEEZIAJBAXZrIAJBH0YbdCECIAQoAgAhBgNAIAYiBCgCBEF4cSAARg0CIAJBHXYhBiACQQF0IQIgBCAGQQRxakEQaiIDKAIAIgYNAAsgAyABNgIAIAFBGGogBDYCAAsgASABNgIMIAEgATYCCAwBCyAEKAIIIgAgATYCDCAEIAE2AgggAUEYakEANgIAIAEgBDYCDCABIAA2AggLQQBBACgC4MMBQX9qIgFBfyABGzYC4MMBCwsHAD8AQRB0C1QBAn9BACgC7LIBIgEgAEEDakF8cSICaiEAAkACQCACRQ0AIAAgAU0NAQsCQCAAENMETQ0AIAAQE0UNAQtBACAANgLssgEgAQ8LEJYEQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEKIAQgAiAHGyIJQv///////z+DIQsgAiAEIAcbIgxCMIinQf//AXEhCAJAIAlCMIinQf//AXEiBg0AIAVB4ABqIAogCyAKIAsgC1AiBht5IAZBBnStfKciBkFxahDWBEEQIAZrIQYgBUHoAGopAwAhCyAFKQNgIQoLIAEgAyAHGyEDIAxC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ1gRBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCECIAtCA4YgCkI9iIQhBCADQgOGIQEgCSAMhSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAkIBIQEMAQsgBUHAAGogASACQYABIAdrENYEIAVBMGogASACIAcQ4AQgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQEgBUEwakEIaikDACECCyAEQoCAgICAgIAEhCEMIApCA4YhCwJAAkAgA0J/VQ0AQgAhA0IAIQQgCyABhSAMIAKFhFANAiALIAF9IQogDCACfSALIAFUrX0iBEL/////////A1YNASAFQSBqIAogBCAKIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDWBCAGIAdrIQYgBUEoaikDACEEIAUpAyAhCgwBCyACIAx8IAEgC3wiCiABVK18IgRCgICAgICAgAiDUA0AIApCAYggBEI/hoQgCkIBg4QhCiAGQQFqIQYgBEIBiCEECyAJQoCAgICAgICAgH+DIQECQCAGQf//AUgNACABQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAogBCAGQf8AahDWBCAFIAogBEEBIAZrEOAEIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQogBUEIaikDACEECyAKQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgAYQhBCAKp0EHcSEGAkACQAJAAkACQBDeBA4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIAFCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIAFQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDfBBoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvfEAIFfw5+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqENYEQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ1gQgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ4gQgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ4gQgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ4gQgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ4gQgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ4gQgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ4gQgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ4gQgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ4gQgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ4gQgBUGQAWogA0IPhkIAIARCABDiBCAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEOIEIAVBgAFqQgEgAn1CACAEQgAQ4gQgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIAFCP4iEIhRCIIgiBH4iCyABQgGGIhVCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgC1StIBAgD0L/////D4MiCyAUQv////8PgyIPfnwiESAQVK18IA0gBH58IAsgBH4iFiAPIA1+fCIQIBZUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIA9+IhYgAiAKfnwiESAWVK0gESALIBVC/v///w+DIhZ+fCIXIBFUrXx8IhEgEFStfCARIBIgBH4iECAWIA1+fCIEIAIgD358Ig0gCyAKfnwiC0IgiCAEIBBUrSANIARUrXwgCyANVK18QiCGhHwiBCARVK18IAQgFyACIBZ+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgF1StIAIgC0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgBUHQAGogAiAEIAMgDhDiBCABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDiBCABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRUgEyEUCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhCyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxDgBCAFQTBqIBUgFCAGQfAAahDWBCAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiCxDiBCAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEOIEIAUgAyAOQgVCABDiBCALIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ1gQgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ1gQgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDWBCACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDWBCACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDWBEEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDWBCAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgCkIPhiADQjGIhCIUQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdBgAFJDQBCACEBDAMLIAVBMGogEiABIAZB/wBqIgYQ1gQgBUEgaiACIAQgBhDWBCAFQRBqIBIgASAHEOAEIAUgAiAEIAcQ4AQgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwBCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgQgAUIgiCICfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgAn58IgNCIIh8IANC/////w+DIAQgAX58IgNCIIh8NwMIIAAgA0IghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ1QQgBSkDACEBIAAgBUEIaikDADcDCCAAIAE3AwAgBUEQaiQAC+oDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAiFQgBSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qENYEIAIgACAEQYH4ACADaxDgBCACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIhUIAUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEGwx8ECJAJBsMcBQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABEQAAskAQF+IAAgASACrSADrUIghoQgBBDtBCEFIAVCIIinEBQgBacLEwAgACABpyABQiCIpyACIAMQFQsLgKuBgAADAEGACAvopgFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBpbnZhbGlkIGtleQBhcnJheQBpc0FycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleAAlczoleABjbG9zdXJlOiVkOiV4AG1ldGhvZDolZDoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcncAcG93AGpkX3dzc2tfbmV3AGlkaXYAcHJldgB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAJXM6JXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABsb2NhbGhvc3QAc3RvcF9saXN0AHNxcnQAaXNSZXBvcnQAYXV0aCB0b28gc2hvcnQAYXNzZXJ0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAcmFuZG9tSW50AHBhcnNlSW50AGRldmljZXNjcmlwdG1ncl9pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AG9uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBkZXZzX21hcF9rZXlzX29yX3ZhbHVlcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBhYnMAc2xlZXBNcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAV1M6IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAY2xlYXIgcm9sZSAlcwBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwBKU0NSOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgB0YWcgZXJyb3IAZmxvb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgByb2xlX21lbWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgUEFDS19TSElGVCkgPj4gUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAG1hcABkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19tYXBfY29weV9pbnRvAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgByZS1ydW4Abm9uLWZ1bgBidXR0b24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AbWFpbgBkZXZzX29iamVjdF9nZXRfYnVpbHRfaW4AZGV2c19vYmplY3RfZ2V0X3N0YXRpY19idWlsdF9pbgBhc3NpZ24AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAHNldHRpbmcgbnVsbABnZXR0aW5nIG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBsb2cAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAHByb3RvdHlwZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQBpbmxpbmUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAG5hbWUAKHJvbGUgJiBERVZTX1JPTEVfTUFTSykgPT0gcm9sZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAb25DaGFuZ2UAcHVzaFJhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGVuY29kZQBkZWNvZGUAZXZlbnRDb2RlAHJlZ0NvZGUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAYm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX29iamVjdF9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAaXNDb21tYW5kAHNlcnZpY2VDb21tYW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb25EaXNjb25uZWN0ZWQAV1M6IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAHVuZGVmaW5lZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkAERldmljZVNjcmlwdCBydW50aW1lIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAHR2b2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAHBhbmljAGJhZCBtYWdpYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBwYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBuZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAG5ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAZGV2aWNlc2NyaXB0L3RzYWdnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX2Z1bmNfXwBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAUEkARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1z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aXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRA5hZ2didWZmZXJfaW5pdEUPYWdnYnVmZmVyX2ZsdXNoRhBhZ2didWZmZXJfdXBsb2FkRw5kZXZzX2J1ZmZlcl9vcEgQZGV2c19yZWFkX251bWJlckkSZGV2c19idWZmZXJfZGVjb2RlShJkZXZzX2J1ZmZlcl9lbmNvZGVLD2RldnNfY3JlYXRlX2N0eEwJc2V0dXBfY3R4TQpkZXZzX3RyYWNlTg9kZXZzX2Vycm9yX2NvZGVPGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJQCWNsZWFyX2N0eFENZGV2c19mcmVlX2N0eFIIZGV2c19vb21TCWRldnNfZnJlZVQXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NVB3RyeV9ydW5WDHN0b3BfcHJvZ3JhbVccZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVkYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFsOZGVwbG95X2hhbmRsZXJcE2RlcGxveV9tZXRhX2hhbmRsZXJdFmRldmljZXNjcmlwdG1ncl9kZXBsb3leFGRldmljZXNjcmlwdG1ncl9pbml0XxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YBFkZXZzY2xvdWRfcHJvY2Vzc2EXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRiE2RldnNjbG91ZF9vbl9tZXRob2RjDmRldnNjbG91ZF9pbml0ZBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25lCmRldnNfcGFuaWNmGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWcQZGV2c19maWJlcl9zbGVlcGgbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsaQxsb2dfZmliZXJfb3BqGmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzaxFkZXZzX2ltZ19mdW5fbmFtZWwSZGV2c19pbWdfcm9sZV9uYW1lbRJkZXZzX2ZpYmVyX2J5X2ZpZHhuEWRldnNfZmliZXJfYnlfdGFnbxBkZXZzX2ZpYmVyX3N0YXJ0cBRkZXZzX2ZpYmVyX3Rlcm1pYW50ZXEOZGV2c19maWJlcl9ydW5yE2RldnNfZmliZXJfc3luY19ub3dzFV9kZXZzX3J1bnRpbWVfZmFpbHVyZXQPZGV2c19maWJlcl9wb2tldRNqZF9nY19hbnlfdHJ5X2FsbG9jdgdkZXZzX2djdw9maW5kX2ZyZWVfYmxvY2t4EmRldnNfYW55X3RyeV9hbGxvY3kOZGV2c190cnlfYWxsb2N6C2pkX2djX3VucGluewpqZF9nY19mcmVlfA5kZXZzX3ZhbHVlX3Bpbn0QZGV2c192YWx1ZV91bnBpbn4SZGV2c19tYXBfdHJ5X2FsbG9jfxRkZXZzX2FycmF5X3RyeV9hbGxvY4ABFWRldnNfYnVmZmVyX3RyeV9hbGxvY4EBFWRldnNfc3RyaW5nX3RyeV9hbGxvY4IBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0gwEPZGV2c19nY19zZXRfY3R4hAEOZGV2c19nY19jcmVhdGWFAQ9kZXZzX2djX2Rlc3Ryb3mGAQtzY2FuX2djX29iaocBEXByb3BfQXJyYXlfbGVuZ3RoiAESbWV0aDJfQXJyYXlfaW5zZXJ0iQESZnVuMV9BcnJheV9pc0FycmF5igEQbWV0aFhfQXJyYXlfcHVzaIsBFW1ldGgxX0FycmF5X3B1c2hSYW5nZYwBEW1ldGhYX0FycmF5X3NsaWNljQERZnVuMV9CdWZmZXJfYWxsb2OOARJwcm9wX0J1ZmZlcl9sZW5ndGiPARVtZXRoMF9CdWZmZXJfdG9TdHJpbmeQARNtZXRoM19CdWZmZXJfZmlsbEF0kQETbWV0aDRfQnVmZmVyX2JsaXRBdJIBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOTARdmdW4xX0RldmljZVNjcmlwdF9wYW5pY5QBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdJUBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdJYBFWZ1bjFfRGV2aWNlU2NyaXB0X2xvZ5cBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSYARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludJkBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0mgEOZnVuMV9NYXRoX2NlaWybAQ9mdW4xX01hdGhfZmxvb3KcAQ9mdW4xX01hdGhfcm91bmSdAQ1mdW4xX01hdGhfYWJzngEQZnVuMF9NYXRoX3JhbmRvbZ8BE2Z1bjFfTWF0aF9yYW5kb21JbnSgAQ1mdW4xX01hdGhfbG9noQENZnVuMl9NYXRoX3Bvd6IBDmZ1bjJfTWF0aF9pZGl2owEOZnVuMl9NYXRoX2ltb2SkAQ5mdW4yX01hdGhfaW11bKUBDWZ1bjJfTWF0aF9taW6mAQtmdW4yX21pbm1heKcBDWZ1bjJfTWF0aF9tYXioARJmdW4yX09iamVjdF9hc3NpZ26pARBmdW4xX09iamVjdF9rZXlzqgETZnVuMV9rZXlzX29yX3ZhbHVlc6sBEmZ1bjFfT2JqZWN0X3ZhbHVlc6wBEHByb3BfUGFja2V0X3JvbGWtARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVyrgETcHJvcF9QYWNrZXRfc2hvcnRJZK8BGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleLABGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5ksQERcHJvcF9QYWNrZXRfZmxhZ3OyARVwcm9wX1BhY2tldF9pc0NvbW1hbmSzARRwcm9wX1BhY2tldF9pc1JlcG9ydLQBE3Byb3BfUGFja2V0X3BheWxvYWS1ARNwcm9wX1BhY2tldF9pc0V2ZW50tgEVcHJvcF9QYWNrZXRfZXZlbnRDb2RltwEUcHJvcF9QYWNrZXRfaXNSZWdTZXS4ARRwcm9wX1BhY2tldF9pc1JlZ0dldLkBE3Byb3BfUGFja2V0X3JlZ0NvZGW6ARNtZXRoMF9QYWNrZXRfZGVjb2RluwESZGV2c19wYWNrZXRfZGVjb2RlvAEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkvQEURHNSZWdpc3Rlcl9yZWFkX2NvbnS+ARJkZXZzX3BhY2tldF9lbmNvZGW/ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlwAEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZcEBFnByb3BfRHNQYWNrZXRJbmZvX25hbWXCARZwcm9wX0RzUGFja2V0SW5mb19jb2RlwwEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fxAEVcHJvcF9Sb2xlX2lzQ29ubmVjdGVkxQEScHJvcF9TdHJpbmdfbGVuZ3RoxgEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTHARNtZXRoMV9TdHJpbmdfY2hhckF0yAEUZGV2c19qZF9nZXRfcmVnaXN0ZXLJARZkZXZzX2pkX2NsZWFyX3BrdF9raW5kygEQZGV2c19qZF9zZW5kX2NtZMsBEWRldnNfamRfd2FrZV9yb2xlzAEUZGV2c19qZF9yZXNldF9wYWNrZXTNARNkZXZzX2pkX3BrdF9jYXB0dXJlzgETZGV2c19qZF9zZW5kX2xvZ21zZ88BDWhhbmRsZV9sb2dtc2fQARJkZXZzX2pkX3Nob3VsZF9ydW7RARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdIBE2RldnNfamRfcHJvY2Vzc19wa3TTARRkZXZzX2pkX3JvbGVfY2hhbmdlZNQBEmRldnNfamRfaW5pdF9yb2xlc9UBEmRldnNfamRfZnJlZV9yb2xlc9YBEGRldnNfc2V0X2xvZ2dpbmfXARVkZXZzX2dldF9nbG9iYWxfZmxhZ3PYARJkZXZzX21hcF9jb3B5X2ludG/ZAQxkZXZzX21hcF9zZXTaARRkZXZzX2lzX3NlcnZpY2Vfc3BlY9sBBmxvb2t1cNwBF2RldnNfbWFwX2tleXNfb3JfdmFsdWVz3QERZGV2c19hcnJheV9pbnNlcnTeAQ9kZXZzX21hcF9kZWxldGXfARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7gARdkZXZzX2RlY29kZV9yb2xlX3BhY2tldOEBDmRldnNfcm9sZV9zcGVj4gEQZGV2c19zcGVjX2xvb2t1cOMBEWRldnNfcHJvdG9fbG9va3Vw5AESZGV2c19mdW5jdGlvbl9iaW5k5QERZGV2c19tYWtlX2Nsb3N1cmXmAQ5kZXZzX2dldF9mbmlkeOcBE2RldnNfZ2V0X3JvbGVfcHJvdG/oARtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfpARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTqARVkZXZzX2dldF9zdGF0aWNfcHJvdG/rAR1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bewBF2RldnNfb2JqZWN0X2dldF9ub19iaW5k7QEPZGV2c19vYmplY3RfZ2V07gEMZGV2c19zZXFfZ2V07wEMZGV2c19hbnlfZ2V08AEMZGV2c19hbnlfc2V08QEMZGV2c19zZXFfc2V08gEOZGV2c19hcnJheV9zZXTzAQxkZXZzX2FyZ19pbnT0AQ9kZXZzX2FyZ19kb3VibGX1AQ9kZXZzX3JldF9kb3VibGX2AQxkZXZzX3JldF9pbnT3AQ1kZXZzX3JldF9ib29s+AEPZGV2c19yZXRfZ2NfcHRy+QERZGV2c19zZXR1cF9yZXN1bWX6ARJkZXZzX3JlZ2NhY2hlX2ZyZWX7ARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs/AEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWT9ARNkZXZzX3JlZ2NhY2hlX2FsbG9j/gEUZGV2c19yZWdjYWNoZV9sb29rdXD/ARFkZXZzX3JlZ2NhY2hlX2FnZYACF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlgQISZGV2c19yZWdjYWNoZV9uZXh0ggIPamRfc2V0dGluZ3NfZ2V0gwIPamRfc2V0dGluZ3Nfc2V0hAIOZGV2c19sb2dfdmFsdWWFAg9kZXZzX3Nob3dfdmFsdWWGAhBkZXZzX3Nob3dfdmFsdWUwhwINY29uc3VtZV9jaHVua4gCDXNoYV8yNTZfY2xvc2WJAg9qZF9zaGEyNTZfc2V0dXCKAhBqZF9zaGEyNTZfdXBkYXRliwIQamRfc2hhMjU2X2ZpbmlzaIwCFGpkX3NoYTI1Nl9obWFjX3NldHVwjQIVamRfc2hhMjU2X2htYWNfZmluaXNojgIOamRfc2hhMjU2X2hrZGaPAg5kZXZzX3N0cmZvcm1hdJACDmRldnNfaXNfc3RyaW5nkQIOZGV2c19pc19udW1iZXKSAhRkZXZzX3N0cmluZ19nZXRfdXRmOJMCE2RldnNfYnVpbHRpbl9zdHJpbmeUAhRkZXZzX3N0cmluZ192c3ByaW50ZpUCE2RldnNfc3RyaW5nX3NwcmludGaWAhVkZXZzX3N0cmluZ19mcm9tX3V0ZjiXAhRkZXZzX3ZhbHVlX3RvX3N0cmluZ5gCEGJ1ZmZlcl90b19zdHJpbmeZAhJkZXZzX3N0cmluZ19jb25jYXSaAhxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNjmwIPdHNhZ2dfY2xpZW50X2V2nAIKYWRkX3Nlcmllc50CDXRzYWdnX3Byb2Nlc3OeAgpsb2dfc2VyaWVznwITdHNhZ2dfaGFuZGxlX3BhY2tldKACFGxvb2t1cF9vcl9hZGRfc2VyaWVzoQIKdHNhZ2dfaW5pdKICDHRzYWdnX3VwZGF0ZaMCFmRldnNfdmFsdWVfZnJvbV9kb3VibGWkAhNkZXZzX3ZhbHVlX2Zyb21faW50pQIUZGV2c192YWx1ZV9mcm9tX2Jvb2ymAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcqcCFGRldnNfdmFsdWVfdG9fZG91YmxlqAIRZGV2c192YWx1ZV90b19pbnSpAhJkZXZzX3ZhbHVlX3RvX2Jvb2yqAg5kZXZzX2lzX2J1ZmZlcqsCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxlrAIQZGV2c19idWZmZXJfZGF0Ya0CE2RldnNfYnVmZmVyaXNoX2RhdGGuAhRkZXZzX3ZhbHVlX3RvX2djX29iaq8CDWRldnNfaXNfYXJyYXmwAhFkZXZzX3ZhbHVlX3R5cGVvZrECD2RldnNfaXNfbnVsbGlzaLICEmRldnNfdmFsdWVfaWVlZV9lcbMCEmRldnNfaW1nX3N0cmlkeF9va7QCEmRldnNfZHVtcF92ZXJzaW9uc7UCC2RldnNfdmVyaWZ5tgIUZGV2c192bV9leGVjX29wY29kZXO3AhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeLgCEWRldnNfaW1nX2dldF91dGY4uQIUZGV2c19nZXRfc3RhdGljX3V0Zji6Ag9kZXZzX3ZtX3JvbGVfb2u7AgxleHByX2ludmFsaWS8AhRleHByeF9idWlsdGluX29iamVjdL0CC3N0bXQxX2NhbGwwvgILc3RtdDJfY2FsbDG/AgtzdG10M19jYWxsMsACC3N0bXQ0X2NhbGwzwQILc3RtdDVfY2FsbDTCAgtzdG10Nl9jYWxsNcMCC3N0bXQ3X2NhbGw2xAILc3RtdDhfY2FsbDfFAgtzdG10OV9jYWxsOMYCEnN0bXQyX2luZGV4X2RlbGV0ZccCDHN0bXQxX3JldHVybsgCCXN0bXR4X2ptcMkCDHN0bXR4MV9qbXBfesoCC3N0bXQxX3BhbmljywISZXhwcnhfb2JqZWN0X2ZpZWxkzAISc3RtdHgxX3N0b3JlX2xvY2FszQITc3RtdHgxX3N0b3JlX2dsb2JhbM4CEnN0bXQ0X3N0b3JlX2J1ZmZlcs8CCWV4cHIwX2luZtACEGV4cHJ4X2xvYWRfbG9jYWzRAhFleHByeF9sb2FkX2dsb2JhbNICC2V4cHIxX3VwbHVz0wILZXhwcjJfaW5kZXjUAg9zdG10M19pbmRleF9zZXTVAhRleHByeDFfYnVpbHRpbl9maWVsZNYCEmV4cHJ4MV9hc2NpaV9maWVsZNcCEWV4cHJ4MV91dGY4X2ZpZWxk2AIQZXhwcnhfbWF0aF9maWVsZNkCDmV4cHJ4X2RzX2ZpZWxk2gIPc3RtdDBfYWxsb2NfbWFw2wIRc3RtdDFfYWxsb2NfYXJyYXncAhJzdG10MV9hbGxvY19idWZmZXLdAhFleHByeF9zdGF0aWNfcm9sZd4CE2V4cHJ4X3N0YXRpY19idWZmZXLfAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfgAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n4QIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n4gIVZXhwcnhfc3RhdGljX2Z1bmN0aW9u4wINZXhwcnhfbGl0ZXJhbOQCEWV4cHJ4X2xpdGVyYWxfZjY05QIQZXhwcjBfcGt0X2J1ZmZlcuYCEWV4cHIzX2xvYWRfYnVmZmVy5wINZXhwcjBfcmV0X3ZhbOgCDGV4cHIxX3R5cGVvZukCCmV4cHIwX251bGzqAg1leHByMV9pc19udWxs6wIKZXhwcjBfdHJ1ZewCC2V4cHIwX2ZhbHNl7QINZXhwcjFfdG9fYm9vbO4CCWV4cHIwX25hbu8CCWV4cHIxX2Fic/ACDWV4cHIxX2JpdF9ub3TxAgxleHByMV9pc19uYW7yAglleHByMV9uZWfzAglleHByMV9ub3T0AgxleHByMV90b19pbnT1AglleHByMl9hZGT2AglleHByMl9zdWL3AglleHByMl9tdWz4AglleHByMl9kaXb5Ag1leHByMl9iaXRfYW5k+gIMZXhwcjJfYml0X29y+wINZXhwcjJfYml0X3hvcvwCEGV4cHIyX3NoaWZ0X2xlZnT9AhFleHByMl9zaGlmdF9yaWdodP4CGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk/wIIZXhwcjJfZXGAAwhleHByMl9sZYEDCGV4cHIyX2x0ggMIZXhwcjJfbmWDAxVzdG10MV90ZXJtaW5hdGVfZmliZXKEAxRzdG10eDJfc3RvcmVfY2xvc3VyZYUDE2V4cHJ4MV9sb2FkX2Nsb3N1cmWGAxJleHByeF9tYWtlX2Nsb3N1cmWHAxBleHByMV90eXBlb2Zfc3RyiAMMZXhwcjBfbm93X21ziQMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZYoDEHN0bXQyX2NhbGxfYXJyYXmLAxBleHByeF9yb2xlX3Byb3RvjAMPZGV2c192bV9wb3BfYXJnjQMTZGV2c192bV9wb3BfYXJnX3UzMo4DE2RldnNfdm1fcG9wX2FyZ19pMzKPAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVykAMSamRfYWVzX2NjbV9lbmNyeXB0kQMSamRfYWVzX2NjbV9kZWNyeXB0kgMMQUVTX2luaXRfY3R4kwMPQUVTX0VDQl9lbmNyeXB0lAMQamRfYWVzX3NldHVwX2tleZUDDmpkX2Flc19lbmNyeXB0lgMQamRfYWVzX2NsZWFyX2tleZcDC2pkX3dzc2tfbmV3mAMUamRfd3Nza19zZW5kX21lc3NhZ2WZAxNqZF93ZWJzb2NrX29uX2V2ZW50mgMHZGVjcnlwdJsDDWpkX3dzc2tfY2xvc2WcAxBqZF93c3NrX29uX2V2ZW50nQMKc2VuZF9lbXB0eZ4DEndzc2toZWFsdGhfcHJvY2Vzc58DF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxloAMUd3Nza2hlYWx0aF9yZWNvbm5lY3ShAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSiAw9zZXRfY29ubl9zdHJpbmejAxFjbGVhcl9jb25uX3N0cmluZ6QDD3dzc2toZWFsdGhfaW5pdKUDE3dzc2tfcHVibGlzaF92YWx1ZXOmAxB3c3NrX3B1Ymxpc2hfYmlupwMRd3Nza19pc19jb25uZWN0ZWSoAxN3c3NrX3Jlc3BvbmRfbWV0aG9kqQMccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZaoDFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWrAw9yb2xlbWdyX3Byb2Nlc3OsAxByb2xlbWdyX2F1dG9iaW5krQMVcm9sZW1ncl9oYW5kbGVfcGFja2V0rgMUamRfcm9sZV9tYW5hZ2VyX2luaXSvAxhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSwAw1qZF9yb2xlX2FsbG9jsQMQamRfcm9sZV9mcmVlX2FsbLIDFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmSzAxJqZF9yb2xlX2J5X3NlcnZpY2W0AxNqZF9jbGllbnRfbG9nX2V2ZW50tQMTamRfY2xpZW50X3N1YnNjcmliZbYDFGpkX2NsaWVudF9lbWl0X2V2ZW50twMUcm9sZW1ncl9yb2xlX2NoYW5nZWS4AxBqZF9kZXZpY2VfbG9va3VwuQMYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlugMTamRfc2VydmljZV9zZW5kX2NtZLsDEWpkX2NsaWVudF9wcm9jZXNzvAMOamRfZGV2aWNlX2ZyZWW9AxdqZF9jbGllbnRfaGFuZGxlX3BhY2tldL4DD2pkX2RldmljZV9hbGxvY78DD2pkX2N0cmxfcHJvY2Vzc8ADFWpkX2N0cmxfaGFuZGxlX3BhY2tldMEDDGpkX2N0cmxfaW5pdMIDDWpkX2lwaXBlX29wZW7DAxZqZF9pcGlwZV9oYW5kbGVfcGFja2V0xAMOamRfaXBpcGVfY2xvc2XFAxJqZF9udW1mbXRfaXNfdmFsaWTGAxVqZF9udW1mbXRfd3JpdGVfZmxvYXTHAxNqZF9udW1mbXRfd3JpdGVfaTMyyAMSamRfbnVtZm10X3JlYWRfaTMyyQMUamRfbnVtZm10X3JlYWRfZmxvYXTKAxFqZF9vcGlwZV9vcGVuX2NtZMsDFGpkX29waXBlX29wZW5fcmVwb3J0zAMWamRfb3BpcGVfaGFuZGxlX3BhY2tldM0DEWpkX29waXBlX3dyaXRlX2V4zgMQamRfb3BpcGVfcHJvY2Vzc88DFGpkX29waXBlX2NoZWNrX3NwYWNl0AMOamRfb3BpcGVfd3JpdGXRAw5qZF9vcGlwZV9jbG9zZdIDDWpkX3F1ZXVlX3B1c2jTAw5qZF9xdWV1ZV9mcm9udNQDDmpkX3F1ZXVlX3NoaWZ01QMOamRfcXVldWVfYWxsb2PWAw1qZF9yZXNwb25kX3U41wMOamRfcmVzcG9uZF91MTbYAw5qZF9yZXNwb25kX3UzMtkDEWpkX3Jlc3BvbmRfc3RyaW5n2gMXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTbAwtqZF9zZW5kX3BrdNwDHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs3QMXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLeAxlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V03wMUamRfYXBwX2hhbmRsZV9wYWNrZXTgAxVqZF9hcHBfaGFuZGxlX2NvbW1hbmThAxNqZF9hbGxvY2F0ZV9zZXJ2aWNl4gMQamRfc2VydmljZXNfaW5pdOMDDmpkX3JlZnJlc2hfbm935AMZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOUDFGpkX3NlcnZpY2VzX2Fubm91bmNl5gMXamRfc2VydmljZXNfbmVlZHNfZnJhbWXnAxBqZF9zZXJ2aWNlc190aWNr6AMVamRfcHJvY2Vzc19ldmVyeXRoaW5n6QMaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXqAxJhcHBfZ2V0X2Z3X3ZlcnNpb27rAxZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l7AMNamRfaGFzaF9mbnYxYe0DDGpkX2RldmljZV9pZO4DCWpkX3JhbmRvbe8DCGpkX2NyYzE28AMOamRfY29tcHV0ZV9jcmPxAw5qZF9zaGlmdF9mcmFtZfIDDmpkX3Jlc2V0X2ZyYW1l8wMQamRfcHVzaF9pbl9mcmFtZfQDDWpkX3BhbmljX2NvcmX1AxNqZF9zaG91bGRfc2FtcGxlX21z9gMQamRfc2hvdWxkX3NhbXBsZfcDCWpkX3RvX2hlePgDC2pkX2Zyb21faGV4+QMOamRfYXNzZXJ0X2ZhaWz6AwdqZF9hdG9p+wMLamRfdnNwcmludGb8Aw9qZF9wcmludF9kb3VibGX9AwpqZF9zcHJpbnRm/gMSamRfZGV2aWNlX3Nob3J0X2lk/wMMamRfc3ByaW50Zl9hgAQLamRfdG9faGV4X2GBBBRqZF9kZXZpY2Vfc2hvcnRfaWRfYYIECWpkX3N0cmR1cIMEDmpkX2pzb25fZXNjYXBlhAQTamRfanNvbl9lc2NhcGVfY29yZYUECWpkX21lbWR1cIYEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWHBBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVliAQRamRfc2VuZF9ldmVudF9leHSJBApqZF9yeF9pbml0igQUamRfcnhfZnJhbWVfcmVjZWl2ZWSLBB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja4wED2pkX3J4X2dldF9mcmFtZY0EE2pkX3J4X3JlbGVhc2VfZnJhbWWOBBFqZF9zZW5kX2ZyYW1lX3Jhd48EDWpkX3NlbmRfZnJhbWWQBApqZF90eF9pbml0kQQHamRfc2VuZJIEFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOTBA9qZF90eF9nZXRfZnJhbWWUBBBqZF90eF9mcmFtZV9zZW50lQQLamRfdHhfZmx1c2iWBBBfX2Vycm5vX2xvY2F0aW9ulwQMX19mcGNsYXNzaWZ5mAQFZHVtbXmZBAhfX21lbWNweZoEB21lbW1vdmWbBAZtZW1zZXScBApfX2xvY2tmaWxlnQQMX191bmxvY2tmaWxlngQEZm1vZJ8EDF9fc3RkaW9fc2Vla6AEDV9fc3RkaW9fd3JpdGWhBA1fX3N0ZGlvX2Nsb3NlogQMX19zdGRpb19leGl0owQKY2xvc2VfZmlsZaQECF9fdG9yZWFkpQQJX190b3dyaXRlpgQJX19md3JpdGV4pwQGZndyaXRlqAQrZW1zY3JpcHRlbl9tYWluX3RocmVhZF9wcm9jZXNzX3F1ZXVlZF9jYWxsc6kEFF9fcHRocmVhZF9tdXRleF9sb2NrqgQWX19wdGhyZWFkX211dGV4X3VubG9ja6sEBl9fbG9ja6wEDl9fbWF0aF9kaXZ6ZXJvrQQOX19tYXRoX2ludmFsaWSuBANsb2evBAVsb2cxMLAEB19fbHNlZWuxBAZtZW1jbXCyBApfX29mbF9sb2NrswQMX19tYXRoX3hmbG93tAQKZnBfYmFycmllcrUEDF9fbWF0aF9vZmxvd7YEDF9fbWF0aF91Zmxvd7cEBGZhYnO4BANwb3e5BAhjaGVja2ludLoEC3NwZWNpYWxjYXNluwQFcm91bmS8BAZzdHJjaHK9BAtfX3N0cmNocm51bL4EBnN0cmNtcL8EBnN0cmxlbsAEB19fdWZsb3fBBAdfX3NobGltwgQIX19zaGdldGPDBAdpc3NwYWNlxAQGc2NhbGJuxQQJY29weXNpZ25sxgQHc2NhbGJubMcEDV9fZnBjbGFzc2lmeWzIBAVmbW9kbMkEBWZhYnNsygQLX19mbG9hdHNjYW7LBAhoZXhmbG9hdMwECGRlY2Zsb2F0zQQHc2NhbmV4cM4EBnN0cnRveM8EBnN0cnRvZNAEEl9fd2FzaV9zeXNjYWxsX3JldNEECGRsbWFsbG9j0gQGZGxmcmVl0wQYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl1AQEc2Jya9UECF9fYWRkdGYz1gQJX19hc2hsdGkz1wQHX19sZXRmMtgEB19fZ2V0ZjLZBAhfX2RpdnRmM9oEDV9fZXh0ZW5kZGZ0ZjLbBA1fX2V4dGVuZHNmdGYy3AQLX19mbG9hdHNpdGbdBA1fX2Zsb2F0dW5zaXRm3gQNX19mZV9nZXRyb3VuZN8EEl9fZmVfcmFpc2VfaW5leGFjdOAECV9fbHNocnRpM+EECF9fbXVsdGYz4gQIX19tdWx0aTPjBAlfX3Bvd2lkZjLkBAhfX3N1YnRmM+UEDF9fdHJ1bmN0ZmRmMuYECXN0YWNrU2F2ZecEDHN0YWNrUmVzdG9yZegECnN0YWNrQWxsb2PpBBVlbXNjcmlwdGVuX3N0YWNrX2luaXTqBBllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl6wQZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZewEGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZO0EDGR5bkNhbGxfamlqae4EFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnvBBhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHtBAQABGZwdHIBATACATEDATIHLQMAD19fc3RhY2tfcG9pbnRlcgELX19zdGFja19lbmQCDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
