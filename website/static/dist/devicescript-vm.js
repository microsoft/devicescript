
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgAn9/AXxgAn98AGADf35/AX5gAAF+YAF+AX9gBX9/f39/AX9gAX8BfGAEf35+fwBgB39/f39/f38AYAV/f39/fwBgAn9+AGACfHwBfGACfH8BfGAEfn5+fgF/YAABfGADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBf2ACf3wBfGADfH5+AXxgAn5+AX9gA39+fgBgBn9/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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EKECDQAgA0EIaiABQaQBEIgBIABCADcDAAwBCyAAIAIoAgAvAQgQlgILIANBEGokAAt+AgJ/AX4jAEEgayIBJAAgASAAKQNAIgM3AwggASADNwMYAkACQCAAIAFBCGoQoQJFDQAgASgCGCECDAELIAFBEGogAEGkARCIAUEAIQILAkAgACACIABBABDnASAAQQEQ5wEQ1gFFDQAgAUEYaiAAQYoBEIgBCyABQSBqJAALEwAgACAAIABBABDnARCVARDrAQt5AgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwggAyAENwMQAkACQAJAIAEgA0EIahCcAg0AIANBGGogAUGeARCIAQwBCyADIAMpAxA3AwAgASADIANBGGoQngJFDQAgACADKAIYEJYCDAELIABCADcDAAsgA0EgaiQAC5ABAgJ/AX4jAEEwayIBJAAgASAAKQNAIgM3AxAgASADNwMgAkACQCAAIAFBEGoQnAINACABQShqIABBngEQiAFBACECDAELIAEgASkDIDcDCCAAIAFBCGogAUEoahCeAiECCwJAIAJFDQAgAUEYaiAAIAIgASgCKBCIAiAAKAKYASABKQMYNwMgCyABQTBqJAALtgECBX8BfiMAQSBrIgEkACABIAApA0AiBjcDCCABIAY3AxACQAJAIAAgAUEIahCdAg0AIAFBGGogAEGfARCIAUEAIQIMAQsgASABKQMQNwMAIAAgASABQRhqEJ4CIQILAkAgAkUNACAAQQAQ5wEhAyAAQQEQ5wEhBCAAQQIQ5wEhACABKAIYIgUgA00NACABIAUgA2siBTYCGCACIANqIAAgBSAEIAUgBEkbEIMEGgsgAUEgaiQAC/MCAgd/AX4jAEHQAGsiASQAIAEgACkDQCIINwMoIAEgCDcDQAJAAkAgACABQShqEJ0CDQAgAUHIAGogAEGfARCIAUEAIQIMAQsgASABKQNANwMgIAAgAUEgaiABQTxqEJ4CIQILIABBABDnASEDIAEgAEHQAGopAwAiCDcDGCABIAg3AzACQAJAIAAgAUEYahCCAkUNACABIAEpAzA3AwAgACABIAFByABqEIQCIQQMAQsgASABKQMwIgg3A0AgASAINwMQAkAgACABQRBqEJwCDQAgAUHIAGogAEGeARCIAUEAIQQMAQsgASABKQNANwMIIAAgAUEIaiAB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KALAuAEiAyACQcQAaigCACIBa0EASA0AIAJBKGoiAyACKwMYIAEgAGu4oiADKwMAoDkDAAwBCyACQShqIgEgAisDGCADIABruKIgASsDAKA5AwAgAyEBCyACIAE2AhQCQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQkgIhAgsgAkUNAiACIAEoAhAiAUGAuJkpIAFBgLiZKUkbNgIQDwtBACECAkAgAS0ADCIDQQJJDQAgACABQRFqIANBf2oQkgIhAgsgAkUNASACIAEtABBBAEc6AAoPCwJAAkAgACABQZDHABDEA0H/fmoOBAACAgECCyAAIAAoAgwiAUGAuJkpIAFBgLiZKUkbNgIMDwsgACAAKAIIIgFBgLiZKSABQYC4mSlJGyIBNgIIIAFFDQAgAEEAKALAuAEgAWo2AhwLC/oBAQR/IAJBAWohAyABQaAyIAEbIQQCQCAAKAIkIgFFDQADQAJAIAEoAgwiBUUNACAFIAQgAxCZBEUNAgsgASgCACIBDQALCwJAIAENAEHIABAgIgFB/wE6AAogAUEANgIEIAEgACgCJDYCACAAIAE2AiQgAUKAgICAgICA/P8ANwMYIAFBACgCwLgBIgY2AkACQCABKAIQIgUNAAJAAkAgAC0AEkUNACAAQShqIQUgACgCKA0BIAVBiCc2AgAMAQsgAEEMaiEFCyAFKAIAIQULIAEgBSAGajYCRCABQbkjEJACIAEgAxAgIgU2AgwgBSAEIAIQgQQaCyABCzkBAX9BAEGgxwAQyQMiATYCwLUBIAFBAToAEiABIAA2AiAgAUHg1AM2AgwgAUGBAjsBEEEzIAEQUAvKAgEDfwJAQQAoAsC1ASICRQ0AIAIgACAAEKcEEJICIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoAsC4ASIEIABBxABqKAIAIgJrQQBIDQAgAEEo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AkACQCABKAI4IgMgACgCEC8BCEkNACACIAFB9gAQiAEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQhwMCQAJAIAEoAjgiAyABKAKQAS8BDEkNACACIAFB+AAQiAEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALWAEDfyMAQSBrIgIkACACQRhqIAEQhwMgARCIAyEDIAEQiAMhBCACQRBqIAFBARCKAyACIAIpAxA3AwAgAkEIaiABIAAgBCADIAIgAkEYahBdIAJBIGokAAtNAAJAIAJB0wFqLQAAQQFxDQAgAkHdAWotAABBMEsNACACQd4BaiICLwEAQYDgA3FBgCBHDQAgACACLwEAQf8fcRCWAg8LIABCADcDAAs3AQF/AkAgAigCOCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQekAEIgBCzgBAX8CQCACKAI4IgMgAigCkAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQeoAEIgBCykAAkAgAkHTAWotAABBAXENACAAIAJB3gFqLwEAEJYCDwsgAEIANwMAC0oBAX8jAEEgayIDJAAgA0EYaiACEIcDIANBEGogAhCHAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQ4wEgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEIcDIAJBIGogARCHAyACQRhqIAEQhwMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhDkASACQTBqJAALwwEBAn8jAEHAAGsiAyQAIANBIGogAhCHAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAFyIQQCQAJAIARBfyADQRxqIAQQpQIbIgRBf0oNACADQThqIAJB8AAQiAEgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDhAQsgA0HAAGokAAvDAQECfyMAQcAAayIDJAAgA0EgaiACEIcDIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBClAhsiBEF/Sg0AIANBOGogAkHwABCIASADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEOEBCyADQcAAaiQAC8MBAQJ/IwBBwABrIgMkACADQSBqIAIQhwMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIADciEEAkACQCAEQX8gA0EcaiAEEKUCGyIEQX9KDQAgA0E4aiACQfAAEIgBIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ4QELIANBwABqJAALjQEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQpQIbIgRBf0oNACADQRhqIAJB8AAQiAEgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDYASEEIAMgAykDEDcDACAAIAIgBCADEOABIANBIGokAAuNAQECfyMAQSBrIgMkACACKAI4IQQgAyACKAKQATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBClAhsiBEF/Sg0AIANBGGogAkHwABCIASADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsgAkESENgBIQQgAyADKQMQNwMAIAAgAiAEIAMQ4AEgA0EgaiQAC0YBA38jAEEQayICJAACQCABEJMBIgMNACABQRAQZgsgASgCmAEhBCACQQhqIAFBCCADEJgCIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARCIAyIDEJQBIgQNACABIANBA3RBEGoQZgsgASgCmAEhAyACQQhqIAFBCCAEEJgCIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARCIAyIDEJUBIgQNACABIANBDGoQZgsgASgCmAEhAyACQQhqIAFBCCAEEJgCIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigAkAFBPGooAgBBA3YgAigCOCIESw0AIANBCGogAkHvABCIASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2YBAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQCQAJAIARBfyADQQRqIAQQpQIbIgRBf0oNACADQQhqIAJB8AAQiAEgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIANBEGokAAtvAQJ/IwBBEGsiAyQAIAIoAjghBCADIAIoApABNgIEIARBgIABciEEAkACQCAEQX8gA0EEaiAEEKUCGyIEQX9KDQAgA0EIaiACQfAAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbwECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBClAhsiBEF/Sg0AIANBCGogAkHwABCIASAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC28BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgANyIQQCQAJAIARBfyADQQRqIAQQpQIbIgRBf0oNACADQQhqIAJB8AAQiAEgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIANBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKAI4IgQgAigAkAFBJGooAgBBBHZJDQAgA0EIaiACQfIAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAI4EJYCC0cBAX8CQCACKAI4IgMgAigAkAFBNGooAgBBA3ZPDQAgACACKACQASICIAIoAjBqIANBA3RqKQAANwMADwsgACACQesAEIgBCw0AIABBACkD0Ec3AwALSAEDfyMAQRBrIgMkACACEIgDIQQgAhCIAyEFIANBCGogAkECEIoDIAMgAykDCDcDACAAIAIgASAFIAQgA0EAEF0gA0EQaiQACxAAIAAgAigCmAEpAyA3AwALNAEBfyMAQRBrIgMkACADQQhqIAIQhwMgAyADKQMINwMAIAAgAiADEKICEJYCIANBEGokAAsJACAAQgA3AwALNQEBfyMAQRBrIgMkACADQQhqIAIQhwMgAEHAxwBByMcAIAMpAwhQGykDADcDACADQRBqJAALDQAgAEEAKQPARzcDAAsNACAAQQApA8hHNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEIcDIAMgAykDCDcDACAAIAIgAxCbAhCXAiADQRBqJAALDQAgAEEAKQPYRzcDAAupAQIBfwF8IwBBEGsiAyQAIANBCGogAhCHAwJAAkAgAygCDEF/Rg0AIAMgAykDCDcDAAJAIAIgAxCZAiIERAAAAAAAAAAAY0UNACAAIASaEJUCDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA7hHNwMADAILIABBACACaxCWAgwBCyAAIAMpAwg3AwALIANBEGokAAsPACAAIAIQiQNBf3MQlgILMgEBfyMAQRBrIgMkACADQQhqIAIQhwMgACADKAIMRSADKAIIQQJGcRCXAiADQRBqJAALcQEBfyMAQRBrIgMkACADQQhqIAIQhwMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwAgACACIAMQmQKaEJUCDAELAkAgAygCCCICQYCAgIB4Rw0AIABBACkDuEc3AwAMAQsgAEEAIAJrEJYCCyADQRBqJAALNwEBfyMAQRBrIgMkACADQQhqIAIQhwMgAyADKQMINwMAIAAgAiADEJsCQQFzEJcCIANBEGokAAsMACAAIAIQiQMQlgILqgICBH8BfCMAQcAAayIDJAAgA0E4aiACEIcDIAJBGGoiBCADKQM4NwMAIANBOGogAhCHAyACIAMpAzg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBIIAIoAhAiBiAFaiIFIAZIcw0AIAAgBRCWAgwBCyADIAJBEGoiBSkDADcDMAJAAkAgAiADQTBqEIICDQAgAyAEKQMANwMoIAIgA0EoahCCAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqEIsCDAELIAMgBSkDADcDICACIAIgA0EgahCZAjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQmQIiBzkDACAAIAcgAisDIKAQlQILIANBwABqJAALzAECBH8BfCMAQSBrIgMkACADQRhqIAIQhwMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEIcDIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEogAigCECIGIAVrIgUgBkhzDQAgACAFEJYCDAELIAMgAkEQaikDADcDECACIAIgA0EQahCZAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQmQIiBzkDACAAIAIrAyAgB6EQlQILIANBIGokAAvOAQMDfwF+AXwjAEEgayIDJAAgA0EYaiACEIcDIAJBGGoiBCADKQMYNwMAIANBGGogAhCHAyACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAjQCECACNAIYfiIGQiCIpyAGpyIFQR91Rw0AIAAgBRCWAgwBCyADIAJBEGopAwA3AxAgAiACIANBEGoQmQI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJkCIgc5AwAgACAHIAIrAyCiEJUCCyADQSBqJAAL5wECBX8BfCMAQSBrIgMkACADQRhqIAIQhwMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEIcDIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNAAJAAkAgAigCGCIFQQFqDgIAAgELIAIoAhBBgICAgHhGDQELIAIoAhAiBiAFbSIHIAVsIAZHDQAgACAHEJYCDAELIAMgAkEQaikDADcDECACIAIgA0EQahCZAjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQmQIiCDkDACAAIAIrAyAgCKMQlQILIANBIGokAAssAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQIAAgBCADKAIAcRCWAgssAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQIAAgBCADKAIAchCWAgssAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQIAAgBCADKAIAcxCWAgssAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQIAAgBCADKAIAdBCWAgssAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQIAAgBCADKAIAdRCWAgtBAQJ/IAJBGGoiAyACEIkDNgIAIAIgAhCJAyIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBCVAg8LIAAgAhCWAgucAQECfyMAQSBrIgMkACADQRhqIAIQhwMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEIcDIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIQIAIoAhhGIQIMAQsgAyACQRBqKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahCkAiECCyAAIAIQlwIgA0EgaiQAC70BAgJ/AXwjAEEgayIDJAAgA0EYaiACEIcDIAJBGGoiBCADKQMYNwMAIANBGGogAhCHAyACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgAiADQRBqEJkCOQMgIAMgBCkDADcDCCACQShqIAIgA0EIahCZAiIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhCXAiADQSBqJAALvQECAn8BfCMAQSBrIgMkACADQRhqIAIQhwMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEIcDIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiACIANBEGoQmQI5AyAgAyAEKQMANwMIIAJBKGogAiADQQhqEJkCIgU5AwAgAisDICAFYyECDAELIAIoAhAgAigCGEghAgsgACACEJcCIANBIGokAAufAQECfyMAQSBrIgMkACADQRhqIAIQhwMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEIcDIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIQIAIoAhhHIQIMAQsgAyACQRBqKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahCkAkEBcyECCyAAIAIQlwIgA0EgaiQAC5IBAQJ/IwBBIGsiAiQAIAJBGGogARCHAyABKAKYAUIANwMgIAIgAikDGDcDCAJAIAJBCGoQowINAAJAAkAgAigCHCIDQYCAwP8HcQ0AIANBD3FBAUYNAQsgAkEQaiABQfsAEIgBDAELIAEgAigCGBCDASIDRQ0AIAEoApgBQQApA7BHNwMgIAMQhQELIAJBIGokAAsiAQJ/IAEQjQMhAiABKAKYASIDIAI7ARIgA0EAEHsgARB4CyYBAn8gARCIAyECIAEQiAMhAyABIAEQjQMgA0GAIHIgAkEAEMQBCxcBAX8gARCIAyECIAEgARCNAyACEMYBCykBA38gARCMAyECIAEQiAMhAyABEIgDIQQgASABEI0DIAQgAyACEMQBC08BAn8jAEEQayICJAACQAJAIAEQiAMiA0HtAUkNACACQQhqIAFB8wAQiAEMAQsgAUHcAWogAzoAACABQeABakEAIAMQgwQaCyACQRBqJAALXQEEfyMAQRBrIgIkACABEIgDIQMgASACQQxqQQIQiwMhBAJAIAFB3AFqLQAAIANrIgVBAUgNACABIANqQeABaiAEIAIoAgwiASAFIAEgBUkbEIEEGgsgAkEQaiQACw4AIAAgAikDsAG6EJUCC44BAQN/IwBBEGsiAyQAIANBCGogAhCHAyADIAMpAwg3AwACQAJAIAMQowJFDQAgAigCmAEhBAwBC0EAIQQgAygCDCIFQYCAwP8HcQ0AIAVBD3FBA0cNACACIAMoAggQggEhBAsCQAJAIAQNACAAQgA3AwAMAQsgACAEKAIcNgIAIABBATYCBAsgA0EQaiQACxAAIAAgAkHcAWotAAAQlgILQwACQCACQdMBai0AAEEBcQ0AIAJB3QFqLQAAQTBLDQAgAkHeAWoiAi4BAEF/Sg0AIAAgAi0AABCWAg8LIABCADcDAAuqAQEFfyMAQRBrIgIkACACQQhqIAEQhwNBACEDAkAgARCJAyIEQQFIDQACQAJAIAANACAARSEFDAELA0AgACgCCCIARSEFIABFDQEgBEEBSiEGIARBf2ohBCAGDQALCyAFDQAgACABKAI4IgRBA3RqQRhqQQAgBCAAKAIQLwEISRshAwsCQAJAIAMNACACIAFBpgEQiAEMAQsgAyACKQMINwMACyACQRBqJAALqgEBBX8jAEEQayIDJABBACEEAkAgAhCJAyIFQQFIDQACQAJAIAENACABRSEGDAELA0AgASgCCCIBRSEGIAFFDQEgBUEBSiEHIAVBf2ohBSAHDQALCyAGDQAgASACKAI4IgVBA3RqQRhqQQAgBSABKAIQLwEISRshBAsCQAJAIAQNACADQQhqIAJBpwEQiAEgAEIANwMADAELIAAgBCkDADcDAAsgA0EQaiQAC1QBAn8jAEEQayIDJAACQAJAIAIoAjgiBCACKACQAUEkaigCAEEEdkkNACADQQhqIAJBqAEQiAEgAEIANwMADAELIAAgAiABIAQQ2wELIANBEGokAAurAQEDfyMAQSBrIgMkACADQRBqIAIQhwMgAyADKQMQNwMIQQAhBAJAIAIgA0EIahCiAiIFQQlLDQAgBUHMywBqLQAAIQQLAkACQCAEDQAgAEIANwMADAELIAIgBDYCOCADIAIoApABNgIEAkAgA0EEaiAEQYCAAXIiBBClAg0AIANBGGogAkHwABCIASAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EgaiQACw0AIABBACkD4Ec3AwALcQEBfyMAQSBrIgMkACADQRhqIAIQhwMgAyADKQMYNwMQAkACQAJAIANBEGoQgwINACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEJkCEJUCCyADQSBqJAALjQEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQpQIbIgRBf0oNACADQRhqIAJB8AAQiAEgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBARDYASEEIAMgAykDEDcDACAAIAIgBCADEOABIANBIGokAAudAQECfyMAQTBrIgIkACACQShqIAEQhwMgAkEgaiABEIcDIAEoApgBQQApA8hHNwMgIAIgAikDKDcDEAJAIAEgAkEQahCCAg0AIAJBGGogAUGsARCIAQsgAiACKQMgNwMIAkAgASACQQhqEN0BIgNFDQAgAiACKQMoNwMAIAEgAyACENcBDQAgASgCmAFBACkDwEc3AyALIAJBMGokAAs/AQF/AkAgAS0AMiICDQAgACABQewAEIgBDwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akHAAGopAwA3AwALawECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIgBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBwABqKQMANwMICyABIAEpAwg3AwAgACABEJoCIQAgAUEQaiQAIAALawECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIgBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBwABqKQMANwMICyABIAEpAwg3AwAgACABEJoCIQAgAUEQaiQAIAAL8gEBAn8jAEEwayIDJAACQAJAIAEtADIiBA0AIANBKGogAUHsABCIAQwBCyABIARB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AAJAAkACQCADIARCAEIAEL8ERQ0AIAMgBBCvBCEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDJBCAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADEMEEIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAitQjCGIAJC////////P4OEIgkgAyAEQjCIp0H//wFxIgatQjCGIARC////////P4OEIgoQvwRBAEoNAAJAIAEgCSADIAoQvwRFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQyQQgBUH4AGopAwAhAiAFKQNwIQQMAQsCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQyQQgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEMkEIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDJBCAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQyQQgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EMkEIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCAC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IgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKAKMuwFHDQFBACAANgKAuwEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBA3YiAkEDdEGguwFqIQACQAJAQQAoAvi6ASIEQQEgAnQiAnENAEEAIAQgAnI2Avi6ASAAIQIMAQsgACgCCCECCyAAIAE2AgggAiABNgIMIAEgADYCDCABIAI2AggPC0EfIQICQCAAQf///wdLDQAgAEEIdiICIAJBgP4/akEQdkEIcSICdCIEIARBgOAfakEQdkEEcSIEdCIGIAZBgIAPakEQdkECcSIGdEEPdiACIARyIAZyayICQQF0IAAgAkEVanZBAXFyQRxqIQILIAFCADcCECABQRxqIAI2AgAgAkECdEGovQFqIQQCQAJAAkACQEEAKAL8ugEiBkEBIAJ0IgNxDQBBACAGIANyNgL8ugEgBCABNgIAIAFBGGogBDYCAAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABQRhqIAQ2AgALIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBGGpBADYCACABIAQ2AgwgASAANgIIC0EAQQAoApi7AUF/aiIBQX8gARs2Api7AQsLBwA/AEEQdAtUAQJ/QQAoArSqASIBIABBA2pBfHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABC7BE0NACAAEBNFDQELQQAgADYCtKoBIAEPCxD+A0EwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCiAEIAIgBxsiCUL///////8/gyELIAIgBCAHGyIMQjCIp0H//wFxIQgCQCAJQjCIp0H//wFxIgYNACAFQeAAaiAKIAsgCiALIAtQIgYbeSAGQQZ0rXynIgZBcWoQvgRBECAGayEGIAVB6ABqKQMAIQsgBSkDYCEKCyABIAMgBxshAyAMQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqEL4EQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhAiALQgOGIApCPYiEIQQgA0IDhiEBIAkgDIUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQJCASEBDAELIAVBwABqIAEgAkGAASAHaxC+BCAFQTBqIAEgAiAHEMgEIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEBIAVBMGpBCGopAwAhAgsgBEKAgICAgICABIQhDCAKQgOGIQsCQAJAIANCf1UNAEIAIQNCACEEIAsgAYUgDCAChYRQDQIgCyABfSEKIAwgAn0gCyABVK19IgRC/////////wNWDQEgBUEgaiAKIAQgCiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQvgQgBiAHayEGIAVBKGopAwAhBCAFKQMgIQoMAQsgAiAMfCABIAt8IgogAVStfCIEQoCAgICAgIAIg1ANACAKQgGIIARCP4aEIApCAYOEIQogBkEBaiEGIARCAYghBAsgCUKAgICAgICAgIB/gyEBAkAgBkH//wFIDQAgAUKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiAKIAQgBkH/AGoQvgQgBSAKIARBASAGaxDIBCAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCEKIAVBCGopAwAhBAsgCkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAGEIQQgCqdBB3EhBgJAAkACQAJAAkAQxgQOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyABQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyABUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQxwQaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL3xACBX8OfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJA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KQMAQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hDSAEIAF9IQQLIAVBEGogAyAOQgNCABDKBCAFIAMgDkIFQgAQygQgCyACIAJCAYMiASAEfCIEIANWIA0gBCABVK18IgEgDlYgASAOURutfCIDIAJUrXwiAiADIAJCgICAgICAwP//AFQgBCAFKQMQViABIAVBEGpBCGopAwAiAlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqEL4EIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqEL4EIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQvgQgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQvgQgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQvgRBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQvgQgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIApCD4YgA0IxiIQiFEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQYABSQ0AQgAhAQwDCyAFQTBqIBIgASAGQf8AaiIGEL4EIAVBIGogAiAEIAYQvgQgBUEQaiASIAEgBxDIBCAFIAIgBCAHEMgEIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAQsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCIEIAFCIIgiAn58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAJ+fCIDQiCIfCADQv////8PgyAEIAF+fCIDQiCIfDcDCCAAIANCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FEL0EIAUpAwAhASAAIAVBCGopAwA3AwggACABNwMAIAVBEGokAAvqAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIhUIAUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahC+BCACIAAgBEGB+AAgA2sQyAQgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACIVCAFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELFQBB8L7BAiQCQei+AUEPakFwcSQBCwcAIwAjAWsLBAAjAgsEACMBCw0AIAEgAiADIAARDgALJAEBfiAAIAEgAq0gA61CIIaEIAQQ1QQhBSAFQiCIpxAUIAWnCxMAIAAgAacgAUIgiKcgAiADEBULC8iigYAAAwBBgAgLiJ4BaW5maW5pdHkALUluZmluaXR5AGh1bWlkaXR5AGFjaWRpdHkAZGV2c192ZXJpZnkAYXJyYXkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAJXM6JXgAY2xvc3VyZTolZDoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AHBvdwBqZF93c3NrX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGF1dGggdG9vIHNob3J0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AHJhbmRvbUludABwYXJzZUludABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAdmFsdWVzAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGFicwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBmbG9vcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAc21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAHJlLXJ1bgBub24tZnVuAGJ1dHRvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGxvZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgAwMTIzNDU2Nzg5YWJjZGVmACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAdHJ1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGhlYXJ0UmF0ZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAZGV2c19tYWtlX2Nsb3N1cmUAcHJvdG90eXBlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBvbkNoYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQBzdWJzY3JpYmUAY2xvdWQAaW1vZAByb3VuZABib3VuZAByb2xlbWdyX2F1dG9iaW5kAGRldnNfb2JqZWN0X2dldF9ub19iaW5kAGRldnNfZnVuY3Rpb25fYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9uRGlzY29ubmVjdGVkAFdTOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABhZ2didWZmZXJfdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkAHJlYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAGZ1bjolZABidWlsdGluOiVkAERldmljZVNjcmlwdCBydW50aW1lIHYlZC4lZC4lZDsgZmlsZSB2JWQuJWQuJWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAHR2b2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAHBhbmljAGJhZCBtYWdpYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdmVyaWZ5LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9maWJlcnMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9idWZmZXIuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdm1fbWFpbi5jAGphY2RhYy1jL25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAamFjZGFjLWMvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW0Z1bmN0aW9uOiAlc10AW0Nsb3N1cmU6ICVzXQBbUm9sZTogJXNdAFtNZXRob2Q6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAKHRhZyAmIERFVlNfR0NfVEFHX01BU0spID49IERFVlNfR0NfVEFHX0JZVEVTAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAG1pZHggPCBNQVhfUFJPVE8Ac3RtdF9jYWxsTgBOYU4AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwAUEkARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBMT0cyRQBMT0cxMEUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGxvZzIAU1FSVDFfMgBTUVJUMgBlQ08yAExOMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGN0eC0+c3RhY2tfdG9wID09IE4gKyAxAGFyZzAAbG9nMTAATE4xMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABhY3QtPm1heHBjID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABoLT5udW1fYXJncyA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMABkZXZzX2hhbmRsZV9oaWdoX3ZhbHVlKG9iaikgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoaHYgPj4gUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NL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ALPYgIAABG5hbWUBzVfYBAAFYWJvcnQBE19kZXZzX3BhbmljX2hhbmRsZXICDWVtX3NlbmRfZnJhbWUDEGVtX2NvbnNvbGVfZGVidWcEBGV4aXQFC2VtX3RpbWVfbm93BhNkZXZzX2RlcGxveV9oYW5kbGVyByBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQghZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkCRhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcKMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkCzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQMM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZUUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZUYPcm9sZW1ncl9wcm9jZXNzRxByb2xlbWdyX2F1dG9iaW5kSBVyb2xlbWdyX2hhbmRsZV9wYWNrZXRJFGpkX3JvbGVfbWFuYWdlcl9pbml0Shhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWRLDWpkX3JvbGVfYWxsb2NMEGpkX3JvbGVfZnJlZV9hbGxNFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmROEmpkX3JvbGVfYnlfc2VydmljZU8TamRfY2xpZW50X2xvZ19ldmVudFATamRfY2xpZW50X3N1YnNjcmliZVEUamRfY2xpZW50X2VtaXRfZXZlbnRSFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkUxBqZF9kZXZpY2VfbG9va3VwVBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2VVE2pkX3NlcnZpY2Vfc2VuZF9jbWRWEWpkX2NsaWVudF9wcm9jZXNzVw5qZF9kZXZpY2VfZnJlZVgXamRfY2xpZW50X2hhbmRsZV9wYWNrZXRZD2pkX2RldmljZV9hbGxvY1oOYWdnYnVmZmVyX2luaXRbD2FnZ2J1ZmZlcl9mbHVzaFwQYWdnYnVmZmVyX3VwbG9hZF0OZGV2c19idWZmZXJfb3BeEGRldnNfcmVhZF9udW1iZXJfD2RldnNfY3JlYXRlX2N0eGAJc2V0dXBfY3R4YQpkZXZzX3RyYWNlYg9kZXZzX2Vycm9yX2NvZGVjGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJkCWNsZWFyX2N0eGUNZGV2c19mcmVlX2N0eGYIZGV2c19vb21nCWRldnNfZnJlZWgXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NpB3RyeV9ydW5qDHN0b3BfcHJvZ3JhbWscZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydGwcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZW0YZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNobh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldG8OZGVwbG95X2hhbmRsZXJwE2RlcGxveV9tZXRhX2hhbmRsZXJxFmRldmljZXNjcmlwdG1ncl9kZXBsb3lyFGRldmljZXNjcmlwdG1ncl9pbml0cxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2dBFkZXZzY2xvdWRfcHJvY2Vzc3UXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXR2E2RldnNjbG91ZF9vbl9tZXRob2R3DmRldnNjbG91ZF9pbml0eBBkZXZzX2ZpYmVyX3lpZWxkeRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb256CmRldnNfcGFuaWN7GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXwQZGV2c19maWJlcl9zbGVlcH0bZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsfgxsb2dfZmliZXJfb3B/GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzgAERZGV2c19pbWdfZnVuX25hbWWBARJkZXZzX2ltZ19yb2xlX25hbWWCARJkZXZzX2ZpYmVyX2J5X2ZpZHiDARFkZXZzX2ZpYmVyX2J5X3RhZ4QBEGRldnNfZmliZXJfc3RhcnSFARRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYYBDmRldnNfZmliZXJfcnVuhwETZGV2c19maWJlcl9zeW5jX25vd4gBFV9kZXZzX3J1bnRpbWVfZmFpbHVyZYkBD2RldnNfZmliZXJfcG9rZYoBE2pkX2djX2FueV90cnlfYWxsb2OLAQdkZXZzX2djjAEPZmluZF9mcmVlX2Jsb2NrjQESZGV2c19hbnlfdHJ5X2FsbG9jjgEOZGV2c190cnlfYWxsb2OPAQtqZF9nY191bnBpbpABCmpkX2djX2ZyZWWRAQ5kZXZzX3ZhbHVlX3BpbpIBEGRldnNfdmFsdWVfdW5waW6TARJkZXZzX21hcF90cnlfYWxsb2OUARRkZXZzX2FycmF5X3RyeV9hbGxvY5UBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5YBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5cBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0mAEPZGV2c19nY19zZXRfY3R4mQEOZGV2c19nY19jcmVhdGWaAQ9kZXZzX2djX2Rlc3Ryb3mbAQtzY2FuX2djX29iapwBCnNjYW5fYXJyYXmdARNzY2FuX2FycmF5X2FuZF9tYXJrngEIbWFya19wdHKfARFwcm9wX0FycmF5X2xlbmd0aKABEm1ldGgyX0FycmF5X2luc2VydKEBEWZ1bjFfQnVmZmVyX2FsbG9jogEScHJvcF9CdWZmZXJfbGVuZ3RoowEVbWV0aDBfQnVmZmVyX3RvU3RyaW5npAETbWV0aDNfQnVmZmVyX2ZpbGxBdKUBE21ldGg0X0J1ZmZlcl9ibGl0QXSmARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zpwEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOoARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SpARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSqARVmdW4xX0RldmljZVNjcmlwdF9sb2erARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnStARRtZXRoWF9GdW5jdGlvbl9zdGFydK4BDmZ1bjFfTWF0aF9jZWlsrwEPZnVuMV9NYXRoX2Zsb29ysAEPZnVuMV9NYXRoX3JvdW5ksQENZnVuMV9NYXRoX2Fic7IBEGZ1bjBfTWF0aF9yYW5kb22zARNmdW4xX01hdGhfcmFuZG9tSW50tAENZnVuMV9NYXRoX2xvZ7UBDWZ1bjJfTWF0aF9wb3e2AQ5mdW4yX01hdGhfaWRpdrcBDmZ1bjJfTWF0aF9pbW9kuAEOZnVuMl9NYXRoX2ltdWy5AQ1mdW4yX01hdGhfbWluugELZnVuMl9taW5tYXi7AQ1mdW4yX01hdGhfbWF4vAESZnVuMl9PYmplY3RfYXNzaWduvQEQZnVuMV9PYmplY3Rfa2V5c74BE2Z1bjFfa2V5c19vcl92YWx1ZXO/ARJmdW4xX09iamVjdF92YWx1ZXPAARVwcm9wX1JvbGVfaXNDb25uZWN0ZWTBARJwcm9wX1N0cmluZ19sZW5ndGjCARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdMMBE21ldGgxX1N0cmluZ19jaGFyQXTEARRkZXZzX2pkX2dldF9yZWdpc3RlcsUBFmRldnNfamRfY2xlYXJfcGt0X2tpbmTGARBkZXZzX2pkX3NlbmRfY21kxwETZGV2c19qZF9zZW5kX2xvZ21zZ8gBDWhhbmRsZV9sb2dtc2fJARJkZXZzX2pkX3Nob3VsZF9ydW7KARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZcsBE2RldnNfamRfcHJvY2Vzc19wa3TMARRkZXZzX2pkX3JvbGVfY2hhbmdlZM0BFGRldnNfamRfcmVzZXRfcGFja2V0zgESZGV2c19qZF9pbml0X3JvbGVzzwESZGV2c19qZF9mcmVlX3JvbGVz0AEQZGV2c19zZXRfbG9nZ2luZ9EBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc9IBEmRldnNfbWFwX2NvcHlfaW50b9MBDGRldnNfbWFwX3NldNQBBmxvb2t1cNUBF2RldnNfbWFwX2tleXNfb3JfdmFsdWVz1gERZGV2c19hcnJheV9pbnNlcnTXAQ9kZXZzX21hcF9kZWxldGXYARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7ZARFkZXZzX3Byb3RvX2xvb2t1cNoBEmRldnNfZnVuY3Rpb25fYmluZNsBEWRldnNfbWFrZV9jbG9zdXJl3AEOZGV2c19nZXRfZm5pZHjdARtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnfeARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTfAR1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51beABF2RldnNfb2JqZWN0X2dldF9ub19iaW5k4QEPZGV2c19vYmplY3RfZ2V04gEMZGV2c19zZXFfZ2V04wEMZGV2c19hbnlfZ2V05AEMZGV2c19hbnlfc2V05QEMZGV2c19zZXFfc2V05gEOZGV2c19hcnJheV9zZXTnAQxkZXZzX2FyZ19pbnToAQ9kZXZzX2FyZ19kb3VibGXpAQ9kZXZzX3JldF9kb3VibGXqAQxkZXZzX3JldF9pbnTrAQ9kZXZzX3JldF9nY19wdHLsARJkZXZzX3JlZ2NhY2hlX2ZyZWXtARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs7gEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTvARNkZXZzX3JlZ2NhY2hlX2FsbG9j8AEUZGV2c19yZWdjYWNoZV9sb29rdXDxARFkZXZzX3JlZ2NhY2hlX2FnZfIBF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xl8wESZGV2c19yZWdjYWNoZV9uZXh09AEPamRfc2V0dGluZ3NfZ2V09QEPamRfc2V0dGluZ3Nfc2V09gEOZGV2c19sb2dfdmFsdWX3AQ9kZXZzX3Nob3dfdmFsdWX4ARBkZXZzX3Nob3dfdmFsdWUw+QENY29uc3VtZV9jaHVua/oBDXNoYV8yNTZfY2xvc2X7AQ9qZF9zaGEyNTZfc2V0dXD8ARBqZF9zaGEyNTZfdXBkYXRl/QEQamRfc2hhMjU2X2ZpbmlzaP4BFGpkX3NoYTI1Nl9obWFjX3NldHVw/wEVamRfc2hhMjU2X2htYWNfZmluaXNogAIOamRfc2hhMjU2X2hrZGaBAg5kZXZzX3N0cmZvcm1hdIICDmRldnNfaXNfc3RyaW5ngwIOZGV2c19pc19udW1iZXKEAhRkZXZzX3N0cmluZ19nZXRfdXRmOIUCE2RldnNfYnVpbHRpbl9zdHJpbmeGAhRkZXZzX3N0cmluZ192c3ByaW50ZocCE2RldnNfc3RyaW5nX3NwcmludGaIAhVkZXZzX3N0cmluZ19mcm9tX3V0ZjiJAhRkZXZzX3ZhbHVlX3RvX3N0cmluZ4oCEGJ1ZmZlcl90b19zdHJpbmeLAhJkZXZzX3N0cmluZ19jb25jYXSMAhxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNjjQIPdHNhZ2dfY2xpZW50X2V2jgIKYWRkX3Nlcmllc48CDXRzYWdnX3Byb2Nlc3OQAgpsb2dfc2VyaWVzkQITdHNhZ2dfaGFuZGxlX3BhY2tldJICFGxvb2t1cF9vcl9hZGRfc2VyaWVzkwIKdHNhZ2dfaW5pdJQCDHRzYWdnX3VwZGF0ZZUCFmRldnNfdmFsdWVfZnJvbV9kb3VibGWWAhNkZXZzX3ZhbHVlX2Zyb21faW50lwIUZGV2c192YWx1ZV9mcm9tX2Jvb2yYAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcpkCFGRldnNfdmFsdWVfdG9fZG91YmxlmgIRZGV2c192YWx1ZV90b19pbnSbAhJkZXZzX3ZhbHVlX3RvX2Jvb2ycAg5kZXZzX2lzX2J1ZmZlcp0CF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxlngIQZGV2c19idWZmZXJfZGF0YZ8CE2RldnNfYnVmZmVyaXNoX2RhdGGgAhRkZXZzX3ZhbHVlX3RvX2djX29iaqECDWRldnNfaXNfYXJyYXmiAhFkZXZzX3ZhbHVlX3R5cGVvZqMCD2RldnNfaXNfbnVsbGlzaKQCEmRldnNfdmFsdWVfaWVlZV9lcaUCEmRldnNfaW1nX3N0cmlkeF9va6YCEmRldnNfZHVtcF92ZXJzaW9uc6cCC2RldnNfdmVyaWZ5qAIUZGV2c192bV9leGVjX29wY29kZXOpAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeKoCEWRldnNfaW1nX2dldF91dGY4qwIUZGV2c19nZXRfc3RhdGljX3V0ZjisAgxleHByX2ludmFsaWStAhRleHByeF9idWlsdGluX29iamVjdK4CC3N0bXQxX2NhbGwwrwILc3RtdDJfY2FsbDGwAgtzdG10M19jYWxsMrECC3N0bXQ0X2NhbGwzsgILc3RtdDVfY2FsbDSzAgtzdG10Nl9jYWxsNbQCC3N0bXQ3X2NhbGw2tQILc3RtdDhfY2FsbDe2AgtzdG10OV9jYWxsOLcCDGV4cHIyX3N0cjBlcbgCDHN0bXQxX3JldHVybrkCCXN0bXR4X2ptcLoCDHN0bXR4MV9qbXBfersCC3N0bXQxX3BhbmljvAIWZXhwcjBfcGt0X2NvbW1hbmRfY29kZb0CEnN0bXR4MV9zdG9yZV9sb2NhbL4CE3N0bXR4MV9zdG9yZV9nbG9iYWy/AhJzdG10NF9zdG9yZV9idWZmZXLAAhZleHByMF9wa3RfcmVnX2dldF9jb2RlwQIQZXhwcnhfbG9hZF9sb2NhbMICEWV4cHJ4X2xvYWRfZ2xvYmFswwIVZXhwcjBfcGt0X3JlcG9ydF9jb2RlxAILZXhwcjJfaW5kZXjFAg9zdG10M19pbmRleF9zZXTGAhRleHByeDFfYnVpbHRpbl9maWVsZMcCEmV4cHJ4MV9hc2NpaV9maWVsZMgCEWV4cHJ4MV91dGY4X2ZpZWxkyQIQZXhwcnhfbWF0aF9maWVsZMoCDmV4cHJ4X2RzX2ZpZWxkywIPc3RtdDBfYWxsb2NfbWFwzAIRc3RtdDFfYWxsb2NfYXJyYXnNAhJzdG10MV9hbGxvY19idWZmZXLOAhFleHByeF9zdGF0aWNfcm9sZc8CE2V4cHJ4X3N0YXRpY19idWZmZXLQAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfRAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n0gIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n0wIVZXhwcnhfc3RhdGljX2Z1bmN0aW9u1AINZXhwcnhfbGl0ZXJhbNUCEWV4cHJ4X2xpdGVyYWxfZjY01gIQZXhwcjBfcGt0X2J1ZmZlctcCEWV4cHIzX2xvYWRfYnVmZmVy2AINZXhwcjBfcmV0X3ZhbNkCDGV4cHIxX3R5cGVvZtoCCmV4cHIwX251bGzbAg1leHByMV9pc19udWxs3AIKZXhwcjBfdHJ1Zd0CC2V4cHIwX2ZhbHNl3gINZXhwcjFfdG9fYm9vbN8CCWV4cHIwX25hbuACCWV4cHIxX2Fic+ECDWV4cHIxX2JpdF9ub3TiAgxleHByMV9pc19uYW7jAglleHByMV9uZWfkAglleHByMV9ub3TlAgxleHByMV90b19pbnTmAglleHByMl9hZGTnAglleHByMl9zdWLoAglleHByMl9tdWzpAglleHByMl9kaXbqAg1leHByMl9iaXRfYW5k6wIMZXhwcjJfYml0X29y7AINZXhwcjJfYml0X3hvcu0CEGV4cHIyX3NoaWZ0X2xlZnTuAhFleHByMl9zaGlmdF9yaWdodO8CGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk8AIIZXhwcjJfZXHxAghleHByMl9sZfICCGV4cHIyX2x08wIIZXhwcjJfbmX0AhVzdG10MV90ZXJtaW5hdGVfZmliZXL1Ag9zdG10MV93YWl0X3JvbGX2Ag9zdG10M19xdWVyeV9yZWf3Ag5zdG10Ml9zZW5kX2NtZPgCE3N0bXQ0X3F1ZXJ5X2lkeF9yZWf5AhZzdG10MV9zZXR1cF9wa3RfYnVmZmVy+gINc3RtdDJfc2V0X3BrdPsCDGV4cHIwX25vd19tc/wCFmV4cHIxX2dldF9maWJlcl9oYW5kbGX9Ag5leHByMF9wa3Rfc2l6Zf4CEWV4cHIwX3BrdF9ldl9jb2Rl/wIUc3RtdHgyX3N0b3JlX2Nsb3N1cmWAAxNleHByeDFfbG9hZF9jbG9zdXJlgQMSZXhwcnhfbWFrZV9jbG9zdXJlggMQZXhwcjFfdHlwZW9mX3N0coMDCWV4cHIwX2luZoQDC2V4cHIxX3VwbHVzhQMSZXhwcnhfb2JqZWN0X2ZpZWxkhgMSc3RtdDJfaW5kZXhfZGVsZXRlhwMPZGV2c192bV9wb3BfYXJniAMTZGV2c192bV9wb3BfYXJnX3UzMokDE2RldnNfdm1fcG9wX2FyZ19pMzKKAxZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyiwMbZGV2c192bV9wb3BfYXJnX2J1ZmZlcl9kYXRhjAMWZGV2c192bV9wb3BfYXJnX3N0cmlkeI0DFGRldnNfdm1fcG9wX2FyZ19yb2xljgMSamRfYWVzX2NjbV9lbmNyeXB0jwMSamRfYWVzX2NjbV9kZWNyeXB0kAMMQUVTX2luaXRfY3R4kQMPQUVTX0VDQl9lbmNyeXB0kgMQamRfYWVzX3NldHVwX2tleZMDDmpkX2Flc19lbmNyeXB0lAMQamRfYWVzX2NsZWFyX2tleZUDC2pkX3dzc2tfbmV3lgMUamRfd3Nza19zZW5kX21lc3NhZ2WXAxNqZF93ZWJzb2NrX29uX2V2ZW50mAMHZGVjcnlwdJkDDWpkX3dzc2tfY2xvc2WaAxBqZF93c3NrX29uX2V2ZW50mwMKc2VuZF9lbXB0eZwDEndzc2toZWFsdGhfcHJvY2Vzc50DF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlngMUd3Nza2hlYWx0aF9yZWNvbm5lY3SfAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSgAw9zZXRfY29ubl9zdHJpbmehAxFjbGVhcl9jb25uX3N0cmluZ6IDD3dzc2toZWFsdGhfaW5pdKMDE3dzc2tfcHVibGlzaF92YWx1ZXOkAxB3c3NrX3B1Ymxpc2hfYmlupQMRd3Nza19pc19jb25uZWN0ZWSmAxN3c3NrX3Jlc3BvbmRfbWV0aG9kpwMPamRfY3RybF9wcm9jZXNzqAMVamRfY3RybF9oYW5kbGVfcGFja2V0qQMMamRfY3RybF9pbml0qgMNamRfaXBpcGVfb3BlbqsDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXSsAw5qZF9pcGlwZV9jbG9zZa0DEmpkX251bWZtdF9pc192YWxpZK4DFWpkX251bWZtdF93cml0ZV9mbG9hdK8DE2pkX251bWZtdF93cml0ZV9pMzKwAxJqZF9udW1mbXRfcmVhZF9pMzKxAxRqZF9udW1mbXRfcmVhZF9mbG9hdLIDEWpkX29waXBlX29wZW5fY21kswMUamRfb3BpcGVfb3Blbl9yZXBvcnS0AxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0tQMRamRfb3BpcGVfd3JpdGVfZXi2AxBqZF9vcGlwZV9wcm9jZXNztwMUamRfb3BpcGVfY2hlY2tfc3BhY2W4Aw5qZF9vcGlwZV93cml0ZbkDDmpkX29waXBlX2Nsb3NlugMNamRfcXVldWVfcHVzaLsDDmpkX3F1ZXVlX2Zyb250vAMOamRfcXVldWVfc2hpZnS9Aw5qZF9xdWV1ZV9hbGxvY74DDWpkX3Jlc3BvbmRfdTi/Aw5qZF9yZXNwb25kX3UxNsADDmpkX3Jlc3BvbmRfdTMywQMRamRfcmVzcG9uZF9zdHJpbmfCAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZMMDC2pkX3NlbmRfcGt0xAMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzFAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcsYDGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTHAxRqZF9hcHBfaGFuZGxlX3BhY2tldMgDFWpkX2FwcF9oYW5kbGVfY29tbWFuZMkDE2pkX2FsbG9jYXRlX3NlcnZpY2XKAxBqZF9zZXJ2aWNlc19pbml0ywMOamRfcmVmcmVzaF9ub3fMAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkzQMUamRfc2VydmljZXNfYW5ub3VuY2XOAxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZc8DEGpkX3NlcnZpY2VzX3RpY2vQAxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfRAxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZdIDEmFwcF9nZXRfZndfdmVyc2lvbtMDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXUAw1qZF9oYXNoX2ZudjFh1QMMamRfZGV2aWNlX2lk1gMJamRfcmFuZG9t1wMIamRfY3JjMTbYAw5qZF9jb21wdXRlX2NyY9kDDmpkX3NoaWZ0X2ZyYW1l2gMOamRfcmVzZXRfZnJhbWXbAxBqZF9wdXNoX2luX2ZyYW1l3AMNamRfcGFuaWNfY29yZd0DE2pkX3Nob3VsZF9zYW1wbGVfbXPeAxBqZF9zaG91bGRfc2FtcGxl3wMJamRfdG9faGV44AMLamRfZnJvbV9oZXjhAw5qZF9hc3NlcnRfZmFpbOIDB2pkX2F0b2njAwtqZF92c3ByaW50ZuQDD2pkX3ByaW50X2RvdWJsZeUDCmpkX3NwcmludGbmAxJqZF9kZXZpY2Vfc2hvcnRfaWTnAwxqZF9zcHJpbnRmX2HoAwtqZF90b19oZXhfYekDFGpkX2RldmljZV9zaG9ydF9pZF9h6gMJamRfc3RyZHVw6wMOamRfanNvbl9lc2NhcGXsAxNqZF9qc29uX2VzY2FwZV9jb3Jl7QMJamRfbWVtZHVw7gMWamRfcHJvY2Vzc19ldmVudF9xdWV1Ze8DFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWXwAxFqZF9zZW5kX2V2ZW50X2V4dPEDCmpkX3J4X2luaXTyAxRqZF9yeF9mcmFtZV9yZWNlaXZlZPMDHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNr9AMPamRfcnhfZ2V0X2ZyYW1l9QMTamRfcnhfcmVsZWFzZV9mcmFtZfYDEWpkX3NlbmRfZnJhbWVfcmF39wMNamRfc2VuZF9mcmFtZfgDCmpkX3R4X2luaXT5AwdqZF9zZW5k+gMWamRfc2VuZF9mcmFtZV93aXRoX2NyY/sDD2pkX3R4X2dldF9mcmFtZfwDEGpkX3R4X2ZyYW1lX3NlbnT9AwtqZF90eF9mbHVzaP4DEF9fZXJybm9fbG9jYXRpb27/AwxfX2ZwY2xhc3NpZnmABAVkdW1teYEECF9fbWVtY3B5ggQHbWVtbW92ZYMEBm1lbXNldIQECl9fbG9ja2ZpbGWFBAxfX3VubG9ja2ZpbGWGBARmbW9khwQMX19zdGRpb19zZWVriAQNX19zdGRpb193cml0ZYkEDV9fc3RkaW9fY2xvc2WKBAxfX3N0ZGlvX2V4aXSLBApjbG9zZV9maWxljAQIX190b3JlYWSNBAlfX3Rvd3JpdGWOBAlfX2Z3cml0ZXiPBAZmd3JpdGWQBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzkQQUX19wdGhyZWFkX211dGV4X2xvY2uSBBZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrkwQGX19sb2NrlAQOX19tYXRoX2Rpdnplcm+VBA5fX21hdGhfaW52YWxpZJYEA2xvZ5cEBWxvZzEwmAQHX19sc2Vla5kEBm1lbWNtcJoECl9fb2ZsX2xvY2ubBAxfX21hdGhfeGZsb3ecBApmcF9iYXJyaWVynQQMX19tYXRoX29mbG93ngQMX19tYXRoX3VmbG93nwQEZmFic6AEA3Bvd6EECGNoZWNraW50ogQLc3BlY2lhbGNhc2WjBAVyb3VuZKQEBnN0cmNocqUEC19fc3RyY2hybnVspgQGc3RyY21wpwQGc3RybGVuqAQHX191Zmxvd6kEB19fc2hsaW2qBAhfX3NoZ2V0Y6sEB2lzc3BhY2WsBAZzY2FsYm6tBAljb3B5c2lnbmyuBAdzY2FsYm5srwQNX19mcGNsYXNzaWZ5bLAEBWZtb2RssQQFZmFic2yyBAtfX2Zsb2F0c2NhbrMECGhleGZsb2F0tAQIZGVjZmxvYXS1BAdzY2FuZXhwtgQGc3RydG94twQGc3RydG9kuAQSX193YXNpX3N5c2NhbGxfcmV0uQQIZGxtYWxsb2O6BAZkbGZyZWW7BBhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemW8BARzYnJrvQQIX19hZGR0ZjO+BAlfX2FzaGx0aTO/BAdfX2xldGYywAQHX19nZXRmMsEECF9fZGl2dGYzwgQNX19leHRlbmRkZnRmMsMEDV9fZXh0ZW5kc2Z0ZjLEBAtfX2Zsb2F0c2l0ZsUEDV9fZmxvYXR1bnNpdGbGBA1fX2ZlX2dldHJvdW5kxwQSX19mZV9yYWlzZV9pbmV4YWN0yAQJX19sc2hydGkzyQQIX19tdWx0ZjPKBAhfX211bHRpM8sECV9fcG93aWRmMswECF9fc3VidGYzzQQMX190cnVuY3RmZGYyzgQJc3RhY2tTYXZlzwQMc3RhY2tSZXN0b3Jl0AQKc3RhY2tBbGxvY9EEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdNIEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXTBBllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl1AQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k1QQMZHluQ2FsbF9qaWpp1gQWbGVnYWxzdHViJGR5bkNhbGxfamlqadcEGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAdUEBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
