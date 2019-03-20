const validPath = require('valid-path');
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const isImage = require('is-image');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const sizeOf = require('image-size');
const sizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
};
const configKeys = { inputTargetURL: "inputTargetURL", outputTargetURL: "outputTargetURL" };
//Global Variables
let outputFolder;
let inputFolder;
let newImagesObj = {};
function initConfig() {
    //Set default folder locations
    conf.set(configKeys.inputTargetURL, '');
    conf.set(configKeys.outputTargetURL, '');
    console.log('Default config initialized');
}
function loadConfig() {
    if (conf.get(configKeys.inputTargetURL) == null || conf.get(configKeys.outputTargetURL) == null) {
        initConfig();
    }
    else {
        outputFolder = conf.get(configKeys.outputTargetURL);
        inputFolder = conf.get(configKeys.inputTargetURL);
    }
    //Check for no path
    if (checkPath("input path", inputFolder) &&
        checkPath("output path", outputFolder)) {
        return true;
    }
    else {
        return false;
    }
}
function checkPath(pathName, fPath) {
    let validatedPath;
    if (fPath == "") {
        folderError(pathName);
        return false;
    }
    validatedPath = validPath(fPath);
    if (validatedPath) {
        if (fPath[fPath.length - 1] == '/') {
            return true;
        }
        else {
            console.error("The path entered for ", pathName, " was not a directory.");
            return false;
        }
    }
    else {
        console.error(validPath);
        return false;
    }
}
function folderError(folderName) {
    console.error("Error:", folderName, " not set! Please type -h to find instructions.");
}
function updateConfigByConfigKey(configKey, inputPath) {
    conf.set(configKey, inputPath);
}
var updateConfigInput = function (inputPath) {
    //route the function to the correct configKey
    updateConfigByConfigKey(configKeys.inputTargetURL, inputPath);
};
var updateConfigOutput = function (inputPath) {
    //route the function to the correct configKey
    updateConfigByConfigKey(configKeys.outputTargetURL, inputPath);
};
var showConfigPrintout = function () {
    outputFolder = conf.get(configKeys.outputTargetURL);
    inputFolder = conf.get(configKeys.inputTargetURL);
    console.log();
    console.log('Configuration');
    console.log();
    console.log('Input Folder: ', inputFolder);
    console.log('Ouput Folder: ', outputFolder);
    //need a way to reset to default locations
};
function getOutputDimensions(targetProfileName, dimensionsInp) {
    let dimensionsOut;
    let tempProfile = sizeProfiles[targetProfileName];
    //Auto decide which dimensions to use based on input size
    if (dimensionsInp.orientation == "landscape") {
        dimensionsOut = {
            width: tempProfile.dimensions.longLength, height: tempProfile.dimensions.shortLength,
            orientation: dimensionsInp.orientation
        };
    }
    else {
        dimensionsOut = {
            width: tempProfile.dimensions.shortLength, height: tempProfile.dimensions.longLength,
            orientation: dimensionsInp.orientation
        };
    }
    return dimensionsOut;
}
function getInputDimensions(inpImgPath) {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensionsIn = sizeOf(inpImgPath);
    let dimensions;
    if (dimensionsIn.width >= dimensionsIn.height) {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "landscape" };
    }
    else {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "portrait" };
    }
    return dimensions;
}
var generateNewScreeshots = function () {
    if (loadConfig()) {
        let inpImgPath = "";
        let count = 0;
        console.log("Generate called for: ", inputFolder);
        //If no input folder found create it
        fs.ensureDir(inputFolder, err => {
            //For each file found in input folder
            fs.readdirSync(inputFolder).forEach((fName) => {
                inpImgPath = inputFolder + fName;
                if (isImage(inpImgPath)) {
                    console.log("Processing: ", inpImgPath);
                    count += 1;
                    for (let profileSizeName in sizeProfiles) {
                        newImagesObj[fName] = {
                            dimensions: getInputDimensions(inpImgPath), fPath: inpImgPath
                        };
                        processImage(fName, profileSizeName);
                    }
                }
            });
            console.log("Generated Screenshots for", count, "picture/s stored in", outputFolder);
        });
    }
};
function processImage(fName, profileSizeName) {
    let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[fName].dimensions);
    resizeImg(fs.readFileSync(newImagesObj[fName].fPath), { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
        let outImgPath = outputFolder + sizeProfiles[profileSizeName].platform
            + "/" + profileSizeName;
        fs.ensureDir(outImgPath, err => {
            if (err) {
                console.log(err);
            }
            let fileFullPath = outImgPath + "/" + fName;
            fs.writeFileSync(fileFullPath, buf);
        });
    });
}
//Exports Section
exports.updateConfigInput = updateConfigInput;
exports.updateConfigOutput = updateConfigOutput;
exports.showConfigPrintout = showConfigPrintout;
exports.generateNewScreeshots = generateNewScreeshots;
