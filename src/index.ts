import{OutputProfile} from "./output-profile";
import * as _ from "lodash";


type Platform = "android" | "ios";

interface SizeProfile {
    size1:number,
    size2:number,
    platform:Platform,
    //This will allow creation of new keys
    [key:string]:any,
}

let defaultProfile =new OutputProfile();
defaultProfile.height=200;
defaultProfile.width=100;
console.log(defaultProfile);



