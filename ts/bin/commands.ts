#!/usr/bin/env node
let minimist = require('minimist')
let functionsLibrary = require('../dist/helper-functions.js');

import { ScreenshotGenerator } from "../dist/index";
let index = new ScreenshotGenerator();

let args = minimist(process.argv.slice(2), {
  string: ['in', 'out'],
  boolean: ['version', 'generate', 'config', 'android', 'ios'],
  alias: { h: 'help', g: 'generate', v: 'version', c: 'config', a: 'android', i: 'ios' },
})

if (args.v || args.h || args.in || args.out || args.c || args.g || args.android || args.ios) {
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
  if (args.ios) {
    index.generateNewScreeshots("ios");

  }
  if (args.android) {
    index.generateNewScreeshots("android");
  }

} else {
  console.log("No options selected!");
  functionsLibrary.printHelp();
}
