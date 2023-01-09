
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AX9gBX9/f39/AGACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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AgV/AX4jAEEwayIBJAAgASAAKQNAIgY3AxggASAGNwMoAkACQCAAIAFBGGoQsgJFDQAgASgCKCECDAELIAFBIGogAEGkARBzQQAhAgsCQCACRQ0AIAEgAEHIAGopAwAiBjcDECABIAY3AygCQCAAIAFBEGoQsgINACABQSBqIABBvAEQcwwBCyABIAEpAyg3AwgCQCAAIAFBCGoQsQIiAy8BCCIERQ0AIAAgAiACLwEIIgUgBBDfAQ0AIAIoAgwgBUEDdGogAygCDCAEQQN0EJsEGgsgACACLwEIEPkBCyABQTBqJAALiQICBn8BfiMAQSBrIgEkACABIAApA0AiBzcDCCABIAc3AxgCQAJAIAAgAUEIahCyAkUNACABKAIYIQIMAQsgAUEQaiAAQaQBEHNBACECCyACLwEIIQNBACEEAkAgAC0AM0F/aiIFRQ0AIABBABD2ASEECyAEQR91IANxIARqIgRBACAEQQBKGyEGIAMhBAJAIAVBAkkNACADIQQgAEHQAGopAwBQDQAgAEEBEPYBIQQLAkAgACAEQR91IANxIARqIgQgAyAEIANIGyIDIAYgAyAGIANIGyIEayIGEH8iA0UNACADKAIMIAIoAgwgBEEDdGogBkEDdBCbBBoLIAAgAxD7ASABQSBqJAALEwAgACAAIABBABD2ARCAARD7AQt4AgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQAJAIAEgA0EIahCtAg0AIANBGGogAUGeARBzDAELIAMgAykDEDcDACABIAMgA0EYahCvAkUNACAAIAMoAhgQpwIMAQsgAEIANwMACyADQSBqJAALjwECAn8BfiMAQTBrIgEkACABIAApA0AiAzcDECABIAM3AyACQAJAIAAgAUEQahCtAg0AIAFBKGogAEGeARBzQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQrwIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQmQIgACgCmAEgASkDGDcDIAsgAUEwaiQAC7UBAgV/AX4jAEEgayIBJAAgASAAKQNAIgY3AwggASAGNwMQAkACQCAAIAFBCGoQrgINACABQRhqIABBnwEQc0EAIQIMAQsgASABKQMQNwMAIAAgASABQRhqEK8CIQILAkAgAkUNACAAQQAQ9gEhAyAAQQEQ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KDcDGCAAIAJBGGoQqwIhAyACIAIpAyA3AxAgACACQRBqEKsCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCmAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahCqAiEGIAIgAikDIDcDACAAIAIQqgIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKYAUEAKQPwTzcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoApgBIAEpAwA3AyAgAkEwaiQACwkAIABBABCmAQuoAQIDfwF+IwBBIGsiASQAIAEgAEHIAGopAwA3AxggASAAQdAAaikDACIENwMQAkAgBFANACABIAEpAxg3AwggACABQQhqEO0BIQIgASABKQMQNwMAIAAgARDvASIDRQ0AIAJFDQACQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAIgAygCBBDaAQsgACACIAMQ2gELIAAoApgBIAEpAxg3AyAgAUEgaiQACwkAIABBARCqAQu9AQIDfwF+IwBBMGsiAiQAIAIgAEHIAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQ7wEiA0UNACAAQQAQfyIERQ0AIAJBIGogAEEIIAQQqQIgAiACKQMgNwMQIAAgAkEQahB8AkAgAygCAEGAgID4AHFBgICAyABHDQAgACADKAIEIAQgARDeAQsgACADIAQgARDeASACIAIpAyA3AwggACACQQhqEH0gACgCmAEgAikDIDcDIAsgAkEwaiQACwkAIABBABCqAQurAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAi8BEhC9AkUNACAAIAIvARI2AgAgAEECNgIEDAELIABCADcDAAsgA0EQaiQAC5wBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAg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QRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCDCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EgaiQAC3ACAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDiASICDQAgA0EYaiABQa0BEHNBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQSBqJAALbQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMAIAMgBDcDEAJAIAEgAyADQQxqEOIBIgINACADQRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BAkH/H3EQpwILIANBIGokAAuJAQICfwF+IwBBIGsiASQAIAEgACkDQCIDNwMAIAEgAzcDEAJAIAAgASABQQxqEOIBIgINACABQRhqIABBrQEQc0EAIQILAkAgASgCDEH//wFHDQAgAUEYaiAAQa4BEHNBACECCwJAIAJFDQAgACACEL4BIAAgASgCDCACLwECEMwBCyABQSBqJAALaQECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADQQhqIAFBowEQcyAAQgA3AwAMAQsgACABKAKgASACKAIAQQxsaigCACgCEEEARxCoAgsgA0EQaiQAC+UBAgV/AX4jAEEgayIBJAACQAJAIAApA0AiBkKAgICA8IGA+P8Ag0KAgICAIFINACAGpyECDAELIAFBGGogAEG9ARBzQf//ASECCwJAIAJB//8BRg0AIABBABD2ASEDIAEgAEHQAGopAwAiBjcDGCABIAY3AwAgACABIAFBFGoQsAIhBAJAIANBgIAESQ0AIAFBCGogAEG+ARBzDAELAkAgASgCFCIFQe0BSQ0AIAFBCGogAEG/ARBzDAELIABB3AFqIAU6AAAgAEHgAWogBCAFEJsEGiAAIAIgAxDMAQsgAUEgaiQAC4sBAgN/AX4jAEEQayIBJAACQAJAIAApA0AiBEKAgICA8IGA+P8Ag0KAgICAIFINACAEpyECDAELIAFBCGogAEG9ARBzQf//ASECCwJAIAJB//8BRg0AIAAoApgBIgMgAy0AEEHwAXFBBHI6ABAgACgCmAEiAyAC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DAILIARBOGogAEGXARBzDAELIAQgASkDADcDIAJAIAAgBEEgahCxAiIBRQ0AIAEoAgBBgICA+ABxQYCAgBhHDQAgBCADKQMANwMYIAAgASACIARBGGoQ9QEMAQsgBEE4aiAAQZgBEHMLIARBwABqJAALzAEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQZkBEHMMAQsCQAJAIAJBAWoiBSABLwEKTQ0AIAAgBUEKbEEIbSIGQQQgBkEEShsiB0EDdBB5IgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQmwQaCyABIAc7AQogASAGNgIMIAAoAsgBIAYQegsgASgCDCACQQN0aiADKQMANwMAIAEvAQggAksNASABIAU7AQgMAQsgBEEIaiAAQZoBEHMLIARBEGokAAs+AgF/AX4jAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQqwIhACACQRBqJAAgAAtAAwF/AX4BfCMAQRBrIgIkACACIAFBA3QgAGpByABqKQMAIgM3AwAgAiADNwMIIAAgAhCqAiEEIAJBEGokACAECywBAX8jAEEQayICJAAgAkEIaiABEKYCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKcCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKgCIAAoApgBIAIpAwg3AyAgAkEQaiQACzABAX8jAEEQayICJAAgAkEIaiAAQQggARCpAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/AkAgACgCLCIDKAKYAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECELIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMA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DQEMBAsCQAJAIAMNACAAIAE2AiQMAQsgAyABNgIACyAIKAIMECEgCBAhIAENAAwDCwALIAMvAQ5BgSJHDQEgAy0AA0EBcQ0BQQAoAsxaQX9qIQggAigCACELQQAhAQJAA0ACQCABIAhMDQBBACEFDAILAkACQEHA1wAgCCABakECbSIHQQxsaiIJKAIEIgogC08NAEEBIQwgB0EBaiEBDAELQQAhDAJAIAogC0sNACAJIQUMAQsgB0F/aiEIQQEhDAsgDA0ACwsgBUUNASAAKAIkIgFFDQEgA0EQaiEMA0ACQCABKAIEIAJHDQACQCABLQAJIghFDQAgASAIQX9qOgAJCwJAIAwgAy0ADCAFLwEIEEgiDb1C////////////AINCgICAgICAgPj/AFYNAAJAIAEpAxhC////////////AINCgYCAgICAgPj/AFQNACABIA05AxggAUEANgIgIAFBOGogDTkDACABQTBqIA05AwAgAUEoakIANwMAIAEgAUHAAGooAgA2AhQLIAEgASgCIEEBajYCICABKAIUIQcCQAJAQQAoAqjBASILIAFBxABqKAIAIghrQQBIDQAgAUEoaiILIAErAxggCCAHa7iiIAsrAwCgOQMADAELIAFBKGoiCCABKwMYIAsgB2u4oiAIKwMAoDkDACALIQgLIAEgCDYCFAJAIAFBOGorAwAgDWNFDQAgASANOQM4CwJAIAFBMGorAwAgDWRFDQAgASANOQMwCyABIA05AxgLIAAoAggiCEUNACAAQQAoAqjBASAIajYCHAsgASgCACIBDQAMAgsACyABQcAARw0AIAJFDQAgACgCJCIBRQ0AA0ACQAJAIAEoAgwiCA0AQQAhDAwBCyAIIAMoAgQQwARFIQwLAkACQAJAIAEoAgQgAkcNACAMDQIgCBAhIAMoAgQQhAQhCAwBCyAMRQ0BIAgQIUEAIQgLIAEgCDYCDAsgASgCACIBDQALCw8LQbQ2QYQuQZUCQb4KEPsDAAu6AQEDf0HIABAgIgJB/wE6AAogAiABNgIEIAIgACgCJDYCACAAIAI2AiQgAkKAgICAgICA/P8ANwMYIAJBACgCqMEBIgM2AkACQCACKAIQIgQNAAJAAkAgAC0AEkUNACAAQShqIQQgACgCKA0BIARBiCc2AgAMAQsgAEEMaiEECyAEKAIAIQQLIAIgBCADajYCRAJAIAFFDQAgARC1AyIARQ0AIAIgACgCBBCEBDYCDAsgAkHaJhChAiACC+kGAgh/AnwjAEEQayIBJAACQAJAIAAoAghFDQBBACgCqMEBIAAoAhxrQQBODQELAkAgAEEYakGAwLgCEPgDRQ0AAkAgACgCJCICRQ0AA0ACQCACLQAJIAItAAhHDQAgAkEAOgAJCyACIAItAAk6AAggAigCACICDQALCyAAKAIoIgJFDQACQCACIAAoAgwiA08NACAAIAJB0A9qNgIoCyAAKAIoIANNDQAgACADNgIoCwJAIABBFGoiBEGAoAYQ+ANFDQAgACgCJCICRQ0AA0ACQCACKAIEIgNFDQAgAi0ACUExSw0AIAFB+gE6AA8CQAJAIANBg8AAIAFBD2pBARC8AyIDRQ0AIARBACgCkLkBQYDAAGo2AgAMAQsgAiABLQAPOgAJCyADDQILIAIoAgAiAg0ACwsCQCAAKAIkIgJFDQAgAEEMaiEFIABBKGohBgNAAkAgAkHEAGooAgAiA0EAKAKowQFrQX9KDQACQAJAAkAgAkEgaiIEKAIADQAgAkKAgICAgICA/P8ANwMYDAELIAIrAxggAyACKAIUa7iiIQkgAkEoaisDACEKAkACQCACKAIMIgMNAEEAIQcMAQsgAxDBBCEHCyAJIAqgIQkgB0EpahAgIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEJsEGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQkwQiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQUARQ0AIAJBgCcQoQILIAMQISAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQIQsgAigCACICDQALCyABQRBqJAAPC0HaDUEAEC0QMwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEIAEIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRBmxQgAkEgahAtDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQYEUIAJBEGoQLQwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEGLEyACEC0LIAJBwABqJAALmwUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMECEgARAhIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahCjAiECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAqjBASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahCjAiECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahCjAiECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFBsM8AEN4DQf9+ag4EAAICAQILIAAgACgCDCIBQYC4mSkgAUGAuJkpSRs2AgwPCyAAIAAoAggiAUGAuJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAqjBASABajYCHAsL+gEBBH8gAkEB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IAIoAjgiAyACKAKQAS8BDE8NACAAIAIoAgAgA0EDdGopAwA3AwAPCyAAIAJB6gAQcwtxAQF/IwBBIGsiAyQAIANBGGogAhCOAyADIAMpAxg3AxACQAJAAkAgA0EQahCUAg0AIAMoAhwNASADKAIYQQJHDQELIAAgAykDGDcDAAwBCyADIAMpAxg3AwggACACIANBCGoQqgIQpgILIANBIGokAAtKAQF/IwBBIGsiAyQAIANBGGogAhCOAyADQRBqIAIQjgMgAyADKQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADEPIBIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARCOAyACQSBqIAEQjgMgAkEYaiABEI4DIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQ8wEgAkEwaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQjgMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIABciEEAkACQCAEQX8gA0EcaiAEELYCGyIEQX9KDQAgA0E4aiACQfAAEHMgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDwAQsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEI4DIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBC2AhsiBEF/Sg0AIANBOGogAkHwABBzIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ8AELIANBwABqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhCOAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgANyIQQCQAJAIARBfyADQRxqIAQQtgIbIgRBf0oNACADQThqIAJB8AAQcyADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEPABCyADQcAAaiQAC4wBAQJ/IwBBIGsiAyQAIAIoAjghBCADIAIoApABNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEELYCGyIEQX9KDQAgA0EYaiACQfAAEHMgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDhASEEIAMgAykDEDcDACAAIAIgBCADEOsBIANBIGokAAuMAQECfyMAQSBrIgMkACACKAI4IQQgAyACKAKQATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBC2AhsiBEF/Sg0AIANBGGogAkHwABBzIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQRUQ4QEhBCADIAMpAxA3AwAgACACIAQgAxDrASADQSBqJAALRQEDfyMAQRBrIgIkAAJAIAEQfiIDDQAgAUEQEFILIAEoApgBIQQgAkEIaiABQQggAxCpAiAEIAIpAwg3AyAgAkEQaiQAC1IBA38jAEEQayICJAACQCABIAEQjwMiAxB/IgQNACABIANBA3RBEGoQUgsgASgCmAEhAyACQQhqIAFBCCAEEKkCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARCPAyIDEIABIgQNACABIANBDGoQUgsgASgCmAEhAyACQQhqIAFBCCAEEKkCIAMgAikDCDcDICACQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigAkAFBPGooAgBBA3YgAigCOCIESw0AIANBCGogAkHvABBzIABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALZQECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBAJAAkAgBEF/IANBBGogBBC2AhsiBEF/Sg0AIANBCGogAkHwABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAXIhBAJAAkAgBEF/IANBBGogBBC2AhsiBEF/Sg0AIANBCGogAkHwABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBC2AhsiBEF/Sg0AIANBCGogAkHwABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAA3IhBAJAAkAgBEF/IANBBGogBBC2AhsiBEF/Sg0AIANBCGogAkHwABBzIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigCOCIEIAIoAJABQSRqKAIAQQR2SQ0AIANBCGogAkHyABBzIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAI4EKcCC0YBAX8CQCACKAI4IgMgAigAkAFBNGooAgBBA3ZPDQAgACACKACQASICIAIoAjBqIANBA3RqKQAANwMADwsgACACQesAEHMLWAECfyMAQRBrIgMkAAJAAkAgAigAkAFBPGooAgBBA3YgAigCOCIESw0AIANBCGogAkHvABBzIABCADcDAAwBCyAAIAJBCCACIAQQ7AEQqQILIANBEGokAAtfAQN/IwBBEGsiAyQAIAIQjwMhBCACEI8DIQUgA0EIaiACQQIQkQMCQAJAIAMpAwhCAFINACAAQgA3AwAMAQsgAyADKQMINwMAIAAgAiAFIAQgA0EAEEcLIANBEGokAAsQACAAIAIoApgBKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEI4DIAMgAykDCDcDACAAIAIgAxCzAhCnAiADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACEI4DIABB4M8AQejPACADKQMIUBspAwA3AwAgA0EQaiQACw0AIABBACkD4E83AwALDQAgAEEAKQPoTzcDAAs0AQF/IwBBEGsiAyQAIANBCGogAhCOAyADIAMpAwg3AwAgACACIAMQrAIQqAIgA0EQaiQACw0AIABBACkD8E83AwALqQECAX8BfCMAQRBrIgMkACADQQhqIAIQjgMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCACIAMQqgIiBEQAAAAAAAAAAGNFDQAgACAEmhCmAgwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQPYTzcDAAwCCyAAQQAgAmsQpwIMAQsgACADKQMINwMACyADQRBqJAALDwAgACACEJADQX9zEKcCCzIBAX8jAEEQayIDJAAgA0EIaiACEI4DIAAgAygCDEUgAygCCEECRnEQqAIgA0EQaiQAC3EBAX8jAEEQayIDJAAgA0EIaiACEI4DAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAiADEKoCmhCmAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA9hPNwMADAELIABBACACaxCnAgsgA0EQaiQACzcBAX8jAEEQayIDJAAgA0EIaiACEI4DIAMgAykDCDcDACAAIAIgAxCsAkEBcxCoAiADQRBqJAALDAAgACACEJADEKcCC6oCAgR/AXwjAEHAAGsiAyQAIANBOGogAhCOAyACQRhqIgQgAykDODcDACADQThqIAIQjgMgAiADKQM4NwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQpwIMAQsgAyACQRBqIgUpAwA3AzACQAJAIAIgA0EwahCTAg0AIAMgBCkDADcDKCACIANBKGoQkwJFDQELIAMgBSkDADcDECADIAQpAwA3AwggACACIANBEGogA0EIahCcAgwBCyADIAUpAwA3AyAgAiACIANBIGoQqgI5AyAgAyAEKQMANwMYIAJBKGogAiADQRhqEKoCIgc5AwAgACAHIAIrAyCgEKYCCyADQcAAaiQAC8wBAgR/AXwjAEEgayIDJAAgA0EYaiACEI4DIAJBGGoiBCADKQMYNwMAIANBGGogAhCOAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRCnAgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQqgI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKoCIgc5AwAgACACKwMgIAehEKYCCyADQSBqJAALzgEDA38BfgF8IwBBIGsiAyQAIANBGGogAhCOAyACQRhqIgQgAykDGDcDACADQRhqIAIQjgMgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAI0AhAgAjQCGH4iBkIgiKcgBqciBUEfdUcNACAAIAUQpwIMAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEKoCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCqAiIHOQMAIAAgByACKwMgohCmAgsgA0EgaiQAC+cBAgV/AXwjAEEgayIDJAAgA0EYaiACEI4DIAJBGGoiBCADKQMYNwMAIANBGGogAhCOAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQACQAJAIAIoAhgiBUEBag4CAAIBCyACKAIQQYCAgIB4Rg0BCyACKAIQIgYgBW0iByAFbCAGRw0AIAAgBxCnAgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQqgI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEKoCIgg5AwAgACACKwMgIAijEKYCCyADQSBqJAALLAECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCECAAIAQgAygCAHEQpwILLAECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCECAAIAQgAygCAHIQpwILLAECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCECAAIAQgAygCAHMQpwILLAECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCECAAIAQgAygCAHQQpwILLAECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCECAAIAQgAygCAHUQpwILQQECfyACQRhqIgMgAhCQAzYCACACIAIQkAMiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQpgIPCyAAIAIQpwILnAEBAn8jAEEgayIDJAAgA0EYaiACEI4DIAJBGGoiBCADKQMYNwMAIANBGGogAhCOAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRiECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQtQIhAgsgACACEKgCIANBIGokAAu9AQICfwF8IwBBIGsiAyQAIANBGGogAhCOAyACQRhqIgQgAykDGDcDACADQRhqIAIQjgMgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIAIgA0EQahCqAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQqgIiBTkDACACKwMgIAVlIQIMAQsgAigCECACKAIYTCECCyAAIAIQqAIgA0EgaiQAC70BAgJ/AXwjAEEgayIDJAAgA0EYaiACEI4DIAJBGGoiBCADKQMYNwMAIANBGGogAhCOAyACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEKoCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCqAiIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhCoAiADQSBqJAALnwEBAn8jAEEgayIDJAAgA0EYaiACEI4DIAJBGGoiBCADKQMYNwMAIANBGGogAhCOAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRyECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQtQJBAXMhAgsgACACEKgCIANBIGokAAuPAQECfyMAQSBrIgIkACACQRhqIAEQjgMgASgCmAFCADcDICACIAIpAxg3AwgCQCACQQhqELQCDQACQAJAIAIoAhwiA0GAgMD/B3ENACADQQ9xQQFGDQELIAJBEGogAUH7ABBzDAELIAEgAigCGBBuIgNFDQAgASgCmAFBACkD0E83AyAgAxBwCyACQSBqJAALqQEBBX8jAEEQayICJAAgAkEIaiABEI4DQQAhAwJAIAEQkAMiBEEBSA0AAkACQCAADQAgAEUhBQwBCwNAIAAoAggiAEUhBSAARQ0BIARBAUohBiAEQX9qIQQgBg0ACwsgBQ0AIAAgASgCOCIEQQN0akEYakEAIAQgACgCEC8BCEkbIQMLAkACQCADDQAgAiABQaYBEHMMAQsgAyACKQMINwMACyACQRBqJAALqQEBBX8jAEEQayIDJABBACEEAkAgAhCQAyIFQQFIDQACQAJAIAENACABRSEGDAELA0AgASgCCCIBRSEGIAFFDQEgBUEBSiEHIAVBf2ohBSAHDQALCyAGDQAgASACKAI4IgVBA3RqQRhqQQAgBSABKAIQLwEISRshBAsCQAJAIAQNACADQQhqIAJBpwEQcyAAQgA3AwAMAQsgACAEKQMANwMACyADQRBqJAALUwECfyMAQRBrIgMkAAJAAkAgAigCOCIEIAIoAJABQSRqKAIAQQR2SQ0AIANBCGogAkGoARBzIABCADcDAAwBCyAAIAIgASAEEOcBCyADQRBqJAALqgEBA38jAEEgayIDJAAgA0EQaiACEI4DIAMgAykDEDcDCEEAIQQCQCACIANBCGoQswIiBUEKSw0AIAVBtdQAai0AACEECwJAAkAgBA0AIABCADcDAAwBCyACIAQ2AjggAyACKAKQATYCBAJAIANBBGogBEGAgAFyIgQQtgINACADQRhqIAJB8AAQcyAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EgaiQACw4AIAAgAikDsAG6EKYCC40BAQN/IwBBEGsiAyQAIANBCGogAhCOAyADIAMpAwg3AwACQAJAIAMQtAJFDQAgAigCmAEhBAwBC0EAIQQgAygCDCIFQYCAwP8HcQ0AIAVBD3FBA0cNACACIAMoAggQbSEECwJAAkAgBA0AIABCADcDAAwBCyAAIAQoAhw2AgAgAEEBNgIECyADQRBqJAALtgEBA38jAEEwayICJAAgAkEoaiABEI4DIAJBIGogARCOAyACIAIpAyg3AxACQAJAIAEgAkEQahCyAg0AIAJBGGogAUG6ARBzDAELIAIgAikDKDcDCAJAIAEgAkEIahCxAiIDLwEIIgRBCkkNACACQRhqIAFBuwEQcwwBCyABIARBAWo6ADMgASACKQMgNwNAIAFByABqIAMoAgwgBEEDdBCbBBogASgCmAEgBBBlGgsgAkEwaiQACz4BAX8CQCABLQAyIgINACAAIAFB7AAQcw8LIAEgAkF/aiICOgAyIAAgASACQf8BcUEDdGpBwABqKQMANwMAC2oBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABBzDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBwABqKQMANwMICyABIAEpAwg3AwAgACABEKsCIQAgAUEQaiQAIAALagECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHMMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akHAAGopAwA3AwgLIAEgASkDCDcDACAAIAEQqwIhACABQRBqJAAgAAvnAQECfyMAQTBrIgMkAAJAAkAgAS0AMiIEDQAg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AkBEAAAAAAAA4EMgAkQAAAAAAADgP6AgAkQAAAAAAADgQ2QgAkQAAAAAAADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgACADIAKqEMkDDwtBgICAgHghAQsgACADIAEQyQML9wEAAkAgAUEISQ0AIAAgASACtxDIAw8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQY8rQa4BQeQ1EPYDAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALswMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDKA7chAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLQYCAgIB4IQEgA0QAAAAAAADgwWMNAkH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQY8rQcoBQfg1EPYDAAtBgICAgHgh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ASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQmwQPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIF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BAMCfgZ8AX8CQCAAvSIBQoCAgICAgICJQHxC//////+fwgFWDQACQCABQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIDoCADoSIDIAOiQQArA6BcIgSiIgWgIgYgACAAIACiIgeiIgggCCAIIAhBACsD8FyiIAdBACsD6FyiIABBACsD4FyiQQArA9hcoKCgoiAHQQArA9BcoiAAQQArA8hcokEAKwPAXKCgoKIgB0EAKwO4XKIgAEEAKwOwXKJBACsDqFygoKCiIAAgA6EgBKIgACADoKIgBSAAIAahoKCgoA8LAkACQCABQjCIpyIJQZCAfmpBn4B+Sw0AAkAgAUL///////////8Ag0IAUg0AQQEQrgQPCyABQoCAgICAgID4/wBRDQECQAJAIAlBgIACcQ0AIAlB8P8BcUHw/wFHDQELIAAQrwQPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCEBCyABQoCAgICAgICNQHwiAkI0h6e3IgdBACsD6FuiIAJCLYinQf8AcUEEdCIJQYDdAGorAwCgIgggCUH43ABqKwMAIAEgAkKAgICAgICAeIN9vyAJQfjsAGorAwChIAlBgO0AaisDAKGiIgCgIgQgACAAIACiIgOiIAMgAEEAKwOYXKJBACsDkFygoiAAQQArA4hcokEAKwOAXKCgoiADQQArA/hboiAHQQArA/BboiAAIAggBKGgoKCgoCEACyAAC+4DAwF+A38GfAJAAkACQAJAAkAgAL0iAUIAUw0AIAFCIIinIgJB//8/Sw0BCwJAIAFC////////////AINCAFINAEQAAAAAAADwvyAAIACiow8LIAFCf1UNASAAIAChRAAAAAAAAAAAow8LIAJB//+//wdLDQJBgIDA/wMhA0GBeCEEAkAgAkGAgMD/A0YNACACIQMMAgsgAacNAUQAAAAAAAAAAA8LIABEAAAAAAAAUEOivSIBQiCIpyEDQct3IQQLIAQgA0HiviVqIgJBFHZqtyIFRABgn1ATRNM/oiIGIAJB//8/cUGewZr/A2qtQiCGIAFC/////w+DhL9EAAAAAAAA8L+gIgAgACAARAAAAAAAAOA/oqIiB6G9QoCAgIBwg78iCEQAACAVe8vbP6IiCaAiCiAJIAYgCqGgIAAgAEQA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IAJCACADQf//AGqtQjCGEOMEIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL2wYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABDZBEUNACADIAQQyQQhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQ4wQgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxDbBCAFQQhqKQMAIQIgBSkDACEEDAELAkAgASAIrUIwhiACQv///////z+DhCIJIAMgBEIwiKdB//8BcSIGrUIwhiAEQv///////z+DhCIKENkEQQBKDQACQCABIAkgAyAKENkERQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEOMEIAVB+ABqKQMAIQIgBSkDcCEEDAELAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEOMEIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABDjBCAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQ4wQgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEOMEIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxDjBCAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAggBnKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuOCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAFBBGohBSACQQJ0IgJB/K4BaigCACEGIAJB8K4BaigCACEHA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDEBCECCyACEMUEDQALQQEhCAJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQgCQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQxAQhAgtBACEJAkACQAJAA0AgAkEgciAJQYAIaiwAAEcNAQJAIAlBBksNAAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDEBCECCyAJQQFqIglBCEcNAAwCCwALAkAgCUEDRg0AIAlBCEYNASADRQ0CIAlBBEkNAiAJQQhGDQELAkAgASkDcCIKQgBTDQAgBSAFKAIAQX9qNgIACyADRQ0AIAlBBEkNACAKQgBTIQEDQAJAIAENACAFIAUoAgBBf2o2AgALIAlBf2oiCUEDSw0ACwsgBCAIskMAAIB/lBDdBCAEQQhqKQMAIQsgBCkDACEKDAILAkACQAJAIAkNAEEAIQkDQCACQSByIAlB9RlqLAAARw0BAkAgCUEBSw0AAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMQEIQILIAlBAWoiCUEDRw0ADAILAAsCQAJAIAkOBAABAQIBCwJAIAJBMEcNAAJAAkAgASgCBCIJIAEoAmhGDQAgBSAJQQFqNgIAIAktAAAhCQwBCyABEMQEIQkLAkAgCUFfcUHYAEcNACAEQRBqIAEgByAGIAggAxDNBCAEQRhqKQMAIQsgBCkDECEKDAYLIAEpA3BCAFMNACAFIAUoAgBBf2o2AgALIARBIGogASACIAcgBiAIIAMQzgQgBEEoaikDACELIAQpAyAhCgwEC0IAIQoCQCABKQNwQgBTDQAgBSAFKAIAQX9qNgIACxCYBEEcNgIADAELAkACQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACECDAELIAEQxAQhAgsCQAJAIAJBKEcNAEEBIQkMAQtCACEKQoCAgICAgOD//wAhCyABKQNwQgBTDQMgBSAFKAIAQX9qNgIADAMLA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARDEBCECCyACQb9/aiEIAkACQCACQVBqQQpJDQAgCEEaSQ0AIAJBn39qIQggAkHfAEYNACAIQRpPDQELIAlBAWohCQwBCwtCgICAgICA4P//ACELIAJBKUYNAgJAIAEpA3AiDEIAUw0AIAUgBSgCAEF/ajYCAAsCQAJAIANFDQAgCQ0BQgAhCgwECxCYBEEcNgIAQgAhCgwBCwNAIAlBf2ohCQJAIAxCAFMNACAFIAUoAgBBf2o2AgALQgAhCiAJDQAMAwsACyABIAoQwwQLQgAhCwsgACAKNwMAIAAgCzcDCCAEQTBqJAALzA8CCH8HfiMAQbADayIGJAACQAJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARDEBCEHC0EAIQhCACEOQQAhCQJAAkACQANAAkAgB0EwRg0AIAdBLkcNBCABKAIEIgcgASgCaEYNAiABIAdBAWo2AgQgBy0AACEHDAMLAkAgASgCBCIHIAEoAmhGDQBBASEJIAEgB0EBajYCBCAHLQAAIQcMAQtBASEJIAEQxAQhBwwACwALIAEQxAQhBwtBASEIQgAhDiAHQTBHDQADQAJAAkAgASgCBCIHIAEoAmhGDQAgASAHQQFqNgIEIActAAAhBwwBCyABEMQEIQcLIA5Cf3whDiAHQTBGDQALQQEhCEEBIQkLQoCAgICAgMD/PyEPQQAhCkIAIRBCACERQgAhEkEAIQtCACETAkACQANAIAdBIHIhDAJAAkAgB0FQaiINQQpJDQACQCAMQZ9/akEGSQ0AIAdBLkcNBQsgB0EuRw0AIAgNA0EBIQggEyEODAELIAxBqX9qIA0gB0E5ShshBwJAAkAgE0IHVQ0AIAcgCkEEdGohCgwBCwJAIBNCHFYNACAGQTBqIAcQ3gQgBkEgaiASIA9CAEKAgICAgIDA/T8Q4wQgBkEQaiAGKQMwIAZBMGpBCGopAwAgBikDICISIAZBIGpBCGopAwAiDxDjBCAGIAYpAxAgBkEQakEIaikDACAQIBEQ1wQgBkEIaikDACERIAYpAwAhEAwBCyAHRQ0AIAsNACAGQdAAaiASIA9CAEKAgICAgICA/z8Q4wQgBkHAAGogBikDUCAGQdAAakEIaikDACAQIBEQ1wQgBkHAAGpBCGopAwAhEUEBIQsgBikDQCEQCyATQgF8IRNBASEJCwJAIAEoAgQiByABKAJoRg0AIAEgB0EBajYCBCAHLQAAIQcMAQsgARDEBCEHDAALAAtBLiEHCwJAAkAgCQ0AAkACQAJAIAEpA3BCAFMNACABIAEoAgQiB0F/ajYCBCAFRQ0BIAEgB0F+ajYCBCAIRQ0CIAEgB0F9ajYCBAwCCyAFDQELIAFCABDDBAsgBkHgAGogBLdEAAAAAAAAAACiENwEIAZB6ABqKQMAIRMgBikDYCEQDAELAkAgE0IHVQ0AIBMhDwNAIApBBHQhCiAPQgF8Ig9CCFINAAsLAkACQAJAAkAgB0FfcUHQAEcNACABIAUQzwQiD0KAgICAgICAgIB/Ug0DAkAgBUUNACABKQNwQn9VDQIMAwtCACEQIAFCABDDBEIAIRMMBAtCACEPIAEpA3BCAFMNAgsgASABKAIEQX9qNgIEC0IAIQ8LAkAgCg0AIAZB8ABqIAS3RAAAAAAAAAAAohDcBCAGQfgAaikDACETIAYpA3AhEAwBCwJAIA4gEyAIG0IChiAPfEJgfCITQQAgA2utVw0AEJgEQcQANgIAIAZBoAFqIAQQ3gQgBkGQAWogBikDoAEgBkGgAWpBCGopAwBCf0L///////+///8AEOMEIAZBgAFqIAYpA5ABIAZBkAFqQQhqKQMAQn9C////////v///ABDjBCAGQYABakEIaikDACETIAYpA4ABIRAMAQsCQCATIANBnn5qrFMNAAJAIApBf0wNAANAIAZBoANqIBAgEUIAQoCAgICAgMD/v38Q1wQgECARQgBCgICAgICAgP8/ENoEIQcgBkGQA2ogECARIBAgBikDoAMgB0EASCIBGyARIAZBoANqQQhqKQMAIAEbENcEIBNCf3whEyAGQZADakEIaikDACERIAYpA5ADIRAgCkEBdCAHQX9KciIKQX9KDQALCwJAAkAgEyADrH1CIHwiDqciB0EAIAdBAEobIAIgDiACrVMbIgdB8QBIDQAgBkGAA2ogBBDeBCAGQYgDaikDACEOQgAhDyAGKQOAAyESQgAhFAwBCyAGQeACakQAAAAAAADwP0GQASAHaxDGBBDcBCAGQdACaiAEEN4EIAZB8AJqIAYpA+ACIAZB4AJqQQhqKQMAIAYpA9ACIhIgBkHQAmpBCGopAwAiDhDHBCAGQfACakEIaikDACEUIAYpA/ACIQ8LIAZBwAJqIAogB0EgSCAQIBFCAEIAENkEQQBHcSAKQQFxRXEiB2oQ3wQgBkGwAmogEiAOIAYpA8ACIAZBwAJqQQhqKQMAEOMEIAZBkAJqIAYpA7ACIAZBsAJqQQhqKQMAIA8gFBDXBCAGQaACaiASIA5CACAQIAcbQgAgESAHGxDjBCAGQYACaiAGKQOgAiAGQaACakEIaikDACAGKQOQAiAGQZACakEIaikDABDXBCAGQfABaiAGKQOAAiAGQYACakEIaikDACAPIBQQ5gQCQCAGKQPwASIQIAZB8AFqQQhqKQMAIhFCAEIAENkEDQAQmARBxAA2AgALIAZB4AFqIBAgESATpxDIBCAGQeABakEIaikDACETIAYpA+ABIRAMAQsQmARBxAA2AgAgBkHQAWogBBDeBCAGQcABaiAGKQPQASAGQdABakEIaikDAEIAQoCAgICAgMAAEOMEIAZBsAFqIAYpA8ABIAZBwAFqQQhqKQMAQgBCgICAgICAwAAQ4wQgBkGwAWpBCGopAwAhEyAGKQOwASEQCyAAIBA3AwAgACATNwMIIAZBsANqJAALlyADDH8GfgF8IwBBkMYAayIHJABBACEIQQAgBCADaiIJayEKQgAhE0EAIQsCQAJAAkADQAJAIAJBMEYNACACQS5HDQQgASgCBCICIAEoAmhGDQIgASACQQFqNgIEIAItAAAhAgwDCwJAIAEoAgQiAiABKAJoRg0AQQEhCyABIAJBAWo2AgQgAi0AACECDAELQQEhCyABEMQEIQIMAAsACyABEMQEIQILQQEhCEIAIRMgAkEwRw0AA0ACQAJAIAEoAgQiAiABKAJoRg0AIAEgAkEBajYCBCACLQAAIQIMAQsgARDEBCECCyATQn98IRMgAkEwRg0AC0EBIQtBASEIC0EAIQwgB0EANgKQBiACQVBqIQ0CQAJAAkACQAJAAkACQAJAIAJBLkYiDg0AQgAhFCANQQlNDQBBACEPQQAhEAwBC0IAIRRBACEQQQAhD0EAIQwDQAJAAkAgDkEBcUUNAAJAIAgNACAUIRNBASEIDAILIAtFIQ4MBAsgFEIBfCEUAkAgD0H8D0oNACACQTBGIQsgFKchESAHQZAGaiAPQQJ0aiEOAkAgEEUNACACIA4oAgBBCmxqQVBqIQ0LIAwgESALGyEMIA4gDTYCAEEBIQtBACAQQQFqIgIgAkEJRiICGyEQIA8gAmohDwwBCyACQTBGDQAgByAHKAKARkEBcjYCgEZB3I8BIQwLAkACQCABKAIEIgIgASgCaEYNACABIAJBAWo2AgQgAi0AACECDAELIAEQxAQhAgsgAkFQaiENIAJBLkYiDg0AIA1BCkkNAAsLIBMgFCAIGyETAkAgC0UNACACQV9xQcUARw0AAkAgASAGEM8EIhVCgICAgICAgICAf1INACAGRQ0FQgAhFSABKQNwQgBTDQAgASABKAIEQX9qNgIECyALRQ0DIBUgE3whEwwFCyALRSEOIAJBAEgNAQsgASkDcEIAUw0AIAEgASgCBEF/ajYCBAsgDkUNAgsQmARBHDYCAAtCACEUIAFCABDDBEIAIRMMAQsCQCAHKAKQBiIBDQAgByAFt0QAAAAAAAAAAKIQ3AQgB0EIaikDACETIAcpAwAhFAwBCwJAIBRCCVUNACATIBRSDQACQCADQR5KDQAgASADdg0BCyAHQTBqIAUQ3gQgB0EgaiABEN8EIAdBEGogBykDMCAHQTBqQQhqKQMAIAcpAyAgB0EgakEIaikDABDjBCAHQRBqQQhqKQMAIRMgBykDECEUDAELAkAgEyAEQX5trVcNABCYBEHEADYCACAHQeAAaiAFEN4EIAdB0ABqIAcpA2AgB0HgAGpBCGopAwBCf0L///////+///8AEOMEIAdBwABqIAcpA1AgB0HQAGpBCGopAwBCf0L///////+///8AEOMEIAdBwABqQQhqKQMAIRMgBykDQCEUDAELAkAgEyAEQZ5+aqxZDQAQmARBxAA2AgAgB0GQAWogBRDeBCAHQYABaiAHKQOQASAHQZABakEIaikDAEIAQoCAgICAgMAAEOMEIAdB8ABqIAcpA4ABIAdBgAFqQQhqKQMAQgBCgICAgICAwAAQ4wQgB0HwAGpBCGopAwAhEyAHKQNwIRQMAQsCQCAQRQ0AAkAgEEEISg0AIAdBkAZqIA9BAnRqIgIoAgAhAQNAIAFBCmwhASAQQQFqIhBBCUcNAAsgAiABNgIACyAPQQFqIQ8LIBOnIQgCQCAMQQlODQAgDCAISg0AIAhBEUoNAAJAIAhBCUcNACAHQcABaiAFEN4EIAdBsAFqIAcoApAGEN8EIAdBoAFqIAcpA8ABIAdBwAFqQQhqKQMAIAcpA7ABIAdBsAFqQQhqKQMAEOMEIAdBoAFqQQhqKQMAIRMgBykDoAEhFAwCCwJAIAhBCEoNACAHQZACaiAFEN4EIAdBgAJqIAcoApAGEN8EIAdB8AFqIAcpA5ACIAdBkAJqQQhqKQMAIAcpA4ACIAdBgAJqQQhqKQMAEOMEIAdB4AFqQQggCGtBAnRB0K4BaigCABDeBCAHQdABaiAHKQPwASAHQfABakEIaikDACAHKQPgASAHQeABakEIaikDABDbBCAHQdABakEIaikDACETIAcpA9ABIRQMAgsgBygCkAYhAQJAIAMgCEF9bGpBG2oiAkEeSg0AIAEgAnYNAQsgB0HgAmogBRDeBCAHQdACaiABEN8EIAdBwAJqIAcpA+ACIAdB4AJqQQhqKQMAIAcpA9ACIAdB0AJqQQhqKQMAEOMEIAdBsAJqIAhBAnRBqK4BaigCABDeBCAHQaACaiAHKQPAAiAHQcACakEIaikDACAHKQOwAiAHQbACakEIaikDABDjBCAHQaACakEIaikDACETIAcpA6ACIRQMAQsDQCAHQZAGaiAPIgJBf2oiD0ECdGooAgBFDQALQQAhEAJAAkAgCEEJbyIBDQBBACEODAELIAEgAUEJaiAIQX9KGyEGAkACQCACDQBBACEOQQAhAgwBC0GAlOvcA0EIIAZrQQJ0QdCuAWooAgAiC20hEUEAIQ1BACEBQQAhDgNAIAdBkAZqIAFBAnRqIg8gDygCACIPIAtuIgwgDWoiDTYCACAOQQFqQf8PcSAOIAEgDkYgDUVxIg0bIQ4gCEF3aiAIIA0bIQggESAPIAwgC2xrbCENIAFBAWoiASACRw0ACyANRQ0AIAdBkAZqIAJBAnRqIA02AgAgAkEBaiECCyAIIAZrQQlqIQgLA0AgB0GQBmogDkECdGohDAJAA0ACQCAIQSRIDQAgCEEkRw0CIAwoAgBB0en5BE8NAgsgAkH/D2ohC0EAIQ0DQAJAAkAgB0GQBmogC0H/D3EiAUECdGoiCzUCAEIdhiANrXwiE0KBlOvcA1oNAEEAIQ0MAQsgEyATQoCU69wDgCIUQoCU69wDfn0hEyAUpyENCyALIBOnIg82AgAgAiACIAIgASAPGyABIA5GGyABIAJBf2pB/w9xRxshAiABQX9qIQsgASAORw0ACyAQQWNqIRAgDUUNAAsCQCAOQX9qQf8PcSIOIAJHDQAgB0GQBmogAkH+D2pB/w9xQQJ0aiIBIAEoAgAgB0GQBmogAkF/akH/D3EiAUECdGooAgByNgIAIAEhAgsgCEEJaiEIIAdBkAZqIA5BAnRqIA02AgAMAQsLAkADQCACQQFqQf8PcSESIAdBkAZqIAJBf2pB/w9xQQJ0aiEGA0BBCUEBIAhBLUobIQ8CQANAIA4hC0EAIQECQAJAA0AgASALakH/D3EiDiACRg0BIAdBkAZqIA5BAnRqKAIAIg4gAUECdEHArgFqKAIAIg1JDQEgDiANSw0CIAFBAWoiAUEERw0ACwsgCEEkRw0AQgAhE0EAIQFCACEUA0ACQCABIAtqQf8PcSIOIAJHDQAgAkEBakH/D3EiAkECdCAHQZAGampBfGpBADYCAAsgB0GABmogB0GQBmogDkECdGooAgAQ3wQgB0HwBWogEyAUQgBCgICAgOWat47AABDjBCAHQeAFaiAHKQPwBSAHQfAFakEIaikDACAHKQOABiAHQYAGakEIaikDABDXBCAHQeAFakEIaikDACEUIAcpA+AFIRMgAUEBaiIBQQRHDQALIAdB0AVqIAUQ3gQgB0HABWogEyAUIAcpA9AFIAdB0AVqQQhqKQMAEOMEIAdBwAVqQQhqKQMAIRRCACETIAcpA8AFIRUgEEHxAGoiDSAEayIBQQAgAUEAShsgAyABIANIIggbIg5B8ABMDQJCACEWQgAhF0IAIRgMBQsgDyAQaiEQIAIhDiALIAJGDQALQYCU69wDIA92IQxBfyAPdEF/cyERQQAhASALIQ4DQCAHQZAGaiALQQJ0aiINIA0oAgAiDSAPdiABaiIBNgIAIA5BAWpB/w9xIA4gCyAORiABRXEiARshDiAIQXdqIAggARshCCANIBFxIAxsIQEgC0EBakH/D3EiCyACRw0ACyABRQ0BAkAgEiAORg0AIAdBkAZqIAJBAnRqIAE2AgAgEiECDAMLIAYgBigCAEEBcjYCAAwBCwsLIAdBkAVqRAAAAAAAAPA/QeEBIA5rEMYEENwEIAdBsAVqIAcpA5AFIAdBkAVqQQhqKQMAIBUgFBDHBCAHQbAFakEIaikDACEYIAcpA7AFIRcgB0GABWpEAAAAAAAA8D9B8QAgDmsQxgQQ3AQgB0GgBWogFSAUIAcpA4AFIAdBgAVqQQhqKQMAEMoEIAdB8ARqIBUgFCAHKQOgBSITIAdBoAVqQQhqKQMAIhYQ5gQgB0HgBGogFyAYIAcpA/AEIAdB8ARqQQhqKQMAENcEIAdB4ARqQQhqKQMAIRQgBykD4AQhFQsCQCALQQRqQf8PcSIPIAJGDQACQAJAIAdBkAZqIA9BAnRqKAIAIg9B/8m17gFLDQACQCAPDQAgC0EFakH/D3EgAkYNAgsgB0HwA2ogBbdEAAAAAAAA0D+iENwEIAdB4ANqIBMgFiAHKQPwAyAHQfADakEIaikDABDXBCAHQeADakEIaikDACEWIAcpA+ADIRMMAQsCQCAPQYDKte4BRg0AIAdB0ARqIAW3RAAAAAAAAOg/ohDcBCAHQcAEaiATIBYgBykD0AQgB0HQBGpBCGopAwAQ1wQgB0HABGpBCGopAwAhFiAHKQPABCETDAELIAW3IRkCQCALQQVqQf8PcSACRw0AIAdBkARqIBlEAAAAAAAA4D+iENwEIAdBgARqIBMgFiAHKQOQBCAHQZAEakEIaikDABDXBCAHQYAEakEIaikDACEWIAcpA4AEIRMMAQsgB0GwBGogGUQAAAAAAADoP6IQ3AQgB0GgBGogEyAWIAcpA7AEIAdBsARqQQhqKQMAENcEIAdBoARqQQhqKQMAIRYgBykDoAQhEwsgDkHvAEoNACAHQdADaiATIBZCAEKAgICAgIDA/z8QygQgBykD0AMgB0HQA2pBCGopAwBCAEIAENkEDQAgB0HAA2ogEyAWQgBCgICAgICAwP8/ENcEIAdBwANqQQhqKQMAIRYgBykDwAMhEwsgB0GwA2ogFSAUIBMgFhDXBCAHQaADaiAHKQOwAyAHQbADakEIaikDACAXIBgQ5gQgB0GgA2pBCGopAwAhFCAHKQOgAyEVAkAgDUH/////B3FBfiAJa0wNACAHQZADaiAVIBQQywQgB0GAA2ogFSAUQgBCgICAgICAgP8/EOMEIAcpA5ADIhcgB0GQA2pBCGopAwAiGEIAQoCAgICAgIC4wAAQ2gQhAiAUIAdBgANqQQhqKQMAIAJBAEgiDRshFCAVIAcpA4ADIA0bIRUCQCAQIAJBf0pqIhBB7gBqIApKDQAgCCAIIA4gAUdxIBcgGEIAQoCAgICAgIC4wAAQ2gRBAEgbQQFHDQEgEyAWQgBCABDZBEUNAQsQmARBxAA2AgALIAdB8AJqIBUgFCAQEMgEIAdB8AJqQQhqKQMAIRMgBykD8AIhFAsgACATNwMIIAAgFDcDACAHQZDGAGokAAvJBAIEfwF+AkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACEDDAELIAAQxAQhAwsCQAJAAkACQAJAIANBVWoOAwABAAELAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQxAQhAgsgA0EtRiEEIAJBRmohBSABRQ0BIAVBdUsNASAAKQNwQgBTDQIgACAAKAIEQX9qNgIEDAILIANBRmohBUEAIQQgAyECCyAFQXZJDQBCACEGAkAgAkFQaiIFQQpPDQBBACEDA0AgAiADQQpsaiEDAkACQCAAKAIEIgIgACgCaEYNACAAIAJBAWo2AgQgAi0AACECDAELIAAQxAQhAgsgA0FQaiEDAkAgAkFQaiIFQQlLDQAgA0HMmbPmAEgNAQsLIAOsIQYLAkAgBUEKTw0AA0AgAq0gBkIKfnwhBgJAAkAgACgCBCICIAAoAmhGDQAgACACQQFqNgIEIAItAAAhAgwBCyAAEMQEIQILIAZCUHwhBiACQVBqIgVBCUsNASAGQq6PhdfHwuujAVMNAAsLAkAgBUEKTw0AA0ACQAJAIAAoAgQiAiAAKAJoRg0AIAAgAkEBajYCBCACLQAAIQIMAQsgABDEBCECCyACQVBqQQpJDQALCwJAIAApA3BCAFMNACAAIAAoAgRBf2o2AgQLQgAgBn0gBiAEGyEGDAELQoCAgICAgICAgH8hBiAAKQNwQgBTDQAgACAAKAIEQX9qNgIEQoCAgICAgICAgH8PCyAGC4YBAgF/An4jAEGgAWsiBCQAIAQgATYCPCAEIAE2AhQgBEF/NgIYIARBEGpCABDDBCAEIARBEGogA0EBEMwEIARBCGopAwAhBSAEKQMAIQYCQCACRQ0AIAIgASAEKAIUIAQoAogBaiAEKAI8a2o2AgALIAAgBTcDCCAAIAY3AwAgBEGgAWokAAs1AgF/AXwjAEEQayICJAAgAiAAIAFBARDQBCACKQMAIAJBCGopAwAQ5wQhAyACQRBqJAAgAwsWAAJAIAANAEEADwsQmAQgADYCAEF/C4wwAQt/IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB9AFLDQACQEEAKALgwwEiAkEQIABBC2pBeHEgAEELSRsiA0EDdiIEdiIAQQNxRQ0AIABBf3NBAXEgBGoiA0EDdCIFQZDEAWooAgAiBEEIaiEAAkACQCAEKAIIIgYgBUGIxAFqIgVHDQBBACACQX4gA3dxNgLgwwEMAQsgBiAFNgIMIAUgBjYCCAsgBCADQQN0IgNBA3I2AgQgBCADaiIEIAQoAgRBAXI2AgQMDAsgA0EAKALowwEiB00NAQJAIABFDQACQAJAIAAgBHRBAiAEdCIAQQAgAGtycSIAQQAgAGtxQX9qIgAgAEEMdkEQcSIAdiIEQQV2QQhxIgYgAHIgBCAGdiIAQQJ2QQRxIgRyIAAgBHYiAEEBdkECcSIEciAAIAR2IgBBAXZBAXEiBHIgACAEdmoiBkEDdCIFQZDEAWooAgAiBCgCCCIAIAVBiMQBaiIFRw0AQQAgAkF+IAZ3cSICNgLgwwEMAQsgACAFNgIMIAUgADYCCAsgBEEIaiEAIAQgA0EDcjYCBCAEIANqIgUgBkEDdCIGIANrIgNBAXI2AgQgBCAGaiADNgIAAkAgB0UNACAHQQN2IghBA3RBiMQBaiEGQQAoAvTDASEEAkACQCACQQEgCHQiCHENAEEAIAIgCHI2AuDDASAGIQgMAQsgBigCCCEICyAGIAQ2AgggCCAENgIMIAQgBjYCDCAEIAg2AggLQQAgBTYC9MMBQQAgAzYC6MMBDAwLQQAoAuTDASIJRQ0BIAlBACAJa3FBf2oiACAAQQx2QRBxIgB2IgRBBXZBCHEiBiAAciAEIAZ2IgBBAnZBBHEiBHIgACAEdiIAQQF2QQJxIgRyIAAgBHYiAEEBdkEBcSIEciAAIAR2akECdEGQxgFqKAIAIgUoAgRBeHEgA2shBCAFIQYCQANAAkAgBigCECIADQAgBkEUaigCACIARQ0CCyAAKAIEQXhxIANrIgYgBCAGIARJIgYbIQQgACAFIAYbIQUgACEGDAALAAsgBSgCGCEKAkAgBSgCDCIIIAVGDQBBACgC8MMBIAUoAggiAEsaIAAgCDYCDCAIIAA2AggMCwsCQCAFQRRqIgYoAgAiAA0AIAUoAhAiAEUNAyAFQRBqIQYLA0AgBiELIAAiCEEUaiIGKAIAIgANACAIQRBqIQYgCCgCECIADQALIAtBADYCAAwKC0F/IQMgAEG/f0sNACAAQQtqIgBBeHEhA0EAKALkwwEiCUUNAEEAIQcCQCADQYACSQ0AQR8hByADQf///wdLDQAgAEEIdiIAIABBgP4/akEQdkEIcSIAdCIEIARBgOAfakEQdkEEcSIEdCIGIAZBgIAPakEQdkECcSIGdEEPdiAAIARyIAZyayIAQQF0IAMgAEEVanZBAXFyQRxqIQcLQQAgA2shBAJAAkACQAJAIAdBAnRBkMYBaigCACIGDQBBACEAQQAhCAwBC0EAIQAgA0EAQRkgB0EBdmsgB0EfRht0IQVBACEIA0ACQCAGKAIEQXhxIgIgA2siCyAETw0AIAshBCAGIQggAiADRw0AQQAhBCAGIQggBiEADAMLIAAgBkEUaigCACICIAIgBiAFQR12QQRxakEQaigCACIGRhsgACACGyEAIAVBAXQhBSAGDQALCwJAIAAgCHINAEEAIQhBAiAHdCIAQQAgAGtyIAlxIgBFDQMgAEEAIABrcUF/aiIAIABBDHZBEHEiAHYiBkEFdkEIcSIFIAByIAYgBXYiAEECdkEEcSIGciAAIAZ2IgBBAXZBAnEiBnIgACAGdiIAQQF2QQFxIgZyIAAgBnZqQQJ0QZDGAWooAgAhAAsgAEUNAQsDQCAAKAIEQXhxIANrIgIgBEkhBQJAIAAoAhAiBg0AIABBFGooAgAhBgsgAiAEIAUbIQQgACAIIAUbIQggBiEAIAYNAAsLIAhFDQAgBEEAKALowwEgA2tPDQAgCCgCGCELAkAgCCgCDCIFIAhGDQBBACgC8MMBIAgoAggiAEsaIAAgBTYCDCAFIAA2AggMCQsCQCAIQRRqIgYoAgAiAA0AIAgoAhAiAEUNAyAIQRBqIQYLA0AgBiECIAAiBUEUaiIGKAIAIgANACAFQRBqIQYgBSgCECIADQALIAJBADYCAAwICwJAQQAoAujDASIAIANJDQBBACgC9MMBIQQCQAJAIAAgA2siBkEQSQ0AQQAgBjYC6MMBQQAgBCADaiIFNgL0wwEgBSAGQQFyNgIEIAQgAGogBjYCACAEIANBA3I2AgQMAQtBAEEANgL0wwFBAEEANgLowwEgBCAAQQNyNgIEIAQgAGoiACAAKAIEQQFyNgIECyAEQQhqIQAMCgsCQEEAKALswwEiBSADTQ0AQQAgBSADayIENgLswwFBAEEAKAL4wwEiACADaiIGNgL4wwEgBiAEQQFyNgIEIAAgA0EDcjYCBCAAQQhqIQAMCgsCQAJAQQAoArjHAUUNAEEAKALAxwEhBAwBC0EAQn83AsTHAUEAQoCggICAgAQ3ArzHAUEAIAFBDGpBcHFB2KrVqgVzNgK4xwFBAEEANgLMxwFBAEEANgKcxwFBgCAhBAtBACEAIAQgA0EvaiIHaiICQQAgBGsiC3EiCCADTQ0JQQAhAAJAQQAoApjHASIERQ0AQQAoApDHASIGIAhqIgkgBk0NCiAJIARLDQoLQQAtAJzHAUEEcQ0EAkACQAJAQQAoAvjDASIERQ0AQaDHASEAA0ACQCAAKAIAIgYgBEsNACAGIAAoAgRqIARLDQMLIAAoAggiAA0ACwtBABDWBCIFQX9GDQUgCCECAkBBACgCvMcBIgBBf2oiBCAFcUUNACAIIAVrIAQgBWpBACAAa3FqIQILIAIgA00NBSACQf7///8HSw0FAkBBACgCmMcBIgBFDQBBACgCkMcBIgQgAmoiBiAETQ0GIAYgAEsNBgsgAhDWBCIAIAVHDQEMBwsgAiAFayALcSICQf7///8HSw0EIAIQ1gQiBSAAKAIAIAAoAgRqRg0DIAUhAAsCQCAAQX9GDQAgA0EwaiACTQ0AAkAgByACa0EAKALAxwEiBGpBACAEa3EiBEH+////B00NACAAIQUMBwsCQCAEENYEQX9GDQAgBCACaiECIAAhBQwHC0EAIAJrENYEGgwECyAAIQUgAEF/Rw0FDAMLQQAhCAwHC0EAIQUMBQsgBUF/Rw0CC0EAQQAoApzHAUEEcjYCnMcBCyAIQf7///8HSw0BIAgQ1gQhBUEAENYEIQAgBUF/Rg0BIABBf0YNASAFIABPDQEgACAFayICIANBKGpNDQELQQBBACgCkMcBIAJqIgA2ApDHAQJAIABBACgClMcBTQ0AQQAgADYClMcBCwJAAkACQAJAQQAoAvjDASIERQ0AQaDHASEAA0AgBSAAKAIAIgYgACgCBCIIakYNAiAAKAIIIgANAAwDCwALAkACQEEAKALwwwEiAEUNACAFIABPDQELQQAgBTYC8MMBC0EAIQBBACACNgKkxwFBACAFNgKgxwFBAEF/NgKAxAFBAEEAKAK4xwE2AoTEAUEAQQA2AqzHAQNAIABBA3QiBEGQxAFqIARBiMQBaiIGNgIAIARBlMQBaiAGNgIAIABBAWoiAEEgRw0AC0EAIAJBWGoiAEF4IAVrQQdxQQAgBUEIakEHcRsiBGsiBjYC7MMBQQAgBSAEaiIENgL4wwEgBCAGQQFyNgIEIAUgAGpBKDYCBEEAQQAoAsjHATYC/MMBDAILIAAtAAxBCHENACAGIARLDQAgBSAETQ0AIAAgCCACajYCBEEAIARBeCAEa0EHcUEAIARBCGpBB3EbIgBqIgY2AvjDAUEAQQAoAuzDASACaiIFIABrIgA2AuzDASAGIABBAXI2AgQgBCAFakEoNgIEQQBBACgCyMcBNgL8wwEMAQsCQCAFQQAoAvDDASIITw0AQQAgBTYC8MMBIAUhCAsgBSACaiEGQaDHASEAAkACQAJAAkACQAJAAkADQCAAKAIAIAZGDQEgACgCCCIADQAMAgsACyAALQAMQQhxRQ0BC0GgxwEhAANAAkAgACgCACIGIARLDQAgBiAAKAIEaiIGIARLDQMLIAAoAgghAAwACwALIAAgBTYCACAAIAAoAgQgAmo2AgQgBUF4IAVrQQdxQQAgBUEIakEHcRtqIgsgA0EDcjYCBCAGQXggBmtBB3FBACAGQQhqQQdxG2oiAiALIANqIgZrIQMCQCAEIAJHDQBBACAGNgL4wwFBAEEAKALswwEgA2oiADYC7MMBIAYgAEEBcjYCBAwDCwJAQQAoAvTDASACRw0AQQAgBjYC9MMBQQBBACgC6MMBIANqIgA2AujDASAGIABBAXI2AgQgBiAAaiAANgIADAMLAkAgAigCBCIAQQNxQQFHDQAgAEF4cSEHAkACQCAAQf8BSw0AIAIoAggiBCAAQQN2IghBA3RBiMQBaiIFRhoCQCACKAIMIgAgBEcNAEEAQQAoAuDDAUF+IAh3cTYC4MMBDAILIAAgBUYaIAQgADYCDCAAIAQ2AggMAQsgAigCGCEJAkACQCACKAIMIgUgAkYNACAIIAIoAggiAEsaIAAgBTYCDCAFIAA2AggMAQsCQCACQRRqIgAoAgAiBA0AIAJBEGoiACgCACIEDQBBACEFDAELA0AgACEIIAQiBUEUaiIAKAIAIgQNACAFQRBqIQAgBSgCECIEDQALIAhBADYCAAsgCUUNAAJAAkAgAigCHCIEQQJ0QZDGAWoiACgCACACRw0AIAAgBTYCACAFDQFBAEEAKALkwwFBfiAEd3E2AuTDAQwCCyAJQRBBFCAJKAIQIAJGG2ogBTYCACAFRQ0BCyAFIAk2AhgCQCACKAIQIgBFDQAgBSAANgIQIAAgBTYCGAsgAigCFCIARQ0AIAVBFGogADYCACAAIAU2AhgLIAcgA2ohAyACIAdqIQILIAIgAigCBEF+cTYCBCAGIANBAXI2AgQgBiADaiADNgIAAkAgA0H/AUsNACADQQN2IgRBA3RBiMQBaiEAAkACQEEAKALgwwEiA0EBIAR0IgRxDQBBACADIARyNgLgwwEgACEEDAELIAAoAgghBAsgACAGNgIIIAQgBjYCDCAGIAA2AgwgBiAENgIIDAMLQR8hAAJAIANB////B0sNACADQQh2IgAgAEGA/j9qQRB2QQhxIgB0IgQgBEGA4B9qQRB2QQRxIgR0IgUgBUGAgA9qQRB2QQJxIgV0QQ92IAAgBHIgBXJrIgBBAXQgAyAAQRVqdkEBcXJBHGohAAsgBiAANgIcIAZCADcCECAAQQJ0QZDGAWohBAJAAkBBACgC5MMBIgVBASAAdCIIcQ0AQQAgBSAIcjYC5MMBIAQgBjYCACAGIAQ2AhgMAQsgA0EAQRkgAEEBdmsgAEEfRht0IQAgBCgCACEFA0AgBSIEKAIEQXhxIANGDQMgAEEddiEFIABBAXQhACAEIAVBBHFqQRBqIggoAgAiBQ0ACyAIIAY2AgAgBiAENgIYCyAGIAY2AgwgBiAGNgIIDAILQQAgAkFYaiIAQXggBWtBB3FBACAFQQhqQQdxGyIIayILNgLswwFBACAFIAhqIgg2AvjDASAIIAtBAXI2AgQgBSAAakEoNgIEQQBBACgCyMcBNgL8wwEgBCAGQScgBmtBB3FBACAGQVlqQQdxG2pBUWoiACAAIARBEGpJGyIIQRs2AgQgCEEQakEAKQKoxwE3AgAgCEEAKQKgxwE3AghBACAIQQhqNgKoxwFBACACNgKkxwFBACAFNgKgxwFBAEEANgKsxwEgCEEYaiEAA0AgAEEHNgIEIABBCGohBSAAQQRqIQAgBiAFSw0ACyAIIARGDQMgCCAIKAIEQX5xNgIEIAQgCCAEayICQQFyNgIEIAggAjYCAAJAIAJB/wFLDQAgAkEDdiIGQQN0QYjEAWohAAJAAkBBACgC4MMBIgVBASAGdCIGcQ0AQQAgBSAGcjYC4MMBIAAhBgwBCyAAKAIIIQYLIAAgBDYCCCAGIAQ2AgwgBCAANgIMIAQgBjYCCAwEC0EfIQACQCACQf///wdLDQAgAkEIdiIAIABBgP4/akEQdkEIcSIAdCIGIAZBgOAfakEQdkEEcSIGdCIFIAVBgIAPakEQdkECcSIFdEEPdiAAIAZyIAVyayIAQQF0IAIgAEEVanZBAXFyQRxqIQALIARCADcCECAEQRxqIAA2AgAgAEECdEGQxgFqIQYCQAJAQQAoAuTDASIFQQEgAHQiCHENAEEAIAUgCHI2AuTDASAGIAQ2AgAgBEEYaiAGNgIADAELIAJBAEEZIABBAXZrIABBH0YbdCEAIAYoAgAhBQNAIAUiBigCBEF4cSACRg0EIABBHXYhBSAAQQF0IQAgBiAFQQRxakEQaiIIKAIAIgUNAAsgCCAENgIAIARBGGogBjYCAAsgBCAENgIMIAQgBDYCCAwDCyAEKAIIIgAgBjYCDCAEIAY2AgggBkEANgIYIAYgBDYCDCAGIAA2AggLIAtBCGohAAwFCyAGKAIIIgAgBDYCDCAGIAQ2AgggBEEYakEANgIAIAQgBjYCDCAEIAA2AggLQQAoAuzDASIAIANNDQBBACAAIANrIgQ2AuzDAUEAQQAoAvjDASIAIANqIgY2AvjDASAGIARBAXI2AgQgACADQQNyNgIEIABBCGohAAwDCxCYBEEwNgIAQQAhAAwCCwJAIAtFDQACQAJAIAggCCgCHCIGQQJ0QZDGAWoiACgCAEcNACAAIAU2AgAgBQ0BQQAgCUF+IAZ3cSIJNgLkwwEMAgsgC0EQQRQgCygCECAIRhtqIAU2AgAgBUUNAQsgBSALNgIYAkAgCCgCECIARQ0AIAUgADYCECAAIAU2AhgLIAhBFGooAgAiAEUNACAFQRRqIAA2AgAgACAFNgIYCwJAAkAgBEEPSw0AIAggBCADaiIAQQNyNgIEIAggAGoiACAAKAIEQQFyNgIEDAELIAggA0EDcjYCBCAIIANqIgUgBEEBcjYCBCAFIARqIAQ2AgACQCAEQf8BSw0AIARBA3YiBEEDdEGIxAFqIQACQAJAQQAoAuDDASIDQQEgBHQiBHENAEEAIAMgBHI2AuDDASAAIQQMAQsgACgCCCEECyAAIAU2AgggBCAFNgIMIAUgADYCDCAFIAQ2AggMAQtBHyEAAkAgBEH///8HSw0AIARBCHYiACAAQYD+P2pBEHZBCHEiAHQiAyADQYDgH2pBEHZBBHEiA3QiBiAGQYCAD2pBEHZBAnEiBnRBD3YgACADciAGcmsiAEEBdCAEIABBFWp2QQFxckEcaiEACyAFIAA2AhwgBUIANwIQIABBAnRBkMYBaiEDAkACQAJAIAlBASAAdCIGcQ0AQQAgCSAGcjYC5MMBIAMgBTYCACAFIAM2AhgMAQsgBEEAQRkgAEEBdmsgAEEfRht0IQAgAygCACEGA0AgBiIDKAIEQXhxIARGDQIgAEEddiEGIABBAXQhACADIAZBBHFqQRBqIgIoAgAiBg0ACyACIAU2AgAgBSADNgIYCyAFIAU2AgwgBSAFNgIIDAELIAMoAggiACAFNgIMIAMgBTYCCCAFQQA2AhggBSADNgIMIAUgADYCCAsgCEEIaiEADAELAkAgCkUNAAJAAkAgBSAFKAIcIgZBAnRBkMYBaiIAKAIARw0AIAAgCDYCACAIDQFBACAJQX4gBndxNgLkwwEMAgsgCkEQQRQgCigCECAFRhtqIAg2AgAgCEUNAQsgCCAKNgIYAkAgBSgCECIARQ0AIAggADYCECAAIAg2AhgLIAVBFGooAgAiAEUNACAIQRRqIAA2AgAgACAINgIYCwJAAkAgBEEPSw0AIAUgBCADaiIAQQNyNgIEIAUgAGoiACAAKAIEQQFyNgIEDAELIAUgA0EDcjYCBCAFIANqIgMgBEEBcjYCBCADIARqIAQ2AgACQCAHRQ0AIAdBA3YiCEEDdEGIxAFqIQZBACgC9MMBIQACQAJAQQEgCHQiCCACcQ0AQQAgCCACcjYC4MMBIAYhCAwBCyAGKAIIIQgLIAYgADYCCCAIIAA2AgwgACAGNgIMIAAgCDYCCAtBACADNgL0wwFBACAENgLowwELIAVBCGohAAsgAUEQaiQAIAALmw0BB38CQCAARQ0AIABBeGoiASAAQXxqKAIAIgJBeHEiAGohAwJAIAJBAXENACACQQNxRQ0BIAEgASgCACICayIBQQAoAvDDASIESQ0BIAIgAGohAAJAQQAoAvTDASABRg0AAkAgAkH/AUsNACABKAIIIgQgAkEDdiIFQQN0QYjEAWoiBkYaAkAgASgCDCICIARHDQBBAEEAKALgwwFBfiAFd3E2AuDDAQwDCyACIAZGGiAEIAI2AgwgAiAENgIIDAILIAEoAhghBwJAAkAgASgCDCIGIAFGDQAgBCABKAIIIgJLGiACIAY2AgwgBiACNgIIDAELAkAgAUEUaiICKAIAIgQNACABQRBqIgIoAgAiBA0AQQAhBgwBCwNAIAIhBSAEIgZBFGoiAigCACIEDQAgBkEQaiECIAYoAhAiBA0ACyAFQQA2AgALIAdFDQECQAJAIAEoAhwiBEECdEGQxgFqIgIoAgAgAUcNACACIAY2AgAgBg0BQQBBACgC5MMBQX4gBHdxNgLkwwEMAwsgB0EQQRQgBygCECABRhtqIAY2AgAgBkUNAgsgBiAHNgIYAkAgASgCECICRQ0AIAYgAjYCECACIAY2AhgLIAEoAhQiAkUNASAGQRRqIAI2AgAgAiAGNgIYDAELIAMoAgQiAkEDcUEDRw0AQQAgADYC6MMBIAMgAkF+cTYCBCABIABBAXI2AgQgASAAaiAANgIADwsgAyABTQ0AIAMoAgQiAkEBcUUNAAJAAkAgAkECcQ0AAkBBACgC+MMBIANHDQBBACABNgL4wwFBAEEAKALswwEgAGoiADYC7MMBIAEgAEEBcjYCBCABQQAoAvTDAUcNA0EAQQA2AujDAUEAQQA2AvTDAQ8LAkBBACgC9MMBIANHDQBBACABNgL0wwFBAEEAKALowwEgAGoiADYC6MMBIAEgAEEBcjYCBCABIABqIAA2AgAPCyACQXhxIABqIQACQAJAIAJB/wFLDQAgAygCCCIEIAJBA3YiBUEDdEGIxAFqIgZGGgJAIAMoAgwiAiAERw0AQQBBACgC4MMBQX4gBXdxNgLgwwEMAgsgAiAGRhogBCACNgIMIAIgBDYCCAwBCyADKAIYIQcCQAJAIAMoAgwiBiADRg0AQQAoAvDDASADKAIIIgJLGiACIAY2AgwgBiACNgIIDAELAkAgA0EUaiICKAIAIgQNACADQRBqIgIoAgAiBA0AQQAhBgwBCwNAIAIhBSAEIgZBFGoiAigCACIEDQAgBkEQaiECIAYoAhAiBA0ACyAFQQA2AgALIAdFDQACQAJAIAMoAhwiBEECdEGQxgFqIgIoAgAgA0cNACACIAY2AgAgBg0BQQBBACgC5MMBQX4gBHdxNgLkwwEMAgsgB0EQQRQgBygCECADRhtqIAY2AgAgBkUNAQsgBiAHNgIYAkAgAygCECICRQ0AIAYgAjYCECACIAY2AhgLIAMoAhQiAkUNACAGQRRqIAI2AgAgAiAGNgIYCyABIABBAXI2AgQgASAAaiAANgIAIAFBACgC9MMBRw0BQQAgADYC6MMBDwsgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgALAkAgAEH/AUsNACAAQQN2IgJBA3RBiMQBaiEAAkACQEEAKALgwwEiBEEBIAJ0IgJxDQBBACAEIAJyNgLgwwEgACECDAELIAAoAgghAgsgACABNgIIIAIgATYCDCABIAA2AgwgASACNgIIDwtBHyECAkAgAEH///8HSw0AIABBCHYiAiACQYD+P2pBEHZBCHEiAnQiBCAEQYDgH2pBEHZBBHEiBHQiBiAGQYCAD2pBEHZBAnEiBnRBD3YgAiAEciAGcmsiAkEBdCAAIAJBFWp2QQFxckEcaiECCyABQgA3AhAgAUEcaiACNgIAIAJBAnRBkMYBaiEEAkACQAJAAkBBACgC5MMBIgZBASACdCIDcQ0AQQAgBiADcjYC5MMBIAQgATYCACABQRhqIAQ2AgAMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgAUEYaiAENgIACyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQRhqQQA2AgAgASAENgIMIAEgADYCCAtBAEEAKAKAxAFBf2oiAUF/IAEbNgKAxAELCwcAPwBBEHQLVAECf0EAKAKMswEiASAAQQNqQXxxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQ1QRNDQAgABATRQ0BC0EAIAA2AoyzASABDwsQmARBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQogBCACIAcbIglC////////P4MhCyACIAQgBxsiDEIwiKdB//8BcSEIAkAgCUIwiKdB//8BcSIGDQAgBUHgAGogCiALIAogCyALUCIGG3kgBkEGdK18pyIGQXFqENgEQRAgBmshBiAFQegAaikDACELIAUpA2AhCgsgASADIAcbIQMgDEL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahDYBEEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQIgC0IDhiAKQj2IhCEEIANCA4YhASAJIAyFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACECQgEhAQwBCyAFQcAAaiABIAJBgAEgB2sQ2AQgBUEwaiABIAIgBxDiBCAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhASAFQTBqQQhqKQMAIQILIARCgICAgICAgASEIQwgCkIDhiELAkACQCADQn9VDQBCACEDQgAhBCALIAGFIAwgAoWEUA0CIAsgAX0hCiAMIAJ9IAsgAVStfSIEQv////////8DVg0BIAVBIGogCiAEIAogBCAEUCIHG3kgB0EGdK18p0F0aiIHENgEIAYgB2shBiAFQShqKQMAIQQgBSkDICEKDAELIAIgDHwgASALfCIKIAFUrXwiBEKAgICAgICACINQDQAgCkIBiCAEQj+GhCAKQgGDhCEKIAZBAWohBiAEQgGIIQQLIAlCgICAgICAgICAf4MhAQJAIAZB//8BSA0AIAFCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogCiAEIAZB/wBqENgEIAUgCiAEQQEgBmsQ4gQgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhCiAFQQhqKQMAIQQLIApCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCABhCEEIAqnQQdxIQYCQAJAAkACQAJAEOAEDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgAUIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgAVAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELEOEEGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC98QAgV/Dn4jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQ2ARBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDYBCAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABDkBCAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABDkBCAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABDkBCAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABDkBCAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABDkBCAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABDkBCAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABDkBCAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABDkBCAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABDkBCAFQZABaiADQg+GQgAgBEIAEOQEIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQ5AQgBUGAAWpCASACfUIAIARCABDkBCAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYgAUI/iIQiFEIgiCIEfiILIAFCAYYiFUIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECALVK0gECAPQv////8PgyILIBRC/////w+DIg9+fCIRIBBUrXwgDSAEfnwgCyAEfiIWIA8gDX58IhAgFlStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgD34iFiACIAp+fCIRIBZUrSARIAsgFUL+////D4MiFn58IhcgEVStfHwiESAQVK18IBEgEiAEfiIQIBYgDX58IgQgAiAPfnwiDSALIAp+fCILQiCIIAQgEFStIA0gBFStfCALIA1UrXxCIIaEfCIEIBFUrXwgBCAXIAIgFn4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAXVK0gAiALQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAFQdAAaiACIAQgAyAOEOQEIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEOQEIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFSATIRQLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCELIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrEOIEIAVBMGogFSAUIAZB8ABqENgEIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACILEOQEIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQ5AQgBSADIA5CBUIAEOQEIAsgAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahDYBCACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahDYBCACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqENgEIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqENgEIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqENgEQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqENgEIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESAKQg+GIANCMYiEIhRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0GAAUkNAEIAIQEMAwsgBUEwaiASIAEgBkH/AGoiBhDYBCAFQSBqIAIgBCAGENgEIAVBEGogEiABIAcQ4gQgBSACIAQgBxDiBCAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAELIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiBCABQiCIIgJ+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyACfnwiA0IgiHwgA0L/////D4MgBCABfnwiA0IgiHw3AwggACADQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRDXBCAFKQMAIQEgACAFQQhqKQMANwMIIAAgATcDACAFQRBqJAAL6gMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACIVCAFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQ2AQgAiAAIARBgfgAIANrEOIEIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAiFQgBSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCxUAQdDHwQIkAkHQxwFBD2pBcHEkAQsHACMAIwFrCwQAIwILBAAjAQsNACABIAIgAyAAERAACyQBAX4gACABIAKtIAOtQiCGhCAEEO8EIQUgBUIgiKcQFCAFpwsTACAAIAGnIAFCIIinIAIgAxAVCwugq4GAAAMAQYAIC4inAWluZmluaXR5AC1JbmZpbml0eQBodW1pZGl0eQBhY2lkaXR5AGRldnNfdmVyaWZ5AGludmFsaWQga2V5AGFycmF5AGlzQXJyYXkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABzZXJ2aWNlSW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4ACVzOiV4AGNsb3N1cmU6JWQ6JXgAbWV0aG9kOiVkOiV4AHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleABXU1NLLUg6IHVua25vd24gY21kICV4AGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9ydwBwb3cAamRfd3Nza19uZXcAaWRpdgBwcmV2AHRzYWdnX2NsaWVudF9ldgBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQAlczoldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudAByYW5kb21JbnQAcGFyc2VJbnQAZGV2aWNlc2NyaXB0bWdyX2luaXQAd2FpdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAb2JqZWN0AHBhcnNlRmxvYXQAZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAGRldnNfbWFwX2tleXNfb3JfdmFsdWVzAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGFicwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBmbG9vcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGRldmljZUlkZW50aWZpZXIAYnVmZmVyAHJvdGFyeUVuY29kZXIAbnVtYmVyAHJvbGVfbWVtYmVyAGZyZWVfZmliZXIAZXhwAGpkX3NoYTI1Nl9zZXR1cABkZXZzX3Byb3RvX2xvb2t1cABkZXZzX3NwZWNfbG9va3VwACgoKHVpbnQzMl90KW90cCA8PCBQQUNLX1NISUZUKSA+PiBQQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAbWFwAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX21hcF9jb3B5X2ludG8Ac21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgBidXR0b24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AbWFpbgBkZXZzX29iamVjdF9nZXRfYnVpbHRfaW4AZGV2c19vYmplY3RfZ2V0X3N0YXRpY19idWlsdF9pbgBhc3NpZ24AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAHNldHRpbmcgbnVsbABnZXR0aW5nIG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBhbGxvY19ibG9jawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBsb2cAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgB0YWcgPD0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAGhlYXJ0UmF0ZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAZGV2c19tYWtlX2Nsb3N1cmUAcHJvdG90eXBlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAGlubGluZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAbmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBvbkNoYW5nZQBwdXNoUmFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZW5jb2RlAGRlY29kZQBldmVudENvZGUAcmVnQ29kZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfb2JqZWN0X2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABpc0NvbW1hbmQAc2VydmljZUNvbW1hbmQAc2VuZENvbW1hbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvbkRpc2Nvbm5lY3RlZABXUzogY29ubmVjdGVkAGlzQ29ubmVjdGVkAG9uQ29ubmVjdGVkAGNyZWF0ZWQAdW5kZWZpbmVkAG5vbi1mdW5jdGlvbiBjYWxsZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkACUtcyVkACUtc18lZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkAERldmljZVNjcmlwdCBydW50aW1lIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAHR2b2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAHBhbmljAGJhZCBtYWdpYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBwYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAZGV2aWNlc2NyaXB0L29iamVjdHMuYwBkZXZpY2VzY3JpcHQvZmliZXJzLmMAZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGRldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGRldmljZXNjcmlwdC9hZ2didWZmZXIuYwBkZXZpY2VzY3JpcHQvYnVmZmVyLmMAZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBuZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAG5ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBkZXZpY2VzY3JpcHQvc3RyaW5nLmMAZGV2aWNlc2NyaXB0L3RzYWdnLmMAZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGRldmljZXNjcmlwdC9yZWdjYWNoZS5jAGRldmljZXNjcmlwdC9qZGlmYWNlLmMAZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBfX2Z1bmNfXwBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtSb2xlOiAlcy4lc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbUGFja2V0OiAlcyBjbWQ9MHgleCBzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYAGlkeCA8PSBERVZTX1NFUlZJQ0VTUEVDX0ZMQUdfREVSSVZFX0xBU1QAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAUEkARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBmaWR4IDwgZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2Zm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AAAAcgAAAHMAAAB0AAAAdQAAAHYAAAB3AAAAeAAAAHkAAAB6AAAAewAAAHwAAAB9AAAAfgAAAH8AAACAAAAAgQAAAIIAAACDAAAAhAAAAIUAAACGAAAAhwAAAIgAAACJAAAAigAAAIsAAACMAAAAjQAAAI4AAACPAAAAkAAAAJEAAACSAAAAkwAAAJQAAACVAAAAlgAAAJcAAACYAAAAmQAAAJoAAACbAAAAnAAAAJ0AAACeAAAAnwAAAFAAAAAAAAAABQAAAAAAAAAAAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArQAAAK4AAADgYQAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+FgAANBjUAAAQZCzAQsAAKrdgIAABG5hbWUBxFzyBAAFYWJvcnQBE19kZXZzX3BhbmljX2hhbmRsZXICDWVtX3NlbmRfZnJhbWUDEGVtX2NvbnNvbGVfZGVidWcEBGV4aXQFC2VtX3RpbWVfbm93BhNkZXZzX2RlcGxveV9oYW5kbGVyByBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQghZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkCRhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcKMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkCzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQMM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQOYWdnYnVmZmVyX2luaXRFD2FnZ2J1ZmZlcl9mbHVzaEYQYWdnYnVmZmVyX3VwbG9hZEcOZGV2c19idWZmZXJfb3BIEGRldnNfcmVhZF9udW1iZXJJEmRldnNfYnVmZmVyX2RlY29kZUoSZGV2c19idWZmZXJfZW5jb2RlSw9kZXZzX2NyZWF0ZV9jdHhMCXNldHVwX2N0eE0KZGV2c190cmFjZU4PZGV2c19lcnJvcl9jb2RlTxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyUAljbGVhcl9jdHhRDWRldnNfZnJlZV9jdHhSCGRldnNfb29tUwlkZXZzX2ZyZWVUF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzVQd0cnlfcnVuVgxzdG9wX3Byb2dyYW1XHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRYHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVZGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaFodZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRbDmRlcGxveV9oYW5kbGVyXBNkZXBsb3lfbWV0YV9oYW5kbGVyXRZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95XhRkZXZpY2VzY3JpcHRtZ3JfaW5pdF8ZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldmARZGV2c2Nsb3VkX3Byb2Nlc3NhF2RldnNjbG91ZF9oYW5kbGVfcGFja2V0YhNkZXZzY2xvdWRfb25fbWV0aG9kYw5kZXZzY2xvdWRfaW5pdGQQZGV2c19maWJlcl95aWVsZGUYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uZgpkZXZzX3BhbmljZxhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWVoEGRldnNfZmliZXJfc2xlZXBpG2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbGoaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnNrEWRldnNfaW1nX2Z1bl9uYW1lbBJkZXZzX2ltZ19yb2xlX25hbWVtEmRldnNfZmliZXJfYnlfZmlkeG4RZGV2c19maWJlcl9ieV90YWdvEGRldnNfZmliZXJfc3RhcnRwFGRldnNfZmliZXJfdGVybWlhbnRlcQ5kZXZzX2ZpYmVyX3J1bnITZGV2c19maWJlcl9zeW5jX25vd3MVX2RldnNfcnVudGltZV9mYWlsdXJldA9kZXZzX2ZpYmVyX3Bva2V1E2pkX2djX2FueV90cnlfYWxsb2N2B2RldnNfZ2N3D2ZpbmRfZnJlZV9ibG9ja3gSZGV2c19hbnlfdHJ5X2FsbG9jeQ5kZXZzX3RyeV9hbGxvY3oLamRfZ2NfdW5waW57CmpkX2djX2ZyZWV8DmRldnNfdmFsdWVfcGlufRBkZXZzX3ZhbHVlX3VucGlufhJkZXZzX21hcF90cnlfYWxsb2N/FGRldnNfYXJyYXlfdHJ5X2FsbG9jgAEVZGV2c19idWZmZXJfdHJ5X2FsbG9jgQEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jggEaZGV2c19zdHJpbmdfdHJ5X2FsbG9jX2luaXSDAQ9kZXZzX2djX3NldF9jdHiEAQ5kZXZzX2djX2NyZWF0ZYUBD2RldnNfZ2NfZGVzdHJveYYBC3NjYW5fZ2Nfb2JqhwERcHJvcF9BcnJheV9sZW5ndGiIARJtZXRoMl9BcnJheV9pbnNlcnSJARJmdW4xX0FycmF5X2lzQXJyYXmKARBtZXRoWF9BcnJheV9wdXNoiwEVbWV0aDFfQXJyYXlfcHVzaFJhbmdljAERbWV0aFhfQXJyYXlfc2xpY2WNARFmdW4xX0J1ZmZlcl9hbGxvY44BEnByb3BfQnVmZmVyX2xlbmd0aI8BFW1ldGgwX0J1ZmZlcl90b1N0cmluZ5ABE21ldGgzX0J1ZmZlcl9maWxsQXSRARNtZXRoNF9CdWZmZXJfYmxpdEF0kgEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc5MBF2Z1bjFfRGV2aWNlU2NyaXB0X3BhbmljlAEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290lQEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0lgEVZnVuMV9EZXZpY2VTY3JpcHRfbG9nlwEcZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VGbG9hdJgBGmZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlSW50mQEUbWV0aFhfRnVuY3Rpb25fc3RhcnSaAQ5mdW4xX01hdGhfY2VpbJsBD2Z1bjFfTWF0aF9mbG9vcpwBD2Z1bjFfTWF0aF9yb3VuZJ0BDWZ1bjFfTWF0aF9hYnOeARBmdW4wX01hdGhfcmFuZG9tnwETZnVuMV9NYXRoX3JhbmRvbUludKABDWZ1bjFfTWF0aF9sb2ehAQ1mdW4yX01hdGhfcG93ogEOZnVuMl9NYXRoX2lkaXajAQ5mdW4yX01hdGhfaW1vZKQBDmZ1bjJfTWF0aF9pbXVspQENZnVuMl9NYXRoX21pbqYBC2Z1bjJfbWlubWF4pwENZnVuMl9NYXRoX21heKgBEmZ1bjJfT2JqZWN0X2Fzc2lnbqkBEGZ1bjFfT2JqZWN0X2tleXOqARNmdW4xX2tleXNfb3JfdmFsdWVzqwESZnVuMV9PYmplY3RfdmFsdWVzrAEQcHJvcF9QYWNrZXRfcm9sZa0BHHByb3BfUGFja2V0X2RldmljZUlkZW50aWZpZXKuARNwcm9wX1BhY2tldF9zaG9ydElkrwEYcHJvcF9QYWNrZXRfc2VydmljZUluZGV4sAEacHJvcF9QYWNrZXRfc2VydmljZUNvbW1hbmSxARFwcm9wX1BhY2tldF9mbGFnc7IBFXByb3BfUGFja2V0X2lzQ29tbWFuZLMBFHByb3BfUGFja2V0X2lzUmVwb3J0tAETcHJvcF9QYWNrZXRfcGF5bG9hZLUBE3Byb3BfUGFja2V0X2lzRXZlbnS2ARVwcm9wX1BhY2tldF9ldmVudENvZGW3ARRwcm9wX1BhY2tldF9pc1JlZ1NldLgBFHByb3BfUGFja2V0X2lzUmVnR2V0uQETcHJvcF9QYWNrZXRfcmVnQ29kZboBE21ldGgwX1BhY2tldF9kZWNvZGW7ARJkZXZzX3BhY2tldF9kZWNvZGW8ARVtZXRoMF9Ec1JlZ2lzdGVyX3JlYWS9ARREc1JlZ2lzdGVyX3JlYWRfY29udL4BEmRldnNfcGFja2V0X2VuY29kZb8BFm1ldGhYX0RzUmVnaXN0ZXJfd3JpdGXAARZwcm9wX0RzUGFja2V0SW5mb19yb2xlwQEWcHJvcF9Ec1BhY2tldEluZm9fbmFtZcIBFnByb3BfRHNQYWNrZXRJbmZvX2NvZGXDARhtZXRoWF9Ec0NvbW1hbmRfX19mdW5jX1/EARdwcm9wX0RzUm9sZV9pc0Nvbm5lY3RlZMUBGG1ldGgyX0RzUm9sZV9zZW5kQ29tbWFuZMYBEW1ldGgwX0RzUm9sZV93YWl0xwEScHJvcF9TdHJpbmdfbGVuZ3RoyAEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXTJARNtZXRoMV9TdHJpbmdfY2hhckF0ygEUZGV2c19qZF9nZXRfcmVnaXN0ZXLLARZkZXZzX2pkX2NsZWFyX3BrdF9raW5kzAEQZGV2c19qZF9zZW5kX2NtZM0BEWRldnNfamRfd2FrZV9yb2xlzgEUZGV2c19qZF9yZXNldF9wYWNrZXTPARNkZXZzX2pkX3BrdF9jYXB0dXJl0AETZGV2c19qZF9zZW5kX2xvZ21zZ9EBDWhhbmRsZV9sb2dtc2fSARJkZXZzX2pkX3Nob3VsZF9ydW7TARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZdQBE2RldnNfamRfcHJvY2Vzc19wa3TVARRkZXZzX2pkX3JvbGVfY2hhbmdlZNYBEmRldnNfamRfaW5pdF9yb2xlc9cBEmRldnNfamRfZnJlZV9yb2xlc9gBEGRldnNfc2V0X2xvZ2dpbmfZARVkZXZzX2dldF9nbG9iYWxfZmxhZ3PaARJkZXZzX21hcF9jb3B5X2ludG/bAQxkZXZzX21hcF9zZXTcARRkZXZzX2lzX3NlcnZpY2Vfc3BlY90BBmxvb2t1cN4BF2RldnNfbWFwX2tleXNfb3JfdmFsdWVz3wERZGV2c19hcnJheV9pbnNlcnTgAQ9kZXZzX21hcF9kZWxldGXhARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7iARdkZXZzX2RlY29kZV9yb2xlX3BhY2tldOMBDmRldnNfcm9sZV9zcGVj5AEQZGV2c19zcGVjX2xvb2t1cOUBEWRldnNfcHJvdG9fbG9va3Vw5gESZGV2c19mdW5jdGlvbl9iaW5k5wERZGV2c19tYWtlX2Nsb3N1cmXoAQ5kZXZzX2dldF9mbmlkeOkBE2RldnNfZ2V0X2ZuaWR4X2NvcmXqARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTrARdkZXZzX29iamVjdF9nZXRfbm9fYmluZOwBE2RldnNfZ2V0X3JvbGVfcHJvdG/tARtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfuARVkZXZzX2dldF9zdGF0aWNfcHJvdG/vAR1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51bfABD2RldnNfb2JqZWN0X2dldPEBDGRldnNfc2VxX2dldPIBDGRldnNfYW55X2dldPMBDGRldnNfYW55X3NldPQBDGRldnNfc2VxX3NldPUBDmRldnNfYXJyYXlfc2V09gEMZGV2c19hcmdfaW509wEPZGV2c19hcmdfZG91Ymxl+AEPZGV2c19yZXRfZG91Ymxl+QEMZGV2c19yZXRfaW50+gENZGV2c19yZXRfYm9vbPsBD2RldnNfcmV0X2djX3B0cvwBEWRldnNfc2V0dXBfcmVzdW1l/QESZGV2c19yZWdjYWNoZV9mcmVl/gEWZGV2c19yZWdjYWNoZV9mcmVlX2FsbP8BF2RldnNfcmVnY2FjaGVfbWFya191c2VkgAITZGV2c19yZWdjYWNoZV9hbGxvY4ECFGRldnNfcmVnY2FjaGVfbG9va3VwggIRZGV2c19yZWdjYWNoZV9hZ2WDAhdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZYQCEmRldnNfcmVnY2FjaGVfbmV4dIUCD2pkX3NldHRpbmdzX2dldIYCD2pkX3NldHRpbmdzX3NldIcCDmRldnNfbG9nX3ZhbHVliAIPZGV2c19zaG93X3ZhbHVliQIQZGV2c19zaG93X3ZhbHVlMIoCDWNvbnN1bWVfY2h1bmuLAg1zaGFfMjU2X2Nsb3NljAIPamRfc2hhMjU2X3NldHVwjQIQamRfc2hhMjU2X3VwZGF0ZY4CEGpkX3NoYTI1Nl9maW5pc2iPAhRqZF9zaGEyNTZfaG1hY19zZXR1cJACFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaJECDmpkX3NoYTI1Nl9oa2RmkgIOZGV2c19zdHJmb3JtYXSTAg5kZXZzX2lzX3N0cmluZ5QCDmRldnNfaXNfbnVtYmVylQIUZGV2c19zdHJpbmdfZ2V0X3V0ZjiWAhNkZXZzX2J1aWx0aW5fc3RyaW5nlwIUZGV2c19zdHJpbmdfdnNwcmludGaYAhNkZXZzX3N0cmluZ19zcHJpbnRmmQIVZGV2c19zdHJpbmdfZnJvbV91dGY4mgIUZGV2c192YWx1ZV90b19zdHJpbmebAhBidWZmZXJfdG9fc3RyaW5nnAISZGV2c19zdHJpbmdfY29uY2F0nQIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY54CD3RzYWdnX2NsaWVudF9ldp8CCmFkZF9zZXJpZXOgAg10c2FnZ19wcm9jZXNzoQIKbG9nX3Nlcmllc6ICE3RzYWdnX2hhbmRsZV9wYWNrZXSjAhRsb29rdXBfb3JfYWRkX3Nlcmllc6QCCnRzYWdnX2luaXSlAgx0c2FnZ191cGRhdGWmAhZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlpwITZGV2c192YWx1ZV9mcm9tX2ludKgCFGRldnNfdmFsdWVfZnJvbV9ib29sqQIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXKqAhRkZXZzX3ZhbHVlX3RvX2RvdWJsZasCEWRldnNfdmFsdWVfdG9faW50rAISZGV2c192YWx1ZV90b19ib29srQIOZGV2c19pc19idWZmZXKuAhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZa8CEGRldnNfYnVmZmVyX2RhdGGwAhNkZXZzX2J1ZmZlcmlzaF9kYXRhsQIUZGV2c192YWx1ZV90b19nY19vYmqyAg1kZXZzX2lzX2FycmF5swIRZGV2c192YWx1ZV90eXBlb2a0Ag9kZXZzX2lzX251bGxpc2i1AhJkZXZzX3ZhbHVlX2llZWVfZXG2AhJkZXZzX2ltZ19zdHJpZHhfb2u3AhJkZXZzX2R1bXBfdmVyc2lvbnO4AgtkZXZzX3ZlcmlmebkCFGRldnNfdm1fZXhlY19vcGNvZGVzugIaZGV2c19idWlsdGluX3N0cmluZ19ieV9pZHi7AhFkZXZzX2ltZ19nZXRfdXRmOLwCFGRldnNfZ2V0X3N0YXRpY191dGY4vQIPZGV2c192bV9yb2xlX29rvgIMZXhwcl9pbnZhbGlkvwIUZXhwcnhfYnVpbHRpbl9vYmplY3TAAgtzdG10MV9jYWxsMMECC3N0bXQyX2NhbGwxwgILc3RtdDNfY2FsbDLDAgtzdG10NF9jYWxsM8QCC3N0bXQ1X2NhbGw0xQILc3RtdDZfY2FsbDXGAgtzdG10N19jYWxsNscCC3N0bXQ4X2NhbGw3yAILc3RtdDlfY2FsbDjJAhJzdG10Ml9pbmRleF9kZWxldGXKAgxzdG10MV9yZXR1cm7LAglzdG10eF9qbXDMAgxzdG10eDFfam1wX3rNAgtzdG10MV9wYW5pY84CEmV4cHJ4X29iamVjdF9maWVsZM8CEnN0bXR4MV9zdG9yZV9sb2NhbNACE3N0bXR4MV9zdG9yZV9nbG9iYWzRAhJzdG10NF9zdG9yZV9idWZmZXLSAglleHByMF9pbmbTAhBleHByeF9sb2FkX2xvY2Fs1AIRZXhwcnhfbG9hZF9nbG9iYWzVAgtleHByMV91cGx1c9YCC2V4cHIyX2luZGV41wIPc3RtdDNfaW5kZXhfc2V02AIUZXhwcngxX2J1aWx0aW5fZmllbGTZAhJleHByeDFfYXNjaWlfZmllbGTaAhFleHByeDFfdXRmOF9maWVsZNsCEGV4cHJ4X21hdGhfZmllbGTcAg5leHByeF9kc19maWVsZN0CD3N0bXQwX2FsbG9jX21hcN4CEXN0bXQxX2FsbG9jX2FycmF53wISc3RtdDFfYWxsb2NfYnVmZmVy4AIRZXhwcnhfc3RhdGljX3JvbGXhAhNleHByeF9zdGF0aWNfYnVmZmVy4gIbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5n4wIZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ+QCGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ+UCFWV4cHJ4X3N0YXRpY19mdW5jdGlvbuYCDWV4cHJ4X2xpdGVyYWznAhFleHByeF9saXRlcmFsX2Y2NOgCEGV4cHJ4X3JvbGVfcHJvdG/pAhFleHByM19sb2FkX2J1ZmZlcuoCDWV4cHIwX3JldF92YWzrAgxleHByMV90eXBlb2bsAgpleHByMF9udWxs7QINZXhwcjFfaXNfbnVsbO4CCmV4cHIwX3RydWXvAgtleHByMF9mYWxzZfACDWV4cHIxX3RvX2Jvb2zxAglleHByMF9uYW7yAglleHByMV9hYnPzAg1leHByMV9iaXRfbm909AIMZXhwcjFfaXNfbmFu9QIJZXhwcjFfbmVn9gIJZXhwcjFfbm909wIMZXhwcjFfdG9faW50+AIJZXhwcjJfYWRk+QIJZXhwcjJfc3Vi+gIJZXhwcjJfbXVs+wIJZXhwcjJfZGl2/AINZXhwcjJfYml0X2FuZP0CDGV4cHIyX2JpdF9vcv4CDWV4cHIyX2JpdF94b3L/AhBleHByMl9zaGlmdF9sZWZ0gAMRZXhwcjJfc2hpZnRfcmlnaHSBAxpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZIIDCGV4cHIyX2VxgwMIZXhwcjJfbGWEAwhleHByMl9sdIUDCGV4cHIyX25lhgMVc3RtdDFfdGVybWluYXRlX2ZpYmVyhwMUc3RtdHgyX3N0b3JlX2Nsb3N1cmWIAxNleHByeDFfbG9hZF9jbG9zdXJliQMSZXhwcnhfbWFrZV9jbG9zdXJligMQZXhwcjFfdHlwZW9mX3N0cosDDGV4cHIwX25vd19tc4wDFmV4cHIxX2dldF9maWJlcl9oYW5kbGWNAxBzdG10Ml9jYWxsX2FycmF5jgMPZGV2c192bV9wb3BfYXJnjwMTZGV2c192bV9wb3BfYXJnX3UzMpADE2RldnNfdm1fcG9wX2FyZ19pMzKRAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVykgMSamRfYWVzX2NjbV9lbmNyeXB0kwMSamRfYWVzX2NjbV9kZWNyeXB0lAMMQUVTX2luaXRfY3R4lQMPQUVTX0VDQl9lbmNyeXB0lgMQamRfYWVzX3NldHVwX2tleZcDDmpkX2Flc19lbmNyeXB0mAMQamRfYWVzX2NsZWFyX2tleZkDC2pkX3dzc2tfbmV3mgMUamRfd3Nza19zZW5kX21lc3NhZ2WbAxNqZF93ZWJzb2NrX29uX2V2ZW50nAMHZGVjcnlwdJ0DDWpkX3dzc2tfY2xvc2WeAxBqZF93c3NrX29uX2V2ZW50nwMKc2VuZF9lbXB0eaADEndzc2toZWFsdGhfcHJvY2Vzc6EDF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlogMUd3Nza2hlYWx0aF9yZWNvbm5lY3SjAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSkAw9zZXRfY29ubl9zdHJpbmelAxFjbGVhcl9jb25uX3N0cmluZ6YDD3dzc2toZWFsdGhfaW5pdKcDE3dzc2tfcHVibGlzaF92YWx1ZXOoAxB3c3NrX3B1Ymxpc2hfYmluqQMRd3Nza19pc19jb25uZWN0ZWSqAxN3c3NrX3Jlc3BvbmRfbWV0aG9kqwMccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZawDFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGWtAw9yb2xlbWdyX3Byb2Nlc3OuAxByb2xlbWdyX2F1dG9iaW5krwMVcm9sZW1ncl9oYW5kbGVfcGFja2V0sAMUamRfcm9sZV9tYW5hZ2VyX2luaXSxAxhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWSyAw1qZF9yb2xlX2FsbG9jswMQamRfcm9sZV9mcmVlX2FsbLQDFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmS1AxJqZF9yb2xlX2J5X3NlcnZpY2W2AxNqZF9jbGllbnRfbG9nX2V2ZW50twMTamRfY2xpZW50X3N1YnNjcmliZbgDFGpkX2NsaWVudF9lbWl0X2V2ZW50uQMUcm9sZW1ncl9yb2xlX2NoYW5nZWS6AxBqZF9kZXZpY2VfbG9va3VwuwMYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlvAMTamRfc2VydmljZV9zZW5kX2NtZL0DEWpkX2NsaWVudF9wcm9jZXNzvgMOamRfZGV2aWNlX2ZyZWW/AxdqZF9jbGllbnRfaGFuZGxlX3BhY2tldMADD2pkX2RldmljZV9hbGxvY8EDD2pkX2N0cmxfcHJvY2Vzc8IDFWpkX2N0cmxfaGFuZGxlX3BhY2tldMMDDGpkX2N0cmxfaW5pdMQDDWpkX2lwaXBlX29wZW7FAxZqZF9pcGlwZV9oYW5kbGVfcGFja2V0xgMOamRfaXBpcGVfY2xvc2XHAxJqZF9udW1mbXRfaXNfdmFsaWTIAxVqZF9udW1mbXRfd3JpdGVfZmxvYXTJAxNqZF9udW1mbXRfd3JpdGVfaTMyygMSamRfbnVtZm10X3JlYWRfaTMyywMUamRfbnVtZm10X3JlYWRfZmxvYXTMAxFqZF9vcGlwZV9vcGVuX2NtZM0DFGpkX29waXBlX29wZW5fcmVwb3J0zgMWamRfb3BpcGVfaGFuZGxlX3BhY2tldM8DEWpkX29waXBlX3dyaXRlX2V40AMQamRfb3BpcGVfcHJvY2Vzc9EDFGpkX29waXBlX2NoZWNrX3NwYWNl0gMOamRfb3BpcGVfd3JpdGXTAw5qZF9vcGlwZV9jbG9zZdQDDWpkX3F1ZXVlX3B1c2jVAw5qZF9xdWV1ZV9mcm9udNYDDmpkX3F1ZXVlX3NoaWZ01wMOamRfcXVldWVfYWxsb2PYAw1qZF9yZXNwb25kX3U42QMOamRfcmVzcG9uZF91MTbaAw5qZF9yZXNwb25kX3UzMtsDEWpkX3Jlc3BvbmRfc3RyaW5n3AMXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTdAwtqZF9zZW5kX3BrdN4DHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs3wMXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXLgAxlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V04QMUamRfYXBwX2hhbmRsZV9wYWNrZXTiAxVqZF9hcHBfaGFuZGxlX2NvbW1hbmTjAxNqZF9hbGxvY2F0ZV9zZXJ2aWNl5AMQamRfc2VydmljZXNfaW5pdOUDDmpkX3JlZnJlc2hfbm935gMZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZOcDFGpkX3NlcnZpY2VzX2Fubm91bmNl6AMXamRfc2VydmljZXNfbmVlZHNfZnJhbWXpAxBqZF9zZXJ2aWNlc190aWNr6gMVamRfcHJvY2Vzc19ldmVyeXRoaW5n6wMaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmXsAxJhcHBfZ2V0X2Z3X3ZlcnNpb27tAxZhcHBfZ2V0X2Rldl9jbGFzc19uYW1l7gMNamRfaGFzaF9mbnYxYe8DDGpkX2RldmljZV9pZPADCWpkX3JhbmRvbfEDCGpkX2NyYzE28gMOamRfY29tcHV0ZV9jcmPzAw5qZF9zaGlmdF9mcmFtZfQDDmpkX3Jlc2V0X2ZyYW1l9QMQamRfcHVzaF9pbl9mcmFtZfYDDWpkX3BhbmljX2NvcmX3AxNqZF9zaG91bGRfc2FtcGxlX21z+AMQamRfc2hvdWxkX3NhbXBsZfkDCWpkX3RvX2hlePoDC2pkX2Zyb21faGV4+wMOamRfYXNzZXJ0X2ZhaWz8AwdqZF9hdG9p/QMLamRfdnNwcmludGb+Aw9qZF9wcmludF9kb3VibGX/AwpqZF9zcHJpbnRmgAQSamRfZGV2aWNlX3Nob3J0X2lkgQQMamRfc3ByaW50Zl9hggQLamRfdG9faGV4X2GDBBRqZF9kZXZpY2Vfc2hvcnRfaWRfYYQECWpkX3N0cmR1cIUEDmpkX2pzb25fZXNjYXBlhgQTamRfanNvbl9lc2NhcGVfY29yZYcECWpkX21lbWR1cIgEFmpkX3Byb2Nlc3NfZXZlbnRfcXVldWWJBBZkb19wcm9jZXNzX2V2ZW50X3F1ZXVligQRamRfc2VuZF9ldmVudF9leHSLBApqZF9yeF9pbml0jAQUamRfcnhfZnJhbWVfcmVjZWl2ZWSNBB1qZF9yeF9mcmFtZV9yZWNlaXZlZF9sb29wYmFja44ED2pkX3J4X2dldF9mcmFtZY8EE2pkX3J4X3JlbGVhc2VfZnJhbWWQBBFqZF9zZW5kX2ZyYW1lX3Jhd5EEDWpkX3NlbmRfZnJhbWWSBApqZF90eF9pbml0kwQHamRfc2VuZJQEFmpkX3NlbmRfZnJhbWVfd2l0aF9jcmOVBA9qZF90eF9nZXRfZnJhbWWWBBBqZF90eF9mcmFtZV9zZW50lwQLamRfdHhfZmx1c2iYBBBfX2Vycm5vX2xvY2F0aW9umQQMX19mcGNsYXNzaWZ5mgQFZHVtbXmbBAhfX21lbWNweZwEB21lbW1vdmWdBAZtZW1zZXSeBApfX2xvY2tmaWxlnwQMX191bmxvY2tmaWxloAQEZm1vZKEEDF9fc3RkaW9fc2Vla6IEDV9fc3RkaW9fd3JpdGWjBA1fX3N0ZGlvX2Nsb3NlpAQMX19zdGRpb19leGl0pQQKY2xvc2VfZmlsZaYECF9fdG9yZWFkpwQJX190b3dyaXRlqAQJX19md3JpdGV4qQQGZndyaXRlqgQrZW1zY3JpcHRlbl9tYWluX3RocmVhZF9wcm9jZXNzX3F1ZXVlZF9jYWxsc6sEFF9fcHRocmVhZF9tdXRleF9sb2NrrAQWX19wdGhyZWFkX211dGV4X3VubG9ja60EBl9fbG9ja64EDl9fbWF0aF9kaXZ6ZXJvrwQOX19tYXRoX2ludmFsaWSwBANsb2exBAVsb2cxMLIEB19fbHNlZWuzBAZtZW1jbXC0BApfX29mbF9sb2NrtQQMX19tYXRoX3hmbG93tgQKZnBfYmFycmllcrcEDF9fbWF0aF9vZmxvd7gEDF9fbWF0aF91Zmxvd7kEBGZhYnO6BANwb3e7BAhjaGVja2ludLwEC3NwZWNpYWxjYXNlvQQFcm91bmS+BAZzdHJjaHK/BAtfX3N0cmNocm51bMAEBnN0cmNtcMEEBnN0cmxlbsIEB19fdWZsb3fDBAdfX3NobGltxAQIX19zaGdldGPFBAdpc3NwYWNlxgQGc2NhbGJuxwQJY29weXNpZ25syAQHc2NhbGJubMkEDV9fZnBjbGFzc2lmeWzKBAVmbW9kbMsEBWZhYnNszAQLX19mbG9hdHNjYW7NBAhoZXhmbG9hdM4ECGRlY2Zsb2F0zwQHc2NhbmV4cNAEBnN0cnRveNEEBnN0cnRvZNIEEl9fd2FzaV9zeXNjYWxsX3JldNMECGRsbWFsbG9j1AQGZGxmcmVl1QQYZW1zY3JpcHRlbl9nZXRfaGVhcF9zaXpl1gQEc2Jya9cECF9fYWRkdGYz2AQJX19hc2hsdGkz2QQHX19sZXRmMtoEB19fZ2V0ZjLbBAhfX2RpdnRmM9wEDV9fZXh0ZW5kZGZ0ZjLdBA1fX2V4dGVuZHNmdGYy3gQLX19mbG9hdHNpdGbfBA1fX2Zsb2F0dW5zaXRm4AQNX19mZV9nZXRyb3VuZOEEEl9fZmVfcmFpc2VfaW5leGFjdOIECV9fbHNocnRpM+MECF9fbXVsdGYz5AQIX19tdWx0aTPlBAlfX3Bvd2lkZjLmBAhfX3N1YnRmM+cEDF9fdHJ1bmN0ZmRmMugECXN0YWNrU2F2ZekEDHN0YWNrUmVzdG9yZeoECnN0YWNrQWxsb2PrBBVlbXNjcmlwdGVuX3N0YWNrX2luaXTsBBllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVl7QQZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZe4EGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZO8EDGR5bkNhbGxfamlqafAEFmxlZ2Fsc3R1YiRkeW5DYWxsX2ppamnxBBhsZWdhbGZ1bmMkX193YXNpX2ZkX3NlZWsCEwHvBAQABGZwdHIBATACATEDATIHLQMAD19fc3RhY2tfcG9pbnRlcgELX19zdGFja19lbmQCDF9fc3RhY2tfYmFzZQkYAwAHLnJvZGF0YQEFLmRhdGECBWVtX2pz';
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
