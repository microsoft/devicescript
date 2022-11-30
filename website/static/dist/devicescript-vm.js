
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
  wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABx4GAgAAgYAN/f38AYAJ/fwBgAX8AYAJ/fwF/YAF/AX9gAABgA39/fwF/YAR/f39/AGAAAX9gBH9/f38Bf2ABfAF8YAF/AXxgBX9/f39/AX9gA39+fwF+YAABfmABfgF/YAV/f39/fwBgAAF8YAd/f39/f39/AX9gAn98AGAGf39/f39/AGADf39/AXxgA39/fABgAn9/AXxgA398fwBgAn9+AGACf3wBfGACfHwBfGADfH5+AXxgAnx/AXxgBH9/fn8BfmAEf35/fwF/ApiFgIAAFANlbnYFYWJvcnQABQNlbnYgZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2VuZF9iaW5hcnkABgNlbnYhZW1zY3JpcHRlbl93ZWJzb2NrZXRfaXNfc3VwcG9ydGVkAAgDZW52GmVtc2NyaXB0ZW5fd2Vic29ja2V0X2Nsb3NlAAYDZW52GGVtc2NyaXB0ZW5fd2Vic29ja2V0X25ldwAEA2VudjJlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25vcGVuX2NhbGxiYWNrX29uX3RocmVhZAAJA2VudjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQACQNlbnYzZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29uY2xvc2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52NWVtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbm1lc3NhZ2VfY2FsbGJhY2tfb25fdGhyZWFkAAkDZW52BGV4aXQAAgNlbnYNZW1fc2VuZF9mcmFtZQACA2VudhBlbV9jb25zb2xlX2RlYnVnAAIDZW52C2VtX3RpbWVfbm93ABEDZW52FGpkX2NyeXB0b19nZXRfcmFuZG9tAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQAEA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAABANlbnYLc2V0VGVtcFJldDAAAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsADAPIg4CAAMYDBQgFAgIFBAII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//////////8Ag0KAgICAgICA+P8AVg0AAkAgASkDGEL///////////8Ag0KBgICAgICA+P8AVA0AIAEgDTkDGCABQQA2AiAgAUE4aiANOQMAIAFBMGogDTkDACABQShqQgA3AwAgASABQcAAaigCADYCFAsgASABKAIgQQFqNgIgIAEoAhQhCQJAAkBBACgCgJ8BIgcgAUHEAGooAgAiCGtBAEgNACABQShqIgcgASsDGCAIIAlruKIgBysDAKA5AwAMAQsgAUEoaiIIIAErAxggByAJa7iiIAgrAwCgOQMAIAchCAsgASAINgIUAkAgAUE4aisDACANY0UNACABIA05AzgLAkAgAUEwaisDACANZEUNACABIA05AzALIAEgDTkDGAsgACgCCCIIRQ0AIABBACgCgJ8BIAhqNgIcCyABKAIAIgENAAwCCwALIAFBwABHDQAgAkUNACAAKAIkIgFFDQADQAJAAkAgASgCDCIIDQBBACEMDAELIAggAygCBBDIA0UhDAsCQAJAAkAgASgCBCACRw0AIAwNAiAIEBsgAygCBBCMAyEIDAELIAxFDQEgCBAbQQAhCAsgASAINgIMCyABKAIAIgENAAsLDwtBryhB5SJBkgJB5gkQhAMAC7kBAQN/QcgAEBoiAkH/AToACiACIAE2AgQgAiAAKAIkNgIAIAAgAjYCJCACQoCAgICAgID8/wA3AxggAkEAKAKAnwEiAzYCQAJAIAIoAhAiBA0AAkACQCAALQASRQ0AIABBKGohBCAAKAIoDQEgBEGIJzYCAAwBCyAAQQxqIQQLIAQoAgAhBAsgAiAEIANqNgJEAkAgAUUNACABEEoiAEUNACACIAAoAgQQjAM2AgwLIAJB9RwQggEgAgvoBgIIfwJ8IwBBEGsiASQAAkACQCAAKAIIRQ0AQQAoAoCfASAAKAIca0EATg0BCwJAIABBGGpBgMC4AhCBA0UNAAJAIAAoAiQiAkUNAANAAkAgAi0ACSACLQAIRw0AIAJBADoACQsgAiACLQAJOgAIIAIoAgAiAg0ACwsgACgCKCICRQ0AAkAgAiAAKAIMIgNPDQAgACACQdAPajYCKAsgACgCKCADTQ0AIAAgAzYCKAsCQCAAQRRqIgRBgKAGEIEDRQ0AIAAoAiQiAkUNAANAAkAgAigCBCIDRQ0AIAItAAlBMUsNACABQfoBOgAPAkACQCADQYPAACABQQ9qQQEQUSIDRQ0AIARBACgCiJgBQYDAAGo2AgAMAQsgAiABLQAPOgAJCyADDQILIAIoAgAiAg0ACwsCQCAAKAIkIgJFDQAgAEEMaiEFIABBKGohBgNAAkAgAkHEAGooAgAiA0EAKAKAnwFrQX9KDQACQAJAAkAgAkEgaiIEKAIADQAgAkKAgICAgICA/P8ANwMYDAELIAIrAxggAyACKAIUa7iiIQkgAkEoaisDACEKAkACQCACKAIMIgMNAEEAIQcMAQsgAxDJAyEHCyAJIAqgIQkgB0EpahAaIgNBIGogBEEgaikDADcDACADQRhqIARBGGopAwA3AwAgA0EQaiAEQRBqKQMANwMAIANBCGogBEEIaikDADcDACADIAQpAwA3AwAgB0EoaiEEAkAgAigCDCIIRQ0AIANBKGogCCAHEKUDGgsgAyAJIAIoAkQgAkHAAGooAgBruKM5AwggAC0ABEGQASADIAQQngMiBA0BAkAgAiwACiIHQX9HDQAgAEERQRAgAigCDBtqLQAAIQcLAkAgB0UNACACKAIMIAIoAgQgAyAAKAIgKAIIEQYARQ0AIAJB/RwQggELIAMQGyAEDQILIAJBwABqIAIoAkQiAzYCAAJAIAIoAhAiBA0AIAUhBAJAIAAtABJFDQAgBiEEIAYoAgANACAGQYgnNgIAIAYhBAsgBCgCACEECyACQQA2AiAgAiADNgIUIAIgBCADajYCRCACQThqIAIrAxgiCTkDACACQTBqIAk5AwAgAkEoakIANwMADAELIAMQGwsgAigCACICDQALCyABQRBqJAAPC0GaDEEAEDAQNQALxAEBAn8jAEHAAGsiAiQAAkACQCAAKAIEIgNFDQAgAkE7aiADQQAgAy0ABGtBDGxqQWRqKQMAEIgDIAAoAgQtAAQhAwJAIAAoAgwiAEUNACACIAE2AiwgAiADNgIoIAIgADYCICACIAJBO2o2AiRBwhEgAkEgahAwDAILIAIgATYCGCACIAM2AhQgAiACQTtqNgIQQagRIAJBEGoQMAwBCyAAKAIMIQAgAiABNgIEIAIgADYCAEGyECACEDALIAJBwABqJAALmgUCAn8BfAJAAkACQAJAAkACQCABLwEOQYB/ag4GAAQEAQIDBAsCQCAAKAIkIgFFDQADQCAAIAEoAgAiAjYCJCABKAIMEBsgARAbIAIhASACDQALCyAAQQA2AigPC0EAIQICQCABLQAMIgNBCUkNACAAIAFBGGogA0F4ahCEASECCyACRQ0DIAErAxAiBL1C////////////AINCgICAgICAgPj/AFYNAwJAIAIpAxhC////////////AINCgYCAgICAgPj/AFQNACACIAQ5AxggAkEANgIgIAJBOGogBDkDACACQTBqIAQ5AwAgAkEoakIANwMAIAIgAkHAAGooAgA2AhQLIAIgAigCIEEBajYCICACKAIUIQACQAJAQQAoAoCfASIDIAJBxABqKAIAIgFrQQBIDQAgAkEoaiIDIAIrAxggASAAa7iiIAMrAwCgOQMADAELIAJBKGoiASACKwMYIAMgAGu4oiABKwMAoDkDACADIQELIAIgATYCFAJAIAJBOGorAwAgBGNFDQAgAiAEOQM4CwJAIAJBMGorAwAgBGRFDQAgAiAEOQMwCyACIAQ5AxgPC0EAIQICQCABLQAMIgNBBUkNACAAIAFBFGogA0F8ahCEASECCyACRQ0CIAIgASgCECIBQYC4mSkgAUGAuJkpSRs2AhAPC0EAIQICQCABLQAMIgNBAkkNACAAIAFBEWogA0F/ahCEASECCyACRQ0BIAIgAS0AEEEARzoACg8LAkACQCAAIAFB8DAQ4gJB/35qDgQAAgIBAgsgACAAKAIMIgFBgLiZKSABQYC4mSlJGzYCDA8LIAAgACgCCCIBQYC4mSkgAUGAuJkpSRsiATYCCCABRQ0AIABBACgCgJ8BIAFqNgIcCwv6AQEEfyACQQFqIQMgAUHqJyABGyEEAkAgACgCJCIBRQ0AA0ACQCABKAIMIgVFDQAgBSAEIAMQuwNFDQILIAEoAgAiAQ0ACwsCQCABDQBByAAQGiIBQf8BOgAKIAFBADYCBCABIAAoAiQ2AgAgACABNgIkIAFCgICAgICAgPz/ADcDGCABQQAoAoCfASIGNgJAAkAgASgCECIFDQACQAJAIAAtABJFDQAgAEEoaiEFIAAoAigNASAFQYgnNgIADAELIABBDGohBQsgBSgCACEFCyABIAUgBmo2AkQgAUH1HBCCASABIAMQGiIFNgIMIAUgBCACEKUDGgsgAQs4AQF/QQBBgDEQ5wIiATYC4JoBIAFBAToAEiABIAA2AiAgAUHg1AM2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AEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahBnOQMgIAMgBCkDADcDCCACQShqIANBCGoQZyIFOQMAIAUgAisDIGEhAgwBCyACKAIQIAIoAhhGIQILIAAgAhBkIANBIGokAAtAAQJ/IAJBGGoiAyACEKwCNgIAIAIgAhCsAiIENgIQAkAgAygCACICDQAgAEEAKQOgMDcDAA8LIAAgBCACbRBjCysBAn8gAkEYaiIDIAIQrAI2AgAgAiACEKwCIgQ2AhAgACAEIAMoAgBsEGMLtgECAn8BfCMAQSBrIgMkACADQRhqIAIQqgIgAkEYaiIEIAMpAxg3AwAgA0EYaiACEKoCIAIgAykDGDcDEAJAAkACQCACQRRqKAAAQX9HDQAgBCgABEF/Rg0BCyADIAJBEGopAwA3AxAgAiADQRBqEGc5AyAgAyAEKQMANwMIIAJBKGogA0EIahBnIgU5AwAgAisDICAFZSECDAELIAIoAhAgAigCGEwhAgsgACACEGQgA0EgaiQAC7YBAgJ/AXwjAEEgayIDJAAgA0EYaiACEKoCIAJBGGoiBCADKQMYNwMAIANBGGogAhCqAiACIAMpAxg3AxACQAJAAkAgAkEUaigAAEF/Rw0AIAQoAARBf0YNAQsgAyACQRBqKQMANwMQIAIgA0EQahBnOQMgIAMgBCkDADcDCCACQShqIANBCGoQZyIFOQMAIAIrAyAgBWMhAgwBCyACKAIQIAIoAhhIIQILIAAgAhBkIANBIGokAAuQAgIFfwJ8IwBBIGsiAyQAIANBGGogAhCqAiACQRhqIgQgAykDGDcDACADQRhqIAIQqgIgAiADKQMYNwMQIAJBEGohBQJAAkACQAJAIAJBFGooAABBf0cNACAEKAAEQX9GDQELIAMgBSkDADcDECACIANBEGoQZzkDICADIAQpAwA3AwggAkEoaiIGIANBCGoQZzkDAEGoMCEHIAIrAyAiCL1C////////////AINCgICAgICAgPj/AFYNAiAGKwMAIgm9Qv///////////wCDQoCAgICAgID4/wBWDQIgCCAJYyECDAELIAIoAhAgAigCGEghAgsgBCAFIAIbIQcLIAAgBykDADcDACADQSBqJAALkAICBX8CfCMAQSBrIgMkACADQRhqIAIQqgIgAkEYaiIEIAMpAxg3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EGsiBA0AQQAhAgwBCyAEKAIAQYCAgPgAcUGAgIAYRiECCwJAAkAgAkUNACADIAQvAQg2AiQMAQsgAEEAKQOgMDcDAAsgAkUNAQsgACADKAIkEGMLIANBMGokAAslAAJAIAJBABCzAiICDQAgAEEAKQOgMDcDAA8LIAAgAi8BBBBjCzIBAX8jAEEQayIDJAAgA0EIaiACEKoCIAMgAykDCDcDACAAIAIgAxBsEGMgA0EQaiQACw0AIABBACkDuDA3AwALTQEBfyMAQRBrIgMkACADQQhqIAIQqgIgAEHIMEHAMCADKAIIGyICIAJByDAgAygCDEGBgMD/B0YbIAMpAwhQGykDADcDACADQRBqJAALDQAgAEEAKQPQMDcDAAsNACAAQQApA8AwNwMACw0AIABBACkDyDA3AwALIQEBfyABELICIQIgACgCCCIAIAI7AQ4gAEEAEHEgARBuC1UBAXwCQAJAIAEQrgJEAAAAAABAj0CiRAAAAAAAAOA/oCICmUQAAAAAAADgQWNFDQAgAqohAQwBC0GAgICAeCEBCwJAIAFBAEgNACAAKAIIIAEQcgsLGgACQCABEKwCIgFBAEgNACAAKAIIIAEQcgsLJgECfyABEKsCIQIgARCrAiEDIAEgARCyAiADQYAgciACQQAQhgELFwEBfyABEKsCIQIgASABELICIAIQiAELKQEDfyABELECIQIgARCrAiEDIAEQqwIhBCABIAEQsgIgBCADIAIQhgELeAEFfyMAQRBrIgIkACABELECIQMgARCrAiEEAkAgACgCCCgCLCIFLwEIDQACQAJAIARBEEsNACABKAI0IgYgACgCDC8BCCIASw0AIAYgBGogAE0NAQsgAkEIaiAFQfEAEHwMAQsgASADIAYgBBCJAQsgAkEQaiQAC7cBAQd/IwBBEGsiAiQAIAEQqwIhAyABIAJBBGoQsAIhBCABEKsCIQUCQCADQewBSw0AIAAoAggoAiwiBi8BCA0AAkACQCAFQRBLDQAgASgCNCIHIAAoAgwvAQgiCEsNACAHIAVqIAhNDQELIAJBCGogBkHxABB8DAELIAFBzAFqIQEgASAEIAIoAgQgASADakEEakHsASADayAAIAdBA3RqQRhqIAVBABBWIANqOgAACyACQRBqJAALTgECfyMAQRBrIgIkAAJAAkAgARCrAiIDQe0B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IAFB7AAQfA8LIAEgAkF/aiICOgAyIAAgASACQf8BcUEDdGpBOGopAwA3AwALZgECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHwMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsgASABKQMINwMAIAEQZiEAIAFBEGokACAAC2YBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABB8DAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLIAEgASkDCDcDACABEGYhACABQRBqJAAgAAuAAQECfyMAQRBrIgEkAAJAAkAgAC0AMiICDQAgAUEIaiAAQewAEHwMAQsgACACQX9qIgI6ADIgASAAIAJB/wFxQQN0akE4aikDADcDCAsCQAJAIAEoAgxBhoDA/wdHDQAgASgCCCEADAELIAEgAEGIARB8QQAhAAsgAUEQaiQAIAALaAICfwF8IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQfAwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICyABIAEpAwg3AwAgARBnIQMgAUEQaiQAIAMLkgEBAn8jAEEgayICJAACQAJAIAEtADIiAw0AIAJBGGogAUHsABB8DAELIAEgA0F/aiIDOgAyIAIgASADQf8BcUEDdGpBOGopAwA3AxgLIAIgAikDGDcDCAJAAkAgASACQQhqEGkNACACQRBqIAFB/QAQfCAAQQApA9AwNwMADAELIAAgAikDGDcDAAsgAkEgaiQAC6sBAQJ/IwBBMGsiAiQAAkACQCAALQAyIgMNACACQShqIABB7AAQfAwBCyAAIANBf2oiAzoAMiACIAAgA0H/AXFBA3RqQThqKQMANwMoCyACIAIpAyg3AxACQAJAIAAgAkEQahBpDQAgAkEgaiAAQf0AEHwgAkEAKQPQMDcDGAwBCyACIAIpAyg3AxgLIAIgAikDGDcDCCAAIAJBCGogARBqIQAgAkEwaiQAIAALgAEBAn8jAEEQayIBJAACQAJAIAAtADIiAg0AIAFBCGogAEHsABB8DAELIAAgAkF/aiICOgAyIAEgACACQf8BcUEDdGpBOGopAwA3AwgLAkACQCABKAIMQYSAwP8HRg0AIAEgAEH/ABB8QQAhAAwBCyABKAIIIQALIAFBEGokACAAC4ABAQJ/IwBBEGsiASQAAkACQCAALQAyIgINACABQQhqIABB7AAQfAwBCyAAIAJBf2oiAjoAMiABIAAgAkH/AXFBA3RqQThqKQMANwMICwJAAkAgASgCDEGFgMD/B0YNACABIABB/gAQfEEAIQAMAQsgASgCCCEACyABQRBqJAAgAAv3AQEEfyMAQRBrIgIkAAJAAkAgAC0AMiIDDQAgAkEIaiAAQewAEHwMAQsgACADQX9qIgM6ADIgAiAAIANB/wFxQQN0akE4aikDADcDCAsCQAJAAkAgAigCDEGDgcD/B0YNACACIABBgAEQfAwBCwJAAkAgAigCCCIDDQBBACEEDAELIAMtAANBD3EhBAtBCCEFAkACQAJAIARBfWoOAwEEAgALQfsrQeshQdwAQcETEIQDAAtBBCEFCyADIAVqIgQoAgAiAw0BIAFFDQEgBCAAKAK4ARCAAiIDNgIAIAMNASACIABBgwEQfAtBACEDCyACQRBqJAAgAwufAwEJf0EAIQIDQCAAIAJBAnQiA2ogASADai0AADoAACAAIANBAXIiBGogASAEai0AADoAACAAIANBAnIiBGogASAEai0AADoAACAAIANBA3IiA2ogASADai0AADoAAEEIIQQgAkEBaiICQQhHDQALA0AgBEECdCIBIABqIgNBf2otAAAhBSADQX5qLQAAIQYgA0F9ai0AACECIANBfGotAAAhBwJAAkAgBEEHcSIIRQ0AIAUhCSAGIQUgByEKDAELIARBA3ZBgDhqLQAAIAJBgDZqLQAAcyEKIAdBgDZqLQAAIQkgBUGANmotAAAhBSAGQYA2ai0AACECCwJAIAhBBEcNACAJQf8BcUGANmotAAAhCSAFQf8BcUGANmotAAAhBSACQf8BcUGANmotAAAhAiAKQf8BcUGANmotAAAhCgsgAyADQWBqLQAAIApzOgAAIAAgAUEBcmogA0Fhai0AACACczoAACAAIAFBAnJqIANBYmotAAAgBXM6AAAgACABQQNyaiADQWNqLQAAIAlzOgAAIARBAWoiBEE8Rw0ACwujBQEKf0EAIQIDQCACQQJ0IQNBACEEA0AgASADaiAEaiIFIAUtAAAgACAEIANqai0AAHM6AAAgBEEBaiIEQQRHDQAL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LUg6IHNlbmQgY29tcHJlc3NlZDogY21kPSV4ACUtczoleAB2ZXJpZmljYXRpb24gZmFpbHVyZTogJWQgYXQgJXgAV1NTSy1IOiB1bmtub3duIGNtZCAleABqZF93c3NrX25ldwB0c2FnZ19jbGllbnRfZXYAV1NTSy1IOiBtZXRob2Q6ICclcycgcmlkPSV1IG51bXZhbHM9JXUAamRfc2VuZF9ldmVudF9leHQAbG9jYWxob3N0AHN0b3BfbGlzdABhdXRoIHRvbyBzaG9ydABkZXZzX2ZpYmVyX3N0YXJ0AGpkX2Flc19jY21fZW5jcnlwdABqZF9jbGllbnRfZW1pdF9ldmVudABqZF93ZWJzb2NrX29uX2V2ZW50AGpkX3R4X2ZyYW1lX3NlbnQAZGNDdXJyZW50TWVhc3VyZW1lbnQAZGNWb2x0YWdlTWVhc3VyZW1lbnQAZGV2aWNlc2NyaXB0bWdyX2luaXQAcmVmbGVjdGVkTGlnaHQAamRfcXVldWVfc2hpZnQAdGFyZ2V0IHJlc2V0ACEgc2Vuc29yIHdhdGNoZG9nIHJlc2V0AGNsb3VkIHdhdGNoZG9nIHJlc2V0AGRldnNfbWFwX3NldABqZF9jbGllbnRfaGFuZGxlX3BhY2tldAByb2xlbWdyX2hhbmRsZV9wYWNrZXQAamRfb3BpcGVfaGFuZGxlX3BhY2tldAB3cwB3c3MAamRfY2xpZW50X3Byb2Nlc3MAcm9sZW1ncl9wcm9jZXNzAGpkX29waXBlX3Byb2Nlc3MAY29tcGFzcwBkZXZzX2ZpYmVyX2NvcHlfcGFyYW1zAGFnZ2J1ZjogdXBsb2FkZWQgJWQgYnl0ZXMAYWdnYnVmOiBmYWlsZWQgdG8gdXBsb2FkICVkIGJ5dGVzAGphY2RhYy1rZXktJS1zAFdTU0stSDogZW5jc29jayBlcnJvcjogJS1zAFdTU0stSDogY29ubmVjdGluZyB0byB3czovLyVzOiVkJXMAJXM6Ly8lczolZCVzACUtc18lcwAlLXM6JXMAc2VsZi1kZXZpY2U6ICVzLyVzAFdTOiBjb25uZWN0aW5nIHRvICVzAGFzc2VydGlvbiAnJXMnIGZhaWxlZCBhdCAlczolZCBpbiAlcwBKRF9QQU5JQygpIGF0ICVzOiVkIGluICVzAGNsZWFyIHJvbGUgJXMAYXNraW5nIGZvciBkZXBsb3k6ICVzAGRldmljZSByZXNldDogJXMAdHNhZ2c6ICVzOiAlcwBXU1NLOiBlcnJvcjogJXMAZmFpbDogJXMAV1NTSy1IOiBmYWlsZWQgcGFyc2luZyBjb25uIHN0cmluZzogJXMAZGV2aWNlIGRlc3Ryb3llZDogJXMAZGV2aWNlIGNyZWF0ZWQ6ICVzAHRzYWdnOiAlcy8lZDogJXMASlNDUjogJXMAdHNhZ2c6ICVzICglcy8lZCk6ICVzAHdzc2tfY29ubnN0cgBtYXJrX3B0cgB3cml0ZSBlcnIAdGFnIGVycm9yAGRldnNfamRfZ2V0X3JlZ2lzdGVyAHNlcnZpY2VfaGFuZGxlX3JlZ2lzdGVyAGRldnNfdmFsdWVfZnJvbV9wb2ludGVyAGRldnNfZW50ZXIAcG90ZW50aW9tZXRlcgBwdWxzZU94aW1ldGVyAGRlcGxveV9oYW5kbGVyAGRlcGxveV9tZXRhX2hhbmRsZXIAcm90YXJ5RW5jb2RlcgBmcmVlX2ZpYmVyAGpkX3NoYTI1Nl9zZXR1cAAhc3dlZXAAZGV2c192bV9wb3BfYXJnX21hcABzbWFsbCBoZWxsbwBkZXZzX2pkX3Nob3VsZF9ydW4AcmUtcnVuAGJ1dHRvbgBtb3Rpb24Ad2luZERpcmVjdGlvbgBiYWQgdmVyc2lvbgB1bnBpbgBwcm9ncmFtIHdyaXR0ZW4AamRfb3BpcGVfb3BlbgBqZF9pcGlwZV9vcGVuAHNjYW4AZmxhc2hfcHJvZ3JhbQBqZF9yb2xlX2ZyZWVfYWxsAGxpZ2h0TGV2ZWwAd2F0ZXJMZXZlbABzb3VuZExldmVsAG1hZ25ldGljRmllbGRMZXZlbABXU1NLOiBzZW50IGF1dGgAY2FuJ3Qgc2VuZCBhdXRoAG1hcC0+Y2FwYWNpdHkgPD0gbWFwLT5sZW5ndGgAamRfcXVldWVfcHVzaABqZF90eF9mbHVzaABhZ2didWZmZXJfZmx1c2gAZG9fZmx1c2gAbXVsdGl0b3VjaABzd2l0Y2gAZGV2c19qZF9zZW5kX2xvZ21zZwBzbWFsbCBtc2cAV1NTSy1IOiBjbGVhciBjb25uZWN0aW9uIHN0cmluZwAhcV9zZW5kaW5nACEgbG9vcGJhY2sgcnggb3ZmACEgZnJtIHNlbmQgb3ZmAGRldnNfdmFsdWVfdHlwZW9mACgodWludDhfdCAqKWRzdClbaV0gPT0gMHhmZgAwMTIzNDU2Nzg5YWJjZGVmAHEtPmZyb250ID09IHEtPmN1cnJfc2l6ZQAwIDw9IGRpZmYgJiYgZGlmZiArIGxlbiA8PSBjZmcubWF4X3Byb2dyYW1fc2l6ZQBibG9ja19zaXplAGRzdCAtIGJ1ZiA9PSBjdHgtPmFjY19zaXplAGRzdCAtIGJ1ZiA8PSBjdHgtPmFjY19zaXplAHEtPmZyb250IDw9IHEtPnNpemUAcS0+YmFjayA8PSBxLT5zaXplAHEtPmN1cnJfc2l6ZSA8PSBxLT5zaXplAGRldnNfbGVhdmUAc3RhdGUgPT0gX3N0YXRlAHRlcm1pbmF0ZQBoZWFydFJhdGUAamRfd3Nza19jbG9zZQBqZF9vcGlwZV9jbG9zZQBXUzogY2xvc2UAZmxhc2hfZXJhc2UAc29pbE1vaXN0dXJlAHRlbXBlcmF0dXJlAGFpclByZXNzdXJlAG9wZW5pbmcgZGVwbG95IHBpcGUAY2xvc2VkIGRlcGxveSBwaXBlAGpkX3R4X2dldF9mcmFtZQBqZF9wdXNoX2luX2ZyYW1lAHdlaWdodFNjYWxlAHJhaW5HYXVnZQBqZF93c3NrX3NlbmRfbWVzc2FnZQBqZF9kZXZpY2VfZnJlZQBkaXN0YW5jZQBpbGx1bWluYW5jZQBqZF9hbGxvY2F0ZV9zZXJ2aWNlAHJvbGVtZ3JfYXV0b2JpbmQAamRfc2VuZABibG9jayA8IGNodW5rLT5lbmQAbmV4dF9ldmVudF9jbWQAZGV2c19qZF9zZW5kX2NtZAByb2xlbWdyX2RldmljZV9kZXN0cm95ZWQAUkVTVEFSVCByZXF1ZXN0ZWQAV1M6IHdlYnNvY2tldHMgbm90IHN1cHBvcnRlZABXUzogY29ubmVjdGVkAGNyZWF0ZWQAdXBsb2FkIGZhaWxlZAAhc3RhdGUtPmxvY2tlZAByb2xlbWdyX3JvbGVfY2hhbmdlZAB3aW5kU3BlZWQAbWF0cml4S2V5cGFkAGFnZ2J1ZmZlcl91cGxvYWQAZGV2c2Nsb3VkOiBmYWlsZWQgYmluIHVwbG9hZABkZXZzY2xvdWQ6IGZhaWxlZCB1cGxvYWQAJS1zJWQAJS1zXyVkACVzIGZpYmVyICVzX0YlZAAgIHBjPSVkIEAgJXNfRiVkAFBBTklDICVkIGF0IHBjPSVkAHNldCByb2xlICVzIC0+ICVzOiVkAFdTU0stSDogdG9vIHNob3J0IGZyYW1lOiAlZAB0dm9jAGpkX3JvbGVfYWxsb2MAZGV2c19yZWdjYWNoZV9hbGxvYwBiYWQgbWFnaWMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZlcmlmeS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9kZXZpY2VzY3JpcHQuYwBqYWNkYWMtYy9zb3VyY2UvamRfbnVtZm10LmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L29iamVjdHMuYwBqYWNkYWMtYy9kZXZpY2VzY3JpcHQvZmliZXJzLmMAamFjZGFjLWMvc291cmNlL2pkX3NlcnZpY2VzLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2RldmljZXNjcmlwdG1nci5jAGphY2RhYy1jL2NsaWVudC9yb2xlbWdyLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2FnZ2J1ZmZlci5jAGphY2RhYy1jL25ldHdvcmsvYWVzX2NjbS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC92bV91dGlsLmMAamFjZGFjLWMvc291cmNlL2pkX3V0aWwuYwBqYWNkYWMtYy9uZXR3b3JrL3dzc2suYwBwb3NpeC9mbGFzaC5jAGphY2RhYy1jL2NsaWVudC9yb3V0aW5nLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3RzYWdnLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3ZhbHVlLmMAamFjZGFjLWMvc291cmNlL2ludGVyZmFjZXMvdHhfcXVldWUuYwBqYWNkYWMtYy9zb3VyY2UvaW50ZXJmYWNlcy9ldmVudF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9xdWV1ZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9vcGlwZS5jAGphY2RhYy1jL3NvdXJjZS9qZF9pcGlwZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9yZWdjYWNoZS5jAGphY2RhYy1jL2RldmljZXNjcmlwdC9qZGlmYWNlLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L2djX2FsbG9jLmMAamFjZGFjLWMvZGV2aWNlc2NyaXB0L3NvZnRfc2hhMjU2LmMAZGVwbG95ICVkIGIAZGV2c19idWZmZXJfZGF0YQBzZXJ2ICVzLyVkIHJlZyBjaGcgJXggW3N6PSVkXQBCQVNJQ19UQUcoYi0+aGVhZGVyKSA9PSBKQUNTX0dDX1RBR19CWVRFUwBwa3QgIT0gTlVMTAB0cmcgIT0gTlVMTABmICE9IE5VTEwAY2ZnLnByb2dyYW1fYmFzZSAhPSBOVUxMAGZpYiAhPSBOVUxMAGRhdGEgIT0gTlVMTABESVNDT05ORUNUSU5HADAgPD0gZGlmZiAmJiBkaWZmIDw9IGNmZy5tYXhfcHJvZ3JhbV9zaXplIC0gSkRfRkxBU0hfUEFHRV9TSVpFAERJU0NPTk5FQ1RFRAAhIGludmFsaWQgQ1JDAD8/PwB3c3NrOgBlQ08yAGpkX251bWZtdF93cml0ZV9pMzIAamRfbnVtZm10X3JlYWRfaTMyAGV2ZW50X3Njb3BlID09IDEAYXJnMABhdXRoIG5vbi0wAHN6ID4gMAB3cyA+IDAAc2VydmljZV9jb21tYW5kID4gMABzdHItPmN1cnJfcmV0cnkgPT0gMABlcnIgPT0gMABldmVudF9zY29wZSA9PSAwAGN0eC0+c29ja2ZkID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpID09IDAAKEdFVF9UQUcoYi0+aGVhZGVyKSAmIEpBQ1NfR0NfVEFHX01BU0tfU0NBTk5FRCkgPT0gMAAoZGlmZiAmIDcpID09IDAAKCh1aW50cHRyX3Qpc3JjICYgMykgPT0gMAAoKHVpbnRwdHJfdClpbWdkYXRhICYgMykgPT0gMABkZXZzX3ZlcmlmeShkZXZzX2VtcHR5X3Byb2dyYW0sIHNpemVvZihkZXZzX2VtcHR5X3Byb2dyYW0pKSA9PSAwAChkaWZmICYgKEpEX0ZMQVNIX1BBR0VfU0laRSAtIDEpKSA9PSAwACgodWludHB0cl90KXB0ciAmIChKRF9QVFJTSVpFIC0gMSkpID09IDAAKGN0eC0+ZmxhZ3MgJiBKQUNTX0NUWF9GTEFHX0JVU1kpICE9IDAAL3dzc2svAHdzOi8vAGRldnNfaXNfYnVm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BjNlbXNjcmlwdGVuX3dlYnNvY2tldF9zZXRfb25lcnJvcl9jYWxsYmFja19vbl90aHJlYWQHM2Vtc2NyaXB0ZW5fd2Vic29ja2V0X3NldF9vbmNsb3NlX2NhbGxiYWNrX29uX3RocmVhZAg1ZW1zY3JpcHRlbl93ZWJzb2NrZXRfc2V0X29ubWVzc2FnZV9jYWxsYmFja19vbl90aHJlYWQJBGV4aXQKDWVtX3NlbmRfZnJhbWULEGVtX2NvbnNvbGVfZGVidWcMC2VtX3RpbWVfbm93DRRqZF9jcnlwdG9fZ2V0X3JhbmRvbQ4PX193YXNpX2ZkX2Nsb3NlDxVlbXNjcmlwdGVuX21lbWNweV9iaWcQD19fd2FzaV9mZF93cml0ZREWZW1zY3JpcHRlbl9yZXNpemVfaGVhcBILc2V0VGVtcFJldDATGmxlZ2FsaW1wb3J0JF9fd2FzaV9mZF9zZWVrFBFfX3dhc21fY2FsbF9jdG9ycxUUYXBwX2dldF9kZXZpY2VfY2xhc3MWCGh3X3BhbmljFwhqZF9ibGluaxgHamRfZ2xvdxkUamRfYWxsb2Nfc3RhY2tfY2hlY2saCGpkX2FsbG9jGwdqZF9mcmVlHA10YXJnZXRfaW5faXJxHRJ0YXJnZXRfZGlzYWJsZV9pcnEeEXRhcmdldF9lbmFibGVfaXJxHxNqZF9zZXR0aW5nc19nZXRfYmluIBNqZF9zZXR0aW5nc19zZXRfYmluIRdqZF93ZWJzb2NrX3NlbmRfbWVzc2FnZSIOamRfd2Vic29ja19uZXcjBm9ub3BlbiQHb25lcnJvciUHb25jbG9zZSYJb25tZXNzYWdlJxBqZF93ZWJzb2NrX2Nsb3NlKAd0eF9pbml0KQ9qZF9wYWNrZXRfcmVhZHkqCnR4X3Byb2Nlc3MrEGpkX2VtX3NlbmRfZnJhbWUsGmpkX2VtX3NldF9kZXZpY2VfaWRfMnhfaTMyLRpqZF9lbV9zZXRfZGV2aWNlX2lkX3N0cmluZy4KamRfZW1faW5pdC8NamRfZW1fcHJvY2VzczAFZG1lc2cxFGpkX2VtX2ZyYW1lX3JlY2VpdmVkMhFqZF9lbV9kZXZzX2RlcGxveTMYamRfZW1fZGV2c19jbGllbnRfZGVwbG95NAxod19kZXZpY2VfaWQ1DHRhcmdldF9yZXNldDYOdGltX2dldF9taWNyb3M3EmpkX3RjcHNvY2tfcHJvY2VzczgNZmxhc2hfcHJvZ3JhbTkLZmxhc2hfZXJhc2U6CmZsYXNoX3N5bmM7GWluaXRfZGV2aWNlc2NyaXB0X21hbmFnZXI8EWFwcF9pbml0X3NlcnZpY2VzPRJkZXZzX2NsaWVudF9kZXBsb3k+FGNsaWVudF9ldmVudF9oYW5kbGVyPwthcHBfcHJvY2Vzc0Accm9sZW1ncl9zZXJpYWxpemVkX3JvbGVfc2l6ZUEWcm9sZW1ncl9zZXJpYWxpemVfcm9sZUIPcm9sZW1ncl9wcm9jZXNzQxByb2xlbWdyX2F1dG9iaW5kRBVyb2xlbWdyX2hhbmRsZV9wYWNrZXRFFGpkX3JvbGVfbWFuYWdlcl9pbml0Rhhyb2xlbWdyX2RldmljZV9kZXN0cm95ZWRHDWpkX3JvbGVfYWxsb2NIEGpkX3JvbGVfZnJlZV9hbGxJFmpkX3JvbGVfZm9yY2VfYXV0b2JpbmRKEmpkX3JvbGVfYnlfc2VydmljZUsTamRfY2xpZW50X2xvZ19ldmVudEwTamRfY2xpZW50X3N1YnNjcmliZU0UamRfY2xpZW50X2VtaXRfZXZlbnROFHJvbGVtZ3Jfcm9sZV9jaGFuZ2VkTxBqZF9kZXZpY2VfbG9va3VwUBhqZF9kZXZpY2VfbG9va3VwX3NlcnZpY2VRE2pkX3NlcnZpY2Vfc2VuZF9jbWRSEWpkX2NsaWVudF9wcm9jZXNzUw5qZF9kZXZpY2VfZnJlZVQXamRfY2xpZW50X2hhbmRsZV9wYWNrZXRVD2pkX2RldmljZV9hbGxvY1YOZGV2c19zdHJmb3JtYXRXD2RldnNfY3JlYXRlX2N0eFgJc2V0dXBfY3R4WQpkZXZzX3RyYWNlWg9kZXZzX2Vycm9yX2NvZGVbGWRldnNfY2xpZW50X2V2ZW50X2hhbmRsZXJcCWNsZWFyX2N0eF0NZGV2c19mcmVlX2N0eF4OZGV2c190cnlfYWxsb2NfCGRldnNfb29tYAlkZXZzX2ZyZWVhC2RldnNfdmVyaWZ5YhZkZXZzX3ZhbHVlX2Zyb21fZG91YmxlYxNkZXZzX3ZhbHVlX2Zyb21faW50ZBRkZXZzX3ZhbHVlX2Zyb21fYm9vbGUXZGV2c192YWx1ZV9mcm9tX3BvaW50ZXJmEWRldnNfdmFsdWVfdG9faW50ZxRkZXZzX3ZhbHVlX3RvX2RvdWJsZWgSZGV2c192YWx1ZV90b19ib29saQ5kZXZzX2lzX2J1ZmZlcmoQZGV2c19idWZmZXJfZGF0YWsUZGV2c192YWx1ZV90b19nY19vYmpsEWRldnNfdmFsdWVfdHlwZW9mbQ9kZXZzX2lzX251bGxpc2huEGRldnNfZmliZXJfeWllbGRvFmRldnNfZmliZXJfY29weV9wYXJhbXNwGGRldnNfZmliZXJfY2FsbF9mdW5jdGlvbnEYZGV2c19maWJlcl9zZXRfd2FrZV90aW1lchBkZXZzX2ZpYmVyX3NsZWVwcxtkZXZzX2ZpYmVyX3JldHVybl9mcm9tX2NhbGx0GmRldnNfZmliZXJfZnJlZV9hbGxfZmliZXJzdRJkZXZzX2ZpYmVyX2J5X2ZpZHh2EWRldnNfZmliZXJfYnlfdGFndxBkZXZzX2ZpYmVyX3N0YXJ0eBRkZXZzX2ZpYmVyX3Rlcm1pYW50ZXkOZGV2c19maWJlcl9ydW56E2RldnNfZmliZXJfc3luY19ub3d7CmRldnNfcGFuaWN8FV9kZXZzX3J1bnRpbWVfZmFpbHVyZX0PZGV2c19maWJlcl9wb2tlfhxkZXZzX2dldF9wYWNrZWRfc2VydmljZV9kZXNjfw90c2FnZ19jbGllbnRfZXaAAQphZGRfc2VyaWVzgQENdHNhZ2dfcHJvY2Vzc4IBCmxvZ19zZXJpZXODARN0c2FnZ19oYW5kbGVfcGFja2V0hAEUbG9va3VwX29yX2FkZF9zZXJpZXOFAQp0c2FnZ19pbml0hgEUZGV2c19qZF9nZXRfcmVnaXN0ZXKHARZkZXZzX2pkX2NsZWFyX3BrdF9raW5kiAEQZGV2c19qZF9zZW5kX2NtZIkBE2RldnNfamRfc2VuZF9sb2dtc2eKAQ1oYW5kbGVfbG9nbXNniwESZGV2c19qZF9zaG91bGRfcnVujAEXZGV2c19qZF91cGRhdGVfcmVnY2FjaGWNARNkZXZzX2pkX3Byb2Nlc3NfcGt0jgEUZGV2c19qZF9yb2xlX2NoYW5nZWSPARRkZXZzX2pkX3Jlc2V0X3BhY2tldJABEmRldnNfamRfaW5pdF9yb2xlc5EBEmRldnNfamRfZnJlZV9yb2xlc5IBEGRldnNfc2V0X2xvZ2dpbmeTARVkZXZzX2dldF9nbG9iYWxfZmxhZ3OUAQxkZXZzX21hcF9zZXSVAQxkZXZzX21hcF9nZXSWAQpkZXZzX2luZGV4lwEOZGV2c19pbmRleF9zZXSYARFkZXZzX2FycmF5X2luc2VydJkBDmFnZ2J1ZmZlcl9pbml0mgEPYWdnYnVmZmVyX2ZsdXNomwEQYWdnYnVmZmVyX3VwbG9hZJwBDGV4cHJfaW52YWxpZJ0BEGV4cHJ4X2xvYWRfbG9jYWyeARFleHByeF9sb2FkX2dsb2JhbJ8BEWV4cHIzX2xvYWRfYnVmZmVyoAENZXhwcnhfbGl0ZXJhbKEBEWV4cHJ4X2xpdGVyYWxfZjY0ogENZXhwcjBfcmV0X3ZhbKMBDGV4cHIyX3N0cjBlcaQBF2V4cHIxX3JvbGVfaXNfY29ubmVjdGVkpQEOZXhwcjBfcGt0X3NpemWmARFleHByMF9wa3RfZXZfY29kZacBFmV4cHIwX3BrdF9yZWdfZ2V0X2NvZGWoAQlleHByMF9uYW6pAQlleHByMV9hYnOqAQ1leHByMV9iaXRfbm90qwEKZXhwcjFfY2VpbKwBC2V4cHIxX2Zsb29yrQEIZXhwcjFfaWSuAQxleHByMV9pc19uYW6vAQtleHByMV9sb2dfZbABCWV4cHIxX25lZ7EBCWV4cHIxX25vdLIBDGV4cHIxX3JhbmRvbbMBEGV4cHIxX3JhbmRvbV9pbnS0AQtleHByMV9yb3VuZLUBDWV4cHIxX3RvX2Jvb2y2AQlleHByMl9hZGS3AQ1leHByMl9iaXRfYW5kuAEMZXhwcjJfYml0X29yuQENZXhwcjJfYml0X3hvcroBCWV4cHIyX2RpdrsBCGV4cHIyX2VxvAEKZXhwcjJfaWRpdr0BCmV4cHIyX2ltdWy+AQhleHByMl9sZb8BCGV4cHIyX2x0wAEJZXhwcjJfbWF4wQEJZXhwcjJfbWluwgEJZXhwcjJfbXVswwEIZXhwcjJfbmXEAQlleHByMl9wb3fFARBleHByMl9zaGlmdF9sZWZ0xgERZXhwcjJfc2hpZnRfcmlnaHTHARpleHByMl9zaGlmdF9yaWdodF91bnNpZ25lZMgBCWV4cHIyX3N1YskBEGV4cHJ4X2xvYWRfcGFyYW3KAQxleHByMF9ub3dfbXPLARZleHByMV9nZXRfZmliZXJfaGFuZGxlzAEVZXhwcjBfcGt0X3JlcG9ydF9jb2RlzQEWZXhwcjBfcGt0X2NvbW1hbmRfY29kZc4BEWV4cHJ4X3N0YXRpY19yb2xlzwETZXhwcnhfc3RhdGljX2J1ZmZlctABEGV4cHJ4MV9nZXRfZmllbGTRAQtleHByMl9pbmRleNIBE2V4cHIxX29iamVjdF9sZW5ndGjTARFleHByMV9rZXlzX2xlbmd0aNQBDGV4cHIxX3R5cGVvZtUBCmV4cHIwX251bGzWAQ1leHByMV9pc19udWxs1wEQZXhwcjBfcGt0X2J1ZmZlctgBCmV4cHIwX3RydWXZAQtleHByMF9mYWxzZdoBD3N0bXQxX3dhaXRfcm9sZdsBDXN0bXQxX3NsZWVwX3PcAQ5zdG10MV9zbGVlcF9tc90BD3N0bXQzX3F1ZXJ5X3JlZ94BDnN0bXQyX3NlbmRfY21k3wETc3RtdDRfcXVlcnlfaWR4X3JlZ+ABEXN0bXR4Ml9sb2dfZm9ybWF04QENc3RtdHgzX2Zvcm1hdOIBFnN0bXQxX3NldHVwX3BrdF9idWZmZXLjAQ1zdG10Ml9zZXRfcGt05AEKc3RtdDVfYmxpdOUBC3N0bXR4Ml9jYWxs5gEOc3RtdHgzX2NhbGxfYmfnAQxzdG10MV9yZXR1cm7oAQlzdG10eF9qbXDpAQxzdG10eDFfam1wX3rqAQtzdG10MV9wYW5pY+sBEnN0bXR4MV9zdG9yZV9sb2NhbOwBE3N0bXR4MV9zdG9yZV9nbG9iYWztARJzdG10NF9zdG9yZV9idWZmZXLuARJzdG10eDFfc3RvcmVfcGFyYW3vARVzdG10MV90ZXJtaW5hdGVfZmliZXLwAQ9zdG10MF9hbGxvY19tYXDxARFzdG10MV9hbGxvY19hcnJhefIBEnN0bXQxX2FsbG9jX2J1ZmZlcvMBEHN0bXR4Ml9zZXRfZmllbGT0AQ9zdG10M19hcnJheV9zZXT1ARJzdG10M19hcnJheV9pbnNlcnT2ARVleHByeF9zdGF0aWNfZnVuY3Rpb273AQpleHByMl9pbW9k+AEMZXhwcjFfdG9faW50+QEMc3RtdDRfbWVtc2V0+gEPamRfZ2NfdHJ5X2FsbG9j+wEJdHJ5X2FsbG9j/AEHZGV2c19nY/0BD2ZpbmRfZnJlZV9ibG9ja/4BC2pkX2djX3VucGlu/wEKamRfZ2NfZnJlZYACEmRldnNfbWFwX3RyeV9hbGxvY4ECFGRldnNfYXJyYXlfdHJ5X2FsbG9jggIVZGV2c19idWZmZXJfdHJ5X2FsbG9jgwIPZGV2c19nY19zZXRfY3R4hAIOZGV2c19nY19jcmVhdGWFAg9kZXZzX2djX2Rlc3Ryb3mGAgRzY2FuhwITc2Nhbl9hcnJheV9hbmRfbWFya4gCDWNvbnN1bWVfY2h1bmuJAg1zaGFfMjU2X2Nsb3NligIPamRfc2hhMjU2X3NldHVwiwIQamRfc2hhMjU2X3VwZGF0ZYwCEGpkX3NoYTI1Nl9maW5pc2iNAhRkZXZzX3ZtX2V4ZWNfb3Bjb2Rlc44CDmRldnNfYnVmZmVyX29wjwIQZGV2c19yZWFkX251bWJlcpACD2pkX3NldHRpbmdzX2dldJECD2pkX3NldHRpbmdzX3NldJICEmRldnNfcmVnY2FjaGVfZnJlZZMCFmRldnNfcmVnY2FjaGVfZnJlZV9hbGyUAhdkZXZzX3JlZ2NhY2hlX21hcmtfdXNlZJUCE2RldnNfcmVnY2FjaGVfYWxsb2OWAhRkZXZzX3JlZ2NhY2hlX2xvb2t1cJcCEWRldnNfcmVnY2FjaGVfYWdlmAIXZGV2c19yZWdjYWNoZV9mcmVlX3JvbGWZAhJkZXZzX3JlZ2NhY2hlX25leHSaAhdkZXZpY2VzY3JpcHRtZ3JfcHJvY2Vzc5sCB3RyeV9ydW6cAgxzdG9wX3Byb2dyYW2dAhxkZXZpY2VzY3JpcHRtZ3JfZGVwbG95X3N0YXJ0ngIcZGV2aWNlc2NyaXB0bWdyX2RlcGxveV93cml0ZZ8CGGRldmljZXNjcmlwdG1ncl9nZXRfaGFzaKACHWRldmljZXNjcmlwdG1ncl9oYW5kbGVfcGFja2V0oQIOZGVwbG95X2hhbmRsZXKiAhNkZXBsb3lfbWV0YV9oYW5kbGVyowIWZGV2aWNlc2NyaXB0bWdyX2RlcGxveaQCFGRldmljZXNjcmlwdG1ncl9pbml0pQIZZGV2aWNlc2NyaXB0bWdyX2NsaWVudF9ldqYCEWRldnNjbG91ZF9wcm9jZXNzpwIXZGV2c2Nsb3VkX2hhbmRsZV9wYWNrZXSoAhNkZXZzY2xvdWRfb25fbWV0aG9kqQIOZGV2c2Nsb3VkX2luaXSqAg9kZXZzX3ZtX3BvcF9hcmerAhNkZXZzX3ZtX3BvcF9hcmdfdTMyrAITZGV2c192bV9wb3BfYXJnX2kzMq0CFGRldnNfdm1fcG9wX2FyZ19mdW5jrgITZGV2c192bV9wb3BfYXJnX2Y2NK8CFmRldnNfdm1fcG9wX2FyZ19idWZmZXKwAhtkZXZzX3ZtX3BvcF9hcmdfYnVmZmVyX2RhdGGxAhZkZXZzX3ZtX3BvcF9hcmdfc3RyaWR4sgIUZGV2c192bV9wb3BfYXJnX3JvbGWzAhNkZXZzX3ZtX3BvcF9hcmdfbWFwtAIMQUVTX2luaXRfY3R4tQIPQUVTX0VDQl9lbmNyeXB0tgIQamRfYWVzX3NldHVwX2tlebcCDmpkX2Flc19lbmNyeXB0uAIQamRfYWVzX2NsZWFyX2tlebkCEGpkX3dzc2tfb25fZXZlbnS6AgpzZW5kX2VtcHR5uwISd3Nza2hlYWx0aF9wcm9jZXNzvAIXamRfdGNwc29ja19pc19hdmFpbGFibGW9AhR3c3NraGVhbHRoX3JlY29ubmVjdL4CGHdzc2toZWFsdGhfaGFuZGxlX3BhY2tldL8CD3NldF9jb25uX3N0cmluZ8ACEWNsZWFyX2Nvbm5fc3RyaW5nwQIPd3Nza2hlYWx0aF9pbml0wgITd3Nza19wdWJsaXNoX3ZhbHVlc8MCEHdzc2tfcHVibGlzaF9iaW7EAhF3c3NrX2lzX2Nvbm5lY3RlZMUCE3dzc2tfcmVzcG9uZF9tZXRob2TGAhJqZF9hZXNfY2NtX2VuY3J5cHTHAhJqZF9hZXNfY2NtX2RlY3J5cHTIAgtqZF93c3NrX25ld8kCFGpkX3dzc2tfc2VuZF9tZXNzYWdlygITamRfd2Vic29ja19vbl9ldmVudMsCB2RlY3J5cHTMAg1qZF93c3NrX2Nsb3NlzQINamRfcmVzcG9uZF91OM4CDmpkX3Jlc3BvbmRfdTE2zwIOamRfcmVzcG9uZF91MzLQAhFqZF9yZXNwb25kX3N0cmluZ9ECF2pkX3NlbmRfbm90X2ltcGxlbWVudGVk0gILamRfc2VuZF9wa3TTAhFqZF9vcGlwZV9vcGVuX2NtZNQCFGpkX29waXBlX29wZW5fcmVwb3J01QIWamRfb3BpcGVfaGFuZGxlX3BhY2tldNYCEWpkX29waXBlX3dyaXRlX2V41wIQamRfb3BpcGVfcHJvY2Vzc9gCFGpkX29waXBlX2NoZWNrX3NwYWNl2QIOamRfb3BpcGVfd3JpdGXaAg5qZF9vcGlwZV9jbG9zZdsCDWpkX2lwaXBlX29wZW7cAhZqZF9pcGlwZV9oYW5kbGVfcGFja2V03QIOamRfaXBpcGVfY2xvc2XeAg1qZF9xdWV1ZV9wdXNo3wIOamRfcXVldWVfZnJvbnTgAg5qZF9xdWV1ZV9zaGlmdOECDmpkX3F1ZXVlX2FsbG9j4gIdc2VydmljZV9oYW5kbGVfcmVnaXN0ZXJfZmluYWzjAhdzZXJ2aWNlX2hhbmRsZV9yZWdpc3RlcuQCGWpkX3NlcnZpY2VzX2hhbmRsZV9wYWNrZXTlAhRqZF9hcHBfaGFuZGxlX3BhY2tldOYCFWpkX2FwcF9oYW5kbGVfY29tbWFuZOcCE2pkX2FsbG9jYXRlX3NlcnZpY2XoAhBqZF9zZXJ2aWNlc19pbml06QIOamRfcmVmcmVzaF9ub3fqAhlqZF9zZXJ2aWNlc19wYWNrZXRfcXVldWVk6wIUamRfc2VydmljZXNfYW5ub3VuY2XsAhdqZF9zZXJ2aWNlc19uZWVkc19mcmFtZe0CEGpkX3NlcnZpY2VzX3RpY2vuAhVqZF9wcm9jZXNzX2V2ZXJ5dGhpbmfvAhpqZF9wcm9jZXNzX2V2ZXJ5dGhpbmdfY29yZfACEmFwcF9nZXRfZndfdmVyc2lvbvECFmFwcF9nZXRfZGV2X2NsYXNzX25hbWXyAhJqZF9udW1mbXRfaXNfdmFsaWTzAhVqZF9udW1mbXRfd3JpdGVfZmxvYXT0AhNqZF9udW1mbXRfd3JpdGVfaTMy9QISamRfbnVtZm10X3JlYWRfaTMy9gIUamRfbnVtZm10X3JlYWRfZmxvYXT3Ag1qZF9oYXNoX2ZudjFh+AIMamRfZGV2aWNlX2lk+QIJamRfcmFuZG9t+gIIamRfY3JjMTb7Ag5qZF9jb21wdXRlX2NyY/wCDmpkX3NoaWZ0X2ZyYW1l/QIOamRfcmVzZXRfZnJhbWX+AhBqZF9wdXNoX2luX2ZyYW1l/wINamRfcGFuaWNfY29yZYADE2pkX3Nob3VsZF9zYW1wbGVfbXOBAxBqZF9zaG91bGRfc2FtcGxlggMJamRfdG9faGV4gwMLamRfZnJvbV9oZXiEAw5qZF9hc3NlcnRfZmFpbIUDB2pkX2F0b2mGAwtqZF92c3ByaW50ZocDD2pkX3ByaW50X2RvdWJsZYgDEmpkX2RldmljZV9zaG9ydF9pZIkDDGpkX3NwcmludGZfYYoDC2pkX3RvX2hleF9hiwMUamRfZGV2aWNlX3Nob3J0X2lkX2GMAwlqZF9zdHJkdXCNAw5qZF9qc29uX2VzY2FwZY4DE2pkX2pzb25fZXNjYXBlX2NvcmWPAwlqZF9tZW1kdXCQAw9qZF9jdHJsX3Byb2Nlc3ORAxVqZF9jdHJsX2hhbmRsZV9wYWNrZXSSAwxqZF9jdHJsX2luaXSTAxZqZF9wcm9jZXNzX2V2ZW50X3F1ZXVllAMWZG9fcHJvY2Vzc19ldmVudF9xdWV1ZZUDEWpkX3NlbmRfZXZlbnRfZXh0lgMKamRfcnhfaW5pdJcDFGpkX3J4X2ZyYW1lX3JlY2VpdmVkmAMdamRfcnhfZnJhbWVfcmVjZWl2ZWRfbG9vcGJhY2uZAw9qZF9yeF9nZXRfZnJhbWWaAxNqZF9yeF9yZWxlYXNlX2ZyYW1lmwMRamRfc2VuZF9mcmFtZV9yYXecAw1qZF9zZW5kX2ZyYW1lnQMKamRfdHhfaW5pdJ4DB2pkX3NlbmSfAxZqZF9zZW5kX2ZyYW1lX3dpdGhfY3JjoAMPamRfdHhfZ2V0X2ZyYW1loQMQamRfdHhfZnJhbWVfc2VudKIDC2pkX3R4X2ZsdXNoowMQX19lcnJub19sb2NhdGlvbqQDBWR1bW15pQMIX19tZW1jcHmmAwdtZW1tb3ZlpwMGbWVtc2V0qAMKX19sb2NrZmlsZakDDF9fdW5sb2NrZmlsZaoDDF9fc3RkaW9fc2Vla6sDDV9fc3RkaW9fd3JpdGWsAw1fX3N0ZGlvX2Nsb3NlrQMMX19zdGRpb19leGl0rgMKY2xvc2VfZmlsZa8DCV9fdG93cml0ZbADCV9fZndyaXRleLEDBmZ3cml0ZbIDK2Vtc2NyaXB0ZW5fbWFpbl90aHJlYWRfcHJvY2Vzc19xdWV1ZWRfY2FsbHOzAxRfX3B0aHJlYWRfbXV0ZXhfbG9ja7QDFl9fcHRocmVhZF9tdXRleF91bmxvY2u1AwZfX2xvY2u2Aw5fX21hdGhfZGl2emVyb7cDDl9fbWF0aF9pbnZhbGlkuAMDbG9nuQMFbG9nMTC6AwdfX2xzZWVruwMGbWVtY21wvAMKX19vZmxfbG9ja70DDF9fbWF0aF94Zmxvd74DCmZwX2JhcnJpZXK/AwxfX21hdGhfb2Zsb3fAAwxfX21hdGhfdWZsb3fBAwRmYWJzwgMDcG93wwMIY2hlY2tpbnTEAwtzcGVjaWFsY2FzZcUDBXJvdW5kxgMGc3RyY2hyxwMLX19zdHJjaHJudWzIAwZzdHJjbXDJAwZzdHJsZW7KAxJfX3dhc2lfc3lzY2FsbF9yZXTLAwhkbG1hbGxvY8wDBmRsZnJlZc0DGGVtc2NyaXB0ZW5fZ2V0X2hlYXBfc2l6Zc4DBHNicmvPAwlfX3Bvd2lkZjLQAwlzdGFja1NhdmXRAwxzdGFja1Jlc3RvcmXSAwpzdGFja0FsbG9j0wMVZW1zY3JpcHRlbl9zdGFja19pbml01AMZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZdUDGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2XWAxhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmTXAwxkeW5DYWxsX2ppamnYAxZsZWdhbHN0dWIkZHluQ2FsbF9qaWpp2QMYbGVnYWxmdW5jJF9fd2FzaV9mZF9zZWVrAhMB1wMEAARmcHRyAQEwAgExAwEyBy0DAA9fX3N0YWNrX3BvaW50ZXIBC19fc3RhY2tfZW5kAgxfX3N0YWNrX2Jhc2UJGAMABy5yb2RhdGEBBS5kYXRhAgVlbV9qcw==';
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
