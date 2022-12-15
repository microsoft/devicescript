
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB1IGAgAAhYAN/f38AYAF/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAn98AGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAh/f39/f39/fwF/YAN/f3wAYAJ/fwF8YAN/fH8AYAJ/fgBgAn98AXxgAnx8AXxgA3x+fgF8YAJ8fwF8YAR/f35/AX5gBH9+f38BfwLMhYCAABYDZW52BWFib3J0AAUDZW52E19kZXZzX3BhbmljX2hhbmRsZXIAAQNlbnYNZW1fc2VuZF9mcmFtZQABA2VudhBlbV9jb25zb2xlX2RlYnVnAAEDZW52BGV4aXQAAQNlbnYLZW1fdGltZV9ub3cAEgNlbnYTZGV2c19kZXBsb3lfaGFuZGxlcgABA2VudiBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQAGA2VudiFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQACANlbnYYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3AAQDZW52MmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnY1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQACQNlbnYaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UABgNlbnYUamRfY3J5cHRvX2dldF9yYW5kb20AAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAQDZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwAGFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAEA2VudgtzZXRUZW1wUmV0MAABFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA+eDgIAA5QMFAAEFBQgFAQEFBAEIBQUGBgEDAgEFBQIEAwMDDgUOBQUDBwUCBQUDCQYGBgYFBAQBAQIFAQMFBQQAAgABDwMJBQEBBAEIBhMUBgIHAwcBAQMCAgEBAQQDBAICAgMBBwECBwEBAQcCAgEBAwMDAwwBAQECAAEDBgEGAgICAgQDAwMCCAECABABAAcDBAYAAgEBAQIIBwcHCQkCAQMJCQACCQQDAgQFAgECARUWAwYHBwcAAAcEBwMBAgIGARERAgIHBAsEAwMGBgMDBAQGAwMBBgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAICAgICAgIAAgICAgICAgICAgICAgICAgICAgIAAAAAAAAAAgIEBAQLAAYDBAQDEAwCAgEBBQkDAAMFAAEBCAECBwEFBgMICQECBQYBAQQXAAMYAwMBCQUDBgQDBAEEAwMDAwQEBgYBAQEEBQUFBQQFBQUICAMOCAMBBAEJAAMDAAMHBAkZGgMDDwQDBgMFBQcFBAQIAQQEBQkFCAEFCAQGBgYEAQ0GBAUBBAYJBQQEAQsKCgoNBggbCgsLChwPHQoDAwMEBAQBCAQeCAEEBQgICB8MIASHgICAAAFwAYIBggEFhoCAgAABAYACgAIGk4CAgAADfwFB4KzBAgt/AUEAC38BQQALB/qDgIAAGAZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAWEF9fZXJybm9fbG9jYXRpb24AxAMZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEABm1hbGxvYwDsAwRmcmVlAO0DGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyACkaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcAKgpqZF9lbV9pbml0ACsNamRfZW1fcHJvY2VzcwAsFGpkX2VtX2ZyYW1lX3JlY2VpdmVkAC4RamRfZW1fZGV2c19kZXBsb3kALxFqZF9lbV9kZXZzX3ZlcmlmeQAwGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveQAxDF9fc3RkaW9fZXhpdADOAytlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzANMDFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdAD0AxllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAPUDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UA9gMYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5kAPcDCXN0YWNrU2F2ZQDxAwxzdGFja1Jlc3RvcmUA8gMKc3RhY2tBbGxvYwDzAwxkeW5DYWxsX2ppamkA+QMJ+YGAgAABAEEBC4EBKDg/QEFCRkhwcXRpb3V2ywHNAc8B6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AfYB9wH4AfkB+gH7AfwB/QH+Af8BgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoAqkCqgKrAqwCrQKuAq8CsAKxArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CvwLAAsECwgLDAsQCxQLGAscCyALJAuMC5gLqAusCXOwC7QLuAu8CtQPNA8wDywMK3qqFgADlAwUAEPQDC84BAQF/AkACQAJAAkBBACgC0J4BIgNFDQAgAUEDcQ0BIAAgA2siA0EASA0CIAMgAmpBACgC1J4BSw0CAkACQCADQQdxDQAgAkUNBUEAIQMMAQtB1y1BxCRBFEGyFRCoAwALAkADQCAAIANqLQAAQf8BRw0BIANBAWoiAyACRg0FDAALAAtByhhBxCRBFkGyFRCoAwALQfEpQcQkQRBBshUQqAMAC0HnLUHEJEESQbIVEKgDAAtBkBlBxCRBE0GyFRCoAwALIAAgASACEMYDGgt3AQF/AkACQAJAQQAoAtCeASIBRQ0AIAAgAWsiAUEASA0BIAFBACgC1J4BQYBwaksNASABQf8PcQ0CIABB/wFBgBAQyAMaDwtB8SlBxCRBG0GhGxCoAwALQbEqQcQkQR1BoRsQqAMAC0HgLkHEJEEeQaEbEKgDAAsCAAsgAEEAQYCAAjYC1J4BQQBBgIACECA2AtCeAUHQngEQcwsIAEHv6Jb/AwsFABAAAAsCAAsCAAsCAAscAQF/AkAgABDsAyIBDQAQAAALIAFBACAAEMgDCwcAIAAQ7QMLBABBAAsKAEHYngEQ1AMaCwoAQdieARDVAxoLeAECf0EAIQMCQEEAKAL0ngEiBEUNAANAAkAgBCgCBCAAEOkDDQAgBCEDDAILIAQoAgAiBA0ACwtBfyEEAkAgA0UNACADKAIIIgBFDQACQCADKAIMIgQgAiAEIAJJGyIERQ0AIAEgACAEEMYDGgsgAygCDCEECyAEC6QBAQJ/AkACQAJAQQAoAvSeASIDRQ0AIAMhBANAIAQoAgQgABDpA0UNAiAEKAIAIgQNAAsLQRAQ7AMiBEUNASAEQgA3AAAgBEEIakIANwAAIAQgAzYCACAEIAAQsAM2AgRBACAENgL0ngELIAQoAggQ7QMCQAJAIAENAEEAIQBBACECDAELIAEgAhCzAyEACyAEIAI2AgwgBCAANgIIQQAPCxAAAAsGACAAEAELCAAgARACQQALEwBBACAArUIghiABrIQ3A/iUAQtoAgJ/AX4jAEEQayIBJAACQAJAIAAQ6gNBEEcNACABQQhqIAAQpwNBCEcNACABKQMIIQMMAQsgACAAEOoDIgIQmwOtQiCGIABBAWogAkF/ahCbA62EIQMLQQAgAzcD+JQBIAFBEGokAAskAAJAQQAtAPieAQ0AQQBBAToA+J4BQaw0QQAQOhC3AxCRAwsLZQEBfyMAQTBrIgAkAAJAQQAtAPieAUEBRw0AQQBBAjoA+J4BIABBK2oQnAMQrAMgAEEQakH4lAFBCBCmAyAAIABBK2o2AgQgACAAQRBqNgIAQZ0PIAAQLQsQlwMQPCAAQTBqJAALNAEBfyMAQeABayICJAAgAiABNgIMIAJBEGpBxwEgACABEKoDGiACQRBqEAMgAkHgAWokAAssAAJAIABBAmogAC0AAkEKahCeAyAALwEARg0AQf0qQQAQLUF+DwsgABC4AwsIACAAIAEQcgsJACAAIAEQ5AELCAAgACABEDcLCQBBACkD+JQBCw4AQYsMQQAQLUEAEAQAC54BAgF8AX4CQEEAKQOAnwFCAFINAAJAAkAQBUQAAAAAAECPQKIiAEQAAAAAAADwQ2MgAEQAAAAAAAAAAGZxRQ0AIACxIQEMAQtCACEBC0EAIAFChX98NwOAnwELAkACQBAFRAAAAAAAQI9AoiIARAAAAAAAAPBDYyAARAAAAAAAAAAAZnFFDQAgALEhAQwBC0IAIQELIAFBACkDgJ8BfQsCAAsUABBJEBoQ6QJB0D0QeEHQPRDRAQscAEGInwEgATYCBEEAIAA2AoifAUECQQAQUEEAC8oEAQF/IwBBEGsiBCQAAkACQAJAAkACQCABQX9qDhADAgQEBAQEBAQEBAQEBAQBAAsgAUEwRw0DQYifAS0ADEUNAwJAAkBBiJ8BKAIEQYifASgCCCICayIBQeABIAFB4AFIGyIBDQBBiJ8BQRRqEIADIQIMAQtBiJ8BQRRqQQAoAoifASACaiABEP8CIQILIAINA0GInwFBiJ8BKAIIIAFqNgIIIAENA0HmG0EAEC1BiJ8BQYACOwEMQQAQBgwDCyACRQ0CQQAoAoifAUUNAkGInwEoAhAgAkcNAgJAIAMtAANBAXENACADLwEOQYABRw0AQdIbQQAQLUGInwFBFGogAxD6Ag0AQYifAUEBOgAMC0GInwEtAAxFDQICQAJAQYifASgCBEGInwEoAggiAmsiAUHgASABQeABSBsiAQ0AQYifAUEUahCAAyECDAELQYifAUEUakEAKAKInwEgAmogARD/AiECCyACDQJBiJ8BQYifASgCCCABajYCCCABDQJB5htBABAtQYifAUGAAjsBDEEAEAYMAgtBiJ8BKAIQIgFFDQEgAUEAIAEtAARrQQxsakFcaiACRw0BQfEzQRNBAUEAKALglAEQ0gMaQYifAUEANgIQDAELQQAoAoifAUUNAEGInwEoAhANACACKQMIEJwDUQ0AQYifASACQavU04kBEFQiATYCECABRQ0AIARBC2ogAikDCBCsAyAEIARBC2o2AgBBkhAgBBAtQYifASgCEEGAAUGInwFBBGpBBBBVGgsgBEEQaiQACy4AEDwQNQJAQaShAUGIJxCkA0UNAEH5G0EAKQOopgG6RAAAAAAAQI9AoxDSAQsLFwBBACAANgKsoQFBACABNgKooQEQvgMLCwBBAEEBOgCwoQELVwECfwJAQQAtALChAUUNAANAQQBBADoAsKEBAkAQwQMiAEUNAAJAQQAoAqyhASIBRQ0AQQAoAqihASAAIAEoAgwRAwAaCyAAEMIDC0EALQCwoQENAAsLCyABAX8CQEEAKAK0oQEiAg0AQX8PCyACKAIAIAAgARAHC9YCAQN/IwBB0ABrIgQkAAJAAkACQAJAEAgNAEGIHkEAEC1BfyECDAELAkBBACgCtKEBIgVFDQAgBSgCACIGRQ0AIAZB6AdBhjQQDhogBUEANgIEIAVBADYCAEEAQQA2ArShAQtBAEEIECAiBTYCtKEBIAUoAgANASAAQaUKEOkDIQYgBCACNgIsIAQgATYCKCAEIAA2AiQgBEGlDUGiDSAGGzYCIEGCDyAEQSBqEK0DIQEgBEEBNgJIIAQgAzYCRCAEIAE2AkBBACECIARBwABqEAkiAEEATA0CIAAgBUEDQQIQChogACAFQQRBAhALGiAAIAVBBUECEAwaIAAgBUEGQQIQDRogBSAANgIAIAQgATYCAEGwDyAEEC0gARAhCyAEQdAAaiQAIAIPCyAEQcUsNgIwQdcQIARBMGoQLRAAAAsgBEH7KzYCEEHXECAEQRBqEC0QAAALKgACQEEAKAK0oQEgAkcNAEGlHkEAEC0gAkEBNgIEQQFBAEEAEN4CC0EBCyMAAkBBACgCtKEBIAJHDQBB5jNBABAtQQNBAEEAEN4CC0EBCyoAAkBBACgCtKEBIAJHDQBBkRtBABAtIAJBADYCBEECQQBBABDeAgtBAQtTAQF/IwBBEGsiAyQAAkBBACgCtKEBIAJHDQAgASgCBCECAkAgASgCDEUNACADIAI2AgBBxDMgAxAtDAELQQQgAiABKAIIEN4CCyADQRBqJABBAQs/AQJ/AkBBACgCtKEBIgBFDQAgACgCACIBRQ0AIAFB6AdBhjQQDhogAEEANgIEIABBADYCAEEAQQA2ArShAQsLDQAgACgCBBDqA0ENagtrAgN/AX4gACgCBBDqA0ENahAgIQECQCAAKAIQIgJFDQAgAkEAIAItAAQiA2tBDGxqQWRqKQMAIQQgASADOgAMIAEgBDcDAAsgASAAKAIINgIIIAAoAgQhACABQQ1qIAAgABDqAxDGAxogAQvaAgIGfwF+AkACQCAAKAKgAiIBRQ0AIABBGGohAgNAAkAgAiABKAIEEOoDQQ1qIgMQ/gIiBEUNACAEQQFGDQIgAEEANgKgAiACEIADGgwCCyABKAIEEOoDQQ1qECAhBAJAIAEoAhAiBUUNACAFQQAgBS0ABCIGa0EMbGpBZGopAwAhByAEIAY6AAwgBCAHNwMACyAEIAEoAgg2AgggASgCBCEFIARBDWogBSAFEOoDEMYDGiACIAQgAxD/Ag0CIAQQIQJAIAEoAgAiAUUNAANAIAEtAAxBAXFFDQEgASgCACIBDQALCyAAIAE2AqACAkAgAQ0AIAIQgAMaCyAAKAKgAiIBDQALCwJAIABBEGpBoOg7EKUDRQ0AIAAQRwsCQCAAQRRqQdCGAxClA0UNACAALQAIRQ0AIABBADoACCAAQQNBAEEAELYDCw8LQassQdwiQZIBQbsNEKgDAAvRAwEJfyMAQSBrIgEkAAJAAkACQCAALQAGRQ0AIAAtAAkNASAAQQE6AAkCQCAAKAIMIgJFDQADQAJAIAIoAhANAAJAAkBBACgCxKEBIgMNAEEJIQQMAQsDQEEBIQUCQAJAIAMtABBBAUsNAEEMIQQMAQsDQEEAIQQCQAJAIAMgBUEMbGoiBkEkaiIHKAIAIAIoAghGDQBBASEIDAELQQEhCCAGQSlqIgktAABBAXENAEEPIQQCQCACKAIQIgggB0cNAEEAIQgMAQsCQCAIRQ0AIAggCC0ABUH+AXE6AAULIAkgCS0AAEEBcjoAAEEAIQggAUEbaiAHQQAgBkEoaiIGLQAAa0EMbGpBZGopAwAQrAMgAigCBCEJIAEgBi0AADYCCCABIAk2AgAgASABQRtqNgIEQZUgIAEQLSACIAc2AhAgAEEBOgAIIAIQUgsgCEUNASAFQQFqIgUgAy0AEEkNAAtBDCEECyAEQQxHDQEgAygCACIDDQALQQkhBAsgBEF3ag4HAAICAgICAAILIAIoAgAiAg0ACwsgAC0ACUUNAiAAQQA6AAkLIAFBIGokAA8LQdMeQdwiQc4AQZEdEKgDAAtB1B5B3CJB4ABBkR0QqAMAC4EFAgR/AX4jAEHAAGsiAiQAAkAgAC0ACQ0AAkACQAJAAkACQCABLwEOQf9+ag4EAQMCAAMLIAAoAgwiA0UNAwNAAkAgAygCECIERQ0AIAQgBC0ABUH+AXE6AAUgAiADKAIENgIAQYQQIAIQLSADQQA2AhAgAEEBOgAIIAMQUgsgAygCACIDDQAMBAsACwJAIAAoAgwiA0UNACABQRlqIQQgAS0ADEFwaiEFA0AgAygCBCAEIAUQ3ANFDQEgAygCACIDDQALCyADRQ0CAkAgASkDECIGQgBSDQAgAygCECIERQ0DIAQgBC0ABUH+AXE6AAUgAiADKAIENgIQQYQQIAJBEGoQLSADQQA2AhAgAEEBOgAIIAMQUgwDCwJAAkAgBhBTIgQNAEEAIQQMAQsgBCABQRhqLQAAIgVBDGxqQSRqQQAgBC0AECAFSxshBAsgBEUNAiADKAIQIgUgBEYNAgJAIAVFDQAgBSAFLQAFQf4BcToABQsgBCAELQAFQQFyOgAFIAJBO2ogBEEAIAQtAARrQQxsakFkaikDABCsAyADKAIEIQUgAiAELQAENgIoIAIgBTYCICACIAJBO2o2AiRBlSAgAkEgahAtIAMgBDYCECAAQQE6AAggAxBSDAILIABBGGoiBCABEPkCDQECQCAAKAIMIgNFDQADQCADLQAMQQFxRQ0BIAMoAgAiAw0ACwsgACADNgKgAiADDQEgBBCAAxoMAQsgAEEBOgAHAkAgACgCDCIDRQ0AAkADQCADKAIQRQ0BIAMoAgAiA0UNAgwACwALIABBADoABwsgACABQcA0EIsDGgsgAkHAAGokAA8LQdMeQdwiQbgBQeoMEKgDAAsrAQF/QQBBzDQQkAMiADYCuKEBIABBAToABiAAQQAoAvCeAUGg6DtqNgIQC8wBAQR/IwBBEGsiASQAAkACQEEAKAK4oQEiAi0ACQ0AIAJBAToACQJAIAIoAgwiA0UNAANAAkAgAygCECIERQ0AIARBACAELQAEa0EMbGpBXGogAEcNACAEIAQtAAVB/gFxOgAFIAEgAygCBDYCAEGEECABEC0gA0EANgIQIAJBAToACCADEFILIAMoAgAiAw0ACwsgAi0ACUUNASACQQA6AAkgAUEQaiQADwtB0x5B3CJB4QFB3R0QqAMAC0HUHkHcIkHnAUHdHRCoAwALhQIBBH8CQAJAAkBBACgCuKEBIgJFDQAgABDqAyEDAkAgAigCDCIERQ0AA0AgBCgCBCAAIAMQ3ANFDQEgBCgCACIEDQALCyAEDQEgAi0ACQ0CIAJBDGohAwJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahCAAxoLQRQQICIFIAE2AgggBSAANgIEAkAgAygCACIERQ0AIAAgBCgCBBDpA0F/TA0AA0AgBCIDKAIAIgRFDQEgACAEKAIEEOkDQX9KDQALCyAFIAQ2AgAgAyAFNgIAIAJBAToACCAFDwtB3CJB9QFByyAQowMAC0HcIkH4AUHLIBCjAwALQdMeQdwiQesBQa8KEKgDAAu9AgEEfyMAQRBrIgAkAAJAAkACQEEAKAK4oQEiAS0ACQ0AAkAgASgCoAJFDQAgAUEANgKgAiABQRhqEIADGgsgAS0ACQ0BIAFBAToACQJAIAEoAgwiAkUNAANAAkAgAigCECIDRQ0AIAMgAy0ABUH+AXE6AAUgACACKAIENgIAQYQQIAAQLSACQQA2AhAgAUEBOgAIIAIQUgsgAigCACICDQALCyABLQAJRQ0CIAFBADoACQJAIAEoAgwiAkUNAANAAkAgAigCECIDRQ0AIAMgAy0ABUH+AXE6AAULIAEgAigCADYCDCACQQA2AgQgAhAhIAEoAgwiAg0ACwsgAUEBOgAIIABBEGokAA8LQdMeQdwiQesBQa8KEKgDAAtB0x5B3CJBsgJBxRUQqAMAC0HUHkHcIkG1AkHFFRCoAwALCwBBACgCuKEBEEcLLgEBfwJAQQAoArihASgCDCIBRQ0AA0AgASgCECAARg0BIAEoAgAiAQ0ACwsgAQvRAQECfyMAQcAAayIDJAACQAJAAkACQAJAIABBf2oOIAABAgQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQDBAsgAyABQRRqNgIQQZwRIANBEGoQLQwDCyADIAFBFGo2AiBBhxEgA0EgahAtDAILIAMgAUEUajYCMEGoECADQTBqEC0MAQsgAi0AByEAIAIvAQQhAiADIAEtAAQiBDYCBCADIAI2AgggAyAANgIMIAMgAUEAIARrQQxsakFwajYCAEHBKCADEC0LIANBwABqJAALMQECf0EMECAhAkEAKAK8oQEhAyACIAE2AgggAiADNgIAIAIgADYCBEEAIAI2AryhAQuKAQEBfwJAAkACQEEALQDAoQFFDQBBAEEAOgDAoQEgACABIAIQT0EAKAK8oQEiAw0BDAILQdMrQdIkQeMAQewKEKgDAAsDQCADKAIIIAAgASACIAMoAgQRBwAgAygCACIDDQALCwJAQQAtAMChAQ0AQQBBAToAwKEBDwtBtCxB0iRB6QBB7AoQqAMAC44BAQJ/AkACQEEALQDAoQENAEEAQQE6AMChASAAKAIQIQFBAEEAOgDAoQECQEEAKAK8oQEiAkUNAANAIAIoAghBwAAgASAAIAIoAgQRBwAgAigCACICDQALC0EALQDAoQENAUEAQQA6AMChAQ8LQbQsQdIkQe0AQeIeEKgDAAtBtCxB0iRB6QBB7AoQqAMACzEBAX8CQEEAKALEoQEiAUUNAANAAkAgASkDCCAAUg0AIAEPCyABKAIAIgENAAsLQQALTQECfwJAIAAtABAiAkUNAEEAIQMDQAJAIAAgA0EMbGpBJGooAgAgAUcNACAAIANBDGxqQSRqQQAgABsPCyADQQFqIgMgAkcNAAsLQQALYgICfwF+IANBEGoQICIEQQE6AAMgAEEAIAAtAAQiBWtBDGxqQWRqKQMAIQYgBCABOwEOIAQgBToADSAEIAY3AgQgBCADOgAMIARBEGogAiADEMYDGiAEEIoDIQMgBBAhIAMLsAIBAn8CQAJAAkBBAC0AwKEBDQBBAEEBOgDAoQECQEHIoQFB4KcSEKUDRQ0AAkADQEEAKALEoQEiAEUNAUEAKALwngEgACgCHGtBAEgNAUEAIAAoAgA2AsShASAAEFcMAAsAC0EAKALEoQEiAEUNAANAIAAoAgAiAUUNAQJAQQAoAvCeASABKAIca0EASA0AIAAgASgCADYCACABEFcLIAAoAgAiAA0ACwtBAC0AwKEBRQ0BQQBBADoAwKEBAkBBACgCvKEBIgBFDQADQCAAKAIIQTBBAEEAIAAoAgQRBwAgACgCACIADQALC0EALQDAoQENAkEAQQA6AMChAQ8LQbQsQdIkQZQCQakNEKgDAAtB0ytB0iRB4wBB7AoQqAMAC0G0LEHSJEHpAEHsChCoAwALiAIBA38jAEEQayIBJAACQAJAAkBBAC0AwKEBRQ0AQQBBADoAwKEBIAAQSkEALQDAoQENASABIABBFGo2AgBBAEEAOgDAoQFBhxEgARAtAkBBACgCvKEBIgJFDQADQCACKAIIQQIgAEEAIAIoAgQRBwAgAigCACICDQALC0EALQDAoQENAkEAQQE6AMChAQJAIAAoAgQiAkUNAANAIAAgAigCACIDNgIEAkAgAi0AB0EFSQ0AIAIoAgwQIQsgAhAhIAMhAiADDQALCyAAECEgAUEQaiQADwtB0ytB0iRBsAFBzBwQqAMAC0G0LEHSJEGyAUHMHBCoAwALQbQsQdIkQekAQewKEKgDAAu2DAIJfwF+IwBBEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkBBAC0AwKEBDQBBAEEBOgDAoQECQCAALQADIgJBBHFFDQBBAEEAOgDAoQECQEEAKAK8oQEiA0UNAANAIAMoAghBEkEAIAAgAygCBBEHACADKAIAIgMNAAsLQQAtAMChAUUNCkG0LEHSJEHpAEHsChCoAwALQQAhBEEAIQUCQEEAKALEoQEiA0UNACAAKQIEIQoDQAJAIAMpAwggClINACADIQUMAgsgAygCACIDDQALQQAhBQsCQCAFRQ0AIAUgAC0ADUE/cSIDQQxsakEkakEAIAMgBS0AEEkbIQQLQRAhBgJAIAJBAXENAAJAIAAtAA0NACAALwEODQACQCAFDQAgABBZIQULAkAgBS8BEiIEIAAvARAiA0YNAAJAIARBD3EgA0EPcU0NAEEDIAUgABBRAkACQEEAKALEoQEiAyAFRw0AQQAgBSgCADYCxKEBDAELA0AgAyIERQ0BIAQoAgAiAyAFRw0ACyAEIAUoAgA2AgALIAUQVyAAEFkhBQwBCyAFIAM7ARILIAVBACgC8J4BQYCJ+gBqNgIcIAVBJGohBAsCQCAEDQBBACEEDAELQRAhBgJAIAAtAANBAXENACAALQANQTBLDQAgAC4BDkF/Sg0AAkAgAEEPai0AACIDIANB/wBxIgNBf2ogBS0AESIGIAZB/wFGG0EBaiICa0H/AHEiB0UNAEETIQYgAiADa0H8AHFBPEkNASAHQQVJDQELIAUgAzoAEUEQIQYLAkACQCAALQAMIghBBEkNACAALwEOQQNHDQAgAC8BECICQYDgA3FBgCBHDQJBACEHAkAgBEEAIAQtAAQiCWtBDGxqQWBqKAIAIgNFDQAgAkH/H3EhAgNAAkAgAiADLwEERw0AIAMtAAZBP3EgCUcNACADIQcMAgsgAygCACIDDQALCyAHRQ0CIAcsAAYiA0EASA0CIAcgA0GAAXI6AAZBAC0AwKEBRQ0EQQBBADoAwKEBAkBBACgCvKEBIgNFDQADQCADKAIIQSEgBCAHIAMoAgQRBwAgAygCACIDDQALC0EALQDAoQFFDQFBtCxB0iRB6QBB7AoQqAMACyAALwEOIgJBgOADcUGAIEcNAUEAIQcCQCAEQQAgBC0ABCIJa0EMbGpBYGooAgAiA0UNACACQf8fcSECA0ACQCACIAMvAQRHDQAgAy0ABkE/cSAJRw0AIAMhBwwCCyADKAIAIgMNAAsLIAdFDQECQAJAIActAAciAyAIRw0AIAdBDGohAiAAQRBqIQkCQCADQQVJDQAgAigCACECCyAJIAIgAxDcAw0AQQEhCQwBC0EAIQkLAkAgCEEFSQ0AIAMgCEYNAAJAIANBBUkNACAHKAIMECELIAcgAC0ADBAgNgIMCyAHIAAtAAwiAzoAByAHQQxqIQICQCADQQVJDQAgAigCACECCyACIABBEGogAxDGAxogCQ0BQQAtAMChAUUNBEEAQQA6AMChASAELQAEIQMgBy8BBCECIAEgBy0ABzYCDCABIAI2AgggASADNgIEIAEgBEEAIANrQQxsakFwajYCAEHBKCABEC0CQEEAKAK8oQEiA0UNAANAIAMoAghBICAEIAcgAygCBBEHACADKAIAIgMNAAsLQQAtAMChAQ0FC0EAQQE6AMChAQsCQCAERQ0AQQAtAMChAUUNBUEAQQA6AMChASAGIAQgABBPQQAoAryhASIDDQYMCQtBAC0AwKEBRQ0GQQBBADoAwKEBAkBBACgCvKEBIgNFDQADQCADKAIIQREgBSAAIAMoAgQRBwAgAygCACIDDQALC0EALQDAoQENBwwJC0G0LEHSJEG+AkHSDBCoAwALQdMrQdIkQeMAQewKEKgDAAtB0ytB0iRB4wBB7AoQqAMAC0G0LEHSJEHpAEHsChCoAwALQdMrQdIkQeMAQewKEKgDAAsDQCADKAIIIAYgBCAAIAMoAgQRBwAgAygCACIDDQAMAwsAC0HTK0HSJEHjAEHsChCoAwALQbQsQdIkQekAQewKEKgDAAtBAC0AwKEBRQ0AQbQsQdIkQekAQewKEKgDAAtBAEEAOgDAoQEgAUEQaiQAC4EEAgl/AX4jAEEQayIBJAAgAC0ADCICQQJ2IgNBDGxBKGoQICIEIAM6ABAgBCAAKQIEIgo3AwhBACEFQQAoAvCeASEGIARB/wE6ABEgBCAGQYCJ+gBqNgIcIARBFGoiByAKEKwDIAQgACgCEDsBEgJAIAJBBEkNACAAQRBqIQggA0EBIANBAUsbIQYgBEEkaiEJA0ACQAJAIAUNAEEAIQMMAQsgCCAFQQJ0aigCACEDCyAJIAVBDGxqIgIgBToABCACIAM2AgAgBUEBaiIFIAZHDQALCwJAAkBBACgCxKEBIgVFDQAgBCkDCBCcA1ENACAEQQhqIAVBCGpBCBDcA0EASA0AIARBCGohA0HEoQEhBQNAIAUoAgAiBUUNAgJAIAUoAgAiAkUNACADKQMAEJwDUQ0AIAMgAkEIakEIENwDQX9KDQELCyAEIAUoAgA2AgAgBSAENgIADAELIARBACgCxKEBNgIAQQAgBDYCxKEBCwJAAkBBAC0AwKEBRQ0AIAEgBzYCAEEAQQA6AMChAUGcESABEC0CQEEAKAK8oQEiBUUNAANAIAUoAghBASAEIAAgBSgCBBEHACAFKAIAIgUNAAsLQQAtAMChAQ0BQQBBAToAwKEBIAFBEGokACAEDwtB0ytB0iRB4wBB7AoQqAMAC0G0LEHSJEHpAEHsChCoAwALMQEBf0EAQQwQICIBNgLMoQEgASAANgIAIAEgACgCECIAQYAIIABBgAhJG0FYajsBCguOBAEKfyMAQRBrIgAkAEEAIQFBACgCzKEBIQICQBAiDQACQCACLwEIRQ0AAkAgAigCACgCDBEIAA0AQX8hAQwBCyACIAIvAQhBKGoiAzsBCCADQf//A3EQICIEQcqIiZIFNgAAIARBACkDqKYBNwAEIARBKGohBQJAAkACQCACKAIEIgFFDQBBACgCqKYBIQYDQCABKAIEIQMgBSADIAMQ6gNBAWoiBxDGAyAHaiIDIAEtAAhBGGwiCEGAgID4AHI2AAAgA0EEaiEJQQAhAwJAIAEtAAgiB0UNAANAIAEgA0EYbGpBDGoiBSAGIAUoAgBrNgIAIANBAWoiAyAHRw0ACwsgCSABQQxqIAgQxgMhCUEAIQMCQCABLQAIIgdFDQADQCABIANBGGxqQQxqIgUgBiAFKAIAazYCACADQQFqIgMgB0cNAAsLIAkgCGoiBSAEayACLwEISg0CIAEoAgAiAQ0ACwsgBSAEayACLwEIIgNGDQFByxlB9iJB/gBB9BYQqAMAC0HmGUH2IkH7AEH0FhCoAwALIAQgAyACKAIAKAIEEQMAIQEgACACLwEINgIAQZUOQfsNIAEbIAAQLSAEECEgAQ0AQQAhASACQQA7AQgDQCACKAIEIgNFDQEgAiADKAIANgIEIAMoAgQQISADECEMAAsACyAAQRBqJAAgAQ8LQfYiQdMAQfQWEKMDAAufBgIHfwF8IwBBgAFrIgMkAEEAKALMoQEhBAJAECINACAAQYY0IAAbIQUCQAJAIAFFDQBBACEGIAFBACABLQAEIgdrQQxsakFcaiEIAkAgB0ECSQ0AIAEoAgAhCUEAIQZBASEAA0AgBiAIIABBDGxqQSRqKAIAIAlGaiEGIABBAWoiACAHRw0ACwsgAyAIKQMINwN4IANB+ABqQQgQrgMhAAJAAkAgASgCABDKASIHRQ0AIAMgBygCADYCdCADIAA2AnBBlg8gA0HwAGoQrQMhByAGRQ0BIAMgBzYCYCADIAZBAWo2AmRB1R8gA0HgAGoQrQMhBwwBCyADIAEoAgA2AlQgAyAANgJQQYkJIANB0ABqEK0DIQcgBkUNACADIAc2AkAgAyAGQQFqNgJEQdsfIANBwABqEK0DIQcLIAUtAABFDQEgAyAFNgI0IAMgBzYCMEGPDyADQTBqEK0DIQcMAQsgAxCcAzcDeCADQfgAakEIEK4DIQAgAyAFNgIkIAMgADYCIEGWDyADQSBqEK0DIQcLIAIrAwghCiADQRBqIAMpA3gQrwM2AgAgAyAKOQMIIAMgBzYCAEGvMSADEC0gBCgCBCIARSEGAkAgAEUNACAAKAIEIAcQ6QNFDQADQCAAKAIAIgBFIQYgAEUNASAAKAIEIAcQ6QMNAAsLAkACQAJAIAQvAQggBxDqAyIJQQVqQQAgBhtqQRhqIgggBC8BCkoNAAJAIAZFDQBBACEADAILIAAtAAhBCEkNAQsCQAJAEFsiBkUNACAHECEMAQsgCUEdaiEIQQAhAAsgBg0BCwJAAkAgAEUNACAHECEMAQtBzAEQICIAIAc2AgQgACAEKAIENgIAIAQgADYCBAsgACAALQAIIgZBAWo6AAggACAGQRhsaiIAQQxqIAIoAiQiBjYCACAAQRBqIAIrAwi2OAIAIABBFGogAisDELY4AgAgAEEYaiACKwMYtjgCACAAQRxqIAIoAgA2AgAgAEEgaiAGIAIoAiBrNgIAIAQgCDsBCEEAIQYLIANBgAFqJAAgBg8LQfYiQaMBQY4fEKMDAAvZAgECfyMAQTBrIgYkACABKAIIKAIsIQECQAJAAkACQCACEPQCDQAgACABQeQAEIkBDAELIAYgBCkDADcDGCABIAZBGGogBkEsahDdASIHRQ0BAkBBASACQQNxdCADaiAGKAIsTQ0AAkAgBUUNACAAIAFB5wAQiQEMAgsgAEEAKQOIOTcDAAwBCyAHIANqIQMCQCAFRQ0AIAYgBCkDADcDECABIAZBEGoQ2wFFDQMgBiAFKQMANwMgAkACQCAGKAIkQX9HDQAgAyACIAYoAiAQ9gIMAQsgBiAGKQMgNwMIIAMgAiAGQQhqENgBEPUCCyAAQQApA4g5NwMADAELAkAgAkEHSw0AIAMgAhD3AiIBQf////8HakF9Sw0AIAAgARDUAQwBCyAAIAMgAhD4AhDTAQsgBkEwaiQADwtBlipBmCNBE0HTExCoAwALQeExQZgjQSBB0xMQqAMACyAAAkAgASACQQNxdg0ARAAAAAAAAPh/DwsgACACEPgCCzkBAX9BACEDAkAgACABEOQBDQBBoAcQICIDIAItAAA6ALwBIAMgAy8BBkEIcjsBBiADIAAQYAsgAwviAQECfyMAQSBrIgIkACAAIAE2AogBIAAQmAEiATYCuAECQCABIAAoAogBLwEMQQN0IgMQiwEiAQ0AIAIgAzYCEEHdMCACQRBqEC0gAEHk1AMQiAELIAAgATYCAAJAIAAoArgBIAAoAIgBQTxqKAIAQQF2Qfz///8HcSIDEIsBIgENACACIAM2AgBB3TAgAhAtIABB5NQDEIgBCyAAIAE2ApgBAkAgAC8BCA0AIAAQhwEgABClASAAEKYBIAAvAQgNACAAKAK4ASAAEJcBIABBAEEAQQBBARCEARoLIAJBIGokAAsqAQF/AkAgAC0ABkEIcQ0AIAAoAqgBIAAoAqABIgRGDQAgACAENgKoAQsLGQACQCABRQ0AIAEgAC8BCjYCAAsgAC8BCAuaAgEBfwJAAkACQCAARQ0AIAAvAQYiBEEBcQ0BIAAgBEEBcjsBBgJAAkAgAUEwRg0AIAAQhwECQAJAAkACQCABQXBqDgMAAgEDCwJAIAAtAAZBCHENACAAKAKoASAAKAKgASIBRg0AIAAgATYCqAELIAAgAiADEKMBDAQLIAAtAAZBCHENAyAAKAKoASAAKAKgASIBRg0DIAAgATYCqAEMAwsgAC0ABkEIcQ0CIAAoAqgBIAAoAqABIgFGDQIgACABNgKoAQwCCyABQcAARw0BIAAgAxCkAQwBCyAAEIoBCyAALwEGIgFBAXFFDQIgACABQf7/A3E7AQYLDwtB1ixBliFBNkHOEhCoAwALQbAvQZYhQTtBwBoQqAMAC3ABAX8gABCnAQJAIAAvAQYiAUEBcUUNAEHWLEGWIUE2Qc4SEKgDAAsgACABQQFyOwEGIABBvANqELABIAAQfyAAKAK4ASAAKAIAEJABIAAoArgBIAAoApgBEJABIAAoArgBEJkBIABBAEGgBxDIAxoLEgACQCAARQ0AIAAQZCAAECELCz8BAn8jAEEQayICJAACQCAAKAK4ASABEIsBIgMNACACIAE2AgBB3TAgAhAtIABB5NQDEIgBCyACQRBqJAAgAwsrAQF/IwBBEGsiAiQAIAIgATYCAEHdMCACEC0gAEHk1AMQiAEgAkEQaiQACw0AIAAoArgBIAEQkAELxQMBBX8jAEEQayIBJAACQCAAKAIsIgJBAEgNAAJAAkAgACgCECgCACIDKAIAQdP6qux4Rw0AIAMoAghBq5bxk3tGDQELQQAhAwsCQAJAIAMNAEEAIQQMAQsgAygCBCEECwJAIAIgBEgNACAAQTBqEIADGiAAQX82AiwMAQsCQAJAIABBMGoiBSADIAJqQYABaiAEQewBIARB7AFIGyIDEP8CDgIAAgELIAAgACgCLCADajYCLAwBCyAAQX82AiwgBRCAAxoLAkAgAEEMakGAgIAEEKUDRQ0AIAAtAAdFDQAgACgCFA0AIAAQagsCQCAAKAIUIgNFDQAgAyABQQhqEGIiA0UNACABIAEoAgg2AgQgAUEAIAMgA0Hg1ANGGzYCACAAQYABIAFBCBC2AyAAKAIUEGUgAEEANgIUAkACQCAAKAIQKAIAIgIoAgBB0/qq7HhHDQAgAigCCEGrlvGTe0YNAQtBACECCwJAAkAgAkUNAEEDIQQgAigCBA0BC0EEIQQLIAEgBDYCDCAAQQA6AAYgAEEEIAFBDGpBBBC2AyAAQQAoAvCeAUGAgMAAQYCAwAIgA0Hg1ANGG2o2AgwLIAFBEGokAAvaAgEEfyMAQRBrIgEkAAJAAkAgACgCECgCACICKAIAQdP6qux4Rw0AIAIoAghBq5bxk3tGDQELQQAhAgsCQAJAIAJFDQAgAigCBCIDRQ0AIAJBgAFqIgQgAxDkAQ0AIAIoAgQhAgJAIAAoAhQiA0UNACADEGULIAEgAC0ABDoAACAAIAQgAiABEF8iAjYCFCACRQ0BIAIgAC0ACBCoAQwBCwJAIAAoAhQiAkUNACACEGULIAEgAC0ABDoACCAAQfg0QcABIAFBCGoQXyICNgIUIAJFDQAgAiAALQAIEKgBC0EAIQICQCAAKAIUIgMNAAJAAkAgACgCECgCACIEKAIAQdP6qux4Rw0AIAQoAghBq5bxk3tGDQELQQAhBAsCQCAERQ0AQQMhAiAEKAIEDQELQQQhAgsgASACNgIMIAAgA0EARzoABiAAQQQgAUEMakEEELYDIAFBEGokAAuGAQEDfyMAQRBrIgEkACAAKAIUEGUgAEEANgIUAkACQCAAKAIQKAIAIgIoAgBB0/qq7HhHDQAgAigCCEGrlvGTe0YNAQtBACECCwJAAkAgAkUNAEEDIQMgAigCBA0BC0EEIQMLIAEgAzYCDCAAQQA6AAYgAEEEIAFBDGpBBBC2AyABQRBqJAAL+AIBBX8jAEGQAWsiASQAIAEgADYCAEEAKALQoQEhAkHtJyABEC1BfyEDAkAgAEEfcQ0AIAIoAhAoAgRBgH9qIABNDQAgAigCFBBlIAJBADYCFAJAAkAgAigCECgCACIDKAIAQdP6qux4Rw0AIAMoAghBq5bxk3tGDQELQQAhAwsCQAJAIANFDQBBAyEEIAMoAgQNAQtBBCEECyABIAQ2AghBACEDIAJBADoABiACQQQgAUEIakEEELYDIAIoAhAoAgAQGCAARQ0AIAEgADYCDCABQdP6qux4NgIIIAIoAhAoAgAgAUEIakEIEBcgAkGAATYCGEEAIQNBACEAAkAgAigCFCIEDQACQAJAIAIoAhAoAgAiBSgCAEHT+qrseEcNACAFKAIIQauW8ZN7Rg0BC0EAIQULAkAgBUUNAEEDIQAgBSgCBA0BC0EEIQALIAEgADYCjAEgAiAEQQBHOgAGIAJBBCABQYwBakEEELYDCyABQZABaiQAIAML6QMBBn8jAEGwAWsiAiQAQX8hAwJAQQAoAtChASIEKAIYIgVFDQACQCAADQAgBCgCECgCACEBIAJBKGpBAEGAARDIAxogAkGrlvGTezYCMCACIAFBgAFqIAEoAgQQmwM2AjQCQCABKAIEIgBBgAFqIgUgBCgCGCIGRg0AIAIgADYCBCACIAUgBms2AgBBszIgAhAtDAILIAFBCGogAkEoakEIakH4ABAXEBlB+RRBABAtIAQoAhQQZSAEQQA2AhQCQAJAIAQoAhAoAgAiAygCAEHT+qrseEcNACADKAIIQauW8ZN7Rg0BC0EAIQMLAkACQCADRQ0AQQMhASADKAIEDQELQQQhAQsgAiABNgKsAUEAIQMgBEEAOgAGIARBBCACQawBakEEELYDIARBA0EAQQAQtgMgBEEAKALwngE2AgwMAQsgBCgCECgCACIGKAIEQYABaiEDAkACQAJAIAFBH3ENACABQf8PSw0AIAUgAWoiByADTQ0BCyACIAM2AhggAiAFNgIUIAIgATYCEEGNMiACQRBqEC1BfyEDQQAhAQwBCwJAIAcgBXNBgBBJDQAgBiAHQYBwcWoQGAsgBiAEKAIYaiAAIAEQFyAEKAIYIAFqIQFBACEDCyAEIAE2AhgLIAJBsAFqJAAgAwt/AQF/AkACQEEAKALQoQEoAhAoAgAiASgCAEHT+qrseEcNACABKAIIQauW8ZN7Rg0BC0EAIQELAkAgAUUNABC7ASABQYABaiABKAIEELwBIAAQvQFBAA8LIABCADcAACAAQRhqQgA3AAAgAEEQakIANwAAIABBCGpCADcAAEF/C5AFAQJ/IwBBIGsiAiQAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOAwECAwALAkACQCADQYB/ag4CAAEFCyABKAIQEGwNBSABIABBHGpBCUEKEPECQf//A3EQhgMaDAULIABBMGogARD5Ag0EIABBADYCLAwECwJAAkAgACgCECgCACIAKAIAQdP6qux4Rw0AIAAhAyAAKAIIQauW8ZN7Rg0BC0EAIQMLAkAgAw0AIAFBABCHAxoMBAsgASAAKAIEEIcDGgwDCwJAAkAgACgCECgCACIAKAIAQdP6qux4Rw0AIAAhAyAAKAIIQauW8ZN7Rg0BC0EAIQMLAkAgAw0AIAFBABCHAxoMAwsgASAAKAIMEIcDGgwCCwJAAkBBACgC0KEBKAIQKAIAIgAoAgBB0/qq7HhHDQAgACgCCEGrlvGTe0YNAQtBACEACwJAAkAgAEUNABC7ASAAQYABaiAAKAIEELwBIAIQvQEMAQsgAkEYakIANwMAIAJBEGpCADcDACACQgA3AwggAkIANwMACyABLQANIAEvAQ4gAkEgEL8DGgwBCwJAIANBgyJGDQACQAJAAkAgACABQdw0EIsDQYB/ag4DAAECBAsCQCAALQAGIgFFDQACQCAAKAIUDQAgAEEAOgAGIAAQagwFCyABDQQLIAAoAhRFDQMgABBrDAMLIAAtAAdFDQIgAEEAKALwngE2AgwMAgsgACgCFCIBRQ0BIAEgAC0ACBCoAQwBC0EAIQMCQCAAKAIUDQACQAJAIAAoAhAoAgAiACgCAEHT+qrseEcNACAAKAIIQauW8ZN7Rg0BC0EAIQALAkAgAEUNAEEDIQMgACgCBA0BC0EEIQMLIAEgAxCHAxoLIAJBIGokAAs8AAJAQQAoAtChASAAQWRqRw0AAkAgAUEQaiABLQAMEG1FDQAgABDzAgsPC0HQGkG0IkH9AUH1EhCoAwALMwACQEEAKALQoQEgAEFkakcNAAJAIAENAEEAQQAQbRoLDwtB0BpBtCJBhQJBhBMQqAMAC7UBAQN/QQAhAkEAKALQoQEhA0F/IQQCQCABEGwNAAJAIAENAEF+DwsCQAJAA0AgACACaiABIAJrIgRBgAEgBEGAAUkbIgQQbQ0BIAQgAmoiAiABTw0CDAALAAtBfQ8LQXwhBEEAQQAQbQ0AAkACQCADKAIQKAIAIgIoAgBB0/qq7HhHDQAgAigCCEGrlvGTe0YNAQtBACECCwJAIAINAEF7DwsgAkGAAWogAigCBBDkASEECyAEC2ABAX9B6DQQkAMiAUF/NgIsIAEgADYCECABQYECOwAHIAFBACgC8J4BQYCA4ABqNgIMAkBB+DRBwAEQ5AFFDQBBny5BtCJBjANB0AsQqAMAC0ELIAEQUEEAIAE2AtChAQsZAAJAIAAoAhQiAEUNACAAIAEgAiADEGMLCwIAC6kCAQJ/AkACQAJAAkACQAJAAkAgAS8BDiICQYB/ag4EAAEEAgMLQQAhAgJAIAEtAAwiA0UNAANAIAEgAmpBEGotAABFDQEgAkEBaiICIANHDQALIAMhAgsgAkEBaiICIANPDQQgAUEQaiEBIAEgAyACayIDQQN2IANBeHEiA0EBchAgIAEgAmogAxDGAyICIAAoAggoAgARBgAhASACECEgAUUNBEG8H0EAEC0PCyABQRBqIAEtAAwgACgCCCgCBBEDAEUNA0GfH0EAEC0PCyABLQAMIgJBCEkNAiABKAIQIAFBFGooAgAgAkEDdkF/aiABQRhqIAAoAggoAhQRCQAaDwsgAkGAI0YNAgsgARCJAxoLDwsgASAAKAIIKAIMEQgAQf8BcRCFAxoLVgEEf0EAKALUoQEhBCAAEOoDIgUgAkEDdCIGakEFaiIHECAiAiABNgAAIAJBBGogACAFQQFqIgEQxgMgAWogAyAGEMYDGiAEQYEBIAIgBxC2AyACECELGgEBf0G4NhCQAyIBIAA2AghBACABNgLUoQELTAECfyMAQRBrIgEkAAJAIAAoAowBIgJFDQAgAC0ABkEIcQ0AIAEgAi8BADsBCCAAQccAIAFBCGpBAhBhCyAAQgA3AowBIAFBEGokAAtpAQF/AkAgAC0AFUEBcUUNAEGRCEH3IUEXQeQNEKgDAAsgACgCCCgCLCAAKAIMLQAKQQN0EGYgACgCECAALQAUQQN0EMYDIQEgACAAKAIMLQAKOgAUIAAgATYCECAAIAAtABVBAXI6ABULlAIBAX8CQAJAIAAoAiwiBCAEKACIASIEIAQoAiBqIAFBBHRqIgQvAQhBA3RBGGoQZiIBRQ0AIAEgAzoAFCABIAI2AhAgASAEKAIAIgI7AQAgASACIAQoAgRqOwECIAAoAighAiABIAQ2AgwgASAANgIIIAEgAjYCBAJAIAJFDQAgASgCCCIAIAE2AiggACgCLCIALwEIDQEgACABNgKMAQ8LAkAgA0UNACABLQAVQQFxDQIgASgCCCgCLCABKAIMLQAKQQN0EGYgASgCECABLQAUQQN0EMYDIQQgASABKAIMLQAKOgAUIAEgBDYCECABIAEtABVBAXI6ABULIAAgATYCKAsPC0GRCEH3IUEXQeQNEKgDAAsJACAAIAE2AhQLXwECfyMAQRBrIgIkACAAIAAoAiwiAygCoAEgAWo2AhQCQCADKAKMASIARQ0AIAMtAAZBCHENACACIAAvAQA7AQggA0HHACACQQhqQQIQYQsgA0IANwKMASACQRBqJAAL7QQBBX8jAEEwayIBJAACQAJAAkAgACgCBCICRQ0AIAIoAggiAyACNgIoAkAgAygCLCIDLwEIDQAgAyACNgKMAQsgACgCCCgCLCECAkAgAC0AFUEBcUUNACACIAAoAhAQaAsgAiAAEGgMAQsgACgCCCIDLwESIQIgAygCLCEEAkAgAy0ADEEQcUUNACABIAQoAIgBIgU2AihBiyshBAJAIAVBJGooAgBBBHYgAk0NACABKAIoIgQgBCgCIGogAkEEdGovAQwhAiABIAQ2AiQgAUEkaiACQQAQ5gEiAkGLKyACGyEECyABIAMvARI2AhggASAENgIUIAFBnBQ2AhBB4h8gAUEQahAtIAMgAy0ADEHvAXE6AAwgACAAKAIMKAIAOwEADAELIAEgBCgAiAEiBTYCKEGLKyEEAkAgBUEkaigCAEEEdiACTQ0AIAEoAigiBCAEKAIgaiACQQR0ai8BDCECIAEgBDYCDCABQQxqIAJBABDmASICQYsrIAIbIQQLIAEgAy8BEjYCCCABIAQ2AgQgAUHWHDYCAEHiHyABEC0CQCADKAIsIgIoAowBIgRFDQAgAi0ABkEIcQ0AIAEgBC8BADsBKCACQccAIAFBKGpBAhBhCyACQgA3AowBIAAoAggoAiwhAgJAIAAtABVBAXFFDQAgAiAAKAIQEGgLIAIgABBoIAMQnQECQAJAIAMoAiwiBCgClAEiACADRw0AIAQgAygCADYClAEMAQsDQCAAIgJFDQMgAigCACIAIANHDQALIAIgAygCADYCAAsgBCADEGgLIAFBMGokAA8LQecpQfchQc4AQbQTEKgDAAt7AQR/AkAgACgClAEiAUUNAANAIAAgASgCADYClAEgARCdAQJAIAEoAigiAkUNAANAIAIoAgQhAyACKAIIKAIsIQQCQCACLQAVQQFxRQ0AIAQgAigCEBBoCyAEIAIQaCADIQIgAw0ACwsgACABEGggACgClAEiAQ0ACwsLZgECfyMAQRBrIgIkAEGLKyEDAkAgACgCAEEkaigCAEEEdiABTQ0AIAAoAgAiACAAKAIgaiABQQR0ai8BDCEBIAIgADYCDCACQQxqIAFBABDmASIBQYsrIAEbIQMLIAJBEGokACADC0MBAX8jAEEQayICJAAgACgCACIAIAAoAjhqIAFBA3RqLwEEIQEgAiAANgIMIAJBDGogAUEAEOYBIQAgAkEQaiQAIAALKAACQCAAKAKUASIARQ0AA0AgAC8BEiABRg0BIAAoAgAiAA0ACwsgAAsoAAJAIAAoApQBIgBFDQADQCAAKAIYIAFGDQEgACgCACIADQALCyAAC/ECAQR/IwBBIGsiBSQAQQAhBgJAIAAvAQgNAAJAIARBAUYNAAJAIAAoApQBIgZFDQADQCAGLwESIAFGDQEgBigCACIGDQALCyAGRQ0AAkACQAJAIARBfmoOAwQAAgELIAYgBi0ADEEQcjoADAwDC0H3IUGwAUHIChCjAwALIAYQhQELQQAhBiAAQTAQZiIERQ0AIAQgATsBEiAEIAA2AiwgACAAKAK0AUEBaiIGNgK0ASAEIAY2AhggBC8BEiEGIAUgBCgCLCgAiAEiBzYCGEGLKyEIAkAgB0EkaigCAEEEdiAGTQ0AIAUoAhgiCCAIKAIgaiAGQQR0ai8BDCEGIAUgCDYCFCAFQRRqIAZBABDmASIGQYsrIAYbIQgLIAUgBC8BEjYCCCAFIAg2AgQgBUHTCjYCAEHiHyAFEC0gBCABIAIgAxB7IAQgACgClAE2AgAgACAENgKUASAEIAApA6ABPgIUIAQhBgsgBUEgaiQAIAYLjQMBBH8jAEEgayIBJAAgAC8BEiECIAEgACgCLCgAiAEiAzYCGEGLKyEEAkAgA0EkaigCAEEEdiACTQ0AIAEoAhgiBCAEKAIgaiACQQR0ai8BDCECIAEgBDYCFCABQRRqIAJBABDmASICQYsrIAIbIQQLIAEgAC8BEjYCCCABIAQ2AgQgAUHgGjYCAEHiHyABEC0CQCAAKAIsIgIoApABIABHDQACQCACKAKMASIERQ0AIAItAAZBCHENACABIAQvAQA7ARggAkHHACABQRhqQQIQYQsgAkIANwKMAQsCQCAAKAIoIgJFDQADQCACKAIEIQQgAigCCCgCLCEDAkAgAi0AFUEBcUUNACADIAIoAhAQaAsgAyACEGggBCECIAQNAAsLIAAQnQECQAJAAkAgACgCLCIDKAKUASICIABHDQAgAyAAKAIANgKUAQwBCwNAIAIiBEUNAiAEKAIAIgIgAEcNAAsgBCAAKAIANgIACyADIAAQaCABQSBqJAAPC0HnKUH3IUHOAEG0ExCoAwALrQEBBH8jAEEQayIBJAACQCAAKAIsIgIvAQgNABCSAyACQQApA6imATcDoAEgABChAUUNACAAEJ0BIABBADYCFCAAQf//AzsBDiACIAA2ApABIAAoAigiAygCCCIEIAM2AigCQCAEKAIsIgQvAQgNACAEIAM2AowBCwJAIAItAAZBCHENACABIAAoAigvAQA7AQggAkHGACABQQhqQQIQYQsgAhDlAQsgAUEQaiQACxIAEJIDIABBACkDqKYBNwOgAQuSAwEIfyMAQSBrIgIkAAJAIAAvAQgNACABQeDUAyABGyEDAkACQCAAKAKMASIEDQBBACEEDAELIAQvAQAhBAsgACAEOwEKAkACQCADQeDUA0cNAEH2HUEAEC0MAQsgAiADNgIQIAIgBEH//wNxNgIUQYMgIAJBEGoQLQsgACADOwEIAkAgA0Hg1ANGDQAgACgCjAEiA0UNAANAIAAoAIgBIgUoAiAhBiADLwEAIQQgAygCDCIHKAIAIQggAiAAKACIASIJNgIYIAQgCGshCEGLKyEEAkAgCUEkaigCAEEEdiAHIAUgBmprIgZBBHUiBU0NACACKAIYIgQgBCgCIGogBmpBDGovAQAhBiACIAQ2AgwgAkEMaiAGQQAQ5gEiBEGLKyAEGyEECyACIAg2AgAgAiAENgIEIAIgBTYCCEHyHyACEC0gAygCBCIDDQALCyABECcLAkAgACgCjAEiA0UNACAALQAGQQhxDQAgAiADLwEAOwEYIABBxwAgAkEYakECEGELIABCADcCjAEgAkEgaiQACyMAIAEgAkHkACACQeQASxtB4NQDahCIASAAQQApA4g5NwMAC48BAQR/EJIDIABBACkDqKYBNwOgAQNAQQAhAQJAIAAvAQgNACAAKAKUASIBRSECAkAgAUUNACAAKAKgASEDAkACQCABKAIUIgRFDQAgBCADTQ0BCwNAIAEoAgAiAUUhAiABRQ0CIAEoAhQiBEUNACAEIANLDQALCyAAEKUBIAEQhgELIAJBAXMhAQsgAQ0ACwsPACAAQcIAIAEQjAFBBGoLkAEBA39BACEDAkAgAkGA4ANLDQAgACAAKAIIQQFqIgQ2AgggAkEDaiEFAkACQCAEQSBJDQAgBEEfcQ0BCxAfCyAFQQJ2IQUCQBCpAUEBcUUNACAAEI0BCwJAIAAgASAFEI4BIgQNACAAEI0BIAAgASAFEI4BIQQLIARFDQAgBEEEakEAIAIQyAMaIAQhAwsgAwu/BwEKfwJAIAAoAgwiAUUNAAJAIAEoAogBLwEMIgJFDQAgASgCACEDQQAhBANAAkAgAyAEQQN0aiIFKAAEQYCBYHFBgIHA/wdHDQAgBSgAACIFRQ0AIAVBChCaAQsgBEEBaiIEIAJHDQALCwJAIAEtADMiAkUNAEEAIQQDQAJAIAEgBEEDdGoiBUE8aigAAEGAgWBxQYCBwP8HRw0AIAVBOGooAAAiBUUNACAFQQoQmgELIARBAWoiBCACRw0ACwsgASgClAEiBkUNAANAAkAgBkEkaigAAEGAgWBxQYCBwP8HRw0AIAYoACAiBEUNACAEQQoQmgELAkAgBigCKCIBRQ0AA0ACQCABLQAVQQFxRQ0AIAEtABQiAkUNACABKAIQIQNBACEEA0ACQCADIARBA3RqIgUoAARBgIFgcUGAgcD/B0cNACAFKAAAIgVFDQAgBUEKEJoBCyAEQQFqIgQgAkcNAAsLQQAhBAJAIAEoAgwvAQgiAkUNAANAAkAgASAEQQN0aiIFQRxqKAAAQYCBYHFBgIHA/wdHDQAgBUEYaigAACIFRQ0AIAVBChCaAQsgBEEBaiIEIAJHDQALCyABKAIEIgENAAsLIAYoAgAiBg0ACwsgAEEANgIAQQAhB0EAIQQCQAJAAkACQAJAA0AgBCEIAkACQCAAKAIEIgkNAEEAIQoMAQtBACEKA0AgCUEIaiEBA0ACQCABKAIAIgJBgICAeHEiBkGAgID4BEYiAw0AIAEgCSgCBE8NBQJAIAJBf0oNACAIDQcgAUEKEJoBQQEhCgwBCyAIRQ0AIAIhBCABIQUCQAJAIAZBgICACEYNACACIQQgASEFIAJBgICAgAZxDQELA0AgBEH///8HcSIERQ0JIAUgBEECdGoiBSgCACIEQYCAgHhxQYCAgAhGDQAgBEGAgICABnFFDQALCwJAIAUgAUYNACABIAUgAWtBAnUiBEGAgIAIcjYCACAEQf///wdxIgRFDQkgAUEEakE3IARBAnRBfGoQyAMaIAdBBGogACAHGyABNgIAIAFBADYCBCABIQcMAQsgASACQf////99cTYCAAsCQCADDQAgASgCAEH///8HcSIERQ0JIAEgBEECdGohAQwBCwsgCSgCACIJDQALCyAIQQBHIApFciEEIAhFDQALDwtBqh1BqCdBuwFB4xMQqAMAC0HiE0GoJ0HBAUHjExCoAwALQfQrQagnQaEBQcAZEKgDAAtB9CtBqCdBoQFBwBkQqAMAC0H0K0GoJ0GhAUHAGRCoAwALlQIBCH8CQAJAAkACQCAAKAIAIgMNAEECIQQMAQsgAUEYdCIFIAJBAWoiAXIhBiABQf///wdxIgdBAnQhCEEAIQkDQCADIgMoAgBB////B3EiBEUNAgJAAkAgBCACayIBQQFODQBBBCEEDAELAkACQCABQQNIDQAgAyAGNgIAIAdFDQYgAyAIaiIEIAFBf2pBgICACHI2AgAgBCADKAIENgIEDAELIAMgBCAFcjYCACADKAIEIQQLIAlBBGogACAJGyAENgIAQQEhBCADIQoLIAFBAEoNASADIQkgAygCBCIDDQALQQIhBAtBACAKIARBAkYbDwtB9CtBqCdBoQFBwBkQqAMAC0H0K0GoJ0GhAUHAGRCoAwALggEBAX8CQAJAAkACQCABRQ0AIAFBA3ENASABQXxqIgIoAgAiAUGAgIB4cUGAgICQBEcNAiABQf///wdxIgFFDQMgAiABQYCAgBByNgIACw8LQYcvQagnQbICQd8UEKgDAAtBzDJBqCdBtAJB3xQQqAMAC0H0K0GoJ0GhAUHAGRCoAwALkwEBAn8CQAJAAkACQCABRQ0AIAFBA3ENASABQXxqIgIoAgAiA0GAgIB4cUGAgICQBEcNAiADQf///wdxIgNFDQMgAiADQYCAgAhyNgIAIAFBxwAgA0ECdEF8ahDIAxoLDwtBhy9BqCdBsgJB3xQQqAMAC0HMMkGoJ0G0AkHfFBCoAwALQfQrQagnQaEBQcAZEKgDAAtrAQF/AkACQAJAIAEoAgRBg4HA/wdHDQAgASgCACICKAIAIgFBgICAgARxDQEgAUGAgIDwAHFFDQIgAiABQYCAgIAEcjYCAAsPC0H9LEGoJ0HLAkHlFBCoAwALQfMoQagnQcwCQeUUEKgDAAtsAQF/AkACQAJAIAEoAgRBg4HA/wdHDQAgASgCACICKAIAIgFBgICAgARxRQ0BIAFBgICA8ABxRQ0CIAIgAUH/////e3E2AgALDwtB1y9BqCdB1QJB1BQQqAMAC0HzKEGoJ0HWAkHUFBCoAwALCwAgAEEEQQwQjAELawEDf0EAIQICQCABQQN0IgNBgOADSw0AIABBwwBBEBCMASIERQ0AAkAgAUUNACAAQcIAIAMQjAEhAiAEIAE7AQogBCABOwEIIAQgAkEEajYCDAsgBCAEKAIAQYCAgIAEczYCACAEIQILIAILLgEBf0EAIQICQCABQYDgA0sNACAAQQUgAUEMahCMASICRQ0AIAIgATsBBAsgAgsuAQF/QQAhAgJAIAFBgOADSw0AIABBBiABQQlqEIwBIgJFDQAgAiABOwEECyACCwkAIAAgATYCDAtZAQJ/QZCABBAgIgAgAEGMgARqQXxxIgE2AhQgAUGBgID4BDYCACAAKAIEIQEgACAAQRBqNgIEIAAgATYCECAAIAAoAhQgAEEYamtBAnVBgICACHI2AhggAAsNACAAQQA2AgQgABAhC6IDAQR/AkACQAJAAkACQCAAKAIAIgJBGHZBD3EiA0EBRg0AIAJBgICAgAJxDQACQCABQQBKDQAgACACQYCAgIB4cjYCAA8LIAAgAkH/////BXFBgICAgAJyNgIAAkACQAJAIANBfmoOBQMCAQADBwsgACgCCCIARQ0CIAAoAgggAC8BBCABQX5qEJsBDwsgAEUNASAAKAIIIAAvAQQgAUF+ahCbAQ8LAkAgACgCBCICRQ0AIAIoAgggAi8BBCABQX5qEJsBCyAAKAIMIgNFDQAgA0EDcQ0BIANBfGoiBCgCACICQYCAgIACcQ0CIAJBgICA+ABxQYCAgBBHDQMgAC8BCCEFIAQgAkGAgICAAnI2AgAgBUUNACABQX9qIQFBACEAA0ACQCADIABBA3RqIgIoAARBgIFgcUGAgcD/B0cNACACKAAAIgJFDQAgAiABEJoBCyAAQQFqIgAgBUcNAAsLDwtBhy9BqCdB1gBB7BEQqAMAC0GiLUGoJ0HYAEHsERCoAwALQaEpQagnQdkAQewREKgDAAtBqCdBigFBrRUQowMAC8gBAQJ/AkACQAJAAkAgAEUNACAAQQNxDQEgAEF8aiIDKAIAIgRBgICAgAJxDQIgBEGAgID4AHFBgICAEEcNAyADIARBgICAgAJyNgIAIAFFDQBBACEEA0ACQCAAIARBA3RqIgMoAARBgIFgcUGAgcD/B0cNACADKAAAIgNFDQAgAyACEJoBCyAEQQFqIgQgAUcNAAsLDwtBhy9BqCdB1gBB7BEQqAMAC0GiLUGoJ0HYAEHsERCoAwALQaEpQagnQdkAQewREKgDAAvRAgEDfwJAAkAgAC8BCA0AAkACQCAAKAKYASABQQJ0aigCACgCECIFRQ0AIABBvANqIgYgASACIAQQswEiB0UNACAHKAIEQaD3NiADIANB34hJakHgiElJG2ogACgCoAFPDQEgBiAHEK8BCyAAKAKQASIARQ0CIAAgAjsBECAAIAE7AQ4gACAEOwEEIABBBmpBFDsBACAAIAAtAAxB8AFxQQFyOgAMIABBABB9DwsgBiAHELEBIQEgAEHIAWpCADcDACAAQgA3A8ABIABBzgFqIAEvAQI7AQAgAEHMAWogAS0AFDoAACAAQc0BaiAFLQAEOgAAIABBxAFqIAVBACAFLQAEa0EMbGpBZGopAwA3AgAgAEHQAWohAiABQQhqIQACQCABLQAUIgFBCkkNACAAKAIAIQALIAIgACABEMYDGgsPC0GKKkGIJ0EpQYkSEKgDAAssAAJAIAAtAAxBD3FBAkcNACAAKAIsIAAoAgQQaAsgACAALQAMQfABcToADAvjAgECfwJAAkAgAC8BCA0AAkAgAkGAYHFBgMAARw0AIABBvANqIgMgASACQf+ff3FBgCByQQAQswEiBEUNACADIAQQrwELIAAoApABIgNFDQECQCAAKACIASIEIAQoAjhqIAFBA3RqKAIAQe3y2YwBRw0AIANBABB9AkAgACgClAEiA0UNAANAAkAgAy8BDiABRw0AIAMgAy0ADEEgcjoADAsgAygCACIDDQALCyAAKAKUASIDRQ0BA0ACQCADLQAMIgFBIHFFDQAgAyABQd8BcToADCADEIYBIAAoApQBIgMNAQwDCyADKAIAIgMNAAwCCwALIAMgAjsBECADIAE7AQ4gAEHMAWotAAAhASADIAMtAAxB8AFxQQJyOgAMIAMgACABEGYiAjYCBAJAIAJFDQAgA0EIaiABOgAAIAIgAEHQAWogARDGAxoLIANBABB9Cw8LQYoqQYgnQcsAQcwdEKgDAAuuAQECfwJAAkAgAC8BCA0AIAAoApABIgRFDQEgBEH//wM7AQ4gBCAELQAMQfABcUEDcjoADCAEIAAoAqwBIgU7ARAgACAFQQFqNgKsASAEQQhqIAM6AAAgBCABOwEEIARBBmogAjsBACAEQQEQoAFFDQACQCAELQAMQQ9xQQJHDQAgBCgCLCAEKAIEEGgLIAQgBC0ADEHwAXE6AAwLDwtBiipBiCdB5wBBnxcQqAMAC+sCAQd/IwBBEGsiAiQAAkACQAJAIAAvARAiAyAAKAIsIgQoArABIgVB//8DcUYNACABDQAgAEEDEH0MAQsgBCAEIAAvAQQgAkEMahDnASACKAIMIARB0gFqIgZB6gEgACgCKCAAQQZqLwEAQQN0akEYaiAAQQhqLQAAQQAQwQEhByAEQdEBakEAOgAAIARB0AFqIAM6AAAgBEHOAWpBggE7AQAgBEHNAWogBC0AvAE6AAAgBEHMAWoiCCAHQeoBIAdB6gFJG0ECajoAACAEQcQBahCcAzcCACAEQcMBakEAOgAAIARBwgFqIAgtAABBB2pB/AFxOgAAAkAgAUUNACACIAY2AgBBwBEgAhAtC0EBIQEgBC0ABkECcUUNAQJAIAMgBUH//wNxRw0AAkAgBEHAAWoQigMNAEEBIQEgBCAEKAKwAUEBajYCsAEMAwsgAEEDEH0MAQsgAEEDEH0LQQAhAQsgAkEQaiQAIAEL+gUCB38BfiMAQRBrIgEkAAJAAkAgAC0ADEEPcSICDQBBASECDAELAkACQAJAAkACQAJAIAJBf2oOAwABAgMLIAAoAiwiAigCmAEgAC8BDiIDQQJ0aigCACgCECIERQ0EAkAgAkHDAWotAABBAXENACACQc4Bai8BACIFRQ0AIAUgAC8BEEcNACAELQAEIgUgAkHNAWotAABHDQAgBEEAIAVrQQxsakFkaikDACACQcQBaikCAFINACACIAMgAC8BBBCiASIERQ0AIAJBvANqIAQQsQEaQQEhAgwGCwJAIAAoAhQgAigCoAFLDQAgAUEANgIMQQAhAwJAIAAvAQQiBEUNACACIAQgAUEMahDnASEDCyACQcABaiEFIAAvARAhBiAALwEOIQcgASgCDCEEIAJBAToAwwEgAkHCAWogBEEHakH8AXE6AAAgAigCmAEgB0ECdGooAgAoAhAiB0EAIActAAQiB2tBDGxqQWRqKQMAIQggAkHOAWogBjsBACACQc0BaiAHOgAAIAJBzAFqIAQ6AAAgAkHEAWogCDcCAAJAIANFDQAgAkHQAWogAyAEEMYDGgsgBRCKAyIERSECIAQNBAJAIAAvAQYiA0HnB0sNACAAIANBAXQ7AQYLIAAgAC8BBhB9IAQNBgtBACECDAULIAAoAiwiAigCmAEgAC8BDkECdGooAgAoAhAiA0UNAyAAQQhqLQAAIQQgACgCBCEFIAAvARAhBiACQcMBakEBOgAAIAJBwgFqIARBB2pB/AFxOgAAIANBACADLQAEIgdrQQxsakFkaikDACEIIAJBzgFqIAY7AQAgAkHNAWogBzoAACACQcwBaiAEOgAAIAJBxAFqIAg3AgACQCAFRQ0AIAJB0AFqIAUgBBDGAxoLAkAgAkHAAWoQigMiAg0AIAJFIQIMBQsgAEEDEH1BACECDAQLIABBABCgASECDAMLQYgnQdYCQYkUEKMDAAsgAEEDEH0MAQtBACECIABBABB8CyABQRBqJAAgAgueAgEGfyMAQRBrIgMkACAAQdABaiEEIABBzAFqLQAAIQUCQAJAAkAgAkUNACAAIAIgA0EMahDnASEGAkACQCADKAIMIgdBAWoiCCAALQDMAUoNACAEIAdqLQAADQAgBiAEIAcQ3ANFDQELQQAhCAsgCEUNASAFIAhrIQUgBCAIaiEEC0EAIQgCQCAAQbwDaiIGIAEgAEHOAWovAQAgAhCzASIHRQ0AAkAgBSAHLQAURw0AIAchCAwBCyAGIAcQrwELAkAgCA0AIAYgASAALwHOASAFELIBIgggAjsBFgsgCEEIaiECAkAgCC0AFEEKSQ0AIAIoAgAhAgsgAiAEIAUQxgMaIAggACkDoAE+AgQMAQtBACEICyADQRBqJAAgCAunAwEEfwJAIAAvAQgNACAAQcABaiACIAItAAxBEGoQxgMaAkAgACgAiAFBPGooAgAiAkEISQ0AIAJBA3YiAkEBIAJBAUsbIQMgAEG8A2ohBEEAIQUDQAJAIAAoApgBIAVBAnRqKAIAKAIQIgJFDQACQAJAIAAtAM0BIgYNACAALwHOAUUNAQsgAi0ABCAGRw0BCyACQQAgAi0ABGtBDGxqQWRqKQMAIAApAsQBUg0AIAAQhwECQCAALQDDAUEBcQ0AAkAgAC0AzQFBMU8NACAALwHOAUH/gQJxQYOAAkcNACAEIAUgACgCoAFB8LF/ahC0AQwBC0EAIQIDQCAEIAUgAC8BzgEgAhC2ASICRQ0BIAAgAi8BACACLwEWEKIBRQ0ACwsCQCAAKAKUASICRQ0AA0ACQCAFIAIvAQ5HDQAgAiACLQAMQSByOgAMCyACKAIAIgINAAsLA0AgACgClAEiAkUNAQNAAkAgAi0ADCIGQSBxRQ0AIAIgBkHfAXE6AAwgAhCGAQwCCyACKAIAIgINAAsLCyAFQQFqIgUgA0cNAAsLIAAQigELC7gCAQN/AkAgAC8BBiICQQRxDQACQCACQQhxDQAgARBEIQIgAEHFACABEEUgAhBhCwJAIAAoAIgBQTxqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoApgBIQRBACECA0ACQCAEIAJBAnRqKAIAIAFHDQAgAEG8A2ogAhC1ASAAQdgBakJ/NwMAIABB0AFqQn83AwAgAEHIAWpCfzcDACAAQn83A8ABAkAgACgClAEiAUUNAANAAkAgAiABLwEORw0AIAEgAS0ADEEgcjoADAsgASgCACIBDQALCyAAKAKUASICRQ0CA0ACQCACLQAMIgFBIHFFDQAgAiABQd8BcToADCACEIYBIAAoApQBIgINAQwECyACKAIAIgINAAwDCwALIAJBAWoiAiADRw0ACwsgABCKAQsLKwAgAEJ/NwPAASAAQdgBakJ/NwMAIABB0AFqQn83AwAgAEHIAWpCfzcDAAvoAQEHfyMAQRBrIgEkACAAIAAvAQZBBHI7AQYQTCAAIAAvAQZB+/8DcTsBBgJAIAAoAIgBQTxqKAIAIgJBCEkNACAAQYgBaiEDIAJBA3YiAkEBIAJBAUsbIQRBACECA0AgACgAiAEiBSgCOCEGIAEgAygCADYCDCABQQxqIAIQgQEgBSAGaiACQQN0aiIFKAIAEEshBiAAKAKYASACQQJ0IgdqIAY2AgACQCAFKAIAQe3y2YwBRw0AIAAoApgBIAdqKAIAIgUgBS0ADEEBcjoADAsgAkEBaiICIARHDQALCxBNIAFBEGokAAsgACAAIAAvAQZBBHI7AQYQTCAAIAAvAQZB+/8DcTsBBgs2AQF/IAAvAQYhAgJAIAFFDQAgACACQQJyOwEGDwsgACACQf3/A3E7AQYgACAAKAKsATYCsAELCQBBACgC2KEBC8cCAQR/QQAhBAJAIAEvAQQiBUUNACABKAIIIgYgBUEDdGohBwNAAkAgByAEQQF0ai8BACACRw0AIAYgBEEDdGohBAwCCyAEQQFqIgQgBUcNAAtBACEECwJAIARFDQAgBCADKQMANwMADwsCQCABLwEGIgQgBUsNAAJAAkAgBCAFRw0AIAEgBEEKbEEDdiIEQQQgBEEEShsiBTsBBiAAIAVBCmwQZiIERQ0BAkAgAS8BBCIHRQ0AIAQgASgCCCAHQQN0EMYDIAVBA3RqIAEoAgggAS8BBCIFQQN0aiAFQQF0EMYDGgsgASAENgIIIAAoArgBIAQQjwELIAEoAgggAS8BBEEDdGogAykDADcDACABKAIIIAEvAQQiBEEDdGogBEEBdGogAjsBACABIAEvAQRBAWo7AQQLDwtBvRZB1yFBJEHFDBCoAwALZgEDf0EAIQQCQCACLwEEIgVFDQAgAigCCCIGIAVBA3RqIQIDQAJAIAIgBEEBdGovAQAgA0cNACAGIARBA3RqIQQMAgsgBEEBaiIEIAVHDQALQQAhBAsgACAEQYg5IAQbKQMANwMAC8QBAQJ/IwBBIGsiBCQAAkACQCADQYHgA0kNACAAQQApA4g5NwMADAELIAQgAikDADcDEAJAIAEgBEEQaiAEQRxqEN0BIgVFDQAgBCgCHCADTQ0AIAAgBSADai0AABDUAQwBCyAEIAIpAwA3AwgCQCABIARBCGoQ3gEiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AIAEvAQggA00NACAAIAEoAgwgA0EDdGopAwA3AwAMAQsgAEEAKQOIOTcDAAsgBEEgaiQAC+QCAgR/AX4jAEEwayIEJABBfyEFAkAgAkGA4ANLDQAgBCABKQMANwMgAkAgACAEQSBqENsBRQ0AIAQgASkDADcDECAAIARBEGogBEEsahDcASEAQX0hBSAEKAIsIAJNDQEgBCADKQMANwMIIAAgAmogBEEIahDXAToAAEEAIQUMAQsgBCABKQMANwMYQX4hBSAAIARBGGoQ3gEiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AQXwhBSACQYA8Sw0AIAMpAwAhCAJAIAJBAWoiAyABLwEKTQ0AAkAgACADQQpsQQhtIgVBBCAFQQRKGyIGQQN0EGYiBQ0AQXshBQwCCwJAIAEoAgwiB0UNACAFIAcgAS8BCEEDdBDGAxoLIAEgBjsBCiABIAU2AgwgACgCuAEgBRCPAQsgASgCDCACQQN0aiAINwMAQQAhBSABLwEIIAJLDQAgASADOwEICyAEQTBqJAAgBQuwAgEFf0F8IQQCQCADQYA8Sg0AQQAhBEEAIAEvAQgiBWsgAyAFIANqIgZBAEgbIgdFDQAgBkEAIAZBAEobIQNBeiEEIANBgDxLDQACQCADIAEvAQpNDQACQCAAIANBCmxBA3YiBEEEIARBBEobIgZBA3QQZiIEDQBBew8LAkAgASgCDCIIRQ0AIAQgCCABLwEIQQN0EMYDGgsgASAGOwEKIAEgBDYCDCAAKAK4ASAEEI8BCyABLwEIIAUgAiAFIAJJGyIEayECAkACQCAHQX9KDQAgASgCDCAEQQN0aiIEIAQgB0EDdGsgAiAHahDHAxoMAQsgASgCDCAEQQN0IgRqIgUgB0EDdCIAaiAFIAIQxwMaIAEoAgwgBGpBACAAEMgDGgsgASADOwEIQQAhBAsgBAskAAJAIAEtABRBCkkNACABKAIIECELIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIECELIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIFQRRHDQALQQAhBQsCQCAFDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQIQsgB0EAOgAAIAAgBmpBADsBAgsgBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAgNgIICwJAAkAgACAALwHgAyIDQRhsaiAFRw0AIAUhAwwBCwJAIABBACADQQFqIANBEksbIgJBGGxqIgMgBUYNACAEQQhqQRBqIgEgBUEQaiIGKQIANwMAIARBCGpBCGoiByAFQQhqIggpAgA3AwAgBCAFKQIANwMIIAYgA0EQaiIJKQIANwIAIAggA0EIaiIGKQIANwIAIAUgAykCADcCACAJIAEpAwA3AgAgBiAHKQMANwIAIAMgBCkDCDcCAAsgACACOwHgAwsgBEEgaiQAIAMPC0GCLEHnJkElQdkgEKgDAAtoAQV/QQAhBAJAA0ACQAJAIAAgBEEYbCIFaiIGLwEAIAFHDQAgACAFaiIHLwECIAJHDQBBACEFIAcvARYgA0YNAQtBASEFIAghBgsgBUUNASAGIQggBEEBaiIEQRRHDQALQQAhBgsgBgtAAQJ/QQAhAwNAAkAgACADQRhsaiIELwEAIAFHDQAgBCgCBCACTQ0AIARBBGogAjYCAAsgA0EBaiIDQRRHDQALC1UBA39BACECA0ACQCAAIAJBGGxqIgMvAQAgAUcNACADQRRqIQQCQCADLQAUQQpJDQAgAygCCBAhCyAEQQA6AAAgA0EAOwECCyACQQFqIgJBFEcNAAsLSQACQCACRQ0AIAMgACADGyIDIABB4ANqIgBPDQADQAJAIAMvAQIgAkcNACADLwEAIAFHDQAgAw8LIANBGGoiAyAASQ0ACwtBAAtUAQN/IwBBIGsiASQAQQAhAgJAIAAgAUEgECUiA0EASA0AIANBAWoQICECAkAgA0EgSg0AIAIgASADEMYDGgwBCyAAIAIgAxAlGgsgAUEgaiQAIAILHQACQCABDQAgACABQQAQJg8LIAAgASABEOoDECYLoAQBDH8jAEHgAGsiAkHAAGpBGGogAEEYaikCADcDACACQcAAakEQaiAAQRBqKQIANwMAIAIgACkCADcDQCACIABBCGopAgA3A0hBACEDA0AgA0EEdCEEQQAhBQNAAkACQCADDQAgAiAFQQJ0aiABKAAAIgZBGHQgBkEIdEGAgPwHcXIgBkEIdkGA/gNxIAZBGHZycjYCACABQQRqIQEMAQsgAiAFQQJ0aiIHIAIgBUEBakEPcUECdGooAgAiBkEZdyAGQQ53cyAGQQN2cyAHKAIAaiACIAVBCWpBD3FBAnRqKAIAaiACIAVBDmpBD3FBAnRqKAIAIgZBD3cgBkENd3MgBkEKdnNqNgIACyACKAJcIQggAiACKAJYIgk2AlwgAiACKAJUIgo2AlggAiACKAJQIgY2AlQgAigCTCELIAIgAigCSCIMNgJMIAIgAigCRCINNgJIIAIgAigCQCIHNgJEIAIgCyAIIAZBGncgBkEVd3MgBkEHd3MgCiAGcWpqIAkgBkF/c3FqIAUgBHJBAnRB0DZqKAIAaiACIAVBAnRqKAIAaiIGajYCUCACIAdBHncgB0ETd3MgB0EKd3MgBmogByAMIA1zcSAMIA1xc2o2AkAgBUEBaiIFQRBHDQALIANBAWoiA0EERw0AC0EAIQUDQCAAIAVBAnQiBmoiByAHKAIAIAJBwABqIAZqKAIAajYCACAFQQFqIgVBCEcNAAsLpwIBBX8gACgCSCEBIAAoAkQiAkGAAToAACAAQdAAaiEDIAJBAWohAgJAIAFBf2oiAUEHSw0AIAJBACABEMgDGiADIABBBGoiAhC5AUHAACEBCyACQQAgAUF4aiIBEMgDIAFqIgQgACgCTCICQQN0OgAHIAJBBXYhAkEGIQUDQCAEIAUiAWogAjoAACABQX9qIQUgAkEIdiECIAENAAsgAyAAQQRqELkBIAAoAgAhAUEAIQJBACEFA0AgASACaiAAIAVBAnRqIgRB0wBqLQAAOgAAIAEgAkEBcmogBEHSAGovAQA6AAAgASACQQJyaiAEQdAAaiIEKAIAQQh2OgAAIAEgAkEDcmogBCgCADoAACACQQRqIQIgBUEBaiIFQQhHDQALIAAoAgALkAEAECMCQEEALQDcoQFFDQBBySdBDkG/ExCjAwALQQBBAToA3KEBECRBAEKrs4/8kaOz8NsANwLIogFBAEL/pLmIxZHagpt/NwLAogFBAELy5rvjo6f9p6V/NwK4ogFBAELnzKfQ1tDrs7t/NwKwogFBAELAADcCqKIBQQBB5KEBNgKkogFBAEHQogE2AuChAQvVAQECfwJAIAFFDQBBAEEAKAKsogEgAWo2AqyiAQNAAkBBACgCqKIBIgJBwABHDQAgAUHAAEkNAEGwogEgABC5ASAAQcAAaiEAIAFBQGoiAQ0BDAILQQAoAqSiASAAIAEgAiABIAJJGyICEMYDGkEAQQAoAqiiASIDIAJrNgKoogEgACACaiEAIAEgAmshAQJAIAMgAkcNAEGwogFB5KEBELkBQQBBwAA2AqiiAUEAQeShATYCpKIBIAENAQwCC0EAQQAoAqSiASACajYCpKIBIAENAAsLC0wAQeChARC6ARogAEEYakEAKQPoogE3AAAgAEEQakEAKQPgogE3AAAgAEEIakEAKQPYogE3AAAgAEEAKQPQogE3AABBAEEAOgDcoQELkwcBAn9BACECQQBCADcDqKMBQQBCADcDoKMBQQBCADcDmKMBQQBCADcDkKMBQQBCADcDiKMBQQBCADcDgKMBQQBCADcD+KIBQQBCADcD8KIBAkACQAJAAkAgAUHBAEkNABAjQQAtANyhAQ0CQQBBAToA3KEBECRBACABNgKsogFBAEHAADYCqKIBQQBB5KEBNgKkogFBAEHQogE2AuChAUEAQquzj/yRo7Pw2wA3AsiiAUEAQv+kuYjFkdqCm383AsCiAUEAQvLmu+Ojp/2npX83AriiAUEAQufMp9DW0Ouzu383ArCiAQJAA0ACQEEAKAKoogEiAkHAAEcNACABQcAASQ0AQbCiASAAELkBIABBwABqIQAgAUFAaiIBDQEMAgtBACgCpKIBIAAgASACIAEgAkkbIgIQxgMaQQBBACgCqKIBIgMgAms2AqiiASAAIAJqIQAgASACayEBAkAgAyACRw0AQbCiAUHkoQEQuQFBAEHAADYCqKIBQQBB5KEBNgKkogEgAQ0BDAILQQBBACgCpKIBIAJqNgKkogEgAQ0ACwtB4KEBELoBGkEAIQJBAEEAKQPoogE3A4ijAUEAQQApA+CiATcDgKMBQQBBACkD2KIBNwP4ogFBAEEAKQPQogE3A/CiAUEAQQA6ANyhAQwBC0HwogEgACABEMYDGgsDQCACQfCiAWoiASABLQAAQTZzOgAAIAJBAWoiAkHAAEcNAAwCCwALQcknQQ5BvxMQowMACxAjAkBBAC0A3KEBDQBBAEEBOgDcoQEQJEEAQsCAgIDwzPmE6gA3AqyiAUEAQcAANgKoogFBAEHkoQE2AqSiAUEAQdCiATYC4KEBQQBBmZqD3wU2AsyiAUEAQozRldi5tfbBHzcCxKIBQQBCuuq/qvrPlIfRADcCvKIBQQBChd2e26vuvLc8NwK0ogFB8KIBIQFBwAAhAgJAA0ACQEEAKAKoogEiAEHAAEcNACACQcAASQ0AQbCiASABELkBIAFBwABqIQEgAkFAaiICDQEMAgtBACgCpKIBIAEgAiAAIAIgAEkbIgAQxgMaQQBBACgCqKIBIgMgAGs2AqiiASABIABqIQEgAiAAayECAkAgAyAARw0AQbCiAUHkoQEQuQFBAEHAADYCqKIBQQBB5KEBNgKkogEgAg0BDAILQQBBACgCpKIBIABqNgKkogEgAg0ACwsPC0HJJ0EOQb8TEKMDAAu7BgEEf0HgoQEQugEaQQAhASAAQRhqQQApA+iiATcAACAAQRBqQQApA+CiATcAACAAQQhqQQApA9iiATcAACAAQQApA9CiATcAAEEAQQA6ANyhARAjAkBBAC0A3KEBDQBBAEEBOgDcoQEQJEEAQquzj/yRo7Pw2wA3AsiiAUEAQv+kuYjFkdqCm383AsCiAUEAQvLmu+Ojp/2npX83AriiAUEAQufMp9DW0Ouzu383ArCiAUEAQsAANwKoogFBAEHkoQE2AqSiAUEAQdCiATYC4KEBA0AgAUHwogFqIgIgAi0AAEHqAHM6AAAgAUEBaiIBQcAARw0AC0EAQcAANgKsogFB8KIBIQJBwAAhAQJAA0ACQEEAKAKoogEiA0HAAEcNACABQcAASQ0AQbCiASACELkBIAJBwABqIQIgAUFAaiIBDQEMAgtBACgCpKIBIAIgASADIAEgA0kbIgMQxgMaQQBBACgCqKIBIgQgA2s2AqiiASACIANqIQIgASADayEBAkAgBCADRw0AQbCiAUHkoQEQuQFBAEHAADYCqKIBQQBB5KEBNgKkogEgAQ0BDAILQQBBACgCpKIBIANqNgKkogEgAQ0ACwtBICEBQQBBACgCrKIBQSBqNgKsogEgACECAkADQAJAQQAoAqiiASIDQcAARw0AIAFBwABJDQBBsKIBIAIQuQEgAkHAAGohAiABQUBqIgENAQwCC0EAKAKkogEgAiABIAMgASADSRsiAxDGAxpBAEEAKAKoogEiBCADazYCqKIBIAIgA2ohAiABIANrIQECQCAEIANHDQBBsKIBQeShARC5AUEAQcAANgKoogFBAEHkoQE2AqSiASABDQEMAgtBAEEAKAKkogEgA2o2AqSiASABDQALC0HgoQEQugEaIABBGGpBACkD6KIBNwAAIABBEGpBACkD4KIBNwAAIABBCGpBACkD2KIBNwAAIABBACkD0KIBNwAAQQBCADcD8KIBQQBCADcD+KIBQQBCADcDgKMBQQBCADcDiKMBQQBCADcDkKMBQQBCADcDmKMBQQBCADcDoKMBQQBCADcDqKMBQQBBADoA3KEBDwtBySdBDkG/ExCjAwAL4gYAIAAgARC+AQJAIANFDQBBAEEAKAKsogEgA2o2AqyiAQNAAkBBACgCqKIBIgBBwABHDQAgA0HAAEkNAEGwogEgAhC5ASACQcAAaiECIANBQGoiAw0BDAILQQAoAqSiASACIAMgACADIABJGyIAEMYDGkEAQQAoAqiiASIBIABrNgKoogEgAiAAaiECIAMgAGshAwJAIAEgAEcNAEGwogFB5KEBELkBQQBBwAA2AqiiAUEAQeShATYCpKIBIAMNAQwCC0EAQQAoAqSiASAAajYCpKIBIAMNAAsLIAgQvwEgCEEgEL4BAkAgBUUNAEEAQQAoAqyiASAFajYCrKIBA0ACQEEAKAKoogEiA0HAAEcNACAFQcAASQ0AQbCiASAEELkBIARBwABqIQQgBUFAaiIFDQEMAgtBACgCpKIBIAQgBSADIAUgA0kbIgMQxgMaQQBBACgCqKIBIgIgA2s2AqiiASAEIANqIQQgBSADayEFAkAgAiADRw0AQbCiAUHkoQEQuQFBAEHAADYCqKIBQQBB5KEBNgKkogEgBQ0BDAILQQBBACgCpKIBIANqNgKkogEgBQ0ACwsCQCAHRQ0AQQBBACgCrKIBIAdqNgKsogEDQAJAQQAoAqiiASIDQcAARw0AIAdBwABJDQBBsKIBIAYQuQEgBkHAAGohBiAHQUBqIgcNAQwCC0EAKAKkogEgBiAHIAMgByADSRsiAxDGAxpBAEEAKAKoogEiBSADazYCqKIBIAYgA2ohBiAHIANrIQcCQCAFIANHDQBBsKIBQeShARC5AUEAQcAANgKoogFBAEHkoQE2AqSiASAHDQEMAgtBAEEAKAKkogEgA2o2AqSiASAHDQALC0EBIQNBAEEAKAKsogFBAWo2AqyiAUGFNCEFAkADQAJAQQAoAqiiASIHQcAARw0AIANBwABJDQBBsKIBIAUQuQEgBUHAAGohBSADQUBqIgMNAQwCC0EAKAKkogEgBSADIAcgAyAHSRsiBxDGAxpBAEEAKAKoogEiAiAHazYCqKIBIAUgB2ohBSADIAdrIQMCQCACIAdHDQBBsKIBQeShARC5AUEAQcAANgKoogFBAEHkoQE2AqSiASADDQEMAgtBAEEAKAKkogEgB2o2AqSiASADDQALCyAIEL8BC/YFAgd/AX4jAEHwAGsiCCQAAkAgBEUNACADQQA6AAALQQAhCUEAIQoDQEEAIQsCQCAJIAJGDQAgASAJai0AACELCyAJQQFqIQwCQAJAAkACQAJAIAtB/wFxIg1B+wBHDQAgDCACSQ0BCwJAIA1B/QBGDQAgDCEJDAMLIAwgAkkNASAMIQkMAgsgCUECaiEJIAEgDGotAAAiC0H7AEYNAQJAAkAgC0FQakH/AXFBCUsNACALQRh0QRh1QVBqIQwMAQtBfyEMIAtBIHIiC0Gff2pB/wFxQRlLDQAgC0EYdEEYdUGpf2ohDAsCQCAMQQBODQBBISELDAILIAkhCwJAIAkgAk8NAANAIAEgC2otAABB/QBGDQEgC0EBaiILIAJHDQALIAIhCwtBfyENAkAgCSALTw0AAkAgASAJaiwAACIJQVBqIg5B/wFxQQlLDQAgDiENDAELIAlBIHIiCUGff2pB/wFxQRlLDQAgCUGpf2ohDQsgC0EBaiEJQT8hCyAMIAZODQEgCCAFIAxBA3RqIgspAwAiDzcDGCAIIA83A2ACQAJAIAhBGGoQ4QFFDQAgCCALKQMANwMAIAhBIGogCBDYAUEHIA1BAWogDUEASBsQqwMgCCAIQSBqEOoDNgJsIAhBIGohCwwBCyAIIAgpA2A3AxAgCEEgaiAAIAhBEGoQxwEgCCAIKQMgNwMIIAAgCEEIaiAIQewAahDDASELCyAIIAgoAmwiDEF/ajYCbCAMRQ0CA0ACQAJAIAcNAAJAIAogBE8NACADIApqIAstAAA6AAALIApBAWohCkEAIQcMAQsgB0F/aiEHCyALQQFqIQsgCCAIKAJsIgxBf2o2AmwgDA0ADAMLAAsgCUECaiAMIAEgDGotAABB/QBGGyEJCwJAIAcNAAJAIAogBE8NACADIApqIAs6AAALIApBAWohCkEAIQcMAQsgB0F/aiEHCyAJIAJNDQALAkAgBEUNACAEIANqQX9qQQA6AAALIAhB8ABqJAAgCgtlAQJ/QQAhAgJAAkAgASgCBCIDQf//P3FBACADQYCAYHFBgIDA/wdGGyIDQQRGDQAgA0GDAUcNASABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAMEYPCyABKAIAQf//AEshAgsgAguLAQECf0EAIQMCQAJAIAEoAgQiBEH//z9xQQAgBEGAgGBxQYCAwP8HRhsiBEEERg0AIARBgwFHDQEgASgCACIBRQ0BIAEoAgBBgICA+ABxQYCAgDBHDQECQCACRQ0AIAIgAS8BBDYCAAsgAUEGag8LIAEoAgAiAUGAgAFJDQAgACABIAIQ5wEhAwsgAwuLAQECfyMAQRBrIgQkACAEIAM2AgwgBCADNgIIQQBBACACIAMQqgMhAwJAAkAgASgCuAEgA0F/ahCWASIFDQAgBCABQZABEIkBIARBASACIAQoAggQqgMaIABBACkDiDk3AwAMAQsgBUEGaiADIAIgBCgCCBCqAxogACABQYMBIAUQ1gELIARBEGokAAsmAQF/IwBBEGsiBCQAIAQgAzYCDCAAIAEgAiADEMQBIARBEGokAAtcAQJ/IwBBEGsiBCQAAkACQCABKAK4ASADEJYBIgUNACAEQQhqIAFBkQEQiQEgAEEAKQOIOTcDAAwBCyAFQQZqIAIgAxDGAxogACABQYMBIAUQ1gELIARBEGokAAv2BQIDfwF8IwBBkAFrIgMkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAIoAgQiBEH//z9xQQAgBEGAgGBxQYCAwP8HRhsiBA4HBAUGCwEJBwALIARBgwFHDQogAigCACIFRQ0CIAUoAgBBgICA+ABxQYCAgDBGIQUMAQsgAigCAEH//wBLIQULIAVFDQAgACACKQMANwMADAwLIAQOBwABAgcEBQMGCwJAIAIpAwBCAFINACAAQpKAgYDAgID4/wA3AwAMCwsgAyACKQMANwMIIANBCGoQ2AEiBr1C////////////AINCgYCAgICAgPj/AFQNByAAQpaAgYDAgID4/wA3AwAMCgsCQAJAAkACQCACKAIAIgJBQGoOAgECAAsgAkEBRw0CIABClICBgMCAgPj/ADcDAAwMCyAAQpOAgYDAgID4/wA3AwAMCwsgAEKVgIGAwICA+P8ANwMADAoLQewkQfMAQc4XEKMDAAsgAyACKAIANgIQIAAgAUGKKCADQRBqEMUBDAgLIAIoAgAhAiADIAEoAogBNgIsIAMgA0EsaiACEIABNgIgIAAgAUGnKCADQSBqEMUBDAcLIAIoAgBBgIABTw0EIAMgAikDADcDOCAAIAEgA0E4ahDIAQwGCyACKAIAIQIgAyABKAKIATYCTCADIANBzABqIAIQgQE2AkAgACABQbYoIANBwABqEMUBDAULIARBgwFGDQMLQewkQY0BQc4XEKMDAAsgA0HQAGogBkEHEKsDIAMgA0HQAGo2AgAgACABQdwRIAMQxQEMAgtBiTBB7CRBhwFBzhcQqAMACwJAAkAgAigCACIEDQBBACEEDAELIAQtAANBD3EhBAsCQAJAAkACQCAEQX1qDgMAAgEDCyAAQpeAgYDAgID4/wA3AwAMAwsgAyACKQMANwMwIAAgASADQTBqEMgBDAILIABCmYCBgMCAgPj/ADcDAAwBC0HsJEGEAUHOFxCjAwALIANBkAFqJAALeQECfyMAQSBrIgMkACADIAIpAwA3AxACQCABIANBEGogA0EcahDdASIEDQBBlipB7CRB0gBBvRcQqAMACyADIAQgAygCHCICQSAgAkEgSRsQrgM2AgQgAyACNgIAIAAgAUHfKEGWKCACQSBLGyADEMUBIANBIGokAAu/BwEFfyMAQfAAayIEJAAgBCACKQMANwNQIAEgBEHQAGoQkQEgBCADKQMANwNIIAEgBEHIAGoQkQEgBCACKQMANwNoAkACQAJAAkACQCAEKAJsIgVB//8/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AEEAIQcMAQsgAxDqAyEHCyAJIAqgIQkgB0EpahAgIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEMYDGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQvwMiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQYARQ0AIAJBxR4QzgELIAMQISAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQIQsgAigCACICDQALCyABQRBqJAAPC0GYDEEAEC0QMwALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEKwDIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRByREgAkEgahAtDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQa8RIAJBEGoQLQwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEG5ECACEC0LIAJBwABqJAALmgUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMECEgARAhIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahDQASECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoArCmASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahDQASECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahDQASECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFB0DgQiwNB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgCsKYBIAFqNgIcCwv6AQEEfyACQQFqIQMgAUGNKyABGyEEAkAgACgCJCIBRQ0AA0ACQCABKAIMIgVFDQAgBSAEIAMQ3ANFDQILIAEoAgAiAQ0ACwsCQCABDQBByAAQICIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQQAoArCmASIGNgJAAkAgASgCECIFDQACQAJAIAAtABJFDQAgAEEoaiEFIAAoAigNASAFQYgnNgIADAELIABBDGohBQsgBSgCACEFCyABIAUgBmo2AkQgAUGzHhDOASABIAMQICIFNgIMIAUgBCACEMYDGgsgAQs4AQF/QQBB4DgQkAMiATYCsKMBIAFBAToAEiABIAA2AiAgAUHg1AM2AgwgAUGBAjsBEEEQIAEQUAvKAgEDfwJAQQAoArCjASICRQ0AIAIgACAAEOoDENABIQAgAb1C////////////AINCgICAgICAgPj/AFYNAAJAIAApAxhC////////////AINCgYCAgICAgPj/AFQNACAAIAE5AxggAEEANgIgIABBOGogATkDACAAQTBqIAE5AwAgAEEoakIANwMAIAAgAEHAAGooAgA2AhQLIAAgACgCIEEBajYCICAAKAIUIQMCQAJAQQAoArCmASIEIABB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A0EYaiACEMoCIAJBGGoiBCADKQMYNwMAIANBGGogAhDKAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDYATkDICADIAQpAwA3AwggAkEoaiADQQhqENgBIgU5AwAgAisDICAFYyECDAELIAIoAhAgAigCGEghAgsgACACENUBIANBIGokAAuSAgIFfwJ8IwBBIGsiAyQAIANBGGogAhDKAiACQRhqIgQgAykDGDcDACADQRhqIAIQygIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQ2AE5AyAgAyAEKQMANwMIIAJBKGoiBiADQQhqENgBOQMAQfg4IQcgAisDICIIvUL///////////8Ag0KAgICAgICA+P8AVg0CIAYrAwAiCb1C////////////AINCgICAgICAgPj/AFYNAiAIIAljIQIMAQsgAigCECACKAIYSCECCyAEIAUgAhshBwsgACAHKQMANwMAIANBIGokAAuSAgIFfwJ8IwBBIGsiAyQAIANBGGogAhDKAiACQRhqIgQgAykDGDcDACADQRhqIAIQygIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQ2AE5AyAgAyAEKQMANwMIIAJBKGoiBiADQQhqENgBOQMAQfg4IQcgAisDICIIvUL///////////8Ag0KAgICAgICA+P8AVg0CIAYrAwAiCb1C////////////AINCgICAgICAgPj/AFYNAiAIIAljIQIMAQsgAigCECACKAIYSCECCyAFIAQgAhshBwsgACAHKQMANwMAIANBIGokAAvKAQMDfwF+AXwjAEEgayIDJAAgA0EYaiACEMoCIAJBGGoiBCADKQMYNwMAIANBGGogAhDKAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAjQCECACNAIYfiIGQiCIpyAGpyIFQR91Rw0AIAAgBRDUAQwBCyADIAJBEGopAwA3AxAgAiADQRBqENgBOQMgIAMgBCkDADcDCCACQShqIANBCGoQ2AEiBzkDACAAIAcgAisDIKIQ0wELIANBIGokAAufAQECfyMAQSBrIgMkACADQRhqIAIQygIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEMoCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIQIAIoAhhHIQIMAQsgAyACQRBqKQMANwMQIAMgBCkDADcDCCACIANBEGogA0EIahDiAUEBcyECCyAAIAIQ1QEgA0EgaiQAC4UBAgJ/AXwjAEEgayIDJAAgA0EYaiACEMoCIAJBGGoiBCADKQMYNwMAIANBGGogAhDKAiACIAMpAxg3AxAgAyACKQMQNwMQIAIgA0EQahDYATkDICADIAQpAwA3AwggAkEoaiADQQhqENgBIgU5AwAgACACKwMgIAUQ4wMQ0wEgA0EgaiQACywBAn8gAkEYaiIDIAIQzAI2AgAgAiACEMwCIgQ2AhAgACAEIAMoAgB0ENQBCywBAn8gAkEYaiIDIAIQzAI2AgAgAiACEMwCIgQ2AhAgACAEIAMoAgB1ENQBC0EBAn8gAkEYaiIDIAIQzAI2AgAgAiACEMwCIgQ2AhACQCAEIAMoAgB2IgJBf0oNACAAIAK4ENMBDwsgACACENQBC8gBAgR/AXwjAEEgayIDJAAgA0EYaiACEMoCIAJBGGoiBCADKQMYNwMAIANBGGogAhDKAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRDUAQwBCyADIAJBEGopAwA3AxAgAiADQRBqENgBOQMgIAMgBCkDADcDCCACQShqIANBCGoQ2AEiBzkDACAAIAIrAyAgB6EQ0wELIANBIGokAAsyAQF/QYg5IQMCQCACKAI0IgIgAS0AFE8NACABKAIQIAJBA3RqIQMLIAAgAykDADcDAAsOACAAIAIpA6ABuhDTAQuJAQEBfyMAQRBrIgMkACADQQhqIAIQygIgAyADKQMINwMAAkACQCADEOABRQ0AIAEoAgghAQwBC0EAIQEgAygCDEGGgMD/B0cNACACIAMoAggQggEhAQsCQAJAIAENACAAQQApA4g5NwMADAELIAAgASgCGDYCACAAQYKAwP8HNgIECyADQRBqJAALLQACQCACQcMBai0AAEEBcQ0AIAAgAkHOAWovAQAQ1AEPCyAAQQApA4g5NwMACy4AAkAgAkHDAWotAABBAXFFDQAgACACQc4Bai8BABDUAQ8LIABBACkDiDk3AwALXwECfyMAQRBrIgMkAAJAAkAgAigAiAFBPGooAgBBA3YgAigCNCIESw0AIANBCGogAkHvABCJASAAQQApA4g5NwMADAELIAAgBDYCACAAQYWAwP8HNgIECyADQRBqJAALZwEFfyMAQRBrIgIkACABEMsCIQMgARDLAiEEIAEQywIhBSABIAJBDGpBARDQAiEBAkAgAigCDCIGIAVNDQAgAiAGIAVrIgY2AgwgASAFaiADIAYgBCAGIARJGxDIAxoLIAJBEGokAAs1AQJ/IAIoAjQhAwJAIAJBABDUAiIEDQAgAEEAKQOIOTcDAA8LIAAgAiAEIANB//8DcRCrAQs6AQJ/IwBBEGsiAyQAIAIQywIhBCADQQhqIAIQygIgAyADKQMINwMAIAAgAiADIAQQrAEgA0EQaiQAC6UBAQJ/IwBBIGsiAyQAIANBGGogAhDKAiADIAMpAxg3AwgCQAJAIAIgA0EIaiADQRRqEN0BDQAgAyADKQMYNwMAAkACQCACIAMQ3gEiBA0AQQAhAgwBCyAEKAIAQYCAgPgAcUGAgIAYRiECCwJAAkAgAkUNACADIAQvAQg2AhQMAQsgAEEAKQPwODcDAAsgAkUNAQsgACADKAIUENQBCyADQSBqJAALJgACQCACQQAQ1AIiAg0AIABBACkD8Dg3AwAPCyAAIAIvAQQQ1AELNAEBfyMAQRBrIgMkACADQQhqIAIQygIgAyADKQMINwMAIAAgAiADEN8BENQBIANBEGokAAsNACAAQQApA4g5NwMACzMBAX8jAEEQayIDJAAgA0EIaiACEMoCIABBkDlBmDkgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA6A5NwMACw0AIABBACkDkDk3AwALDQAgAEEAKQOYOTcDAAshAQF/IAEQ0wIhAiAAKAIIIgAgAjsBDiAAQQAQfCABEHkLVQEBfAJAAkAgARDOAkQAAAAAAECPQKJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELAkAgAUEASA0AIAAoAgggARB9CwsaAAJAIAEQzAIiAUEASA0AIAAoAgggARB9CwsmAQJ/IAEQywIhAiABEMsCIQMgASABENMCIANBgCByIAJBABCcAQsXAQF/IAEQywIhAiABIAEQ0wIgAhCeAQspAQN/IAEQ0gIhAiABEMsCIQMgARDLAiEEIAEgARDTAiAEIAMgAhCcAQt5AQV/IwBBEGsiAiQAIAEQ0gIhAyABEMsCIQQCQCAAKAIIKAIsIgUvAQgNAAJAAkAgBEEQSw0AIAEoAjQiBiAAKAIMLwEIIgBLDQAgBiAEaiAATQ0BCyACQQhqIAVB8QAQiQEMAQsgASADIAYgBBCfAQsgAkEQaiQAC6ICAQZ/IwBB4ABrIgMkACACIANB3ABqENECIQQgAhDLAiEFAkACQAJAIAEoAggoAiwiBi8BCA0AAkAgBUEQSw0AIAIoAjQiByABKAIMLwEIIghLDQAgByAFaiAITQ0CCyADQRBqIAZB8QAQiQELIABBACkDiDk3AwAMAQsgAiAEIAMoAlwgA0EQakHAACABIAdBA3RqQRhqIgcgBUEAEMEBIQECQCACKAK4ASABQX9qIggQlgEiBg0AIANBCGogAkGSARCJASAAQQApA4g5NwMADAELAkACQCABQcEASQ0AIAIgBCADKAJcIAZBBmogASAHIAVBABDBARoMAQsgBkEGaiADQRBqIAgQxgMaCyAAIAJBgwEgBhDWAQsgA0HgAGokAAtPAQJ/IwBBEGsiAiQAAkACQCABEMsCIgNB7QFJDQAgAkEIaiABQfMAEIkBDAELIAFBzAFqIAM6AAAgAUHQAWpBACADEMgDGgsgAkEQaiQAC10BBH8jAEEQayICJAAgARDLAiEDIAEgAkEMakECENACIQQCQCABQcwBai0AACADayIFQQFIDQAgASADakHQAWogBCACKAIMIgEgBSABIAVJGxDGAxoLIAJBEGokAAuaAQEHfyMAQRBrIgIkACABEMsCIQMgARDLAiEEIAEgAkEMakECENACIQUgARDLAiEGIAEgAkEIakEBENACIQcCQCACKAIMIgEgBE0NACACIAEgBGsiATYCDCACKAIIIgggBk0NACACIAggBmsiCDYCCCAHIAZqIAUgBGogCCABIAMgASADSRsiASAIIAFJGxDGAxoLIAJBEGokAAuEAQEFfyMAQRBrIgIkACABEM0CIQMgARDLAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgEgACgCDC8BCCIGSw0AIAEgBGogBk0NAQsgAkEIaiAFQfEAEIkBDAELIAAoAgggAyAAIAFBA3RqQRhqIAQQewsgAkEQaiQAC8IBAQd/IwBBEGsiAiQAIAEQywIhAyABEM0CIQQgARDLAiEFAkACQCADQXtqQXtLDQAgAkEIaiABQYkBEIkBDAELIAAoAggoAiwiBi8BCA0AAkACQCAFQRBLDQAgASgCNCIHIAAoAgwvAQgiCEsNACAHIAVqIAhNDQELIAJBCGogBkHxABCJAQwBCyABIAQgACAHQQN0akEYaiAFIAMQhAEhASAAKAIIIAE1AhhCgICAgKCAgPj/AIQ3AyALIAJBEGokAAszAQJ/IwBBEGsiAiQAIAAoAgghAyACQQhqIAEQygIgAyACKQMINwMgIAAQfiACQRBqJAALUgECfyMAQRBrIgIkAAJAAkAgACgCDCgCACABKAI0IAEvATBqIgNKDQAgAyAALwECTg0AIAAgAzsBAAwBCyACQQhqIAFB9AAQiQELIAJBEGokAAt0AQN/IwBBIGsiAiQAIAJBGGogARDKAiACIAIpAxg3AwggAkEIahDZASEDAkACQCAAKAIMKAIAIAEoAjQgAS8BMGoiBEoNACAEIAAvAQJODQAgAw0BIAAgBDsBAAwBCyACQRBqIAFB9QAQiQELIAJBIGokAAsMACABIAEQywIQiAELVQECfyMAQRBrIgIkACACQQhqIAEQygICQAJAIAEoAjQiAyAAKAIMLwEISQ0AIAIgAUH2ABCJAQwBCyAAIANBA3RqQRhqIAIpAwg3AwALIAJBEGokAAtWAQJ/IwBBEGsiAiQAIAJBCGogARDKAgJAAkAgASgCNCIDIAEoAogBLwEMSQ0AIAIgAUH4ABCJAQwBCyABKAIAIANBA3RqIAIpAwg3AwALIAJBEGokAAtWAQN/IwBBIGsiAiQAIAJBGGogARDKAiABEMsCIQMgARDLAiEEIAJBEGogAUEBEM8CIAIgAikDEDcDACACQQhqIAAgBCADIAIgAkEYahBdIAJBIGokAAtmAQJ/IwBBEGsiAiQAIAJBCGogARDKAgJAAkAgASgCNCIDIAAoAgwtAApJDQAgAiABQfcAEIkBDAELAkAgAyAALQAUSQ0AIAAQegsgACgCECADQQN0aiACKQMINwMACyACQRBqJAALhQEBAX8jAEEgayICJAAgAkEYaiABEMoCIAAoAghBACkDiDk3AyAgAiACKQMYNwMIAkAgAkEIahDgAQ0AAkAgAigCHEGCgMD/B0YNACACQRBqIAFB+wAQiQEMAQsgASACKAIYEIMBIgFFDQAgACgCCEEAKQPwODcDICABEIUBCyACQSBqJAALSgECfyMAQRBrIgIkAAJAIAEoArgBEJMBIgMNACABQQwQZwsgACgCCCEAIAJBCGogAUGDASADENYBIAAgAikDCDcDICACQRBqJAALWQEDfyMAQRBrIgIkACABEMsCIQMCQCABKAK4ASADEJQBIgQNACABIANBA3RBEGoQZwsgACgCCCEDIAJBCGogAUGDASAEENYBIAMgAikDCDcDICACQRBqJAALVgEDfyMAQRBrIgIkACABEMsCIQMCQCABKAK4ASADEJUBIgQNACABIANBDGoQZwsgACgCCCEDIAJBCGogAUGDASAEENYBIAMgAikDCDcDICACQRBqJAALSQEDfyMAQRBrIgIkACACQQhqIAEQygICQCABQQEQ1AIiA0UNACABLwE0IQQgAiACKQMINwMAIAEgAyAEIAIQqgELIAJBEGokAAtnAQJ/IwBBMGsiAiQAIAJBKGogARDKAiABEMsCIQMgAkEgaiABEMoCIAIgAikDIDcDECACIAIpAyg3AwgCQCABIAJBEGogAyACQQhqEK0BRQ0AIAJBGGogAUGFARCJAQsgAkEwaiQAC4kBAQR/IwBBIGsiAiQAIAEQzAIhAyABEMsCIQQgAkEYaiABEMoCIAIgAikDGDcDCAJAAkAgASACQQhqEN4BIgVFDQAgBSgCAEGAgID4AHFBgICAGEcNACABIAUgBCADEK4BRQ0BIAJBEGogAUGKARCJAQwBCyACQRBqIAFBiwEQiQELIAJBIGokAAtfAQJ/IwBBEGsiAyQAAkACQCACKAI0IgQgAigAiAFBJGooAgBBBHZJDQAgA0EIaiACQfIAEIkBIABBACkDiDk3AwAMAQsgACAENgIAIABBhoDA/wc2AgQLIANBEGokAAtBAQJ/IAJBGGoiAyACEMwCNgIAIAIgAhDMAiIENgIQAkAgAygCACICDQAgAEEAKQPwODcDAA8LIAAgBCACbxDUAQsMACAAIAIQzAIQ1AELZAECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEEOMBDQAgA0EIaiACQfAAEIkBIABBACkDiDk3AwAMAQsgACAENgIAIABBhIDA/wc2AgQLIANBEGokAAtrAQJ/IwBBEGsiAyQAIAIoAjQhBCADIAIoAogBNgIEAkACQCADQQRqIARBgIABciIEEOMBDQAgA0EIaiACQfAAEIkBIABBACkDiDk3AwAMAQsgACAENgIAIABBhIDA/wc2AgQLIANBEGokAAtrAQJ/IwBBEGsiAyQAIAIoAjQhBCADIAIoAogBNgIEAkACQCADQQRqIARBgIACciIEEOMBDQAgA0EIaiACQfAAEIkBIABBACkDiDk3AwAMAQsgACAENgIAIABBhIDA/wc2AgQLIANBEGokAAtrAQJ/IwBBEGsiAyQAIAIoAjQhBCADIAIoAogBNgIEAkACQCADQQRqIARBgIADciIEEOMBDQAgA0EIaiACQfAAEIkBIABBACkDiDk3AwAMAQsgACAENgIAIABBhIDA/wc2AgQLIANBEGokAAtLAQJ/IwBBEGsiAiQAIAEgAkEMakEAENACIQMCQCABLwEIDQAgACgCCCEAIAIgASADIAIoAgwQxgEgACACKQMANwMgCyACQRBqJAALPgEBfwJAIAEtADIiAg0AIAAgAUHsABCJAQ8LIAEgAkF/aiICOgAyIAAgASACQf8BcUEDdGpBOGopAwA3AwALaAECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABENcBIQAgAUEQaiQAIAALaAECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABENcBIQAgAUEQaiQAIAALggEBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCJAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICwJAAkAgASgCDEGGgMD/B0cNACABKAIIIQAMAQsgASAAQYgBEIkBQQAhAAsgAUEQaiQAIAALagICfwF8IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQ2AEhAyABQRBqJAAgAwvxAQECfyMAQTBrIgMkAAJAAkAgAS0AMiIEDQAgA0EoaiABQewAEIkBDAELIAEgBEF/aiIEOgAyIAMgASAEQf8BcUEDdGpBOGopAwA3AygLIAMgAykDKDcDGAJAAkAgASADQRhqENoBDQACQCACQQJxRQ0AIAMgAykDKDcDECABIANBEGoQwgENAQsgA0EgaiABQf0AEIkBIABBACkDoDk3AwAMAQsCQCACQQFxRQ0AIAMgAykDKDcDCCABIANBCGoQ2wENACADQSBqIAFBlAEQiQEgAEEAKQOgOTcDAAwBCyAAIAMpAyg3AwALIANBMGokAAt2AQF/IwBBIGsiAyQAIANBGGogACACEM8CAkACQCACQQJxRQ0AIAMgAykDGDcDECAAIANBEGoQwgFFDQAgAyADKQMYNwMIIAAgA0EIaiABEMMBIQAMAQsgAyADKQMYNwMAIAAgAyABENwBIQALIANBIGokACAAC6MBAQJ/IwBBIGsiAiQAAkACQCAALQAyIgMNACACQRhqIABB7AAQiQEMAQsgACADQX9qIgM6ADIgAiAAIANB/wFxQQN0akE4aikDADcDGAsgAiACKQMYNwMIAkACQCAAIAJBCGoQwgENACACQRBqIABBkwEQiQEgAUEANgIAQYY0IQAMAQsgAiACKQMYNwMAIAAgAiABEMMBIQALIAJBIGokACAAC4IBAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsCQAJAIAEoAgxBhIDA/wdGDQAgASAAQf8AEIkBQQAhAAwBCyABKAIIIQALIAFBEGokACAAC4IBAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsCQAJAIAEoAgxBhYDA/wdGDQAgASAAQf4AEIkBQQAhAAwBCyABKAIIIQALIAFBEGokACAAC5ACAQR/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QAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPcCtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwtBgICAgHghASADRAAAAAAAAODBYw0CQf////8HIQEgA0QAAMD////fQWQNAiADRAAAAAAAAOA/oCIDmUQAAAAAAADgQWNFDQEgA6oPCwJAAkACQAJAAkACQAJAAkACQCABDggAAQIDBAUGBwgLIAAtAAAPCyAALwAADwsgACgAACIBQf////8HIAFB/////wdJGw8LIAApAAAiBEL/////ByAEQv////8HVBunDwsgACwAAA8LIAAuAAAPCyAAKAAADwtBgICAgHghASAAKQAAIgRCgICAgHhTDQIgBEL/////ByAEQv////8HUxunDwtBuyFBygFBwCsQowMAC0GAgICAeCEBCyABC50BAgF/AXwCQAJAAkACQAJAAkACQCABQQ9xIgJBfmoOCgABBQUFAgUFAwQFCyAAKAAAuCEDDAULIAApAAC6IQMMBAsgACkAALkhAwwDCyAAKgAAuyEDDAILIAArAAAhAwwBCyAAIAIQ9wK3IQMLAkAgAUEQSQ0AIANBgIDA/wMgAUEQdEGAgMD/B3FrQYCAwP8Hca1CIIa/oiEDCyADC9QBAgJ/AX5BfiECAkACQCABLQAMQQxJDQAgASkCECIEUA0AIAFBGGovAQAhAxAiDQECQCAALQAGRQ0AAkACQAJAQQAoAoymASICIABHDQBBjKYBIQEMAQsDQCACIgFFDQIgASgCACICIABHDQALCyABIAAoAgA2AgALIABBAEGIAhDIAxoLIABBATsBBiAAQQ9qQQM6AAAgAEEQaiAENwIAIAAgA0EHdDsBBEEAIQIgAEEAKAKMpgE2AgBBACAANgKMpgELIAIPC0GxJkErQYkVEKMDAAvRAQICfwF+QX4hAgJAAkAgAS0ADEECSQ0AIAEpAgQiBFANACABLwEQIQMQIg0BAkAgAC0ABkUNAAJAAkACQEEAKAKMpgEiAiAARw0AQYymASEBDAELA0AgAiIBRQ0CIAEoAgAiAiAARw0ACwsgASAAKAIA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AkgiAUF/aiABcjYCSAJAIAAoAgAiAUEIcUUNACAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALzgEBA38CQAJAIAIoAhAiAw0AQQAhBCACENADDQEgAigCECEDCwJAIAMgAigCFCIFayABTw0AIAIgACABIAIoAiQRBgAPCwJAAkAgAigCUEEATg0AQQAhAwwBCyABIQQDQAJAIAQiAw0AQQAhAwwCCyAAIANBf2oiBGotAABBCkcNAAsgAiAAIAMgAigCJBEGACIEIANJDQEgACADaiEAIAEgA2shASACKAIUIQULIAUgACABEMYDGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC1sBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQ0QMhAAwBCyADEMkDIQUgACAEIAMQ0QMhACAFRQ0AIAMQygMLAkAgACAERw0AIAJBACABGw8LIAAgAW4LAgALBABBAAsEAEEACwIACzIBAX8jAEEQayIBRAAAAAAAAPC/RAAAAAAAAPA/IAAbOQMIIAErAwhEAAAAAAAAAACjCwwAIAAgAKEiACAAowvABAMCfgZ8AX8CQCAAvSIBQoCAgICAgICJQHxC//////+fwgFWDQACQCABQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIDoCADoSIDIAOiQQArA9BCIgSiIgWgIgYgACAAIACiIgeiIgggCCAIIAhBACsDoEOiIAdBACsDmEOiIABBACsDkEOiQQArA4hDoKCgoiAHQQArA4BDoiAAQQArA/hCokEAKwPwQqCgoKIgB0EAKwPoQqIgAEEAKwPgQqJBACsD2EKgoKCiIAAgA6EgBKIgACADoKIgBSAAIAahoKCgoA8LAkACQCABQjCIpyIJQZCAfmpBn4B+Sw0AAkAgAUL///////////8Ag0IAUg0AQQEQ1wMPCyABQoCAgICAgID4/wBRDQECQAJAIAlBgIACcQ0AIAlB8P8BcUHw/wFHDQELIAAQ2AMPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCEBCyABQoCAgICAgICNQHwiAkI0h6e3IgdBACsDmEKiIAJCLYinQf8AcUEEdCIJQbDDAGorAwCgIgggCUGowwBqKwMAIAEgAkKAgICAgICAeIN9vyAJQajTAGorAwChIAlBsNMAaisDAKGiIgCgIgQgACAAIACiIgOiIAMgAEEAKwPIQqJBACsDwEKgoiAAQQArA7hCokEAKwOwQqCgoiADQQArA6hCoiAHQQArA6BCoiAAIAggBKGgoKCgoCEACyAAC+4DAwF+A38GfAJAAkACQAJAAkAgAL0iAUIAUw0AIAFCIIinIgJB//8/Sw0BCwJAIAFC////////////AINCAFINAEQAAAAAAADwvyAAIACiow8LIAFCf1UNASAAIAChRAAAAAAAAAAAow8LIAJB//+//wdLDQJBgIDA/wMhA0GBeCEEAkAgAkGAgMD/A0YNACACIQMMAgsgAacNAUQAAAAAAAAAAA8LIABEAAAAAAAAUEOivSIBQiCIpyEDQct3IQQLIAQgA0HiviVqIgJBFHZqtyIFRABgn1ATRNM/oiIGIAJB//8/cUGewZr/A2qtQiCGIAFC/////w+DhL9EAAAAAAAA8L+gIgAgACAARAAAAAAAAOA/oqIiB6G9QoCAgIBwg78iCEQAACAVe8vbP6IiCaAiCiAJIAYgCqGgIAAgAEQAAAAAAAAAQKCjIgYgByAGIAaiIgkgCaIiBiAGIAZEn8Z40Amawz+iRK94jh3Fccw/oKJEBPqXmZmZ2T+goiAJIAYgBiAGRERSPt8S8cI/okTeA8uWZEbHP6CiRFmTIpQkSdI/oKJEk1VVVVVV5T+goqCgoiAAIAihIAehoCIARAAAIBV7y9s/oiAFRDYr8RHz/lk9oiAAIAigRNWtmso4lLs9oqCgoKAhAAsgAAs5AQF/IwBBEGsiAyQAIAAgASACQf8BcSADQQhqEPoDEOsDIQAgAykDCCEBIANBEGokAEJ/IAEgABsLhwEBAn8CQAJAAkAgAkEESQ0AIAEgAHJBA3ENAQNAIAAoAgAgASgCAEcNAiABQQRqIQEgAEEEaiEAIAJBfGoiAkEDSw0ACwsgAkUNAQsCQANAIAAtAAAiAyABLQAAIgRHDQEgAUEBaiEBIABBAWohACACQX9qIgJFDQIMAAsACyADIARrDwtBAAsNAEHYqAEQ1gNB3KgBCxAAIAGaIAEgABsQ3wMgAaILFQEBfyMAQRBrIgEgADkDCCABKwMICxAAIABEAAAAAAAAAHAQ3gMLEAAgAEQAAAAAAAAAEBDeAwsFACAAmQuiCQMGfwN+CXwjAEEQayICJAAgAb0iCEI0iKciA0H/D3EiBEHCd2ohBQJAAkACQCAAvSIJQjSIpyIGQYFwakGCcEkNAEEAIQcgBUH/fksNAQsCQCAIQgGGIgpCf3xC/////////29UDQBEAAAAAAAA8D8hCyAJQoCAgICAgID4P1ENAiAKUA0CAkACQCAJQgGGIglCgICAgICAgHBWDQAgCkKBgICAgICAcFQNAQsgACABoCELDAMLIAlCgICAgICAgPD/AFENAkQAAAAAAAAAACABIAGiIAhCP4inQQFzIAlCgICAgICAgPD/AFRGGyELDAILAkAgCUIBhkJ/fEL/////////b1QNACAAIACiIQsCQCAJQn9VDQAgC5ogCyAIEOQDQQFGGyELCyAIQn9VDQIgAkQAAAAAAADwPyALozkDCCACKwMIIQsMAgtBACEHAkAgCUJ/VQ0AAkAgCBDkAyIHDQAgABDYAyELDAMLIAZB/w9xIQYgCUL///////////8AgyEJIAdBAUZBEnQhBwsCQCAFQf9+Sw0ARAAAAAAAAPA/IQsgCUKAgICAgICA+D9RDQICQCAEQb0HSw0AIAEgAZogCUKAgICAgICA+D9WG0QAAAAAAADwP6AhCwwDCwJAIANBgBBJIAlCgYCAgICAgPg/VEYNAEEAEOADIQsMAwtBABDhAyELDAILIAYNACAARAAAAAAAADBDor1C////////////AINCgICAgICAgOB8fCEJCwJAIAhCgICAQIO/IgwgCSAJQoCAgICw1dqMQHwiCEKAgICAgICAeIN9IglCgICAgAh8QoCAgIBwg78iCyAIQi2Ip0H/AHFBBXQiBUHg9ABqKwMAIg2iRAAAAAAAAPC/oCIAIABBACsDqHQiDqIiD6IiECAIQjSHp7ciEUEAKwOYdKIgBUHw9ABqKwMAoCISIAAgDSAJvyALoaIiE6AiAKAiC6AiDSAQIAsgDaGgIBMgDyAOIACiIg6goiARQQArA6B0oiAFQfj0AGorAwCgIAAgEiALoaCgoKAgACAAIA6iIguiIAsgCyAAQQArA9h0okEAKwPQdKCiIABBACsDyHSiQQArA8B0oKCiIABBACsDuHSiQQArA7B0oKCioCIPoCILvUKAgIBAg78iDqIiAL0i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c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AGRldmljZXNjcmlwdG1ncl9pbml0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABjaGFyQ29kZUF0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGRldnNfZmliZXJfY29weV9wYXJhbXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAYnVmZmVyAHJvdGFyeUVuY29kZXIAbnVtYmVyAGZyZWVfZmliZXIAamRfc2hhMjU2X3NldHVwAHBvcABkZXZzX2J1ZmZlcl9vcAAhc3dlZXAAZGV2c192bV9wb3BfYXJnX21hcABzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AcmUtcnVuAGJ1dHRvbgBtb3Rpb24AZnVuY3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgBkZXZzX3ZhbHVlX3VucGluAGRldnNfdmFsdWVfcGluAGpvaW4AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBib29sZWFuAHNjYW4AZmxhc2hfcHJvZ3JhbQBudWxsAGpkX3JvbGVfZnJlZV9hbGwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAGRldnNfaW1nX3N0cmlkeF9vawBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAYnVmZmVyX3RvX3N0cmluZwBkZXZzX3ZhbHVlX3RvX3N0cmluZwBXU1NLLUg6IGNsZWFyIGNvbm5lY3Rpb24gc3RyaW5nAHRvU3RyaW5nACFxX3NlbmRpbmcAISBsb29wYmFjayByeCBvdmYAISBmcm0gc2VuZCBvdmYAZGV2c192YWx1ZV90eXBlb2YAKCh1aW50OF90ICopZHN0KVtpXSA9PSAweGZmADAxMjM0NTY3ODlhYmNkZWYAcS0+ZnJvbnQgPT0gcS0+Y3Vycl9zaXplADAgPD0gZGlmZiAmJiBkaWZmICsgbGVuIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplAGJsb2NrX3NpemUAZHN0IC0gYnVmID09IGN0eC0+YWNjX3NpemUAZHN0IC0gYnVmIDw9IGN0eC0+YWNjX3NpemUAcS0+ZnJvbnQgPD0gcS0+c2l6ZQBxLT5iYWNrIDw9IHEtPnNpemUAcS0+Y3Vycl9zaXplIDw9IHEtPnNpemUAZGV2c19sZWF2ZQB0cnVlAHN0YXRlID09IF9zdGF0ZQB0ZXJtaW5hdGUAaGVhcnRSYXRlAGpkX3dzc2tfY2xvc2UAamRfb3BpcGVfY2xvc2UAV1M6IGNsb3NlAGZhbHNlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQB1cHRpbWUAamRfdHhfZ2V0X2ZyYW1lAGpkX3B1c2hfaW5fZnJhbWUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAGpkX3dzc2tfc2VuZF9tZXNzYWdlAGpkX2RldmljZV9mcmVlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAGpkX2FsbG9jYXRlX3NlcnZpY2UAc2xpY2UAc3BsaWNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdW5kZWZpbmVkAHVwbG9hZCBmYWlsZWQAIXN0YXRlLT5sb2NrZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABhZ2didWZmZXJfdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAYmFkIG1hZ2ljAGphY2RhYy1jL2RldmljZXNjcmlwdC92ZXJpZnkuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9hZ2didWZmZXIuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvYnVmZmVyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX21haW4uYwBqYWNkYWMtYy9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdm1fdXRpbC5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAamFjZGFjLWMvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9zdHJpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAFtGaWJlcjogJXhdAFtCdWZmZXJbJXVdICUtc10AW0Z1bmN0aW9uOiAlc10AW1JvbGU6ICVzXQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBbQnVmZmVyWyV1XSAlLXMuLi5dACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBOYU4AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAZUNPMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGFyZzAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAGRldnNfYnVmZmVyX2lzX3dyaXRhYmxlKGN0eCwgYnVmZmVyKQAobnVsbCkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQB0eXBlICYgKERFVlNfSEFORExFX0dDX01BU0sgfCBERVZTX0hBTkRMRV9JTUdfTUFTSykAV1M6IHRleHQgbWVzc2FnZT8hICclcycAemVybyBrZXkhAFdTOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABAAAAAAAAAAAAAGphY2RhYy1wb3NpeCBkZXZpY2UAMC4wLjAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAPCfBgCAEIER8Q8AAGZ+Sx4kAQAABwAAAAgAAADwnwYAgBCB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AFsAAABcAAAAXQAAAF4AAABfAAAAYAAAAGEAAABiAAAAYwAAAGQAAABlAAAAZgAAAGcAAABoAAAAaQAAAGoAAABrAAAAbAAAAG0AAABuAAAAbwAAAHAAAABxAAAAcgAAAHMAAAB0AAAAEwAAAAAAAAAFAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAgQAAAGhUAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQTAAAYFZQAABBqJkBCwAAvMuAgAAEbmFtZQHWSvsDAAVhYm9ydAETX2RldnNfcGFuaWNfaGFuZGxlcgINZW1fc2VuZF9mcmFtZQMQZW1fY29uc29sZV9kZWJ1ZwQEZXhpdAULZW1fdGltZV9ub3cGE2RldnNfZGVwbG95X2hhbmRsZXIHIGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5CCFlbXNjcmlwdGVuX3dlYnNvY2tldF9pc19zdXBwb3J0ZWQJGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwoyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQLM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAwzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkDTVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZA4aZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UPFGpkX2NyeXB0b19nZXRfcmFuZG9tEA9fX3dhc2lfZmRfY2xvc2URFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxIPX193YXNpX2ZkX3dyaXRlExZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFAtzZXRUZW1wUmV0MBUabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsWEV9fd2FzbV9jYWxsX2N0b3JzFw1mbGFzaF9wcm9ncmFtGAtmbGFzaF9lcmFzZRkKZmxhc2hfc3luYxoZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlchsUYXBwX2dldF9kZXZpY2VfY2xhc3McCGh3X3BhbmljHQhqZF9ibGluax4HamRfZ2xvdx8UamRfYWxsb2Nfc3RhY2tfY2hlY2sgCGpkX2FsbG9jIQdqZF9mcmVlIg10YXJnZXRfaW5faXJxIxJ0YXJnZXRfZGlzYWJsZV9pcnEkEXRhcmdldF9lbmFibGVfaXJxJRNqZF9zZXR0aW5nc19nZXRfYmluJhNqZF9zZXR0aW5nc19zZXRfYmluJxJkZXZzX3BhbmljX2hhbmRsZXIoEGpkX2VtX3NlbmRfZnJhbWUpGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyKhpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZysKamRfZW1faW5pdCwNamRfZW1fcHJvY2Vzcy0FZG1lc2cuFGpkX2VtX2ZyYW1lX3JlY2VpdmVkLxFqZF9lbV9kZXZzX2RlcGxveTARamRfZW1fZGV2c192ZXJpZnkxGGpkX2VtX2RldnNfY2xpZW50X2RlcGxveTIMaHdfZGV2aWNlX2lkMwx0YXJnZXRfcmVzZXQ0DnRpbV9nZXRfbWljcm9zNRJqZF90Y3Bzb2NrX3Byb2Nlc3M2EWFwcF9pbml0X3NlcnZpY2VzNxJkZXZzX2NsaWVudF9kZXBsb3k4FGNsaWVudF9ldmVudF9oYW5kbGVyOQthcHBfcHJvY2VzczoHdHhfaW5pdDsPamRfcGFja2V0X3JlYWR5PAp0eF9wcm9jZXNzPRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZT4OamRfd2Vic29ja19uZXc/Bm9ub3BlbkAHb25lcnJvckEHb25jbG9zZUIJb25tZXNzYWdlQxBqZF93ZWJzb2NrX2Nsb3NlRBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplRRZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlRg9yb2xlbWdyX3Byb2Nlc3NHEHJvbGVtZ3JfYXV0b2JpbmRIFXJvbGVtZ3JfaGFuZGxlX3BhY2tldEkUamRfcm9sZV9tYW5hZ2VyX2luaXRKGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZEsNamRfcm9sZV9hbGxvY0wQamRfcm9sZV9mcmVlX2FsbE0WamRfcm9sZV9mb3JjZV9hdXRvYmluZE4SamRfcm9sZV9ieV9zZXJ2aWNlTxNqZF9jbGllbnRfbG9nX2V2ZW50UBNqZF9jbGllbnRfc3Vic2NyaWJlURRqZF9jbGllbnRfZW1pdF9ldmVudFIUcm9sZW1ncl9yb2xlX2NoYW5nZWRTEGpkX2RldmljZV9sb29rdXBUGGpkX2RldmljZV9sb29rdXBfc2VydmljZVUTamRfc2VydmljZV9zZW5kX2NtZFYRamRfY2xpZW50X3Byb2Nlc3NXDmpkX2RldmljZV9mcmVlWBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldFkPamRfZGV2aWNlX2FsbG9jWg5hZ2didWZmZXJfaW5pdFsPYWdnYnVmZmVyX2ZsdXNoXBBhZ2didWZmZXJfdXBsb2FkXQ5kZXZzX2J1ZmZlcl9vcF4QZGV2c19yZWFkX251bWJlcl8PZGV2c19jcmVhdGVfY3R4YAlzZXR1cF9jdHhhCmRldnNfdHJhY2ViD2RldnNfZXJyb3JfY29kZWMZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlcmQJY2xlYXJfY3R4ZQ1kZXZzX2ZyZWVfY3R4Zg5kZXZzX3RyeV9hbGxvY2cIZGV2c19vb21oCWRldnNfZnJlZWkXZGV2aWNlc2NyaXB0bWdyX3Byb2Nlc3NqB3RyeV9ydW5rDHN0b3BfcHJvZ3JhbWwcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV9zdGFydG0cZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZW4YZGV2aWNlc2NyaXB0bWdyX2dldF9oYXNobx1kZXZpY2VzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldHAOZGVwbG95X2hhbmRsZXJxE2RlcGxveV9tZXRhX2hhbmRsZXJyFmRldmljZXNjcmlwdG1ncl9kZXBsb3lzFGRldmljZXNjcmlwdG1ncl9pbml0dBlkZXZpY2VzY3JpcHRtZ3JfY2xpZW50X2V2dRFkZXZzY2xvdWRfcHJvY2Vzc3YXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXR3E2RldnNjbG91ZF9vbl9tZXRob2R4DmRldnNjbG91ZF9pbml0eRBkZXZzX2ZpYmVyX3lpZWxkehZkZXZzX2ZpYmVyX2NvcHlfcGFyYW1zexhkZXZzX2ZpYmVyX2NhbGxfZnVuY3Rpb258GGRldnNfZmliZXJfc2V0X3dha2VfdGltZX0QZGV2c19maWJlcl9zbGVlcH4bZGV2c19maWJlcl9yZXR1cm5fZnJvbV9jYWxsfxpkZXZzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc4ABEWRldnNfaW1nX2Z1bl9uYW1lgQESZGV2c19pbWdfcm9sZV9uYW1lggESZGV2c19maWJlcl9ieV9maWR4gwERZGV2c19maWJlcl9ieV90YWeEARBkZXZzX2ZpYmVyX3N0YXJ0hQEUZGV2c19maWJlcl90ZXJtaWFudGWGAQ5kZXZzX2ZpYmVyX3J1bocBE2RldnNfZmliZXJfc3luY19ub3eIAQpkZXZzX3BhbmljiQEVX2RldnNfcnVudGltZV9mYWlsdXJligEPZGV2c19maWJlcl9wb2tliwEPamRfZ2NfdHJ5X2FsbG9jjAEJdHJ5X2FsbG9jjQEHZGV2c19nY44BD2ZpbmRfZnJlZV9ibG9ja48BC2pkX2djX3VucGlukAEKamRfZ2NfZnJlZZEBDmRldnNfdmFsdWVfcGlukgEQZGV2c192YWx1ZV91bnBpbpMBEmRldnNfbWFwX3RyeV9hbGxvY5QBFGRldnNfYXJyYXlfdHJ5X2FsbG9jlQEVZGV2c19idWZmZXJfdHJ5X2FsbG9jlgEVZGV2c19zdHJpbmdfdHJ5X2FsbG9jlwEPZGV2c19nY19zZXRfY3R4mAEOZGV2c19nY19jcmVhdGWZAQ9kZXZzX2djX2Rlc3Ryb3maAQRzY2FumwETc2Nhbl9hcnJheV9hbmRfbWFya5wBFGRldnNfamRfZ2V0X3JlZ2lzdGVynQEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZJ4BEGRldnNfamRfc2VuZF9jbWSfARNkZXZzX2pkX3NlbmRfbG9nbXNnoAENaGFuZGxlX2xvZ21zZ6EBEmRldnNfamRfc2hvdWxkX3J1bqIBF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hlowETZGV2c19qZF9wcm9jZXNzX3BrdKQBFGRldnNfamRfcm9sZV9jaGFuZ2VkpQEUZGV2c19qZF9yZXNldF9wYWNrZXSmARJkZXZzX2pkX2luaXRfcm9sZXOnARJkZXZzX2pkX2ZyZWVfcm9sZXOoARBkZXZzX3NldF9sb2dnaW5nqQEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzqgEMZGV2c19tYXBfc2V0qwEMZGV2c19tYXBfZ2V0rAEKZGV2c19pbmRleK0BDmRldnNfaW5kZXhfc2V0rgERZGV2c19hcnJheV9pbnNlcnSvARJkZXZzX3JlZ2NhY2hlX2ZyZWWwARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxssQEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWSyARNkZXZzX3JlZ2NhY2hlX2FsbG9jswEUZGV2c19yZWdjYWNoZV9sb29rdXC0ARFkZXZzX3JlZ2NhY2hlX2FnZbUBF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xltgESZGV2c19yZWdjYWNoZV9uZXh0twEPamRfc2V0dGluZ3NfZ2V0uAEPamRfc2V0dGluZ3Nfc2V0uQENY29uc3VtZV9jaHVua7oBDXNoYV8yNTZfY2xvc2W7AQ9qZF9zaGEyNTZfc2V0dXC8ARBqZF9zaGEyNTZfdXBkYXRlvQEQamRfc2hhMjU2X2ZpbmlzaL4BFGpkX3NoYTI1Nl9obWFjX3NldHVwvwEVamRfc2hhMjU2X2htYWNfZmluaXNowAEOamRfc2hhMjU2X2hrZGbBAQ5kZXZzX3N0cmZvcm1hdMIBDmRldnNfaXNfc3RyaW5nwwEUZGV2c19zdHJpbmdfZ2V0X3V0ZjjEARRkZXZzX3N0cmluZ192c3ByaW50ZsUBE2RldnNfc3RyaW5nX3NwcmludGbGARVkZXZzX3N0cmluZ19mcm9tX3V0ZjjHARRkZXZzX3ZhbHVlX3RvX3N0cmluZ8gBEGJ1ZmZlcl90b19zdHJpbmfJARJkZXZzX3N0cmluZ19jb25jYXTKARxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNjywEPdHNhZ2dfY2xpZW50X2V2zAEKYWRkX3Nlcmllc80BDXRzYWdnX3Byb2Nlc3POAQpsb2dfc2VyaWVzzwETdHNhZ2dfaGFuZGxlX3BhY2tldNABFGxvb2t1cF9vcl9hZGRfc2VyaWVz0QEKdHNhZ2dfaW5pdNIBDHRzYWdnX3VwZGF0ZdMBFmRldnNfdmFsdWVfZnJvbV9kb3VibGXUARNkZXZzX3ZhbHVlX2Zyb21faW501QEUZGV2c192YWx1ZV9mcm9tX2Jvb2zWARdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlctcBEWRldnNfdmFsdWVfdG9faW502AEUZGV2c192YWx1ZV90b19kb3VibGXZARJkZXZzX3ZhbHVlX3RvX2Jvb2zaAQ5kZXZzX2lzX2J1ZmZlctsBF2RldnNfYnVmZmVyX2lzX3dyaXRhYmxl3AEQZGV2c19idWZmZXJfZGF0Yd0BE2RldnNfYnVmZmVyaXNoX2RhdGHeARRkZXZzX3ZhbHVlX3RvX2djX29iat8BEWRldnNfdmFsdWVfdHlwZW9m4AEPZGV2c19pc19udWxsaXNo4QEOZGV2c19pc19udW1iZXLiARJkZXZzX3ZhbHVlX2llZWVfZXHjARJkZXZzX2ltZ19zdHJpZHhfb2vkAQtkZXZzX3ZlcmlmeeUBFGRldnNfdm1fZXhlY19vcGNvZGVz5gERZGV2c19pbWdfZ2V0X3V0ZjjnARRkZXZzX2dldF9zdGF0aWNfdXRmOOgBDGV4cHJfaW52YWxpZOkBEGV4cHJ4X2xvYWRfbG9jYWzqARFleHByeF9sb2FkX2dsb2JhbOsBEWV4cHIzX2xvYWRfYnVmZmVy7AENZXhwcnhfbGl0ZXJhbO0BEWV4cHJ4X2xpdGVyYWxfZjY07gENZXhwcjBfcmV0X3ZhbO8BDGV4cHIyX3N0cjBlcfABF2V4cHIxX3JvbGVfaXNfY29ubmVjdGVk8QEOZXhwcjBfcGt0X3NpemXyARFleHByMF9wa3RfZXZfY29kZfMBFmV4cHIwX3BrdF9yZWdfZ2V0X2NvZGX0AQlleHByMF9uYW71AQlleHByMV9hYnP2AQ1leHByMV9iaXRfbm909wEKZXhwcjFfY2VpbPgBC2V4cHIxX2Zsb29y+QEIZXhwcjFfaWT6AQxleHByMV9pc19uYW77AQtleHByMV9sb2dfZfwBCWV4cHIxX25lZ/0BCWV4cHIxX25vdP4BDGV4cHIxX3JhbmRvbf8BEGV4cHIxX3JhbmRvbV9pbnSAAgtleHByMV9yb3VuZIECDWV4cHIxX3RvX2Jvb2yCAglleHByMl9hZGSDAg1leHByMl9iaXRfYW5khAIMZXhwcjJfYml0X29yhQINZXhwcjJfYml0X3hvcoYCCWV4cHIyX2RpdocCCGV4cHIyX2VxiAIKZXhwcjJfaWRpdokCCmV4cHIyX2ltdWyKAghleHByMl9sZYsCCGV4cHIyX2x0jAIJZXhwcjJfbWF4jQIJZXhwcjJfbWlujgIJZXhwcjJfbXVsjwIIZXhwcjJfbmWQAglleHByMl9wb3eRAhBleHByMl9zaGlmdF9sZWZ0kgIRZXhwcjJfc2hpZnRfcmlnaHSTAhpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZJQCCWV4cHIyX3N1YpUCEGV4cHJ4X2xvYWRfcGFyYW2WAgxleHByMF9ub3dfbXOXAhZleHByMV9nZXRfZmliZXJfaGFuZGxlmAIVZXhwcjBfcGt0X3JlcG9ydF9jb2RlmQIWZXhwcjBfcGt0X2NvbW1hbmRfY29kZZoCEWV4cHJ4X3N0YXRpY19yb2xlmwIMc3RtdDRfbWVtc2V0nAIQZXhwcngxX2dldF9maWVsZJ0CC2V4cHIyX2luZGV4ngITZXhwcjFfb2JqZWN0X2xlbmd0aJ8CEWV4cHIxX2tleXNfbGVuZ3RooAIMZXhwcjFfdHlwZW9moQIKZXhwcjBfbnVsbKICDWV4cHIxX2lzX251bGyjAhBleHByMF9wa3RfYnVmZmVypAIKZXhwcjBfdHJ1ZaUCC2V4cHIwX2ZhbHNlpgIPc3RtdDFfd2FpdF9yb2xlpwINc3RtdDFfc2xlZXBfc6gCDnN0bXQxX3NsZWVwX21zqQIPc3RtdDNfcXVlcnlfcmVnqgIOc3RtdDJfc2VuZF9jbWSrAhNzdG10NF9xdWVyeV9pZHhfcmVnrAIRc3RtdHgyX2xvZ19mb3JtYXStAg1leHByeDJfZm9ybWF0rgIWc3RtdDFfc2V0dXBfcGt0X2J1ZmZlcq8CDXN0bXQyX3NldF9wa3SwAgpzdG10NV9ibGl0sQILc3RtdHgyX2NhbGyyAg5zdG10eDNfY2FsbF9iZ7MCDHN0bXQxX3JldHVybrQCCXN0bXR4X2ptcLUCDHN0bXR4MV9qbXBferYCC3N0bXQxX3BhbmljtwISc3RtdHgxX3N0b3JlX2xvY2FsuAITc3RtdHgxX3N0b3JlX2dsb2JhbLkCEnN0bXQ0X3N0b3JlX2J1ZmZlcroCEnN0bXR4MV9zdG9yZV9wYXJhbbsCFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcrwCD3N0bXQwX2FsbG9jX21hcL0CEXN0bXQxX2FsbG9jX2FycmF5vgISc3RtdDFfYWxsb2NfYnVmZmVyvwIQc3RtdHgyX3NldF9maWVsZMACD3N0bXQzX2FycmF5X3NldMECEnN0bXQzX2FycmF5X2luc2VydMICFWV4cHJ4X3N0YXRpY19mdW5jdGlvbsMCCmV4cHIyX2ltb2TEAgxleHByMV90b19pbnTFAhNleHByeF9zdGF0aWNfYnVmZmVyxgIbZXhwcnhfc3RhdGljX2J1aWx0aW5fc3RyaW5nxwIZZXhwcnhfc3RhdGljX2FzY2lpX3N0cmluZ8gCGGV4cHJ4X3N0YXRpY191dGY4X3N0cmluZ8kCEXN0bXQxX2RlY29kZV91dGY4ygIPZGV2c192bV9wb3BfYXJnywITZGV2c192bV9wb3BfYXJnX3UzMswCE2RldnNfdm1fcG9wX2FyZ19pMzLNAhRkZXZzX3ZtX3BvcF9hcmdfZnVuY84CE2RldnNfdm1fcG9wX2FyZ19mNjTPAhZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVy0AIbZGV2c192bV9wb3BfYXJnX2J1ZmZlcl9kYXRh0QIbZGV2c192bV9wb3BfYXJnX3N0cmluZ19kYXRh0gIWZGV2c192bV9wb3BfYXJnX3N0cmlkeNMCFGRldnNfdm1fcG9wX2FyZ19yb2xl1AITZGV2c192bV9wb3BfYXJnX21hcNUCEmpkX2Flc19jY21fZW5jcnlwdNYCEmpkX2Flc19jY21fZGVjcnlwdNcCDEFFU19pbml0X2N0eNgCD0FFU19FQ0JfZW5jcnlwdNkCEGpkX2Flc19zZXR1cF9rZXnaAg5qZF9hZXNfZW5jcnlwdNsCEGpkX2Flc19jbGVhcl9rZXncAgtqZF93c3NrX25ld90CFGpkX3dzc2tfc2VuZF9tZXNzYWdl3gITamRfd2Vic29ja19vbl9ldmVudN8CB2RlY3J5cHTgAg1qZF93c3NrX2Nsb3Nl4QIQamRfd3Nza19vbl9ldmVudOICCnNlbmRfZW1wdHnjAhJ3c3NraGVhbHRoX3Byb2Nlc3PkAhdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZeUCFHdzc2toZWFsdGhfcmVjb25uZWN05gIYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V05wIPc2V0X2Nvbm5fc3RyaW5n6AIRY2xlYXJfY29ubl9zdHJpbmfpAg93c3NraGVhbHRoX2luaXTqAhN3c3NrX3B1Ymxpc2hfdmFsdWVz6wIQd3Nza19wdWJsaXNoX2JpbuwCEXdzc2tfaXNfY29ubmVjdGVk7QITd3Nza19yZXNwb25kX21ldGhvZO4CD2pkX2N0cmxfcHJvY2Vzc+8CFWpkX2N0cmxfaGFuZGxlX3BhY2tldPACDGpkX2N0cmxfaW5pdPECDWpkX2lwaXBlX29wZW7yAhZqZF9pcGlwZV9oYW5kbGVfcGFja2V08wIOamRfaXBpcGVfY2xvc2X0AhJqZF9udW1mbXRfaXNfdmFsaWT1AhVqZF9udW1mbXRfd3JpdGVfZmxvYXT2AhNqZF9udW1mbXRfd3JpdGVfaTMy9wISamRfbnVtZm10X3JlYWRfaTMy+AIUamRfbnVtZm10X3JlYWRfZmxvYXT5AhFqZF9vcGlwZV9vcGVuX2NtZPoCFGpkX29waXBlX29wZW5fcmVwb3J0+wIWamRfb3BpcGVfaGFuZGxlX3BhY2tldPwCEWpkX29waXBlX3dyaXRlX2V4/QIQamRfb3BpcGVfcHJvY2Vzc/4CFGpkX29waXBlX2NoZWNrX3NwYWNl/wIOamRfb3BpcGVfd3JpdGWAAw5qZF9vcGlwZV9jbG9zZYEDDWpkX3F1ZXVlX3B1c2iCAw5qZF9xdWV1ZV9mcm9udIMDDmpkX3F1ZXVlX3NoaWZ0hAMOamRfcXVldWVfYWxsb2OFAw1qZF9yZXNwb25kX3U4hgMOamRfcmVzcG9uZF91MTaHAw5qZF9yZXNwb25kX3UzMogDEWpkX3Jlc3BvbmRfc3RyaW5niQMXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWSKAwtqZF9zZW5kX3BrdIsDHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFsjAMXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXKNAxlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0jgMUamRfYXBwX2hhbmRsZV9wYWNrZXSPAxVqZF9hcHBfaGFuZGxlX2NvbW1hbmSQAxNqZF9hbGxvY2F0ZV9zZXJ2aWNlkQMQamRfc2VydmljZXNfaW5pdJIDDmpkX3JlZnJlc2hfbm93kwMZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZJQDFGpkX3NlcnZpY2VzX2Fubm91bmNllQMXamRfc2VydmljZXNfbmVlZHNfZnJhbWWWAxBqZF9zZXJ2aWNlc190aWNrlwMVamRfcHJvY2Vzc19ldmVyeXRoaW5nmAMaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWZAxJhcHBfZ2V0X2Z3X3ZlcnNpb26aAxZhcHBfZ2V0X2Rldl9jbGFzc19uYW1lmwMNamRfaGFzaF9mbnYxYZwDDGpkX2RldmljZV9pZJ0DCWpkX3JhbmRvbZ4DCGpkX2NyYzE2nwMOamRfY29tcHV0ZV9jcmOgAw5qZF9zaGlmdF9mcmFtZaEDDmpkX3Jlc2V0X2ZyYW1logMQamRfcHVzaF9pbl9mcmFtZaMDDWpkX3BhbmljX2NvcmWkAxNqZF9zaG91bGRfc2FtcGxlX21zpQMQamRfc2hvdWxkX3NhbXBsZaYDCWpkX3RvX2hleKcDC2pkX2Zyb21faGV4qAMOamRfYXNzZXJ0X2ZhaWypAwdqZF9hdG9pqgMLamRfdnNwcmludGarAw9qZF9wcmludF9kb3VibGWsAxJqZF9kZXZpY2Vfc2hvcnRfaWStAwxqZF9zcHJpbnRmX2GuAwtqZF90b19oZXhfYa8DFGpkX2RldmljZV9zaG9ydF9pZF9hsAMJamRfc3RyZHVwsQMOamRfanNvbl9lc2NhcGWyAxNqZF9qc29uX2VzY2FwZV9jb3JlswMJamRfbWVtZHVwtAMWamRfcHJvY2Vzc19ldmVudF9xdWV1ZbUDFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWW2AxFqZF9zZW5kX2V2ZW50X2V4dLcDCmpkX3J4X2luaXS4AxRqZF9yeF9mcmFtZV9yZWNlaXZlZLkDHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrugMPamRfcnhfZ2V0X2ZyYW1luwMTamRfcnhfcmVsZWFzZV9mcmFtZbwDEWpkX3NlbmRfZnJhbWVfcmF3vQMNamRfc2VuZF9mcmFtZb4DCmpkX3R4X2luaXS/AwdqZF9zZW5kwAMWamRfc2VuZF9mcmFtZV93aXRoX2NyY8EDD2pkX3R4X2dldF9mcmFtZcIDEGpkX3R4X2ZyYW1lX3NlbnTDAwtqZF90eF9mbHVzaMQDEF9fZXJybm9fbG9jYXRpb27FAwVkdW1tecYDCF9fbWVtY3B5xwMHbWVtbW92ZcgDBm1lbXNldMkDCl9fbG9ja2ZpbGXKAwxfX3VubG9ja2ZpbGXLAwxfX3N0ZGlvX3NlZWvMAw1fX3N0ZGlvX3dyaXRlzQMNX19zdGRpb19jbG9zZc4DDF9fc3RkaW9fZXhpdM8DCmNsb3NlX2ZpbGXQAwlfX3Rvd3JpdGXRAwlfX2Z3cml0ZXjSAwZmd3JpdGXTAytlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxz1AMUX19wdGhyZWFkX211dGV4X2xvY2vVAxZfX3B0aHJlYWRfbXV0ZXhfdW5sb2Nr1gMGX19sb2Nr1wMOX19tYXRoX2Rpdnplcm/YAw5fX21hdGhfaW52YWxpZNkDA2xvZ9oDBWxvZzEw2wMHX19sc2Vla9wDBm1lbWNtcN0DCl9fb2ZsX2xvY2veAwxfX21hdGhfeGZsb3ffAwpmcF9iYXJyaWVy4AMMX19tYXRoX29mbG934QMMX19tYXRoX3VmbG934gMEZmFic+MDA3Bvd+QDCGNoZWNraW505QMLc3BlY2lhbGNhc2XmAwVyb3VuZOcDBnN0cmNocugDC19fc3RyY2hybnVs6QMGc3RyY21w6gMGc3RybGVu6wMSX193YXNpX3N5c2NhbGxfcmV07AMIZGxtYWxsb2PtAwZkbGZyZWXuAxhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXvAwRzYnJr8AMJX19wb3dpZGYy8QMJc3RhY2tTYXZl8gMMc3RhY2tSZXN0b3Jl8wMKc3RhY2tBbGxvY/QDFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdPUDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWX2AxllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl9wMYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k+AMMZHluQ2FsbF9qaWpp+QMWbGVnYWxzdHViJGR5bkNhbGxfamlqafoDGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAfgDBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
