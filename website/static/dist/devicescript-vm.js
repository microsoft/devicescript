
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB2YGAgAAiYAF/AGADf39/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgA39+fwF+YAABfmABfgF/YAJ/fABgBX9/f39/AX9gBX9/f39/AGACf38BfGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAh/f39/f39/fwF/YAN/f3wAYAN/fH8AYAJ/fgBgAXwBf2ACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/AsyFgIAAFgNlbnYFYWJvcnQABQNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgAAA2Vudg1lbV9zZW5kX2ZyYW1lAAADZW52EGVtX2NvbnNvbGVfZGVidWcAAANlbnYEZXhpdAAAA2VudgtlbV90aW1lX25vdwATA2VudhNkZXZzX2RlcGxveV9oYW5kbGVyAAADZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAYDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAGA2VudhRqZF9jcnlwdG9fZ2V0X3JhbmRvbQACFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAYWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFw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iAFBACECCwJAIAAgAiAAQQAQ1gEgAEEBENYBENUBRQ0AIAFBGGogAEGKARCIAQsgAUEgaiQACxMAIAAgACAAQQAQ1gEQlQEQ2gELeQIBfwF+IwBBIGsiAyQAIAMgAikDACIENwMIIAMgBDcDEAJAAkACQCABIANBCGoQigINACADQRhqIAFBngEQiAEMAQsgAyADKQMQNwMAIAEgAyADQRhqEIwCRQ0AIAAgAygCGBCEAgwBCyAAQgA3AwALIANBIGokAAuQAQICfwF+IwBBMGsiASQAIAEgACkDQCIDNwMQIAEgAzcDIAJAAkAgACABQRBqEIoCDQAgAUEoaiAAQZ4BEIgBQQAhAgwBCyABIAEpAyA3AwggACABQQhqIAFBKGoQjAIhAgsCQCACRQ0AIAFBGGogACACIAEoAigQ9gEgACgCmAEgASkDGDcDIAsgAUEwaiQAC7YBAgV/AX4jAEEgayIBJAAgASAAKQNAIgY3AwggASAGNwMQAkACQCAAIAFBCGoQiwINACABQRhqIABBnwEQiAFBACECDAELIAEgASkDEDcDACAAIAEgAUEYahCMAiECCwJAIAJFDQAgAEEAENYBIQMgAEEBENYBIQQgAEECENYBIQAgASgCGCIFIANNDQAgASAFIANrIgU2AhggAiADaiAAIAUgBCAFIARJGxDpAxoLIAFBIGokAAvzAgIHfwF+IwBB0ABrIgEkACABIAApA0AiCDcDKCABIAg3A0ACQAJAIAAgAUEoahCLAg0AIAFByABqIABBnwEQiAFBACECDAELIAEgASkDQDcDICAAIAFBIGogAUE8ahCMAiECCyAAQQAQ1gEhAyABIABB0ABqKQMAIgg3AxggASAINwMwAkACQCAAIAFBGGoQ8QFFDQAgASABKQMwNwMAIAAgASABQcgAahDzASEEDAELIAEgASkDMCIINwNAIAEgCDcDEAJAIAAgAUEQahCKAg0AIAFByABqIABBngEQiAFBACEEDAELIAEgASkDQDcDCCAAIAFBCGogAUHIAGoQjAIhBAsgAEECENYBIQUgAEEDENYBIQACQCABKAJIIgYgBU0NACABIAYgBWsiBjYCSCABKAI8IgcgA00NACABIAcgA2siBzYCPCACIANqIAQgBWogByAGIAAgBiAASRsiACAHIABJGxDnAxoLIAFB0ABqJAALHwEBfwJAIABBABDWASIBQQBIDQAgACgCmAEgARB8CwshAQF/IABB/wAgAEEAENYBIgEgAUGAgHxqQYGAfEkbEHoLCAAgAEEAEHoLywECB38BfiMAQeAAayIBJAACQCAALQAzQQJJDQAgASAAQcgAaikDACIINwNYIAEgCDcDCCAAIAFBCGogAUHUAGoQ8wEiAkUNACAAIAAgAiABKAJUIAFBEGpBwAAgAEHQAGoiAyAALQAzQX5qIgRBABDwASIFQX9qIgYQlgEiB0UNAAJAAkAgBUHBAEkNACAAIAIgASgCVCAHQQZqIAUgAyAEQQAQ8AEaDAELIAdBBmogAUEQaiAGEOcDGgsgACAHENoBCyABQeAAaiQAC1YCAX8BfiMAQSBrIgEkACABIABByABqKQMAIgI3AxggASACNwMIIAFBEGogACABQQhqEPcBIAEgASkDECICNwMYIAEgAjcDACAAIAEQvQEgAUEgaiQAC5EBAQN/IwBBEGsiASQAAkACQCAALQAzQQFLDQAgAUEIaiAAQYkBEIgBDAELAkAgAEEAENYBIgJBe2pBe0sNACABQQhqIABBiQEQiAEMAQsgACAALQAzQX9qIgM6ADMgAEHIAGogAEHQAGogA0H/AXFBf2oiA0EDdBDoAxogACAAIAMgAhCEARDaAQsgAUEQaiQAC1gCAX8BfiMAQRBrIgEkACABIABByABqKQMAIgI3AwgCQAJAIAEoAgxBf0cNACAAKAKYASACNwMgDAELIAEgASkDCDcDACAAIAEQiAKbENgBCyABQRBqJAALWAIBfwF+IwBBEGsiASQAIAEgAEHIAGopAwAiAjcDCAJAAkAgASgCDEF/Rw0AIAAoApgBIAI3AyAMAQsgASABKQMINwMAIAAgARCIApwQ2AELIAFBEGokAAtaAgF/AX4jAEEQayIBJAAgASAAQcgAaikDACICNwMIAkACQCABKAIMQX9HDQAgACgCmAEgAjcDIAwBCyABIAEpAwg3AwAgACABEIgCEIcEENgBCyABQRBqJAALtQEDAn8BfgF8IwBBIGsiASQAIAEgAEHIAGopAwAiAzcDGAJAAkAgASgCHEF/Rw0AIAOnIgJBgICAgHhGDQACQAJAIAJBAEgNACABIAM3AxAMAQsgAUEQakEAIAJrEIQCCyAAKAKYASABKQMQNwMgDAELIAEgASkDGDcDCAJAIAFBCGoQiAIiBEQAAAAAAAAAAGNFDQAgACAEmhDYAQwBCyAAKAKYASABKQMYNwMgCyABQSBqJAALFQAgABC8A7hEAAAAAAAA8D2iENgBC00BBH9BASEBAkAgAEEAENYBIgJBAU0NAANAIAFBAXRBAXIiASACSQ0ACwsDQCAEELwDIAFxIgMgAyACSyIDGyEEIAMNAAsgACAEENkBCxEAIAAgAEEAENcBEPoDENgBCxgAIAAgAEEAENcBIABBARDXARCEBBDYAQsuAQN/QQAhASAAQQAQ1gEhAgJAIABBARDWASIDRQ0AIAIgA20hAQsgACABENkBCy4BA39BACEBIABBABDWASECAkAgAEEBENYBIgNFDQAgAiADbyEBCyAAIAEQ2QELFgAgACAAQQAQ1gEgAEEBENYBbBDZAQsJACAAQQEQtQEL6AICBH8CfCMAQTBrIgIkACACIABByABqKQMANwMoIAIgAEHQAGopAwA3AyACQCACKAIsQX9HDQAgAigCJEF/Rw0AIAIgAikDKDcDGCACQRhqEIcCIQMgAiACKQMgNwMQIAJBEGoQhwIhBAJAAkACQCABRQ0AIAJBKGohBSADIARODQEMAgsgAkEoaiEFIAMgBEoNAQsgAkEgaiEFCyAAKAKYASAFKQMANwMgCyACIAIpAyg3AwggAkEIahCIAiEGIAIgAikDIDcDACACEIgCIQcCQAJAIAa9Qv///////////wCDQoCAgICAgID4/wBWDQAgB71C////////////AINCgYCAgICAgPj/AFQNAQsgACgCmAFBACkDuEU3AyALAkACQAJAIAFFDQAgAkEoaiEBIAYgB2NFDQEMAgsgAkEoaiEBIAYgB2QNAQsgAkEgaiEBCyAAKAKYASABKQMANwMgIAJBMGokAAsJACAAQQAQtQELagECfyMAQRBrIgMkAAJAAkACQCACKAIEIgRBgIDA/wdxDQAgBEEPcUECRg0BCyADQQhqIAFBowEQiAEgAEIANwMADAELIAAgASgCoAEgAigCAEECdGooAgAoAhBBAEcQhQILIANBEGokAAtGAQF/IwBBEGsiAyQAIAMgAikDADcDAAJAAkAgASADIANBDGoQ8wFFDQAgACADKAIMEIQCDAELIABCADcDAAsgA0EQaiQAC3ICA38BfiMAQSBrIgEk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IAJBCGogARCDAiAAKAKYASACKQMINwMgIAJBEGokAAssAQF/IwBBEGsiAiQAIAJBCGogARCEAiAAKAKYASACKQMINwMgIAJBEGokAAswAQF/IwBBEGsiAiQAIAJBCGogAEEIIAEQhgIgACgCmAEgAikDCDcDICACQRBqJAALJAACQCABLQAUQQpJDQAgASgCCBAhCyABQQA7AQIgAUEAOgAUC0gBA39BACEBA0AgACABQRhsaiICQRRqIQMCQCACLQAUQQpJDQAgAigCCBAhCyADQQA6AAAgAkEAOwECIAFBAWoiAUEURw0ACwvLAQEIfyMAQSBrIQICQCAAIAAvAeADIgNBGGxqIAFHDQAgAQ8LAkAgAEEAIANBAWogA0ESSxsiBEEYbGoiAyABRg0AIAJBCGpBEGoiBSABQRBqIgYpAgA3AwAgAkEIakEIaiIHIAFBCGoiCCkCADcDACACIAEpAgA3AwggBiADQRBqIgkpAgA3AgAgCCADQQhqIgYpAgA3AgAgASADKQIANwIAIAkgBSkDADcCACAGIAcpAwA3AgAgAyACKQMINwIACyAAIAQ7AeADIAMLqAMBBn8jAEEgayIEJAACQCACRQ0AQQAhBQJAA0ACQCAAIAVBGGxqLwECDQAgACAFQRhsaiEFDAILIAVBAWoiBUEURw0AC0EAIQULAkAgBQ0AIABBACAALwHgAyIFQQFqIAVBEksbQRhsIgZqIgVBFGohBwJAIAUtABRBCkkNACAAIAZqKAIIECELIAdBADoAACAAIAZqQQA7AQILIAVBADsBFiAFIAI7AQIgBSABOwEAIAUgAzoAFAJAIANBCkkNACAFIAMQIDYCCAsCQAJAIAAgAC8B4AMiA0EYbGogBUcNACAFIQMMAQsCQCAAQQAgA0EBaiADQRJLGyICQRhsaiIDIAVGDQAgBEEIakEQaiIBIAVBEGoiBikCADcDACAEQQhqQQhqIgcgBUEIaiIIKQIANwMAIAQgBSkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACAFIAMpAgA3AgAgCSABKQMANwIAIAYgBykDADcCACADIAQpAwg3AgALIAAgAjsB4AMLIARBIGokACADDwtBtDJB3StBJUGjJRDHAwALaAEFf0EAIQQCQANAAkACQCAAIARBGGwiBWoiBi8BACAB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AgtBACgC2LABIAAgASACIAEgAkkbIgIQ5wMaQQBBACgC3LABIgMgAms2AtywASAAIAJqIQAgASACayEBAkAgAyACRw0AQeSwAUGYsAEQ6AFBAEHAADYC3LABQQBBmLABNgLYsAEgAQ0BDAILQQBBACgC2LABIAJqNgLYsAEgAQ0ACwsLTABBlLABEOkBGiAAQRhqQQApA6ixATcAACAAQRBqQQApA6CxATcAACAAQQhqQQApA5ixATcAACAAQQApA5CxATcAAEEAQQA6AJCwAQuTBwECf0EAIQJBAEIANwPosQFBAEIANwPgsQFBAEIANwPYsQFBAEIANwPQsQFBAEIANwPIsQFBAEIANwPAsQFBAEIANwO4sQFBAEIANwOwsQECQAJAAkACQCABQcEASQ0AECNBAC0AkLABDQJBAEEBOgCQsAEQJEEAIAE2AuCwAUEAQcAANgLcsAFBAEGYsAE2AtiwAUEAQZCxATYClLABQQBCq7OP/JGjs/DbADcC/LABQQBC/6S5iMWR2oKbfzcC9LABQQBC8ua746On/aelfzcC7LABQQBC58yn0NbQ67O7fzcC5LABAkADQAJAQQAoAtywASICQcAARw0AIAFBwABJDQBB5LABIAAQ6AEgAEHAAGohACABQUBqIgENAQwCC0EAKALYsAEgACABIAIgASACSRsiAhDnAxpBAEEAKALcsAEiAyACazYC3LABIAAgAmohACABIAJrIQECQCADIAJHDQBB5LABQZiwARDoAUEAQcAANgLcsAFBAEGYsAE2AtiwASABDQEMAgtBAEEAKALYsAEgAmo2AtiwASABDQALC0GUsAEQ6QEaQQAhAkEAQQApA6ixATcDyLEBQQBBACkDoLEBNwPAsQFBAEEAKQOYsQE3A7ixAUEAQQApA5CxATcDsLEBQQBBADoAkLABDAELQbCxASAAIAEQ5wMaCwNAIAJBsLEBaiIBIAEtAABBNnM6AAAgAkEBaiICQcAARw0ADAILAAtBvyxBDkHdFBDCAwALECMCQEEALQCQsAENAEEAQQE6AJCwARAkQQBCwICAgPDM+YTqADcC4LABQQBBwAA2AtywAUEAQZiwATYC2LABQQBBkLEBNgKUsAFBAEGZmoPfBTYCgLEBQQBCjNGV2Lm19sEfNwL4sAFBAEK66r+q+s+Uh9EANwLwsAFBAEKF3Z7bq+68tzw3AuiwAUGwsQEhAUHAACECAkADQAJAQQAoAtywASIAQcAARw0AIAJBwABJDQBB5LABIAEQ6AEgAUHAAGohASACQUBqIgINAQwCC0EAKALYsAEgASACIAAgAiAASRsiABDnAxpBAEEAKALcsAEiAyAAazYC3LABIAEgAGohASACIABrIQICQCADIABHDQBB5LABQZiwARDoAUEAQcAANgLcsAFBAEGYsAE2AtiwASACDQEMAgtBAEEAKALYsAEgAGo2AtiwASACDQALCw8LQb8sQQ5B3RQQwgMAC7sGAQR/QZSwARDpARpBACEBIABBGGpBACkDqLEBNwAAIABBEGpBACkDoLEBNwAAIABBCGpBACkDmLEBNwAAIABBACkDkLEBNwAAQQBBADoAkLABECMCQEEALQCQsAENAEEAQQE6AJCwARAkQQBCq7OP/JGjs/DbADcC/LABQQBC/6S5iMWR2oKbfzcC9LABQQBC8ua746On/aelfzcC7LABQQBC58yn0NbQ67O7fzcC5LABQQBCwAA3AtywAUEAQZiwATYC2LABQQBBkLEBNgKUsAEDQCABQbCxAWoiAiACLQAAQeoAczoAACABQQFqIgFBwABHDQALQQBBwAA2AuCwAUGwsQEhAkHAACEBAkADQAJAQQAoAtywASIDQcAARw0AIAFBwABJDQBB5LABIAIQ6AEgAkHAAGohAiABQUBqIgENAQwCC0EAKALYsAEgAiABIAMgASADSRsiAxDnAxpBAEEAKALcsAEiBCADazYC3LABIAIgA2ohAiABIANrIQECQCAEIANHDQBB5LABQZiwARDoAUEAQcAANgLcsAFBAEGYsAE2AtiwASABDQEMAgtBAEEAKALYsAEgA2o2AtiwASABDQALC0EgIQFBAEEAKALgsAFBIGo2AuCwASAAIQICQANAAkBBACgC3LABIgNBwABHDQAgAUHAAEkNAEHksAEgAhDoASACQcAAaiECIAFBQGoiAQ0BDAILQQAoAtiwASACIAEgAyABIANJGyIDEOcDGkEAQQAoAtywASIEIANrNgLcsAEgAiADaiECIAEgA2shAQJAIAQgA0cNAEHksAFBmLABEOgBQQBBwAA2AtywAUEAQZiwATYC2LABIAENAQwCC0EAQQAoAtiwASADajYC2LABIAENAAsLQZSwARDp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BCEIAkADQAJAIAEgCEwNAEEAIQkMAgsCQAJAQeDLACAIIAFqQQJtIgNBDGxqIgooAgQiCyAHTw0AQQEhDCADQQFqIQEMAQtBACEMAkAgCyAHSw0AIAohCQwBCyADQX9qIQhBASEMCyAMDQALCwJAIAlFDQAgACAGEPwBGgsgBUEBaiIFIAItABBJDQAMBAsACyACRQ0DIAAoAiQiAUUNAkEAIQMDQCABIggoAgAhAQJAIAgoAgQiDA0AIAghAyABDQEMBAsCQCAMQQAgDC0ABGtBDGxqQVxqIAJGDQAgCCEDIAENAQwECwJAAkAgAw0AIAAgATYCJAwBCyADIAE2AgALIAgoAgwQISAIECEgAQ0ADAMLAAsgAy8BDkGBIkcNASADLQADQQFxDQFBACgC7E5Bf2ohCCACKAIAIQtBACEBAkADQAJAIAEgCEwNAEEAIQUMAgsCQAJAQeDLACAIIAFqQQJtIgdBDGxqIgkoAgQiCiALTw0AQQEhDCAHQQFqIQEMAQtBACEMAkAgCiALSw0AIAkhBQwBCyAHQX9qIQhBASEMCyAMDQALCyAFRQ0BIAAoAiQiAUUNASADQRBqIQwDQAJAIAEoAgQgAkcNAAJAIAEtAAkiCEUNACABIAhBf2o6AAkLAkAgDCADLQAMIAUvAQgQXiINvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhBwJAAkBBACgC8LQBIgsgAUHEAGooAgAiCGtBAEgNACABQShqIgsgASsDGCAIIAdruKIgCysDAKA5AwAMAQsgAUEoaiIIIAErAxggCyAHa7iiIAgrAwCgOQMAIAshCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgC8LQBIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBCKBEUhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIECEgAygCBBDQAyEIDAELIAxFDQEgCBAhQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtBizJBgSpBlQJB+AkQxwMAC7kBAQN/QcgAECAiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKALwtAEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABEE4iAEUNACACIAAoAgQQ0AM2AgwLIAJBniIQ/gEgAgvoBgIIfwJ8IwBBEGsiASQAAkACQCAAKAIIRQ0AQQAoAvC0ASAAKAIca0EATg0BCwJAIABBGGpBgMC4AhDEA0UNAAJAIAAoAiQiAkUNAANAAkAgAi0ACSACLQAIRw0AIAJBADoACQsgAiACLQAJOgAIIAIoAgAiAg0ACwsgACgCKCICRQ0AAkAgAiAAKAIMIgNPDQAgACACQdAPajYCKAsgACgCKCADTQ0AIAAgAzYCKAsCQCAAQRRqIgRBgKAGEMQDRQ0AIAAoAiQiAkUNAANAAkAgAigCBCIDRQ0AIAItAAlBMUsNACABQfoBOgAPAkACQCADQYPAACABQQ9qQQEQVSIDRQ0AIARBACgC4KwBQYDAAGo2AgAMAQsgAiABLQAPOgAJCyADDQILIAIoAgAiAg0ACwsCQCAAKAIkIgJFDQAgAEEMaiEFIABBKGohBgNAAkAgAkHEAGooAgAiA0EAKALwtAFrQX9KDQACQAJAAkAgAkEgaiIEKAIADQAgAkKAgICAgICA/P8ANwMYDAELIAIrAxggAyACKAIUa7iiIQkgAkEoaisDACEKAkACQCACKAIMIgMNAEEAIQcMAQsgAxCLBCEHCyAJIAqgIQkgB0EpahAgIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEOcDGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQ3wMiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQYARQ0AIAJBsCIQ/gELIAMQISAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQIQsgAigCACICDQALCyABQRBqJAAPC0HzDEEAEC0QMwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEMwDIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRB3RIgAkEgahAtDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQcMSIAJBEGoQLQwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEHNESACEC0LIAJBwABqJAALmwUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMECEgARAhIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahCAAiECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAvC0ASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahCAAiECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahCAAiECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFB8MQAEKoDQf9+ag4EAAICAQILIAAgACgCDCIBQYC4mSkgAUGAuJkpSRs2AgwPCyAAIAAoAggiAUGAuJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAvC0ASABajYCHAsL+gEBBH8gAkEBaiEDIAFBhTEgARshBAJAIAAoAiQiAUUNAANAAkAgASgCDCIFRQ0AIAUgBCADEP0DRQ0CCyABKAIAIgENAAsLAkAgAQ0AQcgAECAiAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUEAKALwtAEiBjYCQAJAIAEoAhAiBQ0AAkACQCAALQASRQ0AIABBKGohBSAAKAIoDQEgBUGIJzYCAAwBCyAAQQxqIQULIAUoAgAhBQsgASAFIAZqNgJEIAFBniIQ/gEgASADECAiBTYCDCAFIAQgAhDnAxoLIAELOQEBf0EAQYDFABCvAyIBNgLwsQEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQS0gARBQC8oCAQN/AkBBACgC8LEBIgJFDQAgAiAAIAAQiwQQgAIhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAAgATkDGCAAQQA2AiAgAEE4aiABOQMAIABBMGogATkDACAAQShqQgA3AwAgACAAQcAAaigCADYCFAsgACAAKAIgQQFqNgIgIAAoAhQhAwJAAkBBACgC8LQBIgQgAEHEAGooAgAiAmtBAEgNACAAQShqIgQgACsDGCACIANruKIgBCsDAKA5AwAMAQsgAEEoaiICIAArAxggBCADa7iiIAIrAwCgOQMAIAQhAgsgACACNgIUAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLxgICAn4EfwJAAkACQAJAIAEQ5QMOBAABAgIDCyAAQgI3AwAPCwJAIAFE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KQMQNwMIIAMgAykDGDcDACAAIAIgA0EIaiADENEBIANBIGokAAthAQF/IwBBMGsiAiQAIAJBKGogARDtAiACQSBqIAEQ7QIgAkEYaiABEO0CIAIgAikDGDcDECACIAIpAyA3AwggAiACKQMoNwMAIAEgAkEQaiACQQhqIAIQ0gEgAkEwaiQAC8MBAQJ/IwBBwABrIgMkACADQSBqIAIQ7QIgAyADKQMgNwMoIAIoAjghBCADIAIoApABNgIcIARBgIABciEEAkACQCAEQX8gA0EcaiAEEJMCGyIEQX9KDQAgA0E4aiACQfAAEIgBIANCADcDMAwBCyADIAQ2AjAgA0EENgI0CwJAAkAgAykDMEIAUg0AIABCADcDAAwBCyADIAMpAyg3AxAgAyADKQMwNwMIIAAgAiADQRBqIANBCGoQ0AELIANBwABqJAALwwEBAn8jAEHAAGsiAyQAIANBIGogAhDtAiADIAMpAyA3AyggAigCOCEEIAMgAigCkAE2AhwgBEGAgAJyIQQCQAJAIARBfyADQRxqIAQQkwIbIgRBf0oNACADQThqIAJB8AAQiAEgA0IANwMwDAELIAMgBDYCMCADQQQ2AjQLAkACQCADKQMwQgBSDQAgAEIANwMADAELIAMgAykDKDcDECADIAMpAzA3AwggACACIANBEGogA0EIahDQAQsgA0HAAGokAAvDAQECfyMAQcAAayIDJAAgA0EgaiACEO0CIAMgAykDIDcDKCACKAI4IQQgAyACKAKQATYCHCAEQYCAA3IhBAJAAkAgBEF/IANBHGogBBCTAhsiBEF/Sg0AIANBOGogAkHwABCIASADQgA3AzAMAQsgAyAENgIwIANBBDYCNAsCQAJAIAMpAzBCAFINACAAQgA3AwAMAQsgAyADKQMoNwMQIAMgAykDMDcDCCAAIAIgA0EQaiADQQhqENABCyADQcAAaiQAC40BAQJ/IwBBIGsiAyQAIAIoAjghBCADIAIoApABNgIMIARBgIABciEEAkACQCAEQX8gA0EMaiAEEJMCGyIEQX9KDQAgA0EYaiACQfAAEIgBIANCADcDEAwBCyADIAQ2AhAgA0EENgIUCyACQQAQygEhBCADIAMpAxA3AwAgACACIAQgAxDPASADQSBqJAALjQEBAn8jAEEgayIDJAAgAigCOCEEIAMgAigCkAE2AgwgBEGAgAFyIQQCQAJAIARBfyADQQxqIAQQkwIbIgRBf0oNACADQRhqIAJB8AAQiAEgA0IANwMQDAELIAMgBDYCECADQQQ2AhQLIAJBEhDKASEEIAMgAykDEDcDACAAIAIgBCADEM8BIANBIGokAAtFAQJ/IwBBEGsiAiQAAkAgARCTASIDDQAgAUEQEGYLIAAoAgwhACACQQhqIAFBCCADEIYCIAAgAikDCDcDICACQRBqJAALUgEDfyMAQRBrIgIkAAJAIAEgARDuAiIDEJQBIgQNACABIANBA3RBEGoQZgsgACgCDCEAIAJBCGogAUEIIAQQhgIgACACKQMINwMgIAJBEGokAAtPAQN/IwBBEGsiAiQAAkAgASABEO4CIgMQlQEiBA0AIAEgA0EMahBmCyAAKAIMIQAgAkEIaiABQQggBBCGAiAAIAIpAwg3AyAgAkEQaiQAC1cBAn8jAEEQayIDJAACQAJAIAIoAJABQTxqKAIAQQN2IAIoAjgiBEsNACADQQhqIAJB7wAQiAEgAEIANwMADAELIAAgBDYCACAAQQI2AgQLIANBEGokAAtmAQJ/IwBBEGsiAyQAIAIoAjghBCADIAIoApABNgIEAkACQCAEQX8gA0EEaiAEEJMCGyIEQX9KDQAgA0EIaiACQfAAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALbwECfyMAQRBrIgMkACACKAI4IQQgAyACKAKQATYCBCAEQYCAAXIhBAJAAkAgBEF/IANBBGogBBCTAhsiBEF/Sg0AIANBCGogAkHwABCIASAAQgA3AwAMAQsgACAENgIAIABBBDYCBAsgA0EQaiQAC28BAn8jAEEQayIDJAAgAigCOCEEIAMgAigCkAE2AgQgBEGAgAJyIQQCQAJAIARBfyADQQRqIAQQkwIbIgRBf0oNACADQQhqIAJB8AAQiAEgAEIANwMADAELIAAgBDYCACAAQQQ2AgQLIANBEGokAAtvAQJ/IwBBEGsiAyQAIAIoAjghBCADIAIoApABNgIEIARBgIADciEEAkACQCAEQX8gA0EEaiAEEJMCGyIEQX9KDQAgA0EIaiACQfAAEIgBIABCADcDAAwBCyAAIAQ2AgAgAEEENgIECyADQRBqJAALVwECfyMAQRBrIgMkAAJAAkAgAigCOCIEIAIoAJABQSRqKAIAQQR2SQ0AIANBCGogAkHyABCIASAAQgA3AwAMAQsgACAENgIAIABBAzYCBAsgA0EQaiQACwwAIAAgAigCOBCEAgtHAQF/AkAgAigCOCIDIAIoAJABQTRqKAIAQQN2Tw0AIAAgAigAkAEiAiACKAIwaiADQQN0aikAADcDAA8LIAAgAkHrABCIAQsNACAAQQApA7BFNwMAC0YBA38jAEEQayIDJAAgAhDuAiEEIAIQ7gIhBSADQQhqIAJBAhDwAiADIAMpAwg3AwAgACABIAUgBCADQQAQXSADQRBqJAALDwAgACABKAIMKQMgNwMACzQBAX8jAEEQayIDJAAgA0EIaiACEO0CIAMgAykDCDcDACAAIAIgAxCQAhCEAiADQRBqJAALCQAgAEIANwMACzUBAX8jAEEQayIDJAAgA0EIaiACEO0CIABBoMUAQajFACADKQMIUBspAwA3AwAgA0EQaiQACw0AIABBACkDoEU3AwALDQAgAEEAKQOoRTcDAAsyAQF/IwBBEGsiAyQAIANBCGogAhDtAiADIAMpAwg3AwAgACADEIkCEIUCIANBEGokAAsNACAAQQApA7hFNwMAC6cBAgF/AXwjAEEQayIDJAAgA0EIaiACEO0CAkACQCADKAIMQX9GDQAgAyADKQMINwMAAkAgAxCIAiIERAAAAAAAAAAAY0UNACAAIASaEIMCDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA5hFNwMADAILIABBACACaxCEAgwBCyAAIAMpAwg3AwALIANBEGokAAsPACAAIAIQ7wJBf3MQhAILMgEBfyMAQRBrIgMkACADQQhqIAIQ7QIgACADKAIMRSADKAIIQQJGcRCFAiADQRBqJAALbwEBfyMAQRBrIgMkACADQQhqIAIQ7QICQAJAIAMoAgxBf0YNACADIAMpAwg3AwAgACADEIgCmhCDAgwBCwJAIAMoAggiAkGAgICAeEcNACAAQQApA5hFNwMADAELIABBACACaxCEAgsgA0EQaiQACzUBAX8jAEEQayIDJAAgA0EIaiACEO0CIAMgAykDCDcDACAAIAMQiQJBAXMQhQIgA0EQaiQACwwAIAAgAhDvAhCEAgumAgIEfwF8IwBBwABrIgMkACADQThqIAIQ7QIgAkEYaiIEIAMpAzg3AwAgA0E4aiACEO0CIAIgAykDODcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEggAigCECIGIAVqIgUgBkhzDQAgACAFEIQCDAELIAMgAkEQaiIFKQMANwMwAkACQCACIANBMGoQ8QENACADIAQpAwA3AyggAiADQShqEPEBRQ0BCyADIAUpAwA3AxAgAyAEKQMANwMIIAAgAiADQRBqIANBCGoQ+QEMAQsgAyAFKQMANwMgIAIgA0EgahCIAjkDICADIAQpAwA3AxggAkEoaiADQRhqEIgCIgc5AwAgACAHIAIrAyCgEIMCCyADQcAAaiQAC8gBAgR/AXwjAEEgayIDJAAgA0EYaiACEO0CIAJBGGoiBCADKQMYNwMAIANBGGogAhDtAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRCEAgwBCyADIAJBEGopAwA3AxAgAiADQRBqEIgCOQMgIAMgBCkDADcDCCACQShqIANBCGoQiAIiBzkDACAAIAIrAyAgB6EQgwILIANBIGokAAvKAQMDfwF+AXwjAEEgayIDJAAgA0EYaiACEO0CIAJBGGoiBCADKQMYNwMAIANBGGogAhDtAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAjQCECACNAIYfiIGQiCIpyAGpyIFQR91Rw0AIAAgBRCEAgwBCyADIAJBEGopAwA3AxAgAiADQRBqEIgCOQMgIAMgBCkDADcDCCACQShqIANBCGoQiAIiBzkDACAAIAcgAisDIKIQgwILIANBIGokAAvjAQIFfwF8IwBBIGsiAyQAIANBGGogAhDtAiACQRhqIgQgAykDGDcDACADQRhqIAIQ7QIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AAkACQCACKAIYIgVBAWoOAgACAQsgAigCEEGAgICAeEYNAQsgAigCECIGIAVtIgcgBWwgBkcNACAAIAcQhAIMAQsgAyACQRBqKQMANwMQIAIgA0EQahCIAjkDICADIAQpAwA3AwggAkEoaiADQQhqEIgCIgg5AwAgACACKwMgIAijEIMCCyADQSBqJAALLAECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCECAAIAQgAygCAHEQhAILLAECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCECAAIAQgAygCAHIQhAILLAECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCECAAIAQgAygCAHMQhAILLAECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCECAAIAQgAygCAHQQhAILLAECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCECAAIAQgAygCAHUQhAILQQECfyACQRhqIgMgAhDvAjYCACACIAIQ7wIiBDYCEAJAIAQgAygCAHYiAkF/Sg0AIAAgArgQgwIPCyAAIAIQhAILnAEBAn8jAEEgayIDJAAgA0EYaiACEO0CIAJBGGoiBCADKQMYNwMAIANBGGogAhDtAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCECACKAIYRiECDAELIAMgAkEQaikDADcDECADIAQpAwA3AwggAiADQRBqIANBCGoQkgIhAgsgACACEIUCIANBIGokAAu5AQICfwF8IwBBIGsiAyQAIANBGGogAhDtAiACQRhqIgQgAykDGDcDACADQRhqIAIQ7QIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQiAI5AyAgAyAEKQMANwMIIAJBKGogA0EIahCIAiIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhCFAiADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQ7QIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEO0CIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEIgCOQMgIAMgBCkDADcDCCACQShqIANBCGoQiAIiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQhQIgA0EgaiQAC58BAQJ/IwBBIGsiAyQAIANBGGogAhDtAiACQRhqIgQgAykDGDcDACADQRhqIAIQ7QIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9H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AS0AACIDRSEEIAMNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBB2RAgBBAtEBwAC1UBA38gACAALQAAIgFBLUZqIQJBACEAA0AgAEEKbCACLAAAIgNqQVBqIAAgA0FQakH/AXFBCkkiAxshACACQQFqIQIgAw0AC0EAIABrIAAgAUEtRhsLlQkBCn8jAEHAAGsiBCQAIAAgAWohBSAEQQFyIQYgBEECciEHIABBAEchCCACIQkgACEKA0AgAkEBaiELAkACQAJAIAItAAAiAUElRg0AIAFFDQAgCyECDAELAkAgCSALRg0AIAlBf3MgC2ohDAJAIAUgCmsiDUEBSA0AIAogCSAMIA1Bf2ogDSAMShsiDRDnAyANakEAOgAACyAKIAxqIQoLAkAgAQ0AQQAhASALIQIMAgtBACEBAkAgCy0AAEEtRw0AIAJBAmogCyACLQACQfMARiICGyELIAIgCHEhAQsgCywAACECIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAIAJBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgAygCADoAACADQQRqIQMMCAsgBCEJAkAgAygCACICQX9KDQAgBEEtOgAAQQAgAmshAiAGIQkLIANBBGohAyAJIQEDQCABIAIgAkEKbiIMQQpsa0EwcjoAACABQQFqIQEgAkEJSyENIAwhAiANDQALIAFBADoAACAJIAkQiwRqQX9qIgIgCU0NBwNAIAktAAAhASAJIAItAAA6AAAgAiABOgAAIAlBAWoiCSACQX9qIgJJDQAMCAsACyADKAIAIQIgBCEBA0AgASACIAJBCm4iCUEKbGtBMHI6AAAgAUEBaiEBIAJBCUshDCAJIQIgDA0ACyABQQA6AAAgA0EEaiEDIAQhAiAEIAQQiwRqQX9qIgEgBE0NBgNAIAItAAAhCSACIAEtAAA6AAAgASAJOgAAIAJBAWoiAiABQX9qIgFJDQAMBwsACyAEQbDwATsBACADKAIAIQ1BHCEJQQAhAQNAAkACQCANIAkiAnZBD3EiCQ0AIAJFDQBBACEMIAFFDQELIAcg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YXN1cmVtZW50AHJhbmRvbUludABkZXZpY2VzY3JpcHRtZ3JfaW5pdAB3YWl0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABmb3JtYXQAYmxpdEF0AHNldEF0AGdldEF0AGZpbGxBdABjaGFyQ29kZUF0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGJsdGluIDwgZGV2c19udW1fYnVpbHRpbl9mdW5jdGlvbnMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAYWJzAHNsZWVwTXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGZsb29yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAYnVmZmVyAHJvdGFyeUVuY29kZXIAbnVtYmVyAGZyZWVfZmliZXIAZXhwAGpkX3NoYTI1Nl9zZXR1cABwb3AAZGV2c19idWZmZXJfb3AAY2xhbXAAIXN3ZWVwAG1hcABzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AcmUtcnVuAG5vbi1mdW4AYnV0dG9uAG1vdGlvbgBkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AbWluAG1haW4AZGV2c19vYmplY3RfZ2V0X2J1aWx0X2luAGRldnNfb2JqZWN0X2dldF9zdGF0aWNfYnVpbHRfaW4AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBib29sZWFuAHNjYW4AcmFuZG9tAGZsYXNoX3Byb2dyYW0AaW11bABudWxsAGltYWdlIHRvbyBzbWFsbABqZF9yb2xlX2ZyZWVfYWxsAGNlaWwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAHNpZ25hbAA/c3BlY2lhbABkZXZzX2ltZ19zdHJpZHhfb2sAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5IDw9IG1hcC0+bGVuZ3RoAHNldExlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaAB2ZXJzaW9uIG1pc21hdGNoAGZvckVhY2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAbG9nAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGJ1ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAMDEyMzQ1Njc4OWFiY2RlZgAlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAP3ZhbHVlAHdyaXRlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAaGVhcnRSYXRlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1M6IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBwcm90b3R5cGUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHJvbGUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAG9uQ2hhbmdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlAGpkX2RldmljZV9mcmVlAD9mcmVlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHN1YnNjcmliZQBjbG91ZABpbW9kAHJvdW5kAGJvdW5kAHJvbGVtZ3JfYXV0b2JpbmQAZGV2c19vYmplY3RfZ2V0X25vX2JpbmQAZGV2c19mdW5jdGlvbl9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAb25EaXNjb25uZWN0ZWQAV1M6IGNvbm5lY3RlZABpc0Nvbm5lY3RlZABvbkNvbm5lY3RlZABjcmVhdGVkAHVuZGVmaW5lZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAGRldnNfb2JqZWN0X2dldF9hdHRhY2hlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAcmVhZAAlLXMlZAAlLXNfJWQAJXMgZmliZXIgJXNfRiVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAZnVuOiVkAGJ1aWx0aW46JWQARGV2aWNlU2NyaXB0IHJ1bnRpbWUgdiVkLiVkLiVkOyBmaWxlIHYlZC4lZC4lZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAcGFuaWMAYmFkIG1hZ2ljAG51bXBhcmFtcyArIDEgPT0gY3R4LT5zdGFja190b3BfZm9yX2djAGphY2RhYy1jL2RldmljZXNjcmlwdC92ZXJpZnkuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9vcHMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9tYWluLmMAamFjZGFjLWMvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBqYWNkYWMtYy9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3N0cmluZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC90c2FnZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvamRpZmFjZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9nY19hbGxvYy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGZpYgA/Pz9iAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAW0ZpYmVyOiAleF0AW0J1ZmZlclsldV0gJS1zXQBbRnVuY3Rpb246ICVzXQBbQ2xvc3VyZTogJXNdAFtSb2xlOiAlc10AW01ldGhvZDogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtTdGF0aWMgT2JqOiAlZF0AW0J1ZmZlclsldV0gJS1zLi4uXQBpZHggPD0gREVWU19CVUlMVElOX09CSkVDVF9fX01BWAAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMAbWlkeCA8IE1BWF9QUk9UTwBzdG10X2NhbGxOAE5hTgBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABQSQBESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAExPRzJFAExPRzEwRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAbG9nMgBTUVJUMV8yAFNRUlQyAGVDTzIATE4yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAY3R4LT5zdGFja190b3AgPT0gTiArIDEAYXJnMABsb2cxMABMTjEwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGgtPm51bV9hcmdzID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAGRldnNfaGFuZGxlX2hpZ2hfdmFsdWUob2JqKSA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwAChodiA+PiBQQUNLX1NISUZUKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMABwdCAhPSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSAhPSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgIT0gMAAvd3Nzay8Ad3M6Ly8APy4AZGV2c19idWZmZXJpc2hfaXNfYnVmZmVyKHYpAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAGFnZ2J1ZjogdXBsOiAnJXMnICVmICglLXMpAFdTU0stSDogc3RhdHVzICVkICglcykAZGV2c19idWZmZXJfaXNfd3JpdGFibGUoY3R4LCBidWZmZXIpAGRldnNfaXNfcHJvdG8ocHJvdG8pAChudWxsKQBmaWR4IDwgZGV2c19pbWdfbnVtX2Z1bmN0aW9ucyhjdHgtPmltZykAZGV2c19oYW5kbGVfdHlwZV9pc19wdHIodHlwZSkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAIShoLT5mbGFncyAmIERFVlNfQlVJTFRJTl9GTEFHX0lTX1BST1BFUlRZKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKERFVlNfR0NfVEFHX01BU0tfUElOTkVEIHwgREVWU19HQ19UQUdfQllURVMpAFdTOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXUzogZXJyb3IhAGRlcGxveSBkZXZpY2UgbG9zdAoAAQAAAAAAAAAAAAAAAAAAAABqYWNkYWMtcG9zaXggZGV2aWNlADAuMC4wAAAAAAAAAAAAAAAAAAAAAQAAAAAAAADwnwYAgBCBEfEPAABmfkseJAEAAAcAAAAIAAAA8J8GAIAQgRCCEPEPK+o0ETgBAAAMAAAADQAAAERldlMKfmqaAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAABAAAABwAAAACAAAAHgAAAAAAAAAeAAAAAAAAAB4AAAABAAAAHwAAAAAAAAAfAAAAAAA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AADy0ICAAARuYW1lAYxQnAQABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAg1lbV9zZW5kX2ZyYW1lAxBlbV9jb25zb2xlX2RlYnVnBARleGl0BQtlbV90aW1lX25vdwYTZGV2c19kZXBsb3lfaGFuZGxlcgcgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkIIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAkYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3CjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAszZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQNNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkDhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQ8UamRfY3J5cHRvX2dldF9yYW5kb20QD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUC3NldFRlbXBSZXQwFRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxYRX193YXNtX2NhbGxfY3RvcnMXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGhlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGxRhcHBfZ2V0X2RldmljZV9jbGFzcxwIaHdfcGFuaWMdCGpkX2JsaW5rHgdqZF9nbG93HxRqZF9hbGxvY19zdGFja19jaGVjayAIamRfYWxsb2MhB2pkX2ZyZWUiDXRhcmdldF9pbl9pcnEjEnRhcmdldF9kaXNhYmxlX2lycSQRdGFyZ2V0X2VuYWJsZV9pcnElE2pkX3NldHRpbmdzX2dldF9iaW4mE2pkX3NldHRpbmdzX3NldF9iaW4nEmRldnNfcGFuaWNfaGFuZGxlcigQamRfZW1fc2VuZF9mcmFtZSkaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nKwpqZF9lbV9pbml0LA1qZF9lbV9wcm9jZXNzLQVkbWVzZy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95Mgxod19kZXZpY2VfaWQzDHRhcmdldF9yZXNldDQOdGltX2dldF9taWNyb3M1EmpkX3RjcHNvY2tfcHJvY2VzczYRYXBwX2luaXRfc2VydmljZXM3EmRldnNfY2xpZW50X2RlcGxveTgUY2xpZW50X2V2ZW50X2hhbmRsZXI5C2FwcF9wcm9jZXNzOgd0eF9pbml0Ow9qZF9wYWNrZXRfcmVhZHk8CnR4X3Byb2Nlc3M9F2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlPg5qZF93ZWJzb2NrX25ldz8Gb25vcGVuQAdvbmVycm9yQQdvbmNsb3NlQglvbm1lc3NhZ2VDEGpkX3dlYnNvY2tfY2xvc2VEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemVFFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGVGD3JvbGVtZ3JfcHJvY2Vzc0cQcm9sZW1ncl9hdXRvYmluZEgVcm9sZW1ncl9oYW5kbGVfcGFja2V0SRRqZF9yb2xlX21hbmFnZXJfaW5pdEoYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkSw1qZF9yb2xlX2FsbG9jTBBqZF9yb2xlX2ZyZWVfYWxsTRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kThJqZF9yb2xlX2J5X3NlcnZpY2VPE2pkX2NsaWVudF9sb2dfZXZlbnRQE2pkX2NsaWVudF9zdWJzY3JpYmVRFGpkX2NsaWVudF9lbWl0X2V2ZW50UhRyb2xlbWdyX3JvbGVfY2hhbmdlZFMQamRfZGV2aWNlX2xvb2t1cFQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlVRNqZF9zZXJ2aWNlX3NlbmRfY21kVhFqZF9jbGllbnRfcHJvY2Vzc1cOamRfZGV2aWNlX2ZyZWVYF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0WQ9qZF9kZXZpY2VfYWxsb2NaDmFnZ2J1ZmZlcl9pbml0Ww9hZ2didWZmZXJfZmx1c2hcEGFnZ2J1ZmZlcl91cGxvYWRdDmRldnNfYnVmZmVyX29wXhBkZXZzX3JlYWRfbnVtYmVyXw9kZXZzX2NyZWF0ZV9jdHhgCXNldHVwX2N0eGEKZGV2c190cmFjZWIPZGV2c19lcnJvcl9jb2RlYxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyZAljbGVhcl9jdHhlDWRldnNfZnJlZV9jdHhmCGRldnNfb29tZwlkZXZzX2ZyZWVoF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzaQd0cnlfcnVuagxzdG9wX3Byb2dyYW1rHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRsHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVtGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaG4dZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRvDmRlcGxveV9oYW5kbGVycBNkZXBsb3lfbWV0YV9oYW5kbGVycRZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95chRkZXZpY2VzY3JpcHRtZ3JfaW5pdHMZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldnQRZGV2c2Nsb3VkX3Byb2Nlc3N1F2RldnNjbG91ZF9oYW5kbGVfcGFja2V0dhNkZXZzY2xvdWRfb25fbWV0aG9kdw5kZXZzY2xvdWRfaW5pdHgQZGV2c19maWJlcl95aWVsZHkYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9uegpkZXZzX3BhbmljexhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV8EGRldnNfZmliZXJfc2xlZXB9G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbH4MbG9nX2ZpYmVyX29wfxpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc4ABEWRldnNfaW1nX2Z1bl9uYW1lgQESZGV2c19pbWdfcm9sZV9uYW1lggESZGV2c19maWJlcl9ieV9maWR4gwERZGV2c19maWJlcl9ieV90YWeEARBkZXZzX2ZpYmVyX3N0YXJ0hQEUZGV2c19maWJlcl90ZXJtaWFudGWGAQ5kZXZzX2ZpYmVyX3J1bocBE2RldnNfZmliZXJfc3luY19ub3eIARVfZGV2c19ydW50aW1lX2ZhaWx1cmWJAQ9kZXZzX2ZpYmVyX3Bva2WKARNqZF9nY19hbnlfdHJ5X2FsbG9jiwEHZGV2c19nY4wBD2ZpbmRfZnJlZV9ibG9ja40BEmRldnNfYW55X3RyeV9hbGxvY44BDmRldnNfdHJ5X2FsbG9jjwELamRfZ2NfdW5waW6QAQpqZF9nY19mcmVlkQEOZGV2c192YWx1ZV9waW6SARBkZXZzX3ZhbHVlX3VucGlukwESZGV2c19tYXBfdHJ5X2FsbG9jlAEUZGV2c19hcnJheV90cnlfYWxsb2OVARVkZXZzX2J1ZmZlcl90cnlfYWxsb2OWARVkZXZzX3N0cmluZ190cnlfYWxsb2OXAQ9kZXZzX2djX3NldF9jdHiYAQ5kZXZzX2djX2NyZWF0ZZkBD2RldnNfZ2NfZGVzdHJveZoBBHNjYW6bARNzY2FuX2FycmF5X2FuZF9tYXJrnAERcHJvcF9BcnJheV9sZW5ndGidARJtZXRoMl9BcnJheV9pbnNlcnSeARFmdW4xX0J1ZmZlcl9hbGxvY58BEnByb3BfQnVmZmVyX2xlbmd0aKABFW1ldGgwX0J1ZmZlcl90b1N0cmluZ6EBE21ldGgzX0J1ZmZlcl9maWxsQXSiARNtZXRoNF9CdWZmZXJfYmxpdEF0owEZZnVuMV9EZXZpY2VTY3JpcHRfc2xlZXBNc6QBF2Z1bjFfRGV2aWNlU2NyaXB0X3BhbmljpQEYZnVuMF9EZXZpY2VTY3JpcHRfcmVib290pgEYZnVuWF9EZXZpY2VTY3JpcHRfZm9ybWF0pwEVZnVuMV9EZXZpY2VTY3JpcHRfbG9nqAEUbWV0aFhfRnVuY3Rpb25fc3RhcnSpAQ5mdW4xX01hdGhfY2VpbKoBD2Z1bjFfTWF0aF9mbG9vcqsBD2Z1bjFfTWF0aF9yb3VuZKwBDWZ1bjFfTWF0aF9hYnOtARBmdW4wX01hdGhfcmFuZG9trgETZnVuMV9NYXRoX3JhbmRvbUludK8BDWZ1bjFfTWF0aF9sb2ewAQ1mdW4yX01hdGhfcG93sQEOZnVuMl9NYXRoX2lkaXayAQ5mdW4yX01hdGhfaW1vZLMBDmZ1bjJfTWF0aF9pbXVstAENZnVuMl9NYXRoX21pbrUBC2Z1bjJfbWlubWF4tgENZnVuMl9NYXRoX21heLcBFXByb3BfUm9sZV9pc0Nvbm5lY3RlZLgBEnByb3BfU3RyaW5nX2xlbmd0aLkBF21ldGgxX1N0cmluZ19jaGFyQ29kZUF0ugEUZGV2c19qZF9nZXRfcmVnaXN0ZXK7ARZkZXZzX2pkX2NsZWFyX3BrdF9raW5kvAEQZGV2c19qZF9zZW5kX2NtZL0BE2RldnNfamRfc2VuZF9sb2dtc2e+AQ1oYW5kbGVfbG9nbXNnvwESZGV2c19qZF9zaG91bGRfcnVuwAEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGXBARNkZXZzX2pkX3Byb2Nlc3NfcGt0wgEUZGV2c19qZF9yb2xlX2NoYW5nZWTDARRkZXZzX2pkX3Jlc2V0X3BhY2tldMQBEmRldnNfamRfaW5pdF9yb2xlc8UBEmRldnNfamRfZnJlZV9yb2xlc8YBEGRldnNfc2V0X2xvZ2dpbmfHARVkZXZzX2dldF9nbG9iYWxfZmxhZ3PIAQxkZXZzX21hcF9zZXTJAQZsb29rdXDKARhkZXZzX29iamVjdF9nZXRfYnVpbHRfaW7LARFkZXZzX3Byb3RvX2xvb2t1cMwBEmRldnNfZnVuY3Rpb25fYmluZM0BDmRldnNfZ2V0X2ZuaWR4zgEYZGV2c19vYmplY3RfZ2V0X2F0dGFjaGVkzwEXZGV2c19vYmplY3RfZ2V0X25vX2JpbmTQAQ9kZXZzX29iamVjdF9nZXTRAQxkZXZzX2FueV9nZXTSAQxkZXZzX2FueV9zZXTTAQxkZXZzX3NlcV9zZXTUAQ5kZXZzX2FycmF5X3NldNUBEWRldnNfYXJyYXlfaW5zZXJ01gEMZGV2c19hcmdfaW501wEPZGV2c19hcmdfZG91Ymxl2AEPZGV2c19yZXRfZG91Ymxl2QEMZGV2c19yZXRfaW502gEPZGV2c19yZXRfZ2NfcHRy2wESZGV2c19yZWdjYWNoZV9mcmVl3AEWZGV2c19yZWdjYWNoZV9mcmVlX2FsbN0BF2RldnNfcmVnY2FjaGVfbWFya191c2Vk3gETZGV2c19yZWdjYWNoZV9hbGxvY98BFGRldnNfcmVnY2FjaGVfbG9va3Vw4AERZGV2c19yZWdjYWNoZV9hZ2XhARdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZeIBEmRldnNfcmVnY2FjaGVfbmV4dOMBD2pkX3NldHRpbmdzX2dldOQBD2pkX3NldHRpbmdzX3NldOUBDmRldnNfbG9nX3ZhbHVl5gEPZGV2c19zaG93X3ZhbHVl5wEQZGV2c19zaG93X3ZhbHVlMOgBDWNvbnN1bWVfY2h1bmvpAQ1zaGFfMjU2X2Nsb3Nl6gEPamRfc2hhMjU2X3NldHVw6wEQamRfc2hhMjU2X3VwZGF0ZewBEGpkX3NoYTI1Nl9maW5pc2jtARRqZF9zaGEyNTZfaG1hY19zZXR1cO4BFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaO8BDmpkX3NoYTI1Nl9oa2Rm8AEOZGV2c19zdHJmb3JtYXTxAQ5kZXZzX2lzX3N0cmluZ/IBDmRldnNfaXNfbnVtYmVy8wEUZGV2c19zdHJpbmdfZ2V0X3V0Zjj0ARRkZXZzX3N0cmluZ192c3ByaW50ZvUBE2RldnNfc3RyaW5nX3NwcmludGb2ARVkZXZzX3N0cmluZ19mcm9tX3V0Zjj3ARRkZXZzX3ZhbHVlX3RvX3N0cmluZ/gBEGJ1ZmZlcl90b19zdHJpbmf5ARJkZXZzX3N0cmluZ19jb25jYXT6ARxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNj+wEPdHNhZ2dfY2xpZW50X2V2/AEKYWRkX3Nlcmllc/0BDXRzYWdnX3Byb2Nlc3P+AQpsb2dfc2VyaWVz/wETdHNhZ2dfaGFuZGxlX3BhY2tldIACFGxvb2t1cF9vcl9hZGRfc2VyaWVzgQIKdHNhZ2dfaW5pdIICDHRzYWdnX3VwZGF0ZYMCFmRldnNfdmFsdWVfZnJvbV9kb3VibGWEAhNkZXZzX3ZhbHVlX2Zyb21faW50hQIUZGV2c192YWx1ZV9mcm9tX2Jvb2yGAhdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcocCEWRldnNfdmFsdWVfdG9faW50iAIUZGV2c192YWx1ZV90b19kb3VibGWJAhJkZXZzX3ZhbHVlX3RvX2Jvb2yKAg5kZXZzX2lzX2J1ZmZlcosCF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxljAIQZGV2c19idWZmZXJfZGF0YY0CE2RldnNfYnVmZmVyaXNoX2RhdGGOAhRkZXZzX3ZhbHVlX3RvX2djX29iao8CDWRldnNfaXNfYXJyYXmQAhFkZXZzX3ZhbHVlX3R5cGVvZpECD2RldnNfaXNfbnVsbGlzaJICEmRldnNfdmFsdWVfaWVlZV9lcZMCEmRldnNfaW1nX3N0cmlkeF9va5QCEmRldnNfZHVtcF92ZXJzaW9uc5UCC2RldnNfdmVyaWZ5lgIUZGV2c192bV9leGVjX29wY29kZXOXAhpkZXZzX2J1aWx0aW5fc3RyaW5nX2J5X2lkeJgCEWRldnNfaW1nX2dldF91dGY4mQIUZGV2c19nZXRfc3RhdGljX3V0ZjiaAgxleHByX2ludmFsaWSbAhRleHByeF9idWlsdGluX29iamVjdJwCC3N0bXQxX2NhbGwwnQILc3RtdDJfY2FsbDGeAgtzdG10M19jYWxsMp8CC3N0bXQ0X2NhbGwzoAILc3RtdDVfY2FsbDShAgtzdG10Nl9jYWxsNaICC3N0bXQ3X2NhbGw2owILc3RtdDhfY2FsbDekAgtzdG10OV9jYWxsOKUCDGV4cHIyX3N0cjBlcaYCDHN0bXQxX3JldHVybqcCCXN0bXR4X2ptcKgCDHN0bXR4MV9qbXBfeqkCC3N0bXQxX3BhbmljqgIWZXhwcjBfcGt0X2NvbW1hbmRfY29kZasCEnN0bXR4MV9zdG9yZV9sb2NhbKwCE3N0bXR4MV9zdG9yZV9nbG9iYWytAhJzdG10NF9zdG9yZV9idWZmZXKuAhZleHByMF9wa3RfcmVnX2dldF9jb2RlrwIQZXhwcnhfbG9hZF9sb2NhbLACEWV4cHJ4X2xvYWRfZ2xvYmFssQIVZXhwcjBfcGt0X3JlcG9ydF9jb2RlsgILZXhwcjJfaW5kZXizAg9zdG10M19pbmRleF9zZXS0AhRleHByeDFfYnVpbHRpbl9maWVsZLUCEmV4cHJ4MV9hc2NpaV9maWVsZLYCEWV4cHJ4MV91dGY4X2ZpZWxktwIQZXhwcnhfbWF0aF9maWVsZLgCDmV4cHJ4X2RzX2ZpZWxkuQIPc3RtdDBfYWxsb2NfbWFwugIRc3RtdDFfYWxsb2NfYXJyYXm7AhJzdG10MV9hbGxvY19idWZmZXK8AhFleHByeF9zdGF0aWNfcm9sZb0CE2V4cHJ4X3N0YXRpY19idWZmZXK+AhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbme/AhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nwAIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nwQIVZXhwcnhfc3RhdGljX2Z1bmN0aW9uwgINZXhwcnhfbGl0ZXJhbMMCEWV4cHJ4X2xpdGVyYWxfZjY0xAIQZXhwcjBfcGt0X2J1ZmZlcsUCEWV4cHIzX2xvYWRfYnVmZmVyxgINZXhwcjBfcmV0X3ZhbMcCDGV4cHIxX3R5cGVvZsgCCmV4cHIwX251bGzJAg1leHByMV9pc19udWxsygIKZXhwcjBfdHJ1ZcsCC2V4cHIwX2ZhbHNlzAINZXhwcjFfdG9fYm9vbM0CCWV4cHIwX25hbs4CCWV4cHIxX2Fic88CDWV4cHIxX2JpdF9ub3TQAgxleHByMV9pc19uYW7RAglleHByMV9uZWfSAglleHByMV9ub3TTAgxleHByMV90b19pbnTUAglleHByMl9hZGTVAglleHByMl9zdWLWAglleHByMl9tdWzXAglleHByMl9kaXbYAg1leHByMl9iaXRfYW5k2QIMZXhwcjJfYml0X29y2gINZXhwcjJfYml0X3hvctsCEGV4cHIyX3NoaWZ0X2xlZnTcAhFleHByMl9zaGlmdF9yaWdodN0CGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVk3gIIZXhwcjJfZXHfAghleHByMl9sZeACCGV4cHIyX2x04QIIZXhwcjJfbmXiAhVzdG10MV90ZXJtaW5hdGVfZmliZXLjAg9zdG10MV93YWl0X3JvbGXkAg9zdG10M19xdWVyeV9yZWflAg5zdG10Ml9zZW5kX2NtZOYCE3N0bXQ0X3F1ZXJ5X2lkeF9yZWfnAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVy6AINc3RtdDJfc2V0X3BrdOkCDGV4cHIwX25vd19tc+oCFmV4cHIxX2dldF9maWJlcl9oYW5kbGXrAg5leHByMF9wa3Rfc2l6ZewCEWV4cHIwX3BrdF9ldl9jb2Rl7QIPZGV2c192bV9wb3BfYXJn7gITZGV2c192bV9wb3BfYXJnX3UzMu8CE2RldnNfdm1fcG9wX2FyZ19pMzLwAhZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy8QIbZGV2c192bV9wb3BfYXJnX2J1ZmZlcl9kYXRh8gIWZGV2c192bV9wb3BfYXJnX3N0cmlkePMCFGRldnNfdm1fcG9wX2FyZ19yb2xl9AISamRfYWVzX2NjbV9lbmNyeXB09QISamRfYWVzX2NjbV9kZWNyeXB09gIMQUVTX2luaXRfY3R49wIPQUVTX0VDQl9lbmNyeXB0+AIQamRfYWVzX3NldHVwX2tlefkCDmpkX2Flc19lbmNyeXB0+gIQamRfYWVzX2NsZWFyX2tlefsCC2pkX3dzc2tfbmV3/AIUamRfd3Nza19zZW5kX21lc3NhZ2X9AhNqZF93ZWJzb2NrX29uX2V2ZW50/gIHZGVjcnlwdP8CDWpkX3dzc2tfY2xvc2WAAxBqZF93c3NrX29uX2V2ZW50gQMKc2VuZF9lbXB0eYIDEndzc2toZWFsdGhfcHJvY2Vzc4MDF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlhAMUd3Nza2hlYWx0aF9yZWNvbm5lY3SFAxh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXSGAw9zZXRfY29ubl9zdHJpbmeHAxFjbGVhcl9jb25uX3N0cmluZ4gDD3dzc2toZWFsdGhfaW5pdIkDE3dzc2tfcHVibGlzaF92YWx1ZXOKAxB3c3NrX3B1Ymxpc2hfYmluiwMRd3Nza19pc19jb25uZWN0ZWSMAxN3c3NrX3Jlc3BvbmRfbWV0aG9kjQMPamRfY3RybF9wcm9jZXNzjgMVamRfY3RybF9oYW5kbGVfcGFja2V0jwMMamRfY3RybF9pbml0kAMNamRfaXBpcGVfb3BlbpEDFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXSSAw5qZF9pcGlwZV9jbG9zZZMDEmpkX251bWZtdF9pc192YWxpZJQDFWpkX251bWZtdF93cml0ZV9mbG9hdJUDE2pkX251bWZtdF93cml0ZV9pMzKWAxJqZF9udW1mbXRfcmVhZF9pMzKXAxRqZF9udW1mbXRfcmVhZF9mbG9hdJgDEWpkX29waXBlX29wZW5fY21kmQMUamRfb3BpcGVfb3Blbl9yZXBvcnSaAxZqZF9vcGlwZV9oYW5kbGVfcGFja2V0mwMRamRfb3BpcGVfd3JpdGVfZXicAxBqZF9vcGlwZV9wcm9jZXNznQMUamRfb3BpcGVfY2hlY2tfc3BhY2WeAw5qZF9vcGlwZV93cml0ZZ8DDmpkX29waXBlX2Nsb3NloAMNamRfcXVldWVfcHVzaKEDDmpkX3F1ZXVlX2Zyb250ogMOamRfcXVldWVfc2hpZnSjAw5qZF9xdWV1ZV9hbGxvY6QDDWpkX3Jlc3BvbmRfdTilAw5qZF9yZXNwb25kX3UxNqYDDmpkX3Jlc3BvbmRfdTMypwMRamRfcmVzcG9uZF9zdHJpbmeoAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZKkDC2pkX3NlbmRfcGt0qgMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyrAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcqwDGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXStAxRqZF9hcHBfaGFuZGxlX3BhY2tldK4DFWpkX2FwcF9oYW5kbGVfY29tbWFuZK8DE2pkX2FsbG9jYXRlX3NlcnZpY2WwAxBqZF9zZXJ2aWNlc19pbml0sQMOamRfcmVmcmVzaF9ub3eyAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkswMUamRfc2VydmljZXNfYW5ub3VuY2W0AxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZbUDEGpkX3NlcnZpY2VzX3RpY2u2AxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbme3AxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZbgDEmFwcF9nZXRfZndfdmVyc2lvbrkDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWW6Aw1qZF9oYXNoX2ZudjFhuwMMamRfZGV2aWNlX2lkvAMJamRfcmFuZG9tvQMIamRfY3JjMTa+Aw5qZF9jb21wdXRlX2NyY78DDmpkX3NoaWZ0X2ZyYW1lwAMOamRfcmVzZXRfZnJhbWXBAxBqZF9wdXNoX2luX2ZyYW1lwgMNamRfcGFuaWNfY29yZcMDE2pkX3Nob3VsZF9zYW1wbGVfbXPEAxBqZF9zaG91bGRfc2FtcGxlxQMJamRfdG9faGV4xgMLamRfZnJvbV9oZXjHAw5qZF9hc3NlcnRfZmFpbMgDB2pkX2F0b2nJAwtqZF92c3ByaW50ZsoDD2pkX3ByaW50X2RvdWJsZcsDCmpkX3NwcmludGbMAxJqZF9kZXZpY2Vfc2hvcnRfaWTNAwxqZF9zcHJpbnRmX2HOAwtqZF90b19oZXhfYc8DFGpkX2RldmljZV9zaG9ydF9pZF9h0AMJamRfc3RyZHVw0QMOamRfanNvbl9lc2NhcGXSAxNqZF9qc29uX2VzY2FwZV9jb3Jl0wMJamRfbWVtZHVw1AMWamRfcHJvY2Vzc19ldmVudF9xdWV1ZdUDFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWXWAxFqZF9zZW5kX2V2ZW50X2V4dNcDCmpkX3J4X2luaXTYAxRqZF9yeF9mcmFtZV9yZWNlaXZlZNkDHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNr2gMPamRfcnhfZ2V0X2ZyYW1l2wMTamRfcnhfcmVsZWFzZV9mcmFtZdwDEWpkX3NlbmRfZnJhbWVfcmF33QMNamRfc2VuZF9mcmFtZd4DCmpkX3R4X2luaXTfAwdqZF9zZW5k4AMWamRfc2VuZF9mcmFtZV93aXRoX2NyY+EDD2pkX3R4X2dldF9mcmFtZeIDEGpkX3R4X2ZyYW1lX3NlbnTjAwtqZF90eF9mbHVzaOQDEF9fZXJybm9fbG9jYXRpb27lAwxfX2ZwY2xhc3NpZnnmAwVkdW1teecDCF9fbWVtY3B56AMHbWVtbW92ZekDBm1lbXNldOoDCl9fbG9ja2ZpbGXrAwxfX3VubG9ja2ZpbGXsAwxfX3N0ZGlvX3NlZWvtAw1fX3N0ZGlvX3dyaXRl7gMNX19zdGRpb19jbG9zZe8DDF9fc3RkaW9fZXhpdPADCmNsb3NlX2ZpbGXxAwlfX3Rvd3JpdGXyAwlfX2Z3cml0ZXjzAwZmd3JpdGX0AytlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxz9QMUX19wdGhyZWFkX211dGV4X2xvY2v2AxZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr9wMGX19sb2Nr+AMOX19tYXRoX2Rpdnplcm/5Aw5fX21hdGhfaW52YWxpZPoDA2xvZ/sDBWxvZzEw/AMHX19sc2Vla/0DBm1lbWNtcP4DCl9fb2ZsX2xvY2v/AwxfX21hdGhfeGZsb3eABApmcF9iYXJyaWVygQQMX19tYXRoX29mbG93ggQMX19tYXRoX3VmbG93gwQEZmFic4QEA3Bvd4UECGNoZWNraW50hgQLc3BlY2lhbGNhc2WHBAVyb3VuZIgEBnN0cmNocokEC19fc3RyY2hybnVsigQGc3RyY21wiwQGc3RybGVujAQSX193YXNpX3N5c2NhbGxfcmV0jQQIZGxtYWxsb2OOBAZkbGZyZWWPBBhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemWQBARzYnJrkQQJX19wb3dpZGYykgQJc3RhY2tTYXZlkwQMc3RhY2tSZXN0b3JllAQKc3RhY2tBbGxvY5UEFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdJYEGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWWXBBllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNlmAQYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kmQQMZHluQ2FsbF9qaWppmgQWbGVnYWxzdHViJGR5bkNhbGxfamlqaZsEGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAZkEBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
