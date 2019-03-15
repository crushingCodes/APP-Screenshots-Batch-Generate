//Config default locations
const OutputFolder = './screensOut/';
const InputFolder = './screensIn/';
const platforms = ["android", "ios"];
const sizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
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
function getInputDimensions(width, height) {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions;
    if (width >= height) {
        dimensions = { width: width, height: height, orientation: "landscape" };
    }
    else {
        dimensions = { width: width, height: height, orientation: "portrait" };
    }
    return dimensions;
}
let newImagesObj = {};
generateNewScreeshots();
function generateNewScreeshots() {
    const fs = require('fs');
    let sizeOf = require('image-size');
    let inpImgPath = "";
    let outImgPath = "";
    let dimensionsIn;
    let dimensionsOut;
    let outImgDir = "";
    //    initFolders();
    //For each file found in input folder
    fs.readdirSync(InputFolder).forEach((file) => {
        //let outImgDir = "";
        inpImgPath = InputFolder + file;
        for (let profileName in sizeProfiles) {
            //   outImgDir = OutputFolder + profileName;
            dimensionsIn = sizeOf(inpImgPath);
            newImagesObj[file] = getInputDimensions(dimensionsIn.width, dimensionsIn.height);
            outImgPath = outImgDir;
            //                        outImgPath = outImgDir + "/" + file;
            //
            // makeAllDirs(__dirname).then(() => {            
            processImage(file, profileName);
        }
    });
}
function processImage(file, profileSizeName) {
    const fs = require('fs-extra');
    const resizeImg = require('resize-img');
    let inpImgPath = InputFolder + file;
    let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[file]);
    resizeImg(fs.readFileSync(inpImgPath), { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
        let outImgPath = OutputFolder + sizeProfiles[profileSizeName].platform + "/" + profileSizeName;
        // With a callback:
        fs.ensureDir(outImgPath, err => {
            //console.log(err) // => null
            // dir has now been created, including the directory it is to be placed in
            let filePath = outImgPath + "/" + file;
            fs.writeFileSync(filePath, buf);
        });
    });
}
