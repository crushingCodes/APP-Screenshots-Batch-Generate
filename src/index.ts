//import{OutputProfile} from "./output-profile";
import{ImageSpecs} from "./Image-Specs";

import * as _ from "lodash";

type Platform = "android" | "ios";
type Orientation = "portrait" | "landscape";
type Dimension= number;

interface Dimensions {
    height:Dimension,
    width:Dimension,
    orientation:Orientation
}

interface SizeProfile {
    width:Dimension,
    height:Dimension,
    //This will allow creation of new keys
    //[key:string]:any,
}
interface OutputProfile{
    dimensions:Dimensions,
    platform:Platform
}
type FileName=String;

interface ImageObject {fileName:FileName,dimensions:Dimensions};
//interface ImagesObject {fileName:FileName,imageObj:ImageObject};


let testInputProfile:SizeProfile={width:300,height:200};

//console.log(getInputDimensions(testInputProfile));

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
/*
var sizeOf = require('image-size');

sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
*/
getImageInpObjects();

function getImageInpObjects(){


const inputFolder = './screensIn/';
const fs = require('fs');
let sizeOf = require('image-size');
let imgPath="";

//let newImageObj:ImageObject;
let newImagesObj={};

fs.readdirSync(inputFolder).forEach(file => {


  imgPath=inputFolder+file;
  sizeOf(imgPath, function (err, dimensionsIn) {
    //console.log(file);

    //console.log(dimensionsIn.width, dimensionsIn.height);
    let newImageObj={};
    newImageObj={fileName:file,dimensions:getInputDimensions(dimensionsIn.width, dimensionsIn.height)};
    newImagesObj[file]=newImageObj;
    
    console.log(newImageObj);

  });

});
console.log(newImagesObj);

return newImagesObj;
}
