
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
     * TODO: what is the difference with devsClientDeploy
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
     * Deploys a DeviceScript bytecode to the virtual machine
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABl4KAgAArYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAAAYAR/f39/AGAAAX9gBH9/f38Bf2AFf35+fn4AYAF8AXxgAn9/AXxgAn98AGADf35/AX5gAAF+YAF+AX9gBX9/f39/AX9gAX8BfGAEf35+fwBgB39/f39/f38AYAV/f39/fwBgAn9+AGACfHwBfGACfH8BfGAEfn5+fgF/YAABfGADf39/AXxgCX9/f39/f39/fwBgCH9/f39/f39/AX9gA39/fABgA398fwBgAXwBf2ACf3wBfGADfH5+AXxgAn5+AX9gA39+fgBgBn9/f39/fwBgAn9/AX5gAn99AGACfn4BfGAEf39+fwF+YAR/fn9/AX8CzIWAgAAWA2VudgVhYm9ydAAGA2VudhNfZGV2c19wYW5pY19oYW5kbGVyAAADZW52DWVtX3NlbmRfZnJhbWUAAANlbnYQZW1fY29uc29sZV9kZWJ1ZwAAA2VudgRleGl0AAADZW52C2VtX3RpbWVfbm93ABoDZW52E2RldnNfZGVwbG95X2hhbmRsZXIAAANlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABQNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAUDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAIWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcA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IAEQjwIQlwQQ4AELIAFBEGokAAu3AQMCfwF+AXwjAEEgayIBJAAgASAAQcgAaikDACIDNwMYAkACQCABKAIcQX9HDQAgA6ciAkGAgICAeEYNAAJAAkAgAkEASA0AIAEgAzcDEAwBCyABQRBqQQAgAmsQjAILIAAoApgBIAEpAxA3AyAMAQsgASABKQMYNwMIAkAgACABQQhqEI8CIgREAAAAAAAAAABjRQ0AIAAgBJoQ4AEMAQsgACgCmAEgASkDGDcDIAsgAUEgaiQACxUAIAAQygO4RAAAAAAAAPA9ohDgAQtNAQR/QQEhAQJAIABBABDeASICQQFNDQADQCABQQF0QQFyIgEgAkkNAAsLA0AgBBDKAyABcSIDIAMgAksiAxshBCADDQALIAAgBBDhAQsRACAAIABBABDfARCKBBDgAQsYACAAIABBABDfASAAQQEQ3wEQlAQQ4AELLgEDf0EAIQEgAEEAEN4BIQICQCAAQQEQ3gEiA0UNACACIANtIQELIAAgARDhAQsuAQN/QQAhASAAQQAQ3gEhAgJAIABBARDeASIDRQ0AIAIgA28hAQsgACABEOEBCxYAIAAgAEEAEN4BIABBARDeAWwQ4QELCQAgAEEBELoBC/ACAgR/AnwjAEEwayICJAAgAiAAQcgAaikDADcDKCACIABB0ABqKQMANwMgAkAgAigCLEF/Rw0AIAIoAiRBf0cNACACIAIpAyg3AxggACACQRhqEJACIQMgAiACKQMgNwMQIAAgAkEQahCQAiEEAkACQAJAIAFFDQAgAkEoaiEFIAMgBE4NAQwCCyACQShqIQUgAyAESg0BCyACQSBqIQULIAAoApgBIAUpAwA3AyALIAIgAikDKDcDCCAAIAJBCGoQjwIhBiACIAIpAyA3AwAgACACEI8CIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCmAFBACkDyEY3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKYASABKQMANwMgIAJBMGokAAsJACAAQQAQugELagECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0B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QEEQIAIoAgQiBEEPcSAEQYCAwP8HcRsiBQ4RBAULBgEIDAwABwgMDAwMDA0MCyACKAIAIgZFDQIgBigCAEGAgID4AHFBgICAMEYhBgwBCyACKAIAQf//AEshBgsgBkUNACAAIAIpAwA3AwAMCwsgBQ4RAAEHAgYECAgFAwQICAgICAkICwJAAkACQAJAAkACQAJAAkAgAigCACICDkQAAQQHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHAgMFBgcLIABCqoCBgMAANwMADBALIABCmICBgMAANwMADA8LIABCxYCBgMAANwMADA4LIABCr4CBgMAANwMADA0LIABCiYCBgMAANwMADAwLIABChICBgMAANwMADAsLIABCgYCBgMAANwMADAoLAkAgAkGgf2oiAkESSw0AIAMgAjYCECAAIAFB5S4gA0EQahD9AQwKC0HOKkH+AEHKGhDQAwALIAMgAigCADYCICAAIAFB9S0gA0EgahD9AQwICyACKAIAIQIgAyABKAKQATYCPCADIANBPGogAhCAATYCMCAAIAFBki4gA0EwahD9AQwHCyADIAEoApABNgJMIAMgA0HMAGogBEEEdkH//wNxEIABNgJAIAAgAUGhLiADQcAAahD9AQwGCyADIAEoApABNgJcIAMgA0HcAGogBEEEdkH//wNxEIABNgJQIAAgAUG6LiADQdAAahD9AQwFCwJAAkAgAigCACIEDQBBACEEDAELIAQtAANBD3EhBAsCQAJAAkACQAJAIARBfWoOBQADAgQBBAsgAEKPgIGAwAA3AwAMCAsgAEKcgIGAwAA3AwAMBwsgAyACKQMANwNgIAAgASADQeAAahCAAgwGCyAAQqaAgYDAADcDAAwFC0HOKkGaAUHKGhDQAwALIAIoAgBBgIABTw0EIAMgAikDADcDaCAAIAEgA0HoAGoQgAIMAwsgAigCACECIAMgASgCkAE2AnwgAyADQfwAaiACEIEBNgJwIAAgAUGvLiADQfAAahD9AQwCC0HOKkGjAUHKGhDQAwALIAMgAikDADcDCCADQYABaiABIANBCGoQjwJBBxDYAyADIANBgAFqNgIAIAAgAUGbEyADEP0BCyADQcABaiQADwtBizhBzipBnQFByhoQ1QMA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QQAoApC0ASICRQ0AIAIgACAAEJsEEIgCIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoApC3ASIEIABBxABqKAIAIgJrQQBIDQAgAEEoaiIEIAArAxggAiADa7iiIAQrAwCgOQMADAELIABBKGoiAiAAKwMYIAQgA2u4oiACKwMAoDkDACAEIQILIAAgAjYCFAJAIABBOGorAwAgAWNFDQAgACABOQM4CwJAIABBMGorAwAgAWRFDQAgACABOQMwCyAAIAE5AxgLC8YCAgJ+BH8CQAJAAkACQCABEPMDDgQAAQICAwsgAEICNwMADwsCQCABRAAAAAAAAAAAZEUNACAAQsIANwMADwsgAELDADcDAA8LIABCgICAgHA3AwAPCwJAIAG9IgJCIIgiAyAChKcNACAAQoCAgIBwNwMADwsCQCADpyIEQRR2Qf8PcSIFQf8HSQ0AIAKnIQYCQAJAIAVBkwhLDQAgBg0CAkAgBUGTCEYNACAEQf//P3EgBUGNeGp0DQMLIARB//8/cUGAgMAAckGTCCAFa3YhBQwBCwJAIAVBnghJDQAgBg0CIARBgICAj3xHDQIgAEKAgICAeDcDAA8LIAYgBUHtd2oiB3QNASAEQf//P3FBgIDAAHIgB3QgBkGzCCAFa3ZyIQULIABBfzYCBCAAIAVBACAFayACQn9VGzYCAA8LIAAgATkDAAsQACAAIAE2AgAgAEF/NgIECw8AIABCwABCASABGzcDAAs7AAJAIAMNACAAQgA3AwAPCwJAIAJBCHFFDQAgACADNgIAIAAgAjYCBA8LQcw6QYsrQdsAQfsTENUDAAuDAgICfwF8IwBBIGsiAiQAAkACQCABKAIEIgNBf0cNACABKAIAtyEEDAELAkAgAUEGai8BAEHw/wFxRQ0AIAErAwAhBAwBCwJAAkAgAw0AAkACQAJAAkAgASgCACIBQUBqDgQABQECAwtEAAAAAAAA8D8hBAwFC0QAAAAAAADwfyEEDAQLRAAAAAAAAPD/IQQMAwtEAAAAAAAA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KAI4IAEvATBqIgRKDQAgBCAALwEGTg0AIAMNASAAIAQ7AQQMAQsgAkEQaiABQfUAEIgBCyACQSBqJAALCwAgASABEPwCEHoLKgACQCACQdMBai0AAEEBcUUNACAAIAJB3gFqLwEAEIwCDwsgAEIANwMAC1UBAn8jAEEQayICJAAgAkEIaiABEPsCAkACQCABKAI4IgMgACgCEC8BCEkNACACIAFB9gAQiAEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQ+wICQAJAIAEoAjgiAyABKAKQAS8BDEkNACACIAFB+AAQiAEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALWAEDfyMAQSBrIgIkACACQRhqIAEQ+wIgARD8AiEDIAEQ/AIhBCACQRBqIAFBARD+AiACIAIpAxA3AwAgAkEIaiABIAAgBCADIAIgAkEYahBdIAJBIGokAAtNAAJAIAJB0wFqLQAAQQFxDQAgAkHdAWotAABBMEsNACACQd4BaiICLwEAQYDgA3FBgCBHDQAgACACLwEAQf8fcRCMAg8LIABCADcDAAs3AQF/AkAgAigCOCIDIAEoAhAvAQhPDQAgACABIANBA3RqQRhqKQMANwMADwsgACACQekAEIgBCzgBAX8CQCACKAI4IgMgAigCkAEvAQxPDQAgACACKAIAIANBA3RqKQMANwMADwsgACACQeoAEIgBCykAAkAgAkHTAWotAABBAXENACAAIAJB3gFqLwEAEIwCDwsgAEIANwMAC0oBAX8jAEEgayIDJAAgA0EYaiACEPsCIANBEGogAhD7AiADIAMpAxA3AwggAyADKQMYNwMAIAAgAiADQQhqIAMQ2QEgA0EgaiQAC2EBAX8jAEEwayICJAAgAkEoaiABEPsCIAJBIGogARD7AiACQRhqIAEQ+wIgAiACKQMYNwMQIAIgAikDIDcDCCACIAIpAyg3AwAgASACQRBqIAJBCGogAhDaASACQTBqJAALwwEBAn8jAEHAAGsiAyQAIANBIGogAhD7AiADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAFyIQQCQAJAIARBfyADQRxqIAQQmwIbIgRBf0oNACADQThqIAJB8AAQiAEgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDXAQsgA0HAAGokAAvDAQECfyMAQcAAayIDJAAgA0EgaiACEPsCIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAAnIhBAJAAkAgBEF/IANBHGogBBCbAhsiBEF/Sg0AIANBOGogAkHwABCIASADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENcBCyADQcAAaiQAC8MBAQJ/IwBBwABrIgMkACADQSBqIAIQ+wIgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIADciEEAkACQCAEQX8gA0EcaiAEEJsCGyIEQX9KDQAgA0E4aiACQfAAEIgBIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ1wELIANBwABqJAALjQEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQmwIbIgRBf0oNACADQRhqIAJB8AAQiAEgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBABDQASEEIAMgAykDEDcDACAAIAIgBCADENYBIANBIGokAAuNAQECfyMAQSBrIgMkACACKAI4IQQgAyACKAKQATYCDCAEQYCAAXIhBAJAAkAgBEF/IANBDGogBBCbAhsiBEF/Sg0AIANBGGogAkHwABCIASADQgA3AxAMAQsgAyAENgIQIANBBDYCFAsgAkESENABIQQgAyADKQMQNwMAIAAgAiAEIAMQ1gEgA0EgaiQAC0YBA38jAEEQayICJAACQCABEJMBIgMNACABQRAQZgsgASgCmAEhBCACQQhqIAFBCCADEI4CIAQgAikDCDcDICACQRBqJAALUwEDfyMAQRBrIgIkAAJAIAEgARD8AiIDEJQBIgQNACABIANBA3RBEGoQZgsgASgCmAEhAyACQQhqIAFBCCAEEI4CIAMgAikDCDcDICACQRBqJAALUAEDfyMAQRBrIgIkAAJAIAEgARD8AiIDEJUBIgQNACABIANBDGoQZgsgASgCmAEhAyACQQhqIAFBCCAEEI4CIAMgAikDCDcDICACQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigAkAFBPGooAgBBA3YgAigCOCIESw0AIANBCGogAkHvABCIASAAQgA3AwAMAQsgACAENgIAIABBAjYCBAsgA0EQaiQAC2YBAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQCQAJAIARBfyADQQRqIAQQmwIbIgRBf0oNACADQQhqIAJB8AAQiAEgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIANBEGokAAtvAQJ/IwBBEGsiAyQAIAIoAjghBCADIAIoApABNgIEIARBgIABciEEAkACQCAEQX8gA0EEaiAEEJsCGyIEQX9KDQAgA0EIaiACQfAAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbwECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAnIhBAJAAkAgBEF/IANBBGogBBCbAhsiBEF/Sg0AIANBCGogAkHwABCIASAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC28BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgANyIQQCQAJAIARBfyADQQRqIAQQmwIbIgRBf0oNACADQQhqIAJB8AAQiAEgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIANBEGokAAtXAQJ/IwBBEGsiAyQAAkACQCACKAI4IgQgAigAkAFBJGooAgBBBHZJDQAgA0EIaiACQfIAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEDNgIECyADQRBqJAALDAAgACACKAI4EIwCC0cBAX8CQCACKAI4IgMgAigAkAFBNGooAgBBA3ZPDQAgACACKACQASICIAIoAjBqIANBA3RqKQAANwMADwsgACACQesAEIgBCw0AIABBACkDwEY3AwALSAEDfyMAQRBrIgMkACACEPwCIQQgAhD8AiEFIANBCGogAkECEP4CIAMgAykDCDcDACAAIAIgASAFIAQgA0EAEF0gA0EQaiQACxAAIAAgAigCmAEpAyA3AwAL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DAELIAAgBCkDADcDAAsgA0EQaiQAC1QBAn8jAEEQayIDJAACQAJAIAIoAjgiBCACKACQAUEkaigCAEEEdkkNACADQQhqIAJBqAEQiAEgAEIANwMADAELIAAgAiABIAQQ0wELIANBEGokAAurAQEDfyMAQSBrIgMkACADQRBqIAIQ+wIgAyADKQMQNwMIQQAhBAJAIAIgA0EIahCYAiIFQQlLDQAgBUGeygBqLQAAIQQLAkACQCAEDQAgAEIANwMADAELIAIgBDYCOCADIAIoApABNgIEAkAgA0EEaiAEQYCAAXIiBBCbAg0AIANBGGogAkHwABCIASAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EgaiQACw0AIABBACkD0EY3AwALcQEBfyMAQSBrIgMkACADQRhqIAIQ+wIgAyADKQMYNwMQAkACQAJAIANBEGoQ+gENACADKAIcDQEgAygCGEECRw0BCyAAIAMpAxg3AwAMAQsgAyADKQMYNwMIIAAgAiADQQhqEI8CEIsCCyADQSBqJAALPwEBfwJAIAEtADIiAg0AIAAgAUHsABCIAQ8LIAEgAkF/aiICOgAyIAAgASACQf8BcUEDdGpBwABqKQMANwMAC2sBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCIAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQcAAaikDADcDCAsgASABKQMINwMAIAAgARCQAiEAIAFBEGokACAAC2sBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCIAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQcAAaikDADcDCAsgASABKQMINwMAIAAgARCQAiEAIAFBEGokACAAC/IBAQJ/IwBBMGsiAyQAAkACQCABLQAyIgQNACADQShqIAFB7AAQiAEMAQsgASAEQX9qIgQ6ADIgAyABIARB/wFxQQN0akHAAGopAwA3AygLIAMgAykDKDcDGAJAAkAgASADQRhqEJICDQACQCACQQJxRQ0AIAMgAykDKDcDECABIANBEGoQ+QENAQsgA0EgaiABQf0AEIgBIABBACkDwEY3AwAMAQsCQCACQQFxRQ0AIAMgAykDKDcDCCABIANBCGoQkwINACADQSBqIAFBlAEQiAEg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OwAADwsgACACQQAgAkEAShs2AAAPCyAAIAJBACACQQBKG603AAAPCyAAIAJB/wAgAkH/AEgbIgFBgH8gAUGAf0obOgAADwsgACACQf//ASACQf//AUgbIgFBgIB+IAFBgIB+Shs7AAAPCyAAIAI2AAAPCyAAIAKsNwAADwtBnidBrgFBpzIQ0AMACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAuzAwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEKQDtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBnidBygFBuzIQ0AMAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQpAO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoAuy2ASICIABHDQBB7LYBIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhD3AxoLIABB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BEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAu1BAIEfgJ/AkACQCABvSICQgGGIgNQDQAgAkL///////////8Ag0KAgICAgICA+P8AVg0AIAC9IgRCNIinQf8PcSIGQf8PRw0BCyAAIAGiIgEgAaMPCwJAIARCAYYiBSADVg0AIABEAAAAAAAAAACiIAAgBSADURsPCyACQjSIp0H/D3EhBwJAAkAgBg0AQQAhBgJAIARCDIYiA0IAUw0AA0AgBkF/aiEGIANCAYYiA0J/VQ0ACwsgBEEBIAZrrYYhAwwBCyAEQv////////8Hg0KAgICAgICA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AQsCQANAIAAtAAAiAyABLQAAIgRHDQEgAUEBaiEBIABBAWohACACQX9qIgJFDQIMAAsACyADIARrDwtBAAsNAEG4uQEQhwRBvLkBCxAAIAGaIAEgABsQkAQgAaILFQEBfyMAQRBrIgEgADkDCCABKwMICxAAIABEAAAAAAAAAHAQjwQLEAAgAEQAAAAAAAAAEBCPBAsFACAAmQurCQMGfwN+CXwjAEEQayICJAAgAb0iCEI0iKciA0H/D3EiBEHCd2ohBQJAAkACQCAAvSIJQjSIpyIGQYFwakGCcEkNAEEAIQcgBUH/fksNAQsCQCAIQgGGIgpCf3xC/////////29UDQBEAAAAAAAA8D8hCyAJQoCAgICAgID4P1ENAiAKUA0CAkACQCAJQgGGIglCgICAgICAgHBWDQAgCkKBgICAgICAcFQNAQsgACABoCELDAMLIAlCgICAgICAgPD/AFENAkQAAAAAAAAAACABIAGiIAhCP4inQQFzIAlCgICAgICAgPD/AFRGGyELDAILAkAgCUIBhkJ/fEL/////////b1QNACAAIACiIQsCQCAJQn9VDQAgC5ogCyAIEJUEQQFGGyELCyAIQn9VDQIgAkQAAAAAAADwPyALozkDCCACKwMIIQsMAgtBACEHAkAgCUJ/VQ0AAkAgCBCVBCIHDQAgABCJBCELDAMLIAZB/w9xIQYgCUL///////////8AgyEJIAdBAUZBEnQhBwsCQCAFQf9+Sw0ARAAAAAAAAPA/IQsgCUKAgICAgICA+D9RDQICQCAEQb0HSw0AIAEgAZogCUKAgICAgICA+D9WG0QAAAAAAADwP6AhCwwDCwJAIANBgBBJIAlCgYCAgICAgPg/VEYNAEEAEJEEIQsMAwtBABCSBCELDAILIAYNACAARAAAAAAAADBDor1C////////////AINCgICAgICAgOB8fCEJCwJAIAhCgICAQIO/IgwgCSAJQoCAgICw1dqMQHwiCEKAgICAgICAeIN9IglCgICAgAh8QoCAgIBwg78iCyAIQi2Ip0H/AHFBBXQiBUGAhAFqKwMAIg2iRAAAAAAAAPC/oCIAIABBACsDyIMBIg6iIg+iIhAgCEI0h6e3IhFBACsDuIMBoiAFQZCEAWorAwCgIhIgACANIAm/IAuhoiIToCIAoCILoCINIBAgCyANoaAg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KAIsIgMgAWusfDcDeAJAIAEgA0sNACABQX9qIAI6AAALIAILEAAgAEEgRiAAQXdqQQVJcguuAQACQAJAIAFBgAhIDQAgAEQAAAAAAADgf6IhAAJAIAFB/w9PDQAgAUGBeGohAQwCCyAARAAAAAAAAOB/oiEAIAFB/RcgAUH9F0gbQYJwaiEBDAELIAFBgXhKDQAgAEQAAAAAAABgA6IhAAJAIAFBuHBNDQAgAUHJB2ohAQwBCyAARAAAAAAAAGADoiEAIAFB8GggAUHwaEobQZIPaiEBCyAAIAFB/wdqrUI0hr+iCzUAIAAgATcDACAAIARCMIinQYCAAnEgAkIwiKdB//8BcXKtQjCGIAJC////////P4OENwMIC+cCAQF/IwBB0ABrIgQkAAJAAkAgA0GAgAFIDQAgBEEgaiABIAJCAEKAgICAgICA//8AEL0EIARBIGpBCGopAwAhAiAEKQMgIQECQCADQf//AU8NACADQYGAf2ohAwwCCyAEQRBqIAEgAkIAQoCAgICAgID//wAQvQQgA0H9/wIgA0H9/wJIG0GCgH5qIQMgBEEQakEIaikDACECIAQpAxAhAQwBCyADQYGAf0oNACAEQcAAaiABIAJCAEKAgICAgICAORC9BCAEQcAAakEIaikDACECIAQpA0AhAQJAIANB9IB+TQ0AIANBjf8AaiEDDAELIARBMGogASACQgBCgICAgICAgDkQvQQgA0HogX0gA0HogX1KG0Ga/gFqIQMgBEEwakEIaikDACECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEL0EIAAgBEEIaikDADcDCCAAIAQpAwA3AwAgBEHQAGokAAtLAgF+An8gAUL///////8/gyECAkACQCABQjCIp0H//wFxIgNB//8BRg0AQQQhBCADDQFBAkEDIAIgAIRQGw8LIAIgAIRQIQQLIAQL2wYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCzBEUNACADIAQQowQhBiACQjCIpyIHQf//AXEiCEH//wFGDQAgBg0BCyAFQRBqIAEgAiADIAQQvQQgBSAFKQMQIgQgBUEQakEIaikDACIDIAQgAxC1BCAFQQhqKQMAIQIgBSkDACEEDAELAkAgASAIrUIwhiACQv///////z+DhCIJIAMgBEIwiKdB//8BcSIGrUIwhiAEQv///////z+DhCIKELMEQQBKDQACQCABIAkgAyAKELMERQ0AIAEhBAwCCyAFQfAAaiABIAJCAEIAEL0EIAVB+ABqKQMAIQIgBSkDcCEEDAELAkACQCAIRQ0AIAEhBAwBCyAFQeAAaiABIAlCAEKAgICAgIDAu8AAEL0EIAVB6ABqKQMAIglCMIinQYh/aiEIIAUpA2AhBAsCQCAGDQAgBUHQAGogAyAKQgBCgICAgICAwLvAABC9BCAFQdgAaikDACIKQjCIp0GIf2ohBiAFKQNQIQMLIApC////////P4NCgICAgICAwACEIQsgCUL///////8/g0KAgICAgIDAAIQhCQJAIAggBkwNAANAAkACQCAJIAt9IAQgA1StfSIKQgBTDQACQCAKIAQgA30iBIRCAFINACAFQSBqIAEgAkIAQgAQvQQgBUEoaikDACECIAUpAyAhBAwFCyAKQgGGIARCP4iEIQkMAQsgCUIBhiAEQj+IhCEJCyAEQgGGIQQgCEF/aiIIIAZKDQALIAYhCAsCQAJAIAkgC30gBCADVK19IgpCAFkNACAJIQoMAQsgCiAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEL0EIAVBOGopAwAhAiAFKQMwIQQMAQsCQCAKQv///////z9WDQADQCAEQj+IIQMgCEF/aiEIIARCAYYhBCADIApCAYaEIgpCgICAgICAwABUDQALCyAHQYCAAnEhBgJAIAhBAEoNACAFQcAAaiAEIApC////////P4MgCEH4AGogBnKtQjCGhEIAQoCAgICAgMDDPxC9BCAFQcgAaikDACECIAUpA0AhBAwBCyAKQv///////z+DIAggBnKtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALHAAgACACQv///////////wCDNwMIIAAgATcDAAuOCQIGfwN+IwBBMGsiBCQAQgAhCgJAAkAgAkECSw0AIAFBBGohBSACQQJ0IgJBzKQBaigCACEGIAJBwKQBaigCACEHA0ACQAJAIAEoAgQiAiABKAJoRg0AIAUgAkEBajYCACACLQAAIQIMAQsgARCeBCECCyACEJ8EDQALQQEhCAJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQgCQCABKAIEIgIgASgCaEYNACAFIAJBAWo2AgAgAi0AACEC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IAJ0IgJxDQBBACAEIAJyNgLIuQEgACECDAELIAAoAgghAgsgACABNgIIIAIgATYCDCABIAA2AgwgASACNgIIDwtBHyECAkAgAEH///8HSw0AIABBCHYiAiACQYD+P2pBEHZBCHEiAnQiBCAEQYDgH2pBEHZBBHEiBHQiBiAGQYCAD2pBEHZBAnEiBnRBD3YgAiAEciAGcmsiAkEBdCAAIAJBFWp2QQFxckEcaiECCyABQgA3AhAgAUEcaiACNgIAIAJBAnRB+LsBaiEEAkACQAJAAkBBACgCzLkBIgZBASACdCIDcQ0AQQAgBiADcjYCzLkBIAQgATYCACABQRhqIAQ2AgAMAQsgAEEAQRkgAkEBdmsgAkEfRht0IQIgBCgCACEGA0AgBiIEKAIEQXhxIABGDQIgAkEddiEGIAJBAXQhAiAEIAZBBHFqQRBqIgMoAgAiBg0ACyADIAE2AgAgAUEYaiAENgIACyABIAE2AgwgASABNgIIDAELIAQoAggiACABNgIMIAQgATYCCCABQRhqQQA2AgAgASAENgIMIAEgADYCCAtBAEEAKALouQFBf2oiAUF/IAEbNgLouQELCwcAPwBBEHQLVAECf0EAKAL8qAEiASAAQQNqQXxxIgJqIQACQAJAIAJFDQAgACABTQ0BCwJAIAAQrwRNDQAgABATRQ0BC0EAIAA2AvyoASABDwsQ8gNBMDYCAEF/C+gKAgR/BH4jAEHwAGsiBSQAIARC////////////AIMhCQJAAkACQCABUCIGIAJC////////////AIMiCkKAgICAgIDAgIB/fEKAgICAgIDAgIB/VCAKUBsNACADQgBSIAlCgICAgICAwICAf3wiC0KAgICAgIDAgIB/ViALQoCAgICAgMCAgH9RGw0BCwJAIAYgCkKAgICAgIDA//8AVCAKQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhBCABIQMMAgsCQCADUCAJQoCAgICAgMD//wBUIAlCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEEDAILAkAgASAKQoCAgICAgMD//wCFhEIAUg0AQoCAgICAgOD//wAgAiADIAGFIAQgAoVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCUKAgICAgIDA//8AhYRQDQECQCABIAqEQgBSDQAgAyAJhEIAUg0CIAMgAYMhAyAEIAKDIQQMAgsgAyAJhFBFDQAgASEDIAIhBAwBCyADIAEgAyABViAJIApWIAkgClEbIgcbIQogBCACIAcbIglC////////P4MhCyACIAQgBxsiDEIwiKdB//8BcSEIAkAgCUIwiKdB//8BcSIGDQAgBUHgAGogCiALIAogCyALUCIGG3kgBkEGdK18pyIGQXFqELIEQRAgBmshBiAFQegAaikDACELIAUpA2AhCgsgASADIAcbIQMgDEL///////8/gyEEAkAgCA0AIAVB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0FxahCyBEEQIAdrIQggBUHYAGopAwAhBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQIgC0IDhiAKQj2IhCEEIANCA4YhASAJIAyFIQMCQCAGIAhGDQACQCAGIAhrIgdB/wBNDQBCACECQgEhAQwBCyAFQcAAaiABIAJBgAEgB2sQsgQgBUEwaiABIAIgBxC8BCAFKQMwIAUpA0AgBUHAAGpBCGopAwCEQgBSrYQhASAFQTBqQQhqKQMAIQILIARCgICAgICAgASEIQwgCkIDhiELAkACQCADQn9VDQBCACEDQgAhBCALIAGFIAwgAoWEUA0CIAsgAX0hCiAMIAJ9IAsgAVStfSIEQv////////8DVg0BIAVBIGogCiAEIAogBCAEUCIHG3kgB0EGdK18p0F0aiIHELIEIAYgB2shBiAFQShqKQMAIQQgBSkDICEKDAELIAIgDHwgASALfCIKIAFUrXwiBEKAgICAgICACINQDQAgCkIBiCAEQj+GhCAKQgGDhCEKIAZBAWohBiAEQgGIIQQLIAlCgICAgICAgICAf4MhAQJAIAZB//8BSA0AIAFCgICAgICAwP//AIQhBEIAIQMMAQtBACEHAkACQCAGQQBMDQAgBiEHDAELIAVBEGogCiAEIAZB/wBqELIEIAUgCiAEQQEgBmsQvAQgBSkDACAFKQMQIAVBEGpBCGopAwCEQgBSrYQhCiAFQQhqKQMAIQQLIApCA4ggBEI9hoQhAyAHrUIwhiAEQgOIQv///////z+DhCABhCEEIAqnQQdxIQYCQAJAAkACQAJAELoEDgMAAQIDCyAEIAMgBkEES618IgogA1StfCEEAkAgBkEERg0AIAohAwwDCyAEIApCAYMiASAKfCIDIAFUrXwhBAwDCyAEIAMgAUIAUiAGQQBHca18IgogA1StfCEEIAohAwwBCyAEIAMgAVAgBkEAR3GtfCIKIANUrXwhBCAKIQMLIAZFDQELELsEGgsgACADNwMAIAAgBDcDCCAFQfAAaiQAC1MBAX4CQAJAIANBwABxRQ0AIAEgA0FAaq2GIQJCACEBDAELIANFDQAgAUHAACADa62IIAIgA60iBIaEIQIgASAEhiEBCyAAIAE3AwAgACACNwMIC+ABAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AAkAgAiAAhCAGIAWEhFBFDQBBAA8LAkAgAyABg0IAUw0AQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwJ+QX8hBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNAAJAIAIgAIQgBiAFhIRQRQ0AQQAPCwJAIAMgAYNCAFMNACAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwsgACACViABIANVIAEgA1EbDQAgACAChSABIAOFhEIAUiEECyAEC98QAgV/Dn4jAEHQAmsiBSQAIARC////////P4MhCiACQv///////z+DIQsgBCAChUKAgICAgICAgIB/gyEMIARCMIinQf//AXEhBgJAAkACQCACQjCIp0H//wFxIgdBgYB+akGCgH5JDQBBACEIIAZBgYB+akGBgH5LDQELAkAgAVAgAkL///////////8AgyINQoCAgICAgMD//wBUIA1CgICAgICAwP//AFEbDQAgAkKAgICAgIAghCEMDAILAkAgA1AgBEL///////////8AgyICQoCAgICAgMD//wBUIAJCgICAgICAwP//AFEbDQAgBEKAgICAgIAghCEMIAMhAQwCCwJAIAEgDUKAgICAgIDA//8AhYRCAFINAAJAIAMgAkKAgICAgIDA//8AhYRQRQ0AQgAhAUKAgICAgIDg//8AIQwMAwsgDEKAgICAgIDA//8AhCEMQgAhAQwCCwJAIAMgAkKAgICAgIDA//8AhYRCAFINAEIAIQEMAgsCQCABIA2EQgBSDQBCgICAgICA4P//ACAMIAMgAoRQGyEMQgAhAQwCCwJAIAMgAoRCAFINACAMQoCAgICAgMD//wCEIQxCACEBDAILQQAhCAJAIA1C////////P1YNACAFQcACaiABIAsgASALIAtQIggbeSAIQQZ0rXynIghBcWoQsgRBECAIayEIIAVByAJqKQMAIQsgBSkDwAIhAQsgAkL///////8/Vg0AIAVBsAJqIAMgCiADIAogClAiCRt5IAlBBnStfKciCUFxahCyBCAJIAhqQXBqIQggBUG4AmopAwAhCiAFKQOwAiEDCyAFQaACaiADQjGIIApCgICAgICAwACEIg5CD4aEIgJCAEKAgICAsOa8gvUAIAJ9IgRCABC+BCAFQZACakIAIAVBoAJqQQhqKQMAfUIAIARCABC+BCAFQYACaiAFKQOQAkI/iCAFQZACakEIaikDAEIBhoQiBEIAIAJCABC+BCAFQfABaiAEQgBCACAFQYACakEIaikDAH1CABC+BCAFQeABaiAFKQPwAUI/iCAFQfABakEIaikDAEIBhoQiBEIAIAJCABC+BCAFQdABaiAEQgBCACAFQeABakEIaikDAH1CABC+BCAFQcABaiAFKQPQAUI/iCAFQdABakEIaikDAEIBhoQiBEIAIAJCABC+BCAFQbABaiAEQgBCACAFQcABakEIaikDAH1CABC+BCAFQaABaiACQgAgBSkDsAFCP4ggBUGwAWpBCGopAwBCAYaEQn98IgRCABC+BCAFQZABaiADQg+GQgAgBEIAEL4EIAVB8ABqIARCAEIAIAVBoAFqQQhqKQMAIAUpA6ABIgogBUGQAWpBCGopAwB8IgIgClStfCACQgFWrXx9QgAQvgQgBUGAAWpCASACfUIAIARCABC+BCAIIAcgBmtqIQYCQAJAIAUpA3AiD0IBhiIQIAUpA4ABQj+IIAVBgAFqQQhqKQMAIhFCAYaEfCINQpmTf3wiEkIgiCICIAtCgICAgICAwACEIhNCAYYgAUI/iIQiFEIgiCIEfiILIAFCAYYiFUIgiCIKIAVB8ABqQQhqKQMAQgGGIA9CP4iEIBFCP4h8IA0gEFStfCASIA1UrXxCf3wiD0IgiCINfnwiECALVK0gECAPQv////8PgyILIBRC/////w+DIg9+fCIRIBBUrXwgDSAEfnwgCyAEfiIWIA8gDX58IhAgFlStQiCGIBBCIIiEfCARIBBCIIZ8IhAgEVStfCAQIBJC/////w+DIhIgD34iFiACIAp+fCIRIBZUrSARIAsgFUL+////D4MiFn58IhcgEVStfHwiESAQVK18IBEgEiAEfiIQIBYgDX58IgQgAiAPfnwiDSALIAp+fCILQiCIIAQgEFStIA0gBFStfCALIA1UrXxCIIaEfCIEIBFUrXwgBCAXIAIgFn4iAiASIAp+fCIKQiCIIAogAlStQiCGhHwiAiAXVK0gAiALQiCGfCACVK18fCICIARUrXwiBEL/////////AFYNACAFQdAAaiACIAQgAyAOEL4EIAFCMYYgBUHQAGpBCGopAwB9IAUpA1AiAUIAUq19IQ0gBkH+/wBqIQZCACABfSEKDAELIAVB4ABqIAJCAYggBEI/hoQiAiAEQgGIIgQgAyAOEL4EIAFCMIYgBUHgAGpBCGopAwB9IAUpA2AiCkIAUq19IQ0gBkH//wBqIQZCACAKfSEKIAEhFSATIRQLAkAgBkH//wFIDQAgDEKAgICAgIDA//8AhCEMQgAhAQwBCwJAAkAgBkEBSA0AIA1CAYYgCkI/iIQhDSAGrUIwhiAEQv///////z+DhCELIApCAYYhBAwBCwJAIAZBj39KDQBCACEBDAILIAVBwABqIAIgBEEBIAZrELwEIAVBMGogFSAUIAZB8ABqELIEIAVBIGogAyAOIAUpA0AiAiAFQcAAakEIaikDACILEL4EIAVBMGpBCGopAwAgBUEgakEIaikDAEIBhiAFKQMgIgFCP4iEfSAFKQMwIgQgAUIBhiIBVK19IQ0gBCABfSEECyAFQRBqIAMgDkIDQgAQvgQgBSADIA5CBUIAEL4EIAsgAiACQgGDIgEgBHwiBCADViANIAQgAVStfCIBIA5WIAEgDlEbrXwiAyACVK18IgIgAyACQoCAgICAgMD//wBUIAQgBSkDEFYgASAFQRBqQQhqKQMAIgJWIAEgAlEbca18IgIgA1StfCIDIAIgA0KAgICAgIDA//8AVCAEIAUpAwBWIAEgBUEIaikDACIEViABIARRG3GtfCIBIAJUrXwgDIQhDAsgACABNwMAIAAgDDcDCCAFQdACaiQAC44CAgJ/A34jAEEQayICJAACQAJAIAG9IgRC////////////AIMiBUKAgICAgICAeHxC/////////+//AFYNACAFQjyGIQYgBUIEiEKAgICAgICAgDx8IQUMAQsCQCAFQoCAgICAgID4/wBUDQAgBEI8hiEGIARCBIhCgICAgICAwP//AIQhBQwBCwJAIAVQRQ0AQgAhBkIAIQUMAQsgAiAFQgAgBKdnQSBqIAVCIIinZyAFQoCAgIAQVBsiA0ExahCyBCACQQhqKQMAQoCAgICAgMAAhUGM+AAgA2utQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSAEQoCAgICAgICAgH+DhDcDCCACQRBqJAAL4QECA38CfiMAQRBrIgIkAAJAAkAgAbwiA0H/////B3EiBEGAgIB8akH////3B0sNACAErUIZhkKAgICAgICAwD98IQVCACEGDAELAkAgBEGAgID8B0kNACADrUIZhkKAgICAgIDA//8AhCEFQgAhBgwBCwJAIAQNAEIAIQZCACEFDAELIAIgBK1CACAEZyIEQdEAahCyBCACQQhqKQMAQoCAgICAgMAAhUGJ/wAgBGutQjCGhCEFIAIpAwAhBgsgACAGNwMAIAAgBSADQYCAgIB4ca1CIIaENwMIIAJBEGokAAuNAQICfwJ+IwBBEGsiAiQAAkACQCABDQBCACEEQgAhBQwBCyACIAEgAUEfdSIDcyADayIDrUIAIANnIgNB0QBqELIEIAJBCGopAwBCgICAgICAwACFQZ6AASADa61CMIZ8IAFBgICAgHhxrUIghoQhBSACKQMAIQQLIAAgBDcDACAAIAU3AwggAkEQaiQAC3ICAX8CfiMAQRBrIgIkAAJAAkAgAQ0AQgAhA0IAIQQMAQsgAiABrUIAIAFnIgFB0QBqELIEIAJBCGopAwBCgICAgICAwACFQZ6AASABa61CMIZ8IQQgAikDACEDCyAAIAM3AwAgACAENwMIIAJBEGokAAsEAEEACwQAQQALUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgLnAsCBX8PfiMAQeAAayIFJAAgBEL///////8/gyEKIAQgAoVCgICAgICAgICAf4MhCyACQv///////z+DIgxCIIghDSAEQjCIp0H//wFxIQYCQAJAAkAgAkIwiKdB//8BcSIHQYGAfmpBgoB+SQ0AQQAhCCAGQYGAfmpBgYB+Sw0BCwJAIAFQIAJC////////////AIMiDkKAgICAgIDA//8AVCAOQoCAgICAgMD//wBRGw0AIAJCgICAgICAIIQhCwwCCwJAIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRGw0AIARCgICAgICAIIQhCyADIQEMAgsCQCABIA5CgICAgICAwP//AIWEQgBSDQACQCADIAKEUEUNAEKAgICAgIDg//8AIQtCACEBDAMLIAtCgICAgICAwP//AIQhC0IAIQEMAgsCQCADIAJCgICAgICAwP//AIWEQgBSDQAgASAOhCECQgAhAQJAIAJQRQ0AQoCAgICAgOD//wAhCwwDCyALQoCAgICAgMD//wCEIQsMAgsCQCABIA6EQgBSDQBCACEBDAILAkAgAyAChEIAUg0AQgAhAQwCC0EAIQgCQCAOQv///////z9WDQAgBUHQAGogASAMIAEgDCAMUCIIG3kgCEEGdK18pyIIQXFqELIEQRAgCGshCCAFQdgAaikDACIMQiCIIQ0gBSkDUCEBCyACQv///////z9WDQAgBUHAAGogAyAKIAMgCiAKUCIJG3kgCUEGdK18pyIJQXFqELIEIAggCWtBEGohCCAFQcgAaikDACEKIAUpA0AhAwsgA0IPhiIOQoCA/v8PgyICIAFCIIgiBH4iDyAOQiCIIg4gAUL/////D4MiAX58IhBCIIYiESACIAF+fCISIBFUrSACIAxC/////w+DIgx+IhMgDiAEfnwiESAKQg+GIANCMYiEIhRC/////w+DIgMgAX58IgogEEIgiCAQIA9UrUIghoR8Ig8gAiANQoCABIQiEH4iFSAOIAx+fCINIBRCIIhCgICAgAiEIgIgAX58IhQgAyAEfnwiFkIghnwiF3whASAHIAZqIAhqQYGAf2ohBgJAAkAgAiAEfiIYIA4gEH58IgQgGFStIAQgAyAMfnwiDiAEVK18IAIgEH58IA4gESATVK0gCiARVK18fCIEIA5UrXwgAyAQfiIDIAIgDH58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIBZCIIggDSAVVK0gFCANVK18IBYgFFStfEIghoR8IgQgAlStfCAEIA8gClStIBcgD1StfHwiAiAEVK18IgRCgICAgICAwACDUA0AIAZBAWohBgwBCyASQj+IIQMgBEIBhiACQj+IhCEEIAJCAYYgAUI/iIQhAiASQgGGIRIgAyABQgGGhCEBCwJAIAZB//8BSA0AIAtCgICAgICAwP//AIQhC0IAIQEMAQsCQAJAIAZBAEoNAAJAQQEgBmsiB0GAAUkNAEIAIQEMAwsgBUEwaiASIAEgBkH/AGoiBhCyBCAFQSBqIAIgBCAGELIEIAVBEGogEiABIAcQvAQgBSACIAQgBxC8BCAFKQMgIAUpAxCEIAUpAzAgBUEwakEIaikDAIRCAFKthCESIAVBIGpBCGopAwAgBUEQakEIaikDAIQhASAFQQhqKQMAIQQgBSkDACECDAELIAatQjCGIARC////////P4OEIQQLIAQgC4QhCwJAIBJQIAFCf1UgAUKAgICAgICAgIB/URsNACALIAJCAXwiASACVK18IQsMAQsCQCASIAFCgICAgICAgICAf4WEQgBRDQAgAiEBDAELIAsgAiACQgGDfCIBIAJUrXwhCwsgACABNwMAIAAgCzcDCCAFQeAAaiQAC3UBAX4gACAEIAF+IAIgA358IANCIIgiBCABQiCIIgJ+fCADQv////8PgyIDIAFC/////w+DIgF+IgVCIIggAyACfnwiA0IgiHwgA0L/////D4MgBCABfnwiA0IgiHw3AwggACADQiCGIAVC/////w+DhDcDAAtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwtIAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCxBCAFKQMAIQEgACAFQQhqKQMANwMIIAAgATcDACAFQRBqJAAL6gMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACIVCAFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyIDQZH3AEkNACACQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBCADQf+If2oQsgQgAiAAIARBgfgAIANrELwEIAIpAwAiBEI8iCACQQhqKQMAQgSGhCEFAkAgBEL//////////w+DIAIpAxAgAkEQakEIaikDAIRCAFKthCIEQoGAgICAgICACFQNACAFQgF8IQUMAQsgBEKAgICAgICAgAiFQgBSDQAgBUIBgyAFfCEFCyACQSBqJAAgBSABQoCAgICAgICAgH+DhL8LBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCxUAQcC9wQIkAkG4vQFBD2pBcHEkAQsHACMAIwFrCwQAIwILBAAjAQsNACABIAIgAyAAEQ4ACyQBAX4gACABIAKtIAOtQiCGhCAEEMkEIQUgBUIgiKcQFCAFpwsTACAAIAGnIAFCIIinIAIgAxAVCwuQoYGAAAMAQYAIC9icAWluZmluaXR5AC1JbmZpbml0eQBodW1pZGl0eQBhY2lkaXR5AGRldnNfdmVyaWZ5AGFycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAbWF4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4ACVzOiV4AGNsb3N1cmU6JWQ6JXgAbWV0aG9kOiVkOiV4AHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleABXU1NLLUg6IHVua25vd24gY21kICV4AHBvdwBqZF93c3NrX25ldwBpZGl2AHByZXYAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1ACVzOiV1AG5leHQAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABzcXJ0AGF1dGggdG9vIHNob3J0AGluc2VydABjYnJ0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AERldmljZVNjcmlwdAByZWJvb3QAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AHJhbmRvbUludABwYXJzZUludABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABvYmplY3QAcGFyc2VGbG9hdABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGNoYXJBdABmaWxsQXQAY2hhckNvZGVBdAB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGFicwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBmbG9vcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAc21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAHJlLXJ1bgBub24tZnVuAGJ1dHRvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AbmFuAGJvb2xlYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAc2Nhbl9nY19vYmoAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5ID49IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAbG9nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAZm5pZHggPD0gMHhmZmZmADAxMjM0NTY3ODlhYmNkZWYAJWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQB0cnVlAD92YWx1ZQB3cml0ZQBkZXZzX2ZpYmVyX2FjdGl2YXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAaGVhcnRSYXRlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1M6IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBkZXZzX21ha2VfY2xvc3VyZQBwcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG9uQ2hhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb25EaXNjb25uZWN0ZWQAV1M6IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAHVuZGVmaW5lZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZAAlLXMlZAAlLXNfJWQAJXMgZmliZXIgJXNfRiVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGphY2RhYy1jL2RldmljZXNjcmlwdC92ZXJpZnkuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9tYWluLmMAamFjZGFjLWMvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBqYWNkYWMtYy9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC90c2FnZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvamRpZmFjZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9nY19hbGxvYy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWAAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAYXJnMABsb2cxMABMTjEwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAGFjdC0+bWF4cGMgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBQQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAGFnZ2J1ZjogdXBsOiAnJXMnICVmICglLXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBmaWR4IDwgZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChv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b3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZUUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZUYPcm9sZW1ncl9wcm9jZXNzRxByb2xlbWdyX2F1dG9iaW5kSBVyb2xlbWdyX2hhbmRsZV9wYWNrZXRJFGpkX3JvbGVfbWFuYWdlcl9pbml0Shhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWRLDWpkX3JvbGVfYWxsb2NMEGpkX3JvbGVfZnJlZV9hbGxNFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmROEmpkX3JvbGVfYnlfc2VydmljZU8TamRfY2xpZW50X2xvZ19ldmVudFATamRfY2xpZW50X3N1YnNjcmliZVEUamRfY2xpZW50X2VtaXRfZXZlbnRSFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkUxBqZF9kZXZpY2VfbG9va3VwVBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2VVE2pkX3NlcnZpY2Vfc2VuZF9jbWRWEWpkX2NsaWVudF9wcm9jZXNzVw5qZF9kZXZpY2VfZnJlZVgXamRfY2xpZW50X2hhbmRsZV9wYWNrZXRZD2pkX2RldmljZV9hbGxvY1oOYWdnYnVmZmVyX2luaXRbD2FnZ2J1ZmZlcl9mbHVzaFwQYWdnYnVmZmVyX3VwbG9hZF0OZGV2c19idWZmZXJfb3BeEGRldnNfcmVhZF9udW1iZXJfD2RldnNfY3JlYXRlX2N0eGAJc2V0dXBfY3R4YQpkZXZzX3RyYWNlYg9kZXZzX2Vycm9yX2NvZGVjGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJkCWNsZWFyX2N0eGUNZGV2c19mcmVlX2N0eGYIZGV2c19vb21nCWRldnNfZnJlZWgXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NpB3RyeV9ydW5qDHN0b3BfcHJvZ3JhbWscZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydGwcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZW0YZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNobh1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldG8OZGVwbG95X2hhbmRsZXJwE2RlcGxveV9tZXRhX2hhbmRsZXJxFmRldmljZXNjcmlwdG1ncl9kZXBsb3lyFGRldmljZXNjcmlwdG1ncl9pbml0cxlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2dBFkZXZzY2xvdWRfcHJvY2Vzc3UXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXR2E2RldnNjbG91ZF9vbl9tZXRob2R3DmRldnNjbG91ZF9pbml0eBBkZXZzX2ZpYmVyX3lpZWxkeRhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb256CmRldnNfcGFuaWN7GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXwQZGV2c19maWJlcl9zbGVlcH0bZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsfgxsb2dfZmliZXJfb3B/GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzgAERZGV2c19pbWdfZnVuX25hbWWBARJkZXZzX2ltZ19yb2xlX25hbWWCARJkZXZzX2ZpYmVyX2J5X2ZpZHiDARFkZXZzX2ZpYmVyX2J5X3RhZ4QBEGRldnNfZmliZXJfc3RhcnSFARRkZXZzX2ZpYmVyX3Rlcm1pYW50ZYYBDmRldnNfZmliZXJfcnVuhwETZGV2c19maWJlcl9zeW5jX25vd4gBFV9kZXZzX3J1bnRpbWVfZmFpbHVyZYkBD2RldnNfZmliZXJfcG9rZYoBE2pkX2djX2FueV90cnlfYWxsb2OLAQdkZXZzX2djjAEPZmluZF9mcmVlX2Jsb2NrjQESZGV2c19hbnlfdHJ5X2FsbG9jjgEOZGV2c190cnlfYWxsb2OPAQtqZF9nY191bnBpbpABCmpkX2djX2ZyZWWRAQ5kZXZzX3ZhbHVlX3BpbpIBEGRldnNfdmFsdWVfdW5waW6TARJkZXZzX21hcF90cnlfYWxsb2OUARRkZXZzX2FycmF5X3RyeV9hbGxvY5UBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5YBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5cBGmRldnNfc3RyaW5nX3RyeV9hbGxvY19pbml0mAEPZGV2c19nY19zZXRfY3R4mQEOZGV2c19nY19jcmVhdGWaAQ9kZXZzX2djX2Rlc3Ryb3mbAQtzY2FuX2djX29iapwBCnNjYW5fYXJyYXmdARNzY2FuX2FycmF5X2FuZF9tYXJrngEIbWFya19wdHKfARFwcm9wX0FycmF5X2xlbmd0aKABEm1ldGgyX0FycmF5X2luc2VydKEBEWZ1bjFfQnVmZmVyX2FsbG9jogEScHJvcF9CdWZmZXJfbGVuZ3RoowEVbWV0aDBfQnVmZmVyX3RvU3RyaW5npAETbWV0aDNfQnVmZmVyX2ZpbGxBdKUBE21ldGg0X0J1ZmZlcl9ibGl0QXSmARlmdW4xX0RldmljZVNjcmlwdF9zbGVlcE1zpwEXZnVuMV9EZXZpY2VTY3JpcHRfcGFuaWOoARhmdW4wX0RldmljZVNjcmlwdF9yZWJvb3SpARhmdW5YX0RldmljZVNjcmlwdF9mb3JtYXSqARVmdW4xX0RldmljZVNjcmlwdF9sb2erARxmdW4xX0RldmljZVNjcmlwdF9wYXJzZUZsb2F0rAEaZnVuMV9EZXZpY2VTY3JpcHRfcGFyc2VJbnStARRtZXRoWF9GdW5jdGlvbl9zdGFydK4BDmZ1bjFfTWF0aF9jZWlsrwEPZnVuMV9NYXRoX2Zsb29ysAEPZnVuMV9NYXRoX3JvdW5ksQENZnVuMV9NYXRoX2Fic7IBEGZ1bjBfTWF0aF9yYW5kb22zARNmdW4xX01hdGhfcmFuZG9tSW50tAENZnVuMV9NYXRoX2xvZ7UBDWZ1bjJfTWF0aF9wb3e2AQ5mdW4yX01hdGhfaWRpdrcBDmZ1bjJfTWF0aF9pbW9kuAEOZnVuMl9NYXRoX2ltdWy5AQ1mdW4yX01hdGhfbWluugELZnVuMl9taW5tYXi7AQ1mdW4yX01hdGhfbWF4vAEVcHJvcF9Sb2xlX2lzQ29ubmVjdGVkvQEScHJvcF9TdHJpbmdfbGVuZ3RovgEXbWV0aDFfU3RyaW5nX2NoYXJDb2RlQXS/ARNtZXRoMV9TdHJpbmdfY2hhckF0wAEUZGV2c19qZF9nZXRfcmVnaXN0ZXLBARZkZXZzX2pkX2NsZWFyX3BrdF9raW5kwgEQZGV2c19qZF9zZW5kX2NtZMMBE2RldnNfamRfc2VuZF9sb2dtc2fEAQ1oYW5kbGVfbG9nbXNnxQESZGV2c19qZF9zaG91bGRfcnVuxgEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXHARNkZXZzX2pkX3Byb2Nlc3NfcGt0yAEUZGV2c19qZF9yb2xlX2NoYW5nZWTJARRkZXZzX2pkX3Jlc2V0X3BhY2tldMoBEmRldnNfamRfaW5pdF9yb2xlc8sBEmRldnNfamRfZnJlZV9yb2xlc8wBEGRldnNfc2V0X2xvZ2dpbmfNARVkZXZzX2dldF9nbG9iYWxfZmxhZ3POAQxkZXZzX21hcF9zZXTPAQZsb29rdXDQARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7RARFkZXZzX3Byb3RvX2xvb2t1cNIBEmRldnNfZnVuY3Rpb25fYmluZNMBEWRldnNfbWFrZV9jbG9zdXJl1AEOZGV2c19nZXRfZm5pZHjVARhkZXZzX29iamVjdF9nZXRfYXR0YWNoZWTWARdkZXZzX29iamVjdF9nZXRfbm9fYmluZNcBD2RldnNfb2JqZWN0X2dldNgBDGRldnNfc2VxX2dldNkBDGRldnNfYW55X2dldNoBDGRldnNfYW55X3NldNsBDGRldnNfc2VxX3NldNwBDmRldnNfYXJyYXlfc2V03QERZGV2c19hcnJheV9pbnNlcnTeAQxkZXZzX2FyZ19pbnTfAQ9kZXZzX2FyZ19kb3VibGXgAQ9kZXZzX3JldF9kb3VibGXhAQxkZXZzX3JldF9pbnTiAQ9kZXZzX3JldF9nY19wdHLjARJkZXZzX3JlZ2NhY2hlX2ZyZWXkARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxs5QEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWTmARNkZXZzX3JlZ2NhY2hlX2FsbG9j5wEUZGV2c19yZWdjYWNoZV9sb29rdXDoARFkZXZzX3JlZ2NhY2hlX2FnZekBF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xl6gESZGV2c19yZWdjYWNoZV9uZXh06wEPamRfc2V0dGluZ3NfZ2V07AEPamRfc2V0dGluZ3Nfc2V07QEOZGV2c19sb2dfdmFsdWXuAQ9kZXZzX3Nob3dfdmFsdWXvARBkZXZzX3Nob3dfdmFsdWUw8AENY29uc3VtZV9jaHVua/EBDXNoYV8yNTZfY2xvc2XyAQ9qZF9zaGEyNTZfc2V0dXDzARBqZF9zaGEyNTZfdXBkYXRl9AEQamRfc2hhMjU2X2ZpbmlzaPUBFGpkX3NoYTI1Nl9obWFjX3NldHVw9gEVamRfc2hhMjU2X2htYWNfZmluaXNo9wEOamRfc2hhMjU2X2hrZGb4AQ5kZXZzX3N0cmZvcm1hdPkBDmRldnNfaXNfc3RyaW5n+gEOZGV2c19pc19udW1iZXL7ARRkZXZzX3N0cmluZ19nZXRfdXRmOPwBFGRldnNfc3RyaW5nX3ZzcHJpbnRm/QETZGV2c19zdHJpbmdfc3ByaW50Zv4BFWRldnNfc3RyaW5nX2Zyb21fdXRmOP8BFGRldnNfdmFsdWVfdG9fc3RyaW5ngAIQYnVmZmVyX3RvX3N0cmluZ4ECEmRldnNfc3RyaW5nX2NvbmNhdIICHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2ODAg90c2FnZ19jbGllbnRfZXaEAgphZGRfc2VyaWVzhQINdHNhZ2dfcHJvY2Vzc4YCCmxvZ19zZXJpZXOHAhN0c2FnZ19oYW5kbGVfcGFja2V0iAIUbG9va3VwX29yX2FkZF9zZXJpZXOJAgp0c2FnZ19pbml0igIMdHNhZ2dfdXBkYXRliwIWZGV2c192YWx1ZV9mcm9tX2RvdWJsZYwCE2RldnNfdmFsdWVfZnJvbV9pbnSNAhRkZXZzX3ZhbHVlX2Zyb21fYm9vbI4CF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyjwIUZGV2c192YWx1ZV90b19kb3VibGWQAhFkZXZzX3ZhbHVlX3RvX2ludJECEmRldnNfdmFsdWVfdG9fYm9vbJICDmRldnNfaXNfYnVmZmVykwIXZGV2c19idWZmZXJfaXNfd3JpdGFibGWUAhBkZXZzX2J1ZmZlcl9kYXRhlQITZGV2c19idWZmZXJpc2hfZGF0YZYCFGRldnNfdmFsdWVfdG9fZ2Nfb2JqlwINZGV2c19pc19hcnJheZgCEWRldnNfdmFsdWVfdHlwZW9mmQIPZGV2c19pc19udWxsaXNomgISZGV2c192YWx1ZV9pZWVlX2VxmwISZGV2c19pbWdfc3RyaWR4X29rnAISZGV2c19kdW1wX3ZlcnNpb25znQILZGV2c192ZXJpZnmeAhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc58CGmRldnNfYnVpbHRpbl9zdHJpbmdfYnlfaWR4oAIRZGV2c19pbWdfZ2V0X3V0ZjihAhRkZXZzX2dldF9zdGF0aWNfdXRmOKICDGV4cHJfaW52YWxpZKMCFGV4cHJ4X2J1aWx0aW5fb2JqZWN0pAILc3RtdDFfY2FsbDClAgtzdG10Ml9jYWxsMaYCC3N0bXQzX2NhbGwypwILc3RtdDRfY2FsbDOoAgtzdG10NV9jYWxsNKkCC3N0bXQ2X2NhbGw1qgILc3RtdDdfY2FsbDarAgtzdG10OF9jYWxsN6wCC3N0bXQ5X2NhbGw4rQIMZXhwcjJfc3RyMGVxrgIMc3RtdDFfcmV0dXJurwIJc3RtdHhfam1wsAIMc3RtdHgxX2ptcF96sQILc3RtdDFfcGFuaWOyAhZleHByMF9wa3RfY29tbWFuZF9jb2RlswISc3RtdHgxX3N0b3JlX2xvY2FstAITc3RtdHgxX3N0b3JlX2dsb2JhbLUCEnN0bXQ0X3N0b3JlX2J1ZmZlcrYCFmV4cHIwX3BrdF9yZWdfZ2V0X2NvZGW3AhBleHByeF9sb2FkX2xvY2FsuAIRZXhwcnhfbG9hZF9nbG9iYWy5AhVleHByMF9wa3RfcmVwb3J0X2NvZGW6AgtleHByMl9pbmRleLsCD3N0bXQzX2luZGV4X3NldLwCFGV4cHJ4MV9idWlsdGluX2ZpZWxkvQISZXhwcngxX2FzY2lpX2ZpZWxkvgIRZXhwcngxX3V0ZjhfZmllbGS/AhBleHByeF9tYXRoX2ZpZWxkwAIOZXhwcnhfZHNfZmllbGTBAg9zdG10MF9hbGxvY19tYXDCAhFzdG10MV9hbGxvY19hcnJhecMCEnN0bXQxX2FsbG9jX2J1ZmZlcsQCEWV4cHJ4X3N0YXRpY19yb2xlxQITZXhwcnhfc3RhdGljX2J1ZmZlcsYCG2V4cHJ4X3N0YXRpY19idWlsdGluX3N0cmluZ8cCGWV4cHJ4X3N0YXRpY19hc2NpaV9zdHJpbmfIAhhleHByeF9zdGF0aWNfdXRmOF9zdHJpbmfJAhVleHByeF9zdGF0aWNfZnVuY3Rpb27KAg1leHByeF9saXRlcmFsywIRZXhwcnhfbGl0ZXJhbF9mNjTMAhBleHByMF9wa3RfYnVmZmVyzQIRZXhwcjNfbG9hZF9idWZmZXLOAg1leHByMF9yZXRfdmFszwIMZXhwcjFfdHlwZW9m0AIKZXhwcjBfbnVsbNECDWV4cHIxX2lzX251bGzSAgpleHByMF90cnVl0wILZXhwcjBfZmFsc2XUAg1leHByMV90b19ib29s1QIJZXhwcjBfbmFu1gIJZXhwcjFfYWJz1wINZXhwcjFfYml0X25vdNgCDGV4cHIxX2lzX25hbtkCCWV4cHIxX25lZ9oCCWV4cHIxX25vdNsCDGV4cHIxX3RvX2ludNwCCWV4cHIyX2FkZN0CCWV4cHIyX3N1Yt4CCWV4cHIyX211bN8CCWV4cHIyX2RpduACDWV4cHIyX2JpdF9hbmThAgxleHByMl9iaXRfb3LiAg1leHByMl9iaXRfeG9y4wIQZXhwcjJfc2hpZnRfbGVmdOQCEWV4cHIyX3NoaWZ0X3JpZ2h05QIaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWTmAghleHByMl9lcecCCGV4cHIyX2xl6AIIZXhwcjJfbHTpAghleHByMl9uZeoCFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcusCD3N0bXQxX3dhaXRfcm9sZewCD3N0bXQzX3F1ZXJ5X3JlZ+0CDnN0bXQyX3NlbmRfY21k7gITc3RtdDRfcXVlcnlfaWR4X3JlZ+8CFnN0bXQxX3NldHVwX3BrdF9idWZmZXLwAg1zdG10Ml9zZXRfcGt08QIMZXhwcjBfbm93X21z8gIWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZfMCDmV4cHIwX3BrdF9zaXpl9AIRZXhwcjBfcGt0X2V2X2NvZGX1AhRzdG10eDJfc3RvcmVfY2xvc3VyZfYCE2V4cHJ4MV9sb2FkX2Nsb3N1cmX3AhJleHByeF9tYWtlX2Nsb3N1cmX4AhBleHByMV90eXBlb2Zfc3Ry+QIJZXhwcjBfaW5m+gILZXhwcjFfdXBsdXP7Ag9kZXZzX3ZtX3BvcF9hcmf8AhNkZXZzX3ZtX3BvcF9hcmdfdTMy/QITZGV2c192bV9wb3BfYXJnX2kzMv4CFmRldnNfdm1fcG9wX2FyZ19idWZmZXL/AhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGGAAxZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4gQMUZGV2c192bV9wb3BfYXJnX3JvbGWCAxJqZF9hZXNfY2NtX2VuY3J5cHSDAxJqZF9hZXNfY2NtX2RlY3J5cHSEAwxBRVNfaW5pdF9jdHiFAw9BRVNfRUNCX2VuY3J5cHSGAxBqZF9hZXNfc2V0dXBfa2V5hwMOamRfYWVzX2VuY3J5cHSIAxBqZF9hZXNfY2xlYXJfa2V5iQMLamRfd3Nza19uZXeKAxRqZF93c3NrX3NlbmRfbWVzc2FnZYsDE2pkX3dlYnNvY2tfb25fZXZlbnSMAwdkZWNyeXB0jQMNamRfd3Nza19jbG9zZY4DEGpkX3dzc2tfb25fZXZlbnSPAwpzZW5kX2VtcHR5kAMSd3Nza2hlYWx0aF9wcm9jZXNzkQMXamRfdGNwc29ja19pc19hdmFpbGFibGWSAxR3c3NraGVhbHRoX3JlY29ubmVjdJMDGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldJQDD3NldF9jb25uX3N0cmluZ5UDEWNsZWFyX2Nvbm5fc3RyaW5nlgMPd3Nza2hlYWx0aF9pbml0lwMTd3Nza19wdWJsaXNoX3ZhbHVlc5gDEHdzc2tfcHVibGlzaF9iaW6ZAxF3c3NrX2lzX2Nvbm5lY3RlZJoDE3dzc2tfcmVzcG9uZF9tZXRob2SbAw9qZF9jdHJsX3Byb2Nlc3OcAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXSdAwxqZF9jdHJsX2luaXSeAw1qZF9pcGlwZV9vcGVunwMWamRfaXBpcGVfaGFuZGxlX3BhY2tldKADDmpkX2lwaXBlX2Nsb3NloQMSamRfbnVtZm10X2lzX3ZhbGlkogMVamRfbnVtZm10X3dyaXRlX2Zsb2F0owMTamRfbnVtZm10X3dyaXRlX2kzMqQDEmpkX251bWZtdF9yZWFkX2kzMqUDFGpkX251bWZtdF9yZWFkX2Zsb2F0pgMRamRfb3BpcGVfb3Blbl9jbWSnAxRqZF9vcGlwZV9vcGVuX3JlcG9ydKgDFmpkX29waXBlX2hhbmRsZV9wYWNrZXSpAxFqZF9vcGlwZV93cml0ZV9leKoDEGpkX29waXBlX3Byb2Nlc3OrAxRqZF9vcGlwZV9jaGVja19zcGFjZawDDmpkX29waXBlX3dyaXRlrQMOamRfb3BpcGVfY2xvc2WuAw1qZF9xdWV1ZV9wdXNorwMOamRfcXVldWVfZnJvbnSwAw5qZF9xdWV1ZV9zaGlmdLEDDmpkX3F1ZXVlX2FsbG9jsgMNamRfcmVzcG9uZF91OLMDDmpkX3Jlc3BvbmRfdTE2tAMOamRfcmVzcG9uZF91MzK1AxFqZF9yZXNwb25kX3N0cmluZ7YDF2pkX3NlbmRfbm90X2ltcGxlbWVudGVktwMLamRfc2VuZF9wa3S4Ax1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbLkDF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyugMZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldLsDFGpkX2FwcF9oYW5kbGVfcGFja2V0vAMVamRfYXBwX2hhbmRsZV9jb21tYW5kvQMTamRfYWxsb2NhdGVfc2VydmljZb4DEGpkX3NlcnZpY2VzX2luaXS/Aw5qZF9yZWZyZXNoX25vd8ADGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTBAxRqZF9zZXJ2aWNlc19hbm5vdW5jZcIDF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1lwwMQamRfc2VydmljZXNfdGlja8QDFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ8UDGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3JlxgMSYXBwX2dldF9md192ZXJzaW9uxwMWYXBwX2dldF9kZXZfY2xhc3NfbmFtZcgDDWpkX2hhc2hfZm52MWHJAwxqZF9kZXZpY2VfaWTKAwlqZF9yYW5kb23LAwhqZF9jcmMxNswDDmpkX2NvbXB1dGVfY3JjzQMOamRfc2hpZnRfZnJhbWXOAw5qZF9yZXNldF9mcmFtZc8DEGpkX3B1c2hfaW5fZnJhbWXQAw1qZF9wYW5pY19jb3Jl0QMTamRfc2hvdWxkX3NhbXBsZV9tc9IDEGpkX3Nob3VsZF9zYW1wbGXTAwlqZF90b19oZXjUAwtqZF9mcm9tX2hleNUDDmpkX2Fzc2VydF9mYWls1gMHamRfYXRvadcDC2pkX3ZzcHJpbnRm2AMPamRfcHJpbnRfZG91Ymxl2QMKamRfc3ByaW50ZtoDEmpkX2RldmljZV9zaG9ydF9pZNsDDGpkX3NwcmludGZfYdwDC2pkX3RvX2hleF9h3QMUamRfZGV2aWNlX3Nob3J0X2lkX2HeAwlqZF9zdHJkdXDfAw5qZF9qc29uX2VzY2FwZeADE2pkX2pzb25fZXNjYXBlX2NvcmXhAwlqZF9tZW1kdXDiAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVl4wMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZeQDEWpkX3NlbmRfZXZlbnRfZXh05QMKamRfcnhfaW5pdOYDFGpkX3J4X2ZyYW1lX3JlY2VpdmVk5wMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2voAw9qZF9yeF9nZXRfZnJhbWXpAxNqZF9yeF9yZWxlYXNlX2ZyYW1l6gMRamRfc2VuZF9mcmFtZV9yYXfrAw1qZF9zZW5kX2ZyYW1l7AMKamRfdHhfaW5pdO0DB2pkX3NlbmTuAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3Jj7wMPamRfdHhfZ2V0X2ZyYW1l8AMQamRfdHhfZnJhbWVfc2VudPEDC2pkX3R4X2ZsdXNo8gMQX19lcnJub19sb2NhdGlvbvMDDF9fZnBjbGFzc2lmefQDBWR1bW159QMIX19tZW1jcHn2AwdtZW1tb3Zl9wMGbWVtc2V0+AMKX19sb2NrZmlsZfkDDF9fdW5sb2NrZmlsZfoDBGZtb2T7AwxfX3N0ZGlvX3NlZWv8Aw1fX3N0ZGlvX3dyaXRl/QMNX19zdGRpb19jbG9zZf4DDF9fc3RkaW9fZXhpdP8DCmNsb3NlX2ZpbGWABAhfX3RvcmVhZIEECV9fdG93cml0ZYIECV9fZndyaXRleIMEBmZ3cml0ZYQEK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHOFBBRfX3B0aHJlYWRfbXV0ZXhfbG9ja4YEFl9fcHRocmVhZF9tdXRleF91bmxvY2uHBAZfX2xvY2uIBA5fX21hdGhfZGl2emVyb4kEDl9fbWF0aF9pbnZhbGlkigQDbG9niwQFbG9nMTCMBAdfX2xzZWVrjQQGbWVtY21wjgQKX19vZmxfbG9ja48EDF9fbWF0aF94Zmxvd5AECmZwX2JhcnJpZXKRBAxfX21hdGhfb2Zsb3eSBAxfX21hdGhfdWZsb3eTBARmYWJzlAQDcG93lQQIY2hlY2tpbnSWBAtzcGVjaWFsY2FzZZcEBXJvdW5kmAQGc3RyY2hymQQLX19zdHJjaHJudWyaBAZzdHJjbXCbBAZzdHJsZW6cBAdfX3VmbG93nQQHX19zaGxpbZ4ECF9fc2hnZXRjnwQHaXNzcGFjZaAEBnNjYWxibqEECWNvcHlzaWdubKIEB3NjYWxibmyjBA1fX2ZwY2xhc3NpZnlspAQFZm1vZGylBAVmYWJzbKYEC19fZmxvYXRzY2FupwQIaGV4ZmxvYXSoBAhkZWNmbG9hdKkEB3NjYW5leHCqBAZzdHJ0b3irBAZzdHJ0b2SsBBJfX3dhc2lfc3lzY2FsbF9yZXStBAhkbG1hbGxvY64EBmRsZnJlZa8EGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZbAEBHNicmuxBAhfX2FkZHRmM7IECV9fYXNobHRpM7MEB19fbGV0ZjK0BAdfX2dldGYytQQIX19kaXZ0ZjO2BA1fX2V4dGVuZGRmdGYytwQNX19leHRlbmRzZnRmMrgEC19fZmxvYXRzaXRmuQQNX19mbG9hdHVuc2l0ZroEDV9fZmVfZ2V0cm91bmS7BBJfX2ZlX3JhaXNlX2luZXhhY3S8BAlfX2xzaHJ0aTO9BAhfX211bHRmM74ECF9fbXVsdGkzvwQJX19wb3dpZGYywAQIX19zdWJ0ZjPBBAxfX3RydW5jdGZkZjLCBAlzdGFja1NhdmXDBAxzdGFja1Jlc3RvcmXEBApzdGFja0FsbG9jxQQVZW1zY3JpcHRlbl9zdGFja19pbml0xgQZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZccEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XIBBhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTJBAxkeW5DYWxsX2ppamnKBBZsZWdhbHN0dWIkZHluQ2FsbF9qaWppywQYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMByQQEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
