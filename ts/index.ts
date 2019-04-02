//Imports
import * as _ from "lodash";
const validPath = require('valid-path');
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const isImage = require('is-image');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const sizeOf = require('image-size');
const unixify = require('unixify');
type Platform = "android" | "ios";
type Orientation = "portrait" | "landscape";
type Dimension = number;
type FName = string;
type FPath = string;
type ConfigKey = "inputTargetURL" | "outputTargetURL";

const sizeProfiles: SizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "10.5": { dimensions: { longLength: 2224, shortLength: 1668 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 800 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1700 }, platform: "android" },
};
const configKeys = { inputTargetURL: "inputTargetURL", outputTargetURL: "outputTargetURL" }

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

//Global Variables
let outputFolder: string;
let inputFolder: string;
let newImagesObj: ImagesObject = {};

function initConfig() {
    //Init folder locations
    conf.set(configKeys.inputTargetURL, '');
    conf.set(configKeys.outputTargetURL, '');
    if(!inputFolder){
        inputFolder="";
    }
    if(!outputFolder){
        outputFolder="";
    }

}
function loadConfig() {

    if (conf.get(configKeys.inputTargetURL) == null || conf.get(configKeys.outputTargetURL) == null) {
        initConfig();
    } else {
        outputFolder = conf.get(configKeys.outputTargetURL);
        inputFolder = conf.get(configKeys.inputTargetURL);
    }
    //Check for no path

    if(checkPath("input path",inputFolder) && 
    checkPath("output path",outputFolder)){
        return true;
    }else{
        return false;
    }
}

function checkPath(pathName:string,fPath:FPath){
    let validatedPath;
    if (fPath == "") {
        folderError(pathName);
        return false;
    }
    validatedPath = validPath(fPath);
    if (validatedPath) {
        // if(getFolderPath(getNormalizedPath(validatedPath))){
            return true;
        // }else{
        //     return false;
        // }
    } else {
        console.error(validPath);
        return false;
    }
}

function getNormalizedPath(fPath:string):string{
    //let normalPath = upath.normalizeSafe(fPath);
    let normalPath = unixify(fPath ,false);
    // if (normalPath[normalPath.length - 1] != '/') {
    //     console.error("Error: The path entered for ", fPath, " was not a directory.");
    // }
    return normalPath;
}
function getFolderPath(fPath:string):string{
    let folderPath="";
    if (fPath[fPath.length - 1] == '/') {
        folderPath=fPath;
        
    }
    else if (fPath[fPath.length - 1] == '"') {
        //Fix the folder path for WINDOWS file path
        folderPath= fPath.replace('"',"/");
        console.log("NOTE: The path entered for ", fPath, " did not have trailing /. Auto added '/' to prevent errors!");
    }else{
        console.log("Error: The path entered for ", fPath, " was not a directory.");
    }

    return folderPath;
}
function folderError(folderName:FName){
    console.error("Error:",folderName," not configured! Please type -h to find instructions.");
}

function updateConfigByConfigKey(configKey, inputPath: FPath) {
    if(checkPath(configKey,inputPath)){
    //Add normalizer to clean path string on entry
    conf.set(configKey, getFolderPath(getNormalizedPath(inputPath)));
    }
}
var updateConfigInput = function (inputPath: FPath) {
        //route the function to the correct configKey
    updateConfigByConfigKey(configKeys.inputTargetURL, inputPath)
}

var updateConfigOutput = function (inputPath: FPath) {
        //route the function to the correct configKey
    updateConfigByConfigKey(configKeys.outputTargetURL, inputPath)
}

var showConfigPrintout = function () {
    outputFolder = conf.get(configKeys.outputTargetURL);
    inputFolder = conf.get(configKeys.inputTargetURL);
    console.log();
    console.log('Configuration');
    console.log();
    if(!inputFolder || inputFolder==""){
        console.log('Input Folder:  Not currently configured!');
    }else{
        console.log('Input Folder: ', inputFolder);
    }
    if(!outputFolder || outputFolder==""){
        console.log('Ouput Folder:  Not currently configured!');
    }else{
        console.log('Ouput Folder: ', outputFolder);
    }

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

function getInputDimensions(inpImgPath: FPath): Dimensions {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensionsIn: ImageSize = sizeOf(inpImgPath);
    let dimensions: Dimensions;

    if (dimensionsIn.width >= dimensionsIn.height) {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "landscape" };
    } else {
        dimensions = { width: dimensionsIn.width, height: dimensionsIn.height, orientation: "portrait" }
    }
    return dimensions;
}

var generateNewScreeshots = function () {

    if(loadConfig()){

    let inpImgPath: FName = "";
    let count=0;
    console.log("Generate called for: ", inputFolder);

    //If no input folder found create it
    fs.ensureDir(inputFolder, err => {

    //For each file found in input folder
    fs.readdirSync(inputFolder).forEach((fName: FName) => {
        inpImgPath = inputFolder + fName;
        if (isImage(inpImgPath)) {
            console.log("Processing: ", inpImgPath);
            count+=1;
            for (let profileSizeName in sizeProfiles) {

                newImagesObj[fName] = {
                    dimensions: getInputDimensions(inpImgPath), fPath: inpImgPath
                };
                processImage(fName, profileSizeName);
            }
        }
    });
    console.log("Generated Screenshots for",count,"picture/s stored in",outputFolder);
    })
}
}

function processImage(fName: FName, profileSizeName: string) {

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

//Exports Section
exports.updateConfigInput = updateConfigInput;
exports.updateConfigOutput = updateConfigOutput;
exports.showConfigPrintout = showConfigPrintout;
exports.generateNewScreeshots = generateNewScreeshots;

