
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
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_jacs_deploy')) {
        Object.defineProperty(Module['ready'], '_jd_em_jacs_deploy', { configurable: true, get: function() { abort('You are getting _jd_em_jacs_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_jacs_deploy', { configurable: true, set: function() { abort('You are setting _jd_em_jacs_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
      }
    

      if (!Object.getOwnPropertyDescriptor(Module['ready'], '_jd_em_jacs_client_deploy')) {
        Object.defineProperty(Module['ready'], '_jd_em_jacs_client_deploy', { configurable: true, get: function() { abort('You are getting _jd_em_jacs_client_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
        Object.defineProperty(Module['ready'], '_jd_em_jacs_client_deploy', { configurable: true, set: function() { abort('You are setting _jd_em_jacs_client_deploy on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js') } });
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
var jacs_interval;
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
            const disconnect = () => {
                console.log("disconnect");
                if (sock)
                    try {
                        sock.close();
                    }
                    catch (_a) { }
                sock = undefined;
                if (resolve) {
                    resolve = null;
                    reject(new Error(`can't connect to ${url}`));
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
        return copyToHeap(binary, ptr => Module._jd_em_jacs_deploy(ptr, binary.length));
    }
    Exts.jacsDeploy = jacsDeploy;
    function jacsClientDeploy(binary) {
        // this will call exit(0) when done
        const ptr = Module._malloc(binary.length);
        Module.HEAPU8.set(binary, ptr);
        return Module._jd_em_jacs_client_deploy(ptr, binary.length);
    }
    Exts.jacsClientDeploy = jacsClientDeploy;
    function jacsInit() {
        Module._jd_em_init();
    }
    Exts.jacsInit = jacsInit;
    function jacsStart() {
        if (jacs_interval)
            return;
        Module.jacsInit();
        jacs_interval = setInterval(() => {
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
        if (jacs_interval) {
            clearInterval(jacs_interval);
            jacs_interval = undefined;
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABx4GAgAAgYAN/f38AYAJ/fwBgAX8AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAAF8YAd/f39/f39/AX9gAn98AGAGf39/f39/AGADf39/AXxgA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/ApiFgIAAFANlbnYFYWJvcnQABQNlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABgNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAYDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52BGV4aXQAAgNlbnYNZW1fc2VuZF9mcmFtZQACA2VudhBlbV9jb25zb2xlX2RlYnVnAAIDZW52C2VtX3RpbWVfbm93ABEDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADAPFg4CAAMMDBQgFAgIFBAII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GyABDQAMAwsACwJAIAMvAQ5BgSJGDQAgAy0AA0EBcQ0CC0EAKALsNEF/aiEIIAIoAgAhB0EAIQECQANAAkAgASAITA0AQQAhBQwCCwJAAkBB4DEgCCABakECbSIJQQxsaiIKKAIEIgsgB08NAEEBIQwgCUEBaiEBDAELQQAhDAJAIAsgB0sNACAKIQUMAQsgCUF/aiEIQQEhDAsgDA0ACwsgBUUNASAAKAIkIgFFDQEgA0EQaiEMA0ACQCABKAIEIAJHDQACQCABLQAJIghFDQAgASAIQX9qOgAJCwJAIAwgAy0ADCAFLwEIEL0BIg29Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASANOQMYIAFBADYCICABQThqIA05AwAgAUEwaiANOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEJAkACQEEAKAKQmAEiByABQcQAaigCACIIa0EASA0AIAFBKGoiByABKwMYIAggCWu4oiAHKwMAoDkDAAwBCyABQShqIgggASsDGCAHIAlruKIgCCsDAKA5AwAgByEICyABIAg2AhQCQCABQThqKwMAIA1jRQ0AIAEgDTkDOAsCQCABQTBqKwMAIA1kRQ0AIAEgDTkDMAsgASANOQMYCyAAKAIIIghFDQAgAEEAKAKQmAEgCGo2AhwLIAEoAgAiAQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNAANAAkACQCABKAIMIggNAEEAIQwMAQsgCCADKAIEEMUDRSEMCwJAAkACQCABKAIEIAJHDQAgDA0CIAgQGyADKAIEEIoDIQgMAQsgDEUNASAIEBtBACEICyABIAg2AgwLIAEoAgAiAQ0ACwsPC0G8IUHBHUGSAkHaCRCCAwALuQEBA39ByAAQGiICQf8BOgAKIAIgATYCBCACIAAoAiQ2AgAgACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoApCYASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQSiIARQ0AIAIgACgCBBCKAzYCDAsg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DC8BCE8NACAAIAEgA0EDdGpBGGopAwA3AwAPCyAAIAJB6QAQfgs3AQF/AkAgAigCNCIDIAIoAogBLwEMTw0AIAAgAigCACADQQN0aikDADcDAA8LIAAgAkHqABB+C0UBA38jAEEQayIDJAAgAhCpAiEEIAIQqQIhBSADQQhqIAIQrQIgAyADKQMINwMAIAAgASAFIAQgA0EAELwBIANBEGokAAsLACAAIAIoAjQQZQtHAQF/AkAgAigCNCIDIAIoAogBQdQAaigCAEEDdk8NACAAIAIoAogBIgIgAigCUGogA0EDdGopAAA3AwAPCyAAIAJB6wAQfgsPACAAIAEoAggpAyA3AwALbgEGfyMAQRBrIgMkACACEKkCIQQgAiADQQxqEK4CIQVBACEGAkAgBCADKAIMIgdqIghBAWogAkHMAWotAABLDQAgAkHQAWoiAiAIai0AAA0AIAIgBGogBSAHELgDRSEGCyAAIAYQZiADQRBqJAALJAEBfyACELACIQMgACACKAKYASADQQJ0aigCACgCEEEARxBmCw8AIAAgAkHMAWotAAAQZQtGAAJAIAJBwwFqLQAAQQFxDQAgAkHNAWotAABBMEsNACACQc4BaiICLgEAQX9KDQAgACACLQAAEGUPCyAAQQApA8ArNwMAC1AAAkAgAkHDAWotAABBAXENACACQc0Bai0AAEEwSw0AIAJBzgFqIgIvAQBBgOADcUGAIEcNACAAIAIvAQBB/x9xEGUPCyAAQQApA8ArNwMACw0AIABBACkDsCs3AwALpAECAX8BfCMAQRBrIgMkACADQQhqIAIQqAICQAJAIAMoAgxBf0YNACADIAMpAwg3AwACQCADEGkiBEQAAAAAAAAAAGNFDQAgACAEmhBkDAILIAAgAykDCDcDAAwBCwJAIAMoAggiAkF/Sg0AAkAgAkGAgICAeEcNACAAQQApA7grNwMADAILIABBACACaxBlDAELIAAgAykDCDcDAAsgA0EQaiQACw4AIAAgAhCqAkF/cxBlC00BAX8jAEEQayIDJAAgA0EIaiACEKgCAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQaZsQZAsgA0EQaiQAC00BAX8jAEEQayIDJAAgA0EIaiACEKgCAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQaZwQZAsgA0EQaiQACwkAIAAgAhCoAgsuAQF/IwBBEGsiAyQAIANBCGogAhCoAiAAIAMoAgxBgIDg/wdGEGYgA0EQaiQACw4AIAAgAhCsAhC1AxBkC2wBAX8jAEEQayIDJAAgA0EIaiACEKgCAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAxBpmhBkDAELAkAgAygCCCICQYCAgIB4Rw0AIABBACkDuCs3AwAMAQsgAEEAIAJrEGULIANBEGokAAszAQF/IwBBEGsiAyQAIANBCGogAhCoAiADIAMpAwg3AwAgACADEGpBAXMQZiADQRBqJAALIAEBfxD4AiEDIAAgAhCsAiADuKJEAAAAAAAA8D2iEGQLSgEDf0EBIQMCQCACEKoCIgRBAU0NAANAIANBAXRBAXIiAyAESQ0ACwsDQCACEPgCIANxIgUgBSAESyIFGyECIAUNAAsgACACEGULTwEBfyMAQRBrIgMkACADQQhqIAIQqAICQAJAIAMoAgxBf0cNACAAIAMpAwg3AwAMAQsgAyADKQMINwMAIAAgAxBpEMIDEGQLIANBEGokAAswAQF/IwBBEGsiAyQAIANBCGogAhCoAiADIAMpAwg3AwAgACADEGoQZiADQRBqJAALxAECBH8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACKAIYIgVBAEggAigCECIGIAVqIgUgBkhzDQAgACAFEGUMAQsgAyACQRBqKQMANwMQIAIgA0EQahBpOQMgIAMgBCkDADcDCCACQShqIANBCGoQaSIHOQMAIAAgByACKwMgoBBkCyADQSBqJAALKwECfyACQRhqIgMgAhCqAjYCACACIAIQqgIiBDYCECAAIAQgAygCAHEQZQsrAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQIAAgBCADKAIAchBlCysBAn8gAkEYaiIDIAIQqgI2AgAgAiACEKoCIgQ2AhAgACAEIAMoAgBzEGUL3wECBX8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNAAJAAkAgAigCGCIFQQFqDgIAAgELIAIoAhBBgICAgHhGDQELIAIoAhAiBiAFbSIHIAVsIAZHDQAgACAHEGUMAQsgAyACQRBqKQMANwMQIAIgA0EQahBpOQMgIAMgBCkDADcDCCACQShqIANBCGoQaSIIOQMAIAAgAisDICAIoxBkCyADQSBqJAALtgECAn8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEGk5AyAgAyAEKQMANwMIIAJBKGogA0EIahBpIgU5AwAgBSACKwMgYSECDAELIAIoAhAgAigCGEYhAgsgACACEGYgA0EgaiQAC0ABAn8gAkEYaiIDIAIQqgI2AgAgAiACEKoCIgQ2AhACQCADKAIAIgINACAAQQApA6grNwMADwsgACAEIAJtEGULKwECfyACQRhqIgMgAhCqAjYCACACIAIQqgIiBDYCECAAIAQgAygCAGwQZQu2AQICfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQaTkDICADIAQpAwA3AwggAkEoaiADQQhqEGkiBTkDACACKwMgIAVlIQIMAQsgAigCECACKAIYTCECCyAAIAIQZiADQSBqJAALtgECAn8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEGk5AyAgAyAEKQMANwMIIAJBKGogA0EIahBpIgU5AwAgAisDICAFYyECDAELIAIoAhAgAigCGEghAgsgACACEGYgA0EgaiQAC5ACAgV/AnwjAEEgayIDJAAgA0EYaiACEKgCIAJBGGoiBCADKQMYNwMAIANBGGogAhCoAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahBpOQMgIAMgBCkDADcDCCACQShqIgYgA0EIahBpOQMAQbArIQcgAisDICIIvUL///////////8Ag0KAgICAgICA+P8AVg0CIAYrAwAiCb1C////////////AINCgICAgICAgPj/AFYNAiAIIAljIQIMAQsgAigCECACKAIYSCECCyAEIAUgAhshBwsgACAHKQMANwMAIANBIGokAAuQAgIFfwJ8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQaTkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQaTkDAEGwKyEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBSAEIAIbIQcLIAAgBykDADcDACADQSBqJAALxgEDA38BfgF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAI0AhAgAjQCGH4iBkIgiKcgBqciBUEfdUcNACAAIAUQZQwBCyADIAJBEGopAwA3AxAgAiADQRBqEGk5AyAgAyAEKQMANwMIIAJBKGogA0EIahBpIgc5AwAgACAHIAIrAyCiEGQLIANBIGokAAu2AQICfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQaTkDICADIAQpAwA3AwggAkEoaiADQQhqEGkiBTkDACAFIAIrAyBiIQIMAQsgAigCECACKAIYRyECCyAAIAIQZiADQSBqJAALggECAn8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgC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ADcDCAsCQAJAAkAgAigCDEGDgcD/B0YNACACIABBgAEQfgwBCwJAAkAgAigCCCIDDQBBACEEDAELIAMtAANBD3EhBAtBCCEFAkACQAJAIARBfWoOAwEEAgALQYglQfwcQdwAQeoREIIDAAtBBCEFCyADIAVqIgQoAgAiAw0BIAFFDQEgBCAAKAK4ARCuASIDNgIAIAMNASACIABBgwEQfgtBACEDCyACQRBqJAAgAwufAwEJf0EAIQIDQCAAIAJBAnQiA2ogASADai0AADoAACAAIANBAXIiBGogASAEai0AADoAACAAIANBAnIiBGogASAEai0AADoAACAAIANBA3IiA2ogASADai0AADoAAEEIIQQgAkEBaiICQQhHDQALA0AgBEECdCIBIABqIgNBf2otAAAhBSADQX5qLQAAIQYgA0F9ai0AACECIANBfGotAAAhBwJAAkAgBEEHcSIIRQ0AIAUhCSAGIQUgByEKDAELIARBA3ZBgDFqLQAAIAJBgC9qLQAAcyEKIAdBgC9qLQAAIQkgBUGAL2otAAAhBSAGQYAvai0AACECCwJAIAhBBEcNACAJQf8BcUGAL2otAAAhCSAFQf8BcUGAL2otAAAhBSACQf8BcUGAL2otAAAhAiAKQf8BcUGAL2otAAAhCgsgAyADQWBqLQAAIApzOgAAIAAgAUEBcmogA0Fhai0AACACczoAACAAIAFBAnJqIANBYmotAAAgBXM6AAAgACABQQNyaiADQWNqLQAAIAlzOgAAIARBAWoiBEE8Rw0ACwujBQEKf0EAIQIDQCACQQJ0IQNBACEEA0AgASADaiAEaiIFIAUtAAAgACAEIANqai0AAHM6AAAgBEEBaiIEQQRHDQALIAJBAWoiAkEERw0AC0EBIQYDQEEAIQUDQEEAIQQDQCABIARBAnRqIAVqIgMgAy0AAEGAL2otAAA6AAAgBEEBaiIEQQRHDQALIAVBAWoiBUEERw0ACyABLQABIQQgASABLQAFOgABIAEtAAkhAyABIAEtAA06AAkgASADOgAFIAEgBDoADSABLQACIQQgASABLQAKOgACIAEgBDoACiABLQAGIQQgASABLQAOOgAGIAEgBDoADiABLQADIQQgASABLQAPOgADIAEgAS0ACzoADyABIAEtAAc6AAsgASAEOgAHQQAhAgJAIAZBDkcNAANA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AkH/////ByEBIANEAADA////30FkDQIgA0QAAAAAAADgP6AiA5lEAAAAAAAA4EFjRQ0BIAOqDwsCQAJAAkACQAJAAkACQAJAAkAgAQ4IAAECAwQFBgcICyAALQAADwsgAC8AAA8LIAAoAAAiAUH/////ByABQf////8HSRsPCyAAKQAAIgRC/////wcgBEL/////B1Qbpw8LIAAsAAAPCyAALgAADwsgACgAAA8LQYCAgIB4IQEgACkAACIEQoCAgIB4Uw0CIARC/////wcgBEL/////B1Mbpw8LEPYCAAtBgICAgHghAQsgAQudAQIBfwF8AkACQAJAAkACQAJAAkAgAUEPcSICQX5qDgoAAQUFBQIFBQMEBQsgACgAALghAwwFCyAAKQAAuiEDDAQLIAApAAC5IQMMAwsgACoAALshAwwCCyAAKwAAIQMMAQsgACACEPMCtyEDCwJAIAFBEEkNACADQYCAwP8DIAFBEHRBgIDA/wdxa0GAgMD/B3GtQiCGv6IhAwsgAws5AQF/QcW78oh4IQICQCABRQ0AA0AgAiAALQAAc0GTg4AIbCECIABBAWohACABQX9qIgENAAsLIAILBQAQFgALBAAQNAtOAQF/AkBBACgClJgBIgANAEEAIABBk4OACGxBDXM2ApSYAQtBAEEAKAKUmAEiAEENdCAAcyIAQRF2IABzIgBBBXQgAHMiADYClJgBIAALagEBf0H//wMhAgJAIAFFDQBB//8DIQIDQCACQf//A3EiAkEIdCAALQAAIAJBCHZzIgJB8AFxQQR2IAJzQf8BcSICciACQQx0cyACQQV0cyECIABBAWohACABQX9qIgENAAsLIAJB//8DcQttAQN/IABBAmohASAALQACQQpqIQJB//8DIQMDQCADQf//A3EiA0EIdCABLQAAIANBCHZzIgNB8AFxQQR2IANzQf8BcSIDciADQQx0cyADQQV0cyEDIAFBAWohASACQX9qIgINAAsgACADOwEAC+EBAQd/QQAhAQJAIAAtAAwiAkEHakH8A3EiAyAALQACIgRPDQACQCAAQQxqIgUgAkEEaiIGai0AAEH/AUcNACACIABqQRFqLQAAIgMgBE8NASAGIANPDQELIAAgAC0AA0H9AXE6AAMgACADakEMaiICLQAAIgZBBGoiByADaiAESw0AQQAhAQNAIAUgAigCADYCACAFQQRqIQUgAkEEaiECIAEgBkkhBCABQQRqIQEgBA0ACyAAQQxqIgUgB2pB/wE6AAAgBiAFakEFaiAGQQdqQfwBcSADajoAAEEBIQELIAELCQAgAEEAOgACC3gBAn8CQCABQYACTw0AIAJBgIAETw0AQQAhBAJAIANBBGpB7AEgAC0AAiIFa0sNACAAIAVqQQxqIgQgAjoAAiAEIAE6AAEgBCADOgAAIAQgAkEIdjoAAyAAIAUgA0EHakH8AXFqOgACIARBBGohBAsgBA8LEPYCAAtJAQN/AkAgACgCACICQQAoApCYAWsiA0F/Sg0AIAAgAiABaiICNgIAIAJBACgCkJgBIgRrQX9KDQAgACAEIAFqNgIACyADQR92C0kBA38CQCAAKAIAIgJBACgCiJEBayIDQX9KDQAgACACIAFqIgI2AgAgAkEAKAKIkQEiBGtBf0oNACAAIAQgAWo2AgALIANBH3YLZAEDfwJAIAJFDQBBACEDA0AgACADQQF0aiIEIAEgA2oiBS0AAEEEdkGiFWotAAA6AAAgBEEBaiAFLQAAQQ9xQaIVai0AADoAACADQQFqIgMgAkcNAAsLIAAgAkEBdGpBADoAAAudAgEHfyAAIQICQCABLQAAIgNFDQAgA0UhBEEAIQUgACECA0ACQAJAIANBUGpB/wFxQQlLIgYNACADQRh0QRh1QVBqIQcMAQtBfyEHIANBIHIiCEGff2pB/wFxQQVLDQAgCEEYdEEYdUGpf2ohBwsCQCAHQX9HDQAgAS0AASIDRSEEIAFBAWohASADDQEMAgsgBEEBcQ0BAkACQCAGDQAgA0EYdEEYdUFQaiEHDAELQX8hByADQSByIgNBn39qQf8BcUEFSw0AIANBGHRBGHVBqX9qIQcLIAFBAWohAQJAAkAgBQ0AIAdBBHRBgAJyIQUMAQsgAiAHIAVyOgAAIAJBAWohAkEAIQULIAEtAAAiA0UhBCADDQALCyACIABrCzQBAX8jAEEQayIEJAAgBCADNgIMIAQgAjYCCCAEIAE2AgQgBCAANgIAQbQOIAQQMBD2AgALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEKIDIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDGA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDGA2pBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0AADoAACABIAk6AAAgAkEBaiICIAFBf2oiAUkNAAwHCwALIARBsPABOwEAIAMoAgAhDUEcIQlBACEBA0ACQAJAIA0gCSICdkEPcSIJDQAgAkUNAEEAIQwgAUUNAQsgByABaiAJQTdqIAlBMHIgCUEJSxs6AAAgAUEBaiEMCyACQXxqIQkgDCEBIAINAAsgByAMakEAOgAAIANBBGohAwwFCyAEQbDwATsBACADKAIAIQ1BHCEJQQAhAQNAAkACQCANIAkiAnZBD3EiCQ0AIAJFDQBBACEMIAFFDQELIAcgAWogCUE3aiAJQTByIAlBCUsbOgAAIAFBAWohDAsgAkF8aiEJIAwh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AAsEAEEACwIACzIBAX8jAEEQayIBRAAAAAAAAPC/RAAAAAAAAPA/IAAbOQMIIAErAwhEAAAAAAAAAACjCwwAIAAgAKEiACAAowu+BAMCfgZ8AX8CQCAAvSIBQoCAgICAgICJQHxC//////+fwgFWDQACQCABQoCAgICAgID4P1INAEQAAAAAAAAAAA8LIABEAAAAAAAA8L+gIgAgACAARAAAAAAAAKBBoiIDoCADoSIDIAOiQQArA8A2IgSiIgWgIgYgACAAIACiIgeiIgggCCAIIAhBACsDkDeiIAdBACsDiDeiIABBACsDgDeiQQArA/g2oKCgoiAHQQArA/A2oiAAQQArA+g2okEAKwPgNqCgoKIgB0EAKwPYNqIgAEEAKwPQNqJBACsDyDagoKCiIAAgA6EgBKIgACADoKIgBSAAIAahoKCgoA8LAkACQCABQjCIpyIJQZCAfmpBn4B+Sw0AAkAgAUL///////////8Ag0IAUg0AQQEQswMPCyABQoCAgICAgID4/wBRDQECQAJAIAlBgIACcQ0AIAlB8P8BcUHw/wFHDQELIAAQtAMPCyAARAAAAAAAADBDor1CgICAgICAgOB8fCEBCyABQoCAgICAgICNQHwiAkI0h6e3IgdBACsDiDaiIAJCLYinQf8AcUEEdCIJQaA3aisDAKAiCCAJQZg3aisDACABIAJCgICAgICAgHiDfb8gCUGYxwBqKwMAoSAJQaDHAGorAwChoiIAoCIEIAAgACAAoiIDoiADIABBACsDuDaiQQArA7A2oKIgAEEAKwOoNqJBACsDoDagoKIgA0EAKwOYNqIgB0EAKwOQNqIgACAIIAShoKCgoKAhAAsgAAvuAwMBfgN/BnwCQAJAAkACQAJAIAC9IgFCAFMNACABQiCIpyICQf//P0sNAQsCQCABQv///////////wCDQgBSDQBEAAAAAAAA8L8gACAAoqMPCyABQn9VDQEgACAAoUQAAAAAAAAAAKMPCyACQf//v/8HSw0CQYCAwP8DIQNBgXghBAJAIAJBgIDA/wNGDQAgAiEDDAILIAGnDQFEAAAAAAAAAAAPCyAARAAAAAAAAFBDor0iAUIgiKchA0HLdyEECyAEIANB4r4laiICQRR2arciBUQAYJ9QE0TTP6IiBiACQf//P3FBnsGa/wNqrUIghiABQv////8P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AAAAAAAA8D8gAqMgAiABQQBIGwsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELFQBBwJ7BAiQCQbieAUEPakFwcSQBCwcAIwAjAWsLBAAjAgsEACMBCw0AIAEgAiADIAARDQALJAEBfiAAIAEgAq0gA61CIIaEIAQQ1AMhBSAFQiCIpxASIAWnCxMAIAAgAacgAUIgiKcgAiADEBMLC5SFgYAAAwBBgAgL1IABamFjZGFjLXBvc2l4IGRldmljZQAwLjAuMABodW1pZGl0eQBhY2lkaXR5ACFmcmFtZS0+cGFyYW1zX2lzX2NvcHkAamFjc192ZXJpZnkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABqZF9vcGlwZV93cml0ZV9leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleAB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAbG9jYWxob3N0AHN0b3BfbGlzdABhdXRoIHRvbyBzaG9ydABzdGFydABqZF9jbGllbnRfZW1pdF9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AGphY3NjcmlwdG1ncl9pbml0AHJlZmxlY3RlZExpZ2h0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABqYWNzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAY29tcGFzcwBqYWNzX2ZpYmVyX2NvcHlfcGFyYW1zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGphY2RhYy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBqYWNzX2pkX2dldF9yZWdpc3RlcgBqYWNzX3ZhbHVlX2Zyb21fcG9pbnRlcgBqYWNzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAHJvdGFyeUVuY29kZXIAIXN3ZWVwAGphY3Nfdm1fcG9wX2FyZ19tYXAAc21hbGwgaGVsbG8AcmUtcnVuAGJ1dHRvbgBtb3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgB1bnBpbgBwcm9ncmFtIHdyaXR0ZW4AZmxhc2hfcHJvZ3JhbQBqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAGphY3NfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAIXFfc2VuZGluZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBqYWNzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAMDEyMzQ1Njc4OWFiY2RlZgAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAGphY3NfbGVhdmUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAV1M6IGNsb3NlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQBqZF90eF9nZXRfZnJhbWUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAGpkX2RldmljZV9mcmVlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAamFjc19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGphY3NjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAamFjc2Nsb3VkOiBmYWlsZWQgdXBsb2FkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqYWNzX3JlZ2NhY2hlX2FsbG9jAGJhZCBtYWdpYwBqYWNkYWMtYy9qYWNzY3JpcHQvdmVyaWZ5LmMAamFjZGFjLWMvamFjc2NyaXB0L2phY3NjcmlwdC5jAGphY2RhYy1jL2phY3NjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvamFjc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL2phY3NjcmlwdC9qYWNzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGphY2RhYy1jL2phY3NjcmlwdC9hZ2didWZmZXIuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdm1fdXRpbC5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL2phY3NjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2phY3NjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvamFjc2NyaXB0L2djX2FsbG9jLmMAZGVwbG95ICVkIGIAamFjc19idWZmZXJfZGF0YQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBKQUNTX0dDX1RBR19CWVRFUwB0cmcgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGVDTzIAZXZlbnRfc2NvcGUgPT0gMQBhcmcwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMAAoY3R4LT5mbGFncyAmIEpBQ1NfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgSkFDU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGphY3NfdmVyaWZ5KGphY3NfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGphY3NfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMAAoY3R4LT5mbGFncyAmIEpBQ1NfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAvd3Nzay8Ad3M6Ly8AamFjc19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGphY3NfaW1nX2hlYWRlcl90KQBqYWNzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQAobnVsbCkAaWR4IDwgamFjc19pbWdfbnVtX3N0cmluZ3MoJmN0eC0+aW1nKQBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpAG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKEpBQ1NfR0NfVEFHX01BU0tfUElOTkVEIHwgSkFDU19HQ19UQUdfQllURVMpAHR5cGUgJiAoSkFDU19IQU5ETEVfR0NfTUFTSyB8IEpBQ1NfSEFORExFX0lNR19NQVNLKQBXUzogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1M6IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAAAAAAAAAAAAAAAAAUAAAAAAAAA8J8GAIAQgRHxDwAAZn5LHiQBAAAHAAAACAAAAPCfBgCAEIEQghDxDyvqNBE4AQAADAAAAA0AAABKYWNTCn5qmgIAAwAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBFAABAT1AAAEGIjQELAACSxYCAAARuYW1lAaxE1wMABWFib3J0ASBlbXNjcmlwdGVuX3dlYnNvY2tldF9zZW5kX2JpbmFyeQIhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAxplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQQYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3BTJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkBzNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQINWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkCQRleGl0Cg1lbV9zZW5kX2ZyYW1lCxBlbV9jb25zb2xlX2RlYnVnDAtlbV90aW1lX25vdw0UamRfY3J5cHRvX2dldF9yYW5kb20OD19fd2FzaV9mZF9jbG9zZQ8VZW1zY3JpcHRlbl9tZW1jcHlfYmlnEA9fX3dhc2lfZmRfd3JpdGURFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXASC3NldFRlbXBSZXQwExpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxQRX193YXNtX2NhbGxfY3RvcnMVFGFwcF9nZXRfZGV2aWNlX2NsYXNzFghod19wYW5pYxcIamRfYmxpbmsYB2pkX2dsb3cZFGpkX2FsbG9jX3N0YWNrX2NoZWNrGghqZF9hbGxvYxsHamRfZnJlZRwNdGFyZ2V0X2luX2lycR0SdGFyZ2V0X2Rpc2FibGVfaXJxHhF0YXJnZXRfZW5hYmxlX2lycR8PamRfc2V0dGluZ3NfZ2V0IA9qZF9zZXR0aW5nc19zZXQhF2pkX3dlYnNvY2tfc2VuZF9tZXNzYWdlIg5qZF93ZWJzb2NrX25ldyMGb25vcGVuJAdvbmVycm9yJQdvbmNsb3NlJglvbm1lc3NhZ2UnEGpkX3dlYnNvY2tfY2xvc2UoB3R4X2luaXQpD2pkX3BhY2tldF9yZWFkeSoKdHhfcHJvY2VzcysQamRfZW1fc2VuZF9mcmFtZSwaamRfZW1fc2V0X2RldmljZV9pZF8yeF9pMzItGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nLgpqZF9lbV9pbml0Lw1qZF9lbV9wcm9jZXNzMAVkbWVzZzEUamRfZW1fZnJhbWVfcmVjZWl2ZWQyEWpkX2VtX2phY3NfZGVwbG95MxhqZF9lbV9qYWNzX2NsaWVudF9kZXBsb3k0DGh3X2RldmljZV9pZDUMdGFyZ2V0X3Jlc2V0Ng50aW1fZ2V0X21pY3JvczcSamRfdGNwc29ja19wcm9jZXNzOA1mbGFzaF9wcm9ncmFtOQtmbGFzaF9lcmFzZToKZmxhc2hfc3luYzsWaW5pdF9qYWNzY3JpcHRfbWFuYWdlcjwRYXBwX2luaXRfc2VydmljZXM9EmphY3NfY2xpZW50X2RlcGxveT4UY2xpZW50X2V2ZW50X2hhbmRsZXI/C2FwcF9wcm9jZXNzQBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplQRZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlQg9yb2xlbWdyX3Byb2Nlc3NDEHJvbGVtZ3JfYXV0b2JpbmREFXJvbGVtZ3JfaGFuZGxlX3BhY2tldEUUamRfcm9sZV9tYW5hZ2VyX2luaXRGGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZEcNamRfcm9sZV9hbGxvY0gQamRfcm9sZV9mcmVlX2FsbEkWamRfcm9sZV9mb3JjZV9hdXRvYmluZEoSamRfcm9sZV9ieV9zZXJ2aWNlSxNqZF9jbGllbnRfbG9nX2V2ZW50TBNqZF9jbGllbnRfc3Vic2NyaWJlTRRqZF9jbGllbnRfZW1pdF9ldmVudE4Ucm9sZW1ncl9yb2xlX2NoYW5nZWRPEGpkX2RldmljZV9sb29rdXBQGGpkX2RldmljZV9sb29rdXBfc2VydmljZVETamRfc2VydmljZV9zZW5kX2NtZFIRamRfY2xpZW50X3Byb2Nlc3NTDmpkX2RldmljZV9mcmVlVBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldFUPamRfZGV2aWNlX2FsbG9jVg5qYWNzX3N0cmZvcm1hdFcUamFjc2NyaXB0bWdyX3Byb2Nlc3NYB3RyeV9ydW5ZDHN0b3BfcHJvZ3JhbVoZamFjc2NyaXB0bWdyX2RlcGxveV9zdGFydFsZamFjc2NyaXB0bWdyX2RlcGxveV93cml0ZVwVamFjc2NyaXB0bWdyX2dldF9oYXNoXRpqYWNzY3JpcHRtZ3JfaGFuZGxlX3BhY2tldF4OZGVwbG95X2hhbmRsZXJfE2RlcGxveV9tZXRhX2hhbmRsZXJgE2phY3NjcmlwdG1ncl9kZXBsb3lhEWphY3NjcmlwdG1ncl9pbml0YhZqYWNzY3JpcHRtZ3JfY2xpZW50X2V2YwtqYWNzX3ZlcmlmeWQWamFjc192YWx1ZV9mcm9tX2RvdWJsZWUTamFjc192YWx1ZV9mcm9tX2ludGYUamFjc192YWx1ZV9mcm9tX2Jvb2xnF2phY3NfdmFsdWVfZnJvbV9wb2ludGVyaBFqYWNzX3ZhbHVlX3RvX2ludGkUamFjc192YWx1ZV90b19kb3VibGVqEmphY3NfdmFsdWVfdG9fYm9vbGsOamFjc19pc19idWZmZXJsEGphY3NfYnVmZmVyX2RhdGFtFGphY3NfdmFsdWVfdG9fZ2Nfb2JqbhFqYWNzX3ZhbHVlX3R5cGVvZm8PamFjc19pc19udWxsaXNocBBqYWNzX2ZpYmVyX3lpZWxkcRZqYWNzX2ZpYmVyX2NvcHlfcGFyYW1zchhqYWNzX2ZpYmVyX2NhbGxfZnVuY3Rpb25zGGphY3NfZmliZXJfc2V0X3dha2VfdGltZXQQamFjc19maWJlcl9zbGVlcHUbamFjc19maWJlcl9yZXR1cm5fZnJvbV9jYWxsdhpqYWNzX2ZpYmVyX2ZyZWVfYWxsX2ZpYmVyc3cSamFjc19maWJlcl9ieV9maWR4eBFqYWNzX2ZpYmVyX2J5X3RhZ3kQamFjc19maWJlcl9zdGFydHoUamFjc19maWJlcl90ZXJtaWFudGV7DmphY3NfZmliZXJfcnVufBNqYWNzX2ZpYmVyX3N5bmNfbm93fQpqYWNzX3BhbmljfhVfamFjc19ydW50aW1lX2ZhaWx1cmV/D2phY3NfZmliZXJfcG9rZYABHGphY3NfZ2V0X3BhY2tlZF9zZXJ2aWNlX2Rlc2OBAQ90c2FnZ19jbGllbnRfZXaCAQphZGRfc2VyaWVzgwENdHNhZ2dfcHJvY2Vzc4QBCmxvZ19zZXJpZXOFARN0c2FnZ19oYW5kbGVfcGFja2V0hgEUbG9va3VwX29yX2FkZF9zZXJpZXOHAQp0c2FnZ19pbml0iAEUamFjc19qZF9nZXRfcmVnaXN0ZXKJARZqYWNzX2pkX2NsZWFyX3BrdF9raW5kigEQamFjc19qZF9zZW5kX2NtZIsBE2phY3NfamRfc2VuZF9sb2dtc2eMAQ1oYW5kbGVfbG9nbXNnjQESamFjc19qZF9zaG91bGRfcnVujgEXamFjc19qZF91cGRhdGVfcmVnY2FjaGWPARNqYWNzX2pkX3Byb2Nlc3NfcGt0kAEUamFjc19qZF9yb2xlX2NoYW5nZWSRARRqYWNzX2pkX3Jlc2V0X3BhY2tldJIBEmphY3NfamRfaW5pdF9yb2xlc5MBEmphY3NfamRfZnJlZV9yb2xlc5QBEGphY3Nfc2V0X2xvZ2dpbmeVARVqYWNzX2dldF9nbG9iYWxfZmxhZ3OWAQ9qYWNzX2NyZWF0ZV9jdHiXAQlzZXR1cF9jdHiYAQpqYWNzX3RyYWNlmQEPamFjc19lcnJvcl9jb2RlmgEZamFjc19jbGllbnRfZXZlbnRfaGFuZGxlcpsBCWNsZWFyX2N0eJwBDWphY3NfZnJlZV9jdHidAQ5qYWNzX3RyeV9hbGxvY54BCGphY3Nfb29tnwEJamFjc19mcmVloAEMamFjc19tYXBfc2V0oQEMamFjc19tYXBfZ2V0ogEKamFjc19pbmRleKMBDmphY3NfaW5kZXhfc2V0pAERamFjc19hcnJheV9pbnNlcnSlAQ5hZ2didWZmZXJfaW5pdKYBD2FnZ2J1ZmZlcl9mbHVzaKcBEGFnZ2J1ZmZlcl91cGxvYWSoAQ9qZF9nY190cnlfYWxsb2OpAQl0cnlfYWxsb2OqAQdqYWNzX2djqwEPZmluZF9mcmVlX2Jsb2NrrAELamRfZ2NfdW5waW6tAQpqZF9nY19mcmVlrgESamFjc19tYXBfdHJ5X2FsbG9jrwEUamFjc19hcnJheV90cnlfYWxsb2OwARVqYWNzX2J1ZmZlcl90cnlfYWxsb2OxAQ9qYWNzX2djX3NldF9jdHiyAQ5qYWNzX2djX2NyZWF0ZbMBD2phY3NfZ2NfZGVzdHJvebQBBHNjYW61ARNzY2FuX2FycmF5X2FuZF9tYXJrtgENY29uc3VtZV9jaHVua7cBDXNoYV8yNTZfY2xvc2W4AQ9qZF9zaGEyNTZfc2V0dXC5ARBqZF9zaGEyNTZfdXBkYXRlugEQamRfc2hhMjU2X2ZpbmlzaLsBFGphY3Nfdm1fZXhlY19vcGNvZGVzvAEOamFjc19idWZmZXJfb3C9ARBqYWNzX3JlYWRfbnVtYmVyvgESamFjc19yZWdjYWNoZV9mcmVlvwEWamFjc19yZWdjYWNoZV9mcmVlX2FsbMABF2phY3NfcmVnY2FjaGVfbWFya191c2VkwQETamFjc19yZWdjYWNoZV9hbGxvY8IBFGphY3NfcmVnY2FjaGVfbG9va3VwwwERamFjc19yZWdjYWNoZV9hZ2XEARdqYWNzX3JlZ2NhY2hlX2ZyZWVfcm9sZcUBEmphY3NfcmVnY2FjaGVfbmV4dMYBEWphY3NjbG91ZF9wcm9jZXNzxwEXamFjc2Nsb3VkX2hhbmRsZV9wYWNrZXTIARNqYWNzY2xvdWRfb25fbWV0aG9kyQEOamFjc2Nsb3VkX2luaXTKAQxleHByX2ludmFsaWTLARBleHByeF9sb2FkX2xvY2FszAERZXhwcnhfbG9hZF9nbG9iYWzNARFleHByM19sb2FkX2J1ZmZlcs4BDWV4cHJ4X2xpdGVyYWzPARFleHByeF9saXRlcmFsX2Y2NNABDWV4cHIwX3JldF92YWzRAQxleHByMl9zdHIwZXHSARdleHByMV9yb2xlX2lzX2Nvbm5lY3RlZNMBDmV4cHIwX3BrdF9zaXpl1AERZXhwcjBfcGt0X2V2X2NvZGXVARZleHByMF9wa3RfcmVnX2dldF9jb2Rl1gEJZXhwcjBfbmFu1wEJZXhwcjFfYWJz2AENZXhwcjFfYml0X25vdNkBCmV4cHIxX2NlaWzaAQtleHByMV9mbG9vctsBCGV4cHIxX2lk3AEMZXhwcjFfaXNfbmFu3QELZXhwcjFfbG9nX2XeAQlleHByMV9uZWffAQlleHByMV9ub3TgAQxleHByMV9yYW5kb23hARBleHByMV9yYW5kb21faW504gELZXhwcjFfcm91bmTjAQ1leHByMV90b19ib29s5AEJZXhwcjJfYWRk5QENZXhwcjJfYml0X2FuZOYBDGV4cHIyX2JpdF9vcucBDWV4cHIyX2JpdF94b3LoAQlleHByMl9kaXbpAQhleHByMl9lceoBCmV4cHIyX2lkaXbrAQpleHByMl9pbXVs7AEIZXhwcjJfbGXtAQhleHByMl9sdO4BCWV4cHIyX21heO8BCWV4cHIyX21pbvABCWV4cHIyX211bPEBCGV4cHIyX25l8gEJZXhwcjJfcG938wEQZXhwcjJfc2hpZnRfbGVmdPQBEWV4cHIyX3NoaWZ0X3JpZ2h09QEaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWT2AQlleHByMl9zdWL3ARBleHByeF9sb2FkX3BhcmFt+AEMZXhwcjBfbm93X21z+QEWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZfoBFWV4cHIwX3BrdF9yZXBvcnRfY29kZfsBFmV4cHIwX3BrdF9jb21tYW5kX2NvZGX8ARFleHByeF9zdGF0aWNfcm9sZf0BE2V4cHJ4X3N0YXRpY19idWZmZXL+ARBleHByeDFfZ2V0X2ZpZWxk/wELZXhwcjJfaW5kZXiAAhNleHByMV9vYmplY3RfbGVuZ3RogQIRZXhwcjFfa2V5c19sZW5ndGiCAgxleHByMV90eXBlb2aDAgpleHByMF9udWxshAINZXhwcjFfaXNfbnVsbIUCEGV4cHIwX3BrdF9idWZmZXKGAgpleHByMF90cnVlhwILZXhwcjBfZmFsc2WIAg9zdG10MV93YWl0X3JvbGWJAg1zdG10MV9zbGVlcF9zigIOc3RtdDFfc2xlZXBfbXOLAg9zdG10M19xdWVyeV9yZWeMAg5zdG10Ml9zZW5kX2NtZI0CE3N0bXQ0X3F1ZXJ5X2lkeF9yZWeOAhFzdG10eDJfbG9nX2Zvcm1hdI8CDXN0bXR4M19mb3JtYXSQAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVykQINc3RtdDJfc2V0X3BrdJICCnN0bXQ1X2JsaXSTAgtzdG10eDJfY2FsbJQCDnN0bXR4M19jYWxsX2JnlQIMc3RtdDFfcmV0dXJulgIJc3RtdHhfam1wlwIMc3RtdHgxX2ptcF96mAILc3RtdDFfcGFuaWOZAhJzdG10eDFfc3RvcmVfbG9jYWyaAhNzdG10eDFfc3RvcmVfZ2xvYmFsmwISc3RtdDRfc3RvcmVfYnVmZmVynAISc3RtdHgxX3N0b3JlX3BhcmFtnQIVc3RtdDFfdGVybWluYXRlX2ZpYmVyngIPc3RtdDBfYWxsb2NfbWFwnwIRc3RtdDFfYWxsb2NfYXJyYXmgAhJzdG10MV9hbGxvY19idWZmZXKhAhBzdG10eDJfc2V0X2ZpZWxkogIPc3RtdDNfYXJyYXlfc2V0owISc3RtdDNfYXJyYXlfaW5zZXJ0pAIVZXhwcnhfc3RhdGljX2Z1bmN0aW9upQIKZXhwcjJfaW1vZKYCDGV4cHIxX3RvX2ludKcCDHN0bXQ0X21lbXNldKgCD2phY3Nfdm1fcG9wX2FyZ6kCE2phY3Nfdm1fcG9wX2FyZ191MzKqAhNqYWNzX3ZtX3BvcF9hcmdfaTMyqwIUamFjc192bV9wb3BfYXJnX2Z1bmOsAhNqYWNzX3ZtX3BvcF9hcmdfZjY0rQIWamFjc192bV9wb3BfYXJnX2J1ZmZlcq4CG2phY3Nfdm1fcG9wX2FyZ19idWZmZXJfZGF0Ya8CFmphY3Nfdm1fcG9wX2FyZ19zdHJpZHiwAhRqYWNzX3ZtX3BvcF9hcmdfcm9sZbECE2phY3Nfdm1fcG9wX2FyZ19tYXCyAgxBRVNfaW5pdF9jdHizAg9BRVNfRUNCX2VuY3J5cHS0AhBqZF9hZXNfc2V0dXBfa2V5tQIOamRfYWVzX2VuY3J5cHS2AhBqZF9hZXNfY2xlYXJfa2V5twIQamRfd3Nza19vbl9ldmVudLgCCnNlbmRfZW1wdHm5AhJ3c3NraGVhbHRoX3Byb2Nlc3O6AhdqZF90Y3Bzb2NrX2lzX2F2YWlsYWJsZbsCFHdzc2toZWFsdGhfcmVjb25uZWN0vAIYd3Nza2hlYWx0aF9oYW5kbGVfcGFja2V0vQIPc2V0X2Nvbm5fc3RyaW5nvgIRY2xlYXJfY29ubl9zdHJpbme/Ag93c3NraGVhbHRoX2luaXTAAhN3c3NrX3B1Ymxpc2hfdmFsdWVzwQIQd3Nza19wdWJsaXNoX2JpbsICEXdzc2tfaXNfY29ubmVjdGVkwwITd3Nza19yZXNwb25kX21ldGhvZMQCEmpkX2Flc19jY21fZW5jcnlwdMUCEmpkX2Flc19jY21fZGVjcnlwdMYCC2pkX3dzc2tfbmV3xwIUamRfd3Nza19zZW5kX21lc3NhZ2XIAhNqZF93ZWJzb2NrX29uX2V2ZW50yQIHZGVjcnlwdMoCDWpkX3dzc2tfY2xvc2XLAg1qZF9yZXNwb25kX3U4zAIOamRfcmVzcG9uZF91MTbNAg5qZF9yZXNwb25kX3UzMs4CEWpkX3Jlc3BvbmRfc3RyaW5nzwIXamRfc2VuZF9ub3RfaW1wbGVtZW50ZWTQAgtqZF9zZW5kX3BrdNECEWpkX29waXBlX29wZW5fY21k0gIUamRfb3BpcGVfb3Blbl9yZXBvcnTTAhZqZF9vcGlwZV9oYW5kbGVfcGFja2V01AIRamRfb3BpcGVfd3JpdGVfZXjVAhBqZF9vcGlwZV9wcm9jZXNz1gIUamRfb3BpcGVfY2hlY2tfc3BhY2XXAg5qZF9vcGlwZV93cml0ZdgCDmpkX29waXBlX2Nsb3Nl2QINamRfaXBpcGVfb3BlbtoCFmpkX2lwaXBlX2hhbmRsZV9wYWNrZXTbAg5qZF9pcGlwZV9jbG9zZdwCDWpkX3F1ZXVlX3B1c2jdAg5qZF9xdWV1ZV9mcm9udN4CDmpkX3F1ZXVlX3NoaWZ03wIOamRfcXVldWVfYWxsb2PgAh1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbOECF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy4gIZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldOMCFGpkX2FwcF9oYW5kbGVfcGFja2V05AIVamRfYXBwX2hhbmRsZV9jb21tYW5k5QITamRfYWxsb2NhdGVfc2VydmljZeYCEGpkX3NlcnZpY2VzX2luaXTnAg5qZF9yZWZyZXNoX25vd+gCGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTpAhRqZF9zZXJ2aWNlc19hbm5vdW5jZeoCF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l6wIQamRfc2VydmljZXNfdGlja+wCFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ+0CGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl7gISYXBwX2dldF9md192ZXJzaW9u7wIWYXBwX2dldF9kZXZfY2xhc3NfbmFtZfACEmpkX251bWZtdF9pc192YWxpZPECFWpkX251bWZtdF93cml0ZV9mbG9hdPICE2pkX251bWZtdF93cml0ZV9pMzLzAhJqZF9udW1mbXRfcmVhZF9pMzL0AhRqZF9udW1mbXRfcmVhZF9mbG9hdPUCDWpkX2hhc2hfZm52MWH2AghqZF9wYW5pY/cCDGpkX2RldmljZV9pZPgCCWpkX3JhbmRvbfkCCGpkX2NyYzE2+gIOamRfY29tcHV0ZV9jcmP7Ag5qZF9zaGlmdF9mcmFtZfwCDmpkX3Jlc2V0X2ZyYW1l/QIQamRfcHVzaF9pbl9mcmFtZf4CE2pkX3Nob3VsZF9zYW1wbGVfbXP/AhBqZF9zaG91bGRfc2FtcGxlgAMJamRfdG9faGV4gQMLamRfZnJvbV9oZXiCAw5qZF9hc3NlcnRfZmFpbIMDB2pkX2F0b2mEAwtqZF92c3ByaW50ZoUDD2pkX3ByaW50X2RvdWJsZYYDEmpkX2RldmljZV9zaG9ydF9pZIcDDGpkX3NwcmludGZfYYgDC2pkX3RvX2hleF9hiQMUamRfZGV2aWNlX3Nob3J0X2lkX2GKAwlqZF9zdHJkdXCLAw5qZF9qc29uX2VzY2FwZYwDE2pkX2pzb25fZXNjYXBlX2NvcmWNAw9qZF9jdHJsX3Byb2Nlc3OOAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXSPAwxqZF9jdHJsX2luaXSQAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlkQMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZIDEWpkX3NlbmRfZXZlbnRfZXh0kwMKamRfcnhfaW5pdJQDFGpkX3J4X2ZyYW1lX3JlY2VpdmVklQMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uWAw9qZF9yeF9nZXRfZnJhbWWXAxNqZF9yeF9yZWxlYXNlX2ZyYW1lmAMRamRfc2VuZF9mcmFtZV9yYXeZAw1qZF9zZW5kX2ZyYW1lmgMKamRfdHhfaW5pdJsDB2pkX3NlbmScAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjnQMPamRfdHhfZ2V0X2ZyYW1lngMQamRfdHhfZnJhbWVfc2VudJ8DC2pkX3R4X2ZsdXNooAMQX19lcnJub19sb2NhdGlvbqEDBWR1bW15ogMIX19tZW1jcHmjAwdtZW1tb3ZlpAMGbWVtc2V0pQMKX19sb2NrZmlsZaYDDF9fdW5sb2NrZmlsZacDDF9fc3RkaW9fc2Vla6gDDV9fc3RkaW9fd3JpdGWpAw1fX3N0ZGlvX2Nsb3NlqgMMX19zdGRpb19leGl0qwMKY2xvc2VfZmlsZawDCV9fdG93cml0Za0DCV9fZndyaXRleK4DBmZ3cml0Za8DK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHOwAxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7EDFl9fcHRocmVhZF9tdXRleF91bmxvY2uyAwZfX2xvY2uzAw5fX21hdGhfZGl2emVyb7QDDl9fbWF0aF9pbnZhbGlktQMDbG9ntgMFbG9nMTC3AwdfX2xzZWVruAMGbWVtY21wuQMKX19vZmxfbG9ja7oDDF9fbWF0aF94Zmxvd7sDCmZwX2JhcnJpZXK8AwxfX21hdGhfb2Zsb3e9AwxfX21hdGhfdWZsb3e+AwRmYWJzvwMDcG93wAMIY2hlY2tpbnTBAwtzcGVjaWFsY2FzZcIDBXJvdW5kwwMGc3RyY2hyxAMLX19zdHJjaHJudWzFAwZzdHJjbXDGAwZzdHJsZW7HAxJfX3dhc2lfc3lzY2FsbF9yZXTIAwhkbG1hbGxvY8kDBmRsZnJlZcoDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZcsDBHNicmvMAwlfX3Bvd2lkZjLNAwlzdGFja1NhdmXOAwxzdGFja1Jlc3RvcmXPAwpzdGFja0FsbG9j0AMVZW1zY3JpcHRlbl9zdGFja19pbml00QMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZdIDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XTAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTUAwxkeW5DYWxsX2ppamnVAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp1gMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB1AMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
var _jd_em_jacs_deploy = Module["_jd_em_jacs_deploy"] = createExportWrapper("jd_em_jacs_deploy");

/** @type {function(...*):?} */
var _jd_em_jacs_client_deploy = Module["_jd_em_jacs_client_deploy"] = createExportWrapper("jd_em_jacs_client_deploy");

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
