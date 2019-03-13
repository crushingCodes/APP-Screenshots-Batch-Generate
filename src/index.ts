//import{OutputProfile} from "./output-profile";
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
let testInputProfile:SizeProfile={width:300,height:200};

console.log(getInputDimensions(testInputProfile));

function getInputDimensions(inputProfile:SizeProfile):Dimensions{
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions: Dimensions;

    if(inputProfile.width>=inputProfile.height){
        dimensions= {width:inputProfile.width,height:inputProfile.height,orientation:"landscape"};
    }else{
        dimensions= {width:inputProfile.width,height:inputProfile.height,orientation:"portrait"}
    }
return dimensions;
}
/*
var sizeOf = require('image-size');

sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
*/

const pkgDir = require('pkg-dir');
(async () => {
    const rootDir = await pkgDir("screensIn");
 
    console.log(rootDir);
    //=> '/Users/sindresorhus/foo'
})();