
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB04GAgAAhYAN/f38AYAF/AGACf38AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAn98AGAAAXxgBn9/f39/fwBgA39/fwF8YAl/f39/f39/f38AYAd/f39/f39/AX9gA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/AsyFgIAAFgNlbnYFYWJvcnQABQNlbnYTX2RldnNfcGFuaWNfaGFuZGxlcgABA2Vudg1lbV9zZW5kX2ZyYW1lAAEDZW52EGVtX2NvbnNvbGVfZGVidWcAAQNlbnYEZXhpdAABA2VudgtlbV90aW1lX25vdwASA2VudhNkZXZzX2RlcGxveV9oYW5kbGVyAAEDZW52IGVtc2NyaXB0ZW5fd2Vic29ja2V0X3NlbmRfYmluYXJ5AAYDZW52IWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAAIA2VudhhlbXNjcmlwdGVuX3dlYnNvY2tldF9uZXcABANlbnYyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52M2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQAGA2VudhRqZF9jcnlwdG9fZ2V0X3JhbmRvbQACFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UABANlbnYVZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAYWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAJA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAQDZW52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QQBBACgC3J4BIANqNgLcngEDQAJAQQAoAtieASIAQcAARw0AIANBwABJDQBB4J4BIAIQtAEgAkHAAGohAiADQUBqIgMNAQwCC0EAKALUngEgAiADIAAgAyAASRsiABCzAxpBAEEAKALYngEiASAAazYC2J4BIAIgAGohAiADIABrIQMCQCABIABHDQBB4J4BQZSeARC0AUEAQcAANgLYngFBAEGUngE2AtSeASADDQEMAgtBAEEAKALUngEgAGo2AtSeASADDQALCyAIELoBIAhBIBC5AQJAIAVFDQBBAEEAKALcngEgBWo2AtyeAQNAAkBBACgC2J4BIgNBwABHDQAgBUHAAEkNAEHgngEgBBC0ASAEQcAAaiEEIAVBQGoiBQ0BDAILQQAoAtSeASAEIAUgAyAFIANJGyIDELMDGkEAQQAoAtieASICIANrNgLYngEgBCADaiEEIAUgA2shBQJAIAIgA0cNAEHgngFBlJ4BELQBQQBBwAA2AtieAUEAQZSeATYC1J4BIAUNAQwCC0EAQQAoAtSeASADajYC1J4BIAUNAAsLAkAgB0UNAEEAQQAoAtyeASAHajYC3J4BA0ACQEEAKALYngEiA0HAAEcNACAHQcAASQ0AQeCeASAGELQBIAZBwABqIQYgB0FAaiIHDQEMAgtBACgC1J4BIAYgByADIAcgA0kbIgMQswMaQQBBACgC2J4BIgUgA2s2AtieASAGIANqIQYgByADayEHAkAgBSADRw0AQeCeAUGUngEQtAFBAEHAADYC2J4BQQBBlJ4BNgLUngEgBw0BDAILQQBBACgC1J4BIANqNgLUngEgBw0ACwtBASEDQQBBACgC3J4BQQFqNgLcngFB2DAhBQJAA0ACQEEAKALYngEiB0HAAEcNACADQcAASQ0AQeCeASAFELQBIAVBwABqIQUgA0FAaiIDDQEMAgtBACgC1J4BIAUgAyAHIAMgB0kbIgcQswMaQQBBACgC2J4BIgIgB2s2AtieASAFIAdqIQUgAyAHayEDAkAgAiAHRw0AQeCeAUGUngEQtAFBAEHAADYC2J4BQQBBlJ4BNgLUngEgAw0BDAILQQBBACgC1J4BIAdqNgLUngEgAw0ACwsgCBC6AQv8BAEHfyMAQdAAayIHJAAgA0EARyEIAkACQCABDQBBACEJDAELQQAhCSADRQ0AQQAhCkEAIQkDQCAKQQFqIQgCQAJAAkACQAJAIAAgCmotAAAiC0H7AEcNACAIIAFJDQELAkAgC0H9AEYNACAIIQoMAwsgCCABSQ0BIAghCgwCCyAKQQJqIQogACAIai0AACILQfsARg0BAkACQCALQVBqQf8BcUEJSw0AIAtBGHRBGHVBUGohDAwBC0F/IQwgC0EgciIIQZ9/akH/AXFBGUsNACAIQRh0QRh1Qal/aiEMCwJAIAxBAE4NAEEhIQsMAgsgCiEIAkAgCiABTw0AA0AgACAIai0AAEH9AEYNASAIQQFqIgggAUcNAAsgASEIC0F/IQ0CQCAKIAhPDQACQCAAIApqLAAAIgpBUGoiC0H/AXFBCUsNACALIQ0MAQsgCkEgciIKQZ9/akH/AXFBGUsNACAKQal/aiENCyAIQQFqIQpBPyELIAwgBU4NASAHIAQgDEEDdGopAwA3AwggB0EQaiAHQQhqEMsBQQcgDUEBaiANQQBIGxCYAyAHLQAQIgtFDQIgB0EQaiEIIAkgA08NAgNAIAhBAWohCAJAAkAgBg0AIAIgCWogCzoAACAJQQFqIQlBACEGDAELIAZBf2ohBgsgCC0AACILRQ0DIAkgA0kNAAwDCwALIApBAmogCCAAIAhqLQAAQf0ARhshCgsCQCAGDQAgAiAJaiALOgAAIAlBAWohCUEAIQYMAQsgBkF/aiEGCyAJIANJIQggCiABTw0BIAkgA0kNAAsLIAIgCSADQX9qIAgbakEAOgAAIAdB0ABqJAAgCSADIAgbC3gBB39BACEBQQAoAqw9QX9qIQIDQAJAIAEgAkwNAEEADwsCQAJAQaA6IAIgAWpBAm0iA0EMbGoiBCgCBCIFIABPDQBBASEGIANBAWohAQwBC0EAIQYCQCAFIABLDQAgBCEHDAELIANBf2ohAkEBIQYLIAYNAAsgBwu2CAIJfwF8AkACQAJAAkACQAJAIAFBf2oOEAABBAQEBAQEBAQEBAQEBAIDCyACLQAQQQJJDQNBACgCrD1Bf2ohBEEBIQUDQCACIAVBDGxqQSRqIgYoAgAhB0EAIQEgBCEIAkADQAJAIAEgCEwNAEEAIQkMAgsCQAJAQaA6IAggAWpBAm0iA0EMbGoiCigCBCILIAdPDQBBASEMIANBAWohAQwBC0EAIQwCQCALIAdLDQAgCiEJDAELIANBf2ohCEEBIQwLIAwNAAsLAkAgCUUNACAAIAYQvwEaCyAFQQFqIgUgAi0AEEkNAAwECwALIAJFDQMgACgCJCIBRQ0CQQAhAwNAIAEiCCgCACEBAkAgCCgCBCIMDQAgCCEDIAENAQwECwJAIAxBACAMLQAEa0EMbGpBXGogAkYNACAIIQMgAQ0BDAQLAkACQCADDQAgACABNgIkDAELIAMgATYCAAsgCCgCDBAhIAgQISABDQAMAwsACyADLwEOQYEiRw0BIAMtAANBAXENAUEAKAKsPUF/aiEIIAIoAgAhC0EAIQECQANAAkAgASAITA0AQQAhBQwCCwJAAkBBoDogCCABakECbSIHQQxsaiIJKAIEIgogC08NAEEBIQwgB0EBaiEBDAELQQAhDAJAIAogC0sNACAJIQUMAQsgB0F/aiEIQQEhDAsgDA0ACwsgBUUNASAAKAIkIgFFDQEgA0EQaiEMA0ACQCABKAIEIAJHDQACQCABLQAJIghFDQAgASAIQX9qOgAJCwJAIAwgAy0ADCAFLwEIEF4iDb1C////////////AINCgICAgICAgPj/AFYNAAJAIAEpAxhC////////////AINCgYCAgICAgPj/AFQNACABIA05AxggAUEANgIgIAFBOGogDTkDACABQTBqIA05AwAgAUEoakIANwMAIAEgAUHAAGooAgA2AhQLIAEgASgCIEEBajYCICABKAIUIQcCQAJAQQAoAuCiASILIAFBxABqKAIAIghrQQBIDQAgAUEoaiILIAErAxggCCAHa7iiIAsrAwCgOQMADAELIAFBKGoiCCABKwMYIAsgB2u4oiAIKwMAoDkDACALIQgLIAEgCDYCFAJAIAFBOGorAwAgDWNFDQAgASANOQM4CwJAIAFBMGorAwAgDWRFDQAgASANOQMwCyABIA05AxgLIAAoAggiCEUNACAAQQAoAuCiASAIajYCHAsgASgCACIBDQAMAgsACyABQcAARw0AIAJFDQAgACgCJCIBRQ0AA0ACQAJAIAEoAgwiCA0AQQAhDAwBCyAIIAMoAgQQ1gNFIQwLAkACQAJAIAEoAgQgAkcNACAMDQIgCBAhIAMoAgQQnQMhCAwBCyAMRQ0BIAgQIUEAIQgLIAEgCDYCDAsgASgCACIBDQALCw8LQcIpQeYjQZUCQdEJEJUDAAu5AQEDf0HIABAg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IAEtABBBAEc6AAoPCwJAAkAgACABQaA1EPgCQf9+ag4EAAICAQILIAAgACgCDCIBQYC4mSkgAUGAuJkpSRs2AgwPCyAAIAAoAggiAUGAuJkpIAFBgLiZKUkbIgE2AgggAUUNACAAQQAoAuCiASABajYCHAsL+gEBBH8gAkEBaiEDIAFB6yggARshBAJAIAAoAiQiAUUNAANAAkAgASgCDCIFRQ0AIAUgBCADEMkDRQ0CCyABKAIAIgENAAsLAkAgAQ0AQcgAECAiAUH/AToACiABQQA2AgQgASAAKAIkNgIAIAAgATYCJCABQoCAgICAgID8/wA3AxggAUEAKALgogEiBjYCQAJAIAEoAhAiBQ0AAkACQCAALQASRQ0AIABBKGohBSAAKAIoDQEgBUGIJzYCAAwBCyAAQQxqIQULIAUoAgAhBQsgASAFIAZqNgJEIAFBzB0QwQEgASADECAiBTYCDCAFIAQgAhCzAxoLIAELOAEBf0EAQbA1EP0CIgE2AuCfASABQQE6ABIgASAANgIgIAFB4NQDNgIMIAFBgQI7ARBBECABEFALygIBA38CQEEAKALgnwEiAkUNACACIAAgABDXAxDDASEAIAG9Qv///////////wCDQoCAgICAgID4/wBWDQACQCAAKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgACABOQMYIABBADYCICAAQThqIAE5AwAgAEEwaiABOQMAIABBKGpCADcDACAAIABBwABqKAIANgIUCyAAIAAoAiBBAWo2AiAgACgCFCEDAkACQEEAKALgogEiBCAAQcQAaigCACICa0EASA0AIABBKGoiBCAAKwMYIAIgA2u4oiAEKwMAoDkDAAwBCyAAQShqIgIgACsDGCAEIANruKIgAisDAKA5AwAgBCECCyAAIAI2AhQCQCAAQThqKwMAIAFjRQ0AIAAgATkDOAsCQCAAQTBqKwMAIAFkRQ0AIAAgATkDMAsgACABOQMYCwumAgICfgR/AkAgAb0iAkL///////////8Ag0KBgICAgICA+P8AVA0AIABCgICAgICAgPz/ADcDAA8LAkAgAkIgiCIDIAKEpw0AIABCgICAgHA3AwAPCwJAIAOnIgRBFHZB/w9xIgVB/wdJDQAgAqchBgJAAkAgBUGTCEsNACAGDQICQCAFQZMIRg0AIARB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KAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQywGbEMYBCyADQRBqJAALTwEBfyMAQRBrIgMkACADQQhqIAIQuAICQAJAIAMoAgxBf0cNACAAIAMpAwg3AwAMAQsgAyADKQMINwMAIAAgAxDLAZwQxgELIANBEGokAAsJACAAIAIQuAILLwEBfyMAQRBrIgMkACADQQhqIAIQuAIgACADKAIMQYCA4P8HRhDIASADQRBqJAALDwAgACACELwCEMYDEMYBC28BAX8jAEEQayIDJAAgA0EIaiACELgCAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAxDLAZoQxgEMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQPQNTcDAAwBCyAAQQAgAmsQxwELIANBEGokAAs1AQF/IwBBEGsiAyQAIANBCGogAhC4AiADIAMpAwg3AwAgACADEMwBQQFzEMgBIANBEGokAAshAQF/EIoDIQMgACACELwCIAO4okQAAAAAAADwPaIQxgELSwEDf0EBIQMCQCACELoCIgRBAU0NAANAIANBAXRBAXIiAyAESQ0ACwsDQCACEIoDIANxIgUgBSAESyIFGyECIAUNAAsgACACEMcBC1EBAX8jAEEQayIDJAAgA0EIaiACELgCAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQywEQ0wMQxgELIANBEGokAAsyAQF/IwBBEGsiAyQAIANBCGogAhC4AiADIAMpAwg3AwAgACADEMwBEMgBIANBEGokAAvIAQIEfwF8IwBBIGsiAyQAIANBGGogAhC4AiACQRhqIgQgAykDGDcDACADQRhqIAIQuAIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQxwEMAQsgAyACQRBqKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiADQQhqEMsBIgc5AwAgACAHIAIrAyCgEMYBCyADQSBqJAALLAECfyACQRhqIgMgAhC6AjYCACACIAIQugIiBDYCECAAIAQgAygCAHEQxwELLAECfyACQRhqIgMgAhC6AjYCACACIAIQugIiBDYCECAAIAQgAygCAHIQxwELLAECfyACQRhqIgMgAhC6AjYCACACIAIQugIiBDYCECAAIAQgAygCAHMQxwEL4wECBX8BfCMAQSBrIgMkACADQRhqIAIQuAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNAAJAAkAgAigCGCIFQQFqDgIAAgELIAIoAhBBgICAgHhGDQELIAIoAhAiBiAFbSIHIAVsIAZHDQAgACAHEMcBDAELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIIOQMAIAAgAisDICAIoxDGAQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACELgCIAJBGGoiBCADKQMYNwMAIANBGGogAhC4AiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiADQQhqEMsBIgU5AwAgBSACKwMgYSECDAELIAIoAhAgAigCGEYhAgsgACACEMgBIANBIGokAAtBAQJ/IAJBGGoiAyACELoCNgIAIAIgAhC6AiIENgIQAkAgAygCACICDQAgAEEAKQPANTcDAA8LIAAgBCACbRDHAQssAQJ/IAJBGGoiAyACELoCNgIAIAIgAhC6AiIENgIQIAAgBCADKAIAbBDHAQu5AQICfwF8IwBBIGsiAyQAIANBGGogAhC4AiACQRhqIgQgAykDGDcDACADQRhqIAIQuAIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhDIASADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQuAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELgCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEMsBOQMgIAMgBCkDADcDCCACQShqIANBCGoQywEiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQyAEgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACELgCIAJBGGoiBCADKQMYNwMAIANBGGogAhC4AiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQywE5AwBByDUhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAQgBSACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACELgCIAJBGGoiBCADKQMYNwMAIANBGGogAhC4AiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDLATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQywE5AwBByDUhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAUgBCACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC8oBAwN/AX4BfCMAQSBrIgMkACADQRhqIAIQuAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACELgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACNAIQIAI0Ahh+IgZCIIinIAanIgVBH3VHDQAgACAFEMcBDAELIAMgAkEQaikDADcDECACIANBEGoQywE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDLASIHOQMAIAAgByACKwMgohDGAQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACELgCIAJBGGoiBCADKQMYNwMAIANBGGogAhC4AiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsg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AQwBCyAAKAIIKAIsIgYvAQgNAAJAAkAgBUEQSw0AIAEoAjQiByAAKAIMLwEIIghLDQAgByAFaiAITQ0BCyACQQhqIAZB8QAQhwEMAQsgASAEIAAgB0EDdGpBGGogBSADEIIBIQEgACgCCCABNQIYQoCAgICggID4/wCENwMgCyACQRBqJAALMwECfyMAQRBrIgIkACAAKAIIIQMgAkEIaiABELgCIAMgAikDCDcDICAAEH4gAkEQaiQAC1IBAn8jAEEQayICJAACQAJAIAAoAgwoAgAgASgCNCABLwEwaiIDSg0AIAMgAC8BAk4NACAAIAM7AQAMAQsgAkEIaiABQfQAEIcBCyACQRBqJAALdAEDfyMAQSBrIgIkACACQRhqIAEQuAIgAiACKQMYNwMIIAJBCGoQzAEhAwJAAkAgACgCDCgCACABKAI0IAEvATBqIgRKDQAgBCAALwECTg0AIAMNASAAIAQ7AQAMAQsgAkEQaiABQfUAEIcBCyACQSBqJAALDAAgASABELkCEIYBC1UBAn8jAEEQayICJAAgAkEIaiABELgCAkACQCABKAI0IgMgACgCDC8BCEkNACACIAFB9gAQhwEMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVgECfyMAQRBrIgIkACACQQhqIAEQuAICQAJAIAEoAjQiAyABKAKIAS8BDEkNACACIAFB+AAQhwEMAQsgASgCACADQQN0aiACKQMINwMACyACQRBqJAALVAEDfyMAQSBrIgIkACACQRhqIAEQuAIgARC5AiEDIAEQuQIhBCACQRBqIAEQvQIgAiACKQMQNwMAIAJBCGogACAEIAMgAiACQRhqEF0gAkEgaiQAC2YBAn8jAEEQayICJAAgAkEIaiABELgCAkACQCABKAI0IgMgACgCDC0ACkkNACACIAFB9wAQhwEMAQsCQCADIAAtABRJDQAgABB6CyAAKAIQIANBA3RqIAIpAwg3AwALIAJBEGokAAuFAQEBfyMAQSBrIgIkACACQRhqIAEQuAIgACgCCEEAKQPYNTcDICACIAIpAxg3AwgCQCACQQhqENEBDQACQCACKAIcQYKAwP8HRg0AIAJBEGogAUH7ABCHAQwBCyABIAIoAhgQgQEiAUUNACAAKAIIQQApA8A1NwMgIAEQgwELIAJBIGokAAtKAQJ/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AADgQ2NyGyICmUQAAAAAAADgQ2NFDQAgACACsDcAAA8LIABCgICAgICAgICAfzcAAA8LIAAgArY4AAAPCyAAIAI5AAAPC0GAgICAeCEBAkAgAkQAAAAAAADgwWMNAEH/////ByEBIAJEAADA////30FkDQACQCACRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgACADIAKqEOMCDwtBgICAgHghAQsgACADIAEQ4wIL9wEAAkAgAUEISQ0AIAAgASACtxDiAg8LAkACQAJAAkACQAJAAkACQAJAIAEOCAgAAQIDBAUGBwsgACACQf//AyACQf//A0gbIgFBACABQQBKGzsAAA8LIAAgAkEAIAJBAEobNgAADwsgACACQQAgAkEAShutNwAADwsgACACQf8AIAJB/wBIGyIBQYB/IAFBgH9KGzoAAA8LIAAgAkH//wEgAkH//wFIGyIBQYCAfiABQYCAfkobOwAADwsgACACNgAADwsgACACrDcAAA8LQdQgQa4BQYopEJADAAsgACACQf8BIAJB/wFIGyIBQQAgAUEAShs6AAALswMDAX8BfAF+AkACQAJAIAFBCEkNAAJAAkACQAJAAkACQAJAIAFBD3EiAkF+ag4KAAEFBQUCBQUDBAULIAAoAAC4IQMMBQsgACkAALohAwwECyAAKQAAuSEDDAMLIAAqAAC7IQMMAgsgACsAACEDDAELIAAgAhDkArchAwsCQCABQRBJDQAgA0GAgMD/AyABQRB0QYCAwP8HcWtBgIDA/wdxrUIghr+iIQMLQYCAgIB4IQEgA0QAAAAAAADgwWMNAkH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQdQgQcoBQZ4pEJADAAtBgICAgHghAQsgAQudAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUF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QCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACELMDDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALDgAgACgCPCABIAIQyAML2AIBB38jAEEgayIDJAAgAyAAKAIcIgQ2AhAgACgCFCEFIAMgAjYCHCADIAE2AhggAyAFIARrIgE2AhQgASACaiEGQQIhByADQRBqIQECQAJAAkAC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iKkBQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABENAAskAQF+IAAgASACrSADrUIghoQgBBDlAyEFIAVCIIinEBQgBacLEwAgACABpyABQiCIpyACIAMQFQsL3I2BgAADAEGACAuUiQFodW1pZGl0eQBhY2lkaXR5ACFmcmFtZS0+cGFyYW1zX2lzX2NvcHkAZGV2c192ZXJpZnkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABqZF9vcGlwZV93cml0ZV9leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABqZF93c3NrX25ldwBwcmV2AHRzYWdnX2NsaWVudF9ldgBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBuZXh0AGpkX3NlbmRfZXZlbnRfZXh0AGxvY2FsaG9zdABzdG9wX2xpc3QAYXV0aCB0b28gc2hvcnQAZGV2c19maWJlcl9zdGFydABqZF9hZXNfY2NtX2VuY3J5cHQAamRfY2xpZW50X2VtaXRfZXZlbnQAamRfd2Vic29ja19vbl9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AGRldmljZXNjcmlwdG1ncl9pbml0AHJlZmxlY3RlZExpZ2h0AHVuc2hpZnQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldABjaGFyQ29kZUF0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGRldnNfZmliZXJfY29weV9wYXJhbXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAcm90YXJ5RW5jb2RlcgBudW1iZXIAZnJlZV9maWJlcgBqZF9zaGEyNTZfc2V0dXAAcG9wACFzd2VlcABkZXZzX3ZtX3BvcF9hcmdfbWFwAHNtYWxsIGhlbGxvAGRldnNfamRfc2hvdWxkX3J1bgByZS1ydW4AYnV0dG9uAG1vdGlvbgBmdW5jdGlvbgB3aW5kRGlyZWN0aW9uAGJhZCB2ZXJzaW9uAHVucGluAGpvaW4AcHJvZ3JhbSB3cml0dGVuAGpkX29waXBlX29wZW4AamRfaXBpcGVfb3BlbgBib29sZWFuAHNjYW4AZmxhc2hfcHJvZ3JhbQBudWxsAGpkX3JvbGVfZnJlZV9hbGwAbGlnaHRMZXZlbAB3YXRlckxldmVsAHNvdW5kTGV2ZWwAbWFnbmV0aWNGaWVsZExldmVsAGRldnNfaW1nX3N0cmlkeF9vawBXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwB0b1N0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgAwMTIzNDU2Nzg5YWJjZGVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAamRfd3Nza19zZW5kX21lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQBzbGljZQBzcGxpY2UAcm9sZW1ncl9hdXRvYmluZABqZF9zZW5kAGJsb2NrIDwgY2h1bmstPmVuZABuZXh0X2V2ZW50X2NtZABkZXZzX2pkX3NlbmRfY21kAHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZABSRVNUQVJUIHJlcXVlc3RlZABXUzogd2Vic29ja2V0cyBub3Qgc3VwcG9ydGVkAFdTOiBjb25uZWN0ZWQAY3JlYXRlZAB1bmRlZmluZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBiYWQgbWFnaWMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV9tYWluLmMAamFjZGFjLWMvbmV0d29yay9hZXNfY2NtLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZtX3V0aWwuYwBqYWNkYWMtYy9zb3VyY2UvamRfdXRpbC5jAGphY2RhYy1jL25ldHdvcmsvd3Nzay5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL2V2ZW50X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2pkX29waXBlLmMAamFjZGFjLWMvc291cmNlL2pkX2lwaXBlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3JlZ2NhY2hlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2pkaWZhY2UuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZ2NfYWxsb2MuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvc29mdF9zaGEyNTYuYwBkZXBsb3kgJWQgYgBkZXZzX2J1ZmZlcl9kYXRhAHNlcnYgJXMvJWQgcmVnIGNoZyAleCBbc3o9JWRdAEJBU0lDX1RBRyhiLT5oZWFkZXIpID09IERFVlNfR0NfVEFHX0JZVEVTAHBrdCAhPSBOVUxMAHRyZyAhPSBOVUxMAGYgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGRldnNfaW1nX2dldF91dGY4AGVDTzIAamRfbnVtZm10X3dyaXRlX2kzMgBqZF9udW1mbXRfcmVhZF9pMzIAZXZlbnRfc2NvcGUgPT0gMQBhcmcwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgREVWU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGRldnNfdmVyaWZ5KGRldnNfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGRldnNfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMAAoY3R4LT5mbGFncyAmIERFVlNfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAvd3Nzay8Ad3M6Ly8AZGV2c19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGRldnNfaW1nX2hlYWRlcl90KQBkZXZzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQAobnVsbCkAaW52YWxpZCBwa3Qgc2l6ZTogJWQgKG9mZj0lZCBlbmRwPSVkKQBtaXNzaW5nICVkIGJ5dGVzIChvZiAlZCkAR0VUX1RBRyhiLT5oZWFkZXIpID09IChERVZTX0dDX1RBR19NQVNLX1BJTk5FRCB8IERFVlNfR0NfVEFHX0JZVEVTKQB0eXBlICYgKERFVlNfSEFORExFX0dDX01BU0sgfCBERVZTX0hBTkRMRV9JTUdfTUFTSykAV1M6IHRleHQgbWVzc2FnZT8hICclcycAemVybyBrZXkhAFdTOiBlcnJvciEAZGVwbG95IGRldmljZSBsb3N0CgABAAAAAAAAAGphY2RhYy1wb3NpeCBkZXZpY2UAMC4wLjAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAPCfBgCAEIER8Q8AAGZ+Sx4kAQAA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XwAAAGAAAABhAAAAYgAAAGMAAABkAAAAZQAAAGYAAABnAAAAaAAAAGkAAABqAAAAawAAAGwAAABtAAAAbgAAAG8AAABwAAAAcQAAAHIAAABzAAAAEwAAAAUAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAACAAAAAmFIAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhKAACQVFAAAEHQlQELAACcyICAAARuYW1lAbZH6AMABWFib3J0ARNfZGV2c19wYW5pY19oYW5kbGVyAg1lbV9zZW5kX2ZyYW1lAxBlbV9jb25zb2xlX2RlYnVnBARleGl0BQtlbV90aW1lX25vdwYTZGV2c19kZXBsb3lfaGFuZGxlcgcgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkIIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAkYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3CjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAszZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkDDNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQNNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkDhplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQ8UamRfY3J5cHRvX2dldF9yYW5kb20QD19fd2FzaV9mZF9jbG9zZREVZW1zY3JpcHRlbl9tZW1jcHlfYmlnEg9fX3dhc2lfZmRfd3JpdGUTFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAUC3NldFRlbXBSZXQwFRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxYRX193YXNtX2NhbGxfY3RvcnMXDWZsYXNoX3Byb2dyYW0YC2ZsYXNoX2VyYXNlGQpmbGFzaF9zeW5jGhlpbml0X2RldmljZXNjcmlwdF9tYW5hZ2VyGxRhcHBfZ2V0X2RldmljZV9jbGFzcxwIaHdfcGFuaWMdCGpkX2JsaW5rHgdqZF9nbG93HxRqZF9hbGxvY19zdGFja19jaGVjayAIamRfYWxsb2MhB2pkX2ZyZWUiDXRhcmdldF9pbl9pcnEjEnRhcmdldF9kaXNhYmxlX2lycSQRdGFyZ2V0X2VuYWJsZV9pcnElE2pkX3NldHRpbmdzX2dldF9iaW4mE2pkX3NldHRpbmdzX3NldF9iaW4nEmRldnNfcGFuaWNfaGFuZGxlcigQamRfZW1fc2VuZF9mcmFtZSkaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzIqGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nKwpqZF9lbV9pbml0LA1qZF9lbV9wcm9jZXNzLQVkbWVzZy4UamRfZW1fZnJhbWVfcmVjZWl2ZWQvEWpkX2VtX2RldnNfZGVwbG95MBFqZF9lbV9kZXZzX3ZlcmlmeTEYamRfZW1fZGV2c19jbGllbnRfZGVwbG95Mgxod19kZXZpY2VfaWQzDHRhcmdldF9yZXNldDQOdGltX2dldF9taWNyb3M1EmpkX3RjcHNvY2tfcHJvY2VzczYRYXBwX2luaXRfc2VydmljZXM3EmRldnNfY2xpZW50X2RlcGxveTgUY2xpZW50X2V2ZW50X2hhbmRsZXI5C2FwcF9wcm9jZXNzOgd0eF9pbml0Ow9qZF9wYWNrZXRfcmVhZHk8CnR4X3Byb2Nlc3M9F2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlPg5qZF93ZWJzb2NrX25ldz8Gb25vcGVuQAdvbmVycm9yQQdvbmNsb3NlQglvbm1lc3NhZ2VDEGpkX3dlYnNvY2tfY2xvc2VEHHJvbGVtZ3Jfc2VyaWFsaXplZF9yb2xlX3NpemVFFnJvbGVtZ3Jfc2VyaWFsaXplX3JvbGVGD3JvbGVtZ3JfcHJvY2Vzc0cQcm9sZW1ncl9hdXRvYmluZEgVcm9sZW1ncl9oYW5kbGVfcGFja2V0SRRqZF9yb2xlX21hbmFnZXJfaW5pdEoYcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkSw1qZF9yb2xlX2FsbG9jTBBqZF9yb2xlX2ZyZWVfYWxsTRZqZF9yb2xlX2ZvcmNlX2F1dG9iaW5kThJqZF9yb2xlX2J5X3NlcnZpY2VPE2pkX2NsaWVudF9sb2dfZXZlbnRQE2pkX2NsaWVudF9zdWJzY3JpYmVRFGpkX2NsaWVudF9lbWl0X2V2ZW50UhRyb2xlbWdyX3JvbGVfY2hhbmdlZFMQamRfZGV2aWNlX2xvb2t1cFQYamRfZGV2aWNlX2xvb2t1cF9zZXJ2aWNlVRNqZF9zZXJ2aWNlX3NlbmRfY21kVhFqZF9jbGllbnRfcHJvY2Vzc1cOamRfZGV2aWNlX2ZyZWVYF2pkX2NsaWVudF9oYW5kbGVfcGFja2V0WQ9qZF9kZXZpY2VfYWxsb2NaDmFnZ2J1ZmZlcl9pbml0Ww9hZ2didWZmZXJfZmx1c2hcEGFnZ2J1ZmZlcl91cGxvYWRdDmRldnNfYnVmZmVyX29wXhBkZXZzX3JlYWRfbnVtYmVyXw9kZXZzX2NyZWF0ZV9jdHhgCXNldHVwX2N0eGEKZGV2c190cmFjZWIPZGV2c19lcnJvcl9jb2RlYxlkZXZzX2NsaWVudF9ldmVudF9oYW5kbGVyZAljbGVhcl9jdHhlDWRldnNfZnJlZV9jdHhmDmRldnNfdHJ5X2FsbG9jZwhkZXZzX29vbWgJZGV2c19mcmVlaRdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc2oHdHJ5X3J1bmsMc3RvcF9wcm9ncmFtbBxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0bRxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3dyaXRlbhhkZXZpY2VzY3JpcHRtZ3JfZ2V0X2hhc2hvHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0cA5kZXBsb3lfaGFuZGxlcnETZGVwbG95X21ldGFfaGFuZGxlcnIWZGV2aWNlc2NyaXB0bWdyX2RlcGxveXMUZGV2aWNlc2NyaXB0bWdyX2luaXR0GWRldmljZXNjcmlwdG1ncl9jbGllbnRfZXZ1EWRldnNjbG91ZF9wcm9jZXNzdhdkZXZzY2xvdWRfaGFuZGxlX3BhY2tldHcTZGV2c2Nsb3VkX29uX21ldGhvZHgOZGV2c2Nsb3VkX2luaXR5EGRldnNfZmliZXJfeWllbGR6FmRldnNfZmliZXJfY29weV9wYXJhbXN7GGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnwYZGV2c19maWJlcl9zZXRfd2FrZV90aW1lfRBkZXZzX2ZpYmVyX3NsZWVwfhtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx/GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzgAESZGV2c19maWJlcl9ieV9maWR4gQERZGV2c19maWJlcl9ieV90YWeCARBkZXZzX2ZpYmVyX3N0YXJ0gwEUZGV2c19maWJlcl90ZXJtaWFudGWEAQ5kZXZzX2ZpYmVyX3J1boUBE2RldnNfZmliZXJfc3luY19ub3eGAQpkZXZzX3BhbmljhwEVX2RldnNfcnVudGltZV9mYWlsdXJliAEPZGV2c19maWJlcl9wb2tliQEPamRfZ2NfdHJ5X2FsbG9jigEJdHJ5X2FsbG9jiwEHZGV2c19nY4wBD2ZpbmRfZnJlZV9ibG9ja40BC2pkX2djX3VucGlujgEKamRfZ2NfZnJlZY8BEmRldnNfbWFwX3RyeV9hbGxvY5ABFGRldnNfYXJyYXlfdHJ5X2FsbG9jkQEVZGV2c19idWZmZXJfdHJ5X2FsbG9jkgEPZGV2c19nY19zZXRfY3R4kwEOZGV2c19nY19jcmVhdGWUAQ9kZXZzX2djX2Rlc3Ryb3mVAQRzY2FulgETc2Nhbl9hcnJheV9hbmRfbWFya5cBFGRldnNfamRfZ2V0X3JlZ2lzdGVymAEWZGV2c19qZF9jbGVhcl9wa3Rfa2luZJkBEGRldnNfamRfc2VuZF9jbWSaARNkZXZzX2pkX3NlbmRfbG9nbXNnmwENaGFuZGxlX2xvZ21zZ5wBEmRldnNfamRfc2hvdWxkX3J1bp0BF2RldnNfamRfdXBkYXRlX3JlZ2NhY2hlngETZGV2c19qZF9wcm9jZXNzX3BrdJ8BFGRldnNfamRfcm9sZV9jaGFuZ2VkoAEUZGV2c19qZF9yZXNldF9wYWNrZXShARJkZXZzX2pkX2luaXRfcm9sZXOiARJkZXZzX2pkX2ZyZWVfcm9sZXOjARBkZXZzX3NldF9sb2dnaW5npAEVZGV2c19nZXRfZ2xvYmFsX2ZsYWdzpQEMZGV2c19tYXBfc2V0pgEMZGV2c19tYXBfZ2V0pwEKZGV2c19pbmRleKgBDmRldnNfaW5kZXhfc2V0qQERZGV2c19hcnJheV9pbnNlcnSqARJkZXZzX3JlZ2NhY2hlX2ZyZWWrARZkZXZzX3JlZ2NhY2hlX2ZyZWVfYWxsrAEXZGV2c19yZWdjYWNoZV9tYXJrX3VzZWStARNkZXZzX3JlZ2NhY2hlX2FsbG9jrgEUZGV2c19yZWdjYWNoZV9sb29rdXCvARFkZXZzX3JlZ2NhY2hlX2FnZbABF2RldnNfcmVnY2FjaGVfZnJlZV9yb2xlsQESZGV2c19yZWdjYWNoZV9uZXh0sgEPamRfc2V0dGluZ3NfZ2V0swEPamRfc2V0dGluZ3Nfc2V0tAENY29uc3VtZV9jaHVua7UBDXNoYV8yNTZfY2xvc2W2AQ9qZF9zaGEyNTZfc2V0dXC3ARBqZF9zaGEyNTZfdXBkYXRluAEQamRfc2hhMjU2X2ZpbmlzaLkBFGpkX3NoYTI1Nl9obWFjX3NldHVwugEVamRfc2hhMjU2X2htYWNfZmluaXNouwEOamRfc2hhMjU2X2hrZGa8AQ5kZXZzX3N0cmZvcm1hdL0BHGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2O+AQ90c2FnZ19jbGllbnRfZXa/AQphZGRfc2VyaWVzwAENdHNhZ2dfcHJvY2Vzc8EBCmxvZ19zZXJpZXPCARN0c2FnZ19oYW5kbGVfcGFja2V0wwEUbG9va3VwX29yX2FkZF9zZXJpZXPEAQp0c2FnZ19pbml0xQEMdHNhZ2dfdXBkYXRlxgEWZGV2c192YWx1ZV9mcm9tX2RvdWJsZccBE2RldnNfdmFsdWVfZnJvbV9pbnTIARRkZXZzX3ZhbHVlX2Zyb21fYm9vbMkBF2RldnNfdmFsdWVfZnJvbV9wb2ludGVyygERZGV2c192YWx1ZV90b19pbnTLARRkZXZzX3ZhbHVlX3RvX2RvdWJsZcwBEmRldnNfdmFsdWVfdG9fYm9vbM0BDmRldnNfaXNfYnVmZmVyzgEQZGV2c19idWZmZXJfZGF0Yc8BFGRldnNfdmFsdWVfdG9fZ2Nfb2Jq0AERZGV2c192YWx1ZV90eXBlb2bRAQ9kZXZzX2lzX251bGxpc2jSARJkZXZzX2ltZ19zdHJpZHhfb2vTAQtkZXZzX3ZlcmlmedQBFGRldnNfdm1fZXhlY19vcGNvZGVz1QERZGV2c19pbWdfZ2V0X3V0ZjjWAQ1kZXZzX2dldF91dGY41wEMZXhwcl9pbnZhbGlk2AEQZXhwcnhfbG9hZF9sb2NhbNkBEWV4cHJ4X2xvYWRfZ2xvYmFs2gERZXhwcjNfbG9hZF9idWZmZXLbAQ1leHByeF9saXRlcmFs3AERZXhwcnhfbGl0ZXJhbF9mNjTdAQ1leHByMF9yZXRfdmFs3gEMZXhwcjJfc3RyMGVx3wEXZXhwcjFfcm9sZV9pc19jb25uZWN0ZWTgAQ5leHByMF9wa3Rfc2l6ZeEBEWV4cHIwX3BrdF9ldl9jb2Rl4gEWZXhwcjBfcGt0X3JlZ19nZXRfY29kZeMBCWV4cHIwX25hbuQBCWV4cHIxX2Fic+UBDWV4cHIxX2JpdF9ub3TmAQpleHByMV9jZWls5wELZXhwcjFfZmxvb3LoAQhleHByMV9pZOkBDGV4cHIxX2lzX25hbuoBC2V4cHIxX2xvZ19l6wEJZXhwcjFfbmVn7AEJZXhwcjFfbm907QEMZXhwcjFfcmFuZG9t7gEQZXhwcjFfcmFuZG9tX2ludO8BC2V4cHIxX3JvdW5k8AENZXhwcjFfdG9fYm9vbPEBCWV4cHIyX2FkZPIBDWV4cHIyX2JpdF9hbmTzAQxleHByMl9iaXRfb3L0AQ1leHByMl9iaXRfeG9y9QEJZXhwcjJfZGl29gEIZXhwcjJfZXH3AQpleHByMl9pZGl2+AEKZXhwcjJfaW11bPkBCGV4cHIyX2xl+gEIZXhwcjJfbHT7AQlleHByMl9tYXj8AQlleHByMl9taW79AQlleHByMl9tdWz+AQhleHByMl9uZf8BCWV4cHIyX3Bvd4ACEGV4cHIyX3NoaWZ0X2xlZnSBAhFleHByMl9zaGlmdF9yaWdodIICGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkgwIJZXhwcjJfc3VihAIQZXhwcnhfbG9hZF9wYXJhbYUCDGV4cHIwX25vd19tc4YCFmV4cHIxX2dldF9maWJlcl9oYW5kbGWHAhVleHByMF9wa3RfcmVwb3J0X2NvZGWIAhZleHByMF9wa3RfY29tbWFuZF9jb2RliQIRZXhwcnhfc3RhdGljX3JvbGWKAgxzdG10NF9tZW1zZXSLAhBleHByeDFfZ2V0X2ZpZWxkjAILZXhwcjJfaW5kZXiNAhNleHByMV9vYmplY3RfbGVuZ3RojgIRZXhwcjFfa2V5c19sZW5ndGiPAgxleHByMV90eXBlb2aQAgpleHByMF9udWxskQINZXhwcjFfaXNfbnVsbJICEGV4cHIwX3BrdF9idWZmZXKTAgpleHByMF90cnVllAILZXhwcjBfZmFsc2WVAg9zdG10MV93YWl0X3JvbGWWAg1zdG10MV9zbGVlcF9zlwIOc3RtdDFfc2xlZXBfbXOYAg9zdG10M19xdWVyeV9yZWeZAg5zdG10Ml9zZW5kX2NtZJoCE3N0bXQ0X3F1ZXJ5X2lkeF9yZWebAhFzdG10eDJfbG9nX2Zvcm1hdJwCDXN0bXR4M19mb3JtYXSdAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVyngINc3RtdDJfc2V0X3BrdJ8CCnN0bXQ1X2JsaXSgAgtzdG10eDJfY2FsbKECDnN0bXR4M19jYWxsX2JnogIMc3RtdDFfcmV0dXJuowIJc3RtdHhfam1wpAIMc3RtdHgxX2ptcF96pQILc3RtdDFfcGFuaWOmAhJzdG10eDFfc3RvcmVfbG9jYWynAhNzdG10eDFfc3RvcmVfZ2xvYmFsqAISc3RtdDRfc3RvcmVfYnVmZmVyqQISc3RtdHgxX3N0b3JlX3BhcmFtqgIVc3RtdDFfdGVybWluYXRlX2ZpYmVyqwIPc3RtdDBfYWxsb2NfbWFwrAIRc3RtdDFfYWxsb2NfYXJyYXmtAhJzdG10MV9hbGxvY19idWZmZXKuAhBzdG10eDJfc2V0X2ZpZWxkrwIPc3RtdDNfYXJyYXlfc2V0sAISc3RtdDNfYXJyYXlfaW5zZXJ0sQIVZXhwcnhfc3RhdGljX2Z1bmN0aW9usgIKZXhwcjJfaW1vZLMCDGV4cHIxX3RvX2ludLQCE2V4cHJ4X3N0YXRpY19idWZmZXK1AhtleHByeF9zdGF0aWNfYnVpbHRpbl9zdHJpbme2AhlleHByeF9zdGF0aWNfYXNjaWlfc3RyaW5ntwIYZXhwcnhfc3RhdGljX3V0Zjhfc3RyaW5nuAIPZGV2c192bV9wb3BfYXJnuQITZGV2c192bV9wb3BfYXJnX3UzMroCE2RldnNfdm1fcG9wX2FyZ19pMzK7AhRkZXZzX3ZtX3BvcF9hcmdfZnVuY7wCE2RldnNfdm1fcG9wX2FyZ19mNjS9AhZkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyvgIbZGV2c192bV9wb3BfYXJnX2J1ZmZlcl9kYXRhvwIWZGV2c192bV9wb3BfYXJnX3N0cmlkeMACFGRldnNfdm1fcG9wX2FyZ19yb2xlwQITZGV2c192bV9wb3BfYXJnX21hcMICEmpkX2Flc19jY21fZW5jcnlwdMMCEmpkX2Flc19jY21fZGVjcnlwdMQCDEFFU19pbml0X2N0eMUCD0FFU19FQ0JfZW5jcnlwdMYCEGpkX2Flc19zZXR1cF9rZXnHAg5qZF9hZXNfZW5jcnlwdMgCEGpkX2Flc19jbGVhcl9rZXnJAgtqZF93c3NrX25ld8oCFGpkX3dzc2tfc2VuZF9tZXNzYWdlywITamRfd2Vic29ja19vbl9ldmVudMwCB2RlY3J5cHTNAg1qZF93c3NrX2Nsb3NlzgIQamRfd3Nza19vbl9ldmVudM8CCnNlbmRfZW1wdHnQAhJ3c3NraGVhbHRoX3Byb2Nlc3PRAhdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZdICFHdzc2toZWFsdGhfcmVjb25uZWN00wIYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V01AIPc2V0X2Nvbm5fc3RyaW5n1QIRY2xlYXJfY29ubl9zdHJpbmfWAg93c3NraGVhbHRoX2luaXTXAhN3c3NrX3B1Ymxpc2hfdmFsdWVz2AIQd3Nza19wdWJsaXNoX2JpbtkCEXdzc2tfaXNfY29ubmVjdGVk2gITd3Nza19yZXNwb25kX21ldGhvZNsCD2pkX2N0cmxfcHJvY2Vzc9wCFWpkX2N0cmxfaGFuZGxlX3BhY2tldN0CDGpkX2N0cmxfaW5pdN4CDWpkX2lwaXBlX29wZW7fAhZqZF9pcGlwZV9oYW5kbGVfcGFja2V04AIOamRfaXBpcGVfY2xvc2XhAhJqZF9udW1mbXRfaXNfdmFsaWTiAhVqZF9udW1mbXRfd3JpdGVfZmxvYXTjAhNqZF9udW1mbXRfd3JpdGVfaTMy5AISamRfbnVtZm10X3JlYWRfaTMy5QIUamRfbnVtZm10X3JlYWRfZmxvYXTmAhFqZF9vcGlwZV9vcGVuX2NtZOcCFGpkX29waXBlX29wZW5fcmVwb3J06AIWamRfb3BpcGVfaGFuZGxlX3BhY2tldOkCEWpkX29waXBlX3dyaXRlX2V46gIQamRfb3BpcGVfcHJvY2Vzc+sCFGpkX29waXBlX2NoZWNrX3NwYWNl7AIOamRfb3BpcGVfd3JpdGXtAg5qZF9vcGlwZV9jbG9zZe4CDWpkX3F1ZXVlX3B1c2jvAg5qZF9xdWV1ZV9mcm9udPACDmpkX3F1ZXVlX3NoaWZ08QIOamRfcXVldWVfYWxsb2PyAg1qZF9yZXNwb25kX3U48wIOamRfcmVzcG9uZF91MTb0Ag5qZF9yZXNwb25kX3UzMvUCEWpkX3Jlc3BvbmRfc3RyaW5n9gIXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWT3AgtqZF9zZW5kX3BrdPgCHXNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyX2ZpbmFs+QIXc2VydmljZV9oYW5kbGVfcmVnaXN0ZXL6AhlqZF9zZXJ2aWNlc19oYW5kbGVfcGFja2V0+wIUamRfYXBwX2hhbmRsZV9wYWNrZXT8AhVqZF9hcHBfaGFuZGxlX2NvbW1hbmT9AhNqZF9hbGxvY2F0ZV9zZXJ2aWNl/gIQamRfc2VydmljZXNfaW5pdP8CDmpkX3JlZnJlc2hfbm93gAMZamRfc2VydmljZXNfcGFja2V0X3F1ZXVlZIEDFGpkX3NlcnZpY2VzX2Fubm91bmNlggMXamRfc2VydmljZXNfbmVlZHNfZnJhbWWDAxBqZF9zZXJ2aWNlc190aWNrhAMVamRfcHJvY2Vzc19ldmVyeXRoaW5nhQMaamRfcHJvY2Vzc19ldmVyeXRoaW5nX2NvcmWGAxJhcHBfZ2V0X2Z3X3ZlcnNpb26HAxZhcHBfZ2V0X2Rldl9jbGFzc19uYW1liAMNamRfaGFzaF9mbnYxYYkDDGpkX2RldmljZV9pZIoDCWpkX3JhbmRvbYsDCGpkX2NyYzE2jAMOamRfY29tcHV0ZV9jcmONAw5qZF9zaGlmdF9mcmFtZY4DDmpkX3Jlc2V0X2ZyYW1ljwMQamRfcHVzaF9pbl9mcmFtZZADDWpkX3BhbmljX2NvcmWRAxNqZF9zaG91bGRfc2FtcGxlX21zkgMQamRfc2hvdWxkX3NhbXBsZZMDCWpkX3RvX2hleJQDC2pkX2Zyb21faGV4lQMOamRfYXNzZXJ0X2ZhaWyWAwdqZF9hdG9plwMLamRfdnNwcmludGaYAw9qZF9wcmludF9kb3VibGWZAxJqZF9kZXZpY2Vfc2hvcnRfaWSaAwxqZF9zcHJpbnRmX2GbAwtqZF90b19oZXhfYZwDFGpkX2RldmljZV9zaG9ydF9pZF9hnQMJamRfc3RyZHVwngMOamRfanNvbl9lc2NhcGWfAxNqZF9qc29uX2VzY2FwZV9jb3JloAMJamRfbWVtZHVwoQMWamRfcHJvY2Vzc19ldmVudF9xdWV1ZaIDFmRvX3Byb2Nlc3NfZXZlbnRfcXVldWWjAxFqZF9zZW5kX2V2ZW50X2V4dKQDCmpkX3J4X2luaXSlAxRqZF9yeF9mcmFtZV9yZWNlaXZlZKYDHWpkX3J4X2ZyYW1lX3JlY2VpdmVkX2xvb3BiYWNrpwMPamRfcnhfZ2V0X2ZyYW1lqAMTamRfcnhfcmVsZWFzZV9mcmFtZakDEWpkX3NlbmRfZnJhbWVfcmF3qgMNamRfc2VuZF9mcmFtZasDCmpkX3R4X2luaXSsAwdqZF9zZW5krQMWamRfc2VuZF9mcmFtZV93aXRoX2NyY64DD2pkX3R4X2dldF9mcmFtZa8DEGpkX3R4X2ZyYW1lX3NlbnSwAwtqZF90eF9mbHVzaLEDEF9fZXJybm9fbG9jYXRpb26yAwVkdW1tebMDCF9fbWVtY3B5tAMHbWVtbW92ZbUDBm1lbXNldLYDCl9fbG9ja2ZpbGW3AwxfX3VubG9ja2ZpbGW4AwxfX3N0ZGlvX3NlZWu5Aw1fX3N0ZGlvX3dyaXRlugMNX19zdGRpb19jbG9zZbsDDF9fc3RkaW9fZXhpdLwDCmNsb3NlX2ZpbGW9AwlfX3Rvd3JpdGW+AwlfX2Z3cml0ZXi/AwZmd3JpdGXAAytlbXNjcmlwdGVuX21haW5fdGhyZWFkX3Byb2Nlc3NfcXVldWVkX2NhbGxzwQMUX19wdGhyZWFkX211dGV4X2xvY2vCAxZfX3B0aHJlYWRfbXV0ZXhfdW5sb2NrwwMGX19sb2NrxAMOX19tYXRoX2Rpdnplcm/FAw5fX21hdGhfaW52YWxpZMYDA2xvZ8cDBWxvZzEwyAMHX19sc2Vla8kDBm1lbWNtcMoDCl9fb2ZsX2xvY2vLAwxfX21hdGhfeGZsb3fMAwpmcF9iYXJyaWVyzQMMX19tYXRoX29mbG93zgMMX19tYXRoX3VmbG93zwMEZmFic9ADA3Bvd9EDCGNoZWNraW500gMLc3BlY2lhbGNhc2XTAwVyb3VuZNQDBnN0cmNoctUDC19fc3RyY2hybnVs1gMGc3RyY21w1wMGc3RybGVu2AMSX193YXNpX3N5c2NhbGxfcmV02QMIZGxtYWxsb2PaAwZkbGZyZWXbAxhlbXNjcmlwdGVuX2dldF9oZWFwX3NpemXcAwRzYnJr3QMJX19wb3dpZGYy3gMJc3RhY2tTYXZl3wMMc3RhY2tSZXN0b3Jl4AMKc3RhY2tBbGxvY+EDFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdOIDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWXjAxllbXNjcmlwdGVuX3N0YWNrX2dldF9iYXNl5AMYZW1zY3JpcHRlbl9zdGFja19nZXRfZW5k5QMMZHluQ2FsbF9qaWpp5gMWbGVnYWxzdHViJGR5bkNhbGxfamlqaecDGGxlZ2FsZnVuYyRfX3dhc2lfZmRfc2VlawITAeUDBAAEZnB0cgEBMAIBMQMBMgctAwAPX19zdGFja19wb2ludGVyAQtfX3N0YWNrX2VuZAIMX19zdGFja19iYXNlCRgDAAcucm9kYXRhAQUuZGF0YQIFZW1fanM=';
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
