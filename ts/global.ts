
var printVersion = function() {
    return console.log("1.00");
};
exports.printVersion = printVersion;

var printHelp = function() {
     console.log();
     console.log("App Screens Generator");
     console.log();
     console.log("-v    Version");
     console.log("-h    Help");
     console.log("-c    View Configuration");
     console.log("--in  Set screenshots in path");
     console.log("--out Set Screenshots out path");
    return console.log();
};
exports.printHelp = printHelp;