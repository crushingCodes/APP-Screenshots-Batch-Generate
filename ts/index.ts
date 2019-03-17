import * as _ from "lodash";

//Config default locations

type Platform = "android" | "ios";

const sizeProfiles: SizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
};

type Orientation = "portrait" | "landscape";
type Dimension = number;
type FName = string;
type FPath = string;
const configKeys= {inputTargetURL:"inputTargetURL",outputTargetURL:"outputTargetURL"}

interface Dimensions {
    height: Dimension,
    width: Dimension,
    orientation: Orientation
}

interface ProfileDimensions {
    longLength: Dimension,
    shortLength: Dimension,
}

interface ImageSize {
    width: Dimension,
    height: Dimension,
}

interface SizeProfile {
    dimensions: ProfileDimensions;
    platform: Platform;
}

interface SizeProfiles {
    [sizeName: string]: SizeProfile;
}
interface ImagesObject {
    [fileName: string]: { dimensions: Dimensions, fPath: FPath };
}

const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

//Global Variables
let outputFolder:string;
let inputFolder:string;
let newImagesObj: ImagesObject = {};

//Start

function initConfig(){
    //Set default folder locations
    conf.set(configKeys.inputTargetURL,'./screensIn/');
    conf.set(configKeys.outputTargetURL,'./screensOut/');
    console.log('Default config set');

}
function loadConfig(){
    if(conf.get(configKeys.inputTargetURL)==null || conf.get(configKeys.outputTargetURL)==null){
        initConfig();
    }else{
         outputFolder = conf.get(configKeys.outputTargetURL);
         inputFolder =conf.get(configKeys.inputTargetURL);
    }    
    console.log('Input Folder: ',inputFolder);
    console.log('Ouput Folder: ',outputFolder);

}



function getOutputDimensions(targetProfileName: string, dimensionsInp: Dimensions): Dimensions {
    let dimensionsOut: Dimensions;
    let tempProfile = sizeProfiles[targetProfileName];
    //Auto decide which dimensions to use based on input size
    if (dimensionsInp.orientation == "landscape") {
        dimensionsOut = {
            width: tempProfile.dimensions.longLength, height: tempProfile.dimensions.shortLength,
            orientation: dimensionsInp.orientation
        };
    } else {
        dimensionsOut = {
            width: tempProfile.dimensions.shortLength, height: tempProfile.dimensions.longLength,
            orientation: dimensionsInp.orientation
        };
    }

    return dimensionsOut;
}

function getInputDimensions(inpImgPath:FPath): Dimensions {
    //Give input dimensions and return dimensions with correct size and orientation
    let sizeOf = require('image-size');
    let dimensionsIn: ImageSize = sizeOf(inpImgPath);
    let dimensions: Dimensions;
    
    if (dimensionsIn.width >= dimensionsIn.height) {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "landscape" };
    } else {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "portrait" }
    }
    return dimensions;
}

generateNewScreeshots();
function generateNewScreeshots() {
    loadConfig();

    const isImage = require('is-image');

    const fs = require('fs');
    let inpImgPath: FName = "";
    console.log("Generate called for: ",inputFolder);

    //For each file found in input folder
    fs.readdirSync(inputFolder).forEach((fName: FName) => {
        inpImgPath = inputFolder + fName;
        console.log("Processing: ",inpImgPath)
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

function processImage(fName: FName, profileSizeName: string) {
    const fs = require('fs-extra');
    const resizeImg = require('resize-img');
    let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[fName].dimensions);

    resizeImg(fs.readFileSync(newImagesObj[fName].fPath),
        { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
            let outImgPath = outputFolder + sizeProfiles[profileSizeName].platform 
            + "/" + profileSizeName;
            fs.ensureDir(outImgPath, err => {
                if (err) {
                    console.log(err);
                }
                let fileFullPath = outImgPath + "/" + fName;
                fs.writeFileSync(fileFullPath, buf);
            })
        });
}
