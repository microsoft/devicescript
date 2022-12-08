
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB04GAgAAhYAN/f38AYAF/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAJ/fABgBX9/f39/AGAAAXxgB39/f39/f38Bf2AJf39/f39/f39/AGAGf39/f39/AGADf39/AXxgA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/AsyFgIAAFgNlbnYFYWJvcnQABQNlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABgNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAYDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52BGV4aXQAAQNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgABA2Vudg1lbV9zZW5kX2ZyYW1lAAEDZW52EGVtX2NvbnNvbGVfZGVidWcAAQNlbnYLZW1fdGltZV9ub3cAEgNlbnYTZGV2c19kZXBsb3lfaGFuZGxlcgABA2VudhRqZF9jcnlwdG9fZ2V0X3JhbmRvbQACFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAYWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQDZW52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oQEiBjYCQAJAIAEoAhAiBQ0AAkACQCAALQASRQ0AIABBKGohBSAAKAIoDQEgBUGIJzYCAAwBCyAAQQxqIQULIAUoAgAhBQsgASAFIAZqNgJEIAFB+hwQhgEgASADEBwiBTYCDCAFIAQgAhCtAxoLIAELOAEBf0EAQYAxEO8CIgE2AqScASABQQE6ABIgASAANgIgIAFB4NQDNgIMIAFBgQI7ARBBCSABEFALygIBA38CQEEAKAKknAEiAkUNACACIAAgABDRAxCIASEAIAG9Qv///////////wCDQoCAgICAgID4/wBWDQACQCAAKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgACABOQMYIABBADYCICAAQThqIAE5AwAgAEEwaiABOQMAIABBKGpCADcDACAAIABBwABqKAIANgIUCyAAIAAoAiBBAWo2AiAgACgCFCEDAkACQEEAKAKQoQEiBCAAQcQAaigCACICa0EASA0AIABBKGoiBCAAKwMYIAIgA2u4oiAEKwMAoDkDAAwBCyAAQShqIgIgACsDGCAEIANruKIgAisDAKA5AwAgBCECCyAAIAI2AhQCQCAAQThqKwMAIAFjRQ0AIAAgATkDOAsCQCAAQTBqKwMAIAFkRQ0AIAAgATkDMAsgACABOQMYCwvRAgEDfwJAAkAgAC8BCA0AAkACQCAAKAKYASABQQJ0aigCACgCECIFRQ0AIABBvANqIgYgASACIAQQngIiB0UNACAHKAIEQaD3NiADIANB34hJakHgiElJG2ogACgCoAFPDQEgBiAHEJoCCyAAKAKQASIARQ0CIAAgAjsBECAAIAE7AQ4gACAEOwEEIABBBmpBFDsBACAAIAAtAAxB8AFxQQFyOgAMIABBABB2DwsgBiAHEJwCIQEgAEHIAWpCADcDACAAQgA3A8ABIABBzgFqIAEvAQI7AQAgAEHMAWogAS0AFDoAACAAQc0BaiAFLQAEOgAAIABBxAFqIAVBACAFLQAEa0EMbGpBZGopAwA3AgAgAEHQAWohAiABQQhqIQACQCABLQAUIgFBCkkNACAAKAIAIQALIAIgACABEK0DGgsPC0HsJkHnJEEpQYASEIwDAAssAAJAIAAtAAxBD3FBAkcNACAAKAIsIAAoAgQQZAsgACAALQAMQfABcToADAviAgECfwJAAkAgAC8B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NwMIIAJBKGogA0EIahBrIgU5AwAgAisDICAFZSECDAELIAIoAhAgAigCGEwhAgsgACACEGggA0EgaiQAC7YBAgJ/AXwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahBrOQMgIAMgBCkDADcDCCACQShqIANBCGoQayIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhBoIANBIGokAAuQAgIFfwJ8IwBBIGsiAyQAIANBGGogAhCyAiACQRhqIgQgAykDGDcDACADQRhqIAIQsgIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQazkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQazkDAEGwMCEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBCAFIAIbIQcLIAAgBykDADcDACADQSBqJAALkAICBX8CfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDECACQRBqIQUCQAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAUpAwA3AxAgAiADQRBqEGs5AyAgAyAEKQMANwMIIAJBKGoiBiADQQhqEGs5AwBBsDAhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAUgBCACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC8YBAwN/AX4BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACNAIQIAI0Ahh+IgZCIIinIAanIgVBH3VHDQAgACAFEGcMAQsgAyACQRBqKQMANwMQIAIgA0EQahBrOQMgIAMgBCkDADcDCCACQShqIANBCGoQayIHOQMAIAAgByACKwMgohBmCyADQSBqJAALtgECAn8BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEGs5AyAgAyAEKQMANwMIIAJBKGogA0EIahBrIgU5AwAgBSACKwMgYiECDAELIAIoAhAgAigCGEchAgsgACACEGggA0EgaiQAC4IBAgJ/AXwjAEEgayIDJAAgA0EYaiACELICIAJBGGoiBCADKQMYNwMAIANBGGogAhCyAiACIAMpAxg3AxAgAyACKQMQNwMQIAIgA0EQahBrOQMgIAMgBCkDADcDCCACQShqIANBCGoQayIFOQMAIAAgAisDICAFEMoDEGYgA0EgaiQACysBAn8gAkEYaiIDIAIQtAI2AgAgAiACELQCIgQ2AhAgACAEIAMoAgB0EGcLKwECfyACQRhqIgMgAhC0AjYCACACIAIQtAIiBDYCECAAIAQgAygCAHUQZws/AQJ/IAJBGGoiAyACELQCNgIAIAIgAhC0AiIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBBmDwsgACACEGcLxAECBH8BfCMAQSBrIgMkACADQRhqIAIQsgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELICIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEogAigCECIGIAVrIgUgBkhzDQAgACAFEGcMAQsgAyACQRBqKQMANwMQIAIgA0EQahBrOQMgIAMgBCkDADcDCCACQShqIANBCGoQayIHOQMAIAAgAisDICAHoRBmCyADQSBqJAALMgEBf0HAMCEDAkAgAigCNCICIAEtABRPDQAgASgCECACQQN0aiEDCyAAIAMpAwA3AwALDQAgACACKQOgAboQZguHAQEBfyMAQRBrIgMkACADQQhqIAIQsgIgAyADKQMINwMAAkACQCADEHFFDQAgASgCCCEBDAELQQAhASADKAIMQYaAwP8HRw0AIAIg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ACACQQN0akE4aiAMNwMACyAAKAKMASICDQAMAgsACyAAQeHUAxB/CyABQRBqJAALkwIBAX8jAEEgayIGJAAgASgCCCgCLCEBAkACQCACEPoCDQAgACABQeQAEIABDAELIAYgBCkDADcDCCABIAZBCGogBkEcahBuIQQCQEEBIAJBA3F0IANqIAYoAhxNDQACQCAFRQ0AIAAgAUHnABCAAQwCCyAAQQApA8AwNwMADAELIAQgA2ohAQJAIAVFDQAgBiAFKQMANwMQAkACQCAGKAIUQX9HDQAgASACIAYoAhAQ/AIMAQsgBiAGKQMQNwMAIAEgAiAGEGsQ+wILIABBACkDwDA3AwAMAQsCQCACQQdLDQAgASACEP0CIgNB/////wdqQX1LDQAgACADEGcMAQsgACABIAIQ/gIQZgsgBkEgaiQACyAAAkAgASACQQNxdg0ARAAAAAAAAPh/DwsgACACEP4CC1QBA38jAEEgayIBJABBACECAkAgACABQSAQISIDQQBIDQAgA0EBahAcIQICQCADQSBKDQAgAiABIAMQrQMaDAELIAAgAiADECEaCyABQSBqJAAgAgsdAAJAIAENACAAIAFBABAiDwsgACABIAEQ0QMQIgskAAJAIAEtABRBCkkNACABKAIIEB0LIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIEB0LIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIFQRRHDQALQQAhBQsCQCAFDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEU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AgAgAw0BIAIgAEGDARCAAQtBACEDCyACQRBqJAAgAwufAwEJf0EAIQIDQCAAIAJBAnQiA2ogASADai0AADoAACAAIANBAXIiBGogASAEai0AADoAACAAIANBAnIiBGogASAEai0AADoAACAAIANBA3IiA2ogASADai0AADoAAEEIIQQgAkEBaiICQQhHDQALA0AgBEECdCIBIABqIgNBf2otAAAhBSADQX5qLQAAIQYgA0F9ai0AACECIANBfGotAAAhBwJAAkAgBEEHcSIIRQ0AIAUhCSAGIQUgByEKDAELIARBA3ZBgDhqLQAAIAJBgDZqLQAAcyEKIAdBgDZqLQAAIQkgBUGANmotAAAhBSAGQYA2ai0AACECCwJAIAhBBEcNACAJQf8BcUGANmotAAAhCSAFQf8BcUGANmotAAAhBSACQf8BcUGANmotAAAhAiAKQf8BcUGANmotAAAhCgsgAyADQWBqLQAAIApzOgAAIAAgAUEBcmogA0Fhai0AACACczoAACAAIAFBAnJqIANBYmotAAAgBXM6AAAgACABQQNyaiADQWNqLQAAIAlzOgAAIARBAWoiBEE8Rw0ACwujBQEKf0EAIQIDQCACQQJ0IQNBACEEA0AgASADaiAEaiIFIAUtAAAgACAEIANqai0AAHM6AAAgBEEBaiIEQQRHDQALIAJBAWoiAkEERw0AC0EBIQYDQEEAIQUDQEEAIQQDQCABIARBAnRqIAVqIgMgAy0AAEGANmotAAA6AAAgBEEBaiIEQQRHDQALIAVBAWoiBUEERw0ACyABLQABIQQgASABLQAFOgABIAEtAAkhAyABIAEtAA06AAkgASADOgAFIAEgBDoADSABLQACIQQgASABLQAKOgACIAEgBDoACiABLQAGIQQgASABLQAOOgAGIAEgBDoADiABLQADIQQgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASAEOgAHQQAhAgJAIAZBDkcNAANAIAJBAnQiBUHgAWohB0EAIQQDQCABIAVqIARqIgMgAy0AACAAIAcgBGpqLQAAczoAACAEQQFqIgRBBEcNAAsgAkEBaiICQQRHDQALDwsDQCABIAJBAnRqIgQgBC0AAyIDIAQtAAAiB3MiCEEBdCAELQABIgkgB3MiBSAELQACIgpzIgtzIAhBGHRBGHVBB3ZB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AAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEK0DIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDRA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDRA2pBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0gCSICdkEPcSIJDQAgAkUNAEEAIQwgAUUNAQsgByABaiAJQTdqIAlBMHIgCUEJSxs6AAAgAUEBaiEMCyACQXxqIQkgDCEBIAINAAsgByAMakEAOgAAIANBBGohAwwFCyAEQbDwATsBACADKAIAIQ1B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ASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQrQMPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACAC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IAI2AgwgAiAENgIIDAELIAMoAhghBwJAAkAgAygCDCIGIANGDQBBACgC2KMBIAMoAggiAksaIAIgBjYCDCAGIAI2AggMAQsCQCADQRRqIgIoAgAiBA0AIANBEGoiAigCACIEDQBBACEGDAELA0AgAiEFIAQiBkEUaiICKAIAIgQNACAGQRBqIQIgBigCECIEDQALIAVBADYCAAsgB0UNAAJAAkAgAygCHCIEQQJ0QfilAWoiAigCACADRw0AIAIgBjYCACAGDQFBAEEAKALMowFBfiAEd3E2AsyjAQwCCyAHQRBBFCAHKAIQIANGG2ogBjYCACAGRQ0BCyAGIAc2AhgCQCADKAIQIgJFDQAgBiACNgIQIAIgBjYCGAsgAygCFCICRQ0AIAZBFGogAjYCACACIAY2AhgLIAEgAEEBcjYCBCABIABqIAA2AgAgAUEAKALcowFHDQFBACAANgLQowEPCyADIAJBfnE2AgQgASAAQQFyNgIEIAEgAGogADYCAAsCQCAAQf8BSw0AIABBA3YiAkEDdEHwowFqIQACQAJAQQAoAsijASIEQQEgAnQiAnENAEEAIAQgAnI2AsijASAAIQIMAQsgACgCCCECCyAAIAE2AgggAiABNgIMIAEgADYCDCABIAI2AggPC0EfIQICQCAAQf///wdLDQAgAEEIdiICIAJBgP4/akEQdkEIcSICdCIEIARBgOAfakEQdkEEcSIEdCIGIAZBgIAPakEQdkECcSIGdEEPdiACIARyIAZyayICQQF0IAAgAkEVanZBAXFyQRxqIQILIAFCADcCECABQRxqIAI2AgAgAkECdEH4pQFqIQQCQAJAAkACQEEAKALMowEiBkEBIAJ0IgNxDQBBACAGIANyNgLMowEgBCABNgIAIAFBGGogBDYCAAwBCyAAQQBBGSACQQF2ayACQR9GG3QhAiAEKAIAIQYDQCAGIgQoAgRBeHEgAEYNAiACQR12IQYgAkEBdCECIAQgBkEEcWpBEGoiAygCACIGDQALIAMgATYCACABQRhqIAQ2AgALIAEgATYCDCABIAE2AggMAQsgBCgCCCIAIAE2AgwgBCABNgIIIAFBGGpBADYCACABIAQ2AgwgASAANgIIC0EAQQAoAuijAUF/aiIBQX8gARs2AuijAQsLBwA/AEEQdAtUAQJ/QQAoAoSUASIBIABBA2pBfHEiAmohAAJAAkAgAkUNACAAIAFNDQELAkAgABDVA00NACAAEBNFDQELQQAgADYChJQBIAEPCxCrA0EwNgIAQX8LawIBfAF/IABEAAAAAAAA8D8gAUEBcRshAgJAIAFBAWpBA0kNACABIQMDQCACIAAgAKIiAEQAAAAAAADwPyADQQJtIgNBAXEboiECIANBAWpBAksNAAsLRAAAAAAAAPA/IAKjIAIgAUEASBsLBAAjAAsGACAAJAALEgECfyMAIABrQXBxIgEkACABCxUAQcCnwQIkAkG4pwFBD2pBcHEkAQsHACMAIwFrCwQAIwILBAAjAQsNACABIAIgAyAAEQ0ACyQBAX4gACABIAKtIAOtQiCGhCAEEN8DIQUgBUIgiKcQFCAFpwsTACAAIAGnIAFCIIinIAIgAxAVCwuUjIGAAAMAQYAIC9SHAWphY2RhYy1wb3NpeCBkZXZpY2UAMC4wLjAAaHVtaWRpdHkAYWNpZGl0eQAhZnJhbWUtPnBhcmFtc19pc19jb3B5AGRldnNfdmVyaWZ5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAamRfd3Nza19uZXcAdHNhZ2dfY2xpZW50X2V2AFdTU0stSDogbWV0aG9kOiAnJXMnIHJpZD0ldSBudW12YWxzPSV1AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAYXV0aCB0b28gc2hvcnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AGRldmljZXNjcmlwdG1ncl9pbml0AHJlZmxlY3RlZExpZ2h0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAd3MAd3NzAGpkX2NsaWVudF9wcm9jZXNzAHJvbGVtZ3JfcHJvY2VzcwBqZF9vcGlwZV9wcm9jZXNzAGNvbXBhc3MAZGV2c19maWJlcl9jb3B5X3BhcmFtcwBhZ2didWY6IHVwbG9hZGVkICVkIGJ5dGVzAGFnZ2J1ZjogZmFpbGVkIHRvIHVwbG9hZCAlZCBieXRlcwBkZXZzLWtleS0lLXMAV1NTSy1IOiBlbmNzb2NrIGVycm9yOiAlLXMAV1NTSy1IOiBjb25uZWN0aW5nIHRvIHdzOi8vJXM6JWQlcwAlczovLyVzOiVkJXMAJS1zXyVzACUtczolcwBzZWxmLWRldmljZTogJXMvJXMAV1M6IGNvbm5lY3RpbmcgdG8gJXMAYXNzZXJ0aW9uICclcycgZmFpbGVkIGF0ICVzOiVkIGluICVzAEpEX1BBTklDKCkgYXQgJXM6JWQgaW4gJXMAY2xlYXIgcm9sZSAlcwBhc2tpbmcgZm9yIGRlcGxveTogJXMAZGV2aWNlIHJlc2V0OiAlcwB0c2FnZzogJXM6ICVzAFdTU0s6IGVycm9yOiAlcwBmYWlsOiAlcwBXU1NLLUg6IGZhaWxlZCBwYXJzaW5nIGNvbm4gc3RyaW5nOiAlcwBkZXZpY2UgZGVzdHJveWVkOiAlcwBkZXZpY2UgY3JlYXRlZDogJXMAdHNhZ2c6ICVzLyVkOiAlcwBKU0NSOiAlcwB0c2FnZzogJXMgKCVzLyVkKTogJXMAd3Nza19jb25uc3RyAG1hcmtfcHRyAHdyaXRlIGVycgB0YWcgZXJyb3IAZGV2c19qZF9nZXRfcmVnaXN0ZXIAc2VydmljZV9oYW5kbGVfcmVnaXN0ZXIAZGV2c192YWx1ZV9mcm9tX3BvaW50ZXIAZGV2c19lbnRlcgBwb3RlbnRpb21ldGVyAHB1bHNlT3hpbWV0ZXIAZGVwbG95X2hhbmRsZXIAZGVwbG95X21ldGFfaGFuZGxlcgByb3RhcnlFbmNvZGVyAGZyZWVfZmliZXIAamRfc2hhMjU2X3NldHVwACFzd2VlcABkZXZzX3ZtX3BvcF9hcmdfbWFwAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgByZS1ydW4AYnV0dG9uAG1vdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAHVucGluAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4Ac2NhbgBmbGFzaF9wcm9ncmFtAGpkX3JvbGVfZnJlZV9hbGwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAFdTU0s6IHNlbnQgYXV0aABjYW4ndCBzZW5kIGF1dGgAbWFwLT5jYXBhY2l0eSA8PSBtYXAtPmxlbmd0aABqZF9xdWV1ZV9wdXNoAGpkX3R4X2ZsdXNoAGFnZ2J1ZmZlcl9mbHVzaABkb19mbHVzaABtdWx0aXRvdWNoAHN3aXRjaABkZXZzX2pkX3NlbmRfbG9nbXNnAHNtYWxsIG1zZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmADAxMjM0NTY3ODlhYmNkZWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQBzdGF0ZSA9PSBfc3RhdGUAdGVybWluYXRlAGhlYXJ0UmF0ZQBqZF93c3NrX2Nsb3NlAGpkX29waXBlX2Nsb3NlAFdTOiBjbG9zZQBmbGFzaF9lcmFzZQBzb2lsTW9pc3R1cmUAdGVtcGVyYXR1cmUAYWlyUHJlc3N1cmUAb3BlbmluZyBkZXBsb3kgcGlwZQBjbG9zZWQgZGVwbG95IHBpcGUAdXB0aW1lAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBiYWQgbWFnaWMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV91dGlsLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBqYWNkYWMtYy9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBKQUNTX0dDX1RBR19CWVRFUwBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBlQ08yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAYXJnMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIEpBQ1NfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpICE9IDAAL3dzc2svAHdzOi8vAGRldnNfaXNfYnVmZmVyKGN0eCwgdikAc2l6ZSA+IHNpemVvZihkZXZzX2ltZ19oZWFkZXJfdCkAZGV2czogT09NICgldSBieXRlcykAV1NTSzogcHJvY2VzcyBoZWxsbyAoJWQgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgYXV0aCAoJWQgYnl0ZXMpAGFnZ2J1ZjogdXBsOiAnJXMnICVmICglLXMpAFdTU0stSDogc3RhdHVzICVkICglcykAKG51bGwpAGlkeCA8IGRldnNfaW1nX251bV9zdHJpbmdzKCZjdHgtPmltZykAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAR0VUX1RBRyhiLT5oZWFkZXIpID09IChKQUNTX0dDX1RBR19NQVNLX1BJTk5FRCB8IEpBQ1NfR0NfVEFHX0JZVEVTKQB0eXBlICYgKEpBQ1NfSEFORExFX0dDX01BU0sgfCBKQUNTX0hBTkRMRV9JTUdfTUFTSykAV1M6IHRleHQgbWVzc2FnZT8hICclcycAemVy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AABSAAAAUwAAAFQAAABVAAAAVgAAAFcAAABYAAAAWQAAAFoAAABbAAAAXAAAAF0AAABeAAAAXwAAAGAAAABhAAAAYgAAAGMAAABkAAAAZQAAAGYAAABnAAAAaAAAAGkAAAAMAAAAAAAAAAUAAAAAAAAAAAAAAHsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAB9AAAAyFEAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBJAADAU1AAAEGIlAELAACOx4CAAARuYW1lAahG4gMABWFib3J0ASBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQIhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAxplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQQYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3BTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkBzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQINWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkCQRleGl0ChNfZGV2c19wYW5pY19oYW5kbGVyCw1lbV9zZW5kX2ZyYW1lDBBlbV9jb25zb2xlX2RlYnVnDQtlbV90aW1lX25vdw4TZGV2c19kZXBsb3lfaGFuZGxlcg8UamRfY3J5cHRvX2dldF9yYW5kb20QD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUC3NldFRlbXBSZXQwFRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxYRX193YXNtX2NhbGxfY3RvcnMXFGFwcF9nZXRfZGV2aWNlX2NsYXNzGAhod19wYW5pYxkIamRfYmxpbmsaB2pkX2dsb3cbFGpkX2FsbG9jX3N0YWNrX2NoZWNrHAhqZF9hbGxvYx0HamRfZnJlZR4NdGFyZ2V0X2luX2lycR8SdGFyZ2V0X2Rpc2FibGVfaXJxIBF0YXJnZXRfZW5hYmxlX2lycSETamRfc2V0dGluZ3NfZ2V0X2JpbiITamRfc2V0dGluZ3Nfc2V0X2JpbiMXamRfd2Vic29ja19zZW5kX21lc3NhZ2UkDmpkX3dlYnNvY2tfbmV3JQZvbm9wZW4mB29uZXJyb3InB29uY2xvc2UoCW9ubWVzc2FnZSkQamRfd2Vic29ja19jbG9zZSoHdHhfaW5pdCsPamRfcGFja2V0X3JlYWR5LAp0eF9wcm9jZXNzLRJkZXZzX3BhbmljX2hhbmRsZXIuEGpkX2VtX3NlbmRfZnJhbWUvGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyMBpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZzEKamRfZW1faW5pdDINamRfZW1fcHJvY2VzczMFZG1lc2c0FGpkX2VtX2ZyYW1lX3JlY2VpdmVkNRFqZF9lbV9kZXZzX2RlcGxveTYRamRfZW1fZGV2c192ZXJpZnk3GGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTgMaHdfZGV2aWNlX2lkOQx0YXJnZXRfcmVzZXQ6DnRpbV9nZXRfbWljcm9zOxJqZF90Y3Bzb2NrX3Byb2Nlc3M8DWZsYXNoX3Byb2dyYW09C2ZsYXNoX2VyYXNlPgpmbGFzaF9zeW5jPxlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyQBFhcHBfaW5pdF9zZXJ2aWNlc0ESZGV2c19jbGllbnRfZGVwbG95QhRjbGllbnRfZXZlbnRfaGFuZGxlckMLYXBwX3Byb2Nlc3NEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemVFFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGVGD3JvbGVtZ3JfcHJvY2Vzc0cQcm9sZW1ncl9hdXRvYmluZEgVcm9sZW1ncl9oYW5kbGVfcGFja2V0SRRqZF9yb2xlX21hbmFnZXJfaW5pdEoYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkSw1qZF9yb2xlX2FsbG9jTBBqZF9yb2xlX2ZyZWVfYWxsTRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kThJqZF9yb2xlX2J5X3NlcnZpY2VPE2pkX2NsaWVudF9sb2dfZXZlbnRQE2pkX2NsaWVudF9zdWJzY3JpYmVRFGpkX2NsaWVudF9lbWl0X2V2ZW50UhRyb2xlbWdyX3JvbGVfY2hhbmdlZFMQamRfZGV2aWNlX2xvb2t1cFQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlVRNqZF9zZXJ2aWNlX3NlbmRfY21kVhFqZF9jbGllbnRfcHJvY2Vzc1cOamRfZGV2aWNlX2ZyZWVYF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0WQ9qZF9kZXZpY2VfYWxsb2NaDmRldnNfc3RyZm9ybWF0Ww9kZXZzX2NyZWF0ZV9jdHhcCXNldHVwX2N0eF0KZGV2c190cmFjZV4PZGV2c19lcnJvcl9jb2RlXxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyYAljbGVhcl9jdHhhDWRldnNfZnJlZV9jdHhiDmRldnNfdHJ5X2FsbG9jYwhkZXZzX29vbWQJZGV2c19mcmVlZQtkZXZzX3ZlcmlmeWYWZGV2c192YWx1ZV9mcm9tX2RvdWJsZWcTZGV2c192YWx1ZV9mcm9tX2ludGgUZGV2c192YWx1ZV9mcm9tX2Jvb2xpF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyahFkZXZzX3ZhbHVlX3RvX2ludGsUZGV2c192YWx1ZV90b19kb3VibGVsEmRldnNfdmFsdWVfdG9fYm9vbG0OZGV2c19pc19idWZmZXJuEGRldnNfYnVmZmVyX2RhdGFvFGRldnNfdmFsdWVfdG9fZ2Nfb2JqcBFkZXZzX3ZhbHVlX3R5cGVvZnEPZGV2c19pc19udWxsaXNochBkZXZzX2ZpYmVyX3lpZWxkcxZkZXZzX2ZpYmVyX2NvcHlfcGFyYW1zdBhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb251GGRldnNfZmliZXJfc2V0X3dha2VfdGltZXYQZGV2c19maWJlcl9zbGVlcHcbZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxseBpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3kSZGV2c19maWJlcl9ieV9maWR4ehFkZXZzX2ZpYmVyX2J5X3RhZ3sQZGV2c19maWJlcl9zdGFydHwUZGV2c19maWJlcl90ZXJtaWFudGV9DmRldnNfZmliZXJfcnVufhNkZXZzX2ZpYmVyX3N5bmNfbm93fwpkZXZzX3BhbmljgAEVX2RldnNfcnVudGltZV9mYWlsdXJlgQEPZGV2c19maWJlcl9wb2tlggEcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY4MBD3RzYWdnX2NsaWVudF9ldoQBCmFkZF9zZXJpZXOFAQ10c2FnZ19wcm9jZXNzhgEKbG9nX3Nlcmllc4cBE3RzYWdnX2hhbmRsZV9wYWNrZXSIARRsb29rdXBfb3JfYWRkX3Nlcmllc4kBCnRzYWdnX2luaXSKAQx0c2FnZ191cGRhdGWLARRkZXZzX2pkX2dldF9yZWdpc3RlcowBFmRldnNfamRfY2xlYXJfcGt0X2tpbmSNARBkZXZzX2pkX3NlbmRfY21kjgETZGV2c19qZF9zZW5kX2xvZ21zZ48BDWhhbmRsZV9sb2dtc2eQARJkZXZzX2pkX3Nob3VsZF9ydW6RARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZZIBE2RldnNfamRfcHJvY2Vzc19wa3STARRkZXZzX2pkX3JvbGVfY2hhbmdlZJQBFGRldnNfamRfcmVzZXRfcGFja2V0lQESZGV2c19qZF9pbml0X3JvbGVzlgESZGV2c19qZF9mcmVlX3JvbGVzlwEQZGV2c19zZXRfbG9nZ2luZ5gBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc5kBDGRldnNfbWFwX3NldJoBDGRldnNfbWFwX2dldJsBCmRldnNfaW5kZXicAQ5kZXZzX2luZGV4X3NldJ0BEWRldnNfYXJyYXlfaW5zZXJ0ngEOYWdnYnVmZmVyX2luaXSfAQ9hZ2didWZmZXJfZmx1c2igARBhZ2didWZmZXJfdXBsb2FkoQEMZXhwcl9pbnZhbGlkogEQZXhwcnhfbG9hZF9sb2NhbKMBEWV4cHJ4X2xvYWRfZ2xvYmFspAERZXhwcjNfbG9hZF9idWZmZXKlAQ1leHByeF9saXRlcmFspgERZXhwcnhfbGl0ZXJhbF9mNjSnAQ1leHByMF9yZXRfdmFsqAEMZXhwcjJfc3RyMGVxqQEXZXhwcjFfcm9sZV9pc19jb25uZWN0ZWSqAQ5leHByMF9wa3Rfc2l6ZasBEWV4cHIwX3BrdF9ldl9jb2RlrAEWZXhwcjBfcGt0X3JlZ19nZXRfY29kZa0BCWV4cHIwX25hbq4BCWV4cHIxX2Fic68BDWV4cHIxX2JpdF9ub3SwAQpleHByMV9jZWlssQELZXhwcjFfZmxvb3KyAQhleHByMV9pZLMBDGV4cHIxX2lzX25hbrQBC2V4cHIxX2xvZ19ltQEJZXhwcjFfbmVntgEJZXhwcjFfbm90twEMZXhwcjFfcmFuZG9tuAEQZXhwcjFfcmFuZG9tX2ludLkBC2V4cHIxX3JvdW5kugENZXhwcjFfdG9fYm9vbLsBCWV4cHIyX2FkZLwBDWV4cHIyX2JpdF9hbmS9AQxleHByMl9iaXRfb3K+AQ1leHByMl9iaXRfeG9yvwEJZXhwcjJfZGl2wAEIZXhwcjJfZXHBAQpleHByMl9pZGl2wgEKZXhwcjJfaW11bMMBCGV4cHIyX2xlxAEIZXhwcjJfbHTFAQlleHByMl9tYXjGAQlleHByMl9taW7HAQlleHByMl9tdWzIAQhleHByMl9uZckBCWV4cHIyX3Bvd8oBEGV4cHIyX3NoaWZ0X2xlZnTLARFleHByMl9zaGlmdF9yaWdodMwBGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkzQEJZXhwcjJfc3VizgEQZXhwcnhfbG9hZF9wYXJhbc8BDGV4cHIwX25vd19tc9ABFmV4cHIxX2dldF9maWJlcl9oYW5kbGXRARVleHByMF9wa3RfcmVwb3J0X2NvZGXSARZleHByMF9wa3RfY29tbWFuZF9jb2Rl0wERZXhwcnhfc3RhdGljX3JvbGXUARNleHByeF9zdGF0aWNfYnVmZmVy1QEQZXhwcngxX2dldF9maWVsZNYBC2V4cHIyX2luZGV41wETZXhwcjFfb2JqZWN0X2xlbmd0aNgBEWV4cHIxX2tleXNfbGVuZ3Ro2QEMZXhwcjFfdHlwZW9m2gEKZXhwcjBfbnVsbNsBDWV4cHIxX2lzX251bGzcARBleHByMF9wa3RfYnVmZmVy3QEKZXhwcjBfdHJ1Zd4BC2V4cHIwX2ZhbHNl3wEPc3RtdDFfd2FpdF9yb2xl4AENc3RtdDFfc2xlZXBfc+EBDnN0bXQxX3NsZWVwX21z4gEPc3RtdDNfcXVlcnlfcmVn4wEOc3RtdDJfc2VuZF9jbWTkARNzdG10NF9xdWVyeV9pZHhfcmVn5QERc3RtdHgyX2xvZ19mb3JtYXTmAQ1zdG10eDNfZm9ybWF05wEWc3RtdDFfc2V0dXBfcGt0X2J1ZmZlcugBDXN0bXQyX3NldF9wa3TpAQpzdG10NV9ibGl06gELc3RtdHgyX2NhbGzrAQ5zdG10eDNfY2FsbF9iZ+wBDHN0bXQxX3JldHVybu0BCXN0bXR4X2ptcO4BDHN0bXR4MV9qbXBfeu8BC3N0bXQxX3Bhbmlj8AESc3RtdHgxX3N0b3JlX2xvY2Fs8QETc3RtdHgxX3N0b3JlX2dsb2JhbPIBEnN0bXQ0X3N0b3JlX2J1ZmZlcvMBEnN0bXR4MV9zdG9yZV9wYXJhbfQBFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcvUBD3N0bXQwX2FsbG9jX21hcPYBEXN0bXQxX2FsbG9jX2FycmF59wESc3RtdDFfYWxsb2NfYnVmZmVy+AEQc3RtdHgyX3NldF9maWVsZPkBD3N0bXQzX2FycmF5X3NldPoBEnN0bXQzX2FycmF5X2luc2VydPsBFWV4cHJ4X3N0YXRpY19mdW5jdGlvbvwBCmV4cHIyX2ltb2T9AQxleHByMV90b19pbnT+AQxzdG10NF9tZW1zZXT/AQ9qZF9nY190cnlfYWxsb2OAAgl0cnlfYWxsb2OBAgdkZXZzX2djggIPZmluZF9mcmVlX2Jsb2NrgwILamRfZ2NfdW5waW6EAgpqZF9nY19mcmVlhQISZGV2c19tYXBfdHJ5X2FsbG9jhgIUZGV2c19hcnJheV90cnlfYWxsb2OHAhVkZXZzX2J1ZmZlcl90cnlfYWxsb2OIAg9kZXZzX2djX3NldF9jdHiJAg5kZXZzX2djX2NyZWF0ZYoCD2RldnNfZ2NfZGVzdHJveYsCBHNjYW6MAhNzY2FuX2FycmF5X2FuZF9tYXJrjQINY29uc3VtZV9jaHVua44CDXNoYV8yNTZfY2xvc2WPAg9qZF9zaGEyNTZfc2V0dXCQAhBqZF9zaGEyNTZfdXBkYXRlkQIQamRfc2hhMjU2X2ZpbmlzaJICFGpkX3NoYTI1Nl9obWFjX3NldHVwkwIVamRfc2hhMjU2X2htYWNfZmluaXNolAIOamRfc2hhMjU2X2hrZGaVAhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc5YCDmRldnNfYnVmZmVyX29wlwIQZGV2c19yZWFkX251bWJlcpgCD2pkX3NldHRpbmdzX2dldJkCD2pkX3NldHRpbmdzX3NldJoCEmRldnNfcmVnY2FjaGVfZnJlZZsCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGycAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZJ0CE2RldnNfcmVnY2FjaGVfYWxsb2OeAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cJ8CEWRldnNfcmVnY2FjaGVfYWdloAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWhAhJkZXZzX3JlZ2NhY2hlX25leHSiAhdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc6MCB3RyeV9ydW6kAgxzdG9wX3Byb2dyYW2lAhxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0pgIcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZacCGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaKgCHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0qQIOZGVwbG95X2hhbmRsZXKqAhNkZXBsb3lfbWV0YV9oYW5kbGVyqwIWZGV2aWNlc2NyaXB0bWdyX2RlcGxveawCFGRldmljZXNjcmlwdG1ncl9pbml0rQIZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldq4CEWRldnNjbG91ZF9wcm9jZXNzrwIXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXSwAhNkZXZzY2xvdWRfb25fbWV0aG9ksQIOZGV2c2Nsb3VkX2luaXSyAg9kZXZzX3ZtX3BvcF9hcmezAhNkZXZzX3ZtX3BvcF9hcmdfdTMytAITZGV2c192bV9wb3BfYXJnX2kzMrUCFGRldnNfdm1fcG9wX2FyZ19mdW5jtgITZGV2c192bV9wb3BfYXJnX2Y2NLcCFmRldnNfdm1fcG9wX2FyZ19idWZmZXK4AhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGG5AhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4ugIUZGV2c192bV9wb3BfYXJnX3JvbGW7AhNkZXZzX3ZtX3BvcF9hcmdfbWFwvAIMQUVTX2luaXRfY3R4vQIPQUVTX0VDQl9lbmNyeXB0vgIQamRfYWVzX3NldHVwX2tleb8CDmpkX2Flc19lbmNyeXB0wAIQamRfYWVzX2NsZWFyX2tlecECEGpkX3dzc2tfb25fZXZlbnTCAgpzZW5kX2VtcHR5wwISd3Nza2hlYWx0aF9wcm9jZXNzxAIXamRfdGNwc29ja19pc19hdmFpbGFibGXFAhR3c3NraGVhbHRoX3JlY29ubmVjdMYCGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldMcCD3NldF9jb25uX3N0cmluZ8gCEWNsZWFyX2Nvbm5fc3RyaW5nyQIPd3Nza2hlYWx0aF9pbml0ygITd3Nza19wdWJsaXNoX3ZhbHVlc8sCEHdzc2tfcHVibGlzaF9iaW7MAhF3c3NrX2lzX2Nvbm5lY3RlZM0CE3dzc2tfcmVzcG9uZF9tZXRob2TOAhJqZF9hZXNfY2NtX2VuY3J5cHTPAhJqZF9hZXNfY2NtX2RlY3J5cHTQAgtqZF93c3NrX25ld9ECFGpkX3dzc2tfc2VuZF9tZXNzYWdl0gITamRfd2Vic29ja19vbl9ldmVudNMCB2RlY3J5cHTUAg1qZF93c3NrX2Nsb3Nl1QINamRfcmVzcG9uZF91ONYCDmpkX3Jlc3BvbmRfdTE21wIOamRfcmVzcG9uZF91MzLYAhFqZF9yZXNwb25kX3N0cmluZ9kCF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk2gILamRfc2VuZF9wa3TbAhFqZF9vcGlwZV9vcGVuX2NtZNwCFGpkX29waXBlX29wZW5fcmVwb3J03QIWamRfb3BpcGVfaGFuZGxlX3BhY2tldN4CEWpkX29waXBlX3dyaXRlX2V43wIQamRfb3BpcGVfcHJvY2Vzc+ACFGpkX29waXBlX2NoZWNrX3NwYWNl4QIOamRfb3BpcGVfd3JpdGXiAg5qZF9vcGlwZV9jbG9zZeMCDWpkX2lwaXBlX29wZW7kAhZqZF9pcGlwZV9oYW5kbGVfcGFja2V05QIOamRfaXBpcGVfY2xvc2XmAg1qZF9xdWV1ZV9wdXNo5wIOamRfcXVldWVfZnJvbnToAg5qZF9xdWV1ZV9zaGlmdOkCDmpkX3F1ZXVlX2FsbG9j6gIdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzrAhdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcuwCGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTtAhRqZF9hcHBfaGFuZGxlX3BhY2tldO4CFWpkX2FwcF9oYW5kbGVfY29tbWFuZO8CE2pkX2FsbG9jYXRlX3NlcnZpY2XwAhBqZF9zZXJ2aWNlc19pbml08QIOamRfcmVmcmVzaF9ub3fyAhlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk8wIUamRfc2VydmljZXNfYW5ub3VuY2X0AhdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZfUCEGpkX3NlcnZpY2VzX3RpY2v2AhVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmf3AhpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZfgCEmFwcF9nZXRfZndfdmVyc2lvbvkCFmFwcF9nZXRfZGV2X2NsYXNzX25hbWX6AhJqZF9udW1mbXRfaXNfdmFsaWT7AhVqZF9udW1mbXRfd3JpdGVfZmxvYXT8AhNqZF9udW1mbXRfd3JpdGVfaTMy/QISamRfbnVtZm10X3JlYWRfaTMy/gIUamRfbnVtZm10X3JlYWRfZmxvYXT/Ag1qZF9oYXNoX2ZudjFhgAMMamRfZGV2aWNlX2lkgQMJamRfcmFuZG9tggMIamRfY3JjMTaDAw5qZF9jb21wdXRlX2NyY4QDDmpkX3NoaWZ0X2ZyYW1lhQMOamRfcmVzZXRfZnJhbWWGAxBqZF9wdXNoX2luX2ZyYW1lhwMNamRfcGFuaWNfY29yZYgDE2pkX3Nob3VsZF9zYW1wbGVfbXOJAxBqZF9zaG91bGRfc2FtcGxligMJamRfdG9faGV4iwMLamRfZnJvbV9oZXiMAw5qZF9hc3NlcnRfZmFpbI0DB2pkX2F0b2mOAwtqZF92c3ByaW50Zo8DD2pkX3ByaW50X2RvdWJsZZADEmpkX2RldmljZV9zaG9ydF9pZJEDDGpkX3NwcmludGZfYZIDC2pkX3RvX2hleF9hkwMUamRfZGV2aWNlX3Nob3J0X2lkX2GUAwlqZF9zdHJkdXCVAw5qZF9qc29uX2VzY2FwZZYDE2pkX2pzb25fZXNjYXBlX2NvcmWXAwlqZF9tZW1kdXCYAw9qZF9jdHJsX3Byb2Nlc3OZAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXSaAwxqZF9jdHJsX2luaXSbAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlnAMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZ0DEWpkX3NlbmRfZXZlbnRfZXh0ngMKamRfcnhfaW5pdJ8DFGpkX3J4X2ZyYW1lX3JlY2VpdmVkoAMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uhAw9qZF9yeF9nZXRfZnJhbWWiAxNqZF9yeF9yZWxlYXNlX2ZyYW1lowMRamRfc2VuZF9mcmFtZV9yYXekAw1qZF9zZW5kX2ZyYW1lpQMKamRfdHhfaW5pdKYDB2pkX3NlbmSnAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjqAMPamRfdHhfZ2V0X2ZyYW1lqQMQamRfdHhfZnJhbWVfc2VudKoDC2pkX3R4X2ZsdXNoqwMQX19lcnJub19sb2NhdGlvbqwDBWR1bW15rQMIX19tZW1jcHmuAwdtZW1tb3ZlrwMGbWVtc2V0sAMKX19sb2NrZmlsZbEDDF9fdW5sb2NrZmlsZbIDDF9fc3RkaW9fc2Vla7MDDV9fc3RkaW9fd3JpdGW0Aw1fX3N0ZGlvX2Nsb3NltQMMX19zdGRpb19leGl0tgMKY2xvc2VfZmlsZbcDCV9fdG93cml0ZbgDCV9fZndyaXRleLkDBmZ3cml0ZboDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHO7AxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7wDFl9fcHRocmVhZF9tdXRleF91bmxvY2u9AwZfX2xvY2u+Aw5fX21hdGhfZGl2emVyb78DDl9fbWF0aF9pbnZhbGlkwAMDbG9nwQMFbG9nMTDCAwdfX2xzZWVrwwMGbWVtY21wxAMKX19vZmxfbG9ja8UDDF9fbWF0aF94Zmxvd8YDCmZwX2JhcnJpZXLHAwxfX21hdGhfb2Zsb3fIAwxfX21hdGhfdWZsb3fJAwRmYWJzygMDcG93ywMIY2hlY2tpbnTMAwtzcGVjaWFsY2FzZc0DBXJvdW5kzgMGc3RyY2hyzwMLX19zdHJjaHJudWzQAwZzdHJjbXDRAwZzdHJsZW7SAxJfX3dhc2lfc3lzY2FsbF9yZXTTAwhkbG1hbGxvY9QDBmRsZnJlZdUDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdYDBHNicmvXAwlfX3Bvd2lkZjLYAwlzdGFja1NhdmXZAwxzdGFja1Jlc3RvcmXaAwpzdGFja0FsbG9j2wMVZW1zY3JpcHRlbl9zdGFja19pbml03AMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZd0DGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XeAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTfAwxkeW5DYWxsX2ppamngAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp4QMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB3wMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
