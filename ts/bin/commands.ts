#!/usr/bin/env node
import { ScreenshotGenerator } from "../dist/index";
let minimist = require('minimist')
const { yellow, blue, bold } = require('kleur');

let index = new ScreenshotGenerator();

const minimistOptions = {
  string: ['in', 'out'],
  boolean: ['version', 'config', 'android', 'ios'],
  alias: { h: 'help', v: 'version', c: 'config', a: 'android', i: 'ios' },
};
let args = minimist(process.argv.slice(2), minimistOptions)

var printHelp = function () {
  console.log(bold().blue("App Generate Screenshots "));
  console.log();
  console.log("Type ", yellow("app-g-screenshots"), " followed by the options below:");
  console.log("-a     Generate Android Screenshot Sizes");
  console.log("-i     Generate iOS Screenshot Sizes");
  console.log("-c     View Configuration");
  console.log("--in   Configure screenshots input path");
  console.log("--out  Configure Screenshots output path");
  console.log("-v     Version");
  console.log("-h     Help");

  return console.log();
};
var printVersion = function () {
  return console.log("1.0.0");
};
getOptionSelection(args);

function getOptionSelection(args) {
  if (args.v || args.h || args.in || args.out || args.c || args.g || args.android || args.ios) {
    if (args.v) {
      printVersion();
    }
    if (args.h) {
      printHelp();
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
    if (args.i) {
      index.generateNewScreeshots("ios");

    }
    if (args.a) {
      index.generateNewScreeshots("android");
    }

  } else {
    console.log("No options selected!");
    printHelp();
  }
}