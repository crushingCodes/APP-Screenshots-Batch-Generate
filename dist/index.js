//import{OutputProfile} from "./output-profile";
//import{ImageSpecs} from "./Image-Specs";
//Config default locations
const OutputFolder = './screensOut/';
const InputFolder = './screensIn/';
const sizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
};
//interface OutputProfiles{(sizeName:string):OutputProfile};
//interface ImageObject {fileName:FileName,dimensions:Dimensions};
//Global Vars
function getOutputDimensions(dimensionsInp) {
    let dimensionsOut;
    let tempProfile = sizeProfiles["5.5"];
    //Auto decide which dimensions to use based on input size
    if (dimensionsInp.orientation == "landscape") {
        dimensionsOut = { width: tempProfile.dimensions.longLength, height: tempProfile.dimensions.shortLength, orientation: dimensionsInp.orientation };
    }
    else {
        dimensionsOut = { width: tempProfile.dimensions.shortLength, height: tempProfile.dimensions.longLength,
            orientation: dimensionsInp.orientation };
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
getImageInpObjects();
function getImageInpObjects() {
    const fs = require('fs');
    const resizeImg = require('resize-img');
    let sizeOf = require('image-size');
    let inpImgPath = "";
    let outImgPath = "";
    let dimensionsIn;
    let dimensionsOut;
    let newImagesObj = {};
    let outImgDir = "";
    initFolders();
    //For each file found in input folder
    fs.readdirSync(InputFolder).forEach((file) => {
        //let outImgDir = "";
        for (let profileName in sizeProfiles) {
            outImgDir = OutputFolder + profileName;
            inpImgPath = InputFolder + file;
            dimensionsIn = sizeOf(inpImgPath);
            newImagesObj[file] = getInputDimensions(dimensionsIn.width, dimensionsIn.height);
            dimensionsOut = getOutputDimensions(newImagesObj[file]);
            outImgPath = outImgDir + "/" + file;
            processImage(inpImgPath, outImgPath);
        }
    });
    console.log(newImagesObj);
    return newImagesObj;
}
function initFolders() {
    const mkdirp = require('mkdirp');
    let outImgDir = "";
    for (let profileName in sizeProfiles) {
        outImgDir = OutputFolder + profileName;
        mkdirp(outImgDir, function (err) {
            if (err)
                console.error(err);
            else {
                console.log('pow! created ', outImgDir);
            }
        });
    }
    //let profileValue = sizeProfiles[profileKey];
}
function processImage(inpImgPath, outImgPath) {
    const fs = require('fs');
    const resizeImg = require('resize-img');
    resizeImg(fs.readFileSync(inpImgPath), { width: 128, height: 128 }).then(buf => {
        fs.writeFileSync(outImgPath, buf);
    });
}
