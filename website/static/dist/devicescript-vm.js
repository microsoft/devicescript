
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AX9gBX9/f39/AGACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADAP1hICAAPMEBgEABgYIBgAABgQACAYGBQUAAwIABgYCBAMDAxEGEQYGAwcGAgYGAwkFBQUFBgAIBRUbDQwFAgcDBwAAAgIAAAAEAwQCAgIDAAcAAgcAAAMCAgICAAMDAwMFAAAAAQAFAAUFAwICAgIEAwMDBQIIAAEBAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAQEBAQEBAQEBAQEBAQEADQACAgABAQEAAQAAAQAADQABAgABAgMEBQECAAACCAEHAwUHCQUDBQMHBwcHCQwFBwMDBQMHBwcHBwcDDg8CAgIEAQMCAAMJCQECCQQDAQMDAgQGAgACABwdAwQFAgcHBwEBBwcBAwICAQcEBwMAAgIFAA8PAgIHDgMDAwMFBQMDAwQFAQMAAwMABAUFAwEBAgICAgICAgICAgICAgIBAgICAQEBAQECAQEBAQECAgIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQEBAQECAgICAgICAgIBAgQEAQ0MAgIAAAYJAwEDBgEAAAgAAgcABgUDCAkEBAAAAgYAAwYGBAECAQASAwkGAAAEAAIGBQAABB4BAw4DAwAJBgMFBAMEAAQDAwMDBAQFBQAAAAQGBgYGBAYGBggIAxEIAwAEAAkBAwMBAwcECR8JFgMDEgQDBQMGBgcGBAQIAAQEBgkGCAAGCCAEBQUFBAAXEAUEBgAEBAUJBgQEABMLCwsQBQghCxMTCxcSIgsDAwMEBBYEBBgKFCMKJAcVJSYHDgQEAAgEChQZGQoPJwICCAgUCgoYCigIAAQGCAgIKQwqBIeAgIAAAXABuwG7AQWGgICAAAEBgAKAAgaTgICAAAN/AUGAzcECC38BQQALfwFBAAsH+oOAgAAYBm1lbW9yeQIAEV9fd2FzbV9jYWxsX2N0b3JzABYQX19lcnJub19sb2NhdGlvbgCvBBlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAGbWFsbG9jAOoEBGZyZWUA6wQaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIAKRpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZwAqCmpkX2VtX2luaXQAKw1qZF9lbV9wcm9jZXNzACwUamRfZW1fZnJhbWVfcmVjZWl2ZWQALhFqZF9lbV9kZXZzX2RlcGxveQAvEWpkX2VtX2RldnNfdmVyaWZ5ADAYamRfZW1fZGV2c19jbGllbnRfZGVwbG95ADEMX19zdGRpb19leGl0ALsEK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHMAwQQVZW1zY3JpcHRlbl9zdGFja19pbml0AIIFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAgwUZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCEBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAhQUJc3RhY2tTYXZlAP8EDHN0YWNrUmVzdG9yZQCABQpzdGFja0FsbG9jAIEFDGR5bkNhbGxfamlqaQCHBQntgoCAAAEAQQELugEoOD9AQUJbXF9UWmBhwAGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAaoBqwGsAa4BrwGwAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvwHCAcMBxAHFAcYBxwHIAckBygHLAcwBqgKsAq4CzALNAs4CzwLQAtEC0gLTAtQC1QLWAtcC2ALZAtoC2wLcAt0C3gLfAuAC4QLiAuMC5ALlAuYC5wLoAukC6gLrAuwC7QLuAu8C8ALxAvIC8wL0AvUC9gL3AvgC+QL6AvsC/AL9Av4C/wKAA4EDggODA4QDhQOGA4cDiAOJA4oDiwOMA40DjgOPA5ADkQOSA5MDlAOVA5YDlwOYA5kDmgObA5wDnQOeA58DoAOhA6IDowOkA7cDugO+A78DRsADwQPEA8YD2APZA6AEugS5BLgECpPvh4AA8wQFABCCBQvOAQEBfwJAAkACQAJAQQAoAqC+ASIDRQ0AIAFBA3ENASAAIANrIgNBAEgNAiADIAJqQQAoAqS+AUsNAgJAAkAgA0EHcQ0AIAJFDQVBACEDDAELQdI8QeYvQRRByRsQkgQACwJAA0Ag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QSBqJAALjwECAn8BfiMAQTBrIgEkACABIAApA0AiAzcDECABIAM3AyACQAJAIAAgAUEQahC5Ag0AIAFBKGogAEGeARBzQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQuwIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQngIgACgCmAEgASkDGDcDIAsgAUEwaiQAC7UBAgV/AX4jAEEgayIBJAAgASAAKQNAIgY3AwggASAGNwMQAkACQCAAIAFBCGoQugINACABQRhqIABBnwEQc0EAIQIMAQsgASABKQMQNwMAIAAgASABQRhqELsCIQILAkAgAkUNACAAQQAQ+QEhAyAAQQEQ+QEhBCAAQQIQ+QEhACABKAIYIgUgA00NACABIAUgA2siBTYCGCACIANqIAAgBSAEIAUgBEkbELQEGgsgAUEgaiQAC/ECAgd/AX4jAEHQAGsiASQAIAEgACkDQCIINwMoIAEgCDcDQAJAAkAgACABQShqELoCDQAgAUHIAGogAEGfARBzQQAhAgwBCyABIAEpA0A3AyAgACABQSBqIAFBPGoQuwIhAgsgAEEAEPkBIQMgASAAQdAAaikDACIINwMYIAEgCDcDMAJAAkAgACABQRhqEJgCRQ0AIAEgASkDMDcDACAAIAEgAUHIAGoQmgIhBAwBCyABIAEpAzAiCDcDQCABIAg3AxACQCAAIAFBEGoQuQINACABQcgAaiAAQZ4BEHNBACEEDAELIAEgASkDQDcDCCAAIAFBCGogAUHIAGoQuwIhBAsgAEECEPkBIQUgAEEDEPkBIQACQCABKAJIIgYgBU0NACABIAYgBWsiBjYCSCABKAI8IgcgA00NACABIAcgA2siBzYCPCACIANqIAQgBWogByAGIAAgBiAASRsiACAHIABJGxCyBBoLIAFB0ABqJAALHwEBfwJAIABBABD5ASIBQQBIDQAgACgCmAEgARBoCwshAQF/IABB/wAgAEEAEPkBIgEgAUGAgHxqQYGAfEkbEGYLCAAgAEEAEGYLywECB38BfiMAQeAAayIBJAACQCAALQAzQQJJDQAgASAAQcgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQmgIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHQAGoiAyAALQAzQX5qIgRBABCXAiIFQX9qIgYQgQEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQlwIaDAELIAdBBmogAUEQaiAGELIEGgsgACAHEP4BCyABQeAAaiQAC1YCAX8BfiMAQSBrIgEkACABIABByABqKQMAIgI3AxggASACNwMIIAFBEGogACABQQhqEJ8CIAEgASkDECICNwMYIAEgAjcDACAAIAEQ0wEgAUEgaiQACw4AIAAgAEEAEPoBEPsBCw8AIAAgAEEAEPoBnRD7AQt7AgJ/AX4jAEEQayIBJAACQCAAEP8BIgJFDQACQCACKAIEDQAgAiAAQRwQ5AE2AgQLIAEgAEHIAGopAwAiAzcDCAJAIANCAFINACABQQhqQfIAEJsCCyABIAEpAwg3AwAgACACQfYAIAEQoQIgACACEP4BCyABQRBqJAALewICfwF+IwBBEGsiASQAAkAgABD/ASICRQ0AAkAgAigCBA0AIAIgAEEgEOQBNgIECyABIABByABqKQMAIgM3AwgCQCADQgBSDQAgAUEIakH0ABCbAgsgASABKQMINwMAIAAgAkH2ACABEKECIAAgAhD+AQsgAUEQaiQAC3sCAn8BfiMAQRBrIgEkAAJAIAAQ/wEiAkUNAAJAIAIoAgQNACACIABBHhDkATYCBAsgASAAQcgAaikDACIDNwMIAkAgA0IAUg0AIAFBCGpB8wAQmwILIAEgASkDCDcDACAAIAJB9gAgARChAiAAIAIQ/gELIAFBEGokAAugAQEDfyMAQRBrIgEkAAJAAkAgAC0AM0EBSw0AIAFBCGogAEGJARBzDAELAkAgAEEAEPkBIgJBe2pBe0sNACABQQhqIABBiQEQcwwBCyAAIAAtADNBf2oiAzoAMyAAQcgAaiAAQdAAaiADQf8BcUF/aiIDQQN0ELMEGiAAIAMgAhBvIQIgACgCmAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQcgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCmAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQtgKbEPsBCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHIAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoApgBIAI3AyAMAQsgASABKQMINwMAIAAgACABELYCnBD7AQsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABByABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKYASACNwMgDAELIAEgASkDCDcDACAAIAAgARC2AhDUBBD7AQsgAUEQaiQAC7cBAwJ/AX4BfCMAQSBrIgEkACABIABByABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASADNwMQDAELIAFBEGpBACACaxCzAgsgACgCmAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQtgIiBEQAAAAAAAAAAGNFDQAgACAEmhD7AQwBCyAAKAKYASABKQMYNwMgCyABQSBqJAALFQAgABCHBLhEAAAAAAAA8D2iEPsBC00BBH9BASEBAkAgAEEAEPkBIgJBAU0NAANAIAFBAXRBAXIiASACSQ0ACwsDQCAEEIcEIAFxIgMgAyACSyIDGyEEIAMNAAsgACAEEPwBCxEAIAAgAEEAEPoBEMcEEPsBCxgAIAAgAEEAEPoBIABBARD6ARDRBBD7AQsuAQN/QQAhASAAQQAQ+QEhAgJAIABBARD5ASIDRQ0AIAIgA20hAQsgACABEPwBCy4BA39BACEBIABBABD5ASECAkAgAEEBEPkBIgNFDQAgAiADbyEBCyAAIAEQ/AELFgAgACAAQQAQ+QEgAEEBEPkBbBD8AQsJACAAQQEQqQEL8AICBH8CfCMAQTBrIgIkACACIABByABqKQMANwMoIAIgAEHQAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQtwIhAyACIAIpAyA3AxAgACACQRBqELcCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCmAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahC2AiEGIAIgAikDIDcDACAAIAIQtgIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKYAUEAKQPQVDcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoApgBIAEpAwA3AyAgAkEwaiQACwkAIABBABCpAQuoAQIDfwF+IwBBIGsiASQAIAEgAEHIAGopAwA3AxggASAAQdAAaikDACIENwMQAkAgBFANACABIAEpAxg3AwggACABQQhqEPABIQIgASABKQMQNwMAIAAgARDyASIDRQ0AIAJFDQACQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAIgAygCBBDdAQsgACACIAMQ3QELIAAoApgBIAEpAxg3AyAgAUEgaiQACwkAIABBARCtAQu9AQIDfwF+IwBBMGsiAiQAIAIgAEHIAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQ8gEiA0UNACAAQQAQfyIERQ0AIAJBIGogAEEIIAQQtQIgAiACKQMgNwMQIAAgAkEQahB8AkAgAygCAEGAgID4AHFBgICAyABHDQAgACADKAIEIAQgARDhAQsgACADIAQgARDhASACIAIpAyA3AwggACACQQhqEH0gACgCmAEgAikDIDcDIAsgAkEwaiQACwkAIABBABCtAQurAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAEgAi8BEhDLAkUNACAAIAIvARI2AgAgAEECNgIEDAELIABCADcDAAsgA0EQaiQAC5wBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAMgAkEIakEIEJkENgIAIAAgAUHGESADEJ0CCyADQRBqJAALpAEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcwwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHMLQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgA0EIaiACKQMIEJcEIAMgA0EIajYCACAAIAFBzxQgAxCdAgsgA0EQaiQAC4sBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFRCzAgsgA0EQaiQAC4sBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BEBCzAgsgA0EQaiQAC4sBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFBCzAgsgA0EQaiQAC44BAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFEEBcRC0AgsgA0EQaiQAC5EBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi0AFEF/c0EBcRC0AgsgA0EQaiQAC48BAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAUEIIAIoAhwQtQILIANBEGokAAutAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARBzDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcwtBACECCwJAAkAgAg0AIABCADcDAAwBC0EAIQECQCACLQAUQQFxDQAgAi0AFUEwSw0AIAIvARBBD3YhAQsgACABELQCCyADQRBqJAALtQEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcwwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHMLQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCACLQAUQQFxDQAgAi0AFUEwSw0AIAIuARBBf0oNACAAIAItABAQswIMAQsgAEIANwMACyADQRBqJAALlQEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcwwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHMLQQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEQQYDgA3FBgMAARhC0AgsgA0EQaiQAC5QBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYAgRhC0AgsgA0EQaiQAC6oBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHMMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARBzC0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAi8BECICQQx2QX9qQQJJDQAgAEIANwMADAELIAAgAkH/H3EQswILIANBEGokAAvjAgIJfwF+IwBBEGsiASQAAkACQAJAIAApA0AiCkKAgICA8IGA+P8Ag0KAgICAgAFRDQAgAUEIaiAAQbYBEHMMAQsCQCAKpyICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyABQQhqIABBtwEQcwtBACECC0EAIQMCQCACRQ0AIAAgAi8BEhDmASIERQ0AIAQvAQgiBUUNACAAKACQASIDIAMoAmBqIAQvAQpBAnRqIQZBACEDIAIuARAiB0H//wNxIQggB0F/SiEJAkACQANAIAYgA0EDdGovAQIiBCAIRg0CAkAgCQ0AIARBgOADcUGAgAJHDQAgBCAHc0H/AXFFDQILIANBAWoiAyAFRw0AC0EAIQMMAgsgBiADQQN0aiEDDAELIAYgA0EDdGohAwsCQCADRQ0AIAEgACADIAIoAhwiBEEMaiAELwEEEL4BIAAoApgBIAEpAwA3AyALIAFBEGokAAuUAwEFfyMAQcAAayIFJAAgBSADNgI8AkACQCACLQAEQQFxRQ0AAkAgAUEAEH8iBg0AIABCADcDAAwCCyADIARqIQcgBUEwaiABQQggBhC1AiAFIAUpAzA3AyAgASAFQSBqEHwgASgAkAEiAyADKAJgaiACLwEGQQJ0aiEDQQAhCANAAkACQCAHIAUoAjwiBGsiAkEATg0AQQIhAgwBCyAFQShqIAEgAy0AAiAFQTxqIAIQSUECIQIgBSkDKFANACAFIAUpAyg3AxggASAFQRhqEHwgBi8BCCEJIAUgBSkDKDcDECABIAYgCSAFQRBqEPgBIAUgBSkDKDcDCCABIAVBCGoQfSAFKAI8IARGDQACQCAIDQAgAy0AA0EedEEfdSADcSEICyADQQRqIQQCQAJAIAMvAQRFDQAgBCEDDAELIAghAyAIDQBBACEIIAQhAwwBC0EAIQILIAJFDQALIAUgBSkDMDcDACABIAUQfSAAIAUpAzA3AwAMAQsgACABIAIvAQYgBUE8aiAEEEkLIAVBwABqJAALmAECA38BfiMAQSBrIgEkACABIAApA0AiBDcDACABIAQ3AxACQCAAIAEgAUEMahDlASICDQAgAUEYaiAAQa0BEHNBACECCwJAIAEoAgxB//8BRw0AIAFBGGogAEGuARBzQQAhAgsCQCACRQ0AIAAoApgBIQMgACABKAIMIAIvAQJB9ANBABDNASADQQ4gAhCAAgsgAUEgaiQACz0BAX8jAEEQayICJAAgAkEIaiAAIAEgAEHgAWogAEHcAWotAAAQvgEgACgCmAEgAikDCDcDICACQRBqJAALuAMBCn8jAEEwayICJAAgAEHIAGohAwJAIAAtADNBf2oiBEEBRw0AIAIgAykDADcDIAJAIAAgAkEgahC+Ag0AQQEhBAwBCyACIAMpAwA3AxggACACQRhqEL0CIgUvAQghBCAFKAIMIQMLIABB4AFqIQYCQAJAIAEtAARBAXFFDQAgBiEFIARFDQEgAEHMA2ohByAAKACQASIFIAUoAmBqIAEvAQZBAnRqIQggBiEFQQAhAUEAIQkDQAJAAkACQCAHIAVrIgpBAEgNACAILQACIQsgAiADIAFBA3RqKQMANwMQIAAgCyAFIAogAkEQahBKIgpFDQACQCAJDQAgCC0AA0EedEEfdSAIcSEJCyAFIApqIQUgCEEEaiEKAkAgCC8BBEUNACAKIQgMAgsgCSEIIAkNAUEAIQkgCiEIC0EAIQoMAQtBASEKCyAKRQ0CIAFBAWoiASAESQ0ADAILAAsCQCAEQQJJDQAgAkEoaiAAQbUBEHMLIAYhBSAERQ0AIAEvAQYhBSACIAMpAwA3AwggBiAAIAUgBkHsASACQQhqEEpqIQULIABB3AFqIAUgBms6AAAgAkEwaiQAC5IBAgJ/AX4jAEEgayIBJAAgASAAKQNAIgM3AwAgASADNwMQAkAgACABIAFBDGoQ5QEiAg0AIAFBGGogAEGtARBzQQAhAgsCQCABKAIMQf//AUcNACABQRhqIABBrgEQc0EAIQILAkAgAkUNACAAIAIQwQEgACABKAIMIAIvAQJB/x9xQYDAAHIQzwELIAFBIGokAAuHAQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMAIAMgBDcDEAJAIAEgAyADQQxqEOUBIgINACADQRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAygCDCICQf//AUcNACAAQgA3AwAMAQsgACACNgIAIABBAjYCBAsgA0EgaiQAC3ACAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDlASICDQAgA0EYaiABQa0BEHNBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQA2AgAgAEEENgIECyADQSBqJAALbQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMAIAMgBDcDEAJAIAEgAyADQQxqEOUBIgINACADQRhqIAFBrQEQc0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BAkH/H3EQswILIANBIGokAAuJAQICfwF+IwBBIGsiASQAIAEgACkDQCIDNwMAIAEgAzcDEAJAIAAgASABQQxqEOUBIgINACABQRhqIABBrQEQc0EAIQILAkAgASgCDEH//wFHDQAgAUEYaiAAQa4BEHNBACECCwJAIAJFDQAgACACEMEBIAAgASgCDCACLwECEM8BCyABQSBqJAALaQECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADQQhqIAFBowEQcyAAQgA3AwAMAQsgACABKAKgASACKAIAQQxsaigCACgCEEEARxC0AgsgA0EQaiQAC+UBAgV/AX4jAEEgayIBJAACQAJAIAApA0AiBkKAgICA8IGA+P8Ag0KAgICAIFINACAGpyECDAELIAFBGGogAEG9ARBzQf//ASECCwJAIAJB//8BRg0AIABBABD5ASEDIAEgAEHQAGopAwAiBjcDGCABIAY3AwAgACABIAFBFGoQvAIhBAJAIANBgIAESQ0AIAFBCGogAEG+ARBzDAELAkAgASgCFCIFQe0BSQ0AIAFBCGogAEG/ARBzDAELIABB3AFqIAU6AAAgAEHgAWogBCAFELIEGiAAIAIgAxDPAQsgAUEgaiQAC4sBAgN/AX4jAEEQayIBJAACQAJAIAApA0AiBEKAgICA8IGA+P8Ag0KAgICAIFINACAEpyECDAELIAFBCGogAEG9ARBzQf//ASECCwJAIAJB//8BRg0AIAAoApgBIgMgAy0AEEHwAXFBBHI6ABAgACgCmAEiAyACOwESIANBABBnIAAQZAsgAUEQaiQAC0YBAX8jAEEQayIDJAAgAyACKQMANwMAAkACQCABIAMgA0EMahCaAkUNACAAIAMoAgwQswIMAQsgAEIANwMACyADQRBqJAALcgIDfwF+IwBBIGsiASQAIAEgACkDQCIENwMIIAEgBDcDEAJAIAAgAUEIaiABQRxqEJoCIgJFDQACQCAAQQAQ+QEiAyABKAIcSQ0AIAAoApgBQQApA9BUNwMgDAELIAAgAiADai0AABD8AQsgAUEgaiQAC1ABAn8jAEEgayIBJAAgASAAKQNANwMQIABBABD5ASECIAEgASkDEDcDCCABQRhqIAAgAUEI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EN4BDAELIAQgAikDADcDSCAEQYgBaiAAIARByABqEJ8CIAIgBCkDiAE3AwAgBCACKQMANwNAIAAgBEHAAGoQfCAEIAIpAwA3AzggBCADKQMANwMwIAAgASAEQThqIARBMGoQ3gEgBCACKQMANwMoIAAgBEEoahB9CyAEQZABaiQAC/cBAQF/IwBBwABrIgQkAAJAAkAgAkGB4ANJDQAgBEE4aiAAQZYBEHMMAQsgBCABKQMANwMoAkAgACAEQShqELoCRQ0AIAQgASkDADcDECAAIARBEGogBEE0ahC7AiEBAkAgBCgCNCACTQ0AIAQgAykDADcDCCABIAJqIAAgBEEIahC3AjoAAAwCCyAEQThqIABBlwEQcwwBCyAEIAEpAwA3AyACQCAAIARBIGoQvQIiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AIAQgAykDADcDGCAAIAEgAiAEQRhqEPgBDAELIARBOGogAEGYARBzCyAEQcAAaiQAC8wBAQV/IwBBEGsiBCQAAkACQCACQYE8SQ0AIARBCGogAEGZARBzDAELAkACQCACQQFqIgUgAS8BCk0NACAAIAVBCmxBCG0iBkEEIAZBBEobIgdBA3QQeSIGRQ0BAkAgASgCDCIIRQ0AIAYgCCABLwEIQQN0ELIEGgsgASAHOwEKIAEgBjYCDCAAKALIASAGEHoLIAEoAgwgAkEDdGogAykDADcDACABLwEIIAJLDQEgASAFOwEIDAELIARBCGogAEGaARBzCyAEQRBqJAALPgIBfwF+IwBBEGsiAiQAIAIgAUEDdCAAakHIAGopAwAiAzcDACACIAM3AwggACACELcCIQAgAkEQaiQAIAALQAMBfwF+AXwjAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQtgIhBCACQRBqJAAgBAssAQF/IwBBEGsiAiQAIAJBCGogARCyAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCzAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARC0AiAAKAKYASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQtQIgACgCmAEgAikDCDcDICACQRBqJAALdgID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IAIgASACSRsiAhCyBBpBAEEAKAKswgEiAyACazYCrMIBIAAgAmohACABIAJrIQECQCADIAJHDQBBtMIBQejBARCPAkEAQcAANgKswgFBAEHowQE2AqjCASABDQEMAgtBAEEAKAKowgEgAmo2AqjCASABDQALC0HkwQEQkAIaQQAhAkEAQQApA/jCATcDmMMBQQBBACkD8MIBNwOQwwFBAEEAKQPowgE3A4jDAUEAQQApA+DCATcDgMMBQQBBADoA4MEBDAELQYDDASAAIAEQsgQaCwNAIAJBgMMBaiIBIAEtAABBNnM6AAAgAkEBaiICQcAARw0ADAILAAtBtTJBDkGNFxCNBAALECMCQEEALQDgwQENAEEAQQE6AODBARAkQQBCwICAgPDM+YTqADcCsMIBQQBBwAA2AqzCAUEAQejBATYCqMIBQQBB4MIBNgLkwQFBAEGZmoPfBTYC0MIBQQBCjNGV2Lm19sEfNwLIwgFBAEK66r+q+s+Uh9EANwLAwgFBAEKF3Z7bq+68tzw3ArjCAUGAwwEhAUHAACECAkADQAJAQQAoAqzCASIAQcAARw0AIAJBwABJDQBBtMIBIAEQjwIgAUHAAGohASACQUBqIgINAQwCC0EAKAKowgEgASACIAAgAiAASRsiABCyBBpBAEEAKAKswgEiAyAAazYCrMIBIAEgAGohASACIABrIQICQCADIABHDQBBtMIBQejBARCPAkEAQcAANgKswgFBAEHowQE2AqjCASACDQEMAgtBAEEAKAKowgEgAGo2AqjCASACDQALCw8LQbUyQQ5BjRcQjQQAC7sGAQR/QeTBARCQAhpBACEBIABBGGpBACkD+MIBNwAAIABBEGpBACkD8MIBNwAAIABBCGpBACkD6MIBNwAAIABBACkD4MIBNwAAQQBBADoA4MEBECMCQEEALQDgwQENAEEAQQE6AODBARAkQQBCq7OP/JGjs/DbADcCzMIBQQBC/6S5iMWR2oKbfzcCxMIBQQBC8ua746On/aelfzcCvMIBQQBC58yn0NbQ67O7fzcCtMIBQQBCwAA3AqzCAUEAQejBATYCqMIBQQBB4MIBNgLkwQEDQCABQYDDAWoiAiACLQAAQeoAczoAACABQQFqIgFBwABHDQALQQBBwAA2ArDCAUGAwwEhAkHAACEBAkADQAJAQQAoAqzCASID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gICAgID4/wBWDQMCQCACKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgAiAEOQMYIAJBADYCICACQThqIAQ5AwAgAkEwaiAEOQMAIAJBKGpCADcDACACIAJBwABqKAIANgIUCyACIAIoAiBBAWo2AiAgAigCFCEAAkACQEEAKALYxgEiAyACQcQAaigCACIBa0EASA0AIAJBKGoiAyACKwMYIAEgAGu4oiADKwMAoDkDAAwBCyACQShqIgEgAisDGCADIABruKIgASsDAKA5AwAgAyEBCyACIAE2AhQCQCACQThqKwMAIARjRQ0AIAIgBDkDOAsCQCACQTBqKwMAIARkRQ0AIAIgBDkDMAsgAiAEOQMYDwtBACECAkAgAS0ADCIDQQVJDQAgACABQRRqIANBfGoQrwIhAgsgAkUNAiACIAEoAhAiAUGAuJkpIAFBgLiZKUkbNgIQDwtBACECAkAgAS0ADCIDQQJJDQAgACABQRFqIANBf2oQrwIhAgsgAkUNASACIAEtABBBAEc6AAoPCwJAAkAgACABQZDUABD1A0H/fmoOBAACAgECCyAAIAAoAgwiAUGAuJkpIAFBgLiZKUkbNgIMDwsgACAAKAIIIgFBgLiZKSABQYC4mSlJGyIBNgIIIAFFDQAgAEEAKALYxgEgAWo2AhwLC/oBAQR/IAJBAWohAyABQcg4IAEbIQQCQCAAKAIkIgFFDQADQAJAIAEoAgwiBUUNACAFIAQgAxDKBEUNAgsgASgCACIBDQALCwJAIAENAEHIABAgIgFB/wE6AAogAUEANgIEIAEgACgCJDYCACAAIAE2AiQgAUKAgICAgICA/P8ANwMYIAFBACgC2MYBIgY2AkACQCABKAIQIgUNAAJAAkAgAC0AEkUNACAAQShqIQUgACgCKA0BIAVBiCc2AgAMAQsgAEEMaiEFCyAFKAIAIQULIAEgBSAGajYCRCABQcgoEK0CIAEgAxAgIgU2AgwgBSAEIAIQsgQaCyABCzsBAX9BAEGg1AAQ+gMiATYCwMMBIAFBAToAEiABIAA2AiAgAUHg1AM2AgwgAUGBAjsBEEHQACABEM4DC8oCAQN/AkBBACgCwMMBIgJFDQAgAiAAIAAQ2AQQrwIhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL/////////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IAMgAiACQRhqEEcLIAJBIGokAAsNACAAQQApA9hUNwMACzYBAX8CQCACKAI4IgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB6QAQcws3AQF/AkAgAigCOCIDIAIoApABLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkHqABBzC3EBAX8jAEEgayIDJAAgA0EYaiACEKUDIAMgAykDGDcDEAJAAkACQCADQRBqEJkCDQAgAygCHA0BIAMoAhhBAkcNAQsgACADKQMYNwMADAELIAMgAykDGDcDCCAAIAIgA0EIahC2AhCyAgsgA0EgaiQAC0oBAX8jAEEgayIDJAAgA0EYaiACEKUDIANBEGogAhClAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQ9QEgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEKUDIAJBIGogARClAyACQRhqIAEQpQMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhD2ASACQTBqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhClAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAFyIQQCQAJAIARBfyADQRxqIAQQwwIbIgRBf0oNACADQThqIAJB8AAQcyADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEPMBCyADQcAAaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQpQMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIACciEEAkACQCAEQX8gA0EcaiAEEMMCGyIEQX9KDQAgA0E4aiACQfAAEHMgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDzAQsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEKUDIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAA3IhBAJAAkAgBEF/IANBHGog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AxC2AiIERAAAAAAAAAAAY0UNACAAIASaELICDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA7hUNwMADAILIABBACACaxCzAgwBCyAAIAMpAwg3AwALIANBEGokAAsPACAAIAIQpwNBf3MQswILMgEBfyMAQRBrIgMkACADQQhqIAIQpQMgACADKAIMRSADKAIIQQJGcRC0AiADQRBqJAALcQEBfyMAQRBrIgMkACADQQhqIAIQpQMCQAJAIAMoAgxBf0YNACADIAMpAwg3AwAgACACIAMQtgKaELICDAELAkAgAygCCCICQYCAgIB4Rw0AIABBACkDuFQ3AwAMAQsgAEEAIAJrELMCCyADQRBqJAALNwEBfyMAQRBrIgMkACADQQhqIAIQpQMgAyADKQMINwMAIAAgAiADELgCQQFzELQCIANBEGokAAsMACAAIAIQpwMQswILqgICBH8BfCMAQcAAayIDJAAgA0E4aiACEKUDIAJBGGoiBCADKQM4NwMAIANBOGogAhClAyACIAMpAzg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBIIAIoAhAiBiAFaiIFIAZIcw0AIAAgBRCzAgwBCyADIAJBEGoiBSkDADcDMAJAAkAgAiADQTBqEJgCDQAgAyAEKQMANwMoIAIgA0EoahCYAkUNAQsgAyAFKQMANwMQIAMgBCkDADcDCCAAIAIgA0EQaiADQQhqEKICDAELIAMgBSkDADcDICACIAIgA0EgahC2AjkDICADIAQpAwA3AxggAkEoaiACIANBGGoQtgIiBzkDACAAIAcgAisDIKAQsgILIANBwABqJAALzAECBH8BfCMAQSBrIgMkACADQRhqIAIQpQMgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKUDIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEogAigCECIGIAVrIgUgBkhzDQAgACAFELMCDAELIAMgAkEQaikDADcDECACIAIgA0EQahC2AjkDICADIAQpAwA3AwggAkEoaiACIANBCGoQtgIiBzkDACAAIAIrAyAgB6EQsgILIANBIGokAAvOAQMDfwF+AXwjAEEgayIDJAAgA0EYaiACEKUD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IgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGxEiAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuWCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINELIEIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDYBGpBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDYBGpBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0gCSICdkEPcSIJDQAgAkUNAEEAIQwgAUUNAQsgByABaiAJ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AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EPoEIANB6IF9IANB6IF9ShtBmv4BaiEDIARBMGpBCGopAwAhAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhD6BCAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9sGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ8ARFDQAgAyAEEOAEIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEPoEIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ8gQgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgCK1CMIYgAkL///////8/g4QiCSADIARCMIinQf//AXEiBq1CMIYgBEL///////8/g4QiChDwBEEASg0AAkAgASAJIAMgChDwBEUNACABIQQMAgsgBUHwAGogASACQgBCABD6BCAFQfgAaikDACECIAUpA3AhBAwBCwJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABD6BCAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ+gQgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEPoEIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABD6BCAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAE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ACAANgK8uAEgAQ8LEK8EQTA2AgBBfwvoCgIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQkCQAJAAkAgAVAiBiACQv///////////wCDIgpCgICAgICAwICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEKIAQgAiAHGyIJQv///////z+DIQsgAiAEIAcbIgxCMIinQf//AXEhCAJAIAlCMIinQf//AXEiBg0AIAVB4ABqIAogCyAKIAsgC1AiBht5IAZBBnStfKciBkFxahDvBEEQIAZrIQYgBUHoAGopAwAhCyAFKQNgIQoLIAEgAyAHGyEDIAxC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ7wRBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCECIAtCA4YgCkI9iIQhBCADQgOGIQEgCSAMhSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAkIBIQEMAQsgBUHAAGogASACQYABIAdrEO8EIAVBMGogASACIAcQ+QQgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQEgBUEwakEIaikDACECCyAEQoCAgICAgIAEhCEMIApCA4YhCwJAAkAgA0J/VQ0AQgAhA0IAIQQgCyABhSAMIAKFhFANAiALIAF9IQogDCACfSALIAFUrX0iBEL/////////A1YNASAFQSBqIAogBCAKIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDvBCAGIAdrIQYgBUEoaikDACEEIAUpAyAhCgwBCyACIAx8IAEgC3wiCiABVK18IgRCgICAgICAgAiDUA0AIApCAYggBEI/hoQgCkIBg4QhCiAGQQFqIQYgBEIBiCEECyAJQoCAgICAgICAgH+DIQECQCAGQf//AUgNACABQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAogBCAGQf8AahDvBCAFIAogBEEBIAZrEPkEIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQogBUEIaikDACEECyAKQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgAYQhBCAKp0EHcSEGAkACQAJAAkACQBD3BA4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIAFCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIAFQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxD4BBoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvfEAIFfw5+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEO8EQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ7wQgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ+wQgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ+wQgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ+wQgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ+wQgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ+wQgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ+wQgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ+wQgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ+wQgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ+wQgBUGQAWogA0IPhkIAIARCABD7BCAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEPsEIAVBgAFqQgEgAn1CACAEQgAQ+wQgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIAFCP4iEIhRCIIgiBH4iCyABQgGGIhVCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgC1StIBAgD0L/////D4MiCyAUQv////8PgyIPfnwiESAQVK18IA0gBH58IAsgBH4iFiAPIA1+fCIQIBZUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIA9+IhYgAiAKfnwiESAWVK0gESALIBVC/v///w+DIhZ+fCIXIBFUrXx8IhEgEFStfCARIBIgBH4iECAWIA1+fCIEIAIgD358Ig0gCyAKfnwiC0IgiCAEIBBUrSANIARUrXwgCyANVK18QiCGhHwiBCARVK18IAQgFyACIBZ+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgF1StIAIgC0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgBUHQAGogAiAEIAMgDhD7BCABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhD7BCABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRUgEyEUCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhCyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxD5BCAFQTBqIBUgFCAGQfAAahDvBCAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiCxD7BCAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEPsEIAUgAyAOQgVCABD7BCALIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ7wQgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ7wQgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDvBCACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDvBCACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDvBEEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDvBCAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgCkIPhiADQjGIhCIUQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdBgAFJDQBCACEBDAMLIAVBMGogEiABIAZB/wBqIgYQ7wQgBUEgaiACIAQgBhDvBCAFQRBqIBIgASAHEPkEIAUgAiAEIAcQ+QQgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwBCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgQgAUIgiCICfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgAn58IgNCIIh8IANC/////w+DIAQgAX58IgNCIIh8NwMIIAAgA0IghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ7gQgBSkDACEBIAAgBUEIaikDADcDCCAAIAE3AwAgBUEQaiQAC+oDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAiFQgBSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEO8EIAIgACAEQYH4ACADaxD5BCACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIhUIAUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEGAzcECJAJBgM0BQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABEQAAskAQF+IAAgASACrSADrUIghoQgBBCGBSEFIAVCIIinEBQgBacLEwAgACABpyABQiCIpyACIAMQFQsL0LCBgAADAEGACAuYrAFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBhcnJheQBpc0FycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAc2VydmljZUluZGV4AGpkX29waXBlX3dyaXRlX2V4AG1heABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AHBvdwBqZF93c3NrX25ldwBleHByMV9uZXcAaWRpdgBwcmV2AHRzYWdnX2NsaWVudF9ldgB0aHJvdzolZEAldQBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQAlczoldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABpc1JlcG9ydABhdXRoIHRvbyBzaG9ydABhc3NlcnQAaW5zZXJ0AGNicnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQARGV2aWNlU2NyaXB0AHJlYm9vdABleHBlY3Rpbmcgc3RhY2ssIGdvdABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGlzRXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudAByYW5kb21JbnQAcGFyc2VJbnQAZGV2aWNlc2NyaXB0bWdyX2luaXQAd2FpdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAb25QYWNrZXQAaXNSZWdTZXQAaXNSZWdHZXQAb2JqZWN0AHBhcnNlRmxvYXQAZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABjaGFyQXQAZmlsbEF0AGNoYXJDb2RlQXQAa2V5cwB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGZsYWdzAGRldnNfbWFwX2tleXNfb3JfdmFsdWVzAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGdldF90cnlmcmFtZXMAYWJzAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTbjogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwAgICAgJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgBidWlsdGluIGZ1bmN0aW9uIGlzIG5vdCBhIGN0b3IAdGFnIGVycm9yAFR5cGVFcnJvcgBSYW5nZUVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAcm9sZV9tZW1iZXIAZnJlZV9maWJlcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IERFVlNfUEFDS19TSElGVCkgPj4gREVWU19QQUNLX1NISUZUKSA9PSAodWludDMyX3Qpb3RwAHBvcABkZXZzX2J1ZmZlcl9vcABjbGFtcAAhc3dlZXAAbWFwACVzOiVwAGNsb3N1cmU6JWQ6JXAAbWV0aG9kOiVkOiVwAGRldnNfZ2V0X3N0YXRpY19wcm90bwBkZXZzX21hcF9jb3B5X2ludG8Ac21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAGZ1bgBidXR0b24AVW5oYW5kbGVkIGV4Y2VwdGlvbgBFeGNlcHRpb24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgB3aW5kRGlyZWN0aW9uAG5ldyB1bnN1cHBvcnRlZCBvbiB0aGlzIGV4cHJlc3Npb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAdGhyb3dpbmcgbnVsbABzZXR0aW5nIG51bGwAZ2V0dGluZyBudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAYWxsb2NfYmxvY2sAc3RhY2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAbG9nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAdGFnIDw9IDB4ZmYAZm5pZHggPD0gMHhmZmZmADAxMjM0NTY3ODlhYmNkZWYAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQB0cnVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQBoZWFydFJhdGUAY2F1c2UAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXU246IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBwcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBuYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXU246IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvYmplY3QgZXhwZWN0ZWQAb25EaXNjb25uZWN0ZWQAV1NuOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAbm9uLWZ1bmN0aW9uIGNhbGxlZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAZGV2c192YWx1ZV9lbmNvZGVfdGhyb3dfam1wX3BjAHR2b2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAHBhbmljAGJhZCBtYWdpYwBudW1wYXJhbXMgKyAxID09IGN0eC0+c3RhY2tfdG9wX2Zvcl9nYwBwYWNrZXRfc3BlYwBkZXZzX2dldF9iYXNlX3NwZWMAZGV2aWNlc2NyaXB0L3RyeS5jAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBuZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGRldmljZXNjcmlwdC90c2FnZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19uZXdfXwBfX3N0YWNrX18AX19mdW5jX18AW1Rocm93OiAleF0AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABsZXYgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9MRVZFTF9NQVgAcGMgJiYgcGMgPD0gREVWU19TUEVDSUFMX1RIUk9XX0pNUF9QQ19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVAAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwAgIHBjPSVkIEAgPz8/ACAgJXMgPT4Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAYXJnMABsb2cxMABMTjEwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABmcmFtZS0+ZnVuYy0+bnVtX3RyeV9mcmFtZXMgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IERFVlNfUEFDS19TSElGVCkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAcHQgIT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAD8uACAgLi4uAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQByID09IE5VTEwgfHwgZGV2c19pc19tYXAocikAZGV2c19pc19tYXAocHJvdG8pAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBmaWR4IDwgKGludClkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBmaWR4IDwgZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAZGV2c19pc19tYXAoc3JjKQBkZXZzX2lzX3NlcnZpY2Vfc3BlYyhjdHgsIHNwZWMpACEoaC0+ZmxhZ3MgJiBERVZTX0JVSUxUSU5fRkxBR19JU19QUk9QRVJUWSkAb2ZmIDwgKDEgPDwgTUFYX09GRl9CSVRTKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpAFdTbjogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1NuOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABAABqYWNkYWMtcG9zaXggZGV2aWNlADAuMC4wAAAAAAAAAAAAAAAAAAAAAQAAAAAAAADwnwYAgBCBEIIQ8Q8r6jQROAEAAAoAAAALAAAARGV2Uwp+apoAAAAEAQAAAAAAAAAAAAAAAAAAAAAAAABoAAAAIAAAAIgAAAAMAAAAlAAAAAAAAACUAAAAAAAAAJQAAAAAAAAAlAAAAAAAAACU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AAAAnwAAAKAAAAChAAAAogAAAKMAAACkAAAApQAAAKYAAACnAAAAqAAAAKkAAACqAAAAqwAAAFMAAAAFAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC5AAAAugAAAJBkAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACoWwAAgGZQAABBwLgBCwAA7uCAgAAEbmFtZQGIYIkFAAVhYm9ydAETX2RldnNfcGFuaWNfaGFuZGxlcgINZW1fc2VuZF9mcmFtZQMQZW1fY29uc29sZV9kZWJ1ZwQEZXhpdAULZW1fdGltZV9ub3cGE2RldnNfZGVwbG95X2hhbmRsZXIHIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CCFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQJGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRA5hZ2didWZmZXJfaW5pdEUPYWdnYnVmZmVyX2ZsdXNoRhBhZ2didWZmZXJfdXBsb2FkRw5kZXZzX2J1ZmZlcl9vcEgQZGV2c19yZWFkX251bWJlckkSZGV2c19idWZmZXJfZGVjb2RlShJkZXZzX2J1ZmZlcl9lbmNvZGVLD2RldnNfY3JlYXRlX2N0eEwJc2V0dXBfY3R4TQpkZXZzX3RyYWNlTg9kZXZzX2Vycm9yX2NvZGVPGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJQCWNsZWFyX2N0eFENZGV2c19mcmVlX2N0eFIIZGV2c19vb21TCWRldnNfZnJlZVQXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NVB3RyeV9ydW5WDHN0b3BfcHJvZ3JhbVccZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVkYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFsOZGVwbG95X2hhbmRsZXJcE2RlcGxveV9tZXRhX2hhbmRsZXJdFmRldmljZXNjcmlwdG1ncl9kZXBsb3leFGRldmljZXNjcmlwdG1ncl9pbml0XxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YBFkZXZzY2xvdWRfcHJvY2Vzc2EXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRiE2RldnNjbG91ZF9vbl9tZXRob2RjDmRldnNjbG91ZF9pbml0ZBBkZXZzX2ZpYmVyX3lpZWxkZRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25mCmRldnNfcGFuaWNnGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWgQZGV2c19maWJlcl9zbGVlcGkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsahpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc2sRZGV2c19pbWdfZnVuX25hbWVsEmRldnNfaW1nX3JvbGVfbmFtZW0SZGV2c19maWJlcl9ieV9maWR4bhFkZXZzX2ZpYmVyX2J5X3RhZ28QZGV2c19maWJlcl9zdGFydHAUZGV2c19maWJlcl90ZXJtaWFudGVxDmRldnNfZmliZXJfcnVuchNkZXZzX2ZpYmVyX3N5bmNfbm93cxVfZGV2c19ydW50aW1lX2ZhaWx1cmV0D2RldnNfZmliZXJfcG9rZXUTamRfZ2NfYW55X3RyeV9hbGxvY3YHZGV2c19nY3cPZmluZF9mcmVlX2Jsb2NreBJkZXZzX2FueV90cnlfYWxsb2N5DmRldnNfdHJ5X2FsbG9jegtqZF9nY191bnBpbnsKamRfZ2NfZnJlZXwOZGV2c192YWx1ZV9waW59EGRldnNfdmFsdWVfdW5waW5+EmRldnNfbWFwX3RyeV9hbGxvY38UZGV2c19hcnJheV90cnlfYWxsb2OAARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OBARVkZXZzX3N0cmluZ190cnlfYWxsb2OCARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdIMBD2RldnNfZ2Nfc2V0X2N0eIQBDmRldnNfZ2NfY3JlYXRlhQEPZGV2c19nY19kZXN0cm95hgELc2Nhbl9nY19vYmqHARFwcm9wX0FycmF5X2xlbmd0aIgBEm1ldGgyX0FycmF5X2luc2VydIkBEmZ1bjFfQXJyYXlfaXNBcnJheYoBEG1ldGhYX0FycmF5X3B1c2iLARVtZXRoMV9BcnJheV9wdXNoUmFuZ2WMARFtZXRoWF9BcnJheV9zbGljZY0BEWZ1bjFfQnVmZmVyX2FsbG9jjgEScHJvcF9CdWZmZXJfbGVuZ3RojwEVbWV0aDBfQnVmZmVyX3RvU3RyaW5nkAETbWV0aDNfQnVmZmVyX2ZpbGxBdJEBE21ldGg0X0J1ZmZlcl9ibGl0QXSSARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zkwEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOUARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SVARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSWARVmdW4xX0RldmljZVNjcmlwdF9sb2eXARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0mAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSZARRtZXRoMV9FcnJvcl9fX2N0b3JfX5oBGW1ldGgxX1JhbmdlRXJyb3JfX19jdG9yX1+bARhtZXRoMV9UeXBlRXJyb3JfX19jdG9yX1+cARRtZXRoWF9GdW5jdGlvbl9zdGFydJ0BDmZ1bjFfTWF0aF9jZWlsngEPZnVuMV9NYXRoX2Zsb29ynwEPZnVuMV9NYXRoX3JvdW5koAENZnVuMV9NYXRoX2Fic6EBEGZ1bjBfTWF0aF9yYW5kb22iARNmdW4xX01hdGhfcmFuZG9tSW50owENZnVuMV9NYXRoX2xvZ6QBDWZ1bjJfTWF0aF9wb3elAQ5mdW4yX01hdGhfaWRpdqYBDmZ1bjJfTWF0aF9pbW9kpwEOZnVuMl9NYXRoX2ltdWyoAQ1mdW4yX01hdGhfbWluqQELZnVuMl9taW5tYXiqAQ1mdW4yX01hdGhfbWF4qwESZnVuMl9PYmplY3RfYXNzaWdurAEQZnVuMV9PYmplY3Rfa2V5c60BE2Z1bjFfa2V5c19vcl92YWx1ZXOuARJmdW4xX09iamVjdF92YWx1ZXOvARBwcm9wX1BhY2tldF9yb2xlsAEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcrEBE3Byb3BfUGFja2V0X3Nob3J0SWSyARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXizARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZLQBEXByb3BfUGFja2V0X2ZsYWdztQEVcHJvcF9QYWNrZXRfaXNDb21tYW5ktgEUcHJvcF9QYWNrZXRfaXNSZXBvcnS3ARNwcm9wX1BhY2tldF9wYXlsb2FkuAETcHJvcF9QYWNrZXRfaXNFdmVudLkBFXByb3BfUGFja2V0X2V2ZW50Q29kZboBFHByb3BfUGFja2V0X2lzUmVnU2V0uwEUcHJvcF9QYWNrZXRfaXNSZWdHZXS8ARNwcm9wX1BhY2tldF9yZWdDb2RlvQETbWV0aDBfUGFja2V0X2RlY29kZb4BEmRldnNfcGFja2V0X2RlY29kZb8BFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZMABFERzUmVnaXN0ZXJfcmVhZF9jb250wQESZGV2c19wYWNrZXRfZW5jb2RlwgEWbWV0aFhfRHNSZWdpc3Rlcl93cml0ZcMBFnByb3BfRHNQYWNrZXRJbmZvX3JvbGXEARZwcm9wX0RzUGFja2V0SW5mb19uYW1lxQEWcHJvcF9Ec1BhY2tldEluZm9fY29kZcYBGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX8cBF3Byb3BfRHNSb2xlX2lzQ29ubmVjdGVkyAEYbWV0aDJfRHNSb2xlX3NlbmRDb21tYW5kyQERbWV0aDBfRHNSb2xlX3dhaXTKARJwcm9wX1N0cmluZ19sZW5ndGjLARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdMwBE21ldGgxX1N0cmluZ19jaGFyQXTNARRkZXZzX2pkX2dldF9yZWdpc3Rlcs4BFmRldnNfamRfY2xlYXJfcGt0X2tpbmTPARBkZXZzX2pkX3NlbmRfY21k0AERZGV2c19qZF93YWtlX3JvbGXRARRkZXZzX2pkX3Jlc2V0X3BhY2tldNIBE2RldnNfamRfcGt0X2NhcHR1cmXTARNkZXZzX2pkX3NlbmRfbG9nbXNn1AENaGFuZGxlX2xvZ21zZ9UBEmRldnNfamRfc2hvdWxkX3J1btYBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hl1wETZGV2c19qZF9wcm9jZXNzX3BrdNgBFGRldnNfamRfcm9sZV9jaGFuZ2Vk2QESZGV2c19qZF9pbml0X3JvbGVz2gESZGV2c19qZF9mcmVlX3JvbGVz2wEQZGV2c19zZXRfbG9nZ2luZ9wBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc90BEmRldnNfbWFwX2NvcHlfaW50b94BDGRldnNfbWFwX3NldN8BFGRldnNfaXNfc2VydmljZV9zcGVj4AEGbG9va3Vw4QEXZGV2c19tYXBfa2V5c19vcl92YWx1ZXPiARFkZXZzX2FycmF5X2luc2VydOMBD2RldnNfbWFwX2RlbGV0ZeQBGGRldnNfb2JqZWN0X2dldF9idWlsdF9pbuUBF2RldnNfZGVjb2RlX3JvbGVfcGFja2V05gEOZGV2c19yb2xlX3NwZWPnARBkZXZzX3NwZWNfbG9va3Vw6AERZGV2c19wcm90b19sb29rdXDpARJkZXZzX2Z1bmN0aW9uX2JpbmTqARFkZXZzX21ha2VfY2xvc3VyZesBDmRldnNfZ2V0X2ZuaWR47AETZGV2c19nZXRfZm5pZHhfY29yZe0BGGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZO4BF2RldnNfb2JqZWN0X2dldF9ub19iaW5k7wETZGV2c19nZXRfcm9sZV9wcm90b/ABG2RldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9yd/EBFWRldnNfZ2V0X3N0YXRpY19wcm90b/IBHWRldnNfb2JqZWN0X2dldF9hdHRhY2hlZF9lbnVt8wEPZGV2c19vYmplY3RfZ2V09AEMZGV2c19zZXFfZ2V09QEMZGV2c19hbnlfZ2V09gEMZGV2c19hbnlfc2V09wEMZGV2c19zZXFfc2V0+AEOZGV2c19hcnJheV9zZXT5AQxkZXZzX2FyZ19pbnT6AQ9kZXZzX2FyZ19kb3VibGX7AQ9kZXZzX3JldF9kb3VibGX8AQxkZXZzX3JldF9pbnT9AQ1kZXZzX3JldF9ib29s/gEPZGV2c19yZXRfZ2NfcHRy/wERZGV2c19hcmdfc2VsZl9tYXCAAhFkZXZzX3NldHVwX3Jlc3VtZYECD2RldnNfY2FuX2F0dGFjaIICEmRldnNfcmVnY2FjaGVfZnJlZYMCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGyEAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZIUCE2RldnNfcmVnY2FjaGVfYWxsb2OGAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cIcCEWRldnNfcmVnY2FjaGVfYWdliAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWJAhJkZXZzX3JlZ2NhY2hlX25leHSKAg9qZF9zZXR0aW5nc19nZXSLAg9qZF9zZXR0aW5nc19zZXSMAg5kZXZzX2xvZ192YWx1ZY0CD2RldnNfc2hvd192YWx1ZY4CEGRldnNfc2hvd192YWx1ZTCPAg1jb25zdW1lX2NodW5rkAINc2hhXzI1Nl9jbG9zZZECD2pkX3NoYTI1Nl9zZXR1cJICEGpkX3NoYTI1Nl91cGRhdGWTAhBqZF9zaGEyNTZfZmluaXNolAIUamRfc2hhMjU2X2htYWNfc2V0dXCVAhVqZF9zaGEyNTZfaG1hY19maW5pc2iWAg5qZF9zaGEyNTZfaGtkZpcCDmRldnNfc3RyZm9ybWF0mAIOZGV2c19pc19zdHJpbmeZAg5kZXZzX2lzX251bWJlcpoCFGRldnNfc3RyaW5nX2dldF91dGY4mwITZGV2c19idWlsdGluX3N0cmluZ5wCFGRldnNfc3RyaW5nX3ZzcHJpbnRmnQITZGV2c19zdHJpbmdfc3ByaW50Zp4CFWRldnNfc3RyaW5nX2Zyb21fdXRmOJ8CFGRldnNfdmFsdWVfdG9fc3RyaW5noAIQYnVmZmVyX3RvX3N0cmluZ6ECGWRldnNfbWFwX3NldF9zdHJpbmdfZmllbGSiAhJkZXZzX3N0cmluZ19jb25jYXSjAhJkZXZzX3B1c2hfdHJ5ZnJhbWWkAhFkZXZzX3BvcF90cnlmcmFtZaUCD2RldnNfZHVtcF9zdGFja6YCE2RldnNfZHVtcF9leGNlcHRpb26nAgpkZXZzX3Rocm93qAIVZGV2c190aHJvd190eXBlX2Vycm9yqQIcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY6oCD3RzYWdnX2NsaWVudF9ldqsCCmFkZF9zZXJpZXOsAg10c2FnZ19wcm9jZXNzrQIKbG9nX3Nlcmllc64CE3RzYWdnX2hhbmRsZV9wYWNrZXSvAhRsb29rdXBfb3JfYWRkX3Nlcmllc7ACCnRzYWdnX2luaXSxAgx0c2FnZ191cGRhdGWyAhZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlswITZGV2c192YWx1ZV9mcm9tX2ludLQCFGRldnNfdmFsdWVfZnJvbV9ib29stQIXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXK2AhRkZXZzX3ZhbHVlX3RvX2RvdWJsZbcCEWRldnNfdmFsdWVfdG9faW50uAISZGV2c192YWx1ZV90b19ib29suQIOZGV2c19pc19idWZmZXK6AhdkZXZzX2J1ZmZlcl9pc193cml0YWJsZbsCEGRldnNfYnVmZmVyX2RhdGG8AhNkZXZzX2J1ZmZlcmlzaF9kYXRhvQIUZGV2c192YWx1ZV90b19nY19vYmq+Ag1kZXZzX2lzX2FycmF5vwIRZGV2c192YWx1ZV90eXBlb2bAAg9kZXZzX2lzX251bGxpc2jBAhJkZXZzX3ZhbHVlX2llZWVfZXHCAh5kZXZzX3ZhbHVlX2VuY29kZV90aHJvd19qbXBfcGPDAhJkZXZzX2ltZ19zdHJpZHhfb2vEAhJkZXZzX2R1bXBfdmVyc2lvbnPFAgtkZXZzX3ZlcmlmecYCEWRldnNfZmV0Y2hfb3Bjb2RlxwIUZGV2c192bV9leGVjX29wY29kZXPIAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeMkCEWRldnNfaW1nX2dldF91dGY4ygIUZGV2c19nZXRfc3RhdGljX3V0ZjjLAg9kZXZzX3ZtX3JvbGVfb2vMAgxleHByX2ludmFsaWTNAhRleHByeF9idWlsdGluX29iamVjdM4CC3N0bXQxX2NhbGwwzwILc3RtdDJfY2FsbDHQAgtzdG10M19jYWxsMtECC3N0bXQ0X2NhbGwz0gILc3RtdDVfY2FsbDTTAgtzdG10Nl9jYWxsNdQCC3N0bXQ3X2NhbGw21QILc3RtdDhfY2FsbDfWAgtzdG10OV9jYWxsONcCEnN0bXQyX2luZGV4X2RlbGV0ZdgCDHN0bXQxX3JldHVybtkCCXN0bXR4X2ptcNoCDHN0bXR4MV9qbXBfetsCC3N0bXQxX3Bhbmlj3AISZXhwcnhfb2JqZWN0X2ZpZWxk3QISc3RtdHgxX3N0b3JlX2xvY2Fs3gITc3RtdHgxX3N0b3JlX2dsb2JhbN8CEnN0bXQ0X3N0b3JlX2J1ZmZlcuACCWV4cHIwX2luZuECEGV4cHJ4X2xvYWRfbG9jYWziAhFleHByeF9sb2FkX2dsb2JhbOMCC2V4cHIxX3VwbHVz5AILZXhwcjJfaW5kZXjlAg9zdG10M19pbmRleF9zZXTmAhRleHByeDFfYnVpbHRpbl9maWVsZOcCEmV4cHJ4MV9hc2NpaV9maWVsZOgCEWV4cHJ4MV91dGY4X2ZpZWxk6QIQZXhwcnhfbWF0aF9maWVsZOoCDmV4cHJ4X2RzX2ZpZWxk6wIPc3RtdDBfYWxsb2NfbWFw7AIRc3RtdDFfYWxsb2NfYXJyYXntAhJzdG10MV9hbGxvY19idWZmZXLuAhFleHByeF9zdGF0aWNfcm9sZe8CE2V4cHJ4X3N0YXRpY19idWZmZXLwAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfxAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5n8gIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5n8wIVZXhwcnhfc3RhdGljX2Z1bmN0aW9u9AINZXhwcnhfbGl0ZXJhbPUCEWV4cHJ4X2xpdGVyYWxfZjY09gIQZXhwcnhfcm9sZV9wcm90b/cCEWV4cHIzX2xvYWRfYnVmZmVy+AINZXhwcjBfcmV0X3ZhbPkCDGV4cHIxX3R5cGVvZvoCCmV4cHIwX251bGz7Ag1leHByMV9pc19udWxs/AIKZXhwcjBfdHJ1Zf0CC2V4cHIwX2ZhbHNl/gINZXhwcjFfdG9fYm9vbP8CCWV4cHIwX25hboADCWV4cHIxX2Fic4EDDWV4cHIxX2JpdF9ub3SCAwxleHByMV9pc19uYW6DAwlleHByMV9uZWeEAwlleHByMV9ub3SFAwxleHByMV90b19pbnSGAwlleHByMl9hZGSHAwlleHByMl9zdWKIAwlleHByMl9tdWyJAwlleHByMl9kaXaKAw1leHByMl9iaXRfYW5kiwMMZXhwcjJfYml0X29yjAMNZXhwcjJfYml0X3hvco0DEGV4cHIyX3NoaWZ0X2xlZnSOAxFleHByMl9zaGlmdF9yaWdodI8DGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkkAMIZXhwcjJfZXGRAwhleHByMl9sZZIDCGV4cHIyX2x0kwMIZXhwcjJfbmWUAxVzdG10MV90ZXJtaW5hdGVfZmliZXKVAxRzdG10eDJfc3RvcmVfY2xvc3VyZZYDE2V4cHJ4MV9sb2FkX2Nsb3N1cmWXAxJleHByeF9tYWtlX2Nsb3N1cmWYAxBleHByMV90eXBlb2Zfc3RymQMMZXhwcjBfbm93X21zmgMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZZsDEHN0bXQyX2NhbGxfYXJyYXmcAwlzdG10eF90cnmdAw1zdG10eF9lbmRfdHJ5ngMLc3RtdDBfY2F0Y2ifAw1zdG10MF9maW5hbGx5oAMLc3RtdDFfdGhyb3ehAw5zdG10MV9yZV90aHJvd6IDEHN0bXR4MV90aHJvd19qbXCjAw5zdG10MF9kZWJ1Z2dlcqQDCWV4cHIxX25ld6UDD2RldnNfdm1fcG9wX2FyZ6YDE2RldnNfdm1fcG9wX2FyZ191MzKnAxNkZXZzX3ZtX3BvcF9hcmdfaTMyqAMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcqkDEmpkX2Flc19jY21fZW5jcnlwdKoDEmpkX2Flc19jY21fZGVjcnlwdKsDDEFFU19pbml0X2N0eKwDD0FFU19FQ0JfZW5jcnlwdK0DEGpkX2Flc19zZXR1cF9rZXmuAw5qZF9hZXNfZW5jcnlwdK8DEGpkX2Flc19jbGVhcl9rZXmwAwtqZF93c3NrX25ld7EDFGpkX3dzc2tfc2VuZF9tZXNzYWdlsgMTamRfd2Vic29ja19vbl9ldmVudLMDB2RlY3J5cHS0Aw1qZF93c3NrX2Nsb3NltQMQamRfd3Nza19vbl9ldmVudLYDCnNlbmRfZW1wdHm3AxJ3c3NraGVhbHRoX3Byb2Nlc3O4AxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZbkDFHdzc2toZWFsdGhfcmVjb25uZWN0ugMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0uwMPc2V0X2Nvbm5fc3RyaW5nvAMRY2xlYXJfY29ubl9zdHJpbme9Aw93c3NraGVhbHRoX2luaXS+AxN3c3NrX3B1Ymxpc2hfdmFsdWVzvwMQd3Nza19wdWJsaXNoX2JpbsADEXdzc2tfaXNfY29ubmVjdGVkwQMTd3Nza19yZXNwb25kX21ldGhvZMIDHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemXDAxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlxAMPcm9sZW1ncl9wcm9jZXNzxQMQcm9sZW1ncl9hdXRvYmluZMYDFXJvbGVtZ3JfaGFuZGxlX3BhY2tldMcDFGpkX3JvbGVfbWFuYWdlcl9pbml0yAMYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkyQMNamRfcm9sZV9hbGxvY8oDEGpkX3JvbGVfZnJlZV9hbGzLAxZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kzAMSamRfcm9sZV9ieV9zZXJ2aWNlzQMTamRfY2xpZW50X2xvZ19ldmVudM4DE2pkX2NsaWVudF9zdWJzY3JpYmXPAxRqZF9jbGllbnRfZW1pdF9ldmVudNADFHJvbGVtZ3Jfcm9sZV9jaGFuZ2Vk0QMQamRfZGV2aWNlX2xvb2t1cNIDGGpkX2RldmljZV9sb29rdXBfc2VydmljZdMDE2pkX3NlcnZpY2Vfc2VuZF9jbWTUAxFqZF9jbGllbnRfcHJvY2Vzc9UDDmpkX2RldmljZV9mcmVl1gMXamRfY2xpZW50X2hhbmRsZV9wYWNrZXTXAw9qZF9kZXZpY2VfYWxsb2PYAw9qZF9jdHJsX3Byb2Nlc3PZAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXTaAwxqZF9jdHJsX2luaXTbAw1qZF9pcGlwZV9vcGVu3AMWamRfaXBpcGVfaGFuZGxlX3BhY2tldN0DDmpkX2lwaXBlX2Nsb3Nl3gMSamRfbnVtZm10X2lzX3ZhbGlk3wMVamRfbnVtZm10X3dyaXRlX2Zsb2F04AMTamRfbnVtZm10X3dyaXRlX2kzMuEDEmpkX251bWZtdF9yZWFkX2kzMuIDFGpkX251bWZtdF9yZWFkX2Zsb2F04wMRamRfb3BpcGVfb3Blbl9jbWTkAxRqZF9vcGlwZV9vcGVuX3JlcG9ydOUDFmpkX29waXBlX2hhbmRsZV9wYWNrZXTmAxFqZF9vcGlwZV93cml0ZV9leOcDEGpkX29waXBlX3Byb2Nlc3PoAxRqZF9vcGlwZV9jaGVja19zcGFjZekDDmpkX29waXBlX3dyaXRl6gMOamRfb3BpcGVfY2xvc2XrAw1qZF9xdWV1ZV9wdXNo7AMOamRfcXVldWVfZnJvbnTtAw5qZF9xdWV1ZV9zaGlmdO4DDmpkX3F1ZXVlX2FsbG9j7wMNamRfcmVzcG9uZF91OPADDmpkX3Jlc3BvbmRfdTE28QMOamRfcmVzcG9uZF91MzLyAxFqZF9yZXNwb25kX3N0cmluZ/MDF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk9AMLamRfc2VuZF9wa3T1Ax1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbPYDF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy9wMZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldPgDFGpkX2FwcF9oYW5kbGVfcGFja2V0+QMVamRfYXBwX2hhbmRsZV9jb21tYW5k+gMTamRfYWxsb2NhdGVfc2VydmljZfsDEGpkX3NlcnZpY2VzX2luaXT8Aw5qZF9yZWZyZXNoX25vd/0DGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWT+AxRqZF9zZXJ2aWNlc19hbm5vdW5jZf8DF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1lgAQQamRfc2VydmljZXNfdGlja4EEFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ4IEGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlgwQSYXBwX2dldF9md192ZXJzaW9uhAQWYXBwX2dldF9kZXZfY2xhc3NfbmFtZYUEDWpkX2hhc2hfZm52MWGGBAxqZF9kZXZpY2VfaWSHBAlqZF9yYW5kb22IBAhqZF9jcmMxNokEDmpkX2NvbXB1dGVfY3JjigQOamRfc2hpZnRfZnJhbWWLBA5qZF9yZXNldF9mcmFtZYwEEGpkX3B1c2hfaW5fZnJhbWWNBA1qZF9wYW5pY19jb3JljgQTamRfc2hvdWxkX3NhbXBsZV9tc48EEGpkX3Nob3VsZF9zYW1wbGWQBAlqZF90b19oZXiRBAtqZF9mcm9tX2hleJIEDmpkX2Fzc2VydF9mYWlskwQHamRfYXRvaZQEC2pkX3ZzcHJpbnRmlQQPamRfcHJpbnRfZG91YmxllgQKamRfc3ByaW50ZpcEEmpkX2RldmljZV9zaG9ydF9pZJgEDGpkX3NwcmludGZfYZkEC2pkX3RvX2hleF9hmgQUamRfZGV2aWNlX3Nob3J0X2lkX2GbBAlqZF9zdHJkdXCcBA5qZF9qc29uX2VzY2FwZZ0EE2pkX2pzb25fZXNjYXBlX2NvcmWeBAlqZF9tZW1kdXCfBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVloAQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZaEEEWpkX3NlbmRfZXZlbnRfZXh0ogQKamRfcnhfaW5pdKMEFGpkX3J4X2ZyYW1lX3JlY2VpdmVkpAQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2ulBA9qZF9yeF9nZXRfZnJhbWWmBBNqZF9yeF9yZWxlYXNlX2ZyYW1lpwQRamRfc2VuZF9mcmFtZV9yYXeoBA1qZF9zZW5kX2ZyYW1lqQQKamRfdHhfaW5pdKoEB2pkX3NlbmSrBBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjrAQPamRfdHhfZ2V0X2ZyYW1lrQQQamRfdHhfZnJhbWVfc2VudK4EC2pkX3R4X2ZsdXNorwQQX19lcnJub19sb2NhdGlvbrAEDF9fZnBjbGFzc2lmebEEBWR1bW15sgQIX19tZW1jcHmzBAdtZW1tb3ZltAQGbWVtc2V0tQQKX19sb2NrZmlsZbYEDF9fdW5sb2NrZmlsZbcEBGZtb2S4BAxfX3N0ZGlvX3NlZWu5BA1fX3N0ZGlvX3dyaXRlugQNX19zdGRpb19jbG9zZbsEDF9fc3RkaW9fZXhpdLwECmNsb3NlX2ZpbGW9BAhfX3RvcmVhZL4ECV9fdG93cml0Zb8ECV9fZndyaXRleMAEBmZ3cml0ZcEEK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHPCBBRfX3B0aHJlYWRfbXV0ZXhfbG9ja8MEFl9fcHRocmVhZF9tdXRleF91bmxvY2vEBAZfX2xvY2vFBA5fX21hdGhfZGl2emVyb8YEDl9fbWF0aF9pbnZhbGlkxwQDbG9nyAQFbG9nMTDJBAdfX2xzZWVrygQGbWVtY21wywQKX19vZmxfbG9ja8wEDF9fbWF0aF94Zmxvd80ECmZwX2JhcnJpZXLOBAxfX21hdGhfb2Zsb3fPBAxfX21hdGhfdWZsb3fQBARmYWJz0QQDcG930gQIY2hlY2tpbnTTBAtzcGVjaWFsY2FzZdQEBXJvdW5k1QQGc3RyY2hy1gQLX19zdHJjaHJudWzXBAZzdHJjbXDYBAZzdHJsZW7ZBAdfX3VmbG932gQHX19zaGxpbdsECF9fc2hnZXRj3AQHaXNzcGFjZd0EBnNjYWxibt4ECWNvcHlzaWdubN8EB3NjYWxibmzgBA1fX2ZwY2xhc3NpZnls4QQFZm1vZGziBAVmYWJzbOMEC19fZmxvYXRzY2Fu5AQIaGV4ZmxvYXTlBAhkZWNmbG9hdOYEB3NjYW5leHDnBAZzdHJ0b3joBAZzdHJ0b2TpBBJfX3dhc2lfc3lzY2FsbF9yZXTqBAhkbG1hbGxvY+sEBmRsZnJlZewEGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6Ze0EBHNicmvuBAhfX2FkZHRmM+8ECV9fYXNobHRpM/AEB19fbGV0ZjLxBAdfX2dldGYy8gQIX19kaXZ0ZjPzBA1fX2V4dGVuZGRmdGYy9AQNX19leHRlbmRzZnRmMvUEC19fZmxvYXRzaXRm9gQNX19mbG9hdHVuc2l0ZvcEDV9fZmVfZ2V0cm91bmT4BBJfX2ZlX3JhaXNlX2luZXhhY3T5BAlfX2xzaHJ0aTP6BAhfX211bHRmM/sECF9fbXVsdGkz/AQJX19wb3dpZGYy/QQIX19zdWJ0ZjP+BAxfX3RydW5jdGZkZjL/BAlzdGFja1NhdmWABQxzdGFja1Jlc3RvcmWBBQpzdGFja0FsbG9jggUVZW1zY3JpcHRlbl9zdGFja19pbml0gwUZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZYQFGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2WFBRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmSGBQxkeW5DYWxsX2ppammHBRZsZWdhbHN0dWIkZHluQ2FsbF9qaWppiAUYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMBhgUEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
