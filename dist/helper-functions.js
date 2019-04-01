var printVersion = function () {
    return console.log("1.0.0");
};
var printHelp = function () {
    console.log();
    console.log("App Generate Screenshots");
    console.log();
    console.log("Type app-g-screenshots followed by the following options:");
    console.log("-g     Generate Screenshots according to Configuration");
    console.log("-c     View Configuration");
    console.log("--in   Config screenshots in path");
    console.log("--out  Config Screenshots out path");
    console.log("-v     Version");
    console.log("-h     Help");

    return console.log();
};
exports.printVersion = printVersion;
exports.printHelp = printHelp;
