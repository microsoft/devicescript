
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgBX9/f39/AGAFf39/f38Bf2ACf38BfGACf3wAYAN/fn8BfmAAAX5gAX4Bf2ABfwF8YAR/fn5/AGAGf39/f39/AGACf34AYAJ8fAF8YAJ8fwF8YAR+fn5+AX9gAAF8YAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGABfAF/YAJ/fAF8YAN8fn4BfGACfn4Bf2ADf35+AGAHf39/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADQPkhICAAOIEBgEABgYIBgAABgQACAYGBQUAAwIABgYCBAMDAxEGEQYGAwcGAgYGAwkFBQUFBgAIBRUbDA0FAgcDBwAAAgIAAAAEAwQCAgIDAAcAAgcAAAMCAgICAgADAwMDBQAAAAEABQAFBQMCAgICBAMDAwUCCAABAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAQEBAQEBAQEBAQEBAQEADAACAgABAQEAAQEAAAwAAQIAAQIDBAUBAgAAAggBBwMFBwkFAwUDBwcHBwkDBQUDBwcHBwcHBwMODwICAQIAAwkJAQIJBAMBAwMCBAYCAAIAHB0DBAUCBwcHAQEHBAcDAAICBQAPDwICBw4DAwMDBQUDAwMEBQMAAwAEBQUDAQECAgICAgICAgIBAgICAgECAgIBAQEBAQIBAQEBAQICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgEBAQECAQEBAQEBAgIEBAEFBAQMDQICAAAGCQMBAwYBAAAIAAIHAAYFAwgJBAQAAAIGAAMGBgQBAgEAEgMJBgAABAACBgUAAAQeAQMOAwMACQYDBQQDBAAEAwMDAwQEBQUAAAAEBgYGBgQGBgYICAMRCAMABAAJAQMDAQMHBAkfCRYDAxIEAwUDBgYHBgQECAAEBAYJBggABgggBAUFBQQAFxAFBAYABAQFCQYEBAATCwsLEAUIIQsTEwsXEiILAwMDBAQWBAQYChQjCiQHFSUmBw4EBAAIBAoUGRkKDycCAggIFAoKGAooCAAEBggICCkNKgSHgICAAAFwAbQBtAEFhoCAgAABAYACgAIGk4CAgAADfwFB4MbBAgt/AUEAC38BQQALB/qDgIAAGAZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAWEF9fZXJybm9fbG9jYXRpb24AngQZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABm1hbGxvYwDZBARmcmVlANoEGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACkaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKgpqZF9lbV9pbml0ACsNamRfZW1fcHJvY2VzcwAsFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC4RamRfZW1fZGV2c19kZXBsb3kALxFqZF9lbV9kZXZzX3ZlcmlmeQAwGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAxDF9fc3RkaW9fZXhpdACqBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzALAEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdADxBBllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAPIEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA8wQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPQECXN0YWNrU2F2ZQDuBAxzdGFja1Jlc3RvcmUA7wQKc3RhY2tBbGxvYwDwBAxkeW5DYWxsX2ppamkA9gQJ34KAgAABAEEBC7MBKDg/QEFCW1xfVFpgYboBiAGJAYoBiwGMAY0BjgGPAZABkQGSAZMBlAGVAZYBlwGYAZkBmgGbAZwBnQGeAZ8BoAGhAaIBpAGlAaYBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG5AbwBvQG+Ab8BwAHBAcIBwwHEAZYCmAKaArYCtwK4ArkCugK7ArwCvQK+Ar8CwALBAsICwwLEAsUCxgLHAsgCyQLKAssCzALNAs4CzwLQAtEC0gLTAtQC1QLWAtcC2ALZAtoC2wLcAt0C3gLfAuAC4QLiAuMC5ALlAuYC5wLoAukC6gLrAuwC7QLuAu8C8ALxAvIC8wL0AvUC9gL3AvgC+QL6AvsC/AL9Av4C/wKAA4EDggODA4QDhQOGA4cDiAOJA4oDiwOMA40DjgOPA5ADpgOpA60DrgNGrwOwA7MDtQPHA8gDjwSpBKgEpwQKvL2HgADiBAUAEPEEC84BAQF/AkACQAJAAkBBACgCgLgBIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgChLgBSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtBwzhB/ixBFEGEGhCBBAALAkADQCAAIANqLQAAQf8BRw0BIANBAWoiAyACRg0FDAALAAtB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AEIANwMACyADQSBqJAALjwECAn8BfiMAQTBrIgEkACABIAApA0AiAzcDECABIAM3AyACQAJAIAAgAUEQahClAg0AIAFBKGogAEGeARB0QQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQpwIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQkQIgACgCmAEgASkDGDcDIAsgAUEwaiQAC7UBAgV/AX4jAEEgayIBJAAgASAAKQNAIgY3AwggASAGNwMQAkACQCAAIAFBCGoQpgINACABQRhqIABBnwEQdEEAIQIMAQsgASABKQMQNwMAIAAgASABQRhqEKcCIQILAkAgAkUNACAAQQAQ7wEhAyAAQQEQ7wEhBCAAQQIQ7wEhACABKAIYIgUgA00NACABIAUgA2siBTYCGCACIANqIAAgBSAEIAUgBEkbEKMEGgsgAUEgaiQAC/ECAgd/AX4jAEHQAGsiASQAIAEgACkDQCIINwMoIAEgCDcDQAJAAkAgACABQShqEKYCDQAgAUHIAGogAEGfARB0QQAhAgwBCyABIAEpA0A3AyAgACABQSBqIAFBPGoQpwIhAgsgAEEAEO8BIQMgASAAQdAAaikDACIINwMYIAEgCDcDMAJAAkAgACABQRhqEIsCRQ0AIAEgASkDMDcDACAAIAEgAUHIAGoQjQIhBAwBCyABIAEpAzAiCDcDQCABIAg3AxACQCAAIAFBEGoQpQINACABQcgAaiAAQZ4BEHRBACEEDAELIAEgASkDQDcDCCAAIAFBCGogAUHIAGoQpwIhBAsgAEECEO8BIQUgAEEDEO8BIQACQCABKAJIIgYgBU0NACABIAYgBWsiBjYCSCABKAI8IgcgA00NACABIAcgA2siBzYCPCACIANqIAQgBWogByAGIAAgBiAASRsiACAHIABJGxChBBoLIAFB0ABqJAALHwEBfwJAIABBABDvASIBQQBIDQAgACgCmAEgARBoCwshAQF/IABB/wAgAEEAEO8BIgEgAUGAgHxqQYGAfEkbEGYLCAAgAEEAEGYLywECB38BfiMAQeAAayIBJAACQCAALQAzQQJJDQAgASAAQcgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQjQIiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHQAGoiAyAALQAzQX5qIgRBABCKAiIFQX9qIgYQggEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQigIaDAELIAdBBmogAUEQaiAGEKEEGgsgACAHEPMBCyABQeAAaiQAC1YCAX8BfiMAQSBrIgEkACABIABByABqKQMAIgI3AxggASACNwMIIAFBEGogACABQQhqEJICIAEgASkDECICNwMYIAEgAjcDACAAIAEQywEgAUEgaiQACw4AIAAgAEEAEPABEPEBCw8AIAAgAEEAEPABnRDxAQugAQEDfyMAQRBrIgEkAAJAAkAgAC0AM0EBSw0AIAFBCGogAEGJARB0DAELAkAgAEEAEO8BIgJBe2pBe0sNACABQQhqIABBiQEQdAwBCyAAIAAtADNBf2oiAzoAMyAAQcgAaiAAQdAAaiADQf8BcUF/aiIDQQN0EKIEGiAAIAMgAhBwIQIgACgCmAEgAjUCHEKAgICAEIQ3AyALIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQcgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCmAEgAjcDIAwBCyABIAEpAwg3AwAgACAAIAEQogKbEPEBCyABQRBqJAALWgIBfwF+IwBBEGsiASQAIAEgAEHIAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoApgBIAI3AyAMAQsgASABKQMINwMAIAAgACABEKICnBDxAQsgAUEQaiQAC1wCAX8BfiMAQRBrIgEkACABIABByABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKYASACNwMgDAELIAEgASkDCDcDACAAIAAgARCiAhDDBBDxAQsgAUEQaiQAC7cBAwJ/AX4BfCMAQSBrIgEkACABIABByABqKQMAIgM3AxgCQAJAIAEoAhxBf0cNACADpyICQYCAgIB4Rg0AAkACQCACQQBIDQAgASADNwMQDAELIAFBEGpBACACaxCfAgsgACgCmAEgASkDEDcDIAwBCyABIAEpAxg3AwgCQCAAIAFBCGoQogIiBEQAAAAAAAAAAGNFDQAgACAEmhDxAQwBCyAAKAKYASABKQMYNwMgCyABQSBqJAALFQAgABD2A7hEAAAAAAAA8D2iEPEBC00BBH9BASEBAkAgAEEAEO8BIgJBAU0NAANAIAFBAXRBAXIiASACSQ0ACwsDQCAEEPYDIAFxIgMgAyACSyIDGyEEIAMNAAsgACAEEPIBCxEAIAAgAEEAEPABELYEEPEBCxgAIAAgAEEAEPABIABBARDwARDABBDxAQsuAQN/QQAhASAAQQAQ7wEhAgJAIABBARDvASIDRQ0AIAIgA20hAQsgACABEPIBCy4BA39BACEBIABBABDvASECAkAgAEEBEO8BIgNFDQAgAiADbyEBCyAAIAEQ8gELFgAgACAAQQAQ7wEgAEEBEO8BbBDyAQsJACAAQQEQowEL8AICBH8CfCMAQTBrIgIkACACIABByABqKQMANwMoIAIgAEHQAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCAAIAJBGGoQowIhAyACIAIpAyA3AxAgACACQRBqEKMCIQQCQAJAAkAgAUUNACACQShqIQUgAyAETg0BDAILIAJBKGohBSADIARKDQELIAJBIGohBQsgACgCmAEgBSkDADcDIAsgAiACKQMoNwMIIAAgAkEIahCiAiEGIAIgAikDIDcDACAAIAIQogIhBwJAAkAgBr1C////////////AINCgICAgICAgPj/AFYNACAHvUL///////////8Ag0KBgICAgICA+P8AVA0BCyAAKAKYAUEAKQPYTjcDIAsCQAJAAkAgAUUNACACQShqIQEgBiAHY0UNAQwCCyACQShqIQEgBiAHZA0BCyACQSBqIQELIAAoApgBIAEpAwA3AyAgAkEwaiQACwkAIABBABCjAQuoAQIDfwF+IwBBIGsiASQAIAEgAEHIAGopAwA3AxggASAAQdAAaikDACIENwMQAkAgBFANACABIAEpAxg3AwggACABQQhqEOQBIQIgASABKQMQNwMAIAAgARDnASIDRQ0AIAJFDQACQCADKAIAQYCAgPgAcUGAgIDIAEcNACAAIAIgAygCBBDVAQsgACACIAMQ1QELIAAoApgBIAEpAxg3AyAgAUEgaiQACwkAIABBARCnAQu+AQIDfwF+IwBBMGsiAiQAIAIgAEHIAGopAwAiBTcDGCACIAU3AygCQCAAIAJBGGoQ5wEiA0UNACAAQQAQgAEiBEUNACACQSBqIABBCCAEEKECIAIgAikDIDcDECAAIAJBEGoQfQJAIAMoAgBBgICA+ABxQYCAgMgARw0AIAAgAygCBCAEIAEQ2QELIAAgAyAEIAEQ2QEgAiACKQMgNwMIIAAgAkEIahB+IAAoApgBIAIpAyA3AyALIAJBMGokAAsJACAAQQAQpwELqwEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQdAwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHQLQQAhAgsCQAJAIAINACAAQgA3AwAMAQsCQCABIAIvARIQtQJFDQAgACACLwESNgIAIABBAjYCBAwBCyAAQgA3AwALIANBEGokAAucAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyADIAJBCGpBCBCIBDYCACAAIAFBnhEgAxCQAgsgA0EQaiQAC6QBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHQMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARB0C0EAIQILAkACQCACDQAgAEIANwMADAELIANBCGogAikDCBCGBCADIANBCGo2AgAgACABQZ8UIAMQkAILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABUQnwILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvARAQnwILIANBEGokAAuLAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABQQnwILIANBEGokAAuOAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBAXEQoAILIANBEGokAAuRAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAItABRBf3NBAXEQoAILIANBEGokAAuPAQEBfyMAQRBrIgMkAAJAAkACQCACKAIEQY+AwP8HcUEIRg0AIANBCGogAUG2ARB0DAELAkAgAigCACICRQ0AIAIoAgBBgICA+ABxQYCAgNAARg0CCyADQQhqIAFBtwEQdAtBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAFBCCACKAIcEKECCyADQRBqJAALrQEBAX8jAEEQayIDJAACQAJAAkAgAigCBEGPgMD/B3FBCEYNACADQQhqIAFBtgEQdAwBCwJAIAIoAgAiAkUNACACKAIAQYCAgPgAcUGAgIDQAEYNAgsgA0EIaiABQbcBEHQLQQAhAgsCQAJAIAINACAAQgA3AwAMAQtBACEBAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLwEQQQ92IQELIAAgARCgAgsgA0EQaiQAC7oBAQF/IwBBEGsiAyQAAkACQAJAIAIoAgRBj4DA/wdxQQhGDQAgA0EIaiABQbYBEHQMAQsCQCACKAIAIgJFDQAgAigCAEGAgID4AHFBgICA0ABGDQILIANBCGogAUG3ARB0C0EAIQILAkACQCACDQAgAEIANwMADAELAkAgAi0AFEEBcQ0AIAItABVBMEsNACACLgEQQX9KDQAgACACLwEQQYCAAnEQnwIMAQsgAEIANwMACyADQRBqJAALlQEBAX8jAEEQayIDJAAC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KGogAEG1ARB0CyAGIQUgBEUNACABLwEGIQUgAiADKQMANwMIIAYgACAFIAZB7AEgAkEIahBKaiEFCyAAQdwBaiAFIAZrOgAAIAJBMGokAAuSAQICfwF+IwBBIGsiASQAIAEgACkDQCIDNwMAIAEgAzcDEAJAIAAgASABQQxqEN0BIgINACABQRhqIABBrQEQdEEAIQILAkAgASgCDEH//wFHDQAgAUEYaiAAQa4BEHRBACECCwJAIAJFDQAgACACELsBIAAgASgCDCACLwECQf8fcUGAwAByEMcBCyABQSBqJAALhwECAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDdASICDQAgA0EYaiABQa0BEHRBACECCwJAAkAgAg0AIABCADcDAAwBCwJAIAMoAgwiAkH//wFHDQAgAEIANwMADAELIAAgAjYCACAAQQI2AgQLIANBIGokAAtwAgF/AX4jAEEgayIDJAAgAyACKQMAIgQ3AwAgAyAENwMQAkAgASADIANBDGoQ3QEiAg0AIANBGGogAUGtARB0QQAhAgsCQAJAIAINACAAQgA3AwAMAQsgACACLwEANgIAIABBBDYCBAsgA0EgaiQAC20CAX8BfiMAQSBrIgMkACADIAIpAwAiBDcDACADIAQ3AxACQCABIAMgA0EMahDdASICDQAgA0EYaiABQa0BEHRBACECCwJAAkAgAg0AIABCADcDAAwBCyAAIAIvAQJB/x9xEJ8CCyADQSBqJAALiQECAn8BfiMAQSBrIgEkACABIAApA0AiAzcDACABIAM3AxACQCAAIAEgAUEMahDdASICDQAgAUEYaiAAQa0BEHRBACECCwJAIAEoAgxB//8BRw0AIAFBGGogAEGuARB0QQAhAgsCQCACRQ0AIAAgAhC7ASAAIAEoAgwgAi8BAhDHAQsgAUEgaiQAC2kBAn8jAEEQayIDJAACQAJAAkAgAigCBCIEQYCAwP8HcQ0AIARBD3FBAkYNAQsgA0EIaiABQaMBEHQgAEIANwMADAELIAAgASgCoAEgAigCAEEDdGooAgAoAhBBAEcQoAILIANBEGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQjQJFDQAgACADKAIMEJ8CDAELIABCADcDAAsgA0EQ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aiAAQZgBEHQLIARBwABqJAALzAEBBX8jAEEQayIEJAACQAJAIAJBgTxJDQAgBEEIaiAAQZkBEHQMAQsCQAJAIAJBAWoiBSABLwEKTQ0AIAAgBUEKbEEIbSIGQQQgBkEEShsiB0EDdBB6IgZFDQECQCABKAIMIghFDQAgBiAIIAEvAQhBA3QQoQQaCyABIAc7AQogASAGNgIMIAAoAsgBIAYQewsgASgCDCACQQN0aiADKQMANwMAIAEvAQggAksNASABIAU7AQgMAQsgBEEIaiAAQZoBEHQLIARBEGokAAs+AgF/AX4jAEEQayICJAAgAiABQQN0IABqQcgAaikDACIDNwMAIAIgAzcDCCAAIAIQowIhACACQRBqJAAgAAtAAwF/AX4BfCMAQRBrIgIkACACIAFBA3QgAGpByABqKQMAIgM3AwAgAiADNwMIIAAgAhCiAiEEIAJBEGokACAECywBAX8jAEEQayICJAAgAkEIaiABEJ4CIAAoApgBIAIpAwg3AyAgAkEQaiQACywBAX8jAEEQayICJAAgAkEIaiABEJ8CIAAoApgBIAIpAwg3AyAgAkEQaiQACzABAX8jAEEQayICJAAgAkEIaiAAQQggARChAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/AkAgACgCLCIDKAKYAQ0AIAAgAjYCNCAAIAE2AjAPCyADIAIgARECAAskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECELIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVB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ISAIECEgAQ0ADAMLAAsgAy8BDkGBIkcNASADLQADQQFxDQFBACgCvFlBf2ohCCACKAIAIQtBACEBAkADQAJAIAEgCEwNAEEAIQUMAgsCQAJAQbDWACAIIAFqQQJtIgdBDGxqIgkoAgQiCiALTw0AQQEhDCAHQQFqIQEMAQtBACEMAkAgCiALSw0AIAkhBQwBCyAHQX9qIQhBASEMCyAMDQALCyAFRQ0BIAAoAiQiAUUNASADQRBqIQwDQAJAIAEoAgQgAkcNAAJAIAEtAAkiCEUNACABIAhBf2o6AAkLAkAgDCADLQAMIAUvAQgQSCINvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhBwJAAkBBACgCuMABIgsgAUHEAGooAgAiCGtBAEgNACABQShqIgsgASsDGCAIIAdruKIgCysDAKA5AwAMAQsgAUEoaiIIIAErAxggCyAHa7iiIAgrAwCgOQMAIAshCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgCuMABIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBDGBEUhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIECEgAygCBBCKBCEIDAELIAxFDQEgCBAhQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtB7DVBvC1BlQJBtgoQgQQAC7oBAQN/QcgAECAiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKAK4wAEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABELsDIgBFDQAgAiAAKAIEEIoENgIM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DQAgBSAEIAMQuQRFDQILIAEoAgAiAQ0ACwsCQCABDQBByAAQICIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQQAoArjAASIGNgJAAkAgASgCECIFDQACQAJAIAAtABJFDQAgAEEoaiEFIAAoAigNASAFQYgnNgIADAELIABBDGohBQsgBSgCACEFCyABIAUgBmo2AkQgAUGWJhCZAiABIAMQICIFNgIMIAUgBCACEKEEGgsgAQs7AQF/QQBBoM4AEOkDIgE2AqC9ASABQQE6ABIgASAANgIgIAFB4NQDNgIMIAFBgQI7ARBBxwAgARC9AwvKAgEDfwJAQQAoAqC9ASICRQ0AIAIgACAAEMcEEJsCIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoArjAASIEIABBxABqKAIAIgJrQQBIDQAgAEEoaiIEIAArAxggAiADa7iiIAQrAwCgOQMADAELIABBKGoiAiAAKwMYIAQgA2u4oiACKwMAoDkDACAEIQILIAAgAjYCFAJAIABBOGorAwAgAWNFDQAgACABOQM4CwJAIABBMGorAwAgAWRFDQAgACABOQMwCyAAIAE5AxgLC8YCAgJ+BH8CQAJAAkACQCABEJ8EDgQAAQICAwsgAEICNwMADwsCQCABRAAAAAAAAAAAZEUNACAAQsIANwMADwsgAELDADcDAA8LIABCgICAgHA3AwAPCwJAIAG9IgJCIIgiAyAChKcNACAAQoCAgIBwNwMADwsCQCADpyIEQRR2Qf8PcSIFQf8HSQ0AIAKnIQYCQAJAIAVBkwhLDQAgBg0CAkAgBUGTCEYNACAEQf//P3EgBUGNeGp0DQMLIARB//8/cUGAgMAAckGTCCAFa3YhBQwBCwJAIAVBnghJDQAgBg0CIARBgICAj3xHDQIgAEKAgICAeDcDAA8LIAYgBUHtd2oiB3QNASAEQf//P3FBgIDAAHIgB3QgBkGzCCAFa3ZyIQULIABBfzYCBCAAIAVBACAFayACQn9VGzYCAA8LIAAgATkDAAsQACAAIAE2AgAgAEF/NgIECw8AIABCwABCASABGzcDAAs7AAJAIAMNACAAQgA3AwAPCwJAIAJBCHFFDQAgACADNgIAIAAgAjYCBA8LQfA9QdEtQdsAQf8UEIEEAAuDAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAAkAgAw0AAkACQAJAAkAgASgCACIBQUBqDgQABQECAwtEAAAAAAAA8D8hBAwFC0QAAAAAAADwfyEEDAQLRAAAAAAAAPD/IQQMAwtEAAAAAAAAAAAhBCABQQJPDQEMAgsgAiABKQMANwMQIAAgAkEQahCLAkUNACACIAEpAwA3AwggACACQQhqIAJBHGoQjQIiASACQRhqENcEIQQgASACKAIYRw0BC0QAAAAAAAD4fyEECyACQSBqJAAgBAvPAQIBfwF8IwBBEGsiAiQAAkACQAJAAkAgASgCBEEBag4CAAECCyABKAIAIQEMAgsgASgCAEE/SyEBDAELIAIgASkDADcDCEEAIQEgACACQQhqEKICIgO9Qv///////////wCDQoCAgICAgID4/wBWDQACQCADnUQAAAAAAADwQRCmBCIDRAAAAAAAAPBBoCADIANEAAAAAAAAAABjGyIDRAAAAAAAAPBBYyADRAAAAAAAAAAAZnFFDQAgA6shAQwBC0EAIQELIAJBEGokACABC04AAkACQAJAIAEoAgRBAWoOAgABAgsgASgCAEEARw8LIAEoAgBBP0sPCwJAIAFBBmovAQBB8P8BcQ0AQQAPCyABKwMARAAAAAAAAAAAYQtrAQJ/QQAhAgJAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGw4JAAMDAwIDAwMBAwsgASgCAEHBAEYPCyABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAKEYPCyABKAIAQYCAAUkhAgsgAgt5AQJ/QQAhAgJAAkACQAJAQRAgASgCBCIDQQ9xIANBgIDA/wdxGyIDDgkAAwMDAgMDAwEDCyABKAIAQcEARiECDAILIAEoAgAiAUUNASABKAIAQYCAgPgAcUGAgIAoRiECDAELIAEoAgBBgIABSSECCyACIANBBEdxC/UBAQJ/AkACQAJAAkACQEEQIAEoAgQiA0EPcSADQYCAwP8HcRsiBA4JAAQEBAIEBAQBBAsgASgCAEHBAEYhAwwCCyABKAIAIgNFDQIgAygCAEGAgID4AHFBgICAKEYhAwwBCyABKAIAQYCAAUkhAwsgA0UNAAJAAkACQAJAIAQOCQACAgIDAgICAQILAkAgAkUNACACIABB3AFqLQAANgIACyAAQeABag8LIAEoAgAhAQJAIAJFDQAgAiABLwEENgIACyABQQxqDwtB0S1B0QFB/S8Q/AMACyAAIAEoAgAgAhC0Ag8LQZw7QdEtQb4BQf0vEIEEAAvmAQECfyMAQSBrIgMkAAJAAkACQAJAAkACQEEQIAEoAgQiBEEPcSAEQYCAwP8HcRsOCQAEBAQCBAQEAQQLIAEoAgBBwQBGIQQMAgsgASgCACIERQ0CIAQoAgBBgICA+ABxQYCAgChGIQQMAQsgASgCAEGAgAFJIQQLIARFDQAgAyABKQMANwMYIAAgA0EYaiACEKcCIQEMAQsgAyABKQMANwMQAkAgACADQRBqEIsCRQ0AIAMgASkDADcDCCAAIANBCGogAhCNAiEBDAELQQAhASACRQ0AIAJBADYCAAsgA0EgaiQAIAELIwBBACABKAIAQQAgASgCBCIBQQ9xQQhGGyABQYCAwP8HcRsLRQECf0EAIQICQCABKAIEIgNBgIDA/wdxDQAgA0EPcUEIRw0AIAEoAgAiAUUNACABKAIAQYCAgPgAcUGAgIAYRiECCyACC7ADAQN/IwBBEGsiAiQAQQEhAwJAAkAgASgCBCIEQX9GDQBBASEDAkACQAJAAkACQAJAAkACQAJAQRAgBEEPcSABQQZqLwEAQfD/AXEbDhEAAQYCBAIFBwMCAgcHBwcHCQcLAkACQAJAAkAgASgCACIDDkQMAAIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAECAgMLQQYhAwwLC0EEIQMMCgtBASEDDAkLIANBoH9qIQFBAiEDIAFBG0kNCEHRLUGGAkHrHRD8AwALQQchAwwHC0EIIQMMBgsCQAJAIAEoAgAiAw0AQX0hAwwBCyADLQADQQ9xQX1qIQMLIANBCEkNBAwGC0EEQQkgASgCAEGAgAFJGyEDDAQLIAIgASkDADcDCEEIQQIgACACQQhqQQAQ3QEvAQJBgCBJGyEDDAMLQQUhAwwCC0HRLUGtAkHrHRD8AwALQd8BIANB/wFxdkEBcUUNASADQQJ0QejOAGooAgAhAwsgAkEQaiQAIAMPC0HRLUGgAkHrHRD8AwALEQAgACgCBEUgACgCAEEDSXEL8AECAn8CfiMAQcAAayIDJAACQAJAIAEoAgQNACABKAIAQQJHDQAgAigCBA0AQQAhBCACKAIAQQJGDQELIAMgAikDACIFNwMwIAMgASkDACIGNwMoQQEhBCAGIAVRDQAgAyADKQMoNwMgQQAhBCAAIANBIGoQiwJFDQAgAyADKQMwNwMYIAAgA0EYahCLAkUNACADIAMpAyg3AxAgACADQRBqIANBPGoQjQIhASADIAMpAzA3AwggACADQQhqIANBOGoQjQIhAkEAIQQgAygCPCIAIAMoAjhHDQAgASACIAAQuQRFIQQLIANBwABqJAAgBAuLAQEBf0EAIQICQCABQf//A0sNAEHsACECAkACQAJAAkACQAJAAkAgAUEOdg4EAwYAAQILIAAoAgBBxABqIQJBASEADAQLIAAoAgBBzABqIQIMAgtBlSpBOUGGGxD8AwALIAAoAgBB1ABqIQILQQMhAAsgAigCACAAdiECCyABQf//AHEgAkkhAgsgAgtcAQF/IwBBIGsiASQAIAFBFGogACgACCIAQf//A3E2AgAgAUEQaiAAQRB2Qf8BcTYCACABQQA2AgggAUKCgICAEDcDACABIABBGHY2AgxBzSggARAtIAFBIGokAAvbGAIMfwF+IwBB8ANrIgIkAAJAAkACQCAAQQNxDQACQCABQegATQ0AIAIgADYC6AMCQAJAIAAoAgBBxMrZmwVHDQAgACgCBEGK/KnTeUYNAQsgAkLoBzcD0ANBygkgAkHQA2oQLUGYeCEDDAQLAkAgACgCCEGAgHhxQYCAgBBGDQBBsRxBABAtIAJBxANqIAAoAAgiAEH//wNxNgIAIAJBsANqQRBqIABBEHZB/wFxNgIAIAJBADYCuAMgAkKCgICAEDcDsAMgAiAAQRh2NgK8A0HNKCACQbADahAtIAJCmgg3A6ADQcoJIAJBoANqEC1B5nchAwwECyAAQSBqIQRBACEFQQEhBgNAAkACQAJAIAQoAgAiAyABTQ0AQZd4IQNB6QchBQwBCwJAIAQoAgQiByADaiABTQ0AQZZ4IQNB6gchBQwBCwJAIANBA3FFDQBBlXghA0HrByEFDAELAkAgB0EDcUUNAEGUeCEDQewHIQUMAQsgBUUNASAEQXhqIgcoAgQgBygCAGogA0YNAUGOeCEDQfIHIQULIAIgBTYCkAMgAiAEIABrNgKUA0HKCSACQZADahAtDAQLIAVBCEkhBiAEQQhqIQQgBUEBaiIFQQlHDQAMAwsAC0GzO0GVKkHHAEGkCBCBBAALQe04QZUqQcYAQaQIEIEEAAsgBkEBcQ0AAkAgAC0ANEEHcUUNACACQvOHgICABjcDgANBygkgAkGAA2oQLUGNeCEDDAELAkACQCAAIAAoAjBqIgQgACgCNGogBE0NAANAQQshBQJAIAQpAwAiDkL/////b1YNAAJAAkAgDkL///////////8Ag0KAgICAgICA+P8AWA0AQe13IQNBkwghBQwBCyACQeADaiAOvxCeAkEAIQUgAikD4AMgDlENAUHsdyEDQZQIIQULIAJBMDYC9AIgAiAFNgLwAkHKCSACQfACahAtQQEhBQsCQCAFDgwAAwMDAwMDAwMDAwADCyAAIAAoAjBqIAAoAjRqIARBCGoiBEsNAAsLQQkhBQsgBUEJRw0AAkAgACgCJEGA6jBJDQAgAkKjiICAgAY3A+ACQcoJIAJB4AJqEC1B3XchAwwBCyAAIAAoAiBqIgQgACgCJGoiBSAESyEHQTAhCAJAIAUgBE0NAEEwIQgCQAJAIAQvAQggBC0ACkkNACAAKAIoIQYDQAJAIAQiBSgCACIEIAFNDQAgAkHpBzYC0AEgAiAFIABrIgg2AtQBQcoJIAJB0AFqEC1Bl3ghAwwECwJAIAUoAgQiCSAEaiIIIAFNDQAgAkHqBzYC4AEgAiAFIABrIgg2AuQBQcoJIAJB4AFqEC1BlnghAwwECwJAIARBA3FFDQAgAkHrBzYC0AIgAiAFIABrIgg2AtQCQcoJIAJB0AJqEC1BlXghAwwECwJAIAlBA3FFDQAgAkHsBzYCwAIgAiAFIABrIgg2AsQCQcoJIAJBwAJqEC1BlHghAwwECwJAAkAgACgCKCIKIARLDQAgBCAAKAIsIApqIgtNDQELIAJB/Qc2AvABIAIgBSAAayIINgL0AUHKCSACQfABahAtQYN4IQMMBAsCQAJAIAogCEsNACAIIAtNDQELIAJB/Qc2AoACIAIgBSAAayIINgKEAkHKCSACQYACahAtQYN4IQMMBAsCQCAEIAZGDQAgAkH8BzYCsAIgAiAFIABrIgg2ArQCQcoJIAJBsAJqEC1BhHghAwwECwJAIAkgBmoiBkGAgARJDQAgAkGbCDYCoAIgAiAFIABrIgg2AqQCQcoJIAJBoAJqEC1B5XchAwwECyAFLwEMIQQgAiACKALoAzYCnAICQCACQZwCaiAEEK4CDQAgAkGcCDYCkAIgAiAFIABrIgg2ApQCQcoJIAJBkAJqEC1B5HchAwwECyAAIAAoAiBqIAAoAiRqIgkgBUEQaiIESyEHIAkgBE0NAiAFQRhqLwEAIAVBGmotAABPDQALIAUgAGshCAsgAiAINgLEASACQaYINgLAAUHKCSACQcABahAtQdp3IQMMAQsgBSAAayEICyAHQQFxDQACQCAAKAJcIgUgACAAKAJYaiIEakF/ai0AAEUNACACIAg2ArQBIAJBowg2ArABQcoJIAJBsAFqEC1B3XchAwwBCwJAIAAoAkwiB0EBSA0AIAAgACgCSGoiASAHaiEGA0ACQCABKAIAIgcgBUkNACACIAg2AqQBIAJBpAg2AqABQcoJIAJBoAFqEC1B3HchAwwDCwJAIAEoAgQgB2oiByAFSQ0AIAIgCDYClAEgAkGdCDYCkAFBygkgAkGQAWoQLUHjdyEDDAMLAkAgBCAHai0AAA0AIAYgAUEIaiIBTQ0CDAELCyACIAg2AoQBIAJBngg2AoABQcoJIAJBgAFqEC1B4nchAwwBCwJAIAAoAlQiB0EBSA0AIAAgACgCUGoiASAHaiEGA0ACQCABKAIAIgcgBUkNACACIAg2AnQgAkGfCDYCcEHKCSACQfAAahAtQeF3IQMMAwsCQCABKAIEIAdqIAVPDQAgBiABQQhqIgFNDQIMAQsLIAIgCDYCZCACQaAINgJgQcoJIAJB4ABqEC1B4HchAwwBCwJAAkAgACAAKAJAaiIKIAAoAkRqIApLDQBBFSEGDAELA0AgCi8BACIFIQECQCAAKAJcIgkgBUsNACACIAg2AlQgAkGhCDYCUEHKCSACQdAAahAtQd93IQNBASEGDAILAkADQAJAIAEgBWtByAFJIgcNACACIAg2AkQgAkGiCDYCQEHKCSACQcAAahAtQd53IQNBASEGDAILQRghBiAEIAFqLQAARQ0BIAFBAWoiASAJSQ0ACwsgB0UNASAAIAAoAkBqIAAoAkRqIApBAmoiCksNAAtBFSEGCyAGQRVHDQAgACAAKAI4aiIBIAAoAjxqIgQgAUshBQJAIAQgAU0NAANAAkACQAJAIAEoAgBBHHZBf2pBAU0NAEHwdyEDQZAIIQQMAQsgAS8BBCEHIAIgAigC6AM2AjxBASEEIAJBPGogBxCuAg0BQe53IQNBkgghBAsgAiABIABrNgI0IAIgBDYCMEHKCSACQTBqEC1BACEECyAERQ0BIAAgACgCOGogACgCPGoiBCABQQhqIgFLIQUgBCABSw0ACwsgBUEBcQ0AAkACQCAALwEODQBBHiEFDAELIAAgACgCYGohB0EAIQEDQAJAAkACQCAAIAAoAmBqIAAoAmQiBWogByABQQR0aiIEQRBqSw0AQc53IQNBsgghBQwBCwJAAkACQCABDgIAAQILAkAgBCgCBEHz////AUYNAEHZdyEDQacIIQUMAwsgAUEBRw0BCyAEKAIEQfL///8BRg0AQdh3IQNBqAghBQwBCwJAIAQvAQpBAnQiBiAFSQ0AQdd3IQNBqQghBQwBCwJAIAQvAQhBA3QgBmogBU0NAEHWdyEDQaoIIQUMAQsgBC8BACEFIAIgAigC6AM2AiwCQCACQSxqIAUQrgINAEHVdyEDQasIIQUMAQsCQCAELQACQQ5xRQ0AQdR3IQNBrAghBQwBC0EAIQUCQAJAIARBCGoiCy8BAEUNACAHIAZqIQxBACEGDAELQQEhBAwCCwJAA0AgDCAGQQN0aiIELwEAIQkgAiACKALoAzYCKCAEIABrIQgCQAJAIAJBKGogCRCuAg0AIAIgCDYCJCACQa0INgIgQcoJIAJBIGoQLUHTdyEJQQAhBAwBCwJAAkAgBC0ABEEBcQ0AIAMhCQwBCwJAAkACQCAELwEGQQJ0IgRBBGogACgCZEkNAEHSdyEJQa4IIQ0MAQtBz3chCUGxCCENIAAgACgCYGogACgCZGogByAEaiIETQ0AA0ACQCAELwEAIgoNAEHRdyEJQa8IIQ0gBC0AAg0CIAQtAAMNAkEBIQggAyEJDAMLIAIgAigC6AM2AhwCQCACQRxqIAoQrgINAEHQdyEJQbAIIQ0MAgsgACAAKAJgaiAAKAJkaiAEQQRqIgRLDQALCyACIAg2AhQgAiANNgIQQcoJIAJBEGoQLUEAIQgLQQAhBCAIRQ0BC0EBIQQLAkAgBEUNACAJIQMgBkEBaiIGIAsvAQBPDQIMAQsLQQEhBQsgCSEDDAELIAIgBCAAazYCBCACIAU2AgBBygkgAhAtQQEhBUEAIQQLIARFDQEgAUEBaiIBIAAvAQ5JDQALQR4hBQtBACADIAVBHkYbIQMLIAJB8ANqJAAgAwulBQILfwF+IwBBEGsiASQAAkAgACgClAEiAkUNAEGAgAghAwJAA0AgA0F/aiIDRQ0BAkACQCACLwEEIgQgAi8BBk8NACAAKAKQASEFIAIgBEEBajsBBCAFIARqLQAAIQQMAQsgAUEIaiAAQe4AEHRBACEECyAEQf8BcSEGAkACQCAEQRh0QRh1QX9KDQAgASAGQfB+ahCfAgJAIAAtADIiAkEKSQ0AIAFBCGogAEHtABB0DAILIAEpAwAhDCAAIAJBAWo6ADIgACACQQN0akHAAGogDDcDAAwBCwJAIAZB2wBJDQAgAUEIaiAAQfoAEHQMAQsCQCAGQcDSAGotAAAiB0EgcUUNACAAIAIvAQQiBEF/ajsBMAJAAkAgBCACLwEGTw0AIAAoApABIQUgAiAEQQFqOwEEIAUgBGotAAAhBAwBCyABQQhqIABB7gAQdEEAIQQLAkAgBEH/AXEiCEH4AUkNACAIQQNxIQlBACEEQQAhBQNAAkACQCACLwEEIgogAi8BBk8NACAAKAKQASELIAIgCkEBajsBBCALIApqLQAAIQoMAQsgAUEIaiAAQe4AEHRBACEKCyAFQQh0IApB/wFxciEFIAQgCUYhCiAEQQFqIQQgCkUNAAtBACAFayAFIAhBBHEbIQgLIAAgCDYCOAsgACAALQAyOgAzAkAgB0EQcUUNACACIABBoK4BIAZBAnRqKAIAEQIAIAAtADJFDQEgAUEIaiAAQYcBEHQMAQsgASACIABBoK4BIAZBAnRqKAIAEQEAAkAgAC0AMiICQQpJDQAgAUEIaiAAQe0AEHQMAQsgASkDACEMIAAgAkEBajoAMiAAIAJBA3RqQcAAaiAMNwMACyAAKAKUASICDQAMAgsACyAAQeHUAxBmCyABQRBqJAALJAEBf0EAIQECQCAAQesASw0AIABBAnRBkM8AaigCACEBCyABC7ECAQJ/IwBBEGsiAyQAIAMgACgCADYCDAJAAkAgA0EMaiABEK4CDQBBACEBIAJFDQEgAkEANgIADAELIAFB//8AcSEEAkACQAJAAkACQAJAIAFBDnZBA3EOBAECAwABCyAAKAIAIgEgASgCSGogBEEDdGohBEEAIQEMBAsgACgCACIBIAEoAlBqIARBA3RqIQRBACEBDAMLIARBAnRBkM8AaigCACEBDAELIAAoAgAiASABKAJYaiABIAEoAkBqIARBAXRqLwEAaiEBC0EAIQQLAkAgBEUNAAJAIAJFDQAgAiAEKAIENgIACyAAKAIAIgEgASgCWGogBCgCAGohAQwBCwJAIAFFDQAgAkUNASACIAEQxwQ2AgAMAQtBrCxBiAFB7jQQ/AMACyADQRBqJAAgAQtGAQF/IwBBEGsiAyQAIAMgACgCkAE2AgQCQCADQQRqIAEgAhCzAiIBDQAgA0EIaiAAQYwBEHRBysAAIQELIANBEGokACABCzsBAX8jAEEQayICJAACQCAAKACQAUE8aigCAEEDdiABSyIBDQAgAkEIaiAAQe8AEHQLIAJBEGokACABCwsAIAAgAkHoABB0C1IBAn8CQCACKAI4IgNBG0kNACAAQgA3AwAPCwJAIAIgAxDcASIEQcDFAGtBDG1BGksNACAAQQA2AgQgACADQeAAajYCAA8LIAAgAkEIIAQQoQILMQACQCABLQAyQQFGDQBB1DVBkCtB7wBBiTMQgQQACyABQQA6ADIgASgCmAFBABBlGgsxAAJAIAEtADJBAkYNAEHUNUGQK0HvAEGJMxCBBAALIAFBADoAMiABKAKYAUEBEGUaCzEAAkAgAS0AMkEDRg0AQdQ1QZArQe8AQYkzEIEEAAsgAUEAOgAyIAEoApgBQQIQZRoLMQACQCABLQAyQQRGDQBB1DVBkCtB7wBBiTMQgQQACyABQQA6ADIgASgCmAFBAxBlGgsxAAJAIAEtADJBBUYNAEHUNUGQK0HvAEGJMxCBBAALIAFBADoAMiABKAKYAUEEEGUaCzEAAkAgAS0AMkEGRg0AQdQ1QZArQe8AQYkzEIEEAAsgAUEAOgAyIAEoApgBQQUQZRoLMQACQCABLQAyQQdGDQBB1DVBkCtB7wBBiTMQgQQACyABQQA6ADIgASgCmAFBBhBlGgsxAAJAIAEtADJBCEYNAEHUNUGQK0HvAEGJMxCBBAALIAFBADoAMiABKAKYAUEHEGUaCzEAAkAgAS0AMkEJRg0AQdQ1QZArQe8AQYkzEIEEAAsgAUEAOgAyIAEoApgBQQgQZRoLcQEGfyMAQRBrIgMkACACEJIDIQQgAiADQQxqQQIQlQMhBUEAIQYCQCAEIAMoAgwiB2oiCEEBaiACQdwBai0AAEsNACACQeABaiICIAhqLQAADQAgAiAEaiAFIAcQuQRFIQYLIAAgBhCgAiADQRBqJAALNgECfyMAQRBrIgIkACABKAKYASEDIAJBCGogARCRAyADIAIpAwg3AyAgAyAAEGkgAkEQaiQAC1EBAn8jAEEQayICJAACQAJAIAAoAhAoAgAgASgCOCABLwEwaiIDSg0AIAMgAC8BBk4NACAAIAM7AQQMAQsgAkEIaiABQfQAEHQLIAJBEGokAAt1AQN/IwBBIGsiAiQAIAJBGGogARCRAyACIAIpAxg3AwggASACQQhqEKQCIQMCQAJAIAAoAhAoAgAgASgCOCABLwEwaiIESg0AIAQgAC8BBk4NACADDQEgACAEOwEEDAELIAJBEGogAUH1ABB0CyACQSBqJAALCwAgASABEJIDEGYLKgACQCACQdMBai0AAEEBcUUNACAAIAJB3gFqLwEAEJ8CDwsgAEIANwMAC1QBAn8jAEEQayICJAAgAkEIaiABEJEDAkACQCABKAI4IgMgACgCEC8BCEkNACACIAFB9gAQdAwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtVAQJ/IwBBEGsiAiQAIAJBCGogARCRAwJAAkAgASgCOCIDIAEoApABLwEMSQ0AIAIgAUH4ABB0DAELIAEoAgAgA0EDdGogAikDCDcDAAsgAkEQaiQAC1YBA38jAEEgayICJAAgAkEYaiABEJEDIAEQkgMhAyABEJIDIQQgAkEQaiABQQEQlAMgAiACKQMQNwMAIAJBCGogASAEIAMgAiACQRhqEEcgAkEgaiQAC00AAkAgAkHTAWotAABBAXENACACQd0Bai0AAEEwSw0AIAJB3gFqIgIvAQBBgOADcUGAIEcNACAAIAIvAQBB/x9xEJ8CDwsgAEIANwMACzYBAX8CQCACKAI4IgMgASgCEC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB6QAQdAs3AQF/AkAgAigCOCIDIAIoApABLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkHqABB0CykAAkAgAkHTAWotAABBAXENACAAIAJB3gFqLwEAEJ8CDwsgAEIANwMAC0oBAX8jAEEgayIDJAAgA0EYaiACEJEDIANBEGogAhCRAyADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQ6wEgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEJEDIAJBIGogARCRAyACQRhqIAEQkQMgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhDsASACQTBqJAALwgEBAn8jAEHAAGsiAyQAIANBIGogAhCRAyADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAFyIQQCQAJAIARBfyADQRxqIAQQrgIbIgRBf0oNACADQThqIAJB8AAQdCADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqEOkBCyADQcAAaiQAC8IBAQJ/IwBBwABrIgMkACADQSBqIAIQkQMgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIACciEEAkACQCAEQX8gA0EcaiAEEK4CGyIEQX9KDQAgA0E4aiACQfAAEHQgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDpAQsgA0HAAGokAAvCAQECfyMAQcAAayIDJAAgA0EgaiACEJEDIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAA3IhBAJAAkAgBEF/IANBHGogBBCuAhsiBEF/Sg0AIANBOGogAkHwABB0IANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ6QELIANBwABqJAALjAEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQrgIbIgRBf0oNACADQRhqIAJB8AAQdCADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsgAkEAENwBIQQgAyADKQMQNwMAIAAgAiAEIAMQ6AEgA0EgaiQAC4wBAQJ/IwBBIGsiAyQAIAIoAjghBCADIAIoApABNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEEK4CGyIEQX9KDQAgA0EYaiACQfAAEHQgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBFRDcASEEIAMgAykDEDcDACAAIAIgBCADEOgBIANBIGokAAtFAQN/IwBBEGsiAiQAAkAgARB/IgMNACABQRAQUgsgASgCmAEhBCACQQhqIAFBCCADEKECIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARCSAyIDEIABIgQNACABIANBA3RBEGoQUgsgASgCmAEhAyACQQhqIAFBCCAEEKECIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARCSAyIDEIEBIgQNACABIANBDGoQUgsgASgCmAEhAyACQQhqIAFBCCAEEKECIAMgAikDCDcDICACQRBqJAALVgECfyMAQRBrIgMkAAJAAkAgAigAkAFBPGooAgBBA3YgAigCOCIESw0AIANBCGogAkHvABB0IABCADcDAAwBCyAAIAQ2AgAgAEECNgIECyADQRBqJAALZQECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBAJAAkAgBEF/IANBBGogBBCuAhsiBEF/Sg0AIANBCGogAkHwABB0IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAXIhBAJAAkAgBEF/IANBBGogBBCuAhsiBEF/Sg0AIANBCGogAkHwABB0IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBCuAhsiBEF/Sg0AIANBCGogAkHwABB0IABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbgECfyMAQRBrIgMkACACKAI4IQQg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aiQAC5wBAQJ/IwBBMGsiAiQAIAJBKGogARCRAyACQSBqIAEQkQMgASgCmAFBACkDyE43AyAgAiACKQMoNwMQAkAgASACQRBqEIsCDQAgAkEYaiABQawBEHQLIAIgAikDIDcDCAJAIAEgAkEIahDkASIDRQ0AIAIgAikDKDcDACABIAMgAhDbAQ0AIAEoApgBQQApA8BONwMgCyACQTBqJAALPgEBfwJAIAEtADIiAg0AIAAgAUHsABB0DwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akHAAGopAwA3AwALagECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHQMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akHAAGopAwA3AwgLIAEgASkDCDcDACAAIAEQowIhACABQRBqJAAgAAtqAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQdAwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQcAAaikDADcDCAsgASABKQMINwMAIAAgARCjAiEAIAFBEGokACAAC+8BAQJ/IwBBMGsiAyQAAkACQCABLQAyIgQNACADQShqIAFB7AAQdAwBCyABIARBf2oiBDoAMiADIAEgBEH/AXFBA3RqQcAAaikDADcDKAsgAyADKQMoNwMYAkACQCABIANBGGoQpQINAAJAIAJBAnFFDQAgAyADKQMoNwMQIAEgA0EQahCLAg0BCyADQSBqIAFB/QAQdCAAQQApA9BONwMADAELAkAgAkEBcUUNACADIAMpAyg3AwggASADQQhqEKYCDQAgA0EgaiABQZQBEHQgAEEAKQPQTjcDAAwBCyAAIAMpAyg3AwALIANBMGokAAt2AQF/IwBBIGsiAyQAIANBGGogACACEJQDAkACQCACQQJxRQ0AIAMgAykDGDcDECAAIANBEGoQiwJFDQAgAyADKQMYNwMIIAAgA0EIaiABEI0CIQAMAQsgAyADKQMYNwMAIAAgAyABEKcCIQALIANBIGokACAAC5ABAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQdAwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQcAAaikDADcDCAsCQAJAAkAgASgCDCICQYCAwP8HcQ0A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IAFBAWoiAUEALQCUwAFJDQALCwsCAAsCAAtmAQF/AkBBAC0AlMABQSBJDQBBpitBrgFBxyMQ/AMACyAALwEEECAiASAANgIAIAFBAC0AlMABIgA6AARBAEH/AToAlcABQQAgAEEBajoAlMABQQAoApjAASAAQQJ0aiABNgIAIAELhgIBBH8jAEGAAWsiACQAQQBBADoAlMABQQAgADYCmMABQQAQNKciATYCoLgBAkACQCABQQAoAqjAASICayIDQf//AEsNACADQekHSQ0BQQBBACkDsMABIAEgAmtBl3hqIgNB6AduIgJBAWqtfDcDsMABIAMgAkHoB2xrQQFqIQMMAQtBAEEAKQOwwAEgA0HoB24iAq18NwOwwAEgAyACQegHbGshAwtBACABIANrNgKowAFBAEEAKQOwwAE+ArjAARDJAxA2QQBBADoAlcABQQBBAC0AlMABQQJ0ECAiAzYCmMABIAMgAEEALQCUwAFBAnQQoQQaQQAQND4CnMABIABBgAFqJAALpAEBA39BABA0pyIANgKguAECQAJAIABBACgCqMABIgFrIgJB//8ASw0AIAJB6QdJDQFBAEEAKQOwwAEgACABa0GXeGoiAkHoB24iAa18QgF8NwOwwAEgAiABQegHbGtBAWohAgwBC0EAQQApA7DAASACQegHbiIBrXw3A7DAASACIAFB6AdsayECC0EAIAAgAms2AqjAAUEAQQApA7DAAT4CuMABCxMAQQBBAC0AoMABQQFqOgCgwAELvgEBBn8jACIAIQEQH0EAIQIgAEEALQCUwAEiA0ECdEEPakHwD3FrIgQkAAJAIANFDQBBACgCmMABIQUDQCAEIAJBAnQiAGogBSAAaigCACgCACgCADYCACACQQFqIgIgA0cNAAsLAkBBAC0AocABIgJBD08NAEEAIAJBAWo6AKHAAQsgBEEALQCgwAFBEHRBAC0AocABckGAngRqNgIAAkBBAEEAIAQgA0ECdBCZBA0AQQBBADoAoMABCyABJAALJQEBf0EBIQECQCAALQADQQVxQQFHDQAgACkCBBD1A1EhAQsgAQvWAQECfwJAQaTAAUGgwh4Q/gNFDQAQ7QMLAkACQEEAKAKcwAEiAEUNAEEAKAKguAEgAGtBgICAf2pBAEgNAQtBAEEANgKcwAFBkQIQHgtBACgCmMABKAIAIgAg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AUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEKEEIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDHBGpBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDHBGpBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0gCSICdkEPcSIJDQAgAkUNAEEAIQwgAUUNAQsgByABaiAJQTdqIAlBMHIgCUEJSxs6AAAgAUEBaiEMCyACQXxqIQkgDCEBIAINAAsgByAMakEAOgAAIANBBGohAwwFCyAEQbDwATsBACADKAIAIQ1BHCEJ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gIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALtQQCBH4CfwJAAkAgAb0iAkIBhiIDUA0AIAJC////////////AINCgICAgICAgPj/AFYNACAAvSIEQjSIp0H/D3EiBkH/D0cNAQsgACABoiIBIAGjDwsCQCAEQgGGIgUgA1YNACAARAAAAAAAAAAAoiAAIAUgA1EbDwsgAkI0iKdB/w9xIQcCQAJAIAYNAEEAIQYCQCAEQgyGIgNCAFMNAANAIAZBf2ohBiADQgGGIgNCf1UNAAsLIARBASAGa62GIQMMAQsgBEL/////////B4NCgICAgICAgAiEIQMLAkACQCAHDQBBACEHAkAgAkIMhiIFQgBTDQADQCAHQX9qIQcgBUIBhiIFQn9VDQALCyACQQEgB2uthiECDAELIAJC/////////weDQoCAgICAgIAIhCECCwJAIAYgB0wNAANAAkACQCADIAJ9IgVCAFkNACADIQUMAQsgAyACUg0AIABEAAAAAAAAAACiDwsgBUIBhiEDIAZBf2oiBiAHSg0ACyAHIQYLAkACQCADIAJ9IgVCAFkNACADIQUMAQsgAyACUg0AIABEAAAAAAAAAACiDwsCQAJAIAVC/////////wdYDQAgBSEDDAELA0AgBkF/aiEGIAVCgICAgICAgARUIQcgBUIBhiIDIQUgBw0ACwsgBEKAgICAgICAgIB/gyEFAkACQCAGQQFIDQAgA0KAgICAgICAeHwgBq1CNIaEIQMMAQsgA0EBIAZrrYghAwsgAyAFhL8LDgAgACgCPCABIAIQuAQL2AIBB38jAEEgayIDJAAgAyAAKAIcIgQ2AhAgACgCFCEFIAMgAjYCHCADIAE2AhggAyAFIARrIgE2AhQgASACaiEGQQIhByADQRBqIQECQAJAAkACQCAAKAI8IANBEGpBAiADQQxqEBIQ2AQNAANAIAYgAygCDCIERg0CIARBf0wNAyABIAQgASgCBCIISyIFQQN0aiIJIAkoAgAgBCAIQQAgBRtrIghqNgIAIAFBDEEEIAUbaiIJIAkoAgAgCGs2AgAgBiAEayEGIAAoAjwgAUEIaiABIAUbIgEgByAFayIHIANBDGoQEhDYBEUNAAsLIAZBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACIQQMAQtBACEEIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAIAdBAkYNACACIAEoAgRrIQQLIANBIGokACAECwwAIAAoAjwQoAQQEAtBAQF/AkAQugQoAgAiAEUNAANAIAAQqwQgACgCOCIADQALC0EAKALcwgEQqwRBACgC2MIBEKsEQQAoAqCyARCrBAtiAQJ/AkAgAEUNAAJAIAAoAkxBAEgNACAAEKQEGgsCQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBEFABoLIAAoAgQiASAAKAIIIgJGDQAgACABIAJrrEEBIAAoAigREAAaCwuBAQECfyAAIAAoAkgiAUF/aiABcjYCSAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQUAGgsgAEEANgIcIABCADcDEAJAIAAoAgAiAUEEcUUNACAAIAFBIHI2AgBBfw8LIAAgACgCLCAAKAIwaiICNgIIIAAgAjYCBCABQRt0QR91C1wBAX8gACAAKAJIIgFBf2ogAXI2AkgCQCAAKAIAIgFBCHFFDQAgACABQSByNgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEAC84BAQN/AkACQCACKAIQIgMNAEEAIQQgAhCtBA0BIAIoAhAhAwsCQCADIAIoAhQiBWsgAU8NACACIAAgASACKAIkEQUADwsCQAJAIAIoAlBBAE4NAEEAIQMMAQsgASEEA0ACQCAEIgMNAEEAIQMMAgsgACADQX9qIgRqLQAAQQpHDQALIAIgACADIAIoAiQRBQAiBCADSQ0BIAAgA2ohACABIANrIQEgAigCFCEFCyAFIAAgARChBBogAiACKAIUIAFqNgIUIAMgAWohBAsgBAtbAQJ/IAIgAWwhBAJAAkAgAygCTEF/Sg0AIAAgBCADEK4EIQAMAQsgAxCkBCEFIAAgBCADEK4EIQAgBUUNACADEKUECwJAIAAgBEcNACACQQAgARsPCyAAIAFuCwIACwQAQQALBABBAAsCAAsyAQF/IwBBEGsiAUQAAAAAAADwv0QAAAAAAADwPyAAGzkDCCABKwMIRAAAAAAAAAAAowsMACAAIAChIgAgAKMLwAQDAn4GfAF/AkAgAL0iAUKAgICAgICAiUB8Qv//////n8IBVg0AAkAgAUKAgICAgICA+D9SDQBEAAAAAAAAAAAPCyAARAAAAAAAAPC/oCIAIAAgAEQAAAAAAACgQaIiA6AgA6EiAyADokEAKwOQWyIEoiIFoCIGIAAgACAAoiIHoiIIIAggCCAIQQArA+BboiAHQQArA9hboiAAQQArA9BbokEAKwPIW6CgoKIgB0EAKwPAW6IgAEEAKwO4W6JBACsDsFugoKCiIAdBACsDqFuiIABBACsDoFuiQQArA5hboKCgoiAAIAOhIASiIAAgA6CiIAUgACAGoaCgoKAPCwJAAkAgAUIwiKciCUGQgH5qQZ+AfksNAAJAIAFC////////////AINCAFINAEEBELQEDwsgAUKAgICAgICA+P8AUQ0BAkACQCAJQYCAAnENACAJQfD/AXFB8P8BRw0BCyAAELUEDwsgAEQAAAAAAAAwQ6K9QoCAgICAgIDgfHwhAQsgAUKAgICAgICAjUB8IgJCNIentyIHQQArA9haoiACQi2Ip0H/AHFBBHQiCUHw2wBqKwMAoCIIIAlB6NsAaisDACABIAJCgICAgICAgHiDfb8gCUHo6wBqKwMAoSAJQfDrAGorAwChoiIAoCIEIAAgACAAoiIDoiADIABBACsDiFuiQQArA4BboKIgAEEAKwP4WqJBACsD8FqgoKIgA0EAKwPoWqIgB0EAKwPgWqIgACAIIAShoKCgoKAhAAsgAAvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB4r4laiICQRR2arciBUQAYJ9QE0TTP6IiBiACQf//P3FBnsGa/wNqrUIghiABQv////8Pg4S/RAAAAAAAAPC/oCIAIAAgAEQAAAAAAADgP6KiIgehvUKAgICAcIO/IghEAAAgFXvL2z+iIgmgIgogCSAGIAqhoCAAIABEAAAAAAAAAECgoyIGIAcg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hhDpBCAAIARBCGopAwA3AwggACAEKQMANwMAIARB0ABqJAALSwIBfgJ/IAFC////////P4MhAgJAAkAgAUIwiKdB//8BcSIDQf//AUYNAEEEIQQgAw0BQQJBAyACIACEUBsPCyACIACEUCEECyAEC9sGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQ3wRFDQAgAyAEEM8EIQYgAkIwiKciB0H//wFxIghB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEOkEIAUgBSkDECIEIAVBEGpBCGopAwAiAyAEIAMQ4QQgBUEIaikDACECIAUpAwAhBAwBCwJAIAEgCK1CMIYgAkL///////8/g4QiCSADIARCMIinQf//AXEiBq1CMIYgBEL///////8/g4QiChDfBEEASg0AAkAgASAJIAMgChDfBEUNACABIQQMAgsgBUHwAGogASACQgBCABDpBCAFQfgAaikDACECIAUpA3AhBAwBCwJAAkAgCEUNACABIQQMAQsgBUHgAGogASAJQgBCgICAgICAwLvAABDpBCAFQegAaikDACIJQjCIp0GIf2ohCCAFKQNgIQQLAkAgBg0AIAVB0ABqIAMgCkIAQoCAgICAgMC7wAAQ6QQgBUHYAGopAwAiCkIwiKdBiH9qIQYgBSkDUCEDCyAKQv///////z+DQoCAgICAgMAAhCELIAlC////////P4NCgICAgICAwACEIQkCQCAIIAZMDQADQAJAAkAgCSALfSAEIANUrX0iCkIAUw0AAkAgCiAEIAN9IgSEQgBSDQAgBUEgaiABIAJCAEIAEOkEIAVBKGopAwAhAiAFKQMgIQQMBQsgCkIBhiAEQj+IhCEJDAELIAlCAYYgBEI/iIQhCQsgBEIBhiEEIAhBf2oiCCAGSg0ACyAGIQgLAkACQCAJIAt9IAQgA1StfSIKQgBZDQAgCSEKDAELIAogBCADfSIEhEIAUg0AIAVBMGogASACQgBCABDpBCAFQThqKQMAIQIgBSkDMCEEDAELAkAgCkL///////8/Vg0AA0AgBEI/iCEDIAhBf2ohCCAEQgGGIQQgAyAKQgGGhCIKQoCAgICAgMAAVA0ACwsgB0GAgAJxIQYCQCAIQQBKDQAgBUHAAGogBCAKQv///////z+DIAhB+ABqIAZyrUIwhoRCAEKAgICAgIDA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wICAf3xCgICAgICAwICAf1QgClAbDQAgA0IAUiAJQoCAgICAgMCAgH98IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsCQCAGIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQQgASEDDAILAkAgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhBAwCCwJAIAEgCkKAgICAgIDA//8AhYRCAFINAEKAgICAgIDg//8AIAIgAyABhSAEIAKFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIAlCgICAgICAwP//AIWEUA0BAkAgASAKhEIAUg0AIAMgCYRCAFINAiADIAGDIQMgBCACgyEEDAILIAMgCYRQRQ0AIAEhAyACIQQMAQsgAyABIAMgAVYgCSAKViAJIApRGyIHGyEKIAQgAiAHGyIJQv///////z+DIQsgAiAEIAcbIgxCMIinQf//AXEhCAJAIAlCMIinQf//AXEiBg0AIAVB4ABqIAogCyAKIAsgC1AiBht5IAZBBnStfKciBkFxahDeBEEQIAZrIQYgBUHoAGopAwAhCyAFKQNgIQoLIAEgAyAHGyEDIAxC////////P4MhBAJAIAgNACAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBcWoQ3gRBECAHayEIIAVB2ABqKQMAIQQgBSkDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCECIAtCA4YgCkI9iIQhBCADQgOGIQEgCSAMhSEDAkAgBiAIRg0AAkAgBiAIayIHQf8ATQ0AQgAhAkIBIQEMAQsgBUHAAGogASACQYABIAdrEN4EIAVBMGogASACIAcQ6AQgBSkDMCAFKQNAIAVBwABqQQhqKQMAhEIAUq2EIQEgBUEwakEIaikDACECCyAEQoCAgICAgIAEhCEMIApCA4YhCwJAAkAgA0J/VQ0AQgAhA0IAIQQgCyABhSAMIAKFhFANAiALIAF9IQogDCACfSALIAFUrX0iBEL/////////A1YNASAFQSBqIAogBCAKIAQgBFAiBxt5IAdBBnStfKdBdGoiBxDeBCAGIAdrIQYgBUEoaikDACEEIAUpAyAhCgwBCyACIAx8IAEgC3wiCiABVK18IgRCgICAgICAgAiDUA0AIApCAYggBEI/hoQgCkIBg4QhCiAGQQFqIQYgBEIBiCEECyAJQoCAgICAgICAgH+DIQECQCAGQf//AUgNACABQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAAkAgBkEATA0AIAYhBwwBCyAFQRBqIAogBCAGQf8AahDeBCAFIAogBEEBIAZrEOgEIAUpAwAgBSkDECAFQRBqQQhqKQMAhEIAUq2EIQogBUEIaikDACEECyAKQgOIIARCPYaEIQMgB61CMIYgBEIDiEL///////8/g4QgAYQhBCAKp0EHcSEGAkACQAJAAkACQBDmBA4DAAECAwsgBCADIAZBBEutfCIKIANUrXwhBAJAIAZBBEYNACAKIQMMAwsgBCAKQgGDIgEgCnwiAyABVK18IQQMAwsgBCADIAFCAFIgBkEAR3GtfCIKIANUrXwhBCAKIQMMAQsgBCADIAFQIAZBAEdxrXwiCiADVK18IQQgCiEDCyAGRQ0BCxDnBBoLIAAgAzcDACAAIAQ3AwggBUHwAGokAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAvgAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNAEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQL2AECAX8CfkF/IQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQACQCACIACEIAYgBYSEUEUNAEEADwsCQCADIAGDQgBTDQAgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvfEAIFfw5+IwBB0AJrIgUkACAEQv///////z+DIQogAkL///////8/gyELIAQgAoVCgICAgICAgICAf4MhDCAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDUKAgICAgIDA//8AVCANQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhDAwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhDCADIQEMAgsCQCABIA1CgICAgICAwP//AIWEQgBSDQACQCADIAJCgICAgICAwP//AIWEUEUNAEIAIQFCgICAgICA4P//ACEMDAMLIAxCgICAgICAwP//AIQhDEIAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQBCACEBDAILAkAgASANhEIAUg0AQoCAgICAgOD//wAgDCADIAKEUBshDEIAIQEMAgsCQCADIAKEQgBSDQAgDEKAgICAgIDA//8AhCEMQgAhAQwCC0EAIQgCQCANQv///////z9WDQAgBUHAAmogASALIAEgCyALUCIIG3kgCEEGdK18pyIIQXFqEN4EQRAgCGshCCAFQcgCaikDACELIAUpA8ACIQELIAJC////////P1YNACAFQbACaiADIAogAyAKIApQIgkbeSAJQQZ0rXynIglBcWoQ3gQgCSAIakFwaiEIIAVBuAJqKQMAIQogBSkDsAIhAwsgBUGgAmogA0IxiCAKQoCAgICAgMAAhCIOQg+GhCICQgBCgICAgLDmvIL1ACACfSIEQgAQ6gQgBUGQAmpCACAFQaACakEIaikDAH1CACAEQgAQ6gQgBUGAAmogBSkDkAJCP4ggBUGQAmpBCGopAwBCAYaEIgRCACACQgAQ6gQgBUHwAWogBEIAQgAgBUGAAmpBCGopAwB9QgAQ6gQgBUHgAWogBSkD8AFCP4ggBUHwAWpBCGopAwBCAYaEIgRCACACQgAQ6gQgBUHQAWogBEIAQgAgBUHgAWpBCGopAwB9QgAQ6gQgBUHAAWogBSkD0AFCP4ggBUHQAWpBCGopAwBCAYaEIgRCACACQgAQ6gQgBUGwAWogBEIAQgAgBUHAAWpBCGopAwB9QgAQ6gQgBUGgAWogAkIAIAUpA7ABQj+IIAVBsAFqQQhqKQMAQgGGhEJ/fCIEQgAQ6gQgBUGQAWogA0IPhkIAIARCABDqBCAFQfAAaiAEQgBCACAFQaABakEIaikDACAFKQOgASIKIAVBkAFqQQhqKQMAfCICIApUrXwgAkIBVq18fUIAEOoEIAVBgAFqQgEgAn1CACAEQgAQ6gQgCCAHIAZraiEGAkACQCAFKQNwIg9CAYYiECAFKQOAAUI/iCAFQYABakEIaikDACIRQgGGhHwiDUKZk398IhJCIIgiAiALQoCAgICAgMAAhCITQgGGIAFCP4iEIhRCIIgiBH4iCyABQgGGIhVCIIgiCiAFQfAAakEIaikDAEIBhiAPQj+IhCARQj+IfCANIBBUrXwgEiANVK18Qn98Ig9CIIgiDX58IhAgC1StIBAgD0L/////D4MiCyAUQv////8PgyIPfnwiESAQVK18IA0gBH58IAsgBH4iFiAPIA1+fCIQIBZUrUIghiAQQiCIhHwgESAQQiCGfCIQIBFUrXwgECASQv////8PgyISIA9+IhYgAiAKfnwiESAWVK0gESALIBVC/v///w+DIhZ+fCIXIBFUrXx8IhEgEFStfCARIBIgBH4iECAWIA1+fCIEIAIgD358Ig0gCyAKfnwiC0IgiCAEIBBUrSANIARUrXwgCyANVK18QiCGhHwiBCARVK18IAQgFyACIBZ+IgIgEiAKfnwiCkIgiCAKIAJUrUIghoR8IgIgF1StIAIgC0IghnwgAlStfHwiAiAEVK18IgRC/////////wBWDQAgBUHQAGogAiAEIAMgDhDqBCABQjGGIAVB0ABqQQhqKQMAfSAFKQNQIgFCAFKtfSENIAZB/v8AaiEGQgAgAX0hCgwBCyAFQeAAaiACQgGIIARCP4aEIgIgBEIBiCIEIAMgDhDqBCABQjCGIAVB4ABqQQhqKQMAfSAFKQNgIgpCAFKtfSENIAZB//8AaiEGQgAgCn0hCiABIRUgEyEUCwJAIAZB//8BSA0AIAxCgICAgICAwP//AIQhDEIAIQEMAQsCQAJAIAZBAUgNACANQgGGIApCP4iEIQ0gBq1CMIYgBEL///////8/g4QhCyAKQgGGIQQMAQsCQCAGQY9/Sg0AQgAhAQwCCyAFQcAAaiACIARBASAGaxDoBCAFQTBqIBUgFCAGQfAAahDeBCAFQSBqIAMgDiAFKQNAIgIgBUHAAGpBCGopAwAiCxDqBCAFQTBqQQhqKQMAIAVBIGpBCGopAwBCAYYgBSkDICIBQj+IhH0gBSkDMCIEIAFCAYYiAVStfSENIAQgAX0hBAsgBUEQaiADIA5CA0IAEOoEIAUgAyAOQgVCABDqBCALIAIgAkIBgyIBIAR8IgQgA1YgDSAEIAFUrXwiASAOViABIA5RG618IgMgAlStfCICIAMgAkKAgICAgIDA//8AVCAEIAUpAxBWIAEgBUEQakEIaikDACICViABIAJRG3GtfCICIANUrXwiAyACIANCgICAgICAwP//AFQgBCAFKQMAViABIAVBCGopAwAiBFYgASAEURtxrXwiASACVK18IAyEIQwLIAAgATcDACAAIAw3AwggBUHQAmokAAuOAgICfwN+IwBBEGsiAiQAAkACQCABvSIEQv///////////wCDIgVCgICAgICAgHh8Qv/////////v/wBWDQAgBUI8hiEGIAVCBIhCgICAgICAgIA8fCEFDAELAkAgBUKAgICAgICA+P8AVA0AIARCPIYhBiAEQgSIQoCAgICAgMD//wCEIQUMAQsCQCAFUEUNAEIAIQZCACEFDAELIAIgBUIAIASnZ0EgaiAFQiCIp2cgBUKAgICAEFQbIgNBMWoQ3gQgAkEIaikDAEKAgICAgIDAAIVBjPgAIANrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgBEKAgICAgICAgIB/g4Q3AwggAkEQaiQAC+EBAgN/An4jAEEQayICJAACQAJAIAG8IgNB/////wdxIgRBgICAfGpB////9wdLDQAgBK1CGYZCgICAgICAgMA/fCEFQgAhBgwBCwJAIARBgICA/AdJDQAgA61CGYZCgICAgICAwP//AIQhBUIAIQYMAQsCQCAEDQBCACEGQgAhBQwBCyACIAStQgAgBGciBEHRAGoQ3gQgAkEIaikDAEKAgICAgIDAAIVBif8AIARrrUIwhoQhBSACKQMAIQYLIAAgBjcDACAAIAUgA0GAgICAeHGtQiCGhDcDCCACQRBqJAALjQECAn8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhBEIAIQUMAQsgAiABIAFBH3UiA3MgA2siA61CACADZyIDQdEAahDeBCACQQhqKQMAQoCAgICAgMAAhUGegAEgA2utQjCGfCABQYCAgIB4ca1CIIaEIQUgAikDACEECyAAIAQ3AwAgACAFNwMIIAJBEGokAAtyAgF/An4jAEEQayICJAACQAJAIAENAEIAIQNCACEEDAELIAIgAa1CACABZyIBQdEAahDeBCACQQhqKQMAQoCAgICAgMAAhUGegAEgAWutQjCGfCEEIAIpAwAhAwsgACADNwMAIAAgBDcDCCACQRBqJAALBABBAAsEAEEAC1MBAX4CQAJAIANBwABxRQ0AIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC5wLAgV/D34jAEHgAGsiBSQAIARC////////P4MhCiAEIAKFQoCAgICAgICAgH+DIQsgAkL///////8/gyIMQiCIIQ0gBEIwiKdB//8BcSEGAkACQAJAIAJCMIinQf//AXEiB0GBgH5qQYKAfkkNAEEAIQggBkGBgH5qQYGAfksNAQsCQCABUCACQv///////////wCDIg5CgICAgICAwP//AFQgDkKAgICAgIDA//8AURsNACACQoCAgICAgCCEIQsMAgsCQCADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURsNACAEQoCAgICAgCCEIQsgAyEBDAILAkAgASAOQoCAgICAgMD//wCFhEIAUg0AAkAgAyAChFBFDQBCgICAgICA4P//ACELQgAhAQwDCyALQoCAgICAgMD//wCEIQtCACEBDAILAkAgAyACQoCAgICAgMD//wCFhEIAUg0AIAEgDoQhAkIAIQECQCACUEUNAEKAgICAgIDg//8AIQsMAwsgC0KAgICAgIDA//8AhCELDAILAkAgASAOhEIAUg0AQgAhAQwCCwJAIAMgAoRCAFINAEIAIQEMAgtBACEIAkAgDkL///////8/Vg0AIAVB0ABqIAEgDCABIAwgDFAiCBt5IAhBBnStfKciCEFxahDeBEEQIAhrIQggBUHYAGopAwAiDEIgiCENIAUpA1AhAQsgAkL///////8/Vg0AIAVBwABqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahDeBCAIIAlrQRBqIQggBUHIAGopAwAhCiAFKQNAIQMLIANCD4YiDkKAgP7/D4MiAiABQiCIIgR+Ig8gDkIgiCIOIAFC/////w+DIgF+fCIQQiCGIhEgAiABfnwiEiARVK0gAiAMQv////8PgyIMfiITIA4gBH58IhEgCkIPhiADQjGIhCIUQv////8PgyIDIAF+fCIKIBBCIIggECAPVK1CIIaEfCIPIAIgDUKAgASEIhB+IhUgDiAMfnwiDSAUQiCIQoCAgIAIhCICIAF+fCIUIAMgBH58IhZCIIZ8Ihd8IQEgByAGaiAIakGBgH9qIQYCQAJAIAIgBH4iGCAOIBB+fCIEIBhUrSAEIAMgDH58Ig4gBFStfCACIBB+fCAOIBEgE1StIAogEVStfHwiBCAOVK18IAMgEH4iAyACIAx+fCICIANUrUIghiACQiCIhHwgBCACQiCGfCICIARUrXwgAiAWQiCIIA0gFVStIBQgDVStfCAWIBRUrXxCIIaEfCIEIAJUrXwgBCAPIApUrSAXIA9UrXx8IgIgBFStfCIEQoCAgICAgMAAg1ANACAGQQFqIQYMAQsgEkI/iCEDIARCAYYgAkI/iIQhBCACQgGGIAFCP4iEIQIgEkIBhiESIAMgAUIBhoQhAQsCQCAGQf//AUgNACALQoCAgICAgMD//wCEIQtCACEBDAELAkACQCAGQQBKDQACQEEBIAZrIgdBgAFJDQBCACEBDAMLIAVBMGogEiABIAZB/wBqIgYQ3gQgBUEgaiACIAQgBhDeBCAFQRBqIBIgASAHEOgEIAUgAiAEIAcQ6AQgBSkDICAFKQMQhCAFKQMwIAVBMGpBCGopAwCEQgBSrYQhEiAFQSBqQQhqKQMAIAVBEGpBCGopAwCEIQEgBUEIaikDACEEIAUpAwAhAgwBCyAGrUIwhiAEQv///////z+DhCEECyAEIAuEIQsCQCASUCABQn9VIAFCgICAgICAgICAf1EbDQAgCyACQgF8IgEgAlStfCELDAELAkAgEiABQoCAgICAgICAgH+FhEIAUQ0AIAIhAQwBCyALIAIgAkIBg3wiASACVK18IQsLIAAgATcDACAAIAs3AwggBUHgAGokAAt1AQF+IAAgBCABfiACIAN+fCADQiCIIgQgAUIgiCICfnwgA0L/////D4MiAyABQv////8PgyIBfiIFQiCIIAMgAn58IgNCIIh8IANC/////w+DIAQgAX58IgNCIIh8NwMIIAAgA0IghiAFQv////8Pg4Q3AwALawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLSAEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQ3QQgBSkDACEBIAAgBUEIaikDADcDCCAAIAE3AwAgBUEQaiQAC+oDAgJ/An4jAEEgayICJAACQAJAIAFC////////////AIMiBEKAgICAgIDA/0N8IARCgICAgICAwIC8f3xaDQAgAEI8iCABQgSGhCEEAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIARCgYCAgICAgIDAAHwhBQwCCyAEQoCAgICAgICAwAB8IQUgAEKAgICAgICAgAiFQgBSDQEgBSAEQgGDfCEFDAELAkAgAFAgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRGw0AIABCPIggAUIEhoRC/////////wODQoCAgICAgID8/wCEIQUMAQtCgICAgICAgPj/ACEFIARC////////v//DAFYNAEIAIQUgBEIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEN4EIAIgACAEQYH4ACADaxDoBCACKQMAIgRCPIggAkEIaikDAEIEhoQhBQJAIARC//////////8PgyACKQMQIAJBEGpBCGopAwCEQgBSrYQiBEKBgICAgICAgAhUDQAgBUIBfCEFDAELIARCgICAgICAgIAIhUIAUg0AIAVCAYMgBXwhBQsgAkEgaiQAIAUgAUKAgICAgICAgIB/g4S/CwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEHgxsECJAJB4MYBQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABEQAAskAQF+IAAgASACrSADrUIghoQgBBD1BCEFIAVCIIinEBQgBacLEwAgACABpyABQiCIpyACIAMQFQsLuKqBgAADAEGACAv4pQFpbmZpbml0eQAtSW5maW5pdHkAaHVtaWRpdHkAYWNpZGl0eQBkZXZzX3ZlcmlmeQBpbnZhbGlkIGtleQBhcnJheQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AHNlcnZpY2VJbmRleABqZF9vcGlwZV93cml0ZV9leABtYXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAJXM6JXgAY2xvc3VyZTolZDoleABtZXRob2Q6JWQ6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkX3J3AHBvdwBqZF93c3NrX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGlzUmVwb3J0AGF1dGggdG9vIHNob3J0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABpc0V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAcmFuZG9tSW50AHBhcnNlSW50AGRldmljZXNjcmlwdG1ncl9pbml0AHdhaXQAcmVmbGVjdGVkTGlnaHQAdW5zaGlmdABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AG9uUGFja2V0AGlzUmVnU2V0AGlzUmVnR2V0AG9iamVjdABwYXJzZUZsb2F0AGZvcm1hdABibGl0QXQAc2V0QXQAZ2V0QXQAY2hhckF0AGZpbGxBdABjaGFyQ29kZUF0AGtleXMAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAYmx0aW4gPCBkZXZzX251bV9idWlsdGluX2Z1bmN0aW9ucwBmbGFncwBkZXZzX21hcF9rZXlzX29yX3ZhbHVlcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBhYnMAc2xlZXBNcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAV1M6IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAY2xlYXIgcm9sZSAlcwBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwBKU0NSOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgB0YWcgZXJyb3IAZmxvb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgBkZXZpY2VJZGVudGlmaWVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgByb2xlX21lbWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAZGV2c19wcm90b19sb29rdXAAZGV2c19zcGVjX2xvb2t1cAAoKCh1aW50MzJfdClvdHAgPDwgUEFDS19TSElGVCkgPj4gUEFDS19TSElGVCkgPT0gKHVpbnQzMl90KW90cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAG1hcABkZXZzX2dldF9zdGF0aWNfcHJvdG8AZGV2c19tYXBfY29weV9pbnRvAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgByZS1ydW4Abm9uLWZ1bgBidXR0b24AbW90aW9uAGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAGRldnNfdmFsdWVfdW5waW4AZGV2c192YWx1ZV9waW4Aam9pbgBtaW4AbWFpbgBkZXZzX29iamVjdF9nZXRfYnVpbHRfaW4AZGV2c19vYmplY3RfZ2V0X3N0YXRpY19idWlsdF9pbgBhc3NpZ24AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBuYW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPj0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBsb2cAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAHByb3RvdHlwZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAbmFtZQAocm9sZSAmIERFVlNfUk9MRV9NQVNLKSA9PSByb2xlAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBvbkNoYW5nZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQA/ZnJlZQBlbmNvZGUAZGVjb2RlAGV2ZW50Q29kZQByZWdDb2RlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAGlzQ29tbWFuZABzZXJ2aWNlQ29tbWFuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAG9uRGlzY29ubmVjdGVkAFdTOiBjb25uZWN0ZWQAaXNDb25uZWN0ZWQAb25Db25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZABkZXZzX29iamVjdF9nZXRfYXR0YWNoZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABwYXlsb2FkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZABzaG9ydElkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZABEZXZpY2VTY3JpcHQgcnVudGltZSB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBwYW5pYwBiYWQgbWFnaWMAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAcGFja2V0X3NwZWMAZGV2c19nZXRfYmFzZV9zcGVjAGRldmljZXNjcmlwdC92ZXJpZnkuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGRldmljZXNjcmlwdC9vYmplY3RzLmMAZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGRldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBkZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBkZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGRldmljZXNjcmlwdC92bV9tYWluLmMAbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBuZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAZGV2aWNlc2NyaXB0L3N0cmluZy5jAGRldmljZXNjcmlwdC90c2FnZy5jAGRldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBkZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBkZXZpY2VzY3JpcHQvamRpZmFjZS5jAGRldmljZXNjcmlwdC9nY19hbGxvYy5jAGRldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAX19mdW5jX18AW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbUm9sZTogJXMuJXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1BhY2tldDogJXMgY21kPTB4JXggc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWABpZHggPD0gREVWU19TRVJWSUNFU1BFQ19GTEFHX0RFUklWRV9MQVNUACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAHBrdCAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFBJAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsb2cyAFNRUlQxXzIAU1FSVDIAZUNPMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBhcmcwAGxvZzEwAExOMTAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IFBBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAciA9PSBOVUxMIHx8IGRldnNfaXNfbWFwKHIpAGRldnNfaXNfbWFwKHByb3RvKQBkZXZzX2lzX3Byb3RvKHByb3RvKQAobnVsbCkAZmlkeCA8IGRldnNfaW1nX251bV9mdW5jdGlvbnMoY3R4LT5pbWcpAGRldnNfaGFuZGxlX3R5cGVfaXNfcHRyKHR5cGUpAGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAGRldnNfaXNfbWFwKHNyYykAZGV2c19pc19zZXJ2aWNlX3NwZWMoY3R4LCBzcGVjKQAhKGgtPmZsYWdzICYgREVWU19CVUlMVElOX0ZMQUdfSVNfUFJPUEVSVFkpAG9mZiA8ICgxIDw8IE1BWF9PRkZfQklUUykAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZ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AJMAAACUAAAAlQAAAJYAAACXAAAAmAAAAJkAAACaAAAAmwAAAJwAAACdAAAAngAAAJ8AAACgAAAAoQAAAKIAAACjAAAApAAAAEoAAAAFAAAAAAAAAAAAAACxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyAAAAswAAAHBhAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQWAAAYGNQAABBqLIBCwAApd6AgAAEbmFtZQG/XfgEAAVhYm9ydAETX2RldnNfcGFuaWNfaGFuZGxlcgINZW1fc2VuZF9mcmFtZQMQZW1fY29uc29sZV9kZWJ1ZwQEZXhpdAULZW1fdGltZV9ub3cGE2RldnNfZGVwbG95X2hhbmRsZXIHIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CCFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQJGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRA5hZ2didWZmZXJfaW5pdEUPYWdnYnVmZmVyX2ZsdXNoRhBhZ2didWZmZXJfdXBsb2FkRw5kZXZzX2J1ZmZlcl9vcEgQZGV2c19yZWFkX251bWJlckkSZGV2c19idWZmZXJfZGVjb2RlShJkZXZzX2J1ZmZlcl9lbmNvZGVLD2RldnNfY3JlYXRlX2N0eEwJc2V0dXBfY3R4TQpkZXZzX3RyYWNlTg9kZXZzX2Vycm9yX2NvZGVPGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJQCWNsZWFyX2N0eFENZGV2c19mcmVlX2N0eFIIZGV2c19vb21TCWRldnNfZnJlZVQXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NVB3RyeV9ydW5WDHN0b3BfcHJvZ3JhbVccZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydFgcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZVkYZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNoWh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldFsOZGVwbG95X2hhbmRsZXJcE2RlcGxveV9tZXRhX2hhbmRsZXJdFmRldmljZXNjcmlwdG1ncl9kZXBsb3leFGRldmljZXNjcmlwdG1ncl9pbml0XxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2YBFkZXZzY2xvdWRfcHJvY2Vzc2EXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXRiE2RldnNjbG91ZF9vbl9tZXRob2RjDmRldnNjbG91ZF9pbml0ZBBkZXZzX2ZpYmVyX3lpZWxkZRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb25mCmRldnNfcGFuaWNnGGRldnNfZmliZXJfc2V0X3dha2VfdGltZWgQZGV2c19maWJlcl9zbGVlcGkbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsagxsb2dfZmliZXJfb3BrGmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzbBFkZXZzX2ltZ19mdW5fbmFtZW0SZGV2c19pbWdfcm9sZV9uYW1lbhJkZXZzX2ZpYmVyX2J5X2ZpZHhvEWRldnNfZmliZXJfYnlfdGFncBBkZXZzX2ZpYmVyX3N0YXJ0cRRkZXZzX2ZpYmVyX3Rlcm1pYW50ZXIOZGV2c19maWJlcl9ydW5zE2RldnNfZmliZXJfc3luY19ub3d0FV9kZXZzX3J1bnRpbWVfZmFpbHVyZXUPZGV2c19maWJlcl9wb2tldhNqZF9nY19hbnlfdHJ5X2FsbG9jdwdkZXZzX2djeA9maW5kX2ZyZWVfYmxvY2t5EmRldnNfYW55X3RyeV9hbGxvY3oOZGV2c190cnlfYWxsb2N7C2pkX2djX3VucGlufApqZF9nY19mcmVlfQ5kZXZzX3ZhbHVlX3Bpbn4QZGV2c192YWx1ZV91bnBpbn8SZGV2c19tYXBfdHJ5X2FsbG9jgAEUZGV2c19hcnJheV90cnlfYWxsb2OBARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OCARVkZXZzX3N0cmluZ190cnlfYWxsb2ODARpkZXZzX3N0cmluZ190cnlfYWxsb2NfaW5pdIQBD2RldnNfZ2Nfc2V0X2N0eIUBDmRldnNfZ2NfY3JlYXRlhgEPZGV2c19nY19kZXN0cm95hwELc2Nhbl9nY19vYmqIARFwcm9wX0FycmF5X2xlbmd0aIkBEm1ldGgyX0FycmF5X2luc2VydIoBEWZ1bjFfQnVmZmVyX2FsbG9jiwEScHJvcF9CdWZmZXJfbGVuZ3RojAEVbWV0aDBfQnVmZmVyX3RvU3RyaW5njQETbWV0aDNfQnVmZmVyX2ZpbGxBdI4BE21ldGg0X0J1ZmZlcl9ibGl0QXSPARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zkAEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWORARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SSARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSTARVmdW4xX0RldmljZVNjcmlwdF9sb2eUARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0lQEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnSWARRtZXRoWF9GdW5jdGlvbl9zdGFydJcBDmZ1bjFfTWF0aF9jZWlsmAEPZnVuMV9NYXRoX2Zsb29ymQEPZnVuMV9NYXRoX3JvdW5kmgENZnVuMV9NYXRoX2Fic5sBEGZ1bjBfTWF0aF9yYW5kb22cARNmdW4xX01hdGhfcmFuZG9tSW50nQENZnVuMV9NYXRoX2xvZ54BDWZ1bjJfTWF0aF9wb3efAQ5mdW4yX01hdGhfaWRpdqABDmZ1bjJfTWF0aF9pbW9koQEOZnVuMl9NYXRoX2ltdWyiAQ1mdW4yX01hdGhfbWluowELZnVuMl9taW5tYXikAQ1mdW4yX01hdGhfbWF4pQESZnVuMl9PYmplY3RfYXNzaWdupgEQZnVuMV9PYmplY3Rfa2V5c6cBE2Z1bjFfa2V5c19vcl92YWx1ZXOoARJmdW4xX09iamVjdF92YWx1ZXOpARBwcm9wX1BhY2tldF9yb2xlqgEccHJvcF9QYWNrZXRfZGV2aWNlSWRlbnRpZmllcqsBE3Byb3BfUGFja2V0X3Nob3J0SWSsARhwcm9wX1BhY2tldF9zZXJ2aWNlSW5kZXitARpwcm9wX1BhY2tldF9zZXJ2aWNlQ29tbWFuZK4BEXByb3BfUGFja2V0X2ZsYWdzrwEVcHJvcF9QYWNrZXRfaXNDb21tYW5ksAEUcHJvcF9QYWNrZXRfaXNSZXBvcnSxARNwcm9wX1BhY2tldF9wYXlsb2FksgETcHJvcF9QYWNrZXRfaXNFdmVudLMBFXByb3BfUGFja2V0X2V2ZW50Q29kZbQBFHByb3BfUGFja2V0X2lzUmVnU2V0tQEUcHJvcF9QYWNrZXRfaXNSZWdHZXS2ARNwcm9wX1BhY2tldF9yZWdDb2RltwETbWV0aDBfUGFja2V0X2RlY29kZbgBEmRldnNfcGFja2V0X2RlY29kZbkBFW1ldGgwX0RzUmVnaXN0ZXJfcmVhZLoBFERzUmVnaXN0ZXJfcmVhZF9jb250uwESZGV2c19wYWNrZXRfZW5jb2RlvAEWbWV0aFhfRHNSZWdpc3Rlcl93cml0Zb0BFnByb3BfRHNQYWNrZXRJbmZvX3JvbGW+ARZwcm9wX0RzUGFja2V0SW5mb19uYW1lvwEWcHJvcF9Ec1BhY2tldEluZm9fY29kZcABGG1ldGhYX0RzQ29tbWFuZF9fX2Z1bmNfX8EBFXByb3BfUm9sZV9pc0Nvbm5lY3RlZMIBEnByb3BfU3RyaW5nX2xlbmd0aMMBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0xAETbWV0aDFfU3RyaW5nX2NoYXJBdMUBFGRldnNfamRfZ2V0X3JlZ2lzdGVyxgEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZMcBEGRldnNfamRfc2VuZF9jbWTIARFkZXZzX2pkX3dha2Vfcm9sZckBFGRldnNfamRfcmVzZXRfcGFja2V0ygETZGV2c19qZF9wa3RfY2FwdHVyZcsBE2RldnNfamRfc2VuZF9sb2dtc2fMAQ1oYW5kbGVfbG9nbXNnzQESZGV2c19qZF9zaG91bGRfcnVuzgEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXPARNkZXZzX2pkX3Byb2Nlc3NfcGt00AEUZGV2c19qZF9yb2xlX2NoYW5nZWTRARJkZXZzX2pkX2luaXRfcm9sZXPSARJkZXZzX2pkX2ZyZWVfcm9sZXPTARBkZXZzX3NldF9sb2dnaW5n1AEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdz1QESZGV2c19tYXBfY29weV9pbnRv1gEMZGV2c19tYXBfc2V01wEUZGV2c19pc19zZXJ2aWNlX3NwZWPYAQZsb29rdXDZARdkZXZzX21hcF9rZXlzX29yX3ZhbHVlc9oBEWRldnNfYXJyYXlfaW5zZXJ02wEPZGV2c19tYXBfZGVsZXRl3AEYZGV2c19vYmplY3RfZ2V0X2J1aWx0X2lu3QEXZGV2c19kZWNvZGVfcm9sZV9wYWNrZXTeAQ5kZXZzX3JvbGVfc3BlY98BEGRldnNfc3BlY19sb29rdXDgARFkZXZzX3Byb3RvX2xvb2t1cOEBEmRldnNfZnVuY3Rpb25fYmluZOIBEWRldnNfbWFrZV9jbG9zdXJl4wEOZGV2c19nZXRfZm5pZHjkARtkZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfcnflARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTmARVkZXZzX2dldF9zdGF0aWNfcHJvdG/nAR1kZXZzX29iamVjdF9nZXRfYXR0YWNoZWRfZW51begBF2RldnNfb2JqZWN0X2dldF9ub19iaW5k6QEPZGV2c19vYmplY3RfZ2V06gEMZGV2c19zZXFfZ2V06wEMZGV2c19hbnlfZ2V07AEMZGV2c19hbnlfc2V07QEMZGV2c19zZXFfc2V07gEOZGV2c19hcnJheV9zZXTvAQxkZXZzX2FyZ19pbnTwAQ9kZXZzX2FyZ19kb3VibGXxAQ9kZXZzX3JldF9kb3VibGXyAQxkZXZzX3JldF9pbnTzAQ9kZXZzX3JldF9nY19wdHL0ARFkZXZzX3NldHVwX3Jlc3VtZfUBEmRldnNfcmVnY2FjaGVfZnJlZfYBFmRldnNfcmVnY2FjaGVfZnJlZV9hbGz3ARdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZPgBE2RldnNfcmVnY2FjaGVfYWxsb2P5ARRkZXZzX3JlZ2NhY2hlX2xvb2t1cPoBEWRldnNfcmVnY2FjaGVfYWdl+wEXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGX8ARJkZXZzX3JlZ2NhY2hlX25leHT9AQ9qZF9zZXR0aW5nc19nZXT+AQ9qZF9zZXR0aW5nc19zZXT/AQ5kZXZzX2xvZ192YWx1ZYACD2RldnNfc2hvd192YWx1ZYECEGRldnNfc2hvd192YWx1ZTCCAg1jb25zdW1lX2NodW5rgwINc2hhXzI1Nl9jbG9zZYQCD2pkX3NoYTI1Nl9zZXR1cIUCEGpkX3NoYTI1Nl91cGRhdGWGAhBqZF9zaGEyNTZfZmluaXNohwIUamRfc2hhMjU2X2htYWNfc2V0dXCIAhVqZF9zaGEyNTZfaG1hY19maW5pc2iJAg5qZF9zaGEyNTZfaGtkZooCDmRldnNfc3RyZm9ybWF0iwIOZGV2c19pc19zdHJpbmeMAg5kZXZzX2lzX251bWJlco0CFGRldnNfc3RyaW5nX2dldF91dGY4jgITZGV2c19idWlsdGluX3N0cmluZ48CFGRldnNfc3RyaW5nX3ZzcHJpbnRmkAITZGV2c19zdHJpbmdfc3ByaW50ZpECFWRldnNfc3RyaW5nX2Zyb21fdXRmOJICFGRldnNfdmFsdWVfdG9fc3RyaW5nkwIQYnVmZmVyX3RvX3N0cmluZ5QCEmRldnNfc3RyaW5nX2NvbmNhdJUCHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2OWAg90c2FnZ19jbGllbnRfZXaXAgphZGRfc2VyaWVzmAINdHNhZ2dfcHJvY2Vzc5kCCmxvZ19zZXJpZXOaAhN0c2FnZ19oYW5kbGVfcGFja2V0mwIUbG9va3VwX29yX2FkZF9zZXJpZXOcAgp0c2FnZ19pbml0nQIMdHNhZ2dfdXBkYXRlngIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZZ8CE2RldnNfdmFsdWVfZnJvbV9pbnSgAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbKECF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyogIUZGV2c192YWx1ZV90b19kb3VibGWjAhFkZXZzX3ZhbHVlX3RvX2ludKQCEmRldnNfdmFsdWVfdG9fYm9vbKUCDmRldnNfaXNfYnVmZmVypgIXZGV2c19idWZmZXJfaXNfd3JpdGFibGWnAhBkZXZzX2J1ZmZlcl9kYXRhqAITZGV2c19idWZmZXJpc2hfZGF0YakCFGRldnNfdmFsdWVfdG9fZ2Nfb2JqqgINZGV2c19pc19hcnJheasCEWRldnNfdmFsdWVfdHlwZW9mrAIPZGV2c19pc19udWxsaXNorQISZGV2c192YWx1ZV9pZWVlX2VxrgISZGV2c19pbWdfc3RyaWR4X29rrwISZGV2c19kdW1wX3ZlcnNpb25zsAILZGV2c192ZXJpZnmxAhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc7ICGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4swIRZGV2c19pbWdfZ2V0X3V0Zji0AhRkZXZzX2dldF9zdGF0aWNfdXRmOLUCD2RldnNfdm1fcm9sZV9va7YCDGV4cHJfaW52YWxpZLcCFGV4cHJ4X2J1aWx0aW5fb2JqZWN0uAILc3RtdDFfY2FsbDC5AgtzdG10Ml9jYWxsMboCC3N0bXQzX2NhbGwyuwILc3RtdDRfY2FsbDO8AgtzdG10NV9jYWxsNL0CC3N0bXQ2X2NhbGw1vgILc3RtdDdfY2FsbDa/AgtzdG10OF9jYWxsN8ACC3N0bXQ5X2NhbGw4wQIMZXhwcjJfc3RyMGVxwgIMc3RtdDFfcmV0dXJuwwIJc3RtdHhfam1wxAIMc3RtdHgxX2ptcF96xQILc3RtdDFfcGFuaWPGAhZleHByMF9wa3RfY29tbWFuZF9jb2RlxwISc3RtdHgxX3N0b3JlX2xvY2FsyAITc3RtdHgxX3N0b3JlX2dsb2JhbMkCEnN0bXQ0X3N0b3JlX2J1ZmZlcsoCFmV4cHIwX3BrdF9yZWdfZ2V0X2NvZGXLAhBleHByeF9sb2FkX2xvY2FszAIRZXhwcnhfbG9hZF9nbG9iYWzNAhVleHByMF9wa3RfcmVwb3J0X2NvZGXOAgtleHByMl9pbmRleM8CD3N0bXQzX2luZGV4X3NldNACFGV4cHJ4MV9idWlsdGluX2ZpZWxk0QISZXhwcngxX2FzY2lpX2ZpZWxk0gIRZXhwcngxX3V0ZjhfZmllbGTTAhBleHByeF9tYXRoX2ZpZWxk1AIOZXhwcnhfZHNfZmllbGTVAg9zdG10MF9hbGxvY19tYXDWAhFzdG10MV9hbGxvY19hcnJhedcCEnN0bXQxX2FsbG9jX2J1ZmZlctgCEWV4cHJ4X3N0YXRpY19yb2xl2QITZXhwcnhfc3RhdGljX2J1ZmZlctoCG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ9sCGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfcAhhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfdAhVleHByeF9zdGF0aWNfZnVuY3Rpb27eAg1leHByeF9saXRlcmFs3wIRZXhwcnhfbGl0ZXJhbF9mNjTgAhBleHByMF9wa3RfYnVmZmVy4QIRZXhwcjNfbG9hZF9idWZmZXLiAg1leHByMF9yZXRfdmFs4wIMZXhwcjFfdHlwZW9m5AIKZXhwcjBfbnVsbOUCDWV4cHIxX2lzX251bGzmAgpleHByMF90cnVl5wILZXhwcjBfZmFsc2XoAg1leHByMV90b19ib29s6QIJZXhwcjBfbmFu6gIJZXhwcjFfYWJz6wINZXhwcjFfYml0X25vdOwCDGV4cHIxX2lzX25hbu0CCWV4cHIxX25lZ+4CCWV4cHIxX25vdO8CDGV4cHIxX3RvX2ludPACCWV4cHIyX2FkZPECCWV4cHIyX3N1YvICCWV4cHIyX211bPMCCWV4cHIyX2RpdvQCDWV4cHIyX2JpdF9hbmT1AgxleHByMl9iaXRfb3L2Ag1leHByMl9iaXRfeG9y9wIQZXhwcjJfc2hpZnRfbGVmdPgCEWV4cHIyX3NoaWZ0X3JpZ2h0+QIaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWT6AghleHByMl9lcfsCCGV4cHIyX2xl/AIIZXhwcjJfbHT9AghleHByMl9uZf4CFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcv8CD3N0bXQxX3dhaXRfcm9sZYADD3N0bXQzX3F1ZXJ5X3JlZ4EDDnN0bXQyX3NlbmRfY21kggMTc3RtdDRfcXVlcnlfaWR4X3JlZ4MDFnN0bXQxX3NldHVwX3BrdF9idWZmZXKEAw1zdG10Ml9zZXRfcGt0hQMMZXhwcjBfbm93X21zhgMWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZYcDDmV4cHIwX3BrdF9zaXpliAMRZXhwcjBfcGt0X2V2X2NvZGWJAxRzdG10eDJfc3RvcmVfY2xvc3VyZYoDE2V4cHJ4MV9sb2FkX2Nsb3N1cmWLAxJleHByeF9tYWtlX2Nsb3N1cmWMAxBleHByMV90eXBlb2Zfc3RyjQMJZXhwcjBfaW5mjgMLZXhwcjFfdXBsdXOPAxJleHByeF9vYmplY3RfZmllbGSQAxJzdG10Ml9pbmRleF9kZWxldGWRAw9kZXZzX3ZtX3BvcF9hcmeSAxNkZXZzX3ZtX3BvcF9hcmdfdTMykwMTZGV2c192bV9wb3BfYXJnX2kzMpQDFmRldnNfdm1fcG9wX2FyZ19idWZmZXKVAxtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGGWAxZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4lwMUZGV2c192bV9wb3BfYXJnX3JvbGWYAxJqZF9hZXNfY2NtX2VuY3J5cHSZAxJqZF9hZXNfY2NtX2RlY3J5cHSaAwxBRVNfaW5pdF9jdHibAw9BRVNfRUNCX2VuY3J5cHScAxBqZF9hZXNfc2V0dXBfa2V5nQMOamRfYWVzX2VuY3J5cHSeAxBqZF9hZXNfY2xlYXJfa2V5nwMLamRfd3Nza19uZXegAxRqZF93c3NrX3NlbmRfbWVzc2FnZaEDE2pkX3dlYnNvY2tfb25fZXZlbnSiAwdkZWNyeXB0owMNamRfd3Nza19jbG9zZaQDEGpkX3dzc2tfb25fZXZlbnSlAwpzZW5kX2VtcHR5pgMSd3Nza2hlYWx0aF9wcm9jZXNzpwMXamRfdGNwc29ja19pc19hdmFpbGFibGWoAxR3c3NraGVhbHRoX3JlY29ubmVjdKkDGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldKoDD3NldF9jb25uX3N0cmluZ6sDEWNsZWFyX2Nvbm5fc3RyaW5nrAMPd3Nza2hlYWx0aF9pbml0rQMTd3Nza19wdWJsaXNoX3ZhbHVlc64DEHdzc2tfcHVibGlzaF9iaW6vAxF3c3NrX2lzX2Nvbm5lY3RlZLADE3dzc2tfcmVzcG9uZF9tZXRob2SxAxxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplsgMWcm9sZW1ncl9zZXJpYWxpemVfcm9sZbMDD3JvbGVtZ3JfcHJvY2Vzc7QDEHJvbGVtZ3JfYXV0b2JpbmS1AxVyb2xlbWdyX2hhbmRsZV9wYWNrZXS2AxRqZF9yb2xlX21hbmFnZXJfaW5pdLcDGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZLgDDWpkX3JvbGVfYWxsb2O5AxBqZF9yb2xlX2ZyZWVfYWxsugMWamRfcm9sZV9mb3JjZV9hdXRvYmluZLsDEmpkX3JvbGVfYnlfc2VydmljZbwDE2pkX2NsaWVudF9sb2dfZXZlbnS9AxNqZF9jbGllbnRfc3Vic2NyaWJlvgMUamRfY2xpZW50X2VtaXRfZXZlbnS/AxRyb2xlbWdyX3JvbGVfY2hhbmdlZMADEGpkX2RldmljZV9sb29rdXDBAxhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2XCAxNqZF9zZXJ2aWNlX3NlbmRfY21kwwMRamRfY2xpZW50X3Byb2Nlc3PEAw5qZF9kZXZpY2VfZnJlZcUDF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0xgMPamRfZGV2aWNlX2FsbG9jxwMPamRfY3RybF9wcm9jZXNzyAMVamRfY3RybF9oYW5kbGVfcGFja2V0yQMMamRfY3RybF9pbml0ygMNamRfaXBpcGVfb3BlbssDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTMAw5qZF9pcGlwZV9jbG9zZc0DEmpkX251bWZtdF9pc192YWxpZM4DFWpkX251bWZtdF93cml0ZV9mbG9hdM8DE2pkX251bWZtdF93cml0ZV9pMzLQAxJqZF9udW1mbXRfcmVhZF9pMzLRAxRqZF9udW1mbXRfcmVhZF9mbG9hdNIDEWpkX29waXBlX29wZW5fY21k0wMUamRfb3BpcGVfb3Blbl9yZXBvcnTUAxZqZF9vcGlwZV9oYW5kbGVfcGFja2V01QMRamRfb3BpcGVfd3JpdGVfZXjWAxBqZF9vcGlwZV9wcm9jZXNz1wMUamRfb3BpcGVfY2hlY2tfc3BhY2XYAw5qZF9vcGlwZV93cml0ZdkDDmpkX29waXBlX2Nsb3Nl2gMNamRfcXVldWVfcHVzaNsDDmpkX3F1ZXVlX2Zyb2503AMOamRfcXVldWVfc2hpZnTdAw5qZF9xdWV1ZV9hbGxvY94DDWpkX3Jlc3BvbmRfdTjfAw5qZF9yZXNwb25kX3UxNuADDmpkX3Jlc3BvbmRfdTMy4QMRamRfcmVzcG9uZF9zdHJpbmfiAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZOMDC2pkX3NlbmRfcGt05AMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzlAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcuYDGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTnAxRqZF9hcHBfaGFuZGxlX3BhY2tldOgDFWpkX2FwcF9oYW5kbGVfY29tbWFuZOkDE2pkX2FsbG9jYXRlX3NlcnZpY2XqAxBqZF9zZXJ2aWNlc19pbml06wMOamRfcmVmcmVzaF9ub3fsAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk7QMUamRfc2VydmljZXNfYW5ub3VuY2XuAxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZe8DEGpkX3NlcnZpY2VzX3RpY2vwAxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfxAxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZfIDEmFwcF9nZXRfZndfdmVyc2lvbvMDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWX0Aw1qZF9oYXNoX2ZudjFh9QMMamRfZGV2aWNlX2lk9gMJamRfcmFuZG9t9wMIamRfY3JjMTb4Aw5qZF9jb21wdXRlX2NyY/kDDmpkX3NoaWZ0X2ZyYW1l+gMOamRfcmVzZXRfZnJhbWX7AxBqZF9wdXNoX2luX2ZyYW1l/AMNamRfcGFuaWNfY29yZf0DE2pkX3Nob3VsZF9zYW1wbGVfbXP+AxBqZF9zaG91bGRfc2FtcGxl/wMJamRfdG9faGV4gAQLamRfZnJvbV9oZXiBBA5qZF9hc3NlcnRfZmFpbIIEB2pkX2F0b2mDBAtqZF92c3ByaW50ZoQED2pkX3ByaW50X2RvdWJsZYUECmpkX3NwcmludGaGBBJqZF9kZXZpY2Vfc2hvcnRfaWSHBAxqZF9zcHJpbnRmX2GIBAtqZF90b19oZXhfYYkEFGpkX2RldmljZV9zaG9ydF9pZF9higQJamRfc3RyZHVwiwQOamRfanNvbl9lc2NhcGWMBBNqZF9qc29uX2VzY2FwZV9jb3JljQQJamRfbWVtZHVwjgQWamRfcHJvY2Vzc19ldmVudF9xdWV1ZY8EFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWQBBFqZF9zZW5kX2V2ZW50X2V4dJEECmpkX3J4X2luaXSSBBRqZF9yeF9mcmFtZV9yZWNlaXZlZJMEHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrlAQPamRfcnhfZ2V0X2ZyYW1llQQTamRfcnhfcmVsZWFzZV9mcmFtZZYEEWpkX3NlbmRfZnJhbWVfcmF3lwQNamRfc2VuZF9mcmFtZZgECmpkX3R4X2luaXSZBAdqZF9zZW5kmgQWamRfc2VuZF9mcmFtZV93aXRoX2NyY5sED2pkX3R4X2dldF9mcmFtZZwEEGpkX3R4X2ZyYW1lX3NlbnSdBAtqZF90eF9mbHVzaJ4EEF9fZXJybm9fbG9jYXRpb26fBAxfX2ZwY2xhc3NpZnmgBAVkdW1teaEECF9fbWVtY3B5ogQHbWVtbW92ZaMEBm1lbXNldKQECl9fbG9ja2ZpbGWlBAxfX3VubG9ja2ZpbGWmBARmbW9kpwQMX19zdGRpb19zZWVrqAQNX19zdGRpb193cml0ZakEDV9fc3RkaW9fY2xvc2WqBAxfX3N0ZGlvX2V4aXSrBApjbG9zZV9maWxlrAQIX190b3JlYWStBAlfX3Rvd3JpdGWuBAlfX2Z3cml0ZXivBAZmd3JpdGWwBCtlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzsQQUX19wdGhyZWFkX211dGV4X2xvY2uyBBZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrswQGX19sb2NrtAQOX19tYXRoX2Rpdnplcm+1BA5fX21hdGhfaW52YWxpZLYEA2xvZ7cEBWxvZzEwuAQHX19sc2Vla7kEBm1lbWNtcLoECl9fb2ZsX2xvY2u7BAxfX21hdGhfeGZsb3e8BApmcF9iYXJyaWVyvQQMX19tYXRoX29mbG93vgQMX19tYXRoX3VmbG93vwQEZmFic8AEA3Bvd8EECGNoZWNraW50wgQLc3BlY2lhbGNhc2XDBAVyb3VuZMQEBnN0cmNocsUEC19fc3RyY2hybnVsxgQGc3RyY21wxwQGc3RybGVuyAQHX191Zmxvd8kEB19fc2hsaW3KBAhfX3NoZ2V0Y8sEB2lzc3BhY2XMBAZzY2FsYm7NBAljb3B5c2lnbmzOBAdzY2FsYm5szwQNX19mcGNsYXNzaWZ5bNAEBWZtb2Rs0QQFZmFic2zSBAtfX2Zsb2F0c2NhbtMECGhleGZsb2F01AQIZGVjZmxvYXTVBAdzY2FuZXhw1gQGc3RydG941wQGc3RydG9k2AQSX193YXNpX3N5c2NhbGxfcmV02QQIZGxtYWxsb2PaBAZkbGZyZWXbBBhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXcBARzYnJr3QQIX19hZGR0ZjPeBAlfX2FzaGx0aTPfBAdfX2xldGYy4AQHX19nZXRmMuEECF9fZGl2dGYz4gQNX19leHRlbmRkZnRmMuMEDV9fZXh0ZW5kc2Z0ZjLkBAtfX2Zsb2F0c2l0ZuUEDV9fZmxvYXR1bnNpdGbmBA1fX2ZlX2dldHJvdW5k5wQSX19mZV9yYWlzZV9pbmV4YWN06AQJX19sc2hydGkz6QQIX19tdWx0ZjPqBAhfX211bHRpM+sECV9fcG93aWRmMuwECF9fc3VidGYz7QQMX190cnVuY3RmZGYy7gQJc3RhY2tTYXZl7wQMc3RhY2tSZXN0b3Jl8AQKc3RhY2tBbGxvY/EEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdPIEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXzBBllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl9AQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k9QQMZHluQ2FsbF9qaWpp9gQWbGVnYWxzdHViJGR5bkNhbGxfamlqafcEGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfUEBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
