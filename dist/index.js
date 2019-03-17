const sizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
};
let config = {
    keyvalue: []
};
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
//Global Variables
let OutputFolder;
let InputFolder;
let newImagesObj = {};
loadConfig();
function initConfig() {
    conf.set('inputTargetURL', './screensIn/');
    conf.set('outputTargetURL', './screensOut/');
    console.log('Config Init');
}
function loadConfig() {
    if (conf.get('inputTargetURL') == null || conf.get('outputTargetURL') == null) {
        initConfig();
    }
    else {
        OutputFolder = conf.get('outputTargetURL');
        InputFolder = conf.get('inputTargetURL');
    }
    console.log('Input Folder: ', InputFolder);
    console.log('Ouput Folder: ', OutputFolder);
    generateNewScreeshots();
}
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
    let sizeOf = require('image-size');
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
function generateNewScreeshots() {
    const isImage = require('is-image');
    const fs = require('fs');
    let inpImgPath = "";
    console.log("gen called ", InputFolder);
    //For each file found in input folder
    fs.readdirSync(InputFolder).forEach((fName) => {
        inpImgPath = InputFolder + fName;
        console.log(inpImgPath);
        if (isImage(inpImgPath)) {
            for (let profileSizeName in sizeProfiles) {
                newImagesObj[fName] = {
                    dimensions: getInputDimensions(inpImgPath), fPath: inpImgPath
                };
                processImage(fName, profileSizeName);
            }
        }
    });
}
function processImage(fName, profileSizeName) {
    const fs = require('fs-extra');
    const resizeImg = require('resize-img');
    let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[fName].dimensions);
    resizeImg(fs.readFileSync(newImagesObj[fName].fPath), { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
        let outImgPath = OutputFolder + sizeProfiles[profileSizeName].platform
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
