//import{OutputProfile} from "./output-profile";
import{ImageSpecs} from "./Image-Specs";

import * as _ from "lodash";
import { OutputProfile } from "./output-profile";

type Platform = "android" | "ios";
type Orientation = "portrait" | "landscape";
type Dimension= number;
const OutputFolder= './screensOut/';
const InputFolder = './screensIn/';

interface Dimensions {
    height:Dimension,
    width:Dimension,
    orientation:Orientation
}

interface SizeProfile {
    length1:Dimension,
    length2:Dimension,

    //This will allow creation of new keys
    //[key:string]:any,
}

interface OutputProf{
  //  sizeName : string;
     dimensions : SizeProfile;
     platform : Platform;
    
}
interface SizeProfiles{
   [sizeName:string]: OutputProf
}

let sizeProfiles:SizeProfiles={
    "5.5": {dimensions:{length1:2208,length2:1242},platform:"ios" },
    "10.5": {dimensions:{length1:2224,length2:1668},platform:"ios" },
    "5.1": {dimensions:{length1:1280,length2:800},platform:"android" },
    "10": {dimensions:{length1:2560,length2:1700},platform:"android" },
  };





interface OutputProfiles{(sizeName:string):OutputProfile};

//let profiles={(name:"5.5inch"):{sizeName:"5.5inch",dimensions:{length1:1000,length2:2000},platform:"android"}};
type FileName=String;

interface ImageObject {fileName:FileName,dimensions:Dimensions};
//interface ImagesObject {fileName:FileName,imageObj:ImageObject};


//let testInputProfile:SizeProfile={width:300,height:200};

function getOutputDimensions(){

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

const mkdirp = require('mkdirp');
outImgDir=OutputFolder+"size1/";    
mkdirp(outImgDir, function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});

let newImagesObj={};

fs.readdirSync(InputFolder).forEach(file => {

  inpImgPath=InputFolder+file;
   dimensionsIn = sizeOf(inpImgPath);
    let newImageObj={};
    newImageObj={fileName:file,dimensions:getInputDimensions(dimensionsIn.width, dimensionsIn.height)};
    newImagesObj[file]=newImageObj;
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
