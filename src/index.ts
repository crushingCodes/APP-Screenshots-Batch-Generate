import * as _ from "lodash";
import { mkdir } from "fs";

//Config default locations
const OutputFolder = './screensOut/';
const InputFolder = './screensIn/';

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
    [fileName: string]: Dimensions;
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

function getInputDimensions(width: Dimension, height: Dimension): Dimensions {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions: Dimensions;
    if (width >= height) {
        dimensions = { width: width, height: height, orientation: "landscape" };
    } else {
        dimensions = { width: width, height: height, orientation: "portrait" }
    }
    return dimensions;
}
let newImagesObj: ImagesObject = {};

generateNewScreeshots();

function generateNewScreeshots() {

    const fs = require('fs');
    let sizeOf = require('image-size');
    let inpImgPath:FName = "";
    let dimensionsIn: ImageSize;

    //For each file found in input folder
    fs.readdirSync(InputFolder).forEach((fName: FName) => {
        inpImgPath  = InputFolder + fName;

        for (let profileSizeName in sizeProfiles) {

            dimensionsIn = sizeOf(inpImgPath);
            newImagesObj[fName] = getInputDimensions(dimensionsIn.width, dimensionsIn.height)
           
            processImage(fName, profileSizeName);
       
        }
    });
}

function processImage(fName:FName,profileSizeName:string) {
    const fs = require('fs-extra');    
    const resizeImg = require('resize-img');
    let inpImgPath :FName  = InputFolder + fName;

   let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[fName]);

    resizeImg(fs.readFileSync(inpImgPath), { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
       let outImgPath=OutputFolder+sizeProfiles[profileSizeName].platform+ "/" +profileSizeName;
fs.ensureDir(outImgPath, err => {
    if(err){
    console.log(err); 
    }
 let fileFullPath=outImgPath+"/"+fName;
        fs.writeFileSync(fileFullPath, buf);
    })

    });
}
