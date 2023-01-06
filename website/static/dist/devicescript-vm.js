
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AX9gBX9/f39/AGACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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ACABIAApA0AiCDcDKCABIAg3A0ACQAJAIAAgAUEoahCsAg0AIAFByABqIABBnwEQckEAIQIMAQsgASABKQNANwMgIAAgAUEgaiABQTxqEK0CIQILIABBABD0ASEDIAEgAEHQAGopAwAiCDcDGCABIAg3AzACQAJAIAAgAUEYahCRAkUNACABIAEpAzA3AwAgACABIAFByABqEJMCIQQMAQsgASABKQMwIgg3A0AgASAINwMQAkAgACABQRBqEKsCDQAgAUHIAGogAEGeARByQQAhBAwBCyABIAEpA0A3AwggACABQQhqIAFByABqEK0CIQQLIABBAhD0ASEFIABBAxD0ASEAAkAgASgCSCIGIAVNDQAgASAGIAVrIgY2AkggASgCPCIHIANNDQAgASAHIANrIgc2AjwgAiADaiAEIAVqIAcgBiAAIAYgAEkbIgAgByAASRsQmQQaCyABQdAAaiQACx8BAX8CQCAAQQAQ9AEiAUEASA0AIAAoApgBIAEQZwsLIQEBfyAAQf8AIABBABD0ASIBIAFBgIB8akGBgHxJGxBlCwgAIABBABBlC8sBAgd/AX4jAEHgAGsiASQAAkAgAC0AM0ECSQ0AIAEgAEHIAGopAwAiCDcDWCABIAg3AwggACABQQhqIAFB1ABqEJMCIgJFDQAgACAAIAIgASgCVCABQRBqQcAAIABB0ABqIgMgAC0AM0F+aiIEQQAQkAIiBUF/aiIGEIABIgdFDQACQAJAIAVBwQBJDQAgACACIAEoAlQgB0EGaiAFIAMgBEEAEJACGgwBCyAHQQZqIAFBEGogBhCZBBoLIAAgBxD5AQsgAUHgAGokAAtWAgF/AX4jAEEgayIBJAAgASAAQcgAaikDACICNwMYIAEgAjcDCCABQRBqIAAgAUEIahCYAiABIAEpAxAiAjcDGCABIAI3AwAgACABEM4BIAFBIGokAAsOACAAIABBABD1ARD2AQsPACAAIABBABD1AZ0Q9gELoAEBA38jAEEQayIBJAACQAJAIAAtADNBAUsNACABQQhqIABBiQEQcgwBCwJAIABBABD0ASICQXtqQXtLDQAgAUEIaiAAQYkBEHIMAQsgACAALQAzQX9qIgM6ADMgAEHIAGogAEHQAGogA0H/AXFBf2oiA0EDdBCaBBogACADIAIQbiECIAAoApgBIAI1AhxCgICAgBCENwMgCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHIAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoApgBIAI3AyAMAQsgASABKQMINwMAIAAgACABEKgCmxD2AQsgAUEQaiQAC1oCAX8BfiMAQRBrIgEkACABIABByABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKYASACNwMgDAELIAEgASkDCDcDACAAIAAgARCoApwQ9gELIAFBEGokAAtcAgF/AX4jAEEQayIBJAAgASAAQcgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCmAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQqAIQuwQQ9gELIAFBEGokAAu3AQMCfwF+AXwjAEEgayIBJAAgASAAQcgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgAzcDEAwBCyABQRBqQQAgAmsQpQILIAAoApgBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEKgCIgREAAAAAAAAAABjRQ0AIAAgBJoQ9gEMAQsgACgCmAEgASkDGDcDIAsgAUEgaiQACxUAIAAQ7gO4RAAAAAAAAPA9ohD2AQtNAQR/QQEhAQJAIABBABD0ASICQQFNDQADQCABQQF0QQFyIgEgAkkNAAsLA0AgBBDuAyABcSIDIAMgAksiAxshBCADDQALIAAgBBD3AQsRACAAIABBABD1ARCuBBD2AQsYACAAIABBABD1ASAAQQEQ9QEQuAQQ9gELLgEDf0EAIQEgAEEAEPQBIQICQCAAQQEQ9AEiA0UNACACIANtIQELIAAgARD3AQsuAQN/QQAhASAAQQAQ9AEhAgJAIABBARD0ASIDRQ0AIAIgA28hAQsgACABEPcBCxYAIAAgAEEAEPQBIABBARD0AWwQ9wELCQAgAEEBEKUBC/ACAgR/AnwjAEEwayICJAAgAiAAQcgAaikDADcDKCACIABB0ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEKkCIQMgAiACKQMgNwMQIAAgAkEQahCpAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoApgBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQqAIhBiACIAIpAyA3AwAgACACEKgCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCmAFBACkD8E83AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKYASABKQMANwMgIAJBMGokAAsJACAAQQAQpQELqAECA38BfiMAQSBrIgEkACABIABByABqKQMANwMYIAEgAEHQAGopAwAiBDcDEAJAIARQDQAgASABKQMYNwMIIAAgAUEIahDrASECIAEgASkDEDcDACAAIAEQ7QEiA0UNACACRQ0AAkAgAygCAEGAgID4AHFBgICAyABHDQAgACACIAMoAgQQ2AELIAAgAiADENgBCyAAKAKYASABKQMYNwMgIAFBIGokAAsJACAAQQEQqQELvQECA38BfiMAQTBrIgIkACACIABByABqKQMAIgU3AxggAiAFNwMoAkAgACACQRhqEO0BIgNFDQAgAEEAEH4iBEUNACACQSBqIABBCCAEEKcCIAIgAikDIDcDECAAIAJBEGoQewJAIAMoAgBBgICA+ABxQYCAgMgARw0AIAAgAygCBCAEIAEQ3AELIAAgAyAEIAEQ3AEgAiACKQMgNwMIIAAgAkEIahB8IAAoApgBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQqQELqwEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcgwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHILQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCABIAIvARIQuwJFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBEGokAAucAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyADIAJBCGpBCBCABDYCACAAIAFBrREgAxCWAgsgA0EQaiQAC6QBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHIMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARByC0EAIQILAkACQCACDQAgAEIANwMADAELIANBCGogAikDCBD+AyADIANBCGo2AgAgACABQa4UIAMQlgILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABUQpQILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARAQpQILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABQQpQILIANBEGokAAuOAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBAXEQpgILIANBEGokAAuRAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBf3NBAXEQpgILIANBEGokAAuPAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAFBCCACKAIcEKcCCyADQRBqJAALrQEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQcgwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHILQQAhAgsCQAJAIAINACAAQgA3AwAMAQtBACEBAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLwEQQQ92IQELIAAgARCmAgsgA0EQaiQAC7UBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHIMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARByC0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLgEQQX9KDQAgACACLQAQEKUCDAELIABCADcDAAsgA0EQaiQAC5UBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHIMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARByC0EAIQILAkACQCACDQAgAEIANwMADAELIAAgAi8BEEGA4ANxQYDAAEYQpgILIANBEGokAAuUAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQcgtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARBBgOADcUGAIEYQpgILIANBEGokAAuqAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARByDAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCA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aiAAQZoBEHILIARBEGokAAs+AgF/AX4jAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQqQIhACACQRBqJAAgAAtAAwF/AX4BfCMAQRBrIgIkACACIAFBA3QgAGpByABqKQMAIgM3AwAgAiADNwMIIAAgAhCoAiEEIAJBEGokACAECywBAX8jAEEQayICJAAgAkEIaiABEKQCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKUCIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEKYCIAAoApgBIAIpAwg3AyAgAkEQaiQACzABAX8jAEEQayICJAAgAkEIaiAAQQggARCnAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/AkAgACgCLCIDKAKYAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECELIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIFQRRHDQALQQAhBQsCQCAFDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQIQsgB0EAOgAAIAAgBmpBADsBAgsgBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAgNgIICwJAAkAgACAA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DQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahChAiECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAqjBASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahChAiECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahChAiECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFBsM8AENwDQf9+ag4EAAICAQILIAAgACgCDCIBQYC4mSkgAUGAuJkpSRs2AgwPCyAAIAAoAggiAUGAuJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAqjBASABajYCHAsL+gEBBH8gAkEBaiEDIAFBrjUgARshBAJAIAAoAiQiAUUNAANAAkAgASgCDCIFRQ0AIAUgBCADELEERQ0CCyABKAIAIgENAAsLAkAgAQ0AQcgAECAiAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUEAKAKowQEiBjYCQAJAIAEoAhAiBQ0AAkACQCAALQASRQ0AIABBKGohBSAAKAIoDQEgBUGIJzYCAAwBCyAAQQxqIQULIAUoAgAhBQsgASAFIAZqNgJEIAFB2iYQnwIgASADECAiBTYCDCAFIAQgAhCZBBoLIAELOwEBf0EAQcDPABDhAyIBNgKQvgEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQcwAIAEQtQML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AiACKQMoNwMAIAEgAkEQaiACQQhqIAIQ8QEgAkEwaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQjAMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIABciEEAkACQCAEQX8gA0EcaiAEELQCGyIEQX9KDQAgA0E4aiACQfAAEHIgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDuAQsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEIwDIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBC0AhsiBEF/Sg0AIANBOGogAkHwABByIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ7gELIANBwABqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhCMAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgANyIQQCQAJAIARBfyADQRxqIAQQtAIbIgRBf0oNACADQThqIAJB8AAQciADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEO4BCyADQcAAaiQAC4wBAQJ/IwBBIGsiAyQAIAIoAjghBCADIAIoApABNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEELQCGyIEQX9KDQAgA0EYaiACQfAAEHIgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDfASEEIAMgAykDEDcDACAAIAIgBCADEOkBIANBIGokAAuMAQECfyMAQSBrIgMkACACKAI4IQQgAyACKAKQATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBC0AhsiBEF/Sg0AIANBGGogAkHwABByIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQRUQ3wEhBCADIAMpAxA3AwAgACACIAQgAxDpASAD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AkAgAxCyAkUNACACKAKYASEEDAELQQAhBCADKAIMIgVBgIDA/wdxDQAgBUEPcUEDRw0AIAIgAygCCBBsIQQLAkACQCAEDQAgAEIANwMADAELIAAgBCgCHDYCACAAQQE2AgQLIANBEGokAAu2AQEDfyMAQTBrIgIkACACQShqIAEQjAMgAkEgaiABEIwDIAIgAikDKDcDEAJAAkAgASACQRBqELACDQAgAkEYaiABQboBEHIMAQsgAiACKQMoNwMIAkAgASACQQhqEK8CIgMvAQgiBEEKSQ0AIAJBGGogAUG7ARByDAELIAEgBEEBajoAMyABIAIpAyA3A0AgAUHIAGogAygCDCAEQQN0EJkEGiABKAKYASAEEGQaCyACQTBqJAALPgEBfwJAIAEtADIiAg0AIAAgAUHsABByDwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akHAAGopAwA3AwALagECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHIMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akHAAGopAwA3AwgLIAEgASkDCDcDACAAIAEQqQIhACABQRBqJAAgAAtqAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQcgwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQcAAaikDADcDCAsgASABKQMINwMAIAAgARCpAiEAIAFBEGokACAAC+cBAQJ/IwBBMGsiAyQAAkACQCABLQAyIgQNACADQShqIAFB7AAQcgwBCyABIARBf2oiBDoAMiADIAEgBEH/AXFBA3RqQcAAaikDADcDKAsgAyADKQMoNwMYAkACQCABIANBGGoQqwINAAJAIAJBAnFFDQAgAyADKQMoNwMQIAEgA0EQahCRAg0BCyADQSBqIAFB/QAQciAAQgA3AwAMAQsCQCACQQFxRQ0AIAMgAykDKDcDCCABIANBCGoQrAINACADQSBqIAFBlAEQciAAQgA3AwAMAQsgACADKQMoNwMACyADQTBqJAALgAQBBX8CQCAEQfb/A08NACAAEJQDQQAhBUEAQQE6AKC+AUEAIAEpAAA3AKG+AUEAIAFBBWoiBikAADcApr4BQQAgBEEIdCAEQYD+A3FBCHZyOwGuvgFBAEEJOgCgvgFBoL4B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DwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBjytBrgFB5DUQ9AMACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAuzAwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEMgDtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBjytBygFB+DUQ9AMAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQyAO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoAoDBASICIABHDQBBgMEBIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCbBBoLIABBATsB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IAAoAiwiAyABa6x8NwN4AkAgASADSw0AIAFBf2ogAjoAAAsgAgsQACAAQSBGIABBd2pBBUlyC64BAAJAAkAgAUGACEgNACAARAAAAAAAAOB/oiEAAkAgAUH/D08NACABQYF4aiEBDAILIABEAAAAAAAA4H+iIQAgAUH9FyABQf0XSBtBgnBqIQEMAQsgAUGBeEoNACAARAAAAAAAAGADoiEAAkAgAUG4cE0NACABQckHaiEBDAELIABEAAAAAAAAYAOiIQAgAUHwaCABQfBoShtBkg9qIQELIAAgAUH/B2qtQjSGv6ILNQAgACABNwMAIAAgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIYgAkL///////8/g4Q3AwgL5wIBAX8jAEHQAGsiBCQAAkACQCADQYCAAUgNACAEQSBqIAEgAkIAQoCAgICAgID//wAQ4QQgBEEgakEIaikDACECIAQpAyAhAQJAIANB//8BTw0AIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABDhBCADQf3/AiADQf3/AkgbQYKAfmohAyAEQRBqQQhqKQMAIQIgBCkDECEBDAELIANBgYB/Sg0AIARBwABqIAEgAkIAQoCAgICAgIA5EOEEIARBwABqQQhqKQMAIQIgBCkDQCEBAkAgA0H0gH5NDQAgA0GN/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgICAORDhBCADQeiBfSADQeiBfUobQZr+AWohAyAEQTBqQQhqKQMAIQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQ4QQgACAEQQhqKQMANwMIIAAgBCkDADcDACAEQdAAaiQAC0sCAX4CfyABQv///////z+DIQICQAJAIAFCMIinQf//AXEiA0H//wFGDQBBBCEEIAMNAUECQQMgAiAAhFAbDwsgAiAAhFAhBAsgBAvbBgIEfwN+IwBBgAFrIgUkAAJAAkACQCADIARCAEIAENcERQ0AIAMgBBDHBCEGIAJCMIinIgdB//8BcSIIQf//AUYNACAGDQELIAVBEGogASACIAMgBBDhBCAFIAUpAxAiBCAFQRBqQQhqKQMAIgMgBCADENkEIAVBCGopAwAhAiAFKQMAIQQMAQsCQCABIAitQjCGIAJC////////P4OEIgkgAyAEQjCIp0H//wFxIgatQjCGIARC////////P4OEIgoQ1wRBAEoNAAJAIAEgCSADIAoQ1wRFDQAgASEEDAILIAVB8ABqIAEgAkIAQgAQ4QQgBUH4AGopAwAhAiAFKQNwIQQMAQsCQAJAIAhFDQAgASEEDAELIAVB4ABqIAEgCUIAQoCAgICAgMC7wAAQ4QQgBUHoAGopAwAiCUIwiKdBiH9qIQggBSkDYCEECwJAIAYNACAFQdAAaiADIApCAEKAgICAgIDAu8AAEOEEIAVB2ABqKQMAIgpCMIinQYh/aiEGIAUpA1AhAwsgCkL///////8/g0KAgICAgIDAAIQhCyAJQv///////z+DQoCAgICAgMAAhCEJAkAgCCAGTA0AA0ACQAJAIAkgC30gBCADVK19IgpCAFMNAAJAIAogBCADfSIEhEIAUg0AIAVBIGogASACQgBCABDhBCAFQShqKQMAIQIgBSkDICEEDAULIApCAYYgBEI/iIQhCQwBCyAJQgGGIARCP4iEIQkLIARCAYYhBCAIQX9qIgggBkoNAAsgBiEICwJAAkAgCSALfSAEIANUrX0iCkIAWQ0AIAkhCgwBCyAKIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQ4QQgBUE4aikDACECIAUpAzAhBAwBCwJAIApC////////P1YNAANAIARCP4ghAyAIQX9qIQggBEIBhiEEIAMgCkIBhoQiCkKAgICAgIDAAFQNAAsLIAdBgIACcSEGAkAgCEEASg0AIAVBwABqIAQgCkL///////8/gyAIQfgAaiAGcq1CMIaEQgBCgICAgICAwMM/EOEEIAVByABqKQMAIQIgBSkDQCEEDAELIApC////////P4MgCCAGcq1CMIaEIQILIAAgBDcDACAAIAI3AwggBUGAAWokAAscACAAIAJC////////////AIM3AwggACABNwMAC44JAgZ/A34jAEEwayIEJABCACEKAkACQCACQQJLDQAgAUEEaiEFIAJBAnQiAkH8rgFqKAIAIQYgAkHwrgFqKAIAIQcDQAJAAkAgASgCBCICIAEoAmhGDQAgBSACQQFqNgIAIAItAAAhAgwBCyABEMIEIQILIAIQwwQNAAtBASEIAkACQCACQVVqDgMAAQABC0F/QQEgAkEtRhshCAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAA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QQEgAnQiAnENAEEAIAQgAnI2AuDDASAAIQIMAQsgACgCCCECCyAAIAE2AgggAiABNgIMIAEgADYCDCABIAI2AggPC0EfIQICQCAAQf///wdLDQAgAEEIdiICIAJBgP4/akEQdkEIcSICdCIEIARBgOAfakEQdkEEcSIEdCIGIAZBgIAPakEQdkECcSIGdEEPdiACIARyIAZyayICQQF0IAAgAkEVanZBAXFyQRxqIQILIAFCADcCECABQRxqIAI2AgAgAkECdEGQxgFqIQQCQAJAAkACQEEAKALkwwEiBkEBIAJ0IgNxDQBBACAGIANyNgLkwwEgBCABNgIAIAFBGGogBDYCAAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABQRhqIAQ2AgALIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBGGpBADYCACABIAQ2AgwgASAANgIIC0EAQQAoAoDEAUF/aiIBQX8gARs2AoDEAQsLBwA/AEEQdAtUAQJ/QQAoAoyzASIBIABBA2pBfHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDTBE0NACAAEBNFDQELQQAgADYCjLMBIAEPCxCWBEEwNgIAQX8L6AoCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEJAkACQAJAIAFQIgYgAkL///////////8AgyIKQoCAgICAgMCAgH98QoCAgICAgMCAgH9UIApQGw0AIANCAFIgCUKAgICAgIDAgIB/fCILQoCAgICAgMCAgH9WIAtCgICAgICAwICAf1EbDQELAkAgBiAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEEIAEhAwwCCwJAIANQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQQMAgsCQCABIApCgICAgICAwP//AIWEQgBSDQBCgICAgICA4P//ACACIAMgAYUgBCAChUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAJQoCAgICAgMD//wCFhFANAQJAIAEgCoRCAFINACADIAmEQgBSDQIgAyABgyEDIAQgAoMhBAwCCyADIAmEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAkgClYgCSAKURsiBxshCiAEIAIgBxsiCUL///////8/gyELIAIgBCAHGyIMQjCIp0H//wFxIQgCQCAJQjCIp0H//wFxIgYNACAFQeAAaiAKIAsgCiALIAtQIgYbeSAGQQZ0rXynIgZBcWoQ1gRBECAGayEGIAVB6ABqKQMAIQsgBSkDYCEKCyABIAMgBxshAyAMQv///////z+DIQQCQCAIDQAgBUHQAGogAyAEIAMgBCAEUCIHG3kgB0EGdK18pyIHQXFqENYEQRAgB2shCCAFQdgAaikDACEEIAUpA1AhAwsgBEIDhiADQj2IhEKAgICAgICABIQhAiALQgOGIApCPYiEIQQgA0IDhiEBIAkgDIUhAwJAIAYgCEYNAAJAIAYgCGsiB0H/AE0NAEIAIQJCASEBDAELIAVBwABqIAEgAkGAASAHaxDWBCAFQTBqIAEgAiAHEOAEIAUpAzAgBSkDQCAFQcAAakEIaikDAIRCAFKthCEBIAVBMGpBCGopAwAhAgsgBEKAgICAgICABIQhDCAKQgOGIQsCQAJAIANCf1UNAEIAIQNCACEEIAsgAYUgDCAChYRQDQIgCyABfSEKIAwgAn0gCyABVK19IgRC/////////wNWDQEgBUEgaiAKIAQgCiAEIARQIgcbeSAHQQZ0rXynQXRqIgcQ1gQgBiAHayEGIAVBKGopAwAhBCAFKQMgIQoMAQsgAiAMfCABIAt8IgogAVStfCIEQoCAgICAgIAIg1ANACAKQgGIIARCP4aEIApCAYOEIQogBkEBaiEGIARCAYghBAsgCUKAgICAgICAgIB/gyEBAkAgBkH//wFIDQAgAUKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQAJAIAZBAEwNACAGIQcMAQsgBUEQaiAKIAQgBkH/AGoQ1gQgBSAKIARBASAGaxDgBCAFKQMAIAUpAxAgBUEQakEIaikDAIRCAFKthCEKIAVBCGopAwAhBAsgCkIDiCAEQj2GhCEDIAetQjCGIARCA4hC////////P4OEIAGEIQQgCqdBB3EhBgJAAkACQAJAAkAQ3gQOAwABAgMLIAQgAyAGQQRLrXwiCiADVK18IQQCQCAGQQRGDQAgCiEDDAMLIAQgCkIBgyIBIAp8IgMgAVStfCEEDAMLIAQgAyABQgBSIAZBAEdxrXwiCiADVK18IQQgCiEDDAELIAQgAyABUCAGQQBHca18IgogA1StfCEEIAohAwsgBkUNAQsQ3wQaCyAAIAM3AwAgACAENwMIIAVB8ABqJAALUwEBfgJAAkAgA0HAAHFFDQAgASADQUBqrYYhAkIAIQEMAQsgA0UNACABQcAAIANrrYggAiADrSIEhoQhAiABIASGIQELIAAgATcDACAAIAI3AwgL4AECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC9gBAgF/An5BfyEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPCyAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL3xACBX8OfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyAEIAKFQoCAgICAgICAgH+DIQwgBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg1CgICAgICAwP//AFQgDUKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQwMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAE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AlYgASACURtxrXwiAiADVK18IgMgAiADQoCAgICAgMD//wBUIAQgBSkDAFYgASAFQQhqKQMAIgRWIAEgBFEbca18IgEgAlStfCAMhCEMCyAAIAE3AwAgACAMNwMIIAVB0AJqJAALjgICAn8DfiMAQRBrIgIkAAJAAkAgAb0iBEL///////////8AgyIFQoCAgICAgIB4fEL/////////7/8AVg0AIAVCPIYhBiAFQgSIQoCAgICAgICAPHwhBQwBCwJAIAVCgICAgICAgPj/AFQNACAEQjyGIQYgBEIEiEKAgICAgIDA//8AhCEFDAELAkAgBVBFDQBCACEGQgAhBQwBCyACIAVCACAEp2dBIGogBUIgiKdnIAVCgICAgBBUGyIDQTFqENYEIAJBCGopAwBCgICAgICAwACFQYz4ACADa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIARCgICAgICAgICAf4OENwMIIAJBEGokAAvhAQIDfwJ+IwBBEGsiAiQAAkACQCABvCIDQf////8HcSIEQYCAgHxqQf////cHSw0AIAStQhmGQoCAgICAgIDAP3whBUIAIQYMAQsCQCAEQYCAgPwHSQ0AIAOtQhmGQoCAgICAgMD//wCEIQVCACEGDAELAkAgBA0AQgAhBkIAIQUMAQsgAiAErUIAIARnIgRB0QBqENYEIAJBCGopAwBCgICAgICAwACFQYn/ACAEa61CMIaEIQUgAikDACEGCyAAIAY3AwAgACAFIANBgICAgHhxrUIghoQ3AwggAkEQaiQAC40BAgJ/An4jAEEQayICJAACQAJAIAENAEIAIQRCACEFDAELIAIgASABQR91IgNzIANrIgOtQgAgA2ciA0HRAGoQ1gQgAkEIaikDAEKAgICAgIDAAIVBnoABIANrrUIwhnwgAUGAgICAeHGtQiCGhCEFIAIpAwAhBAsgACAENwMAIAAgBTcDCCACQRBqJAALcgIBfwJ+IwBBEGsiAiQAAkACQCABDQBCACEDQgAhBAwBCyACIAGtQgAgAWciAUHRAGoQ1gQgAkEIaikDAEKAgICAgIDAAIVBnoABIAFrrUIwhnwhBCACKQMAIQMLIAAgAzcDACAAIAQ3AwggAkEQaiQACwQAQQALBABBAAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAucCwIFfw9+IwBB4ABrIgUkACAEQv///////z+DIQogBCAChUKAgICAgICAgIB/gyELIAJC////////P4MiDEIgiCENIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCELDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCELIAMhAQwCCwJAIAEgDkKAgICAgIDA//8AhYRCAFINAAJAIAMgAoRQRQ0AQoCAgICAgOD//wAhC0IAIQEMAwsgC0KAgICAgIDA//8AhCELQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINACABIA6EIQJCACEBAkAgAlBFDQBCgICAgICA4P//ACELDAMLIAtCgICAgICAwP//AIQhCwwCCwJAIAEgDoRCAFINAEIAIQEMAgsCQCADIAKEQgBSDQBCACEBDAILQQAhCAJAIA5C////////P1YNACAFQdAAaiABIAwgASAMIAxQIggbeSAIQQZ0rXynIghBcWoQ1gRBECAIayEIIAVB2ABqKQMAIgxCIIghDSAFKQNQIQELIAJC////////P1YNACAFQcAAaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ1gQgCCAJa0EQaiEIIAVByABqKQMAIQogBSkDQCEDCyADQg+GIg5CgID+/w+DIgIgAUIgiCIEfiIPIA5CIIgiDiABQv////8PgyIBfnwiEEIghiIRIAIgAX58IhIgEVStIAIgDEL/////D4MiDH4iEyAOIAR+fCIRIApCD4YgA0IxiIQiFEL/////D4MiAyABfnwiCiAQQiCIIBAgD1StQiCGhHwiDyACIA1CgIAEhCIQfiIVIA4gDH58Ig0gFEIgiEKAgICACIQiAiABfnwiFCADIAR+fCIWQiCGfCIXfCEBIAcgBmogCGpBgYB/aiEGAkACQCACIAR+IhggDiAQfnwiBCAYVK0gBCADIAx+fCIOIARUrXwgAiAQfnwgDiARIBNUrSAKIBFUrXx8IgQgDlStfCADIBB+IgMgAiAMfnwiAiADVK1CIIYgAkIgiIR8IAQgAkIghnwiAiAEVK18IAIgFkIgiCANIBVUrSAUIA1UrXwgFiAUVK18QiCGhHwiBCACVK18IAQgDyAKVK0gFyAPVK18fCICIARUrXwiBEKAgICAgIDAAINQDQAgBkEBaiEGDAELIBJCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIBJCAYYhEiADIAFCAYaEIQELAkAgBkH//wFIDQAgC0KAgICAgIDA//8AhCELQgAhAQwBCwJAAkAgBkEASg0AAkBBASAGayIHQYABSQ0AQgAhAQwDCyAFQTBqIBIgASAGQf8AaiIGENYEIAVBIGogAiAEIAYQ1gQgBUEQaiASIAEgBxDgBCAFIAIgBCAHEOAEIAUpAyAgBSkDEIQgBSkDMCAFQTBqQQhqKQMAhEIAUq2EIRIgBUEgakEIaikDACAFQRBqQQhqKQMAhCEBIAVBCGopAwAhBCAFKQMAIQIMAQsgBq1CMIYgBEL///////8/g4QhBAsgBCALhCELAkAgElAgAUJ/VSABQoCAgICAgICAgH9RGw0AIAsgAkIBfCIBIAJUrXwhCwwBCwJAIBIgAUKAgICAgICAgIB/hYRCAFENACACIQEMAQsgCyACIAJCAYN8IgEgAlStfCELCyAAIAE3AwAgACALNwMIIAVB4ABqJAALdQEBfiAAIAQgAX4gAiADfnwgA0IgiCIEIAFCIIgiAn58IANC/////w+DIgMgAUL/////D4MiAX4iBUIgiCADIAJ+fCIDQiCIfCADQv////8PgyAEIAF+fCIDQiCIfDcDCCAAIANCIIYgBUL/////D4OENwMAC2sCAXwBfyAARAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbC0gBAX8jAEEQayIFJAAgBSABIAIgAyAEQoCAgICAgICAgH+FENUEIAUpAwAhASAAIAVBCGopAwA3AwggACABNwMAIAVBEGokAAvqAwICfwJ+IwBBIGsiAiQAAkACQCABQv///////////wCDIgRCgICAgICAwP9DfCAEQoCAgICAgMCAvH98Wg0AIABCPIggAUIEhoQhBAJAIABC//////////8PgyIAQoGAgICAgICACFQNACAEQoGAgICAgICAwAB8IQUMAgsgBEKAgICAgICAgMAAfCEFIABCgICAgICAgIAIhUIAUg0BIAUgBEIBg3whBQwBCwJAIABQIARCgICAgICAwP//AFQgBEKAgICAgIDA//8AURsNACAAQjyIIAFCBIaEQv////////8Dg0KAgICAgICA/P8AhCEFDAELQoCAgICAgID4/wAhBSAEQv///////7//wwBWDQBCACEFIARCMIinIgNBkfcASQ0AIAJBEGogACABQv///////z+DQoCAgICAgMAAhCIEIANB/4h/ahDWBCACIAAgBEGB+AAgA2sQ4AQgAikDACIEQjyIIAJBCGopAwBCBIaEIQUCQCAEQv//////////D4MgAikDECACQRBqQQhqKQMAhEIAUq2EIgRCgYCAgICAgIAIVA0AIAVCAXwhBQwBCyAEQoCAgICAgICACIVCAFINACAFQgGDIAV8IQULIAJBIGokACAFIAFCgICAgICAgICAf4OEvwsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELFQBB0MfBAiQCQdDHAUEPakFwcSQBCwcAIwAjAWsLBAAjAgsEACMBCw0AIAEgAiADIAAREAALJAEBfiAAIAEgAq0gA61CIIaEIAQQ7QQhBSAFQiCIpxAUIAWnCxMAIAAgAacgAUIgiKcgAiADEBULC6CrgYAAAwBBgAgLiKcBaW5maW5pdHkALUluZmluaXR5AGh1bWlkaXR5AGFjaWRpdHkAZGV2c192ZXJpZnkAaW52YWxpZCBrZXkAYXJyYXkAaXNBcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAJXM6JXgAY2xvc3VyZTolZDoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AHBvdwBqZF93c3NrX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGFzc2VydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAaXNFdmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AHJhbmRvbUludABwYXJzZUludABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvblBhY2tldABpc1JlZ1NldABpc1JlZ0dldABvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdABrZXlzAHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAZmxhZ3MAZGV2c19tYXBfa2V5c19vcl92YWx1ZXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAYWJzAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAZGV2aWNlSWRlbnRpZmllcgBidWZmZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAcm9sZV9tZW1iZXIAZnJlZV9maWJlcgBleHAAamRfc2hhMjU2X3NldHVwAGRldnNfcHJvdG9fbG9va3VwAGRldnNfc3BlY19sb29rdXAAKCgodWludDMyX3Qpb3RwIDw8IFBBQ0tfU0hJRlQpID4+IFBBQ0tfU0hJRlQpID09ICh1aW50MzJfdClvdHAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAZGV2c19nZXRfc3RhdGljX3Byb3RvAGRldnNfbWFwX2NvcHlfaW50bwBzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AZnVuAGJ1dHRvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAGFzc2lnbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAG5hbgBib29sZWFuAHJhbmRvbQBmbGFzaF9wcm9ncmFtAGltdWwAc2V0dGluZyBudWxsAGdldHRpbmcgbnVsbABpbWFnZSB0b28gc21hbGwAamRfcm9sZV9mcmVlX2FsbABjZWlsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABzaWduYWwAP3NwZWNpYWwAZGV2c19pbWdfc3RyaWR4X29rAGFsbG9jX2Jsb2NrAHNjYW5fZ2Nfb2JqAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA+PSBtYXAtPmxlbmd0aABzZXRMZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAdmVyc2lvbiBtaXNtYXRjaABmb3JFYWNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGxvZwBidWZmZXJfdG9fc3RyaW5nAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBidWYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmAHRhZyA8PSAweGZmAGZuaWR4IDw9IDB4ZmZmZgAwMTIzNDU2Nzg5YWJjZGVmACVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAdHJ1ZQA/dmFsdWUAd3JpdGUAZGV2c19maWJlcl9hY3RpdmF0ZQBzdGF0ZSA9PSBfc3RhdGUAaGVhcnRSYXRlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1M6IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBwcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAaW5saW5lAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQBuYW1lAChyb2xlICYgREVWU19ST0xFX01BU0spID09IHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG9uQ2hhbmdlAHB1c2hSYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABzZW5kQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9uRGlzY29ubmVjdGVkAFdTOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAbm9uLWZ1bmN0aW9uIGNhbGxlZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAHBheWxvYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkAHNob3J0SWQAJS1zJWQAJS1zXyVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAHBhY2tldF9zcGVjAGRldnNfZ2V0X2Jhc2Vfc3BlYwBkZXZpY2VzY3JpcHQvdmVyaWZ5LmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBkZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGRldmljZXNjcmlwdC9maWJlcnMuYwBkZXZpY2VzY3JpcHQvdm1fb3BzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGRldmljZXNjcmlwdC9idWZmZXIuYwBkZXZpY2VzY3JpcHQvdm1fbWFpbi5jAG5ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGRldmljZXNjcmlwdC9zdHJpbmcuYwBkZXZpY2VzY3JpcHQvdHNhZ2cuYwBkZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBkZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBkZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBmaWIAPz8/YgBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAF9fZnVuY19fAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW1JvbGU6ICVzLiVzXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtQYWNrZXQ6ICVzIGNtZD0weCV4IHN6PSVkXQBbU3RhdGljIE9iajogJWRdAFtCdWZmZXJbJXVdICUtcy4uLl0AaWR4IDw9IERFVlNfQlVJTFRJTl9PQkpFQ1RfX19NQVgAaWR4IDw9IERFVlNfU0VSVklDRVNQRUNfRkxBR19ERVJJVkVfTEFTVAAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAYXJnMABsb2cxMABMTjEwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBQQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAGFnZ2J1ZjogdXBsOiAnJXMnICVmICglLXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAHIgPT0gTlVMTCB8fCBkZXZzX2lzX21hcChyKQBkZXZzX2lzX21hcChwcm90bykAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGZpZHggPCBkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+aW1nKQBkZXZzX2hhbmRsZV90eXBlX2lzX3B0cih0eXBlKQBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpAG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBkZXZzX2lzX21hcChzcmMpAGRldnNfaXNfc2VydmljZV9zcGVjKGN0eCwgc3BlYykAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBvZmYgPCAoMSA8PCBNQVhfT0ZGX0JJVFMpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoREVWU19HQ19UQUdfTUFTS19QSU5ORUQgfCBERVZTX0dDX1RBR19CWVRFUykAV1M6IHRleHQgbWVzc2FnZT8hICclcycAemVybyBrZXkhAFdTOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABAAAAAAAAAAAAAAAAAABqYWNkYWMtcG9zaXggZGV2aWNlADAuMC4wAAAAAAAAAAAAAAAAAAAAAQAAAAAAAADwnwYAgBCBEIIQ8Q8r6jQROAEAAAoAAAALAAAARGV2Uwp+apoAAAAEAQAAAAAAAAAAAAAAAAAAAAAAAABoAAAAIAAAAIgAAAAMAAAAlAAAAAAAAACU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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4WAAA0GNQAABBkLMBCwAA/9yAgAAEbmFtZQGZXPAEAAVhYm9ydAETX2RldnNfcGFuaWNfaGFuZGxlcgINZW1fc2VuZF9mcmFtZQMQZW1fY29uc29sZV9kZWJ1ZwQEZXhpdAULZW1fdGltZV9ub3cGE2RldnNfZGVwbG95X2hhbmRsZXIHIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CCFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQJGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRA5hZ2didWZmZXJfaW5pdEUPYWdnYnVmZmVyX2ZsdXNoRhBhZ2didWZmZXJfdXBsb2FkRw5kZXZzX2J1ZmZlcl9vcEgQZGV2c19yZWFkX251bWJlckkSZGV2c19idWZmZXJfZGVjb2RlShJkZXZzX2J1ZmZlcl9lbmNvZGVLD2RldnNfY3JlYXRlX2N0eEwJc2V0dXBfY3R4TQpkZXZzX3RyYWNlTg9kZXZzX2Vycm9yX2NvZGVPGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJQCWNsZWFyX2N0eFENZGV2c19mcmVlX2N0eFIIZGV2c19vb21TCWRldnNfZnJlZVQXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NVB3RyeV9ydW5WDHN0b3BfcHJvZ3JhbVccZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVkYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFsOZGVwbG95X2hhbmRsZXJcE2RlcGxveV9tZXRhX2hhbmRsZXJdFmRldmljZXNjcmlwdG1ncl9kZXBsb3leFGRldmljZXNjcmlwdG1ncl9pbml0XxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YBFkZXZzY2xvdWRfcHJvY2Vzc2EXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRiE2RldnNjbG91ZF9vbl9tZXRob2RjDmRldnNjbG91ZF9pbml0ZBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25lCmRldnNfcGFuaWNmGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWcQZGV2c19maWJlcl9zbGVlcGgbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsaRpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc2oRZGV2c19pbWdfZnVuX25hbWVrEmRldnNfaW1nX3JvbGVfbmFtZWwSZGV2c19maWJlcl9ieV9maWR4bRFkZXZzX2ZpYmVyX2J5X3RhZ24QZGV2c19maWJlcl9zdGFydG8UZGV2c19maWJlcl90ZXJtaWFudGVwDmRldnNfZmliZXJfcnVucRNkZXZzX2ZpYmVyX3N5bmNfbm93chVfZGV2c19ydW50aW1lX2ZhaWx1cmVzD2RldnNfZmliZXJfcG9rZXQTamRfZ2NfYW55X3RyeV9hbGxvY3UHZGV2c19nY3YPZmluZF9mcmVlX2Jsb2NrdxJkZXZzX2FueV90cnlfYWxsb2N4DmRldnNfdHJ5X2FsbG9jeQtqZF9nY191bnBpbnoKamRfZ2NfZnJlZXsOZGV2c192YWx1ZV9waW58EGRldnNfdmFsdWVfdW5waW59EmRldnNfbWFwX3RyeV9hbGxvY34UZGV2c19hcnJheV90cnlfYWxsb2N/FWRldnNfYnVmZmVyX3RyeV9hbGxvY4ABFWRldnNfc3RyaW5nX3RyeV9hbGxvY4EBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0ggEPZGV2c19nY19zZXRfY3R4gwEOZGV2c19nY19jcmVhdGWEAQ9kZXZzX2djX2Rlc3Ryb3mFAQtzY2FuX2djX29iaoYBEXByb3BfQXJyYXlfbGVuZ3RohwESbWV0aDJfQXJyYXlfaW5zZXJ0iAESZnVuMV9BcnJheV9pc0FycmF5iQEQbWV0aFhfQXJyYXlfcHVzaIoBFW1ldGgxX0FycmF5X3B1c2hSYW5nZYsBEW1ldGhYX0FycmF5X3NsaWNljAERZnVuMV9CdWZmZXJfYWxsb2ONARJwcm9wX0J1ZmZlcl9sZW5ndGiOARVtZXRoMF9CdWZmZXJfdG9TdHJpbmePARNtZXRoM19CdWZmZXJfZmlsbEF0kAETbWV0aDRfQnVmZmVyX2JsaXRBdJEBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOSARdmdW4xX0RldmljZVNjcmlwdF9wYW5pY5MBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdJQBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdJUBFWZ1bjFfRGV2aWNlU2NyaXB0X2xvZ5YBHGZ1bjFfRGV2aWNlU2NyaXB0X3BhcnNlRmxvYXSXARpmdW4xX0RldmljZVNjcmlwdF9wYXJzZUludJgBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0mQEOZnVuMV9NYXRoX2NlaWyaAQ9mdW4xX01hdGhfZmxvb3KbAQ9mdW4xX01hdGhfcm91bmScAQ1mdW4xX01hdGhfYWJznQEQZnVuMF9NYXRoX3JhbmRvbZ4BE2Z1bjFfTWF0aF9yYW5kb21JbnSfAQ1mdW4xX01hdGhfbG9noAENZnVuMl9NYXRoX3Bvd6EBDmZ1bjJfTWF0aF9pZGl2ogEOZnVuMl9NYXRoX2ltb2SjAQ5mdW4yX01hdGhfaW11bKQBDWZ1bjJfTWF0aF9taW6lAQtmdW4yX21pbm1heKYBDWZ1bjJfTWF0aF9tYXinARJmdW4yX09iamVjdF9hc3NpZ26oARBmdW4xX09iamVjdF9rZXlzqQETZnVuMV9rZXlzX29yX3ZhbHVlc6oBEmZ1bjFfT2JqZWN0X3ZhbHVlc6sBEHByb3BfUGFja2V0X3JvbGWsARxwcm9wX1BhY2tldF9kZXZpY2VJZGVudGlmaWVyrQETcHJvcF9QYWNrZXRfc2hvcnRJZK4BGHByb3BfUGFja2V0X3NlcnZpY2VJbmRleK8BGnByb3BfUGFja2V0X3NlcnZpY2VDb21tYW5ksAERcHJvcF9QYWNrZXRfZmxhZ3OxARVwcm9wX1BhY2tldF9pc0NvbW1hbmSyARRwcm9wX1BhY2tldF9pc1JlcG9ydLMBE3Byb3BfUGFja2V0X3BheWxvYWS0ARNwcm9wX1BhY2tldF9pc0V2ZW50tQEVcHJvcF9QYWNrZXRfZXZlbnRDb2RltgEUcHJvcF9QYWNrZXRfaXNSZWdTZXS3ARRwcm9wX1BhY2tldF9pc1JlZ0dldLgBE3Byb3BfUGFja2V0X3JlZ0NvZGW5ARNtZXRoMF9QYWNrZXRfZGVjb2RlugESZGV2c19wYWNrZXRfZGVjb2RluwEVbWV0aDBfRHNSZWdpc3Rlcl9yZWFkvAEURHNSZWdpc3Rlcl9yZWFkX2NvbnS9ARJkZXZzX3BhY2tldF9lbmNvZGW+ARZtZXRoWF9Ec1JlZ2lzdGVyX3dyaXRlvwEWcHJvcF9Ec1BhY2tldEluZm9fcm9sZcABFnByb3BfRHNQYWNrZXRJbmZvX25hbWXBARZwcm9wX0RzUGFja2V0SW5mb19jb2RlwgEYbWV0aFhfRHNDb21tYW5kX19fZnVuY19fwwEVcHJvcF9Sb2xlX2lzQ29ubmVjdGVkxAEWbWV0aDJfUm9sZV9zZW5kQ29tbWFuZMUBEnByb3BfU3RyaW5nX2xlbmd0aMYBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0xwETbWV0aDFfU3RyaW5nX2NoYXJBdMgBFGRldnNfamRfZ2V0X3JlZ2lzdGVyyQEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZMoBEGRldnNfamRfc2VuZF9jbWTLARFkZXZzX2pkX3dha2Vfcm9sZcwBFGRldnNfamRfcmVzZXRfcGFja2V0zQETZGV2c19qZF9wa3RfY2FwdHVyZc4BE2RldnNfamRfc2VuZF9sb2dtc2fPAQ1oYW5kbGVfbG9nbXNn0AESZGV2c19qZF9zaG91bGRfcnVu0QEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXSARNkZXZzX2pkX3Byb2Nlc3NfcGt00wEUZGV2c19qZF9yb2xlX2NoYW5nZWTUARJkZXZzX2pkX2luaXRfcm9sZXPVARJkZXZzX2pkX2ZyZWVfcm9sZXPWARBkZXZzX3NldF9sb2dnaW5n1wEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz2AESZGV2c19tYXBfY29weV9pbnRv2QEMZGV2c19tYXBfc2V02gEUZGV2c19pc19zZXJ2aWNlX3NwZWPbAQZsb29rdXDcARdkZXZzX21hcF9rZXlzX29yX3ZhbHVlc90BEWRldnNfYXJyYXlfaW5zZXJ03gEPZGV2c19tYXBfZGVsZXRl3wEYZGV2c19vYmplY3RfZ2V0X2J1aWx0X2lu4AEXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXThAQ5kZXZzX3JvbGVfc3BlY+IBEGRldnNfc3BlY19sb29rdXDjARFkZXZzX3Byb3RvX2xvb2t1cOQBEmRldnNfZnVuY3Rpb25fYmluZOUBEWRldnNfbWFrZV9jbG9zdXJl5gEOZGV2c19nZXRfZm5pZHjnARNkZXZzX2dldF9mbmlkeF9jb3Jl6AEYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVk6QEXZGV2c19vYmplY3RfZ2V0X25vX2JpbmTqARNkZXZzX2dldF9yb2xlX3Byb3Rv6wEbZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J37AEVZGV2c19nZXRfc3RhdGljX3Byb3Rv7QEdZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX2VudW3uAQ9kZXZzX29iamVjdF9nZXTvAQxkZXZzX3NlcV9nZXTwAQxkZXZzX2FueV9nZXTxAQxkZXZzX2FueV9zZXTyAQxkZXZzX3NlcV9zZXTzAQ5kZXZzX2FycmF5X3NldPQBDGRldnNfYXJnX2ludPUBD2RldnNfYXJnX2RvdWJsZfYBD2RldnNfcmV0X2RvdWJsZfcBDGRldnNfcmV0X2ludPgBDWRldnNfcmV0X2Jvb2z5AQ9kZXZzX3JldF9nY19wdHL6ARFkZXZzX3NldHVwX3Jlc3VtZfsBEmRldnNfcmVnY2FjaGVfZnJlZfwBFmRldnNfcmVnY2FjaGVfZnJlZV9hbGz9ARdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZP4BE2RldnNfcmVnY2FjaGVfYWxsb2P/ARRkZXZzX3JlZ2NhY2hlX2xvb2t1cIACEWRldnNfcmVnY2FjaGVfYWdlgQIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWCAhJkZXZzX3JlZ2NhY2hlX25leHSDAg9qZF9zZXR0aW5nc19nZXSEAg9qZF9zZXR0aW5nc19zZXSFAg5kZXZzX2xvZ192YWx1ZYYCD2RldnNfc2hvd192YWx1ZYcCEGRldnNfc2hvd192YWx1ZTCIAg1jb25zdW1lX2NodW5riQINc2hhXzI1Nl9jbG9zZYoCD2pkX3NoYTI1Nl9zZXR1cIsCEGpkX3NoYTI1Nl91cGRhdGWMAhBqZF9zaGEyNTZfZmluaXNojQIUamRfc2hhMjU2X2htYWNfc2V0dXCOAhVqZF9zaGEyNTZfaG1hY19maW5pc2iPAg5qZF9zaGEyNTZfaGtkZpACDmRldnNfc3RyZm9ybWF0kQIOZGV2c19pc19zdHJpbmeSAg5kZXZzX2lzX251bWJlcpMCFGRldnNfc3RyaW5nX2dldF91dGY4lAITZGV2c19idWlsdGluX3N0cmluZ5UCFGRldnNfc3RyaW5nX3ZzcHJpbnRmlgITZGV2c19zdHJpbmdfc3ByaW50ZpcCFWRldnNfc3RyaW5nX2Zyb21fdXRmOJgCFGRldnNfdmFsdWVfdG9fc3RyaW5nmQIQYnVmZmVyX3RvX3N0cmluZ5oCEmRldnNfc3RyaW5nX2NvbmNhdJsCHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2OcAg90c2FnZ19jbGllbnRfZXadAgphZGRfc2VyaWVzngINdHNhZ2dfcHJvY2Vzc58CCmxvZ19zZXJpZXOgAhN0c2FnZ19oYW5kbGVfcGFja2V0oQIUbG9va3VwX29yX2FkZF9zZXJpZXOiAgp0c2FnZ19pbml0owIMdHNhZ2dfdXBkYXRlpAIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZaUCE2RldnNfdmFsdWVfZnJvbV9pbnSmAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbKcCF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyqAIUZGV2c192YWx1ZV90b19kb3VibGWpAhFkZXZzX3ZhbHVlX3RvX2ludKoCEmRldnNfdmFsdWVfdG9fYm9vbKsCDmRldnNfaXNfYnVmZmVyrAIXZGV2c19idWZmZXJfaXNfd3JpdGFibGWtAhBkZXZzX2J1ZmZlcl9kYXRhrgITZGV2c19idWZmZXJpc2hfZGF0Ya8CFGRldnNfdmFsdWVfdG9fZ2Nfb2JqsAINZGV2c19pc19hcnJhebECEWRldnNfdmFsdWVfdHlwZW9msgIPZGV2c19pc19udWxsaXNoswISZGV2c192YWx1ZV9pZWVlX2VxtAISZGV2c19pbWdfc3RyaWR4X29rtQISZGV2c19kdW1wX3ZlcnNpb25ztgILZGV2c192ZXJpZnm3AhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc7gCGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4uQIRZGV2c19pbWdfZ2V0X3V0Zji6AhRkZXZzX2dldF9zdGF0aWNfdXRmOLsCD2RldnNfdm1fcm9sZV9va7wCDGV4cHJfaW52YWxpZL0CFGV4cHJ4X2J1aWx0aW5fb2JqZWN0vgILc3RtdDFfY2FsbDC/AgtzdG10Ml9jYWxsMcACC3N0bXQzX2NhbGwywQILc3RtdDRfY2FsbDPCAgtzdG10NV9jYWxsNMMCC3N0bXQ2X2NhbGw1xAILc3RtdDdfY2FsbDbFAgtzdG10OF9jYWxsN8YCC3N0bXQ5X2NhbGw4xwISc3RtdDJfaW5kZXhfZGVsZXRlyAIMc3RtdDFfcmV0dXJuyQIJc3RtdHhfam1wygIMc3RtdHgxX2ptcF96ywILc3RtdDFfcGFuaWPMAhJleHByeF9vYmplY3RfZmllbGTNAhJzdG10eDFfc3RvcmVfbG9jYWzOAhNzdG10eDFfc3RvcmVfZ2xvYmFszwISc3RtdDRfc3RvcmVfYnVmZmVy0AIJZXhwcjBfaW5m0QIQZXhwcnhfbG9hZF9sb2NhbNICEWV4cHJ4X2xvYWRfZ2xvYmFs0wILZXhwcjFfdXBsdXPUAgtleHByMl9pbmRleNUCD3N0bXQzX2luZGV4X3NldNYCFGV4cHJ4MV9idWlsdGluX2ZpZWxk1wISZXhwcngxX2FzY2lpX2ZpZWxk2AIRZXhwcngxX3V0ZjhfZmllbGTZAhBleHByeF9tYXRoX2ZpZWxk2gIOZXhwcnhfZHNfZmllbGTbAg9zdG10MF9hbGxvY19tYXDcAhFzdG10MV9hbGxvY19hcnJhed0CEnN0bXQxX2FsbG9jX2J1ZmZlct4CEWV4cHJ4X3N0YXRpY19yb2xl3wITZXhwcnhfc3RhdGljX2J1ZmZlcuACG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ+ECGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfiAhhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfjAhVleHByeF9zdGF0aWNfZnVuY3Rpb27kAg1leHByeF9saXRlcmFs5QIRZXhwcnhfbGl0ZXJhbF9mNjTmAhBleHByeF9yb2xlX3Byb3Rv5wIRZXhwcjNfbG9hZF9idWZmZXLoAg1leHByMF9yZXRfdmFs6QIMZXhwcjFfdHlwZW9m6gIKZXhwcjBfbnVsbOsCDWV4cHIxX2lzX251bGzsAgpleHByMF90cnVl7QILZXhwcjBfZmFsc2XuAg1leHByMV90b19ib29s7wIJZXhwcjBfbmFu8AIJZXhwcjFfYWJz8QINZXhwcjFfYml0X25vdPICDGV4cHIxX2lzX25hbvMCCWV4cHIxX25lZ/QCCWV4cHIxX25vdPUCDGV4cHIxX3RvX2ludPYCCWV4cHIyX2FkZPcCCWV4cHIyX3N1YvgCCWV4cHIyX211bPkCCWV4cHIyX2RpdvoCDWV4cHIyX2JpdF9hbmT7AgxleHByMl9iaXRfb3L8Ag1leHByMl9iaXRfeG9y/QIQZXhwcjJfc2hpZnRfbGVmdP4CEWV4cHIyX3NoaWZ0X3JpZ2h0/wIaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWSAAwhleHByMl9lcYEDCGV4cHIyX2xlggMIZXhwcjJfbHSDAwhleHByMl9uZYQDFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcoUDFHN0bXR4Ml9zdG9yZV9jbG9zdXJlhgMTZXhwcngxX2xvYWRfY2xvc3VyZYcDEmV4cHJ4X21ha2VfY2xvc3VyZYgDEGV4cHIxX3R5cGVvZl9zdHKJAwxleHByMF9ub3dfbXOKAxZleHByMV9nZXRfZmliZXJfaGFuZGxliwMQc3RtdDJfY2FsbF9hcnJheYwDD2RldnNfdm1fcG9wX2FyZ40DE2RldnNfdm1fcG9wX2FyZ191MzKOAxNkZXZzX3ZtX3BvcF9hcmdfaTMyjwMWZGV2c192bV9wb3BfYXJnX2J1ZmZlcpADEmpkX2Flc19jY21fZW5jcnlwdJEDEmpkX2Flc19jY21fZGVjcnlwdJIDDEFFU19pbml0X2N0eJMDD0FFU19FQ0JfZW5jcnlwdJQDEGpkX2Flc19zZXR1cF9rZXmVAw5qZF9hZXNfZW5jcnlwdJYDEGpkX2Flc19jbGVhcl9rZXmXAwtqZF93c3NrX25ld5gDFGpkX3dzc2tfc2VuZF9tZXNzYWdlmQMTamRfd2Vic29ja19vbl9ldmVudJoDB2RlY3J5cHSbAw1qZF93c3NrX2Nsb3NlnAMQamRfd3Nza19vbl9ldmVudJ0DCnNlbmRfZW1wdHmeAxJ3c3NraGVhbHRoX3Byb2Nlc3OfAxdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZaADFHdzc2toZWFsdGhfcmVjb25uZWN0oQMYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0ogMPc2V0X2Nvbm5fc3RyaW5nowMRY2xlYXJfY29ubl9zdHJpbmekAw93c3NraGVhbHRoX2luaXSlAxN3c3NrX3B1Ymxpc2hfdmFsdWVzpgMQd3Nza19wdWJsaXNoX2JpbqcDEXdzc2tfaXNfY29ubmVjdGVkqAMTd3Nza19yZXNwb25kX21ldGhvZKkDHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemWqAxZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlqwMPcm9sZW1ncl9wcm9jZXNzrAMQcm9sZW1ncl9hdXRvYmluZK0DFXJvbGVtZ3JfaGFuZGxlX3BhY2tldK4DFGpkX3JvbGVfbWFuYWdlcl9pbml0rwMYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVksAMNamRfcm9sZV9hbGxvY7EDEGpkX3JvbGVfZnJlZV9hbGyyAxZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kswMSamRfcm9sZV9ieV9zZXJ2aWNltAMTamRfY2xpZW50X2xvZ19ldmVudLUDE2pkX2NsaWVudF9zdWJzY3JpYmW2AxRqZF9jbGllbnRfZW1pdF9ldmVudLcDFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkuAMQamRfZGV2aWNlX2xvb2t1cLkDGGpkX2RldmljZV9sb29rdXBfc2VydmljZboDE2pkX3NlcnZpY2Vfc2VuZF9jbWS7AxFqZF9jbGllbnRfcHJvY2Vzc7wDDmpkX2RldmljZV9mcmVlvQMXamRfY2xpZW50X2hhbmRsZV9wYWNrZXS+Aw9qZF9kZXZpY2VfYWxsb2O/Aw9qZF9jdHJsX3Byb2Nlc3PAAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXTBAwxqZF9jdHJsX2luaXTCAw1qZF9pcGlwZV9vcGVuwwMWamRfaXBpcGVfaGFuZGxlX3BhY2tldMQDDmpkX2lwaXBlX2Nsb3NlxQMSamRfbnVtZm10X2lzX3ZhbGlkxgMVamRfbnVtZm10X3dyaXRlX2Zsb2F0xwMTamRfbnVtZm10X3dyaXRlX2kzMsgDEmpkX251bWZtdF9yZWFkX2kzMskDFGpkX251bWZtdF9yZWFkX2Zsb2F0ygMRamRfb3BpcGVfb3Blbl9jbWTLAxRqZF9vcGlwZV9vcGVuX3JlcG9ydMwDFmpkX29waXBlX2hhbmRsZV9wYWNrZXTNAxFqZF9vcGlwZV93cml0ZV9leM4DEGpkX29waXBlX3Byb2Nlc3PPAxRqZF9vcGlwZV9jaGVja19zcGFjZdADDmpkX29waXBlX3dyaXRl0QMOamRfb3BpcGVfY2xvc2XSAw1qZF9xdWV1ZV9wdXNo0wMOamRfcXVldWVfZnJvbnTUAw5qZF9xdWV1ZV9zaGlmdNUDDmpkX3F1ZXVlX2FsbG9j1gMNamRfcmVzcG9uZF91ONcDDmpkX3Jlc3BvbmRfdTE22AMOamRfcmVzcG9uZF91MzLZAxFqZF9yZXNwb25kX3N0cmluZ9oDF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk2wMLamRfc2VuZF9wa3TcAx1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbN0DF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy3gMZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldN8DFGpkX2FwcF9oYW5kbGVfcGFja2V04AMVamRfYXBwX2hhbmRsZV9jb21tYW5k4QMTamRfYWxsb2NhdGVfc2VydmljZeIDEGpkX3NlcnZpY2VzX2luaXTjAw5qZF9yZWZyZXNoX25vd+QDGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTlAxRqZF9zZXJ2aWNlc19hbm5vdW5jZeYDF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l5wMQamRfc2VydmljZXNfdGlja+gDFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+kDGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl6gMSYXBwX2dldF9md192ZXJzaW9u6wMWYXBwX2dldF9kZXZfY2xhc3NfbmFtZewDDWpkX2hhc2hfZm52MWHtAwxqZF9kZXZpY2VfaWTuAwlqZF9yYW5kb23vAwhqZF9jcmMxNvADDmpkX2NvbXB1dGVfY3Jj8QMOamRfc2hpZnRfZnJhbWXyAw5qZF9yZXNldF9mcmFtZfMDEGpkX3B1c2hfaW5fZnJhbWX0Aw1qZF9wYW5pY19jb3Jl9QMTamRfc2hvdWxkX3NhbXBsZV9tc/YDEGpkX3Nob3VsZF9zYW1wbGX3AwlqZF90b19oZXj4AwtqZF9mcm9tX2hlePkDDmpkX2Fzc2VydF9mYWls+gMHamRfYXRvafsDC2pkX3ZzcHJpbnRm/AMPamRfcHJpbnRfZG91Ymxl/QMKamRfc3ByaW50Zv4DEmpkX2RldmljZV9zaG9ydF9pZP8DDGpkX3NwcmludGZfYYAEC2pkX3RvX2hleF9hgQQUamRfZGV2aWNlX3Nob3J0X2lkX2GCBAlqZF9zdHJkdXCDBA5qZF9qc29uX2VzY2FwZYQEE2pkX2pzb25fZXNjYXBlX2NvcmWFBAlqZF9tZW1kdXCGBBZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlhwQWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZYgEEWpkX3NlbmRfZXZlbnRfZXh0iQQKamRfcnhfaW5pdIoEFGpkX3J4X2ZyYW1lX3JlY2VpdmVkiwQdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uMBA9qZF9yeF9nZXRfZnJhbWWNBBNqZF9yeF9yZWxlYXNlX2ZyYW1ljgQRamRfc2VuZF9mcmFtZV9yYXePBA1qZF9zZW5kX2ZyYW1lkAQKamRfdHhfaW5pdJEEB2pkX3NlbmSSBBZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjkwQPamRfdHhfZ2V0X2ZyYW1llAQQamRfdHhfZnJhbWVfc2VudJUEC2pkX3R4X2ZsdXNolgQQX19lcnJub19sb2NhdGlvbpcEDF9fZnBjbGFzc2lmeZgEBWR1bW15mQQIX19tZW1jcHmaBAdtZW1tb3ZlmwQGbWVtc2V0nAQKX19sb2NrZmlsZZ0EDF9fdW5sb2NrZmlsZZ4EBGZtb2SfBAxfX3N0ZGlvX3NlZWugBA1fX3N0ZGlvX3dyaXRloQQNX19zdGRpb19jbG9zZaIEDF9fc3RkaW9fZXhpdKMECmNsb3NlX2ZpbGWkBAhfX3RvcmVhZKUECV9fdG93cml0ZaYECV9fZndyaXRleKcEBmZ3cml0ZagEK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHOpBBRfX3B0aHJlYWRfbXV0ZXhfbG9ja6oEFl9fcHRocmVhZF9tdXRleF91bmxvY2urBAZfX2xvY2usBA5fX21hdGhfZGl2emVyb60EDl9fbWF0aF9pbnZhbGlkrgQDbG9nrwQFbG9nMTCwBAdfX2xzZWVrsQQGbWVtY21wsgQKX19vZmxfbG9ja7MEDF9fbWF0aF94Zmxvd7QECmZwX2JhcnJpZXK1BAxfX21hdGhfb2Zsb3e2BAxfX21hdGhfdWZsb3e3BARmYWJzuAQDcG93uQQIY2hlY2tpbnS6BAtzcGVjaWFsY2FzZbsEBXJvdW5kvAQGc3RyY2hyvQQLX19zdHJjaHJudWy+BAZzdHJjbXC/BAZzdHJsZW7ABAdfX3VmbG93wQQHX19zaGxpbcIECF9fc2hnZXRjwwQHaXNzcGFjZcQEBnNjYWxibsUECWNvcHlzaWdubMYEB3NjYWxibmzHBA1fX2ZwY2xhc3NpZnlsyAQFZm1vZGzJBAVmYWJzbMoEC19fZmxvYXRzY2FuywQIaGV4ZmxvYXTMBAhkZWNmbG9hdM0EB3NjYW5leHDOBAZzdHJ0b3jPBAZzdHJ0b2TQBBJfX3dhc2lfc3lzY2FsbF9yZXTRBAhkbG1hbGxvY9IEBmRsZnJlZdMEGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdQEBHNicmvVBAhfX2FkZHRmM9YECV9fYXNobHRpM9cEB19fbGV0ZjLYBAdfX2dldGYy2QQIX19kaXZ0ZjPaBA1fX2V4dGVuZGRmdGYy2wQNX19leHRlbmRzZnRmMtwEC19fZmxvYXRzaXRm3QQNX19mbG9hdHVuc2l0Zt4EDV9fZmVfZ2V0cm91bmTfBBJfX2ZlX3JhaXNlX2luZXhhY3TgBAlfX2xzaHJ0aTPhBAhfX211bHRmM+IECF9fbXVsdGkz4wQJX19wb3dpZGYy5AQIX19zdWJ0ZjPlBAxfX3RydW5jdGZkZjLmBAlzdGFja1NhdmXnBAxzdGFja1Jlc3RvcmXoBApzdGFja0FsbG9j6QQVZW1zY3JpcHRlbl9zdGFja19pbml06gQZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZesEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XsBBhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTtBAxkeW5DYWxsX2ppamnuBBZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp7wQYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB7QQEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
