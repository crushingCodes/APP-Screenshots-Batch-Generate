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
const { red, yellow, bold } = require('kleur');

//Const Variables
const android: Platform = 'android';
const ios: Platform = 'ios'
const sizeProfiles: SizeProfiles = {
    "5.5": { dimensions: { longLength: 2208, shortLength: 1242 }, platform: "ios" },
    "12.9": { dimensions: { longLength: 2732, shortLength: 2048 }, platform: "ios" },
    "5.1": { dimensions: { longLength: 1280, shortLength: 720 }, platform: "android" },
    "10": { dimensions: { longLength: 2560, shortLength: 1440 }, platform: "android" },
};
const configKeys = { inputTargetURL: "inputTargetURL", outputTargetURL: "outputTargetURL" }

class ScreenshotGenerator {

    //Class Variables
    outputFolder: string;
    inputFolder: string;
    newImagesObj: ImagesObject = {};
    constructor() {
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
    loadConfig(): boolean {
        //Check for saved configuration
        if (conf.get(configKeys.inputTargetURL) == null || conf.get(configKeys.outputTargetURL) == null) {
            this.initConfig();
        } else {
            this.outputFolder = conf.get(configKeys.outputTargetURL);
            this.inputFolder = conf.get(configKeys.inputTargetURL);
        }

        //Check for no path
        if (this.checkPath("input path", this.inputFolder) &&
            this.checkPath("output path", this.outputFolder)) {
            return true;
        } else {
            return false;
        }
    }

    checkPath(pathName: string, fPath: FPath): boolean {
        //Check for a valid path
        let validatedPath;
        if (fPath == "") {
            this.folderError(pathName);
            return false;
        }
        validatedPath = validPath(fPath);
        if (validatedPath) {
            return true;
        } else {
            console.error(bold().red("Error:"), validatedPath, " was not a valid path;");
            return false;
        }
    }

    getNormalizedPath(fPath: string): string {
        //change path to unix friendly
        let normalPath = unixify(fPath, false);
        return normalPath;
    }
    getFolderPath(fPath: string): string {
        //Get a valid folder path or return empty string
        let folderPath = "";
        if (fPath[fPath.length - 1] == '/') {
            folderPath = fPath;
        }
        else if (fPath[fPath.length - 1] == '"') {
            //Fix the folder path for WINDOWS file path
            folderPath = fPath.replace('"', "/");
            console.log(yellow("NOTE: The path entered for "), fPath, yellow(" did not have trailing /. Auto added '/' to prevent errors!"));
        } else {
            console.error(bold().red("Error:"), " The path entered for ", fPath, " was not a directory.");
        }
        return folderPath;
    }

    folderError(folderName: FName) {
        console.error(bold().red("Error:"), folderName, " not configured! Please type -h to find instructions.");
    }

    updateConfigByConfigKey(configKey, inputPath: FPath) {
        if (this.checkPath(configKey, inputPath)) {
            //Add normalizer to clean path string on entry
            conf.set(configKey, this.getFolderPath(this.getNormalizedPath(inputPath)));
        }
    }

    updateConfigInput = function (inputPath: FPath) {
        //route the function to the correct configKey
        this.updateConfigByConfigKey(configKeys.inputTargetURL, inputPath)
    }

    updateConfigOutput = function (inputPath: FPath) {
        //route the function to the correct configKey
        this.updateConfigByConfigKey(configKeys.outputTargetURL, inputPath)
    }

    showConfigPrintout = function () {
        this.outputFolder = conf.get(configKeys.outputTargetURL);
        this.inputFolder = conf.get(configKeys.inputTargetURL);
        console.log();
        console.log(bold().blue("App Generate Screenshots: "), bold("Configuration"));
        console.log();
        if (!this.inputFolder || this.inputFolder == "") {
            console.log('Input Folder:  ', red('Not currently configured!'));
        } else {
            console.log('Input Folder: ', this.inputFolder);
        }
        if (!this.outputFolder || this.outputFolder == "") {
            console.log('Ouput Folder:  ', red('Not currently configured!'));
        } else {
            console.log('Ouput Folder: ', this.outputFolder);
        }
        console.log();
    }

    getOutputDimensions(targetProfileName: string, dimensionsInp: Dimensions): Dimensions {
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

    getInputDimensions(inpImgPath: FPath): Dimensions {
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

    async getUserAnswer(question: string) {
        const prompts = require('prompts');

        const response = await prompts({
            type: 'confirm',
            name: 'value',
            message: question,
            initial: true
        })
        return response.value;
    }

    generateNewScreeshots = async function (platform: Platform) {
        //Check for loaded config and user confirmation
        if (this.loadConfig()) {
            if (await this.getUserAnswer("Do you want to continue and override files in " + this.outputFolder)) {

                let inpImgPath: FName = "";
                let count = 0;
                console.log("Generate called for: ", this.inputFolder);

                //If no input folder found create it
                fs.ensureDir(this.inputFolder, err => {

                    //For each file found in input folder
                    fs.readdirSync(this.inputFolder).forEach((fName: FName) => {
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
                })
            }
        }
    }

    processImage(fName: FName, profileSizeName: string) {

        let dimensionsOut = this.getOutputDimensions(profileSizeName, this.newImagesObj[fName].dimensions);

        resizeImg(fs.readFileSync(this.newImagesObj[fName].fPath),
            { width: dimensionsOut.width, height: dimensionsOut.height }).then(buf => {
                let outImgPath = this.outputFolder + sizeProfiles[profileSizeName].platform
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
}

export { ScreenshotGenerator };
