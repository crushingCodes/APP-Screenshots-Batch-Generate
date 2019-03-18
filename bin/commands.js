#!/usr/bin/env node
let minimist = require('minimist')
let functionsLibrary = require('../dist/helper-functions.js');
let index = require('../dist/index.js');

let args = minimist(process.argv.slice(2), {
  string: 'in',
  string: 'out',
  boolean: ['version'],     // --version
  boolean: ['generate'],
  boolean: ['config'],
  alias: { h: 'help', g: 'generate', v: 'version', c: 'config' },
})

//console.log(args);

if (args.v) {
  functionsLibrary.printVersion();
}
if (args.h) {
  functionsLibrary.printHelp();
}
if (args.in) {
  index.updateConfigInput(args.in);
}
if (args.out) {
  index.updateConfigOutput(args.out);
}
if (args.c) {
  index.showConfigPrintout();
}
//Place this last to ensure configs are set first if present
if (args.g) {
  index.generateNewScreeshots();
}


