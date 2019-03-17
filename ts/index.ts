import * as _ from "lodash";

//Config default locations
let OutputFolder:string;
let InputFolder:string;

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

let config={
    keyvalue:[]
};
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

loadConfig();

function initConfig(){
    conf.set('inputTargetURL','../screensOut/');
    conf.set('outputTargetURL','../screensIn/');
    console.log('Config Init');

}
function loadConfig(){
    initConfig();

    if(conf.get('inputTargetURL')==null || conf.get('outputTargetURL')==null){
        initConfig();
    }else{
         OutputFolder = conf.get('inputTargetURL');
         InputFolder =conf.get('outputTargetURL');
    }    
    console.log('Input Folder: ',InputFolder);
    console.log('Ouput Folder: ',OutputFolder);

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
let newImagesObj: ImagesObject = {};

//generateNewScreeshots();

function generateNewScreeshots() {

    const fs = require('fs');
    let inpImgPath: FName = "";

    //For each file found in input folder
    fs.readdirSync(InputFolder).forEach((fName: FName) => {
        inpImgPath = InputFolder + fName;

        for (let profileSizeName in sizeProfiles) {

            newImagesObj[fName] = {
                dimensions: getInputDimensions(inpImgPath), fPath: inpImgPath
            };

            processImage(fName, profileSizeName);

        }
    });
}

function processImage(fName: FName, profileSizeName: string) {
    const fs = require('fs-extra');
    const resizeImg = require('resize-img');
    let dimensionsOut = getOutputDimensions(profileSizeName, newImagesObj[fName].dimensions);

    resizeImg(fs.readFileSync(newImagesObj[fName].fPath),
        { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
            let outImgPath = OutputFolder + sizeProfiles[profileSizeName].platform 
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
