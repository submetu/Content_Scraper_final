var mkdirp = require('mkdirp');
var main = require('./main');

// makes a directory 'data' if it doesn't exist and runs the callback function main.main
mkdirp('./data',main.main);

