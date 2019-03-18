
var printVersion = function() {
    return console.log("1.0.0");
};

var printHelp = function() {
     console.log();
     console.log("App Generate Screenshots - app-g-screenshots");
     console.log();
     console.log("Options");
     console.log("-v     Version");
     console.log("-h     Help");
     console.log("-c     View Configuration");
     console.log("--in   Set screenshots in path");
     console.log("--out  Set Screenshots out path");
    return console.log();
};

exports.printVersion = printVersion;
exports.printHelp = printHelp;