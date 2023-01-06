
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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9AEhAgJAIABBARD0ASIDRQ0AIAIgA28hAQsgACABEPcBCxYAIAAgAEEAEPQBIABBARD0AWwQ9wELCQAgAEEBEKYBC/ACAgR/AnwjAEEwayICJAAgAiAAQcgAaikDADcDKCACIABB0ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEKkCIQMgAiACKQMgNwMQIAAgAkEQahCpAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoApgBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQqAIhBiACIAIpAyA3AwAgACACEKgCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCmAFBACkD6E83AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKYASABKQMANwMgIAJBMGokAAsJACAAQQAQpgELqAECA38BfiMAQSBrIgEkACABIABByABqKQMANwMYIAEgAEHQAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahDpASECIAEgASkDEDcDACAAIAEQ7AEiA0UNACACRQ0AAkAgAygCAEGAgID4AHFBgICAyABHDQAgACACIAMoAgQQ2QELIAAgAiADENkBCyAAKAKYASABKQMYNwMgIAFBIGokAAsJACAAQQEQqgELvQECA38BfiMAQTBrIgIkACACIABByABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEOwBIgNFDQAgAEEAEH8iBEUNACACQSBqIABBCCAEEKcCIAIgAikDIDcDECAAIAJBEGoQfAJAIAMoAgBBgICA+ABxQYCAgMgARw0AIAAgAygCBCAEIAEQ3QELIAAgAyAEIAEQ3QEgAiACKQMgNwMIIAAgAkEIahB9IAAoApgBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQqgELqwEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcwwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHMLQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCABIAIvARIQuwJFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBEGokAAucAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCyADIAJBCGpBCBCBBDYCACAAIAFBrREgAxCWAgsgA0EQaiQAC6QBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIANBCGogAikDCBD/AyADIANBCGo2AgAgACABQa4UIAMQlgILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABUQpQILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARAQpQILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABQQpQILIANBEGokAAuOAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAEL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AEGtARBzQQAhAgsCQCABKAIMQf//AUcNACABQRhqIABBrgEQc0EAIQILAkAgAkUNACAAIAIQvgEgACABKAIMIAIvAQJB/x9xQYDAAHIQywELIAFBIGokAAuHAQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMAIAMgBDcDEAJAIAEgAyADQQxqEOEBIgINACADQRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCDCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EgaiQAC3ACAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDhASICDQAgA0EYaiABQa0BEHNBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQSBqJAALbQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMAIAMgBDcDEAJAIAEgAyADQQxqEOEBIgINACADQRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BAkH/H3EQpQILIANBIGokAAuJAQICfwF+IwBBIGsiASQAIAEgACkDQCIDNwMAIAEgAzcDEAJAIAAgASABQQxqEOEBIgINACABQRhqIABBrQEQc0EAIQILAkAgASgCDEH//wFHDQAgAUEYaiAAQa4BEHNBACECCwJAIAJFDQAgACACEL4BIAAgASgCDCACLwECEMsBCyABQSBqJAALaQECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADQQhqIAFBowEQcyAAQgA3AwAMAQsgACABKAKgASACKAIAQQxsaigCACgCEEEARxCmAgsgA0EQaiQAC88BAgR/An4jAEEgayIBJAACQAJAIAApA0AiBUKAgICA8IGA+P8Ag0KAgICAIFENACABQRhqIABBvQEQcwwBCyAAQQAQ9AEhAiABIABB0ABqKQMAIgY3AxggASAGNwMAIAAgASABQRRqEK4CIQMCQCACQYCABEkNACABQQhqIABBvgEQcwwBCwJAIAEoAhQiBEHtAUkNACABQQhqIABBvwEQcwwBCyAAQdwBaiAEOgAAIABB4AFqIAMgBBCaBBogACAFpyACEMsBCyABQSBqJAALRgEBfyMAQRBrIgMkACADIAIpAwA3AwACQAJAIAEgAyADQQxqEJMCRQ0AIAAgAygCDBClAgwBCyAAQgA3AwALIANBEGokAAtyAgN/AX4jAEEgayIBJAAgASAAKQNAIgQ3AwggASAENwMQAkAgACABQQhqIAFBHGoQkwIiAkUNAAJAIABBABD0ASIDIAEoAhxJDQAgACgCmAFBACkD6E83AyAMAQsgACACIANqLQAAEPcBCyABQSBqJAALUAECfyMAQSBrIgEkACABIAApA0A3AxAgAEEAEPQBIQIgASABKQMQNwMIIAFBGGogACABQQhqIAIQ7wEgACgCmAEgASkDGDcDICABQSBqJAAL0QIBA38CQAJAIAAvAQgNAAJAAkAgACgCoAEgAUEMbGooAgAoAhAiBUUNACAAQcwDaiIGIAEgAiAEEP8BIgdFDQAgBygCBEGg9zYgAyADQd+ISWpB4IhJSRtqIAAoArABTw0BIAYgBxD7AQsgACgCmAEiAEUNAiAAIAI7ARQgACABOwESIAAgBDsBCCAAQQpqQRQ7AQAgACAALQAQQfABcUEBcjoAECAAQQAQZw8LIAYgBxD9ASEBIABB2AFqQgA3AwAgAEIANwPQASAAQd4BaiABLwECOwEAIABB3AFqIAEtABQ6AAAgAEHdAWogBS0ABDoAACAAQdQBaiAFQQAgBS0ABGtBDGxqQWRqKQMANwIAIABB4AFqIQIgAUEIaiEAAkAgAS0AFCIBQQpJDQAgACgCACEACyACIAAgARCaBBoLDwtBlDRB3y9BKUHhFBD6AwALMwACQCAALQAQQQ9xQQJHDQAgACgCLCAAKAIIEFMLIABCADcDCCAAIAAtABBB8AFxOgAQC5cCAQJ/AkACQCAALwEIDQACQCACQYBgcUGAwABHDQAgAEHMA2oiAyABIAJB/59/cUGAIHJBABD/ASIERQ0AIAMgBBD7AQsgACgCmAEiA0UNAQJAIAAoAJABIgQgBCgCOGogAUEDdGooAgBB7fLZjAFHDQAgA0EAEGcgAEHoAWpCfzcDACAAQeABakJ/NwMAIABB2AFqQn83AwAgAEJ/NwPQASAAIAEQzAEPCyADIAI7ARQgAyABOwESIABB3AFqLQAAIQEgAyADLQAQQfABcUECcjoAECADIAAgARB5IgI2AggCQCACRQ0AIAMgAToADCACIABB4AFqIAEQmgQaCyADQQAQZwsPC0GUNEHfL0HMAEHJJRD6AwALnAICAn8BfiMAQTBrIgIkAAJAIAAoApwBIgNFDQADQAJAIAMvARIgAUcNACADIAMtABBBIHI6ABALIAMoAgAiAw0ACwsgAiABNgIoIAJBAjYCLCACQRhqQeEAEJQCIAIgAikDKDcDCCACIAIpAxg3AwAgAkEgaiAAIAJBCGogAhDuAQJAIAIpAyAiBFANACAAIAQ3A0AgAEECOgAzIAJBEGogACABEM4BIABByABqIAIpAxA3AwAgAEEBQQEQbyIDRQ0AIAMgAy0AEEEgcjoAEAsCQCAAKAKcASIDRQ0AA0ACQCADLQAQIgFBIHFFDQAgAyABQd8BcToAECADEHEgACgCnAEiAw0BDAILIAMoAgAiAw0ACwsgAkEwaiQACysAIABCfzcD0AEgAEHoAWpCfzcDACAAQeABakJ/NwMAIABB2AFqQn83AwALkQIBA38jAEEgayIDJAACQAJAIAFB3QFqLQAAQf8BRw0AIABCADcDAAwBCwJAIAFBIEEKEHgiBA0AIABCADcDAAwBCyADQRhqIAFBCCAEEKcCIAMgAykDGDcDECABIANBEGoQfCAEIAEgAUHcAWotAAAQgAEiBTYCHAJAIAUNACADIAMpAxg3AwAgASADEH0gAEIANwMADAELIAVBDGogAUHgAWogBS8BBBCaBBogBCABQdQBaikCADcDCCAEIAEtAN0BOgAVIAQgAUHeAWovAQA7ARAgAUHTAWotAAAhBSAEIAI7ARIgBCAFOgAUIAMgAykDGDcDCCABIANBCGoQfSAAIAMpAxg3AwALIANBIGokAAukAQECfwJAAkAgAC8BCA0AIAAoApgBIgJFDQEgAkH//wM7ARIgAiACLQAQQfABcUEDcjoAECACIAAoArwBIgM7ARQgACADQQFqNgK8ASACIAEpAwA3AwggAkEBENABRQ0AAkAgAi0AEEEPcUECRw0AIAIoAiwgAigCCBBTCyACQgA3AwggAiACLQAQQfABcToAEAsPC0GUNEHfL0HoAEHuHBD6AwAL3wIBB38jAEEgayICJAACQAJAAkAgAC8BFCIDIAAoAiwiBCgCwAEiBUH//wNxRg0AIAENACAAQQMQZwwBCyACIAApAwg3AxAgBCACQRBqIAJBHGoQkwIhBiAEQeEBakEAOgAAIARB4AFqIgcgAzoAAAJAIAIoAhxB6wFJDQAgAkHqATYCHAsgByAGIAIoAhwiCBCaBBogBEHeAWpBggE7AQAgBEHcAWoiByAIQQJqOgAAIARB3QFqIAQtAMwBOgAAIARB1AFqEO4DNwIAIARB0wFqQQA6AAAgBEHSAWogBy0AAEEHakH8AXE6AAACQCABRQ0AIAIgBjYCAEGSFCACEC0LQQEhASAELQAGQQJxRQ0BAkAgAyAFQf//A3FHDQACQCAEQdABahDcAw0AQQEhASAEIAQoAsABQQFqNgLAAQwDCyAAQQMQZwwBCyAAQQMQZwtBACEBCyACQSBqJAAgAQv6BQIHfwF+IwBBEGsiASQAAkACQCAALQAQQQ9xIgINAEEBIQIMAQsCQAJAAkACQAJAAkAgAkF/ag4DAAECAwsgACgCLCICKAKgASAALwESIgNBDGxqKAIAKAIQIgRFDQQCQCACQdMBai0AAEEBcQ0AIAJB3gFqLwEAIgVFDQAgBSAALwEURw0AIAQtAAQiBSACQd0Bai0AAEcNACAEQQAgBWtBDGxqQWRqKQMAIAJB1AFqKQIAUg0AIAIgAyAALwEIENIBIgRFDQAgAkHMA2ogBBD9ARpBASECDAYLAkAgACgCGCACKAKwAUsNACABQQA2AgxBACEDAkAgAC8BCCIERQ0AIAIgBCABQQxqELoCIQMLIAJB0AFqIQUgAC8BFCEGIAAvARIhByABKAIMIQQgAkEBOgDTASACQdIBaiAEQQdqQfwBcToAACACKAKgASAHQQxsaigCACgCECIHQQAgBy0ABCIHa0EMbGpBZGopAwAhCCACQd4BaiAGOwEAIAJB3QFqIAc6AAAgAkHcAWogBDoAACACQdQBaiAINwIAAkAgA0UNACACQeABaiADIAQQmgQaCyAFENwDIgRFIQIgBA0EAkAgAC8BCiIDQecHSw0AIAAgA0EBdDsBCgsgACAALwEKEGcgBA0GC0EAIQIMBQsgACgCLCICKAKgASAALwESQQxsaigCACgCECIDRQ0DIABBDGotAAAhBCAAKAIIIQUgAC8BFCEGIAJB0wFqQQE6AAAgAkHSAWogBEEHakH8AXE6AAAgA0EAIAMtAAQiB2tBDGxqQWRqKQMAIQggAkHeAWogBjsBACACQd0BaiAHOgAAIAJB3AFqIAQ6AAAgAkHUAWogCDcCAAJAIAVFDQAgAkHgAWogBSAEEJoEGgsCQCACQdABahDcAyICDQAgAkUhAgwFCyAAQQMQZ0EAIQIMBAsgAEEAENABIQIMAwtB3y9B9gJBgxgQ9QMACyAAQQMQZwwBC0EAIQIgAEEAEGYLIAFBEGokACACC54CAQZ/IwBBEGsiAyQAIABB4AFqIQQgAEHcAWotAAAhBQJAAkACQCACRQ0AIAAgAiADQQxqELoCIQYCQAJAIAMoAgwiB0EBaiIIIAAtANwBSg0AIAQgB2otAAANACAGIAQgBxCyBEUNAQtBACEICyAIRQ0BIAUgCGshBSAEIAhqIQQLQQAhCAJAIABBzANqIgYgASAAQd4Bai8BACACEP8BIgdFDQACQCAFIActABRHDQAgByEIDAELIAYgBxD7AQsCQCAIDQAgBiABIAAvAd4BIAUQ/gEiCCACOwEWCyAIQQhqIQICQCAILQAUQQpJDQAgAigCACECCyACIAQgBRCaBBogCCAAKQOwAT4CBAwBC0EAIQgLIANBEGokACAIC7wCAQR/AkAgAC8BCA0AIABB0AFqIAIgAi0ADEEQahCaBBoCQCAAKACQAUE8aigCACICQQhJDQAgAkEDdiICQQEgAkEBSxshAyAAQcwDaiEEQQAhBQNAAkAgACgCoAEgBUEMbGooAgAoAhAiAkUNAAJAAkAgAC0A3QEiBg0AIAAvAd4BRQ0BCyACLQAEIAZHDQELIAJBACACLQAEa0EMbGpBZGopAwAgACkC1AFSDQAgABByAkAgAC0A0wFBAXENAAJAIAAtAN0BQTFPDQAgAC8B3gFB/4ECcUGDgAJHDQAgBCAFIAAoArABQfCxf2oQgAIMAQtBACECA0AgBCAFIAAvAd4BIAIQggIiAkUNASAAIAIvAQAgAi8BFhDSAUUNAAsLIAAgBRDMAQsgBUEBaiIFIANHDQALCyAAEHQLC8gBAQN/AkAgAC8BBiICQQRxDQACQCACQQhxDQAgARCqAyECIABBxQAgARCrAyACEE0LAkAgACgAkAFBPGooAgAiAkEISQ0AIAJBA3YiAkEBIAJBAUsbIQMgACgCoAEhBEEAIQIDQAJAIAQgAkEMbGooAgAgAUcNACAAQcwDaiACEIECIABB6AFqQn83AwAgAEHgAWpCfzcDACAAQdgBakJ/NwMAIABCfzcD0AEgACACEMwBDAILIAJBAWoiAiADRw0ACwsgABB0CwvcAQEGfyMAQRBrIgEkACAAIAAvAQZBBHI7AQYQsgMgACAALwEGQfv/A3E7AQYCQCAAKACQAUE8aigCACICQQhJDQAgAEGQAWohAyACQQN2IgJBASACQQFLGyEEQQAhAgNAIAAoAJABIgUoAjghBiABIAMoAgA2AgwgAUEMaiACEGwgBSAGaiACQQN0aiIGKAIAELEDIQUgACgCoAEgAkEMbGogBTYCAAJAIAYoAgBB7fLZjAFHDQAgBSAFLQAMQQFyOgAMCyACQQFqIgIgBEcNAAsLELMDIAFBEGokAAshACAAIAAvAQZBBHI7AQYQsgMgACAALwEGQfv/A3E7AQYLNgEBfyAALwEGIQICQCABRQ0AIAAgAkECcjsBBg8LIAAgAkH9/wNxOwEGIAAgACgCvAE2AsABCwkAQQAoAvS7AQvZAgEEfyMAQTBrIgMkAAJAIAIgACgCkAEiBCAEKAJgamsgBC8BDkEEdEkNAAJAAkAgAkGgxgBrQQxtQRtLDQAgAigCCCICLwEAIgRFDQEDQCADQShqIARB//8DcRCUAiADIAIvAQI2AiAgA0EDNgIkIAMgAykDKDcDCCADIAMpAyA3AwAgACABIANBCGogAxDaASACLwEEIQQgAkEEaiECIAQNAAwCCwALAkACQCACDQBBACEEDAELIAItAANBD3EhBAsCQAJAIARBfGoOBgEAAAAAAQALQY4/QaQrQTtB5BcQ+gMACyACLwEIIgRFDQAgBEEBdCEFIAIoAgwhBEEAIQIDQCADIAQgAkEDdCIGaikDADcDGCADIAQgBkEIcmopAwA3AxAgACABIANBGGogA0EQahDaASACQQJqIgIgBUkNAAsLIANBMGokAA8LQaQrQTJB5BcQ9QMAC6YCAQN/IwBBIGsiBCQAIAQgAikDADcDEAJAAkACQCAAIAEgBEEQahDcASIFRQ0AIAUgAykDADcDAAwBCyAEIAIpAwA3AwgCQCAAIARBCGoQkQINACAEQRhqIABBlQEQcwsgAS8BCiIFIAEvAQgiBkkNAQJAIAUgBkcNACABIAVBCmxBA3YiBUEEIAVBBEobIgU7AQogACAFQQR0EHkiBUUNAQJAIAEvAQgiBkUNACAFIAEoAgwgBkEEdBCaBBoLIAEgBTYCDCAAKALIASAFEHoLIAEoAgwgAS8BCEEEdGogAikDADcDACABKAIMIAEvAQhBBHRqQQhqIAMpAwA3AwAgASABLwEIQQFqOwEICyAEQSBqJAAPC0HpG0GkK0H9AEGHDhD6AwALHAAgASAAKAKQASIAIAAoAmBqayAALwEOQQR0SQu1AgIHfwF+IwBBIGsiAyQAIAMgAikDADcDEEEAIQQCQCAAIANBEGoQkQJFDQBBACEFIAEvAQgiBkEARyEHIAZBAXQhCCABKAIMIQECQAJAIAYNAAwBCyACKAIAIQkgAikDACEKA0ACQCABIAVBA3RqIgQoAAAgCUcNACAEKQMAIApSDQAgASAFQQN0QQhyaiEEDAILIAVBAmoiBSAISSIHDQALCyAHQQFxDQAgAyACKQMANwMIQQAhBCAAIANBCGogA0EcahCTAiEJIAZFDQADQCADIAEgBEEDdGopAwA3AwAgACADIANBGGoQkwIhBQJAIAMoAhggAygCHCIHRw0AIAkgBSAHELIEDQAgASAEQQN0QQhyaiEEDAILIARBAmoiBCAISQ0AC0EAIQQLIANBIGokACAEC70DAQV/IwBBEGsiBCQAAkACQAJAIAEgACgCkAEiBSAFKAJgamsgBS8BDkEEdEkNACACLwEIIQYCQCABQaDGAGtBDG1BG0sNACABKAIIIgchBQNAIAUiCEEEaiEFIAgvAQANAAsCQCAAIAIgBiAIIAdrQQJ1EN4BRQ0AIARBCGogAEGqARBzDAQLIAEoAggiBS8BAEUNAwNAIAIoAgwgBkEDdGohCAJAAkAgA0UNACAEQQhqIAUvAQAQlAIgCCAEKQMINwMADAELIAggBTMBAkKAgICAMIQ3AwALIAZBAWohBiAFLwEEIQggBUEEaiEFIAgNAAwECwALAkACQCABDQBBACEFDAELIAEtAANBD3EhBQsCQAJAIAVBfGoOBgEAAAAAAQALQY4/QaQrQd4AQakQEPoDAAsgASgCDCEIIAAgAiAGIAEvAQgiBRDeAQ0BIAVFDQIgBUEBdCEBIANBAXMhA0EAIQUDQCACKAIMIAZBA3RqIAggBSADckEDdGopAwA3AwAgBkEBaiEGIAVBAmoiBSABSQ0ADAMLAAtBpCtByQBBqRAQ9QMACyAEQQhqIABBqgEQcwsgBEEQaiQAC68CAQV/QXwhBAJAIANBgDxKDQBBACEEQQAgAS8BCCIFayADIAUgA2oiBkEASBsiB0UNACAGQQAgBkEAShshA0F6IQQgA0GAPEsNAAJAIAMgAS8BCk0NAAJAIAAgA0EKbEEDdiIEQQQgBEEEShsiBkEDdBB5IgQNAEF7DwsCQCABKAIMIghFDQAgBCAIIAEvAQhBA3QQmgQaCyABIAY7AQogASAENgIMIAAoAsgBIAQQegsgAS8BCCAFIAIgBSACSRsiBGshAgJAAkAgB0F/Sg0AIAEoAgwgBEEDdGoiBCAEIAdBA3RrIAIgB2oQmwQaDAELIAEoAgwgBEEDdCIEaiIFIAdBA3QiAGogBSACEJsEGiABKAIMIARqQQAgABCcBBoLIAEgAzsBCEEAIQQLIAQLfQEDfyMAQRBrIgMkACADIAIpAwA3AwgCQAJAIAAgASADQQhqENwBIgANAEF/IQIMAQsgASABLwEIIgRBf2o7AQhBACECIAQgAEF4aiIFIAEoAgxrQQN1QQF2QX9zaiIBRQ0AIAUgAEEIaiABQQR0EJsEGgsgA0EQaiQAIAIL/QEBA38CQCABQRtLDQACQAJAQa79/yogAXZBAXEiAg0AAkAgACgCpAENACAAQSAQeSEDIABBCDoANCAAIAM2AqQBIAMNAEEAIQMMAQsgAUGQwwBqLQAAQX9qIgRBCE8NASAAKAKkASAEQQJ0aigCACIDDQACQCAAQQlBEBB4IgMNAEEAIQMMAQsgACgCpAEgBEECdGogAzYCACADQaDGACABQQxsaiIAQQAgACgCCBs2AgQLAkAgAkUNACABQRxPDQJBoMYAIAFBDGxqIgFBACABKAIIGyEDCyADDwtBuTNBpCtBywFBlBkQ+gMAC0GXMkGkK0GuAUGtGRD6AwALbgECfwJAIAJFDQAgAkH//wE2AgALQQAhAwJAIAEoAgQiBEGAgMD/B3ENACAEQQ9xQQZHDQAgASgCACEBAkAgAkUNACACIAFB//8BcTYCAAsgACgAkAEiAiACKAJgaiABQQ12Qfz/H3FqIQMLIAMLhwEBBH9BACECAkAgACgAkAEiA0E8aigCAEEDdiABTQ0AIAMvAQ4iBEUNACAAKACQASICIAIoAjhqIAFBA3RqKAIAIQAgAiACKAJgaiEFQQAhAQNAIAUgAUEEdGoiAyACIAMoAgQiAyAARhshAiADIABGDQEgAUEBaiIBIARHDQALQQAhAgsgAgulBQEMfyMAQSBrIgQkACABQZABaiEFAkADQAJAAkACQAJAAkACQAJAAkAgAkUNACACIAEoApABIgYgBigCYGoiB2sgBi8BDkEEdE8NASAHIAIvAQpBAnRqIQggAi8BCCEJAkAgAygCBCIGQYCAwP8HcQ0AIAZBD3FBBEcNAEEAIQogCUEARyEGAkAgCUUNAEEBIQsgCCEMAkACQCADKAIAIg0gCC8BAEYNAANAIAsiBiAJRg0CIAZBAWohCyANIAggBkEDdGoiDC8BAEcNAAsgBiAJSSEGCyAMIAdrIgtBgIACTw0FIABBBjYCBCAAIAtBDXRB//8BcjYCAEEBIQoMAQsgBiAJSSEGCyAGDQgLIAQgAykDADcDECABIARBEGogBEEYahCTAiEOIAQoAhhFDQNBACEGIAlBAEchB0EJIQoCQCAJRQ0AA0AgCCAGQQN0aiIPLwEAIQsgBCgCGCEMIAQgBSgCADYCDCAEQQxqIAsgBEEcahC5AiELAkAgDCAEKAIcIg1HDQAgCyAOIA0QsgQNACAPIAEoAJABIgYgBigCYGprIgZBgIACTw0HIABBBjYCBCAAIAZBDXRB//8BcjYCAEEBIQoMAgsgBkEBaiIGIAlJIQcgBiAJRw0ACwsCQCAHQQFxRQ0AIAIhBgwHC0EAIQpBACEGIAIoAgRB8////wFGDQYgAi8BAkEPcSIGQQJPDQUgASgAkAEiCSAJKAJgaiAGQQR0aiEGQQAhCgwGCyAAQgA3AwAMCAtBnz9BpCtBkgJB2hYQ+gMAC0HrP0GkK0HpAUG3KhD6AwALIABCADcDAEEBIQogAiEGDAILQes/QaQrQekBQbcqEPoDAAtBuDJBpCtBjAJBwyoQ+gMACyAGIQILIApFDQALCyAEQSBqJAAL6AIBBH8jAEEQayIEJAACQCACRQ0AIAIoAgBBgICA+ABxQYCAgPgARw0AAkADQAJAAkACQCACRQ0AIAIoAgghBQJAAkAgAygCBCIGQYCAwP8HcQ0AIAZBD3FBBEcNACADKAIAIgdBgIB/cUGAgAFHDQAgBS8BACIGRQ0BIAdB//8AcSEHA0ACQCAHIAZB//8DcUcNACAAIAUvAQI2AgAMBgsgBS8BBCEGIAVBBGohBSAGDQAMAgsACyAEIAMpAwA3AwAgASAEIARBDGoQkwIhByAEKAIMIAcQwARHDQIgBS8BACIGRQ0AA0ACQCAGQf//A3EQuAIgBxC/BA0AIAAgBS8BAjYCAAwFCyAFLwEEIQYgBUEEaiEFIAYNAAsLIAIoAgQhAkEBDQMMBAsgAEIANwMADAMLIABCADcDAEEADQEMAgsgAEEDNgIEQQANAAsLIARBEGokAA8LQe09QaQrQa8CQcgWEPoDAAvVBQIFfwJ+IwBBEGsiBCQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECADKAIEIgVBD3EgBUGAgMD/B3EbIgVBfWoOBwMCAgACAgECCwJAIAIoAgQiBkGAgMD/B3ENACAGQQ9xQQJHDQAgAigCACICQYCAAk8NBSADKAIAIQMgAEEGNgIEIAAgA0GAgH5xIAJyNgIADAQLIAVBfWoOBwIBAQEBAQABCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeCIDDQAgAEIANwMADAMLIAMgCjcDECADIAk3AwggACABQQggAxCnAgwCCyAAIAMpAwA3AwAMAQsCQAJAIAMoAgAiBkGw+XxqIgVBAEgNACAFQQAvAbCvAU4NBEGQyQAgBUEDdGoiBy0AA0EBcUUNASAHLQACDQUgBCACKQMANwMIIAAgASAEQQhqQZDJACAFQQN0aigCBBEBAAwCCyAGIAEoAJABQSRqKAIAQQR2Tw0FCwJAIAZB//8DSw0AAkACQEEQIAIoAgQiBUEPcSAFQYCAwP8HcSIHGyIIDgkAAAAAAAIAAgECCyAHDQcgAigCACIDQYCAgIABTw0IIAVB8P8/cQ0JIAAgAyAIQRx0cjYCACAAIAZBBHRBBXI2AgQMAgsgBUHw/z9xDQkgACACKAIANgIAIAAgBkEEdEEKcjYCBAwBCyACKQMAIQkgAykDACEKAkAgAUEHQRgQeCIDDQAgAEIANwMADAELIAMgCjcDECADIAk3AwggACABQQggAxCnAgsgBEEQaiQADwtB1CJBpCtB4gJB5yQQ+gMAC0GAEEGkK0HyAkHnJBD6AwALQY43QaQrQfUCQeckEPoDAAtBiT5BpCtB+wJB5yQQ+gMAC0HrFkGkK0GNA0HnJBD6AwALQZI4QaQrQY4DQeckEPoDAAtByjdBpCtBjwNB5yQQ+gMAC0HKN0GkK0GVA0HnJBD6AwALLwACQCADQYCABEkNAEG9HkGkK0GeA0HdIRD6AwALIAAgASADQQR0QQlyIAIQpwILiQIBA38jAEEQayIEJAAgA0EANgIAIAJCADcDACABKAIAIQVBfyEGAkACQAJAAkACQAJAQRAgASgCBCIBQQ9xIAFBgIDA/wdxG0F9ag4IAAUBBQUEAwIFCyACQgA3AwAgBSEGDAQLIAIgBUEcdq1CIIYgBUH/////AHGthDcDACABQQR2Qf//A3EhBgwDCyACIAWtQoCAgICAAYQ3AwAgAUEEdkH//wNxIQYMAgsgAyAFNgIAIAFBBHZB//8DcSEGDAELIAVFDQAgBSgCAEGAgID4AHFBgICAOEcNACAEIAUpAxA3AwggACAEQQhqIAIgAxDnASEGIAIgBSkDCDcDAAsgBEEQaiQAIAYLoAIBCH8CQCAAKAKgASABQQxsaigCBCICDQACQCAAQQlBEBB4IgINAEEADwtBACEDQQAhBAJAIAAoAJABIgVBPGooAgBBA3YgAU0NAEEAIQQgBS8BDiIGRQ0AIAAoAJABIgUgBSgCOGogAUEDdGooAgAhByAFIAUoAmBqIQhBACEFA0AgCCAFQQR0aiIJIAQgCSgCBCIJIAdGGyEEIAkgB0YNASAFQQFqIgUgBkcNAAtBACEECyACIAQ2AgQgACgAkAFBPGooAgBBCEkNACAAKAKgASIEIAFBDGxqKAIAKAIIIQcDQAJAIAQgA0EMbGoiBSgCACgCCCAHRw0AIAUgAjYCBAsgA0EBaiIDIAAoAJABQTxqKAIAQQN2SQ0ACwsgAgtbAQF/IwBBEGsiAiQAIAIgASkDADcDCAJAIAAgAkEIakEBEOoBIgBFDQACQCAALQADQQ9xQXxqDgYBAAAAAAEAC0G+PUGkK0HyBEGIChD6AwALIAJBEGokACAAC5EFAQR/IwBBEGsiAyQAAkACQAJAAkAgASkDAEIAUg0AIANBCGogAEGlARBzQQAhBAwBCwJAAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F+ag4HAQICAgACAwILIAAoAJABIgQgBCgCYGogASgCAEENdkH8/x9xai8BAiIBQYCgAk8NBEGHAiABQQx2IgF2QQFxRQ0EIAAgAUECdEG4wwBqKAIAIAIQ6wEhBAwDCyAAKAKgASABKAIAIgFBDGxqKAIIIQQgAkECcQ0CIAQNAgJAIAAgARDoASIFDQBBACEEDAMLAkAgAkEBcQ0AIAUhBAwDCyAAEH4iBEUNAiAAKAKgASABQQxsaiAENgIIIAQgBTYCBAwCCyADIAEpAwA3AwACQCAAIAMQsQIiBUECRw0AIAEoAgQNAAJAIAEoAgBBoH9qIgFBG0sNACAAIAEgAkEEchDrASEECyABQRxJDQILQQAhAQJAIAVBCUoNACAFQazDAGotAAAhAQsgAUUNAyAAIAEgAhDrASEEDAELAkACQCABKAIAIgQNAEEAIQEMAQsgBC0AA0EPcSEBC0EGIQZBCCEFAkACQAJAAkACQAJAIAFBfWoOCAQGBQECAwYAAwtBFCEGQRghBQwECyAAQQggAhDrASEEDAQLIABBECACEOsBIQQMAwtBpCtB3ARBhicQ9QMAC0EEIQVBBCEGCwJAIAQgBWoiASgCACIEDQBBACEEIAJBAXFFDQAgASAAEH4iBDYCAAJAIAQNAEEAIQQMAgsgBCAAIAYQ4AE2AgQLIAJBAnENACAEDQAgACAGEOABIQQLIANBEGokACAEDwtBpCtBmQRBhicQ9QMAC0HdOkGkK0G9BEGGJxD6AwALsQEBAn8jAEEQayIDJABBACEEAkAgAkEGcUECRg0AIAAgARDgASEEIAJBAXFFDQACQAJAIAJBBHFFDQACQCAEQaDGAGtBDG1BG0sNACADQQhqIABBqQEQcwwCCwJAAkAgBA0AQQAhAgwBCyAELQADQQ9xIQILAkAgAkF8ag4GAwAAAAADAAtByz1BpCtB1QNBzhcQ+gMACyADQQhqIABBgAEQcwtBACEECyADQRBqJAAgBAsuAQF/IwBBEGsiAiQAIAIgASkDADcDCCAAIAJBCGpBAhDqASEAIAJBEGokACAAC6QCAQN/IwBBIGsiBCQAAkACQCACDQBBACEFDAELA0ACQAJAIAJBoMYAa0EMbUEbSw0AIAQgAykDADcDACAEQRhqIAEgAiAEEOQBQQEhBiAEQRhqIQUMAQsCQCACIAEoApABIgYgBigCYGprIAYvAQ5BBHRPDQAgBCADKQMANwMIIARBGGogASACIARBCGoQ4wFBASEGIARBGGohBQwBCwJAAkAgAi0AA0EPcUF8ag4GAQAAAAABAAtB2j1BpCtBjAVBzyQQ+gMACyAEIAMpAwA3AxBBASEGIAEgAiAEQRBqENwBIgUNACACKAIEIQJBACEFQQAhBgsgBg0BIAINAAsLAkACQCAFDQAgAEIANwMADAELIAAgBSkDADcDAAsgBEEgaiQAC6QBAgJ/AX4jAEEwayIEJAACQCACKQMAQgBSDQAgBCADKQMANwMgIAFBsxogBEEgahCFAiAEQShqIAFBuQEQcwsgBCACKQMAIgY3AxggBCAGNwMoIAEgBEEYakEAEOoBIQUgBCADKQMANwMQIARBKGogASAFIARBEGoQ7QEgBCACKQMANwMIIAQgBCkDKDcDACAAIAEgBEEIaiAEEOUBIARBMGokAAvrAQECfyMAQSBrIgQkAAJAAkAgA0GB4ANJDQAgAEIANwMADAELIAQgAikDADcDEAJAIAEgBEEQaiAEQRxqEK4CIgVFDQAgBCgCHCADTQ0AIAQgAikDADcDACAFIANqIQMCQCABIAQQkQJFDQAgACABQQggASADQQEQggEQpwIMAgsgACADLQAAEKUCDAELIAQgAikDADcDCAJAIAEgBEEIahCvAiIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgAS8BCCADTQ0AIAAgASgCDCADQQN0aikDADcDAAwBCyAAQgA3AwALIARBIGokAAuqAgIBfwF+IwBB4ABrIgQkACAEIAMpAwA3A0ACQAJAIARBwABqEJICRQ0AIAQgAykDADcDCCABIARBCGoQqQIhAyAEIAIpAwA3AwAgACABIAQgAxDvAQwBCyAEIAMpAwA3AzgCQCABIARBOGoQkQJFDQAgBCADKQMANwNQIAQgAikDACIFNwNIAkAgBUIAUg0AIAQgBCkDUDcDMCABQbMaIARBMGoQhQIgBEHYAGogAUG5ARBzCyAEIAQpA0giBTcDKCAEIAU3A1ggASAEQShqQQAQ6gEhAyAEIAQpA1A3AyAgBEHYAGogASADIARBIGoQ7QEgBCAEKQNINwMYIAQgBCkDWDcDECAAIAEgBEEYaiAEQRBqEOUBDAELIABCADcDAAsgBEHgAGokAAvcAgIBfwF+IwBB4ABrIgQkAAJAIAEpAwBCAFINACAEIAIpAwA3A1AgAEGmGiAEQdAAahCFAiAEQdgAaiAAQbgBEHMLIAQgAikDADcDSAJAAkAgBEHIAGoQkgJFDQAgBCACKQMANwMYIAAgBEEYahCpAiECIAQgASkDADcDECAEIAMpAwA3AwggACAEQRBqIAIgBEEIahDyAQwBCyAEIAIpAwA3A0ACQCAAIARBwABqEJECRQ0AIAQgASkDACIFNwMwIAQgBTcDWAJAIAAgBEEwakEBEOoBIgFFDQACQCABLQADQQ9xQXxqDgYBAAAAAAEAC0G+PUGkK0HyBEGIChD6AwALIAFFDQEgBCACKQMANwMoIAQgAykDADcDICAAIAEgBEEoaiAEQSBqENoBDAELIAQgAikDADcDOCAAQbAIIARBOGoQhQIgBEHYAGogAEGcARBzCyAEQeAAaiQAC/cBAQF/IwBBwABrIgQkAAJAAkAgAkGB4ANJDQAgBEE4aiAAQZYBEHMMAQsgBCABKQMANwMoAkAgACAEQShqEKwCRQ0AIAQgASkDADcDECAAIARBEGogBEE0ahCtAiEBAkAgBCgCNCACTQ0AIAQgAykDADcDCCABIAJqIAAgBEEIahCpAjoAAAwCCyAEQThqIABBlwEQcwwBCyAEIAEpAwA3AyACQCAAIARBIGoQrwIiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AIAQgAykDADcDGCAAIAEgAiAEQRhqEPMBDAELIARBOGogAEGYARBzCyAEQcAAaiQAC8wBAQV/IwBBEGsiBCQAAkACQCACQYE8SQ0AIARBCGogAEGZARBzDAELAkACQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBCG0iBkEEIAZBBEobIgdBA3QQeSIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0EJoEGgsgASAHOwEKIAEgBjYCDCAAKALIASAGEHoLIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQEgASAFOwEIDAELIARBCGogAEGaARBzCyAEQRBqJAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHIAGopAwAiAzcDACACIAM3AwggACACEKkCIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQqAIhBCACQRBqJAAgBAssAQF/IwBBEGsiAiQAIAJBCGogARCkAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARClAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCmAiAAKAKYASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQpwIgACgCmAEgAikDCDcDICACQRBqJAALLAEBfwJAIAAoAiwiAygCmAENACAAIAI2AjQgACABNgIwDwsgAyACIAERAgALJAACQCABLQAUQQpJDQAgASgCCBAhCyABQQA7AQIgAUEAOgAUC0gBA39BACEBA0AgACABQRhsaiICQRRqIQMCQCACLQAUQQpJDQAgAigCCBAhCyADQQA6AAAgAkEAOwECIAFBAWoiAUEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyACKQMINwIACyAAIAQ7AeADIAMLqAMBBn8jAEEgayIEJAACQCACRQ0AQQAhBQJAA0ACQCAAIAVBGGxqLwECDQAgACAFQRhsaiEFDAILIAVBAWoiBUEURw0AC0EAIQULAkAgBQ0AIABBACAALwHgAyIFQQFqIAVBEksbQRhsIgZqIgVBFGohBwJAIAUtABRBCkkNACAAIAZqKAIIECELIAdBADoAACAAIAZqQQA7AQILIAVBADsBFiAFIAI7AQIgBSABOwEAIAUgAzoAFAJAIANBCkkNACAFIAMQIDYCCAsCQAJAIAAgAC8B4AMiA0EYbGogBUcNACAFIQMMAQsCQCAAQQAgA0EBaiADQRJLGyICQRhsaiIDIAVGDQAgBEEIakEQaiIBIAVBEGoiBikCADcDACAEQQhqQQhqIgcgBUEIaiIIKQIANwMAIAQgBSkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACAFIAMpAgA3AgAgCSABKQMANwIAIAYgBykDADcCACADIAQpAwg3AgALIAAgAjsB4AMLIARBIGokACADDwtB1jZBxy9BJUHsKRD6AwALaAEFf0EAIQQCQANAAkACQCAAIARBGGwiBWoiBi8BACABRw0AIAAgBWoiBy8BAiACRw0AQQAhBSAHLwEWIANGDQELQQEhBSAIIQYLIAVFDQEgBiEIIARBAWoiBEEURw0AC0EAIQYLIAYLQAECf0EAIQMDQAJAIAAgA0EYbGoiBC8BACABRw0AIAQoAgQgAk0NACAEQQRqIAI2AgALIANBAWoiA0EURw0ACwtVAQN/QQAhAgNAAkAgACACQRhsaiIDLwEAIAFHDQAgA0EUaiEEAkAgAy0AFEEKSQ0AIAMoAggQIQsgBEEAOgAAIANBADsBAgsgAkEBaiICQRRHDQALC0kAAkAgAkUNACADIAAgAxsiAyAAQeADaiIATw0AA0ACQCADLwECIAJHDQAgAy8BACABRw0AIAMPCyADQRhqIgMgAEkNAAsLQQALVAEDfyMAQSBrIgEkAEEAIQICQCAAIAFBIBAlIgNBAEgNACADQQFqECAhAgJAIANBIEoNACACIAEgAxCaBBoMAQsgACACIAMQJRoLIAFBIGokACACCx0AAkAgAQ0AIAAgAUEAECYPCyAAIAEgARDABBAmCzsBAX8jAEEQayIDJAAgAyACKQMANwMIIAMgACADQQhqEIYCNgIEIAMgATYCAEGSEyADEC0gA0EQaiQAC9MDAQN/IwBB4ABrIgIkAAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiA0EKSw0AQQEgA3RBqAxxDQEgA0EIRw0AIAEoAgAiA0UNACADKAIAQYCAgPgAcUGAgIA4Rg0BCyACIAEpAwA3AwggACACQQhqQQAQkwIiAw0BIAIgASkDADcDACAAIAIQhwIhAwwBCyACIAEpAwA3A0AgACACQcAAaiACQdgAaiACQdQAahDnASEDAkACQCACKQNYUEUNAEEAIQEMAQsgAiACKQNYNwM4AkAgACACQThqEIcCIgFBgLwBRg0AIAIgATYCMEGAvAFBwABBrhQgAkEwahD+AxoLAkBBgLwBEMAEIgFBJ0kNAEEAQQAtAMA7OgCCvAFBAEEALwC+OzsBgLwBQQIhAQwBCyABQYC8AWpBLjoAACABQQFqIQELAkAgAigCVCIERQ0AIAJByABqIABBCCAEEKcCIAIgAigCSDYCICABQYC8AWpBwAAgAWtBhQogAkEgahD+AxpBgLwBEMAEIgFBgLwBakHAADoAACABQQFqIQELIAIgAzYCEEGAvAEhAyABQYC8AWpBwAAgAWtB/CggAkEQahD+AxoLIAJB4ABqJAAgAwvPBQEDfyMAQfAAayICJAACQAJAIAEoAgQiA0F/Rw0AIAIgASgCADYCAEGAvAEhA0GAvAFBwABB1ikgAhD+AxoMAQtBACEEAkACQAJAAkACQAJAAkACQAJAAkACQEEQIANBD3EgAUEGai8BAEHw/wFxGw4RAQkEAgMGBQoIBwYKCgoKCgAKCyACIAEpAwA3AyggAiAAIAJBKGoQqAI5AyBBgLwBIQNBgLwBQcAAQd4eIAJBIGoQ/gMaDAoLQbsaIQMCQAJAAkACQAJAAkACQCABKAIAIgEORBAABQYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYBAgMEBgtBpiEhAwwPC0G1ICEDDA4LQdIOIQMMDQtBigghAwwMC0GJCCEDDAsLQdUzIQMMCgtBoRshAyABQaB/aiIBQRtLDQkgAiABNgIwQYC8ASEDQYC8AUHAAEGDKSACQTBqEP4DGgwJC0GhGCEEDAcLQYseQboUIAEoAgBBgIABSRshBAwGC0HvIiEEDAULQZ0WIQQMBAsgAiABKAIANgJEIAIgA0EEdkH//wNxNgJAQYC8ASEDQYC8AUHAAEHFCSACQcAAahD+AxoMBAsgAiABKAIANgJUIAIgA0EEdkH//wNxNgJQQYC8ASEDQYC8AUHAAEG3CSACQdAAahD+AxoMAwsCQAJAIAEoAgAiAQ0AQX8hBAwBCyABLQADQQ9xQX9qIQQLQaU1IQMCQCAEQQlLDQAgBEECdEH4zABqKAIAIQMLIAIgATYCZCACIAM2AmBBgLwBIQNBgLwBQcAAQbEJIAJB4ABqEP4DGgwCC0GpMCEECwJAIAQNAEG6ICEDDAELIAIgASgCADYCFCACIAQ2AhBBgLwBIQNBgLwBQcAAQfUKIAJBEGoQ/gMaCyACQfAAaiQAIAMLoQQBDH8jAEHgAGsiAkHAAGpBGGogAEEYaikCADcDACACQcAAakEQaiAAQRBqKQIANwMAIAIgACkCADcDQCACIABBCGopAgA3A0hBACEDA0AgA0EEdCEEQQAhBQNAAkACQCADDQAgAiAFQQJ0aiABKAAAIgZBGHQgBkEIdEGAgPwHcXIgBkEIdkGA/gNxIAZBGHZycjYCACABQQRqIQEMAQsgAiAFQQJ0aiIHIAIgBUEBakEPcUECdGooAgAiBkEZdyAGQQ53cyAGQQN2cyAHKAIAaiACIAVBCWpBD3FBAnRqKAIAaiACIAVBDmpBD3FBAnRqKAIAIgZBD3cgBkENd3MgBkEKdnNqNgIACyACKAJcIQggAiACKAJYIgk2AlwgAiACKAJUIgo2AlggAiACKAJQIgY2AlQgAigCTCELIAIgAigCSCIMNgJMIAIgAigCRCINNgJIIAIgAigCQCIHNgJEIAIgCyAIIAZBGncgBkEVd3MgBkEHd3MgCiAGcWpqIAkgBkF/c3FqIAUgBHJBAnRBoM0AaigCAGogAiAFQQJ0aigCAGoiBmo2AlAgAiAHQR53IAdBE3dzIAdBCndzIAZqIAcgDCANc3EgDCANcXNqNgJAIAVBAWoiBUEQRw0ACyADQQFqIgNBBEcNAAtBACEFA0AgACAFQQJ0IgZqIgcgBygCACACQcAAaiAGaigCAGo2AgAgBUEBaiIFQQhHDQALC6cCAQV/IAAoAkghASAAKAJEIgJBgAE6AAAgAEHQAGohAyACQQFqIQICQCABQX9qIgFBB0sNACACQQAgARCcBBogAyAAQQRqIgIQiAJBwAAhAQsgAkEAIAFBeGoiARCcBCABaiIEIAAoAkwiAkEDdDoAByACQQV2IQJBBiEFA0AgBCAFIgFqIAI6AAAgAUF/aiEFIAJBCHYhAiABDQALIAMgAEEEahCIAiAAKAIAIQFBACECQQAhBQNAIAEgAmogACAFQQJ0aiIEQdMAai0AADoAACABIAJBAXJqIARB0gBqLwEAOgAAIAEgAkECcmogBEHQAGoiBCgCAEEIdjoAACABIAJBA3JqIAQoAgA6AAAgAkEEaiECIAVBAWoiBUEIRw0ACyAAKAIAC5ABABAjAkBBAC0AwLwBRQ0AQY4wQQ5BuBYQ9QMAC0EAQQE6AMC8ARAkQQBCq7OP/JGjs/DbADcCrL0BQQBC/6S5iMWR2oKbfzcCpL0BQQBC8ua746On/aelfzcCnL0BQQBC58yn0NbQ67O7fzcClL0BQQBCwAA3Aoy9AUEAQci8ATYCiL0BQQBBwL0BNgLEvAEL1QEBAn8CQCABRQ0AQQBBACgCkL0BIAFqNgKQvQEDQAJAQQAoAoy9ASICQcAARw0AIAFBwABJDQBBlL0BIAAQiAIgAEHAAGohACABQUBqIgENAQwCC0EAKAKIvQEgACABIAIgASACSRsiAhCaBBpBAEEAKAKMvQEiAyACazYCjL0BIAAgAmohACABIAJrIQECQCADIAJHDQBBlL0BQci8ARCIAkEAQcAANgKMvQFBAEHIvAE2Aoi9ASABDQEMAgtBAEEAKAKIvQEgAmo2Aoi9ASABDQALCwtMAEHEvAEQiQIaIABBGGpBACkD2L0BNwAAIABBEGpBACkD0L0BNwAAIABBCGpBACkDyL0BNwAAIABBACkDwL0BNwAAQQBBADoAwLwBC5MHAQJ/QQAhAkEAQgA3A5i+AUEAQgA3A5C+AUEAQgA3A4i+AUEAQgA3A4C+AUEAQgA3A/i9AUEAQgA3A/C9AUEAQgA3A+i9AUEAQgA3A+C9AQJAAkACQAJAIAFBwQBJDQAQI0EALQDAvAENAkEAQQE6AMC8ARAkQQAgATYCkL0BQQBBwAA2Aoy9AUEAQci8ATYCiL0BQQBBwL0BNgLEvAFBAEKrs4/8kaOz8NsANwKsvQFBAEL/pLmIxZHagpt/NwKkvQFBAELy5rvjo6f9p6V/NwKcvQFBAELnzKfQ1tDrs7t/NwKUvQECQANAAkBBACgCjL0BIgJBwABHDQAgAUHAAEkNAEGUvQEgABCIAiAAQcAAaiEAIAFBQGoiAQ0BDAILQQAoAoi9ASAAIAEgAiABIAJJGyICEJoEGkEAQQAoAoy9ASIDIAJrNgKMvQEgACACaiEAIAEgAmshAQJAIAMgAkcNAEGUvQFByLwBEIgCQQBBwAA2Aoy9AUEAQci8ATYCiL0BIAENAQwCC0EAQQAoAoi9ASACajYCiL0BIAENAAsLQcS8ARCJAhpBACECQQBBACkD2L0BNwP4vQFBAEEAKQPQvQE3A/C9AUEAQQApA8i9ATcD6L0BQQBBACkDwL0BNwPgvQFBAEEAOgDAvAEMAQtB4L0BIAAgARCaBBoLA0AgAkHgvQFqIgEgAS0AAEE2czoAACACQQFqIgJBwABHDQAMAgsAC0GOMEEOQbgWEPUDAAsQIwJAQQAtAMC8AQ0AQQBBAToAwLwBECRBAELAgICA8Mz5hOoANwKQvQFBAEHAADYCjL0BQQBByLwBNgKIvQFBAEHAvQE2AsS8AUEAQZmag98FNgKwvQFBAEKM0ZXYubX2wR83Aqi9AUEAQrrqv6r6z5SH0QA3AqC9AUEAQoXdntur7ry3PDcCmL0BQeC9ASEBQcAAIQICQANAAkBBACgCjL0BIgBBwABHDQAgAkHAAEkNAEGUvQEgARCIAiABQcAAaiEBIAJBQGoiAg0BDAILQQAoAoi9ASABIAIgACACIABJGyIAEJoEGkEAQQAoAoy9ASIDIABrNgKMvQEgASAAaiEBIAIgAGshAgJAIAMgAEcNAEGUvQFByLwBEIgCQQBBwAA2Aoy9AUEAQci8ATYCiL0BIAINAQwCC0EAQQAoAoi9ASAAajYCiL0BIAINAAsLDwtBjjBBDkG4FhD1AwALuwYBBH9BxLwBEIkCGkEAIQEgAEEYakEAKQPYvQE3AAAgAEEQakEAKQPQvQE3AAAgAEEIakEAKQPIvQE3AAAgAEEAKQPAvQE3AABBAEEAOgDAvAEQIwJAQQAtAMC8AQ0AQQBBAToAwLwBECRBAEKrs4/8kaOz8NsANwKsvQFBAEL/pLmIxZHagpt/NwKkvQFBAELy5rvjo6f9p6V/NwKcvQFBAELnzKfQ1tDrs7t/NwKUvQFBAELAADcCjL0BQQBByLwBNgKIvQFBAEHAvQE2AsS8AQNAIAFB4L0BaiICIAItAABB6gBzOgAAIAFBAWoiAUHAAEcNAAtBAEHAADYCkL0BQeC9ASECQcAAIQECQANAAkBBACgCjL0BIgNBwABHDQAgAUHAAEkNAEGUvQEgAhCIAiACQcAAaiECIAFBQGoiAQ0BDAILQQAoAoi9ASACIAEgAyABIANJGyIDEJoEGkEAQQAoAoy9ASIEIANrNgKMvQEgAiADaiECIAEgA2shAQJAIAQgA0cNAEGUvQFByLwBEIgCQQBBwAA2Aoy9AUEAQci8ATYCiL0BIAENAQwCC0EAQQAoAoi9ASADajYCiL0BIAENAAsLQSAhAUEAQQAoApC9AUEgajYCkL0BIAAhAgJAA0ACQEEAKAKMvQEiA0HAAEcNACABQcAASQ0AQZS9ASACEIgCIAJBwABqIQIgAUFAaiIBDQEMAgtBACgCiL0BIAIgASADIAEgA0kbIgMQmgQaQQBBACgCjL0BIgQgA2s2Aoy9ASACIANqIQIgASADayEBAkAgBCADRw0AQZS9AUHIvAEQiAJBAEHAADYCjL0BQQBByLwBNgKIvQEgAQ0BDAILQQBBACgCiL0BIANqNgKIvQEgAQ0ACwtBxLwBEIkCGiAAQRhqQQApA9i9ATcAACAAQRBqQQApA9C9ATcAACAAQQhqQQApA8i9ATcAACAAQQApA8C9ATcAAEEAQgA3A+C9AUEAQgA3A+i9AUEAQgA3A/C9AUEAQgA3A/i9AUEAQgA3A4C+AUEAQgA3A4i+AUEAQgA3A5C+AUEAQgA3A5i+AUEAQQA6AMC8AQ8LQY4wQQ5BuBYQ9QMAC+MGACAAIAEQjQICQCADRQ0AQQBBACgCkL0BIANqNgKQvQEDQAJAQQAoAoy9ASIAQcAARw0AIANBwABJDQBBlL0BIAIQiAIgAkHAAGohAiADQUBqIgMNAQwCC0EAKAKIvQEgAiADIAAgAyAASRsiABCaBBpBAEEAKAKMvQEiASAAazYCjL0BIAIgAGohAiADIABrIQMCQCABIABHDQBBlL0BQci8ARCIAkEAQcAANgKMvQFBAEHIvAE2Aoi9ASADDQEMAgtBAEEAKAKIvQEgAGo2Aoi9ASADDQALCyAIEI4CIAhBIBCNAgJAIAVFDQBBAEEAKAKQvQEgBWo2ApC9AQNAAkBBACgCjL0BIgNBwABHDQAgBUHAAEkNAEGUvQEgBBCIAiAEQcAAaiEEIAVBQGoiBQ0BDAILQQAoAoi9ASAEIAUgAyAFIANJGyIDEJoEGkEAQQAoAoy9ASICIANrNgKMvQEgBCADaiEEIAUgA2shBQJAIAIgA0cNAEGUvQFByLwBEIgCQQBBwAA2Aoy9AUEAQci8ATYCiL0BIAUNAQwCC0EAQQAoAoi9ASADajYCiL0BIAUNAAsLAkAgB0UNAEEAQQAoApC9ASAHajYCkL0BA0ACQEEAKAKMvQEiA0HAAEcNACAHQcAASQ0AQZS9ASAGEIgCIAZBwABqIQYgB0FAaiIHDQEMAgtBACgCiL0BIAYgByADIAcgA0kbIgMQmgQaQQBBACgCjL0BIgUgA2s2Aoy9ASAGIANqIQYgByADayEHAkAgBSADRw0AQZS9AUHIvAEQiAJBAEHAADYCjL0BQQBByLwBNgKIvQEgBw0BDAILQQBBACgCiL0BIANqNgKIvQEgBw0ACwtBASEDQQBBACgCkL0BQQFqNgKQvQFBisEAIQUCQANAAkBBACgCjL0BIgdBwABHDQAgA0HAAEkNAEGUvQEgBRCIAiAFQcAAaiEFIANBQGoiAw0BDAILQQAoAoi9ASAFIAMgByADIAdJGyIHEJoEGkEAQQAoAoy9ASICIAdrNgKMvQEgBSAHaiEFIAMgB2shAwJAIAIgB0cNAEGUvQFByLwBEIgCQQBBwAA2Aoy9AUEAQci8ATYCiL0BIAMNAQwCC0EAQQAoAoi9ASAHajYCiL0BIAMNAAsLIAgQjgIL+AUCB38BfiMAQfAAayIIJAACQCAERQ0AIANBADoAAAtBACEJQQAhCgNAQQAhCwJAIAkgAkYNACABIAlqLQAAIQsLIAlBAWohDAJAAkACQAJAAkAgC0H/AXEiDUH7AEcNACAMIAJJDQELAkAgDUH9AEYNACAMIQkMAwsgDCACSQ0BIAwhCQwCCyAJQQJqIQkgASAMai0AACILQfsARg0BAkACQCALQVBqQf8BcUEJSw0AIAtBGHRBGHVBUGohDAwBC0F/IQwgC0EgciILQZ9/akH/AXFBGUsNACALQRh0QRh1Qal/aiEMCwJAIAxBAE4NAEEhIQsMAgsgCSELAkAgCSACTw0AA0AgASALai0AAEH9AEYNASALQQFqIgsgAkcNAAsgAiELC0F/IQ0CQCAJIAtPDQACQCABIAlqLAAAIglBUGoiDkH/AXFBCUsNACAOIQ0MAQsgCUEgciIJQZ9/akH/AXFBGUsNACAJQal/aiENCyALQQFqIQlBPyELIAwgBk4NASAIIAUgDEEDdGoiCykDACIPNwMYIAggDzcDYAJAAkAgCEEYahCSAkUNACAIIAspAwA3AwAgCEEgaiAAIAgQqAJBByANQQFqIA1BAEgbEP0DIAggCEEgahDABDYCbCAIQSBqIQsMAQsgCCAIKQNgNwMQIAhBIGogACAIQRBqEJgCIAggCCkDIDcDCCAAIAhBCGogCEHsAGoQkwIhCwsgCCAIKAJsIgxBf2o2AmwgDEUNAgNAAkACQCAHDQACQCAKIARPDQAgAyAKaiALLQAAOgAACyAKQQFqIQpBACEHDAELIAdBf2ohBwsgC0EBaiELIAggCCgCbCIMQX9qNgJsIAwNAAwDCwALIAlBAmogDCABIAxqLQAAQf0ARhshCQsCQCAHDQACQCAKIARPDQAgAyAKaiALOgAACyAKQQFqIQpBACEHDAELIAdBf2ohBwsgCSACTQ0ACwJAIARFDQAgBCADakF/akEAOgAACyAIQfAAaiQAIAoLXQECf0EAIQICQAJAAkBBECABKAIEIgNBD3EgA0GAgMD/B3EbQXxqDgUBAgICAAILIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAwRg8LIAEoAgBB//8ASyECCyACCxkAIAAoAgQiAEF/RiAAQYCAwP8HcUEAR3ILgwEBAn9BACEDAkACQAJAQRAgASgCBCIEQQ9xIARBgIDA/wdxG0F8ag4FAQICAgACCyABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAMEcNAQJAIAJFDQAgAiABLwEENgIACyABQQZqDwsgASgCACIBQYCAAUkNACAAIAEgAhC6AiEDCyADCxUAIABBBDYCBCAAIAFBgIABcjYCAAt/AQJ/IwBBEGsiBCQAIAQgAzYCDCAEIAM2AggCQAJAIAFBAEEAIAIgAxD8AyIFQX9qEIEBIgMNACAEIAFBkAEQcyAEQQEgAiAEKAIIEPwDGiAAQgA3AwAMAQsgA0EGaiAFIAIgBCgCCBD8AxogACABQQggAxCnAgsgBEEQaiQACyYBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQlQIgBEEQaiQAC0cBAX8jAEEQayIEJAACQAJAIAEgAiADEIIBIgINACAEQQhqIAFBkQEQcyAAQgA3AwAMAQsgACABQQggAhCnAgsgBEEQaiQAC4QJAQR/IwBB8AFrIgMkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBECACKAIEIgRBD3EgBEGAgMD/B3EbIgUOEQQFCwYBCAwNAAcIDQ0NDQ0ODQsgAigCACIGRQ0CIAYoAgBBgICA+ABxQYCAgDBGIQYMAQsgAigCAEH//wBLIQYLIAZFDQAgACACKQMANwMADAwLIAUOEQABBwIGBAgJBQMECQkJCQkKCQsCQAJAAkACQAJAAkACQAJAIAIoAgAiAg5EAAEEBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwIDBQYHCyAAQqqAgYDAADcDAAwRCyAAQpiAgYDAADcDAAwQCyAAQsWAgYDAADcDAAwPCyAAQq+AgYDAADcDAAwOCyAAQomAgYDAADcDAAwNCyAAQoSAgYDAADcDAAwMCyAAQoGAgYDAADcDAAwLCwJAIAJBoH9qIgJBG0sNACADIAI2AhAgACABQfIxIANBEGoQlgIMCwtB5y1B/gBBoR0Q9QMACyADIAIoAgA2AiAgACABQdgwIANBIGoQlgIMCQsgAigCACECIAMgASgCkAE2AjwgAyADQTxqIAIQazYCMCAAIAFBgzEgA0EwahCWAgwICyADIAEoApABNgJMIAMgA0HMAGogBEEEdkH//wNxEGs2AkAgACABQZIxIANBwABqEJYCDAcLIAMgASgCkAE2AlQgAyADQdQAaiAEQQR2Qf//A3EQazYCUCAAIAFBqzEgA0HQAGoQlgIMBgsCQAJAIAIoAgAiBA0AQQAhBQwBCyAELQADQQ9xIQULAkACQAJAAkACQAJAIAVBfWoOCAAEAgUBBQQDBQsgAEKPgIGAwAA3AwAMCgsgAEKcgIGAwAA3AwAMCQsgAyACKQMANwNYIAAgASADQdgAahCZAgwICyAELwESIQIgAyABKAKQATYCdCADQfQAaiACEGwhAiAELwEQIQUgAyAEKAIcLwEENgJoIAMgBTYCZCADIAI2AmAgACABQdYxIANB4ABqEJYCDAcLIABCpoCBgMAANwMADAYLQectQaEBQaEdEPUDAAsgAigCAEGAgAFPDQUgAyACKQMANwN4IAAgASADQfgAahCZAgwECyACKAIAIQIgAyABKAKQATYCjAEgAyADQYwBaiACEGw2AoABIAAgAUGgMSADQYABahCWAgwDCyADIAIpAwA3A6gBIAEgA0GoAWogA0GwAWoQ4QEhAiADIAEoApABNgKkASADQaQBaiADKAKwARBsIQQgAi8BACECIAMgASgCkAE2AqABIAMgA0GgAWogAkEAELkCNgKUASADIAQ2ApABIAAgAUH1MCADQZABahCWAgwCC0HnLUGwAUGhHRD1AwALIAMgAikDADcDCCADQbABaiABIANBCGoQqAJBBxD9AyADIANBsAFqNgIAIAAgAUGuFCADEJYCCyADQfABaiQADwtBwTtB5y1BpAFBoR0Q+gMAC3kBAn8jAEEgayIDJAAgAyACKQMANwMQAkAgASADQRBqIANBHGoQrgIiBA0AQaA0QectQdUAQZAdEPoDAAsgAyAEIAMoAhwiAkEgIAJBIEkbEIEENgIEIAMgAjYCACAAIAFBgzJB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QCACQSBqIgQoAgANACACQoCAgICAgID8/wA3AxgMAQsgAisDGCADIAIoAhRruKIhCSACQShqKwMAIQoCQAJAIAIoAgwiAw0AQQAhBwwBCyADEMAEIQcLIAkgCqAhCSAHQSlqECAiA0EgaiAEQSBqKQMANwMAIANBGGogBEEYaikDADcDACADQRBqIARBEGopAwA3AwAgA0EIaiAEQQhqKQMANwMAIAMgBCkDADcDACAHQShqIQQCQCACKAIMIghFDQAgA0EoaiAIIAcQmgQaCyADIAkgAigCRCACQcAAaigCAGu4ozkDCCAALQAEQZABIAMgBBCSBCIEDQECQCACLAAKIgdBf0cNACAAQRFBECACKAIMG2otAAAhBwsCQCAHRQ0AIAIoAgwgAigCBCADIAAoAiAoAggRBQBFDQAgAkHpJhCfAgsgAxAhIAQNAgsgAkHAAGogAigCRCIDNgIAAkAgAigCECIEDQAgBSEEAkAgAC0AEkUNACAGIQQgBigCAA0AIAZBiCc2AgAgBiEECyAEKAIAIQQLIAJBADYCICACIAM2AhQgAiAEIANqNgJEIAJBOGogAisDGCIJOQMAIAJBMGogCTkDACACQShqQgA3AwAMAQsgAxAhCyACKAIAIgINAAsLIAFBEGokAA8LQdoNQQAQLRAzAAvEAQECfyMAQcAAayICJAACQAJAIAAoAgQiA0UNACACQTtqIANBACADLQAEa0EMbGpBZGopAwAQ/wMgACgCBC0ABCEDAkAgACgCDCIARQ0AIAIgATYCLCACIAM2AiggAiAANgIgIAIgAkE7ajYCJEGbFCACQSBqEC0MAgsgAiABNgIYIAIgAzYCFCACIAJBO2o2AhBBgRQgAkEQahAtDAELIAAoAgwhACACIAE2AgQgAiAANgIAQYsTIAIQLQsgAkHAAGokAAubBQICfwF8AkACQAJAAkACQAJAIAEvAQ5BgH9qDgYABAQBAgMECwJAIAAoAiQiAUUNAANAIAAgASgCACICNgIkIAEoAgwQISABECEgAiEBIAINAAsLIABBADYCKA8LQQAhAgJAIAEtAAwiA0EJSQ0AIAAgAUEYaiADQXhqEKECIQILIAJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA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OwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBiCtBrgFB3TUQ9QMACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAuzAwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEMkDtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBiCtBygFB8TUQ9QMAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQyQO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoApDBASICIABHDQBBkMEBIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCcBBoLIABB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ACAEIAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ4gQgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDiBCADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOIEIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDiBCADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ4gQgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvbBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAENgERQ0AIAMgBBDIBCEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDiBCAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADENoEIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAitQjCGIAJC////////P4OEIgkgAyAEQjCIp0H//wFxIgatQjCGIARC////////P4OEIgoQ2ARBAEoNAAJAIAEgCSADIAoQ2ARFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ4gQgBUH4AGopAwAhAiAFKQNwIQQMAQsCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ4gQgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOIEIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDiBCAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ4gQgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EOIEIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkGMrwFqKAIAIQYgAkGArwFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMMEIQILIAIQxAQNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACAC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ASIEQQEgAnQiAnENAEEAIAQgAnI2AvDDASAAIQIMAQsgACgCCCECCyAAIAE2AgggAiABNgIMIAEgADYCDCABIAI2AggPC0EfIQICQCAAQf///wdLDQAgAEEIdiICIAJBgP4/akEQdkEIcSICdCIEIARBgOAfakEQdkEEcSIEdCIGIAZBgIAPakEQdkECcSIGdEEPdiACIARyIAZyayICQQF0IAAgAkEVanZBAXFyQRxqIQILIAFCADcCECABQRxqIAI2AgAgAkECdEGgxgFqIQQCQAJAAkACQEEAKAL0wwEiBkEBIAJ0IgNxDQBBACAGIANyNgL0wwEgBCABNgIAIAFBGGogBDYCAAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABQRhqIAQ2AgALIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBGGpBADYCACABIAQ2AgwgASAANgIIC0EAQQAoApDEAUF/aiIBQX8gARs2ApDEAQsLBwA/AEEQdAtUAQJ/QQAoApyzASIBIABBA2pBfHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDUBE0NACAAEBNFDQELQQAgADYCnLMBIAEPCxCXBEEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCiAEIAIgBxsiCUL///////8/gyELIAIgBCAHGyIMQjCIp0H//wFxIQgCQCAJQjCIp0H//wFxIgYNACAFQeAAaiAKIAsgCiALIAtQIgYbeSAGQQZ0rXynIgZBcWoQ1wRBECAGayEGIAVB6ABqKQMAIQsgBSkDYCEKCyABIAMgBxshAyAMQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqENcEQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhAiALQgOGIApCPYiEIQQgA0IDhiEBIAkgDIUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQJCASEBDAELIAVBwABqIAEgAkGAASAHaxDXBCAFQTBqIAEgAiAHEOEEIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEBIAVBMGpBCGopAwAhAgsgBEKAgICAgICABIQhDCAKQgOGIQsCQAJAIANCf1UNAEIAIQNCACEEIAsgAYUgDCAChYRQDQIgCyABfSEKIAwgAn0gCyABVK19IgRC/////////wNWDQEgBUEgaiAKIAQgCiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ1wQgBiAHayEGIAVBKGopAwAhBCAFKQMgIQoMAQsgAiAMfCABIAt8IgogAVStfCIEQoCAgICAgIAIg1ANACAKQgGIIARCP4aEIApCAYOEIQogBkEBaiEGIARCAYghBAsgCUKAgICAgICAgIB/gyEBAkAgBkH//wFIDQAgAUKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiAKIAQgBkH/AGoQ1wQgBSAKIARBASAGaxDhBCAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCEKIAVBCGopAwAhBAsgCkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAGEIQQgCqdBB3EhBgJAAkACQAJAAkAQ3wQOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyABQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyABUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ4AQaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL3xACBX8OfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsN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AwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqENcEIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqENcEIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ1wQgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ1wQgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ1wRBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ1wQgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIApCD4YgA0IxiIQiFEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQYABSQ0AQgAhAQwDCyAFQTBqIBIgASAGQf8AaiIGENcEIAVBIGogAiAEIAYQ1wQgBUEQaiASIAEgBxDhBCAFIAIgBCAHEOEEIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAQsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCIEIAFCIIgiAn58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAJ+fCIDQiCIfCADQv////8PgyAEIAF+fCIDQiCIfDcDCCAAIANCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FENYEIAUpAwAhASAAIAVBCGopAwA3AwggACABNwMAIAVBEGokAAvqAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIhUIAUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDXBCACIAAgBEGB+AAgA2sQ4QQgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACIVCAFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELFQBB4MfBAiQCQeDHAUEPakFwcSQBCwcAIwAjAWsLBAAjAgsEACMBCw0AIAEgAiADIAAREAALJAEBfiAAIAEgAq0gA61CIIaEIAQQ7gQhBSAFQiCIpxAUIAWnCxMAIAAgAacgAUIgiKcgAiADEBULC7CrgYAAAwBBgAgLmKcBaW5maW5pdHkALUluZmluaXR5AGh1bWlkaXR5AGFjaWRpdHkAZGV2c192ZXJpZnkAaW52YWxpZCBrZXkAYXJyYXkAaXNBcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAJXM6JXgAY2xvc3VyZTolZDoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AHBvdwBqZF93c3NrX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AHJhbmRvbUludABwYXJzZUludABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAZGV2c19tYXBfa2V5c19vcl92YWx1ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAYWJzAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAcm9sZV9tZW1iZXIAZnJlZV9maWJlcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IFBBQ0tfU0hJRlQpID4+IFBBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfbWFwX2NvcHlfaW50bwBzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AcmUtcnVuAG5vbi1mdW4AYnV0dG9uAG1vdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAG1haW4AZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luAGRldnNfb2JqZWN0X2dldF9zdGF0aWNfYnVpbHRfaW4AYXNzaWduAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABzZXR0aW5nIG51bGwAZ2V0dGluZyBudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAbG9nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAZm5pZHggPD0gMHhmZmZmADAxMjM0NTY3ODlhYmNkZWYAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQB0cnVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAaGVhcnRSYXRlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1M6IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBwcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBuYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9uRGlzY29ubmVjdGVkAFdTOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZABEZXZpY2VTY3JpcHQgcnVudGltZSB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBwYW5pYwBiYWQgbWFnaWMAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBuZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGRldmljZXNjcmlwdC90c2FnZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19mdW5jX18AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAHBrdCAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFBJAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsb2cyAFNRUlQxXzIAU1FSVDIAZUNPMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBhcmcwAGxvZzEwAExOMTAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IFBBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZmlkeCA8IGRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQBXUzogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1M6IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAEAAAAAAGphY2RhYy1wb3NpeCBkZXZpY2UAMC4wLjAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAPCfBgCAEIEQghDxDyvqNBE4AQAACgAAAAsAAABEZXZTCn5qmgAAAAMBAAAAAAAAAAAAAAAAAAAAAAAAAGgAAAAQAAAAeAAAAAgAAACAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAIAAAAAAAAAAgAAAAAQAAACEAAAAAAAAAHgAAAAIAAAAAAAAAFBAAAAN+QAEkAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnG5gFAwAAAAMAAAADQAAAAAAAAABAAAAAwACAAQAAAAAAAAAAAAAAAAIAAUABwAGAAoAAAYOEgwQCAAAGAAAABcAAAAaAAAAFwAAABcAAAAXAAAAFwAAABcAAAAZAAAAAAAAABQAY8MaAGTDOgBlww0AZsM2AGfDNwBowyMAacMyAGrDHgBrw0sAbMMfAG3DKABuwycAb8MAAAAAAAAAAAAAAABVAHDDVgBxw1cAcsMAAAAAAAAAAGwAUsMAAAAAAAAAACIAUMNNAFHDNQBTw28AVMM/AFXDAAAAAA4AVsMAAAAAIgBXw0QAWMMZAFnDEABawwAAAAAAAAAAAAAAAAAAAAAiAIrDFQCLw1EAjMMAAAAAIACIw3AAicMAAAAATgBiwwAAAAAAAAAAAAAAAAAAAABZAHPDWgB0w1sAdcNcAHbDXQB3w2kAeMNrAHnDagB6w14Ae8NkAHzDZQB9w2YAfsNnAH/DaACAw18AgcMAAAAASgBbwzAAXMM5AF3DTABewyMAX8NUAGDDUwBhwwAAAABZAITDYwCFw2IAhsMAAAAAAwAADwAAAADgIQAAAwAADwAAAAAgIgAAAwAADwAAAAAwIgAAAwAADwAAAAA0IgAAAwAADwAAAABAIgAAAwAADwAAAABYIgAAAwAADwAAAABgIgAAAwAADwAAAAAwIgAAAwAADwAAAACAIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAACQIgAAAwAADwAAAAAwIgAAAwAADwAAAACcIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAAwAADwAAAACwIgAAAwAADwAAAADwIgAAAwAADwAAAAAQIwAAAwAADygkAABwJAAAAwAADygkAAB8JAAAAwAADygkAACEJAAAAwAADwAAAAAwIgAAAwAADwAAAAAwIgAAOACCw0kAg8MAAAAAWACHwwAAAAAAAAAAAAAAAAAAAAAiAAABDwAAAE0AAgAQAAAAbAABBBEAAAA1AAAAEgAAAG8AAQATAAAAPwAAABQAAAAOAAEEFQAAACIAAAEWAAAARAAAABcAAAAZAAMAGAAAABAABAAZAAAASgABBBoAAAAwAAEEGwAAADkAAAQcAAAATAAABB0AAAAjAAEEHgAAAFQAAQQfAAAAUwABBCAAAABOAAAAIQAAABQAAQQiAAAAGgABBCMAAAA6AAEEJAAAAA0AAQQlAAAANgAABCYAAAA3AAEEJwAAACMAAQQoAAAAMgACBCkAAAAeAAIEKgAAAEsAAgQrAAAAHwACBCwAAAAoAAIELQAAACcAAgQuAAAAVQACBC8AAABWAAEEMAAAAFcAAQQxAAAAWQAAATIAAABaAAABMwAAAFsAAAE0AAAAXAAAATUAAABdAAABNgAAAGkAAAE3AAAAawAAATgAAABqAAABOQAAAF4AAAE6AAAAZAAAATsAAABlAAABPAAAAGYAAAE9AAAAZwAAAT4AAABoAAABPwAAAF8AAABAAAAAOAAAAEEAAABJAAAAQgAAAFkAAAFDAAAAYwAAAUQAAABiAAABRQAAAFgAAABGAAAAIAAAAUcAAABwAAIASAAAACIAAAFJAAAAFQABAEoAAABRAAEASwAAAMERAAB3CAAAPAQAAMoLAAABCwAAzw4AADgSAAClGgAAygsAAFIHAACYL4pCkUQ3cc/7wLWl27XpW8JWOfER8Vmkgj+S1V4cq5iqB9gBW4MSvoUxJMN9DFV0Xb5y/rHegKcG3Jt08ZvBwWmb5IZHvu/GncEPzKEMJG8s6S2qhHRK3KmwXNqI+XZSUT6YbcYxqMgnA7DHf1m/8wvgxkeRp9VRY8oGZykpFIUKtyc4IRsu/G0sTRMNOFNUcwpluwpqdi7JwoGFLHKSoei/oktmGqhwi0vCo1FsxxnoktEkBpnWhTUO9HCgahAWwaQZCGw3Hkx3SCe1vLA0swwcOUqq2E5Pypxb828uaO6Cj3RvY6V4FHjIhAgCx4z6/76Q62xQpPej+b7yeHHG8J8GAIRQgVCDEIIQgBDxD8y9khEsAAAATQAAAE4AAAAAAAAA/////wAAAAAAAOBBQAAAAAAAAAABAAAAAAAAAEEAAAAAAAAAAgAAAAAAAABCAAAAAAAAAAMAAAACAAAABAAAAAkAAAAIAAAACQAAAAIAAAAKAAAAAAAAAAAAAACLIAAACQQAAPoFAACIGgAACgQAADgbAADZGgAAgxoAAH0aAADVGQAALRoAAMYaAADOGgAAfQgAAPoUAAA8BAAAjQcAAAQNAAABCwAA0QUAAGENAACuBwAAvQsAADQLAACmEAAApwcAAFsKAABmDgAAQwwAAJoHAAA0BQAAIQ0AAD8TAACGDAAA/w0AAIwOAAAyGwAAwRoAAMoLAACGBAAAiwwAAHsFAAA7DQAAFgsAAIoRAABLEwAAIhMAAFIHAAAAFQAAqgsAACQFAAA5BQAA7xAAABkOAAAMDQAAegYAABoUAAAHBgAAMhIAAJQHAAAGDgAAxwYAAJoNAAAQEgAAFhIAAKYFAADPDgAAHRIAANYOAAA1EAAAXxMAALYGAACiBgAAQRAAAIEIAAAtEgAAhgcAAMoFAADhBQAAJxIAAI8MAACgBwAAdAcAAIQGAAB7BwAAzQwAALkHAAA6CAAATxgAAG8RAADwCgAAHxQAAGcEAACfEgAAyxMAAM4RAADHEQAAWQcAANARAABPEQAANwYAANURAABiBwAAawcAAN8RAAAjCAAAqwUAAJUSAABCBAAAIBEAAMMFAACTEQAArhIAAH9gERITFBUWFxgZEhEwMRFgMTEUQCAgQQITISEhYGAQERFgYGBgYGBgYEADAEFAQUBAQUBBQUFBQUFCQkJCQkJCQkJCQkJCQhEyISBBAAESIAAqK1JSUlIRUhxCUgAAAAAAAAAAAAAAAAAAAGN8d3vya2/FMAFnK/7Xq3bKgsl9+llH8K3Uoq+cpHLAt/2TJjY/98w0peXxcdgxFQTHI8MYlgWaBxKA4usnsnUJgywaG25aoFI71rMp4y+EU9EA7SD8sVtqy745SkxYz9DvqvtDTTOFRfkCf1A8n6hRo0CPkp049by22iEQ//PSzQwT7F+XRBfEp349ZF0Zc2CBT9wiKpCIRu64FN5eC9vgMjoKSQYkXMLTrGKRleR558g3bY3VTqlsVvTqZXquCLp4JS4cprTG6N10H0u9i4pwPrVmSAP2DmE1V7mGwR2e4fiYEWnZjpSbHofpzlUo34yhiQ2/5kJoQZktD7BUuxaNAQIECBAgQIAbNgAAAAAAAAAAACwCAAApAgAAIwIAACkCAADwnwYAgjGAUIFQ8Q/87mIUXAAAAKAAAAChAAAAogAAAKMAAACkAAAApQAAAAAEAACmAAAA8J8GAIAQgRHxDwAAZn5LHiQBAACnAAAAqAAAAAAAAAAAAAAAAAAAAL8KAAC2TrsQgQAAAAgLAADJKfoQBgAAACwMAABJp3kRAAAAAKcGAACyTGwSAQEAANkUAACXtaUSogAAAIcNAAAPGP4S9QAAAL4TAADILQYTAAAAAIARAACVTHMTAgEAAOcRAACKaxoUAgEAAMUQAADHuiEUpgAAACUMAABjonMUAQEAAHENAADtYnsUAQEAAE8EAADWbqwUAgEAAHwNAABdGq0UAQEAAPgHAAC/ubcVAgEAAGUGAAAZrDMWAwAAAHUQAADEbWwWAgEAANQaAADGnZwWogAAABMEAAC4EMgWogAAAGYNAAAcmtwXAQEAAEwMAAAr6WsYAQAAAFAGAACuyBIZAwAAAE4OAAAClNIaAAAAALQTAAC/G1kbAgEAAEMOAAC1KhEdBQAAALgQAACzo0odAQEAANEQAADqfBEeogAAAPARAADyym4eogAAABwEAADFeJcewQAAALEKAABGRycfAQEAAEoEAADGxkcf9QAAAHQRAABAUE0fAgEAAF8EAACQDW4fAgEAACEAAAAAAAAACAAAAKkAAACqAAAAAQECAgQEBAgBAAECBAQAAAEAAAAAAAAACgAAAAAAAABkAAAAAAAAAOgDAAAAAAAAECcAAAAAAACghgEAAAAAAEBCDwAAAAAAgJaYAAAAAAAA4fUFAAAAAADKmjsAAAAAAOQLVAIAAAAA6HZIFwAAAAAQpdToAAAAAKByThgJAAAAQHoQ81oAAAA4+v5CLuY/MGfHk1fzLj0BAAAAAADgv1swUVVVVdU/kEXr////z78RAfEks5nJP5/IBuV1VcW/AAAAAAAA4L93VVVVVVXVP8v9/////8+/DN2VmZmZyT+nRWdVVVXFvzDeRKMkScI/ZT1CpP//v7/K1ioohHG8P/9osEPrmbm/hdCv94KBtz/NRdF1E1K1v5/e4MPwNPc/AJDmeX/M178f6SxqeBP3PwAADcLub9e/oLX6CGDy9j8A4FET4xPXv32MEx+m0fY/AHgoOFu41r/RtMULSbH2PwB4gJBVXda/ugwvM0eR9j8AABh20ALWvyNCIhifcfY/AJCQhsqo1b/ZHqWZT1L2PwBQA1ZDT9W/xCSPqlYz9j8AQGvDN/bUvxTcnWuzFPY/AFCo/aed1L9MXMZSZPb1PwCoiTmSRdS/TyyRtWfY9T8AuLA59O3Tv96QW8u8uvU/AHCPRM6W0794GtnyYZ31PwCgvRceQNO/h1ZGElaA9T8AgEbv4unSv9Nr586XY/U/AOAwOBuU0r+Tf6fiJUf1PwCI2ozFPtK/g0UGQv8q9T8AkCcp4enRv9+9stsiD/U/APhIK22V0b/X3jRHj/P0PwD4uZpnQdG/QCjez0PY9D8AmO+U0O3Qv8ijeMA+vfQ/ABDbGKWa0L+KJeDDf6L0PwC4Y1LmR9C/NITUJAWI9D8A8IZFIuvPvwstGRvObfQ/ALAXdUpHz79UGDnT2VP0PwAwED1EpM6/WoS0RCc69D8AsOlEDQLOv/v4FUG1IPQ/APB3KaJgzb+x9D7aggf0PwCQlQQBwMy/j/5XXY/u8z8AEIlWKSDMv+lMC6DZ1fM/ABCBjReBy78rwRDAYL3zPwDQ08zJ4sq/uNp1KySl8z8AkBIuQEXKvwLQn80ijfM/APAdaHeoyb8ceoTFW3XzPwAwSGltDMm/4jatSc5d8z8AwEWmIHHIv0DUTZh5RvM/ADAUtI/Wx78ky//OXC/zPwBwYjy4PMe/SQ2hdXcY8z8AYDebmqPGv5A5PjfIAfM/AKC3VDELxr9B+JW7TuvyPwAwJHZ9c8W/0akZAgrV8j8AMMKPe9zEvyr9t6j5vvI/AADSUSxGxL+rGwx6HKnyPwAAg7yKsMO/MLUUYHKT8j8AAElrmRvDv/WhV1f6ffI/AECkkFSHwr+/Ox2bs2jyPwCgefi588G/vfWPg51T8j8AoCwlyGDBvzsIyaq3PvI/ACD3V3/OwL+2QKkrASryPwCg/kncPMC/MkHMlnkV8j8AgEu8vVe/v5v80h0gAfI/AEBAlgg3vr8LSE1J9OzxPwBA+T6YF72/aWWPUvXY8T8AoNhOZ/m7v3x+VxEjxfE/AGAvIHncur/pJst0fLHxPwCAKOfDwLm/thosDAGe8T8AwHKzRqa4v71wtnuwivE/AACsswGNt7+2vO8linfxPwAAOEXxdLa/2jFMNY1k8T8AgIdtDl61v91fJ5C5UfE/AOCh3lxItL9M0jKkDj/xPwCgak3ZM7O/2vkQcoss8T8AYMX4eSCyvzG17CgwGvE/ACBimEYOsb+vNITa+wfxPwAA0mps+q+/s2tOD+718D8AQHdKjdqtv86fKl0G5PA/AACF5Oy8q78hpSxjRNLwPwDAEkCJoam/GpjifKfA8D8AwAIzWIinv9E2xoMvr/A/AIDWZ15xpb85E6CY253wPwCAZUmKXKO/3+dSr6uM8D8AQBVk40mhv/soTi+fe/A/AIDrgsBynr8ZjzWMtWrwPwCAUlLxVZq/LPnspe5Z8D8AgIHPYj2Wv5As0c1JSfA/AACqjPsokr+prfDGxjjwPwAA+SB7MYy/qTJ5E2Uo8D8AAKpdNRmEv0hz6ickGPA/AADswgMSeL+VsRQGBAjwPwAAJHkJBGC/Gvom9x/g7z8AAJCE8+9vP3TqYcIcoe8/AAA9NUHchz8umYGwEGPvPwCAwsSjzpM/za3uPPYl7z8AAIkUwZ+bP+cTkQPI6e4/AAARztiwoT+rsct4gK7uPwDAAdBbiqU/mwydohp07j8AgNhAg1ypP7WZCoOROu4/AIBX72onrT9WmmAJ4AHuPwDAmOWYdbA/mLt35QHK7T8AIA3j9VOyPwORfAvyku0/AAA4i90utD/OXPtmrFztPwDAV4dZBrY/nd5eqiwn7T8AAGo1dtq3P80saz5u8uw/AGAcTkOruT8Ceaeibb7sPwBgDbvHeLs/bQg3bSaL7D8AIOcyE0O9PwRYXb2UWOw/AGDecTEKvz+Mn7sztSbsPwBAkSsVZ8A/P+fs7oP16z8AsJKChUfBP8GW23X9xOs/ADDKzW4mwj8oSoYMHpXrPwBQxabXA8M/LD7vxeJl6z8AEDM8w9/DP4uIyWdIN+s/AIB6aza6xD9KMB0hSwnrPwDw0Sg5k8U/fu/yhejb6j8A8BgkzWrGP6I9YDEdr+o/AJBm7PhAxz+nWNM/5oLqPwDwGvXAFcg/i3MJ70BX6j8AgPZUKenIPydLq5AqLOo/AED4Aja7yT/R8pMToAHqPwAALBzti8o/GzzbJJ/X6T8A0AFcUVvLP5CxxwUlruk/AMC8zGcpzD8vzpfyLoXpPwBgSNU19sw/dUuk7rpc6T8AwEY0vcHNPzhI553GNOk/AODPuAGMzj/mUmcvTw3pPwCQF8AJVc8/ndf/jlLm6D8AuB8SbA7QP3wAzJ/Ov+g/ANCTDrhx0D8Ow77awJnoPwBwhp5r1NA/+xcjqid06D8A0EszhzbRPwias6wAT+g/AEgjZw2Y0T9VPmXoSSroPwCAzOD/+NE/YAL0lQEG6D8AaGPXX1nSPymj4GMl4uc/AKgUCTC50j+ttdx3s77nPwBgQxByGNM/wiWXZ6qb5z8AGOxtJnfTP1cGF/IHeec/ADCv+0/V0z8ME9bbylbnPwDgL+PuMtQ/a7ZPAQAQ5j88W0KRbAJ+PJW0TQMAMOY/QV0ASOq/jTx41JQNAFDmP7el1oanf448rW9OBwBw5j9MJVRr6vxhPK4P3/7/j+Y//Q5ZTCd+fLy8xWMHALDmPwHa3EhowYq89sFcHgDQ5j8Rk0mdHD+DPD72Bev/7+Y/Uy3iGgSAfryAl4YOABDnP1J5CXFm/3s8Euln/P8v5z8kh70m4gCMPGoRgd//T+c/0gHxbpECbryQnGcPAHDnP3ScVM1x/Ge8Nch++v+P5z+DBPWewb6BPObCIP7/r+c/ZWTMKRd+cLwAyT/t/8/nPxyLewhygIC8dhom6f/v5z+u+Z1tKMCNPOijnAQAEOg/M0zlUdJ/iTyPLJMXADDoP4HzMLbp/oq8nHMzBgBQ6D+8NWVrv7+JPMaJQiAAcOg/dXsR82W/i7wEefXr/4/oP1fLPaJuAIm83wS8IgCw6D8KS+A43wB9vIobDOX/z+g/BZ//RnEAiLxDjpH8/+/oPzhwetB7gYM8x1/6HgAQ6T8DtN92kT6JPLl7RhMAMOk/dgKYS06AfzxvB+7m/0/pPy5i/9nwfo+80RI83v9v6T+6OCaWqoJwvA2KRfT/j+k/76hkkRuAh7w+Lpjd/6/pPzeTWorgQIe8ZvtJ7f/P6T8A4JvBCM4/PFGc8SAA8Ok/CluIJ6o/irwGsEURABDqP1baWJlI/3Q8+va7BwAw6j8YbSuKq76MPHkdlxAAUOo/MHl43cr+iDxILvUdAHDqP9ur2D12QY+8UjNZHACQ6j8SdsKEAr+OvEs+TyoAsOo/Xz//PAT9abzRHq7X/8/qP7RwkBLnPoK8eARR7v/v6j+j3g7gPgZqPFsNZdv/D+s/uQofOMgGWjxXyqr+/y/rPx08I3QeAXm83LqV2f9P6z+fKoZoEP95vJxlniQAcOs/Pk+G0EX/ijxAFof5/4/rP/nDwpZ3/nw8T8sE0v+v6z/EK/LuJ/9jvEVcQdL/z+s/Ieo77rf/bLzfCWP4/+/rP1wLLpcDQYG8U3a14f8P7D8ZareUZMGLPONX+vH/L+w/7cYwje/+ZLwk5L/c/0/sP3VH7LxoP4S897lU7f9v7D/s4FPwo36EPNWPmev/j+w/8ZL5jQaDczyaISUhALDsPwQOGGSO/Wi8nEaU3f/P7D9y6sccvn6OPHbE/er/7+w//oifrTm+jjwr+JoWABDtP3FauaiRfXU8HfcPDQAw7T/ax3BpkMGJPMQPeer/T+0/DP5YxTcOWLzlh9wuAHDtP0QPwU3WgH+8qoLcIQCQ7T9cXP2Uj3x0vIMCa9j/r+0/fmEhxR1/jDw5R2wpANDtP1Ox/7KeAYg89ZBE5f/v7T+JzFLG0gBuPJT2q83/D+4/0mktIECDf7zdyFLb/y/uP2QIG8rBAHs87xZC8v9P7j9Rq5SwqP9yPBFeiuj/b+4/Wb7vsXP2V7wN/54RAJDuPwHIC16NgIS8RBel3/+v7j+1IEPVBgB4PKF/EhoA0O4/klxWYPgCULzEvLoHAPDuPxHmNV1EQIW8Ao169f8P7z8Fke85MftPvMeK5R4AMO8/VRFz8qyBijyUNIL1/0/vP0PH19RBP4o8a0yp/P9v7z91eJgc9AJivEHE+eH/j+8/S+d39NF9dzx+4+DS/6/vPzGjfJoZAW+8nuR3HADQ7z+xrM5L7oFxPDHD4Pf/7+8/WodwATcFbrxuYGX0/w/wP9oKHEmtfoq8WHqG8/8v8D/gsvzDaX+XvBcN/P3/T/A/W5TLNP6/lzyCTc0DAHDwP8tW5MCDAII86Mvy+f+P8D8adTe+3/9tvGXaDAEAsPA/6ybmrn8/kbw406QBANDwP/efSHn6fYA8/f3a+v/v8D/Aa9ZwBQR3vJb9ugsAEPE/YgtthNSAjjxd9OX6/y/xP+82/WT6v5082ZrVDQBQ8T+uUBJwdwCaPJpVIQ8AcPE/7t7j4vn9jTwmVCf8/4/xP3NyO9wwAJE8WTw9EgCw8T+IAQOAeX+ZPLeeKfj/z/E/Z4yfqzL5ZbwA1Ir0/+/xP+tbp52/f5M8pIaLDAAQ8j8iW/2Ra4CfPANDhQMAMPI/M7+f68L/kzyE9rz//0/yP3IuLn7nAXY82SEp9f9v8j9hDH92u/x/PDw6kxQAkPI/K0ECPMoCcrwTY1UUALDyPwIf8jOCgJK8O1L+6//P8j/y3E84fv+IvJatuAsA8PI/xUEwUFH/hbyv4nr7/w/zP50oXohxAIG8f1+s/v8v8z8Vt7c/Xf+RvFZnpgwAUPM/vYKLIoJ/lTwh9/sRAHDzP8zVDcS6AIA8uS9Z+f+P8z9Rp7ItnT+UvELS3QQAsPM/4Th2cGt/hTxXybL1/8/zPzESvxA6Ano8GLSw6v/v8z+wUrFmbX+YPPSvMhUAEPQ/JIUZXzf4Zzwpi0cXADD0P0NR3HLmAYM8Y7SV5/9P9D9aibK4af+JPOB1BOj/b/Q/VPLCm7HAlbznwW/v/4/0P3IqOvIJQJs8BKe+5f+v9D9FfQ2/t/+UvN4nEBcA0PQ/PWrccWTAmbziPvAPAPD0PxxThQuJf5c80UvcEgAQ9T82pGZxZQRgPHonBRYAMPU/CTIjzs6/lrxMcNvs/0/1P9ehBQVyAom8qVRf7/9v9T8SZMkO5r+bPBIQ5hcAkPU/kO+vgcV+iDySPskDALD1P8AMvwoIQZ+8vBlJHQDQ9T8pRyX7KoGYvIl6uOf/7/U/BGntgLd+lLz+gitlRxVnQAAAAAAAADhDAAD6/kIudr86O568mvcMvb39/////98/PFRVVVVVxT+RKxfPVVWlPxfQpGcREYE/AAAAAAAAyELvOfr+Qi7mPyTEgv+9v84/tfQM1whrrD/MUEbSq7KDP4Q6Tpvg11U/AAAAAAAAAAAAAAAAAADwP26/iBpPO5s8NTP7qT327z9d3NicE2BxvGGAdz6a7O8/0WaHEHpekLyFf27oFePvPxP2ZzVS0ow8dIUV07DZ7z/6jvkjgM6LvN723Slr0O8/YcjmYU73YDzIm3UYRcfvP5nTM1vko5A8g/PGyj6+7z9te4NdppqXPA+J+WxYte8//O/9khq1jjz3R3IrkqzvP9GcL3A9vj48otHTMuyj7z8LbpCJNANqvBvT/q9mm+8/Dr0vKlJWlbxRWxLQAZPvP1XqTozvgFC8zDFswL2K7z8W9NW5I8mRvOAtqa6agu8/r1Vc6ePTgDxRjqXImHrvP0iTpeoVG4C8e1F9PLhy7z89Mt5V8B+PvOqNjDj5au8/v1MTP4yJizx1y2/rW2PvPybrEXac2Za81FwEhOBb7z9gLzo+9+yaPKq5aDGHVO8/nTiGy4Lnj7wd2fwiUE3vP43DpkRBb4o81oxiiDtG7z99BOSwBXqAPJbcfZFJP+8/lKio4/2Oljw4YnVuejjvP31IdPIYXoc8P6ayT84x7z/y5x+YK0eAPN184mVFK+8/XghxP3u4lryBY/Xh3yTvPzGrCW3h94I84d4f9Z0e7z/6v28amyE9vJDZ2tB/GO8/tAoMcoI3izwLA+SmhRLvP4/LzomSFG48Vi8+qa8M7z+2q7BNdU2DPBW3MQr+Bu8/THSs4gFChjwx2Ez8cAHvP0r401053Y88/xZksgj87j8EW447gKOGvPGfkl/F9u4/aFBLzO1KkrzLqTo3p/HuP44tURv4B5m8ZtgFba7s7j/SNpQ+6NFxvPef5TTb5+4/FRvOsxkZmbzlqBPDLePuP21MKqdIn4U8IjQSTKbe7j+KaSh6YBKTvByArARF2u4/W4kXSI+nWLwqLvchCtbuPxuaSWebLHy8l6hQ2fXR7j8RrMJg7WNDPC2JYWAIzu4/72QGOwlmljxXAB3tQcruP3kDodrhzG480DzBtaLG7j8wEg8/jv+TPN7T1/Aqw+4/sK96u86QdjwnKjbV2r/uP3fgVOu9HZM8Dd39mbK87j+Oo3EANJSPvKcsnXayue4/SaOT3Mzeh7xCZs+i2rbuP184D73G3ni8gk+dViu07j/2XHvsRhKGvA+SXcqkse4/jtf9GAU1kzzaJ7U2R6/uPwWbii+3mHs8/ceX1BKt7j8JVBzi4WOQPClUSN0Hq+4/6sYZUIXHNDy3RlmKJqnuPzXAZCvmMpQ8SCGtFW+n7j+fdplhSuSMvAncdrnhpe4/qE3vO8UzjLyFVTqwfqTuP67pK4l4U4S8IMPMNEaj7j9YWFZ43c6TvCUiVYI4ou4/ZBl+gKoQVzxzqUzUVaHuPygiXr/vs5O8zTt/Zp6g7j+CuTSHrRJqvL/aC3USoO4/7qltuO9nY7wvGmU8sp/uP1GI4FQ93IC8hJRR+X2f7j/PPlp+ZB94vHRf7Oh1n+4/sH2LwEruhrx0gaVImp/uP4rmVR4yGYa8yWdCVuuf7j/T1Aley5yQPD9d3k9poO4/HaVNudwye7yHAetzFKHuP2vAZ1T97JQ8MsEwAe2h7j9VbNar4etlPGJOzzbzou4/Qs+zL8WhiLwSGj5UJ6TuPzQ3O/G2aZO8E85MmYml7j8e/xk6hF6AvK3HI0Yap+4/bldy2FDUlLztkkSb2ajuPwCKDltnrZA8mWaK2ceq7j+06vDBL7eNPNugKkLlrO4//+fFnGC2ZbyMRLUWMq/uP0Rf81mD9ns8NncVma6x7j+DPR6nHwmTvMb/kQtbtO4/KR5si7ipXbzlxc2wN7fuP1m5kHz5I2y8D1LIy0S67j+q+fQiQ0OSvFBO3p+Cve4/S45m12zKhby6B8pw8cDuPyfOkSv8r3E8kPCjgpHE7j+7cwrhNdJtPCMj4xljyO4/YyJiIgTFh7xl5V17ZszuP9Ux4uOGHIs8My1K7JvQ7j8Vu7zT0buRvF0lPrID1e4/0jHunDHMkDxYszATntnuP7Nac26EaYQ8v/15VWve7j+0nY6Xzd+CvHrz079r4+4/hzPLkncajDyt01qZn+juP/rZ0UqPe5C8ZraNKQfu7j+6rtxW2cNVvPsVT7ii8+4/QPamPQ6kkLw6WeWNcvnuPzSTrTj01mi8R1778nb/7j81ilhr4u6RvEoGoTCwBe8/zd1fCtf/dDzSwUuQHgzvP6yYkvr7vZG8CR7XW8IS7z+zDK8wrm5zPJxShd2bGe8/lP2fXDLjjjx60P9fqyDvP6xZCdGP4IQ8S9FXLvEn7z9nGk44r81jPLXnBpRtL+8/aBmSbCxrZzxpkO/cIDfvP9K1zIMYioC8+sNdVQs/7z9v+v8/Xa2PvHyJB0otR+8/Sal1OK4NkLzyiQ0Ih0/vP6cHPaaFo3Q8h6T73BhY7z8PIkAgnpGCvJiDyRbjYO8/rJLB1VBajjyFMtsD5mnvP0trAaxZOoQ8YLQB8yFz7z8fPrQHIdWCvF+bezOXfO8/yQ1HO7kqibwpofUURobvP9OIOmAEtnQ89j+L5y6Q7z9xcp1R7MWDPINMx/tRmu8/8JHTjxL3j7zakKSir6TvP310I+KYro288WeOLUiv7z8IIKpBvMOOPCdaYe4buu8/Muupw5QrhDyXums3K8XvP+6F0TGpZIo8QEVuW3bQ7z/t4zvkujeOvBS+nK392+8/nc2RTTuJdzzYkJ6BwefvP4nMYEHBBVM88XGPK8Lz7z8AOPr+Qi7mPzBnx5NX8y49AAAAAAAA4L9gVVVVVVXlvwYAAAAAAOA/TlVZmZmZ6T96pClVVVXlv+lFSJtbSfK/wz8miysA8D8AAAAAAKD2PwAAAAAAAAAAAMi58oIs1r+AVjcoJLT6PAAAAAAAgPY/AAAAAAAAAAAACFi/vdHVvyD34NgIpRy9AAAAAABg9j8AAAAAAAAAAABYRRd3dtW/bVC21aRiI70AAAAAAED2PwAAAAAAAAAAAPgth60a1b/VZ7Ce5ITmvAAAAAAAIPY/AAAAAAAAAAAAeHeVX77Uv+A+KZNpGwS9AAAAAAAA9j8AAAAAAAAAAABgHMKLYdS/zIRMSC/YEz0AAAAAAOD1PwAAAAAAAAAAAKiGhjAE1L86C4Lt80LcPAAAAAAAwPU/AAAAAAAAAAAASGlVTKbTv2CUUYbGsSA9AAAAAACg9T8AAAAAAAAAAACAmJrdR9O/koDF1E1ZJT0AAAAAAID1PwAAAAAAAAAAACDhuuLo0r/YK7eZHnsmPQAAAAAAYPU/AAAAAAAAAAAAiN4TWonSvz+wz7YUyhU9AAAAAABg9T8AAAAAAAAAAACI3hNaidK/P7DPthTKFT0AAAAAAED1PwAAAAAAAAAAAHjP+0Ep0r922lMoJFoWvQAAAAAAIPU/AAAAAAAAAAAAmGnBmMjRvwRU52i8rx+9AAAAAAAA9T8AAAAAAAAAAACoq6tcZ9G/8KiCM8YfHz0AAAAAAOD0PwAAAAAAAAAAAEiu+YsF0b9mWgX9xKgmvQAAAAAAwPQ/AAAAAAAAAAAAkHPiJKPQvw4D9H7uawy9AAAAAACg9D8AAAAAAAAAAADQtJQlQNC/fy30nrg28LwAAAAAAKD0PwAAAAAAAAAAANC0lCVA0L9/LfSeuDbwvAAAAAAAgPQ/AAAAAAAAAAAAQF5tGLnPv4c8masqVw09AAAAAABg9D8AAAAAAAAAAABg3Mut8M6/JK+GnLcmKz0AAAAAAED0PwAAAAAAAAAAAPAqbgcnzr8Q/z9UTy8XvQAAAAAAIPQ/AAAAAAAAAAAAwE9rIVzNvxtoyruRuiE9AAAAAAAA9D8AAAAAAAAAAACgmsf3j8y/NISfaE95Jz0AAAAAAAD0PwAAAAAAAAAAAKCax/ePzL80hJ9oT3knPQAAAAAA4PM/AAAAAAAAAAAAkC10hsLLv4+3izGwThk9AAAAAADA8z8AAAAAAAAAAADAgE7J88q/ZpDNP2NOujwAAAAAAKDzPwAAAAAAAAAAALDiH7wjyr/qwUbcZIwlvQAAAAAAoPM/AAAAAAAAAAAAsOIfvCPKv+rBRtxkjCW9AAAAAACA8z8AAAAAAAAAAABQ9JxaUsm/49TBBNnRKr0AAAAAAGDzPwAAAAAAAAAAANAgZaB/yL8J+tt/v70rPQAAAAAAQPM/AAAAAAAAAAAA4BACiavHv1hKU3KQ2ys9AAAAAABA8z8AAAAAAAAAAADgEAKJq8e/WEpTcpDbKz0AAAAAACDzPwAAAAAAAAAAANAZ5w/Wxr9m4rKjauQQvQAAAAAAAPM/AAAAAAAAAAAAkKdwMP/FvzlQEJ9Dnh69AAAAAAAA8z8AAAAAAAAAAACQp3Aw/8W/OVAQn0OeHr0AAAAAAODyPwAAAAAAAAAAALCh4+Umxb+PWweQi94gvQAAAAAAwPI/AAAAAAAAAAAAgMtsK03Evzx4NWHBDBc9AAAAAADA8j8AAAAAAAAAAACAy2wrTcS/PHg1YcEMFz0AAAAAAKDyPwAAAAAAAAAAAJAeIPxxw786VCdNhnjxPAAAAAAAgPI/AAAAAAAAAAAA8B/4UpXCvwjEcRcwjSS9AAAAAABg8j8AAAAAAAAAAABgL9Uqt8G/lqMRGKSALr0AAAAAAGDyPwAAAAAAAAAAAGAv1Sq3wb+WoxEYpIAuvQAAAAAAQPI/AAAAAAAAAAAAkNB8ftfAv/Rb6IiWaQo9AAAAAABA8j8AAAAAAAAAAACQ0Hx+18C/9FvoiJZpCj0AAAAAACDyPwAAAAAAAAAAAODbMZHsv7/yM6NcVHUlvQAAAAAAAPI/AAAAAAAAAAAAACtuBye+vzwA8CosNCo9AAAAAAAA8j8AAAAAAAAAAAAAK24HJ76/PADwKiw0Kj0AAAAAAODxPwAAAAAAAAAAAMBbj1RevL8Gvl9YVwwdvQAAAAAAwPE/AAAAAAAAAAAA4Eo6bZK6v8iqW+g1OSU9AAAAAADA8T8AAAAAAAAAAADgSjptkrq/yKpb6DU5JT0AAAAAAKDxPwAAAAAAAAAAAKAx1kXDuL9oVi9NKXwTPQAAAAAAoPE/AAAAAAAAAAAAoDHWRcO4v2hWL00pfBM9AAAAAACA8T8AAAAAAAAAAABg5YrS8La/2nMzyTeXJr0AAAAAAGDxPwAAAAAAAAAAACAGPwcbtb9XXsZhWwIfPQAAAAAAYPE/AAAAAAAAAAAAIAY/Bxu1v1dexmFbAh89AAAAAABA8T8AAAAAAAAAAADgG5bXQbO/3xP5zNpeLD0AAAAAAEDxPwAAAAAAAAAAAOAbltdBs7/fE/nM2l4sPQAAAAAAIPE/AAAAAAAAAAAAgKPuNmWxvwmjj3ZefBQ9AAAAAAAA8T8AAAAAAAAAAACAEcAwCq+/kY42g55ZLT0AAAAAAADxPwAAAAAAAAAAAIARwDAKr7+RjjaDnlktPQAAAAAA4PA/AAAAAAAAAAAAgBlx3UKrv0xw1uV6ghw9AAAAAADg8D8AAAAAAAAAAACAGXHdQqu/THDW5XqCHD0AAAAAAMDwPwAAAAAAAAAAAMAy9lh0p7/uofI0RvwsvQAAAAAAwPA/AAAAAAAAAAAAwDL2WHSnv+6h8jRG/Cy9AAAAAACg8D8AAAAAAAAAAADA/rmHnqO/qv4m9bcC9TwAAAAAAKDwPwAAAAAAAAAAAMD+uYeeo7+q/ib1twL1PAAAAAAAgPA/AAAAAAAAAAAAAHgOm4Kfv+QJfnwmgCm9AAAAAACA8D8AAAAAAAAAAAAAeA6bgp+/5Al+fCaAKb0AAAAAAGDwPwAAAAAAAAAAAIDVBxu5l785pvqTVI0ovQAAAAAAQPA/AAAAAAAAAAAAAPywqMCPv5ym0/Z8Ht+8AAAAAABA8D8AAAAAAAAAAAAA/LCowI+/nKbT9nwe37wAAAAAACDwPwAAAAAAAAAAAAAQayrgf7/kQNoNP+IZvQAAAAAAIPA/AAAAAAAAAAAAABBrKuB/v+RA2g0/4hm9AAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO8/AAAAAAAAAAAAAIl1FRCAP+grnZlrxxC9AAAAAACA7z8AAAAAAAAAAACAk1hWIJA/0vfiBlvcI70AAAAAAEDvPwAAAAAAAAAAAADJKCVJmD80DFoyuqAqvQAAAAAAAO8/AAAAAAAAAAAAQOeJXUGgP1PX8VzAEQE9AAAAAADA7j8AAAAAAAAAAAAALtSuZqQ/KP29dXMWLL0AAAAAAIDuPwAAAAAAAAAAAMCfFKqUqD99JlrQlXkZvQAAAAAAQO4/AAAAAAAAAAAAwN3Nc8usPwco2EfyaBq9AAAAAAAg7j8AAAAAAAAAAADABsAx6q4/ezvJTz4RDr0AAAAAAODtPwAAAAAAAAAAAGBG0TuXsT+bng1WXTIlvQAAAAAAoO0/AAAAAAAAAAAA4NGn9b2zP9dO26VeyCw9AAAAAABg7T8AAAAAAAAAAACgl01a6bU/Hh1dPAZpLL0AAAAAAEDtPwAAAAAAAAAAAMDqCtMAtz8y7Z2pjR7sPAAAAAAAAO0/AAAAAAAAAAAAQFldXjO5P9pHvTpcESM9AAAAAADA7D8AAAAAAAAAAABgrY3Iars/5Wj3K4CQE70AAAAAAKDsPwAAAAAAAAAAAEC8AViIvD/TrFrG0UYmPQAAAAAAYOw/AAAAAAAAAAAAIAqDOce+P+BF5q9owC29AAAAAABA7D8AAAAAAAAAAADg2zmR6L8//QqhT9Y0Jb0AAAAAAADsPwAAAAAAAAAAAOAngo4XwT/yBy3OeO8hPQAAAAAA4Os/AAAAAAAAAAAA8CN+K6rBPzSZOESOpyw9AAAAAACg6z8AAAAAAAAAAACAhgxh0cI/obSBy2ydAz0AAAAAAIDrPwAAAAAAAAAAAJAVsPxlwz+JcksjqC/GPAAAAAAAQOs/AAAAAAAAAAAAsDODPZHEP3i2/VR5gyU9AAAAAAAg6z8AAAAAAAAAAACwoeTlJ8U/x31p5egzJj0AAAAAAODqPwAAAAAAAAAAABCMvk5Xxj94Ljwsi88ZPQAAAAAAwOo/AAAAAAAAAAAAcHWLEvDGP+EhnOWNESW9AAAAAACg6j8AAAAAAAAAAABQRIWNicc/BUORcBBmHL0AAAAAAGDqPwAAAAAAAAAAAAA566++yD/RLOmqVD0HvQAAAAAAQOo/AAAAAAAAAAAAAPfcWlrJP2//oFgo8gc9AAAAAAAA6j8AAAAAAAAAAADgijztk8o/aSFWUENyKL0AAAAAAODpPwAAAAAAAAAAANBbV9gxyz+q4axOjTUMvQAAAAAAwOk/AAAAAAAAAAAA4Ds4h9DLP7YSVFnESy29AAAAAACg6T8AAAAAAAAAAAAQ8Mb7b8w/0iuWxXLs8bwAAAAAAGDpPwAAAAAAAAAAAJDUsD2xzT81sBX3Kv8qvQAAAAAAQOk/AAAAAAAAAAAAEOf/DlPOPzD0QWAnEsI8AAAAAAAg6T8AAAAAAAAAAAAA3eSt9c4/EY67ZRUhyrwAAAAAAADpPwAAAAAAAAAAALCzbByZzz8w3wzK7MsbPQAAAAAAwOg/AAAAAAAAAAAAWE1gOHHQP5FO7RbbnPg8AAAAAACg6D8AAAAAAAAAAABgYWctxNA/6eo8FosYJz0AAAAAAIDoPwAAAAAAAAAAAOgngo4X0T8c8KVjDiEsvQAAAAAAYOg/AAAAAAAAAAAA+KzLXGvRP4EWpffNmis9AAAAAABA6D8AAAAAAAAAAABoWmOZv9E/t71HUe2mLD0AAAAAACDoPwAAAAAAAAAAALgObUUU0j/quka63ocKPQAAAAAA4Oc/AAAAAAAAAAAAkNx88L7SP/QEUEr6nCo9AAAAAADA5z8AAAAAAAAAAABg0+HxFNM/uDwh03riKL0AAAAAAKDnPwAAAAAAAAAAABC+dmdr0z/Id/GwzW4RPQAAAAAAgOc/AAAAAAAAAAAAMDN3UsLTP1y9BrZUOxg9AAAAAABg5z8AAAAAAAAAAADo1SO0GdQ/neCQ7DbkCD0AAAAAAEDnPwAAAAAAAAAAAMhxwo1x1D911mcJzicvvQAAAAAAIOc/AAAAAAAAAAAAMBee4MnUP6TYChuJIC69AAAAAAAA5z8AAAAAAAAAAACgOAeuItU/WcdkgXC+Lj0AAAAAAODmPwAAAAAAAAAAANDIU/d71T/vQF3u7a0fPQAAAAAAwOY/AAAAAAAAAAAAYFnfvdXVP9xlpAgqCwq9CFkAAAAAAAAAAAAAAAAAANF0ngBXnb0qgHBSD///PicKAAAAZAAAAOgDAAAQJwAAoIYBAEBCDwCAlpgAAOH1BRgAAAA1AAAAcQAAAGv////O+///kr///wBBoK8BC4AECgAAAAAAAAAZifTuMGrUAT0AAAAAAAAAAAAAAAAAAABPAAAAUAAAAFEAAABSAAAAUwAAAFQAAABVAAAAVgAAAFcAAABYAAAAWQAAAFoAAABbAAAAXAAAAF0AAABeAAAAXwAAAGAAAABhAAAAYgAAAGMAAABkAAAAZQAAAGYAAABnAAAAaAAAAGkAAABqAAAAawAAAGwAAABtAAAAbgAAAG8AAABwAAAAcQAAAHIAAABzAAAAdAAAAHUAAAB2AAAAdwAAAHgAAAB5AAAAegAAAHsAAAB8AAAAfQAAAH4AAAB/AAAAgAAAAIEAAACCAAAAgwAAAIQAAACFAAAAhgAAAIcAAACIAAAAiQAAAIoAAACLAAAAjAAAAI0AAACOAAAAjwAAAJAAAACRAAAAkgAAAJMAAACUAAAAlQAAAJYAAACXAAAAmAAAAJkAAACaAAAAmwAAAJwAAACdAAAAngAAAJ8AAABPAAAABQAAAAAAAAAAAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArQAAAK4AAADwYQAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFkAAOBjUAAAQaCzAQsAAIvdgIAABG5hbWUBpVzxBAAFYWJvcnQBE19kZXZzX3BhbmljX2hhbmRsZXICDWVtX3NlbmRfZnJhbWUDEGVtX2NvbnNvbGVfZGVidWcEBGV4aXQFC2VtX3RpbWVfbm93BhNkZXZzX2RlcGxveV9oYW5kbGVyByBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQghZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkCRhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcKMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkCzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQMM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQOYWdnYnVmZmVyX2luaXRFD2FnZ2J1ZmZlcl9mbHVzaEYQYWdnYnVmZmVyX3VwbG9hZEcOZGV2c19idWZmZXJfb3BIEGRldnNfcmVhZF9udW1iZXJJEmRldnNfYnVmZmVyX2RlY29kZUoSZGV2c19idWZmZXJfZW5jb2RlSw9kZXZzX2NyZWF0ZV9jdHhMCXNldHVwX2N0eE0KZGV2c190cmFjZU4PZGV2c19lcnJvcl9jb2RlTxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUAljbGVhcl9jdHhRDWRldnNfZnJlZV9jdHhSCGRldnNfb29tUwlkZXZzX2ZyZWVUF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzVQd0cnlfcnVuVgxzdG9wX3Byb2dyYW1XHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRYHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVZGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaFodZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRbDmRlcGxveV9oYW5kbGVyXBNkZXBsb3lfbWV0YV9oYW5kbGVyXRZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95XhRkZXZpY2VzY3JpcHRtZ3JfaW5pdF8ZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldmARZGV2c2Nsb3VkX3Byb2Nlc3NhF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0YhNkZXZzY2xvdWRfb25fbWV0aG9kYw5kZXZzY2xvdWRfaW5pdGQYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uZQpkZXZzX3BhbmljZhhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWVnEGRldnNfZmliZXJfc2xlZXBoG2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbGkMbG9nX2ZpYmVyX29wahpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc2sRZGV2c19pbWdfZnVuX25hbWVsEmRldnNfaW1nX3JvbGVfbmFtZW0SZGV2c19maWJlcl9ieV9maWR4bhFkZXZzX2ZpYmVyX2J5X3RhZ28QZGV2c19maWJlcl9zdGFydHAUZGV2c19maWJlcl90ZXJtaWFudGVxDmRldnNfZmliZXJfcnVuchNkZXZzX2ZpYmVyX3N5bmNfbm93cxVfZGV2c19ydW50aW1lX2ZhaWx1cmV0D2RldnNfZmliZXJfcG9rZXUTamRfZ2NfYW55X3RyeV9hbGxvY3YHZGV2c19nY3cPZmluZF9mcmVlX2Jsb2NreBJkZXZzX2FueV90cnlfYWxsb2N5DmRldnNfdHJ5X2FsbG9jegtqZF9nY191bnBpbnsKamRfZ2NfZnJlZXwOZGV2c192YWx1ZV9waW59EGRldnNfdmFsdWVfdW5waW5+EmRldnNfbWFwX3RyeV9hbGxvY38UZGV2c19hcnJheV90cnlfYWxsb2OAARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OBARVkZXZzX3N0cmluZ190cnlfYWxsb2OCARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdIMBD2RldnNfZ2Nfc2V0X2N0eIQBDmRldnNfZ2NfY3JlYXRlhQEPZGV2c19nY19kZXN0cm95hgELc2Nhbl9nY19vYmqHARFwcm9wX0FycmF5X2xlbmd0aIgBEm1ldGgyX0FycmF5X2luc2VydIkBEmZ1bjFfQXJyYXlfaXNBcnJheYoBEG1ldGhYX0FycmF5X3B1c2iLARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WMARFtZXRoWF9BcnJheV9zbGljZY0BEWZ1bjFfQnVmZmVyX2FsbG9jjgEScHJvcF9CdWZmZXJfbGVuZ3RojwEVbWV0aDBfQnVmZmVyX3RvU3RyaW5nkAETbWV0aDNfQnVmZmVyX2ZpbGxBdJEBE21ldGg0X0J1ZmZlcl9ibGl0QXSSARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zkwEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOUARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SVARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSWARVmdW4xX0RldmljZVNjcmlwdF9sb2eXARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0mAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSZARRtZXRoWF9GdW5jdGlvbl9zdGFydJoBDmZ1bjFfTWF0aF9jZWlsmwEPZnVuMV9NYXRoX2Zsb29ynAEPZnVuMV9NYXRoX3JvdW5knQENZnVuMV9NYXRoX2Fic54BEGZ1bjBfTWF0aF9yYW5kb22fARNmdW4xX01hdGhfcmFuZG9tSW50oAENZnVuMV9NYXRoX2xvZ6EBDWZ1bjJfTWF0aF9wb3eiAQ5mdW4yX01hdGhfaWRpdqMBDmZ1bjJfTWF0aF9pbW9kpAEOZnVuMl9NYXRoX2ltdWylAQ1mdW4yX01hdGhfbWlupgELZnVuMl9taW5tYXinAQ1mdW4yX01hdGhfbWF4qAESZnVuMl9PYmplY3RfYXNzaWduqQEQZnVuMV9PYmplY3Rfa2V5c6oBE2Z1bjFfa2V5c19vcl92YWx1ZXOrARJmdW4xX09iamVjdF92YWx1ZXOsARBwcm9wX1BhY2tldF9yb2xlrQEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcq4BE3Byb3BfUGFja2V0X3Nob3J0SWSvARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXiwARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZLEBEXByb3BfUGFja2V0X2ZsYWdzsgEVcHJvcF9QYWNrZXRfaXNDb21tYW5kswEUcHJvcF9QYWNrZXRfaXNSZXBvcnS0ARNwcm9wX1BhY2tldF9wYXlsb2FktQETcHJvcF9QYWNrZXRfaXNFdmVudLYBFXByb3BfUGFja2V0X2V2ZW50Q29kZbcBFHByb3BfUGFja2V0X2lzUmVnU2V0uAEUcHJvcF9QYWNrZXRfaXNSZWdHZXS5ARNwcm9wX1BhY2tldF9yZWdDb2RlugETbWV0aDBfUGFja2V0X2RlY29kZbsBEmRldnNfcGFja2V0X2RlY29kZbwBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZL0BFERzUmVnaXN0ZXJfcmVhZF9jb250vgESZGV2c19wYWNrZXRfZW5jb2RlvwEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZcABFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXBARZwcm9wX0RzUGFja2V0SW5mb19uYW1lwgEWcHJvcF9Ec1BhY2tldEluZm9fY29kZcMBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX8QBFXByb3BfUm9sZV9pc0Nvbm5lY3RlZMUBFm1ldGgyX1JvbGVfc2VuZENvbW1hbmTGARJwcm9wX1N0cmluZ19sZW5ndGjHARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdMgBE21ldGgxX1N0cmluZ19jaGFyQXTJARRkZXZzX2pkX2dldF9yZWdpc3RlcsoBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTLARBkZXZzX2pkX3NlbmRfY21kzAERZGV2c19qZF93YWtlX3JvbGXNARRkZXZzX2pkX3Jlc2V0X3BhY2tldM4BE2RldnNfamRfcGt0X2NhcHR1cmXPARNkZXZzX2pkX3NlbmRfbG9nbXNn0AENaGFuZGxlX2xvZ21zZ9EBEmRldnNfamRfc2hvdWxkX3J1btIBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl0wETZGV2c19qZF9wcm9jZXNzX3BrdNQBFGRldnNfamRfcm9sZV9jaGFuZ2Vk1QESZGV2c19qZF9pbml0X3JvbGVz1gESZGV2c19qZF9mcmVlX3JvbGVz1wEQZGV2c19zZXRfbG9nZ2luZ9gBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc9kBEmRldnNfbWFwX2NvcHlfaW50b9oBDGRldnNfbWFwX3NldNsBFGRldnNfaXNfc2VydmljZV9zcGVj3AEGbG9va3Vw3QEXZGV2c19tYXBfa2V5c19vcl92YWx1ZXPeARFkZXZzX2FycmF5X2luc2VydN8BD2RldnNfbWFwX2RlbGV0ZeABGGRldnNfb2JqZWN0X2dldF9idWlsdF9pbuEBF2RldnNfZGVjb2RlX3JvbGVfcGFja2V04gEOZGV2c19yb2xlX3NwZWPjARBkZXZzX3NwZWNfbG9va3Vw5AERZGV2c19wcm90b19sb29rdXDlARJkZXZzX2Z1bmN0aW9uX2JpbmTmARFkZXZzX21ha2VfY2xvc3VyZecBDmRldnNfZ2V0X2ZuaWR46AETZGV2c19nZXRfcm9sZV9wcm90b+kBG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd+oBGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZOsBFWRldnNfZ2V0X3N0YXRpY19wcm90b+wBHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVt7QEXZGV2c19vYmplY3RfZ2V0X25vX2JpbmTuAQ9kZXZzX29iamVjdF9nZXTvAQxkZXZzX3NlcV9nZXTwAQxkZXZzX2FueV9nZXTxAQxkZXZzX2FueV9zZXTyAQxkZXZzX3NlcV9zZXTzAQ5kZXZzX2FycmF5X3NldPQBDGRldnNfYXJnX2ludPUBD2RldnNfYXJnX2RvdWJsZfYBD2RldnNfcmV0X2RvdWJsZfcBDGRldnNfcmV0X2ludPgBDWRldnNfcmV0X2Jvb2z5AQ9kZXZzX3JldF9nY19wdHL6ARFkZXZzX3NldHVwX3Jlc3VtZfsBEmRldnNfcmVnY2FjaGVfZnJlZfwBFmRldnNfcmVnY2FjaGVfZnJlZV9hbGz9ARdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZP4BE2RldnNfcmVnY2FjaGVfYWxsb2P/ARRkZXZzX3JlZ2NhY2hlX2xvb2t1cIACEWRldnNfcmVnY2FjaGVfYWdlgQIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWCAhJkZXZzX3JlZ2NhY2hlX25leHSDAg9qZF9zZXR0aW5nc19nZXSEAg9qZF9zZXR0aW5nc19zZXSFAg5kZXZzX2xvZ192YWx1ZYYCD2RldnNfc2hvd192YWx1ZYcCEGRldnNfc2hvd192YWx1ZTCIAg1jb25zdW1lX2NodW5riQINc2hhXzI1Nl9jbG9zZYoCD2pkX3NoYTI1Nl9zZXR1cIsCEGpkX3NoYTI1Nl91cGRhdGWMAhBqZF9zaGEyNTZfZmluaXNojQIUamRfc2hhMjU2X2htYWNfc2V0dXCOAhVqZF9zaGEyNTZfaG1hY19maW5pc2iPAg5qZF9zaGEyNTZfaGtkZpACDmRldnNfc3RyZm9ybWF0kQIOZGV2c19pc19zdHJpbmeSAg5kZXZzX2lzX251bWJlcpMCFGRldnNfc3RyaW5nX2dldF91dGY4lAITZGV2c19idWlsdGluX3N0cmluZ5UCFGRldnNfc3RyaW5nX3ZzcHJpbnRmlgITZGV2c19zdHJpbmdfc3ByaW50ZpcCFWRldnNfc3RyaW5nX2Zyb21fdXRmOJgCFGRldnNfdmFsdWVfdG9fc3RyaW5nmQIQYnVmZmVyX3RvX3N0cmluZ5oCEmRldnNfc3RyaW5nX2NvbmNhdJsCHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2OcAg90c2FnZ19jbGllbnRfZXadAgphZGRfc2VyaWVzngINdHNhZ2dfcHJvY2Vzc58CCmxvZ19zZXJpZXOgAhN0c2FnZ19oYW5kbGVfcGFja2V0oQIUbG9va3VwX29yX2FkZF9zZXJpZXOiAgp0c2FnZ19pbml0owIMdHNhZ2dfdXBkYXRlpAIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZaUCE2RldnNfdmFsdWVfZnJvbV9pbnSmAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbKcCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyqAIUZGV2c192YWx1ZV90b19kb3VibGWpAhFkZXZzX3ZhbHVlX3RvX2ludKoCEmRldnNfdmFsdWVfdG9fYm9vbKsCDmRldnNfaXNfYnVmZmVyrAIXZGV2c19idWZmZXJfaXNfd3JpdGFibGWtAhBkZXZzX2J1ZmZlcl9kYXRhrgITZGV2c19idWZmZXJpc2hfZGF0Ya8CFGRldnNfdmFsdWVfdG9fZ2Nfb2JqsAINZGV2c19pc19hcnJhebECEWRldnNfdmFsdWVfdHlwZW9msgIPZGV2c19pc19udWxsaXNoswISZGV2c192YWx1ZV9pZWVlX2VxtAISZGV2c19pbWdfc3RyaWR4X29rtQISZGV2c19kdW1wX3ZlcnNpb25ztgILZGV2c192ZXJpZnm3AhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc7gCGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4uQIRZGV2c19pbWdfZ2V0X3V0Zji6AhRkZXZzX2dldF9zdGF0aWNfdXRmOLsCD2RldnNfdm1fcm9sZV9va7wCDGV4cHJfaW52YWxpZL0CFGV4cHJ4X2J1aWx0aW5fb2JqZWN0vgILc3RtdDFfY2FsbDC/AgtzdG10Ml9jYWxsMcACC3N0bXQzX2NhbGwywQILc3RtdDRfY2FsbDPCAgtzdG10NV9jYWxsNMMCC3N0bXQ2X2NhbGw1xAILc3RtdDdfY2FsbDbFAgtzdG10OF9jYWxsN8YCC3N0bXQ5X2NhbGw4xwISc3RtdDJfaW5kZXhfZGVsZXRlyAIMc3RtdDFfcmV0dXJuyQIJc3RtdHhfam1wygIMc3RtdHgxX2ptcF96ywILc3RtdDFfcGFuaWPMAhJleHByeF9vYmplY3RfZmllbGTNAhJzdG10eDFfc3RvcmVfbG9jYWzOAhNzdG10eDFfc3RvcmVfZ2xvYmFszwISc3RtdDRfc3RvcmVfYnVmZmVy0AIJZXhwcjBfaW5m0QIQZXhwcnhfbG9hZF9sb2NhbNICEWV4cHJ4X2xvYWRfZ2xvYmFs0wILZXhwcjFfdXBsdXPUAgtleHByMl9pbmRleNUCD3N0bXQzX2luZGV4X3NldNYCFGV4cHJ4MV9idWlsdGluX2ZpZWxk1wISZXhwcngxX2FzY2lpX2ZpZWxk2AIRZXhwcngxX3V0ZjhfZmllbGTZAhBleHByeF9tYXRoX2ZpZWxk2gIOZXhwcnhfZHNfZmllbGTbAg9zdG10MF9hbGxvY19tYXDcAhFzdG10MV9hbGxvY19hcnJhed0CEnN0bXQxX2FsbG9jX2J1ZmZlct4CEWV4cHJ4X3N0YXRpY19yb2xl3wITZXhwcnhfc3RhdGljX2J1ZmZlcuACG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ+ECGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfiAhhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfjAhVleHByeF9zdGF0aWNfZnVuY3Rpb27kAg1leHByeF9saXRlcmFs5QIRZXhwcnhfbGl0ZXJhbF9mNjTmAhBleHByMF9wa3RfYnVmZmVy5wIRZXhwcjNfbG9hZF9idWZmZXLoAg1leHByMF9yZXRfdmFs6QIMZXhwcjFfdHlwZW9m6gIKZXhwcjBfbnVsbOsCDWV4cHIxX2lzX251bGzsAgpleHByMF90cnVl7QILZXhwcjBfZmFsc2XuAg1leHByMV90b19ib29s7wIJZXhwcjBfbmFu8AIJZXhwcjFfYWJz8QINZXhwcjFfYml0X25vdPICDGV4cHIxX2lzX25hbvMCCWV4cHIxX25lZ/QCCWV4cHIxX25vdPUCDGV4cHIxX3RvX2ludPYCCWV4cHIyX2FkZPcCCWV4cHIyX3N1YvgCCWV4cHIyX211bPkCCWV4cHIyX2RpdvoCDWV4cHIyX2JpdF9hbmT7AgxleHByMl9iaXRfb3L8Ag1leHByMl9iaXRfeG9y/QIQZXhwcjJfc2hpZnRfbGVmdP4CEWV4cHIyX3NoaWZ0X3JpZ2h0/wIaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWSAAwhleHByMl9lcYEDCGV4cHIyX2xlggMIZXhwcjJfbHSDAwhleHByMl9uZYQDFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcoUDFHN0bXR4Ml9zdG9yZV9jbG9zdXJlhgMTZXhwcngxX2xvYWRfY2xvc3VyZYcDEmV4cHJ4X21ha2VfY2xvc3VyZYgDEGV4cHIxX3R5cGVvZl9zdHKJAwxleHByMF9ub3dfbXOKAxZleHByMV9nZXRfZmliZXJfaGFuZGxliwMQc3RtdDJfY2FsbF9hcnJheYwDEGV4cHJ4X3JvbGVfcHJvdG+NAw9kZXZzX3ZtX3BvcF9hcmeOAxNkZXZzX3ZtX3BvcF9hcmdfdTMyjwMTZGV2c192bV9wb3BfYXJnX2kzMpADFmRldnNfdm1fcG9wX2FyZ19idWZmZXKRAxJqZF9hZXNfY2NtX2VuY3J5cHSSAxJqZF9hZXNfY2NtX2RlY3J5cHSTAwxBRVNfaW5pdF9jdHiUAw9BRVNfRUNCX2VuY3J5cHSVAxBqZF9hZXNfc2V0dXBfa2V5lgMOamRfYWVzX2VuY3J5cHSXAxBqZF9hZXNfY2xlYXJfa2V5mAMLamRfd3Nza19uZXeZAxRqZF93c3NrX3NlbmRfbWVzc2FnZZoDE2pkX3dlYnNvY2tfb25fZXZlbnSbAwdkZWNyeXB0nAMNamRfd3Nza19jbG9zZZ0DEGpkX3dzc2tfb25fZXZlbnSeAwpzZW5kX2VtcHR5nwMSd3Nza2hlYWx0aF9wcm9jZXNzoAMXamRfdGNwc29ja19pc19hdmFpbGFibGWhAxR3c3NraGVhbHRoX3JlY29ubmVjdKIDGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldKMDD3NldF9jb25uX3N0cmluZ6QDEWNsZWFyX2Nvbm5fc3RyaW5npQMPd3Nza2hlYWx0aF9pbml0pgMTd3Nza19wdWJsaXNoX3ZhbHVlc6cDEHdzc2tfcHVibGlzaF9iaW6oAxF3c3NrX2lzX2Nvbm5lY3RlZKkDE3dzc2tfcmVzcG9uZF9tZXRob2SqAxxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplqwMWcm9sZW1ncl9zZXJpYWxpemVfcm9sZawDD3JvbGVtZ3JfcHJvY2Vzc60DEHJvbGVtZ3JfYXV0b2JpbmSuAxVyb2xlbWdyX2hhbmRsZV9wYWNrZXSvAxRqZF9yb2xlX21hbmFnZXJfaW5pdLADGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZLEDDWpkX3JvbGVfYWxsb2OyAxBqZF9yb2xlX2ZyZWVfYWxsswMWamRfcm9sZV9mb3JjZV9hdXRvYmluZLQDEmpkX3JvbGVfYnlfc2VydmljZbUDE2pkX2NsaWVudF9sb2dfZXZlbnS2AxNqZF9jbGllbnRfc3Vic2NyaWJltwMUamRfY2xpZW50X2VtaXRfZXZlbnS4AxRyb2xlbWdyX3JvbGVfY2hhbmdlZLkDEGpkX2RldmljZV9sb29rdXC6AxhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2W7AxNqZF9zZXJ2aWNlX3NlbmRfY21kvAMRamRfY2xpZW50X3Byb2Nlc3O9Aw5qZF9kZXZpY2VfZnJlZb4DF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0vwMPamRfZGV2aWNlX2FsbG9jwAMPamRfY3RybF9wcm9jZXNzwQMVamRfY3RybF9oYW5kbGVfcGFja2V0wgMMamRfY3RybF9pbml0wwMNamRfaXBpcGVfb3BlbsQDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTFAw5qZF9pcGlwZV9jbG9zZcYDEmpkX251bWZtdF9pc192YWxpZMcDFWpkX251bWZtdF93cml0ZV9mbG9hdMgDE2pkX251bWZtdF93cml0ZV9pMzLJAxJqZF9udW1mbXRfcmVhZF9pMzLKAxRqZF9udW1mbXRfcmVhZF9mbG9hdMsDEWpkX29waXBlX29wZW5fY21kzAMUamRfb3BpcGVfb3Blbl9yZXBvcnTNAxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0zgMRamRfb3BpcGVfd3JpdGVfZXjPAxBqZF9vcGlwZV9wcm9jZXNz0AMUamRfb3BpcGVfY2hlY2tfc3BhY2XRAw5qZF9vcGlwZV93cml0ZdIDDmpkX29waXBlX2Nsb3Nl0wMNamRfcXVldWVfcHVzaNQDDmpkX3F1ZXVlX2Zyb2501QMOamRfcXVldWVfc2hpZnTWAw5qZF9xdWV1ZV9hbGxvY9cDDWpkX3Jlc3BvbmRfdTjYAw5qZF9yZXNwb25kX3UxNtkDDmpkX3Jlc3BvbmRfdTMy2gMRamRfcmVzcG9uZF9zdHJpbmfbAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZNwDC2pkX3NlbmRfcGt03QMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzeAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlct8DGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTgAxRqZF9hcHBfaGFuZGxlX3BhY2tldOEDFWpkX2FwcF9oYW5kbGVfY29tbWFuZOIDE2pkX2FsbG9jYXRlX3NlcnZpY2XjAxBqZF9zZXJ2aWNlc19pbml05AMOamRfcmVmcmVzaF9ub3flAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk5gMUamRfc2VydmljZXNfYW5ub3VuY2XnAxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZegDEGpkX3NlcnZpY2VzX3RpY2vpAxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfqAxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZesDEmFwcF9nZXRfZndfdmVyc2lvbuwDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXtAw1qZF9oYXNoX2ZudjFh7gMMamRfZGV2aWNlX2lk7wMJamRfcmFuZG9t8AMIamRfY3JjMTbxAw5qZF9jb21wdXRlX2NyY/IDDmpkX3NoaWZ0X2ZyYW1l8wMOamRfcmVzZXRfZnJhbWX0AxBqZF9wdXNoX2luX2ZyYW1l9QMNamRfcGFuaWNfY29yZfYDE2pkX3Nob3VsZF9zYW1wbGVfbXP3AxBqZF9zaG91bGRfc2FtcGxl+AMJamRfdG9faGV4+QMLamRfZnJvbV9oZXj6Aw5qZF9hc3NlcnRfZmFpbPsDB2pkX2F0b2n8AwtqZF92c3ByaW50Zv0DD2pkX3ByaW50X2RvdWJsZf4DCmpkX3NwcmludGb/AxJqZF9kZXZpY2Vfc2hvcnRfaWSABAxqZF9zcHJpbnRmX2GBBAtqZF90b19oZXhfYYIEFGpkX2RldmljZV9zaG9ydF9pZF9hgwQJamRfc3RyZHVwhAQOamRfanNvbl9lc2NhcGWFBBNqZF9qc29uX2VzY2FwZV9jb3JlhgQJamRfbWVtZHVwhwQWamRfcHJvY2Vzc19ldmVudF9xdWV1ZYgEFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWJBBFqZF9zZW5kX2V2ZW50X2V4dIoECmpkX3J4X2luaXSLBBRqZF9yeF9mcmFtZV9yZWNlaXZlZIwEHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrjQQPamRfcnhfZ2V0X2ZyYW1ljgQTamRfcnhfcmVsZWFzZV9mcmFtZY8EEWpkX3NlbmRfZnJhbWVfcmF3kAQNamRfc2VuZF9mcmFtZZEECmpkX3R4X2luaXSSBAdqZF9zZW5kkwQWamRfc2VuZF9mcmFtZV93aXRoX2NyY5QED2pkX3R4X2dldF9mcmFtZZUEEGpkX3R4X2ZyYW1lX3NlbnSWBAtqZF90eF9mbHVzaJcEEF9fZXJybm9fbG9jYXRpb26YBAxfX2ZwY2xhc3NpZnmZBAVkdW1teZoECF9fbWVtY3B5mwQHbWVtbW92ZZwEBm1lbXNldJ0ECl9fbG9ja2ZpbGWeBAxfX3VubG9ja2ZpbGWfBARmbW9koAQMX19zdGRpb19zZWVroQQNX19zdGRpb193cml0ZaIEDV9fc3RkaW9fY2xvc2WjBAxfX3N0ZGlvX2V4aXSkBApjbG9zZV9maWxlpQQIX190b3JlYWSmBAlfX3Rvd3JpdGWnBAlfX2Z3cml0ZXioBAZmd3JpdGWpBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzqgQUX19wdGhyZWFkX211dGV4X2xvY2urBBZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrrAQGX19sb2NrrQQOX19tYXRoX2Rpdnplcm+uBA5fX21hdGhfaW52YWxpZK8EA2xvZ7AEBWxvZzEwsQQHX19sc2Vla7IEBm1lbWNtcLMECl9fb2ZsX2xvY2u0BAxfX21hdGhfeGZsb3e1BApmcF9iYXJyaWVytgQMX19tYXRoX29mbG93twQMX19tYXRoX3VmbG93uAQEZmFic7kEA3Bvd7oECGNoZWNraW50uwQLc3BlY2lhbGNhc2W8BAVyb3VuZL0EBnN0cmNocr4EC19fc3RyY2hybnVsvwQGc3RyY21wwAQGc3RybGVuwQQHX191Zmxvd8IEB19fc2hsaW3DBAhfX3NoZ2V0Y8QEB2lzc3BhY2XFBAZzY2FsYm7GBAljb3B5c2lnbmzHBAdzY2FsYm5syAQNX19mcGNsYXNzaWZ5bMkEBWZtb2RsygQFZmFic2zLBAtfX2Zsb2F0c2NhbswECGhleGZsb2F0zQQIZGVjZmxvYXTOBAdzY2FuZXhwzwQGc3RydG940AQGc3RydG9k0QQSX193YXNpX3N5c2NhbGxfcmV00gQIZGxtYWxsb2PTBAZkbGZyZWXUBBhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXVBARzYnJr1gQIX19hZGR0ZjPXBAlfX2FzaGx0aTPYBAdfX2xldGYy2QQHX19nZXRmMtoECF9fZGl2dGYz2wQNX19leHRlbmRkZnRmMtwEDV9fZXh0ZW5kc2Z0ZjLdBAtfX2Zsb2F0c2l0Zt4EDV9fZmxvYXR1bnNpdGbfBA1fX2ZlX2dldHJvdW5k4AQSX19mZV9yYWlzZV9pbmV4YWN04QQJX19sc2hydGkz4gQIX19tdWx0ZjPjBAhfX211bHRpM+QECV9fcG93aWRmMuUECF9fc3VidGYz5gQMX190cnVuY3RmZGYy5wQJc3RhY2tTYXZl6AQMc3RhY2tSZXN0b3Jl6QQKc3RhY2tBbGxvY+oEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOsEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXsBBllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl7QQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k7gQMZHluQ2FsbF9qaWpp7wQWbGVnYWxzdHViJGR5bkNhbGxfamlqafAEGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAe4EBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
