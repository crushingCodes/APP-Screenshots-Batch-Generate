"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validPath = require('valid-path');
const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const isImage = require('is-image');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const sizeOf = require('image-size');
const unixify = require('unixify');
const { red, yellow, bold } = require('kleur');
//Const Variables
const android = 'android';
const ios = 'ios';
const sizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "12.9": { dimensions: { longLength: 2732, shortLength: 2048 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 720 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1440 }, platform: "android" },
};
const configKeys = { inputTargetURL: "inputTargetURL", outputTargetURL: "outputTargetURL" };
class ScreenshotGenerator {
    constructor() {
        this.newImagesObj = {};
        this.updateConfigInput = function (inputPath) {
            //route the function to the correct configKey
            this.updateConfigByConfigKey(configKeys.inputTargetURL, inputPath);
        };
        this.updateConfigOutput = function (inputPath) {
            //route the function to the correct configKey
            this.updateConfigByConfigKey(configKeys.outputTargetURL, inputPath);
        };
        this.showConfigPrintout = function () {
            this.outputFolder = conf.get(configKeys.outputTargetURL);
            this.inputFolder = conf.get(configKeys.inputTargetURL);
            console.log();
            console.log(bold().blue("App Generate Screenshots: "), bold("Configuration"));
            console.log();
            if (!this.inputFolder || this.inputFolder == "") {
                console.log('Input Folder:  ', red('Not currently configured!'));
            }
            else {
                console.log('Input Folder: ', this.inputFolder);
            }
            if (!this.outputFolder || this.outputFolder == "") {
                console.log('Ouput Folder:  ', red('Not currently configured!'));
            }
            else {
                console.log('Ouput Folder: ', this.outputFolder);
            }
            console.log();
        };
        this.generateNewScreeshots = function (platform) {
            return __awaiter(this, void 0, void 0, function* () {
                //Check for loaded config and user confirmation
                if (this.loadConfig()) {
                    if (yield this.getUserAnswer("Do you want to continue and override files in " + this.outputFolder)) {
                        let inpImgPath = "";
                        let count = 0;
                        console.log("Generate called for: ", this.inputFolder);
                        //If no input folder found create it
                        fs.ensureDir(this.inputFolder, err => {
                            //For each file found in input folder
                            fs.readdirSync(this.inputFolder).forEach((fName) => {
                                inpImgPath = this.inputFolder + fName;
                                if (isImage(inpImgPath)) {
                                    console.log("Processing: ", inpImgPath);
                                    count += 1;
                                    for (let profileSizeName in sizeProfiles) {
                                        if (sizeProfiles[profileSizeName].platform == platform) {
                                            this.newImagesObj[fName] = {
                                                dimensions: this.getInputDimensions(inpImgPath), fPath: inpImgPath
                                            };
                                            this.processImage(fName, profileSizeName);
                                        }
                                    }
                                }
                            });
                            console.log("Generated Screenshots for", count, "picture/s stored in", this.outputFolder);
                        });
                    }
                }
            });
        };
        //Constructor
    }
    initConfig() {
        //Init folder locations
        conf.set(configKeys.inputTargetURL, '');
        conf.set(configKeys.outputTargetURL, '');
        if (!this.inputFolder) {
            this.inputFolder = "";
        }
        if (!this.outputFolder) {
            this.outputFolder = "";
        }
    }
    loadConfig() {
        //Check for saved configuration
        if (conf.get(configKeys.inputTargetURL) == null || conf.get(configKeys.outputTargetURL) == null) {
            this.initConfig();
        }
        else {
            this.outputFolder = conf.get(configKeys.outputTargetURL);
            this.inputFolder = conf.get(configKeys.inputTargetURL);
        }
        //Check for no path
        if (this.checkPath("input path", this.inputFolder) &&
            this.checkPath("output path", this.outputFolder)) {
            return true;
        }
        else {
            return false;
        }
    }
    checkPath(pathName, fPath) {
        //Check for a valid path
        let validatedPath;
        if (fPath == "") {
            this.folderError(pathName);
            return false;
        }
        validatedPath = validPath(fPath);
        if (validatedPath) {
            return true;
        }
        else {
            console.error(bold().red("Error:"), validatedPath, " was not a valid path;");
            return false;
        }
    }
    getNormalizedPath(fPath) {
        //change path to unix friendly
        let normalPath = unixify(fPath, false);
        return normalPath;
    }
    getFolderPath(fPath) {
        //Get a valid folder path or return empty string
        let folderPath = "";
        if (fPath[fPath.length - 1] == '/') {
            folderPath = fPath;
        }
        else if (fPath[fPath.length - 1] == '"') {
            //Fix the folder path for WINDOWS file path
            folderPath = fPath.replace('"', "/");
            console.log(yellow("NOTE: The path entered for "), fPath, yellow(" did not have trailing /. Auto added '/' to prevent errors!"));
        }
        else {
            console.error(bold().red("Error:"), " The path entered for ", fPath, " was not a directory.");
        }
        return folderPath;
    }
    folderError(folderName) {
        console.error(bold().red("Error:"), folderName, " not configured! Please type -h to find instructions.");
    }
    updateConfigByConfigKey(configKey, inputPath) {
        if (this.checkPath(configKey, inputPath)) {
            //Add normalizer to clean path string on entry
            conf.set(configKey, this.getFolderPath(this.getNormalizedPath(inputPath)));
        }
    }
    getOutputDimensions(targetProfileName, dimensionsInp) {
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
    getInputDimensions(inpImgPath) {
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
    getUserAnswer(question) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompts = require('prompts');
            const response = yield prompts({
                type: 'confirm',
                name: 'value',
                message: question,
                initial: true
            });
            return response.value;
        });
    }
    processImage(fName, profileSizeName) {
        let dimensionsOut = this.getOutputDimensions(profileSizeName, this.newImagesObj[fName].dimensions);
        resizeImg(fs.readFileSync(this.newImagesObj[fName].fPath), { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
            let outImgPath = this.outputFolder + sizeProfiles[profileSizeName].platform
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
}
exports.ScreenshotGenerator = ScreenshotGenerator;
