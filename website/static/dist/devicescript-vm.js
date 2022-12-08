
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
            sock.onopen = () => resolve();
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
    function jacsDeploy(binary) {
        return copyToHeap(binary, ptr => Module._jd_em_devs_deploy(ptr, binary.length));
    }
    Exts.jacsDeploy = jacsDeploy;
    function jacsClientDeploy(binary) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length);
        Module.HEAPU8.set(binary, ptr);
        return Module._jd_em_devs_client_deploy(ptr, binary.length);
    }
    Exts.jacsClientDeploy = jacsClientDeploy;
    function jacsInit() {
        Module._jd_em_init();
    }
    Exts.jacsInit = jacsInit;
    function jacsStart() {
        if (devs_interval)
            return;
        Module.jacsInit();
        devs_interval = setInterval(() => {
            try {
                Module._jd_em_process();
            }
            catch (e) {
                console.error(e);
                jacsStop();
            }
        }, 10);
    }
    Exts.jacsStart = jacsStart;
    function jacsStop() {
        if (devs_interval) {
            clearInterval(devs_interval);
            devs_interval = undefined;
        }
    }
    Exts.jacsStop = jacsStop;
    function jacsSetDeviceId(id0, id1) {
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
    Exts.jacsSetDeviceId = jacsSetDeviceId;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB04GAgAAhYAN/f38AYAJ/fwBgAX8AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAJ/fABgBX9/f39/AGAAAXxgB39/f39/f38Bf2AJf39/f39/f39/AGAGf39/f39/AGADf39/AXxgA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/ApiFgIAAFANlbnYFYWJvcnQABQNlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABgNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAYDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52BGV4aXQAAgNlbnYNZW1fc2VuZF9mcmFtZQACA2VudhBlbV9jb25zb2xlX2RlYnVnAAIDZW52C2VtX3RpbWVfbm93ABIDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADAPMg4CA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lAEgBCAAKQOgAT4CFCAEIQYLIAVBEGokACAGC/gCAQR/IwBBIGsiASQAQe0nIQICQCAAKAIsIgMoAogBQcQAaigCAEEEdiAALwESIgRNDQAgAygCiAEiAiACIAIoAmBqIAIgAigCQGogBEEEdGovAQxBA3RqKAIAaiECCyABIAQ2AgggASACNgIEIAFBuhk2AgBBnx4gARAwAkAgACgCLCICKAKQASAARw0AAkAgAigCjAEiBEUNACACLQAGQQhxDQAgASAELwEAOwEYIAJBxwAgAUEYakECEFkLIAJCADcCjAELAkAgACgCKCICRQ0AA0AgAigCBCEEIAIoAggoAiwhAwJAIAItABVBAXFFDQAgAyACKAIQEGALIAMgAhBgIAQhAiAEDQALCyAAEIgBAkACQAJAIAAoAiwiAygClAEiAiAARw0AIAMgACgCADYClAEMAQsDQCACIgRFDQIgBCgCACICIABHDQALIAQgACgCADYCAAsgAyAAEGAgAUEgaiQADwtBySZBtCBBzgBBnRMQiAMAC60BAQR/IwBBEGsiASQAAkAgACgCLCICLwEIDQAQ7QIgAkEAKQPInwE3A6ABIAAQjAFFDQAgABCIASAAQQA2AhQgAEH//wM7AQ4gAiAANgKQASAAKAIoIgMoAggiBCADNgIoAkAgBCgCLCIELwEIDQAgBCADNgKMAQsCQCACLQAGQQhxDQAgASAAKAIoLwEAOwEIIAJBxgAgAUEIakECEFkLIAIQkQILIAFBEGokAAsSABDtAiAAQQApA8ifATcDoAEL3wIBB38jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAQJAAkAgACgCjAEiAw0AQQAhAwwBCyADLwEAIQMLIAAgAzsBCgJAAkAgAUHg1ANHDQBBvRxBABAwDAELIAIgATYCECACIANB//8DcTYCFEHAHiACQRBqEDALIAAgATsBCCABQeDUA0YNACAAKAKMASIDRQ0AA0AgAy8BACADKAIMIgQoAgBrIQVB7SchBgJAIAAoAogBIgFBxABqKAIAQQR2IAQgASABKAJAaiIHayIIQQR1IgRNDQAgASABIAEoAmBqIAcgCGpBDGovAQBBA3RqKAIAaiEGCyACIAQ2AgggAiAGNgIEIAIgBTYCAEGvHiACEDAgAygCBCIDDQALCwJAIAAoAowBIgFFDQAgAC0ABkEIcQ0AIAIgAS8BADsBGCAAQccAIAJBGGpBAhBZCyAAQgA3AowBIAJBIGokAAsiACABIAJB5AAgAkHkAEsbQeDUA2oQeyAAQQApA8AwNwMAC44BAQR/EO0CIABBACkDyJ8BNwOgAQNAQQAhAQJAIAAvAQgNACAAKAKUASIBRSECAkAgAUUNACAAKAKgASEDAkACQCABKAIUIgRFDQAgBCADTQ0BCwNAIAEoAgAiAUUhAiABRQ0CIAEoAhQiBEUNACAEIANLDQALCyAAEJABIAEQeQsgAkEBcyEBCyABDQALC3gBB39BACEBQQAoAuw7QX9qIQIDQAJAIAEgAkwNAEEADwsCQAJAQeA4IAIgAWpBAm0iA0EMbGoiBCgCBCIFIABPDQBBASEGIANBAWohAQwBC0EAIQYCQCAFIABLDQAgBCEHDAELIANBf2ohAkEBIQYLIAYNAAsgBwu3CAIJfwF8AkACQAJAAkACQAJAIAFBf2oOEAABBAQEBAQEBAQEBAQEBAIDCyACLQAQQQJJDQNBACgC7DtBf2ohBEEBIQUDQCACIAVBDGxqQSRqIgYoAgAhB0EAIQEgBCEIAkADQAJAIAEgCEwNAEEAIQkMAgsCQAJAQeA4IAggAWpBAm0iA0EMbGoiCigCBCILIAdPDQBBASEMIANBAWohAQwBC0EAIQwCQCALIAdLDQAgCiEJDAELIANBf2ohCEEBIQwLIAwNAAsLAkAgCUUNACAAIAYQgAEaCyAFQQFqIgUgAi0AEEkNAAwECwALIAJFDQMgACgCJCIBRQ0CQQAhAwNAIAEiCCgCACEBAkAgCCgCBCIMDQAgCCEDIAENAQwECwJAIAxBACAMLQAEa0EMbGpBXGogAkYNACAIIQMgAQ0BDAQLAkACQCADDQAgACABNgIkDAELIAMgATYCAAsgCCgCDBAbIAgQGyABDQAMAwsACyADLwEOQYEiRw0BIAMtAANBAXENAUEAKALsO0F/aiEIIAIoAgAhC0EAIQECQANAAkAgASAITA0AQQAhBQwCCwJAAkBB4DggCCABakECbSIHQQxsaiIJKAIEIgogC08NAEEBIQwgB0EBaiEBDAELQQAhDAJAIAogC0sNACAJIQUMAQsgB0F/aiEIQQEhDAsgDA0ACwsgBUUNASAAKAIkIgFFDQEgA0EQaiEMA0ACQCABKAIEIAJHDQACQCABLQAJIghFDQAgASAIQX9qOgAJCwJAIAwgAy0ADCAFLwEIEJMCIg29Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASANOQMYIAFBADYCICABQThqIA05AwAgAUEwaiANOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEHAkACQEEAKALQnwEiCyABQcQAaigCACIIa0EASA0AIAFBKGoiCyABKwMYIAggB2u4oiALKwMAoDkDAAwBCyABQShqIgggASsDGCALIAdruKIgCCsDAKA5AwAgCyEICyABIAg2AhQCQCABQThqKwMAIA1jRQ0AIAEgDTkDOAsCQCABQTBqKwMAIA1kRQ0AIAEgDTkDMAsgASANOQMYCyAAKAIIIghFDQAgAEEAKALQnwEgCGo2AhwLIAEoAgAiAQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNAANAAkACQCABKAIMIggNAEEAIQwMAQsgCCADKAIEEMwDRSEMCwJAAkACQCABKAIEIAJHDQAgDA0CIAgQGyADKAIEEJADIQgMAQsgDEUNASAIEBtBACEICyABIAg2AgwLIAEoAgAiAQ0ACwsPC0G0KEHqIkGVAkHmCRCIAwALuQEBA39ByAAQGiICQf8BOgAKIAIgATYCBCACIAAoAiQ2AgAgACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoAtCfASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQSiIARQ0AIAIgACgCBBCQAzYCDAsgAkH6HBCCASACC+gGAgh/AnwjAEEQayIBJAACQAJAIAAoAghFDQBBACgC0J8BIAAoAhxrQQBODQELAkAgAEEYakGAwLgCEIUDRQ0AAkAgACgCJCICRQ0AA0ACQCACLQAJIAItAAhHDQAgAkEAOgAJCyACIAItAAk6AAggAigCACICDQALCyAAKAIoIgJFDQACQCACIAAoAgwiA08NACAAIAJB0A9qNgIoCyAAKAIoIANNDQAgACADNgIoCwJA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AhCuAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahBnOQMgIAMgBCkDADcDCCACQShqIANBCGoQZyIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhBkIANBIGokAAuQAgIFfwJ8IwBBIGsiAyQAIANBGGogAhCuAiACQRhqIgQgAykDGDcDACADQRhqIAIQrgIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQZzkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQZzkDAEGwMCEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBCAFIAIbIQcLIAAgBykDADcDACADQSBqJAALkAICBX8CfCMAQSBrIgMkACADQRhqIAIQrgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEK4CIAIgAykDGDcDECACQRBqIQUCQAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAUpAwA3AxAgAiADQRBqEGc5AyAgAyAEKQMANwMIIAJBKGoiBiADQQhqEGc5AwBBsDAhByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAUgBCACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC8YBAwN/AX4BfCMAQSBrIgMkACADQRhqIAIQrgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEK4CIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACNAIQIAI0Ahh+IgZCIIinIAanIgVBH3VHDQAgACAFEGMMAQsgAyACQRBqKQMANwMQIAIgA0EQahBnOQMgIAMgBCkDADcDCCACQShqIANBCGoQZyIHOQMAIAAgByACKwMgohBiCyADQSBqJAALtgECAn8BfCMAQSBrIgMk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ACAAKAIIIAEQcgsLJgECfyABEK8CIQIgARCvAiEDIAEgARC2AiADQYAgciACQQAQhwELFwEBfyABEK8CIQIgASABELYCIAIQiQELKQEDfyABELUCIQIgARCvAiEDIAEQrwIhBCABIAEQtgIgBCADIAIQhwELeAEFfyMAQRBrIgIkACABELUCIQMgARCvAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgYgACgCDC8BCCIASw0AIAYgBGogAE0NAQsgAkEIaiAFQfEAEHwMAQsgASADIAYgBBCKAQsgAkEQaiQAC7cBAQd/IwBBEGsiAiQAIAEQrwIhAyABIAJBBGoQtAIhBCABEK8CIQUCQCADQewBSw0AIAAoAggoAiwiBi8BCA0AAkACQCAFQRBLDQAgASgCNCIHIAAoAgwvAQgiCEsNACAHIAVqIAhNDQELIAJBCGogBkHxABB8DAELIAFBzAFqIQEgASAEIAIoAgQgASADakEEakHsASADayAAIAdBA3RqQRhqIAVBABBWIANqOgAACyACQRBqJAALTgECfyMAQRBrIgIkAAJAAkAgARCvAiIDQe0BSQ0AIAJBCGogAUHzABB8DAELIAFBzAFqIAM6AAAgAUHQAWpBACADEKsDGgsgAkEQaiQAC1sBBH8jAEEQayICJAAgARCvAiEDIAEgAkEMahC0AiEEAkAgAUHMAWotAAAgA2siBUEBSA0AIAEgA2pB0AFqIAQgAigCDCIBIAUgASAFSRsQqQMaCyACQRBqJAALlgEBB38jAEEQayICJAAgARCvAiEDIAEQrwIhBCABIAJBDGoQtAIhBSABEK8CIQYgASACQQhqELQCIQcCQCACKAIMIgEgBE0NACACIAEgBGsiATYCDCACKAIIIgggBk0NACACIAggBmsiCDYCCCAHIAZqIAUgBGogCCABIAMgASADSRsiASAIIAFJGxCpAxoLIAJBEGokAAuDAQEFfyMAQRBrIgIkACABELECIQMgARCvAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgEgACgCDC8BCCIGSw0AIAEgBGogBk0NAQsgAkEIaiAFQfEAEHwMAQsgACgCCCADIAAgAUEDdGpBGGogBBBwCyACQRBqJAALvwEBB38jAEEQayICJAAgARCvAiED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AEUNASACQQFqIgIgA0cNAAsgAyECCyACQQFqIgIgA08NBCABQRBqIQEgASADIAJrIgNBA3YgA0F4cSIDQQFyEBogASACaiADEKkDIgIgACgCCCgCABEGACEBIAIQGyABRQ0EQfkdQQAQMA8LIAFBEGogAS0ADCAAKAIIKAIEEQMARQ0DQdwdQQAQMA8LIAEtAAwiAkEISQ0CIAEoAhAgAUEUaigCACACQQN2QX9qIAFBGGogACgCCCgCFBEJABoPCyACQYAjRg0CCyABENUCGgsPCyABIAAoAggoAgwRCABB/wFxENECGgtWAQR/QQAoAtScASEEIAAQzQMiBSACQQN0IgZqQQVqIgcQGiICIAE2AAAgAkEEaiAAIAVBAWoiARCpAyABaiADIAYQqQMaIARBgQEgAiAHEJkDIAIQGwsaAQF/Qew1EOsCIgEgADYCCEEAIAE2AtScAQs9AQF/AkAgAS0AMiICDQAgACABQewAEHwPCyABIAJBf2oiAjoAMiAAIAEgAkH/AXFBA3RqQThqKQMANwMAC2YBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABB8DAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABEGYhACABQRBqJAAgAAtmAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQfAwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARBmIQAgAUEQaiQAIAALgAEBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABB8DAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYaAwP8HRw0AIAEoAgghAAwBCyABIABBiAEQfEEAIQALIAFBEGokACAAC2gCAn8BfCMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHwMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQZyEDIAFBEGokACADC5IBAQJ/IwBBIGsiAiQAAkACQCABLQAyIgMNACACQRhqIAFB7AAQfAwBCyABIANBf2oi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BEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LQfgfQcoBQZAoEIMDAAtBgICAgHghAQsgAQudAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPkCtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAws5AQF/QcW78oh4IQICQCABRQ0AA0AgAiAALQAAc0GTg4AIbCECIABBAWohACABQX9qIgENAAsLIAILBAAQNAtOAQF/AkBBACgC1J8BIgANAEEAIABBk4OACGxBDXM2AtSfAQtBAEEAKALUnwEiAEENdCAAcyIAQRF2IABzIgBBBXQgAHMiADYC1J8BIAALagEBf0H//wMhAgJAIAFFDQBB//8DIQIDQCACQf//A3EiAkEIdCAALQAAIAJBCHZzIgJB8AFxQQR2IAJzQf8BcSICciACQQx0cyACQQV0cyECIABBAWohACABQX9qIgENAAsLIAJB//8DcQttAQN/IABBAmohASAALQACQQpqIQJB//8DIQMDQCADQf//A3EiA0EIdCABLQAAIANBCHZzIgNB8AFxQQR2IANzQf8BcSIDciADQQx0cyADQQV0cyEDIAFBAWohASACQX9qIgINAAsgACADOwEAC+EBAQd/QQAhAQJAIAAtAAwiAkEHakH8A3EiAyAALQACIgRPDQACQCAAQQxqIgUgAkEEaiIGai0AAEH/AUcNACACIABqQRFqLQAAIgMgBE8NASAGIANPDQELIAAgAC0AA0H9AXE6AAMgACADakEMaiICLQAAIgZBBGoiByADaiAESw0AQQAhAQNAIAUgAigCADYCACAFQQRqIQUgAkEEaiECIAEgBkkhBCABQQRqIQEgBA0ACyAAQQxqIgUgB2pB/wE6AAAgBiAFakEFaiAGQQdqQfwBcSADajoAAEEBIQELIAELCQAgAEEAOgACC5EBAQJ/AkACQCABQYACTw0AIAJBgIAETw0BQQAhBAJAIANBBGpB7AEgAC0AAiIFa0sNACAAIAVqQQxqIgQgAjoAAiAEIAE6AAEgBCADOgAAIAQgAkEIdjoAAyAAIAUgA0EHakH8AXFqOgACIARBBGohBAsgBA8LQZAiQYEBQeQaEIMDAAtBkCJBgwFB5BoQgwMACywBAX8jAEEQayIDJAAgAyACNgIIIAMgATYCBCADIAA2AgBB4Q8gAxAwEBYAC0kBA38CQCAAKAIAIgJBACgC0J8BayIDQX9KDQAgACACIAFqIgI2AgAgAkEAKALQnwEiBGtBf0oNACAAIAQgAWo2AgALIANBH3YLSQEDfwJAIAAoAgAiAkEAKAKImAFrIgNBf0oNACAAIAIgAWoiAjYCACACQQAoAoiYASIEa0F/Sg0AIAAgBCABajYCAAsgA0EfdgtkAQN/AkAgAkUNAEEAIQMDQCAAIANBAXRqIgQgASADaiIFLQAAQQR2QcUXai0AADoAACAEQQFqIAUtAABBD3FBxRdqLQAAOgAAIANBAWoiAyACRw0ACwsgACACQQF0akEAOgAAC50CAQd/IAAhAgJAIAEtAAAiA0UNACADRSEEQQAhBSAAIQIDQAJAAkAgA0FQakH/AXFBCUsiBg0AIANBGHRBGHVBUGohBwwBC0F/IQcgA0EgciIIQZ9/akH/AXFBBUsNACAIQRh0QRh1Qal/aiEHCwJAIAdBf0cNACABLQABIgNFIQQgAUEBaiEBIAMNAQwCCyAEQQFxDQECQAJAIAYNACADQRh0QRh1QVBqIQcMAQtBfyEHIANBIHIiA0Gff2pB/wFxQQVLDQAgA0EYdEEYdUGpf2ohBwsgAUEBaiEBAkACQCAFDQAgB0EEdEGAAnIhBQwBCyACIAcgBXI6AAAgAkEBaiECQQAhBQsgAS0AACIDRSEEIAMNAAsLIAIgAGsLMwEBfyMAQRBrIgQkACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBBvA8gBBAwEBYAC1UBA38gACAALQAAIgFBLUZqIQJBACEAA0AgAEEKbCACLAAAIgNqQVBqIAAgA0FQakH/AXFBCkkiAxshACACQQFqIQIgAw0AC0EAIABrIAAgAUEtRhsLlQkBCn8jAEHAAGsiBCQAIAAgAWohBSAEQQFyIQYgBEECciEHIABBAEchCCACIQkgACEKA0AgAkEBaiELAkACQAJAIAItAAAiAUElRg0AIAFFDQAgCyECDAELAkAgCSALRg0AIAlBf3MgC2ohDAJAIAUgCmsiDUEBSA0AIAogCSAMIA1Bf2ogDSAMShsiDRCpAyANakEAOgAACyAKIAxqIQoLAkAgAQ0AQQAhASALIQIMAgtBACEBAkAgCy0AAEEtRw0AIAJBAmogCyACLQACQfMARiICGyELIAIgCHEhAQsgCywAACECIARBADoAAQJAAkACQAJAAkACQAJAAkACQAJAIAJBW2oOVAcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAMICAgICAgICAgIAAEIBQgICAgICAgICAQICAYIAggIAwgLIAQgAygCADoAACADQQRqIQMMCAsgBCEJAkAgAygCACICQX9KDQAgBEEtOgAAQQAgAmshAiAGIQkLIANBBGohAyAJIQEDQCABIAIgAkEKbiIMQQpsa0EwcjoAACABQQFqIQEgAkEJSyENIAwhAiANDQALIAFBADoAACAJIAkQzQNqQX9qIgIgCU0NBwNAIAktAAAhASAJIAItAAA6AAAgAiABOgAAIAlBAWoiCSACQX9qIgJJDQAMCAsACyADKAIAIQIgBCEBA0AgASACIAJBCm4iCUEKbGtBMHI6AAAgAUEBaiEBIAJBCUshDCAJIQIgDA0ACyABQQA6AAAgA0EEaiEDIAQhAiAEIAQQzQNqQX9qIgEgBE0NBgNAIAItAAAhCSACIAEtAAA6AAAgASAJOgAAIAJBAWoiAiABQX9qIgFJDQAMBwsACyAEQbDwATsBACADKAIAIQ1BHCEJQQAhAQNAAkACQCANIAkiAnZBD3EiCQ0AIAJFDQBBACEMIAFFDQELIAcgAWogCUE3aiAJQTByIAlBCUsbOgAAIAFBAWohDAsgAkF8aiEJIAwhASACDQALIAcgDGpBADoAACADQQRqIQMMBQsgBEGw8AE7AQAgAygCACENQRwhCUEAIQEDQAJAAkAgDSAJIgJ2QQ9xIgkNACACRQ0AQQAhDCABRQ0BCyAHIAFqIAlBN2ogCUEwciAJQQlLGzoAACABQQFqIQwLIAJBfGohCSAMIQEgAg0ACyAHIAxqQQA6AAAgA0EEaiEDDAQLIAQgA0EHakF4cSICKwMAQQgQiwMgAkEIaiEDDAMLIAMoAgAiAkHLLSACGyIJEM0DIQICQCAFIAprIgxBAUgNACAKIAkgAiAMQX9qIAwgAkobIgwQqQMgDGpBADoAAAsgA0EEaiEDIARBADoAACAKIAJqIQogAUUNAiAJEBsMAgsgBCACOgAADAELIARBPzoAAAsgBBDNAyECAkAgBSAKayIBQQFIDQAgCiAEIAIgAUF/aiABIAJKGyIBEKkDIAFqQQA6AAALIAogAmohCiALQQFqIgIhCQtBASEBCyABDQALIARBwABqJAAgCiAAa0EBagubBwMCfgh/AXwCQCABRAAAAAAAAAAAY0UNACAAQS06AAAgAEEBaiEAIAGaIQELAkAgAb1C////////////AIMiA0KBgICAgICA+P8AVA0AIABBzsK5AjYAAA8LAkAgA0KAgICAgICA+P8AUg0AIABB6dyZAzYAAA8LAkAgAUSwym5H7YkQAGNFDQAgAEEwOwAADwsgAkEEIAJBBEobIgVBD0khBiABRI3ttaD3xrA+YyEHAkACQCABEL0DIg2ZRAAAAAAAAOBBY0UNACANqiECDAELQYCAgIB4IQILIAVBDyAGGyEIAkACQCAHDQAgAURQ7+LW5BpLRGQNACACIQlBASECDAELAkAgAkF/Sg0AQQAhCSABRAAAAAAAACRAQQAgAmsQ0wOiIQEMAQsgAUQAAAAAAAAkQCACENMDoyEBQQAhCQsCQAJAIAkgCEgNACABRAAAAAAAACRAIAkgCGtBAWoiChDTA6NEAAAAAAAA4D+gIQEMAQsgAUQAAAAAAAAkQCAIIAlBf3NqENMDokQAAAAAAADgP6AhAUEAIQoLIAlBf0ohBQJAAkAgAUQAAAAAAADwQ2MgAUQAAAAAAAAAAGZxRQ0AIAGxIQMMAQtCACEDCwJAIAUNACAAQbDcADsAACAAQQJqIQUCQCAJQX9HDQAgBSEADAELIAVBMCAJQX9zEKsDGiAAIAlrQQFqIQALIAlBAWohCyAIIQUCQANAIAAhBgJAIAVBAU4NACAGIQAMAgtBMCEAAkAgAyAFQX9qIgVBA3RBgDxqKQMAIgRUDQADQCAAQQFqIQAgAyAEfSIDIARaDQALCyAGIAA6AAAgBkEBaiEAAkAgA1AgCCAFayIMIAlKcSIHQQFGDQAgDCALRw0AIAZBLjoAASAGQQJqIQALIAdFDQALCwJAIApBAUgNACAAQTAgChCrAyAKaiEACwJAAkAgAkEBRg0AIABB5QA6AAACQAJAIAJBAU4NACAAQQFqIQUMAQsgAEErOgABIABBAmohBQsCQCACQX9KDQAgBUEtOgAAQQAgAmshAiAFQQFqIQULIAUhAANAIAAgAiACQQpuIgZBCmxrQTByOgAAIABBAWohACACQQlLIQcgBiECIAcNAAsgAEEAOgAAIAUgBRDNA2pBf2oiACAFTQ0BA0AgBS0AACECIAUgAC0AADoAACAAIAI6AAAgBUEBaiIFIABBf2oiAEkNAAwCCwALIABBADoAAAsLpgEBBH8jAEEQayICIAE3AwhBCCEDQcW78oh4IQQgAkEIaiECA0AgBEGTg4AIbCIFIAItAABzIQQgAkEBaiECIANBf2oiAw0ACyAAQQA6AAQgACAEQf////8DcSICQeg0bkEKcEEwcjoAAyAAIAJBpAVuQQpwQTByOgACIAAgAiAFQR52cyICQRpuIgRBGnBBwQBqOgABIAAgAiAEQRpsa0HBAGo6AAALSQECfyMAQRBrIgIkACACIAE2AgQgAiABNgIMIAIgATYCCEEAQQAgACABEIoDIgEQGiIDIAEgACACKAIIEIoDGiACQRBqJAAgAwtxAQV/IAFBAXQiAkEBchAaIQMCQCABRQ0AQQAhBANAIAMgBEEBdGoiBSAAIARqIgYtAABBBHZBxRdqLQAAOgAAIAVBAWogBi0AAEEPcUHFF2otAAA6AAAgBEEBaiIEIAFHDQALCyADIAJqQQA6AAAgAwu5AQEGfyMAQRBrIgEkAEEFEBohAiABIAA3AwhBCCEDQcW78oh4IQQgAUEIaiEFA0AgBEGTg4AIbCIGIAUtAABzIQQgBUEBaiEFIANBf2oiAw0ACyACQQA6AAQgAiAEQf////8DcSIFQeg0bkEKcEEwcjoAAyACIAVBpAVuQQpwQTByOgACIAIgBSAGQR52cyIFQRpuIgRBGnBBwQBqOgABIAIgBSAEQRpsa0HBAGo6AAAgAUEQaiQAIAILwwEBBX8jAEEQayIBJABBACECIAFBADYCDCABQgA3AgQgASAANgIAAkACQCAADQBBASECDAELIAAhA0EAIQQDQCADEM0DIAJqIQIgASAEQQFqIgRBAnRqKAIAIgMNAAsgAkEBaiECCyACEBohBUEAIQICQCAARQ0AQQAhAkEAIQMDQCAFIAJqIAAgABDNAyIEEKkDGiAEIAJqIQIgASADQQFqIgNBAnRqKAIAIgANAAsLIAUgAmpBADoAACABQRBqJAAgBQsbAQF/IAAgASAAIAFBABCSAxAaIgIQkgMaIAILgwMBBX9BACEDQQAhBAJAIAJFDQAgAkEiOgAAIAJBAWohBAtBASEFAkAgAUUNAANAQQEhAgJAAkACQAJAAkACQCAAIANqLQAAIgZBGHRBGHUiB0F3ag4aAwEEBAIEBAQEBAQEBAQEBAQEBAQEBAQEBAUACyAHQdwARw0DQQEhAgwEC0HuACEHQQEhAgwDC0HyACEHQQEhAgwCC0H0ACEHQQEhAgwBCwJAIAdBIEgNACAFQQFqIQVBACECAkAgBA0AQQAhBAwCCyAEIAc6AAAgBEEBaiEEDAELIAVBBmohBQJAIAQNAEEAIQRBACECDAELQQAhAiAEQQA6AAYgBEHc6sGBAzYAACAEIAZBD3FBxRdqLQAAOgAFIAQgBkEEdkHFF2otAAA6AAQgBEEGaiEECwJAIAJFDQAgBUECaiEFAkAgBA0AQQAhBAwBCyAEIAc6AAEgBEHcADoAACAEQQJqIQQLIANBAWoiAyABRw0ACwsCQCAERQ0AIARBIjsAAAsgBUECagsZAAJAIAENAEEBEBoPCyABEBogACABEKkDCwIAC6YBAQJ/IwBBEGsiAiQAAkACQAJAAkACQAJAAkAgAS8BDiIDQYBdag4HAQMFBQMCBAALAkACQAJAIANB/35qDgIBAgALIAMNBhDvAgwHC0H8ABAXDAYLEDUACyABEPUCENQCGgwECyABEPQCENQCGgwDCyABEBUQ0wIaDAILIAIQNjcDCEEAIAEvAQ4gAkEIakEIEKIDGgwBCyABENUCGgsgAkEQaiQACwkAQfg8EOsCGgsSAAJAQQAoAtyfAUUNABCYAwsLyAMBBX8CQEEALwHgnwEiAEUNAEEAKALYnwEiASECA0AgAkEIaiEDA0ACQAJAAkAgAi0ABSIEQf8BRw0AIAIgAUcNAUEAIAAgAS0ABEEDakH8A3FBCGoiBGsiADsB4J8BIABB//8DcUEESQ0CIAEgBGohBCAAQfz/A3FBAnYhAANAIAEgBCgCADYCACABQQRqIQEgBEEEaiEEIABBf2oiAA0ADAMLAAtBACgCiJgBIAIoAgBrQQBIDQAgBEH/AHEgAi8BBiADIAItAAQQogMNBAJAAkAgAiwABSIBQX9KDQACQCACQQAoAtifASIBRg0AQf8BIQEMAgtBAEEALwHgnwEgAS0ABEEDakH8A3FBCGoiBGsiADsB4J8BIABB//8DcUEESQ0DIAEgBGohBCAAQfz/A3FBAnYhAANAIAEgBCgCADYCACABQQRqIQEgBEEEaiEEIABBf2oiAA0ADAQLAAsgAiACKAIAQdCGA2o2AgAgAUGAf3IhAQsgAiABOgAFCyACLQAEQQNqQfwDcSACakEIaiICQQAoAtifASIBa0EALwHgnwEiAEgNAgwDCyACQQAoAtifASIBa0EALwHgnwEiAEgNAAsLCwuTAwEJfwJAAkAQHA0AIAFBgAJPDQFBAEEALQDinwFBAWoiBDoA4p8BIAAtAAQgBEEIdCABQf8BcXJBgIB+ciIFQf//A3EgAiADEKIDGgJAQQAoAtifAQ0AQYABEBohAUEAQfoANgLcnwFBACABNgLYnwELAkAgA0EIaiIGQYABSg0AAkBBgAFBAC8B4J8BIgdrIAZODQBBACgC2J8BIgggCC0ABEEDakH8A3FBCGoiCWohCgNAAkAgByAJayIHQf//A3EiC0EESQ0AIAdB/P8DcUECdiEMIAohASAIIQQDQCAEIAEoAgA2AgAgBEEEaiEEIAFBBGohASAMQX9qIgwNAAsLQYABIAtrIAZIDQALQQAgBzsB4J8BC0EAKALYnwEgB0H//wNxaiIBIAU7AQYgASADOgAEIAEgAC0ABDoABSABQQhqIAIgAxCpAxogAUEAKAKImAFBoJwBajYCAEEAIAcgAS0ABEEDakH8A3FqQQhqOwHgnwELDwtBzCNB4QBBnQoQgwMAC0HMI0EjQYQcEIMDAAsbAAJAQQAoAuSfAQ0AQQBBgAQQ5QI2AuSfAQsLNgEBf0EAIQECQCAARQ0AIAAQ8AJFDQAgACAALQADQb8BcToAA0EAKALknwEgABDiAiEBCyABCzYBAX9BACEBAkAgAEUNACAAEPACRQ0AIAAgAC0AA0HAAHI6AANBACgC5J8BIAAQ4gIhAQsgAQsMAEEAKALknwEQ4wILDABBACgC5J8BEOQCCzUBAX8CQEEAKALonwEgABDiAiIBRQ0AQYgXQQAQMAsCQCAAEJwDRQ0AQfYWQQAQMAsQKSABCzUBAX8CQEEAKALonwEgABDiAiIBRQ0AQYgXQQAQMAsCQCAAEJwDRQ0AQfYWQQAQMAsQKSABCxsAAkBBACgC6J8BDQBBAEGABBDlAjYC6J8BCwuIAQEBfwJAAkACQBAcDQACQEHwnwEgACABIAMQggMiBA0AEKMDQfCfARCBA0HwnwEgACABIAMQggMiBEUNAgsCQCADRQ0AIAJFDQMgBCACIAMQqQMaC0EADwtBpiNB0gBB6RsQgwMAC0G9JkGmI0HaAEHpGxCIAwALQfgmQaYjQeIAQekbEIgDAAtEAEEAEPwCNwL0nwFB8J8BEP8CAkBBACgC6J8BQfCfARDiAkUNAEGIF0EAEDALAkBB8J8BEJwDRQ0AQfYWQQAQMAsQKQtGAQJ/QQAhAAJAQQAtAOyfAQ0AAkBBACgC6J8BEOMCIgFFDQBBAEEBOgDsnwEgASEACyAADwtB6xZBpiNB9ABB1BoQiAMAC0UAAkBBAC0A7J8BRQ0AQQAoAuifARDkAkEAQQA6AOyfAQJAQQAoAuifARDjAkUNABApCw8LQewWQaYjQZwBQZ8LEIgDAAsxAAJAEBwNAAJAQQAtAPKfAUUNABCjAxDuAkHwnwEQgQMLDwtBpiNBqQFB9hUQgwMACwYAQeyhAQsEACAAC48EAQN/AkAgAkGABEkNACAAIAEgAhAPGiAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwALAkAgA0EETw0AIAAhAgwBCwJAIANBfGoiBCAATw0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAv3AgECfwJAIAAgAUYNAAJAIAEgACACaiIDa0EAIAJBAXRrSw0AIAAgASACEKkDDwsgASAAc0EDcSEEAkACQAJAIAAgAU8NAAJAIARFDQAgACEDDAMLAkAgAEEDcQ0AIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcUUNAgwACwALAkAgBA0AAkAgA0EDcUUNAANAIAJFDQUgACACQX9qIgJqIgMgASACai0AADoAACADQQNxDQALCyACQQNNDQADQCAAIAJBfGoiAmogASACaigCADYCACACQQNLDQALCyACRQ0CA0AgACACQX9qIgJqIAEgAmotAAA6AAAgAg0ADAMLAAsgAkEDTQ0AA0AgAyABKAIANgIAIAFBBGohASADQQRqIQMgAkF8aiICQQNLDQALCyACRQ0AA0AgAyABLQAAOgAAIANBAWohAyABQQFqIQEgAkF/aiICDQALCyAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACACIABqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACwQAQQELAgALDgAgACgCPCABIAIQvgML2AIBB38jAEEgayIDJAAgAyAA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DQALC0QAAAAAAADwPyACoyACIAFBAEgbCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEGApsECJAJB+KUBQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABENAAskAQF+IAAgASACrSADrUIghoQgBBDbAyEFIAVCIIinEBIgBacLEwAgACABpyABQiCIpyACIAMQEwsLlIyBgAADAEGACAvUhwFqYWNkYWMtcG9zaXggZGV2aWNlADAuMC4wAGh1bWlkaXR5AGFjaWRpdHkAIWZyYW1lLT5wYXJhbXNfaXNfY29weQBkZXZzX3ZlcmlmeQBmbGV4AGFpclF1YWxpdHlJbmRleAB1dkluZGV4AGpkX29waXBlX3dyaXRlX2V4AFdTU0stSDogc2VuZCBjb21wcmVzc2VkOiBjbWQ9JXgAJS1zOiV4AHZlcmlmaWNhdGlvbiBmYWlsdXJlOiAlZCBhdCAleABXU1NLLUg6IHVua25vd24gY21kICV4AGpkX3dzc2tfbmV3AHRzYWdnX2NsaWVudF9ldgBXU1NLLUg6IG1ldGhvZDogJyVzJyByaWQ9JXUgbnVtdmFscz0ldQBqZF9zZW5kX2V2ZW50X2V4dABsb2NhbGhvc3QAc3RvcF9saXN0AGF1dGggdG9vIHNob3J0AGRldnNfZmliZXJfc3RhcnQAamRfYWVzX2NjbV9lbmNyeXB0AGpkX2NsaWVudF9lbWl0X2V2ZW50AGpkX3dlYnNvY2tfb25fZXZlbnQAamRfdHhfZnJhbWVfc2VudABkY0N1cnJlbnRNZWFzdXJlbWVudABkY1ZvbHRhZ2VNZWFzdXJlbWVudABkZXZpY2VzY3JpcHRtZ3JfaW5pdAByZWZsZWN0ZWRMaWdodABqZF9xdWV1ZV9zaGlmdAB0YXJnZXQgcmVzZXQAISBzZW5zb3Igd2F0Y2hkb2cgcmVzZXQAY2xvdWQgd2F0Y2hkb2cgcmVzZXQAZGV2c19tYXBfc2V0AGpkX2NsaWVudF9oYW5kbGVfcGFja2V0AHJvbGVtZ3JfaGFuZGxlX3BhY2tldABqZF9vcGlwZV9oYW5kbGVfcGFja2V0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAamRfb3BpcGVfcHJvY2VzcwBjb21wYXNzAGRldnNfZmliZXJfY29weV9wYXJhbXMAYWdnYnVmOiB1cGxvYWRlZCAlZCBieXRlcwBhZ2didWY6IGZhaWxlZCB0byB1cGxvYWQgJWQgYnl0ZXMAZGV2cy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAcm90YXJ5RW5jb2RlcgBmcmVlX2ZpYmVyAGpkX3NoYTI1Nl9zZXR1cAAhc3dlZXAAZGV2c192bV9wb3BfYXJnX21hcABzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AcmUtcnVuAGJ1dHRvbgBtb3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgB1bnBpbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAHNjYW4AZmxhc2hfcHJvZ3JhbQBqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgAwMTIzNDU2Nzg5YWJjZGVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAHVwdGltZQBqZF90eF9nZXRfZnJhbWUAamRfcHVzaF9pbl9mcmFtZQB3ZWlnaHRTY2FsZQByYWluR2F1Z2UAamRfd3Nza19zZW5kX21lc3NhZ2UAamRfZGV2aWNlX2ZyZWUAZGlzdGFuY2UAaWxsdW1pbmFuY2UAamRfYWxsb2NhdGVfc2VydmljZQByb2xlbWdyX2F1dG9iaW5kAGpkX3NlbmQAYmxvY2sgPCBjaHVuay0+ZW5kAG5leHRfZXZlbnRfY21kAGRldnNfamRfc2VuZF9jbWQAcm9sZW1ncl9kZXZpY2VfZGVzdHJveWVkAFJFU1RBUlQgcmVxdWVzdGVkAFdTOiB3ZWJzb2NrZXRzIG5vdCBzdXBwb3J0ZWQAV1M6IGNvbm5lY3RlZABjcmVhdGVkAHVwbG9hZCBmYWlsZWQAIXN0YXRlLT5sb2NrZWQAcm9sZW1ncl9yb2xlX2NoYW5nZWQAd2luZFNwZWVkAG1hdHJpeEtleXBhZABhZ2didWZmZXJfdXBsb2FkAGRldnNjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgdXBsb2FkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqZF9yb2xlX2FsbG9jAGRldnNfcmVnY2FjaGVfYWxsb2MAYmFkIG1hZ2ljAGphY2RhYy1jL2RldmljZXNjcmlwdC92ZXJpZnkuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZGV2aWNlc2NyaXB0LmMAamFjZGFjLWMvc291cmNlL2pkX251bWZtdC5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL3NvdXJjZS9qZF9zZXJ2aWNlcy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9hZ2didWZmZXIuYwBqYWNkYWMtYy9uZXR3b3JrL2Flc19jY20uYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvdm1fdXRpbC5jAGphY2RhYy1jL3NvdXJjZS9qZF91dGlsLmMAamFjZGFjLWMvbmV0d29yay93c3NrLmMAcG9zaXgvZmxhc2guYwBqYWNkYWMtYy9jbGllbnQvcm91dGluZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC90c2FnZy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92YWx1ZS5jAGphY2RhYy1jL3NvdXJjZS9pbnRlcmZhY2VzL3R4X3F1ZXVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvZXZlbnRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvamRfb3BpcGUuYwBqYWNkYWMtYy9zb3VyY2UvamRfaXBpcGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvcmVnY2FjaGUuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvamRpZmFjZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9nY19hbGxvYy5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9zb2Z0X3NoYTI1Ni5jAGRlcGxveSAlZCBiAGRldnNfYnVmZmVyX2RhdGEAc2VydiAlcy8lZCByZWcgY2hnICV4IFtzej0lZF0AQkFTSUNfVEFHKGItPmhlYWRlcikgPT0gSkFDU19HQ19UQUdfQllURVMAcGt0ICE9IE5VTEwAdHJnICE9IE5VTEwAZiAhPSBOVUxMAGNmZy5wcm9ncmFtX2Jhc2UgIT0gTlVMTABmaWIgIT0gTlVMTABkYXRhICE9IE5VTEwARElTQ09OTkVDVElORwAwIDw9IGRpZmYgJiYgZGlmZiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZSAtIEpEX0ZMQVNIX1BBR0VfU0laRQBESVNDT05ORUNURUQAISBpbnZhbGlkIENSQwA/Pz8Ad3NzazoAZUNPMgBqZF9udW1mbXRfd3JpdGVfaTMyAGpkX251bWZtdF9yZWFkX2kzMgBldmVudF9zY29wZSA9PSAxAGFyZzAAYXV0aCBub24tMABzeiA+IDAAd3MgPiAwAHNlcnZpY2VfY29tbWFuZCA+IDAAc3RyLT5jdXJyX3JldHJ5ID09IDAAZXJyID09IDAAZXZlbnRfc2NvcGUgPT0gMABjdHgtPnNvY2tmZCA9PSAwAChjdHgtPmZsYWdzICYgSkFDU19DVFhfRkxBR19CVVNZKSA9PSAwAChHRVRfVEFHKGItPmhlYWRlcikgJiBKQUNTX0dDX1RBR19NQVNLX1NDQU5ORUQpID09IDAAKGRpZmYgJiA3KSA9PSAwACgodWludHB0cl90KXNyYyAmIDMpID09IDAAKCh1aW50cHRyX3QpaW1nZGF0YSAmIDMpID09IDAAZGV2c192ZXJpZnkoZGV2c19lbXB0eV9wcm9ncmFtLCBzaXplb2YoZGV2c19lbXB0eV9wcm9ncmFtKSkgPT0gMAAoZGlmZiAmIChKRF9GTEFTSF9QQUdFX1NJWkUgLSAxKSkgPT0gMAAoKHVpbnRwdHJfdClwdHIgJiAoSkRfUFRSU0laRSAtIDEpKSA9PSAwAChjdHgtPmZsYWdzICYgSkFDU19DVFhfRkxBR19CVVNZKSAhPSAwAC93c3NrLwB3czovLwBkZXZzX2lzX2J1ZmZlcihjdHgsIHYpAHNpemUgPiBzaXplb2YoZGV2c19pbWdfaGVhZGVyX3QpAGRldnM6IE9PTSAoJXUgYnl0ZXMpAFdTU0s6IHByb2Nlc3MgaGVsbG8gKCVkIGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGF1dGggKCVkIGJ5dGVzKQBhZ2didWY6IHVwbDogJyVzJyAlZiAoJS1zKQBXU1NLLUg6IHN0YXR1cyAlZCAoJXMpAChudWxsKQBpZHggPCBkZXZzX2ltZ19udW1fc3RyaW5ncygmY3R4LT5pbWcpAGludmFsaWQgcGt0IHNpemU6ICVkIChvZmY9JWQgZW5kcD0lZCkAbWlzc2luZyAlZCBieXRlcyAob2YgJWQpAEdFVF9UQUcoYi0+aGVhZGVyKSA9PSAoSkFDU19HQ19UQUdfTUFTS19QSU5ORUQgfCBKQUNTX0dDX1RBR19CWVRFUykAdHlwZSAmIChKQUNTX0hBTkRMRV9HQ19NQVNLIHwgSkFDU19IQU5ETEVfSU1HX01BU0spAFdTOiB0ZXh0IG1lc3NhZ2U/ISAnJXMnAHplcm8ga2V5IQBXUzogZXJyb3IhAGRlcGxveSBkZXZpY2UgbG9zdAoAAQAAAAAAAAAAAAAAAAAAAAUAAAAAAAAA8J8GAIAQgRHxDwAAZn5LHiQBAAAHAAAACAAAAAAAAAAAAAAA/////wAAAAAAAPh/AAAAAAAA4EEAAAAAAAAAAEAAAAABAPB/AQAAAAEA8H9BAAAAAQDwfwMA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AAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwSQAAAFNQAABBiJQBCwAAucaAgAAEbmFtZQHTRd4DAAVhYm9ydAEgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkCIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAMaZW1zY3JpcHRlbl93ZWJzb2NrZXRfY2xvc2UEGGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwUyZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ub3Blbl9jYWxsYmFja19vbl90aHJlYWQGM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmVycm9yX2NhbGxiYWNrX29uX3RocmVhZAczZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkCDVlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25tZXNzYWdlX2NhbGxiYWNrX29uX3RocmVhZAkEZXhpdAoNZW1fc2VuZF9mcmFtZQsQZW1fY29uc29sZV9kZWJ1ZwwLZW1fdGltZV9ub3cNFGpkX2NyeXB0b19nZXRfcmFuZG9tDg9fX3dhc2lfZmRfY2xvc2UPFWVtc2NyaXB0ZW5fbWVtY3B5X2JpZxAPX193YXNpX2ZkX3dyaXRlERZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwEgtzZXRUZW1wUmV0MBMabGVnYWxpbXBvcnQkX193YXNpX2ZkX3NlZWsUEV9fd2FzbV9jYWxsX2N0b3JzFRRhcHBfZ2V0X2RldmljZV9jbGFzcxYIaHdfcGFuaWMXCGpkX2JsaW5rGAdqZF9nbG93GRRqZF9hbGxvY19zdGFja19jaGVjaxoIamRfYWxsb2MbB2pkX2ZyZWUcDXRhcmdldF9pbl9pcnEdEnRhcmdldF9kaXNhYmxlX2lycR4RdGFyZ2V0X2VuYWJsZV9pcnEfE2pkX3NldHRpbmdzX2dldF9iaW4gE2pkX3NldHRpbmdzX3NldF9iaW4hF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlIg5qZF93ZWJzb2NrX25ldyMGb25vcGVuJAdvbmVycm9yJQdvbmNsb3NlJglvbm1lc3NhZ2UnEGpkX3dlYnNvY2tfY2xvc2UoB3R4X2luaXQpD2pkX3BhY2tldF9yZWFkeSoKdHhfcHJvY2VzcysQamRfZW1fc2VuZF9mcmFtZSwaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzItGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLgpqZF9lbV9pbml0Lw1qZF9lbV9wcm9jZXNzMAVkbWVzZzEUamRfZW1fZnJhbWVfcmVjZWl2ZWQyEWpkX2VtX2RldnNfZGVwbG95MxhqZF9lbV9kZXZzX2NsaWVudF9kZXBsb3k0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcSamRfdGNwc29ja19wcm9jZXNzOA1mbGFzaF9wcm9ncmFtOQtmbGFzaF9lcmFzZToKZmxhc2hfc3luYzsZaW5pdF9kZXZpY2VzY3JpcHRfbWFuYWdlcjwRYXBwX2luaXRfc2VydmljZXM9EmRldnNfY2xpZW50X2RlcGxveT4UY2xpZW50X2V2ZW50X2hhbmRsZXI/C2FwcF9wcm9jZXNzQBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplQRZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlQg9yb2xlbWdyX3Byb2Nlc3NDEHJvbGVtZ3JfYXV0b2JpbmREFXJvbGVtZ3JfaGFuZGxlX3BhY2tldEUUamRfcm9sZV9tYW5hZ2VyX2luaXRGGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZEcNamRfcm9sZV9hbGxvY0gQamRfcm9sZV9mcmVlX2FsbEkWamRfcm9sZV9mb3JjZV9hdXRvYmluZEoSamRfcm9sZV9ieV9zZXJ2aWNlSxNqZF9jbGllbnRfbG9nX2V2ZW50TBNqZF9jbGllbnRfc3Vic2NyaWJlTRRqZF9jbGllbnRfZW1pdF9ldmVudE4Ucm9sZW1ncl9yb2xlX2NoYW5nZWRPEGpkX2RldmljZV9sb29rdXBQGGpkX2RldmljZV9sb29rdXBfc2VydmljZVETamRfc2VydmljZV9zZW5kX2NtZFIRamRfY2xpZW50X3Byb2Nlc3NTDmpkX2RldmljZV9mcmVlVBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldFUPamRfZGV2aWNlX2FsbG9jVg5kZXZzX3N0cmZvcm1hdFcPZGV2c19jcmVhdGVfY3R4WAlzZXR1cF9jdHhZCmRldnNfdHJhY2VaD2RldnNfZXJyb3JfY29kZVsZZGV2c19jbGllbnRfZXZlbnRfaGFuZGxlclwJY2xlYXJfY3R4XQ1kZXZzX2ZyZWVfY3R4Xg5kZXZzX3RyeV9hbGxvY18IZGV2c19vb21gCWRldnNfZnJlZWELZGV2c192ZXJpZnliFmRldnNfdmFsdWVfZnJvbV9kb3VibGVjE2RldnNfdmFsdWVfZnJvbV9pbnRkFGRldnNfdmFsdWVfZnJvbV9ib29sZRdkZXZzX3ZhbHVlX2Zyb21fcG9pbnRlcmYRZGV2c192YWx1ZV90b19pbnRnFGRldnNfdmFsdWVfdG9fZG91YmxlaBJkZXZzX3ZhbHVlX3RvX2Jvb2xpDmRldnNfaXNfYnVmZmVyahBkZXZzX2J1ZmZlcl9kYXRhaxRkZXZzX3ZhbHVlX3RvX2djX29iamwRZGV2c192YWx1ZV90eXBlb2ZtD2RldnNfaXNfbnVsbGlzaG4QZGV2c19maWJlcl95aWVsZG8WZGV2c19maWJlcl9jb3B5X3BhcmFtc3AYZGV2c19maWJlcl9jYWxsX2Z1bmN0aW9ucRhkZXZzX2ZpYmVyX3NldF93YWtlX3RpbWVyEGRldnNfZmliZXJfc2xlZXBzG2RldnNfZmliZXJfcmV0dXJuX2Zyb21fY2FsbHQaZGV2c19maWJlcl9mcmVlX2FsbF9maWJlcnN1EmRldnNfZmliZXJfYnlfZmlkeHYRZGV2c19maWJlcl9ieV90YWd3EGRldnNfZmliZXJfc3RhcnR4FGRldnNfZmliZXJfdGVybWlhbnRleQ5kZXZzX2ZpYmVyX3J1bnoTZGV2c19maWJlcl9zeW5jX25vd3sKZGV2c19wYW5pY3wVX2RldnNfcnVudGltZV9mYWlsdXJlfQ9kZXZzX2ZpYmVyX3Bva2V+HGRldnNfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2N/D3RzYWdnX2NsaWVudF9ldoABCmFkZF9zZXJpZXOBAQ10c2FnZ19wcm9jZXNzggEKbG9nX3Nlcmllc4MBE3RzYWdnX2hhbmRsZV9wYWNrZXSEARRsb29rdXBfb3JfYWRkX3Nlcmllc4UBCnRzYWdnX2luaXSGAQx0c2FnZ191cGRhdGWHARRkZXZzX2pkX2dldF9yZWdpc3RlcogBFmRldnNfamRfY2xlYXJfcGt0X2tpbmSJARBkZXZzX2pkX3NlbmRfY21kigETZGV2c19qZF9zZW5kX2xvZ21zZ4sBDWhhbmRsZV9sb2dtc2eMARJkZXZzX2pkX3Nob3VsZF9ydW6NARdkZXZzX2pkX3VwZGF0ZV9yZWdjYWNoZY4BE2RldnNfamRfcHJvY2Vzc19wa3SPARRkZXZzX2pkX3JvbGVfY2hhbmdlZJABFGRldnNfamRfcmVzZXRfcGFja2V0kQESZGV2c19qZF9pbml0X3JvbGVzkgESZGV2c19qZF9mcmVlX3JvbGVzkwEQZGV2c19zZXRfbG9nZ2luZ5QBFWRldnNfZ2V0X2dsb2JhbF9mbGFnc5UBDGRldnNfbWFwX3NldJYBDGRldnNfbWFwX2dldJcBCmRldnNfaW5kZXiYAQ5kZXZzX2luZGV4X3NldJkBEWRldnNfYXJyYXlfaW5zZXJ0mgEOYWdnYnVmZmVyX2luaXSbAQ9hZ2didWZmZXJfZmx1c2icARBhZ2didWZmZXJfdXBsb2FknQEMZXhwcl9pbnZhbGlkngEQZXhwcnhfbG9hZF9sb2NhbJ8BEWV4cHJ4X2xvYWRfZ2xvYmFsoAERZXhwcjNfbG9hZF9idWZmZXKhAQ1leHByeF9saXRlcmFsogERZXhwcnhfbGl0ZXJhbF9mNjSjAQ1leHByMF9yZXRfdmFspAEMZXhwcjJfc3RyMGVxpQEXZXhwcjFfcm9sZV9pc19jb25uZWN0ZWSmAQ5leHByMF9wa3Rfc2l6ZacBEWV4cHIwX3BrdF9ldl9jb2RlqAEWZXhwcjBfcGt0X3JlZ19nZXRfY29kZakBCWV4cHIwX25hbqoBCWV4cHIxX2Fic6sBDWV4cHIxX2JpdF9ub3SsAQpleHByMV9jZWlsrQELZXhwcjFfZmxvb3KuAQhleHByMV9pZK8BDGV4cHIxX2lzX25hbrABC2V4cHIxX2xvZ19lsQEJZXhwcjFfbmVnsgEJZXhwcjFfbm90swEMZXhwcjFfcmFuZG9ttAEQZXhwcjFfcmFuZG9tX2ludLUBC2V4cHIxX3JvdW5ktgENZXhwcjFfdG9fYm9vbLcBCWV4cHIyX2FkZLgBDWV4cHIyX2JpdF9hbmS5AQxleHByMl9iaXRfb3K6AQ1leHByMl9iaXRfeG9yuwEJZXhwcjJfZGl2vAEIZXhwcjJfZXG9AQpleHByMl9pZGl2vgEKZXhwcjJfaW11bL8BCGV4cHIyX2xlwAEIZXhwcjJfbHTBAQlleHByMl9tYXjCAQlleHByMl9taW7DAQlleHByMl9tdWzEAQhleHByMl9uZcUBCWV4cHIyX3Bvd8YBEGV4cHIyX3NoaWZ0X2xlZnTHARFleHByMl9zaGlmdF9yaWdodMgBGmV4cHIyX3NoaWZ0X3JpZ2h0X3Vuc2lnbmVkyQEJZXhwcjJfc3ViygEQZXhwcnhfbG9hZF9wYXJhbcsBDGV4cHIwX25vd19tc8wBFmV4cHIxX2dldF9maWJlcl9oYW5kbGXNARVleHByMF9wa3RfcmVwb3J0X2NvZGXOARZleHByMF9wa3RfY29tbWFuZF9jb2RlzwERZXhwcnhfc3RhdGljX3JvbGXQARNleHByeF9zdGF0aWNfYnVmZmVy0QEQZXhwcngxX2dldF9maWVsZNIBC2V4cHIyX2luZGV40wETZXhwcjFfb2JqZWN0X2xlbmd0aNQBEWV4cHIxX2tleXNfbGVuZ3Ro1QEMZXhwcjFfdHlwZW9m1gEKZXhwcjBfbnVsbNcBDWV4cHIxX2lzX251bGzYARBleHByMF9wa3RfYnVmZmVy2QEKZXhwcjBfdHJ1ZdoBC2V4cHIwX2ZhbHNl2wEPc3RtdDFfd2FpdF9yb2xl3AENc3RtdDFfc2xlZXBfc90BDnN0bXQxX3NsZWVwX21z3gEPc3RtdDNfcXVlcnlfcmVn3wEOc3RtdDJfc2VuZF9jbWTgARNzdG10NF9xdWVyeV9pZHhfcmVn4QERc3RtdHgyX2xvZ19mb3JtYXTiAQ1zdG10eDNfZm9ybWF04wEWc3RtdDFfc2V0dXBfcGt0X2J1ZmZlcuQBDXN0bXQyX3NldF9wa3TlAQpzdG10NV9ibGl05gELc3RtdHgyX2NhbGznAQ5zdG10eDNfY2FsbF9iZ+gBDHN0bXQxX3JldHVybukBCXN0bXR4X2ptcOoBDHN0bXR4MV9qbXBfeusBC3N0bXQxX3Bhbmlj7AESc3RtdHgxX3N0b3JlX2xvY2Fs7QETc3RtdHgxX3N0b3JlX2dsb2JhbO4BEnN0bXQ0X3N0b3JlX2J1ZmZlcu8BEnN0bXR4MV9zdG9yZV9wYXJhbfABFXN0bXQxX3Rlcm1pbmF0ZV9maWJlcvEBD3N0bXQwX2FsbG9jX21hcPIBEXN0bXQxX2FsbG9jX2FycmF58wESc3RtdDFfYWxsb2NfYnVmZmVy9AEQc3RtdHgyX3NldF9maWVsZPUBD3N0bXQzX2FycmF5X3NldPYBEnN0bXQzX2FycmF5X2luc2VydPcBFWV4cHJ4X3N0YXRpY19mdW5jdGlvbvgBCmV4cHIyX2ltb2T5AQxleHByMV90b19pbnT6AQxzdG10NF9tZW1zZXT7AQ9qZF9nY190cnlfYWxsb2P8AQl0cnlfYWxsb2P9AQdkZXZzX2dj/gEPZmluZF9mcmVlX2Jsb2Nr/wELamRfZ2NfdW5waW6AAgpqZF9nY19mcmVlgQISZGV2c19tYXBfdHJ5X2FsbG9jggIUZGV2c19hcnJheV90cnlfYWxsb2ODAhVkZXZzX2J1ZmZlcl90cnlfYWxsb2OEAg9kZXZzX2djX3NldF9jdHiFAg5kZXZzX2djX2NyZWF0ZYYCD2RldnNfZ2NfZGVzdHJveYcCBHNjYW6IAhNzY2FuX2FycmF5X2FuZF9tYXJriQINY29uc3VtZV9jaHVua4oCDXNoYV8yNTZfY2xvc2WLAg9qZF9zaGEyNTZfc2V0dXCMAhBqZF9zaGEyNTZfdXBkYXRljQIQamRfc2hhMjU2X2ZpbmlzaI4CFGpkX3NoYTI1Nl9obWFjX3NldHVwjwIVamRfc2hhMjU2X2htYWNfZmluaXNokAIOamRfc2hhMjU2X2hrZGaRAhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc5ICDmRldnNfYnVmZmVyX29wkwIQZGV2c19yZWFkX251bWJlcpQCD2pkX3NldHRpbmdzX2dldJUCD2pkX3NldHRpbmdzX3NldJYCEmRldnNfcmVnY2FjaGVfZnJlZZcCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGyYAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZJkCE2RldnNfcmVnY2FjaGVfYWxsb2OaAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cJsCEWRldnNfcmVnY2FjaGVfYWdlnAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWdAhJkZXZzX3JlZ2NhY2hlX25leHSeAhdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc58CB3RyeV9ydW6gAgxzdG9wX3Byb2dyYW2hAhxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0ogIcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZaMCGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaKQCHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0pQIOZGVwbG95X2hhbmRsZXKmAhNkZXBsb3lfbWV0YV9oYW5kbGVypwIWZGV2aWNlc2NyaXB0bWdyX2RlcGxveagCFGRldmljZXNjcmlwdG1ncl9pbml0qQIZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldqoCEWRldnNjbG91ZF9wcm9jZXNzqwIXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXSsAhNkZXZzY2xvdWRfb25fbWV0aG9krQIOZGV2c2Nsb3VkX2luaXSuAg9kZXZzX3ZtX3BvcF9hcmevAhNkZXZzX3ZtX3BvcF9hcmdfdTMysAITZGV2c192bV9wb3BfYXJnX2kzMrECFGRldnNfdm1fcG9wX2FyZ19mdW5jsgITZGV2c192bV9wb3BfYXJnX2Y2NLMCFmRldnNfdm1fcG9wX2FyZ19idWZmZXK0AhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGG1AhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4tgIUZGV2c192bV9wb3BfYXJnX3JvbGW3AhNkZXZzX3ZtX3BvcF9hcmdfbWFwuAIMQUVTX2luaXRfY3R4uQIPQUVTX0VDQl9lbmNyeXB0ugIQamRfYWVzX3NldHVwX2tlebsCDmpkX2Flc19lbmNyeXB0vAIQamRfYWVzX2NsZWFyX2tleb0CEGpkX3dzc2tfb25fZXZlbnS+AgpzZW5kX2VtcHR5vwISd3Nza2hlYWx0aF9wcm9jZXNzwAIXamRfdGNwc29ja19pc19hdmFpbGFibGXBAhR3c3NraGVhbHRoX3JlY29ubmVjdMICGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldMMCD3NldF9jb25uX3N0cmluZ8QCEWNsZWFyX2Nvbm5fc3RyaW5nxQIPd3Nza2hlYWx0aF9pbml0xgITd3Nza19wdWJsaXNoX3ZhbHVlc8cCEHdzc2tfcHVibGlzaF9iaW7IAhF3c3NrX2lzX2Nvbm5lY3RlZMkCE3dzc2tfcmVzcG9uZF9tZXRob2TKAhJqZF9hZXNfY2NtX2VuY3J5cHTLAhJqZF9hZXNfY2NtX2RlY3J5cHTMAgtqZF93c3NrX25ld80CFGpkX3dzc2tfc2VuZF9tZXNzYWdlzgITamRfd2Vic29ja19vbl9ldmVudM8CB2RlY3J5cHTQAg1qZF93c3NrX2Nsb3Nl0QINamRfcmVzcG9uZF91ONICDmpkX3Jlc3BvbmRfdTE20wIOamRfcmVzcG9uZF91MzLUAhFqZF9yZXNwb25kX3N0cmluZ9UCF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk1gILamRfc2VuZF9wa3TXAhFqZF9vcGlwZV9vcGVuX2NtZNgCFGpkX29waXBlX29wZW5fcmVwb3J02QIWamRfb3BpcGVfaGFuZGxlX3BhY2tldNoCEWpkX29waXBlX3dyaXRlX2V42wIQamRfb3BpcGVfcHJvY2Vzc9wCFGpkX29waXBlX2NoZWNrX3NwYWNl3QIOamRfb3BpcGVfd3JpdGXeAg5qZF9vcGlwZV9jbG9zZd8CDWpkX2lwaXBlX29wZW7gAhZqZF9pcGlwZV9oYW5kbGVfcGFja2V04QIOamRfaXBpcGVfY2xvc2XiAg1qZF9xdWV1ZV9wdXNo4wIOamRfcXVldWVfZnJvbnTkAg5qZF9xdWV1ZV9zaGlmdOUCDmpkX3F1ZXVlX2FsbG9j5gIdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWznAhdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcugCGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTpAhRqZF9hcHBfaGFuZGxlX3BhY2tldOoCFWpkX2FwcF9oYW5kbGVfY29tbWFuZOsCE2pkX2FsbG9jYXRlX3NlcnZpY2XsAhBqZF9zZXJ2aWNlc19pbml07QIOamRfcmVmcmVzaF9ub3fuAhlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk7wIUamRfc2VydmljZXNfYW5ub3VuY2XwAhdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZfECEGpkX3NlcnZpY2VzX3RpY2vyAhVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfzAhpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZfQCEmFwcF9nZXRfZndfdmVyc2lvbvUCFmFwcF9nZXRfZGV2X2NsYXNzX25hbWX2AhJqZF9udW1mbXRfaXNfdmFsaWT3AhVqZF9udW1mbXRfd3JpdGVfZmxvYXT4AhNqZF9udW1mbXRfd3JpdGVfaTMy+QISamRfbnVtZm10X3JlYWRfaTMy+gIUamRfbnVtZm10X3JlYWRfZmxvYXT7Ag1qZF9oYXNoX2ZudjFh/AIMamRfZGV2aWNlX2lk/QIJamRfcmFuZG9t/gIIamRfY3JjMTb/Ag5qZF9jb21wdXRlX2NyY4ADDmpkX3NoaWZ0X2ZyYW1lgQMOamRfcmVzZXRfZnJhbWWCAxBqZF9wdXNoX2luX2ZyYW1lgwMNamRfcGFuaWNfY29yZYQDE2pkX3Nob3VsZF9zYW1wbGVfbXOFAxBqZF9zaG91bGRfc2FtcGxlhgMJamRfdG9faGV4hwMLamRfZnJvbV9oZXiIAw5qZF9hc3NlcnRfZmFpbIkDB2pkX2F0b2mKAwtqZF92c3ByaW50ZosDD2pkX3ByaW50X2RvdWJsZYwDEmpkX2RldmljZV9zaG9ydF9pZI0DDGpkX3NwcmludGZfYY4DC2pkX3RvX2hleF9hjwMUamRfZGV2aWNlX3Nob3J0X2lkX2GQAwlqZF9zdHJkdXCRAw5qZF9qc29uX2VzY2FwZZIDE2pkX2pzb25fZXNjYXBlX2NvcmWTAwlqZF9tZW1kdXCUAw9qZF9jdHJsX3Byb2Nlc3OVAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXSWAwxqZF9jdHJsX2luaXSXAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlmAMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZkDEWpkX3NlbmRfZXZlbnRfZXh0mgMKamRfcnhfaW5pdJsDFGpkX3J4X2ZyYW1lX3JlY2VpdmVknAMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2udAw9qZF9yeF9nZXRfZnJhbWWeAxNqZF9yeF9yZWxlYXNlX2ZyYW1lnwMRamRfc2VuZF9mcmFtZV9yYXegAw1qZF9zZW5kX2ZyYW1loQMKamRfdHhfaW5pdKIDB2pkX3NlbmSjAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjpAMPamRfdHhfZ2V0X2ZyYW1lpQMQamRfdHhfZnJhbWVfc2VudKYDC2pkX3R4X2ZsdXNopwMQX19lcnJub19sb2NhdGlvbqgDBWR1bW15qQMIX19tZW1jcHmqAwdtZW1tb3ZlqwMGbWVtc2V0rAMKX19sb2NrZmlsZa0DDF9fdW5sb2NrZmlsZa4DDF9fc3RkaW9fc2Vla68DDV9fc3RkaW9fd3JpdGWwAw1fX3N0ZGlvX2Nsb3NlsQMMX19zdGRpb19leGl0sgMKY2xvc2VfZmlsZbMDCV9fdG93cml0ZbQDCV9fZndyaXRleLUDBmZ3cml0ZbYDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHO3AxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7gDFl9fcHRocmVhZF9tdXRleF91bmxvY2u5AwZfX2xvY2u6Aw5fX21hdGhfZGl2emVyb7sDDl9fbWF0aF9pbnZhbGlkvAMDbG9nvQMFbG9nMTC+AwdfX2xzZWVrvwMGbWVtY21wwAMKX19vZmxfbG9ja8EDDF9fbWF0aF94Zmxvd8IDCmZwX2JhcnJpZXLDAwxfX21hdGhfb2Zsb3fEAwxfX21hdGhfdWZsb3fFAwRmYWJzxgMDcG93xwMIY2hlY2tpbnTIAwtzcGVjaWFsY2FzZckDBXJvdW5kygMGc3RyY2hyywMLX19zdHJjaHJudWzMAwZzdHJjbXDNAwZzdHJsZW7OAxJfX3dhc2lfc3lzY2FsbF9yZXTPAwhkbG1hbGxvY9ADBmRsZnJlZdEDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZdIDBHNicmvTAwlfX3Bvd2lkZjLUAwlzdGFja1NhdmXVAwxzdGFja1Jlc3RvcmXWAwpzdGFja0FsbG9j1wMVZW1zY3JpcHRlbl9zdGFja19pbml02AMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZdkDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XaAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTbAwxkeW5DYWxsX2ppamncAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp3QMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB2wMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
  "abort": _abort,
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
