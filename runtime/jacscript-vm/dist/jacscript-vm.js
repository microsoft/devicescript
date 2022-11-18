
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
            const disconnect = () => {
                console.log("disconnect");
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABx4GAgAAgYAN/f38AYAJ/fwBgAX8AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAAF8YAZ/f39/f38AYAN/f38BfGAHf39/f39/fwF/YAJ/fABgA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/ApiFgIAAFANlbnYFYWJvcnQABQNlbnYNZW1fc2VuZF9mcmFtZQACA2VudhBlbV9jb25zb2xlX2RlYnVnAAIDZW52BGV4aXQAAgNlbnYLZW1fdGltZV9ub3cAEQNlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABgNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAYDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADAPFg4CAAMMDBQACBQUIBQICBQQCCAUFBAMDAQIFBQEEAwMOBQ4FBQMHBQEFBQMJBgYGBgUEBAICAQUCAwUFBAABAAIPAwkFAgIEAggGEhMCAgcBAQICAwMMAgICAQACAwYCBgEBBAMDAQgCAQACAQcCBgEHAwcCAgMBAQICAgQDBAEBAQMCBxACAAcDBAYAAQICAgEIBwcHCQkBAgMJCQABCQEEBQECFAQHAwIBAQYCFQEBBwQLBAMGAwMEAwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQQEBAsBAwQEAxAMAQECAgUJAwADBQACAggCAQcCBQYDCAkCAQUGAgIEFgADFwMDAgkFAwYEAwQCBAMDAwMEBAYGAgICBAUFBQUEBQUFCAgDBQ4IAwIEAgkDAwADBwQJGBkDAw8EAwYFBQcFBAQIAgQEBQkFCAIFCAQGBgYEAg0GBAUCBAYJBQQEAgsKCgoNBggaCgsLChsPHAoDAwMEBAQCCAQdCAIEBQgICB4MHwSFgICAAAFwAX5+BYaAgIAAAQGAAoACBpOAgIAAA38BQdCewQILfwFBAAt/AUEACwfmg4CAABcGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAFBBfX2Vycm5vX2xvY2F0aW9uAKADGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAZtYWxsb2MAyAMEZnJlZQDJAxpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMgAmGmpkX2VtX3NldF9kZXZpY2VfaWRfc3RyaW5nACcKamRfZW1faW5pdAAoDWpkX2VtX3Byb2Nlc3MAKRRqZF9lbV9mcmFtZV9yZWNlaXZlZAArEWpkX2VtX2phY3NfZGVwbG95ACwYamRfZW1famFjc19jbGllbnRfZGVwbG95AC0MX19zdGRpb19leGl0AKoDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHMArwMVZW1zY3JpcHRlbl9zdGFja19pbml0ANADGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUA0QMZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQDSAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQA0wMJc3RhY2tTYXZlAM0DDHN0YWNrUmVzdG9yZQDOAwpzdGFja0FsbG9jAM8DDGR5bkNhbGxfamlqaQDVAwn1gYCAAAEAQQELfSU0Ozw9PkJEeXqOAY8BkgGHAY0BtQG3AbkBygHLAcwBzQHOAc8B0AHRAdIB0wHUAdUB1gHXAdgB2QHaAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AfYB9wH4AfkB+gH7AfwB/QH+Af8BgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwLAAsMCxwLIAljJAsoCywLMApEDqQOoA6cDCvvihIAAwwMFABDQAwvOAQEBfwJAAkACQAJAQQAoAoCRASIDRQ0AIAFBA3ENASAAIANrIgNBAEgNAiADIAJqQQAoAoSRAUsNAgJAAkAgA0EHcQ0AIAJFDQVBACEDDAELQfAiQf8cQRRBtRIQhQMACwJAA0AgACADai0AAEH/AUcNASADQQFqIgMgAkYNBQwACwALQewUQf8cQRZBtRIQhQMAC0HoH0H/HEEQQbUSEIUDAAtBgCNB/xxBEkG1EhCFAwALQZkVQf8cQRNBtRIQhQMACyAAIAEgAhCiAxoLdwEBfwJAAkACQEEAKAKAkQEiAUUNACAAIAFrIgFBAEgNASABQQAoAoSRAUGAcGpLDQEgAUH/D3ENAiAAQf8BQYAQEKQDGg8LQegfQf8cQRtBwxYQhQMAC0GoIEH/HEEdQcMWEIUDAAtB+SNB/xxBHkHDFhCFAwALAgALIQBBAEGAgAI2AoSRAUEAQYCAAhAeNgKAkQFBgJEBEJEBCwgAQe/olv8DCwUAEAAACwIACwIACwIACxwBAX8CQCAAEMgDIgENABAAAAsgAUEAIAAQpAMLBwAgABDJAwsEAEEACwoAQYiRARCwAxoLCgBBiJEBELEDGgtRAQN/QQAhAUEAIQICQEEAKAKkkQEiA0UNAANAAkAgAygCBCAAEMUDDQAgAyECDAILIAMoAgAiAw0AC0EAIQILAkAgAkUNACACKAIIIQELIAELkwEBAn8CQAJAAkBBACgCpJEBIgJFDQAgAiEDA0AgAygCBCAAEMUDRQ0CIAMoAgAiAw0ACwtBDBDIAyIDRQ0BIANCADcAACADQQhqQQA2AAAgAyACNgIAIAMgABCNAzYCBEEAIAM2AqSRAQsgAygCCBDJA0EAIQACQCABRQ0AIAEQjQMhAAsgAyAANgIIQQAPCxAAAAsIACABEAFBAAsTAEEAIACtQiCGIAGshDcD+IgBC2gCAn8BfiMAQRBrIgEkAAJAAkAgABDGA0EQRw0AIAFBCGogABCEA0EIRw0AIAEpAwghAwwBCyAAIAAQxgMiAhD4Aq1CIIYgAEEBaiACQX9qEPgCrYQhAwtBACADNwP4iAEgAUEQaiQACyQAAkBBAC0AqJEBDQBBAEEBOgCokQFB/ChBABA2EJMDEO4CCwtlAQF/IwBBMGsiACQAAkBBAC0AqJEBQQFHDQBBAEECOgCokQEgAEErahD6AhCJAyAAQRBqQfiIAUEIEIMDIAAgAEErajYCBCAAIABBEGo2AgBB8g0gABAqCxD0AhA4IABBMGokAAs0AQF/IwBB4AFrIgIkACACIAE2AgwgAkEQakHHASAAIAEQhwMaIAJBEGoQAiACQeABaiQACywAAkAgAEECaiAALQACQQpqEPwCIAAvAQBGDQBB9CBBABAqQX4PCyAAEJQDCwkAIAAgARCQAQsIACAAIAEQMwsJAEEAKQP4iAELDgBBkQtBABAqQQAQAwALngECAXwBfgJAQQApA7CRAUIAUg0AAkACQBAERAAAAAAAQI9AoiIARAAAAAAAAPBDYyAARAAAAAAAAAAAZnFFDQAgALEhAQwBC0IAIQELQQAgAUKFf3w3A7CRAQsCQAJAEAREAAAAAABAj0CiIgBEAAAAAAAA8ENjIABEAAAAAAAAAABmcUUNACAAsSEBDAELQgAhAQsgAUEAKQOwkQF9CwIACxQAEEUQGBDGAkHQMRB8QdAxELsBCxwAQbiRASABNgIEQQAgADYCuJEBQQJBABBMQQALyAQBAX8jAEEQayIEJAACQAJAAkACQAJAIAFBf2oOEAMCBAQEBAQEBAQEBAQEBAEACyABQTBHDQNBuJEBLQAMRQ0DAkACQEG4kQEoAgRBuJEBKAIIIgJrIgFB4AEgAUHgAUgbIgENAEG4kQFBFGoQ3QIhAgwBC0G4kQFBFGpBACgCuJEBIAJqIAEQ3AIhAgsgAg0DQbiRAUG4kQEoAgggAWo2AgggAQ0DQYgXQQAQKkG4kQFBgAI7AQxBABADAAsgAkUNAkEAKAK4kQFFDQJBuJEBKAIQIAJHDQICQCADLQADQQFxDQAgAy8BDkGAAUcNAEH0FkEAECpBuJEBQRRqIAMQ1wINAEG4kQFBAToADAtBuJEBLQAMRQ0CAkACQEG4kQEoAgRBuJEBKAIIIgJrIgFB4AEgAUHgAUgbIgENAEG4kQFBFGoQ3QIhAgwBC0G4kQFBFGpBACgCuJEBIAJqIAEQ3AIhAgsgAg0CQbiRAUG4kQEoAgggAWo2AgggAQ0CQYgXQQAQKkG4kQFBgAI7AQxBABADAAtBuJEBKAIQIgFFDQEgAUEAIAEtAARrQQxsakFcaiACRw0BQcooQRNBAUEAKALgiAEQrgMaQbiRAUEANgIQDAELQQAoAriRAUUNAEG4kQEoAhANACACKQMIEPoCUQ0AQbiRASACQavU04kBEFAiATYCECABRQ0AIARBC2ogAikDCBCJAyAEIARBC2o2AgBBzQ4gBBAqQbiRASgCEEGAAUG4kQFBBGpBBBBRGgsgBEEQaiQACwYAEDgQMQsXAEEAIAA2AtiTAUEAIAE2AtSTARCaAwsLAEEAQQE6ANyTAQtXAQJ/AkBBAC0A3JMBRQ0AA0BBAEEAOgDckwECQBCdAyIARQ0AAkBBACgC2JMBIgFFDQBBACgC1JMBIAAgASgCDBEDABoLIAAQngMLQQAtANyTAQ0ACwsLIAEBfwJAQQAoAuCTASICDQBBfw8LIAIoAgAgACABEAUL1gIBA38jAEHQAGsiBCQAAkACQAJAAkAQBg0AQc0YQQAQKkF/IQIMAQsCQEEAKALgkwEiBUUNACAFKAIAIgZFDQAgBkHoB0HdKBAMGiAFQQA2AgQgBUEANgIAQQBBADYC4JMBC0EAQQgQHiIFNgLgkwEgBSgCAA0BIABB9wkQxQMhBiAEIAI2AiwgBCABNgIoIAQgADYCJCAEQYkMQYYMIAYbNgIgQdcNIARBIGoQigMhASAEQQE2AkggBCADNgJEIAQgATYCQEEAIQIgBEHAAGoQByIAQQBMDQIgACAFQQNBAhAIGiAAIAVBBEECEAkaIAAgBUEFQQIQChogACAFQQZBAhALGiAFIAA2AgAgBCABNgIAQYUOIAQQKiABEB8LIARB0ABqJAAgAg8LIARBgyI2AjBBkg8gBEEwahAqEAAACyAEQbkhNgIQQZIPIARBEGoQKhAAAAsqAAJAQQAoAuCTASACRw0AQeoYQQAQKiACQQE2AgRBAUEAQQAQuwILQQELIwACQEEAKALgkwEgAkcNAEG/KEEAECpBA0EAQQAQuwILQQELKgACQEEAKALgkwEgAkcNAEG5FkEAECogAkEANgIEQQJBAEEAELsCC0EBC1MBAX8jAEEQayIDJAACQEEAKALgkwEgAkcNACABKAIEIQICQCABKAIMRQ0AIAMgAjYCAEGdKCADECoMAQtBBCACIAEoAggQuwILIANBEGokAEEBCz8BAn8CQEEAKALgkwEiAEUNACAAKAIAIgFFDQAgAUHoB0HdKBAMGiAAQQA2AgQgAEEANgIAQQBBADYC4JMBCwsNACAAKAIEEMYDQQ1qC2sCA38BfiAAKAIEEMYDQQ1qEB4hAQJAIAAoAhAiAkUNACACQQAgAi0ABCIDa0EMbGpBZGopAwAhBCABIAM6AAwgASAENwMACyABIAAoAgg2AgggACgCBCEAIAFBDWogACAAEMYDEKIDGiABC9oCAgZ/AX4CQAJAIAAoAqACIgFFDQAgAEEYaiECA0ACQCACIAEoAgQQxgNBDWoiAxDbAiIERQ0AIARBAUYNAiAAQQA2AqACIAIQ3QIaDAILIAEoAgQQxgNBDWoQHiEEAkAgASgCECIFRQ0AIAVBACAFLQAEIgZrQQxsakFkaikDACEHIAQgBjoADCAEIAc3AwALIAQgASgCCDYCCCABKAIEIQUgBEENaiAFIAUQxgMQogMaIAIgBCADENwCDQIgBBAfAkAgASgCACIBRQ0AA0AgAS0ADEEBcUUNASABKAIAIgENAAsLIAAgATYCoAICQCABDQAgAhDdAhoLIAAoAqACIgENAAsLAkAgAEEQakGg6DsQggNFDQAgABBDCwJAIABBFGpB0IYDEIIDRQ0AIAAtAAhFDQAgAEEAOgAIIABBA0EAQQAQkgMLDwtB6SFBqRxBkgFBnwwQhQMAC9EDAQl/IwBBIGsiASQAAkACQAJAIAAtAAZFDQAgAC0ACQ0BIABBAToACQJAIAAoAgwiAkUNAANAAkAgAigCEA0AAkACQEEAKALwkwEiAw0AQQkhBAwBCwNAQQEhBQJAAkAgAy0AEEEBSw0AQQwhBAwBCwNAQQAhBAJAAkAgAyAFQQxsaiIGQSRqIgcoAgAgAigCCEYNAEEBIQgMAQtBASEIIAZBKWoiCS0AAEEBcQ0AQQ8hBAJAIAIoAhAiCCAHRw0AQQAhCAwBCwJAIAhFDQAgCCAILQAFQf4BcToABQsgCSAJLQAAQQFyOgAAQQAhCCABQRtqIAdBACAGQShqIgYtAABrQQxsakFkaikDABCJAyACKAIEIQkgASAGLQAANgIIIAEgCTYCACABIAFBG2o2AgRBvxogARAqIAIgBzYCECAAQQE6AAggAhBOCyAIRQ0BIAVBAWoiBSADLQAQSQ0AC0EMIQQLIARBDEcNASADKAIAIgMNAAtBCSEECyAEQXdqDgcAAgICAgIAAgsgAigCACICDQALCyAALQAJRQ0CIABBADoACQsgAUEgaiQADwtBjhlBqRxBzgBB5RcQhQMAC0GPGUGpHEHgAEHlFxCFAwALgQUCBH8BfiMAQcAAayICJAACQCAALQAJDQACQAJAAkACQAJAIAEvAQ5B/35qDgQBAwIAAwsgACgCDCIDRQ0DA0ACQCADKAIQIgRFDQAgBCAELQAFQf4BcToABSACIAMoAgQ2AgBBvw4gAhAqIANBADYCECAAQQE6AAggAxBOCyADKAIAIgMNAAwECwALAkAgACgCDCIDRQ0AIAFBGWohBCABLQAMQXBqIQUDQCADKAIEIAQgBRC4A0UNASADKAIAIgMNAAsLIANFDQICQCABKQMQIgZCAFINACADKAIQIgRFDQMgBCAELQAFQf4BcToABSACIAMoAgQ2AhBBvw4gAkEQahAqIANBADYCECAAQQE6AAggAxBODAMLAkACQCAGEE8iBA0AQQAhBAwBCyAEIAFBGGotAAAiBUEMbGpBJGpBACAELQAQIAVLGyEECyAERQ0CIAMoAhAiBSAERg0CAkAgBUUNACAFIAUtAAVB/gFxOgAFCyAEIAQtAAVBAXI6AAUgAkE7aiAEQQAgBC0ABGtBDGxqQWRqKQMAEIkDIAMoAgQhBSACIAQtAAQ2AiggAiAFNgIgIAIgAkE7ajYCJEG/GiACQSBqECogAyAENgIQIABBAToACCADEE4MAgsgAEEYaiIEIAEQ1gINAQJAIAAoAgwiA0UNAANAIAMtAAxBAXFFDQEgAygCACIDDQALCyAAIAM2AqACIAMNASAEEN0CGgwBCyAAQQE6AAcCQCAAKAIMIgNFDQACQANAIAMoAhBFDQEgAygCACIDRQ0CDAALAAsgAEEAOgAHCyAAIAFBkCkQ6AIaCyACQcAAaiQADwtBjhlBqRxBuAFB8AsQhQMACysBAX9BAEGcKRDtAiIANgLkkwEgAEEBOgAGIABBACgCoJEBQaDoO2o2AhALzAEBBH8jAEEQayIBJAACQAJAQQAoAuSTASICLQAJDQAgAkEBOgAJAkAgAigCDCIDRQ0AA0ACQCADKAIQIgRFDQAgBEEAIAQtAARrQQxsakFcaiAARw0AIAQgBC0ABUH+AXE6AAUgASADKAIENgIAQb8OIAEQKiADQQA2AhAgAkEBOgAIIAMQTgsgAygCACIDDQALCyACLQAJRQ0BIAJBADoACSABQRBqJAAPC0GOGUGpHEHhAUGiGBCFAwALQY8ZQakcQecBQaIYEIUDAAvsAQEEfwJAAkBBACgC5JMBIgJFDQAgABDGAyEDAkAgAigCDCIERQ0AA0AgBCgCBCAAIAMQuANFDQEgBCgCACIEDQALCyAEDQAgAi0ACQ0BIAJBDGohAwJAIAIoAqACRQ0AIAJBADYCoAIgAkEYahDdAhoLQRQQHiIFIAE2AgggBSAANgIEAkAgAygCACIERQ0AIAAgBCgCBBDFA0F/TA0AA0AgBCIDKAIAIgRFDQEgACAEKAIEEMUDQX9KDQALCyAFIAQ2AgAgAyAFNgIAIAJBAToACCAFDwsQ+QIAC0GOGUGpHEHrAUGBChCFAwALvQIBBH8jAEEQayIAJAACQAJAAkBBACgC5JMBIgEtAAkNAAJAIAEoAqACRQ0AIAFBADYCoAIgAUEYahDdAhoLIAEtAAkNASABQQE6AAkCQCABKAIMIgJFDQADQAJAIAIoAhAiA0UNACADIAMtAAVB/gFxOgAFIAAgAigCBDYCAEG/DiAAECogAkEANgIQIAFBAToACCACEE4LIAIoAgAiAg0ACwsgAS0ACUUNAiABQQA6AAkCQCABKAIMIgJFDQADQAJAIAIoAhAiA0UNACADIAMtAAVB/gFxOgAFCyABIAIoAgA2AgwgAkEANgIEIAIQHyABKAIMIgINAAsLIAFBAToACCAAQRBqJAAPC0GOGUGpHEHrAUGBChCFAwALQY4ZQakcQbICQcMSEIUDAAtBjxlBqRxBtQJBwxIQhQMACwsAQQAoAuSTARBDCy4BAX8CQEEAKALkkwEoAgwiAUUNAANAIAEoAhAgAEYNASABKAIAIgENAAsLIAEL0QEBAn8jAEHAAGsiAyQAAkACQAJAAkACQCAAQX9qDiAAAQIEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAwQLIAMgAUEUajYCEEHXDyADQRBqECoMAwsgAyABQRRqNgIgQcIPIANBIGoQKgwCCyADIAFBFGo2AjBB4w4gA0EwahAqDAELIAItAAchACACLwEEIQIgAyABLQAEIgQ2AgQgAyACNgIIIAMgADYCDCADIAFBACAEa0EMbGpBcGo2AgBBlB8gAxAqCyADQcAAaiQACzEBAn9BDBAeIQJBACgC6JMBIQMgAiABNgIIIAIgAzYCACACIAA2AgRBACACNgLokwELigEBAX8CQAJAAkBBAC0A7JMBRQ0AQQBBADoA7JMBIAAgASACEEtBACgC6JMBIgMNAQwCC0GRIUGNHUHjAEGgChCFAwALA0AgAygCCCAAIAEgAiADKAIEEQcAIAMoAgAiAw0ACwsCQEEALQDskwENAEEAQQE6AOyTAQ8LQfIhQY0dQekAQaAKEIUDAAuOAQECfwJAAkBBAC0A7JMBDQBBAEEBOgDskwEgACgCECEBQQBBADoA7JMBAkBBACgC6JMBIgJFDQADQCACKAIIQcAAIAEgACACKAIEEQcAIAIoAgAiAg0ACwtBAC0A7JMBDQFBAEEAOgDskwEPC0HyIUGNHUHtAEGdGRCFAwALQfIhQY0dQekAQaAKEIUDAAsxAQF/AkBBACgC8JMBIgFFDQADQAJAIAEpAwggAFINACABDwsgASgCACIBDQALC0EAC00BAn8CQCAALQAQIgJFDQBBACEDA0ACQCAAIANBDGxqQSRqKAIAIAFHDQAgACADQQxsakEkakEAIAAbDwsgA0EBaiIDIAJHDQALC0EAC2ICAn8BfiADQRBqEB4iBEEBOgADIABBACAALQAEIgVrQQxsakFkaikDACEGIAQgATsBDiAEIAU6AA0gBCAGNwIEIAQgAzoADCAEQRBqIAIgAxCiAxogBBDnAiEDIAQQHyADC7ACAQJ/AkACQAJAQQAtAOyTAQ0AQQBBAToA7JMBAkBB9JMBQeCnEhCCA0UNAAJAA0BBACgC8JMBIgBFDQFBACgCoJEBIAAoAhxrQQBIDQFBACAAKAIANgLwkwEgABBTDAALAAtBACgC8JMBIgBFDQADQCAAKAIAIgFFDQECQEEAKAKgkQEgASgCHGtBAEgNACAAIAEoAgA2AgAgARBTCyAAKAIAIgANAAsLQQAtAOyTAUUNAUEAQQA6AOyTAQJAQQAoAuiTASIARQ0AA0AgACgCCEEwQQBBACAAKAIEEQcAIAAoAgAiAA0ACwtBAC0A7JMBDQJBAEEAOgDskwEPC0HyIUGNHUGWAkGNDBCFAwALQZEhQY0dQeMAQaAKEIUDAAtB8iFBjR1B6QBBoAoQhQMAC4gCAQN/IwBBEGsiASQAAkACQAJAQQAtAOyTAUUNAEEAQQA6AOyTASAAEEZBAC0A7JMBDQEgASAAQRRqNgIAQQBBADoA7JMBQcIPIAEQKgJAQQAoAuiTASICRQ0AA0AgAigCCEECIABBACACKAIEEQcAIAIoAgAiAg0ACwtBAC0A7JMBDQJBAEEBOgDskwECQCAAKAIEIgJFDQADQCAAIAIoAgAiAzYCBAJAIAItAAdBBUkNACACKAIMEB8LIAIQHyADIQIgAw0ACwsgABAfIAFBEGokAA8LQZEhQY0dQbEBQcEXEIUDAAtB8iFBjR1BswFBwRcQhQMAC0HyIUGNHUHpAEGgChCFAwALtgwCCX8BfiMAQRBrIgEkAAJAAkACQAJAAkACQAJAAkACQAJAQQAtAOyTAQ0AQQBBAToA7JMBAkAgAC0AAyICQQRxRQ0AQQBBADoA7JMBAkBBACgC6JMBIgNFDQADQCADKAIIQRJBACAAIAMoAgQRBwAgAygCACIDDQALC0EALQDskwFFDQpB8iFBjR1B6QBBoAoQhQMAC0EAIQRBACEFAkBBACgC8JMBIgNFDQAgACkCBCEKA0ACQCADKQMIIApSDQAgAyEFDAILIAMoAgAiAw0AC0EAIQULAkAgBUUNACAFIAAtAA1BP3EiA0EMbGpBJGpBACADIAUtABBJGyEEC0EQIQYCQCACQQFxDQACQCAALQANDQAgAC8BDg0AAkAgBQ0AIAAQVSEFCwJAIAUvARIiBCAALwEQIgNGDQACQCAEQQ9xIANBD3FNDQBBAyAFIAAQTQJAAkBBACgC8JMBIgMgBUcNAEEAIAUoAgA2AvCTAQwBCwNAIAMiBEUNASAEKAIAIgMgBUcNAAsgBCAFKAIANgIACyAFEFMgABBVIQUMAQsgBSADOwESCyAFQQAoAqCRAUGAifoAajYCHCAFQSRqIQQLAkAgBA0AQQAhBAwBC0EQIQYCQCAALQADQQFxDQAgAC0ADUEwSw0AIAAuAQ5Bf0oNAAJAIABBD2otAAAiAyADQf8AcSIDQX9qIAUtABEiBiAGQf8BRhtBAWoiAmtB/wBxIgdFDQBBEyEGIAIgA2tB/ABxQTxJDQEgB0EFSQ0BCyAFIAM6ABFBECEGCwJAAkAgAC0ADCIIQQRJDQAgAC8BDkEDRw0AIAAvARAiAkGA4ANxQYAgRw0CQQAhBwJAIARBACAELQAEIglrQQxsakFgaigCACIDRQ0AIAJB/x9xIQIDQAJAIAIgAy8BBEcNACADLQAGQT9xIAlHDQAgAyEHDAILIAMoAgAiAw0ACwsgB0UNAiAHLAAGIgNBAEgNAiAHIANBgAFyOgAGQQAtAOyTAUUNBEEAQQA6AOyTAQJAQQAoAuiTASIDRQ0AA0AgAygCCEEhIAQgByADKAIEEQcAIAMoAgAiAw0ACwtBAC0A7JMBRQ0BQfIhQY0dQekAQaAKEIUDAAsgAC8BDiICQYDgA3FBgCBHDQFBACEHAkAgBEEAIAQtAAQiCWtBDGxqQWBqKAIAIgNFDQAgAkH/H3EhAgNAAkAgAiADLwEERw0AIAMtAAZBP3EgCUcNACADIQcMAgsgAygCACIDDQALCyAHRQ0BAkACQCAHLQAHIgMgCEcNACAHQQxqIQIgAEEQaiEJAkAgA0EFSQ0AIAIoAgAhAgsgCSACIAMQuAMNAEEBIQkMAQtBACEJCwJAIAhBBUkNACADIAhGDQACQCADQQVJDQAgBygCDBAfCyAHIAAtAAwQHjYCDAsgByAALQAMIgM6AAcgB0EMaiECAkAgA0EFSQ0AIAIoAgAhAgsgAiAAQRBqIAMQogMaIAkNAUEALQDskwFFDQRBAEEAOgDskwEgBC0ABCEDIAcvAQQhAiABIActAAc2AgwgASACNgIIIAEgAzYCBCABIARBACADa0EMbGpBcGo2AgBBlB8gARAqAkBBACgC6JMBIgNFDQADQCADKAIIQSAgBCAHIAMoAgQRBwAgAygCACIDDQALC0EALQDskwENBQtBAEEBOgDskwELAkAgBEUNAEEALQDskwFFDQVBAEEAOgDskwEgBiAEIAAQS0EAKALokwEiAw0GDAkLQQAtAOyTAUUNBkEAQQA6AOyTAQJAQQAoAuiTASIDRQ0AA0AgAygCCEERIAUgACADKAIEEQcAIAMoAgAiAw0ACwtBAC0A7JMBDQcMCQtB8iFBjR1BwAJB2AsQhQMAC0GRIUGNHUHjAEGgChCFAwALQZEhQY0dQeMAQaAKEIUDAAtB8iFBjR1B6QBBoAoQhQMAC0GRIUGNHUHjAEGgChCFAwALA0AgAygCCCAGIAQgACADKAIEEQcAIAMoAgAiAw0ADAMLAAtBkSFBjR1B4wBBoAoQhQMAC0HyIUGNHUHpAEGgChCFAwALQQAtAOyTAUUNAEHyIUGNHUHpAEGgChCFAwALQQBBADoA7JMBIAFBEGokAAuKBAIJfwF+IwBBEGsiASQAQQAhAiAALQAMIgNBAnYiBEEMbEEoaiIFEB5BACAFEKQDIgUgBDoAECAFIAApAgQiCjcDCEEAKAKgkQEhBiAFQf8BOgARIAUgBkGAifoAajYCHCAFQRRqIgcgChCJAyAFIAAoAhA7ARICQCADQQRJDQAgAEEQaiEIIARBASAEQQFLGyEGIAVBJGohCQNAAkACQCACDQBBACEEDAELIAggAkECdGooAgAhBAsgCSACQQxsaiIDIAI6AAQgAyAENgIAIAJBAWoiAiAGRw0ACwsCQAJAQQAoAvCTASICRQ0AIAUpAwgQ+gJRDQAgBUEIaiACQQhqQQgQuANBAEgNACAFQQhqIQRB8JMBIQIDQCACKAIAIgJFDQICQCACKAIAIgNFDQAgBCkDABD6AlENACAEIANBCGpBCBC4A0F/Sg0BCwsgBSACKAIANgIAIAIgBTYCAAwBCyAFQQAoAvCTATYCAEEAIAU2AvCTAQsCQAJAQQAtAOyTAUUNACABIAc2AgBBAEEAOgDskwFB1w8gARAqAkBBACgC6JMBIgJFDQADQCACKAIIQQEgBSAAIAIoAgQRBwAgAigCACICDQALC0EALQDskwENAUEAQQE6AOyTASABQRBqJAAgBQ8LQZEhQY0dQeMAQaAKEIUDAAtB8iFBjR1B6QBBoAoQhQMACzEBAX9BAEEMEB4iATYC+JMBIAEgADYCACABIAAoAhAiAEGACCAAQYAISRtBWGo7AQoL/gMBCn8jAEEQayIAJABBACEBQQAoAviTASECAkAQIA0AAkAgAi8BCEUNAAJAIAIoAgAoAgwRCAANAEF/IQEMAQsgAiACLwEIQShqIgM7AQggA0H//wNxEB4iBEHKiImSBTYAACAEQQApA5iYATcABCAEQShqIQUCQAJAAkAgAigCBCIBRQ0AQQAoApiYASEGA0AgASgCBCEDIAUgAyADEMYDQQFqIgcQogMgB2oiAyABLQAIQQN0Igg2AAAgA0EEaiEJQQAhAwJAIAEtAAgiB0UNAANAIAEgA0EDdGpBDGoiBSAGIAUoAgBrNgIAIANBAWoiAyAHRw0ACwsgCSABQQxqIAgQogMhCUEAIQMCQCABLQAIIgdFDQADQCABIANBA3RqQQxqIgUgBiAFKAIAazYCACADQQFqIgMgB0cNAAsLIAkgCGoiBSAEayACLwEISg0CIAEoAgAiAQ0ACwsgBSAEayACLwEIIgNGDQFB1BVBwxxB2ABBxRMQhQMAC0HvFUHDHEHVAEHFExCFAwALIAQgAyACKAIAKAIEEQMAIQEgACACLwEINgIAQegMQc4MIAEbIAAQKiAEEB8gAQ0AQQAhASACQQA7AQgDQCACKAIEIgNFDQEgAiADKAIANgIEIAMoAgQQHyADEB8MAAsACyAAQRBqJAAgAQ8LEPkCAAvdBQIHfwF8IwBBgAFrIgMkAEEAKAL4kwEhBAJAECANACAAQd0oIAAbIQUCQAJAIAFFDQBBACEGIAFBACABLQAEIgdrQQxsakFcaiEIAkAgB0ECSQ0AIAEoAgAhCUEAIQZBASEAA0AgBiAIIABBDGxqQSRqKAIAIAlGaiEGIABBAWoiACAHRw0ACwsgAyAIKQMINwN4IANB+ABqQQgQiwMhAAJAAkAgASgCABC0ASIHRQ0AIAMgBygCADYCdCADIAA2AnBB6w0gA0HwAGoQigMhByAGRQ0BIAMgBzYCYCADIAZBAWo2AmRB/xkgA0HgAGoQigMhBwwBCyADIAEoAgA2AlQgAyAANgJQQYMJIANB0ABqEIoDIQcgBkUNACADIAc2AkAgAyAGQQFqNgJEQYUaIANBwABqEIoDIQcLIAUtAABFDQEgAyAFNgI0IAMgBzYCMEHkDSADQTBqEIoDIQcMAQsgAxD6AjcDeCADQfgAakEIEIsDIQAgAyAFNgIkIAMgADYCIEHrDSADQSBqEIoDIQcLIAIrAwghCiADQRBqIAMpA3gQjAM2AgAgAyAKOQMIIAMgBzYCAEGHJiADECogBCgCBCIARSEGAkAgAEUNACAAKAIEIAcQxQNFDQADQCAAKAIAIgBFIQYgAEUNASAAKAIEIAcQxQMNAAsLAkACQAJAIAQvAQggBxDGAyIJQQVqQQAgBhtqQQhqIgggBC8BCkoNAAJAIAZFDQBBACEADAILIAAtAAhBCEkNAQsCQAJAEFciBkUNACAHEB8MAQsgCUENaiEIQQAhAAsgBg0BCwJAAkAgAEUNACAHEB8MAQtBzAAQHiIAIAc2AgQgACAEKAIENgIAIAQgADYCBAsgACAALQAIIgdBAWo6AAhBACEGIAAgB0EDdGoiAEEMakEAKAKgmAE2AgAgAEEQaiACKwMItjgCACAEIAg7AQgLIANBgAFqJAAgBg8LEPkCAAuVAgEBfyMAQSBrIgYkACABKAIIKAIsIQECQAJAIAIQ0QINACAAIAFB5AAQaQwBCyAGIAQpAwA3AwggASAGQQhqIAZBHGoQxAEhBAJAQQEgAkEDcXQgA2ogBigCHE0NAAJAIAVFDQAgACABQecAEGkMAgsgAEEAKQP4LTcDAAwBCyAEIANqIQECQCAFRQ0AIAYgBSkDADcDEAJAAkAgBigCFEF/Rw0AIAEgAiAGKAIQENMCDAELIAYgBikDEDcDACABIAIgBhDBARDSAgsgAEEAKQP4LTcDAAwBCwJAIAJBB0sNACABIAIQ1AIiA0H/////B2pBfUsNACAAIAMQvQEMAQsgACABIAIQ1QIQvAELIAZBIGokAAsgAAJAIAEgAkEDcXYNAEQAAAAAAAD4fw8LIAAgAhDVAgtMAQJ/IwBBEGsiASQAAkAgACgCjAEiAkUNACAALQAGQQhxDQAgASACLwEAOwEIIABBxwAgAUEIakECEH8LIABCADcCjAEgAUEQaiQAC2oBAX8CQCAALQAVQQFxRQ0AQZEIQesbQRdBtwwQhQMACyAAKAIIKAIsIAAoAgwtAApBA3QQhAEgACgCECAALQAUQQN0EKIDIQEgACAAKAIMLQAKOgAUIAAgATYCECAAIAAtABVBAXI6ABULlgIBAX8CQAJAIAAoAiwiBCAEKAKIASIEIAQoAkBqIAFBBHRqIgQvAQhBA3RBGGoQhAEiAUUNACABIAM6ABQgASACNgIQIAEgBCgCACICOwEAIAEgAiAEKAIEajsBAiAAKAIoIQIgASAENgIMIAEgADYCCCABIAI2AgQCQCACRQ0AIAEoAggiACABNgIoIAAoAiwiAC8BCA0BIAAgATYCjAEPCwJAIANFDQAgAS0AFUEBcQ0CIAEoAggoAiwgASgCDC0ACkEDdBCEASABKAIQIAEtABRBA3QQogMhBCABIAEoAgwtAAo6ABQgASAENgIQIAEgAS0AFUEBcjoAFQsgACABNgIoCw8LQZEIQesbQRdBtwwQhQMACwkAIAAgATYCFAtfAQJ/IwBBEGsiAiQAIAAgACgCLCIDKAKgASABajYCFAJAIAMoAowBIgBFDQAgAy0ABkEIcQ0AIAIgAC8BADsBCCADQccAIAJBCGpBAhB/CyADQgA3AowBIAJBEGokAAuwBAEGfyMAQTBrIgEkAAJAAkACQCAAKAIEIgJFDQAgAigCCCIDIAI2AigCQCADKAIsIgMvAQgNACADIAI2AowBCyAAKAIIKAIsIQICQCAALQAVQQFxRQ0AIAIgACgCEBCGAQsgAiAAEIYBDAELIAAoAggiAygCLCIEKAKIAUHEAGooAgBBBHYhBSADLwESIQICQCADLQAMQRBxRQ0AQYIhIQYCQCAFIAJNDQAgBCgCiAEiBSAFIAUoAmBqIAUgBSgCQGogAkEEdGovAQxBA3RqKAIAaiEGCyABIAI2AhggASAGNgIUIAFB8BE2AhBBjBogAUEQahAqIAMgAy0ADEHvAXE6AAwgACAAKAIMKAIAOwEADAELQYIhIQYCQCAFIAJNDQAgBCgCiAEiBSAFIAUoAmBqIAUgBSgCQGogAkEEdGovAQxBA3RqKAIAaiEGCyABIAI2AgggASAGNgIEIAFByxc2AgBBjBogARAqAkAgAygCLCICKAKMASIFRQ0AIAItAAZBCHENACABIAUvAQA7ASggAkHHACABQShqQQIQfwsgAkIANwKMASAAKAIIKAIsIQICQCAALQAVQQFxRQ0AIAIgACgCEBCGAQsgAiAAEIYBIAMQlAECQAJAIAMoAiwiBSgClAEiACADRw0AIAUgAygCADYClAEMAQsDQCAAIgJFDQMgAigCACIAIANHDQALIAIgAygCADYCAAsgBSADEIYBCyABQTBqJAAPCxD5AgALfgEEfwJAIAAoApQBIgFFDQADQCAAIAEoAgA2ApQBIAEQlAECQCABKAIoIgJFDQADQCACKAIEIQMgAigCCCgCLCEEAkAgAi0AFUEBcUUNACAEIAIoAhAQhgELIAQgAhCGASADIQIgAw0ACwsgACABEIYBIAAoApQBIgENAAsLCygAAkAgACgClAEiAEUNAANAIAAvARIgAUYNASAAKAIAIgANAAsLIAALKAACQCAAKAKUASIARQ0AA0AgACgCGCABRg0BIAAoAgAiAA0ACwsgAAvTAgEEfyMAQRBrIgUkAEEAIQYCQCAALwEIDQACQCAEQQFGDQACQCAAKAKUASIGRQ0AA0AgBi8BEiABRg0BIAYoAgAiBg0ACwsgBkUNAAJAAkACQCAEQX5qDgMEAAIBCyAGIAYtAAxBEHI6AAwMAwsQ+QIACyAGEGULQQAhBiAAQTAQhAEiBEUNACAEIAE7ARIgBCAANgIsIAAgACgCtAFBAWoiBjYCtAEgBCAGNgIYQYIhIQYCQCAEKAIsIgcoAogBQcQAaigCAEEEdiAELwESIghNDQAgBygCiAEiBiAGIAYoAmBqIAYgBigCQGogCEEEdGovAQxBA3RqKAIAaiEGCyAFIAg2AgggBSAGNgIEIAVBmgo2AgBBjBogBRAqIAQgASACIAMQXSAEIAAoApQBNgIAIAAgBDYClAEgBCAAKQOgAT4CFCAEIQYLIAVBEGokACAGC+8CAQR/IwBBIGsiASQAQYIhIQICQCAAKAIsIgMoAogBQcQAaigCAEEEdiAALwESIgRNDQAgAygCiAEiAiACIAIoAmBqIAIgAigCQGogBEEEdGovAQxBA3RqKAIAaiECCyABIAQ2AgggASACNgIEIAFBpRY2AgBBjBogARAqAkAgACgCLCICKAKQASAARw0AAkAgAigCjAEiBEUNACACLQAGQQhxDQAgASAELwEAOwEYIAJBxwAgAUEYakECEH8LIAJCADcCjAELAkAgACgCKCICRQ0AA0AgAigCBCEEIAIoAggoAiwhAwJAIAItABVBAXFFDQAgAyACKAIQEIYBCyADIAIQhgEgBCECIAQNAAsLIAAQlAECQAJAAkAgACgCLCIDKAKUASICIABHDQAgAyAAKAIANgKUAQwBCwNAIAIiBEUNAiAEKAIAIgIgAEcNAAsgBCAAKAIANgIACyADIAAQhgEgAUEgaiQADwsQ+QIAC60BAQR/IwBBEGsiASQAAkAgACgCLCICLwEIDQAQ7wIgAkEAKQOYmAE3A6ABIAAQmAFFDQAgABCUASAAQQA2AhQgAEH//wM7AQ4gAiAANgKQASAAKAIoIgMoAggiBCADNgIoAkAgBCgCLCIELwEIDQAgBCADNgKMAQsCQCACLQAGQQhxDQAgASAAKAIoLwEAOwEIIAJBxgAgAUEIakECEH8LIAIQyQELIAFBEGokAAsSABDvAiAAQQApA5iYATcDoAEL3wIBB38jAEEgayICJAACQCAALwEIDQAgAUHg1AMgARshAQJAAkAgACgCjAEiAw0AQQAhAwwBCyADLwEAIQMLIAAgAzsBCgJAAkAgAUHg1ANHDQBBuxhBABAqDAELIAIgATYCECACIANB//8DcTYCFEGtGiACQRBqECoLIAAgATsBCCABQeDUA0YNACAAKAKMASIDRQ0AA0AgAy8BACADKAIMIgQoAgBrIQVBgiEhBgJAIAAoAogBIgFBxABqKAIAQQR2IAQgASABKAJAaiIHayIIQQR1IgRNDQAgASABIAEoAmBqIAcgCGpBDGovAQBBA3RqKAIAaiEGCyACIAQ2AgggAiAGNgIEIAIgBTYCAEGcGiACECogAygCBCIDDQALCwJAIAAoAowBIgFFDQAgAC0ABkEIcQ0AIAIgAS8BADsBGCAAQccAIAJBGGpBAhB/CyAAQgA3AowBIAJBIGokAAsiACABIAJB5AAgAkHkAEsbQeDUA2oQaCAAQQApA/gtNwMAC44BAQR/EO8CIABBACkDmJgBNwOgAQNAQQAhAQJAIAAvAQgNACAAKAKUASIBRSECAkAgAUUNACAAKAKgASEDAkACQCABKAIUIgRFDQAgBCADTQ0BCwNAIAEoAgAiAUUhAiABRQ0CIAEoAhQiBEUNACAEIANLDQALCyAAEJwBIAEQZgsgAkEBcyEBCyABDQALCw4AIABBwgAgARBsQQRqC4wBAQN/QQAhAwJAIAJBgOADSw0AIAAgACgCCEEBaiIENgIIIAJBA2ohBQJAAkAgBEEgSQ0AIARBH3ENAQsQHQsgBUECdiEFAkAQoAFBAXFFDQAgABBtCwJAIAAgASAFEG4iBA0AIAAQbSAAIAEgBRBuIQQLIARFDQAgBEEEakEAIAIQpAMaIAQhAwsgAwu5BwEKfwJAIAAoAgwiAUUNAAJAIAEoAogBLwEMIgJFDQAgASgCACEDQQAhBANAAkAgAyAEQQN0aiIFKAAEQYCBYHFBgIHA/wdHDQAgBSgAACIFRQ0AIAVBChB3CyAEQQFqIgQgAkcNAAsLAkAgAS0AMyICRQ0AQQAhBANAAkAgASAEQQN0aiIFQTxqKAAAQYCBYHFBgIHA/wdHDQAgBUE4aigAACIFRQ0AIAVBChB3CyAEQQFqIgQgAkcNAAsLIAEoApQBIgZFDQADQAJAIAZBJGooAABBgIFgcUGAgcD/B0cNACAGKAAgIgRFDQAgBEEKEHcLAkAgBigCKCIBRQ0AA0ACQCABLQAVQQFxRQ0AIAEtABQiAkUNACABKAIQIQNBACEEA0ACQCADIARBA3RqIgUoAARBgIFgcUGAgcD/B0cNACAFKAAAIgVFDQAgBUEKEHcLIARBAWoiBCACRw0ACwtBACEEAkAgASgCDC8BCCICRQ0AA0ACQCABIARBA3RqIgVBHGooAABBgIFgcUGAgcD/B0cNACAFQRhqKAAAIgVFDQAgBUEKEHcLIARBAWoiBCACRw0ACwsgASgCBCIBDQALCyAGKAIAIgYNAAsLIABBADYCAEEAIQdBACEEAkACQAJAAkACQANAIAQhCAJAAkAgACgCBCIJDQBBACEKDAELQQAhCgNAIAlBCGohAQNAAkAgASgCACICQYCAgHhxIgZBgICA+ARGIgMNACABIAkoAgRPDQUCQCACQX9KDQAgCA0HIAFBChB3QQEhCgwBCyAIRQ0AIAIhBCABIQUCQAJAIAZBgICACEYNACACIQQgASEFIAJBgICAgAZxDQELA0AgBEH///8HcSIERQ0JIAUgBEECdGoiBSgCACIEQYCAgHhxQYCAgAhGDQAgBEGAgICABnFFDQALCwJAIAUgAUYNACABIAUgAWtBAnUiBEGAgIAIcjYCACAEQf///wdxIgRFDQkgAUEEakE3IARBAnRBfGoQpAMaIAdBBGogACAHGyABNgIAIAFBADYCBCABIQcMAQsgASACQf////99cTYCAAsCQCADDQAgASgCAEH///8HcSIERQ0JIAEgBEECdGohAQwBCwsgCSgCACIJDQALCyAIQQBHIApFciEEIAhFDQALDwtB/hdB2R5BugFByhEQhQMAC0HJEUHZHkHAAUHKERCFAwALQbIhQdkeQaABQckVEIUDAAtBsiFB2R5BoAFByRUQhQMAC0GyIUHZHkGgAUHJFRCFAwALlQIBCH8CQAJAAkACQCAAKAIAIgMNAEECIQQMAQsgAUEYdCIFIAJBAWoiAXIhBiABQf///wdxIgdBAnQhCEEAIQkDQCADIgMoAgBB////B3EiBEUNAgJAAkAgBCACayIBQQFODQBBBCEEDAELAkACQCABQQNIDQAgAyAGNgIAIAdFDQYgAyAIaiIEIAFBf2pBgICACHI2AgAgBCADKAIENgIEDAELIAMgBCAFcjYCACADKAIEIQQLIAlBBGogACAJGyAENgIAQQEhBCADIQoLIAFBAEoNASADIQkgAygCBCIDDQALQQIhBAtBACAKIARBAkYbDwtBsiFB2R5BoAFByRUQhQMAC0GyIUHZHkGgAUHJFRCFAwALggEBAX8CQAJAAkACQCABRQ0AIAFBA3ENASABQXxqIgIoAgAiAUGAgIB4cUGAgICQBEcNAiABQf///wdxIgFFDQMgAiABQYCAgBByNgIACw8LQaAkQdkeQbECQZ8SEIUDAAtBpSdB2R5BswJBnxIQhQMAC0GyIUHZHkGgAUHJFRCFAwALkwEBAn8CQAJAAkACQCABRQ0AIAFBA3ENASABQXxqIgIoAgAiA0GAgIB4cUGAgICQBEcNAiADQf///wdxIgNFDQMgAiADQYCAgAhyNgIAIAFBxwAgA0ECdEF8ahCkAxoLDwtBoCRB2R5BsQJBnxIQhQMAC0GlJ0HZHkGzAkGfEhCFAwALQbIhQdkeQaABQckVEIUDAAsKACAAQQRBDBBsC2kBA39BACECAkAgAUEDdCIDQYDgA0sNACAAQcMAQRAQbCIERQ0AAkAgAUUNACAAQcIAIAMQbCECIAQgATsBCiAEIAE7AQggBCACQQRqNgIMCyAEIAQoAgBBgICAgARzNgIAIAQhAgsgAgstAQF/QQAhAgJAIAFBgOADSw0AIABBBSABQQxqEGwiAkUNACACIAE7AQQLIAILCQAgACABNgIMC1kBAn9BkIAEEB4iACAAQYyABGpBfHEiATYCFCABQYGAgPgENgIAIAAoAgQhASAAIABBEGo2AgQgACABNgIQIAAgACgCFCAAQRhqa0ECdUGAgIAIcjYCGCAACw0AIABBADYCBCAAEB8LlAMBBH8CQAJAAkACQAJAIAAoAgAiAkEYdkEPcSIDQQFGDQAgAkGAgICAAnENAAJAIAFBAEoNACAAIAJBgICAgHhyNgIADwsgACACQf////8FcUGAgICAAnI2AgACQAJAAkAgA0F+ag4EAwIBAAcLIAAoAggiAEUNAiAAKAIIIAAvAQQgAUF+ahB4DwsgAEUNASAAKAIIIAAvAQQgAUF+ahB4DwsCQCAAKAIEIgJFDQAgAigCCCACLwEEIAFBfmoQeAsgACgCDCIDRQ0AIANBA3ENASADQXxqIgQoAgAiAkGAgICAAnENAiACQYCAgPgAcUGAgIAQRw0DIAAvAQghBSAEIAJBgICAgAJyNgIAIAVFDQAgAUF/aiEBQQAhAANAAkAgAyAAQQN0aiICKAAEQYCBYHFBgIHA/wdHDQAgAigAACICRQ0AIAIgARB3CyAAQQFqIgAgBUcNAAsLDwtBoCRB2R5B1gBBpxAQhQMAC0G7IkHZHkHYAEGnEBCFAwALQbIfQdkeQdkAQacQEIUDAAsQ+QIAC8cBAQJ/AkACQAJAAkAgAEUNACAAQQNxDQEgAEF8aiIDKAIAIgRBgICAgAJxDQIgBEGAgID4AHFBgICAEEcNAyADIARBgICAgAJyNgIAIAFFDQBBACEEA0ACQCAAIARBA3RqIgMoAARBgIFgcUGAgcD/B0cNACADKAAAIgNFDQAgAyACEHcLIARBAWoiBCABRw0ACwsPC0GgJEHZHkHWAEGnEBCFAwALQbsiQdkeQdgAQacQEIUDAAtBsh9B2R5B2QBBpxAQhQMACwIAC6kCAQJ/AkACQAJAAkACQAJAAkAgAS8BDiICQYB/ag4EAAEEAgMLQQAhAgJAIAEtAAwiA0UNAANAIAEgAmpBEGotAABFDQEgAkEBaiICIANHDQALIAMhAgsgAkEBaiICIANPDQQgAUEQaiEBIAEgAyACayIDQQN2IANBeHEiA0EBchAeIAEgAmogAxCiAyICIAAoAggoAgARBgAhASACEB8gAUUNBEHmGUEAECoPCyABQRBqIAEtAAwgACgCCCgCBBEDAEUNA0HJGUEAECoPCyABLQAMIgJBCEkNAiABKAIQIAFBFGooAgAgAkEDdkF/aiABQRhqIAAoAggoAhQRCQAaDwsgAkGAI0YNAgsgARDmAhoLDwsgASAAKAIIKAIMEQgAQf8BcRDiAhoLVgEEf0EAKAL8kwEhBCAAEMYDIgUgAkEDdCIGakEFaiIHEB4iAiABNgAAIAJBBGogACAFQQFqIgEQogMgAWogAyAGEKIDGiAEQYEBIAIgBxCSAyACEB8LGgEBf0GsKRDtAiIBIAA2AghBACABNgL8kwELOQEBf0EAIQMCQCAAIAEQyAENAEGgBxAeIgMgAi0AADoAvAEgAyADLwEGQQhyOwEGIAMgABB+CyADC9sBAQJ/IwBBIGsiAiQAIAAgATYCiAEgABB1IgE2ArgBAkAgASAAKAKIAS8BDEEDdCIDEGsiAQ0AIAIgAzYCEEG1JSACQRBqECogAEHk1AMQaAsgACABNgIAAkAgACgCuAEgACgCiAFB3ABqKAIAQQF2Qfz///8HcSIDEGsiAQ0AIAIgAzYCAEG1JSACECogAEHk1AMQaAsgACABNgKYAQJAIAAvAQgNACAAEGcgABCcASAAEJ0BIAAvAQgNACAAKAK4ASAAEHQgAEEAQQBBAEEBEGQaCyACQSBqJAALKgEBfwJAIAAtAAZBCHENACAAKAKoASAAKAKgASIERg0AIAAgBDYCqAELCxkAAkAgAUUNACABIAAvAQo2AgALIAAvAQgLmAIBAX8CQAJAAkAgAEUNACAALwEGIgRBAXENASAAIARBAXI7AQYCQAJAIAFBMEYNACAAEGcCQAJAAkACQCABQXBqDgMAAgEDCwJAIAAtAAZBCHENACAAKAKoASAAKAKgASIBRg0AIAAgATYCqAELIAAgAiADEJoBDAQLIAAtAAZBCHENAyAAKAKoASAAKAKgASIBRg0DIAAgATYCqAEMAwsgAC0ABkEIcQ0CIAAoAqgBIAAoAqABIgFGDQIgACABNgKoAQwCCyABQcAARw0BIAAgAxCbAQwBCyAAEGoLIAAvAQYiAUEBcUUNAiAAIAFB/v8DcTsBBgsPC0GUIkGvG0E2QfEQEIUDAAtBySRBrxtBO0GKFhCFAwALbQEBfyAAEJ4BAkAgAC8BBiIBQQFxRQ0AQZQiQa8bQTZB8RAQhQMACyAAIAFBAXI7AQYgAEG8A2oQpwEgABBhIAAoArgBIAAoAgAQcCAAKAK4ASAAKAKYARBwIAAoArgBEHYgAEEAQaAHEKQDGgsTAAJAIABFDQAgABCCASAAEB8LCz0BAn8jAEEQayICJAACQCAAKAK4ASABEGsiAw0AIAIgATYCAEG1JSACECogAEHk1AMQaAsgAkEQaiQAIAMLKgEBfyMAQRBrIgIkACACIAE2AgBBtSUgAhAqIABB5NQDEGggAkEQaiQACwwAIAAoArgBIAEQcAvIAwEFfyMAQRBrIgEkAAJAIAAoAiwiAkEASA0AAkACQCAAKAIQKAIAIgMoAgBB0/qq7HhHDQAgAygCCEGrlvGTe0YNAQtBACEDCwJAAkAgAw0AQQAhBAwBCyADKAIEIQQLAkAgAiAESA0AIABBMGoQ3QIaIABBfzYCLAwBCwJAAkAgAEEwaiIFIAMgAmpBgAFqIARB7AEgBEHsAUgbIgMQ3AIOAgACAQsgACAAKAIsIANqNgIsDAELIABBfzYCLCAFEN0CGgsCQCAAQQxqQYCAgAQQggNFDQAgAC0AB0UNACAAKAIUDQAgABCIAQsCQCAAKAIUIgNFDQAgAyABQQhqEIABIgNFDQAgASABKAIINgIEIAFBACADIANB4NQDRhs2AgAgAEGAASABQQgQkgMgACgCFBCDASAAQQA2AhQCQAJAIAAoAhAoAgAiAigCAEHT+qrseEcNACACKAIIQauW8ZN7Rg0BC0EAIQILAkACQCACRQ0AQQMhBCACKAIEDQELQQQhBAsgASAENgIMIABBADoABiAAQQQgAUEMakEEEJIDIABBACgCoJEBQYCAwABBgIDAAiADQeDUA0YbajYCDAsgAUEQaiQAC9wCAQR/IwBBEGsiASQAAkACQCAAKAIQKAIAIgIoAgBB0/qq7HhHDQAgAigCCEGrlvGTe0YNAQtBACECCwJAAkAgAkUNACACKAIEIgNFDQAgAkGAAWoiBCADEMgBDQAgAigCBCECAkAgACgCFCIDRQ0AIAMQgwELIAEgAC0ABDoAACAAIAQgAiABEH0iAjYCFCACRQ0BIAIgAC0ACBCfAQwBCwJAIAAoAhQiAkUNACACEIMBCyABIAAtAAQ6AAggAEHYKUHgASABQQhqEH0iAjYCFCACRQ0AIAIgAC0ACBCfAQtBACECAkAgACgCFCIDDQACQAJAIAAoAhAoAgAiBCgCAEHT+qrseEcNACAEKAIIQauW8ZN7Rg0BC0EAIQQLAkAgBEUNAEEDIQIgBCgCBA0BC0EEIQILIAEgAjYCDCAAIANBAEc6AAYgAEEEIAFBDGpBBBCSAyABQRBqJAALhwEBA38jAEEQayIBJAAgACgCFBCDASAAQQA2AhQCQAJAIAAoAhAoAgAiAigCAEHT+qrseEcNACACKAIIQauW8ZN7Rg0BC0EAIQILAkACQCACRQ0AQQMhAyACKAIEDQELQQQhAwsgASADNgIMIABBADoABiAAQQQgAUEMakEEEJIDIAFBEGokAAv5AgEFfyMAQZABayIBJAAgASAANgIAQQAoAoCUASECQfceIAEQKkF/IQMCQCAAQR9xDQAgAigCECgCBEGAf2ogAE0NACACKAIUEIMBIAJBADYCFAJAAkAgAigCECgCACIDKAIAQdP6qux4Rw0AIAMoAghBq5bxk3tGDQELQQAhAwsCQAJAIANFDQBBAyEEIAMoAgQNAQtBBCEECyABIAQ2AghBACEDIAJBADoABiACQQQgAUEIakEEEJIDIAIoAhAoAgAQFiAARQ0AIAEgADYCDCABQdP6qux4NgIIIAIoAhAoAgAgAUEIakEIEBUgAkGAATYCGEEAIQNBACEAAkAgAigCFCIEDQACQAJAIAIoAhAoAgAiBSgCAEHT+qrseEcNACAFKAIIQauW8ZN7Rg0BC0EAIQULAkAgBUUNAEEDIQAgBSgCBA0BC0EEIQALIAEgADYCjAEgAiAEQQBHOgAGIAJBBCABQYwBakEEEJIDCyABQZABaiQAIAML6gMBBn8jAEGwAWsiAiQAQX8hAwJAQQAoAoCUASIEKAIYIgVFDQACQCAADQAgBCgCECgCACEBIAJBKGpBAEGAARCkAxogAkGrlvGTezYCMCACIAFBgAFqIAEoAgQQ+AI2AjQCQCABKAIEIgBBgAFqIgUgBCgCGCIGRg0AIAIgADYCBCACIAUgBms2AgBBjCcgAhAqDAILIAFBCGogAkEoakEIakH4ABAVEBdBpRJBABAqIAQoAhQQgwEgBEEANgIUAkACQCAEKAIQKAIAIgMoAgBB0/qq7HhHDQAgAygCCEGrlvGTe0YNAQtBACEDCwJAAkAgA0UNAEEDIQEgAygCBA0BC0EEIQELIAIgATYCrAFBACEDIARBADoABiAEQQQgAkGsAWpBBBCSAyAEQQNBAEEAEJIDIARBACgCoJEBNgIMDAELIAQoAhAoAgAiBigCBEGAAWohAwJAAkACQCABQR9xDQAgAUH/D0sNACAFIAFqIgcgA00NAQsgAiADNgIYIAIgBTYCFCACIAE2AhBB5iYgAkEQahAqQX8hA0EAIQEMAQsCQCAHIAVzQYAQSQ0AIAYgB0GAcHFqEBYLIAYgBCgCGGogACABEBUgBCgCGCABaiEBQQAhAwsgBCABNgIYCyACQbABaiQAIAMLfwEBfwJAAkBBACgCgJQBKAIQKAIAIgEoAgBB0/qq7HhHDQAgASgCCEGrlvGTe0YNAQtBACEBCwJAIAFFDQAQsAEgAUGAAWogASgCBBCxASAAELIBQQAPCyAAQgA3AAAgAEEYakIANwAAIABBEGpCADcAACAAQQhqQgA3AABBfwuTBQECfyMAQSBrIgIkAAJAAkACQAJAAkACQCABLwEOIgNBgF1qDgMBAgMACwJAAkAgA0GAf2oOAgABBQsgASgCEBCKAQ0FIAEgAEEcakELQQwQzgJB//8DcRDjAhoMBQsgAEEwaiABENYCDQQgAEEANgIsDAQLAkACQCAAKAIQKAIAIgAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQCADDQAgAUEAEOQCGgwECyABIAAoAgQQ5AIaDAMLAkACQCAAKAIQKAIAIgAoAgBB0/qq7HhHDQAgACEDIAAoAghBq5bxk3tGDQELQQAhAwsCQCADDQAgAUEAEOQCGgwDCyABIAAoAgwQ5AIaDAILAkACQEEAKAKAlAEoAhAoAgAiACgCAEHT+qrseEcNACAAKAIIQauW8ZN7Rg0BC0EAIQALAkACQCAARQ0AELABIABBgAFqIAAoAgQQsQEgAhCyAQwBCyACQRhqQgA3AwAgAkEQakIANwMAIAJCADcDCCACQgA3AwALIAEtAA0gAS8BDiACQSAQmwMaDAELAkAgA0GDIkYNAAJAAkACQCAAIAFBvCkQ6AJBgH9qDgMAAQIECwJAIAAtAAYiAUUNAAJAIAAoAhQNACAAQQA6AAYgABCIAQwFCyABDQQLIAAoAhRFDQMgABCJAQwDCyAALQAHRQ0CIABBACgCoJEBNgIMDAILIAAoAhQiAUUNASABIAAtAAgQnwEMAQtBACEDAkAgACgCFA0AAkACQCAAKAIQKAIAIgAoAgBB0/qq7HhHDQAgACgCCEGrlvGTe0YNAQtBACEACwJAIABFDQBBAyEDIAAoAgQNAQtBBCEDCyABIAMQ5AIaCyACQSBqJAALPQACQEEAKAKAlAEgAEFkakcNAAJAIAFBEGogAS0ADBCLAUUNACAAENACCw8LQZUWQYccQf0BQZgREIUDAAs0AAJAQQAoAoCUASAAQWRqRw0AAkAgAQ0AQQBBABCLARoLDwtBlRZBhxxBhQJBpxEQhQMAC7gBAQN/QQAhAkEAKAKAlAEhA0F/IQQCQCABEIoBDQACQCABDQBBfg8LAkACQANAIAAgAmogASACayIEQYABIARBgAFJGyIEEIsBDQEgBCACaiICIAFPDQIMAAsAC0F9DwtBfCEEQQBBABCLAQ0AAkACQCADKAIQKAIAIgIoAgBB0/qq7HhHDQAgAigCCEGrlvGTe0YNAQtBACECCwJAIAINAEF7DwsgAkGAAWogAigCBBDIASEECyAEC2ABAX9ByCkQ7QIiAUF/NgIsIAEgADYCECABQYECOwAHIAFBACgCoJEBQYCA4ABqNgIMAkBB2ClB4AEQyAFFDQBBuCNBhxxBjANB8AoQhQMAC0ENIAEQTEEAIAE2AoCUAQsaAAJAIAAoAhQiAEUNACAAIAEgAiADEIEBCwvRAgEDfwJAAkAgAC8BCA0AAkACQCAAKAKYASABQQJ0aigCACgCECIFRQ0AIABBvANqIgYgASACIAQQqgEiB0UNACAHKAIEQaD3NiADIANB34hJakHgiElJG2ogACgCoAFPDQEgBiAHEKYBCyAAKAKQASIARQ0CIAAgAjsBECAAIAE7AQ4gACAEOwEEIABBBmpBFDsBACAAIAAtAAxB8AFxQQFyOgAMIABBABBfDwsgBiAHEKgBIQEgAEHIAWpCADcDACAAQgA3A8ABIABBzgFqIAEvAQI7AQAgAEHMAWogAS0AFDoAACAAQc0BaiAFLQAEOgAAIABBxAFqIAVBACAFLQAEa0EMbGpBZGopAwA3AgAgAEHQAWohAiABQQhqIQACQCABLQAUIgFBCkkNACAAKAIAIQALIAIgACABEKIDGgsPC0GBIEG8HkEpQcQQEIUDAAstAAJAIAAtAAxBD3FBAkcNACAAKAIsIAAoAgQQhgELIAAgAC0ADEHwAXE6AAwL4wIBAn8CQAJAIAAvAQgNAAJAIAJBgGBxQYDAAEcNACAAQbwDaiIDIAEgAkH/n39xQYAgckEAEKoBIgRFDQAgAyAEEKYBCyAAKAKQASIDRQ0BAkAgACgCiAEiBCAEKAJYaiABQQN0aigCAEHt8tmMAUcNACADQQAQXwJAIAAoApQBIgNFDQADQAJAIAMvAQ4gAUcNACADIAMtAAxBIHI6AAwLIAMoAgAiAw0ACwsgACgClAEiA0UNAQNAAkAgAy0ADCIBQSBxRQ0AIAMgAUHfAXE6AAwgAxBmIAAoApQBIgMNAQwDCyADKAIAIgMNAAwCCwALIAMgAjsBECADIAE7AQ4gAEHMAWotAAAhASADIAMtAAxB8AFxQQJyOgAMIAMgACABEIQBIgI2AgQCQCACRQ0AIANBCGogAToAACACIABB0AFqIAEQogMaCyADQQAQXwsPC0GBIEG8HkHLAEGRGBCFAwALrwEBAn8CQAJAIAAvAQgNACAAKAKQASIERQ0BIARB//8DOwEOIAQgBC0ADEHwAXFBA3I6AAwgBCAAKAKsASIFOwEQIAAgBUEBajYCrAEgBEEIaiADOgAAIAQgATsBBCAEQQZqIAI7AQAgBEEBEJcBRQ0AAkAgBC0ADEEPcUECRw0AIAQoAiwgBCgCBBCGAQsgBCAELQAMQfABcToADAsPC0GBIEG8HkHnAEHwExCFAwAL+gIBB38jAEEQayICJAACQAJAAkAgAC8BECIDIAAoAiwiBCgCsAEiBUH//wNxRg0AIAENACAAQQMQXwwBCyAEKAKIASIGIAYgBigCYGogAC8BBEEDdGoiBigCAGogBigCBCAEQdIBaiIHQeoBIAAoAiggAEEGai8BAEEDdGpBGGogAEEIai0AAEEAELMBIQYgBEG7A2pBADoAACAEQdEBakEAOgAAIARB0AFqIAM6AAAgBEHOAWpBggE7AQAgBEHMAWoiCCAGQQJqOgAAIARBzQFqIAQtALwBOgAAIARBxAFqEPoCNwIAIARBwwFqQQA6AAAgBEHCAWogCC0AAEEHakH8AXE6AAACQCABRQ0AIAIgBzYCAEH7DyACECoLQQEhASAELQAGQQJxRQ0BAkAgAyAFQf//A3FHDQACQCAEQcABahDnAg0AQQEhASAEIAQoArABQQFqNgKwAQwDCyAAQQMQXwwBCyAAQQMQXwtBACEBCyACQRBqJAAgAQvdBQIGfwF+AkAgAC0ADEEPcSIBDQBBAQ8LAkACQAJAAkACQAJAAkAgAUF/ag4DAAECAwsgACgCLCIBKAKYASAALwEOIgJBAnRqKAIAKAIQIgNFDQUCQCABQcMBai0AAEEBcQ0AIAFBzgFqLwEAIgRFDQAgBCAALwEQRw0AIAMtAAQiBCABQc0Bai0AAEcNACADQQAgBGtBDGxqQWRqKQMAIAFBxAFqKQIAUg0AIAEgAiAALwEEEJkBIgNFDQAgAUG8A2ogAxCoARpBAQ8LAkAgACgCFCABKAKgAUsNAAJAAkAgAC8BBCICDQBBACEDQQAhAgwBCyABKAKIASIDIAMgAygCYGogAkEDdGoiAygCAGohAiADKAIEIQMLIAFBwAFqIQQgAC8BECEFIAAvAQ4hBiABQQE6AMMBIAFBwgFqIANBB2pB/AFxOgAAIAEoApgBIAZBAnRqKAIAKAIQIgZBACAGLQAEIgZrQQxsakFkaikDACEHIAFBzgFqIAU7AQAgAUHNAWogBjoAACABQcwBaiADOgAAIAFBxAFqIAc3AgACQCACRQ0AIAFB0AFqIAIgAxCiAxoLIAQQ5wIiAUUhAyABDQQCQCAALwEGIgJB5wdLDQAgACACQQF0OwEGCyAAIAAvAQYQXyABDQULQQAPCyAAKAIsIgEoApgBIAAvAQ5BAnRqKAIAKAIQIgJFDQQgAEEIai0AACEDIAAoAgQhBCAALwEQIQUgAUHDAWpBAToAACABQcIBaiADQQdqQfwBcToAACACQQAgAi0ABCIGa0EMbGpBZGopAwAhByABQc4BaiAFOwEAIAFBzQFqIAY6AAAgAUHMAWogAzoAACABQcQBaiAHNwIAAkAgBEUNACABQdABaiAEIAMQogMaCwJAIAFBwAFqEOcCIgENACABRQ8LIABBAxBfQQAPCyAAQQAQlwEPCxD5AgALIABBAxBfCyADDwsgAEEAEF5BAAuTAgEFfyAAQdABaiEDIABBzAFqLQAAIQQCQAJAIAJFDQACQAJAIAAoAogBIgUgBSgCYGogAkEDdGoiBigCBCIHIARODQAgAyAHai0AAA0AIAUgBigCAGogAyAHELgDDQAgB0EBaiEFDAELQQAhBQsgBUUNASAEIAVrIQQgAyAFaiEDC0EAIQUCQCAAQbwDaiIGIAEgAEHOAWovAQAgAhCqASIHRQ0AAkAgBCAHLQAURw0AIAchBQwBCyAGIAcQpgELAkAgBQ0AIAYgASAALwHOASAEEKkBIgUgAjsBFgsgBUEIaiECAkAgBS0AFEEKSQ0AIAIoAgAhAgsgAiADIAQQogMaIAUgACkDoAE+AgQgBQ8LQQALpQMBBH8CQCAALwEIDQAgAEHAAWogAiACLQAMQRBqEKIDGgJAIAAoAogBQdwAaigCACICQQhJDQAgAkEDdiICQQEgAkEBSxshAyAAQbwDaiEEQQAhBQNAAkAgACgCmAEgBUECdGooAgAoAhAiAkUNAAJAAkAgAC0AzQEiBg0AIAAvAc4BRQ0BCyACLQAEIAZHDQELIAJBACACLQAEa0EMbGpBZGopAwAgACkCxAFSDQAgABBnAkAgAC0AwwFBAXENAAJAIAAtAM0BQTFPDQAgAC8BzgFB/4ECcUGDgAJHDQAgBCAFIAAoAqABQfCxf2oQqwEMAQtBACECA0AgBCAFIAAvAc4BIAIQrQEiAkUNASAAIAIvAQAgAi8BFhCZAUUNAAsLAkAgACgClAEiAkUNAANAAkAgBSACLwEORw0AIAIgAi0ADEEgcjoADAsgAigCACICDQALCwNAIAAoApQBIgJFDQEDQAJAIAItAAwiBkEgcUUNACACIAZB3wFxOgAMIAIQZgwCCyACKAIAIgINAAsLCyAFQQFqIgUgA0cNAAsLIAAQagsLtwIBA38CQCAALwEGIgJBBHENAAJAIAJBCHENACABEEAhAiAAQcUAIAEQQSACEH8LAkAgACgCiAFB3ABqKAIAIgJBCEkNACACQQN2IgJBASACQQFLGyEDIAAoApgBIQRBACECA0ACQCAEIAJBAnRqKAIAIAFHDQAgAEG8A2ogAhCsASAAQdgBakJ/NwMAIABB0AFqQn83AwAgAEHIAWpCfzcDACAAQn83A8ABAkAgACgClAEiAUUNAANAAkAgAiABLwEORw0AIAEgAS0ADEEgcjoADAsgASgCACIBDQALCyAAKAKUASICRQ0CA0ACQCACLQAMIgFBIHFFDQAgAiABQd8BcToADCACEGYgACgClAEiAg0BDAQLIAIoAgAiAg0ADAMLAAsgAkEBaiICIANHDQALCyAAEGoLCysAIABCfzcDwAEgAEHYAWpCfzcDACAAQdABakJ/NwMAIABByAFqQn83AwAL0wEBBX8gACAALwEGQQRyOwEGEEggACAALwEGQfv/A3E7AQYCQCAAKAKIAUHcAGooAgAiAUEISQ0AIAFBA3YiAUEBIAFBAUsbIQJBACEDA0AgACgCiAEiASABIAEoAmBqIAEgASgCWGogA0EDdGoiAUEEai8BAEEDdGooAgBqIAEoAgAQRyEEIAAoApgBIANBAnQiBWogBDYCAAJAIAEoAgBB7fLZjAFHDQAgACgCmAEgBWooAgAiASABLQAMQQFyOgAMCyADQQFqIgMgAkcNAAsLEEkLIAAgACAALwEGQQRyOwEGEEggACAALwEGQfv/A3E7AQYLNgEBfyAALwEGIQICQCABRQ0AIAAgAkECcjsBBg8LIAAgAkH9/wNxOwEGIAAgACgCrAE2ArABCwkAQQAoAoSUAQvHAgEEf0EAIQQCQCABLwEEIgVFDQAgASgCCCIGIAVBA3RqIQcDQAJAIAcgBEEBdGovAQAgAkcNACAGIARBA3RqIQQMAgsgBEEBaiIEIAVHDQALQQAhBAsCQCAERQ0AIAQgAykDADcDAA8LAkAgAS8BBiIEIAVLDQACQAJAIAQgBUcNACABIARBCmxBA3YiBEEEIARBBEobIgU7AQYgACAFQQpsEIQBIgRFDQECQCABLwEEIgdFDQAgBCABKAIIIAdBA3QQogMgBUEDdGogASgCCCABLwEEIgVBA3RqIAVBAXQQogMaCyABIAQ2AgggACgCuAEgBBBvCyABKAIIIAEvAQRBA3RqIAMpAwA3AwAgASgCCCABLwEEIgRBA3RqIARBAXRqIAI7AQAgASABLwEEQQFqOwEECw8LQagTQc4bQSNBywsQhQMAC2YBA39BACEEAkAgAi8BBCIFRQ0AIAIoAggiBiAFQQN0aiECA0ACQCACIARBAXRqLwEAIANHDQAgBiAEQQN0aiEEDAILIARBAWoiBCAFRw0AC0EAIQQLIAAgBEH4LSAEGykDADcDAAvVAQEBfyMAQSBrIgQkAAJAAkAgA0GB4ANJDQAgAEEAKQP4LTcDAAwBCyAEIAIpAwA3AxACQAJAIAEgBEEQahDDAUUNACAEIAIpAwA3AwAgASAEIARBHGoQxAEhASAEKAIcIANNDQEgACABIANqLQAAEL0BDAILIAQgAikDADcDCCABIARBCGoQxQEiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AIAEvAQggA00NACAAIAEoAgwgA0EDdGopAwA3AwAMAQsgAEEAKQP4LTcDAAsgBEEgaiQAC+QCAgR/AX4jAEEwayIEJABBfyEFAkAgAkGA4ANLDQAgBCABKQMANwMgAkAgACAEQSBqEMMBRQ0AIAQgASkDADcDECAAIARBEGogBEEsahDEASEAQX0hBSAEKAIsIAJNDQEgBCADKQMANwMIIAAgAmogBEEIahDAAToAAEEAIQUMAQsgBCABKQMANwMYQX4hBSAAIARBGGoQxQEiAUUNACABKAIAQYCAgPgAcUGAgIAYRw0AQXwhBSACQYA8Sw0AIAMpAwAhCAJAIAJBAWoiAyABLwEKTQ0AAkAgACADQQpsQQhtIgVBBCAFQQRKGyIGQQN0EIQBIgUNAEF7IQUMAgsCQCABKAIMIgdFDQAgBSAHIAEvAQhBA3QQogMaCyABIAY7AQogASAFNgIMIAAoArgBIAUQbwsgASgCDCACQQN0aiAINwMAQQAhBSABLwEIIAJLDQAgASADOwEICyAEQTBqJAAgBQuwAgEFf0F8IQQCQCADQYA8Sg0AQQAhBEEAIAEvAQgiBWsgAyAFIANqIgZBAEgbIgdFDQAgBkEAIAZBAEobIQNBeiEEIANBgDxLDQACQCADIAEvAQpNDQACQCAAIANBCmxBA3YiBEEEIARBBEobIgZBA3QQhAEiBA0AQXsPCwJAIAEoAgwiCEUNACAEIAggAS8BCEEDdBCiAxoLIAEgBjsBCiABIAQ2AgwgACgCuAEgBBBvCyABLwEIIAUgAiAFIAJJGyIEayECAkACQCAHQX9KDQAgASgCDCAEQQN0aiIEIAQgB0EDdGsgAiAHahCjAxoMAQsgASgCDCAEQQN0IgRqIgUgB0EDdCIAaiAFIAIQowMaIAEoAgwgBGpBACAAEKQDGgsgASADOwEIQQAhBAsgBAskAAJAIAEtABRBCkkNACABKAIIEB8LIAFBADsBAiABQQA6ABQLSAEDf0EAIQEDQCAAIAFBGGxqIgJBFGohAwJAIAItABRBCkkNACACKAIIEB8LIANBADoAACACQQA7AQIgAUEBaiIBQRRHDQALC8sBAQh/IwBBIGshAgJAIAAgAC8B4AMiA0EYbGogAUcNACABDwsCQCAAQQAgA0EBaiADQRJLGyIEQRhsaiIDIAFGDQAgAkEIakEQaiIFIAFBEGoiBikCADcDACACQQhqQQhqIgcgAUEIaiIIKQIANwMAIAIgASkCADcDCCAGIANBEGoiCSkCADcCACAIIANBCGoiBikCADcCACABIAMpAgA3AgAgCSAFKQMANwIAIAYgBykDADcCACADIAIpAwg3AgALIAAgBDsB4AMgAwuoAwEGfyMAQSBrIgQkAAJAIAJFDQBBACEFAkADQAJAIAAgBUEYbGovAQINACAAIAVBGGxqIQUMAgsgBUEBaiIFQRRHDQALQQAhBQsCQCAFDQAgAEEAIAAvAeADIgVBAWogBUESSxtBGGwiBmoiBUEUaiEHAkAgBS0AFEEKSQ0AIAAgBmooAggQHwsgB0EAOgAAIAAgBmpBADsBAgsgBUEAOwEWIAUgAjsBAiAFIAE7AQAgBSADOgAUAkAgA0EKSQ0AIAUgAxAeNgIICwJAAkAgACAALwHgAyIDQRhsaiAFRw0AIAUhAwwBCwJAIABBACADQQFqIANBEksbIgJBGGxqIgMgBUYNACAEQQhqQRBqIgEgBUEQaiIGKQIANwMAIARBCGpBCGoiByAFQQhqIggpAgA3AwAgBCAFKQIANwMIIAYgA0EQaiIJKQIANwIAIAggA0EIaiIGKQIANwIAIAUgAykCADcCACAJIAEpAwA3AgAgBiAHKQMANwIAIAMgBCkDCDcCAAsgACACOwHgAwsgBEEgaiQAIAMPC0HAIUGeHkElQfUaEIUDAAtoAQV/QQAhBAJAA0ACQAJAIAAgBEEYbCIFaiIGLwEAIAFHDQAgACAFaiIHLwECIAJHDQBBACEFIAcvARYgA0YNAQtBASEFIAghBgsgBUUNASAGIQggBEEBaiIEQRRHDQALQQAhBgsgBgtAAQJ/QQAhAwNAAkAgACADQRhsaiIELwEAIAFHDQAgBCgCBCACTQ0AIARBBGogAjYCAAsgA0EBaiIDQRRHDQALC1UBA39BACECA0ACQCAAIAJBGGxqIgMvAQAgAUcNACADQRRqIQQCQCADLQAUQQpJDQAgAygCCBAfCyAEQQA6AAAgA0EAOwECCyACQQFqIgJBFEcNAAsLSQACQCACRQ0AIAMgACADGyIDIABB4ANqIgBPDQADQAJAIAMvAQIgAkcNACADLwEAIAFHDQAgAw8LIANBGGoiAyAASQ0ACwtBAAugBAEMfyMAQeAAayICQcAAakEYaiAAQRhqKQIANwMAIAJBwABqQRBqIABBEGopAgA3AwAgAiAAKQIANwNAIAIgAEEIaikCADcDSEEAIQMDQCADQQR0IQRBACEFA0ACQAJAIAMNACACIAVBAnRqIAEoAAAiBkEYdCAGQQh0QYCA/AdxciAGQQh2QYD+A3EgBkEYdnJyNgIAIAFBBGohAQwBCyACIAVBAnRqIgcgAiAFQQFqQQ9xQQJ0aigCACIGQRl3IAZBDndzIAZBA3ZzIAcoAgBqIAIgBUEJakEPcUECdGooAgBqIAIgBUEOakEPcUECdGooAgAiBkEPdyAGQQ13cyAGQQp2c2o2AgALIAIoAlwhCCACIAIoAlgiCTYCXCACIAIoAlQiCjYCWCACIAIoAlAiBjYCVCACKAJMIQsgAiACKAJIIgw2AkwgAiACKAJEIg02AkggAiACKAJAIgc2AkQgAiALIAggBkEadyAGQRV3cyAGQQd3cyAKIAZxamogCSAGQX9zcWogBSAEckECdEHAK2ooAgBqIAIgBUECdGooAgBqIgZqNgJQIAIgB0EedyAHQRN3cyAHQQp3cyAGaiAHIAwgDXNxIAwgDXFzajYCQCAFQQFqIgVBEEcNAAsgA0EBaiIDQQRHDQALQQAhBQNAIAAgBUECdCIGaiIHIAcoAgAgAkHAAGogBmooAgBqNgIAIAVBAWoiBUEIRw0ACwunAgEFfyAAKAJIIQEgACgCRCICQYABOgAAIABB0ABqIQMgAkEBaiECAkAgAUF/aiIBQQdLDQAgAkEAIAEQpAMaIAMgAEEEaiICEK4BQcAAIQELIAJBACABQXhqIgEQpAMgAWoiBCAAKAJMIgJBA3Q6AAcgAkEFdiECQQYhBQNAIAQgBSIBaiACOgAAIAFBf2ohBSACQQh2IQIgAQ0ACyADIABBBGoQrgEgACgCACEBQQAhAkEAIQUDQCABIAJqIAAgBUECdGoiBEHTAGotAAA6AAAgASACQQFyaiAEQdIAai8BADoAACABIAJBAnJqIARB0ABqIgQoAgBBCHY6AAAgASACQQNyaiAEKAIAOgAAIAJBBGohAiAFQQFqIgVBCEcNAAsgACgCAAuIAQAQIQJAQQAtAIiUAUUNABD5AgALQQBBAToAiJQBECJBAEKrs4/8kaOz8NsANwL0lAFBAEL/pLmIxZHagpt/NwLslAFBAELy5rvjo6f9p6V/NwLklAFBAELnzKfQ1tDrs7t/NwLclAFBAELAADcC1JQBQQBBkJQBNgLQlAFBAEGAlQE2AoyUAQvVAQECfwJAIAFFDQBBAEEAKALYlAEgAWo2AtiUAQNAAkBBACgC1JQBIgJBwABHDQAgAUHAAEkNAEHclAEgABCuASAAQcAAaiEAIAFBQGoiAQ0BDAILQQAoAtCUASAAIAEgAiABIAJJGyICEKIDGkEAQQAoAtSUASIDIAJrNgLUlAEgACACaiEAIAEgAmshAQJAIAMgAkcNAEHclAFBkJQBEK4BQQBBwAA2AtSUAUEAQZCUATYC0JQBIAENAQwCC0EAQQAoAtCUASACajYC0JQBIAENAAsLC0wAQYyUARCvARogAEEYakEAKQOYlQE3AAAgAEEQakEAKQOQlQE3AAAgAEEIakEAKQOIlQE3AAAgAEEAKQOAlQE3AABBAEEAOgCIlAEL/AQBB38jAEHQAGsiByQAIANBAEchCAJAAkAgAQ0AQQAhCQwBC0EAIQkgA0UNAEEAIQpBACEJA0AgCkEBaiEIAkACQAJAAkACQCAAIApqLQAAIgtB+wBHDQAgCCABSQ0BCwJAIAtB/QBGDQAgCCEKDAMLIAggAUkNASAIIQoMAgsgCkECaiEKIAAgCGotAAAiC0H7AEYNAQJAAkAgC0FQakH/AXFBCUsNACALQRh0QRh1QVBqIQwMAQtBfyEMIAtBIHIiCEGff2pB/wFxQRlLDQAgCEEYdEEYdUGpf2ohDAsCQCAMQQBODQBBISELDAILIAohCAJAIAogAU8NAANAIAAgCGotAABB/QBGDQEgCEEBaiIIIAFHDQALIAEhCAtBfyENAkAgCiAITw0AAkAgACAKaiwAACIKQVBqIgtB/wFxQQlLDQAgCyENDAELIApBIHIiCkGff2pB/wFxQRlLDQAgCkGpf2ohDQsgCEEBaiEKQT8hCyAMIAVODQEgByAEIAxBA3RqKQMANwMIIAdBEGogB0EIahDBAUEHIA1BAWogDUEASBsQiAMgBy0AECILRQ0CIAdBEGohCCAJIANPDQIDQCAIQQFqIQgCQAJAIAYNACACIAlqIAs6AAAgCUEBaiEJQQAhBgwBCyAGQX9qIQYLIAgtAAAiC0UNAyAJIANJDQAMAwsACyAKQQJqIAggACAIai0AAEH9AEYbIQoLAkAgBg0AIAIgCWogCzoAACAJQQFqIQlBACEGDAELIAZBf2ohBgsgCSADSSEIIAogAU8NASAJIANJDQALCyACIAkgA0F/aiAIG2pBADoAACAHQdAAaiQAIAkgAyAIGwt4AQd/QQAhAUEAKAL8NEF/aiECA0ACQCABIAJMDQBBAA8LAkACQEHwMSACIAFqQQJtIgNBDGxqIgQoAgQiBSAATw0AQQEhBiADQQFqIQEMAQtBACEGAkAgBSAASw0AIAQhBwwBCyADQX9qIQJBASEGCyAGDQALIAcLuQgCCX8BfAJAAkACQAJAAkACQCABQX9qDhAAAQQEBAQEBAQEBAQEBAQCAwsgAi0AEEECSQ0DQQAoAvw0QX9qIQRBASEFA0AgAiAFQQxsakEkaiIGKAIAIQdBACEBIAQhCAJAA0ACQCABIAhMDQBBACEDDAILAkACQEHwMSAIIAFqQQJtIglBDGxqIgooAgQiCyAHTw0AQQEhDCAJQQFqIQEMAQtBACEMAkAgCyAHSw0AIAohAwwBCyAJQX9qIQhBASEMCyAMDQALCwJAIANFDQAgACAGELYBGgsgBUEBaiIFIAItABBJDQAMBAsACyACRQ0DIAAoAiQiAUUNAkEAIQkDQCABIggoAgAhAQJAIAgoAgQiDA0AIAghCSABDQEMBAsCQCAMQQAgDC0ABGtBDGxqQVxqIAJGDQAgCCEJIAENAQwECwJAAkAgCQ0AIAAgATYCJAwBCyAJIAE2AgALIAgoAgwQHyAIEB8gAQ0ADAMLAAsCQCADLwEOQYEiRg0AIAMtAANBAXENAgtBACgC/DRBf2ohCCACKAIAIQdBACEBAkADQAJAIAEgCEwNAEEAIQUMAgsCQAJAQfAxIAggAWpBAm0iCUEMbGoiCigCBCILIAdPDQBBASEMIAlBAWohAQwBC0EAIQwCQCALIAdLDQAgCiEFDAELIAlBf2ohCEEBIQwLIAwNAAsLIAVFDQEgACgCJCIBRQ0BIANBEGohDANAAkAgASgCBCACRw0AAkAgAS0ACSIIRQ0AIAEgCEF/ajoACQsCQCAMIAMtAAwgBS8BCBBaIg29Qv///////////wCDQoCAgICAgID4/wBWDQACQCABKQMYQv///////////wCDQoGAgICAgID4/wBUDQAgASANOQMYIAFBADYCICABQThqIA05AwAgAUEwaiANOQMAIAFBKGpCADcDACABIAFBwABqKAIANgIUCyABIAEoAiBBAWo2AiAgASgCFCEJAkACQEEAKAKgmAEiByABQcQAaigCACIIa0EASA0AIAFBKGoiByABKwMYIAggCWu4oiAHKwMAoDkDAAwBCyABQShqIgggASsDGCAHIAlruKIgCCsDAKA5AwAgByEICyABIAg2AhQCQCABQThqKwMAIA1jRQ0AIAEgDTkDOAsCQCABQTBqKwMAIA1kRQ0AIAEgDTkDMAsgASANOQMYCyAAKAIIIghFDQAgAEEAKAKgmAEgCGo2AhwLIAEoAgAiAQ0ADAILAAsgAUHAAEcNACACRQ0AIAAoAiQiAUUNAANAAkACQCABKAIMIggNAEEAIQwMAQsgCCADKAIEEMUDRSEMCwJAAkACQCABKAIEIAJHDQAgDA0CIAgQHyADKAIEEI0DIQgMAQsgDEUNASAIEB9BACEICyABIAg2AgwLIAEoAgAiAQ0ACwsPC0GiIUGnHUGSAkHACRCFAwALuQEBA39ByAAQHiICQf8BOgAKIAIgATYCBCACIAAoAiQ2AgAgACACNgIkIAJCgICAgICAgPz/ADcDGCACQQAoAqCYASIDNgJAAkAgAigCECIEDQACQAJAIAAtABJFDQAgAEEoaiEEIAAoAigNASAEQYgnNgIADAELIABBDGohBAsgBCgCACEECyACIAQgA2o2AkQCQCABRQ0AIAEQSiIARQ0AIAIgACgCBBCNAzYCDAsgAkH4GBC4ASACC+gGAgh/AnwjAEEQayIBJAACQAJAIAAoAghFDQBBACgCoJgBIAAoAhxrQQBODQELAkAgAEEYakGAwLgCEIIDRQ0AAkAgACgCJCICRQ0AA0ACQCACLQAJIAItAAhHDQAgAkEAOgAJCyACIAItAAk6AAggAigCACICDQALCyAAKAIoIgJFDQACQCACIAAoAgwiA08NACAAIAJB0A9qNgIoCyAAKAIoIANNDQAgACADNgIoCwJAIABBFGoiBEGAoAYQggNFDQAgACgCJCICRQ0AA0ACQCACKAIEIgNFDQAgAi0ACUExSw0AIAFB+gE6AA8CQAJAIANBg8AAIAFBD2pBARBRIgNFDQAgBEEAKAKgkQFBgMAAajYCAAwBCyACIAEtAA86AAkLIAMNAgsgAigCACICDQALCwJAIAAoAiQiAkUNACAAQQxqIQUgAEEoaiEGA0ACQCACQcQAaigCACIDQQAoAqCYAWtBf0oNAAJAAkACQCACQSBqIgQoAgANACACQoCAgICAgID8/wA3AxgMAQsgAisDGCADIAIoAhRruKIhCSACQShqKwMAIQoCQAJAIAIoAgwiAw0AQQAhBwwBCyADEMYDIQcLIAkgCqAhCSAHQSlqEB4iA0EgaiAEQSBqKQMANwMAIANBGGogBEEYaikDADcDACADQRBqIARBEGopAwA3AwAgA0EIaiAEQQhqKQMANwMAIAMgBCkDADcDACAHQShqIQQCQCACKAIMIghFDQAgA0EoaiAIIAcQogMaCyADIAkgAigCRCACQcAAaigCAGu4ozkDCCAALQAEQZABIAMgBBCbAyIEDQECQCACLAAKIgdBf0cNACAAQRFBECACKAIMG2otAAAhBwsCQCAHRQ0AIAIoAgwgAigCBCADIAAoAiAoAggRBgBFDQAgAkGAGRC4AQsgAxAfIAQNAgsgAkHAAGogAigCRCIDNgIAAkAgAigCECIEDQAgBSEEAkAgAC0AEkUNACAGIQQgBigCAA0AIAZBiCc2AgAgBiEECyAEKAIAIQQLIAJBADYCICACIAM2AhQgAiAEIANqNgJEIAJBOGogAisDGCIJOQMAIAJBMGogCTkDACACQShqQgA3AwAMAQsgAxAfCyACKAIAIgINAAsLIAFBEGokAA8LQZ4LQQAQKhAvAAvEAQECfyMAQcAAayICJAACQAJAIAAoAgQiA0UNACACQTtqIANBACADLQAEa0EMbGpBZGopAwAQiQMgACgCBC0ABCEDAkAgACgCDCIARQ0AIAIgATYCLCACIAM2AiggAiAANgIgIAIgAkE7ajYCJEGEECACQSBqECoMAgsgAiABNgIYIAIgAzYCFCACIAJBO2o2AhBB6g8gAkEQahAqDAELIAAoAgwhACACIAE2AgQgAiAANgIAQfQOIAIQKgsgAkHAAGokAAuaBQICfwF8AkACQAJAAkACQAJAIAEvAQ5BgH9qDgYABAQBAgMECwJAIAAoAiQiAUUNAANAIAAgASgCACICNgIkIAEoAgwQHyABEB8gAiEBIAINAAsLIABBADYCKA8LQQAhAgJAIAEtAAwiA0EJSQ0AIAAgAUEYaiADQXhqELoBIQILIAJFDQMgASsDECIEvUL///////////8Ag0KAgICAgICA+P8AVg0DAkAgAikDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAIgBDkDGCACQQA2AiAgAkE4aiAEOQMAIAJBMGogBDkDACACQShqQgA3AwAg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AQsgAyADKQMINwMAIAAgAxDBAZwQvAELIANBEGokAAsJACAAIAIQqAILLwEBfyMAQRBrIgMkACADQQhqIAIQqAIgACADKAIMQYCA4P8HRhC+ASADQRBqJAALDwAgACACEKwCELUDELwBC28BAX8jAEEQayIDJAAgA0EIaiACEKgCAkACQCADKAIMQX9GDQAgAyADKQMINwMAIAAgAxDBAZoQvAEMAQsCQCADKAIIIgJBgICAgHhHDQAgAEEAKQPwLTcDAAwBCyAAQQAgAmsQvQELIANBEGokAAs1AQF/IwBBEGsiAyQAIANBCGogAhCoAiADIAMpAwg3AwAgACADEMIBQQFzEL4BIANBEGokAAshAQF/EPsCIQMgACACEKwCIAO4okQAAAAAAADwPaIQvAELSwEDf0EBIQMCQCACEKoCIgRBAU0NAANAIANBAXRBAXIiAyAESQ0ACwsDQCACEPsCIANxIgUgBSAESyIFGyECIAUNAAsgACACEL0BC1EBAX8jAEEQayIDJAAgA0EIaiACEKgCAkACQCADKAIMQX9HDQAgACADKQMINwMADAELIAMgAykDCDcDACAAIAMQwQEQwgMQvAELIANBEGokAAsyAQF/IwBBEGsiAyQAIANBCGogAhCoAiADIAMpAwg3AwAgACADEMIBEL4BIANBEGokAAvIAQIEfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASCACKAIQIgYgBWoiBSAGSHMNACAAIAUQvQEMAQsgAyACQRBqKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiADQQhqEMEBIgc5AwAgACAHIAIrAyCgELwBCyADQSBqJAALLAECfyACQRhqIgMgAhCqAjYCACACIAIQqgIiBDYCECAAIAQgAygCAHEQvQELLAECfyACQRhqIgMgAhCqAjYCACACIAIQqgIiBDYCECAAIAQgAygCAHIQvQELLAECfyACQRhqIgMgAhCqAjYCACACIAIQqgIiBDYCECAAIAQgAygCAHMQvQEL4wECBX8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNAAJAAkAgAigCGCIFQQFqDgIAAgELIAIoAhBBgICAgHhGDQELIAIoAhAiBiAFbSIHIAVsIAZHDQAgACAHEL0BDAELIAMgAkEQaikDADcDECACIANBEGoQwQE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDBASIIOQMAIAAgAisDICAIoxC8AQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACEKgCIAJBGGoiBCADKQMYNwMAIANBGGogAhCoAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiADQQhqEMEBIgU5AwAgBSACKwMgYSECDAELIAIoAhAgAigCGEYhAgsgACACEL4BIANBIGokAAtBAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQAkAgAygCACICDQAgAEEAKQPgLTcDAA8LIAAgBCACbRC9AQssAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQIAAgBCADKAIAbBC9AQu5AQICfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgAkEQaikDADcDECACIANBEGoQwQE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDBASIFOQMAIAIrAyAgBWUhAgwBCyACKAIQIAIoAhhMIQILIAAgAhC+ASADQSBqJAALuQECAn8BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEMEBOQMgIAMgBCkDADcDCCACQShqIANBCGoQwQEiBTkDACACKwMgIAVjIQIMAQsgAigCECACKAIYSCECCyAAIAIQvgEgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACEKgCIAJBGGoiBCADKQMYNwMAIANBGGogAhCoAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQwQE5AwBB6C0hByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAQgBSACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC5ICAgV/AnwjAEEgayIDJAAgA0EYaiACEKgCIAJBGGoiBCADKQMYNwMAIANBGGogAhCoAiACIAMpAxg3AxAgAkEQaiEFAkACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyAFKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQwQE5AwBB6C0hByACKwMgIgi9Qv///////////wCDQoCAgICAgID4/wBWDQIgBisDACIJvUL///////////8Ag0KAgICAgICA+P8AVg0CIAggCWMhAgwBCyACKAIQIAIoAhhIIQILIAUgBCACGyEHCyAAIAcpAwA3AwAgA0EgaiQAC8oBAwN/AX4BfCMAQSBrIgMkACADQRhqIAIQqAIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKgCIAIgAykDGDcDEAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0cNACACNAIQIAI0Ahh+IgZCIIinIAanIgVBH3VHDQAgACAFEL0BDAELIAMgAkEQaikDADcDECACIANBEGoQwQE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDBASIHOQMAIAAgByACKwMgohC8AQsgA0EgaiQAC7kBAgJ/AXwjAEEgayIDJAAgA0EYaiACEKgCIAJBGGoiBCADKQMYNwMAIANBGGogAhCoAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiADQQhqEMEBIgU5AwAgBSACKwMgYiECDAELIAIoAhAgAigCGEchAgsgACACEL4BIANBIGokAAuFAQICfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQIAMgAikDEDcDECACIANBEGoQwQE5AyAgAyAEKQMANwMIIAJBKGogA0EIahDBASIFOQMAIAAgAisDICAFEL8DELwBIANBIGokAAssAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQIAAgBCADKAIAdBC9AQssAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQIAAgBCADKAIAdRC9AQtBAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQAkAgBCADKAIAdiICQX9KDQAgACACuBC8AQ8LIAAgAhC9AQvIAQIEfwF8IwBBIGsiAyQAIANBGGogAhCoAiACQRhqIgQgAykDGDcDACADQRhqIAIQqAIgAiADKQMYNwMQAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rw0AIAIoAhgiBUEASiACKAIQIgYgBWsiBSAGSHMNACAAIAUQvQEMAQsgAyACQRBqKQMANwMQIAIgA0EQahDBATkDICADIAQpAwA3AwggAkEoaiADQQhqEMEBIgc5AwAgACACKwMgIAehELwBCyADQSBqJAALMgEBf0H4LSEDAkAgAigCNCICIAEtABRPDQAgASgCECACQQN0aiEDCyAAIAMpAwA3AwALDgAgACACKQOgAboQvAELiAEBAX8jAEEQayIDJAAgA0EIaiACEKgCIAMgAykDCDcDAAJAAkAgAxDHAUUNACABKAIIIQEMAQtBACEBIAMoAgxBhoDA/wdHDQAgAiADKAIIEGIhAQsCQAJAIAENACAAQQApA/gtNwMADAELIAAgASgCGDYCACAAQYKAwP8HNgIECyADQRBqJAALLQACQCACQcMBai0AAEEBcQ0AIAAgAkHOAWovAQAQvQEPCyAAQQApA/gtNwMACy4AAkAgAkHDAWotAABBAXFFDQAgACACQc4Bai8BABC9AQ8LIABBACkD+C03AwALXwECfyMAQRBrIgMkAAJAAkAgAigCiAFB3ABqKAIAQQN2IAIoAjQiBEsNACADQQhqIAJB7wAQaSAAQQApA/gtNwMADAELIAAgBDYCACAAQYWAwP8HNgIECyADQRBqJAALXwECfyMAQRBrIgMkAAJAAkAgAigCiAFB5ABqKAIAQQN2IAIoAjQiBEsNACADQQhqIAJB8AAQaSAAQQApA/gtNwMADAELIAAgBDYCACAAQYSAwP8HNgIECyADQRBqJAALNQECfyACKAI0IQMCQCACQQAQsQIiBA0AIABBACkD+C03AwAPCyAAIAIgBCADQf//A3EQogELOgECfyMAQRBrIgMkACACEKkCIQQgA0EIaiACEKgCIAMgAykDCDcDACAAIAIgAyAEEKMBIANBEGokAAvDAQECfyMAQTBrIgMkACADQShqIAIQqAIgAyADKQMoNwMYAkACQAJAIAIgA0EYahDDAUUNACADIAMpAyg3AwggAiADQQhqIANBJGoQxAEaDAELIAMgAykDKDcDEAJAAkAgAiADQRBqEMUBIgQNAEEAIQIMAQsgBCgCAEGAgID4AHFBgICAGEYhAgsCQAJAIAJFDQAgAyAELwEINgIkDAELIABBACkD4C03AwALIAJFDQELIAAgAygCJBC9AQsgA0EwaiQACyYAAkAgAkEAELECIgINACAAQQApA+AtNwMADwsgACACLwEEEL0BCzQBAX8jAEEQayIDJAAgA0EIaiACEKgCIAMgAykDCDcDACAAIAIgAxDGARC9ASADQRBqJAALDQAgAEEAKQP4LTcDAAtNAQF/IwBBEGsiAyQAIANBCGogAhCoAiAAQYguQYAuIAMoAggbIgIgAkGILiADKAIMQYGAwP8HRhsgAykDCFAbKQMANwMAIANBEGokAAsNACAAQQApA5AuNwMACw0AIABBACkDgC43AwALDQAgAEEAKQOILjcDAAshAQF/IAEQsAIhAiAAKAIIIgAgAjsBDiAAQQAQXiABEFsLVQEBfAJAAkAgARCsAkQAAAAAAECPQKJEAAAAAAAA4D+gIgKZRAAAAAAAAOBBY0UNACACqiEBDAELQYCAgIB4IQELAkAgAUEASA0AIAAoAgggARBfCwsaAAJAIAEQqgIiAUEASA0AIAAoAgggARBfCwsmAQJ/IAEQqQIhAiABEKkCIQMgASABELACIANBgCByIAJBABCTAQsXAQF/IAEQqQIhAiABIAEQsAIgAhCVAQspAQN/IAEQrwIhAiABEKkCIQMgARCpAiEEIAEgARCwAiAEIAMgAhCTAQt4AQV/IwBBEGsiAiQAIAEQrwIhAyABEKkCIQQCQCAAKAIIKAIsIgUvAQgNAAJAAkAgBEEQSw0AIAEoAjQiBiAAKAIMLwEIIgBLDQAgBiAEaiAATQ0BCyACQQhqIAVB8QAQaQwBCyABIAMgBiAEEJYBCyACQRBqJAALuAEBB38jAEEQayICJAAgARCpAiEDIAEgAkEEahCuAiEEIAEQqQIhBQJAIANB7AFLDQAgACgCCCgCLCIGLwEIDQACQAJAIAVBEEsNACABKAI0IgcgACgCDC8BCCIISw0AIAcgBWogCE0NAQsgAkEIaiAGQfEAEGkMAQsgAUHMAWohASABIAQgAigCBCABIANqQQRqQewBIANrIAAgB0EDdGpBGGogBUEAELMBIANqOgAACyACQRBqJAALTgECfyMAQRBrIgIkAAJAAkAgARCpAiIDQe0BSQ0AIAJBCGogAUHzABBpDAELIAFBzAFqIAM6AAAgAUHQAWpBACADEKQDGgsgAkEQaiQAC1sBBH8jAEEQayICJAAgARCpAiEDIAEgAkEMahCuAiEEAkAgAUHMAWotAAAgA2siBUEBSA0AIAEgA2pB0AFqIAQgAigCDCIBIAUgASAFSRsQogMaCyACQRBqJAALlgEBB38jAEEQayICJAAgARCpAiEDIAEQqQIhBCABIAJBDGoQrgIhBSABEKkCIQYgASACQQhqEK4CIQcCQCACKAIMIgEgBE0NACACIAEgBGsiATYCDCACKAIIIgggBk0NACACIAggBmsiCDYCCCAHIAZqIAUgBGogCCABIAMgASADSRsiASAIIAFJGxCiAxoLIAJBEGokAAuDAQEFfyMAQRBrIgIkACABEKsCIQMgARCpAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgEgACgCDC8BCCIGSw0AIAEgBGogBk0NAQsgAkEIaiAFQfEAEGkMAQsgACgCCCADIAAgAUEDdGpBGGogBBBdCyACQRBqJAALvwEBB38jAEEQayICJAAgARCpAiEDIAEQqwIhBCABEKkCIQUCQAJAIANBe2pBe0sNACACQQhqIAFBiQEQaQwBCyAAKAIIKAIsIgYvAQgNAAJAAkAgBUEQSw0AIAEoAjQiByAAKAIMLwEIIghLDQAgByAFaiAITQ0BCyACQQhqIAZB8QAQaQwBCyABIAQgACAHQQN0akEYaiAFIAMQZCEBIAAoAgggATUCGEKAgICAoICA+P8AhDcDIAsgAkEQaiQACzMBAn8jAEEQayICJAAgACgCCCEDIAJBCGogARCoAiADIAIpAwg3AyAgABBgIAJBEGokAAtRAQJ/IwBBEGsiAiQAAkACQCAAKAIMKAIAIAEoAjQgAS8BMGoiA0oNACADIAAvAQJODQAgACADOwEADAELIAJBCGogAUH0ABBpCyACQRBqJAALcwEDfyMAQSBrIgIkACACQRhqIAEQqAIgAiACKQMYNwMIIAJBCGoQwgEhAwJAAkAgACgCDCgCACABKAI0IAEvATBqIgRKDQAgBCAALwECTg0AIAMNASAAIAQ7AQAMAQsgAkEQaiABQfUAEGkLIAJBIGokAAsLACABIAEQqQIQaAtUAQJ/IwBBEGsiAiQAIAJBCGogARCoAgJAAkAgASgCNCIDIAAoAgwvAQhJDQAgAiABQfYAEGkMAQsgACADQQN0akEYaiACKQMINwMACyACQRBqJAALVQECfyMAQRBrIgIkACACQQhqIAEQqAICQAJAIAEoAjQiAyABKAKIAS8BDEkNACACIAFB+AAQaQwBCyABKAIAIANBA3RqIAIpAwg3AwALIAJBEGokAAtUAQN/IwBBIGsiAiQAIAJBGGogARCoAiABEKkCIQMgARCpAiEEIAJBEGogARCtAiACIAIpAxA3AwAgAkEIaiAAIAQgAyACIAJBGGoQWSACQSBqJAALZQECfyMAQRBrIgIkACACQQhqIAEQqAICQAJAIAEoAjQiAyAAKAIMLQAKSQ0AIAIgAUH3ABBpDAELAkAgAyAALQAUSQ0AIAAQXAsgACgCECADQQN0aiACKQMINwMACyACQRBqJAALggEBAX8jAEEgayICJAAgAkEYaiABEKgCIAAoAghBACkD+C03AyAgAiACKQMYNwMIAkAgAkEIahDHAQ0AAkAgAigCHEGCgMD/B0YNACACQRBqIAFB+wAQaQwBCyABIAIoAhgQYyIBRQ0AIAAoAghBACkD4C03AyAgARBlCyACQSBqJAALSgECfyMAQRBrIgIkAAJAIAEoArgBEHEiAw0AIAFBDBCFAQsgACgCCCEAIAJBCGogAUGDASADEL8BIAAgAikDCDcDICACQRBqJAALWQEDfyMAQRBrIgIkACABEKkCIQMCQCABKAK4ASADEHIiBA0AIAEgA0EDdEEQahCFAQsgACgCCCEDIAJBCGogAUGDASAEEL8BIAMgAikDCDcDICACQRBqJAALVgEDfyMAQRBrIgIkACABEKkCIQMCQCABKAK4ASADEHMiBA0AIAEgA0EMahCFAQsgACgCCCEDIAJBCGogAUGDASAEEL8BIAMgAikDCDcDICACQRBqJAALSQEDfyMAQRBrIgIkACACQQhqIAEQqAICQCABQQEQsQIiA0UNACABLwE0IQQgAiACKQMINwMAIAEgAyAEIAIQoQELIAJBEGokAAtmAQJ/IwBBMGsiAiQAIAJBKGogARCoAiABEKkCIQMgAkEgaiABEKgCIAIgAikDIDcDECACIAIpAyg3AwgCQCABIAJBEGogAyACQQhqEKQBRQ0AIAJBGGogAUGFARBpCyACQTBqJAALhwEBBH8jAEEgayICJAAgARCqAiEDIAEQqQIhBCACQRhqIAEQqAIgAiACKQMYNwMIAkACQCABIAJBCGoQxQEiBUUNACAFKAIAQYCAgPgAcUGAgIAYRw0AIAEgBSAEIAMQpQFFDQEgAkEQaiABQYoBEGkMAQsgAkEQaiABQYsBEGkLIAJBIGokAAtfAQJ/IwBBEGsiAyQAAkACQCACKAI0IgQgAigCiAFBxABqKAIAQQR2SQ0AIANBCGogAkHyABBpIABBACkD+C03AwAMAQsgACAENgIAIABBhoDA/wc2AgQLIANBEGokAAtBAQJ/IAJBGGoiAyACEKoCNgIAIAIgAhCqAiIENgIQAkAgAygCACICDQAgAEEAKQPgLTcDAA8LIAAgBCACbxC9AQsMACAAIAIQqgIQvQELZQEFfyMAQRBrIgIkACABEKkCIQMgARCpAiEEIAEQqQIhBSABIAJBDGoQrgIhAQJAIAIoAgwiBiAFTQ0AIAIgBiAFayIGNgIMIAEgBWogAyAGIAQgBiAESRsQpAMaCyACQRBqJAALPQEBfwJAIAEtADIiAg0AIAAgAUHsABBpDwsgASACQX9qIgI6ADIgACABIAJB/wFxQQN0akE4aikDADcDAAtnAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQaQwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARDAASEAIAFBEGokACAAC2cBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABBpDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABEMABIQAgAUEQaiQAIAALgAEBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABBpDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYaAwP8HRw0AIAEoAgghAAwBCyABIABBiAEQaUEAIQALIAFBEGokACAAC2kCAn8BfCMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEGkMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQwQEhAyABQRBqJAAgAwuTAQECfyMAQSBrIgIkAAJAAkAgAS0AMiIDDQAgAkEYaiABQewAEGkMAQsgASADQX9qIgM6ADIgAiABIANB/wFxQQN0akE4aikDADcDGAsgAiACKQMYNwMIAkACQCABIAJBCGoQwwENACACQRBqIAFB/QAQaSAAQQApA5AuNwMADAELIAAgAikDGDcDAAsgAkEgaiQAC60BAQJ/IwBBMGsiAiQAAkACQCAALQAyIgMNACACQShqIABB7AAQaQwBCyAAIANBf2oiAzoAMiACIAAgA0H/AXFBA3RqQThqKQMANwMoCyACIAIpAyg3AxACQAJAIAAgAkEQahDDAQ0AIAJBIGogAEH9ABBpIAJBACkDkC43AxgMAQsgAiACKQMoNwMYCyACIAIpAxg3AwggACACQQhqIAEQxAEhACACQTBqJAAgAAuAAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEGkMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsCQAJAIAEoAgxBhIDA/wdGDQAgASAAQf8AEGlBACEADAELIAEoAgghAAsgAUEQaiQAIAALgAEBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABBpDAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYWAwP8HRg0AIAEgAEH+ABBpQQAhAAwBCyABKAIIIQALIAFB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DAELQX8hByADQSByIgNBn39qQf8BcUEFSw0AIANBGHRBGHVBqX9qIQcLIAFBAWohAQJAAkAgBQ0AIAdBBHRBgAJyIQUMAQsgAiAHIAVyOgAAIAJBAWohAkEAIQULIAEtAAAiA0UhBCADDQALCyACIABrCzQBAX8jAEEQayIEJAAgBCADNgIMIAQgAjYCCCAEIAE2AgQgBCAANgIAQZoOIAQQKhD5AgALVQEDfyAAIAAtAAAiAUEtRmohAkEAIQADQCAAQQpsIAIsAAAiA2pBUGogACADQVBqQf8BcUEKSSIDGyEAIAJBAWohAiADDQALQQAgAGsgACABQS1GGwuVCQEKfyMAQcAAayIEJAAgACABaiEFIARBAXIhBiAEQQJyIQcgAEEARyEIIAIhCSAAIQoDQCACQQFqIQsCQAJAAkAgAi0AACIBQSVGDQAgAUUNACALIQIMAQsCQCAJIAtGDQAgCUF/cyALaiEMAkAgBSAKayINQQFIDQAgCiAJIAwgDUF/aiANIAxKGyINEKIDIA1qQQA6AAALIAogDGohCgsCQCABDQBBACEBIAshAgwCC0EAIQECQCALLQAAQS1HDQAgAkECaiALIAItAAJB8wBGIgIbIQsgAiAIcSEBCyALLAAAIQIgBEEAOgABAkACQAJAAkACQAJAAkACQAJAAkAgAkFbag5UBwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAwgICAgICAgICAgAAQgFCAgICAgICAgIBAgIBggCCAgDCAsgBCADKAIAOgAAIANBBGohAwwICyAEIQkCQCADKAIAIgJBf0oNACAEQS06AABBACACayECIAYhCQsgA0EEaiEDIAkhAQNAIAEgAiACQQpuIgxBCmxrQTByOgAAIAFBAWohASACQQlLIQ0gDCECIA0NAAsgAUEAOgAAIAkgCRDGA2pBf2oiAiAJTQ0HA0AgCS0AACEBIAkgAi0AADoAACACIAE6AAAgCUEBaiIJIAJBf2oiAkkNAAwICwALIAMoAgAhAiAEIQEDQCABIAIgAkEKbiIJQQpsa0EwcjoAACABQQFqIQEgAkEJSyEMIAkhAiAMDQALIAFBADoAACADQQRqIQMgBCECIAQgBBDGA2pBf2oiASAETQ0GA0AgAi0AACEJIAIgAS0A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RAAAAAAAAPA/IAFBAXEbIQICQCABQQFqQQNJDQAgASEDA0AgAiAAIACiIgBEAAAAAAAA8D8gA0ECbSIDQQFxG6IhAiADQQFqQQJLDQALC0QAAAAAAADwPyACoyACIAFBAEgbCwQAIwALBgAgACQACxIBAn8jACAAa0FwcSIBJAAgAQsVAEHQnsECJAJByJ4BQQ9qQXBxJAELBwAjACMBawsEACMCCwQAIwELDQAgASACIAMgABENAAskAQF+IAAgASACrSADrUIghoQgBBDUAyEFIAVCIIinEBIgBacLEwAgACABpyABQiCIpyACIAMQEwsLpIWBgAADAEGACAvkgAFodW1pZGl0eQBhY2lkaXR5ACFmcmFtZS0+cGFyYW1zX2lzX2NvcHkAamFjc192ZXJpZnkAZmxleABhaXJRdWFsaXR5SW5kZXgAdXZJbmRleABqZF9vcGlwZV93cml0ZV9leABXU1NLLUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleAB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAbG9jYWxob3N0AHN0b3BfbGlzdABhdXRoIHRvbyBzaG9ydABzdGFydABqZF9jbGllbnRfZW1pdF9ldmVudABqZF90eF9mcmFtZV9zZW50AGRjQ3VycmVudE1lYXN1cmVtZW50AGRjVm9sdGFnZU1lYXN1cmVtZW50AGphY3NjcmlwdG1ncl9pbml0AHJlZmxlY3RlZExpZ2h0AHRhcmdldCByZXNldAAhIHNlbnNvciB3YXRjaGRvZyByZXNldABjbG91ZCB3YXRjaGRvZyByZXNldABqYWNzX21hcF9zZXQAamRfY2xpZW50X2hhbmRsZV9wYWNrZXQAcm9sZW1ncl9oYW5kbGVfcGFja2V0AHdzAHdzcwBqZF9jbGllbnRfcHJvY2VzcwByb2xlbWdyX3Byb2Nlc3MAY29tcGFzcwBqYWNzX2ZpYmVyX2NvcHlfcGFyYW1zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGphY2RhYy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBjbGVhciByb2xlICVzAGFza2luZyBmb3IgZGVwbG95OiAlcwBkZXZpY2UgcmVzZXQ6ICVzAHRzYWdnOiAlczogJXMAV1NTSzogZXJyb3I6ICVzAGZhaWw6ICVzAFdTU0stSDogZmFpbGVkIHBhcnNpbmcgY29ubiBzdHJpbmc6ICVzAGRldmljZSBkZXN0cm95ZWQ6ICVzAGRldmljZSBjcmVhdGVkOiAlcwB0c2FnZzogJXMvJWQ6ICVzAEpTQ1I6ICVzAHRzYWdnOiAlcyAoJXMvJWQpOiAlcwB3c3NrX2Nvbm5zdHIAbWFya19wdHIAd3JpdGUgZXJyAHRhZyBlcnJvcgBqYWNzX2pkX2dldF9yZWdpc3RlcgBqYWNzX3ZhbHVlX2Zyb21fcG9pbnRlcgBqYWNzX2VudGVyAHBvdGVudGlvbWV0ZXIAcHVsc2VPeGltZXRlcgBkZXBsb3lfaGFuZGxlcgBkZXBsb3lfbWV0YV9oYW5kbGVyAHJvdGFyeUVuY29kZXIAIXN3ZWVwAGphY3Nfdm1fcG9wX2FyZ19tYXAAc21hbGwgaGVsbG8AcmUtcnVuAGJ1dHRvbgBtb3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgB1bnBpbgBwcm9ncmFtIHdyaXR0ZW4AZmxhc2hfcHJvZ3JhbQBqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAYWdnYnVmZmVyX2ZsdXNoAGRvX2ZsdXNoAG11bHRpdG91Y2gAc3dpdGNoAGphY3NfamRfc2VuZF9sb2dtc2cAc21hbGwgbXNnAFdTU0stSDogY2xlYXIgY29ubmVjdGlvbiBzdHJpbmcAIXFfc2VuZGluZwAhIGxvb3BiYWNrIHJ4IG92ZgAhIGZybSBzZW5kIG92ZgBqYWNzX3ZhbHVlX3R5cGVvZgAoKHVpbnQ4X3QgKilkc3QpW2ldID09IDB4ZmYAMDEyMzQ1Njc4OWFiY2RlZgAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAGphY3NfbGVhdmUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAV1M6IGNsb3NlAGZsYXNoX2VyYXNlAHNvaWxNb2lzdHVyZQB0ZW1wZXJhdHVyZQBhaXJQcmVzc3VyZQBvcGVuaW5nIGRlcGxveSBwaXBlAGNsb3NlZCBkZXBsb3kgcGlwZQBqZF90eF9nZXRfZnJhbWUAd2VpZ2h0U2NhbGUAcmFpbkdhdWdlAGpkX2RldmljZV9mcmVlAGRpc3RhbmNlAGlsbHVtaW5hbmNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAamFjc19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGphY3NjbG91ZDogZmFpbGVkIGJpbiB1cGxvYWQAamFjc2Nsb3VkOiBmYWlsZWQgdXBsb2FkACUtcyVkACUtc18lZAAlcyBmaWJlciAlc19GJWQAICBwYz0lZCBAICVzX0YlZABQQU5JQyAlZCBhdCBwYz0lZABzZXQgcm9sZSAlcyAtPiAlczolZABXU1NLLUg6IHRvbyBzaG9ydCBmcmFtZTogJWQAdHZvYwBqYWNzX3JlZ2NhY2hlX2FsbG9jAGJhZCBtYWdpYwBqYWNkYWMtYy9qYWNzY3JpcHQvdmVyaWZ5LmMAamFjZGFjLWMvamFjc2NyaXB0L2phY3NjcmlwdC5jAGphY2RhYy1jL2phY3NjcmlwdC9vYmplY3RzLmMAamFjZGFjLWMvamFjc2NyaXB0L2ZpYmVycy5jAGphY2RhYy1jL2phY3NjcmlwdC9qYWNzY3JpcHRtZ3IuYwBqYWNkYWMtYy9jbGllbnQvcm9sZW1nci5jAGphY2RhYy1jL2phY3NjcmlwdC9hZ2didWZmZXIuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdm1fdXRpbC5jAHBvc2l4L2ZsYXNoLmMAamFjZGFjLWMvY2xpZW50L3JvdXRpbmcuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdHNhZ2cuYwBqYWNkYWMtYy9qYWNzY3JpcHQvdmFsdWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy90eF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL2phY3NjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2phY3NjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvamFjc2NyaXB0L2djX2FsbG9jLmMAZGVwbG95ICVkIGIAamFjc19idWZmZXJfZGF0YQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBKQUNTX0dDX1RBR19CWVRFUwB0cmcgIT0gTlVMTABjZmcucHJvZ3JhbV9iYXNlICE9IE5VTEwAZmliICE9IE5VTEwAZGF0YSAhPSBOVUxMAERJU0NPTk5FQ1RJTkcAMCA8PSBkaWZmICYmIGRpZmYgPD0gY2ZnLm1heF9wcm9ncmFtX3NpemUgLSBKRF9GTEFTSF9QQUdFX1NJWkUARElTQ09OTkVDVEVEACEgaW52YWxpZCBDUkMAPz8/AHdzc2s6AGVDTzIAZXZlbnRfc2NvcGUgPT0gMQBhcmcwAGF1dGggbm9uLTAAc3ogPiAwAHdzID4gMABzZXJ2aWNlX2NvbW1hbmQgPiAwAHN0ci0+Y3Vycl9yZXRyeSA9PSAwAGVyciA9PSAwAGV2ZW50X3Njb3BlID09IDAAY3R4LT5zb2NrZmQgPT0gMAAoY3R4LT5mbGFncyAmIEpBQ1NfQ1RYX0ZMQUdfQlVTWSkgPT0gMAAoR0VUX1RBRyhiLT5oZWFkZXIpICYgSkFDU19HQ19UQUdfTUFTS19TQ0FOTkVEKSA9PSAwAChkaWZmICYgNykgPT0gMAAoKHVpbnRwdHJfdClzcmMgJiAzKSA9PSAwACgodWludHB0cl90KWltZ2RhdGEgJiAzKSA9PSAwAGphY3NfdmVyaWZ5KGphY3NfZW1wdHlfcHJvZ3JhbSwgc2l6ZW9mKGphY3NfZW1wdHlfcHJvZ3JhbSkpID09IDAAKGRpZmYgJiAoSkRfRkxBU0hfUEFHRV9TSVpFIC0gMSkpID09IDAAKCh1aW50cHRyX3QpcHRyICYgKEpEX1BUUlNJWkUgLSAxKSkgPT0gMAAoY3R4LT5mbGFncyAmIEpBQ1NfQ1RYX0ZMQUdfQlVTWSkgIT0gMAAvd3Nzay8Ad3M6Ly8AamFjc19pc19idWZmZXIoY3R4LCB2KQBzaXplID4gc2l6ZW9mKGphY3NfaW1nX2hlYWRlcl90KQBqYWNzOiBPT00gKCV1IGJ5dGVzKQBXU1NLOiBwcm9jZXNzIGhlbGxvICglZCBieXRlcykAV1NTSzogcHJvY2VzcyBhdXRoICglZCBieXRlcykAYWdnYnVmOiB1cGw6ICclcycgJWYgKCUtcykAV1NTSy1IOiBzdGF0dXMgJWQgKCVzKQAobnVsbCkAaWR4IDwgamFjc19pbWdfbnVtX3N0cmluZ3MoJmN0eC0+aW1nKQBpbnZhbGlkIHBrdCBzaXplOiAlZCAob2ZmPSVkIGVuZHA9JWQpAG1pc3NpbmcgJWQgYnl0ZXMgKG9mICVkKQBHRVRfVEFHKGItPmhlYWRlcikgPT0gKEpBQ1NfR0NfVEFHX01BU0tfUElOTkVEIHwgSkFDU19HQ19UQUdfQllURVMpAHR5cGUgJiAoSkFDU19IQU5ETEVfR0NfTUFTSyB8IEpBQ1NfSEFORExFX0lNR19NQVNLKQBXUzogdGV4dCBtZXNzYWdlPyEgJyVzJwB6ZXJvIGtleSEAV1M6IGVycm9yIQBkZXBsb3kgZGV2aWNlIGxvc3QKAAAAamFjZGFjLXBvc2l4IGRldmljZQAwLjAuMAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAA8J8G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AGcAAABoAAAAaQAAAGoAAABrAAAAbAAAAG0AAABuAAAAbwAAAHAAAAATAAAAAAAAAAUAAAAAAAAAAAAAAHsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAB9AAAAWE0AAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGAABQT1AAAEGYjQELAACSxYCAAARuYW1lAaxE1wMABWFib3J0AQ1lbV9zZW5kX2ZyYW1lAhBlbV9jb25zb2xlX2RlYnVnAwRleGl0BAtlbV90aW1lX25vdwUgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkGIWVtc2NyaXB0ZW5fd2Vic29ja2V0X2lzX3N1cHBvcnRlZAcYZW1zY3JpcHRlbl93ZWJzb2NrZXRfbmV3CDJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAkzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uZXJyb3JfY2FsbGJhY2tfb25fdGhyZWFkCjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25jbG9zZV9jYWxsYmFja19vbl90aHJlYWQLNWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkDBplbXNjcmlwdGVuX3dlYnNvY2tldF9jbG9zZQ0UamRfY3J5cHRvX2dldF9yYW5kb20OD19fd2FzaV9mZF9jbG9zZQ8VZW1zY3JpcHRlbl9tZW1jcHlfYmlnEA9fX3dhc2lfZmRfd3JpdGURFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXASC3NldFRlbXBSZXQwExpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxQRX193YXNtX2NhbGxfY3RvcnMVDWZsYXNoX3Byb2dyYW0WC2ZsYXNoX2VyYXNlFwpmbGFzaF9zeW5jGBZpbml0X2phY3NjcmlwdF9tYW5hZ2VyGRRhcHBfZ2V0X2RldmljZV9jbGFzcxoIaHdfcGFuaWMbCGpkX2JsaW5rHAdqZF9nbG93HRRqZF9hbGxvY19zdGFja19jaGVjax4IamRfYWxsb2MfB2pkX2ZyZWUgDXRhcmdldF9pbl9pcnEhEnRhcmdldF9kaXNhYmxlX2lycSIRdGFyZ2V0X2VuYWJsZV9pcnEjD2pkX3NldHRpbmdzX2dldCQPamRfc2V0dGluZ3Nfc2V0JRBqZF9lbV9zZW5kX2ZyYW1lJhpqZF9lbV9zZXRfZGV2aWNlX2lkXzJ4X2kzMicaamRfZW1fc2V0X2RldmljZV9pZF9zdHJpbmcoCmpkX2VtX2luaXQpDWpkX2VtX3Byb2Nlc3MqBWRtZXNnKxRqZF9lbV9mcmFtZV9yZWNlaXZlZCwRamRfZW1famFjc19kZXBsb3ktGGpkX2VtX2phY3NfY2xpZW50X2RlcGxveS4MaHdfZGV2aWNlX2lkLwx0YXJnZXRfcmVzZXQwDnRpbV9nZXRfbWljcm9zMRJqZF90Y3Bzb2NrX3Byb2Nlc3MyEWFwcF9pbml0X3NlcnZpY2VzMxJqYWNzX2NsaWVudF9kZXBsb3k0FGNsaWVudF9ldmVudF9oYW5kbGVyNQthcHBfcHJvY2VzczYHdHhfaW5pdDcPamRfcGFja2V0X3JlYWR5OAp0eF9wcm9jZXNzORdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZToOamRfd2Vic29ja19uZXc7Bm9ub3BlbjwHb25lcnJvcj0Hb25jbG9zZT4Jb25tZXNzYWdlPxBqZF93ZWJzb2NrX2Nsb3NlQBxyb2xlbWdyX3NlcmlhbGl6ZWRfcm9sZV9zaXplQRZyb2xlbWdyX3NlcmlhbGl6ZV9yb2xlQg9yb2xlbWdyX3Byb2Nlc3NDEHJvbGVtZ3JfYXV0b2JpbmREFXJvbGVtZ3JfaGFuZGxlX3BhY2tldEUUamRfcm9sZV9tYW5hZ2VyX2luaXRGGHJvbGVtZ3JfZGV2aWNlX2Rlc3Ryb3llZEcNamRfcm9sZV9hbGxvY0gQamRfcm9sZV9mcmVlX2FsbEkWamRfcm9sZV9mb3JjZV9hdXRvYmluZEoSamRfcm9sZV9ieV9zZXJ2aWNlSxNqZF9jbGllbnRfbG9nX2V2ZW50TBNqZF9jbGllbnRfc3Vic2NyaWJlTRRqZF9jbGllbnRfZW1pdF9ldmVudE4Ucm9sZW1ncl9yb2xlX2NoYW5nZWRPEGpkX2RldmljZV9sb29rdXBQGGpkX2RldmljZV9sb29rdXBfc2VydmljZVETamRfc2VydmljZV9zZW5kX2NtZFIRamRfY2xpZW50X3Byb2Nlc3NTDmpkX2RldmljZV9mcmVlVBdqZF9jbGllbnRfaGFuZGxlX3BhY2tldFUPamRfZGV2aWNlX2FsbG9jVg5hZ2didWZmZXJfaW5pdFcPYWdnYnVmZmVyX2ZsdXNoWBBhZ2didWZmZXJfdXBsb2FkWQ5qYWNzX2J1ZmZlcl9vcFoQamFjc19yZWFkX251bWJlclsQamFjc19maWJlcl95aWVsZFwWamFjc19maWJlcl9jb3B5X3BhcmFtc10YamFjc19maWJlcl9jYWxsX2Z1bmN0aW9uXhhqYWNzX2ZpYmVyX3NldF93YWtlX3RpbWVfEGphY3NfZmliZXJfc2xlZXBgG2phY3NfZmliZXJfcmV0dXJuX2Zyb21fY2FsbGEaamFjc19maWJlcl9mcmVlX2FsbF9maWJlcnNiEmphY3NfZmliZXJfYnlfZmlkeGMRamFjc19maWJlcl9ieV90YWdkEGphY3NfZmliZXJfc3RhcnRlFGphY3NfZmliZXJfdGVybWlhbnRlZg5qYWNzX2ZpYmVyX3J1bmcTamFjc19maWJlcl9zeW5jX25vd2gKamFjc19wYW5pY2kVX2phY3NfcnVudGltZV9mYWlsdXJlag9qYWNzX2ZpYmVyX3Bva2VrD2pkX2djX3RyeV9hbGxvY2wJdHJ5X2FsbG9jbQdqYWNzX2djbg9maW5kX2ZyZWVfYmxvY2tvC2pkX2djX3VucGlucApqZF9nY19mcmVlcRJqYWNzX21hcF90cnlfYWxsb2NyFGphY3NfYXJyYXlfdHJ5X2FsbG9jcxVqYWNzX2J1ZmZlcl90cnlfYWxsb2N0D2phY3NfZ2Nfc2V0X2N0eHUOamFjc19nY19jcmVhdGV2D2phY3NfZ2NfZGVzdHJveXcEc2NhbngTc2Nhbl9hcnJheV9hbmRfbWFya3kRamFjc2Nsb3VkX3Byb2Nlc3N6F2phY3NjbG91ZF9oYW5kbGVfcGFja2V0exNqYWNzY2xvdWRfb25fbWV0aG9kfA5qYWNzY2xvdWRfaW5pdH0PamFjc19jcmVhdGVfY3R4fglzZXR1cF9jdHh/CmphY3NfdHJhY2WAAQ9qYWNzX2Vycm9yX2NvZGWBARlqYWNzX2NsaWVudF9ldmVudF9oYW5kbGVyggEJY2xlYXJfY3R4gwENamFjc19mcmVlX2N0eIQBDmphY3NfdHJ5X2FsbG9jhQEIamFjc19vb22GAQlqYWNzX2ZyZWWHARRqYWNzY3JpcHRtZ3JfcHJvY2Vzc4gBB3RyeV9ydW6JAQxzdG9wX3Byb2dyYW2KARlqYWNzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0iwEZamFjc2NyaXB0bWdyX2RlcGxveV93cml0ZYwBFWphY3NjcmlwdG1ncl9nZXRfaGFzaI0BGmphY3NjcmlwdG1ncl9oYW5kbGVfcGFja2V0jgEOZGVwbG95X2hhbmRsZXKPARNkZXBsb3lfbWV0YV9oYW5kbGVykAETamFjc2NyaXB0bWdyX2RlcGxveZEBEWphY3NjcmlwdG1ncl9pbml0kgEWamFjc2NyaXB0bWdyX2NsaWVudF9ldpMBFGphY3NfamRfZ2V0X3JlZ2lzdGVylAEWamFjc19qZF9jbGVhcl9wa3Rfa2luZJUBEGphY3NfamRfc2VuZF9jbWSWARNqYWNzX2pkX3NlbmRfbG9nbXNnlwENaGFuZGxlX2xvZ21zZ5gBEmphY3NfamRfc2hvdWxkX3J1bpkBF2phY3NfamRfdXBkYXRlX3JlZ2NhY2hlmgETamFjc19qZF9wcm9jZXNzX3BrdJsBFGphY3NfamRfcm9sZV9jaGFuZ2VknAEUamFjc19qZF9yZXNldF9wYWNrZXSdARJqYWNzX2pkX2luaXRfcm9sZXOeARJqYWNzX2pkX2ZyZWVfcm9sZXOfARBqYWNzX3NldF9sb2dnaW5noAEVamFjc19nZXRfZ2xvYmFsX2ZsYWdzoQEMamFjc19tYXBfc2V0ogEMamFjc19tYXBfZ2V0owEKamFjc19pbmRleKQBDmphY3NfaW5kZXhfc2V0pQERamFjc19hcnJheV9pbnNlcnSmARJqYWNzX3JlZ2NhY2hlX2ZyZWWnARZqYWNzX3JlZ2NhY2hlX2ZyZWVfYWxsqAEXamFjc19yZWdjYWNoZV9tYXJrX3VzZWSpARNqYWNzX3JlZ2NhY2hlX2FsbG9jqgEUamFjc19yZWdjYWNoZV9sb29rdXCrARFqYWNzX3JlZ2NhY2hlX2FnZawBF2phY3NfcmVnY2FjaGVfZnJlZV9yb2xlrQESamFjc19yZWdjYWNoZV9uZXh0rgENY29uc3VtZV9jaHVua68BDXNoYV8yNTZfY2xvc2WwAQ9qZF9zaGEyNTZfc2V0dXCxARBqZF9zaGEyNTZfdXBkYXRlsgEQamRfc2hhMjU2X2ZpbmlzaLMBDmphY3Nfc3RyZm9ybWF0tAEcamFjc19nZXRfcGFja2VkX3NlcnZpY2VfZGVzY7UBD3RzYWdnX2NsaWVudF9ldrYBCmFkZF9zZXJpZXO3AQ10c2FnZ19wcm9jZXNzuAEKbG9nX3Nlcmllc7kBE3RzYWdnX2hhbmRsZV9wYWNrZXS6ARRsb29rdXBfb3JfYWRkX3Nlcmllc7sBCnRzYWdnX2luaXS8ARZqYWNzX3ZhbHVlX2Zyb21fZG91YmxlvQETamFjc192YWx1ZV9mcm9tX2ludL4BFGphY3NfdmFsdWVfZnJvbV9ib29svwEXamFjc192YWx1ZV9mcm9tX3BvaW50ZXLAARFqYWNzX3ZhbHVlX3RvX2ludMEBFGphY3NfdmFsdWVfdG9fZG91YmxlwgESamFjc192YWx1ZV90b19ib29swwEOamFjc19pc19idWZmZXLEARBqYWNzX2J1ZmZlcl9kYXRhxQEUamFjc192YWx1ZV90b19nY19vYmrGARFqYWNzX3ZhbHVlX3R5cGVvZscBD2phY3NfaXNfbnVsbGlzaMgBC2phY3NfdmVyaWZ5yQEUamFjc192bV9leGVjX29wY29kZXPKAQxleHByX2ludmFsaWTLARBleHByeF9sb2FkX2xvY2FszAERZXhwcnhfbG9hZF9nbG9iYWzNARFleHByM19sb2FkX2J1ZmZlcs4BDWV4cHJ4X2xpdGVyYWzPARFleHByeF9saXRlcmFsX2Y2NNABDWV4cHIwX3JldF92YWzRAQxleHByMl9zdHIwZXHSARdleHByMV9yb2xlX2lzX2Nvbm5lY3RlZNMBDmV4cHIwX3BrdF9zaXpl1AERZXhwcjBfcGt0X2V2X2NvZGXVARZleHByMF9wa3RfcmVnX2dldF9jb2Rl1gEJZXhwcjBfbmFu1wEJZXhwcjFfYWJz2AENZXhwcjFfYml0X25vdNkBCmV4cHIxX2NlaWzaAQtleHByMV9mbG9vctsBCGV4cHIxX2lk3AEMZXhwcjFfaXNfbmFu3QELZXhwcjFfbG9nX2XeAQlleHByMV9uZWffAQlleHByMV9ub3TgAQxleHByMV9yYW5kb23hARBleHByMV9yYW5kb21faW504gELZXhwcjFfcm91bmTjAQ1leHByMV90b19ib29s5AEJZXhwcjJfYWRk5QENZXhwcjJfYml0X2FuZOYBDGV4cHIyX2JpdF9vcucBDWV4cHIyX2JpdF94b3LoAQlleHByMl9kaXbpAQhleHByMl9lceoBCmV4cHIyX2lkaXbrAQpleHByMl9pbXVs7AEIZXhwcjJfbGXtAQhleHByMl9sdO4BCWV4cHIyX21heO8BCWV4cHIyX21pbvABCWV4cHIyX211bPEBCGV4cHIyX25l8gEJZXhwcjJfcG938wEQZXhwcjJfc2hpZnRfbGVmdPQBEWV4cHIyX3NoaWZ0X3JpZ2h09QEaZXhwcjJfc2hpZnRfcmlnaHRfdW5zaWduZWT2AQlleHByMl9zdWL3ARBleHByeF9sb2FkX3BhcmFt+AEMZXhwcjBfbm93X21z+QEWZXhwcjFfZ2V0X2ZpYmVyX2hhbmRsZfoBFWV4cHIwX3BrdF9yZXBvcnRfY29kZfsBFmV4cHIwX3BrdF9jb21tYW5kX2NvZGX8ARFleHByeF9zdGF0aWNfcm9sZf0BE2V4cHJ4X3N0YXRpY19idWZmZXL+ARBleHByeDFfZ2V0X2ZpZWxk/wELZXhwcjJfaW5kZXiAAhNleHByMV9vYmplY3RfbGVuZ3RogQIRZXhwcjFfa2V5c19sZW5ndGiCAgxleHByMV90eXBlb2aDAgpleHByMF9udWxshAINZXhwcjFfaXNfbnVsbIUCEGV4cHIwX3BrdF9idWZmZXKGAgpleHByMF90cnVlhwILZXhwcjBfZmFsc2WIAg9zdG10MV93YWl0X3JvbGWJAg1zdG10MV9zbGVlcF9zigIOc3RtdDFfc2xlZXBfbXOLAg9zdG10M19xdWVyeV9yZWeMAg5zdG10Ml9zZW5kX2NtZI0CE3N0bXQ0X3F1ZXJ5X2lkeF9yZWeOAhFzdG10eDJfbG9nX2Zvcm1hdI8CDXN0bXR4M19mb3JtYXSQAhZzdG10MV9zZXR1cF9wa3RfYnVmZmVykQINc3RtdDJfc2V0X3BrdJICCnN0bXQ1X2JsaXSTAgtzdG10eDJfY2FsbJQCDnN0bXR4M19jYWxsX2JnlQIMc3RtdDFfcmV0dXJulgIJc3RtdHhfam1wlwIMc3RtdHgxX2ptcF96mAILc3RtdDFfcGFuaWOZAhJzdG10eDFfc3RvcmVfbG9jYWyaAhNzdG10eDFfc3RvcmVfZ2xvYmFsmwISc3RtdDRfc3RvcmVfYnVmZmVynAISc3RtdHgxX3N0b3JlX3BhcmFtnQIVc3RtdDFfdGVybWluYXRlX2ZpYmVyngIPc3RtdDBfYWxsb2NfbWFwnwIRc3RtdDFfYWxsb2NfYXJyYXmgAhJzdG10MV9hbGxvY19idWZmZXKhAhBzdG10eDJfc2V0X2ZpZWxkogIPc3RtdDNfYXJyYXlfc2V0owISc3RtdDNfYXJyYXlfaW5zZXJ0pAIVZXhwcnhfc3RhdGljX2Z1bmN0aW9upQIKZXhwcjJfaW1vZKYCDGV4cHIxX3RvX2ludKcCDHN0bXQ0X21lbXNldKgCD2phY3Nfdm1fcG9wX2FyZ6kCE2phY3Nfdm1fcG9wX2FyZ191MzKqAhNqYWNzX3ZtX3BvcF9hcmdfaTMyqwIUamFjc192bV9wb3BfYXJnX2Z1bmOsAhNqYWNzX3ZtX3BvcF9hcmdfZjY0rQIWamFjc192bV9wb3BfYXJnX2J1ZmZlcq4CG2phY3Nfdm1fcG9wX2FyZ19idWZmZXJfZGF0Ya8CFmphY3Nfdm1fcG9wX2FyZ19zdHJpZHiwAhRqYWNzX3ZtX3BvcF9hcmdfcm9sZbECE2phY3Nfdm1fcG9wX2FyZ19tYXCyAhJqZF9hZXNfY2NtX2VuY3J5cHSzAhJqZF9hZXNfY2NtX2RlY3J5cHS0AgxBRVNfaW5pdF9jdHi1Ag9BRVNfRUNCX2VuY3J5cHS2AhBqZF9hZXNfc2V0dXBfa2V5twIOamRfYWVzX2VuY3J5cHS4AhBqZF9hZXNfY2xlYXJfa2V5uQILamRfd3Nza19uZXe6AhRqZF93c3NrX3NlbmRfbWVzc2FnZbsCE2pkX3dlYnNvY2tfb25fZXZlbnS8AgdkZWNyeXB0vQINamRfd3Nza19jbG9zZb4CEGpkX3dzc2tfb25fZXZlbnS/AgpzZW5kX2VtcHR5wAISd3Nza2hlYWx0aF9wcm9jZXNzwQIXamRfdGNwc29ja19pc19hdmFpbGFibGXCAhR3c3NraGVhbHRoX3JlY29ubmVjdMMCGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldMQCD3NldF9jb25uX3N0cmluZ8UCEWNsZWFyX2Nvbm5fc3RyaW5nxgIPd3Nza2hlYWx0aF9pbml0xwITd3Nza19wdWJsaXNoX3ZhbHVlc8gCEHdzc2tfcHVibGlzaF9iaW7JAhF3c3NrX2lzX2Nvbm5lY3RlZMoCE3dzc2tfcmVzcG9uZF9tZXRob2TLAg9qZF9jdHJsX3Byb2Nlc3PMAhVqZF9jdHJsX2hhbmRsZV9wYWNrZXTNAgxqZF9jdHJsX2luaXTOAg1qZF9pcGlwZV9vcGVuzwIWamRfaXBpcGVfaGFuZGxlX3BhY2tldNACDmpkX2lwaXBlX2Nsb3Nl0QISamRfbnVtZm10X2lzX3ZhbGlk0gIVamRfbnVtZm10X3dyaXRlX2Zsb2F00wITamRfbnVtZm10X3dyaXRlX2kzMtQCEmpkX251bWZtdF9yZWFkX2kzMtUCFGpkX251bWZtdF9yZWFkX2Zsb2F01gIRamRfb3BpcGVfb3Blbl9jbWTXAhRqZF9vcGlwZV9vcGVuX3JlcG9ydNgCFmpkX29waXBlX2hhbmRsZV9wYWNrZXTZAhFqZF9vcGlwZV93cml0ZV9leNoCEGpkX29waXBlX3Byb2Nlc3PbAhRqZF9vcGlwZV9jaGVja19zcGFjZdwCDmpkX29waXBlX3dyaXRl3QIOamRfb3BpcGVfY2xvc2XeAg1qZF9xdWV1ZV9wdXNo3wIOamRfcXVldWVfZnJvbnTgAg5qZF9xdWV1ZV9zaGlmdOECDmpkX3F1ZXVlX2FsbG9j4gINamRfcmVzcG9uZF91OOMCDmpkX3Jlc3BvbmRfdTE25AIOamRfcmVzcG9uZF91MzLlAhFqZF9yZXNwb25kX3N0cmluZ+YCF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk5wILamRfc2VuZF9wa3ToAh1zZXJ2aWNlX2hhbmRsZV9yZWdpc3Rlcl9maW5hbOkCF3NlcnZpY2VfaGFuZGxlX3JlZ2lzdGVy6gIZamRfc2VydmljZXNfaGFuZGxlX3BhY2tldOsCFGpkX2FwcF9oYW5kbGVfcGFja2V07AIVamRfYXBwX2hhbmRsZV9jb21tYW5k7QITamRfYWxsb2NhdGVfc2VydmljZe4CEGpkX3NlcnZpY2VzX2luaXTvAg5qZF9yZWZyZXNoX25vd/ACGWpkX3NlcnZpY2VzX3BhY2tldF9xdWV1ZWTxAhRqZF9zZXJ2aWNlc19hbm5vdW5jZfICF2pkX3NlcnZpY2VzX25lZWRzX2ZyYW1l8wIQamRfc2VydmljZXNfdGlja/QCFWpkX3Byb2Nlc3NfZXZlcnl0aGluZ/UCGmpkX3Byb2Nlc3NfZXZlcnl0aGluZ19jb3Jl9gISYXBwX2dldF9md192ZXJzaW9u9wIWYXBwX2dldF9kZXZfY2xhc3NfbmFtZfgCDWpkX2hhc2hfZm52MWH5AghqZF9wYW5pY/oCDGpkX2RldmljZV9pZPsCCWpkX3JhbmRvbfwCCGpkX2NyYzE2/QIOamRfY29tcHV0ZV9jcmP+Ag5qZF9zaGlmdF9mcmFtZf8CDmpkX3Jlc2V0X2ZyYW1lgAMQamRfcHVzaF9pbl9mcmFtZYEDE2pkX3Nob3VsZF9zYW1wbGVfbXOCAxBqZF9zaG91bGRfc2FtcGxlgwMJamRfdG9faGV4hAMLamRfZnJvbV9oZXiFAw5qZF9hc3NlcnRfZmFpbIYDB2pkX2F0b2mHAwtqZF92c3ByaW50ZogDD2pkX3ByaW50X2RvdWJsZYkDEmpkX2RldmljZV9zaG9ydF9pZIoDDGpkX3NwcmludGZfYYsDC2pkX3RvX2hleF9hjAMUamRfZGV2aWNlX3Nob3J0X2lkX2GNAwlqZF9zdHJkdXCOAw5qZF9qc29uX2VzY2FwZY8DE2pkX2pzb25fZXNjYXBlX2NvcmWQAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVlkQMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZIDEWpkX3NlbmRfZXZlbnRfZXh0kwMKamRfcnhfaW5pdJQDFGpkX3J4X2ZyYW1lX3JlY2VpdmVklQMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uWAw9qZF9yeF9nZXRfZnJhbWWXAxNqZF9yeF9yZWxlYXNlX2ZyYW1lmAMRamRfc2VuZF9mcmFtZV9yYXeZAw1qZF9zZW5kX2ZyYW1lmgMKamRfdHhfaW5pdJsDB2pkX3NlbmScAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjnQMPamRfdHhfZ2V0X2ZyYW1lngMQamRfdHhfZnJhbWVfc2VudJ8DC2pkX3R4X2ZsdXNooAMQX19lcnJub19sb2NhdGlvbqEDBWR1bW15ogMIX19tZW1jcHmjAwdtZW1tb3ZlpAMGbWVtc2V0pQMKX19sb2NrZmlsZaYDDF9fdW5sb2NrZmlsZacDDF9fc3RkaW9fc2Vla6gDDV9fc3RkaW9fd3JpdGWpAw1fX3N0ZGlvX2Nsb3NlqgMMX19zdGRpb19leGl0qwMKY2xvc2VfZmlsZawDCV9fdG93cml0Za0DCV9fZndyaXRleK4DBmZ3cml0Za8DK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHOwAxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7EDFl9fcHRocmVhZF9tdXRleF91bmxvY2uyAwZfX2xvY2uzAw5fX21hdGhfZGl2emVyb7QDDl9fbWF0aF9pbnZhbGlktQMDbG9ntgMFbG9nMTC3AwdfX2xzZWVruAMGbWVtY21wuQMKX19vZmxfbG9ja7oDDF9fbWF0aF94Zmxvd7sDCmZwX2JhcnJpZXK8AwxfX21hdGhfb2Zsb3e9AwxfX21hdGhfdWZsb3e+AwRmYWJzvwMDcG93wAMIY2hlY2tpbnTBAwtzcGVjaWFsY2FzZcIDBXJvdW5kwwMGc3RyY2hyxAMLX19zdHJjaHJudWzFAwZzdHJjbXDGAwZzdHJsZW7HAxJfX3dhc2lfc3lzY2FsbF9yZXTIAwhkbG1hbGxvY8kDBmRsZnJlZcoDGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6ZcsDBHNicmvMAwlfX3Bvd2lkZjLNAwlzdGFja1NhdmXOAwxzdGFja1Jlc3RvcmXPAwpzdGFja0FsbG9j0AMVZW1zY3JpcHRlbl9zdGFja19pbml00QMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZdIDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XTAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTUAwxkeW5DYWxsX2ppamnVAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp1gMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB1AMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
