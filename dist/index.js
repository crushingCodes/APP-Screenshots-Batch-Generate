;
//interface ImagesObject {fileName:FileName,imageObj:ImageObject};
let testInputProfile = { width: 300, height: 200 };
//console.log(getInputDimensions(testInputProfile));
function getInputDimensions(width, height) {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions;
    if (width >= height) {
        dimensions = { width: width, height: height, orientation: "landscape" };
    }
    else {
        dimensions = { width: width, height: height, orientation: "portrait" };
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
function getImageInpObjects() {
    const inputFolder = './screensIn/';
    const fs = require('fs');
    let sizeOf = require('image-size');
    let imgPath = "";
    //let newImageObj:ImageObject;
    let newImagesObj = {};
    fs.readdirSync(inputFolder).forEach(file => {
        imgPath = inputFolder + file;
        sizeOf(imgPath, function (err, dimensionsIn) {
            //console.log(file);
            //console.log(dimensionsIn.width, dimensionsIn.height);
            let newImageObj = {};
            newImageObj = { fileName: file, dimensions: getInputDimensions(dimensionsIn.width, dimensionsIn.height) };
            newImagesObj[file] = newImageObj;
            console.log(newImageObj);
        });
    });
    console.log(newImagesObj);
    return newImagesObj;
}
