const Module = require('module');
const vm = require('vm');

const { _resolveFilename } = Module;

const runtimeModules = {};

function stripBOM(x) {
  if (typeof x !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof x}`);
  }
  if (x.charCodeAt(0) === 0xFEFF) {
    return x.slice(1);
  }

  return x;
}

Module._resolveFilename = function (request, parent, isMain) {
  if (request in runtimeModules) {
    return runtimeModules[request];
  }
  return _resolveFilename(request, parent, isMain);
};

module.exports = function runtime(name, script) {
  script = stripBOM(script);
  const filename = `runtime://${name}`;
  const runtime = new Module(Date.now().toString(), module.parent);
  const wrapper = Module.wrap(script);
  const compiledWrapper = vm.runInThisContext(wrapper, {
    filename,
    lineOffset: 0,
    displayErrors: true,
  });

  const args = [runtime.exports, require, runtime, '/', filename];

  runtime.loaded = true;
  runtime.filename = filename;
  runtime.paths = ['/'];
  runtime.exports.requireDepth += 1;

  compiledWrapper.apply(runtime.exports, args);

  Module._cache[filename] = runtime;
  runtimeModules[name] = filename;
};
