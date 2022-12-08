
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
    function handlePacket(pkt) {
        copyToHeap(pkt, Module._jd_em_frame_received);
        Module._jd_em_process();
    }
    Exts.handlePacket = handlePacket;
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
                console.log("disconnect", err.message);
                if (sock)
                    sock.end();
                sock = undefined;
                if (resolve) {
                    resolve = null;
                    reject(new Error(`can't connect to ${host}:${port}`));
                }
            };
            Module["sendPacket"] = send;
            sock = net.createConnection(port, host, () => {
                console.log(`connected to ${port}:${host}`);
                const f = resolve;
                resolve = null;
                f();
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
    function setupWebsocketTransport(url, proto) {
        return new Promise((resolve, reject) => {
            let sock = new WebSocket(url, proto);
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
                console.log("disconnect");
                if (sock)
                    try {
                        sock.close();
                    }
                    catch (_a) { }
                sock = undefined;
                if (resolve) {
                    resolve = null;
                    reject(new Error(`can't connect to ${url}; ${err === null || err === void 0 ? void 0 : err.message}`));
                }
            };
            Module["sendPacket"] = send;
            sock.onopen = () => {
                console.log(`connected to ${url}`);
                resolve();
            };
            sock.onerror = disconnect;
            sock.onclose = disconnect;
            sock.onmessage = ev => {
                const data = ev.data;
                if (typeof data == "string") {
                    console.error("got string msg");
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
    function b64ToBin(s) {
        s = atob(s);
        const r = new Uint8Array(s.length);
        for (let i = 0; i < s.length; ++i)
            r[i] = s.charCodeAt(i);
        return r;
    }
    Exts.b64ToBin = b64ToBin;
    function devsDeploy(binary) {
        return copyToHeap(binary, ptr => Module._jd_em_devs_deploy(ptr, binary.length));
    }
    Exts.devsDeploy = devsDeploy;
    function devsVerify(binary) {
        return copyToHeap(binary, ptr => Module._jd_em_devs_verify(ptr, binary.length));
    }
    Exts.devsVerify = devsVerify;
    function devsClientDeploy(binary) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length);
        Module.HEAPU8.set(binary, ptr);
        return Module._jd_em_devs_client_deploy(ptr, binary.length);
    }
    Exts.devsClientDeploy = devsClientDeploy;
    function devsInit() {
        Module._jd_em_init();
    }
    Exts.devsInit = devsInit;
    function devsStart() {
        if (devs_interval)
            return;
        Module.devsInit();
        devs_interval = setInterval(() => {
            try {
                Module._jd_em_process();
            }
            catch (e) {
                console.error(e);
                devsStop();
            }
        }, 10);
    }
    Exts.devsStart = devsStart;
    function devsStop() {
        if (devs_interval) {
            clearInterval(devs_interval);
            devs_interval = undefined;
        }
    }
    Exts.devsStop = devsStop;
    function devsSetDeviceId(id0, id1) {
        if (typeof id0 == "string") {
            const s = allocateUTF8(id0);
            Module._jd_em_set_device_id_string(s);
            Module._free(s);
        }
        else if (typeof id0 == "number" && typeof id1 == "number") {
            Module._jd_em_set_device_id_2x_i32(id0, id1);
        }
        else {
            throw new Error("invalid args");
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB04GAgAAhYAN/f38AYAF/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAn98AGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAd/f39/f39/AX9gA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/AsyFgIAAFgNlbnYFYWJvcnQABQNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgABA2Vudg1lbV9zZW5kX2ZyYW1lAAEDZW52EGVtX2NvbnNvbGVfZGVidWcAAQNlbnYEZXhpdAABA2VudgtlbV90aW1lX25vdwASA2VudhNkZXZzX2RlcGxveV9oYW5kbGVyAAEDZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAYDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAGA2VudhRqZF9jcnlwdG9fZ2V0X3JhbmRvbQACFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAYWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQDZW52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Ay0AA0EBcQ0BQQAoAvw7QX9qIQggAigCACELQQAhAQJAA0ACQCABIAhMDQBBACEFDAILAkACQEHwOCAIIAFqQQJtIgdBDGxqIgkoAgQiCiALTw0AQQEhDCAHQQFqIQEMAQtBACEMAkAgCiALSw0AIAkhBQwBCyAHQX9qIQhBASEMCyAMDQALCyAFRQ0BIAAoAiQiAUUNASADQRBqIQwDQAJAIAEoAgQgAkcNAAJAIAEtAAkiCEUNACABIAhBf2o6AAkLAkAgDCADLQAMIAUvAQgQXiINvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhBwJAAkBBACgCoKEBIgsgAUHEAGooAgAiCGtBAEgNACABQShqIgsgASsDGCAIIAdruKIgCysDAKA5AwAMAQsgAUEoaiIIIAErAxggCyAHa7iiIAgrAwCgOQMAIAshCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgCoKEBIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBDQA0UhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIECEgAygCBBCXAyEIDAELIAxFDQEgCBAhQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtBmihB0CJBlQJBzAkQjwMAC7kBAQN/QcgAECAiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKAKgoQEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABEE4iAEUNACACIAAoAgQQlwM2AgwLIAJB4BwQwQEgAgvoBgIIfwJ8IwBBEGsiASQAAkACQCAAKAIIRQ0AQQAoAqChASAAKAIca0EATg0BCwJAIABBGGpBgMC4AhCMA0UNAAJAIAAoAiQiAkUNAANAAkAgAi0ACSACLQAIRw0AIAJBADoACQsgAiACLQAJOgAIIAIoAgAiAg0ACwsgACgCKCICRQ0AAkAgAiAAKAIMIgNPDQAgACACQdAPajYCKAsgACgCKCADTQ0AIAAgAzYCKAsCQCAAQRRqIgRBgKAGEIwDRQ0AIAAoAiQiAkUNAANAAkAgAigCBCIDRQ0AIAItAAlBMUsNACABQfoBOgAPAkACQCADQYPAACABQQ9qQQEQVSIDRQ0AIARBACgC4JkBQYDAAGo2AgAMAQsgAiABLQAPOgAJCyADDQILIAIoAgAiAg0ACwsCQCAAKAIkIgJFDQAgAEEMaiEFIABBKGohBgNAAkAgAkHEAGooAgAiA0EAKAKgoQFrQX9KDQACQAJAAkAgAkEgaiIEKAIADQAgAkKAgICAgICA/P8ANwMYDAELIAIrAxggAyACKAIUa7iiIQkgAkEoaisDACEKAkACQCACKAIMIgMNAEEAIQcMAQsgAxDRAyEHCyAJIAqgIQkgB0EpahAgIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEK0DGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQpgMiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQYARQ0AIAJB6BwQwQELIAMQISAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQIQsgAigCACICDQALCyABQRBqJAAPC0GADEEAEC0QMwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEJMDIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRBphEgAkEgahAtDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQYwRIAJBEGoQLQwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEGWECACEC0LIAJBwABqJAALmgUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMECEgARAhIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDDASECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAqChASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahDDASECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDDASECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFBwDQQ8gJB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgCoKEBIAFqNgIcCwv6AQEEfyACQQFqIQMgAUHVJyABGyEEAkAgACgCJCIBRQ0AA0ACQCABKAIMIgVFDQAgBSAEIAMQwwNFDQILIAEoAgAiAQ0ACwsCQCABDQBByAAQICIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQQAoAqChASIGNgJAAkAgASgCECIFDQACQAJAIAAtABJFDQAgAEEoaiEFIAAoAigNASAFQYgnNgIADAELIABBDGohBQsgBSgCACEFCyABIAUgBmo2AkQgAUHgHBDBASABIAMQICIFNgIMIAUgBCACEK0DGgsgAQs4AQF/QQBB0DQQ9wIiATYCoJ4BIAFBAToAEiABIAA2AiAgAUHg1AM2AgwgAUGBAjsBEEEQIAEQUAvKAgEDfwJAQQAoAqCeASICRQ0AIAIgACAAENEDEMMBIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoAqChASIEIABBxABqKAIAIgJrQQBIDQAgAEEoaiIEIAArAxggAiADa7iiIAQrAwCgOQMADAELIABBKGoiAiAAKwMYIAQgA2u4oiACKwMAoDkDACAEIQILIAAgAjYCFAJAIABBOGorAwAgAWNFDQAgACABOQM4CwJAIABBMGorAwAgAWRFDQAgACABOQMwCyAAIAE5AxgLC6YCAgJ+BH8CQCABvSICQv///////////wCDQoGAgICAgID4/wBUDQAgAEKAgICAgICA/P8ANwMADwsCQCACQiCIIgMgAoSnDQAgAEKAgICAcDcDAA8LAkAgA6ciBEEUdkH/D3EiBUH/B0kNACACpyEGAkACQCAFQZMISw0AIAYNAgJAIAVBkwhGDQAgBEH//z9xIAVBjXhqdA0DCyAEQf//P3FBgIDAAHJBkwggBWt2IQUMAQsCQCAFQZ4ISQ0AIAYNAiAEQYCAgI98Rw0CIABCgICAgHg3AwAPCyAGIAVB7XdqIgd0DQEgBEH//z9xQYCAwAByIAd0IAZBswggBWt2ciEFCyAAQX82AgQgACAFQQAgBWsgAkJ/VRs2AgAPCyAAIAE5AwALEAAgACABNgIAIABBfzYCBAsgACAAQsCAgICQgID4/wBCgYCAgJCA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ACACKAI0EMcBC0gBAX8CQCACKAI0IgMgAigCiAFB1ABqKAIAQQN2Tw0AIAAgAigCiAEiAiACKAJQaiADQQN0aikAADcDAA8LIAAgAkHrABCHAQsPACAAIAEoAggpAyA3AwALbwEGfyMAQRBrIgMkACACELMCIQQgAiADQQxqELgCIQVBACEGAkAgBCADKAIMIgdqIghBAWogAkHMAWotAABLDQAgAkHQAWoiAiAIai0AAA0AIAIgBGogBSAHEMMDRSEGCyAAIAYQyAEgA0EQaiQACyUBAX8gAhC6AiEDIAAgAigCmAEgA0ECdGooAgAoAhBBAEcQyAELEAAgACACQcwBai0AABDHAQtHAAJAIAJBwwFqLQAAQQFxDQAgAkHNAWotAABBMEsNACACQc4BaiICLgEAQX9KDQAgACACLQAAEMcBDwsgAEEAKQP4NDcDAAtRAAJAIAJBwwFqLQAAQQFxDQAgAkHNAWotAABBMEsNACACQc4BaiICLwEAQYDgA3FBgCBHDQAgACACLwEAQf8fcRDHAQ8LIABBACkD+DQ3AwALDQAgAEEAKQPoNDcDAAunAQIBfwF8IwBBEGsiAyQAIANBCGogAhCyAgJAAkAgAygCDEF/Rg0AIAMgAykDCDcDAAJAIAMQywEiBEQAAAAAAAAAAGNFDQAgACAEmhDGAQwCCyAAIAMpAwg3AwAMAQsCQCADKAIIIgJBf0oNAAJAIAJBgICAgHhHDQAgAEEAKQPwNDcDAAwCCyAAQQAgAmsQxwEMAQsgACADKQMINwMACyADQRBqJAALDwAgACACELQCQX9zEMcBC08BAX8jAEEQayIDJAAgA0EIaiACELICAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQywGbEMYBCyADQRBqJAALTwEBfyMAQRBrIgMkACADQQhqIAIQsgICQAJAIAMoAgxBf0cNACAAIAMpAwg3AwAMAQsgAyADKQMINwMAIAAgAxDLAZwQxgELIANBEGokAAsJACAAIAIQsgILLwEBfyMAQRBrIgMkACADQQhqIAIQsgIgACADKAIMQYCA4P8HRhDIASADQRBqJAALDwAgACACELYCEMADEMYBC28BAX8jAEEQayIDJAAgA0EIaiACELICAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAxDLAZoQxgEMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQPwNDcDAAwBCyAAQQAgAmsQxwELIANBEGokAAs1AQF/IwBBEGsiAyQAIANBCGogAhCyAiADIAMpAwg3AwAgACADEMwBQQFzEMgBIANBEGokAAshAQF/EIQDIQMgACACELYCIAO4okQAAAAAAADwPaIQxgELSwEDf0EBIQMCQCACELQCIgRBAU0NAANAIANBAXRBAXIiAyAESQ0ACwsDQCACEIQDIANxIgUgBSAESyIFGyECIAUNAAsgACACEMcBC1EBAX8jAEEQayIDJAAgA0EIaiACELICAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQywEQzQMQxgELIANBEGokAAsyAQF/IwBBEGsiAyQAIANBCGogAhCyAiADIAMpAwg3AwAgACADEMwBEMgBIANBEGokAAvIAQIEfwF8IwBBIGsiAyQAIANBGGogAhCyAiACQRhqIgQgAykDGDcDACADQRhqIAIQsgIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQxwEMAQsgAyACQRBqKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiADQQhqEMsBIgc5AwAgACAHIAIrAyCgEMYBCyADQSBqJAALLAECfyACQRhqIgMgAhC0AjYCACACIAIQtAIiBDYCECAAIAQgAygCAHEQxwELLAECfyACQRhqIgMgAhC0AjYCACACIAIQtAIiBDYCECAAIAQgAygCAHIQxwELLAECfyACQRhqIgMgAhC0AjYCACACIAIQtAIiBDYCECAAIAQgAygCAHMQxwEL4wECBX8BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNAAJAAkAgAigCGCIFQQFqDgIAAgELIAIoAhBBgICAgHhGDQELIAIoAhAiBiAFbSIHIAVsIAZHDQAgACAHEMcBDAELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIIOQMAIAAgAisDICAIoxDGAQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiADQQhqEMsBIgU5AwAgBSACKwMgYSECDAELIAIoAhAgAigCGEYhAgsgACACEMgBIANBIGokAAtBAQJ/IAJBGGoiAyACELQCNgIAIAIgAhC0AiIENgIQAkAgAygCACICDQAgAEEAKQPgNDcDAA8LIAAgBCACbRDHAQssAQJ/IAJBGGoiAyACELQCNgIAIAIgAhC0AiIENgIQIAAgBCADKAIAbBDHAQu5AQICfwF8IwBBIGsiAyQAIANBGGogAhCyAiACQRhqIgQgAykDGDcDACADQRhqIAIQsgIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhDIASADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEMsBOQMgIAMgBCkDADcDCCACQShqIANBCGoQywEiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQyAEgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQywE5AwBB6DQhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAQgBSACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQywE5AwBB6DQhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAUgBCACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC8oBAwN/AX4BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACNAIQIAI0Ahh+IgZCIIinIAanIgVBH3VHDQAgACAFEMcBDAELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIHOQMAIAAgByACKwMgohDGAQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiADQQhqEMsBIgU5AwAgBSACKwMgYiECDAELIAIoAhAgAigCGEchAgsgACACEMgBIANBIGokAAuFAQICfwF8IwBBIGsiAyQAIANBGGogAhCyAiACQRhqIgQgAykDGDcDACADQRhqIAIQsgIgAiADKQMYNwMQIAMgAikDEDcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIFOQMAIAAgAisDICAFEMoDEMYBIANBIGokAAssAQJ/IAJBGGoiAyACELQCNgIAIAIg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ayICJAAgAkEIaiABELICAkAgAUEBELsCIgNFDQAgAS8BNCEEIAIgAikDCDcDACABIAMgBCACEKUBCyACQRBqJAALZwECfyMAQTBrIgIkACACQShqIAEQsgIgARCzAiEDIAJBIGogARCyAiACIAIpAyA3AxAgAiACKQMoNwMIAkAgASACQRBqIAMgAkEIahCoAUUNACACQRhqIAFBhQEQhwELIAJBMGokAAuJAQEEfyMAQSBrIgIkACABELQCIQMgARCzAiEEIAJBGGogARCyAiACIAIpAxg3AwgCQAJAIAEgAkEIahDPASIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQAgASAFIAQgAxCpAUUNASACQRBqIAFBigEQhwEMAQsgAkEQaiABQYsBEIcBCyACQSBqJAALYAECfyMAQRBrIgMkAAJAAkAgAigCNCIEIAIoAogBQcQAaigCAEEEdkkNACADQQhqIAJB8gAQhwEgAEEAKQP4NDcDAAwBCyAAIAQ2AgAgAEGGgMD/BzYCBAsgA0EQaiQAC0EBAn8gAkEYaiIDIAIQtAI2AgAgAiACELQCIgQ2AhACQCADKAIAIgINACAAQQApA+A0NwMADwsgACAEIAJvEMcBCwwAIAAgAhC0AhDHAQtlAQV/IwBBEGsiAiQAIAEQswIhAyABELMCIQQgARCzAiEFIAEgAkEMahC4AiEBAkAgAigCDCIGIAVNDQAgAiAGIAVrIgY2AgwgASAFaiADIAYgBCAGIARJGxCvAxoLIAJBEGokAAs+AQF/AkAgAS0AMiICDQAgACABQewAEIcBDwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akE4aikDADcDAAtoAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQhwEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQygEhACABQRBqJAAgAAtoAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQhwEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQygEhACABQRBqJAAgAAuCAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIcB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B3FrQYCAwP8Hca1CIIa/oiEDC0GAgICAeCEBIANEAAAAAAAA4MFjDQJB/////wchASADRAAAwP///99BZA0CIANEAAAAAAAA4D+gIgOZRAAAAAAAAOBBY0UNASADqg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAABAgMEBQYHCAsgAC0AAA8LIAAvAAAPCyAAKAAAIgFB/////wcgAUH/////B0kbDwsgACkAACIEQv////8HIARC/////wdUG6cPCyAALAAADwsgAC4AAA8LIAAoAAAPC0GAgICAeCEBIAApAAAiBEKAgICAeFMNAiAEQv////8HIARC/////wdTG6cPC0HeH0HKAUH2JxCKAwALQYCAgIB4IQELIAELnQECAX8BfAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDeArchAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLIAML1AECAn8BfkF+IQICQAJAIAEtAAxBDEkNACABKQIQIgRQDQAgAUEYai8BACEDECINAQJAIAAtAAZFDQACQAJAAkBBACgC/KABIgIgAEcNAEH8oAEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEK8DGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAQ3AgAgACADQQd0OwEEQQAhAiAAQQAoAvygATYCAEEAIAA2AvygAQsgAg8LQfYjQStBnRQQigMAC9EBAgJ/AX5BfiECAkACQCABLQAMQQJJDQAgASkCBCIEUA0AIAEvARAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoAvygASICIABHDQBB/KABIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhCvAxoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAENwIAIAAgA0EHdDsBBEEAIQIgAEEAKAL8oAE2AgBBACAANgL8oAELIAIPC0H2I0ErQZ0UEIoDAAu9AgEDfwJAAkACQCAALQANQT9HDQAgAC0AA0EBcQ0A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dUFQaiEHDAELQX8hByADQSByIghBn39qQf8BcUEFSw0AIAhBGHRBGHVBqX9qIQcLAkAgB0F/Rw0AIAEtAAEiA0UhBCABQQFqIQEgAw0BDAILIARBAXENAQJAAkAgBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIDQZ9/akH/AXFBBUsNACADQRh0QRh1Qal/aiEHCyABQQFqIQECQAJAIAUNACAHQQR0QYACciEFDAELIAIgByAFcjoAACACQQFqIQJBACEFCyABLQAAIgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEGiDyAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEK0DIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDRA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwAL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FCIFayABTw0AIAIgACABIAIoAiQRBgAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEGACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEK0DGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQuAMhAAwBCyADELADIQUgACAEIAMQuAMhACAFRQ0AIAMQsQMLAkAgACAERw0AIAJBACABGw8LIAAgAW4LAgALBABBAAsEAEEACwIACzIBAX8jAEEQayIBRAAAAAAAAPC/RAAAAAAAAPA/IAAbOQMIIAErAwhEAAAAAAAAAACjCwwAIAAgAKEiACAAowu+BAMCfgZ8AX8CQCAAvSIBQoCAgICAgICJQHxC//////+fwgFWDQACQCABQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIDoCADoSIDIAOiQQArA9A9IgSiIgWgIgYgACAAIACiIgeiIgggCCAIIAhBACsDoD6iIAdBACsDmD6iIABBACsDkD6iQQArA4g+oKCgoiAHQQArA4A+oiAAQQArA/g9okEAKwPwPaCgoKIgB0EAKwPoPaIgAEEAKwPgPaJBACsD2D2goKCiIAAgA6EgBKIgACADoKIgBSAAIAahoKCgoA8LAkACQCABQjCIpyIJQZCAfmpBn4B+Sw0AAkAgAUL///////////8Ag0IAUg0AQQEQvgMPCyABQoCAgICAgID4/wBRDQECQAJAIAlBgIACcQ0AIAlB8P8BcUHw/wFHDQELIAAQvwMPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCEBCyABQoCAgICAgICNQHwiAkI0h6e3IgdBACsDmD2iIAJCLYinQf8AcUEEdCIJQbA+aisDAKAiCCAJQag+aisDACABIAJCgICAgICAgHiDfb8gCUGozgBqKwMAoSAJQbDOAGorAwChoiIAoCIEIAAgACAAoiIDoiADIABBACsDyD2iQQArA8A9oKIgAEEAKwO4PaJBACsDsD2goKIgA0EAKwOoPaIgB0EAKwOgPaIgACAIIASh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cl9pbml0AHJlZmxlY3RlZExpZ2h0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAZGV2c19maWJlcl9jb3B5X3BhcmFtcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAV1M6IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAY2xlYXIgcm9sZSAlcwBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwBKU0NSOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgB0YWcgZXJyb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgByb3RhcnlFbmNvZGVyAGZyZWVfZmliZXIAamRfc2hhMjU2X3NldHVwACFzd2VlcABkZXZzX3ZtX3BvcF9hcmdfbWFwAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgByZS1ydW4AYnV0dG9uAG1vdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAHVucGluAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4Ac2NhbgBmbGFzaF9wcm9ncmFtAGpkX3JvbGVfZnJlZV9hbGwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA8PSBtYXAtPmxlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmADAxMjM0NTY3ODlhYmNkZWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGhlYXJ0UmF0ZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTOiBjbG9zZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBiYWQgbWFnaWMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV91dGlsLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBqYWNkYWMtYy9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBKQUNTX0dDX1RBR19CWVRFUwBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBlQ08yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAYXJnMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIEpBQ1NfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpICE9IDAAL3dzc2svAHdzOi8vAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAGFnZ2J1ZjogdXBsOiAnJXMnICVmICglLXMpAFdTU0stSDogc3RhdHVzICVkICglcykAKG51bGwpAGlkeCA8IGRldnNfaW1nX251bV9zdHJpbmdzKCZjdHgtPmltZykAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAR0VUX1RBRyhiLT5oZWFkZXIpID09IChKQUNTX0dDX1RBR19NQVNLX1BJTk5FRCB8IEpBQ1NfR0NfVEFHX0JZVEVTKQB0eXBlICYgKEpBQ1NfSEFORExFX0dDX01BU0sgfCBKQUNTX0hBTkRMRV9JTUdfTUFTSykAV1M6IHRleHQgbWVzc2FnZT8hICclcycAemVybyBrZXkhAFdTOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABAAAAAAAAAAAAamFjZGFjLXBvc2l4IGRldmljZQAwLjAuMAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAA8J8GAIAQgRHxDwAAZn5LHiQBAAAHAAAACAAAAPCfBgCAEIEQghDxDyvqNBE4AQAADAAAAA0AAABKYWNTCn5qmgIAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAACAAAACQAAAAGAAAAKgAAAAAAAAAqAAAAAAAAACoAAAAGAAAAMAAAAAcAAAAkAAAABAAAAAAAAAAAAAAAKAAAAAIAAAAAAAAAAIAAABM+QAGkEuQWgGSSgBM/AgABPkCCUBM/AXAAAAABAAAAMUAAAAFAAAAywAAAA0AAABtYWluAGNsb3VkAF9hdXRvUmVmcmVzaF8AAAAAAAAAAJxuYBQMAAAADgAAAA8AAAAAAAAAAAAAAJgvikKRRDdxz/vAtaXbtelbwlY58RHxWaSCP5LVXhyrmKoH2AFbgxK+hTEkw30MVXRdvnL+sd6Apwbcm3Txm8HBaZvkhke+78adwQ/MoQwkbyzpLaqEdErcqbBc2oj5dlJRPphtxjGoyCcDsMd/Wb/zC+DGR5Gn1VFjygZnKSkUhQq3JzghGy78bSxNEw04U1RzCmW7Cmp2LsnCgYUscpKh6L+iS2YaqHCLS8KjUWzHGeiS0SQGmdaFNQ70cKBqEBbBpBkIbDceTHdIJ7W8sDSzDBw5SqrYTk/KnFvzby5o7oKPdG9jpXgUeMiECALHjPr/vpDrbFCk96P5vvJ4ccbwnwYAhFCBUIMQghCAEPEPzL2SESwAAAARAAAAEgAAAAAAAAD/////AAAAAAAA+H8AAAAAAADgQQAAAAAAAAAAQAAAAAEA8H8BAAAAAQDwf0EAAAABAPB/AwAAAAIAAAAEAAAAfyAgA2BgAAIBAAAAQEFBQUFBQUFBQQEBQUFCQkJCQkJCQkJCQkJCQkJCQkJCIAABAABgYCECAQFBQEFAQEARERETEhQyMxESFTIzETAxETExFDEREBERMhMTYEJBFAAAAAAAAAAAAAAAAAAAY3x3e/Jrb8UwAWcr/terdsqCyX36WUfwrdSir5ykcsC3/ZMmNj/3zDSl5fFx2DEVBMcjwxiWBZoHEoDi6yeydQmDLBobblqgUjvWsynjL4RT0QDtIPyxW2rLvjlKTFjP0O+q+0NNM4VF+QJ/UDyfqFGjQI+SnTj1vLbaIRD/89LNDBPsX5dEF8Snfj1kXRlzYIFP3CIqkIhG7rgU3l4L2+AyOgpJBiRcwtOsYpGV5HnnyDdtjdVOqWxW9Opleq4IunglLhymtMbo3XQfS72LinA+tWZIA/YOYTVXuYbBHZ7h+JgRadmOlJseh+nOVSjfjKGJDb/mQmhBmS0PsFS7Fo0BAgQIECBAgBs2AAAAAAAAAAAALAIAACkCAAAjAgAAKQIAAPCfBgCCMYBQgVDxD/zuYhRcAAAAcQAAAHIAAABzAAAAdAAAAHUAAAB2AAAAAAQAAHcAAAAAAAAAAAAAAEQJAAC2TrsQgQAAAHUJAADJKfoQBgAAAOYJAABJp3kRAAAAANUFAACyTGwSAQEAAGkPAACXtaUSogAAAH4KAAAPGP4S9QAAAKQOAADILQYTAAAAAGcNAACVTHMTAgEAAJUNAACKaxoUAgEAAPQMAADHuiEUpgAAAN8JAABjonMUAQEAAGgKAADtYnsUAQEAADkEAADWbqwUAgEAAHMKAABdGq0UAQEAALkGAAC/ubcVAgEAAKsFAAAZrDMWAwAAAKoMAADEbWwWAgEAAN0TAADGnZwWogAAAAAEAAC4EMgWogAAAF0KAAAcmtwXAQEAAO0JAAAr6WsYAQAAAJYFAACuyBIZAwAAAAwLAAAClNIaAAAAAJoOAAC/G1kbAgEAAAELAAC1KhEdBQAAAOcMAACzo0odAQEAAAANAADqfBEeogAAAJ4NAADyym4eogAAAAkEAADFeJcewQAAADYJAABGRycfAQEAADQEAADGxkcf9QAAAFsNAABAUE0fAgEAAEkEAACQDW4fAgEAACEAAAAAAAAACAAAAHgAAAB5AAAAAQECAgQEBAgBAAECBAQAAAEAAAAAAAAACgAAAAAAAABkAAAAAAAAAOgDAAAAAAAAECcAAAAAAACghgEAAAAAAEBCDwAAAAAAgJaYAAAAAAAA4fUFAAAAAADKmjsAAAAAAOQLVAIAAAAA6HZIFwAAAAAQpdToAAAAAKByThgJAAAAQHoQ81oAAAA4+v5CLuY/MGfHk1fzLj0BAAAAAADgv1swUVVVVdU/kEXr////z78RAfEks5nJP5/IBuV1VcW/AAAAAAAA4L93VVVVVVXVP8v9/////8+/DN2VmZmZyT+nRWdVVVXFvzDeRKMkScI/ZT1CpP//v7/K1ioohHG8P/9osEPrmbm/hdCv94KBtz/NRdF1E1K1v5/e4MPwNPc/AJDmeX/M178f6SxqeBP3PwAADcLub9e/oLX6CGDy9j8A4FET4xPXv32MEx+m0fY/AHgoOFu41r/RtMULSbH2PwB4gJBVXda/ugwvM0eR9j8AABh20ALWvyNCIhifcfY/AJCQhsqo1b/ZHqWZT1L2PwBQA1ZDT9W/xCSPqlYz9j8AQGvDN/bUvxTcnWuzFPY/AFCo/aed1L9MXMZSZPb1PwCoiTmSRdS/TyyRtWfY9T8AuLA59O3Tv96QW8u8uvU/AHCPRM6W0794GtnyYZ31PwCgvRceQNO/h1ZGElaA9T8AgEbv4unSv9Nr586XY/U/AOAwOBuU0r+Tf6fiJUf1PwCI2ozFPtK/g0UGQv8q9T8AkCcp4enRv9+9stsiD/U/APhIK22V0b/X3jRHj/P0PwD4uZpnQdG/QCjez0PY9D8AmO+U0O3Qv8ijeMA+vfQ/ABDbGKWa0L+KJeDDf6L0PwC4Y1LmR9C/NITUJAWI9D8A8IZFIuvPvwstGRvObfQ/ALAXdUpHz79UGDnT2VP0PwAwED1EpM6/WoS0RCc69D8AsOlEDQLOv/v4FUG1IPQ/APB3KaJgzb+x9D7aggf0PwCQlQQBwMy/j/5XXY/u8z8AEIlWKSDMv+lMC6DZ1fM/ABCBjReBy78rwRDAYL3zPwDQ08zJ4sq/uNp1KySl8z8AkBIuQEXKvwLQn80ijfM/APAdaHeoyb8ceoTFW3XzPwAwSGltDMm/4jatSc5d8z8AwEWmIHHIv0DUTZh5RvM/ADAUtI/Wx78ky//OXC/zPwBwYjy4PMe/SQ2hdXcY8z8AYDebmqPGv5A5PjfIAfM/AKC3VDELxr9B+JW7TuvyPwAwJHZ9c8W/0akZAgrV8j8AMMKPe9zEvyr9t6j5vvI/AADSUSxGxL+rGwx6HKnyPwAAg7yKsMO/MLUUYHKT8j8AAElrmRvDv/WhV1f6ffI/AECkkFSHwr+/Ox2bs2jyPwCgefi588G/vfWPg51T8j8AoCwlyGDBvzsIyaq3PvI/ACD3V3/OwL+2QKkrASryPwCg/kncPMC/MkHMlnkV8j8AgEu8vVe/v5v80h0gAfI/AEBAlgg3vr8LSE1J9OzxPwBA+T6YF72/aWWPUvXY8T8AoNhOZ/m7v3x+VxEjxfE/AGAvIHncur/pJst0fLHxPwCAKOfDwLm/thosDAGe8T8AwHKzRqa4v71wtnuwivE/AACsswGNt7+2vO8linfxPwAAOEXxdLa/2jFMNY1k8T8AgIdtDl61v91fJ5C5UfE/AOCh3lxItL9M0jKkDj/xPwCgak3ZM7O/2vkQcoss8T8AYMX4eSCyvzG17CgwGvE/ACBimEYOsb+vNITa+wfxPwAA0mps+q+/s2tOD+718D8AQHdKjdqtv86fKl0G5PA/AACF5Oy8q78hpSxjRNLwPwDAEkCJoam/GpjifKfA8D8AwAIzWIinv9E2xoMvr/A/AIDWZ15xpb85E6CY253wPwCAZUmKXKO/3+dSr6uM8D8AQBVk40mhv/soTi+fe/A/AIDrgsBynr8ZjzWMtWrwPwCAUlLxVZq/LPnspe5Z8D8AgIHPYj2Wv5As0c1JSfA/AACqjPsokr+prfDGxjjwPwAA+SB7MYy/qTJ5E2Uo8D8AAKpdNRmEv0hz6ickGPA/AADswgMSeL+VsRQGBAjwPwAAJHkJBGC/Gvom9x/g7z8AAJCE8+9vP3TqYcIcoe8/AAA9NUHchz8umYGwEGPvPwCAwsSjzpM/za3uPPYl7z8AAIkUwZ+bP+cTkQPI6e4/AAARztiwoT+rsct4gK7uPwDAAdBbiqU/mwydohp07j8AgNhAg1ypP7WZCoOROu4/AIBX72onrT9WmmAJ4AHuPwDAmOWYdbA/mLt35QHK7T8AIA3j9VOyPwORfAvyku0/AAA4i90utD/OXPtmrFztPwDAV4dZBrY/nd5eqiwn7T8AAGo1dtq3P80saz5u8uw/AGAcTkOruT8Ceaeibb7sPwBgDbvHeLs/bQg3bSaL7D8AIOcyE0O9PwRYXb2UWOw/AGDecTEKvz+Mn7sztSbsPwBAkSsVZ8A/P+fs7oP16z8AsJKChUfBP8GW23X9xOs/ADDKzW4mwj8oSoYMHpXrPwBQxabXA8M/LD7vxeJl6z8AEDM8w9/DP4uIyWdIN+s/AIB6aza6xD9KMB0hSwnrPwDw0Sg5k8U/fu/yhejb6j8A8BgkzWrGP6I9YDEdr+o/AJBm7PhAxz+nWNM/5oLqPwDwGvXAFcg/i3MJ70BX6j8AgPZUKenIPydLq5AqLOo/AED4Aja7yT/R8pMToAHqPwAALBzti8o/GzzbJJ/X6T8A0AFcUVvLP5CxxwUlruk/AMC8zGcpzD8vzpfyLoXpPwBgSNU19sw/dUuk7rpc6T8AwEY0vcHNPzhI553GNOk/AODPuAGMzj/mUmcvTw3pPwCQF8AJVc8/ndf/jlLm6D8AuB8SbA7QP3wAzJ/Ov+g/ANCTDrhx0D8Ow77awJnoPwBwhp5r1NA/+xcjqid06D8A0EszhzbRPwias6wAT+g/AEgjZw2Y0T9VPmXoSSroPwCAzOD/+NE/YAL0lQEG6D8AaGPXX1nSPymj4GMl4uc/AKgUCTC50j+ttdx3s77nPwBgQxByGNM/wiWXZ6qb5z8AGOxtJnfTP1cGF/IHeec/ADCv+0/V0z8ME9bbylbnPwDgL+PuMtQ/a7ZPAQAQ5j88W0KRbAJ+PJW0TQMAMOY/QV0ASOq/jTx41JQNAFDmP7el1oanf448rW9OBwBw5j9MJVRr6vxhPK4P3/7/j+Y//Q5ZTCd+fLy8xWMHALDmPwHa3EhowYq89sFcHgDQ5j8Rk0mdHD+DPD72Bev/7+Y/Uy3iGgSAfryAl4YOABDnP1J5CXFm/3s8Euln/P8v5z8kh70m4gCMPGoRgd//T+c/0gHxbpECbryQnGcPAHDnP3ScVM1x/Ge8Nch++v+P5z+DBPWewb6BPObCIP7/r+c/ZWTMKRd+cLwAyT/t/8/nPxyLewhygIC8dhom6f/v5z+u+Z1tKMCNPOijnAQAEOg/M0zlUdJ/iTyPLJMXADDoP4HzMLbp/oq8nHMzBgBQ6D+8NWVrv7+JPMaJQiAAcOg/dXsR82W/i7wEefXr/4/oP1fLPaJuAIm83wS8IgCw6D8KS+A43wB9vIobDOX/z+g/BZ//RnEAiLxDjpH8/+/oPzhwetB7gYM8x1/6HgAQ6T8DtN92kT6JPLl7RhMAMOk/dgKYS06AfzxvB+7m/0/pPy5i/9nwfo+80RI83v9v6T+6OCaWqoJwvA2KRfT/j+k/76hkkRuAh7w+Lpjd/6/pPzeTWorgQIe8ZvtJ7f/P6T8A4JvBCM4/PFGc8SAA8Ok/CluIJ6o/irwGsEURABDqP1baWJlI/3Q8+va7BwAw6j8YbSuKq76MPHkdlxAAUOo/MHl43cr+iDxILvUdAHDqP9ur2D12QY+8UjNZHACQ6j8SdsKEAr+OvEs+TyoAsOo/Xz//PAT9abzRHq7X/8/qP7RwkBLnPoK8eARR7v/v6j+j3g7gPgZqPFsNZdv/D+s/uQofOMgGWjxXyqr+/y/rPx08I3QeAXm83LqV2f9P6z+fKoZoEP95vJxlniQAcOs/Pk+G0EX/ijxAFof5/4/rP/nDwpZ3/nw8T8sE0v+v6z/EK/LuJ/9jvEVcQdL/z+s/Ieo77rf/bLzfCWP4/+/rP1wLLpcDQYG8U3a14f8P7D8ZareUZMGLPONX+vH/L+w/7cYwje/+ZLwk5L/c/0/sP3VH7LxoP4S897lU7f9v7D/s4FPwo36EPNWPmev/j+w/8ZL5jQaDczyaISUhALDsPwQOGGSO/Wi8nEaU3f/P7D9y6sccvn6OPHbE/er/7+w//oifrTm+jjwr+JoWABDtP3FauaiRfXU8HfcPDQAw7T/ax3BpkMGJPMQPeer/T+0/DP5YxTcOWLzlh9wuAHDtP0QPwU3WgH+8qoLcIQCQ7T9cXP2Uj3x0vIMCa9j/r+0/fmEhxR1/jDw5R2wpANDtP1Ox/7KeAYg89ZBE5f/v7T+JzFLG0gBuPJT2q83/D+4/0mktIECDf7zdyFLb/y/uP2QIG8rBAHs87xZC8v9P7j9Rq5SwqP9yPBFeiuj/b+4/Wb7vsXP2V7wN/54RAJDuPwHIC16NgIS8RBel3/+v7j+1IEPVBgB4PKF/EhoA0O4/klxWYPgCULzEvLoHAPDuPxHmNV1EQIW8Ao169f8P7z8Fke85MftPvMeK5R4AMO8/VRFz8qyBijyUNIL1/0/vP0PH19RBP4o8a0yp/P9v7z91eJgc9AJivEHE+eH/j+8/S+d39NF9dzx+4+DS/6/vPzGjfJoZAW+8nuR3HADQ7z+xrM5L7oFxPDHD4Pf/7+8/WodwATcFbrxuYGX0/w/wP9oKHEmtfoq8WHqG8/8v8D/gsvzDaX+XvBcN/P3/T/A/W5TLNP6/lzyCTc0DAHDwP8tW5MCDAII86Mvy+f+P8D8adTe+3/9tvGXaDAEAsPA/6ybmrn8/kbw406QBANDwP/efSHn6fYA8/f3a+v/v8D/Aa9ZwBQR3vJb9ugsAEPE/YgtthNSAjjxd9OX6/y/xP+82/WT6v5082ZrVDQBQ8T+uUBJwdwCaPJpVIQ8AcPE/7t7j4vn9jTwmVCf8/4/xP3NyO9wwAJE8WTw9EgCw8T+IAQOAeX+ZPLeeKfj/z/E/Z4yfqzL5ZbwA1Ir0/+/xP+tbp52/f5M8pIaLDAAQ8j8iW/2Ra4CfPANDhQMAMPI/M7+f68L/kzyE9rz//0/yP3IuLn7nAXY82SEp9f9v8j9hDH92u/x/PDw6kxQAkPI/K0ECPMoCcrwTY1UUALDyPwIf8jOCgJK8O1L+6//P8j/y3E84fv+IvJatuAsA8PI/xUEwUFH/hbyv4nr7/w/zP50oXohxAIG8f1+s/v8v8z8Vt7c/Xf+RvFZnpgwAUPM/vYKLIoJ/lTwh9/sRAHDzP8zVDcS6AIA8uS9Z+f+P8z9Rp7ItnT+UvELS3QQAsPM/4Th2cGt/hTxXybL1/8/zPzESvxA6Ano8GLSw6v/v8z+wUrFmbX+YPPSvMhUAEPQ/JIUZXzf4Zzwpi0cXADD0P0NR3HLmAYM8Y7SV5/9P9D9aibK4af+JPOB1BOj/b/Q/VPLCm7HAlbznwW/v/4/0P3IqOvIJQJs8BKe+5f+v9D9FfQ2/t/+UvN4nEBcA0PQ/PWrccWTAmbziPvAPAPD0PxxThQuJf5c80UvcEgAQ9T82pGZxZQRgPHonBRYAMPU/CTIjzs6/lrxMcNvs/0/1P9ehBQVyAom8qVRf7/9v9T8SZMkO5r+bPBIQ5hcAkPU/kO+vgcV+iDySPskDALD1P8AMvwoIQZ+8vBlJHQDQ9T8pRyX7KoGYvIl6uOf/7/U/BGntgLd+lLz+gitlRxVnQAAAAAAAADhDAAD6/kIudr86O568mvcMvb39/////98/PFRVVVVVxT+RKxfPVVWlPxfQpGcREYE/AAAAAAAAyELvOfr+Qi7mPyTEgv+9v84/tfQM1whrrD/MUEbSq7KDP4Q6Tpvg11U/AAAAAAAAAAAAAAAAAADwP26/iBpPO5s8NTP7qT327z9d3NicE2BxvGGAdz6a7O8/0WaHEHpekLyFf27oFePvPxP2ZzVS0ow8dIUV07DZ7z/6jvkjgM6LvN723Slr0O8/YcjmYU73YDzIm3UYRcfvP5nTM1vko5A8g/PGyj6+7z9te4NdppqXPA+J+WxYte8//O/9khq1jjz3R3IrkqzvP9GcL3A9vj48otHTMuyj7z8LbpCJNANqvBvT/q9mm+8/Dr0vKlJWlbxRWxLQAZPvP1XqTozvgFC8zDFswL2K7z8W9NW5I8mRvOAtqa6agu8/r1Vc6ePTgDxRjqXImHrvP0iTpeoVG4C8e1F9PLhy7z89Mt5V8B+PvOqNjDj5au8/v1MTP4yJizx1y2/rW2PvPybrEXac2Za81FwEhOBb7z9gLzo+9+yaPKq5aDGHVO8/nTiGy4Lnj7wd2fwiUE3vP43DpkRBb4o81oxiiDtG7z99BOSwBXqAPJbcfZFJP+8/lKio4/2Oljw4YnVuejjvP31IdPIYXoc8P6ayT84x7z/y5x+YK0eAPN184mVFK+8/XghxP3u4lryBY/Xh3yTvPzGrCW3h94I84d4f9Z0e7z/6v28amyE9vJDZ2tB/GO8/tAoMcoI3izwLA+SmhRLvP4/LzomSFG48Vi8+qa8M7z+2q7BNdU2DPBW3MQr+Bu8/THSs4gFChjwx2Ez8cAHvP0r401053Y88/xZksgj87j8EW447gKOGvPGfkl/F9u4/aFBLzO1KkrzLqTo3p/HuP44tURv4B5m8ZtgFba7s7j/SNpQ+6NFxvPef5TTb5+4/FRvOsxkZmbzlqBPDLePuP21MKqdIn4U8IjQSTKbe7j+KaSh6YBKTvByArARF2u4/W4kXSI+nWLwqLvchCtbuPxuaSWebLHy8l6hQ2fXR7j8RrMJg7WNDPC2JYWAIzu4/72QGOwlmljxXAB3tQcruP3kDodrhzG480DzBtaLG7j8wEg8/jv+TPN7T1/Aqw+4/sK96u86QdjwnKjbV2r/uP3fgVOu9HZM8Dd39mbK87j+Oo3EANJSPvKcsnXayue4/SaOT3Mzeh7xCZs+i2rbuP184D73G3ni8gk+dViu07j/2XHvsRhKGvA+SXcqkse4/jtf9GAU1kzzaJ7U2R6/uPwWbii+3mHs8/ceX1BKt7j8JVBzi4WOQPClUSN0Hq+4/6sYZUIXHNDy3RlmKJqnuPzXAZCvmMpQ8SCGtFW+n7j+fdplhSuSMvAncdrnhpe4/qE3vO8UzjLyFVTqwfqTuP67pK4l4U4S8IMPMNEaj7j9YWFZ43c6TvCUiVYI4ou4/ZBl+gKoQVzxzqUzUVaHuPygiXr/vs5O8zTt/Zp6g7j+CuTSHrRJqvL/aC3USoO4/7qltuO9nY7wvGmU8sp/uP1GI4FQ93IC8hJRR+X2f7j/PPlp+ZB94vHRf7Oh1n+4/sH2LwEruhrx0gaVImp/uP4rmVR4yGYa8yWdCVuuf7j/T1Aley5yQPD9d3k9poO4/HaVNudwye7yHAetzFKHuP2vAZ1T97JQ8MsEwAe2h7j9VbNar4etlPGJOzzbzou4/Qs+zL8WhiLwSGj5UJ6TuPzQ3O/G2aZO8E85MmYml7j8e/xk6hF6AvK3HI0Yap+4/bldy2FDUlLztkkSb2ajuPwCKDltnrZA8mWaK2ceq7j+06vDBL7eNPNugKkLlrO4//+fFnGC2ZbyMRLUWMq/uP0Rf81mD9ns8NncVma6x7j+DPR6nHwmTvMb/kQtbtO4/KR5si7ipXbzlxc2wN7fuP1m5kHz5I2y8D1LIy0S67j+q+fQiQ0OSvFBO3p+Cve4/S45m12zKhby6B8pw8cDuPyfOkSv8r3E8kPCjgpHE7j+7cwrhNdJtPCMj4xljyO4/YyJiIgTFh7xl5V17ZszuP9Ux4uOGHIs8My1K7JvQ7j8Vu7zT0buRvF0lPrID1e4/0jHunDHMkDxYszATntnuP7Nac26EaYQ8v/15VWve7j+0nY6Xzd+CvHrz079r4+4/hzPLkncajDyt01qZn+juP/rZ0UqPe5C8ZraNKQfu7j+6rtxW2cNVvPsVT7ii8+4/QPamPQ6kkLw6WeWNcvnuPzSTrTj01mi8R1778nb/7j81ilhr4u6RvEoGoTCwBe8/zd1fCtf/dDzSwUuQHgzvP6yYkvr7vZG8CR7XW8IS7z+zDK8wrm5zPJxShd2bGe8/lP2fXDLjjjx60P9fqyDvP6xZCdGP4IQ8S9FXLvEn7z9nGk44r81jPLXnBpRtL+8/aBmSbCxrZzxpkO/cIDfvP9K1zIMYioC8+sNdVQs/7z9v+v8/Xa2PvHyJB0otR+8/Sal1OK4NkLzyiQ0Ih0/vP6cHPaaFo3Q8h6T73BhY7z8PIkAgnpGCvJiDyRbjYO8/rJLB1VBajjyFMtsD5mnvP0trAaxZOoQ8YLQB8yFz7z8fPrQHIdWCvF+bezOXfO8/yQ1HO7kqibwpofUURobvP9OIOmAEtnQ89j+L5y6Q7z9xcp1R7MWDPINMx/tRmu8/8JHTjxL3j7zakKSir6TvP310I+KYro288WeOLUiv7z8IIKpBvMOOPCdaYe4buu8/Muupw5QrhDyXums3K8XvP+6F0TGpZIo8QEVuW3bQ7z/t4zvkujeOvBS+nK392+8/nc2RTTuJdzzYkJ6BwefvP4nMYEHBBVM88XGPK8Lz7z8AOPr+Qi7mPzBnx5NX8y49AAAAAAAA4L9gVVVVVVXlvwYAAAAAAOA/TlVZmZmZ6T96pClVVVXlv+lFSJtbSfK/wz8miysA8D8AAAAAAKD2PwAAAAAAAAAAAMi58oIs1r+AVjcoJLT6PAAAAAAAgPY/AAAAAAAAAAAACFi/vdHVvyD34NgIpRy9AAAAAABg9j8AAAAAAAAAAABYRRd3dtW/bVC21aRiI70AAAAAAED2PwAAAAAAAAAAAPgth60a1b/VZ7Ce5ITmvAAAAAAAIPY/AAAAAAAAAAAAeHeVX77Uv+A+KZNpGwS9AAAAAAAA9j8AAAAAAAAAAABgHMKLYdS/zIRMSC/YEz0AAAAAAOD1PwAAAAAAAAAAAKiGhjAE1L86C4Lt80LcPAAAAAAAwPU/AAAAAAAAAAAASGlVTKbTv2CUUYbGsSA9AAAAAACg9T8AAAAAAAAAAACAmJrdR9O/koDF1E1ZJT0AAAAAAID1PwAAAAAAAAAAACDhuuLo0r/YK7eZHnsmPQAAAAAAYPU/AAAAAAAAAAAAiN4TWonSvz+wz7YUyhU9AAAAAABg9T8AAAAAAAAAAACI3hNaidK/P7DPthTKFT0AAAAAAED1PwAAAAAAAAAAAHjP+0Ep0r922lMoJFoWvQAAAAAAIPU/AAAAAAAAAAAAmGnBmMjRvwRU52i8rx+9AAAAAAAA9T8AAAAAAAAAAACoq6tcZ9G/8KiCM8YfHz0AAAAAAOD0PwAAAAAAAAAAAEiu+YsF0b9mWgX9xKgmvQAAAAAAwPQ/AAAAAAAAAAAAkHPiJKPQvw4D9H7uawy9AAAAAACg9D8AAAAAAAAAAADQtJQlQNC/fy30nrg28LwAAAAAAKD0PwAAAAAAAAAAANC0lCVA0L9/LfSeuDbwvAAAAAAAgPQ/AAAAAAAAAAAAQF5tGLnPv4c8masqVw09AAAAAABg9D8AAAAAAAAAAABg3Mut8M6/JK+GnLcmKz0AAAAAAED0PwAAAAAAAAAAAPAqbgcnzr8Q/z9UTy8XvQAAAAAAIPQ/AAAAAAAAAAAAwE9rIVzNvxtoyruRuiE9AAAAAAAA9D8AAAAAAAAAAACgmsf3j8y/NISfaE95Jz0AAAAAAAD0PwAAAAAAAAAAAKCax/ePzL80hJ9oT3knPQAAAAAA4PM/AAAAAAAAAAAAkC10hsLLv4+3izGwThk9AAAAAADA8z8AAAAAAAAAAADAgE7J88q/ZpDNP2NOujwAAAAAAKDzPwAAAAAAAAAAALDiH7wjyr/qwUbcZIwlvQAAAAAAoPM/AAAAAAAAAAAAsOIfvCPKv+rBRtxkjCW9AAAAAACA8z8AAAAAAAAAAABQ9JxaUsm/49TBBNnRKr0AAAAAAGDzPwAAAAAAAAAAANAgZaB/yL8J+tt/v70rPQAAAAAAQPM/AAAAAAAAAAAA4BACiavHv1hKU3KQ2ys9AAAAAABA8z8AAAAAAAAAAADgEAKJq8e/WEpTcpDbKz0AAAAAACDzPwAAAAAAAAAAANAZ5w/Wxr9m4rKjauQQvQAAAAAAAPM/AAAAAAAAAAAAkKdwMP/FvzlQEJ9Dnh69AAAAAAAA8z8AAAAAAAAAAACQp3Aw/8W/OVAQn0OeHr0AAAAAAODyPwAAAAAAAAAAALCh4+Umxb+PWweQi94gvQAAAAAAwPI/AAAAAAAAAAAAgMtsK03Evzx4NWHBDBc9AAAAAADA8j8AAAAAAAAAAACAy2wrTcS/PHg1YcEMFz0AAAAAAKDyPwAAAAAAAAAAAJAeIPxxw786VCdNhnjxPAAAAAAAgPI/AAAAAAAAAAAA8B/4UpXCvwjEcRcwjSS9AAAAAABg8j8AAAAAAAAAAABgL9Uqt8G/lqMRGKSALr0AAAAAAGDyPwAAAAAAAAAAAGAv1Sq3wb+WoxEYpIAuvQAAAAAAQPI/AAAAAAAAAAAAkNB8ftfAv/Rb6IiWaQo9AAAAAABA8j8AAAAAAAAAAACQ0Hx+18C/9FvoiJZpCj0AAAAAACDyPwAAAAAAAAAAAODbMZHsv7/yM6NcVHUlvQAAAAAAAPI/AAAAAAAAAAAAACtuBye+vzwA8CosNCo9AAAAAAAA8j8AAAAAAAAAAAAAK24HJ76/PADwKiw0Kj0AAAAAAODxPwAAAAAAAAAAAMBbj1RevL8Gvl9YVwwdvQAAAAAAwPE/AAAAAAAAAAAA4Eo6bZK6v8iqW+g1OSU9AAAAAADA8T8AAAAAAAAAAADgSjptkrq/yKpb6DU5JT0AAAAAAKDxPwAAAAAAAAAAAKAx1kXDuL9oVi9NKXwTPQAAAAAAoPE/AAAAAAAAAAAAoDHWRcO4v2hWL00pfBM9AAAAAACA8T8AAAAAAAAAAABg5YrS8La/2nMzyTeXJr0AAAAAAGDxPwAAAAAAAAAAACAGPwcbtb9XXsZhWwIfPQAAAAAAYPE/AAAAAAAAAAAAIAY/Bxu1v1dexmFbAh89AAAAAABA8T8AAAAAAAAAAADgG5bXQbO/3xP5zNpeLD0AAAAAAEDxPwAAAAAAAAAAAOAbltdBs7/fE/nM2l4sPQAAAAAAIPE/AAAAAAAAAAAAgKPuNmWxvwmjj3ZefBQ9AAAAAAAA8T8AAAAAAAAAAACAEcAwCq+/kY42g55ZLT0AAAAAAADxPwAAAAAAAAAAAIARwDAKr7+RjjaDnlktPQAAAAAA4PA/AAAAAAAAAAAAgBlx3UKrv0xw1uV6ghw9AAAAAADg8D8AAAAAAAAAAACAGXHdQqu/THDW5XqCHD0AAAAAAMDwPwAAAAAAAAAAAMAy9lh0p7/uofI0RvwsvQAAAAAAwPA/AAAAAAAAAAAAwDL2WHSnv+6h8jRG/Cy9AAAAAACg8D8AAAAAAAAAAADA/rmHnqO/qv4m9bcC9TwAAAAAAKDwPwAAAAAAAAAAAMD+uYeeo7+q/ib1twL1PAAAAAAAgPA/AAAAAAAAAAAAAHgOm4Kfv+QJfnwmgCm9AAAAAACA8D8AAAAAAAAAAAAAeA6bgp+/5Al+fCaAKb0AAAAAAGDwPwAAAAAAAAAAAIDVBxu5l785pvqTVI0ovQAAAAAAQPA/AAAAAAAAAAAAAPywqMCPv5ym0/Z8Ht+8AAAAAABA8D8AAAAAAAAAAAAA/LCowI+/nKbT9nwe37wAAAAAACDwPwAAAAAAAAAAAAAQayrgf7/kQNoNP+IZvQAAAAAAIPA/AAAAAAAAAAAAABBrKuB/v+RA2g0/4hm9AAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO8/AAAAAAAAAAAAAIl1FRCAP+grnZlrxxC9AAAAAACA7z8AAAAAAAAAAACAk1hWIJA/0vfiBlvcI70AAAAAAEDvPwAAAAAAAAAAAADJKCVJmD80DFoyuqAqvQAAAAAAAO8/AAAAAAAAAAAAQOeJXUGgP1PX8VzAEQE9AAAAAADA7j8AAAAAAAAAAAAALtSuZqQ/KP29dXMWLL0AAAAAAIDuPwAAAAAAAAAAAMCfFKqUqD99JlrQlXkZvQAAAAAAQO4/AAAAAAAAAAAAwN3Nc8usPwco2EfyaBq9AAAAAAAg7j8AAAAAAAAAAADABsAx6q4/ezvJTz4RDr0AAAAAAODtPwAAAAAAAAAAAGBG0TuXsT+bng1WXTIlvQAAAAAAoO0/AAAAAAAAAAAA4NGn9b2zP9dO26VeyCw9AAAAAABg7T8AAAAAAAAAAACgl01a6bU/Hh1dPAZpLL0AAAAAAEDtPwAAAAAAAAAAAMDqCtMAtz8y7Z2pjR7sPAAAAAAAAO0/AAAAAAAAAAAAQFldXjO5P9pHvTpcESM9AAAAAADA7D8AAAAAAAAAAABgrY3Iars/5Wj3K4CQE70AAAAAAKDsPwAAAAAAAAAAAEC8AViIvD/TrFrG0UYmPQAAAAAAYOw/AAAAAAAAAAAAIAqDOce+P+BF5q9owC29AAAAAABA7D8AAAAAAAAAAADg2zmR6L8//QqhT9Y0Jb0AAAAAAADsPwAAAAAAAAAAAOAngo4XwT/yBy3OeO8hPQAAAAAA4Os/AAAAAAAAAAAA8CN+K6rBPzSZOESOpyw9AAAAAACg6z8AAAAAAAAAAACAhgxh0cI/obSBy2ydAz0AAAAAAIDrPwAAAAAAAAAAAJAVsPxlwz+JcksjqC/GPAAAAAAAQOs/AAAAAAAAAAAAsDODPZHEP3i2/VR5gyU9AAAAAAAg6z8AAAAAAAAAAACwoeTlJ8U/x31p5egzJj0AAAAAAODqPwAAAAAAAAAAABCMvk5Xxj94Ljwsi88ZPQAAAAAAwOo/AAAAAAAAAAAAcHWLEvDGP+EhnOWNESW9AAAAAACg6j8AAAAAAAAAAABQRIWNicc/BUORcBBmHL0AAAAAAGDqPwAAAAAAAAAAAAA566++yD/RLOmqVD0HvQAAAAAAQOo/AAAAAAAAAAAAAPfcWlrJP2//oFgo8gc9AAAAAAAA6j8AAAAAAAAAAADgijztk8o/aSFWUENyKL0AAAAAAODpPwAAAAAAAAAAANBbV9gxyz+q4axOjTUMvQAAAAAAwOk/AAAAAAAAAAAA4Ds4h9DLP7YSVFnESy29AAAAAACg6T8AAAAAAAAAAAAQ8Mb7b8w/0iuWxXLs8bwAAAAAAGDpPwAAAAAAAAAAAJDUsD2xzT81sBX3Kv8qvQAAAAAAQOk/AAAAAAAAAAAAEOf/DlPOPzD0QWAnEsI8AAAAAAAg6T8AAAAAAAAAAAAA3eSt9c4/EY67ZRUhyrwAAAAAAADpPwAAAAAAAAAAALCzbByZzz8w3wzK7MsbPQAAAAAAwOg/AAAAAAAAAAAAWE1gOHHQP5FO7RbbnPg8AAAAAACg6D8AAAAAAAAAAABgYWctxNA/6eo8FosYJz0AAAAAAIDoPwAAAAAAAAAAAOgngo4X0T8c8KVjDiEsvQAAAAAAYOg/AAAAAAAAAAAA+KzLXGvRP4EWpffNmis9AAAAAABA6D8AAAAAAAAAAABoWmOZv9E/t71HUe2mLD0AAAAAACDoPwAAAAAAAAAAALgObUUU0j/quka63ocKPQAAAAAA4Oc/AAAAAAAAAAAAkNx88L7SP/QEUEr6nCo9AAAAAADA5z8AAAAAAAAAAABg0+HxFNM/uDwh03riKL0AAAAAAKDnPwAAAAAAAAAAABC+dmdr0z/Id/GwzW4RPQAAAAAAgOc/AAAAAAAAAAAAMDN3UsLTP1y9BrZUOxg9AAAAAABg5z8AAAAAAAAAAADo1SO0GdQ/neCQ7DbkCD0AAAAAAEDnPwAAAAAAAAAAAMhxwo1x1D911mcJzicvvQAAAAAAIOc/AAAAAAAAAAAAMBee4MnUP6TYChuJIC69AAAAAAAA5z8AAAAAAAAAAACgOAeuItU/WcdkgXC+Lj0AAAAAAODmPwAAAAAAAAAAANDIU/d71T/vQF3u7a0fPQAAAAAAwOY/AAAAAAAAAAAAYFnfvdXVP9xlpAgqCwq9gEkAAABB8I8BC6gECgAAAAAAAAAZifTuMGrUARMAAAAUAAAAFQAAABYAAAAXAAAAGAAAABkAAAAaAAAAGwAAABwAAAAdAAAAHgAAAB8AAAAgAAAAIQAAACIAAAAjAAAAJAAAACUAAAAmAAAAJwAAACgAAAApAAAAKgAAACsAAAAsAAAALQAAAC4AAAAvAAAAMAAAADEAAAAyAAAAMwAAADQAAAA1AAAANgAAADcAAAA4AAAAOQAAADoAAAA7AAAAPAAAAD0AAAA+AAAAPwAAAEAAAABBAAAAQgAAAEMAAABEAAAARQAAAEYAAABHAAAASAAAAEkAAABKAAAASwAAAEwAAABNAAAATgAAAE8AAABQAAAAUQAAAFIAAABTAAAAVAAAAFUAAABWAAAAVwAAAFgAAABZAAAAWgAAAFsAAABcAAAAXQAAAF4AAABfAAAAYAAAAGEAAABiAAAAYwAAAGQAAABlAAAAZgAAAGcAAABoAAAAaQAAAGoAAABrAAAAbAAAAG0AAABuAAAAbwAAAHAAAAATAAAAAAAAAAUAAAAAAAAAAAAAAHsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAB9AAAA2FEAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBJAADQU1AAAEGYlAELAACOx4CAAARuYW1lAahG4gMABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAg1lbV9zZW5kX2ZyYW1lAxBlbV9jb25zb2xlX2RlYnVnBARleGl0BQtlbV90aW1lX25vdwYTZGV2c19kZXBsb3lfaGFuZGxlcgcgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkIIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAkYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3CjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAszZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQNNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkDhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQ8UamRfY3J5cHRvX2dldF9yYW5kb20QD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUC3NldFRlbXBSZXQwFRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxYRX193YXNtX2NhbGxfY3RvcnMXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGhlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGxRhcHBfZ2V0X2RldmljZV9jbGFzcxwIaHdfcGFuaWMdCGpkX2JsaW5rHgdqZF9nbG93HxRqZF9hbGxvY19zdGFja19jaGVjayAIamRfYWxsb2MhB2pkX2ZyZWUiDXRhcmdldF9pbl9pcnEjEnRhcmdldF9kaXNhYmxlX2lycSQRdGFyZ2V0X2VuYWJsZV9pcnElE2pkX3NldHRpbmdzX2dldF9iaW4mE2pkX3NldHRpbmdzX3NldF9iaW4nEmRldnNfcGFuaWNfaGFuZGxlcigQamRfZW1fc2VuZF9mcmFtZSkaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nKwpqZF9lbV9pbml0LA1qZF9lbV9wcm9jZXNzLQVkbWVzZy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95Mgxod19kZXZpY2VfaWQzDHRhcmdldF9yZXNldDQOdGltX2dldF9taWNyb3M1EmpkX3RjcHNvY2tfcHJvY2VzczYRYXBwX2luaXRfc2VydmljZXM3EmRldnNfY2xpZW50X2RlcGxveTgUY2xpZW50X2V2ZW50X2hhbmRsZXI5C2FwcF9wcm9jZXNzOgd0eF9pbml0Ow9qZF9wYWNrZXRfcmVhZHk8CnR4X3Byb2Nlc3M9F2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlPg5qZF93ZWJzb2NrX25ldz8Gb25vcGVuQAdvbmVycm9yQQdvbmNsb3NlQglvbm1lc3NhZ2VDEGpkX3dlYnNvY2tfY2xvc2VEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemVFFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGVGD3JvbGVtZ3JfcHJvY2Vzc0cQcm9sZW1ncl9hdXRvYmluZEgVcm9sZW1ncl9oYW5kbGVfcGFja2V0SRRqZF9yb2xlX21hbmFnZXJfaW5pdEoYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkSw1qZF9yb2xlX2FsbG9jTBBqZF9yb2xlX2ZyZWVfYWxsTRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kThJqZF9yb2xlX2J5X3NlcnZpY2VPE2pkX2NsaWVudF9sb2dfZXZlbnRQE2pkX2NsaWVudF9zdWJzY3JpYmVRFGpkX2NsaWVudF9lbWl0X2V2ZW50UhRyb2xlbWdyX3JvbGVfY2hhbmdlZFMQamRfZGV2aWNlX2xvb2t1cFQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlVRNqZF9zZXJ2aWNlX3NlbmRfY21kVhFqZF9jbGllbnRfcHJvY2Vzc1cOamRfZGV2aWNlX2ZyZWVYF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0WQ9qZF9kZXZpY2VfYWxsb2NaDmFnZ2J1ZmZlcl9pbml0Ww9hZ2didWZmZXJfZmx1c2hcEGFnZ2J1ZmZlcl91cGxvYWRdDmRldnNfYnVmZmVyX29wXhBkZXZzX3JlYWRfbnVtYmVyXw9kZXZzX2NyZWF0ZV9jdHhgCXNldHVwX2N0eGEKZGV2c190cmFjZWIPZGV2c19lcnJvcl9jb2RlYxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyZAljbGVhcl9jdHhlDWRldnNfZnJlZV9jdHhmDmRldnNfdHJ5X2FsbG9jZwhkZXZzX29vbWgJZGV2c19mcmVlaRdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc2oHdHJ5X3J1bmsMc3RvcF9wcm9ncmFtbBxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0bRxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3dyaXRlbhhkZXZpY2VzY3JpcHRtZ3JfZ2V0X2hhc2hvHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0cA5kZXBsb3lfaGFuZGxlcnETZGVwbG95X21ldGFfaGFuZGxlcnIWZGV2aWNlc2NyaXB0bWdyX2RlcGxveXMUZGV2aWNlc2NyaXB0bWdyX2luaXR0GWRldmljZXNjcmlwdG1ncl9jbGllbnRfZXZ1EWRldnNjbG91ZF9wcm9jZXNzdhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldHcTZGV2c2Nsb3VkX29uX21ldGhvZHgOZGV2c2Nsb3VkX2luaXR5EGRldnNfZmliZXJfeWllbGR6FmRldnNfZmliZXJfY29weV9wYXJhbXN7GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnwYZGV2c19maWJlcl9zZXRfd2FrZV90aW1lfRBkZXZzX2ZpYmVyX3NsZWVwfhtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx/GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzgAESZGV2c19maWJlcl9ieV9maWR4gQERZGV2c19maWJlcl9ieV90YWeCARBkZXZzX2ZpYmVyX3N0YXJ0gwEUZGV2c19maWJlcl90ZXJtaWFudGWEAQ5kZXZzX2ZpYmVyX3J1boUBE2RldnNfZmliZXJfc3luY19ub3eGAQpkZXZzX3BhbmljhwEVX2RldnNfcnVudGltZV9mYWlsdXJliAEPZGV2c19maWJlcl9wb2tliQEPamRfZ2NfdHJ5X2FsbG9jigEJdHJ5X2FsbG9jiwEHZGV2c19nY4wBD2ZpbmRfZnJlZV9ibG9ja40BC2pkX2djX3VucGlujgEKamRfZ2NfZnJlZY8BEmRldnNfbWFwX3RyeV9hbGxvY5ABFGRldnNfYXJyYXlfdHJ5X2FsbG9jkQEVZGV2c19idWZmZXJfdHJ5X2FsbG9jkgEPZGV2c19nY19zZXRfY3R4kwEOZGV2c19nY19jcmVhdGWUAQ9kZXZzX2djX2Rlc3Ryb3mVAQRzY2FulgETc2Nhbl9hcnJheV9hbmRfbWFya5cBFGRldnNfamRfZ2V0X3JlZ2lzdGVymAEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZJkBEGRldnNfamRfc2VuZF9jbWSaARNkZXZzX2pkX3NlbmRfbG9nbXNnmwENaGFuZGxlX2xvZ21zZ5wBEmRldnNfamRfc2hvdWxkX3J1bp0BF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hlngETZGV2c19qZF9wcm9jZXNzX3BrdJ8BFGRldnNfamRfcm9sZV9jaGFuZ2VkoAEUZGV2c19qZF9yZXNldF9wYWNrZXShARJkZXZzX2pkX2luaXRfcm9sZXOiARJkZXZzX2pkX2ZyZWVfcm9sZXOjARBkZXZzX3NldF9sb2dnaW5npAEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzpQEMZGV2c19tYXBfc2V0pgEMZGV2c19tYXBfZ2V0pwEKZGV2c19pbmRleKgBDmRldnNfaW5kZXhfc2V0qQERZGV2c19hcnJheV9pbnNlcnSqARJkZXZzX3JlZ2NhY2hlX2ZyZWWrARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsrAEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWStARNkZXZzX3JlZ2NhY2hlX2FsbG9jrgEUZGV2c19yZWdjYWNoZV9sb29rdXCvARFkZXZzX3JlZ2NhY2hlX2FnZbABF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlsQESZGV2c19yZWdjYWNoZV9uZXh0sgEPamRfc2V0dGluZ3NfZ2V0swEPamRfc2V0dGluZ3Nfc2V0tAENY29uc3VtZV9jaHVua7UBDXNoYV8yNTZfY2xvc2W2AQ9qZF9zaGEyNTZfc2V0dXC3ARBqZF9zaGEyNTZfdXBkYXRluAEQamRfc2hhMjU2X2ZpbmlzaLkBFGpkX3NoYTI1Nl9obWFjX3NldHVwugEVamRfc2hhMjU2X2htYWNfZmluaXNouwEOamRfc2hhMjU2X2hrZGa8AQ5kZXZzX3N0cmZvcm1hdL0BHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2O+AQ90c2FnZ19jbGllbnRfZXa/AQphZGRfc2VyaWVzwAENdHNhZ2dfcHJvY2Vzc8EBCmxvZ19zZXJpZXPCARN0c2FnZ19oYW5kbGVfcGFja2V0wwEUbG9va3VwX29yX2FkZF9zZXJpZXPEAQp0c2FnZ19pbml0xQEMdHNhZ2dfdXBkYXRlxgEWZGV2c192YWx1ZV9mcm9tX2RvdWJsZccBE2RldnNfdmFsdWVfZnJvbV9pbnTIARRkZXZzX3ZhbHVlX2Zyb21fYm9vbMkBF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyygERZGV2c192YWx1ZV90b19pbnTLARRkZXZzX3ZhbHVlX3RvX2RvdWJsZcwBEmRldnNfdmFsdWVfdG9fYm9vbM0BDmRldnNfaXNfYnVmZmVyzgEQZGV2c19idWZmZXJfZGF0Yc8BFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq0AERZGV2c192YWx1ZV90eXBlb2bRAQ9kZXZzX2lzX251bGxpc2jSAQtkZXZzX3ZlcmlmedMBFGRldnNfdm1fZXhlY19vcGNvZGVz1AEMZXhwcl9pbnZhbGlk1QEQZXhwcnhfbG9hZF9sb2NhbNYBEWV4cHJ4X2xvYWRfZ2xvYmFs1wERZXhwcjNfbG9hZF9idWZmZXLYAQ1leHByeF9saXRlcmFs2QERZXhwcnhfbGl0ZXJhbF9mNjTaAQ1leHByMF9yZXRfdmFs2wEMZXhwcjJfc3RyMGVx3AEXZXhwcjFfcm9sZV9pc19jb25uZWN0ZWTdAQ5leHByMF9wa3Rfc2l6Zd4BEWV4cHIwX3BrdF9ldl9jb2Rl3wEWZXhwcjBfcGt0X3JlZ19nZXRfY29kZeABCWV4cHIwX25hbuEBCWV4cHIxX2Fic+IBDWV4cHIxX2JpdF9ub3TjAQpleHByMV9jZWls5AELZXhwcjFfZmxvb3LlAQhleHByMV9pZOYBDGV4cHIxX2lzX25hbucBC2V4cHIxX2xvZ19l6AEJZXhwcjFfbmVn6QEJZXhwcjFfbm906gEMZXhwcjFfcmFuZG9t6wEQZXhwcjFfcmFuZG9tX2ludOwBC2V4cHIxX3JvdW5k7QENZXhwcjFfdG9fYm9vbO4BCWV4cHIyX2FkZO8BDWV4cHIyX2JpdF9hbmTwAQxleHByMl9iaXRfb3LxAQ1leHByMl9iaXRfeG9y8gEJZXhwcjJfZGl28wEIZXhwcjJfZXH0AQpleHByMl9pZGl29QEKZXhwcjJfaW11bPYBCGV4cHIyX2xl9wEIZXhwcjJfbHT4AQlleHByMl9tYXj5AQlleHByMl9taW76AQlleHByMl9tdWz7AQhleHByMl9uZfwBCWV4cHIyX3Bvd/0BEGV4cHIyX3NoaWZ0X2xlZnT+ARFleHByMl9zaGlmdF9yaWdodP8BGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkgAIJZXhwcjJfc3VigQIQZXhwcnhfbG9hZF9wYXJhbYICDGV4cHIwX25vd19tc4MCFmV4cHIxX2dldF9maWJlcl9oYW5kbGWEAhVleHByMF9wa3RfcmVwb3J0X2NvZGWFAhZleHByMF9wa3RfY29tbWFuZF9jb2RlhgIRZXhwcnhfc3RhdGljX3JvbGWHAhNleHByeF9zdGF0aWNfYnVmZmVyiAIQZXhwcngxX2dldF9maWVsZIkCC2V4cHIyX2luZGV4igITZXhwcjFfb2JqZWN0X2xlbmd0aIsCEWV4cHIxX2tleXNfbGVuZ3RojAIMZXhwcjFfdHlwZW9mjQIKZXhwcjBfbnVsbI4CDWV4cHIxX2lzX251bGyPAhBleHByMF9wa3RfYnVmZmVykAIKZXhwcjBfdHJ1ZZECC2V4cHIwX2ZhbHNlkgIPc3RtdDFfd2FpdF9yb2xlkwINc3RtdDFfc2xlZXBfc5QCDnN0bXQxX3NsZWVwX21zlQIPc3RtdDNfcXVlcnlfcmVnlgIOc3RtdDJfc2VuZF9jbWSXAhNzdG10NF9xdWVyeV9pZHhfcmVnmAIRc3RtdHgyX2xvZ19mb3JtYXSZAg1zdG10eDNfZm9ybWF0mgIWc3RtdDFfc2V0dXBfcGt0X2J1ZmZlcpsCDXN0bXQyX3NldF9wa3ScAgpzdG10NV9ibGl0nQILc3RtdHgyX2NhbGyeAg5zdG10eDNfY2FsbF9iZ58CDHN0bXQxX3JldHVybqACCXN0bXR4X2ptcKECDHN0bXR4MV9qbXBfeqICC3N0bXQxX3BhbmljowISc3RtdHgxX3N0b3JlX2xvY2FspAITc3RtdHgxX3N0b3JlX2dsb2JhbKUCEnN0bXQ0X3N0b3JlX2J1ZmZlcqYCEnN0bXR4MV9zdG9yZV9wYXJhbacCFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcqgCD3N0bXQwX2FsbG9jX21hcKkCEXN0bXQxX2FsbG9jX2FycmF5qgISc3RtdDFfYWxsb2NfYnVmZmVyqwIQc3RtdHgyX3NldF9maWVsZKwCD3N0bXQzX2FycmF5X3NldK0CEnN0bXQzX2FycmF5X2luc2VydK4CFWV4cHJ4X3N0YXRpY19mdW5jdGlvbq8CCmV4cHIyX2ltb2SwAgxleHByMV90b19pbnSxAgxzdG10NF9tZW1zZXSyAg9kZXZzX3ZtX3BvcF9hcmezAhNkZXZzX3ZtX3BvcF9hcmdfdTMytAITZGV2c192bV9wb3BfYXJnX2kzMrUCFGRldnNfdm1fcG9wX2FyZ19mdW5jtgITZGV2c192bV9wb3BfYXJnX2Y2NLcCFmRldnNfdm1fcG9wX2FyZ19idWZmZXK4AhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGG5AhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4ugIUZGV2c192bV9wb3BfYXJnX3JvbGW7AhNkZXZzX3ZtX3BvcF9hcmdfbWFwvAISamRfYWVzX2NjbV9lbmNyeXB0vQISamRfYWVzX2NjbV9kZWNyeXB0vgIMQUVTX2luaXRfY3R4vwIPQUVTX0VDQl9lbmNyeXB0wAIQamRfYWVzX3NldHVwX2tlecECDmpkX2Flc19lbmNyeXB0wgIQamRfYWVzX2NsZWFyX2tlecMCC2pkX3dzc2tfbmV3xAIUamRfd3Nza19zZW5kX21lc3NhZ2XFAhNqZF93ZWJzb2NrX29uX2V2ZW50xgIHZGVjcnlwdMcCDWpkX3dzc2tfY2xvc2XIAhBqZF93c3NrX29uX2V2ZW50yQIKc2VuZF9lbXB0ecoCEndzc2toZWFsdGhfcHJvY2Vzc8sCF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxlzAIUd3Nza2hlYWx0aF9yZWNvbm5lY3TNAhh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXTOAg9zZXRfY29ubl9zdHJpbmfPAhFjbGVhcl9jb25uX3N0cmluZ9ACD3dzc2toZWFsdGhfaW5pdNECE3dzc2tfcHVibGlzaF92YWx1ZXPSAhB3c3NrX3B1Ymxpc2hfYmlu0wIRd3Nza19pc19jb25uZWN0ZWTUAhN3c3NrX3Jlc3BvbmRfbWV0aG9k1QIPamRfY3RybF9wcm9jZXNz1gIVamRfY3RybF9oYW5kbGVfcGFja2V01wIMamRfY3RybF9pbml02AINamRfaXBpcGVfb3BlbtkCFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTaAg5qZF9pcGlwZV9jbG9zZdsCEmpkX251bWZtdF9pc192YWxpZNwCFWpkX251bWZtdF93cml0ZV9mbG9hdN0CE2pkX251bWZtdF93cml0ZV9pMzLeAhJqZF9udW1mbXRfcmVhZF9pMzLfAhRqZF9udW1mbXRfcmVhZF9mbG9hdOACEWpkX29waXBlX29wZW5fY21k4QIUamRfb3BpcGVfb3Blbl9yZXBvcnTiAhZqZF9vcGlwZV9oYW5kbGVfcGFja2V04wIRamRfb3BpcGVfd3JpdGVfZXjkAhBqZF9vcGlwZV9wcm9jZXNz5QIUamRfb3BpcGVfY2hlY2tfc3BhY2XmAg5qZF9vcGlwZV93cml0ZecCDmpkX29waXBlX2Nsb3Nl6AINamRfcXVldWVfcHVzaOkCDmpkX3F1ZXVlX2Zyb2506gIOamRfcXVldWVfc2hpZnTrAg5qZF9xdWV1ZV9hbGxvY+wCDWpkX3Jlc3BvbmRfdTjtAg5qZF9yZXNwb25kX3UxNu4CDmpkX3Jlc3BvbmRfdTMy7wIRamRfcmVzcG9uZF9zdHJpbmfwAhdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZPECC2pkX3NlbmRfcGt08gIdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzzAhdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcvQCGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXT1AhRqZF9hcHBfaGFuZGxlX3BhY2tldPYCFWpkX2FwcF9oYW5kbGVfY29tbWFuZPcCE2pkX2FsbG9jYXRlX3NlcnZpY2X4AhBqZF9zZXJ2aWNlc19pbml0+QIOamRfcmVmcmVzaF9ub3f6AhlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk+wIUamRfc2VydmljZXNfYW5ub3VuY2X8AhdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZf0CEGpkX3NlcnZpY2VzX3RpY2v+AhVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmf/AhpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZYADEmFwcF9nZXRfZndfdmVyc2lvboEDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWCAw1qZF9oYXNoX2ZudjFhgwMMamRfZGV2aWNlX2lkhAMJamRfcmFuZG9thQMIamRfY3JjMTaGAw5qZF9jb21wdXRlX2NyY4cDDmpkX3NoaWZ0X2ZyYW1liAMOamRfcmVzZXRfZnJhbWWJAxBqZF9wdXNoX2luX2ZyYW1ligMNamRfcGFuaWNfY29yZYsDE2pkX3Nob3VsZF9zYW1wbGVfbXOMAxBqZF9zaG91bGRfc2FtcGxljQMJamRfdG9faGV4jgMLamRfZnJvbV9oZXiPAw5qZF9hc3NlcnRfZmFpbJADB2pkX2F0b2mRAwtqZF92c3ByaW50ZpIDD2pkX3ByaW50X2RvdWJsZZMDEmpkX2RldmljZV9zaG9ydF9pZJQDDGpkX3NwcmludGZfYZUDC2pkX3RvX2hleF9hlgMUamRfZGV2aWNlX3Nob3J0X2lkX2GXAwlqZF9zdHJkdXCYAw5qZF9qc29uX2VzY2FwZZkDE2pkX2pzb25fZXNjYXBlX2NvcmWaAwlqZF9tZW1kdXCbAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlnAMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZ0DEWpkX3NlbmRfZXZlbnRfZXh0ngMKamRfcnhfaW5pdJ8DFGpkX3J4X2ZyYW1lX3JlY2VpdmVkoAMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uhAw9qZF9yeF9nZXRfZnJhbWWiAxNqZF9yeF9yZWxlYXNlX2ZyYW1lowMRamRfc2VuZF9mcmFtZV9yYXekAw1qZF9zZW5kX2ZyYW1lpQMKamRfdHhfaW5pdKYDB2pkX3NlbmSnAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjqAMPamRfdHhfZ2V0X2ZyYW1lqQMQamRfdHhfZnJhbWVfc2VudKoDC2pkX3R4X2ZsdXNoqwMQX19lcnJub19sb2NhdGlvbqwDBWR1bW15rQMIX19tZW1jcHmuAwdtZW1tb3ZlrwMGbWVtc2V0sAMKX19sb2NrZmlsZbEDDF9fdW5sb2NrZmlsZbIDDF9fc3RkaW9fc2Vla7MDDV9fc3RkaW9fd3JpdGW0Aw1fX3N0ZGlvX2Nsb3NltQMMX19zdGRpb19leGl0tgMKY2xvc2VfZmlsZbcDCV9fdG93cml0ZbgDCV9fZndyaXRleLkDBmZ3cml0ZboDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHO7AxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7wDFl9fcHRocmVhZF9tdXRleF91bmxvY2u9AwZfX2xvY2u+Aw5fX21hdGhfZGl2emVyb78DDl9fbWF0aF9pbnZhbGlkwAMDbG9nwQMFbG9nMTDCAwdfX2xzZWVrwwMGbWVtY21wxAMKX19vZmxfbG9ja8UDDF9fbWF0aF94Zmxvd8YDCmZwX2JhcnJpZXLHAwxfX21hdGhfb2Zsb3fIAwxfX21hdGhfdWZsb3fJAwRmYWJzygMDcG93ywMIY2hlY2tpbnTMAwtzcGVjaWFsY2FzZc0DBXJvdW5kzgMGc3RyY2hyzwMLX19zdHJjaHJudWzQAwZzdHJjbXDRAwZzdHJsZW7SAxJfX3dhc2lfc3lzY2FsbF9yZXTTAwhkbG1hbGxvY9QDBmRsZnJlZdUDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdYDBHNicmvXAwlfX3Bvd2lkZjLYAwlzdGFja1NhdmXZAwxzdGFja1Jlc3RvcmXaAwpzdGFja0FsbG9j2wMVZW1zY3JpcHRlbl9zdGFja19pbml03AMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZd0DGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XeAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTfAwxkeW5DYWxsX2ppamngAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp4QMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB3wMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
function em_console_debug(ptr){ console.debug(UTF8ToString(ptr, 1024)); }
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
