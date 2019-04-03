const { red, yellow, blue, bold } = require('kleur');

var printVersion = function () {
    return console.log("1.0.0");
};

var printHelp = function () {
    console.log();
    console.log(bold().blue("App Generate Screenshots "));
    console.log();
    console.log("Type ", yellow("app-g-screenshots"), " followed by the options below:");
    console.log("-g     Generate Screenshot Sizes");
    console.log("-c     View Configuration");
    console.log("--in   Configure screenshots input path");
    console.log("--out  Configure Screenshots output path");
    console.log("-v     Version");
    console.log("-h     Help");

    return console.log();
};

exports.printVersion = printVersion;
exports.printHelp = printHelp;