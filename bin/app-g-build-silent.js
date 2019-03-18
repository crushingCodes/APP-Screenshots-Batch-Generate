#! /usr/bin/env node
var shell = require("shelljs");

//shell.exec("echo shell.exec works");
//shell.exec("npm run build --silent");
console.log("inside app-g-build-silent");
shell.exec("tsc && npm pack && npm i -g app-screenshots-batch-generate-1.0.0.tgz")