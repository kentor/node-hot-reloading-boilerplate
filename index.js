const fs = require('fs');
const Module = require('module');
const path = require('path');
const { DepGraph } = require('dependency-graph');

const graph = new DepGraph();
const __require = Module.prototype.require;

Module.prototype.require = function(p) {
  const module = __require.call(this, p);
  const moduleName = Module._resolveFilename(p, this);
  graph.addNode(this.filename);
  graph.addNode(moduleName);
  graph.addDependency(this.filename, moduleName);
  return module;
};

fs.watch(process.cwd(), { recursive: true }, (event, filename) => {
  const absFilename = path.resolve(filename);

  if (graph.hasNode(absFilename)) {
    graph.dependantsOf(absFilename).concat([absFilename]).forEach(module => {
      delete require.cache[module];
    });
  }

  try {
    require('./handler')(event, filename);
  } catch (err) {
    console.log(err);
  }
});
