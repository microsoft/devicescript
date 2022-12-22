
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB2oGAgAAiYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgA39+fwF+YAABfmABfgF/YAJ/fABgBX9/f39/AX9gBX9/f39/AGACf38BfGAAAXxgB39/f39/f38AYAN/f38BfGAJf39/f39/f39/AGAIf39/f39/f38Bf2ADf398AGADf3x/AGACf34AYAF8AX9gAn98AXxgAnx8AXxgA3x+fgF8YAJ8fwF8YAR/f35/AX5gBH9+f38BfwLMhYCAABYDZW52BWFib3J0AAUDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAANlbnYNZW1fc2VuZF9mcmFtZQAAA2VudhBlbV9jb25zb2xlX2RlYnVnAAADZW52BGV4aXQAAANlbnYLZW1fdGltZV9ub3cAEwNlbnYTZGV2c19kZXBsb3lfaGFuZGxlcgAAA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABgNlbnYUamRfY3J5cHRvX2dldF9yYW5kb20AAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwAGFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVh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EAJAAkACQCABIANBCGoQjQINACADQRhqIAFBngEQiAEMAQsgAyADKQMQNwMAIAEgAyADQRhqEI8CRQ0AIAAgAygCGBCHAgwBCyAAQgA3AwALIANBIGokAAuQAQICfwF+IwBBMGsiASQAIAEgACkDQCIDNwMQIAEgAzcDIAJAAkAgACABQRBqEI0CDQAgAUEoaiAAQZ4BEIgBQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQjwIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQ+QEgACgCmAEgASkDGDcDIAsgAUEwaiQAC7YBAgV/AX4jAEEgayIBJAAgASAAKQNAIgY3AwggASAGNwMQAkACQCAAIAFBCGoQjgINACABQRhqIABBnwEQiAFBACECDAELIAEgASkDEDcDACAAIAEgAUEYahCPAiECCwJAIAJFDQAgAEEAENkBIQMgAEEBENkBIQQgAEECENkBIQAgASgCGCIFIANNDQAgASAFIANrIgU2AhggAiADaiAAIAUgBCAFIARJGxDvAxoLIAFBIGokAAvzAgIHfwF+IwBB0ABrIgEkACABIAApA0AiCDcDKCABIAg3A0ACQAJAIAAgAUEoahCOAg0AIAFByABqIABBnwEQiAFBACECDAELIAEgASkDQDcDICAAIAFBIGogAUE8ahCPAiECCyAAQQAQ2QEhAyABIABB0ABqKQMAIgg3AxggASAINwMwAkACQCAAIAFBGGoQ9AFFDQAgASABKQMwNwMAIAAgASABQcgAahD2ASEEDAELIAEgASkDMCIINwNAIAEgCDcDEAJAIAAgAUEQahCNAg0AIAFByABqIABBngEQiAFBACEEDAELIAEgASkDQDcDCCAAIAFBCGogAUHIAGoQjwIhBAsgAEECENkBIQUgAEEDENkBIQACQCABKAJIIgYgBU0NACABIAYgBWsiBjYCSCABKAI8IgcgA00NACABIAcgA2siBzYCPCACIANqIAQgBWogByAGIAAgBiAASRsiACAHIABJGxDtAxoLIAFB0ABqJAALHwEBfwJAIABBABDZASIBQQBIDQAgACgCmAEgARB8CwshAQF/IABB/wAgAEEAENkBIgEgAUGAgHxqQYGAfEkbEHoLCAAgAEEAEHoLywECB38BfiMAQeAAayIBJAACQCAALQAzQQJJDQAgASAAQcgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQ9gEiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHQAGoiAyAALQAzQX5qIgRBABDzASIFQX9qIgYQlgEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQ8wEaDAELIAdBBmogAUEQaiAGEO0DGgsgACAHEN0BCyABQeAAaiQAC1YCAX8BfiMAQSBrIgEkACABIABByABqKQMAIgI3AxggASACNwMIIAFBEGogACABQQhqEPoBIAEgASkDECICNwMYIAEgAjcDACAAIAEQvwEgAUEgaiQAC5EBAQN/IwBBEGsiASQAAkACQCAALQAzQQFLDQAgAUEIaiAAQYkBEIgBDAELAkAgAEEAENkBIgJBe2pBe0sNACABQQhqIABBiQEQiAEMAQsgACAALQAzQX9qIgM6ADMgAEHIAGogAEHQAGogA0H/AXFBf2oiA0EDdBDuAxogACAAIAMgAhCEARDdAQsgAUEQaiQAC1gCAX8BfiMAQRBrIgEkACABIABByABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKYASACNwMgDAELIAEgASkDCDcDACAAIAEQiwKbENsBCyABQRBqJAALWAIBfwF+IwBBEGsiASQAIAEgAEHIAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoApgBIAI3AyAMAQsgASABKQMINwMAIAAgARCLApwQ2wELIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQcgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCmAEgAjcDIAwBCyABIAEpAwg3AwAgACABEIsCEI0EENsBCyABQRBqJAALtQEDAn8BfgF8IwBBIGsiASQAIAEgAEHIAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAM3AxAMAQsgAUEQakEAIAJrEIcCCyAAKAKYASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAFBCGoQiwIiBEQAAAAAAAAAAGNFDQAgACAEmhDbAQwBCyAAKAKYASABKQMYNwMgCyABQSBqJAALFQAgABDCA7hEAAAAAAAA8D2iENsBC00BBH9BASEBAkAgAEEAENkBIgJBAU0NAANAIAFBAXRBAXIiASACSQ0ACwsDQCAEEMIDIAFxIgMgAyACSyIDGyEEIAMNAAsgACAEENwBCxEAIAAgAEEAENoBEIAEENsBCxgAIAAgAEEAENoBIABBARDaARCKBBDbAQsuAQN/QQAhASAAQQAQ2QEhAgJAIABBARDZASIDRQ0AIAIgA20hAQsgACABENwBCy4BA39BACEBIABBABDZASECAkAgAEEBENkBIgNFDQAgAiADbyEBCyAAIAEQ3AELFgAgACAAQQAQ2QEgAEEBENkBbBDcAQsJACAAQQEQtwEL6AICBH8CfCMAQTBrIgIkACACIABByABqKQMANwMoIAIgAEHQAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCACQRhqEIoCIQMgAiACKQMgNwMQIAJBEGoQigIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKYASAFKQMANwMgCyACIAIpAyg3AwggAkEIahCLAiEGIAIgAikDIDcDACACEIsCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCmAFBACkD+EU3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKYASABKQMANwMgIAJBMGokAAsJACAAQQAQtwELagECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADQQhqIAFBowEQiAEgAEIANwMADAELIAAgASgCoAEgAigCAEECdGooAgAoAhBBAEcQiAILIANBEGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQ9gFFDQAgACADKAIMEIcCDAELIABCADcDAAsgA0EQaiQAC3ICA38BfiMAQSBrIgEkACABIAApA0AiBDcDCCABIAQ3AxACQCAAIAFBCGogAUEcahD2ASICRQ0AAkAgAEEAENkBIgMgASgCHEkNACAAKAKYAUEAKQP4RTcDIAwBCyAAIAIgA2otAAAQ3AELIAFBIGokAAvRAgEDfwJA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ASACayEBAkAgAyACRw0AQbSxAUHosAEQ6wFBAEHAADYCrLEBQQBB6LABNgKosQEgAQ0BDAILQQBBACgCqLEBIAJqNgKosQEgAQ0ACwsLTABB5LABEOwBGiAAQRhqQQApA/ixATcAACAAQRBqQQApA/CxATcAACAAQQhqQQApA+ixATcAACAAQQApA+CxATcAAEEAQQA6AOCwAQuTBwECf0EAIQJBAEIANwO4sgFBAEIANwOwsgFBAEIANwOosgFBAEIANwOgsgFBAEIANwOYsgFBAEIANwOQsgFBAEIANwOIsgFBAEIANwOAsgECQAJAAkACQCABQcEASQ0AECNBAC0A4LABDQJBAEEBOgDgsAEQJEEAIAE2ArCxAUEAQcAANgKssQFBAEHosAE2AqixAUEAQeCxATYC5LABQQBCq7OP/JGjs/DbADcCzLEBQQBC/6S5iMWR2oKbfzcCxLEBQQBC8ua746On/aelfzcCvLEBQQBC58yn0NbQ67O7fzcCtLEBAkADQAJAQQAoAqyxASICQcAARw0AIAFBwABJDQBBtLEBIAAQ6wEgAEHAAGohACABQUBqIgENAQwCC0EAKAKosQEgACABIAIgASACSRsiAhDtAxpBAEEAKAKssQEiAyACazYCrLEBIAAgAmohACABIAJrIQECQCADIAJHDQBBtLEBQeiwARDrAUEAQcAANgKssQFBAEHosAE2AqixASABDQEMAgtBAEEAKAKosQEgAmo2AqixASABDQALC0HksAEQ7AEaQQAhAkEAQQApA/ixATcDmLIBQQBBACkD8LEBNwOQsgFBAEEAKQPosQE3A4iyAUEAQQApA+CxATcDgLIBQQBBADoA4LABDAELQYCyASAAIAEQ7QMaCwNAIAJBgLIBaiIBIAEtAABBNnM6AAAgAkEBaiICQcAARw0ADAILAAtB/CxBDkHdFBDIAwALECMCQEEALQDgsAENAEEAQQE6AOCwARAkQQBCwICAgPDM+YTqADcCsLEBQQBBwAA2AqyxAUEAQeiwATYCqLEBQQBB4LEBNgLksAFBAEGZmoPfBTYC0LEBQQBCjNGV2Lm19sEfNwLIsQFBAEK66r+q+s+Uh9EANwLAsQFBAEKF3Z7bq+68tzw3ArixAUGAsgEhAUHAACECAkADQAJAQQAoAqyxASIAQcAARw0AIAJBwABJDQBBtLEBIAEQ6wEgAUHAAGohASACQUBqIgINAQwCC0EAKAKosQEgASACIAAgAiAASRsiABDtAxpBAEEAKAKssQEiAyAAazYCrLEBIAEgAGohASACIABrIQICQCADIABHDQBBtLEBQeiwARDrAUEAQcAANgKssQFBAEHosAE2AqixASACDQEMAgtBAEEAKAKosQEgAGo2AqixASACDQALCw8LQfwsQQ5B3RQQyAMAC7sGAQR/QeSwARDsARpBACEBIABBGGpBACkD+LEBNwAAIABBEGpBACkD8LEBNwAAIABBCGpBACkD6LEBNwAAIABBACkD4LEBNwAAQQBBADoA4LABECMCQEEALQDgsAENAEEAQQE6AOCwARAkQQBCq7OP/JGjs/DbADcCzLEBQQBC/6S5iMWR2oKbfzcCxLEBQQBC8ua746On/aelfzcCvLEBQQBC58yn0NbQ67O7fzcCtLEBQQBCwAA3AqyxAUEAQeiwATYCqLEBQQBB4LEBNgLksAEDQCABQYCyAWoiAiACLQAAQeoAczoAACABQQFqIgFBwABHDQALQQBBwAA2ArCxAUGAsgEhAkHAACEBAkADQAJAQQAoAqyxASIDQcAARw0AIAFBwABJDQBBtLEBIAIQ6wEgAkHAAGohAiABQUBqIgENAQwCC0EAKAKosQEgAiABIAMgASADSRsiAxDtAxpBAEEAKAKssQEiBCADazYCrLEBIAIgA2ohAiABIANrIQECQCAEIANHDQBBtLEBQeiwARDrAUEAQcAANgKssQFBAEHosAE2AqixASABDQEMAgtBAEEAKAKosQEgA2o2AqixASABDQALC0EgIQFBAEEAKAKwsQFBIGo2ArCxASAAIQICQANAAkBBACgCrLEBIgNBwABHDQAgAUHAAEkNAEG0sQEgAhDrASACQcAAaiECIAFBQGoiAQ0BDAILQQAoAqixASACIAEgAyABIANJGyIDEO0DGkEAQQAoAqyxASIEIANrNgKssQEgAiADaiECIAEgA2shAQJAIAQgA0cNAEG0sQFB6LABEOsBQQBBwAA2AqyxAUEAQeiwATYCqLEBIAENAQwCC0EAQQAoAqixASADajYCqLEBIAENAAsLQeSwARDsARogAEEYakEAKQP4sQE3AAAgAEEQakEAKQPwsQE3AAAgAEEIakEAKQPosQE3AAAgAEEAKQPg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Tw0AQQEhDCADQQFqIQEMAQtBACEMAkAgCyAHSw0AIAohCQwBCyADQX9qIQhBASEMCyAMDQALCwJAIAlFDQAgACAGEP8BGgsgBUEBaiIFIAItABBJDQAMBAsACyACRQ0DIAAoAiQiAUUNAkEAIQMDQCABIggoAgAhAQJAIAgoAgQiDA0AIAghAyABDQEMBAsCQCAMQQAgDC0ABGtBDGxqQVxqIAJGDQAgCCEDIAENAQwECwJAAkAgAw0AIAAgATYCJAwBCyADIAE2AgALIAgoAgwQISAIECEgAQ0ADAMLAAsgAy8BDkGBIkcNASADLQADQQFxDQFBACgCrE9Bf2ohCCACKAIAIQtBACEBAkADQAJAIAEgCEwNAEEAIQUMAgsCQAJAQaDMACAIIAFqQQJtIgdBDGxqIgkoAgQiCiALTw0AQQEhDCAHQQFqIQEMAQtBACEMAkAgCiALSw0AIAkhBQwBCyAHQX9qIQhBASEMCyAMDQALCyAFRQ0BIAAoAiQiAUUNASADQRBqIQwDQAJAIAEoAgQgAkcNAAJAIAEtAAkiCEUNACABIAhBf2o6AAkLAkAgDCADLQAMIAUvAQgQXiINvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhBwJAAkBBACgCwLUBIgsgAUHEAGooAgAiCGtBAEgNACABQShqIgsgASsDGCAIIAdruKIgCysDAKA5AwAMAQsgAUEoaiIIIAErAxggCyAHa7iiIAgrAwCgOQMAIAshCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgCwLUBIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBCQBEUhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIECEgAygCBBDWAyEIDAELIAxFDQEgCBAhQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtByDJBvipBlQJB+AkQzQMAC7kBAQN/QcgAECAiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKALAtQEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABEE4iAEUNACACIAAoAgQQ1gM2AgwLIAJB2yIQgQIgAgvoBgIIfwJ8IwBBEGsiASQAAkACQCAAKAIIRQ0AQQAoAsC1ASAAKAIca0EATg0BCwJAIABBGGpBgMC4AhDKA0UNAAJAIAAoAiQiAkUNAANAAkAgAi0ACSACLQAIRw0AIAJBADoACQsgAiACLQAJOgAIIAIoAgAiAg0ACwsgACgCKCICRQ0AAkAgAiAAKAIMIgNPDQAgACACQdAPajYCKAsgACgCKCADTQ0AIAAgAzYCKAsCQCAAQRRqIgRBgKAGEMoDRQ0AIAAoAiQiAkUNAANAAkAgAigCBCIDRQ0AIAItAAlBMUsNACABQfoBOgAPAkACQCADQYPAACABQQ9qQQEQVSIDRQ0AIARBACgCsK0BQYDAAGo2AgAMAQsgAiABLQAPOgAJCyADDQILIAIoAgAiAg0ACwsCQCAAKAIkIgJFDQAgAEEMaiEFIABBKGohBgNAAkAgAkHEAGooAgAiA0EAKALAtQFrQX9KDQACQAJAAkAgAkEgaiIEKAIADQAgAkKAgICAgICA/P8ANwMYDAELIAIrAxggAyACKAIUa7iiIQkgAkEoaisDACEKAkACQCACKAIMIgMNAEEAIQcMAQsgAxCRBCEHCyAJIAqgIQkgB0EpahAgIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEO0DGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQ5QMiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQYARQ0AIAJB7SIQgQILIAMQISAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQIQsgAigCACICDQALCyABQRBqJAAPC0HzDEEAEC0QMwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAENIDIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRB3RIgAkEgahAtDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQcMSIAJBEGoQLQwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEHNESACEC0LIAJBwABqJAALmwUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMECEgARAhIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahCDAiECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAsC1ASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahCDAiECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahCDAiECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFBsMUAELADQf9+ag4EAAICAQILIAAgACgCDCIBQYC4mSkgAUGAuJkpSRs2AgwPCyAAIAAoAggiAUGAuJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAsC1ASABajYCHAsL+gEBBH8gAkEBaiEDIAFBwjEgARshBAJAIAAoAiQiAUUNAANAAkAgASgCDCIFRQ0AIAUgBCADEIMERQ0CCyABKAIAIgENAAsLAkAgAQ0AQcgAECAiAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUEAKALAtQEiBjYCQAJAIAEoAhAiBQ0AAkACQCAALQASRQ0AIABBKGohBSAAKAIoDQEgBUGIJzYCAAwBCyAAQQxqIQULIAUoAgAhBQsgASAFIAZqNgJEIAFB2yIQgQIgASADECAiBTYCDCAFIAQgAhDtAxoLIAELOQEBf0EAQcDFABC1AyIBNgLAsgEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQS0gARBQC8oCAQN/AkBBACgCwLIBIgJFDQAgAiAAIAAQkQQQgwIhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAAgATkDGCAAQQA2AiAgAEE4aiABOQMAIABBMGogATkDACAAQShqQgA3AwAgACAAQcAAaigCADYCFAsgACAAKAIgQQFqNgIgIAAoAhQhAwJAAkBBACgCwLUBIgQgAEHEAGooAgAiAmtBAEgNACAAQShqIgQgACsDGCACIANruKIgBCsDAKA5AwAMAQsgAEEoaiICIAArAxggBCADa7iiIAIrAwCgOQMAIAQhAgsgACACNgIUAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLxgICAn4EfwJAAkACQAJAIAEQ6wMOBAABAgIDCyAAQgI3AwAPCwJAIAFEAAAAAAAAAABkRQ0AIABCwgA3AwAPCyAAQsMANwMADwsgAEKAgICAcDcDAA8LAkAgAb0iAkIg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9QIiBDYCECAAIAQgAygCAHEQhwILLAECfyACQRhqIgMgAhD1AjYCACACIAIQ9QIiBDYCECAAIAQgAygCAHIQhwILLAECfyACQRhqIgMgAhD1AjYCACACIAIQ9QIiBDYCECAAIAQgAygCAHMQhwILLAECfyACQRhqIgMgAhD1AjYCACACIAIQ9QIiBDYCECAAIAQgAygCAHQQhwILLAECfyACQRhqIgMgAhD1AjYCACACIAIQ9QIiBDYCECAAIAQgAygCAHUQhwILQQECfyACQRhqIgMgAhD1AjYCACACIAIQ9QIiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQhgIPCyAAIAIQhwILnAEBAn8jAEEgayIDJAAgA0EYaiACEPMCIAJBGGoiBCADKQMYNwMAIANBGGogAhDzAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRiECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQlQIhAgsgACACEIgCIANBIGokAAu5AQICfwF8IwBBIGsiAyQAIANBGGogAhDzAiACQRhqIgQgAykDGDcDACADQRhqIAIQ8wIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQiwI5AyAgAyAEKQMANwMIIAJBKGogA0EIahCLAiIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhCIAiADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQ8wIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEPMCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEIsCOQMgIAMgBCkDADcDCCACQShqIANBCGoQiwIiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQiAIgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIANBGGogAhDzAiACQRhqIgQgAykDGDcDACADQRhqIAIQ8wIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhAgAigCGEchAgwB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IAKsNwAADwtB7yZBrgFB+DEQyAMACyAAIAJB/wEgAkH/AUgbIgFBACABQQBKGzoAAAuzAwMBfwF8AX4CQAJAAkAgAUEISQ0AAkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEJwDtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtB7yZBygFBjDIQyAMAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQnAO3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoApy1ASICIABHDQBBnLUBIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhDvAxoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAENwIAIAAgA0EHdDsBBEEAIQIgAEEAKAKctQE2AgBBACAANgKctQELIAIPC0HkK0ErQfcWEMgDAAvRAQICfwF+QX4hAgJAAkAgAS0ADEECSQ0AIAEpAgQiBFANACABLwEQ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PSV4ACUtczoleAAlczoleABjbG9zdXJlOiVkOiV4AG1ldGhvZDolZDoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABwb3cAamRfd3Nza19uZXcAaWRpdgBwcmV2AHRzYWdnX2NsaWVudF9ldgBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQAlczoldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAc3FydABhdXRoIHRvbyBzaG9ydABpbnNlcnQAY2JydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABEZXZpY2VTY3JpcHQAcmVib290AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudAByYW5kb21JbnQAZGV2aWNlc2NyaXB0bWdyX2luaXQAd2FpdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAZm9ybWF0AGJsaXRBdABzZXRBdABnZXRBdABmaWxsQXQAY2hhckNvZGVBdAB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBibHRpbiA8IGRldnNfbnVtX2J1aWx0aW5fZnVuY3Rpb25zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGFicwBzbGVlcE1zAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBmbG9vcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgBmcmVlX2ZpYmVyAGV4cABqZF9zaGEyNTZfc2V0dXAAcG9wAGRldnNfYnVmZmVyX29wAGNsYW1wACFzd2VlcABtYXAAc21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAHJlLXJ1bgBub24tZnVuAGJ1dHRvbgBtb3Rpb24AZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAG1pbgBtYWluAGRldnNfb2JqZWN0X2dldF9idWlsdF9pbgBkZXZzX29iamVjdF9nZXRfc3RhdGljX2J1aWx0X2luAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AYm9vbGVhbgByYW5kb20AZmxhc2hfcHJvZ3JhbQBpbXVsAG51bGwAaW1hZ2UgdG9vIHNtYWxsAGpkX3JvbGVfZnJlZV9hbGwAY2VpbABsaWdodExldmVsAHdhdGVyTGV2ZWwAc291bmRMZXZlbABtYWduZXRpY0ZpZWxkTGV2ZWwAc2lnbmFsAD9zcGVjaWFsAGRldnNfaW1nX3N0cmlkeF9vawBzY2FuX2djX29iagBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAc2V0TGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAHZlcnNpb24gbWlzbWF0Y2gAZm9yRWFjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBsb2cAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAYnVmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgBmbmlkeCA8PSAweGZmZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAP3ZhbHVlAHdyaXRlAGRldnNfZmliZXJfYWN0aXZhdGUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAGRldnNfbWFrZV9jbG9zdXJlAHByb3RvdHlwZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAcm9sZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAb25DaGFuZ2UAamRfd3Nza19zZW5kX21lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAP2ZyZWUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAc3Vic2NyaWJlAGNsb3VkAGltb2QAcm91bmQAYm91bmQAcm9sZW1ncl9hdXRvYmluZABkZXZzX29iamVjdF9nZXRfbm9fYmluZABkZXZzX2Z1bmN0aW9uX2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABvbkRpc2Nvbm5lY3RlZABXUzogY29ubmVjdGVkAGlzQ29ubmVjdGVkAG9uQ29ubmVjdGVkAGNyZWF0ZWQAdW5kZWZpbmVkAHVwbG9hZCBmYWlsZWQAIXN0YXRlLT5sb2NrZWQAZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAHdpbmRTcGVlZABtYXRyaXhLZXlwYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAByZWFkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABmdW46JWQAYnVpbHRpbjolZABEZXZpY2VTY3JpcHQgcnVudGltZSB2JWQuJWQuJWQ7IGZpbGUgdiVkLiVkLiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBwYW5pYwBiYWQgbWFnaWMAbnVtcGFyYW1zICsgMSA9PSBjdHgtPnN0YWNrX3RvcF9mb3JfZ2MAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX29wcy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9hZ2didWZmZXIuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvYnVmZmVyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBqYWNkYWMtYy9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGphY2RhYy1jL25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZmliAD8/P2IAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtGdW5jdGlvbjogJXNdAFtDbG9zdXJlOiAlc10AW1JvbGU6ICVzXQBbTWV0aG9kOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW1N0YXRpYyBPYmo6ICVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dAGlkeCA8PSBERVZTX0JVSUxUSU5fT0JKRUNUX19fTUFYACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBtaWR4IDwgTUFYX1BST1RPAHN0bXRfY2FsbE4ATmFOAHBrdCAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAFBJAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUATE9HMkUATE9HMTBFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBkZXZzX2ltZ19nZXRfdXRmOABsb2cyAFNRUlQxXzIAU1FSVDIAZUNPMgBMTjIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAZXZlbnRfc2NvcGUgPT0gMQBjdHgtPnN0YWNrX3RvcCA9PSBOICsgMQBhcmcwAGxvZzEwAExOMTAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAYWN0LT5tYXhwYyA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAaC0+bnVtX2FyZ3MgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAZGV2c19oYW5kbGVfaGlnaF92YWx1ZShvYmopID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpID09IDAAKGh2ID4+IFBBQ0tfU0hJRlQpID09IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBERVZTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAHB0ICE9IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwA/LgBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAZGV2c19pc19wcm90byhwcm90bykAKG51bGwpAGZpZHggPCBkZXZzX2ltZ19udW1fZnVuY3Rpb25zKGN0eC0+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Y2tfb25fdGhyZWFkDhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQ8UamRfY3J5cHRvX2dldF9yYW5kb20QD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUC3NldFRlbXBSZXQwFRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxYRX193YXNtX2NhbGxfY3RvcnMXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGhlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGxRhcHBfZ2V0X2RldmljZV9jbGFzcxwIaHdfcGFuaWMdCGpkX2JsaW5rHgdqZF9nbG93HxRqZF9hbGxvY19zdGFja19jaGVjayAIamRfYWxsb2MhB2pkX2ZyZWUiDXRhcmdldF9pbl9pcnEjEnRhcmdldF9kaXNhYmxlX2lycSQRdGFyZ2V0X2VuYWJsZV9pcnElE2pkX3NldHRpbmdzX2dldF9iaW4mE2pkX3NldHRpbmdzX3NldF9iaW4nEmRldnNfcGFuaWNfaGFuZGxlcigQamRfZW1fc2VuZF9mcmFtZSkaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nKwpqZF9lbV9pbml0LA1qZF9lbV9wcm9jZXNzLQVkbWVzZy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95Mgxod19kZXZpY2VfaWQzDHRhcmdldF9yZXNldDQOdGltX2dldF9taWNyb3M1EmpkX3RjcHNvY2tfcHJvY2VzczYRYXBwX2luaXRfc2VydmljZXM3EmRldnNfY2xpZW50X2RlcGxveTgUY2xpZW50X2V2ZW50X2hhbmRsZXI5C2FwcF9wcm9jZXNzOgd0eF9pbml0Ow9qZF9wYWNrZXRfcmVhZHk8CnR4X3Byb2Nlc3M9F2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlPg5qZF93ZWJzb2NrX25ldz8Gb25vcGVuQAdvbmVycm9yQQdvbmNsb3NlQglvbm1lc3NhZ2VDEGpkX3dlYnNvY2tfY2xvc2VEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemVFFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGVGD3JvbGVtZ3JfcHJvY2Vzc0cQcm9sZW1ncl9hdXRvYmluZEgVcm9sZW1ncl9oYW5kbGVfcGFja2V0SRRqZF9yb2xlX21hbmFnZXJfaW5pdEoYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkSw1qZF9yb2xlX2FsbG9jTBBqZF9yb2xlX2ZyZWVfYWxsTRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kThJqZF9yb2xlX2J5X3NlcnZpY2VPE2pkX2NsaWVudF9sb2dfZXZlbnRQE2pkX2NsaWVudF9zdWJzY3JpYmVRFGpkX2NsaWVudF9lbWl0X2V2ZW50UhRyb2xlbWdyX3JvbGVfY2hhbmdlZFMQamRfZGV2aWNlX2xvb2t1cFQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlVRNqZF9zZXJ2aWNlX3NlbmRfY21kVhFqZF9jbGllbnRfcHJvY2Vzc1cOamRfZGV2aWNlX2ZyZWVYF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0WQ9qZF9kZXZpY2VfYWxsb2NaDmFnZ2J1ZmZlcl9pbml0Ww9hZ2didWZmZXJfZmx1c2hcEGFnZ2J1ZmZlcl91cGxvYWRdDmRldnNfYnVmZmVyX29wXhBkZXZzX3JlYWRfbnVtYmVyXw9kZXZzX2NyZWF0ZV9jdHhgCXNldHVwX2N0eGEKZGV2c190cmFjZWIPZGV2c19lcnJvcl9jb2RlYxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyZAljbGVhcl9jdHhlDWRldnNfZnJlZV9jdHhmCGRldnNfb29tZwlkZXZzX2ZyZWVoF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzaQd0cnlfcnVuagxzdG9wX3Byb2dyYW1rHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRsHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVtGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaG4dZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRvDmRlcGxveV9oYW5kbGVycBNkZXBsb3lfbWV0YV9oYW5kbGVycRZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95chRkZXZpY2VzY3JpcHRtZ3JfaW5pdHMZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldnQRZGV2c2Nsb3VkX3Byb2Nlc3N1F2RldnNjbG91ZF9oYW5kbGVfcGFja2V0dhNkZXZzY2xvdWRfb25fbWV0aG9kdw5kZXZzY2xvdWRfaW5pdHgQZGV2c19maWJlcl95aWVsZHkYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uegpkZXZzX3BhbmljexhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV8EGRldnNfZmliZXJfc2xlZXB9G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbH4MbG9nX2ZpYmVyX29wfxpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc4ABEWRldnNfaW1nX2Z1bl9uYW1lgQESZGV2c19pbWdfcm9sZV9uYW1lggESZGV2c19maWJlcl9ieV9maWR4gwERZGV2c19maWJlcl9ieV90YWeEARBkZXZzX2ZpYmVyX3N0YXJ0hQEUZGV2c19maWJlcl90ZXJtaWFudGWGAQ5kZXZzX2ZpYmVyX3J1bocBE2RldnNfZmliZXJfc3luY19ub3eIARVfZGV2c19ydW50aW1lX2ZhaWx1cmWJAQ9kZXZzX2ZpYmVyX3Bva2WKARNqZF9nY19hbnlfdHJ5X2FsbG9jiwEHZGV2c19nY4wBD2ZpbmRfZnJlZV9ibG9ja40BEmRldnNfYW55X3RyeV9hbGxvY44BDmRldnNfdHJ5X2FsbG9jjwELamRfZ2NfdW5waW6QAQpqZF9nY19mcmVlkQEOZGV2c192YWx1ZV9waW6SARBkZXZzX3ZhbHVlX3VucGlukwESZGV2c19tYXBfdHJ5X2FsbG9jlAEUZGV2c19hcnJheV90cnlfYWxsb2OVARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OWARVkZXZzX3N0cmluZ190cnlfYWxsb2OXAQ9kZXZzX2djX3NldF9jdHiYAQ5kZXZzX2djX2NyZWF0ZZkBD2RldnNfZ2NfZGVzdHJveZoBC3NjYW5fZ2Nfb2JqmwEKc2Nhbl9hcnJheZwBE3NjYW5fYXJyYXlfYW5kX21hcmudAQhtYXJrX3B0cp4BEXByb3BfQXJyYXlfbGVuZ3RonwESbWV0aDJfQXJyYXlfaW5zZXJ0oAERZnVuMV9CdWZmZXJfYWxsb2OhARJwcm9wX0J1ZmZlcl9sZW5ndGiiARVtZXRoMF9CdWZmZXJfdG9TdHJpbmejARNtZXRoM19CdWZmZXJfZmlsbEF0pAETbWV0aDRfQnVmZmVyX2JsaXRBdKUBGWZ1bjFfRGV2aWNlU2NyaXB0X3NsZWVwTXOmARdmdW4xX0RldmljZVNjcmlwdF9wYW5pY6cBGGZ1bjBfRGV2aWNlU2NyaXB0X3JlYm9vdKgBGGZ1blhfRGV2aWNlU2NyaXB0X2Zvcm1hdKkBFWZ1bjFfRGV2aWNlU2NyaXB0X2xvZ6oBFG1ldGhYX0Z1bmN0aW9uX3N0YXJ0qwEOZnVuMV9NYXRoX2NlaWysAQ9mdW4xX01hdGhfZmxvb3KtAQ9mdW4xX01hdGhfcm91bmSuAQ1mdW4xX01hdGhfYWJzrwEQZnVuMF9NYXRoX3JhbmRvbbABE2Z1bjFfTWF0aF9yYW5kb21JbnSxAQ1mdW4xX01hdGhfbG9nsgENZnVuMl9NYXRoX3Bvd7MBDmZ1bjJfTWF0aF9pZGl2tAEOZnVuMl9NYXRoX2ltb2S1AQ5mdW4yX01hdGhfaW11bLYBDWZ1bjJfTWF0aF9taW63AQtmdW4yX21pbm1heLgBDWZ1bjJfTWF0aF9tYXi5ARVwcm9wX1JvbGVfaXNDb25uZWN0ZWS6ARJwcm9wX1N0cmluZ19sZW5ndGi7ARdtZXRoMV9TdHJpbmdfY2hhckNvZGVBdLwBFGRldnNfamRfZ2V0X3JlZ2lzdGVyvQEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZL4BEGRldnNfamRfc2VuZF9jbWS/ARNkZXZzX2pkX3NlbmRfbG9nbXNnwAENaGFuZGxlX2xvZ21zZ8EBEmRldnNfamRfc2hvdWxkX3J1bsIBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hlwwETZGV2c19qZF9wcm9jZXNzX3BrdMQBFGRldnNfamRfcm9sZV9jaGFuZ2VkxQEUZGV2c19qZF9yZXNldF9wYWNrZXTGARJkZXZzX2pkX2luaXRfcm9sZXPHARJkZXZzX2pkX2ZyZWVfcm9sZXPIARBkZXZzX3NldF9sb2dnaW5nyQEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzygEMZGV2c19tYXBfc2V0ywEGbG9va3VwzAEYZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luzQERZGV2c19wcm90b19sb29rdXDOARJkZXZzX2Z1bmN0aW9uX2JpbmTPARFkZXZzX21ha2VfY2xvc3VyZdABDmRldnNfZ2V0X2ZuaWR40QEYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVk0gEXZGV2c19vYmplY3RfZ2V0X25vX2JpbmTTAQ9kZXZzX29iamVjdF9nZXTUAQxkZXZzX2FueV9nZXTVAQxkZXZzX2FueV9zZXTWAQxkZXZzX3NlcV9zZXTXAQ5kZXZzX2FycmF5X3NldNgBEWRldnNfYXJyYXlfaW5zZXJ02QEMZGV2c19hcmdfaW502gEPZGV2c19hcmdfZG91Ymxl2wEPZGV2c19yZXRfZG91Ymxl3AEMZGV2c19yZXRfaW503QEPZGV2c19yZXRfZ2NfcHRy3gESZGV2c19yZWdjYWNoZV9mcmVl3wEWZGV2c19yZWdjYWNoZV9mcmVlX2FsbOABF2RldnNfcmVnY2FjaGVfbWFya191c2Vk4QETZGV2c19yZWdjYWNoZV9hbGxvY+IBFGRldnNfcmVnY2FjaGVfbG9va3Vw4wERZGV2c19yZWdjYWNoZV9hZ2XkARdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZeUBEmRldnNfcmVnY2FjaGVfbmV4dOYBD2pkX3NldHRpbmdzX2dldOcBD2pkX3NldHRpbmdzX3NldOgBDmRldnNfbG9nX3ZhbHVl6QEPZGV2c19zaG93X3ZhbHVl6gEQZGV2c19zaG93X3ZhbHVlMOsBDWNvbnN1bWVfY2h1bmvsAQ1zaGFfMjU2X2Nsb3Nl7QEPamRfc2hhMjU2X3NldHVw7gEQamRfc2hhMjU2X3VwZGF0Ze8BEGpkX3NoYTI1Nl9maW5pc2jwARRqZF9zaGEyNTZfaG1hY19zZXR1cPEBFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaPIBDmpkX3NoYTI1Nl9oa2Rm8wEOZGV2c19zdHJmb3JtYXT0AQ5kZXZzX2lzX3N0cmluZ/UBDmRldnNfaXNfbnVtYmVy9gEUZGV2c19zdHJpbmdfZ2V0X3V0Zjj3ARRkZXZzX3N0cmluZ192c3ByaW50ZvgBE2RldnNfc3RyaW5nX3NwcmludGb5ARVkZXZzX3N0cmluZ19mcm9tX3V0Zjj6ARRkZXZzX3ZhbHVlX3RvX3N0cmluZ/sBEGJ1ZmZlcl90b19zdHJpbmf8ARJkZXZzX3N0cmluZ19jb25jYXT9ARxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNj/gEPdHNhZ2dfY2xpZW50X2V2/wEKYWRkX3Nlcmllc4ACDXRzYWdnX3Byb2Nlc3OBAgpsb2dfc2VyaWVzggITdHNhZ2dfaGFuZGxlX3BhY2tldIMCFGxvb2t1cF9vcl9hZGRfc2VyaWVzhAIKdHNhZ2dfaW5pdIUCDHRzYWdnX3VwZGF0ZYYCFmRldnNfdmFsdWVfZnJvbV9kb3VibGWHAhNkZXZzX3ZhbHVlX2Zyb21faW50iAIUZGV2c192YWx1ZV9mcm9tX2Jvb2yJAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcooCEWRldnNfdmFsdWVfdG9faW50iwIUZGV2c192YWx1ZV90b19kb3VibGWMAhJkZXZzX3ZhbHVlX3RvX2Jvb2yNAg5kZXZzX2lzX2J1ZmZlco4CF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxljwIQZGV2c19idWZmZXJfZGF0YZACE2RldnNfYnVmZmVyaXNoX2RhdGGRAhRkZXZzX3ZhbHVlX3RvX2djX29iapICDWRldnNfaXNfYXJyYXmTAhFkZXZzX3ZhbHVlX3R5cGVvZpQCD2RldnNfaXNfbnVsbGlzaJUCEmRldnNfdmFsdWVfaWVlZV9lcZYCEmRldnNfaW1nX3N0cmlkeF9va5cCEmRldnNfZHVtcF92ZXJzaW9uc5gCC2RldnNfdmVyaWZ5mQIUZGV2c192bV9leGVjX29wY29kZXOaAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeJsCEWRldnNfaW1nX2dldF91dGY4nAIUZGV2c19nZXRfc3RhdGljX3V0ZjidAgxleHByX2ludmFsaWSeAhRleHByeF9idWlsdGluX29iamVjdJ8CC3N0bXQxX2NhbGwwoAILc3RtdDJfY2FsbDGhAgtzdG10M19jYWxsMqICC3N0bXQ0X2NhbGwzowILc3RtdDVfY2FsbDSkAgtzdG10Nl9jYWxsNaUCC3N0bXQ3X2NhbGw2pgILc3RtdDhfY2FsbDenAgtzdG10OV9jYWxsOKgCDGV4cHIyX3N0cjBlcakCDHN0bXQxX3JldHVybqoCCXN0bXR4X2ptcKsCDHN0bXR4MV9qbXBfeqwCC3N0bXQxX3BhbmljrQIWZXhwcjBfcGt0X2NvbW1hbmRfY29kZa4CEnN0bXR4MV9zdG9yZV9sb2NhbK8CE3N0bXR4MV9zdG9yZV9nbG9iYWywAhJzdG10NF9zdG9yZV9idWZmZXKxAhZleHByMF9wa3RfcmVnX2dldF9jb2RlsgIQZXhwcnhfbG9hZF9sb2NhbLMCEWV4cHJ4X2xvYWRfZ2xvYmFstAIVZXhwcjBfcGt0X3JlcG9ydF9jb2RltQILZXhwcjJfaW5kZXi2Ag9zdG10M19pbmRleF9zZXS3AhRleHByeDFfYnVpbHRpbl9maWVsZLgCEmV4cHJ4MV9hc2NpaV9maWVsZLkCEWV4cHJ4MV91dGY4X2ZpZWxkugIQZXhwcnhfbWF0aF9maWVsZLsCDmV4cHJ4X2RzX2ZpZWxkvAIPc3RtdDBfYWxsb2NfbWFwvQIRc3RtdDFfYWxsb2NfYXJyYXm+AhJzdG10MV9hbGxvY19idWZmZXK/AhFleHByeF9zdGF0aWNfcm9sZcACE2V4cHJ4X3N0YXRpY19idWZmZXLBAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfCAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nwwIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nxAIVZXhwcnhfc3RhdGljX2Z1bmN0aW9uxQINZXhwcnhfbGl0ZXJhbMYCEWV4cHJ4X2xpdGVyYWxfZjY0xwIQZXhwcjBfcGt0X2J1ZmZlcsgCEWV4cHIzX2xvYWRfYnVmZmVyyQINZXhwcjBfcmV0X3ZhbMoCDGV4cHIxX3R5cGVvZssCCmV4cHIwX251bGzMAg1leHByMV9pc19udWxszQIKZXhwcjBfdHJ1Zc4CC2V4cHIwX2ZhbHNlzwINZXhwcjFfdG9fYm9vbNACCWV4cHIwX25hbtECCWV4cHIxX2Fic9ICDWV4cHIxX2JpdF9ub3TTAgxleHByMV9pc19uYW7UAglleHByMV9uZWfVAglleHByMV9ub3TWAgxleHByMV90b19pbnTXAglleHByMl9hZGTYAglleHByMl9zdWLZAglleHByMl9tdWzaAglleHByMl9kaXbbAg1leHByMl9iaXRfYW5k3AIMZXhwcjJfYml0X29y3QINZXhwcjJfYml0X3hvct4CEGV4cHIyX3NoaWZ0X2xlZnTfAhFleHByMl9zaGlmdF9yaWdodOACGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk4QIIZXhwcjJfZXHiAghleHByMl9sZeMCCGV4cHIyX2x05AIIZXhwcjJfbmXlAhVzdG10MV90ZXJtaW5hdGVfZmliZXLmAg9zdG10MV93YWl0X3JvbGXnAg9zdG10M19xdWVyeV9yZWfoAg5zdG10Ml9zZW5kX2NtZOkCE3N0bXQ0X3F1ZXJ5X2lkeF9yZWfqAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVy6wINc3RtdDJfc2V0X3BrdOwCDGV4cHIwX25vd19tc+0CFmV4cHIxX2dldF9maWJlcl9oYW5kbGXuAg5leHByMF9wa3Rfc2l6Ze8CEWV4cHIwX3BrdF9ldl9jb2Rl8AIUc3RtdHgyX3N0b3JlX2Nsb3N1cmXxAhNleHByeDFfbG9hZF9jbG9zdXJl8gISZXhwcnhfbWFrZV9jbG9zdXJl8wIPZGV2c192bV9wb3BfYXJn9AITZGV2c192bV9wb3BfYXJnX3UzMvUCE2RldnNfdm1fcG9wX2FyZ19pMzL2AhZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy9wIbZGV2c192bV9wb3BfYXJnX2J1ZmZlcl9kYXRh+AIWZGV2c192bV9wb3BfYXJnX3N0cmlkePkCFGRldnNfdm1fcG9wX2FyZ19yb2xl+gISamRfYWVzX2NjbV9lbmNyeXB0+wISamRfYWVzX2NjbV9kZWNyeXB0/AIMQUVTX2luaXRfY3R4/QIPQUVTX0VDQl9lbmNyeXB0/gIQamRfYWVzX3NldHVwX2tlef8CDmpkX2Flc19lbmNyeXB0gAMQamRfYWVzX2NsZWFyX2tleYEDC2pkX3dzc2tfbmV3ggMUamRfd3Nza19zZW5kX21lc3NhZ2WDAxNqZF93ZWJzb2NrX29uX2V2ZW50hAMHZGVjcnlwdIUDDWpkX3dzc2tfY2xvc2WGAxBqZF93c3NrX29uX2V2ZW50hwMKc2VuZF9lbXB0eYgDEndzc2toZWFsdGhfcHJvY2Vzc4kDF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxligMUd3Nza2hlYWx0aF9yZWNvbm5lY3SLAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSMAw9zZXRfY29ubl9zdHJpbmeNAxFjbGVhcl9jb25uX3N0cmluZ44DD3dzc2toZWFsdGhfaW5pdI8DE3dzc2tfcHVibGlzaF92YWx1ZXOQAxB3c3NrX3B1Ymxpc2hfYmlukQMRd3Nza19pc19jb25uZWN0ZWSSAxN3c3NrX3Jlc3BvbmRfbWV0aG9kkwMPamRfY3RybF9wcm9jZXNzlAMVamRfY3RybF9oYW5kbGVfcGFja2V0lQMMamRfY3RybF9pbml0lgMNamRfaXBpcGVfb3BlbpcDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXSYAw5qZF9pcGlwZV9jbG9zZZkDEmpkX251bWZtdF9pc192YWxpZJoDFWpkX251bWZtdF93cml0ZV9mbG9hdJsDE2pkX251bWZtdF93cml0ZV9pMzKcAxJqZF9udW1mbXRfcmVhZF9pMzKdAxRqZF9udW1mbXRfcmVhZF9mbG9hdJ4DEWpkX29waXBlX29wZW5fY21knwMUamRfb3BpcGVfb3Blbl9yZXBvcnSgAxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0oQMRamRfb3BpcGVfd3JpdGVfZXiiAxBqZF9vcGlwZV9wcm9jZXNzowMUamRfb3BpcGVfY2hlY2tfc3BhY2WkAw5qZF9vcGlwZV93cml0ZaUDDmpkX29waXBlX2Nsb3NlpgMNamRfcXVldWVfcHVzaKcDDmpkX3F1ZXVlX2Zyb250qAMOamRfcXVldWVfc2hpZnSpAw5qZF9xdWV1ZV9hbGxvY6oDDWpkX3Jlc3BvbmRfdTirAw5qZF9yZXNwb25kX3UxNqwDDmpkX3Jlc3BvbmRfdTMyrQMRamRfcmVzcG9uZF9zdHJpbmeuAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZK8DC2pkX3NlbmRfcGt0sAMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyxAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcrIDGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSzAxRqZF9hcHBfaGFuZGxlX3BhY2tldLQDFWpkX2FwcF9oYW5kbGVfY29tbWFuZLUDE2pkX2FsbG9jYXRlX3NlcnZpY2W2AxBqZF9zZXJ2aWNlc19pbml0twMOamRfcmVmcmVzaF9ub3e4AxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkuQMUamRfc2VydmljZXNfYW5ub3VuY2W6AxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZbsDEGpkX3NlcnZpY2VzX3RpY2u8AxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbme9AxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZb4DEmFwcF9nZXRfZndfdmVyc2lvbr8DFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXAAw1qZF9oYXNoX2ZudjFhwQMMamRfZGV2aWNlX2lkwgMJamRfcmFuZG9twwMIamRfY3JjMTbEAw5qZF9jb21wdXRlX2NyY8UDDmpkX3NoaWZ0X2ZyYW1lxgMOamRfcmVzZXRfZnJhbWXHAxBqZF9wdXNoX2luX2ZyYW1lyAMNamRfcGFuaWNfY29yZckDE2pkX3Nob3VsZF9zYW1wbGVfbXPKAxBqZF9zaG91bGRfc2FtcGxlywMJamRfdG9faGV4zAMLamRfZnJvbV9oZXjNAw5qZF9hc3NlcnRfZmFpbM4DB2pkX2F0b2nPAwtqZF92c3ByaW50ZtADD2pkX3ByaW50X2RvdWJsZdEDCmpkX3NwcmludGbSAxJqZF9kZXZpY2Vfc2hvcnRfaWTTAwxqZF9zcHJpbnRmX2HUAwtqZF90b19oZXhfYdUDFGpkX2RldmljZV9zaG9ydF9pZF9h1gMJamRfc3RyZHVw1wMOamRfanNvbl9lc2NhcGXYAxNqZF9qc29uX2VzY2FwZV9jb3Jl2QMJamRfbWVtZHVw2gMWamRfcHJvY2Vzc19ldmVudF9xdWV1ZdsDFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWXcAxFqZF9zZW5kX2V2ZW50X2V4dN0DCmpkX3J4X2luaXTeAxRqZF9yeF9mcmFtZV9yZWNlaXZlZN8DHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNr4AMPamRfcnhfZ2V0X2ZyYW1l4QMTamRfcnhfcmVsZWFzZV9mcmFtZeIDEWpkX3NlbmRfZnJhbWVfcmF34wMNamRfc2VuZF9mcmFtZeQDCmpkX3R4X2luaXTlAwdqZF9zZW5k5gMWamRfc2VuZF9mcmFtZV93aXRoX2NyY+cDD2pkX3R4X2dldF9mcmFtZegDEGpkX3R4X2ZyYW1lX3NlbnTpAwtqZF90eF9mbHVzaOoDEF9fZXJybm9fbG9jYXRpb27rAwxfX2ZwY2xhc3NpZnnsAwVkdW1tee0DCF9fbWVtY3B57gMHbWVtbW92Ze8DBm1lbXNldPADCl9fbG9ja2ZpbGXxAwxfX3VubG9ja2ZpbGXyAwxfX3N0ZGlvX3NlZWvzAw1fX3N0ZGlvX3dyaXRl9AMNX19zdGRpb19jbG9zZfUDDF9fc3RkaW9fZXhpdPYDCmNsb3NlX2ZpbGX3AwlfX3Rvd3JpdGX4AwlfX2Z3cml0ZXj5AwZmd3JpdGX6AytlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxz+wMUX19wdGhyZWFkX211dGV4X2xvY2v8AxZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr/QMGX19sb2Nr/gMOX19tYXRoX2Rpdnplcm//Aw5fX21hdGhfaW52YWxpZIAEA2xvZ4EEBWxvZzEwggQHX19sc2Vla4MEBm1lbWNtcIQECl9fb2ZsX2xvY2uFBAxfX21hdGhfeGZsb3eGBApmcF9iYXJyaWVyhwQMX19tYXRoX29mbG93iAQMX19tYXRoX3VmbG93iQQEZmFic4oEA3Bvd4sECGNoZWNraW50jAQLc3BlY2lhbGNhc2WNBAVyb3VuZI4EBnN0cmNoco8EC19fc3RyY2hybnVskAQGc3RyY21wkQQGc3RybGVukgQSX193YXNpX3N5c2NhbGxfcmV0kwQIZGxtYWxsb2OUBAZkbGZyZWWVBBhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemWWBARzYnJrlwQJX19wb3dpZGYymAQJc3RhY2tTYXZlmQQMc3RhY2tSZXN0b3JlmgQKc3RhY2tBbGxvY5sEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdJwEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWdBBllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlngQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5knwQMZHluQ2FsbF9qaWppoAQWbGVnYWxzdHViJGR5bkNhbGxfamlqaaEEGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAZ8EBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
