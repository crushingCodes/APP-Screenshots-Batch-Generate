#!/usr/bin/env node
var minimist = require('minimist')

let argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

let args = minimist(process.argv.slice(2), {
    string: 'lang',           // --lang xml
    boolean: ['version'],     // --version
    alias: { v: 'version' }
  })

  console.log(args);
  
let myLibrary = require('../dist/global.js');

// Displays the text in the console
myLibrary.say('Jack, get back, come on before we crack Lose your blues, everybody cut footloose');

console.log("global call working 2!");