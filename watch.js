const chokidar = require('chokidar');
const invalidate = require('invalidate-module');
const path = require('path');

function build() {
  try {
    require('./build')();
  } catch (err) {
    console.error(err);
  }
}

const watcher = chokidar.watch('*.js', {
  ignoreInitial: true,
});

build();

watcher.on('all', (event, filename) => {
  invalidate(path.resolve(filename));
  build();
});
