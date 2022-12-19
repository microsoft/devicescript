
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB1IGAgAAhYAN/f38AYAF/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAn98AGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAh/f39/f39/fwF/YAN/f3wAYAJ/fwF8YAN/fH8AYAJ/fgBgAn98AXxgAnx8AXxgA3x+fgF8YAJ8fwF8YAR/f35/AX5gBH9+f38BfwLMhYCAABYDZW52BWFib3J0AAUDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAQNlbnYNZW1fc2VuZF9mcmFtZQABA2VudhBlbV9jb25zb2xlX2RlYnVnAAEDZW52BGV4aXQAAQNlbnYLZW1fdGltZV9ub3cAEgNlbnYTZGV2c19kZXBsb3lfaGFuZGxlcgABA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABgNlbnYUamRfY3J5cHRvX2dldF9yYW5kb20AAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwAGFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEA2Vu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QQAQ5wEiBkGLKyAGGyEICyAFIAQvARI2AgggBSAINgIEIAVB0wo2AgBB4h8gBRAtIAQgASACIAMQeyAEIAAoApQBNgIAIAAgBDYClAEgBCAAKQOgAT4CFCAEIQYLIAVBIGokACAGC40DAQR/IwBBIGsiASQAIAAvARIhAiABIAAoAiwoAIgBIgM2AhhBiyshBAJAIANBJGooAgBBBHYgAk0NACABKAIYIgQgBCgCIGogAkEEdGovAQwhAiABIAQ2AhQgAUEUaiACQQAQ5wEiAkGLKyACGyEECyABIAAvARI2AgggASAENgIEIAFB4Bo2AgBB4h8gARAtAkAgACgCLCICKAKQASAARw0AAkAgAigCjAEiBEUNACACLQAGQQhxDQAgASAELwEAOwEYIAJBxwAgAUEYakECEGELIAJCADcCjAELAkAgACgCKCICRQ0AA0AgAigCBCEEIAIoAggoAiwhAwJAIAItABVBAXFFDQAgAyACKAIQEGgLIAMgAhBoIAQhAiAEDQALCyAAEJ0BAkACQAJAIAAoAiwiAygClAEiAiAARw0AIAMgACgCADYClAEMAQsDQCACIgRFDQIgBCgCACICIABHDQALIAQgACgCADYCAAsgAyAAEGggAUEgaiQADwtB5ylB9yFBzgBBtBMQqQMAC60BAQR/IwBBEGsiASQAAkAgACgCLCICLwEIDQAQkwMgAkEAKQOopgE3A6ABIAAQoQFFDQAgABCdASAAQQA2AhQgAEH//wM7AQ4gAiAANgKQASAAKAIoIgMoAggiBCADNgIoAkAgBCgCLCIELwEIDQAgBCADNgKMAQsCQCACLQAGQQhxDQAgASAAKAIoLwEAOwEIIAJBxgAgAUEIakECEGELIAIQ5gELIAFBEGokAAsSABCTAyAAQQApA6imATcDoAELkgMBCH8jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgCjAEiBA0AQQAhBAwBCyAELwEAIQQLIAAgBDsBCgJAAkAgA0Hg1ANHDQBB9h1BABAtDAELIAIgAzYCECACIARB//8DcTYCFEGDICACQRBqEC0LIAAgAzsBCAJAIANB4NQDRg0AIAAoAowBIgNFDQADQCAAKACIASIFKAIgIQYgAy8BACEEIAMoAgwiBygCACEIIAIgACgAiAEiCTYCGCAEIAhr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oQEQJEEAIAE2AqyiAUEAQcAANgKoogFBAEHkoQE2AqSiAUEAQdCiATYC4KEBQQBCq7OP/JGjs/DbADcCyKIBQQBC/6S5iMWR2oKbfzcCwKIBQQBC8ua746On/aelfzcCuKIBQQBC58yn0NbQ67O7fzcCsKIBAkADQAJAQQAoAqiiASICQcAARw0AIAFBwABJDQBBsKIBIAAQugEgAEHAAGohACABQUBqIgENAQwCC0EAKAKkogEgACABIAIgASACSRsiAhDHAxpBAEEAKAKoogEiAyACazYCqKIBIAAgAmohACABIAJrIQECQCADIAJHDQBBsKIBQeShARC6AUEAQcAANgKoogFBAEHkoQE2AqSiASABDQEMAgtBAEEAKAKkogEgAmo2AqSiASABDQALC0HgoQEQuwEaQQAhAkEAQQApA+iiATcDiKMBQQBBACkD4KIBNwOAowFBAEEAKQPYogE3A/iiAUEAQQApA9CiATcD8KIBQQBBADoA3KEBDAELQfCiASAAIAEQxwMaCwNAIAJB8KIBaiIBIAEtAABBNnM6AAAgAkEBaiICQcAARw0ADAILAAtBySdBDkG/ExCkAwALECMCQEEALQDcoQENAEEAQQE6ANyhARAkQQBCwICAgPDM+YTqADcCrKIBQQBBwAA2AqiiAUEAQeShATYCpKIBQQBB0KIBNgLgoQFBAEGZmoPfBTYCzKIBQQBCjNGV2Lm19sEfNwLEogFBAEK66r+q+s+Uh9EANwK8ogFBAEKF3Z7bq+68tzw3ArSiAUHwogEhAUHAACECAkADQAJAQQAoAqiiASIAQcAARw0AIAJBwABJDQBBsKIBIAEQugEgAUHAAGohASACQUBqIgINAQwCC0EAKAKkogEgASACIAAgAiAASRsiABDHAxpBAEEAKAKoogEiAyAAazYCqKIBIAEgAGohASACIABrIQICQCADIABHDQBBsKIBQeShARC6AUEAQcAANgKoogFBAEHkoQE2AqSiASACDQEMAgtBAEEAKAKkogEgAGo2AqSiASACDQALCw8LQcknQQ5BvxMQpAMAC7sGAQR/QeChARC7ARpBACEBIABBGGpBACkD6KIBNwAAIABBEGpBACkD4KIBNwAAIABBCGpBACkD2KIBNwAAIABBACkD0KIBNwAAQQBBADoA3KEBECMCQEEALQDcoQENAEEAQQE6ANyhARAkQQBCq7OP/JGjs/DbADcCyKIBQQBC/6S5iMWR2oKbfzcCwKIBQQBC8ua746On/aelfzcCuKIBQQBC58yn0NbQ67O7fzcCsKIBQQBCwAA3AqiiAUEAQeShATYCpKIBQQBB0KIBNgLgoQEDQCABQfCiAWoiAiACLQAAQeoAczoAACABQQFqIgFBwABHDQALQQBBwAA2AqyiAUHwogEhAkHAACEBAkADQAJAQQAoAqiiASIDQcAARw0AIAFBwABJDQBBsKIBIAIQugEgAkHAAGohAiABQUBqIgENAQwCC0EAKAKkogEgAiABIAMgASADSRsiAxDHAxpBAEEAKAKoogEiBCADazYCqKIBIAIgA2ohAiABIANrIQECQCAEIANHDQBBsKIBQeShARC6AUEAQcAANgKoogFBAEHkoQE2AqSiASABDQEMAgtBAEEAKAKkogEgA2o2AqSiASABDQALC0EgIQFBAEEAKAKsogFBIGo2AqyiASAAIQICQANAAkBBACgCqKIBIgNBwABHDQAgAUHAAEkNAEGwogEgAhC6ASACQcAAaiECIAFBQGoiAQ0BDAILQQAoAqSiASACIAEgAyABIANJGyIDEMcDGkEAQQAoAqiiASIEIANrNgKoogEgAiADaiECIAEgA2shAQJAIAQgA0cNAEGwogFB5KEBELoBQQBBwAA2AqiiAUEAQeShATYCpKIBIAENAQwCC0EAQQAoAqSiASADajYCpKIBIAENAAsLQeChARC7ARogAEEYakEAKQPoogE3AAAgAEEQakEAKQPgogE3AAAgAEEIakEAKQPYogE3AAAgAEEAKQPQogE3AABBAEIANwPwogFBAEIANwP4ogFBAEIANwOAowFBAEIANwOIowFBAEIANwOQowFBAEIANwOYowFBAEIANwOgowFBAEIANwOoowFBAEEAOgDcoQEPC0HJJ0EOQb8TEKQDAAviBgAgACABEL8BAkAgA0UNAEEAQQAoAqyiASADajYCrKIBA0ACQEEAKAKoogEiAEHAAEcNACADQcAASQ0AQbCiASACELoBIAJBwABqIQIgA0FAaiIDDQEMAgtBACgCpKIBIAIgAyAAIAMgAEkbIgAQxwMaQQBBACgCqKIBIgEgAGs2AqiiASACIABqIQIgAyAAayEDAkAgASAARw0AQbCiAUHkoQEQugFB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CSIIRQ0AIAEgCEF/ajoACQsCQCAMIAMtAAwgBS8BCBBeIg29Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASANOQMYIAFBADYCICABQThqIA05AwAgAUEwaiANOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEHAkACQEEAKAKwpgEiCyABQcQAaigCACIIa0EASA0AIAFBKGoiCyABKwMYIAggB2u4oiALKwMAoDkDAAwBCyABQShqIgggASsDGCALIAdruKIgCCsDAKA5AwAgCyEICyABIAg2AhQCQCABQThqKwMAIA1jRQ0AIAEgDTkDOAsCQCABQTBqKwMAIA1kRQ0AIAEgDTkDMAsgASANOQMYCyAAKAIIIghFDQAgAEEAKAKwpgEgCGo2AhwLIAEoAgAiAQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNAANAAkACQCABKAIMIggNAEEAIQwMAQsgCCADKAIEEOoDRSEMCwJAAkACQCABKAIEIAJHDQAgDA0CIAgQISADKAIEELEDIQgMAQsgDEUNASAIECFBACEICyABIAg2AgwLIAEoAgAiAQ0ACwsPC0HkK0GLJUGVAkHXCRCpAwALuQEBA39ByAAQICICQf8BOgAKIAIgATYCBCACIAAoAiQ2AgAgACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoArCmASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQTiIARQ0AIAIgACgCBBCxAzYCDAsgAkGzHhDPASACC+gGAgh/AnwjAEEQayIBJAACQAJAIAAoAghFDQBBACgCsKYBIAAoAhxrQQBODQELAkAgAEEYakGAwLgCEKYDRQ0AAkAgACgCJCICRQ0AA0ACQCACLQAJIAItAAhHDQAgAkEAOgAJCyACIAItAAk6AAggAigCACICDQALCyAAKAIoIgJFDQACQCACIAAoAgwiA08NACAAIAJB0A9qNgIoCyAAKAIoIANNDQAgACADNgIoCwJAIABBFGoiBEGAoAYQpgNFDQAgACgCJCICRQ0AA0ACQCACKAIEIgNFDQAgAi0ACUExSw0AIAFB+gE6AA8CQAJAIANBg8AAIAFBD2pBARBVIgNFDQAgBEEAKALwngFBgMAAajYCAAwBCyACIAEtAA86AAkLIAMNAgsgAigCACICDQALCwJAIAAoAiQiAkUNACAAQQxqIQUgAEEoaiEGA0ACQCACQcQAaigCACIDQQAoArCmAWtBf0oNAAJAAkACQCACQSBqIgQoAgANACACQoCAgICAgID8/wA3AxgMAQsgAisDGCADIAIoAhRruKIhCSACQShqKwMAIQoCQAJAIAIoAgwiAw0AQQAhBwwBCyADEOsDIQcLIAkgCqAhCSAHQSlqECAiA0EgaiAEQSBqKQMANwMAIANBGGogBEEYaikDADcDACADQRBqIARBEGopAwA3AwAgA0EIaiAEQQhqKQMANwMAIAMgBCkDADcDACAHQShqIQQCQCACKAIMIghFDQAgA0EoaiAIIAcQxwMaCyADIAkgAigCRCACQcAAaigCAGu4ozkDCCAALQAEQZABIAMgBBDAAyIEDQECQCACLAAKIgdBf0cNACAAQRFBECACKAIMG2otAAAhBwsCQCAHRQ0AIAIoAgwgAigCBCADIAAoAiAoAggRBgBFDQAgAkHFHhDPAQsgAxAhIAQNAgsgAkHAAGogAigCRCIDNgIAAkAgAigCECIEDQAgBSEEAkAgAC0AEkUNACAGIQQgBigCAA0AIAZBiCc2AgAgBiEECyAEKAIAIQQLIAJBADYCICACIAM2AhQgAiAEIANqNgJEIAJBOGogAisDGCIJOQMAIAJBMGogCTkDACACQShqQgA3AwAMAQsgAxAhCyACKAIAIgINAAsLIAFBEGokAA8LQZgMQQAQLRAzAAvEAQECfyMAQcAAayICJAACQAJAIAAoAgQiA0UNACACQTtqIANBACADLQAEa0EMbGpBZGopAwAQrQMgACgCBC0ABCEDAkAgACgCDCIARQ0AIAIgATYCLCACIAM2AiggAiAANgIgIAIgAkE7ajYCJEHJESACQSBqEC0MAgsgAiABNgIYIAIgAzYCFCACIAJBO2o2AhBBrxEgAkEQahAtDAELIAAoAgwhACACIAE2AgQgAiAANgIAQbkQIAIQLQsgAkHAAGokAAuaBQICfwF8AkACQAJAAkACQAJAIAEvAQ5BgH9qDgYABAQBAgMECwJAIAAoAiQiAUUNAANAIAAgASgCACICNgIkIAEoAgwQISABECEgAiEBIAINAAsLIABBADYCKA8LQQAhAgJAIAEtAAwiA0EJSQ0AIAAgAUEYaiADQXhqENEBIQILIAJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhAAJAAkBBACgCsKYBIgMgAkHEAGooAgAiAWtBAEgNACACQShqIgMgAisDGCABIABruKIgAysDAKA5AwAMAQsgAkEoaiIBIAIrAxggAyAAa7iiIAErAwCgOQMAIAMhAQsgAiABNgIUAkAgAkE4aisDACAEY0UNACACIAQ5AzgLAkAgAkEwaisDACAEZEUNACACIAQ5AzALIAIgBDkDGA8LQQAhAgJAIAEtAAwiA0EFSQ0AIAAgAUEUaiADQXxqENEBIQILIAJFDQIgAiABKAIQIgFBgLiZKSABQYC4mSlJGzYCEA8LQQAhAgJAIAEtAAwiA0ECSQ0AIAAgAUERaiADQX9qENEBIQILIAJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUHQOBCMA0H/fmoOBAACAgECCyAAIAAoAgwiAUGAuJkpIAFBgLiZKUkbNgIMDwsgACAAKAIIIgFBgLiZKSABQYC4mSlJGyIBNgIIIAFFDQAgAEEAKAKwpgEgAWo2AhwLC/oBAQR/IAJBAWohAyABQY0rIAEbIQQCQCAAKAIkIgFFDQADQAJAIAEoAgwiBUUNACAFIAQgAxDdA0UNAgsgASgCACIBDQALCwJAIAENAEHIABAgIgFB/wE6AAogAUEANgIEIAEgACgCJDYCACAAIAE2AiQgAUKAgICAgICA/P8ANwMYIAFBACgCsKYBIgY2AkACQCABKAIQIgUNAAJAAkAgAC0AEkUNACAAQShqIQUgACgCKA0BIAVBiCc2AgAMAQsgAEEMaiEFCyAFKAIAIQULIAEgBSAGajYCRCABQbMeEM8BIAEgAxAgIgU2AgwgBSAEIAIQxwMaCyABCzgBAX9BAEHgOBCRAyIBNgKwowEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQRAgARBQC8oCAQN/AkBBACgCsKMBIgJFDQAgAiAAIAAQ6wMQ0QEhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAAgATkDGCAAQQA2AiAgAEE4aiABOQMAIABBMGogATkDACAAQShqQgA3AwAgACAAQcAAaigCADYCFAsgACAAKAIgQQFqNgIgIAAoAhQhAwJAAkBBACgCsKYBIgQgAEHEAGooAgAiAmtBAEgNACAAQShqIgQgACsDGCACIANruKIgBCsDAKA5AwAMAQsgAEEoaiICIAArAxggBCADa7iiIAIrAwCgOQMAIAQhAgsgACACNgIUAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLpgICAn4EfwJAIAG9IgJC////////////AINCgYCAgICAgPj/AFQNACAAQoCAgICAgID8/wA3AwAPCwJAIAJCIIgiAyAChKcNACAAQoCAgIBwNwMADwsCQCADpyIEQRR2Qf8PcSIFQf8HSQ0AIAKnIQYCQAJAIAVBkwhLDQAgBg0CAkAgBUGTCEYNACAEQf//P3EgBUGNeGp0DQMLIARB//8/cUGAgMAAckGTCCAFa3YhBQwBCwJAIAVBnghJDQAgBg0CIARBgICAj3xHDQIgAEKAgICAeDcDAA8LIAYgBUHtd2oiB3QNASAEQf//P3FBgIDAAHIgB3QgBkGzCCAFa3ZyIQULIABBfzYCBCAAIAVBACAFayACQn9VGzYCAA8LIAAgATkDAAsQACAAIAE2AgAgAEF/NgIECyAAIABCwICAgJCAgPj/AEKBgICAkICA+P8AIAEbNwMAC0MAAkAgAw0AIABCADcDAA8LAkAgAkHAAXFFDQAgACADNgIAIAAgAkGAgMD/B2o2AgQPC0GQM0GpJUHSAEG2EhCpAwALagIBfwF8AkAgACgCBCIBQX9HDQAgACgCAA8LAkAgAUGAgGBxQYCAwP8HRw0AIAApAwBQIAFBgYDA/wdGciAAKAIAQT9LcQ8LAkAgACsDACICmUQAAAAAAADgQWNFDQAgAqoP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IAJBGGoiAyACEM0CNgIAIAIgAhDNAiIENgIQIAAgBCADKAIAbBDVAQu5AQICfwF8IwBBIGsiAyQAIANBGGogAhDLAiACQRhqIgQgAykDGDcDACADQRhqIAIQywIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQ2QE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDZASIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhDWASADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQywIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEMsCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqENkBOQMgIAMgBCkDADcDCCACQShqIANBCGoQ2QEiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQ1gEgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACEMsCIAJBGGoiBCADKQMYNwMAIANBGGogAhDLAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDZATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQ2QE5AwBB+DghByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAQgBSACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACEMsCIAJBGGoiBCADKQMYNwMAIANBGGogAhDLAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDZATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQ2QE5AwBB+DghByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8A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AkEMakECENECIQQCQCABQcwBai0AACADayIFQQFIDQAgASADakHQAWogBCACKAIMIgEgBSABIAVJGxDHAxoLIAJBEGokAAuaAQEHfyMAQRBrIgIkACABEMwCIQMgARDMAiEEIAEgAkEMakECENECIQUgARDMAiEGIAEgAkEIakEBENECIQcCQCACKAIMIgEgBE0NACACIAEgBGsiATYCDCACKAIIIgggBk0NACACIAggBmsiCDYCCCAHIAZqIAUgBGogCCABIAMgASADSRsiASAIIAFJGxDHAxoLIAJBEGokAAuEAQEFfyMAQRBrIgIkACABEM4CIQMgARDMAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgEgACgCDC8BCCIGSw0AIAEgBGogBk0NAQsgAkEIaiAFQfEAEIkBDAELIAAoAgggAyAAIAFBA3RqQRhqIAQQewsgAkEQaiQAC8IBAQd/IwBBEGsiAiQAIAEQzAIhAyABEM4CIQQgARDMAiEFAkACQCADQXtqQXtLDQAgAkEIaiABQYkBEIkBDAELIAAoAggoAiwiBi8BCA0AAkACQCAFQRBLDQAgASgCNCIHIAAoAgwvAQgiCEsNACAHIAVqIAhNDQELIAJBCGogBkHxABCJAQwBCyABIAQgACAHQQN0akEYaiAFIAMQhAEhASAAKAIIIAE1AhhCgICAgKCAgPj/AIQ3AyALIAJBEGokAAszAQJ/IwBBEGsiAiQAIAAoAgghAyACQQhqIAEQywIgAyACKQMINwMgIAAQfiACQRBqJAALUgECfyMAQRBrIgIkAAJAAkAgACgCDCgCACABKAI0IAEvATBqIgNKDQAgAyAALwECTg0AIAAgAzsBAAwBCyACQQhqIAFB9AAQiQELIAJBEGokAAt0AQN/IwBBIGsiAiQAIAJBGGogARDLAiACIAIpAxg3AwggAkEIahDaASEDAkACQCAAKAIMKAIAIAEoAjQgAS8BMGoiBEoNACAEIAAvAQJODQAgAw0BIAAgBDsBAAwBCyACQRBqIAFB9QAQiQELIAJBIGokAAsMACABIAEQzAIQiAELVQECfyMAQRBrIgIkACACQQhqIAEQywICQAJAIAEoAjQiAyAAKAIMLwEISQ0AIAIgAUH2ABCJAQwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtWAQJ/IwBBEGsiAiQAIAJBCGogARDLAgJAAkAgASgCNCIDIAEoAogBLwEMSQ0AIAIgAUH4ABCJAQwBCyABKAIAIANBA3RqIAIpAwg3AwALIAJBEGokAAtWAQN/IwBBIGsiAiQAIAJBGGogARDLAiABEMwCIQMgARDMAiEEIAJBEGogAUEBENACIAIgAikDEDcDACACQQhqIAAgBCADIAIgAkEYahBdIAJBIGokAAtmAQJ/IwBBEGsiAiQAIAJBCGogARDLAgJAAkAgASgCNCIDIAAoAgwtAApJDQAgAiABQfcAEIkBDAELAkAgAyAALQAUSQ0AIAAQegsgACgCECADQQN0aiACKQMINwMACyACQRBqJAALhQEBAX8jAEEgayICJAAgAkEYaiABEMsCIAAoAghBACkDiDk3AyAgAiACKQMYNwMIAkAgAkEIahDhAQ0AAkAgAigCHEGCgMD/B0YNACACQRBqIAFB+wAQiQEMAQsgASACKAIYEIMBIgFFDQAgACgCCEEAKQPwODcDICABEIUBCyACQSBqJAALSgECfyMAQRBrIgIkAAJAIAEoArgBEJMBIgMNACABQQwQZwsgACgCCCEAIAJBCGogAUGDASADENcBIAAgAikDCDcDICACQRBqJAALWQEDfyMAQRBrIgIkACABEMwCIQMCQCABKAK4ASADEJQBIgQNACABIANBA3RBEGoQZwsgACgCCCEDIAJBCGogAUGDASAEENcBIAMgAikDCDcDICACQRBqJAALVgEDfyMAQRBrIgIkACABEMwCIQMCQCABKAK4ASADEJUBIgQNACABIANBDGoQZwsgACgCCCEDIAJBCGogAUGDASAEENcBIAMgAikDCDcDICACQRBqJAALWQECfyMAQSBrIgIkACACQRhqIAEQywIgAkEQaiABEMsCAkAgAUEBENUCIgNFDQAgAiACKQMQNwMIIAIgAikDGDcDACABIAMgAkEIaiACEKoBCyACQSBqJAALZwECfyMAQTBrIgIkACACQShqIAEQywIgARDMAiEDIAJBIGogARDLAiACIAIpAyA3AxAgAiACKQMoNwMIAkAgASACQRBqIAMgAkEIahCuAUUNACACQRhqIAFBhQEQiQELIAJBMGokAAuJAQEEfyMAQSBrIgIkACABEM0CIQMgARDMAiEEIAJBGGogARDLAiACIAIpAxg3AwgCQAJAIAEgAkEIahDfASIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQAgASAFIAQgAxCvAUUNASACQRBqIAFBigEQiQEMAQsgAkEQaiABQYsBEIkBCyACQSBqJAALXwECfyMAQRBrIgMkAAJAAkAgAigCNCIEIAIoAIgBQSRqKAIAQQR2SQ0AIANBCGogAkHyABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYaAwP8HNgIECyADQRBqJAALQQECfyACQRhqIgMgAhDNAjYCACACIAIQzQIiBDYCEAJAIAMoAgAiAg0AIABBACkD8Dg3AwAPCyAAIAQgAm8Q1QELDAAgACACEM0CENUBC2QBAn8jAEEQayIDJAAgAigCNCEEIAMgAigCiAE2AgQCQAJAIANBBGogBBDkAQ0AIANBCGogAkHwABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAAXIiBBDkAQ0AIANBCGogAkHwABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAAnIiBBDkAQ0AIANBCGogAkHwABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAA3IiBBDkAQ0AIANBCGogAkHwABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALSwECfyMAQRBrIgIkACABIAJBDGpBABDRAiEDAkAgAS8BCA0AIAAoAgghACACIAEgAyACKAIMEMcBIAAgAikDADcDIAsgAkEQaiQACz4BAX8CQCABLQAyIgINACAAIAFB7AAQiQEPCyABIAJBf2oiAjoAMiAAIAEgAkH/AXFBA3RqQThqKQMANwMAC2gBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCJAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARDYASEAIAFBEGokACAAC2gBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCJAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARDYASEAIAFBEGokACAAC4IBAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsCQAJAIAEoAgxBhoDA/wdHDQAgASgCCCEADAELIAEgAEGIARCJAUEAIQALIAFBEGokACAAC2oCAn8BfCMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABENkBIQMgAUEQaiQAIAML8QEBAn8jAEEwayIDJAACQAJAIAEtADIiBA0AIANBKGogAUHsABCJAQwBCyABIARBf2oiBDoAMiADIAEgBEH/AXFBA3RqQThqKQMANwMoCyADIAMpAyg3AxgCQAJAIAEgA0EYahDbAQ0AAkAgAkECcUUNACADIAMpAyg3AxAgASADQRBqEMMBDQELIANBIGogAUH9ABCJASAAQQApA6A5NwMADAELAkAgAkEBcUUNACADIAMpAyg3AwggASADQQhqENwBDQAgA0EgaiABQZQBEIkBIABBACkDoDk3AwAMAQsgACADKQMoNwMACyADQTBqJAALdgEBfyMAQSBrIgMkACADQRhqIAAgAhDQAgJAAkAgAkECcUUNACADIAMpAxg3AxAgACADQRBqEMMBRQ0AIAMgAykDGDcDCCAAIANBCGogARDEASEADAELIAMgAykDGDcDACAAIAMgARDdASEACyADQSBqJAAgAAujAQECfyMAQSBrIgIkAAJAAkAgAC0AMiIDDQAgAkEYaiAAQewAEIkBDAELIAAgA0F/aiIDOgAyIAIgACADQf8BcUEDdGpBOGopAwA3AxgLIAIgAikDGDcDCAJAAkAgACACQQhqEMMBDQAgAkEQaiAAQZMBEIkBIAFBADYCAEGGNCEADAELIAIgAikDGDcDACAA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gHghAQsgACADIAEQ9wIL9wEAAkAgAUEISQ0AIAAgASACtxD2Ag8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQbshQa4BQawrEKQDAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALswMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhD4ArchAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLQYCAgIB4IQEgA0QAAAAAAADgwWMNAkH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQbshQcoBQcArEKQDAAtBgICAgHghAQsgAQudAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPgCtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAwvUAQICfwF+QX4hAgJAAkAgAS0ADEEMSQ0AIAEpAhAiBFANACABQRhqLwEAIQMQIg0BAkAgAC0ABkUNAAJAAkACQEEAKAKMpgEiAiAARw0AQYymASEBDAELA0AgAiIBRQ0CIAEoAgAiAiAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQyQMaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBDcCACAAIANBB3Q7AQRBACECIABBACgCjKYBNgIAQQAgADYCjKYBCyACDwtBsSZBK0GJFRCkAwAL0QECAn8BfkF+IQICQAJAIAEtAAxBAkkNACABKQIEIgRQDQAgAS8BECEDECINAQJAIAAtAAZFDQACQAJAAkBBACgCjKYBIgIgAEcNAEGMpgEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEMkDGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAQ3AgAgACADQQd0OwEEQQAhAiAAQQAoAoymATYCAEEAIAA2AoymAQsgAg8LQbEmQStBiRUQpAMAC70CAQN/AkACQAJAIAAtAA1BP0cNACAALQADQQFxDQAQIg0BQQAoAoymASIBRQ0AA0ACQCABLQAHRQ0AIAAvAQ4gAS8BDEcNACABQRBqKQIAIAApAgRSDQAgAUEAOgAHIAFBDGoiAhCiAwJAAkAgAS0ABkGAf2oOAwECAAILAkACQAJAQQAoAoymASIDIAFHDQBBjKYBIQIMAQsDQCADIgJFDQIgAigCACIDIAFHDQALCyACIAEoAgA2AgALIAFBAEGIAhDJAxoMAQsgAUEBOgAGAkAgAUEAQQBBIBD9Ag0AIAFBggE6AAYgAS0ABw0FIAIQoAMgAUEBOgAHIAFBACgC8J4BNgIIDAELIAFBgAE6AAYLIAEoAgAiAQ0ACwsPC0GxJkHJAEGADRCkAwALQZYsQbEmQfEAQYQXEKkDAAvcAQECf0F/IQRBACEFAkACQAJAIAAtAAZBf2oOCAEAAAAAAAACAAtBfiEEDAELQQEhBCAALQAHDQACQCACIABBDmotAABqQQRqQe0BTw0AQQAhBEEBIQUMAQsgAEEMahCgA0EBIQQgAEEBOgAHQQAhBSAAQQAoAvCeATYCCAsCQAJAIAVFDQAgAEEMakE+IAAvAQQgA3IgAhCjAyIERQ0BIAQgASACEMcDGiAAIAAvAQQiBEEBakEfcSAEQeD/A3FyOwEEQQAhBAsgBA8LQdspQbEmQYwBQdcIEKkDAAvPAQEDfwJAECINAAJAQQAoAoymASIARQ0AA0ACQCAALQAHIgFFDQBBACgC8J4BIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqEL4DIQFBACgC8J4BIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgANAAsLDwtBsSZB2gBByw0QpAMAC2sBAX9BfyECAkACQAJAIAAtAAZBf2oOCAEAAAAAAAACAAtBfg8LQQEhAiAALQAHDQBBACECIAEgAEEOai0AAGpBBGpB7QFJDQAgAEEMahCgA0EBIQIgAEEBOgAHIABBACgC8J4BNgIICyACCw0AIAAgASACQQAQ/QIL/gEBAn9BACEBAkACQAJAAkACQAJAAkAgAC0ABiICDgkFAgMDAwMDAwEACyACQYB/ag4DAQIDAgsCQAJAAkBBACgCjKYBIgIgAEcNAEGMpgEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEMkDGkEADwsgAEEBOgAGAkAgAEEAQQBBIBD9AiIBDQAgAEGCAToABiAALQAHDQQgAEEMahCgAyAAQQE6AAcgAEEAKALwngE2AghBAQ8LIABBgAE6AAYgAQ8LQbEmQbwBQYIbEKQDAAtBASEBCyABDwtBlixBsSZB8QBBhBcQqQMAC48CAQR/AkACQAJAAkAgAS0AAkUNABAjIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCAALwEETQ0CIAIgBUkNAUF/IQNBACEEDAMLIAQgBUkNAUF+IQNBACEEDAILIAAgAzsBBiACIQQLIAAgBDsBAkEAIQNBASEECwJAIARFDQAgACAALwECaiACa0EIaiABIAIQxwMaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECQgAw8LQZYmQR1B2hYQpAMAC0GBGkGWJkE2QdoWEKkDAAtBlRpBliZBN0HaFhCpAwALQagaQZYmQThB2hYQqQMACzkBAn9BACEBAkAgAC8BACICIAAvAQJGDQACQCACIAAvAQZJDQAgAEEIag8LIAAgAmpBCGohAQsgAQusAQEDfxAjQQAhAQJAIAAvAQAiAiAALwECRg0AAkAgAiAALwEGSQ0AIABBCGohAQwBCyAAIAJqQQhqIQELAkACQCABRQ0AIAEtAAJBD2pB/ANxIQECQCACIAAvAQYiA0kNACACIANHDQIgACABOwEAIAAgAC8BBDsBBhAkDwsgACACIAFqOwEAECQPC0HPKUGWJkHMAEH8CxCpAwALQfcYQZYmQc8AQfwLEKkDAAsiAQF/IABBCGoQICIBIAA7AQQgASAAOwEGIAFBADYBACABCzMBAX8jAEEQayICJAAgAiABOgAPIAAtAA0gAC8BDiACQQ9qQQEQwAMhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATsBDiAALQANIAAvAQ4gAkEOakECEMADIQAgAkEQaiQAIAALMwEBfyMAQRBrIgIkACACIAE2AgwgAC0ADSAALwEOIAJBDGpBBBDAAyEAIAJBEGokACAACzsAAkACQCABRQ0AIAEtAAANAQsgAC0ADSAALwEOQYY0QQAQwAMPCyAALQANIAAvAQ4gASABEOsDEMADC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBDAAyECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABCgAyAAEL4DCxoAAkAgACABIAIQjQMiAA0AIAEQigMaCyAAC+gFARB/IwBBEGsiAyQAQQAhBAJAAkAgAS8BDiIFQQx2IgZBf2pBAUsNAAJAIAZBAkcNACABLQAMRQ0BCyAFQf8fcSIHQf8dSw0AAkAgBkECRw0AIAVBgB5xQYACRg0BCyACLwEAIgVB8R9GDQBBACAHayEIIAFBEGohCUEAIQpBACELQQAhDANAAkACQCAFQf//A3EiBUEMdiINQQlGDQAgDUGQwQBqLQAAIQQMAQsgAiAMQQFqIgxBAXRqLwEAIQQLIARFDQICQCAFQYDAA3FBgIACRg0AIAtB/wFxIQ5BACELIAogDkEAR2pBAyAEQX9qIARBA0sbIgpqIApBf3NxIQoLAkACQCAFQf8fcSAHRyIPDQAgACAKaiEQAkAgBkEBRw0AAkAgDUEIRw0AIAMgEC0AACALQf8BcXZBAXE6AA8gAS0ADSABLwEOIANBD2pBARDAAxogCCERDAMLIBAhDSAEIQ4CQCAFQYDAAkkNAANAQQAhESAOIgVFDQQgBUF/aiEOIA0tAAAhEiANQQFqIQ0gEkUNAAsgBUUNAwsgAS0ADSABLwEOIBAgBBDAAxogCCERDAILAkAgDUEIRw0AQQEgC0H/AXF0IQQgEC0AACEFAkAgAS0AEEUNACAQIAUgBHI6AAAgByERDAMLIBAgBSAEQX9zcToAACAHIREMAgsCQCAEIAEtAAwiDUsNACAQIAkgBBDHAxogByERDAILIBAgCSANEMcDIQ5BACENAkAgBUH/nwFLDQAgBUGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQ0LIA4gAS0ADCIFaiANIAQgBWsQyQMaIAchEQwBCwJAIA1BCEcNAEEAIAtBAWoiBCAEQf8BcUEIRiIEGyELIAogBGohCgwBCyAKIARqIQoLAkAgD0UNAEEAIQQgAiAMQQFqIgxBAXRqLwEAIgVB8R9GDQIMAQsLIBEhBAsgA0EQaiQAIAQPC0GWIkHdAEGeEhCkAwALlwIBBH8gABCPAyAAEPwCIAAQ8wIgABBYAkACQCAALQADQQFxDQAgAC0ADQ0BIAAvAQ4NASAALQAMQQRJDQEgAEERai0AAEEIcUUNAUEAQQAoAvCeATYCmKYBQYACEB5BAC0A8JQBEB0PCwJAIAApAgQQnQNSDQAgABCQAyAALQANIgFBAC0AkKYBTw0BQQAoApSmASABQQJ0aigCACIBIAAgASgCACgCDBECAA8LIAAtAANBBHFFDQBBAC0AkKYBRQ0AIAAoAgQhAkEAIQEDQAJAQQAoApSmASABQQJ0aigCACIDKAIAIgQoAgAgAkcNACAAIAE6AA0gAyAAIAQoAgwRAgALIAFBAWoiAUEALQCQpgFJDQALCwsCAAsCAAtmAQF/AkBBAC0AkKYBQSBJDQBBliJBrgFB8BwQpAMACyAALwEEECAiASAANgIAIAFBAC0AkKYBIgA6AARBAEH/AToAkaYBQQAgAEEBajoAkKYBQQAoApSmASAAQQJ0aiABNgIAIAELhgIBBH8jAEGAAWsiACQAQQBBADoAkKYBQQAgADYClKYBQQAQNKciATYC8J4BAkACQCABQQAoAqSmASICayIDQf//AEsNACADQekHSQ0BQQBBACkDqKYBIAEgAmtBl3hqIgNB6AduIgJBAWqtfDcDqKYBIAMgAkHoB2xrQQFqIQMMAQtBAEEAKQOopgEgA0HoB24iAq18NwOopgEgAyACQegHbGshAwtBACABIANrNgKkpgFBAEEAKQOopgE+ArCmARDxAhA2QQBBADoAkaYBQQBBAC0AkKYBQQJ0ECAiAzYClKYBIAMgAEEALQCQpgFBAnQQxwMaQQAQND4CmKYBIABBgAFqJAALpAEBA39BABA0pyIANgLwngECQAJAIABBACgCpKYBIgFrIgJB//8ASw0AIAJB6QdJDQFBAEEAKQOopgEgACABa0GXeGoiAkHoB24iAa18QgF8NwOopgEgAiABQegHbGtBAWohAgwBC0EAQQApA6imASACQegHbiIBrXw3A6imASACIAFB6AdsayECC0EAIAAgAms2AqSmAUEAQQApA6imAT4CsKYBCxMAQQBBAC0AnKYBQQFqOgCcpgELvgEBBn8jACIAIQEQH0EAIQIgAEEALQCQpgEiA0ECdEEPakHwD3FrIgQkAAJAIANFDQBBACgClKYBIQUDQCAEIAJBAnQiAGogBSAAaigCACgCACgCADYCACACQQFqIgIgA0cNAAsLAkBBAC0AnaYBIgJBD08NAEEAIAJBAWo6AJ2mAQsgBEEALQCcpgFBEHRBAC0AnaYBckGAngRqNgIAAkBBAEEAIAQgA0ECdBDAAw0AQQBBADoAnKYBCyABJAALJQEBf0EBIQECQCAALQADQQVxQQFHDQAgACkCBBCdA1EhAQsgAQvVAQECfwJAQaCmAUGgwh4QpgNFDQAQlQMLAkACQEEAKAKYpgEiAEUNAEEAKALwngEgAGtBgICAf2pBAEgNAQtBAEEANgKYpgFBkQIQHgtBACgClKYBKAIAIgAgACgCACgCCBEBAAJAQQAtAJGmAUH+AUYNAEEBIQACQEEALQCQpgFBAU0NAANAQQAgADoAkaYBQQAoApSmASAAQQJ0aigCACIBIAEoAgAoAggRAQAgAEEBaiIAQQAtAJCmAUkNAAsLQQBBADoAkaYBCxC1AxD+AhBWEMQDC6cBAQN/QQAQNKciADYC8J4BAkACQCAAQQAoAqSmASIBayICQf//AEsNACACQekHSQ0BQQBBACkDqKYBIAAgAWtBl3hqIgJB6AduIgFBAWqtfDcDqKYBIAIgAUHoB2xrQQFqIQIMAQtBAEEAKQOopgEgAkHoB24iAa18NwOopgEgAiABQegHbGshAgtBACAAIAJrNgKkpgFBAEEAKQOopgE+ArCmARCZAwtnAQF/AkACQANAELsDIgBFDQECQCAALQADQQNxQQNHDQAgACkCBBCdA1INAEE/IAAvAQBBAEEAEMADGhDEAwsDQCAAEI4DIAAQoQMNAAsgABC8AxCXAxA5IAANAAwCCwALEJcDEDkLCwUAQaQ0CwUAQZA0CzkBAX9BxbvyiHghAgJAIAFFDQADQCACIAAtAABzQZODgAhsIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAgsEABAyC04BAX8CQEEAKAK0pgEiAA0AQQAgAEGTg4AIbEENczYCtKYBC0EAQQAoArSmASIAQQ10IABzIgBBEXYgAHMiAEEFdCAAcyIANgK0pgEgAAtqAQF/Qf//AyECAkAgAUUNAEH//wMhAgNAIAJB//8DcSICQQh0IAAtAAAgAkEIdnMiAkHwAXFBBHYgAnNB/wFxIgJyIAJBDHRzIAJBBXRzIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAkH//wNxC20BA38gAEECaiEBIAAtAAJBCmohAkH//wMhAwNAIANB//8DcSIDQQh0IAEtAAAgA0EIdnMiA0HwAXFBBHYgA3NB/wFxIgNyIANBDHRzIANBBXRzIQMgAUEBaiEBIAJBf2oiAg0ACyAAIAM7AQAL4QEBB39BACEBAkAgAC0ADCICQQdqQfwDcSIDIAAtAAIiBE8NAAJAIABBDGoiBSACQQRqIgZqLQAAQf8BRw0AIAIgAGpBEWotAAAiAyAETw0BIAYgA08NAQsgACAALQADQf0BcToAAyAAIANqQQxqIgItAAAiBkEEaiIHIANqIARLDQBBACEBA0AgBSACKAIANgIAIAVBBGohBSACQQRqIQIgASAGSSEEIAFBBGohASAEDQALIABBDGoiBSAHakH/AToAACAGIAVqQQVqIAZBB2pB/AFxIANqOgAAQQEhAQsgAQsJACAAQQA6AAILkQEBAn8CQAJAIAFBgAJPDQAgAkGAgARPDQFBACEEAkAgA0EEakHsASAALQACIgVrSw0AIAAgBWpBDGoiBCACOgACIAQgAToAASAEIAM6AAAgBCACQQh2OgADIAAgBSADQQdqQfwBcWo6AAIgBEEEaiEECyAEDwtBkiRBgQFBkBwQpAMAC0GSJEGDAUGQHBCkAwALLAEBfyMAQRBrIgMkACADIAI2AgggAyABNgIEIAMgADYCAEHqDyADEC0QHAALSQEDfwJAIAAoAgAiAkEAKAKwpgFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoArCmASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtJAQN/AkAgACgCACICQQAoAvCeAWsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgC8J4BIgRrQX9KDQAgACAEIAFqNgIACyADQR92C2QBA38CQCACRQ0AQQAhAwNAIAAgA0EBdGoiBCABIANqIgUtAABBBHZB5hhqLQAAOgAAIARBAWogBS0AAEEPcUHmGGotAAA6AAAgA0EBaiIDIAJHDQALCyAAIAJBAXRqQQA6AAALnQIBB38gACECAkAgAS0AACIDRQ0AIANFIQRBACEFIAAhAgNAAkACQCADQVBqQf8BcUEJSyIGDQAgA0EYdEEYdUFQaiEHDAELQX8hByADQSByIghBn39qQf8BcUEFSw0AIAhBGHRBGHVBqX9qIQcLAkAgB0F/Rw0AIAEtAAEiA0UhBCABQQFqIQEgAw0BDAILIARBAXENAQJAAkAgBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIDQZ9/akH/AXFBBUsNACADQRh0QRh1Qal/aiEHCyABQQFqIQECQAJAIAUNACAHQQR0QYACciEFDAELIAIgByAFcjoAACACQQFqIQJBACEFCyABLQAAIgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEHFDyAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEMcDIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDrA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDrA2pBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0gCSICdkEPcSIJDQAgAkUNAEEAIQwgAUUNAQsgByABaiAJQTdqIAlBMHIgCUEJSxs6AAAgAUEBaiEMCyACQXxqIQkgDCEBIAINAAsgByAMakEAOgAAIANBBGohAwwFCyAEQbDwATsBACADKAIAIQ1BHCEJQQAhAQNAAkACQCANIAkiAnZBD3EiCQ0AIAJFDQBBACEMIAFFDQELIAcgAWogCUE3aiAJQTByIAlBCUsbOgAAIAFBAWohDAsgAkF8aiEJIAwhASACDQALIAcgDGpBADoAACADQQRqIQMMBAsgBCADQQdqQXhxIgIrAwBBCBCsAyACQQhqIQMMAwsgAygCACICQYYyIAIbIgkQ6wMhAgJAIAUgCmsiDEEBSA0AIAogCSACIAxBf2ogDCACShsiDBDHAyAM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LQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEgBjcDECABIAY3AwggASAGNwMAIAFBIGohASACQWBqIgJBH0sNAAsLIAALBABBAQsCAAsOACAAKAI8IAEgAhDcAwvYAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQZBAiEHIANBEGohAQJAAkACQAJAIAAoAjwgA0EQakECIANBDGoQEhDsAw0AA0AgBiADKAIMIgRGDQIgBEF/TA0DIAEgBCABKAIEIghLIgVBA3RqIgkgCSgCACAEIAhBACAFG2siCGo2AgAgAUEMQQQgBRtqIgkgCSgCACAIazYCACAGIARrIQYgACgCPCABQQhqIAEgBRsiASAHIAVrIgcgA0EMahASEOwDRQ0ACwsgBkF/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dnNfdmVyaWZ5AGFycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAamRfd3Nza19uZXcAcHJldgB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABsb2NhbGhvc3QAc3RvcF9saXN0AGF1dGggdG9vIHNob3J0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudABkZXZpY2VzY3JpcHRtZ3JfaW5pdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAY2hhckNvZGVBdAB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBkZXZzX2ZpYmVyX2NvcHlfcGFyYW1zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgBmcmVlX2ZpYmVyAGpkX3NoYTI1Nl9zZXR1cABwb3AAZGV2c19idWZmZXJfb3AAIXN3ZWVwAGRldnNfdm1fcG9wX2FyZ19tYXAAc21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAHJlLXJ1bgBidXR0b24AbW90aW9uAGZ1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AYm9vbGVhbgBzY2FuAGZsYXNoX3Byb2dyYW0AbnVsbABqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABkZXZzX2ltZ19zdHJpZHhfb2sAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5IDw9IG1hcC0+bGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGJ1ZmZlcl90b19zdHJpbmcAZGV2c192YWx1ZV90b19zdHJpbmcAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgAwMTIzNDU2Nzg5YWJjZGVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAdHJ1ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGhlYXJ0UmF0ZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTOiBjbG9zZQBmYWxzZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHNsaWNlAHNwbGljZQByb2xlbWdyX2F1dG9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAV1M6IGNvbm5lY3RlZABjcmVhdGVkAHVuZGVmaW5lZAB1cGxvYWQgZmFpbGVkACFzdGF0ZS0+bG9ja2VkAHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkAHdpbmRTcGVlZABtYXRyaXhLZXlwYWQAYWdnYnVmZmVyX3VwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCBiaW4gdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIHVwbG9hZAAlLXMlZAAlLXNfJWQAJXMgZmliZXIgJXNfRiVkACAgcGM9JWQgQCAlc19GJWQAUEFOSUMgJWQgYXQgcGM9JWQAc2V0IHJvbGUgJXMgLT4gJXM6JWQAV1NTSy1IOiB0b28gc2hvcnQgZnJhbWU6ICVkAHR2b2MAamRfcm9sZV9hbGxvYwBkZXZzX3JlZ2NhY2hlX2FsbG9jAGJhZCBtYWdpYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdmVyaWZ5LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdC5jAGphY2RhYy1jL3NvdXJjZS9qZF9udW1mbXQuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvb2JqZWN0cy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9maWJlcnMuYwBqYWNkYWMtYy9zb3VyY2UvamRfc2VydmljZXMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0bWdyLmMAamFjZGFjLWMvY2xpZW50L3JvbGVtZ3IuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvYWdnYnVmZmVyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9tYWluLmMAamFjZGFjLWMvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX3V0aWwuYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGphY2RhYy1jL25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBbRmliZXI6ICV4XQBbQnVmZmVyWyV1XSAlLXNdAFtGdW5jdGlvbjogJXNdAFtSb2xlOiAlc10Ac2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AW0J1ZmZlclsldV0gJS1zLi4uXQAodGFnICYgREVWU19HQ19UQUdfTUFTSykgPj0gREVWU19HQ19UQUdfQllURVMAQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gREVWU19HQ19UQUdfQllURVMATmFOAHBrdCAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGVDTzIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAZXZlbnRfc2NvcGUgPT0gMQBhcmcwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIERFVlNfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAKGN0eC0+ZmxhZ3MgJiBERVZTX0NUWF9GTEFHX0JVU1kpICE9IDAAKHRhZyAmIERFVlNfR0NfVEFHX01BU0tfUElOTkVEKSAhPSAwAC93c3NrLwB3czovLwBkZXZzX2J1ZmZlcmlzaF9pc19idWZmZXIodikAZGV2c19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQBkZXZzX2J1ZmZlcl9pc193cml0YWJsZShjdHgsIGJ1ZmZlcikAKG51bGwpAGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAbWlzc2luZyAlZCBieXRl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X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZUUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZUYPcm9sZW1ncl9wcm9jZXNzRxByb2xlbWdyX2F1dG9iaW5kSBVyb2xlbWdyX2hhbmRsZV9wYWNrZXRJFGpkX3JvbGVfbWFuYWdlcl9pbml0Shhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWRLDWpkX3JvbGVfYWxsb2NMEGpkX3JvbGVfZnJlZV9hbGxNFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmROEmpkX3JvbGVfYnlfc2VydmljZU8TamRfY2xpZW50X2xvZ19ldmVudFATamRfY2xpZW50X3N1YnNjcmliZVEUamRfY2xpZW50X2VtaXRfZXZlbnRSFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkUxBqZF9kZXZpY2VfbG9va3VwVBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2VVE2pkX3NlcnZpY2Vfc2VuZF9jbWRWEWpkX2NsaWVudF9wcm9jZXNzVw5qZF9kZXZpY2VfZnJlZVgXamRfY2xpZW50X2hhbmRsZV9wYWNrZXRZD2pkX2RldmljZV9hbGxvY1oOYWdnYnVmZmVyX2luaXRbD2FnZ2J1ZmZlcl9mbHVzaFwQYWdnYnVmZmVyX3VwbG9hZF0OZGV2c19idWZmZXJfb3BeEGRldnNfcmVhZF9udW1iZXJfD2RldnNfY3JlYXRlX2N0eGAJc2V0dXBfY3R4YQpkZXZzX3RyYWNlYg9kZXZzX2Vycm9yX2NvZGVjGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJkCWNsZWFyX2N0eGUNZGV2c19mcmVlX2N0eGYOZGV2c190cnlfYWxsb2NnCGRldnNfb29taAlkZXZzX2ZyZWVpF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzagd0cnlfcnVuawxzdG9wX3Byb2dyYW1sHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRtHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVuGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaG8dZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRwDmRlcGxveV9oYW5kbGVycRNkZXBsb3lfbWV0YV9oYW5kbGVychZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95cxRkZXZpY2VzY3JpcHRtZ3JfaW5pdHQZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldnURZGV2c2Nsb3VkX3Byb2Nlc3N2F2RldnNjbG91ZF9oYW5kbGVfcGFja2V0dxNkZXZzY2xvdWRfb25fbWV0aG9keA5kZXZzY2xvdWRfaW5pdHkQZGV2c19maWJlcl95aWVsZHoWZGV2c19maWJlcl9jb3B5X3BhcmFtc3sYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9ufBhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV9EGRldnNfZmliZXJfc2xlZXB+G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbH8aZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnOAARFkZXZzX2ltZ19mdW5fbmFtZYEBEmRldnNfaW1nX3JvbGVfbmFtZYIBEmRldnNfZmliZXJfYnlfZmlkeIMBEWRldnNfZmliZXJfYnlfdGFnhAEQZGV2c19maWJlcl9zdGFydIUBFGRldnNfZmliZXJfdGVybWlhbnRlhgEOZGV2c19maWJlcl9ydW6HARNkZXZzX2ZpYmVyX3N5bmNfbm93iAEKZGV2c19wYW5pY4kBFV9kZXZzX3J1bnRpbWVfZmFpbHVyZYoBD2RldnNfZmliZXJfcG9rZYsBD2pkX2djX3RyeV9hbGxvY4wBCXRyeV9hbGxvY40BB2RldnNfZ2OOAQ9maW5kX2ZyZWVfYmxvY2uPAQtqZF9nY191bnBpbpABCmpkX2djX2ZyZWWRAQ5kZXZzX3ZhbHVlX3BpbpIBEGRldnNfdmFsdWVfdW5waW6TARJkZXZzX21hcF90cnlfYWxsb2OUARRkZXZzX2FycmF5X3RyeV9hbGxvY5UBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5YBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5cBD2RldnNfZ2Nfc2V0X2N0eJgBDmRldnNfZ2NfY3JlYXRlmQEPZGV2c19nY19kZXN0cm95mgEEc2NhbpsBE3NjYW5fYXJyYXlfYW5kX21hcmucARRkZXZzX2pkX2dldF9yZWdpc3Rlcp0BFmRldnNfamRfY2xlYXJfcGt0X2tpbmSeARBkZXZzX2pkX3NlbmRfY21knwETZGV2c19qZF9zZW5kX2xvZ21zZ6ABDWhhbmRsZV9sb2dtc2ehARJkZXZzX2pkX3Nob3VsZF9ydW6iARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZaMBE2RldnNfamRfcHJvY2Vzc19wa3SkARRkZXZzX2pkX3JvbGVfY2hhbmdlZKUBFGRldnNfamRfcmVzZXRfcGFja2V0pgESZGV2c19qZF9pbml0X3JvbGVzpwESZGV2c19qZF9mcmVlX3JvbGVzqAEQZGV2c19zZXRfbG9nZ2luZ6kBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc6oBDGRldnNfbWFwX3NldKsBBmxvb2t1cKwBDGRldnNfbWFwX2dldK0BCmRldnNfaW5kZXiuAQ5kZXZzX2luZGV4X3NldK8BEWRldnNfYXJyYXlfaW5zZXJ0sAESZGV2c19yZWdjYWNoZV9mcmVlsQEWZGV2c19yZWdjYWNoZV9mcmVlX2FsbLIBF2RldnNfcmVnY2FjaGVfbWFya191c2VkswETZGV2c19yZWdjYWNoZV9hbGxvY7QBFGRldnNfcmVnY2FjaGVfbG9va3VwtQERZGV2c19yZWdjYWNoZV9hZ2W2ARdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZbcBEmRldnNfcmVnY2FjaGVfbmV4dLgBD2pkX3NldHRpbmdzX2dldLkBD2pkX3NldHRpbmdzX3NldLoBDWNvbnN1bWVfY2h1bmu7AQ1zaGFfMjU2X2Nsb3NlvAEPamRfc2hhMjU2X3NldHVwvQEQamRfc2hhMjU2X3VwZGF0Zb4BEGpkX3NoYTI1Nl9maW5pc2i/ARRqZF9zaGEyNTZfaG1hY19zZXR1cMABFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaMEBDmpkX3NoYTI1Nl9oa2RmwgEOZGV2c19zdHJmb3JtYXTDAQ5kZXZzX2lzX3N0cmluZ8QBFGRldnNfc3RyaW5nX2dldF91dGY4xQEUZGV2c19zdHJpbmdfdnNwcmludGbGARNkZXZzX3N0cmluZ19zcHJpbnRmxwEVZGV2c19zdHJpbmdfZnJvbV91dGY4yAEUZGV2c192YWx1ZV90b19zdHJpbmfJARBidWZmZXJfdG9fc3RyaW5nygESZGV2c19zdHJpbmdfY29uY2F0ywEcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY8wBD3RzYWdnX2NsaWVudF9lds0BCmFkZF9zZXJpZXPOAQ10c2FnZ19wcm9jZXNzzwEKbG9nX3Nlcmllc9ABE3RzYWdnX2hhbmRsZV9wYWNrZXTRARRsb29rdXBfb3JfYWRkX3Nlcmllc9IBCnRzYWdnX2luaXTTAQx0c2FnZ191cGRhdGXUARZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl1QETZGV2c192YWx1ZV9mcm9tX2ludNYBFGRldnNfdmFsdWVfZnJvbV9ib29s1wEXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLYARFkZXZzX3ZhbHVlX3RvX2ludNkBFGRldnNfdmFsdWVfdG9fZG91Ymxl2gESZGV2c192YWx1ZV90b19ib29s2wEOZGV2c19pc19idWZmZXLcARdkZXZzX2J1ZmZlcl9pc193cml0YWJsZd0BEGRldnNfYnVmZmVyX2RhdGHeARNkZXZzX2J1ZmZlcmlzaF9kYXRh3wEUZGV2c192YWx1ZV90b19nY19vYmrgARFkZXZzX3ZhbHVlX3R5cGVvZuEBD2RldnNfaXNfbnVsbGlzaOIBDmRldnNfaXNfbnVtYmVy4wESZGV2c192YWx1ZV9pZWVlX2Vx5AESZGV2c19pbWdfc3RyaWR4X29r5QELZGV2c192ZXJpZnnmARRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc+cBEWRldnNfaW1nX2dldF91dGY46AEUZGV2c19nZXRfc3RhdGljX3V0ZjjpAQxleHByX2ludmFsaWTqARBleHByeF9sb2FkX2xvY2Fs6wERZXhwcnhfbG9hZF9nbG9iYWzsARFleHByM19sb2FkX2J1ZmZlcu0BDWV4cHJ4X2xpdGVyYWzuARFleHByeF9saXRlcmFsX2Y2NO8BDWV4cHIwX3JldF92YWzwAQxleHByMl9zdHIwZXHxARdleHByMV9yb2xlX2lzX2Nvbm5lY3RlZPIBDmV4cHIwX3BrdF9zaXpl8wERZXhwcjBfcGt0X2V2X2NvZGX0ARZleHByMF9wa3RfcmVnX2dldF9jb2Rl9QEJZXhwcjBfbmFu9gEJZXhwcjFfYWJz9wENZXhwcjFfYml0X25vdPgBCmV4cHIxX2NlaWz5AQtleHByMV9mbG9vcvoBCGV4cHIxX2lk+wEMZXhwcjFfaXNfbmFu/AELZXhwcjFfbG9nX2X9AQlleHByMV9uZWf+AQlleHByMV9ub3T/AQxleHByMV9yYW5kb22AAhBleHByMV9yYW5kb21faW50gQILZXhwcjFfcm91bmSCAg1leHByMV90b19ib29sgwIJZXhwcjJfYWRkhAINZXhwcjJfYml0X2FuZIUCDGV4cHIyX2JpdF9vcoYCDWV4cHIyX2JpdF94b3KHAglleHByMl9kaXaIAghleHByMl9lcYkCCmV4cHIyX2lkaXaKAgpleHByMl9pbXVsiwIIZXhwcjJfbGWMAghleHByMl9sdI0CCWV4cHIyX21heI4CCWV4cHIyX21pbo8CCWV4cHIyX211bJACCGV4cHIyX25lkQIJZXhwcjJfcG93kgIQZXhwcjJfc2hpZnRfbGVmdJMCEWV4cHIyX3NoaWZ0X3JpZ2h0lAIaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWSVAglleHByMl9zdWKWAhBleHByeF9sb2FkX3BhcmFtlwIMZXhwcjBfbm93X21zmAIWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZZkCFWV4cHIwX3BrdF9yZXBvcnRfY29kZZoCFmV4cHIwX3BrdF9jb21tYW5kX2NvZGWbAhFleHByeF9zdGF0aWNfcm9sZZwCDHN0bXQ0X21lbXNldJ0CD2V4cHIyX2dldF9maWVsZJ4CC2V4cHIyX2luZGV4nwITZXhwcjFfb2JqZWN0X2xlbmd0aKACEWV4cHIxX2tleXNfbGVuZ3RooQIMZXhwcjFfdHlwZW9mogIKZXhwcjBfbnVsbKMCDWV4cHIxX2lzX251bGykAhBleHByMF9wa3RfYnVmZmVypQIKZXhwcjBfdHJ1ZaYCC2V4cHIwX2ZhbHNlpwIPc3RtdDFfd2FpdF9yb2xlqAINc3RtdDFfc2xlZXBfc6kCDnN0bXQxX3NsZWVwX21zqgIPc3RtdDNfcXVlcnlfcmVnqwIOc3RtdDJfc2VuZF9jbWSsAhNzdG10NF9xdWVyeV9pZHhfcmVnrQIRc3RtdHgyX2xvZ19mb3JtYXSuAg1leHByeDJfZm9ybWF0rwIWc3RtdDFfc2V0dXBfcGt0X2J1ZmZlcrACDXN0bXQyX3NldF9wa3SxAgpzdG10NV9ibGl0sgILc3RtdHgyX2NhbGyzAg5zdG10eDNfY2FsbF9iZ7QCDHN0bXQxX3JldHVybrUCCXN0bXR4X2ptcLYCDHN0bXR4MV9qbXBfercCC3N0bXQxX3BhbmljuAISc3RtdHgxX3N0b3JlX2xvY2FsuQITc3RtdHgxX3N0b3JlX2dsb2JhbLoCEnN0bXQ0X3N0b3JlX2J1ZmZlcrsCEnN0bXR4MV9zdG9yZV9wYXJhbbwCFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcr0CD3N0bXQwX2FsbG9jX21hcL4CEXN0bXQxX2FsbG9jX2FycmF5vwISc3RtdDFfYWxsb2NfYnVmZmVywAIPc3RtdDNfc2V0X2ZpZWxkwQIPc3RtdDNfYXJyYXlfc2V0wgISc3RtdDNfYXJyYXlfaW5zZXJ0wwIVZXhwcnhfc3RhdGljX2Z1bmN0aW9uxAIKZXhwcjJfaW1vZMUCDGV4cHIxX3RvX2ludMYCE2V4cHJ4X3N0YXRpY19idWZmZXLHAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfIAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nyQIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nygIRc3RtdDFfZGVjb2RlX3V0ZjjLAg9kZXZzX3ZtX3BvcF9hcmfMAhNkZXZzX3ZtX3BvcF9hcmdfdTMyzQITZGV2c192bV9wb3BfYXJnX2kzMs4CFGRldnNfdm1fcG9wX2FyZ19mdW5jzwITZGV2c192bV9wb3BfYXJnX2Y2NNACFmRldnNfdm1fcG9wX2FyZ19idWZmZXLRAhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGHSAhtkZXZzX3ZtX3BvcF9hcmdfc3RyaW5nX2RhdGHTAhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR41AIUZGV2c192bV9wb3BfYXJnX3JvbGXVAhNkZXZzX3ZtX3BvcF9hcmdfbWFw1gISamRfYWVzX2NjbV9lbmNyeXB01wISamRfYWVzX2NjbV9kZWNyeXB02AIMQUVTX2luaXRfY3R42QIPQUVTX0VDQl9lbmNyeXB02gIQamRfYWVzX3NldHVwX2tledsCDmpkX2Flc19lbmNyeXB03AIQamRfYWVzX2NsZWFyX2tled0CC2pkX3dzc2tfbmV33gIUamRfd3Nza19zZW5kX21lc3NhZ2XfAhNqZF93ZWJzb2NrX29uX2V2ZW504AIHZGVjcnlwdOECDWpkX3dzc2tfY2xvc2XiAhBqZF93c3NrX29uX2V2ZW504wIKc2VuZF9lbXB0eeQCEndzc2toZWFsdGhfcHJvY2Vzc+UCF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxl5gIUd3Nza2hlYWx0aF9yZWNvbm5lY3TnAhh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXToAg9zZXRfY29ubl9zdHJpbmfpAhFjbGVhcl9jb25uX3N0cmluZ+oCD3dzc2toZWFsdGhfaW5pdOsCE3dzc2tfcHVibGlzaF92YWx1ZXPsAhB3c3NrX3B1Ymxpc2hfYmlu7QIRd3Nza19pc19jb25uZWN0ZWTuAhN3c3NrX3Jlc3BvbmRfbWV0aG9k7wIPamRfY3RybF9wcm9jZXNz8AIVamRfY3RybF9oYW5kbGVfcGFja2V08QIMamRfY3RybF9pbml08gINamRfaXBpcGVfb3BlbvMCFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXT0Ag5qZF9pcGlwZV9jbG9zZfUCEmpkX251bWZtdF9pc192YWxpZPYCFWpkX251bWZtdF93cml0ZV9mbG9hdPcCE2pkX251bWZtdF93cml0ZV9pMzL4AhJqZF9udW1mbXRfcmVhZF9pMzL5AhRqZF9udW1mbXRfcmVhZF9mbG9hdPoCEWpkX29waXBlX29wZW5fY21k+wIUamRfb3BpcGVfb3Blbl9yZXBvcnT8AhZqZF9vcGlwZV9oYW5kbGVfcGFja2V0/QIRamRfb3BpcGVfd3JpdGVfZXj+AhBqZF9vcGlwZV9wcm9jZXNz/wIUamRfb3BpcGVfY2hlY2tfc3BhY2WAAw5qZF9vcGlwZV93cml0ZYEDDmpkX29waXBlX2Nsb3NlggMNamRfcXVldWVfcHVzaIMDDmpkX3F1ZXVlX2Zyb250hAMOamRfcXVldWVfc2hpZnSFAw5qZF9xdWV1ZV9hbGxvY4YDDWpkX3Jlc3BvbmRfdTiHAw5qZF9yZXNwb25kX3UxNogDDmpkX3Jlc3BvbmRfdTMyiQMRamRfcmVzcG9uZF9zdHJpbmeKAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZIsDC2pkX3NlbmRfcGt0jAMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyNAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlco4DGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSPAxRqZF9hcHBfaGFuZGxlX3BhY2tldJADFWpkX2FwcF9oYW5kbGVfY29tbWFuZJEDE2pkX2FsbG9jYXRlX3NlcnZpY2WSAxBqZF9zZXJ2aWNlc19pbml0kwMOamRfcmVmcmVzaF9ub3eUAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVklQMUamRfc2VydmljZXNfYW5ub3VuY2WWAxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZZcDEGpkX3NlcnZpY2VzX3RpY2uYAxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeZAxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZZoDEmFwcF9nZXRfZndfdmVyc2lvbpsDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWcAw1qZF9oYXNoX2ZudjFhnQMMamRfZGV2aWNlX2lkngMJamRfcmFuZG9tnwMIamRfY3JjMTagAw5qZF9jb21wdXRlX2NyY6EDDmpkX3NoaWZ0X2ZyYW1logMOamRfcmVzZXRfZnJhbWWjAxBqZF9wdXNoX2luX2ZyYW1lpAMNamRfcGFuaWNfY29yZaUDE2pkX3Nob3VsZF9zYW1wbGVfbXOmAxBqZF9zaG91bGRfc2FtcGxlpwMJamRfdG9faGV4qAMLamRfZnJvbV9oZXipAw5qZF9hc3NlcnRfZmFpbKoDB2pkX2F0b2mrAwtqZF92c3ByaW50ZqwDD2pkX3ByaW50X2RvdWJsZa0DEmpkX2RldmljZV9zaG9ydF9pZK4DDGpkX3NwcmludGZfYa8DC2pkX3RvX2hleF9hsAMUamRfZGV2aWNlX3Nob3J0X2lkX2GxAwlqZF9zdHJkdXCyAw5qZF9qc29uX2VzY2FwZbMDE2pkX2pzb25fZXNjYXBlX2NvcmW0AwlqZF9tZW1kdXC1AxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVltgMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZbcDEWpkX3NlbmRfZXZlbnRfZXh0uAMKamRfcnhfaW5pdLkDFGpkX3J4X2ZyYW1lX3JlY2VpdmVkugMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2u7Aw9qZF9yeF9nZXRfZnJhbWW8AxNqZF9yeF9yZWxlYXNlX2ZyYW1lvQMRamRfc2VuZF9mcmFtZV9yYXe+Aw1qZF9zZW5kX2ZyYW1lvwMKamRfdHhfaW5pdMADB2pkX3NlbmTBAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjwgMPamRfdHhfZ2V0X2ZyYW1lwwMQamRfdHhfZnJhbWVfc2VudMQDC2pkX3R4X2ZsdXNoxQMQX19lcnJub19sb2NhdGlvbsYDBWR1bW15xwMIX19tZW1jcHnIAwdtZW1tb3ZlyQMGbWVtc2V0ygMKX19sb2NrZmlsZcsDDF9fdW5sb2NrZmlsZcwDDF9fc3RkaW9fc2Vla80DDV9fc3RkaW9fd3JpdGXOAw1fX3N0ZGlvX2Nsb3NlzwMMX19zdGRpb19leGl00AMKY2xvc2VfZmlsZdEDCV9fdG93cml0ZdIDCV9fZndyaXRleNMDBmZ3cml0ZdQDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHPVAxRfX3B0aHJlYWRfbXV0ZXhfbG9ja9YDFl9fcHRocmVhZF9tdXRleF91bmxvY2vXAwZfX2xvY2vYAw5fX21hdGhfZGl2emVyb9kDDl9fbWF0aF9pbnZhbGlk2gMDbG9n2wMFbG9nMTDcAwdfX2xzZWVr3QMGbWVtY21w3gMKX19vZmxfbG9ja98DDF9fbWF0aF94Zmxvd+ADCmZwX2JhcnJpZXLhAwxfX21hdGhfb2Zsb3fiAwxfX21hdGhfdWZsb3fjAwRmYWJz5AMDcG935QMIY2hlY2tpbnTmAwtzcGVjaWFsY2FzZecDBXJvdW5k6AMGc3RyY2hy6QMLX19zdHJjaHJudWzqAwZzdHJjbXDrAwZzdHJsZW7sAxJfX3dhc2lfc3lzY2FsbF9yZXTtAwhkbG1hbGxvY+4DBmRsZnJlZe8DGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZfADBHNicmvxAwlfX3Bvd2lkZjLyAwlzdGFja1NhdmXzAwxzdGFja1Jlc3RvcmX0AwpzdGFja0FsbG9j9QMVZW1zY3JpcHRlbl9zdGFja19pbml09gMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZfcDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2X4AxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmT5AwxkeW5DYWxsX2ppamn6AxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp+wMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB+QMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
