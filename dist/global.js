var printVersion = function () {
    return console.log("1.00");
};
exports.printVersion = printVersion;
var printHelp = function () {
    console.log("App Screen Generator");
    console.log();
    console.log("-v Version");
    console.log("--in Configure Screenshots in");
    console.log("--out Configure Screenshots out");
    return console.log();
};
exports.printHelp = printHelp;
