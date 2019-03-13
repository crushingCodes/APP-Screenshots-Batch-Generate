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
    size1:number,
    size2:number,
    //This will allow creation of new keys
    //[key:string]:any,
}
interface OutputProfile{
    dimensions:Dimensions,
    platform:Platform
}
let testInputProfile:SizeProfile={size1:100,size2:200};

console.log(getInputDimensions(testInputProfile));

function getInputDimensions(inputProfile:SizeProfile):Dimensions{
    //Give input dimensions and return dimensions with correct size and orientation
    var dimensions: Dimensions;

    if(inputProfile.size1>=inputProfile.size2){
        dimensions= {width:inputProfile.size1,height:inputProfile.size2,orientation:"portrait"};
    }else{
        dimensions= {width:inputProfile.size1,height:inputProfile.size2,orientation:"landscape"}
    }
return dimensions;
}

