
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB04GAgAAhYAN/f38AYAJ/fwBgAX8AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAn98AGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAd/f39/f39/AX9gA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/AsyFgIAAFgNlbnYFYWJvcnQABQNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgACA2Vudg1lbV9zZW5kX2ZyYW1lAAIDZW52EGVtX2NvbnNvbGVfZGVidWcAAgNlbnYEZXhpdAACA2VudgtlbV90aW1lX25vdwASA2VudhNkZXZzX2RlcGxveV9oYW5kbGVyAAIDZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAYDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAGA2VudhRqZF9jcnlwdG9fZ2V0X3JhbmRvbQABFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAYWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQDZW52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lAEgBCAAKQOgAT4CFCAEIQYLIAVBIGokACAGC40DAQR/IwBBIGsiASQAIAAvARIhAiABIAAoAiwoAIgBIgM2AhhBziohBAJAIANBJGooAgBBBHYgAk0NACABKAIYIgQgBCgCIGogAkEEdGovAQwhAiABIAQ2AhQgAUEUaiACQQAQ4AEiAkHOKiACGyEECyABIAAvARI2AgggASAENgIEIAFBwBo2AgBBwh8gARAtAkAgACgCLCICKAKQASAARw0AAkAgAigCjAEiBEUNACACLQAGQQhxDQAgASAELwEAOwEYIAJBxwAgAUEYakECEGELIAJCADcCjAELAkAgACgCKCICRQ0AA0AgAigCBCEEIAIoAggoAiwhAwJAIAItABVBAXFFDQAgAyACKAIQEGgLIAMgAhBoIAQhAiAEDQALCyAAEJ0BAkACQAJAIAAoAiwiAygClAEiAiAARw0AIAMgACgCADYClAEMAQsDQCACIgRFDQIgBCgCACICIABHDQALIAQgACgCADYCAAsgAyAAEGggAUEgaiQADwtBqilB1yFBzgBBtBMQoQMAC60BAQR/IwBBEGsiASQAAkAgACgCLCICLwEIDQAQiwMgAkEAKQPIpQE3A6ABIAAQoQFFDQAgABCdASAAQQA2AhQgAEH//wM7AQ4gAiAANgKQASAAKAIoIgMoAggiBCADNgIoAkAgBCgCLCIELwEIDQAgBCADNgKMAQsCQCACLQAGQQhxDQAgASAAKAIoLwEAOwEIIAJBxgAgAUEIakECEGELIAIQ3wELIAFBEGokAAsSABCLAyAAQQApA8ilATcDoAELkgMBCH8jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAwJAAkAgACgCjAEiBA0AQQAhBAwBCyAELwEAIQQLIAAgBDsBCgJAAkAgA0Hg1ANHDQBB1h1BABAtDAELIAIgAzYCECACIARB//8DcTYCFEHjHyACQRBqEC0LIAAgAzsBCAJAIANB4NQDRg0AIAAoAowBIgNFDQADQCAAKACIASIFKAIgIQYgAy8BACEEIAMoAgwiBygCACEIIAIgACgAiAEiCTYCGCAEIAhrIQhBziohBAJAIAlBJGooAgBBBHYgByAFIAZqayIGQQR1IgVNDQAgAigCGCIEIAQoAiBqIAZqQQxqLwEAIQYgAiAENgIMIAJBDGog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AgBBCHY6AAAgASACQQNyaiAEKAIAOgAAIAJBBGohAiAFQQFqIgVBCEcNAAsgACgCAAuQAQAQIwJAQQAtAPygAUUNAEGKJ0EOQb8TEJwDAAtBAEEBOgD8oAEQJEEAQquzj/yRo7Pw2wA3AuihAUEAQv+kuYjFkdqCm383AuChAUEAQvLmu+Ojp/2npX83AtihAUEAQufMp9DW0Ouzu383AtChAUEAQsAANwLIoQFBAEGEoQE2AsShAUEAQfChATYCgKEBC9UBAQJ/AkAgAUUNAEEAQQAoAsyhASABajYCzKEBA0ACQEEAKALIoQEiAkHAAEcNACABQcAASQ0AQdChASAAELkBIABBwABqIQAgAUFAaiIBDQEMAgtBACgCxKEBIAAgASACIAEgAkkbIgIQvwMaQQBBACgCyKEBIgMgAms2AsihASAAIAJqIQAgASACayEBAkAgAyACRw0AQdChAUGEoQEQuQFBAEHAADYCyKEBQQBBhKEBNgLEoQEgAQ0BDAILQQBBACgCxKEBIAJqNgLEoQEgAQ0ACwsLTABBgKEBELoBGiAAQRhqQQApA4iiATcAACAAQRBqQQApA4CiATcAACAAQQhqQQApA/ihATcAACAAQQApA/ChATcAAEEAQQA6APygAQuTBwECf0EAIQJBAEIANwPIogFBAEIANwPAogFBAEIANwO4ogFBAEIANwOwogFBAEIANwOoogFBAEIANwOgogFBAEIANwOYogFBAEIANwOQogECQAJAAkACQCABQcEASQ0AECNBAC0A/KABDQJBAEEBOgD8oAEQJEEAIAE2AsyhAUEAQcAANgLIoQFBAEGEoQE2AsShAUEAQfChATYCgKEBQQBCq7OP/JGjs/DbADcC6KEBQQBC/6S5iMWR2oKbfzcC4KEBQQBC8ua746On/aelfzcC2KEBQQBC58yn0NbQ67O7fzcC0KEBAkADQAJAQQAoAsihASICQcAARw0AIAFBwABJDQBB0KEBIAAQuQEgAEHAAGohACABQUBqIgENAQwCC0EAKALEoQEgACABIAIgASACSRsiAhC/AxpBAEEAKALIoQEiAyACazYCyKEBIAAgAmohACABIAJrIQECQCADIAJHDQBB0KEBQYShARC5AUEAQcAANgLIoQFBAEGEoQE2AsShASABDQEMAgtBAEEAKALEoQEgAmo2AsShASABDQALC0GAoQEQugEaQQAhAkEAQQApA4iiATcDqKIBQQBBACkDgKIBNwOgogFBAEEAKQP4oQE3A5iiAUEAQQApA/ChATcDkKIBQQBBADoA/KABDAELQZCiASAAIAEQvwMaCwNAIAJBkKIBaiIBIAEtAABBNnM6AAAgAkEBaiICQcAARw0ADAILAAtBiidBDkG/ExCcAwALECMCQEEALQD8oAENAEEAQQE6APygARAkQQBCwICAgPDM+YTqADcCzKEBQQBBwAA2AsihAUEAQYShATYCxKEBQQBB8KEBNgKAoQFBAEGZmoPfBTYC7KEBQQBCjNGV2Lm19sEfNwLkoQFBAEK66r+q+s+Uh9EANwLcoQFBAEKF3Z7bq+68tzw3AtShAUGQogEhAUHAACECAkADQAJAQQAoAsihASIAQcAARw0AIAJBwABJDQBB0KEBIAEQuQEgAUHAAGohASACQUBqIgINAQwCC0EAKALEoQEgASACIAAgAiAASRsiABC/AxpBAEEAKALIoQEiAyAAazYCyKEBIAEgAGohASACIABrIQICQCADIABHDQBB0KEBQYShARC5AUEAQcAANgLIoQFBAEGEoQE2AsShASACDQEMAgtBAEEAKALEoQEgAGo2AsShASACDQALCw8LQYonQQ5BvxMQnAMAC7sGAQR/QYChARC6ARpBACEBIABBGGpBACkDiKIBNwAAIABBEGpBACkDgKIBNwAAIABBCGpBACkD+KEBNwAAIABBACkD8KEBNwAAQQBBADoA/KABECMCQEEALQD8oAENAEEAQQE6APygARAkQQBCq7OP/JGjs/DbADcC6KEBQQBC/6S5iMWR2oKbfzcC4KEBQQBC8ua746On/aelfzcC2KEBQQBC58yn0NbQ67O7fzcC0KEBQQBCwAA3AsihAUEAQYShATYCxKEBQQBB8KEBNgKAoQEDQCABQZCiAWoiAiACLQAAQeoAczoAACABQQFqIgFBwABHDQALQQBBwAA2AsyhAUGQogEhAkHAACEBAkADQAJAQQAoAsihASIDQcAARw0AIAFBwABJDQBB0KEBIAIQuQEgAkHAAGohAiABQUBqIgENAQwCC0EAKALEoQEgAiABIAMgASADSRsiAxC/AxpBAEEAKALIoQEiBCADazYCyKEBIAIgA2ohAiABIANrIQECQCAEIANHDQBB0KEBQYShARC5AUEAQcAANgLIoQFBAEGEoQE2AsShASABDQEMAgtBAEEAKALEoQEgA2o2AsShASABDQALC0EgIQFBAEEAKALMoQFBIGo2AsyhASAAIQICQANAAkBBACgCyKEBIgNBwABHDQAgAUHAAEkNAEHQoQEgAhC5ASACQcAAaiECIAFBQGoiAQ0BDAILQQAoAsShASACIAEgAyABIANJGyIDEL8DGkEAQQAoAsihASIEIANrNgLIoQEgAiADaiECIAEgA2shAQJAIAQgA0cNAEHQoQFBhKEBELkBQQBBwAA2AsihAUEAQYShATYCxKEBIAENAQwCC0EAQQAoAsShASADajYCxKEBIAENAAsLQYChARC6ARogAEEYakEAKQOIogE3AAAgAEEQakEAKQOAogE3AAAgAEEIakEAKQP4oQE3AAAgAEEAKQPwoQE3AABBAEIANwOQogFBAEIANwOYogFBAEIANwOgogFBAEIANwOoogFBAEIANwOwogFBAEIANwO4ogFBAEIANwPAogFBAEIANwPIogFBAEEAOgD8oAEPC0GKJ0EOQb8TEJwDAAviBgAgACABEL4BAkAgA0UNAEEAQQAoAsyhASADajYCzKEBA0ACQEEAKALIoQEiAEHAAEcNACADQcAASQ0AQdChASACELkBIAJBwABqIQIgA0FAaiIDDQEMAgtBACgCxKEBIAIgAyAAIAMgAEkbIgAQvwMaQQBBACgCyKEBIgEgAGs2AsihASACIABqIQIgAyAAayEDAkAgASAARw0AQdChAUGEoQEQuQFBAEHAADYCyKEBQQBBhKEBNgLEoQEgAw0BDAILQQBBACgCxKEBIABqNgLEoQEgAw0ACwsgCBC/ASAIQSAQvgECQCAFRQ0AQQBBACgCzKEBIAVqNgLMoQEDQAJAQQAoAsihASIDQcAARw0AIAVBwABJDQBB0KEBIAQQuQEgBEHAAGohBCAFQUBqIgUNAQwCC0EAKALEoQEgBCAFIAMgBSADSRsiAxC/AxpBAEEAKALIoQEiAiADazYCyKEBIAQgA2ohBCAFIANrIQUCQCACIANHDQBB0KEBQYShARC5AUEAQcAANgLIoQFBAEGEoQE2AsShASAFDQEMAgtBAEEAKALEoQEgA2o2AsShASAFDQALCwJAIAdFDQBBAEEAKALMoQEgB2o2AsyhAQNAAkBBACgCyKEBIgNBwABHDQAgB0HAAEkNAEHQoQEgBhC5ASAGQcAAaiEGIAdBQGoiBw0BDAILQQAoAsShASAGIAcgAyAHIANJGyIDEL8DGkEAQQAoAsihASIFIANrNgLIoQEgBiADaiEGIAcgA2shBwJAIAUgA0cNAEHQoQFBhKEBELkBQQBBwAA2AsihAUEAQYShATYCxKEBIAcNAQwCC0EAQQAoAsShASADajYCxKEBIAcNAAsLQQEhA0EAQQAoAsyhAUEBajYCzKEBQaMzIQUCQANAAkBBACgCyKEBIgdBwABHDQAgA0HAAEkNAEHQoQEgBRC5ASAFQcAAaiEFIANBQGoiAw0BDAILQQAoAsShASAFIAMgByADIAdJGyIHEL8DGkEAQQAoAsihASICIAdrNgLIoQEgBSAHaiEFIAMgB2shAwJAIAIgB0cNAEHQoQFBhKEBELkBQQBBwAA2AsihAUEAQYShATYCxKEBIAMNAQwCC0EAQQAoAsShASAHajYCxKEBIAMNAAsLIAgQvwEL/AQBB38jAEHQAGsiByQAIANBAEchCAJAAkAgAQ0AQQAhCQwBC0EAIQkgA0UNAEEAIQpBACEJA0AgCkEBaiEIAkACQAJAAkACQCAAIApqLQAAIgtB+wBHDQAgCCABSQ0BCwJAIAtB/QBGDQAgCCEKDAMLIAggAUkNASAIIQoMAgsgCkECaiEKIAAgCGotAAAiC0H7AEYNAQJAAkAgC0FQakH/AXFBCUsNACALQRh0QRh1QVBqIQwMAQtBfyEMIAtBIHIiCEGff2pB/wFxQRlLDQAgCEEYdEEYdUGpf2ohDAsCQCAMQQBODQBBISELDAILIAohCAJAIAogAU8NAANAIAAgCGotAABB/QBGDQEgCEEBaiIIIAFHDQALIAEhCAtBfyENAkAgCiAITw0AAkAgACAKaiwAACIKQVBqIgtB/wFxQQlLDQAgCyENDAELIApBIHIiCkGff2pB/wFxQRlLDQAgCkGpf2ohDQsgCEEBaiEKQT8hCyAMIAVODQEgByAEIAxBA3RqKQMANwMIIAdBEGogB0EIahDWAUEHIA1BAWogDUEASBsQpAMgBy0AECILRQ0CIAdBEGohCCAJIANPDQIDQCAIQQFqIQgCQAJAIAYNACACIAlqIAs6AAAgCUEBaiEJQQAhBgwBCyAGQX9qIQYLIAgtAAAiC0UNAyAJIANJDQAMAwsACyAKQQJqIAggACAIai0AAEH9AEYbIQoLAkAgBg0AIAIgCWogCzoAACAJQQFqIQlBACEGDAELIAZBf2ohBgsgCSADSSEIIAogAU8NASAJIANJDQALCyACIAkgA0F/aiAIG2pBADoAACAHQdAAaiQAIAkgAyAIGwtlAQJ/QQAhAgJAAkAgASgCBCIDQf//P3FBACADQYCAYHFBgIDA/wdGGyIDQQRGDQAgA0GDAUcNASABKAIAIgFFDQEgASgCAEGAgID4AHFBgICAMEYPCyABKAIAQf//AEshAgsgAguHAQECfyMAQRBrIgQkACAEIAM2AgwgBCADNgIIQQBBACACIAMQowMhAwJAAkAgASgCuAEgAxCWASIFDQAgBCABQZABEIkBIARBASACIAQoAggQowMaIABBACkDqDg3AwAMAQsgBUEGaiADIAIgBCgCCBCjAxogACABQQYgBRDUAQsgBEEQaiQACyYBAX8jAEEQayIEJAAgBCADNgIMIAAgASACIAMQwwEgBEEQaiQAC1sBAn8jAEEQayIEJAACQAJAIAEoArgBIAMQlgEiBQ0AIARBCGogAUGRARCJASAAQQApA6g4NwMADAELIAVBBmogAiADEL8DGiAAIAFBBiAFENQBCyAEQRBqJAAL+wYDA38BfAF+IwBBsAFrIgMkAAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAIoAgQiBEH//z9xQQAgBEGAgGBxQYCAwP8HRhsiBA4HBAUGCwEJBwALIARBgwFHDQogAigCACIFRQ0CIAUoAgBBgICA+ABxQYCAgDBGIQUMAQsgAigCAEH//wBLIQULIAVFDQAgACACKQMANwMADAwLIAQOBwABAgcEBQMGCyADIAIpAwA3AwggA0EIahDWASIGvUL///////////8Ag0KBgICAgICA+P8AVA0HIABCloCBgMCAgPj/ADcDAAwKCwJAAkACQAJAAkACQCACKAIAIgIOAgMBAAsgAkFAag4CAQMECyAAQpSAgYDAgID4/wA3AwAMDQsgAEKTgIGAwICA+P8ANwMADAwLIABCkoCBgMCAgPj/ADcDAAwLCyAAQpWAgYDAgID4/wA3AwAMCgtBrSRB8ABBrhcQnAMACyADIAIoAgA2AhAgACABQcsnIANB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ACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoAtClASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQTiIARQ0AIAIgACgCBBCpAzYCDAsgAkGTHhDMASACC+gGAgh/AnwjAEEQayIBJAACQAJAIAAoAghFDQBBACgC0KUBIAAoAhxrQQBODQELAkAgAEEYakGAwLgCEJ4DRQ0AAkAgACgCJCICRQ0AA0ACQCACLQAJIAItAAhHDQAgAkEAOgAJCyACIAItAAk6AAggAigCACICDQALCyAAKAIoIgJFDQACQCACIAAoAgwiA08NACAAIAJB0A9qNgIoCyAAKAIoIANNDQAgACADNgIoCwJAIABBFGoiBEGAoAYQngNFDQAgACgCJCICRQ0AA0ACQCACKAIEIgNFDQAgAi0ACUExSw0AIAFB+gE6AA8CQAJAIANBg8AAIAFBD2pBARBVIgNFDQAgBEEAKAKQngFBgMAAajYCAAwBCyACIAEtAA86AAkLIAMNAgsgAigCACICDQALCwJAIAAoAiQiAkUNACAAQQxqIQUgAEEoaiEGA0ACQCACQcQAaigCACIDQQAoAtClAWtBf0oNAAJAAkACQCACQSBqIgQoAgANACACQoCAgICAgID8/wA3AxgMAQsgAisDGCADIAIoAhRruKIhCSACQShqKwMAIQoCQAJAIAIoAgwiAw0AQQAhBwwBCyADEOMDIQcLIAkgCqAhCSAHQSlqECAiA0EgaiAEQSBqKQMANwMAIANBGGogBEEYaikDADcDACADQRBqIARBEGopAwA3AwAgA0EIaiAEQQhqKQMANwMAIAMgBCkDADcDACAHQShqIQQCQCACKAIMIghFDQAgA0EoaiAIIAcQvwMaCyADIAkgAigCRCACQcAAaigCAGu4ozkDCCAALQAEQZABIAMgBBC4AyIEDQECQCACLAAKIgdBf0cNACAAQRFBECACKAIMG2otAAAhBwsCQCAHRQ0AIAIoAgwgAigCBCADIAAoAiAoAggRBgBFDQAgAkGlHhDMAQsgAxAhIAQNAgsgAkHAAGogAigCRCIDNgIAAkAgAigCECIEDQAgBSEEAkAgAC0AEkUNACAGIQQgBigCAA0AIAZBiCc2AgAgBiEECyAEKAIAIQQLIAJBADYCICACIAM2AhQgAiAEIANqNgJEIAJBOGogAisDGCIJOQMAIAJBMGogCTkDACACQShqQgA3AwAMAQsgAxAhCyACKAIAIgINAAsLIAFBEGokAA8LQZgMQQAQLRAzAAvEAQECfyMAQcAAayICJAACQAJAIAAoAgQiA0UNACACQTtqIANBACADLQAEa0EMbGpBZGopAwAQpQMgACgCBC0ABCEDAkAgACgCDCIARQ0AIAIgATYCLCACIAM2AiggAiAANgIgIAIgAkE7ajYCJEHJESACQSBqEC0MAgsgAiABNgIYIAIgAzYCFCACIAJBO2o2AhBBrxEgAkEQahAtDAELIAAoAgwhACACIAE2AgQgAiAANgIAQbkQIAIQLQsgAkHAAGokAAuaBQICfwF8AkACQAJAAkACQAJAIAEvAQ5BgH9qDgYABAQBAgMECwJAIAAoAiQiAUUNAANAIAAgASgCACICNgIkIAEoAgwQISABECEgAiEBIAINAAsLIABBADYCKA8LQQAhAgJAIAEtAAwiA0EJSQ0AIAAgAUEYaiADQXhqEM4BIQILIAJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAgAiACQcAAaigCADYCFAsgAiACKAIgQQFqNgIgIAIoAhQhAAJAAkBBACgC0KUBIgMgAkHEAGooAgAiAWtBAEgNACACQShqIgMgAisDGCABIABruKIgAysDAKA5AwAMAQsgAkEoaiIBIAIrAxggAyAAa7iiIAErAwCgOQMAIAMhAQsgAiABNgIUAkAgAkE4aisDACAEY0UNACACIAQ5AzgLAkAgAkEwaisDACAEZEUNACACIAQ5AzALIAIgBDkDGA8LQQAhAgJAIAEtAAwiA0EFSQ0AIAAgAUEUaiADQXxqEM4BIQILIAJFDQIgAiABKAIQIgFBgLiZKSABQYC4mSlJGzYCEA8LQQAhAgJAIAEtAAwiA0ECSQ0AIAAgAUERaiADQX9qEM4BIQILIAJFDQEgAiABLQAQQQBHOgAKDwsCQAJAIAAgAUHwNxCEA0H/fmoOBAACAgECCyAAIAAoAgwiAUGAuJkpIAFBgLiZKUkbNgIMDwsgACAAKAIIIgFBgLiZKSABQYC4mSlJGyIBNgIIIAFFDQAgAEEAKALQpQEgAWo2AhwLC/oBAQR/IAJBAWohAyABQdAqIAEbIQQCQCAAKAIkIgFFDQADQAJAIAEoAgwiBUUNACAFIAQgAxDVA0UNAgsgASgCACIBDQALCwJAIAENAEHIABAgIgFB/wE6AAogAUEANgIEIAEgACgCJDYCACAAIAE2AiQgAUKAgICAgICA/P8ANwMYIAFBACgC0KUBIgY2AkACQCABKAIQIgUNAAJAAkAgAC0AEkUNACAAQShqIQUgACgCKA0BIAVBiCc2AgAMAQsgAEEMaiEFCyAFKAIAIQULIAEgBSAGajYCRCABQZMeEMwBIAEgAxAgIgU2AgwgBSAEIAIQvwMaCyABCzgBAX9BAEGAOBCJAyIBNgLQogEgAUEBOgASIAEgADYCICABQeDUAzYCDCABQYECOwEQQRAgARBQC8oCAQN/AkBBACgC0KIBIgJFDQAgAiAAIAAQ4wMQzgEhACABvUL///////////8Ag0KAgICAgICA+P8AVg0AAkAgACkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAAgATkDGCAAQQA2AiAgAEE4aiABOQMAIABBMGogATkDACAAQShqQgA3AwAgACAAQcAAaigCADYCFAsgACAAKAIgQQFqNgIgIAAoAhQhAwJAAkBBACgC0KUBIgQgAEHEAGooAgAiAmtBAEgNACAAQShqIgQgACsDGCACIANruKIgBCsDAKA5AwAMAQsgAEEoaiICIAArAxggBCADa7iiIAIrAwCgOQMAIAQhAgsgACACNgIUAkAgAEE4aisDACABY0UNACAAIAE5AzgLAkAgAEEwaisDACABZEUNACAAIAE5AzALIAAgATkDGAsLpgICAn4EfwJAIAG9IgJC////////////AINCgYCAgICAgPj/AFQNACAAQoCAgICAgID8/wA3AwAPCwJAIAJCIIgiAyAChKcNACAAQoCAgIBwNwMADwsCQCADpyIEQRR2Qf8PcSIFQf8HSQ0AIAKnIQYCQAJAIAVBkwhLDQAgBg0CAkAgBUGTCEYNACAEQf//P3EgBUGNeGp0DQMLIARB//8/cUGAgMAA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QX9GDQELIAMgAkEQaikDADcDECACIANBEGoQ1gE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDWASIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhDTASADQSBqJAALkgICBX8CfCMAQSBrIgMkACADQRhqIAIQxAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEMQCIAIgAykDGDcDECACQRBqIQUCQAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAUpAwA3AxAgAiADQRBqENYBOQMgIAMgBCkDADcDCCACQShqIgYgA0EIahDWATkDAEGYOCEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBCAFIAIbIQcLIAAgBykDADcDACADQSBqJAALkgICBX8CfCMAQSBrIgMkACADQRhqIAIQxAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEMQCIAIgAykDGDcDECACQRBqIQUCQAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAUpAwA3AxAgAiADQRBqENYBOQMgIAMgBCkDADcDCCACQShqIgYgA0EIahDWATkDAEGYOCEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBSAEIAIbIQcLIAAgBykDADcDACADQSBqJAALygEDA38BfgF8IwBBIGsiAyQAIANBGGogAhDEAiACQRhqIgQgAykDGDcDACADQRhqIAIQxAIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAI0AhAgAjQCGH4iBkIgiKcgBqciBUEfdUcNACAAIAUQ0gEMAQsgAyACQRBqKQMANwMQIAIgA0EQahDWATkDICADIAQpAwA3AwggAkEoaiADQQhqENYBIgc5AwAgACAHIAIrAyCiENEBCyADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQxAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEMQCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqENYBOQMgIAMgBCkDADcDCCACQShqIANBCGoQ1gEiBTkDACAFIAIrAyBiIQIMAQsgAigCECACKAIYRyECCyAAIAIQ0wEgA0EgaiQAC4UBAgJ/AXwjAEEgayIDJAAgA0EYaiACEMQCIAJBGGoiBCADKQMYNwMAIANBGGogAhDEAiACIAMpAxg3AxAgAyACKQMQNwMQIAIgA0EQahDWATkDICADIAQpAwA3AwggAkEoaiADQQhqENYBIgU5AwAgACACKwMgIAUQ3AMQ0QEgA0EgaiQACywBAn8gAkEYaiIDIAIQxgI2AgAgAiACEMYCIgQ2AhAgACAEIAMoAgB0ENIBCywBAn8gAkEYaiIDIAIQxgI2AgAgAiACEMYCIgQ2AhAgACAEIAMoAgB1ENIBC0EBAn8gAkEYaiIDIAIQxgI2AgAgAiACEMYCIgQ2AhACQCAEIAMoAgB2IgJBf0oNACAAIAK4ENEBDwsgACACENIBC8gBAgR/AXwjAEEgayIDJAAgA0EYaiACEMQCIAJBGGoiBCADKQMYNwMAIANBGGogAhDEAiACIAMpAxg3AxACQAJAIAJBFGooAABBf0cNACAEKAAEQX9HDQAgAigCGCIFQQBKIAIoAhAiBiAFayIFIAZIcw0AIAAgBRDSAQwBCyADIAJBEGopAwA3AxAgAiADQRBqENYBOQMgIAMgBCkDADcDCCACQShqIANBCGoQ1gEiBzkDACAAIAIrAyAgB6EQ0QELIANBIGokAAsyAQF/Qag4IQMCQCACKAI0IgIgAS0AFE8NACABKAIQIAJBA3RqIQMLIAAgAykDADcDAAsOACAAIAIpA6ABuhDRAQuJAQEBfyMAQRBrIgMkACADQQhqIAIQxAIgAyADKQMINwMAAkACQCADENwBRQ0AIAEoAgghAQwBC0EAIQEgAygCDEGGgMD/B0cNACACIAMoAggQggEhAQsCQAJAIAENACAAQQApA6g4NwMADAELIAAgASgCGDYCACAAQYKAwP8HNgIECyADQRBqJAALLQACQCACQcMBai0AAEEBcQ0AIAAgAkHOAWovAQAQ0gEPCyAAQQApA6g4NwMACy4AAkAgAkHDAWotAABBAXFFDQAgACACQc4Bai8BABDSAQ8LIABBACkDqDg3AwALXwECfyMAQRBrIgMkAAJAAkAgAigAiAFBPGooAgBBA3YgAigCNCIESw0AIANBCGogAkHvABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYWAwP8HNgIECyADQRBqJAALZQEFfyMAQRBrIgIkACABEMUCIQMgARDFAiEEIAEQxQIhBSABIAJBDGoQygIhAQJAIAIoAgwiBiAFTQ0AIAIgBiAFayIGNgIMIAEgBWogAyAGIAQgBiAESRsQwQMaCyACQRBqJAALNQECfyACKAI0IQMCQCACQQAQzQIiBA0AIABBACkDqDg3AwAPCyAAIAIgBCADQf//A3EQqwELOgECfyMAQRBrIgMkACACEMUCIQQgA0EIaiACEMQCIAMgAykDCDcDACAAIAIgAyAEEKwBIANBEGokAAvDAQECfyMAQTBrIgMkACADQShqIAIQxAIgAyADKQMoNwMYAkACQAJAIAIgA0EYahDYAUUNACADIAMpAyg3AwggAiADQQhqIANBJGoQ2QEaDAELIAMgAykDKDcDEAJAAkAgAiADQRBqENoBIgQNAEEAIQIMAQsgBCgCAEGAgID4AHFBgICAGEYhAgsCQAJAIAJFDQAgAyAELwEINgIkDAELIABBACkDkDg3AwALIAJFDQELIAAgAygCJBDSAQsgA0EwaiQACyYAAkAgAkEAEM0CIgINACAAQQApA5A4NwMADwsgACACLwEEENIBCzQBAX8jAEEQayIDJAAgA0EIaiACEMQCIAMgAykDCDcDACAAIAIgAxDbARDSASADQRBqJAALDQAgAEEAKQOoODcDAAtNAQF/IwBBEGsiAyQAIANBCGogAhDEAiAAQbg4QbA4IAMoAggbIgIgAkG4OCADKAIMQYGAwP8HRhsgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA8A4NwMACw0AIABBACkDsDg3AwALDQAgAEEAKQO4ODcDAAshAQF/IAEQzAIhAiAAKAIIIgAgAjsBDiAAQQAQfCABEHkLVQEBfAJAAkAgARDIAkQAAAAAAECPQKJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELAkAgAUEASA0AIAAoAgggARB9CwsaAAJAIAEQxgIi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DAELIAEgAigCGBCDASIBRQ0AIAAoAghBACkDkDg3AyAgARCFAQsgAkEgaiQAC0oBAn8jAEEQayICJAACQCABKAK4ARCTASIDDQAgAUEMEGcLIAAoAgghACACQQhqIAFBgwEgAxDUASAAIAIpAwg3AyAgAkEQaiQAC1kBA38jAEEQayICJAAgARDFAiEDAkAgASgCuAEgAxCUASIEDQAgASADQQN0QRBqEGcLIAAoAgghAyACQQhqIAFBgwEgBBDUASADIAIpAwg3AyAgAkEQaiQAC1YBA38jAEEQayICJAAgARDFAiEDAkAgASgCuAEgAxCVASIEDQAgASADQQxqEGcLIAAoAgghAyACQQhqIAFBgwEgBBDUASADIAIpAwg3AyAgAkEQaiQAC0kBA38jAEEQayICJAAgAkEIaiABEMQCAkAgAUEBEM0CIgNFDQAgAS8BNCEEIAIgAikDCDcDACABIAMgBCACEKoBCyACQRBqJAALZwECfyMAQTBrIgIkACACQShqIAEQxAIgARDFAiEDIAJBIGogARDEAiACIAIpAyA3AxAgAiACKQMoNwMIAkAgASACQRBqIAMgAkEIahCtAUUNACACQRhqIAFBhQEQiQELIAJBMGokAAuJAQEEfyMAQSBrIgIkACABEMYCIQMgARDFAiEEIAJBGGogARDEAiACIAIpAxg3AwgCQAJAIAEgAkEIahDaASIFRQ0AIAUoAgBBgICA+ABxQYCAgBhHDQAgASAFIAQgAxCuAUUNASACQRBqIAFBigEQiQEMAQsgAkEQaiABQYsBEIkBCyACQSBqJAALXwECfyMAQRBrIgMkAAJAAkAgAigCNCIEIAIoAIgBQSRqKAIAQQR2SQ0AIANBCGogAkHyABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYaAwP8HNgIECyADQRBqJAALQQECfyACQRhqIgMgAhDGAjYCACACIAIQxgIiBDYCEAJAIAMoAgAiAg0AIABBACkDkDg3AwAPCyAAIAQgAm8Q0gELDAAgACACEMYCENIBC2QBAn8jAEEQayIDJAAgAigCNCEEIAMgAigCiAE2AgQCQAJAIANBBGogBBDdAQ0AIANBCGogAkHwABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAAXIiBBDdAQ0AIANBCGogAkHwABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAAnIiBBDdAQ0AIANBCGogAkHwABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALawECfyMAQRBrIgMkACACKAI0IQQgAyACKAKIATYCBAJAAkAgA0EEaiAEQYCAA3IiBBDdAQ0AIANBCGogAkHwABCJASAAQQApA6g4NwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALSQECfyMAQRBrIgIkACABIAJBDGoQygIhAwJAIAEvAQgNACAAKAIIIQAgAiABIAMgAigCDBDFASAAIAIpAwA3AyALIAJBEGokAAs+AQF/AkAgAS0AMiICDQAgACABQewAEIkBDwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akE4aikDADcDAAtoAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQ1QEhACABQRBqJAAgAAtoAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQiQEMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQ1QEhACABQRBqJAAgAAuCAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYaAwP8HRw0AIAEoAgghAAwBCyABIABBiAEQiQFBACEACyABQRBqJAAgAAtqAgJ/AXwjAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABCJAQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARDWASEDIAFBEGokACADC5UBAQJ/IwBBIGsiAiQAAkACQCABLQAyIgMNACACQRhqIAFB7AAQiQEMAQsgASADQX9qIgM6ADIgAiABIANB/wFxQQN0akE4aikDADcDGAsgAiACKQMYNwMIAkACQCABIAJBCGoQ2AENACACQRBqIAFB/QAQiQEgAEEAKQPAODcDAAwBCyAAIAIpAxg3AwALIAJBIGokAAuvAQECfyMAQTBrIgIkAAJAAkAgAC0AMiIDDQAgAkEoaiAAQewAEIkBDAELIAAgA0F/aiIDOgAyIAIgACADQf8BcUEDdGpBOGopAwA3AygLIAIgAikDKDcDEAJAAkAgACACQRBqENgBDQAgAkEgaiAAQf0AEIkBIAJBACkDwDg3AxgMAQsgAiACKQMoNwMYCyACIAIpAxg3AwggACACQQhqIAEQ2QEhACACQTBqJAAgAAuCAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYSAwP8HRg0AIAEgAEH/ABCJAUEAIQAMAQsgASgCCCEACyABQRBqJAAgAAuCAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEIkBDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYWAwP8HRg0AIAEgAEH+ABCJAUEAIQAMAQsgASgCCCEACyABQRBqJAAgAAuQAgEEfyMAQRBrIgIkAAJAAkAgAC0AMiIDDQAgAkEIaiAAQewAEIkBDAELIAAgA0F/aiIDOgAyIAIgACADQf8BcUEDdGpBOGopAwA3AwgLAkACQAJAIAIoAgxBg4HA/wdGDQAgAiAAQYABEIkBDAELAkACQCACKAIIIgMNAEEAIQQMAQsgAy0AA0EPcSEEC0EIIQUCQAJAAkACQCAEQX1qDgQCBQMAAQtBACEDIAFFDQQgAiAAQYABEIkBDAQLQbMjQeQAQdoTEJwDAAtBBCEFCyADIAVqIgQoAgAiAw0BIAFFDQEgBCAAKAK4ARCTASIDNgIAIAMNASACIABBgwEQiQELQQAhAwsgAkEQaiQAIAMLgAQBBX8CQCAEQfb/A08NACAAENICQQAhBUEAQQE6AOCiAUEAIAEpAAA3AOGiAUEAIAFBBWoiBikAADcA5qIBQQAgBEEIdCAEQYD+A3FBCHZyOwHuogFBAEEJOgDgogFB4KIBENMCAkAgBEUNAANAAkAgBCAFayIAQRAgAEEQSRsiB0UNACADIAVqIQhBACEAA0AgAEHgogFqIgkgCS0AACAIIABqLQAAczoAACAAQQFqIgAgB0cNAAsLQeCiARDTAiAFQRBqIgUgBEkNAAsLQQAhACACQQAoAuCiATYAAEEAQQE6AOCiAUEAIAEpAAA3AOGiAUEAIAYpAAA3AOaiAUEAQQA7Ae6iAUHgogEQ0wIDQCACIABqIgkgCS0AACAAQeCiAWotAABzOgAAIABBAWoiAEEERw0ACwJAIARFDQBBASEFQQAhAiABQQVqIQYDQEEAIQBBAEEBOgDgogFBACABKQAANwDhogFBACAGKQAANwDmogFBACAFQQh0IAVBgP4DcUEIdnI7Ae6iAUHgogEQ0wICQCAEIAJrIglBECAJQRBJGyIHRQ0AIAMgAmohCANAIAggAGoiCSAJLQAAIABB4KIBai0AAHM6AAAgAEEBaiIAIAdHDQALCyAFQQFqIQUgAkEQaiICIARJDQALCxDUAg8LQZgjQTJB2QoQnAMAC40FAQZ/QX8hBQJAIARB9f8DSw0AIAAQ0gICQAJAIARFDQBBASEGQQAhByABQQVqIQgDQEEAIQBBAEEBOgDgogFBACABKQAANwDhogFBACAIKQAANwDmogFBACAGQQh0IAZBgP4DcUEIdnI7Ae6iAUHgogEQ0wICQCAEIAdrIgVBECAFQRBJGyIJRQ0AIAMgB2ohCgNAIAogAGoiBSAFLQAAIABB4KIBai0AAHM6AAAgAEEBaiIAIAlHDQALCyAGQQFqIQYgB0EQaiIHIARJDQALQQAhBkEAQQE6AOCiAUEAIAEpAAA3AOGiAUEAIAFBBWopAAA3AOaiAUEAQQk6AOCiAUEAIARBCHQgBEGA/gNxQQh2cjsB7qIBQeCiARDTAiAERQ0BA0ACQCAEIAZrIgBBECAAQRBJGyIJRQ0AIAMgBmohCkEAIQADQCAAQeCiAWoiBSAFLQAAIAogAGotAABzOgAAIABBAWoiACAJRw0ACwtB4KIBENMCIAZBEGoiBiAESQ0ADAILAAtBAEEBOgDgogFBACABKQAANwDhogFBACABQQVqKQAANwDmogFBAEEJOgDgogFBACAEQQh0IARBgP4DcUEIdnI7Ae6iAUHgogEQ0wILQQAhAANAIAIgAGoiBSAFLQAAIABB4KIBai0AAHM6AAAgAEEBaiIAQQRHDQALQQAhAEEAQQE6AOCiAUEAIAEpAAA3AOGiAUEAIAFBBWopAAA3AOaiAUEAQQA7Ae6iAUHgogEQ0wIDQCACIABqIgUgBS0AACAAQeCiAWotAABzOgAAIABBAWoiAEEERw0ACxDUAkEAIQBBACEFA0AgBSACIABqLQAAaiEFIABBAWoiAEEERw0ACwsgBQufAwEJf0EAIQIDQCAAIAJBAnQiA2ogASADai0AADoAACAAIANBAXIiBGogASAEai0AADoAACAAIANBAnIiBGogASAEai0AADoAACAAIANBA3IiA2ogASADai0AADoAAEEIIQQgAkEBaiICQQhHDQALA0AgBEECdCIBIABqIgNBf2otAAAhBSADQX5qLQAAIQYgA0F9ai0AACECIANBfGotAAAhBwJAAkAgBEEHcSIIRQ0AIAUhCSAGIQUgByEKDAELIARBA3ZBsDxqLQAAIAJBsDpqLQAAcyEKIAdBsDpqLQAAIQkgBUGwOmotAAAhBSAGQbA6ai0AACECCwJAIAhBBEcNACAJQf8BcUGwOmotAAAhCSAFQf8BcUGwOmotAAAhBSACQf8BcUGwOmotAAAhAiAKQf8BcUGwOmotAAAhCgsgAyADQWBqLQAAIApzOgAAIAAgAUEBcmogA0Fhai0AACACczoAACAAIAFBAnJqIANBYmotAAAgBXM6AAAgACABQQNyaiADQWNqLQAAIAlzOgAAIARBAWoiBEE8Rw0ACwujBQEKf0EAIQIDQCACQQJ0IQNBACEEA0AgASADaiAEaiIFIAUtAAAgACAEIANqai0AAHM6AAAgBEEBaiIEQQRHDQALIAJBAWoiAkEERw0AC0EBIQYDQEEAIQUDQEEAIQQDQCABIARBAnRqIAVqIgMgAy0AAEGwOmotAAA6AAAgBEEBaiIEQQRHDQALIAVBAWoiBUEERw0ACyABLQABIQQgASABLQAFOgABIAEtAAkhAyABIAEtAA06AAkgASADOgAFIAEgBDoADSABLQACIQQgASABLQAKOgACIAEgBDoACiABLQAGIQQgASABLQAOOgAGIAEgBDoADiABLQADIQQgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASAEOgAHQQAhAgJAIAZBDkcNAANAIAJBAnQiBUHgAWohB0EAIQQDQCABIAVqIARqIgMgAy0AACAAIAcgBGpqLQAAczoAACAEQQFqIgRBBEcNAAsgAkEBaiICQQRHDQALDwsDQCABIAJBAnRqIgQgBC0AAyIDIAQtAAAiB3MiCEEBdCAELQABIgkgB3MiBSAELQACIgpzIgtzIAhBGHRBGHVBB3ZBG3FzOgADIAQgAyAFcyADIApzIghBAXRzIAhBGHRBGHVBB3ZBG3FzOgACIAQgCSAKIAlzIgpBAXRzIAsgA3MiA3MgCkEYdEEYdUEHdkEbcXM6AAEgBCAHIAVBAXRzIAVBGHRBGHVBB3ZBG3FzIANzOgAAIAJBAWoiAkEERw0ACyAGQQR0IQlBACEHA0AgB0ECdCIFIAlqIQJBACEEA0AgASAFaiAEaiIDIAMtAAAgACACIARqai0AAHM6AAAgBEEBaiIEQQRHDQALIAdBAWoiB0EERw0ACyAGQQFqIQYMAAsACwsAQfCiASAAENACCwsAQfCiASAAENECCw8AQfCiAUEAQfABEMEDGgvEAQEDfyMAQRBrIgQkAEEAIQVBACEGA0AgBSADIAZqLQAAaiEFIAZBAWoiBkEgRw0ACwJAIAUNAEH6MkEAEC1B7SNBL0HGCRCcAwALQQAgAykAADcA4KQBQQAgA0EYaikAADcA+KQBQQAgA0EQaikAADcA8KQBQQAgA0EIaikAADcA6KQBQQBBAToAoKUBQYClAUEQEA8gBEGApQFBEBCnAzYCACAAIAEgAkG3DiAEEKYDIgYQPiEFIAYQISAEQRBqJAAgBQujAgEDfyMAQRBrIgIkAAJAAkACQBAiDQBBAC0AoKUBIQMCQAJAIAANACADQf8BcUECRg0BC0F/IQQgAEUNAyADQf8BcUEDRw0DCyABQQRqIgQQICEDAkAgAEUNACADIAAgARC/AxoLQeCkAUGApQEgAyABaiADIAEQzgIgAyAEED0hBCADECEgBA0BQQwhAANAAkAgACIDQYClAWoiAC0AACIEQf8BRg0AIANBgKUBaiAEQQFqOgAAQQAhBAwEC0EAIQQgAEEAOgAAIANBf2ohACADDQAMAwsAC0HtI0GmAUGXHBCcAwALIAJB9RE2AgBBxxAgAhAtQQAtAKClAUH/AUYNAEEAQf8BOgCgpQFBA0H1EUEJENoCEEMLIAJBEGokACAEC7oGAgF/AX4jAEGQAWsiAyQAAkAQIg0AAkACQAJAAkAgAEF+ag4DAQIAAwsCQAJAAkBBAC0AoKUBQX9qDgMAAQIFCyADIAI2AkBBtTAgA0HAAGoQLQJAIAJBF0sNACADQe4TNgIAQccQIAMQLUEALQCgpQFB/wFGDQVBAEH/AToAoKUBQQNB7hNBCxDaAhBDDAULIANB+ABqQRBqIAFBEGopAAA3AwAgA0H4AGpBCGogAUEIaikAADcDACADIAEpAAAiBDcDeAJAIASnQcrRkPd8Rg0AIANBzSA2AjBBxxAgA0EwahAtQQAtAKClAUH/AUYNBUEAQf8BOgCgpQFBA0HNIEEJENoCEEMMBQsCQCADKAJ8QQJGDQAgA0G5FDYCIEHHECADQSBqEC1BAC0AoKUBQf8BRg0FQQBB/wE6AKClAUEDQbkUQQsQ2gIQQwwFC0EAQQBB4KQBQSBBgKUBQRAgA0GAAWpBEEHgpAEQwAFBAEIANwCApQFBAEIANwCQpQFBAEIANwCIpQFBAEIANwCYpQFBAEECOgCgpQFBAEEBOgCApQFBAEECOgCQpQECQEEAQSAQ1gJFDQAgA0GeFjYCEEHHECADQRBqEC1BAC0AoKUBQf8BRg0FQQBB/wE6AKClAUEDQZ4WQQ8Q2gIQQwwFC0GOFkEAEC0MBAsgAyACNgJwQdQwIANB8ABqEC0CQCACQSNLDQAgA0G5CjYCUEHHECADQdAAahAtQQAtAKClAUH/AUYNBEEAQf8BOgCgpQFBA0G5CkEOENoCEEMMBAsgASACENgCDQMCQAJAIAEtAAANAEEAIQADQCAAQQFqIgBBIEYNAiABIABqLQAARQ0ACwsgA0GsKzYCYEHHECADQeAAahAtQQAtAKClAUH/AUYNBEEAQf8BOgCgpQFBA0GsK0EKENoCEEMMBAtBAEEDOgCgpQFBAUEAQQAQ2gIMAwsgASACENgCDQJBBCABIAJBfGoQ2gIMAgsCQEEALQCgpQFB/wFGDQBBAEEEOgCgpQELQQIgASACENoCDAELQQBB/wE6AKClARBDQQMgASACENoCCyADQZABaiQADwtB7SNBuwFBgQsQnAMAC/cBAQN/IwBBIGsiAiQAAkACQAJAAkAgAUEHSw0AQaQXIQEgAkGkFzYCAEHHECACEC1BAC0AoKUBQf8BRw0BDAILQQwhA0HgpAFBkKUBIAAgAUF8aiIBaiAAIAEQzwIhBAJAA0ACQCADIgFBkKUBaiIDLQAAIgBB/wFGDQAgAUGQpQFqIABBAWo6AAAMAgsgA0EAOgAAIAFBf2ohAyABDQALCwJAIAQNAEEAIQEMAwtB/xEhASACQf8RNgIQQccQIAJBEGoQLUEALQCgpQFB/wFGDQELQQBB/wE6AKClAUEDIAFBCRDaAhBDC0F/IQELIAJBIGokACABCzQBAX8CQBAiDQACQEEALQCgpQEiAEEERg0AIABB/wFGDQAQQwsPC0HtI0HVAUHUGhCcAwAL2wYBA38jAEGAAWsiAyQAQQAoAqSlASEEAkACQAJAAkACQCAAQX9qDgQAAgMBBAsgBEEAKAKQngEiAEGAgIAIajYCKCAEIABBgICAEGo2AhwgBC8BBkEBRg0DIANBtio2AgQgA0EBNgIAQY0xIAMQLSAEQQE7AQYgBEEDIARBBmpBAhCvAwwDCyAEQQAoApCeASIAQYCAgAhqNgIoIAQgAEGAgIAQajYCHAJAIAJBBEkNAAJAIAEtAAIiAA0AIAEvAAAhACABIAJqQQA6AAAgAUEEaiEFAkACQAJAAkACQAJAAkACQCAAQf1+ag4UAAcHBwcHBwcHBwcHBwECDAMEBQYHCyABQQhqIgQQ4wMhACADIAEoAAQiBTYCNCADIAQ2AjAgAyABIAQgAGpBAWoiAGsgAmoiAkEDdiIBNgI4QecJIANBMGoQLSAEIAUgASAAIAJBeHEQrAMiABB3IAAQIQwLCwJAIAUtAABFDQAgBCgCWA0AIARBgAgQ/QI2AlgLIAQgBS0AAEEARzoAECAEQQAoApCeAUGAgIAIajYCFAwKC0GRARDbAgwJC0EkECAiBEGTATsAACAEQQRqEG4aAkBBACgCpKUBIgAvAQZBAUcNACAEQSQQ1gINAAJAIAAoAgwiAkUNACAAQQAoAtClASACajYCJAsgBC0AAg0AIAMgBC8AADYCQEHpCCADQcAAahAtQYwBEB0LIAQQIQwICwJAIAUoAgAQbA0AQZQBENsCDAgLQf8BENsCDAcLAkAgBSACQXxqEG0NAEGVARDbAgwHC0H/ARDbAgwGCwJAQQBBABBtDQBBlgEQ2wIMBgtB/wEQ2wIMBQsgAyAANgIgQa8JIANBIGoQLQwECyAAQQxqIgQgAksNACABIAQQrAMiBBC1AxogBBAhDAMLIAMgAjYCEEGKICADQRBqEC0MAgsgBEEAOgAQIAQvAQZBAkYNASADQbMqNgJUIANBAjYCUEGNMSADQdAAahAtIARBAjsBBiAEQQMgBEEGakECEK8DDAELIAMgASACEKoDNgJwQcQOIANB8ABqEC0gBC8BBkECRg0AIANBsyo2AmQgA0ECNgJgQY0xIANB4ABqEC0gBEECOwEGIARBAyAEQQZqQQIQrwMLIANBgAFqJAALgAEBA38jAEEQayIBJABBBBAgIgJBADoAASACIAA6AAACQEEAKAKkpQEiAC8BBkEBRw0AIAJBBBDWAg0AAkAgACgCDCIDRQ0AIABBACgC0KUBIANqNgIkCyACLQACDQAgASACLwAANgIAQekIIAEQLUGMARAdCyACECEgAUEQaiQAC+cCAQR/IwBBEGsiASQAAkACQCAAKAIMRQ0AQQAoAtClASAAKAIka0EATg0BCwJAIABBFGpBgICACBCeA0UNACAAQQA6ABALAkAgACgCWEUNACAAKAJYEPsCIgJFDQADQAJAIAAtABBFDQBBACgCpKUBIgMvAQZBAUcNAiACIAItAAJBDGoQ1gINAgJAIAMoAgwiBEUNACADQQAoAtClASAEajYCJAsgAi0AAg0AIAEgAi8AADYCAEHpCCABEC1BjAEQHQsgACgCWBD8AiAAKAJYEPsCIgINAAsLAkAgAEEoakGAgIACEJ4DRQ0AQZIBENsCCwJAIABBGGpBgIAgEJ4DRQ0AQZsEIQICQBDdAkUNACAALwEGQQJ0QcA8aigCACECCyACEB4LAkAgAEEcakGAgCAQngNFDQAgABDeAgsCQCAAQSBqIAAoAggQnQNFDQAQWxoLIAFBEGokAA8LQbAMQQAQLRAzAAsEAEEBC5ACAQR/IwBBMGsiASQAIABBBmohAgJAAkACQCAALwEGQX5qDgMCAAEACyABQeYpNgIkIAFBBDYCIEGNMSABQSBqEC0gAEEEOwEGIABBAyACQQIQrwMLENkCCwJAIAAoAixFDQAQ3QJFDQAgACgCLCEDIAAvAVQhBCABIAAoAjA2AhggASAENgIUIAEgAzYCEEHfDiABQRBqEC0gACgCLCAALwFUIAAoAjAgAEE0ahDVAg0AAkAgAi8BAEEDRg0AIAFB6Sk2AgQgAUEDNgIAQY0xIAEQLSAAQQM7AQYgAEEDIAJBAhCvAwsgAEEAKAKQngEiAkGAgIAIajYCKCAAIAJBgICAEGo2AhwLIAFBMGokAAvlAgECfyMAQRBrIgIkAAJAAkACQAJAAkACQAJAAkAgAS8BDiIDQf9+ag4GAgMGBgYBAAsgA0GAXWoOAgMEBQsgACABQRBqIAEtAAxBARDgAgwFCyAAEN4CDAQLAkACQCAALwEGQX5qDgMFAAEACyACQeYpNgIEIAJBBDYCAEGNMSACEC0gAEEEOwEGIABBAyAAQQZqQQIQrwMLENkCDAMLIAEgACgCLBCBAxoMAgsCQCAAKAIwIgANACABQQAQgQMaDAILIAEgAEEAQQYgAEG/L0EGENUDG2oQgQMaDAELIAAgAUHUPBCEA0F+cUGAAUcNAAJAIAAoAghB5wdLDQAgAEHoBzYCCAsCQCAAKAIIQYG4mSlJDQAgAEGAuJkpNgIICyAAKAIMIgFFDQACQCABIAAoAghBA2wiA08NACAAIAM2AgwLIAAoAgwiAUUNACAAQQAoAtClASABajYCJAsgAkEQaiQAC5gEAQd/IwBBMGsiBCQAAkACQCACDQBBwxdBABAtIAAoAiwQISAAKAIwECEgAEIANwIsIABB0AA7AVQgAEE0akIANwIAIABBPGpCADcCACAAQcQAakIANwIAIABBzABqQgA3AgACQCADRQ0AQd8RQQAQuAEaCyAAEN4CDAELAkACQCACQQFqECAgASACEL8DIgUQ4wNBxgBJDQAgBUHGL0EFENUDDQAgBUEFaiIGQcAAEOADIQcgBkE6EOADIQggB0E6EOADIQkgB0EvEOADIQogB0UNACAKRQ0AAkAgCUUNACAHIAlPDQEgCSAKTw0BCwJAQQAgCCAIIAdLGyIIRQ0AIAZB0ipBBRDVAw0BIAhBAWohBgsgByAGa0HAAEcNACAHQQA6AAAgBEEQaiAGEKADQSBHDQACQAJAIAkNAEHQACEGDAELIAlBADoAACAJQQFqEKIDIgZBgIB8akGCgHxJDQELIApBADoAACAHQQFqEKkDIQcgCkEvOgAAIAoQqQMhCSAAEOECIAAgBjsBVCAAIAk2AjAgACAHNgIsIAAgBCkDEDcCNCAAQTxqIAQpAxg3AgAgAEHEAGogBEEgaikDADcCACAAQcwAaiAEQShqKQMANwIAAkAgA0UNAEHfESAFIAEgAhC/AxC4ARoLIAAQ3gIMAQsgBCABNgIAQeAQIAQQLUEAECFBABAhCyAFECELIARBMGokAAtJACAAKAIsECEgACgCMBAhIABCADcCLCAAQdAAOwFUIABBNGpCADcCACAAQTxqQgA3AgAgAEHEAGpCADcCACAAQcwAakIANwIAC0kBAn9B4DwQiQMhAEHwPBBaIABBiCc2AgggAEECOwEGAkBB3xEQtwEiAUUNACAAIAEgARDjA0EAEOACIAEQIQtBACAANgKkpQELtAEBBH8jAEEQayIDJAAgABDjAyIEIAFBA3QiBWpBBWoiBhAgIgFBgAE7AAAgBCABQQRqIAAgBBC/A2pBAWogAiAFEL8DGkF/IQACQEEAKAKkpQEiBC8BBkEBRw0AQX4hACABIAYQ1gINAAJAIAQoAgwiAEUNACAEQQAoAtClASAAajYCJAtBACEAIAEtAAINACADIAEvAAA2AgBB6QggAxAtQYwBEB0LIAEQISADQRBqJAAgAAuaAQEDfyMAQRBrIgIkACABQQRqIgMQICIEQYEBOwAAIARBBGogACABEL8DGkF/IQECQEEAKAKkpQEiAC8BBkEBRw0AQX4hASAEIAMQ1gINAAJAIAAoAgwiAUUNACAAQQAoAtClASABajYCJAtBACEBIAQtAAINACACIAQvAAA2AgBB6QggAhAtQYwBEB0LIAQQISACQRBqJAAgAQsPAEEAKAKkpQEvAQZBAUYLwwEBA38jAEEQayIEJABBfyEFAkBBACgCpKUBLwEGQQFHDQAgAkEDdCIFQQxqIgYQICICIAE2AgggAiAANgIEIAJBgwE7AAAgAkEMaiADIAUQvwMaQX8hBQJAQQAoAqSlASIALwEGQQFHDQBBfiEFIAIgBhDWAg0AAkAgACgCDCIFRQ0AIABBACgC0KUBIAVqNgIkC0EAIQUgAi0AAg0AIAQgAi8AADYCAEHpCCAEEC1BjAEQHQsgAhAhCyAEQRBqJAAgBQsCAAumAQECfyMAQRBrIgIkAAJAAkACQAJAAkACQAJAIAEvAQ4iA0GAXWoOBwEDBQUDAgQACwJAAkACQCADQf9+ag4CAQIACyADDQYQjQMMBwtB/AAQHQwGCxAzAAsgARCTAxCBAxoMBAsgARCSAxCBAxoMAwsgARAbEIADGgwCCyACEDQ3AwhBACABLwEOIAJBCGpBCBC4AxoMAQsgARCCAxoLIAJBEGokAAsKAEGgwAAQiQMaC+4BAQJ/AkAQIg0AAkACQAJAQQAoAqilASIDIABHDQBBqKUBIQMMAQsDQCADIgRFDQIgBCgCCCIDIABHDQALIARBCGohAwsgAyAAKAIINgIACyAAIAI2AgQgACABNgIAIABBADsBDANAEJYDIgJB/wNxIgRFDQBBACgCqKUBIgNFIQECQCADRQ0AIAQgAy8BDEEHdkYNAANAIAMoAggiA0UhASADRQ0BIAQgAy8BDEEHdkcNAAsLIAFFDQALIAAgAkEHdDsBDCAAQQAoAqilATYCCEEAIAA2AqilASACQf8DcQ8LQY0mQSdBiBUQnAMAC/MBAQR/AkAgAC0ADUE+Rw0AIAAtAANBAXFFDQAgACkCBBCVA1INAEEAKAKopQEiAUUNACAALwEOIQIDQAJAIAEvAQwiAyACcyIEQf//A3FB/wBLDQAgBEEfcQ0CIAEgA0EBakEfcSADQeD/A3FyOwEMIAEgACABIAJBBHZBBHFqKAIAEQEAIAJBIHFFDQIgAUEAIAEoAgQRAQACQAJAAkBBACgCqKUBIgAgAUcNAEGopQEhAAwBCwNAIAAiAkUNAiACKAIIIgAgAUcNAAsgAkEIaiEACyAAIAEoAgg2AgALIAFBADsBDA8LIAEoAggiAQ0ACwsLUQECfwJAAkACQEEAKAKopQEiASAARw0AQailASEBDAELA0AgASICRQ0CIAIoAggiASAARw0ACyACQQhqIQELIAEgACgCCDYCAAsgAEEAOwEMCzEBAX9BACEBAkAgAEEOcUEIRg0AIABBDHFBDEYNACAAQQR2QQggAEEDcXRNIQELIAEL+QMCAX8BfiABQQ9xIQMCQCABQRBJDQAgAUEQdEGAgMD/A2pBgIDA/wdxrUIghr8gAqIhAgsCQAJAAkACQAJAAkAgA0F+ag4KAAEFBQUCBQUDBAULQQAhAQJAIAJEAAAAAAAAAABjDQBBfyEBIAJEAADg////70FkDQACQCACRAAAAAAAAOA/oCICRAAAAAAAAPBBYyACRAAAAAAAAAAAZnFFDQAgACACqzYAAA8LQQAhAQsgACABNgAADwtCACEEAkAgAkQAAAAAAAAAAGMNACACRAAAAAAAAPBDZA0AAkAgAkQAAAAAAADgP6AiAkQAAAAAAADwQ2MgAkQAAAAAAAAAAGZxRQ0AIAAgArE3AAAPC0IAIQQLIAAgBDcAAA8LAkBEAAAAAAAA4EMgAkQAAAAAAADgP6AgAkQAAAAAAADgQ2QgAkQAAAAAAADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgACADIAKqEO8CDwtBgICAgHghAQsgACADIAEQ7wIL9wEAAkAgAUEISQ0AIAAgASACtxDuAg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQZshQa4BQe8qEJwDAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALswMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDwArchAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLQYCAgIB4IQEgA0QAAAAAAADgwWMNAkH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQZshQcoBQYMrEJwDAAtBgICAgHghAQsgAQudAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPACtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAwvUAQICfwF+QX4hAgJAAkAgAS0ADEEMSQ0AIAEpAhAiBFANACABQRhqLwEAIQMQIg0BAkAgAC0ABkUNAAJAAkACQEEAKAKspQEiAiAARw0AQaylASEBDAELA0AgAiIBRQ0CIAEoAgAiAiAARw0ACwsgASAAKAIANgIACyAAQQBBiAIQwQMaCyAAQQE7AQYgAEEPakEDOgAAIABBEGogBDcCACAAIANBB3Q7AQRBACECIABBACgCrKUBNgIAQQAgADYCrKUBCyACDwtB8iVBK0H6FBCcAwAL0QECAn8BfkF+IQICQAJAIAEtAAxBAkkNACABKQIEIgRQDQAgAS8BECEDECINAQJAIAAtAAZFDQACQAJAAkBBACgCrKUBIgIgAEcNAEGspQEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEMEDGgsgAEEBOwEGIABBD2pBAzoAACAAQRBqIAQ3AgAgACADQQd0OwEEQQAhAiAAQQAoAqylATYCAEEAIAA2AqylAQsgAg8LQfIlQStB+hQQnAMAC70CAQN/AkACQAJAIAAtAA1BP0cNACAALQADQQFxDQAQIg0BQQAoAqylASIBRQ0AA0ACQCABLQAHRQ0AIAAvAQ4gAS8BDEcNACABQRBqKQIAIAApAgRSDQAgAUEAOgAHIAFBDGoiAhCaAwJAAkAgAS0ABkGAf2oOAwECAAILAkACQAJAQQAoAqylASIDIAFHDQBBrKUBIQIMAQsDQCADIgJFDQIgAigCACIDIAFHDQALCyACIAEoAgA2AgALIAFBAEGIAhDBAxoMAQsgAUEBOgAGAkAgAUEAQQBBIBD1Ag0AIAFBggE6AAYgAS0ABw0FIAIQmAMgAUEBOgAHIAFBACgCkJ4BNgIIDAELIAFBgAE6AAYLIAEoAgAiAQ0ACwsPC0HyJUHJAEGADRCcAwALQdkrQfIlQfEAQfUWEKEDAAvcAQECf0F/IQRBACEFAkACQAJAIAAtAAZBf2oOCAEAAAAAAAACAAtBfiEEDAELQQEhBCAALQAHDQACQCACIABBDmotAABqQQRqQe0BTw0AQQAhBEEBIQUMAQsgAEEMahCYA0EBIQQgAEEBOgAHQQAhBSAAQQAoApCeATYCCAsCQAJAIAVFDQAgAEEMakE+IAAvAQQgA3IgAhCbAyIERQ0BIAQgASACEL8DGiAAIAAvAQQiBEEBakEfcSAEQeD/A3FyOwEEQQAhBAsgBA8LQZ4pQfIlQYwBQdcIEKEDAAvPAQEDfwJAECINAAJAQQAoAqylASIARQ0AA0ACQCAALQAHIgFFDQBBACgCkJ4BIgIgACgCCGtBAEgNAAJAIAFBBEsNACAAQQxqELYDIQFBACgCkJ4BIQICQCABDQAgACAALQAHIgFBAWo6AAcgAEGAICABdCACajYCCAwCCyAAIAJBgIAEajYCCAwBCwJAIAFBBUcNACAAIAFBAWo6AAcgACACQYCAAmo2AggMAQsgAEEIOgAGCyAAKAIAIgANAAsLDwtB8iVB2gBByw0QnAMAC2sBAX9BfyECAkACQAJAIAAtAAZBf2oOCAEAAAAAAAACAAtBfg8LQQEhAiAALQAHDQBBACECIAEgAEEOai0AAGpBBGpB7QFJDQAgAEEMahCYA0EBIQIgAEEBOgAHIABBACgCkJ4BNgIICyACCw0AIAAgASACQQAQ9QIL/gEBAn9BACEBAkACQAJAAkACQAJAAkAgAC0ABiICDgkFAgMDAwMDAwEACyACQYB/ag4DAQIDAgsCQAJAAkBBACgCrKUBIgIgAEcNAEGspQEhAQwBCwNAIAIiAUUNAiABKAIAIgIgAEcNAAsLIAEgACgCADYCAAsgAEEAQYgCEMEDGkEADwsgAEEBOgAGAkAgAEEAQQBBIBD1AiIBDQAgAEGCAToABiAALQAHDQQgAEEMahCYAyAAQQE6AAcgAEEAKAKQngE2AghBAQ8LIABBgAE6AAYgAQ8LQfIlQbwBQeIaEJwDAAtBASEBCyABDwtB2StB8iVB8QBB9RYQoQMAC48CAQR/AkACQAJAAkAgAS0AAkUNABAjIAEtAAJBD2pB/ANxIgIgAC8BAiIDaiEEAkACQAJAAkAgAC8BACIFIANLDQAgBCAALwEETQ0CIAIgBUkNAUF/IQNBACEEDAMLIAQgBUkNAUF+IQNBACEEDAILIAAgAzsBBiACIQQLIAAgBDsBAkEAIQNBASEECwJAIARFDQAgACAALwECaiACa0EIaiABIAIQvwMaCyAALwEAIAAvAQQiAUsNASAALwECIAFLDQIgAC8BBiABSw0DECQgAw8LQdclQR1ByxYQnAMAC0HhGUHXJUE2QcsWEKEDAAtB9RlB1yVBN0HLFhChAwALQYgaQdclQThByxYQoQMACzkBAn9BACEBAkAgAC8BACICIAAvAQJGDQACQCACIAAvAQZJDQAgAEEIag8LIAAgAmpBCGohAQsgAQusAQEDfxAjQQAhAQJAIAAvAQAiAiAALwECRg0AAkAgAiAALwEGSQ0AIABBCGohAQwBCyAAIAJqQQhqIQELAkACQCABRQ0AIAEtAAJBD2pB/ANxIQECQCACIAAvAQYiA0kNACACIANHDQIgACABOwEAIAAgAC8BBDsBBhAkDwsgACACIAFqOwEAECQPC0GSKUHXJUHMAEH8CxChAwALQdcYQdclQc8AQfwLEKEDAAsiAQF/IABBCGoQICIBIAA7AQQgASAAOwEGIAFBADYBACABCzMBAX8jAEEQayICJAAgAiABOgAPIAAtAA0gAC8BDiACQQ9qQQEQuAMhACACQRBqJAAgAAszAQF/IwBBEGsiAiQAIAIgATsBDiAALQANIAAvAQ4gAkEOakECELgDIQAgAkEQaiQAIAALMwEBfyMAQRBrIgIkACACIAE2AgwgAC0ADSAALwEOIAJBDGpBBBC4AyEAIAJBEGokACAACzsAAkACQCABRQ0AIAEtAAANAQsgAC0ADSAALwEOQaQzQQAQuAMPCyAALQANIAAvAQ4gASABEOMDELgDC04BAn8jAEEQayIBJABBACECAkAgAC0AA0EEcQ0AIAEgAC8BDjsBCCABIAAvAQA7AQogAC0ADUEDIAFBCGpBBBC4AyECCyABQRBqJAAgAgsZACAAIAAtAAxBBGo6AAIgABCYAyAAELYDCxoAAkAgACABIAIQhQMiAA0AIAEQggMaCyAAC+gFARB/IwBBEGsiAyQAQQAhBAJAAkAgAS8BDiIFQQx2IgZBf2pBAUsNAAJAIAZBAkcNACABLQAMRQ0BCyAFQf8fcSIHQf8dSw0AAkAgBkECRw0AIAVBgB5xQYACRg0BCyACLwEAIgVB8R9GDQBBACAHayEIIAFBEGohCUEAIQpBACELQQAhDANAAkACQCAFQf//A3EiBUEMdiINQQlGDQAgDUGwwABqLQAAIQQMAQsgAiAMQQFqIgxBAXRqLwEAIQQLIARFDQICQCAFQYDAA3FBgIACRg0AIAtB/wFxIQ5BACELIAogDkEAR2pBAyAEQX9qIARBA0sbIgpqIApBf3NxIQoLAkACQCAFQf8fcSAHRyIPDQAgACAKaiEQAkAgBkEBRw0AAkAgDUEIRw0AIAMgEC0AACALQf8BcXZBAXE6AA8gAS0ADSABLwEOIANBD2pBARC4AxogCCERDAMLIBAhDSAEIQ4CQCAFQYDAAkkNAANAQQAhESAOIgVFDQQgBUF/aiEOIA0tAAAhEiANQQFqIQ0gEkUNAAsgBUUNAwsgAS0ADSABLwEOIBAgBBC4AxogCCERDAILAkAgDUEIRw0AQQEgC0H/AXF0IQQgEC0AACEFAkAgAS0AEEUNACAQIAUgBHI6AAAgByERDAMLIBAgBSAEQX9zcToAACAHIREMAgsCQCAEIAEtAAwiDUsNACAQIAkgBBC/AxogByERDAILIBAgCSANEL8DIQ5BACENAkAgBUH/nwFLDQAgBUGAIHENACABLQAMIAFqQQ9qLAAAQQd1IQ0LIA4gAS0ADCIFaiANIAQgBWsQwQMaIAchEQwBCwJAIA1BCEcNAEEAIAtBAWoiBCAEQf8BcUEIRiIEGyELIAogBGohCgwBCyAKIARqIQoLAkAgD0UNAEEAIQQgAiAMQQFqIgxBAXRqLwEAIgVB8R9GDQIMAQsLIBEhBAsgA0EQaiQAIAQPC0H2IUHdAEGeEhCcAwALlwIBBH8gABCHAyAAEPQCIAAQ6wIgABBYAkACQCAALQADQQFxDQAgAC0ADQ0BIAAvAQ4NASAALQAMQQRJDQEgAEERai0AAEEIcUUNAUEAQQAoApCeATYCuKUBQYACEB5BAC0AkJQBEB0PCwJAIAApAgQQlQNSDQAgABCIAyAALQANIgFBAC0AsKUBTw0BQQAoArSlASABQQJ0aigCACIBIAAgASgCACgCDBEBAA8LIAAtAANBBHFFDQBBAC0AsKUBRQ0AIAAoAgQhAkEAIQEDQAJAQQAoArSlASABQQJ0aigCACIDKAIAIgQoAgAgAkcNACAAIAE6AA0gAyAAIAQoAgwRAQALIAFBAWoiAUEALQCwpQFJDQALCwsCAAsCAAtmAQF/AkBBAC0AsKUBQSBJDQBB9iFBrgFB0BwQnAMACyAALwEEECAiASAANgIAIAFBAC0AsKUBIgA6AARBAEH/AToAsaUBQQAgAEEBajoAsKUBQQAoArSlASAAQQJ0aiABNgIAIAELhgIBBH8jAEGAAWsiACQAQQBBADoAsKUBQQAgADYCtKUBQQAQNKciATYCkJ4BAkACQCABQQAoAsSlASICayIDQf//AEsNACADQekHSQ0BQQBBACkDyKUBIAEgAmtBl3hqIgNB6AduIgJBAWqtfDcDyKUBIAMgAkHoB2xrQQFqIQMMAQtBAEEAKQPIpQEgA0HoB24iAq18NwPIpQEgAyACQegHbGshAwtBACABIANrNgLEpQFBAEEAKQPIpQE+AtClARDpAhA2QQBBADoAsaUBQQBBAC0AsKUBQQJ0ECAiAzYCtKUBIAMgAEEALQCwpQFBAnQQvwMaQQAQND4CuKUBIABBgAFqJAALpAEBA39BABA0pyIANgKQngECQAJAIABBACgCxKUBIgFrIgJB//8ASw0AIAJB6QdJDQFBAEEAKQPIpQEgACABa0GXeGoiAkHoB24iAa18QgF8NwPIpQEgAiABQegHbGtBAWohAgwBC0EAQQApA8ilASACQegHbiIBrXw3A8ilASACIAFB6AdsayECC0EAIAAgAms2AsSlAUEAQQApA8ilAT4C0KUBCxMAQQBBAC0AvKUBQQFqOgC8pQELvgEBBn8jACIAIQEQH0EAIQIgAEEALQCwpQEiA0ECdEEPakHwD3FrIgQkAAJAIANFDQBBACgCtKUBIQUDQCAEIAJBAnQiAGogBSAAaigCACgCACgCADYCACACQQFqIgIgA0cNAAsLAkBBAC0AvaUBIgJBD08NAEEAIAJBAWo6AL2lAQsgBEEALQC8pQFBEHRBAC0AvaUBckGAngRqNgIAAkBBAEEAIAQgA0ECdBC4Aw0AQQBBADoAvKUBCyABJAALJQEBf0EBIQECQCAALQADQQVxQQFHDQAgACkCBBCVA1EhAQsgAQvVAQECfwJAQcClAUGgwh4QngNFDQAQjQMLAkACQEEAKAK4pQEiAEUNAEEAKAKQngEgAGtBgICAf2pBAEgNAQtBAEEANgK4pQFBkQIQHgtBACgCtKUBKAIAIgAgACgCACgCCBECAAJAQQAtALGlAUH+AUYNAEEBIQACQEEALQCwpQFBAU0NAANAQQAgADoAsaUBQQAoArSlASAAQQJ0aigCACIBIAEoAgAoAggRAgAgAEEBaiIAQQAtALClAUkNAAsLQQBBADoAsaUBCxCtAxD2AhBWELwDC6cBAQN/QQAQNKciADYCkJ4BAkACQCAAQQAoAsSlASIBayICQf//AEsNACACQekHSQ0BQQBBACkDyKUBIAAgAWtBl3hqIgJB6AduIgFBAWqtfDcDyKUBIAIgAUHoB2xrQQFqIQIMAQtBAEEAKQPIpQEgAkHoB24iAa18NwPIpQEgAiABQegHbGshAgtBACAAIAJrNgLEpQFBAEEAKQPIpQE+AtClARCRAwtnAQF/AkACQANAELMDIgBFDQECQCAALQADQQNxQQNHDQAgACkCBBCVA1INAEE/IAAvAQBBAEEAELgDGhC8AwsDQCAAEIYDIAAQmQMNAAsgABC0AxCPAxA5IAANAAwCCwALEI8DEDkLCwUAQcQzCwUAQbAzCzkBAX9BxbvyiHghAgJAIAFFDQADQCACIAAtAABzQZODgAhsIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAgsEABAyC04BAX8CQEEAKALUpQEiAA0AQQAgAEGTg4AIbEENczYC1KUBC0EAQQAoAtSlASIAQQ10IABzIgBBEXYgAHMiAEEFdCAAcyIANgLUpQEgAAtqAQF/Qf//AyECAkAgAUUNAEH//wMhAgNAIAJB//8DcSICQQh0IAAtAAAgAkEIdnMiAkHwAXFBBHYgAnNB/wFxIgJyIAJBDHRzIAJBBXRzIQIgAEEBaiEAIAFBf2oiAQ0ACwsgAkH//wNxC20BA38gAEECaiEBIAAtAAJBCmohAkH//wMhAwNAIANB//8DcSIDQQh0IAEtAAAgA0EIdnMiA0HwAXFBBHYgA3NB/wFxIgNyIANBDHRzIANBBXRzIQMgAUEBaiEBIAJBf2oiAg0ACyAAIAM7AQAL4QEBB39BACEBAkAgAC0ADCICQQdqQfwDcSIDIAAtAAIiBE8NAAJAIABBDGoiBSACQQRqIgZqLQAAQf8BRw0AIAIgAGpBEWotAAAiAyAETw0BIAYgA08NAQsgACAALQADQf0BcToAAyAAIANqQQxqIgItAAAiBkEEaiIHIANqIARLDQBBACEBA0AgBSACKAIANgIAIAVBBGohBSACQQRqIQIgASAGSSEEIAFBBGohASAEDQALIABBDGoiBSAHakH/AToAACAGIAVqQQVqIAZBB2pB/AFxIANqOgAAQQEhAQsgAQsJACAAQQA6AAILkQEBAn8CQAJAIAFBgAJPDQAgAkGAgARPDQFBACEEAkAgA0EEakHsASAALQACIgVrSw0AIAAgBWpBDGoiBCACOgACIAQgAToAASAEIAM6AAAgBCACQQh2OgADIAAgBSADQQdqQfwBcWo6AAIgBEEEaiEECyAEDwtB0yNBgQFB8BsQnAMAC0HTI0GDAUHwGxCcAwALLAEBfyMAQRBrIgMkACADIAI2AgggAyABNgIEIAMgADYCAEHqDyADEC0QHAALSQEDfwJAIAAoAgAiAkEAKALQpQFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoAtClASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtJAQN/AkAgACgCACICQQAoApCeAWsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgCkJ4BIgRrQX9KDQAgACAEIAFqNgIACyADQR92C2QBA38CQCACRQ0AQQAhAwNAIAAgA0EBdGoiBCABIANqIgUtAABBBHZBxhhqLQAAOgAAIARBAWogBS0AAEEPcUHGGGotAAA6AAAgA0EBaiIDIAJHDQALCyAAIAJBAXRqQQA6AAALnQIBB38gACECAkAgAS0AACIDRQ0AIANFIQRBACEFIAAhAgNAAkACQCADQVBqQf8BcUEJSyIGDQAgA0EYdEEYdUFQaiEHDAELQX8hByADQSByIghBn39qQf8BcUEFSw0AIAhBGHRBGHVBqX9qIQcLAkAgB0F/Rw0AIAEtAAEiA0UhBCABQQFqIQEgAw0BDAILIARBAXENAQJAAkAgBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIDQZ9/akH/AXFBBUsNACADQRh0QRh1Qal/aiEHCyABQQFqIQECQAJAIAUNACAHQQR0QYACciEFDAELIAIgByAFcjoAACACQQFqIQJBACEFCyABLQAAIgNFIQQgAw0ACwsgAiAAawszAQF/IwBBEGsiBCQAIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAEHFDyAEEC0QHAALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEL8DIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDjA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDjA2pBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0g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CyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILAAsCQCADQQRPDQAgACECDAELAkAgA0F8aiIEIABPDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC/cCAQJ/AkAgACABRg0AAkAgASAAIAJqIgNrQQAgAkEBdGtLDQAgACABIAIQvwMPCyABIABzQQNxIQQCQAJAAkAgACABTw0AAkAgBEUNACAAIQMMAwsCQCAAQQNxDQAgACEDDAILIAAhAwNAIAJFDQQgAyABLQAAOgAAIAFBAWohASACQX9qIQIgA0EBaiIDQQNxRQ0CDAALAAsCQCAEDQACQCADQQNxRQ0AA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQAMAwsACyACQQNNDQADQCADIAEoAgA2AgAgAUEEaiEBIANBBGohAyACQXxqIgJBA0sNAAsLIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8gICA38BfgJAIAJFDQAgACABOgAAIAIgAGoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYgAyAFaiEBA0AgASAGNwMYIAEg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fwtrAgF8AX8gAEQAAAAAAADwPyABQQFxGyECAkAgAUEBakEDSQ0AIAEhAwNAIAIgACAAoiIARAAAAAAAAPA/IANBAm0iA0EBcRuiIQIgA0EBakECSw0ACwtEAAAAAAAA8D8gAqMgAiABQQBIGwsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELFQBBgKzBAiQCQfirAUEPakFwcSQBCwcAIwAjAWsLBAAjAgsEACMBCw0AIAEgAiADIAARDQALJAEBfiAAIAEgAq0gA61CIIaEIAQQ8QMhBSAFQiCIpxAUIAWnCxMAIAAgAacgAUIgiKcgAiADEBULC9SQgYAAAwBBgAgLhIwBaHVtaWRpdHkAYWNpZGl0eQAhZnJhbWUtPnBhcmFtc19pc19jb3B5AGRldnNfdmVyaWZ5AGFycmF5AGZsZXgAYWlyUXVhbGl0eUluZGV4AHV2SW5kZXgAamRfb3BpcGVfd3JpdGVfZXgAV1NTSy1IOiBzZW5kIGNvbXByZXNzZWQ6IGNtZD0leAAlLXM6JXgAdmVyaWZpY2F0aW9uIGZhaWx1cmU6ICVkIGF0ICV4AFdTU0stSDogdW5rbm93biBjbWQgJXgAamRfd3Nza19uZXcAcHJldgB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAbmV4dABqZF9zZW5kX2V2ZW50X2V4dABsb2NhbGhvc3QAc3RvcF9saXN0AGF1dGggdG9vIHNob3J0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudABkZXZpY2VzY3JpcHRtZ3JfaW5pdAByZWZsZWN0ZWRMaWdodAB1bnNoaWZ0AGpkX3F1ZXVlX3NoaWZ0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABkZXZzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AGpkX29waXBlX2hhbmRsZV9wYWNrZXQAY2hhckNvZGVBdAB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBkZXZzX2ZpYmVyX2NvcHlfcGFyYW1zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGRldnMta2V5LSUtcwBXU1NLLUg6IGVuY3NvY2sgZXJyb3I6ICUtcwBXU1NLLUg6IGNvbm5lY3RpbmcgdG8gd3M6Ly8lczolZCVzACVzOi8vJXM6JWQlcwAlLXNfJXMAJS1zOiVzAHNlbGYtZGV2aWNlOiAlcy8lcwBXUzogY29ubmVjdGluZyB0byAlcwBhc3NlcnRpb24gJyVzJyBmYWlsZWQgYXQgJXM6JWQgaW4gJXMASkRfUEFOSUMoKSBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBkZXZzX2pkX2dldF9yZWdpc3RlcgBzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcgBkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcgBkZXZzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAGJ1ZmZlcgByb3RhcnlFbmNvZGVyAG51bWJlcgBmcmVlX2ZpYmVyAGpkX3NoYTI1Nl9zZXR1cABwb3AAIXN3ZWVwAGRldnNfdm1fcG9wX2FyZ19tYXAAc21hbGwgaGVsbG8AZGV2c19qZF9zaG91bGRfcnVuAHJlLXJ1bgBidXR0b24AbW90aW9uAGZ1bmN0aW9uAHdpbmREaXJlY3Rpb24AYmFkIHZlcnNpb24AZGV2c192YWx1ZV91bnBpbgBkZXZzX3ZhbHVlX3BpbgBqb2luAHByb2dyYW0gd3JpdHRlbgBqZF9vcGlwZV9vcGVuAGpkX2lwaXBlX29wZW4AYm9vbGVhbgBzY2FuAGZsYXNoX3Byb2dyYW0AbnVsbABqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABkZXZzX2ltZ19zdHJpZHhfb2sAV1NTSzogc2VudCBhdXRoAGNhbid0IHNlbmQgYXV0aABtYXAtPmNhcGFjaXR5IDw9IG1hcC0+bGVuZ3RoAGpkX3F1ZXVlX3B1c2gAamRfdHhfZmx1c2gAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAGRldnNfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAGRldnNfdmFsdWVfdG9fc3RyaW5nAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAdG9TdHJpbmcAIXFfc2VuZGluZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBkZXZzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAMDEyMzQ1Njc4OWFiY2RlZgBxLT5mcm9udCA9PSBxLT5jdXJyX3NpemUAMCA8PSBkaWZmICYmIGRpZmYgKyBsZW4gPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUAYmxvY2tfc2l6ZQBkc3QgLSBidWYgPT0gY3R4LT5hY2Nfc2l6ZQBkc3QgLSBidWYgPD0gY3R4LT5hY2Nfc2l6ZQBxLT5mcm9udCA8PSBxLT5zaXplAHEtPmJhY2sgPD0gcS0+c2l6ZQBxLT5jdXJyX3NpemUgPD0gcS0+c2l6ZQBkZXZzX2xlYXZlAHRydWUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmFsc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAamRfd3Nza19zZW5kX21lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAcm9sZW1ncl9hdXRvYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAFdTOiBjb25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBiYWQgbWFnaWMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9tYWluLmMAamFjZGFjLWMvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX3V0aWwuYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGphY2RhYy1jL25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc3RyaW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBbRmliZXI6ICV4XQBbQnVmZmVyICV1YjogJS1zXQBbRnVuY3Rpb246ICVzXQBbUm9sZTogJXNdAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAFtCdWZmZXIgJXViOiAlLXMuLi5dACh0YWcgJiBERVZTX0dDX1RBR19NQVNLKSA+PSBERVZTX0dDX1RBR19CWVRFUwBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBERVZTX0dDX1RBR19CWVRFUwBOYU4AcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZGV2c19pbWdfZ2V0X3V0ZjgAZUNPMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGFyZzAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAChjdHgtPmZsYWdzICYgREVWU19DVFhfRkxBR19CVVNZKSA9PSAwACh0YWcgJiBERVZTX0dDX1RBR19NQVNLX1BJTk5FRCkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAodGFnICYgREVWU19HQ19UQUdfTUFTS19QSU5ORUQpICE9IDAAL3dzc2svAHdzOi8vAGRldnNfYnVmZmVyaXNoX2lzX2J1ZmZlcih2KQBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2Yo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dGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQghZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkCRhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcKMmVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm9wZW5fY2FsbGJhY2tfb25fdGhyZWFkCzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQMM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZA01ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQOGmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlDxRqZF9jcnlwdG9fZ2V0X3JhbmRvbRAPX193YXNpX2ZkX2Nsb3NlERVlbXNjcmlwdGVuX21lbWNweV9iaWcSD19fd2FzaV9mZF93cml0ZRMWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBQLc2V0VGVtcFJldDAVGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFhFfX3dhc21fY2FsbF9jdG9ycxcNZmxhc2hfcHJvZ3JhbRgLZmxhc2hfZXJhc2UZCmZsYXNoX3N5bmMaGWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXIbFGFwcF9nZXRfZGV2aWNlX2NsYXNzHAhod19wYW5pYx0IamRfYmxpbmseB2pkX2dsb3cfFGpkX2FsbG9jX3N0YWNrX2NoZWNrIAhqZF9hbGxvYyEHamRfZnJlZSINdGFyZ2V0X2luX2lycSMSdGFyZ2V0X2Rpc2FibGVfaXJxJBF0YXJnZXRfZW5hYmxlX2lycSUTamRfc2V0dGluZ3NfZ2V0X2JpbiYTamRfc2V0dGluZ3Nfc2V0X2JpbicSZGV2c19wYW5pY19oYW5kbGVyKBBqZF9lbV9zZW5kX2ZyYW1lKRpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMioaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcrCmpkX2VtX2luaXQsDWpkX2VtX3Byb2Nlc3MtBWRtZXNnLhRqZF9lbV9mcmFtZV9yZWNlaXZlZC8RamRfZW1fZGV2c19kZXBsb3kwEWpkX2VtX2RldnNfdmVyaWZ5MRhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3kyDGh3X2RldmljZV9pZDMMdGFyZ2V0X3Jlc2V0NA50aW1fZ2V0X21pY3JvczUSamRfdGNwc29ja19wcm9jZXNzNhFhcHBfaW5pdF9zZXJ2aWNlczcSZGV2c19jbGllbnRfZGVwbG95OBRjbGllbnRfZXZlbnRfaGFuZGxlcjkLYXBwX3Byb2Nlc3M6B3R4X2luaXQ7D2pkX3BhY2tldF9yZWFkeTwKdHhfcHJvY2Vzcz0XamRfd2Vic29ja19zZW5kX21lc3NhZ2U+DmpkX3dlYnNvY2tfbmV3PwZvbm9wZW5AB29uZXJyb3JBB29uY2xvc2VCCW9ubWVzc2FnZUMQamRfd2Vic29ja19jbG9zZUQccm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZUUWcm9sZW1ncl9zZXJpYWxpemVfcm9sZUYPcm9sZW1ncl9wcm9jZXNzRxByb2xlbWdyX2F1dG9iaW5kSBVyb2xlbWdyX2hhbmRsZV9wYWNrZXRJFGpkX3JvbGVfbWFuYWdlcl9pbml0Shhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWRLDWpkX3JvbGVfYWxsb2NMEGpkX3JvbGVfZnJlZV9hbGxNFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmROEmpkX3JvbGVfYnlfc2VydmljZU8TamRfY2xpZW50X2xvZ19ldmVudFATamRfY2xpZW50X3N1YnNjcmliZVEUamRfY2xpZW50X2VtaXRfZXZlbnRSFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkUxBqZF9kZXZpY2VfbG9va3VwVBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2VVE2pkX3NlcnZpY2Vfc2VuZF9jbWRWEWpkX2NsaWVudF9wcm9jZXNzVw5qZF9kZXZpY2VfZnJlZVgXamRfY2xpZW50X2hhbmRsZV9wYWNrZXRZD2pkX2RldmljZV9hbGxvY1oOYWdnYnVmZmVyX2luaXRbD2FnZ2J1ZmZlcl9mbHVzaFwQYWdnYnVmZmVyX3VwbG9hZF0OZGV2c19idWZmZXJfb3BeEGRldnNfcmVhZF9udW1iZXJfD2RldnNfY3JlYXRlX2N0eGAJc2V0dXBfY3R4YQpkZXZzX3RyYWNlYg9kZXZzX2Vycm9yX2NvZGVjGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJkCWNsZWFyX2N0eGUNZGV2c19mcmVlX2N0eGYOZGV2c190cnlfYWxsb2NnCGRldnNfb29taAlkZXZzX2ZyZWVpF2RldmljZXNjcmlwdG1ncl9wcm9jZXNzagd0cnlfcnVuawxzdG9wX3Byb2dyYW1sHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfc3RhcnRtHGRldmljZXNjcmlwdG1ncl9kZXBsb3lfd3JpdGVuGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaG8dZGV2aWNlc2NyaXB0bWdyX2hhbmRsZV9wYWNrZXRwDmRlcGxveV9oYW5kbGVycRNkZXBsb3lfbWV0YV9oYW5kbGVychZkZXZpY2VzY3JpcHRtZ3JfZGVwbG95cxRkZXZpY2VzY3JpcHRtZ3JfaW5pdHQZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldnURZGV2c2Nsb3VkX3Byb2Nlc3N2F2RldnNjbG91ZF9oYW5kbGVfcGFja2V0dxNkZXZzY2xvdWRfb25fbWV0aG9keA5kZXZzY2xvdWRfaW5pdHkQZGV2c19maWJlcl95aWVsZHoWZGV2c19maWJlcl9jb3B5X3BhcmFtc3sYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9ufBhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWV9EGRldnNfZmliZXJfc2xlZXB+G2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbH8aZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnOAARFkZXZzX2ltZ19mdW5fbmFtZYEBEmRldnNfaW1nX3JvbGVfbmFtZYIBEmRldnNfZmliZXJfYnlfZmlkeIMBEWRldnNfZmliZXJfYnlfdGFnhAEQZGV2c19maWJlcl9zdGFydIUBFGRldnNfZmliZXJfdGVybWlhbnRlhgEOZGV2c19maWJlcl9ydW6HARNkZXZzX2ZpYmVyX3N5bmNfbm93iAEKZGV2c19wYW5pY4kBFV9kZXZzX3J1bnRpbWVfZmFpbHVyZYoBD2RldnNfZmliZXJfcG9rZYsBD2pkX2djX3RyeV9hbGxvY4wBCXRyeV9hbGxvY40BB2RldnNfZ2OOAQ9maW5kX2ZyZWVfYmxvY2uPAQtqZF9nY191bnBpbpABCmpkX2djX2ZyZWWRAQ5kZXZzX3ZhbHVlX3BpbpIBEGRldnNfdmFsdWVfdW5waW6TARJkZXZzX21hcF90cnlfYWxsb2OUARRkZXZzX2FycmF5X3RyeV9hbGxvY5UBFWRldnNfYnVmZmVyX3RyeV9hbGxvY5YBFWRldnNfc3RyaW5nX3RyeV9hbGxvY5cBD2RldnNfZ2Nfc2V0X2N0eJgBDmRldnNfZ2NfY3JlYXRlmQEPZGV2c19nY19kZXN0cm95mgEEc2NhbpsBE3NjYW5fYXJyYXlfYW5kX21hcmucARRkZXZzX2pkX2dldF9yZWdpc3Rlcp0BFmRldnNfamRfY2xlYXJfcGt0X2tpbmSeARBkZXZzX2pkX3NlbmRfY21knwETZGV2c19qZF9zZW5kX2xvZ21zZ6ABDWhhbmRsZV9sb2dtc2ehARJkZXZzX2pkX3Nob3VsZF9ydW6iARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZaMBE2RldnNfamRfcHJvY2Vzc19wa3SkARRkZXZzX2pkX3JvbGVfY2hhbmdlZKUBFGRldnNfamRfcmVzZXRfcGFja2V0pgESZGV2c19qZF9pbml0X3JvbGVzpwESZGV2c19qZF9mcmVlX3JvbGVzqAEQZGV2c19zZXRfbG9nZ2luZ6kBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc6oBDGRldnNfbWFwX3NldKsBDGRldnNfbWFwX2dldKwBCmRldnNfaW5kZXitAQ5kZXZzX2luZGV4X3NldK4BEWRldnNfYXJyYXlfaW5zZXJ0rwESZGV2c19yZWdjYWNoZV9mcmVlsAEWZGV2c19yZWdjYWNoZV9mcmVlX2FsbLEBF2RldnNfcmVnY2FjaGVfbWFya191c2VksgETZGV2c19yZWdjYWNoZV9hbGxvY7MBFGRldnNfcmVnY2FjaGVfbG9va3VwtAERZGV2c19yZWdjYWNoZV9hZ2W1ARdkZXZzX3JlZ2NhY2hlX2ZyZWVfcm9sZbYBEmRldnNfcmVnY2FjaGVfbmV4dLcBD2pkX3NldHRpbmdzX2dldLgBD2pkX3NldHRpbmdzX3NldLkBDWNvbnN1bWVfY2h1bmu6AQ1zaGFfMjU2X2Nsb3NluwEPamRfc2hhMjU2X3NldHVwvAEQamRfc2hhMjU2X3VwZGF0Zb0BEGpkX3NoYTI1Nl9maW5pc2i+ARRqZF9zaGEyNTZfaG1hY19zZXR1cL8BFWpkX3NoYTI1Nl9obWFjX2ZpbmlzaMABDmpkX3NoYTI1Nl9oa2RmwQEOZGV2c19zdHJmb3JtYXTCAQ5kZXZzX2lzX3N0cmluZ8MBFGRldnNfc3RyaW5nX3ZzcHJpbnRmxAETZGV2c19zdHJpbmdfc3ByaW50ZsUBFWRldnNfc3RyaW5nX2Zyb21fdXRmOMYBFGRldnNfdmFsdWVfdG9fc3RyaW5nxwESZGV2c19zdHJpbmdfY29uY2F0yAEcZGV2c19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY8kBD3RzYWdnX2NsaWVudF9ldsoBCmFkZF9zZXJpZXPLAQ10c2FnZ19wcm9jZXNzzAEKbG9nX3Nlcmllc80BE3RzYWdnX2hhbmRsZV9wYWNrZXTOARRsb29rdXBfb3JfYWRkX3Nlcmllc88BCnRzYWdnX2luaXTQAQx0c2FnZ191cGRhdGXRARZkZXZzX3ZhbHVlX2Zyb21fZG91Ymxl0gETZGV2c192YWx1ZV9mcm9tX2ludNMBFGRldnNfdmFsdWVfZnJvbV9ib29s1AEXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXLVARFkZXZzX3ZhbHVlX3RvX2ludNYBFGRldnNfdmFsdWVfdG9fZG91Ymxl1wESZGV2c192YWx1ZV90b19ib29s2AEOZGV2c19pc19idWZmZXLZARBkZXZzX2J1ZmZlcl9kYXRh2gEUZGV2c192YWx1ZV90b19nY19vYmrbARFkZXZzX3ZhbHVlX3R5cGVvZtwBD2RldnNfaXNfbnVsbGlzaN0BEmRldnNfaW1nX3N0cmlkeF9va94BC2RldnNfdmVyaWZ53wEUZGV2c192bV9leGVjX29wY29kZXPgARFkZXZzX2ltZ19nZXRfdXRmOOEBFGRldnNfZ2V0X3N0YXRpY191dGY44gEMZXhwcl9pbnZhbGlk4wEQZXhwcnhfbG9hZF9sb2NhbOQBEWV4cHJ4X2xvYWRfZ2xvYmFs5QERZXhwcjNfbG9hZF9idWZmZXLmAQ1leHByeF9saXRlcmFs5wERZXhwcnhfbGl0ZXJhbF9mNjToAQ1leHByMF9yZXRfdmFs6QEMZXhwcjJfc3RyMGVx6gEXZXhwcjFfcm9sZV9pc19jb25uZWN0ZWTrAQ5leHByMF9wa3Rfc2l6ZewBEWV4cHIwX3BrdF9ldl9jb2Rl7QEWZXhwcjBfcGt0X3JlZ19nZXRfY29kZe4BCWV4cHIwX25hbu8BCWV4cHIxX2Fic/ABDWV4cHIxX2JpdF9ub3TxAQpleHByMV9jZWls8gELZXhwcjFfZmxvb3LzAQhleHByMV9pZPQBDGV4cHIxX2lzX25hbvUBC2V4cHIxX2xvZ19l9gEJZXhwcjFfbmVn9wEJZXhwcjFfbm90+AEMZXhwcjFfcmFuZG9t+QEQZXhwcjFfcmFuZG9tX2ludPoBC2V4cHIxX3JvdW5k+wENZXhwcjFfdG9fYm9vbPwBCWV4cHIyX2FkZP0BDWV4cHIyX2JpdF9hbmT+AQxleHByMl9iaXRfb3L/AQ1leHByMl9iaXRfeG9ygAIJZXhwcjJfZGl2gQIIZXhwcjJfZXGCAgpleHByMl9pZGl2gwIKZXhwcjJfaW11bIQCCGV4cHIyX2xlhQIIZXhwcjJfbHSGAglleHByMl9tYXiHAglleHByMl9taW6IAglleHByMl9tdWyJAghleHByMl9uZYoCCWV4cHIyX3Bvd4sCEGV4cHIyX3NoaWZ0X2xlZnSMAhFleHByMl9zaGlmdF9yaWdodI0CGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkjgIJZXhwcjJfc3VijwIQZXhwcnhfbG9hZF9wYXJhbZACDGV4cHIwX25vd19tc5ECFmV4cHIxX2dldF9maWJlcl9oYW5kbGWSAhVleHByMF9wa3RfcmVwb3J0X2NvZGWTAhZleHByMF9wa3RfY29tbWFuZF9jb2RllAIRZXhwcnhfc3RhdGljX3JvbGWVAgxzdG10NF9tZW1zZXSWAhBleHByeDFfZ2V0X2ZpZWxklwILZXhwcjJfaW5kZXiYAhNleHByMV9vYmplY3RfbGVuZ3RomQIRZXhwcjFfa2V5c19sZW5ndGiaAgxleHByMV90eXBlb2abAgpleHByMF9udWxsnAINZXhwcjFfaXNfbnVsbJ0CEGV4cHIwX3BrdF9idWZmZXKeAgpleHByMF90cnVlnwILZXhwcjBfZmFsc2WgAg9zdG10MV93YWl0X3JvbGWhAg1zdG10MV9zbGVlcF9zogIOc3RtdDFfc2xlZXBfbXOjAg9zdG10M19xdWVyeV9yZWekAg5zdG10Ml9zZW5kX2NtZKUCE3N0bXQ0X3F1ZXJ5X2lkeF9yZWemAhFzdG10eDJfbG9nX2Zvcm1hdKcCDXN0bXR4M19mb3JtYXSoAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVyqQINc3RtdDJfc2V0X3BrdKoCCnN0bXQ1X2JsaXSrAgtzdG10eDJfY2FsbKwCDnN0bXR4M19jYWxsX2JnrQIMc3RtdDFfcmV0dXJurgIJc3RtdHhfam1wrwIMc3RtdHgxX2ptcF96sAILc3RtdDFfcGFuaWOxAhJzdG10eDFfc3RvcmVfbG9jYWyyAhNzdG10eDFfc3RvcmVfZ2xvYmFsswISc3RtdDRfc3RvcmVfYnVmZmVytAISc3RtdHgxX3N0b3JlX3BhcmFttQIVc3RtdDFfdGVybWluYXRlX2ZpYmVytgIPc3RtdDBfYWxsb2NfbWFwtwIRc3RtdDFfYWxsb2NfYXJyYXm4AhJzdG10MV9hbGxvY19idWZmZXK5AhBzdG10eDJfc2V0X2ZpZWxkugIPc3RtdDNfYXJyYXlfc2V0uwISc3RtdDNfYXJyYXlfaW5zZXJ0vAIVZXhwcnhfc3RhdGljX2Z1bmN0aW9uvQIKZXhwcjJfaW1vZL4CDGV4cHIxX3RvX2ludL8CE2V4cHJ4X3N0YXRpY19idWZmZXLAAhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbmfBAhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5nwgIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nwwIRc3RtdDFfZGVjb2RlX3V0ZjjEAg9kZXZzX3ZtX3BvcF9hcmfFAhNkZXZzX3ZtX3BvcF9hcmdfdTMyxgITZGV2c192bV9wb3BfYXJnX2kzMscCFGRldnNfdm1fcG9wX2FyZ19mdW5jyAITZGV2c192bV9wb3BfYXJnX2Y2NMkCFmRldnNfdm1fcG9wX2FyZ19idWZmZXLKAhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGHLAhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4zAIUZGV2c192bV9wb3BfYXJnX3JvbGXNAhNkZXZzX3ZtX3BvcF9hcmdfbWFwzgISamRfYWVzX2NjbV9lbmNyeXB0zwISamRfYWVzX2NjbV9kZWNyeXB00AIMQUVTX2luaXRfY3R40QIPQUVTX0VDQl9lbmNyeXB00gIQamRfYWVzX3NldHVwX2tledMCDmpkX2Flc19lbmNyeXB01AIQamRfYWVzX2NsZWFyX2tledUCC2pkX3dzc2tfbmV31gIUamRfd3Nza19zZW5kX21lc3NhZ2XXAhNqZF93ZWJzb2NrX29uX2V2ZW502AIHZGVjcnlwdNkCDWpkX3dzc2tfY2xvc2XaAhBqZF93c3NrX29uX2V2ZW502wIKc2VuZF9lbXB0edwCEndzc2toZWFsdGhfcHJvY2Vzc90CF2pkX3RjcHNvY2tfaXNfYXZhaWxhYmxl3gIUd3Nza2hlYWx0aF9yZWNvbm5lY3TfAhh3c3NraGVhbHRoX2hhbmRsZV9wYWNrZXTgAg9zZXRfY29ubl9zdHJpbmfhAhFjbGVhcl9jb25uX3N0cmluZ+ICD3dzc2toZWFsdGhfaW5pdOMCE3dzc2tfcHVibGlzaF92YWx1ZXPkAhB3c3NrX3B1Ymxpc2hfYmlu5QIRd3Nza19pc19jb25uZWN0ZWTmAhN3c3NrX3Jlc3BvbmRfbWV0aG9k5wIPamRfY3RybF9wcm9jZXNz6AIVamRfY3RybF9oYW5kbGVfcGFja2V06QIMamRfY3RybF9pbml06gINamRfaXBpcGVfb3BlbusCFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTsAg5qZF9pcGlwZV9jbG9zZe0CEmpkX251bWZtdF9pc192YWxpZO4CFWpkX251bWZtdF93cml0ZV9mbG9hdO8CE2pkX251bWZtdF93cml0ZV9pMzLwAhJqZF9udW1mbXRfcmVhZF9pMzLxAhRqZF9udW1mbXRfcmVhZF9mbG9hdPICEWpkX29waXBlX29wZW5fY21k8wIUamRfb3BpcGVfb3Blbl9yZXBvcnT0AhZqZF9vcGlwZV9oYW5kbGVfcGFja2V09QIRamRfb3BpcGVfd3JpdGVfZXj2AhBqZF9vcGlwZV9wcm9jZXNz9wIUamRfb3BpcGVfY2hlY2tfc3BhY2X4Ag5qZF9vcGlwZV93cml0ZfkCDmpkX29waXBlX2Nsb3Nl+gINamRfcXVldWVfcHVzaPsCDmpkX3F1ZXVlX2Zyb250/AIOamRfcXVldWVfc2hpZnT9Ag5qZF9xdWV1ZV9hbGxvY/4CDWpkX3Jlc3BvbmRfdTj/Ag5qZF9yZXNwb25kX3UxNoADDmpkX3Jlc3BvbmRfdTMygQMRamRfcmVzcG9uZF9zdHJpbmeCAxdqZF9zZW5kX25vdF9pbXBsZW1lbnRlZIMDC2pkX3NlbmRfcGt0hAMdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWyFAxdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcoYDGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXSHAxRqZF9hcHBfaGFuZGxlX3BhY2tldIgDFWpkX2FwcF9oYW5kbGVfY29tbWFuZIkDE2pkX2FsbG9jYXRlX3NlcnZpY2WKAxBqZF9zZXJ2aWNlc19pbml0iwMOamRfcmVmcmVzaF9ub3eMAxlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVkjQMUamRfc2VydmljZXNfYW5ub3VuY2WOAxdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZY8DEGpkX3NlcnZpY2VzX3RpY2uQAxVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmeRAxpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZZIDEmFwcF9nZXRfZndfdmVyc2lvbpMDFmFwcF9nZXRfZGV2X2NsYXNzX25hbWWUAw1qZF9oYXNoX2ZudjFhlQMMamRfZGV2aWNlX2lklgMJamRfcmFuZG9tlwMIamRfY3JjMTaYAw5qZF9jb21wdXRlX2NyY5kDDmpkX3NoaWZ0X2ZyYW1lmgMOamRfcmVzZXRfZnJhbWWbAxBqZF9wdXNoX2luX2ZyYW1lnAMNamRfcGFuaWNfY29yZZ0DE2pkX3Nob3VsZF9zYW1wbGVfbXOeAxBqZF9zaG91bGRfc2FtcGxlnwMJamRfdG9faGV4oAMLamRfZnJvbV9oZXihAw5qZF9hc3NlcnRfZmFpbKIDB2pkX2F0b2mjAwtqZF92c3ByaW50ZqQDD2pkX3ByaW50X2RvdWJsZaUDEmpkX2RldmljZV9zaG9ydF9pZKYDDGpkX3NwcmludGZfYacDC2pkX3RvX2hleF9hqAMUamRfZGV2aWNlX3Nob3J0X2lkX2GpAwlqZF9zdHJkdXCqAw5qZF9qc29uX2VzY2FwZasDE2pkX2pzb25fZXNjYXBlX2NvcmWsAwlqZF9tZW1kdXCtAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlrgMWZG9fcHJvY2Vzc19ldmVudF9xdWV1Za8DEWpkX3NlbmRfZXZlbnRfZXh0sAMKamRfcnhfaW5pdLEDFGpkX3J4X2ZyYW1lX3JlY2VpdmVksgMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uzAw9qZF9yeF9nZXRfZnJhbWW0AxNqZF9yeF9yZWxlYXNlX2ZyYW1ltQMRamRfc2VuZF9mcmFtZV9yYXe2Aw1qZF9zZW5kX2ZyYW1ltwMKamRfdHhfaW5pdLgDB2pkX3NlbmS5AxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjugMPamRfdHhfZ2V0X2ZyYW1luwMQamRfdHhfZnJhbWVfc2VudLwDC2pkX3R4X2ZsdXNovQMQX19lcnJub19sb2NhdGlvbr4DBWR1bW15vwMIX19tZW1jcHnAAwdtZW1tb3ZlwQMGbWVtc2V0wgMKX19sb2NrZmlsZcMDDF9fdW5sb2NrZmlsZcQDDF9fc3RkaW9fc2Vla8UDDV9fc3RkaW9fd3JpdGXGAw1fX3N0ZGlvX2Nsb3NlxwMMX19zdGRpb19leGl0yAMKY2xvc2VfZmlsZckDCV9fdG93cml0ZcoDCV9fZndyaXRleMsDBmZ3cml0ZcwDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHPNAxRfX3B0aHJlYWRfbXV0ZXhfbG9ja84DFl9fcHRocmVhZF9tdXRleF91bmxvY2vPAwZfX2xvY2vQAw5fX21hdGhfZGl2emVyb9EDDl9fbWF0aF9pbnZhbGlk0gMDbG9n0wMFbG9nMTDUAwdfX2xzZWVr1QMGbWVtY21w1gMKX19vZmxfbG9ja9cDDF9fbWF0aF94Zmxvd9gDCmZwX2JhcnJpZXLZAwxfX21hdGhfb2Zsb3faAwxfX21hdGhfdWZsb3fbAwRmYWJz3AMDcG933QMIY2hlY2tpbnTeAwtzcGVjaWFsY2FzZd8DBXJvdW5k4AMGc3RyY2hy4QMLX19zdHJjaHJudWziAwZzdHJjbXDjAwZzdHJsZW7kAxJfX3dhc2lfc3lzY2FsbF9yZXTlAwhkbG1hbGxvY+YDBmRsZnJlZecDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZegDBHNicmvpAwlfX3Bvd2lkZjLqAwlzdGFja1NhdmXrAwxzdGFja1Jlc3RvcmXsAwpzdGFja0FsbG9j7QMVZW1zY3JpcHRlbl9zdGFja19pbml07gMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZe8DGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XwAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTxAwxkeW5DYWxsX2ppamnyAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp8wMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB8QMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
