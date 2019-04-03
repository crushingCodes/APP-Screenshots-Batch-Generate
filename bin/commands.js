#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../dist/index");
let minimist = require('minimist');
const { yellow, blue, bold } = require('kleur');
let index = new index_1.ScreenshotGenerator();
const minimistOptions = {
    string: ['in', 'out'],
    boolean: ['version', 'config', 'android', 'ios'],
    alias: { h: 'help', v: 'version', c: 'config' },
};
let args = minimist(process.argv.slice(2), minimistOptions);
var printHelp = function () {
    console.log(bold().blue("App Generate Screenshots "));
    console.log();
    console.log("Type ", yellow("app-g-screenshots"), " followed by the options below:");
    console.log("--android  Generate Android Screenshot Sizes");
    console.log("--ios      Generate iOS Screenshot Sizes");
    console.log("--in       Configure screenshots input path");
    console.log("--out      Configure Screenshots output path");
    console.log("-c         View Configuration");
    console.log("-v         Version");
    console.log("-h         Help");
    return console.log();
};
var printVersion = function () {
    return console.log("1.0.1");
};
getOptionSelection(args);
function getOptionSelection(args) {
    if (args.v || args.h || args.in || args.out || args.c || args.android || args.ios) {
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
        if (args.ios) {
            index.generateNewScreeshots("ios");
        }
        if (args.android) {
            index.generateNewScreeshots("android");
        }
    }
    else {
        console.log("No options selected!");
        printHelp();
    }
}
