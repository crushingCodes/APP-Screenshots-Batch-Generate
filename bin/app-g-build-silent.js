#! /usr/bin/env node
var shell = require("shelljs");

//shell.exec("echo shell.exec works");
shell.exec("npm run build --silent");
