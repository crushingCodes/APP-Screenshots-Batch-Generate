//import{OutputProfile} from "./output-profile";
//import{ImageSpecs} from "./Image-Specs";

import * as _ from "lodash";
import { OutputProfile } from "./output-profile";

//Config default locations
const OutputFolder= './screensOut/';
const InputFolder = './screensIn/';

const sizeProfiles:SizeProfiles={
    "5.5": {dimensions:{longLength:2208,shortLength:1242},platform:"ios" },
    "10.5": {dimensions:{longLength:2224,shortLength:1668},platform:"ios" },
    "5.1": {dimensions:{longLength:1280,shortLength:800},platform:"android" },
    "10": {dimensions:{longLength:2560,shortLength:1700},platform:"android" },
  };

type Platform = "android" | "ios";
type Orientation = "portrait" | "landscape";
type Dimension= number;
type FileName=String;

interface Dimensions {
    height:Dimension,
    width:Dimension,
    orientation:Orientation
}

interface SizeProfile {
    longLength:Dimension,
    shortLength:Dimension,

    //This will allow creation of new keys
    //[key:string]:any,
}

interface OutputProf{
     dimensions : SizeProfile;
     platform : Platform;
}
interface SizeProfiles{
   [sizeName:string]: OutputProf;
}
interface ImagesObject{
    [fileName:string]:Dimensions;
}


//interface OutputProfiles{(sizeName:string):OutputProfile};
//interface ImageObject {fileName:FileName,dimensions:Dimensions};

  //Global Vars
  let newImagesObj:ImagesObject;




function getOutputDimensions(dimensionsInp:Dimensions):Dimensions{
    let dimensionsOut:Dimensions;
    let tempProfile=sizeProfiles["5.5"];
    //Auto decide which dimensions to use based on input size
    if(dimensionsInp.orientation=="landscape"){
        dimensionsOut.width=tempProfile.dimensions.longLength;
        dimensionsOut.height=tempProfile.dimensions.shortLength;
        dimensionsOut.orientation=dimensionsInp.orientation;
    }else{
        dimensionsOut.width=tempProfile.dimensions.shortLength;
        dimensionsOut.height=tempProfile.dimensions.longLength;
        dimensionsOut.orientation=dimensionsInp.orientation;
    }

    return dimensionsOut;
}

function getInputDimensions(width:Dimension,height:Dimension):Dimensions{
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions: Dimensions;
    if(width>=height){
        dimensions= {width:width,height:height,orientation:"landscape"};
    }else{
        dimensions= {width:width,height:height,orientation:"portrait"}
    }
return dimensions;
}

getImageInpObjects();

function getImageInpObjects(){

const fs = require('fs');
const resizeImg = require('resize-img');
let sizeOf = require('image-size');
let inpImgPath="";
let outImgDir="";
let outImgPath="";
let dimensionsIn;
let dimensionsOut;

const mkdirp = require('mkdirp');
outImgDir=OutputFolder+"size1/";    
mkdirp(outImgDir, function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});


fs.readdirSync(InputFolder).forEach(file => {

  inpImgPath=InputFolder+file;
   dimensionsIn = sizeOf(inpImgPath);
   dimensionsOut = getOutputDimensions(newImagesObj[file]);


    //let newImageObj={};
    //newImageObj={fileName:file,dimensions:getInputDimensions(dimensionsIn.width, dimensionsIn.height)};
    //newImagesObj[file]=newImageObj;
    newImagesObj[file]=getInputDimensions(dimensionsIn.width, dimensionsIn.height);
    outImgPath=outImgDir+file;
    processImage(inpImgPath,outImgPath);
});
console.log(newImagesObj);

return newImagesObj;
}

function processImage(inpImgPath:string,outImgPath:string){
    const fs = require('fs');
const resizeImg = require('resize-img');
    resizeImg(fs.readFileSync(inpImgPath), {width: 128, height: 128}).then(buf => {
        fs.writeFileSync(outImgPath, buf);
    });
}
